---
title: Node.js 패키지 문서
description: Node.js의 공식 패키지 문서를 탐색하여 패키지 관리, 생성, 게시 방법과 package.json, 의존성, 패키지 관리 도구에 대한 세부 정보를 알아보세요.
head:
  - - meta
    - name: og:title
      content: Node.js 패키지 문서 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js의 공식 패키지 문서를 탐색하여 패키지 관리, 생성, 게시 방법과 package.json, 의존성, 패키지 관리 도구에 대한 세부 정보를 알아보세요.
  - - meta
    - name: twitter:title
      content: Node.js 패키지 문서 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js의 공식 패키지 문서를 탐색하여 패키지 관리, 생성, 게시 방법과 package.json, 의존성, 패키지 관리 도구에 대한 세부 정보를 알아보세요.
---


# 모듈: 패키지 {#modules-packages}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v14.13.0, v12.20.0 | `"exports"` 패턴에 대한 지원 추가. |
| v14.6.0, v12.19.0 | 패키지 `"imports"` 필드 추가. |
| v13.7.0, v12.17.0 | 조건부 내보내기 플래그 해제. |
| v13.7.0, v12.16.0 | `--experimental-conditional-exports` 옵션 제거. 12.16.0에서 조건부 내보내기는 여전히 `--experimental-modules` 뒤에 숨겨져 있습니다. |
| v13.6.0, v12.16.0 | 해당 이름을 사용하여 패키지를 자체 참조하는 플래그 해제. |
| v12.7.0 | 클래식 `"main"` 필드에 대한 보다 강력한 대안으로 `"exports"` `package.json` 필드 도입. |
| v12.0.0 | `package.json` `"type"` 필드를 통해 `.js` 파일 확장자를 사용하는 ES 모듈 지원 추가. |
:::

## 소개 {#introduction}

패키지는 `package.json` 파일로 설명되는 폴더 트리입니다. 패키지는 `package.json` 파일을 포함하는 폴더와 다른 `package.json` 파일을 포함하는 다음 폴더 또는 `node_modules`라는 폴더까지의 모든 하위 폴더로 구성됩니다.

