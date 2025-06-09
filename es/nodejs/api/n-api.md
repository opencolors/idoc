---
title: Documentación de N-API de Node.js
description: La N-API (Node.js API) proporciona una interfaz estable y consistente para complementos nativos, permitiendo a los desarrolladores crear módulos compatibles con diferentes versiones de Node.js.
head:
  - - meta
    - name: og:title
      content: Documentación de N-API de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: La N-API (Node.js API) proporciona una interfaz estable y consistente para complementos nativos, permitiendo a los desarrolladores crear módulos compatibles con diferentes versiones de Node.js.
  - - meta
    - name: twitter:title
      content: Documentación de N-API de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: La N-API (Node.js API) proporciona una interfaz estable y consistente para complementos nativos, permitiendo a los desarrolladores crear módulos compatibles con diferentes versiones de Node.js.
---


# Node-API {#node-api}

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable
:::

Node-API (anteriormente N-API) es una API para construir Addons nativos. Es independiente del runtime de JavaScript subyacente (por ejemplo, V8) y se mantiene como parte del propio Node.js. Esta API será Application Binary Interface (ABI) estable entre las versiones de Node.js. Su objetivo es aislar los addons de los cambios en el motor de JavaScript subyacente y permitir que los módulos compilados para una versión principal se ejecuten en versiones principales posteriores de Node.js sin recompilación. La guía de [Estabilidad ABI](https://nodejs.org/en/docs/guides/abi-stability/) proporciona una explicación más detallada.

Los Addons se construyen/empaquetan con el mismo enfoque/herramientas descritas en la sección titulada [Addons de C++](/es/nodejs/api/addons). La única diferencia es el conjunto de API que utiliza el código nativo. En lugar de utilizar las API de V8 o [Abstracciones Nativas para Node.js](https://github.com/nodejs/nan), se utilizan las funciones disponibles en Node-API.

Las API expuestas por Node-API se utilizan generalmente para crear y manipular valores de JavaScript. Los conceptos y las operaciones generalmente se asignan a ideas especificadas en la Especificación del Lenguaje ECMA-262. Las API tienen las siguientes propiedades:

- Todas las llamadas a Node-API devuelven un código de estado de tipo `napi_status`. Este estado indica si la llamada a la API tuvo éxito o falló.
- El valor de retorno de la API se pasa a través de un parámetro de salida.
- Todos los valores de JavaScript se abstraen detrás de un tipo opaco llamado `napi_value`.
- En caso de un código de estado de error, se puede obtener información adicional utilizando `napi_get_last_error_info`. Se puede encontrar más información en la sección de manejo de errores [Manejo de errores](/es/nodejs/api/n-api#error-handling).

Node-API es una API de C que garantiza la estabilidad de la ABI entre las versiones de Node.js y los diferentes niveles de compilador. Una API de C++ puede ser más fácil de usar. Para admitir el uso de C++, el proyecto mantiene un módulo wrapper de C++ llamado [`node-addon-api`](https://github.com/nodejs/node-addon-api). Este wrapper proporciona una API de C++ en línea. Los binarios construidos con `node-addon-api` dependerán de los símbolos de las funciones basadas en C de Node-API exportadas por Node.js. `node-addon-api` es una forma más eficiente de escribir código que llama a Node-API. Tomemos, por ejemplo, el siguiente código de `node-addon-api`. La primera sección muestra el código de `node-addon-api` y la segunda sección muestra lo que realmente se utiliza en el addon.

```C++ [C++]
Object obj = Object::New(env);
obj["foo"] = String::New(env, "bar");
```
```C++ [C++]
napi_status status;
napi_value object, string;
status = napi_create_object(env, &object);
if (status != napi_ok) {
  napi_throw_error(env, ...);
  return;
}

status = napi_create_string_utf8(env, "bar", NAPI_AUTO_LENGTH, &string);
if (status != napi_ok) {
  napi_throw_error(env, ...);
  return;
}

status = napi_set_named_property(env, object, "foo", string);
if (status != napi_ok) {
  napi_throw_error(env, ...);
  return;
}
```
El resultado final es que el addon sólo utiliza las API de C exportadas. Como resultado, sigue obteniendo los beneficios de la estabilidad de la ABI proporcionada por la API de C.

Cuando se utiliza `node-addon-api` en lugar de las API de C, comience con la [documentación](https://github.com/nodejs/node-addon-api#api-documentation) de la API para `node-addon-api`.

El [Recurso Node-API](https://nodejs.github.io/node-addon-examples/) ofrece una excelente orientación y consejos para los desarrolladores que están empezando con Node-API y `node-addon-api`. Se pueden encontrar recursos multimedia adicionales en la página [Medios Node-API](https://github.com/nodejs/abi-stable-node/blob/HEAD/node-api-media.md).


## Implicaciones de la estabilidad ABI {#implications-of-abi-stability}

Aunque Node-API proporciona una garantía de estabilidad ABI, otras partes de Node.js no lo hacen, y es posible que ninguna biblioteca externa utilizada desde el complemento lo haga. En particular, ninguna de las siguientes API proporciona una garantía de estabilidad ABI entre versiones principales:

- las API de C++ de Node.js disponibles a través de cualquier
- las API de libuv que también se incluyen con Node.js y están disponibles a través de
- la API de V8 disponible a través de

Por lo tanto, para que un complemento siga siendo compatible con ABI entre las versiones principales de Node.js, debe usar Node-API exclusivamente restringiéndose al uso de

```C [C]
#include <node_api.h>
```
y comprobando, para todas las bibliotecas externas que utilice, que la biblioteca externa ofrece garantías de estabilidad ABI similares a Node-API.

## Construcción {#building}

A diferencia de los módulos escritos en JavaScript, el desarrollo y la implementación de complementos nativos de Node.js que utilizan Node-API requieren un conjunto adicional de herramientas. Además de las herramientas básicas necesarias para desarrollar para Node.js, el desarrollador de complementos nativos necesita una cadena de herramientas que pueda compilar código C y C++ en un binario. Además, según cómo se implemente el complemento nativo, el *usuario* del complemento nativo también deberá tener instalada una cadena de herramientas de C/C++.

Para los desarrolladores de Linux, los paquetes de cadena de herramientas de C/C++ necesarios están disponibles de inmediato. [GCC](https://gcc.gnu.org/) se usa ampliamente en la comunidad de Node.js para construir y probar en una variedad de plataformas. Para muchos desarrolladores, la infraestructura del compilador [LLVM](https://llvm.org/) también es una buena opción.

Para los desarrolladores de Mac, [Xcode](https://developer.apple.com/xcode/) ofrece todas las herramientas de compilación necesarias. Sin embargo, no es necesario instalar todo el IDE de Xcode. El siguiente comando instala la cadena de herramientas necesaria:

```bash [BASH]
xcode-select --install
```
Para los desarrolladores de Windows, [Visual Studio](https://visualstudio.microsoft.com/) ofrece todas las herramientas de compilación necesarias. Sin embargo, no es necesario instalar todo el IDE de Visual Studio. El siguiente comando instala la cadena de herramientas necesaria:

```bash [BASH]
npm install --global windows-build-tools
```
Las secciones siguientes describen las herramientas adicionales disponibles para desarrollar e implementar complementos nativos de Node.js.


### Herramientas de construcción {#build-tools}

Ambas herramientas enumeradas aquí requieren que los *usuarios* del complemento nativo tengan una cadena de herramientas de C/C++ instalada para instalar correctamente el complemento nativo.

#### node-gyp {#node-gyp}

[node-gyp](https://github.com/nodejs/node-gyp) es un sistema de construcción basado en la bifurcación [gyp-next](https://github.com/nodejs/gyp-next) de la herramienta [GYP](https://gyp.gsrc.io/) de Google y viene incluido con npm. GYP, y por lo tanto node-gyp, requiere que Python esté instalado.

Históricamente, node-gyp ha sido la herramienta preferida para construir complementos nativos. Tiene una adopción y documentación generalizadas. Sin embargo, algunos desarrolladores se han topado con limitaciones en node-gyp.

#### CMake.js {#cmakejs}

[CMake.js](https://github.com/cmake-js/cmake-js) es un sistema de construcción alternativo basado en [CMake](https://cmake.org/).

CMake.js es una buena opción para proyectos que ya utilizan CMake o para desarrolladores afectados por las limitaciones de node-gyp. [`build_with_cmake`](https://github.com/nodejs/node-addon-examples/tree/main/src/8-tooling/build_with_cmake) es un ejemplo de un proyecto de complemento nativo basado en CMake.

### Subir binarios precompilados {#uploading-precompiled-binaries}

Las tres herramientas enumeradas aquí permiten a los desarrolladores y mantenedores de complementos nativos crear y cargar binarios a servidores públicos o privados. Estas herramientas suelen estar integradas con sistemas de construcción CI/CD como [Travis CI](https://travis-ci.org/) y [AppVeyor](https://www.appveyor.com/) para construir y cargar binarios para una variedad de plataformas y arquitecturas. Estos binarios están entonces disponibles para su descarga por los usuarios que no necesitan tener una cadena de herramientas de C/C++ instalada.

#### node-pre-gyp {#node-pre-gyp}

[node-pre-gyp](https://github.com/mapbox/node-pre-gyp) es una herramienta basada en node-gyp que añade la capacidad de subir binarios a un servidor de la elección del desarrollador. node-pre-gyp tiene un soporte particularmente bueno para subir binarios a Amazon S3.

#### prebuild {#prebuild}

[prebuild](https://github.com/prebuild/prebuild) es una herramienta que soporta construcciones usando node-gyp o CMake.js. A diferencia de node-pre-gyp, que soporta una variedad de servidores, prebuild sube binarios sólo a [GitHub releases](https://help.github.com/en/github/administering-a-repository/about-releases). prebuild es una buena opción para proyectos de GitHub que utilizan CMake.js.


#### prebuildify {#prebuildify}

[prebuildify](https://github.com/prebuild/prebuildify) es una herramienta basada en node-gyp. La ventaja de prebuildify es que los binarios construidos se agrupan con el complemento nativo cuando se carga en npm. Los binarios se descargan de npm y están disponibles inmediatamente para el usuario del módulo cuando se instala el complemento nativo.

## Uso {#usage}

Para utilizar las funciones de Node-API, incluya el archivo [`node_api.h`](https://github.com/nodejs/node/blob/HEAD/src/node_api.h) que se encuentra en el directorio src en el árbol de desarrollo de node:

```C [C]
#include <node_api.h>
```
Esto optará por el `NAPI_VERSION` predeterminado para la versión dada de Node.js. Para garantizar la compatibilidad con versiones específicas de Node-API, la versión se puede especificar explícitamente al incluir el encabezado:

```C [C]
#define NAPI_VERSION 3
#include <node_api.h>
```
Esto restringe la superficie de Node-API únicamente a la funcionalidad que estaba disponible en las versiones especificadas (y anteriores).

Parte de la superficie de Node-API es experimental y requiere una aceptación explícita:

```C [C]
#define NAPI_EXPERIMENTAL
#include <node_api.h>
```
En este caso, toda la superficie de la API, incluidas las API experimentales, estará disponible para el código del módulo.

Ocasionalmente, se introducen características experimentales que afectan a las API ya lanzadas y estables. Estas características se pueden desactivar mediante una exclusión voluntaria:

```C [C]
#define NAPI_EXPERIMENTAL
#define NODE_API_EXPERIMENTAL_<FEATURE_NAME>_OPT_OUT
#include <node_api.h>
```
donde `\<FEATURE_NAME\>` es el nombre de una característica experimental que afecta tanto a las API experimentales como a las estables.

## Matriz de versiones de Node-API {#node-api-version-matrix}

Hasta la versión 9, las versiones de Node-API eran aditivas y versionadas independientemente de Node.js. Esto significaba que cualquier versión era una extensión de la versión anterior, ya que tenía todas las API de la versión anterior con algunas adiciones. Cada versión de Node.js solo admitía una única versión de Node-API. Por ejemplo, la v18.15.0 solo admite la versión 8 de Node-API. La estabilidad de la ABI se logró porque 8 era un superconjunto estricto de todas las versiones anteriores.

A partir de la versión 9, si bien las versiones de Node-API siguen siendo versionadas independientemente, es posible que un complemento que se ejecutó con la versión 9 de Node-API necesite actualizaciones de código para ejecutarse con la versión 10 de Node-API. Sin embargo, se mantiene la estabilidad de la ABI porque las versiones de Node.js que admiten versiones de Node-API superiores a 8 admitirán todas las versiones entre 8 y la versión más alta que admitan, y por defecto proporcionarán las API de la versión 8 a menos que un complemento opte por una versión superior de Node-API. Este enfoque proporciona la flexibilidad de optimizar mejor las funciones de Node-API existentes manteniendo la estabilidad de la ABI. Los complementos existentes pueden seguir ejecutándose sin recompilación utilizando una versión anterior de Node-API. Si un complemento necesita funcionalidad de una versión más reciente de Node-API, serán necesarios cambios en el código existente y la recompilación para usar esas nuevas funciones de todos modos.

En las versiones de Node.js que admiten la versión 9 de Node-API y posteriores, definir `NAPI_VERSION=X` y usar las macros de inicialización de complementos existentes integrará la versión solicitada de Node-API que se utilizará en tiempo de ejecución en el complemento. Si `NAPI_VERSION` no está establecido, el valor predeterminado será 8.

Es posible que esta tabla no esté actualizada en las versiones antiguas, la información más actualizada se encuentra en la documentación de la API más reciente en: [Matriz de versiones de Node-API](/es/nodejs/api/n-api#node-api-version-matrix)

| Versión de Node-API | Compatible con |
|---|---|
| 9 | v18.17.0+, 20.3.0+, 21.0.0 y todas las versiones posteriores |
| 8 | v12.22.0+, v14.17.0+, v15.12.0+, 16.0.0 y todas las versiones posteriores |
| 7 | v10.23.0+, v12.19.0+, v14.12.0+, 15.0.0 y todas las versiones posteriores |
| 6 | v10.20.0+, v12.17.0+, 14.0.0 y todas las versiones posteriores |
| 5 | v10.17.0+, v12.11.0+, 13.0.0 y todas las versiones posteriores |
| 4 | v10.16.0+, v11.8.0+, 12.0.0 y todas las versiones posteriores |
| 3 | v6.14.2*, 8.11.2+, v9.11.0+*, 10.0.0 y todas las versiones posteriores |
| 2 | v8.10.0+*, v9.3.0+*, 10.0.0 y todas las versiones posteriores |
| 1 | v8.6.0+**, v9.0.0+*, 10.0.0 y todas las versiones posteriores |

* Node-API era experimental.

** Node.js 8.0.0 incluyó Node-API como experimental. Se lanzó como Node-API versión 1, pero continuó evolucionando hasta Node.js 8.6.0. La API es diferente en versiones anteriores a Node.js 8.6.0. Recomendamos Node-API versión 3 o posterior.

Cada API documentada para Node-API tendrá un encabezado llamado `added in:`, y las API que son estables tendrán el encabezado adicional `Node-API version:`. Las API se pueden usar directamente cuando se usa una versión de Node.js que admite la versión de Node-API que se muestra en `Node-API version:` o superior. Cuando se usa una versión de Node.js que no admite la `Node-API version:` listada o si no hay ninguna `Node-API version:` listada, entonces la API solo estará disponible si `#define NAPI_EXPERIMENTAL` precede a la inclusión de `node_api.h` o `js_native_api.h`. Si una API parece no estar disponible en una versión de Node.js que es posterior a la que se muestra en `added in:`, entonces esta es muy probablemente la razón de la aparente ausencia.

Las API de Node-APIs asociadas estrictamente con el acceso a las características de ECMAScript desde el código nativo se pueden encontrar por separado en `js_native_api.h` y `js_native_api_types.h`. Las API definidas en estos encabezados están incluidas en `node_api.h` y `node_api_types.h`. Los encabezados están estructurados de esta manera para permitir implementaciones de Node-API fuera de Node.js. Para esas implementaciones, las API específicas de Node.js pueden no ser aplicables.

Las partes específicas de Node.js de un complemento se pueden separar del código que expone la funcionalidad real al entorno de JavaScript para que este último se pueda usar con múltiples implementaciones de Node-API. En el ejemplo siguiente, `addon.c` y `addon.h` se refieren solo a `js_native_api.h`. Esto garantiza que `addon.c` se pueda reutilizar para compilar contra la implementación de Node.js de Node-API o cualquier implementación de Node-API fuera de Node.js.

`addon_node.c` es un archivo separado que contiene el punto de entrada específico de Node.js al complemento y que instancia el complemento llamando a `addon.c` cuando el complemento se carga en un entorno Node.js.

```C [C]
// addon.h
#ifndef _ADDON_H_
#define _ADDON_H_
#include <js_native_api.h>
napi_value create_addon(napi_env env);
#endif  // _ADDON_H_
```
```C [C]
// addon.c
#include "addon.h"

#define NODE_API_CALL(env, call)                                  \
  do {                                                            \
    napi_status status = (call);                                  \
    if (status != napi_ok) {                                      \
      const napi_extended_error_info* error_info = NULL;          \
      napi_get_last_error_info((env), &error_info);               \
      const char* err_message = error_info->error_message;        \
      bool is_pending;                                            \
      napi_is_exception_pending((env), &is_pending);              \
      /* If an exception is already pending, don't rethrow it */  \
      if (!is_pending) {                                          \
        const char* message = (err_message == NULL)               \
            ? "empty error message"                               \
            : err_message;                                        \
        napi_throw_error((env), NULL, message);                   \
      }                                                           \
      return NULL;                                                \
    }                                                             \
  } while(0)

static napi_value
DoSomethingUseful(napi_env env, napi_callback_info info) {
  // Do something useful.
  return NULL;
}

napi_value create_addon(napi_env env) {
  napi_value result;
  NODE_API_CALL(env, napi_create_object(env, &result));

  napi_value exported_function;
  NODE_API_CALL(env, napi_create_function(env,
                                          "doSomethingUseful",
                                          NAPI_AUTO_LENGTH,
                                          DoSomethingUseful,
                                          NULL,
                                          &exported_function));

  NODE_API_CALL(env, napi_set_named_property(env,
                                             result,
                                             "doSomethingUseful",
                                             exported_function));

  return result;
}
```
```C [C]
// addon_node.c
#include <node_api.h>
#include "addon.h"

NAPI_MODULE_INIT(/* napi_env env, napi_value exports */) {
  // This function body is expected to return a `napi_value`.
  // The variables `napi_env env` and `napi_value exports` may be used within
  // the body, as they are provided by the definition of `NAPI_MODULE_INIT()`.
  return create_addon(env);
}
```

## APIs del ciclo de vida del entorno {#environment-life-cycle-apis}

La [Sección 8.7](https://tc39.es/ecma262/#sec-agents) de la [Especificación del Lenguaje ECMAScript](https://tc39.github.io/ecma262/) define el concepto de un "Agente" como un entorno autónomo en el que se ejecuta el código JavaScript. El proceso puede iniciar y terminar múltiples Agentes de forma concurrente o secuencial.

Un entorno de Node.js corresponde a un Agente ECMAScript. En el proceso principal, se crea un entorno al inicio, y se pueden crear entornos adicionales en hilos separados para que sirvan como [hilos de trabajo](https://nodejs.org/api/worker_threads). Cuando Node.js está integrado en otra aplicación, el hilo principal de la aplicación también puede construir y destruir un entorno de Node.js varias veces durante el ciclo de vida del proceso de la aplicación, de tal manera que cada entorno de Node.js creado por la aplicación puede, a su vez, durante su ciclo de vida, crear y destruir entornos adicionales como hilos de trabajo.

Desde la perspectiva de un addon nativo, esto significa que los enlaces que proporciona pueden ser llamados múltiples veces, desde múltiples contextos, e incluso concurrentemente desde múltiples hilos.

Los addons nativos pueden necesitar asignar un estado global que utilicen durante su ciclo de vida de un entorno de Node.js, de tal manera que el estado sea único para cada instancia del addon.

Con este fin, Node-API proporciona una forma de asociar datos de tal manera que su ciclo de vida esté ligado al ciclo de vida de un entorno de Node.js.

### `napi_set_instance_data` {#napi_set_instance_data}

**Agregado en: v12.8.0, v10.20.0**

**Versión de N-API: 6**

```C [C]
napi_status napi_set_instance_data(node_api_basic_env env,
                                   void* data,
                                   napi_finalize finalize_cb,
                                   void* finalize_hint);
```
- `[in] env`: El entorno bajo el cual se invoca la llamada a Node-API.
- `[in] data`: El elemento de datos para poner a disposición de los enlaces de esta instancia.
- `[in] finalize_cb`: La función a llamar cuando el entorno está siendo destruido. La función recibe `data` para que pueda liberarlo. [`napi_finalize`](/es/nodejs/api/n-api#napi_finalize) proporciona más detalles.
- `[in] finalize_hint`: Sugerencia opcional para pasar a la función de callback de finalización durante la recolección.

Devuelve `napi_ok` si la API tuvo éxito.

Esta API asocia `data` con el entorno de Node.js que se está ejecutando actualmente. `data` puede recuperarse posteriormente utilizando `napi_get_instance_data()`. Cualquier dato existente asociado con el entorno de Node.js que se está ejecutando actualmente y que fue establecido mediante una llamada anterior a `napi_set_instance_data()` será sobrescrito. Si una `finalize_cb` fue proporcionada por la llamada anterior, no será llamada.


### `napi_get_instance_data` {#napi_get_instance_data}

**Agregado en: v12.8.0, v10.20.0**

**Versión de N-API: 6**

```C [C]
napi_status napi_get_instance_data(node_api_basic_env env,
                                   void** data);
```
- `[in] env`: El entorno bajo el cual se invoca la llamada Node-API.
- `[out] data`: El elemento de datos que se asoció previamente con el entorno Node.js en ejecución actual mediante una llamada a `napi_set_instance_data()`.

Devuelve `napi_ok` si la API se realizó correctamente.

Esta API recupera los datos que se asociaron previamente con el entorno Node.js en ejecución actual a través de `napi_set_instance_data()`. Si no se establecen datos, la llamada se realizará correctamente y `data` se establecerá en `NULL`.

## Tipos de datos básicos de Node-API {#basic-node-api-data-types}

Node-API expone los siguientes tipos de datos fundamentales como abstracciones que son consumidas por las diversas API. Estas API deben tratarse como opacas, introspectables solo con otras llamadas Node-API.

### `napi_status` {#napi_status}

**Agregado en: v8.0.0**

**Versión de N-API: 1**

Código de estado integral que indica el éxito o el fracaso de una llamada Node-API. Actualmente, se admiten los siguientes códigos de estado.

```C [C]
typedef enum {
  napi_ok,
  napi_invalid_arg,
  napi_object_expected,
  napi_string_expected,
  napi_name_expected,
  napi_function_expected,
  napi_number_expected,
  napi_boolean_expected,
  napi_array_expected,
  napi_generic_failure,
  napi_pending_exception,
  napi_cancelled,
  napi_escape_called_twice,
  napi_handle_scope_mismatch,
  napi_callback_scope_mismatch,
  napi_queue_full,
  napi_closing,
  napi_bigint_expected,
  napi_date_expected,
  napi_arraybuffer_expected,
  napi_detachable_arraybuffer_expected,
  napi_would_deadlock,  /* unused */
  napi_no_external_buffers_allowed,
  napi_cannot_run_js
} napi_status;
```
Si se requiere información adicional cuando una API devuelve un estado fallido, se puede obtener llamando a `napi_get_last_error_info`.

### `napi_extended_error_info` {#napi_extended_error_info}

**Agregado en: v8.0.0**

**Versión de N-API: 1**

```C [C]
typedef struct {
  const char* error_message;
  void* engine_reserved;
  uint32_t engine_error_code;
  napi_status error_code;
} napi_extended_error_info;
```
- `error_message`: Cadena codificada en UTF8 que contiene una descripción del error neutral para la VM.
- `engine_reserved`: Reservado para detalles de error específicos de la VM. Actualmente, esto no está implementado para ninguna VM.
- `engine_error_code`: Código de error específico de la VM. Actualmente, esto no está implementado para ninguna VM.
- `error_code`: El código de estado de Node-API que se originó con el último error.

Consulte la sección [Manejo de errores](/es/nodejs/api/n-api#error-handling) para obtener información adicional.


### `napi_env` {#napi_env}

`napi_env` se utiliza para representar un contexto que la implementación subyacente de Node-API puede usar para persistir el estado específico de la VM. Esta estructura se pasa a las funciones nativas cuando se invocan, y debe devolverse al hacer llamadas a Node-API. Específicamente, el mismo `napi_env` que se pasó cuando se llamó a la función nativa inicial debe pasarse a cualquier llamada anidada posterior de Node-API. No se permite almacenar en caché el `napi_env` con el propósito de reutilización general, ni pasar el `napi_env` entre instancias del mismo complemento que se ejecutan en diferentes hilos [`Worker`](/es/nodejs/api/worker_threads#class-worker). El `napi_env` se vuelve inválido cuando se descarga una instancia de un complemento nativo. La notificación de este evento se entrega a través de las devoluciones de llamada proporcionadas a [`napi_add_env_cleanup_hook`](/es/nodejs/api/n-api#napi_add_env_cleanup_hook) y [`napi_set_instance_data`](/es/nodejs/api/n-api#napi_set_instance_data).

### `node_api_basic_env` {#node_api_basic_env}

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

Esta variante de `napi_env` se pasa a los finalizadores síncronos ([`node_api_basic_finalize`](/es/nodejs/api/n-api#node_api_basic_finalize)). Hay un subconjunto de Node-APIs que aceptan un parámetro de tipo `node_api_basic_env` como su primer argumento. Estas APIs no acceden al estado del motor de JavaScript y, por lo tanto, son seguras para llamar desde finalizadores síncronos. Se permite pasar un parámetro de tipo `napi_env` a estas APIs, sin embargo, no se permite pasar un parámetro de tipo `node_api_basic_env` a APIs que acceden al estado del motor de JavaScript. Intentar hacerlo sin una conversión producirá una advertencia del compilador o un error cuando los complementos se compilen con flags que hacen que emitan advertencias y/o errores cuando se pasan tipos de punteros incorrectos a una función. Llamar a tales APIs desde un finalizador síncrono finalmente resultará en la terminación de la aplicación.

### `napi_value` {#napi_value}

Este es un puntero opaco que se usa para representar un valor de JavaScript.


### `napi_threadsafe_function` {#napi_threadsafe_function}

**Añadido en: v10.6.0**

**Versión de N-API: 4**

Este es un puntero opaco que representa una función JavaScript que puede ser llamada asíncronamente desde múltiples hilos a través de `napi_call_threadsafe_function()`.

### `napi_threadsafe_function_release_mode` {#napi_threadsafe_function_release_mode}

**Añadido en: v10.6.0**

**Versión de N-API: 4**

Un valor que se le da a `napi_release_threadsafe_function()` para indicar si la función segura para hilos debe cerrarse inmediatamente (`napi_tsfn_abort`) o simplemente liberarse (`napi_tsfn_release`) y, por lo tanto, estar disponible para su uso posterior a través de `napi_acquire_threadsafe_function()` y `napi_call_threadsafe_function()`.

```C [C]
typedef enum {
  napi_tsfn_release,
  napi_tsfn_abort
} napi_threadsafe_function_release_mode;
```
### `napi_threadsafe_function_call_mode` {#napi_threadsafe_function_call_mode}

**Añadido en: v10.6.0**

**Versión de N-API: 4**

Un valor que se le da a `napi_call_threadsafe_function()` para indicar si la llamada debe bloquearse cuando la cola asociada con la función segura para hilos esté llena.

```C [C]
typedef enum {
  napi_tsfn_nonblocking,
  napi_tsfn_blocking
} napi_threadsafe_function_call_mode;
```
### Tipos de gestión de memoria de Node-API {#node-api-memory-management-types}

#### `napi_handle_scope` {#napi_handle_scope}

Esta es una abstracción utilizada para controlar y modificar la vida útil de los objetos creados dentro de un ámbito particular. En general, los valores de Node-API se crean dentro del contexto de un ámbito de manejador. Cuando se llama a un método nativo desde JavaScript, existirá un ámbito de manejador predeterminado. Si el usuario no crea explícitamente un nuevo ámbito de manejador, los valores de Node-API se crearán en el ámbito de manejador predeterminado. Para cualquier invocación de código fuera de la ejecución de un método nativo (por ejemplo, durante una invocación de retorno de llamada de libuv), el módulo debe crear un ámbito antes de invocar cualquier función que pueda resultar en la creación de valores de JavaScript.

Los ámbitos de manejador se crean usando [`napi_open_handle_scope`](/es/nodejs/api/n-api#napi_open_handle_scope) y se destruyen usando [`napi_close_handle_scope`](/es/nodejs/api/n-api#napi_close_handle_scope). Cerrar el ámbito puede indicar al GC que todos los `napi_value` creados durante la vida útil del ámbito del manejador ya no se referencian desde el marco de pila actual.

Para obtener más detalles, revise la [Gestión de la vida útil de los objetos](/es/nodejs/api/n-api#object-lifetime-management).


#### `napi_escapable_handle_scope` {#napi_escapable_handle_scope}

**Añadido en: v8.0.0**

**Versión de N-API: 1**

Los ámbitos de manejo escapables son un tipo especial de ámbito de manejo para devolver valores creados dentro de un ámbito de manejo particular a un ámbito principal.

#### `napi_ref` {#napi_ref}

**Añadido en: v8.0.0**

**Versión de N-API: 1**

Esta es la abstracción a utilizar para referenciar un `napi_value`. Esto permite a los usuarios administrar la vida útil de los valores de JavaScript, incluyendo la definición explícita de sus vidas útiles mínimas.

Para más detalles, revise la [Gestión de la vida útil de los objetos](/es/nodejs/api/n-api#object-lifetime-management).

#### `napi_type_tag` {#napi_type_tag}

**Añadido en: v14.8.0, v12.19.0**

**Versión de N-API: 8**

Un valor de 128 bits almacenado como dos enteros sin signo de 64 bits. Sirve como un UUID con el cual los objetos JavaScript o [externos](/es/nodejs/api/n-api#napi_create_external) pueden ser "etiquetados" para asegurar que son de un cierto tipo. Esta es una comprobación más fuerte que [`napi_instanceof`](/es/nodejs/api/n-api#napi_instanceof), porque la última puede reportar un falso positivo si el prototipo del objeto ha sido manipulado. El etiquetado de tipo es más útil en conjunto con [`napi_wrap`](/es/nodejs/api/n-api#napi_wrap) porque asegura que el puntero recuperado de un objeto envuelto puede ser convertido de forma segura al tipo nativo correspondiente a la etiqueta de tipo que ha sido previamente aplicada al objeto JavaScript.

```C [C]
typedef struct {
  uint64_t lower;
  uint64_t upper;
} napi_type_tag;
```
#### `napi_async_cleanup_hook_handle` {#napi_async_cleanup_hook_handle}

**Añadido en: v14.10.0, v12.19.0**

Un valor opaco devuelto por [`napi_add_async_cleanup_hook`](/es/nodejs/api/n-api#napi_add_async_cleanup_hook). Debe ser pasado a [`napi_remove_async_cleanup_hook`](/es/nodejs/api/n-api#napi_remove_async_cleanup_hook) cuando la cadena de eventos de limpieza asíncronos se completa.

### Tipos de callback de Node-API {#node-api-callback-types}

#### `napi_callback_info` {#napi_callback_info}

**Añadido en: v8.0.0**

**Versión de N-API: 1**

Tipo de datos opaco que se pasa a una función de callback. Puede ser utilizado para obtener información adicional sobre el contexto en el cual el callback fue invocado.

#### `napi_callback` {#napi_callback}

**Añadido en: v8.0.0**

**Versión de N-API: 1**

Tipo de puntero de función para funciones nativas proporcionadas por el usuario que deben ser expuestas a JavaScript a través de Node-API. Las funciones de callback deben satisfacer la siguiente firma:

```C [C]
typedef napi_value (*napi_callback)(napi_env, napi_callback_info);
```
A menos que por razones discutidas en [Gestión de la vida útil de los objetos](/es/nodejs/api/n-api#object-lifetime-management), crear un ámbito de manejo y/o callback dentro de un `napi_callback` no es necesario.


#### `node_api_basic_finalize` {#node_api_basic_finalize}

**Añadido en: v21.6.0, v20.12.0, v18.20.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

Tipo de puntero de función para funciones proporcionadas por el complemento que permiten al usuario ser notificado cuando los datos de propiedad externa están listos para ser limpiados porque el objeto al que estaban asociados ha sido recolectado por el recolector de basura. El usuario debe proporcionar una función que satisfaga la siguiente firma que se llamaría al recolectar el objeto. Actualmente, `node_api_basic_finalize` se puede utilizar para averiguar cuándo se recolectan los objetos que tienen datos externos.

```C [C]
typedef void (*node_api_basic_finalize)(node_api_basic_env env,
                                      void* finalize_data,
                                      void* finalize_hint);
```
A menos que por razones discutidas en [Gestión del ciclo de vida de los objetos](/es/nodejs/api/n-api#object-lifetime-management), no es necesario crear un manejador y/o un ámbito de devolución de llamada dentro del cuerpo de la función.

Dado que estas funciones pueden ser llamadas mientras el motor de JavaScript está en un estado en el que no puede ejecutar código JavaScript, solo se pueden llamar las API de Node que aceptan un `node_api_basic_env` como su primer parámetro. Se puede utilizar [`node_api_post_finalizer`](/es/nodejs/api/n-api#node_api_post_finalizer) para programar llamadas a la API de Node que requieren acceso al estado del motor de JavaScript para que se ejecuten después de que se haya completado el ciclo de recolección de basura actual.

En el caso de [`node_api_create_external_string_latin1`](/es/nodejs/api/n-api#node_api_create_external_string_latin1) y [`node_api_create_external_string_utf16`](/es/nodejs/api/n-api#node_api_create_external_string_utf16) el parámetro `env` puede ser nulo, porque las cadenas externas pueden ser recolectadas durante la última parte del cierre del entorno.

Historial de cambios:

-  experimental (`NAPI_EXPERIMENTAL`): Solo se pueden llamar las llamadas a la API de Node que aceptan un `node_api_basic_env` como su primer parámetro, de lo contrario, la aplicación se terminará con un mensaje de error apropiado. Esta función se puede desactivar definiendo `NODE_API_EXPERIMENTAL_BASIC_ENV_OPT_OUT`.


#### `napi_finalize` {#napi_finalize}

**Agregado en: v8.0.0**

**Versión de N-API: 1**

Tipo de puntero de función para la función proporcionada por el complemento que permite al usuario programar un grupo de llamadas a Node-APIs en respuesta a un evento de recolección de basura, después de que se haya completado el ciclo de recolección de basura. Estos punteros de función se pueden utilizar con [`node_api_post_finalizer`](/es/nodejs/api/n-api#node_api_post_finalizer).

```C [C]
typedef void (*napi_finalize)(napi_env env,
                              void* finalize_data,
                              void* finalize_hint);
```
Historial de cambios:

- experimental (`NAPI_EXPERIMENTAL` está definido): Una función de este tipo ya no se puede utilizar como finalizador, excepto con [`node_api_post_finalizer`](/es/nodejs/api/n-api#node_api_post_finalizer). En su lugar, se debe usar [`node_api_basic_finalize`](/es/nodejs/api/n-api#node_api_basic_finalize). Esta característica se puede desactivar definiendo `NODE_API_EXPERIMENTAL_BASIC_ENV_OPT_OUT`.

#### `napi_async_execute_callback` {#napi_async_execute_callback}

**Agregado en: v8.0.0**

**Versión de N-API: 1**

Puntero de función utilizado con funciones que admiten operaciones asíncronas. Las funciones de callback deben satisfacer la siguiente firma:

```C [C]
typedef void (*napi_async_execute_callback)(napi_env env, void* data);
```
Las implementaciones de esta función deben evitar realizar llamadas Node-API que ejecuten JavaScript o interactúen con objetos JavaScript. Las llamadas Node-API deben estar en `napi_async_complete_callback` en su lugar. No use el parámetro `napi_env` ya que es probable que resulte en la ejecución de JavaScript.

#### `napi_async_complete_callback` {#napi_async_complete_callback}

**Agregado en: v8.0.0**

**Versión de N-API: 1**

Puntero de función utilizado con funciones que admiten operaciones asíncronas. Las funciones de callback deben satisfacer la siguiente firma:

```C [C]
typedef void (*napi_async_complete_callback)(napi_env env,
                                             napi_status status,
                                             void* data);
```
A menos que sea por razones discutidas en [Gestión del ciclo de vida de los objetos](/es/nodejs/api/n-api#object-lifetime-management), no es necesario crear un handle y/o un scope de callback dentro del cuerpo de la función.


#### `napi_threadsafe_function_call_js` {#napi_threadsafe_function_call_js}

**Agregado en: v10.6.0**

**Versión N-API: 4**

Puntero de función utilizado con llamadas asíncronas a funciones thread-safe. La callback será llamada en el hilo principal. Su propósito es usar un elemento de datos que llega a través de la cola desde uno de los hilos secundarios para construir los parámetros necesarios para una llamada a JavaScript, usualmente a través de `napi_call_function`, y luego realizar la llamada a JavaScript.

Los datos que llegan desde el hilo secundario a través de la cola se dan en el parámetro `data` y la función JavaScript a llamar se da en el parámetro `js_callback`.

Node-API establece el entorno antes de llamar a esta callback, por lo que es suficiente llamar a la función JavaScript a través de `napi_call_function` en lugar de a través de `napi_make_callback`.

Las funciones de callback deben satisfacer la siguiente firma:

```C [C]
typedef void (*napi_threadsafe_function_call_js)(napi_env env,
                                                 napi_value js_callback,
                                                 void* context,
                                                 void* data);
```
- `[in] env`: El entorno a utilizar para las llamadas API, o `NULL` si la función thread-safe está siendo desmantelada y `data` puede necesitar ser liberada.
- `[in] js_callback`: La función JavaScript a llamar, o `NULL` si la función thread-safe está siendo desmantelada y `data` puede necesitar ser liberada. También puede ser `NULL` si la función thread-safe fue creada sin `js_callback`.
- `[in] context`: Los datos opcionales con los que se creó la función thread-safe.
- `[in] data`: Datos creados por el hilo secundario. Es responsabilidad de la callback convertir estos datos nativos a valores JavaScript (con funciones Node-API) que pueden ser pasados como parámetros cuando se invoca `js_callback`. Este puntero es gestionado enteramente por los hilos y esta callback. Por lo tanto, esta callback debería liberar los datos.

A menos que sea por razones discutidas en [Gestión del ciclo de vida de los objetos](/es/nodejs/api/n-api#object-lifetime-management), no es necesario crear un manejador y/o un ámbito de callback dentro del cuerpo de la función.


#### `napi_cleanup_hook` {#napi_cleanup_hook}

**Agregado en: v19.2.0, v18.13.0**

**Versión N-API: 3**

Puntero de función utilizado con [`napi_add_env_cleanup_hook`](/es/nodejs/api/n-api#napi_add_env_cleanup_hook). Se llamará cuando el entorno se esté cerrando.

Las funciones de callback deben satisfacer la siguiente firma:

```C [C]
typedef void (*napi_cleanup_hook)(void* data);
```
- `[in] data`: Los datos que se pasaron a [`napi_add_env_cleanup_hook`](/es/nodejs/api/n-api#napi_add_env_cleanup_hook).

#### `napi_async_cleanup_hook` {#napi_async_cleanup_hook}

**Agregado en: v14.10.0, v12.19.0**

Puntero de función utilizado con [`napi_add_async_cleanup_hook`](/es/nodejs/api/n-api#napi_add_async_cleanup_hook). Se llamará cuando el entorno se esté cerrando.

Las funciones de callback deben satisfacer la siguiente firma:

```C [C]
typedef void (*napi_async_cleanup_hook)(napi_async_cleanup_hook_handle handle,
                                        void* data);
```
- `[in] handle`: El handle que debe pasarse a [`napi_remove_async_cleanup_hook`](/es/nodejs/api/n-api#napi_remove_async_cleanup_hook) después de la finalización de la limpieza asíncrona.
- `[in] data`: Los datos que se pasaron a [`napi_add_async_cleanup_hook`](/es/nodejs/api/n-api#napi_add_async_cleanup_hook).

El cuerpo de la función debe iniciar las acciones de limpieza asíncronas al final de las cuales `handle` debe pasarse en una llamada a [`napi_remove_async_cleanup_hook`](/es/nodejs/api/n-api#napi_remove_async_cleanup_hook).

## Manejo de errores {#error-handling}

Node-API utiliza tanto valores de retorno como excepciones de JavaScript para el manejo de errores. Las siguientes secciones explican el enfoque para cada caso.

### Valores de retorno {#return-values}

Todas las funciones de Node-API comparten el mismo patrón de manejo de errores. El tipo de retorno de todas las funciones de la API es `napi_status`.

El valor de retorno será `napi_ok` si la solicitud fue exitosa y no se generó ninguna excepción de JavaScript no capturada. Si ocurrió un error Y se generó una excepción, se devolverá el valor de `napi_status` para el error. Si se generó una excepción y no ocurrió ningún error, se devolverá `napi_pending_exception`.

En los casos en que se devuelve un valor de retorno diferente a `napi_ok` o `napi_pending_exception`, se debe llamar a [`napi_is_exception_pending`](/es/nodejs/api/n-api#napi_is_exception_pending) para verificar si hay una excepción pendiente. Consulte la sección sobre excepciones para obtener más detalles.

El conjunto completo de posibles valores de `napi_status` se define en `napi_api_types.h`.

El valor de retorno `napi_status` proporciona una representación independiente de la VM del error que ocurrió. En algunos casos, es útil poder obtener información más detallada, incluida una cadena que representa el error, así como información específica de la VM (motor).

Para recuperar esta información, se proporciona [`napi_get_last_error_info`](/es/nodejs/api/n-api#napi_get_last_error_info), que devuelve una estructura `napi_extended_error_info`. El formato de la estructura `napi_extended_error_info` es el siguiente:

**Agregado en: v8.0.0**

**Versión N-API: 1**

```C [C]
typedef struct napi_extended_error_info {
  const char* error_message;
  void* engine_reserved;
  uint32_t engine_error_code;
  napi_status error_code;
};
```
- `error_message`: Representación textual del error que ocurrió.
- `engine_reserved`: Handle opaco reservado solo para uso del motor.
- `engine_error_code`: Código de error específico de la VM.
- `error_code`: Código de estado de Node-API para el último error.

[`napi_get_last_error_info`](/es/nodejs/api/n-api#napi_get_last_error_info) devuelve la información de la última llamada a Node-API que se realizó.

No confíe en el contenido o formato de ninguna de las informaciones extendidas, ya que no están sujetas a SemVer y pueden cambiar en cualquier momento. Están destinadas únicamente a fines de registro.


#### `napi_get_last_error_info` {#napi_get_last_error_info}

**Agregado en: v8.0.0**

**Versión de N-API: 1**

```C [C]
napi_status
napi_get_last_error_info(node_api_basic_env env,
                         const napi_extended_error_info** result);
```
- `[in] env`: El entorno en el que se invoca la API.
- `[out] result`: La estructura `napi_extended_error_info` con más información sobre el error.

Devuelve `napi_ok` si la API se ejecutó correctamente.

Esta API recupera una estructura `napi_extended_error_info` con información sobre el último error que se produjo.

El contenido de la `napi_extended_error_info` devuelta solo es válido hasta que se llama a una función Node-API en el mismo `env`. Esto incluye una llamada a `napi_is_exception_pending`, por lo que a menudo puede ser necesario hacer una copia de la información para que pueda usarse más adelante. El puntero devuelto en `error_message` apunta a una cadena definida estáticamente, por lo que es seguro usar ese puntero si lo ha copiado del campo `error_message` (que se sobrescribirá) antes de que se llamara a otra función Node-API.

No confíe en el contenido o el formato de ninguna de la información extendida, ya que no está sujeta a SemVer y puede cambiar en cualquier momento. Está destinado únicamente a fines de registro.

Se puede llamar a esta API incluso si hay una excepción de JavaScript pendiente.

### Excepciones {#exceptions}

Cualquier llamada a la función Node-API puede resultar en una excepción de JavaScript pendiente. Este es el caso de cualquiera de las funciones API, incluso aquellas que pueden no causar la ejecución de JavaScript.

Si el `napi_status` devuelto por una función es `napi_ok`, entonces no hay ninguna excepción pendiente y no se requiere ninguna acción adicional. Si el `napi_status` devuelto es diferente de `napi_ok` o `napi_pending_exception`, para intentar recuperarse y continuar en lugar de simplemente regresar inmediatamente, se debe llamar a [`napi_is_exception_pending`](/es/nodejs/api/n-api#napi_is_exception_pending) para determinar si hay una excepción pendiente o no.

En muchos casos, cuando se llama a una función Node-API y ya hay una excepción pendiente, la función devolverá inmediatamente un `napi_status` de `napi_pending_exception`. Sin embargo, este no es el caso de todas las funciones. Node-API permite que se llame a un subconjunto de las funciones para permitir una limpieza mínima antes de regresar a JavaScript. En ese caso, `napi_status` reflejará el estado de la función. No reflejará las excepciones pendientes anteriores. Para evitar confusiones, verifique el estado del error después de cada llamada a la función.

Cuando hay una excepción pendiente, se puede emplear uno de dos enfoques.

El primer enfoque es realizar cualquier limpieza apropiada y luego regresar para que la ejecución regrese a JavaScript. Como parte de la transición de regreso a JavaScript, la excepción se lanzará en el punto del código JavaScript donde se invocó el método nativo. El comportamiento de la mayoría de las llamadas de Node-API no está especificado mientras una excepción está pendiente, y muchas simplemente devolverán `napi_pending_exception`, así que haga lo menos posible y luego regrese a JavaScript donde se pueda manejar la excepción.

El segundo enfoque es intentar manejar la excepción. Habrá casos en los que el código nativo puede capturar la excepción, tomar la acción apropiada y luego continuar. Esto solo se recomienda en casos específicos donde se sabe que la excepción se puede manejar de manera segura. En estos casos, [`napi_get_and_clear_last_exception`](/es/nodejs/api/n-api#napi_get_and_clear_last_exception) se puede usar para obtener y borrar la excepción. Si tiene éxito, el resultado contendrá el manejador del último `Object` de JavaScript lanzado. Si se determina, después de recuperar la excepción, que la excepción no se puede manejar después de todo, se puede volver a lanzar con [`napi_throw`](/es/nodejs/api/n-api#napi_throw) donde error es el valor de JavaScript que se va a lanzar.

Las siguientes funciones de utilidad también están disponibles en caso de que el código nativo necesite lanzar una excepción o determinar si un `napi_value` es una instancia de un objeto JavaScript `Error`: [`napi_throw_error`](/es/nodejs/api/n-api#napi_throw_error), [`napi_throw_type_error`](/es/nodejs/api/n-api#napi_throw_type_error), [`napi_throw_range_error`](/es/nodejs/api/n-api#napi_throw_range_error), [`node_api_throw_syntax_error`](/es/nodejs/api/n-api#node_api_throw_syntax_error) y [`napi_is_error`](/es/nodejs/api/n-api#napi_is_error).

Las siguientes funciones de utilidad también están disponibles en caso de que el código nativo necesite crear un objeto `Error`: [`napi_create_error`](/es/nodejs/api/n-api#napi_create_error), [`napi_create_type_error`](/es/nodejs/api/n-api#napi_create_type_error), [`napi_create_range_error`](/es/nodejs/api/n-api#napi_create_range_error) y [`node_api_create_syntax_error`](/es/nodejs/api/n-api#node_api_create_syntax_error), donde result es el `napi_value` que se refiere al objeto JavaScript `Error` recién creado.

El proyecto Node.js está agregando códigos de error a todos los errores generados internamente. El objetivo es que las aplicaciones utilicen estos códigos de error para todas las verificaciones de errores. Los mensajes de error asociados permanecerán, pero solo estarán destinados a ser utilizados para el registro y la visualización con la expectativa de que el mensaje pueda cambiar sin que se aplique SemVer. Para admitir este modelo con Node-API, tanto en la funcionalidad interna como para la funcionalidad específica del módulo (ya que es una buena práctica), las funciones `throw_` y `create_` toman un parámetro de código opcional que es la cadena para el código que se agregará al objeto de error. Si el parámetro opcional es `NULL`, no se asociará ningún código con el error. Si se proporciona un código, el nombre asociado con el error también se actualiza para que sea:

```text [TEXT]
originalName [code]
```
donde `originalName` es el nombre original asociado con el error y `code` es el código que se proporcionó. Por ejemplo, si el código es `'ERR_ERROR_1'` y se está creando un `TypeError`, el nombre será:

```text [TEXT]
TypeError [ERR_ERROR_1]
```

#### `napi_throw` {#napi_throw}

**Agregado en: v8.0.0**

**Versión de N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_throw(napi_env env, napi_value error);
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] error`: El valor de JavaScript que se va a lanzar.

Devuelve `napi_ok` si la API tuvo éxito.

Esta API lanza el valor de JavaScript proporcionado.

#### `napi_throw_error` {#napi_throw_error}

**Agregado en: v8.0.0**

**Versión de N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_throw_error(napi_env env,
                                         const char* code,
                                         const char* msg);
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] code`: Código de error opcional que se establecerá en el error.
- `[in] msg`: Cadena C que representa el texto que se asociará con el error.

Devuelve `napi_ok` si la API tuvo éxito.

Esta API lanza un `Error` de JavaScript con el texto proporcionado.

#### `napi_throw_type_error` {#napi_throw_type_error}

**Agregado en: v8.0.0**

**Versión de N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_throw_type_error(napi_env env,
                                              const char* code,
                                              const char* msg);
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] code`: Código de error opcional que se establecerá en el error.
- `[in] msg`: Cadena C que representa el texto que se asociará con el error.

Devuelve `napi_ok` si la API tuvo éxito.

Esta API lanza un `TypeError` de JavaScript con el texto proporcionado.

#### `napi_throw_range_error` {#napi_throw_range_error}

**Agregado en: v8.0.0**

**Versión de N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_throw_range_error(napi_env env,
                                               const char* code,
                                               const char* msg);
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] code`: Código de error opcional que se establecerá en el error.
- `[in] msg`: Cadena C que representa el texto que se asociará con el error.

Devuelve `napi_ok` si la API tuvo éxito.

Esta API lanza un `RangeError` de JavaScript con el texto proporcionado.


#### `node_api_throw_syntax_error` {#node_api_throw_syntax_error}

**Agregado en: v17.2.0, v16.14.0**

**Versión de N-API: 9**

```C [C]
NAPI_EXTERN napi_status node_api_throw_syntax_error(napi_env env,
                                                    const char* code,
                                                    const char* msg);
```
- `[in] env`: El entorno bajo el que se invoca la API.
- `[in] code`: Código de error opcional que se establecerá en el error.
- `[in] msg`: Cadena C que representa el texto que se asociará con el error.

Devuelve `napi_ok` si la API se ejecutó correctamente.

Esta API lanza un `SyntaxError` de JavaScript con el texto proporcionado.

#### `napi_is_error` {#napi_is_error}

**Agregado en: v8.0.0**

**Versión de N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_is_error(napi_env env,
                                      napi_value value,
                                      bool* result);
```
- `[in] env`: El entorno bajo el que se invoca la API.
- `[in] value`: El `napi_value` que se va a verificar.
- `[out] result`: Valor booleano que se establece en true si `napi_value` representa un error, false en caso contrario.

Devuelve `napi_ok` si la API se ejecutó correctamente.

Esta API consulta un `napi_value` para comprobar si representa un objeto de error.

#### `napi_create_error` {#napi_create_error}

**Agregado en: v8.0.0**

**Versión de N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_create_error(napi_env env,
                                          napi_value code,
                                          napi_value msg,
                                          napi_value* result);
```
- `[in] env`: El entorno bajo el que se invoca la API.
- `[in] code`: `napi_value` opcional con la cadena para el código de error que se asociará con el error.
- `[in] msg`: `napi_value` que hace referencia a una `string` de JavaScript que se utilizará como mensaje para el `Error`.
- `[out] result`: `napi_value` que representa el error creado.

Devuelve `napi_ok` si la API se ejecutó correctamente.

Esta API devuelve un `Error` de JavaScript con el texto proporcionado.

#### `napi_create_type_error` {#napi_create_type_error}

**Agregado en: v8.0.0**

**Versión de N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_create_type_error(napi_env env,
                                               napi_value code,
                                               napi_value msg,
                                               napi_value* result);
```
- `[in] env`: El entorno bajo el que se invoca la API.
- `[in] code`: `napi_value` opcional con la cadena para el código de error que se asociará con el error.
- `[in] msg`: `napi_value` que hace referencia a una `string` de JavaScript que se utilizará como mensaje para el `Error`.
- `[out] result`: `napi_value` que representa el error creado.

Devuelve `napi_ok` si la API se ejecutó correctamente.

Esta API devuelve un `TypeError` de JavaScript con el texto proporcionado.


#### `napi_create_range_error` {#napi_create_range_error}

**Agregado en: v8.0.0**

**Versión N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_create_range_error(napi_env env,
                                                napi_value code,
                                                napi_value msg,
                                                napi_value* result);
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] code`: `napi_value` opcional con la cadena para el código de error que se asociará con el error.
- `[in] msg`: `napi_value` que hace referencia a una `string` de JavaScript que se utilizará como mensaje para el `Error`.
- `[out] result`: `napi_value` que representa el error creado.

Devuelve `napi_ok` si la API tuvo éxito.

Esta API devuelve un `RangeError` de JavaScript con el texto proporcionado.

#### `node_api_create_syntax_error` {#node_api_create_syntax_error}

**Agregado en: v17.2.0, v16.14.0**

**Versión N-API: 9**

```C [C]
NAPI_EXTERN napi_status node_api_create_syntax_error(napi_env env,
                                                     napi_value code,
                                                     napi_value msg,
                                                     napi_value* result);
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] code`: `napi_value` opcional con la cadena para el código de error que se asociará con el error.
- `[in] msg`: `napi_value` que hace referencia a una `string` de JavaScript que se utilizará como mensaje para el `Error`.
- `[out] result`: `napi_value` que representa el error creado.

Devuelve `napi_ok` si la API tuvo éxito.

Esta API devuelve un `SyntaxError` de JavaScript con el texto proporcionado.

#### `napi_get_and_clear_last_exception` {#napi_get_and_clear_last_exception}

**Agregado en: v8.0.0**

**Versión N-API: 1**

```C [C]
napi_status napi_get_and_clear_last_exception(napi_env env,
                                              napi_value* result);
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[out] result`: La excepción si hay una pendiente, `NULL` de lo contrario.

Devuelve `napi_ok` si la API tuvo éxito.

Se puede llamar a esta API incluso si hay una excepción de JavaScript pendiente.


#### `napi_is_exception_pending` {#napi_is_exception_pending}

**Agregada en: v8.0.0**

**Versión de N-API: 1**

```C [C]
napi_status napi_is_exception_pending(napi_env env, bool* result);
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[out] result`: Valor booleano que se establece en verdadero si hay una excepción pendiente.

Devuelve `napi_ok` si la API tuvo éxito.

Esta API se puede llamar incluso si hay una excepción de JavaScript pendiente.

#### `napi_fatal_exception` {#napi_fatal_exception}

**Agregada en: v9.10.0**

**Versión de N-API: 3**

```C [C]
napi_status napi_fatal_exception(napi_env env, napi_value err);
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] err`: El error que se pasa a `'uncaughtException'`.

Activa una `'uncaughtException'` en JavaScript. Útil si una devolución de llamada asíncrona lanza una excepción sin forma de recuperarse.

### Errores fatales {#fatal-errors}

En caso de un error irrecuperable en un complemento nativo, se puede lanzar un error fatal para terminar inmediatamente el proceso.

#### `napi_fatal_error` {#napi_fatal_error}

**Agregada en: v8.2.0**

**Versión de N-API: 1**

```C [C]
NAPI_NO_RETURN void napi_fatal_error(const char* location,
                                     size_t location_len,
                                     const char* message,
                                     size_t message_len);
```
- `[in] location`: Ubicación opcional en la que ocurrió el error.
- `[in] location_len`: La longitud de la ubicación en bytes, o `NAPI_AUTO_LENGTH` si termina en nulo.
- `[in] message`: El mensaje asociado con el error.
- `[in] message_len`: La longitud del mensaje en bytes, o `NAPI_AUTO_LENGTH` si termina en nulo.

La llamada a la función no regresa, el proceso finalizará.

Esta API se puede llamar incluso si hay una excepción de JavaScript pendiente.

## Gestión de la vida útil de los objetos {#object-lifetime-management}

A medida que se realizan las llamadas a Node-API, los identificadores de los objetos en el montón para la VM subyacente pueden devolverse como `napi_values`. Estos identificadores deben mantener los objetos "vivos" hasta que el código nativo ya no los necesite; de lo contrario, los objetos podrían recolectarse antes de que el código nativo terminara de usarlos.

A medida que se devuelven los identificadores de objetos, se asocian con un "ámbito". La vida útil del ámbito predeterminado está ligada a la vida útil de la llamada al método nativo. El resultado es que, de forma predeterminada, los identificadores permanecen válidos y los objetos asociados con estos identificadores se mantendrán activos durante la vida útil de la llamada al método nativo.

En muchos casos, sin embargo, es necesario que los identificadores permanezcan válidos durante una vida útil más corta o más larga que la del método nativo. Las secciones que siguen describen las funciones de Node-API que se pueden usar para cambiar la vida útil del identificador del valor predeterminado.


### Acortar la vida útil de un manejador a un tiempo menor que el del método nativo {#making-handle-lifespan-shorter-than-that-of-the-native-method}

A menudo es necesario que la vida útil de los manejadores sea más corta que la vida útil de un método nativo. Por ejemplo, considere un método nativo que tiene un bucle que itera a través de los elementos en un array grande:

```C [C]
for (int i = 0; i < 1000000; i++) {
  napi_value result;
  napi_status status = napi_get_element(env, object, i, &result);
  if (status != napi_ok) {
    break;
  }
  // do something with element
}
```
Esto resultaría en un gran número de manejadores siendo creados, consumiendo recursos sustanciales. Además, aunque el código nativo sólo pudiera utilizar el manejador más reciente, todos los objetos asociados también se mantendrían vivos, ya que todos comparten el mismo ámbito.

Para manejar este caso, Node-API proporciona la capacidad de establecer un nuevo 'ámbito' al que se asociarán los manejadores recién creados. Una vez que estos manejadores ya no son necesarios, el ámbito puede ser 'cerrado' y cualquier manejador asociado con el ámbito es invalidado. Los métodos disponibles para abrir/cerrar ámbitos son [`napi_open_handle_scope`](/es/nodejs/api/n-api#napi_open_handle_scope) y [`napi_close_handle_scope`](/es/nodejs/api/n-api#napi_close_handle_scope).

Node-API sólo soporta una única jerarquía anidada de ámbitos. Sólo hay un ámbito activo en cualquier momento, y todos los nuevos manejadores se asociarán con ese ámbito mientras esté activo. Los ámbitos deben cerrarse en el orden inverso al que se abrieron. Además, todos los ámbitos creados dentro de un método nativo deben cerrarse antes de regresar de ese método.

Tomando el ejemplo anterior, añadir llamadas a [`napi_open_handle_scope`](/es/nodejs/api/n-api#napi_open_handle_scope) y [`napi_close_handle_scope`](/es/nodejs/api/n-api#napi_close_handle_scope) aseguraría que como máximo un solo manejador sea válido durante la ejecución del bucle:

```C [C]
for (int i = 0; i < 1000000; i++) {
  napi_handle_scope scope;
  napi_status status = napi_open_handle_scope(env, &scope);
  if (status != napi_ok) {
    break;
  }
  napi_value result;
  status = napi_get_element(env, object, i, &result);
  if (status != napi_ok) {
    break;
  }
  // do something with element
  status = napi_close_handle_scope(env, scope);
  if (status != napi_ok) {
    break;
  }
}
```
Cuando se anidan los ámbitos, hay casos en los que un manejador de un ámbito interior necesita vivir más allá de la vida útil de ese ámbito. Node-API soporta un 'ámbito escapable' para soportar este caso. Un ámbito escapable permite que un manejador sea 'promovido' para que 'escape' del ámbito actual y la vida útil del manejador cambie del ámbito actual al ámbito exterior.

Los métodos disponibles para abrir/cerrar ámbitos escapables son [`napi_open_escapable_handle_scope`](/es/nodejs/api/n-api#napi_open_escapable_handle_scope) y [`napi_close_escapable_handle_scope`](/es/nodejs/api/n-api#napi_close_escapable_handle_scope).

La solicitud para promover un manejador se realiza a través de [`napi_escape_handle`](/es/nodejs/api/n-api#napi_escape_handle) que sólo puede ser llamado una vez.


#### `napi_open_handle_scope` {#napi_open_handle_scope}

**Añadido en: v8.0.0**

**Versión de N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_open_handle_scope(napi_env env,
                                               napi_handle_scope* result);
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[out] result`: `napi_value` que representa el nuevo ámbito.

Devuelve `napi_ok` si la API tuvo éxito.

Esta API abre un nuevo ámbito.

#### `napi_close_handle_scope` {#napi_close_handle_scope}

**Añadido en: v8.0.0**

**Versión de N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_close_handle_scope(napi_env env,
                                                napi_handle_scope scope);
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] scope`: `napi_value` que representa el ámbito que se va a cerrar.

Devuelve `napi_ok` si la API tuvo éxito.

Esta API cierra el ámbito pasado. Los ámbitos deben cerrarse en el orden inverso al que fueron creados.

Esta API se puede llamar incluso si hay una excepción de JavaScript pendiente.

#### `napi_open_escapable_handle_scope` {#napi_open_escapable_handle_scope}

**Añadido en: v8.0.0**

**Versión de N-API: 1**

```C [C]
NAPI_EXTERN napi_status
    napi_open_escapable_handle_scope(napi_env env,
                                     napi_handle_scope* result);
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[out] result`: `napi_value` que representa el nuevo ámbito.

Devuelve `napi_ok` si la API tuvo éxito.

Esta API abre un nuevo ámbito desde el cual se puede promover un objeto al ámbito exterior.

#### `napi_close_escapable_handle_scope` {#napi_close_escapable_handle_scope}

**Añadido en: v8.0.0**

**Versión de N-API: 1**

```C [C]
NAPI_EXTERN napi_status
    napi_close_escapable_handle_scope(napi_env env,
                                      napi_handle_scope scope);
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] scope`: `napi_value` que representa el ámbito que se va a cerrar.

Devuelve `napi_ok` si la API tuvo éxito.

Esta API cierra el ámbito pasado. Los ámbitos deben cerrarse en el orden inverso al que fueron creados.

Esta API se puede llamar incluso si hay una excepción de JavaScript pendiente.


#### `napi_escape_handle` {#napi_escape_handle}

**Agregado en: v8.0.0**

**Versión N-API: 1**

```C [C]
napi_status napi_escape_handle(napi_env env,
                               napi_escapable_handle_scope scope,
                               napi_value escapee,
                               napi_value* result);
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] scope`: `napi_value` que representa el ámbito actual.
- `[in] escapee`: `napi_value` que representa el `Object` de JavaScript que se va a escapar.
- `[out] result`: `napi_value` que representa el manipulador del `Object` escapado en el ámbito exterior.

Devuelve `napi_ok` si la API tuvo éxito.

Esta API promueve el manipulador al objeto JavaScript para que sea válido durante la vida útil del ámbito exterior. Solo se puede llamar una vez por ámbito. Si se llama más de una vez, se devolverá un error.

Esta API se puede llamar incluso si hay una excepción de JavaScript pendiente.

### Referencias a valores con una vida útil más larga que la del método nativo {#references-to-values-with-a-lifespan-longer-than-that-of-the-native-method}

En algunos casos, un complemento deberá poder crear y hacer referencia a valores con una vida útil más larga que la de una sola invocación de método nativo. Por ejemplo, para crear un constructor y luego usar ese constructor en una solicitud para crear instancias, debe ser posible hacer referencia al objeto constructor en muchas solicitudes de creación de instancias diferentes. Esto no sería posible con un manipulador normal devuelto como un `napi_value` como se describe en la sección anterior. La vida útil de un manipulador normal es gestionada por los ámbitos y todos los ámbitos deben cerrarse antes del final de un método nativo.

Node-API proporciona métodos para crear referencias persistentes a valores. Actualmente, Node-API solo permite que se creen referencias para un conjunto limitado de tipos de valor, incluyendo objeto, externo, función y símbolo.

Cada referencia tiene un recuento asociado con un valor de 0 o superior, que determina si la referencia mantendrá vivo el valor correspondiente. Las referencias con un recuento de 0 no impiden que se recolecten los valores. Los valores de los tipos objeto (objeto, función, externo) y símbolo se están convirtiendo en referencias 'débiles' y aún se puede acceder a ellos mientras no se recolectan. Cualquier recuento mayor que 0 evitará que se recolecten los valores.

Los valores de símbolo tienen diferentes variantes. El verdadero comportamiento de referencia débil solo es compatible con los símbolos locales creados con la función `napi_create_symbol` o las llamadas al constructor `Symbol()` de JavaScript. Los símbolos registrados globalmente creados con la función `node_api_symbol_for` o las llamadas a la función `Symbol.for()` de JavaScript siguen siendo siempre referencias fuertes porque el recolector de basura no los recolecta. Lo mismo ocurre con los símbolos conocidos como `Symbol.iterator`. Tampoco son nunca recolectados por el recolector de basura.

Las referencias se pueden crear con un recuento de referencias inicial. El recuento se puede modificar a través de [`napi_reference_ref`](/es/nodejs/api/n-api#napi_reference_ref) y [`napi_reference_unref`](/es/nodejs/api/n-api#napi_reference_unref). Si un objeto se recolecta mientras el recuento de una referencia es 0, todas las llamadas posteriores para obtener el objeto asociado a la referencia [`napi_get_reference_value`](/es/nodejs/api/n-api#napi_get_reference_value) devolverán `NULL` para el `napi_value` devuelto. Un intento de llamar a [`napi_reference_ref`](/es/nodejs/api/n-api#napi_reference_ref) para una referencia cuyo objeto ha sido recolectado resulta en un error.

Las referencias deben eliminarse una vez que el complemento ya no las necesite. Cuando se elimina una referencia, ya no evitará que se recolecte el objeto correspondiente. El no eliminar una referencia persistente resulta en una 'fuga de memoria' con tanto la memoria nativa para la referencia persistente como el objeto correspondiente en el montón siendo retenidos para siempre.

Puede haber múltiples referencias persistentes creadas que se refieran al mismo objeto, cada una de las cuales mantendrá vivo o no el objeto basándose en su recuento individual. Múltiples referencias persistentes al mismo objeto pueden resultar en mantener inesperadamente viva la memoria nativa. Las estructuras nativas para una referencia persistente deben mantenerse vivas hasta que se ejecuten los finalizadores para el objeto referenciado. Si se crea una nueva referencia persistente para el mismo objeto, los finalizadores para ese objeto no se ejecutarán y la memoria nativa apuntada por la referencia persistente anterior no se liberará. Esto se puede evitar llamando a `napi_delete_reference` además de `napi_reference_unref` cuando sea posible.

**Historial de cambios:**

- Experimental (`NAPI_EXPERIMENTAL` está definido): Se pueden crear referencias para todos los tipos de valor. Los nuevos tipos de valor admitidos no admiten la semántica de referencia débil y los valores de estos tipos se liberan cuando el recuento de referencias se convierte en 0 y ya no se puede acceder a ellos desde la referencia.


#### `napi_create_reference` {#napi_create_reference}

**Agregado en: v8.0.0**

**Versión N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_create_reference(napi_env env,
                                              napi_value value,
                                              uint32_t initial_refcount,
                                              napi_ref* result);
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] value`: El `napi_value` para el cual se está creando una referencia.
- `[in] initial_refcount`: Recuento de referencias inicial para la nueva referencia.
- `[out] result`: `napi_ref` que apunta a la nueva referencia.

Devuelve `napi_ok` si la API tuvo éxito.

Esta API crea una nueva referencia con el recuento de referencias especificado para el valor pasado.

#### `napi_delete_reference` {#napi_delete_reference}

**Agregado en: v8.0.0**

**Versión N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_delete_reference(napi_env env, napi_ref ref);
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] ref`: `napi_ref` que se va a eliminar.

Devuelve `napi_ok` si la API tuvo éxito.

Esta API elimina la referencia pasada.

Esta API se puede llamar incluso si hay una excepción de JavaScript pendiente.

#### `napi_reference_ref` {#napi_reference_ref}

**Agregado en: v8.0.0**

**Versión N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_reference_ref(napi_env env,
                                           napi_ref ref,
                                           uint32_t* result);
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] ref`: `napi_ref` para el cual se incrementará el recuento de referencias.
- `[out] result`: El nuevo recuento de referencias.

Devuelve `napi_ok` si la API tuvo éxito.

Esta API incrementa el recuento de referencias para la referencia pasada y devuelve el recuento de referencias resultante.

#### `napi_reference_unref` {#napi_reference_unref}

**Agregado en: v8.0.0**

**Versión N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_reference_unref(napi_env env,
                                             napi_ref ref,
                                             uint32_t* result);
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] ref`: `napi_ref` para el cual se decrementará el recuento de referencias.
- `[out] result`: El nuevo recuento de referencias.

Devuelve `napi_ok` si la API tuvo éxito.

Esta API decrementa el recuento de referencias para la referencia pasada y devuelve el recuento de referencias resultante.


#### `napi_get_reference_value` {#napi_get_reference_value}

**Agregado en: v8.0.0**

**Versión de N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_get_reference_value(napi_env env,
                                                 napi_ref ref,
                                                 napi_value* result);
```
- `[in] env`: El entorno en el que se invoca la API.
- `[in] ref`: El `napi_ref` para el cual se solicita el valor correspondiente.
- `[out] result`: El `napi_value` referenciado por el `napi_ref`.

Devuelve `napi_ok` si la API tuvo éxito.

Si todavía es válido, esta API devuelve el `napi_value` que representa el valor de JavaScript asociado con el `napi_ref`. De lo contrario, el resultado será `NULL`.

### Limpieza al salir del entorno actual de Node.js {#cleanup-on-exit-of-the-current-nodejs-environment}

Si bien un proceso de Node.js normalmente libera todos sus recursos al salir, los integradores de Node.js o el futuro soporte de Worker pueden requerir que los complementos registren enlaces de limpieza que se ejecutarán una vez que salga el entorno actual de Node.js.

Node-API proporciona funciones para registrar y anular el registro de tales devoluciones de llamada. Cuando se ejecutan esas devoluciones de llamada, se deben liberar todos los recursos que esté reteniendo el complemento.

#### `napi_add_env_cleanup_hook` {#napi_add_env_cleanup_hook}

**Agregado en: v10.2.0**

**Versión de N-API: 3**

```C [C]
NODE_EXTERN napi_status napi_add_env_cleanup_hook(node_api_basic_env env,
                                                  napi_cleanup_hook fun,
                                                  void* arg);
```
Registra `fun` como una función que se ejecutará con el parámetro `arg` una vez que salga el entorno actual de Node.js.

Una función se puede especificar de forma segura varias veces con diferentes valores de `arg`. En ese caso, también se llamará varias veces. No se permite proporcionar los mismos valores `fun` y `arg` varias veces y provocará la interrupción del proceso.

Los enlaces se llamarán en orden inverso, es decir, el que se agregó más recientemente se llamará primero.

La eliminación de este enlace se puede realizar mediante [`napi_remove_env_cleanup_hook`](/es/nodejs/api/n-api#napi_remove_env_cleanup_hook). Por lo general, eso sucede cuando el recurso para el cual se agregó este enlace se está destruyendo de todos modos.

Para la limpieza asincrónica, [`napi_add_async_cleanup_hook`](/es/nodejs/api/n-api#napi_add_async_cleanup_hook) está disponible.


#### `napi_remove_env_cleanup_hook` {#napi_remove_env_cleanup_hook}

**Añadido en: v10.2.0**

**Versión de N-API: 3**

```C [C]
NAPI_EXTERN napi_status napi_remove_env_cleanup_hook(node_api_basic_env env,
                                                     void (*fun)(void* arg),
                                                     void* arg);
```
Cancela el registro de `fun` como una función que se ejecutará con el parámetro `arg` una vez que salga el entorno actual de Node.js. Tanto el argumento como el valor de la función deben coincidir exactamente.

La función debe haber sido registrada originalmente con `napi_add_env_cleanup_hook`, de lo contrario, el proceso se abortará.

#### `napi_add_async_cleanup_hook` {#napi_add_async_cleanup_hook}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v14.10.0, v12.19.0 | Firma modificada de la retrollamada `hook`. |
| v14.8.0, v12.19.0 | Añadido en: v14.8.0, v12.19.0 |
:::

**Versión de N-API: 8**

```C [C]
NAPI_EXTERN napi_status napi_add_async_cleanup_hook(
    node_api_basic_env env,
    napi_async_cleanup_hook hook,
    void* arg,
    napi_async_cleanup_hook_handle* remove_handle);
```
- `[in] env`: El entorno en el que se invoca la API.
- `[in] hook`: El puntero de función para llamar a la hora de desmontar el entorno.
- `[in] arg`: El puntero para pasar a `hook` cuando se le llame.
- `[out] remove_handle`: Manejador opcional que se refiere al gancho de limpieza asíncrono.

Registra `hook`, que es una función de tipo [`napi_async_cleanup_hook`](/es/nodejs/api/n-api#napi_async_cleanup_hook), como una función que se ejecutará con los parámetros `remove_handle` y `arg` una vez que salga el entorno actual de Node.js.

A diferencia de [`napi_add_env_cleanup_hook`](/es/nodejs/api/n-api#napi_add_env_cleanup_hook), se permite que el gancho sea asíncrono.

De lo contrario, el comportamiento generalmente coincide con el de [`napi_add_env_cleanup_hook`](/es/nodejs/api/n-api#napi_add_env_cleanup_hook).

Si `remove_handle` no es `NULL`, se almacenará un valor opaco en él que posteriormente deberá pasarse a [`napi_remove_async_cleanup_hook`](/es/nodejs/api/n-api#napi_remove_async_cleanup_hook), independientemente de si el gancho ya ha sido invocado. Normalmente, eso ocurre cuando el recurso para el que se añadió este gancho se está desmontando de todos modos.


#### `napi_remove_async_cleanup_hook` {#napi_remove_async_cleanup_hook}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v14.10.0, v12.19.0 | Eliminado el parámetro `env`. |
| v14.8.0, v12.19.0 | Agregado en: v14.8.0, v12.19.0 |
:::

```C [C]
NAPI_EXTERN napi_status napi_remove_async_cleanup_hook(
    napi_async_cleanup_hook_handle remove_handle);
```
- `[in] remove_handle`: El controlador de un gancho de limpieza asíncrono que se creó con [`napi_add_async_cleanup_hook`](/es/nodejs/api/n-api#napi_add_async_cleanup_hook).

Anula el registro del gancho de limpieza correspondiente a `remove_handle`. Esto evitará que se ejecute el gancho, a menos que ya haya comenzado a ejecutarse. Esto se debe llamar en cualquier valor `napi_async_cleanup_hook_handle` obtenido de [`napi_add_async_cleanup_hook`](/es/nodejs/api/n-api#napi_add_async_cleanup_hook).

### Finalización al salir del entorno de Node.js {#finalization-on-the-exit-of-the-nodejs-environment}

El entorno de Node.js se puede destruir en cualquier momento tan pronto como sea posible sin permitir la ejecución de JavaScript, como en la solicitud de [`worker.terminate()`](/es/nodejs/api/worker_threads#workerterminate). Cuando se está destruyendo el entorno, las devoluciones de llamada `napi_finalize` registradas de los objetos JavaScript, las funciones seguras para subprocesos y los datos de la instancia del entorno se invocan de forma inmediata e independiente.

La invocación de las devoluciones de llamada `napi_finalize` se programa después de los ganchos de limpieza registrados manualmente. Para garantizar un orden adecuado de finalización del complemento durante el cierre del entorno para evitar el uso después de la liberación en la devolución de llamada `napi_finalize`, los complementos deben registrar un gancho de limpieza con `napi_add_env_cleanup_hook` y `napi_add_async_cleanup_hook` para liberar manualmente el recurso asignado en un orden adecuado.

## Registro de módulos {#module-registration}

Los módulos Node-API se registran de manera similar a otros módulos, excepto que en lugar de usar la macro `NODE_MODULE` se usa lo siguiente:

```C [C]
NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)
```
La siguiente diferencia es la firma del método `Init`. Para un módulo Node-API, es la siguiente:

```C [C]
napi_value Init(napi_env env, napi_value exports);
```
El valor de retorno de `Init` se trata como el objeto `exports` para el módulo. El método `Init` recibe un objeto vacío a través del parámetro `exports` como una conveniencia. Si `Init` devuelve `NULL`, el parámetro pasado como `exports` es exportado por el módulo. Los módulos Node-API no pueden modificar el objeto `module`, pero pueden especificar cualquier cosa como la propiedad `exports` del módulo.

Para agregar el método `hello` como una función para que pueda llamarse como un método proporcionado por el complemento:

```C [C]
napi_value Init(napi_env env, napi_value exports) {
  napi_status status;
  napi_property_descriptor desc = {
    "hello",
    NULL,
    Method,
    NULL,
    NULL,
    NULL,
    napi_writable | napi_enumerable | napi_configurable,
    NULL
  };
  status = napi_define_properties(env, exports, 1, &desc);
  if (status != napi_ok) return NULL;
  return exports;
}
```
Para establecer una función que será devuelta por el `require()` para el complemento:

```C [C]
napi_value Init(napi_env env, napi_value exports) {
  napi_value method;
  napi_status status;
  status = napi_create_function(env, "exports", NAPI_AUTO_LENGTH, Method, NULL, &method);
  if (status != napi_ok) return NULL;
  return method;
}
```
Para definir una clase para que se puedan crear nuevas instancias (a menudo se usa con [Envoltura de objeto](/es/nodejs/api/n-api#object-wrap)):

```C [C]
// NOTA: ejemplo parcial, no se incluye todo el código referenciado
napi_value Init(napi_env env, napi_value exports) {
  napi_status status;
  napi_property_descriptor properties[] = {
    { "value", NULL, NULL, GetValue, SetValue, NULL, napi_writable | napi_configurable, NULL },
    DECLARE_NAPI_METHOD("plusOne", PlusOne),
    DECLARE_NAPI_METHOD("multiply", Multiply),
  };

  napi_value cons;
  status =
      napi_define_class(env, "MyObject", New, NULL, 3, properties, &cons);
  if (status != napi_ok) return NULL;

  status = napi_create_reference(env, cons, 1, &constructor);
  if (status != napi_ok) return NULL;

  status = napi_set_named_property(env, exports, "MyObject", cons);
  if (status != napi_ok) return NULL;

  return exports;
}
```
También puede usar la macro `NAPI_MODULE_INIT`, que actúa como una abreviatura de `NAPI_MODULE` y la definición de una función `Init`:

```C [C]
NAPI_MODULE_INIT(/* napi_env env, napi_value exports */) {
  napi_value answer;
  napi_status result;

  status = napi_create_int64(env, 42, &answer);
  if (status != napi_ok) return NULL;

  status = napi_set_named_property(env, exports, "answer", answer);
  if (status != napi_ok) return NULL;

  return exports;
}
```
Los parámetros `env` y `exports` se proporcionan al cuerpo de la macro `NAPI_MODULE_INIT`.

Todos los complementos Node-API son compatibles con el contexto, lo que significa que pueden cargarse varias veces. Hay algunas consideraciones de diseño al declarar un módulo de este tipo. La documentación sobre [complementos compatibles con el contexto](/es/nodejs/api/addons#context-aware-addons) proporciona más detalles.

Las variables `env` y `exports` estarán disponibles dentro del cuerpo de la función después de la invocación de la macro.

Para obtener más detalles sobre cómo establecer propiedades en objetos, consulte la sección sobre [Trabajar con propiedades de JavaScript](/es/nodejs/api/n-api#working-with-javascript-properties).

Para obtener más detalles sobre la creación de módulos de complementos en general, consulte la API existente.


## Trabajando con valores de JavaScript {#working-with-javascript-values}

Node-API expone un conjunto de APIs para crear todos los tipos de valores de JavaScript. Algunos de estos tipos están documentados en la [Sección 6](https://tc39.github.io/ecma262/#sec-ecmascript-data-types-and-values) de la [Especificación del Lenguaje ECMAScript](https://tc39.github.io/ecma262/).

Fundamentalmente, estas APIs se utilizan para hacer una de las siguientes cosas:

Los valores de Node-API están representados por el tipo `napi_value`. Cualquier llamada a Node-API que requiera un valor de JavaScript toma un `napi_value`. En algunos casos, la API comprueba el tipo del `napi_value` por adelantado. Sin embargo, para un mejor rendimiento, es mejor que el llamador se asegure de que el `napi_value` en cuestión es del tipo de JavaScript esperado por la API.

### Tipos Enum {#enum-types}

#### `napi_key_collection_mode` {#napi_key_collection_mode}

**Añadido en: v13.7.0, v12.17.0, v10.20.0**

**Versión N-API: 6**

```C [C]
typedef enum {
  napi_key_include_prototypes,
  napi_key_own_only
} napi_key_collection_mode;
```
Describe los enums de filtro `Keys/Properties`:

`napi_key_collection_mode` limita el rango de las propiedades recolectadas.

`napi_key_own_only` limita las propiedades recolectadas solo al objeto dado. `napi_key_include_prototypes` incluirá todas las claves de la cadena de prototipos del objeto también.

#### `napi_key_filter` {#napi_key_filter}

**Añadido en: v13.7.0, v12.17.0, v10.20.0**

**Versión N-API: 6**

```C [C]
typedef enum {
  napi_key_all_properties = 0,
  napi_key_writable = 1,
  napi_key_enumerable = 1 << 1,
  napi_key_configurable = 1 << 2,
  napi_key_skip_strings = 1 << 3,
  napi_key_skip_symbols = 1 << 4
} napi_key_filter;
```
Bits de filtro de propiedad. Pueden combinarse con un OR para construir un filtro compuesto.

#### `napi_key_conversion` {#napi_key_conversion}

**Añadido en: v13.7.0, v12.17.0, v10.20.0**

**Versión N-API: 6**

```C [C]
typedef enum {
  napi_key_keep_numbers,
  napi_key_numbers_to_strings
} napi_key_conversion;
```
`napi_key_numbers_to_strings` convertirá los índices enteros a cadenas. `napi_key_keep_numbers` devolverá números para los índices enteros.

#### `napi_valuetype` {#napi_valuetype}

```C [C]
typedef enum {
  // Tipos ES6 (corresponde a typeof)
  napi_undefined,
  napi_null,
  napi_boolean,
  napi_number,
  napi_string,
  napi_symbol,
  napi_object,
  napi_function,
  napi_external,
  napi_bigint,
} napi_valuetype;
```
Describe el tipo de un `napi_value`. Esto generalmente corresponde a los tipos descritos en la [Sección 6.1](https://tc39.github.io/ecma262/#sec-ecmascript-language-types) de la Especificación del Lenguaje ECMAScript. Además de los tipos en esa sección, `napi_valuetype` también puede representar `Function`s y `Object`s con datos externos.

Un valor de JavaScript de tipo `napi_external` aparece en JavaScript como un objeto simple de tal manera que no se pueden establecer propiedades en él, y no tiene prototipo.


#### `napi_typedarray_type` {#napi_typedarray_type}

```C [C]
typedef enum {
  napi_int8_array,
  napi_uint8_array,
  napi_uint8_clamped_array,
  napi_int16_array,
  napi_uint16_array,
  napi_int32_array,
  napi_uint32_array,
  napi_float32_array,
  napi_float64_array,
  napi_bigint64_array,
  napi_biguint64_array,
} napi_typedarray_type;
```
Esto representa el tipo de datos escalar binario subyacente del `TypedArray`. Los elementos de esta enumeración corresponden a la [Sección 22.2](https://tc39.github.io/ecma262/#sec-typedarray-objects) de la [Especificación del Lenguaje ECMAScript](https://tc39.github.io/ecma262/).

### Funciones de creación de objetos {#object-creation-functions}

#### `napi_create_array` {#napi_create_array}

**Agregado en: v8.0.0**

**Versión N-API: 1**

```C [C]
napi_status napi_create_array(napi_env env, napi_value* result)
```
- `[in] env`: El entorno bajo el cual se invoca la llamada Node-API.
- `[out] result`: Un `napi_value` que representa un `Array` de JavaScript.

Devuelve `napi_ok` si la API tuvo éxito.

Esta API devuelve un valor Node-API correspondiente a un tipo `Array` de JavaScript. Los arreglos de JavaScript se describen en la [Sección 22.1](https://tc39.github.io/ecma262/#sec-array-objects) de la Especificación del Lenguaje ECMAScript.

#### `napi_create_array_with_length` {#napi_create_array_with_length}

**Agregado en: v8.0.0**

**Versión N-API: 1**

```C [C]
napi_status napi_create_array_with_length(napi_env env,
                                          size_t length,
                                          napi_value* result)
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] length`: La longitud inicial del `Array`.
- `[out] result`: Un `napi_value` que representa un `Array` de JavaScript.

Devuelve `napi_ok` si la API tuvo éxito.

Esta API devuelve un valor Node-API correspondiente a un tipo `Array` de JavaScript. La propiedad length del `Array` se establece al parámetro length pasado. Sin embargo, no se garantiza que la VM preasigne el búfer subyacente cuando se crea el arreglo. Ese comportamiento se deja a la implementación de la VM subyacente. Si el búfer debe ser un bloque contiguo de memoria que se puede leer y/o escribir directamente a través de C, considere usar [`napi_create_external_arraybuffer`](/es/nodejs/api/n-api#napi_create_external_arraybuffer).

Los arreglos de JavaScript se describen en la [Sección 22.1](https://tc39.github.io/ecma262/#sec-array-objects) de la Especificación del Lenguaje ECMAScript.


#### `napi_create_arraybuffer` {#napi_create_arraybuffer}

**Agregado en: v8.0.0**

**Versión N-API: 1**

```C [C]
napi_status napi_create_arraybuffer(napi_env env,
                                    size_t byte_length,
                                    void** data,
                                    napi_value* result)
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] length`: La longitud en bytes del búfer de matriz a crear.
- `[out] data`: Puntero al búfer de bytes subyacente del `ArrayBuffer`. `data` puede ignorarse opcionalmente pasando `NULL`.
- `[out] result`: Un `napi_value` que representa un `ArrayBuffer` de JavaScript.

Devuelve `napi_ok` si la API se ejecutó correctamente.

Esta API devuelve un valor de Node-API correspondiente a un `ArrayBuffer` de JavaScript. Los `ArrayBuffer` se utilizan para representar búferes de datos binarios de longitud fija. Normalmente se utilizan como un búfer de respaldo para objetos `TypedArray`. El `ArrayBuffer` asignado tendrá un búfer de bytes subyacente cuyo tamaño está determinado por el parámetro `length` que se pasa. El búfer subyacente se devuelve opcionalmente a la persona que llama en caso de que la persona que llama quiera manipular directamente el búfer. Solo se puede escribir en este búfer directamente desde código nativo. Para escribir en este búfer desde JavaScript, se debería crear un array tipado o un objeto `DataView`.

Los objetos `ArrayBuffer` de JavaScript se describen en la [Sección 24.1](https://tc39.github.io/ecma262/#sec-arraybuffer-objects) de la Especificación del lenguaje ECMAScript.

#### `napi_create_buffer` {#napi_create_buffer}

**Agregado en: v8.0.0**

**Versión N-API: 1**

```C [C]
napi_status napi_create_buffer(napi_env env,
                               size_t size,
                               void** data,
                               napi_value* result)
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] size`: Tamaño en bytes del búfer subyacente.
- `[out] data`: Puntero sin procesar al búfer subyacente. `data` puede ignorarse opcionalmente pasando `NULL`.
- `[out] result`: Un `napi_value` que representa un `node::Buffer`.

Devuelve `napi_ok` si la API se ejecutó correctamente.

Esta API asigna un objeto `node::Buffer`. Si bien esta sigue siendo una estructura de datos totalmente compatible, en la mayoría de los casos será suficiente con usar un `TypedArray`.


#### `napi_create_buffer_copy` {#napi_create_buffer_copy}

**Agregado en: v8.0.0**

**Versión de N-API: 1**

```C [C]
napi_status napi_create_buffer_copy(napi_env env,
                                    size_t length,
                                    const void* data,
                                    void** result_data,
                                    napi_value* result)
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] size`: Tamaño en bytes del búfer de entrada (debe ser el mismo que el tamaño del nuevo búfer).
- `[in] data`: Puntero bruto al búfer subyacente desde el que se va a copiar.
- `[out] result_data`: Puntero al búfer de datos subyacente del nuevo `Buffer`. `result_data` puede omitirse opcionalmente pasando `NULL`.
- `[out] result`: Un `napi_value` que representa un `node::Buffer`.

Devuelve `napi_ok` si la API se ejecutó correctamente.

Esta API asigna un objeto `node::Buffer` y lo inicializa con datos copiados desde el búfer pasado. Si bien esta sigue siendo una estructura de datos totalmente compatible, en la mayoría de los casos, el uso de `TypedArray` será suficiente.

#### `napi_create_date` {#napi_create_date}

**Agregado en: v11.11.0, v10.17.0**

**Versión de N-API: 5**

```C [C]
napi_status napi_create_date(napi_env env,
                             double time,
                             napi_value* result);
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] time`: Valor de tiempo ECMAScript en milisegundos desde el 01 de enero de 1970 UTC.
- `[out] result`: Un `napi_value` que representa un `Date` de JavaScript.

Devuelve `napi_ok` si la API se ejecutó correctamente.

Esta API no observa los segundos intercalares; se ignoran, ya que ECMAScript se alinea con la especificación de tiempo POSIX.

Esta API asigna un objeto `Date` de JavaScript.

Los objetos `Date` de JavaScript se describen en la [Sección 20.3](https://tc39.github.io/ecma262/#sec-date-objects) de la Especificación del Lenguaje ECMAScript.

#### `napi_create_external` {#napi_create_external}

**Agregado en: v8.0.0**

**Versión de N-API: 1**

```C [C]
napi_status napi_create_external(napi_env env,
                                 void* data,
                                 napi_finalize finalize_cb,
                                 void* finalize_hint,
                                 napi_value* result)
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] data`: Puntero bruto a los datos externos.
- `[in] finalize_cb`: Callback opcional para llamar cuando se recolecta el valor externo. [`napi_finalize`](/es/nodejs/api/n-api#napi_finalize) proporciona más detalles.
- `[in] finalize_hint`: Sugerencia opcional para pasar al callback de finalización durante la recolección.
- `[out] result`: Un `napi_value` que representa un valor externo.

Devuelve `napi_ok` si la API se ejecutó correctamente.

Esta API asigna un valor de JavaScript con datos externos adjuntos. Esto se utiliza para pasar datos externos a través del código JavaScript, de modo que el código nativo pueda recuperarlos más tarde utilizando [`napi_get_value_external`](/es/nodejs/api/n-api#napi_get_value_external).

La API agrega un callback `napi_finalize` que se llamará cuando el objeto JavaScript recién creado se haya recolectado como basura.

El valor creado no es un objeto y, por lo tanto, no admite propiedades adicionales. Se considera un tipo de valor distinto: llamar a `napi_typeof()` con un valor externo produce `napi_external`.


#### `napi_create_external_arraybuffer` {#napi_create_external_arraybuffer}

**Agregado en: v8.0.0**

**Versión N-API: 1**

```C [C]
napi_status
napi_create_external_arraybuffer(napi_env env,
                                 void* external_data,
                                 size_t byte_length,
                                 napi_finalize finalize_cb,
                                 void* finalize_hint,
                                 napi_value* result)
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] external_data`: Puntero al búfer de bytes subyacente del `ArrayBuffer`.
- `[in] byte_length`: La longitud en bytes del búfer subyacente.
- `[in] finalize_cb`: Callback opcional que se llamará cuando se recolecte el `ArrayBuffer`. [`napi_finalize`](/es/nodejs/api/n-api#napi_finalize) proporciona más detalles.
- `[in] finalize_hint`: Sugerencia opcional para pasar al callback finalize durante la recolección.
- `[out] result`: Un `napi_value` que representa un `ArrayBuffer` de JavaScript.

Devuelve `napi_ok` si la API se realizó correctamente.

**Algunos runtimes distintos de Node.js han dejado de admitir buffers externos**. En runtimes distintos de Node.js, este método puede devolver `napi_no_external_buffers_allowed` para indicar que no se admiten los buffers externos. Un runtime de este tipo es Electron, como se describe en este problema [electron/issues/35801](https://github.com/electron/electron/issues/35801).

Para mantener la compatibilidad más amplia con todos los runtimes, puede definir `NODE_API_NO_EXTERNAL_BUFFERS_ALLOWED` en su complemento antes de las inclusiones de los encabezados de la API de nodo. Hacerlo ocultará las 2 funciones que crean buffers externos. Esto asegurará que ocurra un error de compilación si usa accidentalmente uno de estos métodos.

Esta API devuelve un valor de Node-API correspondiente a un `ArrayBuffer` de JavaScript. El búfer de bytes subyacente del `ArrayBuffer` se asigna y gestiona externamente. La persona que llama debe asegurarse de que el búfer de bytes siga siendo válido hasta que se llame al callback de finalización.

La API agrega un callback `napi_finalize` que se llamará cuando el objeto JavaScript recién creado haya sido recolectado por el recolector de basura.

Los `ArrayBuffer` de JavaScript se describen en la [Sección 24.1](https://tc39.github.io/ecma262/#sec-arraybuffer-objects) de la Especificación del Lenguaje ECMAScript.


#### `napi_create_external_buffer` {#napi_create_external_buffer}

**Añadido en: v8.0.0**

**Versión de N-API: 1**

```C [C]
napi_status napi_create_external_buffer(napi_env env,
                                        size_t length,
                                        void* data,
                                        napi_finalize finalize_cb,
                                        void* finalize_hint,
                                        napi_value* result)
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] length`: Tamaño en bytes del búfer de entrada (debe ser el mismo que el tamaño del nuevo búfer).
- `[in] data`: Puntero en bruto al búfer subyacente para exponer a JavaScript.
- `[in] finalize_cb`: Retrollamada opcional a llamar cuando se está recolectando el `ArrayBuffer`. [`napi_finalize`](/es/nodejs/api/n-api#napi_finalize) proporciona más detalles.
- `[in] finalize_hint`: Sugerencia opcional para pasar a la retrollamada de finalización durante la recolección.
- `[out] result`: Un `napi_value` que representa un `node::Buffer`.

Devuelve `napi_ok` si la API tuvo éxito.

**Algunos tiempos de ejecución distintos de Node.js han eliminado la compatibilidad con los búferes externos**. En tiempos de ejecución distintos de Node.js, este método puede devolver `napi_no_external_buffers_allowed` para indicar que no se admiten los búferes externos. Un tiempo de ejecución de este tipo es Electron, como se describe en este problema [electron/issues/35801](https://github.com/electron/electron/issues/35801).

Para mantener la compatibilidad más amplia con todos los tiempos de ejecución, puede definir `NODE_API_NO_EXTERNAL_BUFFERS_ALLOWED` en su complemento antes de las inclusiones para los encabezados de node-api. Hacerlo ocultará las 2 funciones que crean búferes externos. Esto asegurará que se produzca un error de compilación si utiliza accidentalmente uno de estos métodos.

Esta API asigna un objeto `node::Buffer` y lo inicializa con datos respaldados por el búfer pasado. Si bien esta sigue siendo una estructura de datos totalmente compatible, en la mayoría de los casos será suficiente con usar un `TypedArray`.

La API agrega una retrollamada `napi_finalize` que se llamará cuando el objeto JavaScript que acaba de crearse haya sido recolectado como basura.

Para Node.js \>=4, los `Buffers` son `Uint8Array`s.


#### `napi_create_object` {#napi_create_object}

**Agregado en: v8.0.0**

**Versión de N-API: 1**

```C [C]
napi_status napi_create_object(napi_env env, napi_value* result)
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[out] result`: Un `napi_value` que representa un `Object` de JavaScript.

Devuelve `napi_ok` si la API tuvo éxito.

Esta API asigna un `Object` de JavaScript predeterminado. Es el equivalente a hacer `new Object()` en JavaScript.

El tipo `Object` de JavaScript se describe en la [Sección 6.1.7](https://tc39.github.io/ecma262/#sec-object-type) de la Especificación del Lenguaje ECMAScript.

#### `napi_create_symbol` {#napi_create_symbol}

**Agregado en: v8.0.0**

**Versión de N-API: 1**

```C [C]
napi_status napi_create_symbol(napi_env env,
                               napi_value description,
                               napi_value* result)
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] description`: `napi_value` opcional que se refiere a una `string` de JavaScript que se establecerá como la descripción del símbolo.
- `[out] result`: Un `napi_value` que representa un `symbol` de JavaScript.

Devuelve `napi_ok` si la API tuvo éxito.

Esta API crea un valor `symbol` de JavaScript a partir de una string C codificada en UTF8.

El tipo `symbol` de JavaScript se describe en la [Sección 19.4](https://tc39.github.io/ecma262/#sec-symbol-objects) de la Especificación del Lenguaje ECMAScript.

#### `node_api_symbol_for` {#node_api_symbol_for}

**Agregado en: v17.5.0, v16.15.0**

**Versión de N-API: 9**

```C [C]
napi_status node_api_symbol_for(napi_env env,
                                const char* utf8description,
                                size_t length,
                                napi_value* result)
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] utf8description`: String C UTF-8 que representa el texto que se utilizará como la descripción del símbolo.
- `[in] length`: La longitud de la string de descripción en bytes, o `NAPI_AUTO_LENGTH` si está terminada en nulo.
- `[out] result`: Un `napi_value` que representa un `symbol` de JavaScript.

Devuelve `napi_ok` si la API tuvo éxito.

Esta API busca en el registro global un símbolo existente con la descripción dada. Si el símbolo ya existe, se devolverá; de lo contrario, se creará un nuevo símbolo en el registro.

El tipo `symbol` de JavaScript se describe en la [Sección 19.4](https://tc39.github.io/ecma262/#sec-symbol-objects) de la Especificación del Lenguaje ECMAScript.


#### `napi_create_typedarray` {#napi_create_typedarray}

**Agregado en: v8.0.0**

**Versión N-API: 1**

```C [C]
napi_status napi_create_typedarray(napi_env env,
                                   napi_typedarray_type type,
                                   size_t length,
                                   napi_value arraybuffer,
                                   size_t byte_offset,
                                   napi_value* result)
```
- `[in] env`: El entorno bajo el que se invoca la API.
- `[in] type`: Tipo de datos escalar de los elementos dentro del `TypedArray`.
- `[in] length`: Número de elementos en el `TypedArray`.
- `[in] arraybuffer`: `ArrayBuffer` subyacente al typed array.
- `[in] byte_offset`: El desplazamiento de bytes dentro del `ArrayBuffer` desde el que comenzar a proyectar el `TypedArray`.
- `[out] result`: Un `napi_value` que representa un `TypedArray` de JavaScript.

Devuelve `napi_ok` si la API tuvo éxito.

Esta API crea un objeto `TypedArray` de JavaScript sobre un `ArrayBuffer` existente. Los objetos `TypedArray` proporcionan una vista similar a una matriz sobre un búfer de datos subyacente donde cada elemento tiene el mismo tipo de datos escalar binario subyacente.

Es necesario que `(length * size_of_element) + byte_offset` sea \<= el tamaño en bytes del array pasado. Si no, se lanza una excepción `RangeError`.

Los objetos `TypedArray` de JavaScript se describen en la [Sección 22.2](https://tc39.github.io/ecma262/#sec-typedarray-objects) de la Especificación del Lenguaje ECMAScript.

#### `node_api_create_buffer_from_arraybuffer` {#node_api_create_buffer_from_arraybuffer}

**Agregado en: v23.0.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

```C [C]
napi_status NAPI_CDECL node_api_create_buffer_from_arraybuffer(napi_env env,
                                                              napi_value arraybuffer,
                                                              size_t byte_offset,
                                                              size_t byte_length,
                                                              napi_value* result)
```
- **<code>[in] env</code>**: El entorno bajo el que se invoca la API.
- **<code>[in] arraybuffer</code>**: El `ArrayBuffer` desde el que se creará el búfer.
- **<code>[in] byte_offset</code>**: El desplazamiento de bytes dentro del `ArrayBuffer` desde el que comenzar a crear el búfer.
- **<code>[in] byte_length</code>**: La longitud en bytes del búfer que se creará a partir del `ArrayBuffer`.
- **<code>[out] result</code>**: Un `napi_value` que representa el objeto `Buffer` de JavaScript creado.

Devuelve `napi_ok` si la API tuvo éxito.

Esta API crea un objeto `Buffer` de JavaScript a partir de un `ArrayBuffer` existente. El objeto `Buffer` es una clase específica de Node.js que proporciona una forma de trabajar con datos binarios directamente en JavaScript.

El rango de bytes `[byte_offset, byte_offset + byte_length)` debe estar dentro de los límites del `ArrayBuffer`. Si `byte_offset + byte_length` excede el tamaño del `ArrayBuffer`, se lanza una excepción `RangeError`.


#### `napi_create_dataview` {#napi_create_dataview}

**Agregado en: v8.3.0**

**Versión N-API: 1**

```C [C]
napi_status napi_create_dataview(napi_env env,
                                 size_t byte_length,
                                 napi_value arraybuffer,
                                 size_t byte_offset,
                                 napi_value* result)
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] length`: Número de elementos en el `DataView`.
- `[in] arraybuffer`: `ArrayBuffer` subyacente al `DataView`.
- `[in] byte_offset`: El desplazamiento de bytes dentro del `ArrayBuffer` desde el cual comenzar a proyectar el `DataView`.
- `[out] result`: Un `napi_value` que representa un `DataView` de JavaScript.

Devuelve `napi_ok` si la API se ejecutó correctamente.

Esta API crea un objeto `DataView` de JavaScript sobre un `ArrayBuffer` existente. Los objetos `DataView` proporcionan una vista similar a una matriz sobre un búfer de datos subyacente, pero uno que permite elementos de diferente tamaño y tipo en el `ArrayBuffer`.

Es necesario que `byte_length + byte_offset` sea menor o igual que el tamaño en bytes de la matriz pasada. Si no, se genera una excepción `RangeError`.

Los objetos `DataView` de JavaScript se describen en la [Sección 24.3](https://tc39.github.io/ecma262/#sec-dataview-objects) de la Especificación del Lenguaje ECMAScript.

### Funciones para convertir de tipos C a Node-API {#functions-to-convert-from-c-types-to-node-api}

#### `napi_create_int32` {#napi_create_int32}

**Agregado en: v8.4.0**

**Versión N-API: 1**

```C [C]
napi_status napi_create_int32(napi_env env, int32_t value, napi_value* result)
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] value`: Valor entero que se representará en JavaScript.
- `[out] result`: Un `napi_value` que representa un `number` de JavaScript.

Devuelve `napi_ok` si la API se ejecutó correctamente.

Esta API se utiliza para convertir del tipo C `int32_t` al tipo `number` de JavaScript.

El tipo `number` de JavaScript se describe en la [Sección 6.1.6](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-number-type) de la Especificación del Lenguaje ECMAScript.


#### `napi_create_uint32` {#napi_create_uint32}

**Añadido en: v8.4.0**

**Versión de N-API: 1**

```C [C]
napi_status napi_create_uint32(napi_env env, uint32_t value, napi_value* result)
```
- `[in] env`: El entorno bajo el que se invoca la API.
- `[in] value`: Valor entero sin signo que se representará en JavaScript.
- `[out] result`: Un `napi_value` que representa un `number` de JavaScript.

Devuelve `napi_ok` si la API se ejecutó correctamente.

Esta API se utiliza para convertir del tipo `uint32_t` de C al tipo `number` de JavaScript.

El tipo `number` de JavaScript se describe en la [Sección 6.1.6](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-number-type) de la Especificación del lenguaje ECMAScript.

#### `napi_create_int64` {#napi_create_int64}

**Añadido en: v8.4.0**

**Versión de N-API: 1**

```C [C]
napi_status napi_create_int64(napi_env env, int64_t value, napi_value* result)
```
- `[in] env`: El entorno bajo el que se invoca la API.
- `[in] value`: Valor entero que se representará en JavaScript.
- `[out] result`: Un `napi_value` que representa un `number` de JavaScript.

Devuelve `napi_ok` si la API se ejecutó correctamente.

Esta API se utiliza para convertir del tipo `int64_t` de C al tipo `number` de JavaScript.

El tipo `number` de JavaScript se describe en la [Sección 6.1.6](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-number-type) de la Especificación del lenguaje ECMAScript. Tenga en cuenta que el rango completo de `int64_t` no se puede representar con total precisión en JavaScript. Los valores enteros fuera del rango de [`Number.MIN_SAFE_INTEGER`](https://tc39.github.io/ecma262/#sec-number.min_safe_integer) `-(2**53 - 1)` - [`Number.MAX_SAFE_INTEGER`](https://tc39.github.io/ecma262/#sec-number.max_safe_integer) `(2**53 - 1)` perderán precisión.

#### `napi_create_double` {#napi_create_double}

**Añadido en: v8.4.0**

**Versión de N-API: 1**

```C [C]
napi_status napi_create_double(napi_env env, double value, napi_value* result)
```
- `[in] env`: El entorno bajo el que se invoca la API.
- `[in] value`: Valor de doble precisión que se representará en JavaScript.
- `[out] result`: Un `napi_value` que representa un `number` de JavaScript.

Devuelve `napi_ok` si la API se ejecutó correctamente.

Esta API se utiliza para convertir del tipo `double` de C al tipo `number` de JavaScript.

El tipo `number` de JavaScript se describe en la [Sección 6.1.6](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-number-type) de la Especificación del lenguaje ECMAScript.


#### `napi_create_bigint_int64` {#napi_create_bigint_int64}

**Añadido en: v10.7.0**

**Versión de N-API: 6**

```C [C]
napi_status napi_create_bigint_int64(napi_env env,
                                     int64_t value,
                                     napi_value* result);
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] value`: Valor entero que se representará en JavaScript.
- `[out] result`: Un `napi_value` que representa un `BigInt` de JavaScript.

Devuelve `napi_ok` si la API se ejecutó correctamente.

Esta API convierte el tipo C `int64_t` al tipo `BigInt` de JavaScript.

#### `napi_create_bigint_uint64` {#napi_create_bigint_uint64}

**Añadido en: v10.7.0**

**Versión de N-API: 6**

```C [C]
napi_status napi_create_bigint_uint64(napi_env env,
                                      uint64_t value,
                                      napi_value* result);
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] value`: Valor entero sin signo que se representará en JavaScript.
- `[out] result`: Un `napi_value` que representa un `BigInt` de JavaScript.

Devuelve `napi_ok` si la API se ejecutó correctamente.

Esta API convierte el tipo C `uint64_t` al tipo `BigInt` de JavaScript.

#### `napi_create_bigint_words` {#napi_create_bigint_words}

**Añadido en: v10.7.0**

**Versión de N-API: 6**

```C [C]
napi_status napi_create_bigint_words(napi_env env,
                                     int sign_bit,
                                     size_t word_count,
                                     const uint64_t* words,
                                     napi_value* result);
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] sign_bit`: Determina si el `BigInt` resultante será positivo o negativo.
- `[in] word_count`: La longitud de la matriz `words`.
- `[in] words`: Una matriz de palabras de 64 bits little-endian `uint64_t`.
- `[out] result`: Un `napi_value` que representa un `BigInt` de JavaScript.

Devuelve `napi_ok` si la API se ejecutó correctamente.

Esta API convierte una matriz de palabras sin signo de 64 bits en un único valor `BigInt`.

El `BigInt` resultante se calcula como: (–1) (`words[0]` × (2) + `words[1]` × (2) + …)


#### `napi_create_string_latin1` {#napi_create_string_latin1}

**Añadido en: v8.0.0**

**Versión N-API: 1**

```C [C]
napi_status napi_create_string_latin1(napi_env env,
                                      const char* str,
                                      size_t length,
                                      napi_value* result);
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] str`: Búfer de caracteres que representa una cadena codificada en ISO-8859-1.
- `[in] length`: La longitud de la cadena en bytes, o `NAPI_AUTO_LENGTH` si está terminada en nulo.
- `[out] result`: Un `napi_value` que representa una `string` de JavaScript.

Devuelve `napi_ok` si la API tuvo éxito.

Esta API crea un valor `string` de JavaScript a partir de una cadena C codificada en ISO-8859-1. La cadena nativa se copia.

El tipo `string` de JavaScript se describe en la [Sección 6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type) de la Especificación del Lenguaje ECMAScript.

#### `node_api_create_external_string_latin1` {#node_api_create_external_string_latin1}

**Añadido en: v20.4.0, v18.18.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

```C [C]
napi_status
node_api_create_external_string_latin1(napi_env env,
                                       char* str,
                                       size_t length,
                                       napi_finalize finalize_callback,
                                       void* finalize_hint,
                                       napi_value* result,
                                       bool* copied);
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] str`: Búfer de caracteres que representa una cadena codificada en ISO-8859-1.
- `[in] length`: La longitud de la cadena en bytes, o `NAPI_AUTO_LENGTH` si está terminada en nulo.
- `[in] finalize_callback`: La función que se llamará cuando se esté recolectando la cadena. La función se llamará con los siguientes parámetros:
    - `[in] env`: El entorno en el que se está ejecutando el complemento. Este valor puede ser nulo si la cadena se está recolectando como parte de la terminación del worker o la instancia principal de Node.js.
    - `[in] data`: Este es el valor `str` como un puntero `void*`.
    - `[in] finalize_hint`: Este es el valor `finalize_hint` que se proporcionó a la API. [`napi_finalize`](/es/nodejs/api/n-api#napi_finalize) proporciona más detalles. Este parámetro es opcional. Pasar un valor nulo significa que el complemento no necesita ser notificado cuando se recolecta la cadena JavaScript correspondiente.

- `[in] finalize_hint`: Sugerencia opcional para pasar a la devolución de llamada finalize durante la recolección.
- `[out] result`: Un `napi_value` que representa una `string` de JavaScript.
- `[out] copied`: Indica si la cadena fue copiada. Si lo fue, el finalizador ya habrá sido invocado para destruir `str`.

Devuelve `napi_ok` si la API tuvo éxito.

Esta API crea un valor `string` de JavaScript a partir de una cadena C codificada en ISO-8859-1. Es posible que la cadena nativa no se copie y, por lo tanto, debe existir durante todo el ciclo de vida del valor de JavaScript.

El tipo `string` de JavaScript se describe en la [Sección 6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type) de la Especificación del Lenguaje ECMAScript.


#### `napi_create_string_utf16` {#napi_create_string_utf16}

**Agregado en: v8.0.0**

**Versión N-API: 1**

```C [C]
napi_status napi_create_string_utf16(napi_env env,
                                     const char16_t* str,
                                     size_t length,
                                     napi_value* result)
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] str`: Búfer de caracteres que representa una cadena codificada en UTF16-LE.
- `[in] length`: La longitud de la cadena en unidades de código de dos bytes, o `NAPI_AUTO_LENGTH` si termina en nulo.
- `[out] result`: Un `napi_value` que representa una `string` de JavaScript.

Devuelve `napi_ok` si la API tuvo éxito.

Esta API crea un valor `string` de JavaScript a partir de una cadena C codificada en UTF16-LE. La cadena nativa se copia.

El tipo `string` de JavaScript se describe en [Sección 6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type) de la Especificación del Lenguaje ECMAScript.

#### `node_api_create_external_string_utf16` {#node_api_create_external_string_utf16}

**Agregado en: v20.4.0, v18.18.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

```C [C]
napi_status
node_api_create_external_string_utf16(napi_env env,
                                      char16_t* str,
                                      size_t length,
                                      napi_finalize finalize_callback,
                                      void* finalize_hint,
                                      napi_value* result,
                                      bool* copied);
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] str`: Búfer de caracteres que representa una cadena codificada en UTF16-LE.
- `[in] length`: La longitud de la cadena en unidades de código de dos bytes, o `NAPI_AUTO_LENGTH` si termina en nulo.
- `[in] finalize_callback`: La función que se llamará cuando se recoja la cadena. La función se llamará con los siguientes parámetros:
    - `[in] env`: El entorno en el que se está ejecutando el complemento. Este valor puede ser nulo si la cadena se está recolectando como parte de la terminación del trabajador o de la instancia principal de Node.js.
    - `[in] data`: Este es el valor `str` como un puntero `void*`.
    - `[in] finalize_hint`: Esta es el valor `finalize_hint` que se le dio a la API. [`napi_finalize`](/es/nodejs/api/n-api#napi_finalize) proporciona más detalles. Este parámetro es opcional. Pasar un valor nulo significa que el complemento no necesita ser notificado cuando se recolecta la cadena de JavaScript correspondiente.

- `[in] finalize_hint`: Sugerencia opcional para pasar a la devolución de llamada de finalización durante la recolección.
- `[out] result`: Un `napi_value` que representa una `string` de JavaScript.
- `[out] copied`: Indica si se copió la cadena. Si lo fue, el finalizador ya habrá sido invocado para destruir `str`.

Devuelve `napi_ok` si la API tuvo éxito.

Esta API crea un valor `string` de JavaScript a partir de una cadena C codificada en UTF16-LE. Es posible que la cadena nativa no se copie y, por lo tanto, debe existir durante todo el ciclo de vida del valor de JavaScript.

El tipo `string` de JavaScript se describe en [Sección 6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type) de la Especificación del Lenguaje ECMAScript.


#### `napi_create_string_utf8` {#napi_create_string_utf8}

**Agregado en: v8.0.0**

**Versión N-API: 1**

```C [C]
napi_status napi_create_string_utf8(napi_env env,
                                    const char* str,
                                    size_t length,
                                    napi_value* result)
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] str`: Búfer de caracteres que representa una cadena codificada en UTF8.
- `[in] length`: La longitud de la cadena en bytes, o `NAPI_AUTO_LENGTH` si está terminada en nulo.
- `[out] result`: Un `napi_value` que representa una `string` de JavaScript.

Devuelve `napi_ok` si la API tuvo éxito.

Esta API crea un valor `string` de JavaScript a partir de una cadena C codificada en UTF8. La cadena nativa se copia.

El tipo `string` de JavaScript se describe en la [Sección 6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type) de la Especificación del lenguaje ECMAScript.

### Funciones para crear claves de propiedad optimizadas {#functions-to-create-optimized-property-keys}

Muchos motores de JavaScript, incluyendo V8, utilizan cadenas internalizadas como claves para establecer y obtener valores de propiedades. Normalmente utilizan una tabla hash para crear y buscar tales cadenas. Si bien añade algún coste por creación de clave, mejora el rendimiento después de eso al permitir la comparación de punteros de cadena en lugar de las cadenas completas.

Si una nueva cadena de JavaScript está destinada a ser utilizada como clave de propiedad, entonces para algunos motores de JavaScript será más eficiente utilizar las funciones de esta sección. De lo contrario, utilice las funciones de la serie `napi_create_string_utf8` o `node_api_create_external_string_utf8`, ya que puede haber una sobrecarga adicional en la creación/almacenamiento de cadenas con los métodos de creación de claves de propiedad.

#### `node_api_create_property_key_latin1` {#node_api_create_property_key_latin1}

**Agregado en: v22.9.0, v20.18.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

```C [C]
napi_status NAPI_CDECL node_api_create_property_key_latin1(napi_env env,
                                                           const char* str,
                                                           size_t length,
                                                           napi_value* result);
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] str`: Búfer de caracteres que representa una cadena codificada en ISO-8859-1.
- `[in] length`: La longitud de la cadena en bytes, o `NAPI_AUTO_LENGTH` si está terminada en nulo.
- `[out] result`: Un `napi_value` que representa una `string` de JavaScript optimizada para ser utilizada como clave de propiedad para objetos.

Devuelve `napi_ok` si la API tuvo éxito.

Esta API crea un valor `string` de JavaScript optimizado a partir de una cadena C codificada en ISO-8859-1 para ser utilizado como clave de propiedad para objetos. La cadena nativa se copia. En contraste con `napi_create_string_latin1`, las llamadas posteriores a esta función con el mismo puntero `str` pueden beneficiarse de una aceleración en la creación del `napi_value` solicitado, dependiendo del motor.

El tipo `string` de JavaScript se describe en la [Sección 6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type) de la Especificación del lenguaje ECMAScript.


#### `node_api_create_property_key_utf16` {#node_api_create_property_key_utf16}

**Agregado en: v21.7.0, v20.12.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

```C [C]
napi_status NAPI_CDECL node_api_create_property_key_utf16(napi_env env,
                                                          const char16_t* str,
                                                          size_t length,
                                                          napi_value* result);
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] str`: Búfer de caracteres que representa una cadena codificada en UTF16-LE.
- `[in] length`: La longitud de la cadena en unidades de código de dos bytes, o `NAPI_AUTO_LENGTH` si está terminada en nulo.
- `[out] result`: Un `napi_value` que representa una `string` optimizada de JavaScript para ser utilizada como una clave de propiedad para objetos.

Devuelve `napi_ok` si la API tuvo éxito.

Esta API crea un valor `string` optimizado de JavaScript a partir de una cadena C codificada en UTF16-LE para ser utilizada como una clave de propiedad para objetos. La cadena nativa se copia.

El tipo `string` de JavaScript se describe en la [Sección 6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type) de la Especificación del Lenguaje ECMAScript.

#### `node_api_create_property_key_utf8` {#node_api_create_property_key_utf8}

**Agregado en: v22.9.0, v20.18.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

```C [C]
napi_status NAPI_CDECL node_api_create_property_key_utf8(napi_env env,
                                                         const char* str,
                                                         size_t length,
                                                         napi_value* result);
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] str`: Búfer de caracteres que representa una cadena codificada en UTF8.
- `[in] length`: La longitud de la cadena en unidades de código de dos bytes, o `NAPI_AUTO_LENGTH` si está terminada en nulo.
- `[out] result`: Un `napi_value` que representa una `string` optimizada de JavaScript para ser utilizada como una clave de propiedad para objetos.

Devuelve `napi_ok` si la API tuvo éxito.

Esta API crea un valor `string` optimizado de JavaScript a partir de una cadena C codificada en UTF8 para ser utilizada como una clave de propiedad para objetos. La cadena nativa se copia.

El tipo `string` de JavaScript se describe en la [Sección 6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type) de la Especificación del Lenguaje ECMAScript.


### Funciones para convertir de Node-API a tipos C {#functions-to-convert-from-node-api-to-c-types}

#### `napi_get_array_length` {#napi_get_array_length}

**Agregado en: v8.0.0**

**Versión N-API: 1**

```C [C]
napi_status napi_get_array_length(napi_env env,
                                  napi_value value,
                                  uint32_t* result)
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] value`: `napi_value` que representa el `Array` de JavaScript cuya longitud se está consultando.
- `[out] result`: `uint32` que representa la longitud del array.

Devuelve `napi_ok` si la API tuvo éxito.

Esta API devuelve la longitud de un array.

La longitud de `Array` se describe en la [Sección 22.1.4.1](https://tc39.github.io/ecma262/#sec-properties-of-array-instances-length) de la Especificación del Lenguaje ECMAScript.

#### `napi_get_arraybuffer_info` {#napi_get_arraybuffer_info}

**Agregado en: v8.0.0**

**Versión N-API: 1**

```C [C]
napi_status napi_get_arraybuffer_info(napi_env env,
                                      napi_value arraybuffer,
                                      void** data,
                                      size_t* byte_length)
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] arraybuffer`: `napi_value` que representa el `ArrayBuffer` que se está consultando.
- `[out] data`: El búfer de datos subyacente del `ArrayBuffer`. Si byte_length es `0`, esto puede ser `NULL` o cualquier otro valor de puntero.
- `[out] byte_length`: Longitud en bytes del búfer de datos subyacente.

Devuelve `napi_ok` si la API tuvo éxito.

Esta API se utiliza para recuperar el búfer de datos subyacente de un `ArrayBuffer` y su longitud.

*ADVERTENCIA*: Tenga cuidado al usar esta API. La vida útil del búfer de datos subyacente la gestiona el `ArrayBuffer` incluso después de que se devuelve. Una posible forma segura de usar esta API es en conjunto con [`napi_create_reference`](/es/nodejs/api/n-api#napi_create_reference), que se puede usar para garantizar el control sobre la vida útil del `ArrayBuffer`. También es seguro usar el búfer de datos devuelto dentro de la misma devolución de llamada, siempre y cuando no haya llamadas a otras API que puedan desencadenar un GC.


#### `napi_get_buffer_info` {#napi_get_buffer_info}

**Agregado en: v8.0.0**

**Versión de N-API: 1**

```C [C]
napi_status napi_get_buffer_info(napi_env env,
                                 napi_value value,
                                 void** data,
                                 size_t* length)
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] value`: `napi_value` que representa el `node::Buffer` o `Uint8Array` que se está consultando.
- `[out] data`: El búfer de datos subyacente del `node::Buffer` o `Uint8Array`. Si la longitud es `0`, esto puede ser `NULL` o cualquier otro valor de puntero.
- `[out] length`: Longitud en bytes del búfer de datos subyacente.

Devuelve `napi_ok` si la API se realizó correctamente.

Este método devuelve los mismos `data` y `byte_length` que [`napi_get_typedarray_info`](/es/nodejs/api/n-api#napi_get_typedarray_info). Y `napi_get_typedarray_info` también acepta un `node::Buffer` (un Uint8Array) como valor.

Esta API se utiliza para recuperar el búfer de datos subyacente de un `node::Buffer` y su longitud.

*Advertencia*: Tenga cuidado al usar esta API, ya que la vida útil del búfer de datos subyacente no está garantizada si es administrado por la VM.

#### `napi_get_prototype` {#napi_get_prototype}

**Agregado en: v8.0.0**

**Versión de N-API: 1**

```C [C]
napi_status napi_get_prototype(napi_env env,
                               napi_value object,
                               napi_value* result)
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] object`: `napi_value` que representa el `Object` de JavaScript cuyo prototipo se va a devolver. Esto devuelve el equivalente de `Object.getPrototypeOf` (que no es lo mismo que la propiedad `prototype` de la función).
- `[out] result`: `napi_value` que representa el prototipo del objeto dado.

Devuelve `napi_ok` si la API se realizó correctamente.

#### `napi_get_typedarray_info` {#napi_get_typedarray_info}

**Agregado en: v8.0.0**

**Versión de N-API: 1**

```C [C]
napi_status napi_get_typedarray_info(napi_env env,
                                     napi_value typedarray,
                                     napi_typedarray_type* type,
                                     size_t* length,
                                     void** data,
                                     napi_value* arraybuffer,
                                     size_t* byte_offset)
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] typedarray`: `napi_value` que representa el `TypedArray` cuyas propiedades se van a consultar.
- `[out] type`: Tipo de datos escalar de los elementos dentro del `TypedArray`.
- `[out] length`: El número de elementos en el `TypedArray`.
- `[out] data`: El búfer de datos subyacente al `TypedArray` ajustado por el valor `byte_offset` para que apunte al primer elemento en el `TypedArray`. Si la longitud de la matriz es `0`, esto puede ser `NULL` o cualquier otro valor de puntero.
- `[out] arraybuffer`: El `ArrayBuffer` subyacente al `TypedArray`.
- `[out] byte_offset`: El desplazamiento de bytes dentro de la matriz nativa subyacente en el que se encuentra el primer elemento de las matrices. El valor para el parámetro de datos ya se ha ajustado para que los datos apunten al primer elemento de la matriz. Por lo tanto, el primer byte de la matriz nativa estaría en `data - byte_offset`.

Devuelve `napi_ok` si la API se realizó correctamente.

Esta API devuelve varias propiedades de una matriz tipada.

Cualquiera de los parámetros de salida puede ser `NULL` si esa propiedad no es necesaria.

*Advertencia*: Tenga cuidado al usar esta API, ya que el búfer de datos subyacente es administrado por la VM.


#### `napi_get_dataview_info` {#napi_get_dataview_info}

**Agregado en: v8.3.0**

**Versión de N-API: 1**

```C [C]
napi_status napi_get_dataview_info(napi_env env,
                                   napi_value dataview,
                                   size_t* byte_length,
                                   void** data,
                                   napi_value* arraybuffer,
                                   size_t* byte_offset)
```
- `[in] env`: El entorno en el que se invoca la API.
- `[in] dataview`: `napi_value` que representa el `DataView` cuyas propiedades se consultarán.
- `[out] byte_length`: Número de bytes en el `DataView`.
- `[out] data`: El búfer de datos subyacente al `DataView`. Si byte_length es `0`, esto puede ser `NULL` o cualquier otro valor de puntero.
- `[out] arraybuffer`: `ArrayBuffer` subyacente al `DataView`.
- `[out] byte_offset`: El desplazamiento de bytes dentro del búfer de datos desde el cual comenzar a proyectar el `DataView`.

Devuelve `napi_ok` si la API tuvo éxito.

Cualquiera de los parámetros de salida puede ser `NULL` si esa propiedad no es necesaria.

Esta API devuelve varias propiedades de un `DataView`.

#### `napi_get_date_value` {#napi_get_date_value}

**Agregado en: v11.11.0, v10.17.0**

**Versión de N-API: 5**

```C [C]
napi_status napi_get_date_value(napi_env env,
                                napi_value value,
                                double* result)
```
- `[in] env`: El entorno en el que se invoca la API.
- `[in] value`: `napi_value` que representa un `Date` de JavaScript.
- `[out] result`: Valor de tiempo como un `double` representado como milisegundos desde la medianoche al comienzo del 01 de enero de 1970 UTC.

Esta API no observa los segundos intercalares; se ignoran, ya que ECMAScript se alinea con la especificación de tiempo POSIX.

Devuelve `napi_ok` si la API tuvo éxito. Si se pasa un `napi_value` que no es de fecha, devuelve `napi_date_expected`.

Esta API devuelve la primitiva C double del valor de tiempo para el `Date` de JavaScript dado.

#### `napi_get_value_bool` {#napi_get_value_bool}

**Agregado en: v8.0.0**

**Versión de N-API: 1**

```C [C]
napi_status napi_get_value_bool(napi_env env, napi_value value, bool* result)
```
- `[in] env`: El entorno en el que se invoca la API.
- `[in] value`: `napi_value` que representa un `Boolean` de JavaScript.
- `[out] result`: Primitiva booleana C equivalente al `Boolean` de JavaScript dado.

Devuelve `napi_ok` si la API tuvo éxito. Si se pasa un `napi_value` no booleano, devuelve `napi_boolean_expected`.

Esta API devuelve la primitiva booleana C equivalente al `Boolean` de JavaScript dado.


#### `napi_get_value_double` {#napi_get_value_double}

**Agregado en: v8.0.0**

**Versión N-API: 1**

```C [C]
napi_status napi_get_value_double(napi_env env,
                                  napi_value value,
                                  double* result)
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] value`: `napi_value` que representa el `number` de JavaScript.
- `[out] result`: Primitiva C double equivalente al `number` de JavaScript dado.

Devuelve `napi_ok` si la API se realizó correctamente. Si se pasa un `napi_value` que no es un número, devuelve `napi_number_expected`.

Esta API devuelve la primitiva C double equivalente al `number` de JavaScript dado.

#### `napi_get_value_bigint_int64` {#napi_get_value_bigint_int64}

**Agregado en: v10.7.0**

**Versión N-API: 6**

```C [C]
napi_status napi_get_value_bigint_int64(napi_env env,
                                        napi_value value,
                                        int64_t* result,
                                        bool* lossless);
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] value`: `napi_value` que representa el `BigInt` de JavaScript.
- `[out] result`: Primitiva C `int64_t` equivalente al `BigInt` de JavaScript dado.
- `[out] lossless`: Indica si el valor `BigInt` se convirtió sin pérdida.

Devuelve `napi_ok` si la API se realizó correctamente. Si se pasa algo que no es un `BigInt`, devuelve `napi_bigint_expected`.

Esta API devuelve la primitiva C `int64_t` equivalente al `BigInt` de JavaScript dado. Si es necesario, truncará el valor, estableciendo `lossless` en `false`.

#### `napi_get_value_bigint_uint64` {#napi_get_value_bigint_uint64}

**Agregado en: v10.7.0**

**Versión N-API: 6**

```C [C]
napi_status napi_get_value_bigint_uint64(napi_env env,
                                        napi_value value,
                                        uint64_t* result,
                                        bool* lossless);
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] value`: `napi_value` que representa el `BigInt` de JavaScript.
- `[out] result`: Primitiva C `uint64_t` equivalente al `BigInt` de JavaScript dado.
- `[out] lossless`: Indica si el valor `BigInt` se convirtió sin pérdida.

Devuelve `napi_ok` si la API se realizó correctamente. Si se pasa algo que no es un `BigInt`, devuelve `napi_bigint_expected`.

Esta API devuelve la primitiva C `uint64_t` equivalente al `BigInt` de JavaScript dado. Si es necesario, truncará el valor, estableciendo `lossless` en `false`.


#### `napi_get_value_bigint_words` {#napi_get_value_bigint_words}

**Agregado en: v10.7.0**

**Versión N-API: 6**

```C [C]
napi_status napi_get_value_bigint_words(napi_env env,
                                        napi_value value,
                                        int* sign_bit,
                                        size_t* word_count,
                                        uint64_t* words);
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] value`: `napi_value` que representa JavaScript `BigInt`.
- `[out] sign_bit`: Entero que representa si el `BigInt` de JavaScript es positivo o negativo.
- `[in/out] word_count`: Debe inicializarse a la longitud del array `words`. Al regresar, se establecerá al número real de palabras que se necesitarían para almacenar este `BigInt`.
- `[out] words`: Puntero a un array de palabras de 64 bits pre-asignado.

Devuelve `napi_ok` si la API tuvo éxito.

Esta API convierte un único valor `BigInt` en un bit de signo, un array little-endian de 64 bits y el número de elementos en el array. `sign_bit` y `words` pueden establecerse ambos en `NULL`, para obtener solo `word_count`.

#### `napi_get_value_external` {#napi_get_value_external}

**Agregado en: v8.0.0**

**Versión N-API: 1**

```C [C]
napi_status napi_get_value_external(napi_env env,
                                    napi_value value,
                                    void** result)
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] value`: `napi_value` que representa un valor externo de JavaScript.
- `[out] result`: Puntero a los datos envueltos por el valor externo de JavaScript.

Devuelve `napi_ok` si la API tuvo éxito. Si se pasa un `napi_value` no externo, devuelve `napi_invalid_arg`.

Esta API recupera el puntero de datos externos que se pasó previamente a `napi_create_external()`.

#### `napi_get_value_int32` {#napi_get_value_int32}

**Agregado en: v8.0.0**

**Versión N-API: 1**

```C [C]
napi_status napi_get_value_int32(napi_env env,
                                 napi_value value,
                                 int32_t* result)
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] value`: `napi_value` que representa un `number` de JavaScript.
- `[out] result`: Primitiva C `int32` equivalente al `number` de JavaScript dado.

Devuelve `napi_ok` si la API tuvo éxito. Si se pasa un `napi_value` que no es un número, devuelve `napi_number_expected`.

Esta API devuelve la primitiva C `int32` equivalente al `number` de JavaScript dado.

Si el número excede el rango del entero de 32 bits, entonces el resultado se trunca al equivalente de los 32 bits inferiores. Esto puede resultar en que un número positivo grande se convierta en un número negativo si el valor es > 2 - 1.

Los valores de número no finitos (`NaN`, `+Infinity` o `-Infinity`) establecen el resultado en cero.


#### `napi_get_value_int64` {#napi_get_value_int64}

**Agregado en: v8.0.0**

**Versión de N-API: 1**

```C [C]
napi_status napi_get_value_int64(napi_env env,
                                 napi_value value,
                                 int64_t* result)
```
- `[in] env`: El entorno bajo el que se invoca la API.
- `[in] value`: `napi_value` que representa el `número` de JavaScript.
- `[out] result`: Primitiva C `int64` equivalente al `número` de JavaScript dado.

Devuelve `napi_ok` si la API tuvo éxito. Si se pasa un `napi_value` que no es un número, devuelve `napi_number_expected`.

Esta API devuelve la primitiva C `int64` equivalente al `número` de JavaScript dado.

Los valores `number` fuera del rango de [`Number.MIN_SAFE_INTEGER`](https://tc39.github.io/ecma262/#sec-number.min_safe_integer) `-(2**53 - 1)` - [`Number.MAX_SAFE_INTEGER`](https://tc39.github.io/ecma262/#sec-number.max_safe_integer) `(2**53 - 1)` perderán precisión.

Los valores numéricos no finitos (`NaN`, `+Infinity` o `-Infinity`) establecen el resultado en cero.

#### `napi_get_value_string_latin1` {#napi_get_value_string_latin1}

**Agregado en: v8.0.0**

**Versión de N-API: 1**

```C [C]
napi_status napi_get_value_string_latin1(napi_env env,
                                         napi_value value,
                                         char* buf,
                                         size_t bufsize,
                                         size_t* result)
```
- `[in] env`: El entorno bajo el que se invoca la API.
- `[in] value`: `napi_value` que representa la cadena de JavaScript.
- `[in] buf`: Búfer en el que escribir la cadena codificada en ISO-8859-1. Si se pasa `NULL`, la longitud de la cadena en bytes y excluyendo el terminador nulo se devuelve en `result`.
- `[in] bufsize`: Tamaño del búfer de destino. Cuando este valor es insuficiente, la cadena devuelta se trunca y se termina con un carácter nulo.
- `[out] result`: Número de bytes copiados en el búfer, excluyendo el terminador nulo.

Devuelve `napi_ok` si la API tuvo éxito. Si se pasa un `napi_value` que no es una `cadena`, devuelve `napi_string_expected`.

Esta API devuelve la cadena codificada en ISO-8859-1 correspondiente al valor pasado.


#### `napi_get_value_string_utf8` {#napi_get_value_string_utf8}

**Añadido en: v8.0.0**

**Versión N-API: 1**

```C [C]
napi_status napi_get_value_string_utf8(napi_env env,
                                       napi_value value,
                                       char* buf,
                                       size_t bufsize,
                                       size_t* result)
```
- `[in] env`: El entorno bajo el que se invoca la API.
- `[in] value`: `napi_value` que representa una cadena de JavaScript.
- `[in] buf`: Búfer en el que escribir la cadena codificada en UTF8. Si se pasa `NULL`, la longitud de la cadena en bytes, excluyendo el terminador nulo, se devuelve en `result`.
- `[in] bufsize`: Tamaño del búfer de destino. Cuando este valor es insuficiente, la cadena devuelta se trunca y termina en nulo.
- `[out] result`: Número de bytes copiados en el búfer, excluyendo el terminador nulo.

Devuelve `napi_ok` si la API se ha ejecutado correctamente. Si se pasa un `napi_value` que no es `string`, devuelve `napi_string_expected`.

Esta API devuelve la cadena codificada en UTF8 correspondiente al valor pasado.

#### `napi_get_value_string_utf16` {#napi_get_value_string_utf16}

**Añadido en: v8.0.0**

**Versión N-API: 1**

```C [C]
napi_status napi_get_value_string_utf16(napi_env env,
                                        napi_value value,
                                        char16_t* buf,
                                        size_t bufsize,
                                        size_t* result)
```
- `[in] env`: El entorno bajo el que se invoca la API.
- `[in] value`: `napi_value` que representa una cadena de JavaScript.
- `[in] buf`: Búfer en el que escribir la cadena codificada en UTF16-LE. Si se pasa `NULL`, se devuelve la longitud de la cadena en unidades de código de 2 bytes y excluyendo el terminador nulo.
- `[in] bufsize`: Tamaño del búfer de destino. Cuando este valor es insuficiente, la cadena devuelta se trunca y termina en nulo.
- `[out] result`: Número de unidades de código de 2 bytes copiadas en el búfer, excluyendo el terminador nulo.

Devuelve `napi_ok` si la API se ha ejecutado correctamente. Si se pasa un `napi_value` que no es `string`, devuelve `napi_string_expected`.

Esta API devuelve la cadena codificada en UTF16 correspondiente al valor pasado.


#### `napi_get_value_uint32` {#napi_get_value_uint32}

**Agregado en: v8.0.0**

**Versión de N-API: 1**

```C [C]
napi_status napi_get_value_uint32(napi_env env,
                                  napi_value value,
                                  uint32_t* result)
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] value`: `napi_value` que representa un `number` de JavaScript.
- `[out] result`: Primitiva C equivalente del `napi_value` dado como un `uint32_t`.

Devuelve `napi_ok` si la API se ejecutó correctamente. Si se pasa un `napi_value` que no es un número, devuelve `napi_number_expected`.

Esta API devuelve la primitiva C equivalente del `napi_value` dado como un `uint32_t`.

### Funciones para obtener instancias globales {#functions-to-get-global-instances}

#### `napi_get_boolean` {#napi_get_boolean}

**Agregado en: v8.0.0**

**Versión de N-API: 1**

```C [C]
napi_status napi_get_boolean(napi_env env, bool value, napi_value* result)
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] value`: El valor booleano a recuperar.
- `[out] result`: `napi_value` que representa el singleton `Boolean` de JavaScript a recuperar.

Devuelve `napi_ok` si la API se ejecutó correctamente.

Esta API se utiliza para devolver el objeto singleton de JavaScript que se utiliza para representar el valor booleano dado.

#### `napi_get_global` {#napi_get_global}

**Agregado en: v8.0.0**

**Versión de N-API: 1**

```C [C]
napi_status napi_get_global(napi_env env, napi_value* result)
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[out] result`: `napi_value` que representa el objeto `global` de JavaScript.

Devuelve `napi_ok` si la API se ejecutó correctamente.

Esta API devuelve el objeto `global`.

#### `napi_get_null` {#napi_get_null}

**Agregado en: v8.0.0**

**Versión de N-API: 1**

```C [C]
napi_status napi_get_null(napi_env env, napi_value* result)
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[out] result`: `napi_value` que representa el objeto `null` de JavaScript.

Devuelve `napi_ok` si la API se ejecutó correctamente.

Esta API devuelve el objeto `null`.

#### `napi_get_undefined` {#napi_get_undefined}

**Agregado en: v8.0.0**

**Versión de N-API: 1**

```C [C]
napi_status napi_get_undefined(napi_env env, napi_value* result)
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[out] result`: `napi_value` que representa el valor Undefined de JavaScript.

Devuelve `napi_ok` si la API se ejecutó correctamente.

Esta API devuelve el objeto Undefined.


## Trabajar con valores de JavaScript y operaciones abstractas {#working-with-javascript-values-and-abstract-operations}

Node-API expone un conjunto de APIs para realizar algunas operaciones abstractas sobre valores de JavaScript. Algunas de estas operaciones están documentadas en la [Sección 7](https://tc39.github.io/ecma262/#sec-abstract-operations) de la [Especificación del Lenguaje ECMAScript](https://tc39.github.io/ecma262/).

Estas APIs permiten hacer una de las siguientes cosas:

### `napi_coerce_to_bool` {#napi_coerce_to_bool}

**Añadido en: v8.0.0**

**Versión de N-API: 1**

```C [C]
napi_status napi_coerce_to_bool(napi_env env,
                                napi_value value,
                                napi_value* result)
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] value`: El valor de JavaScript a coaccionar.
- `[out] result`: `napi_value` que representa el `Boolean` de JavaScript coaccionado.

Devuelve `napi_ok` si la API tuvo éxito.

Esta API implementa la operación abstracta `ToBoolean()` como se define en la [Sección 7.1.2](https://tc39.github.io/ecma262/#sec-toboolean) de la Especificación del Lenguaje ECMAScript.

### `napi_coerce_to_number` {#napi_coerce_to_number}

**Añadido en: v8.0.0**

**Versión de N-API: 1**

```C [C]
napi_status napi_coerce_to_number(napi_env env,
                                  napi_value value,
                                  napi_value* result)
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] value`: El valor de JavaScript a coaccionar.
- `[out] result`: `napi_value` que representa el `number` de JavaScript coaccionado.

Devuelve `napi_ok` si la API tuvo éxito.

Esta API implementa la operación abstracta `ToNumber()` como se define en la [Sección 7.1.3](https://tc39.github.io/ecma262/#sec-tonumber) de la Especificación del Lenguaje ECMAScript. Esta función potencialmente ejecuta código JS si el valor pasado es un objeto.

### `napi_coerce_to_object` {#napi_coerce_to_object}

**Añadido en: v8.0.0**

**Versión de N-API: 1**

```C [C]
napi_status napi_coerce_to_object(napi_env env,
                                  napi_value value,
                                  napi_value* result)
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] value`: El valor de JavaScript a coaccionar.
- `[out] result`: `napi_value` que representa el `Object` de JavaScript coaccionado.

Devuelve `napi_ok` si la API tuvo éxito.

Esta API implementa la operación abstracta `ToObject()` como se define en la [Sección 7.1.13](https://tc39.github.io/ecma262/#sec-toobject) de la Especificación del Lenguaje ECMAScript.


### `napi_coerce_to_string` {#napi_coerce_to_string}

**Agregado en: v8.0.0**

**Versión N-API: 1**

```C [C]
napi_status napi_coerce_to_string(napi_env env,
                                  napi_value value,
                                  napi_value* result)
```
- `[in] env`: El entorno en el que se invoca la API.
- `[in] value`: El valor de JavaScript que se va a forzar.
- `[out] result`: `napi_value` que representa la `string` de JavaScript forzada.

Devuelve `napi_ok` si la API tuvo éxito.

Esta API implementa la operación abstracta `ToString()` como se define en la [Sección 7.1.13](https://tc39.github.io/ecma262/#sec-toobject) de la Especificación del Lenguaje ECMAScript. Esta función puede ejecutar código JS si el valor pasado es un objeto.

### `napi_typeof` {#napi_typeof}

**Agregado en: v8.0.0**

**Versión N-API: 1**

```C [C]
napi_status napi_typeof(napi_env env, napi_value value, napi_valuetype* result)
```
- `[in] env`: El entorno en el que se invoca la API.
- `[in] value`: El valor de JavaScript cuyo tipo se va a consultar.
- `[out] result`: El tipo del valor de JavaScript.

Devuelve `napi_ok` si la API tuvo éxito.

- `napi_invalid_arg` si el tipo de `value` no es un tipo ECMAScript conocido y `value` no es un valor externo.

Esta API representa un comportamiento similar a invocar el Operador `typeof` en el objeto como se define en la [Sección 12.5.5](https://tc39.github.io/ecma262/#sec-typeof-operator) de la Especificación del Lenguaje ECMAScript. Sin embargo, existen algunas diferencias:

Si `value` tiene un tipo que no es válido, se devuelve un error.

### `napi_instanceof` {#napi_instanceof}

**Agregado en: v8.0.0**

**Versión N-API: 1**

```C [C]
napi_status napi_instanceof(napi_env env,
                            napi_value object,
                            napi_value constructor,
                            bool* result)
```
- `[in] env`: El entorno en el que se invoca la API.
- `[in] object`: El valor de JavaScript que se va a verificar.
- `[in] constructor`: El objeto de función de JavaScript de la función constructora con la que se va a comparar.
- `[out] result`: Booleano que se establece en verdadero si `object instanceof constructor` es verdadero.

Devuelve `napi_ok` si la API tuvo éxito.

Esta API representa la invocación del operador `instanceof` en el objeto como se define en la [Sección 12.10.4](https://tc39.github.io/ecma262/#sec-instanceofoperator) de la Especificación del Lenguaje ECMAScript.


### `napi_is_array` {#napi_is_array}

**Agregado en: v8.0.0**

**Versión de N-API: 1**

```C [C]
napi_status napi_is_array(napi_env env, napi_value value, bool* result)
```
- `[in] env`: El entorno bajo el que se invoca la API.
- `[in] value`: El valor de JavaScript a verificar.
- `[out] result`: Indica si el objeto dado es un array.

Devuelve `napi_ok` si la API tuvo éxito.

Esta API representa la invocación de la operación `IsArray` en el objeto tal como se define en la [Sección 7.2.2](https://tc39.github.io/ecma262/#sec-isarray) de la Especificación del Lenguaje ECMAScript.

### `napi_is_arraybuffer` {#napi_is_arraybuffer}

**Agregado en: v8.0.0**

**Versión de N-API: 1**

```C [C]
napi_status napi_is_arraybuffer(napi_env env, napi_value value, bool* result)
```
- `[in] env`: El entorno bajo el que se invoca la API.
- `[in] value`: El valor de JavaScript a verificar.
- `[out] result`: Indica si el objeto dado es un `ArrayBuffer`.

Devuelve `napi_ok` si la API tuvo éxito.

Esta API comprueba si el `Object` pasado es un array buffer.

### `napi_is_buffer` {#napi_is_buffer}

**Agregado en: v8.0.0**

**Versión de N-API: 1**

```C [C]
napi_status napi_is_buffer(napi_env env, napi_value value, bool* result)
```
- `[in] env`: El entorno bajo el que se invoca la API.
- `[in] value`: El valor de JavaScript a verificar.
- `[out] result`: Indica si el `napi_value` dado representa un objeto `node::Buffer` o `Uint8Array`.

Devuelve `napi_ok` si la API tuvo éxito.

Esta API comprueba si el `Object` pasado es un buffer o Uint8Array. Se debería preferir [`napi_is_typedarray`](/es/nodejs/api/n-api#napi_is_typedarray) si el llamante necesita comprobar si el valor es un Uint8Array.

### `napi_is_date` {#napi_is_date}

**Agregado en: v11.11.0, v10.17.0**

**Versión de N-API: 5**

```C [C]
napi_status napi_is_date(napi_env env, napi_value value, bool* result)
```
- `[in] env`: El entorno bajo el que se invoca la API.
- `[in] value`: El valor de JavaScript a verificar.
- `[out] result`: Indica si el `napi_value` dado representa un objeto JavaScript `Date`.

Devuelve `napi_ok` si la API tuvo éxito.

Esta API comprueba si el `Object` pasado es una fecha.


### `napi_is_error` {#napi_is_error_1}

**Añadido en: v8.0.0**

**Versión de N-API: 1**

```C [C]
napi_status napi_is_error(napi_env env, napi_value value, bool* result)
```
- `[in] env`: El entorno en el que se invoca la API.
- `[in] value`: El valor de JavaScript a verificar.
- `[out] result`: Indica si el `napi_value` dado representa un objeto `Error`.

Devuelve `napi_ok` si la API se ejecutó correctamente.

Esta API comprueba si el `Object` pasado es un `Error`.

### `napi_is_typedarray` {#napi_is_typedarray}

**Añadido en: v8.0.0**

**Versión de N-API: 1**

```C [C]
napi_status napi_is_typedarray(napi_env env, napi_value value, bool* result)
```
- `[in] env`: El entorno en el que se invoca la API.
- `[in] value`: El valor de JavaScript a verificar.
- `[out] result`: Indica si el `napi_value` dado representa un `TypedArray`.

Devuelve `napi_ok` si la API se ejecutó correctamente.

Esta API comprueba si el `Object` pasado es un array con tipo.

### `napi_is_dataview` {#napi_is_dataview}

**Añadido en: v8.3.0**

**Versión de N-API: 1**

```C [C]
napi_status napi_is_dataview(napi_env env, napi_value value, bool* result)
```
- `[in] env`: El entorno en el que se invoca la API.
- `[in] value`: El valor de JavaScript a verificar.
- `[out] result`: Indica si el `napi_value` dado representa un `DataView`.

Devuelve `napi_ok` si la API se ejecutó correctamente.

Esta API comprueba si el `Object` pasado es un `DataView`.

### `napi_strict_equals` {#napi_strict_equals}

**Añadido en: v8.0.0**

**Versión de N-API: 1**

```C [C]
napi_status napi_strict_equals(napi_env env,
                               napi_value lhs,
                               napi_value rhs,
                               bool* result)
```
- `[in] env`: El entorno en el que se invoca la API.
- `[in] lhs`: El valor de JavaScript a verificar.
- `[in] rhs`: El valor de JavaScript con el que se va a comparar.
- `[out] result`: Indica si los dos objetos `napi_value` son iguales.

Devuelve `napi_ok` si la API se ejecutó correctamente.

Esta API representa la invocación del algoritmo de igualdad estricta tal como se define en la [Sección 7.2.14](https://tc39.github.io/ecma262/#sec-strict-equality-comparison) de la Especificación del Lenguaje ECMAScript.


### `napi_detach_arraybuffer` {#napi_detach_arraybuffer}

**Añadido en: v13.0.0, v12.16.0, v10.22.0**

**Versión de N-API: 7**

```C [C]
napi_status napi_detach_arraybuffer(napi_env env,
                                    napi_value arraybuffer)
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] arraybuffer`: El `ArrayBuffer` de JavaScript que se va a separar.

Devuelve `napi_ok` si la API tuvo éxito. Si se pasa un `ArrayBuffer` no separable, devuelve `napi_detachable_arraybuffer_expected`.

Generalmente, un `ArrayBuffer` no es separable si ya ha sido separado antes. El motor puede imponer condiciones adicionales sobre si un `ArrayBuffer` es separable. Por ejemplo, V8 requiere que el `ArrayBuffer` sea externo, es decir, creado con [`napi_create_external_arraybuffer`](/es/nodejs/api/n-api#napi_create_external_arraybuffer).

Esta API representa la invocación de la operación de separación de `ArrayBuffer` como se define en [Sección 24.1.1.3](https://tc39.es/ecma262/#sec-detacharraybuffer) de la Especificación del Lenguaje ECMAScript.

### `napi_is_detached_arraybuffer` {#napi_is_detached_arraybuffer}

**Añadido en: v13.3.0, v12.16.0, v10.22.0**

**Versión de N-API: 7**

```C [C]
napi_status napi_is_detached_arraybuffer(napi_env env,
                                         napi_value arraybuffer,
                                         bool* result)
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] arraybuffer`: El `ArrayBuffer` de JavaScript que se va a comprobar.
- `[out] result`: Indica si el `arraybuffer` está separado.

Devuelve `napi_ok` si la API tuvo éxito.

El `ArrayBuffer` se considera separado si sus datos internos son `null`.

Esta API representa la invocación de la operación `IsDetachedBuffer` de `ArrayBuffer` como se define en [Sección 24.1.1.2](https://tc39.es/ecma262/#sec-isdetachedbuffer) de la Especificación del Lenguaje ECMAScript.

## Trabajando con propiedades de JavaScript {#working-with-javascript-properties}

Node-API expone un conjunto de APIs para obtener y establecer propiedades en objetos de JavaScript. Algunos de estos tipos están documentados en [Sección 7](https://tc39.github.io/ecma262/#sec-abstract-operations) de la [Especificación del Lenguaje ECMAScript](https://tc39.github.io/ecma262/).

Las propiedades en JavaScript se representan como una tupla de una clave y un valor. Fundamentalmente, todas las claves de propiedad en Node-API pueden representarse en una de las siguientes formas:

- Nombrada: una cadena simple codificada en UTF8
- Indexada por entero: un valor de índice representado por `uint32_t`
- Valor de JavaScript: estos se representan en Node-API mediante `napi_value`. Esto puede ser un `napi_value` que representa una `string`, `number` o `symbol`.

Los valores de Node-API se representan mediante el tipo `napi_value`. Cualquier llamada a Node-API que requiera un valor de JavaScript toma un `napi_value`. Sin embargo, es responsabilidad del llamante asegurarse de que el `napi_value` en cuestión sea del tipo de JavaScript esperado por la API.

Las APIs documentadas en esta sección proporcionan una interfaz simple para obtener y establecer propiedades en objetos JavaScript arbitrarios representados por `napi_value`.

Por ejemplo, considere el siguiente fragmento de código JavaScript:

```js [ESM]
const obj = {};
obj.myProp = 123;
```
El equivalente se puede hacer usando valores de Node-API con el siguiente fragmento:

```C [C]
napi_status status = napi_generic_failure;

// const obj = {}
napi_value obj, value;
status = napi_create_object(env, &obj);
if (status != napi_ok) return status;

// Create a napi_value for 123
status = napi_create_int32(env, 123, &value);
if (status != napi_ok) return status;

// obj.myProp = 123
status = napi_set_named_property(env, obj, "myProp", value);
if (status != napi_ok) return status;
```
Las propiedades indexadas se pueden establecer de manera similar. Considere el siguiente fragmento de código JavaScript:

```js [ESM]
const arr = [];
arr[123] = 'hello';
```
El equivalente se puede hacer usando valores de Node-API con el siguiente fragmento:

```C [C]
napi_status status = napi_generic_failure;

// const arr = [];
napi_value arr, value;
status = napi_create_array(env, &arr);
if (status != napi_ok) return status;

// Create a napi_value for 'hello'
status = napi_create_string_utf8(env, "hello", NAPI_AUTO_LENGTH, &value);
if (status != napi_ok) return status;

// arr[123] = 'hello';
status = napi_set_element(env, arr, 123, value);
if (status != napi_ok) return status;
```
Las propiedades se pueden recuperar usando las APIs descritas en esta sección. Considere el siguiente fragmento de código JavaScript:

```js [ESM]
const arr = [];
const value = arr[123];
```
Lo siguiente es el equivalente aproximado de la contraparte de Node-API:

```C [C]
napi_status status = napi_generic_failure;

// const arr = []
napi_value arr, value;
status = napi_create_array(env, &arr);
if (status != napi_ok) return status;

// const value = arr[123]
status = napi_get_element(env, arr, 123, &value);
if (status != napi_ok) return status;
```
Finalmente, también se pueden definir múltiples propiedades en un objeto por razones de rendimiento. Considere el siguiente JavaScript:

```js [ESM]
const obj = {};
Object.defineProperties(obj, {
  'foo': { value: 123, writable: true, configurable: true, enumerable: true },
  'bar': { value: 456, writable: true, configurable: true, enumerable: true },
});
```
Lo siguiente es el equivalente aproximado de la contraparte de Node-API:

```C [C]
napi_status status = napi_status_generic_failure;

// const obj = {};
napi_value obj;
status = napi_create_object(env, &obj);
if (status != napi_ok) return status;

// Create napi_values for 123 and 456
napi_value fooValue, barValue;
status = napi_create_int32(env, 123, &fooValue);
if (status != napi_ok) return status;
status = napi_create_int32(env, 456, &barValue);
if (status != napi_ok) return status;

// Set the properties
napi_property_descriptor descriptors[] = {
  { "foo", NULL, NULL, NULL, NULL, fooValue, napi_writable | napi_configurable, NULL },
  { "bar", NULL, NULL, NULL, NULL, barValue, napi_writable | napi_configurable, NULL }
}
status = napi_define_properties(env,
                                obj,
                                sizeof(descriptors) / sizeof(descriptors[0]),
                                descriptors);
if (status != napi_ok) return status;
```

### Estructuras {#structures}

#### `napi_property_attributes` {#napi_property_attributes}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v14.12.0 | Se agregaron `napi_default_method` y `napi_default_property`. |
:::

```C [C]
typedef enum {
  napi_default = 0,
  napi_writable = 1 << 0,
  napi_enumerable = 1 << 1,
  napi_configurable = 1 << 2,

  // Se usa con napi_define_class para distinguir las propiedades estáticas
  // de las propiedades de instancia. Ignorado por napi_define_properties.
  napi_static = 1 << 10,

  // Predeterminado para los métodos de clase.
  napi_default_method = napi_writable | napi_configurable,

  // Predeterminado para las propiedades de objeto, como en JS obj[prop].
  napi_default_jsproperty = napi_writable |
                          napi_enumerable |
                          napi_configurable,
} napi_property_attributes;
```
`napi_property_attributes` son flags utilizados para controlar el comportamiento de las propiedades establecidas en un objeto JavaScript. Aparte de `napi_static`, corresponden a los atributos listados en la [Sección 6.1.7.1](https://tc39.github.io/ecma262/#table-2) de la [Especificación del Lenguaje ECMAScript](https://tc39.github.io/ecma262/). Pueden ser uno o más de los siguientes bitflags:

- `napi_default`: No se establecen atributos explícitos en la propiedad. De forma predeterminada, una propiedad es de solo lectura, no enumerable y no configurable.
- `napi_writable`: La propiedad es escribible.
- `napi_enumerable`: La propiedad es enumerable.
- `napi_configurable`: La propiedad es configurable como se define en la [Sección 6.1.7.1](https://tc39.github.io/ecma262/#table-2) de la [Especificación del Lenguaje ECMAScript](https://tc39.github.io/ecma262/).
- `napi_static`: La propiedad se definirá como una propiedad estática en una clase en lugar de una propiedad de instancia, que es el valor predeterminado. Esto solo lo utiliza [`napi_define_class`](/es/nodejs/api/n-api#napi_define_class). `napi_define_properties` lo ignora.
- `napi_default_method`: Como un método en una clase JS, la propiedad es configurable y escribible, pero no enumerable.
- `napi_default_jsproperty`: Como una propiedad establecida mediante asignación en JavaScript, la propiedad es escribible, enumerable y configurable.


#### `napi_property_descriptor` {#napi_property_descriptor}

```C [C]
typedef struct {
  // Uno de utf8name o name debe ser NULL.
  const char* utf8name;
  napi_value name;

  napi_callback method;
  napi_callback getter;
  napi_callback setter;
  napi_value value;

  napi_property_attributes attributes;
  void* data;
} napi_property_descriptor;
```
- `utf8name`: Cadena opcional que describe la clave para la propiedad, codificada como UTF8. Se debe proporcionar `utf8name` o `name` para la propiedad.
- `name`: `napi_value` opcional que apunta a una cadena o símbolo de JavaScript que se utilizará como clave para la propiedad. Se debe proporcionar `utf8name` o `name` para la propiedad.
- `value`: El valor que se recupera mediante un acceso get a la propiedad si la propiedad es una propiedad de datos. Si se pasa esto, configure `getter`, `setter`, `method` y `data` en `NULL` (ya que estos miembros no se usarán).
- `getter`: Una función para llamar cuando se realiza un acceso get a la propiedad. Si se pasa esto, configure `value` y `method` en `NULL` (ya que estos miembros no se usarán). El tiempo de ejecución llama implícitamente a la función dada cuando se accede a la propiedad desde el código JavaScript (o si se realiza una obtención de la propiedad mediante una llamada Node-API). [`napi_callback`](/es/nodejs/api/n-api#napi_callback) proporciona más detalles.
- `setter`: Una función para llamar cuando se realiza un acceso set a la propiedad. Si se pasa esto, configure `value` y `method` en `NULL` (ya que estos miembros no se usarán). El tiempo de ejecución llama implícitamente a la función dada cuando la propiedad se establece desde el código JavaScript (o si se realiza un establecimiento de la propiedad mediante una llamada Node-API). [`napi_callback`](/es/nodejs/api/n-api#napi_callback) proporciona más detalles.
- `method`: Establezca esto para hacer que la propiedad `value` del objeto descriptor de propiedad sea una función de JavaScript representada por `method`. Si se pasa esto, configure `value`, `getter` y `setter` en `NULL` (ya que estos miembros no se usarán). [`napi_callback`](/es/nodejs/api/n-api#napi_callback) proporciona más detalles.
- `attributes`: Los atributos asociados con la propiedad en particular. Consulte [`napi_property_attributes`](/es/nodejs/api/n-api#napi_property_attributes).
- `data`: Los datos de la devolución de llamada que se pasan a `method`, `getter` y `setter` si se invoca esta función.


### Funciones {#functions}

#### `napi_get_property_names` {#napi_get_property_names}

**Agregado en: v8.0.0**

**Versión N-API: 1**

```C [C]
napi_status napi_get_property_names(napi_env env,
                                    napi_value object,
                                    napi_value* result);
```
- `[in] env`: El entorno bajo el cual se invoca la llamada de Node-API.
- `[in] object`: El objeto del cual se recuperarán las propiedades.
- `[out] result`: Un `napi_value` que representa un array de valores JavaScript que representan los nombres de las propiedades del objeto. La API se puede utilizar para iterar sobre `result` utilizando [`napi_get_array_length`](/es/nodejs/api/n-api#napi_get_array_length) y [`napi_get_element`](/es/nodejs/api/n-api#napi_get_element).

Devuelve `napi_ok` si la API se ejecutó correctamente.

Esta API devuelve los nombres de las propiedades enumerables de `object` como un array de cadenas. Las propiedades de `object` cuya clave es un símbolo no se incluirán.

#### `napi_get_all_property_names` {#napi_get_all_property_names}

**Agregado en: v13.7.0, v12.17.0, v10.20.0**

**Versión N-API: 6**

```C [C]
napi_get_all_property_names(napi_env env,
                            napi_value object,
                            napi_key_collection_mode key_mode,
                            napi_key_filter key_filter,
                            napi_key_conversion key_conversion,
                            napi_value* result);
```
- `[in] env`: El entorno bajo el cual se invoca la llamada de Node-API.
- `[in] object`: El objeto del cual se recuperarán las propiedades.
- `[in] key_mode`: Si también se recuperarán las propiedades del prototipo.
- `[in] key_filter`: Qué propiedades recuperar (enumerables/legibles/grabables).
- `[in] key_conversion`: Si se convertirán las claves de propiedad numeradas a cadenas.
- `[out] result`: Un `napi_value` que representa un array de valores JavaScript que representan los nombres de las propiedades del objeto. [`napi_get_array_length`](/es/nodejs/api/n-api#napi_get_array_length) y [`napi_get_element`](/es/nodejs/api/n-api#napi_get_element) se pueden utilizar para iterar sobre `result`.

Devuelve `napi_ok` si la API se ejecutó correctamente.

Esta API devuelve un array que contiene los nombres de las propiedades disponibles de este objeto.


#### `napi_set_property` {#napi_set_property}

**Agregado en: v8.0.0**

**Versión de N-API: 1**

```C [C]
napi_status napi_set_property(napi_env env,
                              napi_value object,
                              napi_value key,
                              napi_value value);
```
- `[in] env`: El entorno bajo el cual se invoca la llamada Node-API.
- `[in] object`: El objeto en el que se va a establecer la propiedad.
- `[in] key`: El nombre de la propiedad a establecer.
- `[in] value`: El valor de la propiedad.

Devuelve `napi_ok` si la API se completó con éxito.

Esta API establece una propiedad en el `Object` pasado.

#### `napi_get_property` {#napi_get_property}

**Agregado en: v8.0.0**

**Versión de N-API: 1**

```C [C]
napi_status napi_get_property(napi_env env,
                              napi_value object,
                              napi_value key,
                              napi_value* result);
```
- `[in] env`: El entorno bajo el cual se invoca la llamada Node-API.
- `[in] object`: El objeto desde el que se va a recuperar la propiedad.
- `[in] key`: El nombre de la propiedad a recuperar.
- `[out] result`: El valor de la propiedad.

Devuelve `napi_ok` si la API se completó con éxito.

Esta API obtiene la propiedad solicitada del `Object` pasado.

#### `napi_has_property` {#napi_has_property}

**Agregado en: v8.0.0**

**Versión de N-API: 1**

```C [C]
napi_status napi_has_property(napi_env env,
                              napi_value object,
                              napi_value key,
                              bool* result);
```
- `[in] env`: El entorno bajo el cual se invoca la llamada Node-API.
- `[in] object`: El objeto a consultar.
- `[in] key`: El nombre de la propiedad cuya existencia se va a comprobar.
- `[out] result`: Si la propiedad existe en el objeto o no.

Devuelve `napi_ok` si la API se completó con éxito.

Esta API comprueba si el `Object` pasado tiene la propiedad nombrada.

#### `napi_delete_property` {#napi_delete_property}

**Agregado en: v8.2.0**

**Versión de N-API: 1**

```C [C]
napi_status napi_delete_property(napi_env env,
                                 napi_value object,
                                 napi_value key,
                                 bool* result);
```
- `[in] env`: El entorno bajo el cual se invoca la llamada Node-API.
- `[in] object`: El objeto a consultar.
- `[in] key`: El nombre de la propiedad a eliminar.
- `[out] result`: Si la eliminación de la propiedad se realizó correctamente o no. `result` se puede ignorar opcionalmente pasando `NULL`.

Devuelve `napi_ok` si la API se completó con éxito.

Esta API intenta eliminar la propiedad propia `key` de `object`.


#### `napi_has_own_property` {#napi_has_own_property}

**Agregado en: v8.2.0**

**Versión de N-API: 1**

```C [C]
napi_status napi_has_own_property(napi_env env,
                                  napi_value object,
                                  napi_value key,
                                  bool* result);
```
- `[in] env`: El entorno bajo el que se invoca la llamada de Node-API.
- `[in] object`: El objeto a consultar.
- `[in] key`: El nombre de la propiedad propia cuya existencia se va a comprobar.
- `[out] result`: Indica si la propiedad propia existe en el objeto o no.

Devuelve `napi_ok` si la API se ha realizado correctamente.

Esta API comprueba si el `Object` pasado tiene la propiedad propia nombrada. `key` debe ser una `string` o un `symbol`, o se lanzará un error. Node-API no realizará ninguna conversión entre tipos de datos.

#### `napi_set_named_property` {#napi_set_named_property}

**Agregado en: v8.0.0**

**Versión de N-API: 1**

```C [C]
napi_status napi_set_named_property(napi_env env,
                                    napi_value object,
                                    const char* utf8Name,
                                    napi_value value);
```
- `[in] env`: El entorno bajo el que se invoca la llamada de Node-API.
- `[in] object`: El objeto en el que se va a establecer la propiedad.
- `[in] utf8Name`: El nombre de la propiedad a establecer.
- `[in] value`: El valor de la propiedad.

Devuelve `napi_ok` si la API se ha realizado correctamente.

Este método es equivalente a llamar a [`napi_set_property`](/es/nodejs/api/n-api#napi_set_property) con un `napi_value` creado a partir de la cadena pasada como `utf8Name`.

#### `napi_get_named_property` {#napi_get_named_property}

**Agregado en: v8.0.0**

**Versión de N-API: 1**

```C [C]
napi_status napi_get_named_property(napi_env env,
                                    napi_value object,
                                    const char* utf8Name,
                                    napi_value* result);
```
- `[in] env`: El entorno bajo el que se invoca la llamada de Node-API.
- `[in] object`: El objeto del que se va a recuperar la propiedad.
- `[in] utf8Name`: El nombre de la propiedad a obtener.
- `[out] result`: El valor de la propiedad.

Devuelve `napi_ok` si la API se ha realizado correctamente.

Este método es equivalente a llamar a [`napi_get_property`](/es/nodejs/api/n-api#napi_get_property) con un `napi_value` creado a partir de la cadena pasada como `utf8Name`.


#### `napi_has_named_property` {#napi_has_named_property}

**Agregado en: v8.0.0**

**Versión de N-API: 1**

```C [C]
napi_status napi_has_named_property(napi_env env,
                                    napi_value object,
                                    const char* utf8Name,
                                    bool* result);
```
- `[in] env`: El entorno bajo el cual se invoca la llamada a Node-API.
- `[in] object`: El objeto a consultar.
- `[in] utf8Name`: El nombre de la propiedad cuya existencia se debe verificar.
- `[out] result`: Si la propiedad existe en el objeto o no.

Devuelve `napi_ok` si la API tuvo éxito.

Este método es equivalente a llamar a [`napi_has_property`](/es/nodejs/api/n-api#napi_has_property) con un `napi_value` creado a partir de la cadena pasada como `utf8Name`.

#### `napi_set_element` {#napi_set_element}

**Agregado en: v8.0.0**

**Versión de N-API: 1**

```C [C]
napi_status napi_set_element(napi_env env,
                             napi_value object,
                             uint32_t index,
                             napi_value value);
```
- `[in] env`: El entorno bajo el cual se invoca la llamada a Node-API.
- `[in] object`: El objeto desde el cual se establecerán las propiedades.
- `[in] index`: El índice de la propiedad que se establecerá.
- `[in] value`: El valor de la propiedad.

Devuelve `napi_ok` si la API tuvo éxito.

Esta API establece un elemento en el `Object` pasado.

#### `napi_get_element` {#napi_get_element}

**Agregado en: v8.0.0**

**Versión de N-API: 1**

```C [C]
napi_status napi_get_element(napi_env env,
                             napi_value object,
                             uint32_t index,
                             napi_value* result);
```
- `[in] env`: El entorno bajo el cual se invoca la llamada a Node-API.
- `[in] object`: El objeto desde el cual se recuperará la propiedad.
- `[in] index`: El índice de la propiedad a obtener.
- `[out] result`: El valor de la propiedad.

Devuelve `napi_ok` si la API tuvo éxito.

Esta API obtiene el elemento en el índice solicitado.

#### `napi_has_element` {#napi_has_element}

**Agregado en: v8.0.0**

**Versión de N-API: 1**

```C [C]
napi_status napi_has_element(napi_env env,
                             napi_value object,
                             uint32_t index,
                             bool* result);
```
- `[in] env`: El entorno bajo el cual se invoca la llamada a Node-API.
- `[in] object`: El objeto a consultar.
- `[in] index`: El índice de la propiedad cuya existencia se debe verificar.
- `[out] result`: Si la propiedad existe en el objeto o no.

Devuelve `napi_ok` si la API tuvo éxito.

Esta API devuelve si el `Object` pasado tiene un elemento en el índice solicitado.


#### `napi_delete_element` {#napi_delete_element}

**Agregada en: v8.2.0**

**Versión de N-API: 1**

```C [C]
napi_status napi_delete_element(napi_env env,
                                napi_value object,
                                uint32_t index,
                                bool* result);
```
- `[in] env`: El entorno bajo el cual se invoca la llamada N-API.
- `[in] object`: El objeto a consultar.
- `[in] index`: El índice de la propiedad a eliminar.
- `[out] result`: Si la eliminación del elemento tuvo éxito o no. `result` puede ignorarse opcionalmente pasando `NULL`.

Devuelve `napi_ok` si la API tuvo éxito.

Esta API intenta eliminar el `index` especificado de `object`.

#### `napi_define_properties` {#napi_define_properties}

**Agregada en: v8.0.0**

**Versión de N-API: 1**

```C [C]
napi_status napi_define_properties(napi_env env,
                                   napi_value object,
                                   size_t property_count,
                                   const napi_property_descriptor* properties);
```
- `[in] env`: El entorno bajo el cual se invoca la llamada N-API.
- `[in] object`: El objeto del cual se recuperarán las propiedades.
- `[in] property_count`: El número de elementos en el array `properties`.
- `[in] properties`: El array de descriptores de propiedad.

Devuelve `napi_ok` si la API tuvo éxito.

Este método permite la definición eficiente de múltiples propiedades en un objeto dado. Las propiedades se definen usando descriptores de propiedad (ver [`napi_property_descriptor`](/es/nodejs/api/n-api#napi_property_descriptor)). Dado un array de dichos descriptores de propiedad, esta API establecerá las propiedades en el objeto una a la vez, como lo define `DefineOwnProperty()` (descrito en [Sección 9.1.6](https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots-defineownproperty-p-desc) de la especificación ECMA-262).

#### `napi_object_freeze` {#napi_object_freeze}

**Agregada en: v14.14.0, v12.20.0**

**Versión de N-API: 8**

```C [C]
napi_status napi_object_freeze(napi_env env,
                               napi_value object);
```
- `[in] env`: El entorno bajo el cual se invoca la llamada N-API.
- `[in] object`: El objeto a congelar.

Devuelve `napi_ok` si la API tuvo éxito.

Este método congela un objeto dado. Esto evita que se agreguen nuevas propiedades, que se eliminen las propiedades existentes, impide cambiar la enumerabilidad, la configurabilidad o la capacidad de escritura de las propiedades existentes e impide que se cambien los valores de las propiedades existentes. También evita que se cambie el prototipo del objeto. Esto se describe en [Sección 19.1.2.6](https://tc39.es/ecma262/#sec-object.freeze) de la especificación ECMA-262.


#### `napi_object_seal` {#napi_object_seal}

**Agregado en: v14.14.0, v12.20.0**

**Versión N-API: 8**

```C [C]
napi_status napi_object_seal(napi_env env,
                             napi_value object);
```
- `[in] env`: El entorno bajo el que se invoca la llamada a Node-API.
- `[in] object`: El objeto a sellar.

Devuelve `napi_ok` si la API tuvo éxito.

Este método sella un objeto dado. Esto evita que se añadan nuevas propiedades al mismo, así como que se marquen todas las propiedades existentes como no configurables. Esto se describe en la [Sección 19.1.2.20](https://tc39.es/ecma262/#sec-object.seal) de la especificación ECMA-262.

## Trabajar con funciones de JavaScript {#working-with-javascript-functions}

Node-API proporciona un conjunto de APIs que permiten que el código JavaScript vuelva a llamar al código nativo. Las Node-APIs que soportan la llamada de vuelta al código nativo toman funciones de callback representadas por el tipo `napi_callback`. Cuando la VM de JavaScript vuelve a llamar al código nativo, se invoca la función `napi_callback` proporcionada. Las APIs documentadas en esta sección permiten que la función de callback haga lo siguiente:

- Obtener información sobre el contexto en el que se invocó el callback.
- Obtener los argumentos pasados al callback.
- Devolver un `napi_value` desde el callback.

Además, Node-API proporciona un conjunto de funciones que permiten llamar a funciones de JavaScript desde código nativo. Se puede llamar a una función como una llamada de función de JavaScript normal o como una función constructora.

Cualquier dato no `NULL` que se pase a esta API a través del campo `data` de los elementos `napi_property_descriptor` puede asociarse con `object` y liberarse cada vez que `object` sea recolectado por el recolector de basura pasando tanto `object` como los datos a [`napi_add_finalizer`](/es/nodejs/api/n-api#napi_add_finalizer).

### `napi_call_function` {#napi_call_function}

**Agregado en: v8.0.0**

**Versión N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_call_function(napi_env env,
                                           napi_value recv,
                                           napi_value func,
                                           size_t argc,
                                           const napi_value* argv,
                                           napi_value* result);
```
- `[in] env`: El entorno bajo el que se invoca la API.
- `[in] recv`: El valor `this` pasado a la función llamada.
- `[in] func`: `napi_value` que representa la función de JavaScript que se va a invocar.
- `[in] argc`: El recuento de elementos en la matriz `argv`.
- `[in] argv`: Matriz de `napi_values` que representan los valores de JavaScript pasados como argumentos a la función.
- `[out] result`: `napi_value` que representa el objeto JavaScript devuelto.

Devuelve `napi_ok` si la API tuvo éxito.

Este método permite que un objeto de función de JavaScript sea llamado desde un complemento nativo. Este es el principal mecanismo para volver a llamar *desde* el código nativo del complemento *a* JavaScript. Para el caso especial de llamar a JavaScript después de una operación asíncrona, consulte [`napi_make_callback`](/es/nodejs/api/n-api#napi_make_callback).

Un caso de uso de ejemplo podría ser el siguiente. Considere el siguiente fragmento de JavaScript:

```js [ESM]
function AddTwo(num) {
  return num + 2;
}
global.AddTwo = AddTwo;
```
Entonces, la función anterior puede ser invocada desde un complemento nativo usando el siguiente código:

```C [C]
// Obtener la función llamada "AddTwo" en el objeto global
napi_value global, add_two, arg;
napi_status status = napi_get_global(env, &global);
if (status != napi_ok) return;

status = napi_get_named_property(env, global, "AddTwo", &add_two);
if (status != napi_ok) return;

// const arg = 1337
status = napi_create_int32(env, 1337, &arg);
if (status != napi_ok) return;

napi_value* argv = &arg;
size_t argc = 1;

// AddTwo(arg);
napi_value return_val;
status = napi_call_function(env, global, add_two, argc, argv, &return_val);
if (status != napi_ok) return;

// Convertir el resultado de nuevo a un tipo nativo
int32_t result;
status = napi_get_value_int32(env, return_val, &result);
if (status != napi_ok) return;
```

### `napi_create_function` {#napi_create_function}

**Agregado en: v8.0.0**

**Versión de N-API: 1**

```C [C]
napi_status napi_create_function(napi_env env,
                                 const char* utf8name,
                                 size_t length,
                                 napi_callback cb,
                                 void* data,
                                 napi_value* result);
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] utf8Name`: Nombre opcional de la función codificado como UTF8. Esto es visible dentro de JavaScript como la propiedad `name` del nuevo objeto de función.
- `[in] length`: La longitud del `utf8name` en bytes, o `NAPI_AUTO_LENGTH` si está terminado en nulo.
- `[in] cb`: La función nativa que debe llamarse cuando se invoca este objeto de función. [`napi_callback`](/es/nodejs/api/n-api#napi_callback) proporciona más detalles.
- `[in] data`: Contexto de datos proporcionado por el usuario. Esto se pasará de nuevo a la función cuando se invoque más tarde.
- `[out] result`: `napi_value` que representa el objeto de función de JavaScript para la función recién creada.

Devuelve `napi_ok` si la API tuvo éxito.

Esta API permite a un autor de complementos crear un objeto de función en código nativo. Este es el mecanismo principal para permitir llamar *al* código nativo del complemento *desde* JavaScript.

La función recién creada no es automáticamente visible desde el script después de esta llamada. En cambio, una propiedad debe establecerse explícitamente en cualquier objeto que sea visible para JavaScript, para que la función sea accesible desde el script.

Para exponer una función como parte de las exportaciones del módulo del complemento, establezca la función recién creada en el objeto de exportaciones. Un módulo de muestra podría verse de la siguiente manera:

```C [C]
napi_value SayHello(napi_env env, napi_callback_info info) {
  printf("Hola\n");
  return NULL;
}

napi_value Init(napi_env env, napi_value exports) {
  napi_status status;

  napi_value fn;
  status = napi_create_function(env, NULL, 0, SayHello, NULL, &fn);
  if (status != napi_ok) return NULL;

  status = napi_set_named_property(env, exports, "sayHello", fn);
  if (status != napi_ok) return NULL;

  return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)
```
Dado el código anterior, el complemento se puede usar desde JavaScript de la siguiente manera:

```js [ESM]
const myaddon = require('./addon');
myaddon.sayHello();
```
La cadena pasada a `require()` es el nombre del objetivo en `binding.gyp` responsable de crear el archivo `.node`.

Cualquier dato que no sea `NULL` que se pase a esta API a través del parámetro `data` puede asociarse con la función JavaScript resultante (que se devuelve en el parámetro `result`) y liberarse siempre que la función sea recogida por el recolector de basura pasando tanto la función JavaScript como los datos a [`napi_add_finalizer`](/es/nodejs/api/n-api#napi_add_finalizer).

Las `Function`s de JavaScript se describen en la [Sección 19.2](https://tc39.github.io/ecma262/#sec-function-objects) de la Especificación del Lenguaje ECMAScript.


### `napi_get_cb_info` {#napi_get_cb_info}

**Agregado en: v8.0.0**

**Versión N-API: 1**

```C [C]
napi_status napi_get_cb_info(napi_env env,
                             napi_callback_info cbinfo,
                             size_t* argc,
                             napi_value* argv,
                             napi_value* thisArg,
                             void** data)
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] cbinfo`: La información de devolución de llamada que se pasa a la función de devolución de llamada.
- `[in-out] argc`: Especifica la longitud del arreglo `argv` proporcionado y recibe el conteo real de argumentos. `argc` puede ser opcionalmente ignorado pasando `NULL`.
- `[out] argv`: Arreglo C de `napi_value`s al cual los argumentos serán copiados. Si hay más argumentos que el conteo proporcionado, solo se copia el número solicitado de argumentos. Si se proporcionan menos argumentos de los reclamados, el resto de `argv` se llena con valores `napi_value` que representan `undefined`. `argv` puede ser opcionalmente ignorado pasando `NULL`.
- `[out] thisArg`: Recibe el argumento JavaScript `this` para la llamada. `thisArg` puede ser opcionalmente ignorado pasando `NULL`.
- `[out] data`: Recibe el puntero de datos para la devolución de llamada. `data` puede ser opcionalmente ignorado pasando `NULL`.

Regresa `napi_ok` si la API tuvo éxito.

Este método se utiliza dentro de una función de devolución de llamada para recuperar detalles sobre la llamada, como los argumentos y el puntero `this` de una información de devolución de llamada dada.

### `napi_get_new_target` {#napi_get_new_target}

**Agregado en: v8.6.0**

**Versión N-API: 1**

```C [C]
napi_status napi_get_new_target(napi_env env,
                                napi_callback_info cbinfo,
                                napi_value* result)
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] cbinfo`: La información de devolución de llamada que se pasa a la función de devolución de llamada.
- `[out] result`: El `new.target` de la llamada al constructor.

Regresa `napi_ok` si la API tuvo éxito.

Esta API regresa el `new.target` de la llamada al constructor. Si la devolución de llamada actual no es una llamada al constructor, el resultado es `NULL`.


### `napi_new_instance` {#napi_new_instance}

**Agregado en: v8.0.0**

**Versión de N-API: 1**

```C [C]
napi_status napi_new_instance(napi_env env,
                              napi_value cons,
                              size_t argc,
                              napi_value* argv,
                              napi_value* result)
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] cons`: `napi_value` que representa la función JavaScript que se invocará como constructor.
- `[in] argc`: El recuento de elementos en la matriz `argv`.
- `[in] argv`: Matriz de valores de JavaScript como `napi_value` que representa los argumentos para el constructor. Si `argc` es cero, este parámetro puede omitirse pasando `NULL`.
- `[out] result`: `napi_value` que representa el objeto JavaScript devuelto, que en este caso es el objeto construido.

Este método se utiliza para instanciar un nuevo valor de JavaScript utilizando un `napi_value` dado que representa el constructor para el objeto. Por ejemplo, considere el siguiente fragmento:

```js [ESM]
function MyObject(param) {
  this.param = param;
}

const arg = 'hello';
const value = new MyObject(arg);
```
Lo siguiente se puede aproximar en Node-API utilizando el siguiente fragmento:

```C [C]
// Obtener la función constructora MyObject
napi_value global, constructor, arg, value;
napi_status status = napi_get_global(env, &global);
if (status != napi_ok) return;

status = napi_get_named_property(env, global, "MyObject", &constructor);
if (status != napi_ok) return;

// const arg = "hello"
status = napi_create_string_utf8(env, "hello", NAPI_AUTO_LENGTH, &arg);
if (status != napi_ok) return;

napi_value* argv = &arg;
size_t argc = 1;

// const value = new MyObject(arg)
status = napi_new_instance(env, constructor, argc, argv, &value);
```
Devuelve `napi_ok` si la API se realizó correctamente.

## Ajuste de objetos {#object-wrap}

Node-API ofrece una forma de "ajustar" clases e instancias de C++ para que el constructor y los métodos de la clase se puedan llamar desde JavaScript.

Para los objetos ajustados, puede ser difícil distinguir entre una función llamada en un prototipo de clase y una función llamada en una instancia de una clase. Un patrón común que se utiliza para abordar este problema es guardar una referencia persistente al constructor de la clase para posteriores comprobaciones de `instanceof`.

```C [C]
napi_value MyClass_constructor = NULL;
status = napi_get_reference_value(env, MyClass::es_constructor, &MyClass_constructor);
assert(napi_ok == status);
bool is_instance = false;
status = napi_instanceof(env, es_this, MyClass_constructor, &is_instance);
assert(napi_ok == status);
if (is_instance) {
  // napi_unwrap() ...
} else {
  // de lo contrario...
}
```
La referencia debe liberarse una vez que ya no sea necesaria.

Hay ocasiones en las que `napi_instanceof()` es insuficiente para garantizar que un objeto JavaScript sea un ajuste para un determinado tipo nativo. Este es el caso especialmente cuando los objetos JavaScript ajustados se vuelven a pasar al complemento a través de métodos estáticos en lugar de como el valor `this` de los métodos de prototipo. En tales casos, existe la posibilidad de que se desempaqueten incorrectamente.

```js [ESM]
const myAddon = require('./build/Release/my_addon.node');

// `openDatabase()` devuelve un objeto JavaScript que ajusta un identificador
// de base de datos nativa.
const dbHandle = myAddon.openDatabase();

// `query()` devuelve un objeto JavaScript que ajusta un identificador de consulta
// nativa.
const queryHandle = myAddon.query(dbHandle, '¡Dame TODAS las cosas!');

// Hay un error accidental en la línea siguiente. El primer parámetro para
// `myAddon.queryHasRecords()` debería ser el identificador de base de datos
// (`dbHandle`), no el identificador de consulta (`query`), por lo que la
// condición correcta para el bucle while debería ser
//
// myAddon.queryHasRecords(dbHandle, queryHandle)
//
while (myAddon.queryHasRecords(queryHandle, dbHandle)) {
  // recuperar registros
}
```
En el ejemplo anterior, `myAddon.queryHasRecords()` es un método que acepta dos argumentos. El primero es un identificador de base de datos y el segundo es un identificador de consulta. Internamente, desempaqueta el primer argumento y convierte el puntero resultante en un identificador de base de datos nativo. Luego desempaqueta el segundo argumento y convierte el puntero resultante en un identificador de consulta. Si los argumentos se pasan en el orden incorrecto, las conversiones funcionarán; sin embargo, existe una buena posibilidad de que la operación de base de datos subyacente falle o incluso cause un acceso a memoria no válido.

Para garantizar que el puntero recuperado del primer argumento sea de hecho un puntero a un identificador de base de datos y, de manera similar, que el puntero recuperado del segundo argumento sea de hecho un puntero a un identificador de consulta, la implementación de `queryHasRecords()` tiene que realizar una validación de tipo. Conservar el constructor de la clase JavaScript a partir del cual se instanció el identificador de la base de datos y el constructor a partir del cual se instanció el identificador de la consulta en `napi_ref`s puede ayudar, porque `napi_instanceof()` se puede usar para garantizar que las instancias pasadas a `queryHashRecords()` sean de hecho del tipo correcto.

Desafortunadamente, `napi_instanceof()` no protege contra la manipulación del prototipo. Por ejemplo, el prototipo de la instancia del identificador de la base de datos se puede establecer en el prototipo del constructor para las instancias del identificador de la consulta. En este caso, la instancia del identificador de la base de datos puede aparecer como una instancia del identificador de la consulta, y pasará la prueba `napi_instanceof()` para una instancia del identificador de la consulta, mientras que aún contiene un puntero a un identificador de la base de datos.

Con este fin, Node-API proporciona capacidades de etiquetado de tipo.

Una etiqueta de tipo es un entero de 128 bits único para el complemento. Node-API proporciona la estructura `napi_type_tag` para almacenar una etiqueta de tipo. Cuando dicho valor se pasa junto con un objeto JavaScript o [externo](/es/nodejs/api/n-api#napi_create_external) almacenado en un `napi_value` a `napi_type_tag_object()`, el objeto JavaScript se "marcará" con la etiqueta de tipo. La "marca" es invisible en el lado de JavaScript. Cuando un objeto JavaScript llega a un enlace nativo, se puede usar `napi_check_object_type_tag()` junto con la etiqueta de tipo original para determinar si el objeto JavaScript se "marcó" previamente con la etiqueta de tipo. Esto crea una capacidad de verificación de tipo de mayor fidelidad que la que puede proporcionar `napi_instanceof()`, porque tal etiquetado de tipo sobrevive a la manipulación del prototipo y la descarga/recarga del complemento.

Continuando con el ejemplo anterior, la siguiente implementación de complemento de esqueleto ilustra el uso de `napi_type_tag_object()` y `napi_check_object_type_tag()`.

```C [C]
// Este valor es la etiqueta de tipo para un identificador de base de datos. El comando
//
//   uuidgen | sed -r -e 's/-//g' -e 's/(.{16})(.*)/0x\1, 0x\2/'
//
// se puede utilizar para obtener los dos valores con los que inicializar la estructura.
static const napi_type_tag DatabaseHandleTypeTag = {
  0x1edf75a38336451d, 0xa5ed9ce2e4c00c38
};

// Este valor es la etiqueta de tipo para un identificador de consulta.
static const napi_type_tag QueryHandleTypeTag = {
  0x9c73317f9fad44a3, 0x93c3920bf3b0ad6a
};

static napi_value
openDatabase(napi_env env, napi_callback_info info) {
  napi_status status;
  napi_value result;

  // Realizar la acción subyacente que resulta en un identificador de base de datos.
  DatabaseHandle* dbHandle = open_database();

  // Crear un objeto JS nuevo y vacío.
  status = napi_create_object(env, &result);
  if (status != napi_ok) return NULL;

  // Etiquetar el objeto para indicar que contiene un puntero a un `DatabaseHandle`.
  status = napi_type_tag_object(env, result, &DatabaseHandleTypeTag);
  if (status != napi_ok) return NULL;

  // Almacenar el puntero a la estructura `DatabaseHandle` dentro del objeto JS.
  status = napi_wrap(env, result, dbHandle, NULL, NULL, NULL);
  if (status != napi_ok) return NULL;

  return result;
}

// Más tarde, cuando recibamos un objeto JavaScript que pretenda ser un identificador
// de base de datos, podemos usar `napi_check_object_type_tag()` para garantizar
// que sea de hecho tal identificador.

static napi_value
query(napi_env env, napi_callback_info info) {
  napi_status status;
  size_t argc = 2;
  napi_value argv[2];
  bool is_db_handle;

  status = napi_get_cb_info(env, info, &argc, argv, NULL, NULL);
  if (status != napi_ok) return NULL;

  // Comprobar que el objeto pasado como el primer parámetro tiene la etiqueta
  // aplicada anteriormente.
  status = napi_check_object_type_tag(env,
                                      argv[0],
                                      &DatabaseHandleTypeTag,
                                      &is_db_handle);
  if (status != napi_ok) return NULL;

  // Lanzar un `TypeError` si no lo tiene.
  if (!is_db_handle) {
    // Lanzar un TypeError.
    return NULL;
  }
}
```

### `napi_define_class` {#napi_define_class}

**Añadido en: v8.0.0**

**Versión de N-API: 1**

```C [C]
napi_status napi_define_class(napi_env env,
                              const char* utf8name,
                              size_t length,
                              napi_callback constructor,
                              void* data,
                              size_t property_count,
                              const napi_property_descriptor* properties,
                              napi_value* result);
```
- `[in] env`: El entorno bajo el que se invoca la API.
- `[in] utf8name`: Nombre de la función constructora de JavaScript. Por claridad, se recomienda usar el nombre de la clase C++ al envolver una clase C++.
- `[in] length`: La longitud de `utf8name` en bytes, o `NAPI_AUTO_LENGTH` si está terminado en nulo.
- `[in] constructor`: Función de callback que gestiona la construcción de instancias de la clase. Al envolver una clase C++, este método debe ser un miembro estático con la firma [`napi_callback`](/es/nodejs/api/n-api#napi_callback). No se puede usar un constructor de clase C++. [`napi_callback`](/es/nodejs/api/n-api#napi_callback) proporciona más detalles.
- `[in] data`: Datos opcionales que se pasarán al callback del constructor como la propiedad `data` de la información del callback.
- `[in] property_count`: Número de elementos en el argumento del array `properties`.
- `[in] properties`: Array de descriptores de propiedad que describen las propiedades de datos estáticas y de instancia, los accesores y los métodos en la clase. Consulte `napi_property_descriptor`.
- `[out] result`: Un `napi_value` que representa la función constructora para la clase.

Devuelve `napi_ok` si la API tuvo éxito.

Define una clase de JavaScript, incluyendo:

- Una función constructora de JavaScript que tiene el nombre de la clase. Al envolver una clase C++ correspondiente, el callback pasado a través de `constructor` se puede usar para instanciar una nueva instancia de clase C++, que luego se puede colocar dentro de la instancia de objeto de JavaScript que se está construyendo usando [`napi_wrap`](/es/nodejs/api/n-api#napi_wrap).
- Propiedades en la función constructora cuya implementación puede llamar a las propiedades de datos, los accesores y los métodos *estáticos* correspondientes de la clase C++ (definidos por descriptores de propiedad con el atributo `napi_static`).
- Propiedades en el objeto `prototype` de la función constructora. Al envolver una clase C++, las propiedades de datos, los accesores y los métodos *no estáticos* de la clase C++ se pueden llamar desde las funciones estáticas dadas en los descriptores de propiedad sin el atributo `napi_static` después de recuperar la instancia de clase C++ colocada dentro de la instancia de objeto de JavaScript usando [`napi_unwrap`](/es/nodejs/api/n-api#napi_unwrap).

Al envolver una clase C++, el callback del constructor C++ pasado a través de `constructor` debe ser un método estático en la clase que llama al constructor de clase real, luego envuelve la nueva instancia C++ en un objeto JavaScript y devuelve el objeto contenedor. Consulte [`napi_wrap`](/es/nodejs/api/n-api#napi_wrap) para obtener más detalles.

La función constructora de JavaScript devuelta de [`napi_define_class`](/es/nodejs/api/n-api#napi_define_class) a menudo se guarda y se usa más tarde para construir nuevas instancias de la clase desde código nativo, y/o para verificar si los valores proporcionados son instancias de la clase. En ese caso, para evitar que el valor de la función sea recolectado por el recolector de basura, se puede crear una referencia persistente fuerte a la misma usando [`napi_create_reference`](/es/nodejs/api/n-api#napi_create_reference), asegurando que el recuento de referencias se mantenga \>= 1.

Cualquier dato no `NULL` que se pase a esta API a través del parámetro `data` o a través del campo `data` de los elementos del array `napi_property_descriptor` se puede asociar con el constructor de JavaScript resultante (que se devuelve en el parámetro `result`) y liberarse cada vez que el recolector de basura recolecta la clase pasando tanto la función JavaScript como los datos a [`napi_add_finalizer`](/es/nodejs/api/n-api#napi_add_finalizer).


### `napi_wrap` {#napi_wrap}

**Agregado en: v8.0.0**

**Versión de N-API: 1**

```C [C]
napi_status napi_wrap(napi_env env,
                      napi_value js_object,
                      void* native_object,
                      napi_finalize finalize_cb,
                      void* finalize_hint,
                      napi_ref* result);
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] js_object`: El objeto JavaScript que será el contenedor del objeto nativo.
- `[in] native_object`: La instancia nativa que se encapsulará en el objeto JavaScript.
- `[in] finalize_cb`: Callback nativo opcional que se puede utilizar para liberar la instancia nativa cuando el objeto JavaScript ha sido recolectado por el recolector de basura. [`napi_finalize`](/es/nodejs/api/n-api#napi_finalize) proporciona más detalles.
- `[in] finalize_hint`: Sugerencia contextual opcional que se pasa al callback de finalización.
- `[out] result`: Referencia opcional al objeto envuelto.

Devuelve `napi_ok` si la API tuvo éxito.

Envuelve una instancia nativa en un objeto JavaScript. La instancia nativa se puede recuperar posteriormente usando `napi_unwrap()`.

Cuando el código JavaScript invoca un constructor para una clase que se definió usando `napi_define_class()`, se invoca el `napi_callback` para el constructor. Después de construir una instancia de la clase nativa, el callback debe llamar a `napi_wrap()` para envolver la instancia recién construida en el objeto JavaScript ya creado que es el argumento `this` al callback del constructor. (Ese objeto `this` se creó a partir del `prototype` de la función constructora, por lo que ya tiene definiciones de todas las propiedades y métodos de la instancia).

Normalmente, al envolver una instancia de clase, se debe proporcionar un callback de finalización que simplemente elimine la instancia nativa que se recibe como argumento `data` al callback de finalización.

La referencia opcional devuelta es inicialmente una referencia débil, lo que significa que tiene un conteo de referencia de 0. Normalmente, este conteo de referencia se incrementaría temporalmente durante las operaciones asíncronas que requieren que la instancia siga siendo válida.

*Precaución*: La referencia opcional devuelta (si se obtiene) debe eliminarse mediante [`napi_delete_reference`](/es/nodejs/api/n-api#napi_delete_reference) SÓLO en respuesta a la invocación del callback de finalización. Si se elimina antes de eso, entonces es posible que el callback de finalización nunca se invoque. Por lo tanto, al obtener una referencia, también se requiere un callback de finalización para permitir la eliminación correcta de la referencia.

Los callbacks de finalización pueden diferirse, dejando una ventana donde el objeto ha sido recolectado por el recolector de basura (y la referencia débil no es válida) pero el finalizador aún no ha sido llamado. Cuando se utiliza `napi_get_reference_value()` en referencias débiles devueltas por `napi_wrap()`, aún debe manejar un resultado vacío.

Llamar a `napi_wrap()` una segunda vez en un objeto devolverá un error. Para asociar otra instancia nativa con el objeto, use `napi_remove_wrap()` primero.


### `napi_unwrap` {#napi_unwrap}

**Añadido en: v8.0.0**

**Versión N-API: 1**

```C [C]
napi_status napi_unwrap(napi_env env,
                        napi_value js_object,
                        void** result);
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] js_object`: El objeto asociado con la instancia nativa.
- `[out] result`: Puntero a la instancia nativa envuelta.

Devuelve `napi_ok` si la API tuvo éxito.

Recupera una instancia nativa que fue previamente envuelta en un objeto JavaScript usando `napi_wrap()`.

Cuando el código JavaScript invoca un método o un accesor de propiedad en la clase, se invoca el `napi_callback` correspondiente. Si la devolución de llamada es para un método o accesor de instancia, entonces el argumento `this` para la devolución de llamada es el objeto contenedor; la instancia C++ envuelta que es el objetivo de la llamada se puede obtener llamando a `napi_unwrap()` en el objeto contenedor.

### `napi_remove_wrap` {#napi_remove_wrap}

**Añadido en: v8.5.0**

**Versión N-API: 1**

```C [C]
napi_status napi_remove_wrap(napi_env env,
                             napi_value js_object,
                             void** result);
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] js_object`: El objeto asociado con la instancia nativa.
- `[out] result`: Puntero a la instancia nativa envuelta.

Devuelve `napi_ok` si la API tuvo éxito.

Recupera una instancia nativa que fue previamente envuelta en el objeto JavaScript `js_object` usando `napi_wrap()` y elimina la envoltura. Si una devolución de llamada de finalización fue asociada con la envoltura, ya no será llamada cuando el objeto JavaScript sea recolectado como basura.

### `napi_type_tag_object` {#napi_type_tag_object}

**Añadido en: v14.8.0, v12.19.0**

**Versión N-API: 8**

```C [C]
napi_status napi_type_tag_object(napi_env env,
                                 napi_value js_object,
                                 const napi_type_tag* type_tag);
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] js_object`: El objeto JavaScript o [externo](/es/nodejs/api/n-api#napi_create_external) a ser marcado.
- `[in] type_tag`: La etiqueta con la que se marcará el objeto.

Devuelve `napi_ok` si la API tuvo éxito.

Asocia el valor del puntero `type_tag` con el objeto JavaScript o [externo](/es/nodejs/api/n-api#napi_create_external). `napi_check_object_type_tag()` puede ser usado entonces para comparar la etiqueta que fue adjuntada al objeto con una propiedad del addon para asegurar que el objeto tiene el tipo correcto.

Si el objeto ya tiene una etiqueta de tipo asociada, esta API devolverá `napi_invalid_arg`.


### `napi_check_object_type_tag` {#napi_check_object_type_tag}

**Agregado en: v14.8.0, v12.19.0**

**Versión de N-API: 8**

```C [C]
napi_status napi_check_object_type_tag(napi_env env,
                                       napi_value js_object,
                                       const napi_type_tag* type_tag,
                                       bool* result);
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] js_object`: El objeto JavaScript o [externo](/es/nodejs/api/n-api#napi_create_external) cuya etiqueta de tipo se va a examinar.
- `[in] type_tag`: La etiqueta con la que se comparará cualquier etiqueta encontrada en el objeto.
- `[out] result`: Indica si la etiqueta de tipo dada coincide con la etiqueta de tipo del objeto. También se devuelve `false` si no se encuentra ninguna etiqueta de tipo en el objeto.

Devuelve `napi_ok` si la API tuvo éxito.

Compara el puntero dado como `type_tag` con cualquiera que se pueda encontrar en `js_object`. Si no se encuentra ninguna etiqueta en `js_object` o, si se encuentra una etiqueta pero no coincide con `type_tag`, entonces `result` se establece en `false`. Si se encuentra una etiqueta y coincide con `type_tag`, entonces `result` se establece en `true`.

### `napi_add_finalizer` {#napi_add_finalizer}

**Agregado en: v8.0.0**

**Versión de N-API: 5**

```C [C]
napi_status napi_add_finalizer(napi_env env,
                               napi_value js_object,
                               void* finalize_data,
                               node_api_basic_finalize finalize_cb,
                               void* finalize_hint,
                               napi_ref* result);
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] js_object`: El objeto JavaScript al que se adjuntarán los datos nativos.
- `[in] finalize_data`: Datos opcionales que se pasarán a `finalize_cb`.
- `[in] finalize_cb`: Callback nativo que se utilizará para liberar los datos nativos cuando el objeto JavaScript haya sido recolectado por el recolector de basura. [`napi_finalize`](/es/nodejs/api/n-api#napi_finalize) proporciona más detalles.
- `[in] finalize_hint`: Sugerencia contextual opcional que se pasa al callback de finalización.
- `[out] result`: Referencia opcional al objeto JavaScript.

Devuelve `napi_ok` si la API tuvo éxito.

Agrega un callback `napi_finalize` que se llamará cuando el objeto JavaScript en `js_object` haya sido recolectado por el recolector de basura.

Esta API se puede llamar varias veces en un solo objeto JavaScript.

*Precaución*: La referencia opcional devuelta (si se obtiene) debe eliminarse a través de [`napi_delete_reference`](/es/nodejs/api/n-api#napi_delete_reference) ÚNICAMENTE en respuesta a la invocación del callback de finalización. Si se elimina antes, es posible que el callback de finalización nunca se invoque. Por lo tanto, al obtener una referencia, también se requiere un callback de finalización para permitir la eliminación correcta de la referencia.


#### `node_api_post_finalizer` {#node_api_post_finalizer}

**Añadido en: v21.0.0, v20.10.0, v18.19.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

```C [C]
napi_status node_api_post_finalizer(node_api_basic_env env,
                                    napi_finalize finalize_cb,
                                    void* finalize_data,
                                    void* finalize_hint);
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] finalize_cb`: Callback nativo que se utilizará para liberar los datos nativos cuando el objeto JavaScript haya sido recolectado por el recolector de basura. [`napi_finalize`](/es/nodejs/api/n-api#napi_finalize) proporciona más detalles.
- `[in] finalize_data`: Datos opcionales que se pasarán a `finalize_cb`.
- `[in] finalize_hint`: Sugerencia contextual opcional que se pasa al callback de finalización.

Devuelve `napi_ok` si la API tuvo éxito.

Programa una callback `napi_finalize` para que se llame asíncronamente en el bucle de eventos.

Normalmente, los finalizadores se llaman mientras el GC (recolector de basura) recolecta objetos. En ese momento, llamar a cualquier Node-API que pueda causar cambios en el estado del GC estará desactivado y hará que Node.js se bloquee.

`node_api_post_finalizer` ayuda a solucionar esta limitación permitiendo que el complemento difiera las llamadas a dichas Node-API a un momento en el tiempo fuera de la finalización del GC.

## Operaciones asíncronas simples {#simple-asynchronous-operations}

Los módulos de complementos a menudo necesitan aprovechar los ayudantes asíncronos de libuv como parte de su implementación. Esto les permite programar el trabajo para que se ejecute de forma asíncrona, de modo que sus métodos puedan regresar antes de que se complete el trabajo. Esto les permite evitar el bloqueo de la ejecución general de la aplicación Node.js.

Node-API proporciona una interfaz ABI-estable para estas funciones de soporte que cubre los casos de uso asíncronos más comunes.

Node-API define la estructura `napi_async_work` que se utiliza para gestionar los workers asíncronos. Las instancias se crean/eliminan con [`napi_create_async_work`](/es/nodejs/api/n-api#napi_create_async_work) y [`napi_delete_async_work`](/es/nodejs/api/n-api#napi_delete_async_work).

Los callbacks `execute` y `complete` son funciones que se invocarán cuando el ejecutor esté listo para ejecutarse y cuando complete su tarea, respectivamente.

La función `execute` debe evitar realizar cualquier llamada a Node-API que pueda resultar en la ejecución de JavaScript o la interacción con objetos JavaScript. Muy a menudo, cualquier código que necesite realizar llamadas a Node-API debe realizarse en el callback `complete` en su lugar. Evite usar el parámetro `napi_env` en el callback de ejecución, ya que probablemente ejecutará JavaScript.

Estas funciones implementan las siguientes interfaces:

```C [C]
typedef void (*napi_async_execute_callback)(napi_env env,
                                            void* data);
typedef void (*napi_async_complete_callback)(napi_env env,
                                             napi_status status,
                                             void* data);
```
Cuando se invocan estos métodos, el parámetro `data` pasado será los datos `void*` proporcionados por el complemento que se pasaron a la llamada `napi_create_async_work`.

Una vez creado, el worker asíncrono se puede poner en cola para su ejecución utilizando la función [`napi_queue_async_work`](/es/nodejs/api/n-api#napi_queue_async_work):

```C [C]
napi_status napi_queue_async_work(node_api_basic_env env,
                                  napi_async_work work);
```
[`napi_cancel_async_work`](/es/nodejs/api/n-api#napi_cancel_async_work) se puede utilizar si es necesario cancelar el trabajo antes de que haya comenzado la ejecución.

Después de llamar a [`napi_cancel_async_work`](/es/nodejs/api/n-api#napi_cancel_async_work), se invocará el callback `complete` con un valor de estado de `napi_cancelled`. El trabajo no debe eliminarse antes de la invocación del callback `complete`, incluso cuando se canceló.


### `napi_create_async_work` {#napi_create_async_work}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v8.6.0 | Se agregaron los parámetros `async_resource` y `async_resource_name`. |
| v8.0.0 | Agregado en: v8.0.0 |
:::

**Versión N-API: 1**

```C [C]
napi_status napi_create_async_work(napi_env env,
                                   napi_value async_resource,
                                   napi_value async_resource_name,
                                   napi_async_execute_callback execute,
                                   napi_async_complete_callback complete,
                                   void* data,
                                   napi_async_work* result);
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] async_resource`: Un objeto opcional asociado con el trabajo asíncrono que se pasará a posibles `async_hooks` [`init` hooks](/es/nodejs/api/async_hooks#initasyncid-type-triggerasyncid-resource).
- `[in] async_resource_name`: Identificador para el tipo de recurso que se proporciona para la información de diagnóstico expuesta por la API `async_hooks`.
- `[in] execute`: La función nativa que debe llamarse para ejecutar la lógica de forma asíncrona. La función dada se llama desde un hilo del grupo de trabajadores y puede ejecutarse en paralelo con el hilo principal del bucle de eventos.
- `[in] complete`: La función nativa que se llamará cuando se complete o cancele la lógica asíncrona. La función dada se llama desde el hilo principal del bucle de eventos. [`napi_async_complete_callback`](/es/nodejs/api/n-api#napi_async_complete_callback) proporciona más detalles.
- `[in] data`: Contexto de datos proporcionado por el usuario. Esto se pasará de nuevo a las funciones de ejecución y finalización.
- `[out] result`: `napi_async_work*` que es el manejador del trabajo asíncrono recién creado.

Devuelve `napi_ok` si la API tuvo éxito.

Esta API asigna un objeto de trabajo que se utiliza para ejecutar la lógica de forma asíncrona. Debe liberarse utilizando [`napi_delete_async_work`](/es/nodejs/api/n-api#napi_delete_async_work) una vez que el trabajo ya no sea necesario.

`async_resource_name` debe ser una cadena terminada en nulo y codificada en UTF-8.

El identificador `async_resource_name` lo proporciona el usuario y debe ser representativo del tipo de trabajo asíncrono que se está realizando. También se recomienda aplicar espacios de nombres al identificador, por ejemplo, incluyendo el nombre del módulo. Consulte la [`async_hooks` documentación](/es/nodejs/api/async_hooks#type) para obtener más información.


### `napi_delete_async_work` {#napi_delete_async_work}

**Añadido en: v8.0.0**

**Versión de N-API: 1**

```C [C]
napi_status napi_delete_async_work(napi_env env,
                                   napi_async_work work);
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] work`: El identificador devuelto por la llamada a `napi_create_async_work`.

Devuelve `napi_ok` si la API tuvo éxito.

Esta API libera un objeto de trabajo previamente asignado.

Esta API se puede llamar incluso si hay una excepción de JavaScript pendiente.

### `napi_queue_async_work` {#napi_queue_async_work}

**Añadido en: v8.0.0**

**Versión de N-API: 1**

```C [C]
napi_status napi_queue_async_work(node_api_basic_env env,
                                  napi_async_work work);
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] work`: El identificador devuelto por la llamada a `napi_create_async_work`.

Devuelve `napi_ok` si la API tuvo éxito.

Esta API solicita que el trabajo previamente asignado se programe para su ejecución. Una vez que regresa con éxito, esta API no se debe volver a llamar con el mismo elemento `napi_async_work` o el resultado no estará definido.

### `napi_cancel_async_work` {#napi_cancel_async_work}

**Añadido en: v8.0.0**

**Versión de N-API: 1**

```C [C]
napi_status napi_cancel_async_work(node_api_basic_env env,
                                   napi_async_work work);
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] work`: El identificador devuelto por la llamada a `napi_create_async_work`.

Devuelve `napi_ok` si la API tuvo éxito.

Esta API cancela el trabajo en cola si aún no se ha iniciado. Si ya ha comenzado a ejecutarse, no se puede cancelar y se devolverá `napi_generic_failure`. Si tiene éxito, se invocará la devolución de llamada `complete` con un valor de estado de `napi_cancelled`. El trabajo no debe eliminarse antes de la invocación de la devolución de llamada `complete`, incluso si se ha cancelado con éxito.

Esta API se puede llamar incluso si hay una excepción de JavaScript pendiente.

## Operaciones asíncronas personalizadas {#custom-asynchronous-operations}

Las API de trabajo asíncronas simples anteriores pueden no ser apropiadas para cada escenario. Al usar cualquier otro mecanismo asíncrono, las siguientes API son necesarias para garantizar que el tiempo de ejecución rastree correctamente una operación asíncrona.


### `napi_async_init` {#napi_async_init}

**Añadido en: v8.6.0**

**Versión N-API: 1**

```C [C]
napi_status napi_async_init(napi_env env,
                            napi_value async_resource,
                            napi_value async_resource_name,
                            napi_async_context* result)
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] async_resource`: Objeto asociado con el trabajo asíncrono que se pasará a los posibles [`init` hooks](/es/nodejs/api/async_hooks#initasyncid-type-triggerasyncid-resource) de `async_hooks` y al que se puede acceder mediante [`async_hooks.executionAsyncResource()`](/es/nodejs/api/async_hooks#async_hooksexecutionasyncresource).
- `[in] async_resource_name`: Identificador para el tipo de recurso que se proporciona para la información de diagnóstico expuesta por la API `async_hooks`.
- `[out] result`: El contexto asíncrono inicializado.

Devuelve `napi_ok` si la API tuvo éxito.

El objeto `async_resource` debe mantenerse activo hasta [`napi_async_destroy`](/es/nodejs/api/n-api#napi_async_destroy) para que la API relacionada con `async_hooks` actúe correctamente. Para conservar la compatibilidad ABI con versiones anteriores, los `napi_async_context` no mantienen la referencia fuerte a los objetos `async_resource` para evitar la introducción de pérdidas de memoria. Sin embargo, si el motor de JavaScript recolecta la basura de `async_resource` antes de que `napi_async_destroy` destruya el `napi_async_context`, llamar a las API relacionadas con `napi_async_context` como [`napi_open_callback_scope`](/es/nodejs/api/n-api#napi_open_callback_scope) y [`napi_make_callback`](/es/nodejs/api/n-api#napi_make_callback) puede causar problemas como la pérdida del contexto asíncrono al usar la API `AsyncLocalStorage`.

Para conservar la compatibilidad ABI con versiones anteriores, pasar `NULL` para `async_resource` no provoca un error. Sin embargo, esto no se recomienda ya que resultará en un comportamiento no deseado con los [`init` hooks](/es/nodejs/api/async_hooks#initasyncid-type-triggerasyncid-resource) de `async_hooks` y `async_hooks.executionAsyncResource()` ya que la implementación subyacente de `async_hooks` ahora requiere el recurso para proporcionar la vinculación entre las devoluciones de llamada asíncronas.


### `napi_async_destroy` {#napi_async_destroy}

**Añadido en: v8.6.0**

**Versión de N-API: 1**

```C [C]
napi_status napi_async_destroy(napi_env env,
                               napi_async_context async_context);
```
- `[in] env`: El entorno bajo el que se invoca la API.
- `[in] async_context`: El contexto asíncrono que se va a destruir.

Devuelve `napi_ok` si la API se ejecutó correctamente.

Esta API puede ser llamada incluso si hay una excepción de JavaScript pendiente.

### `napi_make_callback` {#napi_make_callback}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v8.6.0 | Se añadió el parámetro `async_context`. |
| v8.0.0 | Añadido en: v8.0.0 |
:::

**Versión de N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_make_callback(napi_env env,
                                           napi_async_context async_context,
                                           napi_value recv,
                                           napi_value func,
                                           size_t argc,
                                           const napi_value* argv,
                                           napi_value* result);
```
- `[in] env`: El entorno bajo el que se invoca la API.
- `[in] async_context`: Contexto para la operación asíncrona que invoca la función de retrollamada. Normalmente, este debe ser un valor obtenido previamente de [`napi_async_init`](/es/nodejs/api/n-api#napi_async_init). Para conservar la compatibilidad ABI con versiones anteriores, pasar `NULL` para `async_context` no resulta en un error. Sin embargo, esto resulta en un funcionamiento incorrecto de los ganchos asíncronos. Los problemas potenciales incluyen la pérdida del contexto asíncrono al usar la API `AsyncLocalStorage`.
- `[in] recv`: El valor `this` pasado a la función llamada.
- `[in] func`: `napi_value` representando la función JavaScript que se invocará.
- `[in] argc`: El recuento de elementos en el array `argv`.
- `[in] argv`: Array de valores de JavaScript como `napi_value` representando los argumentos a la función. Si `argc` es cero, este parámetro puede omitirse pasando `NULL`.
- `[out] result`: `napi_value` representando el objeto JavaScript devuelto.

Devuelve `napi_ok` si la API se ejecutó correctamente.

Este método permite que un objeto de función JavaScript sea llamado desde un complemento nativo. Esta API es similar a `napi_call_function`. Sin embargo, se utiliza para llamar *desde* código nativo *de vuelta a* JavaScript *después* de regresar de una operación asíncrona (cuando no hay ningún otro script en la pila). Es un envoltorio bastante simple alrededor de `node::MakeCallback`.

Tenga en cuenta que *no* es necesario utilizar `napi_make_callback` desde dentro de una `napi_async_complete_callback`; en esa situación, el contexto asíncrono de la retrollamada ya se ha configurado, por lo que una llamada directa a `napi_call_function` es suficiente y apropiada. El uso de la función `napi_make_callback` puede ser necesario al implementar un comportamiento asíncrono personalizado que no utiliza `napi_create_async_work`.

Cualquier `process.nextTick` o Promesas programadas en la cola de microtareas por JavaScript durante la retrollamada se ejecutan antes de regresar a C/C++.


### `napi_open_callback_scope` {#napi_open_callback_scope}

**Agregado en: v9.6.0**

**Versión N-API: 3**

```C [C]
NAPI_EXTERN napi_status napi_open_callback_scope(napi_env env,
                                                 napi_value resource_object,
                                                 napi_async_context context,
                                                 napi_callback_scope* result)
```
- `[in] env`: El entorno en el que se invoca la API.
- `[in] resource_object`: Un objeto asociado con el trabajo asíncrono que se pasará a posibles hooks `async_hooks` [`init` hooks](/es/nodejs/api/async_hooks#initasyncid-type-triggerasyncid-resource). Este parámetro ha quedado obsoleto y se ignora en tiempo de ejecución. Use el parámetro `async_resource` en [`napi_async_init`](/es/nodejs/api/n-api#napi_async_init) en su lugar.
- `[in] context`: Contexto para la operación asíncrona que está invocando la devolución de llamada. Este debe ser un valor obtenido previamente de [`napi_async_init`](/es/nodejs/api/n-api#napi_async_init).
- `[out] result`: El alcance recién creado.

Hay casos (por ejemplo, resolver promesas) en los que es necesario tener el equivalente del alcance asociado con una devolución de llamada cuando se realizan ciertas llamadas a la API de Node. Si no hay ningún otro script en la pila, las funciones [`napi_open_callback_scope`](/es/nodejs/api/n-api#napi_open_callback_scope) y [`napi_close_callback_scope`](/es/nodejs/api/n-api#napi_close_callback_scope) se pueden usar para abrir/cerrar el alcance requerido.

### `napi_close_callback_scope` {#napi_close_callback_scope}

**Agregado en: v9.6.0**

**Versión N-API: 3**

```C [C]
NAPI_EXTERN napi_status napi_close_callback_scope(napi_env env,
                                                  napi_callback_scope scope)
```
- `[in] env`: El entorno en el que se invoca la API.
- `[in] scope`: El alcance que se va a cerrar.

Se puede llamar a esta API incluso si hay una excepción de JavaScript pendiente.

## Gestión de versiones {#version-management}

### `napi_get_node_version` {#napi_get_node_version}

**Agregado en: v8.4.0**

**Versión N-API: 1**

```C [C]
typedef struct {
  uint32_t major;
  uint32_t minor;
  uint32_t patch;
  const char* release;
} napi_node_version;

napi_status napi_get_node_version(node_api_basic_env env,
                                  const napi_node_version** version);
```
- `[in] env`: El entorno en el que se invoca la API.
- `[out] version`: Un puntero a la información de la versión para Node.js en sí.

Devuelve `napi_ok` si la API tuvo éxito.

Esta función llena la estructura `version` con la versión mayor, menor y de parche de Node.js que se está ejecutando actualmente, y el campo `release` con el valor de [`process.release.name`](/es/nodejs/api/process#processrelease).

El búfer devuelto se asigna estáticamente y no es necesario liberarlo.


### `napi_get_version` {#napi_get_version}

**Agregado en: v8.0.0**

**Versión N-API: 1**

```C [C]
napi_status napi_get_version(node_api_basic_env env,
                             uint32_t* result);
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[out] result`: La versión más alta de Node-API soportada.

Devuelve `napi_ok` si la API tuvo éxito.

Esta API devuelve la versión más alta de Node-API soportada por el runtime de Node.js. Se planea que Node-API sea aditivo, de modo que las versiones más recientes de Node.js puedan admitir funciones API adicionales. Para permitir que un complemento use una función más reciente cuando se ejecuta con versiones de Node.js que la admiten, al tiempo que proporciona un comportamiento de reserva cuando se ejecuta con versiones de Node.js que no la admiten:

- Llame a `napi_get_version()` para determinar si la API está disponible.
- Si está disponible, cargue dinámicamente un puntero a la función utilizando `uv_dlsym()`.
- Use el puntero cargado dinámicamente para invocar la función.
- Si la función no está disponible, proporcione una implementación alternativa que no use la función.

## Gestión de memoria {#memory-management}

### `napi_adjust_external_memory` {#napi_adjust_external_memory}

**Agregado en: v8.5.0**

**Versión N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_adjust_external_memory(node_api_basic_env env,
                                                    int64_t change_in_bytes,
                                                    int64_t* result);
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] change_in_bytes`: El cambio en la memoria asignada externamente que se mantiene viva mediante objetos de JavaScript.
- `[out] result`: El valor ajustado.

Devuelve `napi_ok` si la API tuvo éxito.

Esta función le da a V8 una indicación de la cantidad de memoria asignada externamente que se mantiene viva mediante objetos de JavaScript (es decir, un objeto de JavaScript que apunta a su propia memoria asignada por un complemento nativo). Registrar la memoria asignada externamente activará las recolecciones de basura globales con más frecuencia de lo que lo haría de otra manera.

## Promesas {#promises}

Node-API proporciona facilidades para crear objetos `Promise` como se describe en la [Sección 25.4](https://tc39.github.io/ecma262/#sec-promise-objects) de la especificación ECMA. Implementa las promesas como un par de objetos. Cuando `napi_create_promise()` crea una promesa, se crea un objeto "diferido" y se devuelve junto con la `Promise`. El objeto diferido está vinculado a la `Promise` creada y es el único medio para resolver o rechazar la `Promise` usando `napi_resolve_deferred()` o `napi_reject_deferred()`. El objeto diferido que crea `napi_create_promise()` es liberado por `napi_resolve_deferred()` o `napi_reject_deferred()`. El objeto `Promise` puede devolverse a JavaScript, donde se puede usar de la forma habitual.

Por ejemplo, para crear una promesa y pasarla a un trabajador asíncrono:

```C [C]
napi_deferred deferred;
napi_value promise;
napi_status status;

// Crear la promesa.
status = napi_create_promise(env, &deferred, &promise);
if (status != napi_ok) return NULL;

// Pasar el diferido a una función que realiza una acción asíncrona.
do_something_asynchronous(deferred);

// Devolver la promesa a JS
return promise;
```
La función anterior `do_something_asynchronous()` realizaría su acción asíncrona y luego resolvería o rechazaría el diferido, concluyendo así la promesa y liberando el diferido:

```C [C]
napi_deferred deferred;
napi_value undefined;
napi_status status;

// Crear un valor con el que concluir el diferido.
status = napi_get_undefined(env, &undefined);
if (status != napi_ok) return NULL;

// Resolver o rechazar la promesa asociada con el diferido dependiendo de
// si la acción asíncrona tuvo éxito.
if (asynchronous_action_succeeded) {
  status = napi_resolve_deferred(env, deferred, undefined);
} else {
  status = napi_reject_deferred(env, deferred, undefined);
}
if (status != napi_ok) return NULL;

// En este punto, el diferido ha sido liberado, por lo que debemos asignarle NULL.
deferred = NULL;
```

### `napi_create_promise` {#napi_create_promise}

**Agregado en: v8.5.0**

**Versión N-API: 1**

```C [C]
napi_status napi_create_promise(napi_env env,
                                napi_deferred* deferred,
                                napi_value* promise);
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[out] deferred`: Un objeto diferido recién creado que luego se puede pasar a `napi_resolve_deferred()` o `napi_reject_deferred()` para resolver o rechazar la promesa asociada, respectivamente.
- `[out] promise`: La promesa de JavaScript asociada con el objeto diferido.

Devuelve `napi_ok` si la API tuvo éxito.

Esta API crea un objeto diferido y una promesa de JavaScript.

### `napi_resolve_deferred` {#napi_resolve_deferred}

**Agregado en: v8.5.0**

**Versión N-API: 1**

```C [C]
napi_status napi_resolve_deferred(napi_env env,
                                  napi_deferred deferred,
                                  napi_value resolution);
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] deferred`: El objeto diferido cuya promesa asociada se va a resolver.
- `[in] resolution`: El valor con el que se resolverá la promesa.

Esta API resuelve una promesa de JavaScript a través del objeto diferido con el que está asociada. Por lo tanto, solo se puede usar para resolver promesas de JavaScript para las cuales el objeto diferido correspondiente esté disponible. Esto significa efectivamente que la promesa debe haber sido creada usando `napi_create_promise()` y el objeto diferido devuelto por esa llamada debe haber sido retenido para poder pasarlo a esta API.

El objeto diferido se libera al finalizar con éxito.

### `napi_reject_deferred` {#napi_reject_deferred}

**Agregado en: v8.5.0**

**Versión N-API: 1**

```C [C]
napi_status napi_reject_deferred(napi_env env,
                                 napi_deferred deferred,
                                 napi_value rejection);
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] deferred`: El objeto diferido cuya promesa asociada se va a resolver.
- `[in] rejection`: El valor con el que se rechazará la promesa.

Esta API rechaza una promesa de JavaScript a través del objeto diferido con el que está asociada. Por lo tanto, solo se puede usar para rechazar promesas de JavaScript para las cuales el objeto diferido correspondiente esté disponible. Esto significa efectivamente que la promesa debe haber sido creada usando `napi_create_promise()` y el objeto diferido devuelto por esa llamada debe haber sido retenido para poder pasarlo a esta API.

El objeto diferido se libera al finalizar con éxito.


### `napi_is_promise` {#napi_is_promise}

**Agregado en: v8.5.0**

**Versión N-API: 1**

```C [C]
napi_status napi_is_promise(napi_env env,
                            napi_value value,
                            bool* is_promise);
```
- `[in] env`: El entorno bajo el que se invoca la API.
- `[in] value`: El valor a examinar.
- `[out] is_promise`: Indicador que señala si `promise` es un objeto promesa nativo (es decir, un objeto promesa creado por el motor subyacente).

## Ejecución de script {#script-execution}

Node-API proporciona una API para ejecutar una cadena que contiene JavaScript utilizando el motor de JavaScript subyacente.

### `napi_run_script` {#napi_run_script}

**Agregado en: v8.5.0**

**Versión N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_run_script(napi_env env,
                                        napi_value script,
                                        napi_value* result);
```
- `[in] env`: El entorno bajo el que se invoca la API.
- `[in] script`: Una cadena de JavaScript que contiene el script a ejecutar.
- `[out] result`: El valor resultante de haber ejecutado el script.

Esta función ejecuta una cadena de código JavaScript y devuelve su resultado con las siguientes salvedades:

- A diferencia de `eval`, esta función no permite que el script acceda al ámbito léxico actual y, por lo tanto, tampoco permite acceder al [ámbito del módulo](/es/nodejs/api/modules#the-module-scope), lo que significa que los pseudo-globales como `require` no estarán disponibles.
- El script puede acceder al [ámbito global](/es/nodejs/api/globals). Las declaraciones de función y `var` en el script se agregarán al objeto [`global`](/es/nodejs/api/globals#global). Las declaraciones de variables hechas usando `let` y `const` serán visibles globalmente, pero no se agregarán al objeto [`global`](/es/nodejs/api/globals#global).
- El valor de `this` es [`global`](/es/nodejs/api/globals#global) dentro del script.

## Bucle de eventos libuv {#libuv-event-loop}

Node-API proporciona una función para obtener el bucle de eventos actual asociado con un `napi_env` específico.

### `napi_get_uv_event_loop` {#napi_get_uv_event_loop}

**Agregado en: v9.3.0, v8.10.0**

**Versión N-API: 2**

```C [C]
NAPI_EXTERN napi_status napi_get_uv_event_loop(node_api_basic_env env,
                                               struct uv_loop_s** loop);
```
- `[in] env`: El entorno bajo el que se invoca la API.
- `[out] loop`: La instancia actual del bucle libuv.

Nota: Si bien libuv ha sido relativamente estable a lo largo del tiempo, no proporciona una garantía de estabilidad de ABI. Se debe evitar el uso de esta función. Su uso puede resultar en un complemento que no funcione en diferentes versiones de Node.js. Las [llamadas de función asíncronas y seguras para subprocesos](/es/nodejs/api/n-api#asynchronous-thread-safe-function-calls) son una alternativa para muchos casos de uso.


## Llamadas asíncronas a funciones seguras para subprocesos {#asynchronous-thread-safe-function-calls}

Normalmente, las funciones de JavaScript solo se pueden llamar desde el subproceso principal de un complemento nativo. Si un complemento crea subprocesos adicionales, las funciones de Node-API que requieren un `napi_env`, `napi_value` o `napi_ref` no deben llamarse desde esos subprocesos.

Cuando un complemento tiene subprocesos adicionales y es necesario invocar funciones de JavaScript en función del procesamiento completado por esos subprocesos, esos subprocesos deben comunicarse con el subproceso principal del complemento para que el subproceso principal pueda invocar la función de JavaScript en su nombre. Las API de funciones seguras para subprocesos brindan una manera fácil de hacer esto.

Estas API proporcionan el tipo `napi_threadsafe_function` así como API para crear, destruir y llamar objetos de este tipo. `napi_create_threadsafe_function()` crea una referencia persistente a un `napi_value` que contiene una función de JavaScript que se puede llamar desde múltiples subprocesos. Las llamadas se realizan de forma asíncrona. Esto significa que los valores con los que se debe llamar a la devolución de llamada de JavaScript se colocarán en una cola y, para cada valor en la cola, eventualmente se realizará una llamada a la función de JavaScript.

Al crear una `napi_threadsafe_function` se puede proporcionar una devolución de llamada `napi_finalize`. Esta devolución de llamada se invocará en el subproceso principal cuando la función segura para subprocesos esté a punto de ser destruida. Recibe el contexto y los datos de finalización proporcionados durante la construcción, y brinda la oportunidad de limpiar después de los subprocesos, por ejemplo, llamando a `uv_thread_join()`. **Aparte del subproceso del bucle principal,
ningún subproceso debe usar la función segura para subprocesos después de que se complete la devolución de llamada de finalización.**

El `context` proporcionado durante la llamada a `napi_create_threadsafe_function()` se puede recuperar desde cualquier subproceso con una llamada a `napi_get_threadsafe_function_context()`.

### Llamar a una función segura para subprocesos {#calling-a-thread-safe-function}

Se puede usar `napi_call_threadsafe_function()` para iniciar una llamada a JavaScript. `napi_call_threadsafe_function()` acepta un parámetro que controla si la API se comporta de forma bloqueante. Si se establece en `napi_tsfn_nonblocking`, la API se comporta de forma no bloqueante, devolviendo `napi_queue_full` si la cola estaba llena, impidiendo que los datos se agreguen correctamente a la cola. Si se establece en `napi_tsfn_blocking`, la API se bloquea hasta que haya espacio disponible en la cola. `napi_call_threadsafe_function()` nunca se bloquea si la función segura para subprocesos se creó con un tamaño máximo de cola de 0.

`napi_call_threadsafe_function()` no debe llamarse con `napi_tsfn_blocking` desde un subproceso de JavaScript, porque, si la cola está llena, puede causar que el subproceso de JavaScript se bloquee.

La llamada real a JavaScript está controlada por la devolución de llamada dada a través del parámetro `call_js_cb`. `call_js_cb` se invoca en el subproceso principal una vez por cada valor que se colocó en la cola mediante una llamada exitosa a `napi_call_threadsafe_function()`. Si no se proporciona tal devolución de llamada, se utilizará una devolución de llamada predeterminada y la llamada resultante de JavaScript no tendrá argumentos. La devolución de llamada `call_js_cb` recibe la función de JavaScript a la que se llamará como un `napi_value` en sus parámetros, así como el puntero de contexto `void*` utilizado al crear la `napi_threadsafe_function` y el siguiente puntero de datos que fue creado por uno de los subprocesos secundarios. Luego, la devolución de llamada puede usar una API como `napi_call_function()` para llamar a JavaScript.

También se puede invocar la devolución de llamada con `env` y `call_js_cb` ambos establecidos en `NULL` para indicar que las llamadas a JavaScript ya no son posibles, mientras que los elementos permanecen en la cola que pueden necesitar ser liberados. Esto normalmente ocurre cuando el proceso de Node.js sale mientras que todavía hay una función segura para subprocesos activa.

No es necesario llamar a JavaScript a través de `napi_make_callback()` porque Node-API ejecuta `call_js_cb` en un contexto apropiado para las devoluciones de llamada.

Se pueden invocar cero o más elementos en cola en cada tick del bucle de eventos. Las aplicaciones no deben depender de un comportamiento específico que no sea el progreso en la invocación de devoluciones de llamada y los eventos se invocarán a medida que avance el tiempo.


### Conteo de referencias de funciones thread-safe {#reference-counting-of-thread-safe-functions}

Se pueden agregar y eliminar hilos de un objeto `napi_threadsafe_function` durante su existencia. Por lo tanto, además de especificar un número inicial de hilos al crear, se puede llamar a `napi_acquire_threadsafe_function` para indicar que un nuevo hilo comenzará a utilizar la función thread-safe. De manera similar, se puede llamar a `napi_release_threadsafe_function` para indicar que un hilo existente dejará de utilizar la función thread-safe.

Los objetos `napi_threadsafe_function` se destruyen cuando cada hilo que usa el objeto ha llamado a `napi_release_threadsafe_function()` o ha recibido un estado de retorno de `napi_closing` en respuesta a una llamada a `napi_call_threadsafe_function`. La cola se vacía antes de que se destruya la `napi_threadsafe_function`. `napi_release_threadsafe_function()` debe ser la última llamada a la API realizada en conjunto con una `napi_threadsafe_function` dada, porque después de que se complete la llamada, no hay garantía de que la `napi_threadsafe_function` todavía esté asignada. Por la misma razón, no utilice una función thread-safe después de recibir un valor de retorno de `napi_closing` en respuesta a una llamada a `napi_call_threadsafe_function`. Los datos asociados con la `napi_threadsafe_function` se pueden liberar en su callback `napi_finalize` que se pasó a `napi_create_threadsafe_function()`. El parámetro `initial_thread_count` de `napi_create_threadsafe_function` marca el número inicial de adquisiciones de las funciones thread-safe, en lugar de llamar a `napi_acquire_threadsafe_function` varias veces en la creación.

Una vez que el número de hilos que utilizan una `napi_threadsafe_function` llega a cero, ningún otro hilo puede comenzar a utilizarla llamando a `napi_acquire_threadsafe_function()`. De hecho, todas las llamadas API posteriores asociadas con ella, excepto `napi_release_threadsafe_function()`, devolverán un valor de error de `napi_closing`.

La función thread-safe se puede "abortar" dando un valor de `napi_tsfn_abort` a `napi_release_threadsafe_function()`. Esto hará que todas las API posteriores asociadas con la función thread-safe, excepto `napi_release_threadsafe_function()`, devuelvan `napi_closing` incluso antes de que su recuento de referencias llegue a cero. En particular, `napi_call_threadsafe_function()` devolverá `napi_closing`, informando así a los hilos que ya no es posible realizar llamadas asíncronas a la función thread-safe. Esto se puede utilizar como criterio para terminar el hilo. **Al recibir un valor de retorno
de <code>napi_closing</code> de <code>napi_call_threadsafe_function()</code> un hilo no debe usar
la función thread-safe nunca más porque ya no se garantiza que
esté asignada.**


### Decidir si se debe mantener el proceso en ejecución {#deciding-whether-to-keep-the-process-running}

Al igual que los manejadores libuv, las funciones seguras para subprocesos pueden ser "referenciadas" y "no referenciadas". Una función segura para subprocesos "referenciada" hará que el bucle de eventos en el subproceso en el que se crea permanezca activo hasta que se destruya la función segura para subprocesos. Por el contrario, una función segura para subprocesos "no referenciada" no impedirá que el bucle de eventos se cierre. Las API `napi_ref_threadsafe_function` y `napi_unref_threadsafe_function` existen para este propósito.

Ni `napi_unref_threadsafe_function` marca las funciones seguras para subprocesos como capaces de ser destruidas ni `napi_ref_threadsafe_function` impide que sean destruidas.

### `napi_create_threadsafe_function` {#napi_create_threadsafe_function}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v12.6.0, v10.17.0 | Se hizo que el parámetro `func` fuera opcional con `call_js_cb` personalizado. |
| v10.6.0 | Agregado en: v10.6.0 |
:::

**Versión N-API: 4**

```C [C]
NAPI_EXTERN napi_status
napi_create_threadsafe_function(napi_env env,
                                napi_value func,
                                napi_value async_resource,
                                napi_value async_resource_name,
                                size_t max_queue_size,
                                size_t initial_thread_count,
                                void* thread_finalize_data,
                                napi_finalize thread_finalize_cb,
                                void* context,
                                napi_threadsafe_function_call_js call_js_cb,
                                napi_threadsafe_function* result);
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] func`: Una función JavaScript opcional para llamar desde otro subproceso. Debe proporcionarse si se pasa `NULL` a `call_js_cb`.
- `[in] async_resource`: Un objeto opcional asociado con el trabajo asíncrono que se pasará a los posibles ganchos `async_hooks` [`init`](/es/nodejs/api/async_hooks#initasyncid-type-triggerasyncid-resource).
- `[in] async_resource_name`: Una cadena JavaScript para proporcionar un identificador para el tipo de recurso que se proporciona para la información de diagnóstico expuesta por la API `async_hooks`.
- `[in] max_queue_size`: Tamaño máximo de la cola. `0` para sin límite.
- `[in] initial_thread_count`: El número inicial de adquisiciones, es decir, el número inicial de subprocesos, incluido el subproceso principal, que harán uso de esta función.
- `[in] thread_finalize_data`: Datos opcionales que se pasarán a `thread_finalize_cb`.
- `[in] thread_finalize_cb`: Función opcional para llamar cuando se destruye la `napi_threadsafe_function`.
- `[in] context`: Datos opcionales para adjuntar a la `napi_threadsafe_function` resultante.
- `[in] call_js_cb`: Devolución de llamada opcional que llama a la función JavaScript en respuesta a una llamada en un subproceso diferente. Esta devolución de llamada se llamará en el subproceso principal. Si no se proporciona, la función JavaScript se llamará sin parámetros y con `undefined` como su valor `this`. [`napi_threadsafe_function_call_js`](/es/nodejs/api/n-api#napi_threadsafe_function_call_js) proporciona más detalles.
- `[out] result`: La función JavaScript asíncrona segura para subprocesos.

**Historial de cambios:**

- Experimental (`NAPI_EXPERIMENTAL` está definido): Las excepciones no capturadas lanzadas en `call_js_cb` se manejan con el evento [`'uncaughtException'`](/es/nodejs/api/process#event-uncaughtexception), en lugar de ser ignoradas.


### `napi_get_threadsafe_function_context` {#napi_get_threadsafe_function_context}

**Agregado en: v10.6.0**

**Versión de N-API: 4**

```C [C]
NAPI_EXTERN napi_status
napi_get_threadsafe_function_context(napi_threadsafe_function func,
                                     void** result);
```
- `[in] func`: La función thread-safe para la que se va a recuperar el contexto.
- `[out] result`: La ubicación donde se almacenará el contexto.

Esta API se puede llamar desde cualquier hilo que haga uso de `func`.

### `napi_call_threadsafe_function` {#napi_call_threadsafe_function}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v14.5.0 | Se ha revertido el soporte para `napi_would_deadlock`. |
| v14.1.0 | Devuelve `napi_would_deadlock` cuando se llama con `napi_tsfn_blocking` desde el hilo principal o un hilo de trabajo y la cola está llena. |
| v10.6.0 | Agregado en: v10.6.0 |
:::

**Versión de N-API: 4**

```C [C]
NAPI_EXTERN napi_status
napi_call_threadsafe_function(napi_threadsafe_function func,
                              void* data,
                              napi_threadsafe_function_call_mode is_blocking);
```
- `[in] func`: La función JavaScript asíncrona thread-safe que se invocará.
- `[in] data`: Datos para enviar a JavaScript a través de la devolución de llamada `call_js_cb` proporcionada durante la creación de la función JavaScript thread-safe.
- `[in] is_blocking`: Bandera cuyo valor puede ser `napi_tsfn_blocking` para indicar que la llamada debe bloquearse si la cola está llena o `napi_tsfn_nonblocking` para indicar que la llamada debe regresar inmediatamente con un estado de `napi_queue_full` cuando la cola esté llena.

Esta API no se debe llamar con `napi_tsfn_blocking` desde un hilo de JavaScript, porque, si la cola está llena, puede causar que el hilo de JavaScript se bloquee.

Esta API devolverá `napi_closing` si se llamó a `napi_release_threadsafe_function()` con `abort` establecido en `napi_tsfn_abort` desde cualquier hilo. El valor solo se agrega a la cola si la API devuelve `napi_ok`.

Esta API se puede llamar desde cualquier hilo que haga uso de `func`.

### `napi_acquire_threadsafe_function` {#napi_acquire_threadsafe_function}

**Agregado en: v10.6.0**

**Versión de N-API: 4**

```C [C]
NAPI_EXTERN napi_status
napi_acquire_threadsafe_function(napi_threadsafe_function func);
```
- `[in] func`: La función JavaScript asíncrona thread-safe para comenzar a utilizar.

Un hilo debe llamar a esta API antes de pasar `func` a cualquier otra API de función thread-safe para indicar que hará uso de `func`. Esto evita que `func` se destruya cuando todos los demás hilos hayan dejado de usarla.

Esta API se puede llamar desde cualquier hilo que comience a hacer uso de `func`.


### `napi_release_threadsafe_function` {#napi_release_threadsafe_function}

**Agregado en: v10.6.0**

**Versión de N-API: 4**

```C [C]
NAPI_EXTERN napi_status
napi_release_threadsafe_function(napi_threadsafe_function func,
                                 napi_threadsafe_function_release_mode mode);
```
- `[in] func`: La función de JavaScript asíncrona y segura para subprocesos cuya cuenta de referencias se va a decrementar.
- `[in] mode`: Indicador cuyo valor puede ser `napi_tsfn_release` para indicar que el subproceso actual no realizará más llamadas a la función segura para subprocesos, o `napi_tsfn_abort` para indicar que, además del subproceso actual, ningún otro subproceso debe realizar más llamadas a la función segura para subprocesos. Si se establece en `napi_tsfn_abort`, las llamadas posteriores a `napi_call_threadsafe_function()` devolverán `napi_closing` y no se colocarán más valores en la cola.

Un subproceso debe llamar a esta API cuando deje de usar `func`. Pasar `func` a cualquier API segura para subprocesos después de haber llamado a esta API tiene resultados indefinidos, ya que `func` puede haber sido destruida.

Esta API puede ser llamada desde cualquier subproceso que deje de usar `func`.

### `napi_ref_threadsafe_function` {#napi_ref_threadsafe_function}

**Agregado en: v10.6.0**

**Versión de N-API: 4**

```C [C]
NAPI_EXTERN napi_status
napi_ref_threadsafe_function(node_api_basic_env env, napi_threadsafe_function func);
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] func`: La función segura para subprocesos a la que se va a hacer referencia.

Esta API se utiliza para indicar que el bucle de eventos que se ejecuta en el subproceso principal no debe salir hasta que `func` haya sido destruida. Similar a [`uv_ref`](https://docs.libuv.org/en/v1.x/handle#c.uv_ref), también es idempotente.

Ni `napi_unref_threadsafe_function` marca las funciones seguras para subprocesos como susceptibles de ser destruidas ni `napi_ref_threadsafe_function` impide que sean destruidas. `napi_acquire_threadsafe_function` y `napi_release_threadsafe_function` están disponibles para ese propósito.

Esta API solo puede ser llamada desde el subproceso principal.

### `napi_unref_threadsafe_function` {#napi_unref_threadsafe_function}

**Agregado en: v10.6.0**

**Versión de N-API: 4**

```C [C]
NAPI_EXTERN napi_status
napi_unref_threadsafe_function(node_api_basic_env env, napi_threadsafe_function func);
```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[in] func`: La función segura para subprocesos a la que se va a dejar de hacer referencia.

Esta API se utiliza para indicar que el bucle de eventos que se ejecuta en el subproceso principal puede salir antes de que `func` sea destruida. Similar a [`uv_unref`](https://docs.libuv.org/en/v1.x/handle#c.uv_unref), también es idempotente.

Esta API solo puede ser llamada desde el subproceso principal.


## Utilidades varias {#miscellaneous-utilities}

### `node_api_get_module_file_name` {#node_api_get_module_file_name}

**Agregado en: v15.9.0, v14.18.0, v12.22.0**

**Versión de N-API: 9**

```C [C]
NAPI_EXTERN napi_status
node_api_get_module_file_name(node_api_basic_env env, const char** result);

```
- `[in] env`: El entorno bajo el cual se invoca la API.
- `[out] result`: Una URL que contiene la ruta absoluta de la ubicación desde la que se cargó el complemento. Para un archivo en el sistema de archivos local, comenzará con `file://`. La cadena está terminada en nulo y es propiedad de `env` y, por lo tanto, no debe modificarse ni liberarse.

`result` puede ser una cadena vacía si el proceso de carga del complemento no logra establecer el nombre de archivo del complemento durante la carga.

