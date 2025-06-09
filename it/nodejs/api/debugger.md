---
title: Guida al Debugger di Node.js
description: Una guida completa sull'uso del debugger integrato in Node.js, con dettagli su comandi, utilizzo e tecniche di debug.
head:
  - - meta
    - name: og:title
      content: Guida al Debugger di Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Una guida completa sull'uso del debugger integrato in Node.js, con dettagli su comandi, utilizzo e tecniche di debug.
  - - meta
    - name: twitter:title
      content: Guida al Debugger di Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Una guida completa sull'uso del debugger integrato in Node.js, con dettagli su comandi, utilizzo e tecniche di debug.
---


# Debugger {#debugger}

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile
:::

Node.js include un'utilità di debug da riga di comando. Il client di debug di Node.js non è un debugger completo, ma sono possibili semplici operazioni di "stepping" e ispezione.

Per utilizzarlo, avviare Node.js con l'argomento `inspect` seguito dal percorso dello script da sottoporre a debug.

```bash [BASH]
$ node inspect myscript.js
< Debugger in ascolto su ws://127.0.0.1:9229/621111f9-ffcb-4e82-b718-48a145fa5db8
< Per assistenza, consultare: https://nodejs.org/en/docs/inspector
<
connessione a 127.0.0.1:9229 ... ok
< Debugger collegato.
<
 ok
Interruzione all'avvio in myscript.js:2
  1 // myscript.js
> 2 global.x = 5;
  3 setTimeout(() => {
  4   debugger;
debug>
```
Il debugger si interrompe automaticamente alla prima riga eseguibile. Per invece eseguire fino al primo breakpoint (specificato da un'istruzione [`debugger`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/debugger)), impostare la variabile d'ambiente `NODE_INSPECT_RESUME_ON_START` su `1`.

```bash [BASH]
$ cat myscript.js
// myscript.js
global.x = 5;
setTimeout(() => {
  debugger;
  console.log('world');
}, 1000);
console.log('hello');
$ NODE_INSPECT_RESUME_ON_START=1 node inspect myscript.js
< Debugger in ascolto su ws://127.0.0.1:9229/f1ed133e-7876-495b-83ae-c32c6fc319c2
< Per assistenza, consultare: https://nodejs.org/en/docs/inspector
<
connessione a 127.0.0.1:9229 ... ok
< Debugger collegato.
<
< hello
<
interruzione in myscript.js:4
  2 global.x = 5;
  3 setTimeout(() => {
> 4   debugger;
  5   console.log('world');
  6 }, 1000);
debug> next
interruzione in myscript.js:5
  3 setTimeout(() => {
  4   debugger;
> 5   console.log('world');
  6 }, 1000);
  7 console.log('hello');
debug> repl
Premere Ctrl+C per uscire dalla repl di debug
> x
5
> 2 + 2
4
debug> next
< world
<
interruzione in myscript.js:6
  4   debugger;
  5   console.log('world');
> 6 }, 1000);
  7 console.log('hello');
  8
debug> .exit
$
```
Il comando `repl` consente di valutare il codice da remoto. Il comando `next` passa alla riga successiva. Digitare `help` per vedere quali altri comandi sono disponibili.

Premendo `Invio` senza digitare un comando, il comando di debug precedente verrà ripetuto.


## Osservatori {#watchers}

È possibile osservare espressioni e valori di variabili durante il debug. Ad ogni punto di interruzione, ogni espressione dalla lista degli osservatori verrà valutata nel contesto corrente e visualizzata immediatamente prima del listato del codice sorgente del punto di interruzione.

Per iniziare a osservare un'espressione, digita `watch('mia_espressione')`. Il comando `watchers` stamperà gli osservatori attivi. Per rimuovere un osservatore, digita `unwatch('mia_espressione')`.

## Riferimento ai comandi {#command-reference}

### Esecuzione passo passo {#stepping}

- `cont`, `c`: Continua l'esecuzione
- `next`, `n`: Passo successivo
- `step`, `s`: Entra
- `out`, `o`: Esci
- `pause`: Metti in pausa il codice in esecuzione (come il pulsante di pausa negli strumenti per sviluppatori)

### Punti di interruzione {#breakpoints}

- `setBreakpoint()`, `sb()`: Imposta un punto di interruzione sulla riga corrente
- `setBreakpoint(line)`, `sb(line)`: Imposta un punto di interruzione su una riga specifica
- `setBreakpoint('fn()')`, `sb(...)`: Imposta un punto di interruzione sulla prima istruzione nel corpo della funzione
- `setBreakpoint('script.js', 1)`, `sb(...)`: Imposta un punto di interruzione sulla prima riga di `script.js`
- `setBreakpoint('script.js', 1, 'num \< 4')`, `sb(...)`: Imposta un punto di interruzione condizionale sulla prima riga di `script.js` che si interrompe solo quando `num \< 4` restituisce `true`
- `clearBreakpoint('script.js', 1)`, `cb(...)`: Cancella il punto di interruzione in `script.js` sulla riga 1

È anche possibile impostare un punto di interruzione in un file (modulo) che non è ancora stato caricato:

```bash [BASH]
$ node inspect main.js
< Debugger listening on ws://127.0.0.1:9229/48a5b28a-550c-471b-b5e1-d13dd7165df9
< For help, see: https://nodejs.org/en/docs/inspector
<
connecting to 127.0.0.1:9229 ... ok
< Debugger attached.
<
Break on start in main.js:1
> 1 const mod = require('./mod.js');
  2 mod.hello();
  3 mod.hello();
debug> setBreakpoint('mod.js', 22)
Warning: script 'mod.js' was not loaded yet.
debug> c
break in mod.js:22
 20 // USE OR OTHER DEALINGS IN THE SOFTWARE.
 21
>22 exports.hello = function() {
 23   return 'hello from module';
 24 };
debug>
```
È anche possibile impostare un punto di interruzione condizionale che si interrompe solo quando una data espressione restituisce `true`:

```bash [BASH]
$ node inspect main.js
< Debugger listening on ws://127.0.0.1:9229/ce24daa8-3816-44d4-b8ab-8273c8a66d35
< For help, see: https://nodejs.org/en/docs/inspector
<
connecting to 127.0.0.1:9229 ... ok
< Debugger attached.
Break on start in main.js:7
  5 }
  6
> 7 addOne(10);
  8 addOne(-1);
  9
debug> setBreakpoint('main.js', 4, 'num < 0')
  1 'use strict';
  2
  3 function addOne(num) {
> 4   return num + 1;
  5 }
  6
  7 addOne(10);
  8 addOne(-1);
  9
debug> cont
break in main.js:4
  2
  3 function addOne(num) {
> 4   return num + 1;
  5 }
  6
debug> exec('num')
-1
debug>
```

### Informazioni {#information}

- `backtrace`, `bt`: Stampa il backtrace del frame di esecuzione corrente
- `list(5)`: Elenca il codice sorgente degli script con un contesto di 5 righe (5 righe prima e dopo)
- `watch(expr)`: Aggiungi un'espressione alla watch list
- `unwatch(expr)`: Rimuovi un'espressione dalla watch list
- `unwatch(index)`: Rimuovi un'espressione in corrispondenza di un indice specifico dalla watch list
- `watchers`: Elenca tutti i watcher e i loro valori (elencati automaticamente ad ogni breakpoint)
- `repl`: Apri la repl del debugger per la valutazione nel contesto dello script di debug
- `exec expr`, `p expr`: Esegui un'espressione nel contesto dello script di debug e stampa il suo valore
- `profile`: Inizia una sessione di profilazione della CPU
- `profileEnd`: Interrompi la sessione di profilazione della CPU corrente
- `profiles`: Elenca tutte le sessioni di profilazione della CPU completate
- `profiles[n].save(filepath = 'node.cpuprofile')`: Salva la sessione di profilazione della CPU su disco come JSON
- `takeHeapSnapshot(filepath = 'node.heapsnapshot')`: Scatta un heap snapshot e salvalo su disco come JSON

### Controllo dell'esecuzione {#execution-control}

- `run`: Esegui lo script (esegue automaticamente all'avvio del debugger)
- `restart`: Riavvia lo script
- `kill`: Termina lo script

### Varie {#various}

- `scripts`: Elenca tutti gli script caricati
- `version`: Visualizza la versione di V8

## Utilizzo avanzato {#advanced-usage}

### Integrazione di V8 inspector per Node.js {#v8-inspector-integration-for-nodejs}

L'integrazione di V8 Inspector consente di collegare Chrome DevTools alle istanze di Node.js per il debug e la profilazione. Utilizza il [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/).

V8 Inspector può essere abilitato passando il flag `--inspect` all'avvio di un'applicazione Node.js. È anche possibile fornire una porta personalizzata con quel flag, ad es. `--inspect=9222` accetterà connessioni DevTools sulla porta 9222.

L'utilizzo del flag `--inspect` eseguirà il codice immediatamente prima che il debugger sia connesso. Ciò significa che il codice inizierà a essere eseguito prima che tu possa iniziare il debug, il che potrebbe non essere l'ideale se desideri eseguire il debug fin dall'inizio.

In tali casi, hai due alternative:

Quindi, quando decidi tra `--inspect`, `--inspect-wait` e `--inspect-brk`, considera se vuoi che il codice inizi a essere eseguito immediatamente, aspetta che il debugger sia collegato prima dell'esecuzione oppure interrompa la prima riga per il debug passo-passo.

```bash [BASH]
$ node --inspect index.js
Debugger in ascolto su ws://127.0.0.1:9229/dc9010dd-f8b8-4ac5-a510-c1a114ec7d29
Per aiuto, vedi: https://nodejs.org/en/docs/inspector
```
(Nell'esempio sopra, l'UUID dc9010dd-f8b8-4ac5-a510-c1a114ec7d29 alla fine dell'URL viene generato al volo, varia nelle diverse sessioni di debug.)

Se il browser Chrome è più vecchio della versione 66.0.3345.0, usa `inspector.html` invece di `js_app.html` nell'URL sopra.

Chrome DevTools non supporta ancora il debug di [worker threads](/it/nodejs/api/worker_threads). [ndb](https://github.com/GoogleChromeLabs/ndb/) può essere utilizzato per eseguirne il debug.

