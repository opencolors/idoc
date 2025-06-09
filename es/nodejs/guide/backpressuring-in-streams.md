---
title: Entendiendo la presión de retroceso en flujos de Node.js
description: Aprenda a implementar flujos Readable y Writable personalizados en Node.js mientras respeta la presión de retroceso para asegurar un flujo de datos eficiente y evitar trampas comunes.
head:
  - - meta
    - name: og:title
      content: Entendiendo la presión de retroceso en flujos de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Aprenda a implementar flujos Readable y Writable personalizados en Node.js mientras respeta la presión de retroceso para asegurar un flujo de datos eficiente y evitar trampas comunes.
  - - meta
    - name: twitter:title
      content: Entendiendo la presión de retroceso en flujos de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Aprenda a implementar flujos Readable y Writable personalizados en Node.js mientras respeta la presión de retroceso para asegurar un flujo de datos eficiente y evitar trampas comunes.
---


# Contrapresión en Streams

Existe un problema general que ocurre durante el manejo de datos llamado contrapresión y describe una acumulación de datos detrás de un búfer durante la transferencia de datos. Cuando el extremo receptor de la transferencia tiene operaciones complejas o es más lento por cualquier motivo, existe una tendencia a que los datos de la fuente entrante se acumulen, como un atasco.

Para resolver este problema, debe existir un sistema de delegación para garantizar un flujo de datos fluido de una fuente a otra. Diferentes comunidades han resuelto este problema de manera única para sus programas, las tuberías Unix y los sockets TCP son buenos ejemplos de esto y, a menudo, se conocen como control de flujo. En Node.js, las transmisiones (streams) han sido la solución adoptada.

El propósito de esta guía es detallar aún más qué es la contrapresión y cómo las transmisiones abordan esto exactamente en el código fuente de Node.js. La segunda parte de la guía presentará las mejores prácticas sugeridas para garantizar que el código de su aplicación sea seguro y esté optimizado al implementar transmisiones.

Asumimos cierta familiaridad con la definición general de `contrapresión`, `Buffer` y `EventEmitters` en Node.js, así como cierta experiencia con `Stream`. Si no ha leído esos documentos, no es mala idea echar un vistazo a la [documentación de la API](/es/nodejs/api/stream) primero, ya que le ayudará a ampliar su comprensión mientras lee esta guía.

## El problema con el manejo de datos

En un sistema informático, los datos se transfieren de un proceso a otro a través de tuberías, sockets y señales. En Node.js, encontramos un mecanismo similar llamado `Stream`. ¡Las transmisiones son geniales! Hacen mucho por Node.js y casi todas las partes de la base de código interna utilizan ese módulo. ¡Como desarrollador, también se le anima a usarlos!

```javascript
const readline = require('node:readline');

const rl = readline.createInterface({
    output: process.stdout,
    input: process.stdin,
});

rl.question('¿Por qué deberías usar streams? ', answer => {
    console.log(`¡Tal vez sea ${answer}, tal vez sea porque son increíbles!`);
});

rl.close();
```

Un buen ejemplo de por qué el mecanismo de contrapresión implementado a través de transmisiones es una gran optimización se puede demostrar comparando las herramientas internas del sistema de la implementación de Stream de Node.js.

En un escenario, tomaremos un archivo grande (aproximadamente -9 GB) y lo comprimiremos utilizando la herramienta familiar `zip(1)`.

```bash
zip The.Matrix.1080p.mkv
```

Si bien esto tardará unos minutos en completarse, en otra shell podemos ejecutar un script que toma el módulo `zlib` de Node.js, que envuelve otra herramienta de compresión, `gzip(1)`.

```javascript
const gzip = require('node:zlib').createGzip();
const fs = require('node:fs');

const inp = fs.createReadStream('The.Matrix.1080p.mkv');
const out = fs.createWriteStream('The.Matrix.1080p.mkv.gz');

inp.pipe(gzip).pipe(out);
```

Para probar los resultados, intente abrir cada archivo comprimido. El archivo comprimido por la herramienta `zip(1)` le notificará que el archivo está dañado, mientras que la compresión finalizada por Stream se descomprimirá sin errores.

::: tip Nota
En este ejemplo, usamos `.pipe()` para obtener la fuente de datos de un extremo a otro. Sin embargo, observe que no hay controladores de errores adecuados adjuntos. Si no se recibe correctamente un fragmento de datos, la fuente Readable o el stream `gzip` no se destruirán. `pump` es una herramienta de utilidad que destruiría correctamente todos los streams en una canalización si uno de ellos falla o se cierra, ¡y es imprescindible en este caso!
:::

