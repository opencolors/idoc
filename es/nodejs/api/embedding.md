---
title: API de Incrustación de Node.js
description: Aprende cómo incrustar Node.js en aplicaciones C/C++, permitiendo a los desarrolladores aprovechar el entorno de ejecución JavaScript de Node.js dentro de sus aplicaciones nativas.
head:
  - - meta
    - name: og:title
      content: API de Incrustación de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Aprende cómo incrustar Node.js en aplicaciones C/C++, permitiendo a los desarrolladores aprovechar el entorno de ejecución JavaScript de Node.js dentro de sus aplicaciones nativas.
  - - meta
    - name: twitter:title
      content: API de Incrustación de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Aprende cómo incrustar Node.js en aplicaciones C/C++, permitiendo a los desarrolladores aprovechar el entorno de ejecución JavaScript de Node.js dentro de sus aplicaciones nativas.
---


# API de incrustación de C++ {#c-embedder-api}

Node.js proporciona una serie de API de C++ que se pueden utilizar para ejecutar JavaScript en un entorno Node.js desde otro software de C++.

La documentación de estas API se puede encontrar en [src/node.h](https://github.com/nodejs/node/blob/HEAD/src/node.h) en el árbol de fuentes de Node.js. Además de las API expuestas por Node.js, V8 embedder API proporciona algunos conceptos necesarios.

Dado que el uso de Node.js como biblioteca incrustada es diferente de la escritura de código que ejecuta Node.js, los cambios importantes no siguen la [política de obsolescencia](/es/nodejs/api/deprecations) típica de Node.js y pueden producirse en cada versión semver-major sin previo aviso.

## Ejemplo de aplicación de incrustación {#example-embedding-application}

Las siguientes secciones proporcionarán una visión general sobre cómo utilizar estas API para crear una aplicación desde cero que realice el equivalente a `node -e \<code\>`, es decir, que tome un fragmento de JavaScript y lo ejecute en un entorno específico de Node.js.

El código completo se puede encontrar [en el árbol de fuentes de Node.js](https://github.com/nodejs/node/blob/HEAD/test/embedding/embedtest.cc).

### Configuración de un estado por proceso {#setting-up-a-per-process-state}

Node.js requiere alguna gestión del estado por proceso para ejecutarse:

- Análisis de argumentos para las [opciones de la CLI](/es/nodejs/api/cli) de Node.js,
- Requisitos por proceso de V8, como una instancia de `v8::Platform`.

El siguiente ejemplo muestra cómo se pueden configurar. Algunos nombres de clase son de los espacios de nombres `node` y `v8` de C++, respectivamente.

```C++ [C++]
int main(int argc, char** argv) {
  argv = uv_setup_args(argc, argv);
  std::vector<std::string> args(argv, argv + argc);
  // Analiza las opciones de la CLI de Node.js e imprime cualquier error que se haya producido al
  // intentar analizarlas.
  std::unique_ptr<node::InitializationResult> result =
      node::InitializeOncePerProcess(args, {
        node::ProcessInitializationFlags::kNoInitializeV8,
        node::ProcessInitializationFlags::kNoInitializeNodeV8Platform
      });

  for (const std::string& error : result->errors())
    fprintf(stderr, "%s: %s\n", args[0].c_str(), error.c_str());
  if (result->early_return() != 0) {
    return result->exit_code();
  }

  // Crea una instancia de v8::Platform. `MultiIsolatePlatform::Create()` es una forma
  // de crear una instancia de v8::Platform que Node.js puede utilizar al crear
  // hilos Worker. Cuando no hay ninguna instancia de `MultiIsolatePlatform`,
  // los hilos Worker están desactivados.
  std::unique_ptr<MultiIsolatePlatform> platform =
      MultiIsolatePlatform::Create(4);
  V8::InitializePlatform(platform.get());
  V8::Initialize();

  // Consulte a continuación el contenido de esta función.
  int ret = RunNodeInstance(
      platform.get(), result->args(), result->exec_args());

  V8::Dispose();
  V8::DisposePlatform();

  node::TearDownOncePerProcess();
  return ret;
}
```

### Configuración de un estado por instancia {#setting-up-a-per-instance-state}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v15.0.0 | Se añadieron las utilidades `CommonEnvironmentSetup` y `SpinEventLoop`. |
:::

Node.js tiene un concepto de "instancia de Node.js", que comúnmente se conoce como `node::Environment`. Cada `node::Environment` está asociado con:

- Exactamente un `v8::Isolate`, es decir, una instancia de motor de JS,
- Exactamente un `uv_loop_t`, es decir, un bucle de eventos,
- Un número de `v8::Context`s, pero exactamente un `v8::Context` principal, y
- Una instancia de `node::IsolateData` que contiene información que podría ser compartida por múltiples `node::Environment`s. El incrustador debe asegurarse de que `node::IsolateData` solo se comparta entre `node::Environment`s que usan el mismo `v8::Isolate`, Node.js no realiza esta comprobación.

Para configurar un `v8::Isolate`, se necesita proporcionar un `v8::ArrayBuffer::Allocator`. Una posible opción es el asignador predeterminado de Node.js, que se puede crear a través de `node::ArrayBufferAllocator::Create()`. El uso del asignador de Node.js permite pequeñas optimizaciones de rendimiento cuando los complementos utilizan la API `Buffer` de C++ de Node.js, y es necesario para realizar un seguimiento de la memoria de `ArrayBuffer` en [`process.memoryUsage()`](/es/nodejs/api/process#processmemoryusage).

Además, cada `v8::Isolate` que se utiliza para una instancia de Node.js necesita ser registrado y anulado el registro con la instancia `MultiIsolatePlatform`, si se está utilizando una, para que la plataforma sepa qué bucle de eventos utilizar para las tareas programadas por el `v8::Isolate`.

La función auxiliar `node::NewIsolate()` crea un `v8::Isolate`, lo configura con algunos enlaces específicos de Node.js (por ejemplo, el controlador de errores de Node.js) y lo registra automáticamente en la plataforma.

```C++ [C++]
int RunNodeInstance(MultiIsolatePlatform* platform,
                    const std::vector<std::string>& args,
                    const std::vector<std::string>& exec_args) {
  int exit_code = 0;

  // Configurar un bucle de eventos libuv, v8::Isolate y entorno de Node.js.
  std::vector<std::string> errors;
  std::unique_ptr<CommonEnvironmentSetup> setup =
      CommonEnvironmentSetup::Create(platform, &errors, args, exec_args);
  if (!setup) {
    for (const std::string& err : errors)
      fprintf(stderr, "%s: %s\n", args[0].c_str(), err.c_str());
    return 1;
  }

  Isolate* isolate = setup->isolate();
  Environment* env = setup->env();

  {
    Locker locker(isolate);
    Isolate::Scope isolate_scope(isolate);
    HandleScope handle_scope(isolate);
    // El v8::Context necesita ser ingresado cuando node::CreateEnvironment() y
    // node::LoadEnvironment() están siendo llamados.
    Context::Scope context_scope(setup->context());

    // Configurar la instancia de Node.js para la ejecución y ejecutar el código dentro de ella.
    // También hay una variante que toma una devolución de llamada y le proporciona
    // los objetos `require` y `process`, para que pueda compilar y
    // ejecutar scripts manualmente según sea necesario.
    // La función `require` dentro de este script *no* accede al sistema de archivos,
    // y solo puede cargar módulos integrados de Node.js.
    // `module.createRequire()` se está utilizando para crear uno que pueda
    // cargar archivos desde el disco, y utiliza el cargador de archivos CommonJS estándar
    // en lugar de la función `require` solo interna.
    MaybeLocal<Value> loadenv_ret = node::LoadEnvironment(
        env,
        "const publicRequire ="
        "  require('node:module').createRequire(process.cwd() + '/');"
        "globalThis.require = publicRequire;"
        "require('node:vm').runInThisContext(process.argv[1]);");

    if (loadenv_ret.IsEmpty())  // Ha habido una excepción de JS.
      return 1;

    exit_code = node::SpinEventLoop(env).FromMaybe(1);

    // node::Stop() se puede utilizar para detener explícitamente el bucle de eventos y evitar
    // que se ejecute más JavaScript. Se puede llamar desde cualquier hilo,
    // y actuará como worker.terminate() si se llama desde otro hilo.
    node::Stop(env);
  }

  return exit_code;
}
```
