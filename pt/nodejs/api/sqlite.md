---
title: Documentação da API SQLite para Node.js
description: A documentação da API SQLite para Node.js fornece detalhes abrangentes sobre como interagir com bancos de dados SQLite em aplicações Node.js. Ela cobre a gestão de conexões com o banco de dados, execução de consultas SQL, tratamento de transações e gerenciamento de erros.
head:
  - - meta
    - name: og:title
      content: Documentação da API SQLite para Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: A documentação da API SQLite para Node.js fornece detalhes abrangentes sobre como interagir com bancos de dados SQLite em aplicações Node.js. Ela cobre a gestão de conexões com o banco de dados, execução de consultas SQL, tratamento de transações e gerenciamento de erros.
  - - meta
    - name: twitter:title
      content: Documentação da API SQLite para Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: A documentação da API SQLite para Node.js fornece detalhes abrangentes sobre como interagir com bancos de dados SQLite em aplicações Node.js. Ela cobre a gestão de conexões com o banco de dados, execução de consultas SQL, tratamento de transações e gerenciamento de erros.
---


# SQLite {#sqlite}

**Adicionado em: v22.5.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index).1 - Desenvolvimento ativo.
:::

**Código Fonte:** [lib/sqlite.js](https://github.com/nodejs/node/blob/v23.5.0/lib/sqlite.js)

O módulo `node:sqlite` facilita o trabalho com bancos de dados SQLite. Para acessá-lo:

::: code-group
```js [ESM]
import sqlite from 'node:sqlite';
```

```js [CJS]
const sqlite = require('node:sqlite');
```
:::

Este módulo está disponível apenas sob o esquema `node:`.

O exemplo a seguir mostra o uso básico do módulo `node:sqlite` para abrir um banco de dados na memória, gravar dados no banco de dados e, em seguida, ler os dados de volta.

::: code-group
```js [ESM]
import { DatabaseSync } from 'node:sqlite';
const database = new DatabaseSync(':memory:');

// Execute instruções SQL de strings.
database.exec(`
  CREATE TABLE data(
    key INTEGER PRIMARY KEY,
    value TEXT
  ) STRICT
`);
// Crie uma instrução preparada para inserir dados no banco de dados.
const insert = database.prepare('INSERT INTO data (key, value) VALUES (?, ?)');
// Execute a instrução preparada com valores vinculados.
insert.run(1, 'hello');
insert.run(2, 'world');
// Crie uma instrução preparada para ler dados do banco de dados.
const query = database.prepare('SELECT * FROM data ORDER BY key');
// Execute a instrução preparada e registre o conjunto de resultados.
console.log(query.all());
// Prints: [ { key: 1, value: 'hello' }, { key: 2, value: 'world' } ]
```

```js [CJS]
'use strict';
const { DatabaseSync } = require('node:sqlite');
const database = new DatabaseSync(':memory:');

// Execute instruções SQL de strings.
database.exec(`
  CREATE TABLE data(
    key INTEGER PRIMARY KEY,
    value TEXT
  ) STRICT
`);
// Crie uma instrução preparada para inserir dados no banco de dados.
const insert = database.prepare('INSERT INTO data (key, value) VALUES (?, ?)');
// Execute a instrução preparada com valores vinculados.
insert.run(1, 'hello');
insert.run(2, 'world');
// Crie uma instrução preparada para ler dados do banco de dados.
const query = database.prepare('SELECT * FROM data ORDER BY key');
// Execute a instrução preparada e registre o conjunto de resultados.
console.log(query.all());
// Prints: [ { key: 1, value: 'hello' }, { key: 2, value: 'world' } ]
```
:::


## Classe: `DatabaseSync` {#class-databasesync}

**Adicionado em: v22.5.0**

Esta classe representa uma única [conexão](https://www.sqlite.org/c3ref/sqlite3) a um banco de dados SQLite. Todas as APIs expostas por esta classe são executadas de forma síncrona.

### `new DatabaseSync(location[, options])` {#new-databasesynclocation-options}

**Adicionado em: v22.5.0**

- `location` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O local do banco de dados. Um banco de dados SQLite pode ser armazenado em um arquivo ou completamente [na memória](https://www.sqlite.org/inmemorydb). Para usar um banco de dados baseado em arquivo, o local deve ser um caminho de arquivo. Para usar um banco de dados na memória, o local deve ser o nome especial `':memory:'`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opções de configuração para a conexão do banco de dados. As seguintes opções são suportadas:
    - `open` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, o banco de dados é aberto pelo construtor. Quando este valor é `false`, o banco de dados deve ser aberto através do método `open()`. **Padrão:** `true`.
    - `readOnly` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, o banco de dados é aberto no modo somente leitura. Se o banco de dados não existir, abri-lo falhará. **Padrão:** `false`.
    - `enableForeignKeyConstraints` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, as restrições de chave estrangeira são habilitadas. Isso é recomendado, mas pode ser desativado para compatibilidade com esquemas de banco de dados legados. A aplicação de restrições de chave estrangeira pode ser ativada e desativada após a abertura do banco de dados usando [`PRAGMA foreign_keys`](https://www.sqlite.org/pragma#pragma_foreign_keys). **Padrão:** `true`.
    - `enableDoubleQuotedStringLiterals` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, o SQLite aceitará [literais de string entre aspas duplas](https://www.sqlite.org/quirks#dblquote). Isso não é recomendado, mas pode ser habilitado para compatibilidade com esquemas de banco de dados legados. **Padrão:** `false`.
    - `allowExtension` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, a função SQL `loadExtension` e o método `loadExtension()` são habilitados. Você pode chamar `enableLoadExtension(false)` posteriormente para desativar este recurso. **Padrão:** `false`.

Constrói uma nova instância de `DatabaseSync`.


### `database.close()` {#databaseclose}

**Adicionado em: v22.5.0**

Fecha a conexão com o banco de dados. Uma exceção é lançada se o banco de dados não estiver aberto. Este método é um wrapper em torno de [`sqlite3_close_v2()`](https://www.sqlite.org/c3ref/close).

### `database.loadExtension(path)` {#databaseloadextensionpath}

**Adicionado em: v23.5.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O caminho para a biblioteca compartilhada a ser carregada.

Carrega uma biblioteca compartilhada na conexão do banco de dados. Este método é um wrapper em torno de [`sqlite3_load_extension()`](https://www.sqlite.org/c3ref/load_extension). É necessário habilitar a opção `allowExtension` ao construir a instância `DatabaseSync`.

### `database.enableLoadExtension(allow)` {#databaseenableloadextensionallow}

**Adicionado em: v23.5.0**

- `allow` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se permite ou não carregar extensões.

Habilita ou desabilita a função SQL `loadExtension` e o método `loadExtension()`. Quando `allowExtension` é `false` durante a construção, você não pode habilitar o carregamento de extensões por motivos de segurança.

### `database.exec(sql)` {#databaseexecsql}

**Adicionado em: v22.5.0**

- `sql` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Uma string SQL para executar.

Este método permite que uma ou mais instruções SQL sejam executadas sem retornar nenhum resultado. Este método é útil ao executar instruções SQL lidas de um arquivo. Este método é um wrapper em torno de [`sqlite3_exec()`](https://www.sqlite.org/c3ref/exec).

### `database.function(name[, options], function)` {#databasefunctionname-options-function}

**Adicionado em: v23.5.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O nome da função SQLite a ser criada.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Configurações opcionais para a função. As seguintes propriedades são suportadas:
    - `deterministic` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, o flag [`SQLITE_DETERMINISTIC`](https://www.sqlite.org/c3ref/c_deterministic) é definido na função criada. **Padrão:** `false`.
    - `directOnly` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, o flag [`SQLITE_DIRECTONLY`](https://www.sqlite.org/c3ref/c_deterministic) é definido na função criada. **Padrão:** `false`.
    - `useBigIntArguments` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, argumentos inteiros para `function` são convertidos para `BigInt`s. Se `false`, argumentos inteiros são passados como números JavaScript. **Padrão:** `false`.
    - `varargs` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, `function` pode aceitar um número variável de argumentos. Se `false`, `function` deve ser invocada com exatamente `function.length` argumentos. **Padrão:** `false`.


- `function` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) A função JavaScript a ser chamada quando a função SQLite é invocada.

Este método é usado para criar funções definidas pelo usuário do SQLite. Este método é um wrapper em torno de [`sqlite3_create_function_v2()`](https://www.sqlite.org/c3ref/create_function).


### `database.open()` {#databaseopen}

**Adicionado em: v22.5.0**

Abre o banco de dados especificado no argumento `location` do construtor `DatabaseSync`. Este método deve ser usado apenas quando o banco de dados não é aberto através do construtor. Uma exceção é lançada se o banco de dados já estiver aberto.

### `database.prepare(sql)` {#databasepreparesql}

**Adicionado em: v22.5.0**

- `sql` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Uma string SQL para compilar em uma declaração preparada.
- Retorna: [\<StatementSync\>](/pt/nodejs/api/sqlite#class-statementsync) A declaração preparada.

Compila uma declaração SQL em uma [declaração preparada](https://www.sqlite.org/c3ref/stmt). Este método é um wrapper em torno de [`sqlite3_prepare_v2()`](https://www.sqlite.org/c3ref/prepare).

### `database.createSession([options])` {#databasecreatesessionoptions}

**Adicionado em: v23.3.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) As opções de configuração para a sessão.
    - `table` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Uma tabela específica para rastrear as alterações. Por padrão, as alterações em todas as tabelas são rastreadas.
    - `db` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome do banco de dados a ser rastreado. Isso é útil quando vários bancos de dados foram adicionados usando [`ATTACH DATABASE`](https://www.sqlite.org/lang_attach). **Padrão**: `'main'`.


- Retorna: [\<Session\>](/pt/nodejs/api/sqlite#class-session) Um manipulador de sessão.

Cria e anexa uma sessão ao banco de dados. Este método é um wrapper em torno de [`sqlite3session_create()`](https://www.sqlite.org/session/sqlite3session_create) e [`sqlite3session_attach()`](https://www.sqlite.org/session/sqlite3session_attach).

### `database.applyChangeset(changeset[, options])` {#databaseapplychangesetchangeset-options}

**Adicionado em: v23.3.0**

- `changeset` [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Um conjunto de alterações binário ou patchset.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) As opções de configuração para como as alterações serão aplicadas.
    - `filter` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Ignora as alterações que, quando o nome da tabela de destino é fornecido a esta função, retornam um valor verdadeiro. Por padrão, todas as alterações são tentadas.
    - `onConflict` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Determina como os conflitos são tratados. **Padrão**: `SQLITE_CHANGESET_ABORT`.
    - `SQLITE_CHANGESET_OMIT`: alterações conflitantes são omitidas.
    - `SQLITE_CHANGESET_REPLACE`: alterações conflitantes substituem os valores existentes.
    - `SQLITE_CHANGESET_ABORT`: aborta em caso de conflito e reverte o banco de dados.



- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se o conjunto de alterações foi aplicado com sucesso sem ser abortado.

Uma exceção é lançada se o banco de dados não estiver aberto. Este método é um wrapper em torno de [`sqlite3changeset_apply()`](https://www.sqlite.org/session/sqlite3changeset_apply).

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
```

## Classe: `Session` {#class-session}

**Adicionado em: v23.3.0**

### `session.changeset()` {#sessionchangeset}

**Adicionado em: v23.3.0**

- Retorna: [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Conjunto de alterações binário que pode ser aplicado a outros bancos de dados.

Recupera um conjunto de alterações contendo todas as alterações desde que o conjunto de alterações foi criado. Pode ser chamado várias vezes. Uma exceção é lançada se o banco de dados ou a sessão não estiverem abertos. Este método é um wrapper em torno de [`sqlite3session_changeset()`](https://www.sqlite.org/session/sqlite3session_changeset).

### `session.patchset()` {#sessionpatchset}

**Adicionado em: v23.3.0**

- Retorna: [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Conjunto de patches binário que pode ser aplicado a outros bancos de dados.

Semelhante ao método acima, mas gera um conjunto de patches mais compacto. Consulte [Changesets and Patchsets](https://www.sqlite.org/sessionintro#changesets_and_patchsets) na documentação do SQLite. Uma exceção é lançada se o banco de dados ou a sessão não estiverem abertos. Este método é um wrapper em torno de [`sqlite3session_patchset()`](https://www.sqlite.org/session/sqlite3session_patchset).

### `session.close()`. {#sessionclose}

Fecha a sessão. Uma exceção é lançada se o banco de dados ou a sessão não estiverem abertos. Este método é um wrapper em torno de [`sqlite3session_delete()`](https://www.sqlite.org/session/sqlite3session_delete).

## Classe: `StatementSync` {#class-statementsync}

**Adicionado em: v22.5.0**

Esta classe representa uma única [declaração preparada](https://www.sqlite.org/c3ref/stmt). Esta classe não pode ser instanciada através de seu construtor. Em vez disso, as instâncias são criadas através do método `database.prepare()`. Todas as APIs expostas por esta classe são executadas de forma síncrona.

Uma declaração preparada é uma representação binária eficiente do SQL usado para criá-la. As declarações preparadas são parametrizáveis ​​e podem ser invocadas várias vezes com diferentes valores vinculados. Os parâmetros também oferecem proteção contra ataques de [injeção de SQL](https://en.wikipedia.org/wiki/SQL_injection). Por estas razões, as declarações preparadas são preferíveis às strings SQL artesanais ao lidar com a entrada do usuário.


### `statement.all([namedParameters][, ...anonymousParameters])` {#statementallnamedparameters-anonymousparameters}

**Adicionado em: v22.5.0**

- `namedParameters` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Um objeto opcional usado para vincular parâmetros nomeados. As chaves deste objeto são usadas para configurar o mapeamento.
- `...anonymousParameters` [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Zero ou mais valores para vincular a parâmetros anônimos.
- Retorna: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Um array de objetos. Cada objeto corresponde a uma linha retornada pela execução da instrução preparada. As chaves e valores de cada objeto correspondem aos nomes e valores das colunas da linha.

Este método executa uma instrução preparada e retorna todos os resultados como um array de objetos. Se a instrução preparada não retornar nenhum resultado, este método retorna um array vazio. Os [parâmetros da instrução preparada são vinculados](https://www.sqlite.org/c3ref/bind_blob) usando os valores em `namedParameters` e `anonymousParameters`.

### `statement.expandedSQL` {#statementexpandedsql}

**Adicionado em: v22.5.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O SQL de origem expandido para incluir valores de parâmetros.

O texto SQL de origem da instrução preparada com marcadores de posição de parâmetros substituídos pelos valores que foram usados durante a execução mais recente desta instrução preparada. Esta propriedade é um wrapper em torno de [`sqlite3_expanded_sql()`](https://www.sqlite.org/c3ref/expanded_sql).


### `statement.get([namedParameters][, ...anonymousParameters])` {#statementgetnamedparameters-anonymousparameters}

**Adicionado em: v22.5.0**

- `namedParameters` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Um objeto opcional usado para vincular parâmetros nomeados. As chaves deste objeto são usadas para configurar o mapeamento.
- `...anonymousParameters` [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Zero ou mais valores para vincular a parâmetros anônimos.
- Retorna: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Um objeto correspondente à primeira linha retornada pela execução da declaração preparada. As chaves e os valores do objeto correspondem aos nomes das colunas e aos valores da linha. Se nenhuma linha for retornada do banco de dados, este método retornará `undefined`.

Este método executa uma declaração preparada e retorna o primeiro resultado como um objeto. Se a declaração preparada não retornar nenhum resultado, este método retornará `undefined`. Os [parâmetros são vinculados](https://www.sqlite.org/c3ref/bind_blob) usando os valores em `namedParameters` e `anonymousParameters`.

### `statement.iterate([namedParameters][, ...anonymousParameters])` {#statementiteratenamedparameters-anonymousparameters}

**Adicionado em: v23.4.0**

- `namedParameters` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Um objeto opcional usado para vincular parâmetros nomeados. As chaves deste objeto são usadas para configurar o mapeamento.
- `...anonymousParameters` [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Zero ou mais valores para vincular a parâmetros anônimos.
- Retorna: [\<Iterator\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol) Um iterador iterável de objetos. Cada objeto corresponde a uma linha retornada pela execução da declaração preparada. As chaves e os valores de cada objeto correspondem aos nomes das colunas e aos valores da linha.

Este método executa uma declaração preparada e retorna um iterador de objetos. Se a declaração preparada não retornar nenhum resultado, este método retornará um iterador vazio. Os [parâmetros são vinculados](https://www.sqlite.org/c3ref/bind_blob) usando os valores em `namedParameters` e `anonymousParameters`.


### `statement.run([namedParameters][, ...anonymousParameters])` {#statementrunnamedparameters-anonymousparameters}

**Adicionado em: v22.5.0**

- `namedParameters` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Um objeto opcional usado para vincular parâmetros nomeados. As chaves deste objeto são usadas para configurar o mapeamento.
- `...anonymousParameters` [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) Zero ou mais valores para vincular a parâmetros anônimos.
- Retorna: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `changes`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) O número de linhas modificadas, inseridas ou excluídas pela instrução `INSERT`, `UPDATE` ou `DELETE` concluída mais recentemente. Este campo é um número ou um `BigInt`, dependendo da configuração da instrução preparada. Esta propriedade é o resultado de [`sqlite3_changes64()`](https://www.sqlite.org/c3ref/changes).
    - `lastInsertRowid`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) O rowid inserido mais recentemente. Este campo é um número ou um `BigInt`, dependendo da configuração da instrução preparada. Esta propriedade é o resultado de [`sqlite3_last_insert_rowid()`](https://www.sqlite.org/c3ref/last_insert_rowid).

Esta função executa uma instrução preparada e retorna um objeto que resume as alterações resultantes. Os [parâmetros da instrução preparada são vinculados](https://www.sqlite.org/c3ref/bind_blob) usando os valores em `namedParameters` e `anonymousParameters`.


### `statement.setAllowBareNamedParameters(enabled)` {#statementsetallowbarenamedparametersenabled}

**Adicionado em: v22.5.0**

- `enabled` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Ativa ou desativa o suporte para vincular parâmetros nomeados sem o caractere de prefixo.

Os nomes dos parâmetros SQLite começam com um caractere de prefixo. Por padrão, `node:sqlite` exige que esse caractere de prefixo esteja presente ao vincular parâmetros. No entanto, com exceção do caractere de cifrão, esses caracteres de prefixo também exigem aspas extras quando usados em chaves de objeto.

Para melhorar a ergonomia, este método pode ser usado para também permitir parâmetros nomeados "bare", que não exigem o caractere de prefixo no código JavaScript. Existem várias ressalvas a serem consideradas ao ativar parâmetros nomeados "bare":

- O caractere de prefixo ainda é obrigatório em SQL.
- O caractere de prefixo ainda é permitido em JavaScript. Na verdade, os nomes com prefixo terão um desempenho de vinculação ligeiramente melhor.
- O uso de parâmetros nomeados ambíguos, como `$k` e `@k`, na mesma instrução preparada resultará em uma exceção, pois não é possível determinar como vincular um nome "bare".

### `statement.setReadBigInts(enabled)` {#statementsetreadbigintsenabled}

**Adicionado em: v22.5.0**

- `enabled` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Ativa ou desativa o uso de `BigInt`s ao ler campos `INTEGER` do banco de dados.

Ao ler do banco de dados, os `INTEGER`s do SQLite são mapeados para números JavaScript por padrão. No entanto, os `INTEGER`s do SQLite podem armazenar valores maiores do que os números JavaScript são capazes de representar. Nesses casos, este método pode ser usado para ler dados `INTEGER` usando `BigInt`s do JavaScript. Este método não tem impacto nas operações de gravação do banco de dados, onde números e `BigInt`s são suportados em todos os momentos.

### `statement.sourceSQL` {#statementsourcesql}

**Adicionado em: v22.5.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O SQL de origem usado para criar esta instrução preparada.

O texto SQL de origem da instrução preparada. Esta propriedade é um wrapper em torno de [`sqlite3_sql()`](https://www.sqlite.org/c3ref/expanded_sql).


### Conversão de tipo entre JavaScript e SQLite {#type-conversion-between-javascript-and-sqlite}

Quando o Node.js grava ou lê do SQLite, é necessário converter entre os tipos de dados JavaScript e os [tipos de dados](https://www.sqlite.org/datatype3) do SQLite. Como o JavaScript suporta mais tipos de dados do que o SQLite, apenas um subconjunto dos tipos JavaScript é suportado. Tentar gravar um tipo de dado não suportado no SQLite resultará em uma exceção.

| SQLite | JavaScript |
| --- | --- |
| `NULL` | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) |
| `INTEGER` | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)   ou   [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) |
| `REAL` | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) |
| `TEXT` | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) |
| `BLOB` | [\<Uint8Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) |
## `sqlite.constants` {#sqliteconstants}

**Adicionado em: v23.5.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Um objeto contendo constantes comumente usadas para operações SQLite.

### Constantes SQLite {#sqlite-constants}

As seguintes constantes são exportadas pelo objeto `sqlite.constants`.

#### Constantes de resolução de conflitos {#conflict-resolution-constants}

As seguintes constantes destinam-se ao uso com [`database.applyChangeset()`](/pt/nodejs/api/sqlite#databaseapplychangesetchangeset-options).

| Constante | Descrição |
| --- | --- |
| `SQLITE_CHANGESET_OMIT` | Alterações conflitantes são omitidas. |
| `SQLITE_CHANGESET_REPLACE` | Alterações conflitantes substituem os valores existentes. |
| `SQLITE_CHANGESET_ABORT` | Abortar quando uma alteração encontra um conflito e reverter o banco de dados. |