`pump` solo es necesario para Node.js 8.x o anterior, ya que para Node.js 10.x o posterior, se introdujo `pipeline` para reemplazar a `pump`. Este es un método de módulo para canalizar entre streams, reenviando errores y limpiando correctamente y proporcionando una retrollamada cuando la canalización está completa.

Aquí hay un ejemplo de cómo usar pipeline:

```javascript
const { pipeline } = require('node:stream');
const fs = require('node:fs');
const zlib = require('node:zlib');
// Use la API de canalización para canalizar fácilmente una serie de streams
// juntos y recibir una notificación cuando la canalización esté completamente terminada.
// Una canalización para comprimir con gzip un archivo de video potencialmente enorme de manera eficiente:
pipeline(
  fs.createReadStream('The.Matrix.1080p.mkv'),
  zlib.createGzip(),
  fs.createWriteStream('The.Matrix.1080p.mkv.gz'),
  err => {
    if (err) {
      console.error('La canalización falló', err);
    } else {
      console.log('La canalización tuvo éxito');
    }
  }
);
```

También puede usar el módulo `stream/promises` para usar pipeline con `async / await`:

```javascript
const { pipeline } = require('node:stream/promises');
const fs = require('node:fs');
const zlib = require('node:zlib');
async function run() {
  try {
    await pipeline(
      fs.createReadStream('The.Matrix.1080p.mkv'),
      zlib.createGzip(),
      fs.createWriteStream('The.Matrix.1080p.mkv.gz')
    );
    console.log('La canalización tuvo éxito');
  } catch (err) {
    console.error('La canalización falló', err);
  }
}
```


## Demasiados datos, demasiado rápido

Hay casos en los que un flujo `Readable` puede dar datos al `Writable` demasiado rápido, ¡mucho más de lo que el consumidor puede manejar!

Cuando eso ocurre, el consumidor comenzará a poner en cola todos los fragmentos de datos para su posterior consumo. La cola de escritura se hará cada vez más larga y, debido a esto, se deberá mantener más datos en la memoria hasta que se complete todo el proceso.

Escribir en un disco es mucho más lento que leer de un disco, por lo tanto, cuando intentamos comprimir un archivo y escribirlo en nuestro disco duro, se producirá una contrapresión porque el disco de escritura no podrá seguir el ritmo de la lectura.

```javascript
// Secretamente, el flujo está diciendo: "¡Ey, ey! ¡Espera, esto es demasiado!"
// Los datos comenzarán a acumularse en el lado de lectura del búfer de datos a medida que
// write intenta mantenerse al día con el flujo de datos entrante.
inp.pipe(gzip).pipe(outputFile);
```

Esta es la razón por la que un mecanismo de contrapresión es importante. Si no existiera un sistema de contrapresión, el proceso consumiría la memoria de su sistema, ralentizando efectivamente otros procesos y monopolizando una gran parte de su sistema hasta su finalización.

Esto resulta en algunas cosas:
- Ralentización de todos los demás procesos actuales
- Un recolector de basura muy sobrecargado
- Agotamiento de la memoria

En los siguientes ejemplos, sacaremos el valor de retorno de la función `.write()` y lo cambiaremos a `true`, lo que deshabilita efectivamente el soporte de contrapresión en el núcleo de Node.js. En cualquier referencia al binario `'modified'`, estamos hablando de ejecutar el binario de nodo sin la línea `return ret;`, y en su lugar con el `return true;` reemplazado.

## Exceso de resistencia en la recolección de basura

Echemos un vistazo a un punto de referencia rápido. Usando el mismo ejemplo de arriba, realizamos algunas pruebas de tiempo para obtener un tiempo medio para ambos binarios.

```bash
   prueba (#)  | binario `node` (ms) | binario `node` modificado (ms)
=================================================================
      1       |      56924         |           55011
      2       |      52686         |           55869
      3       |      59479         |           54043
      4       |      54473         |           55229
      5       |      52933         |           59723
=================================================================
tiempo promedio: |      55299         |           55975
```

Ambos tardan alrededor de un minuto en ejecutarse, por lo que no hay mucha diferencia, pero echemos un vistazo más de cerca para confirmar si nuestras sospechas son correctas. Usamos la herramienta de Linux `dtrace` para evaluar lo que está sucediendo con el recolector de basura V8.

