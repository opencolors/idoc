---
title: Node.js Dokumentation - DNS
description: Dieser Abschnitt der Node.js-Dokumentation behandelt das DNS-Modul (Domain Name System), das asynchrone Netzwerknamenauflösungs-Funktionalitäten bietet. Es umfasst Methoden zur Auflösung von Domainnamen zu IP-Adressen, umgekehrte Nachschläge und DNS-Eintragabfragen.
head:
  - - meta
    - name: og:title
      content: Node.js Dokumentation - DNS | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Dieser Abschnitt der Node.js-Dokumentation behandelt das DNS-Modul (Domain Name System), das asynchrone Netzwerknamenauflösungs-Funktionalitäten bietet. Es umfasst Methoden zur Auflösung von Domainnamen zu IP-Adressen, umgekehrte Nachschläge und DNS-Eintragabfragen.
  - - meta
    - name: twitter:title
      content: Node.js Dokumentation - DNS | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Dieser Abschnitt der Node.js-Dokumentation behandelt das DNS-Modul (Domain Name System), das asynchrone Netzwerknamenauflösungs-Funktionalitäten bietet. Es umfasst Methoden zur Auflösung von Domainnamen zu IP-Adressen, umgekehrte Nachschläge und DNS-Eintragabfragen.
---


# DNS {#dns}

