---
title: Documentazione Node.js - Internazionalizzazione
description: Questa sezione della documentazione di Node.js copre il modulo di Internazionalizzazione (Intl), che fornisce accesso a varie funzionalità di internazionalizzazione e localizzazione, inclusi ordinamento, formattazione dei numeri, date e orari, e altro ancora.
head:
  - - meta
    - name: og:title
      content: Documentazione Node.js - Internazionalizzazione | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Questa sezione della documentazione di Node.js copre il modulo di Internazionalizzazione (Intl), che fornisce accesso a varie funzionalità di internazionalizzazione e localizzazione, inclusi ordinamento, formattazione dei numeri, date e orari, e altro ancora.
  - - meta
    - name: twitter:title
      content: Documentazione Node.js - Internazionalizzazione | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Questa sezione della documentazione di Node.js copre il modulo di Internazionalizzazione (Intl), che fornisce accesso a varie funzionalità di internazionalizzazione e localizzazione, inclusi ordinamento, formattazione dei numeri, date e orari, e altro ancora.
---


# Supporto per l'internazionalizzazione {#internationalization-support}

Node.js possiede molte funzionalità che facilitano la scrittura di programmi internazionalizzati. Alcune di queste sono:

- Funzioni sensibili alle impostazioni locali o consapevoli di Unicode nella [Specifiche del Linguaggio ECMAScript](https://tc39.github.io/ecma262/):
    - [`String.prototype.normalize()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize)
    - [`String.prototype.toLowerCase()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLowerCase)
    - [`String.prototype.toUpperCase()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase)
  
 
- Tutte le funzionalità descritte nella [Specifiche dell'API di Internazionalizzazione ECMAScript](https://tc39.github.io/ecma402/) (aka ECMA-402):
    - Oggetto [`Intl`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)
    - Metodi sensibili alle impostazioni locali come [`String.prototype.localeCompare()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare) e [`Date.prototype.toLocaleString()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString)
  
 
- Il supporto per i [nomi di dominio internazionalizzati](https://en.wikipedia.org/wiki/Internationalized_domain_name) (IDN) del [parser URL WHATWG](/it/nodejs/api/url#the-whatwg-url-api)
- [`require('node:buffer').transcode()`](/it/nodejs/api/buffer#buffertranscodesource-fromenc-toenc)
- Modifica della riga [REPL](/it/nodejs/api/repl#repl) più precisa
- [`require('node:util').TextDecoder`](/it/nodejs/api/util#class-utiltextdecoder)
- [`RegExp` Escape Proprietà Unicode](https://github.com/tc39/proposal-regexp-unicode-property-escapes)

Node.js e il motore V8 sottostante utilizzano [International Components for Unicode (ICU)](http://site.icu-project.org/) per implementare queste funzionalità in codice C/C++ nativo. Il set di dati ICU completo è fornito da Node.js per impostazione predefinita. Tuttavia, a causa delle dimensioni del file di dati ICU, sono disponibili diverse opzioni per personalizzare il set di dati ICU durante la compilazione o l'esecuzione di Node.js.


## Opzioni per la compilazione di Node.js {#options-for-building-nodejs}

Per controllare come ICU viene utilizzato in Node.js, sono disponibili quattro opzioni `configure` durante la compilazione. Ulteriori dettagli su come compilare Node.js sono documentati in [BUILDING.md](https://github.com/nodejs/node/blob/HEAD/BUILDING.md).

- `--with-intl=none`/`--without-intl`
- `--with-intl=system-icu`
- `--with-intl=small-icu`
- `--with-intl=full-icu` (predefinito)

Una panoramica delle funzionalità di Node.js e JavaScript disponibili per ciascuna opzione `configure`:

| Funzionalità | `none` | `system-icu` | `small-icu` | `full-icu` |
|---|---|---|---|---|
| [`String.prototype.normalize()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize) | nessuno (la funzione è un no-op) | completo | completo | completo |
| `String.prototype.to*Case()` | completo | completo | completo | completo |
| [`Intl`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) | nessuno (l'oggetto non esiste) | parziale/completo (dipende dal sistema operativo) | parziale (solo inglese) | completo |
| [`String.prototype.localeCompare()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare) | parziale (non consapevole della localizzazione) | completo | completo | completo |
| `String.prototype.toLocale*Case()` | parziale (non consapevole della localizzazione) | completo | completo | completo |
| [`Number.prototype.toLocaleString()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString) | parziale (non consapevole della localizzazione) | parziale/completo (dipende dal sistema operativo) | parziale (solo inglese) | completo |
| `Date.prototype.toLocale*String()` | parziale (non consapevole della localizzazione) | parziale/completo (dipende dal sistema operativo) | parziale (solo inglese) | completo |
| [Legacy URL Parser](/it/nodejs/api/url#legacy-url-api) | parziale (nessun supporto IDN) | completo | completo | completo |
| [WHATWG URL Parser](/it/nodejs/api/url#the-whatwg-url-api) | parziale (nessun supporto IDN) | completo | completo | completo |
| [`require('node:buffer').transcode()`](/it/nodejs/api/buffer#buffertranscodesource-fromenc-toenc) | nessuno (la funzione non esiste) | completo | completo | completo |
| [REPL](/it/nodejs/api/repl#repl) | parziale (modifica della riga imprecisa) | completo | completo | completo |
| [`require('node:util').TextDecoder`](/it/nodejs/api/util#class-utiltextdecoder) | parziale (supporto codifiche di base) | parziale/completo (dipende dal sistema operativo) | parziale (solo Unicode) | completo |
| [`RegExp` Unicode Property Escapes](https://github.com/tc39/proposal-regexp-unicode-property-escapes) | nessuno (errore `RegExp` non valido) | completo | completo | completo |
La designazione "(non consapevole della localizzazione)" indica che la funzione esegue la sua operazione proprio come la versione non `Locale` della funzione, se esiste. Ad esempio, in modalità `none`, l'operazione di `Date.prototype.toLocaleString()` è identica a quella di `Date.prototype.toString()`.


### Disabilitare tutte le funzionalità di internazionalizzazione (`none`) {#disable-all-internationalization-features-none}

Se si sceglie questa opzione, ICU viene disabilitato e la maggior parte delle funzionalità di internazionalizzazione menzionate sopra **non saranno disponibili** nel binario `node` risultante.

### Compilare con una ICU preinstallata (`system-icu`) {#build-with-a-pre-installed-icu-system-icu}

Node.js può collegarsi a una build di ICU già installata sul sistema. Infatti, la maggior parte delle distribuzioni Linux sono già dotate di ICU installato e questa opzione consentirebbe di riutilizzare lo stesso set di dati utilizzato da altri componenti del sistema operativo.

Le funzionalità che richiedono solo la libreria ICU stessa, come [`String.prototype.normalize()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize) e il [parser URL WHATWG](/it/nodejs/api/url#the-whatwg-url-api), sono pienamente supportate in `system-icu`. Le funzionalità che richiedono anche i dati locali ICU, come [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat), *potrebbero* essere supportate completamente o parzialmente, a seconda della completezza dei dati ICU installati sul sistema.

### Incorporare un insieme limitato di dati ICU (`small-icu`) {#embed-a-limited-set-of-icu-data-small-icu}

Questa opzione fa sì che il binario risultante si colleghi staticamente alla libreria ICU e includa un sottoinsieme di dati ICU (in genere solo le impostazioni locali inglesi) all'interno dell'eseguibile `node`.

Le funzionalità che richiedono solo la libreria ICU stessa, come [`String.prototype.normalize()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize) e il [parser URL WHATWG](/it/nodejs/api/url#the-whatwg-url-api), sono pienamente supportate in `small-icu`. Le funzionalità che richiedono anche i dati locali ICU, come [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat), generalmente funzionano solo con le impostazioni locali inglesi:

```js [ESM]
const january = new Date(9e8);
const english = new Intl.DateTimeFormat('en', { month: 'long' });
const spanish = new Intl.DateTimeFormat('es', { month: 'long' });

console.log(english.format(january));
// Prints "January"
console.log(spanish.format(january));
// Stampa "M01" o "January" su small-icu, a seconda delle impostazioni locali predefinite dell'utente
// Dovrebbe stampare "enero"
```
Questa modalità fornisce un equilibrio tra funzionalità e dimensioni del binario.


#### Fornire dati ICU a runtime {#providing-icu-data-at-runtime}

Se si utilizza l'opzione `small-icu`, è comunque possibile fornire dati locali aggiuntivi a runtime in modo che i metodi JS funzionino per tutte le impostazioni locali ICU. Supponendo che il file di dati sia archiviato in `/runtime/directory/with/dat/file`, può essere reso disponibile a ICU tramite:

- L'opzione di configurazione `--with-icu-default-data-dir`: questa incorpora solo il percorso della directory dei dati predefinita nel binario. Il file di dati effettivo verrà caricato a runtime da questo percorso di directory.
- La variabile d'ambiente [`NODE_ICU_DATA`](/it/nodejs/api/cli#node_icu_datafile):
- Il parametro CLI [`--icu-data-dir`](/it/nodejs/api/cli#--icu-data-dirfile):

Quando ne viene specificato più di uno, il parametro CLI `--icu-data-dir` ha la precedenza più alta, quindi la variabile d'ambiente `NODE_ICU_DATA`, quindi l'opzione di configurazione `--with-icu-default-data-dir`.

ICU è in grado di trovare e caricare automaticamente una varietà di formati di dati, ma i dati devono essere appropriati per la versione ICU e il file deve essere denominato correttamente. Il nome più comune per il file di dati è `icudtX[bl].dat`, dove `X` indica la versione ICU prevista e `b` o `l` indica l'endianness del sistema. Node.js non verrà caricato se il file di dati previsto non può essere letto dalla directory specificata. Il nome del file di dati corrispondente alla versione corrente di Node.js può essere calcolato con:

```js [ESM]
`icudt${process.versions.icu.split('.')[0]}${os.endianness()[0].toLowerCase()}.dat`;
```
Consulta l'articolo ["ICU Data"](http://userguide.icu-project.org/icudata) nella Guida per l'utente di ICU per altri formati supportati e maggiori dettagli sui dati ICU in generale.

Il modulo npm [full-icu](https://www.npmjs.com/package/full-icu) può semplificare notevolmente l'installazione dei dati ICU rilevando la versione ICU dell'eseguibile `node` in esecuzione e scaricando il file di dati appropriato. Dopo aver installato il modulo tramite `npm i full-icu`, il file di dati sarà disponibile in `./node_modules/full-icu`. Questo percorso può quindi essere passato a `NODE_ICU_DATA` o `--icu-data-dir` come mostrato sopra per abilitare il supporto completo `Intl`.


### Incorpora l'intera ICU (`full-icu`) {#embed-the-entire-icu-full-icu}

Questa opzione fa sì che il binario risultante si colleghi a ICU staticamente e includa un set completo di dati ICU. Un binario creato in questo modo non ha ulteriori dipendenze esterne e supporta tutte le localizzazioni, ma potrebbe essere piuttosto grande. Questo è il comportamento predefinito se non viene passato alcun flag `--with-intl`. Anche i binari ufficiali sono costruiti in questa modalità.

## Rilevamento del supporto per l'internazionalizzazione {#detecting-internationalization-support}

Per verificare che ICU sia abilitato (indipendentemente dal fatto che sia `system-icu`, `small-icu` o `full-icu`), dovrebbe essere sufficiente controllare l'esistenza di `Intl`:

```js [ESM]
const hasICU = typeof Intl === 'object';
```
In alternativa, anche controllare `process.versions.icu`, una proprietà definita solo quando ICU è abilitato, funziona:

```js [ESM]
const hasICU = typeof process.versions.icu === 'string';
```
Per verificare il supporto per una localizzazione non inglese (ad esempio, `full-icu` o `system-icu`), [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat) può essere un buon fattore distintivo:

```js [ESM]
const hasFullICU = (() => {
  try {
    const january = new Date(9e8);
    const spanish = new Intl.DateTimeFormat('es', { month: 'long' });
    return spanish.format(january) === 'enero';
  } catch (err) {
    return false;
  }
})();
```
Per test più dettagliati del supporto `Intl`, le seguenti risorse potrebbero essere utili:

- [btest402](https://github.com/srl295/btest402): Generalmente utilizzato per verificare se Node.js con supporto `Intl` è costruito correttamente.
- [Test262](https://github.com/tc39/test262/tree/HEAD/test/intl402): La suite di test di conformità ufficiale di ECMAScript include una sezione dedicata a ECMA-402.

