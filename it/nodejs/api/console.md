---
title: Documentazione dell'API Console di Node.js
description: L'API Console di Node.js fornisce una console di debug semplice, simile al meccanismo della console JavaScript fornito dai browser web. Questa documentazione dettaglia i metodi disponibili per la registrazione, il debug e l'ispezione degli oggetti JavaScript in un ambiente Node.js.
head:
  - - meta
    - name: og:title
      content: Documentazione dell'API Console di Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: L'API Console di Node.js fornisce una console di debug semplice, simile al meccanismo della console JavaScript fornito dai browser web. Questa documentazione dettaglia i metodi disponibili per la registrazione, il debug e l'ispezione degli oggetti JavaScript in un ambiente Node.js.
  - - meta
    - name: twitter:title
      content: Documentazione dell'API Console di Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: L'API Console di Node.js fornisce una console di debug semplice, simile al meccanismo della console JavaScript fornito dai browser web. Questa documentazione dettaglia i metodi disponibili per la registrazione, il debug e l'ispezione degli oggetti JavaScript in un ambiente Node.js.
---


# Console {#console}

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile
:::

**Codice sorgente:** [lib/console.js](https://github.com/nodejs/node/blob/v23.5.0/lib/console.js)

Il modulo `node:console` fornisce una semplice console di debug simile al meccanismo della console JavaScript fornito dai browser web.

Il modulo esporta due componenti specifici:

- Una classe `Console` con metodi come `console.log()`, `console.error()` e `console.warn()` che possono essere utilizzati per scrivere su qualsiasi stream Node.js.
- Un'istanza globale `console` configurata per scrivere su [`process.stdout`](/it/nodejs/api/process#processstdout) e [`process.stderr`](/it/nodejs/api/process#processstderr). La `console` globale può essere utilizzata senza chiamare `require('node:console')`.

*<strong>Avviso</strong>*: I metodi dell'oggetto console globale non sono né coerentemente sincroni come le API del browser a cui assomigliano, né coerentemente asincroni come tutti gli altri stream Node.js. I programmi che desiderano dipendere dal comportamento sincrono/asincrono delle funzioni della console dovrebbero prima capire la natura dello stream di supporto della console. Questo perché lo stream dipende dalla piattaforma sottostante e dalla configurazione dello stream standard del processo corrente. Consultare la [nota sull'I/O del processo](/it/nodejs/api/process#a-note-on-process-io) per ulteriori informazioni.

Esempio di utilizzo della `console` globale:

```js [ESM]
console.log('hello world');
// Stampa: hello world, su stdout
console.log('hello %s', 'world');
// Stampa: hello world, su stdout
console.error(new Error('Whoops, something bad happened'));
// Stampa il messaggio di errore e la traccia dello stack su stderr:
//   Error: Whoops, something bad happened
//     at [eval]:5:15
//     at Script.runInThisContext (node:vm:132:18)
//     at Object.runInThisContext (node:vm:309:38)
//     at node:internal/process/execution:77:19
//     at [eval]-wrapper:6:22
//     at evalScript (node:internal/process/execution:76:60)
//     at node:internal/main/eval_string:23:3

const name = 'Will Robinson';
console.warn(`Danger ${name}! Danger!`);
// Stampa: Danger Will Robinson! Danger!, su stderr
```
Esempio di utilizzo della classe `Console`:

```js [ESM]
const out = getStreamSomehow();
const err = getStreamSomehow();
const myConsole = new console.Console(out, err);

myConsole.log('hello world');
// Stampa: hello world, su out
myConsole.log('hello %s', 'world');
// Stampa: hello world, su out
myConsole.error(new Error('Whoops, something bad happened'));
// Stampa: [Error: Whoops, something bad happened], su err

const name = 'Will Robinson';
myConsole.warn(`Danger ${name}! Danger!`);
// Stampa: Danger Will Robinson! Danger!, su err
```

## Classe: `Console` {#class-console}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v8.0.0 | Gli errori che si verificano durante la scrittura nei flussi sottostanti saranno ora ignorati per impostazione predefinita. |
:::

La classe `Console` può essere utilizzata per creare un logger semplice con flussi di output configurabili e a cui è possibile accedere utilizzando `require('node:console').Console` o `console.Console` (o le loro controparti destrutturate):



::: code-group
```js [ESM]
import { Console } from 'node:console';
```

```js [CJS]
const { Console } = require('node:console');
```
:::

```js [ESM]
const { Console } = console;
```
### `new Console(stdout[, stderr][, ignoreErrors])` {#new-consolestdout-stderr-ignoreerrors}

### `new Console(options)` {#new-consoleoptions}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v14.2.0, v12.17.0 | È stata introdotta l'opzione `groupIndentation`. |
| v11.7.0 | È stata introdotta l'opzione `inspectOptions`. |
| v10.0.0 | Il costruttore `Console` ora supporta un argomento `options` ed è stata introdotta l'opzione `colorMode`. |
| v8.0.0 | È stata introdotta l'opzione `ignoreErrors`. |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `stdout` [\<stream.Writable\>](/it/nodejs/api/stream#class-streamwritable)
    - `stderr` [\<stream.Writable\>](/it/nodejs/api/stream#class-streamwritable)
    - `ignoreErrors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Ignora gli errori durante la scrittura nei flussi sottostanti. **Predefinito:** `true`.
    - `colorMode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Imposta il supporto del colore per questa istanza di `Console`. L'impostazione su `true` abilita la colorazione durante l'ispezione dei valori. L'impostazione su `false` disabilita la colorazione durante l'ispezione dei valori. L'impostazione su `'auto'` fa dipendere il supporto del colore dal valore della proprietà `isTTY` e dal valore restituito da `getColorDepth()` sul rispettivo flusso. Questa opzione non può essere utilizzata se è impostato anche `inspectOptions.colors`. **Predefinito:** `'auto'`.
    - `inspectOptions` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Specifica le opzioni che vengono passate a [`util.inspect()`](/it/nodejs/api/util#utilinspectobject-options).
    - `groupIndentation` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Imposta il rientro del gruppo. **Predefinito:** `2`.
  
 

Crea una nuova `Console` con una o due istanze di flusso scrivibili. `stdout` è un flusso scrivibile per stampare l'output di log o info. `stderr` viene utilizzato per l'output di avviso o errore. Se `stderr` non è fornito, `stdout` viene utilizzato per `stderr`.



::: code-group
```js [ESM]
import { createWriteStream } from 'node:fs';
import { Console } from 'node:console';
// Alternatively
// const { Console } = console;

const output = createWriteStream('./stdout.log');
const errorOutput = createWriteStream('./stderr.log');
// Custom simple logger
const logger = new Console({ stdout: output, stderr: errorOutput });
// use it like console
const count = 5;
logger.log('count: %d', count);
// In stdout.log: count 5
```

```js [CJS]
const fs = require('node:fs');
const { Console } = require('node:console');
// Alternatively
// const { Console } = console;

const output = fs.createWriteStream('./stdout.log');
const errorOutput = fs.createWriteStream('./stderr.log');
// Custom simple logger
const logger = new Console({ stdout: output, stderr: errorOutput });
// use it like console
const count = 5;
logger.log('count: %d', count);
// In stdout.log: count 5
```
:::

La `console` globale è una `Console` speciale il cui output viene inviato a [`process.stdout`](/it/nodejs/api/process#processstdout) e [`process.stderr`](/it/nodejs/api/process#processstderr). È equivalente a chiamare:

```js [ESM]
new Console({ stdout: process.stdout, stderr: process.stderr });
```

### `console.assert(value[, ...message])` {#consoleassertvalue-message}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.0.0 | L'implementazione è ora conforme alle specifiche e non genera più errori. |
| v0.1.101 | Aggiunto in: v0.1.101 |
:::

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Il valore testato per essere truthy.
- `...message` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Tutti gli argomenti oltre a `value` vengono utilizzati come messaggio di errore.

`console.assert()` scrive un messaggio se `value` è [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) o omesso. Scrive solo un messaggio e non influisce in altro modo sull'esecuzione. L'output inizia sempre con `"Assertion failed"`. Se fornito, `message` viene formattato utilizzando [`util.format()`](/it/nodejs/api/util#utilformatformat-args).

Se `value` è [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy), non accade nulla.

```js [ESM]
console.assert(true, 'non fa nulla');

console.assert(false, 'Ops %s non funziona', 'non');
// Assertion failed: Ops non funziona

console.assert();
// Assertion failed
```
### `console.clear()` {#consoleclear}

**Aggiunto in: v8.3.0**

Quando `stdout` è un TTY, la chiamata a `console.clear()` tenterà di cancellare il TTY. Quando `stdout` non è un TTY, questo metodo non fa nulla.

L'operazione specifica di `console.clear()` può variare tra sistemi operativi e tipi di terminale. Per la maggior parte dei sistemi operativi Linux, `console.clear()` funziona in modo simile al comando shell `clear`. Su Windows, `console.clear()` cancellerà solo l'output nella viewport del terminale corrente per il binario Node.js.

### `console.count([label])` {#consolecountlabel}

**Aggiunto in: v8.3.0**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'etichetta di visualizzazione per il contatore. **Predefinito:** `'default'`.

Mantiene un contatore interno specifico per `label` ed emette su `stdout` il numero di volte in cui `console.count()` è stato chiamato con il dato `label`.

```js [ESM]
> console.count()
default: 1
undefined
> console.count('default')
default: 2
undefined
> console.count('abc')
abc: 1
undefined
> console.count('xyz')
xyz: 1
undefined
> console.count('abc')
abc: 2
undefined
> console.count()
default: 3
undefined
>
```

### `console.countReset([label])` {#consolecountresetlabel}

**Aggiunto in: v8.3.0**

- `label` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'etichetta di visualizzazione per il contatore. **Predefinito:** `'default'`.

Ripristina il contatore interno specifico per `label`.

```js [ESM]
> console.count('abc');
abc: 1
undefined
> console.countReset('abc');
undefined
> console.count('abc');
abc: 1
undefined
>
```
### `console.debug(data[, ...args])` {#consoledebugdata-args}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v8.10.0 | `console.debug` è ora un alias per `console.log`. |
| v8.0.0 | Aggiunto in: v8.0.0 |
:::

- `data` [\<qualsiasi\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `...args` [\<qualsiasi\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

La funzione `console.debug()` è un alias per [`console.log()`](/it/nodejs/api/console#consolelogdata-args).

### `console.dir(obj[, options])` {#consoledirobj-options}

**Aggiunto in: v0.1.101**

- `obj` [\<qualsiasi\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `showHidden` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, verranno mostrate anche le proprietà non enumerabili e simboliche dell'oggetto. **Predefinito:** `false`.
    - `depth` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Indica a [`util.inspect()`](/it/nodejs/api/util#utilinspectobject-options) quante volte ricorrere durante la formattazione dell'oggetto. Questo è utile per ispezionare oggetti grandi e complicati. Per farlo ricorrere all'infinito, passa `null`. **Predefinito:** `2`.
    - `colors` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, l'output verrà stilizzato con codici colore ANSI. I colori sono personalizzabili; vedere [personalizzazione dei colori `util.inspect()` ](/it/nodejs/api/util#customizing-utilinspect-colors). **Predefinito:** `false`.
  
 

Utilizza [`util.inspect()`](/it/nodejs/api/util#utilinspectobject-options) su `obj` e stampa la stringa risultante su `stdout`. Questa funzione aggira qualsiasi funzione `inspect()` personalizzata definita su `obj`.


### `console.dirxml(...data)` {#consoledirxmldata}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v9.3.0 | `console.dirxml` ora chiama `console.log` per i suoi argomenti. |
| v8.0.0 | Aggiunto in: v8.0.0 |
:::

- `...data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Questo metodo chiama `console.log()` passandogli gli argomenti ricevuti. Questo metodo non produce alcuna formattazione XML.

### `console.error([data][, ...args])` {#consoleerrordata-args}

**Aggiunto in: v0.1.100**

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Stampa su `stderr` con una nuova riga. È possibile passare più argomenti, con il primo utilizzato come messaggio principale e tutti gli altri utilizzati come valori di sostituzione simili a [`printf(3)`](http://man7.org/linux/man-pages/man3/printf.3) (gli argomenti vengono tutti passati a [`util.format()`](/it/nodejs/api/util#utilformatformat-args)).

```js [ESM]
const code = 5;
console.error('errore #%d', code);
// Stampa: errore #5, su stderr
console.error('errore', code);
// Stampa: errore 5, su stderr
```
Se gli elementi di formattazione (ad es. `%d`) non vengono trovati nella prima stringa, allora viene chiamato [`util.inspect()`](/it/nodejs/api/util#utilinspectobject-options) su ogni argomento e i valori stringa risultanti vengono concatenati. Vedi [`util.format()`](/it/nodejs/api/util#utilformatformat-args) per maggiori informazioni.

### `console.group([...label])` {#consolegrouplabel}

**Aggiunto in: v8.5.0**

- `...label` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Aumenta l'indentazione delle righe successive di spazi per la lunghezza di `groupIndentation`.

Se vengono forniti uno o più `label`, questi vengono stampati prima senza l'indentazione aggiuntiva.

### `console.groupCollapsed()` {#consolegroupcollapsed}

**Aggiunto in: v8.5.0**

Un alias per [`console.group()`](/it/nodejs/api/console#consolegrouplabel).

### `console.groupEnd()` {#consolegroupend}

**Aggiunto in: v8.5.0**

Diminuisce l'indentazione delle righe successive di spazi per la lunghezza di `groupIndentation`.


### `console.info([data][, ...args])` {#consoleinfodata-args}

**Aggiunto in: v0.1.100**

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

La funzione `console.info()` è un alias per [`console.log()`](/it/nodejs/api/console#consolelogdata-args).

### `console.log([data][, ...args])` {#consolelogdata-args}

**Aggiunto in: v0.1.100**

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Stampa su `stdout` con un newline. Possono essere passati argomenti multipli, con il primo utilizzato come messaggio principale e tutti gli altri utilizzati come valori di sostituzione in modo simile a [`printf(3)`](http://man7.org/linux/man-pages/man3/printf.3) (gli argomenti sono tutti passati a [`util.format()`](/it/nodejs/api/util#utilformatformat-args)).

```js [ESM]
const count = 5;
console.log('count: %d', count);
// Prints: count: 5, to stdout
console.log('count:', count);
// Prints: count: 5, to stdout
```
Vedi [`util.format()`](/it/nodejs/api/util#utilformatformat-args) per maggiori informazioni.

### `console.table(tabularData[, properties])` {#consoletabletabulardata-properties}

**Aggiunto in: v10.0.0**

- `tabularData` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `properties` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Proprietà alternative per la costruzione della tabella.

Prova a costruire una tabella con le colonne delle proprietà di `tabularData` (o utilizza `properties`) e le righe di `tabularData` e la registra. Ricade semplicemente nella registrazione dell'argomento se non può essere analizzato come tabulare.

```js [ESM]
// Questi non possono essere analizzati come dati tabulari
console.table(Symbol());
// Symbol()

console.table(undefined);
// undefined

console.table([{ a: 1, b: 'Y' }, { a: 'Z', b: 2 }]);
// ┌─────────┬─────┬─────┐
// │ (index) │ a   │ b   │
// ├─────────┼─────┼─────┤
// │ 0       │ 1   │ 'Y' │
// │ 1       │ 'Z' │ 2   │
// └─────────┴─────┴─────┘

console.table([{ a: 1, b: 'Y' }, { a: 'Z', b: 2 }], ['a']);
// ┌─────────┬─────┐
// │ (index) │ a   │
// ├─────────┼─────┤
// │ 0       │ 1   │
// │ 1       │ 'Z' │
// └─────────┴─────┘
```

### `console.time([label])` {#consoletimelabel}

**Aggiunto in: v0.1.104**

- `label` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Predefinito:** `'default'`

Avvia un timer che può essere utilizzato per calcolare la durata di un'operazione. I timer sono identificati da una `label` univoca. Usa la stessa `label` quando chiami [`console.timeEnd()`](/it/nodejs/api/console#consoletimeendlabel) per fermare il timer e mostrare il tempo trascorso in unità di tempo adatte su `stdout`. Per esempio, se il tempo trascorso è 3869ms, `console.timeEnd()` mostrerà "3.869s".

### `console.timeEnd([label])` {#consoletimeendlabel}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v13.0.0 | Il tempo trascorso è mostrato con un'unità di tempo adatta. |
| v6.0.0 | Questo metodo non supporta più chiamate multiple che non corrispondono a singole chiamate `console.time()`; vedi sotto per i dettagli. |
| v0.1.104 | Aggiunto in: v0.1.104 |
:::

- `label` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Predefinito:** `'default'`

Ferma un timer che era stato precedentemente avviato chiamando [`console.time()`](/it/nodejs/api/console#consoletimelabel) e stampa il risultato su `stdout`:

```js [ESM]
console.time('un-sacco-di-cose');
// Fai un sacco di cose.
console.timeEnd('un-sacco-di-cose');
// Stampa: un-sacco-di-cose: 225.438ms
```
### `console.timeLog([label][, ...data])` {#consoletimeloglabel-data}

**Aggiunto in: v10.7.0**

- `label` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Predefinito:** `'default'`
- `...data` [\<qualunque\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Per un timer che era stato precedentemente avviato chiamando [`console.time()`](/it/nodejs/api/console#consoletimelabel), stampa il tempo trascorso e altri argomenti `data` su `stdout`:

```js [ESM]
console.time('processo');
const value = expensiveProcess1(); // Restituisce 42
console.timeLog('processo', value);
// Stampa "processo: 365.227ms 42".
doExpensiveProcess2(value);
console.timeEnd('processo');
```
### `console.trace([message][, ...args])` {#consoletracemessage-args}

**Aggiunto in: v0.1.104**

- `message` [\<qualunque\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `...args` [\<qualunque\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Stampa su `stderr` la stringa `'Trace: '`, seguita dal messaggio formattato con [`util.format()`](/it/nodejs/api/util#utilformatformat-args) e la stack trace alla posizione corrente nel codice.

```js [ESM]
console.trace('Mostrami');
// Stampa: (la stack trace varierà in base a dove trace è chiamato)
//  Trace: Mostrami
//    at repl:2:9
//    at REPLServer.defaultEval (repl.js:248:27)
//    at bound (domain.js:287:14)
//    at REPLServer.runBound [as eval] (domain.js:300:12)
//    at REPLServer.<anonymous> (repl.js:412:12)
//    at emitOne (events.js:82:20)
//    at REPLServer.emit (events.js:169:7)
//    at REPLServer.Interface._onLine (readline.js:210:10)
//    at REPLServer.Interface._line (readline.js:549:8)
//    at REPLServer.Interface._ttyWrite (readline.js:826:14)
```

### `console.warn([data][, ...args])` {#consolewarndata-args}

**Aggiunto in: v0.1.100**

- `data` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

La funzione `console.warn()` è un alias per [`console.error()`](/it/nodejs/api/console#consoleerrordata-args).

## Metodi solo per l'Inspector {#inspector-only-methods}

I seguenti metodi sono esposti dal motore V8 nell'API generale ma non mostrano nulla a meno che non vengano utilizzati in combinazione con l'[inspector](/it/nodejs/api/debugger) (flag `--inspect`).

### `console.profile([label])` {#consoleprofilelabel}

**Aggiunto in: v8.0.0**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Questo metodo non mostra nulla a meno che non venga utilizzato nell'inspector. Il metodo `console.profile()` avvia un profilo CPU JavaScript con un'etichetta opzionale fino a quando non viene chiamato [`console.profileEnd()`](/it/nodejs/api/console#consoleprofileendlabel). Il profilo viene quindi aggiunto al pannello **Profile** dell'inspector.

```js [ESM]
console.profile('MyLabel');
// Some code
console.profileEnd('MyLabel');
// Adds the profile 'MyLabel' to the Profiles panel of the inspector.
```
### `console.profileEnd([label])` {#consoleprofileendlabel}

**Aggiunto in: v8.0.0**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Questo metodo non mostra nulla a meno che non venga utilizzato nell'inspector. Interrompe la sessione di profilazione CPU JavaScript corrente, se ne è stata avviata una, e stampa il rapporto nel pannello **Profiles** dell'inspector. Vedi [`console.profile()`](/it/nodejs/api/console#consoleprofilelabel) per un esempio.

Se questo metodo viene chiamato senza un'etichetta, viene interrotto il profilo avviato più recentemente.

### `console.timeStamp([label])` {#consoletimestamplabel}

**Aggiunto in: v8.0.0**

- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Questo metodo non mostra nulla a meno che non venga utilizzato nell'inspector. Il metodo `console.timeStamp()` aggiunge un evento con l'etichetta `'label'` al pannello **Timeline** dell'inspector.