El tiempo medido del GC (recolector de basura) indica los intervalos de un ciclo completo de una sola barrida realizada por el recolector de basura:

```bash
tiempo aproximado (ms) | GC (ms) | GC modificado (ms)
=================================================
          0       |    0    |      0
          1       |    0    |      0
         40       |    0    |      2
        170       |    3    |      1
        300       |    3    |      1
         *             *           *
         *             *           *
         *             *           *
      39000       |    6    |     26
      42000       |    6    |     21
      47000       |    5    |     32
      50000       |    8    |     28
      54000       |    6    |     35
```

Si bien los dos procesos comienzan igual y parecen trabajar el GC al mismo ritmo, se hace evidente que después de unos segundos con un sistema de contrapresión que funciona correctamente, distribuye la carga del GC a través de intervalos constantes de 4 a 8 milisegundos hasta el final de la transferencia de datos.

Sin embargo, cuando no hay un sistema de contrapresión implementado, la recolección de basura V8 comienza a prolongarse. El binario normal llamó al GC aproximadamente 75 veces en un minuto, mientras que el binario modificado solo se activa 36 veces.

Esta es la deuda lenta y gradual que se acumula por el creciente uso de la memoria. A medida que se transfieren los datos, sin un sistema de contrapresión implementado, se está utilizando más memoria para cada transferencia de fragmento.

Cuanta más memoria se asigna, más debe cuidar el GC en una sola pasada. Cuanto mayor es el barrido, más necesita decidir el GC qué se puede liberar, y escanear punteros desconectados en un espacio de memoria más grande consumirá más potencia informática.


## Agotamiento de la Memoria

Para determinar el consumo de memoria de cada binario, hemos cronometrado cada proceso con `/usr/bin/time -lp sudo ./node ./backpressure-example/zlib.js` individualmente.

Esta es la salida del binario normal:

```bash
Respetando el valor de retorno de .write()
=============================================
real        58.88
user        56.79
sys          8.79
  87810048  tamaño máximo del conjunto residente
         0  tamaño promedio de la memoria compartida
         0  tamaño promedio de los datos no compartidos
         0  tamaño promedio de la pila no compartida
     19427  recuperaciones de página
      3134  fallos de página
         0  swaps
         5  operaciones de entrada de bloque
       194  operaciones de salida de bloque
         0  mensajes enviados
         0  mensajes recibidos
         1  señales recibidas
        12  cambios de contexto voluntarios
    666037  cambios de contexto involuntarios
```

El tamaño máximo en bytes ocupado por la memoria virtual resulta ser de aproximadamente 87.81 mb.

Y ahora, cambiando el valor de retorno de la función `.write()`, obtenemos:

```bash
Sin respetar el valor de retorno de .write():
==================================================
real        54.48
user        53.15
sys          7.43
1524965376  tamaño máximo del conjunto residente
         0  tamaño promedio de la memoria compartida
         0  tamaño promedio de los datos no compartidos
         0  tamaño promedio de la pila no compartida
    373617  recuperaciones de página
      3139  fallos de página
         0  swaps
        18  operaciones de entrada de bloque
       199  operaciones de salida de bloque
         0  mensajes enviados
         0  mensajes recibidos
         1  señales recibidas
        25  cambios de contexto voluntarios
    629566  cambios de contexto involuntarios
```

El tamaño máximo en bytes ocupado por la memoria virtual resulta ser de aproximadamente 1.52 gb.

Sin flujos implementados para delegar la contrapresión, hay un orden de magnitud mayor de espacio de memoria que se está asignando: ¡un enorme margen de diferencia entre el mismo proceso!

Este experimento muestra lo optimizado y rentable que es el mecanismo de contrapresión de Node.js para su sistema informático. ¡Ahora, hagamos un desglose de cómo funciona!


## ¿Cómo resuelve la contrapresión estos problemas?

Existen diferentes funciones para transferir datos de un proceso a otro. En Node.js, hay una función interna integrada llamada `.pipe()`. ¡También hay otros paquetes que puedes usar! Sin embargo, en el nivel básico de este proceso, tenemos dos componentes separados: la fuente de los datos y el consumidor.

Cuando se llama a `.pipe()` desde la fuente, se le indica al consumidor que hay datos para transferir. La función pipe ayuda a configurar los cierres de contrapresión apropiados para los activadores de eventos.

En Node.js, la fuente es un flujo `Readable` y el consumidor es el flujo `Writable` (ambos pueden intercambiarse con un flujo Duplex o un flujo Transform, pero eso está fuera del alcance de esta guía).

