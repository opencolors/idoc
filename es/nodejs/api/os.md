---
title: Documentación del módulo OS de Node.js
description: El módulo OS de Node.js proporciona varios métodos utilitarios relacionados con el sistema operativo. Puede usarse para interactuar con el sistema operativo subyacente, obtener información del sistema y realizar operaciones a nivel de sistema.
head:
  - - meta
    - name: og:title
      content: Documentación del módulo OS de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: El módulo OS de Node.js proporciona varios métodos utilitarios relacionados con el sistema operativo. Puede usarse para interactuar con el sistema operativo subyacente, obtener información del sistema y realizar operaciones a nivel de sistema.
  - - meta
    - name: twitter:title
      content: Documentación del módulo OS de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: El módulo OS de Node.js proporciona varios métodos utilitarios relacionados con el sistema operativo. Puede usarse para interactuar con el sistema operativo subyacente, obtener información del sistema y realizar operaciones a nivel de sistema.
---


# SO {#os}

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable
:::

**Código Fuente:** [lib/os.js](https://github.com/nodejs/node/blob/v23.5.0/lib/os.js)

El módulo `node:os` proporciona métodos y propiedades de utilidad relacionados con el sistema operativo. Se puede acceder usando:



::: code-group
```js [ESM]
import os from 'node:os';
```

```js [CJS]
const os = require('node:os');
```
:::

## `os.EOL` {#oseol}

**Agregado en: v0.7.8**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

El marcador de fin de línea específico del sistema operativo.

- `\n` en POSIX
- `\r\n` en Windows

## `os.availableParallelism()` {#osavailableparallelism}

**Agregado en: v19.4.0, v18.14.0**

- Devuelve: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Devuelve una estimación de la cantidad predeterminada de paralelismo que un programa debería usar. Siempre devuelve un valor mayor que cero.

Esta función es un pequeño envoltorio sobre [`uv_available_parallelism()`](https://docs.libuv.org/en/v1.x/misc#c.uv_available_parallelism) de libuv.

## `os.arch()` {#osarch}

**Agregado en: v0.5.0**

- Devuelve: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Devuelve la arquitectura de la CPU del sistema operativo para la que se compiló el binario de Node.js. Los valores posibles son `'arm'`, `'arm64'`, `'ia32'`, `'loong64'`, `'mips'`, `'mipsel'`, `'ppc'`, `'ppc64'`, `'riscv64'`, `'s390'`, `'s390x'` y `'x64'`.

El valor de retorno es equivalente a [`process.arch`](/es/nodejs/api/process#processarch).

## `os.constants` {#osconstants}

**Agregado en: v6.3.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Contiene constantes específicas del sistema operativo de uso común para códigos de error, señales de proceso, etc. Las constantes específicas definidas se describen en [Constantes del SO](/es/nodejs/api/os#os-constants).

## `os.cpus()` {#oscpus}

**Agregado en: v0.3.3**

- Devuelve: [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Devuelve un array de objetos que contiene información sobre cada núcleo lógico de la CPU. El array estará vacío si no hay información disponible sobre la CPU, por ejemplo, si el sistema de archivos `/proc` no está disponible.

Las propiedades incluidas en cada objeto incluyen:

- `model` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `speed` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) (en MHz)
- `times` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `user` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de milisegundos que la CPU ha pasado en modo de usuario.
    - `nice` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de milisegundos que la CPU ha pasado en modo nice.
    - `sys` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de milisegundos que la CPU ha pasado en modo sys.
    - `idle` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de milisegundos que la CPU ha pasado en modo inactivo.
    - `irq` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de milisegundos que la CPU ha pasado en modo irq.
  
 

```js [ESM]
[
  {
    model: 'Intel(R) Core(TM) i7 CPU         860  @ 2.80GHz',
    speed: 2926,
    times: {
      user: 252020,
      nice: 0,
      sys: 30340,
      idle: 1070356870,
      irq: 0,
    },
  },
  {
    model: 'Intel(R) Core(TM) i7 CPU         860  @ 2.80GHz',
    speed: 2926,
    times: {
      user: 306960,
      nice: 0,
      sys: 26980,
      idle: 1071569080,
      irq: 0,
    },
  },
  {
    model: 'Intel(R) Core(TM) i7 CPU         860  @ 2.80GHz',
    speed: 2926,
    times: {
      user: 248450,
      nice: 0,
      sys: 21750,
      idle: 1070919370,
      irq: 0,
    },
  },
  {
    model: 'Intel(R) Core(TM) i7 CPU         860  @ 2.80GHz',
    speed: 2926,
    times: {
      user: 256880,
      nice: 0,
      sys: 19430,
      idle: 1070905480,
      irq: 20,
    },
  },
]
```
Los valores `nice` son solo de POSIX. En Windows, los valores `nice` de todos los procesadores son siempre 0.

`os.cpus().length` no debe usarse para calcular la cantidad de paralelismo disponible para una aplicación. Use [`os.availableParallelism()`](/es/nodejs/api/os#osavailableparallelism) para este propósito.


## `os.devNull` {#osdevnull}

**Agregado en: v16.3.0, v14.18.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La ruta del archivo específica de la plataforma para el dispositivo nulo.

- `\\.\nul` en Windows
- `/dev/null` en POSIX

## `os.endianness()` {#osendianness}

**Agregado en: v0.9.4**

- Devuelve: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Devuelve una cadena que identifica el endianness de la CPU para la que se compiló el binario de Node.js.

Los valores posibles son `'BE'` para big endian y `'LE'` para little endian.

## `os.freemem()` {#osfreemem}

**Agregado en: v0.3.3**

- Devuelve: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Devuelve la cantidad de memoria libre del sistema en bytes como un entero.

## `os.getPriority([pid])` {#osgetprioritypid}

**Agregado en: v10.10.0**

- `pid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El ID del proceso para el que se va a recuperar la prioridad de programación. **Predeterminado:** `0`.
- Devuelve: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Devuelve la prioridad de programación para el proceso especificado por `pid`. Si no se proporciona `pid` o es `0`, se devuelve la prioridad del proceso actual.

## `os.homedir()` {#oshomedir}

**Agregado en: v2.3.0**

- Devuelve: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Devuelve la ruta de cadena del directorio de inicio del usuario actual.

En POSIX, utiliza la variable de entorno `$HOME` si está definida. De lo contrario, utiliza el [UID efectivo](https://en.wikipedia.org/wiki/User_identifier#Effective_user_ID) para buscar el directorio de inicio del usuario.

En Windows, utiliza la variable de entorno `USERPROFILE` si está definida. De lo contrario, utiliza la ruta al directorio de perfil del usuario actual.

## `os.hostname()` {#oshostname}

**Agregado en: v0.3.3**

- Devuelve: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Devuelve el nombre de host del sistema operativo como una cadena.


## `os.loadavg()` {#osloadavg}

**Añadido en: v0.3.3**

- Retorna: [\<number[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Retorna un array que contiene los promedios de carga de 1, 5 y 15 minutos.

El promedio de carga es una medida de la actividad del sistema calculada por el sistema operativo y expresada como un número fraccionario.

El promedio de carga es un concepto específico de Unix. En Windows, el valor de retorno es siempre `[0, 0, 0]`.

## `os.machine()` {#osmachine}

**Añadido en: v18.9.0, v16.18.0**

- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retorna el tipo de máquina como una cadena, como `arm`, `arm64`, `aarch64`, `mips`, `mips64`, `ppc64`, `ppc64le`, `s390`, `s390x`, `i386`, `i686`, `x86_64`.

En sistemas POSIX, el tipo de máquina se determina llamando a [`uname(3)`](https://linux.die.net/man/3/uname). En Windows, se utiliza `RtlGetVersion()`, y si no está disponible, se utilizará `GetVersionExW()`. Consulta [https://en.wikipedia.org/wiki/Uname#Examples](https://en.wikipedia.org/wiki/Uname#Examples) para obtener más información.

## `os.networkInterfaces()` {#osnetworkinterfaces}


::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v18.4.0 | La propiedad `family` ahora retorna una cadena en lugar de un número. |
| v18.0.0 | La propiedad `family` ahora retorna un número en lugar de una cadena. |
| v0.6.0 | Añadido en: v0.6.0 |
:::

- Retorna: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Retorna un objeto que contiene interfaces de red a las que se les ha asignado una dirección de red.

Cada clave en el objeto retornado identifica una interfaz de red. El valor asociado es un array de objetos que describen cada uno una dirección de red asignada.

Las propiedades disponibles en el objeto de dirección de red asignada incluyen:

- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La dirección IPv4 o IPv6 asignada
- `netmask` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La máscara de red IPv4 o IPv6
- `family` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Ya sea `IPv4` o `IPv6`
- `mac` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La dirección MAC de la interfaz de red
- `internal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` si la interfaz de red es un bucle invertido o una interfaz similar que no es accesible de forma remota; de lo contrario, `false`
- `scopeid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El ID de alcance numérico IPv6 (solo se especifica cuando `family` es `IPv6`)
- `cidr` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La dirección IPv4 o IPv6 asignada con el prefijo de enrutamiento en notación CIDR. Si la `netmask` no es válida, esta propiedad se establece en `null`.

```js [ESM]
{
  lo: [
    {
      address: '127.0.0.1',
      netmask: '255.0.0.0',
      family: 'IPv4',
      mac: '00:00:00:00:00:00',
      internal: true,
      cidr: '127.0.0.1/8'
    },
    {
      address: '::1',
      netmask: 'ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff',
      family: 'IPv6',
      mac: '00:00:00:00:00:00',
      scopeid: 0,
      internal: true,
      cidr: '::1/128'
    }
  ],
  eth0: [
    {
      address: '192.168.1.108',
      netmask: '255.255.255.0',
      family: 'IPv4',
      mac: '01:02:03:0a:0b:0c',
      internal: false,
      cidr: '192.168.1.108/24'
    },
    {
      address: 'fe80::a00:27ff:fe4e:66a1',
      netmask: 'ffff:ffff:ffff:ffff::',
      family: 'IPv6',
      mac: '01:02:03:0a:0b:0c',
      scopeid: 1,
      internal: false,
      cidr: 'fe80::a00:27ff:fe4e:66a1/64'
    }
  ]
}
```

## `os.platform()` {#osplatform}

**Agregado en: v0.5.0**

- Devuelve: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Devuelve una cadena que identifica la plataforma del sistema operativo para la que se compiló el binario de Node.js. El valor se establece en tiempo de compilación. Los valores posibles son `'aix'`, `'darwin'`, `'freebsd'`, `'linux'`, `'openbsd'`, `'sunos'` y `'win32'`.

El valor devuelto es equivalente a [`process.platform`](/es/nodejs/api/process#processplatform).

También se puede devolver el valor `'android'` si Node.js está construido sobre el sistema operativo Android. [El soporte de Android es experimental](https://github.com/nodejs/node/blob/HEAD/BUILDING.md#android).

## `os.release()` {#osrelease}

**Agregado en: v0.3.3**

- Devuelve: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Devuelve el sistema operativo como una cadena.

En los sistemas POSIX, la versión del sistema operativo se determina llamando a [`uname(3)`](https://linux.die.net/man/3/uname). En Windows, se utiliza `GetVersionExW()`. Consulte [https://en.wikipedia.org/wiki/Uname#Examples](https://en.wikipedia.org/wiki/Uname#Examples) para obtener más información.

## `os.setPriority([pid, ]priority)` {#ossetprioritypid-priority}

**Agregado en: v10.10.0**

- `pid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El ID del proceso para establecer la prioridad de programación. **Predeterminado:** `0`.
- `priority` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La prioridad de programación para asignar al proceso.

Intenta establecer la prioridad de programación para el proceso especificado por `pid`. Si no se proporciona `pid` o es `0`, se utiliza el ID del proceso actual.

La entrada `priority` debe ser un entero entre `-20` (alta prioridad) y `19` (baja prioridad). Debido a las diferencias entre los niveles de prioridad de Unix y las clases de prioridad de Windows, `priority` se asigna a una de las seis constantes de prioridad en `os.constants.priority`. Al recuperar un nivel de prioridad de proceso, esta asignación de rango puede hacer que el valor devuelto sea ligeramente diferente en Windows. Para evitar confusiones, establezca `priority` en una de las constantes de prioridad.

En Windows, establecer la prioridad en `PRIORITY_HIGHEST` requiere privilegios de usuario elevados. De lo contrario, la prioridad establecida se reducirá silenciosamente a `PRIORITY_HIGH`.


## `os.tmpdir()` {#ostmpdir}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v2.0.0 | Esta función ahora es consistente entre plataformas y ya no devuelve una ruta con una barra inclinada final en ninguna plataforma. |
| v0.9.9 | Añadido en: v0.9.9 |
:::

- Devuelve: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Devuelve el directorio predeterminado del sistema operativo para archivos temporales como una cadena.

En Windows, el resultado puede ser anulado por las variables de entorno `TEMP` y `TMP`, y `TEMP` tiene prioridad sobre `TMP`. Si ninguno está configurado, por defecto es `%SystemRoot%\temp` o `%windir%\temp`.

En plataformas que no son Windows, las variables de entorno `TMPDIR`, `TMP` y `TEMP` se verificarán para anular el resultado de este método, en el orden descrito. Si ninguno de ellos está configurado, por defecto es `/tmp`.

Algunas distribuciones de sistemas operativos configurarían `TMPDIR` (no Windows) o `TEMP` y `TMP` (Windows) de forma predeterminada sin configuraciones adicionales por parte de los administradores del sistema. El resultado de `os.tmpdir()` normalmente refleja la preferencia del sistema a menos que los usuarios lo anulen explícitamente.

## `os.totalmem()` {#ostotalmem}

**Añadido en: v0.3.3**

- Devuelve: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Devuelve la cantidad total de memoria del sistema en bytes como un entero.

## `os.type()` {#ostype}

**Añadido en: v0.3.3**

- Devuelve: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Devuelve el nombre del sistema operativo tal como lo devuelve [`uname(3)`](https://linux.die.net/man/3/uname). Por ejemplo, devuelve `'Linux'` en Linux, `'Darwin'` en macOS y `'Windows_NT'` en Windows.

Consulte [https://en.wikipedia.org/wiki/Uname#Examples](https://en.wikipedia.org/wiki/Uname#Examples) para obtener información adicional sobre la salida de la ejecución de [`uname(3)`](https://linux.die.net/man/3/uname) en varios sistemas operativos.

## `os.uptime()` {#osuptime}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.0.0 | El resultado de esta función ya no contiene un componente de fracción en Windows. |
| v0.3.3 | Añadido en: v0.3.3 |
:::

- Devuelve: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Devuelve el tiempo de actividad del sistema en número de segundos.


## `os.userInfo([options])` {#osuserinfooptions}

**Añadido en: v6.0.0**

- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Codificación de caracteres utilizada para interpretar las cadenas resultantes. Si `encoding` se establece en `'buffer'`, los valores de `username`, `shell` y `homedir` serán instancias de `Buffer`. **Predeterminado:** `'utf8'`.


- Devuelve: [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Devuelve información sobre el usuario actualmente efectivo. En las plataformas POSIX, esto es típicamente un subconjunto del archivo de contraseñas. El objeto devuelto incluye `username`, `uid`, `gid`, `shell` y `homedir`. En Windows, los campos `uid` y `gid` son `-1`, y `shell` es `null`.

El valor de `homedir` devuelto por `os.userInfo()` lo proporciona el sistema operativo. Esto difiere del resultado de `os.homedir()`, que consulta las variables de entorno para el directorio de inicio antes de recurrir a la respuesta del sistema operativo.

Lanza un [`SystemError`](/es/nodejs/api/errors#class-systemerror) si un usuario no tiene `username` o `homedir`.

## `os.version()` {#osversion}

**Añadido en: v13.11.0, v12.17.0**

- Devuelve: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Devuelve una cadena que identifica la versión del kernel.

En los sistemas POSIX, la versión del sistema operativo se determina llamando a [`uname(3)`](https://linux.die.net/man/3/uname). En Windows, se utiliza `RtlGetVersion()`, y si no está disponible, se utilizará `GetVersionExW()`. Vea [https://en.wikipedia.org/wiki/Uname#Examples](https://en.wikipedia.org/wiki/Uname#Examples) para obtener más información.

## Constantes del SO {#os-constants}

Las siguientes constantes son exportadas por `os.constants`.

No todas las constantes estarán disponibles en todos los sistemas operativos.

### Constantes de señal {#signal-constants}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v5.11.0 | Se agregó soporte para `SIGINFO`. |
:::

Las siguientes constantes de señal son exportadas por `os.constants.signals`.

| Constante | Descripción |
| --- | --- |
| `SIGHUP` | Se envía para indicar cuándo se cierra un terminal de control o un proceso principal se cierra. |
| `SIGINT` | Se envía para indicar cuándo un usuario desea interrumpir un proceso (+). |
| `SIGQUIT` | Se envía para indicar cuándo un usuario desea finalizar un proceso y realizar un volcado de memoria. |
| `SIGILL` | Se envía a un proceso para notificar que ha intentado realizar una instrucción ilegal, mal formada, desconocida o privilegiada. |
| `SIGTRAP` | Se envía a un proceso cuando ha ocurrido una excepción. |
| `SIGABRT` | Se envía a un proceso para solicitar que se aborte. |
| `SIGIOT` | Sinónimo de `SIGABRT` |
| `SIGBUS` | Se envía a un proceso para notificar que ha causado un error de bus. |
| `SIGFPE` | Se envía a un proceso para notificar que ha realizado una operación aritmética ilegal. |
| `SIGKILL` | Se envía a un proceso para terminarlo inmediatamente. |
| `SIGUSR1` `SIGUSR2` | Se envía a un proceso para identificar condiciones definidas por el usuario. |
| `SIGSEGV` | Se envía a un proceso para notificar un fallo de segmentación. |
| `SIGPIPE` | Se envía a un proceso cuando ha intentado escribir en una tubería desconectada. |
| `SIGALRM` | Se envía a un proceso cuando transcurre un temporizador del sistema. |
| `SIGTERM` | Se envía a un proceso para solicitar la finalización. |
| `SIGCHLD` | Se envía a un proceso cuando un proceso hijo termina. |
| `SIGSTKFLT` | Se envía a un proceso para indicar un fallo de pila en un coprocesador. |
| `SIGCONT` | Se envía para indicar al sistema operativo que continúe un proceso pausado. |
| `SIGSTOP` | Se envía para indicar al sistema operativo que detenga un proceso. |
| `SIGTSTP` | Se envía a un proceso para solicitar que se detenga. |
| `SIGBREAK` | Se envía para indicar cuándo un usuario desea interrumpir un proceso. |
| `SIGTTIN` | Se envía a un proceso cuando lee del TTY mientras está en segundo plano. |
| `SIGTTOU` | Se envía a un proceso cuando escribe en el TTY mientras está en segundo plano. |
| `SIGURG` | Se envía a un proceso cuando un socket tiene datos urgentes para leer. |
| `SIGXCPU` | Se envía a un proceso cuando ha excedido su límite de uso de CPU. |
| `SIGXFSZ` | Se envía a un proceso cuando aumenta un archivo más allá del máximo permitido. |
| `SIGVTALRM` | Se envía a un proceso cuando ha transcurrido un temporizador virtual. |
| `SIGPROF` | Se envía a un proceso cuando ha transcurrido un temporizador del sistema. |
| `SIGWINCH` | Se envía a un proceso cuando el terminal de control ha cambiado su tamaño. |
| `SIGIO` | Se envía a un proceso cuando la E/S está disponible. |
| `SIGPOLL` | Sinónimo de `SIGIO` |
| `SIGLOST` | Se envía a un proceso cuando se ha perdido un bloqueo de archivo. |
| `SIGPWR` | Se envía a un proceso para notificar un fallo de alimentación. |
| `SIGINFO` | Sinónimo de `SIGPWR` |
| `SIGSYS` | Se envía a un proceso para notificar un argumento incorrecto. |
| `SIGUNUSED` | Sinónimo de `SIGSYS` |


### Constantes de error {#error-constants}

Las siguientes constantes de error son exportadas por `os.constants.errno`.

#### Constantes de error POSIX {#posix-error-constants}

| Constante | Descripción |
| --- | --- |
| `E2BIG` | Indica que la lista de argumentos es más larga de lo esperado. |
| `EACCES` | Indica que la operación no tenía los permisos suficientes. |
| `EADDRINUSE` | Indica que la dirección de red ya está en uso. |
| `EADDRNOTAVAIL` | Indica que la dirección de red no está disponible actualmente para su uso. |
| `EAFNOSUPPORT` | Indica que la familia de direcciones de red no es compatible. |
| `EAGAIN` | Indica que no hay datos disponibles y que se intente la operación de nuevo más tarde. |
| `EALREADY` | Indica que el socket ya tiene una conexión pendiente en curso. |
| `EBADF` | Indica que un descriptor de archivo no es válido. |
| `EBADMSG` | Indica un mensaje de datos no válido. |
| `EBUSY` | Indica que un dispositivo o recurso está ocupado. |
| `ECANCELED` | Indica que se canceló una operación. |
| `ECHILD` | Indica que no hay procesos hijo. |
| `ECONNABORTED` | Indica que la conexión de red ha sido abortada. |
| `ECONNREFUSED` | Indica que la conexión de red ha sido rechazada. |
| `ECONNRESET` | Indica que la conexión de red ha sido reiniciada. |
| `EDEADLK` | Indica que se ha evitado un interbloqueo de recursos. |
| `EDESTADDRREQ` | Indica que se requiere una dirección de destino. |
| `EDOM` | Indica que un argumento está fuera del dominio de la función. |
| `EDQUOT` | Indica que se ha excedido la cuota de disco. |
| `EEXIST` | Indica que el archivo ya existe. |
| `EFAULT` | Indica una dirección de puntero no válida. |
| `EFBIG` | Indica que el archivo es demasiado grande. |
| `EHOSTUNREACH` | Indica que el host es inalcanzable. |
| `EIDRM` | Indica que se ha eliminado el identificador. |
| `EILSEQ` | Indica una secuencia de bytes ilegal. |
| `EINPROGRESS` | Indica que una operación ya está en curso. |
| `EINTR` | Indica que se interrumpió una llamada a una función. |
| `EINVAL` | Indica que se proporcionó un argumento no válido. |
| `EIO` | Indica un error de E/S no especificado de otro modo. |
| `EISCONN` | Indica que el socket está conectado. |
| `EISDIR` | Indica que la ruta es un directorio. |
| `ELOOP` | Indica demasiados niveles de enlaces simbólicos en una ruta. |
| `EMFILE` | Indica que hay demasiados archivos abiertos. |
| `EMLINK` | Indica que hay demasiados enlaces físicos a un archivo. |
| `EMSGSIZE` | Indica que el mensaje proporcionado es demasiado largo. |
| `EMULTIHOP` | Indica que se intentó un salto múltiple. |
| `ENAMETOOLONG` | Indica que el nombre del archivo es demasiado largo. |
| `ENETDOWN` | Indica que la red está inactiva. |
| `ENETRESET` | Indica que la conexión ha sido abortada por la red. |
| `ENETUNREACH` | Indica que la red es inalcanzable. |
| `ENFILE` | Indica demasiados archivos abiertos en el sistema. |
| `ENOBUFS` | Indica que no hay espacio de búfer disponible. |
| `ENODATA` | Indica que no hay ningún mensaje disponible en la cola de lectura del encabezado del flujo. |
| `ENODEV` | Indica que no existe tal dispositivo. |
| `ENOENT` | Indica que no existe tal archivo o directorio. |
| `ENOEXEC` | Indica un error de formato exec. |
| `ENOLCK` | Indica que no hay bloqueos disponibles. |
| `ENOLINK` | Indica que se ha cortado un enlace. |
| `ENOMEM` | Indica que no hay suficiente espacio. |
| `ENOMSG` | Indica que no hay ningún mensaje del tipo deseado. |
| `ENOPROTOOPT` | Indica que un protocolo dado no está disponible. |
| `ENOSPC` | Indica que no hay espacio disponible en el dispositivo. |
| `ENOSR` | Indica que no hay recursos de flujo disponibles. |
| `ENOSTR` | Indica que un recurso dado no es un flujo. |
| `ENOSYS` | Indica que una función no ha sido implementada. |
| `ENOTCONN` | Indica que el socket no está conectado. |
| `ENOTDIR` | Indica que la ruta no es un directorio. |
| `ENOTEMPTY` | Indica que el directorio no está vacío. |
| `ENOTSOCK` | Indica que el elemento dado no es un socket. |
| `ENOTSUP` | Indica que una operación dada no es compatible. |
| `ENOTTY` | Indica una operación de control de E/S inapropiada. |
| `ENXIO` | Indica que no existe tal dispositivo o dirección. |
| `EOPNOTSUPP` | Indica que una operación no es compatible con el socket. Aunque `ENOTSUP` y `EOPNOTSUPP` tienen el mismo valor en Linux, según POSIX.1 estos valores de error deben ser distintos). |
| `EOVERFLOW` | Indica que un valor es demasiado grande para ser almacenado en un tipo de datos dado. |
| `EPERM` | Indica que la operación no está permitida. |
| `EPIPE` | Indica una tubería rota. |
| `EPROTO` | Indica un error de protocolo. |
| `EPROTONOSUPPORT` | Indica que un protocolo no es compatible. |
| `EPROTOTYPE` | Indica el tipo incorrecto de protocolo para un socket. |
| `ERANGE` | Indica que los resultados son demasiado grandes. |
| `EROFS` | Indica que el sistema de archivos es de sólo lectura. |
| `ESPIPE` | Indica una operación de búsqueda no válida. |
| `ESRCH` | Indica que no existe tal proceso. |
| `ESTALE` | Indica que el identificador de archivo está obsoleto. |
| `ETIME` | Indica un temporizador caducado. |
| `ETIMEDOUT` | Indica que la conexión ha excedido el tiempo de espera. |
| `ETXTBSY` | Indica que un archivo de texto está ocupado. |
| `EWOULDBLOCK` | Indica que la operación se bloquearía. |
| `EXDEV` | Indica un enlace inapropiado. |


#### Constantes de error específicas de Windows {#windows-specific-error-constants}

Los siguientes códigos de error son específicos del sistema operativo Windows.

| Constante | Descripción |
| --- | --- |
| `WSAEINTR` | Indica una llamada a función interrumpida. |
| `WSAEBADF` | Indica un identificador de archivo no válido. |
| `WSAEACCES` | Indica permisos insuficientes para completar la operación. |
| `WSAEFAULT` | Indica una dirección de puntero no válida. |
| `WSAEINVAL` | Indica que se pasó un argumento no válido. |
| `WSAEMFILE` | Indica que hay demasiados archivos abiertos. |
| `WSAEWOULDBLOCK` | Indica que un recurso no está disponible temporalmente. |
| `WSAEINPROGRESS` | Indica que una operación está actualmente en curso. |
| `WSAEALREADY` | Indica que una operación ya está en curso. |
| `WSAENOTSOCK` | Indica que el recurso no es un socket. |
| `WSAEDESTADDRREQ` | Indica que se requiere una dirección de destino. |
| `WSAEMSGSIZE` | Indica que el tamaño del mensaje es demasiado largo. |
| `WSAEPROTOTYPE` | Indica el tipo de protocolo incorrecto para el socket. |
| `WSAENOPROTOOPT` | Indica una opción de protocolo incorrecta. |
| `WSAEPROTONOSUPPORT` | Indica que el protocolo no es compatible. |
| `WSAESOCKTNOSUPPORT` | Indica que el tipo de socket no es compatible. |
| `WSAEOPNOTSUPP` | Indica que la operación no es compatible. |
| `WSAEPFNOSUPPORT` | Indica que la familia de protocolos no es compatible. |
| `WSAEAFNOSUPPORT` | Indica que la familia de direcciones no es compatible. |
| `WSAEADDRINUSE` | Indica que la dirección de red ya está en uso. |
| `WSAEADDRNOTAVAIL` | Indica que la dirección de red no está disponible. |
| `WSAENETDOWN` | Indica que la red está inactiva. |
| `WSAENETUNREACH` | Indica que la red es inalcanzable. |
| `WSAENETRESET` | Indica que la conexión de red se ha restablecido. |
| `WSAECONNABORTED` | Indica que la conexión ha sido abortada. |
| `WSAECONNRESET` | Indica que la conexión ha sido restablecida por el par. |
| `WSAENOBUFS` | Indica que no hay espacio de búfer disponible. |
| `WSAEISCONN` | Indica que el socket ya está conectado. |
| `WSAENOTCONN` | Indica que el socket no está conectado. |
| `WSAESHUTDOWN` | Indica que no se pueden enviar datos después de que el socket ha sido cerrado. |
| `WSAETOOMANYREFS` | Indica que hay demasiadas referencias. |
| `WSAETIMEDOUT` | Indica que la conexión ha expirado. |
| `WSAECONNREFUSED` | Indica que la conexión ha sido rechazada. |
| `WSAELOOP` | Indica que no se puede traducir un nombre. |
| `WSAENAMETOOLONG` | Indica que un nombre era demasiado largo. |
| `WSAEHOSTDOWN` | Indica que un host de red está inactivo. |
| `WSAEHOSTUNREACH` | Indica que no hay ruta a un host de red. |
| `WSAENOTEMPTY` | Indica que el directorio no está vacío. |
| `WSAEPROCLIM` | Indica que hay demasiados procesos. |
| `WSAEUSERS` | Indica que se ha excedido la cuota de usuario. |
| `WSAEDQUOT` | Indica que se ha excedido la cuota de disco. |
| `WSAESTALE` | Indica una referencia de identificador de archivo obsoleta. |
| `WSAEREMOTE` | Indica que el elemento es remoto. |
| `WSASYSNOTREADY` | Indica que el subsistema de red no está listo. |
| `WSAVERNOTSUPPORTED` | Indica que la versión de  `winsock.dll`  está fuera de rango. |
| `WSANOTINITIALISED` | Indica que aún no se ha realizado un WSAStartup exitoso. |
| `WSAEDISCON` | Indica que un cierre ordenado está en curso. |
| `WSAENOMORE` | Indica que no hay más resultados. |
| `WSAECANCELLED` | Indica que una operación ha sido cancelada. |
| `WSAEINVALIDPROCTABLE` | Indica que la tabla de llamadas de procedimiento no es válida. |
| `WSAEINVALIDPROVIDER` | Indica un proveedor de servicios no válido. |
| `WSAEPROVIDERFAILEDINIT` | Indica que el proveedor de servicios no pudo inicializarse. |
| `WSASYSCALLFAILURE` | Indica un fallo de llamada al sistema. |
| `WSASERVICE_NOT_FOUND` | Indica que no se encontró un servicio. |
| `WSATYPE_NOT_FOUND` | Indica que no se encontró un tipo de clase. |
| `WSA_E_NO_MORE` | Indica que no hay más resultados. |
| `WSA_E_CANCELLED` | Indica que la llamada fue cancelada. |
| `WSAEREFUSED` | Indica que una consulta de base de datos fue rechazada. |


### Constantes dlopen {#dlopen-constants}

Si están disponibles en el sistema operativo, las siguientes constantes se exportan en `os.constants.dlopen`. Consulte [`dlopen(3)`](http://man7.org/linux/man-pages/man3/dlopen.3) para obtener información detallada.

| Constante | Descripción |
| --- | --- |
| `RTLD_LAZY` | Realiza el enlace diferido. Node.js establece este indicador de forma predeterminada. |
| `RTLD_NOW` | Resuelve todos los símbolos indefinidos en la biblioteca antes de que dlopen(3) regrese. |
| `RTLD_GLOBAL` | Los símbolos definidos por la biblioteca estarán disponibles para la resolución de símbolos de las bibliotecas cargadas posteriormente. |
| `RTLD_LOCAL` | Lo contrario de `RTLD_GLOBAL`. Este es el comportamiento predeterminado si no se especifica ninguno de los indicadores. |
| `RTLD_DEEPBIND` | Haz que una biblioteca autocontenida use sus propios símbolos en lugar de los símbolos de las bibliotecas cargadas anteriormente. |
### Constantes de prioridad {#priority-constants}

**Agregado en: v10.10.0**

Las siguientes constantes de programación de procesos son exportadas por `os.constants.priority`.

| Constante | Descripción |
| --- | --- |
| `PRIORITY_LOW` | La prioridad de programación de procesos más baja. Esto corresponde a `IDLE_PRIORITY_CLASS` en Windows y a un valor nice de `19` en todas las demás plataformas. |
| `PRIORITY_BELOW_NORMAL` | La prioridad de programación de procesos por encima de `PRIORITY_LOW` y por debajo de `PRIORITY_NORMAL`. Esto corresponde a `BELOW_NORMAL_PRIORITY_CLASS` en Windows y a un valor nice de `10` en todas las demás plataformas. |
| `PRIORITY_NORMAL` | La prioridad de programación de procesos predeterminada. Esto corresponde a `NORMAL_PRIORITY_CLASS` en Windows y a un valor nice de `0` en todas las demás plataformas. |
| `PRIORITY_ABOVE_NORMAL` | La prioridad de programación de procesos por encima de `PRIORITY_NORMAL` y por debajo de `PRIORITY_HIGH`. Esto corresponde a `ABOVE_NORMAL_PRIORITY_CLASS` en Windows y a un valor nice de `-7` en todas las demás plataformas. |
| `PRIORITY_HIGH` | La prioridad de programación de procesos por encima de `PRIORITY_ABOVE_NORMAL` y por debajo de `PRIORITY_HIGHEST`. Esto corresponde a `HIGH_PRIORITY_CLASS` en Windows y a un valor nice de `-14` en todas las demás plataformas. |
| `PRIORITY_HIGHEST` | La prioridad de programación de procesos más alta. Esto corresponde a `REALTIME_PRIORITY_CLASS` en Windows y a un valor nice de `-20` en todas las demás plataformas. |


### Constantes de libuv {#libuv-constants}

| Constante | Descripción |
| --- | --- |
| `UV_UDP_REUSEADDR` ||

