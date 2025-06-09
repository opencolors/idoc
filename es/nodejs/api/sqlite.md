---
title: Documentación de la API de SQLite para Node.js
description: La documentación de la API de SQLite para Node.js ofrece detalles exhaustivos sobre cómo interactuar con bases de datos SQLite en aplicaciones Node.js. Incluye la gestión de conexiones a la base de datos, la ejecución de consultas SQL, el manejo de transacciones y la gestión de errores.
head:
  - - meta
    - name: og:title
      content: Documentación de la API de SQLite para Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: La documentación de la API de SQLite para Node.js ofrece detalles exhaustivos sobre cómo interactuar con bases de datos SQLite en aplicaciones Node.js. Incluye la gestión de conexiones a la base de datos, la ejecución de consultas SQL, el manejo de transacciones y la gestión de errores.
  - - meta
    - name: twitter:title
      content: Documentación de la API de SQLite para Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: La documentación de la API de SQLite para Node.js ofrece detalles exhaustivos sobre cómo interactuar con bases de datos SQLite en aplicaciones Node.js. Incluye la gestión de conexiones a la base de datos, la ejecución de consultas SQL, el manejo de transacciones y la gestión de errores.
---


# SQLite {#sqlite}

**Añadido en: v22.5.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index).1 - Desarrollo activo.
:::

