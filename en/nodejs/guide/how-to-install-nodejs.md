---
title: How to Install Node.js
description: Learn how to install Node.js using various package managers and methods, including nvm, fnm, Homebrew, Docker, and more.
head:
  - - meta
    - name: og:title
      content: How to Install Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Learn how to install Node.js using various package managers and methods, including nvm, fnm, Homebrew, Docker, and more.
  - - meta
    - name: twitter:title
      content: How to Install Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Learn how to install Node.js using various package managers and methods, including nvm, fnm, Homebrew, Docker, and more.
---


# How to install Node.js

Node.js can be installed in different ways. This post highlights the most common and convenient ones. Official packages for all the major platforms are available at [https://nodejs.org/download/](https://nodejs.org/download/).

One very convenient way to install Node.js is through a package manager. In this case, every operating system has its own. 
## install with package manager

on macOS, Linux, and Windows, you can install like this:

::: code-group
```bash [nvm]
# installs nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash

# download and install Node.js (you may need to restart the terminal)
nvm install 20

# verifies the right Node.js version is in the environment
node -v # should print `v20.17.0`

# verifies the right npm version is in the environment
npm -v # should print `10.8.2`
```
```bash [fnm]
# installs fnm (Fast Node Manager)
curl -fsSL https://fnm.vercel.app/install | bash

# activate fnm
source ~/.bashrc

# download and install Node.js
fnm use --install-if-missing 20

# verifies the right Node.js version is in the environment
node -v # should print `v20.17.0`

# verifies the right npm version is in the environment
npm -v # should print `10.8.2`
```
```bash [Brew]
# NOTE:
# Homebrew is not a Node.js package manager.
# Please ensure it is already installed on your system.
# Follow official instructions at https://brew.sh/
# Homebrew only supports installing major Node.js versions and might not support the latest Node.js version from the 20 release line.

# download and install Node.js
brew install node@20

# verifies the right Node.js version is in the environment
node -v # should print `v20.17.0`

# verifies the right npm version is in the environment
npm -v # should print `10.8.2`
```
```bash [Docker]
# NOTE:
# Docker is not a Node.js package manager.
# Please ensure it is already installed on your system.
# Follow official instructions at https://docs.docker.com/desktop/
# Docker images are provided officially at https://github.com/nodejs/docker-node/

# pulls the Node.js Docker image
docker pull node:20-alpine

# verifies the right Node.js version is in the environment
docker run node:20-alpine node -v # should print `v20.17.0`

# verifies the right npm version is in the environment
docker run node:20-alpine npm -v # should print `10.8.2`
```
:::

on Windows, you can install like this:

::: code-group
```bash [fnm]
# installs fnm (Fast Node Manager)
winget install Schniz.fnm

# configure fnm environment
fnm env --use-on-cd | Out-String | Invoke-Expression

# download and install Node.js
fnm use --install-if-missing 20

# verifies the right Node.js version is in the environment
node -v # should print `v20.17.0`

# verifies the right npm version is in the environment
npm -v # should print `10.8.2`
```
```bash [Chocolatey]
# NOTE:
# Chocolatey is not a Node.js package manager.
# Please ensure it is already installed on your system.
# Follow official instructions at https://chocolatey.org/
# Chocolatey is not officially maintained by the Node.js project and might not support the v20.17.0 version of Node.js

# download and install Node.js
choco install nodejs-lts --version="20.17.0"

# verifies the right Node.js version is in the environment
node -v # should print `20`

# verifies the right npm version is in the environment
npm -v # should print `10.8.2`
```
```bash [Docker]
# NOTE:
# Docker is not a Node.js package manager.
# Please ensure it is already installed on your system.
# Follow official instructions at https://docs.docker.com/desktop/
# Docker images are provided officially at https://github.com/nodejs/docker-node/

# pulls the Node.js Docker image
docker pull node:20-alpine

# verifies the right Node.js version is in the environment
docker run node:20-alpine node -v # should print `v20.17.0`

# verifies the right npm version is in the environment
docker run node:20-alpine npm -v # should print `10.8.2`
```
:::

`nvm` is a popular way to run Node.js. It allows you to easily switch the Node.js version, and install new versions to try and easily rollback if something breaks. It is also very useful to test your code with old Node.js versions.

::: tip
See [https://github.com/nvm-sh/nvm](https://github.com/nvm-sh/nvm) for more information about this option.
:::

In any case, when Node.js is installed you'll have access to the node executable program in the command line.