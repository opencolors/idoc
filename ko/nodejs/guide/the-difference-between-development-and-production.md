---
title: Node.js의 개발 환경과 프로덕션 환경의 차이
description: Node.js의 NODE_ENV의 역할과 개발 환경 및 프로덕션 환경에 대한 영향에 대해 이해합니다.
head:
  - - meta
    - name: og:title
      content: Node.js의 개발 환경과 프로덕션 환경의 차이 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js의 NODE_ENV의 역할과 개발 환경 및 프로덕션 환경에 대한 영향에 대해 이해합니다.
  - - meta
    - name: twitter:title
      content: Node.js의 개발 환경과 프로덕션 환경의 차이 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js의 NODE_ENV의 역할과 개발 환경 및 프로덕션 환경에 대한 영향에 대해 이해합니다.
---


# Node.js, 개발 환경과 프로덕션 환경의 차이점

`Node.js에서는 개발 환경과 프로덕션 환경 간에 차이가 없습니다`. 즉, Node.js가 프로덕션 구성에서 작동하도록 적용해야 하는 특정 설정이 없습니다. 그러나 npm 레지스트리의 일부 라이브러리는 `NODE_ENV` 변수를 사용하는 것을 인식하고 기본적으로 `development` 설정으로 지정합니다. 항상 `NODE_ENV=production`을 설정하여 Node.js를 실행하십시오.

애플리케이션을 구성하는 일반적인 방법은 [12 요인 방법론](https://12factor.net)을 사용하는 것입니다.

## Express에서의 NODE_ENV

매우 인기있는 [express](https://expressjs.com) 프레임워크에서 NODE_ENV를 production으로 설정하면 일반적으로 다음이 보장됩니다.

+ 로깅은 최소 필수 수준으로 유지됩니다.
+ 성능을 최적화하기 위해 더 많은 캐싱 수준이 적용됩니다.

이것은 일반적으로 다음 명령을 실행하여 수행됩니다.

```bash
export NODE_ENV=production
```

쉘에서 실행되지만 시스템 재시작시 설정이 유지되지 않으므로 쉘 구성 파일(예: Bash 쉘의 `.bash_profile`)에 넣는 것이 좋습니다.

애플리케이션 초기화 명령 앞에 환경 변수를 추가하여 적용할 수도 있습니다.

```bash
NODE_ENV=production node app.js
```

예를 들어 Express 앱에서 이를 사용하여 환경별로 다른 오류 처리기를 설정할 수 있습니다.

```javascript
if (process.env.NODE_ENV === 'development') {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
}
if (process.env.NODE_ENV === 'production') {
  app.use(express.errorHandler());
}
```

예를 들어 [Express.js](https://expressjs.com)에서 사용하는 템플릿 라이브러리인 [Pug](https://pugjs.org)는 `NODE_ENV`가 `production`으로 설정되지 않은 경우 디버그 모드에서 컴파일됩니다. Express 뷰는 개발 모드에서 모든 요청에서 컴파일되는 반면, 프로덕션 환경에서는 캐시됩니다. 더 많은 예가 있습니다.

`이 환경 변수는 외부 라이브러리에서 널리 사용되는 규칙이지만 Node.js 자체에서는 사용되지 않습니다.`

## NODE_ENV가 안티 패턴으로 간주되는 이유는 무엇입니까?

환경은 엔지니어가 소프트웨어 제품을 빌드, 테스트, 배포 및 관리할 수 있는 디지털 플랫폼 또는 시스템입니다. 일반적으로 애플리케이션이 실행되는 환경에는 다음 네 가지 단계 또는 유형이 있습니다.

+ 개발
+ 스테이징
+ 프로덕션
+ 테스트

`NODE_ENV`의 근본적인 문제는 개발자가 소프트웨어 최적화 및 동작을 소프트웨어가 실행되는 환경과 결합하는 데서 비롯됩니다. 그 결과 다음과 같은 코드가 생성됩니다.

```javascript
if (process.env.NODE_ENV === 'development') {
  // ...
}
if (process.env.NODE_ENV === 'staging') {
  // ...
}
if (process.env.NODE_ENV === 'production') {
  // ...
}
if (process.env.NODE_ENV === 'testing') {
  // ...
}
```

이것이 무해해 보일 수 있지만 프로덕션 및 스테이징 환경을 다르게 만들어 신뢰할 수있는 테스트를 불가능하게 만듭니다. 예를 들어 `NODE_ENV`가 `development`로 설정되면 테스트와 제품 기능이 통과될 수 있지만 `NODE_ENV`를 `production`으로 설정하면 실패할 수 있습니다. 따라서 `NODE_ENV`를 `production` 이외의 다른 것으로 설정하는 것은 안티 패턴으로 간주됩니다.

