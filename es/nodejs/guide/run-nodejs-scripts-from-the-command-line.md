---
title: Ejecutar scripts de Node.js desde la línea de comandos
description: Aprende a ejecutar programas de Node.js desde la línea de comandos, incluyendo el uso del comando node, líneas shebang, permisos de ejecución, pasar cadenas como argumentos y reiniciar automáticamente la aplicación.
head:
  - - meta
    - name: og:title
      content: Ejecutar scripts de Node.js desde la línea de comandos | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Aprende a ejecutar programas de Node.js desde la línea de comandos, incluyendo el uso del comando node, líneas shebang, permisos de ejecución, pasar cadenas como argumentos y reiniciar automáticamente la aplicación.
  - - meta
    - name: twitter:title
      content: Ejecutar scripts de Node.js desde la línea de comandos | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Aprende a ejecutar programas de Node.js desde la línea de comandos, incluyendo el uso del comando node, líneas shebang, permisos de ejecución, pasar cadenas como argumentos y reiniciar automáticamente la aplicación.
---


# Ejecutar scripts de Node.js desde la línea de comandos

La forma habitual de ejecutar un programa de Node.js es ejecutar el comando `node` disponible globalmente (una vez que instales Node.js) y pasar el nombre del archivo que deseas ejecutar.

Si tu archivo principal de aplicación Node.js es `app.js`, puedes llamarlo escribiendo:

```bash
node app.js
```

Arriba, estás indicando explícitamente al shell que ejecute tu script con `node`. También puedes incrustar esta información en tu archivo JavaScript con una línea "shebang". El "shebang" es la primera línea del archivo e indica al sistema operativo qué intérprete usar para ejecutar el script. A continuación, se muestra la primera línea de JavaScript:

```javascript
#!/usr/bin/node
```

Arriba, estamos dando explícitamente la ruta absoluta del intérprete. No todos los sistemas operativos tienen `node` en la carpeta `bin`, pero todos deberían tener `env`. Puedes indicarle al sistema operativo que ejecute `env` con `node` como parámetro:

```javascript
#!/usr/bin/env node
// your javascript code
```

## Para usar un shebang, tu archivo debe tener permiso de ejecución.

Puedes dar a `app.js` el permiso de ejecución ejecutando:

```bash
chmod u+x app.js
```

Mientras ejecutas el comando, asegúrate de estar en el mismo directorio que contiene el archivo `app.js`.

## Pasar una cadena como argumento a node en lugar de la ruta del archivo

Para ejecutar una cadena como argumento, puedes usar `-e`, `--eval "script"`. Evalúa el siguiente argumento como JavaScript. Los módulos que están predefinidos en el REPL también se pueden usar en el script. En Windows, usando `cmd.exe`, una comilla simple no funcionará correctamente porque solo reconoce las comillas dobles `"` para citar. En Powershell o Git bash, tanto `"` como `'` son utilizables.

```bash
node -e "console.log(123)"
```

## Reiniciar la aplicación automáticamente

A partir de nodejs V 16, hay una opción integrada para reiniciar automáticamente la aplicación cuando un archivo cambia. Esto es útil para fines de desarrollo. Para usar esta función, debes pasar el indicador `watch` a nodejs.

```bash
node --watch app.js
```

Entonces, cuando cambies el archivo, la aplicación se reiniciará automáticamente. Lee la documentación del indicador --watch [/api/cli#watch](https://nodejs.org/api/cli.html#--watch).