El momento en que se activa la contrapresión se puede precisar exactamente al valor de retorno de la función `.write()` de un `Writable`. Este valor de retorno está determinado por algunas condiciones, por supuesto.

En cualquier escenario donde el búfer de datos haya excedido el `highwaterMark` o la cola de escritura esté actualmente ocupada, `.write()` `devolverá false`.

Cuando se devuelve un valor `false`, se activa el sistema de contrapresión. Pausará el flujo `Readable` entrante para que no envíe ningún dato y esperará hasta que el consumidor esté listo nuevamente. Una vez que el búfer de datos se vacía, se emitirá un evento `'drain'` y se reanudará el flujo de datos entrante.

Una vez que la cola termina, la contrapresión permitirá que se vuelvan a enviar los datos. El espacio en la memoria que se estaba utilizando se liberará y se preparará para el siguiente lote de datos.

Esto permite efectivamente que se use una cantidad fija de memoria en un momento dado para una función `.pipe()`. No habrá fugas de memoria, ni almacenamiento en búfer infinito, ¡y el recolector de basura solo tendrá que lidiar con un área en la memoria!

Entonces, si la contrapresión es tan importante, ¿por qué (probablemente) no has oído hablar de ella? Bueno, la respuesta es simple: Node.js hace todo esto automáticamente por ti.

¡Eso es genial! Pero tampoco es tan genial cuando estamos tratando de entender cómo implementar nuestros flujos personalizados.

::: info NOTA
En la mayoría de las máquinas, hay un tamaño de byte que determina cuándo un búfer está lleno (que variará entre diferentes máquinas). Node.js te permite establecer tu propio `highWaterMark`, pero comúnmente, el valor predeterminado se establece en 16 kb (16384, o 16 para flujos en objectMode). En los casos en que quieras aumentar ese valor, hazlo, ¡pero hazlo con precaución!
:::


## Ciclo de vida de `.pipe()`

Para lograr una mejor comprensión de la contrapresión, aquí hay un diagrama de flujo sobre el ciclo de vida de un flujo `Readable` que se está [canalizando](/es/nodejs/api/stream) en un flujo `Writable`:

```bash
                                                     +===================+
                         x-->  Funciones de canalización  +-->   src.pipe(dest)  |
                         x     se configuran durante      |===================|
                         x     el método .pipe.          |  Callbacks de eventos  |
  +===============+      x                           |-------------------|
  |   Tus datos   |      x     Existen fuera           | .on('close', cb)  |
  +=======+=======+      x     del flujo de datos, pero  | .on('data', cb)   |
          |              x     importante adjuntar      | .on('drain', cb)  |
          |              x     eventos, y sus          | .on('unpipe', cb) |
+---------v---------+    x     callbacks respectivos.  | .on('error', cb)  |
|  Flujo Readable   +----+                           | .on('finish', cb) |
+-^-------^-------^-+    |                           | .on('end', cb)    |
  ^       |       ^      |                           +-------------------+
  |       |       |      |
  |       ^       |      |
  ^       ^       ^      |    +-------------------+         +=================+
  ^       |       ^      +---->  Flujo Writable  +--------->  .write(chunk)  |
  |       |       |           +-------------------+         +=======+=========+
  |       |       |                                                 |
  |       ^       |                              +------------------v---------+
  ^       |       +-> if (!chunk)                | ¿Es este fragmento demasiado grande? |
  ^       |       |     emit .end();             | ¿Está la cola ocupada?      |
  |       |       +-> else                       +-------+----------------+---+
  |       ^       |     emit .write();                   |                |
  |       ^       ^                                   +--v---+        +---v---+
  |       |       ^-----------------------------------<  No  |        |  Sí  |
  ^       |                                           +------+        +---v---+
  ^       |                                                               |
  |       ^               emit .pause();          +=================+     |
  |       ^---------------^-----------------------+  return false;  <-----+---+
  |                                               +=================+         |
  |                                                                           |
  ^            cuando la cola está vacía     +============+                         |
  ^------------^-----------------------<  Almacenamiento en búfer |                         |
               |                       |============|                         |
               +> emit .drain();       |  ^Búfer^  |                         |
               +> emit .resume();      +------------+                         |
                                       |  ^Búfer^  |                         |
                                       +------------+   agregar fragmento a la cola    |
                                       |            <---^---------------------<
                                       +============+
```

