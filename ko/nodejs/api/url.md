---
title: URL 모듈 - Node.js 문서
description: Node.js의 URL 모듈은 URL 해석 및 분석을 위한 유틸리티를 제공합니다. WHATWG URL 표준과 레거시 urlObject API를 지원하며, 두 형식 모두에서 URL을 작업할 수 있는 메서드를 제공합니다.
head:
  - - meta
    - name: og:title
      content: URL 모듈 - Node.js 문서 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js의 URL 모듈은 URL 해석 및 분석을 위한 유틸리티를 제공합니다. WHATWG URL 표준과 레거시 urlObject API를 지원하며, 두 형식 모두에서 URL을 작업할 수 있는 메서드를 제공합니다.
  - - meta
    - name: twitter:title
      content: URL 모듈 - Node.js 문서 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js의 URL 모듈은 URL 해석 및 분석을 위한 유틸리티를 제공합니다. WHATWG URL 표준과 레거시 urlObject API를 지원하며, 두 형식 모두에서 URL을 작업할 수 있는 메서드를 제공합니다.
---


# URL {#url}

::: tip [Stable: 2 - Stable]
[Stable: 2](/ko/nodejs/api/documentation#stability-index) [Stability: 2](/ko/nodejs/api/documentation#stability-index) - 안정적
:::

**소스 코드:** [lib/url.js](https://github.com/nodejs/node/blob/v23.5.0/lib/url.js)

`node:url` 모듈은 URL 분석 및 구문 분석을 위한 유틸리티를 제공합니다. 다음과 같이 액세스할 수 있습니다.

::: code-group
```js [ESM]
import url from 'node:url';
```

```js [CJS]
const url = require('node:url');
```
:::

## URL 문자열과 URL 객체 {#url-strings-and-url-objects}

URL 문자열은 의미 있는 여러 구성 요소가 포함된 구조화된 문자열입니다. 구문 분석되면 이러한 각 구성 요소에 대한 속성이 포함된 URL 객체가 반환됩니다.

`node:url` 모듈은 URL 작업을 위한 두 가지 API를 제공합니다. 하나는 Node.js 특정 레거시 API이고, 다른 하나는 웹 브라우저에서 사용되는 것과 동일한 [WHATWG URL 표준](https://url.spec.whatwg.org/)을 구현하는 최신 API입니다.

WHATWG API와 레거시 API의 비교는 아래에 제공됩니다. URL `'https://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash'` 위에 레거시 `url.parse()`에서 반환된 객체의 속성이 표시됩니다. 그 아래에는 WHATWG `URL` 객체의 속성이 있습니다.

WHATWG URL의 `origin` 속성에는 `protocol`과 `host`가 포함되지만 `username` 또는 `password`는 포함되지 않습니다.

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
( "" 줄의 모든 공백은 무시해야 합니다. 순전히 서식 지정용입니다.)
```
WHATWG API를 사용하여 URL 문자열 구문 분석:

```js [ESM]
const myURL =
  new URL('https://user::8080/p/a/t/h?query=string#hash');
```
레거시 API를 사용하여 URL 문자열 구문 분석:

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


### 구성 요소에서 URL 구성 및 구성된 문자열 가져오기 {#constructing-a-url-from-component-parts-and-getting-the-constructed-string}

속성 설정자나 템플릿 리터럴 문자열을 사용하여 구성 요소 부분에서 WHATWG URL을 구성할 수 있습니다.

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
구성된 URL 문자열을 가져오려면 `href` 속성 접근자를 사용합니다.

```js [ESM]
console.log(myURL.href);
```
## WHATWG URL API {#the-whatwg-url-api}

### 클래스: `URL` {#class-url}


::: info [History]
| 버전 | 변경 사항 |
| --- | --- |
| v10.0.0 | 이제 클래스를 전역 객체에서 사용할 수 있습니다. |
| v7.0.0, v6.13.0 | 추가됨: v7.0.0, v6.13.0 |
:::

WHATWG URL 표준에 따라 구현된 브라우저 호환 `URL` 클래스입니다. [구문 분석된 URL의 예](https://url.spec.whatwg.org/#example-url-parsing)는 표준 자체에서 찾을 수 있습니다. `URL` 클래스는 전역 객체에서도 사용할 수 있습니다.

브라우저 규칙에 따라 `URL` 객체의 모든 속성은 객체 자체의 데이터 속성이 아닌 클래스 프로토타입에 대한 getter 및 setter로 구현됩니다. 따라서 [레거시 `urlObject`](/ko/nodejs/api/url#legacy-urlobject)와 달리 `URL` 객체의 속성(예: `delete myURL.protocol`, `delete myURL.pathname` 등)에 `delete` 키워드를 사용해도 아무런 효과가 없지만 여전히 `true`를 반환합니다.

#### `new URL(input[, base])` {#new-urlinput-base}


::: info [History]
| 버전 | 변경 사항 |
| --- | --- |
| v20.0.0, v18.17.0 | ICU 요구 사항이 제거되었습니다. |
:::

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 구문 분석할 절대 또는 상대 입력 URL입니다. `input`이 상대적인 경우 `base`가 필요합니다. `input`이 절대적인 경우 `base`는 무시됩니다. `input`이 문자열이 아니면 먼저 [문자열로 변환](https://tc39.es/ecma262/#sec-tostring)됩니다.
- `base` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `input`이 절대적이지 않은 경우 기준으로 삼을 기본 URL입니다. `base`가 문자열이 아니면 먼저 [문자열로 변환](https://tc39.es/ecma262/#sec-tostring)됩니다.

`base`를 기준으로 `input`을 구문 분석하여 새 `URL` 객체를 만듭니다. `base`가 문자열로 전달되면 `new URL(base)`와 동일하게 구문 분석됩니다.

```js [ESM]
const myURL = new URL('/foo', 'https://example.org/');
// https://example.org/foo
```
URL 생성자는 전역 객체의 속성으로 액세스할 수 있습니다. 기본 제공 url 모듈에서 가져올 수도 있습니다.



::: code-group
```js [ESM]
import { URL } from 'node:url';
console.log(URL === globalThis.URL); // 'true'를 출력합니다.
```

```js [CJS]
console.log(URL === require('node:url').URL); // 'true'를 출력합니다.
```
:::

`input` 또는 `base`가 유효한 URL이 아니면 `TypeError`가 발생합니다. 주어진 값을 문자열로 강제 변환하려고 시도합니다. 예를 들어:

```js [ESM]
const myURL = new URL({ toString: () => 'https://example.org/' });
// https://example.org/
```
`input`의 호스트 이름에 나타나는 유니코드 문자는 [Punycode](https://tools.ietf.org/html/rfc5891#section-4.4) 알고리즘을 사용하여 자동으로 ASCII로 변환됩니다.

```js [ESM]
const myURL = new URL('https://測試');
// https://xn--g6w251d/
```
`input`이 절대 URL인지 미리 알 수 없고 `base`가 제공되는 경우 `URL` 객체의 `origin`이 예상한 것인지 확인하는 것이 좋습니다.

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

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

URL의 fragment 부분을 가져오거나 설정합니다.

```js [ESM]
const myURL = new URL('https://example.org/foo#bar');
console.log(myURL.hash);
// #bar 출력

myURL.hash = 'baz';
console.log(myURL.href);
// https://example.org/foo#baz 출력
```
`hash` 속성에 할당된 값에 포함된 유효하지 않은 URL 문자는 [퍼센트 인코딩](/ko/nodejs/api/url#percent-encoding-in-urls)됩니다. 어떤 문자를 퍼센트 인코딩할지 선택하는 것은 [`url.parse()`](/ko/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) 및 [`url.format()`](/ko/nodejs/api/url#urlformaturlobject) 메서드가 생성하는 것과 다소 차이가 있을 수 있습니다.

#### `url.host` {#urlhost}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

URL의 host 부분을 가져오거나 설정합니다.

```js [ESM]
const myURL = new URL('https://example.org:81/foo');
console.log(myURL.host);
// example.org:81 출력

myURL.host = 'example.com:82';
console.log(myURL.href);
// https://example.com:82/foo 출력
```
`host` 속성에 할당된 유효하지 않은 host 값은 무시됩니다.

#### `url.hostname` {#urlhostname}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

URL의 host name 부분을 가져오거나 설정합니다. `url.host`와 `url.hostname`의 주요 차이점은 `url.hostname`에는 포트가 *포함되지 않는다*는 것입니다.

```js [ESM]
const myURL = new URL('https://example.org:81/foo');
console.log(myURL.hostname);
// example.org 출력

// hostname을 설정해도 포트가 변경되지는 않습니다.
myURL.hostname = 'example.com';
console.log(myURL.href);
// https://example.com:81/foo 출력

// hostname과 포트를 변경하려면 myURL.host를 사용하세요.
myURL.host = 'example.org:82';
console.log(myURL.href);
// https://example.org:82/foo 출력
```
`hostname` 속성에 할당된 유효하지 않은 host name 값은 무시됩니다.

#### `url.href` {#urlhref}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

직렬화된 URL을 가져오거나 설정합니다.

```js [ESM]
const myURL = new URL('https://example.org/foo');
console.log(myURL.href);
// https://example.org/foo 출력

myURL.href = 'https://example.com/bar';
console.log(myURL.href);
// https://example.com/bar 출력
```
`href` 속성의 값을 가져오는 것은 [`url.toString()`](/ko/nodejs/api/url#urltostring)을 호출하는 것과 같습니다.

이 속성의 값을 새 값으로 설정하는 것은 [`new URL(value)`](/ko/nodejs/api/url#new-urlinput-base)를 사용하여 새로운 `URL` 객체를 생성하는 것과 같습니다. `URL` 객체의 각 속성이 수정됩니다.

`href` 속성에 할당된 값이 유효한 URL이 아니면 `TypeError`가 발생합니다.


#### `url.origin` {#urlorigin}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v15.0.0 | 스키마 "gopher"는 더 이상 특별하지 않으며 `url.origin`은 이제 해당 스키마에 대해 `'null'`을 반환합니다. |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

URL의 origin의 읽기 전용 직렬화를 가져옵니다.

```js [ESM]
const myURL = new URL('https://example.org/foo/bar?baz');
console.log(myURL.origin);
// Prints https://example.org
```
```js [ESM]
const idnURL = new URL('https://測試');
console.log(idnURL.origin);
// Prints https://xn--g6w251d

console.log(idnURL.hostname);
// Prints xn--g6w251d
```
#### `url.password` {#urlpassword}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

URL의 비밀번호 부분을 가져오고 설정합니다.

```js [ESM]
const myURL = new URL('https://abc:');
console.log(myURL.password);
// Prints xyz

myURL.password = '123';
console.log(myURL.href);
// Prints https://abc:/
```
`password` 속성에 할당된 값에 포함된 유효하지 않은 URL 문자는 [퍼센트 인코딩](/ko/nodejs/api/url#percent-encoding-in-urls)됩니다. 어떤 문자를 퍼센트 인코딩할지 선택하는 것은 [`url.parse()`](/ko/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) 및 [`url.format()`](/ko/nodejs/api/url#urlformaturlobject) 메서드가 생성하는 것과 약간 다를 수 있습니다.

#### `url.pathname` {#urlpathname}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

URL의 경로 부분을 가져오고 설정합니다.

```js [ESM]
const myURL = new URL('https://example.org/abc/xyz?123');
console.log(myURL.pathname);
// Prints /abc/xyz

myURL.pathname = '/abcdef';
console.log(myURL.href);
// Prints https://example.org/abcdef?123
```
`pathname` 속성에 할당된 값에 포함된 유효하지 않은 URL 문자는 [퍼센트 인코딩](/ko/nodejs/api/url#percent-encoding-in-urls)됩니다. 어떤 문자를 퍼센트 인코딩할지 선택하는 것은 [`url.parse()`](/ko/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) 및 [`url.format()`](/ko/nodejs/api/url#urlformaturlobject) 메서드가 생성하는 것과 약간 다를 수 있습니다.


#### `url.port` {#urlport}

::: info [기록]
| 버전 | 변경 사항 |
|---|---|
| v15.0.0 | "gopher" 스킴은 더 이상 특별하지 않습니다. |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

URL의 포트 부분을 가져오고 설정합니다.

포트 값은 `0`에서 `65535` 범위(포함)의 숫자 또는 숫자를 포함하는 문자열일 수 있습니다. `protocol`이 주어진 `URL` 객체의 기본 포트로 값을 설정하면 `port` 값이 빈 문자열(`''`)이 됩니다.

포트 값은 빈 문자열일 수 있으며 이 경우 포트는 프로토콜/스킴에 따라 달라집니다.

| 프로토콜 | 포트 |
|---|---|
| "ftp" | 21 |
| "file" ||
| "http" | 80 |
| "https" | 443 |
| "ws" | 80 |
| "wss" | 443 |

포트에 값을 할당하면 먼저 `.toString()`을 사용하여 값이 문자열로 변환됩니다.

해당 문자열이 유효하지 않지만 숫자로 시작하는 경우 선행 숫자가 `port`에 할당됩니다. 숫자가 위에 표시된 범위를 벗어나면 무시됩니다.

```js [ESM]
const myURL = new URL('https://example.org:8888');
console.log(myURL.port);
// 8888을 출력합니다

// 기본 포트는 자동으로 빈 문자열로 변환됩니다
// (HTTPS 프로토콜의 기본 포트는 443입니다)
myURL.port = '443';
console.log(myURL.port);
// 빈 문자열을 출력합니다
console.log(myURL.href);
// https://example.org/를 출력합니다

myURL.port = 1234;
console.log(myURL.port);
// 1234를 출력합니다
console.log(myURL.href);
// https://example.org:1234/를 출력합니다

// 완전히 잘못된 포트 문자열은 무시됩니다
myURL.port = 'abcd';
console.log(myURL.port);
// 1234를 출력합니다

// 선행 숫자는 포트 번호로 취급됩니다
myURL.port = '5678abcd';
console.log(myURL.port);
// 5678을 출력합니다

// 정수가 아닌 숫자는 잘립니다
myURL.port = 1234.5678;
console.log(myURL.port);
// 1234를 출력합니다

// 과학적 표기법으로 표시되지 않은 범위를 벗어난 숫자는
// 무시됩니다.
myURL.port = 1e10; // 10000000000, 아래에 설명된 대로 범위가 확인됩니다.
console.log(myURL.port);
// 1234를 출력합니다
```
부동 소수점 숫자 또는 과학적 표기법의 숫자와 같이 소수점을 포함하는 숫자는 이 규칙의 예외가 아닙니다. 소수점까지의 선행 숫자는 유효하다고 가정하여 URL의 포트로 설정됩니다.

```js [ESM]
myURL.port = 4.567e21;
console.log(myURL.port);
// 4를 출력합니다 ('4.567e21' 문자열의 선행 숫자이기 때문입니다)
```

#### `url.protocol` {#urlprotocol}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

URL의 프로토콜 부분을 가져오고 설정합니다.

```js [ESM]
const myURL = new URL('https://example.org');
console.log(myURL.protocol);
// Prints https:

myURL.protocol = 'ftp';
console.log(myURL.href);
// Prints ftp://example.org/
```
`protocol` 속성에 할당된 유효하지 않은 URL 프로토콜 값은 무시됩니다.

##### 특수 스킴 {#special-schemes}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v15.0.0 | "gopher" 스킴은 더 이상 특별하지 않습니다. |
:::

[WHATWG URL 표준](https://url.spec.whatwg.org/)은 몇 가지 URL 프로토콜 스킴을 파싱 및 직렬화 방식 측면에서 *특별한* 것으로 간주합니다. 이러한 특수 프로토콜 중 하나를 사용하여 URL을 파싱할 때 `url.protocol` 속성을 다른 특수 프로토콜로 변경할 수 있지만 특수하지 않은 프로토콜로는 변경할 수 없으며 그 반대도 마찬가지입니다.

예를 들어 `http`에서 `https`로 변경하는 것은 가능합니다.

```js [ESM]
const u = new URL('http://example.org');
u.protocol = 'https';
console.log(u.href);
// https://example.org/
```
그러나 새 프로토콜이 특수하지 않기 때문에 `http`에서 가상의 `fish` 프로토콜로 변경하는 것은 불가능합니다.

```js [ESM]
const u = new URL('http://example.org');
u.protocol = 'fish';
console.log(u.href);
// http://example.org/
```
마찬가지로 특수하지 않은 프로토콜에서 특수 프로토콜로 변경하는 것도 허용되지 않습니다.

```js [ESM]
const u = new URL('fish://example.org');
u.protocol = 'http';
console.log(u.href);
// fish://example.org
```
WHATWG URL 표준에 따르면 특수 프로토콜 스킴은 `ftp`, `file`, `http`, `https`, `ws` 및 `wss`입니다.

#### `url.search` {#urlsearch}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

URL의 직렬화된 쿼리 부분을 가져오고 설정합니다.

```js [ESM]
const myURL = new URL('https://example.org/abc?123');
console.log(myURL.search);
// Prints ?123

myURL.search = 'abc=xyz';
console.log(myURL.href);
// Prints https://example.org/abc?abc=xyz
```
`search` 속성에 할당된 값에 나타나는 모든 유효하지 않은 URL 문자는 [퍼센트 인코딩](/ko/nodejs/api/url#percent-encoding-in-urls)됩니다. 퍼센트 인코딩할 문자의 선택은 [`url.parse()`](/ko/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) 및 [`url.format()`](/ko/nodejs/api/url#urlformaturlobject) 메서드가 생성하는 것과 다소 차이가 있을 수 있습니다.


#### `url.searchParams` {#urlsearchparams}

- [\<URLSearchParams\>](/ko/nodejs/api/url#class-urlsearchparams)

URL의 쿼리 매개변수를 나타내는 [`URLSearchParams`](/ko/nodejs/api/url#class-urlsearchparams) 객체를 가져옵니다. 이 속성은 읽기 전용이지만, 제공되는 `URLSearchParams` 객체를 사용하여 URL 인스턴스를 변경할 수 있습니다. URL의 쿼리 매개변수 전체를 바꾸려면 [`url.search`](/ko/nodejs/api/url#urlsearch) 설정자를 사용하십시오. 자세한 내용은 [`URLSearchParams`](/ko/nodejs/api/url#class-urlsearchparams) 문서를 참조하십시오.

`.searchParams`를 사용하여 `URL`을 수정할 때는 주의하십시오. WHATWG 사양에 따라 `URLSearchParams` 객체는 퍼센트 인코딩할 문자를 결정하는 데 다른 규칙을 사용하기 때문입니다. 예를 들어, `URL` 객체는 ASCII 물결표(`~`) 문자를 퍼센트 인코딩하지 않지만, `URLSearchParams`는 항상 인코딩합니다.

```js [ESM]
const myURL = new URL('https://example.org/abc?foo=~bar');

console.log(myURL.search);  // prints ?foo=~bar

// Modify the URL via searchParams...
myURL.searchParams.sort();

console.log(myURL.search);  // prints ?foo=%7Ebar
```
#### `url.username` {#urlusername}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

URL의 사용자 이름 부분을 가져오고 설정합니다.

```js [ESM]
const myURL = new URL('https://abc:');
console.log(myURL.username);
// Prints abc

myURL.username = '123';
console.log(myURL.href);
// Prints https://123:/
```
`username` 속성에 할당된 값에 유효하지 않은 URL 문자가 나타나면 [퍼센트 인코딩](/ko/nodejs/api/url#percent-encoding-in-urls)됩니다. 퍼센트 인코딩할 문자의 선택은 [`url.parse()`](/ko/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) 및 [`url.format()`](/ko/nodejs/api/url#urlformaturlobject) 메서드가 생성하는 것과 약간 다를 수 있습니다.

#### `url.toString()` {#urltostring}

- 반환: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`URL` 객체의 `toString()` 메서드는 직렬화된 URL을 반환합니다. 반환된 값은 [`url.href`](/ko/nodejs/api/url#urlhref) 및 [`url.toJSON()`](/ko/nodejs/api/url#urltojson)의 값과 동일합니다.


#### `url.toJSON()` {#urltojson}

**추가된 버전: v7.7.0, v6.13.0**

- 반환: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`URL` 객체의 `toJSON()` 메서드는 직렬화된 URL을 반환합니다. 반환되는 값은 [`url.href`](/ko/nodejs/api/url#urlhref) 및 [`url.toString()`](/ko/nodejs/api/url#urltostring)의 값과 동일합니다.

이 메서드는 [`JSON.stringify()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)로 `URL` 객체가 직렬화될 때 자동으로 호출됩니다.

```js [ESM]
const myURLs = [
  new URL('https://www.example.com'),
  new URL('https://test.example.org'),
];
console.log(JSON.stringify(myURLs));
// Prints ["https://www.example.com/","https://test.example.org/"]
```
#### `URL.createObjectURL(blob)` {#urlcreateobjecturlblob}

**추가된 버전: v16.7.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

- `blob` [\<Blob\>](/ko/nodejs/api/buffer#class-blob)
- 반환: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

주어진 [\<Blob\>](/ko/nodejs/api/buffer#class-blob) 객체를 나타내고 나중에 `Blob`을 검색하는 데 사용할 수 있는 `'blob:nodedata:...'` URL 문자열을 만듭니다.

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
등록된 [\<Blob\>](/ko/nodejs/api/buffer#class-blob)에 의해 저장된 데이터는 `URL.revokeObjectURL()`이 호출되어 제거될 때까지 메모리에 유지됩니다.

`Blob` 객체는 현재 스레드 내에 등록됩니다. Worker Threads를 사용하는 경우 한 Worker 내에 등록된 `Blob` 객체는 다른 워커 또는 메인 스레드에서 사용할 수 없습니다.

#### `URL.revokeObjectURL(id)` {#urlrevokeobjecturlid}

**추가된 버전: v16.7.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `URL.createObjectURL()`에 대한 이전 호출에서 반환된 `'blob:nodedata:...` URL 문자열입니다.

주어진 ID로 식별된 저장된 [\<Blob\>](/ko/nodejs/api/buffer#class-blob)을 제거합니다. 등록되지 않은 ID를 취소하려고 하면 아무런 오류 없이 실패합니다.


#### `URL.canParse(input[, base])` {#urlcanparseinput-base}

**Added in: v19.9.0, v18.17.0**

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 파싱할 절대 또는 상대 입력 URL입니다. `input`이 상대 URL인 경우 `base`가 필요합니다. `input`이 절대 URL인 경우 `base`는 무시됩니다. `input`이 문자열이 아니면 먼저 [문자열로 변환됩니다](https://tc39.es/ecma262/#sec-tostring).
- `base` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `input`이 절대 URL이 아닌 경우 기준으로 삼을 기본 URL입니다. `base`가 문자열이 아니면 먼저 [문자열로 변환됩니다](https://tc39.es/ecma262/#sec-tostring).
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`base`에 상대적인 `input`을 `URL`로 파싱할 수 있는지 확인합니다.

```js [ESM]
const isValid = URL.canParse('/foo', 'https://example.org/'); // true

const isNotValid = URL.canParse('/foo'); // false
```
#### `URL.parse(input[, base])` {#urlparseinput-base}

**Added in: v22.1.0**

- `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 파싱할 절대 또는 상대 입력 URL입니다. `input`이 상대 URL인 경우 `base`가 필요합니다. `input`이 절대 URL인 경우 `base`는 무시됩니다. `input`이 문자열이 아니면 먼저 [문자열로 변환됩니다](https://tc39.es/ecma262/#sec-tostring).
- `base` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `input`이 절대 URL이 아닌 경우 기준으로 삼을 기본 URL입니다. `base`가 문자열이 아니면 먼저 [문자열로 변환됩니다](https://tc39.es/ecma262/#sec-tostring).
- 반환: [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

문자열을 URL로 파싱합니다. `base`가 제공되면 비절대 `input` URL을 해석하기 위한 기본 URL로 사용됩니다. `input`이 유효하지 않으면 `null`을 반환합니다.


### 클래스: `URLSearchParams` {#class-urlsearchparams}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v10.0.0 | 이제 클래스를 전역 객체에서 사용할 수 있습니다. |
| v7.5.0, v6.13.0 | 추가됨: v7.5.0, v6.13.0 |
:::

`URLSearchParams` API는 `URL`의 쿼리에 대한 읽기 및 쓰기 액세스를 제공합니다. `URLSearchParams` 클래스는 다음 네 가지 생성자 중 하나와 함께 독립적으로 사용할 수도 있습니다. `URLSearchParams` 클래스는 전역 객체에서도 사용할 수 있습니다.

WHATWG `URLSearchParams` 인터페이스와 [`querystring`](/ko/nodejs/api/querystring) 모듈은 목적이 비슷하지만, [`querystring`](/ko/nodejs/api/querystring) 모듈의 목적은 구분 기호 문자(`&` 및 `=`)의 사용자 정의를 허용하므로 더 일반적입니다. 반면에 이 API는 URL 쿼리 문자열 전용으로 설계되었습니다.

```js [ESM]
const myURL = new URL('https://example.org/?abc=123');
console.log(myURL.searchParams.get('abc'));
// 123 출력

myURL.searchParams.append('abc', 'xyz');
console.log(myURL.href);
// https://example.org/?abc=123&abc=xyz 출력

myURL.searchParams.delete('abc');
myURL.searchParams.set('a', 'b');
console.log(myURL.href);
// https://example.org/?a=b 출력

const newSearchParams = new URLSearchParams(myURL.searchParams);
// 위 코드는 다음과 같습니다.
// const newSearchParams = new URLSearchParams(myURL.search);

newSearchParams.append('a', 'c');
console.log(myURL.href);
// https://example.org/?a=b 출력
console.log(newSearchParams.toString());
// a=b&a=c 출력

// newSearchParams.toString()이 암시적으로 호출됩니다.
myURL.search = newSearchParams;
console.log(myURL.href);
// https://example.org/?a=b&a=c 출력
newSearchParams.delete('a');
console.log(myURL.href);
// https://example.org/?a=b&a=c 출력
```
#### `new URLSearchParams()` {#new-urlsearchparams}

새로운 빈 `URLSearchParams` 객체를 인스턴스화합니다.

#### `new URLSearchParams(string)` {#new-urlsearchparamsstring}

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 쿼리 문자열

`string`을 쿼리 문자열로 파싱하고 이를 사용하여 새 `URLSearchParams` 객체를 인스턴스화합니다. 맨 앞에 있는 `'?'`는 무시됩니다(있는 경우).

```js [ESM]
let params;

params = new URLSearchParams('user=abc&query=xyz');
console.log(params.get('user'));
// 'abc' 출력
console.log(params.toString());
// 'user=abc&query=xyz' 출력

params = new URLSearchParams('?user=abc&query=xyz');
console.log(params.toString());
// 'user=abc&query=xyz' 출력
```

#### `new URLSearchParams(obj)` {#new-urlsearchparamsobj}

**추가된 버전: v7.10.0, v6.13.0**

- `obj` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 키-값 쌍의 컬렉션을 나타내는 객체

쿼리 해시 맵을 사용하여 새 `URLSearchParams` 객체를 인스턴스화합니다. `obj`의 각 속성의 키와 값은 항상 문자열로 강제 변환됩니다.

[`querystring`](/ko/nodejs/api/querystring) 모듈과 달리 배열 값 형태의 중복 키는 허용되지 않습니다. 배열은 [`array.toString()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toString)을 사용하여 문자열화되며, 이는 단순히 모든 배열 요소를 쉼표로 결합합니다.

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

**추가된 버전: v7.10.0, v6.13.0**

- `iterable` [\<Iterable\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) 요소가 키-값 쌍인 이터러블 객체

[`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)의 생성자와 유사한 방식으로 이터러블 맵을 사용하여 새 `URLSearchParams` 객체를 인스턴스화합니다. `iterable`은 `Array` 또는 모든 이터러블 객체일 수 있습니다. 즉, `iterable`은 다른 `URLSearchParams`일 수 있으며, 이 경우 생성자는 제공된 `URLSearchParams`의 복제본을 간단히 만듭니다. `iterable`의 요소는 키-값 쌍이며, 자체적으로 모든 이터러블 객체일 수 있습니다.

중복 키가 허용됩니다.

```js [ESM]
let params;

// 배열 사용
params = new URLSearchParams([
  ['user', 'abc'],
  ['query', 'first'],
  ['query', 'second'],
]);
console.log(params.toString());
// Prints 'user=abc&query=first&query=second'

// Map 객체 사용
const map = new Map();
map.set('user', 'abc');
map.set('query', 'xyz');
params = new URLSearchParams(map);
console.log(params.toString());
// Prints 'user=abc&query=xyz'

// 제너레이터 함수 사용
function* getQueryPairs() {
  yield ['user', 'abc'];
  yield ['query', 'first'];
  yield ['query', 'second'];
}
params = new URLSearchParams(getQueryPairs());
console.log(params.toString());
// Prints 'user=abc&query=first&query=second'

// 각 키-값 쌍은 정확히 두 개의 요소를 가져야 합니다.
new URLSearchParams([
  ['user', 'abc', 'error'],
]);
// Throws TypeError [ERR_INVALID_TUPLE]:
//        Each query pair must be an iterable [name, value] tuple
```

#### `urlSearchParams.append(name, value)` {#urlsearchparamsappendname-value}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

쿼리 문자열에 새로운 이름-값 쌍을 추가합니다.

#### `urlSearchParams.delete(name[, value])` {#urlsearchparamsdeletename-value}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v20.2.0, v18.18.0 | 선택적 `value` 인자에 대한 지원을 추가합니다. |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`value`가 제공되면, 이름이 `name`이고 값이 `value`인 모든 이름-값 쌍을 제거합니다.

`value`가 제공되지 않으면, 이름이 `name`인 모든 이름-값 쌍을 제거합니다.

#### `urlSearchParams.entries()` {#urlsearchparamsentries}

- 반환: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

쿼리의 각 이름-값 쌍에 대한 ES6 `Iterator`를 반환합니다. 반복기의 각 항목은 JavaScript `Array`입니다. `Array`의 첫 번째 항목은 `name`이고, 두 번째 항목은 `value`입니다.

[`urlSearchParams[@@iterator]()`](/ko/nodejs/api/url#urlsearchparamssymboliterator)의 별칭입니다.

#### `urlSearchParams.forEach(fn[, thisArg])` {#urlsearchparamsforeachfn-thisarg}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v18.0.0 | 이제 `fn` 인수에 유효하지 않은 콜백을 전달하면 `ERR_INVALID_CALLBACK` 대신 `ERR_INVALID_ARG_TYPE`이 발생합니다. |
:::

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 쿼리의 각 이름-값 쌍에 대해 호출됩니다.
- `thisArg` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) `fn`이 호출될 때 `this` 값으로 사용됩니다.

쿼리의 각 이름-값 쌍을 반복하고 주어진 함수를 호출합니다.

```js [ESM]
const myURL = new URL('https://example.org/?a=b&c=d');
myURL.searchParams.forEach((value, name, searchParams) => {
  console.log(name, value, myURL.searchParams === searchParams);
});
// 출력:
//   a b true
//   c d true
```

#### `urlSearchParams.get(name)` {#urlsearchparamsgetname}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 반환: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) 주어진 `name`과 일치하는 이름-값 쌍이 없으면 문자열 또는 `null`을 반환합니다.

이름이 `name`인 첫 번째 이름-값 쌍의 값을 반환합니다. 그러한 쌍이 없으면 `null`이 반환됩니다.

#### `urlSearchParams.getAll(name)` {#urlsearchparamsgetallname}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 반환: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

이름이 `name`인 모든 이름-값 쌍의 값을 반환합니다. 그러한 쌍이 없으면 빈 배열이 반환됩니다.

#### `urlSearchParams.has(name[, value])` {#urlsearchparamshasname-value}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v20.2.0, v18.18.0 | 선택적 `value` 인수에 대한 지원을 추가합니다. |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`URLSearchParams` 객체가 `name`과 선택적 `value` 인수를 기반으로 키-값 쌍을 포함하는지 확인합니다.

`value`가 제공되면 동일한 `name` 및 `value`를 가진 이름-값 쌍이 존재할 때 `true`를 반환합니다.

`value`가 제공되지 않으면 이름이 `name`인 이름-값 쌍이 하나 이상 있으면 `true`를 반환합니다.

#### `urlSearchParams.keys()` {#urlsearchparamskeys}

- 반환: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

각 이름-값 쌍의 이름을 통해 ES6 `Iterator`를 반환합니다.

```js [ESM]
const params = new URLSearchParams('foo=bar&foo=baz');
for (const name of params.keys()) {
  console.log(name);
}
// 출력:
//   foo
//   foo
```

#### `urlSearchParams.set(name, value)` {#urlsearchparamssetname-value}

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `value` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`name`과 관련된 `URLSearchParams` 객체의 값을 `value`로 설정합니다. `name`을 이름으로 하는 기존의 이름-값 쌍이 있는 경우, 첫 번째 쌍의 값을 `value`로 설정하고 다른 모든 쌍을 제거합니다. 그렇지 않으면 이름-값 쌍을 쿼리 문자열에 추가합니다.

```js [ESM]
const params = new URLSearchParams();
params.append('foo', 'bar');
params.append('foo', 'baz');
params.append('abc', 'def');
console.log(params.toString());
// Prints foo=bar&foo=baz&abc=def

params.set('foo', 'def');
params.set('xyz', 'opq');
console.log(params.toString());
// Prints foo=def&abc=def&xyz=opq
```
#### `urlSearchParams.size` {#urlsearchparamssize}

**Added in: v19.8.0, v18.16.0**

총 매개변수 항목 수입니다.

#### `urlSearchParams.sort()` {#urlsearchparamssort}

**Added in: v7.7.0, v6.13.0**

기존의 모든 이름-값 쌍을 이름으로 제자리 정렬합니다. 정렬은 [안정 정렬 알고리즘](https://en.wikipedia.org/wiki/Sorting_algorithm#Stability)을 사용하여 수행되므로, 같은 이름을 가진 이름-값 쌍 간의 상대적 순서가 유지됩니다.

이 메서드는 특히 캐시 적중률을 높이는 데 사용할 수 있습니다.

```js [ESM]
const params = new URLSearchParams('query[]=abc&type=search&query[]=123');
params.sort();
console.log(params.toString());
// Prints query%5B%5D=abc&query%5B%5D=123&type=search
```
#### `urlSearchParams.toString()` {#urlsearchparamstostring}

- 반환: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

검색 매개변수를 문자열로 직렬화하여 반환하며, 필요한 경우 문자는 퍼센트 인코딩됩니다.

#### `urlSearchParams.values()` {#urlsearchparamsvalues}

- 반환: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

각 이름-값 쌍의 값을 통해 ES6 `Iterator`를 반환합니다.


#### `urlSearchParams[Symbol.iterator]()` {#urlsearchparamssymboliterator}

- 반환: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol)

쿼리 문자열에 있는 각 이름-값 쌍에 대해 ES6 `Iterator`를 반환합니다. 이터레이터의 각 항목은 JavaScript `Array`입니다. `Array`의 첫 번째 항목은 `name`이고, 두 번째 항목은 `value`입니다.

[`urlSearchParams.entries()`](/ko/nodejs/api/url#urlsearchparamsentries)의 별칭입니다.

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


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v20.0.0, v18.17.0 | ICU 요구 사항이 제거되었습니다. |
| v7.4.0, v6.13.0 | 추가됨: v7.4.0, v6.13.0 |
:::

- `domain` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 반환: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`domain`의 [퓨니코드](https://tools.ietf.org/html/rfc5891#section-4.4) ASCII 직렬화를 반환합니다. `domain`이 유효하지 않은 도메인이면 빈 문자열이 반환됩니다.

[`url.domainToUnicode()`](/ko/nodejs/api/url#urldomaintounicodedomain)의 역연산을 수행합니다.



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


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v20.0.0, v18.17.0 | ICU 요구 사항이 제거되었습니다. |
| v7.4.0, v6.13.0 | 추가됨: v7.4.0, v6.13.0 |
:::

- `domain` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 반환: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`domain`의 유니코드 직렬화를 반환합니다. `domain`이 유효하지 않은 도메인이면 빈 문자열이 반환됩니다.

[`url.domainToASCII()`](/ko/nodejs/api/url#urldomaintoasciidomain)의 역연산을 수행합니다.



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

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v22.1.0, v20.13.0 | 이제 `options` 인수를 사용하여 `path` 인수를 구문 분석하는 방법을 결정할 수 있습니다. |
| v10.12.0 | v10.12.0에 추가됨 |
:::

- `url` [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 경로로 변환할 파일 URL 문자열 또는 URL 객체입니다.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `windows` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) `path`가 Windows 파일 경로로 반환되어야 하면 `true`, posix의 경우 `false`, 시스템 기본값의 경우 `undefined`입니다. **기본값:** `undefined`.
  
 
- 반환: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 완전히 확인된 플랫폼별 Node.js 파일 경로입니다.

이 함수는 퍼센트 인코딩된 문자의 올바른 디코딩을 보장하고 플랫폼 간에 유효한 절대 경로 문자열을 보장합니다.

::: code-group
```js [ESM]
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);

new URL('file:///C:/path/').pathname;      // 잘못됨: /C:/path/
fileURLToPath('file:///C:/path/');         // 올바름:   C:\path\ (Windows)

new URL('file://nas/foo.txt').pathname;    // 잘못됨: /foo.txt
fileURLToPath('file://nas/foo.txt');       // 올바름:   \\nas\foo.txt (Windows)

new URL('file:///你好.txt').pathname;      // 잘못됨: /%E4%BD%A0%E5%A5%BD.txt
fileURLToPath('file:///你好.txt');         // 올바름:   /你好.txt (POSIX)

new URL('file:///hello world').pathname;   // 잘못됨: /hello%20world
fileURLToPath('file:///hello world');      // 올바름:   /hello world (POSIX)
```

```js [CJS]
const { fileURLToPath } = require('node:url');
new URL('file:///C:/path/').pathname;      // 잘못됨: /C:/path/
fileURLToPath('file:///C:/path/');         // 올바름:   C:\path\ (Windows)

new URL('file://nas/foo.txt').pathname;    // 잘못됨: /foo.txt
fileURLToPath('file://nas/foo.txt');       // 올바름:   \\nas\foo.txt (Windows)

new URL('file:///你好.txt').pathname;      // 잘못됨: /%E4%BD%A0%E5%A5%BD.txt
fileURLToPath('file:///你好.txt');         // 올바름:   /你好.txt (POSIX)

new URL('file:///hello world').pathname;   // 잘못됨: /hello%20world
fileURLToPath('file:///hello world');      // 올바름:   /hello world (POSIX)
```
:::


### `url.format(URL[, options])` {#urlformaturl-options}

**추가된 버전: v7.6.0**

- `URL` [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api) [WHATWG URL](/ko/nodejs/api/url#the-whatwg-url-api) 객체
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `auth` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 직렬화된 URL 문자열에 사용자 이름과 비밀번호를 포함해야 하는 경우 `true`, 그렇지 않으면 `false`입니다. **기본값:** `true`.
    - `fragment` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 직렬화된 URL 문자열에 프래그먼트를 포함해야 하는 경우 `true`, 그렇지 않으면 `false`입니다. **기본값:** `true`.
    - `search` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 직렬화된 URL 문자열에 검색 쿼리를 포함해야 하는 경우 `true`, 그렇지 않으면 `false`입니다. **기본값:** `true`.
    - `unicode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) URL 문자열의 호스트 구성 요소에 나타나는 유니코드 문자를 Punycode로 인코딩하는 대신 직접 인코딩해야 하는 경우 `true`입니다. **기본값:** `false`.


- 반환값: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

[WHATWG URL](/ko/nodejs/api/url#the-whatwg-url-api) 객체의 URL `String` 표현에 대한 사용자 정의 가능한 직렬화를 반환합니다.

URL 객체에는 URL의 문자열 직렬화를 반환하는 `toString()` 메서드와 `href` 속성이 모두 있습니다. 그러나 이것들은 어떤 식으로든 사용자 정의할 수 없습니다. `url.format(URL[, options])` 메서드는 출력에 대한 기본적인 사용자 정의를 허용합니다.

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

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v22.1.0, v20.13.0 | 이제 `options` 인수를 사용하여 `path` 값 반환 방법을 결정할 수 있습니다. |
| v10.12.0 | v10.12.0에 추가됨 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 파일 URL로 변환할 경로입니다.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `windows` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) `true`인 경우 `path`는 Windows 파일 경로로 처리되어야 하고, `false`인 경우 posix로 처리되어야 하며, `undefined`인 경우 시스템 기본값으로 처리되어야 합니다. **기본값:** `undefined`.
  
 
- 반환: [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api) 파일 URL 객체.

이 함수는 `path`가 절대적으로 확인되고 URL 제어 문자가 파일 URL로 변환될 때 올바르게 인코딩되도록 합니다.

::: code-group
```js [ESM]
import { pathToFileURL } from 'node:url';

new URL('/foo#1', 'file:');           // 잘못됨: file:///foo#1
pathToFileURL('/foo#1');              // 올바름:   file:///foo%231 (POSIX)

new URL('/some/path%.c', 'file:');    // 잘못됨: file:///some/path%.c
pathToFileURL('/some/path%.c');       // 올바름:   file:///some/path%25.c (POSIX)
```

```js [CJS]
const { pathToFileURL } = require('node:url');
new URL(__filename);                  // 잘못됨: 예외 발생 (POSIX)
new URL(__filename);                  // 잘못됨: C:\... (Windows)
pathToFileURL(__filename);            // 올바름:   file:///... (POSIX)
pathToFileURL(__filename);            // 올바름:   file:///C:/... (Windows)

new URL('/foo#1', 'file:');           // 잘못됨: file:///foo#1
pathToFileURL('/foo#1');              // 올바름:   file:///foo%231 (POSIX)

new URL('/some/path%.c', 'file:');    // 잘못됨: file:///some/path%.c
pathToFileURL('/some/path%.c');       // 올바름:   file:///some/path%25.c (POSIX)
```
:::


### `url.urlToHttpOptions(url)` {#urlurltohttpoptionsurl}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v19.9.0, v18.17.0 | 반환된 객체는 `url` 인수의 모든 자체 열거 가능한 속성도 포함합니다. |
| v15.7.0, v14.18.0 | 추가됨: v15.7.0, v14.18.0 |
:::

- `url` [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api) 옵션 객체로 변환할 [WHATWG URL](/ko/nodejs/api/url#the-whatwg-url-api) 객체입니다.
- 반환: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 옵션 객체
    - `protocol` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 사용할 프로토콜입니다.
    - `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 요청을 보낼 서버의 도메인 이름 또는 IP 주소입니다.
    - `hash` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) URL의 조각 부분입니다.
    - `search` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) URL의 직렬화된 쿼리 부분입니다.
    - `pathname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) URL의 경로 부분입니다.
    - `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 요청 경로입니다. 쿼리 문자열이 있는 경우 포함해야 합니다. 예: `'/index.html?page=12'`. 요청 경로에 잘못된 문자가 포함되어 있으면 예외가 발생합니다. 현재는 공백만 거부되지만 나중에 변경될 수 있습니다.
    - `href` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 직렬화된 URL입니다.
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 원격 서버의 포트입니다.
    - `auth` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 기본 인증, 즉 권한 부여 헤더를 계산하기 위한 `'user:password'`입니다.

이 유틸리티 함수는 URL 객체를 [`http.request()`](/ko/nodejs/api/http#httprequestoptions-callback) 및 [`https.request()`](/ko/nodejs/api/https#httpsrequestoptions-callback) API에서 예상하는 일반 옵션 객체로 변환합니다.

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


## 레거시 URL API {#legacy-url-api}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v15.13.0, v14.17.0 | 지원 중단 취소. 상태가 "레거시"로 변경되었습니다. |
| v11.0.0 | 이 API는 지원이 중단되었습니다. |
:::

::: info [안정성: 3 - 레거시]
[안정성: 3](/ko/nodejs/api/documentation#stability-index) [안정성: 3](/ko/nodejs/api/documentation#stability-index) - 레거시: WHATWG URL API를 대신 사용하십시오.
:::

### 레거시 `urlObject` {#legacy-urlobject}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v15.13.0, v14.17.0 | 지원 중단 취소. 상태가 "레거시"로 변경되었습니다. |
| v11.0.0 | 레거시 URL API는 지원이 중단되었습니다. WHATWG URL API를 사용하십시오. |
:::

::: info [안정성: 3 - 레거시]
[안정성: 3](/ko/nodejs/api/documentation#stability-index) [안정성: 3](/ko/nodejs/api/documentation#stability-index) - 레거시: WHATWG URL API를 대신 사용하십시오.
:::

레거시 `urlObject`(`require('node:url').Url` 또는 `import { Url } from 'node:url'`)는 `url.parse()` 함수에 의해 생성되고 반환됩니다.

#### `urlObject.auth` {#urlobjectauth}

`auth` 속성은 URL의 사용자 이름과 비밀번호 부분이며, *userinfo*라고도 합니다. 이 문자열 하위 집합은 `protocol`과 이중 슬래시(있는 경우) 뒤에 오고, `@`로 구분된 `host` 구성 요소 앞에 옵니다. 문자열은 사용자 이름이거나, `:`로 구분된 사용자 이름과 비밀번호입니다.

예: `'user:pass'`.

#### `urlObject.hash` {#urlobjecthash}

`hash` 속성은 선행 `#` 문자를 포함하는 URL의 조각 식별자 부분입니다.

예: `'#hash'`.

#### `urlObject.host` {#urlobjecthost}

`host` 속성은 지정된 경우 `port`를 포함하여 URL의 전체 소문자 호스트 부분입니다.

예: `'sub.example.com:8080'`.

#### `urlObject.hostname` {#urlobjecthostname}

`hostname` 속성은 `port`를 포함하지 *않는* `host` 구성 요소의 소문자 호스트 이름 부분입니다.

예: `'sub.example.com'`.

#### `urlObject.href` {#urlobjecthref}

`href` 속성은 `protocol` 및 `host` 구성 요소가 모두 소문자로 변환된 구문 분석된 전체 URL 문자열입니다.

예: `'http://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash'`.


#### `urlObject.path` {#urlobjectpath}

`path` 속성은 `pathname` 및 `search` 구성 요소를 연결한 것입니다.

예: `'/p/a/t/h?query=string'`.

`path`에 대한 디코딩은 수행되지 않습니다.

#### `urlObject.pathname` {#urlobjectpathname}

`pathname` 속성은 URL의 전체 경로 섹션으로 구성됩니다. 이는 `host`( `port` 포함) 뒤와 `query` 또는 `hash` 구성 요소 시작 전의 모든 것으로, ASCII 물음표(`?`) 또는 해시(`#`) 문자로 구분됩니다.

예: `'/p/a/t/h'`.

경로 문자열에 대한 디코딩은 수행되지 않습니다.

#### `urlObject.port` {#urlobjectport}

`port` 속성은 `host` 구성 요소의 숫자 포트 부분입니다.

예: `'8080'`.

#### `urlObject.protocol` {#urlobjectprotocol}

`protocol` 속성은 URL의 소문자 프로토콜 체계를 식별합니다.

예: `'http:'`.

#### `urlObject.query` {#urlobjectquery}

`query` 속성은 선행 ASCII 물음표(`?`)가 없는 쿼리 문자열이거나 [`querystring`](/ko/nodejs/api/querystring) 모듈의 `parse()` 메서드에서 반환된 객체입니다. `query` 속성이 문자열인지 객체인지 여부는 `url.parse()`에 전달된 `parseQueryString` 인수에 따라 결정됩니다.

예: `'query=string'` 또는 `{'query': 'string'}`.

문자열로 반환되는 경우 쿼리 문자열에 대한 디코딩은 수행되지 않습니다. 객체로 반환되는 경우 키와 값 모두 디코딩됩니다.

#### `urlObject.search` {#urlobjectsearch}

`search` 속성은 선행 ASCII 물음표(`?`) 문자를 포함하여 URL의 전체 "쿼리 문자열" 부분으로 구성됩니다.

예: `'?query=string'`.

쿼리 문자열에 대한 디코딩은 수행되지 않습니다.

#### `urlObject.slashes` {#urlobjectslashes}

`slashes` 속성은 `protocol`의 콜론 뒤에 두 개의 ASCII 슬래시 문자(`/`)가 필요한 경우 `true` 값을 갖는 `boolean`입니다.

### `url.format(urlObject)` {#urlformaturlobject}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v17.0.0 | 호스트 이름의 Punycode 변환이 URL을 다르게 다시 파싱할 수 있는 변경 사항을 도입하는 경우 이제 `ERR_INVALID_URL` 예외를 발생시킵니다. |
| v15.13.0, v14.17.0 | 더 이상 사용 중단이 취소되었습니다. 상태가 "레거시"로 변경되었습니다. |
| v11.0.0 | 레거시 URL API는 더 이상 사용되지 않습니다. WHATWG URL API를 사용하십시오. |
| v7.0.0 | `file:` 체계가 있는 URL은 이제 `slashes` 옵션에 관계없이 항상 올바른 수의 슬래시를 사용합니다. 프로토콜이 없는 falsy `slashes` 옵션도 이제 항상 존중됩니다. |
| v0.1.25 | 추가됨: v0.1.25 |
:::

::: info [안정성: 3 - 레거시]
[안정성: 3](/ko/nodejs/api/documentation#stability-index) [안정성: 3](/ko/nodejs/api/documentation#stability-index) - 레거시: 대신 WHATWG URL API를 사용하십시오.
:::

- `urlObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) URL 객체( `url.parse()`에서 반환되거나 다른 방식으로 구성됨). 문자열인 경우 `url.parse()`에 전달하여 객체로 변환됩니다.

`url.format()` 메서드는 `urlObject`에서 파생된 형식이 지정된 URL 문자열을 반환합니다.

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
`urlObject`가 객체 또는 문자열이 아니면 `url.format()`은 [`TypeError`](/ko/nodejs/api/errors#class-typeerror)를 발생시킵니다.

형식 지정 프로세스는 다음과 같이 작동합니다.

- 새 빈 문자열 `result`가 생성됩니다.
- `urlObject.protocol`이 문자열이면 있는 그대로 `result`에 추가됩니다.
- 그렇지 않고 `urlObject.protocol`이 `undefined`가 아니고 문자열이 아니면 [`Error`](/ko/nodejs/api/errors#class-error)가 발생합니다.
- ASCII 콜론(`:`) 문자로 *끝나지 않는* `urlObject.protocol`의 모든 문자열 값에 대해 리터럴 문자열 `:`이 `result`에 추가됩니다.
- 다음 조건 중 하나가 true이면 리터럴 문자열 `//`이 `result`에 추가됩니다.
    - `urlObject.slashes` 속성이 true입니다.
    - `urlObject.protocol`이 `http`, `https`, `ftp`, `gopher` 또는 `file`로 시작합니다.
  
 
- `urlObject.auth` 속성의 값이 truthy이고 `urlObject.host` 또는 `urlObject.hostname`이 `undefined`가 아니면 `urlObject.auth`의 값은 문자열로 강제 변환되어 리터럴 문자열 `@`와 함께 `result`에 추가됩니다.
- `urlObject.host` 속성이 `undefined`이면 다음과 같습니다.
    - `urlObject.hostname`이 문자열이면 `result`에 추가됩니다.
    - 그렇지 않고 `urlObject.hostname`이 `undefined`가 아니고 문자열이 아니면 [`Error`](/ko/nodejs/api/errors#class-error)가 발생합니다.
    - `urlObject.port` 속성 값이 truthy이고 `urlObject.hostname`이 `undefined`가 아니면 다음과 같습니다.
    - 리터럴 문자열 `:`이 `result`에 추가되고
    - `urlObject.port`의 값이 문자열로 강제 변환되어 `result`에 추가됩니다.
  
 
  
 
- 그렇지 않고 `urlObject.host` 속성 값이 truthy이면 `urlObject.host`의 값이 문자열로 강제 변환되어 `result`에 추가됩니다.
- `urlObject.pathname` 속성이 빈 문자열이 아닌 문자열이면 다음과 같습니다.
    - `urlObject.pathname`이 ASCII 슬래시(`/`)로 *시작하지 않으면* 리터럴 문자열 `'/'`이 `result`에 추가됩니다.
    - `urlObject.pathname`의 값이 `result`에 추가됩니다.
  
 
- 그렇지 않고 `urlObject.pathname`이 `undefined`가 아니고 문자열이 아니면 [`Error`](/ko/nodejs/api/errors#class-error)가 발생합니다.
- `urlObject.search` 속성이 `undefined`이고 `urlObject.query` 속성이 `Object`이면 리터럴 문자열 `?`가 `result`에 추가되고 그 뒤에 `urlObject.query` 값을 전달하여 [`querystring`](/ko/nodejs/api/querystring) 모듈의 `stringify()` 메서드를 호출한 출력이 추가됩니다.
- 그렇지 않고 `urlObject.search`가 문자열이면 다음과 같습니다.
    - `urlObject.search`의 값이 ASCII 물음표(`?`) 문자로 *시작하지 않으면* 리터럴 문자열 `?`가 `result`에 추가됩니다.
    - `urlObject.search`의 값이 `result`에 추가됩니다.
  
 
- 그렇지 않고 `urlObject.search`가 `undefined`가 아니고 문자열이 아니면 [`Error`](/ko/nodejs/api/errors#class-error)가 발생합니다.
- `urlObject.hash` 속성이 문자열이면 다음과 같습니다.
    - `urlObject.hash`의 값이 ASCII 해시(`#`) 문자로 *시작하지 않으면* 리터럴 문자열 `#`이 `result`에 추가됩니다.
    - `urlObject.hash`의 값이 `result`에 추가됩니다.
  
 
- 그렇지 않고 `urlObject.hash` 속성이 `undefined`가 아니고 문자열이 아니면 [`Error`](/ko/nodejs/api/errors#class-error)가 발생합니다.
- `result`가 반환됩니다.


### `url.parse(urlString[, parseQueryString[, slashesDenoteHost]])` {#urlparseurlstring-parsequerystring-slashesdenotehost}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v19.0.0, v18.13.0 | 문서 전용 지원 중단. |
| v15.13.0, v14.17.0 | 지원 중단 철회됨. 상태가 "레거시"로 변경됨. |
| v11.14.0 | 경로가 없고 프로토콜 스키마가 `ws:` 또는 `wss:`인 경우 반환된 URL 객체의 `pathname` 속성이 이제 `/`입니다. |
| v11.0.0 | 레거시 URL API가 지원 중단되었습니다. WHATWG URL API를 사용하세요. |
| v9.0.0 | 쿼리 문자열이 없는 경우 반환된 URL 객체의 `search` 속성은 이제 `null`입니다. |
| v0.1.25 | v0.1.25에 추가됨 |
:::

::: danger [안정성: 0 - 지원 중단]
[안정성: 0](/ko/nodejs/api/documentation#stability-index) [안정성: 0](/ko/nodejs/api/documentation#stability-index) - 지원 중단: 대신 WHATWG URL API를 사용하세요.
:::

- `urlString` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 파싱할 URL 문자열입니다.
- `parseQueryString` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`인 경우 `query` 속성은 항상 [`querystring`](/ko/nodejs/api/querystring) 모듈의 `parse()` 메서드에서 반환된 객체로 설정됩니다. `false`인 경우 반환된 URL 객체의 `query` 속성은 파싱되지 않고 디코딩되지 않은 문자열입니다. **기본값:** `false`.
- `slashesDenoteHost` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`인 경우 리터럴 문자열 `//` 다음의 첫 번째 토큰과 다음 `/` 앞의 첫 번째 토큰은 `host`로 해석됩니다. 예를 들어 `//foo/bar`가 주어지면 결과는 `{host: 'foo', pathname: '/bar'}`가 되고 `{pathname: '//foo/bar'}`가 됩니다. **기본값:** `false`.

`url.parse()` 메서드는 URL 문자열을 가져와서 파싱하고 URL 객체를 반환합니다.

`urlString`이 문자열이 아니면 `TypeError`가 발생합니다.

`auth` 속성이 있지만 디코딩할 수 없는 경우 `URIError`가 발생합니다.

`url.parse()`는 URL 문자열 파싱을 위한 관대한 비표준 알고리즘을 사용합니다. [호스트 이름 스푸핑](https://hackerone.com/reports/678487) 및 사용자 이름과 암호의 잘못된 처리와 같은 보안 문제에 취약합니다. 신뢰할 수 없는 입력과 함께 사용하지 마십시오. CVE는 `url.parse()` 취약점에 대해 발행되지 않습니다. 대신 [WHATWG URL](/ko/nodejs/api/url#the-whatwg-url-api) API를 사용하세요.


### `url.resolve(from, to)` {#urlresolvefrom-to}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v15.13.0, v14.17.0 | 더 이상 사용 중단되지 않습니다. 상태가 "레거시"로 변경되었습니다. |
| v11.0.0 | 레거시 URL API는 더 이상 사용되지 않습니다. WHATWG URL API를 사용하세요. |
| v6.6.0 | 이제 `from`과 `to`가 동일한 호스트를 참조하는 경우 `auth` 필드가 그대로 유지됩니다. |
| v6.0.0 | 이제 `to` 매개변수에 호스트 이름이 포함되어 있으면 `auth` 필드가 지워집니다. |
| v6.5.0, v4.6.2 | 이제 `port` 필드가 올바르게 복사됩니다. |
| v0.1.25 | 추가됨: v0.1.25 |
:::

::: info [안정성: 3 - 레거시]
[안정성: 3](/ko/nodejs/api/documentation#stability-index) [안정성: 3](/ko/nodejs/api/documentation#stability-index) - 레거시: 대신 WHATWG URL API를 사용하세요.
:::

- `from` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `to`가 상대 URL인 경우 사용할 기본 URL입니다.
- `to` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 확인할 대상 URL입니다.

`url.resolve()` 메서드는 웹 브라우저가 앵커 태그를 확인하는 방식과 유사하게 기본 URL을 기준으로 대상 URL을 확인합니다.

```js [ESM]
const url = require('node:url');
url.resolve('/one/two/three', 'four');         // '/one/two/four'
url.resolve('http://example.com/', '/one');    // 'http://example.com/one'
url.resolve('http://example.com/one', '/two'); // 'http://example.com/two'
```
WHATWG URL API를 사용하여 동일한 결과를 얻으려면:

```js [ESM]
function resolve(from, to) {
  const resolvedUrl = new URL(to, new URL(from, 'resolve://'));
  if (resolvedUrl.protocol === 'resolve:') {
    // `from`은 상대 URL입니다.
    const { pathname, search, hash } = resolvedUrl;
    return pathname + search + hash;
  }
  return resolvedUrl.toString();
}

resolve('/one/two/three', 'four');         // '/one/two/four'
resolve('http://example.com/', '/one');    // 'http://example.com/one'
resolve('http://example.com/one', '/two'); // 'http://example.com/two'
```
## URL의 퍼센트 인코딩 {#percent-encoding-in-urls}

URL은 특정 범위의 문자만 포함할 수 있습니다. 해당 범위를 벗어나는 문자는 인코딩해야 합니다. 이러한 문자를 인코딩하는 방법과 인코딩할 문자는 문자가 URL 구조 내에 있는 위치에 따라 전적으로 달라집니다.


### 레거시 API {#legacy-api}

레거시 API 내에서 공백(`' '`) 및 다음 문자는 URL 객체의 속성에서 자동으로 이스케이프됩니다.

```text [TEXT]
< > " ` \r \n \t { } | \ ^ '
```
예를 들어, ASCII 공백 문자(`' '`)는 `%20`으로 인코딩됩니다. ASCII 슬래시 문자(`/`)는 `%3C`로 인코딩됩니다.

### WHATWG API {#whatwg-api}

[WHATWG URL 표준](https://url.spec.whatwg.org/)은 레거시 API에서 사용하는 것보다 인코딩된 문자를 선택하는 데 더 선택적이고 세분화된 접근 방식을 사용합니다.

WHATWG 알고리즘은 퍼센트 인코딩해야 하는 문자 범위를 설명하는 네 가지 "퍼센트 인코드 세트"를 정의합니다.

- *C0 제어 퍼센트 인코드 세트*에는 U+0000에서 U+001F(포함) 범위의 코드 포인트와 U+007E(~)보다 큰 모든 코드 포인트가 포함됩니다.
- *프래그먼트 퍼센트 인코드 세트*에는 *C0 제어 퍼센트 인코드 세트*와 코드 포인트 U+0020 SPACE, U+0022("), U+003C(<), U+003E(>), U+0060(`)가 포함됩니다.
- *경로 퍼센트 인코드 세트*에는 *C0 제어 퍼센트 인코드 세트*와 코드 포인트 U+0020 SPACE, U+0022("), U+0023(#), U+003C(<), U+003E(>), U+003F(?), U+0060(`), U+007B({), U+007D(})가 포함됩니다.
- *userinfo 인코드 세트*에는 *경로 퍼센트 인코드 세트*와 코드 포인트 U+002F(/), U+003A(:), U+003B(;), U+003D(=), U+0040(@), U+005B([)에서 U+005E(^) 및 U+007C(|)가 포함됩니다.

*userinfo 퍼센트 인코드 세트*는 URL 내에 인코딩된 사용자 이름과 비밀번호에만 독점적으로 사용됩니다. *경로 퍼센트 인코드 세트*는 대부분의 URL 경로에 사용됩니다. *프래그먼트 퍼센트 인코드 세트*는 URL 프래그먼트에 사용됩니다. *C0 제어 퍼센트 인코드 세트*는 특정 조건에서 호스트 및 경로에 사용될 뿐만 아니라 다른 모든 경우에도 사용됩니다.

호스트 이름 내에 ASCII가 아닌 문자가 나타나면 호스트 이름은 [Punycode](https://tools.ietf.org/html/rfc5891#section-4.4) 알고리즘을 사용하여 인코딩됩니다. 그러나 호스트 이름은 Punycode 인코딩 문자와 퍼센트 인코딩 문자를 *모두* 포함할 *수* 있습니다.

```js [ESM]
const myURL = new URL('https://%CF%80.example.com/foo');
console.log(myURL.href);
// Prints https://xn--1xa.example.com/foo
console.log(myURL.origin);
// Prints https://xn--1xa.example.com
```

