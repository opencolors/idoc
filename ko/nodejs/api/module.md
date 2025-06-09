---
title: Node.js 문서 - 모듈 시스템
description: 이 페이지는 Node.js의 모듈 시스템에 대한 상세한 문서를 제공합니다. CommonJS와 ES 모듈, 모듈 로드 방법, 모듈 캐싱, 그리고 두 모듈 시스템 간의 차이점을 설명합니다.
head:
  - - meta
    - name: og:title
      content: Node.js 문서 - 모듈 시스템 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 이 페이지는 Node.js의 모듈 시스템에 대한 상세한 문서를 제공합니다. CommonJS와 ES 모듈, 모듈 로드 방법, 모듈 캐싱, 그리고 두 모듈 시스템 간의 차이점을 설명합니다.
  - - meta
    - name: twitter:title
      content: Node.js 문서 - 모듈 시스템 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 이 페이지는 Node.js의 모듈 시스템에 대한 상세한 문서를 제공합니다. CommonJS와 ES 모듈, 모듈 로드 방법, 모듈 캐싱, 그리고 두 모듈 시스템 간의 차이점을 설명합니다.
---


# 모듈: `node:module` API {#modules-nodemodule-api}

**추가된 버전: v0.3.7**

## `Module` 객체 {#the-module-object}

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`Module` 인스턴스와 상호 작용할 때 일반적인 유틸리티 메서드를 제공합니다. `Module`은 종종 [CommonJS](/ko/nodejs/api/modules) 모듈에서 볼 수 있는 [`module`](/ko/nodejs/api/module#the-module-object) 변수입니다. `import 'node:module'` 또는 `require('node:module')`를 통해 액세스합니다.

### `module.builtinModules` {#modulebuiltinmodules}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v23.5.0 | 이제 목록에 접두사 전용 모듈도 포함됩니다. |
| v9.3.0, v8.10.0, v6.13.0 | 추가된 버전: v9.3.0, v8.10.0, v6.13.0 |
:::

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Node.js에서 제공하는 모든 모듈의 이름 목록입니다. 모듈이 타사에서 유지 관리되는지 여부를 확인하는 데 사용할 수 있습니다.

이 컨텍스트의 `module`은 [모듈 래퍼](/ko/nodejs/api/modules#the-module-wrapper)에서 제공하는 객체와 동일하지 않습니다. 액세스하려면 `Module` 모듈을 require하십시오.

::: code-group
```js [ESM]
// module.mjs
// ECMAScript 모듈에서
import { builtinModules as builtin } from 'node:module';
```

```js [CJS]
// module.cjs
// CommonJS 모듈에서
const builtin = require('node:module').builtinModules;
```
:::

### `module.createRequire(filename)` {#modulecreaterequirefilename}

**추가된 버전: v12.2.0**

- `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api) require 함수를 구성하는 데 사용할 파일 이름입니다. 파일 URL 객체, 파일 URL 문자열 또는 절대 경로 문자열이어야 합니다.
- 반환: [\<require\>](/ko/nodejs/api/modules#requireid) Require 함수

```js [ESM]
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

// sibling-module.js는 CommonJS 모듈입니다.
const siblingModule = require('./sibling-module');
```
### `module.findPackageJSON(specifier[, base])` {#modulefindpackagejsonspecifier-base}

**추가된 버전: v23.2.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index).1 - 활발한 개발
:::

- `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api) 검색할 `package.json`을 가진 모듈의 식별자입니다. *맨 식별자*를 전달할 때 패키지 루트에 있는 `package.json`이 반환됩니다. *상대 식별자* 또는 *절대 식별자*를 전달할 때 가장 가까운 상위 `package.json`이 반환됩니다.
- `base` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api) 포함하는 모듈의 절대 위치(`file:` URL 문자열 또는 FS 경로)입니다. CJS의 경우 `__dirname`이 아닌 `__filename`을 사용하십시오! ESM의 경우 `import.meta.url`을 사용하십시오. `specifier`가 *절대 식별자*인 경우 전달할 필요가 없습니다.
- 반환: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) `package.json`이 발견되면 경로입니다. `startLocation`이 패키지인 경우 패키지의 루트 `package.json`; 상대 또는 해결되지 않은 경우 `startLocation`에 가장 가까운 `package.json`입니다.

```text [TEXT]
/path/to/project
  ├ packages/
    ├ bar/
      ├ bar.js
      └ package.json // name = '@foo/bar'
    └ qux/
      ├ node_modules/
        └ some-package/
          └ package.json // name = 'some-package'
      ├ qux.js
      └ package.json // name = '@foo/qux'
  ├ main.js
  └ package.json // name = '@foo'
```

::: code-group
```js [ESM]
// /path/to/project/packages/bar/bar.js
import { findPackageJSON } from 'node:module';

findPackageJSON('..', import.meta.url);
// '/path/to/project/package.json'
// 대신 절대 식별자를 전달하는 경우 동일한 결과:
findPackageJSON(new URL('../', import.meta.url));
findPackageJSON(import.meta.resolve('../'));

findPackageJSON('some-package', import.meta.url);
// '/path/to/project/packages/bar/node_modules/some-package/package.json'
// 절대 식별자를 전달할 때 해결된 모듈이 중첩된 `package.json`이 있는 하위 폴더 내부에 있는 경우 다른 결과를 얻을 수 있습니다.
findPackageJSON(import.meta.resolve('some-package'));
// '/path/to/project/packages/bar/node_modules/some-package/some-subfolder/package.json'

findPackageJSON('@foo/qux', import.meta.url);
// '/path/to/project/packages/qux/package.json'
```

```js [CJS]
// /path/to/project/packages/bar/bar.js
const { findPackageJSON } = require('node:module');
const { pathToFileURL } = require('node:url');
const path = require('node:path');

findPackageJSON('..', __filename);
// '/path/to/project/package.json'
// 대신 절대 식별자를 전달하는 경우 동일한 결과:
findPackageJSON(pathToFileURL(path.join(__dirname, '..')));

findPackageJSON('some-package', __filename);
// '/path/to/project/packages/bar/node_modules/some-package/package.json'
// 절대 식별자를 전달할 때 해결된 모듈이 중첩된 `package.json`이 있는 하위 폴더 내부에 있는 경우 다른 결과를 얻을 수 있습니다.
findPackageJSON(pathToFileURL(require.resolve('some-package')));
// '/path/to/project/packages/bar/node_modules/some-package/some-subfolder/package.json'

findPackageJSON('@foo/qux', __filename);
// '/path/to/project/packages/qux/package.json'
```
:::


### `module.isBuiltin(moduleName)` {#moduleisbuiltinmodulename}

**추가된 버전: v18.6.0, v16.17.0**

