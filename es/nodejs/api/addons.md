---
title: Complementos de Node.js
description: Aprende a crear complementos de Node.js usando C++ para ampliar la funcionalidad de las aplicaciones Node.js, incluyendo ejemplos y referencias de API.
head:
  - - meta
    - name: og:title
      content: Complementos de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Aprende a crear complementos de Node.js usando C++ para ampliar la funcionalidad de las aplicaciones Node.js, incluyendo ejemplos y referencias de API.
  - - meta
    - name: twitter:title
      content: Complementos de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Aprende a crear complementos de Node.js usando C++ para ampliar la funcionalidad de las aplicaciones Node.js, incluyendo ejemplos y referencias de API.
---


# Complementos de C++ {#c-addons}

Los *complementos* son objetos compartidos enlazados dinámicamente escritos en C++. La función [`require()`](/es/nodejs/api/modules#requireid) puede cargar complementos como módulos ordinarios de Node.js. Los complementos proporcionan una interfaz entre JavaScript y las bibliotecas C/C++.

Hay tres opciones para implementar complementos:

- Node-API
- `nan` ([Abstracciones Nativas para Node.js](https://github.com/nodejs/nan))
- uso directo de las bibliotecas internas de V8, libuv y Node.js

A menos que haya una necesidad de acceso directo a la funcionalidad que no está expuesta por Node-API, utilice Node-API. Consulte [Complementos de C/C++ con Node-API](/es/nodejs/api/n-api) para obtener más información sobre Node-API.

Cuando no se utiliza Node-API, la implementación de complementos se vuelve más compleja, requiriendo el conocimiento de múltiples componentes y APIs:

-  [V8](https://v8.dev/): la biblioteca C++ que Node.js utiliza para proporcionar la implementación de JavaScript. Proporciona los mecanismos para crear objetos, llamar a funciones, etc. La API de V8 está documentada principalmente en el archivo de cabecera `v8.h` (`deps/v8/include/v8.h` en el árbol de código fuente de Node.js), y también está disponible [en línea](https://v8docs.nodesource.com/).
-  [libuv](https://github.com/libuv/libuv): La biblioteca C que implementa el bucle de eventos de Node.js, sus hilos de trabajo y todos los comportamientos asíncronos de la plataforma. También sirve como una biblioteca de abstracción multiplataforma, dando un acceso fácil, similar a POSIX, a través de todos los principales sistemas operativos a muchas tareas comunes del sistema, tales como la interacción con el sistema de archivos, sockets, temporizadores y eventos del sistema. libuv también proporciona una abstracción de hilos similar a los hilos POSIX para complementos asíncronos más sofisticados que necesitan ir más allá del bucle de eventos estándar. Los autores de complementos deben evitar bloquear el bucle de eventos con E/S u otras tareas que consuman mucho tiempo, descargando el trabajo a través de libuv a operaciones del sistema no bloqueantes, hilos de trabajo o un uso personalizado de los hilos libuv.
-  Bibliotecas internas de Node.js: Node.js en sí mismo exporta APIs de C++ que los complementos pueden utilizar, la más importante de las cuales es la clase `node::ObjectWrap`.
-  Otras bibliotecas enlazadas estáticamente (incluyendo OpenSSL): Estas otras bibliotecas se encuentran en el directorio `deps/` en el árbol de código fuente de Node.js. Sólo los símbolos de libuv, OpenSSL, V8 y zlib son re-exportados a propósito por Node.js y pueden ser utilizados en diversos grados por los complementos. Consulte [Enlace a bibliotecas incluidas con Node.js](/es/nodejs/api/addons#linking-to-libraries-included-with-nodejs) para obtener información adicional.

Todos los siguientes ejemplos están disponibles para [descargar](https://github.com/nodejs/node-addon-examples) y pueden ser utilizados como punto de partida para un complemento.


## Hola mundo {#hello-world}

Este ejemplo de "Hola mundo" es un complemento simple, escrito en C++, que es el equivalente al siguiente código JavaScript:

```js [ESM]
module.exports.hello = () => 'world';
```
Primero, cree el archivo `hello.cc`:

```C++ [C++]
// hello.cc
#include <node.h>

namespace demo {

using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::NewStringType;
using v8::Object;
using v8::String;
using v8::Value;

void Method(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  args.GetReturnValue().Set(String::NewFromUtf8(
      isolate, "world", NewStringType::kNormal).ToLocalChecked());
}

void Initialize(Local<Object> exports) {
  NODE_SET_METHOD(exports, "hello", Method);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)

}  // namespace demo
```
Todos los complementos de Node.js deben exportar una función de inicialización siguiendo el patrón:

```C++ [C++]
void Initialize(Local<Object> exports);
NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)
```
No hay punto y coma después de `NODE_MODULE`, ya que no es una función (ver `node.h`).

El `module_name` debe coincidir con el nombre de archivo del binario final (excluyendo el sufijo `.node`).

En el ejemplo `hello.cc`, entonces, la función de inicialización es `Initialize` y el nombre del módulo de complemento es `addon`.

Cuando se construyen complementos con `node-gyp`, usar la macro `NODE_GYP_MODULE_NAME` como el primer parámetro de `NODE_MODULE()` garantizará que el nombre del binario final se pase a `NODE_MODULE()`.

Los complementos definidos con `NODE_MODULE()` no se pueden cargar en múltiples contextos o múltiples subprocesos al mismo tiempo.

### Complementos conscientes del contexto {#context-aware-addons}

Existen entornos en los que los complementos de Node.js pueden necesitar cargarse varias veces en múltiples contextos. Por ejemplo, el tiempo de ejecución de [Electron](https://electronjs.org/) ejecuta múltiples instancias de Node.js en un solo proceso. Cada instancia tendrá su propia caché `require()` y, por lo tanto, cada instancia necesitará un complemento nativo para comportarse correctamente cuando se cargue a través de `require()`. Esto significa que el complemento debe admitir múltiples inicializaciones.

Se puede construir un complemento consciente del contexto utilizando la macro `NODE_MODULE_INITIALIZER`, que se expande al nombre de una función que Node.js esperará encontrar cuando cargue un complemento. Por lo tanto, un complemento se puede inicializar como en el siguiente ejemplo:

```C++ [C++]
using namespace v8;

extern "C" NODE_MODULE_EXPORT void
NODE_MODULE_INITIALIZER(Local<Object> exports,
                        Local<Value> module,
                        Local<Context> context) {
  /* Realice los pasos de inicialización del complemento aquí. */
}
```
Otra opción es usar la macro `NODE_MODULE_INIT()`, que también construirá un complemento consciente del contexto. A diferencia de `NODE_MODULE()`, que se utiliza para construir un complemento en torno a una función inicializadora de complemento dada, `NODE_MODULE_INIT()` sirve como la declaración de tal inicializador para ser seguido por un cuerpo de función.

Las siguientes tres variables se pueden usar dentro del cuerpo de la función después de una invocación de `NODE_MODULE_INIT()`:

- `Local\<Object\> exports`,
- `Local\<Value\> module` y
- `Local\<Context\> context`

Construir un complemento consciente del contexto requiere una gestión cuidadosa de los datos estáticos globales para garantizar la estabilidad y la corrección. Dado que el complemento se puede cargar varias veces, potencialmente incluso desde diferentes subprocesos, cualquier dato estático global almacenado en el complemento debe estar debidamente protegido y no debe contener ninguna referencia persistente a objetos de JavaScript. La razón de esto es que los objetos de JavaScript solo son válidos en un contexto y probablemente causarán un bloqueo cuando se acceda desde el contexto incorrecto o desde un subproceso diferente al que fueron creados.

El complemento consciente del contexto se puede estructurar para evitar datos estáticos globales siguiendo los siguientes pasos:

- Defina una clase que contendrá datos por instancia de complemento y que tiene un miembro estático de la forma
- Asigne una instancia de esta clase en el montón en el inicializador del complemento. Esto se puede lograr usando la palabra clave `new`.
- Llame a `node::AddEnvironmentCleanupHook()`, pasándole la instancia creada anteriormente y un puntero a `DeleteInstance()`. Esto asegurará que la instancia se elimine cuando el entorno se desmonte.
- Almacene la instancia de la clase en un `v8::External` y
- Pase el `v8::External` a todos los métodos expuestos a JavaScript pasándolo a `v8::FunctionTemplate::New()` o `v8::Function::New()` que crea las funciones de JavaScript respaldadas nativas. El tercer parámetro de `v8::FunctionTemplate::New()` o `v8::Function::New()` acepta el `v8::External` y lo pone a disposición en la devolución de llamada nativa usando el método `v8::FunctionCallbackInfo::Data()`.

Esto asegurará que los datos por instancia de complemento lleguen a cada enlace que se puede llamar desde JavaScript. Los datos por instancia de complemento también deben pasarse a cualquier devolución de llamada asíncrona que pueda crear el complemento.

El siguiente ejemplo ilustra la implementación de un complemento consciente del contexto:

```C++ [C++]
#include <node.h>

using namespace v8;

class AddonData {
 public:
  explicit AddonData(Isolate* isolate):
      call_count(0) {
    // Ensure this per-addon-instance data is deleted at environment cleanup.
    node::AddEnvironmentCleanupHook(isolate, DeleteInstance, this);
  }

  // Per-addon data.
  int call_count;

  static void DeleteInstance(void* data) {
    delete static_cast<AddonData*>(data);
  }
};

static void Method(const v8::FunctionCallbackInfo<v8::Value>& info) {
  // Retrieve the per-addon-instance data.
  AddonData* data =
      reinterpret_cast<AddonData*>(info.Data().As<External>()->Value());
  data->call_count++;
  info.GetReturnValue().Set((double)data->call_count);
}

// Initialize this addon to be context-aware.
NODE_MODULE_INIT(/* exports, module, context */) {
  Isolate* isolate = context->GetIsolate();

  // Create a new instance of `AddonData` for this instance of the addon and
  // tie its life cycle to that of the Node.js environment.
  AddonData* data = new AddonData(isolate);

  // Wrap the data in a `v8::External` so we can pass it to the method we
  // expose.
  Local<External> external = External::New(isolate, data);

  // Expose the method `Method` to JavaScript, and make sure it receives the
  // per-addon-instance data we created above by passing `external` as the
  // third parameter to the `FunctionTemplate` constructor.
  exports->Set(context,
               String::NewFromUtf8(isolate, "method").ToLocalChecked(),
               FunctionTemplate::New(isolate, Method, external)
                  ->GetFunction(context).ToLocalChecked()).FromJust();
}
```

#### Soporte para Workers {#worker-support}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v14.8.0, v12.19.0 | Los hooks de limpieza ahora pueden ser asíncronos. |
:::

Para poder cargarse desde múltiples entornos Node.js, como un hilo principal y un hilo Worker, un complemento necesita:

- Ser un complemento Node-API, o
- Ser declarado como consciente del contexto utilizando `NODE_MODULE_INIT()` como se describió anteriormente

Para admitir hilos [`Worker`](/es/nodejs/api/worker_threads#class-worker), los complementos deben limpiar cualquier recurso que hayan asignado cuando dicho hilo finalice. Esto se puede lograr mediante el uso de la función `AddEnvironmentCleanupHook()`:

```C++ [C++]
void AddEnvironmentCleanupHook(v8::Isolate* isolate,
                               void (*fun)(void* arg),
                               void* arg);
```
Esta función agrega un hook que se ejecutará antes de que se cierre una instancia de Node.js dada. Si es necesario, dichos hooks se pueden eliminar antes de que se ejecuten utilizando `RemoveEnvironmentCleanupHook()`, que tiene la misma firma. Las devoluciones de llamada se ejecutan en orden de última entrada, primera salida (LIFO).

Si es necesario, existe un par adicional de sobrecargas `AddEnvironmentCleanupHook()` y `RemoveEnvironmentCleanupHook()`, donde el hook de limpieza toma una función de devolución de llamada. Esto se puede usar para cerrar recursos asíncronos, como cualquier identificador libuv registrado por el complemento.

El siguiente `addon.cc` usa `AddEnvironmentCleanupHook`:

```C++ [C++]
// addon.cc
#include <node.h>
#include <assert.h>
#include <stdlib.h>

using node::AddEnvironmentCleanupHook;
using v8::HandleScope;
using v8::Isolate;
using v8::Local;
using v8::Object;

// Note: In a real-world application, do not rely on static/global data.
static char cookie[] = "yum yum";
static int cleanup_cb1_called = 0;
static int cleanup_cb2_called = 0;

static void cleanup_cb1(void* arg) {
  Isolate* isolate = static_cast<Isolate*>(arg);
  HandleScope scope(isolate);
  Local<Object> obj = Object::New(isolate);
  assert(!obj.IsEmpty());  // assert VM is still alive
  assert(obj->IsObject());
  cleanup_cb1_called++;
}

static void cleanup_cb2(void* arg) {
  assert(arg == static_cast<void*>(cookie));
  cleanup_cb2_called++;
}

static void sanity_check(void*) {
  assert(cleanup_cb1_called == 1);
  assert(cleanup_cb2_called == 1);
}

// Initialize this addon to be context-aware.
NODE_MODULE_INIT(/* exports, module, context */) {
  Isolate* isolate = context->GetIsolate();

  AddEnvironmentCleanupHook(isolate, sanity_check, nullptr);
  AddEnvironmentCleanupHook(isolate, cleanup_cb2, cookie);
  AddEnvironmentCleanupHook(isolate, cleanup_cb1, isolate);
}
```
Pruebe en JavaScript ejecutando:

```js [ESM]
// test.js
require('./build/Release/addon');
```

### Construcción {#building}

Una vez que se ha escrito el código fuente, debe compilarse en el archivo binario `addon.node`. Para ello, cree un archivo llamado `binding.gyp` en el nivel superior del proyecto que describa la configuración de la construcción del módulo utilizando un formato similar a JSON. Este archivo es utilizado por [node-gyp](https://github.com/nodejs/node-gyp), una herramienta escrita específicamente para compilar complementos de Node.js.

```json [JSON]
{
  "targets": [
    {
      "target_name": "addon",
      "sources": [ "hello.cc" ]
    }
  ]
}
```
Una versión de la utilidad `node-gyp` se incluye y se distribuye con Node.js como parte de `npm`. Esta versión no está disponible directamente para que los desarrolladores la utilicen y está destinada únicamente a apoyar la capacidad de utilizar el comando `npm install` para compilar e instalar complementos. Los desarrolladores que deseen utilizar `node-gyp` directamente pueden instalarlo utilizando el comando `npm install -g node-gyp`. Consulte las [instrucciones de instalación](https://github.com/nodejs/node-gyp#installation) de `node-gyp` para obtener más información, incluidos los requisitos específicos de la plataforma.

Una vez que se ha creado el archivo `binding.gyp`, utilice `node-gyp configure` para generar los archivos de construcción del proyecto apropiados para la plataforma actual. Esto generará un `Makefile` (en plataformas Unix) o un archivo `vcxproj` (en Windows) en el directorio `build/`.

A continuación, invoque el comando `node-gyp build` para generar el archivo compilado `addon.node`. Éste se colocará en el directorio `build/Release/`.

Cuando se utiliza `npm install` para instalar un complemento de Node.js, npm utiliza su propia versión incluida de `node-gyp` para realizar este mismo conjunto de acciones, generando una versión compilada del complemento para la plataforma del usuario a petición.

Una vez construido, el complemento binario puede utilizarse desde dentro de Node.js apuntando [`require()`](/es/nodejs/api/modules#requireid) al módulo `addon.node` construido:

```js [ESM]
// hello.js
const addon = require('./build/Release/addon');

console.log(addon.hello());
// Prints: 'world'
```
Debido a que la ruta exacta al binario del complemento compilado puede variar dependiendo de cómo se compile (es decir, a veces puede estar en `./build/Debug/`), los complementos pueden utilizar el paquete [bindings](https://github.com/TooTallNate/node-bindings) para cargar el módulo compilado.

Aunque la implementación del paquete `bindings` es más sofisticada en cuanto a la localización de los módulos de los complementos, esencialmente utiliza un patrón `try…catch` similar a:

```js [ESM]
try {
  return require('./build/Release/addon.node');
} catch (err) {
  return require('./build/Debug/addon.node');
}
```

### Enlace a bibliotecas incluidas con Node.js {#linking-to-libraries-included-with-nodejs}

Node.js usa bibliotecas enlazadas estáticamente como V8, libuv y OpenSSL. Todos los complementos deben enlazarse a V8 y también pueden enlazarse a cualquier otra dependencia. Por lo general, esto es tan simple como incluir las declaraciones `#include \<...\>` apropiadas (por ejemplo, `#include \<v8.h\>`) y `node-gyp` ubicará los encabezados apropiados automáticamente. Sin embargo, hay algunas advertencias a tener en cuenta:

- Cuando se ejecuta `node-gyp`, detectará la versión específica de lanzamiento de Node.js y descargará el archivo tarball de fuente completa o solo los encabezados. Si se descarga la fuente completa, los complementos tendrán acceso completo al conjunto completo de dependencias de Node.js. Sin embargo, si solo se descargan los encabezados de Node.js, solo estarán disponibles los símbolos exportados por Node.js.
- `node-gyp` se puede ejecutar usando el indicador `--nodedir` que apunta a una imagen de fuente local de Node.js. Usando esta opción, el complemento tendrá acceso al conjunto completo de dependencias.

### Carga de complementos usando `require()` {#loading-addons-using-require}

La extensión del nombre de archivo del binario de complemento compilado es `.node` (a diferencia de `.dll` o `.so`). La función [`require()`](/es/nodejs/api/modules#requireid) está escrita para buscar archivos con la extensión de archivo `.node` e inicializarlos como bibliotecas enlazadas dinámicamente.

Al llamar a [`require()`](/es/nodejs/api/modules#requireid), la extensión `.node` generalmente se puede omitir y Node.js aún encontrará e inicializará el complemento. Sin embargo, una advertencia es que Node.js primero intentará ubicar y cargar módulos o archivos JavaScript que compartan el mismo nombre base. Por ejemplo, si hay un archivo `addon.js` en el mismo directorio que el binario `addon.node`, entonces [`require('addon')`](/es/nodejs/api/modules#requireid) dará precedencia al archivo `addon.js` y lo cargará en su lugar.

## Abstracciones nativas para Node.js {#native-abstractions-for-nodejs}

Cada uno de los ejemplos ilustrados en este documento utiliza directamente las API de Node.js y V8 para implementar complementos. La API de V8 puede cambiar drásticamente, y lo ha hecho, de una versión de V8 a la siguiente (y de una versión principal de Node.js a la siguiente). Con cada cambio, es posible que sea necesario actualizar y recompilar los complementos para que sigan funcionando. El programa de lanzamiento de Node.js está diseñado para minimizar la frecuencia y el impacto de dichos cambios, pero Node.js puede hacer poco para garantizar la estabilidad de las API de V8.

Las [Abstracciones Nativas para Node.js](https://github.com/nodejs/nan) (o `nan`) proporcionan un conjunto de herramientas que se recomienda a los desarrolladores de complementos usar para mantener la compatibilidad entre versiones pasadas y futuras de V8 y Node.js. Consulta los [ejemplos](https://github.com/nodejs/nan/tree/HEAD/examples/) de `nan` para obtener una ilustración de cómo se puede usar.


## Node-API {#node-api}

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable
:::

Node-API es una API para construir complementos nativos. Es independiente del entorno de ejecución de JavaScript subyacente (por ejemplo, V8) y se mantiene como parte del propio Node.js. Esta API será de Interfaz Binaria de Aplicaciones (ABI) estable entre las versiones de Node.js. Su objetivo es aislar los complementos de los cambios en el motor de JavaScript subyacente y permitir que los módulos compilados para una versión se ejecuten en versiones posteriores de Node.js sin necesidad de recompilación. Los complementos se construyen/empaquetan con el mismo enfoque/herramientas descritos en este documento (node-gyp, etc.). La única diferencia es el conjunto de API que utiliza el código nativo. En lugar de utilizar las API de V8 o [Abstracciones Nativas para Node.js](https://github.com/nodejs/nan), se utilizan las funciones disponibles en Node-API.

La creación y el mantenimiento de un complemento que se beneficia de la estabilidad ABI proporcionada por Node-API conlleva ciertas [consideraciones de implementación](/es/nodejs/api/n-api#implications-of-abi-stability).

Para utilizar Node-API en el ejemplo anterior de "Hola mundo", sustituya el contenido de `hello.cc` por lo siguiente. Todas las demás instrucciones siguen siendo las mismas.

```C++ [C++]
// hello.cc using Node-API
#include <node_api.h>

namespace demo {

napi_value Method(napi_env env, napi_callback_info args) {
  napi_value greeting;
  napi_status status;

  status = napi_create_string_utf8(env, "world", NAPI_AUTO_LENGTH, &greeting);
  if (status != napi_ok) return nullptr;
  return greeting;
}

napi_value init(napi_env env, napi_value exports) {
  napi_status status;
  napi_value fn;

  status = napi_create_function(env, nullptr, 0, Method, nullptr, &fn);
  if (status != napi_ok) return nullptr;

  status = napi_set_named_property(env, exports, "hello", fn);
  if (status != napi_ok) return nullptr;
  return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, init)

}  // namespace demo
```
Las funciones disponibles y cómo utilizarlas se documentan en [Complementos C/C++ con Node-API](/es/nodejs/api/n-api).


## Ejemplos de addons {#addon-examples}

A continuación, se muestran algunos ejemplos de addons destinados a ayudar a los desarrolladores a comenzar. Los ejemplos utilizan las API de V8. Consulte la [referencia de V8](https://v8docs.nodesource.com/) en línea para obtener ayuda con las distintas llamadas de V8 y la [Guía del Integrador](https://v8.dev/docs/embed) de V8 para obtener una explicación de varios conceptos utilizados, como los manejadores, los ámbitos, las plantillas de funciones, etc.

Cada uno de estos ejemplos utiliza el siguiente archivo `binding.gyp`:

```json [JSON]
{
  "targets": [
    {
      "target_name": "addon",
      "sources": [ "addon.cc" ]
    }
  ]
}
```
En los casos en que haya más de un archivo `.cc`, simplemente agregue el nombre de archivo adicional a la matriz `sources`:

```json [JSON]
"sources": ["addon.cc", "myexample.cc"]
```
Una vez que el archivo `binding.gyp` esté listo, los addons de ejemplo se pueden configurar y compilar utilizando `node-gyp`:

```bash [BASH]
node-gyp configure build
```
### Argumentos de función {#function-arguments}

Los addons normalmente exponen objetos y funciones a los que se puede acceder desde JavaScript que se ejecuta dentro de Node.js. Cuando se invocan funciones desde JavaScript, los argumentos de entrada y el valor de retorno deben mapearse hacia y desde el código C/C++.

El siguiente ejemplo ilustra cómo leer los argumentos de la función pasados desde JavaScript y cómo devolver un resultado:

```C++ [C++]
// addon.cc
#include <node.h>

namespace demo {

using v8::Exception;
using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Number;
using v8::Object;
using v8::String;
using v8::Value;

// Esta es la implementación del método "add"
// Los argumentos de entrada se pasan utilizando el
// struct const FunctionCallbackInfo<Value>& args
void Add(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  // Comprobar el número de argumentos pasados.
  if (args.Length() < 2) {
    // Lanza un Error que se pasa de vuelta a JavaScript
    isolate->ThrowException(Exception::TypeError(
        String::NewFromUtf8(isolate,
                            "Número incorrecto de argumentos").ToLocalChecked()));
    return;
  }

  // Comprobar los tipos de argumentos
  if (!args[0]->IsNumber() || !args[1]->IsNumber()) {
    isolate->ThrowException(Exception::TypeError(
        String::NewFromUtf8(isolate,
                            "Argumentos incorrectos").ToLocalChecked()));
    return;
  }

  // Realizar la operación
  double value =
      args[0].As<Number>()->Value() + args[1].As<Number>()->Value();
  Local<Number> num = Number::New(isolate, value);

  // Establecer el valor de retorno (utilizando el pasado en
  // FunctionCallbackInfo<Value>&)
  args.GetReturnValue().Set(num);
}

void Init(Local<Object> exports) {
  NODE_SET_METHOD(exports, "add", Add);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Init)

}  // namespace demo
```
Una vez compilado, el addon de ejemplo se puede requerir y utilizar desde dentro de Node.js:

```js [ESM]
// test.js
const addon = require('./build/Release/addon');

console.log('Esto debería ser ocho:', addon.add(3, 5));
```

### Callbacks {#callbacks}

Es una práctica común dentro de los addons pasar funciones de JavaScript a una función de C++ y ejecutarlas desde allí. El siguiente ejemplo ilustra cómo invocar tales callbacks:

```C++ [C++]
// addon.cc
#include <node.h>

namespace demo {

using v8::Context;
using v8::Function;
using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Null;
using v8::Object;
using v8::String;
using v8::Value;

void RunCallback(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();
  Local<Function> cb = Local<Function>::Cast(args[0]);
  const unsigned argc = 1;
  Local<Value> argv[argc] = {
      String::NewFromUtf8(isolate,
                          "hello world").ToLocalChecked() };
  cb->Call(context, Null(isolate), argc, argv).ToLocalChecked();
}

void Init(Local<Object> exports, Local<Object> module) {
  NODE_SET_METHOD(module, "exports", RunCallback);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Init)

}  // namespace demo
```
Este ejemplo utiliza una forma de dos argumentos de `Init()` que recibe el objeto `module` completo como segundo argumento. Esto permite que el addon sobrescriba completamente `exports` con una sola función en lugar de agregar la función como una propiedad de `exports`.

Para probarlo, ejecute el siguiente JavaScript:

```js [ESM]
// test.js
const addon = require('./build/Release/addon');

addon((msg) => {
  console.log(msg);
// Prints: 'hello world'
});
```
En este ejemplo, la función de callback se invoca sincrónicamente.

### Object factory {#object-factory}

Los addons pueden crear y devolver nuevos objetos desde una función de C++, como se ilustra en el siguiente ejemplo. Se crea y devuelve un objeto con una propiedad `msg` que repite la cadena pasada a `createObject()`:

```C++ [C++]
// addon.cc
#include <node.h>

namespace demo {

using v8::Context;
using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::String;
using v8::Value;

void CreateObject(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();

  Local<Object> obj = Object::New(isolate);
  obj->Set(context,
           String::NewFromUtf8(isolate,
                               "msg").ToLocalChecked(),
                               args[0]->ToString(context).ToLocalChecked())
           .FromJust();

  args.GetReturnValue().Set(obj);
}

void Init(Local<Object> exports, Local<Object> module) {
  NODE_SET_METHOD(module, "exports", CreateObject);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Init)

}  // namespace demo
```
Para probarlo en JavaScript:

```js [ESM]
// test.js
const addon = require('./build/Release/addon');

const obj1 = addon('hello');
const obj2 = addon('world');
console.log(obj1.msg, obj2.msg);
// Prints: 'hello world'
```

### Fábrica de funciones {#function-factory}

Otro escenario común es crear funciones de JavaScript que envuelven funciones de C++ y devolverlas a JavaScript:

```C++ [C++]
// addon.cc
#include <node.h>

namespace demo {

using v8::Context;
using v8::Function;
using v8::FunctionCallbackInfo;
using v8::FunctionTemplate;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::String;
using v8::Value;

void MyFunction(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  args.GetReturnValue().Set(String::NewFromUtf8(
      isolate, "hello world").ToLocalChecked());
}

void CreateFunction(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  Local<Context> context = isolate->GetCurrentContext();
  Local<FunctionTemplate> tpl = FunctionTemplate::New(isolate, MyFunction);
  Local<Function> fn = tpl->GetFunction(context).ToLocalChecked();

  // omitir esto para que sea anónimo
  fn->SetName(String::NewFromUtf8(
      isolate, "theFunction").ToLocalChecked());

  args.GetReturnValue().Set(fn);
}

void Init(Local<Object> exports, Local<Object> module) {
  NODE_SET_METHOD(module, "exports", CreateFunction);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Init)

}  // namespace demo
```
Para probar:

```js [ESM]
// test.js
const addon = require('./build/Release/addon');

const fn = addon();
console.log(fn());
// Imprime: 'hello world'
```
### Envolviendo objetos de C++ {#wrapping-c-objects}

También es posible envolver objetos/clases de C++ de una manera que permita crear nuevas instancias usando el operador `new` de JavaScript:

```C++ [C++]
// addon.cc
#include <node.h>
#include "myobject.h"

namespace demo {

using v8::Local;
using v8::Object;

void InitAll(Local<Object> exports) {
  MyObject::Init(exports);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, InitAll)

}  // namespace demo
```
Luego, en `myobject.h`, la clase envolvente hereda de `node::ObjectWrap`:

```C++ [C++]
// myobject.h
#ifndef MYOBJECT_H
#define MYOBJECT_H

#include <node.h>
#include <node_object_wrap.h>

namespace demo {

class MyObject : public node::ObjectWrap {
 public:
  static void Init(v8::Local<v8::Object> exports);

 private:
  explicit MyObject(double value = 0);
  ~MyObject();

  static void New(const v8::FunctionCallbackInfo<v8::Value>& args);
  static void PlusOne(const v8::FunctionCallbackInfo<v8::Value>& args);

  double value_;
};

}  // namespace demo

#endif
```
En `myobject.cc`, implemente los diversos métodos que se expondrán. En el siguiente código, el método `plusOne()` se expone agregándolo al prototipo del constructor:

```C++ [C++]
// myobject.cc
#include "myobject.h"

namespace demo {

using v8::Context;
using v8::Function;
using v8::FunctionCallbackInfo;
using v8::FunctionTemplate;
using v8::Isolate;
using v8::Local;
using v8::Number;
using v8::Object;
using v8::ObjectTemplate;
using v8::String;
using v8::Value;

MyObject::MyObject(double value) : value_(value) {
}

MyObject::~MyObject() {
}

void MyObject::Init(Local<Object> exports) {
  Isolate* isolate = exports->GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();

  Local<ObjectTemplate> addon_data_tpl = ObjectTemplate::New(isolate);
  addon_data_tpl->SetInternalFieldCount(1);  // 1 campo para MyObject::New()
  Local<Object> addon_data =
      addon_data_tpl->NewInstance(context).ToLocalChecked();

  // Prepare constructor template
  Local<FunctionTemplate> tpl = FunctionTemplate::New(isolate, New, addon_data);
  tpl->SetClassName(String::NewFromUtf8(isolate, "MyObject").ToLocalChecked());
  tpl->InstanceTemplate()->SetInternalFieldCount(1);

  // Prototype
  NODE_SET_PROTOTYPE_METHOD(tpl, "plusOne", PlusOne);

  Local<Function> constructor = tpl->GetFunction(context).ToLocalChecked();
  addon_data->SetInternalField(0, constructor);
  exports->Set(context, String::NewFromUtf8(
      isolate, "MyObject").ToLocalChecked(),
      constructor).FromJust();
}

void MyObject::New(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();

  if (args.IsConstructCall()) {
    // Invoked as constructor: `new MyObject(...)`
    double value = args[0]->IsUndefined() ?
        0 : args[0]->NumberValue(context).FromMaybe(0);
    MyObject* obj = new MyObject(value);
    obj->Wrap(args.This());
    args.GetReturnValue().Set(args.This());
  } else {
    // Invoked as plain function `MyObject(...)`, turn into construct call.
    const int argc = 1;
    Local<Value> argv[argc] = { args[0] };
    Local<Function> cons =
        args.Data().As<Object>()->GetInternalField(0)
            .As<Value>().As<Function>();
    Local<Object> result =
        cons->NewInstance(context, argc, argv).ToLocalChecked();
    args.GetReturnValue().Set(result);
  }
}

void MyObject::PlusOne(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  MyObject* obj = ObjectWrap::Unwrap<MyObject>(args.This());
  obj->value_ += 1;

  args.GetReturnValue().Set(Number::New(isolate, obj->value_));
}

}  // namespace demo
```
Para construir este ejemplo, el archivo `myobject.cc` debe agregarse al `binding.gyp`:

```json [JSON]
{
  "targets": [
    {
      "target_name": "addon",
      "sources": [
        "addon.cc",
        "myobject.cc"
      ]
    }
  ]
}
```
Pruébelo con:

```js [ESM]
// test.js
const addon = require('./build/Release/addon');

const obj = new addon.MyObject(10);
console.log(obj.plusOne());
// Imprime: 11
console.log(obj.plusOne());
// Imprime: 12
console.log(obj.plusOne());
// Imprime: 13
```
El destructor de un objeto envolvente se ejecutará cuando el objeto sea recolectado por el recolector de basura. Para probar el destructor, existen flags de línea de comandos que se pueden usar para hacer posible forzar la recolección de basura. Estos flags son proporcionados por el motor de JavaScript V8 subyacente. Están sujetos a cambios o eliminación en cualquier momento. No están documentados por Node.js o V8, y nunca deben usarse fuera de las pruebas.

Durante el cierre del proceso o los hilos de trabajo, el motor JS no llama a los destructores. Por lo tanto, es responsabilidad del usuario rastrear estos objetos y garantizar una destrucción adecuada para evitar fugas de recursos.


### Fábrica de objetos envueltos {#factory-of-wrapped-objects}

Alternativamente, es posible usar un patrón de fábrica para evitar crear explícitamente instancias de objetos usando el operador `new` de JavaScript:

```js [ESM]
const obj = addon.createObject();
// en lugar de:
// const obj = new addon.Object();
```
Primero, el método `createObject()` se implementa en `addon.cc`:

```C++ [C++]
// addon.cc
#include <node.h>
#include "myobject.h"

namespace demo {

using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::String;
using v8::Value;

void CreateObject(const FunctionCallbackInfo<Value>& args) {
  MyObject::NewInstance(args);
}

void InitAll(Local<Object> exports, Local<Object> module) {
  MyObject::Init(exports->GetIsolate());

  NODE_SET_METHOD(module, "exports", CreateObject);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, InitAll)

}  // namespace demo
```
En `myobject.h`, se añade el método estático `NewInstance()` para manejar la instanciación del objeto. Este método reemplaza el uso de `new` en JavaScript:

```C++ [C++]
// myobject.h
#ifndef MYOBJECT_H
#define MYOBJECT_H

#include <node.h>
#include <node_object_wrap.h>

namespace demo {

class MyObject : public node::ObjectWrap {
 public:
  static void Init(v8::Isolate* isolate);
  static void NewInstance(const v8::FunctionCallbackInfo<v8::Value>& args);

 private:
  explicit MyObject(double value = 0);
  ~MyObject();

  static void New(const v8::FunctionCallbackInfo<v8::Value>& args);
  static void PlusOne(const v8::FunctionCallbackInfo<v8::Value>& args);
  static v8::Global<v8::Function> constructor;
  double value_;
};

}  // namespace demo

#endif
```
La implementación en `myobject.cc` es similar al ejemplo anterior:

```C++ [C++]
// myobject.cc
#include <node.h>
#include "myobject.h"

namespace demo {

using node::AddEnvironmentCleanupHook;
using v8::Context;
using v8::Function;
using v8::FunctionCallbackInfo;
using v8::FunctionTemplate;
using v8::Global;
using v8::Isolate;
using v8::Local;
using v8::Number;
using v8::Object;
using v8::String;
using v8::Value;

// ¡Advertencia! Esto no es seguro para hilos, este addon no se puede usar para
// hilos de trabajo.
Global<Function> MyObject::constructor;

MyObject::MyObject(double value) : value_(value) {
}

MyObject::~MyObject() {
}

void MyObject::Init(Isolate* isolate) {
  // Prepare constructor template
  Local<FunctionTemplate> tpl = FunctionTemplate::New(isolate, New);
  tpl->SetClassName(String::NewFromUtf8(isolate, "MyObject").ToLocalChecked());
  tpl->InstanceTemplate()->SetInternalFieldCount(1);

  // Prototype
  NODE_SET_PROTOTYPE_METHOD(tpl, "plusOne", PlusOne);

  Local<Context> context = isolate->GetCurrentContext();
  constructor.Reset(isolate, tpl->GetFunction(context).ToLocalChecked());

  AddEnvironmentCleanupHook(isolate, [](void*) {
    constructor.Reset();
  }, nullptr);
}

void MyObject::New(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();

  if (args.IsConstructCall()) {
    // Invoked as constructor: `new MyObject(...)`
    double value = args[0]->IsUndefined() ?
        0 : args[0]->NumberValue(context).FromMaybe(0);
    MyObject* obj = new MyObject(value);
    obj->Wrap(args.This());
    args.GetReturnValue().Set(args.This());
  } else {
    // Invoked as plain function `MyObject(...)`, turn into construct call.
    const int argc = 1;
    Local<Value> argv[argc] = { args[0] };
    Local<Function> cons = Local<Function>::New(isolate, constructor);
    Local<Object> instance =
        cons->NewInstance(context, argc, argv).ToLocalChecked();
    args.GetReturnValue().Set(instance);
  }
}

void MyObject::NewInstance(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  const unsigned argc = 1;
  Local<Value> argv[argc] = { args[0] };
  Local<Function> cons = Local<Function>::New(isolate, constructor);
  Local<Context> context = isolate->GetCurrentContext();
  Local<Object> instance =
      cons->NewInstance(context, argc, argv).ToLocalChecked();

  args.GetReturnValue().Set(instance);
}

void MyObject::PlusOne(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  MyObject* obj = ObjectWrap::Unwrap<MyObject>(args.This());
  obj->value_ += 1;

  args.GetReturnValue().Set(Number::New(isolate, obj->value_));
}

}  // namespace demo
```
Una vez más, para construir este ejemplo, el archivo `myobject.cc` debe añadirse al `binding.gyp`:

```json [JSON]
{
  "targets": [
    {
      "target_name": "addon",
      "sources": [
        "addon.cc",
        "myobject.cc"
      ]
    }
  ]
}
```
Pruébelo con:

```js [ESM]
// test.js
const createObject = require('./build/Release/addon');

const obj = createObject(10);
console.log(obj.plusOne());
// Prints: 11
console.log(obj.plusOne());
// Prints: 12
console.log(obj.plusOne());
// Prints: 13

const obj2 = createObject(20);
console.log(obj2.plusOne());
// Prints: 21
console.log(obj2.plusOne());
// Prints: 22
console.log(obj2.plusOne());
// Prints: 23
```

### Pasar objetos envueltos {#passing-wrapped-objects-around}

Además de envolver y devolver objetos C++, es posible pasar objetos envueltos desenvolviéndolos con la función auxiliar de Node.js `node::ObjectWrap::Unwrap`. El siguiente ejemplo muestra una función `add()` que puede tomar dos objetos `MyObject` como argumentos de entrada:

```C++ [C++]
// addon.cc
#include <node.h>
#include <node_object_wrap.h>
#include "myobject.h"

namespace demo {

using v8::Context;
using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Number;
using v8::Object;
using v8::String;
using v8::Value;

void CreateObject(const FunctionCallbackInfo<Value>& args) {
  MyObject::NewInstance(args);
}

void Add(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();

  MyObject* obj1 = node::ObjectWrap::Unwrap<MyObject>(
      args[0]->ToObject(context).ToLocalChecked());
  MyObject* obj2 = node::ObjectWrap::Unwrap<MyObject>(
      args[1]->ToObject(context).ToLocalChecked());

  double sum = obj1->value() + obj2->value();
  args.GetReturnValue().Set(Number::New(isolate, sum));
}

void InitAll(Local<Object> exports) {
  MyObject::Init(exports->GetIsolate());

  NODE_SET_METHOD(exports, "createObject", CreateObject);
  NODE_SET_METHOD(exports, "add", Add);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, InitAll)

}  // namespace demo
```
En `myobject.h`, se agrega un nuevo método público para permitir el acceso a valores privados después de desenvolver el objeto.

```C++ [C++]
// myobject.h
#ifndef MYOBJECT_H
#define MYOBJECT_H

#include <node.h>
#include <node_object_wrap.h>

namespace demo {

class MyObject : public node::ObjectWrap {
 public:
  static void Init(v8::Isolate* isolate);
  static void NewInstance(const v8::FunctionCallbackInfo<v8::Value>& args);
  inline double value() const { return value_; }

 private:
  explicit MyObject(double value = 0);
  ~MyObject();

  static void New(const v8::FunctionCallbackInfo<v8::Value>& args);
  static v8::Global<v8::Function> constructor;
  double value_;
};

}  // namespace demo

#endif
```
La implementación de `myobject.cc` sigue siendo similar a la versión anterior:

```C++ [C++]
// myobject.cc
#include <node.h>
#include "myobject.h"

namespace demo {

using node::AddEnvironmentCleanupHook;
using v8::Context;
using v8::Function;
using v8::FunctionCallbackInfo;
using v8::FunctionTemplate;
using v8::Global;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::String;
using v8::Value;

// Warning! This is not thread-safe, this addon cannot be used for worker
// threads.
Global<Function> MyObject::constructor;

MyObject::MyObject(double value) : value_(value) {
}

MyObject::~MyObject() {
}

void MyObject::Init(Isolate* isolate) {
  // Prepare constructor template
  Local<FunctionTemplate> tpl = FunctionTemplate::New(isolate, New);
  tpl->SetClassName(String::NewFromUtf8(isolate, "MyObject").ToLocalChecked());
  tpl->InstanceTemplate()->SetInternalFieldCount(1);

  Local<Context> context = isolate->GetCurrentContext();
  constructor.Reset(isolate, tpl->GetFunction(context).ToLocalChecked());

  AddEnvironmentCleanupHook(isolate, [](void*) {
    constructor.Reset();
  }, nullptr);
}

void MyObject::New(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();

  if (args.IsConstructCall()) {
    // Invoked as constructor: `new MyObject(...)`
    double value = args[0]->IsUndefined() ?
        0 : args[0]->NumberValue(context).FromMaybe(0);
    MyObject* obj = new MyObject(value);
    obj->Wrap(args.This());
    args.GetReturnValue().Set(args.This());
  } else {
    // Invoked as plain function `MyObject(...)`, turn into construct call.
    const int argc = 1;
    Local<Value> argv[argc] = { args[0] };
    Local<Function> cons = Local<Function>::New(isolate, constructor);
    Local<Object> instance =
        cons->NewInstance(context, argc, argv).ToLocalChecked();
    args.GetReturnValue().Set(instance);
  }
}

void MyObject::NewInstance(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  const unsigned argc = 1;
  Local<Value> argv[argc] = { args[0] };
  Local<Function> cons = Local<Function>::New(isolate, constructor);
  Local<Context> context = isolate->GetCurrentContext();
  Local<Object> instance =
      cons->NewInstance(context, argc, argv).ToLocalChecked();

  args.GetReturnValue().Set(instance);
}

}  // namespace demo
```
Pruébelo con:

```js [ESM]
// test.js
const addon = require('./build/Release/addon');

const obj1 = addon.createObject(10);
const obj2 = addon.createObject(20);
const result = addon.add(obj1, obj2);

console.log(result);
// Prints: 30
```
