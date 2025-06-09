---
title: Node.js의 ECMAScript 2015(ES6) 및 이후
description: Node.js는 V8 엔진을 통해 최신 ECMAScript 기능을 지원하며, 새로운 기능 및 개선 사항이 적시에 반영됩니다.
head:
  - - meta
    - name: og:title
      content: Node.js의 ECMAScript 2015(ES6) 및 이후 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js는 V8 엔진을 통해 최신 ECMAScript 기능을 지원하며, 새로운 기능 및 개선 사항이 적시에 반영됩니다.
  - - meta
    - name: twitter:title
      content: Node.js의 ECMAScript 2015(ES6) 및 이후 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js는 V8 엔진을 통해 최신 ECMAScript 기능을 지원하며, 새로운 기능 및 개선 사항이 적시에 반영됩니다.
---


# ECMAScript 2015 (ES6) 이상

Node.js는 최신 버전의 [V8](https://v8.dev/)을 기반으로 빌드됩니다. 이 엔진의 최신 릴리스를 최신 상태로 유지함으로써 [JavaScript ECMA-262 사양](https://tc39.es/ecma262/)의 새로운 기능이 Node.js 개발자에게 적시에 제공되도록 하고 지속적인 성능 및 안정성 향상을 보장합니다.

모든 ECMAScript 2015 (ES6) 기능은 `shipping`, `staged` 및 `in progress` 기능의 세 그룹으로 나뉩니다.

+ V8에서 안정적이라고 간주하는 모든 `shipping` 기능은 `Node.js에서 기본적으로 활성화`되며 런타임 플래그가 필요 `없습니다`.
+ `Staged` 기능은 거의 완료되었지만 V8 팀에서 안정적이라고 간주하지 않는 기능으로 런타임 플래그 `--harmony`가 필요합니다.
+ `In progress` 기능은 해당 harmony 플래그로 개별적으로 활성화할 수 있지만 테스트 목적이 아닌 경우에는 권장하지 않습니다. 참고: 이러한 플래그는 V8에서 노출되며 더 이상 사용되지 않는다는 알림 없이 변경될 수 있습니다.

## 어떤 기능이 기본적으로 Node.js 버전과 함께 제공되나요?

웹사이트 [node.green](https://node.green)은 kangax의 compat-table을 기반으로 다양한 버전의 Node.js에서 지원되는 ECMAScript 기능에 대한 훌륭한 개요를 제공합니다.

## 어떤 기능이 진행 중인가요?

새로운 기능은 V8 엔진에 지속적으로 추가되고 있습니다. 일반적으로 타이밍은 알 수 없지만 향후 Node.js 릴리스에 포함될 것으로 예상할 수 있습니다.

`--v8-options` 인수를 통해 각 Node.js 릴리스에서 사용할 수 있는 모든 진행 중인 기능을 나열할 수 있습니다. 이는 V8의 불완전하고 잠재적으로 손상된 기능이므로 자신의 책임하에 사용하십시오.

```sh
node --v8-options | grep "in progress"
```

## `--harmony` 플래그를 활용하도록 인프라를 설정했습니다. 제거해야 하나요?

Node.js에서 `--harmony` 플래그의 현재 동작은 `staged` 기능만 활성화하는 것입니다. 결국 이제 `--es_staging`의 동의어입니다. 위에서 언급했듯이 이는 아직 안정적이라고 간주되지 않은 완료된 기능입니다. 특히 프로덕션 환경에서 안전하게 플레이하려면 V8과 결과적으로 Node.js에서 기본적으로 제공될 때까지 이 런타임 플래그를 제거하는 것을 고려하십시오. 이 기능을 활성화 상태로 유지하면 V8이 표준을 더 긴밀하게 준수하도록 의미 체계를 변경하는 경우 추가 Node.js 업그레이드로 인해 코드가 중단될 수 있습니다.


## 특정 Node.js 버전에 포함된 V8 버전을 어떻게 찾나요?

Node.js는 `process` 전역 객체를 통해 특정 바이너리에 포함된 모든 종속성 및 해당 버전을 나열하는 간단한 방법을 제공합니다. V8 엔진의 경우, 터미널에서 다음을 입력하여 해당 버전을 검색하십시오.

```sh
node -p process.versions.v8
```

