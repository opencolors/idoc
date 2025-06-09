---
title: Obtener entrada del usuario en Node.js
description: Aprenda a crear programas CLI de Node.js interactivos utilizando el módulo readline y el paquete Inquirer.js.
head:
  - - meta
    - name: og:title
      content: Obtener entrada del usuario en Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Aprenda a crear programas CLI de Node.js interactivos utilizando el módulo readline y el paquete Inquirer.js.
  - - meta
    - name: twitter:title
      content: Obtener entrada del usuario en Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Aprenda a crear programas CLI de Node.js interactivos utilizando el módulo readline y el paquete Inquirer.js.
---


# Aceptar entrada desde la línea de comandos en Node.js

¿Cómo hacer que un programa CLI de Node.js sea interactivo?

Node.js desde la versión 7 proporciona el módulo readline para realizar exactamente esto: obtener entrada de un flujo legible como el flujo `process.stdin`, que durante la ejecución de un programa Node.js es la entrada del terminal, una línea a la vez.

```javascript
const readline = require('node:readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.question("¿Cuál es tu nombre?", name => {
    console.log('¡Hola ' + name + '!');
    rl.close();
});
```

Este fragmento de código pregunta el nombre del usuario, y una vez que se introduce el texto y el usuario presiona enter, enviamos un saludo.

El método `question()` muestra el primer parámetro (una pregunta) y espera la entrada del usuario. Llama a la función de callback una vez que se presiona enter.

En esta función de callback, cerramos la interfaz readline.

`readline` ofrece varios otros métodos, por favor, consúltalos en la documentación del paquete enlazada arriba.

Si necesitas requerir una contraseña, es mejor no hacer eco de ella, sino mostrar un símbolo *.

La forma más sencilla es utilizar el paquete readline-sync que es muy similar en términos de la API y maneja esto de forma predeterminada. Una solución más completa y abstracta es proporcionada por el paquete Inquirer.js.

Puedes instalarlo usando `npm install inquirer`, y luego puedes replicar el código anterior así:

```javascript
const inquirer = require('inquirer');
const questions = [
    {
        type: 'input',
        name: 'name',
        message: "¿cuál es tu nombre?"
    }
];
inquirer.prompt(questions).then(answers => {
    console.log('¡Hola ' + answers.name + '!');
});
```

`Inquirer.js` te permite hacer muchas cosas como preguntar opciones múltiples, tener botones de radio, confirmaciones, y más.

Vale la pena conocer todas las alternativas, especialmente las integradas proporcionadas por Node.js, pero si planeas llevar la entrada CLI al siguiente nivel, `Inquirer.js` es una opción óptima.

