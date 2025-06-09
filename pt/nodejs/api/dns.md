---
title: Documentação do Node.js - DNS
description: Esta seção da documentação do Node.js aborda o módulo DNS (Sistema de Nomes de Domínio), que oferece funcionalidades de resolução de nomes de rede de forma assíncrona. Inclui métodos para resolver nomes de domínio para endereços IP, buscas reversas e consultas de registros DNS.
head:
  - - meta
    - name: og:title
      content: Documentação do Node.js - DNS | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Esta seção da documentação do Node.js aborda o módulo DNS (Sistema de Nomes de Domínio), que oferece funcionalidades de resolução de nomes de rede de forma assíncrona. Inclui métodos para resolver nomes de domínio para endereços IP, buscas reversas e consultas de registros DNS.
  - - meta
    - name: twitter:title
      content: Documentação do Node.js - DNS | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Esta seção da documentação do Node.js aborda o módulo DNS (Sistema de Nomes de Domínio), que oferece funcionalidades de resolução de nomes de rede de forma assíncrona. Inclui métodos para resolver nomes de domínio para endereços IP, buscas reversas e consultas de registros DNS.
---


# DNS {#dns}

::: tip [Stable: 2 - Stable]
[Stable: 2](/pt/nodejs/api/documentation#stability-index) [Stability: 2](/pt/nodejs/api/documentation#stability-index) - Estável
:::

**Código-fonte:** [lib/dns.js](https://github.com/nodejs/node/blob/v23.5.0/lib/dns.js)

O módulo `node:dns` permite a resolução de nomes. Por exemplo, use-o para procurar endereços IP de nomes de host.

Embora nomeado para o [Sistema de Nomes de Domínio (DNS)](https://en.wikipedia.org/wiki/Domain_Name_System), nem sempre usa o protocolo DNS para pesquisas. [`dns.lookup()`](/pt/nodejs/api/dns#dnslookuphostname-options-callback) usa os recursos do sistema operacional para realizar a resolução de nomes. Pode não ser necessário realizar nenhuma comunicação de rede. Para realizar a resolução de nomes da mesma forma que outros aplicativos no mesmo sistema, use [`dns.lookup()`](/pt/nodejs/api/dns#dnslookuphostname-options-callback).



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

Todas as outras funções no módulo `node:dns` se conectam a um servidor DNS real para realizar a resolução de nomes. Eles sempre usarão a rede para realizar consultas DNS. Essas funções não usam o mesmo conjunto de arquivos de configuração usado por [`dns.lookup()`](/pt/nodejs/api/dns#dnslookuphostname-options-callback) (por exemplo, `/etc/hosts`). Use essas funções para sempre realizar consultas DNS, ignorando outros recursos de resolução de nomes.



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

Consulte a [seção Considerações de implementação](/pt/nodejs/api/dns#implementation-considerations) para obter mais informações.


## Classe: `dns.Resolver` {#class-dnsresolver}

**Adicionado em: v8.3.0**

Um resolvedor independente para solicitações de DNS.

Criar um novo resolvedor usa as configurações de servidor padrão. Definir os servidores usados para um resolvedor usando [`resolver.setServers()`](/pt/nodejs/api/dns#dnssetserversservers) não afeta outros resolvedores:

::: code-group
```js [ESM]
import { Resolver } from 'node:dns';
const resolver = new Resolver();
resolver.setServers(['4.4.4.4']);

// Esta solicitação usará o servidor em 4.4.4.4, independente das configurações globais.
resolver.resolve4('example.org', (err, addresses) => {
  // ...
});
```

```js [CJS]
const { Resolver } = require('node:dns');
const resolver = new Resolver();
resolver.setServers(['4.4.4.4']);

// Esta solicitação usará o servidor em 4.4.4.4, independente das configurações globais.
resolver.resolve4('example.org', (err, addresses) => {
  // ...
});
```
:::

Os seguintes métodos do módulo `node:dns` estão disponíveis:

- [`resolver.getServers()`](/pt/nodejs/api/dns#dnsgetservers)
- [`resolver.resolve()`](/pt/nodejs/api/dns#dnsresolvehostname-rrtype-callback)
- [`resolver.resolve4()`](/pt/nodejs/api/dns#dnsresolve4hostname-options-callback)
- [`resolver.resolve6()`](/pt/nodejs/api/dns#dnsresolve6hostname-options-callback)
- [`resolver.resolveAny()`](/pt/nodejs/api/dns#dnsresolveanyhostname-callback)
- [`resolver.resolveCaa()`](/pt/nodejs/api/dns#dnsresolvecaahostname-callback)
- [`resolver.resolveCname()`](/pt/nodejs/api/dns#dnsresolvecnamehostname-callback)
- [`resolver.resolveMx()`](/pt/nodejs/api/dns#dnsresolvemxhostname-callback)
- [`resolver.resolveNaptr()`](/pt/nodejs/api/dns#dnsresolvenaptrhostname-callback)
- [`resolver.resolveNs()`](/pt/nodejs/api/dns#dnsresolvenshostname-callback)
- [`resolver.resolvePtr()`](/pt/nodejs/api/dns#dnsresolveptrhostname-callback)
- [`resolver.resolveSoa()`](/pt/nodejs/api/dns#dnsresolvesoahostname-callback)
- [`resolver.resolveSrv()`](/pt/nodejs/api/dns#dnsresolvesrvhostname-callback)
- [`resolver.resolveTxt()`](/pt/nodejs/api/dns#dnsresolvetxthostname-callback)
- [`resolver.reverse()`](/pt/nodejs/api/dns#dnsreverseip-callback)
- [`resolver.setServers()`](/pt/nodejs/api/dns#dnssetserversservers)

### `Resolver([options])` {#resolveroptions}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v16.7.0, v14.18.0 | O objeto `options` agora aceita uma opção `tries`. |
| v12.18.3 | O construtor agora aceita um objeto `options`. A única opção suportada é `timeout`. |
| v8.3.0 | Adicionado em: v8.3.0 |
:::

Cria um novo resolvedor.

- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Tempo limite da consulta em milissegundos, ou `-1` para usar o tempo limite padrão.
    - `tries` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de tentativas que o resolvedor tentará contatar cada servidor de nomes antes de desistir. **Padrão:** `4`


### `resolver.cancel()` {#resolvercancel}

**Adicionado em: v8.3.0**

Cancela todas as consultas DNS pendentes feitas por este resolvedor. Os retornos de chamada correspondentes serão chamados com um erro com o código `ECANCELLED`.

### `resolver.setLocalAddress([ipv4][, ipv6])` {#resolversetlocaladdressipv4-ipv6}

**Adicionado em: v15.1.0, v14.17.0**

- `ipv4` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Uma representação de string de um endereço IPv4. **Padrão:** `'0.0.0.0'`
- `ipv6` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Uma representação de string de um endereço IPv6. **Padrão:** `'::0'`

A instância do resolvedor enviará suas solicitações do endereço IP especificado. Isso permite que os programas especifiquem interfaces de saída quando usados em sistemas multi-homed.

Se um endereço v4 ou v6 não for especificado, ele será definido como o padrão e o sistema operacional escolherá um endereço local automaticamente.

O resolvedor usará o endereço local v4 ao fazer solicitações para servidores DNS IPv4 e o endereço local v6 ao fazer solicitações para servidores DNS IPv6. O `rrtype` das solicitações de resolução não tem impacto no endereço local usado.

## `dns.getServers()` {#dnsgetservers}

**Adicionado em: v0.11.3**

- Retorna: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retorna uma matriz de strings de endereço IP, formatadas de acordo com [RFC 5952](https://tools.ietf.org/html/rfc5952#section-6), que estão atualmente configuradas para resolução de DNS. Uma string incluirá uma seção de porta se uma porta personalizada for usada.

```js [ESM]
[
  '8.8.8.8',
  '2001:4860:4860::8888',
  '8.8.8.8:1053',
  '[2001:4860:4860::8888]:1053',
]
```
## `dns.lookup(hostname[, options], callback)` {#dnslookuphostname-options-callback}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v22.1.0, v20.13.0 | A opção `verbatim` agora está obsoleta em favor da nova opção `order`. |
| v18.4.0 | Para compatibilidade com `node:net`, ao passar um objeto de opção, a opção `family` pode ser a string `'IPv4'` ou a string `'IPv6'`. |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v17.0.0 | As opções `verbatim` agora são padronizadas como `true`. |
| v8.5.0 | A opção `verbatim` agora é suportada. |
| v1.2.0 | A opção `all` agora é suportada. |
| v0.1.90 | Adicionado em: v0.1.90 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `family` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A família de registros. Deve ser `4`, `6` ou `0`. Por razões de compatibilidade com versões anteriores, `'IPv4'` e `'IPv6'` são interpretados como `4` e `6`, respectivamente. O valor `0` indica que um endereço IPv4 ou IPv6 é retornado. Se o valor `0` for usado com `{ all: true }` (veja abaixo), um ou ambos os endereços IPv4 e IPv6 serão retornados, dependendo do resolvedor DNS do sistema. **Padrão:** `0`.
    - `hints` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Um ou mais [flags `getaddrinfo` suportados](/pt/nodejs/api/dns#supported-getaddrinfo-flags). Vários flags podem ser passados por `OR` bit a bit de seus valores.
    - `all` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, o callback retorna todos os endereços resolvidos em um array. Caso contrário, retorna um único endereço. **Padrão:** `false`.
    - `order` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Quando `verbatim`, os endereços resolvidos são retornados não ordenados. Quando `ipv4first`, os endereços resolvidos são classificados colocando os endereços IPv4 antes dos endereços IPv6. Quando `ipv6first`, os endereços resolvidos são classificados colocando os endereços IPv6 antes dos endereços IPv4. **Padrão:** `verbatim` (os endereços não são reordenados). O valor padrão é configurável usando [`dns.setDefaultResultOrder()`](/pt/nodejs/api/dns#dnssetdefaultresultorderorder) ou [`--dns-result-order`](/pt/nodejs/api/cli#--dns-result-orderorder).
    - `verbatim` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, o callback recebe endereços IPv4 e IPv6 na ordem em que o resolvedor DNS os retornou. Quando `false`, os endereços IPv4 são colocados antes dos endereços IPv6. Esta opção será preterida em favor de `order`. Quando ambos são especificados, `order` tem maior precedência. O novo código deve usar apenas `order`. **Padrão:** `true` (os endereços não são reordenados). O valor padrão é configurável usando [`dns.setDefaultResultOrder()`](/pt/nodejs/api/dns#dnssetdefaultresultorderorder) ou [`--dns-result-order`](/pt/nodejs/api/cli#--dns-result-orderorder).
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Uma representação de string de um endereço IPv4 ou IPv6.
    - `family` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `4` ou `6`, denotando a família de `address`, ou `0` se o endereço não for um endereço IPv4 ou IPv6. `0` é um indicador provável de um bug no serviço de resolução de nomes usado pelo sistema operacional.
  
 

Resolve um nome de host (por exemplo, `'nodejs.org'`) no primeiro registro A (IPv4) ou AAAA (IPv6) encontrado. Todas as propriedades de `option` são opcionais. Se `options` for um inteiro, então deve ser `4` ou `6` - se `options` não for fornecido, então endereços IPv4 ou IPv6, ou ambos, serão retornados se encontrados.

Com a opção `all` definida como `true`, os argumentos para `callback` mudam para `(err, addresses)`, com `addresses` sendo um array de objetos com as propriedades `address` e `family`.

Em caso de erro, `err` é um objeto [`Error`](/pt/nodejs/api/errors#class-error), onde `err.code` é o código de erro. Tenha em mente que `err.code` será definido como `'ENOTFOUND'` não apenas quando o nome do host não existir, mas também quando a pesquisa falhar de outras maneiras, como nenhum descritor de arquivo disponível.

`dns.lookup()` não tem necessariamente nada a ver com o protocolo DNS. A implementação usa uma facilidade do sistema operacional que pode associar nomes a endereços e vice-versa. Esta implementação pode ter consequências sutis, mas importantes no comportamento de qualquer programa Node.js. Por favor, reserve algum tempo para consultar a [seção de considerações de implementação](/pt/nodejs/api/dns#implementation-considerations) antes de usar `dns.lookup()`.

Exemplo de uso:



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

Se este método for invocado como sua versão [`util.promisify()`](/pt/nodejs/api/util#utilpromisifyoriginal)ed, e `all` não estiver definido como `true`, ele retorna uma `Promise` para um `Object` com propriedades `address` e `family`.


### Flags `getaddrinfo` suportadas {#supported-getaddrinfo-flags}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v13.13.0, v12.17.0 | Adicionado suporte para o flag `dns.ALL`. |
:::

Os seguintes flags podem ser passados como dicas para [`dns.lookup()`](/pt/nodejs/api/dns#dnslookuphostname-options-callback).

- `dns.ADDRCONFIG`: Limita os tipos de endereços retornados aos tipos de endereços não-loopback configurados no sistema. Por exemplo, endereços IPv4 são retornados somente se o sistema atual tiver pelo menos um endereço IPv4 configurado.
- `dns.V4MAPPED`: Se a família IPv6 foi especificada, mas nenhum endereço IPv6 foi encontrado, então retorna endereços IPv4 mapeados para IPv6. Não é suportado em alguns sistemas operacionais (por exemplo, FreeBSD 10.1).
- `dns.ALL`: Se `dns.V4MAPPED` for especificado, retorna endereços IPv6 resolvidos assim como endereços IPv4 mapeados para IPv6.

## `dns.lookupService(address, port, callback)` {#dnslookupserviceaddress-port-callback}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v0.11.14 | Adicionado em: v0.11.14 |
:::

- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
  - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
  - `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ex: `example.com`
  - `service` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ex: `http`

Resolve o `address` e `port` fornecidos em um nome de host e serviço usando a implementação `getnameinfo` subjacente do sistema operacional.

Se `address` não for um endereço IP válido, um `TypeError` será lançado. A `port` será forçada a ser um número. Se não for uma porta legal, um `TypeError` será lançado.

Em caso de erro, `err` é um objeto [`Error`](/pt/nodejs/api/errors#class-error), onde `err.code` é o código de erro.

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

Se este método for invocado como sua versão [`util.promisify()`](/pt/nodejs/api/util#utilpromisifyoriginal)ed, ele retorna uma `Promise` para um `Object` com propriedades `hostname` e `service`.


## `dns.resolve(hostname[, rrtype], callback)` {#dnsresolvehostname-rrtype-callback}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v0.1.27 | Adicionado em: v0.1.27 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome do host a ser resolvido.
- `rrtype` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Tipo de registro de recurso. **Padrão:** `'A'`.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `records` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Usa o protocolo DNS para resolver um nome de host (por exemplo, `'nodejs.org'`) em um array de registros de recursos. A função `callback` tem argumentos `(err, records)`. Quando bem-sucedido, `records` será um array de registros de recursos. O tipo e a estrutura dos resultados individuais variam com base em `rrtype`:

| `rrtype` | `records` contém | Tipo de resultado | Método abreviado |
| --- | --- | --- | --- |
| `'A'` | Endereços IPv4 (padrão) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dns.resolve4()`](/pt/nodejs/api/dns#dnsresolve4hostname-options-callback) |
| `'AAAA'` | Endereços IPv6 | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dns.resolve6()`](/pt/nodejs/api/dns#dnsresolve6hostname-options-callback) |
| `'ANY'` | quaisquer registros | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dns.resolveAny()`](/pt/nodejs/api/dns#dnsresolveanyhostname-callback) |
| `'CAA'` | registros de autorização de CA | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dns.resolveCaa()`](/pt/nodejs/api/dns#dnsresolvecaahostname-callback) |
| `'CNAME'` | registros de nome canônico | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dns.resolveCname()`](/pt/nodejs/api/dns#dnsresolvecnamehostname-callback) |
| `'MX'` | registros de troca de e-mail | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dns.resolveMx()`](/pt/nodejs/api/dns#dnsresolvemxhostname-callback) |
| `'NAPTR'` | registros de ponteiro de autoridade de nome | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dns.resolveNaptr()`](/pt/nodejs/api/dns#dnsresolvenaptrhostname-callback) |
| `'NS'` | registros de servidor de nomes | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dns.resolveNs()`](/pt/nodejs/api/dns#dnsresolvenshostname-callback) |
| `'PTR'` | registros de ponteiro | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dns.resolvePtr()`](/pt/nodejs/api/dns#dnsresolveptrhostname-callback) |
| `'SOA'` | registros de início de autoridade | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dns.resolveSoa()`](/pt/nodejs/api/dns#dnsresolvesoahostname-callback) |
| `'SRV'` | registros de serviço | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dns.resolveSrv()`](/pt/nodejs/api/dns#dnsresolvesrvhostname-callback) |
| `'TXT'` | registros de texto | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dns.resolveTxt()`](/pt/nodejs/api/dns#dnsresolvetxthostname-callback) |

Em caso de erro, `err` é um objeto [`Error`](/pt/nodejs/api/errors#class-error), onde `err.code` é um dos [códigos de erro DNS](/pt/nodejs/api/dns#error-codes).


## `dns.resolve4(hostname[, options], callback)` {#dnsresolve4hostname-options-callback}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v7.2.0 | Este método agora suporta passar `options`, especificamente `options.ttl`. |
| v0.1.16 | Adicionado em: v0.1.16 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome do host a ser resolvido.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `ttl` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Recupera o valor Time-To-Live (TTL) de cada registro. Quando `true`, o callback recebe um array de objetos `{ address: '1.2.3.4', ttl: 60 }` em vez de um array de strings, com o TTL expresso em segundos.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  
 

Usa o protocolo DNS para resolver endereços IPv4 (registros `A`) para o `hostname`. O argumento `addresses` passado para a função `callback` conterá um array de endereços IPv4 (por exemplo, `['74.125.79.104', '74.125.79.105', '74.125.79.106']`).

## `dns.resolve6(hostname[, options], callback)` {#dnsresolve6hostname-options-callback}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v7.2.0 | Este método agora suporta passar `options`, especificamente `options.ttl`. |
| v0.1.16 | Adicionado em: v0.1.16 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome do host a ser resolvido.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `ttl` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Recupera o valor Time-To-Live (TTL) de cada registro. Quando `true`, o callback recebe um array de objetos `{ address: '0:1:2:3:4:5:6:7', ttl: 60 }` em vez de um array de strings, com o TTL expresso em segundos.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  
 

Usa o protocolo DNS para resolver endereços IPv6 (registros `AAAA`) para o `hostname`. O argumento `addresses` passado para a função `callback` conterá um array de endereços IPv6.


## `dns.resolveAny(hostname, callback)` {#dnsresolveanyhostname-callback}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `ret` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Usa o protocolo DNS para resolver todos os registros (também conhecido como consulta `ANY` ou `*`). O argumento `ret` passado para a função `callback` será um array contendo vários tipos de registros. Cada objeto tem uma propriedade `type` que indica o tipo do registro atual. E, dependendo do `type`, propriedades adicionais estarão presentes no objeto:

| Tipo | Propriedades |
| --- | --- |
| `'A'` | `address`  /  `ttl` |
| `'AAAA'` | `address`  /  `ttl` |
| `'CNAME'` | `value` |
| `'MX'` | Consulte [`dns.resolveMx()`](/pt/nodejs/api/dns#dnsresolvemxhostname-callback) |
| `'NAPTR'` | Consulte [`dns.resolveNaptr()`](/pt/nodejs/api/dns#dnsresolvenaptrhostname-callback) |
| `'NS'` | `value` |
| `'PTR'` | `value` |
| `'SOA'` | Consulte [`dns.resolveSoa()`](/pt/nodejs/api/dns#dnsresolvesoahostname-callback) |
| `'SRV'` | Consulte [`dns.resolveSrv()`](/pt/nodejs/api/dns#dnsresolvesrvhostname-callback) |
| `'TXT'` | Este tipo de registro contém uma propriedade de array chamada `entries` que se refere a [`dns.resolveTxt()`](/pt/nodejs/api/dns#dnsresolvetxthostname-callback), por exemplo, `{ entries: ['...'], type: 'TXT' }` |
Aqui está um exemplo do objeto `ret` passado para o callback:

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
Os operadores de servidores DNS podem optar por não responder a consultas `ANY`. Pode ser melhor chamar métodos individuais como [`dns.resolve4()`](/pt/nodejs/api/dns#dnsresolve4hostname-options-callback), [`dns.resolveMx()`](/pt/nodejs/api/dns#dnsresolvemxhostname-callback) e assim por diante. Para mais detalhes, consulte [RFC 8482](https://tools.ietf.org/html/rfc8482).


## `dns.resolveCname(hostname, callback)` {#dnsresolvecnamehostname-callback}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v0.3.2 | Adicionado em: v0.3.2 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
  
 

Usa o protocolo DNS para resolver registros `CNAME` para o `hostname`. O argumento `addresses` passado para a função `callback` conterá um array de registros de nomes canônicos disponíveis para o `hostname` (por exemplo, `['bar.example.com']`).

## `dns.resolveCaa(hostname, callback)` {#dnsresolvecaahostname-callback}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v15.0.0, v14.17.0 | Adicionado em: v15.0.0, v14.17.0 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `records` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  
 

Usa o protocolo DNS para resolver registros `CAA` para o `hostname`. O argumento `addresses` passado para a função `callback` conterá um array de registros de autorização de autoridade de certificação disponíveis para o `hostname` (por exemplo, `[{critical: 0, iodef: 'mailto:pki@example.com'}, {critical: 128, issue: 'pki.example.com'}]`).


## `dns.resolveMx(hostname, callback)` {#dnsresolvemxhostname-callback}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v0.1.27 | Adicionado em: v0.1.27 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  
 

Usa o protocolo DNS para resolver registros de troca de correio (`MX` records) para o `hostname`. O argumento `addresses` passado para a função `callback` conterá um array de objetos contendo uma propriedade `priority` e `exchange` (ex: `[{priority: 10, exchange: 'mx.example.com'}, ...])`.

## `dns.resolveNaptr(hostname, callback)` {#dnsresolvenaptrhostname-callback}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v0.9.12 | Adicionado em: v0.9.12 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  
 

Usa o protocolo DNS para resolver registros baseados em expressão regular (`NAPTR` records) para o `hostname`. O argumento `addresses` passado para a função `callback` conterá um array de objetos com as seguintes propriedades:

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

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v0.1.90 | Adicionado em: v0.1.90 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Usa o protocolo DNS para resolver registros de servidor de nomes (registros `NS`) para o `hostname`. O argumento `addresses` passado para a função `callback` conterá um array de registros de servidor de nomes disponíveis para `hostname` (por exemplo, `['ns1.example.com', 'ns2.example.com']`).

## `dns.resolvePtr(hostname, callback)` {#dnsresolveptrhostname-callback}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v6.0.0 | Adicionado em: v6.0.0 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Usa o protocolo DNS para resolver registros de ponteiro (registros `PTR`) para o `hostname`. O argumento `addresses` passado para a função `callback` será um array de strings contendo os registros de resposta.

## `dns.resolveSoa(hostname, callback)` {#dnsresolvesoahostname-callback}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v0.11.10 | Adicionado em: v0.11.10 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `address` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Usa o protocolo DNS para resolver um registro de início de autoridade (registro `SOA`) para o `hostname`. O argumento `address` passado para a função `callback` será um objeto com as seguintes propriedades:

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

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v0.1.27 | Adicionado em: v0.1.27 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

 

Utiliza o protocolo DNS para resolver registros de serviço (registros `SRV`) para o `hostname`. O argumento `addresses` passado para a função `callback` será um array de objetos com as seguintes propriedades:

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

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v0.1.27 | Adicionado em: v0.1.27 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `records` [\<string[][]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

 

Utiliza o protocolo DNS para resolver consultas de texto (registros `TXT`) para o `hostname`. O argumento `records` passado para a função `callback` é um array bidimensional dos registros de texto disponíveis para `hostname` (por exemplo, `[ [ 'v=spf1 ip4:0.0.0.0 ', '~all' ] ]`). Cada sub-array contém blocos TXT de um registro. Dependendo do caso de uso, estes podem ser unidos ou tratados separadamente.


## `dns.reverse(ip, callback)` {#dnsreverseip-callback}

**Adicionado em: v0.1.16**

- `ip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `hostnames` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Executa uma consulta DNS reversa que resolve um endereço IPv4 ou IPv6 para um array de nomes de host.

Em caso de erro, `err` é um objeto [`Error`](/pt/nodejs/api/errors#class-error), onde `err.code` é um dos [códigos de erro DNS](/pt/nodejs/api/dns#error-codes).

## `dns.setDefaultResultOrder(order)` {#dnssetdefaultresultorderorder}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v22.1.0, v20.13.0 | O valor `ipv6first` agora é suportado. |
| v17.0.0 | Valor padrão alterado para `verbatim`. |
| v16.4.0, v14.18.0 | Adicionado em: v16.4.0, v14.18.0 |
:::

- `order` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) deve ser `'ipv4first'`, `'ipv6first'` ou `'verbatim'`.

Define o valor padrão de `order` em [`dns.lookup()`](/pt/nodejs/api/dns#dnslookuphostname-options-callback) e [`dnsPromises.lookup()`](/pt/nodejs/api/dns#dnspromiseslookuphostname-options). O valor pode ser:

- `ipv4first`: define o `order` padrão como `ipv4first`.
- `ipv6first`: define o `order` padrão como `ipv6first`.
- `verbatim`: define o `order` padrão como `verbatim`.

O padrão é `verbatim` e [`dns.setDefaultResultOrder()`](/pt/nodejs/api/dns#dnssetdefaultresultorderorder) tem maior prioridade do que [`--dns-result-order`](/pt/nodejs/api/cli#--dns-result-orderorder). Ao usar [worker threads](/pt/nodejs/api/worker_threads), [`dns.setDefaultResultOrder()`](/pt/nodejs/api/dns#dnssetdefaultresultorderorder) da thread principal não afetará as ordens dns padrão nos workers.

## `dns.getDefaultResultOrder()` {#dnsgetdefaultresultorder}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v22.1.0, v20.13.0 | O valor `ipv6first` agora é suportado. |
| v20.1.0, v18.17.0 | Adicionado em: v20.1.0, v18.17.0 |
:::

Obtém o valor padrão para `order` em [`dns.lookup()`](/pt/nodejs/api/dns#dnslookuphostname-options-callback) e [`dnsPromises.lookup()`](/pt/nodejs/api/dns#dnspromiseslookuphostname-options). O valor pode ser:

- `ipv4first`: para `order` com padrão para `ipv4first`.
- `ipv6first`: para `order` com padrão para `ipv6first`.
- `verbatim`: para `order` com padrão para `verbatim`.


## `dns.setServers(servers)` {#dnssetserversservers}

**Adicionado em: v0.11.3**

- `servers` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) array de endereços formatados [RFC 5952](https://tools.ietf.org/html/rfc5952#section-6)

Define o endereço IP e a porta dos servidores a serem usados ao realizar a resolução de DNS. O argumento `servers` é um array de endereços formatados [RFC 5952](https://tools.ietf.org/html/rfc5952#section-6). Se a porta for a porta DNS padrão da IANA (53), ela pode ser omitida.

```js [ESM]
dns.setServers([
  '8.8.8.8',
  '[2001:4860:4860::8888]',
  '8.8.8.8:1053',
  '[2001:4860:4860::8888]:1053',
]);
```
Um erro será lançado se um endereço inválido for fornecido.

O método `dns.setServers()` não deve ser chamado enquanto uma consulta DNS estiver em andamento.

O método [`dns.setServers()`](/pt/nodejs/api/dns#dnssetserversservers) afeta apenas [`dns.resolve()`](/pt/nodejs/api/dns#dnsresolvehostname-rrtype-callback), `dns.resolve*()` e [`dns.reverse()`](/pt/nodejs/api/dns#dnsreverseip-callback) (e especificamente *não* [`dns.lookup()`](/pt/nodejs/api/dns#dnslookuphostname-options-callback)).

Este método funciona de forma muito semelhante ao [resolve.conf](https://man7.org/linux/man-pages/man5/resolv.conf.5). Ou seja, se a tentativa de resolver com o primeiro servidor fornecido resultar em um erro `NOTFOUND`, o método `resolve()` *não* tentará resolver com os servidores subsequentes fornecidos. Os servidores DNS de fallback só serão usados se os anteriores expirarem ou resultarem em algum outro erro.

## API de promessas DNS {#dns-promises-api}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v15.0.0 | Exposto como `require('dns/promises')`. |
| v11.14.0, v10.17.0 | Esta API não é mais experimental. |
| v10.6.0 | Adicionado em: v10.6.0 |
:::

A API `dns.promises` fornece um conjunto alternativo de métodos DNS assíncronos que retornam objetos `Promise` em vez de usar callbacks. A API é acessível via `require('node:dns').promises` ou `require('node:dns/promises')`.

### Classe: `dnsPromises.Resolver` {#class-dnspromisesresolver}

**Adicionado em: v10.6.0**

Um resolvedor independente para requisições DNS.

Criar um novo resolvedor usa as configurações de servidor padrão. Definir os servidores usados para um resolvedor usando [`resolver.setServers()`](/pt/nodejs/api/dns#dnspromisessetserversservers) não afeta outros resolvedores:

::: code-group
```js [ESM]
import { Resolver } from 'node:dns/promises';
const resolver = new Resolver();
resolver.setServers(['4.4.4.4']);

// Esta requisição usará o servidor em 4.4.4.4, independente das configurações globais.
const addresses = await resolver.resolve4('example.org');
```

```js [CJS]
const { Resolver } = require('node:dns').promises;
const resolver = new Resolver();
resolver.setServers(['4.4.4.4']);

// Esta requisição usará o servidor em 4.4.4.4, independente das configurações globais.
resolver.resolve4('example.org').then((addresses) => {
  // ...
});

// Alternativamente, o mesmo código pode ser escrito usando o estilo async-await.
(async function() {
  const addresses = await resolver.resolve4('example.org');
})();
```
:::

Os seguintes métodos da API `dnsPromises` estão disponíveis:

- [`resolver.getServers()`](/pt/nodejs/api/dns#dnspromisesgetservers)
- [`resolver.resolve()`](/pt/nodejs/api/dns#dnspromisesresolvehostname-rrtype)
- [`resolver.resolve4()`](/pt/nodejs/api/dns#dnspromisesresolve4hostname-options)
- [`resolver.resolve6()`](/pt/nodejs/api/dns#dnspromisesresolve6hostname-options)
- [`resolver.resolveAny()`](/pt/nodejs/api/dns#dnspromisesresolveanyhostname)
- [`resolver.resolveCaa()`](/pt/nodejs/api/dns#dnspromisesresolvecaahostname)
- [`resolver.resolveCname()`](/pt/nodejs/api/dns#dnspromisesresolvecnamehostname)
- [`resolver.resolveMx()`](/pt/nodejs/api/dns#dnspromisesresolvemxhostname)
- [`resolver.resolveNaptr()`](/pt/nodejs/api/dns#dnspromisesresolvenaptrhostname)
- [`resolver.resolveNs()`](/pt/nodejs/api/dns#dnspromisesresolvenshostname)
- [`resolver.resolvePtr()`](/pt/nodejs/api/dns#dnspromisesresolveptrhostname)
- [`resolver.resolveSoa()`](/pt/nodejs/api/dns#dnspromisesresolvesoahostname)
- [`resolver.resolveSrv()`](/pt/nodejs/api/dns#dnspromisesresolvesrvhostname)
- [`resolver.resolveTxt()`](/pt/nodejs/api/dns#dnspromisesresolvetxthostname)
- [`resolver.reverse()`](/pt/nodejs/api/dns#dnspromisesreverseip)
- [`resolver.setServers()`](/pt/nodejs/api/dns#dnspromisessetserversservers)


### `resolver.cancel()` {#resolvercancel_1}

**Adicionado em: v15.3.0, v14.17.0**

Cancela todas as consultas de DNS pendentes feitas por este resolvedor. As promessas correspondentes serão rejeitadas com um erro com o código `ECANCELLED`.

### `dnsPromises.getServers()` {#dnspromisesgetservers}

**Adicionado em: v10.6.0**

- Retorna: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retorna um array de strings de endereço IP, formatadas de acordo com [RFC 5952](https://tools.ietf.org/html/rfc5952#section-6), que estão atualmente configuradas para resolução de DNS. Uma string incluirá uma seção de porta se uma porta personalizada for usada.

```js [ESM]
[
  '8.8.8.8',
  '2001:4860:4860::8888',
  '8.8.8.8:1053',
  '[2001:4860:4860::8888]:1053',
]
```
### `dnsPromises.lookup(hostname[, options])` {#dnspromiseslookuphostname-options}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v22.1.0, v20.13.0 | A opção `verbatim` agora está obsoleta em favor da nova opção `order`. |
| v10.6.0 | Adicionado em: v10.6.0 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `family` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) A família de registro. Deve ser `4`, `6` ou `0`. O valor `0` indica que um endereço IPv4 ou IPv6 é retornado. Se o valor `0` for usado com `{ all: true }` (veja abaixo), um ou ambos os endereços IPv4 e IPv6 serão retornados, dependendo do resolvedor de DNS do sistema. **Padrão:** `0`.
    - `hints` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Uma ou mais [flags `getaddrinfo` suportadas](/pt/nodejs/api/dns#supported-getaddrinfo-flags). Várias flags podem ser passadas por `OR` bit a bit de seus valores.
    - `all` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, a `Promise` é resolvida com todos os endereços em um array. Caso contrário, retorna um único endereço. **Padrão:** `false`.
    - `order` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Quando `verbatim`, a `Promise` é resolvida com endereços IPv4 e IPv6 na ordem em que o resolvedor de DNS os retornou. Quando `ipv4first`, os endereços IPv4 são colocados antes dos endereços IPv6. Quando `ipv6first`, os endereços IPv6 são colocados antes dos endereços IPv4. **Padrão:** `verbatim` (os endereços não são reordenados). O valor padrão é configurável usando [`dns.setDefaultResultOrder()`](/pt/nodejs/api/dns#dnssetdefaultresultorderorder) ou [`--dns-result-order`](/pt/nodejs/api/cli#--dns-result-orderorder). O novo código deve usar `{ order: 'verbatim' }`.
    - `verbatim` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, a `Promise` é resolvida com endereços IPv4 e IPv6 na ordem em que o resolvedor de DNS os retornou. Quando `false`, os endereços IPv4 são colocados antes dos endereços IPv6. Esta opção será descontinuada em favor de `order`. Quando ambos forem especificados, `order` tem maior precedência. O novo código deve usar apenas `order`. **Padrão:** atualmente `false` (os endereços são reordenados), mas espera-se que isso mude em um futuro não muito distante. O valor padrão é configurável usando [`dns.setDefaultResultOrder()`](/pt/nodejs/api/dns#dnssetdefaultresultorderorder) ou [`--dns-result-order`](/pt/nodejs/api/cli#--dns-result-orderorder).
  
 

Resolve um nome de host (por exemplo, `'nodejs.org'`) para o primeiro registro A (IPv4) ou AAAA (IPv6) encontrado. Todas as propriedades `option` são opcionais. Se `options` for um inteiro, então deve ser `4` ou `6` – se `options` não for fornecido, então endereços IPv4 ou IPv6, ou ambos, são retornados se encontrados.

Com a opção `all` definida como `true`, a `Promise` é resolvida com `addresses` sendo um array de objetos com as propriedades `address` e `family`.

Em caso de erro, a `Promise` é rejeitada com um objeto [`Error`](/pt/nodejs/api/errors#class-error), onde `err.code` é o código de erro. Tenha em mente que `err.code` será definido como `'ENOTFOUND'` não apenas quando o nome do host não existir, mas também quando a pesquisa falhar de outras maneiras, como nenhum descritor de arquivo disponível.

[`dnsPromises.lookup()`](/pt/nodejs/api/dns#dnspromiseslookuphostname-options) não tem necessariamente nada a ver com o protocolo DNS. A implementação usa um recurso do sistema operacional que pode associar nomes a endereços e vice-versa. Esta implementação pode ter consequências sutis, mas importantes, no comportamento de qualquer programa Node.js. Por favor, dedique algum tempo para consultar a [seção de considerações de implementação](/pt/nodejs/api/dns#implementation-considerations) antes de usar `dnsPromises.lookup()`.

Exemplo de uso:



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

**Adicionado em: v10.6.0**

- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Resolve o `address` e a `port` fornecidos em um nome de host e serviço usando a implementação `getnameinfo` subjacente do sistema operacional.

Se `address` não for um endereço IP válido, um `TypeError` será lançado. O `port` será forçado a um número. Se não for uma porta legal, um `TypeError` será lançado.

Em caso de erro, a `Promise` é rejeitada com um objeto [`Error`](/pt/nodejs/api/errors#class-error), onde `err.code` é o código de erro.

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

**Adicionado em: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome do host a ser resolvido.
- `rrtype` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Tipo de registro de recurso. **Padrão:** `'A'`.

Usa o protocolo DNS para resolver um nome de host (por exemplo, `'nodejs.org'`) em um array dos registros de recursos. Quando bem-sucedida, a `Promise` é resolvida com um array de registros de recursos. O tipo e a estrutura dos resultados individuais variam com base em `rrtype`:

| `rrtype` | `records` contém | Tipo de resultado | Método abreviado |
| --- | --- | --- | --- |
| `'A'` | Endereços IPv4 (padrão) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dnsPromises.resolve4()`](/pt/nodejs/api/dns#dnspromisesresolve4hostname-options) |
| `'AAAA'` | Endereços IPv6 | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dnsPromises.resolve6()`](/pt/nodejs/api/dns#dnspromisesresolve6hostname-options) |
| `'ANY'` | Quaisquer registros | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dnsPromises.resolveAny()`](/pt/nodejs/api/dns#dnspromisesresolveanyhostname) |
| `'CAA'` | Registros de autorização de CA | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dnsPromises.resolveCaa()`](/pt/nodejs/api/dns#dnspromisesresolvecaahostname) |
| `'CNAME'` | Registros de nome canônico | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dnsPromises.resolveCname()`](/pt/nodejs/api/dns#dnspromisesresolvecnamehostname) |
| `'MX'` | Registros de troca de e-mail | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dnsPromises.resolveMx()`](/pt/nodejs/api/dns#dnspromisesresolvemxhostname) |
| `'NAPTR'` | Registros de ponteiro de autoridade de nome | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dnsPromises.resolveNaptr()`](/pt/nodejs/api/dns#dnspromisesresolvenaptrhostname) |
| `'NS'` | Registros de servidor de nomes | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dnsPromises.resolveNs()`](/pt/nodejs/api/dns#dnspromisesresolvenshostname) |
| `'PTR'` | Registros de ponteiro | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dnsPromises.resolvePtr()`](/pt/nodejs/api/dns#dnspromisesresolveptrhostname) |
| `'SOA'` | Registros de início de autoridade | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dnsPromises.resolveSoa()`](/pt/nodejs/api/dns#dnspromisesresolvesoahostname) |
| `'SRV'` | Registros de serviço | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dnsPromises.resolveSrv()`](/pt/nodejs/api/dns#dnspromisesresolvesrvhostname) |
| `'TXT'` | Registros de texto | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dnsPromises.resolveTxt()`](/pt/nodejs/api/dns#dnspromisesresolvetxthostname) |

Em caso de erro, a `Promise` é rejeitada com um objeto [`Error`](/pt/nodejs/api/errors#class-error), onde `err.code` é um dos [códigos de erro DNS](/pt/nodejs/api/dns#error-codes).


### `dnsPromises.resolve4(hostname[, options])` {#dnspromisesresolve4hostname-options}

**Adicionado em: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome do host a ser resolvido.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ttl` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Recupera o valor Time-To-Live (TTL) de cada registro. Quando `true`, a `Promise` é resolvida com um array de objetos `{ address: '1.2.3.4', ttl: 60 }` em vez de um array de strings, com o TTL expresso em segundos.

Usa o protocolo DNS para resolver endereços IPv4 (registros `A`) para o `hostname`. Em caso de sucesso, a `Promise` é resolvida com um array de endereços IPv4 (por exemplo, `['74.125.79.104', '74.125.79.105', '74.125.79.106']`).

### `dnsPromises.resolve6(hostname[, options])` {#dnspromisesresolve6hostname-options}

**Adicionado em: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome do host a ser resolvido.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ttl` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Recupera o valor Time-To-Live (TTL) de cada registro. Quando `true`, a `Promise` é resolvida com um array de objetos `{ address: '0:1:2:3:4:5:6:7', ttl: 60 }` em vez de um array de strings, com o TTL expresso em segundos.

Usa o protocolo DNS para resolver endereços IPv6 (registros `AAAA`) para o `hostname`. Em caso de sucesso, a `Promise` é resolvida com um array de endereços IPv6.

### `dnsPromises.resolveAny(hostname)` {#dnspromisesresolveanyhostname}

**Adicionado em: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Usa o protocolo DNS para resolver todos os registros (também conhecido como consulta `ANY` ou `*`). Em caso de sucesso, a `Promise` é resolvida com um array contendo vários tipos de registros. Cada objeto tem uma propriedade `type` que indica o tipo do registro atual. E dependendo do `type`, propriedades adicionais estarão presentes no objeto:

| Tipo | Propriedades |
| --- | --- |
| `'A'` | `address`  /  `ttl` |
| `'AAAA'` | `address`  /  `ttl` |
| `'CNAME'` | `value` |
| `'MX'` | Consulte [`dnsPromises.resolveMx()`](/pt/nodejs/api/dns#dnspromisesresolvemxhostname) |
| `'NAPTR'` | Consulte [`dnsPromises.resolveNaptr()`](/pt/nodejs/api/dns#dnspromisesresolvenaptrhostname) |
| `'NS'` | `value` |
| `'PTR'` | `value` |
| `'SOA'` | Consulte [`dnsPromises.resolveSoa()`](/pt/nodejs/api/dns#dnspromisesresolvesoahostname) |
| `'SRV'` | Consulte [`dnsPromises.resolveSrv()`](/pt/nodejs/api/dns#dnspromisesresolvesrvhostname) |
| `'TXT'` | Este tipo de registro contém uma propriedade de array chamada `entries` que se refere a [`dnsPromises.resolveTxt()`](/pt/nodejs/api/dns#dnspromisesresolvetxthostname), por exemplo, `{ entries: ['...'], type: 'TXT' }` |

Aqui está um exemplo do objeto de resultado:

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

**Adicionado em: v15.0.0, v14.17.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Usa o protocolo DNS para resolver registros `CAA` para o `hostname`. Em caso de sucesso, a `Promise` é resolvida com um array de objetos contendo registros de autorização de autoridade de certificação disponíveis para o `hostname` (por exemplo, `[{critical: 0, iodef: 'mailto:pki@example.com'},{critical: 128, issue: 'pki.example.com'}]`).

### `dnsPromises.resolveCname(hostname)` {#dnspromisesresolvecnamehostname}

**Adicionado em: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Usa o protocolo DNS para resolver registros `CNAME` para o `hostname`. Em caso de sucesso, a `Promise` é resolvida com um array de registros de nome canônico disponíveis para o `hostname` (por exemplo, `['bar.example.com']`).

### `dnsPromises.resolveMx(hostname)` {#dnspromisesresolvemxhostname}

**Adicionado em: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Usa o protocolo DNS para resolver registros de troca de e-mail (registros `MX`) para o `hostname`. Em caso de sucesso, a `Promise` é resolvida com um array de objetos contendo as propriedades `priority` e `exchange` (por exemplo, `[{priority: 10, exchange: 'mx.example.com'}, ...]`).

### `dnsPromises.resolveNaptr(hostname)` {#dnspromisesresolvenaptrhostname}

**Adicionado em: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Usa o protocolo DNS para resolver registros baseados em expressões regulares (registros `NAPTR`) para o `hostname`. Em caso de sucesso, a `Promise` é resolvida com um array de objetos com as seguintes propriedades:

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

**Adicionado em: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Usa o protocolo DNS para resolver registros de servidor de nomes (registros `NS`) para o `hostname`. Em caso de sucesso, a `Promise` é resolvida com um array de registros de servidor de nomes disponíveis para `hostname` (por exemplo, `['ns1.example.com', 'ns2.example.com']`).


### `dnsPromises.resolvePtr(hostname)` {#dnspromisesresolveptrhostname}

**Adicionado em: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Utiliza o protocolo DNS para resolver registros de ponteiro (registros `PTR`) para o `hostname`. Em caso de sucesso, a `Promise` é resolvida com um array de strings contendo os registros de resposta.

### `dnsPromises.resolveSoa(hostname)` {#dnspromisesresolvesoahostname}

**Adicionado em: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Utiliza o protocolo DNS para resolver um registro de início de autoridade (registro `SOA`) para o `hostname`. Em caso de sucesso, a `Promise` é resolvida com um objeto com as seguintes propriedades:

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

**Adicionado em: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Utiliza o protocolo DNS para resolver registros de serviço (registros `SRV`) para o `hostname`. Em caso de sucesso, a `Promise` é resolvida com um array de objetos com as seguintes propriedades:

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

**Adicionado em: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Utiliza o protocolo DNS para resolver consultas de texto (registros `TXT`) para o `hostname`. Em caso de sucesso, a `Promise` é resolvida com um array bidimensional dos registros de texto disponíveis para `hostname` (ex: `[ ['v=spf1 ip4:0.0.0.0 ', '~all' ] ]`). Cada sub-array contém partes TXT de um registro. Dependendo do caso de uso, estes podem ser unidos ou tratados separadamente.


### `dnsPromises.reverse(ip)` {#dnspromisesreverseip}

**Adicionado em: v10.6.0**

- `ip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Realiza uma consulta DNS reversa que resolve um endereço IPv4 ou IPv6 para um array de nomes de host.

Em caso de erro, a `Promise` é rejeitada com um objeto [`Error`](/pt/nodejs/api/errors#class-error), onde `err.code` é um dos [códigos de erro DNS](/pt/nodejs/api/dns#error-codes).

### `dnsPromises.setDefaultResultOrder(order)` {#dnspromisessetdefaultresultorderorder}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v22.1.0, v20.13.0 | O valor `ipv6first` agora é suportado. |
| v17.0.0 | Valor padrão alterado para `verbatim`. |
| v16.4.0, v14.18.0 | Adicionado em: v16.4.0, v14.18.0 |
:::

- `order` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) deve ser `'ipv4first'`, `'ipv6first'` ou `'verbatim'`.

Define o valor padrão de `order` em [`dns.lookup()`](/pt/nodejs/api/dns#dnslookuphostname-options-callback) e [`dnsPromises.lookup()`](/pt/nodejs/api/dns#dnspromiseslookuphostname-options). O valor pode ser:

- `ipv4first`: define o `order` padrão como `ipv4first`.
- `ipv6first`: define o `order` padrão como `ipv6first`.
- `verbatim`: define o `order` padrão como `verbatim`.

O padrão é `verbatim` e [`dnsPromises.setDefaultResultOrder()`](/pt/nodejs/api/dns#dnspromisessetdefaultresultorderorder) tem maior prioridade do que [`--dns-result-order`](/pt/nodejs/api/cli#--dns-result-orderorder). Ao usar [threads de worker](/pt/nodejs/api/worker_threads), [`dnsPromises.setDefaultResultOrder()`](/pt/nodejs/api/dns#dnspromisessetdefaultresultorderorder) da thread principal não afetará as ordens DNS padrão nos workers.

### `dnsPromises.getDefaultResultOrder()` {#dnspromisesgetdefaultresultorder}

**Adicionado em: v20.1.0, v18.17.0**

Obtém o valor de `dnsOrder`.

### `dnsPromises.setServers(servers)` {#dnspromisessetserversservers}

**Adicionado em: v10.6.0**

- `servers` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) array de endereços formatados [RFC 5952](https://tools.ietf.org/html/rfc5952#section-6)

Define o endereço IP e a porta dos servidores a serem usados ao realizar a resolução DNS. O argumento `servers` é um array de endereços formatados [RFC 5952](https://tools.ietf.org/html/rfc5952#section-6). Se a porta for a porta DNS padrão da IANA (53), ela pode ser omitida.

```js [ESM]
dnsPromises.setServers([
  '8.8.8.8',
  '[2001:4860:4860::8888]',
  '8.8.8.8:1053',
  '[2001:4860:4860::8888]:1053',
]);
```
Um erro será lançado se um endereço inválido for fornecido.

O método `dnsPromises.setServers()` não deve ser chamado enquanto uma consulta DNS estiver em andamento.

Este método funciona de forma muito semelhante ao [resolve.conf](https://man7.org/linux/man-pages/man5/resolv.conf.5). Ou seja, se tentar resolver com o primeiro servidor fornecido resultar em um erro `NOTFOUND`, o método `resolve()` *não* tentará resolver com os servidores subsequentes fornecidos. Os servidores DNS de fallback só serão usados se os anteriores expirarem ou resultarem em algum outro erro.


## Códigos de erro {#error-codes}

Cada consulta DNS pode retornar um dos seguintes códigos de erro:

- `dns.NODATA`: O servidor DNS retornou uma resposta sem dados.
- `dns.FORMERR`: O servidor DNS afirma que a consulta foi formatada incorretamente.
- `dns.SERVFAIL`: O servidor DNS retornou uma falha geral.
- `dns.NOTFOUND`: Nome de domínio não encontrado.
- `dns.NOTIMP`: O servidor DNS não implementa a operação solicitada.
- `dns.REFUSED`: O servidor DNS recusou a consulta.
- `dns.BADQUERY`: Consulta DNS formatada incorretamente.
- `dns.BADNAME`: Nome de host formatado incorretamente.
- `dns.BADFAMILY`: Família de endereços não suportada.
- `dns.BADRESP`: Resposta DNS formatada incorretamente.
- `dns.CONNREFUSED`: Não foi possível contactar os servidores DNS.
- `dns.TIMEOUT`: Tempo limite ao contactar os servidores DNS.
- `dns.EOF`: Fim do arquivo.
- `dns.FILE`: Erro ao ler o arquivo.
- `dns.NOMEM`: Sem memória.
- `dns.DESTRUCTION`: O canal está sendo destruído.
- `dns.BADSTR`: String formatada incorretamente.
- `dns.BADFLAGS`: Flags ilegais especificadas.
- `dns.NONAME`: O nome de host fornecido não é numérico.
- `dns.BADHINTS`: Flags de dicas ilegais especificadas.
- `dns.NOTINITIALIZED`: A inicialização da biblioteca c-ares ainda não foi realizada.
- `dns.LOADIPHLPAPI`: Erro ao carregar `iphlpapi.dll`.
- `dns.ADDRGETNETWORKPARAMS`: Não foi possível encontrar a função `GetNetworkParams`.
- `dns.CANCELLED`: Consulta DNS cancelada.

A API `dnsPromises` também exporta os códigos de erro acima, por exemplo, `dnsPromises.NODATA`.

## Considerações sobre a implementação {#implementation-considerations}

Embora [`dns.lookup()`](/pt/nodejs/api/dns#dnslookuphostname-options-callback) e as várias funções `dns.resolve*()/dns.reverse()` tenham o mesmo objetivo de associar um nome de rede a um endereço de rede (ou vice-versa), seu comportamento é bem diferente. Essas diferenças podem ter consequências sutis, mas significativas, no comportamento dos programas Node.js.

### `dns.lookup()` {#dnslookup}

Internamente, [`dns.lookup()`](/pt/nodejs/api/dns#dnslookuphostname-options-callback) usa as mesmas facilidades do sistema operacional que a maioria dos outros programas. Por exemplo, [`dns.lookup()`](/pt/nodejs/api/dns#dnslookuphostname-options-callback) quase sempre resolverá um determinado nome da mesma forma que o comando `ping`. Na maioria dos sistemas operacionais do tipo POSIX, o comportamento da função [`dns.lookup()`](/pt/nodejs/api/dns#dnslookuphostname-options-callback) pode ser modificado alterando as configurações em [`nsswitch.conf(5)`](http://man7.org/linux/man-pages/man5/nsswitch.conf.5) e/ou [`resolv.conf(5)`](http://man7.org/linux/man-pages/man5/resolv.conf.5), mas alterar esses arquivos mudará o comportamento de todos os outros programas em execução no mesmo sistema operacional.

Embora a chamada para `dns.lookup()` seja assíncrona da perspectiva do JavaScript, ela é implementada como uma chamada síncrona para [`getaddrinfo(3)`](http://man7.org/linux/man-pages/man3/getaddrinfo.3) que é executada no threadpool do libuv. Isso pode ter implicações negativas surpreendentes no desempenho de algumas aplicações, consulte a documentação [`UV_THREADPOOL_SIZE`](/pt/nodejs/api/cli#uv_threadpool_sizesize) para obter mais informações.

Várias APIs de rede chamarão `dns.lookup()` internamente para resolver nomes de host. Se isso for um problema, considere resolver o nome do host para um endereço usando `dns.resolve()` e usar o endereço em vez de um nome de host. Além disso, algumas APIs de rede (como [`socket.connect()`](/pt/nodejs/api/net#socketconnectoptions-connectlistener) e [`dgram.createSocket()`](/pt/nodejs/api/dgram#dgramcreatesocketoptions-callback)) permitem que o resolvedor padrão, `dns.lookup()`, seja substituído.


### `dns.resolve()`, `dns.resolve*()`, e `dns.reverse()` {#dnsresolve-dnsresolve*-and-dnsreverse}

Essas funções são implementadas de forma bem diferente de [`dns.lookup()`](/pt/nodejs/api/dns#dnslookuphostname-options-callback). Elas não usam [`getaddrinfo(3)`](http://man7.org/linux/man-pages/man3/getaddrinfo.3) e *sempre* realizam uma consulta DNS na rede. Essa comunicação de rede é sempre feita de forma assíncrona e não usa o pool de threads do libuv.

Como resultado, essas funções não podem ter o mesmo impacto negativo em outros processamentos que acontecem no pool de threads do libuv que [`dns.lookup()`](/pt/nodejs/api/dns#dnslookuphostname-options-callback) pode ter.

Elas não usam o mesmo conjunto de arquivos de configuração que [`dns.lookup()`](/pt/nodejs/api/dns#dnslookuphostname-options-callback) usa. Por exemplo, elas não usam a configuração de `/etc/hosts`.