- `moduleName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 모듈 이름
- 반환: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 모듈이 내장 모듈이면 true를 반환하고 그렇지 않으면 false를 반환합니다.

```js [ESM]
import { isBuiltin } from 'node:module';
isBuiltin('node:fs'); // true
isBuiltin('fs'); // true
isBuiltin('wss'); // false
```
### `module.register(specifier[, parentURL][, options])` {#moduleregisterspecifier-parenturl-options}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v20.8.0, v18.19.0 | WHATWG URL 인스턴스 지원 추가. |
| v20.6.0, v18.19.0 | 추가된 버전: v20.6.0, v18.19.0 |
:::

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index).2 - 릴리스 후보
:::

- `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api) 등록할 사용자 정의 후크; 이것은 `import()`에 전달될 문자열과 동일해야 합니다. 단, 상대적이면 `parentURL`을 기준으로 확인됩니다.
- `parentURL` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api) `import.meta.url`과 같은 기본 URL을 기준으로 `specifier`를 확인하려는 경우 해당 URL을 여기에 전달할 수 있습니다. **기본값:** `'data:'`
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `parentURL` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/ko/nodejs/api/url#the-whatwg-url-api) `import.meta.url`과 같은 기본 URL을 기준으로 `specifier`를 확인하려는 경우 해당 URL을 여기에 전달할 수 있습니다. `parentURL`이 두 번째 인수로 제공되면 이 속성은 무시됩니다. **기본값:** `'data:'`
    - `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) [`initialize`](/ko/nodejs/api/module#initialize) 후크에 전달할 임의의 복제 가능한 JavaScript 값입니다.
    - `transferList` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) `initialize` 후크에 전달할 [전송 가능한 객체](/ko/nodejs/api/worker_threads#portpostmessagevalue-transferlist)입니다.
  
 

Node.js 모듈 확인 및 로드 동작을 사용자 정의하는 [후크](/ko/nodejs/api/module#customization-hooks)를 내보내는 모듈을 등록합니다. [사용자 정의 후크](/ko/nodejs/api/module#customization-hooks)를 참조하십시오.


### `module.registerHooks(options)` {#moduleregisterhooksoptions}

**Added in: v23.5.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [Stability: 1](/ko/nodejs/api/documentation#stability-index).1 - 활발한 개발
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `load` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) [load 후크](/ko/nodejs/api/module#loadurl-context-nextload)를 참조하십시오. **기본값:** `undefined`.
    - `resolve` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) [resolve 후크](/ko/nodejs/api/module#resolvespecifier-context-nextresolve)를 참조하십시오. **기본값:** `undefined`.
  
 

Node.js 모듈 해석 및 로드 동작을 사용자 정의하는 [후크](/ko/nodejs/api/module#customization-hooks)를 등록합니다. [사용자 정의 후크](/ko/nodejs/api/module#customization-hooks)를 참조하십시오.

### `module.stripTypeScriptTypes(code[, options])` {#modulestriptypescripttypescode-options}

**Added in: v23.2.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [Stability: 1](/ko/nodejs/api/documentation#stability-index).1 - 활발한 개발
:::

- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 타입 어노테이션을 제거할 코드입니다.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **기본값:** `'strip'`. 가능한 값은 다음과 같습니다.
    - `'strip'` TypeScript 기능의 변환을 수행하지 않고 타입 어노테이션만 제거합니다.
    - `'transform'` 타입 어노테이션을 제거하고 TypeScript 기능을 JavaScript로 변환합니다.
  
 
    - `sourceMap` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **기본값:** `false`. `mode`가 `'transform'`일 때만, `true`이면 변환된 코드에 대한 소스 맵이 생성됩니다.
    - `sourceUrl` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 소스 맵에 사용되는 소스 URL을 지정합니다.
  
 
- 반환값: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 타입 어노테이션이 제거된 코드입니다. `module.stripTypeScriptTypes()`는 TypeScript 코드에서 타입 어노테이션을 제거합니다. `vm.runInContext()` 또는 `vm.compileFunction()`으로 실행하기 전에 TypeScript 코드에서 타입 어노테이션을 제거하는 데 사용할 수 있습니다. 기본적으로 코드가 `Enums`와 같이 변환이 필요한 TypeScript 기능을 포함하는 경우 오류가 발생합니다. 자세한 내용은 [타입 제거](/ko/nodejs/api/typescript#type-stripping)를 참조하십시오. 모드가 `'transform'`이면 TypeScript 기능도 JavaScript로 변환합니다. 자세한 내용은 [TypeScript 기능 변환](/ko/nodejs/api/typescript#typescript-features)을 참조하십시오. `mode`가 `'strip'`이면 위치가 유지되기 때문에 소스 맵이 생성되지 않습니다. `sourceMap`이 제공되면 `mode`가 `'strip'`일 때 오류가 발생합니다.

*경고*: TypeScript 파서의 변경으로 인해 이 함수의 출력은 Node.js 버전 간에 안정적으로 간주되어서는 안 됩니다.



::: code-group
```js [ESM]
import { stripTypeScriptTypes } from 'node:module';
const code = 'const a: number = 1;';
const strippedCode = stripTypeScriptTypes(code);
console.log(strippedCode);
// Prints: const a         = 1;
```

```js [CJS]
const { stripTypeScriptTypes } = require('node:module');
const code = 'const a: number = 1;';
const strippedCode = stripTypeScriptTypes(code);
console.log(strippedCode);
// Prints: const a         = 1;
```
:::

`sourceUrl`이 제공되면 출력 끝에 주석으로 추가됩니다.



::: code-group
```js [ESM]
import { stripTypeScriptTypes } from 'node:module';
const code = 'const a: number = 1;';
const strippedCode = stripTypeScriptTypes(code, { mode: 'strip', sourceUrl: 'source.ts' });
console.log(strippedCode);
// Prints: const a         = 1\n\n//# sourceURL=source.ts;
```

```js [CJS]
const { stripTypeScriptTypes } = require('node:module');
const code = 'const a: number = 1;';
const strippedCode = stripTypeScriptTypes(code, { mode: 'strip', sourceUrl: 'source.ts' });
console.log(strippedCode);
// Prints: const a         = 1\n\n//# sourceURL=source.ts;
```
:::

`mode`가 `'transform'`이면 코드가 JavaScript로 변환됩니다.



::: code-group
```js [ESM]
import { stripTypeScriptTypes } from 'node:module';
const code = `
  namespace MathUtil {
    export const add = (a: number, b: number) => a + b;
  }`;
const strippedCode = stripTypeScriptTypes(code, { mode: 'transform', sourceMap: true });
console.log(strippedCode);
// Prints:
// var MathUtil;
// (function(MathUtil) {
//     MathUtil.add = (a, b)=>a + b;
// })(MathUtil || (MathUtil = {}));
// # sourceMappingURL=data:application/json;base64, ...
```

```js [CJS]
const { stripTypeScriptTypes } = require('node:module');
const code = `
  namespace MathUtil {
    export const add = (a: number, b: number) => a + b;
  }`;
const strippedCode = stripTypeScriptTypes(code, { mode: 'transform', sourceMap: true });
console.log(strippedCode);
// Prints:
// var MathUtil;
// (function(MathUtil) {
//     MathUtil.add = (a, b)=>a + b;
// })(MathUtil || (MathUtil = {}));
// # sourceMappingURL=data:application/json;base64, ...
```
:::


### `module.syncBuiltinESMExports()` {#modulesyncbuiltinesmexports}

**Added in: v12.12.0**

`module.syncBuiltinESMExports()` 메서드는 내장된 [ES 모듈](/ko/nodejs/api/esm)의 모든 라이브 바인딩을 [CommonJS](/ko/nodejs/api/modules) exports의 속성과 일치하도록 업데이트합니다. [ES 모듈](/ko/nodejs/api/esm)에서 내보낸 이름을 추가하거나 제거하지 않습니다.

```js [ESM]
const fs = require('node:fs');
const assert = require('node:assert');
const { syncBuiltinESMExports } = require('node:module');

fs.readFile = newAPI;

delete fs.readFileSync;

function newAPI() {
  // ...
}

fs.newAPI = newAPI;

syncBuiltinESMExports();

