---
title: Node.js의 ECMAScript 모듈
description: 이 페이지는 Node.js에서 ECMAScript 모듈(ESM)을 사용하는 방법에 대한 상세한 문서를 제공합니다. 모듈 해석, 임포트 및 익스포트 구문, CommonJS와의 호환성 등을 포함합니다.
head:
  - - meta
    - name: og:title
      content: Node.js의 ECMAScript 모듈 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 이 페이지는 Node.js에서 ECMAScript 모듈(ESM)을 사용하는 방법에 대한 상세한 문서를 제공합니다. 모듈 해석, 임포트 및 익스포트 구문, CommonJS와의 호환성 등을 포함합니다.
  - - meta
    - name: twitter:title
      content: Node.js의 ECMAScript 모듈 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 이 페이지는 Node.js에서 ECMAScript 모듈(ESM)을 사용하는 방법에 대한 상세한 문서를 제공합니다. 모듈 해석, 임포트 및 익스포트 구문, CommonJS와의 호환성 등을 포함합니다.
---


# 모듈: ECMAScript 모듈 {#modules-ecmascript-modules}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v23.1.0 | 가져오기 속성이 더 이상 실험적이지 않습니다. |
| v22.0.0 | 가져오기 어설션 지원을 중단합니다. |
| v21.0.0, v20.10.0, v18.20.0 | 가져오기 속성에 대한 실험적 지원을 추가합니다. |
| v20.0.0, v18.19.0 | 모듈 사용자 정의 후크가 메인 스레드에서 실행됩니다. |
| v18.6.0, v16.17.0 | 모듈 사용자 정의 후크 체이닝에 대한 지원을 추가합니다. |
| v17.1.0, v16.14.0 | 가져오기 어설션에 대한 실험적 지원을 추가합니다. |
| v17.0.0, v16.12.0 | 사용자 정의 후크 통합, `getFormat`, `getSource`, `transformSource` 및 `getGlobalPreloadCode` 후크 제거, `load` 및 `globalPreload` 후크 추가, `resolve` 또는 `load` 후크에서 `format` 반환 허용. |
| v14.8.0 | 최상위 대기 플래그 해제. |
| v15.3.0, v14.17.0, v12.22.0 | 모듈 구현 안정화. |
| v14.13.0, v12.20.0 | CommonJS 명명된 내보내기 감지에 대한 지원. |
| v14.0.0, v13.14.0, v12.20.0 | 실험적 모듈 경고 제거. |
| v13.2.0, v12.17.0 | ECMAScript 모듈을 로드하는 데 더 이상 명령줄 플래그가 필요하지 않습니다. |
| v12.0.0 | `package.json` `"type"` 필드를 통해 `.js` 파일 확장자를 사용하는 ES 모듈에 대한 지원을 추가합니다. |
| v8.5.0 | 추가됨: v8.5.0 |
:::

