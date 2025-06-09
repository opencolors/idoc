---
title: Como instalar Node.js
description: Saiba como instalar Node.js usando vários gerenciadores de pacotes e métodos, incluindo nvm, fnm, Homebrew, Docker e mais.
head:
  - - meta
    - name: og:title
      content: Como instalar Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Saiba como instalar Node.js usando vários gerenciadores de pacotes e métodos, incluindo nvm, fnm, Homebrew, Docker e mais.
  - - meta
    - name: twitter:title
      content: Como instalar Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Saiba como instalar Node.js usando vários gerenciadores de pacotes e métodos, incluindo nvm, fnm, Homebrew, Docker e mais.
---


# Como instalar o Node.js

O Node.js pode ser instalado de diferentes maneiras. Este post destaca as mais comuns e convenientes. Pacotes oficiais para todas as principais plataformas estão disponíveis em [https://nodejs.org/download/](https://nodejs.org/download/).

Uma maneira muito conveniente de instalar o Node.js é através de um gerenciador de pacotes. Neste caso, cada sistema operacional tem o seu.

## instalar com o gerenciador de pacotes

no macOS, Linux e Windows, você pode instalar assim:

::: code-group
```bash [nvm]
# instala o nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash

# baixa e instala o Node.js (pode ser necessário reiniciar o terminal)
nvm install 20

# verifica se a versão correta do Node.js está no ambiente
node -v # deve imprimir `v20.17.0`

# verifica se a versão correta do npm está no ambiente
npm -v # deve imprimir `10.8.2`
```
```bash [fnm]
# instala o fnm (Fast Node Manager)
curl -fsSL https://fnm.vercel.app/install | bash

# ativa o fnm
source ~/.bashrc

# baixa e instala o Node.js
fnm use --install-if-missing 20

# verifica se a versão correta do Node.js está no ambiente
node -v # deve imprimir `v20.17.0`

# verifica se a versão correta do npm está no ambiente
npm -v # deve imprimir `10.8.2`
```
```bash [Brew]
# NOTA:
# Homebrew não é um gerenciador de pacotes Node.js.
# Por favor, certifique-se de que já está instalado no seu sistema.
# Siga as instruções oficiais em https://brew.sh/
# Homebrew suporta apenas a instalação de versões principais do Node.js e pode não suportar a versão mais recente do Node.js da linha de lançamento 20.

# baixa e instala o Node.js
brew install node@20

# verifica se a versão correta do Node.js está no ambiente
node -v # deve imprimir `v20.17.0`

# verifica se a versão correta do npm está no ambiente
npm -v # deve imprimir `10.8.2`
```
```bash [Docker]
# NOTA:
# Docker não é um gerenciador de pacotes Node.js.
# Por favor, certifique-se de que já está instalado no seu sistema.
# Siga as instruções oficiais em https://docs.docker.com/desktop/
# As imagens Docker são fornecidas oficialmente em https://github.com/nodejs/docker-node/

# puxa a imagem Docker do Node.js
docker pull node:20-alpine

# verifica se a versão correta do Node.js está no ambiente
docker run node:20-alpine node -v # deve imprimir `v20.17.0`

# verifica se a versão correta do npm está no ambiente
docker run node:20-alpine npm -v # deve imprimir `10.8.2`
```
:::

no Windows, você pode instalar assim:

::: code-group
```bash [fnm]
# instala o fnm (Fast Node Manager)
winget install Schniz.fnm

# configura o ambiente fnm
fnm env --use-on-cd | Out-String | Invoke-Expression

# baixa e instala o Node.js
fnm use --install-if-missing 20

# verifica se a versão correta do Node.js está no ambiente
node -v # deve imprimir `v20.17.0`

# verifica se a versão correta do npm está no ambiente
npm -v # deve imprimir `10.8.2`
```
```bash [Chocolatey]
# NOTA:
# Chocolatey não é um gerenciador de pacotes Node.js.
# Por favor, certifique-se de que já está instalado no seu sistema.
# Siga as instruções oficiais em https://chocolatey.org/
# Chocolatey não é oficialmente mantido pelo projeto Node.js e pode não suportar a versão v20.17.0 do Node.js

# baixa e instala o Node.js
choco install nodejs-lts --version="20.17.0"

# verifica se a versão correta do Node.js está no ambiente
node -v # deve imprimir `20`

# verifica se a versão correta do npm está no ambiente
npm -v # deve imprimir `10.8.2`
```
```bash [Docker]
# NOTA:
# Docker não é um gerenciador de pacotes Node.js.
# Por favor, certifique-se de que já está instalado no seu sistema.
# Siga as instruções oficiais em https://docs.docker.com/desktop/
# As imagens Docker são fornecidas oficialmente em https://github.com/nodejs/docker-node/

# puxa a imagem Docker do Node.js
docker pull node:20-alpine

# verifica se a versão correta do Node.js está no ambiente
docker run node:20-alpine node -v # deve imprimir `v20.17.0`

# verifica se a versão correta do npm está no ambiente
docker run node:20-alpine npm -v # deve imprimir `10.8.2`
```
:::

`nvm` é uma maneira popular de executar o Node.js. Ele permite que você alterne facilmente a versão do Node.js e instale novas versões para experimentar e reverter facilmente se algo quebrar. Também é muito útil para testar seu código com versões antigas do Node.js.

::: tip
Veja [https://github.com/nvm-sh/nvm](https://github.com/nvm-sh/nvm) para obter mais informações sobre esta opção.
:::

Em qualquer caso, quando o Node.js é instalado, você terá acesso ao programa executável node na linha de comando.

