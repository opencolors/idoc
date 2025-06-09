---
title: Addons Node.js
description: Découvrez comment créer des addons Node.js en utilisant C++ pour étendre les fonctionnalités des applications Node.js, avec des exemples et des références API.
head:
  - - meta
    - name: og:title
      content: Addons Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Découvrez comment créer des addons Node.js en utilisant C++ pour étendre les fonctionnalités des applications Node.js, avec des exemples et des références API.
  - - meta
    - name: twitter:title
      content: Addons Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Découvrez comment créer des addons Node.js en utilisant C++ pour étendre les fonctionnalités des applications Node.js, avec des exemples et des références API.
---


# Addons C++ {#c-addons}

Les *addons* sont des objets partagés liés dynamiquement écrits en C++. La fonction [`require()`](/fr/nodejs/api/modules#requireid) peut charger les addons comme des modules Node.js ordinaires. Les addons fournissent une interface entre JavaScript et les bibliothèques C/C++.

Il existe trois options pour implémenter des addons :

- Node-API
- `nan` ([Native Abstractions for Node.js](https://github.com/nodejs/nan))
- utilisation directe des bibliothèques internes V8, libuv et Node.js

Sauf en cas de besoin d'accès direct à des fonctionnalités non exposées par Node-API, utilisez Node-API. Reportez-vous à [Addons C/C++ avec Node-API](/fr/nodejs/api/n-api) pour plus d'informations sur Node-API.

Lorsque Node-API n'est pas utilisé, l'implémentation des addons devient plus complexe, nécessitant la connaissance de plusieurs composants et API :

- [V8](https://v8.dev/): la bibliothèque C++ que Node.js utilise pour fournir l'implémentation JavaScript. Elle fournit les mécanismes de création d'objets, d'appel de fonctions, etc. L'API de V8 est documentée principalement dans le fichier d'en-tête `v8.h` (`deps/v8/include/v8.h` dans l'arborescence source de Node.js), et est également disponible [en ligne](https://v8docs.nodesource.com/).
- [libuv](https://github.com/libuv/libuv) : la bibliothèque C qui implémente la boucle d’événements Node.js, ses threads de travail et tous les comportements asynchrones de la plateforme. Elle sert également de bibliothèque d’abstraction multiplateforme, donnant un accès facile, de type POSIX, sur tous les principaux systèmes d’exploitation à de nombreuses tâches système courantes, telles que l’interaction avec le système de fichiers, les sockets, les timers et les événements système. libuv fournit également une abstraction de threading similaire aux threads POSIX pour les addons asynchrones plus sophistiqués qui doivent aller au-delà de la boucle d’événements standard. Les auteurs d’addons doivent éviter de bloquer la boucle d’événements avec des E/S ou d’autres tâches nécessitant beaucoup de temps en déchargeant le travail via libuv vers des opérations système non bloquantes, des threads de travail ou une utilisation personnalisée des threads libuv.
- Bibliothèques internes de Node.js : Node.js lui-même exporte des API C++ que les addons peuvent utiliser, dont la plus importante est la classe `node::ObjectWrap`.
- Autres bibliothèques liées statiquement (y compris OpenSSL) : Ces autres bibliothèques sont situées dans le répertoire `deps/` dans l'arborescence source de Node.js. Seuls les symboles libuv, OpenSSL, V8 et zlib sont intentionnellement réexportés par Node.js et peuvent être utilisés à divers degrés par les addons. Voir [Liaison vers des bibliothèques incluses avec Node.js](/fr/nodejs/api/addons#linking-to-libraries-included-with-nodejs) pour des informations supplémentaires.

Tous les exemples suivants sont disponibles en [téléchargement](https://github.com/nodejs/node-addon-examples) et peuvent être utilisés comme point de départ pour un addon.


## Hello world {#hello-world}

Cet exemple "Hello world" est un addon simple, écrit en C++, qui est l'équivalent du code JavaScript suivant :

```js [ESM]
module.exports.hello = () => 'world';
```
Tout d'abord, créez le fichier `hello.cc` :

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
Tous les addons Node.js doivent exporter une fonction d'initialisation suivant le modèle :

```C++ [C++]
void Initialize(Local<Object> exports);
NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)
```
Il n'y a pas de point-virgule après `NODE_MODULE` car ce n'est pas une fonction (voir `node.h`).

Le `module_name` doit correspondre au nom de fichier du binaire final (à l'exclusion du suffixe `.node`).

Dans l'exemple `hello.cc`, la fonction d'initialisation est donc `Initialize` et le nom du module addon est `addon`.

Lors de la création d'addons avec `node-gyp`, l'utilisation de la macro `NODE_GYP_MODULE_NAME` comme premier paramètre de `NODE_MODULE()` garantit que le nom du binaire final sera transmis à `NODE_MODULE()`.

Les addons définis avec `NODE_MODULE()` ne peuvent pas être chargés dans plusieurs contextes ou plusieurs threads en même temps.

### Addons sensibles au contexte {#context-aware-addons}

Il existe des environnements dans lesquels les addons Node.js peuvent devoir être chargés plusieurs fois dans plusieurs contextes. Par exemple, l'environnement d'exécution [Electron](https://electronjs.org/) exécute plusieurs instances de Node.js dans un seul processus. Chaque instance aura son propre cache `require()`, et donc chaque instance aura besoin d'un addon natif pour se comporter correctement lorsqu'il est chargé via `require()`. Cela signifie que l'addon doit prendre en charge plusieurs initialisations.

Un addon sensible au contexte peut être construit en utilisant la macro `NODE_MODULE_INITIALIZER`, qui se développe au nom d'une fonction que Node.js s'attendra à trouver lors du chargement d'un addon. Un addon peut donc être initialisé comme dans l'exemple suivant :

```C++ [C++]
using namespace v8;

extern "C" NODE_MODULE_EXPORT void
NODE_MODULE_INITIALIZER(Local<Object> exports,
                        Local<Value> module,
                        Local<Context> context) {
  /* Perform addon initialization steps here. */
}
```
Une autre option consiste à utiliser la macro `NODE_MODULE_INIT()`, qui construira également un addon sensible au contexte. Contrairement à `NODE_MODULE()`, qui est utilisé pour construire un addon autour d'une fonction d'initialisation d'addon donnée, `NODE_MODULE_INIT()` sert de déclaration d'un tel initialiseur à suivre par un corps de fonction.

Les trois variables suivantes peuvent être utilisées à l'intérieur du corps de la fonction après un appel à `NODE_MODULE_INIT()` :

- `Local\<Object\> exports`,
- `Local\<Value\> module`, et
- `Local\<Context\> context`

La création d'un addon sensible au contexte nécessite une gestion prudente des données statiques globales pour garantir la stabilité et l'exactitude. Étant donné que l'addon peut être chargé plusieurs fois, potentiellement même à partir de différents threads, toutes les données statiques globales stockées dans l'addon doivent être correctement protégées et ne doivent pas contenir de références persistantes aux objets JavaScript. La raison en est que les objets JavaScript ne sont valides que dans un seul contexte et sont susceptibles de provoquer un plantage lorsqu'ils sont consultés à partir du mauvais contexte ou à partir d'un thread différent de celui sur lequel ils ont été créés.

L'addon sensible au contexte peut être structuré pour éviter les données statiques globales en effectuant les étapes suivantes :

- Définir une classe qui contiendra les données par instance d'addon et qui a un membre statique de la forme
- Allouer sur le tas une instance de cette classe dans l'initialiseur d'addon. Ceci peut être réalisé en utilisant le mot-clé `new`.
- Appeler `node::AddEnvironmentCleanupHook()`, en lui transmettant l'instance créée ci-dessus et un pointeur vers `DeleteInstance()`. Cela garantira que l'instance est supprimée lorsque l'environnement est démantelé.
- Stocker l'instance de la classe dans un `v8::External`, et
- Transmettre le `v8::External` à toutes les méthodes exposées à JavaScript en le transmettant à `v8::FunctionTemplate::New()` ou `v8::Function::New()` qui crée les fonctions JavaScript à support natif. Le troisième paramètre de `v8::FunctionTemplate::New()` ou `v8::Function::New()` accepte le `v8::External` et le rend disponible dans le rappel natif en utilisant la méthode `v8::FunctionCallbackInfo::Data()`.

Cela garantira que les données par instance d'addon atteignent chaque liaison qui peut être appelée à partir de JavaScript. Les données par instance d'addon doivent également être transmises à tous les rappels asynchrones que l'addon peut créer.

L'exemple suivant illustre l'implémentation d'un addon sensible au contexte :

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

#### Support des Workers {#worker-support}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v14.8.0, v12.19.0 | Les hooks de nettoyage peuvent désormais être asynchrones. |
:::

Afin d'être chargé depuis plusieurs environnements Node.js, tels qu'un thread principal et un thread Worker, un module complémentaire doit soit :

- Être un module complémentaire Node-API, soit
- Être déclaré comme étant sensible au contexte à l'aide de `NODE_MODULE_INIT()` comme décrit ci-dessus

Afin de prendre en charge les threads [`Worker`](/fr/nodejs/api/worker_threads#class-worker), les modules complémentaires doivent nettoyer toutes les ressources qu'ils peuvent avoir allouées lorsqu'un tel thread se termine. Cela peut être réalisé grâce à l'utilisation de la fonction `AddEnvironmentCleanupHook()` :

```C++ [C++]
void AddEnvironmentCleanupHook(v8::Isolate* isolate,
                               void (*fun)(void* arg),
                               void* arg);
```
Cette fonction ajoute un hook qui s'exécutera avant qu'une instance Node.js donnée ne s'arrête. Si nécessaire, ces hooks peuvent être supprimés avant leur exécution à l'aide de `RemoveEnvironmentCleanupHook()`, qui a la même signature. Les rappels sont exécutés dans l'ordre dernier entré, premier sorti.

Si nécessaire, il existe une paire supplémentaire de surcharges `AddEnvironmentCleanupHook()` et `RemoveEnvironmentCleanupHook()`, où le hook de nettoyage prend une fonction de rappel. Ceci peut être utilisé pour arrêter les ressources asynchrones, telles que toutes les handles libuv enregistrées par le module complémentaire.

Le `addon.cc` suivant utilise `AddEnvironmentCleanupHook` :

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

// Remarque : dans une application réelle, ne vous fiez pas aux données statiques/globales.
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

// Initialiser ce module complémentaire pour qu'il soit sensible au contexte.
NODE_MODULE_INIT(/* exports, module, context */) {
  Isolate* isolate = context->GetIsolate();

  AddEnvironmentCleanupHook(isolate, sanity_check, nullptr);
  AddEnvironmentCleanupHook(isolate, cleanup_cb2, cookie);
  AddEnvironmentCleanupHook(isolate, cleanup_cb1, isolate);
}
```
Testez en JavaScript en exécutant :

```js [ESM]
// test.js
require('./build/Release/addon');
```

### Compilation {#building}

Une fois le code source écrit, il doit être compilé dans le fichier binaire `addon.node`. Pour ce faire, créez un fichier nommé `binding.gyp` à la racine du projet décrivant la configuration de construction du module en utilisant un format de type JSON. Ce fichier est utilisé par [node-gyp](https://github.com/nodejs/node-gyp), un outil écrit spécifiquement pour compiler les addons Node.js.

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
Une version de l’utilitaire `node-gyp` est groupée et distribuée avec Node.js dans le cadre de `npm`. Cette version n’est pas directement mise à disposition des développeurs et est uniquement destinée à permettre l’utilisation de la commande `npm install` pour compiler et installer des addons. Les développeurs qui souhaitent utiliser `node-gyp` directement peuvent l’installer à l’aide de la commande `npm install -g node-gyp`. Consultez les [instructions d’installation](https://github.com/nodejs/node-gyp#installation) de `node-gyp` pour plus d’informations, y compris les exigences spécifiques à la plateforme.

Une fois le fichier `binding.gyp` créé, utilisez `node-gyp configure` pour générer les fichiers de construction de projet appropriés pour la plateforme actuelle. Cela générera soit un `Makefile` (sur les plateformes Unix), soit un fichier `vcxproj` (sur Windows) dans le répertoire `build/`.

Ensuite, invoquez la commande `node-gyp build` pour générer le fichier `addon.node` compilé. Il sera placé dans le répertoire `build/Release/`.

Lorsque vous utilisez `npm install` pour installer un addon Node.js, npm utilise sa propre version intégrée de `node-gyp` pour effectuer le même ensemble d’actions, en générant une version compilée de l’addon pour la plateforme de l’utilisateur à la demande.

Une fois compilé, l’addon binaire peut être utilisé dans Node.js en pointant [`require()`](/fr/nodejs/api/modules#requireid) vers le module `addon.node` compilé :

```js [ESM]
// hello.js
const addon = require('./build/Release/addon');

console.log(addon.hello());
// Prints: 'world'
```
Étant donné que le chemin exact vers le binaire de l’addon compilé peut varier en fonction de la façon dont il est compilé (c’est-à-dire qu’il peut parfois se trouver dans `./build/Debug/`), les addons peuvent utiliser le package [bindings](https://github.com/TooTallNate/node-bindings) pour charger le module compilé.

Bien que l’implémentation du package `bindings` soit plus sophistiquée dans la façon dont elle localise les modules d’addon, elle utilise essentiellement un modèle `try…catch` similaire à :

```js [ESM]
try {
  return require('./build/Release/addon.node');
} catch (err) {
  return require('./build/Debug/addon.node');
}
```

### Liaison avec les bibliothèques incluses dans Node.js {#linking-to-libraries-included-with-nodejs}

Node.js utilise des bibliothèques liées statiquement telles que V8, libuv et OpenSSL. Tous les modules complémentaires doivent être liés à V8 et peuvent également être liés à n'importe quelle autre dépendance. Généralement, cela se fait simplement en incluant les instructions `#include \<...\>` appropriées (par exemple, `#include \<v8.h\>`) et `node-gyp` localisera automatiquement les en-têtes appropriés. Cependant, il y a quelques mises en garde à connaître :

- Lorsque `node-gyp` s'exécute, il détecte la version spécifique de Node.js et télécharge soit l'archive source complète, soit uniquement les en-têtes. Si la source complète est téléchargée, les modules complémentaires auront un accès complet à l'ensemble des dépendances de Node.js. Cependant, si seuls les en-têtes Node.js sont téléchargés, seuls les symboles exportés par Node.js seront disponibles.
- `node-gyp` peut être exécuté à l'aide de l'indicateur `--nodedir` pointant vers une image source Node.js locale. En utilisant cette option, le module complémentaire aura accès à l'ensemble des dépendances.

### Chargement des modules complémentaires à l'aide de `require()` {#loading-addons-using-require}

L'extension de nom de fichier du binaire de module complémentaire compilé est `.node` (par opposition à `.dll` ou `.so`). La fonction [`require()`](/fr/nodejs/api/modules#requireid) est écrite pour rechercher les fichiers avec l'extension de fichier `.node` et les initialiser en tant que bibliothèques liées dynamiquement.

Lors de l'appel à [`require()`](/fr/nodejs/api/modules#requireid), l'extension `.node` peut généralement être omise et Node.js trouvera et initialisera toujours le module complémentaire. Une mise en garde, cependant, est que Node.js tentera d'abord de localiser et de charger les modules ou les fichiers JavaScript qui partagent le même nom de base. Par exemple, s'il existe un fichier `addon.js` dans le même répertoire que le binaire `addon.node`, alors [`require('addon')`](/fr/nodejs/api/modules#requireid) donnera la priorité au fichier `addon.js` et le chargera à la place.

## Abstractions natives pour Node.js {#native-abstractions-for-nodejs}

Chacun des exemples illustrés dans ce document utilise directement les API Node.js et V8 pour implémenter des modules complémentaires. L'API V8 peut, et a, radicalement changé d'une version V8 à l'autre (et d'une version majeure de Node.js à l'autre). À chaque modification, les modules complémentaires peuvent devoir être mis à jour et recompilés afin de continuer à fonctionner. Le calendrier de publication de Node.js est conçu pour minimiser la fréquence et l'impact de ces modifications, mais Node.js ne peut pas faire grand-chose pour assurer la stabilité des API V8.

Les [abstractions natives pour Node.js](https://github.com/nodejs/nan) (ou `nan`) fournissent un ensemble d'outils que les développeurs de modules complémentaires sont invités à utiliser pour maintenir la compatibilité entre les versions passées et futures de V8 et Node.js. Consultez les [exemples](https://github.com/nodejs/nan/tree/HEAD/examples/) `nan` pour une illustration de la façon dont il peut être utilisé.


## Node-API {#node-api}

::: tip [Stable: 2 - Stable]
[Stable: 2](/fr/nodejs/api/documentation#stability-index) [Stability: 2](/fr/nodejs/api/documentation#stability-index) - Stable
:::

Node-API est une API pour construire des modules complémentaires natifs. Elle est indépendante du moteur d'exécution JavaScript sous-jacent (par exemple, V8) et est maintenue dans le cadre de Node.js lui-même. Cette API sera stable au niveau de l'interface binaire d'application (ABI) à travers les versions de Node.js. Elle est destinée à isoler les modules complémentaires des modifications du moteur JavaScript sous-jacent et à permettre aux modules compilés pour une version de s'exécuter sur des versions ultérieures de Node.js sans recompilation. Les modules complémentaires sont construits/empaquetés avec la même approche/outils décrits dans ce document (node-gyp, etc.). La seule différence est l'ensemble des API qui sont utilisées par le code natif. Au lieu d'utiliser les API V8 ou [Native Abstractions for Node.js](https://github.com/nodejs/nan), les fonctions disponibles dans Node-API sont utilisées.

La création et la maintenance d'un module complémentaire qui bénéficie de la stabilité ABI fournie par Node-API entraînent certaines [considérations d'implémentation](/fr/nodejs/api/n-api#implications-of-abi-stability).

Pour utiliser Node-API dans l'exemple "Hello world" ci-dessus, remplacez le contenu de `hello.cc` par ce qui suit. Toutes les autres instructions restent les mêmes.

```C++ [C++]
// hello.cc utilisant Node-API
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
Les fonctions disponibles et la manière de les utiliser sont documentées dans [Modules complémentaires C/C++ avec Node-API](/fr/nodejs/api/n-api).


## Exemples d'addons {#addon-examples}

Voici quelques exemples d'addons destinés à aider les développeurs à démarrer. Les exemples utilisent les API V8. Consultez la [référence V8](https://v8docs.nodesource.com/) en ligne pour obtenir de l'aide sur les différents appels V8, et le [Guide de l'intégrateur](https://v8.dev/docs/embed) de V8 pour une explication de plusieurs concepts utilisés tels que les handles, les scopes, les modèles de fonctions, etc.

Chacun de ces exemples utilise le fichier `binding.gyp` suivant :

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
Dans les cas où il y a plus d'un fichier `.cc`, ajoutez simplement le nom de fichier supplémentaire au tableau `sources` :

```json [JSON]
"sources": ["addon.cc", "myexample.cc"]
```
Une fois le fichier `binding.gyp` prêt, les exemples d'addons peuvent être configurés et construits en utilisant `node-gyp` :

```bash [BASH]
node-gyp configure build
```
### Arguments de fonction {#function-arguments}

Les addons exposent généralement des objets et des fonctions accessibles depuis JavaScript s'exécutant dans Node.js. Lorsque des fonctions sont appelées depuis JavaScript, les arguments d'entrée et la valeur de retour doivent être mappés vers et depuis le code C/C++.

L'exemple suivant illustre comment lire les arguments de fonction passés depuis JavaScript et comment renvoyer un résultat :

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

// Ceci est l'implémentation de la méthode "add"
// Les arguments d'entrée sont passés en utilisant le
// struct const FunctionCallbackInfo<Value>& args
void Add(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  // Vérifiez le nombre d'arguments passés.
  if (args.Length() < 2) {
    // Lancez une erreur qui est renvoyée à JavaScript
    isolate->ThrowException(Exception::TypeError(
        String::NewFromUtf8(isolate,
                            "Nombre d'arguments incorrect").ToLocalChecked()));
    return;
  }

  // Vérifiez les types d'arguments
  if (!args[0]->IsNumber() || !args[1]->IsNumber()) {
    isolate->ThrowException(Exception::TypeError(
        String::NewFromUtf8(isolate,
                            "Arguments incorrects").ToLocalChecked()));
    return;
  }

  // Effectuez l'opération
  double value =
      args[0].As<Number>()->Value() + args[1].As<Number>()->Value();
  Local<Number> num = Number::New(isolate, value);

  // Définissez la valeur de retour (en utilisant le
  // FunctionCallbackInfo<Value>& passé)
  args.GetReturnValue().Set(num);
}

void Init(Local<Object> exports) {
  NODE_SET_METHOD(exports, "add", Add);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Init)

}  // namespace demo
```
Une fois compilé, l'exemple d'addon peut être requis et utilisé depuis Node.js :

```js [ESM]
// test.js
const addon = require('./build/Release/addon');

console.log('Cela devrait être huit :', addon.add(3, 5));
```

### Rappels {#callbacks}

Il est courant dans les addons de passer des fonctions JavaScript à une fonction C++ et de les exécuter à partir de là. L'exemple suivant illustre comment invoquer de tels rappels :

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
Cet exemple utilise une forme à deux arguments de `Init()` qui reçoit l'objet `module` complet comme deuxième argument. Cela permet à l'addon de remplacer complètement `exports` par une seule fonction au lieu d'ajouter la fonction comme propriété de `exports`.

Pour le tester, exécutez le JavaScript suivant :

```js [ESM]
// test.js
const addon = require('./build/Release/addon');

addon((msg) => {
  console.log(msg);
// Prints: 'hello world'
});
```
Dans cet exemple, la fonction de rappel est invoquée de manière synchrone.

### Fabrique d'objets {#object-factory}

Les addons peuvent créer et renvoyer de nouveaux objets à partir d'une fonction C++ comme illustré dans l'exemple suivant. Un objet est créé et renvoyé avec une propriété `msg` qui fait écho à la chaîne transmise à `createObject()` :

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
Pour le tester en JavaScript :

```js [ESM]
// test.js
const addon = require('./build/Release/addon');

const obj1 = addon('hello');
const obj2 = addon('world');
console.log(obj1.msg, obj2.msg);
// Prints: 'hello world'
```

### Fabrique de fonctions {#function-factory}

Un autre scénario courant est la création de fonctions JavaScript qui enveloppent des fonctions C++ et renvoient ces dernières à JavaScript :

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
Pour tester :

```js [ESM]
// test.js
const addon = require('./build/Release/addon');

const fn = addon();
console.log(fn());
// Prints: 'hello world'
```
### Envelopper des objets C++ {#wrapping-c-objects}

Il est également possible d'envelopper des objets/classes C++ d'une manière qui permet de créer de nouvelles instances en utilisant l'opérateur JavaScript `new` :

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
Puis, dans `myobject.h`, la classe wrapper hérite de `node::ObjectWrap` :

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
Dans `myobject.cc`, implémentez les différentes méthodes qui doivent être exposées. Dans le code suivant, la méthode `plusOne()` est exposée en l'ajoutant au prototype du constructeur :

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
Pour construire cet exemple, le fichier `myobject.cc` doit être ajouté au `binding.gyp` :

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
Testez avec :

```js [ESM]
// test.js
const addon = require('./build/Release/addon');

const obj = new addon.MyObject(10);
console.log(obj.plusOne());
// Prints: 11
console.log(obj.plusOne());
// Prints: 12
console.log(obj.plusOne());
// Prints: 13
```
Le destructeur d'un objet wrapper s'exécutera lorsque l'objet est collecté par le ramasse-miettes. Pour tester le destructeur, il existe des indicateurs de ligne de commande qui peuvent être utilisés pour permettre de forcer le ramasse-miettes. Ces indicateurs sont fournis par le moteur JavaScript V8 sous-jacent. Ils sont sujets à changement ou à suppression à tout moment. Ils ne sont pas documentés par Node.js ou V8, et ils ne doivent jamais être utilisés en dehors des tests.

Lors de l'arrêt du processus ou des threads de travail, les destructeurs ne sont pas appelés par le moteur JS. Il est donc de la responsabilité de l'utilisateur de suivre ces objets et d'assurer une destruction appropriée pour éviter les fuites de ressources.


### Fabrique d'objets enveloppés {#factory-of-wrapped-objects}

Alternativement, il est possible d'utiliser un motif de fabrique pour éviter de créer explicitement des instances d'objet en utilisant l'opérateur JavaScript `new` :

```js [ESM]
const obj = addon.createObject();
// au lieu de :
// const obj = new addon.Object();
```
Premièrement, la méthode `createObject()` est implémentée dans `addon.cc` :

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
Dans `myobject.h`, la méthode statique `NewInstance()` est ajoutée pour gérer l'instanciation de l'objet. Cette méthode remplace l'utilisation de `new` en JavaScript :

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
L'implémentation dans `myobject.cc` est similaire à l'exemple précédent :

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
Encore une fois, pour construire cet exemple, le fichier `myobject.cc` doit être ajouté au `binding.gyp` :

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
Testez-le avec :

```js [ESM]
// test.js
const createObject = require('./build/Release/addon');

const obj = createObject(10);
console.log(obj.plusOne());
// Affiche : 11
console.log(obj.plusOne());
// Affiche : 12
console.log(obj.plusOne());
// Affiche : 13

const obj2 = createObject(20);
console.log(obj2.plusOne());
// Affiche : 21
console.log(obj2.plusOne());
// Affiche : 22
console.log(obj2.plusOne());
// Affiche : 23
```

### Transmission d'objets encapsulés {#passing-wrapped-objects-around}

En plus d'encapsuler et de renvoyer des objets C++, il est possible de transmettre des objets encapsulés en les désencapsulant avec la fonction d'assistance Node.js `node::ObjectWrap::Unwrap`. L'exemple suivant montre une fonction `add()` qui peut prendre deux objets `MyObject` comme arguments d'entrée :

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
Dans `myobject.h`, une nouvelle méthode publique est ajoutée pour permettre l'accès aux valeurs privées après le désencapsulage de l'objet.

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
L'implémentation de `myobject.cc` reste similaire à la version précédente :

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
Testez avec :

```js [ESM]
// test.js
const addon = require('./build/Release/addon');

const obj1 = addon.createObject(10);
const obj2 = addon.createObject(20);
const result = addon.add(obj1, obj2);

console.log(result);
// Prints: 30
```

