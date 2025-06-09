---
title: Node.js 문서 - 국제화
description: 이 Node.js 문서 섹션에서는 국제화(Intl) 모듈을 다룹니다. 이 모듈은 정렬, 숫자 형식, 날짜 및 시간 형식 등 다양한 국제화 및 현지화 기능에 대한 접근을 제공합니다.
head:
  - - meta
    - name: og:title
      content: Node.js 문서 - 국제화 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 이 Node.js 문서 섹션에서는 국제화(Intl) 모듈을 다룹니다. 이 모듈은 정렬, 숫자 형식, 날짜 및 시간 형식 등 다양한 국제화 및 현지화 기능에 대한 접근을 제공합니다.
  - - meta
    - name: twitter:title
      content: Node.js 문서 - 국제화 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 이 Node.js 문서 섹션에서는 국제화(Intl) 모듈을 다룹니다. 이 모듈은 정렬, 숫자 형식, 날짜 및 시간 형식 등 다양한 국제화 및 현지화 기능에 대한 접근을 제공합니다.
---


# 국제화 지원 {#internationalization-support}

Node.js에는 국제화된 프로그램을 더 쉽게 작성할 수 있도록 하는 많은 기능이 있습니다. 그중 일부는 다음과 같습니다.

- [ECMAScript 언어 사양](https://tc39.github.io/ecma262/)의 로캘에 민감하거나 유니코드를 인식하는 기능:
    - [`String.prototype.normalize()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize)
    - [`String.prototype.toLowerCase()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLowerCase)
    - [`String.prototype.toUpperCase()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase)
  
 
- [ECMAScript 국제화 API 사양](https://tc39.github.io/ecma402/)(일명 ECMA-402)에 설명된 모든 기능:
    - [`Intl`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) 객체
    - [`String.prototype.localeCompare()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare) 및 [`Date.prototype.toLocaleString()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString)과 같은 로캘에 민감한 메서드
  
 
- [WHATWG URL 파서](/ko/nodejs/api/url#the-whatwg-url-api)의 [국제화된 도메인 이름](https://en.wikipedia.org/wiki/Internationalized_domain_name)(IDN) 지원
- [`require('node:buffer').transcode()`](/ko/nodejs/api/buffer#buffertranscodesource-fromenc-toenc)
- 더 정확한 [REPL](/ko/nodejs/api/repl#repl) 라인 편집
- [`require('node:util').TextDecoder`](/ko/nodejs/api/util#class-utiltextdecoder)
- [`RegExp` 유니코드 속성 이스케이프](https://github.com/tc39/proposal-regexp-unicode-property-escapes)

Node.js와 기본 V8 엔진은 [ICU(International Components for Unicode)](http://site.icu-project.org/)를 사용하여 이러한 기능을 기본 C/C++ 코드로 구현합니다. 전체 ICU 데이터 세트는 기본적으로 Node.js에서 제공됩니다. 그러나 ICU 데이터 파일의 크기로 인해 Node.js를 빌드하거나 실행할 때 ICU 데이터 세트를 사용자 정의하기 위한 여러 옵션이 제공됩니다.


## Node.js 빌드 옵션 {#options-for-building-nodejs}

Node.js에서 ICU 사용 방식을 제어하기 위해 컴파일 시 네 가지 `configure` 옵션을 사용할 수 있습니다. Node.js 컴파일 방법에 대한 자세한 내용은 [BUILDING.md](https://github.com/nodejs/node/blob/HEAD/BUILDING.md)에 문서화되어 있습니다.

- `--with-intl=none`/`--without-intl`
- `--with-intl=system-icu`
- `--with-intl=small-icu`
- `--with-intl=full-icu` (기본값)

각 `configure` 옵션에 대한 사용 가능한 Node.js 및 JavaScript 기능 개요:

| 기능 | `none` | `system-icu` | `small-icu` | `full-icu` |
| --- | --- | --- | --- | --- |
| [`String.prototype.normalize()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize) | 없음 (함수가 작동하지 않음) | 전체 | 전체 | 전체 |
| `String.prototype.to*Case()` | 전체 | 전체 | 전체 | 전체 |
| [`Intl`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) | 없음 (객체가 존재하지 않음) | 부분/전체 (OS에 따라 다름) | 부분 (영어 전용) | 전체 |
| [`String.prototype.localeCompare()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare) | 부분 (로케일 인식 안 함) | 전체 | 전체 | 전체 |
| `String.prototype.toLocale*Case()` | 부분 (로케일 인식 안 함) | 전체 | 전체 | 전체 |
| [`Number.prototype.toLocaleString()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString) | 부분 (로케일 인식 안 함) | 부분/전체 (OS에 따라 다름) | 부분 (영어 전용) | 전체 |
| `Date.prototype.toLocale*String()` | 부분 (로케일 인식 안 함) | 부분/전체 (OS에 따라 다름) | 부분 (영어 전용) | 전체 |
| [레거시 URL 파서](/ko/nodejs/api/url#legacy-url-api) | 부분 (IDN 지원 없음) | 전체 | 전체 | 전체 |
| [WHATWG URL 파서](/ko/nodejs/api/url#the-whatwg-url-api) | 부분 (IDN 지원 없음) | 전체 | 전체 | 전체 |
| [`require('node:buffer').transcode()`](/ko/nodejs/api/buffer#buffertranscodesource-fromenc-toenc) | 없음 (함수가 존재하지 않음) | 전체 | 전체 | 전체 |
| [REPL](/ko/nodejs/api/repl#repl) | 부분 (부정확한 줄 편집) | 전체 | 전체 | 전체 |
| [`require('node:util').TextDecoder`](/ko/nodejs/api/util#class-utiltextdecoder) | 부분 (기본 인코딩 지원) | 부분/전체 (OS에 따라 다름) | 부분 (유니코드 전용) | 전체 |
| [`RegExp` 유니코드 속성 이스케이프](https://github.com/tc39/proposal-regexp-unicode-property-escapes) | 없음 (잘못된 `RegExp` 오류) | 전체 | 전체 | 전체 |

"(로케일 인식 안 함)" 표시는 해당 함수가 존재하는 경우 함수의 비 `Locale` 버전과 동일하게 작업을 수행함을 나타냅니다. 예를 들어 `none` 모드에서 `Date.prototype.toLocaleString()`의 작동은 `Date.prototype.toString()`의 작동과 동일합니다.


### 모든 국제화 기능 비활성화 (`none`) {#disable-all-internationalization-features-none}

이 옵션을 선택하면 ICU가 비활성화되고 결과 `node` 바이너리에서 위에 언급된 대부분의 국제화 기능을 **사용할 수 없습니다**.

### 미리 설치된 ICU로 빌드 (`system-icu`) {#build-with-a-pre-installed-icu-system-icu}

Node.js는 시스템에 이미 설치된 ICU 빌드에 연결할 수 있습니다. 실제로 대부분의 Linux 배포판에는 이미 ICU가 설치되어 있으며 이 옵션을 사용하면 OS의 다른 구성 요소에서 사용하는 것과 동일한 데이터 세트를 재사용할 수 있습니다.

[`String.prototype.normalize()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize) 및 [WHATWG URL 파서](/ko/nodejs/api/url#the-whatwg-url-api)와 같이 ICU 라이브러리 자체만 필요한 기능은 `system-icu`에서 완전히 지원됩니다. [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat)와 같이 ICU 로캘 데이터가 추가로 필요한 기능은 시스템에 설치된 ICU 데이터의 완전성에 따라 완전히 또는 부분적으로 지원될 *수* 있습니다.

### 제한된 ICU 데이터 세트 포함 (`small-icu`) {#embed-a-limited-set-of-icu-data-small-icu}

이 옵션을 사용하면 결과 바이너리가 ICU 라이브러리에 정적으로 연결되고 `node` 실행 파일 내에 ICU 데이터의 하위 집합 (일반적으로 영어 로캘만 해당)이 포함됩니다.

[`String.prototype.normalize()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize) 및 [WHATWG URL 파서](/ko/nodejs/api/url#the-whatwg-url-api)와 같이 ICU 라이브러리 자체만 필요한 기능은 `small-icu`에서 완전히 지원됩니다. [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat)와 같이 ICU 로캘 데이터가 추가로 필요한 기능은 일반적으로 영어 로캘에서만 작동합니다.

```js [ESM]
const january = new Date(9e8);
const english = new Intl.DateTimeFormat('en', { month: 'long' });
const spanish = new Intl.DateTimeFormat('es', { month: 'long' });

console.log(english.format(january));
// "January" 출력
console.log(spanish.format(january));
// small-icu에서 사용자의 기본 로캘에 따라 "M01" 또는 "January"를 출력합니다.
// "enero"를 출력해야 합니다.
```
이 모드는 기능과 바이너리 크기 간의 균형을 제공합니다.


#### 런타임에 ICU 데이터 제공하기 {#providing-icu-data-at-runtime}

`small-icu` 옵션을 사용하는 경우, 런타임에 추가 로캘 데이터를 제공하여 JS 메서드가 모든 ICU 로캘에 대해 작동하도록 할 수 있습니다. 데이터 파일이 `/runtime/directory/with/dat/file`에 저장되어 있다고 가정하면, 다음 중 하나를 통해 ICU에서 사용할 수 있습니다.

- `--with-icu-default-data-dir` 구성 옵션: 이 옵션은 기본 데이터 디렉터리 경로만 바이너리에 포함합니다. 실제 데이터 파일은 이 디렉터리 경로에서 런타임에 로드됩니다.
- [`NODE_ICU_DATA`](/ko/nodejs/api/cli#node_icu_datafile) 환경 변수:
- [`--icu-data-dir`](/ko/nodejs/api/cli#--icu-data-dirfile) CLI 매개변수:

둘 이상의 옵션이 지정된 경우, `--icu-data-dir` CLI 매개변수가 가장 높은 우선 순위를 가지며, 그 다음은 `NODE_ICU_DATA` 환경 변수, 그리고 `--with-icu-default-data-dir` 구성 옵션입니다.

ICU는 다양한 데이터 형식을 자동으로 찾아서 로드할 수 있지만, 데이터는 ICU 버전에 적합해야 하며 파일 이름이 올바르게 지정되어야 합니다. 데이터 파일의 가장 일반적인 이름은 `icudtX[bl].dat`이며, 여기서 `X`는 대상 ICU 버전을 나타내고, `b` 또는 `l`은 시스템의 엔디안을 나타냅니다. 예상되는 데이터 파일을 지정된 디렉터리에서 읽을 수 없으면 Node.js는 로드에 실패합니다. 현재 Node.js 버전에 해당하는 데이터 파일의 이름은 다음을 사용하여 계산할 수 있습니다.

```js [ESM]
`icudt${process.versions.icu.split('.')[0]}${os.endianness()[0].toLowerCase()}.dat`;
```

일반적으로 지원되는 다른 형식 및 ICU 데이터에 대한 자세한 내용은 ICU 사용자 가이드의 ["ICU 데이터"](http://userguide.icu-project.org/icudata) 기사를 확인하십시오.

[full-icu](https://www.npmjs.com/package/full-icu) npm 모듈은 실행 중인 `node` 실행 파일의 ICU 버전을 감지하고 적절한 데이터 파일을 다운로드하여 ICU 데이터 설치를 크게 단순화할 수 있습니다. `npm i full-icu`를 통해 모듈을 설치한 후 데이터 파일을 `./node_modules/full-icu`에서 사용할 수 있습니다. 그런 다음 이 경로를 위에서 표시된 대로 `NODE_ICU_DATA` 또는 `--icu-data-dir`에 전달하여 완전한 `Intl` 지원을 활성화할 수 있습니다.


### 전체 ICU 포함 (`full-icu`) {#embed-the-entire-icu-full-icu}

이 옵션을 사용하면 결과 바이너리가 ICU에 정적으로 연결되고 전체 ICU 데이터 세트를 포함합니다. 이러한 방식으로 생성된 바이너리는 더 이상 외부 종속성이 없으며 모든 로케일을 지원하지만 크기가 상당히 클 수 있습니다. `--with-intl` 플래그가 전달되지 않으면 이것이 기본 동작입니다. 공식 바이너리도 이 모드로 빌드됩니다.

## 국제화 지원 감지 {#detecting-internationalization-support}

ICU가 활성화되었는지 ( `system-icu`, `small-icu` 또는 `full-icu`) 확인하려면 `Intl`의 존재 여부를 확인하는 것으로 충분합니다.

```js [ESM]
const hasICU = typeof Intl === 'object';
```
또는 ICU가 활성화된 경우에만 정의되는 속성인 `process.versions.icu`를 확인하는 것도 작동합니다.

```js [ESM]
const hasICU = typeof process.versions.icu === 'string';
```
영어가 아닌 로케일 (예 : `full-icu` 또는 `system-icu`)에 대한 지원을 확인하려면 [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat)이 좋은 구별 요소가 될 수 있습니다.

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
`Intl` 지원에 대한 더 자세한 테스트를 위해 다음 리소스가 유용할 수 있습니다.

- [btest402](https://github.com/srl295/btest402): 일반적으로 `Intl` 지원이 있는 Node.js가 올바르게 빌드되었는지 확인하는 데 사용됩니다.
- [Test262](https://github.com/tc39/test262/tree/HEAD/test/intl402): ECMAScript의 공식 적합성 테스트 스위트에는 ECMA-402 전용 섹션이 포함되어 있습니다.

