---
title: Documentation de l'API SQLite pour Node.js
description: La documentation de l'API SQLite pour Node.js fournit des détails complets sur la manière d'interagir avec les bases de données SQLite dans les applications Node.js. Elle couvre la gestion des connexions à la base de données, l'exécution de requêtes SQL, la gestion des transactions et la gestion des erreurs.
head:
  - - meta
    - name: og:title
      content: Documentation de l'API SQLite pour Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: La documentation de l'API SQLite pour Node.js fournit des détails complets sur la manière d'interagir avec les bases de données SQLite dans les applications Node.js. Elle couvre la gestion des connexions à la base de données, l'exécution de requêtes SQL, la gestion des transactions et la gestion des erreurs.
  - - meta
    - name: twitter:title
      content: Documentation de l'API SQLite pour Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: La documentation de l'API SQLite pour Node.js fournit des détails complets sur la manière d'interagir avec les bases de données SQLite dans les applications Node.js. Elle couvre la gestion des connexions à la base de données, l'exécution de requêtes SQL, la gestion des transactions et la gestion des erreurs.
---


# SQLite {#sqlite}

**Ajouté dans : v22.5.0**

::: warning [Stable : 1 - Expérimental]
[Stable : 1](/fr/nodejs/api/documentation#stability-index) [Stabilité : 1](/fr/nodejs/api/documentation#stability-index).1 - Développement actif.
:::

**Code source :** [lib/sqlite.js](https://github.com/nodejs/node/blob/v23.5.0/lib/sqlite.js)

Le module `node:sqlite` facilite l’utilisation des bases de données SQLite. Pour y accéder :

::: code-group
```js [ESM]
import sqlite from 'node:sqlite';
```

```js [CJS]
const sqlite = require('node:sqlite');
```
:::

Ce module est uniquement disponible sous le schéma `node:`.

L’exemple suivant montre l’utilisation de base du module `node:sqlite` pour ouvrir une base de données en mémoire, écrire des données dans la base de données, puis relire les données.

::: code-group
```js [ESM]
import { DatabaseSync } from 'node:sqlite';
const database = new DatabaseSync(':memory:');

// Execute SQL statements from strings.
database.exec(`
  CREATE TABLE data(
    key INTEGER PRIMARY KEY,
    value TEXT
  ) STRICT
`);
// Create a prepared statement to insert data into the database.
const insert = database.prepare('INSERT INTO data (key, value) VALUES (?, ?)');
// Execute the prepared statement with bound values.
insert.run(1, 'hello');
insert.run(2, 'world');
// Create a prepared statement to read data from the database.
const query = database.prepare('SELECT * FROM data ORDER BY key');
// Execute the prepared statement and log the result set.
console.log(query.all());
// Prints: [ { key: 1, value: 'hello' }, { key: 2, value: 'world' } ]
```

```js [CJS]
'use strict';
const { DatabaseSync } = require('node:sqlite');
const database = new DatabaseSync(':memory:');

// Execute SQL statements from strings.
database.exec(`
  CREATE TABLE data(
    key INTEGER PRIMARY KEY,
    value TEXT
  ) STRICT
`);
// Create a prepared statement to insert data into the database.
const insert = database.prepare('INSERT INTO data (key, value) VALUES (?, ?)');
// Execute the prepared statement with bound values.
insert.run(1, 'hello');
insert.run(2, 'world');
// Create a prepared statement to read data from the database.
const query = database.prepare('SELECT * FROM data ORDER BY key');
// Execute the prepared statement and log the result set.
console.log(query.all());
// Prints: [ { key: 1, value: 'hello' }, { key: 2, value: 'world' } ]
```
:::


## Classe : `DatabaseSync` {#class-databasesync}

**Ajoutée dans : v22.5.0**

Cette classe représente une seule [connexion](https://www.sqlite.org/c3ref/sqlite3) à une base de données SQLite. Toutes les API exposées par cette classe s’exécutent de manière synchrone.

### `new DatabaseSync(emplacement[, options])` {#new-databasesynclocation-options}

**Ajoutée dans : v22.5.0**

- `emplacement` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Type_String) L’emplacement de la base de données. Une base de données SQLite peut être stockée dans un fichier ou complètement [en mémoire](https://www.sqlite.org/inmemorydb). Pour utiliser une base de données basée sur un fichier, l’emplacement doit être un chemin de fichier. Pour utiliser une base de données en mémoire, l’emplacement doit être le nom spécial `':memory:'`.
- `options` [\<Object\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object) Options de configuration pour la connexion à la base de données. Les options suivantes sont prises en charge :
    - `open` [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Type_Boolean) Si `true`, la base de données est ouverte par le constructeur. Lorsque cette valeur est `false`, la base de données doit être ouverte via la méthode `open()`. **Par défaut :** `true`.
    - `readOnly` [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Type_Boolean) Si `true`, la base de données est ouverte en mode lecture seule. Si la base de données n’existe pas, son ouverture échouera. **Par défaut :** `false`.
    - `enableForeignKeyConstraints` [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Type_Boolean) Si `true`, les contraintes de clé étrangère sont activées. Ceci est recommandé, mais peut être désactivé pour assurer la compatibilité avec les schémas de base de données hérités. L’application des contraintes de clé étrangère peut être activée et désactivée après l’ouverture de la base de données à l’aide de [`PRAGMA foreign_keys`](https://www.sqlite.org/pragma#pragma_foreign_keys). **Par défaut :** `true`.
    - `enableDoubleQuotedStringLiterals` [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Type_Boolean) Si `true`, SQLite acceptera les [littéraux de chaîne entre guillemets doubles](https://www.sqlite.org/quirks#dblquote). Ceci n’est pas recommandé, mais peut être activé pour assurer la compatibilité avec les schémas de base de données hérités. **Par défaut :** `false`.
    - `allowExtension` [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Type_Boolean) Si `true`, la fonction SQL `loadExtension` et la méthode `loadExtension()` sont activées. Vous pouvez appeler `enableLoadExtension(false)` ultérieurement pour désactiver cette fonctionnalité. **Par défaut :** `false`.

Construit une nouvelle instance `DatabaseSync`.


### `database.close()` {#databaseclose}

**Ajouté dans : v22.5.0**

Ferme la connexion à la base de données. Une exception est levée si la base de données n’est pas ouverte. Cette méthode est un wrapper autour de [`sqlite3_close_v2()`](https://www.sqlite.org/c3ref/close).

### `database.loadExtension(path)` {#databaseloadextensionpath}

**Ajouté dans : v23.5.0**

- `path` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String) Le chemin d’accès à la bibliothèque partagée à charger.

Charge une bibliothèque partagée dans la connexion à la base de données. Cette méthode est un wrapper autour de [`sqlite3_load_extension()`](https://www.sqlite.org/c3ref/load_extension). Il est nécessaire d’activer l’option `allowExtension` lors de la construction de l’instance `DatabaseSync`.

### `database.enableLoadExtension(allow)` {#databaseenableloadextensionallow}

**Ajouté dans : v23.5.0**

- `allow` [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Boolean) Indique s’il faut autoriser le chargement d’extensions.

Active ou désactive la fonction SQL `loadExtension` et la méthode `loadExtension()`. Lorsque `allowExtension` est `false` lors de la construction, vous ne pouvez pas activer le chargement d’extensions pour des raisons de sécurité.

### `database.exec(sql)` {#databaseexecsql}

**Ajouté dans : v22.5.0**

- `sql` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String) Une chaîne SQL à exécuter.

Cette méthode permet d’exécuter une ou plusieurs instructions SQL sans renvoyer de résultats. Cette méthode est utile lors de l’exécution d’instructions SQL lues à partir d’un fichier. Cette méthode est un wrapper autour de [`sqlite3_exec()`](https://www.sqlite.org/c3ref/exec).

### `database.function(name[, options], function)` {#databasefunctionname-options-function}

**Ajouté dans : v23.5.0**

- `name` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String) Le nom de la fonction SQLite à créer.
- `options` [\<Object\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Object) Paramètres de configuration facultatifs pour la fonction. Les propriétés suivantes sont prises en charge :
    - `deterministic` [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Boolean) Si `true`, l’indicateur [`SQLITE_DETERMINISTIC`](https://www.sqlite.org/c3ref/c_deterministic) est défini sur la fonction créée. **Par défaut :** `false`.
    - `directOnly` [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Boolean) Si `true`, l’indicateur [`SQLITE_DIRECTONLY`](https://www.sqlite.org/c3ref/c_deterministic) est défini sur la fonction créée. **Par défaut :** `false`.
    - `useBigIntArguments` [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Boolean) Si `true`, les arguments entiers de `function` sont convertis en `BigInt`. Si `false`, les arguments entiers sont transmis en tant que nombres JavaScript. **Par défaut :** `false`.
    - `varargs` [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Boolean) Si `true`, `function` peut accepter un nombre variable d’arguments. Si `false`, `function` doit être invoquée avec exactement `function.length` arguments. **Par défaut :** `false`.
  
 
- `function` [\<Function\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Function) La fonction JavaScript à appeler lorsque la fonction SQLite est invoquée.

Cette méthode est utilisée pour créer des fonctions SQLite définies par l’utilisateur. Cette méthode est un wrapper autour de [`sqlite3_create_function_v2()`](https://www.sqlite.org/c3ref/create_function).


### `database.open()` {#databaseopen}

**Ajouté dans : v22.5.0**

Ouvre la base de données spécifiée dans l’argument `location` du constructeur `DatabaseSync`. Cette méthode ne doit être utilisée que lorsque la base de données n’est pas ouverte via le constructeur. Une exception est levée si la base de données est déjà ouverte.

### `database.prepare(sql)` {#databasepreparesql}

**Ajouté dans : v22.5.0**

- `sql` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#String_type) Une chaîne SQL à compiler en une instruction préparée.
- Retourne : [\<StatementSync\>](/fr/nodejs/api/sqlite#class-statementsync) L’instruction préparée.

Compile une instruction SQL en une [instruction préparée](https://www.sqlite.org/c3ref/stmt). Cette méthode est un wrapper autour de [`sqlite3_prepare_v2()`](https://www.sqlite.org/c3ref/prepare).

### `database.createSession([options])` {#databasecreatesessionoptions}

**Ajouté dans : v23.3.0**

- `options` [\<Object\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object) Les options de configuration de la session.
    - `table` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#String_type) Une table spécifique pour suivre les modifications. Par défaut, les modifications apportées à toutes les tables sont suivies.
    - `db` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#String_type) Nom de la base de données à suivre. Ceci est utile lorsque plusieurs bases de données ont été ajoutées à l’aide de [`ATTACH DATABASE`](https://www.sqlite.org/lang_attach). **Par défaut** : `'main'`.
  
 
- Retourne : [\<Session\>](/fr/nodejs/api/sqlite#class-session) Un handle de session.

Crée et attache une session à la base de données. Cette méthode est un wrapper autour de [`sqlite3session_create()`](https://www.sqlite.org/session/sqlite3session_create) et [`sqlite3session_attach()`](https://www.sqlite.org/session/sqlite3session_attach).

### `database.applyChangeset(changeset[, options])` {#databaseapplychangesetchangeset-options}

**Ajouté dans : v23.3.0**

- `changeset` [\<Uint8Array\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Un ensemble de modifications binaires ou un ensemble de correctifs.
- `options` [\<Object\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object) Les options de configuration pour la façon dont les modifications seront appliquées.
    - `filter` [\<Function\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Function) Ignore les modifications qui, lorsque le nom de la table cible est fourni à cette fonction, retournent une valeur truthy. Par défaut, toutes les modifications sont tentées.
    - `onConflict` [\<number\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Number_type) Détermine comment les conflits sont gérés. **Par défaut** : `SQLITE_CHANGESET_ABORT`.
    - `SQLITE_CHANGESET_OMIT` : les modifications conflictuelles sont omises.
    - `SQLITE_CHANGESET_REPLACE` : les modifications conflictuelles remplacent les valeurs existantes.
    - `SQLITE_CHANGESET_ABORT` : abandon en cas de conflit et restauration de la base de données.
  
 
  
 
- Retourne : [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Boolean_type) Indique si l’ensemble de modifications a été appliqué avec succès sans être abandonné.

Une exception est levée si la base de données n’est pas ouverte. Cette méthode est un wrapper autour de [`sqlite3changeset_apply()`](https://www.sqlite.org/session/sqlite3changeset_apply).

```js [ESM]
const sourceDb = new DatabaseSync(':memory:');
const targetDb = new DatabaseSync(':memory:');

sourceDb.exec('CREATE TABLE data(key INTEGER PRIMARY KEY, value TEXT)');
targetDb.exec('CREATE TABLE data(key INTEGER PRIMARY KEY, value TEXT)');

const session = sourceDb.createSession();

const insert = sourceDb.prepare('INSERT INTO data (key, value) VALUES (?, ?)');
insert.run(1, 'hello');
insert.run(2, 'world');

const changeset = session.changeset();
targetDb.applyChangeset(changeset);
// Now that the changeset has been applied, targetDb contains the same data as sourceDb.
// Maintenant que l’ensemble de modifications a été appliqué, targetDb contient les mêmes données que sourceDb.
```

## Classe : `Session` {#class-session}

**Ajouté dans : v23.3.0**

### `session.changeset()` {#sessionchangeset}

**Ajouté dans : v23.3.0**

- Retourne : [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Changement binaire qui peut être appliqué à d’autres bases de données.

Récupère un ensemble de modifications contenant toutes les modifications depuis la création de l’ensemble de modifications. Peut être appelé plusieurs fois. Une exception est levée si la base de données ou la session n’est pas ouverte. Cette méthode est un wrapper autour de [`sqlite3session_changeset()`](https://www.sqlite.org/session/sqlite3session_changeset).

### `session.patchset()` {#sessionpatchset}

**Ajouté dans : v23.3.0**

- Retourne : [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Ensemble de correctifs binaire qui peut être appliqué à d’autres bases de données.

Similaire à la méthode ci-dessus, mais génère un ensemble de correctifs plus compact. Voir [Changesets and Patchsets](https://www.sqlite.org/sessionintro#changesets_and_patchsets) dans la documentation de SQLite. Une exception est levée si la base de données ou la session n’est pas ouverte. Cette méthode est un wrapper autour de [`sqlite3session_patchset()`](https://www.sqlite.org/session/sqlite3session_patchset).

### `session.close()`. {#sessionclose}

Ferme la session. Une exception est levée si la base de données ou la session n’est pas ouverte. Cette méthode est un wrapper autour de [`sqlite3session_delete()`](https://www.sqlite.org/session/sqlite3session_delete).

## Classe : `StatementSync` {#class-statementsync}

**Ajouté dans : v22.5.0**

Cette classe représente une seule [instruction préparée](https://www.sqlite.org/c3ref/stmt). Cette classe ne peut pas être instanciée via son constructeur. Au lieu de cela, les instances sont créées via la méthode `database.prepare()`. Toutes les API exposées par cette classe s’exécutent de manière synchrone.

Une instruction préparée est une représentation binaire efficace du SQL utilisé pour la créer. Les instructions préparées sont paramétrables et peuvent être invoquées plusieurs fois avec différentes valeurs liées. Les paramètres offrent également une protection contre les attaques par [injection SQL](https://en.wikipedia.org/wiki/SQL_injection). Pour ces raisons, les instructions préparées sont préférées aux chaînes SQL artisanales lors du traitement de la saisie utilisateur.


### `statement.all([namedParameters][, ...anonymousParameters])` {#statementallnamedparameters-anonymousparameters}

**Ajoutée dans : v22.5.0**

- `namedParameters` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un objet optionnel utilisé pour lier des paramètres nommés. Les clés de cet objet sont utilisées pour configurer le mappage.
- `...anonymousParameters` [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Zéro ou plusieurs valeurs à lier à des paramètres anonymes.
- Retourne : [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Un tableau d’objets. Chaque objet correspond à une ligne renvoyée par l’exécution de l’instruction préparée. Les clés et les valeurs de chaque objet correspondent aux noms de colonnes et aux valeurs de la ligne.

Cette méthode exécute une instruction préparée et renvoie tous les résultats sous forme de tableau d’objets. Si l’instruction préparée ne renvoie aucun résultat, cette méthode renvoie un tableau vide. Les [paramètres de l’instruction préparée sont liés](https://www.sqlite.org/c3ref/bind_blob) à l’aide des valeurs dans `namedParameters` et `anonymousParameters`.

### `statement.expandedSQL` {#statementexpandedsql}

**Ajoutée dans : v22.5.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le code SQL source étendu pour inclure les valeurs des paramètres.

Le texte SQL source de l’instruction préparée avec les espaces réservés des paramètres remplacés par les valeurs qui ont été utilisées lors de l’exécution la plus récente de cette instruction préparée. Cette propriété est un enveloppeur autour de [`sqlite3_expanded_sql()`](https://www.sqlite.org/c3ref/expanded_sql).


### `statement.get([namedParameters][, ...anonymousParameters])` {#statementgetnamedparameters-anonymousparameters}

**Ajouté dans : v22.5.0**

- `namedParameters` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un objet optionnel utilisé pour lier des paramètres nommés. Les clés de cet objet sont utilisées pour configurer le mappage.
- `...anonymousParameters` [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Zéro ou plusieurs valeurs à lier à des paramètres anonymes.
- Retourne : [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Un objet correspondant à la première ligne renvoyée par l’exécution de l’instruction préparée. Les clés et les valeurs de l’objet correspondent aux noms et aux valeurs des colonnes de la ligne. Si aucune ligne n’est renvoyée par la base de données, cette méthode renvoie `undefined`.

Cette méthode exécute une instruction préparée et renvoie le premier résultat sous forme d’objet. Si l’instruction préparée ne renvoie aucun résultat, cette méthode renvoie `undefined`. Les [paramètres de l’instruction préparée sont liés](https://www.sqlite.org/c3ref/bind_blob) à l’aide des valeurs dans `namedParameters` et `anonymousParameters`.

### `statement.iterate([namedParameters][, ...anonymousParameters])` {#statementiteratenamedparameters-anonymousparameters}

**Ajouté dans : v23.4.0**

- `namedParameters` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un objet optionnel utilisé pour lier des paramètres nommés. Les clés de cet objet sont utilisées pour configurer le mappage.
- `...anonymousParameters` [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Zéro ou plusieurs valeurs à lier à des paramètres anonymes.
- Retourne : [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol) Un itérateur itérable d’objets. Chaque objet correspond à une ligne renvoyée par l’exécution de l’instruction préparée. Les clés et les valeurs de chaque objet correspondent aux noms et aux valeurs des colonnes de la ligne.

Cette méthode exécute une instruction préparée et renvoie un itérateur d’objets. Si l’instruction préparée ne renvoie aucun résultat, cette méthode renvoie un itérateur vide. Les [paramètres de l’instruction préparée sont liés](https://www.sqlite.org/c3ref/bind_blob) à l’aide des valeurs dans `namedParameters` et `anonymousParameters`.


### `statement.run([namedParameters][, ...anonymousParameters])` {#statementrunnamedparameters-anonymousparameters}

**Ajouté dans : v22.5.0**

- `namedParameters` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un objet optionnel utilisé pour lier les paramètres nommés. Les clés de cet objet sont utilisées pour configurer le mappage.
- `...anonymousParameters` [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Zéro ou plusieurs valeurs à lier à des paramètres anonymes.
- Renvoie : [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `changes`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) Le nombre de lignes modifiées, insérées ou supprimées par l'instruction `INSERT`, `UPDATE` ou `DELETE` la plus récemment terminée. Ce champ est soit un nombre, soit un `BigInt` en fonction de la configuration de l'instruction préparée. Cette propriété est le résultat de [`sqlite3_changes64()`](https://www.sqlite.org/c3ref/changes).
    - `lastInsertRowid`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) Le rowid inséré le plus récemment. Ce champ est soit un nombre, soit un `BigInt` en fonction de la configuration de l'instruction préparée. Cette propriété est le résultat de [`sqlite3_last_insert_rowid()`](https://www.sqlite.org/c3ref/last_insert_rowid).

Cette méthode exécute une instruction préparée et renvoie un objet résumant les modifications résultantes. Les [paramètres de l'instruction préparée sont liés](https://www.sqlite.org/c3ref/bind_blob) en utilisant les valeurs de `namedParameters` et `anonymousParameters`.


### `statement.setAllowBareNamedParameters(enabled)` {#statementsetallowbarenamedparametersenabled}

**Ajouté dans : v22.5.0**

- `enabled` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Active ou désactive la prise en charge de la liaison de paramètres nommés sans le caractère de préfixe.

Les noms des paramètres SQLite commencent par un caractère de préfixe. Par défaut, `node:sqlite` exige que ce caractère de préfixe soit présent lors de la liaison des paramètres. Cependant, à l’exception du caractère dollar, ces caractères de préfixe nécessitent également des guillemets supplémentaires lorsqu’ils sont utilisés dans les clés d’objet.

Pour améliorer l’ergonomie, cette méthode peut être utilisée pour autoriser également les paramètres nommés nus, qui ne nécessitent pas le caractère de préfixe dans le code JavaScript. Il existe plusieurs mises en garde à connaître lors de l’activation des paramètres nommés nus :

- Le caractère de préfixe est toujours requis dans SQL.
- Le caractère de préfixe est toujours autorisé en JavaScript. En fait, les noms préfixés auront des performances de liaison légèrement meilleures.
- L’utilisation de paramètres nommés ambigus, tels que `$k` et `@k`, dans la même instruction préparée entraînera une exception car il ne sera pas possible de déterminer comment lier un nom nu.

### `statement.setReadBigInts(enabled)` {#statementsetreadbigintsenabled}

**Ajouté dans : v22.5.0**

- `enabled` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Active ou désactive l’utilisation de `BigInt`s lors de la lecture des champs `INTEGER` à partir de la base de données.

Lors de la lecture à partir de la base de données, les `INTEGER`s SQLite sont mappés aux nombres JavaScript par défaut. Cependant, les `INTEGER`s SQLite peuvent stocker des valeurs plus grandes que celles que les nombres JavaScript sont capables de représenter. Dans de tels cas, cette méthode peut être utilisée pour lire les données `INTEGER` en utilisant les `BigInt`s JavaScript. Cette méthode n’a aucun impact sur les opérations d’écriture de la base de données où les nombres et les `BigInt`s sont tous deux pris en charge à tout moment.

### `statement.sourceSQL` {#statementsourcesql}

**Ajouté dans : v22.5.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le code SQL source utilisé pour créer cette instruction préparée.

Le texte SQL source de l’instruction préparée. Cette propriété est un wrapper autour de [`sqlite3_sql()`](https://www.sqlite.org/c3ref/expanded_sql).


### Conversion de type entre JavaScript et SQLite {#type-conversion-between-javascript-and-sqlite}

Lorsque Node.js écrit dans ou lit à partir de SQLite, il est nécessaire de convertir entre les types de données JavaScript et les [types de données](https://www.sqlite.org/datatype3) de SQLite. Étant donné que JavaScript prend en charge plus de types de données que SQLite, seul un sous-ensemble de types JavaScript est pris en charge. Tenter d'écrire un type de données non pris en charge dans SQLite entraînera une exception.

| SQLite | JavaScript |
| --- | --- |
| `NULL` | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) |
| `INTEGER` | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)   ou   [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) |
| `REAL` | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) |
| `TEXT` | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) |
| `BLOB` | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) |
## `sqlite.constants` {#sqliteconstants}

**Ajouté dans : v23.5.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Un objet contenant des constantes couramment utilisées pour les opérations SQLite.

### Constantes SQLite {#sqlite-constants}

Les constantes suivantes sont exportées par l'objet `sqlite.constants`.

#### Constantes de résolution des conflits {#conflict-resolution-constants}

Les constantes suivantes sont destinées à être utilisées avec [`database.applyChangeset()`](/fr/nodejs/api/sqlite#databaseapplychangesetchangeset-options).

| Constante | Description |
| --- | --- |
| `SQLITE_CHANGESET_OMIT` | Les changements conflictuels sont omis. |
| `SQLITE_CHANGESET_REPLACE` | Les changements conflictuels remplacent les valeurs existantes. |
| `SQLITE_CHANGESET_ABORT` | Abandonner lorsqu'un changement rencontre un conflit et annuler la base de données. |

