---
title: npm 패키지 관리자 사용 가이드
description: npm을 사용하여 의존성 관리, 패키지 설치 및 업데이트, Node.js 프로젝트에서 작업을 실행하는 방법을 배웁니다.
head:
  - - meta
    - name: og:title
      content: npm 패키지 관리자 사용 가이드 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: npm을 사용하여 의존성 관리, 패키지 설치 및 업데이트, Node.js 프로젝트에서 작업을 실행하는 방법을 배웁니다.
  - - meta
    - name: twitter:title
      content: npm 패키지 관리자 사용 가이드 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: npm을 사용하여 의존성 관리, 패키지 설치 및 업데이트, Node.js 프로젝트에서 작업을 실행하는 방법을 배웁니다.
---


# npm 패키지 관리자 소개

## npm 소개

`npm`은 Node.js의 표준 패키지 관리자입니다.

2022년 9월에 npm 레지스트리에 210만 개 이상의 패키지가 등록된 것으로 보고되었으며, 이는 지구상에서 가장 큰 단일 언어 코드 저장소이며 거의 모든 것에 대한 패키지가 있다고 확신할 수 있습니다!

Node.js 패키지의 종속성을 다운로드하고 관리하는 방법으로 시작되었지만 이후 프런트엔드 JavaScript에서도 사용되는 도구가 되었습니다.

::: tip
`Yarn` 및 `pnpm`은 npm cli의 대안입니다. 그것들도 확인해 볼 수 있습니다.
:::

## 패키지

### 모든 종속성 설치

다음 명령을 실행하여 `package.json` 파일에 나열된 모든 종속성을 설치할 수 있습니다.

```bash
npm install
```

프로젝트에 필요한 모든 것을 `node_modules` 폴더에 설치하고, 아직 존재하지 않는 경우 폴더를 생성합니다.

### 단일 패키지 설치

다음 명령을 실행하여 단일 패키지를 설치할 수 있습니다.

```bash
npm install <package-name>
```

또한 npm 5부터 이 명령은 `<package-name>`을 `package.json` 파일 종속성에 추가합니다. 버전 5 이전에는 `--save` 플래그를 추가해야 했습니다.

종종 이 명령에 더 많은 플래그가 추가되는 것을 볼 수 있습니다.

+ `--save-dev` (또는 `-D`)는 패키지를 `package.json` 파일의 `devDependencies` 섹션에 추가합니다.
+ `--no-save`는 패키지를 `package.json` 파일에 저장하지 못하게 합니다.
+ `--no-optional`은 선택적 종속성 설치를 방지합니다.
+ `--save-optional`은 패키지를 `package.json` 파일의 `optionalDependencies` 섹션에 추가합니다.

플래그의 약어도 사용할 수 있습니다.

+ `-S`: `--save`
+ `-D`: `--save-dev`
+ `-O`: `--save-optional`

devDependencies와 dependencies의 차이점은 전자는 테스트 라이브러리와 같은 개발 도구를 포함하는 반면 후자는 프로덕션 환경에서 앱과 함께 번들로 제공된다는 것입니다.

optionalDependencies의 경우 종속성 빌드 실패로 인해 설치가 실패하지 않는다는 차이가 있습니다. 그러나 종속성 부족을 처리하는 것은 프로그램의 책임입니다. [선택적 종속성](https://docs.npmjs.com/cli/v10/using-npm/config#optional)에 대해 자세히 알아보세요.


### 패키지 업데이트하기
업데이트 또한 다음과 같이 실행하여 쉽게 수행할 수 있습니다.

```bash
npm update
```

이 명령어는 모든 종속성을 최신 버전으로 업데이트합니다.

업데이트할 단일 패키지를 지정할 수도 있습니다.

```bash
npm update <package-name>
```

### 패키지 제거하기

패키지를 제거하려면 다음 명령을 실행합니다.

```bash
npm uninstall <package-name>
```

### 버전 관리
`npm`은 단순한 다운로드 외에도 버전 관리를 관리하므로 패키지의 특정 버전을 지정하거나 필요한 버전보다 높거나 낮은 버전을 요구할 수 있습니다.

라이브러리가 다른 라이브러리의 주요 릴리스와만 호환되는 경우가 많습니다.

또는 아직 수정되지 않은 라이브러리의 최신 릴리스의 버그로 인해 문제가 발생할 수 있습니다.

라이브러리의 명시적 버전을 지정하면 모든 사람이 동일한 패키지 버전을 유지하여 `package.json` 파일이 업데이트될 때까지 전체 팀이 동일한 버전을 실행할 수 있습니다.

이러한 모든 경우에 버전 관리는 많은 도움이 되며 `npm`은 [시맨틱 버전 관리 (semver)](https://semver.org/) 표준을 따릅니다.

다음 명령을 실행하여 패키지의 특정 버전을 설치할 수 있습니다.

```bash
npm install <package-name>@<version>
```

다음 명령을 실행하여 패키지의 최신 버전을 설치할 수도 있습니다.

```bash
npm install <package-name>@latest
```

### 작업 실행하기
package.json 파일은 다음을 사용하여 실행할 수 있는 명령줄 작업을 지정하기 위한 형식을 지원합니다.

```bash
npm run <task-name>
```

예를 들어 package.json 파일에 다음 내용이 있는 경우:

```json
{
  "scripts": {
    "start": "node index.js",
    "test": "jest"
  }
}
```

Webpack을 실행하는 데 이 기능이 매우 일반적으로 사용됩니다.

```json
{
  "scripts": {
    "watch": "webpack --watch --progress --colors --config webpack.conf.js",
    "dev": "webpack --progress --colors --config webpack.conf.js",
    "prod": "NODE_ENV=production webpack -p --config webpack.conf.js"
  }
}
```

따라서 잊어버리거나 잘못 입력하기 쉬운 긴 명령을 입력하는 대신 다음을 실행할 수 있습니다.

```bash
npm run watch
npm run dev
npm run prod
```

