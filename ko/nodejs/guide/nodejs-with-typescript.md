---
title: Node.js 와 TypeScript
description: Node.js에서 TypeScript를 사용하는 방법을 배웁니다. TypeScript의 장점, 설치, 사용 방법을 소개하며, TypeScript 코드를 컴파일하고 실행하는 방법과 기능, 툴에 대해서도紹介합니다.
head:
  - - meta
    - name: og:title
      content: Node.js 와 TypeScript | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js에서 TypeScript를 사용하는 방법을 배웁니다. TypeScript의 장점, 설치, 사용 방법을 소개하며, TypeScript 코드를 컴파일하고 실행하는 방법과 기능, 툴에 대해서도紹介합니다.
  - - meta
    - name: twitter:title
      content: Node.js 와 TypeScript | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js에서 TypeScript를 사용하는 방법을 배웁니다. TypeScript의 장점, 설치, 사용 방법을 소개하며, TypeScript 코드를 컴파일하고 실행하는 방법과 기능, 툴에 대해서도紹介합니다.
---


# TypeScript를 사용한 Node.js

## TypeScript란 무엇인가

[TypeScript](https://www.typescriptlang.org)는 Microsoft에서 유지 관리 및 개발하는 오픈 소스 언어입니다. 전 세계의 많은 소프트웨어 개발자들이 사랑하고 사용합니다.

기본적으로 JavaScript의 상위 집합이며 언어에 새로운 기능을 추가합니다. 가장 주목할만한 추가 기능은 일반 JavaScript에는 없는 정적 타입 정의입니다. 타입을 사용하면 예를 들어 함수에서 어떤 종류의 인수를 예상하는지, 정확히 무엇이 반환되는지 또는 생성하는 객체의 정확한 모양을 선언할 수 있습니다. TypeScript는 매우 강력한 도구이며 JavaScript 프로젝트에서 새로운 가능성의 세계를 열어줍니다. 코드가 배송되기 전에도 많은 버그를 방지하여 코드를 더욱 안전하고 강력하게 만듭니다. 코드 개발 중에 문제를 포착하고 Visual Studio Code와 같은 코드 편집기와 훌륭하게 통합됩니다.

TypeScript의 다른 이점에 대해서는 나중에 이야기하고, 지금 몇 가지 예를 살펴 보겠습니다!

### 예시

이 코드 스니펫을 살펴보고 함께 살펴 보겠습니다.

```ts
type User = {
  name: string
  age: number
}
function isAdult(user: User): boolean {
  return user.age >= 18
}
const justine: User = {
  name: 'Justine',
  age: 23,
}
const isJustineAnAdult: boolean = isAdult(justine)
```

첫 번째 부분(`type` 키워드 포함)은 사용자를 나타내는 사용자 정의 객체 유형을 선언하는 역할을 합니다. 나중에 이 새로 생성된 유형을 사용하여 `User` 유형의 인수를 하나 허용하고 `boolean`을 반환하는 함수 `isAdult`를 만듭니다. 그런 다음 이전에 정의된 함수를 호출하는 데 사용할 수 있는 예제 데이터인 `justine`을 만듭니다. 마지막으로 `justine`이 성인인지 여부에 대한 정보가 있는 새 변수를 만듭니다.

이 예제에 대해 알아야 할 추가 사항이 있습니다. 첫째, 선언된 유형을 준수하지 않으면 TypeScript는 잘못된 것이 있음을 경고하고 오용을 방지합니다. 둘째, 모든 것을 명시적으로 입력할 필요는 없습니다. TypeScript는 매우 똑똑하고 우리를 위해 유형을 추론할 수 있습니다. 예를 들어 변수 `isJustineAnAdult`는 명시적으로 입력하지 않았더라도 부울 유형이 되거나 `User` 유형으로 선언하지 않았더라도 `justine`은 함수에 대한 유효한 인수가 됩니다.

좋아요, TypeScript 코드가 있습니다. 이제 어떻게 실행합니까?

**가장 먼저 할 일은 프로젝트에 TypeScript를 설치하는 것입니다.**

```bash
npm install -D typescript
```

이제 터미널에서 `tsc` 명령을 사용하여 JavaScript로 컴파일할 수 있습니다. 해봅시다!

**파일 이름이 `example.ts`라고 가정하면 명령은 다음과 같습니다.**

```bash
npx tsc example.ts
```

::: tip
**여기서 [npx](https://www.npmjs.com/package/npx)는 Node Package Execute를 나타냅니다. 이 도구를 사용하면 TypeScript 컴파일러를 전역적으로 설치하지 않고도 실행할 수 있습니다.**
:::

`tsc`는 TypeScript 코드를 가져와 JavaScript로 컴파일하는 TypeScript 컴파일러입니다. 이 명령은 Node.js를 사용하여 실행할 수 있는 `example.js`라는 새 파일을 생성합니다. 이제 TypeScript 코드를 컴파일하고 실행하는 방법을 알았으니 TypeScript 버그 방지 기능을 실제로 확인해 보겠습니다!

**다음은 코드를 수정하는 방법입니다.**

```ts
type User = {
  name: string
  age: number
}
function isAdult(user: User): boolean {
  return user.age >= 18
}
const justine: User = {
  name: 'Justine',
  age: 'Secret!',
}
const isJustineAnAdult: string = isAdult(justine, "I shouldn't be here!")
```

**그리고 이것이 TypeScript가 이에 대해 말하는 내용입니다.**

```bash
example.ts:12:5 - error TS2322: Type 'string' is not assignable to type 'number'.
12     age: 'Secret!',
       ~~~
  example.ts:3:5
    3     age: number;
          ~~~
    The expected type comes from property 'age' which is declared here on type 'User'
example.ts:15:7 - error TS2322: Type 'boolean' is not assignable to type 'string'.
15 const isJustineAnAdult: string = isAdult(justine, "I shouldn't be here!");
         ~~~~~~~~~~~~~~~~
example.ts:15:51 - error TS2554: Expected 1 arguments, but got 2.
15 const isJustineAnAdult: string = isAdult(justine, "I shouldn't be here!");
                                                     ~~~~~~~~~~~~~~~~~~~~~~
Found 3 errors in the same file, starting at: example.ts:12
```

보시다시피 TypeScript는 예상치 않게 작동할 수 있는 코드를 성공적으로 방지합니다. 훌륭합니다!


## TypeScript에 대해 더 알아보기

TypeScript는 인터페이스, 클래스, 유틸리티 타입 등과 같은 훌륭한 메커니즘을 많이 제공합니다. 또한 대규모 프로젝트에서는 TypeScript 컴파일러 구성을 별도의 파일에서 선언하고 작동 방식, 엄격도, 컴파일된 파일을 저장할 위치 등을 세부적으로 조정할 수 있습니다. 이 모든 멋진 내용에 대한 자세한 내용은 [공식 TypeScript 문서](https://www.typescriptlang.org/docs)에서 확인할 수 있습니다.

TypeScript의 다른 이점으로는 점진적으로 도입할 수 있다는 점, 코드를 더 읽기 쉽고 이해하기 쉽게 만들어 준다는 점, 그리고 개발자가 최신 언어 기능을 사용하면서 이전 Node.js 버전용 코드를 제공할 수 있다는 점 등이 있습니다.

## Node.js에서 TypeScript 코드 실행하기

Node.js는 TypeScript를 기본적으로 실행할 수 없습니다. 명령줄에서 `node example.ts`를 직접 호출할 수 없습니다. 하지만 이 문제에 대한 세 가지 해결책이 있습니다.

### TypeScript를 JavaScript로 컴파일하기

Node.js에서 TypeScript 코드를 실행하려면 먼저 JavaScript로 컴파일해야 합니다. 앞서 설명한 것처럼 TypeScript 컴파일러 `tsc`를 사용하여 이 작업을 수행할 수 있습니다.

다음은 간단한 예제입니다.

```bash
npx tsc example.ts
node example.js
```

### `ts-node`로 TypeScript 코드 실행하기

[ts-node](https://www.npmjs.com/package/ts-node)를 사용하면 먼저 컴파일할 필요 없이 Node.js에서 직접 TypeScript 코드를 실행할 수 있습니다. 하지만 코드를 타입 검사하지는 않습니다. 따라서 먼저 `tsc`로 코드를 타입 검사한 다음 배포하기 전에 `ts-node`로 실행하는 것이 좋습니다.

`ts-node`를 사용하려면 먼저 설치해야 합니다.

````bash
npm install -D ts-node
``

그런 다음 다음과 같이 TypeScript 코드를 실행할 수 있습니다.

```bash
npx ts-node example.ts
````

### `tsx`로 TypeScript 코드 실행하기

[tsx](https://www.npmjs.com/package/tsx)를 사용하면 먼저 컴파일할 필요 없이 Node.js에서 직접 TypeScript 코드를 실행할 수 있습니다. 하지만 코드를 타입 검사하지는 않습니다. 따라서 먼저 `tsc`로 코드를 타입 검사한 다음 배포하기 전에 `tsx`로 실행하는 것이 좋습니다.

tsx를 사용하려면 먼저 설치해야 합니다.

```bash
npm install -D tsx
```

그런 다음 다음과 같이 TypeScript 코드를 실행할 수 있습니다.

```bash
npx tsx example.ts
```

`node`를 통해 `tsx`를 사용하려면 `--import`를 통해 `tsx`를 등록할 수 있습니다.

```bash
node --import=tsx example.ts
```


## Node.js 세계의 TypeScript

TypeScript는 Node.js 세계에서 확고하게 자리 잡았으며 많은 회사, 오픈 소스 프로젝트, 도구 및 프레임워크에서 사용됩니다. TypeScript를 사용하는 주목할 만한 오픈 소스 프로젝트의 예는 다음과 같습니다.

- [NestJS](https://nestjs.com) - 확장 가능하고 잘 설계된 시스템을 쉽고 즐겁게 만들 수 있는 강력하고 완전한 기능을 갖춘 프레임워크
- [TypeORM](https://typeorm.io) - Hibernate, Doctrine 또는 Entity Framework와 같은 다른 언어의 잘 알려진 도구의 영향을 받은 훌륭한 ORM
- [Prisma](https://prisma.io) - 선언적 데이터 모델, 생성된 마이그레이션 및 완전히 유형 안전한 데이터베이스 쿼리를 특징으로 하는 차세대 ORM
- [RxJS](https://rxjs.dev) - 반응형 프로그래밍에 널리 사용되는 라이브러리
- [AdonisJS](https://adonisjs.com) - Node.js를 사용하는 완전한 기능을 갖춘 웹 프레임워크
- [FoalTs](https://foal.dev) - 우아한 Nodejs 프레임워크

그리고 더 많은 훌륭한 프로젝트가 있습니다... 어쩌면 당신의 다음 프로젝트일 수도 있습니다!