import('node:fs').then((esmFS) => {
  // 기존 readFile 속성을 새 값과 동기화합니다.
  assert.strictEqual(esmFS.readFile, newAPI);
  // readFileSync가 require fs에서 삭제되었습니다.
  assert.strictEqual('readFileSync' in fs, false);
  // syncBuiltinESMExports()는 esmFS에서 readFileSync를 제거하지 않습니다.
  assert.strictEqual('readFileSync' in esmFS, true);
  // syncBuiltinESMExports()는 이름을 추가하지 않습니다.
  assert.strictEqual(esmFS.newAPI, undefined);
});
```
## Module compile cache {#module-compile-cache}


::: info [History]
| Version | Changes |
| --- | --- |
| v22.8.0 | add initial JavaScript APIs for runtime access. |
| v22.1.0 | Added in: v22.1.0 |
:::

모듈 컴파일 캐시는 [`module.enableCompileCache()`](/ko/nodejs/api/module#moduleenablecompilecachecachedir) 메서드 또는 [`NODE_COMPILE_CACHE=dir`](/ko/nodejs/api/cli#node_compile_cachedir) 환경 변수를 사용하여 활성화할 수 있습니다. 활성화된 후 Node.js가 CommonJS 또는 ECMAScript 모듈을 컴파일할 때마다 지정된 디렉터리에 보관된 디스크의 [V8 코드 캐시](https://v8.dev/blog/code-caching-for-devs)를 사용하여 컴파일 속도를 높입니다. 이는 모듈 그래프의 첫 번째 로드를 느리게 할 수 있지만 모듈 내용이 변경되지 않으면 동일한 모듈 그래프의 후속 로드는 상당한 속도 향상을 얻을 수 있습니다.

디스크에 생성된 컴파일 캐시를 정리하려면 캐시 디렉터리를 제거하기만 하면 됩니다. 캐시 디렉터리는 다음에 동일한 디렉터리가 컴파일 캐시 스토리지에 사용될 때 다시 생성됩니다. 오래된 캐시로 디스크를 채우는 것을 방지하려면 [`os.tmpdir()`](/ko/nodejs/api/os#ostmpdir) 아래의 디렉터리를 사용하는 것이 좋습니다. 디렉터리를 지정하지 않고 [`module.enableCompileCache()`](/ko/nodejs/api/module#moduleenablecompilecachecachedir)를 호출하여 컴파일 캐시를 활성화하면 Node.js는 [`NODE_COMPILE_CACHE=dir`](/ko/nodejs/api/cli#node_compile_cachedir) 환경 변수가 설정되어 있는 경우 이를 사용하거나 그렇지 않은 경우 기본적으로 `path.join(os.tmpdir(), 'node-compile-cache')`를 사용합니다. 실행 중인 Node.js 인스턴스에서 사용되는 컴파일 캐시 디렉터리를 찾으려면 [`module.getCompileCacheDir()`](/ko/nodejs/api/module#modulegetcompilecachedir)를 사용하십시오.

현재 컴파일 캐시를 [V8 JavaScript 코드 커버리지](https://v8project.blogspot.com/2017/12/javascript-code-coverage)와 함께 사용하는 경우 V8에서 수집하는 커버리지는 코드 캐시에서 역직렬화된 함수에서 덜 정확할 수 있습니다. 정확한 커버리지를 생성하기 위해 테스트를 실행할 때는 이를 끄는 것이 좋습니다.

활성화된 모듈 컴파일 캐시는 [`NODE_DISABLE_COMPILE_CACHE=1`](/ko/nodejs/api/cli#node_disable_compile_cache1) 환경 변수로 비활성화할 수 있습니다. 이는 컴파일 캐시가 예상치 못한 또는 원치 않는 동작(예: 덜 정확한 테스트 커버리지)으로 이어질 때 유용할 수 있습니다.

한 버전의 Node.js에서 생성된 컴파일 캐시는 다른 버전의 Node.js에서 재사용할 수 없습니다. 서로 다른 버전의 Node.js에서 생성된 캐시는 캐시를 유지하는 데 동일한 기본 디렉터리를 사용하는 경우 별도로 저장되므로 함께 존재할 수 있습니다.

현재 컴파일 캐시가 활성화되어 있고 모듈이 새로 로드되면 컴파일된 코드에서 즉시 코드 캐시가 생성되지만 Node.js 인스턴스가 종료될 때만 디스크에 기록됩니다. 이는 변경될 수 있습니다. 애플리케이션이 다른 Node.js 인스턴스를 생성하고 부모가 종료되기 훨씬 전에 캐시를 공유하도록 하려는 경우 축적된 코드 캐시가 디스크에 플러시되도록 [`module.flushCompileCache()`](/ko/nodejs/api/module#moduleflushcompilecache) 메서드를 사용할 수 있습니다.


### `module.constants.compileCacheStatus` {#moduleconstantscompilecachestatus}

**추가된 버전: v22.8.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index).1 - 활발한 개발 중
:::

다음 상수는 [`module.enableCompileCache()`](/ko/nodejs/api/module#moduleenablecompilecachecachedir)에서 반환한 객체의 `status` 필드에 [모듈 컴파일 캐시](/ko/nodejs/api/module#module-compile-cache) 활성화 시도 결과를 나타내기 위해 반환됩니다.

| 상수 | 설명 |
| --- | --- |
| `ENABLED` |        Node.js가 컴파일 캐시를 성공적으로 활성화했습니다. 컴파일 캐시를 저장하는 데 사용되는 디렉터리는 반환된 객체의 `directory` 필드에 반환됩니다.      |
| `ALREADY_ENABLED` |        컴파일 캐시는 이전에 `module.enableCompileCache()`를 호출했거나 `NODE_COMPILE_CACHE=dir` 환경 변수를 통해 이미 활성화되었습니다. 컴파일 캐시를 저장하는 데 사용되는 디렉터리는 반환된 객체의 `directory` 필드에 반환됩니다.      |
| `FAILED` |        Node.js가 컴파일 캐시를 활성화하지 못했습니다. 이는 지정된 디렉터리를 사용할 권한이 없거나 다양한 종류의 파일 시스템 오류로 인해 발생할 수 있습니다. 실패에 대한 자세한 내용은 반환된 객체의 `message` 필드에 반환됩니다.      |
| `DISABLED` |        환경 변수 `NODE_DISABLE_COMPILE_CACHE=1`이 설정되어 있어 Node.js가 컴파일 캐시를 활성화할 수 없습니다.      |
### `module.enableCompileCache([cacheDir])` {#moduleenablecompilecachecachedir}

**추가된 버전: v22.8.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index).1 - 활발한 개발 중
:::

- `cacheDir` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 컴파일 캐시를 저장/검색할 디렉터리를 지정하는 선택적 경로입니다.
- 반환값: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `status` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) [`module.constants.compileCacheStatus`](/ko/nodejs/api/module#moduleconstantscompilecachestatus) 중 하나
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Node.js가 컴파일 캐시를 활성화할 수 없는 경우 오류 메시지가 포함됩니다. `status`가 `module.constants.compileCacheStatus.FAILED`인 경우에만 설정됩니다.
    - `directory` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 컴파일 캐시가 활성화된 경우 컴파일 캐시가 저장된 디렉터리가 포함됩니다. `status`가 `module.constants.compileCacheStatus.ENABLED` 또는 `module.constants.compileCacheStatus.ALREADY_ENABLED`인 경우에만 설정됩니다.
  
 

현재 Node.js 인스턴스에서 [모듈 컴파일 캐시](/ko/nodejs/api/module#module-compile-cache)를 활성화합니다.

`cacheDir`이 지정되지 않은 경우 Node.js는 [`NODE_COMPILE_CACHE=dir`](/ko/nodejs/api/cli#node_compile_cachedir) 환경 변수가 설정되어 있으면 해당 변수로 지정된 디렉터리를 사용하거나 그렇지 않으면 `path.join(os.tmpdir(), 'node-compile-cache')`를 사용합니다. 일반적인 사용 사례의 경우 `cacheDir`을 지정하지 않고 `module.enableCompileCache()`를 호출하여 필요한 경우 `NODE_COMPILE_CACHE` 환경 변수로 디렉터리를 재정의할 수 있도록 하는 것이 좋습니다.

컴파일 캐시는 애플리케이션이 작동하는 데 필요한 조용한 최적화로 간주되므로 이 메서드는 컴파일 캐시를 활성화할 수 없는 경우 예외를 throw하지 않도록 설계되었습니다. 대신 디버깅에 도움이 되도록 `message` 필드에 오류 메시지가 포함된 객체를 반환합니다. 컴파일 캐시가 성공적으로 활성화되면 반환된 객체의 `directory` 필드에 컴파일 캐시가 저장된 디렉터리의 경로가 포함됩니다. 반환된 객체의 `status` 필드는 `module.constants.compileCacheStatus` 값 중 하나가 되어 [모듈 컴파일 캐시](/ko/nodejs/api/module#module-compile-cache) 활성화 시도 결과를 나타냅니다.

이 메서드는 현재 Node.js 인스턴스에만 영향을 미칩니다. 하위 작업자 스레드에서 활성화하려면 하위 작업자 스레드에서도 이 메서드를 호출하거나 `process.env.NODE_COMPILE_CACHE` 값을 컴파일 캐시 디렉터리로 설정하여 동작이 하위 작업자로 상속되도록 합니다. 디렉터리는 이 메서드에서 반환된 `directory` 필드 또는 [`module.getCompileCacheDir()`](/ko/nodejs/api/module#modulegetcompilecachedir)에서 얻을 수 있습니다.


### `module.flushCompileCache()` {#moduleflushcompilecache}

**Added in: v23.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index).1 - 활발한 개발 중
:::

현재 Node.js 인스턴스에 이미 로드된 모듈에서 누적된 [모듈 컴파일 캐시](/ko/nodejs/api/module#module-compile-cache)를 디스크에 플러시합니다. 이는 모든 플러시 파일 시스템 작업이 성공 여부에 관계없이 종료된 후에 반환됩니다. 오류가 발생하더라도 컴파일 캐시 누락이 애플리케이션의 실제 작동을 방해해서는 안 되므로 오류가 발생하지 않고 자동으로 실패합니다.

### `module.getCompileCacheDir()` {#modulegetcompilecachedir}

**Added in: v22.8.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index).1 - 활발한 개발 중
:::

- 반환: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 활성화된 경우 [모듈 컴파일 캐시](/ko/nodejs/api/module#module-compile-cache) 디렉터리의 경로, 그렇지 않으면 `undefined`입니다.

## 사용자 정의 후크 {#customization-hooks}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v23.5.0 | 동기 및 스레드 내 후크에 대한 지원을 추가합니다. |
| v20.6.0, v18.19.0 | `globalPreload`를 대체하기 위해 `initialize` 후크를 추가합니다. |
| v18.6.0, v16.17.0 | 로더 체이닝에 대한 지원을 추가합니다. |
| v16.12.0 | `getFormat`, `getSource`, `transformSource` 및 `globalPreload`를 제거하고 `load` 후크 및 `getGlobalPreload` 후크를 추가했습니다. |
| v8.8.0 | 추가됨: v8.8.0 |
:::

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index).2 - 릴리스 후보 (비동기 버전) 안정성: 1.1 - 활발한 개발 중 (동기 버전)
:::

현재 지원되는 모듈 사용자 정의 후크에는 두 가지 유형이 있습니다.

### 활성화 {#enabling}

다음과 같이 모듈 해결 및 로딩을 사용자 정의할 수 있습니다.

[`--import`](/ko/nodejs/api/cli#--importmodule) 또는 [`--require`](/ko/nodejs/api/cli#-r---require-module) 플래그를 사용하여 애플리케이션 코드가 실행되기 전에 후크를 등록할 수 있습니다.

```bash [BASH]
node --import ./register-hooks.js ./my-app.js
node --require ./register-hooks.js ./my-app.js
```

::: code-group
```js [ESM]
// register-hooks.js
// 이 파일은 최상위 await를 포함하지 않는 경우에만 require()할 수 있습니다.
// module.register()를 사용하여 전용 스레드에 비동기 후크를 등록합니다.
import { register } from 'node:module';
register('./hooks.mjs', import.meta.url);
```

```js [CJS]
// register-hooks.js
const { register } = require('node:module');
const { pathToFileURL } = require('node:url');
// module.register()를 사용하여 전용 스레드에 비동기 후크를 등록합니다.
register('./hooks.mjs', pathToFileURL(__filename));
```
:::

::: code-group
```js [ESM]
// module.registerHooks()를 사용하여 메인 스레드에 동기 후크를 등록합니다.
import { registerHooks } from 'node:module';
registerHooks({
  resolve(specifier, context, nextResolve) { /* 구현 */ },
  load(url, context, nextLoad) { /* 구현 */ },
});
```

```js [CJS]
// module.registerHooks()를 사용하여 메인 스레드에 동기 후크를 등록합니다.
const { registerHooks } = require('node:module');
registerHooks({
  resolve(specifier, context, nextResolve) { /* 구현 */ },
  load(url, context, nextLoad) { /* 구현 */ },
});
```
:::

`--import` 또는 `--require`에 전달된 파일은 종속성의 내보내기일 수도 있습니다.

```bash [BASH]
node --import some-package/register ./my-app.js
node --require some-package/register ./my-app.js
```
여기서 `some-package`에는 다음 `register-hooks.js` 예제와 같이 `register()`를 호출하는 파일에 매핑하기 위해 `/register` 내보내기를 정의하는 [`"exports"`](/ko/nodejs/api/packages#exports) 필드가 있습니다.

`--import` 또는 `--require`를 사용하면 애플리케이션의 진입점과 기본적으로 모든 작업자 스레드를 포함하여 애플리케이션 파일이 가져오기되기 전에 후크가 등록됩니다.

또는 진입점에서 `register()` 및 `registerHooks()`를 호출할 수 있지만 후크가 등록된 후에 실행되어야 하는 모든 ESM 코드에 대해 동적 `import()`를 사용해야 합니다.

::: code-group
```js [ESM]
import { register } from 'node:module';

