---
title: Documentation WASI de Node.js
description: Découvrez la documentation de Node.js pour l'interface système WebAssembly (WASI), expliquant comment utiliser WASI dans les environnements Node.js, y compris les API pour les opérations de système de fichiers, les variables d'environnement, et plus.
head:
  - - meta
    - name: og:title
      content: Documentation WASI de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Découvrez la documentation de Node.js pour l'interface système WebAssembly (WASI), expliquant comment utiliser WASI dans les environnements Node.js, y compris les API pour les opérations de système de fichiers, les variables d'environnement, et plus.
  - - meta
    - name: twitter:title
      content: Documentation WASI de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Découvrez la documentation de Node.js pour l'interface système WebAssembly (WASI), expliquant comment utiliser WASI dans les environnements Node.js, y compris les API pour les opérations de système de fichiers, les variables d'environnement, et plus.
---


# Interface Système WebAssembly (WASI) {#webassembly-system-interface-wasi}

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stability: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

**Le module <code>node:wasi</code> ne fournit pas actuellement les
propriétés de sécurité complètes du système de fichiers fournies par certains environnements d'exécution WASI.
La prise en charge complète du sandboxing sécurisé du système de fichiers peut être implémentée ou non dans le
futur. En attendant, ne comptez pas dessus pour exécuter du code non fiable.**

