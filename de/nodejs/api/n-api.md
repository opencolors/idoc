---
title: Node.js N-API Dokumentation
description: Die N-API (Node.js API) bietet eine stabile und konsistente Schnittstelle für native Addons, die es Entwicklern ermöglicht, Module zu erstellen, die mit verschiedenen Versionen von Node.js kompatibel sind.
head:
  - - meta
    - name: og:title
      content: Node.js N-API Dokumentation | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Die N-API (Node.js API) bietet eine stabile und konsistente Schnittstelle für native Addons, die es Entwicklern ermöglicht, Module zu erstellen, die mit verschiedenen Versionen von Node.js kompatibel sind.
  - - meta
    - name: twitter:title
      content: Node.js N-API Dokumentation | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Die N-API (Node.js API) bietet eine stabile und konsistente Schnittstelle für native Addons, die es Entwicklern ermöglicht, Module zu erstellen, die mit verschiedenen Versionen von Node.js kompatibel sind.
---


# Node-API {#node-api}

::: tip [Stable: 2 - Stable]
[Stable: 2](/de/nodejs/api/documentation#stability-index) [Stability: 2](/de/nodejs/api/documentation#stability-index) - Stabil
:::

Node-API (früher N-API) ist eine API zum Erstellen nativer Add-ons. Sie ist unabhängig von der zugrunde liegenden JavaScript-Runtime (z. B. V8) und wird als Teil von Node.js selbst gepflegt. Diese API ist Application Binary Interface (ABI)-stabil über verschiedene Versionen von Node.js hinweg. Sie soll Add-ons vor Änderungen in der zugrunde liegenden JavaScript-Engine schützen und es Modulen, die für eine Hauptversion kompiliert wurden, ermöglichen, ohne Neukompilierung auf späteren Hauptversionen von Node.js zu laufen. Der Leitfaden zur [ABI-Stabilität](https://nodejs.org/en/docs/guides/abi-stability/) bietet eine ausführlichere Erklärung.

Add-ons werden mit dem gleichen Ansatz/den gleichen Tools erstellt/verpackt, die im Abschnitt [C++ Addons](/de/nodejs/api/addons) beschrieben sind. Der einzige Unterschied ist die Menge der APIs, die vom nativen Code verwendet werden. Anstatt die V8- oder [Native Abstractions for Node.js](https://github.com/nodejs/nan)-APIs zu verwenden, werden die in Node-API verfügbaren Funktionen verwendet.

Von Node-API bereitgestellte APIs werden im Allgemeinen verwendet, um JavaScript-Werte zu erstellen und zu manipulieren. Konzepte und Operationen entsprechen im Allgemeinen den in der ECMA-262 Language Specification festgelegten Ideen. Die APIs haben die folgenden Eigenschaften:

- Alle Node-API-Aufrufe geben einen Statuscode vom Typ `napi_status` zurück. Dieser Status gibt an, ob der API-Aufruf erfolgreich war oder fehlgeschlagen ist.
- Der Rückgabewert der API wird über einen Out-Parameter übergeben.
- Alle JavaScript-Werte werden hinter einem undurchsichtigen Typ namens `napi_value` abstrahiert.
- Im Falle eines Fehlerstatuscodes können zusätzliche Informationen mit `napi_get_last_error_info` abgerufen werden. Weitere Informationen finden Sie im Abschnitt zur Fehlerbehandlung [Fehlerbehandlung](/de/nodejs/api/n-api#error-handling).

Node-API ist eine C-API, die ABI-Stabilität über Node.js-Versionen und verschiedene Compiler-Level hinweg gewährleistet. Eine C++-API kann einfacher zu bedienen sein. Um die Verwendung von C++ zu unterstützen, unterhält das Projekt ein C++-Wrapper-Modul namens [`node-addon-api`](https://github.com/nodejs/node-addon-api). Dieser Wrapper bietet eine inlinable C++-API. Binärdateien, die mit `node-addon-api` erstellt wurden, hängen von den Symbolen für die von Node.js exportierten Node-API-C-basierten Funktionen ab. `node-addon-api` ist eine effizientere Möglichkeit, Code zu schreiben, der Node-API aufruft. Nehmen Sie zum Beispiel den folgenden `node-addon-api`-Code. Der erste Abschnitt zeigt den `node-addon-api`-Code und der zweite Abschnitt zeigt, was tatsächlich im Add-on verwendet wird.

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
Das Endergebnis ist, dass das Add-on nur die exportierten C-APIs verwendet. Dadurch erhält es weiterhin die Vorteile der ABI-Stabilität, die durch die C-API bereitgestellt wird.

Wenn Sie `node-addon-api` anstelle der C-APIs verwenden, beginnen Sie mit den API [docs](https://github.com/nodejs/node-addon-api#api-documentation) für `node-addon-api`.

Die [Node-API-Ressource](https://nodejs.github.io/node-addon-examples/) bietet eine ausgezeichnete Orientierung und Tipps für Entwickler, die gerade erst mit Node-API und `node-addon-api` anfangen. Zusätzliche Medienressourcen finden Sie auf der Seite [Node-API-Medien](https://github.com/nodejs/abi-stable-node/blob/HEAD/node-api-media.md).


## Auswirkungen der ABI-Stabilität {#implications-of-abi-stability}

Obwohl Node-API eine ABI-Stabilitätsgarantie bietet, gilt dies nicht für andere Teile von Node.js und möglicherweise auch nicht für externe Bibliotheken, die vom Addon verwendet werden. Insbesondere bietet keine der folgenden APIs eine ABI-Stabilitätsgarantie über Major-Versionen hinweg:

- die Node.js C++ APIs, die über eine der folgenden Möglichkeiten verfügbar sind:
- die libuv APIs, die ebenfalls in Node.js enthalten und über verfügbar sind:
- die V8 API, die über verfügbar ist:

Damit ein Addon über Node.js Major-Versionen hinweg ABI-kompatibel bleibt, muss es also ausschließlich Node-API verwenden, indem es sich auf die Verwendung von

```C [C]
#include <node_api.h>
```
beschränkt und für alle externen Bibliotheken, die es verwendet, überprüft, ob die externe Bibliothek ABI-Stabilitätsgarantien ähnlich wie Node-API gibt.

## Bauen {#building}

Im Gegensatz zu Modulen, die in JavaScript geschrieben sind, erfordert die Entwicklung und Bereitstellung von Node.js nativen Addons mit Node-API eine zusätzliche Reihe von Tools. Neben den grundlegenden Tools, die für die Entwicklung für Node.js erforderlich sind, benötigt der Entwickler nativer Addons eine Toolchain, die C- und C++-Code in eine Binärdatei kompilieren kann. Abhängig davon, wie das native Addon bereitgestellt wird, muss der *Benutzer* des nativen Addons ebenfalls eine C/C++-Toolchain installiert haben.

Für Linux-Entwickler sind die notwendigen C/C++-Toolchain-Pakete leicht verfügbar. [GCC](https://gcc.gnu.org/) wird in der Node.js-Community häufig zum Erstellen und Testen auf einer Vielzahl von Plattformen verwendet. Für viele Entwickler ist die [LLVM](https://llvm.org/) Compiler-Infrastruktur ebenfalls eine gute Wahl.

Für Mac-Entwickler bietet [Xcode](https://developer.apple.com/xcode/) alle erforderlichen Compiler-Tools. Es ist jedoch nicht erforderlich, die gesamte Xcode IDE zu installieren. Der folgende Befehl installiert die notwendige Toolchain:

```bash [BASH]
xcode-select --install
```
Für Windows-Entwickler bietet [Visual Studio](https://visualstudio.microsoft.com/) alle erforderlichen Compiler-Tools. Es ist jedoch nicht erforderlich, die gesamte Visual Studio IDE zu installieren. Der folgende Befehl installiert die notwendige Toolchain:

```bash [BASH]
npm install --global windows-build-tools
```
In den folgenden Abschnitten werden die zusätzlichen Tools beschrieben, die für die Entwicklung und Bereitstellung von Node.js nativen Addons verfügbar sind.


### Build-Tools {#build-tools}

Die hier aufgeführten Tools erfordern, dass *Benutzer* des nativen Addons eine C/C++-Toolchain installiert haben, um das native Addon erfolgreich installieren zu können.

#### node-gyp {#node-gyp}

[node-gyp](https://github.com/nodejs/node-gyp) ist ein Build-System, das auf dem [gyp-next](https://github.com/nodejs/gyp-next) Fork des Google-Tools [GYP](https://gyp.gsrc.io/) basiert und mit npm gebündelt wird. GYP und damit node-gyp erfordern die Installation von Python.

Historisch gesehen war node-gyp das Werkzeug der Wahl zum Erstellen nativer Addons. Es hat eine breite Akzeptanz und Dokumentation. Einige Entwickler sind jedoch auf Einschränkungen in node-gyp gestoßen.

#### CMake.js {#cmakejs}

[CMake.js](https://github.com/cmake-js/cmake-js) ist ein alternatives Build-System, das auf [CMake](https://cmake.org/) basiert.

CMake.js ist eine gute Wahl für Projekte, die bereits CMake verwenden, oder für Entwickler, die von Einschränkungen in node-gyp betroffen sind. [`build_with_cmake`](https://github.com/nodejs/node-addon-examples/tree/main/src/8-tooling/build_with_cmake) ist ein Beispiel für ein CMake-basiertes natives Addon-Projekt.

### Hochladen vorkompilierter Binärdateien {#uploading-precompiled-binaries}

Die drei hier aufgeführten Tools ermöglichen es Entwicklern und Betreuern nativer Addons, Binärdateien zu erstellen und auf öffentliche oder private Server hochzuladen. Diese Tools sind in der Regel in CI/CD-Build-Systeme wie [Travis CI](https://travis-ci.org/) und [AppVeyor](https://www.appveyor.com/) integriert, um Binärdateien für eine Vielzahl von Plattformen und Architekturen zu erstellen und hochzuladen. Diese Binärdateien stehen dann Benutzern zum Download zur Verfügung, die keine C/C++-Toolchain installiert haben müssen.

#### node-pre-gyp {#node-pre-gyp}

[node-pre-gyp](https://github.com/mapbox/node-pre-gyp) ist ein Tool, das auf node-gyp basiert und die Möglichkeit bietet, Binärdateien auf einen Server der Wahl des Entwicklers hochzuladen. node-pre-gyp bietet besonders gute Unterstützung für das Hochladen von Binärdateien auf Amazon S3.

#### prebuild {#prebuild}

[prebuild](https://github.com/prebuild/prebuild) ist ein Tool, das Builds entweder mit node-gyp oder CMake.js unterstützt. Im Gegensatz zu node-pre-gyp, das eine Vielzahl von Servern unterstützt, lädt prebuild Binärdateien nur auf [GitHub-Releases](https://help.github.com/en/github/administering-a-repository/about-releases) hoch. prebuild ist eine gute Wahl für GitHub-Projekte, die CMake.js verwenden.


#### prebuildify {#prebuildify}

[prebuildify](https://github.com/prebuild/prebuildify) ist ein Tool, das auf node-gyp basiert. Der Vorteil von prebuildify besteht darin, dass die erstellten Binärdateien zusammen mit dem nativen Add-on gebündelt werden, wenn es auf npm hochgeladen wird. Die Binärdateien werden von npm heruntergeladen und stehen dem Modulbenutzer sofort zur Verfügung, wenn das native Add-on installiert wird.

## Verwendung {#usage}

Um die Node-API-Funktionen zu verwenden, fügen Sie die Datei [`node_api.h`](https://github.com/nodejs/node/blob/HEAD/src/node_api.h) ein, die sich im src-Verzeichnis des Node-Entwicklungsbaums befindet:

```C [C]
#include <node_api.h>
```
Dadurch wird die Standard-`NAPI_VERSION` für die jeweilige Node.js-Version aktiviert. Um die Kompatibilität mit bestimmten Versionen der Node-API sicherzustellen, kann die Version beim Einfügen des Headers explizit angegeben werden:

```C [C]
#define NAPI_VERSION 3
#include <node_api.h>
```
Dies beschränkt die Node-API-Oberfläche auf die Funktionalität, die in den angegebenen (und früheren) Versionen verfügbar war.

Ein Teil der Node-API-Oberfläche ist experimentell und erfordert eine explizite Aktivierung:

```C [C]
#define NAPI_EXPERIMENTAL
#include <node_api.h>
```
In diesem Fall steht die gesamte API-Oberfläche, einschließlich aller experimentellen APIs, dem Modulcode zur Verfügung.

Gelegentlich werden experimentelle Funktionen eingeführt, die sich auf bereits veröffentlichte und stabile APIs auswirken. Diese Funktionen können durch eine Abmeldung deaktiviert werden:

```C [C]
#define NAPI_EXPERIMENTAL
#define NODE_API_EXPERIMENTAL_<FEATURE_NAME>_OPT_OUT
#include <node_api.h>
```
wobei `\<FEATURE_NAME\>` der Name einer experimentellen Funktion ist, die sich sowohl auf experimentelle als auch auf stabile APIs auswirkt.

## Node-API-Versionsmatrix {#node-api-version-matrix}

Bis Version 9 waren die Node-API-Versionen additiv und unabhängig von Node.js versioniert. Dies bedeutete, dass jede Version eine Erweiterung der vorherigen Version war, da sie alle APIs der vorherigen Version mit einigen Ergänzungen enthielt. Jede Node.js-Version unterstützte nur eine einzige Node-API-Version. Zum Beispiel unterstützt v18.15.0 nur Node-API-Version 8. ABI-Stabilität wurde erreicht, da 8 eine strikte Obermenge aller vorherigen Versionen war.

Ab Version 9 werden die Node-API-Versionen weiterhin unabhängig versioniert. Ein Add-on, das mit Node-API-Version 9 ausgeführt wurde, benötigt möglicherweise Codeaktualisierungen, um mit Node-API-Version 10 ausgeführt zu werden. Die ABI-Stabilität wird jedoch beibehalten, da Node.js-Versionen, die Node-API-Versionen höher als 8 unterstützen, alle Versionen zwischen 8 und der höchsten Version, die sie unterstützen, unterstützen und standardmäßig die Version 8 APIs bereitstellen, es sei denn, ein Add-on entscheidet sich für eine höhere Node-API-Version. Dieser Ansatz bietet die Flexibilität, vorhandene Node-API-Funktionen besser zu optimieren und gleichzeitig die ABI-Stabilität zu gewährleisten. Vorhandene Add-ons können ohne Neukompilierung mit einer früheren Version der Node-API weiter ausgeführt werden. Wenn ein Add-on Funktionen aus einer neueren Node-API-Version benötigt, sind Änderungen am vorhandenen Code und eine Neukompilierung erforderlich, um diese neuen Funktionen zu verwenden.

In Versionen von Node.js, die Node-API-Version 9 und höher unterstützen, wird durch Definieren von `NAPI_VERSION=X` und Verwenden der vorhandenen Add-on-Initialisierungs-Makros die angeforderte Node-API-Version, die zur Laufzeit verwendet wird, in das Add-on eingebrannt. Wenn `NAPI_VERSION` nicht gesetzt ist, wird standardmäßig 8 verwendet.

Diese Tabelle ist in älteren Streams möglicherweise nicht auf dem neuesten Stand. Die aktuellsten Informationen finden Sie in der neuesten API-Dokumentation unter: [Node-API-Versionsmatrix](/de/nodejs/api/n-api#node-api-version-matrix)

| Node-API-Version | Unterstützt in |
|---|---|
| 9 | v18.17.0+, 20.3.0+, 21.0.0 und alle späteren Versionen |
| 8 | v12.22.0+, v14.17.0+, v15.12.0+, 16.0.0 und alle späteren Versionen |
| 7 | v10.23.0+, v12.19.0+, v14.12.0+, 15.0.0 und alle späteren Versionen |
| 6 | v10.20.0+, v12.17.0+, 14.0.0 und alle späteren Versionen |
| 5 | v10.17.0+, v12.11.0+, 13.0.0 und alle späteren Versionen |
| 4 | v10.16.0+, v11.8.0+, 12.0.0 und alle späteren Versionen |
| 3 | v6.14.2*, 8.11.2+, v9.11.0+*, 10.0.0 und alle späteren Versionen |
| 2 | v8.10.0+*, v9.3.0+*, 10.0.0 und alle späteren Versionen |
| 1 | v8.6.0+**, v9.0.0+*, 10.0.0 und alle späteren Versionen |
* Node-API war experimentell.

** Node.js 8.0.0 enthielt Node-API als experimentell. Es wurde als Node-API-Version 1 veröffentlicht, entwickelte sich aber bis Node.js 8.6.0 weiter. Die API ist in Versionen vor Node.js 8.6.0 unterschiedlich. Wir empfehlen Node-API Version 3 oder höher.

Jede für Node-API dokumentierte API hat einen Header namens `added in:` und APIs, die stabil sind, haben den zusätzlichen Header `Node-API version:`. APIs sind direkt verwendbar, wenn eine Node.js-Version verwendet wird, die die in `Node-API version:` angezeigte Node-API-Version oder höher unterstützt. Wenn eine Node.js-Version verwendet wird, die die in `Node-API version:` aufgeführte Version nicht unterstützt, oder wenn keine `Node-API version:` aufgeführt ist, ist die API nur verfügbar, wenn `#define NAPI_EXPERIMENTAL` dem Einfügen von `node_api.h` oder `js_native_api.h` vorangestellt ist. Wenn eine API in einer Node.js-Version, die später als die in `added in:` angezeigte Version ist, scheinbar nicht verfügbar ist, ist dies höchstwahrscheinlich der Grund für das scheinbare Fehlen.

Die Node-APIs, die ausschließlich mit dem Zugriff auf ECMAScript-Funktionen aus nativem Code verbunden sind, finden Sie separat in `js_native_api.h` und `js_native_api_types.h`. Die in diesen Headern definierten APIs sind in `node_api.h` und `node_api_types.h` enthalten. Die Header sind auf diese Weise strukturiert, um Implementierungen von Node-API außerhalb von Node.js zu ermöglichen. Für diese Implementierungen sind die Node.js-spezifischen APIs möglicherweise nicht anwendbar.

Die Node.js-spezifischen Teile eines Add-ons können von dem Code getrennt werden, der die eigentliche Funktionalität für die JavaScript-Umgebung bereitstellt, sodass letztere mit mehreren Implementierungen von Node-API verwendet werden kann. Im folgenden Beispiel beziehen sich `addon.c` und `addon.h` nur auf `js_native_api.h`. Dadurch wird sichergestellt, dass `addon.c` wiederverwendet werden kann, um entweder gegen die Node.js-Implementierung von Node-API oder gegen eine Implementierung von Node-API außerhalb von Node.js zu kompilieren.

`addon_node.c` ist eine separate Datei, die den Node.js-spezifischen Einstiegspunkt für das Add-on enthält und das Add-on instanziiert, indem `addon.c` aufgerufen wird, wenn das Add-on in eine Node.js-Umgebung geladen wird.

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

## Lebenszyklus-APIs für Umgebungen {#environment-life-cycle-apis}

[Abschnitt 8.7](https://tc39.es/ecma262/#sec-agents) der [ECMAScript Language Specification](https://tc39.github.io/ecma262/) definiert das Konzept eines "Agenten" als eine in sich geschlossene Umgebung, in der JavaScript-Code ausgeführt wird. Mehrere solcher Agenten können vom Prozess entweder gleichzeitig oder nacheinander gestartet und beendet werden.

Eine Node.js-Umgebung entspricht einem ECMAScript-Agenten. Im Hauptprozess wird beim Start eine Umgebung erstellt, und zusätzliche Umgebungen können auf separaten Threads erstellt werden, um als [Worker-Threads](https://nodejs.org/api/worker_threads) zu dienen. Wenn Node.js in eine andere Anwendung eingebettet ist, kann der Hauptthread der Anwendung auch während des Lebenszyklus des Anwendungsprozesses mehrmals eine Node.js-Umgebung erstellen und zerstören, sodass jede von der Anwendung erstellte Node.js-Umgebung ihrerseits während ihres Lebenszyklus zusätzliche Umgebungen als Worker-Threads erstellen und zerstören kann.

Aus der Sicht eines nativen Addons bedeutet dies, dass die von ihm bereitgestellten Bindungen mehrmals, aus mehreren Kontexten und sogar gleichzeitig von mehreren Threads aufgerufen werden können.

Native Addons müssen möglicherweise globalen Status zuordnen, den sie während ihres Lebenszyklus einer Node.js-Umgebung verwenden, sodass der Status für jede Instanz des Addons eindeutig sein kann.

Zu diesem Zweck bietet Node-API eine Möglichkeit, Daten so zuzuordnen, dass ihr Lebenszyklus an den Lebenszyklus einer Node.js-Umgebung gebunden ist.

### `napi_set_instance_data` {#napi_set_instance_data}

**Hinzugefügt in: v12.8.0, v10.20.0**

**N-API Version: 6**

```C [C]
napi_status napi_set_instance_data(node_api_basic_env env,
                                   void* data,
                                   napi_finalize finalize_cb,
                                   void* finalize_hint);
```
- `[in] env`: Die Umgebung, unter der der Node-API-Aufruf aufgerufen wird.
- `[in] data`: Das Datenelement, das für Bindungen dieser Instanz verfügbar gemacht werden soll.
- `[in] finalize_cb`: Die Funktion, die aufgerufen werden soll, wenn die Umgebung abgebaut wird. Die Funktion empfängt `data`, damit sie sie freigeben kann. [`napi_finalize`](/de/nodejs/api/n-api#napi_finalize) bietet weitere Details.
- `[in] finalize_hint`: Optionaler Hinweis, der während der Sammlung an den Finalize-Callback übergeben werden soll.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API ordnet `data` der aktuell laufenden Node.js-Umgebung zu. `data` kann später mit `napi_get_instance_data()` abgerufen werden. Alle vorhandenen Daten, die der aktuell laufenden Node.js-Umgebung zugeordnet sind und durch einen vorherigen Aufruf von `napi_set_instance_data()` festgelegt wurden, werden überschrieben. Wenn durch den vorherigen Aufruf ein `finalize_cb` bereitgestellt wurde, wird er nicht aufgerufen.


### `napi_get_instance_data` {#napi_get_instance_data}

**Hinzugefügt in: v12.8.0, v10.20.0**

**N-API Version: 6**

```C [C]
napi_status napi_get_instance_data(node_api_basic_env env,
                                   void** data);
```
- `[in] env`: Die Umgebung, in der der Node-API-Aufruf erfolgt.
- `[out] data`: Das Datenelement, das zuvor der aktuell laufenden Node.js-Umgebung durch einen Aufruf von `napi_set_instance_data()` zugeordnet wurde.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API ruft Daten ab, die zuvor der aktuell laufenden Node.js-Umgebung über `napi_set_instance_data()` zugeordnet wurden. Wenn keine Daten gesetzt sind, ist der Aufruf erfolgreich und `data` wird auf `NULL` gesetzt.

## Grundlegende Node-API-Datentypen {#basic-node-api-data-types}

Node-API stellt die folgenden grundlegenden Datentypen als Abstraktionen zur Verfügung, die von den verschiedenen APIs verwendet werden. Diese APIs sollten als undurchsichtig behandelt werden und nur mit anderen Node-API-Aufrufen untersucht werden können.

### `napi_status` {#napi_status}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

Integraler Statuscode, der den Erfolg oder Misserfolg eines Node-API-Aufrufs angibt. Derzeit werden die folgenden Statuscodes unterstützt.

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
Wenn zusätzliche Informationen erforderlich sind, wenn eine API einen fehlgeschlagenen Status zurückgibt, können diese durch Aufrufen von `napi_get_last_error_info` abgerufen werden.

### `napi_extended_error_info` {#napi_extended_error_info}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
typedef struct {
  const char* error_message;
  void* engine_reserved;
  uint32_t engine_error_code;
  napi_status error_code;
} napi_extended_error_info;
```
- `error_message`: UTF8-kodierte Zeichenkette, die eine VM-neutrale Beschreibung des Fehlers enthält.
- `engine_reserved`: Für VM-spezifische Fehlerdetails reserviert. Dies ist derzeit für keine VM implementiert.
- `engine_error_code`: VM-spezifischer Fehlercode. Dies ist derzeit für keine VM implementiert.
- `error_code`: Der Node-API-Statuscode, der von dem letzten Fehler herrührt.

Weitere Informationen finden Sie im Abschnitt [Fehlerbehandlung](/de/nodejs/api/n-api#error-handling).


### `napi_env` {#napi_env}

`napi_env` wird verwendet, um einen Kontext darzustellen, den die zugrunde liegende Node-API-Implementierung verwenden kann, um VM-spezifische Zustände zu speichern. Diese Struktur wird nativen Funktionen übergeben, wenn sie aufgerufen werden, und sie muss zurückgegeben werden, wenn Node-API-Aufrufe getätigt werden. Insbesondere muss die gleiche `napi_env`, die beim ersten Aufruf der nativen Funktion übergeben wurde, an alle nachfolgenden verschachtelten Node-API-Aufrufe übergeben werden. Das Zwischenspeichern der `napi_env` zum Zweck der allgemeinen Wiederverwendung und das Übergeben der `napi_env` zwischen Instanzen desselben Add-ons, die auf verschiedenen [`Worker`](/de/nodejs/api/worker_threads#class-worker)-Threads ausgeführt werden, ist nicht zulässig. Die `napi_env` wird ungültig, wenn eine Instanz eines nativen Add-ons entladen wird. Eine Benachrichtigung über dieses Ereignis wird über die Callbacks geliefert, die an [`napi_add_env_cleanup_hook`](/de/nodejs/api/n-api#napi_add_env_cleanup_hook) und [`napi_set_instance_data`](/de/nodejs/api/n-api#napi_set_instance_data) übergeben werden.

### `node_api_basic_env` {#node_api_basic_env}

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

Diese Variante von `napi_env` wird synchronen Finalizern ([`node_api_basic_finalize`](/de/nodejs/api/n-api#node_api_basic_finalize)) übergeben. Es gibt eine Teilmenge von Node-APIs, die einen Parameter vom Typ `node_api_basic_env` als erstes Argument akzeptieren. Diese APIs greifen nicht auf den Zustand der JavaScript-Engine zu und können daher sicher von synchronen Finalizern aufgerufen werden. Das Übergeben eines Parameters vom Typ `napi_env` an diese APIs ist zulässig, das Übergeben eines Parameters vom Typ `node_api_basic_env` an APIs, die auf den Zustand der JavaScript-Engine zugreifen, ist jedoch nicht zulässig. Der Versuch, dies ohne Cast zu tun, führt zu einer Compiler-Warnung oder einem Fehler, wenn Add-ons mit Flags kompiliert werden, die dazu führen, dass sie Warnungen und/oder Fehler ausgeben, wenn falsche Zeigertypen an eine Funktion übergeben werden. Das Aufrufen solcher APIs von einem synchronen Finalizer führt letztendlich zur Beendigung der Anwendung.

### `napi_value` {#napi_value}

Dies ist ein undurchsichtiger Zeiger, der zur Darstellung eines JavaScript-Werts verwendet wird.


### `napi_threadsafe_function` {#napi_threadsafe_function}

**Hinzugefügt in: v10.6.0**

**N-API Version: 4**

Dies ist ein undurchsichtiger Zeiger, der eine JavaScript-Funktion repräsentiert, die asynchron von mehreren Threads über `napi_call_threadsafe_function()` aufgerufen werden kann.

### `napi_threadsafe_function_release_mode` {#napi_threadsafe_function_release_mode}

**Hinzugefügt in: v10.6.0**

**N-API Version: 4**

Ein Wert, der `napi_release_threadsafe_function()` gegeben werden soll, um anzugeben, ob die Thread-sichere Funktion sofort geschlossen werden soll (`napi_tsfn_abort`) oder lediglich freigegeben werden soll (`napi_tsfn_release`) und somit für die nachfolgende Verwendung über `napi_acquire_threadsafe_function()` und `napi_call_threadsafe_function()` verfügbar ist.

```C [C]
typedef enum {
  napi_tsfn_release,
  napi_tsfn_abort
} napi_threadsafe_function_release_mode;
```
### `napi_threadsafe_function_call_mode` {#napi_threadsafe_function_call_mode}

**Hinzugefügt in: v10.6.0**

**N-API Version: 4**

Ein Wert, der `napi_call_threadsafe_function()` gegeben werden soll, um anzugeben, ob der Aufruf blockieren soll, wenn die der Thread-sicheren Funktion zugeordnete Warteschlange voll ist.

```C [C]
typedef enum {
  napi_tsfn_nonblocking,
  napi_tsfn_blocking
} napi_threadsafe_function_call_mode;
```
### Node-API-Speicherverwaltungstypen {#node-api-memory-management-types}

#### `napi_handle_scope` {#napi_handle_scope}

Dies ist eine Abstraktion, die verwendet wird, um die Lebensdauer von Objekten zu steuern und zu ändern, die innerhalb eines bestimmten Gültigkeitsbereichs erstellt wurden. Im Allgemeinen werden Node-API-Werte im Kontext eines Handle-Bereichs erstellt. Wenn eine native Methode von JavaScript aufgerufen wird, existiert ein Standard-Handle-Bereich. Wenn der Benutzer nicht explizit einen neuen Handle-Bereich erstellt, werden Node-API-Werte im Standard-Handle-Bereich erstellt. Für alle Aufrufe von Code außerhalb der Ausführung einer nativen Methode (z. B. während eines libuv-Callback-Aufrufs) muss das Modul einen Gültigkeitsbereich erstellen, bevor Funktionen aufgerufen werden, die zur Erstellung von JavaScript-Werten führen können.

Handle-Bereiche werden mit [`napi_open_handle_scope`](/de/nodejs/api/n-api#napi_open_handle_scope) erstellt und mit [`napi_close_handle_scope`](/de/nodejs/api/n-api#napi_close_handle_scope) zerstört. Das Schließen des Bereichs kann dem GC anzeigen, dass alle `napi_value`s, die während der Lebensdauer des Handle-Bereichs erstellt wurden, nicht mehr vom aktuellen Stack-Frame referenziert werden.

Weitere Einzelheiten finden Sie unter [Objektlebensdauerverwaltung](/de/nodejs/api/n-api#object-lifetime-management).


#### `napi_escapable_handle_scope` {#napi_escapable_handle_scope}

**Hinzugefügt in: v8.0.0**

**N-API-Version: 1**

Escapable Handle-Scopes sind eine spezielle Art von Handle-Scope, um Werte, die innerhalb eines bestimmten Handle-Scopes erstellt wurden, an einen übergeordneten Scope zurückzugeben.

#### `napi_ref` {#napi_ref}

**Hinzugefügt in: v8.0.0**

**N-API-Version: 1**

Dies ist die Abstraktion, die verwendet wird, um auf ein `napi_value` zu verweisen. Dies ermöglicht es Benutzern, die Lebensdauer von JavaScript-Werten zu verwalten, einschließlich der expliziten Definition ihrer minimalen Lebensdauer.

Weitere Informationen finden Sie unter [Objektlebensdauerverwaltung](/de/nodejs/api/n-api#object-lifetime-management).

#### `napi_type_tag` {#napi_type_tag}

**Hinzugefügt in: v14.8.0, v12.19.0**

**N-API-Version: 8**

Ein 128-Bit-Wert, der als zwei vorzeichenlose 64-Bit-Ganzzahlen gespeichert wird. Er dient als UUID, mit der JavaScript-Objekte oder [Externals](/de/nodejs/api/n-api#napi_create_external) "getaggt" werden können, um sicherzustellen, dass sie von einem bestimmten Typ sind. Dies ist eine stärkere Überprüfung als [`napi_instanceof`](/de/nodejs/api/n-api#napi_instanceof), da letzteres ein falsch positives Ergebnis melden kann, wenn der Prototyp des Objekts manipuliert wurde. Das Type-Tagging ist am nützlichsten in Verbindung mit [`napi_wrap`](/de/nodejs/api/n-api#napi_wrap), da es sicherstellt, dass der Zeiger, der von einem umschlossenen Objekt abgerufen wird, sicher in den nativen Typ umgewandelt werden kann, der dem Typ-Tag entspricht, das zuvor auf das JavaScript-Objekt angewendet wurde.

```C [C]
typedef struct {
  uint64_t lower;
  uint64_t upper;
} napi_type_tag;
```
#### `napi_async_cleanup_hook_handle` {#napi_async_cleanup_hook_handle}

**Hinzugefügt in: v14.10.0, v12.19.0**

Ein undurchsichtiger Wert, der von [`napi_add_async_cleanup_hook`](/de/nodejs/api/n-api#napi_add_async_cleanup_hook) zurückgegeben wird. Er muss an [`napi_remove_async_cleanup_hook`](/de/nodejs/api/n-api#napi_remove_async_cleanup_hook) übergeben werden, wenn die Kette asynchroner Bereinigungsereignisse abgeschlossen ist.

### Node-API-Callback-Typen {#node-api-callback-types}

#### `napi_callback_info` {#napi_callback_info}

**Hinzugefügt in: v8.0.0**

**N-API-Version: 1**

Undurchsichtiger Datentyp, der an eine Callback-Funktion übergeben wird. Er kann verwendet werden, um zusätzliche Informationen über den Kontext zu erhalten, in dem der Callback aufgerufen wurde.

#### `napi_callback` {#napi_callback}

**Hinzugefügt in: v8.0.0**

**N-API-Version: 1**

Funktionszeigertyp für benutzerdefinierte native Funktionen, die JavaScript über Node-API zur Verfügung gestellt werden sollen. Callback-Funktionen sollten die folgende Signatur erfüllen:

```C [C]
typedef napi_value (*napi_callback)(napi_env, napi_callback_info);
```
Sofern nicht aus Gründen, die in [Objektlebensdauerverwaltung](/de/nodejs/api/n-api#object-lifetime-management) erläutert werden, ist das Erstellen eines Handle- und/oder Callback-Scopes innerhalb eines `napi_callback` nicht erforderlich.


#### `node_api_basic_finalize` {#node_api_basic_finalize}

**Hinzugefügt in: v21.6.0, v20.12.0, v18.20.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabil: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

Funktionszeigertyp für Add-on-bereitgestellte Funktionen, die es dem Benutzer ermöglichen, benachrichtigt zu werden, wenn extern verwaltete Daten zur Bereinigung bereit sind, da das Objekt, dem sie zugeordnet waren, von der Speicherbereinigung erfasst wurde. Der Benutzer muss eine Funktion bereitstellen, die die folgende Signatur erfüllt, die bei der Erfassung des Objekts aufgerufen wird. Derzeit kann `node_api_basic_finalize` verwendet werden, um herauszufinden, wann Objekte mit externen Daten erfasst werden.

```C [C]
typedef void (*node_api_basic_finalize)(node_api_basic_env env,
                                      void* finalize_data,
                                      void* finalize_hint);
```
Sofern nicht aus Gründen, die in [Object Lifetime Management](/de/nodejs/api/n-api#object-lifetime-management) erläutert werden, ist das Erstellen eines Handles und/oder Callback-Scopes innerhalb des Funktionskörpers nicht notwendig.

Da diese Funktionen aufgerufen werden können, während sich die JavaScript-Engine in einem Zustand befindet, in dem sie keinen JavaScript-Code ausführen kann, dürfen nur Node-APIs aufgerufen werden, die eine `node_api_basic_env` als ersten Parameter akzeptieren. [`node_api_post_finalizer`](/de/nodejs/api/n-api#node_api_post_finalizer) kann verwendet werden, um Node-API-Aufrufe zu planen, die Zugriff auf den Zustand der JavaScript-Engine benötigen, um nach Abschluss des aktuellen Speicherbereinigungszyklus ausgeführt zu werden.

Im Fall von [`node_api_create_external_string_latin1`](/de/nodejs/api/n-api#node_api_create_external_string_latin1) und [`node_api_create_external_string_utf16`](/de/nodejs/api/n-api#node_api_create_external_string_utf16) kann der `env`-Parameter null sein, da externe Zeichenketten während des letzten Teils des Beendens der Umgebung erfasst werden können.

Änderungshistorie:

-  experimentell (`NAPI_EXPERIMENTAL`): Es dürfen nur Node-API-Aufrufe aufgerufen werden, die eine `node_api_basic_env` als ersten Parameter akzeptieren, andernfalls wird die Anwendung mit einer entsprechenden Fehlermeldung beendet. Dieses Feature kann durch Definieren von `NODE_API_EXPERIMENTAL_BASIC_ENV_OPT_OUT` deaktiviert werden.


#### `napi_finalize` {#napi_finalize}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

Funktionszeigertyp für Add-on-bereitgestellte Funktionen, die es dem Benutzer ermöglichen, als Reaktion auf ein Garbage-Collection-Ereignis eine Gruppe von Aufrufen an Node-APIs zu planen, nachdem der Garbage-Collection-Zyklus abgeschlossen ist. Diese Funktionszeiger können mit [`node_api_post_finalizer`](/de/nodejs/api/n-api#node_api_post_finalizer) verwendet werden.

```C [C]
typedef void (*napi_finalize)(napi_env env,
                              void* finalize_data,
                              void* finalize_hint);
```
Änderungshistorie:

-  experimentell (`NAPI_EXPERIMENTAL` ist definiert): Eine Funktion dieses Typs darf nicht mehr als Finalizer verwendet werden, außer mit [`node_api_post_finalizer`](/de/nodejs/api/n-api#node_api_post_finalizer). Stattdessen muss [`node_api_basic_finalize`](/de/nodejs/api/n-api#node_api_basic_finalize) verwendet werden. Diese Funktion kann durch Definieren von `NODE_API_EXPERIMENTAL_BASIC_ENV_OPT_OUT` deaktiviert werden.

#### `napi_async_execute_callback` {#napi_async_execute_callback}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

Funktionszeiger, der mit Funktionen verwendet wird, die asynchrone Operationen unterstützen. Callback-Funktionen müssen die folgende Signatur erfüllen:

```C [C]
typedef void (*napi_async_execute_callback)(napi_env env, void* data);
```
Implementierungen dieser Funktion müssen vermeiden, Node-API-Aufrufe zu tätigen, die JavaScript ausführen oder mit JavaScript-Objekten interagieren. Node-API-Aufrufe sollten stattdessen in der `napi_async_complete_callback` erfolgen. Verwenden Sie den `napi_env`-Parameter nicht, da dies wahrscheinlich zur Ausführung von JavaScript führt.

#### `napi_async_complete_callback` {#napi_async_complete_callback}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

Funktionszeiger, der mit Funktionen verwendet wird, die asynchrone Operationen unterstützen. Callback-Funktionen müssen die folgende Signatur erfüllen:

```C [C]
typedef void (*napi_async_complete_callback)(napi_env env,
                                             napi_status status,
                                             void* data);
```
Sofern nicht aus Gründen, die unter [Object Lifetime Management](/de/nodejs/api/n-api#object-lifetime-management) erläutert werden, ist das Erstellen eines Handles und/oder Callback-Scopes innerhalb des Funktionskörpers nicht notwendig.


#### `napi_threadsafe_function_call_js` {#napi_threadsafe_function_call_js}

**Hinzugefügt in: v10.6.0**

**N-API Version: 4**

Funktionszeiger, der bei asynchronen, threadsicheren Funktionsaufrufen verwendet wird. Der Callback wird im Hauptthread aufgerufen. Sein Zweck ist es, ein Datenelement, das über die Warteschlange von einem der sekundären Threads eintrifft, zu verwenden, um die Parameter zu konstruieren, die für einen Aufruf in JavaScript notwendig sind, normalerweise über `napi_call_function`, und dann den Aufruf in JavaScript durchzuführen.

Die Daten, die vom sekundären Thread über die Warteschlange ankommen, werden im `data`-Parameter übergeben und die aufzurufende JavaScript-Funktion wird im `js_callback`-Parameter übergeben.

Node-API richtet die Umgebung ein, bevor dieser Callback aufgerufen wird, daher ist es ausreichend, die JavaScript-Funktion über `napi_call_function` anstelle von `napi_make_callback` aufzurufen.

Callback-Funktionen müssen die folgende Signatur erfüllen:

```C [C]
typedef void (*napi_threadsafe_function_call_js)(napi_env env,
                                                 napi_value js_callback,
                                                 void* context,
                                                 void* data);
```
- `[in] env`: Die Umgebung, die für API-Aufrufe verwendet werden soll, oder `NULL`, wenn die threadsichere Funktion abgebaut wird und `data` möglicherweise freigegeben werden muss.
- `[in] js_callback`: Die aufzurufende JavaScript-Funktion oder `NULL`, wenn die threadsichere Funktion abgebaut wird und `data` möglicherweise freigegeben werden muss. Sie kann auch `NULL` sein, wenn die threadsichere Funktion ohne `js_callback` erstellt wurde.
- `[in] context`: Die optionalen Daten, mit denen die threadsichere Funktion erstellt wurde.
- `[in] data`: Daten, die vom sekundären Thread erstellt wurden. Es liegt in der Verantwortung des Callbacks, diese nativen Daten in JavaScript-Werte (mit Node-API-Funktionen) umzuwandeln, die als Parameter übergeben werden können, wenn `js_callback` aufgerufen wird. Dieser Zeiger wird vollständig von den Threads und diesem Callback verwaltet. Daher sollte dieser Callback die Daten freigeben.

Sofern nicht aus Gründen, die in [Objektlebensdauerverwaltung](/de/nodejs/api/n-api#object-lifetime-management) erläutert werden, ist es nicht notwendig, innerhalb des Funktionskörpers einen Handle und/oder Callback-Scope zu erstellen.


#### `napi_cleanup_hook` {#napi_cleanup_hook}

**Hinzugefügt in: v19.2.0, v18.13.0**

**N-API Version: 3**

Funktionszeiger, der mit [`napi_add_env_cleanup_hook`](/de/nodejs/api/n-api#napi_add_env_cleanup_hook) verwendet wird. Er wird aufgerufen, wenn die Umgebung abgebaut wird.

Callback-Funktionen müssen die folgende Signatur erfüllen:

```C [C]
typedef void (*napi_cleanup_hook)(void* data);
```
- `[in] data`: Die Daten, die an [`napi_add_env_cleanup_hook`](/de/nodejs/api/n-api#napi_add_env_cleanup_hook) übergeben wurden.

#### `napi_async_cleanup_hook` {#napi_async_cleanup_hook}

**Hinzugefügt in: v14.10.0, v12.19.0**

Funktionszeiger, der mit [`napi_add_async_cleanup_hook`](/de/nodejs/api/n-api#napi_add_async_cleanup_hook) verwendet wird. Er wird aufgerufen, wenn die Umgebung abgebaut wird.

Callback-Funktionen müssen die folgende Signatur erfüllen:

```C [C]
typedef void (*napi_async_cleanup_hook)(napi_async_cleanup_hook_handle handle,
                                        void* data);
```
- `[in] handle`: Das Handle, das an [`napi_remove_async_cleanup_hook`](/de/nodejs/api/n-api#napi_remove_async_cleanup_hook) nach Abschluss der asynchronen Bereinigung übergeben werden muss.
- `[in] data`: Die Daten, die an [`napi_add_async_cleanup_hook`](/de/nodejs/api/n-api#napi_add_async_cleanup_hook) übergeben wurden.

Der Rumpf der Funktion sollte die asynchronen Bereinigungsaktionen initiieren, an deren Ende `handle` in einem Aufruf von [`napi_remove_async_cleanup_hook`](/de/nodejs/api/n-api#napi_remove_async_cleanup_hook) übergeben werden muss.

## Fehlerbehandlung {#error-handling}

Node-API verwendet sowohl Rückgabewerte als auch JavaScript-Ausnahmen für die Fehlerbehandlung. Die folgenden Abschnitte erläutern den Ansatz für jeden Fall.

### Rückgabewerte {#return-values}

Alle Node-API-Funktionen haben das gleiche Fehlerbehandlungsmuster. Der Rückgabetyp aller API-Funktionen ist `napi_status`.

Der Rückgabewert ist `napi_ok`, wenn die Anfrage erfolgreich war und keine nicht abgefangene JavaScript-Ausnahme ausgelöst wurde. Wenn ein Fehler aufgetreten ist UND eine Ausnahme ausgelöst wurde, wird der `napi_status`-Wert für den Fehler zurückgegeben. Wenn eine Ausnahme ausgelöst wurde und kein Fehler aufgetreten ist, wird `napi_pending_exception` zurückgegeben.

In Fällen, in denen ein anderer Rückgabewert als `napi_ok` oder `napi_pending_exception` zurückgegeben wird, muss [`napi_is_exception_pending`](/de/nodejs/api/n-api#napi_is_exception_pending) aufgerufen werden, um zu prüfen, ob eine Ausnahme aussteht. Weitere Informationen finden Sie im Abschnitt über Ausnahmen.

Der vollständige Satz möglicher `napi_status`-Werte ist in `napi_api_types.h` definiert.

Der `napi_status`-Rückgabewert stellt eine VM-unabhängige Darstellung des aufgetretenen Fehlers bereit. In einigen Fällen ist es nützlich, detailliertere Informationen abrufen zu können, einschließlich einer Zeichenkette, die den Fehler darstellt, sowie VM- (Engine-) spezifische Informationen.

Um diese Informationen abzurufen, wird [`napi_get_last_error_info`](/de/nodejs/api/n-api#napi_get_last_error_info) bereitgestellt, das eine `napi_extended_error_info`-Struktur zurückgibt. Das Format der `napi_extended_error_info`-Struktur ist wie folgt:

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
typedef struct napi_extended_error_info {
  const char* error_message;
  void* engine_reserved;
  uint32_t engine_error_code;
  napi_status error_code;
};
```
- `error_message`: Textuelle Darstellung des aufgetretenen Fehlers.
- `engine_reserved`: Opakes Handle, das nur für die Verwendung durch die Engine reserviert ist.
- `engine_error_code`: VM-spezifischer Fehlercode.
- `error_code`: Node-API-Statuscode für den letzten Fehler.

[`napi_get_last_error_info`](/de/nodejs/api/n-api#napi_get_last_error_info) gibt die Informationen für den letzten Node-API-Aufruf zurück, der getätigt wurde.

Verlassen Sie sich nicht auf den Inhalt oder das Format der erweiterten Informationen, da diese nicht SemVer unterliegen und sich jederzeit ändern können. Sie sind nur für Protokollierungszwecke gedacht.


#### `napi_get_last_error_info` {#napi_get_last_error_info}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
napi_status
napi_get_last_error_info(node_api_basic_env env,
                         const napi_extended_error_info** result);
```
- `[in] env`: Die Umgebung, unter der die API aufgerufen wird.
- `[out] result`: Die `napi_extended_error_info`-Struktur mit weiteren Informationen über den Fehler.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API ruft eine `napi_extended_error_info`-Struktur mit Informationen über den letzten aufgetretenen Fehler ab.

Der Inhalt der zurückgegebenen `napi_extended_error_info` ist nur so lange gültig, bis eine Node-API-Funktion in derselben `env` aufgerufen wird. Dies schließt einen Aufruf von `napi_is_exception_pending` ein, sodass es oft notwendig sein kann, eine Kopie der Informationen zu erstellen, damit sie später verwendet werden können. Der in `error_message` zurückgegebene Zeiger verweist auf eine statisch definierte Zeichenkette, sodass es sicher ist, diesen Zeiger zu verwenden, wenn Sie ihn aus dem Feld `error_message` kopiert haben (das überschrieben wird), bevor eine andere Node-API-Funktion aufgerufen wurde.

Verlassen Sie sich nicht auf den Inhalt oder das Format der erweiterten Informationen, da diese nicht SemVer unterliegen und sich jederzeit ändern können. Sie sind nur für Protokollierungszwecke bestimmt.

Diese API kann auch dann aufgerufen werden, wenn eine ausstehende JavaScript-Ausnahme vorliegt.

### Ausnahmen {#exceptions}

Jeder Node-API-Funktionsaufruf kann zu einer ausstehenden JavaScript-Ausnahme führen. Dies gilt für alle API-Funktionen, auch für solche, die möglicherweise keine Ausführung von JavaScript verursachen.

Wenn der von einer Funktion zurückgegebene `napi_status` `napi_ok` ist, ist keine Ausnahme ausstehend und es sind keine zusätzlichen Maßnahmen erforderlich. Wenn der zurückgegebene `napi_status` etwas anderes als `napi_ok` oder `napi_pending_exception` ist, muss [`napi_is_exception_pending`](/de/nodejs/api/n-api#napi_is_exception_pending) aufgerufen werden, um festzustellen, ob eine Ausnahme ausstehend ist oder nicht, um zu versuchen, sich zu erholen und fortzufahren, anstatt einfach sofort zurückzukehren.

In vielen Fällen, wenn eine Node-API-Funktion aufgerufen wird und bereits eine Ausnahme aussteht, kehrt die Funktion sofort mit einem `napi_status` von `napi_pending_exception` zurück. Dies ist jedoch nicht bei allen Funktionen der Fall. Node-API erlaubt, dass eine Teilmenge der Funktionen aufgerufen wird, um eine minimale Bereinigung zu ermöglichen, bevor zu JavaScript zurückgekehrt wird. In diesem Fall spiegelt `napi_status` den Status für die Funktion wider. Sie spiegelt keine früheren ausstehenden Ausnahmen wider. Um Verwirrung zu vermeiden, überprüfen Sie den Fehlerstatus nach jedem Funktionsaufruf.

Wenn eine Ausnahme aussteht, können zwei Ansätze verfolgt werden.

Der erste Ansatz besteht darin, alle geeigneten Bereinigungen durchzuführen und dann zurückzukehren, sodass die Ausführung zu JavaScript zurückkehrt. Im Rahmen des Übergangs zurück zu JavaScript wird die Ausnahme an der Stelle im JavaScript-Code ausgelöst, an der die native Methode aufgerufen wurde. Das Verhalten der meisten Node-API-Aufrufe ist unspezifiziert, während eine Ausnahme aussteht, und viele geben einfach `napi_pending_exception` zurück. Tun Sie also so wenig wie möglich und kehren Sie dann zu JavaScript zurück, wo die Ausnahme behandelt werden kann.

Der zweite Ansatz besteht darin, zu versuchen, die Ausnahme zu behandeln. Es wird Fälle geben, in denen der native Code die Ausnahme abfangen, die entsprechenden Maßnahmen ergreifen und dann fortfahren kann. Dies wird nur in bestimmten Fällen empfohlen, in denen bekannt ist, dass die Ausnahme sicher behandelt werden kann. In diesen Fällen kann [`napi_get_and_clear_last_exception`](/de/nodejs/api/n-api#napi_get_and_clear_last_exception) verwendet werden, um die Ausnahme abzurufen und zu löschen. Bei Erfolg enthält result das Handle für das letzte ausgelöste JavaScript-`Object`. Wenn nach dem Abrufen der Ausnahme festgestellt wird, dass die Ausnahme doch nicht behandelt werden kann, kann sie mit [`napi_throw`](/de/nodejs/api/n-api#napi_throw) erneut ausgelöst werden, wobei error der JavaScript-Wert ist, der ausgelöst werden soll.

Die folgenden Hilfsfunktionen sind ebenfalls verfügbar, falls nativer Code eine Ausnahme auslösen oder feststellen muss, ob ein `napi_value` eine Instanz eines JavaScript-`Error`-Objekts ist: [`napi_throw_error`](/de/nodejs/api/n-api#napi_throw_error), [`napi_throw_type_error`](/de/nodejs/api/n-api#napi_throw_type_error), [`napi_throw_range_error`](/de/nodejs/api/n-api#napi_throw_range_error), [`node_api_throw_syntax_error`](/de/nodejs/api/n-api#node_api_throw_syntax_error) und [`napi_is_error`](/de/nodejs/api/n-api#napi_is_error).

Die folgenden Hilfsfunktionen sind ebenfalls verfügbar, falls nativer Code ein `Error`-Objekt erstellen muss: [`napi_create_error`](/de/nodejs/api/n-api#napi_create_error), [`napi_create_type_error`](/de/nodejs/api/n-api#napi_create_type_error), [`napi_create_range_error`](/de/nodejs/api/n-api#napi_create_range_error) und [`node_api_create_syntax_error`](/de/nodejs/api/n-api#node_api_create_syntax_error), wobei result der `napi_value` ist, der auf das neu erstellte JavaScript-`Error`-Objekt verweist.

Das Node.js-Projekt fügt allen intern generierten Fehlern Fehlercodes hinzu. Das Ziel ist, dass Anwendungen diese Fehlercodes für alle Fehlerprüfungen verwenden. Die zugehörigen Fehlermeldungen bleiben erhalten, sind aber nur für die Protokollierung und Anzeige bestimmt, in der Erwartung, dass sich die Nachricht ohne SemVer ändern kann. Um dieses Modell mit Node-API sowohl in interner Funktionalität als auch für modulspezifische Funktionalität (als gute Praxis) zu unterstützen, nehmen die `throw_`- und `create_`-Funktionen einen optionalen Code-Parameter entgegen, der die Zeichenkette für den Code ist, der dem Fehlerobjekt hinzugefügt werden soll. Wenn der optionale Parameter `NULL` ist, wird dem Fehler kein Code zugeordnet. Wenn ein Code angegeben wird, wird auch der Name, der dem Fehler zugeordnet ist, aktualisiert:

```text [TEXT]
originalName [code]
```
wobei `originalName` der ursprüngliche Name ist, der dem Fehler zugeordnet ist, und `code` der angegebene Code ist. Wenn der Code beispielsweise `'ERR_ERROR_1'` ist und ein `TypeError` erstellt wird, lautet der Name:

```text [TEXT]
TypeError [ERR_ERROR_1]
```

#### `napi_throw` {#napi_throw}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
NAPI_EXTERN napi_status napi_throw(napi_env env, napi_value error);
```
- `[in] env`: Die Umgebung, in der die API aufgerufen wird.
- `[in] error`: Der JavaScript-Wert, der geworfen werden soll.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API wirft den bereitgestellten JavaScript-Wert.

#### `napi_throw_error` {#napi_throw_error}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
NAPI_EXTERN napi_status napi_throw_error(napi_env env,
                                         const char* code,
                                         const char* msg);
```
- `[in] env`: Die Umgebung, in der die API aufgerufen wird.
- `[in] code`: Optionaler Fehlercode, der für den Fehler festgelegt werden soll.
- `[in] msg`: C-String, der den Text darstellt, der dem Fehler zugeordnet werden soll.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API wirft ein JavaScript `Error` mit dem bereitgestellten Text.

#### `napi_throw_type_error` {#napi_throw_type_error}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
NAPI_EXTERN napi_status napi_throw_type_error(napi_env env,
                                              const char* code,
                                              const char* msg);
```
- `[in] env`: Die Umgebung, in der die API aufgerufen wird.
- `[in] code`: Optionaler Fehlercode, der für den Fehler festgelegt werden soll.
- `[in] msg`: C-String, der den Text darstellt, der dem Fehler zugeordnet werden soll.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API wirft ein JavaScript `TypeError` mit dem bereitgestellten Text.

#### `napi_throw_range_error` {#napi_throw_range_error}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
NAPI_EXTERN napi_status napi_throw_range_error(napi_env env,
                                               const char* code,
                                               const char* msg);
```
- `[in] env`: Die Umgebung, in der die API aufgerufen wird.
- `[in] code`: Optionaler Fehlercode, der für den Fehler festgelegt werden soll.
- `[in] msg`: C-String, der den Text darstellt, der dem Fehler zugeordnet werden soll.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API wirft ein JavaScript `RangeError` mit dem bereitgestellten Text.


#### `node_api_throw_syntax_error` {#node_api_throw_syntax_error}

**Hinzugefügt in: v17.2.0, v16.14.0**

**N-API Version: 9**

```C [C]
NAPI_EXTERN napi_status node_api_throw_syntax_error(napi_env env,
                                                    const char* code,
                                                    const char* msg);
```
- `[in] env`: Die Umgebung, unter der die API aufgerufen wird.
- `[in] code`: Optionaler Fehlercode, der für den Fehler festgelegt werden soll.
- `[in] msg`: C-String, der den Text darstellt, der dem Fehler zugeordnet werden soll.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API wirft ein JavaScript `SyntaxError` mit dem bereitgestellten Text.

#### `napi_is_error` {#napi_is_error}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
NAPI_EXTERN napi_status napi_is_error(napi_env env,
                                      napi_value value,
                                      bool* result);
```
- `[in] env`: Die Umgebung, unter der die API aufgerufen wird.
- `[in] value`: Der zu prüfende `napi_value`.
- `[out] result`: Boolescher Wert, der auf true gesetzt wird, wenn `napi_value` einen Fehler darstellt, andernfalls false.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API fragt einen `napi_value` ab, um zu überprüfen, ob er ein Fehlerobjekt darstellt.

#### `napi_create_error` {#napi_create_error}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
NAPI_EXTERN napi_status napi_create_error(napi_env env,
                                          napi_value code,
                                          napi_value msg,
                                          napi_value* result);
```
- `[in] env`: Die Umgebung, unter der die API aufgerufen wird.
- `[in] code`: Optionaler `napi_value` mit der Zeichenkette für den Fehlercode, der dem Fehler zugeordnet werden soll.
- `[in] msg`: `napi_value`, der auf einen JavaScript `string` verweist, der als Nachricht für den `Error` verwendet werden soll.
- `[out] result`: `napi_value`, der den erstellten Fehler darstellt.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API gibt einen JavaScript `Error` mit dem bereitgestellten Text zurück.

#### `napi_create_type_error` {#napi_create_type_error}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
NAPI_EXTERN napi_status napi_create_type_error(napi_env env,
                                               napi_value code,
                                               napi_value msg,
                                               napi_value* result);
```
- `[in] env`: Die Umgebung, unter der die API aufgerufen wird.
- `[in] code`: Optionaler `napi_value` mit der Zeichenkette für den Fehlercode, der dem Fehler zugeordnet werden soll.
- `[in] msg`: `napi_value`, der auf einen JavaScript `string` verweist, der als Nachricht für den `Error` verwendet werden soll.
- `[out] result`: `napi_value`, der den erstellten Fehler darstellt.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API gibt einen JavaScript `TypeError` mit dem bereitgestellten Text zurück.


#### `napi_create_range_error` {#napi_create_range_error}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
NAPI_EXTERN napi_status napi_create_range_error(napi_env env,
                                                napi_value code,
                                                napi_value msg,
                                                napi_value* result);
```
- `[in] env`: Die Umgebung, unter der die API aufgerufen wird.
- `[in] code`: Optionaler `napi_value` mit der Zeichenkette für den Fehlercode, der dem Fehler zugeordnet werden soll.
- `[in] msg`: `napi_value`, die eine JavaScript-`string` referenziert, die als Meldung für den `Error` verwendet werden soll.
- `[out] result`: `napi_value`, die den erstellten Fehler darstellt.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API gibt einen JavaScript-`RangeError` mit dem angegebenen Text zurück.

#### `node_api_create_syntax_error` {#node_api_create_syntax_error}

**Hinzugefügt in: v17.2.0, v16.14.0**

**N-API Version: 9**

```C [C]
NAPI_EXTERN napi_status node_api_create_syntax_error(napi_env env,
                                                     napi_value code,
                                                     napi_value msg,
                                                     napi_value* result);
```
- `[in] env`: Die Umgebung, unter der die API aufgerufen wird.
- `[in] code`: Optionaler `napi_value` mit der Zeichenkette für den Fehlercode, der dem Fehler zugeordnet werden soll.
- `[in] msg`: `napi_value`, die eine JavaScript-`string` referenziert, die als Meldung für den `Error` verwendet werden soll.
- `[out] result`: `napi_value`, die den erstellten Fehler darstellt.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API gibt einen JavaScript-`SyntaxError` mit dem angegebenen Text zurück.

#### `napi_get_and_clear_last_exception` {#napi_get_and_clear_last_exception}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
napi_status napi_get_and_clear_last_exception(napi_env env,
                                              napi_value* result);
```
- `[in] env`: Die Umgebung, unter der die API aufgerufen wird.
- `[out] result`: Die Ausnahme, falls eine aussteht, ansonsten `NULL`.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API kann auch dann aufgerufen werden, wenn eine ausstehende JavaScript-Ausnahme vorhanden ist.


#### `napi_is_exception_pending` {#napi_is_exception_pending}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
napi_status napi_is_exception_pending(napi_env env, bool* result);
```
- `[in] env`: Die Umgebung, in der die API aufgerufen wird.
- `[out] result`: Boolescher Wert, der auf true gesetzt wird, wenn eine Ausnahme aussteht.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API kann auch dann aufgerufen werden, wenn eine ausstehende JavaScript-Ausnahme vorliegt.

#### `napi_fatal_exception` {#napi_fatal_exception}

**Hinzugefügt in: v9.10.0**

**N-API Version: 3**

```C [C]
napi_status napi_fatal_exception(napi_env env, napi_value err);
```
- `[in] env`: Die Umgebung, in der die API aufgerufen wird.
- `[in] err`: Der Fehler, der an `'uncaughtException'` übergeben wird.

Löst eine `'uncaughtException'` in JavaScript aus. Nützlich, wenn ein asynchroner Rückruf eine Ausnahme auslöst, die nicht behoben werden kann.

### Schwerwiegende Fehler {#fatal-errors}

Im Falle eines nicht behebbaren Fehlers in einem nativen Add-on kann ein schwerwiegender Fehler ausgelöst werden, um den Prozess sofort zu beenden.

#### `napi_fatal_error` {#napi_fatal_error}

**Hinzugefügt in: v8.2.0**

**N-API Version: 1**

```C [C]
NAPI_NO_RETURN void napi_fatal_error(const char* location,
                                     size_t location_len,
                                     const char* message,
                                     size_t message_len);
```
- `[in] location`: Optionaler Ort, an dem der Fehler aufgetreten ist.
- `[in] location_len`: Die Länge des Orts in Byte oder `NAPI_AUTO_LENGTH`, wenn er Null-terminiert ist.
- `[in] message`: Die mit dem Fehler verbundene Nachricht.
- `[in] message_len`: Die Länge der Nachricht in Byte oder `NAPI_AUTO_LENGTH`, wenn sie Null-terminiert ist.

Der Funktionsaufruf kehrt nicht zurück, der Prozess wird beendet.

Diese API kann auch dann aufgerufen werden, wenn eine ausstehende JavaScript-Ausnahme vorliegt.

## Lebensdauerverwaltung von Objekten {#object-lifetime-management}

Wenn Node-API-Aufrufe getätigt werden, können Handles zu Objekten im Heap für die zugrunde liegende VM als `napi_values` zurückgegeben werden. Diese Handles müssen die Objekte "live" halten, bis sie vom nativen Code nicht mehr benötigt werden, da die Objekte andernfalls erfasst werden könnten, bevor der native Code sie fertig verwendet hat.

Wenn Objekthandles zurückgegeben werden, werden sie einem "Scope" zugeordnet. Die Lebensdauer des Standard-Scopes ist an die Lebensdauer des nativen Methodenaufrufs gebunden. Das Ergebnis ist, dass Handles standardmäßig gültig bleiben und die mit diesen Handles verknüpften Objekte für die Lebensdauer des nativen Methodenaufrufs live gehalten werden.

In vielen Fällen ist es jedoch erforderlich, dass die Handles entweder eine kürzere oder längere Lebensdauer als die der nativen Methode haben. In den folgenden Abschnitten werden die Node-API-Funktionen beschrieben, die verwendet werden können, um die Lebensdauer des Handles von der Standardeinstellung zu ändern.


### Die Lebensdauer von Handles kürzer als die der nativen Methode gestalten {#making-handle-lifespan-shorter-than-that-of-the-native-method}

Es ist oft notwendig, die Lebensdauer von Handles kürzer zu gestalten als die einer nativen Methode. Betrachten Sie beispielsweise eine native Methode, die eine Schleife enthält, die die Elemente in einem großen Array durchläuft:

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
Dies würde dazu führen, dass eine große Anzahl von Handles erstellt wird, was erhebliche Ressourcen verbraucht. Darüber hinaus würden, obwohl der native Code nur das aktuellste Handle verwenden könnte, alle zugehörigen Objekte ebenfalls aktiv gehalten, da sie alle denselben Scope teilen.

Um diesen Fall zu behandeln, bietet Node-API die Möglichkeit, einen neuen 'Scope' einzurichten, dem neu erstellte Handles zugeordnet werden. Sobald diese Handles nicht mehr benötigt werden, kann der Scope 'geschlossen' werden und alle Handles, die dem Scope zugeordnet sind, werden ungültig. Die zum Öffnen/Schließen von Scopes verfügbaren Methoden sind [`napi_open_handle_scope`](/de/nodejs/api/n-api#napi_open_handle_scope) und [`napi_close_handle_scope`](/de/nodejs/api/n-api#napi_close_handle_scope).

Node-API unterstützt nur eine einzelne, verschachtelte Hierarchie von Scopes. Es gibt zu jedem Zeitpunkt nur einen aktiven Scope, und alle neuen Handles werden diesem Scope zugeordnet, solange er aktiv ist. Scopes müssen in der umgekehrten Reihenfolge geschlossen werden, in der sie geöffnet wurden. Darüber hinaus müssen alle Scopes, die innerhalb einer nativen Methode erstellt wurden, geschlossen werden, bevor von dieser Methode zurückgekehrt wird.

Wenn wir das vorherige Beispiel nehmen, würde das Hinzufügen von Aufrufen von [`napi_open_handle_scope`](/de/nodejs/api/n-api#napi_open_handle_scope) und [`napi_close_handle_scope`](/de/nodejs/api/n-api#napi_close_handle_scope) sicherstellen, dass höchstens ein einzelnes Handle während der Ausführung der Schleife gültig ist:

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
Beim Verschachteln von Scopes gibt es Fälle, in denen ein Handle aus einem inneren Scope über die Lebensdauer dieses Scopes hinaus leben muss. Node-API unterstützt einen 'Escapable Scope', um diesen Fall zu unterstützen. Ein Escapable Scope ermöglicht es, ein Handle zu 'promoten', so dass es dem aktuellen Scope 'entkommt' und die Lebensdauer des Handles sich vom aktuellen Scope auf den des äußeren Scopes ändert.

Die zum Öffnen/Schließen von Escapable Scopes verfügbaren Methoden sind [`napi_open_escapable_handle_scope`](/de/nodejs/api/n-api#napi_open_escapable_handle_scope) und [`napi_close_escapable_handle_scope`](/de/nodejs/api/n-api#napi_close_escapable_handle_scope).

Die Anforderung zur Förderung eines Handles erfolgt über [`napi_escape_handle`](/de/nodejs/api/n-api#napi_escape_handle), die nur einmal aufgerufen werden kann.


#### `napi_open_handle_scope` {#napi_open_handle_scope}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
NAPI_EXTERN napi_status napi_open_handle_scope(napi_env env,
                                               napi_handle_scope* result);
```
- `[in] env`: Die Umgebung, in der die API aufgerufen wird.
- `[out] result`: `napi_value`, die den neuen Gültigkeitsbereich darstellt.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API öffnet einen neuen Gültigkeitsbereich.

#### `napi_close_handle_scope` {#napi_close_handle_scope}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
NAPI_EXTERN napi_status napi_close_handle_scope(napi_env env,
                                                napi_handle_scope scope);
```
- `[in] env`: Die Umgebung, in der die API aufgerufen wird.
- `[in] scope`: `napi_value`, die den zu schließenden Gültigkeitsbereich darstellt.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API schließt den übergebenen Gültigkeitsbereich. Gültigkeitsbereiche müssen in der umgekehrten Reihenfolge geschlossen werden, in der sie erstellt wurden.

Diese API kann auch dann aufgerufen werden, wenn eine ausstehende JavaScript-Ausnahme vorliegt.

#### `napi_open_escapable_handle_scope` {#napi_open_escapable_handle_scope}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
NAPI_EXTERN napi_status
    napi_open_escapable_handle_scope(napi_env env,
                                     napi_handle_scope* result);
```
- `[in] env`: Die Umgebung, in der die API aufgerufen wird.
- `[out] result`: `napi_value`, die den neuen Gültigkeitsbereich darstellt.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API öffnet einen neuen Gültigkeitsbereich, aus dem ein Objekt in den äußeren Gültigkeitsbereich hochgestuft werden kann.

#### `napi_close_escapable_handle_scope` {#napi_close_escapable_handle_scope}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
NAPI_EXTERN napi_status
    napi_close_escapable_handle_scope(napi_env env,
                                      napi_handle_scope scope);
```
- `[in] env`: Die Umgebung, in der die API aufgerufen wird.
- `[in] scope`: `napi_value`, die den zu schließenden Gültigkeitsbereich darstellt.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API schließt den übergebenen Gültigkeitsbereich. Gültigkeitsbereiche müssen in der umgekehrten Reihenfolge geschlossen werden, in der sie erstellt wurden.

Diese API kann auch dann aufgerufen werden, wenn eine ausstehende JavaScript-Ausnahme vorliegt.


#### `napi_escape_handle` {#napi_escape_handle}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
napi_status napi_escape_handle(napi_env env,
                               napi_escapable_handle_scope scope,
                               napi_value escapee,
                               napi_value* result);
```
- `[in] env`: Die Umgebung, unter der die API aufgerufen wird.
- `[in] scope`: `napi_value`, die den aktuellen Gültigkeitsbereich darstellt.
- `[in] escapee`: `napi_value`, die das JavaScript-`Object` darstellt, das "escaped" werden soll.
- `[out] result`: `napi_value`, die das Handle zum "escaped" `Object` im äußeren Gültigkeitsbereich darstellt.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API "promotet" das Handle zum JavaScript-Objekt, sodass es für die Lebensdauer des äußeren Gültigkeitsbereichs gültig ist. Sie kann nur einmal pro Gültigkeitsbereich aufgerufen werden. Wenn sie mehr als einmal aufgerufen wird, wird ein Fehler zurückgegeben.

Diese API kann auch dann aufgerufen werden, wenn eine ausstehende JavaScript-Exception vorliegt.

### Referenzen auf Werte mit einer längeren Lebensdauer als die der nativen Methode {#references-to-values-with-a-lifespan-longer-than-that-of-the-native-method}

In einigen Fällen muss ein Add-on in der Lage sein, Werte mit einer längeren Lebensdauer als die eines einzelnen nativen Methodenaufrufs zu erstellen und zu referenzieren. Um beispielsweise einen Konstruktor zu erstellen und diesen Konstruktor später in einer Anfrage zur Erstellung von Instanzen zu verwenden, muss es möglich sein, das Konstruktorobjekt über viele verschiedene Instanzerstellungsanfragen hinweg zu referenzieren. Dies wäre mit einem normalen Handle, das als `napi_value` zurückgegeben wird, wie im vorherigen Abschnitt beschrieben, nicht möglich. Die Lebensdauer eines normalen Handles wird durch Gültigkeitsbereiche verwaltet, und alle Gültigkeitsbereiche müssen vor dem Ende einer nativen Methode geschlossen werden.

Node-API bietet Methoden zum Erstellen persistenter Referenzen auf Werte. Derzeit erlaubt Node-API nur die Erstellung von Referenzen für eine begrenzte Anzahl von Werttypen, darunter Objekt, External, Funktion und Symbol.

Jede Referenz hat einen zugehörigen Zähler mit einem Wert von 0 oder höher, der bestimmt, ob die Referenz den entsprechenden Wert am Leben erhält. Referenzen mit einem Zähler von 0 verhindern nicht, dass Werte gesammelt werden. Werte vom Typ Objekt (Objekt, Funktion, External) und Symbol werden zu "schwachen" Referenzen und können weiterhin aufgerufen werden, solange sie nicht gesammelt werden. Jeder Zähler, der größer als 0 ist, verhindert, dass die Werte gesammelt werden.

Symbolwerte haben unterschiedliche Varianten. Das echte Verhalten einer schwachen Referenz wird nur von lokalen Symbolen unterstützt, die mit der Funktion `napi_create_symbol` oder den JavaScript-Konstruktoraufrufen `Symbol()` erstellt wurden. Global registrierte Symbole, die mit der Funktion `node_api_symbol_for` oder den JavaScript-Funktionsaufrufen `Symbol.for()` erstellt wurden, bleiben immer starke Referenzen, da der Garbage Collector sie nicht sammelt. Dasselbe gilt für bekannte Symbole wie `Symbol.iterator`. Sie werden auch nie vom Garbage Collector gesammelt.

Referenzen können mit einem anfänglichen Referenzzähler erstellt werden. Der Zähler kann dann über [`napi_reference_ref`](/de/nodejs/api/n-api#napi_reference_ref) und [`napi_reference_unref`](/de/nodejs/api/n-api#napi_reference_unref) geändert werden. Wenn ein Objekt gesammelt wird, während der Zähler für eine Referenz 0 ist, geben alle nachfolgenden Aufrufe zum Abrufen des Objekts, das der Referenz zugeordnet ist [`napi_get_reference_value`](/de/nodejs/api/n-api#napi_get_reference_value), `NULL` für den zurückgegebenen `napi_value` zurück. Ein Versuch, [`napi_reference_ref`](/de/nodejs/api/n-api#napi_reference_ref) für eine Referenz aufzurufen, deren Objekt gesammelt wurde, führt zu einem Fehler.

Referenzen müssen gelöscht werden, sobald sie vom Add-on nicht mehr benötigt werden. Wenn eine Referenz gelöscht wird, verhindert sie nicht mehr, dass das entsprechende Objekt gesammelt wird. Das Versäumnis, eine persistente Referenz zu löschen, führt zu einem "Speicherleck", wobei sowohl der native Speicher für die persistente Referenz als auch das entsprechende Objekt im Heap dauerhaft beibehalten werden.

Es können mehrere persistente Referenzen erstellt werden, die sich auf dasselbe Objekt beziehen, von denen jede entweder das Objekt am Leben erhält oder nicht, basierend auf ihrem individuellen Zähler. Mehrere persistente Referenzen auf dasselbe Objekt können dazu führen, dass nativer Speicher unerwartet lange am Leben erhalten wird. Die nativen Strukturen für eine persistente Referenz müssen am Leben erhalten werden, bis Finalizer für das referenzierte Objekt ausgeführt werden. Wenn eine neue persistente Referenz für dasselbe Objekt erstellt wird, werden die Finalizer für dieses Objekt nicht ausgeführt und der native Speicher, auf den die frühere persistente Referenz zeigt, wird nicht freigegeben. Dies kann vermieden werden, indem zusätzlich zu `napi_reference_unref` auch `napi_delete_reference` aufgerufen wird, wenn möglich.

**Änderungshistorie:**

-  Experimentell (`NAPI_EXPERIMENTAL` ist definiert): Referenzen können für alle Werttypen erstellt werden. Die neuen unterstützten Werttypen unterstützen keine schwache Referenzsemantik und die Werte dieser Typen werden freigegeben, wenn der Referenzzähler 0 wird und nicht mehr über die Referenz aufgerufen werden kann.


#### `napi_create_reference` {#napi_create_reference}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
NAPI_EXTERN napi_status napi_create_reference(napi_env env,
                                              napi_value value,
                                              uint32_t initial_refcount,
                                              napi_ref* result);
```
- `[in] env`: Die Umgebung, in der die API aufgerufen wird.
- `[in] value`: Der `napi_value`, für den eine Referenz erstellt wird.
- `[in] initial_refcount`: Anfänglicher Referenzzähler für die neue Referenz.
- `[out] result`: `napi_ref`, der auf die neue Referenz zeigt.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API erstellt eine neue Referenz mit dem angegebenen Referenzzähler auf den übergebenen Wert.

#### `napi_delete_reference` {#napi_delete_reference}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
NAPI_EXTERN napi_status napi_delete_reference(napi_env env, napi_ref ref);
```
- `[in] env`: Die Umgebung, in der die API aufgerufen wird.
- `[in] ref`: `napi_ref`, die gelöscht werden soll.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API löscht die übergebene Referenz.

Diese API kann auch dann aufgerufen werden, wenn eine ausstehende JavaScript-Ausnahme vorliegt.

#### `napi_reference_ref` {#napi_reference_ref}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
NAPI_EXTERN napi_status napi_reference_ref(napi_env env,
                                           napi_ref ref,
                                           uint32_t* result);
```
- `[in] env`: Die Umgebung, in der die API aufgerufen wird.
- `[in] ref`: `napi_ref`, für die der Referenzzähler erhöht wird.
- `[out] result`: Der neue Referenzzähler.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API erhöht den Referenzzähler für die übergebene Referenz und gibt den resultierenden Referenzzähler zurück.

#### `napi_reference_unref` {#napi_reference_unref}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
NAPI_EXTERN napi_status napi_reference_unref(napi_env env,
                                             napi_ref ref,
                                             uint32_t* result);
```
- `[in] env`: Die Umgebung, in der die API aufgerufen wird.
- `[in] ref`: `napi_ref`, für die der Referenzzähler verringert wird.
- `[out] result`: Der neue Referenzzähler.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API verringert den Referenzzähler für die übergebene Referenz und gibt den resultierenden Referenzzähler zurück.


#### `napi_get_reference_value` {#napi_get_reference_value}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
NAPI_EXTERN napi_status napi_get_reference_value(napi_env env,
                                                 napi_ref ref,
                                                 napi_value* result);
```
- `[in] env`: Die Umgebung, in der die API aufgerufen wird.
- `[in] ref`: Die `napi_ref`, für die der entsprechende Wert angefordert wird.
- `[out] result`: Der `napi_value`, auf den die `napi_ref` verweist.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Wenn sie noch gültig ist, gibt diese API den `napi_value` zurück, der den JavaScript-Wert darstellt, der mit der `napi_ref` verknüpft ist. Andernfalls ist das Ergebnis `NULL`.

### Bereinigung beim Beenden der aktuellen Node.js-Umgebung {#cleanup-on-exit-of-the-current-nodejs-environment}

Während ein Node.js-Prozess in der Regel alle seine Ressourcen beim Beenden freigibt, können Einbettungen von Node.js oder zukünftige Worker-Unterstützung erfordern, dass Add-ons Bereinigungshooks registrieren, die ausgeführt werden, sobald die aktuelle Node.js-Umgebung beendet wird.

Node-API bietet Funktionen zum Registrieren und Deregistrieren solcher Rückrufe. Wenn diese Rückrufe ausgeführt werden, sollten alle Ressourcen, die vom Add-on gehalten werden, freigegeben werden.

#### `napi_add_env_cleanup_hook` {#napi_add_env_cleanup_hook}

**Hinzugefügt in: v10.2.0**

**N-API Version: 3**

```C [C]
NODE_EXTERN napi_status napi_add_env_cleanup_hook(node_api_basic_env env,
                                                  napi_cleanup_hook fun,
                                                  void* arg);
```
Registriert `fun` als eine Funktion, die mit dem `arg`-Parameter ausgeführt werden soll, sobald die aktuelle Node.js-Umgebung beendet wird.

Eine Funktion kann sicher mehrmals mit unterschiedlichen `arg`-Werten angegeben werden. In diesem Fall wird sie auch mehrmals aufgerufen. Das mehrmalige Angeben derselben `fun`- und `arg`-Werte ist nicht zulässig und führt zum Abbruch des Prozesses.

Die Hooks werden in umgekehrter Reihenfolge aufgerufen, d.h. der zuletzt hinzugefügte wird zuerst aufgerufen.

Das Entfernen dieses Hooks kann mit [`napi_remove_env_cleanup_hook`](/de/nodejs/api/n-api#napi_remove_env_cleanup_hook) erfolgen. Dies geschieht in der Regel, wenn die Ressource, für die dieser Hook hinzugefügt wurde, ohnehin abgebaut wird.

Für die asynchrone Bereinigung steht [`napi_add_async_cleanup_hook`](/de/nodejs/api/n-api#napi_add_async_cleanup_hook) zur Verfügung.


#### `napi_remove_env_cleanup_hook` {#napi_remove_env_cleanup_hook}

**Hinzugefügt in: v10.2.0**

**N-API Version: 3**

```C [C]
NAPI_EXTERN napi_status napi_remove_env_cleanup_hook(node_api_basic_env env,
                                                     void (*fun)(void* arg),
                                                     void* arg);
```
Hebt die Registrierung von `fun` als eine Funktion auf, die mit dem Parameter `arg` ausgeführt werden soll, sobald die aktuelle Node.js-Umgebung beendet wird. Sowohl das Argument als auch der Funktionswert müssen exakt übereinstimmen.

Die Funktion muss ursprünglich mit `napi_add_env_cleanup_hook` registriert worden sein, andernfalls wird der Prozess abgebrochen.

#### `napi_add_async_cleanup_hook` {#napi_add_async_cleanup_hook}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v14.10.0, v12.19.0 | Signatur des `hook` Callbacks geändert. |
| v14.8.0, v12.19.0 | Hinzugefügt in: v14.8.0, v12.19.0 |
:::

**N-API Version: 8**

```C [C]
NAPI_EXTERN napi_status napi_add_async_cleanup_hook(
    node_api_basic_env env,
    napi_async_cleanup_hook hook,
    void* arg,
    napi_async_cleanup_hook_handle* remove_handle);
```
- `[in] env`: Die Umgebung, in der die API aufgerufen wird.
- `[in] hook`: Der Funktionszeiger, der beim Abbau der Umgebung aufgerufen werden soll.
- `[in] arg`: Der Zeiger, der an `hook` übergeben wird, wenn er aufgerufen wird.
- `[out] remove_handle`: Optionaler Handle, der sich auf den asynchronen Bereinigungshook bezieht.

Registriert `hook`, eine Funktion vom Typ [`napi_async_cleanup_hook`](/de/nodejs/api/n-api#napi_async_cleanup_hook), als eine Funktion, die mit den Parametern `remove_handle` und `arg` ausgeführt werden soll, sobald die aktuelle Node.js-Umgebung beendet wird.

Im Gegensatz zu [`napi_add_env_cleanup_hook`](/de/nodejs/api/n-api#napi_add_env_cleanup_hook) darf der Hook asynchron sein.

Ansonsten entspricht das Verhalten im Allgemeinen dem von [`napi_add_env_cleanup_hook`](/de/nodejs/api/n-api#napi_add_env_cleanup_hook).

Wenn `remove_handle` nicht `NULL` ist, wird ein undurchsichtiger Wert darin gespeichert, der später an [`napi_remove_async_cleanup_hook`](/de/nodejs/api/n-api#napi_remove_async_cleanup_hook) übergeben werden muss, unabhängig davon, ob der Hook bereits aufgerufen wurde oder nicht. Dies geschieht typischerweise, wenn die Ressource, für die dieser Hook hinzugefügt wurde, ohnehin abgebaut wird.


#### `napi_remove_async_cleanup_hook` {#napi_remove_async_cleanup_hook}


::: info [History]
| Version | Changes |
| --- | --- |
| v14.10.0, v12.19.0 | `env`-Parameter entfernt. |
| v14.8.0, v12.19.0 | Hinzugefügt in: v14.8.0, v12.19.0 |
:::

```C [C]
NAPI_EXTERN napi_status napi_remove_async_cleanup_hook(
    napi_async_cleanup_hook_handle remove_handle);
```
- `[in] remove_handle`: Das Handle zu einem asynchronen Cleanup-Hook, der mit [`napi_add_async_cleanup_hook`](/de/nodejs/api/n-api#napi_add_async_cleanup_hook) erstellt wurde.

Hebt die Registrierung des Cleanup-Hooks auf, der `remove_handle` entspricht. Dies verhindert die Ausführung des Hooks, es sei denn, er hat bereits mit der Ausführung begonnen. Dies muss für jeden `napi_async_cleanup_hook_handle`-Wert aufgerufen werden, der von [`napi_add_async_cleanup_hook`](/de/nodejs/api/n-api#napi_add_async_cleanup_hook) erhalten wurde.

### Finalisierung beim Beenden der Node.js-Umgebung {#finalization-on-the-exit-of-the-nodejs-environment}

Die Node.js-Umgebung kann zu einem beliebigen Zeitpunkt so schnell wie möglich abgebaut werden, wobei die JavaScript-Ausführung nicht zulässig ist, wie z. B. auf Anfrage von [`worker.terminate()`](/de/nodejs/api/worker_threads#workerterminate). Wenn die Umgebung abgebaut wird, werden die registrierten `napi_finalize`-Callbacks von JavaScript-Objekten, Thread-sicheren Funktionen und Umgebungsinstanzdaten sofort und unabhängig voneinander aufgerufen.

Der Aufruf von `napi_finalize`-Callbacks wird nach den manuell registrierten Cleanup-Hooks geplant. Um eine korrekte Reihenfolge der Addon-Finalisierung während des Herunterfahrens der Umgebung sicherzustellen, um Use-after-Free im `napi_finalize`-Callback zu vermeiden, sollten Addons einen Cleanup-Hook mit `napi_add_env_cleanup_hook` und `napi_add_async_cleanup_hook` registrieren, um die zugewiesene Ressource manuell in der richtigen Reihenfolge freizugeben.

## Modulregistrierung {#module-registration}

Node-API-Module werden auf ähnliche Weise wie andere Module registriert, mit der Ausnahme, dass anstelle des Makros `NODE_MODULE` Folgendes verwendet wird:

```C [C]
NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)
```
Der nächste Unterschied ist die Signatur für die `Init`-Methode. Für ein Node-API-Modul lautet sie wie folgt:

```C [C]
napi_value Init(napi_env env, napi_value exports);
```
Der Rückgabewert von `Init` wird als das `exports`-Objekt für das Modul behandelt. Die `Init`-Methode erhält als Bequemlichkeit ein leeres Objekt über den `exports`-Parameter. Wenn `Init` `NULL` zurückgibt, wird der als `exports` übergebene Parameter vom Modul exportiert. Node-API-Module können das `module`-Objekt nicht ändern, können aber alles als die `exports`-Eigenschaft des Moduls angeben.

Um die Methode `hello` als Funktion hinzuzufügen, damit sie als eine vom Addon bereitgestellte Methode aufgerufen werden kann:

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
So setzen Sie eine Funktion, die von der `require()` für das Addon zurückgegeben werden soll:

```C [C]
napi_value Init(napi_env env, napi_value exports) {
  napi_value method;
  napi_status status;
  status = napi_create_function(env, "exports", NAPI_AUTO_LENGTH, Method, NULL, &method);
  if (status != napi_ok) return NULL;
  return method;
}
```
So definieren Sie eine Klasse, sodass neue Instanzen erstellt werden können (wird oft mit [Objekt-Wrapping](/de/nodejs/api/n-api#object-wrap) verwendet):

```C [C]
// HINWEIS: teilweises Beispiel, nicht der gesamte referenzierte Code ist enthalten
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
Sie können auch das Makro `NAPI_MODULE_INIT` verwenden, das als Kurzform für `NAPI_MODULE` dient und eine `Init`-Funktion definiert:

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
Die Parameter `env` und `exports` werden dem Rumpf des `NAPI_MODULE_INIT`-Makros zur Verfügung gestellt.

Alle Node-API-Addons sind kontextabhängig, d. h. sie können mehrmals geladen werden. Es gibt einige Designüberlegungen bei der Deklaration eines solchen Moduls. Die Dokumentation zu [kontextabhängigen Addons](/de/nodejs/api/addons#context-aware-addons) enthält weitere Details.

Die Variablen `env` und `exports` sind innerhalb des Funktionsrumpfs nach dem Makroaufruf verfügbar.

Weitere Informationen zum Setzen von Eigenschaften auf Objekten finden Sie im Abschnitt über [Arbeiten mit JavaScript-Eigenschaften](/de/nodejs/api/n-api#working-with-javascript-properties).

Weitere Informationen zum Erstellen von Addon-Modulen im Allgemeinen finden Sie in der vorhandenen API.


## Arbeiten mit JavaScript-Werten {#working-with-javascript-values}

Node-API stellt eine Reihe von APIs bereit, um alle Arten von JavaScript-Werten zu erstellen. Einige dieser Typen werden unter [Abschnitt 6](https://tc39.github.io/ecma262/#sec-ecmascript-data-types-and-values) der [ECMAScript Language Specification](https://tc39.github.io/ecma262/) dokumentiert.

Im Wesentlichen werden diese APIs verwendet, um eine der folgenden Aktionen auszuführen:

Node-API-Werte werden durch den Typ `napi_value` dargestellt. Jeder Node-API-Aufruf, der einen JavaScript-Wert benötigt, akzeptiert einen `napi_value`. In einigen Fällen überprüft die API den Typ des `napi_value` im Vorfeld. Für eine bessere Leistung ist es jedoch besser, wenn der Aufrufer sicherstellt, dass der betreffende `napi_value` dem JavaScript-Typ entspricht, der von der API erwartet wird.

### Aufzählungstypen {#enum-types}

#### `napi_key_collection_mode` {#napi_key_collection_mode}

**Hinzugefügt in: v13.7.0, v12.17.0, v10.20.0**

**N-API Version: 6**

```C [C]
typedef enum {
  napi_key_include_prototypes,
  napi_key_own_only
} napi_key_collection_mode;
```
Beschreibt die `Keys/Properties` Filter-Enumerationen:

`napi_key_collection_mode` beschränkt den Bereich der gesammelten Eigenschaften.

`napi_key_own_only` beschränkt die gesammelten Eigenschaften nur auf das gegebene Objekt. `napi_key_include_prototypes` schließt auch alle Schlüssel der Prototypkette des Objekts mit ein.

#### `napi_key_filter` {#napi_key_filter}

**Hinzugefügt in: v13.7.0, v12.17.0, v10.20.0**

**N-API Version: 6**

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
Eigenschaftsfilter-Bits. Sie können mit einem OR-Operator verknüpft werden, um einen zusammengesetzten Filter zu erstellen.

#### `napi_key_conversion` {#napi_key_conversion}

**Hinzugefügt in: v13.7.0, v12.17.0, v10.20.0**

**N-API Version: 6**

```C [C]
typedef enum {
  napi_key_keep_numbers,
  napi_key_numbers_to_strings
} napi_key_conversion;
```
`napi_key_numbers_to_strings` konvertiert Integer-Indizes in Strings. `napi_key_keep_numbers` gibt Zahlen für Integer-Indizes zurück.

#### `napi_valuetype` {#napi_valuetype}

```C [C]
typedef enum {
  // ES6-Typen (entspricht typeof)
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
Beschreibt den Typ eines `napi_value`. Dies entspricht im Allgemeinen den Typen, die in [Abschnitt 6.1](https://tc39.github.io/ecma262/#sec-ecmascript-language-types) der ECMAScript Language Specification beschrieben werden. Zusätzlich zu den Typen in diesem Abschnitt kann `napi_valuetype` auch `Function`s und `Object`s mit externen Daten darstellen.

Ein JavaScript-Wert vom Typ `napi_external` erscheint in JavaScript als ein einfaches Objekt, so dass keine Eigenschaften darauf gesetzt werden können und kein Prototyp vorhanden ist.


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
Dies stellt den zugrunde liegenden binären skalaren Datentyp des `TypedArray` dar. Elemente dieser Enumeration entsprechen [Abschnitt 22.2](https://tc39.github.io/ecma262/#sec-typedarray-objects) der [ECMAScript Language Specification](https://tc39.github.io/ecma262/).

### Objekterstellungsfunktionen {#object-creation-functions}

#### `napi_create_array` {#napi_create_array}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
napi_status napi_create_array(napi_env env, napi_value* result)
```
- `[in] env`: Die Umgebung, unter der der Node-API-Aufruf aufgerufen wird.
- `[out] result`: Ein `napi_value`, das ein JavaScript-`Array` darstellt.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API gibt einen Node-API-Wert zurück, der einem JavaScript-`Array`-Typ entspricht. JavaScript-Arrays werden in [Abschnitt 22.1](https://tc39.github.io/ecma262/#sec-array-objects) der ECMAScript Language Specification beschrieben.

#### `napi_create_array_with_length` {#napi_create_array_with_length}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
napi_status napi_create_array_with_length(napi_env env,
                                          size_t length,
                                          napi_value* result)
```
- `[in] env`: Die Umgebung, unter der die API aufgerufen wird.
- `[in] length`: Die anfängliche Länge des `Array`.
- `[out] result`: Ein `napi_value`, das ein JavaScript-`Array` darstellt.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API gibt einen Node-API-Wert zurück, der einem JavaScript-`Array`-Typ entspricht. Die Längeneigenschaft des `Array` wird auf den übergebenen Längenparameter gesetzt. Es wird jedoch nicht garantiert, dass der zugrunde liegende Puffer von der VM vorab zugewiesen wird, wenn das Array erstellt wird. Dieses Verhalten bleibt der zugrunde liegenden VM-Implementierung überlassen. Wenn der Puffer ein zusammenhängender Speicherblock sein muss, der direkt über C gelesen und/oder geschrieben werden kann, sollten Sie [`napi_create_external_arraybuffer`](/de/nodejs/api/n-api#napi_create_external_arraybuffer) verwenden.

JavaScript-Arrays werden in [Abschnitt 22.1](https://tc39.github.io/ecma262/#sec-array-objects) der ECMAScript Language Specification beschrieben.


#### `napi_create_arraybuffer` {#napi_create_arraybuffer}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
napi_status napi_create_arraybuffer(napi_env env,
                                    size_t byte_length,
                                    void** data,
                                    napi_value* result)
```
- `[in] env`: Die Umgebung, in der die API aufgerufen wird.
- `[in] length`: Die Länge des zu erstellenden Array-Puffers in Bytes.
- `[out] data`: Zeiger auf den zugrunde liegenden Byte-Puffer des `ArrayBuffer`. `data` kann optional durch Übergabe von `NULL` ignoriert werden.
- `[out] result`: Ein `napi_value`, das einen JavaScript-`ArrayBuffer` darstellt.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API gibt einen Node-API-Wert zurück, der einem JavaScript-`ArrayBuffer` entspricht. `ArrayBuffer` werden verwendet, um binäre Datenpuffer fester Länge darzustellen. Sie werden normalerweise als Sicherungspuffer für `TypedArray`-Objekte verwendet. Der zugewiesene `ArrayBuffer` hat einen zugrunde liegenden Byte-Puffer, dessen Größe durch den übergebenen Parameter `length` bestimmt wird. Der zugrunde liegende Puffer wird optional an den Aufrufer zurückgegeben, falls der Aufrufer den Puffer direkt bearbeiten möchte. Dieser Puffer kann nur direkt aus nativem Code beschrieben werden. Um aus JavaScript in diesen Puffer zu schreiben, müsste ein typisiertes Array oder ein `DataView`-Objekt erstellt werden.

JavaScript-`ArrayBuffer`-Objekte werden in [Abschnitt 24.1](https://tc39.github.io/ecma262/#sec-arraybuffer-objects) der ECMAScript-Sprachspezifikation beschrieben.

#### `napi_create_buffer` {#napi_create_buffer}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
napi_status napi_create_buffer(napi_env env,
                               size_t size,
                               void** data,
                               napi_value* result)
```
- `[in] env`: Die Umgebung, in der die API aufgerufen wird.
- `[in] size`: Größe des zugrunde liegenden Puffers in Bytes.
- `[out] data`: Roher Zeiger auf den zugrunde liegenden Puffer. `data` kann optional durch Übergabe von `NULL` ignoriert werden.
- `[out] result`: Ein `napi_value`, das einen `node::Buffer` darstellt.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API weist ein `node::Buffer`-Objekt zu. Obwohl dies immer noch eine vollständig unterstützte Datenstruktur ist, reicht in den meisten Fällen die Verwendung eines `TypedArray` aus.


#### `napi_create_buffer_copy` {#napi_create_buffer_copy}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
napi_status napi_create_buffer_copy(napi_env env,
                                    size_t length,
                                    const void* data,
                                    void** result_data,
                                    napi_value* result)
```
- `[in] env`: Die Umgebung, unter der die API aufgerufen wird.
- `[in] size`: Größe des Eingabepuffers in Bytes (sollte die gleiche Größe wie der neue Puffer haben).
- `[in] data`: Roher Zeiger auf den zugrunde liegenden Puffer, aus dem kopiert werden soll.
- `[out] result_data`: Zeiger auf den zugrunde liegenden Datenpuffer des neuen `Buffer`. `result_data` kann optional durch Übergabe von `NULL` ignoriert werden.
- `[out] result`: Ein `napi_value`, das einen `node::Buffer` darstellt.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API alloziert ein `node::Buffer`-Objekt und initialisiert es mit Daten, die aus dem übergebenen Puffer kopiert wurden. Obwohl dies immer noch eine vollständig unterstützte Datenstruktur ist, reicht in den meisten Fällen die Verwendung eines `TypedArray` aus.

#### `napi_create_date` {#napi_create_date}

**Hinzugefügt in: v11.11.0, v10.17.0**

**N-API Version: 5**

```C [C]
napi_status napi_create_date(napi_env env,
                             double time,
                             napi_value* result);
```
- `[in] env`: Die Umgebung, unter der die API aufgerufen wird.
- `[in] time`: ECMAScript-Zeitwert in Millisekunden seit dem 01. Januar 1970 UTC.
- `[out] result`: Ein `napi_value`, das ein JavaScript `Date` darstellt.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API berücksichtigt keine Schaltsekunden; sie werden ignoriert, da ECMAScript mit der POSIX-Zeitspezifikation übereinstimmt.

Diese API alloziert ein JavaScript `Date`-Objekt.

JavaScript `Date`-Objekte werden in [Abschnitt 20.3](https://tc39.github.io/ecma262/#sec-date-objects) der ECMAScript-Sprachspezifikation beschrieben.

#### `napi_create_external` {#napi_create_external}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
napi_status napi_create_external(napi_env env,
                                 void* data,
                                 napi_finalize finalize_cb,
                                 void* finalize_hint,
                                 napi_value* result)
```
- `[in] env`: Die Umgebung, unter der die API aufgerufen wird.
- `[in] data`: Roher Zeiger auf die externen Daten.
- `[in] finalize_cb`: Optionale Callback-Funktion, die aufgerufen wird, wenn der externe Wert gesammelt wird. [`napi_finalize`](/de/nodejs/api/n-api#napi_finalize) bietet weitere Details.
- `[in] finalize_hint`: Optionaler Hinweis, der während der Sammlung an den Finalize-Callback übergeben wird.
- `[out] result`: Ein `napi_value`, das einen externen Wert darstellt.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API alloziert einen JavaScript-Wert, an den externe Daten angehängt sind. Dies wird verwendet, um externe Daten durch JavaScript-Code zu übergeben, sodass sie später von nativem Code mit [`napi_get_value_external`](/de/nodejs/api/n-api#napi_get_value_external) abgerufen werden können.

Die API fügt einen `napi_finalize`-Callback hinzu, der aufgerufen wird, wenn das gerade erstellte JavaScript-Objekt garbage collected wurde.

Der erstellte Wert ist kein Objekt und unterstützt daher keine zusätzlichen Eigenschaften. Er wird als ein eigener Werttyp betrachtet: Der Aufruf von `napi_typeof()` mit einem externen Wert ergibt `napi_external`.


#### `napi_create_external_arraybuffer` {#napi_create_external_arraybuffer}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
napi_status
napi_create_external_arraybuffer(napi_env env,
                                 void* external_data,
                                 size_t byte_length,
                                 napi_finalize finalize_cb,
                                 void* finalize_hint,
                                 napi_value* result)
```
- `[in] env`: Die Umgebung, unter der die API aufgerufen wird.
- `[in] external_data`: Zeiger auf den zugrunde liegenden Byte-Puffer des `ArrayBuffer`.
- `[in] byte_length`: Die Länge des zugrunde liegenden Puffers in Bytes.
- `[in] finalize_cb`: Optionaler Callback, der aufgerufen wird, wenn der `ArrayBuffer` gesammelt wird. [`napi_finalize`](/de/nodejs/api/n-api#napi_finalize) bietet weitere Details.
- `[in] finalize_hint`: Optionaler Hinweis, der während der Sammlung an den Finalize-Callback übergeben wird.
- `[out] result`: Ein `napi_value`, das einen JavaScript `ArrayBuffer` repräsentiert.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

**Einige Laufzeitumgebungen außer Node.js haben die Unterstützung für externe Puffer eingestellt**. In anderen Laufzeitumgebungen als Node.js kann diese Methode `napi_no_external_buffers_allowed` zurückgeben, um anzuzeigen, dass externe Puffer nicht unterstützt werden. Eine solche Laufzeitumgebung ist Electron, wie in diesem Issue beschrieben [electron/issues/35801](https://github.com/electron/electron/issues/35801).

Um die breiteste Kompatibilität mit allen Laufzeitumgebungen aufrechtzuerhalten, können Sie `NODE_API_NO_EXTERNAL_BUFFERS_ALLOWED` in Ihrem Addon definieren, bevor Sie die Header der Node-API einbinden. Dadurch werden die 2 Funktionen ausgeblendet, die externe Puffer erstellen. Dadurch wird sichergestellt, dass ein Kompilierungsfehler auftritt, wenn Sie versehentlich eine dieser Methoden verwenden.

Diese API gibt einen Node-API-Wert zurück, der einem JavaScript `ArrayBuffer` entspricht. Der zugrunde liegende Byte-Puffer des `ArrayBuffer` wird extern zugewiesen und verwaltet. Der Aufrufer muss sicherstellen, dass der Byte-Puffer gültig bleibt, bis der Finalize-Callback aufgerufen wird.

Die API fügt einen `napi_finalize`-Callback hinzu, der aufgerufen wird, wenn das gerade erstellte JavaScript-Objekt garbage collected wurde.

JavaScript `ArrayBuffer`s werden in [Abschnitt 24.1](https://tc39.github.io/ecma262/#sec-arraybuffer-objects) der ECMAScript Language Specification beschrieben.


#### `napi_create_external_buffer` {#napi_create_external_buffer}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
napi_status napi_create_external_buffer(napi_env env,
                                        size_t length,
                                        void* data,
                                        napi_finalize finalize_cb,
                                        void* finalize_hint,
                                        napi_value* result)
```
- `[in] env`: Die Umgebung, unter der die API aufgerufen wird.
- `[in] length`: Größe des Eingabepuffers in Bytes (sollte die gleiche Größe wie der neue Puffer haben).
- `[in] data`: Roher Zeiger auf den zugrunde liegenden Puffer, der JavaScript zur Verfügung gestellt werden soll.
- `[in] finalize_cb`: Optionale Callback-Funktion, die aufgerufen wird, wenn der `ArrayBuffer` eingesammelt wird. [`napi_finalize`](/de/nodejs/api/n-api#napi_finalize) enthält weitere Details.
- `[in] finalize_hint`: Optionaler Hinweis, der während der Sammlung an die Finalize-Callback-Funktion übergeben wird.
- `[out] result`: Ein `napi_value`, das einen `node::Buffer` darstellt.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

**Einige Laufzeitumgebungen außer Node.js haben die Unterstützung für externe Puffer eingestellt**. In anderen Laufzeitumgebungen als Node.js kann diese Methode `napi_no_external_buffers_allowed` zurückgeben, um anzuzeigen, dass externe Puffer nicht unterstützt werden. Eine solche Laufzeitumgebung ist Electron, wie in diesem Issue beschrieben [electron/issues/35801](https://github.com/electron/electron/issues/35801).

Um die größtmögliche Kompatibilität mit allen Laufzeitumgebungen zu gewährleisten, können Sie `NODE_API_NO_EXTERNAL_BUFFERS_ALLOWED` in Ihrem Add-on definieren, bevor Sie Includes für die Node-API-Header verwenden. Dadurch werden die beiden Funktionen ausgeblendet, die externe Puffer erstellen. Dies stellt sicher, dass ein Kompilierungsfehler auftritt, wenn Sie versehentlich eine dieser Methoden verwenden.

Diese API alloziert ein `node::Buffer`-Objekt und initialisiert es mit Daten, die von dem übergebenen Puffer unterstützt werden. Obwohl dies immer noch eine vollständig unterstützte Datenstruktur ist, reicht in den meisten Fällen die Verwendung eines `TypedArray` aus.

Die API fügt eine `napi_finalize`-Callback-Funktion hinzu, die aufgerufen wird, wenn das gerade erstellte JavaScript-Objekt durch Garbage Collection bereinigt wurde.

Für Node.js \>=4 sind `Buffers` `Uint8Array`s.


#### `napi_create_object` {#napi_create_object}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
napi_status napi_create_object(napi_env env, napi_value* result)
```
- `[in] env`: Die Umgebung, in der die API aufgerufen wird.
- `[out] result`: Ein `napi_value`, der ein JavaScript-`Object` darstellt.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API allokiert ein Standard-JavaScript-`Object`. Sie ist äquivalent zu `new Object()` in JavaScript.

Der JavaScript-`Object`-Typ wird in [Abschnitt 6.1.7](https://tc39.github.io/ecma262/#sec-object-type) der ECMAScript-Sprachspezifikation beschrieben.

#### `napi_create_symbol` {#napi_create_symbol}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
napi_status napi_create_symbol(napi_env env,
                               napi_value description,
                               napi_value* result)
```
- `[in] env`: Die Umgebung, in der die API aufgerufen wird.
- `[in] description`: Optionaler `napi_value`, der auf einen JavaScript-`string` verweist, der als Beschreibung für das Symbol festgelegt werden soll.
- `[out] result`: Ein `napi_value`, der ein JavaScript-`symbol` darstellt.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API erstellt einen JavaScript-`symbol`-Wert aus einer UTF8-kodierten C-Zeichenkette.

Der JavaScript-`symbol`-Typ wird in [Abschnitt 19.4](https://tc39.github.io/ecma262/#sec-symbol-objects) der ECMAScript-Sprachspezifikation beschrieben.

#### `node_api_symbol_for` {#node_api_symbol_for}

**Hinzugefügt in: v17.5.0, v16.15.0**

**N-API Version: 9**

```C [C]
napi_status node_api_symbol_for(napi_env env,
                                const char* utf8description,
                                size_t length,
                                napi_value* result)
```
- `[in] env`: Die Umgebung, in der die API aufgerufen wird.
- `[in] utf8description`: UTF-8 C-Zeichenkette, die den Text darstellt, der als Beschreibung für das Symbol verwendet werden soll.
- `[in] length`: Die Länge der Beschreibungszeichenkette in Bytes oder `NAPI_AUTO_LENGTH`, wenn sie Null-terminiert ist.
- `[out] result`: Ein `napi_value`, der ein JavaScript-`symbol` darstellt.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API sucht im globalen Register nach einem vorhandenen Symbol mit der angegebenen Beschreibung. Wenn das Symbol bereits existiert, wird es zurückgegeben, andernfalls wird ein neues Symbol im Register erstellt.

Der JavaScript-`symbol`-Typ wird in [Abschnitt 19.4](https://tc39.github.io/ecma262/#sec-symbol-objects) der ECMAScript-Sprachspezifikation beschrieben.


#### `napi_create_typedarray` {#napi_create_typedarray}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
napi_status napi_create_typedarray(napi_env env,
                                   napi_typedarray_type type,
                                   size_t length,
                                   napi_value arraybuffer,
                                   size_t byte_offset,
                                   napi_value* result)
```
- `[in] env`: Die Umgebung, unter der die API aufgerufen wird.
- `[in] type`: Skalarer Datentyp der Elemente innerhalb des `TypedArray`.
- `[in] length`: Anzahl der Elemente im `TypedArray`.
- `[in] arraybuffer`: `ArrayBuffer`, der dem Typed Array zugrunde liegt.
- `[in] byte_offset`: Der Byte-Offset innerhalb des `ArrayBuffer`, ab dem die Projektion des `TypedArray` gestartet werden soll.
- `[out] result`: Ein `napi_value`, der ein JavaScript `TypedArray` repräsentiert.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API erstellt ein JavaScript `TypedArray`-Objekt über einem bestehenden `ArrayBuffer`. `TypedArray`-Objekte bieten eine array-ähnliche Ansicht über einen zugrunde liegenden Datenpuffer, in dem jedes Element den gleichen zugrunde liegenden binären Skalar-Datentyp hat.

Es ist erforderlich, dass `(length * size_of_element) + byte_offset` \<= der Größe in Bytes des übergebenen Arrays sein sollte. Wenn dies nicht der Fall ist, wird eine `RangeError`-Ausnahme ausgelöst.

JavaScript `TypedArray`-Objekte werden in [Abschnitt 22.2](https://tc39.github.io/ecma262/#sec-typedarray-objects) der ECMAScript Language Specification beschrieben.

#### `node_api_create_buffer_from_arraybuffer` {#node_api_create_buffer_from_arraybuffer}

**Hinzugefügt in: v23.0.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

```C [C]
napi_status NAPI_CDECL node_api_create_buffer_from_arraybuffer(napi_env env,
                                                              napi_value arraybuffer,
                                                              size_t byte_offset,
                                                              size_t byte_length,
                                                              napi_value* result)
```
- **<code>[in] env</code>**: Die Umgebung, unter der die API aufgerufen wird.
- **<code>[in] arraybuffer</code>**: Der `ArrayBuffer`, aus dem der Puffer erstellt wird.
- **<code>[in] byte_offset</code>**: Der Byte-Offset innerhalb des `ArrayBuffer`, ab dem mit der Erstellung des Puffers begonnen werden soll.
- **<code>[in] byte_length</code>**: Die Länge in Bytes des Puffers, der aus dem `ArrayBuffer` erstellt werden soll.
- **<code>[out] result</code>**: Ein `napi_value`, der das erstellte JavaScript `Buffer`-Objekt darstellt.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API erstellt ein JavaScript `Buffer`-Objekt aus einem bestehenden `ArrayBuffer`. Das `Buffer`-Objekt ist eine Node.js-spezifische Klasse, die eine Möglichkeit bietet, direkt in JavaScript mit binären Daten zu arbeiten.

Der Byte-Bereich `[byte_offset, byte_offset + byte_length)` muss innerhalb der Grenzen des `ArrayBuffer` liegen. Wenn `byte_offset + byte_length` die Größe des `ArrayBuffer` überschreitet, wird eine `RangeError`-Ausnahme ausgelöst.


#### `napi_create_dataview` {#napi_create_dataview}

**Hinzugefügt in: v8.3.0**

**N-API Version: 1**

```C [C]
napi_status napi_create_dataview(napi_env env,
                                 size_t byte_length,
                                 napi_value arraybuffer,
                                 size_t byte_offset,
                                 napi_value* result)
```
- `[in] env`: Die Umgebung, in der die API aufgerufen wird.
- `[in] length`: Anzahl der Elemente in der `DataView`.
- `[in] arraybuffer`: `ArrayBuffer`, der der `DataView` zugrunde liegt.
- `[in] byte_offset`: Der Byte-Offset innerhalb des `ArrayBuffer`, ab dem die `DataView` projiziert werden soll.
- `[out] result`: Ein `napi_value`, der eine JavaScript `DataView` darstellt.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API erstellt ein JavaScript `DataView`-Objekt über einen vorhandenen `ArrayBuffer`. `DataView`-Objekte bieten eine array-ähnliche Ansicht über einen zugrunde liegenden Datenpuffer, die jedoch Elemente unterschiedlicher Größe und Typs im `ArrayBuffer` ermöglicht.

Es ist erforderlich, dass `byte_length + byte_offset` kleiner oder gleich der Größe in Byte des übergebenen Arrays ist. Andernfalls wird eine `RangeError`-Ausnahme ausgelöst.

JavaScript `DataView`-Objekte werden in [Abschnitt 24.3](https://tc39.github.io/ecma262/#sec-dataview-objects) der ECMAScript-Sprachspezifikation beschrieben.

### Funktionen zum Konvertieren von C-Typen in Node-API {#functions-to-convert-from-c-types-to-node-api}

#### `napi_create_int32` {#napi_create_int32}

**Hinzugefügt in: v8.4.0**

**N-API Version: 1**

```C [C]
napi_status napi_create_int32(napi_env env, int32_t value, napi_value* result)
```
- `[in] env`: Die Umgebung, in der die API aufgerufen wird.
- `[in] value`: Integer-Wert, der in JavaScript dargestellt werden soll.
- `[out] result`: Ein `napi_value`, der eine JavaScript `number` darstellt.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API wird verwendet, um vom C-Typ `int32_t` in den JavaScript-Typ `number` zu konvertieren.

Der JavaScript-Typ `number` wird in [Abschnitt 6.1.6](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-number-type) der ECMAScript-Sprachspezifikation beschrieben.


#### `napi_create_uint32` {#napi_create_uint32}

**Hinzugefügt in: v8.4.0**

**N-API Version: 1**

```C [C]
napi_status napi_create_uint32(napi_env env, uint32_t value, napi_value* result)
```
- `[in] env`: Die Umgebung, unter der die API aufgerufen wird.
- `[in] value`: Vorzeichenloser Integer-Wert, der in JavaScript dargestellt werden soll.
- `[out] result`: Ein `napi_value`, das eine JavaScript-`number` darstellt.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API wird verwendet, um vom C-Typ `uint32_t` zum JavaScript-Typ `number` zu konvertieren.

Der JavaScript-Typ `number` wird in [Abschnitt 6.1.6](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-number-type) der ECMAScript Language Specification beschrieben.

#### `napi_create_int64` {#napi_create_int64}

**Hinzugefügt in: v8.4.0**

**N-API Version: 1**

```C [C]
napi_status napi_create_int64(napi_env env, int64_t value, napi_value* result)
```
- `[in] env`: Die Umgebung, unter der die API aufgerufen wird.
- `[in] value`: Integer-Wert, der in JavaScript dargestellt werden soll.
- `[out] result`: Ein `napi_value`, das eine JavaScript-`number` darstellt.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API wird verwendet, um vom C-Typ `int64_t` zum JavaScript-Typ `number` zu konvertieren.

Der JavaScript-Typ `number` wird in [Abschnitt 6.1.6](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-number-type) der ECMAScript Language Specification beschrieben. Beachten Sie, dass der vollständige Bereich von `int64_t` in JavaScript nicht mit voller Präzision dargestellt werden kann. Integer-Werte außerhalb des Bereichs von [`Number.MIN_SAFE_INTEGER`](https://tc39.github.io/ecma262/#sec-number.min_safe_integer) `-(2**53 - 1)` - [`Number.MAX_SAFE_INTEGER`](https://tc39.github.io/ecma262/#sec-number.max_safe_integer) `(2**53 - 1)` verlieren an Präzision.

#### `napi_create_double` {#napi_create_double}

**Hinzugefügt in: v8.4.0**

**N-API Version: 1**

```C [C]
napi_status napi_create_double(napi_env env, double value, napi_value* result)
```
- `[in] env`: Die Umgebung, unter der die API aufgerufen wird.
- `[in] value`: Double-Precision-Wert, der in JavaScript dargestellt werden soll.
- `[out] result`: Ein `napi_value`, das eine JavaScript-`number` darstellt.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API wird verwendet, um vom C-Typ `double` zum JavaScript-Typ `number` zu konvertieren.

Der JavaScript-Typ `number` wird in [Abschnitt 6.1.6](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-number-type) der ECMAScript Language Specification beschrieben.


#### `napi_create_bigint_int64` {#napi_create_bigint_int64}

**Hinzugefügt in: v10.7.0**

**N-API-Version: 6**

```C [C]
napi_status napi_create_bigint_int64(napi_env env,
                                     int64_t value,
                                     napi_value* result);
```
- `[in] env`: Die Umgebung, in der die API aufgerufen wird.
- `[in] value`: Ganzzahliger Wert, der in JavaScript dargestellt werden soll.
- `[out] result`: Ein `napi_value`, das ein JavaScript `BigInt` darstellt.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API konvertiert den C-Typ `int64_t` in den JavaScript-Typ `BigInt`.

#### `napi_create_bigint_uint64` {#napi_create_bigint_uint64}

**Hinzugefügt in: v10.7.0**

**N-API-Version: 6**

```C [C]
napi_status napi_create_bigint_uint64(napi_env env,
                                      uint64_t value,
                                      napi_value* result);
```
- `[in] env`: Die Umgebung, in der die API aufgerufen wird.
- `[in] value`: Vorzeichenloser ganzzahliger Wert, der in JavaScript dargestellt werden soll.
- `[out] result`: Ein `napi_value`, das ein JavaScript `BigInt` darstellt.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API konvertiert den C-Typ `uint64_t` in den JavaScript-Typ `BigInt`.

#### `napi_create_bigint_words` {#napi_create_bigint_words}

**Hinzugefügt in: v10.7.0**

**N-API-Version: 6**

```C [C]
napi_status napi_create_bigint_words(napi_env env,
                                     int sign_bit,
                                     size_t word_count,
                                     const uint64_t* words,
                                     napi_value* result);
```
- `[in] env`: Die Umgebung, in der die API aufgerufen wird.
- `[in] sign_bit`: Bestimmt, ob das resultierende `BigInt` positiv oder negativ ist.
- `[in] word_count`: Die Länge des `words`-Arrays.
- `[in] words`: Ein Array von `uint64_t` Little-Endian-64-Bit-Wörtern.
- `[out] result`: Ein `napi_value`, das ein JavaScript `BigInt` darstellt.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API konvertiert ein Array von vorzeichenlosen 64-Bit-Wörtern in einen einzelnen `BigInt`-Wert.

Das resultierende `BigInt` wird wie folgt berechnet: (–1) (`words[0]` × (2) + `words[1]` × (2) + …)


#### `napi_create_string_latin1` {#napi_create_string_latin1}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
napi_status napi_create_string_latin1(napi_env env,
                                      const char* str,
                                      size_t length,
                                      napi_value* result);
```
- `[in] env`: Die Umgebung, in der die API aufgerufen wird.
- `[in] str`: Zeichenpuffer, der eine ISO-8859-1-codierte Zeichenkette darstellt.
- `[in] length`: Die Länge der Zeichenkette in Bytes oder `NAPI_AUTO_LENGTH`, wenn sie Null-terminiert ist.
- `[out] result`: Ein `napi_value`, das eine JavaScript-`string` darstellt.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API erzeugt einen JavaScript-`string`-Wert aus einer ISO-8859-1-codierten C-Zeichenkette. Die native Zeichenkette wird kopiert.

Der JavaScript-`string`-Typ wird in [Abschnitt 6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type) der ECMAScript Language Specification beschrieben.

#### `node_api_create_external_string_latin1` {#node_api_create_external_string_latin1}

**Hinzugefügt in: v20.4.0, v18.18.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
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
- `[in] env`: Die Umgebung, in der die API aufgerufen wird.
- `[in] str`: Zeichenpuffer, der eine ISO-8859-1-codierte Zeichenkette darstellt.
- `[in] length`: Die Länge der Zeichenkette in Bytes oder `NAPI_AUTO_LENGTH`, wenn sie Null-terminiert ist.
- `[in] finalize_callback`: Die Funktion, die aufgerufen werden soll, wenn die Zeichenkette gesammelt wird. Die Funktion wird mit den folgenden Parametern aufgerufen:
    - `[in] env`: Die Umgebung, in der das Add-on ausgeführt wird. Dieser Wert kann Null sein, wenn die Zeichenkette im Rahmen der Beendigung des Workers oder der Haupt-Node.js-Instanz gesammelt wird.
    - `[in] data`: Dies ist der Wert `str` als `void*`-Pointer.
    - `[in] finalize_hint`: Dies ist der Wert `finalize_hint`, der an die API übergeben wurde. [`napi_finalize`](/de/nodejs/api/n-api#napi_finalize) bietet weitere Details. Dieser Parameter ist optional. Wenn ein Nullwert übergeben wird, bedeutet dies, dass das Add-on nicht benachrichtigt werden muss, wenn die entsprechende JavaScript-Zeichenkette gesammelt wird.

- `[in] finalize_hint`: Optionaler Hinweis, der während der Sammlung an den Finalize-Callback übergeben wird.
- `[out] result`: Ein `napi_value`, das eine JavaScript-`string` darstellt.
- `[out] copied`: Gibt an, ob die Zeichenkette kopiert wurde. Wenn dies der Fall war, wurde der Finalizer bereits aufgerufen, um `str` zu zerstören.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API erzeugt einen JavaScript-`string`-Wert aus einer ISO-8859-1-codierten C-Zeichenkette. Die native Zeichenkette darf nicht kopiert werden und muss daher während des gesamten Lebenszyklus des JavaScript-Wertes existieren.

Der JavaScript-`string`-Typ wird in [Abschnitt 6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type) der ECMAScript Language Specification beschrieben.


#### `napi_create_string_utf16` {#napi_create_string_utf16}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
napi_status napi_create_string_utf16(napi_env env,
                                     const char16_t* str,
                                     size_t length,
                                     napi_value* result)
```
- `[in] env`: Die Umgebung, in der die API aufgerufen wird.
- `[in] str`: Zeichenpuffer, der eine UTF16-LE-codierte Zeichenkette darstellt.
- `[in] length`: Die Länge der Zeichenkette in Zwei-Byte-Codeeinheiten oder `NAPI_AUTO_LENGTH`, wenn sie nullterminiert ist.
- `[out] result`: Ein `napi_value`, das eine JavaScript-`string` darstellt.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API erstellt einen JavaScript-`string`-Wert aus einer UTF16-LE-codierten C-Zeichenkette. Die native Zeichenkette wird kopiert.

Der JavaScript-`string`-Typ wird in [Abschnitt 6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type) der ECMAScript Language Specification beschrieben.

#### `node_api_create_external_string_utf16` {#node_api_create_external_string_utf16}

**Hinzugefügt in: v20.4.0, v18.18.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
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
- `[in] env`: Die Umgebung, in der die API aufgerufen wird.
- `[in] str`: Zeichenpuffer, der eine UTF16-LE-codierte Zeichenkette darstellt.
- `[in] length`: Die Länge der Zeichenkette in Zwei-Byte-Codeeinheiten oder `NAPI_AUTO_LENGTH`, wenn sie nullterminiert ist.
- `[in] finalize_callback`: Die Funktion, die aufgerufen werden soll, wenn die Zeichenkette gesammelt wird. Die Funktion wird mit den folgenden Parametern aufgerufen:
    - `[in] env`: Die Umgebung, in der das Add-on ausgeführt wird. Dieser Wert kann null sein, wenn die Zeichenkette im Rahmen der Beendigung des Workers oder der Hauptinstanz von Node.js gesammelt wird.
    - `[in] data`: Dies ist der Wert `str` als `void*`-Zeiger.
    - `[in] finalize_hint`: Dies ist der Wert `finalize_hint`, der an die API übergeben wurde. [`napi_finalize`](/de/nodejs/api/n-api#napi_finalize) bietet weitere Details. Dieser Parameter ist optional. Die Übergabe eines Null-Wertes bedeutet, dass das Add-on nicht benachrichtigt werden muss, wenn die entsprechende JavaScript-Zeichenkette gesammelt wird.

- `[in] finalize_hint`: Optionaler Hinweis, der während der Sammlung an den Finalize-Callback übergeben werden soll.
- `[out] result`: Ein `napi_value`, das eine JavaScript-`string` darstellt.
- `[out] copied`: Gibt an, ob die Zeichenkette kopiert wurde. Wenn dies der Fall war, wurde der Finalizer bereits aufgerufen, um `str` zu zerstören.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API erstellt einen JavaScript-`string`-Wert aus einer UTF16-LE-codierten C-Zeichenkette. Die native Zeichenkette wird möglicherweise nicht kopiert und muss daher während des gesamten Lebenszyklus des JavaScript-Werts existieren.

Der JavaScript-`string`-Typ wird in [Abschnitt 6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type) der ECMAScript Language Specification beschrieben.


#### `napi_create_string_utf8` {#napi_create_string_utf8}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
napi_status napi_create_string_utf8(napi_env env,
                                    const char* str,
                                    size_t length,
                                    napi_value* result)
```
- `[in] env`: Die Umgebung, in der die API aufgerufen wird.
- `[in] str`: Zeichenpuffer, der eine UTF8-kodierte Zeichenfolge darstellt.
- `[in] length`: Die Länge der Zeichenfolge in Byte oder `NAPI_AUTO_LENGTH`, wenn sie Null-terminiert ist.
- `[out] result`: Ein `napi_value`, der eine JavaScript-`string` darstellt.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API erstellt einen JavaScript-`string`-Wert aus einer UTF8-kodierten C-Zeichenfolge. Die native Zeichenfolge wird kopiert.

Der JavaScript-`string`-Typ wird in [Abschnitt 6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type) der ECMAScript Language Specification beschrieben.

### Funktionen zum Erstellen optimierter Eigenschaftsschlüssel {#functions-to-create-optimized-property-keys}

Viele JavaScript-Engines, einschließlich V8, verwenden internalisierte Zeichenfolgen als Schlüssel, um Eigenschaftswerte zu setzen und abzurufen. Sie verwenden typischerweise eine Hash-Tabelle, um solche Zeichenfolgen zu erstellen und nachzuschlagen. Dies verursacht zwar zusätzliche Kosten pro Schlüsselerstellung, verbessert aber danach die Leistung, indem der Vergleich von Zeichenfolgen-Pointern anstelle der gesamten Zeichenfolgen ermöglicht wird.

Wenn eine neue JavaScript-Zeichenfolge als Eigenschaftsschlüssel verwendet werden soll, ist es für einige JavaScript-Engines effizienter, die Funktionen in diesem Abschnitt zu verwenden. Andernfalls sollten die Funktionen der Reihen `napi_create_string_utf8` oder `node_api_create_external_string_utf8` verwendet werden, da bei der Erstellung/Speicherung von Zeichenfolgen mit den Methoden zur Erstellung von Eigenschaftsschlüsseln zusätzlicher Overhead entstehen kann.

#### `node_api_create_property_key_latin1` {#node_api_create_property_key_latin1}

**Hinzugefügt in: v22.9.0, v20.18.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

```C [C]
napi_status NAPI_CDECL node_api_create_property_key_latin1(napi_env env,
                                                           const char* str,
                                                           size_t length,
                                                           napi_value* result);
```
- `[in] env`: Die Umgebung, in der die API aufgerufen wird.
- `[in] str`: Zeichenpuffer, der eine ISO-8859-1-kodierte Zeichenfolge darstellt.
- `[in] length`: Die Länge der Zeichenfolge in Byte oder `NAPI_AUTO_LENGTH`, wenn sie Null-terminiert ist.
- `[out] result`: Ein `napi_value`, der eine optimierte JavaScript-`string` darstellt, die als Eigenschaftsschlüssel für Objekte verwendet werden soll.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API erstellt einen optimierten JavaScript-`string`-Wert aus einer ISO-8859-1-kodierten C-Zeichenfolge, der als Eigenschaftsschlüssel für Objekte verwendet werden soll. Die native Zeichenfolge wird kopiert. Im Gegensatz zu `napi_create_string_latin1` können nachfolgende Aufrufe dieser Funktion mit demselben `str`-Pointer von einer Beschleunigung bei der Erstellung des angeforderten `napi_value` profitieren, abhängig von der Engine.

Der JavaScript-`string`-Typ wird in [Abschnitt 6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type) der ECMAScript Language Specification beschrieben.


#### `node_api_create_property_key_utf16` {#node_api_create_property_key_utf16}

**Hinzugefügt in: v21.7.0, v20.12.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

```C [C]
napi_status NAPI_CDECL node_api_create_property_key_utf16(napi_env env,
                                                          const char16_t* str,
                                                          size_t length,
                                                          napi_value* result);
```
- `[in] env`: Die Umgebung, unter der die API aufgerufen wird.
- `[in] str`: Zeichenpuffer, der eine UTF16-LE-kodierte Zeichenkette darstellt.
- `[in] length`: Die Länge der Zeichenkette in Zwei-Byte-Codeeinheiten oder `NAPI_AUTO_LENGTH`, wenn sie Null-terminiert ist.
- `[out] result`: Ein `napi_value`, das eine optimierte JavaScript-`string` darstellt, die als Eigenschaftsschlüssel für Objekte verwendet werden soll.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API erstellt einen optimierten JavaScript-`string`-Wert aus einer UTF16-LE-kodierten C-Zeichenkette, die als Eigenschaftsschlüssel für Objekte verwendet werden soll. Die native Zeichenkette wird kopiert.

Der JavaScript-`string`-Typ wird in [Abschnitt 6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type) der ECMAScript Language Specification beschrieben.

#### `node_api_create_property_key_utf8` {#node_api_create_property_key_utf8}

**Hinzugefügt in: v22.9.0, v20.18.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

```C [C]
napi_status NAPI_CDECL node_api_create_property_key_utf8(napi_env env,
                                                         const char* str,
                                                         size_t length,
                                                         napi_value* result);
```
- `[in] env`: Die Umgebung, unter der die API aufgerufen wird.
- `[in] str`: Zeichenpuffer, der eine UTF8-kodierte Zeichenkette darstellt.
- `[in] length`: Die Länge der Zeichenkette in Zwei-Byte-Codeeinheiten oder `NAPI_AUTO_LENGTH`, wenn sie Null-terminiert ist.
- `[out] result`: Ein `napi_value`, das eine optimierte JavaScript-`string` darstellt, die als Eigenschaftsschlüssel für Objekte verwendet werden soll.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API erstellt einen optimierten JavaScript-`string`-Wert aus einer UTF8-kodierten C-Zeichenkette, die als Eigenschaftsschlüssel für Objekte verwendet werden soll. Die native Zeichenkette wird kopiert.

Der JavaScript-`string`-Typ wird in [Abschnitt 6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type) der ECMAScript Language Specification beschrieben.


### Funktionen zur Konvertierung von Node-API zu C-Typen {#functions-to-convert-from-node-api-to-c-types}

#### `napi_get_array_length` {#napi_get_array_length}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
napi_status napi_get_array_length(napi_env env,
                                  napi_value value,
                                  uint32_t* result)
```
- `[in] env`: Die Umgebung, in der die API aufgerufen wird.
- `[in] value`: `napi_value`, die das JavaScript-`Array` repräsentiert, dessen Länge abgefragt wird.
- `[out] result`: `uint32`, die die Länge des Arrays repräsentiert.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API gibt die Länge eines Arrays zurück.

Die `Array`-Länge wird in [Abschnitt 22.1.4.1](https://tc39.github.io/ecma262/#sec-properties-of-array-instances-length) der ECMAScript Language Specification beschrieben.

#### `napi_get_arraybuffer_info` {#napi_get_arraybuffer_info}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
napi_status napi_get_arraybuffer_info(napi_env env,
                                      napi_value arraybuffer,
                                      void** data,
                                      size_t* byte_length)
```
- `[in] env`: Die Umgebung, in der die API aufgerufen wird.
- `[in] arraybuffer`: `napi_value`, die den abzufragenden `ArrayBuffer` repräsentiert.
- `[out] data`: Der zugrunde liegende Datenpuffer des `ArrayBuffer`. Wenn byte_length `0` ist, kann dies `NULL` oder ein anderer Zeigerwert sein.
- `[out] byte_length`: Die Länge in Bytes des zugrunde liegenden Datenpuffers.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API wird verwendet, um den zugrunde liegenden Datenpuffer eines `ArrayBuffer` und seine Länge abzurufen.

*WARNUNG*: Seien Sie vorsichtig bei der Verwendung dieser API. Die Lebensdauer des zugrunde liegenden Datenpuffers wird vom `ArrayBuffer` verwaltet, auch nachdem er zurückgegeben wurde. Eine mögliche sichere Möglichkeit, diese API zu verwenden, ist in Verbindung mit [`napi_create_reference`](/de/nodejs/api/n-api#napi_create_reference), mit der die Kontrolle über die Lebensdauer des `ArrayBuffer` garantiert werden kann. Es ist auch sicher, den zurückgegebenen Datenpuffer innerhalb desselben Callbacks zu verwenden, solange keine Aufrufe anderer APIs erfolgen, die einen GC auslösen könnten.


#### `napi_get_buffer_info` {#napi_get_buffer_info}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
napi_status napi_get_buffer_info(napi_env env,
                                 napi_value value,
                                 void** data,
                                 size_t* length)
```
- `[in] env`: Die Umgebung, unter der die API aufgerufen wird.
- `[in] value`: `napi_value`, das den abzufragenden `node::Buffer` oder `Uint8Array` darstellt.
- `[out] data`: Der zugrunde liegende Datenpuffer des `node::Buffer` oder `Uint8Array`. Wenn die Länge `0` ist, kann dies `NULL` oder ein anderer Zeigerwert sein.
- `[out] length`: Länge des zugrunde liegenden Datenpuffers in Bytes.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese Methode gibt die gleichen `data` und `byte_length` wie [`napi_get_typedarray_info`](/de/nodejs/api/n-api#napi_get_typedarray_info) zurück. Und `napi_get_typedarray_info` akzeptiert auch einen `node::Buffer` (ein Uint8Array) als Wert.

Diese API wird verwendet, um den zugrunde liegenden Datenpuffer eines `node::Buffer` und seine Länge abzurufen.

*Warnung*: Seien Sie vorsichtig bei der Verwendung dieser API, da die Lebensdauer des zugrunde liegenden Datenpuffers nicht garantiert ist, wenn er von der VM verwaltet wird.

#### `napi_get_prototype` {#napi_get_prototype}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
napi_status napi_get_prototype(napi_env env,
                               napi_value object,
                               napi_value* result)
```
- `[in] env`: Die Umgebung, unter der die API aufgerufen wird.
- `[in] object`: `napi_value`, das das JavaScript-`Object` darstellt, dessen Prototyp zurückgegeben werden soll. Dies gibt das Äquivalent von `Object.getPrototypeOf` zurück (was nicht dasselbe ist wie die `prototype`-Eigenschaft der Funktion).
- `[out] result`: `napi_value`, das den Prototyp des angegebenen Objekts darstellt.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

#### `napi_get_typedarray_info` {#napi_get_typedarray_info}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
napi_status napi_get_typedarray_info(napi_env env,
                                     napi_value typedarray,
                                     napi_typedarray_type* type,
                                     size_t* length,
                                     void** data,
                                     napi_value* arraybuffer,
                                     size_t* byte_offset)
```
- `[in] env`: Die Umgebung, unter der die API aufgerufen wird.
- `[in] typedarray`: `napi_value`, das das `TypedArray` darstellt, dessen Eigenschaften abgefragt werden sollen.
- `[out] type`: Skalar-Datentyp der Elemente innerhalb des `TypedArray`.
- `[out] length`: Die Anzahl der Elemente im `TypedArray`.
- `[out] data`: Der Datenpuffer, der dem `TypedArray` zugrunde liegt, angepasst durch den Wert `byte_offset`, sodass er auf das erste Element im `TypedArray` zeigt. Wenn die Länge des Arrays `0` ist, kann dies `NULL` oder ein anderer Zeigerwert sein.
- `[out] arraybuffer`: Der `ArrayBuffer`, der dem `TypedArray` zugrunde liegt.
- `[out] byte_offset`: Der Byte-Offset innerhalb des zugrunde liegenden nativen Arrays, an dem sich das erste Element der Arrays befindet. Der Wert für den Datenparameter wurde bereits angepasst, sodass die Daten auf das erste Element im Array zeigen. Daher wäre das erste Byte des nativen Arrays bei `data - byte_offset`.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API gibt verschiedene Eigenschaften eines typisierten Arrays zurück.

Jeder der Out-Parameter kann `NULL` sein, wenn diese Eigenschaft nicht benötigt wird.

*Warnung*: Seien Sie vorsichtig bei der Verwendung dieser API, da der zugrunde liegende Datenpuffer von der VM verwaltet wird.


#### `napi_get_dataview_info` {#napi_get_dataview_info}

**Hinzugefügt in: v8.3.0**

**N-API Version: 1**

```C [C]
napi_status napi_get_dataview_info(napi_env env,
                                   napi_value dataview,
                                   size_t* byte_length,
                                   void** data,
                                   napi_value* arraybuffer,
                                   size_t* byte_offset)
```
- `[in] env`: Die Umgebung, in der die API aufgerufen wird.
- `[in] dataview`: `napi_value`, das die `DataView` repräsentiert, deren Eigenschaften abgefragt werden sollen.
- `[out] byte_length`: Anzahl der Bytes in der `DataView`.
- `[out] data`: Der Datenpuffer, der der `DataView` zugrunde liegt. Wenn Byte_Length `0` ist, kann dies `NULL` oder ein anderer Zeigerwert sein.
- `[out] arraybuffer`: `ArrayBuffer`, das der `DataView` zugrunde liegt.
- `[out] byte_offset`: Der Byte-Offset innerhalb des Datenpuffers, ab dem die `DataView` projiziert werden soll.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Jeder der Out-Parameter kann `NULL` sein, wenn diese Eigenschaft nicht benötigt wird.

Diese API gibt verschiedene Eigenschaften einer `DataView` zurück.

#### `napi_get_date_value` {#napi_get_date_value}

**Hinzugefügt in: v11.11.0, v10.17.0**

**N-API Version: 5**

```C [C]
napi_status napi_get_date_value(napi_env env,
                                napi_value value,
                                double* result)
```
- `[in] env`: Die Umgebung, in der die API aufgerufen wird.
- `[in] value`: `napi_value`, das ein JavaScript-`Date` repräsentiert.
- `[out] result`: Zeitwert als `double`, dargestellt als Millisekunden seit Mitternacht zu Beginn des 01. Januar 1970 UTC.

Diese API berücksichtigt keine Schaltsekunden; sie werden ignoriert, da ECMAScript mit der POSIX-Zeitspezifikation übereinstimmt.

Gibt `napi_ok` zurück, wenn die API erfolgreich war. Wenn ein Nicht-Datum-`napi_value` übergeben wird, wird `napi_date_expected` zurückgegeben.

Diese API gibt den C-Double-Primitiv des Zeitwerts für das gegebene JavaScript-`Date` zurück.

#### `napi_get_value_bool` {#napi_get_value_bool}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
napi_status napi_get_value_bool(napi_env env, napi_value value, bool* result)
```
- `[in] env`: Die Umgebung, in der die API aufgerufen wird.
- `[in] value`: `napi_value`, das JavaScript-`Boolean` repräsentiert.
- `[out] result`: C-Boolescher Primitiv, das dem gegebenen JavaScript-`Boolean` entspricht.

Gibt `napi_ok` zurück, wenn die API erfolgreich war. Wenn ein nicht-boolescher `napi_value` übergeben wird, wird `napi_boolean_expected` zurückgegeben.

Diese API gibt den C-Booleschen Primitiv zurück, der dem gegebenen JavaScript-`Boolean` entspricht.


#### `napi_get_value_double` {#napi_get_value_double}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
napi_status napi_get_value_double(napi_env env,
                                  napi_value value,
                                  double* result)
```
- `[in] env`: Die Umgebung, in der die API aufgerufen wird.
- `[in] value`: `napi_value`, das eine JavaScript-`number` darstellt.
- `[out] result`: Das C-Double-Primitive-Äquivalent der gegebenen JavaScript-`number`.

Gibt `napi_ok` zurück, wenn die API erfolgreich war. Wenn ein Nicht-Zahl-`napi_value` übergeben wird, wird `napi_number_expected` zurückgegeben.

Diese API gibt das C-Double-Primitive-Äquivalent der gegebenen JavaScript-`number` zurück.

#### `napi_get_value_bigint_int64` {#napi_get_value_bigint_int64}

**Hinzugefügt in: v10.7.0**

**N-API Version: 6**

```C [C]
napi_status napi_get_value_bigint_int64(napi_env env,
                                        napi_value value,
                                        int64_t* result,
                                        bool* lossless);
```
- `[in] env`: Die Umgebung, in der die API aufgerufen wird.
- `[in] value`: `napi_value`, das ein JavaScript `BigInt` darstellt.
- `[out] result`: Das C `int64_t`-Primitive-Äquivalent des gegebenen JavaScript `BigInt`.
- `[out] lossless`: Gibt an, ob der `BigInt`-Wert verlustfrei konvertiert wurde.

Gibt `napi_ok` zurück, wenn die API erfolgreich war. Wenn ein Nicht-`BigInt` übergeben wird, wird `napi_bigint_expected` zurückgegeben.

Diese API gibt das C `int64_t`-Primitive-Äquivalent des gegebenen JavaScript `BigInt` zurück. Bei Bedarf wird der Wert abgeschnitten und `lossless` auf `false` gesetzt.

#### `napi_get_value_bigint_uint64` {#napi_get_value_bigint_uint64}

**Hinzugefügt in: v10.7.0**

**N-API Version: 6**

```C [C]
napi_status napi_get_value_bigint_uint64(napi_env env,
                                        napi_value value,
                                        uint64_t* result,
                                        bool* lossless);
```
- `[in] env`: Die Umgebung, in der die API aufgerufen wird.
- `[in] value`: `napi_value`, das ein JavaScript `BigInt` darstellt.
- `[out] result`: Das C `uint64_t`-Primitive-Äquivalent des gegebenen JavaScript `BigInt`.
- `[out] lossless`: Gibt an, ob der `BigInt`-Wert verlustfrei konvertiert wurde.

Gibt `napi_ok` zurück, wenn die API erfolgreich war. Wenn ein Nicht-`BigInt` übergeben wird, wird `napi_bigint_expected` zurückgegeben.

Diese API gibt das C `uint64_t`-Primitive-Äquivalent des gegebenen JavaScript `BigInt` zurück. Bei Bedarf wird der Wert abgeschnitten und `lossless` auf `false` gesetzt.


#### `napi_get_value_bigint_words` {#napi_get_value_bigint_words}

**Hinzugefügt in: v10.7.0**

**N-API Version: 6**

```C [C]
napi_status napi_get_value_bigint_words(napi_env env,
                                        napi_value value,
                                        int* sign_bit,
                                        size_t* word_count,
                                        uint64_t* words);
```
- `[in] env`: Die Umgebung, in der die API aufgerufen wird.
- `[in] value`: `napi_value`, das JavaScript `BigInt` darstellt.
- `[out] sign_bit`: Integer, der angibt, ob das JavaScript `BigInt` positiv oder negativ ist.
- `[in/out] word_count`: Muss auf die Länge des Arrays `words` initialisiert werden. Bei der Rückgabe wird es auf die tatsächliche Anzahl von Wörtern gesetzt, die zum Speichern dieses `BigInt` benötigt würden.
- `[out] words`: Zeiger auf ein vorab zugewiesenes 64-Bit-Wort-Array.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API konvertiert einen einzelnen `BigInt`-Wert in ein Vorzeichenbit, ein 64-Bit-Little-Endian-Array und die Anzahl der Elemente im Array. `sign_bit` und `words` können beide auf `NULL` gesetzt werden, um nur `word_count` zu erhalten.

#### `napi_get_value_external` {#napi_get_value_external}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
napi_status napi_get_value_external(napi_env env,
                                    napi_value value,
                                    void** result)
```
- `[in] env`: Die Umgebung, in der die API aufgerufen wird.
- `[in] value`: `napi_value`, das einen externen JavaScript-Wert darstellt.
- `[out] result`: Zeiger auf die Daten, die vom externen JavaScript-Wert umschlossen werden.

Gibt `napi_ok` zurück, wenn die API erfolgreich war. Wenn ein nicht-externer `napi_value` übergeben wird, wird `napi_invalid_arg` zurückgegeben.

Diese API ruft den externen Datenzeiger ab, der zuvor an `napi_create_external()` übergeben wurde.

#### `napi_get_value_int32` {#napi_get_value_int32}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
napi_status napi_get_value_int32(napi_env env,
                                 napi_value value,
                                 int32_t* result)
```
- `[in] env`: Die Umgebung, in der die API aufgerufen wird.
- `[in] value`: `napi_value`, das eine JavaScript-`number` darstellt.
- `[out] result`: C `int32`-Primitive, die dem gegebenen JavaScript-`number` entspricht.

Gibt `napi_ok` zurück, wenn die API erfolgreich war. Wenn ein Nicht-Zahlen-`napi_value` übergeben wird, wird `napi_number_expected` zurückgegeben.

Diese API gibt die C `int32`-Primitive zurück, die der gegebenen JavaScript-`number` entspricht.

Wenn die Zahl den Bereich des 32-Bit-Integers überschreitet, wird das Ergebnis auf das Äquivalent der unteren 32 Bit abgeschnitten. Dies kann dazu führen, dass eine große positive Zahl zu einer negativen Zahl wird, wenn der Wert \> 2 - 1 ist.

Nicht-endliche Zahlenwerte (`NaN`, `+Infinity` oder `-Infinity`) setzen das Ergebnis auf Null.


#### `napi_get_value_int64` {#napi_get_value_int64}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
napi_status napi_get_value_int64(napi_env env,
                                 napi_value value,
                                 int64_t* result)
```
- `[in] env`: Die Umgebung, in der die API aufgerufen wird.
- `[in] value`: `napi_value`, das eine JavaScript-`number` repräsentiert.
- `[out] result`: Das C `int64`-Primitive, das dem gegebenen JavaScript-`number` entspricht.

Gibt `napi_ok` zurück, wenn die API erfolgreich war. Wenn ein Nicht-Zahlen-`napi_value` übergeben wird, wird `napi_number_expected` zurückgegeben.

Diese API gibt das C `int64`-Primitive zurück, das dem gegebenen JavaScript-`number` entspricht.

`number`-Werte außerhalb des Bereichs von [`Number.MIN_SAFE_INTEGER`](https://tc39.github.io/ecma262/#sec-number.min_safe_integer) `-(2**53 - 1)` - [`Number.MAX_SAFE_INTEGER`](https://tc39.github.io/ecma262/#sec-number.max_safe_integer) `(2**53 - 1)` verlieren an Präzision.

Nicht-endliche Zahlenwerte (`NaN`, `+Infinity` oder `-Infinity`) setzen das Ergebnis auf Null.

#### `napi_get_value_string_latin1` {#napi_get_value_string_latin1}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
napi_status napi_get_value_string_latin1(napi_env env,
                                         napi_value value,
                                         char* buf,
                                         size_t bufsize,
                                         size_t* result)
```
- `[in] env`: Die Umgebung, in der die API aufgerufen wird.
- `[in] value`: `napi_value`, das eine JavaScript-Zeichenkette repräsentiert.
- `[in] buf`: Puffer, in den die ISO-8859-1-kodierte Zeichenkette geschrieben werden soll. Wenn `NULL` übergeben wird, wird die Länge der Zeichenkette in Bytes, ohne das Nullterminierungszeichen, in `result` zurückgegeben.
- `[in] bufsize`: Größe des Zielpuffers. Wenn dieser Wert nicht ausreicht, wird die zurückgegebene Zeichenkette abgeschnitten und mit Null terminiert.
- `[out] result`: Anzahl der Bytes, die in den Puffer kopiert wurden, ohne das Nullterminierungszeichen.

Gibt `napi_ok` zurück, wenn die API erfolgreich war. Wenn ein Nicht-`string`-`napi_value` übergeben wird, wird `napi_string_expected` zurückgegeben.

Diese API gibt die ISO-8859-1-kodierte Zeichenkette zurück, die dem übergebenen Wert entspricht.


#### `napi_get_value_string_utf8` {#napi_get_value_string_utf8}

**Hinzugefügt in: v8.0.0**

**N-API-Version: 1**

```C [C]
napi_status napi_get_value_string_utf8(napi_env env,
                                       napi_value value,
                                       char* buf,
                                       size_t bufsize,
                                       size_t* result)
```
- `[in] env`: Die Umgebung, in der die API aufgerufen wird.
- `[in] value`: `napi_value`, das eine JavaScript-Zeichenkette darstellt.
- `[in] buf`: Puffer, in den die UTF8-kodierte Zeichenkette geschrieben werden soll. Wenn `NULL` übergeben wird, wird die Länge der Zeichenkette in Bytes, ohne das Null-Terminierungszeichen, in `result` zurückgegeben.
- `[in] bufsize`: Größe des Zielpuffers. Wenn dieser Wert unzureichend ist, wird die zurückgegebene Zeichenkette abgeschnitten und mit einem Nullzeichen abgeschlossen.
- `[out] result`: Anzahl der in den Puffer kopierten Bytes, ohne das Null-Terminierungszeichen.

Gibt `napi_ok` zurück, wenn die API erfolgreich war. Wenn ein `napi_value` übergeben wird, das keine `string` ist, wird `napi_string_expected` zurückgegeben.

Diese API gibt die UTF8-kodierte Zeichenkette zurück, die dem übergebenen Wert entspricht.

#### `napi_get_value_string_utf16` {#napi_get_value_string_utf16}

**Hinzugefügt in: v8.0.0**

**N-API-Version: 1**

```C [C]
napi_status napi_get_value_string_utf16(napi_env env,
                                        napi_value value,
                                        char16_t* buf,
                                        size_t bufsize,
                                        size_t* result)
```
- `[in] env`: Die Umgebung, in der die API aufgerufen wird.
- `[in] value`: `napi_value`, das eine JavaScript-Zeichenkette darstellt.
- `[in] buf`: Puffer, in den die UTF16-LE-kodierte Zeichenkette geschrieben werden soll. Wenn `NULL` übergeben wird, wird die Länge der Zeichenkette in 2-Byte-Codeeinheiten, ohne das Null-Terminierungszeichen, zurückgegeben.
- `[in] bufsize`: Größe des Zielpuffers. Wenn dieser Wert unzureichend ist, wird die zurückgegebene Zeichenkette abgeschnitten und mit einem Nullzeichen abgeschlossen.
- `[out] result`: Anzahl der in den Puffer kopierten 2-Byte-Codeeinheiten, ohne das Null-Terminierungszeichen.

Gibt `napi_ok` zurück, wenn die API erfolgreich war. Wenn ein `napi_value` übergeben wird, das keine `string` ist, wird `napi_string_expected` zurückgegeben.

Diese API gibt die UTF16-kodierte Zeichenkette zurück, die dem übergebenen Wert entspricht.


#### `napi_get_value_uint32` {#napi_get_value_uint32}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
napi_status napi_get_value_uint32(napi_env env,
                                  napi_value value,
                                  uint32_t* result)
```
- `[in] env`: Die Umgebung, in der die API aufgerufen wird.
- `[in] value`: `napi_value`, das eine JavaScript-`number` darstellt.
- `[out] result`: C-Primitiv, das dem gegebenen `napi_value` als `uint32_t` entspricht.

Gibt `napi_ok` zurück, wenn die API erfolgreich war. Wenn ein `napi_value` übergeben wird, das keine Zahl ist, wird `napi_number_expected` zurückgegeben.

Diese API gibt das C-Primitiv zurück, das dem gegebenen `napi_value` als `uint32_t` entspricht.

### Funktionen zum Abrufen globaler Instanzen {#functions-to-get-global-instances}

#### `napi_get_boolean` {#napi_get_boolean}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
napi_status napi_get_boolean(napi_env env, bool value, napi_value* result)
```
- `[in] env`: Die Umgebung, in der die API aufgerufen wird.
- `[in] value`: Der Wert des abzurufenden Booleschen Wertes.
- `[out] result`: `napi_value`, das ein JavaScript-`Boolean`-Singleton darstellt, das abgerufen werden soll.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API wird verwendet, um das JavaScript-Singleton-Objekt zurückzugeben, das verwendet wird, um den gegebenen booleschen Wert darzustellen.

#### `napi_get_global` {#napi_get_global}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
napi_status napi_get_global(napi_env env, napi_value* result)
```
- `[in] env`: Die Umgebung, in der die API aufgerufen wird.
- `[out] result`: `napi_value`, das das JavaScript-`global`-Objekt darstellt.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API gibt das `global`-Objekt zurück.

#### `napi_get_null` {#napi_get_null}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
napi_status napi_get_null(napi_env env, napi_value* result)
```
- `[in] env`: Die Umgebung, in der die API aufgerufen wird.
- `[out] result`: `napi_value`, das das JavaScript-`null`-Objekt darstellt.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API gibt das `null`-Objekt zurück.

#### `napi_get_undefined` {#napi_get_undefined}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
napi_status napi_get_undefined(napi_env env, napi_value* result)
```
- `[in] env`: Die Umgebung, in der die API aufgerufen wird.
- `[out] result`: `napi_value`, das den JavaScript Undefined Wert darstellt.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API gibt das Undefined-Objekt zurück.


## Arbeiten mit JavaScript-Werten und abstrakten Operationen {#working-with-javascript-values-and-abstract-operations}

Node-API stellt eine Reihe von APIs bereit, um einige abstrakte Operationen für JavaScript-Werte durchzuführen. Einige dieser Operationen sind in [Abschnitt 7](https://tc39.github.io/ecma262/#sec-abstract-operations) der [ECMAScript Language Specification](https://tc39.github.io/ecma262/) dokumentiert.

Diese APIs unterstützen die Ausführung einer der folgenden Aktionen:

### `napi_coerce_to_bool` {#napi_coerce_to_bool}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
napi_status napi_coerce_to_bool(napi_env env,
                                napi_value value,
                                napi_value* result)
```
- `[in] env`: Die Umgebung, in der die API aufgerufen wird.
- `[in] value`: Der zu erzwingende JavaScript-Wert.
- `[out] result`: `napi_value`, das den erzwungenen JavaScript `Boolean` darstellt.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API implementiert die abstrakte Operation `ToBoolean()`, wie in [Abschnitt 7.1.2](https://tc39.github.io/ecma262/#sec-toboolean) der ECMAScript Language Specification definiert.

### `napi_coerce_to_number` {#napi_coerce_to_number}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
napi_status napi_coerce_to_number(napi_env env,
                                  napi_value value,
                                  napi_value* result)
```
- `[in] env`: Die Umgebung, in der die API aufgerufen wird.
- `[in] value`: Der zu erzwingende JavaScript-Wert.
- `[out] result`: `napi_value`, das die erzwungene JavaScript-`number` darstellt.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API implementiert die abstrakte Operation `ToNumber()`, wie in [Abschnitt 7.1.3](https://tc39.github.io/ecma262/#sec-tonumber) der ECMAScript Language Specification definiert. Diese Funktion führt möglicherweise JS-Code aus, wenn der übergebene Wert ein Objekt ist.

### `napi_coerce_to_object` {#napi_coerce_to_object}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
napi_status napi_coerce_to_object(napi_env env,
                                  napi_value value,
                                  napi_value* result)
```
- `[in] env`: Die Umgebung, in der die API aufgerufen wird.
- `[in] value`: Der zu erzwingende JavaScript-Wert.
- `[out] result`: `napi_value`, das das erzwungene JavaScript-`Object` darstellt.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API implementiert die abstrakte Operation `ToObject()`, wie in [Abschnitt 7.1.13](https://tc39.github.io/ecma262/#sec-toobject) der ECMAScript Language Specification definiert.


### `napi_coerce_to_string` {#napi_coerce_to_string}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
napi_status napi_coerce_to_string(napi_env env,
                                  napi_value value,
                                  napi_value* result)
```
- `[in] env`: Die Umgebung, unter der die API aufgerufen wird.
- `[in] value`: Der zu konvertierende JavaScript-Wert.
- `[out] result`: `napi_value`, das den konvertierten JavaScript-`string` darstellt.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API implementiert die abstrakte Operation `ToString()`, wie in [Abschnitt 7.1.13](https://tc39.github.io/ecma262/#sec-toobject) der ECMAScript Language Specification definiert. Diese Funktion führt möglicherweise JS-Code aus, wenn der übergebene Wert ein Objekt ist.

### `napi_typeof` {#napi_typeof}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
napi_status napi_typeof(napi_env env, napi_value value, napi_valuetype* result)
```
- `[in] env`: Die Umgebung, unter der die API aufgerufen wird.
- `[in] value`: Der JavaScript-Wert, dessen Typ abgefragt werden soll.
- `[out] result`: Der Typ des JavaScript-Werts.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

- `napi_invalid_arg`, wenn der Typ von `value` kein bekannter ECMAScript-Typ ist und `value` kein External-Wert ist.

Diese API stellt ein Verhalten dar, das dem Aufruf des `typeof`-Operators auf dem Objekt entspricht, wie in [Abschnitt 12.5.5](https://tc39.github.io/ecma262/#sec-typeof-operator) der ECMAScript Language Specification definiert. Es gibt jedoch einige Unterschiede:

Wenn `value` einen ungültigen Typ hat, wird ein Fehler zurückgegeben.

### `napi_instanceof` {#napi_instanceof}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
napi_status napi_instanceof(napi_env env,
                            napi_value object,
                            napi_value constructor,
                            bool* result)
```
- `[in] env`: Die Umgebung, unter der die API aufgerufen wird.
- `[in] object`: Der zu prüfende JavaScript-Wert.
- `[in] constructor`: Das JavaScript-Funktionsobjekt der Konstruktorfunktion, gegen die geprüft werden soll.
- `[out] result`: Boolescher Wert, der auf true gesetzt wird, wenn `object instanceof constructor` true ist.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API stellt den Aufruf des `instanceof`-Operators auf dem Objekt dar, wie in [Abschnitt 12.10.4](https://tc39.github.io/ecma262/#sec-instanceofoperator) der ECMAScript Language Specification definiert.


### `napi_is_array` {#napi_is_array}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
napi_status napi_is_array(napi_env env, napi_value value, bool* result)
```
- `[in] env`: Die Umgebung, unter der die API aufgerufen wird.
- `[in] value`: Der zu überprüfende JavaScript-Wert.
- `[out] result`: Gibt an, ob das angegebene Objekt ein Array ist.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API stellt den Aufruf der `IsArray`-Operation für das Objekt dar, wie in [Abschnitt 7.2.2](https://tc39.github.io/ecma262/#sec-isarray) der ECMAScript Language Specification definiert.

### `napi_is_arraybuffer` {#napi_is_arraybuffer}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
napi_status napi_is_arraybuffer(napi_env env, napi_value value, bool* result)
```
- `[in] env`: Die Umgebung, unter der die API aufgerufen wird.
- `[in] value`: Der zu überprüfende JavaScript-Wert.
- `[out] result`: Gibt an, ob das angegebene Objekt ein `ArrayBuffer` ist.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API prüft, ob das übergebene `Object` ein Array-Puffer ist.

### `napi_is_buffer` {#napi_is_buffer}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
napi_status napi_is_buffer(napi_env env, napi_value value, bool* result)
```
- `[in] env`: Die Umgebung, unter der die API aufgerufen wird.
- `[in] value`: Der zu überprüfende JavaScript-Wert.
- `[out] result`: Gibt an, ob der gegebene `napi_value` ein `node::Buffer` oder `Uint8Array`-Objekt darstellt.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API prüft, ob das übergebene `Object` ein Puffer oder Uint8Array ist. [`napi_is_typedarray`](/de/nodejs/api/n-api#napi_is_typedarray) sollte bevorzugt werden, wenn der Aufrufer prüfen muss, ob der Wert ein Uint8Array ist.

### `napi_is_date` {#napi_is_date}

**Hinzugefügt in: v11.11.0, v10.17.0**

**N-API Version: 5**

```C [C]
napi_status napi_is_date(napi_env env, napi_value value, bool* result)
```
- `[in] env`: Die Umgebung, unter der die API aufgerufen wird.
- `[in] value`: Der zu überprüfende JavaScript-Wert.
- `[out] result`: Gibt an, ob der gegebene `napi_value` ein JavaScript `Date`-Objekt darstellt.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API prüft, ob das übergebene `Object` ein Datum ist.


### `napi_is_error` {#napi_is_error_1}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
napi_status napi_is_error(napi_env env, napi_value value, bool* result)
```
- `[in] env`: Die Umgebung, unter der die API aufgerufen wird.
- `[in] value`: Der zu prüfende JavaScript-Wert.
- `[out] result`: Ob der gegebene `napi_value` ein `Error`-Objekt darstellt.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API prüft, ob das übergebene `Object` ein `Error` ist.

### `napi_is_typedarray` {#napi_is_typedarray}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
napi_status napi_is_typedarray(napi_env env, napi_value value, bool* result)
```
- `[in] env`: Die Umgebung, unter der die API aufgerufen wird.
- `[in] value`: Der zu prüfende JavaScript-Wert.
- `[out] result`: Ob der gegebene `napi_value` ein `TypedArray` darstellt.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API prüft, ob das übergebene `Object` ein typisiertes Array ist.

### `napi_is_dataview` {#napi_is_dataview}

**Hinzugefügt in: v8.3.0**

**N-API Version: 1**

```C [C]
napi_status napi_is_dataview(napi_env env, napi_value value, bool* result)
```
- `[in] env`: Die Umgebung, unter der die API aufgerufen wird.
- `[in] value`: Der zu prüfende JavaScript-Wert.
- `[out] result`: Ob der gegebene `napi_value` eine `DataView` darstellt.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API prüft, ob das übergebene `Object` eine `DataView` ist.

### `napi_strict_equals` {#napi_strict_equals}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
napi_status napi_strict_equals(napi_env env,
                               napi_value lhs,
                               napi_value rhs,
                               bool* result)
```
- `[in] env`: Die Umgebung, unter der die API aufgerufen wird.
- `[in] lhs`: Der zu prüfende JavaScript-Wert.
- `[in] rhs`: Der JavaScript-Wert, mit dem verglichen wird.
- `[out] result`: Ob die beiden `napi_value`-Objekte gleich sind.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API repräsentiert den Aufruf des Strict Equality-Algorithmus, wie in [Abschnitt 7.2.14](https://tc39.github.io/ecma262/#sec-strict-equality-comparison) der ECMAScript Language Specification definiert.


### `napi_detach_arraybuffer` {#napi_detach_arraybuffer}

**Hinzugefügt in: v13.0.0, v12.16.0, v10.22.0**

**N-API Version: 7**

```C [C]
napi_status napi_detach_arraybuffer(napi_env env,
                                    napi_value arraybuffer)
```
- `[in] env`: Die Umgebung, unter der die API aufgerufen wird.
- `[in] arraybuffer`: Der JavaScript `ArrayBuffer`, der abgetrennt werden soll.

Gibt `napi_ok` zurück, wenn die API erfolgreich war. Wenn ein nicht abtrennbarer `ArrayBuffer` übergeben wird, wird `napi_detachable_arraybuffer_expected` zurückgegeben.

Im Allgemeinen ist ein `ArrayBuffer` nicht abtrennbar, wenn er zuvor abgetrennt wurde. Die Engine kann zusätzliche Bedingungen dafür festlegen, ob ein `ArrayBuffer` abtrennbar ist. V8 erfordert beispielsweise, dass der `ArrayBuffer` extern ist, d. h. mit [`napi_create_external_arraybuffer`](/de/nodejs/api/n-api#napi_create_external_arraybuffer) erstellt wurde.

Diese API stellt den Aufruf der `ArrayBuffer`-Trennoperation dar, wie in [Abschnitt 24.1.1.3](https://tc39.es/ecma262/#sec-detacharraybuffer) der ECMAScript-Sprachspezifikation definiert.

### `napi_is_detached_arraybuffer` {#napi_is_detached_arraybuffer}

**Hinzugefügt in: v13.3.0, v12.16.0, v10.22.0**

**N-API Version: 7**

```C [C]
napi_status napi_is_detached_arraybuffer(napi_env env,
                                         napi_value arraybuffer,
                                         bool* result)
```
- `[in] env`: Die Umgebung, unter der die API aufgerufen wird.
- `[in] arraybuffer`: Der zu prüfende JavaScript `ArrayBuffer`.
- `[out] result`: Gibt an, ob der `arraybuffer` abgetrennt ist.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Der `ArrayBuffer` gilt als abgetrennt, wenn seine internen Daten `null` sind.

Diese API stellt den Aufruf der `ArrayBuffer`-Operation `IsDetachedBuffer` dar, wie in [Abschnitt 24.1.1.2](https://tc39.es/ecma262/#sec-isdetachedbuffer) der ECMAScript-Sprachspezifikation definiert.

## Arbeiten mit JavaScript-Eigenschaften {#working-with-javascript-properties}

Node-API stellt eine Reihe von APIs bereit, um Eigenschaften in JavaScript-Objekten abzurufen und festzulegen. Einige dieser Typen werden unter [Abschnitt 7](https://tc39.github.io/ecma262/#sec-abstract-operations) der [ECMAScript-Sprachspezifikation](https://tc39.github.io/ecma262/) dokumentiert.

Eigenschaften in JavaScript werden als Tupel aus einem Schlüssel und einem Wert dargestellt. Grundsätzlich können alle Eigenschaftsschlüssel in Node-API in einer der folgenden Formen dargestellt werden:

- Benannt: eine einfache UTF8-codierte Zeichenkette
- Integer-Indiziert: ein Indexwert, der durch `uint32_t` dargestellt wird
- JavaScript-Wert: diese werden in Node-API durch `napi_value` dargestellt. Dies kann ein `napi_value` sein, der eine `string`, `number` oder `symbol` darstellt.

Node-API-Werte werden durch den Typ `napi_value` dargestellt. Jeder Node-API-Aufruf, der einen JavaScript-Wert benötigt, akzeptiert einen `napi_value`. Es liegt jedoch in der Verantwortung des Aufrufers sicherzustellen, dass der betreffende `napi_value` vom JavaScript-Typ ist, der von der API erwartet wird.

Die in diesem Abschnitt dokumentierten APIs bieten eine einfache Schnittstelle zum Abrufen und Festlegen von Eigenschaften für beliebige JavaScript-Objekte, die durch `napi_value` dargestellt werden.

Betrachten Sie beispielsweise den folgenden JavaScript-Codeausschnitt:

```js [ESM]
const obj = {};
obj.myProp = 123;
```
Das Äquivalent kann mit Node-API-Werten mit dem folgenden Codeausschnitt erfolgen:

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
Indizierte Eigenschaften können auf ähnliche Weise festgelegt werden. Betrachten Sie den folgenden JavaScript-Codeausschnitt:

```js [ESM]
const arr = [];
arr[123] = 'hello';
```
Das Äquivalent kann mit Node-API-Werten mit dem folgenden Codeausschnitt erfolgen:

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
Eigenschaften können mithilfe der in diesem Abschnitt beschriebenen APIs abgerufen werden. Betrachten Sie den folgenden JavaScript-Codeausschnitt:

```js [ESM]
const arr = [];
const value = arr[123];
```
Das Folgende ist das ungefähre Äquivalent des Node-API-Gegenstücks:

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
Schließlich können auch mehrere Eigenschaften aus Leistungsgründen für ein Objekt definiert werden. Betrachten Sie das folgende JavaScript:

```js [ESM]
const obj = {};
Object.defineProperties(obj, {
  'foo': { value: 123, writable: true, configurable: true, enumerable: true },
  'bar': { value: 456, writable: true, configurable: true, enumerable: true },
});
```
Das Folgende ist das ungefähre Äquivalent des Node-API-Gegenstücks:

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

### Strukturen {#structures}

#### `napi_property_attributes` {#napi_property_attributes}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v14.12.0 | `napi_default_method` und `napi_default_property` hinzugefügt. |
:::

```C [C]
typedef enum {
  napi_default = 0,
  napi_writable = 1 << 0,
  napi_enumerable = 1 << 1,
  napi_configurable = 1 << 2,

  // Wird mit napi_define_class verwendet, um statische Eigenschaften
  // von Instanzeigenschaften zu unterscheiden. Wird von napi_define_properties ignoriert.
  napi_static = 1 << 10,

  // Standard für Klassenmethoden.
  napi_default_method = napi_writable | napi_configurable,

  // Standard für Objekteigenschaften, wie in JS obj[prop].
  napi_default_jsproperty = napi_writable |
                          napi_enumerable |
                          napi_configurable,
} napi_property_attributes;
```
`napi_property_attributes` sind Flags, die verwendet werden, um das Verhalten von Eigenschaften zu steuern, die für ein JavaScript-Objekt festgelegt wurden. Abgesehen von `napi_static` entsprechen sie den Attributen, die in [Abschnitt 6.1.7.1](https://tc39.github.io/ecma262/#table-2) der [ECMAScript Language Specification](https://tc39.github.io/ecma262/) aufgeführt sind. Sie können eine oder mehrere der folgenden Bitflags sein:

- `napi_default`: Für die Eigenschaft sind keine expliziten Attribute festgelegt. Standardmäßig ist eine Eigenschaft schreibgeschützt, nicht aufzählbar und nicht konfigurierbar.
- `napi_writable`: Die Eigenschaft ist beschreibbar.
- `napi_enumerable`: Die Eigenschaft ist aufzählbar.
- `napi_configurable`: Die Eigenschaft ist konfigurierbar, wie in [Abschnitt 6.1.7.1](https://tc39.github.io/ecma262/#table-2) der [ECMAScript Language Specification](https://tc39.github.io/ecma262/) definiert.
- `napi_static`: Die Eigenschaft wird als statische Eigenschaft für eine Klasse definiert, im Gegensatz zu einer Instanzeigenschaft, die die Standardeinstellung ist. Dies wird nur von [`napi_define_class`](/de/nodejs/api/n-api#napi_define_class) verwendet. Sie wird von `napi_define_properties` ignoriert.
- `napi_default_method`: Wie eine Methode in einer JS-Klasse ist die Eigenschaft konfigurierbar und beschreibbar, aber nicht aufzählbar.
- `napi_default_jsproperty`: Wie eine Eigenschaft, die durch Zuweisung in JavaScript festgelegt wird, ist die Eigenschaft beschreibbar, aufzählbar und konfigurierbar.


#### `napi_property_descriptor` {#napi_property_descriptor}

```C [C]
typedef struct {
  // One of utf8name or name should be NULL.
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
- `utf8name`: Optionale Zeichenkette, die den Schlüssel für die Eigenschaft als UTF8 kodiert beschreibt. Entweder `utf8name` oder `name` muss für die Eigenschaft angegeben werden.
- `name`: Optionaler `napi_value`, der auf eine JavaScript-Zeichenkette oder ein Symbol verweist, die/das als Schlüssel für die Eigenschaft verwendet werden soll. Entweder `utf8name` oder `name` muss für die Eigenschaft angegeben werden.
- `value`: Der Wert, der durch einen Get-Zugriff auf die Eigenschaft abgerufen wird, wenn die Eigenschaft eine Dateneigenschaft ist. Wenn dies übergeben wird, setzen Sie `getter`, `setter`, `method` und `data` auf `NULL` (da diese Elemente nicht verwendet werden).
- `getter`: Eine Funktion, die aufgerufen wird, wenn ein Get-Zugriff auf die Eigenschaft durchgeführt wird. Wenn dies übergeben wird, setzen Sie `value` und `method` auf `NULL` (da diese Elemente nicht verwendet werden). Die angegebene Funktion wird implizit von der Laufzeit aufgerufen, wenn auf die Eigenschaft von JavaScript-Code aus zugegriffen wird (oder wenn ein Get auf die Eigenschaft mit einem Node-API-Aufruf durchgeführt wird). [`napi_callback`](/de/nodejs/api/n-api#napi_callback) bietet weitere Details.
- `setter`: Eine Funktion, die aufgerufen wird, wenn ein Set-Zugriff auf die Eigenschaft durchgeführt wird. Wenn dies übergeben wird, setzen Sie `value` und `method` auf `NULL` (da diese Elemente nicht verwendet werden). Die angegebene Funktion wird implizit von der Laufzeit aufgerufen, wenn die Eigenschaft von JavaScript-Code aus gesetzt wird (oder wenn ein Set auf die Eigenschaft mit einem Node-API-Aufruf durchgeführt wird). [`napi_callback`](/de/nodejs/api/n-api#napi_callback) bietet weitere Details.
- `method`: Setzen Sie dies, damit die `value`-Eigenschaft des Eigenschaftsdeskriptorobjekts eine JavaScript-Funktion ist, die durch `method` dargestellt wird. Wenn dies übergeben wird, setzen Sie `value`, `getter` und `setter` auf `NULL` (da diese Elemente nicht verwendet werden). [`napi_callback`](/de/nodejs/api/n-api#napi_callback) bietet weitere Details.
- `attributes`: Die Attribute, die der jeweiligen Eigenschaft zugeordnet sind. Siehe [`napi_property_attributes`](/de/nodejs/api/n-api#napi_property_attributes).
- `data`: Die Callback-Daten, die an `method`, `getter` und `setter` übergeben werden, wenn diese Funktion aufgerufen wird.


### Funktionen {#functions}

#### `napi_get_property_names` {#napi_get_property_names}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
napi_status napi_get_property_names(napi_env env,
                                    napi_value object,
                                    napi_value* result);
```
- `[in] env`: Die Umgebung, unter der der Node-API-Aufruf aufgerufen wird.
- `[in] object`: Das Objekt, von dem die Eigenschaften abgerufen werden sollen.
- `[out] result`: Ein `napi_value`, das ein Array von JavaScript-Werten darstellt, die die Eigenschaftsnamen des Objekts darstellen. Die API kann verwendet werden, um über `result` mit [`napi_get_array_length`](/de/nodejs/api/n-api#napi_get_array_length) und [`napi_get_element`](/de/nodejs/api/n-api#napi_get_element) zu iterieren.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API gibt die Namen der aufzählbaren Eigenschaften von `object` als Array von Strings zurück. Die Eigenschaften von `object`, deren Schlüssel ein Symbol ist, werden nicht berücksichtigt.

#### `napi_get_all_property_names` {#napi_get_all_property_names}

**Hinzugefügt in: v13.7.0, v12.17.0, v10.20.0**

**N-API Version: 6**

```C [C]
napi_get_all_property_names(napi_env env,
                            napi_value object,
                            napi_key_collection_mode key_mode,
                            napi_key_filter key_filter,
                            napi_key_conversion key_conversion,
                            napi_value* result);
```
- `[in] env`: Die Umgebung, unter der der Node-API-Aufruf aufgerufen wird.
- `[in] object`: Das Objekt, von dem die Eigenschaften abgerufen werden sollen.
- `[in] key_mode`: Ob Prototyp-Eigenschaften ebenfalls abgerufen werden sollen.
- `[in] key_filter`: Welche Eigenschaften abgerufen werden sollen (aufzählbar/lesbar/schreibbar).
- `[in] key_conversion`: Ob nummerierte Eigenschaftsschlüssel in Strings konvertiert werden sollen.
- `[out] result`: Ein `napi_value`, das ein Array von JavaScript-Werten darstellt, die die Eigenschaftsnamen des Objekts darstellen. [`napi_get_array_length`](/de/nodejs/api/n-api#napi_get_array_length) und [`napi_get_element`](/de/nodejs/api/n-api#napi_get_element) können verwendet werden, um über `result` zu iterieren.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API gibt ein Array mit den Namen der verfügbaren Eigenschaften dieses Objekts zurück.


#### `napi_set_property` {#napi_set_property}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
napi_status napi_set_property(napi_env env,
                              napi_value object,
                              napi_value key,
                              napi_value value);
```
- `[in] env`: Die Umgebung, unter der der Node-API-Aufruf aufgerufen wird.
- `[in] object`: Das Objekt, auf dem die Eigenschaft gesetzt werden soll.
- `[in] key`: Der Name der Eigenschaft, die gesetzt werden soll.
- `[in] value`: Der Wert der Eigenschaft.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API setzt eine Eigenschaft auf dem übergebenen `Object`.

#### `napi_get_property` {#napi_get_property}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
napi_status napi_get_property(napi_env env,
                              napi_value object,
                              napi_value key,
                              napi_value* result);
```
- `[in] env`: Die Umgebung, unter der der Node-API-Aufruf aufgerufen wird.
- `[in] object`: Das Objekt, aus dem die Eigenschaft abgerufen werden soll.
- `[in] key`: Der Name der Eigenschaft, die abgerufen werden soll.
- `[out] result`: Der Wert der Eigenschaft.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API ruft die angeforderte Eigenschaft aus dem übergebenen `Object` ab.

#### `napi_has_property` {#napi_has_property}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
napi_status napi_has_property(napi_env env,
                              napi_value object,
                              napi_value key,
                              bool* result);
```
- `[in] env`: Die Umgebung, unter der der Node-API-Aufruf aufgerufen wird.
- `[in] object`: Das abzufragende Objekt.
- `[in] key`: Der Name der Eigenschaft, deren Existenz geprüft werden soll.
- `[out] result`: Ob die Eigenschaft im Objekt vorhanden ist oder nicht.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API prüft, ob das übergebene `Object` die benannte Eigenschaft hat.

#### `napi_delete_property` {#napi_delete_property}

**Hinzugefügt in: v8.2.0**

**N-API Version: 1**

```C [C]
napi_status napi_delete_property(napi_env env,
                                 napi_value object,
                                 napi_value key,
                                 bool* result);
```
- `[in] env`: Die Umgebung, unter der der Node-API-Aufruf aufgerufen wird.
- `[in] object`: Das abzufragende Objekt.
- `[in] key`: Der Name der Eigenschaft, die gelöscht werden soll.
- `[out] result`: Ob das Löschen der Eigenschaft erfolgreich war oder nicht. `result` kann optional durch Übergabe von `NULL` ignoriert werden.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API versucht, die eigene `key`-Eigenschaft aus `object` zu löschen.


#### `napi_has_own_property` {#napi_has_own_property}

**Hinzugefügt in: v8.2.0**

**N-API-Version: 1**

```C [C]
napi_status napi_has_own_property(napi_env env,
                                  napi_value object,
                                  napi_value key,
                                  bool* result);
```
- `[in] env`: Die Umgebung, unter der der Node-API-Aufruf aufgerufen wird.
- `[in] object`: Das abzufragende Objekt.
- `[in] key`: Der Name der eigenen Eigenschaft, deren Existenz überprüft werden soll.
- `[out] result`: Gibt an, ob die eigene Eigenschaft im Objekt vorhanden ist oder nicht.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API prüft, ob das übergebene `Object` die benannte eigene Eigenschaft hat. `key` muss ein `string` oder ein `symbol` sein, andernfalls wird ein Fehler ausgelöst. Node-API führt keine Konvertierung zwischen Datentypen durch.

#### `napi_set_named_property` {#napi_set_named_property}

**Hinzugefügt in: v8.0.0**

**N-API-Version: 1**

```C [C]
napi_status napi_set_named_property(napi_env env,
                                    napi_value object,
                                    const char* utf8Name,
                                    napi_value value);
```
- `[in] env`: Die Umgebung, unter der der Node-API-Aufruf aufgerufen wird.
- `[in] object`: Das Objekt, auf dem die Eigenschaft festgelegt werden soll.
- `[in] utf8Name`: Der Name der Eigenschaft, die festgelegt werden soll.
- `[in] value`: Der Wert der Eigenschaft.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese Methode entspricht dem Aufruf von [`napi_set_property`](/de/nodejs/api/n-api#napi_set_property) mit einem `napi_value`, das aus der als `utf8Name` übergebenen Zeichenfolge erstellt wurde.

#### `napi_get_named_property` {#napi_get_named_property}

**Hinzugefügt in: v8.0.0**

**N-API-Version: 1**

```C [C]
napi_status napi_get_named_property(napi_env env,
                                    napi_value object,
                                    const char* utf8Name,
                                    napi_value* result);
```
- `[in] env`: Die Umgebung, unter der der Node-API-Aufruf aufgerufen wird.
- `[in] object`: Das Objekt, aus dem die Eigenschaft abgerufen werden soll.
- `[in] utf8Name`: Der Name der Eigenschaft, die abgerufen werden soll.
- `[out] result`: Der Wert der Eigenschaft.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese Methode entspricht dem Aufruf von [`napi_get_property`](/de/nodejs/api/n-api#napi_get_property) mit einem `napi_value`, das aus der als `utf8Name` übergebenen Zeichenfolge erstellt wurde.


#### `napi_has_named_property` {#napi_has_named_property}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
napi_status napi_has_named_property(napi_env env,
                                    napi_value object,
                                    const char* utf8Name,
                                    bool* result);
```
- `[in] env`: Die Umgebung, unter der der Node-API-Aufruf aufgerufen wird.
- `[in] object`: Das abzufragende Objekt.
- `[in] utf8Name`: Der Name der Eigenschaft, deren Existenz geprüft werden soll.
- `[out] result`: Ob die Eigenschaft im Objekt vorhanden ist oder nicht.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese Methode ist äquivalent zum Aufruf von [`napi_has_property`](/de/nodejs/api/n-api#napi_has_property) mit einem `napi_value`, das aus der als `utf8Name` übergebenen Zeichenkette erstellt wurde.

#### `napi_set_element` {#napi_set_element}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
napi_status napi_set_element(napi_env env,
                             napi_value object,
                             uint32_t index,
                             napi_value value);
```
- `[in] env`: Die Umgebung, unter der der Node-API-Aufruf aufgerufen wird.
- `[in] object`: Das Objekt, von dem die Eigenschaften gesetzt werden sollen.
- `[in] index`: Der Index der Eigenschaft, die gesetzt werden soll.
- `[in] value`: Der Wert der Eigenschaft.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API setzt ein Element im übergebenen `Object`.

#### `napi_get_element` {#napi_get_element}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
napi_status napi_get_element(napi_env env,
                             napi_value object,
                             uint32_t index,
                             napi_value* result);
```
- `[in] env`: Die Umgebung, unter der der Node-API-Aufruf aufgerufen wird.
- `[in] object`: Das Objekt, von dem die Eigenschaft abgerufen werden soll.
- `[in] index`: Der Index der Eigenschaft, die abgerufen werden soll.
- `[out] result`: Der Wert der Eigenschaft.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API ruft das Element am angeforderten Index ab.

#### `napi_has_element` {#napi_has_element}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
napi_status napi_has_element(napi_env env,
                             napi_value object,
                             uint32_t index,
                             bool* result);
```
- `[in] env`: Die Umgebung, unter der der Node-API-Aufruf aufgerufen wird.
- `[in] object`: Das abzufragende Objekt.
- `[in] index`: Der Index der Eigenschaft, deren Existenz geprüft werden soll.
- `[out] result`: Ob die Eigenschaft im Objekt vorhanden ist oder nicht.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API gibt zurück, ob das übergebene `Object` ein Element am angeforderten Index hat.


#### `napi_delete_element` {#napi_delete_element}

**Hinzugefügt in: v8.2.0**

**N-API-Version: 1**

```C [C]
napi_status napi_delete_element(napi_env env,
                                napi_value object,
                                uint32_t index,
                                bool* result);
```
- `[in] env`: Die Umgebung, unter der der Node-API-Aufruf aufgerufen wird.
- `[in] object`: Das abzufragende Objekt.
- `[in] index`: Der Index der zu löschenden Eigenschaft.
- `[out] result`: Ob das Löschen des Elements erfolgreich war oder nicht. `result` kann optional ignoriert werden, indem `NULL` übergeben wird.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API versucht, den angegebenen `index` aus `object` zu löschen.

#### `napi_define_properties` {#napi_define_properties}

**Hinzugefügt in: v8.0.0**

**N-API-Version: 1**

```C [C]
napi_status napi_define_properties(napi_env env,
                                   napi_value object,
                                   size_t property_count,
                                   const napi_property_descriptor* properties);
```
- `[in] env`: Die Umgebung, unter der der Node-API-Aufruf aufgerufen wird.
- `[in] object`: Das Objekt, aus dem die Eigenschaften abgerufen werden sollen.
- `[in] property_count`: Die Anzahl der Elemente im Array `properties`.
- `[in] properties`: Das Array von Eigenschaftsdeskriptoren.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese Methode ermöglicht die effiziente Definition mehrerer Eigenschaften für ein gegebenes Objekt. Die Eigenschaften werden mithilfe von Eigenschaftsdeskriptoren definiert (siehe [`napi_property_descriptor`](/de/nodejs/api/n-api#napi_property_descriptor)). Angesichts eines Arrays solcher Eigenschaftsdeskriptoren setzt diese API die Eigenschaften für das Objekt einzeln, wie durch `DefineOwnProperty()` definiert (beschrieben in [Abschnitt 9.1.6](https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots-defineownproperty-p-desc) der ECMA-262-Spezifikation).

#### `napi_object_freeze` {#napi_object_freeze}

**Hinzugefügt in: v14.14.0, v12.20.0**

**N-API-Version: 8**

```C [C]
napi_status napi_object_freeze(napi_env env,
                               napi_value object);
```
- `[in] env`: Die Umgebung, unter der der Node-API-Aufruf aufgerufen wird.
- `[in] object`: Das einzufrierende Objekt.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese Methode friert ein gegebenes Objekt ein. Dies verhindert, dass neue Eigenschaften hinzugefügt werden, bestehende Eigenschaften entfernt werden, verhindert das Ändern der Aufzählbarkeit, Konfigurierbarkeit oder Beschreibbarkeit bestehender Eigenschaften und verhindert, dass die Werte bestehender Eigenschaften geändert werden. Es verhindert auch, dass der Prototyp des Objekts geändert wird. Dies wird in [Abschnitt 19.1.2.6](https://tc39.es/ecma262/#sec-object.freeze) der ECMA-262-Spezifikation beschrieben.


#### `napi_object_seal` {#napi_object_seal}

**Hinzugefügt in: v14.14.0, v12.20.0**

**N-API-Version: 8**

```C [C]
napi_status napi_object_seal(napi_env env,
                             napi_value object);
```
- `[in] env`: Die Umgebung, unter der der Node-API-Aufruf erfolgt.
- `[in] object`: Das zu versiegelnde Objekt.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese Methode versiegelt ein gegebenes Objekt. Dies verhindert, dass neue Eigenschaften hinzugefügt werden, und markiert alle vorhandenen Eigenschaften als nicht konfigurierbar. Dies wird in [Abschnitt 19.1.2.20](https://tc39.es/ecma262/#sec-object.seal) der ECMA-262-Spezifikation beschrieben.

## Arbeiten mit JavaScript-Funktionen {#working-with-javascript-functions}

Node-API bietet eine Reihe von APIs, die es JavaScript-Code ermöglichen, nativen Code zurückzurufen. Node-APIs, die den Rückruf in nativen Code unterstützen, nehmen Callback-Funktionen entgegen, die durch den Typ `napi_callback` dargestellt werden. Wenn die JavaScript-VM nativen Code zurückruft, wird die bereitgestellte `napi_callback`-Funktion aufgerufen. Die in diesem Abschnitt dokumentierten APIs ermöglichen der Callback-Funktion Folgendes:

- Informationen über den Kontext abrufen, in dem der Callback aufgerufen wurde.
- Die an den Callback übergebenen Argumente abrufen.
- Einen `napi_value` vom Callback zurückgeben.

Zusätzlich bietet Node-API eine Reihe von Funktionen, die das Aufrufen von JavaScript-Funktionen aus nativem Code ermöglichen. Man kann entweder eine Funktion wie einen regulären JavaScript-Funktionsaufruf oder als Konstruktorfunktion aufrufen.

Alle Nicht-`NULL`-Daten, die dieser API über das Feld `data` der `napi_property_descriptor`-Elemente übergeben werden, können mit `object` verknüpft und freigegeben werden, sobald `object` per Garbage Collection entsorgt wird, indem sowohl `object` als auch die Daten an [`napi_add_finalizer`](/de/nodejs/api/n-api#napi_add_finalizer) übergeben werden.

### `napi_call_function` {#napi_call_function}

**Hinzugefügt in: v8.0.0**

**N-API-Version: 1**

```C [C]
NAPI_EXTERN napi_status napi_call_function(napi_env env,
                                           napi_value recv,
                                           napi_value func,
                                           size_t argc,
                                           const napi_value* argv,
                                           napi_value* result);
```
- `[in] env`: Die Umgebung, unter der die API aufgerufen wird.
- `[in] recv`: Der `this`-Wert, der an die aufgerufene Funktion übergeben wird.
- `[in] func`: `napi_value`, der die aufzurufende JavaScript-Funktion darstellt.
- `[in] argc`: Die Anzahl der Elemente im `argv`-Array.
- `[in] argv`: Array von `napi_values`, die als Argumente an die Funktion übergebene JavaScript-Werte darstellen.
- `[out] result`: `napi_value`, das das zurückgegebene JavaScript-Objekt darstellt.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese Methode ermöglicht das Aufrufen eines JavaScript-Funktionsobjekts von einem nativen Add-on. Dies ist der primäre Mechanismus, um *vom* nativen Code des Add-ons *zurück* nach JavaScript aufzurufen. Für den Sonderfall des Aufrufs nach JavaScript nach einer asynchronen Operation siehe [`napi_make_callback`](/de/nodejs/api/n-api#napi_make_callback).

Ein beispielhafter Anwendungsfall könnte wie folgt aussehen. Betrachten Sie den folgenden JavaScript-Schnipsel:

```js [ESM]
function AddTwo(num) {
  return num + 2;
}
global.AddTwo = AddTwo;
```
Dann kann die obige Funktion von einem nativen Add-on mit dem folgenden Code aufgerufen werden:

```C [C]
// Get the function named "AddTwo" on the global object
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

// Convert the result back to a native type
int32_t result;
status = napi_get_value_int32(env, return_val, &result);
if (status != napi_ok) return;
```

### `napi_create_function` {#napi_create_function}

**Hinzugefügt in: v8.0.0**

**N-API-Version: 1**

```C [C]
napi_status napi_create_function(napi_env env,
                                 const char* utf8name,
                                 size_t length,
                                 napi_callback cb,
                                 void* data,
                                 napi_value* result);
```
- `[in] env`: Die Umgebung, in der die API aufgerufen wird.
- `[in] utf8Name`: Optionaler Name der Funktion, der als UTF8 kodiert ist. Dieser ist innerhalb von JavaScript als die `name`-Eigenschaft des neuen Funktionsobjekts sichtbar.
- `[in] length`: Die Länge von `utf8name` in Bytes oder `NAPI_AUTO_LENGTH`, wenn er nullterminiert ist.
- `[in] cb`: Die native Funktion, die aufgerufen werden soll, wenn dieses Funktionsobjekt aufgerufen wird. [`napi_callback`](/de/nodejs/api/n-api#napi_callback) enthält weitere Details.
- `[in] data`: Benutzerdefinierter Datenkontext. Dieser wird bei späterem Aufruf an die Funktion zurückgegeben.
- `[out] result`: `napi_value`, das das JavaScript-Funktionsobjekt für die neu erstellte Funktion darstellt.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API ermöglicht es einem Add-on-Autor, ein Funktionsobjekt im nativen Code zu erstellen. Dies ist der primäre Mechanismus, um Aufrufe *in* den nativen Code des Add-ons *aus* JavaScript zu ermöglichen.

Die neu erstellte Funktion ist nach diesem Aufruf nicht automatisch im Skript sichtbar. Stattdessen muss explizit eine Eigenschaft für jedes Objekt festgelegt werden, das für JavaScript sichtbar ist, damit die Funktion vom Skript aus zugänglich ist.

Um eine Funktion als Teil der Modulexporte des Add-ons verfügbar zu machen, setzen Sie die neu erstellte Funktion auf das Exportobjekt. Ein beispielhaftes Modul könnte wie folgt aussehen:

```C [C]
napi_value SayHello(napi_env env, napi_callback_info info) {
  printf("Hallo\n");
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
Angesichts des obigen Codes kann das Add-on wie folgt von JavaScript aus verwendet werden:

```js [ESM]
const myaddon = require('./addon');
myaddon.sayHello();
```
Die an `require()` übergebene Zeichenfolge ist der Name des Ziels in `binding.gyp`, das für die Erstellung der `.node`-Datei verantwortlich ist.

Alle Nicht-`NULL`-Daten, die über den Parameter `data` an diese API übergeben werden, können mit der resultierenden JavaScript-Funktion (die im Parameter `result` zurückgegeben wird) verknüpft und freigegeben werden, sobald die Funktion durch die Übergabe der JavaScript-Funktion und der Daten an [`napi_add_finalizer`](/de/nodejs/api/n-api#napi_add_finalizer) als Garbage eingesammelt wird.

JavaScript `Function`s werden in [Abschnitt 19.2](https://tc39.github.io/ecma262/#sec-function-objects) der ECMAScript-Sprachspezifikation beschrieben.


### `napi_get_cb_info` {#napi_get_cb_info}

**Hinzugefügt in: v8.0.0**

**N-API-Version: 1**

```C [C]
napi_status napi_get_cb_info(napi_env env,
                             napi_callback_info cbinfo,
                             size_t* argc,
                             napi_value* argv,
                             napi_value* thisArg,
                             void** data)
```
- `[in] env`: Die Umgebung, in der die API aufgerufen wird.
- `[in] cbinfo`: Die Callback-Informationen, die an die Callback-Funktion übergeben werden.
- `[in-out] argc`: Gibt die Länge des bereitgestellten `argv`-Arrays an und empfängt die tatsächliche Anzahl der Argumente. `argc` kann optional ignoriert werden, indem `NULL` übergeben wird.
- `[out] argv`: C-Array von `napi_value`s, in das die Argumente kopiert werden. Wenn es mehr Argumente als die angegebene Anzahl gibt, werden nur die angeforderte Anzahl von Argumenten kopiert. Wenn weniger Argumente als beansprucht bereitgestellt werden, wird der Rest von `argv` mit `napi_value`-Werten gefüllt, die `undefined` darstellen. `argv` kann optional ignoriert werden, indem `NULL` übergeben wird.
- `[out] thisArg`: Empfängt das JavaScript `this`-Argument für den Aufruf. `thisArg` kann optional ignoriert werden, indem `NULL` übergeben wird.
- `[out] data`: Empfängt den Datenzeiger für den Callback. `data` kann optional ignoriert werden, indem `NULL` übergeben wird.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese Methode wird innerhalb einer Callback-Funktion verwendet, um Details über den Aufruf abzurufen, wie z. B. die Argumente und den `this`-Zeiger aus einer gegebenen Callback-Info.

### `napi_get_new_target` {#napi_get_new_target}

**Hinzugefügt in: v8.6.0**

**N-API-Version: 1**

```C [C]
napi_status napi_get_new_target(napi_env env,
                                napi_callback_info cbinfo,
                                napi_value* result)
```
- `[in] env`: Die Umgebung, in der die API aufgerufen wird.
- `[in] cbinfo`: Die Callback-Informationen, die an die Callback-Funktion übergeben werden.
- `[out] result`: Das `new.target` des Konstruktoraufrufs.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API gibt das `new.target` des Konstruktoraufrufs zurück. Wenn der aktuelle Callback kein Konstruktoraufruf ist, ist das Ergebnis `NULL`.


### `napi_new_instance` {#napi_new_instance}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
napi_status napi_new_instance(napi_env env,
                              napi_value cons,
                              size_t argc,
                              napi_value* argv,
                              napi_value* result)
```
- `[in] env`: Die Umgebung, unter der die API aufgerufen wird.
- `[in] cons`: `napi_value`, die die JavaScript-Funktion darstellt, die als Konstruktor aufgerufen werden soll.
- `[in] argc`: Die Anzahl der Elemente im `argv`-Array.
- `[in] argv`: Array von JavaScript-Werten als `napi_value`, die die Argumente für den Konstruktor darstellen. Wenn `argc` Null ist, kann dieser Parameter durch Übergabe von `NULL` weggelassen werden.
- `[out] result`: `napi_value`, die das zurückgegebene JavaScript-Objekt darstellt, was in diesem Fall das konstruierte Objekt ist.

Diese Methode wird verwendet, um einen neuen JavaScript-Wert mithilfe eines gegebenen `napi_value` zu instanziieren, der den Konstruktor für das Objekt darstellt. Betrachten Sie beispielsweise den folgenden Ausschnitt:

```js [ESM]
function MyObject(param) {
  this.param = param;
}

const arg = 'hello';
const value = new MyObject(arg);
```
Das Folgende kann in Node-API mit dem folgenden Ausschnitt angenähert werden:

```C [C]
// Holen Sie sich die Konstruktorfunktion MyObject
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
Gibt `napi_ok` zurück, wenn die API erfolgreich war.

## Object wrap {#object-wrap}

Node-API bietet eine Möglichkeit, C++-Klassen und -Instanzen zu "wrappen", sodass der Klassenkonstruktor und die Methoden von JavaScript aus aufgerufen werden können.

Für gewrappte Objekte kann es schwierig sein, zwischen einer Funktion, die auf einem Klassenprototyp aufgerufen wird, und einer Funktion, die auf einer Instanz einer Klasse aufgerufen wird, zu unterscheiden. Ein häufig verwendetes Muster zur Behebung dieses Problems besteht darin, einen persistenten Verweis auf den Klassenkonstruktor für spätere `instanceof`-Prüfungen zu speichern.

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
  // otherwise...
}
```
Die Referenz muss freigegeben werden, sobald sie nicht mehr benötigt wird.

Es gibt Fälle, in denen `napi_instanceof()` nicht ausreicht, um sicherzustellen, dass ein JavaScript-Objekt ein Wrapper für einen bestimmten nativen Typ ist. Dies ist insbesondere dann der Fall, wenn gewrappte JavaScript-Objekte über statische Methoden anstatt als `this`-Wert von Prototypmethoden wieder an das Addon übergeben werden. In solchen Fällen besteht die Möglichkeit, dass sie fälschlicherweise entpackt werden.

```js [ESM]
const myAddon = require('./build/Release/my_addon.node');

// `openDatabase()` gibt ein JavaScript-Objekt zurück, das ein natives Datenbank-
// handle wrappt.
const dbHandle = myAddon.openDatabase();

// `query()` gibt ein JavaScript-Objekt zurück, das ein natives Abfrage-Handle wrappt.
const queryHandle = myAddon.query(dbHandle, 'Gimme ALL the things!');

// In der Zeile unten befindet sich ein versehentlicher Fehler. Der erste Parameter für
// `myAddon.queryHasRecords()` sollte das Datenbank-Handle (`dbHandle`) sein, nicht
// das Abfrage-Handle (`query`), daher sollte die korrekte Bedingung für die While-Schleife
// sein
//
// myAddon.queryHasRecords(dbHandle, queryHandle)
//
while (myAddon.queryHasRecords(queryHandle, dbHandle)) {
  // retrieve records
}
```
Im obigen Beispiel ist `myAddon.queryHasRecords()` eine Methode, die zwei Argumente akzeptiert. Das erste ist ein Datenbank-Handle und das zweite ist ein Abfrage-Handle. Intern entpackt es das erste Argument und wandelt den resultierenden Zeiger in ein natives Datenbank-Handle um. Anschließend entpackt es das zweite Argument und wandelt den resultierenden Zeiger in ein Abfrage-Handle um. Wenn die Argumente in der falschen Reihenfolge übergeben werden, funktionieren die Umwandlungen, aber es besteht eine gute Chance, dass die zugrunde liegende Datenbankoperation fehlschlägt oder sogar einen ungültigen Speicherzugriff verursacht.

Um sicherzustellen, dass der vom ersten Argument abgerufene Zeiger tatsächlich ein Zeiger auf ein Datenbank-Handle ist und dass der vom zweiten Argument abgerufene Zeiger tatsächlich ein Zeiger auf ein Abfrage-Handle ist, muss die Implementierung von `queryHasRecords()` eine Typvalidierung durchführen. Das Beibehalten des JavaScript-Klassenkonstruktors, von dem das Datenbank-Handle instanziiert wurde, und des Konstruktors, von dem das Abfrage-Handle in `napi_ref`s instanziiert wurde, kann hilfreich sein, da `napi_instanceof()` dann verwendet werden kann, um sicherzustellen, dass die an `queryHashRecords()` übergebenen Instanzen tatsächlich vom richtigen Typ sind.

Leider schützt `napi_instanceof()` nicht vor Prototypmanipulationen. Beispielsweise kann der Prototyp der Datenbank-Handle-Instanz auf den Prototyp des Konstruktors für Abfrage-Handle-Instanzen gesetzt werden. In diesem Fall kann die Datenbank-Handle-Instanz als Abfrage-Handle-Instanz erscheinen und den `napi_instanceof()`-Test für eine Abfrage-Handle-Instanz bestehen, während sie immer noch einen Zeiger auf ein Datenbank-Handle enthält.

Zu diesem Zweck bietet Node-API Typ-Tagging-Funktionen.

Ein Typ-Tag ist eine 128-Bit-Ganzzahl, die für das Addon eindeutig ist. Node-API stellt die `napi_type_tag`-Struktur zum Speichern eines Typ-Tags bereit. Wenn ein solcher Wert zusammen mit einem JavaScript-Objekt oder [externen](/de/nodejs/api/n-api#napi_create_external) Wert, der in einem `napi_value` gespeichert ist, an `napi_type_tag_object()` übergeben wird, wird das JavaScript-Objekt mit dem Typ-Tag "markiert". Die "Markierung" ist auf der JavaScript-Seite unsichtbar. Wenn ein JavaScript-Objekt in ein natives Binding gelangt, kann `napi_check_object_type_tag()` zusammen mit dem ursprünglichen Typ-Tag verwendet werden, um zu bestimmen, ob das JavaScript-Objekt zuvor mit dem Typ-Tag "markiert" wurde. Dies erzeugt eine Typüberprüfungsfähigkeit mit einer höheren Genauigkeit, als `napi_instanceof()` bieten kann, da ein solches Typ-Tagging Prototypmanipulationen und das Entladen/Neuladen von Addons überlebt.

Um das obige Beispiel fortzusetzen, veranschaulicht die folgende Skelett-Addon-Implementierung die Verwendung von `napi_type_tag_object()` und `napi_check_object_type_tag()`.

```C [C]
// Dieser Wert ist das Typ-Tag für ein Datenbank-Handle. Der Befehl
//
//   uuidgen | sed -r -e 's/-//g' -e 's/(.{16})(.*)/0x\1, 0x\2/'
//
// kann verwendet werden, um die beiden Werte zu erhalten, mit denen die Struktur initialisiert wird.
static const napi_type_tag DatabaseHandleTypeTag = {
  0x1edf75a38336451d, 0xa5ed9ce2e4c00c38
};

// Dieser Wert ist das Typ-Tag für ein Abfrage-Handle.
static const napi_type_tag QueryHandleTypeTag = {
  0x9c73317f9fad44a3, 0x93c3920bf3b0ad6a
};

static napi_value
openDatabase(napi_env env, napi_callback_info info) {
  napi_status status;
  napi_value result;

  // Führen Sie die zugrunde liegende Aktion aus, die zu einem Datenbank-Handle führt.
  DatabaseHandle* dbHandle = open_database();

  // Erstellen Sie ein neues, leeres JS-Objekt.
  status = napi_create_object(env, &result);
  if (status != napi_ok) return NULL;

  // Taggen Sie das Objekt, um anzuzeigen, dass es einen Zeiger auf ein `DatabaseHandle` enthält.
  status = napi_type_tag_object(env, result, &DatabaseHandleTypeTag);
  if (status != napi_ok) return NULL;

  // Speichern Sie den Zeiger auf die `DatabaseHandle`-Struktur im JS-Objekt.
  status = napi_wrap(env, result, dbHandle, NULL, NULL, NULL);
  if (status != napi_ok) return NULL;

  return result;
}

// Später, wenn wir ein JavaScript-Objekt erhalten, das angeblich ein Datenbank-Handle ist
// können wir `napi_check_object_type_tag()` verwenden, um sicherzustellen, dass es tatsächlich ein solches ist
// Handle.

static napi_value
query(napi_env env, napi_callback_info info) {
  napi_status status;
  size_t argc = 2;
  napi_value argv[2];
  bool is_db_handle;

  status = napi_get_cb_info(env, info, &argc, argv, NULL, NULL);
  if (status != napi_ok) return NULL;

  // Überprüfen Sie, ob das als erster Parameter übergebene Objekt das zuvor
  // angewendete Tag hat.
  status = napi_check_object_type_tag(env,
                                      argv[0],
                                      &DatabaseHandleTypeTag,
                                      &is_db_handle);
  if (status != napi_ok) return NULL;

  // Werfen Sie einen `TypeError`, wenn dies nicht der Fall ist.
  if (!is_db_handle) {
    // Werfen Sie einen TypeError.
    return NULL;
  }
}
```

### `napi_define_class` {#napi_define_class}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

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
- `[in] env`: Die Umgebung, unter der die API aufgerufen wird.
- `[in] utf8name`: Name der JavaScript-Konstruktorfunktion. Zur Klarheit wird empfohlen, den C++-Klassennamen zu verwenden, wenn eine C++-Klasse umschlossen wird.
- `[in] length`: Die Länge von `utf8name` in Bytes oder `NAPI_AUTO_LENGTH`, falls nullterminiert.
- `[in] constructor`: Callback-Funktion, die die Erstellung von Instanzen der Klasse behandelt. Beim Umschließen einer C++-Klasse muss diese Methode ein statisches Element mit der [`napi_callback`](/de/nodejs/api/n-api#napi_callback)-Signatur sein. Ein C++-Klassenkonstruktor kann nicht verwendet werden. [`napi_callback`](/de/nodejs/api/n-api#napi_callback) bietet weitere Details.
- `[in] data`: Optionale Daten, die als `data`-Eigenschaft der Callback-Informationen an den Konstruktor-Callback übergeben werden.
- `[in] property_count`: Anzahl der Elemente im `properties`-Array-Argument.
- `[in] properties`: Array von Eigenschaftsdeskriptoren, die statische und Instanzdateneigenschaften, Accessoren und Methoden der Klasse beschreiben. Siehe `napi_property_descriptor`.
- `[out] result`: Ein `napi_value`, das die Konstruktorfunktion für die Klasse darstellt.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Definiert eine JavaScript-Klasse, einschließlich:

- Eine JavaScript-Konstruktorfunktion, die den Klassennamen hat. Beim Umschließen einer entsprechenden C++-Klasse kann der über `constructor` übergebene Callback verwendet werden, um eine neue C++-Klasseninstanz zu instanziieren, die dann mithilfe von [`napi_wrap`](/de/nodejs/api/n-api#napi_wrap) in die erstellte JavaScript-Objektinstanz eingefügt werden kann.
- Eigenschaften der Konstruktorfunktion, deren Implementierung entsprechende *statische* Dateneigenschaften, Accessoren und Methoden der C++-Klasse aufrufen kann (definiert durch Eigenschaftsdeskriptoren mit dem Attribut `napi_static`).
- Eigenschaften des `prototype`-Objekts der Konstruktorfunktion. Beim Umschließen einer C++-Klasse können *nicht-statische* Dateneigenschaften, Accessoren und Methoden der C++-Klasse von den statischen Funktionen aufgerufen werden, die in den Eigenschaftsdeskriptoren ohne das Attribut `napi_static` angegeben sind, nachdem die C++-Klasseninstanz abgerufen wurde, die mithilfe von [`napi_unwrap`](/de/nodejs/api/n-api#napi_unwrap) in die JavaScript-Objektinstanz eingefügt wurde.

Beim Umschließen einer C++-Klasse sollte der über `constructor` übergebene C++-Konstruktor-Callback eine statische Methode der Klasse sein, die den eigentlichen Klassenkonstruktor aufruft, dann die neue C++-Instanz in ein JavaScript-Objekt einschließt und das Wrapper-Objekt zurückgibt. Siehe [`napi_wrap`](/de/nodejs/api/n-api#napi_wrap) für Details.

Die von [`napi_define_class`](/de/nodejs/api/n-api#napi_define_class) zurückgegebene JavaScript-Konstruktorfunktion wird oft gespeichert und später verwendet, um neue Instanzen der Klasse aus nativem Code zu erstellen und/oder um zu überprüfen, ob bereitgestellte Werte Instanzen der Klasse sind. In diesem Fall kann eine starke persistente Referenz darauf mit [`napi_create_reference`](/de/nodejs/api/n-api#napi_create_reference) erstellt werden, um zu verhindern, dass der Funktionswert garbage-collected wird, wodurch sichergestellt wird, dass die Referenzanzahl >= 1 gehalten wird.

Alle Nicht-`NULL`-Daten, die dieser API über den `data`-Parameter oder über das `data`-Feld der `napi_property_descriptor`-Array-Elemente übergeben werden, können mit dem resultierenden JavaScript-Konstruktor (der im `result`-Parameter zurückgegeben wird) verknüpft und freigegeben werden, wenn die Klasse garbage-collected wird, indem sowohl die JavaScript-Funktion als auch die Daten an [`napi_add_finalizer`](/de/nodejs/api/n-api#napi_add_finalizer) übergeben werden.


### `napi_wrap` {#napi_wrap}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
napi_status napi_wrap(napi_env env,
                      napi_value js_object,
                      void* native_object,
                      napi_finalize finalize_cb,
                      void* finalize_hint,
                      napi_ref* result);
```
- `[in] env`: Die Umgebung, unter der die API aufgerufen wird.
- `[in] js_object`: Das JavaScript-Objekt, das der Wrapper für das native Objekt sein wird.
- `[in] native_object`: Die native Instanz, die in das JavaScript-Objekt eingebettet wird.
- `[in] finalize_cb`: Optionale native Callback-Funktion, die verwendet werden kann, um die native Instanz freizugeben, wenn das JavaScript-Objekt Garbage-Collected wurde. [`napi_finalize`](/de/nodejs/api/n-api#napi_finalize) bietet weitere Details.
- `[in] finalize_hint`: Optionaler kontextbezogener Hinweis, der an die Finalize-Callback-Funktion übergeben wird.
- `[out] result`: Optionale Referenz auf das umschlossene Objekt.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Umschließt eine native Instanz in einem JavaScript-Objekt. Die native Instanz kann später mit `napi_unwrap()` abgerufen werden.

Wenn JavaScript-Code einen Konstruktor für eine Klasse aufruft, die mit `napi_define_class()` definiert wurde, wird der `napi_callback` für den Konstruktor aufgerufen. Nach der Konstruktion einer Instanz der nativen Klasse muss die Callback-Funktion `napi_wrap()` aufrufen, um die neu erstellte Instanz in das bereits erstellte JavaScript-Objekt einzubetten, das das `this`-Argument für die Konstruktor-Callback-Funktion ist. (Dieses `this`-Objekt wurde aus dem `prototype` der Konstruktorfunktion erstellt, sodass es bereits Definitionen aller Instanzeigenschaften und -methoden hat.)

Typischerweise sollte beim Einbetten einer Klasseninstanz eine Finalize-Callback-Funktion bereitgestellt werden, die einfach die native Instanz löscht, die als `data`-Argument an die Finalize-Callback-Funktion übergeben wird.

Die optionale zurückgegebene Referenz ist anfänglich eine schwache Referenz, was bedeutet, dass sie einen Referenzzähler von 0 hat. Typischerweise würde dieser Referenzzähler während asynchroner Operationen, die erfordern, dass die Instanz gültig bleibt, vorübergehend erhöht.

*Vorsicht*: Die optional zurückgegebene Referenz (falls erhalten) sollte NUR als Reaktion auf den Aufruf der Finalize-Callback-Funktion über [`napi_delete_reference`](/de/nodejs/api/n-api#napi_delete_reference) gelöscht werden. Wenn sie vorher gelöscht wird, wird die Finalize-Callback-Funktion möglicherweise nie aufgerufen. Wenn Sie also eine Referenz erhalten, ist auch eine Finalize-Callback-Funktion erforderlich, um eine korrekte Freigabe der Referenz zu ermöglichen.

Finalizer-Callbacks können verzögert werden, wodurch ein Zeitfenster entsteht, in dem das Objekt Garbage-Collected wurde (und die schwache Referenz ungültig ist), aber der Finalizer noch nicht aufgerufen wurde. Wenn Sie `napi_get_reference_value()` auf schwachen Referenzen verwenden, die von `napi_wrap()` zurückgegeben werden, sollten Sie trotzdem ein leeres Ergebnis behandeln.

Der erneute Aufruf von `napi_wrap()` für ein Objekt gibt einen Fehler zurück. Um eine andere native Instanz mit dem Objekt zu verknüpfen, verwenden Sie zuerst `napi_remove_wrap()`.


### `napi_unwrap` {#napi_unwrap}

**Hinzugefügt in: v8.0.0**

**N-API-Version: 1**

```C [C]
napi_status napi_unwrap(napi_env env,
                        napi_value js_object,
                        void** result);
```
- `[in] env`: Die Umgebung, in der die API aufgerufen wird.
- `[in] js_object`: Das Objekt, das der nativen Instanz zugeordnet ist.
- `[out] result`: Zeiger auf die umschlossene native Instanz.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Ruft eine native Instanz ab, die zuvor mithilfe von `napi_wrap()` in ein JavaScript-Objekt eingeschlossen wurde.

Wenn JavaScript-Code eine Methode oder einen Eigenschaftszugriff auf der Klasse aufruft, wird der entsprechende `napi_callback` aufgerufen. Wenn der Callback für eine Instanzmethode oder einen Accessor ist, dann ist das `this`-Argument für den Callback das Wrapper-Objekt; die umschlossene C++-Instanz, die das Ziel des Aufrufs ist, kann dann durch Aufrufen von `napi_unwrap()` auf dem Wrapper-Objekt abgerufen werden.

### `napi_remove_wrap` {#napi_remove_wrap}

**Hinzugefügt in: v8.5.0**

**N-API-Version: 1**

```C [C]
napi_status napi_remove_wrap(napi_env env,
                             napi_value js_object,
                             void** result);
```
- `[in] env`: Die Umgebung, in der die API aufgerufen wird.
- `[in] js_object`: Das Objekt, das der nativen Instanz zugeordnet ist.
- `[out] result`: Zeiger auf die umschlossene native Instanz.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Ruft eine native Instanz ab, die zuvor mithilfe von `napi_wrap()` in das JavaScript-Objekt `js_object` eingeschlossen wurde, und entfernt die Umschließung. Wenn ein Finalize-Callback mit der Umschließung verknüpft war, wird er nicht mehr aufgerufen, wenn das JavaScript-Objekt als Garbage eingesammelt wird.

### `napi_type_tag_object` {#napi_type_tag_object}

**Hinzugefügt in: v14.8.0, v12.19.0**

**N-API-Version: 8**

```C [C]
napi_status napi_type_tag_object(napi_env env,
                                 napi_value js_object,
                                 const napi_type_tag* type_tag);
```
- `[in] env`: Die Umgebung, in der die API aufgerufen wird.
- `[in] js_object`: Das JavaScript-Objekt oder [extern](/de/nodejs/api/n-api#napi_create_external), das markiert werden soll.
- `[in] type_tag`: Das Tag, mit dem das Objekt markiert werden soll.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Ordnet den Wert des `type_tag`-Zeigers dem JavaScript-Objekt oder [externen](/de/nodejs/api/n-api#napi_create_external) Objekt zu. `napi_check_object_type_tag()` kann dann verwendet werden, um das Tag, das dem Objekt zugewiesen wurde, mit einem Tag zu vergleichen, das dem Addon gehört, um sicherzustellen, dass das Objekt den richtigen Typ hat.

Wenn dem Objekt bereits ein Typ-Tag zugeordnet ist, gibt diese API `napi_invalid_arg` zurück.


### `napi_check_object_type_tag` {#napi_check_object_type_tag}

**Hinzugefügt in: v14.8.0, v12.19.0**

**N-API Version: 8**

```C [C]
napi_status napi_check_object_type_tag(napi_env env,
                                       napi_value js_object,
                                       const napi_type_tag* type_tag,
                                       bool* result);
```
- `[in] env`: Die Umgebung, unter der die API aufgerufen wird.
- `[in] js_object`: Das JavaScript-Objekt oder [externe](/de/nodejs/api/n-api#napi_create_external) Objekt, dessen Typ-Tag untersucht werden soll.
- `[in] type_tag`: Das Tag, mit dem ein auf dem Objekt gefundenes Tag verglichen werden soll.
- `[out] result`: Ob das angegebene Typ-Tag mit dem Typ-Tag des Objekts übereinstimmt. `false` wird auch zurückgegeben, wenn kein Typ-Tag auf dem Objekt gefunden wurde.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Vergleicht den als `type_tag` angegebenen Zeiger mit allen, die auf `js_object` gefunden werden können. Wenn kein Tag auf `js_object` gefunden wird oder wenn ein Tag gefunden wird, der aber nicht mit `type_tag` übereinstimmt, wird `result` auf `false` gesetzt. Wenn ein Tag gefunden wird und dieser mit `type_tag` übereinstimmt, wird `result` auf `true` gesetzt.

### `napi_add_finalizer` {#napi_add_finalizer}

**Hinzugefügt in: v8.0.0**

**N-API Version: 5**

```C [C]
napi_status napi_add_finalizer(napi_env env,
                               napi_value js_object,
                               void* finalize_data,
                               node_api_basic_finalize finalize_cb,
                               void* finalize_hint,
                               napi_ref* result);
```
- `[in] env`: Die Umgebung, unter der die API aufgerufen wird.
- `[in] js_object`: Das JavaScript-Objekt, an das die nativen Daten angehängt werden.
- `[in] finalize_data`: Optionale Daten, die an `finalize_cb` übergeben werden sollen.
- `[in] finalize_cb`: Nativer Callback, der verwendet wird, um die nativen Daten freizugeben, wenn das JavaScript-Objekt per Garbage Collection entsorgt wurde. [`napi_finalize`](/de/nodejs/api/n-api#napi_finalize) enthält weitere Details.
- `[in] finalize_hint`: Optionaler kontextbezogener Hinweis, der an den Finalize-Callback übergeben wird.
- `[out] result`: Optionale Referenz auf das JavaScript-Objekt.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Fügt einen `napi_finalize`-Callback hinzu, der aufgerufen wird, wenn das JavaScript-Objekt in `js_object` per Garbage Collection entsorgt wurde.

Diese API kann mehrmals auf einem einzelnen JavaScript-Objekt aufgerufen werden.

*Achtung*: Die optionale zurückgegebene Referenz (falls erhalten) sollte NUR als Reaktion auf den Aufruf des Finalize-Callbacks über [`napi_delete_reference`](/de/nodejs/api/n-api#napi_delete_reference) gelöscht werden. Wenn sie vorher gelöscht wird, wird der Finalize-Callback möglicherweise nie aufgerufen. Wenn man also eine Referenz erhält, ist auch ein Finalize-Callback erforderlich, um die korrekte Entsorgung der Referenz zu ermöglichen.


#### `node_api_post_finalizer` {#node_api_post_finalizer}

**Hinzugefügt in: v21.0.0, v20.10.0, v18.19.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

```C [C]
napi_status node_api_post_finalizer(node_api_basic_env env,
                                    napi_finalize finalize_cb,
                                    void* finalize_data,
                                    void* finalize_hint);
```
- `[in] env`: Die Umgebung, in der die API aufgerufen wird.
- `[in] finalize_cb`: Nativer Callback, der verwendet wird, um die nativen Daten freizugeben, wenn das JavaScript-Objekt per Garbage Collection entsorgt wurde. [`napi_finalize`](/de/nodejs/api/n-api#napi_finalize) enthält weitere Details.
- `[in] finalize_data`: Optionale Daten, die an `finalize_cb` übergeben werden sollen.
- `[in] finalize_hint`: Optionaler kontextbezogener Hinweis, der an den Finalisierungs-Callback übergeben wird.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Plant einen `napi_finalize`-Callback, der asynchron in der Ereignisschleife aufgerufen wird.

Normalerweise werden Finalizer aufgerufen, während der GC (Garbage Collector) Objekte sammelt. An diesem Punkt ist das Aufrufen jeglicher Node-API, die Änderungen im GC-Zustand verursachen könnte, deaktiviert und führt zum Absturz von Node.js.

`node_api_post_finalizer` hilft, diese Einschränkung zu umgehen, indem es dem Add-on ermöglicht, Aufrufe an solche Node-APIs auf einen Zeitpunkt außerhalb der GC-Finalisierung zu verschieben.

## Einfache asynchrone Operationen {#simple-asynchronous-operations}

Add-on-Module müssen oft asynchrone Helfer von libuv als Teil ihrer Implementierung nutzen. Dies ermöglicht es ihnen, Arbeit zu planen, die asynchron ausgeführt werden soll, sodass ihre Methoden zurückkehren können, bevor die Arbeit abgeschlossen ist. Dies ermöglicht es ihnen, die Gesamtausführung der Node.js-Anwendung nicht zu blockieren.

Node-API bietet eine ABI-stabile Schnittstelle für diese unterstützenden Funktionen, die die häufigsten asynchronen Anwendungsfälle abdeckt.

Node-API definiert die Struktur `napi_async_work`, die zur Verwaltung asynchroner Worker verwendet wird. Instanzen werden mit [`napi_create_async_work`](/de/nodejs/api/n-api#napi_create_async_work) und [`napi_delete_async_work`](/de/nodejs/api/n-api#napi_delete_async_work) erstellt/gelöscht.

Die Callbacks `execute` und `complete` sind Funktionen, die aufgerufen werden, wenn der Executor bereit ist, die Ausführung zu starten, und wenn er seine Aufgabe abgeschlossen hat.

Die Funktion `execute` sollte es vermeiden, Node-API-Aufrufe zu tätigen, die zur Ausführung von JavaScript oder zur Interaktion mit JavaScript-Objekten führen könnten. Meistens sollte jeglicher Code, der Node-API-Aufrufe tätigen muss, stattdessen im `complete`-Callback erfolgen. Vermeiden Sie die Verwendung des Parameters `napi_env` im Execute-Callback, da dies wahrscheinlich JavaScript ausführt.

Diese Funktionen implementieren die folgenden Schnittstellen:

```C [C]
typedef void (*napi_async_execute_callback)(napi_env env,
                                            void* data);
typedef void (*napi_async_complete_callback)(napi_env env,
                                             napi_status status,
                                             void* data);
```
Wenn diese Methoden aufgerufen werden, ist der übergebene Parameter `data` der vom Add-on bereitgestellte `void*`-Datenwert, der in den `napi_create_async_work`-Aufruf übergeben wurde.

Sobald der asynchrone Worker erstellt wurde, kann er mit der Funktion [`napi_queue_async_work`](/de/nodejs/api/n-api#napi_queue_async_work) zur Ausführung in die Warteschlange gestellt werden:

```C [C]
napi_status napi_queue_async_work(node_api_basic_env env,
                                  napi_async_work work);
```
[`napi_cancel_async_work`](/de/nodejs/api/n-api#napi_cancel_async_work) kann verwendet werden, wenn die Arbeit abgebrochen werden muss, bevor die Ausführung begonnen hat.

Nach dem Aufruf von [`napi_cancel_async_work`](/de/nodejs/api/n-api#napi_cancel_async_work) wird der `complete`-Callback mit dem Statuswert `napi_cancelled` aufgerufen. Die Arbeit sollte nicht vor dem Aufruf des `complete`-Callbacks gelöscht werden, auch wenn sie abgebrochen wurde.


### `napi_create_async_work` {#napi_create_async_work}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v8.6.0 | Parameter `async_resource` und `async_resource_name` hinzugefügt. |
| v8.0.0 | Hinzugefügt in: v8.0.0 |
:::

**N-API-Version: 1**

```C [C]
napi_status napi_create_async_work(napi_env env,
                                   napi_value async_resource,
                                   napi_value async_resource_name,
                                   napi_async_execute_callback execute,
                                   napi_async_complete_callback complete,
                                   void* data,
                                   napi_async_work* result);
```
- `[in] env`: Die Umgebung, unter der die API aufgerufen wird.
- `[in] async_resource`: Ein optionales Objekt, das mit der asynchronen Arbeit verknüpft ist und an mögliche `async_hooks` [`init`-Hooks](/de/nodejs/api/async_hooks#initasyncid-type-triggerasyncid-resource) übergeben wird.
- `[in] async_resource_name`: Kennung für die Art der Ressource, die für Diagnoseinformationen bereitgestellt wird, die von der `async_hooks`-API verfügbar gemacht werden.
- `[in] execute`: Die native Funktion, die aufgerufen werden soll, um die Logik asynchron auszuführen. Die angegebene Funktion wird von einem Worker-Pool-Thread aufgerufen und kann parallel zum Haupt-Event-Loop-Thread ausgeführt werden.
- `[in] complete`: Die native Funktion, die aufgerufen wird, wenn die asynchrone Logik abgeschlossen oder abgebrochen wird. Die angegebene Funktion wird vom Haupt-Event-Loop-Thread aufgerufen. [`napi_async_complete_callback`](/de/nodejs/api/n-api#napi_async_complete_callback) bietet weitere Details.
- `[in] data`: Benutzerdefinierter Datenkontext. Dieser wird zurück an die Execute- und Complete-Funktionen übergeben.
- `[out] result`: `napi_async_work*`, das der Handle für die neu erstellte asynchrone Arbeit ist.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API weist ein Arbeitsobjekt zu, das zum asynchronen Ausführen von Logik verwendet wird. Es sollte mit [`napi_delete_async_work`](/de/nodejs/api/n-api#napi_delete_async_work) freigegeben werden, sobald die Arbeit nicht mehr erforderlich ist.

`async_resource_name` sollte ein Null-terminierter, UTF-8-codierter String sein.

Die Kennung `async_resource_name` wird vom Benutzer bereitgestellt und sollte repräsentativ für die Art der ausgeführten asynchronen Arbeit sein. Es wird auch empfohlen, Namespaces auf die Kennung anzuwenden, z. B. durch Einbeziehen des Modulnamens. Weitere Informationen finden Sie in der [`async_hooks`-Dokumentation](/de/nodejs/api/async_hooks#type).


### `napi_delete_async_work` {#napi_delete_async_work}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
napi_status napi_delete_async_work(napi_env env,
                                   napi_async_work work);
```
- `[in] env`: Die Umgebung, unter der die API aufgerufen wird.
- `[in] work`: Der Handle, der vom Aufruf von `napi_create_async_work` zurückgegeben wird.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API gibt ein zuvor zugewiesenes Arbeitsobjekt frei.

Diese API kann auch dann aufgerufen werden, wenn eine ausstehende JavaScript-Ausnahme vorliegt.

### `napi_queue_async_work` {#napi_queue_async_work}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
napi_status napi_queue_async_work(node_api_basic_env env,
                                  napi_async_work work);
```
- `[in] env`: Die Umgebung, unter der die API aufgerufen wird.
- `[in] work`: Der Handle, der vom Aufruf von `napi_create_async_work` zurückgegeben wird.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API fordert an, dass die zuvor zugewiesene Arbeit zur Ausführung eingeplant wird. Sobald sie erfolgreich zurückkehrt, darf diese API nicht erneut mit demselben `napi_async_work`-Element aufgerufen werden, da das Ergebnis undefiniert ist.

### `napi_cancel_async_work` {#napi_cancel_async_work}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
napi_status napi_cancel_async_work(node_api_basic_env env,
                                   napi_async_work work);
```
- `[in] env`: Die Umgebung, unter der die API aufgerufen wird.
- `[in] work`: Der Handle, der vom Aufruf von `napi_create_async_work` zurückgegeben wird.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API bricht die in die Warteschlange eingereihte Arbeit ab, wenn sie noch nicht gestartet wurde. Wenn die Ausführung bereits begonnen hat, kann sie nicht abgebrochen werden und `napi_generic_failure` wird zurückgegeben. Im Erfolgsfall wird der `complete`-Callback mit einem Statuswert von `napi_cancelled` aufgerufen. Die Arbeit sollte nicht vor dem Aufruf des `complete`-Callbacks gelöscht werden, auch wenn sie erfolgreich abgebrochen wurde.

Diese API kann auch dann aufgerufen werden, wenn eine ausstehende JavaScript-Ausnahme vorliegt.

## Benutzerdefinierte asynchrone Operationen {#custom-asynchronous-operations}

Die einfachen asynchronen Arbeits-APIs oben sind möglicherweise nicht für jedes Szenario geeignet. Wenn Sie einen anderen asynchronen Mechanismus verwenden, sind die folgenden APIs erforderlich, um sicherzustellen, dass eine asynchrone Operation ordnungsgemäß von der Laufzeit verfolgt wird.


### `napi_async_init` {#napi_async_init}

**Hinzugefügt in: v8.6.0**

**N-API Version: 1**

```C [C]
napi_status napi_async_init(napi_env env,
                            napi_value async_resource,
                            napi_value async_resource_name,
                            napi_async_context* result)
```
- `[in] env`: Die Umgebung, unter der die API aufgerufen wird.
- `[in] async_resource`: Objekt, das mit der asynchronen Arbeit verbunden ist und an mögliche `async_hooks` [`init`-Hooks](/de/nodejs/api/async_hooks#initasyncid-type-triggerasyncid-resource) übergeben wird und über [`async_hooks.executionAsyncResource()`](/de/nodejs/api/async_hooks#async_hooksexecutionasyncresource) darauf zugegriffen werden kann.
- `[in] async_resource_name`: Bezeichner für die Art der Ressource, die für Diagnoseinformationen bereitgestellt wird, die von der `async_hooks`-API verfügbar gemacht werden.
- `[out] result`: Der initialisierte asynchrone Kontext.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Das `async_resource`-Objekt muss bis zu [`napi_async_destroy`](/de/nodejs/api/n-api#napi_async_destroy) aktiv gehalten werden, damit die `async_hooks`-bezogene API korrekt funktioniert. Um die ABI-Kompatibilität mit früheren Versionen beizubehalten, verwalten `napi_async_context`s nicht die starke Referenz auf die `async_resource`-Objekte, um das Einführen von Speicherlecks zu vermeiden. Wenn die `async_resource` jedoch von der JavaScript-Engine Garbage-Collection durchgeführt wird, bevor der `napi_async_context` durch `napi_async_destroy` zerstört wurde, kann der Aufruf von `napi_async_context`-bezogenen APIs wie [`napi_open_callback_scope`](/de/nodejs/api/n-api#napi_open_callback_scope) und [`napi_make_callback`](/de/nodejs/api/n-api#napi_make_callback) Probleme wie den Verlust des asynchronen Kontexts verursachen, wenn die `AsyncLocalStorage`-API verwendet wird.

Um die ABI-Kompatibilität mit früheren Versionen beizubehalten, führt das Übergeben von `NULL` für `async_resource` nicht zu einem Fehler. Dies wird jedoch nicht empfohlen, da dies zu unerwünschtem Verhalten mit `async_hooks` [`init`-Hooks](/de/nodejs/api/async_hooks#initasyncid-type-triggerasyncid-resource) und `async_hooks.executionAsyncResource()` führt, da die Ressource jetzt von der zugrunde liegenden `async_hooks`-Implementierung benötigt wird, um die Verknüpfung zwischen asynchronen Rückrufen herzustellen.


### `napi_async_destroy` {#napi_async_destroy}

**Hinzugefügt in: v8.6.0**

**N-API Version: 1**

```C [C]
napi_status napi_async_destroy(napi_env env,
                               napi_async_context async_context);
```
- `[in] env`: Die Umgebung, unter der die API aufgerufen wird.
- `[in] async_context`: Der asynchrone Kontext, der zerstört werden soll.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API kann auch dann aufgerufen werden, wenn eine ausstehende JavaScript-Ausnahme vorliegt.

### `napi_make_callback` {#napi_make_callback}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v8.6.0 | Parameter `async_context` hinzugefügt. |
| v8.0.0 | Hinzugefügt in: v8.0.0 |
:::

**N-API Version: 1**

```C [C]
NAPI_EXTERN napi_status napi_make_callback(napi_env env,
                                           napi_async_context async_context,
                                           napi_value recv,
                                           napi_value func,
                                           size_t argc,
                                           const napi_value* argv,
                                           napi_value* result);
```
- `[in] env`: Die Umgebung, unter der die API aufgerufen wird.
- `[in] async_context`: Kontext für die asynchrone Operation, die den Callback aufruft. Dies sollte normalerweise ein Wert sein, der zuvor von [`napi_async_init`](/de/nodejs/api/n-api#napi_async_init) erhalten wurde. Um die ABI-Kompatibilität mit früheren Versionen beizubehalten, führt das Übergeben von `NULL` für `async_context` nicht zu einem Fehler. Dies führt jedoch zu einer fehlerhaften Funktionsweise von asynchronen Hooks. Mögliche Probleme umfassen den Verlust des asynchronen Kontexts bei Verwendung der `AsyncLocalStorage` API.
- `[in] recv`: Der `this`-Wert, der an die aufgerufene Funktion übergeben wird.
- `[in] func`: `napi_value`, die die aufzurufende JavaScript-Funktion darstellt.
- `[in] argc`: Die Anzahl der Elemente im `argv`-Array.
- `[in] argv`: Array von JavaScript-Werten als `napi_value`, die die Argumente für die Funktion darstellen. Wenn `argc` Null ist, kann dieser Parameter durch Übergabe von `NULL` weggelassen werden.
- `[out] result`: `napi_value`, die das zurückgegebene JavaScript-Objekt darstellt.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese Methode ermöglicht den Aufruf eines JavaScript-Funktionsobjekts von einem nativen Add-on. Diese API ähnelt `napi_call_function`. Sie wird jedoch verwendet, um *aus* nativem Code *zurück* in JavaScript *nach* der Rückkehr von einer asynchronen Operation aufzurufen (wenn sich kein anderes Skript auf dem Stack befindet). Es ist ein relativ einfacher Wrapper um `node::MakeCallback`.

Beachten Sie, dass es *nicht* notwendig ist, `napi_make_callback` innerhalb eines `napi_async_complete_callback` zu verwenden; in dieser Situation wurde der asynchrone Kontext des Callback bereits eingerichtet, so dass ein direkter Aufruf von `napi_call_function` ausreichend und angemessen ist. Die Verwendung der Funktion `napi_make_callback` kann erforderlich sein, wenn benutzerdefiniertes asynchrones Verhalten implementiert wird, das `napi_create_async_work` nicht verwendet.

Alle `process.nextTick`s oder Promises, die von JavaScript während des Callbacks in die Microtask-Warteschlange eingeplant werden, werden ausgeführt, bevor zur C/C++-Umgebung zurückgekehrt wird.


### `napi_open_callback_scope` {#napi_open_callback_scope}

**Hinzugefügt in: v9.6.0**

**N-API Version: 3**

```C [C]
NAPI_EXTERN napi_status napi_open_callback_scope(napi_env env,
                                                 napi_value resource_object,
                                                 napi_async_context context,
                                                 napi_callback_scope* result)
```
- `[in] env`: Die Umgebung, unter der die API aufgerufen wird.
- `[in] resource_object`: Ein Objekt, das mit der asynchronen Arbeit verbunden ist und an mögliche `async_hooks` [`init` Hooks](/de/nodejs/api/async_hooks#initasyncid-type-triggerasyncid-resource) übergeben wird. Dieser Parameter ist veraltet und wird zur Laufzeit ignoriert. Verwenden Sie stattdessen den Parameter `async_resource` in [`napi_async_init`](/de/nodejs/api/n-api#napi_async_init).
- `[in] context`: Kontext für die asynchrone Operation, die den Callback aufruft. Dies sollte ein Wert sein, der zuvor von [`napi_async_init`](/de/nodejs/api/n-api#napi_async_init) abgerufen wurde.
- `[out] result`: Der neu erstellte Scope.

Es gibt Fälle (z. B. das Auflösen von Promises), in denen es notwendig ist, den entsprechenden Scope, der mit einem Callback verbunden ist, bei bestimmten Node-API-Aufrufen zu haben. Wenn sich kein anderes Skript im Stack befindet, können die Funktionen [`napi_open_callback_scope`](/de/nodejs/api/n-api#napi_open_callback_scope) und [`napi_close_callback_scope`](/de/nodejs/api/n-api#napi_close_callback_scope) verwendet werden, um den erforderlichen Scope zu öffnen/schließen.

### `napi_close_callback_scope` {#napi_close_callback_scope}

**Hinzugefügt in: v9.6.0**

**N-API Version: 3**

```C [C]
NAPI_EXTERN napi_status napi_close_callback_scope(napi_env env,
                                                  napi_callback_scope scope)
```
- `[in] env`: Die Umgebung, unter der die API aufgerufen wird.
- `[in] scope`: Der zu schließende Scope.

Diese API kann aufgerufen werden, auch wenn eine ausstehende JavaScript-Exception vorliegt.

## Versionsverwaltung {#version-management}

### `napi_get_node_version` {#napi_get_node_version}

**Hinzugefügt in: v8.4.0**

**N-API Version: 1**

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
- `[in] env`: Die Umgebung, unter der die API aufgerufen wird.
- `[out] version`: Ein Zeiger auf Versionsinformationen für Node.js selbst.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese Funktion füllt die `version`-Struktur mit der Major-, Minor- und Patch-Version von Node.js, die gerade ausgeführt wird, und das `release`-Feld mit dem Wert von [`process.release.name`](/de/nodejs/api/process#processrelease).

Der zurückgegebene Puffer ist statisch alloziert und muss nicht freigegeben werden.


### `napi_get_version` {#napi_get_version}

**Hinzugefügt in: v8.0.0**

**N-API Version: 1**

```C [C]
napi_status napi_get_version(node_api_basic_env env,
                             uint32_t* result);
```
- `[in] env`: Die Umgebung, unter der die API aufgerufen wird.
- `[out] result`: Die höchste unterstützte Node-API-Version.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API gibt die höchste von der Node.js-Laufzeit unterstützte Node-API-Version zurück. Node-API ist additiv geplant, sodass neuere Node.js-Versionen möglicherweise zusätzliche API-Funktionen unterstützen. Um einem Add-on die Verwendung einer neueren Funktion zu ermöglichen, wenn es mit Node.js-Versionen ausgeführt wird, die sie unterstützen, und gleichzeitig Fallback-Verhalten bereitzustellen, wenn es mit Node.js-Versionen ausgeführt wird, die sie nicht unterstützen:

- Rufen Sie `napi_get_version()` auf, um zu bestimmen, ob die API verfügbar ist.
- Wenn verfügbar, laden Sie dynamisch einen Zeiger auf die Funktion mit `uv_dlsym()`.
- Verwenden Sie den dynamisch geladenen Zeiger, um die Funktion aufzurufen.
- Wenn die Funktion nicht verfügbar ist, stellen Sie eine alternative Implementierung bereit, die die Funktion nicht verwendet.

## Speicherverwaltung {#memory-management}

### `napi_adjust_external_memory` {#napi_adjust_external_memory}

**Hinzugefügt in: v8.5.0**

**N-API Version: 1**

```C [C]
NAPI_EXTERN napi_status napi_adjust_external_memory(node_api_basic_env env,
                                                    int64_t change_in_bytes,
                                                    int64_t* result);
```
- `[in] env`: Die Umgebung, unter der die API aufgerufen wird.
- `[in] change_in_bytes`: Die Änderung des extern zugewiesenen Speichers, der von JavaScript-Objekten am Leben erhalten wird.
- `[out] result`: Der angepasste Wert

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese Funktion gibt V8 einen Hinweis auf die Menge des extern zugewiesenen Speichers, der von JavaScript-Objekten am Leben erhalten wird (d. h. ein JavaScript-Objekt, das auf seinen eigenen, von einem nativen Add-on zugewiesenen Speicher verweist). Die Registrierung von extern zugewiesenem Speicher löst globale Garbage Collections häufiger aus als sonst.

## Promises {#promises}

Node-API bietet Funktionen zum Erstellen von `Promise`-Objekten, wie in [Abschnitt 25.4](https://tc39.github.io/ecma262/#sec-promise-objects) der ECMA-Spezifikation beschrieben. Es implementiert Promises als ein Paar von Objekten. Wenn ein Promise von `napi_create_promise()` erstellt wird, wird ein "Deferred"-Objekt erstellt und zusammen mit dem `Promise` zurückgegeben. Das Deferred-Objekt ist an das erstellte `Promise` gebunden und ist das einzige Mittel, um das `Promise` mit `napi_resolve_deferred()` oder `napi_reject_deferred()` aufzulösen oder abzulehnen. Das von `napi_create_promise()` erstellte Deferred-Objekt wird von `napi_resolve_deferred()` oder `napi_reject_deferred()` freigegeben. Das `Promise`-Objekt kann an JavaScript zurückgegeben werden, wo es wie üblich verwendet werden kann.

Zum Beispiel, um ein Promise zu erstellen und es an einen asynchronen Worker zu übergeben:

```C [C]
napi_deferred deferred;
napi_value promise;
napi_status status;

// Erstelle das Promise.
status = napi_create_promise(env, &deferred, &promise);
if (status != napi_ok) return NULL;

// Übergebe das Deferred an eine Funktion, die eine asynchrone Aktion ausführt.
do_something_asynchronous(deferred);

// Gib das Promise an JS zurück
return promise;
```
Die obige Funktion `do_something_asynchronous()` würde ihre asynchrone Aktion ausführen und dann das Deferred auflösen oder ablehnen, wodurch das Promise abgeschlossen und das Deferred freigegeben wird:

```C [C]
napi_deferred deferred;
napi_value undefined;
napi_status status;

// Erstelle einen Wert, mit dem das Deferred abgeschlossen werden kann.
status = napi_get_undefined(env, &undefined);
if (status != napi_ok) return NULL;

// Löse oder lehne das mit dem Deferred verbundene Promise ab, abhängig davon,
// ob die asynchrone Aktion erfolgreich war.
if (asynchronous_action_succeeded) {
  status = napi_resolve_deferred(env, deferred, undefined);
} else {
  status = napi_reject_deferred(env, deferred, undefined);
}
if (status != napi_ok) return NULL;

// An diesem Punkt wurde das Deferred freigegeben, daher sollten wir es auf NULL setzen.
deferred = NULL;
```

### `napi_create_promise` {#napi_create_promise}

**Hinzugefügt in: v8.5.0**

**N-API Version: 1**

```C [C]
napi_status napi_create_promise(napi_env env,
                                napi_deferred* deferred,
                                napi_value* promise);
```
- `[in] env`: Die Umgebung, in der die API aufgerufen wird.
- `[out] deferred`: Ein neu erstelltes Deferred-Objekt, das später an `napi_resolve_deferred()` oder `napi_reject_deferred()` übergeben werden kann, um die zugehörige Promise aufzulösen bzw. abzulehnen.
- `[out] promise`: Die JavaScript-Promise, die dem Deferred-Objekt zugeordnet ist.

Gibt `napi_ok` zurück, wenn die API erfolgreich war.

Diese API erstellt ein Deferred-Objekt und eine JavaScript-Promise.

### `napi_resolve_deferred` {#napi_resolve_deferred}

**Hinzugefügt in: v8.5.0**

**N-API Version: 1**

```C [C]
napi_status napi_resolve_deferred(napi_env env,
                                  napi_deferred deferred,
                                  napi_value resolution);
```
- `[in] env`: Die Umgebung, in der die API aufgerufen wird.
- `[in] deferred`: Das Deferred-Objekt, dessen zugeordnete Promise aufgelöst werden soll.
- `[in] resolution`: Der Wert, mit dem die Promise aufgelöst werden soll.

Diese API löst eine JavaScript-Promise über das Deferred-Objekt auf, dem sie zugeordnet ist. Daher kann sie nur verwendet werden, um JavaScript-Promises aufzulösen, für die das entsprechende Deferred-Objekt verfügbar ist. Dies bedeutet effektiv, dass die Promise mit `napi_create_promise()` erstellt worden sein muss und das von diesem Aufruf zurückgegebene Deferred-Objekt aufbewahrt werden muss, um an diese API übergeben zu werden.

Das Deferred-Objekt wird nach erfolgreichem Abschluss freigegeben.

### `napi_reject_deferred` {#napi_reject_deferred}

**Hinzugefügt in: v8.5.0**

**N-API Version: 1**

```C [C]
napi_status napi_reject_deferred(napi_env env,
                                 napi_deferred deferred,
                                 napi_value rejection);
```
- `[in] env`: Die Umgebung, in der die API aufgerufen wird.
- `[in] deferred`: Das Deferred-Objekt, dessen zugeordnete Promise aufgelöst werden soll.
- `[in] rejection`: Der Wert, mit dem die Promise abgelehnt werden soll.

Diese API lehnt eine JavaScript-Promise über das Deferred-Objekt ab, dem sie zugeordnet ist. Daher kann sie nur verwendet werden, um JavaScript-Promises abzulehnen, für die das entsprechende Deferred-Objekt verfügbar ist. Dies bedeutet effektiv, dass die Promise mit `napi_create_promise()` erstellt worden sein muss und das von diesem Aufruf zurückgegebene Deferred-Objekt aufbewahrt werden muss, um an diese API übergeben zu werden.

Das Deferred-Objekt wird nach erfolgreichem Abschluss freigegeben.


### `napi_is_promise` {#napi_is_promise}

**Hinzugefügt in: v8.5.0**

**N-API Version: 1**

```C [C]
napi_status napi_is_promise(napi_env env,
                            napi_value value,
                            bool* is_promise);
```
- `[in] env`: Die Umgebung, unter der die API aufgerufen wird.
- `[in] value`: Der zu untersuchende Wert.
- `[out] is_promise`: Flagge, die angibt, ob `promise` ein natives Promise-Objekt ist (d. h. ein Promise-Objekt, das von der zugrunde liegenden Engine erstellt wurde).

## Skriptausführung {#script-execution}

Node-API bietet eine API zum Ausführen einer Zeichenfolge, die JavaScript enthält, mithilfe der zugrunde liegenden JavaScript-Engine.

### `napi_run_script` {#napi_run_script}

**Hinzugefügt in: v8.5.0**

**N-API Version: 1**

```C [C]
NAPI_EXTERN napi_status napi_run_script(napi_env env,
                                        napi_value script,
                                        napi_value* result);
```
- `[in] env`: Die Umgebung, unter der die API aufgerufen wird.
- `[in] script`: Eine JavaScript-Zeichenfolge, die das auszuführende Skript enthält.
- `[out] result`: Der Wert, der aus der Ausführung des Skripts resultiert.

Diese Funktion führt eine Zeichenfolge mit JavaScript-Code aus und gibt ihr Ergebnis mit den folgenden Einschränkungen zurück:

- Anders als `eval` erlaubt diese Funktion dem Skript keinen Zugriff auf den aktuellen lexikalischen Gültigkeitsbereich und erlaubt daher auch keinen Zugriff auf den [Modulbereich](/de/nodejs/api/modules#the-module-scope), was bedeutet, dass Pseudo-Globale wie `require` nicht verfügbar sind.
- Das Skript kann auf den [globalen Gültigkeitsbereich](/de/nodejs/api/globals) zugreifen. Funktions- und `var`-Deklarationen im Skript werden dem Objekt [`global`](/de/nodejs/api/globals#global) hinzugefügt. Variablendeklarationen mit `let` und `const` sind global sichtbar, werden aber nicht dem Objekt [`global`](/de/nodejs/api/globals#global) hinzugefügt.
- Der Wert von `this` ist [`global`](/de/nodejs/api/globals#global) innerhalb des Skripts.

## libuv-Ereignisschleife {#libuv-event-loop}

Node-API bietet eine Funktion zum Abrufen der aktuellen Ereignisschleife, die einer bestimmten `napi_env` zugeordnet ist.

### `napi_get_uv_event_loop` {#napi_get_uv_event_loop}

**Hinzugefügt in: v9.3.0, v8.10.0**

**N-API Version: 2**

```C [C]
NAPI_EXTERN napi_status napi_get_uv_event_loop(node_api_basic_env env,
                                               struct uv_loop_s** loop);
```
- `[in] env`: Die Umgebung, unter der die API aufgerufen wird.
- `[out] loop`: Die aktuelle libuv-Loop-Instanz.

Hinweis: Obwohl libuv im Laufe der Zeit relativ stabil war, bietet es keine Garantie für ABI-Stabilität. Die Verwendung dieser Funktion sollte vermieden werden. Ihre Verwendung kann zu einem Addon führen, das nicht über verschiedene Node.js-Versionen hinweg funktioniert. [asynchronous-thread-safe-function-calls](/de/nodejs/api/n-api#asynchronous-thread-safe-function-calls) sind eine Alternative für viele Anwendungsfälle.


## Asynchrone, threadsichere Funktionsaufrufe {#asynchronous-thread-safe-function-calls}

JavaScript-Funktionen können normalerweise nur vom Hauptthread eines nativen Add-ons aufgerufen werden. Wenn ein Add-on zusätzliche Threads erstellt, dürfen Node-API-Funktionen, die ein `napi_env`, `napi_value` oder `napi_ref` benötigen, nicht von diesen Threads aufgerufen werden.

Wenn ein Add-on zusätzliche Threads hat und JavaScript-Funktionen aufgerufen werden müssen, basierend auf der Verarbeitung durch diese Threads, müssen diese Threads mit dem Hauptthread des Add-ons kommunizieren, damit der Hauptthread die JavaScript-Funktion in ihrem Namen aufrufen kann. Die Thread-Safe-Funktions-APIs bieten eine einfache Möglichkeit, dies zu tun.

Diese APIs stellen den Typ `napi_threadsafe_function` sowie APIs zum Erstellen, Zerstören und Aufrufen von Objekten dieses Typs bereit. `napi_create_threadsafe_function()` erstellt eine persistente Referenz auf einen `napi_value`, der eine JavaScript-Funktion enthält, die von mehreren Threads aufgerufen werden kann. Die Aufrufe erfolgen asynchron. Dies bedeutet, dass Werte, mit denen der JavaScript-Callback aufgerufen werden soll, in eine Warteschlange gestellt werden und für jeden Wert in der Warteschlange schließlich ein Aufruf an die JavaScript-Funktion erfolgt.

Bei der Erstellung einer `napi_threadsafe_function` kann ein `napi_finalize`-Callback bereitgestellt werden. Dieser Callback wird im Hauptthread aufgerufen, wenn die Thread-Safe-Funktion zerstört werden soll. Er empfängt den Kontext und die Finalize-Daten, die während der Konstruktion angegeben wurden, und bietet die Möglichkeit, nach den Threads aufzuräumen, z. B. durch Aufrufen von `uv_thread_join()`. **Abgesehen vom Haupt-Loop-Thread sollten keine Threads die Thread-Safe-Funktion verwenden, nachdem der Finalize-Callback abgeschlossen ist.**

Der Kontext, der während des Aufrufs von `napi_create_threadsafe_function()` angegeben wird, kann von jedem Thread mit einem Aufruf von `napi_get_threadsafe_function_context()` abgerufen werden.

### Aufrufen einer Thread-Safe-Funktion {#calling-a-thread-safe-function}

`napi_call_threadsafe_function()` kann verwendet werden, um einen Aufruf in JavaScript zu initiieren. `napi_call_threadsafe_function()` akzeptiert einen Parameter, der steuert, ob sich die API blockierend verhält. Wenn auf `napi_tsfn_nonblocking` gesetzt, verhält sich die API nicht-blockierend und gibt `napi_queue_full` zurück, wenn die Warteschlange voll war, wodurch verhindert wird, dass Daten erfolgreich in die Warteschlange hinzugefügt werden. Wenn auf `napi_tsfn_blocking` gesetzt, blockiert die API, bis Speicherplatz in der Warteschlange verfügbar wird. `napi_call_threadsafe_function()` blockiert niemals, wenn die Thread-Safe-Funktion mit einer maximalen Warteschlangengröße von 0 erstellt wurde.

`napi_call_threadsafe_function()` sollte nicht mit `napi_tsfn_blocking` von einem JavaScript-Thread aufgerufen werden, da dies zu einem Deadlock des JavaScript-Threads führen kann, wenn die Warteschlange voll ist.

Der eigentliche Aufruf in JavaScript wird durch den Callback gesteuert, der über den `call_js_cb`-Parameter angegeben wird. `call_js_cb` wird einmal pro Wert, der durch einen erfolgreichen Aufruf von `napi_call_threadsafe_function()` in die Warteschlange gestellt wurde, im Hauptthread aufgerufen. Wenn ein solcher Callback nicht angegeben wird, wird ein Standard-Callback verwendet und der resultierende JavaScript-Aufruf hat keine Argumente. Der `call_js_cb`-Callback empfängt die aufzurufende JavaScript-Funktion als `napi_value` in seinen Parametern, sowie den `void*`-Kontextzeiger, der bei der Erstellung der `napi_threadsafe_function` verwendet wurde, und den nächsten Datenzeiger, der von einem der sekundären Threads erstellt wurde. Der Callback kann dann eine API wie `napi_call_function()` verwenden, um in JavaScript aufzurufen.

Der Callback kann auch mit `env` und `call_js_cb`, die beide auf `NULL` gesetzt sind, aufgerufen werden, um anzuzeigen, dass Aufrufe in JavaScript nicht mehr möglich sind, während Elemente in der Warteschlange verbleiben, die möglicherweise freigegeben werden müssen. Dies tritt normalerweise auf, wenn der Node.js-Prozess beendet wird, während eine Thread-Safe-Funktion noch aktiv ist.

Es ist nicht erforderlich, über `napi_make_callback()` in JavaScript aufzurufen, da Node-API `call_js_cb` in einem Kontext ausführt, der für Callbacks geeignet ist.

Null oder mehr in der Warteschlange befindliche Elemente können in jedem Takt der Ereignisschleife aufgerufen werden. Anwendungen sollten sich nicht auf ein bestimmtes Verhalten verlassen, sondern lediglich darauf, dass Fortschritte beim Aufrufen von Callbacks erzielt werden und Ereignisse im Laufe der Zeit aufgerufen werden.


### Referenzzählung von threadsicheren Funktionen {#reference-counting-of-thread-safe-functions}

Threads können während der Lebensdauer eines `napi_threadsafe_function`-Objekts hinzugefügt und entfernt werden. Zusätzlich zur Angabe einer anfänglichen Anzahl von Threads bei der Erstellung kann also `napi_acquire_threadsafe_function` aufgerufen werden, um anzuzeigen, dass ein neuer Thread die threadsichere Funktion nutzen wird. Ebenso kann `napi_release_threadsafe_function` aufgerufen werden, um anzuzeigen, dass ein vorhandener Thread die threadsichere Funktion nicht mehr nutzen wird.

`napi_threadsafe_function`-Objekte werden zerstört, wenn jeder Thread, der das Objekt verwendet, `napi_release_threadsafe_function()` aufgerufen hat oder als Antwort auf einen Aufruf von `napi_call_threadsafe_function` den Rückgabestatus `napi_closing` erhalten hat. Die Warteschlange wird geleert, bevor die `napi_threadsafe_function` zerstört wird. `napi_release_threadsafe_function()` sollte der letzte API-Aufruf in Verbindung mit einer bestimmten `napi_threadsafe_function` sein, da nach Abschluss des Aufrufs keine Garantie dafür besteht, dass die `napi_threadsafe_function` noch zugewiesen ist. Aus dem gleichen Grund sollte eine threadsichere Funktion nicht mehr verwendet werden, nachdem als Antwort auf einen Aufruf von `napi_call_threadsafe_function` der Rückgabewert `napi_closing` empfangen wurde. Daten, die mit der `napi_threadsafe_function` verknüpft sind, können in ihrem `napi_finalize`-Callback freigegeben werden, der an `napi_create_threadsafe_function()` übergeben wurde. Der Parameter `initial_thread_count` von `napi_create_threadsafe_function` markiert die anfängliche Anzahl von Abrufen der threadsicheren Funktionen, anstatt `napi_acquire_threadsafe_function` bei der Erstellung mehrmals aufzurufen.

Sobald die Anzahl der Threads, die eine `napi_threadsafe_function` verwenden, Null erreicht, können keine weiteren Threads mehr mit dem Aufruf von `napi_acquire_threadsafe_function()` mit der Verwendung beginnen. Tatsächlich geben alle nachfolgenden API-Aufrufe, die mit ihr verbunden sind, mit Ausnahme von `napi_release_threadsafe_function()`, einen Fehlerwert von `napi_closing` zurück.

Die threadsichere Funktion kann "abgebrochen" werden, indem `napi_release_threadsafe_function()` der Wert `napi_tsfn_abort` übergeben wird. Dies führt dazu, dass alle nachfolgenden APIs, die mit der threadsicheren Funktion verbunden sind, mit Ausnahme von `napi_release_threadsafe_function()`, `napi_closing` zurückgeben, noch bevor ihre Referenzzählung Null erreicht. Insbesondere gibt `napi_call_threadsafe_function()` `napi_closing` zurück und informiert die Threads somit, dass es nicht mehr möglich ist, asynchrone Aufrufe an die threadsichere Funktion zu tätigen. Dies kann als Kriterium für die Beendigung des Threads verwendet werden. **Nach dem Empfang eines Rückgabewertes
von <code>napi_closing</code> von <code>napi_call_threadsafe_function()</code> darf ein Thread die
threadsichere Funktion nicht mehr verwenden, da nicht mehr garantiert ist, dass
sie zugewiesen ist.**


### Entscheidung, ob der Prozess weiterlaufen soll {#deciding-whether-to-keep-the-process-running}

Ähnlich wie bei libuv-Handles können Thread-sichere Funktionen "referenziert" und "dereferenziert" werden. Eine "referenzierte" Thread-sichere Funktion bewirkt, dass die Ereignisschleife in dem Thread, in dem sie erstellt wurde, so lange aktiv bleibt, bis die Thread-sichere Funktion zerstört wird. Im Gegensatz dazu verhindert eine "dereferenzierte" Thread-sichere Funktion nicht, dass die Ereignisschleife beendet wird. Die APIs `napi_ref_threadsafe_function` und `napi_unref_threadsafe_function` existieren für diesen Zweck.

Weder markiert `napi_unref_threadsafe_function` die Thread-sicheren Funktionen als zerstörbar, noch verhindert `napi_ref_threadsafe_function`, dass sie zerstört werden.

### `napi_create_threadsafe_function` {#napi_create_threadsafe_function}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v12.6.0, v10.17.0 | Parameter `func` mit benutzerdefiniertem `call_js_cb` optional gemacht. |
| v10.6.0 | Hinzugefügt in: v10.6.0 |
:::

**N-API Version: 4**

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
- `[in] env`: Die Umgebung, unter der die API aufgerufen wird.
- `[in] func`: Eine optionale JavaScript-Funktion, die von einem anderen Thread aufgerufen werden kann. Sie muss angegeben werden, wenn `NULL` an `call_js_cb` übergeben wird.
- `[in] async_resource`: Ein optionales Objekt, das der asynchronen Arbeit zugeordnet ist und an mögliche `async_hooks` [`init`-Hooks](/de/nodejs/api/async_hooks#initasyncid-type-triggerasyncid-resource) übergeben wird.
- `[in] async_resource_name`: Eine JavaScript-Zeichenkette, die einen Bezeichner für die Art der Ressource bereitstellt, die für Diagnoseinformationen bereitgestellt wird, die von der `async_hooks`-API bereitgestellt werden.
- `[in] max_queue_size`: Maximale Größe der Warteschlange. `0` für keine Beschränkung.
- `[in] initial_thread_count`: Die anfängliche Anzahl von Akquisitionen, d. h. die anfängliche Anzahl von Threads, einschließlich des Hauptthreads, die diese Funktion nutzen werden.
- `[in] thread_finalize_data`: Optionale Daten, die an `thread_finalize_cb` übergeben werden sollen.
- `[in] thread_finalize_cb`: Optionale Funktion, die aufgerufen wird, wenn die `napi_threadsafe_function` zerstört wird.
- `[in] context`: Optionale Daten, die an die resultierende `napi_threadsafe_function` angehängt werden sollen.
- `[in] call_js_cb`: Optionaler Callback, der die JavaScript-Funktion als Reaktion auf einen Aufruf in einem anderen Thread aufruft. Dieser Callback wird im Hauptthread aufgerufen. Wenn er nicht angegeben wird, wird die JavaScript-Funktion ohne Parameter und mit `undefined` als `this`-Wert aufgerufen. [`napi_threadsafe_function_call_js`](/de/nodejs/api/n-api#napi_threadsafe_function_call_js) bietet weitere Details.
- `[out] result`: Die asynchrone, Thread-sichere JavaScript-Funktion.

**Änderungshistorie:**

-  Experimentell (`NAPI_EXPERIMENTAL` ist definiert): Nicht abgefangene Ausnahmen, die in `call_js_cb` ausgelöst werden, werden mit dem [`'uncaughtException'`](/de/nodejs/api/process#event-uncaughtexception)-Ereignis behandelt, anstatt ignoriert zu werden.


### `napi_get_threadsafe_function_context` {#napi_get_threadsafe_function_context}

**Hinzugefügt in: v10.6.0**

**N-API Version: 4**

```C [C]
NAPI_EXTERN napi_status
napi_get_threadsafe_function_context(napi_threadsafe_function func,
                                     void** result);
```
- `[in] func`: Die Thread-sichere Funktion, für die der Kontext abgerufen werden soll.
- `[out] result`: Der Speicherort, an dem der Kontext gespeichert werden soll.

Diese API kann von jedem Thread aufgerufen werden, der `func` verwendet.

### `napi_call_threadsafe_function` {#napi_call_threadsafe_function}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v14.5.0 | Unterstützung für `napi_would_deadlock` wurde zurückgenommen. |
| v14.1.0 | Gibt `napi_would_deadlock` zurück, wenn sie mit `napi_tsfn_blocking` vom Haupt-Thread oder einem Worker-Thread aufgerufen wird und die Warteschlange voll ist. |
| v10.6.0 | Hinzugefügt in: v10.6.0 |
:::

**N-API Version: 4**

```C [C]
NAPI_EXTERN napi_status
napi_call_threadsafe_function(napi_threadsafe_function func,
                              void* data,
                              napi_threadsafe_function_call_mode is_blocking);
```
- `[in] func`: Die asynchrone, Thread-sichere JavaScript-Funktion, die aufgerufen werden soll.
- `[in] data`: Daten, die über den Callback `call_js_cb`, der bei der Erstellung der Thread-sicheren JavaScript-Funktion bereitgestellt wurde, an JavaScript gesendet werden sollen.
- `[in] is_blocking`: Flag, dessen Wert entweder `napi_tsfn_blocking` sein kann, um anzugeben, dass der Aufruf blockieren soll, wenn die Warteschlange voll ist, oder `napi_tsfn_nonblocking`, um anzugeben, dass der Aufruf sofort mit dem Status `napi_queue_full` zurückkehren soll, wenn die Warteschlange voll ist.

Diese API sollte nicht mit `napi_tsfn_blocking` von einem JavaScript-Thread aufgerufen werden, da dies, wenn die Warteschlange voll ist, dazu führen kann, dass der JavaScript-Thread in einen Deadlock gerät.

Diese API gibt `napi_closing` zurück, wenn `napi_release_threadsafe_function()` mit `abort` auf `napi_tsfn_abort` von einem beliebigen Thread aufgerufen wurde. Der Wert wird nur der Warteschlange hinzugefügt, wenn die API `napi_ok` zurückgibt.

Diese API kann von jedem Thread aufgerufen werden, der `func` verwendet.

### `napi_acquire_threadsafe_function` {#napi_acquire_threadsafe_function}

**Hinzugefügt in: v10.6.0**

**N-API Version: 4**

```C [C]
NAPI_EXTERN napi_status
napi_acquire_threadsafe_function(napi_threadsafe_function func);
```
- `[in] func`: Die asynchrone, Thread-sichere JavaScript-Funktion, deren Verwendung begonnen werden soll.

Ein Thread sollte diese API aufrufen, bevor er `func` an andere Thread-sichere Funktions-APIs übergibt, um anzugeben, dass er `func` verwenden wird. Dies verhindert, dass `func` zerstört wird, wenn alle anderen Threads die Verwendung beendet haben.

Diese API kann von jedem Thread aufgerufen werden, der mit der Verwendung von `func` beginnen wird.


### `napi_release_threadsafe_function` {#napi_release_threadsafe_function}

**Hinzugefügt in: v10.6.0**

**N-API Version: 4**

```C [C]
NAPI_EXTERN napi_status
napi_release_threadsafe_function(napi_threadsafe_function func,
                                 napi_threadsafe_function_release_mode mode);
```
- `[in] func`: Die asynchrone, threadsichere JavaScript-Funktion, deren Referenzzählung dekrementiert werden soll.
- `[in] mode`: Flag, dessen Wert entweder `napi_tsfn_release` sein kann, um anzugeben, dass der aktuelle Thread keine weiteren Aufrufe an die threadsichere Funktion vornehmen wird, oder `napi_tsfn_abort`, um anzugeben, dass zusätzlich zum aktuellen Thread kein anderer Thread weitere Aufrufe an die threadsichere Funktion vornehmen sollte. Wenn `napi_tsfn_abort` gesetzt ist, geben weitere Aufrufe von `napi_call_threadsafe_function()` `napi_closing` zurück, und es werden keine weiteren Werte in die Warteschlange gestellt.

Ein Thread sollte diese API aufrufen, wenn er die Verwendung von `func` beendet. Das Übergeben von `func` an eine der threadsicheren APIs, nachdem diese API aufgerufen wurde, hat undefinierte Ergebnisse, da `func` möglicherweise zerstört wurde.

Diese API kann von jedem Thread aufgerufen werden, der die Verwendung von `func` beendet.

### `napi_ref_threadsafe_function` {#napi_ref_threadsafe_function}

**Hinzugefügt in: v10.6.0**

**N-API Version: 4**

```C [C]
NAPI_EXTERN napi_status
napi_ref_threadsafe_function(node_api_basic_env env, napi_threadsafe_function func);
```
- `[in] env`: Die Umgebung, unter der die API aufgerufen wird.
- `[in] func`: Die threadsichere Funktion, auf die verwiesen werden soll.

Diese API wird verwendet, um anzugeben, dass die Ereignisschleife, die im Hauptthread ausgeführt wird, nicht beendet werden sollte, bis `func` zerstört wurde. Ähnlich wie [`uv_ref`](https://docs.libuv.org/en/v1.x/handle#c.uv_ref) ist sie auch idempotent.

Weder markiert `napi_unref_threadsafe_function` die threadsicheren Funktionen als zerstörbar, noch verhindert `napi_ref_threadsafe_function`, dass sie zerstört werden. `napi_acquire_threadsafe_function` und `napi_release_threadsafe_function` stehen für diesen Zweck zur Verfügung.

Diese API darf nur vom Hauptthread aufgerufen werden.

### `napi_unref_threadsafe_function` {#napi_unref_threadsafe_function}

**Hinzugefügt in: v10.6.0**

**N-API Version: 4**

```C [C]
NAPI_EXTERN napi_status
napi_unref_threadsafe_function(node_api_basic_env env, napi_threadsafe_function func);
```
- `[in] env`: Die Umgebung, unter der die API aufgerufen wird.
- `[in] func`: Die threadsichere Funktion, deren Referenz aufgehoben werden soll.

Diese API wird verwendet, um anzugeben, dass die Ereignisschleife, die im Hauptthread ausgeführt wird, beendet werden kann, bevor `func` zerstört wird. Ähnlich wie [`uv_unref`](https://docs.libuv.org/en/v1.x/handle#c.uv_unref) ist sie auch idempotent.

Diese API darf nur vom Hauptthread aufgerufen werden.


## Verschiedene Hilfsmittel {#miscellaneous-utilities}

### `node_api_get_module_file_name` {#node_api_get_module_file_name}

**Hinzugefügt in: v15.9.0, v14.18.0, v12.22.0**

**N-API Version: 9**

```C [C]
NAPI_EXTERN napi_status
node_api_get_module_file_name(node_api_basic_env env, const char** result);

```
- `[in] env`: Die Umgebung, unter der die API aufgerufen wird.
- `[out] result`: Eine URL mit dem absoluten Pfad des Speicherorts, von dem das Add-on geladen wurde. Für eine Datei auf dem lokalen Dateisystem beginnt sie mit `file://`. Die Zeichenkette ist nullterminiert und gehört zu `env` und darf daher nicht verändert oder freigegeben werden.

`result` kann eine leere Zeichenkette sein, wenn der Ladevorgang des Add-ons den Dateinamen des Add-ons während des Ladens nicht ermitteln kann.