**Código fuente:** [lib/sqlite.js](https://github.com/nodejs/node/blob/v23.5.0/lib/sqlite.js)

El módulo `node:sqlite` facilita el trabajo con bases de datos SQLite. Para acceder a él:

::: code-group
```js [ESM]
import sqlite from 'node:sqlite';
```

```js [CJS]
const sqlite = require('node:sqlite');
```
:::

Este módulo solo está disponible bajo el esquema `node:`.

El siguiente ejemplo muestra el uso básico del módulo `node:sqlite` para abrir una base de datos en memoria, escribir datos en la base de datos y luego leer los datos de vuelta.

::: code-group
```js [ESM]
import { DatabaseSync } from 'node:sqlite';
const database = new DatabaseSync(':memory:');

// Ejecutar sentencias SQL desde cadenas.
database.exec(`
  CREATE TABLE data(
    key INTEGER PRIMARY KEY,
    value TEXT
  ) STRICT
`);
// Crear una sentencia preparada para insertar datos en la base de datos.
const insert = database.prepare('INSERT INTO data (key, value) VALUES (?, ?)');
// Ejecutar la sentencia preparada con valores enlazados.
insert.run(1, 'hello');
insert.run(2, 'world');
// Crear una sentencia preparada para leer datos de la base de datos.
const query = database.prepare('SELECT * FROM data ORDER BY key');
// Ejecutar la sentencia preparada y registrar el conjunto de resultados.
console.log(query.all());
// Imprime: [ { key: 1, value: 'hello' }, { key: 2, value: 'world' } ]
```

```js [CJS]
'use strict';
const { DatabaseSync } = require('node:sqlite');
const database = new DatabaseSync(':memory:');

// Ejecutar sentencias SQL desde cadenas.
database.exec(`
  CREATE TABLE data(
    key INTEGER PRIMARY KEY,
    value TEXT
  ) STRICT
`);
// Crear una sentencia preparada para insertar datos en la base de datos.
const insert = database.prepare('INSERT INTO data (key, value) VALUES (?, ?)');
// Ejecutar la sentencia preparada con valores enlazados.
insert.run(1, 'hello');
insert.run(2, 'world');
// Crear una sentencia preparada para leer datos de la base de datos.
const query = database.prepare('SELECT * FROM data ORDER BY key');
// Ejecutar la sentencia preparada y registrar el conjunto de resultados.
console.log(query.all());
// Imprime: [ { key: 1, value: 'hello' }, { key: 2, value: 'world' } ]
```
:::


## Clase: `DatabaseSync` {#class-databasesync}

**Añadido en: v22.5.0**

Esta clase representa una sola [conexión](https://www.sqlite.org/c3ref/sqlite3) a una base de datos SQLite. Todas las APIs expuestas por esta clase se ejecutan de forma síncrona.

### `new DatabaseSync(location[, options])` {#new-databasesynclocation-options}

**Añadido en: v22.5.0**

- `location` [\<string\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#String_type) La ubicación de la base de datos. Una base de datos SQLite puede almacenarse en un archivo o completamente [en memoria](https://www.sqlite.org/inmemorydb). Para utilizar una base de datos basada en archivos, la ubicación debe ser una ruta de archivo. Para utilizar una base de datos en memoria, la ubicación debe ser el nombre especial `':memory:'`.
- `options` [\<Object\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Object) Opciones de configuración para la conexión de la base de datos. Se admiten las siguientes opciones:
    - `open` [\<boolean\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Boolean_type) Si es `true`, la base de datos se abre mediante el constructor. Cuando este valor es `false`, la base de datos debe abrirse mediante el método `open()`. **Predeterminado:** `true`.
    - `readOnly` [\<boolean\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Boolean_type) Si es `true`, la base de datos se abre en modo de solo lectura. Si la base de datos no existe, al intentar abrirla fallará. **Predeterminado:** `false`.
    - `enableForeignKeyConstraints` [\<boolean\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Boolean_type) Si es `true`, las restricciones de clave externa están habilitadas. Esto es recomendable, pero se puede deshabilitar para la compatibilidad con esquemas de bases de datos heredados. La aplicación de las restricciones de clave externa se puede habilitar y deshabilitar después de abrir la base de datos utilizando [`PRAGMA foreign_keys`](https://www.sqlite.org/pragma#pragma_foreign_keys). **Predeterminado:** `true`.
    - `enableDoubleQuotedStringLiterals` [\<boolean\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Boolean_type) Si es `true`, SQLite aceptará [literales de cadena entre comillas dobles](https://www.sqlite.org/quirks#dblquote). Esto no es recomendable, pero se puede habilitar para la compatibilidad con esquemas de bases de datos heredados. **Predeterminado:** `false`.
    - `allowExtension` [\<boolean\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Boolean_type) Si es `true`, la función SQL `loadExtension` y el método `loadExtension()` están habilitados. Puede llamar a `enableLoadExtension(false)` más adelante para deshabilitar esta función. **Predeterminado:** `false`.

Construye una nueva instancia de `DatabaseSync`.


### `database.close()` {#databaseclose}

**Añadido en: v22.5.0**

Cierra la conexión a la base de datos. Se lanza una excepción si la base de datos no está abierta. Este método es un envoltorio para [`sqlite3_close_v2()`](https://www.sqlite.org/c3ref/close).

### `database.loadExtension(path)` {#databaseloadextensionpath}

**Añadido en: v23.5.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La ruta a la biblioteca compartida para cargar.

Carga una biblioteca compartida en la conexión a la base de datos. Este método es un envoltorio para [`sqlite3_load_extension()`](https://www.sqlite.org/c3ref/load_extension). Es necesario habilitar la opción `allowExtension` al construir la instancia `DatabaseSync`.

### `database.enableLoadExtension(allow)` {#databaseenableloadextensionallow}

**Añadido en: v23.5.0**

- `allow` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica si se permite la carga de extensiones.

Habilita o deshabilita la función SQL `loadExtension` y el método `loadExtension()`. Cuando `allowExtension` es `false` al construir, no se pueden habilitar la carga de extensiones por razones de seguridad.

### `database.exec(sql)` {#databaseexecsql}

**Añadido en: v22.5.0**

- `sql` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Una cadena SQL para ejecutar.

Este método permite ejecutar una o más sentencias SQL sin devolver ningún resultado. Este método es útil cuando se ejecutan sentencias SQL leídas de un archivo. Este método es un envoltorio para [`sqlite3_exec()`](https://www.sqlite.org/c3ref/exec).

### `database.function(name[, options], function)` {#databasefunctionname-options-function}

**Añadido en: v23.5.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El nombre de la función SQLite para crear.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Ajustes de configuración opcionales para la función. Se admiten las siguientes propiedades:
    - `deterministic` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si es `true`, el flag [`SQLITE_DETERMINISTIC`](https://www.sqlite.org/c3ref/c_deterministic) se establece en la función creada. **Predeterminado:** `false`.
    - `directOnly` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si es `true`, el flag [`SQLITE_DIRECTONLY`](https://www.sqlite.org/c3ref/c_deterministic) se establece en la función creada. **Predeterminado:** `false`.
    - `useBigIntArguments` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si es `true`, los argumentos enteros a `function` se convierten en `BigInt`s. Si es `false`, los argumentos enteros se pasan como números de JavaScript. **Predeterminado:** `false`.
    - `varargs` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si es `true`, `function` puede aceptar un número variable de argumentos. Si es `false`, `function` debe ser invocada con exactamente `function.length` argumentos. **Predeterminado:** `false`.


- `function` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La función JavaScript para llamar cuando se invoca la función SQLite.

Este método se utiliza para crear funciones definidas por el usuario de SQLite. Este método es un envoltorio para [`sqlite3_create_function_v2()`](https://www.sqlite.org/c3ref/create_function).


### `database.open()` {#databaseopen}

**Añadido en: v22.5.0**

Abre la base de datos especificada en el argumento `location` del constructor `DatabaseSync`. Este método solo debe usarse cuando la base de datos no se abre a través del constructor. Se lanza una excepción si la base de datos ya está abierta.

### `database.prepare(sql)` {#databasepreparesql}

**Añadido en: v22.5.0**

- `sql` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Una cadena SQL para compilar en una declaración preparada.
- Devuelve: [\<StatementSync\>](/es/nodejs/api/sqlite#class-statementsync) La declaración preparada.

Compila una declaración SQL en una [declaración preparada](https://www.sqlite.org/c3ref/stmt). Este método es un envoltorio alrededor de [`sqlite3_prepare_v2()`](https://www.sqlite.org/c3ref/prepare).

### `database.createSession([options])` {#databasecreatesessionoptions}

**Añadido en: v23.3.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Las opciones de configuración para la sesión.
    - `table` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Una tabla específica para rastrear los cambios. De forma predeterminada, se rastrean los cambios en todas las tablas.
    - `db` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nombre de la base de datos a rastrear. Esto es útil cuando se han añadido varias bases de datos utilizando [`ATTACH DATABASE`](https://www.sqlite.org/lang_attach). **Predeterminado**: `'main'`.


- Devuelve: [\<Session\>](/es/nodejs/api/sqlite#class-session) Un identificador de sesión.

Crea y adjunta una sesión a la base de datos. Este método es un envoltorio alrededor de [`sqlite3session_create()`](https://www.sqlite.org/session/sqlite3session_create) y [`sqlite3session_attach()`](https://www.sqlite.org/session/sqlite3session_attach).

### `database.applyChangeset(changeset[, options])` {#databaseapplychangesetchangeset-options}

**Añadido en: v23.3.0**

- `changeset` [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Un conjunto de cambios binario o un conjunto de parches.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Las opciones de configuración para cómo se aplicarán los cambios.
    - `filter` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Omite los cambios que, cuando se proporciona el nombre de la tabla de destino a esta función, devuelven un valor verdadero. De forma predeterminada, se intentan todos los cambios.
    - `onConflict` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Determina cómo se gestionan los conflictos. **Predeterminado**: `SQLITE_CHANGESET_ABORT`.
    - `SQLITE_CHANGESET_OMIT`: los cambios conflictivos se omiten.
    - `SQLITE_CHANGESET_REPLACE`: los cambios conflictivos reemplazan los valores existentes.
    - `SQLITE_CHANGESET_ABORT`: aborta en caso de conflicto y revierte la base de datos.




- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica si el conjunto de cambios se aplicó con éxito sin ser abortado.

Se lanza una excepción si la base de datos no está abierta. Este método es un envoltorio alrededor de [`sqlite3changeset_apply()`](https://www.sqlite.org/session/sqlite3changeset_apply).

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
// Ahora que se ha aplicado el conjunto de cambios, targetDb contiene los mismos datos que sourceDb.
```

## Clase: `Session` {#class-session}

**Añadido en: v23.3.0**

### `session.changeset()` {#sessionchangeset}

**Añadido en: v23.3.0**

- Retorna: [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Conjunto de cambios binario que se puede aplicar a otras bases de datos.

Recupera un conjunto de cambios que contiene todos los cambios desde que se creó el conjunto de cambios. Se puede llamar varias veces. Se lanza una excepción si la base de datos o la sesión no están abiertas. Este método es un envoltorio alrededor de [`sqlite3session_changeset()`](https://www.sqlite.org/session/sqlite3session_changeset).

### `session.patchset()` {#sessionpatchset}

**Añadido en: v23.3.0**

- Retorna: [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Conjunto de parches binario que se puede aplicar a otras bases de datos.

Similar al método anterior, pero genera un conjunto de parches más compacto. Consulte [Conjuntos de cambios y conjuntos de parches](https://www.sqlite.org/sessionintro#changesets_and_patchsets) en la documentación de SQLite. Se lanza una excepción si la base de datos o la sesión no están abiertas. Este método es un envoltorio alrededor de [`sqlite3session_patchset()`](https://www.sqlite.org/session/sqlite3session_patchset).

### `session.close()`. {#sessionclose}

Cierra la sesión. Se lanza una excepción si la base de datos o la sesión no están abiertas. Este método es un envoltorio alrededor de [`sqlite3session_delete()`](https://www.sqlite.org/session/sqlite3session_delete).

## Clase: `StatementSync` {#class-statementsync}

**Añadido en: v22.5.0**

Esta clase representa una única [sentencia preparada](https://www.sqlite.org/c3ref/stmt). Esta clase no se puede instanciar a través de su constructor. En su lugar, las instancias se crean a través del método `database.prepare()`. Todas las API expuestas por esta clase se ejecutan sincrónicamente.

Una sentencia preparada es una representación binaria eficiente del SQL utilizado para crearla. Las sentencias preparadas son parametrizables y se pueden invocar varias veces con diferentes valores enlazados. Los parámetros también ofrecen protección contra ataques de [inyección SQL](https://en.wikipedia.org/wiki/SQL_injection). Por estas razones, las sentencias preparadas son preferibles a las cadenas SQL hechas a mano cuando se maneja la entrada del usuario.


### `statement.all([namedParameters][, ...anonymousParameters])` {#statementallnamedparameters-anonymousparameters}

**Añadido en: v22.5.0**

- `namedParameters` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un objeto opcional utilizado para vincular parámetros nombrados. Las claves de este objeto se utilizan para configurar la asignación.
- `...anonymousParameters` [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Cero o más valores para vincular a parámetros anónimos.
- Devuelve: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Un array de objetos. Cada objeto corresponde a una fila devuelta al ejecutar la sentencia preparada. Las claves y los valores de cada objeto corresponden a los nombres y valores de las columnas de la fila.

Este método ejecuta una sentencia preparada y devuelve todos los resultados como un array de objetos. Si la sentencia preparada no devuelve ningún resultado, este método devuelve un array vacío. Los [parámetros de la sentencia preparada se vinculan](https://www.sqlite.org/c3ref/bind_blob) utilizando los valores en `namedParameters` y `anonymousParameters`.

### `statement.expandedSQL` {#statementexpandedsql}

**Añadido en: v22.5.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El SQL fuente expandido para incluir los valores de los parámetros.

El texto SQL fuente de la sentencia preparada con los marcadores de posición de los parámetros reemplazados por los valores que se utilizaron durante la ejecución más reciente de esta sentencia preparada. Esta propiedad es un envoltorio alrededor de [`sqlite3_expanded_sql()`](https://www.sqlite.org/c3ref/expanded_sql).


### `statement.get([namedParameters][, ...anonymousParameters])` {#statementgetnamedparameters-anonymousparameters}

**Añadido en: v22.5.0**

- `namedParameters` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un objeto opcional usado para vincular parámetros nombrados. Las claves de este objeto se utilizan para configurar la asignación.
- `...anonymousParameters` [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Cero o más valores para vincular a parámetros anónimos.
- Devuelve: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Un objeto correspondiente a la primera fila devuelta al ejecutar la sentencia preparada. Las claves y los valores del objeto corresponden a los nombres y valores de las columnas de la fila. Si no se devolvieron filas de la base de datos, este método devuelve `undefined`.

Este método ejecuta una sentencia preparada y devuelve el primer resultado como un objeto. Si la sentencia preparada no devuelve ningún resultado, este método devuelve `undefined`. Los [parámetros de la sentencia preparada están vinculados](https://www.sqlite.org/c3ref/bind_blob) usando los valores en `namedParameters` y `anonymousParameters`.

### `statement.iterate([namedParameters][, ...anonymousParameters])` {#statementiteratenamedparameters-anonymousparameters}

**Añadido en: v23.4.0**

- `namedParameters` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un objeto opcional usado para vincular parámetros nombrados. Las claves de este objeto se utilizan para configurar la asignación.
- `...anonymousParameters` [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Cero o más valores para vincular a parámetros anónimos.
- Devuelve: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol) Un iterador iterable de objetos. Cada objeto corresponde a una fila devuelta al ejecutar la sentencia preparada. Las claves y los valores de cada objeto corresponden a los nombres y valores de las columnas de la fila.

Este método ejecuta una sentencia preparada y devuelve un iterador de objetos. Si la sentencia preparada no devuelve ningún resultado, este método devuelve un iterador vacío. Los [parámetros de la sentencia preparada están vinculados](https://www.sqlite.org/c3ref/bind_blob) usando los valores en `namedParameters` y `anonymousParameters`.


### `statement.run([namedParameters][, ...anonymousParameters])` {#statementrunnamedparameters-anonymousparameters}

**Añadido en: v22.5.0**

- `namedParameters` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un objeto opcional utilizado para vincular parámetros con nombre. Las claves de este objeto se utilizan para configurar la asignación.
- `...anonymousParameters` [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Cero o más valores para vincular a parámetros anónimos.
- Devuelve: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `changes`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) El número de filas modificadas, insertadas o eliminadas por la instrucción `INSERT`, `UPDATE` o `DELETE` completada más recientemente. Este campo es un número o un `BigInt` dependiendo de la configuración de la declaración preparada. Esta propiedad es el resultado de [`sqlite3_changes64()`](https://www.sqlite.org/c3ref/changes).
    - `lastInsertRowid`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) El rowid insertado más recientemente. Este campo es un número o un `BigInt` dependiendo de la configuración de la declaración preparada. Esta propiedad es el resultado de [`sqlite3_last_insert_rowid()`](https://www.sqlite.org/c3ref/last_insert_rowid).
  
 

Este método ejecuta una declaración preparada y devuelve un objeto que resume los cambios resultantes. Los [parámetros de la declaración preparada se vinculan](https://www.sqlite.org/c3ref/bind_blob) utilizando los valores en `namedParameters` y `anonymousParameters`.


### `statement.setAllowBareNamedParameters(enabled)` {#statementsetallowbarenamedparametersenabled}

**Añadido en: v22.5.0**

- `enabled` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Activa o desactiva la compatibilidad para vincular parámetros nombrados sin el carácter de prefijo.

Los nombres de los parámetros de SQLite comienzan con un carácter de prefijo. Por defecto, `node:sqlite` requiere que este carácter de prefijo esté presente al vincular parámetros. Sin embargo, con la excepción del signo de dólar, estos caracteres de prefijo también requieren comillas adicionales cuando se utilizan en claves de objetos.

Para mejorar la ergonomía, este método se puede utilizar también para permitir parámetros nombrados "bare", que no requieren el carácter de prefijo en el código JavaScript. Hay varias advertencias que se deben tener en cuenta al habilitar los parámetros nombrados "bare":

- El carácter de prefijo todavía es necesario en SQL.
- El carácter de prefijo todavía está permitido en JavaScript. De hecho, los nombres con prefijo tendrán un rendimiento de enlace ligeramente mejor.
- El uso de parámetros nombrados ambiguos, como `$k` y `@k`, en la misma sentencia preparada resultará en una excepción, ya que no se puede determinar cómo vincular un nombre "bare".

### `statement.setReadBigInts(enabled)` {#statementsetreadbigintsenabled}

**Añadido en: v22.5.0**

- `enabled` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Activa o desactiva el uso de `BigInt`s al leer campos `INTEGER` de la base de datos.

Al leer de la base de datos, los `INTEGER` de SQLite se asignan a números de JavaScript de forma predeterminada. Sin embargo, los `INTEGER` de SQLite pueden almacenar valores más grandes de lo que los números de JavaScript son capaces de representar. En tales casos, este método se puede utilizar para leer datos `INTEGER` utilizando `BigInt`s de JavaScript. Este método no tiene impacto en las operaciones de escritura de la base de datos, donde los números y los `BigInt`s son compatibles en todo momento.

### `statement.sourceSQL` {#statementsourcesql}

**Añadido en: v22.5.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El código SQL fuente utilizado para crear esta sentencia preparada.

El texto SQL fuente de la sentencia preparada. Esta propiedad es un envoltorio alrededor de [`sqlite3_sql()`](https://www.sqlite.org/c3ref/expanded_sql).


### Conversión de tipo entre JavaScript y SQLite {#type-conversion-between-javascript-and-sqlite}

Cuando Node.js escribe o lee desde SQLite, es necesario convertir entre los tipos de datos de JavaScript y los [tipos de datos](https://www.sqlite.org/datatype3) de SQLite. Debido a que JavaScript admite más tipos de datos que SQLite, solo se admite un subconjunto de tipos de JavaScript. Intentar escribir un tipo de datos no admitido en SQLite resultará en una excepción.

| SQLite | JavaScript |
| --- | --- |
| `NULL` | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) |
| `INTEGER` | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)   o   [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) |
| `REAL` | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) |
| `TEXT` | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) |
| `BLOB` | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) |
## `sqlite.constants` {#sqliteconstants}

**Añadido en: v23.5.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Un objeto que contiene constantes de uso común para las operaciones de SQLite.

### Constantes de SQLite {#sqlite-constants}

Las siguientes constantes son exportadas por el objeto `sqlite.constants`.

#### Constantes de resolución de conflictos {#conflict-resolution-constants}

Las siguientes constantes están destinadas a ser utilizadas con [`database.applyChangeset()`](/es/nodejs/api/sqlite#databaseapplychangesetchangeset-options).

| Constante | Descripción |
| --- | --- |
| `SQLITE_CHANGESET_OMIT` | Los cambios en conflicto se omiten. |
| `SQLITE_CHANGESET_REPLACE` | Los cambios en conflicto reemplazan los valores existentes. |
| `SQLITE_CHANGESET_ABORT` | Abortar cuando un cambio encuentra un conflicto y deshacer la base de datos. |

