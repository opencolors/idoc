---
title: Node.js 문서 - DNS
description: 이 Node.js 문서 섹션에서는 비동기 네트워크 이름 해석 기능을 제공하는 DNS(도메인 네임 시스템) 모듈에 대해 다룹니다. 도메인 이름을 IP 주소로 해석하는 방법, 역방향 조회 및 DNS 레코드 쿼리를 포함합니다.
head:
  - - meta
    - name: og:title
      content: Node.js 문서 - DNS | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 이 Node.js 문서 섹션에서는 비동기 네트워크 이름 해석 기능을 제공하는 DNS(도메인 네임 시스템) 모듈에 대해 다룹니다. 도메인 이름을 IP 주소로 해석하는 방법, 역방향 조회 및 DNS 레코드 쿼리를 포함합니다.
  - - meta
    - name: twitter:title
      content: Node.js 문서 - DNS | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 이 Node.js 문서 섹션에서는 비동기 네트워크 이름 해석 기능을 제공하는 DNS(도메인 네임 시스템) 모듈에 대해 다룹니다. 도메인 이름을 IP 주소로 해석하는 방법, 역방향 조회 및 DNS 레코드 쿼리를 포함합니다.
---


# DNS {#dns}

::: tip [안정성: 2 - 안정됨]
[안정성: 2](/ko/nodejs/api/documentation#stability-index) [안정성: 2](/ko/nodejs/api/documentation#stability-index) - 안정됨
:::

**소스 코드:** [lib/dns.js](https://github.com/nodejs/node/blob/v23.5.0/lib/dns.js)

`node:dns` 모듈은 이름 분석을 가능하게 합니다. 예를 들어, 호스트 이름의 IP 주소를 조회하는 데 사용할 수 있습니다.

[도메인 이름 시스템 (DNS)](https://en.wikipedia.org/wiki/Domain_Name_System)의 이름을 따왔지만, 조회에 항상 DNS 프로토콜을 사용하는 것은 아닙니다. [`dns.lookup()`](/ko/nodejs/api/dns#dnslookuphostname-options-callback)은 운영 체제 기능을 사용하여 이름 분석을 수행합니다. 네트워크 통신을 수행할 필요가 없을 수도 있습니다. 동일한 시스템의 다른 응용 프로그램과 같은 방식으로 이름 분석을 수행하려면 [`dns.lookup()`](/ko/nodejs/api/dns#dnslookuphostname-options-callback)을 사용하십시오.

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

`node:dns` 모듈의 다른 모든 함수는 실제 DNS 서버에 연결하여 이름 분석을 수행합니다. 항상 네트워크를 사용하여 DNS 쿼리를 수행합니다. 이러한 함수는 [`dns.lookup()`](/ko/nodejs/api/dns#dnslookuphostname-options-callback) (예: `/etc/hosts`)에서 사용하는 것과 동일한 구성 파일 세트를 사용하지 않습니다. 다른 이름 분석 기능을 우회하여 항상 DNS 쿼리를 수행하려면 이러한 함수를 사용하십시오.

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

자세한 내용은 [구현 고려 사항 섹션](/ko/nodejs/api/dns#implementation-considerations)을 참조하십시오.


## 클래스: `dns.Resolver` {#class-dnsresolver}

**추가된 버전: v8.3.0**

DNS 요청을 위한 독립적인 리졸버입니다.

새로운 리졸버를 생성하면 기본 서버 설정이 사용됩니다. [`resolver.setServers()`](/ko/nodejs/api/dns#dnssetserversservers)를 사용하여 리졸버에 사용되는 서버를 설정해도 다른 리졸버에는 영향을 주지 않습니다.

::: code-group
```js [ESM]
import { Resolver } from 'node:dns';
const resolver = new Resolver();
resolver.setServers(['4.4.4.4']);

// 이 요청은 전역 설정과 독립적으로 4.4.4.4의 서버를 사용합니다.
resolver.resolve4('example.org', (err, addresses) => {
  // ...
});
```

```js [CJS]
const { Resolver } = require('node:dns');
const resolver = new Resolver();
resolver.setServers(['4.4.4.4']);

// 이 요청은 전역 설정과 독립적으로 4.4.4.4의 서버를 사용합니다.
resolver.resolve4('example.org', (err, addresses) => {
  // ...
});
```
:::

`node:dns` 모듈의 다음 메서드를 사용할 수 있습니다.

- [`resolver.getServers()`](/ko/nodejs/api/dns#dnsgetservers)
- [`resolver.resolve()`](/ko/nodejs/api/dns#dnsresolvehostname-rrtype-callback)
- [`resolver.resolve4()`](/ko/nodejs/api/dns#dnsresolve4hostname-options-callback)
- [`resolver.resolve6()`](/ko/nodejs/api/dns#dnsresolve6hostname-options-callback)
- [`resolver.resolveAny()`](/ko/nodejs/api/dns#dnsresolveanyhostname-callback)
- [`resolver.resolveCaa()`](/ko/nodejs/api/dns#dnsresolvecaahostname-callback)
- [`resolver.resolveCname()`](/ko/nodejs/api/dns#dnsresolvecnamehostname-callback)
- [`resolver.resolveMx()`](/ko/nodejs/api/dns#dnsresolvemxhostname-callback)
- [`resolver.resolveNaptr()`](/ko/nodejs/api/dns#dnsresolvenaptrhostname-callback)
- [`resolver.resolveNs()`](/ko/nodejs/api/dns#dnsresolvenshostname-callback)
- [`resolver.resolvePtr()`](/ko/nodejs/api/dns#dnsresolveptrhostname-callback)
- [`resolver.resolveSoa()`](/ko/nodejs/api/dns#dnsresolvesoahostname-callback)
- [`resolver.resolveSrv()`](/ko/nodejs/api/dns#dnsresolvesrvhostname-callback)
- [`resolver.resolveTxt()`](/ko/nodejs/api/dns#dnsresolvetxthostname-callback)
- [`resolver.reverse()`](/ko/nodejs/api/dns#dnsreverseip-callback)
- [`resolver.setServers()`](/ko/nodejs/api/dns#dnssetserversservers)

### `Resolver([options])` {#resolveroptions}

::: info [히스토리]
| 버전 | 변경 사항 |
| --- | --- |
| v16.7.0, v14.18.0 | `options` 객체에서 이제 `tries` 옵션을 사용할 수 있습니다. |
| v12.18.3 | 생성자는 이제 `options` 객체를 받습니다. 단일 지원 옵션은 `timeout`입니다. |
| v8.3.0 | 추가된 버전: v8.3.0 |
:::

새로운 리졸버를 생성합니다.

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 쿼리 제한 시간(밀리초)이거나, 기본 제한 시간을 사용하려면 `-1`입니다.
    - `tries` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 리졸버가 포기하기 전에 각 이름 서버에 연결을 시도하는 횟수입니다. **기본값:** `4`


### `resolver.cancel()` {#resolvercancel}

**Added in: v8.3.0**

이 리졸버가 만든 미해결 DNS 쿼리를 모두 취소합니다. 해당하는 콜백은 `ECANCELLED` 코드가 포함된 오류와 함께 호출됩니다.

### `resolver.setLocalAddress([ipv4][, ipv6])` {#resolversetlocaladdressipv4-ipv6}

**Added in: v15.1.0, v14.17.0**

- `ipv4` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) IPv4 주소의 문자열 표현입니다. **기본값:** `'0.0.0.0'`
- `ipv6` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) IPv6 주소의 문자열 표현입니다. **기본값:** `'::0'`

리졸버 인스턴스는 지정된 IP 주소에서 요청을 보냅니다. 이를 통해 프로그램은 멀티홈 시스템에서 사용할 때 아웃바운드 인터페이스를 지정할 수 있습니다.

v4 또는 v6 주소가 지정되지 않으면 기본값으로 설정되고 운영 체제가 로컬 주소를 자동으로 선택합니다.

리졸버는 IPv4 DNS 서버에 요청할 때는 v4 로컬 주소를 사용하고 IPv6 DNS 서버에 요청할 때는 v6 로컬 주소를 사용합니다. 확인 요청의 `rrtype`은 사용되는 로컬 주소에 영향을 미치지 않습니다.

## `dns.getServers()` {#dnsgetservers}

**Added in: v0.11.3**

- 반환: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

현재 DNS 확인에 대해 구성된 IP 주소 문자열의 배열을 반환합니다. 문자열은 [RFC 5952](https://tools.ietf.org/html/rfc5952#section-6)에 따라 형식이 지정됩니다. 사용자 지정 포트가 사용되는 경우 문자열에 포트 섹션이 포함됩니다.

```js [ESM]
[
  '8.8.8.8',
  '2001:4860:4860::8888',
  '8.8.8.8:1053',
  '[2001:4860:4860::8888]:1053',
]
```
## `dns.lookup(hostname[, options], callback)` {#dnslookuphostname-options-callback}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v22.1.0, v20.13.0 | 이제 `verbatim` 옵션은 더 이상 사용되지 않으며 새로운 `order` 옵션이 대신 사용됩니다. |
| v18.4.0 | `node:net`과의 호환성을 위해 옵션 객체를 전달할 때 `family` 옵션은 문자열 `'IPv4'` 또는 문자열 `'IPv6'`일 수 있습니다. |
| v18.0.0 | 유효하지 않은 콜백을 `callback` 인수에 전달하면 이제 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v17.0.0 | 이제 `verbatim` 옵션은 기본적으로 `true`입니다. |
| v8.5.0 | 이제 `verbatim` 옵션이 지원됩니다. |
| v1.2.0 | 이제 `all` 옵션이 지원됩니다. |
| v0.1.90 | Added in: v0.1.90 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `family` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 레코드 패밀리. `4`, `6` 또는 `0`이어야 합니다. 이전 버전과의 호환성을 위해 `'IPv4'` 및 `'IPv6'`는 각각 `4` 및 `6`으로 해석됩니다. 값 `0`은 IPv4 또는 IPv6 주소가 반환됨을 나타냅니다. 값 `0`이 `{ all: true }`와 함께 사용되는 경우(아래 참조) 시스템의 DNS 확인자에 따라 IPv4 및 IPv6 주소 중 하나 또는 둘 다 반환됩니다. **기본값:** `0`.
    - `hints` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 하나 이상의 [지원되는 `getaddrinfo` 플래그](/ko/nodejs/api/dns#supported-getaddrinfo-flags). 비트 단위 `OR`로 값을 결합하여 여러 플래그를 전달할 수 있습니다.
    - `all` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`이면 콜백은 확인된 모든 주소를 배열로 반환합니다. 그렇지 않으면 단일 주소를 반환합니다. **기본값:** `false`.
    - `order` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `verbatim`인 경우 확인된 주소는 정렬되지 않고 반환됩니다. `ipv4first`인 경우 확인된 주소는 IPv4 주소를 IPv6 주소 앞에 배치하여 정렬됩니다. `ipv6first`인 경우 확인된 주소는 IPv6 주소를 IPv4 주소 앞에 배치하여 정렬됩니다. **기본값:** `verbatim` (주소가 재정렬되지 않음). 기본값은 [`dns.setDefaultResultOrder()`](/ko/nodejs/api/dns#dnssetdefaultresultorderorder) 또는 [`--dns-result-order`](/ko/nodejs/api/cli#--dns-result-orderorder)를 사용하여 구성할 수 있습니다.
    - `verbatim` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`이면 콜백은 DNS 확인자가 반환한 순서대로 IPv4 및 IPv6 주소를 받습니다. `false`이면 IPv4 주소가 IPv6 주소 앞에 배치됩니다. 이 옵션은 더 이상 사용되지 않으며 `order`가 대신 사용됩니다. 둘 다 지정되면 `order`가 우선 순위가 더 높습니다. 새 코드는 `order`만 사용해야 합니다. **기본값:** `true` (주소가 재정렬되지 않음). 기본값은 [`dns.setDefaultResultOrder()`](/ko/nodejs/api/dns#dnssetdefaultresultorderorder) 또는 [`--dns-result-order`](/ko/nodejs/api/cli#--dns-result-orderorder)를 사용하여 구성할 수 있습니다.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) IPv4 또는 IPv6 주소의 문자열 표현입니다.
    - `family` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `address`의 패밀리를 나타내는 `4` 또는 `6` 또는 주소가 IPv4 또는 IPv6 주소가 아닌 경우 `0`입니다. `0`은 운영 체제에서 사용하는 이름 확인 서비스에 버그가 있을 가능성이 있음을 나타냅니다.
  
 

호스트 이름(예: `'nodejs.org'`)을 처음 발견된 A(IPv4) 또는 AAAA(IPv6) 레코드로 확인합니다. 모든 `option` 속성은 선택 사항입니다. `options`가 정수이면 `4` 또는 `6`이어야 합니다. `options`가 제공되지 않으면 IPv4 또는 IPv6 주소 또는 둘 다 발견되면 반환됩니다.

`all` 옵션이 `true`로 설정되면 `callback`에 대한 인수는 `(err, addresses)`로 변경되고 `addresses`는 속성 `address` 및 `family`가 있는 객체의 배열입니다.

오류가 발생하면 `err`는 [`Error`](/ko/nodejs/api/errors#class-error) 객체이며 `err.code`는 오류 코드입니다. 호스트 이름이 존재하지 않을 때뿐만 아니라 사용 가능한 파일 설명자가 없는 것과 같은 다른 방식으로 조회가 실패할 때도 `err.code`가 `'ENOTFOUND'`로 설정된다는 점에 유의하십시오.

`dns.lookup()`은 반드시 DNS 프로토콜과 관련이 있는 것은 아닙니다. 이 구현은 이름과 주소를 서로 연결할 수 있는 운영 체제 기능을 사용합니다. 이 구현은 모든 Node.js 프로그램의 동작에 미묘하지만 중요한 영향을 미칠 수 있습니다. `dns.lookup()`을 사용하기 전에 [구현 고려 사항 섹션](/ko/nodejs/api/dns#implementation-considerations)을 참조하는 데 시간을 할애하십시오.

사용 예:



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

이 메서드가 [`util.promisify()`](/ko/nodejs/api/util#utilpromisifyoriginal)ed 버전으로 호출되고 `all`이 `true`로 설정되지 않은 경우 `address` 및 `family` 속성이 있는 `Object`에 대한 `Promise`를 반환합니다.


### 지원되는 getaddrinfo 플래그 {#supported-getaddrinfo-flags}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v13.13.0, v12.17.0 | `dns.ALL` 플래그에 대한 지원이 추가되었습니다. |
:::

다음 플래그는 [`dns.lookup()`](/ko/nodejs/api/dns#dnslookuphostname-options-callback)에 힌트로 전달할 수 있습니다.

- `dns.ADDRCONFIG`: 반환되는 주소 유형을 시스템에 구성된 비 루프백 주소의 유형으로 제한합니다. 예를 들어, 현재 시스템에 구성된 IPv4 주소가 하나 이상 있는 경우에만 IPv4 주소가 반환됩니다.
- `dns.V4MAPPED`: IPv6 패밀리가 지정되었지만 IPv6 주소가 발견되지 않은 경우 IPv4 매핑된 IPv6 주소를 반환합니다. 일부 운영 체제(예: FreeBSD 10.1)에서는 지원되지 않습니다.
- `dns.ALL`: `dns.V4MAPPED`가 지정된 경우, IPv4 매핑된 IPv6 주소뿐만 아니라 확인된 IPv6 주소도 반환합니다.

## `dns.lookupService(address, port, callback)` {#dnslookupserviceaddress-port-callback}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 이제 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v0.11.14 | 추가됨: v0.11.14 |
:::

- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 예: `example.com`
    - `service` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 예: `http`

주어진 `address` 및 `port`를 운영 체제의 기본 `getnameinfo` 구현을 사용하여 호스트 이름과 서비스로 확인합니다.

`address`가 유효한 IP 주소가 아니면 `TypeError`가 발생합니다. `port`는 숫자로 강제 변환됩니다. 유효한 포트가 아니면 `TypeError`가 발생합니다.

오류가 발생하면 `err`는 [`Error`](/ko/nodejs/api/errors#class-error) 객체이며, `err.code`는 오류 코드입니다.

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

이 메서드가 [`util.promisify()`](/ko/nodejs/api/util#utilpromisifyoriginal)된 버전으로 호출되면 `hostname` 및 `service` 속성이 있는 `Object`에 대한 `Promise`를 반환합니다.


## `dns.resolve(hostname[, rrtype], callback)` {#dnsresolvehostname-rrtype-callback}

::: info [연혁]
| 버전 | 변경 사항 |
|---|---|
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v0.1.27 | 추가됨: v0.1.27 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 확인할 호스트 이름입니다.
- `rrtype` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 리소스 레코드 유형입니다. **기본값:** `'A'`.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `records` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

DNS 프로토콜을 사용하여 호스트 이름(예: `'nodejs.org'`)을 리소스 레코드의 배열로 확인합니다. `callback` 함수는 `(err, records)` 인수를 가집니다. 성공하면 `records`는 리소스 레코드의 배열이 됩니다. 개별 결과의 유형과 구조는 `rrtype`에 따라 다릅니다.

| `rrtype` | `records`에 포함된 내용 | 결과 유형 | 단축 메서드 |
|---|---|---|---|
| `'A'` | IPv4 주소(기본값) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dns.resolve4()`](/ko/nodejs/api/dns#dnsresolve4hostname-options-callback) |
| `'AAAA'` | IPv6 주소 | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dns.resolve6()`](/ko/nodejs/api/dns#dnsresolve6hostname-options-callback) |
| `'ANY'` | 모든 레코드 | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dns.resolveAny()`](/ko/nodejs/api/dns#dnsresolveanyhostname-callback) |
| `'CAA'` | CA 권한 부여 레코드 | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dns.resolveCaa()`](/ko/nodejs/api/dns#dnsresolvecaahostname-callback) |
| `'CNAME'` | 정식 이름 레코드 | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dns.resolveCname()`](/ko/nodejs/api/dns#dnsresolvecnamehostname-callback) |
| `'MX'` | 메일 교환 레코드 | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dns.resolveMx()`](/ko/nodejs/api/dns#dnsresolvemxhostname-callback) |
| `'NAPTR'` | 이름 권한 포인터 레코드 | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dns.resolveNaptr()`](/ko/nodejs/api/dns#dnsresolvenaptrhostname-callback) |
| `'NS'` | 이름 서버 레코드 | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dns.resolveNs()`](/ko/nodejs/api/dns#dnsresolvenshostname-callback) |
| `'PTR'` | 포인터 레코드 | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dns.resolvePtr()`](/ko/nodejs/api/dns#dnsresolveptrhostname-callback) |
| `'SOA'` | 권한 시작 레코드 | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dns.resolveSoa()`](/ko/nodejs/api/dns#dnsresolvesoahostname-callback) |
| `'SRV'` | 서비스 레코드 | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dns.resolveSrv()`](/ko/nodejs/api/dns#dnsresolvesrvhostname-callback) |
| `'TXT'` | 텍스트 레코드 | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dns.resolveTxt()`](/ko/nodejs/api/dns#dnsresolvetxthostname-callback) |

오류 발생 시 `err`는 [`Error`](/ko/nodejs/api/errors#class-error) 객체이며, `err.code`는 [DNS 오류 코드](/ko/nodejs/api/dns#error-codes) 중 하나입니다.


## `dns.resolve4(hostname[, options], callback)` {#dnsresolve4hostname-options-callback}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | `callback` 인수에 잘못된 콜백을 전달하면 이제 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v7.2.0 | 이 메서드는 이제 `options`, 특히 `options.ttl` 전달을 지원합니다. |
| v0.1.16 | 추가됨: v0.1.16 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 확인할 호스트 이름입니다.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ttl` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 각 레코드의 TTL(Time-To-Live) 값을 검색합니다. `true`이면 콜백은 문자열 배열 대신 TTL이 초 단위로 표현된 `{ address: '1.2.3.4', ttl: 60 }` 객체 배열을 받습니다.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)


DNS 프로토콜을 사용하여 `hostname`에 대한 IPv4 주소(`A` 레코드)를 확인합니다. `callback` 함수에 전달된 `addresses` 인수는 IPv4 주소 배열(예: `['74.125.79.104', '74.125.79.105', '74.125.79.106']`)을 포함합니다.

## `dns.resolve6(hostname[, options], callback)` {#dnsresolve6hostname-options-callback}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | `callback` 인수에 잘못된 콜백을 전달하면 이제 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v7.2.0 | 이 메서드는 이제 `options`, 특히 `options.ttl` 전달을 지원합니다. |
| v0.1.16 | 추가됨: v0.1.16 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 확인할 호스트 이름입니다.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ttl` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 각 레코드의 TTL(Time-To-Live) 값을 검색합니다. `true`이면 콜백은 문자열 배열 대신 TTL이 초 단위로 표현된 `{ address: '0:1:2:3:4:5:6:7', ttl: 60 }` 객체 배열을 받습니다.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)


DNS 프로토콜을 사용하여 `hostname`에 대한 IPv6 주소(`AAAA` 레코드)를 확인합니다. `callback` 함수에 전달된 `addresses` 인수는 IPv6 주소 배열을 포함합니다.


## `dns.resolveAny(hostname, callback)` {#dnsresolveanyhostname-callback}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 이제 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `ret` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  
 

DNS 프로토콜을 사용하여 모든 레코드(`ANY` 또는 `*` 쿼리라고도 함)를 확인합니다. `callback` 함수에 전달된 `ret` 인수는 다양한 유형의 레코드를 포함하는 배열이 됩니다. 각 객체에는 현재 레코드의 유형을 나타내는 `type` 속성이 있습니다. 그리고 `type`에 따라 객체에 추가 속성이 존재합니다.

| 유형 | 속성 |
| --- | --- |
| `'A'` | `address` / `ttl` |
| `'AAAA'` | `address` / `ttl` |
| `'CNAME'` | `value` |
| `'MX'` | [`dns.resolveMx()`](/ko/nodejs/api/dns#dnsresolvemxhostname-callback) 참조 |
| `'NAPTR'` | [`dns.resolveNaptr()`](/ko/nodejs/api/dns#dnsresolvenaptrhostname-callback) 참조 |
| `'NS'` | `value` |
| `'PTR'` | `value` |
| `'SOA'` | [`dns.resolveSoa()`](/ko/nodejs/api/dns#dnsresolvesoahostname-callback) 참조 |
| `'SRV'` | [`dns.resolveSrv()`](/ko/nodejs/api/dns#dnsresolvesrvhostname-callback) 참조 |
| `'TXT'` | 이 레코드 유형에는 [`dns.resolveTxt()`](/ko/nodejs/api/dns#dnsresolvetxthostname-callback)를 참조하는 `entries`라는 배열 속성이 포함되어 있습니다. 예를 들어 `{ entries: ['...'], type: 'TXT' }` |
다음은 콜백에 전달된 `ret` 객체의 예입니다.

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
DNS 서버 운영자는 `ANY` 쿼리에 응답하지 않도록 선택할 수 있습니다. [`dns.resolve4()`](/ko/nodejs/api/dns#dnsresolve4hostname-options-callback), [`dns.resolveMx()`](/ko/nodejs/api/dns#dnsresolvemxhostname-callback) 등과 같은 개별 메서드를 호출하는 것이 좋습니다. 자세한 내용은 [RFC 8482](https://tools.ietf.org/html/rfc8482)를 참조하십시오.


## `dns.resolveCname(hostname, callback)` {#dnsresolvecnamehostname-callback}

::: info [히스토리]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 이제 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v0.3.2 | 추가됨: v0.3.2 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
  
 

DNS 프로토콜을 사용하여 `hostname`에 대한 `CNAME` 레코드를 확인합니다. `callback` 함수에 전달되는 `addresses` 인수는 `hostname`에 사용할 수 있는 정규 이름 레코드의 배열을 포함합니다 (예: `['bar.example.com']`).

## `dns.resolveCaa(hostname, callback)` {#dnsresolvecaahostname-callback}

::: info [히스토리]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 이제 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v15.0.0, v14.17.0 | 추가됨: v15.0.0, v14.17.0 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `records` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  
 

DNS 프로토콜을 사용하여 `hostname`에 대한 `CAA` 레코드를 확인합니다. `callback` 함수에 전달되는 `addresses` 인수는 `hostname`에 사용할 수 있는 인증 기관 권한 부여 레코드의 배열을 포함합니다 (예: `[{critical: 0, iodef: 'mailto:pki@example.com'}, {critical: 128, issue: 'pki.example.com'}]`).


## `dns.resolveMx(hostname, callback)` {#dnsresolvemxhostname-callback}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 이제 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v0.1.27 | 추가된 버전: v0.1.27 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  
 

DNS 프로토콜을 사용하여 `hostname`에 대한 메일 교환 레코드(`MX` 레코드)를 확인합니다. `callback` 함수에 전달되는 `addresses` 인수는 `priority` 및 `exchange` 속성을 모두 포함하는 객체의 배열을 포함합니다(예: `[{priority: 10, exchange: 'mx.example.com'}, ...]`).

## `dns.resolveNaptr(hostname, callback)` {#dnsresolvenaptrhostname-callback}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 이제 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v0.9.12 | 추가된 버전: v0.9.12 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  
 

DNS 프로토콜을 사용하여 `hostname`에 대한 정규식 기반 레코드(`NAPTR` 레코드)를 확인합니다. `callback` 함수에 전달되는 `addresses` 인수는 다음 속성이 있는 객체의 배열을 포함합니다.

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

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 이제 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`을 throw합니다. |
| v0.1.90 | 추가됨: v0.1.90 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`hostname`에 대한 이름 서버 레코드(`NS` 레코드)를 확인하기 위해 DNS 프로토콜을 사용합니다. `callback` 함수에 전달되는 `addresses` 인수는 `hostname`에 사용할 수 있는 이름 서버 레코드 배열(예: `['ns1.example.com', 'ns2.example.com']`)을 포함합니다.

## `dns.resolvePtr(hostname, callback)` {#dnsresolveptrhostname-callback}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 이제 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`을 throw합니다. |
| v6.0.0 | 추가됨: v6.0.0 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`hostname`에 대한 포인터 레코드(`PTR` 레코드)를 확인하기 위해 DNS 프로토콜을 사용합니다. `callback` 함수에 전달되는 `addresses` 인수는 응답 레코드를 포함하는 문자열 배열입니다.

## `dns.resolveSoa(hostname, callback)` {#dnsresolvesoahostname-callback}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 이제 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`을 throw합니다. |
| v0.11.10 | 추가됨: v0.11.10 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `address` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`hostname`에 대한 권한 시작 레코드(`SOA` 레코드)를 확인하기 위해 DNS 프로토콜을 사용합니다. `callback` 함수에 전달되는 `address` 인수는 다음 속성이 있는 객체입니다.

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

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 이제 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v0.1.27 | 추가됨: v0.1.27 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `addresses` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  
 

DNS 프로토콜을 사용하여 `hostname`에 대한 서비스 레코드(`SRV` 레코드)를 확인합니다. `callback` 함수에 전달되는 `addresses` 인수는 다음 속성을 가진 객체 배열입니다.

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

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | `callback` 인수에 유효하지 않은 콜백을 전달하면 이제 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
| v0.1.27 | 추가됨: v0.1.27 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `records` [\<string[][]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
  
 

DNS 프로토콜을 사용하여 `hostname`에 대한 텍스트 쿼리(`TXT` 레코드)를 확인합니다. `callback` 함수에 전달되는 `records` 인수는 `hostname`에 사용 가능한 텍스트 레코드의 2차원 배열입니다(예: `[ ['v=spf1 ip4:0.0.0.0 ', '~all' ] ]`). 각 하위 배열에는 하나의 레코드의 TXT 청크가 포함되어 있습니다. 사용 사례에 따라 함께 결합하거나 개별적으로 취급할 수 있습니다.


## `dns.reverse(ip, callback)` {#dnsreverseip-callback}

**Added in: v0.1.16**

- `ip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `hostnames` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
  
 

IPv4 또는 IPv6 주소를 호스트 이름 배열로 해석하는 역방향 DNS 쿼리를 수행합니다.

오류가 발생하면 `err`는 [`Error`](/ko/nodejs/api/errors#class-error) 객체이며, `err.code`는 [DNS 오류 코드](/ko/nodejs/api/dns#error-codes) 중 하나입니다.

## `dns.setDefaultResultOrder(order)` {#dnssetdefaultresultorderorder}


::: info [History]
| Version | Changes |
| --- | --- |
| v22.1.0, v20.13.0 | `ipv6first` 값이 이제 지원됩니다. |
| v17.0.0 | 기본값을 `verbatim`으로 변경했습니다. |
| v16.4.0, v14.18.0 | Added in: v16.4.0, v14.18.0 |
:::

- `order` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)는 `'ipv4first'`, `'ipv6first'` 또는 `'verbatim'`이어야 합니다.

[`dns.lookup()`](/ko/nodejs/api/dns#dnslookuphostname-options-callback) 및 [`dnsPromises.lookup()`](/ko/nodejs/api/dns#dnspromiseslookuphostname-options)에서 `order`의 기본값을 설정합니다. 값은 다음과 같습니다.

- `ipv4first`: 기본 `order`를 `ipv4first`로 설정합니다.
- `ipv6first`: 기본 `order`를 `ipv6first`로 설정합니다.
- `verbatim`: 기본 `order`를 `verbatim`으로 설정합니다.

기본값은 `verbatim`이며 [`dns.setDefaultResultOrder()`](/ko/nodejs/api/dns#dnssetdefaultresultorderorder)는 [`--dns-result-order`](/ko/nodejs/api/cli#--dns-result-orderorder)보다 우선순위가 높습니다. [워커 스레드](/ko/nodejs/api/worker_threads)를 사용하는 경우 주 스레드의 [`dns.setDefaultResultOrder()`](/ko/nodejs/api/dns#dnssetdefaultresultorderorder)는 워커의 기본 DNS 순서에 영향을 주지 않습니다.

## `dns.getDefaultResultOrder()` {#dnsgetdefaultresultorder}


::: info [History]
| Version | Changes |
| --- | --- |
| v22.1.0, v20.13.0 | `ipv6first` 값이 이제 지원됩니다. |
| v20.1.0, v18.17.0 | Added in: v20.1.0, v18.17.0 |
:::

[`dns.lookup()`](/ko/nodejs/api/dns#dnslookuphostname-options-callback) 및 [`dnsPromises.lookup()`](/ko/nodejs/api/dns#dnspromiseslookuphostname-options)에서 `order`의 기본값을 가져옵니다. 값은 다음과 같습니다.

- `ipv4first`: `order`가 기본적으로 `ipv4first`인 경우.
- `ipv6first`: `order`가 기본적으로 `ipv6first`인 경우.
- `verbatim`: `order`가 기본적으로 `verbatim`인 경우.


## `dns.setServers(servers)` {#dnssetserversservers}

**추가된 버전: v0.11.3**

- `servers` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [RFC 5952](https://tools.ietf.org/html/rfc5952#section-6) 형식의 주소 배열

DNS 확인을 수행할 때 사용할 서버의 IP 주소와 포트를 설정합니다. `servers` 인수는 [RFC 5952](https://tools.ietf.org/html/rfc5952#section-6) 형식의 주소 배열입니다. 포트가 IANA 기본 DNS 포트(53)인 경우 생략할 수 있습니다.

```js [ESM]
dns.setServers([
  '8.8.8.8',
  '[2001:4860:4860::8888]',
  '8.8.8.8:1053',
  '[2001:4860:4860::8888]:1053',
]);
```

유효하지 않은 주소가 제공되면 오류가 발생합니다.

`dns.setServers()` 메서드는 DNS 쿼리가 진행 중인 동안 호출하면 안 됩니다.

[`dns.setServers()`](/ko/nodejs/api/dns#dnssetserversservers) 메서드는 [`dns.resolve()`](/ko/nodejs/api/dns#dnsresolvehostname-rrtype-callback), `dns.resolve*()` 및 [`dns.reverse()`](/ko/nodejs/api/dns#dnsreverseip-callback)에만 영향을 미칩니다(특히 [`dns.lookup()`](/ko/nodejs/api/dns#dnslookuphostname-options-callback)에는 영향을 미치지 않음).

이 메서드는 [resolve.conf](https://man7.org/linux/man-pages/man5/resolv.conf.5)와 매우 유사하게 작동합니다. 즉, 제공된 첫 번째 서버로 확인을 시도한 결과 `NOTFOUND` 오류가 발생하면 `resolve()` 메서드는 제공된 후속 서버로 확인을 시도하지 *않습니다*. 대체 DNS 서버는 이전 서버가 시간 초과되거나 다른 오류가 발생한 경우에만 사용됩니다.

## DNS 프로미스 API {#dns-promises-api}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v15.0.0 | `require('dns/promises')`로 노출됩니다. |
| v11.14.0, v10.17.0 | 이 API는 더 이상 실험적이지 않습니다. |
| v10.6.0 | 추가된 버전: v10.6.0 |
:::

`dns.promises` API는 콜백을 사용하는 대신 `Promise` 객체를 반환하는 대체 비동기 DNS 메서드 세트를 제공합니다. API는 `require('node:dns').promises` 또는 `require('node:dns/promises')`를 통해 액세스할 수 있습니다.

### 클래스: `dnsPromises.Resolver` {#class-dnspromisesresolver}

**추가된 버전: v10.6.0**

DNS 요청을 위한 독립적인 확인자입니다.

새 확인자를 만들면 기본 서버 설정이 사용됩니다. [`resolver.setServers()`](/ko/nodejs/api/dns#dnspromisessetserversservers)를 사용하여 확인자에 사용되는 서버를 설정해도 다른 확인자에는 영향을 미치지 않습니다.

::: code-group
```js [ESM]
import { Resolver } from 'node:dns/promises';
const resolver = new Resolver();
resolver.setServers(['4.4.4.4']);

// 이 요청은 전역 설정과 독립적으로 4.4.4.4의 서버를 사용합니다.
const addresses = await resolver.resolve4('example.org');
```

```js [CJS]
const { Resolver } = require('node:dns').promises;
const resolver = new Resolver();
resolver.setServers(['4.4.4.4']);

// 이 요청은 전역 설정과 독립적으로 4.4.4.4의 서버를 사용합니다.
resolver.resolve4('example.org').then((addresses) => {
  // ...
});

// 또는 동일한 코드를 async-await 스타일로 작성할 수 있습니다.
(async function() {
  const addresses = await resolver.resolve4('example.org');
})();
```
:::

`dnsPromises` API의 다음 메서드를 사용할 수 있습니다.

- [`resolver.getServers()`](/ko/nodejs/api/dns#dnspromisesgetservers)
- [`resolver.resolve()`](/ko/nodejs/api/dns#dnspromisesresolvehostname-rrtype)
- [`resolver.resolve4()`](/ko/nodejs/api/dns#dnspromisesresolve4hostname-options)
- [`resolver.resolve6()`](/ko/nodejs/api/dns#dnspromisesresolve6hostname-options)
- [`resolver.resolveAny()`](/ko/nodejs/api/dns#dnspromisesresolveanyhostname)
- [`resolver.resolveCaa()`](/ko/nodejs/api/dns#dnspromisesresolvecaahostname)
- [`resolver.resolveCname()`](/ko/nodejs/api/dns#dnspromisesresolvecnamehostname)
- [`resolver.resolveMx()`](/ko/nodejs/api/dns#dnspromisesresolvemxhostname)
- [`resolver.resolveNaptr()`](/ko/nodejs/api/dns#dnspromisesresolvenaptrhostname)
- [`resolver.resolveNs()`](/ko/nodejs/api/dns#dnspromisesresolvenshostname)
- [`resolver.resolvePtr()`](/ko/nodejs/api/dns#dnspromisesresolveptrhostname)
- [`resolver.resolveSoa()`](/ko/nodejs/api/dns#dnspromisesresolvesoahostname)
- [`resolver.resolveSrv()`](/ko/nodejs/api/dns#dnspromisesresolvesrvhostname)
- [`resolver.resolveTxt()`](/ko/nodejs/api/dns#dnspromisesresolvetxthostname)
- [`resolver.reverse()`](/ko/nodejs/api/dns#dnspromisesreverseip)
- [`resolver.setServers()`](/ko/nodejs/api/dns#dnspromisessetserversservers)


### `resolver.cancel()` {#resolvercancel_1}

**Added in: v15.3.0, v14.17.0**

이 resolver에 의해 만들어진 모든 미해결 DNS 쿼리를 취소합니다. 해당 Promise는 `ECANCELLED` 코드를 가진 에러로 거부됩니다.

### `dnsPromises.getServers()` {#dnspromisesgetservers}

**Added in: v10.6.0**

- 반환값: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

현재 DNS 분석을 위해 구성된 IP 주소 문자열의 배열을 반환합니다. 문자열은 [RFC 5952](https://tools.ietf.org/html/rfc5952#section-6)에 따라 형식이 지정됩니다. 문자열에는 사용자 지정 포트가 사용되는 경우 포트 섹션이 포함됩니다.

```js [ESM]
[
  '8.8.8.8',
  '2001:4860:4860::8888',
  '8.8.8.8:1053',
  '[2001:4860:4860::8888]:1053',
]
```
### `dnsPromises.lookup(hostname[, options])` {#dnspromiseslookuphostname-options}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v22.1.0, v20.13.0 | `verbatim` 옵션은 이제 새로운 `order` 옵션으로 인해 더 이상 사용되지 않습니다. |
| v10.6.0 | Added in: v10.6.0 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `family` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 레코드 패밀리. `4`, `6` 또는 `0`이어야 합니다. 값 `0`은 IPv4 또는 IPv6 주소가 반환됨을 나타냅니다. 값 `0`이 `{ all: true }`와 함께 사용되는 경우(아래 참조), 시스템의 DNS 분석기에 따라 IPv4 및 IPv6 주소 중 하나 또는 둘 다 반환됩니다. **기본값:** `0`.
    - `hints` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 하나 이상의 [지원되는 `getaddrinfo` 플래그](/ko/nodejs/api/dns#supported-getaddrinfo-flags). 여러 플래그는 값을 비트 단위로 `OR`하여 전달할 수 있습니다.
    - `all` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`이면 `Promise`는 배열의 모든 주소로 확인됩니다. 그렇지 않으면 단일 주소를 반환합니다. **기본값:** `false`.
    - `order` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `verbatim`인 경우, `Promise`는 DNS 분석기가 반환한 순서대로 IPv4 및 IPv6 주소로 확인됩니다. `ipv4first`인 경우 IPv4 주소가 IPv6 주소 앞에 배치됩니다. `ipv6first`인 경우 IPv6 주소가 IPv4 주소 앞에 배치됩니다. **기본값:** `verbatim`(주소가 재정렬되지 않음). 기본값은 [`dns.setDefaultResultOrder()`](/ko/nodejs/api/dns#dnssetdefaultresultorderorder) 또는 [`--dns-result-order`](/ko/nodejs/api/cli#--dns-result-orderorder)를 사용하여 구성할 수 있습니다. 새 코드는 `{ order: 'verbatim' }`을 사용해야 합니다.
    - `verbatim` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`이면 `Promise`는 DNS 분석기가 반환한 순서대로 IPv4 및 IPv6 주소로 확인됩니다. `false`이면 IPv4 주소가 IPv6 주소 앞에 배치됩니다. 이 옵션은 `order`로 인해 더 이상 사용되지 않습니다. 둘 다 지정된 경우 `order`가 더 높은 우선 순위를 갖습니다. 새 코드는 `order`만 사용해야 합니다. **기본값:** 현재 `false`(주소가 재정렬됨)이지만 조만간 변경될 것으로 예상됩니다. 기본값은 [`dns.setDefaultResultOrder()`](/ko/nodejs/api/dns#dnssetdefaultresultorderorder) 또는 [`--dns-result-order`](/ko/nodejs/api/cli#--dns-result-orderorder)를 사용하여 구성할 수 있습니다.
  
 

호스트 이름(예: `'nodejs.org'`)을 처음 발견된 A(IPv4) 또는 AAAA(IPv6) 레코드로 분석합니다. 모든 `option` 속성은 선택 사항입니다. `options`가 정수이면 `4` 또는 `6`이어야 합니다. `options`가 제공되지 않으면 IPv4 또는 IPv6 주소 또는 둘 다 발견되면 반환됩니다.

`all` 옵션이 `true`로 설정되면 `Promise`는 속성 `address` 및 `family`를 가진 객체의 배열인 `addresses`로 확인됩니다.

오류가 발생하면 `Promise`는 [`Error`](/ko/nodejs/api/errors#class-error) 객체로 거부되고, 여기서 `err.code`는 오류 코드입니다. 호스트 이름이 존재하지 않는 경우뿐만 아니라 사용 가능한 파일 설명자가 없는 것과 같은 다른 방식으로 조회가 실패하는 경우에도 `err.code`가 `'ENOTFOUND'`로 설정된다는 점을 명심하십시오.

[`dnsPromises.lookup()`](/ko/nodejs/api/dns#dnspromiseslookuphostname-options)은 반드시 DNS 프로토콜과 관련이 있는 것은 아닙니다. 이 구현은 이름과 주소를 서로 연결할 수 있는 운영 체제 기능을 사용합니다. 이 구현은 모든 Node.js 프로그램의 동작에 미묘하지만 중요한 영향을 미칠 수 있습니다. `dnsPromises.lookup()`을 사용하기 전에 [구현 고려 사항 섹션](/ko/nodejs/api/dns#implementation-considerations)을 참조하십시오.

사용 예시:



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

// options.all이 true이면 결과는 배열이 됩니다.
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

// options.all이 true이면 결과는 배열이 됩니다.
options.all = true;
dnsPromises.lookup('example.org', options).then((result) => {
  console.log('addresses: %j', result);
  // addresses: [{"address":"2606:2800:21f:cb07:6820:80da:af6b:8b2c","family":6}]
});
```
:::


### `dnsPromises.lookupService(address, port)` {#dnspromiseslookupserviceaddress-port}

**Added in: v10.6.0**

- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

주어진 `address`와 `port`를 운영 체제의 기본 `getnameinfo` 구현을 사용하여 호스트 이름과 서비스로 확인합니다.

`address`가 유효한 IP 주소가 아니면 `TypeError`가 발생합니다. `port`는 숫자로 강제 변환됩니다. 유효한 포트가 아니면 `TypeError`가 발생합니다.

오류가 발생하면 `Promise`는 [`Error`](/ko/nodejs/api/errors#class-error) 객체와 함께 거부되며, `err.code`는 오류 코드입니다.

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

**Added in: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 확인할 호스트 이름.
- `rrtype` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 리소스 레코드 타입. **기본값:** `'A'`.

DNS 프로토콜을 사용하여 호스트 이름 (예: `'nodejs.org'`)을 리소스 레코드 배열로 확인합니다. 성공하면 `Promise`는 리소스 레코드 배열로 확인됩니다. 개별 결과의 타입과 구조는 `rrtype`에 따라 다릅니다.

| `rrtype` | `records` 포함 | 결과 타입 | 단축 메서드 |
| --- | --- | --- | --- |
| `'A'` | IPv4 주소 (기본값) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dnsPromises.resolve4()`](/ko/nodejs/api/dns#dnspromisesresolve4hostname-options) |
| `'AAAA'` | IPv6 주소 | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dnsPromises.resolve6()`](/ko/nodejs/api/dns#dnspromisesresolve6hostname-options) |
| `'ANY'` | 모든 레코드 | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dnsPromises.resolveAny()`](/ko/nodejs/api/dns#dnspromisesresolveanyhostname) |
| `'CAA'` | CA 인증 레코드 | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dnsPromises.resolveCaa()`](/ko/nodejs/api/dns#dnspromisesresolvecaahostname) |
| `'CNAME'` | 정식 이름 레코드 | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dnsPromises.resolveCname()`](/ko/nodejs/api/dns#dnspromisesresolvecnamehostname) |
| `'MX'` | 메일 교환 레코드 | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dnsPromises.resolveMx()`](/ko/nodejs/api/dns#dnspromisesresolvemxhostname) |
| `'NAPTR'` | 이름 권한 포인터 레코드 | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dnsPromises.resolveNaptr()`](/ko/nodejs/api/dns#dnspromisesresolvenaptrhostname) |
| `'NS'` | 이름 서버 레코드 | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dnsPromises.resolveNs()`](/ko/nodejs/api/dns#dnspromisesresolvenshostname) |
| `'PTR'` | 포인터 레코드 | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dnsPromises.resolvePtr()`](/ko/nodejs/api/dns#dnspromisesresolveptrhostname) |
| `'SOA'` | 권한 시작 레코드 | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dnsPromises.resolveSoa()`](/ko/nodejs/api/dns#dnspromisesresolvesoahostname) |
| `'SRV'` | 서비스 레코드 | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [`dnsPromises.resolveSrv()`](/ko/nodejs/api/dns#dnspromisesresolvesrvhostname) |
| `'TXT'` | 텍스트 레코드 | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`dnsPromises.resolveTxt()`](/ko/nodejs/api/dns#dnspromisesresolvetxthostname) |

오류가 발생하면 `Promise`는 [`Error`](/ko/nodejs/api/errors#class-error) 객체와 함께 거부되며, `err.code`는 [DNS 오류 코드](/ko/nodejs/api/dns#error-codes) 중 하나입니다.


### `dnsPromises.resolve4(hostname[, options])` {#dnspromisesresolve4hostname-options}

**Added in: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Data_structures#String_type) 확인할 호스트 이름.
- `options` [\<Object\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ttl` [\<boolean\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Data_structures#Boolean_type) 각 레코드의 TTL(Time-To-Live) 값을 검색합니다. `true`인 경우, `Promise`는 문자열 배열 대신 초 단위로 표현된 TTL을 가진 `{ address: '1.2.3.4', ttl: 60 }` 객체의 배열로 확인됩니다.

`hostname`에 대한 IPv4 주소(`A` 레코드)를 확인하기 위해 DNS 프로토콜을 사용합니다. 성공하면 `Promise`는 IPv4 주소 배열(예: `['74.125.79.104', '74.125.79.105', '74.125.79.106']`)로 확인됩니다.

### `dnsPromises.resolve6(hostname[, options])` {#dnspromisesresolve6hostname-options}

**Added in: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Data_structures#String_type) 확인할 호스트 이름.
- `options` [\<Object\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ttl` [\<boolean\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Data_structures#Boolean_type) 각 레코드의 TTL(Time-To-Live) 값을 검색합니다. `true`인 경우, `Promise`는 문자열 배열 대신 초 단위로 표현된 TTL을 가진 `{ address: '0:1:2:3:4:5:6:7', ttl: 60 }` 객체의 배열로 확인됩니다.

`hostname`에 대한 IPv6 주소(`AAAA` 레코드)를 확인하기 위해 DNS 프로토콜을 사용합니다. 성공하면 `Promise`는 IPv6 주소 배열로 확인됩니다.

### `dnsPromises.resolveAny(hostname)` {#dnspromisesresolveanyhostname}

**Added in: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Data_structures#String_type)

모든 레코드(일명 `ANY` 또는 `*` 쿼리)를 확인하기 위해 DNS 프로토콜을 사용합니다. 성공하면 `Promise`는 다양한 유형의 레코드를 포함하는 배열로 확인됩니다. 각 객체에는 현재 레코드의 유형을 나타내는 `type` 속성이 있습니다. 그리고 `type`에 따라 객체에 추가 속성이 존재합니다:

| 유형 | 속성 |
| --- | --- |
| `'A'` | `address`  /  `ttl` |
| `'AAAA'` | `address`  /  `ttl` |
| `'CNAME'` | `value` |
| `'MX'` | [`dnsPromises.resolveMx()`](/ko/nodejs/api/dns#dnspromisesresolvemxhostname) 참조 |
| `'NAPTR'` | [`dnsPromises.resolveNaptr()`](/ko/nodejs/api/dns#dnspromisesresolvenaptrhostname) 참조 |
| `'NS'` | `value` |
| `'PTR'` | `value` |
| `'SOA'` | [`dnsPromises.resolveSoa()`](/ko/nodejs/api/dns#dnspromisesresolvesoahostname) 참조 |
| `'SRV'` | [`dnsPromises.resolveSrv()`](/ko/nodejs/api/dns#dnspromisesresolvesrvhostname) 참조 |
| `'TXT'` | 이 레코드 유형은 [`dnsPromises.resolveTxt()`](/ko/nodejs/api/dns#dnspromisesresolvetxthostname)를 참조하는 `entries`라는 배열 속성을 포함합니다(예: `{ entries: ['...'], type: 'TXT' }`) |

다음은 결과 객체의 예입니다:

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

**추가된 버전: v15.0.0, v14.17.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

DNS 프로토콜을 사용하여 `hostname`에 대한 `CAA` 레코드를 확인합니다. 성공하면 `Promise`는 `hostname`에 사용할 수 있는 인증 기관 권한 부여 레코드를 포함하는 객체 배열로 확인됩니다(예: `[{critical: 0, iodef: 'mailto:pki@example.com'},{critical: 128, issue: 'pki.example.com'}]`).

### `dnsPromises.resolveCname(hostname)` {#dnspromisesresolvecnamehostname}

**추가된 버전: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

DNS 프로토콜을 사용하여 `hostname`에 대한 `CNAME` 레코드를 확인합니다. 성공하면 `Promise`는 `hostname`에 사용할 수 있는 정식 이름 레코드 배열로 확인됩니다(예: `['bar.example.com']`).

### `dnsPromises.resolveMx(hostname)` {#dnspromisesresolvemxhostname}

**추가된 버전: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

DNS 프로토콜을 사용하여 `hostname`에 대한 메일 교환 레코드(`MX` 레코드)를 확인합니다. 성공하면 `Promise`는 `priority` 및 `exchange` 속성을 모두 포함하는 객체 배열로 확인됩니다(예: `[{priority: 10, exchange: 'mx.example.com'}, ...]`).

### `dnsPromises.resolveNaptr(hostname)` {#dnspromisesresolvenaptrhostname}

**추가된 버전: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

DNS 프로토콜을 사용하여 `hostname`에 대한 정규 표현식 기반 레코드(`NAPTR` 레코드)를 확인합니다. 성공하면 `Promise`는 다음 속성이 있는 객체 배열로 확인됩니다.

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

**추가된 버전: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

DNS 프로토콜을 사용하여 `hostname`에 대한 이름 서버 레코드(`NS` 레코드)를 확인합니다. 성공하면 `Promise`는 `hostname`에 사용할 수 있는 이름 서버 레코드 배열로 확인됩니다(예: `['ns1.example.com', 'ns2.example.com']`).


### `dnsPromises.resolvePtr(hostname)` {#dnspromisesresolveptrhostname}

**추가된 버전: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

DNS 프로토콜을 사용하여 `hostname`에 대한 포인터 레코드(`PTR` 레코드)를 확인합니다. 성공하면 `Promise`는 응답 레코드를 포함하는 문자열 배열로 해결됩니다.

### `dnsPromises.resolveSoa(hostname)` {#dnspromisesresolvesoahostname}

**추가된 버전: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

DNS 프로토콜을 사용하여 `hostname`에 대한 권한 시작 레코드(`SOA` 레코드)를 확인합니다. 성공하면 `Promise`는 다음 속성을 가진 객체로 해결됩니다.

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

**추가된 버전: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

DNS 프로토콜을 사용하여 `hostname`에 대한 서비스 레코드(`SRV` 레코드)를 확인합니다. 성공하면 `Promise`는 다음 속성을 가진 객체 배열로 해결됩니다.

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

**추가된 버전: v10.6.0**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

DNS 프로토콜을 사용하여 `hostname`에 대한 텍스트 쿼리(`TXT` 레코드)를 확인합니다. 성공하면 `Promise`는 `hostname`에 사용할 수 있는 텍스트 레코드의 2차원 배열(예: `[ [ 'v=spf1 ip4:0.0.0.0 ', '~all' ] ]`)로 해결됩니다. 각 하위 배열은 하나의 레코드의 TXT 청크를 포함합니다. 사용 사례에 따라 이들을 함께 결합하거나 별도로 처리할 수 있습니다.


### `dnsPromises.reverse(ip)` {#dnspromisesreverseip}

**추가된 버전: v10.6.0**

- `ip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

IPv4 또는 IPv6 주소를 호스트 이름 배열로 확인하는 역방향 DNS 쿼리를 수행합니다.

오류가 발생하면 `Promise`가 [`Error`](/ko/nodejs/api/errors#class-error) 객체와 함께 거부되고, `err.code`는 [DNS 오류 코드](/ko/nodejs/api/dns#error-codes) 중 하나입니다.

### `dnsPromises.setDefaultResultOrder(order)` {#dnspromisessetdefaultresultorderorder}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v22.1.0, v20.13.0 | 이제 `ipv6first` 값이 지원됩니다. |
| v17.0.0 | 기본값이 `verbatim`으로 변경되었습니다. |
| v16.4.0, v14.18.0 | 추가된 버전: v16.4.0, v14.18.0 |
:::

- `order` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)는 `'ipv4first'`, `'ipv6first'` 또는 `'verbatim'`이어야 합니다.

[`dns.lookup()`](/ko/nodejs/api/dns#dnslookuphostname-options-callback) 및 [`dnsPromises.lookup()`](/ko/nodejs/api/dns#dnspromiseslookuphostname-options)에서 `order`의 기본값을 설정합니다. 값은 다음 중 하나일 수 있습니다.

- `ipv4first`: 기본 `order`를 `ipv4first`로 설정합니다.
- `ipv6first`: 기본 `order`를 `ipv6first`로 설정합니다.
- `verbatim`: 기본 `order`를 `verbatim`으로 설정합니다.

기본값은 `verbatim`이며, [`dnsPromises.setDefaultResultOrder()`](/ko/nodejs/api/dns#dnspromisessetdefaultresultorderorder)가 [`--dns-result-order`](/ko/nodejs/api/cli#--dns-result-orderorder)보다 우선 순위가 높습니다. [워커 스레드](/ko/nodejs/api/worker_threads)를 사용하는 경우, 메인 스레드의 [`dnsPromises.setDefaultResultOrder()`](/ko/nodejs/api/dns#dnspromisessetdefaultresultorderorder)는 워커의 기본 DNS 순서에 영향을 미치지 않습니다.

### `dnsPromises.getDefaultResultOrder()` {#dnspromisesgetdefaultresultorder}

**추가된 버전: v20.1.0, v18.17.0**

`dnsOrder`의 값을 가져옵니다.

### `dnsPromises.setServers(servers)` {#dnspromisessetserversservers}

**추가된 버전: v10.6.0**

- `servers` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) [RFC 5952](https://tools.ietf.org/html/rfc5952#section-6) 형식의 주소 배열

DNS 확인을 수행할 때 사용할 서버의 IP 주소와 포트를 설정합니다. `servers` 인수는 [RFC 5952](https://tools.ietf.org/html/rfc5952#section-6) 형식의 주소 배열입니다. 포트가 IANA 기본 DNS 포트(53)인 경우 생략할 수 있습니다.

```js [ESM]
dnsPromises.setServers([
  '8.8.8.8',
  '[2001:4860:4860::8888]',
  '8.8.8.8:1053',
  '[2001:4860:4860::8888]:1053',
]);
```
잘못된 주소가 제공되면 오류가 발생합니다.

DNS 쿼리가 진행 중인 동안에는 `dnsPromises.setServers()` 메서드를 호출해서는 안 됩니다.

이 메서드는 [resolve.conf](https://man7.org/linux/man-pages/man5/resolv.conf.5)와 매우 유사하게 작동합니다. 즉, 제공된 첫 번째 서버로 확인을 시도한 결과 `NOTFOUND` 오류가 발생하면 `resolve()` 메서드는 제공된 후속 서버로 확인을 시도하지 *않습니다*. 대체 DNS 서버는 이전 서버가 시간 초과되거나 다른 오류가 발생하는 경우에만 사용됩니다.


## 오류 코드 {#error-codes}

각 DNS 쿼리는 다음 오류 코드 중 하나를 반환할 수 있습니다.

- `dns.NODATA`: DNS 서버가 데이터가 없는 응답을 반환했습니다.
- `dns.FORMERR`: DNS 서버가 쿼리 형식이 잘못되었다고 주장합니다.
- `dns.SERVFAIL`: DNS 서버가 일반 오류를 반환했습니다.
- `dns.NOTFOUND`: 도메인 이름을 찾을 수 없습니다.
- `dns.NOTIMP`: DNS 서버가 요청된 작업을 구현하지 않습니다.
- `dns.REFUSED`: DNS 서버가 쿼리를 거부했습니다.
- `dns.BADQUERY`: DNS 쿼리 형식이 잘못되었습니다.
- `dns.BADNAME`: 호스트 이름 형식이 잘못되었습니다.
- `dns.BADFAMILY`: 지원되지 않는 주소 체계입니다.
- `dns.BADRESP`: DNS 응답 형식이 잘못되었습니다.
- `dns.CONNREFUSED`: DNS 서버에 연결할 수 없습니다.
- `dns.TIMEOUT`: DNS 서버에 연결하는 동안 시간 초과되었습니다.
- `dns.EOF`: 파일의 끝입니다.
- `dns.FILE`: 파일 읽기 오류입니다.
- `dns.NOMEM`: 메모리 부족입니다.
- `dns.DESTRUCTION`: 채널이 파괴되고 있습니다.
- `dns.BADSTR`: 문자열 형식이 잘못되었습니다.
- `dns.BADFLAGS`: 잘못된 플래그가 지정되었습니다.
- `dns.NONAME`: 주어진 호스트 이름이 숫자가 아닙니다.
- `dns.BADHINTS`: 잘못된 힌트 플래그가 지정되었습니다.
- `dns.NOTINITIALIZED`: c-ares 라이브러리 초기화가 아직 수행되지 않았습니다.
- `dns.LOADIPHLPAPI`: `iphlpapi.dll`을 로드하는 중 오류가 발생했습니다.
- `dns.ADDRGETNETWORKPARAMS`: `GetNetworkParams` 함수를 찾을 수 없습니다.
- `dns.CANCELLED`: DNS 쿼리가 취소되었습니다.

`dnsPromises` API는 또한 위의 오류 코드(예: `dnsPromises.NODATA`)를 내보냅니다.

## 구현 고려 사항 {#implementation-considerations}

[`dns.lookup()`](/ko/nodejs/api/dns#dnslookuphostname-options-callback) 및 다양한 `dns.resolve*()/dns.reverse()` 함수는 네트워크 이름과 네트워크 주소를 연결하거나 그 반대의 목표가 동일하지만 동작은 매우 다릅니다. 이러한 차이점은 Node.js 프로그램의 동작에 미묘하지만 중요한 영향을 미칠 수 있습니다.

### `dns.lookup()` {#dnslookup}

내부적으로 [`dns.lookup()`](/ko/nodejs/api/dns#dnslookuphostname-options-callback)는 대부분의 다른 프로그램과 동일한 운영 체제 기능을 사용합니다. 예를 들어 [`dns.lookup()`](/ko/nodejs/api/dns#dnslookuphostname-options-callback)는 거의 항상 `ping` 명령과 같은 방식으로 주어진 이름을 확인합니다. 대부분의 POSIX와 유사한 운영 체제에서 [`dns.lookup()`](/ko/nodejs/api/dns#dnslookuphostname-options-callback) 함수의 동작은 [`nsswitch.conf(5)`](http://man7.org/linux/man-pages/man5/nsswitch.conf.5) 및/또는 [`resolv.conf(5)`](http://man7.org/linux/man-pages/man5/resolv.conf.5)의 설정을 변경하여 수정할 수 있지만 이러한 파일을 변경하면 동일한 운영 체제에서 실행되는 다른 모든 프로그램의 동작이 변경됩니다.

`dns.lookup()`에 대한 호출은 JavaScript 관점에서 비동기적이지만 libuv의 스레드 풀에서 실행되는 [`getaddrinfo(3)`](http://man7.org/linux/man-pages/man3/getaddrinfo.3)에 대한 동기 호출로 구현됩니다. 이는 일부 응용 프로그램에 놀라운 부정적인 성능 영향을 미칠 수 있습니다. 자세한 내용은 [`UV_THREADPOOL_SIZE`](/ko/nodejs/api/cli#uv_threadpool_sizesize) 문서를 참조하십시오.

다양한 네트워킹 API는 호스트 이름을 확인하기 위해 내부적으로 `dns.lookup()`을 호출합니다. 이것이 문제가 되는 경우 `dns.resolve()`를 사용하여 호스트 이름을 주소로 확인하고 호스트 이름 대신 주소를 사용하는 것을 고려하십시오. 또한 일부 네트워킹 API(예: [`socket.connect()`](/ko/nodejs/api/net#socketconnectoptions-connectlistener) 및 [`dgram.createSocket()`](/ko/nodejs/api/dgram#dgramcreatesocketoptions-callback))는 기본 리졸버인 `dns.lookup()`을 대체할 수 있도록 합니다.


### `dns.resolve()`, `dns.resolve*()`, 및 `dns.reverse()` {#dnsresolve-dnsresolve*-and-dnsreverse}

이 함수들은 [`dns.lookup()`](/ko/nodejs/api/dns#dnslookuphostname-options-callback)과는 상당히 다르게 구현되어 있습니다. 이 함수들은 [`getaddrinfo(3)`](http://man7.org/linux/man-pages/man3/getaddrinfo.3)를 사용하지 않으며 *항상* 네트워크에서 DNS 쿼리를 수행합니다. 이 네트워크 통신은 항상 비동기적으로 수행되며 libuv의 스레드 풀을 사용하지 않습니다.

결과적으로, 이 함수들은 [`dns.lookup()`](/ko/nodejs/api/dns#dnslookuphostname-options-callback)이 libuv의 스레드 풀에서 발생하는 다른 처리에 미칠 수 있는 부정적인 영향을 동일하게 미치지 않습니다.

이 함수들은 [`dns.lookup()`](/ko/nodejs/api/dns#dnslookuphostname-options-callback)이 사용하는 동일한 구성 파일 세트를 사용하지 않습니다. 예를 들어, `/etc/hosts`의 구성을 사용하지 않습니다.

