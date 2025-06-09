---
title: Documentazione Node.js - Readline
description: Il modulo readline di Node.js fornisce un'interfaccia per leggere dati da un flusso leggibile (come process.stdin) una riga alla volta. Supporta la creazione di interfacce per leggere input dalla console, gestire l'input dell'utente e gestire operazioni riga per riga.
head:
  - - meta
    - name: og:title
      content: Documentazione Node.js - Readline | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Il modulo readline di Node.js fornisce un'interfaccia per leggere dati da un flusso leggibile (come process.stdin) una riga alla volta. Supporta la creazione di interfacce per leggere input dalla console, gestire l'input dell'utente e gestire operazioni riga per riga.
  - - meta
    - name: twitter:title
      content: Documentazione Node.js - Readline | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Il modulo readline di Node.js fornisce un'interfaccia per leggere dati da un flusso leggibile (come process.stdin) una riga alla volta. Supporta la creazione di interfacce per leggere input dalla console, gestire l'input dell'utente e gestire operazioni riga per riga.
---


# Readline {#readline}

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile
:::

**Codice sorgente:** [lib/readline.js](https://github.com/nodejs/node/blob/v23.5.0/lib/readline.js)

Il modulo `node:readline` fornisce un'interfaccia per leggere i dati da uno stream [Readable](/it/nodejs/api/stream#readable-streams) (come [`process.stdin`](/it/nodejs/api/process#processstdin)) una riga alla volta.

Per utilizzare le API basate su promise:

::: code-group
```js [ESM]
import * as readline from 'node:readline/promises';
```

```js [CJS]
const readline = require('node:readline/promises');
```
:::

Per utilizzare le API di callback e sync:

::: code-group
```js [ESM]
import * as readline from 'node:readline';
```

```js [CJS]
const readline = require('node:readline');
```
:::

Il seguente semplice esempio illustra l'uso base del modulo `node:readline`.

::: code-group
```js [ESM]
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const rl = readline.createInterface({ input, output });

const answer = await rl.question('Cosa ne pensi di Node.js? ');

console.log(`Grazie per il tuo prezioso feedback: ${answer}`);

rl.close();
```

```js [CJS]
const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');

const rl = readline.createInterface({ input, output });

rl.question('Cosa ne pensi di Node.js? ', (answer) => {
  // TODO: Registra la risposta in un database
  console.log(`Grazie per il tuo prezioso feedback: ${answer}`);

  rl.close();
});
```
:::

Una volta invocato questo codice, l'applicazione Node.js non terminerà finché `readline.Interface` non viene chiuso perché l'interfaccia attende che i dati vengano ricevuti sullo stream `input`.

## Classe: `InterfaceConstructor` {#class-interfaceconstructor}

**Aggiunto in: v0.1.104**

- Estende: [\<EventEmitter\>](/it/nodejs/api/events#class-eventemitter)

Le istanze della classe `InterfaceConstructor` vengono costruite usando il metodo `readlinePromises.createInterface()` o `readline.createInterface()`. Ogni istanza è associata a un singolo stream `input` [Readable](/it/nodejs/api/stream#readable-streams) e a un singolo stream `output` [Writable](/it/nodejs/api/stream#writable-streams). Lo stream `output` viene utilizzato per stampare i prompt per l'input dell'utente che arriva e viene letto dallo stream `input`.


### Evento: `'close'` {#event-close}

**Aggiunto in: v0.1.98**

L'evento `'close'` viene emesso quando si verifica uno dei seguenti casi:

- Il metodo `rl.close()` viene chiamato e l'istanza `InterfaceConstructor` ha rinunciato al controllo sui flussi `input` e `output`;
- Il flusso `input` riceve il suo evento `'end'`;
- Il flusso `input` riceve + per segnalare la fine della trasmissione (EOT);
- Il flusso `input` riceve + per segnalare `SIGINT` e non è registrato alcun listener di eventi `'SIGINT'` sull'istanza `InterfaceConstructor`.

La funzione di listener viene chiamata senza passare alcun argomento.

L'istanza `InterfaceConstructor` termina una volta emesso l'evento `'close'`.

### Evento: `'line'` {#event-line}

**Aggiunto in: v0.1.98**

L'evento `'line'` viene emesso ogni volta che il flusso `input` riceve un input di fine riga (`\n`, `\r` o `\r\n`). Ciò si verifica di solito quando l'utente preme  o .

L'evento `'line'` viene emesso anche se nuovi dati sono stati letti da un flusso e tale flusso termina senza un marcatore di fine riga finale.

La funzione di listener viene chiamata con una stringa contenente la singola riga di input ricevuta.

```js [ESM]
rl.on('line', (input) => {
  console.log(`Ricevuto: ${input}`);
});
```
### Evento: `'history'` {#event-history}

**Aggiunto in: v15.8.0, v14.18.0**

L'evento `'history'` viene emesso ogni volta che l'array cronologia è stato modificato.

La funzione di listener viene chiamata con un array contenente l'array cronologia. Rifletterà tutte le modifiche, le righe aggiunte e le righe rimosse a causa di `historySize` e `removeHistoryDuplicates`.

Lo scopo principale è consentire a un listener di persistere la cronologia. È anche possibile per il listener modificare l'oggetto cronologia. Ciò potrebbe essere utile per impedire che determinate righe vengano aggiunte alla cronologia, come una password.

```js [ESM]
rl.on('history', (history) => {
  console.log(`Ricevuto: ${history}`);
});
```
### Evento: `'pause'` {#event-pause}

**Aggiunto in: v0.7.5**

L'evento `'pause'` viene emesso quando si verifica uno dei seguenti casi:

- Il flusso `input` è in pausa.
- Il flusso `input` non è in pausa e riceve l'evento `'SIGCONT'`. (Vedere gli eventi [`'SIGTSTP'`](/it/nodejs/api/readline#event-sigtstp) e [`'SIGCONT'`](/it/nodejs/api/readline#event-sigcont).)

La funzione di listener viene chiamata senza passare alcun argomento.

```js [ESM]
rl.on('pause', () => {
  console.log('Readline in pausa.');
});
```

### Evento: `'resume'` {#event-resume}

**Aggiunto in: v0.7.5**

L'evento `'resume'` viene emesso ogni volta che il flusso `input` viene ripreso.

La funzione listener viene chiamata senza passare alcun argomento.

```js [ESM]
rl.on('resume', () => {
  console.log('Readline ripreso.');
});
```
### Evento: `'SIGCONT'` {#event-sigcont}

**Aggiunto in: v0.7.5**

L'evento `'SIGCONT'` viene emesso quando un processo Node.js precedentemente spostato in background usando + (cioè `SIGTSTP`) viene riportato in primo piano usando [`fg(1p)`](http://man7.org/linux/man-pages/man1/fg.1p).

Se il flusso `input` era in pausa *prima* della richiesta `SIGTSTP`, questo evento non verrà emesso.

La funzione listener viene invocata senza passare alcun argomento.

```js [ESM]
rl.on('SIGCONT', () => {
  // `prompt` riprenderà automaticamente il flusso
  rl.prompt();
});
```
L'evento `'SIGCONT'` *non* è supportato su Windows.

### Evento: `'SIGINT'` {#event-sigint}

**Aggiunto in: v0.3.0**

L'evento `'SIGINT'` viene emesso ogni volta che il flusso `input` riceve un input , noto tipicamente come `SIGINT`. Se non ci sono listener di eventi `'SIGINT'` registrati quando il flusso `input` riceve un `SIGINT`, verrà emesso l'evento `'pause'`.

La funzione listener viene invocata senza passare alcun argomento.

```js [ESM]
rl.on('SIGINT', () => {
  rl.question('Sei sicuro di voler uscire? ', (answer) => {
    if (answer.match(/^y(es)?$/i)) rl.pause();
  });
});
```
### Evento: `'SIGTSTP'` {#event-sigtstp}

**Aggiunto in: v0.7.5**

L'evento `'SIGTSTP'` viene emesso quando il flusso `input` riceve un input +, tipicamente noto come `SIGTSTP`. Se non ci sono listener di eventi `'SIGTSTP'` registrati quando il flusso `input` riceve un `SIGTSTP`, il processo Node.js verrà inviato in background.

Quando il programma viene ripreso usando [`fg(1p)`](http://man7.org/linux/man-pages/man1/fg.1p), verranno emessi gli eventi `'pause'` e `'SIGCONT'`. Questi possono essere usati per riprendere il flusso `input`.

Gli eventi `'pause'` e `'SIGCONT'` non verranno emessi se l'`input` era in pausa prima che il processo venisse inviato in background.

La funzione listener viene invocata senza passare alcun argomento.

```js [ESM]
rl.on('SIGTSTP', () => {
  // Questo sovrascriverà SIGTSTP e impedirà al programma di andare in
  // background.
  console.log('Caught SIGTSTP.');
});
```
L'evento `'SIGTSTP'` *non* è supportato su Windows.


### `rl.close()` {#rlclose}

**Aggiunto in: v0.1.98**

Il metodo `rl.close()` chiude l'istanza `InterfaceConstructor` e rinuncia al controllo sui flussi `input` e `output`. Quando chiamato, l'evento `'close'` verrà emesso.

La chiamata a `rl.close()` non interrompe immediatamente l'emissione di altri eventi (incluso `'line'`) da parte dell'istanza `InterfaceConstructor`.

### `rl.pause()` {#rlpause}

**Aggiunto in: v0.3.4**

Il metodo `rl.pause()` mette in pausa il flusso `input`, consentendo di riprenderlo successivamente se necessario.

La chiamata a `rl.pause()` non mette immediatamente in pausa l'emissione di altri eventi (incluso `'line'`) da parte dell'istanza `InterfaceConstructor`.

### `rl.prompt([preserveCursor])` {#rlpromptpreservecursor}

**Aggiunto in: v0.1.98**

- `preserveCursor` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, impedisce che il posizionamento del cursore venga reimpostato a `0`.

Il metodo `rl.prompt()` scrive il `prompt` configurato delle istanze `InterfaceConstructor` su una nuova riga in `output` al fine di fornire a un utente una nuova posizione in cui fornire input.

Quando chiamato, `rl.prompt()` riprenderà il flusso `input` se è stato messo in pausa.

Se `InterfaceConstructor` è stato creato con `output` impostato su `null` o `undefined`, il prompt non viene scritto.

### `rl.resume()` {#rlresume}

**Aggiunto in: v0.3.4**

Il metodo `rl.resume()` riprende il flusso `input` se è stato messo in pausa.

### `rl.setPrompt(prompt)` {#rlsetpromptprompt}

**Aggiunto in: v0.1.98**

- `prompt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Il metodo `rl.setPrompt()` imposta il prompt che verrà scritto in `output` ogni volta che viene chiamato `rl.prompt()`.

### `rl.getPrompt()` {#rlgetprompt}

**Aggiunto in: v15.3.0, v14.17.0**

- Restituisce: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) la stringa del prompt corrente

Il metodo `rl.getPrompt()` restituisce il prompt corrente utilizzato da `rl.prompt()`.

### `rl.write(data[, key])` {#rlwritedata-key}

**Aggiunto in: v0.1.98**

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `key` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ctrl` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` per indicare il tasto .
    - `meta` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` per indicare il tasto .
    - `shift` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` per indicare il tasto .
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il nome di un tasto.

Il metodo `rl.write()` scriverà `data` o una sequenza di tasti identificata da `key` nell'`output`. L'argomento `key` è supportato solo se `output` è un terminale di testo [TTY](/it/nodejs/api/tty). Consulta [Associazioni di tasti TTY](/it/nodejs/api/readline#tty-keybindings) per un elenco di combinazioni di tasti.

Se `key` è specificato, `data` viene ignorato.

Quando chiamato, `rl.write()` riprenderà il flusso `input` se è stato messo in pausa.

Se `InterfaceConstructor` è stato creato con `output` impostato su `null` o `undefined`, `data` e `key` non vengono scritti.

```js [ESM]
rl.write('Cancella questo!');
// Simula Ctrl+U per cancellare la riga scritta in precedenza
rl.write(null, { ctrl: true, name: 'u' });
```
Il metodo `rl.write()` scriverà i dati nell'`input` della `Interface` di `readline` *come se fossero stati forniti dall'utente*.


### `rl[Symbol.asyncIterator]()` {#rlsymbolasynciterator}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v11.14.0, v10.17.0 | Il supporto per Symbol.asyncIterator non è più sperimentale. |
| v11.4.0, v10.16.0 | Aggiunto in: v11.4.0, v10.16.0 |
:::

- Restituisce: [\<AsyncIterator\>](https://tc39.github.io/ecma262/#sec-asynciterator-interface)

Crea un oggetto `AsyncIterator` che itera attraverso ogni riga nel flusso di input come una stringa. Questo metodo consente l'iterazione asincrona di oggetti `InterfaceConstructor` tramite cicli `for await...of`.

Gli errori nel flusso di input non vengono inoltrati.

Se il ciclo viene terminato con `break`, `throw` o `return`, verrà chiamato [`rl.close()`](/it/nodejs/api/readline#rlclose). In altre parole, l'iterazione su un `InterfaceConstructor` consumerà sempre completamente il flusso di input.

Le prestazioni non sono alla pari con l'API tradizionale dell'evento `'line'`. Utilizzare `'line'` invece per applicazioni sensibili alle prestazioni.

```js [ESM]
async function processLineByLine() {
  const rl = readline.createInterface({
    // ...
  });

  for await (const line of rl) {
    // Ogni riga nell'input di readline sarà successivamente disponibile qui come
    // `line`.
  }
}
```
`readline.createInterface()` inizierà a consumare il flusso di input una volta invocato. Avere operazioni asincrone tra la creazione dell'interfaccia e l'iterazione asincrona può comportare la perdita di righe.

### `rl.line` {#rlline}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v15.8.0, v14.18.0 | Il valore sarà sempre una stringa, mai indefinito. |
| v0.1.98 | Aggiunto in: v0.1.98 |
:::

- [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

I dati di input correnti in fase di elaborazione da node.

Questo può essere utilizzato quando si raccolgono input da un flusso TTY per recuperare il valore corrente che è stato elaborato finora, prima che venga emesso l'evento `line`. Una volta emesso l'evento `line`, questa proprietà sarà una stringa vuota.

Essere consapevoli che la modifica del valore durante l'esecuzione dell'istanza può avere conseguenze indesiderate se anche `rl.cursor` non è controllato.

**Se non si utilizza un flusso TTY per l'input, utilizzare l'<a href="#event-line">evento <code>'line'</code></a>.**

Un possibile caso d'uso potrebbe essere il seguente:

```js [ESM]
const values = ['lorem ipsum', 'dolor sit amet'];
const rl = readline.createInterface(process.stdin);
const showResults = debounce(() => {
  console.log(
    '\n',
    values.filter((val) => val.startsWith(rl.line)).join(' '),
  );
}, 300);
process.stdin.on('keypress', (c, k) => {
  showResults();
});
```

### `rl.cursor` {#rlcursor}

**Aggiunto in: v0.1.98**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

La posizione del cursore relativa a `rl.line`.

Traccia dove il cursore corrente si trova nella stringa di input, durante la lettura dell'input da un flusso TTY. La posizione del cursore determina la porzione della stringa di input che verrà modificata durante l'elaborazione dell'input, così come la colonna dove verrà renderizzato il cursore del terminale.

### `rl.getCursorPos()` {#rlgetcursorpos}

**Aggiunto in: v13.5.0, v12.16.0**

- Restituisce: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `rows` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) la riga del prompt in cui si trova attualmente il cursore
    - `cols` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) la colonna dello schermo in cui si trova attualmente il cursore

Restituisce la posizione reale del cursore in relazione al prompt di input + stringa. Stringhe di input lunghe (con wrapping), così come prompt su più righe, sono inclusi nei calcoli.

## API Promises {#promises-api}

**Aggiunto in: v17.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/it/nodejs/api/documentation#stability-index) [Stability: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

### Class: `readlinePromises.Interface` {#class-readlinepromisesinterface}

**Aggiunto in: v17.0.0**

- Estende: [\<readline.InterfaceConstructor\>](/it/nodejs/api/readline#class-interfaceconstructor)

Le istanze della classe `readlinePromises.Interface` sono costruite usando il metodo `readlinePromises.createInterface()`. Ogni istanza è associata a un singolo stream `input` [Readable](/it/nodejs/api/stream#readable-streams) e a un singolo stream `output` [Writable](/it/nodejs/api/stream#writable-streams). Lo stream `output` è utilizzato per stampare i prompt per l'input dell'utente che arriva su, e viene letto da, lo stream `input`.


#### `rl.question(query[, options])` {#rlquestionquery-options}

**Aggiunto in: v17.0.0**

- `query` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un'affermazione o query da scrivere su `output`, anteposta al prompt.
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) Consente facoltativamente di annullare `question()` utilizzando un `AbortSignal`.
  
 
- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Una promise che viene risolta con l'input dell'utente in risposta alla `query`.

Il metodo `rl.question()` visualizza la `query` scrivendola su `output`, attende che l'input dell'utente venga fornito su `input`, quindi richiama la funzione `callback` passando l'input fornito come primo argomento.

Quando viene chiamata, `rl.question()` riprenderà lo stream `input` se è stato messo in pausa.

Se `readlinePromises.Interface` è stato creato con `output` impostato su `null` o `undefined`, la `query` non viene scritta.

Se la domanda viene chiamata dopo `rl.close()`, restituisce una promise rifiutata.

Esempio di utilizzo:

```js [ESM]
const answer = await rl.question('Qual è il tuo cibo preferito? ');
console.log(`Oh, quindi il tuo cibo preferito è ${answer}`);
```
Utilizzo di un `AbortSignal` per annullare una domanda.

```js [ESM]
const signal = AbortSignal.timeout(10_000);

signal.addEventListener('abort', () => {
  console.log('La domanda sul cibo è scaduta');
}, { once: true });

const answer = await rl.question('Qual è il tuo cibo preferito? ', { signal });
console.log(`Oh, quindi il tuo cibo preferito è ${answer}`);
```
### Classe: `readlinePromises.Readline` {#class-readlinepromisesreadline}

**Aggiunto in: v17.0.0**

#### `new readlinePromises.Readline(stream[, options])` {#new-readlinepromisesreadlinestream-options}

**Aggiunto in: v17.0.0**

- `stream` [\<stream.Writable\>](/it/nodejs/api/stream#class-streamwritable) Uno stream [TTY](/it/nodejs/api/tty).
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `autoCommit` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, non è necessario chiamare `rl.commit()`.


#### `rl.clearLine(dir)` {#rlclearlinedir}

**Aggiunto in: v17.0.0**

- `dir` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `-1`: a sinistra dal cursore
    - `1`: a destra dal cursore
    - `0`: l'intera riga
  
 
- Restituisce: this

Il metodo `rl.clearLine()` aggiunge all'elenco interno delle azioni in sospeso un'azione che cancella la riga corrente del `stream` associato in una direzione specificata identificata da `dir`. Chiama `rl.commit()` per vedere l'effetto di questo metodo, a meno che `autoCommit: true` non sia stato passato al costruttore.

#### `rl.clearScreenDown()` {#rlclearscreendown}

**Aggiunto in: v17.0.0**

- Restituisce: this

Il metodo `rl.clearScreenDown()` aggiunge all'elenco interno delle azioni in sospeso un'azione che cancella lo stream associato dalla posizione corrente del cursore verso il basso. Chiama `rl.commit()` per vedere l'effetto di questo metodo, a meno che `autoCommit: true` non sia stato passato al costruttore.

#### `rl.commit()` {#rlcommit}

**Aggiunto in: v17.0.0**

- Restituisce: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Il metodo `rl.commit()` invia tutte le azioni in sospeso allo `stream` associato e cancella l'elenco interno delle azioni in sospeso.

#### `rl.cursorTo(x[, y])` {#rlcursortox-y}

**Aggiunto in: v17.0.0**

- `x` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `y` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- Restituisce: this

Il metodo `rl.cursorTo()` aggiunge all'elenco interno delle azioni in sospeso un'azione che sposta il cursore nella posizione specificata nello `stream` associato. Chiama `rl.commit()` per vedere l'effetto di questo metodo, a meno che `autoCommit: true` non sia stato passato al costruttore.

#### `rl.moveCursor(dx, dy)` {#rlmovecursordx-dy}

**Aggiunto in: v17.0.0**

- `dx` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `dy` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- Restituisce: this

Il metodo `rl.moveCursor()` aggiunge all'elenco interno delle azioni in sospeso un'azione che sposta il cursore *relativamente* alla sua posizione corrente nello `stream` associato. Chiama `rl.commit()` per vedere l'effetto di questo metodo, a meno che `autoCommit: true` non sia stato passato al costruttore.


#### `rl.rollback()` {#rlrollback}

**Aggiunto in: v17.0.0**

- Restituisce: this

Il metodo `rl.rollback` cancella la lista interna di azioni in sospeso senza inviarla al relativo `stream`.

### `readlinePromises.createInterface(options)` {#readlinepromisescreateinterfaceoptions}

**Aggiunto in: v17.0.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `input` [\<stream.Readable\>](/it/nodejs/api/stream#class-streamreadable) Lo stream [Readable](/it/nodejs/api/stream#readable-streams) da ascoltare. Questa opzione è *richiesta*.
    - `output` [\<stream.Writable\>](/it/nodejs/api/stream#class-streamwritable) Lo stream [Writable](/it/nodejs/api/stream#writable-streams) in cui scrivere i dati di readline.
    - `completer` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una funzione opzionale utilizzata per l'autocompletamento tramite Tab.
    - `terminal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` se gli stream `input` e `output` devono essere trattati come una TTY e se devono esservi scritti codici di escape ANSI/VT100. **Predefinito:** controllo di `isTTY` sullo stream `output` al momento dell'instanziazione.
    - `history` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Lista iniziale di righe di cronologia. Questa opzione ha senso solo se `terminal` è impostato su `true` dall'utente o da un controllo `output` interno, altrimenti il meccanismo di memorizzazione nella cache della cronologia non viene affatto inizializzato. **Predefinito:** `[]`.
    - `historySize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero massimo di righe di cronologia conservate. Per disabilitare la cronologia, imposta questo valore su `0`. Questa opzione ha senso solo se `terminal` è impostato su `true` dall'utente o da un controllo `output` interno, altrimenti il meccanismo di memorizzazione nella cache della cronologia non viene affatto inizializzato. **Predefinito:** `30`.
    - `removeHistoryDuplicates` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, quando una nuova riga di input aggiunta alla lista della cronologia duplica una riga precedente, quest'ultima viene rimossa dalla lista. **Predefinito:** `false`.
    - `prompt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La stringa del prompt da utilizzare. **Predefinito:** `'\> '`.
    - `crlfDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Se il ritardo tra `\r` e `\n` supera `crlfDelay` millisecondi, sia `\r` che `\n` verranno trattati come input di fine riga separati. `crlfDelay` verrà forzato a un numero non inferiore a `100`. Può essere impostato su `Infinity`, nel qual caso `\r` seguito da `\n` verrà sempre considerato un singolo carattere di nuova riga (il che può essere ragionevole per [leggere i file](/it/nodejs/api/readline#example-read-file-stream-line-by-line) con il delimitatore di riga `\r\n`). **Predefinito:** `100`.
    - `escapeCodeTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La durata in cui `readlinePromises` attenderà un carattere (quando si legge una sequenza di tasti ambigua in millisecondi, una che può sia formare una sequenza di tasti completa utilizzando l'input letto finora, sia acquisire input aggiuntivo per completare una sequenza di tasti più lunga). **Predefinito:** `500`.
    - `tabSize` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di spazi a cui equivale una tabulazione (minimo 1). **Predefinito:** `8`.
  
 
- Restituisce: [\<readlinePromises.Interface\>](/it/nodejs/api/readline#class-readlinepromisesinterface)

Il metodo `readlinePromises.createInterface()` crea una nuova istanza di `readlinePromises.Interface`.

::: code-group
```js [ESM]
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
const rl = createInterface({
  input: stdin,
  output: stdout,
});
```

```js [CJS]
const { createInterface } = require('node:readline/promises');
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});
```
:::

Una volta creata l'istanza `readlinePromises.Interface`, il caso più comune è quello di ascoltare l'evento `'line'`:

```js [ESM]
rl.on('line', (line) => {
  console.log(`Received: ${line}`);
});
```
Se `terminal` è `true` per questa istanza, lo stream `output` otterrà la migliore compatibilità se definisce una proprietà `output.columns` ed emette un evento `'resize'` sull' `output` se o quando le colonne cambiano ([`process.stdout`](/it/nodejs/api/process#processstdout) lo fa automaticamente quando è una TTY).


#### Uso della funzione `completer` {#use-of-the-completer-function}

La funzione `completer` accetta la riga corrente inserita dall'utente come argomento e restituisce un `Array` con 2 voci:

- Un `Array` con voci corrispondenti per il completamento.
- La sottostringa utilizzata per la corrispondenza.

Ad esempio: `[[substr1, substr2, ...], originalsubstring]`.

```js [ESM]
function completer(line) {
  const completions = '.help .error .exit .quit .q'.split(' ');
  const hits = completions.filter((c) => c.startsWith(line));
  // Mostra tutti i completamenti se non ne viene trovato nessuno
  return [hits.length ? hits : completions, line];
}
```
La funzione `completer` può anche restituire una [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) o essere asincrona:

```js [ESM]
async function completer(linePartial) {
  await someAsyncWork();
  return [['123'], linePartial];
}
```
## API Callback {#callback-api}

**Aggiunto in: v0.1.104**

### Classe: `readline.Interface` {#class-readlineinterface}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v17.0.0 | La classe `readline.Interface` ora eredita da `Interface`. |
| v0.1.104 | Aggiunto in: v0.1.104 |
:::

- Estende: [\<readline.InterfaceConstructor\>](/it/nodejs/api/readline#class-interfaceconstructor)

Le istanze della classe `readline.Interface` vengono costruite utilizzando il metodo `readline.createInterface()`. Ogni istanza è associata a un singolo flusso `input` [Readable](/it/nodejs/api/stream#readable-streams) e a un singolo flusso `output` [Writable](/it/nodejs/api/stream#writable-streams). Il flusso `output` viene utilizzato per stampare i prompt per l'input dell'utente che arriva su e viene letto dal flusso `input`.

#### `rl.question(query[, options], callback)` {#rlquestionquery-options-callback}

**Aggiunto in: v0.3.3**

- `query` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Una dichiarazione o query da scrivere in `output`, anteposta al prompt.
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) Consente facoltativamente di annullare `question()` utilizzando un `AbortController`.
  
 
- `callback` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una funzione di callback che viene richiamata con l'input dell'utente in risposta alla `query`.

Il metodo `rl.question()` visualizza la `query` scrivendola nell'`output`, attende che l'input dell'utente venga fornito sull'`input`, quindi richiama la funzione `callback` passando l'input fornito come primo argomento.

Quando viene chiamato, `rl.question()` riprenderà il flusso `input` se è stato messo in pausa.

Se `readline.Interface` è stato creato con `output` impostato su `null` o `undefined`, la `query` non viene scritta.

La funzione `callback` passata a `rl.question()` non segue lo schema tipico di accettazione di un oggetto `Error` o `null` come primo argomento. La `callback` viene chiamata con la risposta fornita come unico argomento.

Verrà generato un errore se si chiama `rl.question()` dopo `rl.close()`.

Esempio di utilizzo:

```js [ESM]
rl.question('Qual è il tuo cibo preferito? ', (answer) => {
  console.log(`Oh, quindi il tuo cibo preferito è ${answer}`);
});
```
Utilizzo di un `AbortController` per annullare una domanda.

```js [ESM]
const ac = new AbortController();
const signal = ac.signal;

rl.question('Qual è il tuo cibo preferito? ', { signal }, (answer) => {
  console.log(`Oh, quindi il tuo cibo preferito è ${answer}`);
});

signal.addEventListener('abort', () => {
  console.log('La domanda sul cibo è scaduta');
}, { once: true });

setTimeout(() => ac.abort(), 10000);
```

### `readline.clearLine(stream, dir[, callback])` {#readlineclearlinestream-dir-callback}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Il passaggio di un callback non valido all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v12.7.0 | Il callback write() e il valore di ritorno dello stream sono esposti. |
| v0.7.7 | Aggiunto in: v0.7.7 |
:::

- `stream` [\<stream.Writable\>](/it/nodejs/api/stream#class-streamwritable)
- `dir` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `-1`: a sinistra dal cursore
    - `1`: a destra dal cursore
    - `0`: l'intera riga
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Richiamato una volta completata l'operazione.
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false` se `stream` desidera che il codice chiamante attenda l'emissione dell'evento `'drain'` prima di continuare a scrivere dati aggiuntivi; altrimenti `true`.

Il metodo `readline.clearLine()` cancella la riga corrente del dato stream [TTY](/it/nodejs/api/tty) in una direzione specificata identificata da `dir`.

### `readline.clearScreenDown(stream[, callback])` {#readlineclearscreendownstream-callback}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Il passaggio di un callback non valido all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v12.7.0 | Il callback write() e il valore di ritorno dello stream sono esposti. |
| v0.7.7 | Aggiunto in: v0.7.7 |
:::

- `stream` [\<stream.Writable\>](/it/nodejs/api/stream#class-streamwritable)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Richiamato una volta completata l'operazione.
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false` se `stream` desidera che il codice chiamante attenda l'emissione dell'evento `'drain'` prima di continuare a scrivere dati aggiuntivi; altrimenti `true`.

Il metodo `readline.clearScreenDown()` cancella il dato stream [TTY](/it/nodejs/api/tty) dalla posizione corrente del cursore in giù.


### `readline.createInterface(options)` {#readlinecreateinterfaceoptions}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v15.14.0, v14.18.0 | L'opzione `signal` è ora supportata. |
| v15.8.0, v14.18.0 | L'opzione `history` è ora supportata. |
| v13.9.0 | L'opzione `tabSize` è ora supportata. |
| v8.3.0, v6.11.4 | Rimozione del limite massimo dell'opzione `crlfDelay`. |
| v6.6.0 | L'opzione `crlfDelay` è ora supportata. |
| v6.3.0 | L'opzione `prompt` è ora supportata. |
| v6.0.0 | L'opzione `historySize` può essere `0` ora. |
| v0.1.98 | Aggiunto in: v0.1.98 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `input` [\<stream.Readable\>](/it/nodejs/api/stream#class-streamreadable) Lo stream [Readable](/it/nodejs/api/stream#readable-streams) da ascoltare. Questa opzione è *richiesta*.
    - `output` [\<stream.Writable\>](/it/nodejs/api/stream#class-streamwritable) Lo stream [Writable](/it/nodejs/api/stream#writable-streams) in cui scrivere i dati readline.
    - `completer` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una funzione opzionale utilizzata per il completamento automatico tramite Tab.
    - `terminal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` se gli stream `input` e `output` devono essere trattati come un TTY e devono avere codici di escape ANSI/VT100 scritti su di essi. **Predefinito:** controllo di `isTTY` sullo stream `output` al momento dell'istanzazione.
    - `history` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Elenco iniziale di righe di cronologia. Questa opzione ha senso solo se `terminal` è impostato su `true` dall'utente o da un controllo `output` interno, altrimenti il meccanismo di memorizzazione nella cache della cronologia non viene inizializzato affatto. **Predefinito:** `[]`.
    - `historySize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Numero massimo di righe di cronologia conservate. Per disabilitare la cronologia, impostare questo valore su `0`. Questa opzione ha senso solo se `terminal` è impostato su `true` dall'utente o da un controllo `output` interno, altrimenti il meccanismo di memorizzazione nella cache della cronologia non viene inizializzato affatto. **Predefinito:** `30`.
    - `removeHistoryDuplicates` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, quando una nuova riga di input aggiunta all'elenco della cronologia duplica una riga precedente, questa rimuove la riga precedente dall'elenco. **Predefinito:** `false`.
    - `prompt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La stringa di prompt da utilizzare. **Predefinito:** `'\> '`.
    - `crlfDelay` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Se il ritardo tra `\r` e `\n` supera `crlfDelay` millisecondi, sia `\r` che `\n` verranno trattati come input di fine riga separati. `crlfDelay` verrà forzato a un numero non inferiore a `100`. Può essere impostato su `Infinity`, nel qual caso `\r` seguito da `\n` verrà sempre considerato un singolo newline (il che può essere ragionevole per [leggere file](/it/nodejs/api/readline#example-read-file-stream-line-by-line) con il delimitatore di riga `\r\n`). **Predefinito:** `100`.
    - `escapeCodeTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La durata per cui `readline` attenderà un carattere (quando si legge una sequenza di tasti ambigua in millisecondi, una che può sia formare una sequenza di tasti completa utilizzando l'input letto finora, sia accettare input aggiuntivi per completare una sequenza di tasti più lunga). **Predefinito:** `500`.
    - `tabSize` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di spazi a cui equivale un tab (minimo 1). **Predefinito:** `8`.
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) Consente di chiudere l'interfaccia utilizzando un AbortSignal. L'interruzione del segnale chiamerà internamente `close` sull'interfaccia.
  
 
- Restituisce: [\<readline.Interface\>](/it/nodejs/api/readline#class-readlineinterface)

Il metodo `readline.createInterface()` crea una nuova istanza di `readline.Interface`.

::: code-group
```js [ESM]
import { createInterface } from 'node:readline';
import { stdin, stdout } from 'node:process';
const rl = createInterface({
  input: stdin,
  output: stdout,
});
```

```js [CJS]
const { createInterface } = require('node:readline');
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});
```
:::

Una volta creata l'istanza di `readline.Interface`, il caso più comune è ascoltare l'evento `'line'`:

```js [ESM]
rl.on('line', (line) => {
  console.log(`Received: ${line}`);
});
```
Se `terminal` è `true` per questa istanza, lo stream `output` otterrà la migliore compatibilità se definisce una proprietà `output.columns` ed emette un evento `'resize'` sull' `output` se o quando le colonne cambiano ([`process.stdout`](/it/nodejs/api/process#processstdout) lo fa automaticamente quando è un TTY).

Quando si crea una `readline.Interface` usando `stdin` come input, il programma non terminerà finché non riceve un [carattere EOF](https://en.wikipedia.org/wiki/End-of-file#EOF_character). Per uscire senza attendere l'input dell'utente, chiamare `process.stdin.unref()`.


#### Uso della funzione `completer` {#use-of-the-completer-function_1}

La funzione `completer` accetta come argomento la riga corrente inserita dall'utente e restituisce un `Array` con 2 voci:

- Un `Array` con le voci corrispondenti per il completamento.
- La sottostringa utilizzata per la corrispondenza.

Ad esempio: `[[substr1, substr2, ...], originalsubstring]`.

```js [ESM]
function completer(line) {
  const completions = '.help .error .exit .quit .q'.split(' ');
  const hits = completions.filter((c) => c.startsWith(line));
  // Mostra tutti i completamenti se non ne viene trovato nessuno
  return [hits.length ? hits : completions, line];
}
```
La funzione `completer` può essere chiamata in modo asincrono se accetta due argomenti:

```js [ESM]
function completer(linePartial, callback) {
  callback(null, [['123'], linePartial]);
}
```
### `readline.cursorTo(stream, x[, y][, callback])` {#readlinecursortostream-x-y-callback}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare un callback non valido all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v12.7.0 | Il callback write() dello stream e il valore restituito sono esposti. |
| v0.7.7 | Aggiunto in: v0.7.7 |
:::

- `stream` [\<stream.Writable\>](/it/nodejs/api/stream#class-streamwritable)
- `x` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `y` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Richiamato al termine dell'operazione.
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false` se `stream` desidera che il codice chiamante attenda che l'evento `'drain'` venga emesso prima di continuare a scrivere dati aggiuntivi; altrimenti `true`.

Il metodo `readline.cursorTo()` sposta il cursore nella posizione specificata in un dato `stream` [TTY](/it/nodejs/api/tty).

### `readline.moveCursor(stream, dx, dy[, callback])` {#readlinemovecursorstream-dx-dy-callback}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare un callback non valido all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v12.7.0 | Il callback write() dello stream e il valore restituito sono esposti. |
| v0.7.7 | Aggiunto in: v0.7.7 |
:::

- `stream` [\<stream.Writable\>](/it/nodejs/api/stream#class-streamwritable)
- `dx` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `dy` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Richiamato al termine dell'operazione.
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false` se `stream` desidera che il codice chiamante attenda che l'evento `'drain'` venga emesso prima di continuare a scrivere dati aggiuntivi; altrimenti `true`.

Il metodo `readline.moveCursor()` sposta il cursore *relativamente* alla sua posizione corrente in un dato `stream` [TTY](/it/nodejs/api/tty).


## `readline.emitKeypressEvents(stream[, interface])` {#readlineemitkeypresseventsstream-interface}

**Aggiunto in: v0.7.7**

- `stream` [\<stream.Readable\>](/it/nodejs/api/stream#class-streamreadable)
- `interface` [\<readline.InterfaceConstructor\>](/it/nodejs/api/readline#class-interfaceconstructor)

Il metodo `readline.emitKeypressEvents()` fa sì che il dato stream [Readable](/it/nodejs/api/stream#readable-streams) inizi a emettere eventi `'keypress'` corrispondenti all'input ricevuto.

Opzionalmente, `interface` specifica un'istanza `readline.Interface` per la quale il completamento automatico è disabilitato quando viene rilevato input copiato e incollato.

Se lo `stream` è un [TTY](/it/nodejs/api/tty), allora deve essere in modalità raw.

Questo viene chiamato automaticamente da qualsiasi istanza readline sul suo `input` se l'`input` è un terminale. Chiudere l'istanza `readline` non impedisce all'`input` di emettere eventi `'keypress'`.

```js [ESM]
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY)
  process.stdin.setRawMode(true);
```
## Esempio: Tiny CLI {#example-tiny-cli}

Il seguente esempio illustra l'uso della classe `readline.Interface` per implementare una piccola interfaccia a riga di comando:



::: code-group
```js [ESM]
import { createInterface } from 'node:readline';
import { exit, stdin, stdout } from 'node:process';
const rl = createInterface({
  input: stdin,
  output: stdout,
  prompt: 'OHAI> ',
});

rl.prompt();

rl.on('line', (line) => {
  switch (line.trim()) {
    case 'hello':
      console.log('world!');
      break;
    default:
      console.log(`Say what? I might have heard '${line.trim()}'`);
      break;
  }
  rl.prompt();
}).on('close', () => {
  console.log('Have a great day!');
  exit(0);
});
```

```js [CJS]
const { createInterface } = require('node:readline');
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'OHAI> ',
});

rl.prompt();

rl.on('line', (line) => {
  switch (line.trim()) {
    case 'hello':
      console.log('world!');
      break;
    default:
      console.log(`Say what? I might have heard '${line.trim()}'`);
      break;
  }
  rl.prompt();
}).on('close', () => {
  console.log('Have a great day!');
  process.exit(0);
});
```
:::


## Esempio: Leggere il flusso di file riga per riga {#example-read-file-stream-line-by-line}

Un caso d'uso comune per `readline` è quello di consumare un file di input una riga alla volta. Il modo più semplice per farlo è sfruttare l'API [`fs.ReadStream`](/it/nodejs/api/fs#class-fsreadstream) e un ciclo `for await...of`:

::: code-group
```js [ESM]
import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';

async function processLineByLine() {
  const fileStream = createReadStream('input.txt');

  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

  for await (const line of rl) {
    // Each line in input.txt will be successively available here as `line`.
    console.log(`Line from file: ${line}`);
  }
}

processLineByLine();
```

```js [CJS]
const { createReadStream } = require('node:fs');
const { createInterface } = require('node:readline');

async function processLineByLine() {
  const fileStream = createReadStream('input.txt');

  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

  for await (const line of rl) {
    // Each line in input.txt will be successively available here as `line`.
    console.log(`Line from file: ${line}`);
  }
}

processLineByLine();
```
:::

In alternativa, si potrebbe usare l'evento [`'line'`](/it/nodejs/api/readline#event-line):

::: code-group
```js [ESM]
import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';

const rl = createInterface({
  input: createReadStream('sample.txt'),
  crlfDelay: Infinity,
});

rl.on('line', (line) => {
  console.log(`Line from file: ${line}`);
});
```

```js [CJS]
const { createReadStream } = require('node:fs');
const { createInterface } = require('node:readline');

const rl = createInterface({
  input: createReadStream('sample.txt'),
  crlfDelay: Infinity,
});

rl.on('line', (line) => {
  console.log(`Line from file: ${line}`);
});
```
:::

Attualmente, il ciclo `for await...of` può essere un po' più lento. Se il flusso `async` / `await` e la velocità sono entrambi essenziali, è possibile applicare un approccio misto:

::: code-group
```js [ESM]
import { once } from 'node:events';
import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';

(async function processLineByLine() {
  try {
    const rl = createInterface({
      input: createReadStream('big-file.txt'),
      crlfDelay: Infinity,
    });

    rl.on('line', (line) => {
      // Process the line.
    });

    await once(rl, 'close');

    console.log('File processed.');
  } catch (err) {
    console.error(err);
  }
})();
```

```js [CJS]
const { once } = require('node:events');
const { createReadStream } = require('node:fs');
const { createInterface } = require('node:readline');

(async function processLineByLine() {
  try {
    const rl = createInterface({
      input: createReadStream('big-file.txt'),
      crlfDelay: Infinity,
    });

    rl.on('line', (line) => {
      // Process the line.
    });

    await once(rl, 'close');

    console.log('File processed.');
  } catch (err) {
    console.error(err);
  }
})();
```
:::

## Combinazioni di tasti TTY {#tty-keybindings}

| Combinazioni di tasti | Descrizione | Note |
|---|---|---|
|   +    +   | Elimina la riga a sinistra | Non funziona su Linux, Mac e Windows |
|   +    +   | Elimina la riga a destra | Non funziona su Mac |
|   +   | Invia   `SIGINT`   o chiude l'istanza readline | |
|   +   | Elimina a sinistra | |
|   +   | Elimina a destra o chiude l'istanza readline nel caso in cui la riga corrente sia vuota / EOF | Non funziona su Windows |
|   +   | Elimina dalla posizione corrente all'inizio della riga | |
|   +   | Elimina dalla posizione corrente alla fine della riga | |
|   +   | Yank (Richiama) il testo eliminato in precedenza | Funziona solo con il testo eliminato da     +     o     +   |
|   +   | Alterna tra i testi eliminati in precedenza | Disponibile solo quando l'ultimo tasto premuto è     +     o     +   |
|   +   | Vai all'inizio della riga | |
|   +   | Vai alla fine della riga | |
|   +   | Indietro di un carattere | |
|   +   | Avanti di un carattere | |
|   +   | Pulisci lo schermo | |
|   +   | Elemento successivo della cronologia | |
|   +   | Elemento precedente della cronologia | |
|   +   | Annulla la modifica precedente | Qualsiasi tasto che emetta il codice chiave   `0x1F`   eseguirà questa azione.     In molti terminali, ad esempio   `xterm`  ,     questo è associato a     +    . |
|   +   | Ripristina la modifica precedente | Molti terminali non hanno un tasto di ripristino predefinito.     Scegliamo il codice chiave   `0x1E`   per eseguire il ripristino.     In   `xterm`  , è associato a     +         per impostazione predefinita. |
|   +   | Sposta il processo in esecuzione in background. Digita       `fg`   e premi          per tornare. | Non funziona su Windows |
|   +     o         +   | Elimina all'indietro fino a un limite di parola |   +     Non funziona     su Linux, Mac e Windows |
|   +   | Elimina in avanti fino a un limite di parola | Non funziona su Mac |
|   +     o         +   | Parola a sinistra |   +     Non funziona     su Mac |
|   +     o         +   | Parola a destra |   +     Non funziona     su Mac |
|   +     o         +   | Elimina la parola a destra |   +     Non funziona     su Windows |
|   +   | Elimina la parola a sinistra | Non funziona su Mac |

