---
title: Node-API 패키지发布
description: Node-API 버전의 패키지를 비-Node-API 버전과 함께 출시하는 방법과 패키지에 Node-API 버전의 의존성을 도입하는 방법에 대해 알아보십시오.
head:
  - - meta
    - name: og:title
      content: Node-API 패키지发布 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node-API 버전의 패키지를 비-Node-API 버전과 함께 출시하는 방법과 패키지에 Node-API 버전의 의존성을 도입하는 방법에 대해 알아보십시오.
  - - meta
    - name: twitter:title
      content: Node-API 패키지发布 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node-API 버전의 패키지를 비-Node-API 버전과 함께 출시하는 방법과 패키지에 Node-API 버전의 의존성을 도입하는 방법에 대해 알아보십시오.
---


# Node-API 패키지를 게시하는 방법

## Node-API 버전이 아닌 패키지와 함께 Node-API 버전을 게시하는 방법

다음 단계는 `iotivity-node` 패키지를 사용하여 설명됩니다.

- 먼저 Node-API 버전이 아닌 버전을 게시합니다.
    - `package.json`에서 버전을 업데이트합니다. `iotivity-node`의 경우 버전이 1.2.0-2가 됩니다.
    - 릴리스 체크리스트를 확인합니다(테스트/데모/문서가 OK인지 확인).
    - `npm publish`.

- 그런 다음 Node-API 버전을 게시합니다.
    - `package.json`에서 버전을 업데이트합니다. `iotivity-node`의 경우 버전이 1.2.0-3이 됩니다. 버전 관리의 경우 [semver.org](https://semver.org)에서 설명하는 대로 미리 릴리스 버전 체계를 따르는 것이 좋습니다(예: 1.2.0-napi).
    - 릴리스 체크리스트를 확인합니다(테스트/데모/문서가 OK인지 확인).
    - `npm publish --tag n-api`.

이 예에서 `n-api`로 릴리스를 태깅하면 버전 1.2.0-3이 게시된 Node-API 버전이 아닌 버전(1.2.0-2)보다 늦더라도 누군가가 `npm install iotivity-node`를 실행하여 `iotivity-node`를 설치하도록 선택하는 경우 설치되지 않습니다. 이렇게 하면 기본적으로 Node-API 버전이 아닌 버전이 설치됩니다. 사용자는 Node-API 버전을 받으려면 `npm install iotivity-node@n api`를 실행해야 합니다. npm으로 태그를 사용하는 방법에 대한 자세한 내용은 "dist-tags 사용"을 확인하십시오.

## 패키지의 Node-API 버전에 대한 종속성을 도입하는 방법

`iotivity-node`의 Node-API 버전을 종속성으로 추가하려면 `package.json`은 다음과 같습니다.

```json
"dependencies": {
  "iotivity-node": "n-api"
}
```

"dist-tags 사용"에서 설명한 대로 일반 버전과 달리 태그가 지정된 버전은 `package.json` 내에서 `"^2.0.0"`과 같은 버전 범위로 처리할 수 없습니다. 그 이유는 태그가 정확히 하나의 버전을 나타내기 때문입니다. 따라서 패키지 유지 관리자가 동일한 태그를 사용하여 패키지의 최신 버전을 태그하도록 선택하면 `npm update`는 최신 버전을 받게 됩니다. 이것은 허용 가능한 버전이어야 합니다. 게시된 최신 버전이 아닌 다른 버전인 경우 `package.json` 종속성은 다음과 같이 정확한 버전을 참조해야 합니다.

```json
"dependencies": {
  "iotivity-node": "1.2.0-3"
}
```
