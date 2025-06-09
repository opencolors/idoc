---
title: API di Incorporazione di Node.js
description: Scopri come incorporare Node.js nelle applicazioni C/C++, permettendo agli sviluppatori di sfruttare il runtime JavaScript di Node.js all'interno delle loro applicazioni native.
head:
  - - meta
    - name: og:title
      content: API di Incorporazione di Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Scopri come incorporare Node.js nelle applicazioni C/C++, permettendo agli sviluppatori di sfruttare il runtime JavaScript di Node.js all'interno delle loro applicazioni native.
  - - meta
    - name: twitter:title
      content: API di Incorporazione di Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Scopri come incorporare Node.js nelle applicazioni C/C++, permettendo agli sviluppatori di sfruttare il runtime JavaScript di Node.js all'interno delle loro applicazioni native.
---


# API C++ per l'incorporamento {#c-embedder-api}

Node.js fornisce una serie di API C++ che possono essere utilizzate per eseguire JavaScript in un ambiente Node.js da altri software C++.

La documentazione di queste API è disponibile in [src/node.h](https://github.com/nodejs/node/blob/HEAD/src/node.h) nell'albero dei sorgenti di Node.js. Oltre alle API esposte da Node.js, alcuni concetti richiesti sono forniti dall'API di incorporamento V8.

Poiché l'utilizzo di Node.js come libreria incorporata è diverso dalla scrittura di codice eseguito da Node.js, le modifiche che causano interruzioni non seguono la tipica [politica di deprecazione](/it/nodejs/api/deprecations) di Node.js e possono verificarsi in ogni rilascio semver-major senza preavviso.

## Esempio di applicazione di incorporamento {#example-embedding-application}

Le seguenti sezioni forniranno una panoramica su come utilizzare queste API per creare un'applicazione da zero che eseguirà l'equivalente di `node -e \<code\>`, ovvero che prenderà un pezzo di JavaScript e lo eseguirà in un ambiente specifico di Node.js.

Il codice completo è disponibile [nell'albero dei sorgenti di Node.js](https://github.com/nodejs/node/blob/HEAD/test/embedding/embedtest.cc).

### Impostazione di uno stato per processo {#setting-up-a-per-process-state}

Node.js richiede una certa gestione dello stato per processo per poter essere eseguito:

- Analisi degli argomenti per le [opzioni CLI](/it/nodejs/api/cli) di Node.js,
- Requisiti per processo di V8, come un'istanza di `v8::Platform`.

L'esempio seguente mostra come questi possono essere impostati. Alcuni nomi di classe provengono rispettivamente dagli spazi dei nomi C++ `node` e `v8`.

```C++ [C++]
int main(int argc, char** argv) {
  argv = uv_setup_args(argc, argv);
  std::vector<std::string> args(argv, argv + argc);
  // Analizza le opzioni CLI di Node.js e stampa eventuali errori che si sono verificati durante
  // il tentativo di analizzarle.
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

  // Crea un'istanza di v8::Platform. `MultiIsolatePlatform::Create()` è un modo
  // per creare un'istanza di v8::Platform che Node.js può utilizzare durante la creazione
  // di thread Worker. Quando non è presente un'istanza di `MultiIsolatePlatform`,
  // i thread Worker sono disabilitati.
  std::unique_ptr<MultiIsolatePlatform> platform =
      MultiIsolatePlatform::Create(4);
  V8::InitializePlatform(platform.get());
  V8::Initialize();

  // Vedere di seguito per il contenuto di questa funzione.
  int ret = RunNodeInstance(
      platform.get(), result->args(), result->exec_args());

  V8::Dispose();
  V8::DisposePlatform();

  node::TearDownOncePerProcess();
  return ret;
}
```

### Impostazione di uno stato per istanza {#setting-up-a-per-instance-state}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v15.0.0 | Sono state aggiunte le utility `CommonEnvironmentSetup` e `SpinEventLoop`. |
:::

Node.js ha un concetto di "istanza Node.js", che viene comunemente indicato come `node::Environment`. Ogni `node::Environment` è associato a:

- Esattamente un `v8::Isolate`, ovvero un'istanza di JS Engine,
- Esattamente un `uv_loop_t`, ovvero un ciclo di eventi,
- Un numero di `v8::Context`, ma esattamente un `v8::Context` principale, e
- Un'istanza `node::IsolateData` che contiene informazioni che potrebbero essere condivise da più `node::Environment`. L'embedder deve assicurarsi che `node::IsolateData` sia condiviso solo tra `node::Environment` che utilizzano lo stesso `v8::Isolate`, Node.js non esegue questo controllo.

Per impostare un `v8::Isolate`, è necessario fornire un `v8::ArrayBuffer::Allocator`. Una possibile scelta è l'allocatore predefinito di Node.js, che può essere creato tramite `node::ArrayBufferAllocator::Create()`. L'utilizzo dell'allocatore Node.js consente piccole ottimizzazioni delle prestazioni quando gli addon utilizzano l'API C++ `Buffer` di Node.js ed è necessario per tracciare la memoria `ArrayBuffer` in [`process.memoryUsage()`](/it/nodejs/api/process#processmemoryusage).

Inoltre, ogni `v8::Isolate` utilizzato per un'istanza Node.js deve essere registrato e deregistrato con l'istanza `MultiIsolatePlatform`, se ne viene utilizzata una, affinché la piattaforma sappia quale ciclo di eventi utilizzare per le attività pianificate da `v8::Isolate`.

La funzione helper `node::NewIsolate()` crea un `v8::Isolate`, lo imposta con alcuni hook specifici di Node.js (ad esempio, il gestore degli errori di Node.js) e lo registra automaticamente con la piattaforma.

```C++ [C++]
int RunNodeInstance(MultiIsolatePlatform* platform,
                    const std::vector<std::string>& args,
                    const std::vector<std::string>& exec_args) {
  int exit_code = 0;

  // Imposta un ciclo di eventi libuv, v8::Isolate e Node.js Environment.
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
    // Il v8::Context deve essere inserito quando vengono chiamati node::CreateEnvironment() e
    // node::LoadEnvironment().
    Context::Scope context_scope(setup->context());

    // Imposta l'istanza Node.js per l'esecuzione ed esegue il codice al suo interno.
    // Esiste anche una variante che accetta un callback e gli fornisce
    // gli oggetti `require` e `process`, in modo che possa compilare manualmente
    // ed eseguire script secondo necessità.
    // La funzione `require` all'interno di questo script *non* accede al file
    // system e può caricare solo i moduli Node.js integrati.
    // `module.createRequire()` viene utilizzato per crearne uno in grado di
    // caricare file dal disco e utilizza il loader di file CommonJS standard
    // invece della funzione `require` solo interna.
    MaybeLocal<Value> loadenv_ret = node::LoadEnvironment(
        env,
        "const publicRequire ="
        "  require('node:module').createRequire(process.cwd() + '/');"
        "globalThis.require = publicRequire;"
        "require('node:vm').runInThisContext(process.argv[1]);");

    if (loadenv_ret.IsEmpty())  // Si è verificata un'eccezione JS.
      return 1;

    exit_code = node::SpinEventLoop(env).FromMaybe(1);

    // node::Stop() può essere utilizzato per arrestare esplicitamente il ciclo di eventi e impedire
    // l'ulteriore esecuzione di JavaScript. Può essere chiamato da qualsiasi thread,
    // e si comporterà come worker.terminate() se chiamato da un altro thread.
    node::Stop(env);
  }

  return exit_code;
}
```
