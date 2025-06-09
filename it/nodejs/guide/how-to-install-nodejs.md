---
title: Come installare Node.js
description: Scopri come installare Node.js utilizzando diversi gestori di pacchetti e metodi, tra cui nvm, fnm, Homebrew, Docker e altro.
head:
  - - meta
    - name: og:title
      content: Come installare Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Scopri come installare Node.js utilizzando diversi gestori di pacchetti e metodi, tra cui nvm, fnm, Homebrew, Docker e altro.
  - - meta
    - name: twitter:title
      content: Come installare Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Scopri come installare Node.js utilizzando diversi gestori di pacchetti e metodi, tra cui nvm, fnm, Homebrew, Docker e altro.
---


# Come installare Node.js

Node.js può essere installato in diversi modi. Questo articolo evidenzia quelli più comuni e convenienti. I pacchetti ufficiali per tutte le principali piattaforme sono disponibili su [https://nodejs.org/download/](https://nodejs.org/download/).

Un modo molto conveniente per installare Node.js è tramite un package manager. In questo caso, ogni sistema operativo ha il suo.
## installa con un package manager

su macOS, Linux e Windows, puoi installare in questo modo:

::: code-group
```bash [nvm]
# installa nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash

# scarica e installa Node.js (potrebbe essere necessario riavviare il terminale)
nvm install 20

# verifica che la versione corretta di Node.js sia nell'ambiente
node -v # dovrebbe stampare `v20.17.0`

# verifica che la versione corretta di npm sia nell'ambiente
npm -v # dovrebbe stampare `10.8.2`
```
```bash [fnm]
# installa fnm (Fast Node Manager)
curl -fsSL https://fnm.vercel.app/install | bash

# attiva fnm
source ~/.bashrc

# scarica e installa Node.js
fnm use --install-if-missing 20

# verifica che la versione corretta di Node.js sia nell'ambiente
node -v # dovrebbe stampare `v20.17.0`

# verifica che la versione corretta di npm sia nell'ambiente
npm -v # dovrebbe stampare `10.8.2`
```
```bash [Brew]
# NOTA:
# Homebrew non è un package manager di Node.js.
# Assicurati che sia già installato sul tuo sistema.
# Segui le istruzioni ufficiali su https://brew.sh/
# Homebrew supporta solo l'installazione delle versioni principali di Node.js e potrebbe non supportare l'ultima versione di Node.js dalla linea di rilascio 20.

# scarica e installa Node.js
brew install node@20

# verifica che la versione corretta di Node.js sia nell'ambiente
node -v # dovrebbe stampare `v20.17.0`

# verifica che la versione corretta di npm sia nell'ambiente
npm -v # dovrebbe stampare `10.8.2`
```
```bash [Docker]
# NOTA:
# Docker non è un package manager di Node.js.
# Assicurati che sia già installato sul tuo sistema.
# Segui le istruzioni ufficiali su https://docs.docker.com/desktop/
# Le immagini Docker sono fornite ufficialmente su https://github.com/nodejs/docker-node/

# scarica l'immagine Docker di Node.js
docker pull node:20-alpine

# verifica che la versione corretta di Node.js sia nell'ambiente
docker run node:20-alpine node -v # dovrebbe stampare `v20.17.0`

# verifica che la versione corretta di npm sia nell'ambiente
docker run node:20-alpine npm -v # dovrebbe stampare `10.8.2`
```
:::

su Windows, puoi installare in questo modo:

::: code-group
```bash [fnm]
# installa fnm (Fast Node Manager)
winget install Schniz.fnm

# configura l'ambiente fnm
fnm env --use-on-cd | Out-String | Invoke-Expression

# scarica e installa Node.js
fnm use --install-if-missing 20

# verifica che la versione corretta di Node.js sia nell'ambiente
node -v # dovrebbe stampare `v20.17.0`

# verifica che la versione corretta di npm sia nell'ambiente
npm -v # dovrebbe stampare `10.8.2`
```
```bash [Chocolatey]
# NOTA:
# Chocolatey non è un package manager di Node.js.
# Assicurati che sia già installato sul tuo sistema.
# Segui le istruzioni ufficiali su https://chocolatey.org/
# Chocolatey non è ufficialmente gestito dal progetto Node.js e potrebbe non supportare la versione v20.17.0 di Node.js

# scarica e installa Node.js
choco install nodejs-lts --version="20.17.0"

# verifica che la versione corretta di Node.js sia nell'ambiente
node -v # dovrebbe stampare `20`

# verifica che la versione corretta di npm sia nell'ambiente
npm -v # dovrebbe stampare `10.8.2`
```
```bash [Docker]
# NOTA:
# Docker non è un package manager di Node.js.
# Assicurati che sia già installato sul tuo sistema.
# Segui le istruzioni ufficiali su https://docs.docker.com/desktop/
# Le immagini Docker sono fornite ufficialmente su https://github.com/nodejs/docker-node/

# scarica l'immagine Docker di Node.js
docker pull node:20-alpine

# verifica che la versione corretta di Node.js sia nell'ambiente
docker run node:20-alpine node -v # dovrebbe stampare `v20.17.0`

# verifica che la versione corretta di npm sia nell'ambiente
docker run node:20-alpine npm -v # dovrebbe stampare `10.8.2`
```
:::

`nvm` è un modo popolare per eseguire Node.js. Ti consente di cambiare facilmente la versione di Node.js e installare nuove versioni per provare e fare facilmente il rollback se qualcosa si rompe. È anche molto utile per testare il tuo codice con vecchie versioni di Node.js.

::: tip
Vedi [https://github.com/nvm-sh/nvm](https://github.com/nvm-sh/nvm) per maggiori informazioni su questa opzione.
:::

In ogni caso, quando Node.js è installato avrai accesso al programma eseguibile node nella riga di comando.

