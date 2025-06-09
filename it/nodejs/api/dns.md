---
title: Documentazione Node.js - DNS
description: Questa sezione della documentazione di Node.js tratta del modulo DNS (Sistema dei Nomi di Dominio), che fornisce funzionalità di risoluzione asincrona dei nomi di rete. Include metodi per risolvere i nomi di dominio in indirizzi IP, ricerche inverse e query di record DNS.
head:
  - - meta
    - name: og:title
      content: Documentazione Node.js - DNS | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Questa sezione della documentazione di Node.js tratta del modulo DNS (Sistema dei Nomi di Dominio), che fornisce funzionalità di risoluzione asincrona dei nomi di rete. Include metodi per risolvere i nomi di dominio in indirizzi IP, ricerche inverse e query di record DNS.
  - - meta
    - name: twitter:title
      content: Documentazione Node.js - DNS | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Questa sezione della documentazione di Node.js tratta del modulo DNS (Sistema dei Nomi di Dominio), che fornisce funzionalità di risoluzione asincrona dei nomi di rete. Include metodi per risolvere i nomi di dominio in indirizzi IP, ricerche inverse e query di record DNS.
---


# DNS {#dns}

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile
:::

**Codice Sorgente:** [lib/dns.js](https://github.com/nodejs/node/blob/v23.5.0/lib/dns.js)

Il modulo `node:dns` abilita la risoluzione dei nomi. Ad esempio, usalo per cercare gli indirizzi IP dei nomi host.

Sebbene denominato per il [Domain Name System (DNS)](https://en.wikipedia.org/wiki/Domain_Name_System), non utilizza sempre il protocollo DNS per le ricerche. [`dns.lookup()`](/it/nodejs/api/dns#dnslookuphostname-options-callback) utilizza le funzionalità del sistema operativo per eseguire la risoluzione dei nomi. Potrebbe non essere necessario eseguire alcuna comunicazione di rete. Per eseguire la risoluzione dei nomi come fanno altre applicazioni sullo stesso sistema, utilizza [`dns.lookup()`](/it/nodejs/api/dns#dnslookuphostname-options-callback).

::: code-group
```js [ESM]
import dns from 'node:dns';

dns.lookup('example.org', (err, address, family) => {
  console.log('address: %j family: IPv%s', address, family);
});
// address: "2606:2800:21f:cb07:6820:80da:af6b:8b2c" family: IPv6
```

```js [CJS]
const dns = require('node:dns');

dns.lookup('example.org', (err, address, family) => {
  console.log('address: %j family: IPv%s', address, family);
});
// address: "2606:2800:21f:cb07:6820:80da:af6b:8b2c" family: IPv6
```
:::

Tutte le altre funzioni nel modulo `node:dns` si connettono a un server DNS effettivo per eseguire la risoluzione dei nomi. Utilizzeranno sempre la rete per eseguire query DNS. Queste funzioni non utilizzano lo stesso set di file di configurazione utilizzati da [`dns.lookup()`](/it/nodejs/api/dns#dnslookuphostname-options-callback) (ad esempio `/etc/hosts`). Utilizza queste funzioni per eseguire sempre query DNS, bypassando altre funzionalità di risoluzione dei nomi.

::: code-group
```js [ESM]
import dns from 'node:dns';

dns.resolve4('archive.org', (err, addresses) => {
  if (err) throw err;

  console.log(`addresses: ${JSON.stringify(addresses)}`);

  addresses.forEach((a) => {
    dns.reverse(a, (err, hostnames) => {
      if (err) {
        throw err;
      }
      console.log(`reverse for ${a}: ${JSON.stringify(hostnames)}`);
    });
  });
});
```

```js [CJS]
const dns = require('node:dns');

dns.resolve4('archive.org', (err, addresses) => {
  if (err) throw err;

  console.log(`addresses: ${JSON.stringify(addresses)}`);

  addresses.forEach((a) => {
    dns.reverse(a, (err, hostnames) => {
      if (err) {
        throw err;
      }
      console.log(`reverse for ${a}: ${JSON.stringify(hostnames)}`);
    });
  });
});
```
:::

Consulta la sezione [Considerazioni sull'implementazione](/it/nodejs/api/dns#implementation-considerations) per ulteriori informazioni.


## Classe: `dns.Resolver` {#class-dnsresolver}

**Aggiunto in: v8.3.0**

Un resolver indipendente per le richieste DNS.

La creazione di un nuovo resolver utilizza le impostazioni predefinite del server. L'impostazione dei server utilizzati per un resolver tramite [`resolver.setServers()`](/it/nodejs/api/dns#dnssetserversservers) non influisce sugli altri resolver:

::: code-group
```js [ESM]
import { Resolver } from 'node:dns';
const resolver = new Resolver();
resolver.setServers(['4.4.4.4']);

// Questa richiesta utilizzerà il server all'indirizzo 4.4.4.4, indipendentemente dalle impostazioni globali.
resolver.resolve4('example.org', (err, addresses) => {
  // ...
});
```

```js [CJS]
const { Resolver } = require('node:dns');
const resolver = new Resolver();
resolver.setServers(['4.4.4.4']);

// Questa richiesta utilizzerà il server all'indirizzo 4.4.4.4, indipendentemente dalle impostazioni globali.
resolver.resolve4('example.org', (err, addresses) => {
  // ...
});
```
:::

Sono disponibili i seguenti metodi dal modulo `node:dns`:

- [`resolver.getServers()`](/it/nodejs/api/dns#dnsgetservers)
- [`resolver.resolve()`](/it/nodejs/api/dns#dnsresolvehostname-rrtype-callback)
- [`resolver.resolve4()`](/it/nodejs/api/dns#dnsresolve4hostname-options-callback)
- [`resolver.resolve6()`](/it/nodejs/api/dns#dnsresolve6hostname-options-callback)
- [`resolver.resolveAny()`](/it/nodejs/api/dns#dnsresolveanyhostname-callback)
- [`resolver.resolveCaa()`](/it/nodejs/api/dns#dnsresolvecaahostname-callback)
- [`resolver.resolveCname()`](/it/nodejs/api/dns#dnsresolvecnamehostname-callback)
- [`resolver.resolveMx()`](/it/nodejs/api/dns#dnsresolvemxhostname-callback)
- [`resolver.resolveNaptr()`](/it/nodejs/api/dns#dnsresolvenaptrhostname-callback)
- [`resolver.resolveNs()`](/it/nodejs/api/dns#dnsresolvenshostname-callback)
- [`resolver.resolvePtr()`](/it/nodejs/api/dns#dnsresolveptrhostname-callback)
- [`resolver.resolveSoa()`](/it/nodejs/api/dns#dnsresolvesoahostname-callback)
- [`resolver.resolveSrv()`](/it/nodejs/api/dns#dnsresolvesrvhostname-callback)
- [`resolver.resolveTxt()`](/it/nodejs/api/dns#dnsresolvetxthostname-callback)
- [`resolver.reverse()`](/it/nodejs/api/dns#dnsreverseip-callback)
- [`resolver.setServers()`](/it/nodejs/api/dns#dnssetserversservers)

### `Resolver([options])` {#resolveroptions}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v16.7.0, v14.18.0 | L'oggetto `options` ora accetta un'opzione `tries`. |
| v12.18.3 | Il costruttore ora accetta un oggetto `options`. L'unica opzione supportata è `timeout`. |
| v8.3.0 | Aggiunto in: v8.3.0 |
:::

Crea un nuovo resolver.

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Timeout della query in millisecondi, oppure `-1` per utilizzare il timeout predefinito.
    - `tries` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di tentativi che il resolver farà per contattare ciascun nameserver prima di rinunciare. **Predefinito:** `4`


### `resolver.cancel()` {#resolvercancel}

**Aggiunto in: v8.3.0**

Annulla tutte le query DNS in sospeso effettuate da questo resolver. Le callback corrispondenti verranno chiamate con un errore con codice `ECANCELLED`.

### `resolver.setLocalAddress([ipv4][, ipv6])` {#resolversetlocaladdressipv4-ipv6}

**Aggiunto in: v15.1.0, v14.17.0**

- `ipv4` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Una rappresentazione stringa di un indirizzo IPv4. **Predefinito:** `'0.0.0.0'`
- `ipv6` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Una rappresentazione stringa di un indirizzo IPv6. **Predefinito:** `'::0'`

L'istanza del resolver invierà le sue richieste dall'indirizzo IP specificato. Ciò consente ai programmi di specificare le interfacce in uscita quando vengono utilizzati su sistemi multi-homed.

Se non viene specificato un indirizzo v4 o v6, viene impostato sul valore predefinito e il sistema operativo sceglierà automaticamente un indirizzo locale.

Il resolver utilizzerà l'indirizzo locale v4 quando effettua richieste ai server DNS IPv4 e l'indirizzo locale v6 quando effettua richieste ai server DNS IPv6. Il `rrtype` delle richieste di risoluzione non ha alcun impatto sull'indirizzo locale utilizzato.

## `dns.getServers()` {#dnsgetservers}

**Aggiunto in: v0.11.3**

- Restituisce: [\<stringa[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Restituisce un array di stringhe di indirizzi IP, formattati secondo [RFC 5952](https://tools.ietf.org/html/rfc5952#section-6), che sono attualmente configurati per la risoluzione DNS. Una stringa includerà una sezione di porta se viene utilizzata una porta personalizzata.

```js [ESM]
[
  '8.8.8.8',
  '2001:4860:4860::8888',
  '8.8.8.8:1053',
  '[2001:4860:4860::8888]:1053',
]
```
## `dns.lookup(hostname[, options], callback)` {#dnslookuphostname-options-callback}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v22.1.0, v20.13.0 | L'opzione `verbatim` è ora obsoleta a favore della nuova opzione `order`. |
| v18.4.0 | Per compatibilità con `node:net`, quando si passa un oggetto opzione, l'opzione `family` può essere la stringa `'IPv4'` o la stringa `'IPv6'`. |
| v18.0.0 | Il passaggio di una callback non valida all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v17.0.0 | Le opzioni `verbatim` ora hanno come impostazione predefinita `true`. |
| v8.5.0 | L'opzione `verbatim` è ora supportata. |
| v1.2.0 | L'opzione `all` è ora supportata. |
| v0.1.90 | Aggiunto in: v0.1.90 |
:::

- `hostname` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `family` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La famiglia di record. Deve essere `4`, `6` o `0`. Per motivi di retrocompatibilità, `'IPv4'` e `'IPv6'` vengono interpretati rispettivamente come `4` e `6`. Il valore `0` indica che viene restituito un indirizzo IPv4 o IPv6. Se il valore `0` viene utilizzato con `{ all: true }` (vedere sotto), viene restituito uno o entrambi gli indirizzi IPv4 e IPv6, a seconda del resolver DNS del sistema. **Predefinito:** `0`.
    - `hints` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Uno o più [flag `getaddrinfo` supportati](/it/nodejs/api/dns#supported-getaddrinfo-flags). È possibile passare più flag tramite l'operatore bit a bit `OR` sui loro valori.
    - `all` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, la callback restituisce tutti gli indirizzi risolti in un array. Altrimenti, restituisce un singolo indirizzo. **Predefinito:** `false`.
    - `order` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Quando `verbatim`, gli indirizzi risolti vengono restituiti non ordinati. Quando `ipv4first`, gli indirizzi risolti vengono ordinati posizionando gli indirizzi IPv4 prima degli indirizzi IPv6. Quando `ipv6first`, gli indirizzi risolti vengono ordinati posizionando gli indirizzi IPv6 prima degli indirizzi IPv4. **Predefinito:** `verbatim` (gli indirizzi non vengono riordinati). Il valore predefinito è configurabile tramite [`dns.setDefaultResultOrder()`](/it/nodejs/api/dns#dnssetdefaultresultorderorder) o [`--dns-result-order`](/it/nodejs/api/cli#--dns-result-orderorder).
    - `verbatim` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, la callback riceve gli indirizzi IPv4 e IPv6 nell'ordine in cui il resolver DNS li ha restituiti. Quando `false`, gli indirizzi IPv4 vengono posizionati prima degli indirizzi IPv6. Questa opzione sarà deprecata a favore di `order`. Quando entrambi sono specificati, `order` ha la precedenza. Il nuovo codice dovrebbe utilizzare solo `order`. **Predefinito:** `true` (gli indirizzi non vengono riordinati). Il valore predefinito è configurabile tramite [`dns.setDefaultResultOrder()`](/it/nodejs/api/dns#dnssetdefaultresultorderorder) o [`--dns-result-order`](/it/nodejs/api/cli#--dns-result-orderorder).
  
 
- `callback` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Errore\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `address` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Una rappresentazione stringa di un indirizzo IPv4 o IPv6.
    - `family` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `4` o `6`, che denota la famiglia di `address`, o `0` se l'indirizzo non è un indirizzo IPv4 o IPv6. `0` è un probabile indicatore di un bug nel servizio di risoluzione dei nomi utilizzato dal sistema operativo.
  
 

Risolve un nome host (es. `'nodejs.org'`) nel primo record A (IPv4) o AAAA (IPv6) trovato. Tutte le proprietà di `option` sono opzionali. Se `options` è un numero intero, deve essere `4` o `6` - se `options` non viene fornito, vengono restituiti indirizzi IPv4 o IPv6, o entrambi, se trovati.

Con l'opzione `all` impostata su `true`, gli argomenti per `callback` cambiano in `(err, addresses)`, con `addresses` che è un array di oggetti con le proprietà `address` e `family`.

In caso di errore, `err` è un oggetto [`Error`](/it/nodejs/api/errors#class-error), dove `err.code` è il codice di errore. Tieni presente che `err.code` verrà impostato su `'ENOTFOUND'` non solo quando il nome host non esiste, ma anche quando la ricerca fallisce in altri modi, ad esempio nessun descrittore di file disponibile.

`dns.lookup()` non ha necessariamente nulla a che fare con il protocollo DNS. L'implementazione utilizza una funzionalità del sistema operativo che può associare i nomi agli indirizzi e viceversa. Questa implementazione può avere conseguenze sottili ma importanti sul comportamento di qualsiasi programma Node.js. Si prega di dedicare un po' di tempo a consultare la [sezione Considerazioni sull'implementazione](/it/nodejs/api/dns#implementation-considerations) prima di utilizzare `dns.lookup()`.

Esempio di utilizzo:



::: code-group
```js [ESM]
import dns from 'node:dns';
const options = {
  family: 6,
  hints: dns.ADDRCONFIG | dns.V4MAPPED,
};
dns.lookup('example.org', options, (err, address, family) =>
  console.log('address: %j family: IPv%s', address, family));
// address: "2606:2800:21f:cb07:6820:80da:af6b:8b2c" family: IPv6

// When options.all is true, the result will be an Array.
options.all = true;
dns.lookup('example.org', options, (err, addresses) =>
  console.log('addresses: %j', addresses));
// addresses: [{"address":"2606:2800:21f:cb07:6820:80da:af6b:8b2c","family":6}]
```

```js [CJS]
const dns = require('node:dns');
const options = {
  family: 6,
  hints: dns.ADDRCONFIG | dns.V4MAPPED,
};
dns.lookup('example.org', options, (err, address, family) =>
  console.log('address: %j family: IPv%s', address, family));
// address: "2606:2800:21f:cb07:6820:80da:af6b:8b2c" family: IPv6

// When options.all is true, the result will be an Array.
options.all = true;
dns.lookup('example.org', options, (err, addresses) =>
  console.log('addresses: %j', addresses));
// addresses: [{"address":"2606:2800:21f:cb07:6820:80da:af6b:8b2c","family":6}]
```
:::

Se questo metodo viene richiamato come versione [`util.promisify()`](/it/nodejs/api/util#utilpromisifyoriginal)ed, e `all` non è impostato su `true`, restituisce una `Promise` per un `Oggetto` con proprietà `address` e `family`.


### Flag getaddrinfo supportati {#supported-getaddrinfo-flags}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v13.13.0, v12.17.0 | Aggiunto il supporto per il flag `dns.ALL`. |
:::

I seguenti flag possono essere passati come suggerimenti a [`dns.lookup()`](/it/nodejs/api/dns#dnslookuphostname-options-callback).

- `dns.ADDRCONFIG`: Limita i tipi di indirizzi restituiti ai tipi di indirizzi non loopback configurati sul sistema. Ad esempio, gli indirizzi IPv4 vengono restituiti solo se il sistema corrente ha almeno un indirizzo IPv4 configurato.
- `dns.V4MAPPED`: Se è stata specificata la famiglia IPv6, ma non sono stati trovati indirizzi IPv6, restituisce indirizzi IPv6 mappati a IPv4. Non è supportato su alcuni sistemi operativi (ad es. FreeBSD 10.1).
- `dns.ALL`: Se `dns.V4MAPPED` è specificato, restituisce sia gli indirizzi IPv6 risolti che gli indirizzi IPv6 mappati a IPv4.

## `dns.lookupService(address, port, callback)` {#dnslookupserviceaddress-port-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare una callback non valida all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v0.11.14 | Aggiunto in: v0.11.14 |
:::

- `address` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `port` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Errore\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `hostname` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) es. `example.com`
    - `service` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) es. `http`

Risolve l'`address` e la `port` specificate in un nome host e un servizio utilizzando l'implementazione `getnameinfo` sottostante del sistema operativo.

Se `address` non è un indirizzo IP valido, verrà generato un `TypeError`. La `port` verrà forzata a un numero. Se non è una porta legale, verrà generato un `TypeError`.

In caso di errore, `err` è un oggetto [`Error`](/it/nodejs/api/errors#class-error), dove `err.code` è il codice di errore.

::: code-group
```js [ESM]
import dns from 'node:dns';
dns.lookupService('127.0.0.1', 22, (err, hostname, service) => {
  console.log(hostname, service);
  // Prints: localhost ssh
});
```

```js [CJS]
const dns = require('node:dns');
dns.lookupService('127.0.0.1', 22, (err, hostname, service) => {
  console.log(hostname, service);
  // Prints: localhost ssh
});
```
:::

Se questo metodo viene invocato come versione [`util.promisify()`](/it/nodejs/api/util#utilpromisifyoriginal)ed, restituisce una `Promise` per un `Object` con proprietà `hostname` e `service`.


## `dns.resolve(hostname[, rrtype], callback)` {#dnsresolvehostname-rrtype-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare una callback non valida all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v0.1.27 | Aggiunto in: v0.1.27 |
:::

- `hostname` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome host da risolvere.
- `rrtype` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Tipo di record di risorsa. **Predefinito:** `'A'`.
- `callback` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Errore\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `records` [\<stringa[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Oggetto[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Utilizza il protocollo DNS per risolvere un nome host (ad esempio `'nodejs.org'`) in un array di record di risorsa. La funzione `callback` ha argomenti `(err, records)`. In caso di successo, `records` sarà un array di record di risorsa. Il tipo e la struttura dei singoli risultati variano in base a `rrtype`:

| `rrtype` | `records` contiene | Tipo di risultato | Metodo abbreviato |
| --- | --- | --- | --- |
| `'A'` | Indirizzi IPv4 (predefinito) | [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dns.resolve4()`](/it/nodejs/api/dns#dnsresolve4hostname-options-callback) |
| `'AAAA'` | Indirizzi IPv6 | [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dns.resolve6()`](/it/nodejs/api/dns#dnsresolve6hostname-options-callback) |
| `'ANY'` | qualsiasi record | [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dns.resolveAny()`](/it/nodejs/api/dns#dnsresolveanyhostname-callback) |
| `'CAA'` | Record di autorizzazione CA | [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dns.resolveCaa()`](/it/nodejs/api/dns#dnsresolvecaahostname-callback) |
| `'CNAME'` | Record del nome canonico | [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dns.resolveCname()`](/it/nodejs/api/dns#dnsresolvecnamehostname-callback) |
| `'MX'` | Record di scambio di posta | [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dns.resolveMx()`](/it/nodejs/api/dns#dnsresolvemxhostname-callback) |
| `'NAPTR'` | Record del puntatore all'autorità del nome | [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dns.resolveNaptr()`](/it/nodejs/api/dns#dnsresolvenaptrhostname-callback) |
| `'NS'` | Record del server dei nomi | [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dns.resolveNs()`](/it/nodejs/api/dns#dnsresolvenshostname-callback) |
| `'PTR'` | Record del puntatore | [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dns.resolvePtr()`](/it/nodejs/api/dns#dnsresolveptrhostname-callback) |
| `'SOA'` | Record di inizio di autorità | [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dns.resolveSoa()`](/it/nodejs/api/dns#dnsresolvesoahostname-callback) |
| `'SRV'` | Record di servizio | [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dns.resolveSrv()`](/it/nodejs/api/dns#dnsresolvesrvhostname-callback) |
| `'TXT'` | Record di testo | [\<stringa[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dns.resolveTxt()`](/it/nodejs/api/dns#dnsresolvetxthostname-callback) |

In caso di errore, `err` è un oggetto [`Error`](/it/nodejs/api/errors#class-error), dove `err.code` è uno dei [codici di errore DNS](/it/nodejs/api/dns#error-codes).


## `dns.resolve4(hostname[, options], callback)` {#dnsresolve4hostname-options-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare un callback non valido all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v7.2.0 | Questo metodo ora supporta il passaggio di `options`, nello specifico `options.ttl`. |
| v0.1.16 | Aggiunto in: v0.1.16 |
:::

- `hostname` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome host da risolvere.
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ttl` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Recupera il valore Time-To-Live (TTL) di ciascun record. Quando `true`, il callback riceve un array di oggetti `{ address: '1.2.3.4', ttl: 60 }` invece di un array di stringhe, con il TTL espresso in secondi.


- `callback` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Errore\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<stringa[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Oggetto[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)


Utilizza il protocollo DNS per risolvere gli indirizzi IPv4 (record `A`) per il `hostname`. L'argomento `addresses` passato alla funzione `callback` conterrà un array di indirizzi IPv4 (ad esempio `['74.125.79.104', '74.125.79.105', '74.125.79.106']`).

## `dns.resolve6(hostname[, options], callback)` {#dnsresolve6hostname-options-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare un callback non valido all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v7.2.0 | Questo metodo ora supporta il passaggio di `options`, nello specifico `options.ttl`. |
| v0.1.16 | Aggiunto in: v0.1.16 |
:::

- `hostname` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome host da risolvere.
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ttl` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Recupera il valore Time-To-Live (TTL) di ciascun record. Quando `true`, il callback riceve un array di oggetti `{ address: '0:1:2:3:4:5:6:7', ttl: 60 }` invece di un array di stringhe, con il TTL espresso in secondi.


- `callback` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Errore\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<stringa[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Oggetto[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)


Utilizza il protocollo DNS per risolvere gli indirizzi IPv6 (record `AAAA`) per il `hostname`. L'argomento `addresses` passato alla funzione `callback` conterrà un array di indirizzi IPv6.


## `dns.resolveAny(hostname, callback)` {#dnsresolveanyhostname-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare un callback non valido all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
:::

- `hostname` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Errore\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `ret` [\<Oggetto[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Utilizza il protocollo DNS per risolvere tutti i record (conosciuti anche come query `ANY` o `*`). L'argomento `ret` passato alla funzione `callback` sarà un array contenente vari tipi di record. Ogni oggetto ha una proprietà `type` che indica il tipo del record corrente. E a seconda del `type`, sull'oggetto saranno presenti proprietà aggiuntive:

| Tipo | Proprietà |
| --- | --- |
| `'A'` | `address`  /  `ttl` |
| `'AAAA'` | `address`  /  `ttl` |
| `'CNAME'` | `value` |
| `'MX'` | Fare riferimento a [`dns.resolveMx()`](/it/nodejs/api/dns#dnsresolvemxhostname-callback) |
| `'NAPTR'` | Fare riferimento a [`dns.resolveNaptr()`](/it/nodejs/api/dns#dnsresolvenaptrhostname-callback) |
| `'NS'` | `value` |
| `'PTR'` | `value` |
| `'SOA'` | Fare riferimento a [`dns.resolveSoa()`](/it/nodejs/api/dns#dnsresolvesoahostname-callback) |
| `'SRV'` | Fare riferimento a [`dns.resolveSrv()`](/it/nodejs/api/dns#dnsresolvesrvhostname-callback) |
| `'TXT'` | Questo tipo di record contiene una proprietà array chiamata `entries` che fa riferimento a [`dns.resolveTxt()`](/it/nodejs/api/dns#dnsresolvetxthostname-callback), ad esempio `{ entries: ['...'], type: 'TXT' }` |
Ecco un esempio dell'oggetto `ret` passato al callback:

```js [ESM]
[ { type: 'A', address: '127.0.0.1', ttl: 299 },
  { type: 'CNAME', value: 'example.com' },
  { type: 'MX', exchange: 'alt4.aspmx.l.example.com', priority: 50 },
  { type: 'NS', value: 'ns1.example.com' },
  { type: 'TXT', entries: [ 'v=spf1 include:_spf.example.com ~all' ] },
  { type: 'SOA',
    nsname: 'ns1.example.com',
    hostmaster: 'admin.example.com',
    serial: 156696742,
    refresh: 900,
    retry: 900,
    expire: 1800,
    minttl: 60 } ]
```
Gli operatori dei server DNS potrebbero scegliere di non rispondere alle query `ANY`. Potrebbe essere meglio chiamare metodi individuali come [`dns.resolve4()`](/it/nodejs/api/dns#dnsresolve4hostname-options-callback), [`dns.resolveMx()`](/it/nodejs/api/dns#dnsresolvemxhostname-callback) e così via. Per maggiori dettagli, vedere [RFC 8482](https://tools.ietf.org/html/rfc8482).


## `dns.resolveCname(hostname, callback)` {#dnsresolvecnamehostname-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare un callback non valido all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v0.3.2 | Aggiunto in: v0.3.2 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Utilizza il protocollo DNS per risolvere i record `CNAME` per l'`hostname`. L'argomento `addresses` passato alla funzione `callback` conterrà un array di record di nomi canonici disponibili per l'`hostname` (ad esempio `['bar.example.com']`).

## `dns.resolveCaa(hostname, callback)` {#dnsresolvecaahostname-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare un callback non valido all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v15.0.0, v14.17.0 | Aggiunto in: v15.0.0, v14.17.0 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `records` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Utilizza il protocollo DNS per risolvere i record `CAA` per l'`hostname`. L'argomento `addresses` passato alla funzione `callback` conterrà un array di record di autorizzazione dell'autorità di certificazione disponibili per l'`hostname` (ad esempio `[{critical: 0, iodef: 'mailto:pki@example.com'}, {critical: 128, issue: 'pki.example.com'}]`).


## `dns.resolveMx(hostname, callback)` {#dnsresolvemxhostname-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare un callback non valido all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v0.1.27 | Aggiunto in: v0.1.27 |
:::

- `hostname` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Errore\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<Oggetto[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  
 

Utilizza il protocollo DNS per risolvere i record di scambio di posta (`MX` record) per l'`hostname`. L'argomento `addresses` passato alla funzione `callback` conterrà un array di oggetti contenenti sia una proprietà `priority` che una `exchange` (ad es. `[{priority: 10, exchange: 'mx.example.com'}, ...]` ).

## `dns.resolveNaptr(hostname, callback)` {#dnsresolvenaptrhostname-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare un callback non valido all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v0.9.12 | Aggiunto in: v0.9.12 |
:::

- `hostname` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Errore\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<Oggetto[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  
 

Utilizza il protocollo DNS per risolvere i record basati su espressioni regolari (`NAPTR` record) per l'`hostname`. L'argomento `addresses` passato alla funzione `callback` conterrà un array di oggetti con le seguenti proprietà:

- `flags`
- `service`
- `regexp`
- `replacement`
- `order`
- `preference`

```js [ESM]
{
  flags: 's',
  service: 'SIP+D2U',
  regexp: '',
  replacement: '_sip._udp.example.com',
  order: 30,
  preference: 100
}
```

## `dns.resolveNs(hostname, callback)` {#dnsresolvenshostname-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare una callback non valida all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v0.1.90 | Aggiunto in: v0.1.90 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Utilizza il protocollo DNS per risolvere i record del name server (record `NS`) per l'`hostname`. L'argomento `addresses` passato alla funzione `callback` conterrà un array di record del name server disponibili per `hostname` (ad esempio `['ns1.example.com', 'ns2.example.com']`).

## `dns.resolvePtr(hostname, callback)` {#dnsresolveptrhostname-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare una callback non valida all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v6.0.0 | Aggiunto in: v6.0.0 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Utilizza il protocollo DNS per risolvere i record pointer (record `PTR`) per l'`hostname`. L'argomento `addresses` passato alla funzione `callback` sarà un array di stringhe contenenti i record di risposta.

## `dns.resolveSoa(hostname, callback)` {#dnsresolvesoahostname-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare una callback non valida all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v0.11.10 | Aggiunto in: v0.11.10 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `address` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Utilizza il protocollo DNS per risolvere un record di inizio autorità (record `SOA`) per l'`hostname`. L'argomento `address` passato alla funzione `callback` sarà un oggetto con le seguenti proprietà:

- `nsname`
- `hostmaster`
- `serial`
- `refresh`
- `retry`
- `expire`
- `minttl`

```js [ESM]
{
  nsname: 'ns.example.com',
  hostmaster: 'root.example.com',
  serial: 2013101809,
  refresh: 10000,
  retry: 2400,
  expire: 604800,
  minttl: 3600
}
```

## `dns.resolveSrv(hostname, callback)` {#dnsresolvesrvhostname-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare un callback non valido all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v0.1.27 | Aggiunto in: v0.1.27 |
:::

- `hostname` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Errore\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<Oggetto[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)



Utilizza il protocollo DNS per risolvere i record di servizio (record `SRV`) per l'`hostname`. L'argomento `addresses` passato alla funzione `callback` sarà un array di oggetti con le seguenti proprietà:

- `priority`
- `weight`
- `port`
- `name`

```js [ESM]
{
  priority: 10,
  weight: 5,
  port: 21223,
  name: 'service.example.com'
}
```
## `dns.resolveTxt(hostname, callback)` {#dnsresolvetxthostname-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare un callback non valido all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v0.1.27 | Aggiunto in: v0.1.27 |
:::

- `hostname` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Errore\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `records` [\<stringa[][]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)



Utilizza il protocollo DNS per risolvere le query di testo (record `TXT`) per l'`hostname`. L'argomento `records` passato alla funzione `callback` è un array bidimensionale dei record di testo disponibili per `hostname` (ad esempio `[ ['v=spf1 ip4:0.0.0.0 ', '~all' ] ]`). Ogni sotto-array contiene blocchi TXT di un record. A seconda del caso d'uso, questi potrebbero essere uniti insieme o trattati separatamente.


## `dns.reverse(ip, callback)` {#dnsreverseip-callback}

**Aggiunto in: v0.1.16**

- `ip` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Errore\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `hostnames` [\<stringa[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Esegue una query DNS inversa che risolve un indirizzo IPv4 o IPv6 in un array di nomi host.

In caso di errore, `err` è un oggetto [`Error`](/it/nodejs/api/errors#class-error), dove `err.code` è uno dei [codici di errore DNS](/it/nodejs/api/dns#error-codes).

## `dns.setDefaultResultOrder(order)` {#dnssetdefaultresultorderorder}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v22.1.0, v20.13.0 | Ora è supportato il valore `ipv6first`. |
| v17.0.0 | Valore predefinito modificato in `verbatim`. |
| v16.4.0, v14.18.0 | Aggiunto in: v16.4.0, v14.18.0 |
:::

- `order` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) deve essere `'ipv4first'`, `'ipv6first'` o `'verbatim'`.

Imposta il valore predefinito di `order` in [`dns.lookup()`](/it/nodejs/api/dns#dnslookuphostname-options-callback) e [`dnsPromises.lookup()`](/it/nodejs/api/dns#dnspromiseslookuphostname-options). Il valore può essere:

- `ipv4first`: imposta `order` predefinito su `ipv4first`.
- `ipv6first`: imposta `order` predefinito su `ipv6first`.
- `verbatim`: imposta `order` predefinito su `verbatim`.

Il valore predefinito è `verbatim` e [`dns.setDefaultResultOrder()`](/it/nodejs/api/dns#dnssetdefaultresultorderorder) ha una priorità più alta rispetto a [`--dns-result-order`](/it/nodejs/api/cli#--dns-result-orderorder). Quando si utilizzano i [thread worker](/it/nodejs/api/worker_threads), [`dns.setDefaultResultOrder()`](/it/nodejs/api/dns#dnssetdefaultresultorderorder) dal thread principale non influirà sugli ordini DNS predefiniti nei worker.

## `dns.getDefaultResultOrder()` {#dnsgetdefaultresultorder}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v22.1.0, v20.13.0 | Ora è supportato il valore `ipv6first`. |
| v20.1.0, v18.17.0 | Aggiunto in: v20.1.0, v18.17.0 |
:::

Ottieni il valore predefinito per `order` in [`dns.lookup()`](/it/nodejs/api/dns#dnslookuphostname-options-callback) e [`dnsPromises.lookup()`](/it/nodejs/api/dns#dnspromiseslookuphostname-options). Il valore può essere:

- `ipv4first`: per `order` impostato di default su `ipv4first`.
- `ipv6first`: per `order` impostato di default su `ipv6first`.
- `verbatim`: per `order` impostato di default su `verbatim`.


## `dns.setServers(servers)` {#dnssetserversservers}

**Aggiunto in: v0.11.3**

- `servers` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) array di indirizzi formattati [RFC 5952](https://tools.ietf.org/html/rfc5952#section-6)

Imposta l'indirizzo IP e la porta dei server da utilizzare quando si esegue la risoluzione DNS. L'argomento `servers` è un array di indirizzi formattati [RFC 5952](https://tools.ietf.org/html/rfc5952#section-6). Se la porta è la porta DNS predefinita IANA (53) può essere omessa.

```js [ESM]
dns.setServers([
  '8.8.8.8',
  '[2001:4860:4860::8888]',
  '8.8.8.8:1053',
  '[2001:4860:4860::8888]:1053',
]);
```
Verrà generato un errore se viene fornito un indirizzo non valido.

Il metodo `dns.setServers()` non deve essere chiamato mentre è in corso una query DNS.

Il metodo [`dns.setServers()`](/it/nodejs/api/dns#dnssetserversservers) influisce solo su [`dns.resolve()`](/it/nodejs/api/dns#dnsresolvehostname-rrtype-callback), `dns.resolve*()` e [`dns.reverse()`](/it/nodejs/api/dns#dnsreverseip-callback) (e specificamente *non* [`dns.lookup()`](/it/nodejs/api/dns#dnslookuphostname-options-callback)).

Questo metodo funziona in modo molto simile a [resolve.conf](https://man7.org/linux/man-pages/man5/resolv.conf.5). Vale a dire che, se il tentativo di risoluzione con il primo server fornito genera un errore `NOTFOUND`, il metodo `resolve()` *non* tenterà di risolvere con i server successivi forniti. I server DNS di fallback verranno utilizzati solo se i precedenti vanno in timeout o generano qualche altro errore.

## API promises DNS {#dns-promises-api}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v15.0.0 | Esposto come `require('dns/promises')`. |
| v11.14.0, v10.17.0 | Questa API non è più sperimentale. |
| v10.6.0 | Aggiunto in: v10.6.0 |
:::

L'API `dns.promises` fornisce un insieme alternativo di metodi DNS asincroni che restituiscono oggetti `Promise` anziché utilizzare callback. L'API è accessibile tramite `require('node:dns').promises` o `require('node:dns/promises')`.

### Classe: `dnsPromises.Resolver` {#class-dnspromisesresolver}

**Aggiunto in: v10.6.0**

Un resolver indipendente per le richieste DNS.

La creazione di un nuovo resolver utilizza le impostazioni predefinite del server. L'impostazione dei server utilizzati per un resolver tramite [`resolver.setServers()`](/it/nodejs/api/dns#dnspromisessetserversservers) non influisce su altri resolver:

::: code-group
```js [ESM]
import { Resolver } from 'node:dns/promises';
const resolver = new Resolver();
resolver.setServers(['4.4.4.4']);

// Questa richiesta utilizzerà il server all'indirizzo 4.4.4.4, indipendentemente dalle impostazioni globali.
const addresses = await resolver.resolve4('example.org');
```

```js [CJS]
const { Resolver } = require('node:dns').promises;
const resolver = new Resolver();
resolver.setServers(['4.4.4.4']);

// Questa richiesta utilizzerà il server all'indirizzo 4.4.4.4, indipendentemente dalle impostazioni globali.
resolver.resolve4('example.org').then((addresses) => {
  // ...
});

// In alternativa, lo stesso codice può essere scritto usando lo stile async-await.
(async function() {
  const addresses = await resolver.resolve4('example.org');
})();
```
:::

Sono disponibili i seguenti metodi dall'API `dnsPromises`:

- [`resolver.getServers()`](/it/nodejs/api/dns#dnspromisesgetservers)
- [`resolver.resolve()`](/it/nodejs/api/dns#dnspromisesresolvehostname-rrtype)
- [`resolver.resolve4()`](/it/nodejs/api/dns#dnspromisesresolve4hostname-options)
- [`resolver.resolve6()`](/it/nodejs/api/dns#dnspromisesresolve6hostname-options)
- [`resolver.resolveAny()`](/it/nodejs/api/dns#dnspromisesresolveanyhostname)
- [`resolver.resolveCaa()`](/it/nodejs/api/dns#dnspromisesresolvecaahostname)
- [`resolver.resolveCname()`](/it/nodejs/api/dns#dnspromisesresolvecnamehostname)
- [`resolver.resolveMx()`](/it/nodejs/api/dns#dnspromisesresolvemxhostname)
- [`resolver.resolveNaptr()`](/it/nodejs/api/dns#dnspromisesresolvenaptrhostname)
- [`resolver.resolveNs()`](/it/nodejs/api/dns#dnspromisesresolvenshostname)
- [`resolver.resolvePtr()`](/it/nodejs/api/dns#dnspromisesresolveptrhostname)
- [`resolver.resolveSoa()`](/it/nodejs/api/dns#dnspromisesresolvesoahostname)
- [`resolver.resolveSrv()`](/it/nodejs/api/dns#dnspromisesresolvesrvhostname)
- [`resolver.resolveTxt()`](/it/nodejs/api/dns#dnspromisesresolvetxthostname)
- [`resolver.reverse()`](/it/nodejs/api/dns#dnspromisesreverseip)
- [`resolver.setServers()`](/it/nodejs/api/dns#dnspromisessetserversservers)


### `resolver.cancel()` {#resolvercancel_1}

**Aggiunto in: v15.3.0, v14.17.0**

Annulla tutte le query DNS in sospeso eseguite da questo resolver. Le promesse corrispondenti verranno rifiutate con un errore con il codice `ECANCELLED`.

### `dnsPromises.getServers()` {#dnspromisesgetservers}

**Aggiunto in: v10.6.0**

- Restituisce: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Restituisce un array di stringhe di indirizzi IP, formattate secondo [RFC 5952](https://tools.ietf.org/html/rfc5952#section-6), che sono attualmente configurate per la risoluzione DNS. Una stringa includerà una sezione di porta se viene utilizzata una porta personalizzata.

```js [ESM]
[
  '8.8.8.8',
  '2001:4860:4860::8888',
  '8.8.8.8:1053',
  '[2001:4860:4860::8888]:1053',
]
```
### `dnsPromises.lookup(hostname[, options])` {#dnspromiseslookuphostname-options}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v22.1.0, v20.13.0 | L'opzione `verbatim` è ora deprecata a favore della nuova opzione `order`. |
| v10.6.0 | Aggiunto in: v10.6.0 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `family` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La famiglia di record. Deve essere `4`, `6` o `0`. Il valore `0` indica che viene restituito un indirizzo IPv4 o IPv6. Se il valore `0` viene utilizzato con `{ all: true }` (vedi sotto), viene restituito uno o entrambi gli indirizzi IPv4 e IPv6, a seconda del resolver DNS del sistema. **Predefinito:** `0`.
    - `hints` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Uno o più [flag `getaddrinfo` supportati](/it/nodejs/api/dns#supported-getaddrinfo-flags). È possibile passare più flag eseguendo l'`OR` bit a bit dei loro valori.
    - `all` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, la `Promise` viene risolta con tutti gli indirizzi in un array. Altrimenti, restituisce un singolo indirizzo. **Predefinito:** `false`.
    - `order` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Quando `verbatim`, la `Promise` viene risolta con indirizzi IPv4 e IPv6 nell'ordine in cui il resolver DNS li ha restituiti. Quando `ipv4first`, gli indirizzi IPv4 vengono posizionati prima degli indirizzi IPv6. Quando `ipv6first`, gli indirizzi IPv6 vengono posizionati prima degli indirizzi IPv4. **Predefinito:** `verbatim` (gli indirizzi non vengono riordinati). Il valore predefinito è configurabile tramite [`dns.setDefaultResultOrder()`](/it/nodejs/api/dns#dnssetdefaultresultorderorder) o [`--dns-result-order`](/it/nodejs/api/cli#--dns-result-orderorder). Il nuovo codice dovrebbe usare `{ order: 'verbatim' }`.
    - `verbatim` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, la `Promise` viene risolta con indirizzi IPv4 e IPv6 nell'ordine in cui il resolver DNS li ha restituiti. Quando `false`, gli indirizzi IPv4 vengono posizionati prima degli indirizzi IPv6. Questa opzione sarà deprecata a favore di `order`. Quando entrambi sono specificati, `order` ha una precedenza maggiore. Il nuovo codice dovrebbe usare solo `order`. **Predefinito:** attualmente `false` (gli indirizzi vengono riordinati) ma si prevede che questo cambierà in un futuro non troppo lontano. Il valore predefinito è configurabile tramite [`dns.setDefaultResultOrder()`](/it/nodejs/api/dns#dnssetdefaultresultorderorder) o [`--dns-result-order`](/it/nodejs/api/cli#--dns-result-orderorder).
  
 

Risolve un nome host (ad es. `'nodejs.org'`) nel primo record A (IPv4) o AAAA (IPv6) trovato. Tutte le proprietà `option` sono opzionali. Se `options` è un intero, allora deve essere `4` o `6` - se `options` non viene fornito, allora vengono restituiti indirizzi IPv4 o IPv6, o entrambi, se trovati.

Con l'opzione `all` impostata su `true`, la `Promise` viene risolta con `addresses` come un array di oggetti con le proprietà `address` e `family`.

In caso di errore, la `Promise` viene rifiutata con un oggetto [`Error`](/it/nodejs/api/errors#class-error), dove `err.code` è il codice di errore. Tieni presente che `err.code` sarà impostato su `'ENOTFOUND'` non solo quando il nome host non esiste, ma anche quando la ricerca fallisce in altri modi, ad esempio nessun descrittore di file disponibile.

[`dnsPromises.lookup()`](/it/nodejs/api/dns#dnspromiseslookuphostname-options) non ha necessariamente nulla a che fare con il protocollo DNS. L'implementazione utilizza una funzionalità del sistema operativo che può associare nomi a indirizzi e viceversa. Questa implementazione può avere conseguenze sottili ma importanti sul comportamento di qualsiasi programma Node.js. Si prega di dedicare un po' di tempo a consultare la [sezione Considerazioni sull'implementazione](/it/nodejs/api/dns#implementation-considerations) prima di utilizzare `dnsPromises.lookup()`.

Esempio di utilizzo:



::: code-group
```js [ESM]
import dns from 'node:dns';
const dnsPromises = dns.promises;
const options = {
  family: 6,
  hints: dns.ADDRCONFIG | dns.V4MAPPED,
};

await dnsPromises.lookup('example.org', options).then((result) => {
  console.log('address: %j family: IPv%s', result.address, result.family);
  // address: "2606:2800:21f:cb07:6820:80da:af6b:8b2c" family: IPv6
});

// When options.all is true, the result will be an Array.
options.all = true;
await dnsPromises.lookup('example.org', options).then((result) => {
  console.log('addresses: %j', result);
  // addresses: [{"address":"2606:2800:21f:cb07:6820:80da:af6b:8b2c","family":6}]
});
```

```js [CJS]
const dns = require('node:dns');
const dnsPromises = dns.promises;
const options = {
  family: 6,
  hints: dns.ADDRCONFIG | dns.V4MAPPED,
};

dnsPromises.lookup('example.org', options).then((result) => {
  console.log('address: %j family: IPv%s', result.address, result.family);
  // address: "2606:2800:21f:cb07:6820:80da:af6b:8b2c" family: IPv6
});

// When options.all is true, the result will be an Array.
options.all = true;
dnsPromises.lookup('example.org', options).then((result) => {
  console.log('addresses: %j', result);
  // addresses: [{"address":"2606:2800:21f:cb07:6820:80da:af6b:8b2c","family":6}]
});
```
:::


### `dnsPromises.lookupService(address, port)` {#dnspromiseslookupserviceaddress-port}

**Aggiunto in: v10.6.0**

- `address` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `port` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Risolve l'`address` e la `port` forniti in un nome host e un servizio utilizzando l'implementazione `getnameinfo` sottostante del sistema operativo.

Se `address` non è un indirizzo IP valido, verrà generato un `TypeError`. La `port` verrà forzata a un numero. Se non è una porta legale, verrà generato un `TypeError`.

In caso di errore, la `Promise` viene rifiutata con un oggetto [`Error`](/it/nodejs/api/errors#class-error), dove `err.code` è il codice di errore.

::: code-group
```js [ESM]
import dnsPromises from 'node:dns/promises';
const result = await dnsPromises.lookupService('127.0.0.1', 22);

console.log(result.hostname, result.service); // Prints: localhost ssh
```

```js [CJS]
const dnsPromises = require('node:dns').promises;
dnsPromises.lookupService('127.0.0.1', 22).then((result) => {
  console.log(result.hostname, result.service);
  // Prints: localhost ssh
});
```
:::

### `dnsPromises.resolve(hostname[, rrtype])` {#dnspromisesresolvehostname-rrtype}

**Aggiunto in: v10.6.0**

- `hostname` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome host da risolvere.
- `rrtype` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Tipo di record di risorsa. **Predefinito:** `'A'`.

Utilizza il protocollo DNS per risolvere un nome host (ad esempio `'nodejs.org'`) in un array di record di risorsa. Quando ha successo, la `Promise` viene risolta con un array di record di risorsa. Il tipo e la struttura dei singoli risultati variano in base a `rrtype`:

| `rrtype` | `records` contains | Tipo di risultato | Metodo abbreviato |
| --- | --- | --- | --- |
| `'A'` | indirizzi IPv4 (predefinito) | [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dnsPromises.resolve4()`](/it/nodejs/api/dns#dnspromisesresolve4hostname-options) |
| `'AAAA'` | indirizzi IPv6 | [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dnsPromises.resolve6()`](/it/nodejs/api/dns#dnspromisesresolve6hostname-options) |
| `'ANY'` | qualsiasi record | [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dnsPromises.resolveAny()`](/it/nodejs/api/dns#dnspromisesresolveanyhostname) |
| `'CAA'` | record di autorizzazione CA | [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dnsPromises.resolveCaa()`](/it/nodejs/api/dns#dnspromisesresolvecaahostname) |
| `'CNAME'` | record di nome canonico | [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dnsPromises.resolveCname()`](/it/nodejs/api/dns#dnspromisesresolvecnamehostname) |
| `'MX'` | record di scambio di posta | [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dnsPromises.resolveMx()`](/it/nodejs/api/dns#dnspromisesresolvemxhostname) |
| `'NAPTR'` | record di puntatore di autorità del nome | [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dnsPromises.resolveNaptr()`](/it/nodejs/api/dns#dnspromisesresolvenaptrhostname) |
| `'NS'` | record del server dei nomi | [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dnsPromises.resolveNs()`](/it/nodejs/api/dns#dnspromisesresolvenshostname) |
| `'PTR'` | record puntatore | [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dnsPromises.resolvePtr()`](/it/nodejs/api/dns#dnspromisesresolveptrhostname) |
| `'SOA'` | record di inizio di autorità | [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dnsPromises.resolveSoa()`](/it/nodejs/api/dns#dnspromisesresolvesoahostname) |
| `'SRV'` | record di servizio | [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dnsPromises.resolveSrv()`](/it/nodejs/api/dns#dnspromisesresolvesrvhostname) |
| `'TXT'` | record di testo | [\<stringa[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dnsPromises.resolveTxt()`](/it/nodejs/api/dns#dnspromisesresolvetxthostname) |
In caso di errore, la `Promise` viene rifiutata con un oggetto [`Error`](/it/nodejs/api/errors#class-error), dove `err.code` è uno dei [codici di errore DNS](/it/nodejs/api/dns#error-codes).


### `dnsPromises.resolve4(hostname[, options])` {#dnspromisesresolve4hostname-options}

**Aggiunto in: v10.6.0**

- `hostname` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome host da risolvere.
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ttl` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Recupera il valore Time-To-Live (TTL) di ogni record. Quando `true`, la `Promise` viene risolta con un array di oggetti `{ address: '1.2.3.4', ttl: 60 }` anziché un array di stringhe, con il TTL espresso in secondi.

Utilizza il protocollo DNS per risolvere gli indirizzi IPv4 (record `A`) per il `hostname`. In caso di successo, la `Promise` viene risolta con un array di indirizzi IPv4 (ad es. `['74.125.79.104', '74.125.79.105', '74.125.79.106']`).

### `dnsPromises.resolve6(hostname[, options])` {#dnspromisesresolve6hostname-options}

**Aggiunto in: v10.6.0**

- `hostname` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome host da risolvere.
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ttl` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Recupera il valore Time-To-Live (TTL) di ogni record. Quando `true`, la `Promise` viene risolta con un array di oggetti `{ address: '0:1:2:3:4:5:6:7', ttl: 60 }` anziché un array di stringhe, con il TTL espresso in secondi.

Utilizza il protocollo DNS per risolvere gli indirizzi IPv6 (record `AAAA`) per il `hostname`. In caso di successo, la `Promise` viene risolta con un array di indirizzi IPv6.

### `dnsPromises.resolveAny(hostname)` {#dnspromisesresolveanyhostname}

**Aggiunto in: v10.6.0**

- `hostname` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Utilizza il protocollo DNS per risolvere tutti i record (noto anche come query `ANY` o `*`). In caso di successo, la `Promise` viene risolta con un array contenente vari tipi di record. Ogni oggetto ha una proprietà `type` che indica il tipo del record corrente. E a seconda del `type`, saranno presenti proprietà aggiuntive sull'oggetto:

| Tipo | Proprietà |
| --- | --- |
| `'A'` | `address`  /  `ttl` |
| `'AAAA'` | `address`  /  `ttl` |
| `'CNAME'` | `value` |
| `'MX'` | Fare riferimento a [`dnsPromises.resolveMx()`](/it/nodejs/api/dns#dnspromisesresolvemxhostname) |
| `'NAPTR'` | Fare riferimento a [`dnsPromises.resolveNaptr()`](/it/nodejs/api/dns#dnspromisesresolvenaptrhostname) |
| `'NS'` | `value` |
| `'PTR'` | `value` |
| `'SOA'` | Fare riferimento a [`dnsPromises.resolveSoa()`](/it/nodejs/api/dns#dnspromisesresolvesoahostname) |
| `'SRV'` | Fare riferimento a [`dnsPromises.resolveSrv()`](/it/nodejs/api/dns#dnspromisesresolvesrvhostname) |
| `'TXT'` | Questo tipo di record contiene una proprietà array chiamata `entries` che fa riferimento a [`dnsPromises.resolveTxt()`](/it/nodejs/api/dns#dnspromisesresolvetxthostname) , ad es. `{ entries: ['...'], type: 'TXT' }` |
Ecco un esempio dell'oggetto risultato:

```js [ESM]
[ { type: 'A', address: '127.0.0.1', ttl: 299 },
  { type: 'CNAME', value: 'example.com' },
  { type: 'MX', exchange: 'alt4.aspmx.l.example.com', priority: 50 },
  { type: 'NS', value: 'ns1.example.com' },
  { type: 'TXT', entries: [ 'v=spf1 include:_spf.example.com ~all' ] },
  { type: 'SOA',
    nsname: 'ns1.example.com',
    hostmaster: 'admin.example.com',
    serial: 156696742,
    refresh: 900,
    retry: 900,
    expire: 1800,
    minttl: 60 } ]
```

### `dnsPromises.resolveCaa(hostname)` {#dnspromisesresolvecaahostname}

**Aggiunto in: v15.0.0, v14.17.0**

- `hostname` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Utilizza il protocollo DNS per risolvere i record `CAA` per l'`hostname`. In caso di successo, la `Promise` viene risolta con un array di oggetti contenenti i record di autorizzazione dell'autorità di certificazione disponibili per l'`hostname` (ad esempio `[{critical: 0, iodef: 'mailto:pki@example.com'},{critical: 128, issue: 'pki.example.com'}]`).

### `dnsPromises.resolveCname(hostname)` {#dnspromisesresolvecnamehostname}

**Aggiunto in: v10.6.0**

- `hostname` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Utilizza il protocollo DNS per risolvere i record `CNAME` per l'`hostname`. In caso di successo, la `Promise` viene risolta con un array di record di nomi canonici disponibili per l'`hostname` (ad esempio `['bar.example.com']`).

### `dnsPromises.resolveMx(hostname)` {#dnspromisesresolvemxhostname}

**Aggiunto in: v10.6.0**

- `hostname` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Utilizza il protocollo DNS per risolvere i record di scambio di posta (`MX` record) per l'`hostname`. In caso di successo, la `Promise` viene risolta con un array di oggetti contenenti sia una proprietà `priority` che una proprietà `exchange` (ad esempio `[{priority: 10, exchange: 'mx.example.com'}, ...]`).

### `dnsPromises.resolveNaptr(hostname)` {#dnspromisesresolvenaptrhostname}

**Aggiunto in: v10.6.0**

- `hostname` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Utilizza il protocollo DNS per risolvere i record basati su espressioni regolari (record `NAPTR`) per l'`hostname`. In caso di successo, la `Promise` viene risolta con un array di oggetti con le seguenti proprietà:

- `flags`
- `service`
- `regexp`
- `replacement`
- `order`
- `preference`

```js [ESM]
{
  flags: 's',
  service: 'SIP+D2U',
  regexp: '',
  replacement: '_sip._udp.example.com',
  order: 30,
  preference: 100
}
```
### `dnsPromises.resolveNs(hostname)` {#dnspromisesresolvenshostname}

**Aggiunto in: v10.6.0**

- `hostname` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Utilizza il protocollo DNS per risolvere i record del server dei nomi (record `NS`) per l'`hostname`. In caso di successo, la `Promise` viene risolta con un array di record del server dei nomi disponibili per `hostname` (ad esempio `['ns1.example.com', 'ns2.example.com']`).


### `dnsPromises.resolvePtr(hostname)` {#dnspromisesresolveptrhostname}

**Aggiunto in: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Utilizza il protocollo DNS per risolvere i record pointer (`PTR` record) per l'`hostname`. In caso di successo, la `Promise` viene risolta con un array di stringhe contenente i record di risposta.

### `dnsPromises.resolveSoa(hostname)` {#dnspromisesresolvesoahostname}

**Aggiunto in: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Utilizza il protocollo DNS per risolvere un record start of authority (`SOA` record) per l'`hostname`. In caso di successo, la `Promise` viene risolta con un oggetto con le seguenti proprietà:

- `nsname`
- `hostmaster`
- `serial`
- `refresh`
- `retry`
- `expire`
- `minttl`

```js [ESM]
{
  nsname: 'ns.example.com',
  hostmaster: 'root.example.com',
  serial: 2013101809,
  refresh: 10000,
  retry: 2400,
  expire: 604800,
  minttl: 3600
}
```
### `dnsPromises.resolveSrv(hostname)` {#dnspromisesresolvesrvhostname}

**Aggiunto in: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Utilizza il protocollo DNS per risolvere i record di servizio (`SRV` record) per l'`hostname`. In caso di successo, la `Promise` viene risolta con un array di oggetti con le seguenti proprietà:

- `priority`
- `weight`
- `port`
- `name`

```js [ESM]
{
  priority: 10,
  weight: 5,
  port: 21223,
  name: 'service.example.com'
}
```
### `dnsPromises.resolveTxt(hostname)` {#dnspromisesresolvetxthostname}

**Aggiunto in: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Utilizza il protocollo DNS per risolvere le query di testo (`TXT` record) per l'`hostname`. In caso di successo, la `Promise` viene risolta con un array bidimensionale dei record di testo disponibili per `hostname` (es. `[ ['v=spf1 ip4:0.0.0.0 ', '~all' ] ]`). Ogni sotto-array contiene chunk TXT di un record. A seconda del caso d'uso, questi potrebbero essere uniti insieme o trattati separatamente.


### `dnsPromises.reverse(ip)` {#dnspromisesreverseip}

**Aggiunto in: v10.6.0**

- `ip` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Esegue una query DNS inversa che risolve un indirizzo IPv4 o IPv6 in un array di nomi host.

In caso di errore, la `Promise` viene rifiutata con un oggetto [`Error`](/it/nodejs/api/errors#class-error), dove `err.code` è uno dei [codici di errore DNS](/it/nodejs/api/dns#error-codes).

### `dnsPromises.setDefaultResultOrder(order)` {#dnspromisessetdefaultresultorderorder}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v22.1.0, v20.13.0 | Ora è supportato il valore `ipv6first`. |
| v17.0.0 | Valore predefinito modificato in `verbatim`. |
| v16.4.0, v14.18.0 | Aggiunto in: v16.4.0, v14.18.0 |
:::

- `order` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) deve essere `'ipv4first'`, `'ipv6first'` o `'verbatim'`.

Imposta il valore predefinito di `order` in [`dns.lookup()`](/it/nodejs/api/dns#dnslookuphostname-options-callback) e [`dnsPromises.lookup()`](/it/nodejs/api/dns#dnspromiseslookuphostname-options). Il valore potrebbe essere:

- `ipv4first`: imposta `order` predefinito su `ipv4first`.
- `ipv6first`: imposta `order` predefinito su `ipv6first`.
- `verbatim`: imposta `order` predefinito su `verbatim`.

Il valore predefinito è `verbatim` e [`dnsPromises.setDefaultResultOrder()`](/it/nodejs/api/dns#dnspromisessetdefaultresultorderorder) ha una priorità maggiore rispetto a [`--dns-result-order`](/it/nodejs/api/cli#--dns-result-orderorder). Quando si utilizzano i [thread di lavoro](/it/nodejs/api/worker_threads), [`dnsPromises.setDefaultResultOrder()`](/it/nodejs/api/dns#dnspromisessetdefaultresultorderorder) dal thread principale non influirà sugli ordini DNS predefiniti nei worker.

### `dnsPromises.getDefaultResultOrder()` {#dnspromisesgetdefaultresultorder}

**Aggiunto in: v20.1.0, v18.17.0**

Ottiene il valore di `dnsOrder`.

### `dnsPromises.setServers(servers)` {#dnspromisessetserversservers}

**Aggiunto in: v10.6.0**

- `servers` [\<stringa[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) array di indirizzi formattati [RFC 5952](https://tools.ietf.org/html/rfc5952#section-6)

Imposta l'indirizzo IP e la porta dei server da utilizzare quando si esegue la risoluzione DNS. L'argomento `servers` è un array di indirizzi formattati [RFC 5952](https://tools.ietf.org/html/rfc5952#section-6). Se la porta è la porta DNS predefinita IANA (53) può essere omessa.

```js [ESM]
dnsPromises.setServers([
  '8.8.8.8',
  '[2001:4860:4860::8888]',
  '8.8.8.8:1053',
  '[2001:4860:4860::8888]:1053',
]);
```
Verrà generato un errore se viene fornito un indirizzo non valido.

Il metodo `dnsPromises.setServers()` non deve essere chiamato mentre è in corso una query DNS.

Questo metodo funziona in modo molto simile a [resolve.conf](https://man7.org/linux/man-pages/man5/resolv.conf.5). Vale a dire che, se il tentativo di risoluzione con il primo server fornito restituisce un errore `NOTFOUND`, il metodo `resolve()` *non* tenterà di risolvere con i server successivi forniti. I server DNS di fallback verranno utilizzati solo se i precedenti scadono o generano qualche altro errore.


## Codici di errore {#error-codes}

Ogni query DNS può restituire uno dei seguenti codici di errore:

- `dns.NODATA`: Il server DNS ha restituito una risposta senza dati.
- `dns.FORMERR`: Il server DNS afferma che la query è stata formattata in modo errato.
- `dns.SERVFAIL`: Il server DNS ha restituito un errore generale.
- `dns.NOTFOUND`: Nome di dominio non trovato.
- `dns.NOTIMP`: Il server DNS non implementa l'operazione richiesta.
- `dns.REFUSED`: Il server DNS ha rifiutato la query.
- `dns.BADQUERY`: Query DNS formattata in modo errato.
- `dns.BADNAME`: Nome host formattato in modo errato.
- `dns.BADFAMILY`: Famiglia di indirizzi non supportata.
- `dns.BADRESP`: Risposta DNS formattata in modo errato.
- `dns.CONNREFUSED`: Impossibile contattare i server DNS.
- `dns.TIMEOUT`: Timeout durante il contatto con i server DNS.
- `dns.EOF`: Fine del file.
- `dns.FILE`: Errore durante la lettura del file.
- `dns.NOMEM`: Memoria insufficiente.
- `dns.DESTRUCTION`: Il canale è in fase di distruzione.
- `dns.BADSTR`: Stringa formattata in modo errato.
- `dns.BADFLAGS`: Flag illegali specificati.
- `dns.NONAME`: Il nome host fornito non è numerico.
- `dns.BADHINTS`: Flag di suggerimenti illegali specificati.
- `dns.NOTINITIALIZED`: Inizializzazione della libreria c-ares non ancora eseguita.
- `dns.LOADIPHLPAPI`: Errore durante il caricamento di `iphlpapi.dll`.
- `dns.ADDRGETNETWORKPARAMS`: Impossibile trovare la funzione `GetNetworkParams`.
- `dns.CANCELLED`: Query DNS annullata.

L'API `dnsPromises` esporta anche i codici di errore di cui sopra, ad esempio `dnsPromises.NODATA`.

## Considerazioni sull'implementazione {#implementation-considerations}

Sebbene [`dns.lookup()`](/it/nodejs/api/dns#dnslookuphostname-options-callback) e le varie funzioni `dns.resolve*()/dns.reverse()` abbiano lo stesso obiettivo di associare un nome di rete a un indirizzo di rete (o viceversa), il loro comportamento è abbastanza diverso. Queste differenze possono avere conseguenze sottili ma significative sul comportamento dei programmi Node.js.

### `dns.lookup()` {#dnslookup}

Dietro le quinte, [`dns.lookup()`](/it/nodejs/api/dns#dnslookuphostname-options-callback) utilizza le stesse funzionalità del sistema operativo della maggior parte degli altri programmi. Ad esempio, [`dns.lookup()`](/it/nodejs/api/dns#dnslookuphostname-options-callback) risolverà quasi sempre un determinato nome nello stesso modo del comando `ping`. Sulla maggior parte dei sistemi operativi di tipo POSIX, il comportamento della funzione [`dns.lookup()`](/it/nodejs/api/dns#dnslookuphostname-options-callback) può essere modificato cambiando le impostazioni in [`nsswitch.conf(5)`](http://man7.org/linux/man-pages/man5/nsswitch.conf.5) e/o [`resolv.conf(5)`](http://man7.org/linux/man-pages/man5/resolv.conf.5), ma la modifica di questi file cambierà il comportamento di tutti gli altri programmi in esecuzione sullo stesso sistema operativo.

Sebbene la chiamata a `dns.lookup()` sia asincrona dal punto di vista di JavaScript, è implementata come una chiamata sincrona a [`getaddrinfo(3)`](http://man7.org/linux/man-pages/man3/getaddrinfo.3) che viene eseguita sul threadpool di libuv. Ciò può avere sorprendenti implicazioni negative sulle prestazioni per alcune applicazioni, vedere la documentazione [`UV_THREADPOOL_SIZE`](/it/nodejs/api/cli#uv_threadpool_sizesize) per maggiori informazioni.

Varie API di rete chiameranno internamente `dns.lookup()` per risolvere i nomi host. In caso di problemi, considera di risolvere il nome host in un indirizzo utilizzando `dns.resolve()` e di utilizzare l'indirizzo invece di un nome host. Inoltre, alcune API di rete (come [`socket.connect()`](/it/nodejs/api/net#socketconnectoptions-connectlistener) e [`dgram.createSocket()`](/it/nodejs/api/dgram#dgramcreatesocketoptions-callback)) consentono di sostituire il resolver predefinito, `dns.lookup()`.


### `dns.resolve()`, `dns.resolve*()` e `dns.reverse()` {#dnsresolve-dnsresolve*-and-dnsreverse}

Queste funzioni sono implementate in modo piuttosto diverso da [`dns.lookup()`](/it/nodejs/api/dns#dnslookuphostname-options-callback). Non utilizzano [`getaddrinfo(3)`](http://man7.org/linux/man-pages/man3/getaddrinfo.3) ed eseguono *sempre* una query DNS sulla rete. Questa comunicazione di rete viene sempre eseguita in modo asincrono e non utilizza il threadpool di libuv.

Di conseguenza, queste funzioni non possono avere lo stesso impatto negativo sull'elaborazione che avviene sul threadpool di libuv che può avere [`dns.lookup()`](/it/nodejs/api/dns#dnslookuphostname-options-callback).

Non utilizzano lo stesso insieme di file di configurazione utilizzati da [`dns.lookup()`](/it/nodejs/api/dns#dnslookuphostname-options-callback). Ad esempio, non utilizzano la configurazione da `/etc/hosts`.

