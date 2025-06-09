---
title: Documentazione N-API di Node.js
description: L'N-API (Node.js API) fornisce un'interfaccia stabile e coerente per i moduli nativi, permettendo agli sviluppatori di creare moduli compatibili con diverse versioni di Node.js.
head:
  - - meta
    - name: og:title
      content: Documentazione N-API di Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: L'N-API (Node.js API) fornisce un'interfaccia stabile e coerente per i moduli nativi, permettendo agli sviluppatori di creare moduli compatibili con diverse versioni di Node.js.
  - - meta
    - name: twitter:title
      content: Documentazione N-API di Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: L'N-API (Node.js API) fornisce un'interfaccia stabile e coerente per i moduli nativi, permettendo agli sviluppatori di creare moduli compatibili con diverse versioni di Node.js.
---


# Node-API {#node-api}

::: tip [Stable: 2 - Stabile]
[Stable: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile
:::

Node-API (precedentemente N-API) è un'API per la creazione di Addon nativi. È indipendente dal runtime JavaScript sottostante (ad esempio, V8) ed è gestita come parte di Node.js stesso. Questa API sarà Application Binary Interface (ABI) stabile tra le versioni di Node.js. Ha lo scopo di isolare gli addon dalle modifiche nel motore JavaScript sottostante e consentire ai moduli compilati per una versione principale di essere eseguiti su versioni principali successive di Node.js senza ricompilazione. La guida alla [Stabilità ABI](https://nodejs.org/en/docs/guides/abi-stability/) fornisce una spiegazione più approfondita.

Gli addon vengono creati/impacchettati con lo stesso approccio/strumenti descritti nella sezione intitolata [Addon C++](/it/nodejs/api/addons). L'unica differenza è l'insieme di API utilizzate dal codice nativo. Invece di utilizzare le API V8 o [Native Abstractions for Node.js](https://github.com/nodejs/nan), vengono utilizzate le funzioni disponibili in Node-API.

Le API esposte da Node-API vengono generalmente utilizzate per creare e manipolare valori JavaScript. I concetti e le operazioni generalmente corrispondono a idee specificate nella specifica del linguaggio ECMA-262. Le API hanno le seguenti proprietà:

- Tutte le chiamate Node-API restituiscono un codice di stato di tipo `napi_status`. Questo stato indica se la chiamata API ha avuto successo o meno.
- Il valore di ritorno dell'API viene passato tramite un parametro out.
- Tutti i valori JavaScript sono astratti dietro un tipo opaco denominato `napi_value`.
- In caso di codice di stato di errore, è possibile ottenere ulteriori informazioni utilizzando `napi_get_last_error_info`. Ulteriori informazioni sono disponibili nella sezione sulla gestione degli errori [Gestione degli errori](/it/nodejs/api/n-api#error-handling).

Node-API è una C API che garantisce la stabilità ABI tra le versioni di Node.js e diversi livelli di compilatore. Una C++ API può essere più facile da usare. Per supportare l'uso di C++, il progetto gestisce un modulo wrapper C++ chiamato [`node-addon-api`](https://github.com/nodejs/node-addon-api). Questo wrapper fornisce una C++ API inlinable. I binari creati con `node-addon-api` dipenderanno dai simboli per le funzioni basate su C Node-API esportate da Node.js. `node-addon-api` è un modo più efficiente per scrivere codice che chiama Node-API. Si prenda, ad esempio, il seguente codice `node-addon-api`. La prima sezione mostra il codice `node-addon-api` e la seconda sezione mostra cosa viene effettivamente utilizzato nell'addon.

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
Il risultato finale è che l'addon utilizza solo le API C esportate. Di conseguenza, ottiene comunque i vantaggi della stabilità ABI fornita dalla C API.

Quando si utilizza `node-addon-api` invece delle API C, iniziare con la [documentazione](https://github.com/nodejs/node-addon-api#api-documentation) dell'API per `node-addon-api`.

La [Risorsa Node-API](https://nodejs.github.io/node-addon-examples/) offre un eccellente orientamento e suggerimenti per gli sviluppatori che hanno appena iniziato con Node-API e `node-addon-api`. Ulteriori risorse multimediali sono disponibili nella pagina [Node-API Media](https://github.com/nodejs/abi-stable-node/blob/HEAD/node-api-media.md).


## Implicazioni della Stabilità dell'ABI {#implications-of-abi-stability}

Sebbene Node-API fornisca una garanzia di stabilità dell'ABI, altre parti di Node.js non lo fanno, e qualsiasi libreria esterna utilizzata dall'addon potrebbe non farlo. In particolare, nessuna delle seguenti API fornisce una garanzia di stabilità dell'ABI tra le versioni principali:

- le API C++ di Node.js disponibili tramite
- le API libuv che sono anche incluse con Node.js e disponibili tramite
- l'API V8 disponibile tramite

Pertanto, affinché un addon rimanga compatibile con l'ABI tra le versioni principali di Node.js, deve utilizzare esclusivamente Node-API limitandosi a usare

```C [C]
#include <node_api.h>
```
e controllando, per tutte le librerie esterne che utilizza, che la libreria esterna fornisca garanzie di stabilità dell'ABI simili a Node-API.

## Compilazione {#building}

A differenza dei moduli scritti in JavaScript, lo sviluppo e la distribuzione di addon nativi Node.js utilizzando Node-API richiede un set aggiuntivo di strumenti. Oltre agli strumenti di base necessari per lo sviluppo per Node.js, lo sviluppatore di addon nativi richiede una toolchain in grado di compilare codice C e C++ in un binario. Inoltre, a seconda di come viene distribuito l'addon nativo, l' *utente* dell'addon nativo dovrà anche avere una toolchain C/C++ installata.

Per gli sviluppatori Linux, i pacchetti toolchain C/C++ necessari sono facilmente disponibili. [GCC](https://gcc.gnu.org/) è ampiamente utilizzato nella comunità Node.js per compilare e testare su una varietà di piattaforme. Per molti sviluppatori, anche l'infrastruttura del compilatore [LLVM](https://llvm.org/) è una buona scelta.

Per gli sviluppatori Mac, [Xcode](https://developer.apple.com/xcode/) offre tutti gli strumenti di compilazione necessari. Tuttavia, non è necessario installare l'intero IDE Xcode. Il seguente comando installa la toolchain necessaria:

```bash [BASH]
xcode-select --install
```
Per gli sviluppatori Windows, [Visual Studio](https://visualstudio.microsoft.com/) offre tutti gli strumenti di compilazione necessari. Tuttavia, non è necessario installare l'intero IDE di Visual Studio. Il seguente comando installa la toolchain necessaria:

```bash [BASH]
npm install --global windows-build-tools
```
Le sezioni seguenti descrivono gli strumenti aggiuntivi disponibili per lo sviluppo e la distribuzione di addon nativi Node.js.


### Strumenti di compilazione {#build-tools}

Entrambi gli strumenti elencati qui richiedono che gli *utenti* dell'addon nativo abbiano una toolchain C/C++ installata per poter installare correttamente l'addon nativo.

#### node-gyp {#node-gyp}

[node-gyp](https://github.com/nodejs/node-gyp) è un sistema di compilazione basato sul fork [gyp-next](https://github.com/nodejs/gyp-next) dello strumento [GYP](https://gyp.gsrc.io/) di Google ed è incluso in npm. GYP, e quindi node-gyp, richiede che Python sia installato.

Storicamente, node-gyp è stato lo strumento preferito per la compilazione di addon nativi. Ha un'ampia adozione e documentazione. Tuttavia, alcuni sviluppatori hanno riscontrato limitazioni in node-gyp.

#### CMake.js {#cmakejs}

[CMake.js](https://github.com/cmake-js/cmake-js) è un sistema di compilazione alternativo basato su [CMake](https://cmake.org/).

CMake.js è una buona scelta per i progetti che già utilizzano CMake o per gli sviluppatori interessati dalle limitazioni di node-gyp. [`build_with_cmake`](https://github.com/nodejs/node-addon-examples/tree/main/src/8-tooling/build_with_cmake) è un esempio di progetto di addon nativo basato su CMake.

### Caricamento di binari precompilati {#uploading-precompiled-binaries}

I tre strumenti elencati qui consentono agli sviluppatori e ai manutentori di addon nativi di creare e caricare binari su server pubblici o privati. Questi strumenti sono tipicamente integrati con sistemi di compilazione CI/CD come [Travis CI](https://travis-ci.org/) e [AppVeyor](https://www.appveyor.com/) per compilare e caricare binari per una varietà di piattaforme e architetture. Questi binari sono quindi disponibili per il download da parte degli utenti che non hanno bisogno di avere una toolchain C/C++ installata.

#### node-pre-gyp {#node-pre-gyp}

[node-pre-gyp](https://github.com/mapbox/node-pre-gyp) è uno strumento basato su node-gyp che aggiunge la possibilità di caricare binari su un server a scelta dello sviluppatore. node-pre-gyp ha un supporto particolarmente buono per il caricamento di binari su Amazon S3.

#### prebuild {#prebuild}

[prebuild](https://github.com/prebuild/prebuild) è uno strumento che supporta le compilazioni utilizzando sia node-gyp che CMake.js. A differenza di node-pre-gyp che supporta una varietà di server, prebuild carica i binari solo su [GitHub releases](https://help.github.com/en/github/administering-a-repository/about-releases). prebuild è una buona scelta per i progetti GitHub che utilizzano CMake.js.


#### prebuildify {#prebuildify}

[prebuildify](https://github.com/prebuild/prebuildify) è uno strumento basato su node-gyp. Il vantaggio di prebuildify è che i binari compilati sono raggruppati con l'addon nativo quando viene caricato su npm. I binari vengono scaricati da npm e sono immediatamente disponibili per l'utente del modulo quando l'addon nativo viene installato.

## Utilizzo {#usage}

Per utilizzare le funzioni Node-API, includi il file [`node_api.h`](https://github.com/nodejs/node/blob/HEAD/src/node_api.h) che si trova nella directory src nell'albero di sviluppo di node:

```C [C]
#include <node_api.h>
```
Questo opterà per la `NAPI_VERSION` predefinita per la release specificata di Node.js. Per garantire la compatibilità con versioni specifiche di Node-API, la versione può essere specificata esplicitamente quando si include l'header:

```C [C]
#define NAPI_VERSION 3
#include <node_api.h>
```
Questo limita la superficie di Node-API alla sola funzionalità disponibile nelle versioni specificate (e precedenti).

Alcune parti della superficie di Node-API sono sperimentali e richiedono un'adesione esplicita:

```C [C]
#define NAPI_EXPERIMENTAL
#include <node_api.h>
```
In questo caso, l'intera superficie API, comprese le API sperimentali, sarà disponibile per il codice del modulo.

Occasionalmente, vengono introdotte funzionalità sperimentali che influiscono su API già rilasciate e stabili. Queste funzionalità possono essere disabilitate tramite un opt-out:

```C [C]
#define NAPI_EXPERIMENTAL
#define NODE_API_EXPERIMENTAL_<FEATURE_NAME>_OPT_OUT
#include <node_api.h>
```
dove `\<FEATURE_NAME\>` è il nome di una funzionalità sperimentale che influisce sia sulle API sperimentali che su quelle stabili.

## Tabella di compatibilità delle versioni di Node-API {#node-api-version-matrix}

Fino alla versione 9, le versioni di Node-API erano additive e versionate indipendentemente da Node.js. Ciò significava che ogni versione era un'estensione della versione precedente in quanto aveva tutte le API della versione precedente con alcune aggiunte. Ogni versione di Node.js supportava solo una singola versione di Node-API. Ad esempio, v18.15.0 supporta solo la versione 8 di Node-API. La stabilità ABI è stata raggiunta perché 8 era un sovrainsieme stretto di tutte le versioni precedenti.

A partire dalla versione 9, sebbene le versioni di Node-API continuino a essere versionate in modo indipendente, un add-on che veniva eseguito con la versione 9 di Node-API potrebbe richiedere aggiornamenti del codice per essere eseguito con la versione 10 di Node-API. La stabilità ABI viene mantenuta, tuttavia, poiché le versioni di Node.js che supportano versioni di Node-API superiori a 8 supporteranno tutte le versioni comprese tra 8 e la versione più alta che supportano e per impostazione predefinita forniranno le API della versione 8 a meno che un add-on non scelga una versione di Node-API superiore. Questo approccio offre la flessibilità di ottimizzare meglio le funzioni Node-API esistenti mantenendo la stabilità ABI. Gli add-on esistenti possono continuare a essere eseguiti senza ricompilazione utilizzando una versione precedente di Node-API. Se un add-on necessita di funzionalità da una versione più recente di Node-API, saranno necessari modifiche al codice esistente e ricompilazione per utilizzare comunque quelle nuove funzioni.

Nelle versioni di Node.js che supportano la versione 9 e successive di Node-API, la definizione di `NAPI_VERSION=X` e l'utilizzo delle macro di inizializzazione degli add-on esistenti incorporeranno la versione di Node-API richiesta che verrà utilizzata in fase di esecuzione nell'add-on. Se `NAPI_VERSION` non è impostato, verrà impostato di default su 8.

Questa tabella potrebbe non essere aggiornata negli stream precedenti, le informazioni più aggiornate si trovano nella documentazione API più recente in: [Tabella di compatibilità delle versioni di Node-API](/it/nodejs/api/n-api#node-api-version-matrix)

| Versione Node-API | Supportata in |
| --- | --- |
| 9 | v18.17.0+, 20.3.0+, 21.0.0 e tutte le versioni successive |
| 8 | v12.22.0+, v14.17.0+, v15.12.0+, 16.0.0 e tutte le versioni successive |
| 7 | v10.23.0+, v12.19.0+, v14.12.0+, 15.0.0 e tutte le versioni successive |
| 6 | v10.20.0+, v12.17.0+, 14.0.0 e tutte le versioni successive |
| 5 | v10.17.0+, v12.11.0+, 13.0.0 e tutte le versioni successive |
| 4 | v10.16.0+, v11.8.0+, 12.0.0 e tutte le versioni successive |
| 3 | v6.14.2*, 8.11.2+, v9.11.0+*, 10.0.0 e tutte le versioni successive |
| 2 | v8.10.0+*, v9.3.0+*, 10.0.0 e tutte le versioni successive |
| 1 | v8.6.0+**, v9.0.0+*, 10.0.0 e tutte le versioni successive |
* Node-API era sperimentale.

** Node.js 8.0.0 includeva Node-API come sperimentale. È stato rilasciato come Node-API versione 1 ma ha continuato a evolversi fino a Node.js 8.6.0. L'API è diversa nelle versioni precedenti a Node.js 8.6.0. Si consiglia Node-API versione 3 o successiva.

Ogni API documentata per Node-API avrà un header denominato `aggiunta in:`, e le API che sono stabili avranno l'header aggiuntivo `Versione Node-API:`. Le API sono direttamente utilizzabili quando si utilizza una versione di Node.js che supporta la versione Node-API mostrata in `Versione Node-API:` o superiore. Quando si utilizza una versione di Node.js che non supporta la `Versione Node-API:` elencata o se non è elencata alcuna `Versione Node-API:`, allora l'API sarà disponibile solo se `#define NAPI_EXPERIMENTAL` precede l'inclusione di `node_api.h` o `js_native_api.h`. Se un'API sembra non essere disponibile su una versione di Node.js successiva a quella mostrata in `aggiunta in:`, allora questo è molto probabilmente il motivo dell'apparente assenza.

Le Node-API associate strettamente all'accesso alle funzionalità ECMAScript dal codice nativo si trovano separatamente in `js_native_api.h` e `js_native_api_types.h`. Le API definite in questi header sono incluse in `node_api.h` e `node_api_types.h`. Gli header sono strutturati in questo modo per consentire implementazioni di Node-API al di fuori di Node.js. Per tali implementazioni, le API specifiche di Node.js potrebbero non essere applicabili.

Le parti specifiche di Node.js di un addon possono essere separate dal codice che espone la funzionalità effettiva all'ambiente JavaScript in modo che quest'ultimo possa essere utilizzato con più implementazioni di Node-API. Nell'esempio seguente, `addon.c` e `addon.h` si riferiscono solo a `js_native_api.h`. Ciò garantisce che `addon.c` possa essere riutilizzato per la compilazione con l'implementazione Node.js di Node-API o con qualsiasi implementazione di Node-API al di fuori di Node.js.

`addon_node.c` è un file separato che contiene il punto di ingresso specifico di Node.js nell'addon e che istanzia l'addon chiamando `addon.c` quando l'addon viene caricato in un ambiente Node.js.

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

## API del ciclo di vita dell'ambiente {#environment-life-cycle-apis}

La [Sezione 8.7](https://tc39.es/ecma262/#sec-agents) della [Specificazione del linguaggio ECMAScript](https://tc39.github.io/ecma262/) definisce il concetto di "Agent" come un ambiente autonomo in cui viene eseguito il codice JavaScript. Più Agent possono essere avviati e terminati contemporaneamente o in sequenza dal processo.

Un ambiente Node.js corrisponde a un Agent ECMAScript. Nel processo principale, un ambiente viene creato all'avvio e ambienti aggiuntivi possono essere creati su thread separati per fungere da [thread di worker](https://nodejs.org/api/worker_threads). Quando Node.js è incorporato in un'altra applicazione, il thread principale dell'applicazione può anche costruire e distruggere un ambiente Node.js più volte durante il ciclo di vita del processo dell'applicazione in modo tale che ogni ambiente Node.js creato dall'applicazione possa, a sua volta, durante il suo ciclo di vita creare e distruggere ambienti aggiuntivi come thread di worker.

Dal punto di vista di un addon nativo, questo significa che i binding che fornisce possono essere chiamati più volte, da più contesti e anche contemporaneamente da più thread.

Gli addon nativi potrebbero aver bisogno di allocare uno stato globale che utilizzano durante il loro ciclo di vita di un ambiente Node.js in modo che lo stato possa essere univoco per ogni istanza dell'addon.

A tal fine, Node-API fornisce un modo per associare i dati in modo che il loro ciclo di vita sia legato al ciclo di vita di un ambiente Node.js.

### `napi_set_instance_data` {#napi_set_instance_data}

**Aggiunto in: v12.8.0, v10.20.0**

**Versione N-API: 6**

```C [C]
napi_status napi_set_instance_data(node_api_basic_env env,
                                   void* data,
                                   napi_finalize finalize_cb,
                                   void* finalize_hint);
```
- `[in] env`: L'ambiente sotto il quale viene invocata la chiamata Node-API.
- `[in] data`: L'elemento di dati da rendere disponibile ai binding di questa istanza.
- `[in] finalize_cb`: La funzione da chiamare quando l'ambiente viene smantellato. La funzione riceve `data` in modo da poterlo liberare. [`napi_finalize`](/it/nodejs/api/n-api#napi_finalize) fornisce maggiori dettagli.
- `[in] finalize_hint`: Suggerimento opzionale da passare alla callback di finalizzazione durante la raccolta.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API associa `data` all'ambiente Node.js attualmente in esecuzione. `data` può essere recuperato in seguito utilizzando `napi_get_instance_data()`. Qualsiasi dato esistente associato all'ambiente Node.js attualmente in esecuzione che è stato impostato tramite una precedente chiamata a `napi_set_instance_data()` verrà sovrascritto. Se una `finalize_cb` è stata fornita dalla precedente chiamata, non verrà chiamata.


### `napi_get_instance_data` {#napi_get_instance_data}

**Aggiunto in: v12.8.0, v10.20.0**

**Versione N-API: 6**

```C [C]
napi_status napi_get_instance_data(node_api_basic_env env,
                                   void** data);
```
- `[in] env`: L'ambiente in cui viene richiamata la chiamata Node-API.
- `[out] data`: L'elemento dati che è stato precedentemente associato all'ambiente Node.js attualmente in esecuzione tramite una chiamata a `napi_set_instance_data()`.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API recupera i dati che sono stati precedentemente associati all'ambiente Node.js attualmente in esecuzione tramite `napi_set_instance_data()`. Se non sono impostati dati, la chiamata avrà successo e `data` verrà impostato su `NULL`.

## Tipi di dati Node-API di base {#basic-node-api-data-types}

Node-API espone i seguenti tipi di dati fondamentali come astrazioni che vengono utilizzate dalle varie API. Queste API devono essere trattate come opache, ispezionabili solo con altre chiamate Node-API.

### `napi_status` {#napi_status}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

Codice di stato integrale che indica il successo o il fallimento di una chiamata Node-API. Attualmente, sono supportati i seguenti codici di stato.

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
Se sono necessarie informazioni aggiuntive quando un'API restituisce uno stato di errore, possono essere ottenute chiamando `napi_get_last_error_info`.

### `napi_extended_error_info` {#napi_extended_error_info}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
typedef struct {
  const char* error_message;
  void* engine_reserved;
  uint32_t engine_error_code;
  napi_status error_code;
} napi_extended_error_info;
```
- `error_message`: Stringa con codifica UTF8 contenente una descrizione dell'errore neutrale rispetto alla VM.
- `engine_reserved`: Riservato per i dettagli dell'errore specifici della VM. Attualmente non è implementato per nessuna VM.
- `engine_error_code`: Codice di errore specifico della VM. Attualmente non è implementato per nessuna VM.
- `error_code`: Il codice di stato Node-API che ha avuto origine con l'ultimo errore.

Consulta la sezione [Gestione degli errori](/it/nodejs/api/n-api#error-handling) per ulteriori informazioni.


### `napi_env` {#napi_env}

`napi_env` viene utilizzato per rappresentare un contesto che l'implementazione Node-API sottostante può utilizzare per persistere lo stato specifico della VM. Questa struttura viene passata alle funzioni native quando vengono invocate e deve essere restituita quando si effettuano chiamate Node-API. In particolare, lo stesso `napi_env` che è stato passato quando è stata chiamata la funzione nativa iniziale deve essere passato a qualsiasi successiva chiamata Node-API nidificata. Non è consentito memorizzare nella cache `napi_env` allo scopo di un riutilizzo generale e passare `napi_env` tra istanze dello stesso addon in esecuzione su diversi thread [`Worker`](/it/nodejs/api/worker_threads#class-worker). `napi_env` diventa non valido quando un'istanza di un addon nativo viene scaricata. La notifica di questo evento viene fornita tramite i callback forniti a [`napi_add_env_cleanup_hook`](/it/nodejs/api/n-api#napi_add_env_cleanup_hook) e [`napi_set_instance_data`](/it/nodejs/api/n-api#napi_set_instance_data).

### `node_api_basic_env` {#node_api_basic_env}

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

Questa variante di `napi_env` viene passata ai finalizzatori sincroni ([`node_api_basic_finalize`](/it/nodejs/api/n-api#node_api_basic_finalize)). Esiste un sottoinsieme di Node-API che accettano un parametro di tipo `node_api_basic_env` come primo argomento. Queste API non accedono allo stato del motore JavaScript e sono quindi sicure da chiamare dai finalizzatori sincroni. È consentito passare un parametro di tipo `napi_env` a queste API, tuttavia, non è consentito passare un parametro di tipo `node_api_basic_env` alle API che accedono allo stato del motore JavaScript. Tentare di farlo senza un cast produrrà un avviso del compilatore o un errore quando gli add-on vengono compilati con flag che li fanno emettere avvisi e/o errori quando tipi di puntatore errati vengono passati in una funzione. Chiamare tali API da un finalizzatore sincrono comporterà alla fine la terminazione dell'applicazione.

### `napi_value` {#napi_value}

Questo è un puntatore opaco che viene utilizzato per rappresentare un valore JavaScript.


### `napi_threadsafe_function` {#napi_threadsafe_function}

**Aggiunto in: v10.6.0**

**Versione N-API: 4**

Si tratta di un puntatore opaco che rappresenta una funzione JavaScript che può essere chiamata in modo asincrono da più thread tramite `napi_call_threadsafe_function()`.

### `napi_threadsafe_function_release_mode` {#napi_threadsafe_function_release_mode}

**Aggiunto in: v10.6.0**

**Versione N-API: 4**

Un valore da fornire a `napi_release_threadsafe_function()` per indicare se la funzione thread-safe deve essere chiusa immediatamente (`napi_tsfn_abort`) o semplicemente rilasciata (`napi_tsfn_release`) e quindi disponibile per l'uso successivo tramite `napi_acquire_threadsafe_function()` e `napi_call_threadsafe_function()`.

```C [C]
typedef enum {
  napi_tsfn_release,
  napi_tsfn_abort
} napi_threadsafe_function_release_mode;
```
### `napi_threadsafe_function_call_mode` {#napi_threadsafe_function_call_mode}

**Aggiunto in: v10.6.0**

**Versione N-API: 4**

Un valore da fornire a `napi_call_threadsafe_function()` per indicare se la chiamata deve bloccarsi ogni volta che la coda associata alla funzione thread-safe è piena.

```C [C]
typedef enum {
  napi_tsfn_nonblocking,
  napi_tsfn_blocking
} napi_threadsafe_function_call_mode;
```
### Tipi di gestione della memoria Node-API {#node-api-memory-management-types}

#### `napi_handle_scope` {#napi_handle_scope}

Questa è un'astrazione utilizzata per controllare e modificare la durata degli oggetti creati all'interno di un ambito particolare. In generale, i valori Node-API vengono creati nel contesto di un ambito di handle. Quando un metodo nativo viene chiamato da JavaScript, esisterà un ambito di handle predefinito. Se l'utente non crea esplicitamente un nuovo ambito di handle, i valori Node-API verranno creati nell'ambito di handle predefinito. Per qualsiasi invocazione di codice al di fuori dell'esecuzione di un metodo nativo (ad esempio, durante un'invocazione di callback libuv), il modulo è tenuto a creare un ambito prima di invocare qualsiasi funzione che possa comportare la creazione di valori JavaScript.

Gli ambiti di handle vengono creati utilizzando [`napi_open_handle_scope`](/it/nodejs/api/n-api#napi_open_handle_scope) e vengono distrutti utilizzando [`napi_close_handle_scope`](/it/nodejs/api/n-api#napi_close_handle_scope). La chiusura dell'ambito può indicare al GC che tutti i `napi_value` creati durante la durata dell'ambito di handle non sono più referenziati dal frame dello stack corrente.

Per maggiori dettagli, rivedi la sezione [Gestione della durata degli oggetti](/it/nodejs/api/n-api#object-lifetime-management).


#### `napi_escapable_handle_scope` {#napi_escapable_handle_scope}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

Gli ambiti di handle con escape sono un tipo speciale di ambito di handle per restituire valori creati all'interno di un particolare ambito di handle a un ambito padre.

#### `napi_ref` {#napi_ref}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

Questa è l'astrazione da utilizzare per fare riferimento a un `napi_value`. Ciò consente agli utenti di gestire la durata dei valori JavaScript, inclusa la definizione esplicita delle loro durate minime.

Per maggiori dettagli, rivedere la [Gestione della durata degli oggetti](/it/nodejs/api/n-api#object-lifetime-management).

#### `napi_type_tag` {#napi_type_tag}

**Aggiunto in: v14.8.0, v12.19.0**

**Versione N-API: 8**

Un valore a 128 bit memorizzato come due interi senza segno a 64 bit. Funge da UUID con cui gli oggetti JavaScript o gli [`externals`](/it/nodejs/api/n-api#napi_create_external) possono essere "taggati" al fine di garantire che siano di un certo tipo. Questo è un controllo più forte di [`napi_instanceof`](/it/nodejs/api/n-api#napi_instanceof), perché quest'ultimo può segnalare un falso positivo se il prototipo dell'oggetto è stato manipolato. Il tagging del tipo è più utile in combinazione con [`napi_wrap`](/it/nodejs/api/n-api#napi_wrap) perché garantisce che il puntatore recuperato da un oggetto avvolto possa essere tranquillamente convertito nel tipo nativo corrispondente al tag di tipo che era stato precedentemente applicato all'oggetto JavaScript.

```C [C]
typedef struct {
  uint64_t lower;
  uint64_t upper;
} napi_type_tag;
```
#### `napi_async_cleanup_hook_handle` {#napi_async_cleanup_hook_handle}

**Aggiunto in: v14.10.0, v12.19.0**

Un valore opaco restituito da [`napi_add_async_cleanup_hook`](/it/nodejs/api/n-api#napi_add_async_cleanup_hook). Deve essere passato a [`napi_remove_async_cleanup_hook`](/it/nodejs/api/n-api#napi_remove_async_cleanup_hook) quando la catena di eventi di pulizia asincrona è completa.

### Tipi di callback Node-API {#node-api-callback-types}

#### `napi_callback_info` {#napi_callback_info}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

Tipo di dati opaco che viene passato a una funzione di callback. Può essere utilizzato per ottenere ulteriori informazioni sul contesto in cui è stata richiamata la callback.

#### `napi_callback` {#napi_callback}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

Tipo di puntatore a funzione per le funzioni native fornite dall'utente che devono essere esposte a JavaScript tramite Node-API. Le funzioni di callback devono soddisfare la seguente firma:

```C [C]
typedef napi_value (*napi_callback)(napi_env, napi_callback_info);
```
A meno che per i motivi discussi in [Gestione della durata degli oggetti](/it/nodejs/api/n-api#object-lifetime-management), la creazione di un ambito di handle e/o di callback all'interno di una `napi_callback` non è necessaria.


#### `node_api_basic_finalize` {#node_api_basic_finalize}

**Aggiunto in: v21.6.0, v20.12.0, v18.20.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

Tipo di puntatore a funzione per funzioni fornite da componenti aggiuntivi che consentono all'utente di essere avvisato quando i dati di proprietà esterna sono pronti per essere puliti perché l'oggetto a cui erano associati è stato raccolto come spazzatura. L'utente deve fornire una funzione che soddisfi la seguente firma che verrebbe chiamata al momento della raccolta dell'oggetto. Attualmente, `node_api_basic_finalize` può essere utilizzato per scoprire quando gli oggetti che hanno dati esterni vengono raccolti.

```C [C]
typedef void (*node_api_basic_finalize)(node_api_basic_env env,
                                      void* finalize_data,
                                      void* finalize_hint);
```

A meno che per motivi discussi in [Gestione della durata dell'oggetto](/it/nodejs/api/n-api#object-lifetime-management), non è necessario creare un handle e/o un ambito di callback all'interno del corpo della funzione.

Poiché queste funzioni possono essere chiamate mentre il motore JavaScript è in uno stato in cui non può eseguire codice JavaScript, possono essere chiamate solo le Node-API che accettano un `node_api_basic_env` come primo parametro. [`node_api_post_finalizer`](/it/nodejs/api/n-api#node_api_post_finalizer) può essere utilizzato per pianificare chiamate Node-API che richiedono l'accesso allo stato del motore JavaScript per essere eseguite dopo che il ciclo di garbage collection corrente è stato completato.

Nel caso di [`node_api_create_external_string_latin1`](/it/nodejs/api/n-api#node_api_create_external_string_latin1) e [`node_api_create_external_string_utf16`](/it/nodejs/api/n-api#node_api_create_external_string_utf16) il parametro `env` può essere nullo, perché le stringhe esterne possono essere raccolte durante l'ultima parte dell'arresto dell'ambiente.

Cronologia delle modifiche:

- sperimentale (`NAPI_EXPERIMENTAL`): Possono essere chiamate solo le chiamate Node-API che accettano un `node_api_basic_env` come primo parametro, altrimenti l'applicazione verrà terminata con un messaggio di errore appropriato. Questa funzionalità può essere disattivata definendo `NODE_API_EXPERIMENTAL_BASIC_ENV_OPT_OUT`.


#### `napi_finalize` {#napi_finalize}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

Tipo di puntatore a funzione per la funzione fornita dall'add-on che consente all'utente di pianificare un gruppo di chiamate alle Node-API in risposta a un evento di garbage collection, dopo che il ciclo di garbage collection è stato completato. Questi puntatori a funzione possono essere utilizzati con [`node_api_post_finalizer`](/it/nodejs/api/n-api#node_api_post_finalizer).

```C [C]
typedef void (*napi_finalize)(napi_env env,
                              void* finalize_data,
                              void* finalize_hint);
```
Cronologia delle modifiche:

-  sperimentale (`NAPI_EXPERIMENTAL` è definito): una funzione di questo tipo potrebbe non essere più utilizzata come finalizzatore, tranne che con [`node_api_post_finalizer`](/it/nodejs/api/n-api#node_api_post_finalizer). Deve essere utilizzato invece [`node_api_basic_finalize`](/it/nodejs/api/n-api#node_api_basic_finalize). Questa funzionalità può essere disattivata definendo `NODE_API_EXPERIMENTAL_BASIC_ENV_OPT_OUT`.

#### `napi_async_execute_callback` {#napi_async_execute_callback}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

Puntatore a funzione utilizzato con funzioni che supportano operazioni asincrone. Le funzioni di callback devono soddisfare la seguente firma:

```C [C]
typedef void (*napi_async_execute_callback)(napi_env env, void* data);
```
Le implementazioni di questa funzione devono evitare di effettuare chiamate Node-API che eseguono JavaScript o interagiscono con oggetti JavaScript. Le chiamate Node-API dovrebbero essere invece nella `napi_async_complete_callback`. Non utilizzare il parametro `napi_env` in quanto probabilmente comporterà l'esecuzione di JavaScript.

#### `napi_async_complete_callback` {#napi_async_complete_callback}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

Puntatore a funzione utilizzato con funzioni che supportano operazioni asincrone. Le funzioni di callback devono soddisfare la seguente firma:

```C [C]
typedef void (*napi_async_complete_callback)(napi_env env,
                                             napi_status status,
                                             void* data);
```
A meno che per motivi discussi in [Gestione del ciclo di vita degli oggetti](/it/nodejs/api/n-api#object-lifetime-management), non è necessario creare un handle e/o uno scope di callback all'interno del corpo della funzione.


#### `napi_threadsafe_function_call_js` {#napi_threadsafe_function_call_js}

**Aggiunto in: v10.6.0**

**Versione N-API: 4**

Puntatore a funzione utilizzato con chiamate di funzione asincrone thread-safe. La callback verrà chiamata sul thread principale. Il suo scopo è utilizzare un elemento dati che arriva tramite la coda da uno dei thread secondari per costruire i parametri necessari per una chiamata in JavaScript, solitamente tramite `napi_call_function`, e quindi effettuare la chiamata in JavaScript.

I dati che arrivano dal thread secondario tramite la coda sono forniti nel parametro `data` e la funzione JavaScript da chiamare è fornita nel parametro `js_callback`.

Node-API imposta l'ambiente prima di chiamare questa callback, quindi è sufficiente chiamare la funzione JavaScript tramite `napi_call_function` piuttosto che tramite `napi_make_callback`.

Le funzioni di callback devono soddisfare la seguente firma:

```C [C]
typedef void (*napi_threadsafe_function_call_js)(napi_env env,
                                                 napi_value js_callback,
                                                 void* context,
                                                 void* data);
```
- `[in] env`: L'ambiente da utilizzare per le chiamate API, o `NULL` se la funzione thread-safe viene smantellata e `data` potrebbe dover essere liberato.
- `[in] js_callback`: La funzione JavaScript da chiamare, o `NULL` se la funzione thread-safe viene smantellata e `data` potrebbe dover essere liberato. Può anche essere `NULL` se la funzione thread-safe è stata creata senza `js_callback`.
- `[in] context`: I dati opzionali con cui è stata creata la funzione thread-safe.
- `[in] data`: Dati creati dal thread secondario. È responsabilità della callback convertire questi dati nativi in valori JavaScript (con le funzioni Node-API) che possono essere passati come parametri quando viene invocata `js_callback`. Questo puntatore è gestito interamente dai thread e da questa callback. Pertanto, questa callback dovrebbe liberare i dati.

A meno che per motivi discussi in [Gestione del ciclo di vita degli oggetti](/it/nodejs/api/n-api#object-lifetime-management), non è necessario creare un handle e/o uno scope di callback all'interno del corpo della funzione.


#### `napi_cleanup_hook` {#napi_cleanup_hook}

**Aggiunta in: v19.2.0, v18.13.0**

**Versione N-API: 3**

Puntatore a funzione utilizzato con [`napi_add_env_cleanup_hook`](/it/nodejs/api/n-api#napi_add_env_cleanup_hook). Sarà chiamata quando l'ambiente viene smantellato.

Le funzioni di callback devono soddisfare la seguente firma:

```C [C]
typedef void (*napi_cleanup_hook)(void* data);
```
- `[in] data`: I dati che sono stati passati a [`napi_add_env_cleanup_hook`](/it/nodejs/api/n-api#napi_add_env_cleanup_hook).

#### `napi_async_cleanup_hook` {#napi_async_cleanup_hook}

**Aggiunta in: v14.10.0, v12.19.0**

Puntatore a funzione utilizzato con [`napi_add_async_cleanup_hook`](/it/nodejs/api/n-api#napi_add_async_cleanup_hook). Sarà chiamata quando l'ambiente viene smantellato.

Le funzioni di callback devono soddisfare la seguente firma:

```C [C]
typedef void (*napi_async_cleanup_hook)(napi_async_cleanup_hook_handle handle,
                                        void* data);
```
- `[in] handle`: L'handle che deve essere passato a [`napi_remove_async_cleanup_hook`](/it/nodejs/api/n-api#napi_remove_async_cleanup_hook) dopo il completamento della pulizia asincrona.
- `[in] data`: I dati che sono stati passati a [`napi_add_async_cleanup_hook`](/it/nodejs/api/n-api#napi_add_async_cleanup_hook).

Il corpo della funzione deve avviare le azioni di pulizia asincrona al termine delle quali `handle` deve essere passato in una chiamata a [`napi_remove_async_cleanup_hook`](/it/nodejs/api/n-api#napi_remove_async_cleanup_hook).

## Gestione degli errori {#error-handling}

Node-API utilizza sia i valori di ritorno che le eccezioni JavaScript per la gestione degli errori. Le seguenti sezioni spiegano l'approccio per ciascun caso.

### Valori di ritorno {#return-values}

Tutte le funzioni Node-API condividono lo stesso modello di gestione degli errori. Il tipo di ritorno di tutte le funzioni API è `napi_status`.

Il valore di ritorno sarà `napi_ok` se la richiesta ha avuto successo e non è stata generata alcuna eccezione JavaScript non gestita. Se si è verificato un errore E un'eccezione è stata generata, verrà restituito il valore `napi_status` per l'errore. Se un'eccezione è stata generata e non si è verificato alcun errore, verrà restituito `napi_pending_exception`.

Nei casi in cui viene restituito un valore di ritorno diverso da `napi_ok` o `napi_pending_exception`, è necessario chiamare [`napi_is_exception_pending`](/it/nodejs/api/n-api#napi_is_exception_pending) per verificare se è in sospeso un'eccezione. Vedere la sezione sulle eccezioni per maggiori dettagli.

L'insieme completo di possibili valori `napi_status` è definito in `napi_api_types.h`.

Il valore di ritorno `napi_status` fornisce una rappresentazione indipendente dalla VM dell'errore che si è verificato. In alcuni casi, è utile essere in grado di ottenere informazioni più dettagliate, inclusa una stringa che rappresenta l'errore e informazioni specifiche della VM (motore).

Per recuperare queste informazioni, viene fornito [`napi_get_last_error_info`](/it/nodejs/api/n-api#napi_get_last_error_info) che restituisce una struttura `napi_extended_error_info`. Il formato della struttura `napi_extended_error_info` è il seguente:

**Aggiunta in: v8.0.0**

**Versione N-API: 1**

```C [C]
typedef struct napi_extended_error_info {
  const char* error_message;
  void* engine_reserved;
  uint32_t engine_error_code;
  napi_status error_code;
};
```
- `error_message`: Rappresentazione testuale dell'errore che si è verificato.
- `engine_reserved`: Handle opaco riservato esclusivamente all'uso del motore.
- `engine_error_code`: Codice di errore specifico della VM.
- `error_code`: Codice di stato Node-API per l'ultimo errore.

[`napi_get_last_error_info`](/it/nodejs/api/n-api#napi_get_last_error_info) restituisce le informazioni per l'ultima chiamata Node-API effettuata.

Non fare affidamento sul contenuto o sul formato di nessuna delle informazioni estese in quanto non sono soggette a SemVer e possono cambiare in qualsiasi momento. Sono destinati solo a scopi di registrazione.


#### `napi_get_last_error_info` {#napi_get_last_error_info}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status
napi_get_last_error_info(node_api_basic_env env,
                         const napi_extended_error_info** result);
```
- `[in] env`: L'ambiente in cui viene invocata l'API.
- `[out] result`: La struttura `napi_extended_error_info` con maggiori informazioni sull'errore.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API recupera una struttura `napi_extended_error_info` con informazioni sull'ultimo errore che si è verificato.

Il contenuto di `napi_extended_error_info` restituito è valido solo fino a quando una funzione Node-API viene chiamata nello stesso `env`. Questo include una chiamata a `napi_is_exception_pending`, quindi potrebbe essere spesso necessario fare una copia delle informazioni in modo che possano essere utilizzate in seguito. Il puntatore restituito in `error_message` punta a una stringa definita staticamente, quindi è sicuro usare quel puntatore se lo si è copiato fuori dal campo `error_message` (che verrà sovrascritto) prima che venisse chiamata un'altra funzione Node-API.

Non fare affidamento sul contenuto o sul formato di nessuna delle informazioni estese poiché non sono soggette a SemVer e possono cambiare in qualsiasi momento. È inteso solo per scopi di registrazione.

Questa API può essere chiamata anche se è presente un'eccezione JavaScript in sospeso.

### Eccezioni {#exceptions}

Qualsiasi chiamata di funzione Node-API può comportare un'eccezione JavaScript in sospeso. Questo è il caso per qualsiasi funzione API, anche quelle che potrebbero non causare l'esecuzione di JavaScript.

Se il `napi_status` restituito da una funzione è `napi_ok`, allora non ci sono eccezioni in sospeso e non è richiesta alcuna azione aggiuntiva. Se il `napi_status` restituito è diverso da `napi_ok` o `napi_pending_exception`, per provare a ripristinare e continuare invece di restituire semplicemente immediatamente, deve essere chiamato [`napi_is_exception_pending`](/it/nodejs/api/n-api#napi_is_exception_pending) per determinare se un'eccezione è in sospeso o meno.

In molti casi, quando viene chiamata una funzione Node-API e un'eccezione è già in sospeso, la funzione restituirà immediatamente un `napi_status` di `napi_pending_exception`. Tuttavia, questo non è il caso per tutte le funzioni. Node-API consente a un sottoinsieme delle funzioni di essere chiamate per consentire una pulizia minima prima di tornare a JavaScript. In tal caso, `napi_status` rifletterà lo stato della funzione. Non rifletterà le precedenti eccezioni in sospeso. Per evitare confusione, controllare lo stato dell'errore dopo ogni chiamata di funzione.

Quando un'eccezione è in sospeso, è possibile utilizzare uno dei due approcci.

Il primo approccio consiste nell'eseguire qualsiasi pulizia appropriata e quindi tornare in modo che l'esecuzione torni a JavaScript. Come parte della transizione di ritorno a JavaScript, l'eccezione verrà lanciata nel punto del codice JavaScript in cui è stato invocato il metodo nativo. Il comportamento della maggior parte delle chiamate Node-API non è specificato mentre un'eccezione è in sospeso e molte restituiranno semplicemente `napi_pending_exception`, quindi fare il meno possibile e quindi tornare a JavaScript dove l'eccezione può essere gestita.

Il secondo approccio consiste nel cercare di gestire l'eccezione. Ci saranno casi in cui il codice nativo può intercettare l'eccezione, intraprendere l'azione appropriata e quindi continuare. Questo è consigliato solo in casi specifici in cui è noto che l'eccezione può essere gestita in modo sicuro. In questi casi [`napi_get_and_clear_last_exception`](/it/nodejs/api/n-api#napi_get_and_clear_last_exception) può essere utilizzato per ottenere e cancellare l'eccezione. In caso di successo, il risultato conterrà l'handle dell'ultimo `Object` JavaScript lanciato. Se si determina, dopo aver recuperato l'eccezione, che l'eccezione non può essere gestita, può essere rilanciata con [`napi_throw`](/it/nodejs/api/n-api#napi_throw) dove error è il valore JavaScript da lanciare.

Le seguenti funzioni di utilità sono anche disponibili nel caso in cui il codice nativo debba lanciare un'eccezione o determinare se un `napi_value` è un'istanza di un oggetto JavaScript `Error`: [`napi_throw_error`](/it/nodejs/api/n-api#napi_throw_error), [`napi_throw_type_error`](/it/nodejs/api/n-api#napi_throw_type_error), [`napi_throw_range_error`](/it/nodejs/api/n-api#napi_throw_range_error), [`node_api_throw_syntax_error`](/it/nodejs/api/n-api#node_api_throw_syntax_error) e [`napi_is_error`](/it/nodejs/api/n-api#napi_is_error).

Le seguenti funzioni di utilità sono anche disponibili nel caso in cui il codice nativo debba creare un oggetto `Error`: [`napi_create_error`](/it/nodejs/api/n-api#napi_create_error), [`napi_create_type_error`](/it/nodejs/api/n-api#napi_create_type_error), [`napi_create_range_error`](/it/nodejs/api/n-api#napi_create_range_error) e [`node_api_create_syntax_error`](/it/nodejs/api/n-api#node_api_create_syntax_error), dove result è il `napi_value` che fa riferimento all'oggetto JavaScript `Error` appena creato.

Il progetto Node.js sta aggiungendo codici di errore a tutti gli errori generati internamente. L'obiettivo è che le applicazioni utilizzino questi codici di errore per tutti i controlli degli errori. I messaggi di errore associati rimarranno, ma saranno intesi solo per essere utilizzati per la registrazione e la visualizzazione, con l'aspettativa che il messaggio possa cambiare senza che venga applicato SemVer. Al fine di supportare questo modello con Node-API, sia nella funzionalità interna che per la funzionalità specifica del modulo (come è una buona pratica), le funzioni `throw_` e `create_` accettano un parametro di codice opzionale che è la stringa per il codice da aggiungere all'oggetto error. Se il parametro opzionale è `NULL`, nessun codice verrà associato all'errore. Se viene fornito un codice, anche il nome associato all'errore viene aggiornato per essere:

```text [TEXT]
originalName [code]
```
dove `originalName` è il nome originale associato all'errore e `code` è il codice che è stato fornito. Ad esempio, se il codice è `'ERR_ERROR_1'` e viene creato un `TypeError`, il nome sarà:

```text [TEXT]
TypeError [ERR_ERROR_1]
```

#### `napi_throw` {#napi_throw}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_throw(napi_env env, napi_value error);
```
- `[in] env`: L'ambiente in cui viene richiamata l'API.
- `[in] error`: Il valore JavaScript da lanciare.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API lancia il valore JavaScript fornito.

#### `napi_throw_error` {#napi_throw_error}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_throw_error(napi_env env,
                                         const char* code,
                                         const char* msg);
```
- `[in] env`: L'ambiente in cui viene richiamata l'API.
- `[in] code`: Codice di errore opzionale da impostare sull'errore.
- `[in] msg`: Stringa C che rappresenta il testo da associare all'errore.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API lancia un `Error` JavaScript con il testo fornito.

#### `napi_throw_type_error` {#napi_throw_type_error}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_throw_type_error(napi_env env,
                                              const char* code,
                                              const char* msg);
```
- `[in] env`: L'ambiente in cui viene richiamata l'API.
- `[in] code`: Codice di errore opzionale da impostare sull'errore.
- `[in] msg`: Stringa C che rappresenta il testo da associare all'errore.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API lancia un `TypeError` JavaScript con il testo fornito.

#### `napi_throw_range_error` {#napi_throw_range_error}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_throw_range_error(napi_env env,
                                               const char* code,
                                               const char* msg);
```
- `[in] env`: L'ambiente in cui viene richiamata l'API.
- `[in] code`: Codice di errore opzionale da impostare sull'errore.
- `[in] msg`: Stringa C che rappresenta il testo da associare all'errore.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API lancia un `RangeError` JavaScript con il testo fornito.


#### `node_api_throw_syntax_error` {#node_api_throw_syntax_error}

**Aggiunto in: v17.2.0, v16.14.0**

**Versione N-API: 9**

```C [C]
NAPI_EXTERN napi_status node_api_throw_syntax_error(napi_env env,
                                                    const char* code,
                                                    const char* msg);
```
- `[in] env`: L'ambiente in cui viene richiamata l'API.
- `[in] code`: Codice di errore opzionale da impostare sull'errore.
- `[in] msg`: Stringa C che rappresenta il testo da associare all'errore.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API genera un `SyntaxError` JavaScript con il testo fornito.

#### `napi_is_error` {#napi_is_error}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_is_error(napi_env env,
                                      napi_value value,
                                      bool* result);
```
- `[in] env`: L'ambiente in cui viene richiamata l'API.
- `[in] value`: Il `napi_value` da controllare.
- `[out] result`: Valore booleano impostato su true se `napi_value` rappresenta un errore, false altrimenti.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API interroga un `napi_value` per verificare se rappresenta un oggetto errore.

#### `napi_create_error` {#napi_create_error}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_create_error(napi_env env,
                                          napi_value code,
                                          napi_value msg,
                                          napi_value* result);
```
- `[in] env`: L'ambiente in cui viene richiamata l'API.
- `[in] code`: `napi_value` opzionale con la stringa per il codice di errore da associare all'errore.
- `[in] msg`: `napi_value` che fa riferimento a una `string` JavaScript da utilizzare come messaggio per l'`Error`.
- `[out] result`: `napi_value` che rappresenta l'errore creato.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API restituisce un `Error` JavaScript con il testo fornito.

#### `napi_create_type_error` {#napi_create_type_error}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_create_type_error(napi_env env,
                                               napi_value code,
                                               napi_value msg,
                                               napi_value* result);
```
- `[in] env`: L'ambiente in cui viene richiamata l'API.
- `[in] code`: `napi_value` opzionale con la stringa per il codice di errore da associare all'errore.
- `[in] msg`: `napi_value` che fa riferimento a una `string` JavaScript da utilizzare come messaggio per l'`Error`.
- `[out] result`: `napi_value` che rappresenta l'errore creato.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API restituisce un `TypeError` JavaScript con il testo fornito.


#### `napi_create_range_error` {#napi_create_range_error}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_create_range_error(napi_env env,
                                                napi_value code,
                                                napi_value msg,
                                                napi_value* result);
```
- `[in] env`: L'ambiente in cui viene invocata l'API.
- `[in] code`: `napi_value` opzionale con la stringa per il codice di errore da associare all'errore.
- `[in] msg`: `napi_value` che fa riferimento a una `stringa` JavaScript da utilizzare come messaggio per l'`Error`.
- `[out] result`: `napi_value` che rappresenta l'errore creato.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API restituisce un `RangeError` JavaScript con il testo fornito.

#### `node_api_create_syntax_error` {#node_api_create_syntax_error}

**Aggiunto in: v17.2.0, v16.14.0**

**Versione N-API: 9**

```C [C]
NAPI_EXTERN napi_status node_api_create_syntax_error(napi_env env,
                                                     napi_value code,
                                                     napi_value msg,
                                                     napi_value* result);
```
- `[in] env`: L'ambiente in cui viene invocata l'API.
- `[in] code`: `napi_value` opzionale con la stringa per il codice di errore da associare all'errore.
- `[in] msg`: `napi_value` che fa riferimento a una `stringa` JavaScript da utilizzare come messaggio per l'`Error`.
- `[out] result`: `napi_value` che rappresenta l'errore creato.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API restituisce un `SyntaxError` JavaScript con il testo fornito.

#### `napi_get_and_clear_last_exception` {#napi_get_and_clear_last_exception}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status napi_get_and_clear_last_exception(napi_env env,
                                              napi_value* result);
```
- `[in] env`: L'ambiente in cui viene invocata l'API.
- `[out] result`: L'eccezione se ne è presente una in sospeso, `NULL` altrimenti.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API può essere chiamata anche se è presente un'eccezione JavaScript in sospeso.


#### `napi_is_exception_pending` {#napi_is_exception_pending}

**Aggiunta in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status napi_is_exception_pending(napi_env env, bool* result);
```
- `[in] env`: L'ambiente in cui viene richiamata l'API.
- `[out] result`: Valore booleano impostato su true se è in sospeso un'eccezione.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API può essere chiamata anche se è presente un'eccezione JavaScript in sospeso.

#### `napi_fatal_exception` {#napi_fatal_exception}

**Aggiunta in: v9.10.0**

**Versione N-API: 3**

```C [C]
napi_status napi_fatal_exception(napi_env env, napi_value err);
```
- `[in] env`: L'ambiente in cui viene richiamata l'API.
- `[in] err`: L'errore passato a `'uncaughtException'`.

Attiva un'eccezione `'uncaughtException'` in JavaScript. Utile se un callback asincrono genera un'eccezione senza possibilità di ripristino.

### Errori irreversibili {#fatal-errors}

In caso di errore irreversibile in un addon nativo, è possibile generare un errore irreversibile per terminare immediatamente il processo.

#### `napi_fatal_error` {#napi_fatal_error}

**Aggiunta in: v8.2.0**

**Versione N-API: 1**

```C [C]
NAPI_NO_RETURN void napi_fatal_error(const char* location,
                                     size_t location_len,
                                     const char* message,
                                     size_t message_len);
```
- `[in] location`: Posizione facoltativa in cui si è verificato l'errore.
- `[in] location_len`: La lunghezza della posizione in byte oppure `NAPI_AUTO_LENGTH` se è terminata con null.
- `[in] message`: Il messaggio associato all'errore.
- `[in] message_len`: La lunghezza del messaggio in byte oppure `NAPI_AUTO_LENGTH` se è terminato con null.

La chiamata di funzione non ritorna, il processo verrà terminato.

Questa API può essere chiamata anche se è presente un'eccezione JavaScript in sospeso.

## Gestione della durata degli oggetti {#object-lifetime-management}

Man mano che vengono effettuate chiamate Node-API, gli handle agli oggetti nell'heap per la VM sottostante possono essere restituiti come `napi_values`. Questi handle devono mantenere gli oggetti "attivi" fino a quando non sono più necessari al codice nativo, altrimenti gli oggetti potrebbero essere raccolti prima che il codice nativo abbia finito di utilizzarli.

Man mano che gli handle degli oggetti vengono restituiti, sono associati a un "ambito". La durata dell'ambito predefinito è legata alla durata della chiamata al metodo nativo. Il risultato è che, per impostazione predefinita, gli handle rimangono validi e gli oggetti associati a questi handle verranno mantenuti attivi per la durata della chiamata al metodo nativo.

In molti casi, tuttavia, è necessario che gli handle rimangano validi per una durata inferiore o superiore a quella del metodo nativo. Le sezioni che seguono descrivono le funzioni Node-API che possono essere utilizzate per modificare la durata dell'handle rispetto a quella predefinita.


### Ridurre la durata dell'handle rispetto a quella del metodo nativo {#making-handle-lifespan-shorter-than-that-of-the-native-method}

Spesso è necessario ridurre la durata degli handle rispetto alla durata di un metodo nativo. Ad esempio, si consideri un metodo nativo che ha un ciclo che scorre gli elementi di un grande array:

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
Ciò comporterebbe la creazione di un gran numero di handle, consumando risorse considerevoli. Inoltre, anche se il codice nativo potesse utilizzare solo l'handle più recente, tutti gli oggetti associati verrebbero mantenuti in vita poiché condividono tutti lo stesso scope.

Per gestire questo caso, Node-API offre la possibilità di stabilire un nuovo 'scope' a cui saranno associati gli handle appena creati. Una volta che tali handle non sono più necessari, lo scope può essere 'chiuso' e tutti gli handle associati allo scope vengono invalidati. I metodi disponibili per aprire/chiudere gli scope sono [`napi_open_handle_scope`](/it/nodejs/api/n-api#napi_open_handle_scope) e [`napi_close_handle_scope`](/it/nodejs/api/n-api#napi_close_handle_scope).

Node-API supporta solo una singola gerarchia nidificata di scope. C'è solo uno scope attivo in qualsiasi momento e tutti i nuovi handle saranno associati a tale scope mentre è attivo. Gli scope devono essere chiusi nell'ordine inverso rispetto a quello in cui sono stati aperti. Inoltre, tutti gli scope creati all'interno di un metodo nativo devono essere chiusi prima di ritornare da quel metodo.

Riprendendo l'esempio precedente, l'aggiunta di chiamate a [`napi_open_handle_scope`](/it/nodejs/api/n-api#napi_open_handle_scope) e [`napi_close_handle_scope`](/it/nodejs/api/n-api#napi_close_handle_scope) garantirebbe che al massimo un singolo handle sia valido durante l'esecuzione del ciclo:

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
Quando si annidano gli scope, ci sono casi in cui un handle di uno scope interno deve sopravvivere alla durata di tale scope. Node-API supporta uno 'scope escapabile' per supportare questo caso. Uno scope escapabile consente a un handle di essere 'promosso' in modo che 'sfugga' allo scope corrente e la durata dell'handle cambi dallo scope corrente a quello dello scope esterno.

I metodi disponibili per aprire/chiudere gli scope escapabili sono [`napi_open_escapable_handle_scope`](/it/nodejs/api/n-api#napi_open_escapable_handle_scope) e [`napi_close_escapable_handle_scope`](/it/nodejs/api/n-api#napi_close_escapable_handle_scope).

La richiesta di promuovere un handle viene effettuata tramite [`napi_escape_handle`](/it/nodejs/api/n-api#napi_escape_handle) che può essere chiamato una sola volta.


#### `napi_open_handle_scope` {#napi_open_handle_scope}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_open_handle_scope(napi_env env,
                                               napi_handle_scope* result);
```
- `[in] env`: L'ambiente in cui viene invocata l'API.
- `[out] result`: `napi_value` che rappresenta il nuovo scope.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API apre un nuovo scope.

#### `napi_close_handle_scope` {#napi_close_handle_scope}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_close_handle_scope(napi_env env,
                                                napi_handle_scope scope);
```
- `[in] env`: L'ambiente in cui viene invocata l'API.
- `[in] scope`: `napi_value` che rappresenta lo scope da chiudere.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API chiude lo scope passato. Gli scope devono essere chiusi nell'ordine inverso rispetto a quello in cui sono stati creati.

Questa API può essere chiamata anche se è presente un'eccezione JavaScript in sospeso.

#### `napi_open_escapable_handle_scope` {#napi_open_escapable_handle_scope}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
NAPI_EXTERN napi_status
    napi_open_escapable_handle_scope(napi_env env,
                                     napi_handle_scope* result);
```
- `[in] env`: L'ambiente in cui viene invocata l'API.
- `[out] result`: `napi_value` che rappresenta il nuovo scope.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API apre un nuovo scope da cui un oggetto può essere promosso allo scope esterno.

#### `napi_close_escapable_handle_scope` {#napi_close_escapable_handle_scope}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
NAPI_EXTERN napi_status
    napi_close_escapable_handle_scope(napi_env env,
                                      napi_handle_scope scope);
```
- `[in] env`: L'ambiente in cui viene invocata l'API.
- `[in] scope`: `napi_value` che rappresenta lo scope da chiudere.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API chiude lo scope passato. Gli scope devono essere chiusi nell'ordine inverso rispetto a quello in cui sono stati creati.

Questa API può essere chiamata anche se è presente un'eccezione JavaScript in sospeso.


#### `napi_escape_handle` {#napi_escape_handle}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status napi_escape_handle(napi_env env,
                               napi_escapable_handle_scope scope,
                               napi_value escapee,
                               napi_value* result);
```
- `[in] env`: L'ambiente in cui viene invocata l'API.
- `[in] scope`: `napi_value` che rappresenta l'ambito corrente.
- `[in] escapee`: `napi_value` che rappresenta l'`Object` JavaScript da rilasciare.
- `[out] result`: `napi_value` che rappresenta l'handle per l'`Object` rilasciato nell'ambito esterno.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API promuove l'handle all'oggetto JavaScript in modo che sia valido per tutta la durata dell'ambito esterno. Può essere chiamato solo una volta per ambito. Se viene chiamato più di una volta, verrà restituito un errore.

Questa API può essere chiamata anche se è presente un'eccezione JavaScript in sospeso.

### Riferimenti a valori con una durata maggiore di quella del metodo nativo {#references-to-values-with-a-lifespan-longer-than-that-of-the-native-method}

In alcuni casi, un addon dovrà essere in grado di creare e fare riferimento a valori con una durata maggiore di quella di una singola invocazione di metodo nativo. Ad esempio, per creare un costruttore e successivamente utilizzare tale costruttore in una richiesta per creare istanze, deve essere possibile fare riferimento all'oggetto costruttore attraverso molte richieste di creazione di istanze diverse. Ciò non sarebbe possibile con un normale handle restituito come `napi_value` come descritto nella sezione precedente. La durata di un normale handle è gestita dagli ambiti e tutti gli ambiti devono essere chiusi prima della fine di un metodo nativo.

Node-API fornisce metodi per la creazione di riferimenti permanenti ai valori. Attualmente Node-API consente la creazione di riferimenti solo per un insieme limitato di tipi di valore, tra cui object, external, function e symbol.

Ogni riferimento ha un conteggio associato con un valore pari o superiore a 0, che determina se il riferimento manterrà attivo il valore corrispondente. I riferimenti con un conteggio pari a 0 non impediscono la raccolta dei valori. I valori di tipo object (object, function, external) e symbol stanno diventando riferimenti "deboli" e sono ancora accessibili finché non vengono raccolti. Qualsiasi conteggio maggiore di 0 impedirà la raccolta dei valori.

I valori Symbol hanno diversi tipi. Il vero comportamento di riferimento debole è supportato solo dai simboli locali creati con la funzione `napi_create_symbol` o le chiamate al costruttore JavaScript `Symbol()`. I simboli registrati globalmente creati con la funzione `node_api_symbol_for` o le chiamate alla funzione JavaScript `Symbol.for()` rimangono sempre riferimenti forti perché il garbage collector non li raccoglie. Lo stesso vale per i simboli noti come `Symbol.iterator`. Inoltre, non vengono mai raccolti dal garbage collector.

È possibile creare riferimenti con un conteggio iniziale di riferimenti. Il conteggio può quindi essere modificato tramite [`napi_reference_ref`](/it/nodejs/api/n-api#napi_reference_ref) e [`napi_reference_unref`](/it/nodejs/api/n-api#napi_reference_unref). Se un oggetto viene raccolto mentre il conteggio per un riferimento è 0, tutte le chiamate successive per ottenere l'oggetto associato al riferimento [`napi_get_reference_value`](/it/nodejs/api/n-api#napi_get_reference_value) restituiranno `NULL` per il `napi_value` restituito. Un tentativo di chiamare [`napi_reference_ref`](/it/nodejs/api/n-api#napi_reference_ref) per un riferimento il cui oggetto è stato raccolto provoca un errore.

I riferimenti devono essere eliminati una volta che non sono più necessari per l'addon. Quando un riferimento viene eliminato, non impedirà più la raccolta dell'oggetto corrispondente. La mancata eliminazione di un riferimento persistente si traduce in una "perdita di memoria" con sia la memoria nativa per il riferimento persistente sia l'oggetto corrispondente sull'heap che vengono conservati per sempre.

È possibile creare più riferimenti persistenti che fanno riferimento allo stesso oggetto, ognuno dei quali manterrà attivo l'oggetto o meno in base al suo conteggio individuale. Più riferimenti persistenti allo stesso oggetto possono comportare la conservazione inaspettata della memoria nativa. Le strutture native per un riferimento persistente devono essere mantenute attive fino a quando non vengono eseguiti i finalizzatori per l'oggetto a cui si fa riferimento. Se viene creato un nuovo riferimento persistente per lo stesso oggetto, i finalizzatori per tale oggetto non verranno eseguiti e la memoria nativa puntata dal precedente riferimento persistente non verrà liberata. Ciò può essere evitato chiamando `napi_delete_reference` in aggiunta a `napi_reference_unref` quando possibile.

**Cronologia delle modifiche:**

- Sperimentale (`NAPI_EXPERIMENTAL` è definito): è possibile creare riferimenti per tutti i tipi di valore. I nuovi tipi di valore supportati non supportano la semantica di riferimento debole e i valori di questi tipi vengono rilasciati quando il conteggio dei riferimenti diventa 0 e non è più possibile accedervi dal riferimento.


#### `napi_create_reference` {#napi_create_reference}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_create_reference(napi_env env,
                                              napi_value value,
                                              uint32_t initial_refcount,
                                              napi_ref* result);
```
- `[in] env`: L'ambiente in cui viene richiamata l'API.
- `[in] value`: Il `napi_value` per cui viene creato un riferimento.
- `[in] initial_refcount`: Conteggio iniziale dei riferimenti per il nuovo riferimento.
- `[out] result`: `napi_ref` che punta al nuovo riferimento.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API crea un nuovo riferimento con il conteggio dei riferimenti specificato al valore passato.

#### `napi_delete_reference` {#napi_delete_reference}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_delete_reference(napi_env env, napi_ref ref);
```
- `[in] env`: L'ambiente in cui viene richiamata l'API.
- `[in] ref`: `napi_ref` da eliminare.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API elimina il riferimento passato.

Questa API può essere chiamata anche se è presente un'eccezione JavaScript in sospeso.

#### `napi_reference_ref` {#napi_reference_ref}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_reference_ref(napi_env env,
                                           napi_ref ref,
                                           uint32_t* result);
```
- `[in] env`: L'ambiente in cui viene richiamata l'API.
- `[in] ref`: `napi_ref` per cui verrà incrementato il conteggio dei riferimenti.
- `[out] result`: Il nuovo conteggio dei riferimenti.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API incrementa il conteggio dei riferimenti per il riferimento passato e restituisce il conteggio dei riferimenti risultante.

#### `napi_reference_unref` {#napi_reference_unref}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_reference_unref(napi_env env,
                                             napi_ref ref,
                                             uint32_t* result);
```
- `[in] env`: L'ambiente in cui viene richiamata l'API.
- `[in] ref`: `napi_ref` per cui verrà decrementato il conteggio dei riferimenti.
- `[out] result`: Il nuovo conteggio dei riferimenti.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API decrementa il conteggio dei riferimenti per il riferimento passato e restituisce il conteggio dei riferimenti risultante.


#### `napi_get_reference_value` {#napi_get_reference_value}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_get_reference_value(napi_env env,
                                                 napi_ref ref,
                                                 napi_value* result);
```
- `[in] env`: L'ambiente in cui viene richiamata l'API.
- `[in] ref`: Il `napi_ref` per il quale viene richiesto il valore corrispondente.
- `[out] result`: Il `napi_value` a cui fa riferimento `napi_ref`.

Restituisce `napi_ok` se l'API ha avuto successo.

Se ancora valido, questa API restituisce il `napi_value` che rappresenta il valore JavaScript associato al `napi_ref`. Altrimenti, il risultato sarà `NULL`.

### Pulizia all'uscita dell'ambiente Node.js corrente {#cleanup-on-exit-of-the-current-nodejs-environment}

Mentre un processo Node.js rilascia tipicamente tutte le sue risorse all'uscita, gli incorporatori di Node.js, o il futuro supporto di Worker, potrebbero richiedere agli addon di registrare hook di pulizia che verranno eseguiti una volta che l'ambiente Node.js corrente esce.

Node-API fornisce funzioni per registrare e annullare la registrazione di tali callback. Quando vengono eseguiti questi callback, tutte le risorse che vengono trattenute dall'addon devono essere liberate.

#### `napi_add_env_cleanup_hook` {#napi_add_env_cleanup_hook}

**Aggiunto in: v10.2.0**

**Versione N-API: 3**

```C [C]
NODE_EXTERN napi_status napi_add_env_cleanup_hook(node_api_basic_env env,
                                                  napi_cleanup_hook fun,
                                                  void* arg);
```
Registra `fun` come funzione da eseguire con il parametro `arg` una volta che l'ambiente Node.js corrente esce.

Una funzione può essere specificata in modo sicuro più volte con valori `arg` diversi. In tal caso, verrà chiamata anche più volte. Fornire gli stessi valori `fun` e `arg` più volte non è consentito e porterà all'interruzione del processo.

Gli hook verranno chiamati in ordine inverso, ovvero quello aggiunto più di recente verrà chiamato per primo.

La rimozione di questo hook può essere eseguita utilizzando [`napi_remove_env_cleanup_hook`](/it/nodejs/api/n-api#napi_remove_env_cleanup_hook). In genere, ciò accade quando la risorsa per la quale è stato aggiunto questo hook viene comunque smantellata.

Per la pulizia asincrona, è disponibile [`napi_add_async_cleanup_hook`](/it/nodejs/api/n-api#napi_add_async_cleanup_hook).


#### `napi_remove_env_cleanup_hook` {#napi_remove_env_cleanup_hook}

**Aggiunto in: v10.2.0**

**Versione N-API: 3**

```C [C]
NAPI_EXTERN napi_status napi_remove_env_cleanup_hook(node_api_basic_env env,
                                                     void (*fun)(void* arg),
                                                     void* arg);
```
Annulla la registrazione di `fun` come funzione da eseguire con il parametro `arg` una volta che l'ambiente Node.js corrente si chiude. Sia l'argomento che il valore della funzione devono corrispondere esattamente.

La funzione deve essere stata originariamente registrata con `napi_add_env_cleanup_hook`, altrimenti il processo verrà interrotto.

#### `napi_add_async_cleanup_hook` {#napi_add_async_cleanup_hook}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v14.10.0, v12.19.0 | Firma modificata del callback `hook`. |
| v14.8.0, v12.19.0 | Aggiunto in: v14.8.0, v12.19.0 |
:::

**Versione N-API: 8**

```C [C]
NAPI_EXTERN napi_status napi_add_async_cleanup_hook(
    node_api_basic_env env,
    napi_async_cleanup_hook hook,
    void* arg,
    napi_async_cleanup_hook_handle* remove_handle);
```
- `[in] env`: L'ambiente in cui viene richiamata l'API.
- `[in] hook`: Il puntatore di funzione da chiamare alla chiusura dell'ambiente.
- `[in] arg`: Il puntatore da passare a `hook` quando viene chiamato.
- `[out] remove_handle`: Handle facoltativo che fa riferimento all'hook di pulizia asincrono.

Registra `hook`, che è una funzione di tipo [`napi_async_cleanup_hook`](/it/nodejs/api/n-api#napi_async_cleanup_hook), come funzione da eseguire con i parametri `remove_handle` e `arg` una volta che l'ambiente Node.js corrente si chiude.

A differenza di [`napi_add_env_cleanup_hook`](/it/nodejs/api/n-api#napi_add_env_cleanup_hook), l'hook può essere asincrono.

Altrimenti, il comportamento corrisponde generalmente a quello di [`napi_add_env_cleanup_hook`](/it/nodejs/api/n-api#napi_add_env_cleanup_hook).

Se `remove_handle` non è `NULL`, in esso verrà memorizzato un valore opaco che dovrà essere successivamente passato a [`napi_remove_async_cleanup_hook`](/it/nodejs/api/n-api#napi_remove_async_cleanup_hook), indipendentemente dal fatto che l'hook sia già stato richiamato o meno. In genere, ciò accade quando la risorsa per la quale è stato aggiunto questo hook viene comunque smantellata.


#### `napi_remove_async_cleanup_hook` {#napi_remove_async_cleanup_hook}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v14.10.0, v12.19.0 | Parametro `env` rimosso. |
| v14.8.0, v12.19.0 | Aggiunto in: v14.8.0, v12.19.0 |
:::

```C [C]
NAPI_EXTERN napi_status napi_remove_async_cleanup_hook(
    napi_async_cleanup_hook_handle remove_handle);
```
- `[in] remove_handle`: L'handle di un hook di pulizia asincrono creato con [`napi_add_async_cleanup_hook`](/it/nodejs/api/n-api#napi_add_async_cleanup_hook).

Annulla la registrazione dell'hook di pulizia corrispondente a `remove_handle`. Ciò impedirà l'esecuzione dell'hook, a meno che non abbia già iniziato l'esecuzione. Questo deve essere chiamato su qualsiasi valore `napi_async_cleanup_hook_handle` ottenuto da [`napi_add_async_cleanup_hook`](/it/nodejs/api/n-api#napi_add_async_cleanup_hook).

### Finalizzazione all'uscita dell'ambiente Node.js {#finalization-on-the-exit-of-the-nodejs-environment}

L'ambiente Node.js può essere smantellato in un momento arbitrario il prima possibile con l'esecuzione di JavaScript non consentita, come su richiesta di [`worker.terminate()`](/it/nodejs/api/worker_threads#workerterminate). Quando l'ambiente viene smantellato, i callback `napi_finalize` registrati degli oggetti JavaScript, delle funzioni thread-safe e dei dati dell'istanza dell'ambiente vengono invocati immediatamente e indipendentemente.

L'invocazione dei callback `napi_finalize` è programmata dopo gli hook di pulizia registrati manualmente. Al fine di garantire un ordine corretto di finalizzazione dell'addon durante l'arresto dell'ambiente per evitare l'uso dopo la liberazione nel callback `napi_finalize`, gli addon dovrebbero registrare un hook di pulizia con `napi_add_env_cleanup_hook` e `napi_add_async_cleanup_hook` per rilasciare manualmente la risorsa allocata in un ordine corretto.

## Registrazione del modulo {#module-registration}

I moduli Node-API sono registrati in modo simile ad altri moduli, tranne per il fatto che invece di usare la macro `NODE_MODULE` viene usato quanto segue:

```C [C]
NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)
```
La successiva differenza è la firma per il metodo `Init`. Per un modulo Node-API è la seguente:

```C [C]
napi_value Init(napi_env env, napi_value exports);
```
Il valore di ritorno da `Init` è trattato come l'oggetto `exports` per il modulo. Il metodo `Init` viene passato un oggetto vuoto tramite il parametro `exports` come comodità. Se `Init` restituisce `NULL`, il parametro passato come `exports` viene esportato dal modulo. I moduli Node-API non possono modificare l'oggetto `module` ma possono specificare qualsiasi cosa come proprietà `exports` del modulo.

Per aggiungere il metodo `hello` come funzione in modo che possa essere chiamato come un metodo fornito dall'addon:

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
Per impostare una funzione da restituire tramite il `require()` per l'addon:

```C [C]
napi_value Init(napi_env env, napi_value exports) {
  napi_value method;
  napi_status status;
  status = napi_create_function(env, "exports", NAPI_AUTO_LENGTH, Method, NULL, &method);
  if (status != napi_ok) return NULL;
  return method;
}
```
Per definire una classe in modo che possano essere create nuove istanze (spesso usata con [Object wrap](/it/nodejs/api/n-api#object-wrap)):

```C [C]
// NOTA: esempio parziale, non tutto il codice a cui si fa riferimento è incluso
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
È anche possibile usare la macro `NAPI_MODULE_INIT`, che funge da abbreviazione per `NAPI_MODULE` e definisce una funzione `Init`:

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
I parametri `env` e `exports` sono forniti al corpo della macro `NAPI_MODULE_INIT`.

Tutti gli addon Node-API sono context-aware, il che significa che possono essere caricati più volte. Ci sono alcune considerazioni di progettazione quando si dichiara un tale modulo. La documentazione sugli [addon context-aware](/it/nodejs/api/addons#context-aware-addons) fornisce maggiori dettagli.

Le variabili `env` e `exports` saranno disponibili all'interno del corpo della funzione dopo l'invocazione della macro.

Per maggiori dettagli sull'impostazione delle proprietà sugli oggetti, consultare la sezione su [Lavorare con le proprietà JavaScript](/it/nodejs/api/n-api#working-with-javascript-properties).

Per maggiori dettagli sulla creazione di moduli addon in generale, fare riferimento all'API esistente.


## Lavorare con valori JavaScript {#working-with-javascript-values}

Node-API espone un insieme di API per creare tutti i tipi di valori JavaScript. Alcuni di questi tipi sono documentati nella [Sezione 6](https://tc39.github.io/ecma262/#sec-ecmascript-data-types-and-values) della [Specifica del linguaggio ECMAScript](https://tc39.github.io/ecma262/).

Fondamentalmente, queste API vengono utilizzate per fare una delle seguenti cose:

I valori Node-API sono rappresentati dal tipo `napi_value`. Qualsiasi chiamata Node-API che richiede un valore JavaScript accetta un `napi_value`. In alcuni casi, l'API verifica in anticipo il tipo di `napi_value`. Tuttavia, per ottenere prestazioni migliori, è meglio che il chiamante si assicuri che il `napi_value` in questione sia del tipo JavaScript previsto dall'API.

### Tipi Enum {#enum-types}

#### `napi_key_collection_mode` {#napi_key_collection_mode}

**Aggiunto in: v13.7.0, v12.17.0, v10.20.0**

**Versione N-API: 6**

```C [C]
typedef enum {
  napi_key_include_prototypes,
  napi_key_own_only
} napi_key_collection_mode;
```
Descrive gli enum del filtro `Chiavi/Proprietà`:

`napi_key_collection_mode` limita l'intervallo di proprietà raccolte.

`napi_key_own_only` limita le proprietà raccolte solo all'oggetto specificato. `napi_key_include_prototypes` includerà anche tutte le chiavi della catena di prototipi dell'oggetto.

#### `napi_key_filter` {#napi_key_filter}

**Aggiunto in: v13.7.0, v12.17.0, v10.20.0**

**Versione N-API: 6**

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
Bit di filtro proprietà. Possono essere combinati con OR per creare un filtro composito.

#### `napi_key_conversion` {#napi_key_conversion}

**Aggiunto in: v13.7.0, v12.17.0, v10.20.0**

**Versione N-API: 6**

```C [C]
typedef enum {
  napi_key_keep_numbers,
  napi_key_numbers_to_strings
} napi_key_conversion;
```
`napi_key_numbers_to_strings` convertirà gli indici interi in stringhe. `napi_key_keep_numbers` restituirà numeri per gli indici interi.

#### `napi_valuetype` {#napi_valuetype}

```C [C]
typedef enum {
  // Tipi ES6 (corrisponde a typeof)
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
Descrive il tipo di un `napi_value`. Ciò corrisponde generalmente ai tipi descritti nella [Sezione 6.1](https://tc39.github.io/ecma262/#sec-ecmascript-language-types) della Specifica del linguaggio ECMAScript. Oltre ai tipi in quella sezione, `napi_valuetype` può anche rappresentare `Funzioni` e `Oggetti` con dati esterni.

Un valore JavaScript di tipo `napi_external` appare in JavaScript come un oggetto semplice su cui non è possibile impostare proprietà e nessun prototipo.


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
Questo rappresenta il tipo di dati scalare binario sottostante del `TypedArray`. Gli elementi di questo enum corrispondono alla [Sezione 22.2](https://tc39.github.io/ecma262/#sec-typedarray-objects) della [Specificazione del Linguaggio ECMAScript](https://tc39.github.io/ecma262/).

### Funzioni di creazione degli oggetti {#object-creation-functions}

#### `napi_create_array` {#napi_create_array}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status napi_create_array(napi_env env, napi_value* result)
```
- `[in] env`: L'ambiente in cui viene invocata la chiamata Node-API.
- `[out] result`: Un `napi_value` che rappresenta un `Array` JavaScript.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API restituisce un valore Node-API corrispondente a un tipo `Array` JavaScript. Gli array JavaScript sono descritti nella [Sezione 22.1](https://tc39.github.io/ecma262/#sec-array-objects) della Specificazione del Linguaggio ECMAScript.

#### `napi_create_array_with_length` {#napi_create_array_with_length}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status napi_create_array_with_length(napi_env env,
                                          size_t length,
                                          napi_value* result)
```
- `[in] env`: L'ambiente in cui viene invocata l'API.
- `[in] length`: La lunghezza iniziale dell'`Array`.
- `[out] result`: Un `napi_value` che rappresenta un `Array` JavaScript.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API restituisce un valore Node-API corrispondente a un tipo `Array` JavaScript. La proprietà length dell'`Array` è impostata sul parametro length passato. Tuttavia, non è garantito che il buffer sottostante venga pre-allocato dalla VM quando viene creato l'array. Tale comportamento è lasciato all'implementazione della VM sottostante. Se il buffer deve essere un blocco di memoria contiguo che può essere letto e/o scritto direttamente tramite C, si consideri l'utilizzo di [`napi_create_external_arraybuffer`](/it/nodejs/api/n-api#napi_create_external_arraybuffer).

Gli array JavaScript sono descritti nella [Sezione 22.1](https://tc39.github.io/ecma262/#sec-array-objects) della Specificazione del Linguaggio ECMAScript.


#### `napi_create_arraybuffer` {#napi_create_arraybuffer}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status napi_create_arraybuffer(napi_env env,
                                    size_t byte_length,
                                    void** data,
                                    napi_value* result)
```
- `[in] env`: L'ambiente in cui l'API viene invocata.
- `[in] length`: La lunghezza in byte del buffer array da creare.
- `[out] data`: Puntatore al buffer di byte sottostante dell'`ArrayBuffer`. `data` può essere facoltativamente ignorato passando `NULL`.
- `[out] result`: Un `napi_value` che rappresenta un `ArrayBuffer` JavaScript.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API restituisce un valore Node-API corrispondente a un `ArrayBuffer` JavaScript. Gli `ArrayBuffer` vengono utilizzati per rappresentare buffer di dati binari a lunghezza fissa. Vengono normalmente utilizzati come buffer di supporto per gli oggetti `TypedArray`. L'`ArrayBuffer` allocato avrà un buffer di byte sottostante la cui dimensione è determinata dal parametro `length` passato. Il buffer sottostante viene facoltativamente restituito al chiamante nel caso in cui il chiamante voglia manipolare direttamente il buffer. Questo buffer può essere scritto direttamente solo dal codice nativo. Per scrivere in questo buffer da JavaScript, sarebbe necessario creare un array tipizzato o un oggetto `DataView`.

Gli oggetti `ArrayBuffer` JavaScript sono descritti nella [Sezione 24.1](https://tc39.github.io/ecma262/#sec-arraybuffer-objects) della specifica del linguaggio ECMAScript.

#### `napi_create_buffer` {#napi_create_buffer}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status napi_create_buffer(napi_env env,
                               size_t size,
                               void** data,
                               napi_value* result)
```
- `[in] env`: L'ambiente in cui l'API viene invocata.
- `[in] size`: Dimensione in byte del buffer sottostante.
- `[out] data`: Puntatore raw al buffer sottostante. `data` può essere facoltativamente ignorato passando `NULL`.
- `[out] result`: Un `napi_value` che rappresenta un `node::Buffer`.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API alloca un oggetto `node::Buffer`. Sebbene questa sia ancora una struttura dati completamente supportata, nella maggior parte dei casi l'utilizzo di un `TypedArray` sarà sufficiente.


#### `napi_create_buffer_copy` {#napi_create_buffer_copy}

**Aggiunta in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status napi_create_buffer_copy(napi_env env,
                                    size_t length,
                                    const void* data,
                                    void** result_data,
                                    napi_value* result)
```
- `[in] env`: L'ambiente in cui viene invocata l'API.
- `[in] size`: Dimensione in byte del buffer di input (deve essere uguale alla dimensione del nuovo buffer).
- `[in] data`: Puntatore raw al buffer sottostante da cui copiare.
- `[out] result_data`: Puntatore al buffer di dati sottostante del nuovo `Buffer`. `result_data` può essere opzionalmente ignorato passando `NULL`.
- `[out] result`: Un `napi_value` che rappresenta un `node::Buffer`.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API alloca un oggetto `node::Buffer` e lo inizializza con i dati copiati dal buffer passato. Sebbene questa sia ancora una struttura dati pienamente supportata, nella maggior parte dei casi l'utilizzo di un `TypedArray` sarà sufficiente.

#### `napi_create_date` {#napi_create_date}

**Aggiunta in: v11.11.0, v10.17.0**

**Versione N-API: 5**

```C [C]
napi_status napi_create_date(napi_env env,
                             double time,
                             napi_value* result);
```
- `[in] env`: L'ambiente in cui viene invocata l'API.
- `[in] time`: Valore di tempo ECMAScript in millisecondi dal 01 gennaio 1970 UTC.
- `[out] result`: Un `napi_value` che rappresenta un `Date` JavaScript.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API non considera i secondi intercalari; vengono ignorati, poiché ECMAScript si allinea alla specifica temporale POSIX.

Questa API alloca un oggetto `Date` JavaScript.

Gli oggetti `Date` JavaScript sono descritti nella [Sezione 20.3](https://tc39.github.io/ecma262/#sec-date-objects) della Specification del linguaggio ECMAScript.

#### `napi_create_external` {#napi_create_external}

**Aggiunta in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status napi_create_external(napi_env env,
                                 void* data,
                                 napi_finalize finalize_cb,
                                 void* finalize_hint,
                                 napi_value* result)
```
- `[in] env`: L'ambiente in cui viene invocata l'API.
- `[in] data`: Puntatore raw ai dati esterni.
- `[in] finalize_cb`: Callback opzionale da chiamare quando il valore esterno viene raccolto. [`napi_finalize`](/it/nodejs/api/n-api#napi_finalize) fornisce maggiori dettagli.
- `[in] finalize_hint`: Suggerimento opzionale da passare alla callback di finalizzazione durante la raccolta.
- `[out] result`: Un `napi_value` che rappresenta un valore esterno.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API alloca un valore JavaScript con dati esterni allegati. Questo viene utilizzato per passare dati esterni attraverso il codice JavaScript, in modo che possa essere recuperato in seguito dal codice nativo usando [`napi_get_value_external`](/it/nodejs/api/n-api#napi_get_value_external).

L'API aggiunge una callback `napi_finalize` che verrà chiamata quando l'oggetto JavaScript appena creato è stato sottoposto a garbage collection.

Il valore creato non è un oggetto e quindi non supporta proprietà aggiuntive. È considerato un tipo di valore distinto: chiamare `napi_typeof()` con un valore esterno produce `napi_external`.


#### `napi_create_external_arraybuffer` {#napi_create_external_arraybuffer}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status
napi_create_external_arraybuffer(napi_env env,
                                 void* external_data,
                                 size_t byte_length,
                                 napi_finalize finalize_cb,
                                 void* finalize_hint,
                                 napi_value* result)
```
- `[in] env`: L'ambiente in cui viene richiamata l'API.
- `[in] external_data`: Puntatore al buffer di byte sottostante dell'`ArrayBuffer`.
- `[in] byte_length`: La lunghezza in byte del buffer sottostante.
- `[in] finalize_cb`: Callback opzionale da chiamare quando l'`ArrayBuffer` viene raccolto. [`napi_finalize`](/it/nodejs/api/n-api#napi_finalize) fornisce maggiori dettagli.
- `[in] finalize_hint`: Suggerimento opzionale da passare alla callback di finalizzazione durante la raccolta.
- `[out] result`: Un `napi_value` che rappresenta un `ArrayBuffer` JavaScript.

Restituisce `napi_ok` se l'API ha avuto successo.

**Alcuni runtime diversi da Node.js hanno abbandonato il supporto per i buffer esterni**. Su runtime diversi da Node.js questo metodo può restituire `napi_no_external_buffers_allowed` per indicare che i buffer esterni non sono supportati. Un runtime di questo tipo è Electron come descritto in questo problema [electron/issues/35801](https://github.com/electron/electron/issues/35801).

Per mantenere la più ampia compatibilità con tutti i runtime, è possibile definire `NODE_API_NO_EXTERNAL_BUFFERS_ALLOWED` nel proprio componente aggiuntivo prima degli include per le intestazioni node-api. In questo modo si nasconderanno le 2 funzioni che creano buffer esterni. Ciò garantirà che si verifichi un errore di compilazione se si utilizza accidentalmente uno di questi metodi.

Questa API restituisce un valore Node-API corrispondente a un `ArrayBuffer` JavaScript. Il buffer di byte sottostante dell'`ArrayBuffer` è allocato e gestito esternamente. Il chiamante deve garantire che il buffer di byte rimanga valido fino a quando non viene chiamata la callback di finalizzazione.

L'API aggiunge una callback `napi_finalize` che verrà chiamata quando l'oggetto JavaScript appena creato è stato sottoposto a garbage collection.

Gli `ArrayBuffer` JavaScript sono descritti nella [Sezione 24.1](https://tc39.github.io/ecma262/#sec-arraybuffer-objects) della Specifica del linguaggio ECMAScript.


#### `napi_create_external_buffer` {#napi_create_external_buffer}

**Aggiunta in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status napi_create_external_buffer(napi_env env,
                                        size_t length,
                                        void* data,
                                        napi_finalize finalize_cb,
                                        void* finalize_hint,
                                        napi_value* result)
```
- `[in] env`: L'ambiente in cui viene richiamata l'API.
- `[in] length`: Dimensione in byte del buffer di input (deve essere uguale alla dimensione del nuovo buffer).
- `[in] data`: Puntatore raw al buffer sottostante da esporre a JavaScript.
- `[in] finalize_cb`: Callback opzionale da chiamare quando l'`ArrayBuffer` viene raccolto. [`napi_finalize`](/it/nodejs/api/n-api#napi_finalize) fornisce maggiori dettagli.
- `[in] finalize_hint`: Suggerimento opzionale da passare alla callback di finalizzazione durante la raccolta.
- `[out] result`: Un `napi_value` che rappresenta un `node::Buffer`.

Restituisce `napi_ok` se l'API ha avuto successo.

**Alcuni runtime diversi da Node.js hanno abbandonato il supporto per i buffer esterni**. Su runtime diversi da Node.js, questo metodo può restituire `napi_no_external_buffers_allowed` per indicare che i buffer esterni non sono supportati. Un runtime di questo tipo è Electron, come descritto in questo problema [electron/issues/35801](https://github.com/electron/electron/issues/35801).

Per mantenere la più ampia compatibilità con tutti i runtime, è possibile definire `NODE_API_NO_EXTERNAL_BUFFERS_ALLOWED` nel proprio addon prima degli include per gli header node-api. In questo modo si nasconderanno le 2 funzioni che creano buffer esterni. Ciò garantirà che si verifichi un errore di compilazione se si utilizza accidentalmente uno di questi metodi.

Questa API alloca un oggetto `node::Buffer` e lo inizializza con dati supportati dal buffer passato. Sebbene questa sia ancora una struttura dati completamente supportata, nella maggior parte dei casi l'utilizzo di un `TypedArray` sarà sufficiente.

L'API aggiunge una callback `napi_finalize` che verrà chiamata quando l'oggetto JavaScript appena creato è stato sottoposto a garbage collection.

Per Node.js \>=4 i `Buffer` sono `Uint8Array`.


#### `napi_create_object` {#napi_create_object}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status napi_create_object(napi_env env, napi_value* result)
```
- `[in] env`: L'ambiente in cui viene richiamata l'API.
- `[out] result`: Un `napi_value` che rappresenta un `Object` JavaScript.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API alloca un `Object` JavaScript predefinito. È l'equivalente di fare `new Object()` in JavaScript.

Il tipo `Object` JavaScript è descritto nella [Sezione 6.1.7](https://tc39.github.io/ecma262/#sec-object-type) della specifica del linguaggio ECMAScript.

#### `napi_create_symbol` {#napi_create_symbol}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status napi_create_symbol(napi_env env,
                               napi_value description,
                               napi_value* result)
```
- `[in] env`: L'ambiente in cui viene richiamata l'API.
- `[in] description`: `napi_value` opzionale che fa riferimento a una `string` JavaScript da impostare come descrizione per il simbolo.
- `[out] result`: Un `napi_value` che rappresenta un `symbol` JavaScript.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API crea un valore `symbol` JavaScript da una stringa C con codifica UTF8.

Il tipo `symbol` JavaScript è descritto nella [Sezione 19.4](https://tc39.github.io/ecma262/#sec-symbol-objects) della specifica del linguaggio ECMAScript.

#### `node_api_symbol_for` {#node_api_symbol_for}

**Aggiunto in: v17.5.0, v16.15.0**

**Versione N-API: 9**

```C [C]
napi_status node_api_symbol_for(napi_env env,
                                const char* utf8description,
                                size_t length,
                                napi_value* result)
```
- `[in] env`: L'ambiente in cui viene richiamata l'API.
- `[in] utf8description`: Stringa C UTF-8 che rappresenta il testo da utilizzare come descrizione per il simbolo.
- `[in] length`: La lunghezza della stringa di descrizione in byte, o `NAPI_AUTO_LENGTH` se è terminata con null.
- `[out] result`: Un `napi_value` che rappresenta un `symbol` JavaScript.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API cerca nel registro globale un simbolo esistente con la descrizione specificata. Se il simbolo esiste già, verrà restituito, altrimenti verrà creato un nuovo simbolo nel registro.

Il tipo `symbol` JavaScript è descritto nella [Sezione 19.4](https://tc39.github.io/ecma262/#sec-symbol-objects) della specifica del linguaggio ECMAScript.


#### `napi_create_typedarray` {#napi_create_typedarray}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status napi_create_typedarray(napi_env env,
                                   napi_typedarray_type type,
                                   size_t length,
                                   napi_value arraybuffer,
                                   size_t byte_offset,
                                   napi_value* result)
```
- `[in] env`: L'ambiente in cui viene invocata l'API.
- `[in] type`: Tipo di dati scalare degli elementi all'interno del `TypedArray`.
- `[in] length`: Numero di elementi nel `TypedArray`.
- `[in] arraybuffer`: `ArrayBuffer` sottostante al typed array.
- `[in] byte_offset`: L'offset in byte all'interno dell'`ArrayBuffer` da cui iniziare a proiettare il `TypedArray`.
- `[out] result`: Un `napi_value` che rappresenta un `TypedArray` JavaScript.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API crea un oggetto `TypedArray` JavaScript su un `ArrayBuffer` esistente. Gli oggetti `TypedArray` forniscono una vista simile a un array su un buffer di dati sottostante in cui ogni elemento ha lo stesso tipo di dati scalare binario sottostante.

È necessario che `(length * size_of_element) + byte_offset` sia \<= della dimensione in byte dell'array passato. In caso contrario, viene sollevata un'eccezione `RangeError`.

Gli oggetti `TypedArray` JavaScript sono descritti nella [Sezione 22.2](https://tc39.github.io/ecma262/#sec-typedarray-objects) della specifica del linguaggio ECMAScript.

#### `node_api_create_buffer_from_arraybuffer` {#node_api_create_buffer_from_arraybuffer}

**Aggiunto in: v23.0.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

```C [C]
napi_status NAPI_CDECL node_api_create_buffer_from_arraybuffer(napi_env env,
                                                              napi_value arraybuffer,
                                                              size_t byte_offset,
                                                              size_t byte_length,
                                                              napi_value* result)
```
- **<code>[in] env</code>**: L'ambiente in cui viene invocata l'API.
- **<code>[in] arraybuffer</code>**: L'`ArrayBuffer` da cui verrà creato il buffer.
- **<code>[in] byte_offset</code>**: L'offset in byte all'interno dell'`ArrayBuffer` da cui iniziare a creare il buffer.
- **<code>[in] byte_length</code>**: La lunghezza in byte del buffer da creare dall'`ArrayBuffer`.
- **<code>[out] result</code>**: Un `napi_value` che rappresenta l'oggetto `Buffer` JavaScript creato.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API crea un oggetto `Buffer` JavaScript da un `ArrayBuffer` esistente. L'oggetto `Buffer` è una classe specifica di Node.js che fornisce un modo per lavorare direttamente con dati binari in JavaScript.

L'intervallo di byte `[byte_offset, byte_offset + byte_length)` deve rientrare nei limiti dell'`ArrayBuffer`. Se `byte_offset + byte_length` supera la dimensione dell'`ArrayBuffer`, viene generata un'eccezione `RangeError`.


#### `napi_create_dataview` {#napi_create_dataview}

**Aggiunto in: v8.3.0**

**Versione N-API: 1**

```C [C]
napi_status napi_create_dataview(napi_env env,
                                 size_t byte_length,
                                 napi_value arraybuffer,
                                 size_t byte_offset,
                                 napi_value* result)
```
- `[in] env`: L'ambiente in cui viene richiamata l'API.
- `[in] length`: Numero di elementi nel `DataView`.
- `[in] arraybuffer`: `ArrayBuffer` sottostante al `DataView`.
- `[in] byte_offset`: L'offset in byte all'interno dell'`ArrayBuffer` da cui iniziare a proiettare il `DataView`.
- `[out] result`: Un `napi_value` che rappresenta un `DataView` JavaScript.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API crea un oggetto `DataView` JavaScript su un `ArrayBuffer` esistente. Gli oggetti `DataView` forniscono una vista simile a un array su un buffer di dati sottostante, ma che consente elementi di dimensioni e tipi diversi nell'`ArrayBuffer`.

È necessario che `byte_length + byte_offset` sia minore o uguale alla dimensione in byte dell'array passato. In caso contrario, viene generata un'eccezione `RangeError`.

Gli oggetti `DataView` JavaScript sono descritti nella [Sezione 24.3](https://tc39.github.io/ecma262/#sec-dataview-objects) della specifica del linguaggio ECMAScript.

### Funzioni per convertire dai tipi C a Node-API {#functions-to-convert-from-c-types-to-node-api}

#### `napi_create_int32` {#napi_create_int32}

**Aggiunto in: v8.4.0**

**Versione N-API: 1**

```C [C]
napi_status napi_create_int32(napi_env env, int32_t value, napi_value* result)
```
- `[in] env`: L'ambiente in cui viene richiamata l'API.
- `[in] value`: Valore intero da rappresentare in JavaScript.
- `[out] result`: Un `napi_value` che rappresenta un `number` JavaScript.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API viene utilizzata per convertire dal tipo C `int32_t` al tipo JavaScript `number`.

Il tipo JavaScript `number` è descritto nella [Sezione 6.1.6](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-number-type) della specifica del linguaggio ECMAScript.


#### `napi_create_uint32` {#napi_create_uint32}

**Aggiunto in: v8.4.0**

**Versione N-API: 1**

```C [C]
napi_status napi_create_uint32(napi_env env, uint32_t value, napi_value* result)
```
- `[in] env`: L'ambiente in cui viene invocata l'API.
- `[in] value`: Valore intero senza segno da rappresentare in JavaScript.
- `[out] result`: Un `napi_value` che rappresenta un `number` JavaScript.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API viene utilizzata per convertire dal tipo C `uint32_t` al tipo JavaScript `number`.

Il tipo JavaScript `number` è descritto nella [Sezione 6.1.6](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-number-type) della specifica del linguaggio ECMAScript.

#### `napi_create_int64` {#napi_create_int64}

**Aggiunto in: v8.4.0**

**Versione N-API: 1**

```C [C]
napi_status napi_create_int64(napi_env env, int64_t value, napi_value* result)
```
- `[in] env`: L'ambiente in cui viene invocata l'API.
- `[in] value`: Valore intero da rappresentare in JavaScript.
- `[out] result`: Un `napi_value` che rappresenta un `number` JavaScript.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API viene utilizzata per convertire dal tipo C `int64_t` al tipo JavaScript `number`.

Il tipo JavaScript `number` è descritto nella [Sezione 6.1.6](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-number-type) della specifica del linguaggio ECMAScript. Si noti che l'intervallo completo di `int64_t` non può essere rappresentato con precisione completa in JavaScript. I valori interi al di fuori dell'intervallo di [`Number.MIN_SAFE_INTEGER`](https://tc39.github.io/ecma262/#sec-number.min_safe_integer) `-(2**53 - 1)` - [`Number.MAX_SAFE_INTEGER`](https://tc39.github.io/ecma262/#sec-number.max_safe_integer) `(2**53 - 1)` perderanno precisione.

#### `napi_create_double` {#napi_create_double}

**Aggiunto in: v8.4.0**

**Versione N-API: 1**

```C [C]
napi_status napi_create_double(napi_env env, double value, napi_value* result)
```
- `[in] env`: L'ambiente in cui viene invocata l'API.
- `[in] value`: Valore a doppia precisione da rappresentare in JavaScript.
- `[out] result`: Un `napi_value` che rappresenta un `number` JavaScript.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API viene utilizzata per convertire dal tipo C `double` al tipo JavaScript `number`.

Il tipo JavaScript `number` è descritto nella [Sezione 6.1.6](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-number-type) della specifica del linguaggio ECMAScript.


#### `napi_create_bigint_int64` {#napi_create_bigint_int64}

**Aggiunto in: v10.7.0**

**Versione N-API: 6**

```C [C]
napi_status napi_create_bigint_int64(napi_env env,
                                     int64_t value,
                                     napi_value* result);
```
- `[in] env`: L'ambiente in cui viene richiamata l'API.
- `[in] value`: Valore intero da rappresentare in JavaScript.
- `[out] result`: Un `napi_value` che rappresenta un `BigInt` JavaScript.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API converte il tipo C `int64_t` nel tipo JavaScript `BigInt`.

#### `napi_create_bigint_uint64` {#napi_create_bigint_uint64}

**Aggiunto in: v10.7.0**

**Versione N-API: 6**

```C [C]
napi_status napi_create_bigint_uint64(napi_env env,
                                      uint64_t value,
                                      napi_value* result);
```
- `[in] env`: L'ambiente in cui viene richiamata l'API.
- `[in] value`: Valore intero senza segno da rappresentare in JavaScript.
- `[out] result`: Un `napi_value` che rappresenta un `BigInt` JavaScript.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API converte il tipo C `uint64_t` nel tipo JavaScript `BigInt`.

#### `napi_create_bigint_words` {#napi_create_bigint_words}

**Aggiunto in: v10.7.0**

**Versione N-API: 6**

```C [C]
napi_status napi_create_bigint_words(napi_env env,
                                     int sign_bit,
                                     size_t word_count,
                                     const uint64_t* words,
                                     napi_value* result);
```
- `[in] env`: L'ambiente in cui viene richiamata l'API.
- `[in] sign_bit`: Determina se il `BigInt` risultante sarà positivo o negativo.
- `[in] word_count`: La lunghezza dell'array `words`.
- `[in] words`: Un array di parole little-endian a 64 bit `uint64_t`.
- `[out] result`: Un `napi_value` che rappresenta un `BigInt` JavaScript.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API converte un array di parole a 64 bit senza segno in un singolo valore `BigInt`.

Il `BigInt` risultante viene calcolato come: (–1) (`words[0]` × (2) + `words[1]` × (2) + …)


#### `napi_create_string_latin1` {#napi_create_string_latin1}

**Aggiunta in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status napi_create_string_latin1(napi_env env,
                                      const char* str,
                                      size_t length,
                                      napi_value* result);
```
- `[in] env`: L'ambiente in cui viene invocata l'API.
- `[in] str`: Buffer di caratteri che rappresenta una stringa codificata ISO-8859-1.
- `[in] length`: La lunghezza della stringa in byte, o `NAPI_AUTO_LENGTH` se è terminata con null.
- `[out] result`: Un `napi_value` che rappresenta una `string` JavaScript.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API crea un valore `string` JavaScript da una stringa C con codifica ISO-8859-1. La stringa nativa viene copiata.

Il tipo `string` JavaScript è descritto nella [Sezione 6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type) della Specifica del Linguaggio ECMAScript.

#### `node_api_create_external_string_latin1` {#node_api_create_external_string_latin1}

**Aggiunta in: v20.4.0, v18.18.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
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
- `[in] env`: L'ambiente in cui viene invocata l'API.
- `[in] str`: Buffer di caratteri che rappresenta una stringa codificata ISO-8859-1.
- `[in] length`: La lunghezza della stringa in byte, o `NAPI_AUTO_LENGTH` se è terminata con null.
- `[in] finalize_callback`: La funzione da chiamare quando la stringa viene raccolta. La funzione verrà chiamata con i seguenti parametri:
    - `[in] env`: L'ambiente in cui è in esecuzione l'addon. Questo valore può essere null se la stringa viene raccolta come parte della terminazione del worker o dell'istanza principale di Node.js.
    - `[in] data`: Questo è il valore `str` come puntatore `void*`.
    - `[in] finalize_hint`: Questo è il valore `finalize_hint` che è stato fornito all'API. [`napi_finalize`](/it/nodejs/api/n-api#napi_finalize) fornisce maggiori dettagli. Questo parametro è opzionale. Passare un valore null significa che l'addon non deve essere notificato quando la stringa JavaScript corrispondente viene raccolta.


- `[in] finalize_hint`: Suggerimento opzionale da passare alla callback di finalizzazione durante la raccolta.
- `[out] result`: Un `napi_value` che rappresenta una `string` JavaScript.
- `[out] copied`: Indica se la stringa è stata copiata. Se lo è stata, il finalizzatore sarà già stato invocato per distruggere `str`.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API crea un valore `string` JavaScript da una stringa C con codifica ISO-8859-1. La stringa nativa potrebbe non essere copiata e deve quindi esistere per l'intero ciclo di vita del valore JavaScript.

Il tipo `string` JavaScript è descritto nella [Sezione 6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type) della Specifica del Linguaggio ECMAScript.


#### `napi_create_string_utf16` {#napi_create_string_utf16}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status napi_create_string_utf16(napi_env env,
                                     const char16_t* str,
                                     size_t length,
                                     napi_value* result)
```
- `[in] env`: L'ambiente in cui viene invocata l'API.
- `[in] str`: Buffer di caratteri che rappresenta una stringa codificata in UTF16-LE.
- `[in] length`: La lunghezza della stringa in unità di codice a due byte, o `NAPI_AUTO_LENGTH` se è terminata da null.
- `[out] result`: Un `napi_value` che rappresenta una `string` JavaScript.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API crea un valore `string` JavaScript da una stringa C codificata in UTF16-LE. La stringa nativa viene copiata.

Il tipo `string` di JavaScript è descritto nella [Sezione 6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type) della specifica del linguaggio ECMAScript.

#### `node_api_create_external_string_utf16` {#node_api_create_external_string_utf16}

**Aggiunto in: v20.4.0, v18.18.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
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
- `[in] env`: L'ambiente in cui viene invocata l'API.
- `[in] str`: Buffer di caratteri che rappresenta una stringa codificata in UTF16-LE.
- `[in] length`: La lunghezza della stringa in unità di codice a due byte, o `NAPI_AUTO_LENGTH` se è terminata da null.
- `[in] finalize_callback`: La funzione da chiamare quando la stringa viene raccolta. La funzione verrà chiamata con i seguenti parametri:
    - `[in] env`: L'ambiente in cui è in esecuzione l'addon. Questo valore può essere null se la stringa viene raccolta come parte della terminazione del worker o dell'istanza principale di Node.js.
    - `[in] data`: Questo è il valore `str` come puntatore `void*`.
    - `[in] finalize_hint`: Questo è il valore `finalize_hint` che è stato fornito all'API. [`napi_finalize`](/it/nodejs/api/n-api#napi_finalize) fornisce maggiori dettagli. Questo parametro è opzionale. Passare un valore null significa che l'addon non ha bisogno di essere avvisato quando la stringa JavaScript corrispondente viene raccolta.
  
 
- `[in] finalize_hint`: Suggerimento opzionale da passare alla callback di finalizzazione durante la raccolta.
- `[out] result`: Un `napi_value` che rappresenta una `string` JavaScript.
- `[out] copied`: Indica se la stringa è stata copiata. In tal caso, il finalizzatore sarà già stato invocato per distruggere `str`.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API crea un valore `string` JavaScript da una stringa C codificata in UTF16-LE. La stringa nativa potrebbe non essere copiata e deve quindi esistere per l'intero ciclo di vita del valore JavaScript.

Il tipo `string` di JavaScript è descritto nella [Sezione 6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type) della specifica del linguaggio ECMAScript.


#### `napi_create_string_utf8` {#napi_create_string_utf8}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status napi_create_string_utf8(napi_env env,
                                    const char* str,
                                    size_t length,
                                    napi_value* result)
```
- `[in] env`: L'ambiente in cui viene richiamata l'API.
- `[in] str`: Buffer di caratteri che rappresenta una stringa con codifica UTF8.
- `[in] length`: La lunghezza della stringa in byte, o `NAPI_AUTO_LENGTH` se è terminata con null.
- `[out] result`: Un `napi_value` che rappresenta una `string` JavaScript.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API crea un valore `string` JavaScript da una stringa C con codifica UTF8. La stringa nativa viene copiata.

Il tipo `string` JavaScript è descritto nella [Sezione 6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type) della Specifica del Linguaggio ECMAScript.

### Funzioni per creare chiavi di proprietà ottimizzate {#functions-to-create-optimized-property-keys}

Molti motori JavaScript, incluso V8, utilizzano stringhe internalizzate come chiavi per impostare e ottenere valori di proprietà. In genere utilizzano una tabella hash per creare e cercare tali stringhe. Anche se aggiunge un certo costo per la creazione di ogni chiave, migliora le prestazioni in seguito consentendo il confronto dei puntatori di stringa anziché l'intera stringa.

Se una nuova stringa JavaScript deve essere utilizzata come chiave di proprietà, allora per alcuni motori JavaScript sarà più efficiente utilizzare le funzioni in questa sezione. Altrimenti, utilizzare le funzioni della serie `napi_create_string_utf8` o `node_api_create_external_string_utf8` poiché potrebbero esserci ulteriori overhead nella creazione/memorizzazione di stringhe con i metodi di creazione di chiavi di proprietà.

#### `node_api_create_property_key_latin1` {#node_api_create_property_key_latin1}

**Aggiunto in: v22.9.0, v20.18.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

```C [C]
napi_status NAPI_CDECL node_api_create_property_key_latin1(napi_env env,
                                                           const char* str,
                                                           size_t length,
                                                           napi_value* result);
```
- `[in] env`: L'ambiente in cui viene richiamata l'API.
- `[in] str`: Buffer di caratteri che rappresenta una stringa con codifica ISO-8859-1.
- `[in] length`: La lunghezza della stringa in byte, o `NAPI_AUTO_LENGTH` se è terminata con null.
- `[out] result`: Un `napi_value` che rappresenta una `string` JavaScript ottimizzata da utilizzare come chiave di proprietà per gli oggetti.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API crea un valore `string` JavaScript ottimizzato da una stringa C con codifica ISO-8859-1 da utilizzare come chiave di proprietà per gli oggetti. La stringa nativa viene copiata. A differenza di `napi_create_string_latin1`, le chiamate successive a questa funzione con lo stesso puntatore `str` potrebbero beneficiare di un'accelerazione nella creazione del `napi_value` richiesto, a seconda del motore.

Il tipo `string` JavaScript è descritto nella [Sezione 6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type) della Specifica del Linguaggio ECMAScript.


#### `node_api_create_property_key_utf16` {#node_api_create_property_key_utf16}

**Aggiunto in: v21.7.0, v20.12.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

```C [C]
napi_status NAPI_CDECL node_api_create_property_key_utf16(napi_env env,
                                                          const char16_t* str,
                                                          size_t length,
                                                          napi_value* result);
```
- `[in] env`: L'ambiente sotto il quale viene invocata l'API.
- `[in] str`: Buffer di caratteri che rappresenta una stringa con codifica UTF16-LE.
- `[in] length`: La lunghezza della stringa in unità di codice a due byte, o `NAPI_AUTO_LENGTH` se è terminata con null.
- `[out] result`: Un `napi_value` che rappresenta una `stringa` JavaScript ottimizzata da utilizzare come chiave di proprietà per gli oggetti.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API crea un valore `stringa` JavaScript ottimizzato da una stringa C con codifica UTF16-LE da utilizzare come chiave di proprietà per gli oggetti. La stringa nativa viene copiata.

Il tipo `stringa` JavaScript è descritto nella [Sezione 6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type) della Specifica del Linguaggio ECMAScript.

#### `node_api_create_property_key_utf8` {#node_api_create_property_key_utf8}

**Aggiunto in: v22.9.0, v20.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

```C [C]
napi_status NAPI_CDECL node_api_create_property_key_utf8(napi_env env,
                                                         const char* str,
                                                         size_t length,
                                                         napi_value* result);
```
- `[in] env`: L'ambiente sotto il quale viene invocata l'API.
- `[in] str`: Buffer di caratteri che rappresenta una stringa con codifica UTF8.
- `[in] length`: La lunghezza della stringa in unità di codice a due byte, o `NAPI_AUTO_LENGTH` se è terminata con null.
- `[out] result`: Un `napi_value` che rappresenta una `stringa` JavaScript ottimizzata da utilizzare come chiave di proprietà per gli oggetti.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API crea un valore `stringa` JavaScript ottimizzato da una stringa C con codifica UTF8 da utilizzare come chiave di proprietà per gli oggetti. La stringa nativa viene copiata.

Il tipo `stringa` JavaScript è descritto nella [Sezione 6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type) della Specifica del Linguaggio ECMAScript.


### Funzioni per la conversione da Node-API a tipi C {#functions-to-convert-from-node-api-to-c-types}

#### `napi_get_array_length` {#napi_get_array_length}

**Aggiunta in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status napi_get_array_length(napi_env env,
                                  napi_value value,
                                  uint32_t* result)
```
- `[in] env`: L'ambiente in cui viene invocata l'API.
- `[in] value`: `napi_value` che rappresenta l'`Array` JavaScript di cui si sta interrogando la lunghezza.
- `[out] result`: `uint32` che rappresenta la lunghezza dell'array.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API restituisce la lunghezza di un array.

La lunghezza dell'`Array` è descritta nella [Sezione 22.1.4.1](https://tc39.github.io/ecma262/#sec-properties-of-array-instances-length) della specifica del linguaggio ECMAScript.

#### `napi_get_arraybuffer_info` {#napi_get_arraybuffer_info}

**Aggiunta in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status napi_get_arraybuffer_info(napi_env env,
                                      napi_value arraybuffer,
                                      void** data,
                                      size_t* byte_length)
```
- `[in] env`: L'ambiente in cui viene invocata l'API.
- `[in] arraybuffer`: `napi_value` che rappresenta l'`ArrayBuffer` di cui si sta interrogando.
- `[out] data`: Il buffer di dati sottostante dell'`ArrayBuffer`. Se byte_length è `0`, questo può essere `NULL` o qualsiasi altro valore puntatore.
- `[out] byte_length`: Lunghezza in byte del buffer di dati sottostante.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API viene utilizzata per recuperare il buffer di dati sottostante di un `ArrayBuffer` e la sua lunghezza.

*ATTENZIONE*: Prestare attenzione quando si utilizza questa API. La durata del buffer di dati sottostante è gestita dall'`ArrayBuffer` anche dopo che è stato restituito. Un modo sicuro per utilizzare questa API è in combinazione con [`napi_create_reference`](/it/nodejs/api/n-api#napi_create_reference), che può essere utilizzato per garantire il controllo sulla durata dell'`ArrayBuffer`. È inoltre sicuro utilizzare il buffer di dati restituito all'interno della stessa callback purché non vi siano chiamate ad altre API che potrebbero attivare una GC.


#### `napi_get_buffer_info` {#napi_get_buffer_info}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status napi_get_buffer_info(napi_env env,
                                 napi_value value,
                                 void** data,
                                 size_t* length)
```
- `[in] env`: L'ambiente in cui viene richiamata l'API.
- `[in] value`: `napi_value` che rappresenta il `node::Buffer` o `Uint8Array` su cui si sta effettuando la query.
- `[out] data`: Il buffer di dati sottostante del `node::Buffer` o `Uint8Array`. Se la lunghezza è `0`, questo può essere `NULL` o qualsiasi altro valore di puntatore.
- `[out] length`: Lunghezza in byte del buffer di dati sottostante.

Restituisce `napi_ok` se l'API ha avuto successo.

Questo metodo restituisce gli stessi `data` e `byte_length` di [`napi_get_typedarray_info`](/it/nodejs/api/n-api#napi_get_typedarray_info). Inoltre, `napi_get_typedarray_info` accetta anche un `node::Buffer` (un Uint8Array) come valore.

Questa API viene utilizzata per recuperare il buffer di dati sottostante di un `node::Buffer` e la sua lunghezza.

*Avviso*: Prestare attenzione quando si utilizza questa API poiché la durata del buffer di dati sottostante non è garantita se è gestita dalla VM.

#### `napi_get_prototype` {#napi_get_prototype}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status napi_get_prototype(napi_env env,
                               napi_value object,
                               napi_value* result)
```
- `[in] env`: L'ambiente in cui viene richiamata l'API.
- `[in] object`: `napi_value` che rappresenta l'`Object` JavaScript di cui restituire il prototipo. Questo restituisce l'equivalente di `Object.getPrototypeOf` (che non è lo stesso della proprietà `prototype` della funzione).
- `[out] result`: `napi_value` che rappresenta il prototipo dell'oggetto specificato.

Restituisce `napi_ok` se l'API ha avuto successo.

#### `napi_get_typedarray_info` {#napi_get_typedarray_info}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status napi_get_typedarray_info(napi_env env,
                                     napi_value typedarray,
                                     napi_typedarray_type* type,
                                     size_t* length,
                                     void** data,
                                     napi_value* arraybuffer,
                                     size_t* byte_offset)
```
- `[in] env`: L'ambiente in cui viene richiamata l'API.
- `[in] typedarray`: `napi_value` che rappresenta il `TypedArray` di cui interrogare le proprietà.
- `[out] type`: Tipo di dati scalare degli elementi all'interno di `TypedArray`.
- `[out] length`: Il numero di elementi in `TypedArray`.
- `[out] data`: Il buffer di dati sottostante `TypedArray` regolato dal valore `byte_offset` in modo che punti al primo elemento in `TypedArray`. Se la lunghezza dell'array è `0`, questo può essere `NULL` o qualsiasi altro valore di puntatore.
- `[out] arraybuffer`: L'`ArrayBuffer` sottostante `TypedArray`.
- `[out] byte_offset`: L'offset di byte all'interno dell'array nativo sottostante in cui si trova il primo elemento degli array. Il valore per il parametro data è già stato regolato in modo che data punti al primo elemento nell'array. Pertanto, il primo byte dell'array nativo sarebbe in `data - byte_offset`.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API restituisce varie proprietà di un array tipizzato.

Qualsiasi dei parametri out può essere `NULL` se quella proprietà non è necessaria.

*Avviso*: Prestare attenzione quando si utilizza questa API poiché il buffer di dati sottostante è gestito dalla VM.


#### `napi_get_dataview_info` {#napi_get_dataview_info}

**Aggiunto in: v8.3.0**

**Versione N-API: 1**

```C [C]
napi_status napi_get_dataview_info(napi_env env,
                                   napi_value dataview,
                                   size_t* byte_length,
                                   void** data,
                                   napi_value* arraybuffer,
                                   size_t* byte_offset)
```
- `[in] env`: L'ambiente in cui viene richiamata l'API.
- `[in] dataview`: `napi_value` che rappresenta la `DataView` di cui interrogare le proprietà.
- `[out] byte_length`: Numero di byte nella `DataView`.
- `[out] data`: Il buffer di dati sottostante la `DataView`. Se byte_length è `0`, questo può essere `NULL` o qualsiasi altro valore di puntatore.
- `[out] arraybuffer`: `ArrayBuffer` sottostante la `DataView`.
- `[out] byte_offset`: L'offset di byte all'interno del buffer di dati da cui iniziare a proiettare la `DataView`.

Restituisce `napi_ok` se l'API ha avuto successo.

Qualsiasi parametro out può essere `NULL` se tale proprietà non è necessaria.

Questa API restituisce varie proprietà di una `DataView`.

#### `napi_get_date_value` {#napi_get_date_value}

**Aggiunto in: v11.11.0, v10.17.0**

**Versione N-API: 5**

```C [C]
napi_status napi_get_date_value(napi_env env,
                                napi_value value,
                                double* result)
```
- `[in] env`: L'ambiente in cui viene richiamata l'API.
- `[in] value`: `napi_value` che rappresenta una `Date` JavaScript.
- `[out] result`: Valore temporale come `double` rappresentato come millisecondi dalla mezzanotte all'inizio del 1° gennaio 1970 UTC.

Questa API non osserva i secondi intercalari; vengono ignorati, poiché ECMAScript si allinea alla specifica temporale POSIX.

Restituisce `napi_ok` se l'API ha avuto successo. Se viene passato un `napi_value` non di tipo data, restituisce `napi_date_expected`.

Questa API restituisce il tipo primitivo C double del valore temporale per la `Date` JavaScript fornita.

#### `napi_get_value_bool` {#napi_get_value_bool}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status napi_get_value_bool(napi_env env, napi_value value, bool* result)
```
- `[in] env`: L'ambiente in cui viene richiamata l'API.
- `[in] value`: `napi_value` che rappresenta un `Boolean` JavaScript.
- `[out] result`: Primitiva booleana C equivalente al `Boolean` JavaScript fornito.

Restituisce `napi_ok` se l'API ha avuto successo. Se viene passato un `napi_value` non booleano, restituisce `napi_boolean_expected`.

Questa API restituisce la primitiva booleana C equivalente al `Boolean` JavaScript fornito.


#### `napi_get_value_double` {#napi_get_value_double}

**Aggiunta in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status napi_get_value_double(napi_env env,
                                  napi_value value,
                                  double* result)
```
- `[in] env`: L'ambiente in cui viene richiamata l'API.
- `[in] value`: `napi_value` che rappresenta un `number` JavaScript.
- `[out] result`: Primitiva C double equivalente al `number` JavaScript fornito.

Restituisce `napi_ok` se l'API ha avuto successo. Se viene passato un `napi_value` non numerico, restituisce `napi_number_expected`.

Questa API restituisce la primitiva C double equivalente al `number` JavaScript fornito.

#### `napi_get_value_bigint_int64` {#napi_get_value_bigint_int64}

**Aggiunta in: v10.7.0**

**Versione N-API: 6**

```C [C]
napi_status napi_get_value_bigint_int64(napi_env env,
                                        napi_value value,
                                        int64_t* result,
                                        bool* lossless);
```
- `[in] env`: L'ambiente in cui viene richiamata l'API.
- `[in] value`: `napi_value` che rappresenta un `BigInt` JavaScript.
- `[out] result`: Primitiva C `int64_t` equivalente al `BigInt` JavaScript fornito.
- `[out] lossless`: Indica se il valore `BigInt` è stato convertito senza perdita di dati.

Restituisce `napi_ok` se l'API ha avuto successo. Se viene passato un valore diverso da `BigInt`, restituisce `napi_bigint_expected`.

Questa API restituisce la primitiva C `int64_t` equivalente al `BigInt` JavaScript fornito. Se necessario, troncherà il valore, impostando `lossless` su `false`.

#### `napi_get_value_bigint_uint64` {#napi_get_value_bigint_uint64}

**Aggiunta in: v10.7.0**

**Versione N-API: 6**

```C [C]
napi_status napi_get_value_bigint_uint64(napi_env env,
                                        napi_value value,
                                        uint64_t* result,
                                        bool* lossless);
```
- `[in] env`: L'ambiente in cui viene richiamata l'API.
- `[in] value`: `napi_value` che rappresenta un `BigInt` JavaScript.
- `[out] result`: Primitiva C `uint64_t` equivalente al `BigInt` JavaScript fornito.
- `[out] lossless`: Indica se il valore `BigInt` è stato convertito senza perdita di dati.

Restituisce `napi_ok` se l'API ha avuto successo. Se viene passato un valore diverso da `BigInt`, restituisce `napi_bigint_expected`.

Questa API restituisce la primitiva C `uint64_t` equivalente al `BigInt` JavaScript fornito. Se necessario, troncherà il valore, impostando `lossless` su `false`.


#### `napi_get_value_bigint_words` {#napi_get_value_bigint_words}

**Aggiunto in: v10.7.0**

**Versione N-API: 6**

```C [C]
napi_status napi_get_value_bigint_words(napi_env env,
                                        napi_value value,
                                        int* sign_bit,
                                        size_t* word_count,
                                        uint64_t* words);
```
- `[in] env`: L'ambiente in cui viene richiamata l'API.
- `[in] value`: `napi_value` che rappresenta JavaScript `BigInt`.
- `[out] sign_bit`: Intero che rappresenta se il `BigInt` JavaScript è positivo o negativo.
- `[in/out] word_count`: Deve essere inizializzato alla lunghezza dell'array `words`. Al ritorno, verrà impostato sul numero effettivo di parole necessarie per archiviare questo `BigInt`.
- `[out] words`: Puntatore a un array di parole a 64 bit pre-allocato.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API converte un singolo valore `BigInt` in un bit di segno, un array little-endian a 64 bit e il numero di elementi nell'array. `sign_bit` e `words` possono essere entrambi impostati su `NULL`, al fine di ottenere solo `word_count`.

#### `napi_get_value_external` {#napi_get_value_external}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status napi_get_value_external(napi_env env,
                                    napi_value value,
                                    void** result)
```
- `[in] env`: L'ambiente in cui viene richiamata l'API.
- `[in] value`: `napi_value` che rappresenta un valore esterno JavaScript.
- `[out] result`: Puntatore ai dati incapsulati dal valore esterno JavaScript.

Restituisce `napi_ok` se l'API ha avuto successo. Se viene passato un `napi_value` non esterno, restituisce `napi_invalid_arg`.

Questa API recupera il puntatore ai dati esterni che è stato precedentemente passato a `napi_create_external()`.

#### `napi_get_value_int32` {#napi_get_value_int32}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status napi_get_value_int32(napi_env env,
                                 napi_value value,
                                 int32_t* result)
```
- `[in] env`: L'ambiente in cui viene richiamata l'API.
- `[in] value`: `napi_value` che rappresenta un `number` JavaScript.
- `[out] result`: Primitiva C `int32` equivalente al dato `number` JavaScript.

Restituisce `napi_ok` se l'API ha avuto successo. Se viene passato un `napi_value` non numerico, restituisce `napi_number_expected`.

Questa API restituisce la primitiva C `int32` equivalente al dato `number` JavaScript.

Se il numero supera l'intervallo dell'intero a 32 bit, il risultato viene troncato all'equivalente dei 32 bit inferiori. Ciò può comportare che un grande numero positivo diventi un numero negativo se il valore è > 2^31 - 1.

Valori numerici non finiti (`NaN`, `+Infinity` o `-Infinity`) impostano il risultato su zero.


#### `napi_get_value_int64` {#napi_get_value_int64}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status napi_get_value_int64(napi_env env,
                                 napi_value value,
                                 int64_t* result)
```
- `[in] env`: L'ambiente sotto il quale viene invocata l'API.
- `[in] value`: `napi_value` che rappresenta un `number` JavaScript.
- `[out] result`: Primitiva C `int64` equivalente al `number` JavaScript fornito.

Restituisce `napi_ok` se l'API ha avuto successo. Se viene passato un `napi_value` non-number, restituisce `napi_number_expected`.

Questa API restituisce la primitiva C `int64` equivalente al `number` JavaScript fornito.

I valori `number` al di fuori dell'intervallo di [`Number.MIN_SAFE_INTEGER`](https://tc39.github.io/ecma262/#sec-number.min_safe_integer) `-(2**53 - 1)` - [`Number.MAX_SAFE_INTEGER`](https://tc39.github.io/ecma262/#sec-number.max_safe_integer) `(2**53 - 1)` perderanno precisione.

I valori numerici non finiti (`NaN`, `+Infinity` o `-Infinity`) impostano il risultato a zero.

#### `napi_get_value_string_latin1` {#napi_get_value_string_latin1}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status napi_get_value_string_latin1(napi_env env,
                                         napi_value value,
                                         char* buf,
                                         size_t bufsize,
                                         size_t* result)
```
- `[in] env`: L'ambiente sotto il quale viene invocata l'API.
- `[in] value`: `napi_value` che rappresenta una stringa JavaScript.
- `[in] buf`: Buffer in cui scrivere la stringa codificata in ISO-8859-1. Se viene passato `NULL`, la lunghezza della stringa in byte, escluso il terminatore nullo, viene restituita in `result`.
- `[in] bufsize`: Dimensione del buffer di destinazione. Quando questo valore è insufficiente, la stringa restituita viene troncata e terminata con null.
- `[out] result`: Numero di byte copiati nel buffer, escluso il terminatore nullo.

Restituisce `napi_ok` se l'API ha avuto successo. Se viene passato un `napi_value` non-`string`, restituisce `napi_string_expected`.

Questa API restituisce la stringa codificata in ISO-8859-1 corrispondente al valore passato.


#### `napi_get_value_string_utf8` {#napi_get_value_string_utf8}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status napi_get_value_string_utf8(napi_env env,
                                       napi_value value,
                                       char* buf,
                                       size_t bufsize,
                                       size_t* result)
```
- `[in] env`: L'ambiente in cui viene invocata l'API.
- `[in] value`: `napi_value` che rappresenta la stringa JavaScript.
- `[in] buf`: Buffer in cui scrivere la stringa con codifica UTF8. Se viene passato `NULL`, la lunghezza della stringa in byte, escluso il terminatore nullo, viene restituita in `result`.
- `[in] bufsize`: Dimensione del buffer di destinazione. Quando questo valore è insufficiente, la stringa restituita viene troncata e terminata con null.
- `[out] result`: Numero di byte copiati nel buffer, escluso il terminatore nullo.

Restituisce `napi_ok` se l'API ha avuto successo. Se viene passato un `napi_value` non `string`, restituisce `napi_string_expected`.

Questa API restituisce la stringa con codifica UTF8 corrispondente al valore passato.

#### `napi_get_value_string_utf16` {#napi_get_value_string_utf16}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status napi_get_value_string_utf16(napi_env env,
                                        napi_value value,
                                        char16_t* buf,
                                        size_t bufsize,
                                        size_t* result)
```
- `[in] env`: L'ambiente in cui viene invocata l'API.
- `[in] value`: `napi_value` che rappresenta la stringa JavaScript.
- `[in] buf`: Buffer in cui scrivere la stringa con codifica UTF16-LE. Se viene passato `NULL`, viene restituita la lunghezza della stringa in unità di codice a 2 byte, escluso il terminatore nullo.
- `[in] bufsize`: Dimensione del buffer di destinazione. Quando questo valore è insufficiente, la stringa restituita viene troncata e terminata con null.
- `[out] result`: Numero di unità di codice a 2 byte copiate nel buffer, escluso il terminatore nullo.

Restituisce `napi_ok` se l'API ha avuto successo. Se viene passato un `napi_value` non `string`, restituisce `napi_string_expected`.

Questa API restituisce la stringa con codifica UTF16 corrispondente al valore passato.


#### `napi_get_value_uint32` {#napi_get_value_uint32}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status napi_get_value_uint32(napi_env env,
                                  napi_value value,
                                  uint32_t* result)
```
- `[in] env`: L'ambiente in cui viene invocata l'API.
- `[in] value`: `napi_value` che rappresenta un `number` JavaScript.
- `[out] result`: Primitiva C equivalente del `napi_value` fornito come `uint32_t`.

Restituisce `napi_ok` se l'API ha avuto successo. Se viene passato un `napi_value` non numerico, restituisce `napi_number_expected`.

Questa API restituisce la primitiva C equivalente del `napi_value` fornito come `uint32_t`.

### Funzioni per ottenere istanze globali {#functions-to-get-global-instances}

#### `napi_get_boolean` {#napi_get_boolean}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status napi_get_boolean(napi_env env, bool value, napi_value* result)
```
- `[in] env`: L'ambiente in cui viene invocata l'API.
- `[in] value`: Il valore del booleano da recuperare.
- `[out] result`: `napi_value` che rappresenta il singleton `Boolean` JavaScript da recuperare.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API viene utilizzata per restituire l'oggetto singleton JavaScript utilizzato per rappresentare il valore booleano fornito.

#### `napi_get_global` {#napi_get_global}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status napi_get_global(napi_env env, napi_value* result)
```
- `[in] env`: L'ambiente in cui viene invocata l'API.
- `[out] result`: `napi_value` che rappresenta l'oggetto `global` JavaScript.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API restituisce l'oggetto `global`.

#### `napi_get_null` {#napi_get_null}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status napi_get_null(napi_env env, napi_value* result)
```
- `[in] env`: L'ambiente in cui viene invocata l'API.
- `[out] result`: `napi_value` che rappresenta l'oggetto `null` JavaScript.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API restituisce l'oggetto `null`.

#### `napi_get_undefined` {#napi_get_undefined}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status napi_get_undefined(napi_env env, napi_value* result)
```
- `[in] env`: L'ambiente in cui viene invocata l'API.
- `[out] result`: `napi_value` che rappresenta il valore Undefined di JavaScript.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API restituisce l'oggetto Undefined.


## Lavorare con valori JavaScript e operazioni astratte {#working-with-javascript-values-and-abstract-operations}

Node-API espone una serie di API per eseguire alcune operazioni astratte sui valori JavaScript. Alcune di queste operazioni sono documentate nella [Sezione 7](https://tc39.github.io/ecma262/#sec-abstract-operations) della [Specificazione del linguaggio ECMAScript](https://tc39.github.io/ecma262/).

Queste API supportano l'esecuzione di una delle seguenti azioni:

### `napi_coerce_to_bool` {#napi_coerce_to_bool}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status napi_coerce_to_bool(napi_env env,
                                napi_value value,
                                napi_value* result)
```
- `[in] env`: L'ambiente in cui viene invocata l'API.
- `[in] value`: Il valore JavaScript da forzare.
- `[out] result`: `napi_value` che rappresenta il `Boolean` JavaScript forzato.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API implementa l'operazione astratta `ToBoolean()` come definita nella [Sezione 7.1.2](https://tc39.github.io/ecma262/#sec-toboolean) della Specificazione del linguaggio ECMAScript.

### `napi_coerce_to_number` {#napi_coerce_to_number}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status napi_coerce_to_number(napi_env env,
                                  napi_value value,
                                  napi_value* result)
```
- `[in] env`: L'ambiente in cui viene invocata l'API.
- `[in] value`: Il valore JavaScript da forzare.
- `[out] result`: `napi_value` che rappresenta il `number` JavaScript forzato.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API implementa l'operazione astratta `ToNumber()` come definita nella [Sezione 7.1.3](https://tc39.github.io/ecma262/#sec-tonumber) della Specificazione del linguaggio ECMAScript. Questa funzione potenzialmente esegue codice JS se il valore passato è un oggetto.

### `napi_coerce_to_object` {#napi_coerce_to_object}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status napi_coerce_to_object(napi_env env,
                                  napi_value value,
                                  napi_value* result)
```
- `[in] env`: L'ambiente in cui viene invocata l'API.
- `[in] value`: Il valore JavaScript da forzare.
- `[out] result`: `napi_value` che rappresenta l'`Object` JavaScript forzato.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API implementa l'operazione astratta `ToObject()` come definita nella [Sezione 7.1.13](https://tc39.github.io/ecma262/#sec-toobject) della Specificazione del linguaggio ECMAScript.


### `napi_coerce_to_string` {#napi_coerce_to_string}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status napi_coerce_to_string(napi_env env,
                                  napi_value value,
                                  napi_value* result)
```
- `[in] env`: L'ambiente in cui viene invocata l'API.
- `[in] value`: Il valore JavaScript da forzare.
- `[out] result`: `napi_value` che rappresenta la `stringa` JavaScript forzata.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API implementa l'operazione astratta `ToString()` come definito nella [Sezione 7.1.13](https://tc39.github.io/ecma262/#sec-toobject) della Specifica del Linguaggio ECMAScript. Questa funzione potenzialmente esegue codice JS se il valore passato è un oggetto.

### `napi_typeof` {#napi_typeof}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status napi_typeof(napi_env env, napi_value value, napi_valuetype* result)
```
- `[in] env`: L'ambiente in cui viene invocata l'API.
- `[in] value`: Il valore JavaScript di cui interrogare il tipo.
- `[out] result`: Il tipo del valore JavaScript.

Restituisce `napi_ok` se l'API ha avuto successo.

- `napi_invalid_arg` se il tipo di `value` non è un tipo ECMAScript noto e `value` non è un valore Esterno.

Questa API rappresenta un comportamento simile all'invocazione dell'operatore `typeof` sull'oggetto come definito nella [Sezione 12.5.5](https://tc39.github.io/ecma262/#sec-typeof-operator) della Specifica del Linguaggio ECMAScript. Tuttavia, ci sono alcune differenze:

Se `value` ha un tipo non valido, viene restituito un errore.

### `napi_instanceof` {#napi_instanceof}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status napi_instanceof(napi_env env,
                            napi_value object,
                            napi_value constructor,
                            bool* result)
```
- `[in] env`: L'ambiente in cui viene invocata l'API.
- `[in] object`: Il valore JavaScript da controllare.
- `[in] constructor`: L'oggetto funzione JavaScript della funzione costruttore da verificare.
- `[out] result`: Booleano impostato su true se `object instanceof constructor` è true.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API rappresenta l'invocazione dell'operatore `instanceof` sull'oggetto come definito nella [Sezione 12.10.4](https://tc39.github.io/ecma262/#sec-instanceofoperator) della Specifica del Linguaggio ECMAScript.


### `napi_is_array` {#napi_is_array}

**Aggiunta in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status napi_is_array(napi_env env, napi_value value, bool* result)
```
- `[in] env`: L'ambiente sotto il quale viene richiamata l'API.
- `[in] value`: Il valore JavaScript da controllare.
- `[out] result`: Indica se l'oggetto specificato è un array.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API rappresenta l'invocazione dell'operazione `IsArray` sull'oggetto come definito nella [Sezione 7.2.2](https://tc39.github.io/ecma262/#sec-isarray) della specifica del linguaggio ECMAScript.

### `napi_is_arraybuffer` {#napi_is_arraybuffer}

**Aggiunta in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status napi_is_arraybuffer(napi_env env, napi_value value, bool* result)
```
- `[in] env`: L'ambiente sotto il quale viene richiamata l'API.
- `[in] value`: Il valore JavaScript da controllare.
- `[out] result`: Indica se l'oggetto specificato è un `ArrayBuffer`.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API verifica se l'`Object` passato è un array buffer.

### `napi_is_buffer` {#napi_is_buffer}

**Aggiunta in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status napi_is_buffer(napi_env env, napi_value value, bool* result)
```
- `[in] env`: L'ambiente sotto il quale viene richiamata l'API.
- `[in] value`: Il valore JavaScript da controllare.
- `[out] result`: Indica se il `napi_value` specificato rappresenta un oggetto `node::Buffer` o `Uint8Array`.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API verifica se l'`Object` passato è un buffer o Uint8Array. [`napi_is_typedarray`](/it/nodejs/api/n-api#napi_is_typedarray) dovrebbe essere preferito se il chiamante deve verificare se il valore è un Uint8Array.

### `napi_is_date` {#napi_is_date}

**Aggiunta in: v11.11.0, v10.17.0**

**Versione N-API: 5**

```C [C]
napi_status napi_is_date(napi_env env, napi_value value, bool* result)
```
- `[in] env`: L'ambiente sotto il quale viene richiamata l'API.
- `[in] value`: Il valore JavaScript da controllare.
- `[out] result`: Indica se il `napi_value` specificato rappresenta un oggetto JavaScript `Date`.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API verifica se l'`Object` passato è una data.


### `napi_is_error` {#napi_is_error_1}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status napi_is_error(napi_env env, napi_value value, bool* result)
```
- `[in] env`: L'ambiente in cui viene richiamata l'API.
- `[in] value`: Il valore JavaScript da controllare.
- `[out] result`: Indica se il `napi_value` fornito rappresenta un oggetto `Error`.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API verifica se l'`Object` passato è un `Error`.

### `napi_is_typedarray` {#napi_is_typedarray}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status napi_is_typedarray(napi_env env, napi_value value, bool* result)
```
- `[in] env`: L'ambiente in cui viene richiamata l'API.
- `[in] value`: Il valore JavaScript da controllare.
- `[out] result`: Indica se il `napi_value` fornito rappresenta un `TypedArray`.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API verifica se l'`Object` passato è un typed array.

### `napi_is_dataview` {#napi_is_dataview}

**Aggiunto in: v8.3.0**

**Versione N-API: 1**

```C [C]
napi_status napi_is_dataview(napi_env env, napi_value value, bool* result)
```
- `[in] env`: L'ambiente in cui viene richiamata l'API.
- `[in] value`: Il valore JavaScript da controllare.
- `[out] result`: Indica se il `napi_value` fornito rappresenta un `DataView`.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API verifica se l'`Object` passato è un `DataView`.

### `napi_strict_equals` {#napi_strict_equals}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status napi_strict_equals(napi_env env,
                               napi_value lhs,
                               napi_value rhs,
                               bool* result)
```
- `[in] env`: L'ambiente in cui viene richiamata l'API.
- `[in] lhs`: Il valore JavaScript da controllare.
- `[in] rhs`: Il valore JavaScript da confrontare.
- `[out] result`: Indica se i due oggetti `napi_value` sono uguali.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API rappresenta l'invocazione dell'algoritmo di Strict Equality come definito nella [Sezione 7.2.14](https://tc39.github.io/ecma262/#sec-strict-equality-comparison) della specifica del linguaggio ECMAScript.


### `napi_detach_arraybuffer` {#napi_detach_arraybuffer}

**Aggiunto in: v13.0.0, v12.16.0, v10.22.0**

**Versione N-API: 7**

```C [C]
napi_status napi_detach_arraybuffer(napi_env env,
                                    napi_value arraybuffer)
```
- `[in] env`: L'ambiente in cui viene richiamata l'API.
- `[in] arraybuffer`: L'`ArrayBuffer` JavaScript da scollegare.

Restituisce `napi_ok` se l'API ha avuto successo. Se viene passato un `ArrayBuffer` non scollegabile, restituisce `napi_detachable_arraybuffer_expected`.

Generalmente, un `ArrayBuffer` non è scollegabile se è stato scollegato in precedenza. Il motore può imporre condizioni aggiuntive sulla possibilità di scollegare un `ArrayBuffer`. Ad esempio, V8 richiede che l'`ArrayBuffer` sia esterno, ovvero creato con [`napi_create_external_arraybuffer`](/it/nodejs/api/n-api#napi_create_external_arraybuffer).

Questa API rappresenta l'invocazione dell'operazione di scollegamento di `ArrayBuffer` come definita nella [Sezione 24.1.1.3](https://tc39.es/ecma262/#sec-detacharraybuffer) della Specifica del linguaggio ECMAScript.

### `napi_is_detached_arraybuffer` {#napi_is_detached_arraybuffer}

**Aggiunto in: v13.3.0, v12.16.0, v10.22.0**

**Versione N-API: 7**

```C [C]
napi_status napi_is_detached_arraybuffer(napi_env env,
                                         napi_value arraybuffer,
                                         bool* result)
```
- `[in] env`: L'ambiente in cui viene richiamata l'API.
- `[in] arraybuffer`: L'`ArrayBuffer` JavaScript da controllare.
- `[out] result`: Indica se l'`arraybuffer` è scollegato.

Restituisce `napi_ok` se l'API ha avuto successo.

L'`ArrayBuffer` è considerato scollegato se i suoi dati interni sono `null`.

Questa API rappresenta l'invocazione dell'operazione `IsDetachedBuffer` di `ArrayBuffer` come definita nella [Sezione 24.1.1.2](https://tc39.es/ecma262/#sec-isdetachedbuffer) della Specifica del linguaggio ECMAScript.

## Lavorare con le proprietà JavaScript {#working-with-javascript-properties}

Node-API espone una serie di API per ottenere e impostare le proprietà sugli oggetti JavaScript. Alcuni di questi tipi sono documentati nella [Sezione 7](https://tc39.github.io/ecma262/#sec-abstract-operations) della [Specifica del linguaggio ECMAScript](https://tc39.github.io/ecma262/).

Le proprietà in JavaScript sono rappresentate come una tupla di una chiave e un valore. Fondamentalmente, tutte le chiavi delle proprietà in Node-API possono essere rappresentate in una delle seguenti forme:

- Denominata: una semplice stringa con codifica UTF8
- Indicizzata per intero: un valore di indice rappresentato da `uint32_t`
- Valore JavaScript: questi sono rappresentati in Node-API da `napi_value`. Questo può essere un `napi_value` che rappresenta una `string`, `number` o `symbol`.

I valori Node-API sono rappresentati dal tipo `napi_value`. Qualsiasi chiamata Node-API che richiede un valore JavaScript accetta un `napi_value`. Tuttavia, è responsabilità del chiamante assicurarsi che il `napi_value` in questione sia del tipo JavaScript previsto dall'API.

Le API documentate in questa sezione forniscono una semplice interfaccia per ottenere e impostare proprietà su oggetti JavaScript arbitrari rappresentati da `napi_value`.

Ad esempio, considera il seguente frammento di codice JavaScript:

```js [ESM]
const obj = {};
obj.myProp = 123;
```
L'equivalente può essere fatto usando valori Node-API con il seguente frammento:

```C [C]
napi_status status = napi_generic_failure;

// const obj = {}
napi_value obj, value;
status = napi_create_object(env, &obj);
if (status != napi_ok) return status;

// Crea un napi_value per 123
status = napi_create_int32(env, 123, &value);
if (status != napi_ok) return status;

// obj.myProp = 123
status = napi_set_named_property(env, obj, "myProp", value);
if (status != napi_ok) return status;
```
Le proprietà indicizzate possono essere impostate in modo simile. Considera il seguente frammento di codice JavaScript:

```js [ESM]
const arr = [];
arr[123] = 'hello';
```
L'equivalente può essere fatto usando valori Node-API con il seguente frammento:

```C [C]
napi_status status = napi_generic_failure;

// const arr = [];
napi_value arr, value;
status = napi_create_array(env, &arr);
if (status != napi_ok) return status;

// Crea un napi_value per 'hello'
status = napi_create_string_utf8(env, "hello", NAPI_AUTO_LENGTH, &value);
if (status != napi_ok) return status;

// arr[123] = 'hello';
status = napi_set_element(env, arr, 123, value);
if (status != napi_ok) return status;
```
Le proprietà possono essere recuperate utilizzando le API descritte in questa sezione. Considera il seguente frammento di codice JavaScript:

```js [ESM]
const arr = [];
const value = arr[123];
```
Il seguente è l'equivalente approssimativo della controparte Node-API:

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
Infine, è anche possibile definire più proprietà su un oggetto per motivi di prestazioni. Considera il seguente JavaScript:

```js [ESM]
const obj = {};
Object.defineProperties(obj, {
  'foo': { value: 123, writable: true, configurable: true, enumerable: true },
  'bar': { value: 456, writable: true, configurable: true, enumerable: true },
});
```
Il seguente è l'equivalente approssimativo della controparte Node-API:

```C [C]
napi_status status = napi_status_generic_failure;

// const obj = {};
napi_value obj;
status = napi_create_object(env, &obj);
if (status != napi_ok) return status;

// Crea napi_values per 123 e 456
napi_value fooValue, barValue;
status = napi_create_int32(env, 123, &fooValue);
if (status != napi_ok) return status;
status = napi_create_int32(env, 456, &barValue);
if (status != napi_ok) return status;

// Imposta le proprietà
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

### Strutture {#structures}

#### `napi_property_attributes` {#napi_property_attributes}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v14.12.0 | aggiunti `napi_default_method` e `napi_default_property`. |
:::

```C [C]
typedef enum {
  napi_default = 0,
  napi_writable = 1 << 0,
  napi_enumerable = 1 << 1,
  napi_configurable = 1 << 2,

  // Utilizzato con napi_define_class per distinguere le proprietà statiche
  // dalle proprietà dell'istanza. Ignorato da napi_define_properties.
  napi_static = 1 << 10,

  // Predefinito per i metodi di classe.
  napi_default_method = napi_writable | napi_configurable,

  // Predefinito per le proprietà dell'oggetto, come in JS obj[prop].
  napi_default_jsproperty = napi_writable |
                          napi_enumerable |
                          napi_configurable,
} napi_property_attributes;
```
`napi_property_attributes` sono flag utilizzati per controllare il comportamento delle proprietà impostate su un oggetto JavaScript. A parte `napi_static`, corrispondono agli attributi elencati nella [Sezione 6.1.7.1](https://tc39.github.io/ecma262/#table-2) della [Specificazione del linguaggio ECMAScript](https://tc39.github.io/ecma262/). Possono essere uno o più dei seguenti bitflag:

- `napi_default`: Nessun attributo esplicito è impostato sulla proprietà. Per impostazione predefinita, una proprietà è di sola lettura, non enumerabile e non configurabile.
- `napi_writable`: La proprietà è scrivibile.
- `napi_enumerable`: La proprietà è enumerabile.
- `napi_configurable`: La proprietà è configurabile come definito nella [Sezione 6.1.7.1](https://tc39.github.io/ecma262/#table-2) della [Specificazione del linguaggio ECMAScript](https://tc39.github.io/ecma262/).
- `napi_static`: La proprietà sarà definita come una proprietà statica su una classe, in contrapposizione a una proprietà di istanza, che è l'impostazione predefinita. Questo viene utilizzato solo da [`napi_define_class`](/it/nodejs/api/n-api#napi_define_class). Viene ignorato da `napi_define_properties`.
- `napi_default_method`: Come un metodo in una classe JS, la proprietà è configurabile e scrivibile, ma non enumerabile.
- `napi_default_jsproperty`: Come una proprietà impostata tramite assegnazione in JavaScript, la proprietà è scrivibile, enumerabile e configurabile.


#### `napi_property_descriptor` {#napi_property_descriptor}

```C [C]
typedef struct {
  // Uno tra utf8name e name deve essere NULL.
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
- `utf8name`: Stringa opzionale che descrive la chiave per la proprietà, codificata come UTF8. Uno tra `utf8name` e `name` deve essere fornito per la proprietà.
- `name`: `napi_value` opzionale che punta a una stringa JavaScript o a un simbolo da utilizzare come chiave per la proprietà. Uno tra `utf8name` e `name` deve essere fornito per la proprietà.
- `value`: Il valore recuperato da un accesso get della proprietà se la proprietà è una data property. Se questo viene passato, imposta `getter`, `setter`, `method` e `data` su `NULL` (poiché questi membri non verranno utilizzati).
- `getter`: Una funzione da chiamare quando viene eseguito un accesso get della proprietà. Se questo viene passato, imposta `value` e `method` su `NULL` (poiché questi membri non verranno utilizzati). La funzione fornita viene chiamata implicitamente dal runtime quando si accede alla proprietà dal codice JavaScript (o se viene eseguito un get sulla proprietà utilizzando una chiamata Node-API). [`napi_callback`](/it/nodejs/api/n-api#napi_callback) fornisce maggiori dettagli.
- `setter`: Una funzione da chiamare quando viene eseguito un accesso set della proprietà. Se questo viene passato, imposta `value` e `method` su `NULL` (poiché questi membri non verranno utilizzati). La funzione fornita viene chiamata implicitamente dal runtime quando la proprietà viene impostata dal codice JavaScript (o se viene eseguito un set sulla proprietà utilizzando una chiamata Node-API). [`napi_callback`](/it/nodejs/api/n-api#napi_callback) fornisce maggiori dettagli.
- `method`: Impostalo per fare in modo che la proprietà `value` dell'oggetto descrittore di proprietà sia una funzione JavaScript rappresentata da `method`. Se questo viene passato, imposta `value`, `getter` e `setter` su `NULL` (poiché questi membri non verranno utilizzati). [`napi_callback`](/it/nodejs/api/n-api#napi_callback) fornisce maggiori dettagli.
- `attributes`: Gli attributi associati alla particolare proprietà. Vedi [`napi_property_attributes`](/it/nodejs/api/n-api#napi_property_attributes).
- `data`: I dati di callback passati a `method`, `getter` e `setter` se questa funzione viene invocata.


### Funzioni {#functions}

#### `napi_get_property_names` {#napi_get_property_names}

**Aggiunta in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status napi_get_property_names(napi_env env,
                                    napi_value object,
                                    napi_value* result);
```
- `[in] env`: L'ambiente in cui viene invocata la chiamata Node-API.
- `[in] object`: L'oggetto da cui recuperare le proprietà.
- `[out] result`: Un `napi_value` che rappresenta un array di valori JavaScript che rappresentano i nomi delle proprietà dell'oggetto. L'API può essere utilizzata per iterare su `result` usando [`napi_get_array_length`](/it/nodejs/api/n-api#napi_get_array_length) e [`napi_get_element`](/it/nodejs/api/n-api#napi_get_element).

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API restituisce i nomi delle proprietà enumerabili di `object` come un array di stringhe. Le proprietà di `object` la cui chiave è un simbolo non saranno incluse.

#### `napi_get_all_property_names` {#napi_get_all_property_names}

**Aggiunta in: v13.7.0, v12.17.0, v10.20.0**

**Versione N-API: 6**

```C [C]
napi_get_all_property_names(napi_env env,
                            napi_value object,
                            napi_key_collection_mode key_mode,
                            napi_key_filter key_filter,
                            napi_key_conversion key_conversion,
                            napi_value* result);
```
- `[in] env`: L'ambiente in cui viene invocata la chiamata Node-API.
- `[in] object`: L'oggetto da cui recuperare le proprietà.
- `[in] key_mode`: Indica se recuperare anche le proprietà del prototipo.
- `[in] key_filter`: Quali proprietà recuperare (enumerabile/leggibile/scrivibile).
- `[in] key_conversion`: Indica se convertire le chiavi di proprietà numerate in stringhe.
- `[out] result`: Un `napi_value` che rappresenta un array di valori JavaScript che rappresentano i nomi delle proprietà dell'oggetto. [`napi_get_array_length`](/it/nodejs/api/n-api#napi_get_array_length) e [`napi_get_element`](/it/nodejs/api/n-api#napi_get_element) possono essere utilizzate per iterare su `result`.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API restituisce un array contenente i nomi delle proprietà disponibili di questo oggetto.


#### `napi_set_property` {#napi_set_property}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status napi_set_property(napi_env env,
                              napi_value object,
                              napi_value key,
                              napi_value value);
```
- `[in] env`: L'ambiente in cui viene richiamata la chiamata Node-API.
- `[in] object`: L'oggetto su cui impostare la proprietà.
- `[in] key`: Il nome della proprietà da impostare.
- `[in] value`: Il valore della proprietà.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API imposta una proprietà sull'`Object` passato.

#### `napi_get_property` {#napi_get_property}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status napi_get_property(napi_env env,
                              napi_value object,
                              napi_value key,
                              napi_value* result);
```
- `[in] env`: L'ambiente in cui viene richiamata la chiamata Node-API.
- `[in] object`: L'oggetto da cui recuperare la proprietà.
- `[in] key`: Il nome della proprietà da recuperare.
- `[out] result`: Il valore della proprietà.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API ottiene la proprietà richiesta dall'`Object` passato.

#### `napi_has_property` {#napi_has_property}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status napi_has_property(napi_env env,
                              napi_value object,
                              napi_value key,
                              bool* result);
```
- `[in] env`: L'ambiente in cui viene richiamata la chiamata Node-API.
- `[in] object`: L'oggetto da interrogare.
- `[in] key`: Il nome della proprietà di cui verificare l'esistenza.
- `[out] result`: Indica se la proprietà esiste o meno sull'oggetto.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API verifica se l'`Object` passato ha la proprietà denominata.

#### `napi_delete_property` {#napi_delete_property}

**Aggiunto in: v8.2.0**

**Versione N-API: 1**

```C [C]
napi_status napi_delete_property(napi_env env,
                                 napi_value object,
                                 napi_value key,
                                 bool* result);
```
- `[in] env`: L'ambiente in cui viene richiamata la chiamata Node-API.
- `[in] object`: L'oggetto da interrogare.
- `[in] key`: Il nome della proprietà da eliminare.
- `[out] result`: Indica se l'eliminazione della proprietà ha avuto successo o meno. `result` può essere facoltativamente ignorato passando `NULL`.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API tenta di eliminare la proprietà propria `key` da `object`.


#### `napi_has_own_property` {#napi_has_own_property}

**Aggiunto in: v8.2.0**

**Versione N-API: 1**

```C [C]
napi_status napi_has_own_property(napi_env env,
                                  napi_value object,
                                  napi_value key,
                                  bool* result);
```
- `[in] env`: L'ambiente in cui viene invocata la chiamata Node-API.
- `[in] object`: L'oggetto da interrogare.
- `[in] key`: Il nome della proprietà "own" di cui verificare l'esistenza.
- `[out] result`: Indica se la proprietà "own" esiste sull'oggetto o meno.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API verifica se l'`Object` passato ha la proprietà "own" specificata. `key` deve essere una `string` o un `symbol`, altrimenti verrà generato un errore. Node-API non eseguirà alcuna conversione tra i tipi di dati.

#### `napi_set_named_property` {#napi_set_named_property}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status napi_set_named_property(napi_env env,
                                    napi_value object,
                                    const char* utf8Name,
                                    napi_value value);
```
- `[in] env`: L'ambiente in cui viene invocata la chiamata Node-API.
- `[in] object`: L'oggetto su cui impostare la proprietà.
- `[in] utf8Name`: Il nome della proprietà da impostare.
- `[in] value`: Il valore della proprietà.

Restituisce `napi_ok` se l'API ha avuto successo.

Questo metodo è equivalente a chiamare [`napi_set_property`](/it/nodejs/api/n-api#napi_set_property) con un `napi_value` creato dalla stringa passata come `utf8Name`.

#### `napi_get_named_property` {#napi_get_named_property}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status napi_get_named_property(napi_env env,
                                    napi_value object,
                                    const char* utf8Name,
                                    napi_value* result);
```
- `[in] env`: L'ambiente in cui viene invocata la chiamata Node-API.
- `[in] object`: L'oggetto da cui recuperare la proprietà.
- `[in] utf8Name`: Il nome della proprietà da ottenere.
- `[out] result`: Il valore della proprietà.

Restituisce `napi_ok` se l'API ha avuto successo.

Questo metodo è equivalente a chiamare [`napi_get_property`](/it/nodejs/api/n-api#napi_get_property) con un `napi_value` creato dalla stringa passata come `utf8Name`.


#### `napi_has_named_property` {#napi_has_named_property}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status napi_has_named_property(napi_env env,
                                    napi_value object,
                                    const char* utf8Name,
                                    bool* result);
```
- `[in] env`: L'ambiente in cui viene invocata la chiamata Node-API.
- `[in] object`: L'oggetto da interrogare.
- `[in] utf8Name`: Il nome della proprietà di cui verificare l'esistenza.
- `[out] result`: Indica se la proprietà esiste sull'oggetto o meno.

Restituisce `napi_ok` se l'API ha avuto successo.

Questo metodo è equivalente a chiamare [`napi_has_property`](/it/nodejs/api/n-api#napi_has_property) con un `napi_value` creato dalla stringa passata come `utf8Name`.

#### `napi_set_element` {#napi_set_element}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status napi_set_element(napi_env env,
                             napi_value object,
                             uint32_t index,
                             napi_value value);
```
- `[in] env`: L'ambiente in cui viene invocata la chiamata Node-API.
- `[in] object`: L'oggetto da cui impostare le proprietà.
- `[in] index`: L'indice della proprietà da impostare.
- `[in] value`: Il valore della proprietà.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API imposta un elemento sull'`Object` passato.

#### `napi_get_element` {#napi_get_element}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status napi_get_element(napi_env env,
                             napi_value object,
                             uint32_t index,
                             napi_value* result);
```
- `[in] env`: L'ambiente in cui viene invocata la chiamata Node-API.
- `[in] object`: L'oggetto da cui recuperare la proprietà.
- `[in] index`: L'indice della proprietà da ottenere.
- `[out] result`: Il valore della proprietà.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API ottiene l'elemento all'indice richiesto.

#### `napi_has_element` {#napi_has_element}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status napi_has_element(napi_env env,
                             napi_value object,
                             uint32_t index,
                             bool* result);
```
- `[in] env`: L'ambiente in cui viene invocata la chiamata Node-API.
- `[in] object`: L'oggetto da interrogare.
- `[in] index`: L'indice della proprietà di cui verificare l'esistenza.
- `[out] result`: Indica se la proprietà esiste sull'oggetto o meno.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API restituisce se l'`Object` passato ha un elemento all'indice richiesto.


#### `napi_delete_element` {#napi_delete_element}

**Aggiunto in: v8.2.0**

**Versione N-API: 1**

```C [C]
napi_status napi_delete_element(napi_env env,
                                napi_value object,
                                uint32_t index,
                                bool* result);
```
- `[in] env`: L'ambiente in cui viene richiamata la chiamata Node-API.
- `[in] object`: L'oggetto da interrogare.
- `[in] index`: L'indice della proprietà da eliminare.
- `[out] result`: Indica se l'eliminazione dell'elemento è avvenuta con successo o meno. `result` può essere facoltativamente ignorato passando `NULL`.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API tenta di eliminare l'`index` specificato da `object`.

#### `napi_define_properties` {#napi_define_properties}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status napi_define_properties(napi_env env,
                                   napi_value object,
                                   size_t property_count,
                                   const napi_property_descriptor* properties);
```
- `[in] env`: L'ambiente in cui viene richiamata la chiamata Node-API.
- `[in] object`: L'oggetto da cui recuperare le proprietà.
- `[in] property_count`: Il numero di elementi nell'array `properties`.
- `[in] properties`: L'array di descrittori di proprietà.

Restituisce `napi_ok` se l'API ha avuto successo.

Questo metodo consente la definizione efficiente di più proprietà su un dato oggetto. Le proprietà sono definite utilizzando i descrittori di proprietà (vedere [`napi_property_descriptor`](/it/nodejs/api/n-api#napi_property_descriptor)). Dato un array di tali descrittori di proprietà, questa API imposterà le proprietà sull'oggetto una alla volta, come definito da `DefineOwnProperty()` (descritto nella [Sezione 9.1.6](https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots-defineownproperty-p-desc) della specifica ECMA-262).

#### `napi_object_freeze` {#napi_object_freeze}

**Aggiunto in: v14.14.0, v12.20.0**

**Versione N-API: 8**

```C [C]
napi_status napi_object_freeze(napi_env env,
                               napi_value object);
```
- `[in] env`: L'ambiente in cui viene richiamata la chiamata Node-API.
- `[in] object`: L'oggetto da congelare.

Restituisce `napi_ok` se l'API ha avuto successo.

Questo metodo congela un determinato oggetto. Ciò impedisce l'aggiunta di nuove proprietà, la rimozione di proprietà esistenti, impedisce la modifica dell'enumerabilità, della configurabilità o della scrivibilità delle proprietà esistenti e impedisce la modifica dei valori delle proprietà esistenti. Impedisce anche la modifica del prototipo dell'oggetto. Questo è descritto nella [Sezione 19.1.2.6](https://tc39.es/ecma262/#sec-object.freeze) della specifica ECMA-262.


#### `napi_object_seal` {#napi_object_seal}

**Aggiunto in: v14.14.0, v12.20.0**

**Versione N-API: 8**

```C [C]
napi_status napi_object_seal(napi_env env,
                             napi_value object);
```
- `[in] env`: L'ambiente in cui viene invocata la chiamata Node-API.
- `[in] object`: L'oggetto da sigillare.

Restituisce `napi_ok` se l'API ha avuto successo.

Questo metodo sigilla un dato oggetto. Questo impedisce l'aggiunta di nuove proprietà ad esso, oltre a contrassegnare tutte le proprietà esistenti come non configurabili. Questo è descritto nella [Sezione 19.1.2.20](https://tc39.es/ecma262/#sec-object.seal) della specifica ECMA-262.

## Lavorare con le funzioni JavaScript {#working-with-javascript-functions}

Node-API fornisce una serie di API che consentono al codice JavaScript di richiamare il codice nativo. Le Node-API che supportano la richiamata nel codice nativo accettano funzioni di callback rappresentate dal tipo `napi_callback`. Quando la VM JavaScript richiama il codice nativo, viene invocata la funzione `napi_callback` fornita. Le API documentate in questa sezione consentono alla funzione di callback di fare quanto segue:

- Ottenere informazioni sul contesto in cui è stata invocata la callback.
- Ottenere gli argomenti passati alla callback.
- Restituire un `napi_value` dalla callback.

Inoltre, Node-API fornisce una serie di funzioni che consentono di chiamare funzioni JavaScript dal codice nativo. Si può chiamare una funzione come una normale chiamata di funzione JavaScript, oppure come una funzione costruttore.

Qualsiasi dato non `NULL` che viene passato a questa API tramite il campo `data` degli elementi `napi_property_descriptor` può essere associato a `object` e liberato ogni volta che `object` viene raccolto come spazzatura passando sia `object` che i dati a [`napi_add_finalizer`](/it/nodejs/api/n-api#napi_add_finalizer).

### `napi_call_function` {#napi_call_function}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_call_function(napi_env env,
                                           napi_value recv,
                                           napi_value func,
                                           size_t argc,
                                           const napi_value* argv,
                                           napi_value* result);
```
- `[in] env`: L'ambiente in cui viene invocata l'API.
- `[in] recv`: Il valore `this` passato alla funzione chiamata.
- `[in] func`: `napi_value` che rappresenta la funzione JavaScript da invocare.
- `[in] argc`: Il conteggio degli elementi nell'array `argv`.
- `[in] argv`: Array di `napi_value` che rappresentano i valori JavaScript passati come argomenti alla funzione.
- `[out] result`: `napi_value` che rappresenta l'oggetto JavaScript restituito.

Restituisce `napi_ok` se l'API ha avuto successo.

Questo metodo consente di chiamare un oggetto funzione JavaScript da un add-on nativo. Questo è il meccanismo principale per richiamare *dal* codice nativo dell'add-on *in* JavaScript. Per il caso speciale della richiamata in JavaScript dopo un'operazione asincrona, vedere [`napi_make_callback`](/it/nodejs/api/n-api#napi_make_callback).

Un caso d'uso di esempio potrebbe essere il seguente. Considera il seguente snippet JavaScript:

```js [ESM]
function AddTwo(num) {
  return num + 2;
}
global.AddTwo = AddTwo;
```
Quindi, la funzione di cui sopra può essere invocata da un add-on nativo usando il seguente codice:

```C [C]
// Ottieni la funzione denominata "AddTwo" sull'oggetto globale
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

// Converti il risultato di nuovo in un tipo nativo
int32_t result;
status = napi_get_value_int32(env, return_val, &result);
if (status != napi_ok) return;
```

### `napi_create_function` {#napi_create_function}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status napi_create_function(napi_env env,
                                 const char* utf8name,
                                 size_t length,
                                 napi_callback cb,
                                 void* data,
                                 napi_value* result);
```
- `[in] env`: L'ambiente sotto il quale viene richiamata l'API.
- `[in] utf8Name`: Nome facoltativo della funzione codificato come UTF8. Questo è visibile all'interno di JavaScript come la proprietà `name` del nuovo oggetto funzione.
- `[in] length`: La lunghezza di `utf8name` in byte, o `NAPI_AUTO_LENGTH` se è terminata con null.
- `[in] cb`: La funzione nativa che deve essere chiamata quando viene invocato questo oggetto funzione. [`napi_callback`](/it/nodejs/api/n-api#napi_callback) fornisce maggiori dettagli.
- `[in] data`: Contesto dati fornito dall'utente. Questo verrà ripassato alla funzione quando verrà invocata in seguito.
- `[out] result`: `napi_value` che rappresenta l'oggetto funzione JavaScript per la funzione appena creata.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API consente a un autore di componenti aggiuntivi di creare un oggetto funzione nel codice nativo. Questo è il meccanismo principale per consentire la chiamata *nel* codice nativo del componente aggiuntivo *da* JavaScript.

La funzione appena creata non è automaticamente visibile dallo script dopo questa chiamata. Invece, una proprietà deve essere esplicitamente impostata su qualsiasi oggetto visibile a JavaScript, affinché la funzione sia accessibile dallo script.

Per esporre una funzione come parte delle esportazioni del modulo del componente aggiuntivo, impostare la funzione appena creata sull'oggetto exports. Un modulo di esempio potrebbe avere il seguente aspetto:

```C [C]
napi_value SayHello(napi_env env, napi_callback_info info) {
  printf("Ciao\n");
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
Dato il codice sopra, il componente aggiuntivo può essere utilizzato da JavaScript come segue:

```js [ESM]
const myaddon = require('./addon');
myaddon.sayHello();
```
La stringa passata a `require()` è il nome del target in `binding.gyp` responsabile della creazione del file `.node`.

Qualsiasi dato non `NULL` che viene passato a questa API tramite il parametro `data` può essere associato alla funzione JavaScript risultante (che viene restituita nel parametro `result`) e liberato ogni volta che la funzione viene sottoposta a garbage collection passando sia la funzione JavaScript che i dati a [`napi_add_finalizer`](/it/nodejs/api/n-api#napi_add_finalizer).

Le `Function` JavaScript sono descritte nella [Sezione 19.2](https://tc39.github.io/ecma262/#sec-function-objects) della specifica del linguaggio ECMAScript.


### `napi_get_cb_info` {#napi_get_cb_info}

**Aggiunta in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status napi_get_cb_info(napi_env env,
                             napi_callback_info cbinfo,
                             size_t* argc,
                             napi_value* argv,
                             napi_value* thisArg,
                             void** data)
```
- `[in] env`: L'ambiente in cui viene invocata l'API.
- `[in] cbinfo`: Le informazioni di callback passate alla funzione di callback.
- `[in-out] argc`: Specifica la lunghezza dell'array `argv` fornito e riceve il conteggio effettivo degli argomenti. `argc` può facoltativamente essere ignorato passando `NULL`.
- `[out] argv`: Array C di `napi_value` in cui verranno copiati gli argomenti. Se ci sono più argomenti del conteggio fornito, viene copiato solo il numero richiesto di argomenti. Se vengono forniti meno argomenti di quelli dichiarati, il resto di `argv` viene riempito con valori `napi_value` che rappresentano `undefined`. `argv` può facoltativamente essere ignorato passando `NULL`.
- `[out] thisArg`: Riceve l'argomento JavaScript `this` per la chiamata. `thisArg` può facoltativamente essere ignorato passando `NULL`.
- `[out] data`: Riceve il puntatore ai dati per il callback. `data` può facoltativamente essere ignorato passando `NULL`.

Restituisce `napi_ok` se l'API ha avuto successo.

Questo metodo viene utilizzato all'interno di una funzione di callback per recuperare i dettagli sulla chiamata come gli argomenti e il puntatore `this` da una data informazione di callback.

### `napi_get_new_target` {#napi_get_new_target}

**Aggiunta in: v8.6.0**

**Versione N-API: 1**

```C [C]
napi_status napi_get_new_target(napi_env env,
                                napi_callback_info cbinfo,
                                napi_value* result)
```
- `[in] env`: L'ambiente in cui viene invocata l'API.
- `[in] cbinfo`: Le informazioni di callback passate alla funzione di callback.
- `[out] result`: Il `new.target` della chiamata al costruttore.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API restituisce il `new.target` della chiamata al costruttore. Se il callback corrente non è una chiamata al costruttore, il risultato è `NULL`.


### `napi_new_instance` {#napi_new_instance}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status napi_new_instance(napi_env env,
                              napi_value cons,
                              size_t argc,
                              napi_value* argv,
                              napi_value* result)
```
- `[in] env`: L'ambiente in cui viene invocata l'API.
- `[in] cons`: `napi_value` che rappresenta la funzione JavaScript da invocare come costruttore.
- `[in] argc`: Il numero di elementi nell'array `argv`.
- `[in] argv`: Array di valori JavaScript come `napi_value` che rappresenta gli argomenti del costruttore. Se `argc` è zero, questo parametro può essere omesso passando `NULL`.
- `[out] result`: `napi_value` che rappresenta l'oggetto JavaScript restituito, che in questo caso è l'oggetto costruito.

Questo metodo viene utilizzato per istanziare un nuovo valore JavaScript utilizzando un dato `napi_value` che rappresenta il costruttore per l'oggetto. Ad esempio, considera il seguente snippet:

```js [ESM]
function MyObject(param) {
  this.param = param;
}

const arg = 'hello';
const value = new MyObject(arg);
```
Quanto segue può essere approssimato in Node-API utilizzando il seguente snippet:

```C [C]
// Ottieni la funzione costruttore MyObject
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
Restituisce `napi_ok` se l'API ha avuto successo.

## Object wrap {#object-wrap}

Node-API offre un modo per "wrappare" classi e istanze C++ in modo che il costruttore e i metodi della classe possano essere chiamati da JavaScript.

Per gli oggetti wrappati, può essere difficile distinguere tra una funzione chiamata su un prototipo di classe e una funzione chiamata su un'istanza di una classe. Un modello comune utilizzato per affrontare questo problema è salvare un riferimento persistente al costruttore della classe per i successivi controlli `instanceof`.

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
  // altrimenti...
}
```
Il riferimento deve essere liberato quando non è più necessario.

Ci sono occasioni in cui `napi_instanceof()` è insufficiente per garantire che un oggetto JavaScript sia un wrapper per un determinato tipo nativo. Questo è il caso soprattutto quando gli oggetti JavaScript wrappati vengono ripassati all'addon tramite metodi statici anziché come valore `this` dei metodi prototype. In tali casi, c'è la possibilità che possano essere unwrappati in modo errato.

```js [ESM]
const myAddon = require('./build/Release/my_addon.node');

// `openDatabase()` restituisce un oggetto JavaScript che wrappa un database nativo
// handle.
const dbHandle = myAddon.openDatabase();

// `query()` restituisce un oggetto JavaScript che wrappa un query handle nativo.
const queryHandle = myAddon.query(dbHandle, 'Gimme ALL the things!');

// C'è un errore accidentale nella riga sottostante. Il primo parametro di
// `myAddon.queryHasRecords()` dovrebbe essere l'handle del database (`dbHandle`), non
// il query handle (`query`), quindi la condizione corretta per il ciclo while
// dovrebbe essere
//
// myAddon.queryHasRecords(dbHandle, queryHandle)
//
while (myAddon.queryHasRecords(queryHandle, dbHandle)) {
  // recupera i record
}
```
Nell'esempio sopra, `myAddon.queryHasRecords()` è un metodo che accetta due argomenti. Il primo è un handle del database e il secondo è un query handle. Internamente, unwrappa il primo argomento e fa il cast del puntatore risultante a un handle di database nativo. Quindi unwrappa il secondo argomento e fa il cast del puntatore risultante a un query handle. Se gli argomenti vengono passati nell'ordine sbagliato, i cast funzioneranno, tuttavia, ci sono buone probabilità che l'operazione di database sottostante fallirà, o causerà persino un accesso non valido alla memoria.

Per garantire che il puntatore recuperato dal primo argomento sia effettivamente un puntatore a un handle del database e, allo stesso modo, che il puntatore recuperato dal secondo argomento sia effettivamente un puntatore a un query handle, l'implementazione di `queryHasRecords()` deve eseguire una validazione del tipo. Conservare il costruttore della classe JavaScript da cui è stato istanziato l'handle del database e il costruttore da cui è stato istanziato il query handle in `napi_ref` può essere d'aiuto, perché `napi_instanceof()` può quindi essere utilizzato per garantire che le istanze passate a `queryHashRecords()` siano effettivamente del tipo corretto.

Sfortunatamente, `napi_instanceof()` non protegge dalla manipolazione del prototipo. Ad esempio, il prototipo dell'istanza dell'handle del database può essere impostato sul prototipo del costruttore per le istanze del query handle. In questo caso, l'istanza dell'handle del database può apparire come un'istanza del query handle e supererà il test `napi_instanceof()` per un'istanza del query handle, pur contenendo un puntatore a un handle del database.

A tal fine, Node-API fornisce funzionalità di type-tagging.

Un type tag è un numero intero a 128 bit univoco per l'addon. Node-API fornisce la struttura `napi_type_tag` per memorizzare un type tag. Quando tale valore viene passato insieme a un oggetto JavaScript o [esterno](/it/nodejs/api/n-api#napi_create_external) memorizzato in un `napi_value` a `napi_type_tag_object()`, l'oggetto JavaScript verrà "contrassegnato" con il type tag. Il "contrassegno" è invisibile sul lato JavaScript. Quando un oggetto JavaScript arriva in un binding nativo, `napi_check_object_type_tag()` può essere utilizzato insieme al type tag originale per determinare se l'oggetto JavaScript è stato precedentemente "contrassegnato" con il type tag. Questo crea una capacità di type-checking di una fedeltà superiore a quella che `napi_instanceof()` può fornire, perché tale type-tagging sopravvive alla manipolazione del prototipo e allo scaricamento/ricaricamento dell'addon.

Continuando l'esempio sopra, la seguente implementazione scheletrica dell'addon illustra l'uso di `napi_type_tag_object()` e `napi_check_object_type_tag()`.

```C [C]
// Questo valore è il type tag per un handle del database. Il comando
//
//   uuidgen | sed -r -e 's/-//g' -e 's/(.{16})(.*)/0x\1, 0x\2/'
//
// può essere utilizzato per ottenere i due valori con cui inizializzare la struttura.
static const napi_type_tag DatabaseHandleTypeTag = {
  0x1edf75a38336451d, 0xa5ed9ce2e4c00c38
};

// Questo valore è il type tag per un query handle.
static const napi_type_tag QueryHandleTypeTag = {
  0x9c73317f9fad44a3, 0x93c3920bf3b0ad6a
};

static napi_value
openDatabase(napi_env env, napi_callback_info info) {
  napi_status status;
  napi_value result;

  // Esegui l'azione sottostante che si traduce in un handle del database.
  DatabaseHandle* dbHandle = open_database();

  // Crea un nuovo oggetto JS vuoto.
  status = napi_create_object(env, &result);
  if (status != napi_ok) return NULL;

  // Tagga l'oggetto per indicare che contiene un puntatore a un `DatabaseHandle`.
  status = napi_type_tag_object(env, result, &DatabaseHandleTypeTag);
  if (status != napi_ok) return NULL;

  // Memorizza il puntatore alla struttura `DatabaseHandle` all'interno dell'oggetto JS.
  status = napi_wrap(env, result, dbHandle, NULL, NULL, NULL);
  if (status != napi_ok) return NULL;

  return result;
}

// Successivamente, quando riceviamo un oggetto JavaScript che pretende di essere un handle del database
// possiamo utilizzare `napi_check_object_type_tag()` per garantire che sia effettivamente tale
// handle.

static napi_value
query(napi_env env, napi_callback_info info) {
  napi_status status;
  size_t argc = 2;
  napi_value argv[2];
  bool is_db_handle;

  status = napi_get_cb_info(env, info, &argc, argv, NULL, NULL);
  if (status != napi_ok) return NULL;

  // Controlla che l'oggetto passato come primo parametro abbia il tag applicato in precedenza.
  status = napi_check_object_type_tag(env,
                                      argv[0],
                                      &DatabaseHandleTypeTag,
                                      &is_db_handle);
  if (status != napi_ok) return NULL;

  // Lancia un `TypeError` se non lo è.
  if (!is_db_handle) {
    // Lancia un TypeError.
    return NULL;
  }
}
```

### `napi_define_class` {#napi_define_class}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

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
- `[in] env`: L'ambiente in cui viene richiamata l'API.
- `[in] utf8name`: Nome della funzione costruttore JavaScript. Per chiarezza, si consiglia di utilizzare il nome della classe C++ quando si esegue il wrapping di una classe C++.
- `[in] length`: La lunghezza di `utf8name` in byte, o `NAPI_AUTO_LENGTH` se è terminata con null.
- `[in] constructor`: Funzione di callback che gestisce la costruzione di istanze della classe. Quando si esegue il wrapping di una classe C++, questo metodo deve essere un membro statico con la firma [`napi_callback`](/it/nodejs/api/n-api#napi_callback). Un costruttore di classe C++ non può essere utilizzato. [`napi_callback`](/it/nodejs/api/n-api#napi_callback) fornisce maggiori dettagli.
- `[in] data`: Dati opzionali da passare alla callback del costruttore come proprietà `data` delle informazioni di callback.
- `[in] property_count`: Numero di elementi nell'argomento array `properties`.
- `[in] properties`: Array di descrittori di proprietà che descrivono proprietà di dati statici e di istanza, funzioni di accesso e metodi sulla classe. Vedere `napi_property_descriptor`.
- `[out] result`: Un `napi_value` che rappresenta la funzione costruttore per la classe.

Restituisce `napi_ok` se l'API ha avuto successo.

Definisce una classe JavaScript, inclusi:

- Una funzione costruttore JavaScript che ha il nome della classe. Quando si esegue il wrapping di una classe C++ corrispondente, la callback passata tramite `constructor` può essere utilizzata per istanziare una nuova istanza di classe C++, che può quindi essere posizionata all'interno dell'istanza dell'oggetto JavaScript in fase di costruzione utilizzando [`napi_wrap`](/it/nodejs/api/n-api#napi_wrap).
- Proprietà sulla funzione costruttore la cui implementazione può chiamare le corrispondenti proprietà di dati *statici*, funzioni di accesso e metodi della classe C++ (definiti dai descrittori di proprietà con l'attributo `napi_static`).
- Proprietà sull'oggetto `prototype` della funzione costruttore. Quando si esegue il wrapping di una classe C++, le proprietà di dati, le funzioni di accesso e i metodi *non statici* della classe C++ possono essere chiamati dalle funzioni statiche fornite nei descrittori di proprietà senza l'attributo `napi_static` dopo aver recuperato l'istanza della classe C++ posizionata all'interno dell'istanza dell'oggetto JavaScript utilizzando [`napi_unwrap`](/it/nodejs/api/n-api#napi_unwrap).

Quando si esegue il wrapping di una classe C++, la callback del costruttore C++ passata tramite `constructor` dovrebbe essere un metodo statico sulla classe che chiama l'effettivo costruttore della classe, quindi esegue il wrapping della nuova istanza C++ in un oggetto JavaScript e restituisce l'oggetto wrapper. Vedere [`napi_wrap`](/it/nodejs/api/n-api#napi_wrap) per i dettagli.

La funzione costruttore JavaScript restituita da [`napi_define_class`](/it/nodejs/api/n-api#napi_define_class) viene spesso salvata e utilizzata in seguito per costruire nuove istanze della classe dal codice nativo e/o per verificare se i valori forniti sono istanze della classe. In tal caso, per impedire che il valore della funzione venga raccolto dalla garbage collection, è possibile creare un riferimento persistente forte ad essa utilizzando [`napi_create_reference`](/it/nodejs/api/n-api#napi_create_reference), garantendo che il conteggio dei riferimenti sia mantenuto \>= 1.

Qualsiasi dato non `NULL` che viene passato a questa API tramite il parametro `data` o tramite il campo `data` degli elementi dell'array `napi_property_descriptor` può essere associato al costruttore JavaScript risultante (che viene restituito nel parametro `result`) e liberato ogni volta che la classe viene raccolta dalla garbage collection passando sia la funzione JavaScript che i dati a [`napi_add_finalizer`](/it/nodejs/api/n-api#napi_add_finalizer).


### `napi_wrap` {#napi_wrap}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status napi_wrap(napi_env env,
                      napi_value js_object,
                      void* native_object,
                      napi_finalize finalize_cb,
                      void* finalize_hint,
                      napi_ref* result);
```
- `[in] env`: L'ambiente in cui viene richiamata l'API.
- `[in] js_object`: L'oggetto JavaScript che sarà il wrapper per l'oggetto nativo.
- `[in] native_object`: L'istanza nativa che sarà avvolta nell'oggetto JavaScript.
- `[in] finalize_cb`: Callback nativa facoltativa che può essere utilizzata per liberare l'istanza nativa quando l'oggetto JavaScript è stato sottoposto a garbage collection. [`napi_finalize`](/it/nodejs/api/n-api#napi_finalize) fornisce maggiori dettagli.
- `[in] finalize_hint`: Suggerimento contestuale facoltativo che viene passato alla callback di finalizzazione.
- `[out] result`: Riferimento facoltativo all'oggetto avvolto.

Restituisce `napi_ok` se l'API ha avuto successo.

Avvolge un'istanza nativa in un oggetto JavaScript. L'istanza nativa può essere recuperata successivamente utilizzando `napi_unwrap()`.

Quando il codice JavaScript richiama un costruttore per una classe definita utilizzando `napi_define_class()`, viene richiamata la `napi_callback` per il costruttore. Dopo aver costruito un'istanza della classe nativa, la callback deve quindi chiamare `napi_wrap()` per avvolgere l'istanza appena costruita nell'oggetto JavaScript già creato che è l'argomento `this` alla callback del costruttore. (Quell'oggetto `this` è stato creato dal `prototype` della funzione costruttore, quindi ha già le definizioni di tutte le proprietà e i metodi dell'istanza.)

In genere, quando si avvolge un'istanza di classe, è necessario fornire una callback di finalizzazione che elimini semplicemente l'istanza nativa che viene ricevuta come argomento `data` alla callback di finalizzazione.

Il riferimento restituito facoltativo è inizialmente un riferimento debole, il che significa che ha un conteggio di riferimento pari a 0. In genere, questo conteggio di riferimento verrebbe incrementato temporaneamente durante le operazioni asincrone che richiedono che l'istanza rimanga valida.

*Attenzione*: Il riferimento restituito facoltativo (se ottenuto) deve essere eliminato tramite [`napi_delete_reference`](/it/nodejs/api/n-api#napi_delete_reference) SOLO in risposta alla chiamata della callback di finalizzazione. Se viene eliminato prima, la callback di finalizzazione potrebbe non essere mai richiamata. Pertanto, quando si ottiene un riferimento, è necessaria anche una callback di finalizzazione per consentire la corretta eliminazione del riferimento.

Le callback del finalizzatore possono essere differite, lasciando una finestra in cui l'oggetto è stato sottoposto a garbage collection (e il riferimento debole non è valido) ma il finalizzatore non è stato ancora chiamato. Quando si utilizza `napi_get_reference_value()` su riferimenti deboli restituiti da `napi_wrap()`, è comunque necessario gestire un risultato vuoto.

Chiamare `napi_wrap()` una seconda volta su un oggetto restituirà un errore. Per associare un'altra istanza nativa all'oggetto, utilizzare prima `napi_remove_wrap()`.


### `napi_unwrap` {#napi_unwrap}

**Aggiunta in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status napi_unwrap(napi_env env,
                        napi_value js_object,
                        void** result);
```
- `[in] env`: L'ambiente in cui viene invocata l'API.
- `[in] js_object`: L'oggetto associato all'istanza nativa.
- `[out] result`: Puntatore all'istanza nativa wrappata.

Restituisce `napi_ok` se l'API ha avuto successo.

Recupera un'istanza nativa che è stata precedentemente wrappata in un oggetto JavaScript utilizzando `napi_wrap()`.

Quando il codice JavaScript richiama un metodo o un accessor di proprietà sulla classe, viene richiamato il corrispondente `napi_callback`. Se il callback è per un metodo o un accessor di istanza, allora l'argomento `this` del callback è l'oggetto wrapper; l'istanza C++ wrappata che è l'obiettivo della chiamata può essere ottenuta chiamando `napi_unwrap()` sull'oggetto wrapper.

### `napi_remove_wrap` {#napi_remove_wrap}

**Aggiunta in: v8.5.0**

**Versione N-API: 1**

```C [C]
napi_status napi_remove_wrap(napi_env env,
                             napi_value js_object,
                             void** result);
```
- `[in] env`: L'ambiente in cui viene invocata l'API.
- `[in] js_object`: L'oggetto associato all'istanza nativa.
- `[out] result`: Puntatore all'istanza nativa wrappata.

Restituisce `napi_ok` se l'API ha avuto successo.

Recupera un'istanza nativa che è stata precedentemente wrappata nell'oggetto JavaScript `js_object` utilizzando `napi_wrap()` e rimuove il wrapping. Se un callback di finalizzazione era associato al wrapping, non verrà più chiamato quando l'oggetto JavaScript viene sottoposto a garbage collection.

### `napi_type_tag_object` {#napi_type_tag_object}

**Aggiunta in: v14.8.0, v12.19.0**

**Versione N-API: 8**

```C [C]
napi_status napi_type_tag_object(napi_env env,
                                 napi_value js_object,
                                 const napi_type_tag* type_tag);
```
- `[in] env`: L'ambiente in cui viene invocata l'API.
- `[in] js_object`: L'oggetto JavaScript o [external](/it/nodejs/api/n-api#napi_create_external) da marcare.
- `[in] type_tag`: Il tag con cui l'oggetto deve essere marcato.

Restituisce `napi_ok` se l'API ha avuto successo.

Associa il valore del puntatore `type_tag` all'oggetto JavaScript o [external](/it/nodejs/api/n-api#napi_create_external). `napi_check_object_type_tag()` può quindi essere utilizzato per confrontare il tag che è stato allegato all'oggetto con uno di proprietà dell'addon per garantire che l'oggetto abbia il tipo corretto.

Se l'oggetto ha già un tag di tipo associato, questa API restituirà `napi_invalid_arg`.


### `napi_check_object_type_tag` {#napi_check_object_type_tag}

**Aggiunto in: v14.8.0, v12.19.0**

**Versione N-API: 8**

```C [C]
napi_status napi_check_object_type_tag(napi_env env,
                                       napi_value js_object,
                                       const napi_type_tag* type_tag,
                                       bool* result);
```
- `[in] env`: L'ambiente in cui viene invocata l'API.
- `[in] js_object`: L'oggetto JavaScript o [external](/it/nodejs/api/n-api#napi_create_external) di cui esaminare il type tag.
- `[in] type_tag`: Il tag con cui confrontare qualsiasi tag trovato sull'oggetto.
- `[out] result`: Indica se il type tag fornito corrisponde al type tag sull'oggetto. Viene restituito `false` anche se non è stato trovato alcun type tag sull'oggetto.

Restituisce `napi_ok` se l'API ha avuto successo.

Confronta il puntatore fornito come `type_tag` con qualsiasi puntatore che può essere trovato su `js_object`. Se non viene trovato alcun tag su `js_object` o, se viene trovato un tag ma non corrisponde a `type_tag`, allora `result` viene impostato su `false`. Se viene trovato un tag e corrisponde a `type_tag`, allora `result` viene impostato su `true`.

### `napi_add_finalizer` {#napi_add_finalizer}

**Aggiunto in: v8.0.0**

**Versione N-API: 5**

```C [C]
napi_status napi_add_finalizer(napi_env env,
                               napi_value js_object,
                               void* finalize_data,
                               node_api_basic_finalize finalize_cb,
                               void* finalize_hint,
                               napi_ref* result);
```
- `[in] env`: L'ambiente in cui viene invocata l'API.
- `[in] js_object`: L'oggetto JavaScript a cui verranno allegati i dati nativi.
- `[in] finalize_data`: Dati opzionali da passare a `finalize_cb`.
- `[in] finalize_cb`: Callback nativa che verrà utilizzata per liberare i dati nativi quando l'oggetto JavaScript è stato sottoposto a garbage collection. [`napi_finalize`](/it/nodejs/api/n-api#napi_finalize) fornisce maggiori dettagli.
- `[in] finalize_hint`: Hint contestuale opzionale che viene passato alla callback di finalizzazione.
- `[out] result`: Riferimento opzionale all'oggetto JavaScript.

Restituisce `napi_ok` se l'API ha avuto successo.

Aggiunge una callback `napi_finalize` che verrà chiamata quando l'oggetto JavaScript in `js_object` è stato sottoposto a garbage collection.

Questa API può essere chiamata più volte su un singolo oggetto JavaScript.

*Attenzione*: Il riferimento opzionale restituito (se ottenuto) dovrebbe essere eliminato tramite [`napi_delete_reference`](/it/nodejs/api/n-api#napi_delete_reference) SOLO in risposta all'invocazione della callback di finalizzazione. Se viene eliminato prima, la callback di finalizzazione potrebbe non essere mai invocata. Pertanto, quando si ottiene un riferimento, è necessaria anche una callback di finalizzazione per consentire la corretta eliminazione del riferimento.


#### `node_api_post_finalizer` {#node_api_post_finalizer}

**Aggiunta in: v21.0.0, v20.10.0, v18.19.0**

::: warning [Stable: 1 - Sperimentale]
[Stable: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

```C [C]
napi_status node_api_post_finalizer(node_api_basic_env env,
                                    napi_finalize finalize_cb,
                                    void* finalize_data,
                                    void* finalize_hint);
```
- `[in] env`: L'ambiente in cui viene invocata l'API.
- `[in] finalize_cb`: Callback nativa che verrà utilizzata per liberare i dati nativi quando l'oggetto JavaScript è stato sottoposto a garbage collection. [`napi_finalize`](/it/nodejs/api/n-api#napi_finalize) fornisce maggiori dettagli.
- `[in] finalize_data`: Dati opzionali da passare a `finalize_cb`.
- `[in] finalize_hint`: Suggerimento contestuale opzionale che viene passato alla callback di finalizzazione.

Restituisce `napi_ok` se l'API ha avuto successo.

Pianifica una callback `napi_finalize` da chiamare in modo asincrono nell'event loop.

Normalmente, i finalizzatori vengono chiamati mentre il GC (garbage collector) raccoglie gli oggetti. A quel punto, chiamare qualsiasi Node-API che possa causare modifiche nello stato del GC sarà disabilitato e Node.js si arresterà in modo anomalo.

`node_api_post_finalizer` aiuta a aggirare questa limitazione consentendo all'addon di rimandare le chiamate a tali Node-API a un momento al di fuori della finalizzazione del GC.

## Semplici operazioni asincrone {#simple-asynchronous-operations}

I moduli addon spesso devono sfruttare gli helper asincroni da libuv come parte della loro implementazione. Ciò consente loro di pianificare il lavoro da eseguire in modo asincrono in modo che i loro metodi possano tornare prima che il lavoro sia completato. Ciò consente loro di evitare di bloccare l'esecuzione complessiva dell'applicazione Node.js.

Node-API fornisce un'interfaccia ABI-stabile per queste funzioni di supporto che copre i casi d'uso asincroni più comuni.

Node-API definisce la struttura `napi_async_work` che viene utilizzata per gestire i worker asincroni. Le istanze vengono create/eliminate con [`napi_create_async_work`](/it/nodejs/api/n-api#napi_create_async_work) e [`napi_delete_async_work`](/it/nodejs/api/n-api#napi_delete_async_work).

Le callback `execute` e `complete` sono funzioni che verranno invocate quando l'executor è pronto per l'esecuzione e quando completa rispettivamente la sua attività.

La funzione `execute` dovrebbe evitare di effettuare chiamate Node-API che potrebbero comportare l'esecuzione di JavaScript o l'interazione con oggetti JavaScript. Molto spesso, qualsiasi codice che deve effettuare chiamate Node-API dovrebbe essere eseguito nella callback `complete`. Evitare di utilizzare il parametro `napi_env` nella callback di esecuzione poiché probabilmente eseguirà JavaScript.

Queste funzioni implementano le seguenti interfacce:

```C [C]
typedef void (*napi_async_execute_callback)(napi_env env,
                                            void* data);
typedef void (*napi_async_complete_callback)(napi_env env,
                                             napi_status status,
                                             void* data);
```
Quando questi metodi vengono invocati, il parametro `data` passato sarà il dato `void*` fornito dall'addon che è stato passato nella chiamata `napi_create_async_work`.

Una volta creato, il worker asincrono può essere accodato per l'esecuzione utilizzando la funzione [`napi_queue_async_work`](/it/nodejs/api/n-api#napi_queue_async_work):

```C [C]
napi_status napi_queue_async_work(node_api_basic_env env,
                                  napi_async_work work);
```
[`napi_cancel_async_work`](/it/nodejs/api/n-api#napi_cancel_async_work) può essere utilizzato se il lavoro deve essere annullato prima che l'esecuzione del lavoro sia iniziata.

Dopo aver chiamato [`napi_cancel_async_work`](/it/nodejs/api/n-api#napi_cancel_async_work), la callback `complete` verrà invocata con un valore di stato `napi_cancelled`. Il lavoro non deve essere eliminato prima dell'invocazione della callback `complete`, anche quando è stato annullato.


### `napi_create_async_work` {#napi_create_async_work}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v8.6.0 | Aggiunti i parametri `async_resource` e `async_resource_name`. |
| v8.0.0 | Aggiunto in: v8.0.0 |
:::

**Versione N-API: 1**

```C [C]
napi_status napi_create_async_work(napi_env env,
                                   napi_value async_resource,
                                   napi_value async_resource_name,
                                   napi_async_execute_callback execute,
                                   napi_async_complete_callback complete,
                                   void* data,
                                   napi_async_work* result);
```
- `[in] env`: L'ambiente in cui viene invocata l'API.
- `[in] async_resource`: Un oggetto opzionale associato al lavoro asincrono che verrà passato ai possibili hook [`init` di `async_hooks`](/it/nodejs/api/async_hooks#initasyncid-type-triggerasyncid-resource).
- `[in] async_resource_name`: Identificatore per il tipo di risorsa che viene fornita per le informazioni diagnostiche esposte dall'API `async_hooks`.
- `[in] execute`: La funzione nativa che deve essere chiamata per eseguire la logica in modo asincrono. La funzione indicata viene chiamata da un thread del pool di worker e può essere eseguita in parallelo con il thread del loop di eventi principale.
- `[in] complete`: La funzione nativa che verrà chiamata quando la logica asincrona è completata o annullata. La funzione indicata viene chiamata dal thread del loop di eventi principale. [`napi_async_complete_callback`](/it/nodejs/api/n-api#napi_async_complete_callback) fornisce maggiori dettagli.
- `[in] data`: Contesto dati fornito dall'utente. Questo verrà passato nuovamente alle funzioni execute e complete.
- `[out] result`: `napi_async_work*` che è l'handle per il lavoro asincrono appena creato.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API alloca un oggetto work che viene utilizzato per eseguire la logica in modo asincrono. Dovrebbe essere liberato utilizzando [`napi_delete_async_work`](/it/nodejs/api/n-api#napi_delete_async_work) una volta che il lavoro non è più necessario.

`async_resource_name` deve essere una stringa con terminazione null e codificata in UTF-8.

L'identificatore `async_resource_name` è fornito dall'utente e dovrebbe essere rappresentativo del tipo di lavoro asincrono eseguito. Si raccomanda inoltre di applicare il namespacing all'identificatore, ad esempio includendo il nome del modulo. Consultare la [`documentazione di async_hooks`](/it/nodejs/api/async_hooks#type) per ulteriori informazioni.


### `napi_delete_async_work` {#napi_delete_async_work}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status napi_delete_async_work(napi_env env,
                                   napi_async_work work);
```
- `[in] env`: L'ambiente in cui viene invocata l'API.
- `[in] work`: L'handle restituito dalla chiamata a `napi_create_async_work`.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API libera un oggetto work precedentemente allocato.

Questa API può essere chiamata anche se è presente un'eccezione JavaScript in sospeso.

### `napi_queue_async_work` {#napi_queue_async_work}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status napi_queue_async_work(node_api_basic_env env,
                                  napi_async_work work);
```
- `[in] env`: L'ambiente in cui viene invocata l'API.
- `[in] work`: L'handle restituito dalla chiamata a `napi_create_async_work`.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API richiede che il work precedentemente allocato sia programmato per l'esecuzione. Una volta restituito correttamente, questa API non deve essere richiamata di nuovo con lo stesso elemento `napi_async_work` o il risultato sarà indefinito.

### `napi_cancel_async_work` {#napi_cancel_async_work}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status napi_cancel_async_work(node_api_basic_env env,
                                   napi_async_work work);
```
- `[in] env`: L'ambiente in cui viene invocata l'API.
- `[in] work`: L'handle restituito dalla chiamata a `napi_create_async_work`.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API annulla il work in coda se non è ancora stato avviato. Se ha già iniziato l'esecuzione, non può essere annullato e verrà restituito `napi_generic_failure`. In caso di successo, la callback `complete` verrà invocata con un valore di stato di `napi_cancelled`. Il work non deve essere eliminato prima dell'invocazione della callback `complete`, anche se è stato annullato correttamente.

Questa API può essere chiamata anche se è presente un'eccezione JavaScript in sospeso.

## Operazioni asincrone personalizzate {#custom-asynchronous-operations}

Le semplici API di work asincrono sopra riportate potrebbero non essere appropriate per ogni scenario. Quando si utilizza qualsiasi altro meccanismo asincrono, le seguenti API sono necessarie per garantire che un'operazione asincrona venga correttamente monitorata dal runtime.


### `napi_async_init` {#napi_async_init}

**Aggiunto in: v8.6.0**

**Versione N-API: 1**

```C [C]
napi_status napi_async_init(napi_env env,
                            napi_value async_resource,
                            napi_value async_resource_name,
                            napi_async_context* result)
```
- `[in] env`: L'ambiente in cui viene invocata l'API.
- `[in] async_resource`: Oggetto associato al lavoro asincrono che verrà passato ai possibili hook `async_hooks` [`init`](/it/nodejs/api/async_hooks#initasyncid-type-triggerasyncid-resource) e a cui è possibile accedere tramite [`async_hooks.executionAsyncResource()`](/it/nodejs/api/async_hooks#async_hooksexecutionasyncresource).
- `[in] async_resource_name`: Identificatore per il tipo di risorsa che viene fornita per le informazioni diagnostiche esposte dall'API `async_hooks`.
- `[out] result`: Il contesto asincrono inizializzato.

Restituisce `napi_ok` se l'API ha avuto successo.

L'oggetto `async_resource` deve essere mantenuto attivo fino a [`napi_async_destroy`](/it/nodejs/api/n-api#napi_async_destroy) per fare in modo che l'API relativa a `async_hooks` agisca correttamente. Al fine di mantenere la compatibilità ABI con le versioni precedenti, i `napi_async_context` non mantengono il riferimento forte agli oggetti `async_resource` per evitare di introdurre perdite di memoria. Tuttavia, se `async_resource` viene raccolto dal garbage collector del motore JavaScript prima che `napi_async_context` venga distrutto da `napi_async_destroy`, la chiamata alle API relative a `napi_async_context` come [`napi_open_callback_scope`](/it/nodejs/api/n-api#napi_open_callback_scope) e [`napi_make_callback`](/it/nodejs/api/n-api#napi_make_callback) può causare problemi come la perdita di contesto asincrono quando si utilizza l'API `AsyncLocalStorage`.

Al fine di mantenere la compatibilità ABI con le versioni precedenti, il passaggio di `NULL` per `async_resource` non comporta un errore. Tuttavia, questo non è raccomandato in quanto ciò comporterà un comportamento indesiderabile con gli hook `async_hooks` [`init`](/it/nodejs/api/async_hooks#initasyncid-type-triggerasyncid-resource) e `async_hooks.executionAsyncResource()` poiché la risorsa è ora richiesta dall'implementazione `async_hooks` sottostante al fine di fornire il collegamento tra i callback asincroni.


### `napi_async_destroy` {#napi_async_destroy}

**Aggiunto in: v8.6.0**

**Versione N-API: 1**

```C [C]
napi_status napi_async_destroy(napi_env env,
                               napi_async_context async_context);
```
- `[in] env`: L'ambiente in cui viene richiamata l'API.
- `[in] async_context`: Il contesto asincrono da distruggere.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API può essere chiamata anche se è presente un'eccezione JavaScript in sospeso.

### `napi_make_callback` {#napi_make_callback}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v8.6.0 | Aggiunto il parametro `async_context`. |
| v8.0.0 | Aggiunto in: v8.0.0 |
:::

**Versione N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_make_callback(napi_env env,
                                           napi_async_context async_context,
                                           napi_value recv,
                                           napi_value func,
                                           size_t argc,
                                           const napi_value* argv,
                                           napi_value* result);
```
- `[in] env`: L'ambiente in cui viene richiamata l'API.
- `[in] async_context`: Contesto per l'operazione asincrona che sta richiamando la callback. Questo dovrebbe normalmente essere un valore precedentemente ottenuto da [`napi_async_init`](/it/nodejs/api/n-api#napi_async_init). Al fine di mantenere la compatibilità ABI con le versioni precedenti, passare `NULL` per `async_context` non comporta un errore. Tuttavia, ciò comporta un funzionamento errato degli hook asincroni. I potenziali problemi includono la perdita del contesto asincrono quando si utilizza l'API `AsyncLocalStorage`.
- `[in] recv`: Il valore `this` passato alla funzione chiamata.
- `[in] func`: `napi_value` che rappresenta la funzione JavaScript da richiamare.
- `[in] argc`: Il conteggio degli elementi nell'array `argv`.
- `[in] argv`: Array di valori JavaScript come `napi_value` che rappresentano gli argomenti della funzione. Se `argc` è zero, questo parametro può essere omesso passando `NULL`.
- `[out] result`: `napi_value` che rappresenta l'oggetto JavaScript restituito.

Restituisce `napi_ok` se l'API ha avuto successo.

Questo metodo consente di chiamare un oggetto funzione JavaScript da un componente aggiuntivo nativo. Questa API è simile a `napi_call_function`. Tuttavia, viene utilizzata per chiamare *dal* codice nativo *al* codice JavaScript *dopo* essere tornati da un'operazione asincrona (quando non c'è altro script nello stack). È un wrapper abbastanza semplice attorno a `node::MakeCallback`.

Si noti che *non* è necessario utilizzare `napi_make_callback` all'interno di una `napi_async_complete_callback`; in quella situazione il contesto asincrono della callback è già stato impostato, quindi una chiamata diretta a `napi_call_function` è sufficiente e appropriata. L'uso della funzione `napi_make_callback` può essere richiesto quando si implementa un comportamento asincrono personalizzato che non utilizza `napi_create_async_work`.

Qualsiasi `process.nextTick` o Promise pianificate nella coda dei microtask da JavaScript durante la callback vengono eseguite prima di tornare a C/C++.


### `napi_open_callback_scope` {#napi_open_callback_scope}

**Aggiunto in: v9.6.0**

**Versione N-API: 3**

```C [C]
NAPI_EXTERN napi_status napi_open_callback_scope(napi_env env,
                                                 napi_value resource_object,
                                                 napi_async_context context,
                                                 napi_callback_scope* result)
```
- `[in] env`: L'ambiente in cui viene invocata l'API.
- `[in] resource_object`: Un oggetto associato al lavoro asincrono che verrà passato a possibili hook `async_hooks` [`init` hook](/it/nodejs/api/async_hooks#initasyncid-type-triggerasyncid-resource). Questo parametro è stato deprecato e viene ignorato in fase di runtime. Utilizzare il parametro `async_resource` in [`napi_async_init`](/it/nodejs/api/n-api#napi_async_init) invece.
- `[in] context`: Contesto per l'operazione asincrona che sta invocando il callback. Questo dovrebbe essere un valore precedentemente ottenuto da [`napi_async_init`](/it/nodejs/api/n-api#napi_async_init).
- `[out] result`: Il nuovo scope creato.

Ci sono casi (ad esempio, la risoluzione delle promise) in cui è necessario avere l'equivalente dello scope associato a un callback quando si effettuano determinate chiamate Node-API. Se non c'è altro script nello stack le funzioni [`napi_open_callback_scope`](/it/nodejs/api/n-api#napi_open_callback_scope) e [`napi_close_callback_scope`](/it/nodejs/api/n-api#napi_close_callback_scope) possono essere utilizzate per aprire/chiudere lo scope richiesto.

### `napi_close_callback_scope` {#napi_close_callback_scope}

**Aggiunto in: v9.6.0**

**Versione N-API: 3**

```C [C]
NAPI_EXTERN napi_status napi_close_callback_scope(napi_env env,
                                                  napi_callback_scope scope)
```
- `[in] env`: L'ambiente in cui viene invocata l'API.
- `[in] scope`: Lo scope da chiudere.

Questa API può essere chiamata anche se è presente un'eccezione JavaScript in sospeso.

## Gestione delle versioni {#version-management}

### `napi_get_node_version` {#napi_get_node_version}

**Aggiunto in: v8.4.0**

**Versione N-API: 1**

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
- `[in] env`: L'ambiente in cui viene invocata l'API.
- `[out] version`: Un puntatore alle informazioni sulla versione per Node.js stesso.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa funzione riempie la struct `version` con la versione major, minor e patch di Node.js attualmente in esecuzione, e il campo `release` con il valore di [`process.release.name`](/it/nodejs/api/process#processrelease).

Il buffer restituito è allocato staticamente e non necessita di essere liberato.


### `napi_get_version` {#napi_get_version}

**Aggiunto in: v8.0.0**

**Versione N-API: 1**

```C [C]
napi_status napi_get_version(node_api_basic_env env,
                             uint32_t* result);
```
- `[in] env`: L'ambiente in cui viene invocata l'API.
- `[out] result`: La versione più alta di Node-API supportata.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API restituisce la versione più alta di Node-API supportata dal runtime di Node.js. Node-API è pianificato per essere additivo, in modo che le versioni più recenti di Node.js possano supportare funzioni API aggiuntive. Per consentire a un addon di utilizzare una funzione più recente quando viene eseguito con versioni di Node.js che la supportano, fornendo al contempo un comportamento di fallback quando viene eseguito con versioni di Node.js che non la supportano:

- Chiama `napi_get_version()` per determinare se l'API è disponibile.
- Se disponibile, carica dinamicamente un puntatore alla funzione utilizzando `uv_dlsym()`.
- Utilizza il puntatore caricato dinamicamente per invocare la funzione.
- Se la funzione non è disponibile, fornisci un'implementazione alternativa che non utilizzi la funzione.

## Gestione della memoria {#memory-management}

### `napi_adjust_external_memory` {#napi_adjust_external_memory}

**Aggiunto in: v8.5.0**

**Versione N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_adjust_external_memory(node_api_basic_env env,
                                                    int64_t change_in_bytes,
                                                    int64_t* result);
```
- `[in] env`: L'ambiente in cui viene invocata l'API.
- `[in] change_in_bytes`: La modifica nella memoria allocata esternamente che viene mantenuta attiva dagli oggetti JavaScript.
- `[out] result`: Il valore modificato

Restituisce `napi_ok` se l'API ha avuto successo.

Questa funzione fornisce a V8 un'indicazione della quantità di memoria allocata esternamente che viene mantenuta attiva dagli oggetti JavaScript (ad esempio un oggetto JavaScript che punta alla propria memoria allocata da un addon nativo). La registrazione della memoria allocata esternamente attiverà garbage collection globali più spesso di quanto farebbe altrimenti.

## Promise {#promises}

Node-API fornisce strumenti per la creazione di oggetti `Promise` come descritto nella [Sezione 25.4](https://tc39.github.io/ecma262/#sec-promise-objects) della specifica ECMA. Implementa le promise come una coppia di oggetti. Quando una promise viene creata da `napi_create_promise()`, viene creato un oggetto "deferred" e restituito insieme alla `Promise`. L'oggetto deferred è legato alla `Promise` creata ed è l'unico mezzo per risolvere o rifiutare la `Promise` utilizzando `napi_resolve_deferred()` o `napi_reject_deferred()`. L'oggetto deferred creato da `napi_create_promise()` viene liberato da `napi_resolve_deferred()` o `napi_reject_deferred()`. L'oggetto `Promise` può essere restituito a JavaScript dove può essere utilizzato nel solito modo.

Ad esempio, per creare una promise e passarla a un worker asincrono:

```C [C]
napi_deferred deferred;
napi_value promise;
napi_status status;

// Crea la promise.
status = napi_create_promise(env, &deferred, &promise);
if (status != napi_ok) return NULL;

// Passa il deferred a una funzione che esegue un'azione asincrona.
do_something_asynchronous(deferred);

// Restituisce la promise a JS
return promise;
```
La funzione di cui sopra `do_something_asynchronous()` eseguirà la sua azione asincrona e quindi risolverà o rifiuterà il deferred, concludendo così la promise e liberando il deferred:

```C [C]
napi_deferred deferred;
napi_value undefined;
napi_status status;

// Crea un valore con cui concludere il deferred.
status = napi_get_undefined(env, &undefined);
if (status != napi_ok) return NULL;

// Risolvi o rifiuta la promise associata al deferred a seconda che
// l'azione asincrona abbia avuto successo.
if (asynchronous_action_succeeded) {
  status = napi_resolve_deferred(env, deferred, undefined);
} else {
  status = napi_reject_deferred(env, deferred, undefined);
}
if (status != napi_ok) return NULL;

// A questo punto il deferred è stato liberato, quindi dovremmo assegnare NULL ad esso.
deferred = NULL;
```

### `napi_create_promise` {#napi_create_promise}

**Aggiunto in: v8.5.0**

**Versione N-API: 1**

```C [C]
napi_status napi_create_promise(napi_env env,
                                napi_deferred* deferred,
                                napi_value* promise);
```
- `[in] env`: L'ambiente in cui viene invocata l'API.
- `[out] deferred`: Un oggetto deferred appena creato che può essere successivamente passato a `napi_resolve_deferred()` o `napi_reject_deferred()` per risolvere risp. rifiutare la promise associata.
- `[out] promise`: La promise JavaScript associata all'oggetto deferred.

Restituisce `napi_ok` se l'API ha avuto successo.

Questa API crea un oggetto deferred e una promise JavaScript.

### `napi_resolve_deferred` {#napi_resolve_deferred}

**Aggiunto in: v8.5.0**

**Versione N-API: 1**

```C [C]
napi_status napi_resolve_deferred(napi_env env,
                                  napi_deferred deferred,
                                  napi_value resolution);
```
- `[in] env`: L'ambiente in cui viene invocata l'API.
- `[in] deferred`: L'oggetto deferred la cui promise associata deve essere risolta.
- `[in] resolution`: Il valore con cui risolvere la promise.

Questa API risolve una promise JavaScript tramite l'oggetto deferred a cui è associata. Pertanto, può essere utilizzata solo per risolvere le promise JavaScript per le quali è disponibile l'oggetto deferred corrispondente. Ciò significa effettivamente che la promise deve essere stata creata utilizzando `napi_create_promise()` e l'oggetto deferred restituito da quella chiamata deve essere stato conservato per essere passato a questa API.

L'oggetto deferred viene liberato al completamento con successo.

### `napi_reject_deferred` {#napi_reject_deferred}

**Aggiunto in: v8.5.0**

**Versione N-API: 1**

```C [C]
napi_status napi_reject_deferred(napi_env env,
                                 napi_deferred deferred,
                                 napi_value rejection);
```
- `[in] env`: L'ambiente in cui viene invocata l'API.
- `[in] deferred`: L'oggetto deferred la cui promise associata deve essere risolta.
- `[in] rejection`: Il valore con cui rifiutare la promise.

Questa API rifiuta una promise JavaScript tramite l'oggetto deferred a cui è associata. Pertanto, può essere utilizzata solo per rifiutare le promise JavaScript per le quali è disponibile l'oggetto deferred corrispondente. Ciò significa effettivamente che la promise deve essere stata creata utilizzando `napi_create_promise()` e l'oggetto deferred restituito da quella chiamata deve essere stato conservato per essere passato a questa API.

L'oggetto deferred viene liberato al completamento con successo.


### `napi_is_promise` {#napi_is_promise}

**Aggiunto in: v8.5.0**

**Versione N-API: 1**

```C [C]
napi_status napi_is_promise(napi_env env,
                            napi_value value,
                            bool* is_promise);
```
- `[in] env`: L'ambiente in cui viene invocata l'API.
- `[in] value`: Il valore da esaminare.
- `[out] is_promise`: Flag che indica se `promise` è un oggetto promise nativo (ovvero, un oggetto promise creato dal motore sottostante).

## Esecuzione di script {#script-execution}

Node-API fornisce un'API per eseguire una stringa contenente JavaScript utilizzando il motore JavaScript sottostante.

### `napi_run_script` {#napi_run_script}

**Aggiunto in: v8.5.0**

**Versione N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_run_script(napi_env env,
                                        napi_value script,
                                        napi_value* result);
```
- `[in] env`: L'ambiente in cui viene invocata l'API.
- `[in] script`: Una stringa JavaScript contenente lo script da eseguire.
- `[out] result`: Il valore risultante dall'esecuzione dello script.

Questa funzione esegue una stringa di codice JavaScript e ne restituisce il risultato con le seguenti avvertenze:

- A differenza di `eval`, questa funzione non consente allo script di accedere all'ambito lessicale corrente, e quindi non consente nemmeno di accedere allo [scope del modulo](/it/nodejs/api/modules#the-module-scope), il che significa che pseudo-globali come `require` non saranno disponibili.
- Lo script può accedere allo [scope globale](/it/nodejs/api/globals). Le dichiarazioni di funzione e `var` nello script verranno aggiunte all'oggetto [`global`](/it/nodejs/api/globals#global). Le dichiarazioni di variabili fatte usando `let` e `const` saranno visibili globalmente, ma non verranno aggiunte all'oggetto [`global`](/it/nodejs/api/globals#global).
- Il valore di `this` è [`global`](/it/nodejs/api/globals#global) all'interno dello script.

## Event loop libuv {#libuv-event-loop}

Node-API fornisce una funzione per ottenere l'event loop corrente associato a un determinato `napi_env`.

### `napi_get_uv_event_loop` {#napi_get_uv_event_loop}

**Aggiunto in: v9.3.0, v8.10.0**

**Versione N-API: 2**

```C [C]
NAPI_EXTERN napi_status napi_get_uv_event_loop(node_api_basic_env env,
                                               struct uv_loop_s** loop);
```
- `[in] env`: L'ambiente in cui viene invocata l'API.
- `[out] loop`: L'istanza corrente del loop libuv.

Nota: Sebbene libuv sia stato relativamente stabile nel tempo, non fornisce una garanzia di stabilità ABI. L'uso di questa funzione dovrebbe essere evitato. Il suo uso può comportare un addon che non funziona tra le versioni di Node.js. Le [chiamate di funzione asincrone thread-safe](/it/nodejs/api/n-api#asynchronous-thread-safe-function-calls) sono un'alternativa per molti casi d'uso.


## Chiamate di funzione asincrone thread-safe {#asynchronous-thread-safe-function-calls}

Le funzioni JavaScript normalmente possono essere chiamate solo dal thread principale di un addon nativo. Se un addon crea thread aggiuntivi, le funzioni Node-API che richiedono un `napi_env`, `napi_value` o `napi_ref` non devono essere chiamate da tali thread.

Quando un addon ha thread aggiuntivi e le funzioni JavaScript devono essere invocate in base all'elaborazione completata da tali thread, questi thread devono comunicare con il thread principale dell'addon in modo che il thread principale possa invocare la funzione JavaScript per loro conto. Le API delle funzioni thread-safe forniscono un modo semplice per farlo.

Queste API forniscono il tipo `napi_threadsafe_function` così come le API per creare, distruggere e chiamare oggetti di questo tipo. `napi_create_threadsafe_function()` crea un riferimento persistente a un `napi_value` che contiene una funzione JavaScript che può essere chiamata da più thread. Le chiamate avvengono in modo asincrono. Ciò significa che i valori con cui richiamare la callback JavaScript verranno inseriti in una coda e, per ogni valore nella coda, verrà alla fine effettuata una chiamata alla funzione JavaScript.

Al momento della creazione di una `napi_threadsafe_function` è possibile fornire una callback `napi_finalize`. Questa callback verrà invocata sul thread principale quando la funzione thread-safe sta per essere distrutta. Riceve il contesto e i dati di finalizzazione forniti durante la costruzione e offre l'opportunità di eseguire la pulizia dopo i thread, ad esempio chiamando `uv_thread_join()`. **Oltre al thread del ciclo principale, nessun thread dovrebbe utilizzare la funzione thread-safe dopo che la callback di finalizzazione è stata completata.**

Il `context` fornito durante la chiamata a `napi_create_threadsafe_function()` può essere recuperato da qualsiasi thread con una chiamata a `napi_get_threadsafe_function_context()`.

### Chiamare una funzione thread-safe {#calling-a-thread-safe-function}

`napi_call_threadsafe_function()` può essere utilizzato per avviare una chiamata in JavaScript. `napi_call_threadsafe_function()` accetta un parametro che controlla se l'API si comporta in modo bloccante. Se impostato su `napi_tsfn_nonblocking`, l'API si comporta in modo non bloccante, restituendo `napi_queue_full` se la coda era piena, impedendo l'aggiunta di dati alla coda. Se impostato su `napi_tsfn_blocking`, l'API si blocca fino a quando lo spazio non diventa disponibile nella coda. `napi_call_threadsafe_function()` non si blocca mai se la funzione thread-safe è stata creata con una dimensione massima della coda pari a 0.

`napi_call_threadsafe_function()` non deve essere chiamata con `napi_tsfn_blocking` da un thread JavaScript, perché, se la coda è piena, potrebbe causare il deadlock del thread JavaScript.

La chiamata effettiva in JavaScript è controllata dalla callback fornita tramite il parametro `call_js_cb`. `call_js_cb` viene invocata sul thread principale una volta per ogni valore inserito nella coda da una chiamata riuscita a `napi_call_threadsafe_function()`. Se tale callback non viene fornita, verrà utilizzata una callback predefinita e la chiamata JavaScript risultante non avrà argomenti. La callback `call_js_cb` riceve la funzione JavaScript da chiamare come `napi_value` nei suoi parametri, così come il puntatore di contesto `void*` utilizzato durante la creazione di `napi_threadsafe_function` e il successivo puntatore di dati creato da uno dei thread secondari. La callback può quindi utilizzare un'API come `napi_call_function()` per chiamare in JavaScript.

La callback può anche essere invocata con `env` e `call_js_cb` entrambi impostati su `NULL` per indicare che le chiamate in JavaScript non sono più possibili, mentre rimangono elementi nella coda che potrebbero dover essere liberati. Ciò si verifica normalmente quando il processo Node.js termina mentre è ancora attiva una funzione thread-safe.

Non è necessario chiamare in JavaScript tramite `napi_make_callback()` perché Node-API esegue `call_js_cb` in un contesto appropriato per le callback.

Zero o più elementi in coda possono essere invocati in ogni tick del ciclo di eventi. Le applicazioni non devono dipendere da un comportamento specifico diverso dal progresso nell'invocare le callback e gli eventi verranno invocati man mano che il tempo avanza.


### Conteggio dei riferimenti delle funzioni thread-safe {#reference-counting-of-thread-safe-functions}

I thread possono essere aggiunti e rimossi da un oggetto `napi_threadsafe_function` durante la sua esistenza. Pertanto, oltre a specificare un numero iniziale di thread al momento della creazione, è possibile chiamare `napi_acquire_threadsafe_function` per indicare che un nuovo thread inizierà a utilizzare la funzione thread-safe. Allo stesso modo, è possibile chiamare `napi_release_threadsafe_function` per indicare che un thread esistente smetterà di utilizzare la funzione thread-safe.

Gli oggetti `napi_threadsafe_function` vengono distrutti quando ogni thread che utilizza l'oggetto ha chiamato `napi_release_threadsafe_function()` o ha ricevuto uno stato di ritorno di `napi_closing` in risposta a una chiamata a `napi_call_threadsafe_function`. La coda viene svuotata prima che `napi_threadsafe_function` venga distrutta. `napi_release_threadsafe_function()` dovrebbe essere l'ultima chiamata API effettuata in congiunzione con una data `napi_threadsafe_function`, perché dopo che la chiamata è stata completata, non vi è alcuna garanzia che la `napi_threadsafe_function` sia ancora allocata. Per lo stesso motivo, non utilizzare una funzione thread-safe dopo aver ricevuto un valore di ritorno di `napi_closing` in risposta a una chiamata a `napi_call_threadsafe_function`. I dati associati a `napi_threadsafe_function` possono essere liberati nel suo callback `napi_finalize` che è stato passato a `napi_create_threadsafe_function()`. Il parametro `initial_thread_count` di `napi_create_threadsafe_function` indica il numero iniziale di acquisizioni delle funzioni thread-safe, invece di chiamare `napi_acquire_threadsafe_function` più volte al momento della creazione.

Una volta che il numero di thread che utilizzano una `napi_threadsafe_function` raggiunge lo zero, nessun altro thread può iniziare a utilizzarla chiamando `napi_acquire_threadsafe_function()`. Infatti, tutte le successive chiamate API ad essa associate, ad eccezione di `napi_release_threadsafe_function()`, restituiranno un valore di errore di `napi_closing`.

La funzione thread-safe può essere "interrotta" fornendo un valore di `napi_tsfn_abort` a `napi_release_threadsafe_function()`. Ciò farà sì che tutte le successive API associate alla funzione thread-safe, ad eccezione di `napi_release_threadsafe_function()`, restituiscano `napi_closing` anche prima che il suo conteggio dei riferimenti raggiunga lo zero. In particolare, `napi_call_threadsafe_function()` restituirà `napi_closing`, informando così i thread che non è più possibile effettuare chiamate asincrone alla funzione thread-safe. Questo può essere usato come criterio per terminare il thread. **Dopo aver ricevuto un valore di ritorno
di <code>napi_closing</code> da <code>napi_call_threadsafe_function()</code> un thread non deve più usare
la funzione thread-safe perché non è più garantito che sia
allocata.**


### Decidere se mantenere il processo in esecuzione {#deciding-whether-to-keep-the-process-running}

Analogamente agli handle libuv, le funzioni thread-safe possono essere "referenziate" e "dereferenziare". Una funzione thread-safe "referenziata" farà sì che il loop degli eventi sul thread su cui viene creata rimanga attivo fino a quando la funzione thread-safe non viene distrutta. Al contrario, una funzione thread-safe "dereferenziata" non impedirà l'uscita dal loop degli eventi. Le API `napi_ref_threadsafe_function` e `napi_unref_threadsafe_function` esistono per questo scopo.

Né `napi_unref_threadsafe_function` contrassegna le funzioni thread-safe come in grado di essere distrutte né `napi_ref_threadsafe_function` ne impedisce la distruzione.

### `napi_create_threadsafe_function` {#napi_create_threadsafe_function}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v12.6.0, v10.17.0 | Parametro `func` reso facoltativo con `call_js_cb` personalizzato. |
| v10.6.0 | Aggiunto in: v10.6.0 |
:::

**Versione N-API: 4**

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
- `[in] env`: L'ambiente in cui viene invocata l'API.
- `[in] func`: Una funzione JavaScript facoltativa da chiamare da un altro thread. Deve essere fornita se viene passato `NULL` a `call_js_cb`.
- `[in] async_resource`: Un oggetto facoltativo associato al lavoro asincrono che verrà passato a possibili hook `init` di `async_hooks` [`init` hooks](/it/nodejs/api/async_hooks#initasyncid-type-triggerasyncid-resource).
- `[in] async_resource_name`: Una stringa JavaScript per fornire un identificatore per il tipo di risorsa fornita per le informazioni diagnostiche esposte dall'API `async_hooks`.
- `[in] max_queue_size`: Dimensione massima della coda. `0` per nessun limite.
- `[in] initial_thread_count`: Il numero iniziale di acquisizioni, ovvero il numero iniziale di thread, incluso il thread principale, che utilizzeranno questa funzione.
- `[in] thread_finalize_data`: Dati facoltativi da passare a `thread_finalize_cb`.
- `[in] thread_finalize_cb`: Funzione facoltativa da chiamare quando `napi_threadsafe_function` viene distrutta.
- `[in] context`: Dati facoltativi da allegare alla `napi_threadsafe_function` risultante.
- `[in] call_js_cb`: Callback facoltativa che chiama la funzione JavaScript in risposta a una chiamata su un thread diverso. Questa callback verrà chiamata sul thread principale. Se non viene fornita, la funzione JavaScript verrà chiamata senza parametri e con `undefined` come valore `this`. [`napi_threadsafe_function_call_js`](/it/nodejs/api/n-api#napi_threadsafe_function_call_js) fornisce maggiori dettagli.
- `[out] result`: La funzione JavaScript asincrona thread-safe.

**Cronologia delle modifiche:**

- Sperimentale (`NAPI_EXPERIMENTAL` è definita): le eccezioni non gestite generate in `call_js_cb` vengono gestite con l'evento [`'uncaughtException'`](/it/nodejs/api/process#event-uncaughtexception), invece di essere ignorate.


### `napi_get_threadsafe_function_context` {#napi_get_threadsafe_function_context}

**Aggiunto in: v10.6.0**

**Versione N-API: 4**

```C [C]
NAPI_EXTERN napi_status
napi_get_threadsafe_function_context(napi_threadsafe_function func,
                                     void** result);
```
- `[in] func`: La funzione thread-safe per cui recuperare il contesto.
- `[out] result`: La posizione in cui memorizzare il contesto.

Questa API può essere chiamata da qualsiasi thread che utilizzi `func`.

### `napi_call_threadsafe_function` {#napi_call_threadsafe_function}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v14.5.0 | Il supporto per `napi_would_deadlock` è stato ripristinato. |
| v14.1.0 | Restituisce `napi_would_deadlock` quando viene chiamata con `napi_tsfn_blocking` dal thread principale o da un thread worker e la coda è piena. |
| v10.6.0 | Aggiunto in: v10.6.0 |
:::

**Versione N-API: 4**

```C [C]
NAPI_EXTERN napi_status
napi_call_threadsafe_function(napi_threadsafe_function func,
                              void* data,
                              napi_threadsafe_function_call_mode is_blocking);
```
- `[in] func`: La funzione JavaScript asincrona thread-safe da invocare.
- `[in] data`: Dati da inviare in JavaScript tramite il callback `call_js_cb` fornito durante la creazione della funzione JavaScript thread-safe.
- `[in] is_blocking`: Flag il cui valore può essere `napi_tsfn_blocking` per indicare che la chiamata deve bloccarsi se la coda è piena oppure `napi_tsfn_nonblocking` per indicare che la chiamata deve restituire immediatamente con uno stato di `napi_queue_full` ogni volta che la coda è piena.

Questa API non deve essere chiamata con `napi_tsfn_blocking` da un thread JavaScript, perché, se la coda è piena, potrebbe causare il deadlock del thread JavaScript.

Questa API restituirà `napi_closing` se `napi_release_threadsafe_function()` è stata chiamata con `abort` impostato su `napi_tsfn_abort` da qualsiasi thread. Il valore viene aggiunto alla coda solo se l'API restituisce `napi_ok`.

Questa API può essere chiamata da qualsiasi thread che utilizzi `func`.

### `napi_acquire_threadsafe_function` {#napi_acquire_threadsafe_function}

**Aggiunto in: v10.6.0**

**Versione N-API: 4**

```C [C]
NAPI_EXTERN napi_status
napi_acquire_threadsafe_function(napi_threadsafe_function func);
```
- `[in] func`: La funzione JavaScript asincrona thread-safe di cui iniziare a fare uso.

Un thread dovrebbe chiamare questa API prima di passare `func` a qualsiasi altra API di funzione thread-safe per indicare che ne farà uso. Ciò impedisce che `func` venga distrutta quando tutti gli altri thread hanno smesso di farne uso.

Questa API può essere chiamata da qualsiasi thread che inizierà a fare uso di `func`.


### `napi_release_threadsafe_function` {#napi_release_threadsafe_function}

**Aggiunto in: v10.6.0**

**Versione N-API: 4**

```C [C]
NAPI_EXTERN napi_status
napi_release_threadsafe_function(napi_threadsafe_function func,
                                 napi_threadsafe_function_release_mode mode);
```
- `[in] func`: La funzione JavaScript asincrona thread-safe il cui conteggio dei riferimenti deve essere decrementato.
- `[in] mode`: Flag il cui valore può essere `napi_tsfn_release` per indicare che il thread corrente non effettuerà ulteriori chiamate alla funzione thread-safe, oppure `napi_tsfn_abort` per indicare che, oltre al thread corrente, nessun altro thread dovrebbe effettuare ulteriori chiamate alla funzione thread-safe. Se impostato su `napi_tsfn_abort`, ulteriori chiamate a `napi_call_threadsafe_function()` restituiranno `napi_closing` e non verranno inseriti ulteriori valori nella coda.

Un thread dovrebbe chiamare questa API quando smette di utilizzare `func`. Passare `func` a qualsiasi API thread-safe dopo aver chiamato questa API ha risultati non definiti, poiché `func` potrebbe essere stata distrutta.

Questa API può essere chiamata da qualsiasi thread che smetterà di utilizzare `func`.

### `napi_ref_threadsafe_function` {#napi_ref_threadsafe_function}

**Aggiunto in: v10.6.0**

**Versione N-API: 4**

```C [C]
NAPI_EXTERN napi_status
napi_ref_threadsafe_function(node_api_basic_env env, napi_threadsafe_function func);
```
- `[in] env`: L'ambiente in cui viene richiamata l'API.
- `[in] func`: La funzione thread-safe a cui fare riferimento.

Questa API viene utilizzata per indicare che il ciclo di eventi in esecuzione sul thread principale non deve terminare finché `func` non è stata distrutta. Simile a [`uv_ref`](https://docs.libuv.org/en/v1.x/handle#c.uv_ref) è anche idempotente.

Né `napi_unref_threadsafe_function` contrassegna le funzioni thread-safe come in grado di essere distrutte, né `napi_ref_threadsafe_function` impedisce che vengano distrutte. `napi_acquire_threadsafe_function` e `napi_release_threadsafe_function` sono disponibili a tale scopo.

Questa API può essere chiamata solo dal thread principale.

### `napi_unref_threadsafe_function` {#napi_unref_threadsafe_function}

**Aggiunto in: v10.6.0**

**Versione N-API: 4**

```C [C]
NAPI_EXTERN napi_status
napi_unref_threadsafe_function(node_api_basic_env env, napi_threadsafe_function func);
```
- `[in] env`: L'ambiente in cui viene richiamata l'API.
- `[in] func`: La funzione thread-safe a cui annullare il riferimento.

Questa API viene utilizzata per indicare che il ciclo di eventi in esecuzione sul thread principale può terminare prima che `func` venga distrutta. Simile a [`uv_unref`](https://docs.libuv.org/en/v1.x/handle#c.uv_unref) è anche idempotente.

Questa API può essere chiamata solo dal thread principale.


## Utilità varie {#miscellaneous-utilities}

### `node_api_get_module_file_name` {#node_api_get_module_file_name}

**Aggiunto in: v15.9.0, v14.18.0, v12.22.0**

**Versione N-API: 9**

```C [C]
NAPI_EXTERN napi_status
node_api_get_module_file_name(node_api_basic_env env, const char** result);

```
- `[in] env`: L'ambiente in cui viene invocata l'API.
- `[out] result`: Un URL contenente il percorso assoluto della posizione da cui è stato caricato l'add-on. Per un file sul file system locale inizierà con `file://`. La stringa è terminata con null ed è di proprietà di `env` e quindi non deve essere modificata o liberata.

`result` può essere una stringa vuota se il processo di caricamento dell'add-on non riesce a stabilire il nome del file dell'add-on durante il caricamento.

