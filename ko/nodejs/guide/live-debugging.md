---
title: Node.js 라이브 디버깅
description: Node.js 프로세스 라이브 디버깅 방법을 배우고, 문제를 식별하고 해결하는 방법을 확인합니다.
head:
  - - meta
    - name: og:title
      content: Node.js 라이브 디버깅 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js 프로세스 라이브 디버깅 방법을 배우고, 문제를 식별하고 해결하는 방법을 확인합니다.
  - - meta
    - name: twitter:title
      content: Node.js 라이브 디버깅 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js 프로세스 라이브 디버깅 방법을 배우고, 문제를 식별하고 해결하는 방법을 확인합니다.
---


# 라이브 디버깅

이 문서에서는 Node.js 프로세스를 라이브 디버깅하는 방법에 대해 알아볼 수 있습니다.

## 내 애플리케이션이 예상대로 작동하지 않습니다.

### 증상

사용자는 애플리케이션이 특정 입력에 대해 예상되는 출력을 제공하지 않는 것을 관찰할 수 있습니다. 예를 들어 HTTP 서버가 특정 필드가 비어 있는 JSON 응답을 반환합니다. 프로세스에서 다양한 문제가 발생할 수 있지만 이 사용 사례에서는 주로 애플리케이션 로직과 그 정확성에 중점을 둡니다.

### 디버깅

이 사용 사례에서 사용자는 들어오는 HTTP 요청과 같은 특정 트리거에 대해 애플리케이션이 실행하는 코드 경로를 이해하고 싶어합니다. 또한 코드를 단계별로 실행하고 실행을 제어하며 변수가 메모리에 보유하는 값을 검사할 수도 있습니다. 이를 위해 애플리케이션을 시작할 때 `--inspect` 플래그를 사용할 수 있습니다. 디버깅 관련 문서는 [여기](/ko/nodejs/guide/debugging-nodejs)에서 찾을 수 있습니다.

