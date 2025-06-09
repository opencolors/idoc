---
title: Cómo usar el REPL de Node.js
description: Aprende a usar el REPL de Node.js para probar rápidamente código JavaScript simple y explorar sus características, incluyendo el modo multilínea, variables especiales y comandos de punto.
head:
  - - meta
    - name: og:title
      content: Cómo usar el REPL de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Aprende a usar el REPL de Node.js para probar rápidamente código JavaScript simple y explorar sus características, incluyendo el modo multilínea, variables especiales y comandos de punto.
  - - meta
    - name: twitter:title
      content: Cómo usar el REPL de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Aprende a usar el REPL de Node.js para probar rápidamente código JavaScript simple y explorar sus características, incluyendo el modo multilínea, variables especiales y comandos de punto.
---


# Cómo usar el REPL de Node.js

El comando `node` es el que usamos para ejecutar nuestros scripts de Node.js:

```bash
node script.js
```

Si ejecutamos el comando `node` sin ningún script para ejecutar o sin ningún argumento, iniciamos una sesión REPL:

```bash
node
```

::: tip NOTA
REPL significa Read Evaluate Print Loop (Leer, Evaluar, Imprimir, Bucle), y es un entorno de lenguaje de programación (básicamente una ventana de consola) que toma una sola expresión como entrada del usuario y devuelve el resultado a la consola después de la ejecución. La sesión REPL proporciona una forma conveniente de probar rápidamente código JavaScript simple.
:::

Si lo pruebas ahora en tu terminal, esto es lo que sucede:

```bash
> node
>
```

El comando permanece en modo inactivo y espera a que ingresemos algo.

::: tip
si no está seguro de cómo abrir su terminal, busque en Google "Cómo abrir la terminal en su-sistema-operativo".
:::

El REPL está esperando que ingresemos código JavaScript, para ser más precisos.

Comienza de forma sencilla e ingresa:

```bash
> console.log('test')
test
undefined
>
```

El primer valor, `test`, es la salida que le dijimos a la consola que imprimiera, luego obtenemos `undefined`, que es el valor de retorno de la ejecución de `console.log()`. Node leyó esta línea de código, la evaluó, imprimió el resultado y luego volvió a esperar más líneas de código. Node recorrerá estos tres pasos para cada fragmento de código que ejecutemos en el REPL hasta que salgamos de la sesión. Ahí es donde el REPL obtuvo su nombre.

Node imprime automáticamente el resultado de cualquier línea de código JavaScript sin la necesidad de indicarle que lo haga. Por ejemplo, escriba la siguiente línea y presione enter:

```bash
> 5==5
true
>
```

Ten en cuenta la diferencia en las salidas de las dos líneas anteriores. El REPL de Node imprimió `undefined` después de ejecutar `console.log()`, mientras que, por otro lado, simplemente imprimió el resultado de `5 == 5`. Debes tener en cuenta que lo primero es solo una declaración en JavaScript y lo segundo es una expresión.

En algunos casos, el código que desea probar puede necesitar varias líneas. Por ejemplo, digamos que desea definir una función que genere un número aleatorio, en la sesión REPL escriba la siguiente línea y presione enter:

```javascript
function generateRandom()
...
```

El REPL de Node es lo suficientemente inteligente como para determinar que aún no ha terminado de escribir su código y entrará en un modo de varias líneas para que pueda escribir más código. Ahora termine la definición de su función y presione enter:

```javascript
function generateRandom()
...return Math.random()
```


### La variable especial:

Si después de algún código escribes `_`, eso imprimirá el resultado de la última operación.

### La tecla de flecha hacia arriba:

Si presionas la tecla de flecha hacia arriba, tendrás acceso al historial de las líneas de código anteriores ejecutadas en la sesión REPL actual, e incluso en sesiones anteriores.

## Comandos con punto

El REPL tiene algunos comandos especiales, todos comenzando con un punto `.`. Ellos son:
- `.help`: muestra la ayuda de los comandos con punto.
- `.editor`: habilita el modo editor, para escribir código JavaScript de múltiples líneas con facilidad. Una vez que estés en este modo, introduce `ctrl-D` para ejecutar el código que escribiste.
- `.break`: cuando se introduce una expresión de múltiples líneas, ingresar el comando `.break` abortará la entrada posterior. Igual que presionar `ctrl-C`.
- `.clear`: restablece el contexto REPL a un objeto vacío y borra cualquier expresión de múltiples líneas que se esté ingresando actualmente.
- `.1oad`: carga un archivo JavaScript, relativo al directorio de trabajo actual.
- `.save`: guarda todo lo que ingresaste en la sesión REPL en un archivo (especifica el nombre del archivo).
- `.exit`: sale del REPL (igual que presionar `ctrl-C` dos veces).

El REPL sabe cuándo estás escribiendo una declaración de múltiples líneas sin la necesidad de invocar `.editor`. Por ejemplo, si comienzas a escribir una iteración como esta:
```javascript
[1, 2,3].foxEach(num=>{
```
y presionas enter, el REPL irá a una nueva línea que comienza con 3 puntos, indicando que ahora puedes continuar trabajando en ese bloque.
```javascript
1... console.log (num)
2...}
```

Si escribes `.break` al final de una línea, el modo multilínea se detendrá y la declaración no se ejecutará.

## Ejecutar REPL desde un archivo JavaScript

Podemos importar el REPL en un archivo JavaScript usando `repl`.
```javascript
const repl = require('node:repl');
```

Usando la variable `repl` podemos realizar varias operaciones. Para iniciar el indicador de comandos REPL, escribe la siguiente línea:
```javascript
repl.start();
```

Ejecuta el archivo en la línea de comandos.
```bash
node repl.js
```

Puedes pasar una cadena que se muestre cuando se inicia el REPL. El valor predeterminado es '>' (con un espacio al final), pero podemos definir un mensaje personalizado.
```javascript
// un mensaje de estilo Unix
const local = repl.start('$ ');
```

Puedes mostrar un mensaje al salir del REPL

```javascript
local.on('exit', () => {
  console.log('saliendo de repl');
  process.exit();
});
```

Puedes leer más sobre el módulo REPL en la [documentación de repl](/es/nodejs/api/repl).

