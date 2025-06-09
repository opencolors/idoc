---
title: Node.js Addons
description: Erfahren Sie, wie Sie Node.js-Addons mit C++ erstellen, um die Funktionalität von Node.js-Anwendungen zu erweitern, einschließlich Beispiele und API-Referenzen.
head:
  - - meta
    - name: og:title
      content: Node.js Addons | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Erfahren Sie, wie Sie Node.js-Addons mit C++ erstellen, um die Funktionalität von Node.js-Anwendungen zu erweitern, einschließlich Beispiele und API-Referenzen.
  - - meta
    - name: twitter:title
      content: Node.js Addons | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Erfahren Sie, wie Sie Node.js-Addons mit C++ erstellen, um die Funktionalität von Node.js-Anwendungen zu erweitern, einschließlich Beispiele und API-Referenzen.
---


# C++-Add-ons {#c-addons}

*Add-ons* sind dynamisch verknüpfte Shared Objects, die in C++ geschrieben sind. Die Funktion [`require()`](/de/nodejs/api/modules#requireid) kann Add-ons als normale Node.js-Module laden. Add-ons stellen eine Schnittstelle zwischen JavaScript und C/C++-Bibliotheken bereit.

Es gibt drei Optionen zur Implementierung von Add-ons:

- Node-API
- `nan` ([Native Abstractions for Node.js](https://github.com/nodejs/nan))
- Direkte Verwendung von internen V8-, libuv- und Node.js-Bibliotheken

Sofern kein direkter Zugriff auf Funktionen erforderlich ist, die nicht von Node-API bereitgestellt werden, sollte Node-API verwendet werden. Weitere Informationen zu Node-API finden Sie unter [C/C++-Add-ons mit Node-API](/de/nodejs/api/n-api).

Wenn Node-API nicht verwendet wird, wird die Implementierung von Add-ons komplexer und erfordert Kenntnisse über mehrere Komponenten und APIs:

- [V8](https://v8.dev/): Die C++-Bibliothek, die Node.js zur Bereitstellung der JavaScript-Implementierung verwendet. Sie stellt die Mechanismen zum Erstellen von Objekten, Aufrufen von Funktionen usw. bereit. Die V8-API ist hauptsächlich in der Header-Datei `v8.h` dokumentiert (`deps/v8/include/v8.h` im Node.js-Quellcodebaum) und ist auch [online](https://v8docs.nodesource.com/) verfügbar.
- [libuv](https://github.com/libuv/libuv): Die C-Bibliothek, die die Node.js-Ereignisschleife, ihre Worker-Threads und alle asynchronen Verhaltensweisen der Plattform implementiert. Sie dient auch als plattformübergreifende Abstraktionsbibliothek und bietet auf allen wichtigen Betriebssystemen einen einfachen, POSIX-ähnlichen Zugriff auf viele gängige Systemaufgaben, wie z. B. die Interaktion mit dem Dateisystem, Sockets, Timern und Systemereignissen. libuv bietet auch eine Threading-Abstraktion, die POSIX-Threads ähnelt, für komplexere asynchrone Add-ons, die über die standardmäßige Ereignisschleife hinausgehen müssen. Add-on-Autoren sollten vermeiden, die Ereignisschleife mit E/A oder anderen zeitintensiven Aufgaben zu blockieren, indem sie die Arbeit über libuv an nicht blockierende Systemoperationen, Worker-Threads oder eine benutzerdefinierte Verwendung von libuv-Threads auslagern.
- Interne Node.js-Bibliotheken: Node.js selbst exportiert C++-APIs, die von Add-ons verwendet werden können, wobei die wichtigste die Klasse `node::ObjectWrap` ist.
- Andere statisch verknüpfte Bibliotheken (einschließlich OpenSSL): Diese anderen Bibliotheken befinden sich im Verzeichnis `deps/` im Node.js-Quellcodebaum. Nur die Symbole libuv, OpenSSL, V8 und zlib werden von Node.js absichtlich erneut exportiert und können von Add-ons in unterschiedlichem Umfang verwendet werden. Weitere Informationen finden Sie unter [Verknüpfung mit in Node.js enthaltenen Bibliotheken](/de/nodejs/api/addons#linking-to-libraries-included-with-nodejs).

Alle folgenden Beispiele stehen zum [Download](https://github.com/nodejs/node-addon-examples) zur Verfügung und können als Ausgangspunkt für ein Add-on verwendet werden.


## Hello world {#hello-world}

Dieses "Hello world"-Beispiel ist ein einfaches Add-on, geschrieben in C++, das dem folgenden JavaScript-Code entspricht:

```js [ESM]
module.exports.hello = () => 'world';
```
Erstellen Sie zuerst die Datei `hello.cc`:

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
Alle Node.js-Add-ons müssen eine Initialisierungsfunktion nach folgendem Muster exportieren:

```C++ [C++]
void Initialize(Local<Object> exports);
NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)
```
Nach `NODE_MODULE` steht kein Semikolon, da es sich nicht um eine Funktion handelt (siehe `node.h`).

Der `module_name` muss mit dem Dateinamen der endgültigen Binärdatei übereinstimmen (ohne das Suffix `.node`).

Im Beispiel `hello.cc` ist die Initialisierungsfunktion also `Initialize` und der Add-on-Modulname ist `addon`.

Beim Erstellen von Add-ons mit `node-gyp` stellt die Verwendung des Makros `NODE_GYP_MODULE_NAME` als erster Parameter von `NODE_MODULE()` sicher, dass der Name der endgültigen Binärdatei an `NODE_MODULE()` übergeben wird.

Add-ons, die mit `NODE_MODULE()` definiert wurden, können nicht gleichzeitig in mehreren Kontexten oder mehreren Threads geladen werden.

### Kontextsensitive Add-ons {#context-aware-addons}

Es gibt Umgebungen, in denen Node.js-Add-ons möglicherweise mehrmals in mehreren Kontexten geladen werden müssen. Beispielsweise führt die [Electron](https://electronjs.org/)-Runtime mehrere Instanzen von Node.js in einem einzigen Prozess aus. Jede Instanz verfügt über einen eigenen `require()`-Cache, und daher benötigt jede Instanz ein natives Add-on, um sich beim Laden über `require()` korrekt zu verhalten. Dies bedeutet, dass das Add-on mehrere Initialisierungen unterstützen muss.

Ein kontextsensitives Add-on kann mithilfe des Makros `NODE_MODULE_INITIALIZER` erstellt werden, das zu dem Namen einer Funktion erweitert wird, die Node.js beim Laden eines Add-ons erwartet. Ein Add-on kann somit wie im folgenden Beispiel initialisiert werden:

```C++ [C++]
using namespace v8;

extern "C" NODE_MODULE_EXPORT void
NODE_MODULE_INITIALIZER(Local<Object> exports,
                        Local<Value> module,
                        Local<Context> context) {
  /* Führen Sie hier Initialisierungsschritte für das Add-on durch. */
}
```
Eine andere Möglichkeit ist die Verwendung des Makros `NODE_MODULE_INIT()`, das ebenfalls ein kontextsensitives Add-on erstellt. Im Gegensatz zu `NODE_MODULE()`, das zum Erstellen eines Add-ons um eine bestimmte Add-on-Initialisierungsfunktion verwendet wird, dient `NODE_MODULE_INIT()` als Deklaration einer solchen Initialisierung, auf die ein Funktionskörper folgt.

Die folgenden drei Variablen können innerhalb des Funktionskörpers nach einem Aufruf von `NODE_MODULE_INIT()` verwendet werden:

- `Local\<Object\> exports`,
- `Local\<Value\> module` und
- `Local\<Context\> context`

Das Erstellen eines kontextsensitiven Add-ons erfordert eine sorgfältige Verwaltung globaler statischer Daten, um Stabilität und Korrektheit zu gewährleisten. Da das Add-on möglicherweise mehrmals geladen wird, möglicherweise sogar von verschiedenen Threads, müssen alle globalen statischen Daten, die im Add-on gespeichert sind, ordnungsgemäß geschützt werden und dürfen keine persistenten Verweise auf JavaScript-Objekte enthalten. Der Grund dafür ist, dass JavaScript-Objekte nur in einem Kontext gültig sind und wahrscheinlich einen Absturz verursachen, wenn sie vom falschen Kontext oder von einem anderen Thread als dem, auf dem sie erstellt wurden, aus aufgerufen werden.

Das kontextsensitive Add-on kann so strukturiert werden, dass globale statische Daten vermieden werden, indem die folgenden Schritte ausgeführt werden:

- Definieren Sie eine Klasse, die Daten pro Add-on-Instanz enthält und die ein statisches Element der Form hat
- Heap-allozieren Sie eine Instanz dieser Klasse im Add-on-Initialisierer. Dies kann mithilfe des Schlüsselworts `new` erreicht werden.
- Rufen Sie `node::AddEnvironmentCleanupHook()` auf und übergeben Sie ihm die oben erstellte Instanz und einen Zeiger auf `DeleteInstance()`. Dadurch wird sichergestellt, dass die Instanz gelöscht wird, wenn die Umgebung abgebaut wird.
- Speichern Sie die Instanz der Klasse in einem `v8::External` und
- Übergeben Sie das `v8::External` an alle Methoden, die JavaScript zur Verfügung gestellt werden, indem Sie es an `v8::FunctionTemplate::New()` oder `v8::Function::New()` übergeben, wodurch die nativen JavaScript-Funktionen erstellt werden. Der dritte Parameter von `v8::FunctionTemplate::New()` oder `v8::Function::New()` akzeptiert das `v8::External` und macht es im nativen Callback mithilfe der Methode `v8::FunctionCallbackInfo::Data()` verfügbar.

Dadurch wird sichergestellt, dass die Daten pro Add-on-Instanz jedes Binding erreichen, das von JavaScript aufgerufen werden kann. Die Daten pro Add-on-Instanz müssen auch an alle asynchronen Callbacks übergeben werden, die das Add-on möglicherweise erstellt.

Das folgende Beispiel veranschaulicht die Implementierung eines kontextsensitiven Add-ons:

```C++ [C++]
#include <node.h>

using namespace v8;

class AddonData {
 public:
  explicit AddonData(Isolate* isolate):
      call_count(0) {
    // Stellen Sie sicher, dass diese Daten pro Add-on-Instanz bei der Bereinigung der Umgebung gelöscht werden.
    node::AddEnvironmentCleanupHook(isolate, DeleteInstance, this);
  }

  // Daten pro Add-on.
  int call_count;

  static void DeleteInstance(void* data) {
    delete static_cast<AddonData*>(data);
  }
};

static void Method(const v8::FunctionCallbackInfo<v8::Value>& info) {
  // Rufen Sie die Daten pro Add-on-Instanz ab.
  AddonData* data =
      reinterpret_cast<AddonData*>(info.Data().As<External>()->Value());
  data->call_count++;
  info.GetReturnValue().Set((double)data->call_count);
}

// Initialisieren Sie dieses Add-on als kontextsensitiv.
NODE_MODULE_INIT(/* exports, module, context */) {
  Isolate* isolate = context->GetIsolate();

  // Erstellen Sie eine neue Instanz von `AddonData` für diese Instanz des Add-ons und
  // binden Sie ihren Lebenszyklus an den der Node.js-Umgebung.
  AddonData* data = new AddonData(isolate);

  // Umschließen Sie die Daten in einem `v8::External`, damit wir sie an die Methode übergeben können, die wir
  // freigeben.
  Local<External> external = External::New(isolate, data);

  // Geben Sie die Methode `Method` für JavaScript frei und stellen Sie sicher, dass sie die
  // Daten pro Add-on-Instanz, die wir oben erstellt haben, empfängt, indem Sie `external` als
  // dritter Parameter an den `FunctionTemplate`-Konstruktor übergeben.
  exports->Set(context,
               String::NewFromUtf8(isolate, "method").ToLocalChecked(),
               FunctionTemplate::New(isolate, Method, external)
                  ->GetFunction(context).ToLocalChecked()).FromJust();
}
```

#### Worker-Unterstützung {#worker-support}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v14.8.0, v12.19.0 | Cleanup-Hooks können jetzt asynchron sein. |
:::

Um aus mehreren Node.js-Umgebungen geladen zu werden, wie z. B. einem Haupt-Thread und einem Worker-Thread, muss ein Add-on entweder:

- Ein Node-API-Add-on sein, oder
- Mit `NODE_MODULE_INIT()` als kontextabhängig deklariert werden, wie oben beschrieben

Um [`Worker`](/de/nodejs/api/worker_threads#class-worker)-Threads zu unterstützen, müssen Add-ons alle Ressourcen bereinigen, die sie möglicherweise zugewiesen haben, wenn ein solcher Thread beendet wird. Dies kann durch die Verwendung der Funktion `AddEnvironmentCleanupHook()` erreicht werden:

```C++ [C++]
void AddEnvironmentCleanupHook(v8::Isolate* isolate,
                               void (*fun)(void* arg),
                               void* arg);
```
Diese Funktion fügt einen Hook hinzu, der ausgeführt wird, bevor eine bestimmte Node.js-Instanz herunterfährt. Bei Bedarf können solche Hooks vor ihrer Ausführung mit `RemoveEnvironmentCleanupHook()` entfernt werden, die die gleiche Signatur hat. Callbacks werden in Last-In-First-Out-Reihenfolge ausgeführt.

Bei Bedarf gibt es ein zusätzliches Paar von `AddEnvironmentCleanupHook()`- und `RemoveEnvironmentCleanupHook()`-Überladungen, wobei der Cleanup-Hook eine Callback-Funktion entgegennimmt. Dies kann zum Herunterfahren asynchroner Ressourcen verwendet werden, z. B. aller von dem Add-on registrierten libuv-Handles.

Das folgende `addon.cc` verwendet `AddEnvironmentCleanupHook`:

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

// Hinweis: Verlassen Sie sich in einer realen Anwendung nicht auf statische/globale Daten.
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

// Initialisieren Sie dieses Add-on als kontextabhängig.
NODE_MODULE_INIT(/* exports, module, context */) {
  Isolate* isolate = context->GetIsolate();

  AddEnvironmentCleanupHook(isolate, sanity_check, nullptr);
  AddEnvironmentCleanupHook(isolate, cleanup_cb2, cookie);
  AddEnvironmentCleanupHook(isolate, cleanup_cb1, isolate);
}
```
Testen Sie in JavaScript, indem Sie Folgendes ausführen:

```js [ESM]
// test.js
require('./build/Release/addon');
```

### Bauen {#building}

Sobald der Quellcode geschrieben wurde, muss er in die binäre `addon.node` Datei kompiliert werden. Erstellen Sie dazu eine Datei namens `binding.gyp` im Top-Level des Projekts, die die Build-Konfiguration des Moduls in einem JSON-ähnlichen Format beschreibt. Diese Datei wird von [node-gyp](https://github.com/nodejs/node-gyp) verwendet, einem Tool, das speziell zum Kompilieren von Node.js-Addons geschrieben wurde.

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
Eine Version des `node-gyp` Utility wird mit Node.js als Teil von `npm` gebündelt und verteilt. Diese Version steht Entwicklern nicht direkt zur Verfügung und ist nur dazu gedacht, die Möglichkeit zu unterstützen, mit dem Befehl `npm install` Addons zu kompilieren und zu installieren. Entwickler, die `node-gyp` direkt verwenden möchten, können es mit dem Befehl `npm install -g node-gyp` installieren. Weitere Informationen, einschließlich plattformspezifischer Anforderungen, finden Sie in den `node-gyp` [Installationsanweisungen](https://github.com/nodejs/node-gyp#installation).

Sobald die `binding.gyp` Datei erstellt wurde, verwenden Sie `node-gyp configure`, um die entsprechenden Projekt-Build-Dateien für die aktuelle Plattform zu generieren. Dies generiert entweder eine `Makefile` (auf Unix-Plattformen) oder eine `vcxproj` Datei (auf Windows) im `build/` Verzeichnis.

Rufen Sie als Nächstes den Befehl `node-gyp build` auf, um die kompilierte `addon.node` Datei zu generieren. Diese wird in das `build/Release/` Verzeichnis gelegt.

Wenn Sie `npm install` verwenden, um ein Node.js-Addon zu installieren, verwendet npm seine eigene gebündelte Version von `node-gyp`, um denselben Satz von Aktionen auszuführen und eine kompilierte Version des Addons für die Plattform des Benutzers bei Bedarf zu generieren.

Nach dem Erstellen kann das binäre Addon innerhalb von Node.js verwendet werden, indem [`require()`](/de/nodejs/api/modules#requireid) auf das erstellte `addon.node` Modul verwiesen wird:

```js [ESM]
// hello.js
const addon = require('./build/Release/addon');

console.log(addon.hello());
// Gibt aus: 'world'
```
Da der genaue Pfad zur kompilierten Addon-Binärdatei je nachdem, wie sie kompiliert wird, variieren kann (d.h. manchmal befindet sie sich in `./build/Debug/`), können Addons das [bindings](https://github.com/TooTallNate/node-bindings) Paket verwenden, um das kompilierte Modul zu laden.

Während die `bindings` Paketimplementierung ausgefeilter ist, wie sie Addon-Module findet, verwendet sie im Wesentlichen ein `try…catch` Muster ähnlich wie:

```js [ESM]
try {
  return require('./build/Release/addon.node');
} catch (err) {
  return require('./build/Debug/addon.node');
}
```

### Verlinkung mit in Node.js enthaltenen Bibliotheken {#linking-to-libraries-included-with-nodejs}

Node.js verwendet statisch gelinkte Bibliotheken wie V8, libuv und OpenSSL. Alle Addons müssen mit V8 verlinkt werden und können auch mit anderen Abhängigkeiten verlinkt werden. In der Regel ist dies so einfach wie das Einfügen der entsprechenden `#include \<...\>`-Anweisungen (z. B. `#include \<v8.h\>`), und `node-gyp` findet die entsprechenden Header automatisch. Es gibt jedoch einige Einschränkungen zu beachten:

-  Wenn `node-gyp` ausgeführt wird, erkennt es die spezifische Release-Version von Node.js und lädt entweder das vollständige Quellcode-Tarball oder nur die Header herunter. Wenn die vollständige Quelle heruntergeladen wird, haben Addons vollständigen Zugriff auf den vollständigen Satz von Node.js-Abhängigkeiten. Wenn jedoch nur die Node.js-Header heruntergeladen werden, sind nur die von Node.js exportierten Symbole verfügbar.
-  `node-gyp` kann mit dem Flag `--nodedir` ausgeführt werden, das auf ein lokales Node.js-Quellimage zeigt. Bei Verwendung dieser Option hat das Addon Zugriff auf den vollständigen Satz von Abhängigkeiten.

### Laden von Addons mit `require()` {#loading-addons-using-require}

Die Dateinamenerweiterung der kompilierten Addon-Binärdatei ist `.node` (im Gegensatz zu `.dll` oder `.so`). Die Funktion [`require()`](/de/nodejs/api/modules#requireid) ist so geschrieben, dass sie nach Dateien mit der Dateinamenerweiterung `.node` sucht und diese als dynamisch verknüpfte Bibliotheken initialisiert.

Beim Aufruf von [`require()`](/de/nodejs/api/modules#requireid) kann die Erweiterung `.node` normalerweise weggelassen werden, und Node.js findet und initialisiert das Addon trotzdem. Eine Einschränkung ist jedoch, dass Node.js zuerst versucht, Module oder JavaScript-Dateien zu finden und zu laden, die zufällig denselben Basisnamen haben. Wenn sich beispielsweise eine Datei `addon.js` im selben Verzeichnis wie die Binärdatei `addon.node` befindet, hat [`require('addon')`](/de/nodejs/api/modules#requireid) Vorrang vor der Datei `addon.js` und lädt diese stattdessen.

## Native Abstraktionen für Node.js {#native-abstractions-for-nodejs}

Jedes der in diesem Dokument veranschaulichten Beispiele verwendet direkt die Node.js- und V8-APIs zur Implementierung von Addons. Die V8-API kann sich von einem V8-Release zum nächsten (und von einem Major-Release von Node.js zum nächsten) dramatisch geändert haben und hat dies auch getan. Mit jeder Änderung müssen Addons möglicherweise aktualisiert und neu kompiliert werden, damit sie weiterhin funktionieren. Der Node.js-Release-Zeitplan ist so konzipiert, dass die Häufigkeit und die Auswirkungen solcher Änderungen minimiert werden, aber Node.js kann wenig tun, um die Stabilität der V8-APIs zu gewährleisten.

Die [Native Abstractions for Node.js](https://github.com/nodejs/nan) (oder `nan`) bieten eine Reihe von Tools, die Addon-Entwicklern empfohlen werden, um die Kompatibilität zwischen früheren und zukünftigen Versionen von V8 und Node.js zu gewährleisten. Siehe die `nan` [Beispiele](https://github.com/nodejs/nan/tree/HEAD/examples/) für eine Veranschaulichung, wie sie verwendet werden können.


## Node-API {#node-api}

::: tip [Stabil: 2 - Stabil]
[Stabil: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil
:::

Node-API ist eine API zum Erstellen nativer Add-ons. Sie ist unabhängig von der zugrunde liegenden JavaScript-Laufzeitumgebung (z. B. V8) und wird als Teil von Node.js selbst verwaltet. Diese API ist Application Binary Interface (ABI)-stabil über verschiedene Versionen von Node.js hinweg. Sie soll Add-ons vor Änderungen in der zugrunde liegenden JavaScript-Engine schützen und es Modulen, die für eine Version kompiliert wurden, ermöglichen, ohne Neukompilierung auf späteren Versionen von Node.js zu laufen. Add-ons werden mit dem gleichen Ansatz/den gleichen Tools erstellt/verpackt, die in diesem Dokument beschrieben sind (node-gyp usw.). Der einzige Unterschied ist die Menge der APIs, die vom nativen Code verwendet werden. Anstatt die V8- oder [Native Abstractions for Node.js](https://github.com/nodejs/nan)-APIs zu verwenden, werden die in der Node-API verfügbaren Funktionen verwendet.

Das Erstellen und Warten eines Add-ons, das von der durch Node-API bereitgestellten ABI-Stabilität profitiert, bringt bestimmte [Implementierungsüberlegungen](/de/nodejs/api/n-api#implications-of-abi-stability) mit sich.

Um Node-API im obigen "Hallo Welt"-Beispiel zu verwenden, ersetzen Sie den Inhalt von `hello.cc` durch den folgenden. Alle anderen Anweisungen bleiben gleich.

```C++ [C++]
// hello.cc unter Verwendung der Node-API
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
Die verfügbaren Funktionen und deren Verwendung sind in [C/C++-Add-ons mit Node-API](/de/nodejs/api/n-api) dokumentiert.


## Addon-Beispiele {#addon-examples}

Im Folgenden finden Sie einige Addon-Beispiele, die Entwicklern den Einstieg erleichtern sollen. Die Beispiele verwenden die V8-APIs. Informationen zu den verschiedenen V8-Aufrufen finden Sie in der Online- [V8-Referenz](https://v8docs.nodesource.com/). Eine Erläuterung verschiedener Konzepte wie Handles, Scopes, Funktionstemplates usw. finden Sie im [Embedder's Guide](https://v8.dev/docs/embed) von V8.

Jedes dieser Beispiele verwendet die folgende `binding.gyp`-Datei:

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
Wenn mehr als eine `.cc`-Datei vorhanden ist, fügen Sie einfach den zusätzlichen Dateinamen zum `sources`-Array hinzu:

```json [JSON]
"sources": ["addon.cc", "myexample.cc"]
```
Sobald die `binding.gyp`-Datei fertig ist, können die Addon-Beispiele mit `node-gyp` konfiguriert und erstellt werden:

```bash [BASH]
node-gyp configure build
```
### Funktionsargumente {#function-arguments}

Addons stellen typischerweise Objekte und Funktionen bereit, auf die von JavaScript aus zugegriffen werden kann, das in Node.js ausgeführt wird. Wenn Funktionen von JavaScript aufgerufen werden, müssen die Eingabeargumente und der Rückgabewert auf den C/C++-Code abgebildet und von diesem abgebildet werden.

Das folgende Beispiel veranschaulicht, wie Funktionsargumente gelesen werden, die von JavaScript übergeben werden, und wie ein Ergebnis zurückgegeben wird:

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

// Dies ist die Implementierung der "add"-Methode
// Eingabeargumente werden mit der
// const FunctionCallbackInfo<Value>& args struct übergeben
void Add(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  // Überprüfen Sie die Anzahl der übergebenen Argumente.
  if (args.Length() < 2) {
    // Wirf einen Fehler, der an JavaScript zurückgegeben wird
    isolate->ThrowException(Exception::TypeError(
        String::NewFromUtf8(isolate,
                            "Falsche Anzahl an Argumenten").ToLocalChecked()));
    return;
  }

  // Überprüfen Sie die Argumenttypen
  if (!args[0]->IsNumber() || !args[1]->IsNumber()) {
    isolate->ThrowException(Exception::TypeError(
        String::NewFromUtf8(isolate,
                            "Falsche Argumente").ToLocalChecked()));
    return;
  }

  // Führen Sie die Operation aus
  double value =
      args[0].As<Number>()->Value() + args[1].As<Number>()->Value();
  Local<Number> num = Number::New(isolate, value);

  // Legen Sie den Rückgabewert fest (unter Verwendung des übergebenen
  // FunctionCallbackInfo<Value>&)
  args.GetReturnValue().Set(num);
}

void Init(Local<Object> exports) {
  NODE_SET_METHOD(exports, "add", Add);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Init)

}  // namespace demo
```
Nach dem Kompilieren kann das Addon-Beispiel in Node.js angefordert und verwendet werden:

```js [ESM]
// test.js
const addon = require('./build/Release/addon');

console.log('Das sollte acht sein:', addon.add(3, 5));
```

### Callbacks {#callbacks}

Es ist eine gängige Praxis innerhalb von Addons, JavaScript-Funktionen an eine C++-Funktion zu übergeben und diese von dort aus auszuführen. Das folgende Beispiel veranschaulicht, wie solche Callbacks aufgerufen werden:

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
Dieses Beispiel verwendet eine zweiargumentige Form von `Init()`, die das vollständige `module`-Objekt als zweites Argument empfängt. Dies ermöglicht es dem Addon, `exports` vollständig mit einer einzigen Funktion zu überschreiben, anstatt die Funktion als Eigenschaft von `exports` hinzuzufügen.

Um es zu testen, führen Sie folgendes JavaScript aus:

```js [ESM]
// test.js
const addon = require('./build/Release/addon');

addon((msg) => {
  console.log(msg);
// Prints: 'hello world'
});
```
In diesem Beispiel wird die Callback-Funktion synchron aufgerufen.

### Object factory {#object-factory}

Addons können neue Objekte innerhalb einer C++-Funktion erstellen und zurückgeben, wie im folgenden Beispiel veranschaulicht. Ein Objekt wird erstellt und mit einer Eigenschaft `msg` zurückgegeben, die die an `createObject()` übergebene Zeichenfolge widerspiegelt:

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
Um es in JavaScript zu testen:

```js [ESM]
// test.js
const addon = require('./build/Release/addon');

const obj1 = addon('hello');
const obj2 = addon('world');
console.log(obj1.msg, obj2.msg);
// Prints: 'hello world'
```

### Funktionsfabrik {#function-factory}

Ein weiteres gängiges Szenario ist das Erstellen von JavaScript-Funktionen, die C++-Funktionen umschließen und diese an JavaScript zurückgeben:

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

  // omit this to make it anonymous
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
Zum Testen:

```js [ESM]
// test.js
const addon = require('./build/Release/addon');

const fn = addon();
console.log(fn());
// Gibt aus: 'hello world'
```
### Umschließen von C++-Objekten {#wrapping-c-objects}

Es ist auch möglich, C++-Objekte/Klassen so zu umschließen, dass mit dem JavaScript-Operator `new` neue Instanzen erstellt werden können:

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
In `myobject.h` erbt die Wrapper-Klasse von `node::ObjectWrap`:

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
In `myobject.cc` implementieren Sie die verschiedenen Methoden, die offengelegt werden sollen. Im folgenden Code wird die Methode `plusOne()` offengelegt, indem sie dem Prototyp des Konstruktors hinzugefügt wird:

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
  addon_data_tpl->SetInternalFieldCount(1);  // 1 field for the MyObject::New()
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
Um dieses Beispiel zu erstellen, muss die Datei `myobject.cc` zu `binding.gyp` hinzugefügt werden:

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
Testen Sie es mit:

```js [ESM]
// test.js
const addon = require('./build/Release/addon');

const obj = new addon.MyObject(10);
console.log(obj.plusOne());
// Gibt aus: 11
console.log(obj.plusOne());
// Gibt aus: 12
console.log(obj.plusOne());
// Gibt aus: 13
```
Der Destruktor für ein Wrapper-Objekt wird ausgeführt, wenn das Objekt von der Garbage Collection bereinigt wird. Für das Testen von Destruktoren gibt es Befehlszeilen-Flags, mit denen die Garbage Collection erzwungen werden kann. Diese Flags werden von der zugrunde liegenden V8-JavaScript-Engine bereitgestellt. Sie können sich jederzeit ändern oder entfernt werden. Sie sind weder von Node.js noch von V8 dokumentiert und sollten niemals außerhalb von Tests verwendet werden.

Während des Herunterfahrens des Prozesses oder der Worker-Threads werden Destruktoren nicht von der JS-Engine aufgerufen. Daher liegt es in der Verantwortung des Benutzers, diese Objekte zu verfolgen und eine ordnungsgemäße Zerstörung sicherzustellen, um Ressourcenlecks zu vermeiden.


### Factory für umschlossene Objekte {#factory-of-wrapped-objects}

Alternativ ist es möglich, ein Factory-Muster zu verwenden, um die explizite Erstellung von Objektinstanzen mit dem JavaScript-Operator `new` zu vermeiden:

```js [ESM]
const obj = addon.createObject();
// anstelle von:
// const obj = new addon.Object();
```
Zuerst wird die Methode `createObject()` in `addon.cc` implementiert:

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
In `myobject.h` wird die statische Methode `NewInstance()` hinzugefügt, um die Instanziierung des Objekts zu verarbeiten. Diese Methode ersetzt die Verwendung von `new` in JavaScript:

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
Die Implementierung in `myobject.cc` ähnelt dem vorherigen Beispiel:

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
Um dieses Beispiel zu erstellen, muss die Datei `myobject.cc` erneut zur `binding.gyp` hinzugefügt werden:

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
Testen Sie es mit:

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

### Übergeben umschlossener Objekte {#passing-wrapped-objects-around}

Zusätzlich zum Umschließen und Zurückgeben von C++-Objekten ist es möglich, umschlossene Objekte herumzureichen, indem man sie mit der Node.js-Hilfsfunktion `node::ObjectWrap::Unwrap` entpackt. Das folgende Beispiel zeigt eine Funktion `add()`, die zwei `MyObject`-Objekte als Eingabeargumente entgegennehmen kann:

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
In `myobject.h` wird eine neue öffentliche Methode hinzugefügt, um nach dem Entpacken des Objekts auf private Werte zugreifen zu können.

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
Die Implementierung von `myobject.cc` bleibt ähnlich der vorherigen Version:

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
Testen Sie es mit:

```js [ESM]
// test.js
const addon = require('./build/Release/addon');

const obj1 = addon.createObject(10);
const obj2 = addon.createObject(20);
const result = addon.add(obj1, obj2);

console.log(result);
// Prints: 30
```

