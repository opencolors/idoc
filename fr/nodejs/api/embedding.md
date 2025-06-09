---
title: API d'incorporation de Node.js
description: Découvrez comment intégrer Node.js dans des applications C/C++, permettant aux développeurs d'utiliser le runtime JavaScript de Node.js dans leurs applications natives.
head:
  - - meta
    - name: og:title
      content: API d'incorporation de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Découvrez comment intégrer Node.js dans des applications C/C++, permettant aux développeurs d'utiliser le runtime JavaScript de Node.js dans leurs applications natives.
  - - meta
    - name: twitter:title
      content: API d'incorporation de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Découvrez comment intégrer Node.js dans des applications C/C++, permettant aux développeurs d'utiliser le runtime JavaScript de Node.js dans leurs applications natives.
---


# API C++ d'intégration {#c-embedder-api}

Node.js fournit un certain nombre d'API C++ qui peuvent être utilisées pour exécuter du JavaScript dans un environnement Node.js à partir d'autres logiciels C++.

La documentation de ces API se trouve dans [src/node.h](https://github.com/nodejs/node/blob/HEAD/src/node.h) dans l'arborescence des sources de Node.js. En plus des API exposées par Node.js, certains concepts requis sont fournis par l'API d'intégration V8.

Comme l'utilisation de Node.js en tant que bibliothèque intégrée est différente de l'écriture de code exécuté par Node.js, les changements cassants ne suivent pas la [politique de dépréciation](/fr/nodejs/api/deprecations) typique de Node.js et peuvent se produire à chaque version semver-major sans avertissement préalable.

## Exemple d'application d'intégration {#example-embedding-application}

Les sections suivantes donneront un aperçu de la façon d'utiliser ces API pour créer une application à partir de zéro qui effectuera l'équivalent de `node -e \<code\>`, c'est-à-dire qui prendra un morceau de JavaScript et l'exécutera dans un environnement spécifique à Node.js.

Le code complet se trouve [dans l'arborescence des sources de Node.js](https://github.com/nodejs/node/blob/HEAD/test/embedding/embedtest.cc).

### Configuration d'un état par processus {#setting-up-a-per-process-state}

Node.js nécessite une certaine gestion de l'état par processus pour fonctionner :

- Analyse des arguments pour les [options CLI](/fr/nodejs/api/cli) de Node.js,
- Exigences par processus de V8, telles qu'une instance `v8::Platform`.

L'exemple suivant montre comment ces éléments peuvent être configurés. Certains noms de classes proviennent respectivement des espaces de noms C++ `node` et `v8`.

```C++ [C++]
int main(int argc, char** argv) {
  argv = uv_setup_args(argc, argv);
  std::vector<std::string> args(argv, argv + argc);
  // Analyser les options CLI de Node.js et afficher les erreurs qui se sont produites lors de la tentative
  // de les analyser.
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

  // Créer une instance v8::Platform. `MultiIsolatePlatform::Create()` est un moyen
  // de créer une instance v8::Platform que Node.js peut utiliser lors de la création
  // de threads Worker. Lorsqu'aucune instance `MultiIsolatePlatform` n'est présente,
  // les threads Worker sont désactivés.
  std::unique_ptr<MultiIsolatePlatform> platform =
      MultiIsolatePlatform::Create(4);
  V8::InitializePlatform(platform.get());
  V8::Initialize();

  // Voir ci-dessous pour le contenu de cette fonction.
  int ret = RunNodeInstance(
      platform.get(), result->args(), result->exec_args());

  V8::Dispose();
  V8::DisposePlatform();

  node::TearDownOncePerProcess();
  return ret;
}
```

### Configuration d'un état par instance {#setting-up-a-per-instance-state}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v15.0.0 | Les utilitaires `CommonEnvironmentSetup` et `SpinEventLoop` ont été ajoutés. |
:::

Node.js a un concept d'"instance Node.js", qui est communément appelé `node::Environment`. Chaque `node::Environment` est associé à :

- Exactement un `v8::Isolate`, c'est-à-dire une instance de moteur JS,
- Exactement un `uv_loop_t`, c'est-à-dire une boucle d'événements,
- Un certain nombre de `v8::Context`, mais exactement un `v8::Context` principal, et
- Une instance `node::IsolateData` qui contient des informations qui pourraient être partagées par plusieurs `node::Environment`. L'intégrateur doit s'assurer que `node::IsolateData` n'est partagé qu'entre les `node::Environment` qui utilisent le même `v8::Isolate`, Node.js n'effectue pas cette vérification.

Afin de configurer un `v8::Isolate`, un `v8::ArrayBuffer::Allocator` doit être fourni. Un choix possible est l'allocateur Node.js par défaut, qui peut être créé via `node::ArrayBufferAllocator::Create()`. L'utilisation de l'allocateur Node.js permet des optimisations de performance mineures lorsque les addons utilisent l'API C++ `Buffer` de Node.js, et est nécessaire pour suivre la mémoire `ArrayBuffer` dans [`process.memoryUsage()`](/fr/nodejs/api/process#processmemoryusage).

De plus, chaque `v8::Isolate` qui est utilisé pour une instance Node.js doit être enregistré et désenregistré auprès de l'instance `MultiIsolatePlatform`, si elle est utilisée, afin que la plateforme sache quelle boucle d'événements utiliser pour les tâches planifiées par le `v8::Isolate`.

La fonction d'assistance `node::NewIsolate()` crée un `v8::Isolate`, le configure avec des hooks spécifiques à Node.js (par exemple, le gestionnaire d'erreurs Node.js) et l'enregistre automatiquement auprès de la plateforme.

```C++ [C++]
int RunNodeInstance(MultiIsolatePlatform* platform,
                    const std::vector<std::string>& args,
                    const std::vector<std::string>& exec_args) {
  int exit_code = 0;

  // Configuration d'une boucle d'événements libuv, v8::Isolate, et Environment Node.js.
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
    // Le v8::Context doit être entré lorsque node::CreateEnvironment() et
    // node::LoadEnvironment() sont appelés.
    Context::Scope context_scope(setup->context());

    // Configurez l'instance Node.js pour l'exécution et exécutez le code à l'intérieur.
    // Il existe également une variante qui prend un callback et lui fournit
    // les objets `require` et `process`, afin qu'il puisse compiler manuellement
    // et exécuter des scripts selon les besoins.
    // La fonction `require` à l'intérieur de ce script n'accède *pas* au système de fichiers,
    // et ne peut charger que les modules Node.js intégrés.
    // `module.createRequire()` est utilisé pour en créer un capable de
    // charger des fichiers à partir du disque, et utilise le chargeur de fichiers CommonJS standard
    // au lieu de la fonction `require` interne uniquement.
    MaybeLocal<Value> loadenv_ret = node::LoadEnvironment(
        env,
        "const publicRequire ="
        "  require('node:module').createRequire(process.cwd() + '/');"
        "globalThis.require = publicRequire;"
        "require('node:vm').runInThisContext(process.argv[1]);");

    if (loadenv_ret.IsEmpty())  // Il y a eu une exception JS.
      return 1;

    exit_code = node::SpinEventLoop(env).FromMaybe(1);

    // node::Stop() peut être utilisé pour arrêter explicitement la boucle d'événements et empêcher
    // l'exécution d'autres JavaScript. Il peut être appelé depuis n'importe quel thread,
    // et agira comme worker.terminate() s'il est appelé depuis un autre thread.
    node::Stop(env);
  }

  return exit_code;
}
```
