---
title: Análisis de rendimiento de aplicaciones Node.js
description: Aprenda a utilizar el perfilador integrado de Node.js para identificar cuellos de botella de rendimiento en su aplicación y mejorar su rendimiento.
head:
  - - meta
    - name: og:title
      content: Análisis de rendimiento de aplicaciones Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Aprenda a utilizar el perfilador integrado de Node.js para identificar cuellos de botella de rendimiento en su aplicación y mejorar su rendimiento.
  - - meta
    - name: twitter:title
      content: Análisis de rendimiento de aplicaciones Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Aprenda a utilizar el perfilador integrado de Node.js para identificar cuellos de botella de rendimiento en su aplicación y mejorar su rendimiento.
---


# Perfilado de Aplicaciones Node.js

Hay muchas herramientas de terceros disponibles para perfilar aplicaciones Node.js pero, en muchos casos, la opción más sencilla es utilizar el perfilador integrado de Node.js. El perfilador integrado utiliza el [perfilador dentro de V8](https://v8.dev/docs/profile) que muestrea la pila a intervalos regulares durante la ejecución del programa. Registra los resultados de estas muestras, junto con eventos de optimización importantes como las compilaciones jit, como una serie de ticks:

```bash
code-creation,LazyCompile,0,0x2d5000a337a0,396,"bp native array.js:1153:16",0x289f644df68,~
code-creation,LazyCompile,0,0x2d5000a33940,716,"hasOwnProperty native v8natives.js:198:30",0x289f64438d0,~
code-creation,LazyCompile,0,0x2d5000a33c20,284,"ToName native runtime.js:549:16",0x289f643bb28,~
code-creation,Stub,2,0x2d5000a33d40,182,"DoubleToIStub"
code-creation,Stub,2,0x2d5000a33e00,507,"NumberToStringStub"
```
En el pasado, se necesitaba el código fuente de V8 para poder interpretar los ticks. Afortunadamente, desde Node.js 4.4.0 se han introducido herramientas que facilitan el consumo de esta información sin necesidad de construir V8 desde la fuente por separado. Veamos cómo el perfilador integrado puede ayudar a comprender el rendimiento de la aplicación.

Para ilustrar el uso del perfilador de ticks, trabajaremos con una aplicación Express sencilla. Nuestra aplicación tendrá dos controladores, uno para añadir nuevos usuarios a nuestro sistema:

```javascript
app.get('/newUser', (req, res) => {
  let username = req.query.username || '';
  const password = req.query.password || '';
  username = username.replace(/[!@#$%^&*]/g, '');
  if (!username || !password || users[username]) {
    return res.sendStatus(400);
  }
  const salt = crypto.randomBytes(128).toString('base64');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512');
  users[username] = { salt, hash };
  res.sendStatus(200);
});
```

y otro para validar los intentos de autenticación de usuarios:

```javascript
app.get('/auth', (req, res) => {
  let username = req.query.username || '';
  const password = req.query.password || '';
  username = username.replace(/[!@#$%^&*]/g, '');
  if (!username || !password || !users[username]) {
    return res.sendStatus(400);
  }
  const { salt, hash } = users[username];
  const encryptHash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512');
  if (crypto.timingSafeEqual(hash, encryptHash)) {
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});
```

*Por favor, tenga en cuenta que estos NO son controladores recomendados para autenticar usuarios en sus aplicaciones Node.js y se utilizan puramente con fines ilustrativos. En general, no debería intentar diseñar sus propios mecanismos de autenticación criptográfica. Es mucho mejor utilizar soluciones de autenticación existentes y probadas.*

Ahora supongamos que hemos desplegado nuestra aplicación y los usuarios se quejan de una alta latencia en las peticiones. Podemos ejecutar fácilmente la aplicación con el perfilador integrado:

```bash
NODE_ENV=production node --prof app.js
```

y poner algo de carga en el servidor usando `ab` (ApacheBench):

```bash
curl -X GET "http://localhost:8080/newUser?username=matt&password=password"
ab -k -c 20 -n 250 "http://localhost:8080/auth?username=matt&password=password"
```

y obtener una salida ab de:

```bash
Concurrency Level:      20
Time taken for tests:   46.932 seconds
Complete requests:      250
Failed requests:        0
Keep-Alive requests:    250
Total transferred:      50250 bytes
HTML transferred:       500 bytes
Requests per second:    5.33 [#/sec] (mean)
Time per request:       3754.556 [ms] (mean)
Time per request:       187.728 [ms] (mean, across all concurrent requests)
Transfer rate:          1.05 [Kbytes/sec] received
...
Percentage of the requests served within a certain time (ms)
  50%   3755
  66%   3804
  75%   3818
  80%   3825
  90%   3845
  95%   3858
  98%   3874
  99%   3875
 100%   4225 (longest request)
```

De esta salida, vemos que sólo estamos consiguiendo servir unas 5 peticiones por segundo y que la petición media tarda poco menos de 4 segundos en ir y volver. En un ejemplo del mundo real, podríamos estar haciendo mucho trabajo en muchas funciones en nombre de una petición de usuario, pero incluso en nuestro sencillo ejemplo, se podría perder tiempo compilando expresiones regulares, generando sales aleatorias, generando hashes únicos a partir de contraseñas de usuario o dentro del propio framework Express.

Como hemos ejecutado nuestra aplicación utilizando la opción `--prof`, se ha generado un archivo de ticks en el mismo directorio que su ejecución local de la aplicación. Debería tener la forma `isolate-0xnnnnnnnnnnnn-v8.log` (donde n es un dígito).

Para darle sentido a este archivo, necesitamos utilizar el procesador de ticks incluido con el binario de Node.js. Para ejecutar el procesador, utilice la bandera `--prof-process`:

```bash
node --prof-process isolate-0xnnnnnnnnnnnn-v8.log > processed.txt
```

Abrir processed.txt en su editor de texto favorito le dará algunos tipos diferentes de información. El archivo se divide en secciones que a su vez se dividen por lenguaje. Primero, miramos la sección de resumen y vemos:

```bash
[Summary]:
   ticks  total  nonlib   name
     79    0.2%    0.2%  JavaScript
  36703   97.2%   99.2%  C++
      7    0.0%    0.0%  GC
    767    2.0%          Shared libraries
    215    0.6%          Unaccounted
```

Esto nos dice que el 97% de todas las muestras recogidas ocurrieron en código C++ y que al ver otras secciones de la salida procesada deberíamos prestar más atención al trabajo que se está haciendo en C++ (en contraposición a JavaScript). Con esto en mente, a continuación encontramos la sección [C++] que contiene información sobre qué funciones C++ están tomando más tiempo de CPU y vemos:

```bash
 [C++]:
   ticks  total  nonlib   name
  19557   51.8%   52.9%  node::crypto::PBKDF2(v8::FunctionCallbackInfo<v8::Value> const&)
   4510   11.9%   12.2%  _sha1_block_data_order
   3165    8.4%    8.6%  _malloc_zone_malloc
```

Vemos que las 3 entradas principales representan el 72.1% del tiempo de CPU consumido por el programa. De esta salida, vemos inmediatamente que al menos el 51.8% del tiempo de CPU es consumido por una función llamada PBKDF2 que corresponde a nuestra generación de hash a partir de la contraseña de un usuario. Sin embargo, puede no ser inmediatamente obvio cómo las dos entradas inferiores influyen en nuestra aplicación (o si lo es, fingiremos lo contrario en aras del ejemplo). Para entender mejor la relación entre estas funciones, a continuación veremos la sección [Bottom up (heavy) profile] que proporciona información sobre las principales llamadas de cada función. Examinando esta sección, encontramos:

```bash
  ticks parent  name
  19557   51.8%  node::crypto::PBKDF2(v8::FunctionCallbackInfo<v8::Value> const&)
  19557  100.0%    v8::internal::Builtins::~Builtins()
  19557  100.0%      LazyCompile: ~pbkdf2 crypto.js:557:16
   4510   11.9%  _sha1_block_data_order
   4510  100.0%    LazyCompile: *pbkdf2 crypto.js:557:16
   4510  100.0%      LazyCompile: *exports.pbkdf2Sync crypto.js:552:30
   3165    8.4%  _malloc_zone_malloc
   3161   99.9%    LazyCompile: *pbkdf2 crypto.js:557:16
   3161  100.0%      LazyCompile: *exports.pbkdf2Sync crypto.js:552:30
```

Analizar esta sección requiere un poco más de trabajo que los recuentos de ticks brutos anteriores. Dentro de cada una de las "pilas de llamadas" anteriores, el porcentaje en la columna parent le indica el porcentaje de muestras para las cuales la función en la fila superior fue llamada por la función en la fila actual. Por ejemplo, en la "pila de llamadas" central anterior para `_sha1_block_data_order`, vemos que `_sha1_block_data_order` ocurrió en el 11.9% de las muestras, lo cual sabíamos por los recuentos brutos anteriores. Sin embargo, aquí, también podemos decir que siempre fue llamada por la función pbkdf2 dentro del módulo crypto de Node.js. Vemos que, de manera similar, _malloc_zone_malloc fue llamada casi exclusivamente por la misma función pbkdf2. Por lo tanto, utilizando la información en esta vista, podemos decir que nuestra computación de hash a partir de la contraseña del usuario representa no sólo el 51.8% de arriba, sino también todo el tiempo de CPU en las 3 funciones más muestreadas, ya que las llamadas a `_sha1_block_data_order` y `_malloc_zone_malloc` se hicieron en nombre de la función pbkdf2.

En este punto, está muy claro que la generación de hash basada en la contraseña debería ser el objetivo de nuestra optimización. Afortunadamente, usted ha internalizado completamente los [beneficios de la programación asíncrona](https://nodesource.com/blog/why-asynchronous) y se da cuenta de que el trabajo para generar un hash a partir de la contraseña del usuario se está haciendo de forma síncrona y, por lo tanto, atando el bucle de eventos. Esto nos impide trabajar en otras peticiones entrantes mientras computamos un hash.

Para remediar este problema, usted hace una pequeña modificación a los controladores anteriores para utilizar la versión asíncrona de la función pbkdf2:

```javascript
app.get('/auth', (req, res) => {
  let username = req.query.username || '';
  const password = req.query.password || '';
  username = username.replace(/[!@#$%^&*]/g, '');
  if (!username || !password || !users[username]) {
    return res.sendStatus(400);
  }
  crypto.pbkdf2(
    password,
    users[username].salt,
    10000,
    512,
    'sha512',
    (err, hash) => {
      if (users[username].hash.toString() === hash.toString()) {
        res.sendStatus(200);
      } else {
        res.sendStatus(401);
      }
    }
  );
});
```

Una nueva ejecución del benchmark ab anterior con la versión asíncrona de su aplicación produce:

```bash
Concurrency Level:      20
Time taken for tests:   12.846 seconds
Complete requests:      250
Failed requests:        0
Keep-Alive requests:    250
Total transferred:      50250 bytes
HTML transferred:       500 bytes
Requests per second:    19.46 [#/sec] (mean)
Time per request:       1027.689 [ms] (mean)
Time per request:       51.384 [ms] (mean, across all concurrent requests)
Transfer rate:          3.82 [Kbytes/sec] received
...
Percentage of the requests served within a certain time (ms)
  50%   1018
  66%   1035
  75%   1041
  80%   1043
  90%   1049
  95%   1063
  98%   1070
  99%   1071
 100%   1079 (longest request)
```

¡Bien! Su aplicación ahora está sirviendo alrededor de 20 peticiones por segundo, aproximadamente 4 veces más de lo que estaba con la generación de hash síncrona. Además, la latencia media ha bajado de los 4 segundos anteriores a poco más de 1 segundo.

Esperamos que, a través de la investigación del rendimiento de este ejemplo (ciertamente artificioso), haya visto cómo el procesador de ticks V8 puede ayudarle a obtener una mejor comprensión del rendimiento de sus aplicaciones Node.js.

También puede encontrar [cómo crear un gráfico de llamas útil](/es/nodejs/guide/flame-graphs).

