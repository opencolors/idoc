---
title: Documentation Node.js - DNS
description: Cette section de la documentation Node.js traite du module DNS (Système de noms de domaine), qui fournit des fonctionnalités de résolution de noms de réseau asynchrone. Elle inclut des méthodes pour résoudre les noms de domaine en adresses IP, les recherches inverses et les requêtes de records DNS.
head:
  - - meta
    - name: og:title
      content: Documentation Node.js - DNS | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Cette section de la documentation Node.js traite du module DNS (Système de noms de domaine), qui fournit des fonctionnalités de résolution de noms de réseau asynchrone. Elle inclut des méthodes pour résoudre les noms de domaine en adresses IP, les recherches inverses et les requêtes de records DNS.
  - - meta
    - name: twitter:title
      content: Documentation Node.js - DNS | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Cette section de la documentation Node.js traite du module DNS (Système de noms de domaine), qui fournit des fonctionnalités de résolution de noms de réseau asynchrone. Elle inclut des méthodes pour résoudre les noms de domaine en adresses IP, les recherches inverses et les requêtes de records DNS.
---


# DNS {#dns}

::: tip [Stable: 2 - Stable]
[Stable: 2](/fr/nodejs/api/documentation#stability-index) [Stability: 2](/fr/nodejs/api/documentation#stability-index) - Stable
:::

**Code source:** [lib/dns.js](https://github.com/nodejs/node/blob/v23.5.0/lib/dns.js)

Le module `node:dns` permet la résolution de noms. Par exemple, utilisez-le pour rechercher les adresses IP des noms d'hôte.

Bien qu'il porte le nom de [Domain Name System (DNS)](https://en.wikipedia.org/wiki/Domain_Name_System), il n'utilise pas toujours le protocole DNS pour les recherches. [`dns.lookup()`](/fr/nodejs/api/dns#dnslookuphostname-options-callback) utilise les fonctions du système d'exploitation pour effectuer la résolution de noms. Il n'est peut-être pas nécessaire d'effectuer une communication réseau. Pour effectuer la résolution de noms de la même manière que les autres applications sur le même système, utilisez [`dns.lookup()`](/fr/nodejs/api/dns#dnslookuphostname-options-callback).

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

Toutes les autres fonctions du module `node:dns` se connectent à un serveur DNS réel pour effectuer la résolution de noms. Elles utiliseront toujours le réseau pour effectuer des requêtes DNS. Ces fonctions n'utilisent pas le même ensemble de fichiers de configuration que [`dns.lookup()`](/fr/nodejs/api/dns#dnslookuphostname-options-callback) (par exemple, `/etc/hosts`). Utilisez ces fonctions pour toujours effectuer des requêtes DNS, en contournant les autres mécanismes de résolution de noms.

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

Voir la section [Considérations d'implémentation](/fr/nodejs/api/dns#implementation-considerations) pour plus d'informations.


## Classe : `dns.Resolver` {#class-dnsresolver}

**Ajoutée dans : v8.3.0**

Un résolveur indépendant pour les requêtes DNS.

La création d'un nouveau résolveur utilise les paramètres du serveur par défaut. La définition des serveurs utilisés pour un résolveur à l'aide de [`resolver.setServers()`](/fr/nodejs/api/dns#dnssetserversservers) n'affecte pas les autres résolveurs :

::: code-group
```js [ESM]
import { Resolver } from 'node:dns';
const resolver = new Resolver();
resolver.setServers(['4.4.4.4']);

// Cette requête utilisera le serveur à l'adresse 4.4.4.4, indépendamment des paramètres globaux.
resolver.resolve4('example.org', (err, addresses) => {
  // ...
});
```

```js [CJS]
const { Resolver } = require('node:dns');
const resolver = new Resolver();
resolver.setServers(['4.4.4.4']);

// Cette requête utilisera le serveur à l'adresse 4.4.4.4, indépendamment des paramètres globaux.
resolver.resolve4('example.org', (err, addresses) => {
  // ...
});
```
:::

Les méthodes suivantes du module `node:dns` sont disponibles :

- [`resolver.getServers()`](/fr/nodejs/api/dns#dnsgetservers)
- [`resolver.resolve()`](/fr/nodejs/api/dns#dnsresolvehostname-rrtype-callback)
- [`resolver.resolve4()`](/fr/nodejs/api/dns#dnsresolve4hostname-options-callback)
- [`resolver.resolve6()`](/fr/nodejs/api/dns#dnsresolve6hostname-options-callback)
- [`resolver.resolveAny()`](/fr/nodejs/api/dns#dnsresolveanyhostname-callback)
- [`resolver.resolveCaa()`](/fr/nodejs/api/dns#dnsresolvecaahostname-callback)
- [`resolver.resolveCname()`](/fr/nodejs/api/dns#dnsresolvecnamehostname-callback)
- [`resolver.resolveMx()`](/fr/nodejs/api/dns#dnsresolvemxhostname-callback)
- [`resolver.resolveNaptr()`](/fr/nodejs/api/dns#dnsresolvenaptrhostname-callback)
- [`resolver.resolveNs()`](/fr/nodejs/api/dns#dnsresolvenshostname-callback)
- [`resolver.resolvePtr()`](/fr/nodejs/api/dns#dnsresolveptrhostname-callback)
- [`resolver.resolveSoa()`](/fr/nodejs/api/dns#dnsresolvesoahostname-callback)
- [`resolver.resolveSrv()`](/fr/nodejs/api/dns#dnsresolvesrvhostname-callback)
- [`resolver.resolveTxt()`](/fr/nodejs/api/dns#dnsresolvetxthostname-callback)
- [`resolver.reverse()`](/fr/nodejs/api/dns#dnsreverseip-callback)
- [`resolver.setServers()`](/fr/nodejs/api/dns#dnssetserversservers)

### `Resolver([options])` {#resolveroptions}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v16.7.0, v14.18.0 | L'objet `options` accepte désormais une option `tries`. |
| v12.18.3 | Le constructeur accepte désormais un objet `options`. La seule option prise en charge est `timeout`. |
| v8.3.0 | Ajoutée dans : v8.3.0 |
:::

Crée un nouveau résolveur.

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Délai d'expiration de la requête en millisecondes, ou `-1` pour utiliser le délai d'expiration par défaut.
    - `tries` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre de tentatives que le résolveur tentera de contacter chaque serveur de noms avant d'abandonner. **Par défaut :** `4`


### `resolver.cancel()` {#resolvercancel}

**Ajouté dans : v8.3.0**

Annule toutes les requêtes DNS en attente effectuées par ce résolveur. Les rappels correspondants seront appelés avec une erreur avec le code `ECANCELLED`.

### `resolver.setLocalAddress([ipv4][, ipv6])` {#resolversetlocaladdressipv4-ipv6}

**Ajouté dans : v15.1.0, v14.17.0**

- `ipv4` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Une représentation sous forme de chaîne d’une adresse IPv4. **Par défaut :** `'0.0.0.0'`
- `ipv6` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Une représentation sous forme de chaîne d’une adresse IPv6. **Par défaut :** `'::0'`

L’instance du résolveur enverra ses requêtes à partir de l’adresse IP spécifiée. Cela permet aux programmes de spécifier les interfaces sortantes lorsqu’ils sont utilisés sur des systèmes multi-hébergés.

Si une adresse v4 ou v6 n’est pas spécifiée, elle est définie sur la valeur par défaut et le système d’exploitation choisira automatiquement une adresse locale.

Le résolveur utilisera l’adresse locale v4 lors de la formulation de requêtes aux serveurs DNS IPv4, et l’adresse locale v6 lors de la formulation de requêtes aux serveurs DNS IPv6. Le `rrtype` des requêtes de résolution n’a aucun impact sur l’adresse locale utilisée.

## `dns.getServers()` {#dnsgetservers}

**Ajouté dans : v0.11.3**

- Retourne : [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retourne un tableau de chaînes d’adresses IP, formatées conformément à la [RFC 5952](https://tools.ietf.org/html/rfc5952#section-6), qui sont actuellement configurées pour la résolution DNS. Une chaîne inclura une section de port si un port personnalisé est utilisé.

```js [ESM]
[
  '8.8.8.8',
  '2001:4860:4860::8888',
  '8.8.8.8:1053',
  '[2001:4860:4860::8888]:1053',
]
```
## `dns.lookup(hostname[, options], callback)` {#dnslookuphostname-options-callback}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v22.1.0, v20.13.0 | L’option `verbatim` est désormais obsolète au profit de la nouvelle option `order`. |
| v18.4.0 | Pour la compatibilité avec `node:net`, lors du passage d’un objet d’option, l’option `family` peut être la chaîne `'IPv4'` ou la chaîne `'IPv6'`. |
| v18.0.0 | Le passage d’un rappel non valide à l’argument `callback` lève désormais `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v17.0.0 | Les options `verbatim` sont désormais définies par défaut sur `true`. |
| v8.5.0 | L’option `verbatim` est désormais prise en charge. |
| v1.2.0 | L’option `all` est désormais prise en charge. |
| v0.1.90 | Ajouté dans : v0.1.90 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `family` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La famille d’enregistrements. Doit être `4`, `6` ou `0`. Pour des raisons de compatibilité descendante, `'IPv4'` et `'IPv6'` sont interprétés respectivement comme `4` et `6`. La valeur `0` indique qu’une adresse IPv4 ou IPv6 est retournée. Si la valeur `0` est utilisée avec `{ all: true }` (voir ci-dessous), soit une adresse IPv4, soit une adresse IPv6, soit les deux sont retournées, selon le résolveur DNS du système. **Par défaut :** `0`.
    - `hints` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un ou plusieurs [indicateurs `getaddrinfo` pris en charge](/fr/nodejs/api/dns#supported-getaddrinfo-flags). Plusieurs indicateurs peuvent être transmis en appliquant un `OR` bit à bit à leurs valeurs.
    - `all` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Lorsque la valeur est `true`, le rappel retourne toutes les adresses résolues dans un tableau. Sinon, retourne une seule adresse. **Par défaut :** `false`.
    - `order` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Lorsque la valeur est `verbatim`, les adresses résolues sont retournées non triées. Lorsque la valeur est `ipv4first`, les adresses résolues sont triées en plaçant les adresses IPv4 avant les adresses IPv6. Lorsque la valeur est `ipv6first`, les adresses résolues sont triées en plaçant les adresses IPv6 avant les adresses IPv4. **Par défaut :** `verbatim` (les adresses ne sont pas réorganisées). La valeur par défaut est configurable à l’aide de [`dns.setDefaultResultOrder()`](/fr/nodejs/api/dns#dnssetdefaultresultorderorder) ou [`--dns-result-order`](/fr/nodejs/api/cli#--dns-result-orderorder).
    - `verbatim` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Lorsque la valeur est `true`, le rappel reçoit les adresses IPv4 et IPv6 dans l’ordre dans lequel le résolveur DNS les a retournées. Lorsque la valeur est `false`, les adresses IPv4 sont placées avant les adresses IPv6. Cette option sera obsolète au profit de `order`. Lorsque les deux sont spécifiés, `order` a une priorité plus élevée. Le nouveau code ne doit utiliser que `order`. **Par défaut :** `true` (les adresses ne sont pas réorganisées). La valeur par défaut est configurable à l’aide de [`dns.setDefaultResultOrder()`](/fr/nodejs/api/dns#dnssetdefaultresultorderorder) ou [`--dns-result-order`](/fr/nodejs/api/cli#--dns-result-orderorder).


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Représentation sous forme de chaîne d’une adresse IPv4 ou IPv6.
    - `family` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `4` ou `6`, désignant la famille de `address`, ou `0` si l’adresse n’est pas une adresse IPv4 ou IPv6. `0` est un indicateur probable d’un bogue dans le service de résolution de nom utilisé par le système d’exploitation.


Résout un nom d’hôte (par exemple `'nodejs.org'`) dans le premier enregistrement A (IPv4) ou AAAA (IPv6) trouvé. Toutes les propriétés `option` sont facultatives. Si `options` est un entier, il doit être `4` ou `6` : si `options` n’est pas fourni, alors les adresses IPv4 ou IPv6, ou les deux, sont retournées si elles sont trouvées.

Avec l’option `all` définie sur `true`, les arguments de `callback` passent à `(err, addresses)`, avec `addresses` étant un tableau d’objets avec les propriétés `address` et `family`.

En cas d’erreur, `err` est un objet [`Error`](/fr/nodejs/api/errors#class-error), où `err.code` est le code d’erreur. Gardez à l’esprit que `err.code` sera défini sur `'ENOTFOUND'` non seulement lorsque le nom d’hôte n’existe pas, mais également lorsque la recherche échoue d’autres manières, comme l’absence de descripteurs de fichiers disponibles.

`dns.lookup()` n’a pas nécessairement de lien avec le protocole DNS. L’implémentation utilise une fonctionnalité du système d’exploitation qui peut associer des noms à des adresses et vice versa. Cette implémentation peut avoir des conséquences subtiles mais importantes sur le comportement de tout programme Node.js. Veuillez prendre le temps de consulter la [section Considérations sur l’implémentation](/fr/nodejs/api/dns#implementation-considerations) avant d’utiliser `dns.lookup()`.

Exemple d’utilisation :



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

Si cette méthode est invoquée comme sa version [`util.promisify()`](/fr/nodejs/api/util#utilpromisifyoriginal)ée, et que `all` n’est pas défini sur `true`, elle retourne une `Promise` pour un `Object` avec les propriétés `address` et `family`.


### Indicateurs getaddrinfo pris en charge {#supported-getaddrinfo-flags}

::: info [Historique]
| Version   | Modifications                               |
| :-------- | :------------------------------------------ |
| v13.13.0, v12.17.0 | Ajout de la prise en charge de l'indicateur `dns.ALL`. |
:::

Les indicateurs suivants peuvent être transmis en tant qu'indications à [`dns.lookup()`](/fr/nodejs/api/dns#dnslookuphostname-options-callback).

- `dns.ADDRCONFIG` : Limite les types d'adresses renvoyés aux types d'adresses non-boucle locale configurées sur le système. Par exemple, les adresses IPv4 ne sont renvoyées que si le système actuel a au moins une adresse IPv4 configurée.
- `dns.V4MAPPED` : Si la famille IPv6 a été spécifiée, mais qu'aucune adresse IPv6 n'a été trouvée, renvoie les adresses IPv6 mappées IPv4. Elle n'est pas prise en charge sur certains systèmes d'exploitation (par exemple FreeBSD 10.1).
- `dns.ALL` : Si `dns.V4MAPPED` est spécifié, renvoie les adresses IPv6 résolues ainsi que les adresses IPv6 mappées IPv4.

## `dns.lookupService(address, port, callback)` {#dnslookupserviceaddress-port-callback}

::: info [Historique]
| Version   | Modifications                                                                                                                                                                                                                                                                                                                                                            |
| :-------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| v18.0.0 | La transmission d'un callback invalide à l'argument `callback` lève maintenant `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`.                                                                                                                                                                                                                                |
| v0.11.14 | Ajoutée dans : v0.11.14                                                                                                                                                                                                                                                                                                                                                   |
:::

- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
  - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  - `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) par ex. `example.com`
  - `service` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) par ex. `http`

Résout l' `address` et le `port` donnés en un nom d'hôte et un service à l'aide de l'implémentation `getnameinfo` sous-jacente du système d'exploitation.

Si `address` n'est pas une adresse IP valide, une `TypeError` sera levée. Le `port` sera converti en nombre. S'il ne s'agit pas d'un port légal, une `TypeError` sera levée.

En cas d'erreur, `err` est un objet [`Error`](/fr/nodejs/api/errors#class-error), où `err.code` est le code d'erreur.

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

Si cette méthode est invoquée comme sa version [`util.promisify()`](/fr/nodejs/api/util#utilpromisifyoriginal)ed, elle renvoie une `Promise` pour un `Object` avec les propriétés `hostname` et `service`.


## `dns.resolve(hostname[, rrtype], callback)` {#dnsresolvehostname-rrtype-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Passer un callback invalide à l'argument `callback` lève maintenant `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v0.1.27 | Ajouté dans : v0.1.27 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nom d'hôte à résoudre.
- `rrtype` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Type d'enregistrement de ressource. **Par défaut :** `'A'`.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `records` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Utilise le protocole DNS pour résoudre un nom d'hôte (par exemple, `'nodejs.org'`) en un tableau d'enregistrements de ressources. La fonction `callback` a les arguments `(err, records)`. En cas de succès, `records` sera un tableau d'enregistrements de ressources. Le type et la structure des résultats individuels varient en fonction de `rrtype`:

| `rrtype` | `records` contient | Type de résultat | Méthode abrégée |
| --- | --- | --- | --- |
| `'A'` | Adresses IPv4 (par défaut) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dns.resolve4()`](/fr/nodejs/api/dns#dnsresolve4hostname-options-callback) |
| `'AAAA'` | Adresses IPv6 | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dns.resolve6()`](/fr/nodejs/api/dns#dnsresolve6hostname-options-callback) |
| `'ANY'` | n'importe quel enregistrement | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dns.resolveAny()`](/fr/nodejs/api/dns#dnsresolveanyhostname-callback) |
| `'CAA'` | Enregistrements d'autorisation CA | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dns.resolveCaa()`](/fr/nodejs/api/dns#dnsresolvecaahostname-callback) |
| `'CNAME'` | Enregistrements de nom canonique | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dns.resolveCname()`](/fr/nodejs/api/dns#dnsresolvecnamehostname-callback) |
| `'MX'` | Enregistrements d'échange de courrier | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dns.resolveMx()`](/fr/nodejs/api/dns#dnsresolvemxhostname-callback) |
| `'NAPTR'` | Enregistrements de pointeur d'autorité de nom | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dns.resolveNaptr()`](/fr/nodejs/api/dns#dnsresolvenaptrhostname-callback) |
| `'NS'` | Enregistrements de serveur de noms | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dns.resolveNs()`](/fr/nodejs/api/dns#dnsresolvenshostname-callback) |
| `'PTR'` | Enregistrements de pointeur | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dns.resolvePtr()`](/fr/nodejs/api/dns#dnsresolveptrhostname-callback) |
| `'SOA'` | Enregistrements de début d'autorité | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dns.resolveSoa()`](/fr/nodejs/api/dns#dnsresolvesoahostname-callback) |
| `'SRV'` | Enregistrements de service | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dns.resolveSrv()`](/fr/nodejs/api/dns#dnsresolvesrvhostname-callback) |
| `'TXT'` | Enregistrements de texte | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dns.resolveTxt()`](/fr/nodejs/api/dns#dnsresolvetxthostname-callback) |

En cas d'erreur, `err` est un objet [`Error`](/fr/nodejs/api/errors#class-error), où `err.code` est l'un des [codes d'erreur DNS](/fr/nodejs/api/dns#error-codes).


## `dns.resolve4(hostname[, options], callback)` {#dnsresolve4hostname-options-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Passer un callback invalide à l'argument `callback` lève désormais `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v7.2.0 | Cette méthode prend désormais en charge le passage d'`options`, en particulier `options.ttl`. |
| v0.1.16 | Ajouté dans : v0.1.16 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nom d'hôte à résoudre.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ttl` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Récupère la valeur Time-To-Live (TTL) de chaque enregistrement. Lorsque `true`, le callback reçoit un tableau d'objets `{ address: '1.2.3.4', ttl: 60 }` plutôt qu'un tableau de chaînes, avec le TTL exprimé en secondes.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  
 

Utilise le protocole DNS pour résoudre une adresse IPv4 (enregistrements `A`) pour le `hostname`. L'argument `addresses` passé à la fonction `callback` contiendra un tableau d'adresses IPv4 (par ex. `['74.125.79.104', '74.125.79.105', '74.125.79.106']`).

## `dns.resolve6(hostname[, options], callback)` {#dnsresolve6hostname-options-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Passer un callback invalide à l'argument `callback` lève désormais `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v7.2.0 | Cette méthode prend désormais en charge le passage d'`options`, en particulier `options.ttl`. |
| v0.1.16 | Ajouté dans : v0.1.16 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nom d'hôte à résoudre.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ttl` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Récupère la valeur Time-To-Live (TTL) de chaque enregistrement. Lorsque `true`, le callback reçoit un tableau d'objets `{ address: '0:1:2:3:4:5:6:7', ttl: 60 }` plutôt qu'un tableau de chaînes, avec le TTL exprimé en secondes.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  
 

Utilise le protocole DNS pour résoudre les adresses IPv6 (enregistrements `AAAA`) pour le `hostname`. L'argument `addresses` passé à la fonction `callback` contiendra un tableau d'adresses IPv6.


## `dns.resolveAny(hostname, callback)` {#dnsresolveanyhostname-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Passer un callback invalide à l'argument `callback` lève maintenant `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `ret` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Utilise le protocole DNS pour résoudre tous les enregistrements (également appelés requête `ANY` ou `*`). L'argument `ret` passé à la fonction `callback` sera un tableau contenant divers types d'enregistrements. Chaque objet possède une propriété `type` qui indique le type de l'enregistrement actuel. Et en fonction du `type`, des propriétés supplémentaires seront présentes sur l'objet :

| Type | Propriétés |
| --- | --- |
| `'A'` | `address`  /  `ttl` |
| `'AAAA'` | `address`  /  `ttl` |
| `'CNAME'` | `value` |
| `'MX'` | Voir [`dns.resolveMx()`](/fr/nodejs/api/dns#dnsresolvemxhostname-callback) |
| `'NAPTR'` | Voir [`dns.resolveNaptr()`](/fr/nodejs/api/dns#dnsresolvenaptrhostname-callback) |
| `'NS'` | `value` |
| `'PTR'` | `value` |
| `'SOA'` | Voir [`dns.resolveSoa()`](/fr/nodejs/api/dns#dnsresolvesoahostname-callback) |
| `'SRV'` | Voir [`dns.resolveSrv()`](/fr/nodejs/api/dns#dnsresolvesrvhostname-callback) |
| `'TXT'` | Ce type d'enregistrement contient une propriété de tableau appelée `entries` qui fait référence à [`dns.resolveTxt()`](/fr/nodejs/api/dns#dnsresolvetxthostname-callback), par exemple `{ entries: ['...'], type: 'TXT' }` |
Voici un exemple de l'objet `ret` passé au callback :

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
Les opérateurs de serveurs DNS peuvent choisir de ne pas répondre aux requêtes `ANY`. Il peut être préférable d'appeler des méthodes individuelles telles que [`dns.resolve4()`](/fr/nodejs/api/dns#dnsresolve4hostname-options-callback), [`dns.resolveMx()`](/fr/nodejs/api/dns#dnsresolvemxhostname-callback), et ainsi de suite. Pour plus de détails, voir [RFC 8482](https://tools.ietf.org/html/rfc8482).


## `dns.resolveCname(hostname, callback)` {#dnsresolvecnamehostname-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Passer un callback invalide à l'argument `callback` lève maintenant `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v0.3.2 | Ajouté dans : v0.3.2 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Utilise le protocole DNS pour résoudre les enregistrements `CNAME` pour le `hostname`. L'argument `addresses` passé à la fonction `callback` contiendra un tableau d'enregistrements de nom canonique disponibles pour le `hostname` (par exemple, `['bar.example.com']`).

## `dns.resolveCaa(hostname, callback)` {#dnsresolvecaahostname-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Passer un callback invalide à l'argument `callback` lève maintenant `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v15.0.0, v14.17.0 | Ajouté dans : v15.0.0, v14.17.0 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `records` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Utilise le protocole DNS pour résoudre les enregistrements `CAA` pour le `hostname`. L'argument `addresses` passé à la fonction `callback` contiendra un tableau d'enregistrements d'autorisation d'autorité de certification disponibles pour le `hostname` (par exemple, `[{critical: 0, iodef: 'mailto:pki@example.com'}, {critical: 128, issue: 'pki.example.com'}]`).


## `dns.resolveMx(hostname, callback)` {#dnsresolvemxhostname-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Passer un callback invalide à l'argument `callback` lève désormais `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v0.1.27 | Ajouté dans : v0.1.27 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  
 

Utilise le protocole DNS pour résoudre les enregistrements d'échange de courrier (`MX` records) pour le `hostname`. L'argument `addresses` passé à la fonction `callback` contiendra un tableau d'objets contenant à la fois une propriété `priority` et `exchange` (par exemple `[{priority: 10, exchange: 'mx.example.com'}, ...]`).

## `dns.resolveNaptr(hostname, callback)` {#dnsresolvenaptrhostname-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Passer un callback invalide à l'argument `callback` lève désormais `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v0.9.12 | Ajouté dans : v0.9.12 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  
 

Utilise le protocole DNS pour résoudre les enregistrements basés sur des expressions régulières (`NAPTR` records) pour le `hostname`. L'argument `addresses` passé à la fonction `callback` contiendra un tableau d'objets avec les propriétés suivantes :

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

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Transmettre un callback invalide à l'argument `callback` lève maintenant `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v0.1.90 | Ajouté dans : v0.1.90 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Utilise le protocole DNS pour résoudre les enregistrements de serveur de noms (enregistrements `NS`) pour le `hostname`. L'argument `addresses` passé à la fonction `callback` contiendra un tableau d'enregistrements de serveur de noms disponibles pour `hostname` (par exemple, `['ns1.example.com', 'ns2.example.com']`).

## `dns.resolvePtr(hostname, callback)` {#dnsresolveptrhostname-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Transmettre un callback invalide à l'argument `callback` lève maintenant `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v6.0.0 | Ajouté dans : v6.0.0 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Utilise le protocole DNS pour résoudre les enregistrements de pointeur (`PTR`) pour le `hostname`. L'argument `addresses` passé à la fonction `callback` sera un tableau de chaînes de caractères contenant les enregistrements de réponse.

## `dns.resolveSoa(hostname, callback)` {#dnsresolvesoahostname-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Transmettre un callback invalide à l'argument `callback` lève maintenant `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v0.11.10 | Ajouté dans : v0.11.10 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `address` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Utilise le protocole DNS pour résoudre un enregistrement de début d'autorité (enregistrement `SOA`) pour le `hostname`. L'argument `address` passé à la fonction `callback` sera un objet avec les propriétés suivantes :

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

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Transmettre un rappel invalide à l'argument `callback` lève maintenant `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v0.1.27 | Ajouté dans : v0.1.27 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  
 

Utilise le protocole DNS pour résoudre les enregistrements de service (enregistrements `SRV`) pour le `hostname`. L'argument `addresses` transmis à la fonction `callback` sera un tableau d'objets avec les propriétés suivantes :

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


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Transmettre un rappel invalide à l'argument `callback` lève maintenant `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v0.1.27 | Ajouté dans : v0.1.27 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `records` [\<string[][]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
  
 

Utilise le protocole DNS pour résoudre les requêtes de texte (enregistrements `TXT`) pour le `hostname`. L'argument `records` transmis à la fonction `callback` est un tableau bidimensionnel des enregistrements de texte disponibles pour `hostname` (par exemple, `[ ['v=spf1 ip4:0.0.0.0 ', '~all' ] ]`). Chaque sous-tableau contient des blocs TXT d'un enregistrement. Selon le cas d'utilisation, ceux-ci peuvent être regroupés ou traités séparément.


## `dns.reverse(ip, callback)` {#dnsreverseip-callback}

**Ajoutée dans : v0.1.16**

- `ip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `hostnames` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Effectue une requête DNS inverse qui résout une adresse IPv4 ou IPv6 en un tableau de noms d'hôte.

En cas d'erreur, `err` est un objet [`Error`](/fr/nodejs/api/errors#class-error), où `err.code` est l'un des [codes d'erreur DNS](/fr/nodejs/api/dns#error-codes).

## `dns.setDefaultResultOrder(order)` {#dnssetdefaultresultorderorder}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v22.1.0, v20.13.0 | La valeur `ipv6first` est désormais prise en charge. |
| v17.0.0 | Valeur par défaut modifiée en `verbatim`. |
| v16.4.0, v14.18.0 | Ajoutée dans : v16.4.0, v14.18.0 |
:::

- `order` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) doit être `'ipv4first'`, `'ipv6first'` ou `'verbatim'`.

Définissez la valeur par défaut de `order` dans [`dns.lookup()`](/fr/nodejs/api/dns#dnslookuphostname-options-callback) et [`dnsPromises.lookup()`](/fr/nodejs/api/dns#dnspromiseslookuphostname-options). La valeur peut être :

- `ipv4first` : définit la valeur par défaut de `order` sur `ipv4first`.
- `ipv6first` : définit la valeur par défaut de `order` sur `ipv6first`.
- `verbatim` : définit la valeur par défaut de `order` sur `verbatim`.

La valeur par défaut est `verbatim` et [`dns.setDefaultResultOrder()`](/fr/nodejs/api/dns#dnssetdefaultresultorderorder) a une priorité plus élevée que [`--dns-result-order`](/fr/nodejs/api/cli#--dns-result-orderorder). Lorsque vous utilisez des [threads de worker](/fr/nodejs/api/worker_threads), [`dns.setDefaultResultOrder()`](/fr/nodejs/api/dns#dnssetdefaultresultorderorder) à partir du thread principal n'affectera pas les ordres DNS par défaut dans les workers.

## `dns.getDefaultResultOrder()` {#dnsgetdefaultresultorder}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v22.1.0, v20.13.0 | La valeur `ipv6first` est désormais prise en charge. |
| v20.1.0, v18.17.0 | Ajoutée dans : v20.1.0, v18.17.0 |
:::

Obtenez la valeur par défaut pour `order` dans [`dns.lookup()`](/fr/nodejs/api/dns#dnslookuphostname-options-callback) et [`dnsPromises.lookup()`](/fr/nodejs/api/dns#dnspromiseslookuphostname-options). La valeur peut être :

- `ipv4first` : pour `order` qui est par défaut `ipv4first`.
- `ipv6first` : pour `order` qui est par défaut `ipv6first`.
- `verbatim` : pour `order` qui est par défaut `verbatim`.


## `dns.setServers(servers)` {#dnssetserversservers}

**Ajoutée dans : v0.11.3**

- `servers` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) tableau d'adresses formatées [RFC 5952](https://tools.ietf.org/html/rfc5952#section-6)

Définit l'adresse IP et le port des serveurs à utiliser lors de la résolution DNS. L'argument `servers` est un tableau d'adresses formatées [RFC 5952](https://tools.ietf.org/html/rfc5952#section-6). Si le port est le port DNS par défaut IANA (53), il peut être omis.

```js [ESM]
dns.setServers([
  '8.8.8.8',
  '[2001:4860:4860::8888]',
  '8.8.8.8:1053',
  '[2001:4860:4860::8888]:1053',
]);
```
Une erreur sera levée si une adresse invalide est fournie.

La méthode `dns.setServers()` ne doit pas être appelée lorsqu'une requête DNS est en cours.

La méthode [`dns.setServers()`](/fr/nodejs/api/dns#dnssetserversservers) affecte uniquement [`dns.resolve()`](/fr/nodejs/api/dns#dnsresolvehostname-rrtype-callback), `dns.resolve*()` et [`dns.reverse()`](/fr/nodejs/api/dns#dnsreverseip-callback) (et spécifiquement *pas* [`dns.lookup()`](/fr/nodejs/api/dns#dnslookuphostname-options-callback)).

Cette méthode fonctionne de la même manière que [resolve.conf](https://man7.org/linux/man-pages/man5/resolv.conf.5). Autrement dit, si la tentative de résolution avec le premier serveur fourni entraîne une erreur `NOTFOUND`, la méthode `resolve()` ne tentera *pas* de résoudre avec les serveurs suivants fournis. Les serveurs DNS de secours ne seront utilisés que si les précédents expirent ou entraînent une autre erreur.

## API DNS promises {#dns-promises-api}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v15.0.0 | Exposée en tant que `require('dns/promises')`. |
| v11.14.0, v10.17.0 | Cette API n'est plus expérimentale. |
| v10.6.0 | Ajoutée dans : v10.6.0 |
:::

L'API `dns.promises` fournit un ensemble alternatif de méthodes DNS asynchrones qui renvoient des objets `Promise` plutôt que d'utiliser des rappels. L'API est accessible via `require('node:dns').promises` ou `require('node:dns/promises')`.

### Class: `dnsPromises.Resolver` {#class-dnspromisesresolver}

**Ajoutée dans : v10.6.0**

Un résolveur indépendant pour les requêtes DNS.

La création d'un nouveau résolveur utilise les paramètres de serveur par défaut. La configuration des serveurs utilisés pour un résolveur à l'aide de [`resolver.setServers()`](/fr/nodejs/api/dns#dnspromisessetserversservers) n'affecte pas les autres résolveurs :



::: code-group
```js [ESM]
import { Resolver } from 'node:dns/promises';
const resolver = new Resolver();
resolver.setServers(['4.4.4.4']);

// Cette requête utilisera le serveur à 4.4.4.4, indépendamment des paramètres globaux.
const addresses = await resolver.resolve4('example.org');
```

```js [CJS]
const { Resolver } = require('node:dns').promises;
const resolver = new Resolver();
resolver.setServers(['4.4.4.4']);

// Cette requête utilisera le serveur à 4.4.4.4, indépendamment des paramètres globaux.
resolver.resolve4('example.org').then((addresses) => {
  // ...
});

// Alternativement, le même code peut être écrit en utilisant le style async-await.
(async function() {
  const addresses = await resolver.resolve4('example.org');
})();
```
:::

Les méthodes suivantes de l'API `dnsPromises` sont disponibles :

- [`resolver.getServers()`](/fr/nodejs/api/dns#dnspromisesgetservers)
- [`resolver.resolve()`](/fr/nodejs/api/dns#dnspromisesresolvehostname-rrtype)
- [`resolver.resolve4()`](/fr/nodejs/api/dns#dnspromisesresolve4hostname-options)
- [`resolver.resolve6()`](/fr/nodejs/api/dns#dnspromisesresolve6hostname-options)
- [`resolver.resolveAny()`](/fr/nodejs/api/dns#dnspromisesresolveanyhostname)
- [`resolver.resolveCaa()`](/fr/nodejs/api/dns#dnspromisesresolvecaahostname)
- [`resolver.resolveCname()`](/fr/nodejs/api/dns#dnspromisesresolvecnamehostname)
- [`resolver.resolveMx()`](/fr/nodejs/api/dns#dnspromisesresolvemxhostname)
- [`resolver.resolveNaptr()`](/fr/nodejs/api/dns#dnspromisesresolvenaptrhostname)
- [`resolver.resolveNs()`](/fr/nodejs/api/dns#dnspromisesresolvenshostname)
- [`resolver.resolvePtr()`](/fr/nodejs/api/dns#dnspromisesresolveptrhostname)
- [`resolver.resolveSoa()`](/fr/nodejs/api/dns#dnspromisesresolvesoahostname)
- [`resolver.resolveSrv()`](/fr/nodejs/api/dns#dnspromisesresolvesrvhostname)
- [`resolver.resolveTxt()`](/fr/nodejs/api/dns#dnspromisesresolvetxthostname)
- [`resolver.reverse()`](/fr/nodejs/api/dns#dnspromisesreverseip)
- [`resolver.setServers()`](/fr/nodejs/api/dns#dnspromisessetserversservers)


### `resolver.cancel()` {#resolvercancel_1}

**Ajouté dans : v15.3.0, v14.17.0**

Annule toutes les requêtes DNS en attente effectuées par ce résolveur. Les promesses correspondantes seront rejetées avec une erreur avec le code `ECANCELLED`.

### `dnsPromises.getServers()` {#dnspromisesgetservers}

**Ajouté dans : v10.6.0**

- Retourne : [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retourne un tableau de chaînes d’adresses IP, formatées selon [RFC 5952](https://tools.ietf.org/html/rfc5952#section-6), qui sont actuellement configurées pour la résolution DNS. Une chaîne inclura une section de port si un port personnalisé est utilisé.

```js [ESM]
[
  '8.8.8.8',
  '2001:4860:4860::8888',
  '8.8.8.8:1053',
  '[2001:4860:4860::8888]:1053',
]
```
### `dnsPromises.lookup(hostname[, options])` {#dnspromiseslookuphostname-options}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v22.1.0, v20.13.0 | L'option `verbatim` est maintenant obsolète en faveur de la nouvelle option `order`. |
| v10.6.0 | Ajouté dans : v10.6.0 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `family` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La famille d’enregistrements. Doit être `4`, `6` ou `0`. La valeur `0` indique qu’une adresse IPv4 ou IPv6 est retournée. Si la valeur `0` est utilisée avec `{ all: true }` (voir ci-dessous), une ou les deux adresses IPv4 et IPv6 sont retournées, selon le résolveur DNS du système. **Par défaut :** `0`.
    - `hints` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un ou plusieurs [indicateurs `getaddrinfo` pris en charge](/fr/nodejs/api/dns#supported-getaddrinfo-flags). Plusieurs indicateurs peuvent être transmis en effectuant un `OR` bit à bit de leurs valeurs.
    - `all` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Lorsque `true`, la `Promise` est résolue avec toutes les adresses dans un tableau. Sinon, retourne une seule adresse. **Par défaut :** `false`.
    - `order` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Lorsque `verbatim`, la `Promise` est résolue avec les adresses IPv4 et IPv6 dans l’ordre dans lequel le résolveur DNS les a retournées. Lorsque `ipv4first`, les adresses IPv4 sont placées avant les adresses IPv6. Lorsque `ipv6first`, les adresses IPv6 sont placées avant les adresses IPv4. **Par défaut :** `verbatim` (les adresses ne sont pas réorganisées). La valeur par défaut est configurable à l’aide de [`dns.setDefaultResultOrder()`](/fr/nodejs/api/dns#dnssetdefaultresultorderorder) ou [`--dns-result-order`](/fr/nodejs/api/cli#--dns-result-orderorder). Le nouveau code doit utiliser `{ order: 'verbatim' }`.
    - `verbatim` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Lorsque `true`, la `Promise` est résolue avec les adresses IPv4 et IPv6 dans l’ordre dans lequel le résolveur DNS les a retournées. Lorsque `false`, les adresses IPv4 sont placées avant les adresses IPv6. Cette option sera obsolète en faveur de `order`. Lorsque les deux sont spécifiés, `order` a une priorité plus élevée. Le nouveau code ne doit utiliser que `order`. **Par défaut :** actuellement `false` (les adresses sont réorganisées), mais cela devrait changer dans un avenir pas trop lointain. La valeur par défaut est configurable à l’aide de [`dns.setDefaultResultOrder()`](/fr/nodejs/api/dns#dnssetdefaultresultorderorder) ou [`--dns-result-order`](/fr/nodejs/api/cli#--dns-result-orderorder).

Résout un nom d’hôte (par exemple, `'nodejs.org'`) dans le premier enregistrement A (IPv4) ou AAAA (IPv6) trouvé. Toutes les propriétés `option` sont facultatives. Si `options` est un entier, il doit être `4` ou `6` - si `options` n’est pas fourni, alors les adresses IPv4 ou IPv6, ou les deux, sont retournées si elles sont trouvées.

Avec l’option `all` définie sur `true`, la `Promise` est résolue avec `addresses` étant un tableau d’objets avec les propriétés `address` et `family`.

En cas d’erreur, la `Promise` est rejetée avec un objet [`Error`](/fr/nodejs/api/errors#class-error), où `err.code` est le code d’erreur. Gardez à l’esprit que `err.code` sera défini sur `'ENOTFOUND'` non seulement lorsque le nom d’hôte n’existe pas, mais aussi lorsque la recherche échoue d’autres manières, comme l’absence de descripteurs de fichiers disponibles.

[`dnsPromises.lookup()`](/fr/nodejs/api/dns#dnspromiseslookuphostname-options) n’a pas nécessairement quoi que ce soit à voir avec le protocole DNS. L’implémentation utilise une fonctionnalité du système d’exploitation qui peut associer des noms à des adresses et vice versa. Cette implémentation peut avoir des conséquences subtiles mais importantes sur le comportement de tout programme Node.js. Veuillez prendre le temps de consulter la [section Considérations relatives à l’implémentation](/fr/nodejs/api/dns#implementation-considerations) avant d’utiliser `dnsPromises.lookup()`.

Exemple d’utilisation :



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

**Ajoutée dans : v10.6.0**

- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Résout l'adresse et le port donnés en un nom d'hôte et un service en utilisant l'implémentation `getnameinfo` sous-jacente du système d'exploitation.

Si `address` n'est pas une adresse IP valide, une erreur `TypeError` sera émise. Le `port` sera forcé en un nombre. S'il ne s'agit pas d'un port légal, une `TypeError` sera émise.

En cas d'erreur, la `Promise` est rejetée avec un objet [`Error`](/fr/nodejs/api/errors#class-error), où `err.code` est le code d'erreur.

::: code-group
```js [ESM]
import dnsPromises from 'node:dns/promises';
const result = await dnsPromises.lookupService('127.0.0.1', 22);

console.log(result.hostname, result.service); // Affiche : localhost ssh
```

```js [CJS]
const dnsPromises = require('node:dns').promises;
dnsPromises.lookupService('127.0.0.1', 22).then((result) => {
  console.log(result.hostname, result.service);
  // Affiche : localhost ssh
});
```
:::

### `dnsPromises.resolve(hostname[, rrtype])` {#dnspromisesresolvehostname-rrtype}

**Ajoutée dans : v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nom d'hôte à résoudre.
- `rrtype` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Type d'enregistrement de ressource. **Par défaut :** `'A'`.

Utilise le protocole DNS pour résoudre un nom d'hôte (par exemple `'nodejs.org'`) en un tableau d'enregistrements de ressource. En cas de succès, la `Promise` est résolue avec un tableau d'enregistrements de ressource. Le type et la structure des résultats individuels varient en fonction de `rrtype` :

| `rrtype` | `records` contient | Type de résultat | Méthode raccourcie |
| --- | --- | --- | --- |
| `'A'` | Adresses IPv4 (par défaut) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dnsPromises.resolve4()`](/fr/nodejs/api/dns#dnspromisesresolve4hostname-options) |
| `'AAAA'` | Adresses IPv6 | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dnsPromises.resolve6()`](/fr/nodejs/api/dns#dnspromisesresolve6hostname-options) |
| `'ANY'` | tous les enregistrements | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dnsPromises.resolveAny()`](/fr/nodejs/api/dns#dnspromisesresolveanyhostname) |
| `'CAA'` | enregistrements d'autorisation CA | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dnsPromises.resolveCaa()`](/fr/nodejs/api/dns#dnspromisesresolvecaahostname) |
| `'CNAME'` | enregistrements de nom canonique | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dnsPromises.resolveCname()`](/fr/nodejs/api/dns#dnspromisesresolvecnamehostname) |
| `'MX'` | enregistrements d'échange de courrier | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dnsPromises.resolveMx()`](/fr/nodejs/api/dns#dnspromisesresolvemxhostname) |
| `'NAPTR'` | enregistrements de pointeur d'autorité de nom | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dnsPromises.resolveNaptr()`](/fr/nodejs/api/dns#dnspromisesresolvenaptrhostname) |
| `'NS'` | enregistrements de serveur de noms | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dnsPromises.resolveNs()`](/fr/nodejs/api/dns#dnspromisesresolvenshostname) |
| `'PTR'` | enregistrements de pointeur | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dnsPromises.resolvePtr()`](/fr/nodejs/api/dns#dnspromisesresolveptrhostname) |
| `'SOA'` | enregistrements de début d'autorité | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dnsPromises.resolveSoa()`](/fr/nodejs/api/dns#dnspromisesresolvesoahostname) |
| `'SRV'` | enregistrements de service | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dnsPromises.resolveSrv()`](/fr/nodejs/api/dns#dnspromisesresolvesrvhostname) |
| `'TXT'` | enregistrements texte | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dnsPromises.resolveTxt()`](/fr/nodejs/api/dns#dnspromisesresolvetxthostname) |

En cas d'erreur, la `Promise` est rejetée avec un objet [`Error`](/fr/nodejs/api/errors#class-error), où `err.code` est l'un des [codes d'erreur DNS](/fr/nodejs/api/dns#error-codes).


### `dnsPromises.resolve4(hostname[, options])` {#dnspromisesresolve4hostname-options}

**Ajouté dans : v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nom d'hôte à résoudre.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ttl` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Récupérer la valeur de la durée de vie (TTL) de chaque enregistrement. Lorsque `true`, la `Promise` est résolue avec un tableau d'objets `{ address: '1.2.3.4', ttl: 60 }` plutôt qu'un tableau de chaînes, avec le TTL exprimé en secondes.

Utilise le protocole DNS pour résoudre les adresses IPv4 (enregistrements `A`) pour le `hostname`. En cas de succès, la `Promise` est résolue avec un tableau d'adresses IPv4 (par exemple `['74.125.79.104', '74.125.79.105', '74.125.79.106']`).

### `dnsPromises.resolve6(hostname[, options])` {#dnspromisesresolve6hostname-options}

**Ajouté dans : v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nom d'hôte à résoudre.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ttl` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Récupérer la valeur de la durée de vie (TTL) de chaque enregistrement. Lorsque `true`, la `Promise` est résolue avec un tableau d'objets `{ address: '0:1:2:3:4:5:6:7', ttl: 60 }` plutôt qu'un tableau de chaînes, avec le TTL exprimé en secondes.

Utilise le protocole DNS pour résoudre les adresses IPv6 (enregistrements `AAAA`) pour le `hostname`. En cas de succès, la `Promise` est résolue avec un tableau d'adresses IPv6.

### `dnsPromises.resolveAny(hostname)` {#dnspromisesresolveanyhostname}

**Ajouté dans : v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Utilise le protocole DNS pour résoudre tous les enregistrements (également appelés requête `ANY` ou `*`). En cas de succès, la `Promise` est résolue avec un tableau contenant différents types d'enregistrements. Chaque objet a une propriété `type` qui indique le type de l'enregistrement actuel. Et selon le `type`, des propriétés supplémentaires seront présentes sur l'objet :

| Type | Propriétés |
| --- | --- |
| `'A'` | `address`  /  `ttl` |
| `'AAAA'` | `address`  /  `ttl` |
| `'CNAME'` | `value` |
| `'MX'` | Voir [`dnsPromises.resolveMx()`](/fr/nodejs/api/dns#dnspromisesresolvemxhostname) |
| `'NAPTR'` | Voir [`dnsPromises.resolveNaptr()`](/fr/nodejs/api/dns#dnspromisesresolvenaptrhostname) |
| `'NS'` | `value` |
| `'PTR'` | `value` |
| `'SOA'` | Voir [`dnsPromises.resolveSoa()`](/fr/nodejs/api/dns#dnspromisesresolvesoahostname) |
| `'SRV'` | Voir [`dnsPromises.resolveSrv()`](/fr/nodejs/api/dns#dnspromisesresolvesrvhostname) |
| `'TXT'` | Ce type d'enregistrement contient une propriété de tableau appelée `entries` qui fait référence à [`dnsPromises.resolveTxt()`](/fr/nodejs/api/dns#dnspromisesresolvetxthostname), par exemple `{ entries: ['...'], type: 'TXT' }` |
Voici un exemple de l'objet de résultat :

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

**Ajouté dans : v15.0.0, v14.17.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Utilise le protocole DNS pour résoudre les enregistrements `CAA` pour le `hostname`. En cas de succès, la `Promise` est résolue avec un tableau d'objets contenant les enregistrements d'autorisation d'autorité de certification disponibles pour le `hostname` (par exemple `[{critical: 0, iodef: 'mailto:pki@example.com'},{critical: 128, issue: 'pki.example.com'}]`).

### `dnsPromises.resolveCname(hostname)` {#dnspromisesresolvecnamehostname}

**Ajouté dans : v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Utilise le protocole DNS pour résoudre les enregistrements `CNAME` pour le `hostname`. En cas de succès, la `Promise` est résolue avec un tableau d'enregistrements de noms canoniques disponibles pour le `hostname` (par exemple `['bar.example.com']`).

### `dnsPromises.resolveMx(hostname)` {#dnspromisesresolvemxhostname}

**Ajouté dans : v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Utilise le protocole DNS pour résoudre les enregistrements d'échange de courrier (`MX` records) pour le `hostname`. En cas de succès, la `Promise` est résolue avec un tableau d'objets contenant à la fois une propriété `priority` et `exchange` (par exemple `[{priority: 10, exchange: 'mx.example.com'}, ...]`).

### `dnsPromises.resolveNaptr(hostname)` {#dnspromisesresolvenaptrhostname}

**Ajouté dans : v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Utilise le protocole DNS pour résoudre les enregistrements basés sur des expressions régulières (enregistrements `NAPTR`) pour le `hostname`. En cas de succès, la `Promise` est résolue avec un tableau d'objets ayant les propriétés suivantes :

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

**Ajouté dans : v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Utilise le protocole DNS pour résoudre les enregistrements de serveur de noms (enregistrements `NS`) pour le `hostname`. En cas de succès, la `Promise` est résolue avec un tableau d'enregistrements de serveur de noms disponibles pour `hostname` (par exemple `['ns1.example.com', 'ns2.example.com']`).


### `dnsPromises.resolvePtr(hostname)` {#dnspromisesresolveptrhostname}

**Ajouté dans : v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Utilise le protocole DNS pour résoudre les enregistrements de pointeur (enregistrements `PTR`) pour le `hostname`. En cas de succès, la `Promise` est résolue avec un tableau de chaînes contenant les enregistrements de réponse.

### `dnsPromises.resolveSoa(hostname)` {#dnspromisesresolvesoahostname}

**Ajouté dans : v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Utilise le protocole DNS pour résoudre un enregistrement de début d’autorité (enregistrement `SOA`) pour le `hostname`. En cas de succès, la `Promise` est résolue avec un objet ayant les propriétés suivantes :

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

**Ajouté dans : v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Utilise le protocole DNS pour résoudre les enregistrements de service (enregistrements `SRV`) pour le `hostname`. En cas de succès, la `Promise` est résolue avec un tableau d’objets ayant les propriétés suivantes :

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

**Ajouté dans : v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Utilise le protocole DNS pour résoudre les requêtes de texte (enregistrements `TXT`) pour le `hostname`. En cas de succès, la `Promise` est résolue avec un tableau bidimensionnel des enregistrements de texte disponibles pour `hostname` (par exemple `[ [ 'v=spf1 ip4:0.0.0.0 ', '~all' ] ]`). Chaque sous-tableau contient des blocs TXT d’un enregistrement. Selon le cas d’utilisation, ceux-ci peuvent être soit regroupés, soit traités séparément.


### `dnsPromises.reverse(ip)` {#dnspromisesreverseip}

**Ajouté dans: v10.6.0**

- `ip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Effectue une requête DNS inverse qui résout une adresse IPv4 ou IPv6 en un tableau de noms d'hôte.

En cas d'erreur, la `Promise` est rejetée avec un objet [`Error`](/fr/nodejs/api/errors#class-error), où `err.code` est l'un des [codes d'erreur DNS](/fr/nodejs/api/dns#error-codes).

### `dnsPromises.setDefaultResultOrder(order)` {#dnspromisessetdefaultresultorderorder}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v22.1.0, v20.13.0 | La valeur `ipv6first` est maintenant prise en charge. |
| v17.0.0 | La valeur par défaut est passée à `verbatim`. |
| v16.4.0, v14.18.0 | Ajouté dans : v16.4.0, v14.18.0 |
:::

- `order` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) doit être `'ipv4first'`, `'ipv6first'` ou `'verbatim'`.

Définit la valeur par défaut de `order` dans [`dns.lookup()`](/fr/nodejs/api/dns#dnslookuphostname-options-callback) et [`dnsPromises.lookup()`](/fr/nodejs/api/dns#dnspromiseslookuphostname-options). La valeur peut être :

- `ipv4first` : définit la valeur par défaut de `order` sur `ipv4first`.
- `ipv6first` : définit la valeur par défaut de `order` sur `ipv6first`.
- `verbatim` : définit la valeur par défaut de `order` sur `verbatim`.

La valeur par défaut est `verbatim` et [`dnsPromises.setDefaultResultOrder()`](/fr/nodejs/api/dns#dnspromisessetdefaultresultorderorder) a une priorité plus élevée que [`--dns-result-order`](/fr/nodejs/api/cli#--dns-result-orderorder). Lors de l'utilisation de [threads worker](/fr/nodejs/api/worker_threads), [`dnsPromises.setDefaultResultOrder()`](/fr/nodejs/api/dns#dnspromisessetdefaultresultorderorder) du thread principal n'affectera pas les ordres DNS par défaut dans les workers.

### `dnsPromises.getDefaultResultOrder()` {#dnspromisesgetdefaultresultorder}

**Ajouté dans : v20.1.0, v18.17.0**

Obtenir la valeur de `dnsOrder`.

### `dnsPromises.setServers(servers)` {#dnspromisessetserversservers}

**Ajouté dans: v10.6.0**

- `servers` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) tableau d'adresses formatées [RFC 5952](https://tools.ietf.org/html/rfc5952#section-6)

Définit l'adresse IP et le port des serveurs à utiliser lors de l'exécution de la résolution DNS. L'argument `servers` est un tableau d'adresses formatées [RFC 5952](https://tools.ietf.org/html/rfc5952#section-6). Si le port est le port DNS par défaut de l'IANA (53), il peut être omis.

```js [ESM]
dnsPromises.setServers([
  '8.8.8.8',
  '[2001:4860:4860::8888]',
  '8.8.8.8:1053',
  '[2001:4860:4860::8888]:1053',
]);
```
Une erreur sera levée si une adresse invalide est fournie.

La méthode `dnsPromises.setServers()` ne doit pas être appelée pendant qu'une requête DNS est en cours.

Cette méthode fonctionne un peu comme [resolve.conf](https://man7.org/linux/man-pages/man5/resolv.conf.5). C'est-à-dire que si la tentative de résolution avec le premier serveur fourni entraîne une erreur `NOTFOUND`, la méthode `resolve()` ne tentera *pas* de résoudre avec les serveurs suivants fournis. Les serveurs DNS de secours ne seront utilisés que si les serveurs précédents expirent ou entraînent une autre erreur.


## Codes d'erreur {#error-codes}

Chaque requête DNS peut renvoyer l'un des codes d'erreur suivants :

- `dns.NODATA`: Le serveur DNS a renvoyé une réponse sans données.
- `dns.FORMERR`: Le serveur DNS indique que la requête est mal formatée.
- `dns.SERVFAIL`: Le serveur DNS a renvoyé une erreur générale.
- `dns.NOTFOUND`: Nom de domaine introuvable.
- `dns.NOTIMP`: Le serveur DNS n'implémente pas l'opération demandée.
- `dns.REFUSED`: Le serveur DNS a refusé la requête.
- `dns.BADQUERY`: Requête DNS mal formatée.
- `dns.BADNAME`: Nom d'hôte mal formaté.
- `dns.BADFAMILY`: Famille d'adresses non prise en charge.
- `dns.BADRESP`: Réponse DNS mal formatée.
- `dns.CONNREFUSED`: Impossible de contacter les serveurs DNS.
- `dns.TIMEOUT`: Délai d'attente lors de la communication avec les serveurs DNS.
- `dns.EOF`: Fin de fichier.
- `dns.FILE`: Erreur de lecture du fichier.
- `dns.NOMEM`: Mémoire insuffisante.
- `dns.DESTRUCTION`: Canal en cours de destruction.
- `dns.BADSTR`: Chaîne mal formatée.
- `dns.BADFLAGS`: Indicateurs illégaux spécifiés.
- `dns.NONAME`: Le nom d'hôte donné n'est pas numérique.
- `dns.BADHINTS`: Indicateurs d'hints illégaux spécifiés.
- `dns.NOTINITIALIZED`: L'initialisation de la bibliothèque c-ares n'a pas encore été effectuée.
- `dns.LOADIPHLPAPI`: Erreur lors du chargement de `iphlpapi.dll`.
- `dns.ADDRGETNETWORKPARAMS`: Impossible de trouver la fonction `GetNetworkParams`.
- `dns.CANCELLED`: Requête DNS annulée.

L'API `dnsPromises` exporte également les codes d'erreur ci-dessus, par exemple `dnsPromises.NODATA`.

## Considérations relatives à l'implémentation {#implementation-considerations}

Bien que [`dns.lookup()`](/fr/nodejs/api/dns#dnslookuphostname-options-callback) et les différentes fonctions `dns.resolve*()/dns.reverse()` aient le même objectif d'associer un nom de réseau à une adresse réseau (ou inversement), leur comportement est très différent. Ces différences peuvent avoir des conséquences subtiles mais importantes sur le comportement des programmes Node.js.

### `dns.lookup()` {#dnslookup}

En coulisses, [`dns.lookup()`](/fr/nodejs/api/dns#dnslookuphostname-options-callback) utilise les mêmes ressources du système d'exploitation que la plupart des autres programmes. Par exemple, [`dns.lookup()`](/fr/nodejs/api/dns#dnslookuphostname-options-callback) résoudra presque toujours un nom donné de la même manière que la commande `ping`. Sur la plupart des systèmes d'exploitation de type POSIX, le comportement de la fonction [`dns.lookup()`](/fr/nodejs/api/dns#dnslookuphostname-options-callback) peut être modifié en modifiant les paramètres dans [`nsswitch.conf(5)`](http://man7.org/linux/man-pages/man5/nsswitch.conf.5) et/ou [`resolv.conf(5)`](http://man7.org/linux/man-pages/man5/resolv.conf.5), mais la modification de ces fichiers modifiera le comportement de tous les autres programmes exécutés sur le même système d'exploitation.

Bien que l'appel à `dns.lookup()` soit asynchrone du point de vue de JavaScript, il est implémenté comme un appel synchrone à [`getaddrinfo(3)`](http://man7.org/linux/man-pages/man3/getaddrinfo.3) qui s'exécute sur le pool de threads de libuv. Cela peut avoir des implications négatives surprenantes en termes de performances pour certaines applications, consultez la documentation [`UV_THREADPOOL_SIZE`](/fr/nodejs/api/cli#uv_threadpool_sizesize) pour plus d'informations.

Diverses API réseau appelleront `dns.lookup()` en interne pour résoudre les noms d'hôtes. Si cela pose problème, envisagez de résoudre le nom d'hôte en une adresse à l'aide de `dns.resolve()` et d'utiliser l'adresse au lieu d'un nom d'hôte. De plus, certaines API réseau (telles que [`socket.connect()`](/fr/nodejs/api/net#socketconnectoptions-connectlistener) et [`dgram.createSocket()`](/fr/nodejs/api/dgram#dgramcreatesocketoptions-callback)) permettent de remplacer le résolveur par défaut, `dns.lookup()`.


### `dns.resolve()`, `dns.resolve*()`, et `dns.reverse()` {#dnsresolve-dnsresolve*-and-dnsreverse}

Ces fonctions sont implémentées de manière assez différente de [`dns.lookup()`](/fr/nodejs/api/dns#dnslookuphostname-options-callback). Elles n'utilisent pas [`getaddrinfo(3)`](http://man7.org/linux/man-pages/man3/getaddrinfo.3) et elles effectuent *toujours* une requête DNS sur le réseau. Cette communication réseau est toujours effectuée de manière asynchrone et n'utilise pas le pool de threads de libuv.

Par conséquent, ces fonctions ne peuvent pas avoir le même impact négatif sur les autres traitements qui se déroulent sur le pool de threads de libuv que [`dns.lookup()`](/fr/nodejs/api/dns#dnslookuphostname-options-callback) peut avoir.

Elles n'utilisent pas le même ensemble de fichiers de configuration que [`dns.lookup()`](/fr/nodejs/api/dns#dnslookuphostname-options-callback). Par exemple, elles n'utilisent pas la configuration de `/etc/hosts`.

