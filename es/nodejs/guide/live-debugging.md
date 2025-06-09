---
title: Depuración en vivo en Node.js
description: Aprende a depurar en vivo un proceso de Node.js para identificar y solucionar problemas con la lógica y la corrección de la aplicación.
head:
  - - meta
    - name: og:title
      content: Depuración en vivo en Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Aprende a depurar en vivo un proceso de Node.js para identificar y solucionar problemas con la lógica y la corrección de la aplicación.
  - - meta
    - name: twitter:title
      content: Depuración en vivo en Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Aprende a depurar en vivo un proceso de Node.js para identificar y solucionar problemas con la lógica y la corrección de la aplicación.
---


# Depuración en vivo

En este documento, puede aprender sobre cómo depurar en vivo un proceso de Node.js.

## Mi aplicación no se comporta como se espera

### Síntomas

El usuario puede observar que la aplicación no proporciona la salida esperada para ciertas entradas, por ejemplo, un servidor HTTP devuelve una respuesta JSON donde ciertos campos están vacíos. Varias cosas pueden salir mal en el proceso, pero en este caso de uso, nos centramos principalmente en la lógica de la aplicación y su corrección.

### Depuración

En este caso de uso, el usuario querría entender la ruta del código que ejecuta nuestra aplicación para un determinado disparador, como una solicitud HTTP entrante. También es posible que deseen recorrer el código y controlar la ejecución, así como inspeccionar qué valores tienen las variables en la memoria. Para este propósito, podemos usar el indicador `--inspect` al iniciar la aplicación. La documentación de depuración se puede encontrar [aquí](/es/nodejs/guide/debugging-nodejs).

