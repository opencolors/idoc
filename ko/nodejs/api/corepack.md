---
title: Node.js Corepack 문서
description: Corepack은 Node.js와 함께 제공되는 바이너리로, npm, pnpm, Yarn과 같은 패키지 관리자를 관리하기 위한 표준 인터페이스를 제공합니다. 이를 통해 사용자는 다양한 패키지 관리자와 버전 간에 쉽게 전환할 수 있으며, 호환성을 보장하고 개발 워크플로우를 단순화합니다.
head:
  - - meta
    - name: og:title
      content: Node.js Corepack 문서 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Corepack은 Node.js와 함께 제공되는 바이너리로, npm, pnpm, Yarn과 같은 패키지 관리자를 관리하기 위한 표준 인터페이스를 제공합니다. 이를 통해 사용자는 다양한 패키지 관리자와 버전 간에 쉽게 전환할 수 있으며, 호환성을 보장하고 개발 워크플로우를 단순화합니다.
  - - meta
    - name: twitter:title
      content: Node.js Corepack 문서 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Corepack은 Node.js와 함께 제공되는 바이너리로, npm, pnpm, Yarn과 같은 패키지 관리자를 관리하기 위한 표준 인터페이스를 제공합니다. 이를 통해 사용자는 다양한 패키지 관리자와 버전 간에 쉽게 전환할 수 있으며, 호환성을 보장하고 개발 워크플로우를 단순화합니다.
---


# Corepack {#corepack}

**다음 버전에서 추가됨: v16.9.0, v14.19.0**

