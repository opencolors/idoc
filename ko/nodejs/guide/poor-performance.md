---
title: Node.js 성능 최적화
description: Node.js 프로세스를 분석하여 성능 병목 현상을 식별하고 코드를 최적화하여 효율성과 사용자 경험을 개선하는 방법에 대해 알아보세요.
head:
  - - meta
    - name: og:title
      content: Node.js 성능 최적화 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js 프로세스를 분석하여 성능 병목 현상을 식별하고 코드를 최적화하여 효율성과 사용자 경험을 개선하는 방법에 대해 알아보세요.
  - - meta
    - name: twitter:title
      content: Node.js 성능 최적화 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js 프로세스를 분석하여 성능 병목 현상을 식별하고 코드를 최적화하여 효율성과 사용자 경험을 개선하는 방법에 대해 알아보세요.
---


# 성능 저하
이 문서에서는 Node.js 프로세스를 프로파일링하는 방법에 대해 알아봅니다.

## 내 애플리케이션의 성능이 저하되었습니다.

### 증상

내 애플리케이션의 대기 시간이 높고, 병목 현상이 데이터베이스나 다운스트림 서비스와 같은 종속성이 아니라는 것을 이미 확인했습니다. 따라서 내 애플리케이션이 코드를 실행하거나 정보를 처리하는 데 상당한 시간을 소비한다고 의심됩니다.

일반적으로 애플리케이션 성능에 만족하지만, 애플리케이션의 어떤 부분을 개선하여 더 빠르고 효율적으로 실행할 수 있는지 알고 싶습니다. 사용자 경험을 개선하거나 계산 비용을 절약하려는 경우에 유용할 수 있습니다.

### 디버깅
이 사용 사례에서는 다른 코드 조각보다 더 많은 CPU 사이클을 사용하는 코드 조각에 관심이 있습니다. 로컬에서 이 작업을 수행할 때 일반적으로 코드를 최적화하려고 합니다. [V8 샘플링 프로파일러 사용](/ko/nodejs/guide/profiling-nodejs-applications)이 도움이 될 수 있습니다.

