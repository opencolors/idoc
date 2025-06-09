---
title: API des Permissions de Node.js
description: La documentation de l'API des Permissions de Node.js explique comment gérer et contrôler les permissions pour diverses opérations au sein des applications Node.js, garantissant un accès sécurisé et contrôlé aux ressources du système.
head:
  - - meta
    - name: og:title
      content: API des Permissions de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: La documentation de l'API des Permissions de Node.js explique comment gérer et contrôler les permissions pour diverses opérations au sein des applications Node.js, garantissant un accès sécurisé et contrôlé aux ressources du système.
  - - meta
    - name: twitter:title
      content: API des Permissions de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: La documentation de l'API des Permissions de Node.js explique comment gérer et contrôler les permissions pour diverses opérations au sein des applications Node.js, garantissant un accès sécurisé et contrôlé aux ressources du système.
---


# Permissions {#permissions}

Les permissions peuvent être utilisées pour contrôler à quelles ressources système le processus Node.js a accès ou quelles actions le processus peut entreprendre avec ces ressources.

- [Permissions basées sur le processus](/fr/nodejs/api/permissions#process-based-permissions) contrôlent l'accès du processus Node.js aux ressources. La ressource peut être entièrement autorisée ou refusée, ou les actions qui y sont liées peuvent être contrôlées. Par exemple, les lectures du système de fichiers peuvent être autorisées tout en interdisant les écritures. Cette fonctionnalité ne protège pas contre le code malveillant. Selon la [Politique de sécurité](https://github.com/nodejs/node/blob/main/SECURITY.md) de Node.js, Node.js fait confiance à tout code qu'il est invité à exécuter.

Le modèle de permission met en œuvre une approche de type "ceinture de sécurité", qui empêche le code de confiance de modifier involontairement des fichiers ou d'utiliser des ressources dont l'accès n'a pas été explicitement accordé. Il ne fournit pas de garanties de sécurité en présence de code malveillant. Le code malveillant peut contourner le modèle de permission et exécuter du code arbitraire sans les restrictions imposées par le modèle de permission.

Si vous trouvez une vulnérabilité de sécurité potentielle, veuillez consulter notre [Politique de sécurité](https://github.com/nodejs/node/blob/main/SECURITY.md).

## Permissions basées sur le processus {#process-based-permissions}

### Modèle de permissions {#permission-model}

::: tip [Stable: 2 - Stable]
[Stable: 2](/fr/nodejs/api/documentation#stability-index) [Stability: 2](/fr/nodejs/api/documentation#stability-index) - Stable.
:::

Le modèle de permissions de Node.js est un mécanisme permettant de restreindre l'accès à des ressources spécifiques pendant l'exécution. L'API existe derrière un drapeau [`--permission`](/fr/nodejs/api/cli#--permission) qui, lorsqu'il est activé, restreint l'accès à toutes les permissions disponibles.

Les permissions disponibles sont documentées par le drapeau [`--permission`](/fr/nodejs/api/cli#--permission).

Lorsque Node.js démarre avec `--permission`, la possibilité d'accéder au système de fichiers via le module `fs`, de lancer des processus, d'utiliser `node:worker_threads`, d'utiliser des addons natifs, d'utiliser WASI et d'activer l'inspecteur d'exécution sera restreinte.

```bash [BASH]
$ node --permission index.js

Error: Access to this API has been restricted
    at node:internal/main/run_main_module:23:47 {
  code: 'ERR_ACCESS_DENIED',
  permission: 'FileSystemRead',
  resource: '/home/user/index.js'
}
```
L'autorisation d'exécuter un processus et de créer des threads de travail peut être accordée en utilisant respectivement les drapeaux [`--allow-child-process`](/fr/nodejs/api/cli#--allow-child-process) et [`--allow-worker`](/fr/nodejs/api/cli#--allow-worker).

Pour autoriser les addons natifs lors de l'utilisation du modèle de permissions, utilisez le drapeau [`--allow-addons`](/fr/nodejs/api/cli#--allow-addons). Pour WASI, utilisez le drapeau [`--allow-wasi`](/fr/nodejs/api/cli#--allow-wasi).


#### API d'exécution {#runtime-api}

Lors de l'activation du modèle de permission via l'indicateur [`--permission`](/fr/nodejs/api/cli#--permission), une nouvelle propriété `permission` est ajoutée à l'objet `process`. Cette propriété contient une fonction :

##### `permission.has(scope[, reference])` {#permissionhasscope-reference}

Appel d'API pour vérifier les permissions lors de l'exécution ([`permission.has()`](/fr/nodejs/api/process#processpermissionhasscope-reference))

```js [ESM]
process.permission.has('fs.write'); // true
process.permission.has('fs.write', '/home/rafaelgss/protected-folder'); // true

process.permission.has('fs.read'); // true
process.permission.has('fs.read', '/home/rafaelgss/protected-folder'); // false
```
#### Permissions du système de fichiers {#file-system-permissions}

Par défaut, le modèle de permission restreint l'accès au système de fichiers via le module `node:fs`. Il ne garantit pas que les utilisateurs ne pourront pas accéder au système de fichiers par d'autres moyens, par exemple via le module `node:sqlite`.

Pour autoriser l'accès au système de fichiers, utilisez les indicateurs [`--allow-fs-read`](/fr/nodejs/api/cli#--allow-fs-read) et [`--allow-fs-write`](/fr/nodejs/api/cli#--allow-fs-write) :

```bash [BASH]
$ node --permission --allow-fs-read=* --allow-fs-write=* index.js
Hello world!
```
Les arguments valides pour les deux indicateurs sont :

- `*` - Pour autoriser toutes les opérations `FileSystemRead` ou `FileSystemWrite`, respectivement.
- Chemins délimités par une virgule (`,`) pour autoriser uniquement les opérations `FileSystemRead` ou `FileSystemWrite` correspondantes, respectivement.

Exemple :

- `--allow-fs-read=*` - Autorise toutes les opérations `FileSystemRead`.
- `--allow-fs-write=*` - Autorise toutes les opérations `FileSystemWrite`.
- `--allow-fs-write=/tmp/` - Autorise l'accès `FileSystemWrite` au dossier `/tmp/`.
- `--allow-fs-read=/tmp/ --allow-fs-read=/home/.gitignore` - Autorise l'accès `FileSystemRead` au dossier `/tmp/` **et** au chemin `/home/.gitignore`.

Les caractères génériques sont également pris en charge :

- `--allow-fs-read=/home/test*` autorisera l'accès en lecture à tout ce qui correspond au caractère générique. Par exemple : `/home/test/file1` ou `/home/test2`

Après avoir passé un caractère générique (`*`), tous les caractères suivants seront ignorés. Par exemple : `/home/*.js` fonctionnera de la même manière que `/home/*`.

Lorsque le modèle de permission est initialisé, il ajoute automatiquement un caractère générique (*) si le répertoire spécifié existe. Par exemple, si `/home/test/files` existe, il sera traité comme `/home/test/files/*`. Cependant, si le répertoire n'existe pas, le caractère générique ne sera pas ajouté et l'accès sera limité à `/home/test/files`. Si vous souhaitez autoriser l'accès à un dossier qui n'existe pas encore, assurez-vous d'inclure explicitement le caractère générique : `/my-path/folder-do-not-exist/*`.


#### Contraintes du modèle d'autorisations {#permission-model-constraints}

Il y a des contraintes que vous devez connaître avant d'utiliser ce système :

- Le modèle n'est pas hérité par un processus de nœud enfant ou un thread worker.
- Lors de l'utilisation du modèle d'autorisations, les fonctionnalités suivantes seront limitées :
    - Modules natifs
    - Processus enfant
    - Threads Workers
    - Protocole d'inspecteur
    - Accès au système de fichiers
    - WASI
  
 
- Le modèle d'autorisations est initialisé après la configuration de l'environnement Node.js. Cependant, certains flags tels que `--env-file` ou `--openssl-config` sont conçus pour lire des fichiers avant l'initialisation de l'environnement. Par conséquent, ces flags ne sont pas soumis aux règles du modèle d'autorisations. Il en va de même pour les flags V8 qui peuvent être définis via l'exécution via `v8.setFlagsFromString`.
- Les moteurs OpenSSL ne peuvent pas être demandés au moment de l'exécution lorsque le modèle d'autorisations est activé, ce qui affecte les modules crypto, https et tls intégrés.
- Les extensions chargeables au moment de l'exécution ne peuvent pas être chargées lorsque le modèle d'autorisations est activé, ce qui affecte le module sqlite.
- L'utilisation de descripteurs de fichiers existants via le module `node:fs` contourne le modèle d'autorisations.

#### Limitations et problèmes connus {#limitations-and-known-issues}

- Les liens symboliques seront suivis même vers des emplacements en dehors de l'ensemble des chemins auxquels l'accès a été accordé. Les liens symboliques relatifs peuvent permettre l'accès à des fichiers et répertoires arbitraires. Lors du démarrage d'applications avec le modèle d'autorisations activé, vous devez vous assurer qu'aucun chemin auquel l'accès a été accordé ne contient de liens symboliques relatifs.