::: warning [안정성: 1 - 실험적]
[안정성: 1](/ko/nodejs/api/documentation#stability-index) [안정성: 1](/ko/nodejs/api/documentation#stability-index) - 실험적
:::

*<a href="https://github.com/nodejs/corepack">Corepack</a>*은 패키지 관리자 버전을 관리하는 데 도움이 되는 실험적인 도구입니다. 이 도구는 호출 시 현재 프로젝트에 구성된 패키지 관리자를 식별하고, 필요한 경우 다운로드하고, 마지막으로 실행하는 각 [지원되는 패키지 관리자](/ko/nodejs/api/corepack#supported-package-managers)에 대한 바이너리 프록시를 노출합니다.

Corepack은 Node.js의 기본 설치와 함께 배포되지만 Corepack에서 관리하는 패키지 관리자는 Node.js 배포의 일부가 아니며,

- 처음 사용할 때 Corepack은 네트워크에서 최신 버전을 다운로드합니다.
- 보안 취약점 또는 기타 관련 업데이트는 Node.js 프로젝트의 범위를 벗어납니다. 필요한 경우 최종 사용자는 자체적으로 업데이트하는 방법을 알아내야 합니다.

이 기능은 두 가지 핵심 워크플로를 단순화합니다.

- 새로운 기여자의 온보딩을 쉽게 해줍니다. 사용자가 원하는 패키지 관리자를 사용하기 위해 시스템별 설치 프로세스를 더 이상 따를 필요가 없기 때문입니다.
- 팀의 모든 구성원이 업데이트해야 할 때마다 수동으로 동기화할 필요 없이 정확히 원하는 패키지 관리자 버전을 사용하도록 할 수 있습니다.

## 워크플로 {#workflows}

### 기능 활성화 {#enabling-the-feature}

실험적 상태로 인해 Corepack은 현재 효과를 내기 위해 명시적으로 활성화해야 합니다. 이를 위해 [`corepack enable`](https://github.com/nodejs/corepack#corepack-enable--name)을 실행하여 `node` 바이너리 옆에 환경에 심볼릭 링크를 설정합니다(필요한 경우 기존 심볼릭 링크를 덮어씁니다).

이 시점부터 [지원되는 바이너리](/ko/nodejs/api/corepack#supported-package-managers)에 대한 모든 호출은 추가 설정 없이 작동합니다. 문제가 발생하면 [`corepack disable`](https://github.com/nodejs/corepack#corepack-disable--name)을 실행하여 시스템에서 프록시를 제거합니다(그리고 [Corepack 저장소](https://github.com/nodejs/corepack)에 문제를 열어 알려주시는 것을 고려해 주세요).


### 패키지 구성하기 {#configuring-a-package}

Corepack 프록시는 현재 디렉터리 계층 구조에서 가장 가까운 [`package.json`](/ko/nodejs/api/packages#nodejs-packagejson-field-definitions) 파일을 찾아 [`"packageManager"`](/ko/nodejs/api/packages#packagemanager) 속성을 추출합니다.

값이 [지원되는 패키지 관리자](/ko/nodejs/api/corepack#supported-package-managers)에 해당하면 Corepack은 관련 바이너리에 대한 모든 호출이 요청된 버전을 대상으로 실행되도록 하고 필요한 경우 요청 시 다운로드하며, 성공적으로 검색할 수 없으면 중단합니다.

[`corepack use`](https://github.com/nodejs/corepack#corepack-use-nameversion)를 사용하여 Corepack에 로컬 `package.json`을 업데이트하여 원하는 패키지 관리자를 사용하도록 요청할 수 있습니다.

```bash [BASH]
corepack use  # package.json에 최신 7.x 버전을 설정합니다.
corepack use yarn@* # package.json에 최신 버전을 설정합니다.
```
### 전역 버전 업그레이드 {#upgrading-the-global-versions}

기존 프로젝트 외부에서 실행할 때(예: `yarn init` 실행 시) Corepack은 기본적으로 각 도구의 최신 안정 릴리스에 대략적으로 해당하는 미리 정의된 버전을 사용합니다. 이러한 버전은 설정하려는 패키지 관리자 버전과 함께 [`corepack install`](https://github.com/nodejs/corepack#corepack-install--g--global---all--nameversion) 명령을 실행하여 재정의할 수 있습니다.

```bash [BASH]
corepack install --global 
```
또는 태그나 범위를 사용할 수 있습니다.

```bash [BASH]
corepack install --global pnpm@*
corepack install --global yarn@stable
```
### 오프라인 워크플로 {#offline-workflow}

많은 프로덕션 환경에는 네트워크 액세스 권한이 없습니다. Corepack은 일반적으로 패키지 관리자 릴리스를 레지스트리에서 직접 다운로드하므로 이러한 환경과 충돌할 수 있습니다. 이러한 충돌을 방지하려면 네트워크 액세스 권한이 있는 동안(일반적으로 배포 이미지를 준비하는 동시에) [`corepack pack`](https://github.com/nodejs/corepack#corepack-pack---all--nameversion) 명령을 호출합니다. 이렇게 하면 네트워크 액세스 권한이 없어도 필요한 패키지 관리자를 사용할 수 있습니다.

`pack` 명령에는 [다양한 플래그](https://github.com/nodejs/corepack#utility-commands)가 있습니다. 자세한 내용은 자세한 [Corepack 설명서](https://github.com/nodejs/corepack#readme)를 참조하십시오.


## 지원되는 패키지 관리자 {#supported-package-managers}

다음 바이너리는 Corepack을 통해 제공됩니다.

| 패키지 관리자 | 바이너리 이름 |
| --- | --- |
| [Yarn](https://yarnpkg.com/) | `yarn`  ,   `yarnpkg` |
| [pnpm](https://pnpm.io/) | `pnpm`  ,   `pnpx` |
## 자주 묻는 질문 {#common-questions}

### Corepack은 npm과 어떻게 상호 작용합니까? {#how-does-corepack-interact-with-npm?}

Corepack은 다른 패키지 관리자와 마찬가지로 npm을 지원할 수 있지만, 해당 shim은 기본적으로 활성화되어 있지 않습니다. 이는 다음과 같은 몇 가지 결과를 초래합니다.

- Corepack이 이를 가로챌 수 없으므로 다른 패키지 관리자를 사용하도록 구성된 프로젝트 내에서 `npm` 명령을 항상 실행할 수 있습니다.
- `npm`은 [`"packageManager"`](/ko/nodejs/api/packages#packagemanager) 속성에서 유효한 옵션이지만, shim이 없으면 글로벌 npm이 사용됩니다.

### `npm install -g yarn`이 작동하지 않습니다. {#running-npm-install--g-yarn-doesnt-work}

npm은 글로벌 설치를 수행할 때 Corepack 바이너리를 실수로 덮어쓰는 것을 방지합니다. 이 문제를 피하려면 다음 옵션 중 하나를 고려하십시오.

- 이 명령을 실행하지 마십시오. Corepack은 패키지 관리자 바이너리를 어쨌든 제공하고 요청된 버전이 항상 사용 가능하도록 보장하므로 패키지 관리자를 명시적으로 설치할 필요가 없습니다.
- `npm install`에 `--force` 플래그를 추가하십시오. 그러면 npm에 바이너리를 덮어써도 괜찮다고 알리지만, 그 과정에서 Corepack 바이너리를 지우게 됩니다. (다시 추가하려면 [`corepack enable`](https://github.com/nodejs/corepack#corepack-enable--name)을 실행하십시오.)