**Code Source:** [lib/wasi.js](https://github.com/nodejs/node/blob/v23.5.0/lib/wasi.js)

L'API WASI fournit une implémentation de la spécification [Interface Système WebAssembly](https://wasi.dev/). WASI donne aux applications WebAssembly l'accès au système d'exploitation sous-jacent via une collection de fonctions de type POSIX.

::: code-group
```js [ESM]
import { readFile } from 'node:fs/promises';
import { WASI } from 'node:wasi';
import { argv, env } from 'node:process';

const wasi = new WASI({
  version: 'preview1',
  args: argv,
  env,
  preopens: {
    '/local': '/some/real/path/that/wasm/can/access',
  },
});

const wasm = await WebAssembly.compile(
  await readFile(new URL('./demo.wasm', import.meta.url)),
);
const instance = await WebAssembly.instantiate(wasm, wasi.getImportObject());

wasi.start(instance);
```

```js [CJS]
'use strict';
const { readFile } = require('node:fs/promises');
const { WASI } = require('node:wasi');
const { argv, env } = require('node:process');
const { join } = require('node:path');

const wasi = new WASI({
  version: 'preview1',
  args: argv,
  env,
  preopens: {
    '/local': '/some/real/path/that/wasm/can/access',
  },
});

(async () => {
  const wasm = await WebAssembly.compile(
    await readFile(join(__dirname, 'demo.wasm')),
  );
  const instance = await WebAssembly.instantiate(wasm, wasi.getImportObject());

  wasi.start(instance);
})();
```
:::

Pour exécuter l'exemple ci-dessus, créez un nouveau fichier de format texte WebAssembly nommé `demo.wat` :

```text [TEXT]
(module
    ;; Importe la fonction WASI fd_write requise qui écrira les vecteurs io donnés sur stdout
    ;; La signature de la fonction pour fd_write est :
    ;; (Descripteur de fichier, *iovs, iovs_len, nwritten) -> Renvoie le nombre d'octets écrits
    (import "wasi_snapshot_preview1" "fd_write" (func $fd_write (param i32 i32 i32 i32) (result i32)))

    (memory 1)
    (export "memory" (memory 0))

    ;; Écrivez « hello world\n » dans la mémoire à un décalage de 8 octets
    ;; Notez le saut de ligne de fin qui est requis pour que le texte apparaisse
    (data (i32.const 8) "hello world\n")

    (func $main (export "_start")
        ;; Création d’un nouveau vecteur io dans la mémoire linéaire
        (i32.store (i32.const 0) (i32.const 8))  ;; iov.iov_base - Il s'agit d'un pointeur vers le début de la chaîne « hello world\n »
        (i32.store (i32.const 4) (i32.const 12))  ;; iov.iov_len - La longueur de la chaîne « hello world\n »

        (call $fd_write
            (i32.const 1) ;; file_descriptor - 1 pour stdout
            (i32.const 0) ;; *iovs - Le pointeur vers le tableau iov, qui est stocké à l'emplacement mémoire 0
            (i32.const 1) ;; iovs_len - Nous imprimons 1 chaîne stockée dans un iov - donc un.
            (i32.const 20) ;; nwritten - Un endroit en mémoire pour stocker le nombre d'octets écrits
        )
        drop ;; Ignore le nombre d'octets écrits du haut de la pile
    )
)
```
Utilisez [wabt](https://github.com/WebAssembly/wabt) pour compiler `.wat` en `.wasm`

```bash [BASH]
wat2wasm demo.wat
```

## Sécurité {#security}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v21.2.0, v20.11.0 | Clarification des propriétés de sécurité de WASI. |
| v21.2.0, v20.11.0 | Ajouté dans : v21.2.0, v20.11.0 |
:::

WASI fournit un modèle basé sur les capacités grâce auquel les applications reçoivent leurs propres capacités personnalisées `env`, `preopens`, `stdin`, `stdout`, `stderr` et `exit`.

**Le modèle de menace actuel de Node.js ne fournit pas de sandboxing sécurisé comme c'est le cas dans certains environnements d'exécution WASI.**

Bien que les fonctionnalités de capacité soient prises en charge, elles ne constituent pas un modèle de sécurité dans Node.js. Par exemple, le sandboxing du système de fichiers peut être contourné à l'aide de diverses techniques. Le projet étudie la possibilité d'ajouter ces garanties de sécurité à l'avenir.

## Classe : `WASI` {#class-wasi}

**Ajouté dans : v13.3.0, v12.16.0**

La classe `WASI` fournit l'API d'appel système WASI et des méthodes de commodité supplémentaires pour travailler avec des applications basées sur WASI. Chaque instance `WASI` représente un environnement distinct.

### `new WASI([options])` {#new-wasioptions}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v20.1.0 | La valeur par défaut de returnOnExit est passée à true. |
| v20.0.0 | L'option version est désormais obligatoire et n'a pas de valeur par défaut. |
| v19.8.0 | Champ version ajouté aux options. |
| v13.3.0, v12.16.0 | Ajouté dans : v13.3.0, v12.16.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `args` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Un tableau de chaînes que l'application WebAssembly verra comme arguments de ligne de commande. Le premier argument est le chemin d'accès virtuel à la commande WASI elle-même. **Par défaut :** `[]`.
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un objet similaire à `process.env` que l'application WebAssembly verra comme son environnement. **Par défaut :** `{}`.
    - `preopens` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Cet objet représente la structure de répertoire locale de l'application WebAssembly. Les clés de chaîne de `preopens` sont traitées comme des répertoires dans le système de fichiers. Les valeurs correspondantes dans `preopens` sont les chemins réels vers ces répertoires sur la machine hôte.
    - `returnOnExit` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Par défaut, lorsque les applications WASI appellent `__wasi_proc_exit()`, `wasi.start()` renverra le code de sortie spécifié au lieu de mettre fin au processus. Définir cette option sur `false` entraînera la fermeture du processus Node.js avec le code de sortie spécifié à la place. **Par défaut :** `true`.
    - `stdin` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le descripteur de fichier utilisé comme entrée standard dans l'application WebAssembly. **Par défaut :** `0`.
    - `stdout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le descripteur de fichier utilisé comme sortie standard dans l'application WebAssembly. **Par défaut :** `1`.
    - `stderr` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le descripteur de fichier utilisé comme erreur standard dans l'application WebAssembly. **Par défaut :** `2`.
    - `version` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La version de WASI demandée. Actuellement, les seules versions prises en charge sont `unstable` et `preview1`. Cette option est obligatoire.


### `wasi.getImportObject()` {#wasigetimportobject}

**Ajouté dans: v19.8.0**

Renvoie un objet importable qui peut être passé à `WebAssembly.instantiate()` si aucun autre import WASM n'est nécessaire au-delà de ceux fournis par WASI.

Si la version `unstable` a été passée au constructeur, elle renverra:

```json [JSON]
{ wasi_unstable: wasi.wasiImport }
```
Si la version `preview1` a été passée au constructeur ou si aucune version n'a été spécifiée, elle renverra:

```json [JSON]
{ wasi_snapshot_preview1: wasi.wasiImport }
```
### `wasi.start(instance)` {#wasistartinstance}

**Ajouté dans: v13.3.0, v12.16.0**

- `instance` [\<WebAssembly.Instance\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Instance)

Tente de commencer l'exécution de `instance` en tant que commande WASI en invoquant son exportation `_start()`. Si `instance` ne contient pas d'exportation `_start()`, ou si `instance` contient une exportation `_initialize()`, une exception est levée.

`start()` exige que `instance` exporte un [`WebAssembly.Memory`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Memory) nommé `memory`. Si `instance` n'a pas d'exportation `memory`, une exception est levée.

Si `start()` est appelé plus d'une fois, une exception est levée.

### `wasi.initialize(instance)` {#wasiinitializeinstance}

**Ajouté dans: v14.6.0, v12.19.0**

- `instance` [\<WebAssembly.Instance\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Instance)

Tente d'initialiser `instance` en tant que réacteur WASI en invoquant son exportation `_initialize()`, si elle est présente. Si `instance` contient une exportation `_start()`, une exception est levée.

`initialize()` exige que `instance` exporte un [`WebAssembly.Memory`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Memory) nommé `memory`. Si `instance` n'a pas d'exportation `memory`, une exception est levée.

Si `initialize()` est appelé plus d'une fois, une exception est levée.

### `wasi.wasiImport` {#wasiwasiimport}

**Ajouté dans: v13.3.0, v12.16.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`wasiImport` est un objet qui implémente l'API d'appel système WASI. Cet objet doit être passé en tant qu'importation `wasi_snapshot_preview1` lors de l'instanciation d'un [`WebAssembly.Instance`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Instance).