register('http-to-https', import.meta.url);

// 이는 동적 `import()`이므로 `http-to-https` 후크가 실행되어
// `./my-app.js`와 가져오거나 요구하는 다른 모든 파일을 처리합니다.
await import('./my-app.js');
```

```js [CJS]
const { register } = require('node:module');
const { pathToFileURL } = require('node:url');

register('http-to-https', pathToFileURL(__filename));

// 이는 동적 `import()`이므로 `http-to-https` 후크가 실행되어
// `./my-app.js`와 가져오거나 요구하는 다른 모든 파일을 처리합니다.
import('./my-app.js');
```
:::

사용자 정의 후크는 등록보다 늦게 로드된 모듈과 `import` 및 내장 `require`를 통해 참조하는 모듈에 대해 실행됩니다. 사용자가 `module.createRequire()`를 사용하여 만든 `require` 함수는 동기 후크만 사용하여 사용자 정의할 수 있습니다.

이 예제에서는 `http-to-https` 후크를 등록하고 있지만 이후에 가져온 모듈(이 경우 `my-app.js`와 CommonJS 종속성의 `import` 또는 내장 `require`를 통해 참조하는 모든 것)에만 사용할 수 있습니다.

만약 `import('./my-app.js')`가 대신 정적 `import './my-app.js'`였다면, 앱은 `http-to-https` 후크가 등록되기 **전에** *이미* 로드되었을 것입니다. 이는 ES 모듈 사양 때문인데, 여기서 정적 가져오기는 먼저 트리의 잎에서 평가된 다음 트렁크로 다시 평가됩니다. `my-app.js` 내에 정적 가져오기가 있을 수 있으며, 이는 `my-app.js`가 동적으로 가져올 때까지 평가되지 않습니다.

동기 후크를 사용하는 경우 `import`, `require` 및 `createRequire()`를 사용하여 생성된 사용자 `require`가 모두 지원됩니다.

::: code-group
```js [ESM]
import { registerHooks, createRequire } from 'node:module';

registerHooks({ /* 동기 후크의 구현 */ });

const require = createRequire(import.meta.url);

// 동기 후크는 createRequire()를 통해 생성된 import, require() 및 사용자 require() 함수에 영향을 미칩니다.
await import('./my-app.js');
require('./my-app-2.js');
```

```js [CJS]
const { register, registerHooks } = require('node:module');
const { pathToFileURL } = require('node:url');

registerHooks({ /* 동기 후크의 구현 */ });

const userRequire = createRequire(__filename);

// 동기 후크는 createRequire()를 통해 생성된 import, require() 및 사용자 require() 함수에 영향을 미칩니다.
import('./my-app.js');
require('./my-app-2.js');
userRequire('./my-app-3.js');
```
:::

마지막으로, 앱이 실행되기 전에 후크를 등록하고 해당 목적을 위해 별도의 파일을 만들고 싶지 않은 경우 `--import`에 `data:` URL을 전달할 수 있습니다.

```bash [BASH]
node --import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register("http-to-https", pathToFileURL("./"));' ./my-app.js
```

### 체이닝 {#chaining}

`register`는 여러 번 호출할 수 있습니다.

::: code-group
```js [ESM]
// entrypoint.mjs
import { register } from 'node:module';

register('./foo.mjs', import.meta.url);
register('./bar.mjs', import.meta.url);
await import('./my-app.mjs');
```

```js [CJS]
// entrypoint.cjs
const { register } = require('node:module');
const { pathToFileURL } = require('node:url');

const parentURL = pathToFileURL(__filename);
register('./foo.mjs', parentURL);
register('./bar.mjs', parentURL);
import('./my-app.mjs');
```
:::

이 예제에서 등록된 훅은 체인을 형성합니다. 이 체인은 LIFO (후입 선출) 방식으로 실행됩니다. `foo.mjs`와 `bar.mjs` 모두 `resolve` 훅을 정의하는 경우 다음과 같이 호출됩니다 (오른쪽에서 왼쪽으로). node의 기본값 ← `./foo.mjs` ← `./bar.mjs` (`./bar.mjs`로 시작하여 `./foo.mjs`, 그런 다음 Node.js 기본값). 다른 모든 훅에도 동일하게 적용됩니다.

등록된 훅은 `register` 자체에도 영향을 미칩니다. 이 예제에서 `bar.mjs`는 `foo.mjs`에 의해 등록된 훅을 통해 확인되고 로드됩니다 (foo의 훅이 이미 체인에 추가되었기 때문입니다). 이를 통해 이전 등록된 훅이 JavaScript로 트랜스파일되는 한 JavaScript가 아닌 언어로 훅을 작성하는 것과 같은 작업을 수행 할 수 있습니다.

`register` 메서드는 훅을 정의하는 모듈 내에서 호출 할 수 없습니다.

`registerHooks`의 체이닝도 유사하게 작동합니다. 동기 및 비동기 훅이 혼합된 경우 동기 훅은 항상 비동기 훅이 실행되기 전에 먼저 실행됩니다. 즉, 마지막 동기 훅이 실행될 때 다음 훅에는 비동기 훅의 호출이 포함됩니다.

::: code-group
```js [ESM]
// entrypoint.mjs
import { registerHooks } from 'node:module';

const hook1 = { /* 훅 구현 */ };
const hook2 = { /* 훅 구현 */ };
// hook2는 hook1 전에 실행됩니다.
registerHooks(hook1);
registerHooks(hook2);
```

```js [CJS]
// entrypoint.cjs
const { registerHooks } = require('node:module');

const hook1 = { /* 훅 구현 */ };
const hook2 = { /* 훅 구현 */ };
// hook2는 hook1 전에 실행됩니다.
registerHooks(hook1);
registerHooks(hook2);
```
:::


### 모듈 사용자 지정 후크와의 통신 {#communication-with-module-customization-hooks}

비동기 후크는 애플리케이션 코드를 실행하는 기본 스레드와 분리된 전용 스레드에서 실행됩니다. 이는 전역 변수를 변경해도 다른 스레드에 영향을 미치지 않으며, 스레드 간 통신에는 메시지 채널을 사용해야 함을 의미합니다.

`register` 메서드를 사용하여 [`initialize`](/ko/nodejs/api/module#initialize) 후크에 데이터를 전달할 수 있습니다. 후크에 전달되는 데이터에는 포트와 같은 전송 가능한 객체가 포함될 수 있습니다.

::: code-group
```js [ESM]
import { register } from 'node:module';
import { MessageChannel } from 'node:worker_threads';

