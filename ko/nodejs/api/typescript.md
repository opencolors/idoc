---
title: Node.js에서의 TypeScript 지원
description: Node.js에서 TypeScript를 사용하는 방법을 배우세요. 설치, 설정 및 Node.js 프로젝트에 TypeScript를 통합하는 최적의 방법을 포함합니다.
head:
  - - meta
    - name: og:title
      content: Node.js에서의 TypeScript 지원 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js에서 TypeScript를 사용하는 방법을 배우세요. 설치, 설정 및 Node.js 프로젝트에 TypeScript를 통합하는 최적의 방법을 포함합니다.
  - - meta
    - name: twitter:title
      content: Node.js에서의 TypeScript 지원 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js에서 TypeScript를 사용하는 방법을 배우세요. 설치, 설정 및 Node.js 프로젝트에 TypeScript를 통합하는 최적의 방법을 포함합니다.
---


# 모듈: TypeScript {#modules-typescript}

::: info [기록]
| 버전 | 변경 사항 |
| --- | --- |
| v22.7.0 | `--experimental-transform-types` 플래그 추가. |
:::

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index).1 - 활발한 개발
:::

## 활성화 {#enabling}

Node.js에서 런타임 TypeScript 지원을 활성화하는 방법은 두 가지가 있습니다.

## 전체 TypeScript 지원 {#full-typescript-support}

`tsconfig.json`을 포함한 모든 TypeScript 기능을 완벽하게 지원하는 TypeScript를 사용하려면 타사 패키지를 사용할 수 있습니다. 이 지침에서는 [`tsx`](https://tsx.is/)를 예로 사용하지만 다른 유사한 라이브러리도 많이 있습니다.

## 타입 제거 {#type-stripping}

**v22.6.0에 추가됨**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index).1 - 활발한 개발
:::

