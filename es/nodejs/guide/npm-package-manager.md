---
title: Guía completa de npm, el gestor de paquetes de Node.js
description: Aprende a usar npm para gestionar dependencias, instalar y actualizar paquetes y ejecutar tareas en tus proyectos de Node.js.
head:
  - - meta
    - name: og:title
      content: Guía completa de npm, el gestor de paquetes de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Aprende a usar npm para gestionar dependencias, instalar y actualizar paquetes y ejecutar tareas en tus proyectos de Node.js.
  - - meta
    - name: twitter:title
      content: Guía completa de npm, el gestor de paquetes de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Aprende a usar npm para gestionar dependencias, instalar y actualizar paquetes y ejecutar tareas en tus proyectos de Node.js.
---


# Una introducción al administrador de paquetes npm

## Introducción a npm

`npm` es el administrador de paquetes estándar para Node.js.

En septiembre de 2022, se informó que había más de 2.1 millones de paquetes listados en el registro npm, lo que lo convierte en el repositorio de código de un solo idioma más grande del mundo, y puedes estar seguro de que hay un paquete para (¡casi!) todo.

Comenzó como una forma de descargar y administrar las dependencias de los paquetes de Node.js, pero desde entonces se ha convertido en una herramienta utilizada también en JavaScript frontend.

::: tip
`Yarn` y `pnpm` son alternativas a la CLI de npm. También puedes echarles un vistazo.
:::

## Paquetes

### Instalación de todas las dependencias

Puedes instalar todas las dependencias enumeradas en tu archivo `package.json` ejecutando:

```bash
npm install
```

instalará todo lo que necesita el proyecto, en la carpeta `node_modules`, creándola si aún no existe.

### Instalación de un solo paquete

Puedes instalar un solo paquete ejecutando:

```bash
npm install <nombre-del-paquete>
```

Además, desde npm 5, este comando agrega `<nombre-del-paquete>` a las dependencias del archivo `package.json`. Antes de la versión 5, era necesario agregar el flag `--save`.

A menudo verás más flags agregados a este comando:

+ `--save-dev` (o `-D`) que agrega el paquete a la sección `devDependencies` del archivo `package.json`.
+ `--no-save` que evita guardar el paquete en el archivo `package.json`.
+ `--no-optional` que evita la instalación de dependencias opcionales.
+ `--save-optional` que agrega el paquete a la sección `optionalDependencies` del archivo `package.json`.

También se pueden utilizar abreviaturas de los flags:

+ `-S`: `--save`
+ `-D`: `--save-dev`
+ `-O`: `--save-optional`

La diferencia entre devDependencies y dependencies es que la primera contiene herramientas de desarrollo, como una biblioteca de pruebas, mientras que la segunda se incluye con la aplicación en producción.

En cuanto a las optionalDependencies, la diferencia es que el fallo de compilación de la dependencia no provocará que la instalación falle. Pero es responsabilidad de tu programa manejar la falta de la dependencia. Lee más sobre [dependencias opcionales](https://docs.npmjs.com/cli/v10/using-npm/config#optional).


### Actualización de paquetes
La actualización también es fácil, ejecutando

```bash
npm update
```

Esto actualizará todas las dependencias a su última versión.

También puede especificar un solo paquete para actualizar:

```bash
npm update <nombre-del-paquete>
```

### Eliminación de paquetes

Para eliminar un paquete, puede ejecutar:

```bash
npm uninstall <nombre-del-paquete>
```

### Versionado
Además de las descargas simples, `npm` también gestiona el versionado, por lo que puede especificar cualquier versión específica de un paquete o requerir una versión superior o inferior a la que necesita.

Muchas veces encontrará que una biblioteca solo es compatible con una versión principal de otra biblioteca.

O un error en la última versión de una biblioteca, aún sin corregir, está causando un problema.

Especificar una versión explícita de una biblioteca también ayuda a mantener a todos en la misma versión exacta de un paquete, para que todo el equipo ejecute la misma versión hasta que se actualice el archivo `package.json`.

En todos esos casos, el versionado ayuda mucho, y `npm` sigue el estándar de [versionado semántico (semver)](https://semver.org/lang/es/).

Puede instalar una versión específica de un paquete, ejecutando

```bash
npm install <nombre-del-paquete>@<versión>
```

También puede instalar la última versión de un paquete, ejecutando

```bash
npm install <nombre-del-paquete>@latest
```

### Ejecución de tareas
El archivo package.json admite un formato para especificar tareas de línea de comandos que se pueden ejecutar usando

```bash
npm run <nombre-de-la-tarea>
```

Por ejemplo, si tiene un archivo package.json con el siguiente contenido:

```json
{
  "scripts": {
    "start": "node index.js",
    "test": "jest"
  }
}
```

Es muy común usar esta función para ejecutar Webpack:

```json
{
  "scripts": {
    "watch": "webpack --watch --progress --colors --config webpack.conf.js",
    "dev": "webpack --progress --colors --config webpack.conf.js",
    "prod": "NODE_ENV=production webpack -p --config webpack.conf.js"
  }
}
```

Así que en lugar de escribir esos comandos largos, que son fáciles de olvidar o escribir mal, puede ejecutar

```bash
npm run watch
npm run dev
npm run prod
```