이 페이지는 Node.js에서 정의한 [`package.json`](/ko/nodejs/api/packages#nodejs-packagejson-field-definitions) 필드에 대한 참조와 함께 `package.json` 파일을 작성하는 패키지 작성자를 위한 지침을 제공합니다.

## 모듈 시스템 결정 {#determining-module-system}

### 소개 {#introduction_1}

Node.js는 다음을 [ES 모듈](/ko/nodejs/api/esm)로 처리합니다. `node`에 초기 입력으로 전달되거나 `import` 문 또는 `import()` 표현식으로 참조될 때:

- `.mjs` 확장자를 가진 파일.
- 가장 가까운 상위 `package.json` 파일에 최상위 [`"type"`](/ko/nodejs/api/packages#type) 필드가 `"module"` 값으로 포함된 경우 `.js` 확장자를 가진 파일.
- `--eval`에 대한 인수로 전달되거나 `--input-type=module` 플래그와 함께 `STDIN`을 통해 `node`로 파이프된 문자열.
- [ES 모듈](/ko/nodejs/api/esm)로 성공적으로 구문 분석된 구문 (예: `import` 또는 `export` 문 또는 `import.meta`)을 포함하는 코드. 해석 방법을 명시적으로 표시하지 않습니다. 명시적 표시는 `.mjs` 또는 `.cjs` 확장자, `"module"` 또는 `"commonjs"` 값을 가진 `package.json` `"type"` 필드 또는 `--input-type` 플래그입니다. 동적 `import()` 표현식은 CommonJS 또는 ES 모듈에서 지원되며 파일을 ES 모듈로 처리하도록 강제하지 않습니다. [구문 감지](/ko/nodejs/api/packages#syntax-detection)를 참조하십시오.

Node.js는 다음을 [CommonJS](/ko/nodejs/api/modules)로 처리합니다. `node`에 초기 입력으로 전달되거나 `import` 문 또는 `import()` 표현식으로 참조될 때:

- `.cjs` 확장자를 가진 파일.
- 가장 가까운 상위 `package.json` 파일에 `"commonjs"` 값이 있는 최상위 필드 [`"type"`](/ko/nodejs/api/packages#type)가 포함된 경우 `.js` 확장자를 가진 파일.
- `--eval` 또는 `--print`에 대한 인수로 전달되거나 `--input-type=commonjs` 플래그와 함께 `STDIN`을 통해 파이프된 문자열.
- 상위 `package.json` 파일이 없거나 가장 가까운 상위 `package.json` 파일에 `type` 필드가 없고 코드가 CommonJS로 성공적으로 평가될 수 있는 `.js` 확장자를 가진 파일. 즉, Node.js는 먼저 이러한 "모호한" 파일을 CommonJS로 실행하려고 시도하고 파서가 ES 모듈 구문을 찾았기 때문에 CommonJS로 평가가 실패하면 ES 모듈로 다시 평가합니다.

"모호한" 파일에 ES 모듈 구문을 작성하면 성능 비용이 발생하므로 작성자는 가능한 한 명시적으로 작성하는 것이 좋습니다. 특히 패키지 작성자는 모든 소스가 CommonJS인 패키지에서도 항상 `package.json` 파일에 [`"type"`](/ko/nodejs/api/packages#type) 필드를 포함해야 합니다. 패키지 유형에 대해 명시적으로 지정하면 Node.js의 기본 유형이 변경될 경우 패키지를 미래에도 사용할 수 있으며 빌드 도구와 로더가 패키지의 파일을 해석하는 방법을 결정하는 데 더 쉽게 사용할 수 있습니다.


### 구문 감지 {#syntax-detection}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v22.7.0 | 구문 감지가 기본적으로 활성화되었습니다. |
| v21.1.0, v20.10.0 | 다음에서 추가됨: v21.1.0, v20.10.0 |
:::

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index).2 - 릴리스 후보
:::

Node.js는 모호한 입력의 소스 코드를 검사하여 ES 모듈 구문이 포함되어 있는지 확인합니다. 해당 구문이 감지되면 입력은 ES 모듈로 처리됩니다.

모호한 입력은 다음과 같이 정의됩니다.

- `.js` 확장자 또는 확장자가 없는 파일, 제어하는 `package.json` 파일이 없거나 `type` 필드가 없는 파일.
- `--input-type`이 지정되지 않은 경우 문자열 입력 (`--eval` 또는 `STDIN`).

ES 모듈 구문은 CommonJS로 평가할 때 오류를 발생시키는 구문으로 정의됩니다. 여기에는 다음이 포함됩니다.

- `import` 문 (단, CommonJS에서 유효한 `import()` 식은 *제외*).
- `export` 문.
- `import.meta` 참조.
- 모듈 최상위 수준의 `await`.
- CommonJS 래퍼 변수 (`require`, `module`, `exports`, `__dirname`, `__filename`)의 어휘적 재선언.

### 모듈 로더 {#modules-loaders}

Node.js에는 지정자를 확인하고 모듈을 로드하는 두 가지 시스템이 있습니다.

CommonJS 모듈 로더가 있습니다.

- 완전히 동기적입니다.
- `require()` 호출을 처리합니다.
- 몽키 패치 가능합니다.
- [폴더를 모듈로 지원합니다](/ko/nodejs/api/modules#folders-as-modules).
- 지정자를 확인할 때 정확한 일치 항목이 없으면 확장자 (`.js`, `.json`, 마지막으로 `.node`)를 추가한 다음 [폴더를 모듈로](/ko/nodejs/api/modules#folders-as-modules) 확인하려고 시도합니다.
- `.json`을 JSON 텍스트 파일로 처리합니다.
- `.node` 파일은 `process.dlopen()`으로 로드된 컴파일된 애드온 모듈로 해석됩니다.
- `.json` 또는 `.node` 확장자가 없는 모든 파일을 JavaScript 텍스트 파일로 처리합니다.
- 모듈 그래프가 동기적인 경우 (최상위 `await`를 포함하지 않음) [CommonJS 모듈에서 ECMAScript 모듈을 로드](/ko/nodejs/api/modules#loading-ecmascript-modules-using-require)하는 데만 사용할 수 있습니다. ECMAScript 모듈이 아닌 JavaScript 텍스트 파일을 로드하는 데 사용되는 경우 파일은 CommonJS 모듈로 로드됩니다.

ECMAScript 모듈 로더가 있습니다.

- `require()`에 사용할 모듈을 로드하는 경우가 아니면 비동기적입니다.
- `import` 문 및 `import()` 식을 처리합니다.
- 몽키 패치 가능하지 않으며 [로더 후크](/ko/nodejs/api/esm#loaders)를 사용하여 사용자 정의할 수 있습니다.
- 폴더를 모듈로 지원하지 않으며 디렉토리 인덱스 (예: `'./startup/index.js'`)를 완전히 지정해야 합니다.
- 확장자 검색을 수행하지 않습니다. 지정자가 상대적 또는 절대 파일 URL인 경우 파일 확장자를 제공해야 합니다.
- JSON 모듈을 로드할 수 있지만 import 유형 속성이 필요합니다.
- JavaScript 텍스트 파일의 경우 `.js`, `.mjs` 및 `.cjs` 확장자만 허용합니다.
- JavaScript CommonJS 모듈을 로드하는 데 사용할 수 있습니다. 해당 모듈은 `cjs-module-lexer`를 통해 전달되어 명명된 내보내기를 식별하려고 시도하며, 정적 분석을 통해 결정할 수 있는 경우 사용할 수 있습니다. 가져온 CommonJS 모듈은 URL이 절대 경로로 변환된 다음 CommonJS 모듈 로더를 통해 로드됩니다.


### `package.json` 및 파일 확장자 {#packagejson-and-file-extensions}

패키지 내에서 [`package.json`](/ko/nodejs/api/packages#nodejs-packagejson-field-definitions) [`"type"`](/ko/nodejs/api/packages#type) 필드는 Node.js가 `.js` 파일을 해석하는 방법을 정의합니다. `package.json` 파일에 `"type"` 필드가 없으면 `.js` 파일은 [CommonJS](/ko/nodejs/api/modules)로 처리됩니다.

`package.json`의 `"type"` 값이 `"module"`이면 Node.js는 해당 패키지 내의 `.js` 파일을 [ES 모듈](/ko/nodejs/api/esm) 구문을 사용하는 것으로 해석합니다.

`"type"` 필드는 초기 진입점(`node my-app.js`)뿐만 아니라 `import` 문과 `import()` 표현식으로 참조되는 파일에도 적용됩니다.

```js [ESM]
// my-app.js, 동일한 폴더에 "type": "module"이 있는 package.json
// 파일이 있으므로 ES 모듈로 처리됩니다.

import './startup/init.js';
// ./startup에 package.json 파일이 없으므로 ES 모듈로 로드됩니다.
// 따라서 한 단계 위의 "type" 값을 상속합니다.

import 'commonjs-package';
// ./node_modules/commonjs-package/package.json에
// "type" 필드가 없거나 "type": "commonjs"가 포함되어 있으므로 CommonJS로 로드됩니다.

import './node_modules/commonjs-package/index.js';
// ./node_modules/commonjs-package/package.json에
// "type" 필드가 없거나 "type": "commonjs"가 포함되어 있으므로 CommonJS로 로드됩니다.
```
`.mjs`로 끝나는 파일은 가장 가까운 상위 `package.json`에 관계없이 항상 [ES 모듈](/ko/nodejs/api/esm)로 로드됩니다.

`.cjs`로 끝나는 파일은 가장 가까운 상위 `package.json`에 관계없이 항상 [CommonJS](/ko/nodejs/api/modules)로 로드됩니다.

```js [ESM]
import './legacy-file.cjs';
// .cjs는 항상 CommonJS로 로드되므로 CommonJS로 로드됩니다.

import 'commonjs-package/src/index.mjs';
// .mjs는 항상 ES 모듈로 로드되므로 ES 모듈로 로드됩니다.
```
`.mjs` 및 `.cjs` 확장자를 사용하여 동일한 패키지 내에서 유형을 혼합할 수 있습니다.

- `"type": "module"` 패키지 내에서 Node.js는 특정 파일을 `.cjs` 확장자로 이름을 지정하여 [CommonJS](/ko/nodejs/api/modules)로 해석하도록 지시할 수 있습니다(`.js` 및 `.mjs` 파일은 모두 `"module"` 패키지 내에서 ES 모듈로 처리되기 때문입니다).
- `"type": "commonjs"` 패키지 내에서 Node.js는 특정 파일을 `.mjs` 확장자로 이름을 지정하여 [ES 모듈](/ko/nodejs/api/esm)로 해석하도록 지시할 수 있습니다(`.js` 및 `.cjs` 파일은 모두 `"commonjs"` 패키지 내에서 CommonJS로 처리되기 때문입니다).


### `--input-type` 플래그 {#--input-type-flag}

**추가된 버전: v12.0.0**

`--eval` (또는 `-e`)에 인수로 전달되거나 `STDIN`을 통해 `node`로 파이프되는 문자열은 `--input-type=module` 플래그가 설정되면 [ES 모듈](/ko/nodejs/api/esm)로 처리됩니다.

```bash [BASH]
node --input-type=module --eval "import { sep } from 'node:path'; console.log(sep);"

echo "import { sep } from 'node:path'; console.log(sep);" | node --input-type=module
```
완전성을 위해 문자열 입력을 CommonJS로 명시적으로 실행하기 위한 `--input-type=commonjs`도 있습니다. 이는 `--input-type`이 지정되지 않은 경우의 기본 동작입니다.

## 패키지 관리자 결정 {#determining-package-manager}

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

모든 Node.js 프로젝트는 게시되면 모든 패키지 관리자로 설치할 수 있을 것으로 예상되지만, 개발 팀은 종종 하나의 특정 패키지 관리자를 사용해야 합니다. 이 프로세스를 더 쉽게 만들기 위해 Node.js는 환경에서 모든 패키지 관리자를 투명하게 사용할 수 있도록 하는 것을 목표로 하는 [Corepack](/ko/nodejs/api/corepack)이라는 도구를 제공합니다. 단, Node.js가 설치되어 있어야 합니다.

기본적으로 Corepack은 특정 패키지 관리자를 강제하지 않으며 각 Node.js 릴리스와 연결된 일반적인 "마지막으로 알려진 양호한" 버전을 사용하지만 프로젝트의 `package.json`에서 [`"packageManager"`](/ko/nodejs/api/packages#packagemanager) 필드를 설정하여 이 경험을 개선할 수 있습니다.

## 패키지 진입점 {#package-entry-points}

패키지의 `package.json` 파일에서 두 개의 필드가 패키지의 진입점을 정의할 수 있습니다. [`"main"`](/ko/nodejs/api/packages#main)과 [`"exports"`](/ko/nodejs/api/packages#exports)입니다. 두 필드 모두 ES 모듈 및 CommonJS 모듈 진입점에 적용됩니다.

[`"main"`](/ko/nodejs/api/packages#main) 필드는 모든 버전의 Node.js에서 지원되지만 기능은 제한적입니다. 패키지의 기본 진입점만 정의합니다.

[`"exports"`](/ko/nodejs/api/packages#exports)는 [`"main"`](/ko/nodejs/api/packages#main)에 대한 최신 대안을 제공하여 여러 진입점을 정의하고 환경 간의 조건부 진입점 해결을 지원하며 **<a href="#exports"><code>"exports"</code></a>에 정의된 진입점 외에 다른 진입점을 방지합니다**. 이 캡슐화를 통해 모듈 작성자는 패키지의 공용 인터페이스를 명확하게 정의할 수 있습니다.

현재 지원되는 Node.js 버전을 대상으로 하는 새 패키지의 경우 [`"exports"`](/ko/nodejs/api/packages#exports) 필드를 권장합니다. Node.js 10 이하를 지원하는 패키지의 경우 [`"main"`](/ko/nodejs/api/packages#main) 필드가 필요합니다. [`"exports"`](/ko/nodejs/api/packages#exports)와 [`"main"`](/ko/nodejs/api/packages#main)이 모두 정의된 경우 지원되는 Node.js 버전에서는 [`"exports"`](/ko/nodejs/api/packages#exports) 필드가 [`"main"`](/ko/nodejs/api/packages#main) 필드보다 우선합니다.

[조건부 내보내기](/ko/nodejs/api/packages#conditional-exports)는 [`"exports"`](/ko/nodejs/api/packages#exports) 내에서 사용하여 패키지가 `require` 또는 `import`를 통해 참조되는지 여부를 포함하여 환경별로 다른 패키지 진입점을 정의할 수 있습니다. 단일 패키지에서 CommonJS와 ES 모듈을 모두 지원하는 방법에 대한 자세한 내용은 [이중 CommonJS/ES 모듈 패키지 섹션](/ko/nodejs/api/packages#dual-commonjses-module-packages)을 참조하십시오.

[`"exports"`](/ko/nodejs/api/packages#exports) 필드를 도입하는 기존 패키지는 패키지의 소비자가 정의되지 않은 진입점(예: [`package.json`](/ko/nodejs/api/packages#nodejs-packagejson-field-definitions)(예: `require('your-package/package.json')`))을 사용하는 것을 방지합니다. **이는 파괴적인 변경일 가능성이 높습니다.**

[`"exports"`](/ko/nodejs/api/packages#exports)의 도입을 파괴적이지 않게 만들려면 이전에 지원되었던 모든 진입점이 내보내지도록 하십시오. 패키지의 공용 API가 잘 정의되도록 진입점을 명시적으로 지정하는 것이 가장 좋습니다. 예를 들어 이전에 `main`, `lib`, `feature` 및 `package.json`을 내보낸 프로젝트는 다음 `package.exports`를 사용할 수 있습니다.

```json [JSON]
{
  "name": "my-package",
  "exports": {
    ".": "./lib/index.js",
    "./lib": "./lib/index.js",
    "./lib/index": "./lib/index.js",
    "./lib/index.js": "./lib/index.js",
    "./feature": "./feature/index.js",
    "./feature/index": "./feature/index.js",
    "./feature/index.js": "./feature/index.js",
    "./package.json": "./package.json"
  }
}
```
또는 프로젝트는 내보내기 패턴을 사용하여 확장된 하위 경로를 사용하거나 사용하지 않고 전체 폴더를 내보내도록 선택할 수 있습니다.

```json [JSON]
{
  "name": "my-package",
  "exports": {
    ".": "./lib/index.js",
    "./lib": "./lib/index.js",
    "./lib/*": "./lib/*.js",
    "./lib/*.js": "./lib/*.js",
    "./feature": "./feature/index.js",
    "./feature/*": "./feature/*.js",
    "./feature/*.js": "./feature/*.js",
    "./package.json": "./package.json"
  }
}
```
위의 코드는 모든 마이너 패키지 버전에 대한 이전 버전과의 호환성을 제공하므로 패키지에 대한 향후 주요 변경 사항은 내보내기를 노출된 특정 기능 내보내기로 적절하게 제한할 수 있습니다.

```json [JSON]
{
  "name": "my-package",
  "exports": {
    ".": "./lib/index.js",
    "./feature/*.js": "./feature/*.js",
    "./feature/internal/*": null
  }
}
```

### 주요 진입점 내보내기 {#main-entry-point-export}

새 패키지를 작성할 때 [`"exports"`](/ko/nodejs/api/packages#exports) 필드를 사용하는 것이 좋습니다.

```json [JSON]
{
  "exports": "./index.js"
}
```
[`"exports"`](/ko/nodejs/api/packages#exports) 필드가 정의되면 패키지의 모든 하위 경로는 캡슐화되어 더 이상 임포터에서 사용할 수 없습니다. 예를 들어, `require('pkg/subpath.js')`는 [`ERR_PACKAGE_PATH_NOT_EXPORTED`](/ko/nodejs/api/errors#err_package_path_not_exported) 오류를 발생시킵니다.

이러한 내보내기 캡슐화는 도구에 대한 패키지 인터페이스와 패키지에 대한 semver 업그레이드를 처리할 때 더 안정적인 보장을 제공합니다. `require('/path/to/node_modules/pkg/subpath.js')`와 같은 패키지의 절대 하위 경로를 직접 요구하면 `subpath.js`가 여전히 로드되므로 강력한 캡슐화는 아닙니다.

현재 지원되는 모든 Node.js 버전과 최신 빌드 도구는 `"exports"` 필드를 지원합니다. 이전 버전의 Node.js 또는 관련 빌드 도구를 사용하는 프로젝트의 경우 `"main"` 필드를 `"exports"`와 함께 포함하여 동일한 모듈을 가리키도록 하여 호환성을 확보할 수 있습니다.

```json [JSON]
{
  "main": "./index.js",
  "exports": "./index.js"
}
```
### 하위 경로 내보내기 {#subpath-exports}

**추가됨: v12.7.0**

[`"exports"`](/ko/nodejs/api/packages#exports) 필드를 사용할 때 주요 진입점을 `"."` 하위 경로로 취급하여 주요 진입점과 함께 사용자 지정 하위 경로를 정의할 수 있습니다.

```json [JSON]
{
  "exports": {
    ".": "./index.js",
    "./submodule.js": "./src/submodule.js"
  }
}
```
이제 [`"exports"`](/ko/nodejs/api/packages#exports)에 정의된 하위 경로만 소비자가 가져올 수 있습니다.

```js [ESM]
import submodule from 'es-module-package/submodule.js';
// ./node_modules/es-module-package/src/submodule.js를 로드합니다.
```
다른 하위 경로는 오류가 발생합니다.

```js [ESM]
import submodule from 'es-module-package/private-module.js';
// ERR_PACKAGE_PATH_NOT_EXPORTED 오류를 발생시킵니다.
```
#### 하위 경로의 확장자 {#extensions-in-subpaths}

패키지 작성자는 내보내기에서 확장자가 있는 하위 경로(`import 'pkg/subpath.js'`) 또는 확장자가 없는 하위 경로(`import 'pkg/subpath'`)를 제공해야 합니다. 이를 통해 내보낸 각 모듈에 대해 하나의 하위 경로만 존재하므로 모든 종속 항목이 동일한 일관된 지정자를 가져와 소비자에 대한 패키지 계약을 명확하게 유지하고 패키지 하위 경로 완료를 단순화합니다.

전통적으로 패키지는 확장자가 없는 스타일을 사용하는 경향이 있었는데, 이는 가독성이 뛰어나고 패키지 내 파일의 실제 경로를 숨기는 데 도움이 됩니다.

이제 [import maps](https://github.com/WICG/import-maps)가 브라우저 및 기타 JavaScript 런타임에서 패키지 해결을 위한 표준을 제공함에 따라 확장자가 없는 스타일을 사용하면 import map 정의가 부풀려질 수 있습니다. 명시적 파일 확장자를 사용하면 [패키지 폴더 매핑](https://github.com/WICG/import-maps#packages-via-trailing-slashes)을 활용하여 가능한 경우 패키지 하위 경로 내보내기당 별도의 맵 항목 대신 여러 하위 경로를 매핑할 수 있습니다. 이는 상대 및 절대 가져오기 지정자에서 [전체 지정자 경로](/ko/nodejs/api/esm#mandatory-file-extensions)를 사용해야 하는 요구 사항도 반영합니다.


### 내보내기 단순화 {#exports-sugar}

**Added in: v12.11.0**

`"."` 내보내기가 유일한 내보내기인 경우, [`"exports"`](/ko/nodejs/api/packages#exports) 필드는 이 경우를 위한 간단한 방법으로 직접 [`"exports"`](/ko/nodejs/api/packages#exports) 필드 값을 제공합니다.

```json [JSON]
{
  "exports": {
    ".": "./index.js"
  }
}
```
다음과 같이 작성할 수 있습니다.

```json [JSON]
{
  "exports": "./index.js"
}
```
### 서브 경로 가져오기 {#subpath-imports}

**Added in: v14.6.0, v12.19.0**

[`"exports"`](/ko/nodejs/api/packages#exports) 필드 외에도 패키지 자체 내에서 가져오기 지정자에만 적용되는 개인 매핑을 만드는 패키지 `"imports"` 필드가 있습니다.

`"imports"` 필드의 항목은 외부 패키지 지정자와 구별되도록 항상 `#`으로 시작해야 합니다.

예를 들어, imports 필드를 사용하여 내부 모듈에 대한 조건부 내보내기의 이점을 얻을 수 있습니다.

```json [JSON]
// package.json
{
  "imports": {
    "#dep": {
      "node": "dep-node-native",
      "default": "./dep-polyfill.js"
    }
  },
  "dependencies": {
    "dep-node-native": "^1.0.0"
  }
}
```
여기서 `import '#dep'`은 외부 패키지 `dep-node-native`의 해결(결과적으로 해당 내보내기 포함)을 얻지 않고, 대신 다른 환경에서 패키지를 기준으로 로컬 파일 `./dep-polyfill.js`를 가져옵니다.

`"exports"` 필드와 달리 `"imports"` 필드는 외부 패키지로의 매핑을 허용합니다.

imports 필드에 대한 해결 규칙은 exports 필드와 유사합니다.

### 서브 경로 패턴 {#subpath-patterns}

::: info [History]
| Version | Changes |
| --- | --- |
| v16.10.0, v14.19.0 | "imports" 필드에서 패턴 트레일러를 지원합니다. |
| v16.9.0, v14.19.0 | 패턴 트레일러를 지원합니다. |
| v14.13.0, v12.20.0 | Added in: v14.13.0, v12.20.0 |
:::

내보내기 또는 가져오기가 적은 패키지의 경우 각 내보내기 서브 경로 항목을 명시적으로 나열하는 것이 좋습니다. 그러나 서브 경로가 많은 패키지의 경우 `package.json`이 비대해지고 유지 관리 문제가 발생할 수 있습니다.

이러한 사용 사례에서는 서브 경로 내보내기 패턴을 대신 사용할 수 있습니다.

```json [JSON]
// ./node_modules/es-module-package/package.json
{
  "exports": {
    "./features/*.js": "./src/features/*.js"
  },
  "imports": {
    "#internal/*.js": "./src/internal/*.js"
  }
}
```
**<code>*</code> 맵은 문자열 대체 구문일 뿐이므로 중첩된 서브 경로를 노출합니다.**

오른쪽의 `*`의 모든 인스턴스는 `/` 구분 기호를 포함하는 경우를 포함하여 이 값으로 대체됩니다.

```js [ESM]
import featureX from 'es-module-package/features/x.js';
// ./node_modules/es-module-package/src/features/x.js를 로드합니다.

import featureY from 'es-module-package/features/y/y.js';
// ./node_modules/es-module-package/src/features/y/y.js를 로드합니다.

import internalZ from '#internal/z.js';
// ./node_modules/es-module-package/src/internal/z.js를 로드합니다.
```
이는 파일 확장자에 대한 특별한 처리 없이 직접적인 정적 일치 및 대체입니다. 매핑의 양쪽에 `"*.js"`를 포함하면 노출된 패키지 내보내기가 JS 파일로만 제한됩니다.

패키지에 대한 개별 내보내기를 패키지 내 파일 목록에 대해 오른쪽 대상 패턴을 `**` glob으로 처리하여 결정할 수 있으므로 내보내기가 정적으로 열거 가능하다는 속성이 내보내기 패턴으로 유지됩니다. `node_modules` 경로가 내보내기 대상에서 금지되어 있으므로 이 확장은 패키지 자체의 파일에만 의존합니다.

개인 하위 폴더를 패턴에서 제외하려면 `null` 대상을 사용할 수 있습니다.

```json [JSON]
// ./node_modules/es-module-package/package.json
{
  "exports": {
    "./features/*.js": "./src/features/*.js",
    "./features/private-internal/*": null
  }
}
```
```js [ESM]
import featureInternal from 'es-module-package/features/private-internal/m.js';
// 오류 발생: ERR_PACKAGE_PATH_NOT_EXPORTED

import featureX from 'es-module-package/features/x.js';
// ./node_modules/es-module-package/src/features/x.js를 로드합니다.
```

### 조건부 내보내기 {#conditional-exports}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v13.7.0, v12.16.0 | 조건부 내보내기의 플래그를 해제합니다. |
| v13.2.0, v12.16.0 | 다음에서 추가됨: v13.2.0, v12.16.0 |
:::

조건부 내보내기는 특정 조건에 따라 다른 경로에 매핑하는 방법을 제공합니다. CommonJS 및 ES 모듈 가져오기 모두에서 지원됩니다.

예를 들어, `require()` 및 `import`에 대해 서로 다른 ES 모듈 내보내기를 제공하려는 패키지는 다음과 같이 작성할 수 있습니다.

```json [JSON]
// package.json
{
  "exports": {
    "import": "./index-module.js",
    "require": "./index-require.cjs"
  },
  "type": "module"
}
```
Node.js는 조건을 정의할 때 가장 구체적인 것부터 가장 덜 구체적인 것 순으로 나열된 다음 조건을 구현합니다.

- `"node-addons"` - `"node"`와 유사하며 모든 Node.js 환경에 대해 일치합니다. 이 조건은 기본 C++ 애드온을 사용하는 진입점을, 보다 보편적이고 기본 애드온에 의존하지 않는 진입점과 대조적으로 제공하는 데 사용할 수 있습니다. 이 조건은 [`--no-addons` 플래그](/ko/nodejs/api/cli#--no-addons)를 통해 비활성화할 수 있습니다.
- `"node"` - 모든 Node.js 환경에 대해 일치합니다. CommonJS 또는 ES 모듈 파일일 수 있습니다. *대부분의 경우 Node.js 플랫폼을 명시적으로 호출하는 것은
필요하지 않습니다.*
- `"import"` - 패키지가 `import` 또는 `import()`를 통해 로드되거나 ECMAScript 모듈 로더에 의한 최상위 가져오기 또는 확인 작업을 통해 로드될 때 일치합니다. 대상 파일의 모듈 형식에 관계없이 적용됩니다. *항상 <code>"require"</code>와 상호 배타적입니다.*
- `"require"` - 패키지가 `require()`를 통해 로드될 때 일치합니다. 조건이 대상 파일의 모듈 형식에 관계없이 일치하더라도 참조된 파일은 `require()`로 로드할 수 있어야 합니다. 예상되는 형식에는 CommonJS, JSON, 기본 애드온 및 ES 모듈이 포함됩니다. *항상
<code>"import"</code>와 상호 배타적입니다.*
- `"module-sync"` - 패키지가 `import`, `import()` 또는 `require()`를 통해 로드되든 상관없이 일치합니다. 형식은 모듈 그래프에 최상위 await가 포함되지 않은 ES 모듈일 것으로 예상됩니다. 포함된 경우 모듈이 `require()`로 처리될 때 `ERR_REQUIRE_ASYNC_MODULE`이 발생합니다.
- `"default"` - 항상 일치하는 일반적인 폴백입니다. CommonJS 또는 ES 모듈 파일일 수 있습니다. *이 조건은 항상 마지막에 와야 합니다.*

[`"exports"`](/ko/nodejs/api/packages#exports) 객체 내에서 키 순서는 중요합니다. 조건 일치 중에 이전 항목이 우선 순위가 높고 나중 항목보다 우선합니다. *일반적인 규칙은 조건이 객체 순서에서 가장 구체적인 것부터
가장 덜 구체적인 것 순이어야 한다는 것입니다*.

`"import"` 및 `"require"` 조건을 사용하면 몇 가지 위험이 발생할 수 있으며 이에 대한 자세한 내용은 [이중 CommonJS/ES 모듈 패키지 섹션](/ko/nodejs/api/packages#dual-commonjses-module-packages)에 설명되어 있습니다.

`"node-addons"` 조건은 기본 C++ 애드온을 사용하는 진입점을 제공하는 데 사용할 수 있습니다. 그러나 이 조건은 [`--no-addons` 플래그](/ko/nodejs/api/cli#--no-addons)를 통해 비활성화할 수 있습니다. `"node-addons"`를 사용하는 경우 `"default"`를 기본 애드온 대신 WebAssembly를 사용하여 보다 보편적인 진입점을 제공하는 개선 사항으로 취급하는 것이 좋습니다.

조건부 내보내기를 내보내기 하위 경로로 확장할 수도 있습니다. 예를 들어 다음과 같습니다.

```json [JSON]
{
  "exports": {
    ".": "./index.js",
    "./feature.js": {
      "node": "./feature-node.js",
      "default": "./feature.js"
    }
  }
}
```
`require('pkg/feature.js')` 및 `import 'pkg/feature.js')`가 Node.js와 다른 JS 환경 간에 다른 구현을 제공할 수 있는 패키지를 정의합니다.

환경 분기를 사용하는 경우 가능하면 항상 `"default"` 조건을 포함하십시오. `"default"` 조건을 제공하면 알 수 없는 모든 JS 환경에서 이 범용 구현을 사용할 수 있으므로 이러한 JS 환경이 조건부 내보내기가 있는 패키지를 지원하기 위해 기존 환경인 척할 필요가 없습니다. 이러한 이유로 `"node"` 및 `"default"` 조건 분기를 사용하는 것이 일반적으로 `"node"` 및 `"browser"` 조건 분기를 사용하는 것보다 좋습니다.


### 중첩 조건 {#nested-conditions}

Node.js는 직접 매핑 외에도 중첩 조건 객체를 지원합니다.

예를 들어 Node.js에서만 이중 모드 진입점을 사용하고 브라우저에서는 사용하지 않는 패키지를 정의하려면 다음과 같습니다.

```json [JSON]
{
  "exports": {
    "node": {
      "import": "./feature-node.mjs",
      "require": "./feature-node.cjs"
    },
    "default": "./feature.mjs"
  }
}
```
조건은 평면 조건과 마찬가지로 순서대로 계속 일치됩니다. 중첩 조건에 매핑이 없으면 상위 조건의 나머지 조건을 계속 확인합니다. 이러한 방식으로 중첩 조건은 중첩된 JavaScript `if` 문과 유사하게 동작합니다.

### 사용자 조건 해결 {#resolving-user-conditions}

**다음 버전에서 추가됨: v14.9.0, v12.19.0**

Node.js를 실행할 때 `--conditions` 플래그를 사용하여 사용자 지정 사용자 조건을 추가할 수 있습니다.

```bash [BASH]
node --conditions=development index.js
```
이렇게 하면 패키지 가져오기 및 내보내기에서 `"development"` 조건이 해결되고 기존 `"node"`, `"node-addons"`, `"default"`, `"import"` 및 `"require"` 조건이 적절하게 해결됩니다.

반복 플래그를 사용하여 사용자 지정 조건을 원하는 만큼 설정할 수 있습니다.

일반적인 조건에는 영숫자 문자만 포함되어야 하며 필요한 경우 ":" "-", 또는 "="를 구분 기호로 사용해야 합니다. 다른 모든 것은 노드 외부에서 호환성 문제가 발생할 수 있습니다.

노드에서는 조건에 제한이 거의 없지만 특히 다음이 포함됩니다.

### 커뮤니티 조건 정의 {#community-conditions-definitions}

Node.js 코어에 구현된 [`"import"`, `"require"`, `"node"`, `"module-sync"`, `"node-addons"` 및 `"default"` 조건을 제외한 조건 문자열은 기본적으로 무시됩니다.](/ko/nodejs/api/packages#conditional-exports)

다른 플랫폼은 다른 조건을 구현할 수 있으며 Node.js에서 사용자 조건은 [`--conditions` / `-C` 플래그](/ko/nodejs/api/packages#resolving-user-conditions)를 통해 활성화할 수 있습니다.

사용자 지정 패키지 조건은 올바른 사용을 보장하기 위해 명확한 정의가 필요하므로 일반적인 알려진 패키지 조건 목록과 엄격한 정의가 아래에 제공되어 에코시스템 조정을 지원합니다.

- `"types"` - 주어진 내보내기에 대한 타이핑 파일을 해결하기 위해 타이핑 시스템에서 사용할 수 있습니다. *이 조건은 항상 먼저 포함되어야 합니다.*
- `"browser"` - 모든 웹 브라우저 환경.
- `"development"` - 개발 전용 환경 진입점을 정의하는 데 사용할 수 있습니다. 예를 들어 개발 모드에서 실행할 때 더 나은 오류 메시지와 같은 추가 디버깅 컨텍스트를 제공합니다. *항상 <code>"production"</code>과 상호 배타적이어야 합니다.*
- `"production"` - 프로덕션 환경 진입점을 정의하는 데 사용할 수 있습니다. *항상 <code>"development"</code>과 상호 배타적이어야 합니다.*

다른 런타임의 경우 플랫폼별 조건 키 정의는 [WinterCG](https://wintercg.org/)에서 [런타임 키](https://runtime-keys.proposal.wintercg.org/) 제안 사양으로 유지 관리됩니다.

새로운 조건 정의는 [이 섹션에 대한 Node.js 문서](https://github.com/nodejs/node/blob/HEAD/doc/api/packages.md#conditions-definitions)에 풀 요청을 생성하여 이 목록에 추가할 수 있습니다. 여기에 새로운 조건 정의를 나열하기 위한 요구 사항은 다음과 같습니다.

- 정의는 모든 구현자에게 명확하고 모호하지 않아야 합니다.
- 조건이 필요한 이유에 대한 사용 사례가 명확하게 정당화되어야 합니다.
- 충분한 기존 구현 사용이 있어야 합니다.
- 조건 이름은 다른 조건 정의 또는 널리 사용되는 조건과 충돌해서는 안 됩니다.
- 조건 정의 목록은 다른 방법으로는 불가능한 에코시스템에 조정 이점을 제공해야 합니다. 예를 들어 회사별 또는 애플리케이션별 조건에는 반드시 해당되지 않습니다.
- 조건은 Node.js 사용자가 Node.js 코어 문서에 있을 것으로 예상하는 조건이어야 합니다. `"types"` 조건이 좋은 예입니다. 실제로 [런타임 키](https://runtime-keys.proposal.wintercg.org/) 제안에 속하지 않지만 여기 Node.js 문서에 적합합니다.

위의 정의는 적절한 시기에 전용 조건 레지스트리로 이동될 수 있습니다.


### 패키지 이름을 사용하여 패키지 자체 참조 {#self-referencing-a-package-using-its-name}

::: info [History]
| 버전 | 변경 사항 |
| --- | --- |
| v13.6.0, v12.16.0 | 패키지 이름을 사용하여 패키지 자체를 참조하는 것을 플래그 해제합니다. |
| v13.1.0, v12.16.0 | 다음 버전에서 추가됨: v13.1.0, v12.16.0 |
:::

패키지 내에서 패키지의 `package.json` [`"exports"`](/ko/nodejs/api/packages#exports) 필드에 정의된 값은 패키지 이름을 통해 참조할 수 있습니다. 예를 들어, `package.json`이 다음과 같다고 가정합니다.

```json [JSON]
// package.json
{
  "name": "a-package",
  "exports": {
    ".": "./index.mjs",
    "./foo.js": "./foo.js"
  }
}
```
그러면 *해당 패키지*의 모든 모듈은 패키지 자체의 내보내기를 참조할 수 있습니다.

```js [ESM]
// ./a-module.mjs
import { something } from 'a-package'; // ./index.mjs에서 "something"을 가져옵니다.
```
자체 참조는 `package.json`에 [`"exports"`](/ko/nodejs/api/packages#exports)가 있는 경우에만 사용할 수 있으며, 해당 [`"exports"`](/ko/nodejs/api/packages#exports)(`package.json`에 있음)가 허용하는 항목만 가져올 수 있습니다. 따라서 이전 패키지가 주어진 경우 아래 코드는 런타임 오류를 생성합니다.

```js [ESM]
// ./another-module.mjs

// ./m.mjs에서 "another"를 가져옵니다. "package.json" "exports" 필드가
// "./m.mjs"라는 내보내기를 제공하지 않으므로 실패합니다.
import { another } from 'a-package/m.mjs';
```
자체 참조는 ES 모듈과 CommonJS 모듈 모두에서 `require`를 사용할 때도 사용할 수 있습니다. 예를 들어, 이 코드도 작동합니다.

```js [CJS]
// ./a-module.js
const { something } = require('a-package/foo.js'); // ./foo.js에서 로드합니다.
```
마지막으로 자체 참조는 범위가 지정된 패키지에서도 작동합니다. 예를 들어, 이 코드도 작동합니다.

```json [JSON]
// package.json
{
  "name": "@my/package",
  "exports": "./index.js"
}
```
```js [CJS]
// ./index.js
module.exports = 42;
```
```js [CJS]
// ./other.js
console.log(require('@my/package'));
```
```bash [BASH]
$ node other.js
42
```
## 이중 CommonJS/ES 모듈 패키지 {#dual-commonjs/es-module-packages}

자세한 내용은 [패키지 예제 저장소](https://github.com/nodejs/package-examples)를 참조하십시오.

## Node.js `package.json` 필드 정의 {#nodejs-packagejson-field-definitions}

이 섹션에서는 Node.js 런타임에서 사용되는 필드를 설명합니다. 다른 도구([npm](https://docs.npmjs.com/cli/v8/configuring-npm/package-json)과 같은)는 Node.js에서 무시되고 여기에 문서화되지 않은 추가 필드를 사용합니다.

`package.json` 파일의 다음 필드는 Node.js에서 사용됩니다.

- [`"name"`](/ko/nodejs/api/packages#name) - 패키지 내에서 명명된 가져오기를 사용할 때 관련됩니다. 패키지 관리자에서도 패키지 이름으로 사용됩니다.
- [`"main"`](/ko/nodejs/api/packages#main) - 내보내기가 지정되지 않은 경우, 그리고 내보내기 도입 이전의 Node.js 버전에서 패키지를 로드할 때의 기본 모듈입니다.
- [`"packageManager"`](/ko/nodejs/api/packages#packagemanager) - 패키지에 기여할 때 권장되는 패키지 관리자입니다. [Corepack](/ko/nodejs/api/corepack) 심에서 활용됩니다.
- [`"type"`](/ko/nodejs/api/packages#type) - `.js` 파일을 CommonJS 또는 ES 모듈로 로드할지 여부를 결정하는 패키지 유형입니다.
- [`"exports"`](/ko/nodejs/api/packages#exports) - 패키지 내보내기 및 조건부 내보내기입니다. 있는 경우 패키지 내에서 로드할 수 있는 하위 모듈을 제한합니다.
- [`"imports"`](/ko/nodejs/api/packages#imports) - 패키지 자체 내의 모듈에서 사용할 수 있는 패키지 가져오기입니다.


### `"name"` {#"name"}


::: info [History]
| 버전 | 변경 사항 |
| --- | --- |
| v13.6.0, v12.16.0 | `--experimental-resolve-self` 옵션 제거. |
| v13.1.0, v12.16.0 | 추가됨: v13.1.0, v12.16.0 |
:::

- 유형: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

```json [JSON]
{
  "name": "package-name"
}
```
`"name"` 필드는 패키지의 이름을 정의합니다. *npm* 레지스트리에 게시하려면 [특정 요구 사항](https://docs.npmjs.com/files/package.json#name)을 충족하는 이름이 필요합니다.

`"name"` 필드는 [`"exports"`](/ko/nodejs/api/packages#exports) 필드와 함께 패키지 이름을 사용하여 패키지를 [자체 참조](/ko/nodejs/api/packages#self-referencing-a-package-using-its-name)하는 데 사용할 수 있습니다.

### `"main"` {#"main"}

**추가됨: v0.4.0**

- 유형: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

```json [JSON]
{
  "main": "./index.js"
}
```
`"main"` 필드는 `node_modules` 조회를 통해 이름으로 가져올 때 패키지의 진입점을 정의합니다. 값은 경로입니다.

패키지에 [`"exports"`](/ko/nodejs/api/packages#exports) 필드가 있는 경우 이름을 통해 패키지를 가져올 때 `"main"` 필드보다 우선합니다.

또한 [패키지 디렉토리가 `require()`를 통해 로드될 때](/ko/nodejs/api/modules#folders-as-modules) 사용되는 스크립트를 정의합니다.

```js [CJS]
// ./path/to/directory/index.js로 해석됩니다.
require('./path/to/directory');
```
### `"packageManager"` {#"packagemanager"}

**추가됨: v16.9.0, v14.19.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

- 유형: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

```json [JSON]
{
  "packageManager": "<패키지 관리자 이름>@<버전>"
}
```
`"packageManager"` 필드는 현재 프로젝트에서 작업할 때 사용할 패키지 관리자를 정의합니다. [지원되는 패키지 관리자](/ko/nodejs/api/corepack#supported-package-managers) 중 하나로 설정할 수 있으며, Node.js 외에 다른 것을 설치하지 않고도 팀이 정확히 동일한 패키지 관리자 버전을 사용하도록 보장합니다.

이 필드는 현재 실험적이며 옵트인이 필요합니다. 자세한 내용은 [Corepack](/ko/nodejs/api/corepack) 페이지를 확인하십시오.


### `"type"` {#"type"}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v13.2.0, v12.17.0 | `--experimental-modules` 플래그를 제거했습니다. |
| v12.0.0 | 추가됨: v12.0.0 |
:::

- 유형: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`"type"` 필드는 해당 `package.json` 파일을 가장 가까운 부모로 갖는 모든 `.js` 파일에 대해 Node.js가 사용하는 모듈 형식을 정의합니다.

가장 가까운 부모 `package.json` 파일에 최상위 필드 `"type"`이 있고 값이 `"module"`인 경우 `.js`로 끝나는 파일은 ES 모듈로 로드됩니다.

가장 가까운 부모 `package.json`은 현재 폴더, 해당 폴더의 부모 등 node_modules 폴더 또는 볼륨 루트에 도달할 때까지 검색할 때 발견되는 첫 번째 `package.json`으로 정의됩니다.

```json [JSON]
// package.json
{
  "type": "module"
}
```
```bash [BASH]
# 이전 package.json과 동일한 폴더에 있음 {#in-same-folder-as-preceding-packagejson}
node my-app.js # ES 모듈로 실행
```
가장 가까운 부모 `package.json`에 `"type"` 필드가 없거나 `"type": "commonjs"`가 포함된 경우 `.js` 파일은 [CommonJS](/ko/nodejs/api/modules)로 처리됩니다. 볼륨 루트에 도달하고 `package.json`이 발견되지 않으면 `.js` 파일은 [CommonJS](/ko/nodejs/api/modules)로 처리됩니다.

가장 가까운 부모 `package.json`에 `"type": "module"`이 포함된 경우 `.js` 파일의 `import` 문은 ES 모듈로 처리됩니다.

```js [ESM]
// my-app.js, 위의 예와 동일한 부분
import './startup.js'; // package.json 때문에 ES 모듈로 로드됨
```
`"type"` 필드의 값에 관계없이 `.mjs` 파일은 항상 ES 모듈로 처리되고 `.cjs` 파일은 항상 CommonJS로 처리됩니다.

### `"exports"` {#"exports"}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v14.13.0, v12.20.0 | `"exports"` 패턴에 대한 지원을 추가했습니다. |
| v13.7.0, v12.17.0 | 조건부 내보내기 플래그를 제거했습니다. |
| v13.7.0, v12.16.0 | 논리적 조건부 내보내기 순서를 구현합니다. |
| v13.7.0, v12.16.0 | `--experimental-conditional-exports` 옵션을 제거합니다. 12.16.0에서 조건부 내보내기는 여전히 `--experimental-modules` 뒤에 있습니다. |
| v13.2.0, v12.16.0 | 조건부 내보내기를 구현합니다. |
| v12.7.0 | 추가됨: v12.7.0 |
:::

- 유형: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

```json [JSON]
{
  "exports": "./index.js"
}
```
`"exports"` 필드를 사용하면 `node_modules` 검색 또는 자체 이름에 대한 [자체 참조](/ko/nodejs/api/packages#self-referencing-a-package-using-its-name)를 통해 로드된 이름으로 가져올 때 패키지의 [진입점](/ko/nodejs/api/packages#package-entry-points)을 정의할 수 있습니다. Node.js 12+에서 [서브 경로 내보내기](/ko/nodejs/api/packages#subpath-exports) 및 [조건부 내보내기](/ko/nodejs/api/packages#conditional-exports)를 지원하면서 내부 내보내지 않은 모듈을 캡슐화할 수 있는 [`"main"`](/ko/nodejs/api/packages#main)의 대안으로 지원됩니다.

[조건부 내보내기](/ko/nodejs/api/packages#conditional-exports)는 `"exports"` 내에서 사용하여 패키지가 `require`를 통해 참조되는지 또는 `import`를 통해 참조되는지 여부를 포함하여 환경별로 다른 패키지 진입점을 정의할 수도 있습니다.

`"exports"`에 정의된 모든 경로는 `./`로 시작하는 상대 파일 URL이어야 합니다.


### `"imports"` {#"imports"}

**추가된 버전: v14.6.0, v12.19.0**

- 유형: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

```json [JSON]
// package.json
{
  "imports": {
    "#dep": {
      "node": "dep-node-native",
      "default": "./dep-polyfill.js"
    }
  },
  "dependencies": {
    "dep-node-native": "^1.0.0"
  }
}
```
imports 필드의 항목은 `#`로 시작하는 문자열이어야 합니다.

패키지 imports는 외부 패키지에 매핑을 허용합니다.

이 필드는 현재 패키지에 대한 [서브 경로 imports](/ko/nodejs/api/packages#subpath-imports)를 정의합니다.

