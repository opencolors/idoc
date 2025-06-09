---
title: Cómo instalar Node.js
description: Aprenda a instalar Node.js utilizando varios administradores de paquetes y métodos, incluyendo nvm, fnm, Homebrew, Docker y más.
head:
  - - meta
    - name: og:title
      content: Cómo instalar Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Aprenda a instalar Node.js utilizando varios administradores de paquetes y métodos, incluyendo nvm, fnm, Homebrew, Docker y más.
  - - meta
    - name: twitter:title
      content: Cómo instalar Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Aprenda a instalar Node.js utilizando varios administradores de paquetes y métodos, incluyendo nvm, fnm, Homebrew, Docker y más.
---


# Cómo instalar Node.js

Node.js se puede instalar de diferentes maneras. Esta publicación destaca las más comunes y convenientes. Los paquetes oficiales para todas las principales plataformas están disponibles en [https://nodejs.org/download/](https://nodejs.org/download/).

Una forma muy conveniente de instalar Node.js es a través de un administrador de paquetes. En este caso, cada sistema operativo tiene el suyo propio.
## Instalar con el administrador de paquetes

En macOS, Linux y Windows, puede instalarlo así:

::: code-group
```bash [nvm]
# instala nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash

# descarga e instala Node.js (es posible que deba reiniciar la terminal)
nvm install 20

# verifica que la versión correcta de Node.js esté en el entorno
node -v # debería imprimir `v20.17.0`

# verifica que la versión correcta de npm esté en el entorno
npm -v # debería imprimir `10.8.2`
```
```bash [fnm]
# instala fnm (Fast Node Manager)
curl -fsSL https://fnm.vercel.app/install | bash

# activa fnm
source ~/.bashrc

# descarga e instala Node.js
fnm use --install-if-missing 20

# verifica que la versión correcta de Node.js esté en el entorno
node -v # debería imprimir `v20.17.0`

# verifica que la versión correcta de npm esté en el entorno
npm -v # debería imprimir `10.8.2`
```
```bash [Brew]
# NOTA:
# Homebrew no es un administrador de paquetes de Node.js.
# Asegúrese de que ya esté instalado en su sistema.
# Siga las instrucciones oficiales en https://brew.sh/
# Homebrew solo admite la instalación de versiones principales de Node.js y es posible que no admita la última versión de Node.js de la línea de lanzamiento 20.

# descarga e instala Node.js
brew install node@20

# verifica que la versión correcta de Node.js esté en el entorno
node -v # debería imprimir `v20.17.0`

# verifica que la versión correcta de npm esté en el entorno
npm -v # debería imprimir `10.8.2`
```
```bash [Docker]
# NOTA:
# Docker no es un administrador de paquetes de Node.js.
# Asegúrese de que ya esté instalado en su sistema.
# Siga las instrucciones oficiales en https://docs.docker.com/desktop/
# Las imágenes de Docker se proporcionan oficialmente en https://github.com/nodejs/docker-node/

# extrae la imagen de Docker de Node.js
docker pull node:20-alpine

# verifica que la versión correcta de Node.js esté en el entorno
docker run node:20-alpine node -v # debería imprimir `v20.17.0`

# verifica que la versión correcta de npm esté en el entorno
docker run node:20-alpine npm -v # debería imprimir `10.8.2`
```
:::

En Windows, puede instalarlo así:

::: code-group
```bash [fnm]
# instala fnm (Fast Node Manager)
winget install Schniz.fnm

# configure fnm environment
fnm env --use-on-cd | Out-String | Invoke-Expression

# descarga e instala Node.js
fnm use --install-if-missing 20

# verifica que la versión correcta de Node.js esté en el entorno
node -v # debería imprimir `v20.17.0`

# verifica que la versión correcta de npm esté en el entorno
npm -v # debería imprimir `10.8.2`
```
```bash [Chocolatey]
# NOTA:
# Chocolatey no es un administrador de paquetes de Node.js.
# Asegúrese de que ya esté instalado en su sistema.
# Siga las instrucciones oficiales en https://chocolatey.org/
# Chocolatey no está mantenido oficialmente por el proyecto Node.js y es posible que no sea compatible con la versión v20.17.0 de Node.js

# descarga e instala Node.js
choco install nodejs-lts --version="20.17.0"

# verifica que la versión correcta de Node.js esté en el entorno
node -v # debería imprimir `20`

# verifica que la versión correcta de npm esté en el entorno
npm -v # debería imprimir `10.8.2`
```
```bash [Docker]
# NOTA:
# Docker no es un administrador de paquetes de Node.js.
# Asegúrese de que ya esté instalado en su sistema.
# Siga las instrucciones oficiales en https://docs.docker.com/desktop/
# Las imágenes de Docker se proporcionan oficialmente en https://github.com/nodejs/docker-node/

# extrae la imagen de Docker de Node.js
docker pull node:20-alpine

# verifica que la versión correcta de Node.js esté en el entorno
docker run node:20-alpine node -v # debería imprimir `v20.17.0`

# verifica que la versión correcta de npm esté en el entorno
docker run node:20-alpine npm -v # debería imprimir `10.8.2`
```
:::

`nvm` es una forma popular de ejecutar Node.js. Le permite cambiar fácilmente la versión de Node.js e instalar nuevas versiones para probar y revertir fácilmente si algo se rompe. También es muy útil para probar su código con versiones antiguas de Node.js.

::: tip
Consulte [https://github.com/nvm-sh/nvm](https://github.com/nvm-sh/nvm) para obtener más información sobre esta opción.
:::

En cualquier caso, cuando Node.js está instalado, tendrá acceso al programa ejecutable de nodo en la línea de comandos.

