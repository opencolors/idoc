---
title: Как установить Node.js
description: Узнайте, как установить Node.js с помощью различных пакетных менеджеров и методов, включая nvm, fnm, Homebrew, Docker и более.
head:
  - - meta
    - name: og:title
      content: Как установить Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Узнайте, как установить Node.js с помощью различных пакетных менеджеров и методов, включая nvm, fnm, Homebrew, Docker и более.
  - - meta
    - name: twitter:title
      content: Как установить Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Узнайте, как установить Node.js с помощью различных пакетных менеджеров и методов, включая nvm, fnm, Homebrew, Docker и более.
---


# Как установить Node.js

Node.js можно установить разными способами. В этой статье описаны наиболее распространенные и удобные из них. Официальные пакеты для всех основных платформ доступны на [https://nodejs.org/download/](https://nodejs.org/download/).

Один из самых удобных способов установки Node.js - через менеджер пакетов. В этом случае каждая операционная система имеет свой собственный.
## Установка с помощью менеджера пакетов

в macOS, Linux и Windows можно установить следующим образом:

::: code-group
```bash [nvm]
# установка nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash

# загрузка и установка Node.js (возможно, потребуется перезагрузить терминал)
nvm install 20

# проверка правильной версии Node.js в среде
node -v # должно вывести `v20.17.0`

# проверка правильной версии npm в среде
npm -v # должно вывести `10.8.2`
```
```bash [fnm]
# установка fnm (Fast Node Manager)
curl -fsSL https://fnm.vercel.app/install | bash

# активация fnm
source ~/.bashrc

# загрузка и установка Node.js
fnm use --install-if-missing 20

# проверка правильной версии Node.js в среде
node -v # должно вывести `v20.17.0`

# проверка правильной версии npm в среде
npm -v # должно вывести `10.8.2`
```
```bash [Brew]
# ПРИМЕЧАНИЕ:
# Homebrew не является менеджером пакетов Node.js.
# Пожалуйста, убедитесь, что он уже установлен в вашей системе.
# Следуйте официальным инструкциям на https://brew.sh/
# Homebrew поддерживает только установку основных версий Node.js и может не поддерживать последнюю версию Node.js из линейки 20.

# загрузка и установка Node.js
brew install node@20

# проверка правильной версии Node.js в среде
node -v # должно вывести `v20.17.0`

# проверка правильной версии npm в среде
npm -v # должно вывести `10.8.2`
```
```bash [Docker]
# ПРИМЕЧАНИЕ:
# Docker не является менеджером пакетов Node.js.
# Пожалуйста, убедитесь, что он уже установлен в вашей системе.
# Следуйте официальным инструкциям на https://docs.docker.com/desktop/
# Docker images предоставляются официально на https://github.com/nodejs/docker-node/

# загрузка Docker image Node.js
docker pull node:20-alpine

# проверка правильной версии Node.js в среде
docker run node:20-alpine node -v # должно вывести `v20.17.0`

# проверка правильной версии npm в среде
docker run node:20-alpine npm -v # должно вывести `10.8.2`
```
:::

в Windows можно установить следующим образом:

::: code-group
```bash [fnm]
# установка fnm (Fast Node Manager)
winget install Schniz.fnm

# настройка среды fnm
fnm env --use-on-cd | Out-String | Invoke-Expression

# загрузка и установка Node.js
fnm use --install-if-missing 20

# проверка правильной версии Node.js в среде
node -v # должно вывести `v20.17.0`

# проверка правильной версии npm в среде
npm -v # должно вывести `10.8.2`
```
```bash [Chocolatey]
# ПРИМЕЧАНИЕ:
# Chocolatey не является менеджером пакетов Node.js.
# Пожалуйста, убедитесь, что он уже установлен в вашей системе.
# Следуйте официальным инструкциям на https://chocolatey.org/
# Chocolatey официально не поддерживается проектом Node.js и может не поддерживать версию v20.17.0 Node.js

# загрузка и установка Node.js
choco install nodejs-lts --version="20.17.0"

# проверка правильной версии Node.js в среде
node -v # должно вывести `20`

# проверка правильной версии npm в среде
npm -v # должно вывести `10.8.2`
```
```bash [Docker]
# ПРИМЕЧАНИЕ:
# Docker не является менеджером пакетов Node.js.
# Пожалуйста, убедитесь, что он уже установлен в вашей системе.
# Следуйте официальным инструкциям на https://docs.docker.com/desktop/
# Docker images предоставляются официально на https://github.com/nodejs/docker-node/

# загрузка Docker image Node.js
docker pull node:20-alpine

# проверка правильной версии Node.js в среде
docker run node:20-alpine node -v # должно вывести `v20.17.0`

# проверка правильной версии npm в среде
docker run node:20-alpine npm -v # должно вывести `10.8.2`
```
:::

`nvm` — популярный способ запуска Node.js. Он позволяет легко переключать версии Node.js и устанавливать новые версии для тестирования, а также легко откатываться, если что-то сломается. Он также очень полезен для тестирования вашего кода со старыми версиями Node.js.

::: tip
См. [https://github.com/nvm-sh/nvm](https://github.com/nvm-sh/nvm) для получения дополнительной информации об этой опции.
:::

В любом случае, когда Node.js установлен, у вас будет доступ к исполняемой программе node в командной строке.

