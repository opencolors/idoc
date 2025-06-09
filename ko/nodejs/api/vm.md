---
title: Node.js VM 모듈 문서
description: Node.js의 VM(가상 머신) 모듈은 V8 JavaScript 엔진 컨텍스트 내에서 코드를 컴파일하고 실행하기 위한 API를 제공합니다. 이를 통해 격리된 JavaScript 환경을 생성하고, 코드 실행을 샌드박스화하며, 스크립트 컨텍스트를 관리할 수 있습니다.
head:
  - - meta
    - name: og:title
      content: Node.js VM 모듈 문서 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js의 VM(가상 머신) 모듈은 V8 JavaScript 엔진 컨텍스트 내에서 코드를 컴파일하고 실행하기 위한 API를 제공합니다. 이를 통해 격리된 JavaScript 환경을 생성하고, 코드 실행을 샌드박스화하며, 스크립트 컨텍스트를 관리할 수 있습니다.
  - - meta
    - name: twitter:title
      content: Node.js VM 모듈 문서 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js의 VM(가상 머신) 모듈은 V8 JavaScript 엔진 컨텍스트 내에서 코드를 컴파일하고 실행하기 위한 API를 제공합니다. 이를 통해 격리된 JavaScript 환경을 생성하고, 코드 실행을 샌드박스화하며, 스크립트 컨텍스트를 관리할 수 있습니다.
---


# VM (JavaScript 실행) {#vm-executing-javascript}

