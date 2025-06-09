---
title: Node.js 문서 - 쿼리 문자열
description: 이 Node.js 문서의 섹션에서는 URL 쿼리 문자열을 분석하고 형식화하기 위한 유틸리티를 제공하는 querystring 모듈에 대해 자세히 설명합니다. 특수 문자의 이스케이프 및 언이스케이프, 중첩된 객체 처리, 쿼리 문자열 직렬화 관리 방법이 포함됩니다.
head:
  - - meta
    - name: og:title
      content: Node.js 문서 - 쿼리 문자열 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 이 Node.js 문서의 섹션에서는 URL 쿼리 문자열을 분석하고 형식화하기 위한 유틸리티를 제공하는 querystring 모듈에 대해 자세히 설명합니다. 특수 문자의 이스케이프 및 언이스케이프, 중첩된 객체 처리, 쿼리 문자열 직렬화 관리 방법이 포함됩니다.
  - - meta
    - name: twitter:title
      content: Node.js 문서 - 쿼리 문자열 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 이 Node.js 문서의 섹션에서는 URL 쿼리 문자열을 분석하고 형식화하기 위한 유틸리티를 제공하는 querystring 모듈에 대해 자세히 설명합니다. 특수 문자의 이스케이프 및 언이스케이프, 중첩된 객체 처리, 쿼리 문자열 직렬화 관리 방법이 포함됩니다.
---


# 쿼리 스트링 {#query-string}

::: tip [안정성: 2 - 안정적]
[안정성: 2](/ko/nodejs/api/documentation#stability-index) [안정성: 2](/ko/nodejs/api/documentation#stability-index) - 안정적
:::

**소스 코드:** [lib/querystring.js](https://github.com/nodejs/node/blob/v23.5.0/lib/querystring.js)

`node:querystring` 모듈은 URL 쿼리 문자열을 파싱하고 포맷하는 유틸리티를 제공합니다. 다음과 같이 액세스할 수 있습니다.

```js [ESM]
const querystring = require('node:querystring');
```

`querystring`은 [\<URLSearchParams\>](/ko/nodejs/api/url#class-urlsearchparams)보다 성능이 좋지만 표준화된 API는 아닙니다. 성능이 중요하지 않거나 브라우저 코드와의 호환성이 필요한 경우 [\<URLSearchParams\>](/ko/nodejs/api/url#class-urlsearchparams)를 사용하십시오.

## `querystring.decode()` {#querystringdecode}

**추가된 버전: v0.1.99**

`querystring.decode()` 함수는 `querystring.parse()`의 별칭입니다.

## `querystring.encode()` {#querystringencode}

**추가된 버전: v0.1.99**

`querystring.encode()` 함수는 `querystring.stringify()`의 별칭입니다.

## `querystring.escape(str)` {#querystringescapestr}

**추가된 버전: v0.1.25**

- `str` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`querystring.escape()` 메서드는 URL 쿼리 문자열의 특정 요구 사항에 최적화된 방식으로 주어진 `str`에 대해 URL 퍼센트 인코딩을 수행합니다.

`querystring.escape()` 메서드는 `querystring.stringify()`에 의해 사용되며 일반적으로 직접 사용될 것으로 예상되지 않습니다. 애플리케이션 코드가 필요한 경우 `querystring.escape`를 대체 함수에 할당하여 대체 퍼센트 인코딩 구현을 제공할 수 있도록 주로 내보내집니다.

## `querystring.parse(str[, sep[, eq[, options]]])` {#querystringparsestr-sep-eq-options}

::: info [히스토리]
| 버전 | 변경 사항 |
| --- | --- |
| v8.0.0 | 여러 개의 빈 항목이 올바르게 파싱됩니다 (예: `&=&=`). |
| v6.0.0 | 반환된 객체는 더 이상 `Object.prototype`에서 상속되지 않습니다. |
| v6.0.0, v4.2.4 | `eq` 매개변수의 길이가 `1`보다 클 수 있습니다. |
| v0.1.25 | 추가된 버전: v0.1.25 |
:::

- `str` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 파싱할 URL 쿼리 문자열
- `sep` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 쿼리 문자열에서 키와 값 쌍을 구분하는 데 사용되는 부분 문자열입니다. **기본값:** `'&'`.
- `eq` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type). 쿼리 문자열에서 키와 값을 구분하는 데 사용되는 부분 문자열입니다. **기본값:** `'='`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `decodeURIComponent` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 쿼리 문자열에서 퍼센트 인코딩된 문자를 디코딩할 때 사용할 함수입니다. **기본값:** `querystring.unescape()`.
    - `maxKeys` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 파싱할 최대 키 수를 지정합니다. 키 계산 제한을 제거하려면 `0`을 지정합니다. **기본값:** `1000`.

`querystring.parse()` 메서드는 URL 쿼리 문자열(`str`)을 키와 값 쌍의 컬렉션으로 파싱합니다.

예를 들어, 쿼리 문자열 `'foo=bar&abc=xyz&abc=123'`은 다음과 같이 파싱됩니다.

```json [JSON]
{
  "foo": "bar",
  "abc": ["xyz", "123"]
}
```

`querystring.parse()` 메서드에 의해 반환된 객체는 JavaScript `Object`에서 원형적으로 상속되지 *않습니다*. 즉, `obj.toString()`, `obj.hasOwnProperty()` 등과 같은 일반적인 `Object` 메서드는 정의되지 않았으며 *작동하지 않습니다*.

기본적으로 쿼리 문자열 내의 퍼센트 인코딩된 문자는 UTF-8 인코딩을 사용하는 것으로 간주됩니다. 대체 문자 인코딩이 사용되는 경우 대체 `decodeURIComponent` 옵션을 지정해야 합니다.

```js [ESM]
// gbkDecodeURIComponent 함수가 이미 존재하는 것으로 가정...

querystring.parse('w=%D6%D0%CE%C4&foo=bar', null, null,
                  { decodeURIComponent: gbkDecodeURIComponent });
```

## `querystring.stringify(obj[, sep[, eq[, options]]])` {#querystringstringifyobj-sep-eq-options}

**추가된 버전: v0.1.25**

- `obj` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) URL 쿼리 문자열로 직렬화할 객체
- `sep` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 쿼리 문자열에서 키와 값 쌍을 구분하는 데 사용되는 하위 문자열입니다. **기본값:** `'&'`.
- `eq` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type). 쿼리 문자열에서 키와 값을 구분하는 데 사용되는 하위 문자열입니다. **기본값:** `'='`.
- `options` 
    - `encodeURIComponent` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) URL에 안전하지 않은 문자를 쿼리 문자열에서 퍼센트 인코딩으로 변환할 때 사용할 함수입니다. **기본값:** `querystring.escape()`.
  
 

