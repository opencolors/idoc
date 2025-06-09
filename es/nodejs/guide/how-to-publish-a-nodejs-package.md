---
title: Publicar un paquete Node-API
description: Aprenda a publicar una versión Node-API de un paquete junto con una versión no Node-API y cómo introducir una dependencia a una versión Node-API de un paquete.
head:
  - - meta
    - name: og:title
      content: Publicar un paquete Node-API | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Aprenda a publicar una versión Node-API de un paquete junto con una versión no Node-API y cómo introducir una dependencia a una versión Node-API de un paquete.
  - - meta
    - name: twitter:title
      content: Publicar un paquete Node-API | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Aprenda a publicar una versión Node-API de un paquete junto con una versión no Node-API y cómo introducir una dependencia a una versión Node-API de un paquete.
---


# Cómo publicar un paquete Node-API

## Cómo publicar una versión Node-API de un paquete junto con una versión no Node-API

Los siguientes pasos se ilustran usando el paquete `iotivity-node`:

- Primero, publique la versión no Node-API:
    - Actualice la versión en `package.json`. Para `iotivity-node`, la versión se convierte en 1.2.0-2.
    - Revise la lista de verificación de lanzamiento (asegúrese de que las pruebas/demos/documentos estén bien).
    - `npm publish`.

- Luego, publique la versión Node-API:
    - Actualice la versión en `package.json`. En el caso de `iotivity-node`, la versión se convierte en 1.2.0-3. Para el versionado, recomendamos seguir el esquema de versión preliminar como se describe en [semver.org](https://semver.org) por ejemplo, 1.2.0-napi.
    - Revise la lista de verificación de lanzamiento (asegúrese de que las pruebas/demos/documentos estén bien).
    - `npm publish --tag n-api`.

En este ejemplo, etiquetar el lanzamiento con `n-api` ha asegurado que, aunque la versión 1.2.0-3 sea posterior a la versión publicada no Node-APl (1.2.0-2), no se instalará si alguien elige instalar `iotivity-node` simplemente ejecutando `npm install iotivity-node`. Esto instalará la versión no Node-APl por defecto. El usuario tendrá que ejecutar `npm install iotivity-node@n api` para recibir la versión Node-APlI. Para obtener más información sobre el uso de etiquetas con npm, consulte "Using dist-tags".

## Cómo introducir una dependencia en una versión Node-API de un paquete

Para agregar la versión Node-API de `iotivity-node` como dependencia, el `package.json` se verá así:

```json
"dependencies": {
  "iotivity-node": "n-api"
}
```

Como se explica en "Using dist-tags", a diferencia de las versiones regulares, las versiones etiquetadas no se pueden abordar mediante rangos de versiones como `"^2.0.0"` dentro de `package.json`. La razón de esto es que la etiqueta se refiere exactamente a una versión. Por lo tanto, si el mantenedor del paquete elige etiquetar una versión posterior del paquete usando la misma etiqueta, `npm update` recibirá la versión posterior. Esto debería ser aceptable. Si se necesita otra versión que no sea la última publicada, la dependencia `package.json` tendrá que referirse a la versión exacta como la siguiente:

```json
"dependencies": {
  "iotivity-node": "1.2.0-3"
}
```