::: tip [안정됨: 2 - 안정됨]
[안정됨: 2](/ko/nodejs/api/documentation#stability-index) [안정성: 2](/ko/nodejs/api/documentation#stability-index) - 안정됨
:::

## 소개 {#introduction}

ECMAScript 모듈은 JavaScript 코드를 재사용하기 위한 [공식 표준 형식](https://tc39.github.io/ecma262/#sec-modules)입니다. 모듈은 다양한 [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) 및 [`export`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) 문을 사용하여 정의됩니다.

다음은 함수를 내보내는 ES 모듈의 예입니다.

```js [ESM]
// addTwo.mjs
function addTwo(num) {
  return num + 2;
}

export { addTwo };
```
다음은 `addTwo.mjs`에서 함수를 가져오는 ES 모듈의 예입니다.

```js [ESM]
// app.mjs
import { addTwo } from './addTwo.mjs';

// 출력: 6
console.log(addTwo(4));
```
Node.js는 현재 지정된 대로 ECMAScript 모듈을 완전히 지원하며 원래 모듈 형식인 [CommonJS](/ko/nodejs/api/modules)와 상호 운용성을 제공합니다.


## 활성화 {#enabling}

Node.js에는 두 가지 모듈 시스템이 있습니다. [CommonJS](/ko/nodejs/api/modules) 모듈과 ECMAScript 모듈입니다.

작성자는 `.mjs` 파일 확장자, `package.json` [`"type"`](/ko/nodejs/api/packages#type) 필드에 `"module"` 값을 지정하거나 [`--input-type`](/ko/nodejs/api/cli#--input-typetype) 플래그에 `"module"` 값을 지정하여 Node.js가 JavaScript를 ES 모듈로 해석하도록 할 수 있습니다. 이는 코드가 ES 모듈로 실행되도록 의도되었음을 명시적으로 나타내는 표식입니다.

반대로, 작성자는 `.cjs` 파일 확장자, `package.json` [`"type"`](/ko/nodejs/api/packages#type) 필드에 `"commonjs"` 값을 지정하거나 [`--input-type`](/ko/nodejs/api/cli#--input-typetype) 플래그에 `"commonjs"` 값을 지정하여 Node.js가 JavaScript를 CommonJS로 해석하도록 명시적으로 지정할 수 있습니다.

코드에 모듈 시스템에 대한 명시적 표식이 없는 경우 Node.js는 모듈의 소스 코드를 검사하여 ES 모듈 구문을 찾습니다. 이러한 구문이 발견되면 Node.js는 코드를 ES 모듈로 실행하고, 그렇지 않으면 모듈을 CommonJS로 실행합니다. 자세한 내용은 [모듈 시스템 결정](/ko/nodejs/api/packages#determining-module-system)을 참조하세요.

## 패키지 {#packages}

이 섹션은 [모듈: 패키지](/ko/nodejs/api/packages)로 이동되었습니다.

## `import` 지정자 {#import-specifiers}

### 용어 {#terminology}

`import` 문의 *지정자*는 `from` 키워드 뒤의 문자열입니다. 예를 들어 `import { sep } from 'node:path'`에서 `'node:path'`입니다. 지정자는 `export from` 문과 `import()` 표현식의 인수로도 사용됩니다.

지정자에는 세 가지 유형이 있습니다.

- *상대 지정자*: `'./startup.js'` 또는 `'../config.mjs'`와 같습니다. 이들은 가져오는 파일의 위치를 기준으로 상대적인 경로를 나타냅니다. *이러한 지정자에는 항상 파일 확장자가 필요합니다.*
- *절대 지정자*: `'some-package'` 또는 `'some-package/shuffle'`와 같습니다. 패키지 이름으로 패키지의 기본 진입점을 참조하거나, 예제에 따라 패키지 이름으로 접두사가 붙은 패키지 내의 특정 기능 모듈을 참조할 수 있습니다. *<a href="packages.html#exports"><code>"exports"</code></a> 필드가 없는 패키지에만 파일 확장자를 포함해야 합니다.*
- *절대 지정자*: `'file:///opt/nodejs/config.js'`와 같습니다. 이들은 전체 경로를 직접적이고 명시적으로 나타냅니다.

절대 지정자 해석은 [Node.js 모듈 해석 및 로딩 알고리즘](/ko/nodejs/api/esm#resolution-algorithm-specification)에 의해 처리됩니다. 다른 모든 지정자 해석은 항상 표준 상대 [URL](https://url.spec.whatwg.org/) 해석 의미 체계를 사용하여만 해석됩니다.

CommonJS와 마찬가지로 패키지 내의 모듈 파일은 패키지 이름에 경로를 추가하여 액세스할 수 있습니다. 단, 패키지의 [`package.json`](/ko/nodejs/api/packages#nodejs-packagejson-field-definitions)에 [`"exports"`](/ko/nodejs/api/packages#exports) 필드가 포함된 경우 패키지 내의 파일은 [`"exports"`](/ko/nodejs/api/packages#exports)에 정의된 경로를 통해서만 액세스할 수 있습니다.

Node.js 모듈 해석에서 절대 지정자에 적용되는 이러한 패키지 해석 규칙에 대한 자세한 내용은 [패키지 문서](/ko/nodejs/api/packages)를 참조하세요.


### 필수 파일 확장명 {#mandatory-file-extensions}

상대 또는 절대 지정자를 확인하기 위해 `import` 키워드를 사용할 때는 파일 확장명을 제공해야 합니다. 디렉터리 인덱스 (예: `'./startup/index.js'`)도 완전히 지정해야 합니다.

이 동작은 일반적으로 구성된 서버를 가정할 때 브라우저 환경에서 `import`가 작동하는 방식과 일치합니다.

### URL {#urls}

ES 모듈은 URL로 확인되고 캐시됩니다. 즉, 특수 문자는 `#`을 `%23`으로, `?`를 `%3F`로 [퍼센트 인코딩](/ko/nodejs/api/url#percent-encoding-in-urls)해야 합니다.

`file:`, `node:`, `data:` URL 체계가 지원됩니다. `'https://example.com/app.js'`와 같은 지정자는 [사용자 정의 HTTPS 로더](/ko/nodejs/api/module#import-from-https)를 사용하지 않는 한 Node.js에서 기본적으로 지원되지 않습니다.

#### `file:` URL {#file-urls}

모듈을 확인하는 데 사용된 `import` 지정자에 다른 쿼리 또는 프래그먼트가 있는 경우 모듈이 여러 번 로드됩니다.

```js [ESM]
import './foo.mjs?query=1'; // 쿼리가 "?query=1"인 ./foo.mjs를 로드합니다.
import './foo.mjs?query=2'; // 쿼리가 "?query=2"인 ./foo.mjs를 로드합니다.
```

볼륨 루트는 `/`, `//` 또는 `file:///`를 통해 참조할 수 있습니다. [URL](https://url.spec.whatwg.org/)과 경로 확인 간의 차이점(예: 퍼센트 인코딩 세부 사항)을 고려할 때 경로를 가져올 때는 [url.pathToFileURL](/ko/nodejs/api/url#urlpathtofileurlpath-options)을 사용하는 것이 좋습니다.

#### `data:` 가져오기 {#data-imports}

**추가된 버전: v12.10.0**

[`data:` URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs)은 다음 MIME 유형으로 가져오는 데 지원됩니다.

- ES 모듈의 경우 `text/javascript`
- JSON의 경우 `application/json`
- Wasm의 경우 `application/wasm`

```js [ESM]
import 'data:text/javascript,console.log("hello!");';
import _ from 'data:application/json,"world!"' with { type: 'json' };
```

`data:` URL은 기본 제공 모듈의 경우 [단순 지정자](/ko/nodejs/api/esm#terminology)만 확인하고 [절대 지정자](/ko/nodejs/api/esm#terminology)만 확인합니다. [상대 지정자](/ko/nodejs/api/esm#terminology) 확인은 `data:`가 [특수 체계](https://url.spec.whatwg.org/#special-scheme)가 아니기 때문에 작동하지 않습니다. 예를 들어 `data:text/javascript,import "./foo";`에서 `./foo`를 로드하려고 하면 `data:` URL에 대한 상대 확인 개념이 없기 때문에 확인에 실패합니다.


#### `node:` imports {#node-imports}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v16.0.0, v14.18.0 | `node:` import 지원을 `require(...)`에 추가했습니다. |
| v14.13.1, v12.20.0 | 추가됨: v14.13.1, v12.20.0 |
:::

`node:` URL은 Node.js 내장 모듈을 로드하는 대체 수단으로 지원됩니다. 이 URL 체계를 사용하면 유효한 절대 URL 문자열로 내장 모듈을 참조할 수 있습니다.

```js [ESM]
import fs from 'node:fs/promises';
```
## Import attributes {#import-attributes}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v21.0.0, v20.10.0, v18.20.0 | Import Assertions에서 Import Attributes로 전환했습니다. |
| v17.1.0, v16.14.0 | 추가됨: v17.1.0, v16.14.0 |
:::

::: tip [안정적: 2 - 안정적]
[안정적: 2](/ko/nodejs/api/documentation#stability-index) [안정성: 2](/ko/nodejs/api/documentation#stability-index) - 안정적
:::

[Import attributes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import/with)는 모듈 지정자와 함께 더 많은 정보를 전달하기 위해 모듈 import 문에 대한 인라인 구문입니다.

```js [ESM]
import fooData from './foo.json' with { type: 'json' };

const { default: barData } =
  await import('./bar.json', { with: { type: 'json' } });
```
Node.js는 `type` 속성만 지원하며, 다음 값을 지원합니다.

| 속성   `type` | 필요한 대상 |
| --- | --- |
| `'json'` | [JSON 모듈](/ko/nodejs/api/esm#json-modules) |
JSON 모듈을 가져올 때 `type: 'json'` 속성은 필수입니다.

## Built-in modules {#built-in-modules}

[Built-in modules](/ko/nodejs/api/modules#built-in-modules)은 공용 API의 명명된 내보내기를 제공합니다. CommonJS 내보내기 값인 기본 내보내기도 제공됩니다. 기본 내보내기는 명명된 내보내기를 수정하는 데 사용할 수 있습니다. 내장 모듈의 명명된 내보내기는 [`module.syncBuiltinESMExports()`](/ko/nodejs/api/module#modulesyncbuiltinesmexports)를 호출해야만 업데이트됩니다.

```js [ESM]
import EventEmitter from 'node:events';
const e = new EventEmitter();
```
```js [ESM]
import { readFile } from 'node:fs';
readFile('./foo.txt', (err, source) => {
  if (err) {
    console.error(err);
  } else {
    console.log(source);
  }
});
```
```js [ESM]
import fs, { readFileSync } from 'node:fs';
import { syncBuiltinESMExports } from 'node:module';
import { Buffer } from 'node:buffer';

fs.readFileSync = () => Buffer.from('Hello, ESM');
syncBuiltinESMExports();

fs.readFileSync === readFileSync;
```

## `import()` 표현식 {#import-expressions}

[동적 `import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import)는 CommonJS 및 ES 모듈 모두에서 지원됩니다. CommonJS 모듈에서는 ES 모듈을 로드하는 데 사용할 수 있습니다.

## `import.meta` {#importmeta}

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`import.meta` 메타 속성은 다음 속성을 포함하는 `Object`입니다. ES 모듈에서만 지원됩니다.

### `import.meta.dirname` {#importmetadirname}

**추가된 버전: v21.2.0, v20.11.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index).2 - 릴리스 후보
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 현재 모듈의 디렉터리 이름입니다. 이는 [`import.meta.filename`](/ko/nodejs/api/esm#importmetafilename)의 [`path.dirname()`](/ko/nodejs/api/path#pathdirnamepath)과 같습니다.

### `import.meta.filename` {#importmetafilename}

**추가된 버전: v21.2.0, v20.11.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index).2 - 릴리스 후보
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 현재 모듈의 정규화된 심볼릭 링크를 포함하는 절대 경로 및 파일 이름입니다.
- 이는 [`import.meta.url`](/ko/nodejs/api/esm#importmetaurl)의 [`url.fileURLToPath()`](/ko/nodejs/api/url#urlfileurltopathurl-options)와 같습니다.

### `import.meta.url` {#importmetaurl}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 모듈의 절대 `file:` URL입니다.

이는 현재 모듈 파일의 URL을 제공하는 브라우저에서와 정확히 동일하게 정의됩니다.

이를 통해 상대 파일 로드와 같은 유용한 패턴을 사용할 수 있습니다.

```js [ESM]
import { readFileSync } from 'node:fs';
const buffer = readFileSync(new URL('./data.proto', import.meta.url));
```
### `import.meta.resolve(specifier)` {#importmetaresolvespecifier}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v20.6.0, v18.19.0 | 비표준 `parentURL` 매개변수를 제외하고 더 이상 `--experimental-import-meta-resolve` CLI 플래그 뒤에 있지 않습니다. |
| v20.6.0, v18.19.0 | 이 API는 더 이상 로컬 FS에 있는 기존 파일을 매핑하지 않는 `file:` URL을 대상으로 할 때 예외를 발생시키지 않습니다. |
| v20.0.0, v18.19.0 | 이 API는 이제 Promise 대신 문자열을 동기적으로 반환합니다. |
| v16.2.0, v14.18.0 | WHATWG `URL` 객체에 대한 `parentURL` 매개변수 지원을 추가합니다. |
| v13.9.0, v12.16.2 | 추가된 버전: v13.9.0, v12.16.2 |
:::

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index).2 - 릴리스 후보
:::

- `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 현재 모듈을 기준으로 확인할 모듈 지정자입니다.
- 반환: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 지정자가 확인할 절대 URL 문자열입니다.

[`import.meta.resolve`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import.meta/resolve)는 각 모듈의 범위 내에서 모듈 상대적 확인 함수이며 URL 문자열을 반환합니다.

```js [ESM]
const dependencyAsset = import.meta.resolve('component-lib/asset.css');
// file:///app/node_modules/component-lib/asset.css
import.meta.resolve('./dep.js');
// file:///app/dep.js
```
Node.js 모듈 확인의 모든 기능이 지원됩니다. 종속성 확인은 패키지 내에서 허용된 내보내기 확인을 따릅니다.

**주의 사항**:

- 이는 `require.resolve`와 유사하게 성능에 영향을 줄 수 있는 동기식 파일 시스템 작업으로 이어질 수 있습니다.
- 이 기능은 사용자 지정 로더 내에서 사용할 수 없습니다(교착 상태가 발생할 수 있음).

**비표준 API**:

`--experimental-import-meta-resolve` 플래그를 사용하면 해당 함수는 두 번째 인수를 허용합니다.

- `parent` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api) 확인할 선택적 절대 부모 모듈 URL입니다. **기본값:** `import.meta.url`


## CommonJS와의 상호 운용성 {#interoperability-with-commonjs}

### `import` 구문 {#import-statements}

`import` 구문은 ES 모듈 또는 CommonJS 모듈을 참조할 수 있습니다. `import` 구문은 ES 모듈에서만 허용되지만, 동적 [`import()`](/ko/nodejs/api/esm#import-expressions) 표현식은 ES 모듈 로딩을 위해 CommonJS에서 지원됩니다.

[CommonJS 모듈](/ko/nodejs/api/esm#commonjs-namespaces)을 가져올 때, `module.exports` 객체가 기본 내보내기로 제공됩니다. 명명된 내보내기는 더 나은 생태계 호환성을 위한 편의로서 정적 분석을 통해 제공될 수 있습니다.

### `require` {#require}

CommonJS 모듈 `require`는 현재 동기 ES 모듈(즉, 최상위 `await`를 사용하지 않는 ES 모듈)의 로딩만 지원합니다.

자세한 내용은 [`require()`를 사용하여 ECMAScript 모듈 로딩](/ko/nodejs/api/modules#loading-ecmascript-modules-using-require)을 참조하십시오.

### CommonJS 네임스페이스 {#commonjs-namespaces}

::: info [역사]
| 버전 | 변경 사항 |
| --- | --- |
| v23.0.0 | CJS 네임스페이스에 `'module.exports'` 내보내기 마커를 추가했습니다. |
| v14.13.0 | 추가됨: v14.13.0 |
:::

CommonJS 모듈은 모든 유형이 될 수 있는 `module.exports` 객체로 구성됩니다.

이를 지원하기 위해 ECMAScript 모듈에서 CommonJS를 가져올 때, CommonJS 모듈에 대한 네임스페이스 래퍼가 생성되며, 이는 항상 CommonJS `module.exports` 값을 가리키는 `default` 내보내기 키를 제공합니다.

또한 CommonJS 모듈의 소스 텍스트에 대해 최선을 다하는 정적 분석이 수행되어 `module.exports`의 값에서 네임스페이스에 제공할 내보내기의 정적 목록을 얻습니다. 이러한 네임스페이스는 CJS 모듈 평가 이전에 생성되어야 하기 때문에 필요합니다.

이러한 CommonJS 네임스페이스 객체는 또한 CommonJS에서의 표현이 네임스페이스 값이 아닌 이 값을 사용함을 명확하게 나타내기 위해 `default` 내보내기를 `'module.exports'` 명명된 내보내기로 제공합니다. 이는 [`require(esm)`](/ko/nodejs/api/modules#loading-ecmascript-modules-using-require) 상호 운용성 지원에서 `'module.exports'` 내보내기 이름의 처리 의미 체계를 반영합니다.

CommonJS 모듈을 가져올 때, ES 모듈 기본 가져오기 또는 해당 슈가 구문을 사용하여 안정적으로 가져올 수 있습니다.

```js [ESM]
import { default as cjs } from 'cjs';
// 위와 동일
import cjsSugar from 'cjs';

console.log(cjs);
console.log(cjs === cjsSugar);
// 출력:
//   <module.exports>
//   true
```
이 모듈 네임스페이스 특이 객체는 `import * as m from 'cjs'` 또는 동적 가져오기를 사용할 때 직접 관찰할 수 있습니다.

```js [ESM]
import * as m from 'cjs';
console.log(m);
console.log(m === await import('cjs'));
// 출력:
//   [Module] { default: <module.exports>, 'module.exports': <module.exports> }
//   true
```
JS 생태계의 기존 사용법과의 더 나은 호환성을 위해, Node.js는 또한 가져온 모든 CommonJS 모듈의 CommonJS 명명된 내보내기를 결정하여 정적 분석 프로세스를 사용하여 별도의 ES 모듈 내보내기로 제공하려고 시도합니다.

예를 들어, 다음과 같이 작성된 CommonJS 모듈을 고려하십시오.

```js [CJS]
// cjs.cjs
exports.name = 'exported';
```
앞의 모듈은 ES 모듈에서 명명된 가져오기를 지원합니다.

```js [ESM]
import { name } from './cjs.cjs';
console.log(name);
// 출력: 'exported'

import cjs from './cjs.cjs';
console.log(cjs);
// 출력: { name: 'exported' }

import * as m from './cjs.cjs';
console.log(m);
// 출력:
//   [Module] {
//     default: { name: 'exported' },
//     'module.exports': { name: 'exported' },
//     name: 'exported'
//   }
```
모듈 네임스페이스 특이 객체가 기록되는 마지막 예에서 볼 수 있듯이, `name` 내보내기는 `module.exports` 객체에서 복사되어 모듈이 가져올 때 ES 모듈 네임스페이스에 직접 설정됩니다.

라이브 바인딩 업데이트 또는 `module.exports`에 추가된 새 내보내기는 이러한 명명된 내보내기에 대해 감지되지 않습니다.

명명된 내보내기의 감지는 일반적인 구문 패턴을 기반으로 하지만 항상 명명된 내보내기를 올바르게 감지하는 것은 아닙니다. 이러한 경우, 위에서 설명한 기본 가져오기 형식을 사용하는 것이 더 나은 선택일 수 있습니다.

명명된 내보내기 감지는 많은 일반적인 내보내기 패턴, 재내보내기 패턴 및 빌드 도구 및 트랜스파일러 출력을 다룹니다. 구현된 정확한 의미 체계는 [cjs-module-lexer](https://github.com/nodejs/cjs-module-lexer/tree/1.2.2)를 참조하십시오.


### ES 모듈과 CommonJS의 차이점 {#differences-between-es-modules-and-commonjs}

#### `require`, `exports` 또는 `module.exports` 없음 {#no-require-exports-or-moduleexports}

대부분의 경우 ES 모듈 `import`를 사용하여 CommonJS 모듈을 로드할 수 있습니다.

필요한 경우 [`module.createRequire()`](/ko/nodejs/api/module#modulecreaterequirefilename)를 사용하여 ES 모듈 내에서 `require` 함수를 구성할 수 있습니다.

#### `__filename` 또는 `__dirname` 없음 {#no-__filename-or-__dirname}

이러한 CommonJS 변수는 ES 모듈에서 사용할 수 없습니다.

`__filename` 및 `__dirname` 사용 사례는 [`import.meta.filename`](/ko/nodejs/api/esm#importmetafilename) 및 [`import.meta.dirname`](/ko/nodejs/api/esm#importmetadirname)을 통해 복제할 수 있습니다.

#### 애드온 로딩 없음 {#no-addon-loading}

[애드온](/ko/nodejs/api/addons)은 현재 ES 모듈 가져오기에서 지원되지 않습니다.

대신 [`module.createRequire()`](/ko/nodejs/api/module#modulecreaterequirefilename) 또는 [`process.dlopen`](/ko/nodejs/api/process#processdlopenmodule-filename-flags)을 사용하여 로드할 수 있습니다.

#### `require.resolve` 없음 {#no-requireresolve}

상대적 해결은 `new URL('./local', import.meta.url)`을 통해 처리할 수 있습니다.

전체 `require.resolve` 대체에 대해서는 [import.meta.resolve](/ko/nodejs/api/esm#importmetaresolvespecifier) API가 있습니다.

또는 `module.createRequire()`를 사용할 수 있습니다.

#### `NODE_PATH` 없음 {#no-node_path}

`NODE_PATH`는 `import` 지정자를 해결하는 데 사용되지 않습니다. 이 동작을 원하면 심볼릭 링크를 사용하십시오.

#### `require.extensions` 없음 {#no-requireextensions}

`require.extensions`는 `import`에서 사용되지 않습니다. 모듈 사용자 정의 후크는 대체 기능을 제공할 수 있습니다.

#### `require.cache` 없음 {#no-requirecache}

`require.cache`는 ES 모듈 로더에 자체 캐시가 있으므로 `import`에서 사용되지 않습니다.

## JSON 모듈 {#json-modules}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v23.1.0 | JSON 모듈은 더 이상 실험적이지 않습니다. |
:::

::: tip [안정성: 2 - 안정적]
[안정성: 2](/ko/nodejs/api/documentation#stability-index) [안정성: 2](/ko/nodejs/api/documentation#stability-index) - 안정적
:::

JSON 파일을 `import`로 참조할 수 있습니다.

```js [ESM]
import packageConfig from './package.json' with { type: 'json' };
```
`with { type: 'json' }` 구문은 필수입니다. [가져오기 속성](/ko/nodejs/api/esm#import-attributes)을 참조하십시오.

가져온 JSON은 `default` 내보내기만 노출합니다. 명명된 내보내기는 지원되지 않습니다. 중복을 피하기 위해 CommonJS 캐시에 캐시 항목이 생성됩니다. JSON 모듈이 동일한 경로에서 이미 가져온 경우 CommonJS에서 동일한 객체가 반환됩니다.


## Wasm 모듈 {#wasm-modules}

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

WebAssembly 모듈 가져오기는 `--experimental-wasm-modules` 플래그에서 지원되며, 모든 `.wasm` 파일을 일반 모듈로 가져오고 해당 모듈 가져오기도 지원합니다.

이 통합은 [WebAssembly용 ES 모듈 통합 제안](https://github.com/webassembly/esm-integration)과 일치합니다.

예를 들어 다음 내용을 포함하는 `index.mjs`가 있습니다.

```js [ESM]
import * as M from './module.wasm';
console.log(M);
```
다음을 통해 실행됩니다.

```bash [BASH]
node --experimental-wasm-modules index.mjs
```
`module.wasm`의 인스턴스화를 위한 내보내기 인터페이스를 제공합니다.

## 최상위 `await` {#top-level-await}

**추가됨: v14.8.0**

`await` 키워드는 ECMAScript 모듈의 최상위 본문에서 사용할 수 있습니다.

다음 내용을 가진 `a.mjs`가 있다고 가정합니다.

```js [ESM]
export const five = await Promise.resolve(5);
```
그리고 다음 내용을 가진 `b.mjs`가 있다고 가정합니다.

```js [ESM]
import { five } from './a.mjs';

console.log(five); // `5`를 기록합니다.
```
```bash [BASH]
node b.mjs # 작동합니다.
```
최상위 `await` 표현식이 해결되지 않으면 `node` 프로세스가 `13` [상태 코드](/ko/nodejs/api/process#exit-codes)로 종료됩니다.

```js [ESM]
import { spawn } from 'node:child_process';
import { execPath } from 'node:process';

spawn(execPath, [
  '--input-type=module',
  '--eval',
  // 결코 해결되지 않는 Promise:
  'await new Promise(() => {})',
]).once('exit', (code) => {
  console.log(code); // `13`을 기록합니다.
});
```
## 로더 {#loaders}

이전의 로더 문서는 이제 [모듈: 사용자 정의 후크](/ko/nodejs/api/module#customization-hooks)에 있습니다.

## 해결 및 로딩 알고리즘 {#resolution-and-loading-algorithm}

### 특징 {#features}

기본 해결기는 다음과 같은 속성을 가집니다.

- ES 모듈에서 사용되는 FileURL 기반 해결
- 상대 및 절대 URL 해결
- 기본 확장자 없음
- 폴더 메인 없음
- node_modules를 통한 빈 지정자 패키지 해결 조회
- 알 수 없는 확장자 또는 프로토콜에서 실패하지 않음
- 선택적으로 로딩 단계에 형식 힌트를 제공할 수 있습니다.

기본 로더는 다음과 같은 속성을 가집니다.

- `node:` URL을 통한 내장 모듈 로딩 지원
- `data:` URL을 통한 "인라인" 모듈 로딩 지원
- `file:` 모듈 로딩 지원
- 다른 URL 프로토콜에서 실패함
- `file:` 로딩에 대한 알 수 없는 확장자에서 실패함(`.cjs`, `.js`, `.mjs`만 지원)


### 해결 알고리즘 {#resolution-algorithm}

ES 모듈 지정자를 로드하는 알고리즘은 아래 **ESM_RESOLVE** 메서드를 통해 제공됩니다. 이는 parentURL에 상대적인 모듈 지정자에 대해 해결된 URL을 반환합니다.

해결 알고리즘은 제안된 모듈 형식과 함께 모듈 로드에 대해 완전히 해결된 URL을 결정합니다. 해결 알고리즘은 해결된 URL 프로토콜을 로드할 수 있는지 여부 또는 파일 확장명이 허용되는지 여부를 결정하지 않습니다. 대신 이러한 유효성 검사는 로드 단계에서 Node.js에서 적용됩니다 (예 : `file:`, `data:` 또는 `node:`가 아닌 프로토콜을 가진 URL을 로드하도록 요청받은 경우).

또한 알고리즘은 확장명을 기반으로 파일 형식을 결정하려고 시도합니다 (아래 `ESM_FILE_FORMAT` 알고리즘 참조). 파일 확장명을 인식하지 못하는 경우 (예 : `.mjs`, `.cjs` 또는 `.json`이 아닌 경우) `undefined` 형식이 반환되며, 이는 로드 단계에서 오류를 발생시킵니다.

해결된 URL의 모듈 형식을 결정하는 알고리즘은 **ESM_FILE_FORMAT**에 의해 제공되며, 이는 모든 파일에 대해 고유한 모듈 형식을 반환합니다. *"module"* 형식은 ECMAScript 모듈에 대해 반환되는 반면, *"commonjs"* 형식은 레거시 CommonJS 로더를 통한 로드를 나타내는 데 사용됩니다. *"addon"*과 같은 추가 형식은 향후 업데이트에서 확장될 수 있습니다.

다음 알고리즘에서 모든 서브루틴 오류는 달리 명시되지 않는 한 이러한 최상위 루틴의 오류로 전파됩니다.

*defaultConditions*는 조건부 환경 이름 배열 `["node", "import"]`입니다.

리졸버는 다음 오류를 발생시킬 수 있습니다.

- *잘못된 모듈 지정자*: 모듈 지정자가 유효하지 않은 URL, 패키지 이름 또는 패키지 하위 경로 지정자입니다.
- *잘못된 패키지 구성*: package.json 구성이 유효하지 않거나 잘못된 구성을 포함합니다.
- *잘못된 패키지 대상*: 패키지 내보내기 또는 가져오기는 잘못된 유형 또는 문자열 대상인 패키지에 대한 대상 모듈을 정의합니다.
- *패키지 경로가 내보내지지 않음*: 패키지 내보내기가 지정된 모듈에 대해 패키지에서 대상 하위 경로를 정의하거나 허용하지 않습니다.
- *패키지 가져오기가 정의되지 않음*: 패키지 가져오기가 지정자를 정의하지 않습니다.
- *모듈을 찾을 수 없음*: 요청된 패키지 또는 모듈이 존재하지 않습니다.
- *지원되지 않는 디렉터리 가져오기*: 해결된 경로는 디렉터리에 해당하며, 이는 모듈 가져오기에 지원되는 대상이 아닙니다.


### 해상도 알고리즘 사양 {#resolution-algorithm-specification}

**ESM_RESOLVE**(*specifier*, *parentURL*)

**PACKAGE_RESOLVE**(*packageSpecifier*, *parentURL*)

**PACKAGE_SELF_RESOLVE**(*packageName*, *packageSubpath*, *parentURL*)

**PACKAGE_EXPORTS_RESOLVE**(*packageURL*, *subpath*, *exports*, *conditions*)

**PACKAGE_IMPORTS_RESOLVE**(*specifier*, *parentURL*, *conditions*)

**PACKAGE_IMPORTS_EXPORTS_RESOLVE**(*matchKey*, *matchObj*, *packageURL*, *isImports*, *conditions*)

**PATTERN_KEY_COMPARE**(*keyA*, *keyB*)

**PACKAGE_TARGET_RESOLVE**(*packageURL*, *target*, *patternMatch*, *isImports*, *conditions*)

**ESM_FILE_FORMAT**(*url*)

**LOOKUP_PACKAGE_SCOPE**(*url*)

**READ_PACKAGE_JSON**(*packageURL*)

**DETECT_MODULE_SYNTAX**(*source*)

### ESM 지정자 해상도 알고리즘 사용자 정의 {#customizing-esm-specifier-resolution-algorithm}

[모듈 사용자 정의 후크](/ko/nodejs/api/module#customization-hooks)는 ESM 지정자 해상도 알고리즘을 사용자 정의하기 위한 메커니즘을 제공합니다. ESM 지정자에 대한 CommonJS 스타일 해상도를 제공하는 예는 [commonjs-extension-resolution-loader](https://github.com/nodejs/loaders-test/tree/main/commonjs-extension-resolution-loader)입니다.