::: tip [안정성: 2 - 안정적]
[안정성: 2](/ko/nodejs/api/documentation#stability-index) [안정성: 2](/ko/nodejs/api/documentation#stability-index) - 안정적
:::

**소스 코드:** [lib/vm.js](https://github.com/nodejs/node/blob/v23.5.0/lib/vm.js)

`node:vm` 모듈은 V8 가상 머신 컨텍스트 내에서 코드를 컴파일하고 실행할 수 있도록 합니다.

**<code>node:vm</code> 모듈은 보안 메커니즘이 아닙니다. 신뢰할 수 없는 코드를 실행하는 데 사용하지 마십시오.**

JavaScript 코드는 즉시 컴파일 및 실행하거나 컴파일, 저장 및 나중에 실행할 수 있습니다.

일반적인 사용 사례는 다른 V8 컨텍스트에서 코드를 실행하는 것입니다. 즉, 호출된 코드는 호출 코드와 다른 전역 객체를 갖습니다.

객체를 [*컨텍스트화*](/ko/nodejs/api/vm#what-does-it-mean-to-contextify-an-object)하여 컨텍스트를 제공할 수 있습니다. 호출된 코드는 컨텍스트의 모든 속성을 전역 변수처럼 취급합니다. 호출된 코드로 인한 전역 변수의 변경 사항은 컨텍스트 객체에 반영됩니다.

```js [ESM]
const vm = require('node:vm');

const x = 1;

const context = { x: 2 };
vm.createContext(context); // 객체를 컨텍스트화합니다.

const code = 'x += 40; var y = 17;';
// `x`와 `y`는 컨텍스트의 전역 변수입니다.
// 처음에는 x가 context.x의 값인 2의 값을 가집니다.
vm.runInContext(code, context);

console.log(context.x); // 42
console.log(context.y); // 17

console.log(x); // 1; y는 정의되지 않았습니다.
```
## 클래스: `vm.Script` {#class-vmscript}

**추가된 버전: v0.3.1**

`vm.Script` 클래스의 인스턴스에는 특정 컨텍스트에서 실행할 수 있는 미리 컴파일된 스크립트가 포함되어 있습니다.

### `new vm.Script(code[, options])` {#new-vmscriptcode-options}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v21.7.0, v20.12.0 | `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER`에 대한 지원이 추가되었습니다. |
| v17.0.0, v16.12.0 | `importModuleDynamically` 매개변수에 대한 import 속성 지원이 추가되었습니다. |
| v10.6.0 | `produceCachedData`는 `script.createCachedData()`를 선호하여 더 이상 사용되지 않습니다. |
| v5.7.0 | `cachedData` 및 `produceCachedData` 옵션이 이제 지원됩니다. |
| v0.3.1 | 추가된 버전: v0.3.1 |
:::

- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 컴파일할 JavaScript 코드입니다.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 이 스크립트에서 생성된 스택 추적에서 사용되는 파일 이름을 지정합니다. **기본값:** `'evalmachine.\<anonymous\>'`.
    - `lineOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 이 스크립트에서 생성된 스택 추적에 표시되는 줄 번호 오프셋을 지정합니다. **기본값:** `0`.
    - `columnOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 이 스크립트에서 생성된 스택 추적에 표시되는 첫 번째 줄 열 번호 오프셋을 지정합니다. **기본값:** `0`.
    - `cachedData` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 제공된 소스에 대한 V8의 코드 캐시 데이터가 포함된 선택적 `Buffer` 또는 `TypedArray` 또는 `DataView`를 제공합니다. 제공되는 경우 `cachedDataRejected` 값은 V8에서 데이터를 수락하는지에 따라 `true` 또는 `false`로 설정됩니다.
    - `produceCachedData` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`이고 `cachedData`가 없는 경우 V8은 `code`에 대한 코드 캐시 데이터를 생성하려고 시도합니다. 성공하면 V8의 코드 캐시 데이터가 포함된 `Buffer`가 생성되어 반환된 `vm.Script` 인스턴스의 `cachedData` 속성에 저장됩니다. `cachedDataProduced` 값은 코드 캐시 데이터가 성공적으로 생성되었는지 여부에 따라 `true` 또는 `false`로 설정됩니다. 이 옵션은 `script.createCachedData()`를 선호하여 **더 이상 사용되지 않습니다**. **기본값:** `false`.
    - `importModuleDynamically` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER\>](/ko/nodejs/api/vm#vmconstantsuse_main_context_default_loader) `import()`가 호출될 때 이 스크립트의 평가 중에 모듈을 로드하는 방법을 지정하는 데 사용됩니다. 이 옵션은 실험적인 모듈 API의 일부입니다. 프로덕션 환경에서 사용하는 것은 권장하지 않습니다. 자세한 내용은 [컴파일 API에서 동적 `import()` 지원](/ko/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis)을 참조하십시오.
  
 

`options`가 문자열이면 파일 이름을 지정합니다.

새 `vm.Script` 객체를 만들면 `code`가 컴파일되지만 실행되지는 않습니다. 컴파일된 `vm.Script`는 나중에 여러 번 실행할 수 있습니다. `code`는 전역 객체에 바인딩되지 않습니다. 오히려 각 실행 전에 해당 실행에 대해서만 바인딩됩니다.


### `script.cachedDataRejected` {#scriptcacheddatarejected}

**추가된 버전: v5.7.0**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

`cachedData`가 `vm.Script`를 생성하는 데 제공되면, 이 값은 V8에 의한 데이터 수락 여부에 따라 `true` 또는 `false`로 설정됩니다. 그렇지 않으면 값은 `undefined`입니다.

### `script.createCachedData()` {#scriptcreatecacheddata}

**추가된 버전: v10.6.0**

- 반환: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)

`Script` 생성자의 `cachedData` 옵션과 함께 사용할 수 있는 코드 캐시를 만듭니다. `Buffer`를 반환합니다. 이 메서드는 언제든지 여러 번 호출할 수 있습니다.

`Script`의 코드 캐시는 JavaScript에서 관찰 가능한 상태를 포함하지 않습니다. 코드 캐시는 스크립트 소스와 함께 저장하고 새 `Script` 인스턴스를 여러 번 구성하는 데 안전하게 사용할 수 있습니다.

`Script` 소스의 함수는 느리게 컴파일되도록 표시할 수 있으며 `Script` 구성 시에는 컴파일되지 않습니다. 이러한 함수는 처음 호출될 때 컴파일됩니다. 코드 캐시는 V8이 현재 `Script`에 대해 알고 있는 메타데이터를 직렬화하여 향후 컴파일 속도를 높이는 데 사용할 수 있습니다.

```js [ESM]
const script = new vm.Script(`
function add(a, b) {
  return a + b;
}

const x = add(1, 2);
`);

const cacheWithoutAdd = script.createCachedData();
// `cacheWithoutAdd`에서 함수 `add()`는 호출 시 전체 컴파일을 위해 표시됩니다.

script.runInThisContext();

const cacheWithAdd = script.createCachedData();
// `cacheWithAdd`에는 완전히 컴파일된 함수 `add()`가 포함되어 있습니다.
```
### `script.runInContext(contextifiedObject[, options])` {#scriptrunincontextcontextifiedobject-options}


::: info [히스토리]
| 버전 | 변경 사항 |
| --- | --- |
| v6.3.0 | 이제 `breakOnSigint` 옵션이 지원됩니다. |
| v0.3.1 | 추가된 버전: v0.3.1 |
:::

- `contextifiedObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) `vm.createContext()` 메서드에서 반환된 [contextified](/ko/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) 객체입니다.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `displayErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`인 경우 `code`를 컴파일하는 동안 [`Error`](/ko/nodejs/api/errors#class-error)가 발생하면 오류를 일으킨 코드 줄이 스택 추적에 첨부됩니다. **기본값:** `true`.
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 실행을 종료하기 전에 `code`를 실행할 밀리초 수를 지정합니다. 실행이 종료되면 [`Error`](/ko/nodejs/api/errors#class-error)가 발생합니다. 이 값은 엄격하게 양의 정수여야 합니다.
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`이면 `SIGINT` (+)를 수신하면 실행이 종료되고 [`Error`](/ko/nodejs/api/errors#class-error)가 발생합니다. `process.on('SIGINT')`를 통해 첨부된 이벤트에 대한 기존 핸들러는 스크립트 실행 중에는 비활성화되지만 그 후에는 계속 작동합니다. **기본값:** `false`.
  
 
- 반환: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 스크립트에서 실행된 마지막 명령문의 결과입니다.

주어진 `contextifiedObject` 내에서 `vm.Script` 객체에 포함된 컴파일된 코드를 실행하고 결과를 반환합니다. 코드를 실행하면 로컬 범위에 액세스할 수 없습니다.

다음 예제는 전역 변수를 증가시키고 다른 전역 변수의 값을 설정한 다음 코드를 여러 번 실행하는 코드를 컴파일합니다. 전역 변수는 `context` 객체에 포함됩니다.

```js [ESM]
const vm = require('node:vm');

const context = {
  animal: 'cat',
  count: 2,
};

const script = new vm.Script('count += 1; name = "kitty";');

vm.createContext(context);
for (let i = 0; i < 10; ++i) {
  script.runInContext(context);
}

console.log(context);
// 출력: { animal: 'cat', count: 12, name: 'kitty' }
```
`timeout` 또는 `breakOnSigint` 옵션을 사용하면 새로운 이벤트 루프와 해당 스레드가 시작되어 성능 오버헤드가 발생합니다.


### `script.runInNewContext([contextObject[, options]])` {#scriptruninnewcontextcontextobject-options}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v22.8.0, v20.18.0 | `contextObject` 인수가 이제 `vm.constants.DONT_CONTEXTIFY`를 허용합니다. |
| v14.6.0 | 이제 `microtaskMode` 옵션이 지원됩니다. |
| v10.0.0 | 이제 `contextCodeGeneration` 옵션이 지원됩니다. |
| v6.3.0 | 이제 `breakOnSigint` 옵션이 지원됩니다. |
| v0.3.1 | v0.3.1에서 추가됨 |
:::

- `contextObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<vm.constants.DONT_CONTEXTIFY\>](/ko/nodejs/api/vm#vmconstantsdont_contextify) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) [`vm.constants.DONT_CONTEXTIFY`](/ko/nodejs/api/vm#vmconstantsdont_contextify) 또는 [contextify](/ko/nodejs/api/vm#what-does-it-mean-to-contextify-an-object)될 객체입니다. `undefined`인 경우 이전 버전과의 호환성을 위해 비어 있는 contextify된 객체가 생성됩니다.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `displayErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`인 경우 `code`를 컴파일하는 동안 [`Error`](/ko/nodejs/api/errors#class-error)가 발생하면 오류를 일으킨 코드 줄이 스택 추적에 연결됩니다. **기본값:** `true`.
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 실행을 종료하기 전에 `code`를 실행할 밀리초 수를 지정합니다. 실행이 종료되면 [`Error`](/ko/nodejs/api/errors#class-error)가 발생합니다. 이 값은 엄격하게 양의 정수여야 합니다.
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`인 경우 `SIGINT` (+)를 수신하면 실행이 종료되고 [`Error`](/ko/nodejs/api/errors#class-error)가 발생합니다. `process.on('SIGINT')`를 통해 연결된 이벤트에 대한 기존 핸들러는 스크립트 실행 중에는 비활성화되지만 그 후에는 계속 작동합니다. **기본값:** `false`.
    - `contextName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 새로 생성된 컨텍스트의 사람이 읽을 수 있는 이름입니다. **기본값:** `'VM Context i'`, 여기서 `i`는 생성된 컨텍스트의 오름차순 숫자 인덱스입니다.
    - `contextOrigin` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 표시 목적으로 새로 생성된 컨텍스트에 해당하는 [Origin](https://developer.mozilla.org/en-US/docs/Glossary/Origin)입니다. 출처는 URL과 같이 형식이 지정되어야 하지만 스키마, 호스트 및 포트(필요한 경우)만 포함해야 합니다(예: [`URL`](/ko/nodejs/api/url#class-url) 객체의 [`url.origin`](/ko/nodejs/api/url#urlorigin) 속성 값). 특히 이 문자열은 경로를 나타내는 후행 슬래시를 생략해야 합니다. **기본값:** `''`.
    - `contextCodeGeneration` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `strings` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) false로 설정하면 `eval` 또는 함수 생성자(`Function`, `GeneratorFunction` 등)에 대한 모든 호출은 `EvalError`를 발생시킵니다. **기본값:** `true`.
    - `wasm` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) false로 설정하면 WebAssembly 모듈을 컴파일하려는 시도는 `WebAssembly.CompileError`를 발생시킵니다. **기본값:** `true`.
  
 
    - `microtaskMode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `afterEvaluate`로 설정하면 마이크로태스크(`Promise` 및 `async function`을 통해 예약된 태스크)는 스크립트가 실행된 직후에 실행됩니다. 이 경우 `timeout` 및 `breakOnSigint` 범위에 포함됩니다.
  
 
- 반환: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 스크립트에서 실행된 마지막 문의 결과입니다.

이 메서드는 `script.runInContext(vm.createContext(options), options)`에 대한 바로 가기입니다. 한 번에 여러 작업을 수행합니다.

다음 예제는 전역 변수를 설정하는 코드를 컴파일한 다음 서로 다른 컨텍스트에서 코드를 여러 번 실행합니다. 전역 변수는 각 개별 `context`에서 설정되고 포함됩니다.

```js [ESM]
const vm = require('node:vm');

const script = new vm.Script('globalVar = "set"');

const contexts = [{}, {}, {}];
contexts.forEach((context) => {
  script.runInNewContext(context);
});

console.log(contexts);
// Prints: [{ globalVar: 'set' }, { globalVar: 'set' }, { globalVar: 'set' }]

// This would throw if the context is created from a contextified object.
// vm.constants.DONT_CONTEXTIFY allows creating contexts with ordinary
// global objects that can be frozen.
const freezeScript = new vm.Script('Object.freeze(globalThis); globalThis;');
const frozenContext = freezeScript.runInNewContext(vm.constants.DONT_CONTEXTIFY);
```

### `script.runInThisContext([options])` {#scriptruninthiscontextoptions}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v6.3.0 | 이제 `breakOnSigint` 옵션이 지원됩니다. |
| v0.3.1 | v0.3.1에 추가됨 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `displayErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`인 경우 `code`를 컴파일하는 동안 [`Error`](/ko/nodejs/api/errors#class-error)가 발생하면 오류를 일으킨 코드 줄이 스택 추적에 연결됩니다. **기본값:** `true`.
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 실행을 종료하기 전에 `code`를 실행할 밀리초 수를 지정합니다. 실행이 종료되면 [`Error`](/ko/nodejs/api/errors#class-error)가 발생합니다. 이 값은 엄격하게 양의 정수여야 합니다.
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`인 경우 `SIGINT` (+)를 수신하면 실행이 종료되고 [`Error`](/ko/nodejs/api/errors#class-error)가 발생합니다. `process.on('SIGINT')`를 통해 연결된 이벤트에 대한 기존 핸들러는 스크립트 실행 중에는 비활성화되지만 그 후에는 계속 작동합니다. **기본값:** `false`.
  
 
- 반환: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 스크립트에서 실행된 마지막 명령문의 결과입니다.

현재 `global` 객체의 컨텍스트 내에서 `vm.Script`에 포함된 컴파일된 코드를 실행합니다. 코드를 실행하면 로컬 범위에 액세스할 수 없지만 현재 `global` 객체에는 액세스할 수 *있습니다*.

다음 예제는 `global` 변수를 증가시키는 코드를 컴파일한 다음 해당 코드를 여러 번 실행합니다.

```js [ESM]
const vm = require('node:vm');

global.globalVar = 0;

const script = new vm.Script('globalVar += 1', { filename: 'myfile.vm' });

for (let i = 0; i < 1000; ++i) {
  script.runInThisContext();
}

console.log(globalVar);

// 1000
```

### `script.sourceMapURL` {#scriptsourcemapurl}

**추가된 버전: v19.1.0, v18.13.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

스크립트가 소스 맵 매직 주석을 포함하는 소스에서 컴파일되면 이 속성은 소스 맵의 URL로 설정됩니다.

::: code-group
```js [ESM]
import vm from 'node:vm';

const script = new vm.Script(`
function myFunc() {}
//# sourceMappingURL=sourcemap.json
`);

console.log(script.sourceMapURL);
// Prints: sourcemap.json
```

```js [CJS]
const vm = require('node:vm');

const script = new vm.Script(`
function myFunc() {}
//# sourceMappingURL=sourcemap.json
`);

console.log(script.sourceMapURL);
// Prints: sourcemap.json
```
:::

## 클래스: `vm.Module` {#class-vmmodule}

**추가된 버전: v13.0.0, v12.16.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

이 기능은 `--experimental-vm-modules` 명령 플래그가 활성화된 경우에만 사용할 수 있습니다.

`vm.Module` 클래스는 VM 컨텍스트에서 ECMAScript 모듈을 사용하기 위한 하위 수준 인터페이스를 제공합니다. 이는 ECMAScript 사양에 정의된 [모듈 레코드](https://262.ecma-international.org/14.0/#sec-abstract-module-records)를 밀접하게 반영하는 `vm.Script` 클래스와 대응됩니다.

그러나 `vm.Script`와 달리 모든 `vm.Module` 객체는 생성 시 컨텍스트에 바인딩됩니다. `vm.Module` 객체에 대한 작업은 본질적으로 비동기적인 반면, `vm.Script` 객체는 동기적입니다. 'async' 함수를 사용하면 `vm.Module` 객체를 조작하는 데 도움이 될 수 있습니다.

`vm.Module` 객체를 사용하려면 생성/파싱, 연결 및 평가의 세 가지 별개의 단계가 필요합니다. 이러한 세 단계는 다음 예에 나와 있습니다.

이 구현은 [ECMAScript 모듈 로더](/ko/nodejs/api/esm#modules-ecmascript-modules)보다 낮은 수준에 있습니다. 아직 로더와 상호 작용할 방법도 없지만 지원이 계획되어 있습니다.

::: code-group
```js [ESM]
import vm from 'node:vm';

const contextifiedObject = vm.createContext({
  secret: 42,
  print: console.log,
});

// 1단계
//
// 새 `vm.SourceTextModule` 객체를 생성하여 모듈을 만듭니다. 이렇게 하면 제공된
// 소스 텍스트가 파싱되고 문제가 발생하면 `SyntaxError`가 발생합니다. 기본적으로
// 모듈은 최상위 컨텍스트에서 생성됩니다. 그러나 여기서는 이 모듈이 속한 컨텍스트로
// `contextifiedObject`를 지정합니다.
//
// 여기서는 "foo" 모듈에서 기본 내보내기를 가져와 로컬 바인딩 "secret"에 넣으려고
// 시도합니다.

const bar = new vm.SourceTextModule(`
  import s from 'foo';
  s;
  print(s);
`, { context: contextifiedObject });

// 2단계
//
// 이 모듈의 가져온 종속성을 "연결"합니다.
//
// 제공된 연결 콜백("링커")은 두 개의 인수를 허용합니다. 즉, 상위 모듈(이 경우 `bar`)과
// 가져온 모듈의 지정자인 문자열입니다. 콜백은 제공된 지정자에 해당하는 모듈을
// 반환해야 하며, `module.link()`에 문서화된 특정 요구 사항이 있습니다.
//
// 반환된 모듈에 대해 연결이 아직 시작되지 않은 경우 동일한 링커 콜백이 반환된 모듈에서
// 호출됩니다.
//
// 종속성이 없는 최상위 모듈조차도 명시적으로 연결해야 합니다. 그러나 제공된 콜백은
// 호출되지 않습니다.
//
// link() 메서드는 링커에서 반환된 모든 프로미스가 해결될 때 해결되는 프로미스를
// 반환합니다.
//
// 참고: 이것은 링커 함수가 호출될 때마다 새 "foo" 모듈을 만드는 부자연스러운 예입니다.
// 완전한 모듈 시스템에서는 중복된 모듈을 피하기 위해 캐시가 사용될 가능성이 높습니다.

async function linker(specifier, referencingModule) {
  if (specifier === 'foo') {
    return new vm.SourceTextModule(`
      // "secret" 변수는 컨텍스트를 만들 때 "contextifiedObject"에 추가한 전역 변수를
      // 나타냅니다.
      export default secret;
    `, { context: referencingModule.context });

    // 여기에서 `referencingModule.context` 대신 `contextifiedObject`를 사용해도
    // 작동합니다.
  }
  throw new Error(`종속성을 확인할 수 없습니다: ${specifier}`);
}
await bar.link(linker);

// 3단계
//
// 모듈을 평가합니다. evaluate() 메서드는 모듈 평가가 완료된 후 해결되는
// 프로미스를 반환합니다.

// 42를 출력합니다.
await bar.evaluate();
```

```js [CJS]
const vm = require('node:vm');

const contextifiedObject = vm.createContext({
  secret: 42,
  print: console.log,
});

(async () => {
  // 1단계
  //
  // 새 `vm.SourceTextModule` 객체를 생성하여 모듈을 만듭니다. 이렇게 하면 제공된
  // 소스 텍스트가 파싱되고 문제가 발생하면 `SyntaxError`가 발생합니다. 기본적으로
  // 모듈은 최상위 컨텍스트에서 생성됩니다. 그러나 여기서는 이 모듈이 속한 컨텍스트로
  // `contextifiedObject`를 지정합니다.
  //
  // 여기서는 "foo" 모듈에서 기본 내보내기를 가져와 로컬 바인딩 "secret"에 넣으려고
  // 시도합니다.

  const bar = new vm.SourceTextModule(`
    import s from 'foo';
    s;
    print(s);
  `, { context: contextifiedObject });

  // 2단계
  //
  // 이 모듈의 가져온 종속성을 "연결"합니다.
  //
  // 제공된 연결 콜백("링커")은 두 개의 인수를 허용합니다. 즉, 상위 모듈(이 경우 `bar`)과
  // 가져온 모듈의 지정자인 문자열입니다. 콜백은 제공된 지정자에 해당하는 모듈을
  // 반환해야 하며, `module.link()`에 문서화된 특정 요구 사항이 있습니다.
  //
  // 반환된 모듈에 대해 연결이 아직 시작되지 않은 경우 동일한 링커 콜백이 반환된 모듈에서
  // 호출됩니다.
  //
  // 종속성이 없는 최상위 모듈조차도 명시적으로 연결해야 합니다. 그러나 제공된 콜백은
  // 호출되지 않습니다.
  //
  // link() 메서드는 링커에서 반환된 모든 프로미스가 해결될 때 해결되는 프로미스를
  // 반환합니다.
  //
  // 참고: 이것은 링커 함수가 호출될 때마다 새 "foo" 모듈을 만드는 부자연스러운 예입니다.
  // 완전한 모듈 시스템에서는 중복된 모듈을 피하기 위해 캐시가 사용될 가능성이 높습니다.

  async function linker(specifier, referencingModule) {
    if (specifier === 'foo') {
      return new vm.SourceTextModule(`
        // "secret" 변수는 컨텍스트를 만들 때 "contextifiedObject"에 추가한 전역 변수를
        // 나타냅니다.
        export default secret;
      `, { context: referencingModule.context });

      // 여기에서 `referencingModule.context` 대신 `contextifiedObject`를 사용해도
      // 작동합니다.
    }
    throw new Error(`종속성을 확인할 수 없습니다: ${specifier}`);
  }
  await bar.link(linker);

  // 3단계
  //
  // 모듈을 평가합니다. evaluate() 메서드는 모듈 평가가 완료된 후 해결되는
  // 프로미스를 반환합니다.

  // 42를 출력합니다.
  await bar.evaluate();
})();
```
:::


### `module.dependencySpecifiers` {#moduledependencyspecifiers}

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

이 모듈의 모든 종속성의 지정자입니다. 반환된 배열은 변경을 허용하지 않도록 고정됩니다.

ECMAScript 사양의 [Cyclic Module Record](https://tc39.es/ecma262/#sec-cyclic-module-records)의 `[[RequestedModules]]` 필드에 해당합니다.

### `module.error` {#moduleerror}

- [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

`module.status`가 `'errored'`인 경우, 이 속성은 모듈이 평가 중에 발생시킨 예외를 포함합니다. 상태가 다른 경우, 이 속성에 액세스하면 예외가 발생합니다.

`undefined` 값은 `throw undefined;`와 가능한 모호성 때문에 발생한 예외가 없는 경우에 사용할 수 없습니다.

ECMAScript 사양의 [Cyclic Module Record](https://tc39.es/ecma262/#sec-cyclic-module-records)의 `[[EvaluationError]]` 필드에 해당합니다.

### `module.evaluate([options])` {#moduleevaluateoptions}

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 실행을 종료하기 전에 평가할 밀리초 수를 지정합니다. 실행이 중단되면 [`Error`](/ko/nodejs/api/errors#class-error)가 발생합니다. 이 값은 엄격하게 양의 정수여야 합니다.
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`인 경우, `SIGINT` (+)를 수신하면 실행이 종료되고 [`Error`](/ko/nodejs/api/errors#class-error)가 발생합니다. `process.on('SIGINT')`를 통해 연결된 이벤트에 대한 기존 핸들러는 스크립트 실행 중에 비활성화되지만, 그 후에도 계속 작동합니다. **기본값:** `false`.
  
 
- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 성공 시 `undefined`로 이행합니다.

모듈을 평가합니다.

이것은 모듈이 연결된 후에 호출되어야 합니다. 그렇지 않으면 거부됩니다. 모듈이 이미 평가된 경우에도 호출할 수 있으며, 이 경우 초기 평가가 성공적으로 종료된 경우 아무 것도 하지 않거나(`module.status`가 `'evaluated'`인 경우), 초기 평가로 인해 발생한 예외를 다시 발생시킵니다(`module.status`가 `'errored'`인 경우).

모듈이 평가 중인 동안에는 이 메서드를 호출할 수 없습니다(`module.status`가 `'evaluating'`인 경우).

ECMAScript 사양의 [Cyclic Module Record](https://tc39.es/ecma262/#sec-cyclic-module-records)의 [Evaluate() concrete method](https://tc39.es/ecma262/#sec-moduleevaluation) 필드에 해당합니다.


### `module.identifier` {#moduleidentifier}

- [\<문자열\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

생성자에서 설정된 현재 모듈의 식별자입니다.

### `module.link(linker)` {#modulelinklinker}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v21.1.0, v20.10.0, v18.19.0 | `extra.assert` 옵션이 `extra.attributes`로 이름이 변경되었습니다. 이전 이름은 이전 버전과의 호환성을 위해 여전히 제공됩니다. |
:::

- `linker` [\<함수\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `specifier` [\<문자열\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 요청된 모듈의 지정자:
    - `referencingModule` [\<vm.Module\>](/ko/nodejs/api/vm#class-vmmodule) `link()`가 호출되는 `Module` 객체입니다.
    - `extra` [\<객체\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `attributes` [\<객체\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 속성의 데이터: ECMA-262에 따라 지원되지 않는 속성이 있으면 호스트가 오류를 트리거해야 합니다.
    - `assert` [\<객체\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) `extra.attributes`의 별칭입니다.

    - 반환: [\<vm.Module\>](/ko/nodejs/api/vm#class-vmmodule) | [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

- 반환: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

모듈 종속성을 연결합니다. 이 메서드는 평가 전에 호출해야 하며 모듈당 한 번만 호출할 수 있습니다.

이 함수는 `Module` 객체 또는 결국 `Module` 객체로 확인되는 `Promise`를 반환해야 합니다. 반환된 `Module`은 다음 두 가지 불변성을 충족해야 합니다.

- 부모 `Module`과 동일한 컨텍스트에 속해야 합니다.
- `status`가 `'errored'`가 아니어야 합니다.

반환된 `Module`의 `status`가 `'unlinked'`인 경우, 이 메서드는 제공된 동일한 `linker` 함수를 사용하여 반환된 `Module`에서 재귀적으로 호출됩니다.

`link()`는 모든 연결 인스턴스가 유효한 `Module`로 확인될 때 확인되거나 링커 함수가 예외를 발생시키거나 유효하지 않은 `Module`을 반환하는 경우 거부되는 `Promise`를 반환합니다.

링커 함수는 대략적으로 ECMAScript 사양의 구현 정의 [HostResolveImportedModule](https://tc39.es/ecma262/#sec-hostresolveimportedmodule) 추상 연산에 해당하며, 몇 가지 주요 차이점이 있습니다.

- 링커 함수는 비동기적일 수 있지만 [HostResolveImportedModule](https://tc39.es/ecma262/#sec-hostresolveimportedmodule)은 동기적입니다.

모듈 연결 중에 사용되는 실제 [HostResolveImportedModule](https://tc39.es/ecma262/#sec-hostresolveimportedmodule) 구현은 연결 중에 연결된 모듈을 반환하는 구현입니다. 그 시점에는 모든 모듈이 이미 완전히 연결되었으므로 [HostResolveImportedModule](https://tc39.es/ecma262/#sec-hostresolveimportedmodule) 구현은 사양에 따라 완전히 동기적입니다.

ECMAScript 사양의 [순환 모듈 레코드](https://tc39.es/ecma262/#sec-cyclic-module-records)의 [Link() 구체적 메서드](https://tc39.es/ecma262/#sec-moduledeclarationlinking) 필드에 해당합니다.


### `module.namespace` {#modulenamespace}

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

모듈의 네임스페이스 객체입니다. 이는 링크 (`module.link()`)가 완료된 후에만 사용할 수 있습니다.

ECMAScript 사양의 [GetModuleNamespace](https://tc39.es/ecma262/#sec-getmodulenamespace) 추상 연산에 해당합니다.

### `module.status` {#modulestatus}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

모듈의 현재 상태입니다. 다음 중 하나가 됩니다.

-  `'unlinked'`: `module.link()`가 아직 호출되지 않았습니다.
-  `'linking'`: `module.link()`가 호출되었지만, 링커 함수에서 반환된 모든 Promise가 아직 해결되지 않았습니다.
-  `'linked'`: 모듈이 성공적으로 링크되었고, 모든 종속성이 링크되었지만, `module.evaluate()`가 아직 호출되지 않았습니다.
-  `'evaluating'`: 모듈 자체 또는 상위 모듈의 `module.evaluate()`를 통해 모듈이 평가되고 있습니다.
-  `'evaluated'`: 모듈이 성공적으로 평가되었습니다.
-  `'errored'`: 모듈이 평가되었지만, 예외가 발생했습니다.

`'errored'`를 제외하고, 이 상태 문자열은 사양의 [Cyclic Module Record](https://tc39.es/ecma262/#sec-cyclic-module-records)의 `[[Status]]` 필드에 해당합니다. `'errored'`는 사양의 `'evaluated'`에 해당하지만, `[[EvaluationError]]`가 `undefined`가 아닌 값으로 설정됩니다.

## 클래스: `vm.SourceTextModule` {#class-vmsourcetextmodule}

**추가된 버전: v9.6.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

이 기능은 `--experimental-vm-modules` 명령 플래그를 활성화해야만 사용할 수 있습니다.

- 확장: [\<vm.Module\>](/ko/nodejs/api/vm#class-vmmodule)

`vm.SourceTextModule` 클래스는 ECMAScript 사양에 정의된 [Source Text Module Record](https://tc39.es/ecma262/#sec-source-text-module-records)를 제공합니다.

### `new vm.SourceTextModule(code[, options])` {#new-vmsourcetextmodulecode-options}


::: info [히스토리]
| 버전 | 변경 사항 |
| --- | --- |
| v17.0.0, v16.12.0 | `importModuleDynamically` 매개변수에 대한 import 속성 지원이 추가되었습니다. |
:::

- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 파싱할 JavaScript 모듈 코드
- `options`
    - `identifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 스택 추적에서 사용되는 문자열. **기본값:** `'vm:module(i)'`, 여기서 `i`는 컨텍스트별 오름차순 인덱스입니다.
    - `cachedData` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 제공된 소스에 대한 V8의 코드 캐시 데이터가 있는 선택적 `Buffer` 또는 `TypedArray` 또는 `DataView`를 제공합니다. `code`는 이 `cachedData`가 생성된 모듈과 동일해야 합니다.
    - `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 이 `Module`을 컴파일하고 평가하기 위해 `vm.createContext()` 메서드에서 반환된 [컨텍스트화된](/ko/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) 객체입니다. 컨텍스트가 지정되지 않은 경우, 모듈은 현재 실행 컨텍스트에서 평가됩니다.
    - `lineOffset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 이 `Module`에서 생성된 스택 추적에 표시되는 줄 번호 오프셋을 지정합니다. **기본값:** `0`.
    - `columnOffset` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 이 `Module`에서 생성된 스택 추적에 표시되는 첫 번째 줄 열 번호 오프셋을 지정합니다. **기본값:** `0`.
    - `initializeImportMeta` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 이 `Module`의 평가 중에 `import.meta`를 초기화하기 위해 호출됩니다.
    - `meta` [\<import.meta\>](/ko/nodejs/api/esm#importmeta)
    - `module` [\<vm.SourceTextModule\>](/ko/nodejs/api/vm#class-vmsourcetextmodule)

    - `importModuleDynamically` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `import()`가 호출될 때 이 모듈의 평가 중에 모듈을 로드하는 방법을 지정하는 데 사용됩니다. 이 옵션은 실험적 모듈 API의 일부입니다. 프로덕션 환경에서 사용하는 것을 권장하지 않습니다. 자세한 내용은 [컴파일 API에서 동적 `import()` 지원](/ko/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis)을 참조하십시오.

새로운 `SourceTextModule` 인스턴스를 만듭니다.

객체인 `import.meta` 객체에 할당된 속성을 사용하면 모듈이 지정된 `context` 외부의 정보에 접근할 수 있습니다. 특정 컨텍스트에서 객체를 생성하려면 `vm.runInContext()`를 사용하십시오.



::: code-group
```js [ESM]
import vm from 'node:vm';

const contextifiedObject = vm.createContext({ secret: 42 });

const module = new vm.SourceTextModule(
  'Object.getPrototypeOf(import.meta.prop).secret = secret;',
  {
    initializeImportMeta(meta) {
      // 참고: 이 객체는 최상위 컨텍스트에서 생성됩니다. 따라서
      // Object.getPrototypeOf(import.meta.prop)는 컨텍스트화된 객체의 Object.prototype이 아닌
      // 최상위 컨텍스트의 Object.prototype을 가리킵니다.
      meta.prop = {};
    },
  });
// 모듈에 종속성이 없으므로 링커 함수는 호출되지 않습니다.
await module.link(() => {});
await module.evaluate();

// 이제 Object.prototype.secret은 42와 같습니다.
//
// 이 문제를 해결하려면
//     meta.prop = {};
// 위 코드를 다음 코드로 바꾸십시오.
//     meta.prop = vm.runInContext('{}', contextifiedObject);
```

```js [CJS]
const vm = require('node:vm');
const contextifiedObject = vm.createContext({ secret: 42 });
(async () => {
  const module = new vm.SourceTextModule(
    'Object.getPrototypeOf(import.meta.prop).secret = secret;',
    {
      initializeImportMeta(meta) {
        // 참고: 이 객체는 최상위 컨텍스트에서 생성됩니다. 따라서
        // Object.getPrototypeOf(import.meta.prop)는 컨텍스트화된 객체의 Object.prototype이 아닌
        // 최상위 컨텍스트의 Object.prototype을 가리킵니다.
        meta.prop = {};
      },
    });
  // 모듈에 종속성이 없으므로 링커 함수는 호출되지 않습니다.
  await module.link(() => {});
  await module.evaluate();
  // 이제 Object.prototype.secret은 42와 같습니다.
  //
  // 이 문제를 해결하려면
  //     meta.prop = {};
  // 위 코드를 다음 코드로 바꾸십시오.
  //     meta.prop = vm.runInContext('{}', contextifiedObject);
})();
```
:::


### `sourceTextModule.createCachedData()` {#sourcetextmodulecreatecacheddata}

**Added in: v13.7.0, v12.17.0**

- 반환값: [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer)

`SourceTextModule` 생성자의 `cachedData` 옵션과 함께 사용할 수 있는 코드 캐시를 생성합니다. `Buffer`를 반환합니다. 이 메서드는 모듈이 평가되기 전에 여러 번 호출될 수 있습니다.

`SourceTextModule`의 코드 캐시에는 JavaScript에서 관찰 가능한 상태가 포함되어 있지 않습니다. 코드 캐시는 스크립트 소스와 함께 저장하고 새 `SourceTextModule` 인스턴스를 여러 번 생성하는 데 안전하게 사용할 수 있습니다.

`SourceTextModule` 소스의 함수는 느리게 컴파일되도록 표시할 수 있으며 `SourceTextModule`을 생성할 때 컴파일되지 않습니다. 이러한 함수는 처음 호출될 때 컴파일됩니다. 코드 캐시는 V8이 현재 `SourceTextModule`에 대해 알고 있는 메타데이터를 직렬화하여 향후 컴파일 속도를 높일 수 있습니다.

```js [ESM]
// 초기 모듈 생성
const module = new vm.SourceTextModule('const a = 1;');

// 이 모듈에서 캐시된 데이터 생성
const cachedData = module.createCachedData();

// 캐시된 데이터를 사용하여 새 모듈 생성. 코드는 동일해야 합니다.
const module2 = new vm.SourceTextModule('const a = 1;', { cachedData });
```
## Class: `vm.SyntheticModule` {#class-vmsyntheticmodule}

**Added in: v13.0.0, v12.16.0**

::: warning [Stable: 1 - 실험적]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

이 기능은 `--experimental-vm-modules` 명령 플래그가 활성화된 경우에만 사용할 수 있습니다.

- 확장: [\<vm.Module\>](/ko/nodejs/api/vm#class-vmmodule)

`vm.SyntheticModule` 클래스는 WebIDL 사양에 정의된 [Synthetic Module Record](https://heycam.github.io/webidl/#synthetic-module-records)를 제공합니다. 합성 모듈의 목적은 ECMAScript 모듈 그래프에 비 JavaScript 소스를 노출하기 위한 일반적인 인터페이스를 제공하는 것입니다.

```js [ESM]
const vm = require('node:vm');

const source = '{ "a": 1 }';
const module = new vm.SyntheticModule(['default'], function() {
  const obj = JSON.parse(source);
  this.setExport('default', obj);
});

// 링크에서 `module` 사용...
```

### `new vm.SyntheticModule(exportNames, evaluateCallback[, options])` {#new-vmsyntheticmoduleexportnames-evaluatecallback-options}

**추가된 버전: v13.0.0, v12.16.0**

- `exportNames` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 모듈에서 내보낼 이름의 배열입니다.
- `evaluateCallback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 모듈이 평가될 때 호출됩니다.
- `options`
    - `identifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 스택 추적에 사용되는 문자열입니다. **기본값:** `'vm:module(i)'`이며 `i`는 컨텍스트별 오름차순 인덱스입니다.
    - `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 이 `Module`을 컴파일하고 평가할 `vm.createContext()` 메서드에서 반환된 [컨텍스트화된](/ko/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) 객체입니다.

새로운 `SyntheticModule` 인스턴스를 생성합니다.

이 인스턴스의 exports에 할당된 객체를 통해 모듈의 임포터는 지정된 `context` 외부의 정보에 접근할 수 있습니다. 특정 컨텍스트에서 객체를 생성하려면 `vm.runInContext()`를 사용하세요.

### `syntheticModule.setExport(name, value)` {#syntheticmodulesetexportname-value}

**추가된 버전: v13.0.0, v12.16.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 설정할 내보내기의 이름입니다.
- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 내보내기를 설정할 값입니다.

이 메서드는 모듈이 연결된 후에 내보내기의 값을 설정하는 데 사용됩니다. 모듈이 연결되기 전에 호출되면 [`ERR_VM_MODULE_STATUS`](/ko/nodejs/api/errors#err_vm_module_status) 오류가 발생합니다.

::: code-group
```js [ESM]
import vm from 'node:vm';

const m = new vm.SyntheticModule(['x'], () => {
  m.setExport('x', 1);
});

await m.link(() => {});
await m.evaluate();

assert.strictEqual(m.namespace.x, 1);
```

```js [CJS]
const vm = require('node:vm');
(async () => {
  const m = new vm.SyntheticModule(['x'], () => {
    m.setExport('x', 1);
  });
  await m.link(() => {});
  await m.evaluate();
  assert.strictEqual(m.namespace.x, 1);
})();
```
:::


## `vm.compileFunction(code[, params[, options]])` {#vmcompilefunctioncode-params-options}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v21.7.0, v20.12.0 | `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER`에 대한 지원이 추가되었습니다. |
| v19.6.0, v18.15.0 | `cachedData` 옵션이 전달된 경우 반환 값에 이제 `vm.Script` 버전과 동일한 의미 체계를 가진 `cachedDataRejected`가 포함됩니다. |
| v17.0.0, v16.12.0 | `importModuleDynamically` 매개변수에 대한 import 속성 지원이 추가되었습니다. |
| v15.9.0 | `importModuleDynamically` 옵션이 다시 추가되었습니다. |
| v14.3.0 | 호환성 문제로 인해 `importModuleDynamically`가 제거되었습니다. |
| v14.1.0, v13.14.0 | 이제 `importModuleDynamically` 옵션이 지원됩니다. |
| v10.10.0 | 추가됨: v10.10.0 |
:::

- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 컴파일할 함수의 본문입니다.
- `params` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 함수에 대한 모든 매개변수를 포함하는 문자열 배열입니다.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 이 스크립트에서 생성된 스택 추적에 사용되는 파일 이름을 지정합니다. **기본값:** `''`.
    - `lineOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 이 스크립트에서 생성된 스택 추적에 표시되는 줄 번호 오프셋을 지정합니다. **기본값:** `0`.
    - `columnOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 이 스크립트에서 생성된 스택 추적에 표시되는 첫 번째 줄의 열 번호 오프셋을 지정합니다. **기본값:** `0`.
    - `cachedData` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 제공된 소스에 대한 V8의 코드 캐시 데이터가 있는 선택적 `Buffer` 또는 `TypedArray` 또는 `DataView`를 제공합니다. 이는 동일한 `code` 및 `params`를 사용하여 이전에 [`vm.compileFunction()`](/ko/nodejs/api/vm#vmcompilefunctioncode-params-options)을 호출하여 생성해야 합니다.
    - `produceCachedData` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) 새 캐시 데이터를 생성할지 여부를 지정합니다. **기본값:** `false`.
    - `parsingContext` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 해당 함수를 컴파일해야 하는 [컨텍스트화된](/ko/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) 객체입니다.
    - `contextExtensions` [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 컴파일하는 동안 적용될 컨텍스트 확장(현재 범위를 래핑하는 객체) 모음을 포함하는 배열입니다. **기본값:** `[]`.

- `importModuleDynamically` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER\>](/ko/nodejs/api/vm#vmconstantsuse_main_context_default_loader) `import()`가 호출될 때 이 함수를 평가하는 동안 모듈을 로드하는 방법을 지정하는 데 사용됩니다. 이 옵션은 실험적 모듈 API의 일부입니다. 프로덕션 환경에서는 사용하지 않는 것이 좋습니다. 자세한 내용은 [컴파일 API에서 동적 `import()` 지원](/ko/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis)을 참조하세요.
- 반환: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

주어진 코드를 제공된 컨텍스트로 컴파일하고 (컨텍스트가 제공되지 않은 경우 현재 컨텍스트가 사용됨) 주어진 `params`를 사용하여 함수 내부에 래핑하여 반환합니다.


## `vm.constants` {#vmconstants}

**Added in: v21.7.0, v20.12.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

VM 작업에 일반적으로 사용되는 상수를 포함하는 객체를 반환합니다.

### `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER` {#vmconstantsuse_main_context_default_loader}

**Added in: v21.7.0, v20.12.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index).1 - 활발한 개발
:::

Node.js가 요청된 모듈을 로드하기 위해 메인 컨텍스트의 기본 ESM 로더를 사용하도록 `vm.Script` 및 `vm.compileFunction()`에 대한 `importModuleDynamically` 옵션으로 사용할 수 있는 상수입니다.

자세한 내용은 [컴파일 API에서 동적 `import()` 지원](/ko/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis)을 참조하세요.

## `vm.createContext([contextObject[, options]])` {#vmcreatecontextcontextobject-options}


::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v22.8.0, v20.18.0 | 이제 `contextObject` 인수가 `vm.constants.DONT_CONTEXTIFY`를 허용합니다. |
| v21.7.0, v20.12.0 | `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER`에 대한 지원이 추가되었습니다. |
| v21.2.0, v20.11.0 | 이제 `importModuleDynamically` 옵션이 지원됩니다. |
| v14.6.0 | 이제 `microtaskMode` 옵션이 지원됩니다. |
| v10.0.0 | 첫 번째 인수는 더 이상 함수가 될 수 없습니다. |
| v10.0.0 | 이제 `codeGeneration` 옵션이 지원됩니다. |
| v0.3.1 | Added in: v0.3.1 |
:::

- `contextObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<vm.constants.DONT_CONTEXTIFY\>](/ko/nodejs/api/vm#vmconstantsdont_contextify) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) [`vm.constants.DONT_CONTEXTIFY`](/ko/nodejs/api/vm#vmconstantsdont_contextify)이거나 [컨텍스트화](/ko/nodejs/api/vm#what-does-it-mean-to-contextify-an-object)될 객체입니다. `undefined`인 경우 이전 버전과의 호환성을 위해 빈 컨텍스트화된 객체가 생성됩니다.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 새로 생성된 컨텍스트의 사람이 읽을 수 있는 이름입니다. **기본값:** `'VM 컨텍스트 i'`, 여기서 `i`는 생성된 컨텍스트의 오름차순 숫자 인덱스입니다.
    - `origin` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 표시 목적으로 새로 생성된 컨텍스트에 해당하는 [출처](https://developer.mozilla.org/en-US/docs/Glossary/Origin)입니다. 출처는 URL과 같은 형식이어야 하지만 스키마, 호스트 및 포트(필요한 경우)만 있어야 합니다. 예를 들어 [`url.origin`](/ko/nodejs/api/url#urlorigin) 속성의 값과 같은 [`URL`](/ko/nodejs/api/url#class-url) 객체입니다. 특히 이 문자열은 경로를 나타내는 후행 슬래시를 생략해야 합니다. **기본값:** `''`.
    - `codeGeneration` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `strings` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) false로 설정하면 `eval` 또는 함수 생성자(`Function`, `GeneratorFunction` 등)에 대한 모든 호출은 `EvalError`를 발생시킵니다. **기본값:** `true`.
    - `wasm` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) false로 설정하면 WebAssembly 모듈을 컴파일하려는 모든 시도는 `WebAssembly.CompileError`를 발생시킵니다. **기본값:** `true`.


    - `microtaskMode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `afterEvaluate`로 설정하면 마이크로태스크(`Promise` 및 `async function`을 통해 예약된 태스크)는 스크립트가 [`script.runInContext()`](/ko/nodejs/api/vm#scriptrunincontextcontextifiedobject-options)를 통해 실행된 직후에 실행됩니다. 이 경우 `timeout` 및 `breakOnSigint` 범위에 포함됩니다.
    - `importModuleDynamically` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER\>](/ko/nodejs/api/vm#vmconstantsuse_main_context_default_loader) 리퍼러 스크립트 또는 모듈 없이 이 컨텍스트에서 `import()`가 호출될 때 모듈을 로드하는 방법을 지정하는 데 사용됩니다. 이 옵션은 실험적인 모듈 API의 일부입니다. 프로덕션 환경에서 사용하는 것은 권장하지 않습니다. 자세한 내용은 [컴파일 API에서 동적 `import()` 지원](/ko/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis)을 참조하세요.


- 반환: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 컨텍스트화된 객체.

지정된 `contextObject`가 객체인 경우 `vm.createContext()` 메서드는 [해당 객체를 준비](/ko/nodejs/api/vm#what-does-it-mean-to-contextify-an-object)하고 [`vm.runInContext()`](/ko/nodejs/api/vm#vmrunincontextcode-contextifiedobject-options) 또는 [`script.runInContext()`](/ko/nodejs/api/vm#scriptrunincontextcontextifiedobject-options)에 대한 호출에서 사용할 수 있도록 해당 객체에 대한 참조를 반환합니다. 이러한 스크립트 내에서 전역 객체는 `contextObject`에 의해 래핑되어 기존의 모든 속성을 유지하지만 모든 표준 [전역 객체](https://es5.github.io/#x15.1)가 가지고 있는 내장 객체와 함수도 갖습니다. vm 모듈에서 실행되는 스크립트 외부에서는 전역 변수가 변경되지 않습니다.

```js [ESM]
const vm = require('node:vm');

global.globalVar = 3;

const context = { globalVar: 1 };
vm.createContext(context);

vm.runInContext('globalVar *= 2;', context);

console.log(context);
// Prints: { globalVar: 2 }

console.log(global.globalVar);
// Prints: 3
```
`contextObject`가 생략되거나(또는 명시적으로 `undefined`로 전달됨) 새로운 빈 [컨텍스트화된](/ko/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) 객체가 반환됩니다.

새로 생성된 컨텍스트의 전역 객체가 [컨텍스트화](/ko/nodejs/api/vm#what-does-it-mean-to-contextify-an-object)되면 일반적인 전역 객체에 비해 몇 가지 특이한 점이 있습니다. 예를 들어 동결할 수 없습니다. 컨텍스트화 특이성이 없는 컨텍스트를 생성하려면 [`vm.constants.DONT_CONTEXTIFY`](/ko/nodejs/api/vm#vmconstantsdont_contextify)를 `contextObject` 인수로 전달하십시오. 자세한 내용은 [`vm.constants.DONT_CONTEXTIFY`](/ko/nodejs/api/vm#vmconstantsdont_contextify) 문서를 참조하십시오.

`vm.createContext()` 메서드는 여러 스크립트를 실행하는 데 사용할 수 있는 단일 컨텍스트를 만드는 데 주로 유용합니다. 예를 들어 웹 브라우저를 에뮬레이트하는 경우 이 메서드를 사용하여 창의 전역 객체를 나타내는 단일 컨텍스트를 만든 다음 해당 컨텍스트 내에서 모든 `\<script\>` 태그를 함께 실행할 수 있습니다.

컨텍스트에 제공된 `name` 및 `origin`은 Inspector API를 통해 볼 수 있습니다.


## `vm.isContext(object)` {#vmiscontextobject}

**추가된 버전: v0.11.7**

- `object` [\<Object\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object)
- 반환값: [\<boolean\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Data_structures#Boolean_type)

주어진 `object` 객체가 [`vm.createContext()`](/ko/nodejs/api/vm#vmcreatecontextcontextobject-options)를 사용하여 [컨텍스트화](/ko/nodejs/api/vm#what-does-it-mean-to-contextify-an-object)되었거나, [`vm.constants.DONT_CONTEXTIFY`](/ko/nodejs/api/vm#vmconstantsdont_contextify)를 사용하여 생성된 컨텍스트의 전역 객체인 경우 `true`를 반환합니다.

## `vm.measureMemory([options])` {#vmmeasurememoryoptions}

**추가된 버전: v13.10.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

현재 V8 아이솔레이트 또는 기본 컨텍스트에 알려진 모든 컨텍스트에서 V8이 알고 있고 사용하는 메모리를 측정합니다.

- `options` [\<Object\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object) 선택 사항.
    - `mode` [\<string\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Data_structures#String_type) `'summary'` 또는 `'detailed'` 중 하나입니다. 요약 모드에서는 기본 컨텍스트에 대해 측정된 메모리만 반환됩니다. 자세한 모드에서는 현재 V8 아이솔레이트에 알려진 모든 컨텍스트에 대해 측정된 메모리가 반환됩니다. **기본값:** `'summary'`
    - `execution` [\<string\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Data_structures#String_type) `'default'` 또는 `'eager'` 중 하나입니다. 기본 실행을 사용하면 다음 예약된 가비지 컬렉션이 시작될 때까지 프로미스가 해결되지 않으며, 시간이 오래 걸릴 수 있습니다 (또는 다음 GC 전에 프로그램이 종료되면 결코 해결되지 않을 수도 있습니다). 즉시 실행을 사용하면 GC가 즉시 시작되어 메모리를 측정합니다. **기본값:** `'default'`

- 반환값: [\<Promise\>](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Promise) 메모리가 성공적으로 측정되면 프로미스는 메모리 사용량에 대한 정보가 포함된 객체로 해결됩니다. 그렇지 않으면 `ERR_CONTEXT_NOT_INITIALIZED` 오류와 함께 거부됩니다.

반환된 Promise가 해결될 수 있는 객체의 형식은 V8 엔진에 따라 다르며 V8 버전에 따라 변경될 수 있습니다.

반환된 결과는 `v8.getHeapSpaceStatistics()`에서 반환된 통계와 다릅니다. `vm.measureMemory()`는 V8 엔진의 현재 인스턴스에서 각 V8 특정 컨텍스트에서 접근 가능한 메모리를 측정하는 반면, `v8.getHeapSpaceStatistics()`의 결과는 현재 V8 인스턴스에서 각 힙 공간이 차지하는 메모리를 측정합니다.

```js [ESM]
const vm = require('node:vm');
// 기본 컨텍스트에서 사용하는 메모리를 측정합니다.
vm.measureMemory({ mode: 'summary' })
  // 이것은 vm.measureMemory()와 동일합니다.
  .then((result) => {
    // 현재 형식은 다음과 같습니다.
    // {
    //   total: {
    //      jsMemoryEstimate: 2418479, jsMemoryRange: [ 2418479, 2745799 ]
    //    }
    // }
    console.log(result);
  });

const context = vm.createContext({ a: 1 });
vm.measureMemory({ mode: 'detailed', execution: 'eager' })
  .then((result) => {
    // 측정이 완료될 때까지 GC되지 않도록 여기에서 컨텍스트를 참조하십시오.
    console.log(context.a);
    // {
    //   total: {
    //     jsMemoryEstimate: 2574732,
    //     jsMemoryRange: [ 2574732, 2904372 ]
    //   },
    //   current: {
    //     jsMemoryEstimate: 2438996,
    //     jsMemoryRange: [ 2438996, 2768636 ]
    //   },
    //   other: [
    //     {
    //       jsMemoryEstimate: 135736,
    //       jsMemoryRange: [ 135736, 465376 ]
    //     }
    //   ]
    // }
    console.log(result);
  });
```

## `vm.runInContext(code, contextifiedObject[, options])` {#vmrunincontextcode-contextifiedobject-options}

::: info [연혁]
| 버전 | 변경 사항 |
| --- | --- |
| v21.7.0, v20.12.0 | `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER`에 대한 지원이 추가되었습니다. |
| v17.0.0, v16.12.0 | `importModuleDynamically` 매개변수에 대한 import 속성 지원이 추가되었습니다. |
| v6.3.0 | 이제 `breakOnSigint` 옵션이 지원됩니다. |
| v0.3.1 | v0.3.1에 추가됨 |
:::

- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 컴파일하고 실행할 JavaScript 코드입니다.
- `contextifiedObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) `code`가 컴파일되고 실행될 때 `global`로 사용될 [contextified](/ko/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) 객체입니다.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 이 스크립트에서 생성된 스택 추적에서 사용되는 파일 이름을 지정합니다. **기본값:** `'evalmachine.\<anonymous\>'`.
    - `lineOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 이 스크립트에서 생성된 스택 추적에 표시되는 줄 번호 오프셋을 지정합니다. **기본값:** `0`.
    - `columnOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 이 스크립트에서 생성된 스택 추적에 표시되는 첫 번째 줄 열 번호 오프셋을 지정합니다. **기본값:** `0`.
    - `displayErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`인 경우 `code`를 컴파일하는 동안 [`Error`](/ko/nodejs/api/errors#class-error)가 발생하면 오류를 발생시킨 코드 줄이 스택 추적에 첨부됩니다. **기본값:** `true`.
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 실행을 종료하기 전에 `code`를 실행할 밀리초 수를 지정합니다. 실행이 종료되면 [`Error`](/ko/nodejs/api/errors#class-error)가 발생합니다. 이 값은 엄격하게 양의 정수여야 합니다.
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`인 경우 `SIGINT` (+)를 수신하면 실행이 종료되고 [`Error`](/ko/nodejs/api/errors#class-error)가 발생합니다. `process.on('SIGINT')`를 통해 첨부된 이벤트에 대한 기존 핸들러는 스크립트 실행 중에 비활성화되지만 그 후에는 계속 작동합니다. **기본값:** `false`.
    - `cachedData` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 제공된 소스에 대한 V8의 코드 캐시 데이터가 포함된 선택적 `Buffer` 또는 `TypedArray` 또는 `DataView`를 제공합니다.
    - `importModuleDynamically` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER\>](/ko/nodejs/api/vm#vmconstantsuse_main_context_default_loader) `import()`가 호출될 때 이 스크립트의 평가 중에 모듈을 로드하는 방법을 지정하는 데 사용됩니다. 이 옵션은 실험적 모듈 API의 일부입니다. 프로덕션 환경에서 사용하는 것은 권장하지 않습니다. 자세한 내용은 [컴파일 API에서 동적 `import()` 지원](/ko/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis)을 참조하세요.



`vm.runInContext()` 메서드는 `code`를 컴파일하고 `contextifiedObject`의 컨텍스트 내에서 실행한 다음 결과를 반환합니다. 실행 코드는 로컬 범위에 액세스할 수 없습니다. `contextifiedObject` 객체는 [`vm.createContext()`](/ko/nodejs/api/vm#vmcreatecontextcontextobject-options) 메서드를 사용하여 이전에 [contextified](/ko/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) *되어야 합니다*.

`options`가 문자열이면 파일 이름을 지정합니다.

다음 예제는 단일 [contextified](/ko/nodejs/api/vm#what-does-it-mean-to-contextify-an-object) 객체를 사용하여 다른 스크립트를 컴파일하고 실행합니다.

```js [ESM]
const vm = require('node:vm');

const contextObject = { globalVar: 1 };
vm.createContext(contextObject);

for (let i = 0; i < 10; ++i) {
  vm.runInContext('globalVar *= 2;', contextObject);
}
console.log(contextObject);
// 출력: { globalVar: 1024 }
```

## `vm.runInNewContext(code[, contextObject[, options]])` {#vmruninnewcontextcode-contextobject-options}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v22.8.0, v20.18.0 | 이제 `contextObject` 인수는 `vm.constants.DONT_CONTEXTIFY`를 허용합니다. |
| v21.7.0, v20.12.0 | `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER`에 대한 지원이 추가되었습니다. |
| v17.0.0, v16.12.0 | `importModuleDynamically` 매개변수에 대한 import 속성 지원이 추가되었습니다. |
| v14.6.0 | 이제 `microtaskMode` 옵션이 지원됩니다. |
| v10.0.0 | 이제 `contextCodeGeneration` 옵션이 지원됩니다. |
| v6.3.0 | 이제 `breakOnSigint` 옵션이 지원됩니다. |
| v0.3.1 | 추가됨: v0.3.1 |
:::

- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 컴파일하고 실행할 JavaScript 코드입니다.
- `contextObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<vm.constants.DONT_CONTEXTIFY\>](/ko/nodejs/api/vm#vmconstantsdont_contextify) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) [`vm.constants.DONT_CONTEXTIFY`](/ko/nodejs/api/vm#vmconstantsdont_contextify) 또는 [컨텍스트화](/ko/nodejs/api/vm#what-does-it-mean-to-contextify-an-object)될 객체입니다. `undefined`인 경우 이전 버전과의 호환성을 위해 빈 컨텍스트화된 객체가 생성됩니다.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 이 스크립트에서 생성된 스택 추적에 사용되는 파일 이름을 지정합니다. **기본값:** `'evalmachine.\<익명\>'`.
    - `lineOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 이 스크립트에서 생성된 스택 추적에 표시되는 줄 번호 오프셋을 지정합니다. **기본값:** `0`.
    - `columnOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 이 스크립트에서 생성된 스택 추적에 표시되는 첫 번째 줄 열 번호 오프셋을 지정합니다. **기본값:** `0`.
    - `displayErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`인 경우 `code`를 컴파일하는 동안 [`Error`](/ko/nodejs/api/errors#class-error)가 발생하면 오류를 일으키는 코드 줄이 스택 추적에 첨부됩니다. **기본값:** `true`.
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 실행을 종료하기 전에 `code`를 실행할 밀리초 수를 지정합니다. 실행이 종료되면 [`Error`](/ko/nodejs/api/errors#class-error)가 발생합니다. 이 값은 엄격하게 양의 정수여야 합니다.
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`인 경우 `SIGINT` (+)를 수신하면 실행이 종료되고 [`Error`](/ko/nodejs/api/errors#class-error)가 발생합니다. `process.on('SIGINT')`를 통해 연결된 이벤트에 대한 기존 핸들러는 스크립트 실행 중에는 비활성화되지만 그 후에는 계속 작동합니다. **기본값:** `false`.
    - `contextName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 새로 생성된 컨텍스트의 사람이 읽을 수 있는 이름입니다. **기본값:** `'VM 컨텍스트 i'`, 여기서 `i`는 생성된 컨텍스트의 오름차순 숫자 인덱스입니다.
    - `contextOrigin` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 표시 목적으로 새로 생성된 컨텍스트에 해당하는 [Origin](https://developer.mozilla.org/en-US/docs/Glossary/Origin)입니다. Origin은 URL과 같은 형식이어야 하지만 [`URL`](/ko/nodejs/api/url#class-url) 객체의 [`url.origin`](/ko/nodejs/api/url#urlorigin) 속성 값과 같이 스키마, 호스트 및 포트(필요한 경우)만 포함해야 합니다. 특히 이 문자열은 경로를 나타내는 후행 슬래시를 생략해야 합니다. **기본값:** `''`.
    - `contextCodeGeneration` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `strings` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) false로 설정하면 `eval` 또는 함수 생성자(`Function`, `GeneratorFunction` 등)에 대한 모든 호출은 `EvalError`를 발생시킵니다. **기본값:** `true`.
    - `wasm` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) false로 설정하면 WebAssembly 모듈을 컴파일하려는 시도는 `WebAssembly.CompileError`를 발생시킵니다. **기본값:** `true`.


    - `cachedData` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 제공된 소스에 대한 V8의 코드 캐시 데이터가 있는 선택적 `Buffer` 또는 `TypedArray` 또는 `DataView`를 제공합니다.
    - `importModuleDynamically` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER\>](/ko/nodejs/api/vm#vmconstantsuse_main_context_default_loader) `import()`가 호출될 때 이 스크립트의 평가 중에 모듈을 로드하는 방법을 지정하는 데 사용됩니다. 이 옵션은 실험적 모듈 API의 일부입니다. 프로덕션 환경에서 사용하는 것은 권장하지 않습니다. 자세한 내용은 [컴파일 API에서 동적 `import()` 지원](/ko/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis)을 참조하세요.
    - `microtaskMode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `afterEvaluate`로 설정하면 마이크로태스크(`Promise` 및 `async function`을 통해 예약된 태스크)가 스크립트 실행 직후에 실행됩니다. 이 경우 `timeout` 및 `breakOnSigint` 범위에 포함됩니다.


- 반환: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 스크립트에서 실행된 마지막 명령문의 결과입니다.

이 메서드는 `(new vm.Script(code, options)).runInContext(vm.createContext(options), options)`에 대한 바로 가기입니다. `options`가 문자열이면 파일 이름을 지정합니다.

다음과 같은 작업을 한 번에 수행합니다.

다음 예제에서는 전역 변수를 증가시키고 새 변수를 설정하는 코드를 컴파일하고 실행합니다. 이러한 전역 변수는 `contextObject`에 포함되어 있습니다.

```js [ESM]
const vm = require('node:vm');

const contextObject = {
  animal: 'cat',
  count: 2,
};

vm.runInNewContext('count += 1; name = "kitty"', contextObject);
console.log(contextObject);
// 출력: { animal: 'cat', count: 3, name: 'kitty' }

// 컨텍스트가 컨텍스트화된 객체에서 생성된 경우 이 오류가 발생합니다.
// vm.constants.DONT_CONTEXTIFY는 동결할 수 있는 일반적인 전역 객체로 컨텍스트를 생성할 수 있도록 합니다.
const frozenContext = vm.runInNewContext('Object.freeze(globalThis); globalThis;', vm.constants.DONT_CONTEXTIFY);
```

## `vm.runInThisContext(code[, options])` {#vmruninthiscontextcode-options}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v21.7.0, v20.12.0 | `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER`에 대한 지원이 추가되었습니다. |
| v17.0.0, v16.12.0 | `importModuleDynamically` 매개변수에 대한 import 속성 지원이 추가되었습니다. |
| v6.3.0 | 이제 `breakOnSigint` 옵션이 지원됩니다. |
| v0.3.1 | 추가됨: v0.3.1 |
:::

- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 컴파일 및 실행할 JavaScript 코드입니다.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `filename` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 이 스크립트에서 생성된 스택 추적에 사용되는 파일 이름을 지정합니다. **기본값:** `'evalmachine.\<익명\>'`.
    - `lineOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 이 스크립트에서 생성된 스택 추적에 표시되는 줄 번호 오프셋을 지정합니다. **기본값:** `0`.
    - `columnOffset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 이 스크립트에서 생성된 스택 추적에 표시되는 첫 번째 줄 열 번호 오프셋을 지정합니다. **기본값:** `0`.
    - `displayErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`인 경우 `code`를 컴파일하는 동안 [`Error`](/ko/nodejs/api/errors#class-error)가 발생하면 오류를 일으킨 코드 줄이 스택 추적에 첨부됩니다. **기본값:** `true`.
    - `timeout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 실행을 종료하기 전에 `code`를 실행할 밀리초 수를 지정합니다. 실행이 종료되면 [`Error`](/ko/nodejs/api/errors#class-error)가 throw됩니다. 이 값은 엄격하게 양의 정수여야 합니다.
    - `breakOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`인 경우 `SIGINT` (+)를 수신하면 실행이 종료되고 [`Error`](/ko/nodejs/api/errors#class-error)가 throw됩니다. `process.on('SIGINT')`를 통해 연결된 이벤트에 대한 기존 핸들러는 스크립트 실행 중에는 비활성화되지만 이후에는 계속 작동합니다. **기본값:** `false`.
    - `cachedData` [\<Buffer\>](/ko/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 제공된 소스에 대한 V8의 코드 캐시 데이터가 있는 선택적 `Buffer` 또는 `TypedArray` 또는 `DataView`를 제공합니다.
    - `importModuleDynamically` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER\>](/ko/nodejs/api/vm#vmconstantsuse_main_context_default_loader) `import()`가 호출될 때 이 스크립트의 평가 중에 모듈을 로드하는 방법을 지정하는 데 사용됩니다. 이 옵션은 실험적 모듈 API의 일부입니다. 프로덕션 환경에서 사용하는 것은 권장하지 않습니다. 자세한 내용은 [컴파일 API에서 동적 `import()` 지원](/ko/nodejs/api/vm#support-of-dynamic-import-in-compilation-apis)을 참조하세요.

- 반환: [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) 스크립트에서 실행된 맨 마지막 명령문의 결과입니다.

`vm.runInThisContext()`는 `code`를 컴파일하고 현재 `global` 컨텍스트 내에서 실행하고 결과를 반환합니다. 실행 중인 코드는 로컬 범위에 액세스할 수 없지만 현재 `global` 객체에는 액세스할 수 있습니다.

`options`가 문자열인 경우 파일 이름을 지정합니다.

다음 예제는 동일한 코드를 실행하기 위해 `vm.runInThisContext()`와 JavaScript [`eval()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval) 함수를 모두 사용하는 방법을 보여줍니다.

```js [ESM]
const vm = require('node:vm');
let localVar = 'initial value';

const vmResult = vm.runInThisContext('localVar = "vm";');
console.log(`vmResult: '${vmResult}', localVar: '${localVar}'`);
// Prints: vmResult: 'vm', localVar: 'initial value'

const evalResult = eval('localVar = "eval";');
console.log(`evalResult: '${evalResult}', localVar: '${localVar}'`);
// Prints: evalResult: 'eval', localVar: 'eval'
```
`vm.runInThisContext()`는 로컬 범위에 액세스할 수 없으므로 `localVar`는 변경되지 않습니다. 반대로, [`eval()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval)는 로컬 범위에 액세스할 *수 있으므로* `localVar` 값이 변경됩니다. 이러한 방식으로 `vm.runInThisContext()`는 [간접 `eval()` 호출](https://es5.github.io/#x10.4.2), 예를 들어 `(0,eval)('code')`와 매우 유사합니다.


## 예시: VM 내에서 HTTP 서버 실행하기 {#example-running-an-http-server-within-a-vm}

[`script.runInThisContext()`](/ko/nodejs/api/vm#scriptruninthiscontextoptions) 또는 [`vm.runInThisContext()`](/ko/nodejs/api/vm#vmruninthiscontextcode-options)를 사용할 때 코드는 현재 V8 전역 컨텍스트 내에서 실행됩니다. 이 VM 컨텍스트로 전달된 코드에는 자체 격리된 범위가 있습니다.

`node:http` 모듈을 사용하여 간단한 웹 서버를 실행하려면 컨텍스트로 전달된 코드가 자체적으로 `require('node:http')`를 호출하거나 `node:http` 모듈에 대한 참조가 전달되어야 합니다. 예를 들어:

```js [ESM]
'use strict';
const vm = require('node:vm');

const code = `
((require) => {
  const http = require('node:http');

  http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end('Hello World\\n');
  }).listen(8124);

  console.log('Server running at http://127.0.0.1:8124/');
})`;

vm.runInThisContext(code)(require);
```
위의 경우 `require()`는 전달된 컨텍스트와 상태를 공유합니다. 이는 신뢰할 수 없는 코드를 실행할 때 원치 않는 방식으로 컨텍스트의 객체를 변경하는 등의 위험을 초래할 수 있습니다.

## 객체를 "컨텍스트화"한다는 것은 무엇을 의미합니까? {#what-does-it-mean-to-"contextify"-an-object?}

Node.js 내에서 실행되는 모든 JavaScript는 "컨텍스트" 범위 내에서 실행됩니다. [V8 임베더 가이드](https://v8.dev/docs/embed#contexts)에 따르면:

`vm.createContext()` 메서드가 객체와 함께 호출되면 `contextObject` 인수는 V8 컨텍스트의 새 인스턴스의 전역 객체를 래핑하는 데 사용됩니다 (만약 `contextObject`가 `undefined`이면 해당 컨텍스트화되기 전에 현재 컨텍스트에서 새 객체가 생성됩니다). 이 V8 컨텍스트는 `node:vm` 모듈의 메서드를 사용하여 실행되는 `code`에 작동할 수 있는 격리된 전역 환경을 제공합니다. V8 컨텍스트를 만들고 외부 컨텍스트의 `contextObject`와 연결하는 프로세스를 이 문서에서는 객체를 "컨텍스트화"한다고 합니다.

컨텍스트화는 컨텍스트의 `globalThis` 값에 몇 가지 특이한 점을 도입합니다. 예를 들어, 고정될 수 없으며 외부 컨텍스트의 `contextObject`와 참조가 동일하지 않습니다.

```js [ESM]
const vm = require('node:vm');

// 정의되지 않은 `contextObject` 옵션은 전역 객체를 컨텍스트화합니다.
const context = vm.createContext();
console.log(vm.runInContext('globalThis', context) === context);  // false
// 컨텍스트화된 전역 객체는 고정할 수 없습니다.
try {
  vm.runInContext('Object.freeze(globalThis);', context);
} catch (e) {
  console.log(e); // TypeError: Cannot freeze
}
console.log(vm.runInContext('globalThis.foo = 1; foo;', context));  // 1
```
일반적인 전역 객체로 컨텍스트를 만들고 특이한 점이 적은 외부 컨텍스트에서 전역 프록시에 액세스하려면 `contextObject` 인수로 `vm.constants.DONT_CONTEXTIFY`를 지정하십시오.


### `vm.constants.DONT_CONTEXTIFY` {#vmconstantsdont_contextify}

이 상수는 vm API에서 `contextObject` 인수로 사용될 때 Node.js가 해당 전역 객체를 Node.js 특정 방식으로 다른 객체로 래핑하지 않고 컨텍스트를 생성하도록 지시합니다. 결과적으로 새 컨텍스트 내부의 `globalThis` 값은 일반적인 값과 더 유사하게 동작합니다.

```js [ESM]
const vm = require('node:vm');

// vm.constants.DONT_CONTEXTIFY를 사용하여 전역 객체를 고정합니다.
const context = vm.createContext(vm.constants.DONT_CONTEXTIFY);
vm.runInContext('Object.freeze(globalThis);', context);
try {
  vm.runInContext('bar = 1; bar;', context);
} catch (e) {
  console.log(e); // Uncaught ReferenceError: bar is not defined
}
```
`vm.constants.DONT_CONTEXTIFY`가 [`vm.createContext()`](/ko/nodejs/api/vm#vmcreatecontextcontextobject-options)에 대한 `contextObject` 인수로 사용되면 반환된 객체는 Node.js 특정 특성이 적은 새로 생성된 컨텍스트의 전역 객체에 대한 프록시와 유사한 객체입니다. 이는 새 컨텍스트의 `globalThis` 값과 참조적으로 동일하며 컨텍스트 외부에서 수정할 수 있으며 새 컨텍스트의 기본 제공 기능에 직접 액세스하는 데 사용할 수 있습니다.

```js [ESM]
const vm = require('node:vm');

const context = vm.createContext(vm.constants.DONT_CONTEXTIFY);

// 반환된 객체는 새 컨텍스트의 globalThis와 참조적으로 동일합니다.
console.log(vm.runInContext('globalThis', context) === context);  // true

// 새 컨텍스트에서 globals에 직접 액세스하는 데 사용할 수 있습니다.
console.log(context.Array);  // [Function: Array]
vm.runInContext('foo = 1;', context);
console.log(context.foo);  // 1
context.bar = 1;
console.log(vm.runInContext('bar;', context));  // 1

// 고정할 수 있으며 내부 컨텍스트에 영향을 줍니다.
Object.freeze(context);
try {
  vm.runInContext('baz = 1; baz;', context);
} catch (e) {
  console.log(e); // Uncaught ReferenceError: baz is not defined
}
```
## 비동기 작업 및 Promise와의 제한 시간 상호 작용 {#timeout-interactions-with-asynchronous-tasks-and-promises}

`Promise` 및 `async function`은 JavaScript 엔진에서 비동기적으로 실행되는 작업을 예약할 수 있습니다. 기본적으로 이러한 작업은 현재 스택의 모든 JavaScript 함수가 실행을 완료한 후에 실행됩니다. 이렇게 하면 `timeout` 및 `breakOnSigint` 옵션의 기능을 이스케이프할 수 있습니다.

예를 들어 제한 시간이 5밀리초인 `vm.runInNewContext()`에 의해 실행된 다음 코드는 Promise가 해결된 후 실행되도록 무한 루프를 예약합니다. 예약된 루프는 제한 시간에 의해 중단되지 않습니다.

```js [ESM]
const vm = require('node:vm');

function loop() {
  console.log('entering loop');
  while (1) console.log(Date.now());
}

vm.runInNewContext(
  'Promise.resolve().then(() => loop());',
  { loop, console },
  { timeout: 5 },
);
// 이는 'entering loop' *이전*에 출력됩니다 (!)
console.log('done executing');
```
이는 `Context`를 만드는 코드에 `microtaskMode: 'afterEvaluate'`를 전달하여 해결할 수 있습니다.

```js [ESM]
const vm = require('node:vm');

function loop() {
  while (1) console.log(Date.now());
}

vm.runInNewContext(
  'Promise.resolve().then(() => loop());',
  { loop, console },
  { timeout: 5, microtaskMode: 'afterEvaluate' },
);
```
이 경우 `promise.then()`을 통해 예약된 마이크로태스크는 `vm.runInNewContext()`에서 반환되기 전에 실행되며 `timeout` 기능에 의해 중단됩니다. 이는 `vm.Context`에서 실행되는 코드에만 적용되므로 예를 들어 [`vm.runInThisContext()`](/ko/nodejs/api/vm#vmruninthiscontextcode-options)는 이 옵션을 사용하지 않습니다.

Promise 콜백은 생성된 컨텍스트의 마이크로태스크 큐에 입력됩니다. 예를 들어 위의 예에서 `() =\> loop()`가 단순히 `loop`로 대체되면 `loop`는 외부(메인) 컨텍스트의 함수이므로 전역 마이크로태스크 큐에 푸시되고 제한 시간도 이스케이프할 수 있습니다.

`process.nextTick()`, `queueMicrotask()`, `setTimeout()`, `setImmediate()` 등과 같은 비동기 스케줄링 함수를 `vm.Context` 내부에서 사용할 수 있게 되면 해당 함수에 전달된 함수는 모든 컨텍스트에서 공유하는 전역 큐에 추가됩니다. 따라서 해당 함수에 전달된 콜백도 제한 시간을 통해 제어할 수 없습니다.


## 컴파일 API에서 동적 `import()` 지원 {#support-of-dynamic-import-in-compilation-apis}

다음 API는 vm 모듈에서 컴파일된 코드에서 동적 `import()`를 활성화하는 `importModuleDynamically` 옵션을 지원합니다.

- `new vm.Script`
- `vm.compileFunction()`
- `new vm.SourceTextModule`
- `vm.runInThisContext()`
- `vm.runInContext()`
- `vm.runInNewContext()`
- `vm.createContext()`

이 옵션은 여전히 실험적인 모듈 API의 일부입니다. 프로덕션 환경에서 사용하는 것은 권장하지 않습니다.

### `importModuleDynamically` 옵션이 지정되지 않거나 정의되지 않은 경우 {#when-the-importmoduledynamically-option-is-not-specified-or-undefined}

이 옵션이 지정되지 않았거나 `undefined`인 경우에도 `import()`를 포함하는 코드는 vm API에서 컴파일할 수 있지만, 컴파일된 코드가 실행되어 실제로 `import()`를 호출하면 결과는 [`ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING`](/ko/nodejs/api/errors#err_vm_dynamic_import_callback_missing)으로 거부됩니다.

### `importModuleDynamically`가 `vm.constants.USE_MAIN_CONTEXT_DEFAULT_LOADER`인 경우 {#when-importmoduledynamically-is-vmconstantsuse_main_context_default_loader}

이 옵션은 현재 `vm.SourceTextModule`에서는 지원되지 않습니다.

이 옵션을 사용하면 컴파일된 코드에서 `import()`가 시작될 때 Node.js는 기본 컨텍스트에서 기본 ESM 로더를 사용하여 요청된 모듈을 로드하고 실행 중인 코드에 반환합니다.

이를 통해 컴파일되는 코드에서 `fs` 또는 `http`와 같은 Node.js 내장 모듈에 액세스할 수 있습니다. 코드가 다른 컨텍스트에서 실행되는 경우 기본 컨텍스트에서 로드된 모듈에서 생성된 객체는 여전히 기본 컨텍스트에서 가져온 것이며 새 컨텍스트의 내장 클래스의 `instanceof`가 아님을 알아야 합니다.

::: code-group
```js [CJS]
const { Script, constants } = require('node:vm');
const script = new Script(
  'import("node:fs").then(({readFile}) => readFile instanceof Function)',
  { importModuleDynamically: constants.USE_MAIN_CONTEXT_DEFAULT_LOADER });

// false: 기본 컨텍스트에서 로드된 URL은 새 컨텍스트의 Function 클래스의 인스턴스가 아닙니다.
script.runInNewContext().then(console.log);
```

```js [ESM]
import { Script, constants } from 'node:vm';

const script = new Script(
  'import("node:fs").then(({readFile}) => readFile instanceof Function)',
  { importModuleDynamically: constants.USE_MAIN_CONTEXT_DEFAULT_LOADER });

// false: 기본 컨텍스트에서 로드된 URL은 새 컨텍스트의 Function 클래스의 인스턴스가 아닙니다.
script.runInNewContext().then(console.log);
```
:::

이 옵션을 사용하면 스크립트 또는 함수에서 사용자 모듈을 로드할 수도 있습니다.

::: code-group
```js [ESM]
import { Script, constants } from 'node:vm';
import { resolve } from 'node:path';
import { writeFileSync } from 'node:fs';

// 현재 스크립트가 실행 중인 디렉토리에 test.js 및 test.txt를 씁니다.
writeFileSync(resolve(import.meta.dirname, 'test.mjs'),
              'export const filename = "./test.json";');
writeFileSync(resolve(import.meta.dirname, 'test.json'),
              '{"hello": "world"}');

// 스크립트가 동일한 디렉토리에 배치된 것처럼 test.mjs를 로드한 다음 test.json을 로드하는 스크립트를 컴파일합니다.
const script = new Script(
  `(async function() {
    const { filename } = await import('./test.mjs');
    return import(filename, { with: { type: 'json' } })
  })();`,
  {
    filename: resolve(import.meta.dirname, 'test-with-default.js'),
    importModuleDynamically: constants.USE_MAIN_CONTEXT_DEFAULT_LOADER,
  });

// { default: { hello: 'world' } }
script.runInThisContext().then(console.log);
```

```js [CJS]
const { Script, constants } = require('node:vm');
const { resolve } = require('node:path');
const { writeFileSync } = require('node:fs');

// 현재 스크립트가 실행 중인 디렉토리에 test.js 및 test.txt를 씁니다.
writeFileSync(resolve(__dirname, 'test.mjs'),
              'export const filename = "./test.json";');
writeFileSync(resolve(__dirname, 'test.json'),
              '{"hello": "world"}');

// 스크립트가 동일한 디렉토리에 배치된 것처럼 test.mjs를 로드한 다음 test.json을 로드하는 스크립트를 컴파일합니다.
const script = new Script(
  `(async function() {
    const { filename } = await import('./test.mjs');
    return import(filename, { with: { type: 'json' } })
  })();`,
  {
    filename: resolve(__dirname, 'test-with-default.js'),
    importModuleDynamically: constants.USE_MAIN_CONTEXT_DEFAULT_LOADER,
  });

// { default: { hello: 'world' } }
script.runInThisContext().then(console.log);
```
:::

기본 컨텍스트의 기본 로더를 사용하여 사용자 모듈을 로드할 때 몇 가지 주의 사항이 있습니다.


### `importModuleDynamically`가 함수일 때 {#when-importmoduledynamically-is-a-function}

`importModuleDynamically`가 함수일 때, 요청된 모듈을 컴파일하고 평가하는 방법을 사용자가 정의할 수 있도록 컴파일된 코드에서 `import()`가 호출될 때 이 함수가 호출됩니다. 현재 이 옵션이 작동하려면 Node.js 인스턴스가 `--experimental-vm-modules` 플래그와 함께 실행되어야 합니다. 플래그가 설정되지 않으면 이 콜백은 무시됩니다. 평가된 코드가 실제로 `import()`를 호출하는 경우 결과는 [`ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG`](/ko/nodejs/api/errors#err_vm_dynamic_import_callback_missing_flag)와 함께 거부됩니다.

콜백 `importModuleDynamically(specifier, referrer, importAttributes)`는 다음과 같은 서명을 갖습니다.

- `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `import()`에 전달된 지정자
- `referrer` [\<vm.Script\>](/ko/nodejs/api/vm#class-vmscript) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<vm.SourceTextModule\>](/ko/nodejs/api/vm#class-vmsourcetextmodule) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 참조자는 `new vm.Script`, `vm.runInThisContext`, `vm.runInContext` 및 `vm.runInNewContext`에 대해 컴파일된 `vm.Script`입니다. `vm.compileFunction`에 대해 컴파일된 `Function`, `new vm.SourceTextModule`에 대해 컴파일된 `vm.SourceTextModule` 및 `vm.createContext()`에 대한 컨텍스트 `Object`입니다.
- `importAttributes` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`optionsExpression`](https://tc39.es/proposal-import-attributes/#sec-evaluate-import-call) 선택적 매개변수에 전달된 `"with"` 값 또는 값이 제공되지 않은 경우 빈 객체입니다.
- 반환: [\<모듈 네임스페이스 객체\>](https://tc39.github.io/ecma262/#sec-module-namespace-exotic-objects) | [\<vm.Module\>](/ko/nodejs/api/vm#class-vmmodule) 오류 추적의 이점을 활용하고 `then` 함수 내보내기를 포함하는 네임스페이스 문제를 방지하려면 `vm.Module`을 반환하는 것이 좋습니다.

::: code-group
```js [ESM]
// 이 스크립트는 --experimental-vm-modules와 함께 실행해야 합니다.
import { Script, SyntheticModule } from 'node:vm';

const script = new Script('import("foo.json", { with: { type: "json" } })', {
  async importModuleDynamically(specifier, referrer, importAttributes) {
    console.log(specifier);  // 'foo.json'
    console.log(referrer);   // 컴파일된 스크립트
    console.log(importAttributes);  // { type: 'json' }
    const m = new SyntheticModule(['bar'], () => { });
    await m.link(() => { });
    m.setExport('bar', { hello: 'world' });
    return m;
  },
});
const result = await script.runInThisContext();
console.log(result);  //  { bar: { hello: 'world' } }
```

```js [CJS]
// 이 스크립트는 --experimental-vm-modules와 함께 실행해야 합니다.
const { Script, SyntheticModule } = require('node:vm');

(async function main() {
  const script = new Script('import("foo.json", { with: { type: "json" } })', {
    async importModuleDynamically(specifier, referrer, importAttributes) {
      console.log(specifier);  // 'foo.json'
      console.log(referrer);   // 컴파일된 스크립트
      console.log(importAttributes);  // { type: 'json' }
      const m = new SyntheticModule(['bar'], () => { });
      await m.link(() => { });
      m.setExport('bar', { hello: 'world' });
      return m;
    },
  });
  const result = await script.runInThisContext();
  console.log(result);  //  { bar: { hello: 'world' } }
})();
```
:::

