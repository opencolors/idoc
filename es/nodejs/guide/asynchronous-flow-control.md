---
title: Control de flujo asíncrono en JavaScript
description: Entender el control de flujo asíncrono en JavaScript, incluyendo callbacks, gestión de estado y patrones de flujo de control.
head:
  - - meta
    - name: og:title
      content: Control de flujo asíncrono en JavaScript | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Entender el control de flujo asíncrono en JavaScript, incluyendo callbacks, gestión de estado y patrones de flujo de control.
  - - meta
    - name: twitter:title
      content: Control de flujo asíncrono en JavaScript | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Entender el control de flujo asíncrono en JavaScript, incluyendo callbacks, gestión de estado y patrones de flujo de control.
---


# Control de flujo asíncrono

::: info
El material de esta publicación está fuertemente inspirado en [Mixu's Node.js Book](http://book.mixu.net/node/ch7.html).
:::

En esencia, JavaScript está diseñado para no bloquear el hilo "principal", que es donde se renderizan las vistas. Puedes imaginar la importancia de esto en el navegador. Cuando el hilo principal se bloquea, se produce la infame "congelación" que los usuarios finales temen, y no se pueden enviar otros eventos, lo que resulta en la pérdida de adquisición de datos, por ejemplo.

Esto crea algunas limitaciones únicas que solo un estilo de programación funcional puede curar. Aquí es donde las devoluciones de llamada entran en escena.

Sin embargo, las devoluciones de llamada pueden ser difíciles de manejar en procedimientos más complicados. Esto a menudo resulta en el "infierno de las devoluciones de llamada", donde múltiples funciones anidadas con devoluciones de llamada hacen que el código sea más difícil de leer, depurar, organizar, etc.

```js
async1(function (input, result1) {
  async2(function (result2) {
    async3(function (result3) {
      async4(function (result4) {
        async5(function (output) {
          // hacer algo con la salida
        });
      });
    });
  });
});
```

Por supuesto, en la vida real, lo más probable es que haya líneas de código adicionales para manejar `result1`, `result2`, etc., por lo que la longitud y la complejidad de este problema generalmente resultan en un código que se ve mucho más desordenado que el ejemplo anterior.

**Aquí es donde las funciones son de gran utilidad. Las operaciones más complejas se componen de muchas funciones:**

1. estilo de iniciador / entrada
2. middleware
3. terminador

**El "estilo de iniciador / entrada" es la primera función en la secuencia. Esta función aceptará la entrada original, si la hay, para la operación. La operación es una serie ejecutable de funciones, y la entrada original será principalmente:**

1. variables en un entorno global
2. invocación directa con o sin argumentos
3. valores obtenidos por el sistema de archivos o las solicitudes de red

Las solicitudes de red pueden ser solicitudes entrantes iniciadas por una red extranjera, por otra aplicación en la misma red o por la propia aplicación en la misma red o en una red extranjera.

Una función middleware devolverá otra función y una función terminadora invocará la devolución de llamada. Lo siguiente ilustra el flujo a las solicitudes de red o del sistema de archivos. Aquí la latencia es 0 porque todos estos valores están disponibles en la memoria.

```js
function final(someInput, callback) {
  callback(`${someInput} y terminado ejecutando la devolución de llamada `);
}
function middleware(someInput, callback) {
  return final(`${someInput} tocado por middleware `, callback);
}
function initiate() {
  const someInput = 'hola, esta es una función ';
  middleware(someInput, function (result) {
    console.log(result);
    // requiere devolución de llamada para `return` el resultado
  });
}
initiate();
```


## Gestión del estado

Las funciones pueden ser o no dependientes del estado. La dependencia del estado surge cuando la entrada u otra variable de una función depende de una función externa.

**De esta manera, existen dos estrategias principales para la gestión del estado:**

1. pasar las variables directamente a una función, y
2. adquirir un valor de variable de una caché, sesión, archivo, base de datos, red u otra fuente externa.

Nota: No mencioné la variable global. La gestión del estado con variables globales es a menudo un antipatrón descuidado que dificulta o imposibilita la garantía del estado. Las variables globales en programas complejos deben evitarse siempre que sea posible.

## Flujo de control

Si un objeto está disponible en la memoria, la iteración es posible y no habrá ningún cambio en el flujo de control:

```js
function getSong() {
  let _song = '';
  let i = 100;
  for (i; i > 0; i -= 1) {
    _song += `${i} cervezas en la pared, tomas una y la pasas, ${
      i - 1
    } botellas de cerveza en la pared\n`;
    if (i === 1) {
      _song += "Oye, vamos a por más cerveza";
    }
  }
  return _song;
}
function singSong(_song) {
  if (!_song) throw new Error("la canción está '' vacía, ¡DAME UNA CANCIÓN!");
  console.log(_song);
}
const song = getSong();
// esto funcionará
singSong(song);
```

Sin embargo, si los datos existen fuera de la memoria, la iteración ya no funcionará:

```js
function getSong() {
  let _song = '';
  let i = 100;
  for (i; i > 0; i -= 1) {
    /* eslint-disable no-loop-func */
    setTimeout(function () {
      _song += `${i} cervezas en la pared, tomas una y la pasas, ${
        i - 1
      } botellas de cerveza en la pared\n`;
      if (i === 1) {
        _song += "Oye, vamos a por más cerveza";
      }
    }, 0);
    /* eslint-enable no-loop-func */
  }
  return _song;
}
function singSong(_song) {
  if (!_song) throw new Error("la canción está '' vacía, ¡DAME UNA CANCIÓN!");
  console.log(_song);
}
const song = getSong('beer');
// esto no funcionará
singSong(song);
// Uncaught Error: song is '' empty, FEED ME A SONG!
```

¿Por qué pasó esto? `setTimeout` le indica a la CPU que almacene las instrucciones en otro lugar del bus e indica que los datos están programados para ser recogidos más tarde. Pasan miles de ciclos de CPU antes de que la función vuelva a aparecer en la marca de 0 milisegundos, la CPU busca las instrucciones en el bus y las ejecuta. El único problema es que la canción ('') se devolvió miles de ciclos antes.

La misma situación surge al tratar con sistemas de archivos y solicitudes de red. El hilo principal simplemente no puede bloquearse durante un período de tiempo indeterminado; por lo tanto, utilizamos devoluciones de llamada para programar la ejecución del código en el tiempo de manera controlada.

Podrás realizar casi todas tus operaciones con los siguientes 3 patrones:

1. **En serie:** las funciones se ejecutarán en un orden secuencial estricto, este es el más similar a los bucles `for`.

```js
// operaciones definidas en otro lugar y listas para ejecutarse
const operations = [
  { func: function1, args: args1 },
  { func: function2, args: args2 },
  { func: function3, args: args3 },
];
function executeFunctionWithArgs(operation, callback) {
  // ejecuta la función
  const { args, func } = operation;
  func(args, callback);
}
function serialProcedure(operation) {
  if (!operation) process.exit(0); // terminado
  executeFunctionWithArgs(operation, function (result) {
    // continuar DESPUÉS de la devolución de llamada
    serialProcedure(operations.shift());
  });
}
serialProcedure(operations.shift());
```

2. `Paralelo completo`: cuando el orden no es un problema, como enviar por correo electrónico a una lista de 1.000.000 de destinatarios de correo electrónico.

```js
let count = 0;
let success = 0;
const failed = [];
const recipients = [
  { name: 'Bart', email: 'bart@tld' },
  { name: 'Marge', email: 'marge@tld' },
  { name: 'Homer', email: 'homer@tld' },
  { name: 'Lisa', email: 'lisa@tld' },
  { name: 'Maggie', email: 'maggie@tld' },
];
function dispatch(recipient, callback) {
  // `sendEmail` es un cliente SMTP hipotético
  sendMail(
    {
      subject: 'Cena esta noche',
      message: 'Tenemos mucha col en el plato. ¿Vienes?',
      smtp: recipient.email,
    },
    callback
  );
}
function final(result) {
  console.log(`Resultado: ${result.count} intentos \
      & ${result.success} correos electrónicos exitosos`);
  if (result.failed.length)
    console.log(`Error al enviar a: \
        \n${result.failed.join('\n')}\n`);
}
recipients.forEach(function (recipient) {
  dispatch(recipient, function (err) {
    if (!err) {
      success += 1;
    } else {
      failed.push(recipient.name);
    }
    count += 1;
    if (count === recipients.length) {
      final({
        count,
        success,
        failed,
      });
    }
  });
});
```

3. **Paralelo limitado**: paralelo con límite, como enviar con éxito por correo electrónico a 1.000.000 de destinatarios de una lista de 10 millones de usuarios.

```js
let successCount = 0;
function final() {
  console.log(`enviados ${successCount} correos electrónicos`);
  console.log('terminado');
}
function dispatch(recipient, callback) {
  // `sendEmail` es un cliente SMTP hipotético
  sendMail(
    {
      subject: 'Cena esta noche',
      message: 'Tenemos mucha col en el plato. ¿Vienes?',
      smtp: recipient.email,
    },
    callback
  );
}
function sendOneMillionEmailsOnly() {
  getListOfTenMillionGreatEmails(function (err, bigList) {
    if (err) throw err;
    function serial(recipient) {
      if (!recipient || successCount >= 1000000) return final();
      dispatch(recipient, function (_err) {
        if (!_err) successCount += 1;
        serial(bigList.pop());
      });
    }
    serial(bigList.pop());
  });
}
sendOneMillionEmailsOnly();
```

Cada uno tiene sus propios casos de uso, beneficios y problemas con los que puedes experimentar y leer con más detalle. Lo más importante, ¡recuerda modularizar tus operaciones y usar devoluciones de llamada! Si tienes alguna duda, ¡trata todo como si fuera middleware!

