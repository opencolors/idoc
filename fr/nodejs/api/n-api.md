---
title: Documentation de l'API N de Node.js
description: L'API N (Node.js API) fournit une interface stable et cohérente pour les modules natifs, permettant aux développeurs de créer des modules compatibles avec différentes versions de Node.js.
head:
  - - meta
    - name: og:title
      content: Documentation de l'API N de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: L'API N (Node.js API) fournit une interface stable et cohérente pour les modules natifs, permettant aux développeurs de créer des modules compatibles avec différentes versions de Node.js.
  - - meta
    - name: twitter:title
      content: Documentation de l'API N de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: L'API N (Node.js API) fournit une interface stable et cohérente pour les modules natifs, permettant aux développeurs de créer des modules compatibles avec différentes versions de Node.js.
---


# Node-API {#node-api}

::: tip [Stable: 2 - Stable]
[Stable: 2](/fr/nodejs/api/documentation#stability-index) [Stability: 2](/fr/nodejs/api/documentation#stability-index) - Stable
:::

Node-API (anciennement N-API) est une API pour construire des Addons natifs. Elle est indépendante de l'environnement d'exécution JavaScript sous-jacent (par exemple, V8) et est maintenue dans le cadre de Node.js lui-même. Cette API sera Application Binary Interface (ABI) stable à travers les versions de Node.js. Elle est destinée à isoler les addons des changements dans le moteur JavaScript sous-jacent et à permettre aux modules compilés pour une version majeure de fonctionner sur les versions majeures ultérieures de Node.js sans recompilation. Le guide [Stabilité ABI](https://nodejs.org/en/docs/guides/abi-stability/) fournit une explication plus approfondie.

Les addons sont construits/packagés avec la même approche/outils décrits dans la section intitulée [Addons C++](/fr/nodejs/api/addons). La seule différence est l'ensemble des API utilisées par le code natif. Au lieu d'utiliser les API V8 ou [Native Abstractions for Node.js](https://github.com/nodejs/nan), les fonctions disponibles dans Node-API sont utilisées.

Les API exposées par Node-API sont généralement utilisées pour créer et manipuler des valeurs JavaScript. Les concepts et les opérations correspondent généralement aux idées spécifiées dans la spécification de langage ECMA-262. Les API ont les propriétés suivantes :

- Tous les appels Node-API renvoient un code d'état de type `napi_status`. Cet état indique si l'appel API a réussi ou échoué.
- La valeur de retour de l'API est passée via un paramètre out.
- Toutes les valeurs JavaScript sont abstraites derrière un type opaque nommé `napi_value`.
- En cas de code d'état d'erreur, des informations supplémentaires peuvent être obtenues en utilisant `napi_get_last_error_info`. Vous trouverez plus d'informations dans la section sur la gestion des erreurs [Gestion des erreurs](/fr/nodejs/api/n-api#error-handling).

Node-API est une API C qui assure la stabilité de l'ABI entre les versions de Node.js et les différents niveaux de compilateur. Une API C++ peut être plus facile à utiliser. Pour prendre en charge l'utilisation de C++, le projet maintient un module wrapper C++ appelé [`node-addon-api`](https://github.com/nodejs/node-addon-api). Ce wrapper fournit une API C++ inlinable. Les binaires construits avec `node-addon-api` dépendront des symboles des fonctions Node-API basées sur C exportées par Node.js. `node-addon-api` est une façon plus efficace d'écrire du code qui appelle Node-API. Prenez, par exemple, le code `node-addon-api` suivant. La première section montre le code `node-addon-api` et la deuxième section montre ce qui est réellement utilisé dans l'addon.

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
Le résultat final est que l'addon utilise uniquement les API C exportées. Par conséquent, il bénéficie toujours des avantages de la stabilité ABI fournie par l'API C.

Lorsque vous utilisez `node-addon-api` au lieu des API C, commencez par la [documentation](https://github.com/nodejs/node-addon-api#api-documentation) de l'API pour `node-addon-api`.

La [Ressource Node-API](https://nodejs.github.io/node-addon-examples/) offre une excellente orientation et des conseils aux développeurs qui débutent avec Node-API et `node-addon-api`. Des ressources média supplémentaires peuvent être trouvées sur la page [Node-API Media](https://github.com/nodejs/abi-stable-node/blob/HEAD/node-api-media.md).


## Implications de la stabilité de l'ABI {#implications-of-abi-stability}

Bien que Node-API fournisse une garantie de stabilité de l'ABI, d'autres parties de Node.js n'en fournissent pas, et les bibliothèques externes utilisées à partir de l'addon peuvent ne pas en fournir non plus. En particulier, aucune des API suivantes ne fournit une garantie de stabilité de l'ABI entre les versions majeures :

-  les API C++ de Node.js disponibles via 
-  les API libuv qui sont également incluses dans Node.js et disponibles via 
-  l'API V8 disponible via 

Ainsi, pour qu'un addon reste compatible ABI entre les versions majeures de Node.js, il doit utiliser Node-API exclusivement en se limitant à l'utilisation de

```C [C]
#include <node_api.h>
```
et en vérifiant, pour toutes les bibliothèques externes qu'il utilise, que la bibliothèque externe offre des garanties de stabilité de l'ABI similaires à Node-API.

## Compilation {#building}

Contrairement aux modules écrits en JavaScript, le développement et le déploiement d'addons natifs Node.js à l'aide de Node-API nécessitent un ensemble d'outils supplémentaires. Outre les outils de base nécessaires au développement pour Node.js, le développeur d'addons natifs a besoin d'une chaîne d'outils capable de compiler du code C et C++ en un binaire. De plus, selon la façon dont l'addon natif est déployé, l'*utilisateur* de l'addon natif devra également avoir installé une chaîne d'outils C/C++.

Pour les développeurs Linux, les packages d'outils C/C++ nécessaires sont facilement disponibles. [GCC](https://gcc.gnu.org/) est largement utilisé dans la communauté Node.js pour compiler et tester sur une variété de plateformes. Pour de nombreux développeurs, l'infrastructure de compilation [LLVM](https://llvm.org/) est également un bon choix.

Pour les développeurs Mac, [Xcode](https://developer.apple.com/xcode/) offre tous les outils de compilation nécessaires. Cependant, il n'est pas nécessaire d'installer l'IDE Xcode en entier. La commande suivante installe la chaîne d'outils nécessaire :

```bash [BASH]
xcode-select --install
```
Pour les développeurs Windows, [Visual Studio](https://visualstudio.microsoft.com/) offre tous les outils de compilation nécessaires. Cependant, il n'est pas nécessaire d'installer l'IDE Visual Studio en entier. La commande suivante installe la chaîne d'outils nécessaire :

```bash [BASH]
npm install --global windows-build-tools
```
Les sections ci-dessous décrivent les outils supplémentaires disponibles pour le développement et le déploiement d'addons natifs Node.js.


### Outils de construction {#build-tools}

Les deux outils énumérés ici exigent que les *utilisateurs* de l'extension native aient une chaîne d'outils C/C++ installée afin de pouvoir installer l'extension native avec succès.

#### node-gyp {#node-gyp}

[node-gyp](https://github.com/nodejs/node-gyp) est un système de construction basé sur le fork [gyp-next](https://github.com/nodejs/gyp-next) de l'outil [GYP](https://gyp.gsrc.io/) de Google et est fourni avec npm. GYP, et donc node-gyp, exige que Python soit installé.

Historiquement, node-gyp a été l'outil de choix pour la construction d'extensions natives. Il est largement adopté et documenté. Cependant, certains développeurs ont rencontré des limitations dans node-gyp.

#### CMake.js {#cmakejs}

[CMake.js](https://github.com/cmake-js/cmake-js) est un système de construction alternatif basé sur [CMake](https://cmake.org/).

CMake.js est un bon choix pour les projets qui utilisent déjà CMake ou pour les développeurs affectés par les limitations de node-gyp. [`build_with_cmake`](https://github.com/nodejs/node-addon-examples/tree/main/src/8-tooling/build_with_cmake) est un exemple de projet d'extension native basé sur CMake.

### Téléchargement de binaires précompilés {#uploading-precompiled-binaries}

Les trois outils énumérés ici permettent aux développeurs et mainteneurs d'extensions natives de créer et de télécharger des binaires vers des serveurs publics ou privés. Ces outils sont généralement intégrés à des systèmes de construction CI/CD tels que [Travis CI](https://travis-ci.org/) et [AppVeyor](https://www.appveyor.com/) pour construire et télécharger des binaires pour une variété de plateformes et d'architectures. Ces binaires sont ensuite disponibles au téléchargement pour les utilisateurs qui n'ont pas besoin d'avoir une chaîne d'outils C/C++ installée.

#### node-pre-gyp {#node-pre-gyp}

[node-pre-gyp](https://github.com/mapbox/node-pre-gyp) est un outil basé sur node-gyp qui ajoute la possibilité de télécharger des binaires vers un serveur au choix du développeur. node-pre-gyp a un support particulièrement bon pour le téléchargement de binaires vers Amazon S3.

#### prebuild {#prebuild}

[prebuild](https://github.com/prebuild/prebuild) est un outil qui prend en charge les constructions utilisant node-gyp ou CMake.js. Contrairement à node-pre-gyp qui prend en charge une variété de serveurs, prebuild ne télécharge les binaires que vers les [publications GitHub](https://help.github.com/en/github/administering-a-repository/about-releases). prebuild est un bon choix pour les projets GitHub utilisant CMake.js.


#### prebuildify {#prebuildify}

[prebuildify](https://github.com/prebuild/prebuildify) est un outil basé sur node-gyp. L'avantage de prebuildify est que les binaires construits sont regroupés avec l'addon natif lors de son chargement sur npm. Les binaires sont téléchargés depuis npm et sont immédiatement disponibles pour l'utilisateur du module lors de l'installation de l'addon natif.

## Utilisation {#usage}

Pour utiliser les fonctions Node-API, incluez le fichier [`node_api.h`](https://github.com/nodejs/node/blob/HEAD/src/node_api.h) qui se trouve dans le répertoire src de l'arborescence de développement de Node :

```C [C]
#include <node_api.h>
```
Cela optera pour la valeur `NAPI_VERSION` par défaut pour la version donnée de Node.js. Afin d'assurer la compatibilité avec des versions spécifiques de Node-API, la version peut être spécifiée explicitement lors de l'inclusion de l'en-tête :

```C [C]
#define NAPI_VERSION 3
#include <node_api.h>
```
Cela limite la surface de Node-API à la seule fonctionnalité disponible dans les versions spécifiées (et antérieures).

Une partie de la surface de Node-API est expérimentale et nécessite une activation explicite :

```C [C]
#define NAPI_EXPERIMENTAL
#include <node_api.h>
```
Dans ce cas, toute la surface de l'API, y compris les API expérimentales, sera disponible pour le code du module.

Occasionnellement, des fonctionnalités expérimentales sont introduites qui affectent les API déjà publiées et stables. Ces fonctionnalités peuvent être désactivées par une option de désactivation :

```C [C]
#define NAPI_EXPERIMENTAL
#define NODE_API_EXPERIMENTAL_<FEATURE_NAME>_OPT_OUT
#include <node_api.h>
```
où `\<FEATURE_NAME\>` est le nom d'une fonctionnalité expérimentale qui affecte à la fois les API expérimentales et stables.

## Matrice des versions de Node-API {#node-api-version-matrix}

Jusqu'à la version 9, les versions de Node-API étaient additives et versionnées indépendamment de Node.js. Cela signifiait que chaque version était une extension de la version précédente en ce sens qu'elle avait toutes les API de la version précédente avec quelques ajouts. Chaque version de Node.js ne supportait qu'une seule version de Node-API. Par exemple, v18.15.0 ne supporte que la version 8 de Node-API. La stabilité de l'ABI a été atteinte car la version 8 était un sur-ensemble strict de toutes les versions précédentes.

À partir de la version 9, bien que les versions de Node-API continuent d'être versionnées indépendamment, un addon qui fonctionnait avec la version 9 de Node-API peut nécessiter des mises à jour de code pour fonctionner avec la version 10 de Node-API. La stabilité de l'ABI est maintenue, cependant, car les versions de Node.js qui prennent en charge les versions de Node-API supérieures à 8 prendront en charge toutes les versions entre 8 et la version la plus élevée qu'elles prennent en charge et fourniront par défaut les API de la version 8, à moins qu'un addon n'opte pour une version de Node-API supérieure. Cette approche offre la flexibilité de mieux optimiser les fonctions Node-API existantes tout en maintenant la stabilité de l'ABI. Les addons existants peuvent continuer à fonctionner sans recompilation en utilisant une version antérieure de Node-API. Si un addon a besoin de fonctionnalités d'une version plus récente de Node-API, des modifications du code existant et une recompilation seront nécessaires pour utiliser ces nouvelles fonctions de toute façon.

Dans les versions de Node.js qui prennent en charge la version 9 de Node-API et les versions ultérieures, la définition de `NAPI_VERSION=X` et l'utilisation des macros d'initialisation d'addon existantes intégreront la version de Node-API demandée qui sera utilisée lors de l'exécution dans l'addon. Si `NAPI_VERSION` n'est pas défini, la valeur par défaut sera 8.

Ce tableau peut ne pas être à jour dans les anciens flux, les informations les plus récentes se trouvent dans la dernière documentation de l'API dans : [Matrice des versions de Node-API](/fr/nodejs/api/n-api#node-api-version-matrix)

| Version de Node-API | Prise en charge dans |
|---|---|
| 9 | v18.17.0+, 20.3.0+, 21.0.0 et toutes les versions ultérieures |
| 8 | v12.22.0+, v14.17.0+, v15.12.0+, 16.0.0 et toutes les versions ultérieures |
| 7 | v10.23.0+, v12.19.0+, v14.12.0+, 15.0.0 et toutes les versions ultérieures |
| 6 | v10.20.0+, v12.17.0+, 14.0.0 et toutes les versions ultérieures |
| 5 | v10.17.0+, v12.11.0+, 13.0.0 et toutes les versions ultérieures |
| 4 | v10.16.0+, v11.8.0+, 12.0.0 et toutes les versions ultérieures |
| 3 | v6.14.2*, 8.11.2+, v9.11.0+*, 10.0.0 et toutes les versions ultérieures |
| 2 | v8.10.0+*, v9.3.0+*, 10.0.0 et toutes les versions ultérieures |
| 1 | v8.6.0+**, v9.0.0+*, 10.0.0 et toutes les versions ultérieures |
* Node-API était expérimental.

** Node.js 8.0.0 incluait Node-API comme expérimental. Il a été publié en tant que version 1 de Node-API, mais a continué d'évoluer jusqu'à Node.js 8.6.0. L'API est différente dans les versions antérieures à Node.js 8.6.0. Nous recommandons la version 3 ou ultérieure de Node-API.

Chaque API documentée pour Node-API aura un en-tête nommé `added in :`, et les API qui sont stables auront l'en-tête supplémentaire `Node-API version :`. Les API sont directement utilisables lorsque vous utilisez une version de Node.js qui prend en charge la version de Node-API affichée dans `Node-API version :` ou une version supérieure. Lorsque vous utilisez une version de Node.js qui ne prend pas en charge la `Node-API version :` répertoriée ou s'il n'y a pas de `Node-API version :` répertoriée, alors l'API ne sera disponible que si `#define NAPI_EXPERIMENTAL` précède l'inclusion de `node_api.h` ou `js_native_api.h`. Si une API semble ne pas être disponible sur une version de Node.js qui est ultérieure à celle indiquée dans `added in :`, c'est très probablement la raison de l'absence apparente.

Les Node-API associés strictement à l'accès aux fonctionnalités ECMAScript à partir du code natif se trouvent séparément dans `js_native_api.h` et `js_native_api_types.h`. Les API définies dans ces en-têtes sont incluses dans `node_api.h` et `node_api_types.h`. Les en-têtes sont structurés de cette manière afin de permettre les implémentations de Node-API en dehors de Node.js. Pour ces implémentations, les API spécifiques à Node.js peuvent ne pas être applicables.

Les parties spécifiques à Node.js d'un addon peuvent être séparées du code qui expose la fonctionnalité réelle à l'environnement JavaScript afin que ce dernier puisse être utilisé avec plusieurs implémentations de Node-API. Dans l'exemple ci-dessous, `addon.c` et `addon.h` se réfèrent uniquement à `js_native_api.h`. Cela garantit que `addon.c` peut être réutilisé pour être compilé avec l'implémentation Node.js de Node-API ou avec toute implémentation de Node-API en dehors de Node.js.

`addon_node.c` est un fichier séparé qui contient le point d'entrée spécifique à Node.js de l'addon et qui instancie l'addon en appelant `addon.c` lorsque l'addon est chargé dans un environnement Node.js.

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

## API de cycle de vie de l'environnement {#environment-life-cycle-apis}

La [Section 8.7](https://tc39.es/ecma262/#sec-agents) de la [Spécification du langage ECMAScript](https://tc39.github.io/ecma262/) définit le concept d'"Agent" comme un environnement autonome dans lequel le code JavaScript s'exécute. Plusieurs de ces Agents peuvent être démarrés et arrêtés simultanément ou séquentiellement par le processus.

Un environnement Node.js correspond à un Agent ECMAScript. Dans le processus principal, un environnement est créé au démarrage, et des environnements supplémentaires peuvent être créés sur des threads séparés pour servir de [threads de worker](https://nodejs.org/api/worker_threads). Lorsque Node.js est intégré dans une autre application, le thread principal de l'application peut également construire et détruire un environnement Node.js plusieurs fois pendant le cycle de vie du processus de l'application, de sorte que chaque environnement Node.js créé par l'application puisse, à son tour, pendant son cycle de vie, créer et détruire des environnements supplémentaires en tant que threads de worker.

Du point de vue d'un addon natif, cela signifie que les liaisons qu'il fournit peuvent être appelées plusieurs fois, à partir de plusieurs contextes, et même simultanément à partir de plusieurs threads.

Les addons natifs peuvent avoir besoin d'allouer un état global qu'ils utilisent pendant leur cycle de vie d'un environnement Node.js, de sorte que l'état puisse être unique à chaque instance de l'addon.

À cette fin, Node-API fournit un moyen d'associer des données de sorte que leur cycle de vie soit lié au cycle de vie d'un environnement Node.js.

### `napi_set_instance_data` {#napi_set_instance_data}

**Ajouté dans : v12.8.0, v10.20.0**

**Version N-API : 6**

```C [C]
napi_status napi_set_instance_data(node_api_basic_env env,
                                   void* data,
                                   napi_finalize finalize_cb,
                                   void* finalize_hint);
```
- `[in] env` : L'environnement dans lequel l'appel Node-API est invoqué.
- `[in] data` : L'élément de données à mettre à la disposition des liaisons de cette instance.
- `[in] finalize_cb` : La fonction à appeler lorsque l'environnement est en cours de démolition. La fonction reçoit `data` afin qu'elle puisse la libérer. [`napi_finalize`](/fr/nodejs/api/n-api#napi_finalize) fournit plus de détails.
- `[in] finalize_hint` : Indication facultative à transmettre au callback de finalisation lors de la collecte.

Renvoie `napi_ok` si l'API a réussi.

Cette API associe `data` à l'environnement Node.js en cours d'exécution. `data` peut être récupéré ultérieurement à l'aide de `napi_get_instance_data()`. Toutes les données existantes associées à l'environnement Node.js en cours d'exécution qui ont été définies par un appel précédent à `napi_set_instance_data()` seront écrasées. Si un `finalize_cb` a été fourni par l'appel précédent, il ne sera pas appelé.


### `napi_get_instance_data` {#napi_get_instance_data}

**Ajouté dans : v12.8.0, v10.20.0**

**Version N-API : 6**

```C [C]
napi_status napi_get_instance_data(node_api_basic_env env,
                                   void** data);
```
- `[in] env` : L’environnement sous lequel l’appel Node-API est invoqué.
- `[out] data` : L’élément de données qui a été précédemment associé à l’environnement Node.js en cours d’exécution par un appel à `napi_set_instance_data()`.

Retourne `napi_ok` si l’API a réussi.

Cette API récupère les données qui ont été précédemment associées à l’environnement Node.js en cours d’exécution via `napi_set_instance_data()`. Si aucune donnée n’est définie, l’appel réussira et `data` sera défini sur `NULL`.

## Types de données Node-API de base {#basic-node-api-data-types}

Node-API expose les types de données fondamentaux suivants en tant qu’abstractions qui sont consommées par les diverses API. Ces API doivent être traitées comme opaques, introspectables uniquement avec d’autres appels Node-API.

### `napi_status` {#napi_status}

**Ajouté dans : v8.0.0**

**Version N-API : 1**

Code d’état intégral indiquant le succès ou l’échec d’un appel Node-API. Actuellement, les codes d’état suivants sont pris en charge.

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
  napi_would_deadlock,  /* non utilisé */
  napi_no_external_buffers_allowed,
  napi_cannot_run_js
} napi_status;
```
Si des informations supplémentaires sont nécessaires lorsqu’une API renvoie un état d’échec, elles peuvent être obtenues en appelant `napi_get_last_error_info`.

### `napi_extended_error_info` {#napi_extended_error_info}

**Ajouté dans : v8.0.0**

**Version N-API : 1**

```C [C]
typedef struct {
  const char* error_message;
  void* engine_reserved;
  uint32_t engine_error_code;
  napi_status error_code;
} napi_extended_error_info;
```
- `error_message` : Chaîne encodée en UTF8 contenant une description de l’erreur neutre pour la VM.
- `engine_reserved` : Réservé aux détails d’erreur spécifiques à la VM. Ceci n’est actuellement implémenté pour aucune VM.
- `engine_error_code` : Code d’erreur spécifique à la VM. Ceci n’est actuellement implémenté pour aucune VM.
- `error_code` : Le code d’état Node-API qui est à l’origine de la dernière erreur.

Voir la section [Gestion des erreurs](/fr/nodejs/api/n-api#error-handling) pour plus d’informations.


### `napi_env` {#napi_env}

`napi_env` est utilisé pour représenter un contexte que l'implémentation Node-API sous-jacente peut utiliser pour conserver l'état spécifique à la VM. Cette structure est passée aux fonctions natives lorsqu'elles sont invoquées, et elle doit être renvoyée lors des appels Node-API. Plus précisément, le même `napi_env` qui a été passé lors de l'appel initial de la fonction native doit être passé à tous les appels Node-API imbriqués ultérieurs. La mise en cache de `napi_env` à des fins de réutilisation générale, et le passage de `napi_env` entre des instances du même addon s'exécutant sur différents threads [`Worker`](/fr/nodejs/api/worker_threads#class-worker) ne sont pas autorisés. Le `napi_env` devient invalide lorsqu'une instance d'un addon natif est déchargée. La notification de cet événement est fournie via les rappels transmis à [`napi_add_env_cleanup_hook`](/fr/nodejs/api/n-api#napi_add_env_cleanup_hook) et [`napi_set_instance_data`](/fr/nodejs/api/n-api#napi_set_instance_data).

### `node_api_basic_env` {#node_api_basic_env}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stability: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

Cette variante de `napi_env` est passée aux finaliseurs synchrones ([`node_api_basic_finalize`](/fr/nodejs/api/n-api#node_api_basic_finalize)). Il existe un sous-ensemble de Node-APIs qui acceptent un paramètre de type `node_api_basic_env` comme premier argument. Ces APIs n'accèdent pas à l'état du moteur JavaScript et sont donc sûres à appeler à partir de finaliseurs synchrones. Il est permis de passer un paramètre de type `napi_env` à ces APIs, cependant, il n'est pas permis de passer un paramètre de type `node_api_basic_env` aux APIs qui accèdent à l'état du moteur JavaScript. Tenter de le faire sans un cast produira un avertissement de compilateur ou une erreur lorsque des add-ons sont compilés avec des drapeaux qui les amènent à émettre des avertissements et/ou des erreurs lorsque des types de pointeurs incorrects sont passés dans une fonction. L'appel de telles APIs à partir d'un finaliseur synchrone entraînera finalement la terminaison de l'application.

### `napi_value` {#napi_value}

Ceci est un pointeur opaque qui est utilisé pour représenter une valeur JavaScript.


### `napi_threadsafe_function` {#napi_threadsafe_function}

**Ajouté dans : v10.6.0**

**Version N-API : 4**

C'est un pointeur opaque qui représente une fonction JavaScript qui peut être appelée de manière asynchrone à partir de plusieurs threads via `napi_call_threadsafe_function()`.

### `napi_threadsafe_function_release_mode` {#napi_threadsafe_function_release_mode}

**Ajouté dans : v10.6.0**

**Version N-API : 4**

Une valeur à donner à `napi_release_threadsafe_function()` pour indiquer si la fonction thread-safe doit être fermée immédiatement (`napi_tsfn_abort`) ou simplement libérée (`napi_tsfn_release`) et donc disponible pour une utilisation ultérieure via `napi_acquire_threadsafe_function()` et `napi_call_threadsafe_function()`.

```C [C]
typedef enum {
  napi_tsfn_release,
  napi_tsfn_abort
} napi_threadsafe_function_release_mode;
```
### `napi_threadsafe_function_call_mode` {#napi_threadsafe_function_call_mode}

**Ajouté dans : v10.6.0**

**Version N-API : 4**

Une valeur à donner à `napi_call_threadsafe_function()` pour indiquer si l'appel doit bloquer chaque fois que la file d'attente associée à la fonction thread-safe est pleine.

```C [C]
typedef enum {
  napi_tsfn_nonblocking,
  napi_tsfn_blocking
} napi_threadsafe_function_call_mode;
```
### Types de gestion de la mémoire de Node-API {#node-api-memory-management-types}

#### `napi_handle_scope` {#napi_handle_scope}

Il s'agit d'une abstraction utilisée pour contrôler et modifier la durée de vie des objets créés dans une portée particulière. En général, les valeurs Node-API sont créées dans le contexte d'une portée de handle. Lorsqu'une méthode native est appelée depuis JavaScript, une portée de handle par défaut existera. Si l'utilisateur ne crée pas explicitement une nouvelle portée de handle, les valeurs Node-API seront créées dans la portée de handle par défaut. Pour tout appel de code en dehors de l'exécution d'une méthode native (par exemple, lors d'un appel de callback libuv), le module doit créer une portée avant d'appeler toute fonction susceptible d'entraîner la création de valeurs JavaScript.

Les portées de handle sont créées à l'aide de [`napi_open_handle_scope`](/fr/nodejs/api/n-api#napi_open_handle_scope) et sont détruites à l'aide de [`napi_close_handle_scope`](/fr/nodejs/api/n-api#napi_close_handle_scope). La fermeture de la portée peut indiquer au GC que toutes les `napi_value` créées pendant la durée de vie de la portée du handle ne sont plus référencées depuis la frame de pile actuelle.

Pour plus de détails, consultez la section [Gestion de la durée de vie des objets](/fr/nodejs/api/n-api#object-lifetime-management).


#### `napi_escapable_handle_scope` {#napi_escapable_handle_scope}

**Ajoutée dans : v8.0.0**

**Version N-API : 1**

Les portées de gestionnaire échappables sont un type spécial de portée de gestionnaire permettant de renvoyer des valeurs créées dans une portée de gestionnaire particulière à une portée parente.

#### `napi_ref` {#napi_ref}

**Ajoutée dans : v8.0.0**

**Version N-API : 1**

Il s'agit de l'abstraction à utiliser pour référencer un `napi_value`. Cela permet aux utilisateurs de gérer la durée de vie des valeurs JavaScript, y compris de définir explicitement leurs durées de vie minimales.

Pour plus de détails, consultez la section [Gestion de la durée de vie des objets](/fr/nodejs/api/n-api#object-lifetime-management).

#### `napi_type_tag` {#napi_type_tag}

**Ajoutée dans : v14.8.0, v12.19.0**

**Version N-API : 8**

Une valeur de 128 bits stockée sous forme de deux entiers non signés de 64 bits. Elle sert d'UUID avec lequel les objets JavaScript ou les [externals](/fr/nodejs/api/n-api#napi_create_external) peuvent être « étiquetés » afin de s'assurer qu'ils sont d'un certain type. Il s'agit d'un contrôle plus strict que [`napi_instanceof`](/fr/nodejs/api/n-api#napi_instanceof), car ce dernier peut signaler un faux positif si le prototype de l'objet a été manipulé. L'étiquetage de type est plus utile en conjonction avec [`napi_wrap`](/fr/nodejs/api/n-api#napi_wrap) car il garantit que le pointeur récupéré à partir d'un objet enveloppé peut être converti en toute sécurité vers le type natif correspondant à l'étiquette de type qui avait été précédemment appliquée à l'objet JavaScript.

```C [C]
typedef struct {
  uint64_t lower;
  uint64_t upper;
} napi_type_tag;
```
#### `napi_async_cleanup_hook_handle` {#napi_async_cleanup_hook_handle}

**Ajoutée dans : v14.10.0, v12.19.0**

Une valeur opaque renvoyée par [`napi_add_async_cleanup_hook`](/fr/nodejs/api/n-api#napi_add_async_cleanup_hook). Elle doit être passée à [`napi_remove_async_cleanup_hook`](/fr/nodejs/api/n-api#napi_remove_async_cleanup_hook) lorsque la chaîne d'événements de nettoyage asynchrones est terminée.

### Types de rappels Node-API {#node-api-callback-types}

#### `napi_callback_info` {#napi_callback_info}

**Ajoutée dans : v8.0.0**

**Version N-API : 1**

Type de données opaque qui est passé à une fonction de rappel. Il peut être utilisé pour obtenir des informations supplémentaires sur le contexte dans lequel le rappel a été invoqué.

#### `napi_callback` {#napi_callback}

**Ajoutée dans : v8.0.0**

**Version N-API : 1**

Type de pointeur de fonction pour les fonctions natives fournies par l'utilisateur qui doivent être exposées à JavaScript via Node-API. Les fonctions de rappel doivent respecter la signature suivante :

```C [C]
typedef napi_value (*napi_callback)(napi_env, napi_callback_info);
```
Sauf pour les raisons évoquées dans [Gestion de la durée de vie des objets](/fr/nodejs/api/n-api#object-lifetime-management), il n'est pas nécessaire de créer une portée de gestionnaire et/ou de rappel à l'intérieur d'un `napi_callback`.


#### `node_api_basic_finalize` {#node_api_basic_finalize}

**Ajouté dans : v21.6.0, v20.12.0, v18.20.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

Type de pointeur de fonction pour les fonctions fournies par l'addon qui permettent à l'utilisateur d'être notifié lorsque les données appartenant à l'extérieur sont prêtes à être nettoyées car l'objet auquel elles étaient associées a été collecté par le garbage collector. L'utilisateur doit fournir une fonction satisfaisant la signature suivante qui serait appelée lors de la collecte de l'objet. Actuellement, `node_api_basic_finalize` peut être utilisé pour savoir quand les objets qui ont des données externes sont collectés.

```C [C]
typedef void (*node_api_basic_finalize)(node_api_basic_env env,
                                      void* finalize_data,
                                      void* finalize_hint);
```
Sauf pour les raisons évoquées dans [Gestion de la durée de vie des objets](/fr/nodejs/api/n-api#object-lifetime-management), il n'est pas nécessaire de créer un handle et/ou une portée de rappel dans le corps de la fonction.

Étant donné que ces fonctions peuvent être appelées alors que le moteur JavaScript est dans un état où il ne peut pas exécuter de code JavaScript, seules les API Node qui acceptent un `node_api_basic_env` comme premier paramètre peuvent être appelées. [`node_api_post_finalizer`](/fr/nodejs/api/n-api#node_api_post_finalizer) peut être utilisé pour planifier les appels d'API Node qui nécessitent un accès à l'état du moteur JavaScript pour s'exécuter une fois le cycle actuel de garbage collection terminé.

Dans le cas de [`node_api_create_external_string_latin1`](/fr/nodejs/api/n-api#node_api_create_external_string_latin1) et [`node_api_create_external_string_utf16`](/fr/nodejs/api/n-api#node_api_create_external_string_utf16), le paramètre `env` peut être nul, car les chaînes externes peuvent être collectées lors de la dernière partie de l'arrêt de l'environnement.

Historique des modifications :

-  expérimental (`NAPI_EXPERIMENTAL`) : Seuls les appels Node-API qui acceptent un `node_api_basic_env` comme premier paramètre peuvent être appelés, sinon l'application sera interrompue avec un message d'erreur approprié. Cette fonctionnalité peut être désactivée en définissant `NODE_API_EXPERIMENTAL_BASIC_ENV_OPT_OUT`.


#### `napi_finalize` {#napi_finalize}

**Ajouté dans : v8.0.0**

**Version N-API : 1**

Type de pointeur de fonction pour la fonction fournie par l'add-on qui permet à l'utilisateur de planifier un groupe d'appels aux API Node en réponse à un événement de garbage collection, une fois le cycle de garbage collection terminé. Ces pointeurs de fonction peuvent être utilisés avec [`node_api_post_finalizer`](/fr/nodejs/api/n-api#node_api_post_finalizer).

```C [C]
typedef void (*napi_finalize)(napi_env env,
                              void* finalize_data,
                              void* finalize_hint);
```
Historique des modifications :

- expérimental (`NAPI_EXPERIMENTAL` est défini) : Une fonction de ce type ne peut plus être utilisée comme finaliseur, sauf avec [`node_api_post_finalizer`](/fr/nodejs/api/n-api#node_api_post_finalizer). [`node_api_basic_finalize`](/fr/nodejs/api/n-api#node_api_basic_finalize) doit être utilisé à la place. Cette fonctionnalité peut être désactivée en définissant `NODE_API_EXPERIMENTAL_BASIC_ENV_OPT_OUT`.

#### `napi_async_execute_callback` {#napi_async_execute_callback}

**Ajouté dans : v8.0.0**

**Version N-API : 1**

Pointeur de fonction utilisé avec les fonctions qui prennent en charge les opérations asynchrones. Les fonctions de rappel doivent satisfaire la signature suivante :

```C [C]
typedef void (*napi_async_execute_callback)(napi_env env, void* data);
```
Les implémentations de cette fonction doivent éviter de faire des appels Node-API qui exécutent du JavaScript ou interagissent avec des objets JavaScript. Les appels Node-API doivent plutôt se trouver dans `napi_async_complete_callback`. N'utilisez pas le paramètre `napi_env`, car cela entraînerait probablement l'exécution de JavaScript.

#### `napi_async_complete_callback` {#napi_async_complete_callback}

**Ajouté dans : v8.0.0**

**Version N-API : 1**

Pointeur de fonction utilisé avec les fonctions qui prennent en charge les opérations asynchrones. Les fonctions de rappel doivent satisfaire la signature suivante :

```C [C]
typedef void (*napi_async_complete_callback)(napi_env env,
                                             napi_status status,
                                             void* data);
```
Sauf pour les raisons évoquées dans [Gestion de la durée de vie des objets](/fr/nodejs/api/n-api#object-lifetime-management), il n'est pas nécessaire de créer un descripteur et/ou une portée de rappel dans le corps de la fonction.


#### `napi_threadsafe_function_call_js` {#napi_threadsafe_function_call_js}

**Ajouté dans : v10.6.0**

**Version N-API : 4**

Pointeur de fonction utilisé avec les appels de fonction asynchrones thread-safe. Le rappel sera appelé sur le thread principal. Son but est d'utiliser un élément de données arrivant via la file d'attente depuis l'un des threads secondaires pour construire les paramètres nécessaires pour un appel dans JavaScript, généralement via `napi_call_function`, puis d'effectuer l'appel dans JavaScript.

Les données arrivant depuis le thread secondaire via la file d'attente sont données dans le paramètre `data` et la fonction JavaScript à appeler est donnée dans le paramètre `js_callback`.

Node-API configure l'environnement avant d'appeler ce rappel, il est donc suffisant d'appeler la fonction JavaScript via `napi_call_function` plutôt que via `napi_make_callback`.

Les fonctions de rappel doivent satisfaire la signature suivante :

```C [C]
typedef void (*napi_threadsafe_function_call_js)(napi_env env,
                                                 napi_value js_callback,
                                                 void* context,
                                                 void* data);
```
- `[in] env` : l’environnement à utiliser pour les appels d’API, ou `NULL` si la fonction thread-safe est en cours de suppression et que les `data` doivent être libérées.
- `[in] js_callback` : la fonction JavaScript à appeler, ou `NULL` si la fonction thread-safe est en cours de suppression et que les `data` doivent être libérées. Elle peut aussi être `NULL` si la fonction thread-safe a été créée sans `js_callback`.
- `[in] context` : les données facultatives avec lesquelles la fonction thread-safe a été créée.
- `[in] data` : données créées par le thread secondaire. Il incombe au rappel de convertir ces données natives en valeurs JavaScript (avec les fonctions Node-API) qui peuvent être transmises comme paramètres lors de l’invocation de `js_callback`. Ce pointeur est entièrement géré par les threads et ce rappel. Ainsi, ce rappel doit libérer les données.

À moins que pour des raisons évoquées dans [Gestion de la durée de vie des objets](/fr/nodejs/api/n-api#object-lifetime-management), il n'est pas nécessaire de créer une portée de handle et/ou de rappel dans le corps de la fonction.


#### `napi_cleanup_hook` {#napi_cleanup_hook}

**Ajouté dans : v19.2.0, v18.13.0**

**Version N-API : 3**

Pointeur de fonction utilisé avec [`napi_add_env_cleanup_hook`](/fr/nodejs/api/n-api#napi_add_env_cleanup_hook). Il sera appelé lorsque l'environnement sera détruit.

Les fonctions de rappel doivent satisfaire la signature suivante :

```C [C]
typedef void (*napi_cleanup_hook)(void* data);
```
- `[in] data` : les données qui ont été passées à [`napi_add_env_cleanup_hook`](/fr/nodejs/api/n-api#napi_add_env_cleanup_hook).

#### `napi_async_cleanup_hook` {#napi_async_cleanup_hook}

**Ajouté dans : v14.10.0, v12.19.0**

Pointeur de fonction utilisé avec [`napi_add_async_cleanup_hook`](/fr/nodejs/api/n-api#napi_add_async_cleanup_hook). Il sera appelé lorsque l'environnement sera détruit.

Les fonctions de rappel doivent satisfaire la signature suivante :

```C [C]
typedef void (*napi_async_cleanup_hook)(napi_async_cleanup_hook_handle handle,
                                        void* data);
```
- `[in] handle` : Le handle qui doit être passé à [`napi_remove_async_cleanup_hook`](/fr/nodejs/api/n-api#napi_remove_async_cleanup_hook) après l'achèvement du nettoyage asynchrone.
- `[in] data` : les données qui ont été passées à [`napi_add_async_cleanup_hook`](/fr/nodejs/api/n-api#napi_add_async_cleanup_hook).

Le corps de la fonction doit lancer les actions de nettoyage asynchrones à la fin desquelles `handle` doit être passé dans un appel à [`napi_remove_async_cleanup_hook`](/fr/nodejs/api/n-api#napi_remove_async_cleanup_hook).

## Gestion des erreurs {#error-handling}

Node-API utilise à la fois les valeurs de retour et les exceptions JavaScript pour la gestion des erreurs. Les sections suivantes expliquent l'approche pour chaque cas.

### Valeurs de retour {#return-values}

Toutes les fonctions Node-API partagent le même modèle de gestion des erreurs. Le type de retour de toutes les fonctions API est `napi_status`.

La valeur de retour sera `napi_ok` si la requête a réussi et qu'aucune exception JavaScript non gérée n'a été levée. Si une erreur s'est produite ET qu'une exception a été levée, la valeur `napi_status` de l'erreur sera renvoyée. Si une exception a été levée et qu'aucune erreur ne s'est produite, `napi_pending_exception` sera renvoyé.

Dans les cas où une valeur de retour autre que `napi_ok` ou `napi_pending_exception` est renvoyée, [`napi_is_exception_pending`](/fr/nodejs/api/n-api#napi_is_exception_pending) doit être appelé pour vérifier si une exception est en attente. Voir la section sur les exceptions pour plus de détails.

L'ensemble complet des valeurs `napi_status` possibles est défini dans `napi_api_types.h`.

La valeur de retour `napi_status` fournit une représentation indépendante de la VM de l'erreur qui s'est produite. Dans certains cas, il est utile de pouvoir obtenir des informations plus détaillées, notamment une chaîne représentant l'erreur ainsi que des informations spécifiques à la VM (moteur).

Afin de récupérer ces informations, [`napi_get_last_error_info`](/fr/nodejs/api/n-api#napi_get_last_error_info) est fourni et renvoie une structure `napi_extended_error_info`. Le format de la structure `napi_extended_error_info` est le suivant :

**Ajouté dans : v8.0.0**

**Version N-API : 1**

```C [C]
typedef struct napi_extended_error_info {
  const char* error_message;
  void* engine_reserved;
  uint32_t engine_error_code;
  napi_status error_code;
};
```
- `error_message` : Représentation textuelle de l'erreur qui s'est produite.
- `engine_reserved` : Handle opaque réservé à l'usage exclusif du moteur.
- `engine_error_code` : Code d'erreur spécifique à la VM.
- `error_code` : Code d'état Node-API pour la dernière erreur.

[`napi_get_last_error_info`](/fr/nodejs/api/n-api#napi_get_last_error_info) renvoie les informations pour le dernier appel Node-API qui a été effectué.

Ne vous fiez pas au contenu ou au format de l'une des informations étendues, car elles ne sont pas soumises à SemVer et peuvent changer à tout moment. Elles sont uniquement destinées à des fins d'enregistrement.


#### `napi_get_last_error_info` {#napi_get_last_error_info}

**Ajouté dans : v8.0.0**

**Version N-API : 1**

```C [C]
napi_status
napi_get_last_error_info(node_api_basic_env env,
                         const napi_extended_error_info** result);
```
- `[in] env` : l’environnement sous lequel l’API est appelée.
- `[out] result` : la structure `napi_extended_error_info` contenant plus d’informations sur l’erreur.

Renvoie `napi_ok` si l’API a réussi.

Cette API récupère une structure `napi_extended_error_info` contenant des informations sur la dernière erreur survenue.

Le contenu de la structure `napi_extended_error_info` renvoyée n’est valide que jusqu’à ce qu’une fonction Node-API soit appelée sur le même `env`. Cela inclut un appel à `napi_is_exception_pending`. Il peut donc souvent être nécessaire de faire une copie des informations afin de pouvoir les utiliser ultérieurement. Le pointeur renvoyé dans `error_message` pointe vers une chaîne définie statiquement. Il est donc sûr d’utiliser ce pointeur si vous l’avez copié hors du champ `error_message` (qui sera écrasé) avant qu’une autre fonction Node-API ne soit appelée.

Ne vous fiez pas au contenu ou au format des informations étendues, car elles ne sont pas soumises à SemVer et peuvent changer à tout moment. Elles sont destinées uniquement à des fins de journalisation.

Cette API peut être appelée même si une exception JavaScript est en attente.

### Exceptions {#exceptions}

Tout appel de fonction Node-API peut entraîner une exception JavaScript en attente. C’est le cas pour toutes les fonctions de l’API, même celles qui ne provoquent pas l’exécution de JavaScript.

Si le `napi_status` renvoyé par une fonction est `napi_ok`, aucune exception n’est en attente et aucune action supplémentaire n’est requise. Si le `napi_status` renvoyé est différent de `napi_ok` ou de `napi_pending_exception`, afin d’essayer de récupérer et de continuer au lieu de simplement revenir immédiatement, [`napi_is_exception_pending`](/fr/nodejs/api/n-api#napi_is_exception_pending) doit être appelé afin de déterminer si une exception est en attente ou non.

Dans de nombreux cas, lorsqu’une fonction Node-API est appelée et qu’une exception est déjà en attente, la fonction renvoie immédiatement un `napi_status` de `napi_pending_exception`. Cependant, ce n’est pas le cas pour toutes les fonctions. Node-API autorise un sous-ensemble de fonctions à être appelées pour permettre un nettoyage minimal avant de revenir à JavaScript. Dans ce cas, `napi_status` reflétera l’état de la fonction. Elle ne reflétera pas les exceptions en attente précédentes. Pour éviter toute confusion, vérifiez l’état de l’erreur après chaque appel de fonction.

Lorsqu’une exception est en attente, l’une des deux approches peut être employée.

La première approche consiste à effectuer tout nettoyage approprié, puis à revenir en arrière afin que l’exécution revienne à JavaScript. Lors de la transition vers JavaScript, l’exception sera levée au point du code JavaScript où la méthode native a été invoquée. Le comportement de la plupart des appels Node-API n’est pas spécifié tant qu’une exception est en attente, et beaucoup renverront simplement `napi_pending_exception`. Faites donc le moins de choses possible, puis retournez à JavaScript où l’exception peut être gérée.

La deuxième approche consiste à essayer de gérer l’exception. Il y aura des cas où le code natif peut intercepter l’exception, prendre les mesures appropriées, puis continuer. Cela n’est recommandé que dans des cas spécifiques où il est connu que l’exception peut être gérée en toute sécurité. Dans ces cas, [`napi_get_and_clear_last_exception`](/fr/nodejs/api/n-api#napi_get_and_clear_last_exception) peut être utilisé pour obtenir et effacer l’exception. En cas de succès, le résultat contiendra le handle du dernier `Object` JavaScript levé. S’il est déterminé, après avoir récupéré l’exception, que l’exception ne peut pas être gérée après tout, elle peut être relancée avec [`napi_throw`](/fr/nodejs/api/n-api#napi_throw) où error est la valeur JavaScript à lever.

Les fonctions d’utilitaire suivantes sont également disponibles au cas où le code natif aurait besoin de lever une exception ou de déterminer si un `napi_value` est une instance d’un objet JavaScript `Error` : [`napi_throw_error`](/fr/nodejs/api/n-api#napi_throw_error), [`napi_throw_type_error`](/fr/nodejs/api/n-api#napi_throw_type_error), [`napi_throw_range_error`](/fr/nodejs/api/n-api#napi_throw_range_error), [`node_api_throw_syntax_error`](/fr/nodejs/api/n-api#node_api_throw_syntax_error) et [`napi_is_error`](/fr/nodejs/api/n-api#napi_is_error).

Les fonctions d’utilitaire suivantes sont également disponibles au cas où le code natif aurait besoin de créer un objet `Error` : [`napi_create_error`](/fr/nodejs/api/n-api#napi_create_error), [`napi_create_type_error`](/fr/nodejs/api/n-api#napi_create_type_error), [`napi_create_range_error`](/fr/nodejs/api/n-api#napi_create_range_error) et [`node_api_create_syntax_error`](/fr/nodejs/api/n-api#node_api_create_syntax_error), où result est le `napi_value` qui fait référence à l’objet JavaScript `Error` nouvellement créé.

Le projet Node.js ajoute des codes d’erreur à toutes les erreurs générées en interne. L’objectif est que les applications utilisent ces codes d’erreur pour toutes les vérifications d’erreurs. Les messages d’erreur associés resteront, mais ne seront destinés qu’à être utilisés pour la journalisation et l’affichage avec l’attente que le message puisse changer sans que SemVer ne s’applique. Afin de prendre en charge ce modèle avec Node-API, à la fois dans les fonctionnalités internes et pour les fonctionnalités spécifiques au module (car c’est une bonne pratique), les fonctions `throw_` et `create_` prennent un paramètre de code facultatif qui est la chaîne du code à ajouter à l’objet error. Si le paramètre facultatif est `NULL`, aucun code ne sera associé à l’erreur. Si un code est fourni, le nom associé à l’erreur est également mis à jour pour être :

```text [TEXT]
originalName [code]
```
où `originalName` est le nom d’origine associé à l’erreur et `code` est le code qui a été fourni. Par exemple, si le code est `'ERR_ERROR_1'` et qu’un `TypeError` est en cours de création, le nom sera :

```text [TEXT]
TypeError [ERR_ERROR_1]
```

#### `napi_throw` {#napi_throw}

**Ajoutée dans : v8.0.0**

**Version N-API : 1**

```C [C]
NAPI_EXTERN napi_status napi_throw(napi_env env, napi_value error);
```
- `[in] env` : l’environnement dans lequel l’API est appelée.
- `[in] error` : la valeur JavaScript à lever.

Renvoie `napi_ok` si l’API a réussi.

Cette API lève la valeur JavaScript fournie.

#### `napi_throw_error` {#napi_throw_error}

**Ajoutée dans : v8.0.0**

**Version N-API : 1**

```C [C]
NAPI_EXTERN napi_status napi_throw_error(napi_env env,
                                         const char* code,
                                         const char* msg);
```
- `[in] env` : l’environnement dans lequel l’API est appelée.
- `[in] code` : code d’erreur facultatif à définir sur l’erreur.
- `[in] msg` : chaîne C représentant le texte à associer à l’erreur.

Renvoie `napi_ok` si l’API a réussi.

Cette API lève une `Error` JavaScript avec le texte fourni.

#### `napi_throw_type_error` {#napi_throw_type_error}

**Ajoutée dans : v8.0.0**

**Version N-API : 1**

```C [C]
NAPI_EXTERN napi_status napi_throw_type_error(napi_env env,
                                              const char* code,
                                              const char* msg);
```
- `[in] env` : l’environnement dans lequel l’API est appelée.
- `[in] code` : code d’erreur facultatif à définir sur l’erreur.
- `[in] msg` : chaîne C représentant le texte à associer à l’erreur.

Renvoie `napi_ok` si l’API a réussi.

Cette API lève une `TypeError` JavaScript avec le texte fourni.

#### `napi_throw_range_error` {#napi_throw_range_error}

**Ajoutée dans : v8.0.0**

**Version N-API : 1**

```C [C]
NAPI_EXTERN napi_status napi_throw_range_error(napi_env env,
                                               const char* code,
                                               const char* msg);
```
- `[in] env` : l’environnement dans lequel l’API est appelée.
- `[in] code` : code d’erreur facultatif à définir sur l’erreur.
- `[in] msg` : chaîne C représentant le texte à associer à l’erreur.

Renvoie `napi_ok` si l’API a réussi.

Cette API lève une `RangeError` JavaScript avec le texte fourni.


#### `node_api_throw_syntax_error` {#node_api_throw_syntax_error}

**Ajouté dans : v17.2.0, v16.14.0**

**Version N-API : 9**

```C [C]
NAPI_EXTERN napi_status node_api_throw_syntax_error(napi_env env,
                                                    const char* code,
                                                    const char* msg);
```
- `[in] env`: L'environnement dans lequel l'API est appelée.
- `[in] code`: Code d'erreur optionnel à définir sur l'erreur.
- `[in] msg`: Chaîne C représentant le texte à associer à l'erreur.

Renvoie `napi_ok` si l'API a réussi.

Cette API lève une exception JavaScript `SyntaxError` avec le texte fourni.

#### `napi_is_error` {#napi_is_error}

**Ajouté dans : v8.0.0**

**Version N-API : 1**

```C [C]
NAPI_EXTERN napi_status napi_is_error(napi_env env,
                                      napi_value value,
                                      bool* result);
```
- `[in] env`: L'environnement dans lequel l'API est appelée.
- `[in] value`: La valeur `napi_value` à vérifier.
- `[out] result`: Valeur booléenne qui est définie sur true si `napi_value` représente une erreur, false sinon.

Renvoie `napi_ok` si l'API a réussi.

Cette API interroge une `napi_value` pour vérifier si elle représente un objet d'erreur.

#### `napi_create_error` {#napi_create_error}

**Ajouté dans : v8.0.0**

**Version N-API : 1**

```C [C]
NAPI_EXTERN napi_status napi_create_error(napi_env env,
                                          napi_value code,
                                          napi_value msg,
                                          napi_value* result);
```
- `[in] env`: L'environnement dans lequel l'API est appelée.
- `[in] code`: `napi_value` optionnelle avec la chaîne pour le code d'erreur à associer à l'erreur.
- `[in] msg`: `napi_value` qui référence une `string` JavaScript à utiliser comme message pour l'`Error`.
- `[out] result`: `napi_value` représentant l'erreur créée.

Renvoie `napi_ok` si l'API a réussi.

Cette API renvoie une `Error` JavaScript avec le texte fourni.

#### `napi_create_type_error` {#napi_create_type_error}

**Ajouté dans : v8.0.0**

**Version N-API : 1**

```C [C]
NAPI_EXTERN napi_status napi_create_type_error(napi_env env,
                                               napi_value code,
                                               napi_value msg,
                                               napi_value* result);
```
- `[in] env`: L'environnement dans lequel l'API est appelée.
- `[in] code`: `napi_value` optionnelle avec la chaîne pour le code d'erreur à associer à l'erreur.
- `[in] msg`: `napi_value` qui référence une `string` JavaScript à utiliser comme message pour l'`Error`.
- `[out] result`: `napi_value` représentant l'erreur créée.

Renvoie `napi_ok` si l'API a réussi.

Cette API renvoie une `TypeError` JavaScript avec le texte fourni.


#### `napi_create_range_error` {#napi_create_range_error}

**Ajouté dans : v8.0.0**

**Version N-API : 1**

```C [C]
NAPI_EXTERN napi_status napi_create_range_error(napi_env env,
                                                napi_value code,
                                                napi_value msg,
                                                napi_value* result);
```
- `[in] env` : L'environnement dans lequel l'API est invoquée.
- `[in] code` : `napi_value` facultatif contenant la chaîne de caractères du code d'erreur à associer à l'erreur.
- `[in] msg` : `napi_value` qui fait référence à une `string` JavaScript à utiliser comme message pour l'`Error`.
- `[out] result` : `napi_value` représentant l'erreur créée.

Renvoie `napi_ok` si l'API a réussi.

Cette API renvoie une `RangeError` JavaScript avec le texte fourni.

#### `node_api_create_syntax_error` {#node_api_create_syntax_error}

**Ajouté dans : v17.2.0, v16.14.0**

**Version N-API : 9**

```C [C]
NAPI_EXTERN napi_status node_api_create_syntax_error(napi_env env,
                                                     napi_value code,
                                                     napi_value msg,
                                                     napi_value* result);
```
- `[in] env` : L'environnement dans lequel l'API est invoquée.
- `[in] code` : `napi_value` facultatif contenant la chaîne de caractères du code d'erreur à associer à l'erreur.
- `[in] msg` : `napi_value` qui fait référence à une `string` JavaScript à utiliser comme message pour l'`Error`.
- `[out] result` : `napi_value` représentant l'erreur créée.

Renvoie `napi_ok` si l'API a réussi.

Cette API renvoie une `SyntaxError` JavaScript avec le texte fourni.

#### `napi_get_and_clear_last_exception` {#napi_get_and_clear_last_exception}

**Ajouté dans : v8.0.0**

**Version N-API : 1**

```C [C]
napi_status napi_get_and_clear_last_exception(napi_env env,
                                              napi_value* result);
```
- `[in] env` : L'environnement dans lequel l'API est invoquée.
- `[out] result` : L'exception si une exception est en attente, `NULL` sinon.

Renvoie `napi_ok` si l'API a réussi.

Cette API peut être appelée même s'il existe une exception JavaScript en attente.


#### `napi_is_exception_pending` {#napi_is_exception_pending}

**Ajoutée dans : v8.0.0**

**Version N-API : 1**

```C [C]
napi_status napi_is_exception_pending(napi_env env, bool* result);
```
- `[in] env` : L’environnement sous lequel l’API est appelée.
- `[out] result` : Valeur booléenne qui est définie sur true si une exception est en attente.

Retourne `napi_ok` si l’API a réussi.

Cette API peut être appelée même s’il existe une exception JavaScript en attente.

#### `napi_fatal_exception` {#napi_fatal_exception}

**Ajoutée dans : v9.10.0**

**Version N-API : 3**

```C [C]
napi_status napi_fatal_exception(napi_env env, napi_value err);
```
- `[in] env` : L’environnement sous lequel l’API est appelée.
- `[in] err` : L’erreur qui est passée à `'uncaughtException'`.

Déclenche un `'uncaughtException'` en JavaScript. Utile si un rappel asynchrone lève une exception sans moyen de récupération.

### Erreurs fatales {#fatal-errors}

En cas d’erreur irrécupérable dans un module complémentaire natif, une erreur fatale peut être levée pour mettre immédiatement fin au processus.

#### `napi_fatal_error` {#napi_fatal_error}

**Ajoutée dans : v8.2.0**

**Version N-API : 1**

```C [C]
NAPI_NO_RETURN void napi_fatal_error(const char* location,
                                     size_t location_len,
                                     const char* message,
                                     size_t message_len);
```
- `[in] location` : Emplacement facultatif où l’erreur s’est produite.
- `[in] location_len` : La longueur de l’emplacement en octets, ou `NAPI_AUTO_LENGTH` si elle est terminée par null.
- `[in] message` : Le message associé à l’erreur.
- `[in] message_len` : La longueur du message en octets, ou `NAPI_AUTO_LENGTH` si elle est terminée par null.

L’appel de fonction ne retourne pas, le processus sera terminé.

Cette API peut être appelée même s’il existe une exception JavaScript en attente.

## Gestion de la durée de vie des objets {#object-lifetime-management}

Lorsque des appels Node-API sont effectués, des handles vers des objets dans le tas pour la VM sous-jacente peuvent être renvoyés en tant que `napi_values`. Ces handles doivent maintenir les objets « actifs » jusqu’à ce qu’ils ne soient plus requis par le code natif, sinon les objets pourraient être collectés avant que le code natif ait fini de les utiliser.

Lorsque les handles d’objet sont renvoyés, ils sont associés à une « portée ». La durée de vie de la portée par défaut est liée à la durée de vie de l’appel de méthode native. Le résultat est que, par défaut, les handles restent valides et les objets associés à ces handles seront maintenus en vie pendant la durée de vie de l’appel de méthode native.

Dans de nombreux cas, cependant, il est nécessaire que les handles restent valides pour une durée de vie plus courte ou plus longue que celle de la méthode native. Les sections qui suivent décrivent les fonctions Node-API qui peuvent être utilisées pour modifier la durée de vie du handle par rapport à la valeur par défaut.


### Rendre la durée de vie d'un handle plus courte que celle de la méthode native {#making-handle-lifespan-shorter-than-that-of-the-native-method}

Il est souvent nécessaire de rendre la durée de vie des handles plus courte que la durée de vie d'une méthode native. Par exemple, considérez une méthode native qui a une boucle qui itère à travers les éléments d'un grand tableau :

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

Cela entraînerait la création d'un grand nombre de handles, consommant des ressources substantielles. De plus, même si le code natif ne pouvait utiliser que le handle le plus récent, tous les objets associés seraient également maintenus en vie car ils partagent tous la même portée.

Pour gérer ce cas, Node-API offre la possibilité d'établir une nouvelle "portée" à laquelle les handles nouvellement créés seront associés. Une fois que ces handles ne sont plus nécessaires, la portée peut être "fermée" et tous les handles associés à la portée sont invalidés. Les méthodes disponibles pour ouvrir/fermer les portées sont [`napi_open_handle_scope`](/fr/nodejs/api/n-api#napi_open_handle_scope) et [`napi_close_handle_scope`](/fr/nodejs/api/n-api#napi_close_handle_scope).

Node-API ne prend en charge qu'une seule hiérarchie imbriquée de portées. Il n'y a qu'une seule portée active à tout moment, et tous les nouveaux handles seront associés à cette portée pendant qu'elle est active. Les portées doivent être fermées dans l'ordre inverse de leur ouverture. De plus, toutes les portées créées dans une méthode native doivent être fermées avant de quitter cette méthode.

En reprenant l'exemple précédent, l'ajout d'appels à [`napi_open_handle_scope`](/fr/nodejs/api/n-api#napi_open_handle_scope) et [`napi_close_handle_scope`](/fr/nodejs/api/n-api#napi_close_handle_scope) garantirait qu'au plus un seul handle est valide pendant toute l'exécution de la boucle :

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

Lors de l'imbrication de portées, il existe des cas où un handle d'une portée interne doit vivre au-delà de la durée de vie de cette portée. Node-API prend en charge une "portée échappable" afin de prendre en charge ce cas. Une portée échappable permet à un handle d'être "promu" afin qu'il "échappe" à la portée actuelle et que la durée de vie du handle passe de la portée actuelle à celle de la portée externe.

Les méthodes disponibles pour ouvrir/fermer les portées échappables sont [`napi_open_escapable_handle_scope`](/fr/nodejs/api/n-api#napi_open_escapable_handle_scope) et [`napi_close_escapable_handle_scope`](/fr/nodejs/api/n-api#napi_close_escapable_handle_scope).

La demande de promotion d'un handle est faite via [`napi_escape_handle`](/fr/nodejs/api/n-api#napi_escape_handle) qui ne peut être appelée qu'une seule fois.


#### `napi_open_handle_scope` {#napi_open_handle_scope}

**Ajoutée dans : v8.0.0**

**Version N-API : 1**

```C [C]
NAPI_EXTERN napi_status napi_open_handle_scope(napi_env env,
                                               napi_handle_scope* result);
```
- `[in] env` : l’environnement dans lequel l’API est appelée.
- `[out] result` : `napi_value` représentant la nouvelle portée.

Renvoie `napi_ok` si l’API a réussi.

Cette API ouvre une nouvelle portée.

#### `napi_close_handle_scope` {#napi_close_handle_scope}

**Ajoutée dans : v8.0.0**

**Version N-API : 1**

```C [C]
NAPI_EXTERN napi_status napi_close_handle_scope(napi_env env,
                                                napi_handle_scope scope);
```
- `[in] env` : l’environnement dans lequel l’API est appelée.
- `[in] scope` : `napi_value` représentant la portée à fermer.

Renvoie `napi_ok` si l’API a réussi.

Cette API ferme la portée passée. Les portées doivent être fermées dans l’ordre inverse de leur création.

Cette API peut être appelée même s’il existe une exception JavaScript en attente.

#### `napi_open_escapable_handle_scope` {#napi_open_escapable_handle_scope}

**Ajoutée dans : v8.0.0**

**Version N-API : 1**

```C [C]
NAPI_EXTERN napi_status
    napi_open_escapable_handle_scope(napi_env env,
                                     napi_handle_scope* result);
```
- `[in] env` : l’environnement dans lequel l’API est appelée.
- `[out] result` : `napi_value` représentant la nouvelle portée.

Renvoie `napi_ok` si l’API a réussi.

Cette API ouvre une nouvelle portée à partir de laquelle un objet peut être promu à la portée externe.

#### `napi_close_escapable_handle_scope` {#napi_close_escapable_handle_scope}

**Ajoutée dans : v8.0.0**

**Version N-API : 1**

```C [C]
NAPI_EXTERN napi_status
    napi_close_escapable_handle_scope(napi_env env,
                                      napi_handle_scope scope);
```
- `[in] env` : l’environnement dans lequel l’API est appelée.
- `[in] scope` : `napi_value` représentant la portée à fermer.

Renvoie `napi_ok` si l’API a réussi.

Cette API ferme la portée passée. Les portées doivent être fermées dans l’ordre inverse de leur création.

Cette API peut être appelée même s’il existe une exception JavaScript en attente.


#### `napi_escape_handle` {#napi_escape_handle}

**Ajouté dans : v8.0.0**

**Version N-API : 1**

```C [C]
napi_status napi_escape_handle(napi_env env,
                               napi_escapable_handle_scope scope,
                               napi_value escapee,
                               napi_value* result);
```
- `[in] env` : l'environnement dans lequel l'API est appelée.
- `[in] scope` : `napi_value` représentant la portée actuelle.
- `[in] escapee` : `napi_value` représentant l'`Object` JavaScript à échapper.
- `[out] result` : `napi_value` représentant le handle de l'`Object` échappé dans la portée extérieure.

Renvoie `napi_ok` si l'API a réussi.

Cette API promeut le handle à l'objet JavaScript afin qu'il soit valide pour la durée de vie de la portée extérieure. Elle ne peut être appelée qu'une seule fois par portée. Si elle est appelée plus d'une fois, une erreur sera renvoyée.

Cette API peut être appelée même s'il existe une exception JavaScript en attente.

### Références à des valeurs dont la durée de vie est supérieure à celle de la méthode native {#references-to-values-with-a-lifespan-longer-than-that-of-the-native-method}

Dans certains cas, un module complémentaire devra être capable de créer et de référencer des valeurs dont la durée de vie est supérieure à celle d'un seul appel de méthode native. Par exemple, pour créer un constructeur et utiliser ultérieurement ce constructeur dans une requête de création d'instances, il doit être possible de référencer l'objet constructeur à travers de nombreuses requêtes de création d'instances différentes. Cela ne serait pas possible avec un handle normal renvoyé sous forme de `napi_value` comme décrit dans la section précédente. La durée de vie d'un handle normal est gérée par des portées et toutes les portées doivent être fermées avant la fin d'une méthode native.

Node-API fournit des méthodes pour créer des références persistantes à des valeurs. Actuellement, Node-API n'autorise la création de références que pour un ensemble limité de types de valeurs, notamment objet, externe, fonction et symbole.

Chaque référence a un compte associé avec une valeur de 0 ou plus, qui détermine si la référence maintiendra la valeur correspondante en vie. Les références avec un compte de 0 n'empêchent pas les valeurs d'être collectées. Les valeurs de type objet (objet, fonction, externe) et symbole deviennent des références "faibles" et peuvent toujours être accessibles tant qu'elles ne sont pas collectées. Tout compte supérieur à 0 empêchera la collecte des valeurs.

Les valeurs de symbole ont différentes saveurs. Le véritable comportement de référence faible n'est pris en charge que par les symboles locaux créés avec la fonction `napi_create_symbol` ou les appels de constructeur JavaScript `Symbol()`. Les symboles enregistrés globalement créés avec la fonction `node_api_symbol_for` ou les appels de fonction JavaScript `Symbol.for()` restent toujours des références fortes car le garbage collector ne les collecte pas. Il en va de même pour les symboles bien connus tels que `Symbol.iterator`. Ils ne sont également jamais collectés par le garbage collector.

Les références peuvent être créées avec un nombre initial de références. Le nombre peut ensuite être modifié via [`napi_reference_ref`](/fr/nodejs/api/n-api#napi_reference_ref) et [`napi_reference_unref`](/fr/nodejs/api/n-api#napi_reference_unref). Si un objet est collecté alors que le nombre d'une référence est de 0, tous les appels ultérieurs pour obtenir l'objet associé à la référence [`napi_get_reference_value`](/fr/nodejs/api/n-api#napi_get_reference_value) renverront `NULL` pour la `napi_value` renvoyée. Une tentative d'appel de [`napi_reference_ref`](/fr/nodejs/api/n-api#napi_reference_ref) pour une référence dont l'objet a été collecté entraîne une erreur.

Les références doivent être supprimées une fois qu'elles ne sont plus requises par le module complémentaire. Lorsqu'une référence est supprimée, elle n'empêche plus l'objet correspondant d'être collecté. L'échec de la suppression d'une référence persistante entraîne une "fuite de mémoire", à la fois pour la mémoire native de la référence persistante et pour l'objet correspondant sur le tas, qui sont conservés à jamais.

Il peut y avoir plusieurs références persistantes créées qui se réfèrent au même objet, chacune d'entre elles maintenant l'objet en vie ou non en fonction de son nombre individuel. Plusieurs références persistantes au même objet peuvent entraîner le maintien inattendu en vie de la mémoire native. Les structures natives d'une référence persistante doivent être maintenues en vie jusqu'à ce que les finaliseurs de l'objet référencé soient exécutés. Si une nouvelle référence persistante est créée pour le même objet, les finaliseurs de cet objet ne seront pas exécutés et la mémoire native pointée par la référence persistante précédente ne sera pas libérée. Cela peut être évité en appelant `napi_delete_reference` en plus de `napi_reference_unref` lorsque cela est possible.

**Historique des modifications :**

- Expérimental (`NAPI_EXPERIMENTAL` est défini) : des références peuvent être créées pour tous les types de valeurs. Les nouveaux types de valeurs pris en charge ne prennent pas en charge la sémantique de référence faible et les valeurs de ces types sont libérées lorsque le nombre de références devient 0 et ne sont plus accessibles à partir de la référence.


#### `napi_create_reference` {#napi_create_reference}

**Ajouté dans : v8.0.0**

**Version N-API : 1**

```C [C]
NAPI_EXTERN napi_status napi_create_reference(napi_env env,
                                              napi_value value,
                                              uint32_t initial_refcount,
                                              napi_ref* result);
```
- `[in] env`: L'environnement dans lequel l'API est invoquée.
- `[in] value`: La `napi_value` pour laquelle une référence est créée.
- `[in] initial_refcount`: Compteur de références initial pour la nouvelle référence.
- `[out] result`: `napi_ref` pointant vers la nouvelle référence.

Renvoie `napi_ok` si l'API a réussi.

Cette API crée une nouvelle référence avec le nombre de références spécifié à la valeur passée.

#### `napi_delete_reference` {#napi_delete_reference}

**Ajouté dans : v8.0.0**

**Version N-API : 1**

```C [C]
NAPI_EXTERN napi_status napi_delete_reference(napi_env env, napi_ref ref);
```
- `[in] env`: L'environnement dans lequel l'API est invoquée.
- `[in] ref`: `napi_ref` à supprimer.

Renvoie `napi_ok` si l'API a réussi.

Cette API supprime la référence passée.

Cette API peut être appelée même s'il existe une exception JavaScript en attente.

#### `napi_reference_ref` {#napi_reference_ref}

**Ajouté dans : v8.0.0**

**Version N-API : 1**

```C [C]
NAPI_EXTERN napi_status napi_reference_ref(napi_env env,
                                           napi_ref ref,
                                           uint32_t* result);
```
- `[in] env`: L'environnement dans lequel l'API est invoquée.
- `[in] ref`: `napi_ref` pour laquelle le compteur de références sera incrémenté.
- `[out] result`: Le nouveau compteur de références.

Renvoie `napi_ok` si l'API a réussi.

Cette API incrémente le nombre de références pour la référence passée et renvoie le nombre de références résultant.

#### `napi_reference_unref` {#napi_reference_unref}

**Ajouté dans : v8.0.0**

**Version N-API : 1**

```C [C]
NAPI_EXTERN napi_status napi_reference_unref(napi_env env,
                                             napi_ref ref,
                                             uint32_t* result);
```
- `[in] env`: L'environnement dans lequel l'API est invoquée.
- `[in] ref`: `napi_ref` pour laquelle le compteur de références sera décrémenté.
- `[out] result`: Le nouveau compteur de références.

Renvoie `napi_ok` si l'API a réussi.

Cette API décrémente le nombre de références pour la référence passée et renvoie le nombre de références résultant.


#### `napi_get_reference_value` {#napi_get_reference_value}

**Ajouté dans : v8.0.0**

**Version N-API : 1**

```C [C]
NAPI_EXTERN napi_status napi_get_reference_value(napi_env env,
                                                 napi_ref ref,
                                                 napi_value* result);
```
- `[in] env` : L’environnement dans lequel l’API est appelée.
- `[in] ref` : Le `napi_ref` pour lequel la valeur correspondante est demandée.
- `[out] result` : Le `napi_value` référencé par le `napi_ref`.

Renvoie `napi_ok` si l’API a réussi.

Si elle est toujours valide, cette API renvoie la `napi_value` représentant la valeur JavaScript associée à la `napi_ref`. Sinon, le résultat sera `NULL`.

### Nettoyage à la sortie de l’environnement Node.js actuel {#cleanup-on-exit-of-the-current-nodejs-environment}

Bien qu’un processus Node.js libère généralement toutes ses ressources lors de sa sortie, les intégrateurs de Node.js, ou le futur support Worker, peuvent exiger des addons qu’ils enregistrent des hooks de nettoyage qui seront exécutés une fois que l’environnement Node.js actuel quitte.

Node-API fournit des fonctions pour enregistrer et désenregistrer ces rappels. Lorsque ces rappels sont exécutés, toutes les ressources détenues par l’addon doivent être libérées.

#### `napi_add_env_cleanup_hook` {#napi_add_env_cleanup_hook}

**Ajouté dans : v10.2.0**

**Version N-API : 3**

```C [C]
NODE_EXTERN napi_status napi_add_env_cleanup_hook(node_api_basic_env env,
                                                  napi_cleanup_hook fun,
                                                  void* arg);
```
Enregistre `fun` en tant que fonction à exécuter avec le paramètre `arg` une fois que l’environnement Node.js actuel se ferme.

Une fonction peut être spécifiée en toute sécurité plusieurs fois avec différentes valeurs `arg`. Dans ce cas, elle sera également appelée plusieurs fois. Fournir les mêmes valeurs `fun` et `arg` plusieurs fois n’est pas autorisé et entraînera l’abandon du processus.

Les hooks seront appelés dans l’ordre inverse, c’est-à-dire que le plus récemment ajouté sera appelé en premier.

La suppression de ce hook peut se faire à l’aide de [`napi_remove_env_cleanup_hook`](/fr/nodejs/api/n-api#napi_remove_env_cleanup_hook). Généralement, cela se produit lorsque la ressource pour laquelle ce hook a été ajouté est de toute façon en cours de démolition.

Pour le nettoyage asynchrone, [`napi_add_async_cleanup_hook`](/fr/nodejs/api/n-api#napi_add_async_cleanup_hook) est disponible.


#### `napi_remove_env_cleanup_hook` {#napi_remove_env_cleanup_hook}

**Ajouté dans : v10.2.0**

**Version N-API : 3**

```C [C]
NAPI_EXTERN napi_status napi_remove_env_cleanup_hook(node_api_basic_env env,
                                                     void (*fun)(void* arg),
                                                     void* arg);
```
Désenregistre `fun` en tant que fonction à exécuter avec le paramètre `arg` une fois que l'environnement Node.js actuel se termine. L'argument et la valeur de la fonction doivent correspondre exactement.

La fonction doit avoir été initialement enregistrée avec `napi_add_env_cleanup_hook`, sinon le processus sera interrompu.

#### `napi_add_async_cleanup_hook` {#napi_add_async_cleanup_hook}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v14.10.0, v12.19.0 | Signature de la fonction de rappel `hook` modifiée. |
| v14.8.0, v12.19.0 | Ajouté dans : v14.8.0, v12.19.0 |
:::

**Version N-API : 8**

```C [C]
NAPI_EXTERN napi_status napi_add_async_cleanup_hook(
    node_api_basic_env env,
    napi_async_cleanup_hook hook,
    void* arg,
    napi_async_cleanup_hook_handle* remove_handle);
```
- `[in] env` : L’environnement sous lequel l’API est appelée.
- `[in] hook` : Le pointeur de fonction à appeler lors de la destruction de l’environnement.
- `[in] arg` : Le pointeur à transmettre à `hook` lors de son appel.
- `[out] remove_handle` : Handle optionnel qui fait référence au hook de nettoyage asynchrone.

Enregistre `hook`, qui est une fonction de type [`napi_async_cleanup_hook`](/fr/nodejs/api/n-api#napi_async_cleanup_hook), en tant que fonction à exécuter avec les paramètres `remove_handle` et `arg` une fois que l'environnement Node.js actuel se termine.

Contrairement à [`napi_add_env_cleanup_hook`](/fr/nodejs/api/n-api#napi_add_env_cleanup_hook), le hook peut être asynchrone.

Sinon, le comportement correspond généralement à celui de [`napi_add_env_cleanup_hook`](/fr/nodejs/api/n-api#napi_add_env_cleanup_hook).

Si `remove_handle` n’est pas `NULL`, une valeur opaque y sera stockée et devra être transmise ultérieurement à [`napi_remove_async_cleanup_hook`](/fr/nodejs/api/n-api#napi_remove_async_cleanup_hook), que le hook ait déjà été appelé ou non. Généralement, cela se produit lorsque la ressource pour laquelle ce hook a été ajouté est en cours de démolition de toute façon.


#### `napi_remove_async_cleanup_hook` {#napi_remove_async_cleanup_hook}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v14.10.0, v12.19.0 | Suppression du paramètre `env`. |
| v14.8.0, v12.19.0 | Ajouté dans : v14.8.0, v12.19.0 |
:::

```C [C]
NAPI_EXTERN napi_status napi_remove_async_cleanup_hook(
    napi_async_cleanup_hook_handle remove_handle);
```
- `[in] remove_handle`: Le handle d'un hook de nettoyage asynchrone qui a été créé avec [`napi_add_async_cleanup_hook`](/fr/nodejs/api/n-api#napi_add_async_cleanup_hook).

Désenregistre le hook de nettoyage correspondant à `remove_handle`. Ceci empêchera l'exécution du hook, à moins qu'il n'ait déjà commencé à s'exécuter. Ceci doit être appelé sur toute valeur `napi_async_cleanup_hook_handle` obtenue de [`napi_add_async_cleanup_hook`](/fr/nodejs/api/n-api#napi_add_async_cleanup_hook).

### Finalisation à la sortie de l'environnement Node.js {#finalization-on-the-exit-of-the-nodejs-environment}

L'environnement Node.js peut être déconstruit à un moment arbitraire dès que possible avec l'exécution de JavaScript interdite, comme sur la requête de [`worker.terminate()`](/fr/nodejs/api/worker_threads#workerterminate). Lorsque l'environnement est en cours de déconstruction, les callbacks `napi_finalize` enregistrés des objets JavaScript, des fonctions thread-safe et des données d'instance d'environnement sont invoqués immédiatement et indépendamment.

L'invocation des callbacks `napi_finalize` est planifiée après les hooks de nettoyage enregistrés manuellement. Afin d'assurer un ordre approprié de finalisation des addons pendant l'arrêt de l'environnement pour éviter une utilisation après libération dans le callback `napi_finalize`, les addons devraient enregistrer un hook de nettoyage avec `napi_add_env_cleanup_hook` et `napi_add_async_cleanup_hook` pour libérer manuellement la ressource allouée dans un ordre approprié.

## Enregistrement du module {#module-registration}

Les modules Node-API sont enregistrés d'une manière similaire aux autres modules, sauf qu'au lieu d'utiliser la macro `NODE_MODULE`, la suivante est utilisée :

```C [C]
NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)
```
La différence suivante est la signature pour la méthode `Init`. Pour un module Node-API, elle est la suivante :

```C [C]
napi_value Init(napi_env env, napi_value exports);
```
La valeur de retour de `Init` est traitée comme l'objet `exports` pour le module. La méthode `Init` reçoit un objet vide via le paramètre `exports` par commodité. Si `Init` retourne `NULL`, le paramètre passé comme `exports` est exporté par le module. Les modules Node-API ne peuvent pas modifier l'objet `module`, mais peuvent spécifier n'importe quoi comme propriété `exports` du module.

Pour ajouter la méthode `hello` en tant que fonction afin qu'elle puisse être appelée en tant que méthode fournie par l'addon :

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
Pour définir une fonction à retourner par `require()` pour l'addon :

```C [C]
napi_value Init(napi_env env, napi_value exports) {
  napi_value method;
  napi_status status;
  status = napi_create_function(env, "exports", NAPI_AUTO_LENGTH, Method, NULL, &method);
  if (status != napi_ok) return NULL;
  return method;
}
```
Pour définir une classe afin que de nouvelles instances puissent être créées (souvent utilisé avec [Object wrap](/fr/nodejs/api/n-api#object-wrap)) :

```C [C]
// NOTE: exemple partiel, tout le code référencé n'est pas inclus
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
Vous pouvez également utiliser la macro `NAPI_MODULE_INIT`, qui sert de raccourci pour `NAPI_MODULE` et la définition d'une fonction `Init` :

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
Les paramètres `env` et `exports` sont fournis au corps de la macro `NAPI_MODULE_INIT`.

Tous les addons Node-API sont sensibles au contexte, ce qui signifie qu'ils peuvent être chargés plusieurs fois. Il y a quelques considérations de conception lors de la déclaration d'un tel module. La documentation sur les [addons sensibles au contexte](/fr/nodejs/api/addons#context-aware-addons) fournit plus de détails.

Les variables `env` et `exports` seront disponibles à l'intérieur du corps de la fonction après l'invocation de la macro.

Pour plus de détails sur la définition des propriétés sur les objets, consultez la section sur [Travailler avec les propriétés JavaScript](/fr/nodejs/api/n-api#working-with-javascript-properties).

Pour plus de détails sur la construction de modules d'addon en général, reportez-vous à l'API existante.


## Travailler avec les valeurs JavaScript {#working-with-javascript-values}

Node-API expose un ensemble d'API pour créer tous les types de valeurs JavaScript. Certains de ces types sont documentés dans la [Section 6](https://tc39.github.io/ecma262/#sec-ecmascript-data-types-and-values) de la [Spécification du langage ECMAScript](https://tc39.github.io/ecma262/).

Fondamentalement, ces API sont utilisées pour effectuer l'une des opérations suivantes :

Les valeurs Node-API sont représentées par le type `napi_value`. Tout appel Node-API qui nécessite une valeur JavaScript prend un `napi_value`. Dans certains cas, l'API vérifie au préalable le type de `napi_value`. Cependant, pour de meilleures performances, il est préférable que l'appelant s'assure que le `napi_value` en question est du type JavaScript attendu par l'API.

### Types d'énumération {#enum-types}

#### `napi_key_collection_mode` {#napi_key_collection_mode}

**Ajouté dans : v13.7.0, v12.17.0, v10.20.0**

**Version N-API : 6**

```C [C]
typedef enum {
  napi_key_include_prototypes,
  napi_key_own_only
} napi_key_collection_mode;
```
Décrit les enums de filtre `Keys/Properties` :

`napi_key_collection_mode` limite la plage de propriétés collectées.

`napi_key_own_only` limite les propriétés collectées à l'objet donné uniquement. `napi_key_include_prototypes` inclura également toutes les clés de la chaîne de prototypes des objets.

#### `napi_key_filter` {#napi_key_filter}

**Ajouté dans : v13.7.0, v12.17.0, v10.20.0**

**Version N-API : 6**

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
Bits de filtre de propriétés. Ils peuvent être combinés avec un opérateur OR pour créer un filtre composite.

#### `napi_key_conversion` {#napi_key_conversion}

**Ajouté dans : v13.7.0, v12.17.0, v10.20.0**

**Version N-API : 6**

```C [C]
typedef enum {
  napi_key_keep_numbers,
  napi_key_numbers_to_strings
} napi_key_conversion;
```
`napi_key_numbers_to_strings` convertira les index entiers en chaînes de caractères. `napi_key_keep_numbers` renverra des nombres pour les index entiers.

#### `napi_valuetype` {#napi_valuetype}

```C [C]
typedef enum {
  // Types ES6 (correspond à typeof)
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
Décrit le type d'un `napi_value`. Cela correspond généralement aux types décrits dans la [Section 6.1](https://tc39.github.io/ecma262/#sec-ecmascript-language-types) de la spécification du langage ECMAScript. En plus des types dans cette section, `napi_valuetype` peut également représenter des `Function`s et des `Object`s avec des données externes.

Une valeur JavaScript de type `napi_external` apparaît dans JavaScript comme un objet simple sur lequel aucune propriété ne peut être définie, et aucun prototype.


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
Cela représente le type de données scalaires binaires sous-jacentes du `TypedArray`. Les éléments de cette énumération correspondent à la [Section 22.2](https://tc39.github.io/ecma262/#sec-typedarray-objects) de la [Spécification du langage ECMAScript](https://tc39.github.io/ecma262/).

### Fonctions de création d'objets {#object-creation-functions}

#### `napi_create_array` {#napi_create_array}

**Ajouté dans : v8.0.0**

**Version N-API : 1**

```C [C]
napi_status napi_create_array(napi_env env, napi_value* result)
```
- `[in] env` : l’environnement dans lequel l’appel Node-API est invoqué.
- `[out] result` : un `napi_value` représentant un `Array` JavaScript.

Renvoie `napi_ok` si l’API a réussi.

Cette API renvoie une valeur Node-API correspondant à un type `Array` JavaScript. Les tableaux JavaScript sont décrits dans la [Section 22.1](https://tc39.github.io/ecma262/#sec-array-objects) de la spécification du langage ECMAScript.

#### `napi_create_array_with_length` {#napi_create_array_with_length}

**Ajouté dans : v8.0.0**

**Version N-API : 1**

```C [C]
napi_status napi_create_array_with_length(napi_env env,
                                          size_t length,
                                          napi_value* result)
```
- `[in] env` : l’environnement dans lequel l’API est appelée.
- `[in] length` : la longueur initiale du `Array`.
- `[out] result` : un `napi_value` représentant un `Array` JavaScript.

Renvoie `napi_ok` si l’API a réussi.

Cette API renvoie une valeur Node-API correspondant à un type `Array` JavaScript. La propriété length du `Array` est définie sur le paramètre length transmis. Toutefois, rien ne garantit que la mémoire tampon sous-jacente est pré-allouée par la VM lorsque le tableau est créé. Ce comportement est laissé à l’implémentation de la VM sous-jacente. Si la mémoire tampon doit être un bloc de mémoire contigu qui peut être directement lu et/ou écrit via C, envisagez d’utiliser [`napi_create_external_arraybuffer`](/fr/nodejs/api/n-api#napi_create_external_arraybuffer).

Les tableaux JavaScript sont décrits dans la [Section 22.1](https://tc39.github.io/ecma262/#sec-array-objects) de la spécification du langage ECMAScript.


#### `napi_create_arraybuffer` {#napi_create_arraybuffer}

**Ajouté dans : v8.0.0**

**Version N-API : 1**

```C [C]
napi_status napi_create_arraybuffer(napi_env env,
                                    size_t byte_length,
                                    void** data,
                                    napi_value* result)
```
- `[in] env` : L’environnement dans lequel l’API est appelée.
- `[in] length` : La longueur en octets du tampon de tableau à créer.
- `[out] data` : Pointeur vers le tampon d’octets sous-jacent de l'`ArrayBuffer`. `data` peut éventuellement être ignoré en passant `NULL`.
- `[out] result` : Une `napi_value` représentant un `ArrayBuffer` JavaScript.

Renvoie `napi_ok` si l’API a réussi.

Cette API renvoie une valeur Node-API correspondant à un `ArrayBuffer` JavaScript. Les `ArrayBuffer` sont utilisés pour représenter des tampons de données binaires de longueur fixe. Ils sont normalement utilisés comme tampon de support pour les objets `TypedArray`. L'`ArrayBuffer` alloué aura un tampon d’octets sous-jacent dont la taille est déterminée par le paramètre `length` qui est transmis. Le tampon sous-jacent est éventuellement renvoyé à l’appelant au cas où l’appelant souhaite manipuler directement le tampon. Ce tampon ne peut être écrit directement qu’à partir du code natif. Pour écrire dans ce tampon à partir de JavaScript, un tableau typé ou un objet `DataView` doit être créé.

Les objets JavaScript `ArrayBuffer` sont décrits dans [Section 24.1](https://tc39.github.io/ecma262/#sec-arraybuffer-objects) de la spécification du langage ECMAScript.

#### `napi_create_buffer` {#napi_create_buffer}

**Ajouté dans : v8.0.0**

**Version N-API : 1**

```C [C]
napi_status napi_create_buffer(napi_env env,
                               size_t size,
                               void** data,
                               napi_value* result)
```
- `[in] env` : L’environnement dans lequel l’API est appelée.
- `[in] size` : Taille en octets du tampon sous-jacent.
- `[out] data` : Pointeur brut vers le tampon sous-jacent. `data` peut éventuellement être ignoré en passant `NULL`.
- `[out] result` : Une `napi_value` représentant un `node::Buffer`.

Renvoie `napi_ok` si l’API a réussi.

Cette API alloue un objet `node::Buffer`. Bien qu’il s’agisse toujours d’une structure de données entièrement prise en charge, dans la plupart des cas, l’utilisation d’un `TypedArray` suffira.


#### `napi_create_buffer_copy` {#napi_create_buffer_copy}

**Ajoutée dans : v8.0.0**

**Version N-API : 1**

```C [C]
napi_status napi_create_buffer_copy(napi_env env,
                                    size_t length,
                                    const void* data,
                                    void** result_data,
                                    napi_value* result)
```
- `[in] env`: L'environnement dans lequel l'API est appelée.
- `[in] size`: Taille en octets de la mémoire tampon d'entrée (doit être identique à la taille de la nouvelle mémoire tampon).
- `[in] data`: Pointeur brut vers la mémoire tampon sous-jacente à partir de laquelle copier.
- `[out] result_data`: Pointeur vers la nouvelle mémoire tampon de données sous-jacente de `Buffer`. `result_data` peut éventuellement être ignoré en transmettant `NULL`.
- `[out] result`: Une `napi_value` représentant un `node::Buffer`.

Renvoie `napi_ok` si l'API a réussi.

Cette API alloue un objet `node::Buffer` et l'initialise avec des données copiées depuis la mémoire tampon transmise. Bien qu'il s'agisse toujours d'une structure de données entièrement prise en charge, dans la plupart des cas, l'utilisation d'un `TypedArray` suffira.

#### `napi_create_date` {#napi_create_date}

**Ajoutée dans : v11.11.0, v10.17.0**

**Version N-API : 5**

```C [C]
napi_status napi_create_date(napi_env env,
                             double time,
                             napi_value* result);
```
- `[in] env`: L'environnement dans lequel l'API est appelée.
- `[in] time`: Valeur de temps ECMAScript en millisecondes depuis le 1er janvier 1970 UTC.
- `[out] result`: Une `napi_value` représentant une `Date` JavaScript.

Renvoie `napi_ok` si l'API a réussi.

Cette API n'observe pas les secondes intercalaires ; elles sont ignorées, car ECMAScript s'aligne sur la spécification de temps POSIX.

Cette API alloue un objet JavaScript `Date`.

Les objets JavaScript `Date` sont décrits dans la [Section 20.3](https://tc39.github.io/ecma262/#sec-date-objects) de la spécification du langage ECMAScript.

#### `napi_create_external` {#napi_create_external}

**Ajoutée dans : v8.0.0**

**Version N-API : 1**

```C [C]
napi_status napi_create_external(napi_env env,
                                 void* data,
                                 napi_finalize finalize_cb,
                                 void* finalize_hint,
                                 napi_value* result)
```
- `[in] env`: L'environnement dans lequel l'API est appelée.
- `[in] data`: Pointeur brut vers les données externes.
- `[in] finalize_cb`: Callback optionnel à appeler lorsque la valeur externe est collectée. [`napi_finalize`](/fr/nodejs/api/n-api#napi_finalize) fournit plus de détails.
- `[in] finalize_hint`: Indice optionnel à transmettre au callback de finalisation pendant la collecte.
- `[out] result`: Une `napi_value` représentant une valeur externe.

Renvoie `napi_ok` si l'API a réussi.

Cette API alloue une valeur JavaScript avec des données externes attachées. Elle est utilisée pour transmettre des données externes via le code JavaScript, afin qu'elles puissent être récupérées ultérieurement par le code natif à l'aide de [`napi_get_value_external`](/fr/nodejs/api/n-api#napi_get_value_external).

L'API ajoute un callback `napi_finalize` qui sera appelé lorsque l'objet JavaScript qui vient d'être créé a été récupéré par le garbage collector.

La valeur créée n'est pas un objet et ne prend donc pas en charge les propriétés supplémentaires. Elle est considérée comme un type de valeur distinct : l'appel de `napi_typeof()` avec une valeur externe produit `napi_external`.


#### `napi_create_external_arraybuffer` {#napi_create_external_arraybuffer}

**Ajouté dans : v8.0.0**

**Version N-API : 1**

```C [C]
napi_status
napi_create_external_arraybuffer(napi_env env,
                                 void* external_data,
                                 size_t byte_length,
                                 napi_finalize finalize_cb,
                                 void* finalize_hint,
                                 napi_value* result)
```
- `[in] env` : L’environnement dans lequel l’API est appelée.
- `[in] external_data` : Pointeur vers le tampon d’octets sous-jacent de l’`ArrayBuffer`.
- `[in] byte_length` : La longueur en octets du tampon sous-jacent.
- `[in] finalize_cb` : Rappel facultatif à appeler lorsque l’`ArrayBuffer` est en cours de collecte. [`napi_finalize`](/fr/nodejs/api/n-api#napi_finalize) fournit plus de détails.
- `[in] finalize_hint` : Indication facultative à transmettre au rappel de finalisation pendant la collecte.
- `[out] result` : Un `napi_value` représentant un `ArrayBuffer` JavaScript.

Renvoie `napi_ok` si l’API a réussi.

**Certains environnements d’exécution autres que Node.js ont abandonné la prise en charge des tampons externes**. Sur les environnements d’exécution autres que Node.js, cette méthode peut renvoyer `napi_no_external_buffers_allowed` pour indiquer que les tampons externes ne sont pas pris en charge. Electron est un de ces environnements d’exécution, comme décrit dans ce problème [electron/issues/35801](https://github.com/electron/electron/issues/35801).

Afin de maintenir la compatibilité la plus large possible avec tous les environnements d’exécution, vous pouvez définir `NODE_API_NO_EXTERNAL_BUFFERS_ALLOWED` dans votre module complémentaire avant les inclusions pour les en-têtes de l’API Node. Cela masquera les 2 fonctions qui créent des tampons externes. Cela garantira qu’une erreur de compilation se produira si vous utilisez accidentellement l’une de ces méthodes.

Cette API renvoie une valeur Node-API correspondant à un `ArrayBuffer` JavaScript. Le tampon d’octets sous-jacent de l'`ArrayBuffer` est alloué et géré de manière externe. L’appelant doit s’assurer que le tampon d’octets reste valide jusqu’à ce que le rappel de finalisation soit appelé.

L’API ajoute un rappel `napi_finalize` qui sera appelé lorsque l’objet JavaScript qui vient d’être créé a été collecté par le garbage collector.

Les `ArrayBuffer` JavaScript sont décrits dans [Section 24.1](https://tc39.github.io/ecma262/#sec-arraybuffer-objects) de la spécification du langage ECMAScript.


#### `napi_create_external_buffer` {#napi_create_external_buffer}

**Ajouté dans : v8.0.0**

**Version N-API : 1**

```C [C]
napi_status napi_create_external_buffer(napi_env env,
                                        size_t length,
                                        void* data,
                                        napi_finalize finalize_cb,
                                        void* finalize_hint,
                                        napi_value* result)
```
- `[in] env` : L’environnement dans lequel l’API est appelée.
- `[in] length` : Taille en octets de la mémoire tampon d’entrée (doit être identique à la taille de la nouvelle mémoire tampon).
- `[in] data` : Pointeur brut vers la mémoire tampon sous-jacente à exposer à JavaScript.
- `[in] finalize_cb` : Callback facultatif à appeler lorsque l’`ArrayBuffer` est en cours de récupération. [`napi_finalize`](/fr/nodejs/api/n-api#napi_finalize) fournit plus de détails.
- `[in] finalize_hint` : Indication facultative à transmettre au callback de finalisation lors de la récupération.
- `[out] result` : Un `napi_value` représentant un `node::Buffer`.

Renvoie `napi_ok` si l’API a réussi.

**Certains environnements d'exécution autres que Node.js ont supprimé la prise en charge des mémoires tampons externes**. Sur les environnements d'exécution autres que Node.js, cette méthode peut renvoyer `napi_no_external_buffers_allowed` pour indiquer que les mémoires tampons externes ne sont pas prises en charge. Electron est l'un de ces environnements d'exécution, comme décrit dans ce problème [electron/issues/35801](https://github.com/electron/electron/issues/35801).

Afin de maintenir la compatibilité la plus large possible avec tous les environnements d'exécution, vous pouvez définir `NODE_API_NO_EXTERNAL_BUFFERS_ALLOWED` dans votre addon avant les inclusions des en-têtes de l'API Node. Cela masquera les 2 fonctions qui créent des mémoires tampons externes. Cela garantira qu'une erreur de compilation se produise si vous utilisez accidentellement l'une de ces méthodes.

Cette API alloue un objet `node::Buffer` et l’initialise avec des données soutenues par la mémoire tampon transmise. Bien qu’il s’agisse toujours d’une structure de données entièrement prise en charge, dans la plupart des cas, l’utilisation d’un `TypedArray` suffira.

L’API ajoute un callback `napi_finalize` qui sera appelé lorsque l’objet JavaScript qui vient d’être créé a été récupéré par le garbage collector.

Pour Node.js \>=4, les `Buffers` sont des `Uint8Array`s.


#### `napi_create_object` {#napi_create_object}

**Ajouté dans : v8.0.0**

**Version N-API : 1**

```C [C]
napi_status napi_create_object(napi_env env, napi_value* result)
```
- `[in] env` : L'environnement dans lequel l'API est invoquée.
- `[out] result` : Un `napi_value` représentant un `Object` JavaScript.

Retourne `napi_ok` si l'API a réussi.

Cette API alloue un `Object` JavaScript par défaut. C'est l'équivalent de faire `new Object()` en JavaScript.

Le type `Object` JavaScript est décrit dans [Section 6.1.7](https://tc39.github.io/ecma262/#sec-object-type) de la spécification du langage ECMAScript.

#### `napi_create_symbol` {#napi_create_symbol}

**Ajouté dans : v8.0.0**

**Version N-API : 1**

```C [C]
napi_status napi_create_symbol(napi_env env,
                               napi_value description,
                               napi_value* result)
```
- `[in] env` : L'environnement dans lequel l'API est invoquée.
- `[in] description` : `napi_value` optionnel qui fait référence à une `string` JavaScript à définir comme description du symbole.
- `[out] result` : Un `napi_value` représentant un `symbol` JavaScript.

Retourne `napi_ok` si l'API a réussi.

Cette API crée une valeur `symbol` JavaScript à partir d'une chaîne C encodée en UTF8.

Le type `symbol` JavaScript est décrit dans [Section 19.4](https://tc39.github.io/ecma262/#sec-symbol-objects) de la spécification du langage ECMAScript.

#### `node_api_symbol_for` {#node_api_symbol_for}

**Ajouté dans : v17.5.0, v16.15.0**

**Version N-API : 9**

```C [C]
napi_status node_api_symbol_for(napi_env env,
                                const char* utf8description,
                                size_t length,
                                napi_value* result)
```
- `[in] env` : L'environnement dans lequel l'API est invoquée.
- `[in] utf8description` : Chaîne C UTF-8 représentant le texte à utiliser comme description du symbole.
- `[in] length` : La longueur de la chaîne de description en octets, ou `NAPI_AUTO_LENGTH` si elle est terminée par un caractère nul.
- `[out] result` : Un `napi_value` représentant un `symbol` JavaScript.

Retourne `napi_ok` si l'API a réussi.

Cette API recherche dans le registre global un symbole existant avec la description donnée. Si le symbole existe déjà, il sera retourné, sinon un nouveau symbole sera créé dans le registre.

Le type `symbol` JavaScript est décrit dans [Section 19.4](https://tc39.github.io/ecma262/#sec-symbol-objects) de la spécification du langage ECMAScript.


#### `napi_create_typedarray` {#napi_create_typedarray}

**Ajouté dans : v8.0.0**

**Version N-API : 1**

```C [C]
napi_status napi_create_typedarray(napi_env env,
                                   napi_typedarray_type type,
                                   size_t length,
                                   napi_value arraybuffer,
                                   size_t byte_offset,
                                   napi_value* result)
```
- `[in] env` : L’environnement sous lequel l’API est appelée.
- `[in] type` : Type de données scalaires des éléments au sein de `TypedArray`.
- `[in] length` : Nombre d’éléments dans le `TypedArray`.
- `[in] arraybuffer` : `ArrayBuffer` sous-jacent au tableau typé.
- `[in] byte_offset` : Décalage d’octet dans le `ArrayBuffer` à partir duquel commencer à projeter le `TypedArray`.
- `[out] result` : Un `napi_value` représentant un `TypedArray` JavaScript.

Renvoie `napi_ok` si l’API a réussi.

Cette API crée un objet JavaScript `TypedArray` sur un `ArrayBuffer` existant. Les objets `TypedArray` fournissent une vue de type tableau sur une mémoire tampon de données sous-jacente où chaque élément a le même type de données scalaires binaires sous-jacent.

Il est nécessaire que `(length * size_of_element) + byte_offset` soit \<= la taille en octets du tableau passé. Si ce n’est pas le cas, une exception `RangeError` est levée.

Les objets JavaScript `TypedArray` sont décrits dans [Section 22.2](https://tc39.github.io/ecma262/#sec-typedarray-objects) de la spécification du langage ECMAScript.

#### `node_api_create_buffer_from_arraybuffer` {#node_api_create_buffer_from_arraybuffer}

**Ajouté dans : v23.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stability: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

```C [C]
napi_status NAPI_CDECL node_api_create_buffer_from_arraybuffer(napi_env env,
                                                              napi_value arraybuffer,
                                                              size_t byte_offset,
                                                              size_t byte_length,
                                                              napi_value* result)
```
- **<code>[in] env</code>**: L’environnement sous lequel l’API est appelée.
- **<code>[in] arraybuffer</code>**: Le `ArrayBuffer` à partir duquel le buffer sera créé.
- **<code>[in] byte_offset</code>**: Le décalage d’octet dans le `ArrayBuffer` à partir duquel commencer à créer le buffer.
- **<code>[in] byte_length</code>**: La longueur en octets du buffer à créer à partir du `ArrayBuffer`.
- **<code>[out] result</code>**: Un `napi_value` représentant l’objet JavaScript `Buffer` créé.

Renvoie `napi_ok` si l’API a réussi.

Cette API crée un objet JavaScript `Buffer` à partir d’un `ArrayBuffer` existant. L’objet `Buffer` est une classe spécifique à Node.js qui fournit un moyen de travailler directement avec des données binaires en JavaScript.

La plage d’octets `[byte_offset, byte_offset + byte_length)` doit se trouver dans les limites de `ArrayBuffer`. Si `byte_offset + byte_length` dépasse la taille de `ArrayBuffer`, une exception `RangeError` est levée.


#### `napi_create_dataview` {#napi_create_dataview}

**Ajouté dans : v8.3.0**

**Version N-API : 1**

```C [C]
napi_status napi_create_dataview(napi_env env,
                                 size_t byte_length,
                                 napi_value arraybuffer,
                                 size_t byte_offset,
                                 napi_value* result)
```
- `[in] env` : L'environnement dans lequel l'API est appelée.
- `[in] length` : Nombre d'éléments dans le `DataView`.
- `[in] arraybuffer` : `ArrayBuffer` sous-jacent au `DataView`.
- `[in] byte_offset` : Le décalage d'octet dans le `ArrayBuffer` à partir duquel commencer à projeter le `DataView`.
- `[out] result` : Un `napi_value` représentant un `DataView` JavaScript.

Renvoie `napi_ok` si l'API a réussi.

Cette API crée un objet JavaScript `DataView` sur un `ArrayBuffer` existant. Les objets `DataView` fournissent une vue de type tableau sur une mémoire tampon de données sous-jacente, mais une vue qui autorise les éléments de taille et de type différents dans le `ArrayBuffer`.

Il est impératif que `byte_length + byte_offset` soit inférieur ou égal à la taille en octets du tableau passé en paramètre. Sinon, une exception `RangeError` est levée.

Les objets JavaScript `DataView` sont décrits dans la [Section 24.3](https://tc39.github.io/ecma262/#sec-dataview-objects) de la spécification du langage ECMAScript.

### Fonctions pour convertir des types C en Node-API {#functions-to-convert-from-c-types-to-node-api}

#### `napi_create_int32` {#napi_create_int32}

**Ajouté dans : v8.4.0**

**Version N-API : 1**

```C [C]
napi_status napi_create_int32(napi_env env, int32_t value, napi_value* result)
```
- `[in] env` : L'environnement dans lequel l'API est appelée.
- `[in] value` : Valeur entière à représenter en JavaScript.
- `[out] result` : Un `napi_value` représentant un `number` JavaScript.

Renvoie `napi_ok` si l'API a réussi.

Cette API est utilisée pour convertir le type C `int32_t` en type JavaScript `number`.

Le type JavaScript `number` est décrit dans la [Section 6.1.6](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-number-type) de la spécification du langage ECMAScript.


#### `napi_create_uint32` {#napi_create_uint32}

**Ajouté dans : v8.4.0**

**Version N-API : 1**

```C [C]
napi_status napi_create_uint32(napi_env env, uint32_t value, napi_value* result)
```
- `[in] env` : L’environnement dans lequel l’API est appelée.
- `[in] value` : Valeur d’entier non signée à représenter en JavaScript.
- `[out] result` : Un `napi_value` représentant un `number` JavaScript.

Renvoie `napi_ok` si l’API a réussi.

Cette API est utilisée pour convertir le type C `uint32_t` en type `number` JavaScript.

Le type `number` JavaScript est décrit dans [Section 6.1.6](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-number-type) de la spécification du langage ECMAScript.

#### `napi_create_int64` {#napi_create_int64}

**Ajouté dans : v8.4.0**

**Version N-API : 1**

```C [C]
napi_status napi_create_int64(napi_env env, int64_t value, napi_value* result)
```
- `[in] env` : L’environnement dans lequel l’API est appelée.
- `[in] value` : Valeur d’entier à représenter en JavaScript.
- `[out] result` : Un `napi_value` représentant un `number` JavaScript.

Renvoie `napi_ok` si l’API a réussi.

Cette API est utilisée pour convertir le type C `int64_t` en type `number` JavaScript.

Le type `number` JavaScript est décrit dans [Section 6.1.6](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-number-type) de la spécification du langage ECMAScript. Notez que la plage complète de `int64_t` ne peut pas être représentée avec une précision totale en JavaScript. Les valeurs entières en dehors de la plage de [`Number.MIN_SAFE_INTEGER`](https://tc39.github.io/ecma262/#sec-number.min_safe_integer) `-(2**53 - 1)` - [`Number.MAX_SAFE_INTEGER`](https://tc39.github.io/ecma262/#sec-number.max_safe_integer) `(2**53 - 1)` perdront en précision.

#### `napi_create_double` {#napi_create_double}

**Ajouté dans : v8.4.0**

**Version N-API : 1**

```C [C]
napi_status napi_create_double(napi_env env, double value, napi_value* result)
```
- `[in] env` : L’environnement dans lequel l’API est appelée.
- `[in] value` : Valeur de précision double à représenter en JavaScript.
- `[out] result` : Un `napi_value` représentant un `number` JavaScript.

Renvoie `napi_ok` si l’API a réussi.

Cette API est utilisée pour convertir le type C `double` en type `number` JavaScript.

Le type `number` JavaScript est décrit dans [Section 6.1.6](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-number-type) de la spécification du langage ECMAScript.


#### `napi_create_bigint_int64` {#napi_create_bigint_int64}

**Ajouté dans : v10.7.0**

**Version N-API : 6**

```C [C]
napi_status napi_create_bigint_int64(napi_env env,
                                     int64_t value,
                                     napi_value* result);
```
- `[in] env` : l’environnement dans lequel l’API est appelée.
- `[in] value` : valeur entière à représenter en JavaScript.
- `[out] result` : un `napi_value` représentant un `BigInt` JavaScript.

Renvoie `napi_ok` si l’API a réussi.

Cette API convertit le type C `int64_t` en type JavaScript `BigInt`.

#### `napi_create_bigint_uint64` {#napi_create_bigint_uint64}

**Ajouté dans : v10.7.0**

**Version N-API : 6**

```C [C]
napi_status napi_create_bigint_uint64(napi_env env,
                                      uint64_t value,
                                      napi_value* result);
```
- `[in] env` : l’environnement dans lequel l’API est appelée.
- `[in] value` : valeur entière non signée à représenter en JavaScript.
- `[out] result` : un `napi_value` représentant un `BigInt` JavaScript.

Renvoie `napi_ok` si l’API a réussi.

Cette API convertit le type C `uint64_t` en type JavaScript `BigInt`.

#### `napi_create_bigint_words` {#napi_create_bigint_words}

**Ajouté dans : v10.7.0**

**Version N-API : 6**

```C [C]
napi_status napi_create_bigint_words(napi_env env,
                                     int sign_bit,
                                     size_t word_count,
                                     const uint64_t* words,
                                     napi_value* result);
```
- `[in] env` : l’environnement dans lequel l’API est appelée.
- `[in] sign_bit` : détermine si le `BigInt` résultant sera positif ou négatif.
- `[in] word_count` : la longueur du tableau `words`.
- `[in] words` : un tableau de mots little-endian 64 bits `uint64_t`.
- `[out] result` : un `napi_value` représentant un `BigInt` JavaScript.

Renvoie `napi_ok` si l’API a réussi.

Cette API convertit un tableau de mots non signés de 64 bits en une seule valeur `BigInt`.

Le `BigInt` résultant est calculé comme suit : (–1) (`words[0]` × (2) + `words[1]` × (2) + …)


#### `napi_create_string_latin1` {#napi_create_string_latin1}

**Ajoutée dans : v8.0.0**

**Version N-API : 1**

```C [C]
napi_status napi_create_string_latin1(napi_env env,
                                      const char* str,
                                      size_t length,
                                      napi_value* result);
```
- `[in] env` : l’environnement dans lequel l’API est appelée.
- `[in] str` : tampon de caractères représentant une chaîne encodée en ISO-8859-1.
- `[in] length` : la longueur de la chaîne en octets, ou `NAPI_AUTO_LENGTH` si elle est terminée par un caractère nul.
- `[out] result` : un `napi_value` représentant une `string` JavaScript.

Renvoie `napi_ok` si l’API a réussi.

Cette API crée une valeur `string` JavaScript à partir d’une chaîne C encodée en ISO-8859-1. La chaîne native est copiée.

Le type `string` JavaScript est décrit dans la [Section 6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type) de la spécification du langage ECMAScript.

#### `node_api_create_external_string_latin1` {#node_api_create_external_string_latin1}

**Ajoutée dans : v20.4.0, v18.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
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
- `[in] env` : l’environnement dans lequel l’API est appelée.
- `[in] str` : tampon de caractères représentant une chaîne encodée en ISO-8859-1.
- `[in] length` : la longueur de la chaîne en octets, ou `NAPI_AUTO_LENGTH` si elle est terminée par un caractère nul.
- `[in] finalize_callback` : la fonction à appeler lorsque la chaîne est en cours de collecte. La fonction sera appelée avec les paramètres suivants :
    - `[in] env` : l’environnement dans lequel le module complémentaire s’exécute. Cette valeur peut être nulle si la chaîne est en cours de collecte dans le cadre de la terminaison du worker ou de l’instance principale de Node.js.
    - `[in] data` : il s’agit de la valeur `str` en tant que pointeur `void*`.
    - `[in] finalize_hint` : il s’agit de la valeur `finalize_hint` qui a été fournie à l’API. [`napi_finalize`](/fr/nodejs/api/n-api#napi_finalize) fournit plus de détails. Ce paramètre est facultatif. Le passage d’une valeur nulle signifie que le module complémentaire n’a pas besoin d’être averti lorsque la chaîne JavaScript correspondante est collectée.


- `[in] finalize_hint` : indicateur facultatif à transmettre à la fonction de rappel finalize lors de la collecte.
- `[out] result` : un `napi_value` représentant une `string` JavaScript.
- `[out] copied` : indique si la chaîne a été copiée. Si c’est le cas, le finaliseur aura déjà été invoqué pour détruire `str`.

Renvoie `napi_ok` si l’API a réussi.

Cette API crée une valeur `string` JavaScript à partir d’une chaîne C encodée en ISO-8859-1. La chaîne native peut ne pas être copiée et doit donc exister pendant tout le cycle de vie de la valeur JavaScript.

Le type `string` JavaScript est décrit dans la [Section 6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type) de la spécification du langage ECMAScript.


#### `napi_create_string_utf16` {#napi_create_string_utf16}

**Ajoutée dans : v8.0.0**

**Version N-API : 1**

```C [C]
napi_status napi_create_string_utf16(napi_env env,
                                     const char16_t* str,
                                     size_t length,
                                     napi_value* result)
```
- `[in] env` : l’environnement dans lequel l’API est appelée.
- `[in] str` : tampon de caractères représentant une chaîne encodée en UTF16-LE.
- `[in] length` : la longueur de la chaîne en unités de code de deux octets, ou `NAPI_AUTO_LENGTH` si elle est terminée par un caractère nul.
- `[out] result` : une `napi_value` représentant une `string` JavaScript.

Retourne `napi_ok` si l’API a réussi.

Cette API crée une valeur `string` JavaScript à partir d’une chaîne C encodée en UTF16-LE. La chaîne native est copiée.

Le type `string` JavaScript est décrit dans la [Section 6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type) de la spécification du langage ECMAScript.

#### `node_api_create_external_string_utf16` {#node_api_create_external_string_utf16}

**Ajoutée dans : v20.4.0, v18.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stability: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
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
- `[in] env` : l’environnement dans lequel l’API est appelée.
- `[in] str` : tampon de caractères représentant une chaîne encodée en UTF16-LE.
- `[in] length` : la longueur de la chaîne en unités de code de deux octets, ou `NAPI_AUTO_LENGTH` si elle est terminée par un caractère nul.
- `[in] finalize_callback` : la fonction à appeler lorsque la chaîne est collectée. La fonction sera appelée avec les paramètres suivants :
    - `[in] env` : l’environnement dans lequel le module complémentaire s’exécute. Cette valeur peut être null si la chaîne est collectée dans le cadre de la terminaison du worker ou de l’instance Node.js principale.
    - `[in] data` : il s’agit de la valeur `str` en tant que pointeur `void*`.
    - `[in] finalize_hint` : il s’agit de la valeur `finalize_hint` qui a été transmise à l’API. [`napi_finalize`](/fr/nodejs/api/n-api#napi_finalize) fournit plus de détails. Ce paramètre est facultatif. Le fait de transmettre une valeur null signifie que le module complémentaire n’a pas besoin d’être averti lorsque la chaîne JavaScript correspondante est collectée.
  
 
- `[in] finalize_hint` : indication facultative à transmettre au rappel de finalisation lors de la collecte.
- `[out] result` : une `napi_value` représentant une `string` JavaScript.
- `[out] copied` : indique si la chaîne a été copiée. Si c’est le cas, le finaliseur aura déjà été appelé pour détruire `str`.

Retourne `napi_ok` si l’API a réussi.

Cette API crée une valeur `string` JavaScript à partir d’une chaîne C encodée en UTF16-LE. La chaîne native peut ne pas être copiée et doit donc exister pendant tout le cycle de vie de la valeur JavaScript.

Le type `string` JavaScript est décrit dans la [Section 6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type) de la spécification du langage ECMAScript.


#### `napi_create_string_utf8` {#napi_create_string_utf8}

**Ajoutée dans : v8.0.0**

**Version N-API : 1**

```C [C]
napi_status napi_create_string_utf8(napi_env env,
                                    const char* str,
                                    size_t length,
                                    napi_value* result)
```
- `[in] env` : L'environnement dans lequel l'API est invoquée.
- `[in] str` : Tampon de caractères représentant une chaîne encodée en UTF8.
- `[in] length` : La longueur de la chaîne en octets, ou `NAPI_AUTO_LENGTH` si elle est terminée par un caractère nul.
- `[out] result` : Une `napi_value` représentant une `string` JavaScript.

Retourne `napi_ok` si l'API a réussi.

Cette API crée une valeur `string` JavaScript à partir d'une chaîne C encodée en UTF8. La chaîne native est copiée.

Le type `string` JavaScript est décrit dans la [Section 6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type) de la spécification du langage ECMAScript.

### Fonctions pour créer des clés de propriété optimisées {#functions-to-create-optimized-property-keys}

De nombreux moteurs JavaScript, y compris V8, utilisent des chaînes internalisées comme clés pour définir et obtenir les valeurs des propriétés. Ils utilisent généralement une table de hachage pour créer et rechercher ces chaînes. Bien que cela ajoute un certain coût par création de clé, cela améliore les performances par la suite en permettant la comparaison des pointeurs de chaîne au lieu des chaînes entières.

Si une nouvelle chaîne JavaScript est destinée à être utilisée comme clé de propriété, il sera plus efficace pour certains moteurs JavaScript d'utiliser les fonctions de cette section. Sinon, utilisez les fonctions de la série `napi_create_string_utf8` ou `node_api_create_external_string_utf8`, car il peut y avoir des frais supplémentaires lors de la création/du stockage de chaînes avec les méthodes de création de clés de propriété.

#### `node_api_create_property_key_latin1` {#node_api_create_property_key_latin1}

**Ajoutée dans : v22.9.0, v20.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité: 1](/fr/nodejs/api/documentation#stability-index) - Expérimentale
:::

```C [C]
napi_status NAPI_CDECL node_api_create_property_key_latin1(napi_env env,
                                                           const char* str,
                                                           size_t length,
                                                           napi_value* result);
```
- `[in] env` : L'environnement dans lequel l'API est invoquée.
- `[in] str` : Tampon de caractères représentant une chaîne encodée en ISO-8859-1.
- `[in] length` : La longueur de la chaîne en octets, ou `NAPI_AUTO_LENGTH` si elle est terminée par un caractère nul.
- `[out] result` : Une `napi_value` représentant une `string` JavaScript optimisée à utiliser comme clé de propriété pour les objets.

Retourne `napi_ok` si l'API a réussi.

Cette API crée une valeur `string` JavaScript optimisée à partir d'une chaîne C encodée en ISO-8859-1 à utiliser comme clé de propriété pour les objets. La chaîne native est copiée. Contrairement à `napi_create_string_latin1`, les appels ultérieurs à cette fonction avec le même pointeur `str` peuvent bénéficier d'une accélération de la création de la `napi_value` demandée, selon le moteur.

Le type `string` JavaScript est décrit dans la [Section 6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type) de la spécification du langage ECMAScript.


#### `node_api_create_property_key_utf16` {#node_api_create_property_key_utf16}

**Ajouté dans : v21.7.0, v20.12.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stability: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

```C [C]
napi_status NAPI_CDECL node_api_create_property_key_utf16(napi_env env,
                                                          const char16_t* str,
                                                          size_t length,
                                                          napi_value* result);
```
- `[in] env`: L'environnement dans lequel l'API est invoquée.
- `[in] str`: Tampon de caractères représentant une chaîne encodée en UTF16-LE.
- `[in] length`: La longueur de la chaîne en unités de code de deux octets, ou `NAPI_AUTO_LENGTH` si elle est terminée par un caractère nul.
- `[out] result`: Un `napi_value` représentant une `string` JavaScript optimisée à utiliser comme clé de propriété pour les objets.

Renvoie `napi_ok` si l'API a réussi.

Cette API crée une valeur `string` JavaScript optimisée à partir d'une chaîne C encodée en UTF16-LE à utiliser comme clé de propriété pour les objets. La chaîne native est copiée.

Le type `string` JavaScript est décrit dans la [Section 6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type) de la spécification du langage ECMAScript.

#### `node_api_create_property_key_utf8` {#node_api_create_property_key_utf8}

**Ajouté dans : v22.9.0, v20.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stability: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

```C [C]
napi_status NAPI_CDECL node_api_create_property_key_utf8(napi_env env,
                                                         const char* str,
                                                         size_t length,
                                                         napi_value* result);
```
- `[in] env`: L'environnement dans lequel l'API est invoquée.
- `[in] str`: Tampon de caractères représentant une chaîne encodée en UTF8.
- `[in] length`: La longueur de la chaîne en unités de code de deux octets, ou `NAPI_AUTO_LENGTH` si elle est terminée par un caractère nul.
- `[out] result`: Un `napi_value` représentant une `string` JavaScript optimisée à utiliser comme clé de propriété pour les objets.

Renvoie `napi_ok` si l'API a réussi.

Cette API crée une valeur `string` JavaScript optimisée à partir d'une chaîne C encodée en UTF8 à utiliser comme clé de propriété pour les objets. La chaîne native est copiée.

Le type `string` JavaScript est décrit dans la [Section 6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type) de la spécification du langage ECMAScript.


### Fonctions pour la conversion de Node-API vers les types C {#functions-to-convert-from-node-api-to-c-types}

#### `napi_get_array_length` {#napi_get_array_length}

**Ajouté dans : v8.0.0**

**Version N-API : 1**

```C [C]
napi_status napi_get_array_length(napi_env env,
                                  napi_value value,
                                  uint32_t* result)
```
- `[in] env`: L'environnement dans lequel l'API est invoquée.
- `[in] value`: `napi_value` représentant le `Array` JavaScript dont la longueur est interrogée.
- `[out] result`: `uint32` représentant la longueur du tableau.

Retourne `napi_ok` si l'API a réussi.

Cette API renvoie la longueur d'un tableau.

La longueur du `Array` est décrite dans la [Section 22.1.4.1](https://tc39.github.io/ecma262/#sec-properties-of-array-instances-length) de la spécification du langage ECMAScript.

#### `napi_get_arraybuffer_info` {#napi_get_arraybuffer_info}

**Ajouté dans : v8.0.0**

**Version N-API : 1**

```C [C]
napi_status napi_get_arraybuffer_info(napi_env env,
                                      napi_value arraybuffer,
                                      void** data,
                                      size_t* byte_length)
```
- `[in] env`: L'environnement dans lequel l'API est invoquée.
- `[in] arraybuffer`: `napi_value` représentant le `ArrayBuffer` interrogé.
- `[out] data`: Le tampon de données sous-jacent du `ArrayBuffer`. Si byte_length est `0`, cela peut être `NULL` ou toute autre valeur de pointeur.
- `[out] byte_length`: Longueur en octets du tampon de données sous-jacent.

Retourne `napi_ok` si l'API a réussi.

Cette API est utilisée pour récupérer le tampon de données sous-jacent d'un `ArrayBuffer` et sa longueur.

*AVERTISSEMENT*: Soyez prudent lors de l'utilisation de cette API. La durée de vie du tampon de données sous-jacent est gérée par le `ArrayBuffer` même après son retour. Une façon sûre possible d'utiliser cette API est conjointement avec [`napi_create_reference`](/fr/nodejs/api/n-api#napi_create_reference), qui peut être utilisé pour garantir le contrôle sur la durée de vie du `ArrayBuffer`. Il est également sûr d'utiliser le tampon de données renvoyé dans le même rappel tant qu'il n'y a pas d'appels à d'autres API susceptibles de déclencher un GC.


#### `napi_get_buffer_info` {#napi_get_buffer_info}

**Ajouté dans : v8.0.0**

**Version N-API : 1**

```C [C]
napi_status napi_get_buffer_info(napi_env env,
                                 napi_value value,
                                 void** data,
                                 size_t* length)
```
- `[in] env` : L’environnement sous lequel l’API est appelée.
- `[in] value` : `napi_value` représentant le `node::Buffer` ou `Uint8Array` interrogé.
- `[out] data` : Le tampon de données sous-jacent du `node::Buffer` ou `Uint8Array`. Si la longueur est `0`, cela peut être `NULL` ou toute autre valeur de pointeur.
- `[out] length` : Longueur en octets du tampon de données sous-jacent.

Renvoie `napi_ok` si l’API a réussi.

Cette méthode renvoie les mêmes `data` et `byte_length` que [`napi_get_typedarray_info`](/fr/nodejs/api/n-api#napi_get_typedarray_info). Et `napi_get_typedarray_info` accepte également un `node::Buffer` (un Uint8Array) comme valeur.

Cette API est utilisée pour récupérer le tampon de données sous-jacent d’un `node::Buffer` et sa longueur.

*Avertissement* : Soyez prudent lors de l’utilisation de cette API, car la durée de vie du tampon de données sous-jacent n’est pas garantie s’il est géré par la machine virtuelle.

#### `napi_get_prototype` {#napi_get_prototype}

**Ajouté dans : v8.0.0**

**Version N-API : 1**

```C [C]
napi_status napi_get_prototype(napi_env env,
                               napi_value object,
                               napi_value* result)
```
- `[in] env` : L’environnement sous lequel l’API est appelée.
- `[in] object` : `napi_value` représentant l’objet JavaScript `Object` dont le prototype doit être renvoyé. Ceci renvoie l’équivalent de `Object.getPrototypeOf` (qui n’est pas la même chose que la propriété `prototype` de la fonction).
- `[out] result` : `napi_value` représentant le prototype de l’objet donné.

Renvoie `napi_ok` si l’API a réussi.

#### `napi_get_typedarray_info` {#napi_get_typedarray_info}

**Ajouté dans : v8.0.0**

**Version N-API : 1**

```C [C]
napi_status napi_get_typedarray_info(napi_env env,
                                     napi_value typedarray,
                                     napi_typedarray_type* type,
                                     size_t* length,
                                     void** data,
                                     napi_value* arraybuffer,
                                     size_t* byte_offset)
```
- `[in] env` : L’environnement sous lequel l’API est appelée.
- `[in] typedarray` : `napi_value` représentant le `TypedArray` dont les propriétés doivent être interrogées.
- `[out] type` : Type de données scalaires des éléments dans le `TypedArray`.
- `[out] length` : Le nombre d’éléments dans le `TypedArray`.
- `[out] data` : Le tampon de données sous-jacent au `TypedArray` ajusté par la valeur `byte_offset` afin qu’il pointe vers le premier élément du `TypedArray`. Si la longueur du tableau est `0`, cela peut être `NULL` ou toute autre valeur de pointeur.
- `[out] arraybuffer` : Le `ArrayBuffer` sous-jacent au `TypedArray`.
- `[out] byte_offset` : L’offset d’octet dans le tableau natif sous-jacent auquel se trouve le premier élément des tableaux. La valeur du paramètre de données a déjà été ajustée de sorte que les données pointent vers le premier élément du tableau. Par conséquent, le premier octet du tableau natif serait à `data - byte_offset`.

Renvoie `napi_ok` si l’API a réussi.

Cette API renvoie diverses propriétés d’un tableau typé.

N’importe lequel des paramètres out peut être `NULL` si cette propriété n’est pas nécessaire.

*Avertissement* : Soyez prudent lors de l’utilisation de cette API, car le tampon de données sous-jacent est géré par la machine virtuelle.


#### `napi_get_dataview_info` {#napi_get_dataview_info}

**Ajouté dans : v8.3.0**

**Version N-API : 1**

```C [C]
napi_status napi_get_dataview_info(napi_env env,
                                   napi_value dataview,
                                   size_t* byte_length,
                                   void** data,
                                   napi_value* arraybuffer,
                                   size_t* byte_offset)
```
- `[in] env`: L'environnement dans lequel l'API est invoquée.
- `[in] dataview`: `napi_value` représentant le `DataView` dont les propriétés doivent être interrogées.
- `[out] byte_length`: Nombre d'octets dans le `DataView`.
- `[out] data`: Le tampon de données sous-jacent au `DataView`. Si byte_length est `0`, cela peut être `NULL` ou toute autre valeur de pointeur.
- `[out] arraybuffer`: `ArrayBuffer` sous-jacent au `DataView`.
- `[out] byte_offset`: Le décalage d'octet dans le tampon de données à partir duquel commencer à projeter le `DataView`.

Renvoie `napi_ok` si l'API a réussi.

N'importe lequel des paramètres de sortie peut être `NULL` si cette propriété n'est pas nécessaire.

Cette API renvoie diverses propriétés d'un `DataView`.

#### `napi_get_date_value` {#napi_get_date_value}

**Ajouté dans : v11.11.0, v10.17.0**

**Version N-API : 5**

```C [C]
napi_status napi_get_date_value(napi_env env,
                                napi_value value,
                                double* result)
```
- `[in] env`: L'environnement dans lequel l'API est invoquée.
- `[in] value`: `napi_value` représentant une `Date` JavaScript.
- `[out] result`: Valeur temporelle en tant que `double` représentée en millisecondes depuis minuit au début du 1er janvier 1970 UTC.

Cette API n'observe pas les secondes intercalaires ; elles sont ignorées, car ECMAScript s'aligne sur la spécification de temps POSIX.

Renvoie `napi_ok` si l'API a réussi. Si une `napi_value` qui n'est pas une date est transmise, elle renvoie `napi_date_expected`.

Cette API renvoie la primitive C double de la valeur temporelle pour la `Date` JavaScript donnée.

#### `napi_get_value_bool` {#napi_get_value_bool}

**Ajouté dans : v8.0.0**

**Version N-API : 1**

```C [C]
napi_status napi_get_value_bool(napi_env env, napi_value value, bool* result)
```
- `[in] env`: L'environnement dans lequel l'API est invoquée.
- `[in] value`: `napi_value` représentant un `Boolean` JavaScript.
- `[out] result`: Primitive booléenne C équivalente au `Boolean` JavaScript donné.

Renvoie `napi_ok` si l'API a réussi. Si une `napi_value` non booléenne est transmise, elle renvoie `napi_boolean_expected`.

Cette API renvoie la primitive booléenne C équivalente du `Boolean` JavaScript donné.


#### `napi_get_value_double` {#napi_get_value_double}

**Ajoutée dans : v8.0.0**

**Version N-API : 1**

```C [C]
napi_status napi_get_value_double(napi_env env,
                                  napi_value value,
                                  double* result)
```
- `[in] env` : l’environnement dans lequel l’API est invoquée.
- `[in] value` : `napi_value` représentant un `number` JavaScript.
- `[out] result` : primitive C double équivalente au `number` JavaScript donné.

Retourne `napi_ok` si l’API a réussi. Si une `napi_value` non-nombre est passée, elle retourne `napi_number_expected`.

Cette API renvoie l’équivalent primitif C double du `number` JavaScript donné.

#### `napi_get_value_bigint_int64` {#napi_get_value_bigint_int64}

**Ajoutée dans : v10.7.0**

**Version N-API : 6**

```C [C]
napi_status napi_get_value_bigint_int64(napi_env env,
                                        napi_value value,
                                        int64_t* result,
                                        bool* lossless);
```
- `[in] env` : l’environnement dans lequel l’API est invoquée.
- `[in] value` : `napi_value` représentant un `BigInt` JavaScript.
- `[out] result` : primitive C `int64_t` équivalente au `BigInt` JavaScript donné.
- `[out] lossless` : indique si la valeur `BigInt` a été convertie sans perte.

Retourne `napi_ok` si l’API a réussi. Si un non-`BigInt` est passé, elle retourne `napi_bigint_expected`.

Cette API renvoie la primitive C `int64_t` équivalente au `BigInt` JavaScript donné. Si nécessaire, elle tronquera la valeur, en définissant `lossless` sur `false`.

#### `napi_get_value_bigint_uint64` {#napi_get_value_bigint_uint64}

**Ajoutée dans : v10.7.0**

**Version N-API : 6**

```C [C]
napi_status napi_get_value_bigint_uint64(napi_env env,
                                        napi_value value,
                                        uint64_t* result,
                                        bool* lossless);
```
- `[in] env` : l’environnement dans lequel l’API est invoquée.
- `[in] value` : `napi_value` représentant un `BigInt` JavaScript.
- `[out] result` : primitive C `uint64_t` équivalente au `BigInt` JavaScript donné.
- `[out] lossless` : indique si la valeur `BigInt` a été convertie sans perte.

Retourne `napi_ok` si l’API a réussi. Si un non-`BigInt` est passé, elle retourne `napi_bigint_expected`.

Cette API renvoie la primitive C `uint64_t` équivalente au `BigInt` JavaScript donné. Si nécessaire, elle tronquera la valeur, en définissant `lossless` sur `false`.


#### `napi_get_value_bigint_words` {#napi_get_value_bigint_words}

**Ajouté dans : v10.7.0**

**Version N-API : 6**

```C [C]
napi_status napi_get_value_bigint_words(napi_env env,
                                        napi_value value,
                                        int* sign_bit,
                                        size_t* word_count,
                                        uint64_t* words);
```
- `[in] env`: L'environnement dans lequel l'API est invoquée.
- `[in] value`: `napi_value` représentant un `BigInt` JavaScript.
- `[out] sign_bit`: Entier représentant si le `BigInt` JavaScript est positif ou négatif.
- `[in/out] word_count`: Doit être initialisé à la longueur du tableau `words`. Lors du retour, il sera défini sur le nombre réel de mots qui seraient nécessaires pour stocker ce `BigInt`.
- `[out] words`: Pointeur vers un tableau de mots 64 bits pré-alloué.

Renvoie `napi_ok` si l'API a réussi.

Cette API convertit une seule valeur `BigInt` en un bit de signe, un tableau little-endian 64 bits et le nombre d'éléments dans le tableau. `sign_bit` et `words` peuvent tous deux être définis sur `NULL`, afin d'obtenir uniquement `word_count`.

#### `napi_get_value_external` {#napi_get_value_external}

**Ajouté dans : v8.0.0**

**Version N-API : 1**

```C [C]
napi_status napi_get_value_external(napi_env env,
                                    napi_value value,
                                    void** result)
```
- `[in] env`: L'environnement dans lequel l'API est invoquée.
- `[in] value`: `napi_value` représentant une valeur externe JavaScript.
- `[out] result`: Pointeur vers les données encapsulées par la valeur externe JavaScript.

Renvoie `napi_ok` si l'API a réussi. Si un `napi_value` non externe est passé, elle renvoie `napi_invalid_arg`.

Cette API récupère le pointeur de données externes qui a été précédemment passé à `napi_create_external()`.

#### `napi_get_value_int32` {#napi_get_value_int32}

**Ajouté dans : v8.0.0**

**Version N-API : 1**

```C [C]
napi_status napi_get_value_int32(napi_env env,
                                 napi_value value,
                                 int32_t* result)
```
- `[in] env`: L'environnement dans lequel l'API est invoquée.
- `[in] value`: `napi_value` représentant un `number` JavaScript.
- `[out] result`: Primitive C `int32` équivalente du `number` JavaScript donné.

Renvoie `napi_ok` si l'API a réussi. Si un `napi_value` non-nombre est passé, `napi_number_expected`.

Cette API renvoie la primitive C `int32` équivalente du `number` JavaScript donné.

Si le nombre dépasse la plage de l'entier 32 bits, le résultat est tronqué à l'équivalent des 32 bits inférieurs. Cela peut entraîner la transformation d'un grand nombre positif en nombre négatif si la valeur est > 2 - 1.

Les valeurs numériques non finies (`NaN`, `+Infinity` ou `-Infinity`) définissent le résultat sur zéro.


#### `napi_get_value_int64` {#napi_get_value_int64}

**Ajouté dans : v8.0.0**

**Version N-API : 1**

```C [C]
napi_status napi_get_value_int64(napi_env env,
                                 napi_value value,
                                 int64_t* result)
```
- `[in] env`: L'environnement dans lequel l'API est invoquée.
- `[in] value`: `napi_value` représentant un `number` JavaScript.
- `[out] result`: Primitive C `int64` équivalente au `number` JavaScript donné.

Renvoie `napi_ok` si l'API a réussi. Si une `napi_value` non-numérique est passée, elle renvoie `napi_number_expected`.

Cette API renvoie la primitive C `int64` équivalente au `number` JavaScript donné.

Les valeurs `number` en dehors de la plage de [`Number.MIN_SAFE_INTEGER`](https://tc39.github.io/ecma262/#sec-number.min_safe_integer) `-(2**53 - 1)` - [`Number.MAX_SAFE_INTEGER`](https://tc39.github.io/ecma262/#sec-number.max_safe_integer) `(2**53 - 1)` perdront en précision.

Les valeurs numériques non finies (`NaN`, `+Infinity` ou `-Infinity`) définissent le résultat à zéro.

#### `napi_get_value_string_latin1` {#napi_get_value_string_latin1}

**Ajouté dans : v8.0.0**

**Version N-API : 1**

```C [C]
napi_status napi_get_value_string_latin1(napi_env env,
                                         napi_value value,
                                         char* buf,
                                         size_t bufsize,
                                         size_t* result)
```
- `[in] env`: L'environnement dans lequel l'API est invoquée.
- `[in] value`: `napi_value` représentant une chaîne JavaScript.
- `[in] buf`: Tampon dans lequel écrire la chaîne encodée en ISO-8859-1. Si `NULL` est passé, la longueur de la chaîne en octets, à l'exclusion du terminateur nul, est renvoyée dans `result`.
- `[in] bufsize`: Taille du tampon de destination. Lorsque cette valeur est insuffisante, la chaîne renvoyée est tronquée et terminée par un caractère nul.
- `[out] result`: Nombre d'octets copiés dans le tampon, à l'exclusion du terminateur nul.

Renvoie `napi_ok` si l'API a réussi. Si une `napi_value` non-`string` est passée, elle renvoie `napi_string_expected`.

Cette API renvoie la chaîne encodée en ISO-8859-1 correspondant à la valeur passée.


#### `napi_get_value_string_utf8` {#napi_get_value_string_utf8}

**Ajoutée dans : v8.0.0**

**Version N-API : 1**

```C [C]
napi_status napi_get_value_string_utf8(napi_env env,
                                       napi_value value,
                                       char* buf,
                                       size_t bufsize,
                                       size_t* result)
```
- `[in] env` : l’environnement dans lequel l’API est appelée.
- `[in] value` : `napi_value` représentant une chaîne JavaScript.
- `[in] buf` : tampon dans lequel écrire la chaîne encodée en UTF8. Si `NULL` est passé, la longueur de la chaîne en octets, sans compter le terminateur null, est renvoyée dans `result`.
- `[in] bufsize` : taille du tampon de destination. Lorsque cette valeur est insuffisante, la chaîne renvoyée est tronquée et terminée par null.
- `[out] result` : nombre d’octets copiés dans le tampon, sans compter le terminateur null.

Renvoie `napi_ok` si l’API a réussi. Si une `napi_value` non-`string` est passée, elle renvoie `napi_string_expected`.

Cette API renvoie la chaîne encodée en UTF8 correspondant à la valeur passée.

#### `napi_get_value_string_utf16` {#napi_get_value_string_utf16}

**Ajoutée dans : v8.0.0**

**Version N-API : 1**

```C [C]
napi_status napi_get_value_string_utf16(napi_env env,
                                        napi_value value,
                                        char16_t* buf,
                                        size_t bufsize,
                                        size_t* result)
```
- `[in] env` : l’environnement dans lequel l’API est appelée.
- `[in] value` : `napi_value` représentant une chaîne JavaScript.
- `[in] buf` : tampon dans lequel écrire la chaîne encodée en UTF16-LE. Si `NULL` est passé, la longueur de la chaîne en unités de code de 2 octets, sans compter le terminateur null, est renvoyée.
- `[in] bufsize` : taille du tampon de destination. Lorsque cette valeur est insuffisante, la chaîne renvoyée est tronquée et terminée par null.
- `[out] result` : nombre d’unités de code de 2 octets copiées dans le tampon, sans compter le terminateur null.

Renvoie `napi_ok` si l’API a réussi. Si une `napi_value` non-`string` est passée, elle renvoie `napi_string_expected`.

Cette API renvoie la chaîne encodée en UTF16 correspondant à la valeur passée.


#### `napi_get_value_uint32` {#napi_get_value_uint32}

**Ajouté dans : v8.0.0**

**Version N-API : 1**

```C [C]
napi_status napi_get_value_uint32(napi_env env,
                                  napi_value value,
                                  uint32_t* result)
```
- `[in] env` : l’environnement dans lequel l’API est appelée.
- `[in] value` : `napi_value` représentant le `number` JavaScript.
- `[out] result` : primitif C équivalent du `napi_value` donné sous forme de `uint32_t`.

Retourne `napi_ok` si l’API a réussi. Si un `napi_value` non numérique est passé, elle retourne `napi_number_expected`.

Cette API retourne le primitif C équivalent du `napi_value` donné sous forme de `uint32_t`.

### Fonctions pour obtenir des instances globales {#functions-to-get-global-instances}

#### `napi_get_boolean` {#napi_get_boolean}

**Ajouté dans : v8.0.0**

**Version N-API : 1**

```C [C]
napi_status napi_get_boolean(napi_env env, bool value, napi_value* result)
```
- `[in] env` : l’environnement dans lequel l’API est appelée.
- `[in] value` : la valeur du booléen à récupérer.
- `[out] result` : `napi_value` représentant le singleton `Boolean` JavaScript à récupérer.

Retourne `napi_ok` si l’API a réussi.

Cette API est utilisée pour retourner l’objet singleton JavaScript qui est utilisé pour représenter la valeur booléenne donnée.

#### `napi_get_global` {#napi_get_global}

**Ajouté dans : v8.0.0**

**Version N-API : 1**

```C [C]
napi_status napi_get_global(napi_env env, napi_value* result)
```
- `[in] env` : l’environnement dans lequel l’API est appelée.
- `[out] result` : `napi_value` représentant l’objet `global` JavaScript.

Retourne `napi_ok` si l’API a réussi.

Cette API retourne l’objet `global`.

#### `napi_get_null` {#napi_get_null}

**Ajouté dans : v8.0.0**

**Version N-API : 1**

```C [C]
napi_status napi_get_null(napi_env env, napi_value* result)
```
- `[in] env` : l’environnement dans lequel l’API est appelée.
- `[out] result` : `napi_value` représentant l’objet `null` JavaScript.

Retourne `napi_ok` si l’API a réussi.

Cette API retourne l’objet `null`.

#### `napi_get_undefined` {#napi_get_undefined}

**Ajouté dans : v8.0.0**

**Version N-API : 1**

```C [C]
napi_status napi_get_undefined(napi_env env, napi_value* result)
```
- `[in] env` : l’environnement dans lequel l’API est appelée.
- `[out] result` : `napi_value` représentant la valeur Undefined JavaScript.

Retourne `napi_ok` si l’API a réussi.

Cette API retourne l’objet Undefined.


## Travailler avec les valeurs JavaScript et les opérations abstraites {#working-with-javascript-values-and-abstract-operations}

Node-API expose un ensemble d'API pour effectuer certaines opérations abstraites sur les valeurs JavaScript. Certaines de ces opérations sont documentées dans la [Section 7](https://tc39.github.io/ecma262/#sec-abstract-operations) de la [Spécification du langage ECMAScript](https://tc39.github.io/ecma262/).

Ces API permettent de faire l'une des choses suivantes :

### `napi_coerce_to_bool` {#napi_coerce_to_bool}

**Ajouté dans : v8.0.0**

**Version N-API : 1**

```C [C]
napi_status napi_coerce_to_bool(napi_env env,
                                napi_value value,
                                napi_value* result)
```
- `[in] env` : L'environnement dans lequel l'API est invoquée.
- `[in] value` : La valeur JavaScript à forcer.
- `[out] result` : `napi_value` représentant le `Boolean` JavaScript forcé.

Renvoie `napi_ok` si l'API a réussi.

Cette API implémente l'opération abstraite `ToBoolean()` telle que définie dans la [Section 7.1.2](https://tc39.github.io/ecma262/#sec-toboolean) de la spécification du langage ECMAScript.

### `napi_coerce_to_number` {#napi_coerce_to_number}

**Ajouté dans : v8.0.0**

**Version N-API : 1**

```C [C]
napi_status napi_coerce_to_number(napi_env env,
                                  napi_value value,
                                  napi_value* result)
```
- `[in] env` : L'environnement dans lequel l'API est invoquée.
- `[in] value` : La valeur JavaScript à forcer.
- `[out] result` : `napi_value` représentant le `number` JavaScript forcé.

Renvoie `napi_ok` si l'API a réussi.

Cette API implémente l'opération abstraite `ToNumber()` telle que définie dans la [Section 7.1.3](https://tc39.github.io/ecma262/#sec-tonumber) de la spécification du langage ECMAScript. Cette fonction exécute potentiellement du code JS si la valeur transmise est un objet.

### `napi_coerce_to_object` {#napi_coerce_to_object}

**Ajouté dans : v8.0.0**

**Version N-API : 1**

```C [C]
napi_status napi_coerce_to_object(napi_env env,
                                  napi_value value,
                                  napi_value* result)
```
- `[in] env` : L'environnement dans lequel l'API est invoquée.
- `[in] value` : La valeur JavaScript à forcer.
- `[out] result` : `napi_value` représentant le `Object` JavaScript forcé.

Renvoie `napi_ok` si l'API a réussi.

Cette API implémente l'opération abstraite `ToObject()` telle que définie dans la [Section 7.1.13](https://tc39.github.io/ecma262/#sec-toobject) de la spécification du langage ECMAScript.


### `napi_coerce_to_string` {#napi_coerce_to_string}

**Ajouté dans : v8.0.0**

**Version N-API : 1**

```C [C]
napi_status napi_coerce_to_string(napi_env env,
                                  napi_value value,
                                  napi_value* result)
```
- `[in] env` : l’environnement dans lequel l’API est invoquée.
- `[in] value` : la valeur JavaScript à contraindre.
- `[out] result` : `napi_value` représentant la `string` JavaScript contrainte.

Retourne `napi_ok` si l’API a réussi.

Cette API implémente l’opération abstraite `ToString()` telle que définie dans [Section 7.1.13](https://tc39.github.io/ecma262/#sec-toobject) de la spécification du langage ECMAScript. Cette fonction exécute potentiellement du code JS si la valeur transmise est un objet.

### `napi_typeof` {#napi_typeof}

**Ajouté dans : v8.0.0**

**Version N-API : 1**

```C [C]
napi_status napi_typeof(napi_env env, napi_value value, napi_valuetype* result)
```
- `[in] env` : l’environnement dans lequel l’API est invoquée.
- `[in] value` : la valeur JavaScript dont le type doit être interrogé.
- `[out] result` : le type de la valeur JavaScript.

Retourne `napi_ok` si l’API a réussi.

- `napi_invalid_arg` si le type de `value` n’est pas un type ECMAScript connu et que `value` n’est pas une valeur externe.

Cette API représente un comportement similaire à l’appel de l’opérateur `typeof` sur l’objet tel que défini dans [Section 12.5.5](https://tc39.github.io/ecma262/#sec-typeof-operator) de la spécification du langage ECMAScript. Il existe cependant quelques différences :

Si `value` a un type non valide, une erreur est renvoyée.

### `napi_instanceof` {#napi_instanceof}

**Ajouté dans : v8.0.0**

**Version N-API : 1**

```C [C]
napi_status napi_instanceof(napi_env env,
                            napi_value object,
                            napi_value constructor,
                            bool* result)
```
- `[in] env` : l’environnement dans lequel l’API est invoquée.
- `[in] object` : la valeur JavaScript à vérifier.
- `[in] constructor` : l’objet de fonction JavaScript de la fonction constructeur à vérifier.
- `[out] result` : booléen qui est défini sur true si `object instanceof constructor` est true.

Retourne `napi_ok` si l’API a réussi.

Cette API représente l’appel de l’opérateur `instanceof` sur l’objet tel que défini dans [Section 12.10.4](https://tc39.github.io/ecma262/#sec-instanceofoperator) de la spécification du langage ECMAScript.


### `napi_is_array` {#napi_is_array}

**Ajouté dans : v8.0.0**

**Version N-API : 1**

```C [C]
napi_status napi_is_array(napi_env env, napi_value value, bool* result)
```
- `[in] env`: L'environnement dans lequel l'API est invoquée.
- `[in] value`: La valeur JavaScript à vérifier.
- `[out] result`: Indique si l'objet donné est un tableau.

Renvoie `napi_ok` si l'API a réussi.

Cette API représente l'invocation de l'opération `IsArray` sur l'objet tel que défini dans la [Section 7.2.2](https://tc39.github.io/ecma262/#sec-isarray) de la spécification du langage ECMAScript.

### `napi_is_arraybuffer` {#napi_is_arraybuffer}

**Ajouté dans : v8.0.0**

**Version N-API : 1**

```C [C]
napi_status napi_is_arraybuffer(napi_env env, napi_value value, bool* result)
```
- `[in] env`: L'environnement dans lequel l'API est invoquée.
- `[in] value`: La valeur JavaScript à vérifier.
- `[out] result`: Indique si l'objet donné est un `ArrayBuffer`.

Renvoie `napi_ok` si l'API a réussi.

Cette API vérifie si l'`Objet` transmis est un tampon de tableau.

### `napi_is_buffer` {#napi_is_buffer}

**Ajouté dans : v8.0.0**

**Version N-API : 1**

```C [C]
napi_status napi_is_buffer(napi_env env, napi_value value, bool* result)
```
- `[in] env`: L'environnement dans lequel l'API est invoquée.
- `[in] value`: La valeur JavaScript à vérifier.
- `[out] result`: Indique si le `napi_value` donné représente un objet `node::Buffer` ou `Uint8Array`.

Renvoie `napi_ok` si l'API a réussi.

Cette API vérifie si l'`Objet` transmis est un tampon ou un Uint8Array. [`napi_is_typedarray`](/fr/nodejs/api/n-api#napi_is_typedarray) doit être préféré si l'appelant doit vérifier si la valeur est un Uint8Array.

### `napi_is_date` {#napi_is_date}

**Ajouté dans : v11.11.0, v10.17.0**

**Version N-API : 5**

```C [C]
napi_status napi_is_date(napi_env env, napi_value value, bool* result)
```
- `[in] env`: L'environnement dans lequel l'API est invoquée.
- `[in] value`: La valeur JavaScript à vérifier.
- `[out] result`: Indique si le `napi_value` donné représente un objet JavaScript `Date`.

Renvoie `napi_ok` si l'API a réussi.

Cette API vérifie si l'`Objet` transmis est une date.


### `napi_is_error` {#napi_is_error_1}

**Ajouté dans : v8.0.0**

**Version N-API : 1**

```C [C]
napi_status napi_is_error(napi_env env, napi_value value, bool* result)
```
- `[in] env` : L’environnement sous lequel l’API est invoquée.
- `[in] value` : La valeur JavaScript à vérifier.
- `[out] result` : Indique si le `napi_value` donné représente un objet `Error`.

Renvoie `napi_ok` si l’API a réussi.

Cette API vérifie si l’`Object` transmis est une `Error`.

### `napi_is_typedarray` {#napi_is_typedarray}

**Ajouté dans : v8.0.0**

**Version N-API : 1**

```C [C]
napi_status napi_is_typedarray(napi_env env, napi_value value, bool* result)
```
- `[in] env` : L’environnement sous lequel l’API est invoquée.
- `[in] value` : La valeur JavaScript à vérifier.
- `[out] result` : Indique si le `napi_value` donné représente un `TypedArray`.

Renvoie `napi_ok` si l’API a réussi.

Cette API vérifie si l’`Object` transmis est un tableau typé.

### `napi_is_dataview` {#napi_is_dataview}

**Ajouté dans : v8.3.0**

**Version N-API : 1**

```C [C]
napi_status napi_is_dataview(napi_env env, napi_value value, bool* result)
```
- `[in] env` : L’environnement sous lequel l’API est invoquée.
- `[in] value` : La valeur JavaScript à vérifier.
- `[out] result` : Indique si le `napi_value` donné représente une `DataView`.

Renvoie `napi_ok` si l’API a réussi.

Cette API vérifie si l’`Object` transmis est une `DataView`.

### `napi_strict_equals` {#napi_strict_equals}

**Ajouté dans : v8.0.0**

**Version N-API : 1**

```C [C]
napi_status napi_strict_equals(napi_env env,
                               napi_value lhs,
                               napi_value rhs,
                               bool* result)
```
- `[in] env` : L’environnement sous lequel l’API est invoquée.
- `[in] lhs` : La valeur JavaScript à vérifier.
- `[in] rhs` : La valeur JavaScript à vérifier par rapport à.
- `[out] result` : Indique si les deux objets `napi_value` sont égaux.

Renvoie `napi_ok` si l’API a réussi.

Cette API représente l’invocation de l’algorithme Strict Equality tel que défini dans [Section 7.2.14](https://tc39.github.io/ecma262/#sec-strict-equality-comparison) de la spécification du langage ECMAScript.


### `napi_detach_arraybuffer` {#napi_detach_arraybuffer}

**Ajouté dans : v13.0.0, v12.16.0, v10.22.0**

**Version N-API : 7**

```C [C]
napi_status napi_detach_arraybuffer(napi_env env,
                                    napi_value arraybuffer)
```
- `[in] env` : l’environnement sous lequel l’API est invoquée.
- `[in] arraybuffer` : le `ArrayBuffer` JavaScript à détacher.

Renvoie `napi_ok` si l’API a réussi. Si un `ArrayBuffer` non détachable est passé, elle renvoie `napi_detachable_arraybuffer_expected`.

Généralement, un `ArrayBuffer` n’est pas détachable s’il a déjà été détaché. Le moteur peut imposer des conditions supplémentaires pour déterminer si un `ArrayBuffer` est détachable. Par exemple, V8 exige que le `ArrayBuffer` soit externe, c’est-à-dire créé avec [`napi_create_external_arraybuffer`](/fr/nodejs/api/n-api#napi_create_external_arraybuffer).

Cette API représente l’appel de l’opération de détachement `ArrayBuffer` telle que définie dans la [Section 24.1.1.3](https://tc39.es/ecma262/#sec-detacharraybuffer) de la spécification du langage ECMAScript.

### `napi_is_detached_arraybuffer` {#napi_is_detached_arraybuffer}

**Ajouté dans : v13.3.0, v12.16.0, v10.22.0**

**Version N-API : 7**

```C [C]
napi_status napi_is_detached_arraybuffer(napi_env env,
                                         napi_value arraybuffer,
                                         bool* result)
```
- `[in] env` : l’environnement sous lequel l’API est invoquée.
- `[in] arraybuffer` : le `ArrayBuffer` JavaScript à vérifier.
- `[out] result` : indique si le `arraybuffer` est détaché.

Renvoie `napi_ok` si l’API a réussi.

Le `ArrayBuffer` est considéré comme détaché si ses données internes sont `null`.

Cette API représente l’appel de l’opération `IsDetachedBuffer` de `ArrayBuffer` telle que définie dans la [Section 24.1.1.2](https://tc39.es/ecma262/#sec-isdetachedbuffer) de la spécification du langage ECMAScript.

## Utilisation des propriétés JavaScript {#working-with-javascript-properties}

Node-API expose un ensemble d’API pour obtenir et définir des propriétés sur des objets JavaScript. Certains de ces types sont documentés dans la [Section 7](https://tc39.github.io/ecma262/#sec-abstract-operations) de la [spécification du langage ECMAScript](https://tc39.github.io/ecma262/).

Les propriétés en JavaScript sont représentées sous forme de tuple d’une clé et d’une valeur. Fondamentalement, toutes les clés de propriété dans Node-API peuvent être représentées sous l’une des formes suivantes :

- Nommée : une simple chaîne encodée en UTF8
- Indexée par entier : une valeur d’index représentée par `uint32_t`
- Valeur JavaScript : celles-ci sont représentées dans Node-API par `napi_value`. Il peut s’agir d’une `napi_value` représentant une `string`, un `number` ou un `symbol`.

Les valeurs Node-API sont représentées par le type `napi_value`. Tout appel Node-API qui nécessite une valeur JavaScript prend une `napi_value`. Toutefois, il incombe à l’appelant de s’assurer que la `napi_value` en question est du type JavaScript attendu par l’API.

Les API documentées dans cette section fournissent une interface simple pour obtenir et définir des propriétés sur des objets JavaScript arbitraires représentés par `napi_value`.

Par exemple, considérez l’extrait de code JavaScript suivant :

```js [ESM]
const obj = {};
obj.myProp = 123;
```
L’équivalent peut être fait en utilisant des valeurs Node-API avec l’extrait suivant :

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
Les propriétés indexées peuvent être définies de manière similaire. Considérez l’extrait de code JavaScript suivant :

```js [ESM]
const arr = [];
arr[123] = 'hello';
```
L’équivalent peut être fait en utilisant des valeurs Node-API avec l’extrait suivant :

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
Les propriétés peuvent être récupérées en utilisant les API décrites dans cette section. Considérez l’extrait de code JavaScript suivant :

```js [ESM]
const arr = [];
const value = arr[123];
```
Voici l’équivalent approximatif de la contrepartie Node-API :

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
Enfin, plusieurs propriétés peuvent également être définies sur un objet pour des raisons de performances. Considérez le JavaScript suivant :

```js [ESM]
const obj = {};
Object.defineProperties(obj, {
  'foo': { value: 123, writable: true, configurable: true, enumerable: true },
  'bar': { value: 456, writable: true, configurable: true, enumerable: true },
});
```
Voici l’équivalent approximatif de la contrepartie Node-API :

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

### Structures {#structures}

#### `napi_property_attributes` {#napi_property_attributes}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v14.12.0 | ajout de `napi_default_method` et `napi_default_property`. |
:::

```C [C]
typedef enum {
  napi_default = 0,
  napi_writable = 1 << 0,
  napi_enumerable = 1 << 1,
  napi_configurable = 1 << 2,

  // Utilisé avec napi_define_class pour distinguer les propriétés statiques
  // des propriétés d'instance. Ignoré par napi_define_properties.
  napi_static = 1 << 10,

  // Par défaut pour les méthodes de classe.
  napi_default_method = napi_writable | napi_configurable,

  // Par défaut pour les propriétés d'objet, comme dans JS obj[prop].
  napi_default_jsproperty = napi_writable |
                          napi_enumerable |
                          napi_configurable,
} napi_property_attributes;
```
Les `napi_property_attributes` sont des drapeaux utilisés pour contrôler le comportement des propriétés définies sur un objet JavaScript. À l'exception de `napi_static`, ils correspondent aux attributs listés dans la [Section 6.1.7.1](https://tc39.github.io/ecma262/#table-2) de la [Spécification du langage ECMAScript](https://tc39.github.io/ecma262/). Ils peuvent être un ou plusieurs des bitflags suivants :

- `napi_default` : aucun attribut explicite n’est défini sur la propriété. Par défaut, une propriété est en lecture seule, non énumérable et non configurable.
- `napi_writable` : la propriété est accessible en écriture.
- `napi_enumerable` : la propriété est énumérable.
- `napi_configurable` : la propriété est configurable tel que défini dans la [Section 6.1.7.1](https://tc39.github.io/ecma262/#table-2) de la [Spécification du langage ECMAScript](https://tc39.github.io/ecma262/).
- `napi_static` : la propriété sera définie comme une propriété statique sur une classe par opposition à une propriété d’instance, qui est la valeur par défaut. Ceci est uniquement utilisé par [`napi_define_class`](/fr/nodejs/api/n-api#napi_define_class). Elle est ignorée par `napi_define_properties`.
- `napi_default_method` : comme une méthode dans une classe JS, la propriété est configurable et accessible en écriture, mais non énumérable.
- `napi_default_jsproperty` : comme une propriété définie via une affectation en JavaScript, la propriété est accessible en écriture, énumérable et configurable.


#### `napi_property_descriptor` {#napi_property_descriptor}

```C [C]
typedef struct {
  // Soit utf8name, soit name doit être NULL.
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
- `utf8name` : Chaîne optionnelle décrivant la clé de la propriété, encodée en UTF8. Soit `utf8name`, soit `name` doit être fourni pour la propriété.
- `name` : `napi_value` optionnelle qui pointe vers une chaîne JavaScript ou un symbole à utiliser comme clé de la propriété. Soit `utf8name`, soit `name` doit être fourni pour la propriété.
- `value` : La valeur qui est récupérée par un accès get de la propriété si la propriété est une propriété de données. Si ceci est passé, définissez `getter`, `setter`, `method` et `data` à `NULL` (car ces membres ne seront pas utilisés).
- `getter` : Une fonction à appeler lorsqu'un accès get de la propriété est effectué. Si ceci est passé, définissez `value` et `method` à `NULL` (car ces membres ne seront pas utilisés). La fonction donnée est appelée implicitement par le runtime lorsque la propriété est accédée depuis le code JavaScript (ou si un get sur la propriété est effectué en utilisant un appel Node-API). [`napi_callback`](/fr/nodejs/api/n-api#napi_callback) fournit plus de détails.
- `setter` : Une fonction à appeler lorsqu'un accès set de la propriété est effectué. Si ceci est passé, définissez `value` et `method` à `NULL` (car ces membres ne seront pas utilisés). La fonction donnée est appelée implicitement par le runtime lorsque la propriété est définie depuis le code JavaScript (ou si un set sur la propriété est effectué en utilisant un appel Node-API). [`napi_callback`](/fr/nodejs/api/n-api#napi_callback) fournit plus de détails.
- `method` : Définissez ceci pour que la propriété `value` de l'objet descripteur de propriété soit une fonction JavaScript représentée par `method`. Si ceci est passé, définissez `value`, `getter` et `setter` à `NULL` (car ces membres ne seront pas utilisés). [`napi_callback`](/fr/nodejs/api/n-api#napi_callback) fournit plus de détails.
- `attributes` : Les attributs associés à la propriété particulière. Voir [`napi_property_attributes`](/fr/nodejs/api/n-api#napi_property_attributes).
- `data` : Les données de rappel passées à `method`, `getter` et `setter` si cette fonction est invoquée.


### Fonctions {#functions}

#### `napi_get_property_names` {#napi_get_property_names}

**Ajouté dans : v8.0.0**

**Version N-API : 1**

```C [C]
napi_status napi_get_property_names(napi_env env,
                                    napi_value object,
                                    napi_value* result);
```
- `[in] env` : l’environnement dans lequel l’appel Node-API est invoqué.
- `[in] object` : l’objet à partir duquel récupérer les propriétés.
- `[out] result` : un `napi_value` représentant un tableau de valeurs JavaScript qui représentent les noms de propriété de l’objet. L’API peut être utilisée pour itérer sur `result` en utilisant [`napi_get_array_length`](/fr/nodejs/api/n-api#napi_get_array_length) et [`napi_get_element`](/fr/nodejs/api/n-api#napi_get_element).

Renvoie `napi_ok` si l’API a réussi.

Cette API renvoie les noms des propriétés énumérables de `object` sous forme de tableau de chaînes. Les propriétés de `object` dont la clé est un symbole ne seront pas incluses.

#### `napi_get_all_property_names` {#napi_get_all_property_names}

**Ajouté dans : v13.7.0, v12.17.0, v10.20.0**

**Version N-API : 6**

```C [C]
napi_get_all_property_names(napi_env env,
                            napi_value object,
                            napi_key_collection_mode key_mode,
                            napi_key_filter key_filter,
                            napi_key_conversion key_conversion,
                            napi_value* result);
```
- `[in] env` : l’environnement dans lequel l’appel Node-API est invoqué.
- `[in] object` : l’objet à partir duquel récupérer les propriétés.
- `[in] key_mode` : indique s’il faut également récupérer les propriétés du prototype.
- `[in] key_filter` : les propriétés à récupérer (énumérables/lisibles/inscriptibles).
- `[in] key_conversion` : indique s’il faut convertir les clés de propriété numérotées en chaînes.
- `[out] result` : un `napi_value` représentant un tableau de valeurs JavaScript qui représentent les noms de propriété de l’objet. [`napi_get_array_length`](/fr/nodejs/api/n-api#napi_get_array_length) et [`napi_get_element`](/fr/nodejs/api/n-api#napi_get_element) peuvent être utilisés pour itérer sur `result`.

Renvoie `napi_ok` si l’API a réussi.

Cette API renvoie un tableau contenant les noms des propriétés disponibles de cet objet.


#### `napi_set_property` {#napi_set_property}

**Ajouté dans: v8.0.0**

**Version N-API: 1**

```C [C]
napi_status napi_set_property(napi_env env,
                              napi_value object,
                              napi_value key,
                              napi_value value);
```
- `[in] env`: L'environnement dans lequel l'appel Node-API est invoqué.
- `[in] object`: L'objet sur lequel définir la propriété.
- `[in] key`: Le nom de la propriété à définir.
- `[in] value`: La valeur de la propriété.

Renvoie `napi_ok` si l'API a réussi.

Cette API définit une propriété sur l'`Object` passé en paramètre.

#### `napi_get_property` {#napi_get_property}

**Ajouté dans: v8.0.0**

**Version N-API: 1**

```C [C]
napi_status napi_get_property(napi_env env,
                              napi_value object,
                              napi_value key,
                              napi_value* result);
```
- `[in] env`: L'environnement dans lequel l'appel Node-API est invoqué.
- `[in] object`: L'objet à partir duquel récupérer la propriété.
- `[in] key`: Le nom de la propriété à récupérer.
- `[out] result`: La valeur de la propriété.

Renvoie `napi_ok` si l'API a réussi.

Cette API obtient la propriété demandée à partir de l'`Object` passé en paramètre.

#### `napi_has_property` {#napi_has_property}

**Ajouté dans: v8.0.0**

**Version N-API: 1**

```C [C]
napi_status napi_has_property(napi_env env,
                              napi_value object,
                              napi_value key,
                              bool* result);
```
- `[in] env`: L'environnement dans lequel l'appel Node-API est invoqué.
- `[in] object`: L'objet à interroger.
- `[in] key`: Le nom de la propriété dont l'existence doit être vérifiée.
- `[out] result`: Indique si la propriété existe ou non sur l'objet.

Renvoie `napi_ok` si l'API a réussi.

Cette API vérifie si l'`Object` passé en paramètre possède la propriété nommée.

#### `napi_delete_property` {#napi_delete_property}

**Ajouté dans: v8.2.0**

**Version N-API: 1**

```C [C]
napi_status napi_delete_property(napi_env env,
                                 napi_value object,
                                 napi_value key,
                                 bool* result);
```
- `[in] env`: L'environnement dans lequel l'appel Node-API est invoqué.
- `[in] object`: L'objet à interroger.
- `[in] key`: Le nom de la propriété à supprimer.
- `[out] result`: Indique si la suppression de la propriété a réussi ou non. `result` peut éventuellement être ignoré en passant `NULL`.

Renvoie `napi_ok` si l'API a réussi.

Cette API tente de supprimer la propriété propre `key` de `object`.


#### `napi_has_own_property` {#napi_has_own_property}

**Ajoutée dans: v8.2.0**

**Version N-API: 1**

```C [C]
napi_status napi_has_own_property(napi_env env,
                                  napi_value object,
                                  napi_value key,
                                  bool* result);
```
- `[in] env` : L'environnement dans lequel l'appel Node-API est invoqué.
- `[in] object` : L'objet à interroger.
- `[in] key` : Le nom de la propriété propre dont l'existence doit être vérifiée.
- `[out] result` : Indique si la propriété propre existe ou non sur l'objet.

Renvoie `napi_ok` si l'API a réussi.

Cette API vérifie si l'`Object` passé en paramètre possède la propriété propre nommée. `key` doit être une `string` ou un `symbol`, sinon une erreur sera levée. Node-API n'effectuera aucune conversion entre les types de données.

#### `napi_set_named_property` {#napi_set_named_property}

**Ajoutée dans: v8.0.0**

**Version N-API: 1**

```C [C]
napi_status napi_set_named_property(napi_env env,
                                    napi_value object,
                                    const char* utf8Name,
                                    napi_value value);
```
- `[in] env` : L'environnement dans lequel l'appel Node-API est invoqué.
- `[in] object` : L'objet sur lequel définir la propriété.
- `[in] utf8Name` : Le nom de la propriété à définir.
- `[in] value` : La valeur de la propriété.

Renvoie `napi_ok` si l'API a réussi.

Cette méthode est équivalente à l'appel de [`napi_set_property`](/fr/nodejs/api/n-api#napi_set_property) avec un `napi_value` créé à partir de la chaîne passée en tant que `utf8Name`.

#### `napi_get_named_property` {#napi_get_named_property}

**Ajoutée dans: v8.0.0**

**Version N-API: 1**

```C [C]
napi_status napi_get_named_property(napi_env env,
                                    napi_value object,
                                    const char* utf8Name,
                                    napi_value* result);
```
- `[in] env` : L'environnement dans lequel l'appel Node-API est invoqué.
- `[in] object` : L'objet à partir duquel récupérer la propriété.
- `[in] utf8Name` : Le nom de la propriété à obtenir.
- `[out] result` : La valeur de la propriété.

Renvoie `napi_ok` si l'API a réussi.

Cette méthode est équivalente à l'appel de [`napi_get_property`](/fr/nodejs/api/n-api#napi_get_property) avec un `napi_value` créé à partir de la chaîne passée en tant que `utf8Name`.


#### `napi_has_named_property` {#napi_has_named_property}

**Ajoutée dans: v8.0.0**

**Version N-API: 1**

```C [C]
napi_status napi_has_named_property(napi_env env,
                                    napi_value object,
                                    const char* utf8Name,
                                    bool* result);
```
- `[in] env`: L’environnement dans lequel l’appel Node-API est invoqué.
- `[in] object`: L’objet à interroger.
- `[in] utf8Name`: Le nom de la propriété dont l’existence doit être vérifiée.
- `[out] result`: Indique si la propriété existe sur l’objet ou non.

Renvoie `napi_ok` si l’API a réussi.

Cette méthode est équivalente à l’appel de [`napi_has_property`](/fr/nodejs/api/n-api#napi_has_property) avec une `napi_value` créée à partir de la chaîne passée sous le nom de `utf8Name`.

#### `napi_set_element` {#napi_set_element}

**Ajoutée dans: v8.0.0**

**Version N-API: 1**

```C [C]
napi_status napi_set_element(napi_env env,
                             napi_value object,
                             uint32_t index,
                             napi_value value);
```
- `[in] env`: L’environnement dans lequel l’appel Node-API est invoqué.
- `[in] object`: L’objet à partir duquel définir les propriétés.
- `[in] index`: L’index de la propriété à définir.
- `[in] value`: La valeur de la propriété.

Renvoie `napi_ok` si l’API a réussi.

Cette API définit un élément sur l’`Object` transmis.

#### `napi_get_element` {#napi_get_element}

**Ajoutée dans: v8.0.0**

**Version N-API: 1**

```C [C]
napi_status napi_get_element(napi_env env,
                             napi_value object,
                             uint32_t index,
                             napi_value* result);
```
- `[in] env`: L’environnement dans lequel l’appel Node-API est invoqué.
- `[in] object`: L’objet à partir duquel récupérer la propriété.
- `[in] index`: L’index de la propriété à obtenir.
- `[out] result`: La valeur de la propriété.

Renvoie `napi_ok` si l’API a réussi.

Cette API obtient l’élément à l’index demandé.

#### `napi_has_element` {#napi_has_element}

**Ajoutée dans: v8.0.0**

**Version N-API: 1**

```C [C]
napi_status napi_has_element(napi_env env,
                             napi_value object,
                             uint32_t index,
                             bool* result);
```
- `[in] env`: L’environnement dans lequel l’appel Node-API est invoqué.
- `[in] object`: L’objet à interroger.
- `[in] index`: L’index de la propriété dont l’existence doit être vérifiée.
- `[out] result`: Indique si la propriété existe sur l’objet ou non.

Renvoie `napi_ok` si l’API a réussi.

Cette API renvoie si l'`Object` transmis a un élément à l’index demandé.


#### `napi_delete_element` {#napi_delete_element}

**Ajouté dans : v8.2.0**

**Version N-API : 1**

```C [C]
napi_status napi_delete_element(napi_env env,
                                napi_value object,
                                uint32_t index,
                                bool* result);
```
- `[in] env` : L’environnement sous lequel l’appel de Node-API est appelé.
- `[in] object` : L’objet à interroger.
- `[in] index` : L’index de la propriété à supprimer.
- `[out] result` : Indique si la suppression de l’élément a réussi ou non. `result` peut être ignoré en passant `NULL`.

Retourne `napi_ok` si l’API a réussi.

Cette API tente de supprimer l’élément `index` spécifié de l’objet `object`.

#### `napi_define_properties` {#napi_define_properties}

**Ajouté dans : v8.0.0**

**Version N-API : 1**

```C [C]
napi_status napi_define_properties(napi_env env,
                                   napi_value object,
                                   size_t property_count,
                                   const napi_property_descriptor* properties);
```
- `[in] env` : L’environnement sous lequel l’appel de Node-API est appelé.
- `[in] object` : L’objet à partir duquel récupérer les propriétés.
- `[in] property_count` : Le nombre d’éléments dans le tableau `properties`.
- `[in] properties` : Le tableau des descripteurs de propriété.

Retourne `napi_ok` si l’API a réussi.

Cette méthode permet la définition efficace de plusieurs propriétés sur un objet donné. Les propriétés sont définies à l’aide de descripteurs de propriétés (voir [`napi_property_descriptor`](/fr/nodejs/api/n-api#napi_property_descriptor)). Étant donné un tableau de tels descripteurs de propriétés, cette API définit les propriétés sur l’objet une à la fois, tel que défini par `DefineOwnProperty()` (décrit dans la [Section 9.1.6](https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots-defineownproperty-p-desc) de la spécification ECMA-262).

#### `napi_object_freeze` {#napi_object_freeze}

**Ajouté dans : v14.14.0, v12.20.0**

**Version N-API : 8**

```C [C]
napi_status napi_object_freeze(napi_env env,
                               napi_value object);
```
- `[in] env` : L’environnement sous lequel l’appel de Node-API est appelé.
- `[in] object` : L’objet à figer.

Retourne `napi_ok` si l’API a réussi.

Cette méthode fige un objet donné. Cela empêche l’ajout de nouvelles propriétés, la suppression de propriétés existantes, empêche la modification de l’énumérabilité, de la configurabilité ou de l’inscriptibilité des propriétés existantes, et empêche la modification des valeurs des propriétés existantes. Elle empêche également la modification du prototype de l’objet. Ceci est décrit dans la [Section 19.1.2.6](https://tc39.es/ecma262/#sec-object.freeze) de la spécification ECMA-262.


#### `napi_object_seal` {#napi_object_seal}

**Ajouté dans : v14.14.0, v12.20.0**

**Version N-API : 8**

```C [C]
napi_status napi_object_seal(napi_env env,
                             napi_value object);
```
- `[in] env`: L'environnement dans lequel l'appel Node-API est invoqué.
- `[in] object`: L'objet à sceller.

Renvoie `napi_ok` si l'API a réussi.

Cette méthode scelle un objet donné. Cela empêche l'ajout de nouvelles propriétés et marque toutes les propriétés existantes comme non configurables. Ceci est décrit dans la [Section 19.1.2.20](https://tc39.es/ecma262/#sec-object.seal) de la spécification ECMA-262.

## Travailler avec les fonctions JavaScript {#working-with-javascript-functions}

Node-API fournit un ensemble d'API qui permettent au code JavaScript de rappeler le code natif. Les API Node qui prennent en charge les rappels dans le code natif prennent en compte les fonctions de rappel représentées par le type `napi_callback`. Lorsque la VM JavaScript rappelle le code natif, la fonction `napi_callback` fournie est invoquée. Les API documentées dans cette section permettent à la fonction de rappel de faire ce qui suit :

- Obtenir des informations sur le contexte dans lequel le rappel a été invoqué.
- Obtenir les arguments transmis au rappel.
- Renvoie un `napi_value` à partir du rappel.

De plus, Node-API fournit un ensemble de fonctions qui permettent d'appeler des fonctions JavaScript à partir du code natif. On peut soit appeler une fonction comme un appel de fonction JavaScript normal, soit comme une fonction constructeur.

Toute donnée non-`NULL` qui est passée à cette API via le champ `data` des éléments `napi_property_descriptor` peut être associée à `object` et libérée chaque fois que `object` est collecté par le garbage collector en passant à la fois `object` et les données à [`napi_add_finalizer`](/fr/nodejs/api/n-api#napi_add_finalizer).

### `napi_call_function` {#napi_call_function}

**Ajouté dans : v8.0.0**

**Version N-API : 1**

```C [C]
NAPI_EXTERN napi_status napi_call_function(napi_env env,
                                           napi_value recv,
                                           napi_value func,
                                           size_t argc,
                                           const napi_value* argv,
                                           napi_value* result);
```
- `[in] env`: L'environnement dans lequel l'API est invoquée.
- `[in] recv`: La valeur `this` transmise à la fonction appelée.
- `[in] func`: `napi_value` représentant la fonction JavaScript à invoquer.
- `[in] argc`: Le nombre d'éléments dans le tableau `argv`.
- `[in] argv`: Tableau de `napi_values` représentant les valeurs JavaScript transmises en tant qu'arguments à la fonction.
- `[out] result`: `napi_value` représentant l'objet JavaScript renvoyé.

Renvoie `napi_ok` si l'API a réussi.

Cette méthode permet d'appeler un objet de fonction JavaScript à partir d'un add-on natif. Il s'agit du principal mécanisme de rappel *du* code natif de l'add-on *vers* JavaScript. Pour le cas particulier d'un appel à JavaScript après une opération asynchrone, voir [`napi_make_callback`](/fr/nodejs/api/n-api#napi_make_callback).

Un cas d'utilisation type pourrait ressembler à ceci. Considérez l'extrait de code JavaScript suivant :

```js [ESM]
function AddTwo(num) {
  return num + 2;
}
global.AddTwo = AddTwo;
```
Ensuite, la fonction ci-dessus peut être invoquée à partir d'un add-on natif en utilisant le code suivant :

```C [C]
// Obtenir la fonction nommée "AddTwo" sur l'objet global
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

// Convertir le résultat en un type natif
int32_t result;
status = napi_get_value_int32(env, return_val, &result);
if (status != napi_ok) return;
```

### `napi_create_function` {#napi_create_function}

**Ajouté dans : v8.0.0**

**Version N-API : 1**

```C [C]
napi_status napi_create_function(napi_env env,
                                 const char* utf8name,
                                 size_t length,
                                 napi_callback cb,
                                 void* data,
                                 napi_value* result);
```
- `[in] env` : l'environnement dans lequel l'API est invoquée.
- `[in] utf8Name` : nom facultatif de la fonction encodée en UTF8. Ceci est visible dans JavaScript comme la propriété `name` du nouvel objet fonction.
- `[in] length` : la longueur de `utf8name` en octets, ou `NAPI_AUTO_LENGTH` si elle est terminée par null.
- `[in] cb` : la fonction native qui doit être appelée lorsque cet objet fonction est invoqué. [`napi_callback`](/fr/nodejs/api/n-api#napi_callback) fournit plus de détails.
- `[in] data` : contexte de données fourni par l'utilisateur. Ceci sera renvoyé dans la fonction lorsqu'elle sera invoquée plus tard.
- `[out] result` : `napi_value` représentant l'objet fonction JavaScript pour la fonction nouvellement créée.

Renvoie `napi_ok` si l'API a réussi.

Cette API permet à un auteur d'addon de créer un objet fonction dans le code natif. C'est le principal mécanisme pour permettre l'appel *dans* le code natif de l'addon *depuis* JavaScript.

La fonction nouvellement créée n'est pas automatiquement visible depuis le script après cet appel. Au lieu de cela, une propriété doit être explicitement définie sur tout objet visible par JavaScript, afin que la fonction soit accessible depuis le script.

Afin d'exposer une fonction en tant que partie des exports du module de l'addon, définissez la fonction nouvellement créée sur l'objet exports. Un exemple de module pourrait ressembler à ce qui suit :

```C [C]
napi_value SayHello(napi_env env, napi_callback_info info) {
  printf("Bonjour\n");
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
Étant donné le code ci-dessus, l'addon peut être utilisé depuis JavaScript comme suit :

```js [ESM]
const myaddon = require('./addon');
myaddon.sayHello();
```
La chaîne passée à `require()` est le nom de la cible dans `binding.gyp` responsable de la création du fichier `.node`.

Toutes les données non `NULL` qui sont passées à cette API via le paramètre `data` peuvent être associées à la fonction JavaScript résultante (qui est renvoyée dans le paramètre `result`) et libérées chaque fois que la fonction est collectée par le garbage collector en passant à la fois la fonction JavaScript et les données à [`napi_add_finalizer`](/fr/nodejs/api/n-api#napi_add_finalizer).

Les `Function`s JavaScript sont décrites dans [Section 19.2](https://tc39.github.io/ecma262/#sec-function-objects) de la Spécification du Langage ECMAScript.


### `napi_get_cb_info` {#napi_get_cb_info}

**Ajouté dans : v8.0.0**

**Version N-API : 1**

```C [C]
napi_status napi_get_cb_info(napi_env env,
                             napi_callback_info cbinfo,
                             size_t* argc,
                             napi_value* argv,
                             napi_value* thisArg,
                             void** data)
```
- `[in] env` : l’environnement sous lequel l’API est invoquée.
- `[in] cbinfo` : les informations de rappel transmises à la fonction de rappel.
- `[in-out] argc` : Spécifie la longueur du tableau `argv` fourni et reçoit le nombre réel d’arguments. `argc` peut éventuellement être ignoré en transmettant `NULL`.
- `[out] argv` : tableau C de `napi_value`s dans lequel les arguments seront copiés. S’il y a plus d’arguments que le nombre fourni, seul le nombre d’arguments demandés est copié. S’il y a moins d’arguments fournis que déclaré, le reste de `argv` est rempli avec des valeurs `napi_value` qui représentent `undefined`. `argv` peut éventuellement être ignoré en transmettant `NULL`.
- `[out] thisArg` : reçoit l’argument JavaScript `this` pour l’appel. `thisArg` peut éventuellement être ignoré en transmettant `NULL`.
- `[out] data` : reçoit le pointeur de données pour le rappel. `data` peut éventuellement être ignoré en transmettant `NULL`.

Renvoie `napi_ok` si l’API a réussi.

Cette méthode est utilisée dans une fonction de rappel pour récupérer des détails sur l’appel, comme les arguments et le pointeur `this`, à partir d’informations de rappel données.

### `napi_get_new_target` {#napi_get_new_target}

**Ajouté dans : v8.6.0**

**Version N-API : 1**

```C [C]
napi_status napi_get_new_target(napi_env env,
                                napi_callback_info cbinfo,
                                napi_value* result)
```
- `[in] env` : l’environnement sous lequel l’API est invoquée.
- `[in] cbinfo` : les informations de rappel transmises à la fonction de rappel.
- `[out] result` : le `new.target` de l’appel de constructeur.

Renvoie `napi_ok` si l’API a réussi.

Cette API renvoie le `new.target` de l’appel de constructeur. Si le rappel actuel n’est pas un appel de constructeur, le résultat est `NULL`.


### `napi_new_instance` {#napi_new_instance}

**Ajouté dans : v8.0.0**

**Version N-API : 1**

```C [C]
napi_status napi_new_instance(napi_env env,
                              napi_value cons,
                              size_t argc,
                              napi_value* argv,
                              napi_value* result)
```
- `[in] env` : l’environnement dans lequel l’API est invoquée.
- `[in] cons` : `napi_value` représentant la fonction JavaScript à invoquer comme constructeur.
- `[in] argc` : le nombre d’éléments dans le tableau `argv`.
- `[in] argv` : tableau de valeurs JavaScript en tant que `napi_value` représentant les arguments du constructeur. Si `argc` est zéro, ce paramètre peut être omis en transmettant `NULL`.
- `[out] result` : `napi_value` représentant l’objet JavaScript retourné, qui dans ce cas est l’objet construit.

Cette méthode est utilisée pour instancier une nouvelle valeur JavaScript en utilisant une `napi_value` donnée qui représente le constructeur de l’objet. Par exemple, considérez l’extrait de code suivant :

```js [ESM]
function MyObject(param) {
  this.param = param;
}

const arg = 'hello';
const value = new MyObject(arg);
```
Ce qui suit peut être approché en Node-API en utilisant l’extrait de code suivant :

```C [C]
// Obtenir la fonction constructeur MyObject
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
Retourne `napi_ok` si l’API a réussi.

## Enveloppement d’objet {#object-wrap}

Node-API offre un moyen d'"envelopper" les classes et instances C++ afin que le constructeur et les méthodes de la classe puissent être appelés à partir de JavaScript.

Pour les objets enveloppés, il peut être difficile de faire la distinction entre une fonction appelée sur un prototype de classe et une fonction appelée sur une instance d’une classe. Un modèle courant utilisé pour résoudre ce problème est de sauvegarder une référence persistante au constructeur de la classe pour les vérifications `instanceof` ultérieures.

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
La référence doit être libérée lorsqu’elle n’est plus nécessaire.

Il arrive que `napi_instanceof()` soit insuffisant pour s’assurer qu’un objet JavaScript est un wrapper pour un certain type natif. C’est le cas notamment lorsque des objets JavaScript enveloppés sont renvoyés dans l’addon via des méthodes statiques plutôt que comme valeur `this` des méthodes de prototype. Dans de tels cas, il y a un risque qu’ils soient désenveloppés de manière incorrecte.

```js [ESM]
const myAddon = require('./build/Release/my_addon.node');

// `openDatabase()` renvoie un objet JavaScript qui enveloppe un descripteur de base de données natif
// handle.
const dbHandle = myAddon.openDatabase();

// `query()` renvoie un objet JavaScript qui enveloppe un descripteur de requête natif.
const queryHandle = myAddon.query(dbHandle, 'Gimme ALL the things!');

// Il y a une erreur accidentelle dans la ligne ci-dessous. Le premier paramètre de
// `myAddon.queryHasRecords()` doit être le descripteur de base de données (`dbHandle`), pas
// le descripteur de requête (`query`), donc la condition correcte pour la boucle while
// devrait être
//
// myAddon.queryHasRecords(dbHandle, queryHandle)
//
while (myAddon.queryHasRecords(queryHandle, dbHandle)) {
  // récupérer les enregistrements
}
```
Dans l’exemple ci-dessus, `myAddon.queryHasRecords()` est une méthode qui accepte deux arguments. Le premier est un descripteur de base de données et le second est un descripteur de requête. En interne, il désenveloppe le premier argument et caste le pointeur résultant en un descripteur de base de données natif. Il désenveloppe ensuite le deuxième argument et caste le pointeur résultant en un descripteur de requête. Si les arguments sont passés dans le mauvais ordre, les casts fonctionneront, cependant, il y a de fortes chances que l’opération de base de données sous-jacente échoue, ou provoque même un accès mémoire invalide.

Pour s’assurer que le pointeur récupéré du premier argument est bien un pointeur vers un descripteur de base de données et, de même, que le pointeur récupéré du deuxième argument est bien un pointeur vers un descripteur de requête, l’implémentation de `queryHasRecords()` doit effectuer une validation de type. Conserver le constructeur de classe JavaScript à partir duquel le descripteur de base de données a été instancié et le constructeur à partir duquel le descripteur de requête a été instancié dans des `napi_ref`s peut aider, car `napi_instanceof()` peut alors être utilisé pour s’assurer que les instances passées dans `queryHashRecords()` sont bien du type correct.

Malheureusement, `napi_instanceof()` ne protège pas contre la manipulation du prototype. Par exemple, le prototype de l’instance de descripteur de base de données peut être défini sur le prototype du constructeur pour les instances de descripteur de requête. Dans ce cas, l’instance de descripteur de base de données peut apparaître comme une instance de descripteur de requête, et elle passera le test `napi_instanceof()` pour une instance de descripteur de requête, tout en contenant un pointeur vers un descripteur de base de données.

À cette fin, Node-API fournit des capacités d’étiquetage de type.

Une balise de type est un entier de 128 bits unique à l’addon. Node-API fournit la structure `napi_type_tag` pour stocker une balise de type. Lorsqu’une telle valeur est transmise avec un objet JavaScript ou [externe](/fr/nodejs/api/n-api#napi_create_external) stocké dans un `napi_value` à `napi_type_tag_object()`, l’objet JavaScript sera "marqué" avec la balise de type. La "marque" est invisible côté JavaScript. Lorsqu’un objet JavaScript arrive dans une liaison native, `napi_check_object_type_tag()` peut être utilisé avec la balise de type d’origine pour déterminer si l’objet JavaScript a été précédemment "marqué" avec la balise de type. Cela crée une capacité de vérification de type d’une fidélité supérieure à celle que `napi_instanceof()` peut fournir, car un tel étiquetage de type survit à la manipulation du prototype et au déchargement/rechargement de l’addon.

Pour reprendre l’exemple ci-dessus, l’implémentation squelettique de l’addon suivante illustre l’utilisation de `napi_type_tag_object()` et `napi_check_object_type_tag()`.

```C [C]
// Cette valeur est la balise de type pour un descripteur de base de données. La commande
//
//   uuidgen | sed -r -e 's/-//g' -e 's/(.{16})(.*)/0x\1, 0x\2/'
//
// peut être utilisée pour obtenir les deux valeurs avec lesquelles initialiser la structure.
static const napi_type_tag DatabaseHandleTypeTag = {
  0x1edf75a38336451d, 0xa5ed9ce2e4c00c38
};

// Cette valeur est la balise de type pour un descripteur de requête.
static const napi_type_tag QueryHandleTypeTag = {
  0x9c73317f9fad44a3, 0x93c3920bf3b0ad6a
};

static napi_value
openDatabase(napi_env env, napi_callback_info info) {
  napi_status status;
  napi_value result;

  // Effectuer l’action sous-jacente qui aboutit à un descripteur de base de données.
  DatabaseHandle* dbHandle = open_database();

  // Créer un nouvel objet JS vide.
  status = napi_create_object(env, &result);
  if (status != napi_ok) return NULL;

  // Étiqueter l’objet pour indiquer qu’il contient un pointeur vers un `DatabaseHandle`.
  status = napi_type_tag_object(env, result, &DatabaseHandleTypeTag);
  if (status != napi_ok) return NULL;

  // Stocker le pointeur vers la structure `DatabaseHandle` à l’intérieur de l’objet JS.
  status = napi_wrap(env, result, dbHandle, NULL, NULL, NULL);
  if (status != napi_ok) return NULL;

  return result;
}

// Plus tard, lorsque nous recevons un objet JavaScript prétendant être un descripteur de base de données
// nous pouvons utiliser `napi_check_object_type_tag()` pour s’assurer qu’il s’agit bien d’un tel
// descripteur.

static napi_value
query(napi_env env, napi_callback_info info) {
  napi_status status;
  size_t argc = 2;
  napi_value argv[2];
  bool is_db_handle;

  status = napi_get_cb_info(env, info, &argc, argv, NULL, NULL);
  if (status != napi_ok) return NULL;

  // Vérifier que l’objet passé comme premier paramètre a la balise précédemment
  // appliquée.
  status = napi_check_object_type_tag(env,
                                      argv[0],
                                      &DatabaseHandleTypeTag,
                                      &is_db_handle);
  if (status != napi_ok) return NULL;

  // Lancer une `TypeError` si ce n’est pas le cas.
  if (!is_db_handle) {
    // Lancer une TypeError.
    return NULL;
  }
}
```

### `napi_define_class` {#napi_define_class}

**Ajoutée dans : v8.0.0**

**Version N-API : 1**

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
- `[in] env` : l'environnement dans lequel l'API est appelée.
- `[in] utf8name` : nom de la fonction constructeur JavaScript. Par souci de clarté, il est recommandé d'utiliser le nom de la classe C++ lors de l'encapsulation d'une classe C++.
- `[in] length` : la longueur de `utf8name` en octets, ou `NAPI_AUTO_LENGTH` si elle est terminée par null.
- `[in] constructor` : fonction de rappel qui gère la construction d'instances de la classe. Lors de l'encapsulation d'une classe C++, cette méthode doit être un membre statique avec la signature [`napi_callback`](/fr/nodejs/api/n-api#napi_callback). Un constructeur de classe C++ ne peut pas être utilisé. [`napi_callback`](/fr/nodejs/api/n-api#napi_callback) fournit plus de détails.
- `[in] data` : données facultatives à transmettre au rappel du constructeur en tant que propriété `data` des informations de rappel.
- `[in] property_count` : nombre d'éléments dans l'argument de tableau `properties`.
- `[in] properties` : tableau de descripteurs de propriété décrivant les propriétés de données statiques et d'instance, les accesseurs et les méthodes de la classe. Voir `napi_property_descriptor`.
- `[out] result` : une `napi_value` représentant la fonction constructeur pour la classe.

Renvoie `napi_ok` si l'API a réussi.

Définit une classe JavaScript, y compris :

- Une fonction constructeur JavaScript qui a le nom de la classe. Lors de l'encapsulation d'une classe C++ correspondante, le rappel passé via `constructor` peut être utilisé pour instancier une nouvelle instance de classe C++, qui peut ensuite être placée à l'intérieur de l'instance d'objet JavaScript en cours de construction à l'aide de [`napi_wrap`](/fr/nodejs/api/n-api#napi_wrap).
- Les propriétés de la fonction constructeur dont l'implémentation peut appeler les propriétés de données, les accesseurs et les méthodes *statiques* correspondants de la classe C++ (définis par les descripteurs de propriété avec l'attribut `napi_static`).
- Les propriétés de l'objet `prototype` de la fonction constructeur. Lors de l'encapsulation d'une classe C++, les propriétés de données, les accesseurs et les méthodes *non statiques* de la classe C++ peuvent être appelés à partir des fonctions statiques indiquées dans les descripteurs de propriété sans l'attribut `napi_static` après avoir récupéré l'instance de classe C++ placée à l'intérieur de l'instance d'objet JavaScript en utilisant [`napi_unwrap`](/fr/nodejs/api/n-api#napi_unwrap).

Lors de l'encapsulation d'une classe C++, le rappel du constructeur C++ passé via `constructor` doit être une méthode statique de la classe qui appelle le constructeur de classe réel, puis encapsule la nouvelle instance C++ dans un objet JavaScript et renvoie l'objet wrapper. Voir [`napi_wrap`](/fr/nodejs/api/n-api#napi_wrap) pour plus de détails.

La fonction constructeur JavaScript renvoyée par [`napi_define_class`](/fr/nodejs/api/n-api#napi_define_class) est souvent enregistrée et utilisée ultérieurement pour construire de nouvelles instances de la classe à partir de code natif, et/ou pour vérifier si les valeurs fournies sont des instances de la classe. Dans ce cas, pour empêcher la valeur de la fonction d'être récupérée par le garbage collector, une référence persistante forte à celle-ci peut être créée à l'aide de [`napi_create_reference`](/fr/nodejs/api/n-api#napi_create_reference), garantissant que le nombre de références est maintenu \>= 1.

Toute donnée non `NULL` qui est transmise à cette API via le paramètre `data` ou via le champ `data` des éléments du tableau `napi_property_descriptor` peut être associée au constructeur JavaScript résultant (qui est renvoyé dans le paramètre `result`) et libérée chaque fois que la classe est récupérée par le garbage collector en transmettant à la fois la fonction JavaScript et les données à [`napi_add_finalizer`](/fr/nodejs/api/n-api#napi_add_finalizer).


### `napi_wrap` {#napi_wrap}

**Ajouté dans : v8.0.0**

**Version N-API : 1**

```C [C]
napi_status napi_wrap(napi_env env,
                      napi_value js_object,
                      void* native_object,
                      napi_finalize finalize_cb,
                      void* finalize_hint,
                      napi_ref* result);
```
- `[in] env` : l’environnement sous lequel l’API est appelée.
- `[in] js_object` : l’objet JavaScript qui sera l’enveloppe de l’objet natif.
- `[in] native_object` : l’instance native qui sera enveloppée dans l’objet JavaScript.
- `[in] finalize_cb` : rappel natif optionnel qui peut être utilisé pour libérer l’instance native lorsque l’objet JavaScript a été nettoyé par le garbage collector. [`napi_finalize`](/fr/nodejs/api/n-api#napi_finalize) fournit plus de détails.
- `[in] finalize_hint` : indication contextuelle facultative qui est passée au rappel de finalisation.
- `[out] result` : référence facultative à l’objet enveloppé.

Renvoie `napi_ok` si l’API a réussi.

Enveloppe une instance native dans un objet JavaScript. L’instance native peut être récupérée ultérieurement à l’aide de `napi_unwrap()`.

Lorsque le code JavaScript invoque un constructeur pour une classe qui a été définie à l’aide de `napi_define_class()`, le `napi_callback` pour le constructeur est invoqué. Après avoir construit une instance de la classe native, le rappel doit ensuite appeler `napi_wrap()` pour envelopper l’instance nouvellement construite dans l’objet JavaScript déjà créé qui est l’argument `this` du rappel du constructeur. (Cet objet `this` a été créé à partir du `prototype` de la fonction constructeur, il a donc déjà des définitions de toutes les propriétés et méthodes de l’instance.)

Généralement, lors de l’enveloppement d’une instance de classe, un rappel de finalisation doit être fourni qui supprime simplement l’instance native qui est reçue en tant qu’argument `data` du rappel de finalisation.

La référence renvoyée facultative est initialement une référence faible, ce qui signifie qu’elle a un nombre de références de 0. Généralement, ce nombre de références serait incrémenté temporairement pendant les opérations asynchrones qui nécessitent que l’instance reste valide.

*Attention* : La référence renvoyée facultative (si elle est obtenue) doit être supprimée via [`napi_delete_reference`](/fr/nodejs/api/n-api#napi_delete_reference) UNIQUEMENT en réponse à l’appel de rappel de finalisation. Si elle est supprimée avant, le rappel de finalisation peut ne jamais être invoqué. Par conséquent, lors de l’obtention d’une référence, un rappel de finalisation est également requis afin de permettre l’élimination correcte de la référence.

Les rappels de finalisation peuvent être différés, laissant une fenêtre où l’objet a été nettoyé par le garbage collector (et la référence faible n’est pas valide), mais le finaliseur n’a pas encore été appelé. Lorsque vous utilisez `napi_get_reference_value()` sur des références faibles renvoyées par `napi_wrap()`, vous devez toujours gérer un résultat vide.

L’appel de `napi_wrap()` une seconde fois sur un objet renverra une erreur. Pour associer une autre instance native à l’objet, utilisez d’abord `napi_remove_wrap()`.


### `napi_unwrap` {#napi_unwrap}

**Ajouté dans : v8.0.0**

**Version N-API : 1**

```C [C]
napi_status napi_unwrap(napi_env env,
                        napi_value js_object,
                        void** result);
```
- `[in] env` : l’environnement sous lequel l’API est appelée.
- `[in] js_object` : l’objet associé à l’instance native.
- `[out] result` : pointeur vers l’instance native encapsulée.

Renvoie `napi_ok` si l’API a réussi.

Récupère une instance native qui a été précédemment encapsulée dans un objet JavaScript à l’aide de `napi_wrap()`.

Lorsque le code JavaScript appelle une méthode ou un accesseur de propriété sur la classe, le `napi_callback` correspondant est appelé. Si le rappel est pour une méthode d’instance ou un accesseur, alors l’argument `this` du rappel est l’objet wrapper ; l’instance C++ encapsulée qui est la cible de l’appel peut alors être obtenue en appelant `napi_unwrap()` sur l’objet wrapper.

### `napi_remove_wrap` {#napi_remove_wrap}

**Ajouté dans : v8.5.0**

**Version N-API : 1**

```C [C]
napi_status napi_remove_wrap(napi_env env,
                             napi_value js_object,
                             void** result);
```
- `[in] env` : l’environnement sous lequel l’API est appelée.
- `[in] js_object` : l’objet associé à l’instance native.
- `[out] result` : pointeur vers l’instance native encapsulée.

Renvoie `napi_ok` si l’API a réussi.

Récupère une instance native qui a été précédemment encapsulée dans l’objet JavaScript `js_object` à l’aide de `napi_wrap()` et supprime l’encapsulation. Si un rappel de finalisation était associé à l’encapsulation, il ne sera plus appelé lorsque l’objet JavaScript sera collecté par le garbage collector.

### `napi_type_tag_object` {#napi_type_tag_object}

**Ajouté dans : v14.8.0, v12.19.0**

**Version N-API : 8**

```C [C]
napi_status napi_type_tag_object(napi_env env,
                                 napi_value js_object,
                                 const napi_type_tag* type_tag);
```
- `[in] env` : l’environnement sous lequel l’API est appelée.
- `[in] js_object` : l’objet JavaScript ou [externe](/fr/nodejs/api/n-api#napi_create_external) à marquer.
- `[in] type_tag` : la balise avec laquelle l’objet doit être marqué.

Renvoie `napi_ok` si l’API a réussi.

Associe la valeur du pointeur `type_tag` à l’objet JavaScript ou [externe](/fr/nodejs/api/n-api#napi_create_external). `napi_check_object_type_tag()` peut ensuite être utilisé pour comparer la balise qui a été attachée à l’objet avec celle détenue par l’addon afin de s’assurer que l’objet a le bon type.

Si l’objet a déjà une balise de type associée, cette API renverra `napi_invalid_arg`.


### `napi_check_object_type_tag` {#napi_check_object_type_tag}

**Ajouté dans : v14.8.0, v12.19.0**

**Version N-API : 8**

```C [C]
napi_status napi_check_object_type_tag(napi_env env,
                                       napi_value js_object,
                                       const napi_type_tag* type_tag,
                                       bool* result);
```
- `[in] env` : L’environnement dans lequel l’API est invoquée.
- `[in] js_object` : L’objet JavaScript ou [external](/fr/nodejs/api/n-api#napi_create_external) dont le type de tag doit être examiné.
- `[in] type_tag` : Le tag avec lequel comparer tout tag trouvé sur l’objet.
- `[out] result` : Indique si le type de tag donné correspond au type de tag sur l’objet. `false` est également renvoyé si aucun type de tag n’a été trouvé sur l’objet.

Renvoie `napi_ok` si l’API a réussi.

Compare le pointeur donné comme `type_tag` avec tout ce qui peut être trouvé sur `js_object`. Si aucun tag n’est trouvé sur `js_object` ou, si un tag est trouvé mais qu’il ne correspond pas à `type_tag`, alors `result` est défini sur `false`. Si un tag est trouvé et qu’il correspond à `type_tag`, alors `result` est défini sur `true`.

### `napi_add_finalizer` {#napi_add_finalizer}

**Ajouté dans : v8.0.0**

**Version N-API : 5**

```C [C]
napi_status napi_add_finalizer(napi_env env,
                               napi_value js_object,
                               void* finalize_data,
                               node_api_basic_finalize finalize_cb,
                               void* finalize_hint,
                               napi_ref* result);
```
- `[in] env` : L’environnement dans lequel l’API est invoquée.
- `[in] js_object` : L’objet JavaScript auquel les données natives seront attachées.
- `[in] finalize_data` : Données optionnelles à transmettre à `finalize_cb`.
- `[in] finalize_cb` : Callback native qui sera utilisée pour libérer les données natives lorsque l’objet JavaScript a été récupéré par le garbage collector. [`napi_finalize`](/fr/nodejs/api/n-api#napi_finalize) fournit plus de détails.
- `[in] finalize_hint` : Indication contextuelle optionnelle qui est transmise au callback de finalisation.
- `[out] result` : Référence optionnelle à l’objet JavaScript.

Renvoie `napi_ok` si l’API a réussi.

Ajoute un callback `napi_finalize` qui sera appelé lorsque l’objet JavaScript dans `js_object` aura été récupéré par le garbage collector.

Cette API peut être appelée plusieurs fois sur un seul objet JavaScript.

*Attention* : La référence optionnelle renvoyée (si elle est obtenue) doit être supprimée via [`napi_delete_reference`](/fr/nodejs/api/n-api#napi_delete_reference) UNIQUEMENT en réponse à l’invocation du callback de finalisation. Si elle est supprimée avant, le callback de finalisation peut ne jamais être invoqué. Par conséquent, lors de l’obtention d’une référence, un callback de finalisation est également requis afin de permettre la suppression correcte de la référence.


#### `node_api_post_finalizer` {#node_api_post_finalizer}

**Ajouté dans : v21.0.0, v20.10.0, v18.19.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

```C [C]
napi_status node_api_post_finalizer(node_api_basic_env env,
                                    napi_finalize finalize_cb,
                                    void* finalize_data,
                                    void* finalize_hint);
```
- `[in] env`: L’environnement dans lequel l’API est appelée.
- `[in] finalize_cb`: Callback natif qui sera utilisé pour libérer les données natives lorsque l’objet JavaScript a été récupéré par le garbage collector. [`napi_finalize`](/fr/nodejs/api/n-api#napi_finalize) fournit plus de détails.
- `[in] finalize_data`: Données facultatives à transmettre à `finalize_cb`.
- `[in] finalize_hint`: Indication contextuelle facultative qui est transmise au callback de finalisation.

Retourne `napi_ok` si l’API a réussi.

Planifie un callback `napi_finalize` à appeler de manière asynchrone dans la boucle d’événements.

Normalement, les finaliseurs sont appelés pendant que le GC (garbage collector) collecte les objets. À ce stade, l’appel de toute Node-API susceptible de provoquer des modifications dans l’état du GC sera désactivé et Node.js plantera.

`node_api_post_finalizer` permet de contourner cette limitation en permettant à l’addon de différer les appels à ces Node-API à un moment en dehors de la finalisation du GC.

## Opérations asynchrones simples {#simple-asynchronous-operations}

Les modules d’addon doivent souvent tirer parti des assistants asynchrones de libuv dans le cadre de leur implémentation. Cela leur permet de planifier l’exécution du travail de manière asynchrone afin que leurs méthodes puissent retourner avant que le travail ne soit terminé. Cela leur permet d’éviter de bloquer l’exécution globale de l’application Node.js.

Node-API fournit une interface ABI-stable pour ces fonctions de support qui couvre les cas d’utilisation asynchrones les plus courants.

Node-API définit la structure `napi_async_work` qui est utilisée pour gérer les workers asynchrones. Les instances sont créées/supprimées avec [`napi_create_async_work`](/fr/nodejs/api/n-api#napi_create_async_work) et [`napi_delete_async_work`](/fr/nodejs/api/n-api#napi_delete_async_work).

Les callbacks `execute` et `complete` sont des fonctions qui seront appelées lorsque l’exécuteur est prêt à exécuter et lorsqu’il termine sa tâche respectivement.

La fonction `execute` doit éviter d’effectuer des appels Node-API qui pourraient entraîner l’exécution de JavaScript ou l’interaction avec des objets JavaScript. Le plus souvent, tout code qui doit effectuer des appels Node-API doit être effectué dans le callback `complete` à la place. Évitez d’utiliser le paramètre `napi_env` dans le callback execute car il exécutera probablement du JavaScript.

Ces fonctions implémentent les interfaces suivantes :

```C [C]
typedef void (*napi_async_execute_callback)(napi_env env,
                                            void* data);
typedef void (*napi_async_complete_callback)(napi_env env,
                                             napi_status status,
                                             void* data);
```
Lorsque ces méthodes sont appelées, le paramètre `data` transmis sera les données `void*` fournies par l’addon qui ont été transmises à l’appel `napi_create_async_work`.

Une fois créé, le worker asynchrone peut être mis en file d’attente pour l’exécution à l’aide de la fonction [`napi_queue_async_work`](/fr/nodejs/api/n-api#napi_queue_async_work) :

```C [C]
napi_status napi_queue_async_work(node_api_basic_env env,
                                  napi_async_work work);
```
[`napi_cancel_async_work`](/fr/nodejs/api/n-api#napi_cancel_async_work) peut être utilisé si le travail doit être annulé avant que le travail n’ait commencé son exécution.

Après avoir appelé [`napi_cancel_async_work`](/fr/nodejs/api/n-api#napi_cancel_async_work), le callback `complete` sera appelé avec une valeur d’état de `napi_cancelled`. Le travail ne doit pas être supprimé avant l’appel du callback `complete`, même lorsqu’il a été annulé.


### `napi_create_async_work` {#napi_create_async_work}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v8.6.0 | Ajout des paramètres `async_resource` et `async_resource_name`. |
| v8.0.0 | Ajouté dans : v8.0.0 |
:::

**Version N-API : 1**

```C [C]
napi_status napi_create_async_work(napi_env env,
                                   napi_value async_resource,
                                   napi_value async_resource_name,
                                   napi_async_execute_callback execute,
                                   napi_async_complete_callback complete,
                                   void* data,
                                   napi_async_work* result);
```
- `[in] env` : L’environnement sous lequel l’API est invoquée.
- `[in] async_resource` : Un objet optionnel associé au travail asynchrone qui sera transmis aux éventuels hooks `async_hooks` [`init`](/fr/nodejs/api/async_hooks#initasyncid-type-triggerasyncid-resource).
- `[in] async_resource_name` : Identifiant du type de ressource qui est fourni pour les informations de diagnostic exposées par l’API `async_hooks`.
- `[in] execute` : La fonction native qui doit être appelée pour exécuter la logique de manière asynchrone. La fonction donnée est appelée à partir d’un thread du pool de travailleurs et peut s’exécuter en parallèle avec le thread de la boucle d’événements principale.
- `[in] complete` : La fonction native qui sera appelée lorsque la logique asynchrone sera terminée ou annulée. La fonction donnée est appelée à partir du thread de la boucle d’événements principale. [`napi_async_complete_callback`](/fr/nodejs/api/n-api#napi_async_complete_callback) fournit plus de détails.
- `[in] data` : Contexte de données fourni par l’utilisateur. Il sera renvoyé aux fonctions d’exécution et d’achèvement.
- `[out] result` : `napi_async_work*` qui est le handle du travail asynchrone nouvellement créé.

Renvoie `napi_ok` si l’API a réussi.

Cette API alloue un objet de travail qui est utilisé pour exécuter la logique de manière asynchrone. Il doit être libéré à l’aide de [`napi_delete_async_work`](/fr/nodejs/api/n-api#napi_delete_async_work) une fois que le travail n’est plus requis.

`async_resource_name` doit être une chaîne de caractères UTF-8 terminée par un caractère nul.

L’identifiant `async_resource_name` est fourni par l’utilisateur et doit être représentatif du type de travail asynchrone effectué. Il est également recommandé d’appliquer un espace de noms à l’identifiant, par exemple en incluant le nom du module. Voir la [`documentation async_hooks`](/fr/nodejs/api/async_hooks#type) pour plus d’informations.


### `napi_delete_async_work` {#napi_delete_async_work}

**Ajouté dans : v8.0.0**

**Version N-API : 1**

```C [C]
napi_status napi_delete_async_work(napi_env env,
                                   napi_async_work work);
```
- `[in] env` : l’environnement dans lequel l’API est appelée.
- `[in] work` : le descripteur renvoyé par l’appel à `napi_create_async_work`.

Renvoie `napi_ok` si l’API a réussi.

Cette API libère un objet de travail précédemment alloué.

Cette API peut être appelée même s’il existe une exception JavaScript en attente.

### `napi_queue_async_work` {#napi_queue_async_work}

**Ajouté dans : v8.0.0**

**Version N-API : 1**

```C [C]
napi_status napi_queue_async_work(node_api_basic_env env,
                                  napi_async_work work);
```
- `[in] env` : l’environnement dans lequel l’API est appelée.
- `[in] work` : le descripteur renvoyé par l’appel à `napi_create_async_work`.

Renvoie `napi_ok` si l’API a réussi.

Cette API demande que le travail précédemment alloué soit planifié pour exécution. Une fois qu’elle renvoie avec succès, cette API ne doit plus être appelée avec le même élément `napi_async_work`, faute de quoi le résultat sera indéfini.

### `napi_cancel_async_work` {#napi_cancel_async_work}

**Ajouté dans : v8.0.0**

**Version N-API : 1**

```C [C]
napi_status napi_cancel_async_work(node_api_basic_env env,
                                   napi_async_work work);
```
- `[in] env` : l’environnement dans lequel l’API est appelée.
- `[in] work` : le descripteur renvoyé par l’appel à `napi_create_async_work`.

Renvoie `napi_ok` si l’API a réussi.

Cette API annule le travail mis en file d’attente s’il n’a pas encore été démarré. S’il a déjà commencé à s’exécuter, il ne peut pas être annulé et `napi_generic_failure` sera renvoyé. En cas de succès, le rappel `complete` sera invoqué avec une valeur d’état de `napi_cancelled`. Le travail ne doit pas être supprimé avant l’invocation du rappel `complete`, même s’il a été annulé avec succès.

Cette API peut être appelée même s’il existe une exception JavaScript en attente.

## Opérations asynchrones personnalisées {#custom-asynchronous-operations}

Les API de travail asynchrones simples ci-dessus peuvent ne pas convenir à tous les scénarios. Lorsque vous utilisez un autre mécanisme asynchrone, les API suivantes sont nécessaires pour s’assurer qu’une opération asynchrone est correctement suivie par le runtime.


### `napi_async_init` {#napi_async_init}

**Ajoutée dans: v8.6.0**

**Version N-API: 1**

```C [C]
napi_status napi_async_init(napi_env env,
                            napi_value async_resource,
                            napi_value async_resource_name,
                            napi_async_context* result)
```
- `[in] env`: L'environnement dans lequel l'API est invoquée.
- `[in] async_resource`: Objet associé au travail asynchrone qui sera transmis aux possibles [`hooks init`](/fr/nodejs/api/async_hooks#initasyncid-type-triggerasyncid-resource) d'`async_hooks` et auquel on peut accéder via [`async_hooks.executionAsyncResource()`](/fr/nodejs/api/async_hooks#async_hooksexecutionasyncresource).
- `[in] async_resource_name`: Identifiant du type de ressource fournie pour les informations de diagnostic exposées par l'API `async_hooks`.
- `[out] result`: Le contexte asynchrone initialisé.

Renvoie `napi_ok` si l'API a réussi.

L'objet `async_resource` doit être maintenu en vie jusqu'à [`napi_async_destroy`](/fr/nodejs/api/n-api#napi_async_destroy) pour que l'API liée à `async_hooks` agisse correctement. Afin de conserver la compatibilité ABI avec les versions précédentes, les `napi_async_context` ne maintiennent pas de référence forte aux objets `async_resource` afin d'éviter d'introduire des fuites de mémoire. Cependant, si la `async_resource` est récupérée par le garbage collector du moteur JavaScript avant que le `napi_async_context` ne soit détruit par `napi_async_destroy`, appeler des API liées à `napi_async_context` comme [`napi_open_callback_scope`](/fr/nodejs/api/n-api#napi_open_callback_scope) et [`napi_make_callback`](/fr/nodejs/api/n-api#napi_make_callback) peut entraîner des problèmes tels que la perte de contexte asynchrone lors de l'utilisation de l'API `AsyncLocalStorage`.

Afin de conserver la compatibilité ABI avec les versions précédentes, passer `NULL` pour `async_resource` n'entraîne pas d'erreur. Cependant, cela n'est pas recommandé car cela entraînerait un comportement indésirable avec les [`hooks init`](/fr/nodejs/api/async_hooks#initasyncid-type-triggerasyncid-resource) d'`async_hooks` et `async_hooks.executionAsyncResource()` car la ressource est désormais requise par l'implémentation sous-jacente d'`async_hooks` afin de fournir la liaison entre les rappels asynchrones.


### `napi_async_destroy` {#napi_async_destroy}

**Ajouté dans la version : v8.6.0**

**Version N-API : 1**

```C [C]
napi_status napi_async_destroy(napi_env env,
                               napi_async_context async_context);
```
- `[in] env` : L’environnement dans lequel l’API est invoquée.
- `[in] async_context` : Le contexte asynchrone à détruire.

Renvoie `napi_ok` si l’API a réussi.

Cette API peut être appelée même s’il existe une exception JavaScript en attente.

### `napi_make_callback` {#napi_make_callback}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v8.6.0 | Ajout du paramètre `async_context`. |
| v8.0.0 | Ajouté dans la version : v8.0.0 |
:::

**Version N-API : 1**

```C [C]
NAPI_EXTERN napi_status napi_make_callback(napi_env env,
                                           napi_async_context async_context,
                                           napi_value recv,
                                           napi_value func,
                                           size_t argc,
                                           const napi_value* argv,
                                           napi_value* result);
```
- `[in] env` : L’environnement dans lequel l’API est invoquée.
- `[in] async_context` : Contexte de l’opération asynchrone qui invoque le rappel. Il doit normalement s’agir d’une valeur précédemment obtenue à partir de [`napi_async_init`](/fr/nodejs/api/n-api#napi_async_init). Afin de conserver la compatibilité ABI avec les versions précédentes, le passage de `NULL` pour `async_context` n’entraîne pas d’erreur. Cependant, cela entraîne un fonctionnement incorrect des hooks asynchrones. Les problèmes potentiels incluent la perte du contexte asynchrone lors de l’utilisation de l’API `AsyncLocalStorage`.
- `[in] recv` : La valeur `this` transmise à la fonction appelée.
- `[in] func` : `napi_value` représentant la fonction JavaScript à invoquer.
- `[in] argc` : Le nombre d’éléments dans le tableau `argv`.
- `[in] argv` : Tableau de valeurs JavaScript en tant que `napi_value` représentant les arguments de la fonction. Si `argc` est égal à zéro, ce paramètre peut être omis en passant `NULL`.
- `[out] result` : `napi_value` représentant l’objet JavaScript renvoyé.

Renvoie `napi_ok` si l’API a réussi.

Cette méthode permet d’appeler un objet de fonction JavaScript à partir d’un add-on natif. Cette API est similaire à `napi_call_function`. Cependant, elle est utilisée pour appeler *depuis* le code natif *vers* JavaScript *après* le retour d’une opération asynchrone (lorsqu’il n’y a pas d’autre script sur la pile). Il s’agit d’un wrapper assez simple autour de `node::MakeCallback`.

Notez qu’il n’est *pas* nécessaire d’utiliser `napi_make_callback` à partir d’une `napi_async_complete_callback` ; dans cette situation, le contexte asynchrone du rappel a déjà été configuré, de sorte qu’un appel direct à `napi_call_function` est suffisant et approprié. L’utilisation de la fonction `napi_make_callback` peut être nécessaire lors de la mise en œuvre d’un comportement asynchrone personnalisé qui n’utilise pas `napi_create_async_work`.

Tous les `process.nextTick`s ou Promises planifiées dans la file d’attente des microtâches par JavaScript pendant le rappel sont exécutés avant de revenir à C/C++.


### `napi_open_callback_scope` {#napi_open_callback_scope}

**Ajouté dans : v9.6.0**

**Version N-API : 3**

```C [C]
NAPI_EXTERN napi_status napi_open_callback_scope(napi_env env,
                                                 napi_value resource_object,
                                                 napi_async_context context,
                                                 napi_callback_scope* result)
```
- `[in] env`: L’environnement dans lequel l’API est invoquée.
- `[in] resource_object`: Un objet associé au travail asynchrone qui sera passé aux éventuels hooks [`init` de `async_hooks`](/fr/nodejs/api/async_hooks#initasyncid-type-triggerasyncid-resource). Ce paramètre a été déprécié et est ignoré au moment de l’exécution. Utilisez plutôt le paramètre `async_resource` dans [`napi_async_init`](/fr/nodejs/api/n-api#napi_async_init).
- `[in] context`: Contexte de l’opération asynchrone qui invoque le callback. Il doit s’agir d’une valeur précédemment obtenue à partir de [`napi_async_init`](/fr/nodejs/api/n-api#napi_async_init).
- `[out] result`: La portée nouvellement créée.

Dans certains cas (par exemple, la résolution de promesses), il est nécessaire d’avoir l’équivalent de la portée associée à un callback en place lors de l’appel de certaines fonctions Node-API. S’il n’y a pas d’autre script sur la pile, les fonctions [`napi_open_callback_scope`](/fr/nodejs/api/n-api#napi_open_callback_scope) et [`napi_close_callback_scope`](/fr/nodejs/api/n-api#napi_close_callback_scope) peuvent être utilisées pour ouvrir/fermer la portée requise.

### `napi_close_callback_scope` {#napi_close_callback_scope}

**Ajouté dans : v9.6.0**

**Version N-API : 3**

```C [C]
NAPI_EXTERN napi_status napi_close_callback_scope(napi_env env,
                                                  napi_callback_scope scope)
```
- `[in] env`: L’environnement dans lequel l’API est invoquée.
- `[in] scope`: La portée à fermer.

Cette API peut être appelée même s’il existe une exception JavaScript en attente.

## Gestion des versions {#version-management}

### `napi_get_node_version` {#napi_get_node_version}

**Ajouté dans : v8.4.0**

**Version N-API : 1**

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
- `[in] env`: L’environnement dans lequel l’API est invoquée.
- `[out] version`: Un pointeur vers les informations de version pour Node.js lui-même.

Renvoie `napi_ok` si l’API a réussi.

Cette fonction remplit la structure `version` avec la version majeure, mineure et de correctif de Node.js qui est actuellement en cours d’exécution, et le champ `release` avec la valeur de [`process.release.name`](/fr/nodejs/api/process#processrelease).

Le tampon renvoyé est alloué statiquement et n’a pas besoin d’être libéré.


### `napi_get_version` {#napi_get_version}

**Ajoutée dans : v8.0.0**

**Version N-API : 1**

```C [C]
napi_status napi_get_version(node_api_basic_env env,
                             uint32_t* result);
```
- `[in] env`: L’environnement sous lequel l’API est invoquée.
- `[out] result`: La version la plus élevée de Node-API prise en charge.

Renvoie `napi_ok` si l’API a réussi.

Cette API renvoie la version Node-API la plus élevée prise en charge par l’environnement d’exécution Node.js. Node-API est prévu pour être additif de sorte que les versions plus récentes de Node.js peuvent prendre en charge des fonctions API supplémentaires. Afin de permettre à un module complémentaire d’utiliser une fonction plus récente lors de l’exécution avec des versions de Node.js qui la prennent en charge, tout en fournissant un comportement de repli lors de l’exécution avec des versions de Node.js qui ne la prennent pas en charge :

- Appelez `napi_get_version()` pour déterminer si l’API est disponible.
- Si disponible, chargez dynamiquement un pointeur vers la fonction à l’aide de `uv_dlsym()`.
- Utilisez le pointeur chargé dynamiquement pour invoquer la fonction.
- Si la fonction n’est pas disponible, fournissez une implémentation alternative qui n’utilise pas la fonction.

## Gestion de la mémoire {#memory-management}

### `napi_adjust_external_memory` {#napi_adjust_external_memory}

**Ajoutée dans : v8.5.0**

**Version N-API : 1**

```C [C]
NAPI_EXTERN napi_status napi_adjust_external_memory(node_api_basic_env env,
                                                    int64_t change_in_bytes,
                                                    int64_t* result);
```
- `[in] env`: L’environnement sous lequel l’API est invoquée.
- `[in] change_in_bytes`: La modification de la mémoire allouée en externe qui est maintenue en vie par les objets JavaScript.
- `[out] result`: La valeur ajustée

Renvoie `napi_ok` si l’API a réussi.

Cette fonction donne à V8 une indication de la quantité de mémoire allouée en externe qui est maintenue en vie par les objets JavaScript (c’est-à-dire, un objet JavaScript qui pointe vers sa propre mémoire allouée par un module complémentaire natif). L’enregistrement de la mémoire allouée en externe déclenchera des collectes globales de déchets plus souvent qu’il ne le ferait autrement.

## Promesses {#promises}

Node-API fournit des installations pour créer des objets `Promise` comme décrit dans la [Section 25.4](https://tc39.github.io/ecma262/#sec-promise-objects) de la spécification ECMA. Elle implémente les promesses sous forme de paire d’objets. Lorsqu’une promesse est créée par `napi_create_promise()`, un objet "différé" est créé et renvoyé avec la `Promise`. L’objet différé est lié à la `Promise` créée et est le seul moyen de résoudre ou de rejeter la `Promise` en utilisant `napi_resolve_deferred()` ou `napi_reject_deferred()`. L’objet différé qui est créé par `napi_create_promise()` est libéré par `napi_resolve_deferred()` ou `napi_reject_deferred()`. L’objet `Promise` peut être renvoyé à JavaScript où il peut être utilisé de la manière habituelle.

Par exemple, pour créer une promesse et la transmettre à un worker asynchrone :

```C [C]
napi_deferred deferred;
napi_value promise;
napi_status status;

// Créer la promesse.
status = napi_create_promise(env, &deferred, &promise);
if (status != napi_ok) return NULL;

// Transmettre le différé à une fonction qui effectue une action asynchrone.
do_something_asynchronous(deferred);

// Renvoyer la promesse à JS
return promise;
```
La fonction ci-dessus `do_something_asynchronous()` effectuerait son action asynchrone puis résoudrait ou rejetterait le différé, concluant ainsi la promesse et libérant le différé :

```C [C]
napi_deferred deferred;
napi_value undefined;
napi_status status;

// Créer une valeur avec laquelle conclure le différé.
status = napi_get_undefined(env, &undefined);
if (status != napi_ok) return NULL;

// Résoudre ou rejeter la promesse associée au différé selon que
// l’action asynchrone a réussi.
if (asynchronous_action_succeeded) {
  status = napi_resolve_deferred(env, deferred, undefined);
} else {
  status = napi_reject_deferred(env, deferred, undefined);
}
if (status != napi_ok) return NULL;

// À ce stade, le différé a été libéré, nous devons donc lui attribuer la valeur NULL.
deferred = NULL;
```

### `napi_create_promise` {#napi_create_promise}

**Ajouté dans : v8.5.0**

**Version N-API : 1**

```C [C]
napi_status napi_create_promise(napi_env env,
                                napi_deferred* deferred,
                                napi_value* promise);
```
- `[in] env` : l’environnement sous lequel l’API est appelée.
- `[out] deferred` : un objet différé nouvellement créé qui peut ensuite être passé à `napi_resolve_deferred()` ou `napi_reject_deferred()` pour résoudre ou rejeter la promesse associée, respectivement.
- `[out] promise` : la promesse JavaScript associée à l’objet différé.

Renvoie `napi_ok` si l’API a réussi.

Cette API crée un objet différé et une promesse JavaScript.

### `napi_resolve_deferred` {#napi_resolve_deferred}

**Ajouté dans : v8.5.0**

**Version N-API : 1**

```C [C]
napi_status napi_resolve_deferred(napi_env env,
                                  napi_deferred deferred,
                                  napi_value resolution);
```
- `[in] env` : l’environnement sous lequel l’API est appelée.
- `[in] deferred` : l’objet différé dont la promesse associée doit être résolue.
- `[in] resolution` : la valeur avec laquelle résoudre la promesse.

Cette API résout une promesse JavaScript au moyen de l’objet différé auquel elle est associée. Par conséquent, elle ne peut être utilisée que pour résoudre les promesses JavaScript pour lesquelles l’objet différé correspondant est disponible. Cela signifie concrètement que la promesse doit avoir été créée à l’aide de `napi_create_promise()` et que l’objet différé renvoyé par cet appel doit avoir été conservé afin d’être transmis à cette API.

L’objet différé est libéré une fois l’opération terminée avec succès.

### `napi_reject_deferred` {#napi_reject_deferred}

**Ajouté dans : v8.5.0**

**Version N-API : 1**

```C [C]
napi_status napi_reject_deferred(napi_env env,
                                 napi_deferred deferred,
                                 napi_value rejection);
```
- `[in] env` : l’environnement sous lequel l’API est appelée.
- `[in] deferred` : l’objet différé dont la promesse associée doit être résolue.
- `[in] rejection` : la valeur avec laquelle rejeter la promesse.

Cette API rejette une promesse JavaScript au moyen de l’objet différé auquel elle est associée. Par conséquent, elle ne peut être utilisée que pour rejeter les promesses JavaScript pour lesquelles l’objet différé correspondant est disponible. Cela signifie concrètement que la promesse doit avoir été créée à l’aide de `napi_create_promise()` et que l’objet différé renvoyé par cet appel doit avoir été conservé afin d’être transmis à cette API.

L’objet différé est libéré une fois l’opération terminée avec succès.


### `napi_is_promise` {#napi_is_promise}

**Ajouté dans : v8.5.0**

**Version N-API : 1**

```C [C]
napi_status napi_is_promise(napi_env env,
                            napi_value value,
                            bool* is_promise);
```
- `[in] env`: L'environnement dans lequel l'API est invoquée.
- `[in] value`: La valeur à examiner
- `[out] is_promise`: Indicateur signalant si `promise` est un objet promise natif (c'est-à-dire un objet promise créé par le moteur sous-jacent).

## Exécution de script {#script-execution}

Node-API fournit une API pour exécuter une chaîne de caractères contenant du JavaScript à l'aide du moteur JavaScript sous-jacent.

### `napi_run_script` {#napi_run_script}

**Ajouté dans : v8.5.0**

**Version N-API : 1**

```C [C]
NAPI_EXTERN napi_status napi_run_script(napi_env env,
                                        napi_value script,
                                        napi_value* result);
```
- `[in] env`: L'environnement dans lequel l'API est invoquée.
- `[in] script`: Une chaîne JavaScript contenant le script à exécuter.
- `[out] result`: La valeur résultant de l'exécution du script.

Cette fonction exécute une chaîne de code JavaScript et renvoie son résultat avec les réserves suivantes :

- Contrairement à `eval`, cette fonction ne permet pas au script d'accéder à la portée lexicale actuelle, et donc également de ne pas accéder à la [portée du module](/fr/nodejs/api/modules#the-module-scope), ce qui signifie que les pseudo-globaux tels que `require` ne seront pas disponibles.
- Le script peut accéder à la [portée globale](/fr/nodejs/api/globals). Les déclarations de fonction et `var` dans le script seront ajoutées à l'objet [`global`](/fr/nodejs/api/globals#global). Les déclarations de variable faites en utilisant `let` et `const` seront visibles globalement, mais ne seront pas ajoutées à l'objet [`global`](/fr/nodejs/api/globals#global).
- La valeur de `this` est [`global`](/fr/nodejs/api/globals#global) au sein du script.

## Boucle d'événements libuv {#libuv-event-loop}

Node-API fournit une fonction pour obtenir la boucle d'événements actuelle associée à un `napi_env` spécifique.

### `napi_get_uv_event_loop` {#napi_get_uv_event_loop}

**Ajouté dans : v9.3.0, v8.10.0**

**Version N-API : 2**

```C [C]
NAPI_EXTERN napi_status napi_get_uv_event_loop(node_api_basic_env env,
                                               struct uv_loop_s** loop);
```
- `[in] env`: L'environnement dans lequel l'API est invoquée.
- `[out] loop`: L'instance de boucle libuv actuelle.

Note : Bien que libuv ait été relativement stable au fil du temps, il ne fournit pas de garantie de stabilité ABI. L'utilisation de cette fonction doit être évitée. Son utilisation peut entraîner un module complémentaire qui ne fonctionne pas entre les versions de Node.js. Les [appels de fonctions asynchrones thread-safe](/fr/nodejs/api/n-api#asynchronous-thread-safe-function-calls) sont une alternative pour de nombreux cas d'utilisation.


## Appels de fonctions asynchrones et thread-safe {#asynchronous-thread-safe-function-calls}

Les fonctions JavaScript ne peuvent normalement être appelées qu'à partir du thread principal d'un module complémentaire natif. Si un module complémentaire crée des threads supplémentaires, les fonctions Node-API qui nécessitent un `napi_env`, `napi_value` ou `napi_ref` ne doivent pas être appelées à partir de ces threads.

Lorsqu'un module complémentaire a des threads supplémentaires et que des fonctions JavaScript doivent être invoquées en fonction du traitement effectué par ces threads, ces threads doivent communiquer avec le thread principal du module complémentaire afin que le thread principal puisse invoquer la fonction JavaScript en leur nom. Les API de fonction thread-safe offrent un moyen facile de le faire.

Ces API fournissent le type `napi_threadsafe_function` ainsi que des API pour créer, détruire et appeler des objets de ce type. `napi_create_threadsafe_function()` crée une référence persistante à un `napi_value` qui contient une fonction JavaScript qui peut être appelée à partir de plusieurs threads. Les appels se produisent de manière asynchrone. Cela signifie que les valeurs avec lesquelles le callback JavaScript doit être appelé seront placées dans une queue, et, pour chaque valeur dans la queue, un appel sera finalement fait à la fonction JavaScript.

Lors de la création d'une `napi_threadsafe_function`, un callback `napi_finalize` peut être fourni. Ce callback sera invoqué sur le thread principal lorsque la fonction thread-safe est sur le point d'être détruite. Il reçoit le contexte et les données de finalisation fournies lors de la construction, et offre une opportunité de nettoyage après les threads, par exemple en appelant `uv_thread_join()`. **En dehors du thread de la boucle principale, aucun thread ne doit utiliser la fonction thread-safe une fois le callback de finalisation terminé.**

Le `contexte` donné lors de l'appel à `napi_create_threadsafe_function()` peut être récupéré depuis n'importe quel thread avec un appel à `napi_get_threadsafe_function_context()`.

### Appel d'une fonction thread-safe {#calling-a-thread-safe-function}

`napi_call_threadsafe_function()` peut être utilisé pour initier un appel dans JavaScript. `napi_call_threadsafe_function()` accepte un paramètre qui contrôle si l'API se comporte de manière bloquante. S'il est défini sur `napi_tsfn_nonblocking`, l'API se comporte de manière non bloquante, renvoyant `napi_queue_full` si la queue était pleine, empêchant ainsi les données d'être ajoutées avec succès à la queue. S'il est défini sur `napi_tsfn_blocking`, l'API se bloque jusqu'à ce que de l'espace devienne disponible dans la queue. `napi_call_threadsafe_function()` ne se bloque jamais si la fonction thread-safe a été créée avec une taille de queue maximale de 0.

`napi_call_threadsafe_function()` ne doit pas être appelé avec `napi_tsfn_blocking` à partir d'un thread JavaScript, car, si la queue est pleine, cela peut provoquer un blocage du thread JavaScript.

L'appel réel dans JavaScript est contrôlé par le callback donné via le paramètre `call_js_cb`. `call_js_cb` est invoqué sur le thread principal une fois pour chaque valeur qui a été placée dans la queue par un appel réussi à `napi_call_threadsafe_function()`. Si un tel callback n'est pas fourni, un callback par défaut sera utilisé, et l'appel JavaScript résultant n'aura aucun argument. Le callback `call_js_cb` reçoit la fonction JavaScript à appeler en tant que `napi_value` dans ses paramètres, ainsi que le pointeur de contexte `void*` utilisé lors de la création de la `napi_threadsafe_function`, et le pointeur de données suivant qui a été créé par l'un des threads secondaires. Le callback peut ensuite utiliser une API telle que `napi_call_function()` pour appeler dans JavaScript.

Le callback peut également être invoqué avec `env` et `call_js_cb` tous deux définis sur `NULL` pour indiquer que les appels dans JavaScript ne sont plus possibles, alors que des éléments restent dans la queue qui peuvent devoir être libérés. Cela se produit normalement lorsque le processus Node.js se termine alors qu'une fonction thread-safe est toujours active.

Il n'est pas nécessaire d'appeler JavaScript via `napi_make_callback()` car Node-API exécute `call_js_cb` dans un contexte approprié pour les callbacks.

Zéro ou plusieurs éléments mis en queue peuvent être invoqués à chaque tick de la boucle d'événements. Les applications ne doivent pas dépendre d'un comportement spécifique autre que des progrès dans l'invocation des callbacks seront réalisés et les événements seront invoqués au fur et à mesure que le temps avance.


### Comptage des références des fonctions thread-safe {#reference-counting-of-thread-safe-functions}

Des threads peuvent être ajoutés à un objet `napi_threadsafe_function` et en être supprimés pendant son existence. Ainsi, en plus de spécifier un nombre initial de threads lors de la création, `napi_acquire_threadsafe_function` peut être appelé pour indiquer qu'un nouveau thread commencera à utiliser la fonction thread-safe. De même, `napi_release_threadsafe_function` peut être appelé pour indiquer qu'un thread existant cessera d'utiliser la fonction thread-safe.

Les objets `napi_threadsafe_function` sont détruits lorsque chaque thread qui utilise l'objet a appelé `napi_release_threadsafe_function()` ou a reçu un statut de retour `napi_closing` en réponse à un appel à `napi_call_threadsafe_function`. La file d'attente est vidée avant que la `napi_threadsafe_function` ne soit détruite. `napi_release_threadsafe_function()` doit être le dernier appel d'API effectué conjointement avec une `napi_threadsafe_function` donnée, car une fois l'appel terminé, il n'y a aucune garantie que la `napi_threadsafe_function` soit toujours allouée. Pour la même raison, n'utilisez pas une fonction thread-safe après avoir reçu une valeur de retour `napi_closing` en réponse à un appel à `napi_call_threadsafe_function`. Les données associées à la `napi_threadsafe_function` peuvent être libérées dans son callback `napi_finalize` qui a été passé à `napi_create_threadsafe_function()`. Le paramètre `initial_thread_count` de `napi_create_threadsafe_function` marque le nombre initial d'acquisitions des fonctions thread-safe, au lieu d'appeler `napi_acquire_threadsafe_function` plusieurs fois lors de la création.

Une fois que le nombre de threads utilisant une `napi_threadsafe_function` atteint zéro, aucun autre thread ne peut commencer à l'utiliser en appelant `napi_acquire_threadsafe_function()`. En fait, tous les appels d'API ultérieurs qui lui sont associés, à l'exception de `napi_release_threadsafe_function()`, renverront une valeur d'erreur `napi_closing`.

La fonction thread-safe peut être "abandonnée" en donnant une valeur de `napi_tsfn_abort` à `napi_release_threadsafe_function()`. Cela entraînera le renvoi de `napi_closing` par toutes les API ultérieures associées à la fonction thread-safe, à l'exception de `napi_release_threadsafe_function()`, avant même que son nombre de références n'atteigne zéro. En particulier, `napi_call_threadsafe_function()` renverra `napi_closing`, informant ainsi les threads qu'il n'est plus possible de faire des appels asynchrones à la fonction thread-safe. Cela peut être utilisé comme critère pour terminer le thread. **Lors de la réception d'une valeur de retour
de <code>napi_closing</code> de <code>napi_call_threadsafe_function()</code>, un thread ne doit plus utiliser
la fonction thread-safe car il n'est plus garanti qu'elle soit
allouée.**


### Décider s'il faut maintenir le processus en cours d'exécution {#deciding-whether-to-keep-the-process-running}

De même que pour les handles libuv, les fonctions thread-safe peuvent être "référencées" et "non référencées". Une fonction thread-safe "référencée" maintiendra la boucle d'événements sur le thread sur lequel elle est créée, jusqu'à ce que la fonction thread-safe soit détruite. En revanche, une fonction thread-safe "non référencée" n'empêchera pas la boucle d'événements de se terminer. Les API `napi_ref_threadsafe_function` et `napi_unref_threadsafe_function` existent à cet effet.

Ni `napi_unref_threadsafe_function` ne marque les fonctions thread-safe comme pouvant être détruites, ni `napi_ref_threadsafe_function` ne l'empêche d'être détruite.

### `napi_create_threadsafe_function` {#napi_create_threadsafe_function}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v12.6.0, v10.17.0 | Paramètre `func` rendu optionnel avec `call_js_cb` personnalisé. |
| v10.6.0 | Ajouté dans : v10.6.0 |
:::

**Version N-API : 4**

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
- `[in] env` : L’environnement sous lequel l’API est appelée.
- `[in] func` : Une fonction JavaScript facultative à appeler depuis un autre thread. Elle doit être fournie si `NULL` est passé à `call_js_cb`.
- `[in] async_resource` : Un objet facultatif associé au travail asynchrone qui sera passé aux éventuels hooks [`init` de `async_hooks`](/fr/nodejs/api/async_hooks#initasyncid-type-triggerasyncid-resource).
- `[in] async_resource_name` : Une chaîne JavaScript pour fournir un identificateur pour le type de ressource fournie pour les informations de diagnostic exposées par l’API `async_hooks`.
- `[in] max_queue_size` : Taille maximale de la file d’attente. `0` pour aucune limite.
- `[in] initial_thread_count` : Le nombre initial d’acquisitions, c’est-à-dire le nombre initial de threads, y compris le thread principal, qui utiliseront cette fonction.
- `[in] thread_finalize_data` : Données facultatives à transmettre à `thread_finalize_cb`.
- `[in] thread_finalize_cb` : Fonction facultative à appeler lorsque la `napi_threadsafe_function` est en cours de destruction.
- `[in] context` : Données facultatives à joindre à la `napi_threadsafe_function` résultante.
- `[in] call_js_cb` : Callback facultatif qui appelle la fonction JavaScript en réponse à un appel sur un thread différent. Ce callback sera appelé sur le thread principal. S’il n’est pas fourni, la fonction JavaScript sera appelée sans paramètre et avec `undefined` comme valeur `this`. [`napi_threadsafe_function_call_js`](/fr/nodejs/api/n-api#napi_threadsafe_function_call_js) fournit plus de détails.
- `[out] result` : La fonction JavaScript asynchrone thread-safe.

**Historique des modifications :**

-  Expérimental (`NAPI_EXPERIMENTAL` est défini) : les exceptions non interceptées levées dans `call_js_cb` sont gérées avec l'événement [`'uncaughtException'`](/fr/nodejs/api/process#event-uncaughtexception), au lieu d'être ignorées.


### `napi_get_threadsafe_function_context` {#napi_get_threadsafe_function_context}

**Ajouté dans : v10.6.0**

**Version N-API : 4**

```C [C]
NAPI_EXTERN napi_status
napi_get_threadsafe_function_context(napi_threadsafe_function func,
                                     void** result);
```
- `[in] func` : La fonction thread-safe pour laquelle récupérer le contexte.
- `[out] result` : L’emplacement où stocker le contexte.

Cette API peut être appelée depuis n’importe quel thread qui utilise `func`.

### `napi_call_threadsafe_function` {#napi_call_threadsafe_function}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v14.5.0 | Le support de `napi_would_deadlock` a été rétabli. |
| v14.1.0 | Retourne `napi_would_deadlock` si appelé avec `napi_tsfn_blocking` depuis le thread principal ou un thread de travail et que la queue est pleine. |
| v10.6.0 | Ajouté dans : v10.6.0 |
:::

**Version N-API : 4**

```C [C]
NAPI_EXTERN napi_status
napi_call_threadsafe_function(napi_threadsafe_function func,
                              void* data,
                              napi_threadsafe_function_call_mode is_blocking);
```
- `[in] func` : La fonction JavaScript asynchrone thread-safe à invoquer.
- `[in] data` : Les données à envoyer en JavaScript via le rappel `call_js_cb` fourni lors de la création de la fonction JavaScript thread-safe.
- `[in] is_blocking` : Indicateur dont la valeur peut être soit `napi_tsfn_blocking` pour indiquer que l’appel doit bloquer si la queue est pleine, soit `napi_tsfn_nonblocking` pour indiquer que l’appel doit retourner immédiatement avec un statut de `napi_queue_full` lorsque la queue est pleine.

Cette API ne doit pas être appelée avec `napi_tsfn_blocking` depuis un thread JavaScript, car, si la queue est pleine, cela peut provoquer un blocage (deadlock) du thread JavaScript.

Cette API retournera `napi_closing` si `napi_release_threadsafe_function()` a été appelée avec `abort` défini sur `napi_tsfn_abort` depuis n’importe quel thread. La valeur est seulement ajoutée à la queue si l’API retourne `napi_ok`.

Cette API peut être appelée depuis n’importe quel thread qui utilise `func`.

### `napi_acquire_threadsafe_function` {#napi_acquire_threadsafe_function}

**Ajouté dans : v10.6.0**

**Version N-API : 4**

```C [C]
NAPI_EXTERN napi_status
napi_acquire_threadsafe_function(napi_threadsafe_function func);
```
- `[in] func` : La fonction JavaScript asynchrone thread-safe à commencer à utiliser.

Un thread doit appeler cette API avant de passer `func` à toute autre API de fonction thread-safe pour indiquer qu’il va utiliser `func`. Cela empêche `func` d’être détruite lorsque tous les autres threads ont cessé de l’utiliser.

Cette API peut être appelée depuis n’importe quel thread qui va commencer à utiliser `func`.


### `napi_release_threadsafe_function` {#napi_release_threadsafe_function}

**Ajouté dans: v10.6.0**

**Version N-API: 4**

```C [C]
NAPI_EXTERN napi_status
napi_release_threadsafe_function(napi_threadsafe_function func,
                                 napi_threadsafe_function_release_mode mode);
```
- `[in] func`: La fonction JavaScript asynchrone thread-safe dont le nombre de références doit être décrémenté.
- `[in] mode`: Indicateur dont la valeur peut être soit `napi_tsfn_release` pour indiquer que le thread courant n'effectuera plus d'appels à la fonction thread-safe, soit `napi_tsfn_abort` pour indiquer qu'en plus du thread courant, aucun autre thread ne doit effectuer d'autres appels à la fonction thread-safe. Si la valeur est définie sur `napi_tsfn_abort`, les appels ultérieurs à `napi_call_threadsafe_function()` renverront `napi_closing`, et aucune autre valeur ne sera placée dans la file d'attente.

Un thread doit appeler cette API lorsqu'il cesse d'utiliser `func`. Le passage de `func` à toute API thread-safe après avoir appelé cette API a des résultats non définis, car `func` peut avoir été détruit.

Cette API peut être appelée depuis n'importe quel thread qui cessera d'utiliser `func`.

### `napi_ref_threadsafe_function` {#napi_ref_threadsafe_function}

**Ajouté dans: v10.6.0**

**Version N-API: 4**

```C [C]
NAPI_EXTERN napi_status
napi_ref_threadsafe_function(node_api_basic_env env, napi_threadsafe_function func);
```
- `[in] env`: L'environnement dans lequel l'API est invoquée.
- `[in] func`: La fonction thread-safe à référencer.

Cette API est utilisée pour indiquer que la boucle d'événements s'exécutant sur le thread principal ne doit pas se terminer tant que `func` n'a pas été détruite. Semblable à [`uv_ref`](https://docs.libuv.org/en/v1.x/handle#c.uv_ref), elle est également idempotente.

Ni `napi_unref_threadsafe_function` ne marque les fonctions thread-safe comme pouvant être détruites, ni `napi_ref_threadsafe_function` ne l'empêche d'être détruite. `napi_acquire_threadsafe_function` et `napi_release_threadsafe_function` sont disponibles à cet effet.

Cette API ne peut être appelée que depuis le thread principal.

### `napi_unref_threadsafe_function` {#napi_unref_threadsafe_function}

**Ajouté dans: v10.6.0**

**Version N-API: 4**

```C [C]
NAPI_EXTERN napi_status
napi_unref_threadsafe_function(node_api_basic_env env, napi_threadsafe_function func);
```
- `[in] env`: L'environnement dans lequel l'API est invoquée.
- `[in] func`: La fonction thread-safe à déréférencer.

Cette API est utilisée pour indiquer que la boucle d'événements s'exécutant sur le thread principal peut se terminer avant que `func` ne soit détruite. Semblable à [`uv_unref`](https://docs.libuv.org/en/v1.x/handle#c.uv_unref), elle est également idempotente.

Cette API ne peut être appelée que depuis le thread principal.


## Utilitaires divers {#miscellaneous-utilities}

### `node_api_get_module_file_name` {#node_api_get_module_file_name}

**Ajouté dans : v15.9.0, v14.18.0, v12.22.0**

**Version N-API : 9**

```C [C]
NAPI_EXTERN napi_status
node_api_get_module_file_name(node_api_basic_env env, const char** result);

```
- `[in] env` : L'environnement dans lequel l'API est invoquée.
- `[out] result` : Une URL contenant le chemin absolu de l'emplacement à partir duquel le module complémentaire a été chargé. Pour un fichier sur le système de fichiers local, il commencera par `file://`. La chaîne est terminée par null et appartient à `env` et ne doit donc pas être modifiée ni libérée.

`result` peut être une chaîne vide si le processus de chargement du module complémentaire ne parvient pas à établir le nom de fichier du module complémentaire pendant le chargement.

