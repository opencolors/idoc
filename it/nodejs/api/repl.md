---
title: Documentazione REPL di Node.js
description: Esplora il REPL di Node.js (Read-Eval-Print Loop) che offre un ambiente interattivo per eseguire codice JavaScript, debug e testare applicazioni Node.js.
head:
  - - meta
    - name: og:title
      content: Documentazione REPL di Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Esplora il REPL di Node.js (Read-Eval-Print Loop) che offre un ambiente interattivo per eseguire codice JavaScript, debug e testare applicazioni Node.js.
  - - meta
    - name: twitter:title
      content: Documentazione REPL di Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Esplora il REPL di Node.js (Read-Eval-Print Loop) che offre un ambiente interattivo per eseguire codice JavaScript, debug e testare applicazioni Node.js.
---


# REPL {#repl}

::: tip [Stable: 2 - Stabile]
[Stable: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile
:::

**Codice sorgente:** [lib/repl.js](https://github.com/nodejs/node/blob/v23.5.0/lib/repl.js)

Il modulo `node:repl` fornisce un'implementazione Read-Eval-Print-Loop (REPL) che è disponibile sia come programma autonomo sia includibile in altre applicazioni. È possibile accedervi utilizzando:



::: code-group
```js [ESM]
import repl from 'node:repl';
```

```js [CJS]
const repl = require('node:repl');
```
:::

## Progettazione e funzionalità {#design-and-features}

Il modulo `node:repl` esporta la classe [`repl.REPLServer`](/it/nodejs/api/repl#class-replserver). Durante l'esecuzione, le istanze di [`repl.REPLServer`](/it/nodejs/api/repl#class-replserver) accetteranno singole righe di input dell'utente, le valuteranno in base a una funzione di valutazione definita dall'utente, quindi emetteranno il risultato. L'input e l'output possono provenire rispettivamente da `stdin` e `stdout`, oppure possono essere collegati a qualsiasi [stream](/it/nodejs/api/stream) di Node.js.

Le istanze di [`repl.REPLServer`](/it/nodejs/api/repl#class-replserver) supportano il completamento automatico degli input, l'anteprima del completamento, la modifica della riga in stile Emacs semplificata, gli input multi-linea, la ricerca inversa simile a [ZSH](https://en.wikipedia.org/wiki/Z_shell), la ricerca della cronologia basata su sottostringa simile a [ZSH](https://en.wikipedia.org/wiki/Z_shell), l'output con stile ANSI, il salvataggio e il ripristino dello stato corrente della sessione REPL, il ripristino degli errori e le funzioni di valutazione personalizzabili. I terminali che non supportano gli stili ANSI e la modifica della riga in stile Emacs tornano automaticamente a un set di funzionalità limitato.

### Comandi e tasti speciali {#commands-and-special-keys}

I seguenti comandi speciali sono supportati da tutte le istanze REPL:

- `.break`: Quando si è nel processo di immissione di un'espressione multi-linea, inserire il comando `.break` (o premere +) per interrompere l'ulteriore input o elaborazione di tale espressione.
- `.clear`: Reimposta il `context` REPL su un oggetto vuoto e cancella qualsiasi espressione multi-linea in fase di immissione.
- `.exit`: Chiude lo stream I/O, causando l'uscita dal REPL.
- `.help`: Mostra questo elenco di comandi speciali.
- `.save`: Salva la sessione REPL corrente in un file: `\> .save ./file/to/save.js`
- `.load`: Carica un file nella sessione REPL corrente. `\> .load ./file/to/load.js`
- `.editor`: Entra in modalità editor (+ per finire, + per annullare).

```bash [BASH]
> .editor
// Entering editor mode (^D to finish, ^C to cancel)
function welcome(name) {
  return `Hello ${name}!`;
}

welcome('Node.js User');

// ^D
'Hello Node.js User!'
>
```
Le seguenti combinazioni di tasti nel REPL hanno questi effetti speciali:

- +: Quando premuto una volta, ha lo stesso effetto del comando `.break`. Quando premuto due volte su una riga vuota, ha lo stesso effetto del comando `.exit`.
- +: Ha lo stesso effetto del comando `.exit`.
- : Quando premuto su una riga vuota, mostra le variabili globali e locali (ambito). Quando premuto durante l'immissione di altro input, mostra le opzioni di completamento automatico pertinenti.

Per i tasti di scelta rapida relativi alla ricerca inversa, vedere [`reverse-i-search`](/it/nodejs/api/repl#reverse-i-search). Per tutti gli altri tasti di scelta rapida, vedere [Tasti di scelta rapida TTY](/it/nodejs/api/readline#tty-keybindings).


### Valutazione predefinita {#default-evaluation}

Di default, tutte le istanze di [`repl.REPLServer`](/it/nodejs/api/repl#class-replserver) utilizzano una funzione di valutazione che valuta le espressioni JavaScript e fornisce accesso ai moduli integrati di Node.js. Questo comportamento predefinito può essere sovrascritto passando una funzione di valutazione alternativa quando viene creata l'istanza di [`repl.REPLServer`](/it/nodejs/api/repl#class-replserver).

#### Espressioni JavaScript {#javascript-expressions}

L'evaluator predefinito supporta la valutazione diretta delle espressioni JavaScript:

```bash [BASH]
> 1 + 1
2
> const m = 2
undefined
> m + 1
3
```
A meno che non siano diversamente definite all'interno di blocchi o funzioni, le variabili dichiarate implicitamente o utilizzando le parole chiave `const`, `let` o `var` vengono dichiarate nell'ambito globale.

#### Ambito globale e locale {#global-and-local-scope}

L'evaluator predefinito fornisce accesso a tutte le variabili esistenti nell'ambito globale. È possibile esporre esplicitamente una variabile al REPL assegnandola all'oggetto `context` associato a ciascun `REPLServer`:



::: code-group
```js [ESM]
import repl from 'node:repl';
const msg = 'message';

repl.start('> ').context.m = msg;
```

```js [CJS]
const repl = require('node:repl');
const msg = 'message';

repl.start('> ').context.m = msg;
```
:::

Le proprietà nell'oggetto `context` appaiono come locali all'interno del REPL:

```bash [BASH]
$ node repl_test.js
> m
'message'
```
Le proprietà del contesto non sono di sola lettura per impostazione predefinita. Per specificare globali di sola lettura, le proprietà del contesto devono essere definite utilizzando `Object.defineProperty()`:



::: code-group
```js [ESM]
import repl from 'node:repl';
const msg = 'message';

const r = repl.start('> ');
Object.defineProperty(r.context, 'm', {
  configurable: false,
  enumerable: true,
  value: msg,
});
```

```js [CJS]
const repl = require('node:repl');
const msg = 'message';

const r = repl.start('> ');
Object.defineProperty(r.context, 'm', {
  configurable: false,
  enumerable: true,
  value: msg,
});
```
:::

#### Accesso ai moduli core di Node.js {#accessing-core-nodejs-modules}

L'evaluator predefinito caricherà automaticamente i moduli core di Node.js nell'ambiente REPL quando vengono utilizzati. Ad esempio, a meno che non sia dichiarato diversamente come variabile globale o con ambito, l'input `fs` verrà valutato su richiesta come `global.fs = require('node:fs')`.

```bash [BASH]
> fs.createReadStream('./some/file');
```

#### Eccezioni globali non gestite {#global-uncaught-exceptions}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v12.3.0 | L'evento `'uncaughtException'` viene ora attivato se il REPL viene utilizzato come programma autonomo. |
:::

Il REPL utilizza il modulo [`domain`](/it/nodejs/api/domain) per intercettare tutte le eccezioni non gestite per quella sessione REPL.

Questo utilizzo del modulo [`domain`](/it/nodejs/api/domain) nel REPL ha i seguenti effetti collaterali:

- Le eccezioni non gestite emettono solo l'evento [`'uncaughtException'`](/it/nodejs/api/process#event-uncaughtexception) nel REPL autonomo. Aggiungere un listener per questo evento in un REPL all'interno di un altro programma Node.js genera [`ERR_INVALID_REPL_INPUT`](/it/nodejs/api/errors#err_invalid_repl_input).
- Tentare di utilizzare [`process.setUncaughtExceptionCaptureCallback()`](/it/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn) genera un errore [`ERR_DOMAIN_CANNOT_SET_UNCAUGHT_EXCEPTION_CAPTURE`](/it/nodejs/api/errors#err_domain_cannot-set-uncaught-exception-capture).

#### Assegnazione della variabile `_` (underscore) {#assignment-of-the-_-underscore-variable}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v9.8.0 | Aggiunto il supporto `_error`. |
:::

L'evaluator predefinito, di default, assegnerà il risultato dell'espressione valutata più di recente alla variabile speciale `_` (underscore). Impostare esplicitamente `_` su un valore disabiliterà questo comportamento.

```bash [BASH]
> [ 'a', 'b', 'c' ]
[ 'a', 'b', 'c' ]
> _.length
3
> _ += 1
Expression assignment to _ now disabled.
4
> 1 + 1
2
> _
4
```
Allo stesso modo, `_error` farà riferimento all'ultimo errore rilevato, se presente. Impostare esplicitamente `_error` su un valore disabiliterà questo comportamento.

```bash [BASH]
> throw new Error('foo');
Uncaught Error: foo
> _error.message
'foo'
```
#### Parola chiave `await` {#await-keyword}

Il supporto per la parola chiave `await` è abilitato al livello superiore.

```bash [BASH]
> await Promise.resolve(123)
123
> await Promise.reject(new Error('REPL await'))
Uncaught Error: REPL await
    at REPL2:1:54
> const timeout = util.promisify(setTimeout);
undefined
> const old = Date.now(); await timeout(1000); console.log(Date.now() - old);
1002
undefined
```
Una limitazione nota dell'utilizzo della parola chiave `await` nel REPL è che invaliderà lo scoping lessicale delle parole chiave `const` e `let`.

Per esempio:

```bash [BASH]
> const m = await Promise.resolve(123)
undefined
> m
123
> const m = await Promise.resolve(234)
undefined
> m
234
```
[`--no-experimental-repl-await`](/it/nodejs/api/cli#--no-experimental-repl-await) disabiliterà l'await di livello superiore nel REPL.


### Reverse-i-search {#reverse-i-search}

**Aggiunto in: v13.6.0, v12.17.0**

Il REPL supporta la reverse-i-search bidirezionale simile a [ZSH](https://en.wikipedia.org/wiki/Z_shell). Viene attivata con + per cercare indietro e + per cercare avanti.

Le voci di cronologia duplicate verranno saltate.

Le voci vengono accettate non appena viene premuto un tasto che non corrisponde alla ricerca inversa. L'annullamento è possibile premendo  o +.

Cambiare direzione cerca immediatamente la voce successiva nella direzione prevista dalla posizione corrente.

### Funzioni di valutazione personalizzate {#custom-evaluation-functions}

Quando viene creato un nuovo [`repl.REPLServer`](/it/nodejs/api/repl#class-replserver), è possibile fornire una funzione di valutazione personalizzata. Questa può essere usata, ad esempio, per implementare applicazioni REPL completamente personalizzate.

Il seguente illustra un esempio di un REPL che eleva al quadrato un dato numero:

::: code-group
```js [ESM]
import repl from 'node:repl';

function byThePowerOfTwo(number) {
  return number * number;
}

function myEval(cmd, context, filename, callback) {
  callback(null, byThePowerOfTwo(cmd));
}

repl.start({ prompt: 'Inserisci un numero: ', eval: myEval });
```

```js [CJS]
const repl = require('node:repl');

function byThePowerOfTwo(number) {
  return number * number;
}

function myEval(cmd, context, filename, callback) {
  callback(null, byThePowerOfTwo(cmd));
}

repl.start({ prompt: 'Inserisci un numero: ', eval: myEval });
```
:::

#### Errori recuperabili {#recoverable-errors}

Al prompt REPL, premendo  viene inviata la riga di input corrente alla funzione `eval`. Per supportare l'input multi-riga, la funzione `eval` può restituire un'istanza di `repl.Recoverable` alla funzione di callback fornita:

```js [ESM]
function myEval(cmd, context, filename, callback) {
  let result;
  try {
    result = vm.runInThisContext(cmd);
  } catch (e) {
    if (isRecoverableError(e)) {
      return callback(new repl.Recoverable(e));
    }
  }
  callback(null, result);
}

function isRecoverableError(error) {
  if (error.name === 'SyntaxError') {
    return /^(Unexpected end of input|Unexpected token)/.test(error.message);
  }
  return false;
}
```

### Personalizzazione dell'output della REPL {#customizing-repl-output}

Per impostazione predefinita, le istanze di [`repl.REPLServer`](/it/nodejs/api/repl#class-replserver) formattano l'output utilizzando il metodo [`util.inspect()`](/it/nodejs/api/util#utilinspectobject-options) prima di scrivere l'output nel flusso `Writable` fornito (predefinito `process.stdout`). L'opzione di ispezione `showProxy` è impostata su true per impostazione predefinita e l'opzione `colors` è impostata su true a seconda dell'opzione `useColors` della REPL.

L'opzione booleana `useColors` può essere specificata in fase di costruzione per indicare al writer predefinito di utilizzare i codici di stile ANSI per colorare l'output dal metodo `util.inspect()`.

Se la REPL viene eseguita come programma standalone, è anche possibile modificare le [impostazioni predefinite di ispezione](/it/nodejs/api/util#utilinspectobject-options) della REPL dall'interno della REPL utilizzando la proprietà `inspect.replDefaults` che rispecchia le `defaultOptions` da [`util.inspect()`](/it/nodejs/api/util#utilinspectobject-options).

```bash [BASH]
> util.inspect.replDefaults.compact = false;
false
> [1]
[
  1
]
>
```
Per personalizzare completamente l'output di un'istanza di [`repl.REPLServer`](/it/nodejs/api/repl#class-replserver), passa una nuova funzione per l'opzione `writer` in fase di costruzione. L'esempio seguente, ad esempio, converte semplicemente qualsiasi testo di input in maiuscolo:

::: code-group
```js [ESM]
import repl from 'node:repl';

const r = repl.start({ prompt: '> ', eval: myEval, writer: myWriter });

function myEval(cmd, context, filename, callback) {
  callback(null, cmd);
}

function myWriter(output) {
  return output.toUpperCase();
}
```

```js [CJS]
const repl = require('node:repl');

const r = repl.start({ prompt: '> ', eval: myEval, writer: myWriter });

function myEval(cmd, context, filename, callback) {
  callback(null, cmd);
}

function myWriter(output) {
  return output.toUpperCase();
}
```
:::

## Classe: `REPLServer` {#class-replserver}

**Aggiunto in: v0.1.91**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Vedi [`repl.start()`](/it/nodejs/api/repl#replstartoptions)
- Estende: [\<readline.Interface\>](/it/nodejs/api/readline#class-readlineinterface)

Le istanze di `repl.REPLServer` vengono create utilizzando il metodo [`repl.start()`](/it/nodejs/api/repl#replstartoptions) o direttamente utilizzando la parola chiave JavaScript `new`.

::: code-group
```js [ESM]
import repl from 'node:repl';

const options = { useColors: true };

const firstInstance = repl.start(options);
const secondInstance = new repl.REPLServer(options);
```

```js [CJS]
const repl = require('node:repl');

const options = { useColors: true };

const firstInstance = repl.start(options);
const secondInstance = new repl.REPLServer(options);
```
:::


### Evento: `'exit'` {#event-exit}

**Aggiunto in: v0.7.7**

L'evento `'exit'` viene emesso quando si esce dal REPL ricevendo il comando `.exit` come input, quando l'utente preme + due volte per segnalare `SIGINT`, o premendo + per segnalare `'end'` sullo stream di input. La callback del listener viene invocata senza argomenti.

```js [ESM]
replServer.on('exit', () => {
  console.log('Ricevuto evento "exit" dal repl!');
  process.exit();
});
```
### Evento: `'reset'` {#event-reset}

**Aggiunto in: v0.11.0**

L'evento `'reset'` viene emesso quando il contesto del REPL viene resettato. Questo accade ogni volta che il comando `.clear` viene ricevuto come input *a meno che* il REPL non stia usando l'evaluatore predefinito e l'istanza `repl.REPLServer` sia stata creata con l'opzione `useGlobal` impostata su `true`. La callback del listener verrà chiamata con un riferimento all'oggetto `context` come unico argomento.

Questo può essere usato principalmente per reinizializzare il contesto REPL a uno stato predefinito:

::: code-group
```js [ESM]
import repl from 'node:repl';

function initializeContext(context) {
  context.m = 'test';
}

const r = repl.start({ prompt: '> ' });
initializeContext(r.context);

r.on('reset', initializeContext);
```

```js [CJS]
const repl = require('node:repl');

function initializeContext(context) {
  context.m = 'test';
}

const r = repl.start({ prompt: '> ' });
initializeContext(r.context);

r.on('reset', initializeContext);
```
:::

Quando questo codice viene eseguito, la variabile globale `'m'` può essere modificata ma poi resettata al suo valore iniziale usando il comando `.clear`:

```bash [BASH]
$ ./node example.js
> m
'test'
> m = 1
1
> m
1
> .clear
Clearing context...
> m
'test'
>
```
### `replServer.defineCommand(keyword, cmd)` {#replserverdefinecommandkeyword-cmd}

**Aggiunto in: v0.3.0**

- `keyword` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La parola chiave del comando (*senza* un carattere `.` iniziale).
- `cmd` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La funzione da invocare quando il comando viene elaborato.

Il metodo `replServer.defineCommand()` viene utilizzato per aggiungere nuovi comandi con prefisso `.` all'istanza REPL. Tali comandi vengono invocati digitando un `.` seguito dalla `keyword`. Il `cmd` è una `Function` o un `Object` con le seguenti proprietà:

- `help` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Testo di aiuto da visualizzare quando viene inserito `.help` (Opzionale).
- `action` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La funzione da eseguire, accettando opzionalmente un singolo argomento stringa.

L'esempio seguente mostra due nuovi comandi aggiunti all'istanza REPL:

::: code-group
```js [ESM]
import repl from 'node:repl';

const replServer = repl.start({ prompt: '> ' });
replServer.defineCommand('sayhello', {
  help: 'Say hello',
  action(name) {
    this.clearBufferedCommand();
    console.log(`Hello, ${name}!`);
    this.displayPrompt();
  },
});
replServer.defineCommand('saybye', function saybye() {
  console.log('Goodbye!');
  this.close();
});
```

```js [CJS]
const repl = require('node:repl');

const replServer = repl.start({ prompt: '> ' });
replServer.defineCommand('sayhello', {
  help: 'Say hello',
  action(name) {
    this.clearBufferedCommand();
    console.log(`Hello, ${name}!`);
    this.displayPrompt();
  },
});
replServer.defineCommand('saybye', function saybye() {
  console.log('Goodbye!');
  this.close();
});
```
:::

I nuovi comandi possono quindi essere utilizzati all'interno dell'istanza REPL:

```bash [BASH]
> .sayhello Node.js User
Hello, Node.js User!
> .saybye
Goodbye!
```

### `replServer.displayPrompt([preserveCursor])` {#replserverdisplaypromptpreservecursor}

**Aggiunto in: v0.1.91**

- `preserveCursor` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Il metodo `replServer.displayPrompt()` prepara l'istanza REPL per l'input dell'utente, stampando il `prompt` configurato su una nuova riga nell'`output` e riprendendo l'`input` per accettare nuovi input.

Quando viene inserito un input multilinea, viene stampata un'ellissi anziché il 'prompt'.

Quando `preserveCursor` è `true`, il posizionamento del cursore non verrà reimpostato a `0`.

Il metodo `replServer.displayPrompt` è principalmente destinato a essere chiamato dall'interno della funzione di azione per i comandi registrati utilizzando il metodo `replServer.defineCommand()`.

### `replServer.clearBufferedCommand()` {#replserverclearbufferedcommand}

**Aggiunto in: v9.0.0**

Il metodo `replServer.clearBufferedCommand()` cancella qualsiasi comando che è stato memorizzato nel buffer ma non ancora eseguito. Questo metodo è principalmente destinato a essere chiamato dall'interno della funzione di azione per i comandi registrati utilizzando il metodo `replServer.defineCommand()`.

### `replServer.setupHistory(historyPath, callback)` {#replserversetuphistoryhistorypath-callback}

**Aggiunto in: v11.10.0**

- `historyPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) il percorso del file di cronologia
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) chiamata quando le scritture della cronologia sono pronte o in caso di errore
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `repl` [\<repl.REPLServer\>](/it/nodejs/api/repl#class-replserver)

Inizializza un file di log della cronologia per l'istanza REPL. Quando si esegue il binario di Node.js e si utilizza il REPL da riga di comando, un file di cronologia viene inizializzato per impostazione predefinita. Tuttavia, questo non è il caso quando si crea un REPL programmaticamente. Usa questo metodo per inizializzare un file di log della cronologia quando si lavora con istanze REPL programmaticamente.

## `repl.builtinModules` {#replbuiltinmodules}

**Aggiunto in: v14.5.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Un elenco dei nomi di tutti i moduli Node.js, ad esempio `'http'`.


## `repl.start([options])` {#replstartoptions}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v13.4.0, v12.17.0 | L'opzione `preview` è ora disponibile. |
| v12.0.0 | L'opzione `terminal` ora segue la descrizione predefinita in tutti i casi e `useColors` verifica `hasColors()` se disponibile. |
| v10.0.0 | La `replMode` `REPL_MAGIC_MODE` è stata rimossa. |
| v6.3.0 | L'opzione `breakEvalOnSigint` è ora supportata. |
| v5.8.0 | Il parametro `options` è ora opzionale. |
| v0.1.91 | Aggiunto in: v0.1.91 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `prompt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il prompt di input da visualizzare. **Predefinito:** `'\> '` (con uno spazio finale).
    - `input` [\<stream.Readable\>](/it/nodejs/api/stream#class-streamreadable) Lo stream `Readable` da cui verrà letto l'input REPL. **Predefinito:** `process.stdin`.
    - `output` [\<stream.Writable\>](/it/nodejs/api/stream#class-streamwritable) Lo stream `Writable` su cui verrà scritto l'output REPL. **Predefinito:** `process.stdout`.
    - `terminal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, specifica che l'`output` deve essere trattato come un terminale TTY. **Predefinito:** controlla il valore della proprietà `isTTY` sullo stream `output` al momento dell'instanziazione.
    - `eval` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La funzione da utilizzare durante la valutazione di ogni riga di input fornita. **Predefinito:** un wrapper async per la funzione JavaScript `eval()`. Una funzione `eval` può generare un errore con `repl.Recoverable` per indicare che l'input era incompleto e richiedere ulteriori righe.
    - `useColors` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, specifica che la funzione `writer` predefinita deve includere lo stile del colore ANSI nell'output REPL. Se viene fornita una funzione `writer` personalizzata, questo non ha alcun effetto. **Predefinito:** verifica il supporto del colore sullo stream `output` se il valore `terminal` dell'istanza REPL è `true`.
    - `useGlobal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, specifica che la funzione di valutazione predefinita utilizzerà il `global` JavaScript come contesto anziché creare un nuovo contesto separato per l'istanza REPL. Il REPL della CLI node imposta questo valore su `true`. **Predefinito:** `false`.
    - `ignoreUndefined` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, specifica che il writer predefinito non emetterà il valore restituito di un comando se restituisce `undefined`. **Predefinito:** `false`.
    - `writer` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La funzione da invocare per formattare l'output di ogni comando prima di scrivere su `output`. **Predefinito:** [`util.inspect()`](/it/nodejs/api/util#utilinspectobject-options).
    - `completer` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una funzione opzionale utilizzata per il completamento automatico personalizzato con Tab. Vedi [`readline.InterfaceCompleter`](/it/nodejs/api/readline#use-of-the-completer-function) per un esempio.
    - `replMode` [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) Un flag che specifica se il valutatore predefinito esegue tutti i comandi JavaScript in modalità strict o in modalità predefinita (sloppy). I valori accettabili sono:
    - `repl.REPL_MODE_SLOPPY` per valutare le espressioni in modalità sloppy.
    - `repl.REPL_MODE_STRICT` per valutare le espressioni in modalità strict. Questo è equivalente ad anteporre ogni istruzione repl con `'use strict'`.
 
    - `breakEvalOnSigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Interrompe la valutazione del codice corrente quando viene ricevuto `SIGINT`, ad esempio quando si preme +. Questo non può essere utilizzato insieme a una funzione `eval` personalizzata. **Predefinito:** `false`.
    - `preview` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Definisce se il REPL stampa l'autocompletamento e le anteprime dell'output o meno. **Predefinito:** `true` con la funzione eval predefinita e `false` nel caso in cui venga utilizzata una funzione eval personalizzata. Se `terminal` è falsy, non ci sono anteprime e il valore di `preview` non ha alcun effetto.
 
- Restituisce: [\<repl.REPLServer\>](/it/nodejs/api/repl#class-replserver)

Il metodo `repl.start()` crea e avvia un'istanza di [`repl.REPLServer`](/it/nodejs/api/repl#class-replserver).

Se `options` è una stringa, specifica il prompt di input:

::: code-group
```js [ESM]
import repl from 'node:repl';

// a Unix style prompt
repl.start('$ ');
```

```js [CJS]
const repl = require('node:repl');

// a Unix style prompt
repl.start('$ ');
```
:::


## Il REPL di Node.js {#the-nodejs-repl}

Node.js stesso utilizza il modulo `node:repl` per fornire la propria interfaccia interattiva per l'esecuzione di JavaScript. Questa può essere utilizzata eseguendo il binario di Node.js senza passare argomenti (o passando l'argomento `-i`):

```bash [BASH]
$ node
> const a = [1, 2, 3];
undefined
> a
[ 1, 2, 3 ]
> a.forEach((v) => {
...   console.log(v);
...   });
1
2
3
```
### Opzioni delle variabili d'ambiente {#environment-variable-options}

Vari comportamenti del REPL di Node.js possono essere personalizzati utilizzando le seguenti variabili d'ambiente:

- `NODE_REPL_HISTORY`: Quando viene fornito un percorso valido, la cronologia persistente del REPL verrà salvata nel file specificato anziché in `.node_repl_history` nella directory home dell'utente. Impostare questo valore su `''` (una stringa vuota) disabiliterà la cronologia persistente del REPL. Gli spazi bianchi verranno rimossi dal valore. Sulle piattaforme Windows, le variabili d'ambiente con valori vuoti non sono valide, quindi imposta questa variabile su uno o più spazi per disabilitare la cronologia persistente del REPL.
- `NODE_REPL_HISTORY_SIZE`: Controlla quante righe di cronologia verranno mantenute se la cronologia è disponibile. Deve essere un numero positivo. **Predefinito:** `1000`.
- `NODE_REPL_MODE`: Può essere `'sloppy'` o `'strict'`. **Predefinito:** `'sloppy'`, che consentirà l'esecuzione di codice in modalità non strict.

### Cronologia persistente {#persistent-history}

Per impostazione predefinita, il REPL di Node.js manterrà la cronologia tra le sessioni REPL di `node` salvando gli input in un file `.node_repl_history` situato nella directory home dell'utente. Questo può essere disabilitato impostando la variabile d'ambiente `NODE_REPL_HISTORY=''`.

### Utilizzo del REPL di Node.js con editor di riga avanzati {#using-the-nodejs-repl-with-advanced-line-editors}

Per editor di riga avanzati, avvia Node.js con la variabile d'ambiente `NODE_NO_READLINE=1`. Questo avvierà il REPL principale e il debugger con le impostazioni canoniche del terminale, il che consentirà l'utilizzo con `rlwrap`.

Ad esempio, quanto segue può essere aggiunto a un file `.bashrc`:

```bash [BASH]
alias node="env NODE_NO_READLINE=1 rlwrap node"
```
### Avvio di più istanze REPL su una singola istanza in esecuzione {#starting-multiple-repl-instances-against-a-single-running-instance}

È possibile creare ed eseguire più istanze REPL su una singola istanza in esecuzione di Node.js che condividono un singolo oggetto `global` ma hanno interfacce I/O separate.

L'esempio seguente, ad esempio, fornisce REPL separati su `stdin`, un socket Unix e un socket TCP:

::: code-group
```js [ESM]
import net from 'node:net';
import repl from 'node:repl';
import process from 'node:process';

let connections = 0;

repl.start({
  prompt: 'Node.js via stdin> ',
  input: process.stdin,
  output: process.stdout,
});

net.createServer((socket) => {
  connections += 1;
  repl.start({
    prompt: 'Node.js via Unix socket> ',
    input: socket,
    output: socket,
  }).on('exit', () => {
    socket.end();
  });
}).listen('/tmp/node-repl-sock');

net.createServer((socket) => {
  connections += 1;
  repl.start({
    prompt: 'Node.js via TCP socket> ',
    input: socket,
    output: socket,
  }).on('exit', () => {
    socket.end();
  });
}).listen(5001);
```

```js [CJS]
const net = require('node:net');
const repl = require('node:repl');
let connections = 0;

repl.start({
  prompt: 'Node.js via stdin> ',
  input: process.stdin,
  output: process.stdout,
});

net.createServer((socket) => {
  connections += 1;
  repl.start({
    prompt: 'Node.js via Unix socket> ',
    input: socket,
    output: socket,
  }).on('exit', () => {
    socket.end();
  });
}).listen('/tmp/node-repl-sock');

net.createServer((socket) => {
  connections += 1;
  repl.start({
    prompt: 'Node.js via TCP socket> ',
    input: socket,
    output: socket,
  }).on('exit', () => {
    socket.end();
  });
}).listen(5001);
```
:::

Eseguire questa applicazione dalla riga di comando avvierà un REPL su stdin. Altri client REPL possono connettersi tramite il socket Unix o il socket TCP. `telnet`, ad esempio, è utile per connettersi ai socket TCP, mentre `socat` può essere utilizzato per connettersi sia ai socket Unix che TCP.

Avviando un REPL da un server basato su socket Unix anziché da stdin, è possibile connettersi a un processo Node.js a lunga esecuzione senza riavviarlo.

Per un esempio di esecuzione di un REPL "completo" (`terminal`) su un'istanza `net.Server` e `net.Socket`, vedi: [https://gist.github.com/TooTallNate/2209310](https://gist.github.com/TooTallNate/2209310).

Per un esempio di esecuzione di un'istanza REPL su [`curl(1)`](https://curl.haxx.se/docs/manpage), vedi: [https://gist.github.com/TooTallNate/2053342](https://gist.github.com/TooTallNate/2053342).

Questo esempio è inteso esclusivamente a scopo didattico per dimostrare come i REPL di Node.js possono essere avviati utilizzando diversi flussi I/O. Non dovrebbe **non** essere utilizzato in ambienti di produzione o in qualsiasi contesto in cui la sicurezza è una preoccupazione senza ulteriori misure protettive. Se devi implementare REPL in un'applicazione reale, considera approcci alternativi che mitighino questi rischi, come l'utilizzo di meccanismi di input sicuri ed evitando interfacce di rete aperte.

