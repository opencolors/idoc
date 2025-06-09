---
title: Node.js Einbettungs-API
description: Erfahren Sie, wie Sie Node.js in C/C++-Anwendungen einbetten können, um Entwicklern die Nutzung der JavaScript-Laufzeitumgebung von Node.js in ihren nativen Anwendungen zu ermöglichen.
head:
  - - meta
    - name: og:title
      content: Node.js Einbettungs-API | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Erfahren Sie, wie Sie Node.js in C/C++-Anwendungen einbetten können, um Entwicklern die Nutzung der JavaScript-Laufzeitumgebung von Node.js in ihren nativen Anwendungen zu ermöglichen.
  - - meta
    - name: twitter:title
      content: Node.js Einbettungs-API | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Erfahren Sie, wie Sie Node.js in C/C++-Anwendungen einbetten können, um Entwicklern die Nutzung der JavaScript-Laufzeitumgebung von Node.js in ihren nativen Anwendungen zu ermöglichen.
---


# C++ Embedder API {#c-embedder-api}

Node.js bietet eine Reihe von C++-APIs, die verwendet werden können, um JavaScript in einer Node.js-Umgebung aus anderer C++-Software auszuführen.

Die Dokumentation für diese APIs befindet sich in [src/node.h](https://github.com/nodejs/node/blob/HEAD/src/node.h) im Node.js-Quellbaum. Zusätzlich zu den von Node.js bereitgestellten APIs werden einige erforderliche Konzepte von der V8 Embedder API bereitgestellt.

Da die Verwendung von Node.js als eingebettete Bibliothek sich vom Schreiben von Code unterscheidet, der von Node.js ausgeführt wird, folgen Breaking Changes nicht der typischen Node.js [Deprecation Policy](/de/nodejs/api/deprecations) und können bei jeder Semver-Major-Version ohne vorherige Warnung auftreten.

## Beispiel einer eingebetteten Anwendung {#example-embedding-application}

Die folgenden Abschnitte geben einen Überblick darüber, wie diese APIs verwendet werden können, um eine Anwendung von Grund auf neu zu erstellen, die das Äquivalent von `node -e \<code\>` ausführt, d. h. ein Stück JavaScript nimmt und es in einer Node.js-spezifischen Umgebung ausführt.

Der vollständige Code befindet sich [im Node.js-Quellbaum](https://github.com/nodejs/node/blob/HEAD/test/embedding/embedtest.cc).

### Einrichten eines prozessbezogenen Zustands {#setting-up-a-per-process-state}

Node.js benötigt ein gewisses prozessbezogenes Zustandsmanagement, um ausgeführt zu werden:

- Argumentparsing für Node.js [CLI-Optionen](/de/nodejs/api/cli),
- V8-Anforderungen pro Prozess, wie z. B. eine `v8::Platform`-Instanz.

Das folgende Beispiel zeigt, wie diese eingerichtet werden können. Einige Klassennamen stammen aus den C++-Namespaces `node` bzw. `v8`.

```C++ [C++]
int main(int argc, char** argv) {
  argv = uv_setup_args(argc, argv);
  std::vector<std::string> args(argv, argv + argc);
  // Node.js CLI-Optionen parsen und alle Fehler ausgeben, die beim Parsen
  // aufgetreten sind.
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

  // Eine v8::Platform-Instanz erstellen. `MultiIsolatePlatform::Create()` ist eine
  // Möglichkeit, eine v8::Platform-Instanz zu erstellen, die Node.js beim Erstellen
  // von Worker-Threads verwenden kann. Wenn keine `MultiIsolatePlatform`-Instanz vorhanden
  // ist, sind Worker-Threads deaktiviert.
  std::unique_ptr<MultiIsolatePlatform> platform =
      MultiIsolatePlatform::Create(4);
  V8::InitializePlatform(platform.get());
  V8::Initialize();

  // Den Inhalt dieser Funktion finden Sie weiter unten.
  int ret = RunNodeInstance(
      platform.get(), result->args(), result->exec_args());

  V8::Dispose();
  V8::DisposePlatform();

  node::TearDownOncePerProcess();
  return ret;
}
```

### Einrichten eines instanzspezifischen Zustands {#setting-up-a-per-instance-state}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v15.0.0 | Die Hilfsprogramme `CommonEnvironmentSetup` und `SpinEventLoop` wurden hinzugefügt. |
:::

Node.js hat ein Konzept einer "Node.js-Instanz", die üblicherweise als `node::Environment` bezeichnet wird. Jede `node::Environment` ist mit Folgendem verbunden:

- Genau ein `v8::Isolate`, d. h. eine JS-Engine-Instanz,
- Genau eine `uv_loop_t`, d. h. eine Ereignisschleife,
- Eine Anzahl von `v8::Context`s, aber genau ein Haupt-`v8::Context` und
- Eine `node::IsolateData`-Instanz, die Informationen enthält, die von mehreren `node::Environment`s gemeinsam genutzt werden könnten. Der Embedder sollte sicherstellen, dass `node::IsolateData` nur zwischen `node::Environment`s gemeinsam genutzt wird, die dasselbe `v8::Isolate` verwenden. Node.js führt diese Prüfung nicht durch.

Um ein `v8::Isolate` einzurichten, muss ein `v8::ArrayBuffer::Allocator` bereitgestellt werden. Eine mögliche Wahl ist der standardmäßige Node.js-Allocator, der über `node::ArrayBufferAllocator::Create()` erstellt werden kann. Die Verwendung des Node.js-Allocators ermöglicht geringfügige Leistungsoptimierungen, wenn Addons die Node.js C++ `Buffer`-API verwenden, und ist erforderlich, um den `ArrayBuffer`-Speicher in [`process.memoryUsage()`](/de/nodejs/api/process#processmemoryusage) zu verfolgen.

Zusätzlich muss jedes `v8::Isolate`, das für eine Node.js-Instanz verwendet wird, bei der `MultiIsolatePlatform`-Instanz registriert und abgemeldet werden, falls eine verwendet wird, damit die Plattform weiß, welche Ereignisschleife für von der `v8::Isolate` geplante Aufgaben verwendet werden soll.

Die Hilfsfunktion `node::NewIsolate()` erstellt ein `v8::Isolate`, richtet es mit einigen Node.js-spezifischen Hooks ein (z. B. dem Node.js-Fehlerhandler) und registriert es automatisch bei der Plattform.

```C++ [C++]
int RunNodeInstance(MultiIsolatePlatform* platform,
                    const std::vector<std::string>& args,
                    const std::vector<std::string>& exec_args) {
  int exit_code = 0;

  // Einrichten einer libuv-Ereignisschleife, v8::Isolate und Node.js-Umgebung.
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
    // Der v8::Context muss eingegeben werden, wenn node::CreateEnvironment() und
    // node::LoadEnvironment() aufgerufen werden.
    Context::Scope context_scope(setup->context());

    // Richten Sie die Node.js-Instanz zur Ausführung ein und führen Sie Code darin aus.
    // Es gibt auch eine Variante, die einen Callback entgegennimmt und ihn mit den
    // `require`- und `process`-Objekten versorgt, sodass er bei Bedarf manuell
    // Skripte kompilieren und ausführen kann.
    // Die `require`-Funktion innerhalb dieses Skripts greift *nicht* auf das
    // Dateisystem zu und kann nur integrierte Node.js-Module laden.
    // `module.createRequire()` wird verwendet, um eines zu erstellen, das Dateien
    // von der Festplatte laden kann und anstelle der internen `require`-Funktion
    // den standardmäßigen CommonJS-Dateilader verwendet.
    MaybeLocal<Value> loadenv_ret = node::LoadEnvironment(
        env,
        "const publicRequire ="
        "  require('node:module').createRequire(process.cwd() + '/');"
        "globalThis.require = publicRequire;"
        "require('node:vm').runInThisContext(process.argv[1]);");

    if (loadenv_ret.IsEmpty())  // Es gab eine JS-Ausnahme.
      return 1;

    exit_code = node::SpinEventLoop(env).FromMaybe(1);

    // node::Stop() kann verwendet werden, um die Ereignisschleife explizit zu
    // stoppen und zu verhindern, dass weiterer JavaScript-Code ausgeführt wird.
    // Es kann von jedem Thread aufgerufen werden und verhält sich wie
    // worker.terminate(), wenn es von einem anderen Thread aufgerufen wird.
    node::Stop(env);
  }

  return exit_code;
}
```
