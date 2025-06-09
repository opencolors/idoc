---
title: No bloquee la cola de eventos (o la piscina de trabajo)
description: Cómo escribir un servidor web de alto rendimiento y más resistente a los ataques DoS evitando bloquear la cola de eventos y la piscina de trabajo en Node.js.
head:
  - - meta
    - name: og:title
      content: No bloquee la cola de eventos (o la piscina de trabajo) | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Cómo escribir un servidor web de alto rendimiento y más resistente a los ataques DoS evitando bloquear la cola de eventos y la piscina de trabajo en Node.js.
  - - meta
    - name: twitter:title
      content: No bloquee la cola de eventos (o la piscina de trabajo) | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Cómo escribir un servidor web de alto rendimiento y más resistente a los ataques DoS evitando bloquear la cola de eventos y la piscina de trabajo en Node.js.
---


# No Bloquear el Bucle de Eventos (o el Pool de Trabajadores)

## ¿Debería leer esta guía?

Si está escribiendo algo más complicado que un breve script de línea de comandos, leer esto debería ayudarlo a escribir aplicaciones más seguras y de mayor rendimiento.

Este documento está escrito pensando en los servidores Node.js, pero los conceptos también se aplican a aplicaciones complejas de Node.js. Donde los detalles específicos del sistema operativo varían, este documento está centrado en Linux.

## Resumen

Node.js ejecuta código JavaScript en el Bucle de Eventos (inicialización y callbacks), y ofrece un Pool de Trabajadores para manejar tareas costosas como la E/S de archivos. Node.js escala bien, a veces mejor que enfoques más pesados como Apache. El secreto de la escalabilidad de Node.js es que utiliza un pequeño número de hilos para manejar muchos clientes. Si Node.js puede arreglárselas con menos hilos, entonces puede dedicar más tiempo y memoria de su sistema a trabajar en los clientes en lugar de pagar sobrecargas de espacio y tiempo para los hilos (memoria, cambio de contexto). Pero debido a que Node.js tiene solo unos pocos hilos, debe estructurar su aplicación para usarlos sabiamente.

Aquí hay una buena regla general para mantener su servidor Node.js rápido: *Node.js es rápido cuando el trabajo asociado con cada cliente en un momento dado es "pequeño".*

Esto se aplica a los callbacks en el Bucle de Eventos y a las tareas en el Pool de Trabajadores.

## ¿Por qué debería evitar bloquear el Bucle de Eventos y el Pool de Trabajadores?

Node.js utiliza un pequeño número de hilos para manejar muchos clientes. En Node.js hay dos tipos de hilos: un Bucle de Eventos (también conocido como el bucle principal, hilo principal, hilo de eventos, etc.) y un pool de `k` Trabajadores en un Pool de Trabajadores (también conocido como el threadpool).

Si un hilo tarda mucho en ejecutar un callback (Bucle de Eventos) o una tarea (Trabajador), lo llamamos "bloqueado". Mientras un hilo está bloqueado trabajando en nombre de un cliente, no puede manejar solicitudes de otros clientes. Esto proporciona dos motivaciones para no bloquear ni el Bucle de Eventos ni el Pool de Trabajadores:

