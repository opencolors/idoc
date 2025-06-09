---
title: Documentazione Node.js - Processo Figlio
description: La documentazione di Node.js per il modulo Processo Figlio, che dettaglia come avviare processi figli, gestire il loro ciclo di vita e gestire la comunicazione tra processi.
head:
  - - meta
    - name: og:title
      content: Documentazione Node.js - Processo Figlio | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: La documentazione di Node.js per il modulo Processo Figlio, che dettaglia come avviare processi figli, gestire il loro ciclo di vita e gestire la comunicazione tra processi.
  - - meta
    - name: twitter:title
      content: Documentazione Node.js - Processo Figlio | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: La documentazione di Node.js per il modulo Processo Figlio, che dettaglia come avviare processi figli, gestire il loro ciclo di vita e gestire la comunicazione tra processi.
---


# Processo figlio {#child-process}

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile
:::

**Codice sorgente:** [lib/child_process.js](https://github.com/nodejs/node/blob/v23.5.0/lib/child_process.js)

Il modulo `node:child_process` fornisce la capacità di generare sottoprocessi in un modo simile, ma non identico, a [`popen(3)`](http://man7.org/linux/man-pages/man3/popen.3). Questa capacità è fornita principalmente dalla funzione [`child_process.spawn()`](/it/nodejs/api/child_process#child_processspawncommand-args-options):

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
```

```js [ESM]
import { spawn } from 'node:child_process';
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
```
:::

Per impostazione predefinita, i pipe per `stdin`, `stdout` e `stderr` sono stabiliti tra il processo Node.js padre e il sottoprocesso generato. Questi pipe hanno una capacità limitata (e specifica per la piattaforma). Se il sottoprocesso scrive su stdout superando tale limite senza che l'output venga catturato, il sottoprocesso si blocca in attesa che il buffer del pipe accetti più dati. Questo è identico al comportamento dei pipe nella shell. Utilizzare l'opzione `{ stdio: 'ignore' }` se l'output non verrà utilizzato.

La ricerca del comando viene eseguita utilizzando la variabile d'ambiente `options.env.PATH` se `env` si trova nell'oggetto `options`. Altrimenti, viene utilizzato `process.env.PATH`. Se `options.env` è impostato senza `PATH`, la ricerca su Unix viene eseguita su un percorso di ricerca predefinito di `/usr/bin:/bin` (consultare il manuale del sistema operativo per execvpe/execvp), su Windows viene utilizzata la variabile d'ambiente `PATH` del processo corrente.

Su Windows, le variabili d'ambiente non fanno distinzione tra maiuscole e minuscole. Node.js ordina lessicograficamente le chiavi `env` e utilizza la prima che corrisponde senza distinzione tra maiuscole e minuscole. Solo la prima voce (in ordine lessicografico) verrà passata al sottoprocesso. Ciò potrebbe causare problemi su Windows quando si passano oggetti all'opzione `env` che hanno più varianti della stessa chiave, come `PATH` e `Path`.

Il metodo [`child_process.spawn()`](/it/nodejs/api/child_process#child_processspawncommand-args-options) genera il processo figlio in modo asincrono, senza bloccare il ciclo di eventi di Node.js. La funzione [`child_process.spawnSync()`](/it/nodejs/api/child_process#child_processspawnsynccommand-args-options) fornisce funzionalità equivalenti in modo sincrono che blocca il ciclo di eventi fino a quando il processo generato non termina o viene terminato.

Per comodità, il modulo `node:child_process` fornisce una manciata di alternative sincrone e asincrone a [`child_process.spawn()`](/it/nodejs/api/child_process#child_processspawncommand-args-options) e [`child_process.spawnSync()`](/it/nodejs/api/child_process#child_processspawnsynccommand-args-options). Ciascuna di queste alternative è implementata sopra a [`child_process.spawn()`](/it/nodejs/api/child_process#child_processspawncommand-args-options) o [`child_process.spawnSync()`](/it/nodejs/api/child_process#child_processspawnsynccommand-args-options).

- [`child_process.exec()`](/it/nodejs/api/child_process#child_processexeccommand-options-callback): genera una shell ed esegue un comando all'interno di tale shell, passando `stdout` e `stderr` a una funzione di callback al termine.
- [`child_process.execFile()`](/it/nodejs/api/child_process#child_processexecfilefile-args-options-callback): simile a [`child_process.exec()`](/it/nodejs/api/child_process#child_processexeccommand-options-callback) tranne per il fatto che genera il comando direttamente senza prima generare una shell per impostazione predefinita.
- [`child_process.fork()`](/it/nodejs/api/child_process#child_processforkmodulepath-args-options): genera un nuovo processo Node.js e richiama un modulo specificato con un canale di comunicazione IPC stabilito che consente l'invio di messaggi tra padre e figlio.
- [`child_process.execSync()`](/it/nodejs/api/child_process#child_processexecsynccommand-options): una versione sincrona di [`child_process.exec()`](/it/nodejs/api/child_process#child_processexeccommand-options-callback) che bloccherà il ciclo di eventi di Node.js.
- [`child_process.execFileSync()`](/it/nodejs/api/child_process#child_processexecfilesyncfile-args-options): una versione sincrona di [`child_process.execFile()`](/it/nodejs/api/child_process#child_processexecfilefile-args-options-callback) che bloccherà il ciclo di eventi di Node.js.

Per alcuni casi d'uso, come l'automazione di script di shell, le [controparti sincronizzate](/it/nodejs/api/child_process#synchronous-process-creation) possono essere più convenienti. In molti casi, tuttavia, i metodi sincroni possono avere un impatto significativo sulle prestazioni a causa del blocco del ciclo di eventi mentre i processi generati vengono completati.


## Creazione asincrona di processi {#asynchronous-process-creation}

I metodi [`child_process.spawn()`](/it/nodejs/api/child_process#child_processspawncommand-args-options), [`child_process.fork()`](/it/nodejs/api/child_process#child_processforkmodulepath-args-options), [`child_process.exec()`](/it/nodejs/api/child_process#child_processexeccommand-options-callback) e [`child_process.execFile()`](/it/nodejs/api/child_process#child_processexecfilefile-args-options-callback) seguono tutti l'idiomatico pattern di programmazione asincrona tipico delle altre API di Node.js.

Ciascuno dei metodi restituisce un'istanza di [`ChildProcess`](/it/nodejs/api/child_process#class-childprocess). Questi oggetti implementano l'API [`EventEmitter`](/it/nodejs/api/events#class-eventemitter) di Node.js, consentendo al processo padre di registrare funzioni di listener che vengono chiamate quando si verificano determinati eventi durante il ciclo di vita del processo figlio.

I metodi [`child_process.exec()`](/it/nodejs/api/child_process#child_processexeccommand-options-callback) e [`child_process.execFile()`](/it/nodejs/api/child_process#child_processexecfilefile-args-options-callback) consentono inoltre di specificare una funzione `callback` opzionale che viene richiamata quando il processo figlio termina.

### Generazione di file `.bat` e `.cmd` su Windows {#spawning-bat-and-cmd-files-on-windows}

L'importanza della distinzione tra [`child_process.exec()`](/it/nodejs/api/child_process#child_processexeccommand-options-callback) e [`child_process.execFile()`](/it/nodejs/api/child_process#child_processexecfilefile-args-options-callback) può variare in base alla piattaforma. Sui sistemi operativi di tipo Unix (Unix, Linux, macOS) [`child_process.execFile()`](/it/nodejs/api/child_process#child_processexecfilefile-args-options-callback) può essere più efficiente perché non genera una shell per impostazione predefinita. Su Windows, tuttavia, i file `.bat` e `.cmd` non sono eseguibili da soli senza un terminale e pertanto non possono essere avviati utilizzando [`child_process.execFile()`](/it/nodejs/api/child_process#child_processexecfilefile-args-options-callback). Quando si esegue su Windows, i file `.bat` e `.cmd` possono essere richiamati utilizzando [`child_process.spawn()`](/it/nodejs/api/child_process#child_processspawncommand-args-options) con l'opzione `shell` impostata, con [`child_process.exec()`](/it/nodejs/api/child_process#child_processexeccommand-options-callback), o generando `cmd.exe` e passando il file `.bat` o `.cmd` come argomento (che è ciò che fanno l'opzione `shell` e [`child_process.exec()`](/it/nodejs/api/child_process#child_processexeccommand-options-callback)). In ogni caso, se il nome del file dello script contiene spazi, deve essere racchiuso tra virgolette.

::: code-group
```js [CJS]
// OR...
const { exec, spawn } = require('node:child_process');

exec('my.bat', (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(stdout);
});

// Script con spazi nel nome del file:
const bat = spawn('"my script.cmd"', ['a', 'b'], { shell: true });
// or:
exec('"my script.cmd" a b', (err, stdout, stderr) => {
  // ...
});
```

```js [ESM]
// OR...
import { exec, spawn } from 'node:child_process';

exec('my.bat', (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(stdout);
});

// Script con spazi nel nome del file:
const bat = spawn('"my script.cmd"', ['a', 'b'], { shell: true });
// or:
exec('"my script.cmd" a b', (err, stdout, stderr) => {
  // ...
});
```
:::


### `child_process.exec(command[, options][, callback])` {#child_processexeccommand-options-callback}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v15.4.0 | È stato aggiunto il supporto per AbortSignal. |
| v16.4.0, v14.18.0 | L'opzione `cwd` può essere un oggetto `URL` WHATWG che utilizza il protocollo `file:`. |
| v8.8.0 | L'opzione `windowsHide` è ora supportata. |
| v0.1.90 | Aggiunto in: v0.1.90 |
:::

- `command` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il comando da eseguire, con argomenti separati da spazi.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api) Directory di lavoro corrente del processo figlio. **Predefinito:** `process.cwd()`.
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Coppie chiave-valore dell'ambiente. **Predefinito:** `process.env`.
    - `encoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Predefinito:** `'utf8'`
    - `shell` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Shell con cui eseguire il comando. Vedi [Requisiti della shell](/it/nodejs/api/child_process#shell-requirements) e [Shell predefinita di Windows](/it/nodejs/api/child_process#default-windows-shell). **Predefinito:** `'/bin/sh'` su Unix, `process.env.ComSpec` su Windows.
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) consente di interrompere il processo figlio utilizzando un AbortSignal.
    - `timeout` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `0`
    - `maxBuffer` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La massima quantità di dati in byte consentita su stdout o stderr. Se superata, il processo figlio viene terminato e qualsiasi output viene troncato. Vedi l'avvertenza su [`maxBuffer` e Unicode](/it/nodejs/api/child_process#maxbuffer-and-unicode). **Predefinito:** `1024 * 1024`.
    - `killSignal` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `'SIGTERM'`
    - `uid` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Imposta l'identità utente del processo (vedi [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2)).
    - `gid` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Imposta l'identità del gruppo del processo (vedi [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2)).
    - `windowsHide` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Nasconde la finestra della console del sottoprocesso che normalmente verrebbe creata sui sistemi Windows. **Predefinito:** `false`.
  
 
- `callback` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) chiamata con l'output quando il processo termina.
    - `error` [\<Errore\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `stdout` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer)
    - `stderr` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer)
  
 
