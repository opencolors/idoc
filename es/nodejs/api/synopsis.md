---
title: Documentación de Node.js - Sinopsis
description: Una visión general de Node.js, detallando su arquitectura asincrónica basada en eventos, módulos principales y cómo empezar con el desarrollo en Node.js.
head:
  - - meta
    - name: og:title
      content: Documentación de Node.js - Sinopsis | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Una visión general de Node.js, detallando su arquitectura asincrónica basada en eventos, módulos principales y cómo empezar con el desarrollo en Node.js.
  - - meta
    - name: twitter:title
      content: Documentación de Node.js - Sinopsis | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Una visión general de Node.js, detallando su arquitectura asincrónica basada en eventos, módulos principales y cómo empezar con el desarrollo en Node.js.
---


# Uso y ejemplo {#usage-and-example}

## Uso {#usage}

`node [opciones] [opciones V8] [script.js | -e "script" | - ] [argumentos]`

Consulte el documento [Opciones de línea de comandos](/es/nodejs/api/cli#options) para obtener más información.

## Ejemplo {#example}

Un ejemplo de un [servidor web](/es/nodejs/api/http) escrito con Node.js que responde con `'¡Hola, Mundo!'`:

Los comandos en este documento comienzan con `$` o `\>` para replicar cómo aparecerían en la terminal de un usuario. No incluya los caracteres `$` y `\>`. Están ahí para mostrar el comienzo de cada comando.

Las líneas que no comienzan con el carácter `$` o `\>` muestran la salida del comando anterior.

Primero, asegúrese de haber descargado e instalado Node.js. Consulte [Instalación de Node.js a través del administrador de paquetes](https://nodejs.org/en/download/package-manager/) para obtener más información sobre la instalación.

Ahora, cree una carpeta de proyecto vacía llamada `projects`, luego navegue hacia ella.

Linux y Mac:

```bash [BASH]
mkdir ~/projects
cd ~/projects
```
Windows CMD:

```bash [BASH]
mkdir %USERPROFILE%\projects
cd %USERPROFILE%\projects
```
Windows PowerShell:

```bash [BASH]
mkdir $env:USERPROFILE\projects
cd $env:USERPROFILE\projects
```
A continuación, cree un nuevo archivo fuente en la carpeta `projects` y llámelo `hello-world.js`.

Abra `hello-world.js` en cualquier editor de texto preferido y pegue el siguiente contenido:

```js [ESM]
const http = require('node:http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World!\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```
Guarde el archivo. Luego, en la ventana de la terminal, para ejecutar el archivo `hello-world.js`, ingrese:

```bash [BASH]
node hello-world.js
```
Una salida como esta debería aparecer en la terminal:

```bash [BASH]
Server running at http://127.0.0.1:3000/
```
Ahora, abra cualquier navegador web preferido y visite `http://127.0.0.1:3000`.

Si el navegador muestra la cadena `Hello, World!`, eso indica que el servidor está funcionando.