::: tip NOTA
Si está configurando una canalización para encadenar algunos flujos para manipular sus datos, lo más probable es que esté implementando el flujo Transform.
:::

En este caso, su salida de su flujo `Readable` entrará en el `Transform` y se canalizará hacia el `Writable`.

```javascript
Readable.pipe(Transformable).pipe(Writable);
```

La contrapresión se aplicará automáticamente, pero tenga en cuenta que tanto el `highwaterMark` entrante como el saliente del flujo `Transform` pueden manipularse y afectarán el sistema de contrapresión.


## Directrices sobre contrapresión

Desde Node.js v0.10, la clase Stream ha ofrecido la capacidad de modificar el comportamiento de `.read()` o `.write()` utilizando la versión con guion bajo de estas funciones respectivas (`._read()` y `._write()`).

Existen directrices documentadas para implementar flujos Readable e implementar flujos Writable. Asumiremos que ya las has leído y la siguiente sección profundizará un poco más.

## Reglas a seguir al implementar flujos personalizados

La regla de oro de los flujos es respetar siempre la contrapresión. Lo que constituye la mejor práctica es una práctica no contradictoria. Siempre que tengas cuidado de evitar comportamientos que entren en conflicto con el soporte interno de contrapresión, puedes estar seguro de que estás siguiendo una buena práctica.

En general,

1. Nunca `.push()` si no te lo piden.
2. Nunca llames a `.write()` después de que devuelva falso, sino que espera a 'drain'.
3. Los flujos cambian entre diferentes versiones de Node.js y la biblioteca que uses. Ten cuidado y prueba las cosas.

