---
title: Modulo URL - Documentazione Node.js
description: Il modulo URL in Node.js fornisce utilità per la risoluzione e l'analisi delle URL. Supporta lo standard WHATWG URL e l'API urlObject legacy, offrendo metodi per lavorare con URL in entrambi i formati.
head:
  - - meta
    - name: og:title
      content: Modulo URL - Documentazione Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Il modulo URL in Node.js fornisce utilità per la risoluzione e l'analisi delle URL. Supporta lo standard WHATWG URL e l'API urlObject legacy, offrendo metodi per lavorare con URL in entrambi i formati.
  - - meta
    - name: twitter:title
      content: Modulo URL - Documentazione Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Il modulo URL in Node.js fornisce utilità per la risoluzione e l'analisi delle URL. Supporta lo standard WHATWG URL e l'API urlObject legacy, offrendo metodi per lavorare con URL in entrambi i formati.
---


# URL {#url}

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile
:::

**Codice sorgente:** [lib/url.js](https://github.com/nodejs/node/blob/v23.5.0/lib/url.js)

Il modulo `node:url` fornisce utilità per la risoluzione e l'analisi degli URL. È possibile accedervi usando:

::: code-group
```js [ESM]
import url from 'node:url';
```

```js [CJS]
const url = require('node:url');
```
:::

## Stringhe URL e oggetti URL {#url-strings-and-url-objects}

Una stringa URL è una stringa strutturata contenente diversi componenti significativi. Quando viene analizzata, viene restituito un oggetto URL contenente proprietà per ciascuno di questi componenti.

Il modulo `node:url` fornisce due API per lavorare con gli URL: un'API legacy specifica di Node.js e una nuova API che implementa lo stesso [Standard URL WHATWG](https://url.spec.whatwg.org/) utilizzato dai browser web.

Di seguito è riportato un confronto tra le API WHATWG e legacy. Sopra l'URL `'https://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash'`, vengono mostrate le proprietà di un oggetto restituito dalla legacy `url.parse()`. Sotto sono riportate le proprietà di un oggetto `URL` WHATWG.

La proprietà `origin` dell'URL WHATWG include `protocol` e `host`, ma non `username` o `password`.

```text [TEXT]
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                              href                                              │
├──────────┬──┬─────────────────────┬────────────────────────┬───────────────────────────┬───────┤
│ protocol │  │        auth         │          host          │           path            │ hash  │
│          │  │                     ├─────────────────┬──────┼──────────┬────────────────┤       │
│          │  │                     │    hostname     │ port │ pathname │     search     │       │
│          │  │                     │                 │      │          ├─┬──────────────┤       │
│          │  │                     │                 │      │          │ │    query     │       │
"  https:   //    user   :   pass   @ sub.example.com : 8080   /p/a/t/h  ?  query=string   #hash "
│          │  │          │          │    hostname     │ port │          │                │       │
│          │  │          │          ├─────────────────┴──────┤          │                │       │
│ protocol │  │ username │ password │          host          │          │                │       │
├──────────┴──┼──────────┴──────────┼────────────────────────┤          │                │       │
│   origin    │                     │         origin         │ pathname │     search     │ hash  │
├─────────────┴─────────────────────┴────────────────────────┴──────────┴────────────────┴───────┤
│                                              href                                              │
└────────────────────────────────────────────────────────────────────────────────────────────────┘
(Tutti gli spazi nella riga "" devono essere ignorati. Sono puramente per la formattazione.)
```
Analisi della stringa URL utilizzando l'API WHATWG:

```js [ESM]
const myURL =
  new URL('https://user::8080/p/a/t/h?query=string#hash');
```
Analisi della stringa URL utilizzando l'API legacy:

::: code-group
```js [ESM]
import url from 'node:url';
const myURL =
  url.parse('https://user::8080/p/a/t/h?query=string#hash');
```

```js [CJS]
const url = require('node:url');
const myURL =
  url.parse('https://user::8080/p/a/t/h?query=string#hash');
```
:::


### Costruzione di un URL da parti componenti e ottenimento della stringa costruita {#constructing-a-url-from-component-parts-and-getting-the-constructed-string}

È possibile costruire un URL WHATWG da parti componenti usando sia i setter di proprietà sia una stringa letterale template:

```js [ESM]
const myURL = new URL('https://example.org');
myURL.pathname = '/a/b/c';
myURL.search = '?d=e';
myURL.hash = '#fgh';
```
```js [ESM]
const pathname = '/a/b/c';
const search = '?d=e';
const hash = '#fgh';
const myURL = new URL(`https://example.org${pathname}${search}${hash}`);
```
Per ottenere la stringa URL costruita, usa l'accessorio di proprietà `href`:

```js [ESM]
console.log(myURL.href);
```
## L'API URL WHATWG {#the-whatwg-url-api}

### Classe: `URL` {#class-url}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.0.0 | La classe è ora disponibile sull'oggetto globale. |
| v7.0.0, v6.13.0 | Aggiunto in: v7.0.0, v6.13.0 |
:::

Classe `URL` compatibile con il browser, implementata seguendo lo Standard URL WHATWG. [Esempi di URL analizzati](https://url.spec.whatwg.org/#example-url-parsing) possono essere trovati nello stesso Standard. La classe `URL` è disponibile anche sull'oggetto globale.

In conformità con le convenzioni del browser, tutte le proprietà degli oggetti `URL` sono implementate come getter e setter sul prototipo della classe, piuttosto che come proprietà dati sull'oggetto stesso. Pertanto, a differenza degli [`urlObject` legacy](/it/nodejs/api/url#legacy-urlobject), l'uso della parola chiave `delete` su qualsiasi proprietà degli oggetti `URL` (ad es. `delete myURL.protocol`, `delete myURL.pathname`, ecc.) non ha alcun effetto ma restituirà comunque `true`.

#### `new URL(input[, base])` {#new-urlinput-base}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v20.0.0, v18.17.0 | Il requisito ICU è stato rimosso. |
:::

- `input` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'URL di input assoluto o relativo da analizzare. Se `input` è relativo, allora `base` è obbligatorio. Se `input` è assoluto, la `base` viene ignorata. Se `input` non è una stringa, viene prima [convertito in una stringa](https://tc39.es/ecma262/#sec-tostring).
- `base` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'URL di base rispetto al quale risolvere se l'`input` non è assoluto. Se `base` non è una stringa, viene prima [convertito in una stringa](https://tc39.es/ecma262/#sec-tostring).

Crea un nuovo oggetto `URL` analizzando l'`input` rispetto alla `base`. Se `base` viene passato come una stringa, verrà analizzato in modo equivalente a `new URL(base)`.

```js [ESM]
const myURL = new URL('/foo', 'https://example.org/');
// https://example.org/foo
```
Il costruttore URL è accessibile come proprietà sull'oggetto globale. Può anche essere importato dal modulo url integrato:



::: code-group
```js [ESM]
import { URL } from 'node:url';
console.log(URL === globalThis.URL); // Stampa 'true'.
```

```js [CJS]
console.log(URL === require('node:url').URL); // Stampa 'true'.
```
:::

Verrà generato un `TypeError` se l'`input` o la `base` non sono URL validi. Si noti che verrà fatto uno sforzo per forzare i valori forniti in stringhe. Per esempio:

```js [ESM]
const myURL = new URL({ toString: () => 'https://example.org/' });
// https://example.org/
```
I caratteri Unicode che appaiono all'interno del nome host dell'`input` verranno automaticamente convertiti in ASCII utilizzando l'algoritmo [Punycode](https://tools.ietf.org/html/rfc5891#section-4.4).

```js [ESM]
const myURL = new URL('https://測試');
// https://xn--g6w251d/
```
Nei casi in cui non è noto in anticipo se l'`input` è un URL assoluto e viene fornita una `base`, si consiglia di convalidare che l'`origin` dell'oggetto `URL` sia quella prevista.

```js [ESM]
let myURL = new URL('http://Example.com/', 'https://example.org/');
// http://example.com/

myURL = new URL('https://Example.com/', 'https://example.org/');
// https://example.com/

myURL = new URL('foo://Example.com/', 'https://example.org/');
// foo://Example.com/

myURL = new URL('http:Example.com/', 'https://example.org/');
// http://example.com/

myURL = new URL('https:Example.com/', 'https://example.org/');
// https://example.org/Example.com/

myURL = new URL('foo:Example.com/', 'https://example.org/');
// foo:Example.com/
```

#### `url.hash` {#urlhash}

- [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Ottiene e imposta la porzione di frammento dell'URL.

```js [ESM]
const myURL = new URL('https://example.org/foo#bar');
console.log(myURL.hash);
// Stampa #bar

myURL.hash = 'baz';
console.log(myURL.href);
// Stampa https://example.org/foo#baz
```
I caratteri URL non validi inclusi nel valore assegnato alla proprietà `hash` sono [codificati in percentuale](/it/nodejs/api/url#percent-encoding-in-urls). La selezione dei caratteri da codificare in percentuale può variare leggermente da ciò che i metodi [`url.parse()`](/it/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) e [`url.format()`](/it/nodejs/api/url#urlformaturlobject) produrrebbero.

#### `url.host` {#urlhost}

- [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Ottiene e imposta la porzione host dell'URL.

```js [ESM]
const myURL = new URL('https://example.org:81/foo');
console.log(myURL.host);
// Stampa example.org:81

myURL.host = 'example.com:82';
console.log(myURL.href);
// Stampa https://example.com:82/foo
```
I valori host non validi assegnati alla proprietà `host` vengono ignorati.

#### `url.hostname` {#urlhostname}

- [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Ottiene e imposta la porzione del nome host dell'URL. La differenza fondamentale tra `url.host` e `url.hostname` è che `url.hostname` *non* include la porta.

```js [ESM]
const myURL = new URL('https://example.org:81/foo');
console.log(myURL.hostname);
// Stampa example.org

// L'impostazione del nome host non modifica la porta
myURL.hostname = 'example.com';
console.log(myURL.href);
// Stampa https://example.com:81/foo

// Utilizzare myURL.host per modificare il nome host e la porta
myURL.host = 'example.org:82';
console.log(myURL.href);
// Stampa https://example.org:82/foo
```
I valori del nome host non validi assegnati alla proprietà `hostname` vengono ignorati.

#### `url.href` {#urlhref}

- [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Ottiene e imposta l'URL serializzato.

```js [ESM]
const myURL = new URL('https://example.org/foo');
console.log(myURL.href);
// Stampa https://example.org/foo

myURL.href = 'https://example.com/bar';
console.log(myURL.href);
// Stampa https://example.com/bar
```
Ottenere il valore della proprietà `href` equivale a chiamare [`url.toString()`](/it/nodejs/api/url#urltostring).

Impostare il valore di questa proprietà su un nuovo valore equivale a creare un nuovo oggetto `URL` utilizzando [`new URL(value)`](/it/nodejs/api/url#new-urlinput-base). Ciascuna delle proprietà dell'oggetto `URL` verrà modificata.

Se il valore assegnato alla proprietà `href` non è un URL valido, verrà generato un `TypeError`.


#### `url.origin` {#urlorigin}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v15.0.0 | Lo schema "gopher" non è più speciale e `url.origin` ora restituisce `'null'` per esso. |
:::

- [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Ottiene la serializzazione di sola lettura dell'origine dell'URL.

```js [ESM]
const myURL = new URL('https://example.org/foo/bar?baz');
console.log(myURL.origin);
// Stampa https://example.org
```
```js [ESM]
const idnURL = new URL('https://測試');
console.log(idnURL.origin);
// Stampa https://xn--g6w251d

console.log(idnURL.hostname);
// Stampa xn--g6w251d
```
#### `url.password` {#urlpassword}

- [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Ottiene e imposta la parte della password dell'URL.

```js [ESM]
const myURL = new URL('https://abc:');
console.log(myURL.password);
// Stampa xyz

myURL.password = '123';
console.log(myURL.href);
// Stampa https://abc:/
```
I caratteri URL non validi inclusi nel valore assegnato alla proprietà `password` sono [codificati in percentuale](/it/nodejs/api/url#percent-encoding-in-urls). La selezione dei caratteri da codificare in percentuale può variare un po' rispetto a ciò che i metodi [`url.parse()`](/it/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) e [`url.format()`](/it/nodejs/api/url#urlformaturlobject) produrrebbero.

#### `url.pathname` {#urlpathname}

- [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Ottiene e imposta la parte del percorso dell'URL.

```js [ESM]
const myURL = new URL('https://example.org/abc/xyz?123');
console.log(myURL.pathname);
// Stampa /abc/xyz

myURL.pathname = '/abcdef';
console.log(myURL.href);
// Stampa https://example.org/abcdef?123
```
I caratteri URL non validi inclusi nel valore assegnato alla proprietà `pathname` sono [codificati in percentuale](/it/nodejs/api/url#percent-encoding-in-urls). La selezione dei caratteri da codificare in percentuale può variare un po' rispetto a ciò che i metodi [`url.parse()`](/it/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) e [`url.format()`](/it/nodejs/api/url#urlformaturlobject) produrrebbero.


#### `url.port` {#urlport}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v15.0.0 | Lo schema "gopher" non è più speciale. |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Ottiene e imposta la porzione di porta dell'URL.

Il valore della porta può essere un numero o una stringa contenente un numero compreso tra `0` e `65535` (inclusi). Impostare il valore sulla porta predefinita degli oggetti `URL` dato il `protocol` farà sì che il valore `port` diventi la stringa vuota (`''`).

Il valore della porta può essere una stringa vuota, nel qual caso la porta dipende dal protocollo/schema:

| protocol | port |
| --- | --- |
| "ftp" | 21 |
| "file" ||
| "http" | 80 |
| "https" | 443 |
| "ws" | 80 |
| "wss" | 443 |
All'assegnazione di un valore alla porta, il valore verrà prima convertito in una stringa utilizzando `.toString()`.

Se quella stringa non è valida ma inizia con un numero, il numero iniziale viene assegnato a `port`. Se il numero si trova al di fuori dell'intervallo indicato sopra, viene ignorato.

```js [ESM]
const myURL = new URL('https://example.org:8888');
console.log(myURL.port);
// Stampa 8888

// Le porte predefinite vengono automaticamente trasformate nella stringa vuota
// (la porta predefinita del protocollo HTTPS è 443)
myURL.port = '443';
console.log(myURL.port);
// Stampa la stringa vuota
console.log(myURL.href);
// Stampa https://example.org/

myURL.port = 1234;
console.log(myURL.port);
// Stampa 1234
console.log(myURL.href);
// Stampa https://example.org:1234/

// Le stringhe di porta completamente non valide vengono ignorate
myURL.port = 'abcd';
console.log(myURL.port);
// Stampa 1234

// I numeri iniziali vengono trattati come un numero di porta
myURL.port = '5678abcd';
console.log(myURL.port);
// Stampa 5678

// I non interi vengono troncati
myURL.port = 1234.5678;
console.log(myURL.port);
// Stampa 1234

// I numeri fuori intervallo che non sono rappresentati in notazione scientifica
// verranno ignorati.
myURL.port = 1e10; // 10000000000, verrà verificato l'intervallo come descritto di seguito
console.log(myURL.port);
// Stampa 1234
```
I numeri che contengono un punto decimale, come i numeri in virgola mobile o i numeri in notazione scientifica, non fanno eccezione a questa regola. I numeri iniziali fino al punto decimale verranno impostati come porta dell'URL, supponendo che siano validi:

```js [ESM]
myURL.port = 4.567e21;
console.log(myURL.port);
// Stampa 4 (perché è il numero iniziale nella stringa '4.567e21')
```

#### `url.protocol` {#urlprotocol}

- [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Ottiene e imposta la porzione del protocollo dell'URL.

```js [ESM]
const myURL = new URL('https://example.org');
console.log(myURL.protocol);
// Stampa https:

myURL.protocol = 'ftp';
console.log(myURL.href);
// Stampa ftp://example.org/
```
I valori di protocollo URL non validi assegnati alla proprietà `protocol` vengono ignorati.

##### Schemi speciali {#special-schemes}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v15.0.0 | Lo schema "gopher" non è più speciale. |
:::

Il [WHATWG URL Standard](https://url.spec.whatwg.org/) considera una manciata di schemi di protocollo URL come *speciali* in termini di come vengono analizzati e serializzati. Quando un URL viene analizzato utilizzando uno di questi protocolli speciali, la proprietà `url.protocol` può essere modificata in un altro protocollo speciale, ma non può essere modificata in un protocollo non speciale e viceversa.

Ad esempio, passare da `http` a `https` funziona:

```js [ESM]
const u = new URL('http://example.org');
u.protocol = 'https';
console.log(u.href);
// https://example.org/
```
Tuttavia, il passaggio da `http` a un ipotetico protocollo `fish` non funziona perché il nuovo protocollo non è speciale.

```js [ESM]
const u = new URL('http://example.org');
u.protocol = 'fish';
console.log(u.href);
// http://example.org/
```
Allo stesso modo, anche il passaggio da un protocollo non speciale a un protocollo speciale non è consentito:

```js [ESM]
const u = new URL('fish://example.org');
u.protocol = 'http';
console.log(u.href);
// fish://example.org
```
Secondo il WHATWG URL Standard, gli schemi di protocollo speciali sono `ftp`, `file`, `http`, `https`, `ws` e `wss`.

#### `url.search` {#urlsearch}

- [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Ottiene e imposta la porzione di query serializzata dell'URL.

```js [ESM]
const myURL = new URL('https://example.org/abc?123');
console.log(myURL.search);
// Stampa ?123

myURL.search = 'abc=xyz';
console.log(myURL.href);
// Stampa https://example.org/abc?abc=xyz
```
Qualsiasi carattere URL non valido che appare nel valore assegnato alla proprietà `search` verrà [codificato in percentuale](/it/nodejs/api/url#percent-encoding-in-urls). La selezione dei caratteri da codificare in percentuale può variare un po' da ciò che i metodi [`url.parse()`](/it/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) e [`url.format()`](/it/nodejs/api/url#urlformaturlobject) produrrebbero.


#### `url.searchParams` {#urlsearchparams}

- [\<URLSearchParams\>](/it/nodejs/api/url#class-urlsearchparams)

Ottiene l'oggetto [`URLSearchParams`](/it/nodejs/api/url#class-urlsearchparams) che rappresenta i parametri di query dell'URL. Questa proprietà è di sola lettura ma l'oggetto `URLSearchParams` che fornisce può essere utilizzato per modificare l'istanza dell'URL; per sostituire l'intera serie di parametri di query dell'URL, utilizzare il setter [`url.search`](/it/nodejs/api/url#urlsearch). Vedere la documentazione di [`URLSearchParams`](/it/nodejs/api/url#class-urlsearchparams) per i dettagli.

Prestare attenzione quando si utilizza `.searchParams` per modificare l'`URL` perché, secondo la specifica WHATWG, l'oggetto `URLSearchParams` utilizza regole diverse per determinare quali caratteri codificare in percentuale. Ad esempio, l'oggetto `URL` non codificherà in percentuale il carattere ASCII tilde (`~`), mentre `URLSearchParams` lo codificherà sempre:

```js [ESM]
const myURL = new URL('https://example.org/abc?foo=~bar');

console.log(myURL.search);  // stampa ?foo=~bar

// Modifica l'URL tramite searchParams...
myURL.searchParams.sort();

console.log(myURL.search);  // stampa ?foo=%7Ebar
```
#### `url.username` {#urlusername}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Ottiene e imposta la parte username dell'URL.

```js [ESM]
const myURL = new URL('https://abc:');
console.log(myURL.username);
// Stampa abc

myURL.username = '123';
console.log(myURL.href);
// Stampa https://123:/
```
Qualsiasi carattere URL non valido che appare nel valore assegnato alla proprietà `username` verrà [codificato in percentuale](/it/nodejs/api/url#percent-encoding-in-urls). La selezione dei caratteri da codificare in percentuale può variare leggermente da ciò che i metodi [`url.parse()`](/it/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) e [`url.format()`](/it/nodejs/api/url#urlformaturlobject) produrrebbero.

#### `url.toString()` {#urltostring}

- Restituisce: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Il metodo `toString()` sull'oggetto `URL` restituisce l'URL serializzato. Il valore restituito è equivalente a quello di [`url.href`](/it/nodejs/api/url#urlhref) e [`url.toJSON()`](/it/nodejs/api/url#urltojson).


#### `url.toJSON()` {#urltojson}

**Aggiunto in: v7.7.0, v6.13.0**

- Restituisce: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Il metodo `toJSON()` sull'oggetto `URL` restituisce l'URL serializzato. Il valore restituito è equivalente a quello di [`url.href`](/it/nodejs/api/url#urlhref) e [`url.toString()`](/it/nodejs/api/url#urltostring).

Questo metodo viene chiamato automaticamente quando un oggetto `URL` viene serializzato con [`JSON.stringify()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify).