::: tip [Stable: 2 - Stable]
[Stable: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil
:::

**Quellcode:** [lib/dns.js](https://github.com/nodejs/node/blob/v23.5.0/lib/dns.js)

Das Modul `node:dns` ermöglicht die Namensauflösung. Verwenden Sie es beispielsweise, um IP-Adressen von Hostnamen nachzuschlagen.

Obwohl es nach dem [Domain Name System (DNS)](https://en.wikipedia.org/wiki/Domain_Name_System) benannt ist, verwendet es nicht immer das DNS-Protokoll für die Suche. [`dns.lookup()`](/de/nodejs/api/dns#dnslookuphostname-options-callback) verwendet die Einrichtungen des Betriebssystems, um die Namensauflösung durchzuführen. Es muss möglicherweise keine Netzwerkkommunikation durchgeführt werden. Um die Namensauflösung so durchzuführen, wie es andere Anwendungen auf demselben System tun, verwenden Sie [`dns.lookup()`](/de/nodejs/api/dns#dnslookuphostname-options-callback).

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

Alle anderen Funktionen im Modul `node:dns` stellen eine Verbindung zu einem tatsächlichen DNS-Server her, um die Namensauflösung durchzuführen. Sie verwenden immer das Netzwerk, um DNS-Abfragen durchzuführen. Diese Funktionen verwenden nicht denselben Satz von Konfigurationsdateien, die von [`dns.lookup()`](/de/nodejs/api/dns#dnslookuphostname-options-callback) verwendet werden (z. B. `/etc/hosts`). Verwenden Sie diese Funktionen, um immer DNS-Abfragen durchzuführen und andere Namensauflösungseinrichtungen zu umgehen.

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

Weitere Informationen finden Sie im Abschnitt [Überlegungen zur Implementierung](/de/nodejs/api/dns#implementation-considerations).


## Klasse: `dns.Resolver` {#class-dnsresolver}

**Hinzugefügt in: v8.3.0**

Ein unabhängiger Resolver für DNS-Anfragen.

Das Erstellen eines neuen Resolvers verwendet die Standardservereinstellungen. Das Setzen der für einen Resolver verwendeten Server mit [`resolver.setServers()`](/de/nodejs/api/dns#dnssetserversservers) beeinflusst keine anderen Resolver:

::: code-group
```js [ESM]
import { Resolver } from 'node:dns';
const resolver = new Resolver();
resolver.setServers(['4.4.4.4']);

// Diese Anfrage verwendet den Server unter 4.4.4.4, unabhängig von den globalen Einstellungen.
resolver.resolve4('example.org', (err, addresses) => {
  // ...
});
```

```js [CJS]
const { Resolver } = require('node:dns');
const resolver = new Resolver();
resolver.setServers(['4.4.4.4']);

// Diese Anfrage verwendet den Server unter 4.4.4.4, unabhängig von den globalen Einstellungen.
resolver.resolve4('example.org', (err, addresses) => {
  // ...
});
```
:::

Die folgenden Methoden aus dem Modul `node:dns` sind verfügbar:

- [`resolver.getServers()`](/de/nodejs/api/dns#dnsgetservers)
- [`resolver.resolve()`](/de/nodejs/api/dns#dnsresolvehostname-rrtype-callback)
- [`resolver.resolve4()`](/de/nodejs/api/dns#dnsresolve4hostname-options-callback)
- [`resolver.resolve6()`](/de/nodejs/api/dns#dnsresolve6hostname-options-callback)
- [`resolver.resolveAny()`](/de/nodejs/api/dns#dnsresolveanyhostname-callback)
- [`resolver.resolveCaa()`](/de/nodejs/api/dns#dnsresolvecaahostname-callback)
- [`resolver.resolveCname()`](/de/nodejs/api/dns#dnsresolvecnamehostname-callback)
- [`resolver.resolveMx()`](/de/nodejs/api/dns#dnsresolvemxhostname-callback)
- [`resolver.resolveNaptr()`](/de/nodejs/api/dns#dnsresolvenaptrhostname-callback)
- [`resolver.resolveNs()`](/de/nodejs/api/dns#dnsresolvenshostname-callback)
- [`resolver.resolvePtr()`](/de/nodejs/api/dns#dnsresolveptrhostname-callback)
- [`resolver.resolveSoa()`](/de/nodejs/api/dns#dnsresolvesoahostname-callback)
- [`resolver.resolveSrv()`](/de/nodejs/api/dns#dnsresolvesrvhostname-callback)
- [`resolver.resolveTxt()`](/de/nodejs/api/dns#dnsresolvetxthostname-callback)
- [`resolver.reverse()`](/de/nodejs/api/dns#dnsreverseip-callback)
- [`resolver.setServers()`](/de/nodejs/api/dns#dnssetserversservers)

### `Resolver([options])` {#resolveroptions}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v16.7.0, v14.18.0 | Das `options`-Objekt akzeptiert jetzt eine `tries`-Option. |
| v12.18.3 | Der Konstruktor akzeptiert jetzt ein `options`-Objekt. Die einzig unterstützte Option ist `timeout`. |
| v8.3.0 | Hinzugefügt in: v8.3.0 |
:::

Erstellen Sie einen neuen Resolver.

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Abfrage-Timeout in Millisekunden oder `-1`, um das Standard-Timeout zu verwenden.
    - `tries` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der Versuche, die der Resolver unternehmen wird, um jeden Nameserver zu kontaktieren, bevor er aufgibt. **Standard:** `4`


### `resolver.cancel()` {#resolvercancel}

**Hinzugefügt in: v8.3.0**

Bricht alle ausstehenden DNS-Abfragen ab, die von diesem Resolver gestellt wurden. Die entsprechenden Rückrufe werden mit einem Fehler mit dem Code `ECANCELLED` aufgerufen.

### `resolver.setLocalAddress([ipv4][, ipv6])` {#resolversetlocaladdressipv4-ipv6}

**Hinzugefügt in: v15.1.0, v14.17.0**

- `ipv4` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Eine String-Darstellung einer IPv4-Adresse. **Standard:** `'0.0.0.0'`
- `ipv6` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Eine String-Darstellung einer IPv6-Adresse. **Standard:** `'::0'`

Die Resolver-Instanz sendet ihre Anfragen von der angegebenen IP-Adresse. Dies ermöglicht es Programmen, ausgehende Schnittstellen anzugeben, wenn sie auf Multi-Homed-Systemen verwendet werden.

Wenn keine v4- oder v6-Adresse angegeben wird, wird sie auf den Standardwert gesetzt und das Betriebssystem wählt automatisch eine lokale Adresse aus.

Der Resolver verwendet die lokale v4-Adresse, wenn er Anfragen an IPv4-DNS-Server stellt, und die lokale v6-Adresse, wenn er Anfragen an IPv6-DNS-Server stellt. Der `rrtype` von Auflösungsanfragen hat keinen Einfluss auf die verwendete lokale Adresse.

## `dns.getServers()` {#dnsgetservers}

**Hinzugefügt in: v0.11.3**

- Rückgabe: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Gibt ein Array von IP-Adressstrings zurück, die gemäß [RFC 5952](https://tools.ietf.org/html/rfc5952#section-6) formatiert sind und derzeit für die DNS-Auflösung konfiguriert sind. Ein String enthält einen Portabschnitt, wenn ein benutzerdefinierter Port verwendet wird.

```js [ESM]
[
  '8.8.8.8',
  '2001:4860:4860::8888',
  '8.8.8.8:1053',
  '[2001:4860:4860::8888]:1053',
]
```
## `dns.lookup(hostname[, options], callback)` {#dnslookuphostname-options-callback}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v22.1.0, v20.13.0 | Die Option `verbatim` ist jetzt zugunsten der neuen Option `order` veraltet. |
| v18.4.0 | Für die Kompatibilität mit `node:net` kann die Option `family` bei Übergabe eines Options-Objekts der String `'IPv4'` oder der String `'IPv6'` sein. |
| v18.0.0 | Das Übergeben eines ungültigen Rückrufs an das Argument `callback` wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v17.0.0 | Die `verbatim`-Optionen sind jetzt standardmäßig `true`. |
| v8.5.0 | Die Option `verbatim` wird jetzt unterstützt. |
| v1.2.0 | Die Option `all` wird jetzt unterstützt. |
| v0.1.90 | Hinzugefügt in: v0.1.90 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `family` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die Datensatzfamilie. Muss `4`, `6` oder `0` sein. Aus Gründen der Abwärtskompatibilität werden `'IPv4'` und `'IPv6'` als `4` bzw. `6` interpretiert. Der Wert `0` gibt an, dass entweder eine IPv4- oder eine IPv6-Adresse zurückgegeben wird. Wenn der Wert `0` mit `{ all: true }` (siehe unten) verwendet wird, werden entweder eine oder beide IPv4- und IPv6-Adressen zurückgegeben, abhängig vom DNS-Resolver des Systems. **Standard:** `0`.
    - `hints` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Eine oder mehrere [unterstützte `getaddrinfo`-Flags](/de/nodejs/api/dns#unterstutzte-getaddrinfo-flags). Mehrere Flags können durch bitweises `OR` ihrer Werte übergeben werden.
    - `all` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, gibt der Rückruf alle aufgelösten Adressen in einem Array zurück. Andernfalls wird eine einzelne Adresse zurückgegeben. **Standard:** `false`.
    - `order` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Wenn `verbatim`, werden die aufgelösten Adressen unsortiert zurückgegeben. Wenn `ipv4first`, werden die aufgelösten Adressen sortiert, indem IPv4-Adressen vor IPv6-Adressen platziert werden. Wenn `ipv6first`, werden die aufgelösten Adressen sortiert, indem IPv6-Adressen vor IPv4-Adressen platziert werden. **Standard:** `verbatim` (Adressen werden nicht neu geordnet). Der Standardwert kann mit [`dns.setDefaultResultOrder()`](/de/nodejs/api/dns#dnssetdefaultresultorderorder) oder [`--dns-result-order`](/de/nodejs/api/cli#--dns-result-orderorder) konfiguriert werden.
    - `verbatim` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, empfängt der Rückruf IPv4- und IPv6-Adressen in der Reihenfolge, in der der DNS-Resolver sie zurückgegeben hat. Wenn `false`, werden IPv4-Adressen vor IPv6-Adressen platziert. Diese Option wird zugunsten von `order` veraltet sein. Wenn beides angegeben wird, hat `order` eine höhere Priorität. Neuer Code sollte nur `order` verwenden. **Standard:** `true` (Adressen werden nicht neu geordnet). Der Standardwert kann mit [`dns.setDefaultResultOrder()`](/de/nodejs/api/dns#dnssetdefaultresultorderorder) oder [`--dns-result-order`](/de/nodejs/api/cli#--dns-result-orderorder) konfiguriert werden.

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Eine String-Darstellung einer IPv4- oder IPv6-Adresse.
    - `family` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `4` oder `6`, was die Familie von `address` bezeichnet, oder `0`, wenn die Adresse keine IPv4- oder IPv6-Adresse ist. `0` ist ein wahrscheinlicher Indikator für einen Fehler im Namensauflösungsdienst, der vom Betriebssystem verwendet wird.

Löst einen Hostnamen (z. B. `'nodejs.org'`) in den ersten gefundenen A- (IPv4) oder AAAA-Eintrag (IPv6) auf. Alle `option`-Eigenschaften sind optional. Wenn `options` eine ganze Zahl ist, muss sie `4` oder `6` sein – wenn `options` nicht angegeben wird, werden entweder IPv4- oder IPv6-Adressen oder beide zurückgegeben, falls gefunden.

Wenn die Option `all` auf `true` gesetzt ist, ändern sich die Argumente für `callback` in `(err, addresses)`, wobei `addresses` ein Array von Objekten mit den Eigenschaften `address` und `family` ist.

Im Fehlerfall ist `err` ein [`Error`](/de/nodejs/api/errors#class-error)-Objekt, wobei `err.code` der Fehlercode ist. Beachten Sie, dass `err.code` nicht nur dann auf `'ENOTFOUND'` gesetzt wird, wenn der Hostname nicht existiert, sondern auch, wenn die Suche auf andere Weise fehlschlägt, z. B. wenn keine verfügbaren Dateideskriptoren vorhanden sind.

`dns.lookup()` hat nicht unbedingt etwas mit dem DNS-Protokoll zu tun. Die Implementierung verwendet eine Betriebssystemfunktion, die Namen mit Adressen verknüpfen kann und umgekehrt. Diese Implementierung kann subtile, aber wichtige Konsequenzen für das Verhalten eines beliebigen Node.js-Programms haben. Bitte nehmen Sie sich etwas Zeit, um den Abschnitt [Implementierungshinweise](/de/nodejs/api/dns#implementierungshinweise) zu konsultieren, bevor Sie `dns.lookup()` verwenden.

Beispielhafte Nutzung:

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

// Wenn options.all true ist, ist das Ergebnis ein Array.
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

// Wenn options.all true ist, ist das Ergebnis ein Array.
options.all = true;
dns.lookup('example.org', options, (err, addresses) =>
  console.log('addresses: %j', addresses));
// addresses: [{"address":"2606:2800:21f:cb07:6820:80da:af6b:8b2c","family":6}]
```
:::

Wenn diese Methode als ihre [`util.promisify()`](/de/nodejs/api/util#utilpromisifyoriginal)ed-Version aufgerufen wird und `all` nicht auf `true` gesetzt ist, gibt sie ein `Promise` für ein `Object` mit den Eigenschaften `address` und `family` zurück.


### Unterstützte getaddrinfo-Flags {#supported-getaddrinfo-flags}

::: info [Verlauf]
| Version | Änderungen |
|---|---|
| v13.13.0, v12.17.0 | Unterstützung für das `dns.ALL`-Flag hinzugefügt. |
:::

Die folgenden Flags können als Hinweise an [`dns.lookup()`](/de/nodejs/api/dns#dnslookuphostname-options-callback) übergeben werden.

- `dns.ADDRCONFIG`: Beschränkt die zurückgegebenen Adresstypen auf die Typen von Nicht-Loopback-Adressen, die auf dem System konfiguriert sind. Beispielsweise werden IPv4-Adressen nur zurückgegeben, wenn das aktuelle System mindestens eine IPv4-Adresse konfiguriert hat.
- `dns.V4MAPPED`: Wenn die IPv6-Familie angegeben wurde, aber keine IPv6-Adressen gefunden wurden, werden IPv4-zugeordnete IPv6-Adressen zurückgegeben. Es wird auf einigen Betriebssystemen nicht unterstützt (z. B. FreeBSD 10.1).
- `dns.ALL`: Wenn `dns.V4MAPPED` angegeben ist, werden sowohl aufgelöste IPv6-Adressen als auch IPv4-zugeordnete IPv6-Adressen zurückgegeben.

## `dns.lookupService(address, port, callback)` {#dnslookupserviceaddress-port-callback}

::: info [Verlauf]
| Version | Änderungen |
|---|---|
| v18.0.0 | Das Übergeben eines ungültigen Callbacks an das Argument `callback` wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v0.11.14 | Hinzugefügt in: v0.11.14 |
:::

- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) z.B. `example.com`
    - `service` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) z.B. `http`

Löst die angegebene `address` und den `port` in einen Hostnamen und einen Dienst auf, indem die zugrunde liegende `getnameinfo`-Implementierung des Betriebssystems verwendet wird.

Wenn `address` keine gültige IP-Adresse ist, wird ein `TypeError` ausgelöst. Der `port` wird zu einer Zahl konvertiert. Wenn es sich nicht um einen zulässigen Port handelt, wird ein `TypeError` ausgelöst.

Bei einem Fehler ist `err` ein [`Error`](/de/nodejs/api/errors#class-error)-Objekt, wobei `err.code` der Fehlercode ist.

::: code-group
```js [ESM]
import dns from 'node:dns';
dns.lookupService('127.0.0.1', 22, (err, hostname, service) => {
  console.log(hostname, service);
  // Gibt aus: localhost ssh
});
```

```js [CJS]
const dns = require('node:dns');
dns.lookupService('127.0.0.1', 22, (err, hostname, service) => {
  console.log(hostname, service);
  // Gibt aus: localhost ssh
});
```
:::

Wenn diese Methode als ihre [`util.promisify()`](/de/nodejs/api/util#utilpromisifyoriginal)-Version aufgerufen wird, gibt sie eine `Promise` für ein `Object` mit den Eigenschaften `hostname` und `service` zurück.


## `dns.resolve(hostname[, rrtype], callback)` {#dnsresolvehostname-rrtype-callback}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Das Übergeben eines ungültigen Rückrufs an das `callback`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v0.1.27 | Hinzugefügt in: v0.1.27 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Hostname, der aufgelöst werden soll.
- `rrtype` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Ressourceneintragstyp. **Standard:** `'A'`.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `records` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Verwendet das DNS-Protokoll, um einen Hostnamen (z. B. `'nodejs.org'`) in ein Array von Ressourceneinträgen aufzulösen. Die `callback`-Funktion hat die Argumente `(err, records)`. Wenn erfolgreich, ist `records` ein Array von Ressourceneinträgen. Der Typ und die Struktur der einzelnen Ergebnisse variieren je nach `rrtype`:

| `rrtype` | `records` enthält | Ergebnistyp | Kurzmethode |
| --- | --- | --- | --- |
| `'A'` | IPv4-Adressen (Standard) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dns.resolve4()`](/de/nodejs/api/dns#dnsresolve4hostname-options-callback) |
| `'AAAA'` | IPv6-Adressen | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dns.resolve6()`](/de/nodejs/api/dns#dnsresolve6hostname-options-callback) |
| `'ANY'` | beliebige Einträge | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dns.resolveAny()`](/de/nodejs/api/dns#dnsresolveanyhostname-callback) |
| `'CAA'` | CA-Autorisierungseinträge | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dns.resolveCaa()`](/de/nodejs/api/dns#dnsresolvecaahostname-callback) |
| `'CNAME'` | kanonische Namenseinträge | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dns.resolveCname()`](/de/nodejs/api/dns#dnsresolvecnamehostname-callback) |
| `'MX'` | Mail Exchange-Einträge | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dns.resolveMx()`](/de/nodejs/api/dns#dnsresolvemxhostname-callback) |
| `'NAPTR'` | Name Authority Pointer-Einträge | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dns.resolveNaptr()`](/de/nodejs/api/dns#dnsresolvenaptrhostname-callback) |
| `'NS'` | Nameserver-Einträge | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dns.resolveNs()`](/de/nodejs/api/dns#dnsresolvenshostname-callback) |
| `'PTR'` | Pointer-Einträge | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dns.resolvePtr()`](/de/nodejs/api/dns#dnsresolveptrhostname-callback) |
| `'SOA'` | Start of Authority-Einträge | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dns.resolveSoa()`](/de/nodejs/api/dns#dnsresolvesoahostname-callback) |
| `'SRV'` | Service-Einträge | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dns.resolveSrv()`](/de/nodejs/api/dns#dnsresolvesrvhostname-callback) |
| `'TXT'` | Text-Einträge | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dns.resolveTxt()`](/de/nodejs/api/dns#dnsresolvetxthostname-callback) |

Bei einem Fehler ist `err` ein [`Error`](/de/nodejs/api/errors#class-error)-Objekt, wobei `err.code` einer der [DNS-Fehlercodes](/de/nodejs/api/dns#error-codes) ist.


## `dns.resolve4(hostname[, options], callback)` {#dnsresolve4hostname-options-callback}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Das Übergeben eines ungültigen Callbacks an das `callback`-Argument löst jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK` aus. |
| v7.2.0 | Diese Methode unterstützt jetzt das Übergeben von `options`, insbesondere `options.ttl`. |
| v0.1.16 | Hinzugefügt in: v0.1.16 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Hostname, der aufgelöst werden soll.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ttl` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Ruft den Time-To-Live-Wert (TTL) jedes Eintrags ab. Wenn `true`, empfängt der Callback ein Array von `{ address: '1.2.3.4', ttl: 60 }`-Objekten anstelle eines Arrays von Strings, wobei die TTL in Sekunden ausgedrückt wird.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)



Verwendet das DNS-Protokoll, um IPv4-Adressen (`A`-Einträge) für den `hostname` aufzulösen. Das an die `callback`-Funktion übergebene `addresses`-Argument enthält ein Array von IPv4-Adressen (z. B. `['74.125.79.104', '74.125.79.105', '74.125.79.106']`).

## `dns.resolve6(hostname[, options], callback)` {#dnsresolve6hostname-options-callback}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Das Übergeben eines ungültigen Callbacks an das `callback`-Argument löst jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK` aus. |
| v7.2.0 | Diese Methode unterstützt jetzt das Übergeben von `options`, insbesondere `options.ttl`. |
| v0.1.16 | Hinzugefügt in: v0.1.16 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Hostname, der aufgelöst werden soll.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ttl` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Ruft den Time-To-Live-Wert (TTL) jedes Eintrags ab. Wenn `true`, empfängt der Callback ein Array von `{ address: '0:1:2:3:4:5:6:7', ttl: 60 }`-Objekten anstelle eines Arrays von Strings, wobei die TTL in Sekunden ausgedrückt wird.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)



Verwendet das DNS-Protokoll, um IPv6-Adressen (`AAAA`-Einträge) für den `hostname` aufzulösen. Das an die `callback`-Funktion übergebene `addresses`-Argument enthält ein Array von IPv6-Adressen.


## `dns.resolveAny(hostname, callback)` {#dnsresolveanyhostname-callback}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Das Übergeben eines ungültigen Callbacks an das `callback`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Funktion\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `ret` [\<Objekt[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Verwendet das DNS-Protokoll, um alle Records aufzulösen (auch bekannt als `ANY`- oder `*`-Abfrage). Das an die `callback`-Funktion übergebene `ret`-Argument ist ein Array, das verschiedene Arten von Records enthält. Jedes Objekt hat eine Eigenschaft `type`, die den Typ des aktuellen Records angibt. Und abhängig vom `type` sind zusätzliche Eigenschaften im Objekt vorhanden:

| Typ | Eigenschaften |
| --- | --- |
| `'A'` | `address`  /  `ttl` |
| `'AAAA'` | `address`  /  `ttl` |
| `'CNAME'` | `value` |
| `'MX'` | Siehe [`dns.resolveMx()`](/de/nodejs/api/dns#dnsresolvemxhostname-callback) |
| `'NAPTR'` | Siehe [`dns.resolveNaptr()`](/de/nodejs/api/dns#dnsresolvenaptrhostname-callback) |
| `'NS'` | `value` |
| `'PTR'` | `value` |
| `'SOA'` | Siehe [`dns.resolveSoa()`](/de/nodejs/api/dns#dnsresolvesoahostname-callback) |
| `'SRV'` | Siehe [`dns.resolveSrv()`](/de/nodejs/api/dns#dnsresolvesrvhostname-callback) |
| `'TXT'` | Dieser Record-Typ enthält eine Array-Eigenschaft namens `entries`, die auf [`dns.resolveTxt()`](/de/nodejs/api/dns#dnsresolvetxthostname-callback) verweist, z. B. `{ entries: ['...'], type: 'TXT' }` |

Hier ist ein Beispiel für das an den Callback übergebene `ret`-Objekt:

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
DNS-Serverbetreiber können wählen, nicht auf `ANY`-Abfragen zu antworten. Es ist möglicherweise besser, einzelne Methoden wie [`dns.resolve4()`](/de/nodejs/api/dns#dnsresolve4hostname-options-callback), [`dns.resolveMx()`](/de/nodejs/api/dns#dnsresolvemxhostname-callback) usw. aufzurufen. Weitere Informationen finden Sie unter [RFC 8482](https://tools.ietf.org/html/rfc8482).


## `dns.resolveCname(hostname, callback)` {#dnsresolvecnamehostname-callback}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Das Übergeben eines ungültigen Rückrufs an das `callback`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v0.3.2 | Hinzugefügt in: v0.3.2 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Verwendet das DNS-Protokoll, um `CNAME`-Einträge für den `hostname` aufzulösen. Das an die `callback`-Funktion übergebene `addresses`-Argument enthält ein Array von Canonical Name Records, die für den `hostname` verfügbar sind (z. B. `['bar.example.com']`).

## `dns.resolveCaa(hostname, callback)` {#dnsresolvecaahostname-callback}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Das Übergeben eines ungültigen Rückrufs an das `callback`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v15.0.0, v14.17.0 | Hinzugefügt in: v15.0.0, v14.17.0 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `records` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Verwendet das DNS-Protokoll, um `CAA`-Einträge für den `hostname` aufzulösen. Das an die `callback`-Funktion übergebene `addresses`-Argument enthält ein Array von Certification Authority Authorization Records, die für den `hostname` verfügbar sind (z. B. `[{critical: 0, iodef: 'mailto:pki@example.com'}, {critical: 128, issue: 'pki.example.com'}]`).


## `dns.resolveMx(hostname, callback)` {#dnsresolvemxhostname-callback}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Das Übergeben eines ungültigen Callbacks an das `callback`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v0.1.27 | Hinzugefügt in: v0.1.27 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  
 

Verwendet das DNS-Protokoll, um Mail Exchange Records (`MX` Records) für den `hostname` aufzulösen. Das an die `callback`-Funktion übergebene `addresses`-Argument enthält ein Array von Objekten, die sowohl eine `priority`- als auch eine `exchange`-Eigenschaft enthalten (z. B. `[{priority: 10, exchange: 'mx.example.com'}, ...]`).

## `dns.resolveNaptr(hostname, callback)` {#dnsresolvenaptrhostname-callback}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Das Übergeben eines ungültigen Callbacks an das `callback`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v0.9.12 | Hinzugefügt in: v0.9.12 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  
 

Verwendet das DNS-Protokoll, um reguläre Ausdrucks-basierte Records (`NAPTR` Records) für den `hostname` aufzulösen. Das an die `callback`-Funktion übergebene `addresses`-Argument enthält ein Array von Objekten mit den folgenden Eigenschaften:

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

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Das Übergeben eines ungültigen Callbacks an das `callback`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v0.1.90 | Hinzugefügt in: v0.1.90 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
  
 

Verwendet das DNS-Protokoll, um Nameserver-Einträge (`NS`-Einträge) für den `hostname` aufzulösen. Das an die `callback`-Funktion übergebene `addresses`-Argument enthält ein Array von Nameserver-Einträgen, die für `hostname` verfügbar sind (z. B. `['ns1.example.com', 'ns2.example.com']`).

## `dns.resolvePtr(hostname, callback)` {#dnsresolveptrhostname-callback}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Das Übergeben eines ungültigen Callbacks an das `callback`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v6.0.0 | Hinzugefügt in: v6.0.0 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
  
 

Verwendet das DNS-Protokoll, um Pointer-Einträge (`PTR`-Einträge) für den `hostname` aufzulösen. Das an die `callback`-Funktion übergebene `addresses`-Argument ist ein Array von Strings, das die Antwort-Einträge enthält.

## `dns.resolveSoa(hostname, callback)` {#dnsresolvesoahostname-callback}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Das Übergeben eines ungültigen Callbacks an das `callback`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v0.11.10 | Hinzugefügt in: v0.11.10 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `address` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  
 

Verwendet das DNS-Protokoll, um einen Start-of-Authority-Eintrag (`SOA`-Eintrag) für den `hostname` aufzulösen. Das an die `callback`-Funktion übergebene `address`-Argument ist ein Objekt mit den folgenden Eigenschaften:

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

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Das Übergeben eines ungültigen Rückrufs an das `callback`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v0.1.27 | Hinzugefügt in: v0.1.27 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Verwendet das DNS-Protokoll, um Service Records (`SRV` Records) für den `hostname` aufzulösen. Das an die `callback`-Funktion übergebene `addresses`-Argument ist ein Array von Objekten mit den folgenden Eigenschaften:

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

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Das Übergeben eines ungültigen Rückrufs an das `callback`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v0.1.27 | Hinzugefügt in: v0.1.27 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `records` [\<string[][]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Verwendet das DNS-Protokoll, um Textabfragen (`TXT` Records) für den `hostname` aufzulösen. Das an die `callback`-Funktion übergebene `records`-Argument ist ein zweidimensionales Array der für `hostname` verfügbaren Textrecords (z. B. `[ ['v=spf1 ip4:0.0.0.0 ', '~all' ] ]`). Jedes Sub-Array enthält TXT-Chunks eines Records. Je nach Anwendungsfall können diese entweder zusammengeführt oder separat behandelt werden.


## `dns.reverse(ip, callback)` {#dnsreverseip-callback}

**Hinzugefügt in: v0.1.16**

- `ip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `hostnames` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Führt eine Reverse-DNS-Abfrage durch, die eine IPv4- oder IPv6-Adresse in ein Array von Hostnamen auflöst.

Im Fehlerfall ist `err` ein [`Error`](/de/nodejs/api/errors#class-error)-Objekt, wobei `err.code` einer der [DNS-Fehlercodes](/de/nodejs/api/dns#error-codes) ist.

## `dns.setDefaultResultOrder(order)` {#dnssetdefaultresultorderorder}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v22.1.0, v20.13.0 | Der Wert `ipv6first` wird jetzt unterstützt. |
| v17.0.0 | Standardwert auf `verbatim` geändert. |
| v16.4.0, v14.18.0 | Hinzugefügt in: v16.4.0, v14.18.0 |
:::

- `order` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) muss `'ipv4first'`, `'ipv6first'` oder `'verbatim'` sein.

Legt den Standardwert von `order` in [`dns.lookup()`](/de/nodejs/api/dns#dnslookuphostname-options-callback) und [`dnsPromises.lookup()`](/de/nodejs/api/dns#dnspromiseslookuphostname-options) fest. Der Wert kann sein:

- `ipv4first`: setzt den Standardwert von `order` auf `ipv4first`.
- `ipv6first`: setzt den Standardwert von `order` auf `ipv6first`.
- `verbatim`: setzt den Standardwert von `order` auf `verbatim`.

Der Standardwert ist `verbatim` und [`dns.setDefaultResultOrder()`](/de/nodejs/api/dns#dnssetdefaultresultorderorder) hat eine höhere Priorität als [`--dns-result-order`](/de/nodejs/api/cli#--dns-result-orderorder). Bei Verwendung von [Worker-Threads](/de/nodejs/api/worker_threads) wirkt sich [`dns.setDefaultResultOrder()`](/de/nodejs/api/dns#dnssetdefaultresultorderorder) aus dem Haupt-Thread nicht auf die Standard-DNS-Reihenfolge in Workern aus.

## `dns.getDefaultResultOrder()` {#dnsgetdefaultresultorder}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v22.1.0, v20.13.0 | Der Wert `ipv6first` wird jetzt unterstützt. |
| v20.1.0, v18.17.0 | Hinzugefügt in: v20.1.0, v18.17.0 |
:::

Ruft den Standardwert für `order` in [`dns.lookup()`](/de/nodejs/api/dns#dnslookuphostname-options-callback) und [`dnsPromises.lookup()`](/de/nodejs/api/dns#dnspromiseslookuphostname-options) ab. Der Wert kann sein:

- `ipv4first`: für `order`, das standardmäßig auf `ipv4first` gesetzt ist.
- `ipv6first`: für `order`, das standardmäßig auf `ipv6first` gesetzt ist.
- `verbatim`: für `order`, das standardmäßig auf `verbatim` gesetzt ist.


## `dns.setServers(servers)` {#dnssetserversservers}

**Hinzugefügt in: v0.11.3**

- `servers` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Array von [RFC 5952](https://tools.ietf.org/html/rfc5952#section-6) formatierten Adressen

Setzt die IP-Adresse und den Port der Server, die bei der DNS-Auflösung verwendet werden sollen. Das `servers`-Argument ist ein Array von [RFC 5952](https://tools.ietf.org/html/rfc5952#section-6) formatierten Adressen. Wenn der Port der IANA-Standard-DNS-Port (53) ist, kann er weggelassen werden.

```js [ESM]
dns.setServers([
  '8.8.8.8',
  '[2001:4860:4860::8888]',
  '8.8.8.8:1053',
  '[2001:4860:4860::8888]:1053',
]);
```
Es wird ein Fehler ausgelöst, wenn eine ungültige Adresse angegeben wird.

Die Methode `dns.setServers()` darf nicht aufgerufen werden, während eine DNS-Abfrage läuft.

Die Methode [`dns.setServers()`](/de/nodejs/api/dns#dnssetserversservers) wirkt sich nur auf [`dns.resolve()`](/de/nodejs/api/dns#dnsresolvehostname-rrtype-callback), `dns.resolve*()` und [`dns.reverse()`](/de/nodejs/api/dns#dnsreverseip-callback) aus (und insbesondere *nicht* auf [`dns.lookup()`](/de/nodejs/api/dns#dnslookuphostname-options-callback)).

Diese Methode funktioniert ähnlich wie [resolve.conf](https://man7.org/linux/man-pages/man5/resolv.conf.5). Das heißt, wenn der Versuch der Auflösung mit dem ersten angegebenen Server zu einem `NOTFOUND`-Fehler führt, wird die Methode `resolve()` *nicht* versuchen, mit nachfolgenden angegebenen Servern aufzulösen. Fallback-DNS-Server werden nur verwendet, wenn bei den früheren Servern ein Timeout auftritt oder ein anderer Fehler auftritt.

## DNS Promises API {#dns-promises-api}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v15.0.0 | Als `require('dns/promises')` verfügbar gemacht. |
| v11.14.0, v10.17.0 | Diese API ist nicht mehr experimentell. |
| v10.6.0 | Hinzugefügt in: v10.6.0 |
:::

Die `dns.promises`-API bietet einen alternativen Satz asynchroner DNS-Methoden, die `Promise`-Objekte anstelle von Callbacks zurückgeben. Die API ist über `require('node:dns').promises` oder `require('node:dns/promises')` zugänglich.

### Klasse: `dnsPromises.Resolver` {#class-dnspromisesresolver}

**Hinzugefügt in: v10.6.0**

Ein unabhängiger Resolver für DNS-Anfragen.

Das Erstellen eines neuen Resolvers verwendet die Standardservereinstellungen. Das Festlegen der für einen Resolver verwendeten Server mit [`resolver.setServers()`](/de/nodejs/api/dns#dnspromisessetserversservers) wirkt sich nicht auf andere Resolver aus:

::: code-group
```js [ESM]
import { Resolver } from 'node:dns/promises';
const resolver = new Resolver();
resolver.setServers(['4.4.4.4']);

// Diese Anfrage verwendet den Server unter 4.4.4.4, unabhängig von globalen Einstellungen.
const addresses = await resolver.resolve4('example.org');
```

```js [CJS]
const { Resolver } = require('node:dns').promises;
const resolver = new Resolver();
resolver.setServers(['4.4.4.4']);

// Diese Anfrage verwendet den Server unter 4.4.4.4, unabhängig von globalen Einstellungen.
resolver.resolve4('example.org').then((addresses) => {
  // ...
});

// Alternativ kann derselbe Code im Async-Await-Stil geschrieben werden.
(async function() {
  const addresses = await resolver.resolve4('example.org');
})();
```
:::

Die folgenden Methoden aus der `dnsPromises`-API sind verfügbar:

- [`resolver.getServers()`](/de/nodejs/api/dns#dnspromisesgetservers)
- [`resolver.resolve()`](/de/nodejs/api/dns#dnspromisesresolvehostname-rrtype)
- [`resolver.resolve4()`](/de/nodejs/api/dns#dnspromisesresolve4hostname-options)
- [`resolver.resolve6()`](/de/nodejs/api/dns#dnspromisesresolve6hostname-options)
- [`resolver.resolveAny()`](/de/nodejs/api/dns#dnspromisesresolveanyhostname)
- [`resolver.resolveCaa()`](/de/nodejs/api/dns#dnspromisesresolvecaahostname)
- [`resolver.resolveCname()`](/de/nodejs/api/dns#dnspromisesresolvecnamehostname)
- [`resolver.resolveMx()`](/de/nodejs/api/dns#dnspromisesresolvemxhostname)
- [`resolver.resolveNaptr()`](/de/nodejs/api/dns#dnspromisesresolvenaptrhostname)
- [`resolver.resolveNs()`](/de/nodejs/api/dns#dnspromisesresolvenshostname)
- [`resolver.resolvePtr()`](/de/nodejs/api/dns#dnspromisesresolveptrhostname)
- [`resolver.resolveSoa()`](/de/nodejs/api/dns#dnspromisesresolvesoahostname)
- [`resolver.resolveSrv()`](/de/nodejs/api/dns#dnspromisesresolvesrvhostname)
- [`resolver.resolveTxt()`](/de/nodejs/api/dns#dnspromisesresolvetxthostname)
- [`resolver.reverse()`](/de/nodejs/api/dns#dnspromisesreverseip)
- [`resolver.setServers()`](/de/nodejs/api/dns#dnspromisessetserversservers)


### `resolver.cancel()` {#resolvercancel_1}

**Hinzugefügt in: v15.3.0, v14.17.0**

Bricht alle ausstehenden DNS-Abfragen ab, die von diesem Resolver durchgeführt wurden. Die entsprechenden Promises werden mit einem Fehler mit dem Code `ECANCELLED` abgelehnt.

### `dnsPromises.getServers()` {#dnspromisesgetservers}

**Hinzugefügt in: v10.6.0**

- Gibt zurück: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Gibt ein Array von IP-Adresszeichenketten zurück, das gemäß [RFC 5952](https://tools.ietf.org/html/rfc5952#section-6) formatiert ist und derzeit für die DNS-Auflösung konfiguriert ist. Eine Zeichenkette enthält einen Portabschnitt, wenn ein benutzerdefinierter Port verwendet wird.

```js [ESM]
[
  '8.8.8.8',
  '2001:4860:4860::8888',
  '8.8.8.8:1053',
  '[2001:4860:4860::8888]:1053',
]
```
### `dnsPromises.lookup(hostname[, options])` {#dnspromiseslookuphostname-options}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v22.1.0, v20.13.0 | Die Option `verbatim` ist jetzt zugunsten der neuen Option `order` veraltet. |
| v10.6.0 | Hinzugefügt in: v10.6.0 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `family` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Record Family. Muss `4`, `6` oder `0` sein. Der Wert `0` gibt an, dass entweder eine IPv4- oder eine IPv6-Adresse zurückgegeben wird. Wenn der Wert `0` zusammen mit `{ all: true }` verwendet wird (siehe unten), werden entweder eine oder beide IPv4- und IPv6-Adressen zurückgegeben, abhängig vom DNS-Resolver des Systems. **Standard:** `0`.
    - `hints` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Ein oder mehrere [unterstützte `getaddrinfo`-Flags](/de/nodejs/api/dns#supported-getaddrinfo-flags). Mehrere Flags können durch bitweises `OR` ihrer Werte übergeben werden.
    - `all` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, wird die `Promise` mit allen Adressen in einem Array aufgelöst. Andernfalls wird eine einzelne Adresse zurückgegeben. **Standard:** `false`.
    - `order` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Wenn `verbatim`, wird die `Promise` mit IPv4- und IPv6-Adressen in der Reihenfolge aufgelöst, in der der DNS-Resolver sie zurückgegeben hat. Wenn `ipv4first`, werden IPv4-Adressen vor IPv6-Adressen platziert. Wenn `ipv6first`, werden IPv6-Adressen vor IPv4-Adressen platziert. **Standard:** `verbatim` (Adressen werden nicht neu geordnet). Der Standardwert kann mit [`dns.setDefaultResultOrder()`](/de/nodejs/api/dns#dnssetdefaultresultorderorder) oder [`--dns-result-order`](/de/nodejs/api/cli#--dns-result-orderorder) konfiguriert werden. Neuer Code sollte `{ order: 'verbatim' }` verwenden.
    - `verbatim` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, wird die `Promise` mit IPv4- und IPv6-Adressen in der Reihenfolge aufgelöst, in der der DNS-Resolver sie zurückgegeben hat. Wenn `false`, werden IPv4-Adressen vor IPv6-Adressen platziert. Diese Option wird zugunsten von `order` als veraltet angesehen. Wenn beide angegeben sind, hat `order` eine höhere Priorität. Neuer Code sollte nur `order` verwenden. **Standard:** derzeit `false` (Adressen werden neu geordnet), aber dies wird sich voraussichtlich in nicht allzu ferner Zukunft ändern. Der Standardwert kann mit [`dns.setDefaultResultOrder()`](/de/nodejs/api/dns#dnssetdefaultresultorderorder) oder [`--dns-result-order`](/de/nodejs/api/cli#--dns-result-orderorder) konfiguriert werden.
  
 

Löst einen Hostnamen (z. B. `'nodejs.org'`) in den ersten gefundenen A (IPv4)- oder AAAA (IPv6)-Record auf. Alle `option`-Eigenschaften sind optional. Wenn `options` eine Ganzzahl ist, muss sie `4` oder `6` sein - wenn `options` nicht angegeben wird, werden entweder IPv4- oder IPv6-Adressen oder beide zurückgegeben, falls gefunden.

Wenn die Option `all` auf `true` gesetzt ist, wird die `Promise` mit `addresses` als Array von Objekten mit den Eigenschaften `address` und `family` aufgelöst.

Im Fehlerfall wird die `Promise` mit einem [`Error`](/de/nodejs/api/errors#class-error)-Objekt abgelehnt, wobei `err.code` der Fehlercode ist. Beachten Sie, dass `err.code` nicht nur auf `'ENOTFOUND'` gesetzt wird, wenn der Hostname nicht existiert, sondern auch, wenn die Suche auf andere Weise fehlschlägt, z. B. wenn keine verfügbaren Dateideskriptoren vorhanden sind.

[`dnsPromises.lookup()`](/de/nodejs/api/dns#dnspromiseslookuphostname-options) hat nicht unbedingt etwas mit dem DNS-Protokoll zu tun. Die Implementierung verwendet eine Betriebssystemfunktion, die Namen Adressen zuordnen kann und umgekehrt. Diese Implementierung kann subtile, aber wichtige Auswirkungen auf das Verhalten eines jeden Node.js-Programms haben. Bitte nehmen Sie sich etwas Zeit, um den Abschnitt [Implementierungshinweise](/de/nodejs/api/dns#implementation-considerations) zu lesen, bevor Sie `dnsPromises.lookup()` verwenden.

Beispielhafte Verwendung:



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

// Wenn options.all true ist, ist das Ergebnis ein Array.
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

// Wenn options.all true ist, ist das Ergebnis ein Array.
options.all = true;
dnsPromises.lookup('example.org', options).then((result) => {
  console.log('addresses: %j', result);
  // addresses: [{"address":"2606:2800:21f:cb07:6820:80da:af6b:8b2c","family":6}]
});
```
:::


### `dnsPromises.lookupService(address, port)` {#dnspromiseslookupserviceaddress-port}

**Hinzugefügt in: v10.6.0**

- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Löst die angegebene `address` und `port` in einen Hostnamen und Dienst auf, indem die zugrunde liegende `getnameinfo`-Implementierung des Betriebssystems verwendet wird.

Wenn `address` keine gültige IP-Adresse ist, wird ein `TypeError` ausgelöst. Der `port` wird in eine Zahl umgewandelt. Wenn es sich nicht um einen zulässigen Port handelt, wird ein `TypeError` ausgelöst.

Im Fehlerfall wird das `Promise` mit einem [`Error`](/de/nodejs/api/errors#class-error)-Objekt verworfen, wobei `err.code` der Fehlercode ist.

::: code-group
```js [ESM]
import dnsPromises from 'node:dns/promises';
const result = await dnsPromises.lookupService('127.0.0.1', 22);

console.log(result.hostname, result.service); // Gibt aus: localhost ssh
```

```js [CJS]
const dnsPromises = require('node:dns').promises;
dnsPromises.lookupService('127.0.0.1', 22).then((result) => {
  console.log(result.hostname, result.service);
  // Gibt aus: localhost ssh
});
```
:::

### `dnsPromises.resolve(hostname[, rrtype])` {#dnspromisesresolvehostname-rrtype}

**Hinzugefügt in: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Hostname, der aufgelöst werden soll.
- `rrtype` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Resource Record Type. **Standard:** `'A'`.

Verwendet das DNS-Protokoll, um einen Hostnamen (z. B. `'nodejs.org'`) in ein Array von Resource Records aufzulösen. Wenn erfolgreich, wird das `Promise` mit einem Array von Resource Records aufgelöst. Der Typ und die Struktur der einzelnen Ergebnisse variieren je nach `rrtype`:

| `rrtype` | `records` enthält | Ergebnistyp | Kurzmethode |
| --- | --- | --- | --- |
| `'A'` | IPv4-Adressen (Standard) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dnsPromises.resolve4()`](/de/nodejs/api/dns#dnspromisesresolve4hostname-options) |
| `'AAAA'` | IPv6-Adressen | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dnsPromises.resolve6()`](/de/nodejs/api/dns#dnspromisesresolve6hostname-options) |
| `'ANY'` | beliebige Records | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dnsPromises.resolveAny()`](/de/nodejs/api/dns#dnspromisesresolveanyhostname) |
| `'CAA'` | CA-Autorisierungs-Records | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dnsPromises.resolveCaa()`](/de/nodejs/api/dns#dnspromisesresolvecaahostname) |
| `'CNAME'` | Canonical Name Records | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dnsPromises.resolveCname()`](/de/nodejs/api/dns#dnspromisesresolvecnamehostname) |
| `'MX'` | Mail Exchange Records | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dnsPromises.resolveMx()`](/de/nodejs/api/dns#dnspromisesresolvemxhostname) |
| `'NAPTR'` | Name Authority Pointer Records | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dnsPromises.resolveNaptr()`](/de/nodejs/api/dns#dnspromisesresolvenaptrhostname) |
| `'NS'` | Name Server Records | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dnsPromises.resolveNs()`](/de/nodejs/api/dns#dnspromisesresolvenshostname) |
| `'PTR'` | Pointer Records | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dnsPromises.resolvePtr()`](/de/nodejs/api/dns#dnspromisesresolveptrhostname) |
| `'SOA'` | Start of Authority Records | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dnsPromises.resolveSoa()`](/de/nodejs/api/dns#dnspromisesresolvesoahostname) |
| `'SRV'` | Service Records | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dnsPromises.resolveSrv()`](/de/nodejs/api/dns#dnspromisesresolvesrvhostname) |
| `'TXT'` | Text Records | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dnsPromises.resolveTxt()`](/de/nodejs/api/dns#dnspromisesresolvetxthostname) |
Im Fehlerfall wird das `Promise` mit einem [`Error`](/de/nodejs/api/errors#class-error)-Objekt verworfen, wobei `err.code` einer der [DNS-Fehlercodes](/de/nodejs/api/dns#error-codes) ist.


### `dnsPromises.resolve4(hostname[, options])` {#dnspromisesresolve4hostname-options}

**Hinzugefügt in: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Hostname, das aufgelöst werden soll.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ttl` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Ruft den Time-To-Live-Wert (TTL) jedes Eintrags ab. Wenn `true`, wird das `Promise` mit einem Array von `{ address: '1.2.3.4', ttl: 60 }`-Objekten anstelle eines Arrays von Strings aufgelöst, wobei die TTL in Sekunden angegeben wird.

Verwendet das DNS-Protokoll, um IPv4-Adressen (`A`-Einträge) für den `hostname` aufzulösen. Bei Erfolg wird das `Promise` mit einem Array von IPv4-Adressen aufgelöst (z. B. `['74.125.79.104', '74.125.79.105', '74.125.79.106']`).

### `dnsPromises.resolve6(hostname[, options])` {#dnspromisesresolve6hostname-options}

**Hinzugefügt in: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Hostname, das aufgelöst werden soll.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ttl` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Ruft den Time-To-Live-Wert (TTL) jedes Eintrags ab. Wenn `true`, wird das `Promise` mit einem Array von `{ address: '0:1:2:3:4:5:6:7', ttl: 60 }`-Objekten anstelle eines Arrays von Strings aufgelöst, wobei die TTL in Sekunden angegeben wird.

Verwendet das DNS-Protokoll, um IPv6-Adressen (`AAAA`-Einträge) für den `hostname` aufzulösen. Bei Erfolg wird das `Promise` mit einem Array von IPv6-Adressen aufgelöst.

### `dnsPromises.resolveAny(hostname)` {#dnspromisesresolveanyhostname}

**Hinzugefügt in: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Verwendet das DNS-Protokoll, um alle Einträge aufzulösen (auch bekannt als `ANY`- oder `*`-Abfrage). Bei Erfolg wird das `Promise` mit einem Array aufgelöst, das verschiedene Arten von Einträgen enthält. Jedes Objekt hat eine Eigenschaft `type`, die den Typ des aktuellen Eintrags angibt. Und abhängig vom `type` sind zusätzliche Eigenschaften im Objekt vorhanden:

| Typ       | Eigenschaften                       |
| --------- | ------------------------------------ |
| `'A'`     | `address`  /  `ttl`               |
| `'AAAA'`  | `address`  /  `ttl`               |
| `'CNAME'` | `value`                             |
| `'MX'`    | Siehe [`dnsPromises.resolveMx()`](/de/nodejs/api/dns#dnspromisesresolvemxhostname) |
| `'NAPTR'` | Siehe [`dnsPromises.resolveNaptr()`](/de/nodejs/api/dns#dnspromisesresolvenaptrhostname) |
| `'NS'`    | `value`                             |
| `'PTR'`   | `value`                             |
| `'SOA'`   | Siehe [`dnsPromises.resolveSoa()`](/de/nodejs/api/dns#dnspromisesresolvesoahostname) |
| `'SRV'`   | Siehe [`dnsPromises.resolveSrv()`](/de/nodejs/api/dns#dnspromisesresolvesrvhostname) |
| `'TXT'`   | Dieser Eintragstyp enthält eine Array-Eigenschaft namens `entries`, die auf [`dnsPromises.resolveTxt()`](/de/nodejs/api/dns#dnspromisesresolvetxthostname) verweist, z. B. `{ entries: ['...'], type: 'TXT' }` |

Hier ist ein Beispiel für das Ergebnisobjekt:

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

**Hinzugefügt in: v15.0.0, v14.17.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Verwendet das DNS-Protokoll, um `CAA`-Einträge für den `hostname` aufzulösen. Bei Erfolg wird die `Promise` mit einem Array von Objekten aufgelöst, die verfügbare Zertifizierungsstellen-Autorisierungseinträge für den `hostname` enthalten (z. B. `[{critical: 0, iodef: 'mailto:pki@example.com'},{critical: 128, issue: 'pki.example.com'}]`).

### `dnsPromises.resolveCname(hostname)` {#dnspromisesresolvecnamehostname}

**Hinzugefügt in: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Verwendet das DNS-Protokoll, um `CNAME`-Einträge für den `hostname` aufzulösen. Bei Erfolg wird die `Promise` mit einem Array von kanonischen Namenseinträgen aufgelöst, die für den `hostname` verfügbar sind (z. B. `['bar.example.com']`).

### `dnsPromises.resolveMx(hostname)` {#dnspromisesresolvemxhostname}

**Hinzugefügt in: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Verwendet das DNS-Protokoll, um Mail Exchange Records (`MX`-Einträge) für den `hostname` aufzulösen. Bei Erfolg wird die `Promise` mit einem Array von Objekten aufgelöst, die sowohl eine `priority`- als auch eine `exchange`-Eigenschaft enthalten (z. B. `[{priority: 10, exchange: 'mx.example.com'}, ...]`).

### `dnsPromises.resolveNaptr(hostname)` {#dnspromisesresolvenaptrhostname}

**Hinzugefügt in: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Verwendet das DNS-Protokoll, um reguläre Ausdrucks-basierte Einträge (`NAPTR`-Einträge) für den `hostname` aufzulösen. Bei Erfolg wird die `Promise` mit einem Array von Objekten mit den folgenden Eigenschaften aufgelöst:

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

**Hinzugefügt in: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Verwendet das DNS-Protokoll, um Nameserver-Einträge (`NS`-Einträge) für den `hostname` aufzulösen. Bei Erfolg wird die `Promise` mit einem Array von Nameserver-Einträgen aufgelöst, die für `hostname` verfügbar sind (z. B. `['ns1.example.com', 'ns2.example.com']`).


### `dnsPromises.resolvePtr(hostname)` {#dnspromisesresolveptrhostname}

**Hinzugefügt in: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Verwendet das DNS-Protokoll, um Zeigerdatensätze (`PTR`-Datensätze) für den `hostname` aufzulösen. Bei Erfolg wird die `Promise` mit einem Array von Zeichenketten aufgelöst, das die Antwortdatensätze enthält.

### `dnsPromises.resolveSoa(hostname)` {#dnspromisesresolvesoahostname}

**Hinzugefügt in: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Verwendet das DNS-Protokoll, um einen Start of Authority-Datensatz (`SOA`-Datensatz) für den `hostname` aufzulösen. Bei Erfolg wird die `Promise` mit einem Objekt mit den folgenden Eigenschaften aufgelöst:

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

**Hinzugefügt in: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Verwendet das DNS-Protokoll, um Service-Datensätze (`SRV`-Datensätze) für den `hostname` aufzulösen. Bei Erfolg wird die `Promise` mit einem Array von Objekten mit den folgenden Eigenschaften aufgelöst:

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

**Hinzugefügt in: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Verwendet das DNS-Protokoll, um Textabfragen (`TXT`-Datensätze) für den `hostname` aufzulösen. Bei Erfolg wird die `Promise` mit einem zweidimensionalen Array der für `hostname` verfügbaren Textdatensätze aufgelöst (z. B. `[ ['v=spf1 ip4:0.0.0.0 ', '~all' ] ]`). Jedes Sub-Array enthält TXT-Blöcke eines Datensatzes. Je nach Anwendungsfall können diese entweder zusammengefügt oder separat behandelt werden.


### `dnsPromises.reverse(ip)` {#dnspromisesreverseip}

**Hinzugefügt in: v10.6.0**

- `ip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Führt eine Reverse-DNS-Abfrage durch, die eine IPv4- oder IPv6-Adresse in ein Array von Hostnamen auflöst.

Bei einem Fehler wird das `Promise` mit einem [`Error`](/de/nodejs/api/errors#class-error)-Objekt abgelehnt, wobei `err.code` einer der [DNS-Fehlercodes](/de/nodejs/api/dns#error-codes) ist.

### `dnsPromises.setDefaultResultOrder(order)` {#dnspromisessetdefaultresultorderorder}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v22.1.0, v20.13.0 | Der Wert `ipv6first` wird jetzt unterstützt. |
| v17.0.0 | Standardwert auf `verbatim` geändert. |
| v16.4.0, v14.18.0 | Hinzugefügt in: v16.4.0, v14.18.0 |
:::

- `order` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) muss `'ipv4first'`, `'ipv6first'` oder `'verbatim'` sein.

Legt den Standardwert von `order` in [`dns.lookup()`](/de/nodejs/api/dns#dnslookuphostname-options-callback) und [`dnsPromises.lookup()`](/de/nodejs/api/dns#dnspromiseslookuphostname-options) fest. Der Wert kann sein:

- `ipv4first`: setzt `order` standardmäßig auf `ipv4first`.
- `ipv6first`: setzt `order` standardmäßig auf `ipv6first`.
- `verbatim`: setzt `order` standardmäßig auf `verbatim`.

Der Standardwert ist `verbatim` und [`dnsPromises.setDefaultResultOrder()`](/de/nodejs/api/dns#dnspromisessetdefaultresultorderorder) hat eine höhere Priorität als [`--dns-result-order`](/de/nodejs/api/cli#--dns-result-orderorder). Bei Verwendung von [Worker-Threads](/de/nodejs/api/worker_threads) hat [`dnsPromises.setDefaultResultOrder()`](/de/nodejs/api/dns#dnspromisessetdefaultresultorderorder) aus dem Haupt-Thread keine Auswirkungen auf die standardmäßigen DNS-Reihenfolgen in Worker-Threads.

### `dnsPromises.getDefaultResultOrder()` {#dnspromisesgetdefaultresultorder}

**Hinzugefügt in: v20.1.0, v18.17.0**

Ruft den Wert von `dnsOrder` ab.

### `dnsPromises.setServers(servers)` {#dnspromisessetserversservers}

**Hinzugefügt in: v10.6.0**

- `servers` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Array von [RFC 5952](https://tools.ietf.org/html/rfc5952#section-6) formatierten Adressen

Legt die IP-Adresse und den Port der Server fest, die bei der DNS-Auflösung verwendet werden sollen. Das Argument `servers` ist ein Array von [RFC 5952](https://tools.ietf.org/html/rfc5952#section-6) formatierten Adressen. Wenn der Port der IANA-Standard-DNS-Port (53) ist, kann er weggelassen werden.

```js [ESM]
dnsPromises.setServers([
  '8.8.8.8',
  '[2001:4860:4860::8888]',
  '8.8.8.8:1053',
  '[2001:4860:4860::8888]:1053',
]);
```
Es wird ein Fehler ausgegeben, wenn eine ungültige Adresse angegeben wird.

Die Methode `dnsPromises.setServers()` darf nicht aufgerufen werden, während eine DNS-Abfrage läuft.

Diese Methode funktioniert ähnlich wie [resolve.conf](https://man7.org/linux/man-pages/man5/resolv.conf.5). Das heißt, wenn der Versuch, mit dem ersten angegebenen Server aufzulösen, zu einem `NOTFOUND`-Fehler führt, wird die Methode `resolve()` *nicht* versuchen, mit nachfolgenden angegebenen Servern aufzulösen. Fallback-DNS-Server werden nur verwendet, wenn bei den früheren Servern ein Timeout auftritt oder ein anderer Fehler auftritt.


## Fehlercodes {#error-codes}

Jede DNS-Abfrage kann einen der folgenden Fehlercodes zurückgeben:

- `dns.NODATA`: Der DNS-Server hat eine Antwort ohne Daten zurückgegeben.
- `dns.FORMERR`: Der DNS-Server behauptet, dass die Abfrage falsch formatiert war.
- `dns.SERVFAIL`: Der DNS-Server hat einen allgemeinen Fehler zurückgegeben.
- `dns.NOTFOUND`: Der Domänenname wurde nicht gefunden.
- `dns.NOTIMP`: Der DNS-Server implementiert die angeforderte Operation nicht.
- `dns.REFUSED`: Der DNS-Server hat die Abfrage abgelehnt.
- `dns.BADQUERY`: Falsch formatierte DNS-Abfrage.
- `dns.BADNAME`: Falsch formatierter Hostname.
- `dns.BADFAMILY`: Nicht unterstützte Adressfamilie.
- `dns.BADRESP`: Falsch formatierte DNS-Antwort.
- `dns.CONNREFUSED`: Es konnte keine Verbindung zu den DNS-Servern hergestellt werden.
- `dns.TIMEOUT`: Zeitüberschreitung beim Kontaktieren der DNS-Server.
- `dns.EOF`: Dateiende.
- `dns.FILE`: Fehler beim Lesen der Datei.
- `dns.NOMEM`: Nicht genügend Speicher.
- `dns.DESTRUCTION`: Der Kanal wird zerstört.
- `dns.BADSTR`: Falsch formatierte Zeichenkette.
- `dns.BADFLAGS`: Illegale Flags angegeben.
- `dns.NONAME`: Angegebener Hostname ist nicht numerisch.
- `dns.BADHINTS`: Illegale Hinweisfelder angegeben.
- `dns.NOTINITIALIZED`: Die Initialisierung der c-ares-Bibliothek wurde noch nicht durchgeführt.
- `dns.LOADIPHLPAPI`: Fehler beim Laden von `iphlpapi.dll`.
- `dns.ADDRGETNETWORKPARAMS`: Die Funktion `GetNetworkParams` konnte nicht gefunden werden.
- `dns.CANCELLED`: DNS-Abfrage abgebrochen.

Die `dnsPromises`-API exportiert auch die oben genannten Fehlercodes, z. B. `dnsPromises.NODATA`.

## Implementierungsüberlegungen {#implementation-considerations}

Obwohl [`dns.lookup()`](/de/nodejs/api/dns#dnslookuphostname-options-callback) und die verschiedenen `dns.resolve*()/dns.reverse()`-Funktionen das gleiche Ziel haben, einen Netzwerk-Namen mit einer Netzwerkadresse zu verknüpfen (oder umgekehrt), ist ihr Verhalten sehr unterschiedlich. Diese Unterschiede können subtile, aber signifikante Auswirkungen auf das Verhalten von Node.js-Programmen haben.

### `dns.lookup()` {#dnslookup}

Unter der Haube verwendet [`dns.lookup()`](/de/nodejs/api/dns#dnslookuphostname-options-callback) die gleichen Betriebssystemeinrichtungen wie die meisten anderen Programme. Zum Beispiel wird [`dns.lookup()`](/de/nodejs/api/dns#dnslookuphostname-options-callback) einen gegebenen Namen fast immer auf die gleiche Weise auflösen wie der `ping`-Befehl. Auf den meisten POSIX-ähnlichen Betriebssystemen kann das Verhalten der Funktion [`dns.lookup()`](/de/nodejs/api/dns#dnslookuphostname-options-callback) durch Ändern der Einstellungen in [`nsswitch.conf(5)`](http://man7.org/linux/man-pages/man5/nsswitch.conf.5) und/oder [`resolv.conf(5)`](http://man7.org/linux/man-pages/man5/resolv.conf.5) geändert werden, aber das Ändern dieser Dateien wird das Verhalten aller anderen Programme ändern, die auf dem gleichen Betriebssystem laufen.

Obwohl der Aufruf von `dns.lookup()` aus der JavaScript-Perspektive asynchron ist, wird er als synchroner Aufruf von [`getaddrinfo(3)`](http://man7.org/linux/man-pages/man3/getaddrinfo.3) implementiert, der im Threadpool von libuv ausgeführt wird. Dies kann überraschende negative Auswirkungen auf die Leistung einiger Anwendungen haben, siehe die Dokumentation [`UV_THREADPOOL_SIZE`](/de/nodejs/api/cli#uv_threadpool_sizesize) für weitere Informationen.

Verschiedene Netzwerk-APIs rufen `dns.lookup()` intern auf, um Hostnamen aufzulösen. Wenn das ein Problem darstellt, sollten Sie den Hostnamen mit `dns.resolve()` in eine Adresse auflösen und die Adresse anstelle eines Hostnamens verwenden. Einige Netzwerk-APIs (wie [`socket.connect()`](/de/nodejs/api/net#socketconnectoptions-connectlistener) und [`dgram.createSocket()`](/de/nodejs/api/dgram#dgramcreatesocketoptions-callback)) erlauben auch, den Standard-Resolver, `dns.lookup()`, zu ersetzen.


### `dns.resolve()`, `dns.resolve*()` 和 `dns.reverse()` {#dnsresolve-dnsresolve*-and-dnsreverse}

Diese Funktionen sind ganz anders implementiert als [`dns.lookup()`](/de/nodejs/api/dns#dnslookuphostname-options-callback). Sie verwenden nicht [`getaddrinfo(3)`](http://man7.org/linux/man-pages/man3/getaddrinfo.3) und führen *immer* eine DNS-Abfrage im Netzwerk durch. Diese Netzwerkkommunikation erfolgt immer asynchron und verwendet nicht den Threadpool von libuv.

Daher können diese Funktionen nicht die gleichen negativen Auswirkungen auf andere Verarbeitungsprozesse haben, die im Threadpool von libuv stattfinden, wie [`dns.lookup()`](/de/nodejs/api/dns#dnslookuphostname-options-callback).

Sie verwenden nicht die gleichen Konfigurationsdateien wie [`dns.lookup()`](/de/nodejs/api/dns#dnslookuphostname-options-callback). Zum Beispiel verwenden sie nicht die Konfiguration aus `/etc/hosts`.

