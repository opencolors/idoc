---
title: Node.js 설치 방법
description: 다양한 패키지 관리자와 방법을 사용하여 Node.js를 설치하는 방법을 알아보십시오. nvm, fnm, Homebrew, Docker 및 기타 방법이 포함됩니다.
head:
  - - meta
    - name: og:title
      content: Node.js 설치 방법 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: 다양한 패키지 관리자와 방법을 사용하여 Node.js를 설치하는 방법을 알아보십시오. nvm, fnm, Homebrew, Docker 및 기타 방법이 포함됩니다.
  - - meta
    - name: twitter:title
      content: Node.js 설치 방법 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: 다양한 패키지 관리자와 방법을 사용하여 Node.js를 설치하는 방법을 알아보십시오. nvm, fnm, Homebrew, Docker 및 기타 방법이 포함됩니다.
---


# Node.js 설치 방법

Node.js는 다양한 방법으로 설치할 수 있습니다. 이 글에서는 가장 일반적이고 편리한 방법을 중점적으로 다룹니다. 모든 주요 플랫폼용 공식 패키지는 [https://nodejs.org/download/](https://nodejs.org/download/)에서 확인할 수 있습니다.

Node.js를 설치하는 매우 편리한 방법 중 하나는 패키지 관리자를 이용하는 것입니다. 이 경우 운영체제마다 자체적인 패키지 관리자가 있습니다.

## 패키지 관리자를 이용한 설치

macOS, Linux 및 Windows에서는 다음과 같이 설치할 수 있습니다.

::: code-group
```bash [nvm]
# nvm (Node Version Manager) 설치
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash

# Node.js 다운로드 및 설치 (터미널을 재시작해야 할 수 있습니다.)
nvm install 20

# 올바른 Node.js 버전이 환경에 있는지 확인
node -v # `v20.17.0` 출력

# 올바른 npm 버전이 환경에 있는지 확인
npm -v # `10.8.2` 출력
```
```bash [fnm]
# fnm (Fast Node Manager) 설치
curl -fsSL https://fnm.vercel.app/install | bash

# fnm 활성화
source ~/.bashrc

# Node.js 다운로드 및 설치
fnm use --install-if-missing 20

# 올바른 Node.js 버전이 환경에 있는지 확인
node -v # `v20.17.0` 출력

# 올바른 npm 버전이 환경에 있는지 확인
npm -v # `10.8.2` 출력
```
```bash [Brew]
# 참고:
# Homebrew는 Node.js 패키지 관리자가 아닙니다.
# 시스템에 이미 설치되어 있는지 확인하십시오.
# https://brew.sh/의 공식 지침을 따르십시오.
# Homebrew는 주요 Node.js 버전 설치만 지원하며 20 릴리스 라인의 최신 Node.js 버전을 지원하지 않을 수 있습니다.

# Node.js 다운로드 및 설치
brew install node@20

# 올바른 Node.js 버전이 환경에 있는지 확인
node -v # `v20.17.0` 출력

# 올바른 npm 버전이 환경에 있는지 확인
npm -v # `10.8.2` 출력
```
```bash [Docker]
# 참고:
# Docker는 Node.js 패키지 관리자가 아닙니다.
# 시스템에 이미 설치되어 있는지 확인하십시오.
# https://docs.docker.com/desktop/의 공식 지침을 따르십시오.
# Docker 이미지는 공식적으로 https://github.com/nodejs/docker-node/에서 제공됩니다.

# Node.js Docker 이미지 가져오기
docker pull node:20-alpine

# 올바른 Node.js 버전이 환경에 있는지 확인
docker run node:20-alpine node -v # `v20.17.0` 출력

# 올바른 npm 버전이 환경에 있는지 확인
docker run node:20-alpine npm -v # `10.8.2` 출력
```
:::

Windows에서는 다음과 같이 설치할 수 있습니다.

::: code-group
```bash [fnm]
# fnm (Fast Node Manager) 설치
winget install Schniz.fnm

# fnm 환경 구성
fnm env --use-on-cd | Out-String | Invoke-Expression

# Node.js 다운로드 및 설치
fnm use --install-if-missing 20

# 올바른 Node.js 버전이 환경에 있는지 확인
node -v # `v20.17.0` 출력

# 올바른 npm 버전이 환경에 있는지 확인
npm -v # `10.8.2` 출력
```
```bash [Chocolatey]
# 참고:
# Chocolatey는 Node.js 패키지 관리자가 아닙니다.
# 시스템에 이미 설치되어 있는지 확인하십시오.
# https://chocolatey.org/의 공식 지침을 따르십시오.
# Chocolatey는 Node.js 프로젝트에서 공식적으로 관리하지 않으며 Node.js v20.17.0 버전을 지원하지 않을 수 있습니다.

# Node.js 다운로드 및 설치
choco install nodejs-lts --version="20.17.0"

# 올바른 Node.js 버전이 환경에 있는지 확인
node -v # `20` 출력

# 올바른 npm 버전이 환경에 있는지 확인
npm -v # `10.8.2` 출력
```
```bash [Docker]
# 참고:
# Docker는 Node.js 패키지 관리자가 아닙니다.
# 시스템에 이미 설치되어 있는지 확인하십시오.
# https://docs.docker.com/desktop/의 공식 지침을 따르십시오.
# Docker 이미지는 공식적으로 https://github.com/nodejs/docker-node/에서 제공됩니다.

# Node.js Docker 이미지 가져오기
docker pull node:20-alpine

# 올바른 Node.js 버전이 환경에 있는지 확인
docker run node:20-alpine node -v # `v20.17.0` 출력

# 올바른 npm 버전이 환경에 있는지 확인
docker run node:20-alpine npm -v # `10.8.2` 출력
```
:::

`nvm`은 Node.js를 실행하는 인기 있는 방법입니다. 이를 통해 Node.js 버전을 쉽게 전환하고, 새로운 버전을 설치하여 테스트하고, 문제가 발생하면 쉽게 롤백할 수 있습니다. 또한 이전 Node.js 버전으로 코드를 테스트하는 데 매우 유용합니다.

::: tip
이 옵션에 대한 자세한 내용은 [https://github.com/nvm-sh/nvm](https://github.com/nvm-sh/nvm)을 참조하십시오.
:::

어쨌든 Node.js가 설치되면 명령줄에서 `node` 실행 프로그램에 액세스할 수 있습니다.
