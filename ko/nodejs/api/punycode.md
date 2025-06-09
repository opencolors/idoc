---
title: Node.js 문서 - Punycode
description: 이 페이지는 Node.js에서 국제화 도메인 이름의 인코딩 및 디코딩에 사용되는 Punycode 모듈에 대한 상세한 문서를 제공합니다.
head:
  - - meta
    - name: og:title
      content: Node.js 문서 - Punycode | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 이 페이지는 Node.js에서 국제화 도메인 이름의 인코딩 및 디코딩에 사용되는 Punycode 모듈에 대한 상세한 문서를 제공합니다.
  - - meta
    - name: twitter:title
      content: Node.js 문서 - Punycode | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 이 페이지는 Node.js에서 국제화 도메인 이름의 인코딩 및 디코딩에 사용되는 Punycode 모듈에 대한 상세한 문서를 제공합니다.
---


# Punycode {#punycode}

**Deprecated since: v7.0.0**

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/ko/nodejs/api/documentation#stability-index) [안정성: 0](/ko/nodejs/api/documentation#stability-index) - 더 이상 사용되지 않음
:::

**소스 코드:** [lib/punycode.js](https://github.com/nodejs/node/blob/v23.5.0/lib/punycode.js)

**Node.js에 번들로 제공되는 punycode 모듈은 더 이상 사용되지 않습니다.** 향후 Node.js 주요 버전에서는 이 모듈이 제거될 것입니다. 현재 `punycode` 모듈에 의존하는 사용자는 사용자랜드에서 제공하는 [Punycode.js](https://github.com/bestiejs/punycode.js) 모듈로 전환해야 합니다. Punycode 기반 URL 인코딩은 [`url.domainToASCII`](/ko/nodejs/api/url#urldomaintoasciidomain) 또는 일반적으로 [WHATWG URL API](/ko/nodejs/api/url#the-whatwg-url-api)를 참조하세요.

`punycode` 모듈은 [Punycode.js](https://github.com/bestiejs/punycode.js) 모듈의 번들 버전입니다. 다음과 같이 액세스할 수 있습니다.

```js [ESM]
const punycode = require('node:punycode');
```

[Punycode](https://tools.ietf.org/html/rfc3492)는 RFC 3492에 정의된 문자 인코딩 방식으로, 주로 국제화된 도메인 이름에 사용하기 위한 것입니다. URL의 호스트 이름은 ASCII 문자만으로 제한되기 때문에, 비 ASCII 문자를 포함하는 도메인 이름은 Punycode 방식으로 ASCII로 변환해야 합니다. 예를 들어 영어 단어 `'example'`로 번역되는 일본어 문자는 `'例'`입니다. 국제화된 도메인 이름 `'例.com'`( `'example.com'`과 동일)은 Punycode에 의해 ASCII 문자열 `'xn--fsq.com'`으로 표현됩니다.

`punycode` 모듈은 Punycode 표준의 간단한 구현을 제공합니다.

`punycode` 모듈은 Node.js에서 사용하는 타사 종속성이며 개발자의 편의를 위해 제공됩니다. 모듈에 대한 수정 사항 또는 기타 변경 사항은 [Punycode.js](https://github.com/bestiejs/punycode.js) 프로젝트로 전달해야 합니다.

## `punycode.decode(string)` {#punycodedecodestring}

**추가된 버전: v0.5.1**

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`punycode.decode()` 메서드는 ASCII 전용 문자로 구성된 [Punycode](https://tools.ietf.org/html/rfc3492) 문자열을 해당하는 유니코드 코드포인트 문자열로 변환합니다.

```js [ESM]
punycode.decode('maana-pta'); // 'mañana'
punycode.decode('--dqo34k'); // '☃-⌘'
```

## `punycode.encode(string)` {#punycodeencodestring}

**Added in: v0.5.1**

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`punycode.encode()` 메서드는 유니코드 코드 포인트 문자열을 ASCII 문자만으로 구성된 [Punycode](https://tools.ietf.org/html/rfc3492) 문자열로 변환합니다.

```js [ESM]
punycode.encode('mañana'); // 'maana-pta'
punycode.encode('☃-⌘'); // '--dqo34k'
```
## `punycode.toASCII(domain)` {#punycodetoasciidomain}

**Added in: v0.6.1**

- `domain` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`punycode.toASCII()` 메서드는 국제화 도메인 이름을 나타내는 유니코드 문자열을 [Punycode](https://tools.ietf.org/html/rfc3492)로 변환합니다. 도메인 이름의 비 ASCII 부분만 변환됩니다. 이미 ASCII 문자만 포함된 문자열에서 `punycode.toASCII()`를 호출해도 아무런 효과가 없습니다.

```js [ESM]
// encode domain names
punycode.toASCII('mañana.com');  // 'xn--maana-pta.com'
punycode.toASCII('☃-⌘.com');   // 'xn----dqo34k.com'
punycode.toASCII('example.com'); // 'example.com'
```
## `punycode.toUnicode(domain)` {#punycodetounicodedomain}

**Added in: v0.6.1**

- `domain` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`punycode.toUnicode()` 메서드는 [Punycode](https://tools.ietf.org/html/rfc3492)로 인코딩된 문자를 포함하는 도메인 이름을 나타내는 문자열을 유니코드로 변환합니다. 도메인 이름의 [Punycode](https://tools.ietf.org/html/rfc3492)로 인코딩된 부분만 변환됩니다.

```js [ESM]
// decode domain names
punycode.toUnicode('xn--maana-pta.com'); // 'mañana.com'
punycode.toUnicode('xn----dqo34k.com');  // '☃-⌘.com'
punycode.toUnicode('example.com');       // 'example.com'
```
## `punycode.ucs2` {#punycodeucs2}

**Added in: v0.7.0**

### `punycode.ucs2.decode(string)` {#punycodeucs2decodestring}

**Added in: v0.7.0**

- `string` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`punycode.ucs2.decode()` 메서드는 문자열의 각 유니코드 기호에 대한 숫자 코드포인트 값을 포함하는 배열을 반환합니다.

```js [ESM]
punycode.ucs2.decode('abc'); // [0x61, 0x62, 0x63]
// surrogate pair for U+1D306 tetragram for centre:
punycode.ucs2.decode('\uD834\uDF06'); // [0x1D306]
```

### `punycode.ucs2.encode(codePoints)` {#punycodeucs2encodecodepoints}

**추가된 버전: v0.7.0**

- `codePoints` [\<integer[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`punycode.ucs2.encode()` 메서드는 숫자 코드 포인트 값의 배열을 기반으로 문자열을 반환합니다.

```js [ESM]
punycode.ucs2.encode([0x61, 0x62, 0x63]); // 'abc'
punycode.ucs2.encode([0x1D306]); // '\uD834\uDF06'
```
## `punycode.version` {#punycodeversion}

**추가된 버전: v0.6.1**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

현재 [Punycode.js](https://github.com/bestiejs/punycode.js) 버전 번호를 식별하는 문자열을 반환합니다.

