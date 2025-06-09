---
title: Documentación de Node.js - DNS
description: Esta sección de la documentación de Node.js cubre el módulo DNS (Sistema de Nombres de Dominio), que proporciona funcionalidades de resolución de nombres de red asincrónica. Incluye métodos para resolver nombres de dominio a direcciones IP, búsquedas inversas y consultas de registros DNS.
head:
  - - meta
    - name: og:title
      content: Documentación de Node.js - DNS | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Esta sección de la documentación de Node.js cubre el módulo DNS (Sistema de Nombres de Dominio), que proporciona funcionalidades de resolución de nombres de red asincrónica. Incluye métodos para resolver nombres de dominio a direcciones IP, búsquedas inversas y consultas de registros DNS.
  - - meta
    - name: twitter:title
      content: Documentación de Node.js - DNS | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Esta sección de la documentación de Node.js cubre el módulo DNS (Sistema de Nombres de Dominio), que proporciona funcionalidades de resolución de nombres de red asincrónica. Incluye métodos para resolver nombres de dominio a direcciones IP, búsquedas inversas y consultas de registros DNS.
---


# DNS {#dns}

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable
:::

**Código fuente:** [lib/dns.js](https://github.com/nodejs/node/blob/v23.5.0/lib/dns.js)

El módulo `node:dns` habilita la resolución de nombres. Por ejemplo, úselo para buscar las direcciones IP de los nombres de host.

Aunque lleva el nombre del [Sistema de nombres de dominio (DNS)](https://en.wikipedia.org/wiki/Domain_Name_System), no siempre utiliza el protocolo DNS para las búsquedas. [`dns.lookup()`](/es/nodejs/api/dns#dnslookuphostname-options-callback) utiliza las facilidades del sistema operativo para realizar la resolución de nombres. Es posible que no necesite realizar ninguna comunicación de red. Para realizar la resolución de nombres de la misma forma que otras aplicaciones en el mismo sistema, utilice [`dns.lookup()`](/es/nodejs/api/dns#dnslookuphostname-options-callback).

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

Todas las demás funciones en el módulo `node:dns` se conectan a un servidor DNS real para realizar la resolución de nombres. Siempre usarán la red para realizar consultas DNS. Estas funciones no utilizan el mismo conjunto de archivos de configuración que utiliza [`dns.lookup()`](/es/nodejs/api/dns#dnslookuphostname-options-callback) (p. ej. `/etc/hosts`). Utilice estas funciones para realizar siempre consultas DNS, evitando otras facilidades de resolución de nombres.

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

Consulte la [sección Consideraciones de implementación](/es/nodejs/api/dns#implementation-considerations) para obtener más información.


## Clase: `dns.Resolver` {#class-dnsresolver}

**Agregado en: v8.3.0**

Un resolvedor independiente para solicitudes DNS.

La creación de un nuevo resolvedor utiliza la configuración predeterminada del servidor. La configuración de los servidores utilizados para un resolvedor mediante [`resolver.setServers()`](/es/nodejs/api/dns#dnssetserversservers) no afecta a otros resolvedores:

::: code-group
```js [ESM]
import { Resolver } from 'node:dns';
const resolver = new Resolver();
resolver.setServers(['4.4.4.4']);

// Esta solicitud utilizará el servidor en 4.4.4.4, independientemente de la configuración global.
resolver.resolve4('example.org', (err, addresses) => {
  // ...
});
```

```js [CJS]
const { Resolver } = require('node:dns');
const resolver = new Resolver();
resolver.setServers(['4.4.4.4']);

// Esta solicitud utilizará el servidor en 4.4.4.4, independientemente de la configuración global.
resolver.resolve4('example.org', (err, addresses) => {
  // ...
});
```
:::

Los siguientes métodos del módulo `node:dns` están disponibles:

- [`resolver.getServers()`](/es/nodejs/api/dns#dnsgetservers)
- [`resolver.resolve()`](/es/nodejs/api/dns#dnsresolvehostname-rrtype-callback)
- [`resolver.resolve4()`](/es/nodejs/api/dns#dnsresolve4hostname-options-callback)
- [`resolver.resolve6()`](/es/nodejs/api/dns#dnsresolve6hostname-options-callback)
- [`resolver.resolveAny()`](/es/nodejs/api/dns#dnsresolveanyhostname-callback)
- [`resolver.resolveCaa()`](/es/nodejs/api/dns#dnsresolvecaahostname-callback)
- [`resolver.resolveCname()`](/es/nodejs/api/dns#dnsresolvecnamehostname-callback)
- [`resolver.resolveMx()`](/es/nodejs/api/dns#dnsresolvemxhostname-callback)
- [`resolver.resolveNaptr()`](/es/nodejs/api/dns#dnsresolvenaptrhostname-callback)
- [`resolver.resolveNs()`](/es/nodejs/api/dns#dnsresolvenshostname-callback)
- [`resolver.resolvePtr()`](/es/nodejs/api/dns#dnsresolveptrhostname-callback)
- [`resolver.resolveSoa()`](/es/nodejs/api/dns#dnsresolvesoahostname-callback)
- [`resolver.resolveSrv()`](/es/nodejs/api/dns#dnsresolvesrvhostname-callback)
- [`resolver.resolveTxt()`](/es/nodejs/api/dns#dnsresolvetxthostname-callback)
- [`resolver.reverse()`](/es/nodejs/api/dns#dnsreverseip-callback)
- [`resolver.setServers()`](/es/nodejs/api/dns#dnssetserversservers)

### `Resolver([options])` {#resolveroptions}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v16.7.0, v14.18.0 | El objeto `options` ahora acepta una opción `tries`. |
| v12.18.3 | El constructor ahora acepta un objeto `options`. La única opción admitida es `timeout`. |
| v8.3.0 | Agregado en: v8.3.0 |
:::

Crea un nuevo resolvedor.

- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `timeout` [\<entero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Tiempo de espera de la consulta en milisegundos, o `-1` para usar el tiempo de espera predeterminado.
    - `tries` [\<entero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de intentos que el resolvedor intentará contactar con cada servidor de nombres antes de rendirse. **Predeterminado:** `4`


### `resolver.cancel()` {#resolvercancel}

**Agregado en: v8.3.0**

Cancela todas las consultas DNS pendientes realizadas por este resolvedor. Las devoluciones de llamada correspondientes se llamarán con un error con el código `ECANCELLED`.

### `resolver.setLocalAddress([ipv4][, ipv6])` {#resolversetlocaladdressipv4-ipv6}

**Agregado en: v15.1.0, v14.17.0**

- `ipv4` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Una representación de cadena de una dirección IPv4. **Predeterminado:** `'0.0.0.0'`
- `ipv6` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Una representación de cadena de una dirección IPv6. **Predeterminado:** `'::0'`

La instancia del resolvedor enviará sus solicitudes desde la dirección IP especificada. Esto permite que los programas especifiquen interfaces de salida cuando se utilizan en sistemas multi-homed.

Si no se especifica una dirección v4 o v6, se establece en el valor predeterminado y el sistema operativo elegirá una dirección local automáticamente.

El resolvedor utilizará la dirección local v4 al realizar solicitudes a los servidores DNS IPv4 y la dirección local v6 al realizar solicitudes a los servidores DNS IPv6. El `rrtype` de las solicitudes de resolución no tiene ningún impacto en la dirección local utilizada.

## `dns.getServers()` {#dnsgetservers}

**Agregado en: v0.11.3**

- Devuelve: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Devuelve una matriz de cadenas de direcciones IP, formateadas de acuerdo con [RFC 5952](https://tools.ietf.org/html/rfc5952#section-6), que están configuradas actualmente para la resolución DNS. Una cadena incluirá una sección de puerto si se utiliza un puerto personalizado.

```js [ESM]
[
  '8.8.8.8',
  '2001:4860:4860::8888',
  '8.8.8.8:1053',
  '[2001:4860:4860::8888]:1053',
]
```
## `dns.lookup(hostname[, options], callback)` {#dnslookuphostname-options-callback}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v22.1.0, v20.13.0 | La opción `verbatim` ahora está obsoleta en favor de la nueva opción `order`. |
| v18.4.0 | Para la compatibilidad con `node:net`, al pasar un objeto de opciones, la opción `family` puede ser la cadena `'IPv4'` o la cadena `'IPv6'`. |
| v18.0.0 | Pasar una devolución de llamada no válida al argumento `callback` ahora arroja `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v17.0.0 | Las opciones `verbatim` ahora tienen el valor predeterminado `true`. |
| v8.5.0 | Ahora se admite la opción `verbatim`. |
| v1.2.0 | Ahora se admite la opción `all`. |
| v0.1.90 | Agregado en: v0.1.90 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `family` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La familia de registros. Debe ser `4`, `6` o `0`. Por razones de compatibilidad con versiones anteriores, `'IPv4'` y `'IPv6'` se interpretan como `4` y `6` respectivamente. El valor `0` indica que se devuelve una dirección IPv4 o IPv6. Si el valor `0` se utiliza con `{ all: true }` (ver abajo), se devuelve una o ambas direcciones IPv4 e IPv6, dependiendo del resolvedor DNS del sistema. **Predeterminado:** `0`.
    - `hints` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Una o más [flags `getaddrinfo` compatibles](/es/nodejs/api/dns#supported-getaddrinfo-flags). Se pueden pasar múltiples flags mediante la operación `OR` bit a bit de sus valores.
    - `all` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Cuando es `true`, la devolución de llamada devuelve todas las direcciones resueltas en una matriz. De lo contrario, devuelve una sola dirección. **Predeterminado:** `false`.
    - `order` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Cuando es `verbatim`, las direcciones resueltas se devuelven sin ordenar. Cuando es `ipv4first`, las direcciones resueltas se ordenan colocando las direcciones IPv4 antes de las direcciones IPv6. Cuando es `ipv6first`, las direcciones resueltas se ordenan colocando las direcciones IPv6 antes de las direcciones IPv4. **Predeterminado:** `verbatim` (las direcciones no se reordenan). El valor predeterminado se puede configurar utilizando [`dns.setDefaultResultOrder()`](/es/nodejs/api/dns#dnssetdefaultresultorderorder) o [`--dns-result-order`](/es/nodejs/api/cli#--dns-result-orderorder).
    - `verbatim` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Cuando es `true`, la devolución de llamada recibe direcciones IPv4 e IPv6 en el orden en que las devolvió el resolvedor DNS. Cuando es `false`, las direcciones IPv4 se colocan antes de las direcciones IPv6. Esta opción quedará obsoleta en favor de `order`. Cuando se especifican ambos, `order` tiene mayor prioridad. El nuevo código solo debe usar `order`. **Predeterminado:** `true` (las direcciones no se reordenan). El valor predeterminado se puede configurar utilizando [`dns.setDefaultResultOrder()`](/es/nodejs/api/dns#dnssetdefaultresultorderorder) o [`--dns-result-order`](/es/nodejs/api/cli#--dns-result-orderorder).
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Una representación de cadena de una dirección IPv4 o IPv6.
    - `family` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `4` o `6`, que denota la familia de `address`, o `0` si la dirección no es una dirección IPv4 o IPv6. `0` es un indicador probable de un error en el servicio de resolución de nombres utilizado por el sistema operativo.
  
 

Resuelve un nombre de host (por ejemplo, `'nodejs.org'`) en el primer registro A (IPv4) o AAAA (IPv6) encontrado. Todas las propiedades de `option` son opcionales. Si `options` es un entero, entonces debe ser `4` o `6` – si no se proporciona `options`, entonces se devuelven direcciones IPv4 o IPv6, o ambas, si se encuentran.

Con la opción `all` establecida en `true`, los argumentos para `callback` cambian a `(err, addresses)`, con `addresses` siendo una matriz de objetos con las propiedades `address` y `family`.

En caso de error, `err` es un objeto [`Error`](/es/nodejs/api/errors#class-error), donde `err.code` es el código de error. Tenga en cuenta que `err.code` se establecerá en `'ENOTFOUND'` no solo cuando el nombre de host no exista, sino también cuando la búsqueda falle de otras maneras, como por ejemplo, no haya descriptores de archivo disponibles.

`dns.lookup()` no tiene necesariamente nada que ver con el protocolo DNS. La implementación utiliza una facilidad del sistema operativo que puede asociar nombres con direcciones y viceversa. Esta implementación puede tener consecuencias sutiles pero importantes en el comportamiento de cualquier programa Node.js. Tómese un tiempo para consultar la [sección Consideraciones de implementación](/es/nodejs/api/dns#implementation-considerations) antes de utilizar `dns.lookup()`.

Ejemplo de uso:



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

Si este método se invoca como su versión [`util.promisify()`](/es/nodejs/api/util#utilpromisifyoriginal)ed, y `all` no está establecido en `true`, devuelve una `Promise` para un `Object` con propiedades `address` y `family`.


### Flags `getaddrinfo` admitidos {#supported-getaddrinfo-flags}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v13.13.0, v12.17.0 | Se añadió soporte para el flag `dns.ALL`. |
:::

Los siguientes flags pueden pasarse como sugerencias a [`dns.lookup()`](/es/nodejs/api/dns#dnslookuphostname-options-callback).

- `dns.ADDRCONFIG`: Limita los tipos de dirección devueltos a los tipos de direcciones no loopback configurados en el sistema. Por ejemplo, las direcciones IPv4 solo se devuelven si el sistema actual tiene al menos una dirección IPv4 configurada.
- `dns.V4MAPPED`: Si se especificó la familia IPv6, pero no se encontraron direcciones IPv6, devuelve las direcciones IPv6 mapeadas a IPv4. No es compatible con algunos sistemas operativos (p. ej., FreeBSD 10.1).
- `dns.ALL`: Si se especifica `dns.V4MAPPED`, devuelve las direcciones IPv6 resueltas, así como las direcciones IPv6 mapeadas a IPv4.

## `dns.lookupService(address, port, callback)` {#dnslookupserviceaddress-port-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una función callback inválida al argumento `callback` ahora lanza `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v0.11.14 | Añadido en: v0.11.14 |
:::

- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) p. ej. `example.com`
    - `service` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) p. ej. `http`

Resuelve la `address` y el `port` dados en un nombre de host y un servicio utilizando la implementación `getnameinfo` subyacente del sistema operativo.

Si `address` no es una dirección IP válida, se lanzará un `TypeError`. El `port` se convertirá en un número. Si no es un puerto legal, se lanzará un `TypeError`.

En caso de error, `err` es un objeto [`Error`](/es/nodejs/api/errors#class-error), donde `err.code` es el código de error.

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

Si este método se invoca como su versión [`util.promisify()`](/es/nodejs/api/util#utilpromisifyoriginal)ed, devuelve una `Promise` para un `Object` con propiedades `hostname` y `service`.


## `dns.resolve(hostname[, rrtype], callback)` {#dnsresolvehostname-rrtype-callback}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una devolución de llamada inválida al argumento `callback` ahora lanza `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v0.1.27 | Añadido en: v0.1.27 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nombre de host a resolver.
- `rrtype` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Tipo de registro de recursos. **Predeterminado:** `'A'`.
- `callback` [\<Función\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `records` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Utiliza el protocolo DNS para resolver un nombre de host (por ejemplo, `'nodejs.org'`) en una matriz de registros de recursos. La función `callback` tiene argumentos `(err, records)`. Si tiene éxito, `records` será una matriz de registros de recursos. El tipo y la estructura de los resultados individuales varían según el `rrtype`:

| `rrtype` | `records` contiene | Tipo de resultado | Método abreviado |
| --- | --- | --- | --- |
| `'A'` | Direcciones IPv4 (predeterminado) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dns.resolve4()`](/es/nodejs/api/dns#dnsresolve4hostname-options-callback) |
| `'AAAA'` | Direcciones IPv6 | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dns.resolve6()`](/es/nodejs/api/dns#dnsresolve6hostname-options-callback) |
| `'ANY'` | cualquier registro | [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dns.resolveAny()`](/es/nodejs/api/dns#dnsresolveanyhostname-callback) |
| `'CAA'` | registros de autorización de CA | [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dns.resolveCaa()`](/es/nodejs/api/dns#dnsresolvecaahostname-callback) |
| `'CNAME'` | registros de nombres canónicos | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dns.resolveCname()`](/es/nodejs/api/dns#dnsresolvecnamehostname-callback) |
| `'MX'` | registros de intercambio de correo | [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dns.resolveMx()`](/es/nodejs/api/dns#dnsresolvemxhostname-callback) |
| `'NAPTR'` | registros de puntero de autoridad de nombre | [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dns.resolveNaptr()`](/es/nodejs/api/dns#dnsresolvenaptrhostname-callback) |
| `'NS'` | registros de servidor de nombres | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dns.resolveNs()`](/es/nodejs/api/dns#dnsresolvenshostname-callback) |
| `'PTR'` | registros de puntero | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dns.resolvePtr()`](/es/nodejs/api/dns#dnsresolveptrhostname-callback) |
| `'SOA'` | registros de inicio de autoridad | [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dns.resolveSoa()`](/es/nodejs/api/dns#dnsresolvesoahostname-callback) |
| `'SRV'` | registros de servicio | [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dns.resolveSrv()`](/es/nodejs/api/dns#dnsresolvesrvhostname-callback) |
| `'TXT'` | registros de texto | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dns.resolveTxt()`](/es/nodejs/api/dns#dnsresolvetxthostname-callback) |

En caso de error, `err` es un objeto [`Error`](/es/nodejs/api/errors#class-error), donde `err.code` es uno de los [códigos de error de DNS](/es/nodejs/api/dns#error-codes).


## `dns.resolve4(hostname[, options], callback)` {#dnsresolve4hostname-options-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una función de retrollamada inválida al argumento `callback` ahora lanza `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v7.2.0 | Este método ahora soporta pasar `options`, específicamente `options.ttl`. |
| v0.1.16 | Añadido en: v0.1.16 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nombre de host para resolver.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `ttl` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Recupera el valor de Time-To-Live (TTL) de cada registro. Cuando es `true`, la retrollamada recibe un array de objetos `{ address: '1.2.3.4', ttl: 60 }` en lugar de un array de strings, con el TTL expresado en segundos.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  
 

Utiliza el protocolo DNS para resolver las direcciones IPv4 (registros `A`) para el `hostname`. El argumento `addresses` pasado a la función `callback` contendrá un array de direcciones IPv4 (ej. `['74.125.79.104', '74.125.79.105', '74.125.79.106']`).

## `dns.resolve6(hostname[, options], callback)` {#dnsresolve6hostname-options-callback}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una función de retrollamada inválida al argumento `callback` ahora lanza `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v7.2.0 | Este método ahora soporta pasar `options`, específicamente `options.ttl`. |
| v0.1.16 | Añadido en: v0.1.16 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nombre de host para resolver.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `ttl` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Recupera el valor de Time-To-Live (TTL) de cada registro. Cuando es `true`, la retrollamada recibe un array de objetos `{ address: '0:1:2:3:4:5:6:7', ttl: 60 }` en lugar de un array de strings, con el TTL expresado en segundos.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  
 

Utiliza el protocolo DNS para resolver las direcciones IPv6 (registros `AAAA`) para el `hostname`. El argumento `addresses` pasado a la función `callback` contendrá un array de direcciones IPv6.


## `dns.resolveAny(hostname, callback)` {#dnsresolveanyhostname-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una callback inválida al argumento `callback` ahora lanza `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `ret` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Utiliza el protocolo DNS para resolver todos los registros (también conocido como consulta `ANY` o `*`). El argumento `ret` pasado a la función `callback` será un array que contendrá varios tipos de registros. Cada objeto tiene una propiedad `type` que indica el tipo del registro actual. Y dependiendo del `type`, propiedades adicionales estarán presentes en el objeto:

| Tipo | Propiedades |
| --- | --- |
| `'A'` | `address`  /  `ttl` |
| `'AAAA'` | `address`  /  `ttl` |
| `'CNAME'` | `value` |
| `'MX'` | Consulte   [`dns.resolveMx()`](/es/nodejs/api/dns#dnsresolvemxhostname-callback) |
| `'NAPTR'` | Consulte   [`dns.resolveNaptr()`](/es/nodejs/api/dns#dnsresolvenaptrhostname-callback) |
| `'NS'` | `value` |
| `'PTR'` | `value` |
| `'SOA'` | Consulte   [`dns.resolveSoa()`](/es/nodejs/api/dns#dnsresolvesoahostname-callback) |
| `'SRV'` | Consulte   [`dns.resolveSrv()`](/es/nodejs/api/dns#dnsresolvesrvhostname-callback) |
| `'TXT'` | Este tipo de registro contiene una propiedad de array llamada `entries` que se refiere a [`dns.resolveTxt()`](/es/nodejs/api/dns#dnsresolvetxthostname-callback), por ejemplo, `{ entries: ['...'], type: 'TXT' }` |
Aquí hay un ejemplo del objeto `ret` pasado a la callback:

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
Los operadores de servidores DNS pueden optar por no responder a consultas `ANY`. Puede ser mejor llamar a métodos individuales como [`dns.resolve4()`](/es/nodejs/api/dns#dnsresolve4hostname-options-callback), [`dns.resolveMx()`](/es/nodejs/api/dns#dnsresolvemxhostname-callback), y así sucesivamente. Para obtener más detalles, consulte [RFC 8482](https://tools.ietf.org/html/rfc8482).


## `dns.resolveCname(hostname, callback)` {#dnsresolvecnamehostname-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una función callback inválida al argumento `callback` ahora lanza `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v0.3.2 | Añadido en: v0.3.2 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
  
 

Utiliza el protocolo DNS para resolver registros `CNAME` para el `hostname`. El argumento `addresses` pasado a la función `callback` contendrá un array de registros de nombres canónicos disponibles para el `hostname` (p. ej. `['bar.example.com']`).

## `dns.resolveCaa(hostname, callback)` {#dnsresolvecaahostname-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una función callback inválida al argumento `callback` ahora lanza `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v15.0.0, v14.17.0 | Añadido en: v15.0.0, v14.17.0 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `records` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  
 

Utiliza el protocolo DNS para resolver registros `CAA` para el `hostname`. El argumento `addresses` pasado a la función `callback` contendrá un array de registros de autorización de autoridad de certificación disponibles para el `hostname` (p. ej. `[{critical: 0, iodef: 'mailto:pki@example.com'}, {critical: 128, issue: 'pki.example.com'}]`).


## `dns.resolveMx(hostname, callback)` {#dnsresolvemxhostname-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una retrollamada inválida al argumento `callback` ahora arroja `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v0.1.27 | Añadido en: v0.1.27 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  
 

Utiliza el protocolo DNS para resolver registros de intercambio de correo (`MX` records) para el `hostname`. El argumento `addresses` pasado a la función `callback` contendrá un array de objetos que contienen tanto una propiedad `priority` como una `exchange` (ej. `[{priority: 10, exchange: 'mx.example.com'}, ...]`).

## `dns.resolveNaptr(hostname, callback)` {#dnsresolvenaptrhostname-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una retrollamada inválida al argumento `callback` ahora arroja `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v0.9.12 | Añadido en: v0.9.12 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  
 

Utiliza el protocolo DNS para resolver registros basados en expresiones regulares (`NAPTR` records) para el `hostname`. El argumento `addresses` pasado a la función `callback` contendrá un array de objetos con las siguientes propiedades:

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

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una función de retrollamada inválida al argumento `callback` ahora lanza `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v0.1.90 | Añadido en: v0.1.90 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)



Utiliza el protocolo DNS para resolver los registros de servidor de nombres (registros `NS`) para el `hostname`. El argumento `addresses` pasado a la función `callback` contendrá una matriz de registros de servidor de nombres disponibles para `hostname` (por ejemplo, `['ns1.example.com', 'ns2.example.com']`).

## `dns.resolvePtr(hostname, callback)` {#dnsresolveptrhostname-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una función de retrollamada inválida al argumento `callback` ahora lanza `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v6.0.0 | Añadido en: v6.0.0 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)



Utiliza el protocolo DNS para resolver los registros de puntero (registros `PTR`) para el `hostname`. El argumento `addresses` pasado a la función `callback` será una matriz de cadenas que contenga los registros de respuesta.

## `dns.resolveSoa(hostname, callback)` {#dnsresolvesoahostname-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una función de retrollamada inválida al argumento `callback` ahora lanza `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v0.11.10 | Añadido en: v0.11.10 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `address` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)



Utiliza el protocolo DNS para resolver un registro de inicio de autoridad (registro `SOA`) para el `hostname`. El argumento `address` pasado a la función `callback` será un objeto con las siguientes propiedades:

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

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una función de retrollamada inválida al argumento `callback` ahora arroja `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v0.1.27 | Añadido en: v0.1.27 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Utiliza el protocolo DNS para resolver registros de servicio (registros `SRV`) para el `hostname`. El argumento `addresses` pasado a la función `callback` será un array de objetos con las siguientes propiedades:

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

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una función de retrollamada inválida al argumento `callback` ahora arroja `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v0.1.27 | Añadido en: v0.1.27 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `records` [\<string[][]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Utiliza el protocolo DNS para resolver consultas de texto (registros `TXT`) para el `hostname`. El argumento `records` pasado a la función `callback` es un array bidimensional de los registros de texto disponibles para `hostname` (p. ej., `[ ['v=spf1 ip4:0.0.0.0 ', '~all' ] ]`). Cada sub-array contiene fragmentos TXT de un registro. Dependiendo del caso de uso, estos podrían unirse o tratarse por separado.


## `dns.reverse(ip, callback)` {#dnsreverseip-callback}

**Agregado en: v0.1.16**

- `ip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `hostnames` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Realiza una consulta DNS inversa que resuelve una dirección IPv4 o IPv6 en un array de nombres de host.

En caso de error, `err` es un objeto [`Error`](/es/nodejs/api/errors#class-error), donde `err.code` es uno de los [códigos de error DNS](/es/nodejs/api/dns#error-codes).

## `dns.setDefaultResultOrder(order)` {#dnssetdefaultresultorderorder}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v22.1.0, v20.13.0 | Ahora se soporta el valor `ipv6first`. |
| v17.0.0 | Se cambió el valor por defecto a `verbatim`. |
| v16.4.0, v14.18.0 | Agregado en: v16.4.0, v14.18.0 |
:::

- `order` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) debe ser `'ipv4first'`, `'ipv6first'` o `'verbatim'`.

Establece el valor por defecto de `order` en [`dns.lookup()`](/es/nodejs/api/dns#dnslookuphostname-options-callback) y [`dnsPromises.lookup()`](/es/nodejs/api/dns#dnspromiseslookuphostname-options). El valor puede ser:

- `ipv4first`: establece el `order` predeterminado en `ipv4first`.
- `ipv6first`: establece el `order` predeterminado en `ipv6first`.
- `verbatim`: establece el `order` predeterminado en `verbatim`.

El valor por defecto es `verbatim` y [`dns.setDefaultResultOrder()`](/es/nodejs/api/dns#dnssetdefaultresultorderorder) tiene mayor prioridad que [`--dns-result-order`](/es/nodejs/api/cli#--dns-result-orderorder). Cuando se utilizan [hilos de trabajo](/es/nodejs/api/worker_threads), [`dns.setDefaultResultOrder()`](/es/nodejs/api/dns#dnssetdefaultresultorderorder) del hilo principal no afectará a los órdenes DNS por defecto en los trabajadores.

## `dns.getDefaultResultOrder()` {#dnsgetdefaultresultorder}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v22.1.0, v20.13.0 | Ahora se soporta el valor `ipv6first`. |
| v20.1.0, v18.17.0 | Agregado en: v20.1.0, v18.17.0 |
:::

Obtiene el valor por defecto para `order` en [`dns.lookup()`](/es/nodejs/api/dns#dnslookuphostname-options-callback) y [`dnsPromises.lookup()`](/es/nodejs/api/dns#dnspromiseslookuphostname-options). El valor puede ser:

- `ipv4first`: para `order` predeterminado en `ipv4first`.
- `ipv6first`: para `order` predeterminado en `ipv6first`.
- `verbatim`: para `order` predeterminado en `verbatim`.


## `dns.setServers(servers)` {#dnssetserversservers}

**Añadido en: v0.11.3**

- `servers` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) array de direcciones con formato [RFC 5952](https://tools.ietf.org/html/rfc5952#section-6)

Establece la dirección IP y el puerto de los servidores que se utilizarán al realizar la resolución de DNS. El argumento `servers` es un array de direcciones con formato [RFC 5952](https://tools.ietf.org/html/rfc5952#section-6). Si el puerto es el puerto DNS predeterminado de IANA (53), se puede omitir.

```js [ESM]
dns.setServers([
  '8.8.8.8',
  '[2001:4860:4860::8888]',
  '8.8.8.8:1053',
  '[2001:4860:4860::8888]:1053',
]);
```
Se lanzará un error si se proporciona una dirección no válida.

No se debe llamar al método `dns.setServers()` mientras haya una consulta DNS en curso.

El método [`dns.setServers()`](/es/nodejs/api/dns#dnssetserversservers) afecta solo a [`dns.resolve()`](/es/nodejs/api/dns#dnsresolvehostname-rrtype-callback), `dns.resolve*()` y [`dns.reverse()`](/es/nodejs/api/dns#dnsreverseip-callback) (y específicamente *no* a [`dns.lookup()`](/es/nodejs/api/dns#dnslookuphostname-options-callback)).

Este método funciona de forma muy similar a [resolve.conf](https://man7.org/linux/man-pages/man5/resolv.conf.5). Es decir, si el intento de resolver con el primer servidor proporcionado da como resultado un error `NOTFOUND`, el método `resolve()` *no* intentará resolver con los siguientes servidores proporcionados. Los servidores DNS de respaldo solo se utilizarán si los anteriores se agotan o resultan en algún otro error.

## API de promesas DNS {#dns-promises-api}

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v15.0.0 | Expuesto como `require('dns/promises')`. |
| v11.14.0, v10.17.0 | Esta API ya no es experimental. |
| v10.6.0 | Añadido en: v10.6.0 |
:::

La API `dns.promises` proporciona un conjunto alternativo de métodos DNS asíncronos que devuelven objetos `Promise` en lugar de utilizar devoluciones de llamada. Se puede acceder a la API a través de `require('node:dns').promises` o `require('node:dns/promises')`.

### Clase: `dnsPromises.Resolver` {#class-dnspromisesresolver}

**Añadido en: v10.6.0**

Un solucionador independiente para las solicitudes DNS.

La creación de un nuevo solucionador utiliza la configuración predeterminada del servidor. Establecer los servidores utilizados para un solucionador mediante [`resolver.setServers()`](/es/nodejs/api/dns#dnspromisessetserversservers) no afecta a otros solucionadores:

::: code-group
```js [ESM]
import { Resolver } from 'node:dns/promises';
const resolver = new Resolver();
resolver.setServers(['4.4.4.4']);

// Esta solicitud utilizará el servidor en 4.4.4.4, independientemente de la configuración global.
const addresses = await resolver.resolve4('example.org');
```

```js [CJS]
const { Resolver } = require('node:dns').promises;
const resolver = new Resolver();
resolver.setServers(['4.4.4.4']);

// Esta solicitud utilizará el servidor en 4.4.4.4, independientemente de la configuración global.
resolver.resolve4('example.org').then((addresses) => {
  // ...
});

// Alternativamente, el mismo código se puede escribir usando el estilo async-await.
(async function() {
  const addresses = await resolver.resolve4('example.org');
})();
```
:::

Los siguientes métodos de la API `dnsPromises` están disponibles:

- [`resolver.getServers()`](/es/nodejs/api/dns#dnspromisesgetservers)
- [`resolver.resolve()`](/es/nodejs/api/dns#dnspromisesresolvehostname-rrtype)
- [`resolver.resolve4()`](/es/nodejs/api/dns#dnspromisesresolve4hostname-options)
- [`resolver.resolve6()`](/es/nodejs/api/dns#dnspromisesresolve6hostname-options)
- [`resolver.resolveAny()`](/es/nodejs/api/dns#dnspromisesresolveanyhostname)
- [`resolver.resolveCaa()`](/es/nodejs/api/dns#dnspromisesresolvecaahostname)
- [`resolver.resolveCname()`](/es/nodejs/api/dns#dnspromisesresolvecnamehostname)
- [`resolver.resolveMx()`](/es/nodejs/api/dns#dnspromisesresolvemxhostname)
- [`resolver.resolveNaptr()`](/es/nodejs/api/dns#dnspromisesresolvenaptrhostname)
- [`resolver.resolveNs()`](/es/nodejs/api/dns#dnspromisesresolvenshostname)
- [`resolver.resolvePtr()`](/es/nodejs/api/dns#dnspromisesresolveptrhostname)
- [`resolver.resolveSoa()`](/es/nodejs/api/dns#dnspromisesresolvesoahostname)
- [`resolver.resolveSrv()`](/es/nodejs/api/dns#dnspromisesresolvesrvhostname)
- [`resolver.resolveTxt()`](/es/nodejs/api/dns#dnspromisesresolvetxthostname)
- [`resolver.reverse()`](/es/nodejs/api/dns#dnspromisesreverseip)
- [`resolver.setServers()`](/es/nodejs/api/dns#dnspromisessetserversservers)


### `resolver.cancel()` {#resolvercancel_1}

**Añadido en: v15.3.0, v14.17.0**

Cancela todas las consultas DNS pendientes realizadas por este resolvedor. Las promesas correspondientes serán rechazadas con un error con el código `ECANCELLED`.

### `dnsPromises.getServers()` {#dnspromisesgetservers}

**Añadido en: v10.6.0**

- Devuelve: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Devuelve un array de cadenas de direcciones IP, formateadas según [RFC 5952](https://tools.ietf.org/html/rfc5952#section-6), que están configuradas actualmente para la resolución DNS. Una cadena incluirá una sección de puerto si se utiliza un puerto personalizado.

```js [ESM]
[
  '8.8.8.8',
  '2001:4860:4860::8888',
  '8.8.8.8:1053',
  '[2001:4860:4860::8888]:1053',
]
```
### `dnsPromises.lookup(hostname[, options])` {#dnspromiseslookuphostname-options}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v22.1.0, v20.13.0 | La opción `verbatim` ahora está obsoleta en favor de la nueva opción `order`. |
| v10.6.0 | Añadido en: v10.6.0 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `family` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La familia de registros. Debe ser `4`, `6` o `0`. El valor `0` indica que se devuelve una dirección IPv4 o IPv6. Si el valor `0` se utiliza con `{ all: true }` (véase más abajo), se devuelve una o ambas direcciones IPv4 e IPv6, dependiendo del resolvedor DNS del sistema. **Predeterminado:** `0`.
    - `hints` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Una o más [flags `getaddrinfo` soportadas](/es/nodejs/api/dns#supported-getaddrinfo-flags). Se pueden pasar múltiples flags mediante el operador `OR` bit a bit de sus valores.
    - `all` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Cuando es `true`, la `Promise` se resuelve con todas las direcciones en un array. De lo contrario, devuelve una sola dirección. **Predeterminado:** `false`.
    - `order` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Cuando es `verbatim`, la `Promise` se resuelve con direcciones IPv4 e IPv6 en el orden en que el resolvedor DNS las devolvió. Cuando es `ipv4first`, las direcciones IPv4 se colocan antes que las direcciones IPv6. Cuando es `ipv6first`, las direcciones IPv6 se colocan antes que las direcciones IPv4. **Predeterminado:** `verbatim` (las direcciones no se reordenan). El valor predeterminado se puede configurar utilizando [`dns.setDefaultResultOrder()`](/es/nodejs/api/dns#dnssetdefaultresultorderorder) o [`--dns-result-order`](/es/nodejs/api/cli#--dns-result-orderorder). El código nuevo debe usar `{ order: 'verbatim' }`.
    - `verbatim` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Cuando es `true`, la `Promise` se resuelve con direcciones IPv4 e IPv6 en el orden en que el resolvedor DNS las devolvió. Cuando es `false`, las direcciones IPv4 se colocan antes que las direcciones IPv6. Esta opción quedará obsoleta en favor de `order`. Cuando ambos se especifican, `order` tiene mayor precedencia. El código nuevo solo debe usar `order`. **Predeterminado:** actualmente `false` (las direcciones se reordenan), pero se espera que esto cambie en un futuro no muy lejano. El valor predeterminado se puede configurar utilizando [`dns.setDefaultResultOrder()`](/es/nodejs/api/dns#dnssetdefaultresultorderorder) o [`--dns-result-order`](/es/nodejs/api/cli#--dns-result-orderorder).
  
 

Resuelve un nombre de host (p. ej. `'nodejs.org'`) en el primer registro A (IPv4) o AAAA (IPv6) encontrado. Todas las propiedades de `option` son opcionales. Si `options` es un entero, entonces debe ser `4` o `6` - si `options` no se proporciona, entonces se devuelven direcciones IPv4 o IPv6, o ambas, si se encuentran.

Con la opción `all` establecida en `true`, la `Promise` se resuelve con `addresses` siendo un array de objetos con las propiedades `address` y `family`.

En caso de error, la `Promise` se rechaza con un objeto [`Error`](/es/nodejs/api/errors#class-error), donde `err.code` es el código de error. Tenga en cuenta que `err.code` se establecerá en `'ENOTFOUND'` no solo cuando el nombre de host no existe, sino también cuando la búsqueda falla de otras maneras, como la falta de descriptores de archivo disponibles.

[`dnsPromises.lookup()`](/es/nodejs/api/dns#dnspromiseslookuphostname-options) no necesariamente tiene algo que ver con el protocolo DNS. La implementación utiliza una facilidad del sistema operativo que puede asociar nombres con direcciones y viceversa. Esta implementación puede tener consecuencias sutiles pero importantes en el comportamiento de cualquier programa Node.js. Por favor, tómese un tiempo para consultar la [sección Consideraciones de la implementación](/es/nodejs/api/dns#implementation-considerations) antes de usar `dnsPromises.lookup()`.

Ejemplo de uso:



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

**Agregado en: v10.6.0**

- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Resuelve la `dirección` y el `puerto` dados en un nombre de host y un servicio utilizando la implementación `getnameinfo` subyacente del sistema operativo.

Si `address` no es una dirección IP válida, se lanzará un `TypeError`. El `puerto` se convertirá a un número. Si no es un puerto legal, se lanzará un `TypeError`.

En caso de error, la `Promise` se rechaza con un objeto [`Error`](/es/nodejs/api/errors#class-error), donde `err.code` es el código de error.

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

**Agregado en: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nombre de host a resolver.
- `rrtype` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Tipo de registro de recursos. **Predeterminado:** `'A'`.

Utiliza el protocolo DNS para resolver un nombre de host (p. ej., `'nodejs.org'`) en una matriz de registros de recursos. Cuando tiene éxito, la `Promise` se resuelve con una matriz de registros de recursos. El tipo y la estructura de los resultados individuales varían según `rrtype`:

| `rrtype` | `records` contiene | Tipo de resultado | Método abreviado |
| --- | --- | --- | --- |
| `'A'` | Direcciones IPv4 (predeterminado) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dnsPromises.resolve4()`](/es/nodejs/api/dns#dnspromisesresolve4hostname-options) |
| `'AAAA'` | Direcciones IPv6 | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dnsPromises.resolve6()`](/es/nodejs/api/dns#dnspromisesresolve6hostname-options) |
| `'ANY'` | Cualquier registro | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dnsPromises.resolveAny()`](/es/nodejs/api/dns#dnspromisesresolveanyhostname) |
| `'CAA'` | Registros de autorización de CA | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dnsPromises.resolveCaa()`](/es/nodejs/api/dns#dnspromisesresolvecaahostname) |
| `'CNAME'` | Registros de nombre canónico | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dnsPromises.resolveCname()`](/es/nodejs/api/dns#dnspromisesresolvecnamehostname) |
| `'MX'` | Registros de intercambio de correo | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dnsPromises.resolveMx()`](/es/nodejs/api/dns#dnspromisesresolvemxhostname) |
| `'NAPTR'` | Registros de puntero de autoridad de nombre | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dnsPromises.resolveNaptr()`](/es/nodejs/api/dns#dnspromisesresolvenaptrhostname) |
| `'NS'` | Registros de servidor de nombres | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dnsPromises.resolveNs()`](/es/nodejs/api/dns#dnspromisesresolvenshostname) |
| `'PTR'` | Registros de puntero | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dnsPromises.resolvePtr()`](/es/nodejs/api/dns#dnspromisesresolveptrhostname) |
| `'SOA'` | Registros de inicio de autoridad | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dnsPromises.resolveSoa()`](/es/nodejs/api/dns#dnspromisesresolvesoahostname) |
| `'SRV'` | Registros de servicio | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dnsPromises.resolveSrv()`](/es/nodejs/api/dns#dnspromisesresolvesrvhostname) |
| `'TXT'` | Registros de texto | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dnsPromises.resolveTxt()`](/es/nodejs/api/dns#dnspromisesresolvetxthostname) |

En caso de error, la `Promise` se rechaza con un objeto [`Error`](/es/nodejs/api/errors#class-error), donde `err.code` es uno de los [códigos de error de DNS](/es/nodejs/api/dns#error-codes).


### `dnsPromises.resolve4(hostname[, options])` {#dnspromisesresolve4hostname-options}

**Agregado en: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nombre de host a resolver.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ttl` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Recupera el valor de Time-To-Live (TTL) de cada registro. Cuando es `true`, la `Promise` se resuelve con un array de objetos `{ address: '1.2.3.4', ttl: 60 }` en lugar de un array de cadenas, con el TTL expresado en segundos.

Usa el protocolo DNS para resolver direcciones IPv4 (registros `A`) para el `hostname`. Si tiene éxito, la `Promise` se resuelve con un array de direcciones IPv4 (p. ej., `['74.125.79.104', '74.125.79.105', '74.125.79.106']`).

### `dnsPromises.resolve6(hostname[, options])` {#dnspromisesresolve6hostname-options}

**Agregado en: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nombre de host a resolver.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ttl` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Recupera el valor de Time-To-Live (TTL) de cada registro. Cuando es `true`, la `Promise` se resuelve con un array de objetos `{ address: '0:1:2:3:4:5:6:7', ttl: 60 }` en lugar de un array de cadenas, con el TTL expresado en segundos.

Usa el protocolo DNS para resolver direcciones IPv6 (registros `AAAA`) para el `hostname`. Si tiene éxito, la `Promise` se resuelve con un array de direcciones IPv6.

### `dnsPromises.resolveAny(hostname)` {#dnspromisesresolveanyhostname}

**Agregado en: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Usa el protocolo DNS para resolver todos los registros (también conocido como consulta `ANY` o `*`). Si tiene éxito, la `Promise` se resuelve con un array que contiene varios tipos de registros. Cada objeto tiene una propiedad `type` que indica el tipo del registro actual. Y dependiendo del `type`, habrá propiedades adicionales en el objeto:

| Tipo | Propiedades |
| --- | --- |
| `'A'` | `address` / `ttl` |
| `'AAAA'` | `address` / `ttl` |
| `'CNAME'` | `value` |
| `'MX'` | Consulte [`dnsPromises.resolveMx()`](/es/nodejs/api/dns#dnspromisesresolvemxhostname) |
| `'NAPTR'` | Consulte [`dnsPromises.resolveNaptr()`](/es/nodejs/api/dns#dnspromisesresolvenaptrhostname) |
| `'NS'` | `value` |
| `'PTR'` | `value` |
| `'SOA'` | Consulte [`dnsPromises.resolveSoa()`](/es/nodejs/api/dns#dnspromisesresolvesoahostname) |
| `'SRV'` | Consulte [`dnsPromises.resolveSrv()`](/es/nodejs/api/dns#dnspromisesresolvesrvhostname) |
| `'TXT'` | Este tipo de registro contiene una propiedad de array llamada `entries` que se refiere a [`dnsPromises.resolveTxt()`](/es/nodejs/api/dns#dnspromisesresolvetxthostname), p. ej. `{ entries: ['...'], type: 'TXT' }` |

Aquí hay un ejemplo del objeto de resultado:

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

**Agregado en: v15.0.0, v14.17.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Utiliza el protocolo DNS para resolver los registros `CAA` para el `hostname`. Si tiene éxito, la `Promise` se resuelve con un arreglo de objetos que contiene los registros de autorización de la autoridad de certificación disponibles para el `hostname` (p. ej., `[{critical: 0, iodef: 'mailto:pki@example.com'},{critical: 128, issue: 'pki.example.com'}]`).

### `dnsPromises.resolveCname(hostname)` {#dnspromisesresolvecnamehostname}

**Agregado en: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Utiliza el protocolo DNS para resolver los registros `CNAME` para el `hostname`. Si tiene éxito, la `Promise` se resuelve con un arreglo de registros de nombres canónicos disponibles para el `hostname` (p. ej., `['bar.example.com']`).

### `dnsPromises.resolveMx(hostname)` {#dnspromisesresolvemxhostname}

**Agregado en: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Utiliza el protocolo DNS para resolver los registros de intercambio de correo (`MX` records) para el `hostname`. Si tiene éxito, la `Promise` se resuelve con un arreglo de objetos que contiene tanto una propiedad `priority` como una propiedad `exchange` (p. ej., `[{priority: 10, exchange: 'mx.example.com'}, ...]`).

### `dnsPromises.resolveNaptr(hostname)` {#dnspromisesresolvenaptrhostname}

**Agregado en: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Utiliza el protocolo DNS para resolver los registros basados en expresiones regulares (`NAPTR` records) para el `hostname`. Si tiene éxito, la `Promise` se resuelve con un arreglo de objetos con las siguientes propiedades:

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

**Agregado en: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Utiliza el protocolo DNS para resolver los registros del servidor de nombres (`NS` records) para el `hostname`. Si tiene éxito, la `Promise` se resuelve con un arreglo de registros del servidor de nombres disponibles para `hostname` (p. ej., `['ns1.example.com', 'ns2.example.com']`).


### `dnsPromises.resolvePtr(hostname)` {#dnspromisesresolveptrhostname}

**Agregado en: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Usa el protocolo DNS para resolver registros de puntero (registros `PTR`) para el `hostname`. Si tiene éxito, la `Promise` se resuelve con un array de strings que contiene los registros de respuesta.

### `dnsPromises.resolveSoa(hostname)` {#dnspromisesresolvesoahostname}

**Agregado en: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Usa el protocolo DNS para resolver un registro de inicio de autoridad (registro `SOA`) para el `hostname`. Si tiene éxito, la `Promise` se resuelve con un objeto con las siguientes propiedades:

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

**Agregado en: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Usa el protocolo DNS para resolver registros de servicio (registros `SRV`) para el `hostname`. Si tiene éxito, la `Promise` se resuelve con un array de objetos con las siguientes propiedades:

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

**Agregado en: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Usa el protocolo DNS para resolver consultas de texto (registros `TXT`) para el `hostname`. Si tiene éxito, la `Promise` se resuelve con un array bidimensional de los registros de texto disponibles para `hostname` (ej. `[ [ 'v=spf1 ip4:0.0.0.0 ', '~all' ] ]`). Cada sub-array contiene fragmentos TXT de un registro. Dependiendo del caso de uso, estos podrían unirse o tratarse por separado.


### `dnsPromises.reverse(ip)` {#dnspromisesreverseip}

**Agregado en: v10.6.0**

- `ip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Realiza una consulta DNS inversa que resuelve una dirección IPv4 o IPv6 a una matriz de nombres de host.

En caso de error, la `Promise` se rechaza con un objeto [`Error`](/es/nodejs/api/errors#class-error), donde `err.code` es uno de los [códigos de error de DNS](/es/nodejs/api/dns#error-codes).

### `dnsPromises.setDefaultResultOrder(order)` {#dnspromisessetdefaultresultorderorder}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v22.1.0, v20.13.0 | Ahora se admite el valor `ipv6first`. |
| v17.0.0 | Se cambió el valor predeterminado a `verbatim`. |
| v16.4.0, v14.18.0 | Agregado en: v16.4.0, v14.18.0 |
:::

- `order` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) debe ser `'ipv4first'`, `'ipv6first'` o `'verbatim'`.

Establezca el valor predeterminado de `order` en [`dns.lookup()`](/es/nodejs/api/dns#dnslookuphostname-options-callback) y [`dnsPromises.lookup()`](/es/nodejs/api/dns#dnspromiseslookuphostname-options). El valor podría ser:

- `ipv4first`: establece `order` predeterminado en `ipv4first`.
- `ipv6first`: establece `order` predeterminado en `ipv6first`.
- `verbatim`: establece `order` predeterminado en `verbatim`.

El valor predeterminado es `verbatim` y [`dnsPromises.setDefaultResultOrder()`](/es/nodejs/api/dns#dnspromisessetdefaultresultorderorder) tiene mayor prioridad que [`--dns-result-order`](/es/nodejs/api/cli#--dns-result-orderorder). Cuando se utilizan [hilos de trabajo](/es/nodejs/api/worker_threads), [`dnsPromises.setDefaultResultOrder()`](/es/nodejs/api/dns#dnspromisessetdefaultresultorderorder) del hilo principal no afectará los órdenes de DNS predeterminados en los trabajadores.

### `dnsPromises.getDefaultResultOrder()` {#dnspromisesgetdefaultresultorder}

**Agregado en: v20.1.0, v18.17.0**

Obtiene el valor de `dnsOrder`.

### `dnsPromises.setServers(servers)` {#dnspromisessetserversservers}

**Agregado en: v10.6.0**

- `servers` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) matriz de direcciones con formato [RFC 5952](https://tools.ietf.org/html/rfc5952#section-6)

Establece la dirección IP y el puerto de los servidores que se utilizarán al realizar la resolución de DNS. El argumento `servers` es una matriz de direcciones con formato [RFC 5952](https://tools.ietf.org/html/rfc5952#section-6). Si el puerto es el puerto DNS predeterminado de IANA (53), se puede omitir.

```js [ESM]
dnsPromises.setServers([
  '8.8.8.8',
  '[2001:4860:4860::8888]',
  '8.8.8.8:1053',
  '[2001:4860:4860::8888]:1053',
]);
```
Se lanzará un error si se proporciona una dirección no válida.

El método `dnsPromises.setServers()` no debe llamarse mientras una consulta DNS está en curso.

Este método funciona de manera muy similar a [resolve.conf](https://man7.org/linux/man-pages/man5/resolv.conf.5). Es decir, si intentar resolver con el primer servidor proporcionado resulta en un error `NOTFOUND`, el método `resolve()` *no* intentará resolver con los servidores posteriores proporcionados. Los servidores DNS de respaldo solo se utilizarán si los anteriores se agotan o resultan en algún otro error.


## Códigos de error {#error-codes}

Cada consulta DNS puede devolver uno de los siguientes códigos de error:

- `dns.NODATA`: El servidor DNS devolvió una respuesta sin datos.
- `dns.FORMERR`: El servidor DNS afirma que la consulta tenía un formato incorrecto.
- `dns.SERVFAIL`: El servidor DNS devolvió un error general.
- `dns.NOTFOUND`: Nombre de dominio no encontrado.
- `dns.NOTIMP`: El servidor DNS no implementa la operación solicitada.
- `dns.REFUSED`: El servidor DNS rechazó la consulta.
- `dns.BADQUERY`: Consulta DNS con formato incorrecto.
- `dns.BADNAME`: Nombre de host con formato incorrecto.
- `dns.BADFAMILY`: Familia de direcciones no admitida.
- `dns.BADRESP`: Respuesta DNS con formato incorrecto.
- `dns.CONNREFUSED`: No se pudo contactar con los servidores DNS.
- `dns.TIMEOUT`: Tiempo de espera al contactar con los servidores DNS.
- `dns.EOF`: Fin del archivo.
- `dns.FILE`: Error al leer el archivo.
- `dns.NOMEM`: Sin memoria.
- `dns.DESTRUCTION`: El canal está siendo destruido.
- `dns.BADSTR`: Cadena con formato incorrecto.
- `dns.BADFLAGS`: Se especificaron flags ilegales.
- `dns.NONAME`: El nombre de host dado no es numérico.
- `dns.BADHINTS`: Se especificaron flags de sugerencias ilegales.
- `dns.NOTINITIALIZED`: Aún no se ha realizado la inicialización de la biblioteca c-ares.
- `dns.LOADIPHLPAPI`: Error al cargar `iphlpapi.dll`.
- `dns.ADDRGETNETWORKPARAMS`: No se pudo encontrar la función `GetNetworkParams`.
- `dns.CANCELLED`: Consulta DNS cancelada.

La API `dnsPromises` también exporta los códigos de error anteriores, por ejemplo, `dnsPromises.NODATA`.

## Consideraciones de implementación {#implementation-considerations}

Aunque [`dns.lookup()`](/es/nodejs/api/dns#dnslookuphostname-options-callback) y las diversas funciones `dns.resolve*()/dns.reverse()` tienen el mismo objetivo de asociar un nombre de red con una dirección de red (o viceversa), su comportamiento es bastante diferente. Estas diferencias pueden tener consecuencias sutiles pero significativas en el comportamiento de los programas Node.js.

### `dns.lookup()` {#dnslookup}

Internamente, [`dns.lookup()`](/es/nodejs/api/dns#dnslookuphostname-options-callback) utiliza las mismas facilidades del sistema operativo que la mayoría de los otros programas. Por ejemplo, [`dns.lookup()`](/es/nodejs/api/dns#dnslookuphostname-options-callback) casi siempre resolverá un nombre dado de la misma manera que el comando `ping`. En la mayoría de los sistemas operativos tipo POSIX, el comportamiento de la función [`dns.lookup()`](/es/nodejs/api/dns#dnslookuphostname-options-callback) se puede modificar cambiando la configuración en [`nsswitch.conf(5)`](http://man7.org/linux/man-pages/man5/nsswitch.conf.5) y/o [`resolv.conf(5)`](http://man7.org/linux/man-pages/man5/resolv.conf.5), pero cambiar estos archivos cambiará el comportamiento de todos los demás programas que se ejecutan en el mismo sistema operativo.

Aunque la llamada a `dns.lookup()` será asíncrona desde la perspectiva de JavaScript, se implementa como una llamada síncrona a [`getaddrinfo(3)`](http://man7.org/linux/man-pages/man3/getaddrinfo.3) que se ejecuta en el threadpool de libuv. Esto puede tener implicaciones negativas sorprendentes en el rendimiento para algunas aplicaciones, consulte la documentación de [`UV_THREADPOOL_SIZE`](/es/nodejs/api/cli#uv_threadpool_sizesize) para obtener más información.

Varias API de red llamarán internamente a `dns.lookup()` para resolver nombres de host. Si eso es un problema, considere resolver el nombre de host a una dirección utilizando `dns.resolve()` y usar la dirección en lugar de un nombre de host. Además, algunas API de red (como [`socket.connect()`](/es/nodejs/api/net#socketconnectoptions-connectlistener) y [`dgram.createSocket()`](/es/nodejs/api/dgram#dgramcreatesocketoptions-callback)) permiten que el resolvedor predeterminado, `dns.lookup()`, sea reemplazado.


### `dns.resolve()`, `dns.resolve*()` y `dns.reverse()` {#dnsresolve-dnsresolve*-and-dnsreverse}

Estas funciones se implementan de manera bastante diferente a [`dns.lookup()`](/es/nodejs/api/dns#dnslookuphostname-options-callback). No utilizan [`getaddrinfo(3)`](http://man7.org/linux/man-pages/man3/getaddrinfo.3) y *siempre* realizan una consulta DNS en la red. Esta comunicación de red siempre se realiza de forma asíncrona y no utiliza el threadpool de libuv.

Como resultado, estas funciones no pueden tener el mismo impacto negativo en otros procesos que ocurren en el threadpool de libuv que el que puede tener [`dns.lookup()`](/es/nodejs/api/dns#dnslookuphostname-options-callback).

No utilizan el mismo conjunto de archivos de configuración que [`dns.lookup()`](/es/nodejs/api/dns#dnslookuphostname-options-callback). Por ejemplo, no utilizan la configuración de `/etc/hosts`.