::: tip NOTA
En lo que respecta al punto 3, un paquete increíblemente útil para construir flujos de navegador es `readable-stream`. Rodd Vagg ha escrito una [excelente entrada de blog](https://r.va.gg/2014/06/why-i-dont-use-nodes-core-stream-module.html) que describe la utilidad de esta biblioteca. En resumen, proporciona un tipo de degradación gradual automatizada para los flujos Readable y es compatible con versiones anteriores de navegadores y Node.js.
:::

## Reglas específicas para flujos Readable

Hasta ahora, hemos analizado cómo `.write()` afecta a la contrapresión y nos hemos centrado mucho en el flujo Writable. Debido a la funcionalidad de Node.js, los datos técnicamente fluyen aguas abajo de Readable a Writable. Sin embargo, como podemos observar en cualquier transmisión de datos, materia o energía, la fuente es tan importante como el destino, y el flujo Readable es vital para la forma en que se maneja la contrapresión.

Ambos procesos dependen el uno del otro para comunicarse eficazmente, si Readable ignora cuándo el flujo Writable le pide que deje de enviar datos, puede ser tan problemático como cuando el valor de retorno de `.write()` es incorrecto.

Por lo tanto, además de respetar el retorno de `.write()`, también debemos respetar el valor de retorno de `.push()` utilizado en el método `._read()`. Si `.push()` devuelve un valor falso, el flujo dejará de leer de la fuente. De lo contrario, continuará sin pausa.

Aquí hay un ejemplo de mala práctica usando `.push()`:
```javascript
// Esto es problemático ya que ignora por completo el valor de retorno de push
// que puede ser una señal de contrapresión del flujo de destino.
class MyReadable extends Readable {
  _read(size) {
    let chunk;
    while (null == (chunk = getNextChunk())) {
      this.push(chunk);
    }
  }
}
```

Además, desde fuera del flujo personalizado, existen riesgos al ignorar la contrapresión. En este contraejemplo de buena práctica, el código de la aplicación fuerza el paso de datos siempre que están disponibles (señalado por el evento `'data'`):

```javascript
// Esto ignora los mecanismos de contrapresión que Node.js ha establecido,
// y empuja incondicionalmente los datos, independientemente de si el
// flujo de destino está listo para ellos o no.
readable.on('data', data => writable.write(data));
```

Aquí hay un ejemplo de uso de `.push()` con un flujo Readable.

```javascript
const { Readable } = require('node:stream');

// Crea un flujo Readable personalizado
const myReadableStream = new Readable({
  objectMode: true,
  read(size) {
    // Empuja algunos datos al flujo
    this.push({ message: '¡Hola, mundo!' });
    this.push(null); // Marca el final del flujo
  },
});

// Consume el flujo
myReadableStream.on('data', chunk => {
  console.log(chunk);
});

// Output:
// { message: '¡Hola, mundo!' }
```


## Reglas específicas para las transmisiones de escritura

Recordemos que `.write()` puede devolver verdadero o falso dependiendo de algunas condiciones. Afortunadamente para nosotros, al construir nuestra propia transmisión de escritura, la máquina de estado de la transmisión manejará nuestras devoluciones de llamada y determinará cuándo manejar la contrapresión y optimizar el flujo de datos para nosotros. Sin embargo, cuando queremos usar una escritura directamente, debemos respetar el valor de retorno de `.write()` y prestar mucha atención a estas condiciones:
- Si la cola de escritura está ocupada, `.write()` devolverá falso.
- Si el fragmento de datos es demasiado grande, `.write()` devolverá falso (el límite está indicado por la variable, highWaterMark).

En este ejemplo, creamos una transmisión de lectura personalizada que inserta un solo objeto en la transmisión usando `.push()`. El método `._read()` se llama cuando la transmisión está lista para consumir datos y, en este caso, insertamos inmediatamente algunos datos en la transmisión y marcamos el final de la transmisión insertando `null`.
```javascript
const stream = require('stream');

class MyReadable extends stream.Readable {
  constructor() {
    super();
  }

  _read() {
    const data = { message: '¡Hola, mundo!' };
    this.push(data);
    this.push(null);
  }
}

const readableStream = new MyReadable();

readableStream.pipe(process.stdout);
```
Luego consumimos la transmisión escuchando el evento 'data' y registrando cada fragmento de datos que se inserta en la transmisión. En este caso, solo insertamos un solo fragmento de datos en la transmisión, por lo que solo vemos un mensaje de registro.

## Reglas específicas para las transmisiones de escritura

Recordemos que `.write()` puede devolver verdadero o falso dependiendo de algunas condiciones. Afortunadamente para nosotros, al construir nuestra propia transmisión de escritura, la máquina de estado de la transmisión manejará nuestras devoluciones de llamada y determinará cuándo manejar la contrapresión y optimizar el flujo de datos para nosotros.

Sin embargo, cuando queremos usar una escritura directamente, debemos respetar el valor de retorno de `.write()` y prestar mucha atención a estas condiciones:
- Si la cola de escritura está ocupada, `.write()` devolverá falso.
- Si el fragmento de datos es demasiado grande, `.write()` devolverá falso (el límite está indicado por la variable, highWaterMark).

```javascript
class MyWritable extends Writable {
  // Esta escritura no es válida debido a la naturaleza asíncrona de las devoluciones de llamada de JavaScript.
  // Sin una declaración de retorno para cada devolución de llamada antes de la última,
  // existe una gran posibilidad de que se llamen varias devoluciones de llamada.
  write(chunk, encoding, callback) {
    if (chunk.toString().indexOf('a') >= 0) callback();
    else if (chunk.toString().indexOf('b') >= 0) callback();
    callback();
  }
}
```

También hay algunas cosas a tener en cuenta al implementar `._writev()`. La función está acoplada con `.cork()`, pero hay un error común al escribir:

```javascript
// Usar .uncork() dos veces aquí hace dos llamadas en la capa C++, lo que hace que el
// la técnica de corcho/descorcho sea inútil.
ws.cork();
ws.write('hello ');
ws.write('world ');
ws.uncork();

ws.cork();
ws.write('from ');
ws.write('Matteo');
ws.uncork();

// La forma correcta de escribir esto es utilizar process.nextTick(), que se activa
// en el próximo bucle de eventos.
ws.cork();
ws.write('hello ');
ws.write('world ');
process.nextTick(doUncork, ws);

ws.cork();
ws.write('from ');
ws.write('Matteo');
process.nextTick(doUncork, ws);

// Como función global.
function doUncork(stream) {
  stream.uncork();
}
```

Se puede llamar a `.cork()` tantas veces como queramos, solo debemos tener cuidado de llamar a `.uncork()` la misma cantidad de veces para que vuelva a fluir.


## Conclusión

Los Streams son un módulo de uso frecuente en Node.js. Son importantes para la estructura interna, y para los desarrolladores, para expandirse y conectarse a través del ecosistema de módulos de Node.js.

Esperamos que ahora pueda solucionar problemas y codificar de forma segura sus propios streams `Writable` y `Readable` teniendo en cuenta la contrapresión, y compartir sus conocimientos con colegas y amigos.

Asegúrese de leer más sobre `Stream` para otras funciones de la API que le ayudarán a mejorar y liberar sus capacidades de streaming al construir una aplicación con Node.js.