플래그 [`--experimental-strip-types`](/ko/nodejs/api/cli#--experimental-strip-types)를 사용하면 Node.js가 TypeScript 파일을 실행할 수 있습니다. 기본적으로 Node.js는 열거형 또는 네임스페이스와 같이 변환이 필요한 TypeScript 기능이 없는 파일만 실행합니다. Node.js는 인라인 타입 어노테이션을 공백으로 바꾸고 타입 검사는 수행되지 않습니다. 이러한 기능의 변환을 활성화하려면 플래그 [`--experimental-transform-types`](/ko/nodejs/api/cli#--experimental-transform-types)를 사용하십시오. paths 또는 최신 JavaScript 구문을 이전 표준으로 변환하는 것과 같이 `tsconfig.json` 내의 설정에 따라 달라지는 TypeScript 기능은 의도적으로 지원되지 않습니다. 전체 TypeScript 지원을 받으려면 [전체 TypeScript 지원](/ko/nodejs/api/typescript#full-typescript-support)을 참조하십시오.

타입 제거 기능은 경량으로 설계되었습니다. JavaScript 코드 생성이 필요한 구문을 의도적으로 지원하지 않고 인라인 타입을 공백으로 대체함으로써 Node.js는 소스 맵 없이 TypeScript 코드를 실행할 수 있습니다.

타입 제거는 대부분의 TypeScript 버전에서 작동하지만 다음 `tsconfig.json` 설정과 함께 버전 5.7 이상을 사용하는 것이 좋습니다.

```json [JSON]
{
  "compilerOptions": {
     "target": "esnext",
     "module": "nodenext",
     "allowImportingTsExtensions": true,
     "rewriteRelativeImportExtensions": true,
     "verbatimModuleSyntax": true
  }
}
```

### 모듈 시스템 결정 {#determining-module-system}

Node.js는 TypeScript 파일에서 [CommonJS](/ko/nodejs/api/modules)와 [ES Modules](/ko/nodejs/api/esm) 구문을 모두 지원합니다. Node.js는 한 모듈 시스템에서 다른 모듈 시스템으로 변환하지 않습니다. 코드를 ES 모듈로 실행하려면 `import` 및 `export` 구문을 사용해야 하고, 코드를 CommonJS로 실행하려면 `require` 및 `module.exports`를 사용해야 합니다.

- `.ts` 파일은 [`.js` 파일과 동일한 방식으로 모듈 시스템이 결정됩니다.](/ko/nodejs/api/packages#determining-module-system) `import` 및 `export` 구문을 사용하려면 가장 가까운 상위 `package.json`에 `"type": "module"`을 추가하세요.
- `.mts` 파일은 `.mjs` 파일과 유사하게 항상 ES 모듈로 실행됩니다.
- `.cts` 파일은 `.cjs` 파일과 유사하게 항상 CommonJS 모듈로 실행됩니다.
- `.tsx` 파일은 지원되지 않습니다.

JavaScript 파일과 마찬가지로 `import` 문과 `import()` 식에서 [파일 확장자는 필수입니다.](/ko/nodejs/api/esm#mandatory-file-extensions) 예를 들어 `import './file'`이 아닌 `import './file.ts'`를 사용해야 합니다. 이전 버전과의 호환성 때문에 파일 확장자는 `require()` 호출에서도 필수입니다. 예를 들어 `.cjs` 확장자가 CommonJS 파일의 `require` 호출에서 필수인 것과 유사하게 `require('./file')`이 아닌 `require('./file.ts')`를 사용해야 합니다.

`tsconfig.json` 옵션 `allowImportingTsExtensions`를 사용하면 TypeScript 컴파일러 `tsc`가 `.ts` 확장자를 포함하는 `import` 지정자를 사용하여 파일을 유형 검사할 수 있습니다.

### TypeScript 기능 {#typescript-features}

Node.js는 인라인 유형만 제거하므로 TypeScript 구문을 새 JavaScript 구문으로 *대체*하는 TypeScript 기능은 [`--experimental-transform-types`](/ko/nodejs/api/cli#--experimental-transform-types) 플래그가 전달되지 않으면 오류가 발생합니다.

변환이 필요한 가장 눈에 띄는 기능은 다음과 같습니다.

- `Enum`
- `namespaces`
- `legacy module`
- 파라미터 속성

데코레이터는 현재 [TC39 Stage 3 제안](https://github.com/tc39/proposal-decorators)이며 곧 JavaScript 엔진에서 지원될 예정이므로 변환되지 않고 파서 오류가 발생합니다. 이것은 일시적인 제한 사항이며 앞으로 해결될 것입니다.

또한 Node.js는 `tsconfig.json` 파일을 읽지 않으며 경로 또는 최신 JavaScript 구문을 이전 표준으로 변환하는 것과 같이 `tsconfig.json` 내의 설정에 의존하는 기능을 지원하지 않습니다.


### `type` 키워드 없이 타입 가져오기 {#importing-types-without-type-keyword}

타입 제거의 특성상, 타입 가져오기를 올바르게 제거하려면 `type` 키워드가 필요합니다. `type` 키워드가 없으면 Node.js는 가져오기를 값 가져오기로 처리하여 런타임 오류가 발생합니다. tsconfig 옵션인 [`verbatimModuleSyntax`](https://www.typescriptlang.org/tsconfig/#verbatimModuleSyntax)를 사용하여 이 동작을 일치시킬 수 있습니다.

다음 예제는 올바르게 작동합니다.

```ts [TYPESCRIPT]
import type { Type1, Type2 } from './module.ts';
import { fn, type FnParams } from './fn.ts';
```
다음은 런타임 오류를 발생시킵니다.

```ts [TYPESCRIPT]
import { Type1, Type2 } from './module.ts';
import { fn, FnParams } from './fn.ts';
```
### 파일 형태가 아닌 입력 {#non-file-forms-of-input}

`--eval`에 대해 타입 제거를 활성화할 수 있습니다. 모듈 시스템은 JavaScript와 마찬가지로 `--input-type`에 의해 결정됩니다.

TypeScript 구문은 REPL, STDIN 입력, `--print`, `--check` 및 `inspect`에서 지원되지 않습니다.

### 소스 맵 {#source-maps}

인라인 타입은 공백으로 대체되므로 스택 추적에서 올바른 줄 번호를 위해 소스 맵이 필요하지 않습니다. Node.js는 소스 맵을 생성하지 않습니다. [`--experimental-transform-types`](/ko/nodejs/api/cli#--experimental-transform-types)가 활성화되면 소스 맵이 기본적으로 활성화됩니다.

### 종속성의 타입 제거 {#type-stripping-in-dependencies}

패키지 작성자가 TypeScript로 작성된 패키지를 게시하는 것을 막기 위해 Node.js는 기본적으로 `node_modules` 경로 아래 폴더 내의 TypeScript 파일을 처리하지 않습니다.

### 경로 별칭 {#paths-aliases}

[`tsconfig` "paths"](https://www.typescriptlang.org/tsconfig/#paths)는 변환되지 않으므로 오류가 발생합니다. 사용 가능한 가장 가까운 기능은 `#`로 시작해야 한다는 제한이 있는 [서브패스 가져오기](/ko/nodejs/api/packages#subpath-imports)입니다.

