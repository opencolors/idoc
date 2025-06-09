---
title: Wie man Node.js installiert
description: Erfahren Sie, wie Sie Node.js mithilfe verschiedener Paketmanager und Methoden installieren, einschließlich nvm, fnm, Homebrew, Docker und mehr.
head:
  - - meta
    - name: og:title
      content: Wie man Node.js installiert | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Erfahren Sie, wie Sie Node.js mithilfe verschiedener Paketmanager und Methoden installieren, einschließlich nvm, fnm, Homebrew, Docker und mehr.
  - - meta
    - name: twitter:title
      content: Wie man Node.js installiert | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Erfahren Sie, wie Sie Node.js mithilfe verschiedener Paketmanager und Methoden installieren, einschließlich nvm, fnm, Homebrew, Docker und mehr.
---


# Wie man Node.js installiert

Node.js kann auf verschiedene Arten installiert werden. Dieser Beitrag beleuchtet die gebräuchlichsten und bequemsten Methoden. Offizielle Pakete für alle wichtigen Plattformen sind unter [https://nodejs.org/download/](https://nodejs.org/download/) verfügbar.

Eine sehr bequeme Möglichkeit, Node.js zu installieren, ist über einen Paketmanager. In diesem Fall hat jedes Betriebssystem seinen eigenen.
## Installation mit einem Paketmanager

Unter macOS, Linux und Windows können Sie wie folgt installieren:

::: code-group
```bash [nvm]
# installiert nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash

# lädt Node.js herunter und installiert es (möglicherweise muss das Terminal neu gestartet werden)
nvm install 20

# überprüft, ob die richtige Node.js-Version in der Umgebung vorhanden ist
node -v # sollte `v20.17.0` ausgeben

# überprüft, ob die richtige npm-Version in der Umgebung vorhanden ist
npm -v # sollte `10.8.2` ausgeben
```
```bash [fnm]
# installiert fnm (Fast Node Manager)
curl -fsSL https://fnm.vercel.app/install | bash

# aktiviert fnm
source ~/.bashrc

# lädt Node.js herunter und installiert es
fnm use --install-if-missing 20

# überprüft, ob die richtige Node.js-Version in der Umgebung vorhanden ist
node -v # sollte `v20.17.0` ausgeben

# überprüft, ob die richtige npm-Version in der Umgebung vorhanden ist
npm -v # sollte `10.8.2` ausgeben
```
```bash [Brew]
# HINWEIS:
# Homebrew ist kein Node.js-Paketmanager.
# Bitte stellen Sie sicher, dass es bereits auf Ihrem System installiert ist.
# Befolgen Sie die offiziellen Anweisungen unter https://brew.sh/
# Homebrew unterstützt nur die Installation von Node.js-Hauptversionen und unterstützt möglicherweise nicht die neueste Node.js-Version aus der 20er-Release-Linie.

# lädt Node.js herunter und installiert es
brew install node@20

# überprüft, ob die richtige Node.js-Version in der Umgebung vorhanden ist
node -v # sollte `v20.17.0` ausgeben

# überprüft, ob die richtige npm-Version in der Umgebung vorhanden ist
npm -v # sollte `10.8.2` ausgeben
```
```bash [Docker]
# HINWEIS:
# Docker ist kein Node.js-Paketmanager.
# Bitte stellen Sie sicher, dass es bereits auf Ihrem System installiert ist.
# Befolgen Sie die offiziellen Anweisungen unter https://docs.docker.com/desktop/
# Docker-Images werden offiziell unter https://github.com/nodejs/docker-node/ bereitgestellt.

# zieht das Node.js-Docker-Image
docker pull node:20-alpine

# überprüft, ob die richtige Node.js-Version in der Umgebung vorhanden ist
docker run node:20-alpine node -v # sollte `v20.17.0` ausgeben

# überprüft, ob die richtige npm-Version in der Umgebung vorhanden ist
docker run node:20-alpine npm -v # sollte `10.8.2` ausgeben
```
:::

Unter Windows können Sie wie folgt installieren:

::: code-group
```bash [fnm]
# installiert fnm (Fast Node Manager)
winget install Schniz.fnm

# konfiguriert die fnm-Umgebung
fnm env --use-on-cd | Out-String | Invoke-Expression

# lädt Node.js herunter und installiert es
fnm use --install-if-missing 20

# überprüft, ob die richtige Node.js-Version in der Umgebung vorhanden ist
node -v # sollte `v20.17.0` ausgeben

# überprüft, ob die richtige npm-Version in der Umgebung vorhanden ist
npm -v # sollte `10.8.2` ausgeben
```
```bash [Chocolatey]
# HINWEIS:
# Chocolatey ist kein Node.js-Paketmanager.
# Bitte stellen Sie sicher, dass es bereits auf Ihrem System installiert ist.
# Befolgen Sie die offiziellen Anweisungen unter https://chocolatey.org/
# Chocolatey wird nicht offiziell vom Node.js-Projekt verwaltet und unterstützt möglicherweise nicht die Version v20.17.0 von Node.js

# lädt Node.js herunter und installiert es
choco install nodejs-lts --version="20.17.0"

# überprüft, ob die richtige Node.js-Version in der Umgebung vorhanden ist
node -v # sollte `20` ausgeben

# überprüft, ob die richtige npm-Version in der Umgebung vorhanden ist
npm -v # sollte `10.8.2` ausgeben
```
```bash [Docker]
# HINWEIS:
# Docker ist kein Node.js-Paketmanager.
# Bitte stellen Sie sicher, dass es bereits auf Ihrem System installiert ist.
# Befolgen Sie die offiziellen Anweisungen unter https://docs.docker.com/desktop/
# Docker-Images werden offiziell unter https://github.com/nodejs/docker-node/ bereitgestellt.

# zieht das Node.js-Docker-Image
docker pull node:20-alpine

# überprüft, ob die richtige Node.js-Version in der Umgebung vorhanden ist
docker run node:20-alpine node -v # sollte `v20.17.0` ausgeben

# überprüft, ob die richtige npm-Version in der Umgebung vorhanden ist
docker run node:20-alpine npm -v # sollte `10.8.2` ausgeben
```
:::

`nvm` ist eine beliebte Methode zum Ausführen von Node.js. Es ermöglicht Ihnen, die Node.js-Version einfach zu wechseln und neue Versionen zu installieren, um sie auszuprobieren und einfach ein Rollback durchzuführen, falls etwas kaputt geht. Es ist auch sehr nützlich, um Ihren Code mit alten Node.js-Versionen zu testen.

::: tip
Weitere Informationen zu dieser Option finden Sie unter [https://github.com/nvm-sh/nvm](https://github.com/nvm-sh/nvm).
:::

In jedem Fall haben Sie nach der Installation von Node.js Zugriff auf das ausführbare Node-Programm in der Befehlszeile.