// 이 예제는 메시지 채널을 사용하여 후크와 통신하는 방법을 보여줍니다.
// `port2`를 후크에 보냅니다.
const { port1, port2 } = new MessageChannel();

port1.on('message', (msg) => {
  console.log(msg);
});
port1.unref();

register('./my-hooks.mjs', {
  parentURL: import.meta.url,
  data: { number: 1, port: port2 },
  transferList: [port2],
});
```

```js [CJS]
const { register } = require('node:module');
const { pathToFileURL } = require('node:url');
const { MessageChannel } = require('node:worker_threads');

// 이 예제는 메시지 채널을 사용하여 후크와 통신하는 방법을 보여줍니다.
// `port2`를 후크에 보냅니다.
const { port1, port2 } = new MessageChannel();

port1.on('message', (msg) => {
  console.log(msg);
});
port1.unref();

register('./my-hooks.mjs', {
  parentURL: pathToFileURL(__filename),
  data: { number: 1, port: port2 },
  transferList: [port2],
});
```
:::

동기 모듈 후크는 애플리케이션 코드가 실행되는 동일한 스레드에서 실행됩니다. 메인 스레드에서 액세스하는 컨텍스트의 전역 변수를 직접 변경할 수 있습니다.

### 후크 {#hooks}

#### `module.register()`에서 허용하는 비동기 후크 {#asynchronous-hooks-accepted-by-moduleregister}

[`register`](/ko/nodejs/api/module#moduleregisterspecifier-parenturl-options) 메서드를 사용하여 후크 세트를 내보내는 모듈을 등록할 수 있습니다. 후크는 Node.js에서 모듈 확인 및 로드 프로세스를 사용자 지정하기 위해 호출되는 함수입니다. 내보낸 함수는 특정 이름과 서명을 가져야 하며 명명된 내보내기로 내보내야 합니다.

```js [ESM]
export async function initialize({ number, port }) {
  // `register`에서 데이터를 받습니다.
}

export async function resolve(specifier, context, nextResolve) {
  // `import` 또는 `require` 지정자를 가져와 URL로 확인합니다.
}

export async function load(url, context, nextLoad) {
  // 확인된 URL을 가져와 평가할 소스 코드를 반환합니다.
}
```
비동기 후크는 애플리케이션 코드가 실행되는 메인 스레드와 격리된 별도의 스레드에서 실행됩니다. 즉, 다른 [realm](https://tc39.es/ecma262/#realm)입니다. 후크 스레드는 언제든지 메인 스레드에 의해 종료될 수 있으므로 비동기 작업(`console.log`와 같은)이 완료될 것이라고 가정하지 마십시오. 기본적으로 하위 워커로 상속됩니다.


#### `module.registerHooks()`에서 허용되는 동기 후크 {#synchronous-hooks-accepted-by-moduleregisterhooks}

**추가된 버전: v23.5.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index).1 - 활발한 개발
:::

`module.registerHooks()` 메서드는 동기 후크 함수를 허용합니다. 후크 구현자가 `module.registerHooks()`를 호출하기 직전에 초기화 코드를 직접 실행할 수 있으므로 `initialize()`는 지원되지 않으며 필요하지도 않습니다.

```js [ESM]
function resolve(specifier, context, nextResolve) {
  // `import` 또는 `require` 지정자를 가져와 URL로 확인합니다.
}

function load(url, context, nextLoad) {
  // 확인된 URL을 가져와 평가할 소스 코드를 반환합니다.
}
```
동기 후크는 동일한 스레드와 모듈이 로드되는 동일한 [영역](https://tc39.es/ecma262/#realm)에서 실행됩니다. 비동기 후크와 달리 기본적으로 자식 worker 스레드로 상속되지 않지만, 후크가 [`--import`](/ko/nodejs/api/cli#--importmodule) 또는 [`--require`](/ko/nodejs/api/cli#-r---require-module)로 미리 로드된 파일을 사용하여 등록된 경우 자식 worker 스레드는 `process.execArgv` 상속을 통해 미리 로드된 스크립트를 상속할 수 있습니다. 자세한 내용은 [`Worker` 문서](/ko/nodejs/api/worker_threads#new-workerfilename-options)를 참조하십시오.

동기 후크에서 사용자는 모듈 코드에서 `console.log()`가 완료될 것으로 예상하는 것과 같은 방식으로 `console.log()`가 완료될 것으로 예상할 수 있습니다.

#### 후크의 규칙 {#conventions-of-hooks}

후크는 사용자 정의(사용자가 제공한) 후크 하나와 항상 존재하는 기본 후크로만 구성된 경우에도 [체인](/ko/nodejs/api/module#chaining)의 일부입니다. 후크 함수는 중첩됩니다. 각 함수는 항상 일반 객체를 반환해야 하며, 체이닝은 각 함수가 `next\<hookName\>()`을 호출한 결과로 발생합니다. 이는 후속 로더의 후크에 대한 참조(LIFO 순서)입니다.

필수 속성이 없는 값을 반환하는 후크는 예외를 발생시킵니다. `next\<hookName\>()`을 호출하지 *않고* `shortCircuit: true`를 반환하지 않고 반환하는 후크도 예외를 발생시킵니다. 이러한 오류는 체인에서 의도하지 않은 중단을 방지하는 데 도움이 됩니다. 후크에서 `shortCircuit: true`를 반환하여 체인이 의도적으로 후크에서 종료됨을 알립니다.


#### `initialize()` {#initialize}

**다음 버전에서 추가됨: v20.6.0, v18.19.0**

::: warning [안정적: 1 - 실험적]
[안정적: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index).2 - 릴리스 후보
:::

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) `register(loader, import.meta.url, { data })`에서 가져온 데이터입니다.

`initialize` 훅은 [`register`](/ko/nodejs/api/module#moduleregisterspecifier-parenturl-options)에서만 허용됩니다. `registerHooks()`는 동기 훅에 대한 초기화는 `registerHooks()` 호출 직전에 직접 실행할 수 있기 때문에 이를 지원하거나 필요로 하지 않습니다.

`initialize` 훅은 훅 모듈이 초기화될 때 훅 스레드에서 실행되는 사용자 지정 함수를 정의하는 방법을 제공합니다. 초기화는 훅 모듈이 [`register`](/ko/nodejs/api/module#moduleregisterspecifier-parenturl-options)를 통해 등록될 때 발생합니다.

이 훅은 포트 및 기타 전송 가능한 객체를 포함하여 [`register`](/ko/nodejs/api/module#moduleregisterspecifier-parenturl-options) 호출에서 데이터를 받을 수 있습니다. `initialize`의 반환 값은 [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)일 수 있으며, 이 경우 주 애플리케이션 스레드 실행이 재개되기 전에 await됩니다.

모듈 사용자 정의 코드:

```js [ESM]
// path-to-my-hooks.js

export async function initialize({ number, port }) {
  port.postMessage(`increment: ${number + 1}`);
}
```
호출자 코드:



::: code-group
```js [ESM]
import assert from 'node:assert';
import { register } from 'node:module';
import { MessageChannel } from 'node:worker_threads';

// 이 예제는 메시지 채널을 사용하여 메인(애플리케이션) 스레드와 훅 스레드에서 실행되는 훅 간에
// `port2`를 `initialize` 훅으로 보내어 통신하는 방법을 보여줍니다.
const { port1, port2 } = new MessageChannel();

port1.on('message', (msg) => {
  assert.strictEqual(msg, 'increment: 2');
});
port1.unref();

register('./path-to-my-hooks.js', {
  parentURL: import.meta.url,
  data: { number: 1, port: port2 },
  transferList: [port2],
});
```

```js [CJS]
const assert = require('node:assert');
const { register } = require('node:module');
const { pathToFileURL } = require('node:url');
const { MessageChannel } = require('node:worker_threads');

// 이 예제는 메시지 채널을 사용하여 메인(애플리케이션) 스레드와 훅 스레드에서 실행되는 훅 간에
// `port2`를 `initialize` 훅으로 보내어 통신하는 방법을 보여줍니다.
const { port1, port2 } = new MessageChannel();

port1.on('message', (msg) => {
  assert.strictEqual(msg, 'increment: 2');
});
port1.unref();

