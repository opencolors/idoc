---
title: Comment installer Node.js
description: Découvrez comment installer Node.js à l'aide de différents gestionnaires de packages et méthodes, notamment nvm, fnm, Homebrew, Docker et plus encore.
head:
  - - meta
    - name: og:title
      content: Comment installer Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Découvrez comment installer Node.js à l'aide de différents gestionnaires de packages et méthodes, notamment nvm, fnm, Homebrew, Docker et plus encore.
  - - meta
    - name: twitter:title
      content: Comment installer Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Découvrez comment installer Node.js à l'aide de différents gestionnaires de packages et méthodes, notamment nvm, fnm, Homebrew, Docker et plus encore.
---


# Comment installer Node.js

Node.js peut être installé de différentes manières. Cet article met en évidence les méthodes les plus courantes et les plus pratiques. Les packages officiels pour toutes les principales plateformes sont disponibles sur [https://nodejs.org/download/](https://nodejs.org/download/).

Une façon très pratique d'installer Node.js est d'utiliser un gestionnaire de packages. Dans ce cas, chaque système d'exploitation a le sien.
## Installation avec un gestionnaire de packages

Sur macOS, Linux et Windows, vous pouvez installer comme ceci :

::: code-group
```bash [nvm]
# installe nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash

# télécharge et installe Node.js (vous devrez peut-être redémarrer le terminal)
nvm install 20

# vérifie que la bonne version de Node.js est dans l'environnement
node -v # devrait afficher `v20.17.0`

# vérifie que la bonne version de npm est dans l'environnement
npm -v # devrait afficher `10.8.2`
```
```bash [fnm]
# installe fnm (Fast Node Manager)
curl -fsSL https://fnm.vercel.app/install | bash

# active fnm
source ~/.bashrc

# télécharge et installe Node.js
fnm use --install-if-missing 20

# vérifie que la bonne version de Node.js est dans l'environnement
node -v # devrait afficher `v20.17.0`

# vérifie que la bonne version de npm est dans l'environnement
npm -v # devrait afficher `10.8.2`
```
```bash [Brew]
# NOTE :
# Homebrew n'est pas un gestionnaire de packages Node.js.
# Veuillez vous assurer qu'il est déjà installé sur votre système.
# Suivez les instructions officielles sur https://brew.sh/
# Homebrew prend uniquement en charge l'installation des versions principales de Node.js et pourrait ne pas prendre en charge la dernière version de Node.js de la branche 20.

# télécharge et installe Node.js
brew install node@20

# vérifie que la bonne version de Node.js est dans l'environnement
node -v # devrait afficher `v20.17.0`

# vérifie que la bonne version de npm est dans l'environnement
npm -v # devrait afficher `10.8.2`
```
```bash [Docker]
# NOTE :
# Docker n'est pas un gestionnaire de packages Node.js.
# Veuillez vous assurer qu'il est déjà installé sur votre système.
# Suivez les instructions officielles sur https://docs.docker.com/desktop/
# Les images Docker sont fournies officiellement sur https://github.com/nodejs/docker-node/

# extrait l'image Docker de Node.js
docker pull node:20-alpine

# vérifie que la bonne version de Node.js est dans l'environnement
docker run node:20-alpine node -v # devrait afficher `v20.17.0`

# vérifie que la bonne version de npm est dans l'environnement
docker run node:20-alpine npm -v # devrait afficher `10.8.2`
```
:::

Sur Windows, vous pouvez installer comme ceci :

::: code-group
```bash [fnm]
# installe fnm (Fast Node Manager)
winget install Schniz.fnm

# configure l'environnement fnm
fnm env --use-on-cd | Out-String | Invoke-Expression

# télécharge et installe Node.js
fnm use --install-if-missing 20

# vérifie que la bonne version de Node.js est dans l'environnement
node -v # devrait afficher `v20.17.0`

# vérifie que la bonne version de npm est dans l'environnement
npm -v # devrait afficher `10.8.2`
```
```bash [Chocolatey]
# NOTE :
# Chocolatey n'est pas un gestionnaire de packages Node.js.
# Veuillez vous assurer qu'il est déjà installé sur votre système.
# Suivez les instructions officielles sur https://chocolatey.org/
# Chocolatey n'est pas officiellement géré par le projet Node.js et pourrait ne pas prendre en charge la version 20.17.0 de Node.js

# télécharge et installe Node.js
choco install nodejs-lts --version="20.17.0"

# vérifie que la bonne version de Node.js est dans l'environnement
node -v # devrait afficher `20`

# vérifie que la bonne version de npm est dans l'environnement
npm -v # devrait afficher `10.8.2`
```
```bash [Docker]
# NOTE :
# Docker n'est pas un gestionnaire de packages Node.js.
# Veuillez vous assurer qu'il est déjà installé sur votre système.
# Suivez les instructions officielles sur https://docs.docker.com/desktop/
# Les images Docker sont fournies officiellement sur https://github.com/nodejs/docker-node/

# extrait l'image Docker de Node.js
docker pull node:20-alpine

# vérifie que la bonne version de Node.js est dans l'environnement
docker run node:20-alpine node -v # devrait afficher `v20.17.0`

# vérifie que la bonne version de npm est dans l'environnement
docker run node:20-alpine npm -v # devrait afficher `10.8.2`
```
:::

`nvm` est un moyen populaire d'exécuter Node.js. Il vous permet de changer facilement la version de Node.js, et d'installer de nouvelles versions pour essayer et revenir facilement en arrière si quelque chose casse. Il est également très utile pour tester votre code avec d'anciennes versions de Node.js.

::: tip
Voir [https://github.com/nvm-sh/nvm](https://github.com/nvm-sh/nvm) pour plus d'informations sur cette option.
:::

Dans tous les cas, lorsque Node.js est installé, vous aurez accès au programme exécutable node dans la ligne de commande.

