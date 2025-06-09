---
title: Mejores prácticas de seguridad para aplicaciones de Node.js
description: Una guía completa para proteger aplicaciones de Node.js, cubriendo la modelización de amenazas, las mejores prácticas y la mitigación de vulnerabilidades comunes como el denegación de servicio, la reenlace de DNS y la exposición de información sensible.
head:
  - - meta
    - name: og:title
      content: Mejores prácticas de seguridad para aplicaciones de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Una guía completa para proteger aplicaciones de Node.js, cubriendo la modelización de amenazas, las mejores prácticas y la mitigación de vulnerabilidades comunes como el denegación de servicio, la reenlace de DNS y la exposición de información sensible.
  - - meta
    - name: twitter:title
      content: Mejores prácticas de seguridad para aplicaciones de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Una guía completa para proteger aplicaciones de Node.js, cubriendo la modelización de amenazas, las mejores prácticas y la mitigación de vulnerabilidades comunes como el denegación de servicio, la reenlace de DNS y la exposición de información sensible.
---


# Mejores Prácticas de Seguridad

### Intención

Este documento tiene la intención de ampliar el actual [modelo de amenazas](/es/nodejs/guide/security-best-practices#threat-model) y proporcionar pautas extensas sobre cómo proteger una aplicación Node.js.

## Contenido del Documento

- Mejores prácticas: Una forma simplificada y condensada de ver las mejores prácticas. Podemos usar [este issue](https://github.com/nodejs/security-wg/issues/488) o [esta guía](https://github.com/goldbergyoni/nodebestpractices) como punto de partida. Es importante tener en cuenta que este documento es específico de Node.js, si está buscando algo amplio, considere [OSSF Best Practices](https://github.com/ossf/wg-best-practices-os-developers).
- Ataques explicados: ilustrar y documentar en inglés sencillo con algunos ejemplos de código (si es posible) de los ataques que estamos mencionando en el modelo de amenazas.
- Librerías de Terceros: definir amenazas (ataques de typosquatting, paquetes maliciosos...) y mejores prácticas con respecto a las dependencias de los módulos de node, etc...

## Lista de Amenazas

### Denegación de Servicio del servidor HTTP (CWE-400)

Este es un ataque donde la aplicación deja de estar disponible para el propósito para el que fue diseñada debido a la forma en que procesa las solicitudes HTTP entrantes. Estas solicitudes no necesitan ser elaboradas deliberadamente por un actor malicioso: un cliente mal configurado o con errores también puede enviar un patrón de solicitudes al servidor que resulte en una denegación de servicio.

Las solicitudes HTTP son recibidas por el servidor HTTP de Node.js y entregadas al código de la aplicación a través del controlador de solicitudes registrado. El servidor no analiza el contenido del cuerpo de la solicitud. Por lo tanto, cualquier DoS causado por el contenido del cuerpo después de que se entrega al controlador de solicitudes no es una vulnerabilidad en Node.js en sí, ya que es responsabilidad del código de la aplicación manejarlo correctamente.

Asegúrese de que el WebServer gestione correctamente los errores de socket, por ejemplo, cuando se crea un servidor sin un controlador de errores, será vulnerable a DoS.

```javascript
import net from 'node:net'
const server = net.createServer(socket => {
  // socket.on('error', console.error) // esto evita que el servidor se bloquee
  socket.write('Servidor Echo\r\n')
  socket.pipe(socket)
})
server.listen(5000, '0.0.0.0')
```

_Si se realiza una solicitud incorrecta, el servidor podría bloquearse._

Un ejemplo de un ataque DoS que no es causado por el contenido de la solicitud es Slowloris. En este ataque, las solicitudes HTTP se envían lentamente y fragmentadas, un fragmento a la vez. Hasta que se entrega la solicitud completa, el servidor mantendrá los recursos dedicados a la solicitud en curso. Si se envían suficientes de estas solicitudes al mismo tiempo, la cantidad de conexiones concurrentes pronto alcanzará su máximo, lo que resultará en una denegación de servicio. Así es como el ataque depende no del contenido de la solicitud, sino del momento y el patrón de las solicitudes que se envían al servidor.


#### Mitigaciones

- Utilice un proxy inverso para recibir y reenviar solicitudes a la aplicación Node.js. Los proxies inversos pueden proporcionar almacenamiento en caché, equilibrio de carga, listas negras de IP, etc., lo que reduce la probabilidad de que un ataque DoS sea efectivo.
- Configure correctamente los tiempos de espera del servidor, de modo que las conexiones que están inactivas o donde las solicitudes llegan demasiado lentamente puedan descartarse. Consulte los diferentes tiempos de espera en `http.Server`, particularmente `headersTimeout`, `requestTimeout`, `timeout` y `keepAliveTimeout`.
- Limite el número de sockets abiertos por host y en total. Consulte los [documentos http](/es/nodejs/api/http), particularmente `agent.maxSockets`, `agent.maxTotalSockets`, `agent.maxFreeSockets` y `server.maxRequestsPerSocket`.

### Rebinding DNS (CWE-346)

Este es un ataque que puede dirigirse a aplicaciones Node.js que se ejecutan con el inspector de depuración habilitado usando el interruptor [--inspect](/es/nodejs/guide/debugging-nodejs).

Dado que los sitios web abiertos en un navegador web pueden realizar solicitudes WebSocket y HTTP, pueden dirigirse al inspector de depuración que se ejecuta localmente. Esto generalmente se evita mediante la [política del mismo origen](/es/nodejs/guide/debugging-nodejs) implementada por los navegadores modernos, que prohíbe que los scripts accedan a recursos de diferentes orígenes (lo que significa que un sitio web malicioso no puede leer datos solicitados desde una dirección IP local).

Sin embargo, a través del rebinding DNS, un atacante puede controlar temporalmente el origen de sus solicitudes para que parezcan originarse de una dirección IP local. Esto se hace controlando tanto un sitio web como el servidor DNS utilizado para resolver su dirección IP. Consulte [Wiki de Rebinding DNS](https://en.wikipedia.org/wiki/DNS_rebinding) para obtener más detalles.

#### Mitigaciones

- Deshabilite el inspector en la señal SIGUSR1 adjuntando un detector `process.on(‘SIGUSR1’, …)` a ella.
- No ejecute el protocolo del inspector en producción.

### Exposición de información confidencial a un actor no autorizado (CWE-552)

Todos los archivos y carpetas incluidos en el directorio actual se envían al registro npm durante la publicación del paquete.

Existen algunos mecanismos para controlar este comportamiento definiendo una lista de bloqueo con `.npmignore` y `.gitignore` o definiendo una lista de permitidos en `package.json`.


#### Mitigaciones

- Usar `npm publish --dry-run` para listar todos los archivos a publicar. Asegúrese de revisar el contenido antes de publicar el paquete.
- También es importante crear y mantener archivos de ignorar como `.gitignore` y `.npmignore`. A través de estos archivos, puede especificar qué archivos/carpetas no deben publicarse. La [propiedad files](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#files) en `package.json` permite la operación inversa `-- lista permitida`.
- En caso de una exposición, asegúrese de [despublicar el paquete](https://docs.npmjs.com/unpublishing-packages-from-the-registry).

### Contrabando de Solicitudes HTTP (CWE-444)

Este es un ataque que involucra a dos servidores HTTP (generalmente un proxy y una aplicación Node.js). Un cliente envía una solicitud HTTP que primero pasa por el servidor front-end (el proxy) y luego se redirige al servidor back-end (la aplicación). Cuando el front-end y el back-end interpretan solicitudes HTTP ambiguas de manera diferente, existe la posibilidad de que un atacante envíe un mensaje malicioso que no será visto por el front-end pero sí por el back-end, "contrabandeándolo" efectivamente más allá del servidor proxy.

Consulte el [CWE-444](https://cwe.mitre.org/data/definitions/444.html) para obtener una descripción y ejemplos más detallados.

Dado que este ataque depende de que Node.js interprete las solicitudes HTTP de manera diferente a un servidor HTTP (arbitrario), un ataque exitoso puede deberse a una vulnerabilidad en Node.js, el servidor front-end o ambos. Si la forma en que Node.js interpreta la solicitud es consistente con la especificación HTTP (consulte [RFC7230](https://datatracker.ietf.org/doc/html/rfc7230#section-3)), entonces no se considera una vulnerabilidad en Node.js.

#### Mitigaciones

- No use la opción `insecureHTTPParser` al crear un servidor HTTP.
- Configure el servidor front-end para normalizar las solicitudes ambiguas.
- Supervise continuamente las nuevas vulnerabilidades de contrabando de solicitudes HTTP tanto en Node.js como en el servidor front-end de su elección.
- Use HTTP/2 de extremo a extremo y desactive la degradación de HTTP si es posible.


### Exposición de Información a Través de Ataques de Temporización (CWE-208)

Este es un ataque que permite al atacante obtener información potencialmente sensible, por ejemplo, midiendo cuánto tiempo tarda la aplicación en responder a una solicitud. Este ataque no es específico de Node.js y puede dirigirse a casi todos los tiempos de ejecución.

El ataque es posible siempre que la aplicación utilice un secreto en una operación sensible al tiempo (por ejemplo, una bifurcación). Consideremos el manejo de la autenticación en una aplicación típica. Aquí, un método de autenticación básico incluye el correo electrónico y la contraseña como credenciales. La información del usuario se recupera de la entrada que el usuario ha proporcionado, idealmente desde un DBMS. Al recuperar la información del usuario, la contraseña se compara con la información del usuario recuperada de la base de datos. El uso de la comparación de cadenas incorporada toma más tiempo para los valores de la misma longitud. Esta comparación, cuando se ejecuta por una cantidad aceptable, aumenta involuntariamente el tiempo de respuesta de la solicitud. Al comparar los tiempos de respuesta de las solicitudes, un atacante puede adivinar la longitud y el valor de la contraseña en una gran cantidad de solicitudes.

#### Mitigaciones

- La API crypto expone una función `timingSafeEqual` para comparar los valores sensibles reales y esperados utilizando un algoritmo de tiempo constante.
- Para la comparación de contraseñas, puede utilizar el [scrypt](/es/nodejs/api/crypto) también disponible en el módulo crypto nativo.
- En términos más generales, evite el uso de secretos en operaciones de tiempo variable. Esto incluye la bifurcación en secretos y, cuando el atacante podría estar co-ubicado en la misma infraestructura (por ejemplo, la misma máquina en la nube), el uso de un secreto como índice en la memoria. Escribir código de tiempo constante en JavaScript es difícil (en parte debido al JIT). Para las aplicaciones criptográficas, utilice las API criptográficas integradas o WebAssembly (para algoritmos no implementados de forma nativa).

### Módulos Maliciosos de Terceros (CWE-1357)

Actualmente, en Node.js, cualquier paquete puede acceder a recursos poderosos como el acceso a la red. Además, debido a que también tienen acceso al sistema de archivos, pueden enviar cualquier dato a cualquier lugar.

Todo el código que se ejecuta en un proceso de nodo tiene la capacidad de cargar y ejecutar código arbitrario adicional mediante el uso de `eval()` (o sus equivalentes). Todo el código con acceso de escritura al sistema de archivos puede lograr lo mismo escribiendo en archivos nuevos o existentes que se cargan.

Node.js tiene un [mecanismo de política](/es/nodejs/api/permissions) experimental¹ para declarar el recurso cargado como no confiable o confiable. Sin embargo, esta política no está habilitada por defecto. Asegúrese de fijar las versiones de las dependencias y ejecutar comprobaciones automáticas de vulnerabilidades utilizando flujos de trabajo comunes o scripts npm. Antes de instalar un paquete, asegúrese de que este paquete se mantenga e incluya todo el contenido que esperaba. Tenga cuidado, el código fuente de GitHub no siempre es el mismo que el publicado, valídelo en `node_modules`.


#### Ataques a la cadena de suministro

Un ataque a la cadena de suministro en una aplicación Node.js ocurre cuando una de sus dependencias (ya sean directas o transitivas) se ve comprometida. Esto puede suceder ya sea porque la aplicación es demasiado laxa en la especificación de las dependencias (permitiendo actualizaciones no deseadas) y/o errores tipográficos comunes en la especificación (vulnerables a [typosquatting](https://en.wikipedia.org/wiki/Typosquatting)).

Un atacante que toma el control de un paquete ascendente puede publicar una nueva versión con código malicioso en ella. Si una aplicación Node.js depende de ese paquete sin ser estricta en cuanto a qué versión es segura de usar, el paquete puede actualizarse automáticamente a la última versión maliciosa, comprometiendo la aplicación.

Las dependencias especificadas en el archivo `package.json` pueden tener un número de versión exacto o un rango. Sin embargo, al fijar una dependencia a una versión exacta, sus dependencias transitivas no se fijan por sí mismas. Esto todavía deja a la aplicación vulnerable a actualizaciones no deseadas/inesperadas.

Posibles vectores de ataque:

- Ataques de Typosquatting
- Envenenamiento de Lockfile
- Mantenedores comprometidos
- Paquetes Maliciosos
- Confusiones de Dependencias

##### Mitigaciones

- Evite que npm ejecute scripts arbitrarios con `--ignore-scripts`
  - Adicionalmente, puede deshabilitarlo globalmente con `npm config set ignore-scripts true`
- Fije las versiones de las dependencias a una versión inmutable específica, no a una versión que sea un rango o de una fuente mutable.
- Use lockfiles, que fijan cada dependencia (directa y transitiva).
  - Use [Mitigaciones para el envenenamiento de lockfile](https://blog.ulisesgascon.com/lockfile-posioned).
- Automatice las comprobaciones de nuevas vulnerabilidades usando CI, con herramientas como [npm-audit](https://www.npmjs.com/package/npm-audit).
  - Se pueden usar herramientas como `Socket` para analizar paquetes con análisis estático para encontrar comportamientos riesgosos como el acceso a la red o al sistema de archivos.
- Use `npm ci` en lugar de `npm install`. Esto impone el lockfile de modo que las inconsistencias entre éste y el archivo `package.json` causen un error (en lugar de ignorar silenciosamente el lockfile a favor de `package.json`).
- Revise cuidadosamente el archivo `package.json` para detectar errores/errores tipográficos en los nombres de las dependencias.


### Violación de Acceso a la Memoria (CWE-284)

Los ataques basados en la memoria o en el heap dependen de una combinación de errores de gestión de memoria y un asignador de memoria explotable. Al igual que todos los runtimes, Node.js es vulnerable a estos ataques si tus proyectos se ejecutan en una máquina compartida. Usar un heap seguro es útil para prevenir que información sensible se filtre debido a sobrepasos y subpasos de punteros.

Desafortunadamente, un heap seguro no está disponible en Windows. Más información se puede encontrar en la [documentación de heap seguro](/es/nodejs/api/cli) de Node.js.

#### Mitigaciones

- Usa `--secure-heap=n` dependiendo de tu aplicación donde n es el tamaño máximo de bytes asignado.
- No ejecutes tu aplicación de producción en una máquina compartida.

### Monkey Patching (CWE-349)

Monkey patching se refiere a la modificación de propiedades en tiempo de ejecución con el objetivo de cambiar el comportamiento existente. Ejemplo:

```js
// eslint-disable-next-line no-extend-native
Array.prototype.push = function (item) {
  // overriding the global [].push
}
```

#### Mitigaciones

El flag `--frozen-intrinsics` habilita intrinsics congelados experimentales¹, lo que significa que todos los objetos y funciones incorporados de JavaScript están congelados recursivamente. Por lo tanto, el siguiente fragmento no sobrescribirá el comportamiento predeterminado de `Array.prototype.push`

```js
// eslint-disable-next-line no-extend-native
Array.prototype.push = function (item) {
  // overriding the global [].push
}
// Uncaught:
// TypeError <Object <Object <[Object: null prototype] {}>>>:
// Cannot assign to read only property 'push' of object '
```

Sin embargo, es importante mencionar que aún puedes definir nuevas variables globales y reemplazar las variables globales existentes usando `globalThis`

```bash
globalThis.foo = 3; foo; // you can still define new globals 3
globalThis.Array = 4; Array; // However, you can also replace existing globals 4
```

Por lo tanto, se puede usar `Object.freeze(globalThis)` para garantizar que no se reemplacen las variables globales.

### Ataques de Contaminación de Prototipos (CWE-1321)

La contaminación de prototipos se refiere a la posibilidad de modificar o inyectar propiedades en elementos del lenguaje Javascript abusando del uso de \__proto_, \_constructor, prototype y otras propiedades heredadas de prototipos integrados.

```js
const a = { a: 1, b: 2 }
const data = JSON.parse('{"__proto__": { "polluted": true}}')
const c = Object.assign({}, a, data)
console.log(c.polluted) // true
// Potential DoS
const data2 = JSON.parse('{"__proto__": null}')
const d = Object.assign(a, data2)
d.hasOwnProperty('b') // Uncaught TypeError: d.hasOwnProperty is not a function
```

Esta es una vulnerabilidad potencial heredada del lenguaje JavaScript.


#### Ejemplos

- [CVE-2022-21824](https://www.cvedetails.com/cve/CVE-2022-21824/) (Node.js)
- [CVE-2018-3721](https://www.cvedetails.com/cve/CVE-2018-3721/) (Librería de terceros: Lodash)

#### Mitigaciones

- Evitar [combinaciones recursivas inseguras](https://gist.github.com/DaniAkash/b3d7159fddcff0a9ee035bd10e34b277#file-unsafe-merge-js), ver [CVE-2018-16487](https://www.cve.org/CVERecord?id=CVE-2018-16487).
- Implementar validaciones de esquema JSON para solicitudes externas/no confiables.
- Crear objetos sin prototipo usando `Object.create(null)`.
- Congelar el prototipo: `Object.freeze(MyObject.prototype)`.
- Deshabilitar la propiedad `Object.prototype.__proto__` usando el flag `--disable-proto`.
- Verificar que la propiedad exista directamente en el objeto, no desde el prototipo usando `Object.hasOwn(obj, keyFromObj)`.
- Evitar usar métodos de `Object.prototype`.

### Elemento de Ruta de Búsqueda No Controlado (CWE-427)

Node.js carga módulos siguiendo el [Algoritmo de Resolución de Módulos](/es/nodejs/api/modules). Por lo tanto, asume que el directorio en el que se solicita un módulo (require) es confiable.

Con esto, significa que se espera el siguiente comportamiento de la aplicación. Asumiendo la siguiente estructura de directorios:

- app/
  - server.js
  - auth.js
  - auth

Si server.js usa `require('./auth')` seguirá el algoritmo de resolución de módulos y cargará auth en lugar de `auth.js`.

#### Mitigaciones

Usar el [mecanismo de políticas con verificación de integridad](/es/nodejs/api/permissions) experimental¹ puede evitar la amenaza anterior. Para el directorio descrito anteriormente, se puede usar el siguiente `policy.json`

```json
{
  "resources": {
    "./app/auth.js": {
      "integrity": "sha256-iuGZ6SFVFpMuHUcJciQTIKpIyaQVigMZlvg9Lx66HV8="
    },
    "./app/server.js": {
      "dependencies": {
        "./auth": "./app/auth.js"
      },
      "integrity": "sha256-NPtLCQ0ntPPWgfVEgX46ryTNpdvTWdQPoZO3kHo0bKI="
    }
  }
}
```

Por lo tanto, al requerir el módulo auth, el sistema validará la integridad y lanzará un error si no coincide con el esperado.

```bash
» node --experimental-policy=policy.json app/server.js
node:internal/policy/sri:65
      throw new ERR_SRI_PARSE(str, str[prevIndex], prevIndex);
      ^
SyntaxError [ERR_SRI_PARSE]: Subresource Integrity string "sha256-iuGZ6SFVFpMuHUcJciQTIKpIyaQVigMZlvg9Lx66HV8=%" had an unexpected "%" at position 51
    at new NodeError (node:internal/errors:393:5)
    at Object.parse (node:internal/policy/sri:65:13)
    at processEntry (node:internal/policy/manifest:581:38)
    at Manifest.assertIntegrity (node:internal/policy/manifest:588:32)
    at Module._compile (node:internal/modules/cjs/loader:1119:21)
    at Module._extensions..js (node:internal/modules/cjs/loader:1213:10)
    at Module.load (node:internal/modules/cjs/loader:1037:32)
    at Module._load (node:internal/modules/cjs/loader:878:12)
    at Module.require (node:internal/modules/cjs/loader:1061:19)
    at require (node:internal/modules/cjs/helpers:99:18) {
  code: 'ERR_SRI_PARSE'
}
```

Nota, siempre se recomienda el uso de `--policy-integrity` para evitar mutaciones de políticas.


## Funciones Experimentales en Producción

No se recomienda el uso de funciones experimentales en producción. Las funciones experimentales pueden sufrir cambios importantes si es necesario, y su funcionalidad no es estable de forma segura. Sin embargo, los comentarios son muy apreciados.

## Herramientas OpenSSF

La [OpenSSF](https://www.openssf.org) está liderando varias iniciativas que pueden ser muy útiles, especialmente si planea publicar un paquete npm. Estas iniciativas incluyen:

- [OpenSSF Scorecard](https://securityscorecards.dev/) Scorecard evalúa proyectos de código abierto utilizando una serie de comprobaciones automatizadas de riesgo de seguridad. Puede utilizarlo para evaluar de forma proactiva las vulnerabilidades y dependencias en su base de código y tomar decisiones informadas sobre la aceptación de vulnerabilidades.
- [OpenSSF Best Practices Badge Program](https://bestpractices.coreinfrastructure.org/en) Los proyectos pueden auto-certificarse voluntariamente describiendo cómo cumplen con cada práctica recomendada. Esto generará una insignia que se puede agregar al proyecto.