register('./path-to-my-hooks.js', {
  parentURL: pathToFileURL(__filename),
  data: { number: 1, port: port2 },
  transferList: [port2],
});
```
:::


#### `resolve(specifier, context, nextResolve)` {#resolvespecifier-context-nextresolve}

::: info [내역]
| 버전 | 변경 사항 |
| --- | --- |
| v23.5.0 | 동기 및 인스레드 후크에 대한 지원이 추가되었습니다. |
| v21.0.0, v20.10.0, v18.19.0 | `context.importAssertions` 속성이 `context.importAttributes`로 대체되었습니다. 이전 이름을 사용해도 계속 지원되며 실험적 경고가 표시됩니다. |
| v18.6.0, v16.17.0 | resolve 후크 체이닝에 대한 지원이 추가되었습니다. 각 후크는 `nextResolve()`를 호출하거나 반환 값에 `shortCircuit` 속성이 `true`로 설정되어 있어야 합니다. |
| v17.1.0, v16.14.0 | import 어설션에 대한 지원이 추가되었습니다. |
:::

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index).2 - 릴리스 후보 (비동기 버전) 안정성: 1.1 - 활발한 개발 (동기 버전)
:::

- `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `conditions` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 관련 `package.json`의 내보내기 조건
    - `importAttributes` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 가져올 모듈의 속성을 나타내는 키-값 쌍의 객체
    - `parentURL` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 이 모듈을 가져오는 모듈이거나 이것이 Node.js 진입점인 경우 undefined
  
 
