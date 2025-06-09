---
title: Cómo leer variables de entorno en Node.js
description: Aprenda a acceder a las variables de entorno en Node.js utilizando la propiedad process.env y archivos .env.
head:
  - - meta
    - name: og:title
      content: Cómo leer variables de entorno en Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Aprenda a acceder a las variables de entorno en Node.js utilizando la propiedad process.env y archivos .env.
  - - meta
    - name: twitter:title
      content: Cómo leer variables de entorno en Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Aprenda a acceder a las variables de entorno en Node.js utilizando la propiedad process.env y archivos .env.
---


# Cómo leer variables de entorno desde Node.js

El módulo central `process` de Node.js proporciona la propiedad `env` que alberga todas las variables de entorno que se establecieron en el momento en que se inició el proceso.

El siguiente código ejecuta `app.js` y establece `USER_ID` y `USER_KEY`.

```bash
USER_ID=239482 USER_KEY=foobar node app.js
```

Eso pasará el usuario `USER_ID` como 239482 y la `USER_KEY` como foobar. Esto es adecuado para pruebas, sin embargo, para producción, probablemente estará configurando algunos scripts bash para exportar variables.

::: tip NOTA
`process` no requiere un `"require"`, está disponible automáticamente.
:::

Aquí hay un ejemplo que accede a las variables de entorno `USER_ID` y `USER_KEY`, que establecimos en el código anterior.

```javascript
process.env.USER_ID; // "239482
process.env.USER_KEY; // "foobar
```

De la misma manera, puede acceder a cualquier variable de entorno personalizada que establezca. Node.js 20 introdujo soporte experimental para [archivos .env](/es/nodejs/api/cli#env-file-config).

Ahora, puede usar la bandera `--env-file` para especificar un archivo de entorno al ejecutar su aplicación Node.js. Aquí hay un ejemplo de archivo `.env` y cómo acceder a sus variables usando `process.env`.

```bash
.env archivo
PORT=3000
```

En su archivo js

```javascript
process.env.PORT; // 3000
```

Ejecute el archivo `app.js` con las variables de entorno establecidas en el archivo `.env`.

```js
node --env-file=.env app.js
```

Este comando carga todas las variables de entorno del archivo `.env`, haciéndolas disponibles para la aplicación en `process.env`. Además, puede pasar múltiples argumentos --env-file. Los archivos posteriores sobrescriben las variables preexistentes definidas en archivos anteriores.

```bash
node --env-file=.env --env-file=.development.env app.js
```
::: tip NOTA
si la misma variable se define en el entorno y en el archivo, el valor del entorno tiene prioridad.
:::