```js [ESM]
const myURLs = [
  new URL('https://www.example.com'),
  new URL('https://test.example.org'),
];
console.log(JSON.stringify(myURLs));
// Prints ["https://www.example.com/","https://test.example.org/"]
```
#### `URL.createObjectURL(blob)` {#urlcreateobjecturlblob}

**Aggiunto in: v16.7.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

- `blob` [\<Blob\>](/it/nodejs/api/buffer#class-blob)
- Restituisce: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Crea una stringa URL `'blob:nodedata:...'` che rappresenta l'oggetto [\<Blob\>](/it/nodejs/api/buffer#class-blob) fornito e può essere utilizzata per recuperare il `Blob` in seguito.

```js [ESM]
const {
  Blob,
  resolveObjectURL,
} = require('node:buffer');

const blob = new Blob(['hello']);
const id = URL.createObjectURL(blob);

// later...

const otherBlob = resolveObjectURL(id);
console.log(otherBlob.size);
```
I dati memorizzati dal [\<Blob\>](/it/nodejs/api/buffer#class-blob) registrato verranno conservati in memoria fino a quando non viene chiamato `URL.revokeObjectURL()` per rimuoverlo.

Gli oggetti `Blob` sono registrati all'interno del thread corrente. Se si utilizzano i Worker Threads, gli oggetti `Blob` registrati all'interno di un Worker non saranno disponibili per altri worker o per il thread principale.

#### `URL.revokeObjectURL(id)` {#urlrevokeobjecturlid}

**Aggiunto in: v16.7.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Una stringa URL `'blob:nodedata:...` restituita da una precedente chiamata a `URL.createObjectURL()`.

Rimuove il [\<Blob\>](/it/nodejs/api/buffer#class-blob) memorizzato identificato dall'ID fornito. Il tentativo di revocare un ID che non è registrato fallirà silenziosamente.


#### `URL.canParse(input[, base])` {#urlcanparseinput-base}

**Aggiunto in: v19.9.0, v18.17.0**

- `input` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'URL di input assoluto o relativo da analizzare. Se `input` è relativo, allora `base` è richiesto. Se `input` è assoluto, il `base` viene ignorato. Se `input` non è una stringa, viene prima [convertito in una stringa](https://tc39.es/ecma262/#sec-tostring).
- `base` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'URL di base rispetto al quale risolvere se l'`input` non è assoluto. Se `base` non è una stringa, viene prima [convertito in una stringa](https://tc39.es/ecma262/#sec-tostring).
- Restituisce: [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Verifica se un `input` relativo alla `base` può essere analizzato in un `URL`.

```js [ESM]
const isValid = URL.canParse('/foo', 'https://example.org/'); // true

const isNotValid = URL.canParse('/foo'); // false
```
#### `URL.parse(input[, base])` {#urlparseinput-base}

**Aggiunto in: v22.1.0**

- `input` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'URL di input assoluto o relativo da analizzare. Se `input` è relativo, allora `base` è richiesto. Se `input` è assoluto, il `base` viene ignorato. Se `input` non è una stringa, viene prima [convertito in una stringa](https://tc39.es/ecma262/#sec-tostring).
- `base` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'URL di base rispetto al quale risolvere se l'`input` non è assoluto. Se `base` non è una stringa, viene prima [convertito in una stringa](https://tc39.es/ecma262/#sec-tostring).
- Restituisce: [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

Analizza una stringa come URL. Se viene fornito `base`, verrà utilizzato come URL di base allo scopo di risolvere URL di `input` non assoluti. Restituisce `null` se `input` non è valido.


### Classe: `URLSearchParams` {#class-urlsearchparams}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.0.0 | La classe è ora disponibile sull'oggetto globale. |
| v7.5.0, v6.13.0 | Aggiunto in: v7.5.0, v6.13.0 |
:::

L'API `URLSearchParams` fornisce accesso in lettura e scrittura alla query di un `URL`. La classe `URLSearchParams` può essere utilizzata anche autonomamente con uno dei quattro costruttori seguenti. La classe `URLSearchParams` è disponibile anche sull'oggetto globale.

L'interfaccia WHATWG `URLSearchParams` e il modulo [`querystring`](/it/nodejs/api/querystring) hanno uno scopo simile, ma lo scopo del modulo [`querystring`](/it/nodejs/api/querystring) è più generale, poiché consente la personalizzazione dei caratteri delimitatori (`&` e `=`). D'altra parte, questa API è progettata esclusivamente per le stringhe di query URL.

```js [ESM]
const myURL = new URL('https://example.org/?abc=123');
console.log(myURL.searchParams.get('abc'));
// Stampa 123

myURL.searchParams.append('abc', 'xyz');
console.log(myURL.href);
// Stampa https://example.org/?abc=123&abc=xyz

myURL.searchParams.delete('abc');
myURL.searchParams.set('a', 'b');
console.log(myURL.href);
// Stampa https://example.org/?a=b

const newSearchParams = new URLSearchParams(myURL.searchParams);
// Quanto sopra è equivalente a
// const newSearchParams = new URLSearchParams(myURL.search);

newSearchParams.append('a', 'c');
console.log(myURL.href);
// Stampa https://example.org/?a=b
console.log(newSearchParams.toString());
// Stampa a=b&a=c

// newSearchParams.toString() è chiamato implicitamente
myURL.search = newSearchParams;
console.log(myURL.href);
// Stampa https://example.org/?a=b&a=c
newSearchParams.delete('a');
console.log(myURL.href);
// Stampa https://example.org/?a=b&a=c
```
#### `new URLSearchParams()` {#new-urlsearchparams}

Crea una nuova istanza di un oggetto `URLSearchParams` vuoto.

#### `new URLSearchParams(string)` {#new-urlsearchparamsstring}

- `string` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Una stringa di query

Analizza la `string` come una stringa di query e la utilizza per creare un'istanza di un nuovo oggetto `URLSearchParams`. Un `'?'` iniziale, se presente, viene ignorato.

```js [ESM]
let params;

params = new URLSearchParams('user=abc&query=xyz');
console.log(params.get('user'));
// Stampa 'abc'
console.log(params.toString());
// Stampa 'user=abc&query=xyz'

params = new URLSearchParams('?user=abc&query=xyz');
console.log(params.toString());
// Stampa 'user=abc&query=xyz'
```

#### `new URLSearchParams(obj)` {#new-urlsearchparamsobj}

**Aggiunto in: v7.10.0, v6.13.0**

- `obj` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un oggetto che rappresenta una raccolta di coppie chiave-valore

Crea una nuova istanza di un oggetto `URLSearchParams` con una mappa hash di query. La chiave e il valore di ogni proprietà di `obj` vengono sempre convertiti in stringhe.

A differenza del modulo [`querystring`](/it/nodejs/api/querystring), le chiavi duplicate sotto forma di valori array non sono consentite. Gli array vengono trasformati in stringhe utilizzando [`array.toString()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toString), che unisce semplicemente tutti gli elementi dell'array con virgole.

```js [ESM]
const params = new URLSearchParams({
  user: 'abc',
  query: ['first', 'second'],
});
console.log(params.getAll('query'));
// Prints [ 'first,second' ]
console.log(params.toString());
// Prints 'user=abc&query=first%2Csecond'
```
#### `new URLSearchParams(iterable)` {#new-urlsearchparamsiterable}

**Aggiunto in: v7.10.0, v6.13.0**

- `iterable` [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) Un oggetto iterabile i cui elementi sono coppie chiave-valore

Crea una nuova istanza di un oggetto `URLSearchParams` con una mappa iterabile in modo simile al costruttore di [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map). `iterable` può essere un `Array` o qualsiasi oggetto iterabile. Ciò significa che `iterable` può essere un altro `URLSearchParams`, nel qual caso il costruttore creerà semplicemente un clone del `URLSearchParams` fornito. Gli elementi di `iterable` sono coppie chiave-valore e possono essere essi stessi qualsiasi oggetto iterabile.

Le chiavi duplicate sono consentite.

```js [ESM]
let params;

// Using an array
params = new URLSearchParams([
  ['user', 'abc'],
  ['query', 'first'],
  ['query', 'second'],
]);
console.log(params.toString());
// Prints 'user=abc&query=first&query=second'

// Using a Map object
const map = new Map();
map.set('user', 'abc');
map.set('query', 'xyz');
params = new URLSearchParams(map);
console.log(params.toString());
// Prints 'user=abc&query=xyz'

// Using a generator function
function* getQueryPairs() {
  yield ['user', 'abc'];
  yield ['query', 'first'];
  yield ['query', 'second'];
}
params = new URLSearchParams(getQueryPairs());
console.log(params.toString());
// Prints 'user=abc&query=first&query=second'

// Each key-value pair must have exactly two elements
new URLSearchParams([
  ['user', 'abc', 'error'],
]);
// Throws TypeError [ERR_INVALID_TUPLE]:
//        Each query pair must be an iterable [name, value] tuple
```

#### `urlSearchParams.append(name, value)` {#urlsearchparamsappendname-value}

- `name` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Aggiunge una nuova coppia nome-valore alla query string.

#### `urlSearchParams.delete(name[, value])` {#urlsearchparamsdeletename-value}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v20.2.0, v18.18.0 | Aggiunto il supporto per l'argomento opzionale `value`. |
:::

- `name` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Se `value` è fornito, rimuove tutte le coppie nome-valore dove name è `name` e value è `value`.

Se `value` non è fornito, rimuove tutte le coppie nome-valore il cui name è `name`.

#### `urlSearchParams.entries()` {#urlsearchparamsentries}

- Restituisce: [\<Iteratore\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

Restituisce un `Iteratore` ES6 su ciascuna delle coppie nome-valore nella query. Ciascun elemento dell'iteratore è un `Array` JavaScript. Il primo elemento dell'`Array` è il `name`, il secondo elemento dell'`Array` è il `value`.

Alias per [`urlSearchParams[@@iterator]()`](/it/nodejs/api/url#urlsearchparamssymboliterator).

#### `urlSearchParams.forEach(fn[, thisArg])` {#urlsearchparamsforeachfn-thisarg}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare un callback non valido all'argomento `fn` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
:::

- `fn` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Invocata per ogni coppia nome-valore nella query
- `thisArg` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Da utilizzare come valore `this` quando `fn` viene chiamata

Itera su ogni coppia nome-valore nella query e invoca la funzione data.

```js [ESM]
const myURL = new URL('https://example.org/?a=b&c=d');
myURL.searchParams.forEach((value, name, searchParams) => {
  console.log(name, value, myURL.searchParams === searchParams);
});
// Prints:
//   a b true
//   c d true
```

#### `urlSearchParams.get(name)` {#urlsearchparamsgetname}

- `name` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Restituisce: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) Una stringa o `null` se non esiste una coppia nome-valore con il `name` specificato.

Restituisce il valore della prima coppia nome-valore il cui nome è `name`. Se non ci sono tali coppie, viene restituito `null`.

#### `urlSearchParams.getAll(name)` {#urlsearchparamsgetallname}

- `name` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Restituisce: [\<stringa[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Restituisce i valori di tutte le coppie nome-valore il cui nome è `name`. Se non ci sono tali coppie, viene restituito un array vuoto.

#### `urlSearchParams.has(name[, value])` {#urlsearchparamshasname-value}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v20.2.0, v18.18.0 | Aggiunto il supporto per l'argomento opzionale `value`. |
:::

- `name` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Restituisce: [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Verifica se l'oggetto `URLSearchParams` contiene coppie chiave-valore basate su `name` e un argomento `value` opzionale.

Se viene fornito `value`, restituisce `true` quando esiste una coppia nome-valore con lo stesso `name` e `value`.

Se `value` non viene fornito, restituisce `true` se esiste almeno una coppia nome-valore il cui nome è `name`.

#### `urlSearchParams.keys()` {#urlsearchparamskeys}

- Restituisce: [\<Iteratore\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

Restituisce un `Iteratore` ES6 sui nomi di ciascuna coppia nome-valore.

```js [ESM]
const params = new URLSearchParams('foo=bar&foo=baz');
for (const name of params.keys()) {
  console.log(name);
}
// Prints:
//   foo
//   foo
```

#### `urlSearchParams.set(name, value)` {#urlsearchparamssetname-value}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Imposta il valore nell'oggetto `URLSearchParams` associato a `name` su `value`. Se ci sono coppie nome-valore preesistenti i cui nomi sono `name`, imposta il valore della prima coppia su `value` e rimuove tutte le altre. In caso contrario, aggiunge la coppia nome-valore alla stringa di query.

```js [ESM]
const params = new URLSearchParams();
params.append('foo', 'bar');
params.append('foo', 'baz');
params.append('abc', 'def');
console.log(params.toString());
// Stampa foo=bar&foo=baz&abc=def

params.set('foo', 'def');
params.set('xyz', 'opq');
console.log(params.toString());
// Stampa foo=def&abc=def&xyz=opq
```
#### `urlSearchParams.size` {#urlsearchparamssize}

**Aggiunto in: v19.8.0, v18.16.0**

Il numero totale di voci di parametro.

#### `urlSearchParams.sort()` {#urlsearchparamssort}

**Aggiunto in: v7.7.0, v6.13.0**

Ordina tutte le coppie nome-valore esistenti sul posto in base ai loro nomi. L'ordinamento viene eseguito con un [algoritmo di ordinamento stabile](https://en.wikipedia.org/wiki/Sorting_algorithm#Stability), quindi l'ordine relativo tra le coppie nome-valore con lo stesso nome viene preservato.

Questo metodo può essere utilizzato, in particolare, per aumentare gli hit della cache.

```js [ESM]
const params = new URLSearchParams('query[]=abc&type=search&query[]=123');
params.sort();
console.log(params.toString());
// Stampa query%5B%5D=abc&query%5B%5D=123&type=search
```
#### `urlSearchParams.toString()` {#urlsearchparamstostring}

- Restituisce: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Restituisce i parametri di ricerca serializzati come stringa, con i caratteri codificati in percentuale ove necessario.

#### `urlSearchParams.values()` {#urlsearchparamsvalues}

- Restituisce: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

Restituisce un `Iterator` ES6 sui valori di ogni coppia nome-valore.


#### `urlSearchParams[Symbol.iterator]()` {#urlsearchparamssymboliterator}

- Restituisce: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

Restituisce un `Iterator` ES6 su ciascuna delle coppie nome-valore nella stringa di query. Ogni elemento dell'iteratore è un `Array` JavaScript. Il primo elemento dell'`Array` è il `name`, il secondo elemento dell'`Array` è il `value`.

Alias per [`urlSearchParams.entries()`](/it/nodejs/api/url#urlsearchparamsentries).

```js [ESM]
const params = new URLSearchParams('foo=bar&xyz=baz');
for (const [name, value] of params) {
  console.log(name, value);
}
// Prints:
//   foo bar
//   xyz baz
```
### `url.domainToASCII(domain)` {#urldomaintoasciidomain}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v20.0.0, v18.17.0 | Il requisito ICU è stato rimosso. |
| v7.4.0, v6.13.0 | Aggiunto in: v7.4.0, v6.13.0 |
:::

- `domain` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Restituisce: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Restituisce la serializzazione ASCII [Punycode](https://tools.ietf.org/html/rfc5891#section-4.4) del `dominio`. Se `domain` è un dominio non valido, viene restituita la stringa vuota.

Esegue l'operazione inversa a [`url.domainToUnicode()`](/it/nodejs/api/url#urldomaintounicodedomain).



::: code-group
```js [ESM]
import url from 'node:url';

console.log(url.domainToASCII('español.com'));
// Prints xn--espaol-zwa.com
console.log(url.domainToASCII('中文.com'));
// Prints xn--fiq228c.com
console.log(url.domainToASCII('xn--iñvalid.com'));
// Prints an empty string
```

```js [CJS]
const url = require('node:url');

console.log(url.domainToASCII('español.com'));
// Prints xn--espaol-zwa.com
console.log(url.domainToASCII('中文.com'));
// Prints xn--fiq228c.com
console.log(url.domainToASCII('xn--iñvalid.com'));
// Prints an empty string
```
:::

### `url.domainToUnicode(domain)` {#urldomaintounicodedomain}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v20.0.0, v18.17.0 | Il requisito ICU è stato rimosso. |
| v7.4.0, v6.13.0 | Aggiunto in: v7.4.0, v6.13.0 |
:::

- `domain` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Restituisce: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Restituisce la serializzazione Unicode del `dominio`. Se `domain` è un dominio non valido, viene restituita la stringa vuota.

Esegue l'operazione inversa a [`url.domainToASCII()`](/it/nodejs/api/url#urldomaintoasciidomain).



::: code-group
```js [ESM]
import url from 'node:url';

console.log(url.domainToUnicode('xn--espaol-zwa.com'));
// Prints español.com
console.log(url.domainToUnicode('xn--fiq228c.com'));
// Prints 中文.com
console.log(url.domainToUnicode('xn--iñvalid.com'));
// Prints an empty string
```

```js [CJS]
const url = require('node:url');

console.log(url.domainToUnicode('xn--espaol-zwa.com'));
// Prints español.com
console.log(url.domainToUnicode('xn--fiq228c.com'));
// Prints 中文.com
console.log(url.domainToUnicode('xn--iñvalid.com'));
// Prints an empty string
```
:::


### `url.fileURLToPath(url[, options])` {#urlfileurltopathurl-options}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v22.1.0, v20.13.0 | L'argomento `options` può ora essere utilizzato per determinare come analizzare l'argomento `path`. |
| v10.12.0 | Aggiunto in: v10.12.0 |
:::

- `url` [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La stringa URL del file o l'oggetto URL da convertire in un percorso.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `windows` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) `true` se il `path` deve essere restituito come percorso file di Windows, `false` per posix e `undefined` per il sistema predefinito. **Predefinito:** `undefined`.


- Restituisce: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il percorso file Node.js specifico per la piattaforma completamente risolto.

Questa funzione garantisce la corretta decodifica dei caratteri con codifica percentuale, nonché la garanzia di una stringa di percorso assoluto valida multipiattaforma.



::: code-group
```js [ESM]
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);

new URL('file:///C:/path/').pathname;      // Errato: /C:/path/
fileURLToPath('file:///C:/path/');         // Corretto:   C:\path\ (Windows)

new URL('file://nas/foo.txt').pathname;    // Errato: /foo.txt
fileURLToPath('file://nas/foo.txt');       // Corretto:   \\nas\foo.txt (Windows)

new URL('file:///你好.txt').pathname;      // Errato: /%E4%BD%A0%E5%A5%BD.txt
fileURLToPath('file:///你好.txt');         // Corretto:   /你好.txt (POSIX)

new URL('file:///hello world').pathname;   // Errato: /hello%20world
fileURLToPath('file:///hello world');      // Corretto:   /hello world (POSIX)
```

```js [CJS]
const { fileURLToPath } = require('node:url');
new URL('file:///C:/path/').pathname;      // Errato: /C:/path/
fileURLToPath('file:///C:/path/');         // Corretto:   C:\path\ (Windows)

new URL('file://nas/foo.txt').pathname;    // Errato: /foo.txt
fileURLToPath('file://nas/foo.txt');       // Corretto:   \\nas\foo.txt (Windows)

new URL('file:///你好.txt').pathname;      // Errato: /%E4%BD%A0%E5%A5%BD.txt
fileURLToPath('file:///你好.txt');         // Corretto:   /你好.txt (POSIX)

new URL('file:///hello world').pathname;   // Errato: /hello%20world
fileURLToPath('file:///hello world');      // Corretto:   /hello world (POSIX)
```
:::


### `url.format(URL[, options])` {#urlformaturl-options}

**Aggiunto in: v7.6.0**

- `URL` [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api) Un oggetto [URL WHATWG](/it/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `auth` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` se la stringa URL serializzata deve includere nome utente e password, `false` altrimenti. **Predefinito:** `true`.
    - `fragment` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` se la stringa URL serializzata deve includere il frammento, `false` altrimenti. **Predefinito:** `true`.
    - `search` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` se la stringa URL serializzata deve includere la query di ricerca, `false` altrimenti. **Predefinito:** `true`.
    - `unicode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` se i caratteri Unicode che compaiono nel componente host della stringa URL devono essere codificati direttamente anziché essere codificati con Punycode. **Predefinito:** `false`.


- Restituisce: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Restituisce una serializzazione personalizzabile di una rappresentazione `String` URL di un oggetto [URL WHATWG](/it/nodejs/api/url#the-whatwg-url-api).

L'oggetto URL ha sia un metodo `toString()` che una proprietà `href` che restituiscono serializzazioni di stringhe dell'URL. Questi, tuttavia, non sono personalizzabili in alcun modo. Il metodo `url.format(URL[, options])` consente la personalizzazione di base dell'output.

::: code-group
```js [ESM]
import url from 'node:url';
const myURL = new URL('https://a:b@測試?abc#foo');

console.log(myURL.href);
// Prints https://a:b@xn--g6w251d/?abc#foo

console.log(myURL.toString());
// Prints https://a:b@xn--g6w251d/?abc#foo

console.log(url.format(myURL, { fragment: false, unicode: true, auth: false }));
// Prints 'https://測試/?abc'
```

```js [CJS]
const url = require('node:url');
const myURL = new URL('https://a:b@測試?abc#foo');

console.log(myURL.href);
// Prints https://a:b@xn--g6w251d/?abc#foo

console.log(myURL.toString());
// Prints https://a:b@xn--g6w251d/?abc#foo

console.log(url.format(myURL, { fragment: false, unicode: true, auth: false }));
// Prints 'https://測試/?abc'
```
:::


### `url.pathToFileURL(path[, options])` {#urlpathtofileurlpath-options}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v22.1.0, v20.13.0 | L'argomento `options` può ora essere utilizzato per determinare come restituire il valore `path`. |
| v10.12.0 | Aggiunto in: v10.12.0 |
:::

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il percorso da convertire in un URL di file.
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `windows` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) `true` se il `path` deve essere considerato come un percorso di file Windows, `false` per posix e `undefined` per il valore predefinito del sistema. **Predefinito:** `undefined`.
 
- Restituisce: [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api) L'oggetto URL del file.

Questa funzione assicura che `path` sia risolto in modo assoluto e che i caratteri di controllo URL siano codificati correttamente durante la conversione in un URL di file.

::: code-group
```js [ESM]
import { pathToFileURL } from 'node:url';

new URL('/foo#1', 'file:');           // Errato: file:///foo#1
pathToFileURL('/foo#1');              // Corretto:   file:///foo%231 (POSIX)

new URL('/some/path%.c', 'file:');    // Errato: file:///some/path%.c
pathToFileURL('/some/path%.c');       // Corretto:   file:///some/path%25.c (POSIX)
```

```js [CJS]
const { pathToFileURL } = require('node:url');
new URL(__filename);                  // Errato: genera un'eccezione (POSIX)
new URL(__filename);                  // Errato: C:\... (Windows)
pathToFileURL(__filename);            // Corretto:   file:///... (POSIX)
pathToFileURL(__filename);            // Corretto:   file:///C:/... (Windows)

new URL('/foo#1', 'file:');           // Errato: file:///foo#1
pathToFileURL('/foo#1');              // Corretto:   file:///foo%231 (POSIX)

new URL('/some/path%.c', 'file:');    // Errato: file:///some/path%.c
pathToFileURL('/some/path%.c');       // Corretto:   file:///some/path%25.c (POSIX)
```
:::


### `url.urlToHttpOptions(url)` {#urlurltohttpoptionsurl}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.9.0, v18.17.0 | L'oggetto restituito conterrà anche tutte le proprietà enumerabili proprie dell'argomento `url`. |
| v15.7.0, v14.18.0 | Aggiunto in: v15.7.0, v14.18.0 |
:::

- `url` [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api) L'oggetto [WHATWG URL](/it/nodejs/api/url#the-whatwg-url-api) da convertire in un oggetto di opzioni.
- Restituisce: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Oggetto di opzioni
    - `protocol` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Protocollo da utilizzare.
    - `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un nome di dominio o un indirizzo IP del server a cui inviare la richiesta.
    - `hash` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La porzione di frammento dell'URL.
    - `search` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La porzione di query serializzata dell'URL.
    - `pathname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La porzione di percorso dell'URL.
    - `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Percorso della richiesta. Dovrebbe includere la stringa di query, se presente. Es. `'/index.html?page=12'`. Viene generata un'eccezione quando il percorso della richiesta contiene caratteri non validi. Attualmente, vengono rifiutati solo gli spazi, ma ciò potrebbe cambiare in futuro.
    - `href` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'URL serializzato.
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Porta del server remoto.
    - `auth` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Autenticazione di base, es. `'user:password'` per calcolare un'intestazione di autorizzazione.

Questa funzione di utilità converte un oggetto URL in un oggetto di opzioni ordinario come previsto dalle API [`http.request()`](/it/nodejs/api/http#httprequestoptions-callback) e [`https.request()`](/it/nodejs/api/https#httpsrequestoptions-callback).

::: code-group
```js [ESM]
import { urlToHttpOptions } from 'node:url';
const myURL = new URL('https://a:b@測試?abc#foo');

console.log(urlToHttpOptions(myURL));
/*
{
  protocol: 'https:',
  hostname: 'xn--g6w251d',
  hash: '#foo',
  search: '?abc',
  pathname: '/',
  path: '/?abc',
  href: 'https://a:b@xn--g6w251d/?abc#foo',
  auth: 'a:b'
}
*/
```

```js [CJS]
const { urlToHttpOptions } = require('node:url');
const myURL = new URL('https://a:b@測試?abc#foo');

console.log(urlToHttpOptions(myURL));
/*
{
  protocol: 'https:',
  hostname: 'xn--g6w251d',
  hash: '#foo',
  search: '?abc',
  pathname: '/',
  path: '/?abc',
  href: 'https://a:b@xn--g6w251d/?abc#foo',
  auth: 'a:b'
}
*/
```
:::


## API URL Legacy {#legacy-url-api}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v15.13.0, v14.17.0 | Revocata la deprecazione. Stato modificato in "Legacy". |
| v11.0.0 | Questa API è deprecata. |
:::

::: info [Stabile: 3 - Legacy]
[Stabile: 3](/it/nodejs/api/documentation#stability-index) [Stabile: 3](/it/nodejs/api/documentation#stability-index) - Legacy: Utilizzare invece l'API URL WHATWG.
:::

### Legacy `urlObject` {#legacy-urlobject}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v15.13.0, v14.17.0 | Revocata la deprecazione. Stato modificato in "Legacy". |
| v11.0.0 | L'API URL Legacy è deprecata. Utilizzare l'API URL WHATWG. |
:::

::: info [Stabile: 3 - Legacy]
[Stabile: 3](/it/nodejs/api/documentation#stability-index) [Stabile: 3](/it/nodejs/api/documentation#stability-index) - Legacy: Utilizzare invece l'API URL WHATWG.
:::

L'`urlObject` legacy (`require('node:url').Url` o `import { Url } from 'node:url'`) viene creato e restituito dalla funzione `url.parse()`.

#### `urlObject.auth` {#urlobjectauth}

La proprietà `auth` è la porzione username e password dell'URL, anche denominata *userinfo*. Questo sottoinsieme di stringa segue il `protocol` e le doppie barre (se presenti) e precede il componente `host`, delimitato da `@`. La stringa è o lo username, oppure lo username e la password separati da `:`.

Ad esempio: `'user:pass'`.

#### `urlObject.hash` {#urlobjecthash}

La proprietà `hash` è la porzione identificatore di frammento dell'URL incluso il carattere iniziale `#`.

Ad esempio: `'#hash'`.

#### `urlObject.host` {#urlobjecthost}

La proprietà `host` è la porzione host completa in minuscolo dell'URL, inclusa la `port` se specificata.

Ad esempio: `'sub.example.com:8080'`.

#### `urlObject.hostname` {#urlobjecthostname}

La proprietà `hostname` è la porzione nome host in minuscolo del componente `host` *senza* la `port` inclusa.

Ad esempio: `'sub.example.com'`.

#### `urlObject.href` {#urlobjecthref}

La proprietà `href` è la stringa URL completa che è stata analizzata con entrambi i componenti `protocol` e `host` convertiti in minuscolo.

Ad esempio: `'http://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash'`.


#### `urlObject.path` {#urlobjectpath}

La proprietà `path` è una concatenazione dei componenti `pathname` e `search`.

Per esempio: `'/p/a/t/h?query=string'`.

Non viene eseguita alcuna decodifica del `path`.

#### `urlObject.pathname` {#urlobjectpathname}

La proprietà `pathname` consiste nell'intera sezione del percorso dell'URL. Questo è tutto ciò che segue l'`host` (incluso il `port`) e precede l'inizio dei componenti `query` o `hash`, delimitato dai caratteri ASCII punto interrogativo (`?`) o hash (`#`).

Per esempio: `'/p/a/t/h'`.

Non viene eseguita alcuna decodifica della stringa del percorso.

#### `urlObject.port` {#urlobjectport}

La proprietà `port` è la porzione numerica della porta del componente `host`.

Per esempio: `'8080'`.

#### `urlObject.protocol` {#urlobjectprotocol}

La proprietà `protocol` identifica lo schema del protocollo dell'URL in minuscolo.

Per esempio: `'http:'`.

#### `urlObject.query` {#urlobjectquery}

La proprietà `query` è la stringa di query senza il punto interrogativo ASCII iniziale (`?`), oppure un oggetto restituito dal metodo `parse()` del modulo [`querystring`](/it/nodejs/api/querystring). Il fatto che la proprietà `query` sia una stringa o un oggetto è determinato dall'argomento `parseQueryString` passato a `url.parse()`.

Per esempio: `'query=string'` oppure `{'query': 'string'}`.

Se restituita come stringa, non viene eseguita alcuna decodifica della stringa di query. Se restituita come oggetto, vengono decodificate sia le chiavi che i valori.

#### `urlObject.search` {#urlobjectsearch}

La proprietà `search` consiste nell'intera porzione "stringa di query" dell'URL, incluso il carattere ASCII punto interrogativo iniziale (`?`).

Per esempio: `'?query=string'`.

Non viene eseguita alcuna decodifica della stringa di query.

#### `urlObject.slashes` {#urlobjectslashes}

La proprietà `slashes` è un `boolean` con valore `true` se sono richiesti due caratteri ASCII barra (`/`) dopo i due punti nel `protocol`.

### `url.format(urlObject)` {#urlformaturlobject}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v17.0.0 | Ora genera un'eccezione `ERR_INVALID_URL` quando la conversione Punycode di un nome host introduce modifiche che potrebbero causare la rianalisi dell'URL in modo diverso. |
| v15.13.0, v14.17.0 | Deprecazione revocata. Stato modificato in "Legacy". |
| v11.0.0 | L'API URL Legacy è deprecata. Utilizzare l'API URL WHATWG. |
| v7.0.0 | Gli URL con schema `file:` ora utilizzeranno sempre il numero corretto di barre indipendentemente dall'opzione `slashes`. Un'opzione `slashes` falsa senza protocollo viene ora rispettata in ogni momento. |
| v0.1.25 | Aggiunto in: v0.1.25 |
:::

::: info [Stabile: 3 - Legacy]
[Stabile: 3](/it/nodejs/api/documentation#stability-index) [Stabilità: 3](/it/nodejs/api/documentation#stability-index) - Legacy: Utilizzare invece l'API URL WHATWG.
:::

- `urlObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un oggetto URL (come restituito da `url.parse()` o costruito in altro modo). Se è una stringa, viene convertito in un oggetto passandolo a `url.parse()`.

Il metodo `url.format()` restituisce una stringa URL formattata derivata da `urlObject`.

```js [ESM]
const url = require('node:url');
url.format({
  protocol: 'https',
  hostname: 'example.com',
  pathname: '/some/path',
  query: {
    page: 1,
    format: 'json',
  },
});

// => 'https://example.com/some/path?page=1&format=json'
```
Se `urlObject` non è un oggetto o una stringa, `url.format()` genererà un [`TypeError`](/it/nodejs/api/errors#class-typeerror).

Il processo di formattazione funziona come segue:

- Viene creata una nuova stringa vuota `result`.
- Se `urlObject.protocol` è una stringa, viene accodata così com'è a `result`.
- Altrimenti, se `urlObject.protocol` non è `undefined` e non è una stringa, viene generato un [`Error`](/it/nodejs/api/errors#class-error).
- Per tutti i valori stringa di `urlObject.protocol` che *non terminano* con un carattere ASCII due punti (`:`), la stringa letterale `:` verrà accodata a `result`.
- Se una delle seguenti condizioni è vera, la stringa letterale `//` verrà accodata a `result`:
    - la proprietà `urlObject.slashes` è vera;
    - `urlObject.protocol` inizia con `http`, `https`, `ftp`, `gopher` o `file`;


- Se il valore della proprietà `urlObject.auth` è truthy, e sia `urlObject.host` che `urlObject.hostname` non sono `undefined`, il valore di `urlObject.auth` verrà forzato in una stringa e accodato a `result` seguito dalla stringa letterale `@`.
- Se la proprietà `urlObject.host` è `undefined` allora:
    - Se `urlObject.hostname` è una stringa, viene accodata a `result`.
    - Altrimenti, se `urlObject.hostname` non è `undefined` e non è una stringa, viene generato un [`Error`](/it/nodejs/api/errors#class-error).
    - Se il valore della proprietà `urlObject.port` è truthy e `urlObject.hostname` non è `undefined`:
    - La stringa letterale `:` viene accodata a `result` e
    - Il valore di `urlObject.port` viene forzato in una stringa e accodato a `result`.




- Altrimenti, se il valore della proprietà `urlObject.host` è truthy, il valore di `urlObject.host` viene forzato in una stringa e accodato a `result`.
- Se la proprietà `urlObject.pathname` è una stringa che non è una stringa vuota:
    - Se `urlObject.pathname` *non inizia* con una barra ASCII (`/`), allora la stringa letterale `'/'` viene accodata a `result`.
    - Il valore di `urlObject.pathname` viene accodato a `result`.


- Altrimenti, se `urlObject.pathname` non è `undefined` e non è una stringa, viene generato un [`Error`](/it/nodejs/api/errors#class-error).
- Se la proprietà `urlObject.search` è `undefined` e se la proprietà `urlObject.query` è un `Object`, la stringa letterale `?` viene accodata a `result` seguita dall'output della chiamata al metodo `stringify()` del modulo [`querystring`](/it/nodejs/api/querystring) passando il valore di `urlObject.query`.
- Altrimenti, se `urlObject.search` è una stringa:
    - Se il valore di `urlObject.search` *non inizia* con il carattere ASCII punto interrogativo (`?`), la stringa letterale `?` viene accodata a `result`.
    - Il valore di `urlObject.search` viene accodato a `result`.


- Altrimenti, se `urlObject.search` non è `undefined` e non è una stringa, viene generato un [`Error`](/it/nodejs/api/errors#class-error).
- Se la proprietà `urlObject.hash` è una stringa:
    - Se il valore di `urlObject.hash` *non inizia* con il carattere ASCII hash (`#`), la stringa letterale `#` viene accodata a `result`.
    - Il valore di `urlObject.hash` viene accodato a `result`.


- Altrimenti, se la proprietà `urlObject.hash` non è `undefined` e non è una stringa, viene generato un [`Error`](/it/nodejs/api/errors#class-error).
- `result` viene restituito.


### `url.parse(urlString[, parseQueryString[, slashesDenoteHost]])` {#urlparseurlstring-parsequerystring-slashesdenotehost}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.0.0, v18.13.0 | Deprecazione solo documentazione. |
| v15.13.0, v14.17.0 | Deprecazione revocata. Stato cambiato in "Legacy". |
| v11.14.0 | La proprietà `pathname` sull'oggetto URL restituito è ora `/` quando non c'è alcun percorso e lo schema del protocollo è `ws:` o `wss:`. |
| v11.0.0 | La Legacy URL API è deprecata. Utilizzare la WHATWG URL API. |
| v9.0.0 | La proprietà `search` sull'oggetto URL restituito è ora `null` quando non è presente alcuna stringa di query. |
| v0.1.25 | Aggiunto in: v0.1.25 |
:::

::: danger [Stabile: 0 - Deprecato]
[Stabile: 0](/it/nodejs/api/documentation#stability-index) [Stabilità: 0](/it/nodejs/api/documentation#stability-index) - Deprecato: Utilizzare invece la WHATWG URL API.
:::

- `urlString` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La stringa URL da analizzare.
- `parseQueryString` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, la proprietà `query` sarà sempre impostata su un oggetto restituito dal metodo `parse()` del modulo [`querystring`](/it/nodejs/api/querystring). Se `false`, la proprietà `query` sull'oggetto URL restituito sarà una stringa non analizzata e non decodificata. **Predefinito:** `false`.
- `slashesDenoteHost` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, il primo token dopo la stringa letterale `//` e precedente il successivo `/` verrà interpretato come `host`. Ad esempio, dato `//foo/bar`, il risultato sarebbe `{host: 'foo', pathname: '/bar'}` invece di `{pathname: '//foo/bar'}`. **Predefinito:** `false`.

Il metodo `url.parse()` prende una stringa URL, la analizza e restituisce un oggetto URL.

Viene generato un `TypeError` se `urlString` non è una stringa.

Viene generato un `URIError` se la proprietà `auth` è presente ma non può essere decodificata.

`url.parse()` utilizza un algoritmo permissivo e non standard per l'analisi delle stringhe URL. È soggetto a problemi di sicurezza come lo [spoofing del nome host](https://hackerone.com/reports/678487) e la gestione errata di nomi utente e password. Non utilizzare con input non attendibili. I CVE non vengono emessi per le vulnerabilità di `url.parse()`. Utilizzare invece la [WHATWG URL](/it/nodejs/api/url#the-whatwg-url-api) API.


### `url.resolve(from, to)` {#urlresolvefrom-to}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v15.13.0, v14.17.0 | Revocata la deprecazione. Stato modificato in "Legacy". |
| v11.0.0 | L'API URL Legacy è deprecata. Usa l'API URL WHATWG. |
| v6.6.0 | I campi `auth` sono ora mantenuti intatti quando `from` e `to` si riferiscono allo stesso host. |
| v6.0.0 | Il campo `auth` è ora cancellato se il parametro `to` contiene un hostname. |
| v6.5.0, v4.6.2 | Il campo `port` è ora copiato correttamente. |
| v0.1.25 | Aggiunto in: v0.1.25 |
:::

::: info [Stabile: 3 - Legacy]
[Stabile: 3](/it/nodejs/api/documentation#stability-index) [Stabilità: 3](/it/nodejs/api/documentation#stability-index) - Legacy: Usa invece l'API URL WHATWG.
:::

- `from` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'URL di base da usare se `to` è un URL relativo.
- `to` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'URL di destinazione da risolvere.

Il metodo `url.resolve()` risolve un URL di destinazione relativo a un URL di base in un modo simile a quello di un browser web che risolve un tag di ancoraggio.

```js [ESM]
const url = require('node:url');
url.resolve('/one/two/three', 'four');         // '/one/two/four'
url.resolve('http://example.com/', '/one');    // 'http://example.com/one'
url.resolve('http://example.com/one', '/two'); // 'http://example.com/two'
```
Per ottenere lo stesso risultato usando l'API URL WHATWG:

```js [ESM]
function resolve(from, to) {
  const resolvedUrl = new URL(to, new URL(from, 'resolve://'));
  if (resolvedUrl.protocol === 'resolve:') {
    // `from` è un URL relativo.
    const { pathname, search, hash } = resolvedUrl;
    return pathname + search + hash;
  }
  return resolvedUrl.toString();
}

resolve('/one/two/three', 'four');         // '/one/two/four'
resolve('http://example.com/', '/one');    // 'http://example.com/one'
resolve('http://example.com/one', '/two'); // 'http://example.com/two'
```
## Percent-encoding negli URL {#percent-encoding-in-urls}

Gli URL sono autorizzati a contenere solo un certo intervallo di caratteri. Qualsiasi carattere che non rientra in tale intervallo deve essere codificato. Come tali caratteri sono codificati e quali caratteri codificare dipende interamente da dove si trova il carattere all'interno della struttura dell'URL.


### API Legacy {#legacy-api}

All'interno dell'API Legacy, gli spazi (`' '`) e i seguenti caratteri verranno automaticamente sottoposti a escape nelle proprietà degli oggetti URL:

```text [TEXT]
< > " ` \r \n \t { } | \ ^ '
```
Ad esempio, lo spazio ASCII (`' '`) viene codificato come `%20`. La barra ASCII (`/`) viene codificata come `%3C`.

### API WHATWG {#whatwg-api}

Lo [Standard URL WHATWG](https://url.spec.whatwg.org/) utilizza un approccio più selettivo e granulare per la selezione dei caratteri codificati rispetto a quello utilizzato dall'API Legacy.

L'algoritmo WHATWG definisce quattro "percent-encode set" che descrivono intervalli di caratteri che devono essere codificati in percentuale:

-   Il *C0 control percent-encode set* include i code point nell'intervallo U+0000 a U+001F (inclusivo) e tutti i code point maggiori di U+007E (~).
-   Il *fragment percent-encode set* include il *C0 control percent-encode set* e i code point U+0020 SPACE, U+0022 ("), U+003C (\<), U+003E (\>), e U+0060 (`).
-   Il *path percent-encode set* include il *C0 control percent-encode set* e i code point U+0020 SPACE, U+0022 ("), U+0023 (#), U+003C (\<), U+003E (\>), U+003F (?), U+0060 (`), U+007B ({), e U+007D (}).
-   Lo *userinfo encode set* include il *path percent-encode set* e i code point U+002F (/), U+003A (:), U+003B (;), U+003D (=), U+0040 (@), U+005B ([) a U+005E(^), e U+007C (|).

Lo *userinfo percent-encode set* viene utilizzato esclusivamente per i nomi utente e le password codificate all'interno dell'URL. Il *path percent-encode set* viene utilizzato per il percorso della maggior parte degli URL. Il *fragment percent-encode set* viene utilizzato per i frammenti URL. Il *C0 control percent-encode set* viene utilizzato per l'host e il percorso in determinate condizioni specifiche, oltre a tutti gli altri casi.

Quando i caratteri non ASCII appaiono all'interno di un nome host, il nome host viene codificato utilizzando l'algoritmo [Punycode](https://tools.ietf.org/html/rfc5891#section-4.4). Si noti, tuttavia, che un nome host *può* contenere *sia* caratteri codificati Punycode sia caratteri codificati in percentuale:

```js [ESM]
const myURL = new URL('https://%CF%80.example.com/foo');
console.log(myURL.href);
// Prints https://xn--1xa.example.com/foo
console.log(myURL.origin);
// Prints https://xn--1xa.example.com
```