`querystring.stringify()` 메서드는 객체의 "고유 속성"을 반복하여 주어진 `obj`에서 URL 쿼리 문자열을 생성합니다.

다음에 나오는 `obj`에 전달된 값 유형을 직렬화합니다. [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<boolean[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 숫자 값은 유한해야 합니다. 다른 입력 값은 빈 문자열로 강제 변환됩니다.

```js [ESM]
querystring.stringify({ foo: 'bar', baz: ['qux', 'quux'], corge: '' });
// 반환: 'foo=bar&baz=qux&baz=quux&corge='

querystring.stringify({ foo: 'bar', baz: 'qux' }, ';', ':');
// 반환: 'foo:bar;baz:qux'
```
기본적으로 쿼리 문자열 내에서 퍼센트 인코딩이 필요한 문자는 UTF-8로 인코딩됩니다. 대체 인코딩이 필요한 경우 대체 `encodeURIComponent` 옵션을 지정해야 합니다.

```js [ESM]
// gbkEncodeURIComponent 함수가 이미 있다고 가정,

querystring.stringify({ w: '中文', foo: 'bar' }, null, null,
                      { encodeURIComponent: gbkEncodeURIComponent });
```

## `querystring.unescape(str)` {#querystringunescapestr}

**Added in: v0.1.25**

- `str` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`querystring.unescape()` 메서드는 주어진 `str`에 대해 URL 퍼센트 인코딩된 문자의 디코딩을 수행합니다.

`querystring.unescape()` 메서드는 `querystring.parse()`에 의해 사용되며 일반적으로 직접적으로 사용될 것으로 예상되지 않습니다. 이 메서드는 주로 애플리케이션 코드가 필요한 경우 `querystring.unescape`를 대체 함수에 할당하여 대체 디코딩 구현을 제공할 수 있도록 내보내집니다.

기본적으로 `querystring.unescape()` 메서드는 JavaScript 내장 `decodeURIComponent()` 메서드를 사용하여 디코딩을 시도합니다. 실패할 경우 잘못된 URL에서 오류를 발생시키지 않는 더 안전한 동등한 방법이 사용됩니다.

