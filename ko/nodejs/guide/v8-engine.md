---
title: V8 자바스크립트 엔진
description: V8은 Google Chrome을 구동하는 자바스크립트 엔진으로 자바스크립트 코드를 실행하고 실행 환경을 제공합니다. 브라우저에 독립적이며 Node.js의 부상에 기여하여 서버 측 코드와 데스크톱 애플리케이션을 구동합니다.
head:
  - - meta
    - name: og:title
      content: V8 자바스크립트 엔진 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: V8은 Google Chrome을 구동하는 자바스크립트 엔진으로 자바스크립트 코드를 실행하고 실행 환경을 제공합니다. 브라우저에 독립적이며 Node.js의 부상에 기여하여 서버 측 코드와 데스크톱 애플리케이션을 구동합니다.
  - - meta
    - name: twitter:title
      content: V8 자바스크립트 엔진 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: V8은 Google Chrome을 구동하는 자바스크립트 엔진으로 자바스크립트 코드를 실행하고 실행 환경을 제공합니다. 브라우저에 독립적이며 Node.js의 부상에 기여하여 서버 측 코드와 데스크톱 애플리케이션을 구동합니다.
---


# V8 JavaScript 엔진

V8은 Google Chrome을 구동하는 JavaScript 엔진의 이름입니다. Chrome으로 웹을 탐색하는 동안 JavaScript 코드를 가져와서 실행하는 역할을 합니다.

V8은 JavaScript 엔진, 즉 JavaScript 코드를 파싱하고 실행합니다. DOM과 다른 웹 플랫폼 API(이들은 모두 런타임 환경을 구성)는 브라우저에서 제공합니다.

흥미로운 점은 JavaScript 엔진이 호스팅되는 브라우저와 독립적이라는 것입니다. 이 핵심 기능은 Node.js의 부상을 가능하게 했습니다. V8은 2009년에 Node.js를 구동하는 엔진으로 선택되었고, Node.js의 인기가 폭발적으로 증가하면서 V8은 현재 JavaScript로 작성된 엄청난 양의 서버 측 코드를 구동하는 엔진이 되었습니다.

Node.js 생태계는 거대하며, Electron과 같은 프로젝트를 통해 데스크톱 앱을 구동하는 V8 덕분입니다.

## 기타 JS 엔진

다른 브라우저에는 자체 JavaScript 엔진이 있습니다.

+ `SpiderMonkey` (Firefox)
+ `JavaScriptCore`(일명 `Nitro`) (Safari)
+ Edge는 원래 `Chakra`를 기반으로 했지만 최근 Chromium 및 V8 엔진을 사용하여 재구축되었습니다.

또한 많은 다른 엔진이 존재합니다.

이러한 모든 엔진은 JavaScript에서 사용되는 표준인 [ECMA ES-262 표준](https://www.ecma-international.org/publications-and-standards/standards/ecma-262/)(ECMAScript라고도 함)을 구현합니다.

## 성능을 위한 노력

V8은 C++로 작성되었으며 지속적으로 개선되고 있습니다. 이식성이 뛰어나 Mac, Windows, Linux 및 기타 여러 시스템에서 실행됩니다.

이 V8 소개에서는 V8의 구현 세부 사항을 무시합니다. 이러한 세부 사항은 더 권위 있는 사이트(예: [V8 공식 사이트](https://v8.dev/))에서 찾을 수 있으며 시간이 지남에 따라 종종 급격하게 변경됩니다.

V8은 웹과 Node.js 생태계를 가속화하기 위해 다른 JavaScript 엔진과 마찬가지로 항상 진화하고 있습니다.

웹에서는 수년간 성능을 위한 경쟁이 계속되고 있으며 사용자 및 개발자로서 우리는 매년 더 빠르고 최적화된 머신을 얻기 때문에 이 경쟁으로부터 많은 이점을 얻습니다.


## 컴파일

JavaScript는 일반적으로 인터프리터 언어로 간주되지만, 최신 JavaScript 엔진은 더 이상 JavaScript를 해석만 하지 않고 컴파일합니다.

이는 2009년부터 시작되었으며, SpiderMonkey JavaScript 컴파일러가 Firefox 3.5에 추가되면서 모든 사람이 이 아이디어를 따랐습니다.

JavaScript는 실행 속도를 높이기 위해 JIT(Just-In-Time) 컴파일을 통해 V8에 의해 내부적으로 컴파일됩니다.

이는 직관에 어긋나는 것처럼 보일 수 있지만, 2004년 Google Maps가 도입된 이후 JavaScript는 일반적으로 수십 줄의 코드를 실행하는 언어에서 브라우저에서 실행되는 수천에서 수십만 줄의 코드를 가진 완전한 애플리케이션으로 발전했습니다.

우리의 애플리케이션은 이제 몇 가지 폼 유효성 검사 규칙이나 간단한 스크립트가 아닌 브라우저 내에서 몇 시간 동안 실행될 수 있습니다.

이 새로운 세상에서 JavaScript를 컴파일하는 것은 완벽하게 이치에 맞습니다. JavaScript를 준비하는 데 시간이 조금 더 걸릴 수 있지만, 완료되면 순수하게 해석된 코드보다 훨씬 더 성능이 뛰어나기 때문입니다.