1. Rendimiento: Si regularmente realiza actividades pesadas en cualquiera de los tipos de hilo, el *rendimiento* (solicitudes/segundo) de su servidor se verá afectado.
2. Seguridad: Si es posible que para cierta entrada uno de sus hilos pueda bloquearse, un cliente malicioso podría enviar esta "entrada malvada", hacer que sus hilos se bloqueen y evitar que trabajen en otros clientes. Esto sería un [Ataque de Denegación de Servicio](https://en.wikipedia.org/wiki/Denial-of-service_attack).


## Un repaso rápido de Node

Node.js utiliza la Arquitectura Orientada a Eventos: tiene un Bucle de Eventos para la orquestación y un Grupo de Trabajadores para tareas costosas.

### ¿Qué código se ejecuta en el Bucle de Eventos?

Cuando comienzan, las aplicaciones Node.js primero completan una fase de inicialización, `require`-iendo módulos y registrando callbacks para eventos. Las aplicaciones Node.js luego entran en el Bucle de Eventos, respondiendo a las solicitudes entrantes de los clientes ejecutando el callback apropiado. Este callback se ejecuta sincrónicamente y puede registrar solicitudes asíncronas para continuar el procesamiento después de que se complete. Los callbacks para estas solicitudes asíncronas también se ejecutarán en el Bucle de Eventos.

El Bucle de Eventos también cumplirá con las solicitudes asíncronas no bloqueantes realizadas por sus callbacks, por ejemplo, E/S de red.

En resumen, el Bucle de Eventos ejecuta los callbacks de JavaScript registrados para eventos y también es responsable de cumplir con las solicitudes asíncronas no bloqueantes como la E/S de red.

### ¿Qué código se ejecuta en el Grupo de Trabajadores?

El Grupo de Trabajadores de Node.js está implementado en libuv ([docs](http://docs.libuv.org/en/v1.x/threadpool.html)), que expone una API general de envío de tareas.

Node.js utiliza el Grupo de Trabajadores para manejar tareas "costosas". Esto incluye E/S para las cuales un sistema operativo no proporciona una versión no bloqueante, así como tareas particularmente intensivas en la CPU.

Estas son las API del módulo Node.js que hacen uso de este Grupo de Trabajadores:

1. Intensivo en E/S
    1. [DNS](/es/nodejs/api/dns): `dns.lookup()`, `dns.lookupService()`.
    2. [Sistema de archivos](/es/nodejs/api/fs): Todas las API del sistema de archivos, excepto `fs.FSWatcher()` y aquellas que son explícitamente sincrónicas, utilizan el grupo de hilos de libuv.
2. Intensivo en CPU
    1. [Crypto](/es/nodejs/api/crypto): `crypto.pbkdf2()`, `crypto.scrypt()`, `crypto.randomBytes()`, `crypto.randomFill()`, `crypto.generateKeyPair()`.
    2. [Zlib](/es/nodejs/api/zlib): Todas las API de zlib, excepto aquellas que son explícitamente sincrónicas, utilizan el grupo de hilos de libuv.

En muchas aplicaciones Node.js, estas API son las únicas fuentes de tareas para el Grupo de Trabajadores. Las aplicaciones y los módulos que utilizan un [complemento de C++](/es/nodejs/api/addons) pueden enviar otras tareas al Grupo de Trabajadores.

En aras de la integridad, notamos que cuando llama a una de estas API desde un callback en el Bucle de Eventos, el Bucle de Eventos paga algunos costos de configuración menores al ingresar a los enlaces de C++ de Node.js para esa API y enviar una tarea al Grupo de Trabajadores. Estos costos son insignificantes en comparación con el costo total de la tarea, razón por la cual el Bucle de Eventos la está descargando. Al enviar una de estas tareas al Grupo de Trabajadores, Node.js proporciona un puntero a la función C++ correspondiente en los enlaces C++ de Node.js.


### ¿Cómo decide Node.js qué código ejecutar a continuación?

En abstracto, el bucle de eventos (Event Loop) y el pool de trabajadores (Worker Pool) mantienen colas para eventos pendientes y tareas pendientes, respectivamente.

En realidad, el bucle de eventos no mantiene realmente una cola. En cambio, tiene una colección de descriptores de archivos que le pide al sistema operativo que supervise, utilizando un mecanismo como [epoll](http://man7.org/linux/man-pages/man7/epoll.7.html) (Linux), [kqueue](https://developer.apple.com/library/content/documentation/Darwin/Conceptual/FSEvents_ProgGuide/KernelQueues/KernelQueues.html) (OSX), puertos de eventos (Solaris) o [IOCP](https://msdn.microsoft.com/en-us/library/windows/desktop/aa365198.aspx) (Windows). Estos descriptores de archivos corresponden a sockets de red, cualquier archivo que esté observando, etc. Cuando el sistema operativo dice que uno de estos descriptores de archivos está listo, el bucle de eventos lo traduce al evento apropiado e invoca las devoluciones de llamada (callbacks) asociadas con ese evento. Puedes aprender más sobre este proceso [aquí](https://www.youtube.com/watch?v=P9csgxBgaZ8).

En contraste, el pool de trabajadores utiliza una cola real cuyas entradas son tareas a procesar. Un trabajador extrae una tarea de esta cola y trabaja en ella, y cuando termina, el trabajador genera un evento de "Al menos una tarea ha terminado" para el bucle de eventos.

### ¿Qué significa esto para el diseño de la aplicación?
En un sistema de un hilo por cliente como Apache, a cada cliente pendiente se le asigna su propio hilo. Si un hilo que maneja a un cliente se bloquea, el sistema operativo lo interrumpirá y le dará un turno a otro cliente. Por lo tanto, el sistema operativo asegura que los clientes que requieren una pequeña cantidad de trabajo no sean penalizados por los clientes que requieren más trabajo.

Debido a que Node.js maneja muchos clientes con pocos hilos, si un hilo se bloquea manejando la solicitud de un cliente, es posible que las solicitudes de clientes pendientes no tengan un turno hasta que el hilo termine su callback o tarea. Por lo tanto, el trato justo de los clientes es responsabilidad de su aplicación. Esto significa que no debe hacer demasiado trabajo para ningún cliente en ningún callback o tarea individual.

Esta es parte de la razón por la que Node.js puede escalar bien, pero también significa que usted es responsable de garantizar una programación justa. Las siguientes secciones hablan sobre cómo asegurar una programación justa para el bucle de eventos y para el pool de trabajadores.


## No bloquee el bucle de eventos
El bucle de eventos detecta cada nueva conexión de cliente y orquesta la generación de una respuesta. Todas las solicitudes entrantes y las respuestas salientes pasan por el bucle de eventos. Esto significa que si el bucle de eventos pasa demasiado tiempo en algún punto, todos los clientes actuales y nuevos no tendrán su turno.

Debe asegurarse de no bloquear nunca el bucle de eventos. En otras palabras, cada una de sus devoluciones de llamada de JavaScript debe completarse rápidamente. Esto, por supuesto, también se aplica a sus `await`, sus `Promise.then`, etc.

Una buena manera de asegurar esto es razonar sobre la ["complejidad computacional"](https://en.wikipedia.org/wiki/Time_complexity) de sus devoluciones de llamada. Si su devolución de llamada toma un número constante de pasos sin importar cuáles sean sus argumentos, siempre les dará a todos los clientes pendientes un turno justo. Si su devolución de llamada toma un número diferente de pasos dependiendo de sus argumentos, entonces debe pensar en cuánto tiempo podrían ser los argumentos.

Ejemplo 1: Una devolución de llamada de tiempo constante.

```js
app.get('/constant-time', (req, res) => {
  res.sendStatus(200);
});
```

Ejemplo 2: Una devolución de llamada `O(n)`. Esta devolución de llamada se ejecutará rápidamente para `n` pequeña y más lentamente para `n` grande.

```js
app.get('/countToN', (req, res) => {
  let n = req.query.n;
  // n iteraciones antes de darle a alguien más un turno
  for (let i = 0; i < n; i++) {
    console.log(`Iter ${i}`);
  }
  res.sendStatus(200);
});
```
Ejemplo 3: Una devolución de llamada `O(n^2)`. Esta devolución de llamada seguirá ejecutándose rápidamente para `n` pequeña, pero para `n` grande se ejecutará mucho más lentamente que el ejemplo anterior `O(n)`.

```js
app.get('/countToN2', (req, res) => {
  let n = req.query.n;
  // n^2 iteraciones antes de darle a alguien más un turno
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      console.log(`Iter ${i}.${j}`);
    }
  }
  res.sendStatus(200);
});
```

### ¿Qué tan cuidadoso debe ser?
Node.js utiliza el motor Google V8 para JavaScript, que es bastante rápido para muchas operaciones comunes. Las excepciones a esta regla son las expresiones regulares y las operaciones JSON, que se discuten a continuación.

Sin embargo, para tareas complejas, debe considerar limitar la entrada y rechazar las entradas que sean demasiado largas. De esa manera, incluso si su devolución de llamada tiene una gran complejidad, al limitar la entrada, se asegura de que la devolución de llamada no pueda tomar más que el tiempo del peor de los casos en la entrada aceptable más larga. Luego, puede evaluar el costo del peor de los casos de esta devolución de llamada y determinar si su tiempo de ejecución es aceptable en su contexto.


## Bloqueando el bucle de eventos: REDOS

Una forma común de bloquear el bucle de eventos de manera desastrosa es mediante el uso de una [expresión regular](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) "vulnerable".

### Evitar expresiones regulares vulnerables
Una expresión regular (regexp) compara una cadena de entrada con un patrón. Normalmente pensamos que una coincidencia de regexp requiere una sola pasada a través de la cadena de entrada `--- O(n)` donde `n` es la longitud de la cadena de entrada. En muchos casos, una sola pasada es todo lo que se necesita. Desafortunadamente, en algunos casos la coincidencia de regexp podría requerir un número exponencial de viajes a través de la cadena de entrada `--- O(2^n)`. Un número exponencial de viajes significa que si el motor requiere x viajes para determinar una coincidencia, necesitará `2*x` viajes si agregamos solo un carácter más a la cadena de entrada. Dado que el número de viajes está linealmente relacionado con el tiempo requerido, el efecto de esta evaluación será bloquear el bucle de eventos.

Una *expresión regular vulnerable* es aquella en la que su motor de expresiones regulares podría tardar un tiempo exponencial, exponiéndolo a [REDOS](https://owasp.org/www-community/attacks/Regular_expression_Denial_of_Service_-_ReDoS) en "entrada maliciosa". Si su patrón de expresión regular es vulnerable o no (es decir, el motor de expresiones regulares podría tardar un tiempo exponencial en él) es en realidad una pregunta difícil de responder, y varía dependiendo de si está utilizando Perl, Python, Ruby, Java, JavaScript, etc., pero aquí hay algunas reglas generales que se aplican en todos estos idiomas:

1. Evite los cuantificadores anidados como `(a+)*`. El motor de expresiones regulares de V8 puede manejar algunos de estos rápidamente, pero otros son vulnerables.
2. Evite las OR con cláusulas superpuestas, como `(a|a)*`. Nuevamente, estos son a veces rápidos.
3. Evite el uso de referencias inversas, como `(a.*) \1`. Ningún motor de expresiones regulares puede garantizar la evaluación de estos en tiempo lineal.
4. Si está realizando una coincidencia de cadena simple, use `indexOf` o el equivalente local. Será más barato y nunca tomará más de `O(n)`.

Si no está seguro de si su expresión regular es vulnerable, recuerde que Node.js generalmente no tiene problemas para informar una coincidencia incluso para una expresión regular vulnerable y una cadena de entrada larga. El comportamiento exponencial se activa cuando hay una falta de coincidencia, pero Node.js no puede estar seguro hasta que prueba muchos caminos a través de la cadena de entrada.


### Un ejemplo de REDOS

Aquí hay un ejemplo de una expresión regular vulnerable que expone su servidor a REDOS:

```js
app.get('/redos-me', (req, res) => {
  let filePath = req.query.filePath;
  // REDOS
  if (filePath.match(/(\/.+)+$/)) {
    console.log('valid path');
  } else {
    console.log('invalid path');
  }
  res.sendStatus(200);
});
```

La expresión regular vulnerable en este ejemplo es una (¡mala!) manera de verificar una ruta válida en Linux. Coincide con cadenas que son una secuencia de nombres delimitados por "/" como "`/a/b/c`". Es peligroso porque viola la regla 1: tiene un cuantificador doblemente anidado.

Si un cliente consulta con filePath `///.../\n` (100 /'s seguidos de un carácter de nueva línea que el "." de la expresión regular no coincidirá), entonces el bucle de eventos tardará una eternidad, bloqueando el bucle de eventos. El ataque REDOS de este cliente hace que todos los demás clientes no tengan su turno hasta que finalice la coincidencia de la expresión regular.

Por esta razón, debe tener cuidado al usar expresiones regulares complejas para validar la entrada del usuario.

### Recursos Anti-REDOS
Existen algunas herramientas para verificar la seguridad de sus expresiones regulares, como

- [safe-regex](https://github.com/davisjam/safe-regex)
- [rxxr2](https://github.com/superhuman/rxxr2)

Sin embargo, ninguna de estas detectará todas las expresiones regulares vulnerables.

Otro enfoque es utilizar un motor de expresiones regulares diferente. Podría usar el módulo [node-re2](https://github.com/uhop/node-re2), que utiliza el rapidísimo motor de expresiones regulares [RE2](https://github.com/google/re2) de Google. Pero tenga cuidado, RE2 no es 100% compatible con las expresiones regulares de V8, así que verifique si hay regresiones si intercambia el módulo node-re2 para manejar sus expresiones regulares. Y las expresiones regulares particularmente complicadas no son compatibles con node-re2.

Si está intentando hacer coincidir algo "obvio", como una URL o una ruta de archivo, busque un ejemplo en una [biblioteca de expresiones regulares](http://www.regexlib.com/) o use un módulo npm, por ejemplo, [ip-regex](https://www.npmjs.com/package/ip-regex).

### Bloqueo del bucle de eventos: módulos centrales de Node.js

Varios módulos centrales de Node.js tienen API síncronas costosas, que incluyen:

- [Cifrado](/es/nodejs/api/crypto)
- [Compresión](/es/nodejs/api/zlib)
- [Sistema de archivos](/es/nodejs/api/fs)
- [Proceso hijo](/es/nodejs/api/child_process)

Estas API son costosas, porque implican un cálculo significativo (cifrado, compresión), requieren E/S (E/S de archivos) o potencialmente ambos (proceso hijo). Estas API están diseñadas para la conveniencia de la creación de scripts, pero no están diseñadas para su uso en el contexto del servidor. Si los ejecuta en el bucle de eventos, tardarán mucho más en completarse que una instrucción típica de JavaScript, bloqueando el bucle de eventos.

En un servidor, no debe utilizar las siguientes API síncronas de estos módulos:

- Cifrado:
    - `crypto.randomBytes` (versión síncrona)
    - `crypto.randomFillSync`
    - `crypto.pbkdf2Sync`
    - También debe tener cuidado al proporcionar una entrada grande a las rutinas de cifrado y descifrado.
- Compresión:
    - `zlib.inflateSync`
    - `zlib.deflateSync`
- Sistema de archivos:
    - No utilice las API síncronas del sistema de archivos. Por ejemplo, si el archivo al que accede está en un [sistema de archivos distribuido](https://en.wikipedia.org/wiki/Clustered_file_system#Distributed_file_systems) como [NFS](https://en.wikipedia.org/wiki/Network_File_System), los tiempos de acceso pueden variar ampliamente.
- Proceso hijo:
    - `child_process.spawnSync`
    - `child_process.execSync`
    - `child_process.execFileSync`

Esta lista está razonablemente completa a partir de Node.js v9.


## Bloqueo del bucle de eventos: DOS de JSON

`JSON.parse` y `JSON.stringify` son otras operaciones potencialmente costosas. Si bien estas son O(n) en la longitud de la entrada, para n grandes pueden tardar sorprendentemente.

Si su servidor manipula objetos JSON, particularmente aquellos de un cliente, debe tener cuidado con el tamaño de los objetos o cadenas con los que trabaja en el bucle de eventos.

Ejemplo: bloqueo de JSON. Creamos un objeto `obj` de tamaño 2^21 y lo `JSON.stringify`amos, ejecutamos indexOf en la cadena y luego lo `JSON.parse`amos. La cadena `JSON.stringify`'d tiene 50 MB. Se tarda 0.7 segundos en convertir el objeto en cadena, 0.03 segundos en indexOf en la cadena de 50 MB y 1.3 segundos en analizar la cadena.

```js
let obj = { a: 1 };
let niter = 20;
let before, str, pos, res, took;
for (let i = 0; i < niter; i++) {
  obj = { obj1: obj, obj2: obj }; // Se duplica en tamaño cada iteración
}
before = process.hrtime();
str = JSON.stringify(obj);
took = process.hrtime(before);
console.log('JSON.stringify tardó ' + took);
before = process.hrtime();
pos = str.indexOf('nomatch');
took = process.hrtime(before);
console.log('Indexof puro tardó ' + took);
before = process.hrtime();
res = JSON.parse(str);
took = process.hrtime(before);
console.log('JSON.parse tardó ' + took);
```

Hay módulos npm que ofrecen API JSON asíncronas. Vea por ejemplo:

- [JSONStream](https://www.npmjs.com/package/JSONStream), que tiene API de flujo.
- [Big-Friendly JSON](https://www.npmjs.com/package/bfj), que tiene API de flujo, así como versiones asíncronas de las API JSON estándar que utilizan el paradigma de partición en el bucle de eventos que se describe a continuación.

## Cálculos complejos sin bloquear el bucle de eventos

Suponga que desea realizar cálculos complejos en JavaScript sin bloquear el bucle de eventos. Tiene dos opciones: partición o descarga.

### Partición

Podría *particionar* sus cálculos para que cada uno se ejecute en el bucle de eventos, pero ceda (da turnos a) regularmente a otros eventos pendientes. En JavaScript es fácil guardar el estado de una tarea en curso en un cierre, como se muestra en el ejemplo 2 a continuación.

Para un ejemplo simple, suponga que desea calcular el promedio de los números `1` a `n`.

Ejemplo 1: Promedio no particionado, cuesta `O(n)`

```js
for (let i = 0; i < n; i++) sum += i;
let avg = sum / n;
console.log('avg: ' + avg);
```

Ejemplo 2: Promedio particionado, cada uno de los `n` pasos asíncronos cuesta `O(1)`.

```js
function asyncAvg(n, avgCB) {
  // Guarda la suma en curso en el cierre JS.
  let sum = 0;
  function help(i, cb) {
    sum += i;
    if (i == n) {
      cb(sum);
      return;
    }
    // "Recursión asíncrona".
    // Programa la siguiente operación de forma asíncrona.
    setImmediate(help.bind(null, i + 1, cb));
  }
  // Inicia el ayudante, con CB para llamar a avgCB.
  help(1, function (sum) {
    let avg = sum / n;
    avgCB(avg);
  });
}
asyncAvg(n, function (avg) {
  console.log('promedio de 1-n: ' + avg);
});
```

Puede aplicar este principio a las iteraciones de matrices, etc.


### Descarga de trabajo

Si necesita hacer algo más complejo, la partición no es una buena opción. Esto se debe a que la partición solo usa el bucle de eventos, y no se beneficiará de los múltiples núcleos que casi con seguridad están disponibles en su máquina. **Recuerde, el bucle de eventos debe orquestar las solicitudes del cliente, no satisfacerlas por sí mismo.** Para una tarea complicada, mueva el trabajo fuera del bucle de eventos a un grupo de trabajadores.

#### Cómo descargar el trabajo

Tiene dos opciones para un grupo de trabajadores de destino al que descargar el trabajo.

1. Puede utilizar el grupo de trabajadores integrado de Node.js desarrollando un [complemento de C++](/es/nodejs/api/addons). En versiones anteriores de Node, cree su [complemento de C++](/es/nodejs/api/addons) utilizando [NAN](https://github.com/nodejs/nan), y en versiones más recientes utilice [N-API](/es/nodejs/api/n-api). [node-webworker-threads](https://www.npmjs.com/package/webworker-threads) ofrece una forma solo de JavaScript para acceder al grupo de trabajadores de Node.js.
2. Puede crear y administrar su propio grupo de trabajadores dedicado a la computación en lugar del grupo de trabajadores de Node.js con temática de E/S. Las formas más sencillas de hacer esto es utilizando [Proceso hijo](/es/nodejs/api/child_process) o [Clúster](/es/nodejs/api/cluster).

No debe simplemente crear un [Proceso hijo](/es/nodejs/api/child_process) para cada cliente. Puede recibir solicitudes de clientes más rápido de lo que puede crear y administrar hijos, y su servidor podría convertirse en una [bomba de bifurcación](https://en.wikipedia.org/wiki/Fork_bomb).

Desventajas de la descarga de trabajo
La desventaja del enfoque de descarga es que incurre en gastos generales en forma de costos de comunicación. Solo el bucle de eventos puede ver el "espacio de nombres" (estado de JavaScript) de su aplicación. Desde un trabajador, no puede manipular un objeto JavaScript en el espacio de nombres del bucle de eventos. En cambio, tiene que serializar y deserializar cualquier objeto que desee compartir. Luego, el trabajador puede operar en su propia copia de estos objetos y devolver el objeto modificado (o un "parche") al bucle de eventos.

Para las preocupaciones de serialización, consulte la sección sobre JSON DOS.

#### Algunas sugerencias para la descarga de trabajo

Es posible que desee distinguir entre tareas intensivas en CPU e intensivas en E/S porque tienen características marcadamente diferentes.

Una tarea intensiva en CPU solo avanza cuando se programa su trabajador, y el trabajador debe programarse en uno de los [núcleos lógicos](/es/nodejs/api/os) de su máquina. Si tiene 4 núcleos lógicos y 5 trabajadores, uno de estos trabajadores no puede avanzar. Como resultado, está pagando gastos generales (costos de memoria y programación) para este trabajador y no obteniendo ningún retorno por ello.

Las tareas intensivas en E/S implican consultar a un proveedor de servicios externo (DNS, sistema de archivos, etc.) y esperar su respuesta. Mientras un trabajador con una tarea intensiva en E/S está esperando su respuesta, no tiene nada más que hacer y puede ser desprogramado por el sistema operativo, dando a otro trabajador la oportunidad de enviar su solicitud. Por lo tanto, las tareas intensivas en E/S avanzarán incluso mientras el hilo asociado no se esté ejecutando. Los proveedores de servicios externos como las bases de datos y los sistemas de archivos se han optimizado enormemente para manejar muchas solicitudes pendientes simultáneamente. Por ejemplo, un sistema de archivos examinará un gran conjunto de solicitudes de escritura y lectura pendientes para fusionar actualizaciones conflictivas y recuperar archivos en un orden óptimo.

Si confía en un solo grupo de trabajadores, por ejemplo, el grupo de trabajadores de Node.js, entonces las diferentes características del trabajo limitado por CPU y limitado por E/S pueden dañar el rendimiento de su aplicación.

Por esta razón, es posible que desee mantener un grupo de trabajadores de computación separado.


### Descarga de tareas: conclusiones

Para tareas simples, como iterar sobre los elementos de un array arbitrariamente largo, la partición podría ser una buena opción. Si su cálculo es más complejo, la descarga de tareas es un mejor enfoque: los costos de comunicación, es decir, la sobrecarga de pasar objetos serializados entre el Bucle de Eventos y el Grupo de Trabajadores, se compensan con el beneficio de usar múltiples núcleos.

Sin embargo, si su servidor depende en gran medida de cálculos complejos, debería pensar si Node.js es realmente una buena opción. Node.js destaca para el trabajo ligado a I/O, pero para cálculos costosos podría no ser la mejor opción.

Si adopta el enfoque de descarga de tareas, consulte la sección sobre no bloquear el Grupo de Trabajadores.

### No bloquee el Grupo de Trabajadores
Node.js tiene un Grupo de Trabajadores compuesto por k Trabajadores. Si está utilizando el paradigma de Descarga de tareas discutido anteriormente, podría tener un Grupo de Trabajadores Computacional separado, al que se aplican los mismos principios. En cualquier caso, supongamos que k es mucho más pequeño que la cantidad de clientes que podría estar manejando concurrentemente. Esto está en consonancia con la filosofía de "un hilo para muchos clientes" de Node.js, el secreto de su escalabilidad.

Como se discutió anteriormente, cada Trabajador completa su Tarea actual antes de pasar a la siguiente en la cola del Grupo de Trabajadores.

Ahora, habrá variación en el costo de las Tareas necesarias para manejar las solicitudes de sus clientes. Algunas Tareas se pueden completar rápidamente (por ejemplo, leer archivos cortos o en caché, o producir una pequeña cantidad de bytes aleatorios), y otras tomarán más tiempo (por ejemplo, leer archivos más grandes o no almacenados en caché, o generar más bytes aleatorios). Su objetivo debe ser minimizar la variación en los tiempos de las Tareas, y debe usar la partición de Tareas para lograr esto.

#### Minimizar la variación en los tiempos de las Tareas

Si la Tarea actual de un Trabajador es mucho más costosa que otras Tareas, entonces no estará disponible para trabajar en otras Tareas pendientes. En otras palabras, cada Tarea relativamente larga disminuye efectivamente el tamaño del Grupo de Trabajadores en uno hasta que se completa. Esto es indeseable porque, hasta cierto punto, cuantos más Trabajadores haya en el Grupo de Trabajadores, mayor será el rendimiento del Grupo de Trabajadores (tareas/segundo) y, por lo tanto, mayor será el rendimiento del servidor (solicitudes de clientes/segundo). Un cliente con una Tarea relativamente costosa disminuirá el rendimiento del Grupo de Trabajadores, lo que a su vez disminuirá el rendimiento del servidor.

Para evitar esto, debe intentar minimizar la variación en la duración de las Tareas que envía al Grupo de Trabajadores. Si bien es apropiado tratar los sistemas externos a los que acceden sus solicitudes de E/S (DB, FS, etc.) como cajas negras, debe estar al tanto del costo relativo de estas solicitudes de E/S, y debe evitar enviar solicitudes que pueda esperar que sean particularmente largas.

Dos ejemplos deberían ilustrar la posible variación en los tiempos de las tareas.


#### Ejemplo de variación: Lecturas del sistema de archivos de larga duración

Supongamos que su servidor debe leer archivos para manejar algunas solicitudes del cliente. Después de consultar las API del [Sistema de archivos](/es/nodejs/api/fs) de Node.js, optó por usar `fs.readFile()` por simplicidad. Sin embargo, `fs.readFile()` (actualmente) no está particionado: envía una única `fs.read()` Tarea que abarca todo el archivo. Si lee archivos más cortos para algunos usuarios y archivos más largos para otros, `fs.readFile()` puede introducir una variación significativa en la duración de las Tareas, en detrimento del rendimiento del Worker Pool.

En el peor de los casos, supongamos que un atacante puede convencer a su servidor de que lea un archivo arbitrario (esta es una [vulnerabilidad de recorrido de directorio](https://www.owasp.org/index.php/Path_Traversal)). Si su servidor está ejecutando Linux, el atacante puede nombrar un archivo extremadamente lento: `/dev/random`. Para todos los fines prácticos, `/dev/random` es infinitamente lento, y cada Worker al que se le pida que lea desde `/dev/random` nunca terminará esa Tarea. Luego, un atacante envía k solicitudes, una para cada Worker, y ninguna otra solicitud del cliente que use el Worker Pool progresará.

#### Ejemplo de variación: Operaciones criptográficas de larga duración

Supongamos que su servidor genera bytes aleatorios criptográficamente seguros utilizando `crypto.randomBytes()`. `crypto.randomBytes()` no está particionado: crea una única tarea `randomBytes()` para generar tantos bytes como haya solicitado. Si crea menos bytes para algunos usuarios y más bytes para otros, `crypto.randomBytes()` es otra fuente de variación en la duración de las tareas.

### Partición de tareas

Las tareas con costos de tiempo variables pueden perjudicar el rendimiento del Worker Pool. Para minimizar la variación en los tiempos de las tareas, en la medida de lo posible, debe dividir cada tarea en subtareas de costo comparable. Cuando se complete cada subtarea, debe enviar la siguiente subtarea y, cuando se complete la subtarea final, debe notificar al remitente.

Para continuar con el ejemplo de `fs.readFile()`, en su lugar debería usar `fs.read()` (partición manual) o `ReadStream` (particionado automáticamente).

El mismo principio se aplica a las tareas vinculadas a la CPU; el ejemplo `asyncAvg` podría ser inapropiado para el bucle de eventos, pero es muy adecuado para el Worker Pool.

Cuando divide una tarea en subtareas, las tareas más cortas se expanden en una pequeña cantidad de subtareas y las tareas más largas se expanden en una mayor cantidad de subtareas. Entre cada subtarea de una tarea más larga, el Worker al que se le asignó puede trabajar en una subtarea de otra tarea más corta, mejorando así el rendimiento general de la tarea del Worker Pool.

Tenga en cuenta que el número de subtareas completadas no es una métrica útil para el rendimiento del Worker Pool. En cambio, preocúpese por el número de tareas completadas.


### Evitando la partición de tareas

Recuerde que el propósito de la partición de tareas es minimizar la variación en los tiempos de las tareas. Si puede distinguir entre tareas más cortas y tareas más largas (por ejemplo, sumar una matriz frente a ordenar una matriz), podría crear un grupo de trabajadores para cada clase de tarea. Enrutar las tareas más cortas y las tareas más largas a grupos de trabajadores separados es otra forma de minimizar la variación del tiempo de las tareas.

A favor de este enfoque, la partición de tareas implica una sobrecarga (los costos de crear una representación de tarea del grupo de trabajadores y de manipular la cola del grupo de trabajadores), y evitar la partición le ahorra los costos de viajes adicionales al grupo de trabajadores. También evita que cometa errores al particionar sus tareas.

La desventaja de este enfoque es que los trabajadores en todos estos grupos de trabajadores incurrirán en sobrecargas de espacio y tiempo y competirán entre sí por el tiempo de CPU. Recuerde que cada tarea ligada a la CPU avanza solo mientras está programada. Como resultado, solo debe considerar este enfoque después de un análisis cuidadoso.

### Grupo de trabajadores: conclusiones

Ya sea que use solo el grupo de trabajadores de Node.js o mantenga grupos de trabajadores separados, debe optimizar el rendimiento de las tareas de sus grupos.

Para hacer esto, minimice la variación en los tiempos de las tareas utilizando la partición de tareas.

## Los riesgos de los módulos npm

Si bien los módulos principales de Node.js ofrecen bloques de construcción para una amplia variedad de aplicaciones, a veces se necesita algo más. Los desarrolladores de Node.js se benefician enormemente del ecosistema npm, con cientos de miles de módulos que ofrecen funcionalidad para acelerar su proceso de desarrollo.

Recuerde, sin embargo, que la mayoría de estos módulos están escritos por desarrolladores externos y generalmente se publican solo con garantías de mejor esfuerzo. Un desarrollador que usa un módulo npm debe preocuparse por dos cosas, aunque esta última se olvida con frecuencia.

1. ¿Respeta sus API?
2. ¿Podrían sus API bloquear el bucle de eventos o un trabajador? Muchos módulos no hacen ningún esfuerzo por indicar el costo de sus API, en detrimento de la comunidad.

Para API simples, puede estimar el costo de las API; el costo de la manipulación de cadenas no es difícil de comprender. Pero en muchos casos, no está claro cuánto podría costar una API.

Si está llamando a una API que podría hacer algo costoso, verifique el costo. Pida a los desarrolladores que lo documenten o examine el código fuente usted mismo (y envíe una solicitud de extracción documentando el costo).

Recuerde, incluso si la API es asíncrona, no sabe cuánto tiempo podría pasar en un trabajador o en el bucle de eventos en cada una de sus particiones. Por ejemplo, suponga que en el ejemplo `asyncAvg` dado anteriormente, cada llamada a la función auxiliar sumaba la mitad de los números en lugar de uno de ellos. Entonces, esta función seguiría siendo asíncrona, pero el costo de cada partición sería `O(n)`, no `O(1)`, lo que hace que sea mucho menos seguro de usar para valores arbitrarios de `n`.


## Conclusión

Node.js tiene dos tipos de hilos: un Event Loop y k Workers. El Event Loop es responsable de las devoluciones de llamada de JavaScript y las E/S no bloqueantes, y un Worker ejecuta tareas correspondientes al código C++ que completa una solicitud asíncrona, incluyendo E/S bloqueantes y trabajo intensivo en CPU. Ambos tipos de hilos trabajan en no más de una actividad a la vez. Si cualquier devolución de llamada o tarea tarda mucho tiempo, el hilo que la ejecuta se bloquea. Si su aplicación realiza devoluciones de llamada o tareas bloqueantes, esto puede llevar a una degradación del rendimiento (clientes/segundo) en el mejor de los casos, y a una denegación de servicio completa en el peor.

Para escribir un servidor web de alto rendimiento y más a prueba de DoS, debe asegurarse de que, tanto con entradas benignas como maliciosas, ni su Event Loop ni sus Workers se bloqueen.

