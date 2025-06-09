---
title: Node.js 문서 - 모듈
description: Node.js의 모듈에 관한 문서를 탐색하고, CommonJS, ES 모듈, 의존성 관리 및 모듈 해석 방법을 알아보세요.
head:
  - - meta
    - name: og:title
      content: Node.js 문서 - 모듈 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js의 모듈에 관한 문서를 탐색하고, CommonJS, ES 모듈, 의존성 관리 및 모듈 해석 방법을 알아보세요.
  - - meta
    - name: twitter:title
      content: Node.js 문서 - 모듈 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js의 모듈에 관한 문서를 탐색하고, CommonJS, ES 모듈, 의존성 관리 및 모듈 해석 방법을 알아보세요.
---


# 모듈: CommonJS 모듈 {#modules-commonjs-modules}

::: tip [안정됨: 2 - 안정됨]
[안정됨: 2](/ko/nodejs/api/documentation#stability-index) [안정성: 2](/ko/nodejs/api/documentation#stability-index) - 안정됨
:::

CommonJS 모듈은 Node.js용 JavaScript 코드를 패키징하는 원래 방법입니다. Node.js는 브라우저 및 기타 JavaScript 런타임에서 사용되는 [ECMAScript 모듈](/ko/nodejs/api/esm) 표준도 지원합니다.

Node.js에서는 각 파일이 별도의 모듈로 취급됩니다. 예를 들어 `foo.js`라는 파일이 있다고 가정해 보겠습니다.

```js [ESM]
const circle = require('./circle.js');
console.log(`반지름이 4인 원의 면적은 ${circle.area(4)}입니다.`);
```
첫 번째 줄에서 `foo.js`는 `foo.js`와 동일한 디렉터리에 있는 모듈 `circle.js`를 로드합니다.

다음은 `circle.js`의 내용입니다.

```js [ESM]
const { PI } = Math;

exports.area = (r) => PI * r ** 2;

exports.circumference = (r) => 2 * PI * r;
```
모듈 `circle.js`는 함수 `area()`와 `circumference()`를 내보냈습니다. 함수와 객체는 특수한 `exports` 객체에 추가 속성을 지정하여 모듈의 루트에 추가됩니다.

모듈에 로컬 변수는 비공개로 유지됩니다. 모듈은 Node.js에 의해 함수로 래핑되기 때문입니다([모듈 래퍼](/ko/nodejs/api/modules#the-module-wrapper) 참조). 이 예제에서 변수 `PI`는 `circle.js`에 비공개입니다.

`module.exports` 속성에 새로운 값(예: 함수 또는 객체)을 할당할 수 있습니다.

다음 코드에서 `bar.js`는 Square 클래스를 내보내는 `square` 모듈을 사용합니다.

```js [ESM]
const Square = require('./square.js');
const mySquare = new Square(2);
console.log(`mySquare의 면적은 ${mySquare.area()}입니다.`);
```
`square` 모듈은 `square.js`에 정의되어 있습니다.

```js [ESM]
// exports에 할당하면 모듈이 수정되지 않으므로 module.exports를 사용해야 합니다.
module.exports = class Square {
  constructor(width) {
    this.width = width;
  }

  area() {
    return this.width ** 2;
  }
};
```
CommonJS 모듈 시스템은 [`module` 코어 모듈](/ko/nodejs/api/module)에 구현되어 있습니다.

## 활성화 {#enabling}

Node.js에는 CommonJS 모듈과 [ECMAScript 모듈](/ko/nodejs/api/esm)의 두 가지 모듈 시스템이 있습니다.

기본적으로 Node.js는 다음을 CommonJS 모듈로 처리합니다.

- `.cjs` 확장명을 가진 파일;
- 가장 가까운 상위 `package.json` 파일에 `"type"` 최상위 필드가 있고 값이 `"commonjs"`인 경우 `.js` 확장명을 가진 파일;
- 가장 가까운 상위 `package.json` 파일에 `"type"` 최상위 필드가 없거나 상위 폴더에 `package.json`이 없는 경우 `.js` 확장명을 가진 파일 또는 확장명 없는 파일; 단, 파일에 ES 모듈로 평가되지 않으면 오류가 발생하는 구문이 포함되어 있지 않은 경우. 패키지 작성자는 모든 소스가 CommonJS인 패키지에서도 [`"type"`](/ko/nodejs/api/packages#type) 필드를 포함해야 합니다. 패키지 유형을 명시적으로 지정하면 빌드 도구와 로더가 패키지의 파일을 해석하는 방법을 더 쉽게 결정할 수 있습니다.
- `.mjs`, `.cjs`, `.json`, `.node` 또는 `.js`가 아닌 확장명을 가진 파일(가장 가까운 상위 `package.json` 파일에 [`"type"`](/ko/nodejs/api/packages#type) 최상위 필드가 있고 값이 `"module"`인 경우 이러한 파일은 프로그램의 명령줄 진입점으로 사용되는 경우가 아니라 `require()`를 통해 포함되는 경우에만 CommonJS 모듈로 인식됩니다).

자세한 내용은 [모듈 시스템 결정](/ko/nodejs/api/packages#determining-module-system)을 참조하십시오.

`require()`를 호출하면 항상 CommonJS 모듈 로더를 사용합니다. `import()`를 호출하면 항상 ECMAScript 모듈 로더를 사용합니다.


## 메인 모듈 접근 {#accessing-the-main-module}

Node.js에서 파일을 직접 실행하면 `require.main`이 해당 파일의 `module`로 설정됩니다. 즉, `require.main === module`을 테스트하여 파일이 직접 실행되었는지 확인할 수 있습니다.

`foo.js` 파일의 경우, `node foo.js`를 통해 실행하면 `true`가 되지만, `require('./foo')`로 실행하면 `false`가 됩니다.

진입점이 CommonJS 모듈이 아닌 경우, `require.main`은 `undefined`이며 메인 모듈에 접근할 수 없습니다.

## 패키지 관리자 팁 {#package-manager-tips}

Node.js `require()` 함수의 의미는 합리적인 디렉터리 구조를 지원할 수 있을 만큼 일반적이도록 설계되었습니다. `dpkg`, `rpm`, `npm`과 같은 패키지 관리자 프로그램은 수정 없이 Node.js 모듈에서 네이티브 패키지를 빌드할 수 있기를 바랍니다.

다음은 가능한 디렉터리 구조 제안입니다.

`/usr/lib/node/\<some-package\>/\<some-version\>` 폴더에 특정 버전의 패키지 내용이 있다고 가정해 보겠습니다.

패키지는 서로 의존할 수 있습니다. 패키지 `foo`를 설치하려면 특정 버전의 패키지 `bar`를 설치해야 할 수 있습니다. `bar` 패키지 자체에 종속성이 있을 수 있으며, 경우에 따라 충돌하거나 순환 종속성을 형성할 수도 있습니다.

Node.js는 로드하는 모든 모듈의 `realpath`를 조회하고(즉, 심볼릭 링크를 확인) [`node_modules` 폴더에서 종속성을 찾기](/ko/nodejs/api/modules#loading-from-node_modules-folders) 때문에 다음과 같은 아키텍처로 이 상황을 해결할 수 있습니다.

- `/usr/lib/node/foo/1.2.3/`: `foo` 패키지 내용, 버전 1.2.3.
- `/usr/lib/node/bar/4.3.2/`: `foo`가 의존하는 `bar` 패키지 내용.
- `/usr/lib/node/foo/1.2.3/node_modules/bar`: `/usr/lib/node/bar/4.3.2/`에 대한 심볼릭 링크.
- `/usr/lib/node/bar/4.3.2/node_modules/*`: `bar`가 의존하는 패키지에 대한 심볼릭 링크.

따라서 순환이 발생하거나 종속성 충돌이 발생하더라도 모든 모듈은 사용할 수 있는 종속성 버전을 얻을 수 있습니다.

`foo` 패키지의 코드가 `require('bar')`를 수행하면 `/usr/lib/node/foo/1.2.3/node_modules/bar`에 심볼릭 링크된 버전을 가져옵니다. 그런 다음 `bar` 패키지의 코드가 `require('quux')`를 호출하면 `/usr/lib/node/bar/4.3.2/node_modules/quux`에 심볼릭 링크된 버전을 가져옵니다.

또한 모듈 조회 프로세스를 더욱 최적화하기 위해 패키지를 `/usr/lib/node`에 직접 넣는 대신 `/usr/lib/node_modules/\<name\>/\<version\>`에 넣을 수 있습니다. 그러면 Node.js는 `/usr/node_modules` 또는 `/node_modules`에서 누락된 종속성을 찾는 데 신경 쓰지 않습니다.

Node.js REPL에서 모듈을 사용할 수 있도록 하려면 `$NODE_PATH` 환경 변수에 `/usr/lib/node_modules` 폴더를 추가하는 것이 유용할 수 있습니다. `node_modules` 폴더를 사용하는 모듈 조회는 모두 상대적이며 `require()`를 호출하는 파일의 실제 경로를 기반으로 하므로 패키지 자체는 어디에나 있을 수 있습니다.


## `require()`를 사용하여 ECMAScript 모듈 로드하기 {#loading-ecmascript-modules-using-require}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v23.5.0 | 이 기능은 기본적으로 실험적 경고를 더 이상 내보내지 않지만, `--trace-require-module`로 경고를 여전히 내보낼 수 있습니다. |
| v23.0.0 | 이 기능은 더 이상 `--experimental-require-module` CLI 플래그 뒤에 있지 않습니다. |
| v23.0.0 | `require(esm)`에서 `'module.exports'` 인터롭 내보내기를 지원합니다. |
| v22.0.0, v20.17.0 | v22.0.0, v20.17.0에 추가되었습니다. |
:::

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index).2 - 릴리스 후보
:::

`.mjs` 확장자는 [ECMAScript 모듈](/ko/nodejs/api/esm)을 위해 예약되어 있습니다. ECMAScript 모듈로 파싱되는 파일에 대한 자세한 내용은 [모듈 시스템 결정](/ko/nodejs/api/packages#determining-module-system) 섹션을 참조하세요.

`require()`는 다음 요구 사항을 충족하는 ECMAScript 모듈 로드만 지원합니다.

- 모듈이 완전히 동기적입니다 (최상위 `await`가 포함되어 있지 않음).
- 다음 조건 중 하나를 충족합니다.

로드되는 ES 모듈이 요구 사항을 충족하면 `require()`는 해당 모듈을 로드하고 모듈 네임스페이스 객체를 반환할 수 있습니다. 이 경우 동적 `import()`와 유사하지만 동기적으로 실행되고 네임스페이스 객체를 직접 반환합니다.

다음 ES 모듈을 사용합니다.

```js [ESM]
// distance.mjs
export function distance(a, b) { return (b.x - a.x) ** 2 + (b.y - a.y) ** 2; }
```
```js [ESM]
// point.mjs
export default class Point {
  constructor(x, y) { this.x = x; this.y = y; }
}
```
CommonJS 모듈은 `require()`를 사용하여 해당 모듈을 로드할 수 있습니다.

```js [CJS]
const distance = require('./distance.mjs');
console.log(distance);
// [Module: null prototype] {
//   distance: [Function: distance]
// }

const point = require('./point.mjs');
console.log(point);
// [Module: null prototype] {
//   default: [class Point],
//   __esModule: true,
// }
```
ES 모듈을 CommonJS로 변환하는 기존 도구와의 상호 운용성을 위해, `require()`를 통해 실제 ES 모듈을 로드할 수 있는 경우, 반환된 네임스페이스에는 `default` 내보내기가 있는 경우 `__esModule: true` 속성이 포함되어 도구에서 생성된 소비 코드가 실제 ES 모듈에서 기본 내보내기를 인식할 수 있습니다. 네임스페이스가 이미 `__esModule`을 정의하는 경우 이 속성은 추가되지 않습니다. 이 속성은 실험적이며 향후 변경될 수 있습니다. 기존 생태계 규칙에 따라 ES 모듈을 CommonJS 모듈로 변환하는 도구에서만 사용해야 합니다. CommonJS에서 직접 작성된 코드는 이 속성에 의존하지 않아야 합니다.

ES 모듈에 명명된 내보내기와 기본 내보내기가 모두 포함된 경우, `require()`에서 반환된 결과는 모듈 네임스페이스 객체이며, `import()`에서 반환된 결과와 유사하게 기본 내보내기를 `.default` 속성에 배치합니다. `require(esm)`에서 직접 반환할 내용을 사용자 지정하려면 ES 모듈은 문자열 이름 `"module.exports"`를 사용하여 원하는 값을 내보낼 수 있습니다.

```js [ESM]
// point.mjs
export default class Point {
  constructor(x, y) { this.x = x; this.y = y; }
}

// `Point`에 정적 속성으로 추가되지 않으면
// 이 모듈의 CommonJS 소비자는 `distance`를 잃게 됩니다.
export function distance(a, b) { return (b.x - a.x) ** 2 + (b.y - a.y) ** 2; }
export { Point as 'module.exports' }
```
```js [CJS]
const Point = require('./point.mjs');
console.log(Point); // [class Point]

// 'module.exports'가 사용되면 명명된 내보내기가 손실됩니다.
const { distance } = require('./point.mjs');
console.log(distance); // undefined
```
위의 예에서 `module.exports` 내보내기 이름이 사용되면 CommonJS 소비자는 명명된 내보내기를 잃게 됩니다. CommonJS 소비자가 명명된 내보내기에 계속 액세스할 수 있도록 하려면 모듈은 기본 내보내기가 명명된 내보내기가 속성으로 연결된 객체인지 확인해야 합니다. 예를 들어 위의 예에서 `distance`는 기본 내보내기인 `Point` 클래스에 정적 메서드로 연결될 수 있습니다.

```js [ESM]
export function distance(a, b) { return (b.x - a.x) ** 2 + (b.y - a.y) ** 2; }

export default class Point {
  constructor(x, y) { this.x = x; this.y = y; }
  static distance = distance;
}

export { Point as 'module.exports' }
```
```js [CJS]
const Point = require('./point.mjs');
console.log(Point); // [class Point]

const { distance } = require('./point.mjs');
console.log(distance); // [Function: distance]
```
`require()`되는 모듈에 최상위 `await`가 포함되어 있거나, 해당 모듈 그래프가 최상위 `await`를 `import`하는 경우, [`ERR_REQUIRE_ASYNC_MODULE`](/ko/nodejs/api/errors#err_require_async_module)이 throw됩니다. 이 경우 사용자는 [`import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import)를 사용하여 비동기 모듈을 로드해야 합니다.

`--experimental-print-required-tla`가 활성화된 경우, 평가 전에 `ERR_REQUIRE_ASYNC_MODULE`을 throw하는 대신 Node.js는 모듈을 평가하고, 최상위 await의 위치를 찾으려고 시도하고, 해당 위치를 인쇄하여 사용자가 수정할 수 있도록 돕습니다.

`require()`를 사용하여 ES 모듈을 로드하는 기능은 현재 실험적이며 `--no-experimental-require-module`을 사용하여 비활성화할 수 있습니다. 이 기능이 사용되는 위치를 인쇄하려면 [`--trace-require-module`](/ko/nodejs/api/cli#--trace-require-modulemode)을 사용합니다.

이 기능은 [`process.features.require_module`](/ko/nodejs/api/process#processfeaturesrequire_module)이 `true`인지 확인하여 감지할 수 있습니다.


## 모두 함께 {#all-together}

`require()`가 호출될 때 로드될 정확한 파일 이름을 얻으려면 `require.resolve()` 함수를 사용합니다.

위의 모든 것을 종합하여 `require()`가 수행하는 작업의 개략적인 알고리즘을 의사 코드로 나타내면 다음과 같습니다.

```text [TEXT]
require(X) from module at path Y
1. X가 코어 모듈인 경우,
   a. 코어 모듈을 반환합니다.
   b. 중단합니다.
2. X가 '/'로 시작하는 경우
   a. Y를 파일 시스템 루트로 설정합니다.
3. X가 './', '/' 또는 '../'로 시작하는 경우
   a. LOAD_AS_FILE(Y + X)
   b. LOAD_AS_DIRECTORY(Y + X)
   c. "찾을 수 없음" 오류를 발생시킵니다.
4. X가 '#'로 시작하는 경우
   a. LOAD_PACKAGE_IMPORTS(X, dirname(Y))
5. LOAD_PACKAGE_SELF(X, dirname(Y))
6. LOAD_NODE_MODULES(X, dirname(Y))
7. "찾을 수 없음" 오류를 발생시킵니다.

MAYBE_DETECT_AND_LOAD(X)
1. X가 CommonJS 모듈로 구문 분석되면 X를 CommonJS 모듈로 로드합니다. 중단합니다.
2. 그렇지 않고 X의 소스 코드를 ECMAScript 모듈로 구문 분석할 수 있는 경우
  <a href="esm.md#resolver-algorithm-specification">ESM 확인자에 정의된 DETECT_MODULE_SYNTAX</a>를 사용합니다.
  a. X를 ECMAScript 모듈로 로드합니다. 중단합니다.
3. 1에서 X를 CommonJS로 구문 분석하려는 시도에서 SyntaxError를 발생시킵니다. 중단합니다.

LOAD_AS_FILE(X)
1. X가 파일인 경우 X를 해당 파일 확장자 형식으로 로드합니다. 중단합니다.
2. X.js가 파일인 경우,
    a. X에 가장 가까운 패키지 범위 SCOPE를 찾습니다.
    b. 범위를 찾을 수 없는 경우
      1. MAYBE_DETECT_AND_LOAD(X.js)
    c. SCOPE/package.json에 "type" 필드가 포함된 경우,
      1. "type" 필드가 "module"이면 X.js를 ECMAScript 모듈로 로드합니다. 중단합니다.
      2. "type" 필드가 "commonjs"이면 X.js를 CommonJS 모듈로 로드합니다. 중단합니다.
    d. MAYBE_DETECT_AND_LOAD(X.js)
3. X.json이 파일인 경우 X.json을 JavaScript 객체로 로드합니다. 중단합니다.
4. X.node가 파일인 경우 X.node를 바이너리 애드온으로 로드합니다. 중단합니다.

LOAD_INDEX(X)
1. X/index.js가 파일인 경우
    a. X에 가장 가까운 패키지 범위 SCOPE를 찾습니다.
    b. 범위를 찾을 수 없으면 X/index.js를 CommonJS 모듈로 로드합니다. 중단합니다.
    c. SCOPE/package.json에 "type" 필드가 포함된 경우,
      1. "type" 필드가 "module"이면 X/index.js를 ECMAScript 모듈로 로드합니다. 중단합니다.
      2. 그렇지 않으면 X/index.js를 CommonJS 모듈로 로드합니다. 중단합니다.
2. X/index.json이 파일인 경우 X/index.json을 JavaScript 객체로 구문 분석합니다. 중단합니다.
3. X/index.node가 파일인 경우 X/index.node를 바이너리 애드온으로 로드합니다. 중단합니다.

LOAD_AS_DIRECTORY(X)
1. X/package.json이 파일인 경우,
   a. X/package.json을 구문 분석하고 "main" 필드를 찾습니다.
   b. "main"이 거짓 값이면 2로 GOTO합니다.
   c. M = X + (json main 필드)로 설정합니다.
   d. LOAD_AS_FILE(M)
   e. LOAD_INDEX(M)
   f. LOAD_INDEX(X)는 더 이상 사용되지 않습니다.
   g. "찾을 수 없음" 오류를 발생시킵니다.
2. LOAD_INDEX(X)

LOAD_NODE_MODULES(X, START)
1. DIRS = NODE_MODULES_PATHS(START)로 설정합니다.
2. DIRS의 각 DIR에 대해:
   a. LOAD_PACKAGE_EXPORTS(X, DIR)
   b. LOAD_AS_FILE(DIR/X)
   c. LOAD_AS_DIRECTORY(DIR/X)

NODE_MODULES_PATHS(START)
1. PARTS = path split(START)로 설정합니다.
2. I = PARTS 개수 - 1로 설정합니다.
3. DIRS = []로 설정합니다.
4. I >= 0인 동안,
   a. PARTS[I] = "node_modules"인 경우 d로 GOTO합니다.
   b. DIR = path join(PARTS[0 .. I] + "node_modules")로 설정합니다.
   c. DIRS = DIR + DIRS
   d. I = I - 1로 설정합니다.
5. DIRS + GLOBAL_FOLDERS를 반환합니다.

LOAD_PACKAGE_IMPORTS(X, DIR)
1. DIR에 가장 가까운 패키지 범위 SCOPE를 찾습니다.
2. 범위를 찾을 수 없으면 반환합니다.
3. SCOPE/package.json "imports"가 null이거나 정의되지 않은 경우 반환합니다.
4. `--experimental-require-module`이 활성화된 경우
  a. CONDITIONS = ["node", "require", "module-sync"]로 설정합니다.
  b. 그렇지 않으면 CONDITIONS = ["node", "require"]로 설정합니다.
5. MATCH = PACKAGE_IMPORTS_RESOLVE(X, pathToFileURL(SCOPE),
  CONDITIONS) <a href="esm.md#resolver-algorithm-specification">ESM 확인자에 정의됨</a>.
6. RESOLVE_ESM_MATCH(MATCH).

LOAD_PACKAGE_EXPORTS(X, DIR)
1. X를 이름과 슬래시(`/`)로 시작하는 하위 경로의 조합으로 해석하려고 시도합니다. 이름에는 @scope/ 접두사가 있을 수 있습니다.
2. X가 이 패턴과 일치하지 않거나 DIR/NAME/package.json이 파일이 아닌 경우 반환합니다.
3. DIR/NAME/package.json을 구문 분석하고 "exports" 필드를 찾습니다.
4. "exports"가 null이거나 정의되지 않은 경우 반환합니다.
5. `--experimental-require-module`이 활성화된 경우
  a. CONDITIONS = ["node", "require", "module-sync"]로 설정합니다.
  b. 그렇지 않으면 CONDITIONS = ["node", "require"]로 설정합니다.
6. MATCH = PACKAGE_EXPORTS_RESOLVE(pathToFileURL(DIR/NAME), "." + SUBPATH,
   `package.json` "exports", CONDITIONS) <a href="esm.md#resolver-algorithm-specification">ESM 확인자에 정의됨</a>.
7. RESOLVE_ESM_MATCH(MATCH)

LOAD_PACKAGE_SELF(X, DIR)
1. DIR에 가장 가까운 패키지 범위 SCOPE를 찾습니다.
2. 범위를 찾을 수 없으면 반환합니다.
3. SCOPE/package.json "exports"가 null이거나 정의되지 않은 경우 반환합니다.
4. SCOPE/package.json "name"이 X의 첫 번째 세그먼트가 아니면 반환합니다.
5. MATCH = PACKAGE_EXPORTS_RESOLVE(pathToFileURL(SCOPE),
   "." + X.slice("name".length), `package.json` "exports", ["node", "require"])
   <a href="esm.md#resolver-algorithm-specification">ESM 확인자에 정의됨</a>.
6. RESOLVE_ESM_MATCH(MATCH)

RESOLVE_ESM_MATCH(MATCH)
1. RESOLVED_PATH = fileURLToPath(MATCH)로 설정합니다.
2. RESOLVED_PATH에 파일이 있으면 RESOLVED_PATH를 해당 확장자 형식으로 로드합니다. 중단합니다.
3. "찾을 수 없음" 오류를 발생시킵니다.
```

## 캐싱 {#caching}

모듈은 처음 로드된 후 캐싱됩니다. 이는 (다른 것과 함께) `require('foo')`를 호출할 때마다 동일한 파일로 확인되는 경우 정확히 동일한 객체가 반환된다는 의미입니다.

`require.cache`가 수정되지 않은 경우 `require('foo')`를 여러 번 호출해도 모듈 코드가 여러 번 실행되지 않습니다. 이는 중요한 기능입니다. 이를 통해 "부분적으로 완료된" 객체를 반환할 수 있으므로 순환을 일으키는 경우에도 전이 종속성을 로드할 수 있습니다.

모듈에서 코드를 여러 번 실행하게 하려면 함수를 내보내고 해당 함수를 호출하십시오.

### 모듈 캐싱 주의 사항 {#module-caching-caveats}

모듈은 확인된 파일 이름을 기준으로 캐싱됩니다. 모듈은 호출 모듈의 위치(`node_modules` 폴더에서 로드)에 따라 다른 파일 이름으로 확인될 수 있으므로 `require('foo')`가 다른 파일로 확인되는 경우 항상 정확히 동일한 객체를 반환한다는 *보장*은 없습니다.

또한 대소문자를 구분하지 않는 파일 시스템 또는 운영 체제에서는 서로 다른 확인된 파일 이름이 동일한 파일을 가리킬 수 있지만 캐시는 여전히 이를 서로 다른 모듈로 취급하고 파일을 여러 번 다시 로드합니다. 예를 들어 `./foo`와 `./FOO`가 동일한 파일인지 여부에 관계없이 `require('./foo')`와 `require('./FOO')`는 서로 다른 두 개의 객체를 반환합니다.

## 내장 모듈 {#built-in-modules}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v16.0.0, v14.18.0 | `require(...)`에 `node:` 가져오기 지원을 추가했습니다. |
:::

Node.js에는 바이너리에 컴파일된 여러 모듈이 있습니다. 이러한 모듈은 이 문서의 다른 곳에서 더 자세히 설명됩니다.

내장 모듈은 Node.js 소스 내에 정의되어 있으며 `lib/` 폴더에 있습니다.

내장 모듈은 `node:` 접두사를 사용하여 식별할 수 있으며, 이 경우 `require` 캐시를 무시합니다. 예를 들어 `require('node:http')`는 해당 이름으로 `require.cache` 항목이 있는 경우에도 항상 내장 HTTP 모듈을 반환합니다.

일부 내장 모듈은 해당 식별자가 `require()`에 전달되면 항상 우선적으로 로드됩니다. 예를 들어 `require('http')`는 해당 이름의 파일이 있는 경우에도 항상 내장 HTTP 모듈을 반환합니다. `node:` 접두사 없이 로드할 수 있는 내장 모듈 목록은 [`module.builtinModules`](/ko/nodejs/api/module#modulebuiltinmodules)에 접두사 없이 나열되어 있습니다.


### 필수 `node:` 접두사가 있는 내장 모듈 {#built-in-modules-with-mandatory-node-prefix}

`require()`에 의해 로드될 때, 일부 내장 모듈은 `node:` 접두사와 함께 요청되어야 합니다. 이 요구 사항은 새로 도입된 내장 모듈이 이미 이름을 가진 사용자 영역 패키지와 충돌하는 것을 방지하기 위해 존재합니다. 현재 `node:` 접두사가 필요한 내장 모듈은 다음과 같습니다.

- [`node:sea`](/ko/nodejs/api/single-executable-applications#single-executable-application-api)
- [`node:sqlite`](/ko/nodejs/api/sqlite)
- [`node:test`](/ko/nodejs/api/test)
- [`node:test/reporters`](/ko/nodejs/api/test#test-reporters)

이러한 모듈 목록은 접두사를 포함하여 [`module.builtinModules`](/ko/nodejs/api/module#modulebuiltinmodules)에 노출됩니다.

## 순환 참조 {#cycles}

순환 `require()` 호출이 있을 때, 모듈이 반환될 때 실행이 완료되지 않았을 수 있습니다.

다음과 같은 상황을 고려하십시오.

`a.js`:

```js [ESM]
console.log('a 시작');
exports.done = false;
const b = require('./b.js');
console.log('a에서, b.done = %j', b.done);
exports.done = true;
console.log('a 완료');
```
`b.js`:

```js [ESM]
console.log('b 시작');
exports.done = false;
const a = require('./a.js');
console.log('b에서, a.done = %j', a.done);
exports.done = true;
console.log('b 완료');
```
`main.js`:

```js [ESM]
console.log('main 시작');
const a = require('./a.js');
const b = require('./b.js');
console.log('main에서, a.done = %j, b.done = %j', a.done, b.done);
```
`main.js`가 `a.js`를 로드하면, `a.js`는 차례로 `b.js`를 로드합니다. 그 시점에서, `b.js`는 `a.js`를 로드하려고 시도합니다. 무한 루프를 방지하기 위해, `a.js` 내보내기 객체의 **미완성 복사본**이 `b.js` 모듈로 반환됩니다. 그러면 `b.js`는 로드를 완료하고, 해당 `exports` 객체가 `a.js` 모듈에 제공됩니다.

`main.js`가 두 모듈을 모두 로드했을 때, 둘 다 완료됩니다. 따라서 이 프로그램의 출력은 다음과 같습니다.

```bash [BASH]
$ node main.js
main 시작
a 시작
b 시작
b에서, a.done = false
b 완료
a에서, b.done = true
a 완료
main에서, a.done = true, b.done = true
```
응용 프로그램 내에서 순환 모듈 종속성이 올바르게 작동하도록 하려면 신중한 계획이 필요합니다.


## 파일 모듈 {#file-modules}

정확한 파일 이름을 찾을 수 없는 경우 Node.js는 추가된 확장자 `.js`, `.json` 및 마지막으로 `.node`를 사용하여 필요한 파일 이름을 로드하려고 시도합니다. 다른 확장자(예: `.cjs`)를 가진 파일을 로드할 때는 파일 확장자를 포함하여 전체 이름을 `require()`에 전달해야 합니다(예: `require('./file.cjs')`).

`.json` 파일은 JSON 텍스트 파일로 구문 분석되고, `.node` 파일은 `process.dlopen()`으로 로드되는 컴파일된 애드온 모듈로 해석됩니다. 다른 확장자(또는 확장자 없음)를 사용하는 파일은 JavaScript 텍스트 파일로 구문 분석됩니다. 사용할 구문 분석 목표를 이해하려면 [모듈 시스템 결정](/ko/nodejs/api/packages#determining-module-system) 섹션을 참조하십시오.

`'/'`로 시작하는 필수 모듈은 파일의 절대 경로입니다. 예를 들어 `require('/home/marco/foo.js')`는 `/home/marco/foo.js`에 있는 파일을 로드합니다.

`'./'`로 시작하는 필수 모듈은 `require()`를 호출하는 파일을 기준으로 합니다. 즉, `require('./circle')`이 `circle.js`를 찾으려면 `circle.js`가 `foo.js`와 같은 디렉터리에 있어야 합니다.

파일을 나타내는 선행 `'/'`, `'./'` 또는 `'../'`가 없으면 모듈은 코어 모듈이거나 `node_modules` 폴더에서 로드되어야 합니다.

주어진 경로가 존재하지 않으면 `require()`는 [`MODULE_NOT_FOUND`](/ko/nodejs/api/errors#module_not_found) 오류를 발생시킵니다.

## 폴더를 모듈로 {#folders-as-modules}

::: info [Stable: 3 - Legacy]
[Stable: 3](/ko/nodejs/api/documentation#stability-index) [안정성: 3](/ko/nodejs/api/documentation#stability-index) - 레거시: 대신 [서브 경로 내보내기](/ko/nodejs/api/packages#subpath-exports) 또는 [서브 경로 가져오기](/ko/nodejs/api/packages#subpath-imports)를 사용하십시오.
:::

폴더를 인수로 `require()`에 전달할 수 있는 세 가지 방법이 있습니다.

첫 번째는 폴더의 루트에 `main` 모듈을 지정하는 [`package.json`](/ko/nodejs/api/packages#nodejs-packagejson-field-definitions) 파일을 만드는 것입니다. [`package.json`](/ko/nodejs/api/packages#nodejs-packagejson-field-definitions) 파일의 예는 다음과 같습니다.

```json [JSON]
{ "name" : "some-library",
  "main" : "./lib/some-library.js" }
```
이것이 `./some-library` 폴더에 있는 경우 `require('./some-library')`는 `./some-library/lib/some-library.js`를 로드하려고 시도합니다.

디렉터리에 [`package.json`](/ko/nodejs/api/packages#nodejs-packagejson-field-definitions) 파일이 없거나 [`"main"`](/ko/nodejs/api/packages#main) 항목이 없거나 확인할 수 없는 경우 Node.js는 해당 디렉터리에서 `index.js` 또는 `index.node` 파일을 로드하려고 시도합니다. 예를 들어 이전 예제에 [`package.json`](/ko/nodejs/api/packages#nodejs-packagejson-field-definitions) 파일이 없는 경우 `require('./some-library')`는 다음을 로드하려고 시도합니다.

- `./some-library/index.js`
- `./some-library/index.node`

이러한 시도가 실패하면 Node.js는 기본 오류와 함께 전체 모듈이 누락된 것으로 보고합니다.

```bash [BASH]
Error: Cannot find module 'some-library'
```
위의 세 가지 경우 모두에서 `import('./some-library')` 호출은 [`ERR_UNSUPPORTED_DIR_IMPORT`](/ko/nodejs/api/errors#err_unsupported_dir_import) 오류를 발생시킵니다. 패키지 [서브 경로 내보내기](/ko/nodejs/api/packages#subpath-exports) 또는 [서브 경로 가져오기](/ko/nodejs/api/packages#subpath-imports)를 사용하면 폴더를 모듈로 사용하는 것과 동일한 봉쇄 구성 이점을 제공하고 `require` 및 `import` 모두에서 작동할 수 있습니다.


## `node_modules` 폴더에서 로딩하기 {#loading-from-node_modules-folders}

`require()`에 전달된 모듈 식별자가 [내장](/ko/nodejs/api/modules#built-in-modules) 모듈이 아니고 `'/'`, `'../'`, 또는 `'./'`로 시작하지 않으면 Node.js는 현재 모듈의 디렉터리에서 시작하여 `/node_modules`를 추가하고 해당 위치에서 모듈을 로드하려고 시도합니다. Node.js는 이미 `node_modules`로 끝나는 경로에 `node_modules`를 추가하지 않습니다.

거기에서 찾을 수 없으면 부모 디렉터리로 이동하여 파일 시스템의 루트에 도달할 때까지 계속합니다.

예를 들어 `'/home/ry/projects/foo.js'` 파일에서 `require('bar.js')`를 호출하면 Node.js는 다음 위치를 이 순서대로 검색합니다.

- `/home/ry/projects/node_modules/bar.js`
- `/home/ry/node_modules/bar.js`
- `/home/node_modules/bar.js`
- `/node_modules/bar.js`

이렇게 하면 프로그램이 종속성을 로컬화하여 충돌하지 않도록 할 수 있습니다.

모듈 이름 뒤에 경로 접미사를 포함하여 모듈과 함께 배포된 특정 파일 또는 하위 모듈을 요구할 수 있습니다. 예를 들어 `require('example-module/path/to/file')`은 `example-module`이 있는 위치를 기준으로 `path/to/file`을 확인합니다. 접미사가 붙은 경로는 동일한 모듈 확인 의미 체계를 따릅니다.

## 전역 폴더에서 로딩하기 {#loading-from-the-global-folders}

`NODE_PATH` 환경 변수가 콜론으로 구분된 절대 경로 목록으로 설정된 경우 Node.js는 다른 곳에서 찾을 수 없는 모듈에 대해 해당 경로를 검색합니다.

Windows에서는 `NODE_PATH`가 콜론 대신 세미콜론(`;`)으로 구분됩니다.

`NODE_PATH`는 원래 현재 [모듈 확인](/ko/nodejs/api/modules#all-together) 알고리즘이 정의되기 전에 다양한 경로에서 모듈 로딩을 지원하기 위해 만들어졌습니다.

`NODE_PATH`는 여전히 지원되지만 Node.js 생태계가 종속 모듈을 찾는 규칙에 정착했기 때문에 지금은 덜 필요합니다. `NODE_PATH`에 의존하는 배포는 `NODE_PATH`를 설정해야 한다는 사실을 모르는 사람들에게 놀라운 동작을 보이는 경우가 있습니다. 때로는 모듈의 종속성이 변경되어 `NODE_PATH`가 검색될 때 다른 버전(또는 다른 모듈)이 로드될 수 있습니다.

또한 Node.js는 다음 GLOBAL_FOLDERS 목록에서 검색합니다.

- 1: `$HOME/.node_modules`
- 2: `$HOME/.node_libraries`
- 3: `$PREFIX/lib/node`

여기서 `$HOME`은 사용자의 홈 디렉터리이고 `$PREFIX`는 Node.js 구성된 `node_prefix`입니다.

이들은 대부분 역사적인 이유 때문입니다.

종속성을 로컬 `node_modules` 폴더에 배치하는 것이 좋습니다. 이렇게 하면 더 빠르고 안정적으로 로드됩니다.


## 모듈 래퍼 {#the-module-wrapper}

모듈 코드가 실행되기 전에 Node.js는 다음과 같은 함수 래퍼로 코드를 감쌉니다.

```js [ESM]
(function(exports, require, module, __filename, __dirname) {
// 실제 모듈 코드는 여기에 있습니다.
});
```
이 작업을 통해 Node.js는 다음과 같은 몇 가지 작업을 수행합니다.

- 최상위 변수(`var`, `const` 또는 `let`으로 정의됨)를 전역 객체가 아닌 모듈 범위로 유지합니다.
- 다음과 같이 실제로 모듈에 특정한 전역 모양의 변수를 제공하는 데 도움이 됩니다.
    - 구현자가 모듈에서 값을 내보내는 데 사용할 수 있는 `module` 및 `exports` 객체.
    - 모듈의 절대 파일 이름과 디렉터리 경로를 포함하는 편의 변수 `__filename` 및 `__dirname`.
  
 

## 모듈 범위 {#the-module-scope}

### `__dirname` {#__dirname}

**추가된 버전: v0.1.27**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

현재 모듈의 디렉터리 이름입니다. 이는 [`__filename`](/ko/nodejs/api/modules#__filename)의 [`path.dirname()`](/ko/nodejs/api/path#pathdirnamepath)과 같습니다.

예: `/Users/mjr`에서 `node example.js` 실행

```js [ESM]
console.log(__dirname);
// 출력: /Users/mjr
console.log(path.dirname(__filename));
// 출력: /Users/mjr
```
### `__filename` {#__filename}

**추가된 버전: v0.0.1**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

현재 모듈의 파일 이름입니다. 이는 심볼릭 링크가 해석된 현재 모듈 파일의 절대 경로입니다.

메인 프로그램의 경우 명령줄에 사용된 파일 이름과 반드시 동일하지는 않습니다.

현재 모듈의 디렉터리 이름은 [`__dirname`](/ko/nodejs/api/modules#__dirname)을 참조하십시오.

예:

`/Users/mjr`에서 `node example.js` 실행

```js [ESM]
console.log(__filename);
// 출력: /Users/mjr/example.js
console.log(__dirname);
// 출력: /Users/mjr
```
두 개의 모듈 `a`와 `b`가 있고 `b`가 `a`의 종속성이고 디렉터리 구조가 다음과 같은 경우:

- `/Users/mjr/app/a.js`
- `/Users/mjr/app/node_modules/b/b.js`

`b.js` 내의 `__filename`에 대한 참조는 `/Users/mjr/app/node_modules/b/b.js`를 반환하고 `a.js` 내의 `__filename`에 대한 참조는 `/Users/mjr/app/a.js`를 반환합니다.


### `exports` {#exports}

**추가된 버전: v0.1.12**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

입력하기 더 짧은 `module.exports`에 대한 참조입니다. `exports` 및 `module.exports`를 사용해야 하는 시기에 대한 자세한 내용은 [exports 바로 가기](/ko/nodejs/api/modules#exports-shortcut) 섹션을 참조하십시오.

### `module` {#module}

**추가된 버전: v0.1.16**

- [\<module\>](/ko/nodejs/api/modules#the-module-object)

현재 모듈에 대한 참조로, [`module` 객체](/ko/nodejs/api/modules#the-module-object) 섹션을 참조하십시오. 특히 `module.exports`는 모듈이 내보내는 항목을 정의하고 `require()`를 통해 사용할 수 있도록 하는 데 사용됩니다.

### `require(id)` {#requireid}

**추가된 버전: v0.1.13**

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 모듈 이름 또는 경로
- 반환: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 내보낸 모듈 콘텐츠

모듈, `JSON` 및 로컬 파일을 가져오는 데 사용됩니다. `node_modules`에서 모듈을 가져올 수 있습니다. 로컬 모듈 및 JSON 파일은 [`__dirname`](/ko/nodejs/api/modules#__dirname) (정의된 경우) 또는 현재 작업 디렉터리에서 확인되는 상대 경로(예: `./`, `./foo`, `./bar/baz`, `../foo`)를 사용하여 가져올 수 있습니다. POSIX 스타일의 상대 경로는 OS 독립적인 방식으로 확인됩니다. 즉, 위의 예는 Unix 시스템에서와 같은 방식으로 Windows에서도 작동합니다.

```js [ESM]
// `__dirname` 또는 현재 작업 디렉터리에 상대적인 경로를 사용하여 로컬 모듈을 가져옵니다.
// (Windows에서는 .\path\myLocalModule로 확인됩니다.)
const myLocalModule = require('./path/myLocalModule');

// JSON 파일 가져오기:
const jsonData = require('./path/filename.json');

// node_modules 또는 Node.js 내장 모듈에서 모듈 가져오기:
const crypto = require('node:crypto');
```
#### `require.cache` {#requirecache}

**추가된 버전: v0.3.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

모듈은 필요할 때 이 객체에 캐시됩니다. 이 객체에서 키 값을 삭제하면 다음 `require`는 모듈을 다시 로드합니다. 이는 [네이티브 애드온](/ko/nodejs/api/addons)에는 적용되지 않으며, 다시 로드하면 오류가 발생합니다.

항목을 추가하거나 교체하는 것도 가능합니다. 이 캐시는 내장 모듈보다 먼저 확인되며, 내장 모듈과 일치하는 이름이 캐시에 추가되면 `node:` 접두사가 붙은 require 호출만 내장 모듈을 받게 됩니다. 주의해서 사용하십시오!

```js [ESM]
const assert = require('node:assert');
const realFs = require('node:fs');

const fakeFs = {};
require.cache.fs = { exports: fakeFs };

assert.strictEqual(require('fs'), fakeFs);
assert.strictEqual(require('node:fs'), realFs);
```

#### `require.extensions` {#requireextensions}

**추가된 버전: v0.3.0**

**더 이상 사용되지 않는 버전: v0.10.6**

::: danger [안정성: 0 - 더 이상 사용되지 않음]
[안정성: 0](/ko/nodejs/api/documentation#stability-index) [안정성: 0](/ko/nodejs/api/documentation#stability-index) - 더 이상 사용되지 않음
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

특정 파일 확장자를 처리하는 방법을 `require`에 지시합니다.

`.sjs` 확장자를 가진 파일을 `.js`로 처리합니다.

```js [ESM]
require.extensions['.sjs'] = require.extensions['.js'];
```
**더 이상 사용되지 않습니다.** 과거에는 이 목록이 온디맨드로 컴파일하여 JavaScript가 아닌 모듈을 Node.js로 로드하는 데 사용되었습니다. 그러나 실제로 다른 Node.js 프로그램을 통해 모듈을 로드하거나 미리 JavaScript로 컴파일하는 것과 같이 훨씬 더 나은 방법이 있습니다.

`require.extensions`를 사용하지 마십시오. 사용하면 미묘한 버그가 발생할 수 있으며 등록된 확장이 많을수록 확장자를 확인하는 속도가 느려집니다.

#### `require.main` {#requiremain}

**추가된 버전: v0.1.17**

- [\<module\>](/ko/nodejs/api/modules#the-module-object) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Node.js 프로세스가 시작될 때 로드된 진입 스크립트를 나타내는 `Module` 객체이거나, 프로그램의 진입점이 CommonJS 모듈이 아닌 경우 `undefined`입니다. ["메인 모듈 접근"](/ko/nodejs/api/modules#accessing-the-main-module)을 참조하세요.

`entry.js` 스크립트에서:

```js [ESM]
console.log(require.main);
```
```bash [BASH]
node entry.js
```
```js [ESM]
Module {
  id: '.',
  path: '/absolute/path/to',
  exports: {},
  filename: '/absolute/path/to/entry.js',
  loaded: false,
  children: [],
  paths:
   [ '/absolute/path/to/node_modules',
     '/absolute/path/node_modules',
     '/absolute/node_modules',
     '/node_modules' ] }
```
#### `require.resolve(request[, options])` {#requireresolverequest-options}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v8.9.0 | `paths` 옵션이 이제 지원됩니다. |
| v0.3.0 | 추가된 버전: v0.3.0 |
:::

- `request` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 확인할 모듈 경로입니다.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `paths` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 모듈 위치를 확인할 경로입니다. 존재하는 경우 이러한 경로는 `$HOME/.node_modules`와 같은 [GLOBAL_FOLDERS](/ko/nodejs/api/modules#loading-from-the-global-folders)를 제외하고 기본 확인 경로 대신 사용됩니다. 이러한 각 경로는 모듈 확인 알고리즘의 시작점으로 사용되며, 이는 `node_modules` 계층 구조가 이 위치에서 확인됨을 의미합니다.
  
 
- 반환 값: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

내부 `require()` 메커니즘을 사용하여 모듈의 위치를 찾지만, 모듈을 로드하는 대신 확인된 파일 이름만 반환합니다.

모듈을 찾을 수 없으면 `MODULE_NOT_FOUND` 오류가 발생합니다.


##### `require.resolve.paths(request)` {#requireresolvepathsrequest}

**Added in: v8.9.0**

- `request` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 조회 경로를 검색할 모듈 경로입니다.
- 반환: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

`request`의 확인 과정에서 검색된 경로를 담은 배열을 반환합니다. `request` 문자열이 코어 모듈(예: `http` 또는 `fs`)을 참조하는 경우 `null`을 반환합니다.

## `module` 객체 {#the-module-object}

**Added in: v0.1.16**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

각 모듈에서 `module` 자유 변수는 현재 모듈을 나타내는 객체에 대한 참조입니다. 편의를 위해 `module.exports`는 `exports` 모듈 전역을 통해 접근할 수도 있습니다. `module`은 실제로 전역 변수가 아니라 각 모듈에 지역적으로 사용됩니다.

### `module.children` {#modulechildren}

**Added in: v0.1.16**

- [\<module[]\>](/ko/nodejs/api/modules#the-module-object)

이 모듈에서 처음으로 요구한 모듈 객체입니다.

### `module.exports` {#moduleexports}

**Added in: v0.1.16**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`module.exports` 객체는 `Module` 시스템에 의해 생성됩니다. 때로는 이것이 허용되지 않을 수 있습니다. 많은 사용자가 자신의 모듈이 특정 클래스의 인스턴스가 되기를 원합니다. 이렇게 하려면 원하는 내보내기 객체를 `module.exports`에 할당하십시오. 원하는 객체를 `exports`에 할당하면 로컬 `exports` 변수를 다시 바인딩하게 되며 이는 아마도 원하는 것이 아닐 것입니다.

예를 들어 `a.js`라는 모듈을 만들고 있다고 가정해 보겠습니다.

```js [ESM]
const EventEmitter = require('node:events');

module.exports = new EventEmitter();

// 작업을 수행하고 시간이 지나면
// 모듈 자체에서 'ready' 이벤트를 발생시킵니다.
setTimeout(() => {
  module.exports.emit('ready');
}, 1000);
```
그러면 다른 파일에서 다음과 같이 할 수 있습니다.

```js [ESM]
const a = require('./a');
a.on('ready', () => {
  console.log('module "a" is ready');
});
```
`module.exports`에 대한 할당은 즉시 수행되어야 합니다. 콜백에서는 수행할 수 없습니다. 이것은 작동하지 않습니다.

`x.js`:

```js [ESM]
setTimeout(() => {
  module.exports = { a: 'hello' };
}, 0);
```
`y.js`:

```js [ESM]
const x = require('./x');
console.log(x.a);
```

#### `exports` 바로 가기 {#exports-shortcut}

**추가된 버전: v0.1.16**

`exports` 변수는 모듈의 파일 수준 범위 내에서 사용할 수 있으며 모듈이 평가되기 전에 `module.exports`의 값으로 할당됩니다.

이를 통해 바로 가기를 사용할 수 있으므로 `module.exports.f = ...`를 `exports.f = ...`로 더 간결하게 작성할 수 있습니다. 그러나 모든 변수와 마찬가지로 새 값이 `exports`에 할당되면 더 이상 `module.exports`에 바인딩되지 않습니다.

```js [ESM]
module.exports.hello = true; // 모듈의 require에서 내보냄
exports = { hello: false };  // 내보내지 않고 모듈에서만 사용 가능
```
`module.exports` 속성이 새 객체로 완전히 대체되는 경우 `exports`를 다시 할당하는 것이 일반적입니다.

```js [ESM]
module.exports = exports = function Constructor() {
  // ... 등.
};
```
동작을 설명하기 위해 `require()`의 가상 구현을 상상해보십시오. 이는 실제로 `require()`에서 수행하는 작업과 매우 유사합니다.

```js [ESM]
function require(/* ... */) {
  const module = { exports: {} };
  ((module, exports) => {
    // 모듈 코드 여기. 이 예제에서는 함수를 정의합니다.
    function someFunc() {}
    exports = someFunc;
    // 이 시점에서 exports는 더 이상 module.exports의 바로 가기가 아니며
    // 이 모듈은 여전히 빈 기본 객체를 내보냅니다.
    module.exports = someFunc;
    // 이 시점에서 모듈은 기본 객체 대신 someFunc를 내보냅니다.
  })(module, module.exports);
  return module.exports;
}
```
### `module.filename` {#modulefilename}

**추가된 버전: v0.1.16**

- [\<string\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Data_structures#문자열)

모듈의 완전히 해결된 파일 이름입니다.

### `module.id` {#moduleid}

**추가된 버전: v0.1.16**

- [\<string\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Data_structures#문자열)

모듈의 식별자입니다. 일반적으로 이것은 완전히 해결된 파일 이름입니다.

### `module.isPreloading` {#moduleispreloading}

**추가된 버전: v15.4.0, v14.17.0**

- 유형: [\<boolean\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Data_structures#boolean) 모듈이 Node.js 프리로드 단계에서 실행 중인 경우 `true`입니다.


### `module.loaded` {#moduleloaded}

**추가된 버전: v0.1.16**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

모듈 로딩이 완료되었는지, 또는 로딩 중인지 여부입니다.

### `module.parent` {#moduleparent}

**추가된 버전: v0.1.16**

**더 이상 사용되지 않음: v14.6.0, v12.19.0**

::: danger [안정성: 0 - 더 이상 사용되지 않음]
[안정성: 0](/ko/nodejs/api/documentation#stability-index) [안정성: 0](/ko/nodejs/api/documentation#stability-index) - 더 이상 사용되지 않음: 대신 [`require.main`](/ko/nodejs/api/modules#requiremain) 및 [`module.children`](/ko/nodejs/api/modules#modulechildren)을 사용하세요.
:::

- [\<module\>](/ko/nodejs/api/modules#the-module-object) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

이 모듈을 처음으로 require한 모듈이거나, 현재 모듈이 현재 프로세스의 진입점인 경우 `null`이거나, CommonJS 모듈이 아닌 것(예: REPL 또는 `import`)에 의해 모듈이 로드된 경우 `undefined`입니다.

### `module.path` {#modulepath}

**추가된 버전: v11.14.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

모듈의 디렉터리 이름입니다. 일반적으로 [`module.id`](/ko/nodejs/api/modules#moduleid)의 [`path.dirname()`](/ko/nodejs/api/path#pathdirnamepath)과 동일합니다.

### `module.paths` {#modulepaths}

**추가된 버전: v0.4.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

모듈의 검색 경로입니다.

### `module.require(id)` {#modulerequireid}

**추가된 버전: v0.5.1**

- `id` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 반환값: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 내보낸 모듈 콘텐츠

`module.require()` 메서드는 원래 모듈에서 `require()`가 호출된 것처럼 모듈을 로드하는 방법을 제공합니다.

이를 위해 `module` 객체에 대한 참조를 가져와야 합니다. `require()`는 `module.exports`를 반환하고 `module`은 일반적으로 특정 모듈의 코드 내에서만 *사용 가능*하므로 사용하려면 명시적으로 내보내야 합니다.


## `Module` 객체 {#the-module-object_1}

이 섹션은 [모듈: `module` 핵심 모듈](/ko/nodejs/api/module#the-module-object)로 이동되었습니다.

- [`module.builtinModules`](/ko/nodejs/api/module#modulebuiltinmodules)
- [`module.createRequire(filename)`](/ko/nodejs/api/module#modulecreaterequirefilename)
- [`module.syncBuiltinESMExports()`](/ko/nodejs/api/module#modulesyncbuiltinesmexports)

## Source map v3 지원 {#source-map-v3-support}

이 섹션은 [모듈: `module` 핵심 모듈](/ko/nodejs/api/module#source-map-v3-support)로 이동되었습니다.

- [`module.findSourceMap(path)`](/ko/nodejs/api/module#modulefindsourcemappath)
- [클래스: `module.SourceMap`](/ko/nodejs/api/module#class-modulesourcemap) 
    - [`new SourceMap(payload)`](/ko/nodejs/api/module#new-sourcemappayload)
    - [`sourceMap.payload`](/ko/nodejs/api/module#sourcemappayload)
    - [`sourceMap.findEntry(lineNumber, columnNumber)`](/ko/nodejs/api/module#sourcemapfindentrylinenumber-columnnumber)

