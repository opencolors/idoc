---
title: Addons di Node.js
description: Scopri come creare addons di Node.js utilizzando C++ per estendere le funzionalità delle applicazioni Node.js, inclusi esempi e riferimenti API.
head:
  - - meta
    - name: og:title
      content: Addons di Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Scopri come creare addons di Node.js utilizzando C++ per estendere le funzionalità delle applicazioni Node.js, inclusi esempi e riferimenti API.
  - - meta
    - name: twitter:title
      content: Addons di Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Scopri come creare addons di Node.js utilizzando C++ per estendere le funzionalità delle applicazioni Node.js, inclusi esempi e riferimenti API.
---


# Addon C++ {#c-addons}

Gli *Addon* sono oggetti condivisi collegati dinamicamente scritti in C++. La funzione [`require()`](/it/nodejs/api/modules#requireid) può caricare gli addon come normali moduli Node.js. Gli Addon forniscono un'interfaccia tra JavaScript e le librerie C/C++.

Ci sono tre opzioni per implementare gli addon:

- Node-API
- `nan` ([Native Abstractions for Node.js](https://github.com/nodejs/nan))
- uso diretto delle librerie interne di V8, libuv e Node.js

A meno che non ci sia bisogno di accesso diretto a funzionalità non esposte da Node-API, usa Node-API. Fai riferimento a [Addon C/C++ con Node-API](/it/nodejs/api/n-api) per maggiori informazioni su Node-API.

Quando non si utilizza Node-API, l'implementazione degli addon diventa più complessa, richiedendo la conoscenza di più componenti e API:

-  [V8](https://v8.dev/): la libreria C++ che Node.js utilizza per fornire l'implementazione JavaScript. Fornisce i meccanismi per creare oggetti, chiamare funzioni, ecc. L'API di V8 è documentata principalmente nel file di intestazione `v8.h` (`deps/v8/include/v8.h` nell'albero dei sorgenti di Node.js), ed è anche disponibile [online](https://v8docs.nodesource.com/). 
-  [libuv](https://github.com/libuv/libuv): La libreria C che implementa il ciclo di eventi di Node.js, i suoi thread di lavoro e tutti i comportamenti asincroni della piattaforma. Serve anche come libreria di astrazione multipiattaforma, dando un accesso facile, simile a POSIX, attraverso tutti i principali sistemi operativi a molti compiti di sistema comuni, come l'interazione con il file system, i socket, i timer e gli eventi di sistema. libuv fornisce anche un'astrazione di threading simile ai thread POSIX per addon asincroni più sofisticati che hanno bisogno di andare oltre il ciclo di eventi standard. Gli autori di addon dovrebbero evitare di bloccare il ciclo di eventi con I/O o altri compiti che richiedono molto tempo scaricando il lavoro tramite libuv a operazioni di sistema non bloccanti, thread di lavoro o un uso personalizzato dei thread libuv.
-  Librerie interne di Node.js: Node.js stesso esporta API C++ che gli addon possono utilizzare, la più importante delle quali è la classe `node::ObjectWrap`.
-  Altre librerie collegate staticamente (incluso OpenSSL): Queste altre librerie si trovano nella directory `deps/` nell'albero dei sorgenti di Node.js. Solo i simboli libuv, OpenSSL, V8 e zlib sono intenzionalmente riesportati da Node.js e possono essere utilizzati in varia misura dagli addon. Vedi [Collegamento a librerie incluse in Node.js](/it/nodejs/api/addons#linking-to-libraries-included-with-nodejs) per informazioni aggiuntive.

Tutti i seguenti esempi sono disponibili per il [download](https://github.com/nodejs/node-addon-examples) e possono essere utilizzati come punto di partenza per un addon.


## Hello world {#hello-world}

Questo esempio di "Hello world" è un semplice addon, scritto in C++, che è l'equivalente del seguente codice JavaScript:

```js [ESM]
module.exports.hello = () => 'world';
```
Innanzitutto, crea il file `hello.cc`:

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
Tutti gli addon di Node.js devono esportare una funzione di inizializzazione che segue lo schema:

```C++ [C++]
void Initialize(Local<Object> exports);
NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)
```
Non c'è il punto e virgola dopo `NODE_MODULE` perché non è una funzione (vedi `node.h`).

Il `module_name` deve corrispondere al nome del file del binario finale (escluso il suffisso `.node`).

Nell'esempio `hello.cc`, quindi, la funzione di inizializzazione è `Initialize` e il nome del modulo addon è `addon`.

Quando si creano addon con `node-gyp`, l'utilizzo della macro `NODE_GYP_MODULE_NAME` come primo parametro di `NODE_MODULE()` garantirà che il nome del binario finale venga passato a `NODE_MODULE()`.

Gli addon definiti con `NODE_MODULE()` non possono essere caricati in più contesti o più thread contemporaneamente.

### Addon con riconoscimento del contesto {#context-aware-addons}

Esistono ambienti in cui gli addon di Node.js potrebbero dover essere caricati più volte in più contesti. Ad esempio, il runtime [Electron](https://electronjs.org/) esegue più istanze di Node.js in un singolo processo. Ogni istanza avrà la propria cache `require()` e quindi ogni istanza avrà bisogno che un addon nativo si comporti correttamente quando viene caricato tramite `require()`. Ciò significa che l'addon deve supportare più inizializzazioni.

Un addon con riconoscimento del contesto può essere costruito utilizzando la macro `NODE_MODULE_INITIALIZER`, che si espande nel nome di una funzione che Node.js si aspetterà di trovare quando carica un addon. Un addon può quindi essere inizializzato come nel seguente esempio:

```C++ [C++]
using namespace v8;

extern "C" NODE_MODULE_EXPORT void
NODE_MODULE_INITIALIZER(Local<Object> exports,
                        Local<Value> module,
                        Local<Context> context) {
  /* Esegui i passaggi di inizializzazione dell'addon qui. */
}
```
Un'altra opzione è usare la macro `NODE_MODULE_INIT()`, che costruirà anche un addon con riconoscimento del contesto. A differenza di `NODE_MODULE()`, che viene utilizzato per costruire un addon attorno a una data funzione di inizializzazione dell'addon, `NODE_MODULE_INIT()` funge da dichiarazione di tale inizializzatore da seguire con un corpo di funzione.

Le seguenti tre variabili possono essere utilizzate all'interno del corpo della funzione dopo un'invocazione di `NODE_MODULE_INIT()`:

- `Local\<Object\> exports`,
- `Local\<Value\> module` e
- `Local\<Context\> context`

La creazione di un addon con riconoscimento del contesto richiede un'attenta gestione dei dati statici globali per garantire stabilità e correttezza. Poiché l'addon può essere caricato più volte, potenzialmente anche da thread diversi, tutti i dati statici globali memorizzati nell'addon devono essere adeguatamente protetti e non devono contenere riferimenti persistenti a oggetti JavaScript. Il motivo è che gli oggetti JavaScript sono validi solo in un contesto e probabilmente causano un arresto anomalo se si accede dal contesto sbagliato o da un thread diverso da quello su cui sono stati creati.

L'addon con riconoscimento del contesto può essere strutturato per evitare dati statici globali eseguendo i seguenti passaggi:

- Definisci una classe che conterrà i dati per istanza dell'addon e che ha un membro statico della forma
- Allocare nell'heap un'istanza di questa classe nell'inizializzatore dell'addon. Questo può essere realizzato usando la parola chiave `new`.
- Chiama `node::AddEnvironmentCleanupHook()`, passandogli l'istanza creata sopra e un puntatore a `DeleteInstance()`. Ciò garantirà che l'istanza venga eliminata quando l'ambiente viene smantellato.
- Memorizza l'istanza della classe in un `v8::External` e
- Passa il `v8::External` a tutti i metodi esposti a JavaScript passandolo a `v8::FunctionTemplate::New()` o `v8::Function::New()` che crea le funzioni JavaScript con supporto nativo. Il terzo parametro di `v8::FunctionTemplate::New()` o `v8::Function::New()` accetta il `v8::External` e lo rende disponibile nel callback nativo usando il metodo `v8::FunctionCallbackInfo::Data()`.

Ciò garantirà che i dati per istanza dell'addon raggiungano ogni binding che può essere chiamato da JavaScript. I dati per istanza dell'addon devono anche essere passati in tutti i callback asincroni che l'addon può creare.

Il seguente esempio illustra l'implementazione di un addon con riconoscimento del contesto:

```C++ [C++]
#include <node.h>

using namespace v8;

class AddonData {
 public:
  explicit AddonData(Isolate* isolate):
      call_count(0) {
    // Assicurati che questi dati per istanza dell'addon vengano eliminati alla pulizia dell'ambiente.
    node::AddEnvironmentCleanupHook(isolate, DeleteInstance, this);
  }

  // Dati per addon.
  int call_count;

  static void DeleteInstance(void* data) {
    delete static_cast<AddonData*>(data);
  }
};

static void Method(const v8::FunctionCallbackInfo<v8::Value>& info) {
  // Recupera i dati per istanza dell'addon.
  AddonData* data =
      reinterpret_cast<AddonData*>(info.Data().As<External>()->Value());
  data->call_count++;
  info.GetReturnValue().Set((double)data->call_count);
}

// Inizializza questo addon in modo che sia sensibile al contesto.
NODE_MODULE_INIT(/* exports, module, context */) {
  Isolate* isolate = context->GetIsolate();

  // Crea una nuova istanza di `AddonData` per questa istanza dell'addon e
  // lega il suo ciclo di vita a quello dell'ambiente Node.js.
  AddonData* data = new AddonData(isolate);

  // Avvolgi i dati in un `v8::External` in modo da poterli passare al metodo che
  // esporre.
  Local<External> external = External::New(isolate, data);

  // Esponi il metodo `Method` a JavaScript e assicurati che riceva il
  // dati per istanza dell'addon che abbiamo creato sopra passando `external` come
  // terzo parametro al costruttore `FunctionTemplate`.
  exports->Set(context,
               String::NewFromUtf8(isolate, "method").ToLocalChecked(),
               FunctionTemplate::New(isolate, Method, external)
                  ->GetFunction(context).ToLocalChecked()).FromJust();
}
```

#### Supporto per i worker {#worker-support}

::: info [Cronologia]
| Versione | Modifiche |
|---|---|
| v14.8.0, v12.19.0 | Gli hook di pulizia ora possono essere asincroni. |
:::

Per poter essere caricato da più ambienti Node.js, come un thread principale e un thread Worker, un add-on deve:

- Essere un add-on Node-API, oppure
- Essere dichiarato come context-aware usando `NODE_MODULE_INIT()` come descritto sopra

Per supportare i thread [`Worker`](/it/nodejs/api/worker_threads#class-worker), gli addon devono ripulire qualsiasi risorsa che potrebbero aver allocato quando tale thread termina. Questo può essere ottenuto tramite l'uso della funzione `AddEnvironmentCleanupHook()`:

```C++ [C++]
void AddEnvironmentCleanupHook(v8::Isolate* isolate,
                               void (*fun)(void* arg),
                               void* arg);
```
Questa funzione aggiunge un hook che verrà eseguito prima che una data istanza di Node.js si spenga. Se necessario, tali hook possono essere rimossi prima che vengano eseguiti utilizzando `RemoveEnvironmentCleanupHook()`, che ha la stessa firma. Le callback vengono eseguite in ordine LIFO (last-in first-out).

Se necessario, esiste una coppia aggiuntiva di overload di `AddEnvironmentCleanupHook()` e `RemoveEnvironmentCleanupHook()`, in cui l'hook di pulizia accetta una funzione di callback. Questo può essere usato per arrestare le risorse asincrone, come qualsiasi handle libuv registrato dall'addon.

Il seguente `addon.cc` utilizza `AddEnvironmentCleanupHook`:

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

// Nota: in un'applicazione del mondo reale, non fare affidamento su dati statici/globali.
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

// Inizializza questo add-on per essere context-aware.
NODE_MODULE_INIT(/* exports, module, context */) {
  Isolate* isolate = context->GetIsolate();

  AddEnvironmentCleanupHook(isolate, sanity_check, nullptr);
  AddEnvironmentCleanupHook(isolate, cleanup_cb2, cookie);
  AddEnvironmentCleanupHook(isolate, cleanup_cb1, isolate);
}
```
Test in JavaScript eseguendo:

```js [ESM]
// test.js
require('./build/Release/addon');
```

### Building {#building}

Una volta scritto il codice sorgente, deve essere compilato nel file binario `addon.node`. Per fare ciò, crea un file chiamato `binding.gyp` nella directory principale del progetto che descriva la configurazione di build del modulo utilizzando un formato simile a JSON. Questo file viene utilizzato da [node-gyp](https://github.com/nodejs/node-gyp), uno strumento scritto appositamente per compilare gli addon di Node.js.

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
Una versione dell'utility `node-gyp` è inclusa e distribuita con Node.js come parte di `npm`. Questa versione non è resa direttamente disponibile per l'uso da parte degli sviluppatori ed è intesa solo per supportare la capacità di utilizzare il comando `npm install` per compilare e installare gli addon. Gli sviluppatori che desiderano utilizzare `node-gyp` direttamente possono installarlo utilizzando il comando `npm install -g node-gyp`. Vedi le [istruzioni di installazione](https://github.com/nodejs/node-gyp#installation) di `node-gyp` per maggiori informazioni, inclusi i requisiti specifici della piattaforma.

Una volta creato il file `binding.gyp`, usa `node-gyp configure` per generare i file di build del progetto appropriati per la piattaforma corrente. Questo genererà un `Makefile` (su piattaforme Unix) o un file `vcxproj` (su Windows) nella directory `build/`.

Successivamente, invoca il comando `node-gyp build` per generare il file compilato `addon.node`. Questo verrà inserito nella directory `build/Release/`.

Quando si utilizza `npm install` per installare un addon di Node.js, npm utilizza la propria versione in bundle di `node-gyp` per eseguire lo stesso insieme di azioni, generando una versione compilata dell'addon per la piattaforma dell'utente su richiesta.

Una volta costruito, l'addon binario può essere utilizzato all'interno di Node.js puntando [`require()`](/it/nodejs/api/modules#requireid) al modulo `addon.node` costruito:

```js [ESM]
// hello.js
const addon = require('./build/Release/addon');

console.log(addon.hello());
// Prints: 'world'
```
Poiché il percorso esatto del binario dell'addon compilato può variare a seconda di come viene compilato (ovvero, a volte potrebbe essere in `./build/Debug/`), gli addon possono utilizzare il pacchetto [bindings](https://github.com/TooTallNate/node-bindings) per caricare il modulo compilato.

Sebbene l'implementazione del pacchetto `bindings` sia più sofisticata nel modo in cui individua i moduli addon, essenzialmente utilizza un modello `try…catch` simile a:

```js [ESM]
try {
  return require('./build/Release/addon.node');
} catch (err) {
  return require('./build/Debug/addon.node');
}
```

### Collegamento a librerie incluse in Node.js {#linking-to-libraries-included-with-nodejs}

Node.js utilizza librerie collegate staticamente come V8, libuv e OpenSSL. Tutti gli addon sono tenuti a collegarsi a V8 e possono anche collegarsi a qualsiasi altra dipendenza. In genere, questo è semplice come includere le appropriate istruzioni `#include \<...\>` (ad esempio `#include \<v8.h\>`) e `node-gyp` individuerà automaticamente le intestazioni appropriate. Tuttavia, ci sono alcune avvertenze di cui essere consapevoli:

- Quando `node-gyp` viene eseguito, rileverà la versione di rilascio specifica di Node.js e scaricherà l'archivio tar completo del codice sorgente o solo le intestazioni. Se viene scaricato il codice sorgente completo, gli addon avranno accesso completo all'intero set di dipendenze di Node.js. Tuttavia, se vengono scaricate solo le intestazioni di Node.js, saranno disponibili solo i simboli esportati da Node.js.
- `node-gyp` può essere eseguito utilizzando il flag `--nodedir` che punta a un'immagine di codice sorgente locale di Node.js. Utilizzando questa opzione, l'addon avrà accesso all'intero set di dipendenze.

### Caricamento di addon utilizzando `require()` {#loading-addons-using-require}

L'estensione del nome file del binario addon compilato è `.node` (invece di `.dll` o `.so`). La funzione [`require()`](/it/nodejs/api/modules#requireid) è scritta per cercare file con l'estensione file `.node` e inizializzarli come librerie collegate dinamicamente.

Quando si chiama [`require()`](/it/nodejs/api/modules#requireid), l'estensione `.node` può solitamente essere omessa e Node.js troverà e inizializzerà comunque l'addon. Un avvertimento, tuttavia, è che Node.js tenterà prima di individuare e caricare moduli o file JavaScript che condividono lo stesso nome base. Ad esempio, se c'è un file `addon.js` nella stessa directory del binario `addon.node`, allora [`require('addon')`](/it/nodejs/api/modules#requireid) darà la precedenza al file `addon.js` e lo caricherà invece.

## Astrazioni native per Node.js {#native-abstractions-for-nodejs}

Ciascuno degli esempi illustrati in questo documento utilizza direttamente le API Node.js e V8 per l'implementazione di addon. L'API V8 può cambiare, e ha cambiato, drasticamente da una release V8 all'altra (e da una release principale di Node.js all'altra). Ad ogni modifica, gli addon potrebbero dover essere aggiornati e ricompilati per continuare a funzionare. Il programma di rilascio di Node.js è progettato per ridurre al minimo la frequenza e l'impatto di tali modifiche, ma c'è poco che Node.js possa fare per garantire la stabilità delle API V8.

Le [Astrazioni native per Node.js](https://github.com/nodejs/nan) (o `nan`) forniscono un set di strumenti che gli sviluppatori di addon sono invitati a utilizzare per mantenere la compatibilità tra le release passate e future di V8 e Node.js. Consulta gli [esempi](https://github.com/nodejs/nan/tree/HEAD/examples/) di `nan` per un'illustrazione di come può essere utilizzato.


## Node-API {#node-api}

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile
:::

Node-API è un'API per la creazione di addon nativi. È indipendente dal runtime JavaScript sottostante (ad es. V8) ed è mantenuta come parte di Node.js stesso. Questa API sarà Application Binary Interface (ABI) stabile tra le versioni di Node.js. Ha lo scopo di isolare gli addon dalle modifiche nel motore JavaScript sottostante e consentire ai moduli compilati per una versione di essere eseguiti su versioni successive di Node.js senza ricompilazione. Gli addon sono costruiti/confezionati con lo stesso approccio/strumenti descritti in questo documento (node-gyp, ecc.). L'unica differenza è l'insieme di API che vengono utilizzate dal codice nativo. Invece di utilizzare le API V8 o [Native Abstractions for Node.js](https://github.com/nodejs/nan), vengono utilizzate le funzioni disponibili in Node-API.

La creazione e la manutenzione di un addon che beneficia della stabilità ABI fornita da Node-API comporta alcune [considerazioni sull'implementazione](/it/nodejs/api/n-api#implications-of-abi-stability).

Per utilizzare Node-API nell'esempio "Hello world" sopra, sostituire il contenuto di `hello.cc` con il seguente. Tutte le altre istruzioni rimangono invariate.

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
Le funzioni disponibili e come utilizzarle sono documentate in [Addon C/C++ con Node-API](/it/nodejs/api/n-api).


## Esempi di addon {#addon-examples}

Di seguito sono riportati alcuni esempi di addon pensati per aiutare gli sviluppatori a iniziare. Gli esempi utilizzano le API V8. Fare riferimento al [riferimento V8](https://v8docs.nodesource.com/) online per assistenza con le varie chiamate V8 e alla [Guida per l'incorporatore](https://v8.dev/docs/embed) di V8 per una spiegazione di diversi concetti utilizzati come handle, scope, modelli di funzione, ecc.

Ciascuno di questi esempi utilizza il seguente file `binding.gyp`:

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
Nel caso in cui ci sia più di un file `.cc`, è sufficiente aggiungere il nome file aggiuntivo all'array `sources`:

```json [JSON]
"sources": ["addon.cc", "myexample.cc"]
```
Una volta che il file `binding.gyp` è pronto, gli addon di esempio possono essere configurati e compilati utilizzando `node-gyp`:

```bash [BASH]
node-gyp configure build
```
### Argomenti della funzione {#function-arguments}

Gli addon in genere espongono oggetti e funzioni a cui è possibile accedere da JavaScript in esecuzione all'interno di Node.js. Quando le funzioni vengono invocate da JavaScript, gli argomenti di input e il valore di ritorno devono essere mappati da e verso il codice C/C++.

L'esempio seguente illustra come leggere gli argomenti della funzione passati da JavaScript e come restituire un risultato:

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

// Questa è l'implementazione del metodo "add"
// Gli argomenti di input vengono passati utilizzando lo
// struct const FunctionCallbackInfo<Value>& args
void Add(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  // Controlla il numero di argomenti passati.
  if (args.Length() < 2) {
    // Genera un errore che viene passato a JavaScript
    isolate->ThrowException(Exception::TypeError(
        String::NewFromUtf8(isolate,
                            "Numero errato di argomenti").ToLocalChecked()));
    return;
  }

  // Controlla i tipi di argomento
  if (!args[0]->IsNumber() || !args[1]->IsNumber()) {
    isolate->ThrowException(Exception::TypeError(
        String::NewFromUtf8(isolate,
                            "Argomenti errati").ToLocalChecked()));
    return;
  }

  // Esegui l'operazione
  double value =
      args[0].As<Number>()->Value() + args[1].As<Number>()->Value();
  Local<Number> num = Number::New(isolate, value);

  // Imposta il valore di ritorno (utilizzando il
  // FunctionCallbackInfo<Value>& passato)
  args.GetReturnValue().Set(num);
}

void Init(Local<Object> exports) {
  NODE_SET_METHOD(exports, "add", Add);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Init)

}  // namespace demo
```
Una volta compilato, l'addon di esempio può essere richiesto e utilizzato all'interno di Node.js:

```js [ESM]
// test.js
const addon = require('./build/Release/addon');

console.log('Questo dovrebbe essere otto:', addon.add(3, 5));
```

### Callback {#callbacks}

È pratica comune all'interno degli addon passare funzioni JavaScript a una funzione C++ ed eseguirle da lì. Il seguente esempio illustra come invocare tali callback:

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
Questo esempio utilizza una forma a due argomenti di `Init()` che riceve l'oggetto `module` completo come secondo argomento. Ciò consente all'addon di sovrascrivere completamente `exports` con una singola funzione invece di aggiungere la funzione come proprietà di `exports`.

Per testarlo, esegui il seguente JavaScript:

```js [ESM]
// test.js
const addon = require('./build/Release/addon');

addon((msg) => {
  console.log(msg);
// Prints: 'hello world'
});
```
In questo esempio, la funzione di callback viene invocata in modo sincrono.

### Fabbrica di oggetti {#object-factory}

Gli addon possono creare e restituire nuovi oggetti dall'interno di una funzione C++ come illustrato nel seguente esempio. Un oggetto viene creato e restituito con una proprietà `msg` che riproduce la stringa passata a `createObject()`:

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
Per testarlo in JavaScript:

```js [ESM]
// test.js
const addon = require('./build/Release/addon');

const obj1 = addon('hello');
const obj2 = addon('world');
console.log(obj1.msg, obj2.msg);
// Prints: 'hello world'
```

### Fabbrica di funzioni {#function-factory}

Un altro scenario comune è la creazione di funzioni JavaScript che avvolgono funzioni C++ e la restituzione di queste a JavaScript:

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

  // omettere questo per renderla anonima
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
Per testare:

```js [ESM]
// test.js
const addon = require('./build/Release/addon');

const fn = addon();
console.log(fn());
// Stampa: 'hello world'
```
### Avvolgimento di oggetti C++ {#wrapping-c-objects}

È anche possibile avvolgere oggetti/classi C++ in modo tale da consentire la creazione di nuove istanze utilizzando l'operatore `new` di JavaScript:

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
Quindi, in `myobject.h`, la classe wrapper eredita da `node::ObjectWrap`:

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
In `myobject.cc`, implementare i vari metodi che devono essere esposti. Nel codice seguente, il metodo `plusOne()` è esposto aggiungendolo al prototipo del costruttore:

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
  addon_data_tpl->SetInternalFieldCount(1);  // 1 campo per MyObject::New()
  Local<Object> addon_data =
      addon_data_tpl->NewInstance(context).ToLocalChecked();

  // Preparare il template del costruttore
  Local<FunctionTemplate> tpl = FunctionTemplate::New(isolate, New, addon_data);
  tpl->SetClassName(String::NewFromUtf8(isolate, "MyObject").ToLocalChecked());
  tpl->InstanceTemplate()->SetInternalFieldCount(1);

  // Prototipo
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
    // Invocato come costruttore: `new MyObject(...)`
    double value = args[0]->IsUndefined() ?
        0 : args[0]->NumberValue(context).FromMaybe(0);
    MyObject* obj = new MyObject(value);
    obj->Wrap(args.This());
    args.GetReturnValue().Set(args.This());
  } else {
    // Invocato come funzione normale `MyObject(...)`, trasformare in chiamata di costruttore.
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
Per compilare questo esempio, il file `myobject.cc` deve essere aggiunto al `binding.gyp`:

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
Testarlo con:

```js [ESM]
// test.js
const addon = require('./build/Release/addon');

const obj = new addon.MyObject(10);
console.log(obj.plusOne());
// Stampa: 11
console.log(obj.plusOne());
// Stampa: 12
console.log(obj.plusOne());
// Stampa: 13
```
Il distruttore per un oggetto wrapper verrà eseguito quando l'oggetto viene raccolto dal garbage collector. Per il test del distruttore, ci sono flag della riga di comando che possono essere usati per rendere possibile forzare la garbage collection. Questi flag sono forniti dal motore JavaScript V8 sottostante. Sono soggetti a modifiche o rimozione in qualsiasi momento. Non sono documentati da Node.js o V8 e non dovrebbero mai essere usati al di fuori dei test.

Durante l'arresto del processo o dei thread di lavoro, i distruttori non vengono chiamati dal motore JS. Pertanto, è responsabilità dell'utente tenere traccia di questi oggetti e garantire una corretta distruzione per evitare perdite di risorse.


### Fabbrica di oggetti wrappati {#factory-of-wrapped-objects}

In alternativa, è possibile utilizzare un pattern di fabbrica per evitare di creare esplicitamente istanze di oggetti utilizzando l'operatore JavaScript `new`:

```js [ESM]
const obj = addon.createObject();
// invece di:
// const obj = new addon.Object();
```
Innanzitutto, il metodo `createObject()` viene implementato in `addon.cc`:

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
In `myobject.h`, il metodo statico `NewInstance()` viene aggiunto per gestire l'istanziazione dell'oggetto. Questo metodo sostituisce l'uso di `new` in JavaScript:

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
L'implementazione in `myobject.cc` è simile all'esempio precedente:

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
Ancora una volta, per compilare questo esempio, il file `myobject.cc` deve essere aggiunto al `binding.gyp`:

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
Testalo con:

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

### Passaggio di oggetti wrapped {#passing-wrapped-objects-around}

Oltre a wrappare e restituire oggetti C++, è possibile passare oggetti wrapped scorporandoli con la funzione helper Node.js `node::ObjectWrap::Unwrap`. L'esempio seguente mostra una funzione `add()` che può accettare due oggetti `MyObject` come argomenti di input:

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
In `myobject.h`, viene aggiunto un nuovo metodo pubblico per consentire l'accesso ai valori privati ​​dopo aver scorporato l'oggetto.

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
L'implementazione di `myobject.cc` rimane simile alla versione precedente:

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
Testalo con:

```js [ESM]
// test.js
const addon = require('./build/Release/addon');

const obj1 = addon.createObject(10);
const obj2 = addon.createObject(20);
const result = addon.add(obj1, obj2);

console.log(result);
// Prints: 30
```