- `nextResolve` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 체인의 후속 `resolve` 후크 또는 마지막 사용자 제공 `resolve` 후크 이후의 Node.js 기본 `resolve` 후크
    - `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  
 
- 반환값: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 비동기 버전은 다음 속성을 포함하는 객체 또는 그러한 객체로 해결되는 `Promise`를 사용합니다. 동기 버전은 동기적으로 반환된 객체만 허용합니다.
    - `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 로드 후크에 대한 힌트 ('builtin' | 'commonjs' | 'json' | 'module' | 'wasm')(무시될 수 있음)
    - `importAttributes` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 모듈을 캐싱할 때 사용할 import 속성 (선택 사항, 생략하면 입력이 사용됨)
    - `shortCircuit` [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 이 후크가 `resolve` 후크 체인을 종료하려고 한다는 신호입니다. **기본값:** `false`
    - `url` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 이 입력이 해석되는 절대 URL
  
 

`resolve` 후크 체인은 Node.js에 주어진 `import` 문 또는 표현식 또는 `require` 호출을 찾을 위치와 캐시하는 방법을 알려주는 역할을 합니다. 선택적으로 `load` 후크에 대한 힌트로 형식(예: `'module'`)을 반환할 수 있습니다. 형식이 지정된 경우 `load` 후크는 최종 `format` 값을 제공할 책임이 있습니다(그리고 `resolve`에서 제공한 힌트를 자유롭게 무시할 수 있습니다). `resolve`가 `format`을 제공하는 경우 값을 Node.js 기본 `load` 후크에 전달하는 경우에도 사용자 지정 `load` 후크가 필요합니다.

Import type 속성은 로드된 모듈을 내부 모듈 캐시에 저장하기 위한 캐시 키의 일부입니다. `resolve` 후크는 모듈을 소스 코드에 있는 것과 다른 속성으로 캐싱해야 하는 경우 `importAttributes` 객체를 반환할 책임이 있습니다.

`context`의 `conditions` 속성은 이 확인 요청에 대한 [패키지 내보내기 조건](/ko/nodejs/api/packages#conditional-exports)을 일치시키는 데 사용될 조건 배열입니다. 조건부 매핑을 다른 곳에서 조회하거나 기본 확인 논리를 호출할 때 목록을 수정하는 데 사용할 수 있습니다.

현재 [패키지 내보내기 조건](/ko/nodejs/api/packages#conditional-exports)은 항상 후크에 전달된 `context.conditions` 배열에 있습니다. `defaultResolve`를 호출할 때 *기본 Node.js 모듈 지정자 확인 동작*을 보장하려면 `defaultResolve`에 전달된 `context.conditions` 배열에 원래 `resolve` 후크에 전달된 `context.conditions` 배열의 *모든* 요소가 포함되어야 합니다.

```js [ESM]
// module.register()에서 허용되는 비동기 버전입니다.
export async function resolve(specifier, context, nextResolve) {
  const { parentURL = null } = context;

  if (Math.random() > 0.5) { // 일부 조건입니다.
    // 일부 또는 모든 지정자에 대해 확인을 위한 일부 사용자 지정 논리를 수행합니다.
    // 항상 {url: <string>} 형식의 객체를 반환합니다.
    return {
      shortCircuit: true,
      url: parentURL ?
        new URL(specifier, parentURL).href :
        new URL(specifier).href,
    };
  }

  if (Math.random() < 0.5) { // 또 다른 조건입니다.
    // `defaultResolve`를 호출할 때 인수를 수정할 수 있습니다. 이 경우 조건부 내보내기 일치를 위해 다른 값을 추가합니다.
    return nextResolve(specifier, {
      ...context,
      conditions: [...context.conditions, 'another-condition'],
    });
  }

  // 체인의 다음 후크로 연기합니다. 이것이 마지막 사용자 지정 로더인 경우 Node.js 기본 확인이 됩니다.
  return nextResolve(specifier);
}
```
```js [ESM]
// module.registerHooks()에서 허용되는 동기 버전입니다.
function resolve(specifier, context, nextResolve) {
  // 비동기 논리가 없으므로 위의 비동기 resolve()와 유사합니다.
}
```

#### `load(url, context, nextLoad)` {#loadurl-context-nextload}

::: info [History]
| Version | Changes |
| --- | --- |
| v23.5.0 | Add support for synchronous and in-thread version. |
| v20.6.0 | Add support for `source` with format `commonjs`. |
| v18.6.0, v16.17.0 | Add support for chaining load hooks. Each hook must either call `nextLoad()` or include a `shortCircuit` property set to `true` in its return. |
:::

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [Stability: 1](/ko/nodejs/api/documentation#stability-index).2 - 릴리스 후보 (비동기 버전) Stability: 1.1 - 활발한 개발 (동기 버전)
:::

- `url` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `resolve` 체인에서 반환된 URL
- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `conditions` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 관련 `package.json`의 내보내기 조건
    - `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) `resolve` 훅 체인에서 선택적으로 제공되는 형식
    - `importAttributes` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  
 
- `nextLoad` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 체인의 후속 `load` 훅 또는 마지막 사용자 제공 `load` 훅 후의 Node.js 기본 `load` 훅
    - `url` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  
 
- 반환: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 비동기 버전은 다음 속성이 포함된 객체 또는 해당 객체로 해석될 `Promise`를 사용합니다. 동기 버전은 동기적으로 반환된 객체만 허용합니다.
    - `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `shortCircuit` [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 이 훅이 `load` 훅 체인을 종료하려는 의도가 있음을 나타내는 신호입니다. **기본값:** `false`
    - `source` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) Node.js가 평가할 소스
  
 

`load` 훅은 URL을 해석, 검색 및 구문 분석하는 사용자 정의 방법을 정의하는 방법을 제공합니다. 또한 가져오기 속성을 검증하는 역할도 합니다.

`format`의 최종 값은 다음 중 하나여야 합니다.

| `format` | 설명 | `load`에서 반환된 `source`에 허용되는 유형 |
| --- | --- | --- |
| `'builtin'` | Node.js 내장 모듈 로드 | 해당 사항 없음 |
| `'commonjs'` | Node.js CommonJS 모듈 로드 | { [`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) , [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) , [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) , `null` , `undefined` } |
| `'json'` | JSON 파일 로드 | { [`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) , [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) , [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) } |
| `'module'` | ES 모듈 로드 | { [`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) , [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) , [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) } |
| `'wasm'` | WebAssembly 모듈 로드 | { [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) , [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) } |
현재 Node.js 기본(코어) 모듈의 값을 대체하는 것은 불가능하므로 `source` 값은 `'builtin'` 유형에 대해 무시됩니다.


##### 비동기 `load` 후크의 주의 사항 {#caveat-in-the-asynchronous-load-hook}

비동기 `load` 후크를 사용할 때 `'commonjs'`에 대한 `source`를 생략하는 것과 제공하는 것은 매우 다른 효과를 가집니다.

- `source`가 제공되면 이 모듈의 모든 `require` 호출은 등록된 `resolve` 및 `load` 후크가 있는 ESM 로더에서 처리됩니다. 이 모듈의 모든 `require.resolve` 호출은 등록된 `resolve` 후크가 있는 ESM 로더에서 처리됩니다. CommonJS API의 하위 집합만 사용할 수 있습니다 (예 : `require.extensions`, `require.cache`, `require.resolve.paths` 없음). CommonJS 모듈 로더에 대한 몽키 패칭은 적용되지 않습니다.
- `source`가 정의되지 않았거나 `null`이면 CommonJS 모듈 로더에서 처리되며 `require` / `require.resolve` 호출은 등록된 후크를 거치지 않습니다. nullish `source`에 대한 이 동작은 일시적입니다. 앞으로는 nullish `source`가 지원되지 않습니다.

이러한 주의 사항은 동기 `load` 후크에는 적용되지 않습니다. 이 경우 사용자 지정된 CommonJS 모듈에 사용할 수 있는 전체 CommonJS API 세트와 `require` / `require.resolve`는 항상 등록된 후크를 거칩니다.

Node.js 내부 비동기 `load` 구현 ( `load` 체인의 마지막 후크에 대한 `next` 값)은 이전 버전과의 호환성을 위해 `format`이 `'commonjs'`인 경우 `source`에 대해 `null`을 반환합니다. 다음은 기본 동작을 사용하도록 선택하는 후크의 예입니다.

```js [ESM]
import { readFile } from 'node:fs/promises';

// module.register()에서 허용되는 비동기 버전입니다. 이 수정 사항은
// module.registerSync()에서 허용되는 동기 버전에는 필요하지 않습니다.
export async function load(url, context, nextLoad) {
  const result = await nextLoad(url, context);
  if (result.format === 'commonjs') {
    result.source ??= await readFile(new URL(result.responseURL ?? url));
  }
  return result;
}
```
이것은 또한 동기 `load` 후크에는 적용되지 않습니다. 이 경우 반환된 `source`에는 모듈 형식에 관계없이 다음 후크에서 로드한 소스 코드가 포함됩니다.

- 특정 [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) 객체는 [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer)입니다.
- 특정 [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) 객체는 [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)입니다.

텍스트 기반 형식 (예 : `'json'`, `'module'`)의 소스 값이 문자열이 아니면 [`util.TextDecoder`](/ko/nodejs/api/util#class-utiltextdecoder)를 사용하여 문자열로 변환됩니다.

`load` 후크는 해결된 URL의 소스 코드를 검색하는 사용자 정의 방법을 정의하는 방법을 제공합니다. 이를 통해 로더는 잠재적으로 디스크에서 파일을 읽지 않아도됩니다. 또한 인식되지 않는 형식을 지원되는 형식으로 매핑하는 데 사용할 수도 있습니다 (예 : `yaml`에서 `module`로).

```js [ESM]
// module.register()에서 허용되는 비동기 버전입니다.
export async function load(url, context, nextLoad) {
  const { format } = context;

  if (Math.random() > 0.5) { // 일부 조건
    /*
      일부 또는 모든 URL에 대해 소스를 검색하기 위한 일부 사용자 정의 로직을 수행합니다.
      항상 다음 형식의 객체를 반환합니다. {
        format: <string>,
        source: <string|buffer>,
      }.
    */
    return {
      format,
      shortCircuit: true,
      source: '...',
    };
  }

  // 체인의 다음 후크로 연기합니다.
  return nextLoad(url);
}
```
```js [ESM]
// module.registerHooks()에서 허용되는 동기 버전입니다.
function load(url, context, nextLoad) {
  // 위의 비동기 load()와 유사합니다. 비동기 로직이 없기 때문입니다.
}
```
보다 고급 시나리오에서는 지원되지 않는 소스를 지원되는 소스로 변환하는 데 사용할 수도 있습니다 (아래 [예제](/ko/nodejs/api/module#examples) 참조).


### 예시 {#examples}

다양한 모듈 사용자 정의 후크를 함께 사용하여 Node.js 코드 로딩 및 평가 동작의 광범위한 사용자 정의를 수행할 수 있습니다.

#### HTTPS에서 가져오기 {#import-from-https}

아래 후크는 이러한 지정자에 대한 기본적인 지원을 활성화하기 위해 후크를 등록합니다. 이것이 Node.js 핵심 기능에 상당한 개선처럼 보일 수 있지만, 실제로 이러한 후크를 사용하는 데에는 상당한 단점이 있습니다. 성능은 디스크에서 파일을 로드하는 것보다 훨씬 느리고, 캐싱이 없으며, 보안이 없습니다.

```js [ESM]
// https-hooks.mjs
import { get } from 'node:https';

export function load(url, context, nextLoad) {
  // 네트워크를 통해 로드될 JavaScript의 경우, 가져와서 반환해야 합니다.
  if (url.startsWith('https://')) {
    return new Promise((resolve, reject) => {
      get(url, (res) => {
        let data = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => resolve({
          // 이 예제에서는 네트워크에서 제공되는 모든 JavaScript가 ES 모듈
          // 코드라고 가정합니다.
          format: 'module',
          shortCircuit: true,
          source: data,
        }));
      }).on('error', (err) => reject(err));
    });
  }

  // Node.js가 다른 모든 URL을 처리하도록 합니다.
  return nextLoad(url);
}
```
```js [ESM]
// main.mjs
import { VERSION } from 'https://coffeescript.org/browser-compiler-modern/coffeescript.js';

console.log(VERSION);
```
위의 후크 모듈을 사용하여 `node --import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register(pathToFileURL("./https-hooks.mjs"));' ./main.mjs`를 실행하면 `main.mjs`의 URL에 있는 모듈에 따라 CoffeeScript의 현재 버전이 출력됩니다.

#### 트랜스파일링 {#transpilation}

Node.js가 이해하지 못하는 형식의 소스는 [`load` 후크](/ko/nodejs/api/module#loadurl-context-nextload)를 사용하여 JavaScript로 변환할 수 있습니다.

이는 Node.js를 실행하기 전에 소스 파일을 트랜스파일하는 것보다 성능이 떨어집니다. 트랜스파일러 후크는 개발 및 테스트 목적으로만 사용해야 합니다.


##### 비동기 버전 {#asynchronous-version}

```js [ESM]
// coffeescript-hooks.mjs
import { readFile } from 'node:fs/promises';
import { dirname, extname, resolve as resolvePath } from 'node:path';
import { cwd } from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import coffeescript from 'coffeescript';

const extensionsRegex = /\.(coffee|litcoffee|coffee\.md)$/;

export async function load(url, context, nextLoad) {
  if (extensionsRegex.test(url)) {
    // CoffeeScript 파일은 CommonJS 또는 ES 모듈일 수 있으므로 모든
    // CoffeeScript 파일은 Node.js에서 동일한 위치에 있는 .js 파일과 동일하게 처리되기를 바랍니다.
    // Node.js가 임의의 .js 파일을 어떻게 해석하는지 확인하려면 파일 시스템을 검색하여 가장 가까운 상위 package.json 파일을 찾고
    // 해당 "type" 필드를 읽습니다.
    const format = await getPackageType(url);

    const { source: rawSource } = await nextLoad(url, { ...context, format });
    // 이 훅은 가져온 모든 CoffeeScript 파일에 대해 CoffeeScript 소스 코드를 JavaScript 소스 코드로 변환합니다.
    const transformedSource = coffeescript.compile(rawSource.toString(), url);

    return {
      format,
      shortCircuit: true,
      source: transformedSource,
    };
  }

  // Node.js가 다른 모든 URL을 처리하도록 합니다.
  return nextLoad(url);
}

async function getPackageType(url) {
  // `url`은 load() 훅에서 확인된 url을 전달할 때 첫 번째 반복 중에만 파일 경로입니다.
  // load()의 실제 파일 경로는 사양에 따라 파일 확장자를 포함합니다.
  // `url`에 파일 확장자가 포함되어 있는지에 대한 이 간단한 진실 검사는
  // 대부분의 프로젝트에 적합하지만 일부 엣지 케이스(예:
  // 확장자가 없는 파일 또는 후행 공백으로 끝나는 url)는 다루지 않습니다.
  const isFilePath = !!extname(url);
  // 파일 경로인 경우 해당 경로가 있는 디렉터리를 가져옵니다.
  const dir = isFilePath ?
    dirname(fileURLToPath(url)) :
    url;
  // 동일한 디렉터리에 있는 package.json에 대한 파일 경로를 구성합니다.
  // 존재할 수도 있고 존재하지 않을 수도 있습니다.
  const packagePath = resolvePath(dir, 'package.json');
  // 존재하지 않을 수 있는 package.json을 읽어보십시오.
  const type = await readFile(packagePath, { encoding: 'utf8' })
    .then((filestring) => JSON.parse(filestring).type)
    .catch((err) => {
      if (err?.code !== 'ENOENT') console.error(err);
    });
  // package.json이 존재하고 값을 가진 `type` 필드를 포함하는 경우 voilà
  if (type) return type;
  // 그렇지 않으면 (루트에 없는 경우) 다음 상위 디렉터리를 계속 확인합니다.
  // 루트에 있으면 중지하고 false를 반환합니다.
  return dir.length > 1 && getPackageType(resolvePath(dir, '..'));
}
```

##### 동기 버전 {#synchronous-version}

```js [ESM]
// coffeescript-sync-hooks.mjs
import { readFileSync } from 'node:fs/promises';
import { registerHooks } from 'node:module';
import { dirname, extname, resolve as resolvePath } from 'node:path';
import { cwd } from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import coffeescript from 'coffeescript';

const extensionsRegex = /\.(coffee|litcoffee|coffee\.md)$/;

function load(url, context, nextLoad) {
  if (extensionsRegex.test(url)) {
    const format = getPackageType(url);

    const { source: rawSource } = nextLoad(url, { ...context, format });
    const transformedSource = coffeescript.compile(rawSource.toString(), url);

    return {
      format,
      shortCircuit: true,
      source: transformedSource,
    };
  }

  return nextLoad(url);
}

function getPackageType(url) {
  const isFilePath = !!extname(url);
  const dir = isFilePath ? dirname(fileURLToPath(url)) : url;
  const packagePath = resolvePath(dir, 'package.json');

  let type;
  try {
    const filestring = readFileSync(packagePath, { encoding: 'utf8' });
    type = JSON.parse(filestring).type;
  } catch (err) {
    if (err?.code !== 'ENOENT') console.error(err);
  }
  if (type) return type;
  return dir.length > 1 && getPackageType(resolvePath(dir, '..'));
}

registerHooks({ load });
```
#### 훅 실행 {#running-hooks}

```coffee [COFFEECRIPT]
# main.coffee {#maincoffee}
import { scream } from './scream.coffee'
console.log scream 'hello, world'

import { version } from 'node:process'
console.log "Brought to you by Node.js version #{version}"
```
```coffee [COFFEECRIPT]
# scream.coffee {#screamcoffee}
export scream = (str) -> str.toUpperCase()
```
앞선 훅 모듈을 사용하여 `node --import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register(pathToFileURL("./coffeescript-hooks.mjs"));' ./main.coffee` 또는 `node --import ./coffeescript-sync-hooks.mjs ./main.coffee`를 실행하면 `main.coffee`는 소스 코드가 디스크에서 로드된 후, Node.js가 이를 실행하기 전에 JavaScript로 변환됩니다. 이는 로드된 파일의 `import` 문을 통해 참조되는 모든 `.coffee`, `.litcoffee` 또는 `.coffee.md` 파일에 대해서도 마찬가지입니다.


#### Import maps {#import-maps}

이전 두 예제는 `load` 훅을 정의했습니다. 다음은 `resolve` 훅의 예입니다. 이 훅 모듈은 어떤 지정자를 다른 URL로 재정의할지 정의하는 `import-map.json` 파일을 읽습니다 ("import maps" 사양의 작은 하위 집합을 매우 단순하게 구현한 것입니다).

##### 비동기 버전 {#asynchronous-version_1}

```js [ESM]
// import-map-hooks.js
import fs from 'node:fs/promises';

const { imports } = JSON.parse(await fs.readFile('import-map.json'));

export async function resolve(specifier, context, nextResolve) {
  if (Object.hasOwn(imports, specifier)) {
    return nextResolve(imports[specifier], context);
  }

  return nextResolve(specifier, context);
}
```
##### 동기 버전 {#synchronous-version_1}

```js [ESM]
// import-map-sync-hooks.js
import fs from 'node:fs/promises';
import module from 'node:module';

const { imports } = JSON.parse(fs.readFileSync('import-map.json', 'utf-8'));

function resolve(specifier, context, nextResolve) {
  if (Object.hasOwn(imports, specifier)) {
    return nextResolve(imports[specifier], context);
  }

  return nextResolve(specifier, context);
}

module.registerHooks({ resolve });
```
##### 훅 사용 {#using-the-hooks}

다음 파일들이 있다고 가정합니다:

```js [ESM]
// main.js
import 'a-module';
```
```json [JSON]
// import-map.json
{
  "imports": {
    "a-module": "./some-module.js"
  }
}
```
```js [ESM]
// some-module.js
console.log('some module!');
```
`node --import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register(pathToFileURL("./import-map-hooks.js"));' main.js` 또는 `node --import ./import-map-sync-hooks.js main.js`를 실행하면 `some module!`이 출력됩니다.

## Source map v3 지원 {#source-map-v3-support}

**추가된 버전: v13.7.0, v12.17.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

소스 맵 캐시와 상호 작용하기 위한 도우미. 이 캐시는 소스 맵 구문 분석이 활성화되고 모듈의 바닥글에서 [소스 맵 포함 지시문](https://sourcemaps.info/spec#h.lmz475t4mvbx)이 발견될 때 채워집니다.

소스 맵 구문 분석을 활성화하려면 Node.js를 [`--enable-source-maps`](/ko/nodejs/api/cli#--enable-source-maps) 플래그를 사용하여 실행하거나 [`NODE_V8_COVERAGE=dir`](/ko/nodejs/api/cli#node_v8_coveragedir)을 설정하여 코드 커버리지를 활성화하여 실행해야 합니다.

::: code-group
```js [ESM]
// module.mjs
// ECMAScript 모듈에서
import { findSourceMap, SourceMap } from 'node:module';
```

```js [CJS]
// module.cjs
// CommonJS 모듈에서
const { findSourceMap, SourceMap } = require('node:module');
```
:::


### `module.findSourceMap(path)` {#modulefindsourcemappath}

**추가된 버전: v13.7.0, v12.17.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- 반환: [\<module.SourceMap\>](/ko/nodejs/api/module#class-modulesourcemap) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 소스 맵이 발견되면 `module.SourceMap`을 반환하고, 그렇지 않으면 `undefined`를 반환합니다.

`path`는 해당하는 소스 맵을 가져와야 하는 파일의 확인된 경로입니다.

### 클래스: `module.SourceMap` {#class-modulesourcemap}

**추가된 버전: v13.7.0, v12.17.0**

#### `new SourceMap(payload[, { lineLengths }])` {#new-sourcemappayload-{-linelengths-}}

- `payload` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `lineLengths` [\<number[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

새로운 `sourceMap` 인스턴스를 생성합니다.

`payload`는 [Source map v3 형식](https://sourcemaps.info/spec#h.mofvlxcwqzej)과 일치하는 키를 가진 객체입니다.

- `file`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `version`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `sources`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `sourcesContent`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `names`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `mappings`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `sourceRoot`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`lineLengths`는 생성된 코드의 각 줄 길이를 나타내는 선택적 배열입니다.

#### `sourceMap.payload` {#sourcemappayload}

- 반환: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

[`SourceMap`](/ko/nodejs/api/module#class-modulesourcemap) 인스턴스를 생성하는 데 사용된 페이로드에 대한 getter입니다.


#### `sourceMap.findEntry(lineOffset, columnOffset)` {#sourcemapfindentrylineoffset-columnoffset}

- `lineOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 생성된 소스에서 0부터 시작하는 줄 번호 오프셋입니다.
- `columnOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 생성된 소스에서 0부터 시작하는 열 번호 오프셋입니다.
- 반환: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

생성된 소스 파일의 줄 오프셋과 열 오프셋이 주어지면, 원본 파일의 SourceMap 범위를 나타내는 객체를 찾아서 반환하고, 그렇지 않으면 빈 객체를 반환합니다.

반환된 객체는 다음 키를 포함합니다.

- generatedLine: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 생성된 소스에서 범위 시작 부분의 줄 오프셋입니다.
- generatedColumn: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 생성된 소스에서 범위 시작 부분의 열 오프셋입니다.
- originalSource: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) SourceMap에 보고된 원본 파일의 파일 이름입니다.
- originalLine: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 원본 소스에서 범위 시작 부분의 줄 오프셋입니다.
- originalColumn: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 원본 소스에서 범위 시작 부분의 열 오프셋입니다.
- name: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

반환된 값은 오류 메시지 및 CallSite 객체에 나타나는 1부터 시작하는 줄 및 열 번호가 *아닌*, 0부터 시작하는 오프셋을 기반으로 SourceMap에 나타나는 원시 범위를 나타냅니다.

오류 스택 및 CallSite 객체에 의해 보고되는 lineNumber 및 columnNumber에서 해당하는 1부터 시작하는 줄 및 열 번호를 얻으려면 `sourceMap.findOrigin(lineNumber, columnNumber)`을 사용하십시오.


#### `sourceMap.findOrigin(lineNumber, columnNumber)` {#sourcemapfindoriginlinenumber-columnnumber}

- `lineNumber` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 생성된 소스에서 호출 위치의 1부터 시작하는 줄 번호
- `columnNumber` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 생성된 소스에서 호출 위치의 1부터 시작하는 열 번호
- 반환: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

생성된 소스의 호출 위치에서 1부터 시작하는 `lineNumber`와 `columnNumber`가 주어지면 원래 소스에서 해당 호출 위치를 찾습니다.

제공된 `lineNumber` 및 `columnNumber`가 소스 맵에서 찾을 수 없는 경우 빈 객체가 반환됩니다. 그렇지 않으면 반환된 객체에 다음 키가 포함됩니다.

- name: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) 소스 맵에 제공된 경우 소스 맵 범위의 이름
- fileName: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) SourceMap에 보고된 원래 소스의 파일 이름
- lineNumber: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 원래 소스에서 해당 호출 위치의 1부터 시작하는 lineNumber
- columnNumber: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 원래 소스에서 해당 호출 위치의 1부터 시작하는 columnNumber