- Restituisce: [\<ChildProcess\>](/it/nodejs/api/child_process#class-childprocess)

Genera una shell quindi esegue il `command` all'interno di quella shell, memorizzando nel buffer qualsiasi output generato. La stringa `command` passata alla funzione exec viene elaborata direttamente dalla shell e i caratteri speciali (variano in base alla [shell](https://en.wikipedia.org/wiki/List_of_command-line_interpreters)) devono essere gestiti di conseguenza:



::: code-group
```js [CJS]
const { exec } = require('node:child_process');

exec('"/path/to/test file/test.sh" arg1 arg2');
// Le virgolette doppie vengono utilizzate in modo che lo spazio nel percorso non venga interpretato come
// un delimitatore di argomenti multipli.

exec('echo "La variabile \\$HOME è $HOME"');
// La variabile $HOME è preceduta da escape nella prima istanza, ma non nella seconda.
```

```js [ESM]
import { exec } from 'node:child_process';

exec('"/path/to/test file/test.sh" arg1 arg2');
// Le virgolette doppie vengono utilizzate in modo che lo spazio nel percorso non venga interpretato come
// un delimitatore di argomenti multipli.

exec('echo "La variabile \\$HOME è $HOME"');
// La variabile $HOME è preceduta da escape nella prima istanza, ma non nella seconda.
```
:::

**Non passare mai input utente non sanificati a questa funzione. Qualsiasi input contenente metacaratteri shell può essere utilizzato per attivare l'esecuzione di comandi arbitrari.**

Se viene fornita una funzione `callback`, viene chiamata con gli argomenti `(error, stdout, stderr)`. In caso di successo, `error` sarà `null`. In caso di errore, `error` sarà un'istanza di [`Error`](/it/nodejs/api/errors#class-error). La proprietà `error.code` sarà il codice di uscita del processo. Per convenzione, qualsiasi codice di uscita diverso da `0` indica un errore. `error.signal` sarà il segnale che ha terminato il processo.

Gli argomenti `stdout` e `stderr` passati al callback conterranno l'output stdout e stderr del processo figlio. Per impostazione predefinita, Node.js decodificherà l'output come UTF-8 e passerà stringhe al callback. L'opzione `encoding` può essere utilizzata per specificare la codifica dei caratteri utilizzata per decodificare l'output stdout e stderr. Se `encoding` è `'buffer'`, o una codifica dei caratteri non riconosciuta, gli oggetti `Buffer` verranno passati al callback.



::: code-group
```js [CJS]
const { exec } = require('node:child_process');
exec('cat *.js missing_file | wc -l', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});
```

```js [ESM]
import { exec } from 'node:child_process';
exec('cat *.js missing_file | wc -l', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});
```
:::

Se `timeout` è maggiore di `0`, il processo padre invierà il segnale identificato dalla proprietà `killSignal` (il valore predefinito è `'SIGTERM'`) se il processo figlio viene eseguito più a lungo di `timeout` millisecondi.

A differenza della chiamata di sistema POSIX [`exec(3)`](http://man7.org/linux/man-pages/man3/exec.3), `child_process.exec()` non sostituisce il processo esistente e utilizza una shell per eseguire il comando.

Se questo metodo viene richiamato come versione [`util.promisify()`](/it/nodejs/api/util#utilpromisifyoriginal)ed, restituisce una `Promise` per un `Object` con proprietà `stdout` e `stderr`. L'istanza `ChildProcess` restituita è collegata alla `Promise` come proprietà `child`. In caso di errore (incluso qualsiasi errore che comporti un codice di uscita diverso da 0), viene restituita una promise rifiutata, con lo stesso oggetto `error` fornito nel callback, ma con due proprietà aggiuntive `stdout` e `stderr`.



::: code-group
```js [CJS]
const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

async function lsExample() {
  const { stdout, stderr } = await exec('ls');
  console.log('stdout:', stdout);
  console.error('stderr:', stderr);
}
lsExample();
```

```js [ESM]
import { promisify } from 'node:util';
import child_process from 'node:child_process';
const exec = promisify(child_process.exec);

async function lsExample() {
  const { stdout, stderr } = await exec('ls');
  console.log('stdout:', stdout);
  console.error('stderr:', stderr);
}
lsExample();
```
:::

Se l'opzione `signal` è abilitata, chiamare `.abort()` sul corrispondente `AbortController` è simile a chiamare `.kill()` sul processo figlio, tranne per il fatto che l'errore passato al callback sarà un `AbortError`:



::: code-group
```js [CJS]
const { exec } = require('node:child_process');
const controller = new AbortController();
const { signal } = controller;
const child = exec('grep ssh', { signal }, (error) => {
  console.error(error); // an AbortError
});
controller.abort();
```

```js [ESM]
import { exec } from 'node:child_process';
const controller = new AbortController();
const { signal } = controller;
const child = exec('grep ssh', { signal }, (error) => {
  console.error(error); // an AbortError
});
controller.abort();
```
:::

### `child_process.execFile(file[, args][, options][, callback])` {#child_processexecfilefile-args-options-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v16.4.0, v14.18.0 | L'opzione `cwd` può essere un oggetto `URL` WHATWG che utilizza il protocollo `file:`. |
| v15.4.0, v14.17.0 | È stato aggiunto il supporto per AbortSignal. |
| v8.8.0 | L'opzione `windowsHide` è ora supportata. |
| v0.1.91 | Aggiunto in: v0.1.91 |
:::

- `file` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il nome o il percorso del file eseguibile da eseguire.
- `args` [\<stringa[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Elenco di argomenti stringa.
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api) Directory di lavoro corrente del processo figlio.
    - `env` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Coppie chiave-valore dell'ambiente. **Predefinito:** `process.env`.
    - `encoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Predefinito:** `'utf8'`
    - `timeout` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `0`
    - `maxBuffer` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La quantità massima di dati in byte consentita su stdout o stderr. Se superata, il processo figlio viene terminato e qualsiasi output viene troncato. Vedi l'avvertenza in [`maxBuffer` e Unicode](/it/nodejs/api/child_process#maxbuffer-and-unicode). **Predefinito:** `1024 * 1024`.
    - `killSignal` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `'SIGTERM'`
    - `uid` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Imposta l'identità utente del processo (vedi [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2)).
    - `gid` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Imposta l'identità del gruppo del processo (vedi [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2)).
    - `windowsHide` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Nascondi la finestra della console del sottoprocesso che normalmente verrebbe creata sui sistemi Windows. **Predefinito:** `false`.
    - `windowsVerbatimArguments` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Nessuna citazione o escape degli argomenti viene eseguita su Windows. Ignorato su Unix. **Predefinito:** `false`.
    - `shell` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Se `true`, esegue `command` all'interno di una shell. Utilizza `'/bin/sh'` su Unix e `process.env.ComSpec` su Windows. Una shell diversa può essere specificata come stringa. Vedi [Requisiti della shell](/it/nodejs/api/child_process#shell-requirements) e [Shell predefinita di Windows](/it/nodejs/api/child_process#default-windows-shell). **Predefinito:** `false` (nessuna shell).
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) consente di interrompere il processo figlio utilizzando un AbortSignal.


- `callback` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Chiamata con l'output quando il processo termina.
    - `error` [\<Errore\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `stdout` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer)
    - `stderr` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer)


- Restituisce: [\<ChildProcess\>](/it/nodejs/api/child_process#class-childprocess)

La funzione `child_process.execFile()` è simile a [`child_process.exec()`](/it/nodejs/api/child_process#child_processexeccommand-options-callback) tranne per il fatto che non genera una shell per impostazione predefinita. Piuttosto, il `file` eseguibile specificato viene generato direttamente come un nuovo processo, rendendolo leggermente più efficiente di [`child_process.exec()`](/it/nodejs/api/child_process#child_processexeccommand-options-callback).

Sono supportate le stesse opzioni di [`child_process.exec()`](/it/nodejs/api/child_process#child_processexeccommand-options-callback). Poiché una shell non viene generata, comportamenti come il reindirizzamento I/O e il file globbing non sono supportati.

::: code-group
```js [CJS]
const { execFile } = require('node:child_process');
const child = execFile('node', ['--version'], (error, stdout, stderr) => {
  if (error) {
    throw error;
  }
  console.log(stdout);
});
```

```js [ESM]
import { execFile } from 'node:child_process';
const child = execFile('node', ['--version'], (error, stdout, stderr) => {
  if (error) {
    throw error;
  }
  console.log(stdout);
});
```
:::

Gli argomenti `stdout` e `stderr` passati alla callback conterranno l'output stdout e stderr del processo figlio. Per impostazione predefinita, Node.js decodificherà l'output come UTF-8 e passerà le stringhe alla callback. L'opzione `encoding` può essere utilizzata per specificare la codifica dei caratteri utilizzata per decodificare l'output stdout e stderr. Se `encoding` è `'buffer'`, o una codifica dei caratteri non riconosciuta, gli oggetti `Buffer` verranno invece passati alla callback.

Se questo metodo viene richiamato come versione [`util.promisify()`](/it/nodejs/api/util#utilpromisifyoriginal)ed, restituisce una `Promise` per un `Oggetto` con proprietà `stdout` e `stderr`. L'istanza `ChildProcess` restituita è collegata alla `Promise` come proprietà `child`. In caso di errore (incluso qualsiasi errore che comporti un codice di uscita diverso da 0), viene restituita una promise rifiutata, con lo stesso oggetto `error` fornito nella callback, ma con due proprietà aggiuntive `stdout` e `stderr`.

::: code-group
```js [CJS]
const util = require('node:util');
const execFile = util.promisify(require('node:child_process').execFile);
async function getVersion() {
  const { stdout } = await execFile('node', ['--version']);
  console.log(stdout);
}
getVersion();
```

```js [ESM]
import { promisify } from 'node:util';
import child_process from 'node:child_process';
const execFile = promisify(child_process.execFile);
async function getVersion() {
  const { stdout } = await execFile('node', ['--version']);
  console.log(stdout);
}
getVersion();
```
:::

**Se l'opzione <code>shell</code> è abilitata, non passare input utente non sanitizzato a questa funzione. Qualsiasi input contenente metacaratteri della shell può essere utilizzato per attivare l'esecuzione di comandi arbitrari.**

Se l'opzione `signal` è abilitata, chiamare `.abort()` sul corrispondente `AbortController` è simile a chiamare `.kill()` sul processo figlio, tranne per il fatto che l'errore passato alla callback sarà un `AbortError`:

::: code-group
```js [CJS]
const { execFile } = require('node:child_process');
const controller = new AbortController();
const { signal } = controller;
const child = execFile('node', ['--version'], { signal }, (error) => {
  console.error(error); // an AbortError
});
controller.abort();
```

```js [ESM]
import { execFile } from 'node:child_process';
const controller = new AbortController();
const { signal } = controller;
const child = execFile('node', ['--version'], { signal }, (error) => {
  console.error(error); // an AbortError
});
controller.abort();
```
:::


### `child_process.fork(modulePath[, args][, options])` {#child_processforkmodulepath-args-options}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v17.4.0, v16.14.0 | Il parametro `modulePath` può essere un oggetto `URL` WHATWG che utilizza il protocollo `file:`. |
| v16.4.0, v14.18.0 | L'opzione `cwd` può essere un oggetto `URL` WHATWG che utilizza il protocollo `file:`. |
| v15.13.0, v14.18.0 | È stato aggiunto il timeout. |
| v15.11.0, v14.18.0 | È stato aggiunto killSignal per AbortSignal. |
| v15.6.0, v14.17.0 | È stato aggiunto il supporto per AbortSignal. |
| v13.2.0, v12.16.0 | L'opzione `serialization` è ora supportata. |
| v8.0.0 | L'opzione `stdio` ora può essere una stringa. |
| v6.4.0 | L'opzione `stdio` è ora supportata. |
| v0.5.0 | Aggiunto in: v0.5.0 |
:::

- `modulePath` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api) Il modulo da eseguire nel child.
- `args` [\<stringa[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Elenco di argomenti stringa.
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api) Directory di lavoro corrente del processo child.
    - `detached` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Prepara il processo child per l'esecuzione indipendente dal suo processo padre. Il comportamento specifico dipende dalla piattaforma, vedi [`options.detached`](/it/nodejs/api/child_process#optionsdetached)).
    - `env` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Coppie chiave-valore dell'ambiente. **Predefinito:** `process.env`.
    - `execPath` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Eseguibile utilizzato per creare il processo child.
    - `execArgv` [\<stringa[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Elenco di argomenti stringa passati all'eseguibile. **Predefinito:** `process.execArgv`.
    - `gid` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Imposta l'identità del gruppo del processo (vedi [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2)).
    - `serialization` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Specifica il tipo di serializzazione utilizzato per l'invio di messaggi tra i processi. I valori possibili sono `'json'` e `'advanced'`. Vedi [Serializzazione avanzata](/it/nodejs/api/child_process#advanced-serialization) per maggiori dettagli. **Predefinito:** `'json'`.
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) Consente la chiusura del processo child utilizzando un AbortSignal.
    - `killSignal` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il valore del segnale da utilizzare quando il processo generato verrà interrotto dal timeout o dal segnale di interruzione. **Predefinito:** `'SIGTERM'`.
    - `silent` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, stdin, stdout e stderr del processo child verranno reindirizzati al processo padre, altrimenti verranno ereditati dal processo padre, vedi le opzioni `'pipe'` e `'inherit'` per lo [`stdio`](/it/nodejs/api/child_process#optionsstdio) di [`child_process.spawn()`](/it/nodejs/api/child_process#child_processspawncommand-args-options) per maggiori dettagli. **Predefinito:** `false`.
    - `stdio` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) | [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Vedi lo [`stdio`](/it/nodejs/api/child_process#optionsstdio) di [`child_process.spawn()`](/it/nodejs/api/child_process#child_processspawncommand-args-options). Quando questa opzione viene fornita, sovrascrive `silent`. Se viene utilizzata la variante array, deve contenere esattamente un elemento con valore `'ipc'` o verrà generato un errore. Ad esempio `[0, 1, 2, 'ipc']`.
    - `uid` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Imposta l'identità dell'utente del processo (vedi [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2)).
    - `windowsVerbatimArguments` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Nessuna citazione o escape degli argomenti viene eseguita su Windows. Ignorato su Unix. **Predefinito:** `false`.
    - `timeout` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) In millisecondi, la quantità massima di tempo in cui il processo può essere eseguito. **Predefinito:** `undefined`.


- Restituisce: [\<ChildProcess\>](/it/nodejs/api/child_process#class-childprocess)

Il metodo `child_process.fork()` è un caso speciale di [`child_process.spawn()`](/it/nodejs/api/child_process#child_processspawncommand-args-options) utilizzato specificamente per generare nuovi processi Node.js. Come [`child_process.spawn()`](/it/nodejs/api/child_process#child_processspawncommand-args-options), viene restituito un oggetto [`ChildProcess`](/it/nodejs/api/child_process#class-childprocess). Il [`ChildProcess`](/it/nodejs/api/child_process#class-childprocess) restituito avrà un canale di comunicazione aggiuntivo integrato che consente di passare messaggi avanti e indietro tra il padre e il child. Vedi [`subprocess.send()`](/it/nodejs/api/child_process#subprocesssendmessage-sendhandle-options-callback) per i dettagli.

Tieni presente che i processi child Node.js generati sono indipendenti dal padre, ad eccezione del canale di comunicazione IPC stabilito tra i due. Ogni processo ha la propria memoria, con le proprie istanze V8. A causa delle allocazioni di risorse aggiuntive richieste, non è consigliabile generare un numero elevato di processi child Node.js.

Per impostazione predefinita, `child_process.fork()` genererà nuove istanze Node.js utilizzando il [`process.execPath`](/it/nodejs/api/process#processexecpath) del processo padre. La proprietà `execPath` nell'oggetto `options` consente di utilizzare un percorso di esecuzione alternativo.

I processi Node.js avviati con un `execPath` personalizzato comunicheranno con il processo padre utilizzando il descrittore di file (fd) identificato tramite la variabile di ambiente `NODE_CHANNEL_FD` nel processo child.

A differenza della chiamata di sistema POSIX [`fork(2)`](http://man7.org/linux/man-pages/man2/fork.2), `child_process.fork()` non clona il processo corrente.

L'opzione `shell` disponibile in [`child_process.spawn()`](/it/nodejs/api/child_process#child_processspawncommand-args-options) non è supportata da `child_process.fork()` e verrà ignorata se impostata.

Se l'opzione `signal` è abilitata, chiamare `.abort()` sul corrispondente `AbortController` è simile a chiamare `.kill()` sul processo child, tranne per il fatto che l'errore passato al callback sarà un `AbortError`:

::: code-group
```js [CJS]
const { fork } = require('node:child_process');
const process = require('node:process');

if (process.argv[2] === 'child') {
  setTimeout(() => {
    console.log(`Hello from ${process.argv[2]}!`);
  }, 1_000);
} else {
  const controller = new AbortController();
  const { signal } = controller;
  const child = fork(__filename, ['child'], { signal });
  child.on('error', (err) => {
    // This will be called with err being an AbortError if the controller aborts
  });
  controller.abort(); // Stops the child process
}
```

```js [ESM]
import { fork } from 'node:child_process';
import process from 'node:process';

if (process.argv[2] === 'child') {
  setTimeout(() => {
    console.log(`Hello from ${process.argv[2]}!`);
  }, 1_000);
} else {
  const controller = new AbortController();
  const { signal } = controller;
  const child = fork(import.meta.url, ['child'], { signal });
  child.on('error', (err) => {
    // This will be called with err being an AbortError if the controller aborts
  });
  controller.abort(); // Stops the child process
}
```
:::


### `child_process.spawn(command[, args][, options])` {#child_processspawncommand-args-options}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v16.4.0, v14.18.0 | L'opzione `cwd` può essere un oggetto `URL` WHATWG utilizzando il protocollo `file:`. |
| v15.13.0, v14.18.0 | È stato aggiunto timeout. |
| v15.11.0, v14.18.0 | È stato aggiunto killSignal per AbortSignal. |
| v15.5.0, v14.17.0 | È stato aggiunto il supporto per AbortSignal. |
| v13.2.0, v12.16.0 | L'opzione `serialization` è ora supportata. |
| v8.8.0 | L'opzione `windowsHide` è ora supportata. |
| v6.4.0 | L'opzione `argv0` è ora supportata. |
| v5.7.0 | L'opzione `shell` è ora supportata. |
| v0.1.90 | Aggiunto in: v0.1.90 |
:::

- `command` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il comando da eseguire.
- `args` [\<stringa[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Elenco degli argomenti stringa.
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api) Directory di lavoro corrente del processo figlio.
    - `env` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Coppie chiave-valore dell'ambiente. **Predefinito:** `process.env`.
    - `argv0` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Imposta esplicitamente il valore di `argv[0]` inviato al processo figlio. Questo verrà impostato su `command` se non specificato.
    - `stdio` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) | [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Configurazione stdio del figlio (vedere [`options.stdio`](/it/nodejs/api/child_process#optionsstdio)).
    - `detached` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Prepara il processo figlio per l'esecuzione indipendentemente dal suo processo padre. Il comportamento specifico dipende dalla piattaforma, vedere [`options.detached`](/it/nodejs/api/child_process#optionsdetached)).
    - `uid` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Imposta l'identità utente del processo (vedere [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2)).
    - `gid` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Imposta l'identità del gruppo del processo (vedere [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2)).
    - `serialization` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Specifica il tipo di serializzazione utilizzato per l'invio di messaggi tra i processi. I valori possibili sono `'json'` e `'advanced'`. Vedi [Serializzazione avanzata](/it/nodejs/api/child_process#advanced-serialization) per maggiori dettagli. **Predefinito:** `'json'`.
    - `shell` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Se `true`, esegue `command` all'interno di una shell. Utilizza `'/bin/sh'` su Unix e `process.env.ComSpec` su Windows. Una shell diversa può essere specificata come una stringa. Vedi [Requisiti della shell](/it/nodejs/api/child_process#shell-requirements) e [Shell Windows predefinita](/it/nodejs/api/child_process#default-windows-shell). **Predefinito:** `false` (nessuna shell).
    - `windowsVerbatimArguments` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Nessuna citazione o escape degli argomenti viene eseguita su Windows. Ignorato su Unix. Questo è impostato su `true` automaticamente quando `shell` è specificato ed è CMD. **Predefinito:** `false`.
    - `windowsHide` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Nascondi la finestra della console del sottoprocesso che normalmente verrebbe creata sui sistemi Windows. **Predefinito:** `false`.
    - `signal` [\<AbortSignal\>](/it/nodejs/api/globals#class-abortsignal) consente di interrompere il processo figlio utilizzando un AbortSignal.
    - `timeout` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) In millisecondi la quantità massima di tempo in cui il processo può essere eseguito. **Predefinito:** `undefined`.
    - `killSignal` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il valore del segnale da utilizzare quando il processo generato verrà interrotto per timeout o segnale di interruzione. **Predefinito:** `'SIGTERM'`.
  
 
- Restituisce: [\<ChildProcess\>](/it/nodejs/api/child_process#class-childprocess)

Il metodo `child_process.spawn()` genera un nuovo processo utilizzando il `comando` fornito, con argomenti della riga di comando in `args`. Se omesso, `args` predefinisce un array vuoto.

**Se l'opzione <code>shell</code> è abilitata, non passare input utente non sanitizzato a questa
funzione. Qualsiasi input contenente metacaratteri shell può essere utilizzato per attivare
l'esecuzione arbitraria di comandi.**

Un terzo argomento può essere utilizzato per specificare opzioni aggiuntive, con queste impostazioni predefinite:

```js [ESM]
const defaults = {
  cwd: undefined,
  env: process.env,
};
```
Utilizzare `cwd` per specificare la directory di lavoro da cui viene generato il processo. Se non specificato, l'impostazione predefinita è ereditare la directory di lavoro corrente. Se specificato, ma il percorso non esiste, il processo figlio emette un errore `ENOENT` e si chiude immediatamente. `ENOENT` viene emesso anche quando il comando non esiste.

Utilizzare `env` per specificare le variabili di ambiente che saranno visibili al nuovo processo, l'impostazione predefinita è [`process.env`](/it/nodejs/api/process#processenv).

I valori `undefined` in `env` verranno ignorati.

Esempio di esecuzione di `ls -lh /usr`, acquisendo `stdout`, `stderr` e il codice di uscita:



::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
```

```js [ESM]
import { spawn } from 'node:child_process';
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
```
:::

Esempio: Un modo molto elaborato per eseguire `ps ax | grep ssh`



::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const ps = spawn('ps', ['ax']);
const grep = spawn('grep', ['ssh']);

ps.stdout.on('data', (data) => {
  grep.stdin.write(data);
});

ps.stderr.on('data', (data) => {
  console.error(`ps stderr: ${data}`);
});

ps.on('close', (code) => {
  if (code !== 0) {
    console.log(`ps process exited with code ${code}`);
  }
  grep.stdin.end();
});

grep.stdout.on('data', (data) => {
  console.log(data.toString());
});

grep.stderr.on('data', (data) => {
  console.error(`grep stderr: ${data}`);
});

grep.on('close', (code) => {
  if (code !== 0) {
    console.log(`grep process exited with code ${code}`);
  }
});
```

```js [ESM]
import { spawn } from 'node:child_process';
const ps = spawn('ps', ['ax']);
const grep = spawn('grep', ['ssh']);

ps.stdout.on('data', (data) => {
  grep.stdin.write(data);
});

ps.stderr.on('data', (data) => {
  console.error(`ps stderr: ${data}`);
});

ps.on('close', (code) => {
  if (code !== 0) {
    console.log(`ps process exited with code ${code}`);
  }
  grep.stdin.end();
});

grep.stdout.on('data', (data) => {
  console.log(data.toString());
});

grep.stderr.on('data', (data) => {
  console.error(`grep stderr: ${data}`);
});

grep.on('close', (code) => {
  if (code !== 0) {
    console.log(`grep process exited with code ${code}`);
  }
});
```
:::

Esempio di verifica della presenza di `spawn` non riuscito:



::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const subprocess = spawn('bad_command');

subprocess.on('error', (err) => {
  console.error('Failed to start subprocess.');
});
```

```js [ESM]
import { spawn } from 'node:child_process';
const subprocess = spawn('bad_command');

subprocess.on('error', (err) => {
  console.error('Failed to start subprocess.');
});
```
:::

Alcune piattaforme (macOS, Linux) useranno il valore di `argv[0]` per il titolo del processo, mentre altre (Windows, SunOS) useranno `command`.

Node.js sovrascrive `argv[0]` con `process.execPath` all'avvio, quindi `process.argv[0]` in un processo figlio Node.js non corrisponderà al parametro `argv0` passato a `spawn` dal padre. Recuperalo invece con la proprietà `process.argv0`.

Se l'opzione `signal` è abilitata, chiamare `.abort()` sul `AbortController` corrispondente è simile a chiamare `.kill()` sul processo figlio, tranne per il fatto che l'errore passato al callback sarà un `AbortError`:



::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const controller = new AbortController();
const { signal } = controller;
const grep = spawn('grep', ['ssh'], { signal });
grep.on('error', (err) => {
  // This will be called with err being an AbortError if the controller aborts
});
controller.abort(); // Stops the child process
```

```js [ESM]
import { spawn } from 'node:child_process';
const controller = new AbortController();
const { signal } = controller;
const grep = spawn('grep', ['ssh'], { signal });
grep.on('error', (err) => {
  // This will be called with err being an AbortError if the controller aborts
});
controller.abort(); // Stops the child process
```
:::


#### `options.detached` {#optionsdetached}

**Aggiunto in: v0.7.10**

Su Windows, impostare `options.detached` a `true` consente al processo figlio di continuare a essere eseguito dopo che il processo padre termina. Il processo figlio avrà la sua finestra della console. Una volta abilitato per un processo figlio, non può essere disabilitato.

Su piattaforme non Windows, se `options.detached` è impostato su `true`, il processo figlio diventerà il leader di un nuovo gruppo di processi e sessione. I processi figli possono continuare a essere eseguiti dopo che il processo padre termina, indipendentemente dal fatto che siano detached o meno. Vedere [`setsid(2)`](http://man7.org/linux/man-pages/man2/setsid.2) per maggiori informazioni.

Per impostazione predefinita, il processo padre aspetterà che il processo figlio detached termini. Per impedire al processo padre di aspettare che un determinato `subprocess` termini, usare il metodo `subprocess.unref()`. In questo modo, il ciclo di eventi del processo padre non includerà il processo figlio nel suo conteggio dei riferimenti, consentendo al processo padre di terminare indipendentemente dal processo figlio, a meno che non esista un canale IPC stabilito tra il processo figlio e il processo padre.

Quando si utilizza l'opzione `detached` per avviare un processo di lunga durata, il processo non rimarrà in esecuzione in background dopo che il processo padre termina, a meno che non venga fornita una configurazione `stdio` che non sia connessa al processo padre. Se lo `stdio` del processo padre viene ereditato, il processo figlio rimarrà collegato al terminale di controllo.

Esempio di un processo di lunga durata, tramite detached e ignorando anche i descrittori di file `stdio` del processo padre, al fine di ignorare la terminazione del processo padre:

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const process = require('node:process');

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
```

```js [ESM]
import { spawn } from 'node:child_process';
import process from 'node:process';

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
```
:::

In alternativa, si può reindirizzare l'output del processo figlio in file:

::: code-group
```js [CJS]
const { openSync } = require('node:fs');
const { spawn } = require('node:child_process');
const out = openSync('./out.log', 'a');
const err = openSync('./out.log', 'a');

const subprocess = spawn('prg', [], {
  detached: true,
  stdio: [ 'ignore', out, err ],
});

subprocess.unref();
```

```js [ESM]
import { openSync } from 'node:fs';
import { spawn } from 'node:child_process';
const out = openSync('./out.log', 'a');
const err = openSync('./out.log', 'a');

const subprocess = spawn('prg', [], {
  detached: true,
  stdio: [ 'ignore', out, err ],
});

subprocess.unref();
```
:::


#### `options.stdio` {#optionsstdio}

::: info [Cronologia]
| Versione  | Modifiche                                                                               |
| :-------- | :-------------------------------------------------------------------------------------- |
| v15.6.0, v14.18.0 | Aggiunta la flag stdio `overlapped`.                                                                   |
| v3.3.1    | Il valore `0` è ora accettato come descrittore di file.                                    |
| v0.7.10   | Aggiunto in: v0.7.10                                                                  |
:::

L'opzione `options.stdio` viene utilizzata per configurare i pipe che vengono stabiliti tra il processo padre e il processo figlio. Per impostazione predefinita, stdin, stdout e stderr del figlio vengono reindirizzati ai corrispondenti stream [`subprocess.stdin`](/it/nodejs/api/child_process#subprocessstdin), [`subprocess.stdout`](/it/nodejs/api/child_process#subprocessstdout) e [`subprocess.stderr`](/it/nodejs/api/child_process#subprocessstderr) sull'oggetto [`ChildProcess`](/it/nodejs/api/child_process#class-childprocess). Ciò equivale a impostare `options.stdio` uguale a `['pipe', 'pipe', 'pipe']`.

Per comodità, `options.stdio` può essere una delle seguenti stringhe:

- `'pipe'`: equivalente a `['pipe', 'pipe', 'pipe']` (il valore predefinito)
- `'overlapped'`: equivalente a `['overlapped', 'overlapped', 'overlapped']`
- `'ignore'`: equivalente a `['ignore', 'ignore', 'ignore']`
- `'inherit'`: equivalente a `['inherit', 'inherit', 'inherit']` oppure `[0, 1, 2]`

Altrimenti, il valore di `options.stdio` è un array in cui ogni indice corrisponde a un fd nel figlio. Gli fd 0, 1 e 2 corrispondono rispettivamente a stdin, stdout e stderr. È possibile specificare fd aggiuntivi per creare pipe aggiuntive tra il padre e il figlio. Il valore è uno dei seguenti:

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const process = require('node:process');

// Il figlio utilizzerà gli stdio del padre.
spawn('prg', [], { stdio: 'inherit' });

// Genera il figlio condividendo solo stderr.
spawn('prg', [], { stdio: ['pipe', 'pipe', process.stderr] });

// Apri un fd=4 extra, per interagire con programmi che presentano un'interfaccia
// in stile startd.
spawn('prg', [], { stdio: ['pipe', null, null, null, 'pipe'] });
```

```js [ESM]
import { spawn } from 'node:child_process';
import process from 'node:process';

// Il figlio utilizzerà gli stdio del padre.
spawn('prg', [], { stdio: 'inherit' });

// Genera il figlio condividendo solo stderr.
spawn('prg', [], { stdio: ['pipe', 'pipe', process.stderr] });

// Apri un fd=4 extra, per interagire con programmi che presentano un'interfaccia
// in stile startd.
spawn('prg', [], { stdio: ['pipe', null, null, null, 'pipe'] });
```
:::

*Vale la pena notare che quando viene stabilito un canale IPC tra i processi padre e figlio e il processo figlio è un'istanza di Node.js, il processo figlio viene avviato con il canale IPC non referenziato (utilizzando <code>unref()</code>) finché il processo figlio non registra un gestore di eventi per l'evento <a href="process.html#event-disconnect"><code>'disconnect'</code></a> o l'evento <a href="process.html#event-message"><code>'message'</code></a>. Ciò consente al processo figlio di terminare normalmente senza che il processo venga mantenuto aperto dal canale IPC aperto.* Vedi anche: [`child_process.exec()`](/it/nodejs/api/child_process#child_processexeccommand-options-callback) e [`child_process.fork()`](/it/nodejs/api/child_process#child_processforkmodulepath-args-options).


## Creazione sincrona del processo {#synchronous-process-creation}

I metodi [`child_process.spawnSync()`](/it/nodejs/api/child_process#child_processspawnsynccommand-args-options), [`child_process.execSync()`](/it/nodejs/api/child_process#child_processexecsynccommand-options) e [`child_process.execFileSync()`](/it/nodejs/api/child_process#child_processexecfilesyncfile-args-options) sono sincroni e bloccheranno il ciclo di eventi di Node.js, sospendendo l'esecuzione di qualsiasi codice aggiuntivo fino a quando il processo generato non si chiude.

Le chiamate bloccanti come queste sono per lo più utili per semplificare le attività di scripting generiche e per semplificare il caricamento/elaborazione della configurazione dell'applicazione all'avvio.

### `child_process.execFileSync(file[, args][, options])` {#child_processexecfilesyncfile-args-options}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v16.4.0, v14.18.0 | L'opzione `cwd` può essere un oggetto `URL` WHATWG utilizzando il protocollo `file:`. |
| v10.10.0 | L'opzione `input` ora può essere qualsiasi `TypedArray` o `DataView`. |
| v8.8.0 | L'opzione `windowsHide` è ora supportata. |
| v8.0.0 | L'opzione `input` ora può essere un `Uint8Array`. |
| v6.2.1, v4.5.0 | L'opzione `encoding` ora può essere impostata esplicitamente su `buffer`. |
| v0.11.12 | Aggiunto in: v0.11.12 |
:::

- `file` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il nome o il percorso del file eseguibile da eseguire.
- `args` [\<stringa[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Elenco di argomenti stringa.
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api) Directory di lavoro corrente del processo figlio.
    - `input` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Il valore che verrà passato come stdin al processo generato. Se `stdio[0]` è impostato su `'pipe'`, fornire questo valore sovrascriverà `stdio[0]`.
    - `stdio` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Configurazione stdio del figlio. Vedi [`child_process.spawn()`](/it/nodejs/api/child_process#child_processspawncommand-args-options)'s [`stdio`](/it/nodejs/api/child_process#optionsstdio). `stderr` per impostazione predefinita verrà inviato all'stderr del processo padre a meno che non sia specificato `stdio`. **Predefinito:** `'pipe'`.
    - `env` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Coppie chiave-valore dell'ambiente. **Predefinito:** `process.env`.
    - `uid` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Imposta l'identità utente del processo (vedi [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2)).
    - `gid` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Imposta l'identità del gruppo del processo (vedi [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2)).
    - `timeout` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) In millisecondi la quantità massima di tempo in cui è consentito l'esecuzione del processo. **Predefinito:** `undefined`.
    - `killSignal` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il valore del segnale da utilizzare quando il processo generato verrà terminato. **Predefinito:** `'SIGTERM'`.
    - `maxBuffer` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La quantità massima di dati in byte consentita su stdout o stderr. Se superata, il processo figlio viene terminato. Vedi avvertenza in [`maxBuffer` e Unicode](/it/nodejs/api/child_process#maxbuffer-and-unicode). **Predefinito:** `1024 * 1024`.
    - `encoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La codifica utilizzata per tutti gli input e output stdio. **Predefinito:** `'buffer'`.
    - `windowsHide` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Nascondi la finestra della console del sottoprocesso che normalmente verrebbe creata sui sistemi Windows. **Predefinito:** `false`.
    - `shell` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Se `true`, esegue `command` all'interno di una shell. Usa `'/bin/sh'` su Unix e `process.env.ComSpec` su Windows. Una shell diversa può essere specificata come stringa. Vedi [Requisiti della shell](/it/nodejs/api/child_process#shell-requirements) e [Shell Windows predefinita](/it/nodejs/api/child_process#default-windows-shell). **Predefinito:** `false` (nessuna shell).

- Restituisce: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'output standard dal comando.

Il metodo `child_process.execFileSync()` è generalmente identico a [`child_process.execFile()`](/it/nodejs/api/child_process#child_processexecfilefile-args-options-callback) con l'eccezione che il metodo non restituirà alcun valore fino a quando il processo figlio non sarà completamente chiuso. Quando si verifica un timeout e viene inviato `killSignal`, il metodo non restituirà alcun valore finché il processo non sarà completamente terminato.

Se il processo figlio intercetta e gestisce il segnale `SIGTERM` e non si chiude, il processo padre attenderà comunque fino a quando il processo figlio non si sarà chiuso.

Se il processo va in timeout o ha un codice di uscita diverso da zero, questo metodo genererà un [`Error`](/it/nodejs/api/errors#class-error) che includerà il risultato completo del sottostante [`child_process.spawnSync()`](/it/nodejs/api/child_process#child_processspawnsynccommand-args-options).

**Se l'opzione <code>shell</code> è abilitata, non passare input utente non sanitizzati a questa funzione. Qualsiasi input contenente metacaratteri della shell può essere utilizzato per attivare l'esecuzione di comandi arbitrari.**

::: code-group
```js [CJS]
const { execFileSync } = require('node:child_process');

try {
  const stdout = execFileSync('my-script.sh', ['my-arg'], {
    // Acquisisci stdout e stderr dal processo figlio. Sovrascrive il
    // comportamento predefinito dello streaming di stderr figlio all'stderr padre
    stdio: 'pipe',

    // Usa la codifica utf8 per le pipe stdio
    encoding: 'utf8',
  });

  console.log(stdout);
} catch (err) {
  if (err.code) {
    // Generazione del processo figlio non riuscita
    console.error(err.code);
  } else {
    // Il figlio è stato generato ma è uscito con un codice di uscita diverso da zero
    // L'errore contiene qualsiasi stdout e stderr dal figlio
    const { stdout, stderr } = err;

    console.error({ stdout, stderr });
  }
}
```

```js [ESM]
import { execFileSync } from 'node:child_process';

try {
  const stdout = execFileSync('my-script.sh', ['my-arg'], {
    // Acquisisci stdout e stderr dal processo figlio. Sovrascrive il
    // comportamento predefinito dello streaming di stderr figlio all'stderr padre
    stdio: 'pipe',

    // Usa la codifica utf8 per le pipe stdio
    encoding: 'utf8',
  });

  console.log(stdout);
} catch (err) {
  if (err.code) {
    // Generazione del processo figlio non riuscita
    console.error(err.code);
  } else {
    // Il figlio è stato generato ma è uscito con un codice di uscita diverso da zero
    // L'errore contiene qualsiasi stdout e stderr dal figlio
    const { stdout, stderr } = err;

    console.error({ stdout, stderr });
  }
}
```
:::


### `child_process.execSync(command[, options])` {#child_processexecsynccommand-options}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v16.4.0, v14.18.0 | L'opzione `cwd` può essere un oggetto `URL` WHATWG che utilizza il protocollo `file:`. |
| v10.10.0 | L'opzione `input` ora può essere qualsiasi `TypedArray` o `DataView`. |
| v8.8.0 | L'opzione `windowsHide` è ora supportata. |
| v8.0.0 | L'opzione `input` ora può essere un `Uint8Array`. |
| v0.11.12 | Aggiunto in: v0.11.12 |
:::

- `command` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il comando da eseguire.
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api) Directory di lavoro corrente del processo figlio.
    - `input` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Il valore che verrà passato come stdin al processo generato. Se `stdio[0]` è impostato su `'pipe'`, la fornitura di questo valore sovrascriverà `stdio[0]`.
    - `stdio` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Configurazione stdio del figlio. Vedere lo [`stdio`](/it/nodejs/api/child_process#optionsstdio) di [`child_process.spawn()`](/it/nodejs/api/child_process#child_processspawncommand-args-options). `stderr` per impostazione predefinita verrà inviato all'stderr del processo padre a meno che non sia specificato `stdio`. **Predefinito:** `'pipe'`.
    - `env` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Coppie chiave-valore dell'ambiente. **Predefinito:** `process.env`.
    - `shell` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Shell con cui eseguire il comando. Vedere [Requisiti della shell](/it/nodejs/api/child_process#shell-requirements) e [Shell Windows predefinita](/it/nodejs/api/child_process#default-windows-shell). **Predefinito:** `'/bin/sh'` su Unix, `process.env.ComSpec` su Windows.
    - `uid` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Imposta l'identità dell'utente del processo. (Vedere [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2)).
    - `gid` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Imposta l'identità del gruppo del processo. (Vedere [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2)).
    - `timeout` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) In millisecondi la quantità massima di tempo in cui il processo può essere eseguito. **Predefinito:** `undefined`.
    - `killSignal` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il valore del segnale da utilizzare quando il processo generato verrà terminato. **Predefinito:** `'SIGTERM'`.
    - `maxBuffer` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La quantità massima di dati in byte consentita su stdout o stderr. Se superata, il processo figlio viene terminato e qualsiasi output viene troncato. Vedere l'avvertenza in [`maxBuffer` e Unicode](/it/nodejs/api/child_process#maxbuffer-and-unicode). **Predefinito:** `1024 * 1024`.
    - `encoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La codifica utilizzata per tutti gli input e gli output stdio. **Predefinito:** `'buffer'`.
    - `windowsHide` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Nasconde la finestra della console del sottoprocesso che normalmente verrebbe creata sui sistemi Windows. **Predefinito:** `false`.


- Restituisce: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'stdout dal comando.

Il metodo `child_process.execSync()` è generalmente identico a [`child_process.exec()`](/it/nodejs/api/child_process#child_processexeccommand-options-callback) con l'eccezione che il metodo non restituirà nulla finché il processo figlio non sarà completamente chiuso. Quando si è verificato un timeout ed è stato inviato `killSignal`, il metodo non restituirà nulla finché il processo non sarà completamente terminato. Se il processo figlio intercetta e gestisce il segnale `SIGTERM` e non termina, il processo padre attenderà fino a quando il processo figlio non sarà terminato.

Se il processo scade o ha un codice di uscita diverso da zero, questo metodo genererà un'eccezione. L'oggetto [`Error`](/it/nodejs/api/errors#class-error) conterrà l'intero risultato da [`child_process.spawnSync()`](/it/nodejs/api/child_process#child_processspawnsynccommand-args-options).

**Non passare mai input utente non sanitizzati a questa funzione. Qualsiasi input contenente meta caratteri della shell può essere utilizzato per attivare l'esecuzione di comandi arbitrari.**


### `child_process.spawnSync(command[, args][, options])` {#child_processspawnsynccommand-args-options}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v16.4.0, v14.18.0 | L'opzione `cwd` può essere un oggetto `URL` WHATWG utilizzando il protocollo `file:`. |
| v10.10.0 | L'opzione `input` ora può essere qualsiasi `TypedArray` o `DataView`. |
| v8.8.0 | L'opzione `windowsHide` è ora supportata. |
| v8.0.0 | L'opzione `input` ora può essere un `Uint8Array`. |
| v5.7.0 | L'opzione `shell` è ora supportata. |
| v6.2.1, v4.5.0 | L'opzione `encoding` può ora essere impostata esplicitamente su `buffer`. |
| v0.11.12 | Aggiunto in: v0.11.12 |
:::

- `command` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il comando da eseguire.
- `args` [\<stringa[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Elenco di argomenti stringa.
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/it/nodejs/api/url#the-whatwg-url-api) Directory di lavoro corrente del processo figlio.
    - `input` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Il valore che verrà passato come stdin al processo generato. Se `stdio[0]` è impostato su `'pipe'`, la fornitura di questo valore sovrascriverà `stdio[0]`.
    - `argv0` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Imposta esplicitamente il valore di `argv[0]` inviato al processo figlio. Questo verrà impostato su `command` se non specificato.
    - `stdio` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Configurazione stdio del figlio. Consulta [`child_process.spawn()`](/it/nodejs/api/child_process#child_processspawncommand-args-options)'s [`stdio`](/it/nodejs/api/child_process#optionsstdio). **Predefinito:** `'pipe'`.
    - `env` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Coppie chiave-valore dell'ambiente. **Predefinito:** `process.env`.
    - `uid` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Imposta l'identità utente del processo (vedere [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2)).
    - `gid` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Imposta l'identità del gruppo del processo (vedere [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2)).
    - `timeout` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) In millisecondi la quantità massima di tempo in cui il processo può essere eseguito. **Predefinito:** `undefined`.
    - `killSignal` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il valore del segnale da utilizzare quando il processo generato verrà terminato. **Predefinito:** `'SIGTERM'`.
    - `maxBuffer` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La quantità massima di dati in byte consentita su stdout o stderr. Se superata, il processo figlio viene terminato e qualsiasi output viene troncato. Vedi l'avvertenza su [`maxBuffer` e Unicode](/it/nodejs/api/child_process#maxbuffer-and-unicode). **Predefinito:** `1024 * 1024`.
    - `encoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La codifica utilizzata per tutti gli input e output stdio. **Predefinito:** `'buffer'`.
    - `shell` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Se `true`, esegue `command` all'interno di una shell. Utilizza `'/bin/sh'` su Unix e `process.env.ComSpec` su Windows. È possibile specificare una shell diversa come stringa. Vedi [Requisiti della shell](/it/nodejs/api/child_process#shell-requirements) e [Shell predefinita di Windows](/it/nodejs/api/child_process#default-windows-shell). **Predefinito:** `false` (nessuna shell).
    - `windowsVerbatimArguments` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Nessuna citazione o escape degli argomenti viene eseguita su Windows. Ignorato su Unix. Questo viene impostato automaticamente su `true` quando viene specificato `shell` ed è CMD. **Predefinito:** `false`.
    - `windowsHide` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Nasconde la finestra della console del sottoprocesso che normalmente verrebbe creata sui sistemi Windows. **Predefinito:** `false`.
  
 
- Restituisce: [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `pid` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Pid del processo figlio.
    - `output` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Array di risultati dall'output stdio.
    - `stdout` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il contenuto di `output[1]`.
    - `stderr` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il contenuto di `output[2]`.
    - `status` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) Il codice di uscita del sottoprocesso o `null` se il sottoprocesso è terminato a causa di un segnale.
    - `signal` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) Il segnale utilizzato per terminare il sottoprocesso o `null` se il sottoprocesso non è terminato a causa di un segnale.
    - `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) L'oggetto di errore se il processo figlio non è riuscito o è scaduto.
  
 

Il metodo `child_process.spawnSync()` è generalmente identico a [`child_process.spawn()`](/it/nodejs/api/child_process#child_processspawncommand-args-options) con l'eccezione che la funzione non restituirà fino a quando il processo figlio non sarà completamente chiuso. Quando si è verificato un timeout e viene inviato `killSignal`, il metodo non restituirà finché il processo non sarà uscito completamente. Se il processo intercetta e gestisce il segnale `SIGTERM` e non esce, il processo padre attenderà fino a quando il processo figlio non sarà uscito.

**Se l'opzione <code>shell</code> è abilitata, non passare input utente non sanitizzati a questa funzione. Qualsiasi input contenente metacaratteri di shell può essere utilizzato per attivare l'esecuzione arbitraria di comandi.**


## Classe: `ChildProcess` {#class-childprocess}

**Aggiunto in: v2.2.0**

- Estende: [\<EventEmitter\>](/it/nodejs/api/events#class-eventemitter)

Le istanze di `ChildProcess` rappresentano processi figlio generati.

Non è previsto che le istanze di `ChildProcess` vengano create direttamente. Invece, utilizzare i metodi [`child_process.spawn()`](/it/nodejs/api/child_process#child_processspawncommand-args-options), [`child_process.exec()`](/it/nodejs/api/child_process#child_processexeccommand-options-callback), [`child_process.execFile()`](/it/nodejs/api/child_process#child_processexecfilefile-args-options-callback) o [`child_process.fork()`](/it/nodejs/api/child_process#child_processforkmodulepath-args-options) per creare istanze di `ChildProcess`.

### Evento: `'close'` {#event-close}

**Aggiunto in: v0.7.7**

- `code` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il codice di uscita se il processo figlio è terminato autonomamente.
- `signal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il segnale con cui è stato terminato il processo figlio.

L'evento `'close'` viene emesso dopo che un processo è terminato *e* i flussi stdio di un processo figlio sono stati chiusi. Questo è diverso dall'evento [`'exit'`](/it/nodejs/api/child_process#event-exit), poiché più processi potrebbero condividere gli stessi flussi stdio. L'evento `'close'` verrà sempre emesso dopo che [`'exit'`](/it/nodejs/api/child_process#event-exit) è già stato emesso, oppure [`'error'`](/it/nodejs/api/child_process#event-error) se il processo figlio non è riuscito a generarsi.

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process close all stdio with code ${code}`);
});

ls.on('exit', (code) => {
  console.log(`child process exited with code ${code}`);
});
```

```js [ESM]
import { spawn } from 'node:child_process';
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process close all stdio with code ${code}`);
});

ls.on('exit', (code) => {
  console.log(`child process exited with code ${code}`);
});
```
:::


### Evento: `'disconnect'` {#event-disconnect}

**Aggiunto in: v0.7.2**

L'evento `'disconnect'` viene emesso dopo aver chiamato il metodo [`subprocess.disconnect()`](/it/nodejs/api/child_process#subprocessdisconnect) nel processo padre o [`process.disconnect()`](/it/nodejs/api/process#processdisconnect) nel processo figlio. Dopo la disconnessione, non è più possibile inviare o ricevere messaggi e la proprietà [`subprocess.connected`](/it/nodejs/api/child_process#subprocessconnected) è `false`.

### Evento: `'error'` {#event-error}

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) L'errore.

L'evento `'error'` viene emesso ogni volta che:

- Il processo non può essere generato.
- Il processo non può essere terminato.
- L'invio di un messaggio al processo figlio non è riuscito.
- Il processo figlio è stato interrotto tramite l'opzione `signal`.

L'evento `'exit'` può essere attivato o meno dopo che si è verificato un errore. Quando si ascoltano sia gli eventi `'exit'` che `'error'`, proteggersi dall'invocazione accidentale delle funzioni di gestione più volte.

Vedere anche [`subprocess.kill()`](/it/nodejs/api/child_process#subprocesskillsignal) e [`subprocess.send()`](/it/nodejs/api/child_process#subprocesssendmessage-sendhandle-options-callback).

### Evento: `'exit'` {#event-exit}

**Aggiunto in: v0.1.90**

- `code` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il codice di uscita se il processo figlio è terminato autonomamente.
- `signal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il segnale con cui è stato terminato il processo figlio.

L'evento `'exit'` viene emesso dopo la fine del processo figlio. Se il processo è terminato, `code` è il codice di uscita finale del processo, altrimenti `null`. Se il processo è terminato a causa della ricezione di un segnale, `signal` è il nome stringa del segnale, altrimenti `null`. Uno dei due sarà sempre diverso da `null`.

Quando viene attivato l'evento `'exit'`, i flussi stdio del processo figlio potrebbero essere ancora aperti.

Node.js stabilisce gestori di segnale per `SIGINT` e `SIGTERM` e i processi Node.js non termineranno immediatamente a causa della ricezione di tali segnali. Piuttosto, Node.js eseguirà una sequenza di azioni di pulizia e quindi rilancerà il segnale gestito.

Vedere [`waitpid(2)`](http://man7.org/linux/man-pages/man2/waitpid.2).


### Evento: `'message'` {#event-message}

**Aggiunto in: v0.5.9**

- `message` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un oggetto JSON analizzato o un valore primitivo.
- `sendHandle` [\<Handle\>](/it/nodejs/api/net#serverlistenhandle-backlog-callback) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) `undefined` o un oggetto [`net.Socket`](/it/nodejs/api/net#class-netsocket), [`net.Server`](/it/nodejs/api/net#class-netserver) o [`dgram.Socket`](/it/nodejs/api/dgram#class-dgramsocket).

L'evento `'message'` viene attivato quando un processo figlio utilizza [`process.send()`](/it/nodejs/api/process#processsendmessage-sendhandle-options-callback) per inviare messaggi.

Il messaggio passa attraverso la serializzazione e l'analisi. Il messaggio risultante potrebbe non essere lo stesso di quello inviato originariamente.

Se l'opzione `serialization` è stata impostata su `'advanced'` utilizzata durante la generazione del processo figlio, l'argomento `message` può contenere dati che JSON non è in grado di rappresentare. Vedere [Serializzazione avanzata](/it/nodejs/api/child_process#advanced-serialization) per maggiori dettagli.

### Evento: `'spawn'` {#event-spawn}

**Aggiunto in: v15.1.0, v14.17.0**

L'evento `'spawn'` viene emesso una volta che il processo figlio è stato generato con successo. Se il processo figlio non viene generato correttamente, l'evento `'spawn'` non viene emesso e viene emesso invece l'evento `'error'`.

Se emesso, l'evento `'spawn'` viene prima di tutti gli altri eventi e prima che qualsiasi dato venga ricevuto tramite `stdout` o `stderr`.

L'evento `'spawn'` si attiverà indipendentemente dal fatto che si verifichi un errore **all'interno** del processo generato. Ad esempio, se `bash some-command` viene generato correttamente, l'evento `'spawn'` si attiverà, anche se `bash` potrebbe non riuscire a generare `some-command`. Questa avvertenza si applica anche quando si utilizza `{ shell: true }`.

### `subprocess.channel` {#subprocesschannel}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v14.0.0 | L'oggetto non espone più accidentalmente i binding C++ nativi. |
| v7.1.0 | Aggiunto in: v7.1.0 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Una pipe che rappresenta il canale IPC verso il processo figlio.

La proprietà `subprocess.channel` è un riferimento al canale IPC del figlio. Se non esiste alcun canale IPC, questa proprietà è `undefined`.


#### `subprocess.channel.ref()` {#subprocesschannelref}

**Aggiunto in: v7.1.0**

Questo metodo fa sì che il canale IPC mantenga in esecuzione il ciclo di eventi del processo padre se `.unref()` è stato chiamato in precedenza.

#### `subprocess.channel.unref()` {#subprocesschannelunref}

**Aggiunto in: v7.1.0**

Questo metodo fa sì che il canale IPC non mantenga in esecuzione il ciclo di eventi del processo padre e gli consente di terminare anche mentre il canale è aperto.

### `subprocess.connected` {#subprocessconnected}

**Aggiunto in: v0.7.2**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Impostato su `false` dopo che è stato chiamato `subprocess.disconnect()`.

La proprietà `subprocess.connected` indica se è ancora possibile inviare e ricevere messaggi da un processo figlio. Quando `subprocess.connected` è `false`, non è più possibile inviare o ricevere messaggi.

### `subprocess.disconnect()` {#subprocessdisconnect}

**Aggiunto in: v0.7.2**

Chiude il canale IPC tra processi padre e figlio, consentendo al processo figlio di uscire normalmente una volta che non ci sono altre connessioni che lo mantengono attivo. Dopo aver chiamato questo metodo, le proprietà `subprocess.connected` e `process.connected` sia nel processo padre che nel processo figlio (rispettivamente) saranno impostate su `false` e non sarà più possibile passare messaggi tra i processi.

L'evento `'disconnect'` verrà emesso quando non ci sono messaggi in fase di ricezione. Questo verrà molto spesso attivato immediatamente dopo aver chiamato `subprocess.disconnect()`.

Quando il processo figlio è un'istanza di Node.js (ad esempio, generata usando [`child_process.fork()`](/it/nodejs/api/child_process#child_processforkmodulepath-args-options)), il metodo `process.disconnect()` può essere invocato all'interno del processo figlio per chiudere anche il canale IPC.

### `subprocess.exitCode` {#subprocessexitcode}

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La proprietà `subprocess.exitCode` indica il codice di uscita del processo figlio. Se il processo figlio è ancora in esecuzione, il campo sarà `null`.

### `subprocess.kill([signal])` {#subprocesskillsignal}

**Aggiunto in: v0.1.90**

- `signal` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Il metodo `subprocess.kill()` invia un segnale al processo figlio. Se non viene fornito alcun argomento, al processo verrà inviato il segnale `'SIGTERM'`. Vedere [`signal(7)`](http://man7.org/linux/man-pages/man7/signal.7) per un elenco dei segnali disponibili. Questa funzione restituisce `true` se [`kill(2)`](http://man7.org/linux/man-pages/man2/kill.2) ha esito positivo e `false` in caso contrario.

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const grep = spawn('grep', ['ssh']);

grep.on('close', (code, signal) => {
  console.log(
    `child process terminated due to receipt of signal ${signal}`);
});

// Send SIGHUP to process.
grep.kill('SIGHUP');
```

```js [ESM]
import { spawn } from 'node:child_process';
const grep = spawn('grep', ['ssh']);

grep.on('close', (code, signal) => {
  console.log(
    `child process terminated due to receipt of signal ${signal}`);
});

// Send SIGHUP to process.
grep.kill('SIGHUP');
```
:::

L'oggetto [`ChildProcess`](/it/nodejs/api/child_process#class-childprocess) può emettere un evento [`'error'`](/it/nodejs/api/child_process#event-error) se il segnale non può essere recapitato. L'invio di un segnale a un processo figlio che è già terminato non è un errore, ma può avere conseguenze impreviste. In particolare, se l'identificatore del processo (PID) è stato riassegnato a un altro processo, il segnale verrà recapitato a quel processo, il che può avere risultati inattesi.

Sebbene la funzione sia chiamata `kill`, il segnale recapitato al processo figlio potrebbe non terminare effettivamente il processo.

Vedere [`kill(2)`](http://man7.org/linux/man-pages/man2/kill.2) per riferimento.

Su Windows, dove i segnali POSIX non esistono, l'argomento `signal` verrà ignorato tranne che per `'SIGKILL'`, `'SIGTERM'`, `'SIGINT'` e `'SIGQUIT'`, e il processo verrà sempre terminato con forza e bruscamente (simile a `'SIGKILL'`). Vedere [Eventi di segnale](/it/nodejs/api/process#signal-events) per maggiori dettagli.

Su Linux, i processi figlio dei processi figlio non verranno terminati quando si tenta di terminare il loro padre. È probabile che ciò accada quando si esegue un nuovo processo in una shell o con l'uso dell'opzione `shell` di `ChildProcess`:

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');

const subprocess = spawn(
  'sh',
  [
    '-c',
    `node -e "setInterval(() => {
      console.log(process.pid, 'is alive')
    }, 500);"`,
  ], {
    stdio: ['inherit', 'inherit', 'inherit'],
  },
);

setTimeout(() => {
  subprocess.kill(); // Does not terminate the Node.js process in the shell.
}, 2000);
```

```js [ESM]
import { spawn } from 'node:child_process';

const subprocess = spawn(
  'sh',
  [
    '-c',
    `node -e "setInterval(() => {
      console.log(process.pid, 'is alive')
    }, 500);"`,
  ], {
    stdio: ['inherit', 'inherit', 'inherit'],
  },
);

setTimeout(() => {
  subprocess.kill(); // Does not terminate the Node.js process in the shell.
}, 2000);
```
:::


### `subprocess[Symbol.dispose]()` {#subprocesssymboldispose}

**Aggiunto in: v20.5.0, v18.18.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

Chiama [`subprocess.kill()`](/it/nodejs/api/child_process#subprocesskillsignal) con `'SIGTERM'`.

### `subprocess.killed` {#subprocesskilled}

**Aggiunto in: v0.5.10**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Impostato su `true` dopo che `subprocess.kill()` viene utilizzato per inviare con successo un segnale al processo figlio.

La proprietà `subprocess.killed` indica se il processo figlio ha ricevuto con successo un segnale da `subprocess.kill()`. La proprietà `killed` non indica che il processo figlio è stato terminato.

### `subprocess.pid` {#subprocesspid}

**Aggiunto in: v0.1.90**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Restituisce l'identificativo del processo (PID) del processo figlio. Se il processo figlio non riesce a generarsi a causa di errori, allora il valore è `undefined` e viene emesso `error`.

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const grep = spawn('grep', ['ssh']);

console.log(`PID del figlio generato: ${grep.pid}`);
grep.stdin.end();
```

```js [ESM]
import { spawn } from 'node:child_process';
const grep = spawn('grep', ['ssh']);

console.log(`PID del figlio generato: ${grep.pid}`);
grep.stdin.end();
```
:::

### `subprocess.ref()` {#subprocessref}

**Aggiunto in: v0.7.10**

Chiamare `subprocess.ref()` dopo aver effettuato una chiamata a `subprocess.unref()` ripristinerà il conteggio dei riferimenti rimosso per il processo figlio, forzando il processo padre ad attendere che il processo figlio esca prima di uscire a sua volta.

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const process = require('node:process');

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
subprocess.ref();
```

```js [ESM]
import { spawn } from 'node:child_process';
import process from 'node:process';

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
subprocess.ref();
```
:::


### `subprocess.send(message[, sendHandle[, options]][, callback])` {#subprocesssendmessage-sendhandle-options-callback}

::: info [Cronologia]
| Versione | Modifiche |
|---|---|
| v5.8.0 | Il parametro `options`, e in particolare l'opzione `keepOpen`, è ora supportato. |
| v5.0.0 | Questo metodo ora restituisce un booleano per il controllo del flusso. |
| v4.0.0 | Il parametro `callback` è ora supportato. |
| v0.5.9 | Aggiunto in: v0.5.9 |
:::

- `message` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `sendHandle` [\<Handle\>](/it/nodejs/api/net#serverlistenhandle-backlog-callback) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) `undefined`, oppure un oggetto [`net.Socket`](/it/nodejs/api/net#class-netsocket), [`net.Server`](/it/nodejs/api/net#class-netserver), o [`dgram.Socket`](/it/nodejs/api/dgram#class-dgramsocket).
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) L'argomento `options`, se presente, è un oggetto utilizzato per parametrizzare l'invio di determinati tipi di handle. `options` supporta le seguenti proprietà:
    - `keepOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Un valore che può essere utilizzato quando si passano istanze di `net.Socket`. Quando `true`, il socket viene mantenuto aperto nel processo di invio. **Predefinito:** `false`.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Quando è stato stabilito un canale IPC tra il processo padre e quello figlio (ovvero quando si utilizza [`child_process.fork()`](/it/nodejs/api/child_process#child_processforkmodulepath-args-options)), il metodo `subprocess.send()` può essere utilizzato per inviare messaggi al processo figlio. Quando il processo figlio è un'istanza di Node.js, questi messaggi possono essere ricevuti tramite l'evento [`'message'`](/it/nodejs/api/process#event-message).

Il messaggio passa attraverso la serializzazione e l'analisi. Il messaggio risultante potrebbe non essere lo stesso di quello inviato originariamente.

Ad esempio, nello script padre:

::: code-group
```js [CJS]
const { fork } = require('node:child_process');
const forkedProcess = fork(`${__dirname}/sub.js`);

forkedProcess.on('message', (message) => {
  console.log('PARENT got message:', message);
});

// Fa sì che il figlio stampi: CHILD got message: { hello: 'world' }
forkedProcess.send({ hello: 'world' });
```

```js [ESM]
import { fork } from 'node:child_process';
const forkedProcess = fork(`${import.meta.dirname}/sub.js`);

forkedProcess.on('message', (message) => {
  console.log('PARENT got message:', message);
});

// Fa sì che il figlio stampi: CHILD got message: { hello: 'world' }
forkedProcess.send({ hello: 'world' });
```
:::

E quindi lo script figlio, `'sub.js'` potrebbe apparire così:

```js [ESM]
process.on('message', (message) => {
  console.log('CHILD got message:', message);
});

// Fa sì che il padre stampi: PARENT got message: { foo: 'bar', baz: null }
process.send({ foo: 'bar', baz: NaN });
```

I processi figlio di Node.js avranno un metodo [`process.send()`](/it/nodejs/api/process#processsendmessage-sendhandle-options-callback) proprio che consente al processo figlio di inviare messaggi al processo padre.

C'è un caso speciale quando si invia un messaggio `{cmd: 'NODE_foo'}`. I messaggi contenenti un prefisso `NODE_` nella proprietà `cmd` sono riservati per l'uso all'interno del core di Node.js e non verranno emessi nell'evento [`'message'`](/it/nodejs/api/process#event-message) del figlio. Piuttosto, tali messaggi vengono emessi utilizzando l'evento `'internalMessage'` e vengono consumati internamente da Node.js. Le applicazioni dovrebbero evitare di utilizzare tali messaggi o di ascoltare gli eventi `'internalMessage'` poiché sono soggetti a modifiche senza preavviso.

L'argomento opzionale `sendHandle` che può essere passato a `subprocess.send()` serve per passare un server TCP o un oggetto socket al processo figlio. Il processo figlio riceverà l'oggetto come secondo argomento passato alla funzione di callback registrata sull'evento [`'message'`](/it/nodejs/api/process#event-message). Tutti i dati ricevuti e memorizzati nel buffer nel socket non verranno inviati al figlio. L'invio di socket IPC non è supportato su Windows.

La `callback` opzionale è una funzione che viene richiamata dopo che il messaggio è stato inviato ma prima che il processo figlio possa averlo ricevuto. La funzione viene chiamata con un singolo argomento: `null` in caso di successo oppure un oggetto [`Error`](/it/nodejs/api/errors#class-error) in caso di errore.

Se non viene fornita alcuna funzione `callback` e il messaggio non può essere inviato, verrà emesso un evento `'error'` dall'oggetto [`ChildProcess`](/it/nodejs/api/child_process#class-childprocess). Questo può accadere, ad esempio, quando il processo figlio è già uscito.

`subprocess.send()` restituirà `false` se il canale è stato chiuso o quando il backlog di messaggi non inviati supera una soglia che rende imprudente inviarne altri. Altrimenti, il metodo restituisce `true`. La funzione `callback` può essere utilizzata per implementare il controllo del flusso.


#### Esempio: invio di un oggetto server {#example-sending-a-server-object}

L'argomento `sendHandle` può essere utilizzato, ad esempio, per passare l'handle di un oggetto server TCP al processo figlio come illustrato nell'esempio seguente:

::: code-group
```js [CJS]
const { fork } = require('node:child_process');
const { createServer } = require('node:net');

const subprocess = fork('subprocess.js');

// Apri l'oggetto server e invia l'handle.
const server = createServer();
server.on('connection', (socket) => {
  socket.end('gestito dal padre');
});
server.listen(1337, () => {
  subprocess.send('server', server);
});
```

```js [ESM]
import { fork } from 'node:child_process';
import { createServer } from 'node:net';

const subprocess = fork('subprocess.js');

// Apri l'oggetto server e invia l'handle.
const server = createServer();
server.on('connection', (socket) => {
  socket.end('gestito dal padre');
});
server.listen(1337, () => {
  subprocess.send('server', server);
});
```
:::

Il processo figlio riceverebbe quindi l'oggetto server come:

```js [ESM]
process.on('message', (m, server) => {
  if (m === 'server') {
    server.on('connection', (socket) => {
      socket.end('gestito dal figlio');
    });
  }
});
```
Una volta che il server è condiviso tra il processo padre e figlio, alcune connessioni possono essere gestite dal padre e altre dal figlio.

Mentre l'esempio precedente utilizza un server creato utilizzando il modulo `node:net`, i server del modulo `node:dgram` utilizzano esattamente lo stesso flusso di lavoro con le eccezioni dell'ascolto di un evento `'message'` invece di `'connection'` e dell'utilizzo di `server.bind()` invece di `server.listen()`. Questo, tuttavia, è supportato solo su piattaforme Unix.

#### Esempio: invio di un oggetto socket {#example-sending-a-socket-object}

Allo stesso modo, l'argomento `sendHandler` può essere utilizzato per passare l'handle di un socket al processo figlio. L'esempio seguente genera due processi figli che gestiscono ciascuno le connessioni con priorità "normale" o "speciale":

::: code-group
```js [CJS]
const { fork } = require('node:child_process');
const { createServer } = require('node:net');

const normal = fork('subprocess.js', ['normal']);
const special = fork('subprocess.js', ['special']);

// Apri il server e invia i socket al figlio. Usa pauseOnConnect per impedire
// che i socket vengano letti prima di essere inviati al processo figlio.
const server = createServer({ pauseOnConnect: true });
server.on('connection', (socket) => {

  // Se questa è una priorità speciale...
  if (socket.remoteAddress === '74.125.127.100') {
    special.send('socket', socket);
    return;
  }
  // Questa è una priorità normale.
  normal.send('socket', socket);
});
server.listen(1337);
```

```js [ESM]
import { fork } from 'node:child_process';
import { createServer } from 'node:net';

const normal = fork('subprocess.js', ['normal']);
const special = fork('subprocess.js', ['special']);

// Apri il server e invia i socket al figlio. Usa pauseOnConnect per impedire
// che i socket vengano letti prima di essere inviati al processo figlio.
const server = createServer({ pauseOnConnect: true });
server.on('connection', (socket) => {

  // Se questa è una priorità speciale...
  if (socket.remoteAddress === '74.125.127.100') {
    special.send('socket', socket);
    return;
  }
  // Questa è una priorità normale.
  normal.send('socket', socket);
});
server.listen(1337);
```
:::

`subprocess.js` riceverebbe l'handle del socket come secondo argomento passato alla funzione di callback dell'evento:

```js [ESM]
process.on('message', (m, socket) => {
  if (m === 'socket') {
    if (socket) {
      // Controlla che il socket client esista.
      // È possibile che il socket venga chiuso tra il momento in cui viene
      // inviato e il momento in cui viene ricevuto nel processo figlio.
      socket.end(`Richiesta gestita con priorità ${process.argv[2]}`);
    }
  }
});
```
Non usare `.maxConnections` su un socket che è stato passato a un subprocesso. Il padre non può tracciare quando il socket viene distrutto.

Qualsiasi gestore `'message'` nel subprocesso deve verificare che `socket` esista, poiché la connessione potrebbe essere stata chiusa durante il tempo necessario per inviare la connessione al figlio.


### `subprocess.signalCode` {#subprocesssignalcode}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

La proprietà `subprocess.signalCode` indica il segnale ricevuto dal processo figlio, se presente, altrimenti `null`.

### `subprocess.spawnargs` {#subprocessspawnargs}

- [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

La proprietà `subprocess.spawnargs` rappresenta l'elenco completo degli argomenti della riga di comando con cui è stato avviato il processo figlio.

### `subprocess.spawnfile` {#subprocessspawnfile}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La proprietà `subprocess.spawnfile` indica il nome del file eseguibile del processo figlio avviato.

Per [`child_process.fork()`](/it/nodejs/api/child_process#child_processforkmodulepath-args-options), il suo valore sarà uguale a [`process.execPath`](/it/nodejs/api/process#processexecpath). Per [`child_process.spawn()`](/it/nodejs/api/child_process#child_processspawncommand-args-options), il suo valore sarà il nome del file eseguibile. Per [`child_process.exec()`](/it/nodejs/api/child_process#child_processexeccommand-options-callback), il suo valore sarà il nome della shell in cui viene avviato il processo figlio.

### `subprocess.stderr` {#subprocessstderr}

**Aggiunto in: v0.1.90**

- [\<stream.Readable\>](/it/nodejs/api/stream#class-streamreadable) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Un `Readable Stream` che rappresenta lo `stderr` del processo figlio.

Se il processo figlio è stato generato con `stdio[2]` impostato su qualcosa di diverso da `'pipe'`, allora questo sarà `null`.

`subprocess.stderr` è un alias per `subprocess.stdio[2]`. Entrambe le proprietà faranno riferimento allo stesso valore.

La proprietà `subprocess.stderr` può essere `null` o `undefined` se il processo figlio non è stato generato correttamente.


### `subprocess.stdin` {#subprocessstdin}

**Aggiunto in: v0.1.90**

- [\<stream.Writable\>](/it/nodejs/api/stream#class-streamwritable) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Uno `Stream Writable` che rappresenta lo `stdin` del processo figlio.

Se un processo figlio attende di leggere tutto il suo input, il processo figlio non continuerà finché questo stream non sarà stato chiuso tramite `end()`.

Se il processo figlio è stato generato con `stdio[0]` impostato su qualcosa di diverso da `'pipe'`, allora questo sarà `null`.

`subprocess.stdin` è un alias per `subprocess.stdio[0]`. Entrambe le proprietà si riferiranno allo stesso valore.

La proprietà `subprocess.stdin` può essere `null` o `undefined` se il processo figlio non è stato generato con successo.

### `subprocess.stdio` {#subprocessstdio}

**Aggiunto in: v0.7.10**

- [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

Un array sparso di pipe al processo figlio, corrispondenti alle posizioni nell'opzione [`stdio`](/it/nodejs/api/child_process#optionsstdio) passata a [`child_process.spawn()`](/it/nodejs/api/child_process#child_processspawncommand-args-options) che sono state impostate sul valore `'pipe'`. `subprocess.stdio[0]`, `subprocess.stdio[1]` e `subprocess.stdio[2]` sono disponibili anche come `subprocess.stdin`, `subprocess.stdout` e `subprocess.stderr`, rispettivamente.

Nell'esempio seguente, solo il fd `1` (stdout) del figlio è configurato come una pipe, quindi solo il `subprocess.stdio[1]` del genitore è uno stream, tutti gli altri valori nell'array sono `null`.

::: code-group
```js [CJS]
const assert = require('node:assert');
const fs = require('node:fs');
const child_process = require('node:child_process');

const subprocess = child_process.spawn('ls', {
  stdio: [
    0, // Usa stdin del genitore per il figlio.
    'pipe', // Invia stdout del figlio al genitore tramite pipe.
    fs.openSync('err.out', 'w'), // Invia stderr del figlio a un file.
  ],
});

assert.strictEqual(subprocess.stdio[0], null);
assert.strictEqual(subprocess.stdio[0], subprocess.stdin);

assert(subprocess.stdout);
assert.strictEqual(subprocess.stdio[1], subprocess.stdout);

assert.strictEqual(subprocess.stdio[2], null);
assert.strictEqual(subprocess.stdio[2], subprocess.stderr);
```

```js [ESM]
import assert from 'node:assert';
import fs from 'node:fs';
import child_process from 'node:child_process';

const subprocess = child_process.spawn('ls', {
  stdio: [
    0, // Usa stdin del genitore per il figlio.
    'pipe', // Invia stdout del figlio al genitore tramite pipe.
    fs.openSync('err.out', 'w'), // Invia stderr del figlio a un file.
  ],
});

assert.strictEqual(subprocess.stdio[0], null);
assert.strictEqual(subprocess.stdio[0], subprocess.stdin);

assert(subprocess.stdout);
assert.strictEqual(subprocess.stdio[1], subprocess.stdout);

assert.strictEqual(subprocess.stdio[2], null);
assert.strictEqual(subprocess.stdio[2], subprocess.stderr);
```
:::

La proprietà `subprocess.stdio` può essere `undefined` se il processo figlio non è stato generato con successo.


### `subprocess.stdout` {#subprocessstdout}

**Aggiunto in: v0.1.90**

- [\<stream.Readable\>](/it/nodejs/api/stream#class-streamreadable) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Uno `Stream Leggibile` che rappresenta `stdout` del processo figlio.

Se il processo figlio è stato generato con `stdio[1]` impostato su un valore diverso da `'pipe'`, allora questo sarà `null`.

`subprocess.stdout` è un alias per `subprocess.stdio[1]`. Entrambe le proprietà faranno riferimento allo stesso valore.

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');

const subprocess = spawn('ls');

subprocess.stdout.on('data', (data) => {
  console.log(`Received chunk ${data}`);
});
```

```js [ESM]
import { spawn } from 'node:child_process';

const subprocess = spawn('ls');

subprocess.stdout.on('data', (data) => {
  console.log(`Received chunk ${data}`);
});
```
:::

La proprietà `subprocess.stdout` può essere `null` o `undefined` se il processo figlio non può essere generato correttamente.

### `subprocess.unref()` {#subprocessunref}

**Aggiunto in: v0.7.10**

Per impostazione predefinita, il processo padre attenderà l'uscita del processo figlio disaccoppiato. Per evitare che il processo padre attenda l'uscita di una determinata `subprocess`, utilizzare il metodo `subprocess.unref()`. In questo modo, il ciclo di eventi del padre non includerà il processo figlio nel suo conteggio dei riferimenti, consentendo al padre di uscire indipendentemente dal figlio, a meno che non esista un canale IPC stabilito tra il figlio e i processi padre.

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const process = require('node:process');

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
```

```js [ESM]
import { spawn } from 'node:child_process';
import process from 'node:process';

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
```
:::


## `maxBuffer` e Unicode {#maxbuffer-and-unicode}

L'opzione `maxBuffer` specifica il numero massimo di byte consentiti su `stdout` o `stderr`. Se questo valore viene superato, il processo figlio viene terminato. Ciò influisce sull'output che include codifiche di caratteri multibyte come UTF-8 o UTF-16. Ad esempio, `console.log('中文测试')` invierà 13 byte codificati in UTF-8 a `stdout` sebbene ci siano solo 4 caratteri.

## Requisiti della shell {#shell-requirements}

La shell dovrebbe capire l'interruttore `-c`. Se la shell è `'cmd.exe'`, dovrebbe capire gli interruttori `/d /s /c` e l'analisi della riga di comando dovrebbe essere compatibile.

## Shell predefinita di Windows {#default-windows-shell}

Sebbene Microsoft specifichi che `%COMSPEC%` deve contenere il percorso di `'cmd.exe'` nell'ambiente radice, i processi figlio non sono sempre soggetti allo stesso requisito. Pertanto, nelle funzioni `child_process` in cui è possibile generare una shell, viene utilizzato `'cmd.exe'` come fallback se `process.env.ComSpec` non è disponibile.

## Serializzazione avanzata {#advanced-serialization}

**Aggiunto in: v13.2.0, v12.16.0**

I processi figlio supportano un meccanismo di serializzazione per IPC basato sull'[API di serializzazione del modulo `node:v8`](/it/nodejs/api/v8#serialization-api), basato sull'[algoritmo di clonazione strutturata HTML](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm). Questo è generalmente più potente e supporta più tipi di oggetti JavaScript integrati, come `BigInt`, `Map` e `Set`, `ArrayBuffer` e `TypedArray`, `Buffer`, `Error`, `RegExp` ecc.

Tuttavia, questo formato non è un superset completo di JSON e, ad esempio, le proprietà impostate su oggetti di tali tipi integrati non verranno passate attraverso il passaggio di serializzazione. Inoltre, le prestazioni potrebbero non essere equivalenti a quelle di JSON, a seconda della struttura dei dati passati. Pertanto, questa funzionalità richiede l'adesione impostando l'opzione `serialization` su `'advanced'` quando si chiama [`child_process.spawn()`](/it/nodejs/api/child_process#child_processspawncommand-args-options) o [`child_process.fork()`](/it/nodejs/api/child_process#child_processforkmodulepath-args-options).

