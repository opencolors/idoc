---
title: Documentazione del modulo OS di Node.js
description: Il modulo OS di Node.js fornisce diversi metodi utilitari legati al sistema operativo. Può essere utilizzato per interagire con il sistema operativo sottostante, recuperare informazioni di sistema ed eseguire operazioni a livello di sistema.
head:
  - - meta
    - name: og:title
      content: Documentazione del modulo OS di Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Il modulo OS di Node.js fornisce diversi metodi utilitari legati al sistema operativo. Può essere utilizzato per interagire con il sistema operativo sottostante, recuperare informazioni di sistema ed eseguire operazioni a livello di sistema.
  - - meta
    - name: twitter:title
      content: Documentazione del modulo OS di Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Il modulo OS di Node.js fornisce diversi metodi utilitari legati al sistema operativo. Può essere utilizzato per interagire con il sistema operativo sottostante, recuperare informazioni di sistema ed eseguire operazioni a livello di sistema.
---


# OS {#os}

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile
:::

**Codice Sorgente:** [lib/os.js](https://github.com/nodejs/node/blob/v23.5.0/lib/os.js)

Il modulo `node:os` fornisce metodi e proprietà di utilità relativi al sistema operativo. È accessibile tramite:

::: code-group
```js [ESM]
import os from 'node:os';
```

```js [CJS]
const os = require('node:os');
```
:::

## `os.EOL` {#oseol}

**Aggiunto in: v0.7.8**

- [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Il marcatore di fine riga specifico del sistema operativo.

- `\n` su POSIX
- `\r\n` su Windows

## `os.availableParallelism()` {#osavailableparallelism}

**Aggiunto in: v19.4.0, v18.14.0**

- Restituisce: [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Restituisce una stima della quantità predefinita di parallelismo che un programma dovrebbe utilizzare. Restituisce sempre un valore maggiore di zero.

Questa funzione è un piccolo wrapper attorno a [`uv_available_parallelism()`](https://docs.libuv.org/en/v1.x/misc#c.uv_available_parallelism) di libuv.

## `os.arch()` {#osarch}

**Aggiunto in: v0.5.0**

- Restituisce: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Restituisce l'architettura della CPU del sistema operativo per cui è stato compilato il binario Node.js. I valori possibili sono `'arm'`, `'arm64'`, `'ia32'`, `'loong64'`, `'mips'`, `'mipsel'`, `'ppc'`, `'ppc64'`, `'riscv64'`, `'s390'`, `'s390x'` e `'x64'`.

Il valore restituito è equivalente a [`process.arch`](/it/nodejs/api/process#processarch).

## `os.constants` {#osconstants}

**Aggiunto in: v6.3.0**

- [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Contiene costanti specifiche del sistema operativo comunemente utilizzate per i codici di errore, i segnali di processo e così via. Le costanti specifiche definite sono descritte in [Costanti OS](/it/nodejs/api/os#os-constants).

## `os.cpus()` {#oscpus}

**Aggiunto in: v0.3.3**

- Restituisce: [\<Oggetto[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Restituisce un array di oggetti contenenti informazioni su ciascun core logico della CPU. L'array sarà vuoto se non sono disponibili informazioni sulla CPU, ad esempio se il file system `/proc` non è disponibile.

Le proprietà incluse in ciascun oggetto includono:

- `model` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `speed` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) (in MHz)
- `times` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `user` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di millisecondi che la CPU ha trascorso in modalità utente.
    - `nice` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di millisecondi che la CPU ha trascorso in modalità nice.
    - `sys` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di millisecondi che la CPU ha trascorso in modalità sys.
    - `idle` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di millisecondi che la CPU ha trascorso in modalità idle.
    - `irq` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di millisecondi che la CPU ha trascorso in modalità irq.

```js [ESM]
[
  {
    model: 'Intel(R) Core(TM) i7 CPU         860  @ 2.80GHz',
    speed: 2926,
    times: {
      user: 252020,
      nice: 0,
      sys: 30340,
      idle: 1070356870,
      irq: 0,
    },
  },
  {
    model: 'Intel(R) Core(TM) i7 CPU         860  @ 2.80GHz',
    speed: 2926,
    times: {
      user: 306960,
      nice: 0,
      sys: 26980,
      idle: 1071569080,
      irq: 0,
    },
  },
  {
    model: 'Intel(R) Core(TM) i7 CPU         860  @ 2.80GHz',
    speed: 2926,
    times: {
      user: 248450,
      nice: 0,
      sys: 21750,
      idle: 1070919370,
      irq: 0,
    },
  },
  {
    model: 'Intel(R) Core(TM) i7 CPU         860  @ 2.80GHz',
    speed: 2926,
    times: {
      user: 256880,
      nice: 0,
      sys: 19430,
      idle: 1070905480,
      irq: 20,
    },
  },
]
```

I valori `nice` sono solo POSIX. Su Windows, i valori `nice` di tutti i processori sono sempre 0.

`os.cpus().length` non deve essere utilizzato per calcolare la quantità di parallelismo disponibile per un'applicazione. Utilizzare [`os.availableParallelism()`](/it/nodejs/api/os#osavailableparallelism) per questo scopo.


## `os.devNull` {#osdevnull}

**Aggiunto in: v16.3.0, v14.18.0**

- [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Il percorso del file specifico per la piattaforma del dispositivo null.

- `\\.\nul` su Windows
- `/dev/null` su POSIX

## `os.endianness()` {#osendianness}

**Aggiunto in: v0.9.4**

- Restituisce: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Restituisce una stringa che identifica l'endianness della CPU per cui è stato compilato il binario di Node.js.

I valori possibili sono `'BE'` per big endian e `'LE'` per little endian.

## `os.freemem()` {#osfreemem}

**Aggiunto in: v0.3.3**

- Restituisce: [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Restituisce la quantità di memoria di sistema libera in byte come numero intero.

## `os.getPriority([pid])` {#osgetprioritypid}

**Aggiunto in: v10.10.0**

- `pid` [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'ID del processo per cui recuperare la priorità di pianificazione. **Predefinito:** `0`.
- Restituisce: [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Restituisce la priorità di pianificazione per il processo specificato da `pid`. Se `pid` non è fornito o è `0`, viene restituita la priorità del processo corrente.

## `os.homedir()` {#oshomedir}

**Aggiunto in: v2.3.0**

- Restituisce: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Restituisce il percorso stringa della directory home dell'utente corrente.

Su POSIX, utilizza la variabile d'ambiente `$HOME` se definita. Altrimenti utilizza l'[UID effettivo](https://en.wikipedia.org/wiki/User_identifier#Effective_user_ID) per cercare la directory home dell'utente.

Su Windows, utilizza la variabile d'ambiente `USERPROFILE` se definita. Altrimenti utilizza il percorso della directory del profilo dell'utente corrente.

## `os.hostname()` {#oshostname}

**Aggiunto in: v0.3.3**

- Restituisce: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Restituisce il nome host del sistema operativo come stringa.


## `os.loadavg()` {#osloadavg}

**Aggiunto in: v0.3.3**

- Restituisce: [\<number[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Restituisce un array contenente le medie di carico di 1, 5 e 15 minuti.

La media di carico è una misura dell'attività del sistema calcolata dal sistema operativo ed espressa come un numero frazionario.

La media di carico è un concetto specifico di Unix. Su Windows, il valore restituito è sempre `[0, 0, 0]`.

## `os.machine()` {#osmachine}

**Aggiunto in: v18.9.0, v16.18.0**

- Restituisce: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Restituisce il tipo di macchina come una stringa, come `arm`, `arm64`, `aarch64`, `mips`, `mips64`, `ppc64`, `ppc64le`, `s390`, `s390x`, `i386`, `i686`, `x86_64`.

Sui sistemi POSIX, il tipo di macchina è determinato chiamando [`uname(3)`](https://linux.die.net/man/3/uname). Su Windows, viene utilizzato `RtlGetVersion()` e, se non è disponibile, verrà utilizzato `GetVersionExW()`. Vedere [https://en.wikipedia.org/wiki/Uname#Examples](https://en.wikipedia.org/wiki/Uname#Examples) per ulteriori informazioni.

## `os.networkInterfaces()` {#osnetworkinterfaces}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.4.0 | La proprietà `family` ora restituisce una stringa invece di un numero. |
| v18.0.0 | La proprietà `family` ora restituisce un numero invece di una stringa. |
| v0.6.0 | Aggiunto in: v0.6.0 |
:::

- Restituisce: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Restituisce un oggetto contenente le interfacce di rete a cui è stato assegnato un indirizzo di rete.

Ogni chiave sull'oggetto restituito identifica un'interfaccia di rete. Il valore associato è un array di oggetti che descrivono ciascuno un indirizzo di rete assegnato.

Le proprietà disponibili sull'oggetto indirizzo di rete assegnato includono:

- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'indirizzo IPv4 o IPv6 assegnato
- `netmask` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La maschera di rete IPv4 o IPv6
- `family` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Sia `IPv4` che `IPv6`
- `mac` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'indirizzo MAC dell'interfaccia di rete
- `internal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` se l'interfaccia di rete è un loopback o un'interfaccia simile che non è accessibile da remoto; altrimenti `false`
- `scopeid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'ID di scope IPv6 numerico (specificato solo quando `family` è `IPv6`)
- `cidr` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'indirizzo IPv4 o IPv6 assegnato con il prefisso di routing nella notazione CIDR. Se la `netmask` non è valida, questa proprietà è impostata su `null`.

```js [ESM]
{
  lo: [
    {
      address: '127.0.0.1',
      netmask: '255.0.0.0',
      family: 'IPv4',
      mac: '00:00:00:00:00:00',
      internal: true,
      cidr: '127.0.0.1/8'
    },
    {
      address: '::1',
      netmask: 'ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff',
      family: 'IPv6',
      mac: '00:00:00:00:00:00',
      scopeid: 0,
      internal: true,
      cidr: '::1/128'
    }
  ],
  eth0: [
    {
      address: '192.168.1.108',
      netmask: '255.255.255.0',
      family: 'IPv4',
      mac: '01:02:03:0a:0b:0c',
      internal: false,
      cidr: '192.168.1.108/24'
    },
    {
      address: 'fe80::a00:27ff:fe4e:66a1',
      netmask: 'ffff:ffff:ffff:ffff::',
      family: 'IPv6',
      mac: '01:02:03:0a:0b:0c',
      scopeid: 1,
      internal: false,
      cidr: 'fe80::a00:27ff:fe4e:66a1/64'
    }
  ]
}
```

## `os.platform()` {#osplatform}

**Aggiunto in: v0.5.0**

- Restituisce: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Restituisce una stringa che identifica la piattaforma del sistema operativo per cui è stato compilato il binario di Node.js. Il valore viene impostato al momento della compilazione. I valori possibili sono `'aix'`, `'darwin'`, `'freebsd'`, `'linux'`, `'openbsd'`, `'sunos'` e `'win32'`.

Il valore restituito è equivalente a [`process.platform`](/it/nodejs/api/process#processplatform).

Il valore `'android'` può essere restituito anche se Node.js è costruito sul sistema operativo Android. [Il supporto per Android è sperimentale](https://github.com/nodejs/node/blob/HEAD/BUILDING.md#android).

## `os.release()` {#osrelease}

**Aggiunto in: v0.3.3**

- Restituisce: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Restituisce il sistema operativo come stringa.

Sui sistemi POSIX, il rilascio del sistema operativo è determinato chiamando [`uname(3)`](https://linux.die.net/man/3/uname). Su Windows, viene utilizzato `GetVersionExW()`. Vedi [https://en.wikipedia.org/wiki/Uname#Examples](https://en.wikipedia.org/wiki/Uname#Examples) per maggiori informazioni.

## `os.setPriority([pid, ]priority)` {#ossetprioritypid-priority}

**Aggiunto in: v10.10.0**

- `pid` [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'ID del processo per il quale impostare la priorità di pianificazione. **Predefinito:** `0`.
- `priority` [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La priorità di pianificazione da assegnare al processo.

Tenta di impostare la priorità di pianificazione per il processo specificato da `pid`. Se `pid` non viene fornito o è `0`, viene utilizzato l'ID del processo corrente.

L'input `priority` deve essere un numero intero compreso tra `-20` (priorità alta) e `19` (priorità bassa). A causa delle differenze tra i livelli di priorità Unix e le classi di priorità di Windows, `priority` viene mappato a una delle sei costanti di priorità in `os.constants.priority`. Quando si recupera un livello di priorità del processo, questa mappatura dell'intervallo può far sì che il valore restituito sia leggermente diverso su Windows. Per evitare confusione, imposta `priority` su una delle costanti di priorità.

Su Windows, l'impostazione della priorità su `PRIORITY_HIGHEST` richiede privilegi elevati dell'utente. Altrimenti la priorità impostata verrà silenziosamente ridotta a `PRIORITY_HIGH`.


## `os.tmpdir()` {#ostmpdir}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v2.0.0 | Questa funzione è ora coerente tra le piattaforme e non restituisce più un percorso con una barra finale su nessuna piattaforma. |
| v0.9.9 | Aggiunta in: v0.9.9 |
:::

- Restituisce: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Restituisce la directory predefinita del sistema operativo per i file temporanei come stringa.

Su Windows, il risultato può essere sovrascritto dalle variabili d'ambiente `TEMP` e `TMP`, e `TEMP` ha la precedenza su `TMP`. Se nessuno dei due è impostato, il valore predefinito è `%SystemRoot%\temp` o `%windir%\temp`.

Sulle piattaforme non Windows, le variabili d'ambiente `TMPDIR`, `TMP` e `TEMP` verranno controllate per sovrascrivere il risultato di questo metodo, nell'ordine descritto. Se nessuno di essi è impostato, il valore predefinito è `/tmp`.

Alcune distribuzioni del sistema operativo configurerebbero `TMPDIR` (non Windows) o `TEMP` e `TMP` (Windows) per impostazione predefinita senza configurazioni aggiuntive da parte degli amministratori di sistema. Il risultato di `os.tmpdir()` in genere riflette la preferenza del sistema a meno che non venga esplicitamente sovrascritta dagli utenti.

## `os.totalmem()` {#ostotalmem}

**Aggiunta in: v0.3.3**

- Restituisce: [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Restituisce la quantità totale di memoria di sistema in byte come numero intero.

## `os.type()` {#ostype}

**Aggiunta in: v0.3.3**

- Restituisce: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Restituisce il nome del sistema operativo come restituito da [`uname(3)`](https://linux.die.net/man/3/uname). Ad esempio, restituisce `'Linux'` su Linux, `'Darwin'` su macOS e `'Windows_NT'` su Windows.

Vedi [https://en.wikipedia.org/wiki/Uname#Examples](https://en.wikipedia.org/wiki/Uname#Examples) per ulteriori informazioni sull'output dell'esecuzione di [`uname(3)`](https://linux.die.net/man/3/uname) su vari sistemi operativi.

## `os.uptime()` {#osuptime}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.0.0 | Il risultato di questa funzione non contiene più una componente frazionaria su Windows. |
| v0.3.3 | Aggiunta in: v0.3.3 |
:::

- Restituisce: [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Restituisce il tempo di attività del sistema in numero di secondi.


## `os.userInfo([options])` {#osuserinfooptions}

**Aggiunto in: v6.0.0**

- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Codifica dei caratteri utilizzata per interpretare le stringhe risultanti. Se `encoding` è impostato su `'buffer'`, i valori `username`, `shell` e `homedir` saranno istanze di `Buffer`. **Predefinito:** `'utf8'`.


- Restituisce: [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Restituisce informazioni sull'utente attualmente attivo. Su piattaforme POSIX, questo è tipicamente un sottoinsieme del file password. L'oggetto restituito include `username`, `uid`, `gid`, `shell` e `homedir`. Su Windows, i campi `uid` e `gid` sono `-1` e `shell` è `null`.

Il valore di `homedir` restituito da `os.userInfo()` è fornito dal sistema operativo. Questo differisce dal risultato di `os.homedir()`, che interroga le variabili d'ambiente per la home directory prima di ripiegare sulla risposta del sistema operativo.

Solleva un [`SystemError`](/it/nodejs/api/errors#class-systemerror) se un utente non ha `username` o `homedir`.

## `os.version()` {#osversion}

**Aggiunto in: v13.11.0, v12.17.0**

- Restituisce: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Restituisce una stringa che identifica la versione del kernel.

Sui sistemi POSIX, la release del sistema operativo è determinata chiamando [`uname(3)`](https://linux.die.net/man/3/uname). Su Windows, viene utilizzato `RtlGetVersion()` e, se non è disponibile, verrà utilizzato `GetVersionExW()`. Vedere [https://en.wikipedia.org/wiki/Uname#Examples](https://en.wikipedia.org/wiki/Uname#Examples) per ulteriori informazioni.

## Costanti OS {#os-constants}

Le seguenti costanti sono esportate da `os.constants`.

Non tutte le costanti saranno disponibili su ogni sistema operativo.

### Costanti di segnale {#signal-constants}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v5.11.0 | Aggiunto il supporto per `SIGINFO`. |
:::

Le seguenti costanti di segnale sono esportate da `os.constants.signals`.

| Costante | Descrizione |
| --- | --- |
| `SIGHUP` | Inviato per indicare quando un terminale di controllo è chiuso o un processo padre termina. |
| `SIGINT` | Inviato per indicare quando un utente desidera interrompere un processo ( + ). |
| `SIGQUIT` | Inviato per indicare quando un utente desidera terminare un processo ed eseguire un core dump. |
| `SIGILL` | Inviato a un processo per notificare che ha tentato di eseguire un'istruzione illegale, malformata, sconosciuta o privilegiata. |
| `SIGTRAP` | Inviato a un processo quando si è verificata un'eccezione. |
| `SIGABRT` | Inviato a un processo per richiedere che venga interrotto. |
| `SIGIOT` | Sinonimo di `SIGABRT` |
| `SIGBUS` | Inviato a un processo per notificare che ha causato un errore di bus. |
| `SIGFPE` | Inviato a un processo per notificare che ha eseguito un'operazione aritmetica illegale. |
| `SIGKILL` | Inviato a un processo per terminarlo immediatamente. |
| `SIGUSR1` `SIGUSR2` | Inviato a un processo per identificare condizioni definite dall'utente. |
| `SIGSEGV` | Inviato a un processo per notificare un errore di segmentazione. |
| `SIGPIPE` | Inviato a un processo quando ha tentato di scrivere su una pipe disconnessa. |
| `SIGALRM` | Inviato a un processo quando un timer di sistema è scaduto. |
| `SIGTERM` | Inviato a un processo per richiedere la terminazione. |
| `SIGCHLD` | Inviato a un processo quando un processo figlio termina. |
| `SIGSTKFLT` | Inviato a un processo per indicare un errore di stack su un coprocessore. |
| `SIGCONT` | Inviato per istruire il sistema operativo a continuare un processo in pausa. |
| `SIGSTOP` | Inviato per istruire il sistema operativo a fermare un processo. |
| `SIGTSTP` | Inviato a un processo per richiedere di fermarsi. |
| `SIGBREAK` | Inviato per indicare quando un utente desidera interrompere un processo. |
| `SIGTTIN` | Inviato a un processo quando legge dalla TTY mentre è in background. |
| `SIGTTOU` | Inviato a un processo quando scrive sulla TTY mentre è in background. |
| `SIGURG` | Inviato a un processo quando un socket ha dati urgenti da leggere. |
| `SIGXCPU` | Inviato a un processo quando ha superato il limite di utilizzo della CPU. |
| `SIGXFSZ` | Inviato a un processo quando un file diventa più grande del massimo consentito. |
| `SIGVTALRM` | Inviato a un processo quando un timer virtuale è scaduto. |
| `SIGPROF` | Inviato a un processo quando un timer di sistema è scaduto. |
| `SIGWINCH` | Inviato a un processo quando il terminale di controllo ha cambiato dimensione. |
| `SIGIO` | Inviato a un processo quando l'I/O è disponibile. |
| `SIGPOLL` | Sinonimo di `SIGIO` |
| `SIGLOST` | Inviato a un processo quando un blocco file è stato perso. |
| `SIGPWR` | Inviato a un processo per notificare un'interruzione di corrente. |
| `SIGINFO` | Sinonimo di `SIGPWR` |
| `SIGSYS` | Inviato a un processo per notificare un argomento errato. |
| `SIGUNUSED` | Sinonimo di `SIGSYS` |


### Costanti di errore {#error-constants}

Le seguenti costanti di errore sono esportate da `os.constants.errno`.

#### Costanti di errore POSIX {#posix-error-constants}

| Costante | Descrizione |
| --- | --- |
| `E2BIG` | Indica che l'elenco degli argomenti è più lungo del previsto. |
| `EACCES` | Indica che l'operazione non disponeva delle autorizzazioni sufficienti. |
| `EADDRINUSE` | Indica che l'indirizzo di rete è già in uso. |
| `EADDRNOTAVAIL` | Indica che l'indirizzo di rete non è attualmente disponibile per l'uso. |
| `EAFNOSUPPORT` | Indica che la famiglia di indirizzi di rete non è supportata. |
| `EAGAIN` | Indica che non ci sono dati disponibili e di riprovare l'operazione più tardi. |
| `EALREADY` | Indica che il socket ha già una connessione in sospeso in corso. |
| `EBADF` | Indica che un descrittore di file non è valido. |
| `EBADMSG` | Indica un messaggio di dati non valido. |
| `EBUSY` | Indica che un dispositivo o una risorsa è occupata. |
| `ECANCELED` | Indica che un'operazione è stata annullata. |
| `ECHILD` | Indica che non ci sono processi figlio. |
| `ECONNABORTED` | Indica che la connessione di rete è stata interrotta. |
| `ECONNREFUSED` | Indica che la connessione di rete è stata rifiutata. |
| `ECONNRESET` | Indica che la connessione di rete è stata reimpostata. |
| `EDEADLK` | Indica che è stato evitato un deadlock di risorse. |
| `EDESTADDRREQ` | Indica che è necessario un indirizzo di destinazione. |
| `EDOM` | Indica che un argomento è al di fuori del dominio della funzione. |
| `EDQUOT` | Indica che la quota del disco è stata superata. |
| `EEXIST` | Indica che il file esiste già. |
| `EFAULT` | Indica un indirizzo puntatore non valido. |
| `EFBIG` | Indica che il file è troppo grande. |
| `EHOSTUNREACH` | Indica che l'host è irraggiungibile. |
| `EIDRM` | Indica che l'identificatore è stato rimosso. |
| `EILSEQ` | Indica una sequenza di byte illegale. |
| `EINPROGRESS` | Indica che un'operazione è già in corso. |
| `EINTR` | Indica che una chiamata di funzione è stata interrotta. |
| `EINVAL` | Indica che è stato fornito un argomento non valido. |
| `EIO` | Indica un errore I/O altrimenti non specificato. |
| `EISCONN` | Indica che il socket è connesso. |
| `EISDIR` | Indica che il percorso è una directory. |
| `ELOOP` | Indica troppi livelli di collegamenti simbolici in un percorso. |
| `EMFILE` | Indica che ci sono troppi file aperti. |
| `EMLINK` | Indica che ci sono troppi collegamenti fisici a un file. |
| `EMSGSIZE` | Indica che il messaggio fornito è troppo lungo. |
| `EMULTIHOP` | Indica che è stato tentato un multihop. |
| `ENAMETOOLONG` | Indica che il nome del file è troppo lungo. |
| `ENETDOWN` | Indica che la rete è inattiva. |
| `ENETRESET` | Indica che la connessione è stata interrotta dalla rete. |
| `ENETUNREACH` | Indica che la rete è irraggiungibile. |
| `ENFILE` | Indica troppi file aperti nel sistema. |
| `ENOBUFS` | Indica che non è disponibile spazio buffer. |
| `ENODATA` | Indica che nessun messaggio è disponibile nella coda di lettura dell'intestazione del flusso. |
| `ENODEV` | Indica che non esiste tale dispositivo. |
| `ENOENT` | Indica che non esiste tale file o directory. |
| `ENOEXEC` | Indica un errore di formato exec. |
| `ENOLCK` | Indica che non sono disponibili blocchi. |
| `ENOLINK` | Indica che un collegamento è stato interrotto. |
| `ENOMEM` | Indica che non c'è abbastanza spazio. |
| `ENOMSG` | Indica che non esiste un messaggio del tipo desiderato. |
| `ENOPROTOOPT` | Indica che un determinato protocollo non è disponibile. |
| `ENOSPC` | Indica che non c'è spazio disponibile sul dispositivo. |
| `ENOSR` | Indica che non sono disponibili risorse di flusso. |
| `ENOSTR` | Indica che una determinata risorsa non è un flusso. |
| `ENOSYS` | Indica che una funzione non è stata implementata. |
| `ENOTCONN` | Indica che il socket non è connesso. |
| `ENOTDIR` | Indica che il percorso non è una directory. |
| `ENOTEMPTY` | Indica che la directory non è vuota. |
| `ENOTSOCK` | Indica che l'elemento specificato non è un socket. |
| `ENOTSUP` | Indica che una determinata operazione non è supportata. |
| `ENOTTY` | Indica un'operazione di controllo I/O inappropriata. |
| `ENXIO` | Indica che non esiste tale dispositivo o indirizzo. |
| `EOPNOTSUPP` | Indica che un'operazione non è supportata sul socket. Sebbene `ENOTSUP` e `EOPNOTSUPP` abbiano lo stesso valore su Linux, secondo POSIX.1 questi valori di errore dovrebbero essere distinti.) |
| `EOVERFLOW` | Indica che un valore è troppo grande per essere memorizzato in un determinato tipo di dati. |
| `EPERM` | Indica che l'operazione non è consentita. |
| `EPIPE` | Indica un pipe interrotto. |
| `EPROTO` | Indica un errore di protocollo. |
| `EPROTONOSUPPORT` | Indica che un protocollo non è supportato. |
| `EPROTOTYPE` | Indica il tipo di protocollo errato per un socket. |
| `ERANGE` | Indica che i risultati sono troppo grandi. |
| `EROFS` | Indica che il file system è di sola lettura. |
| `ESPIPE` | Indica un'operazione di seek non valida. |
| `ESRCH` | Indica che non esiste tale processo. |
| `ESTALE` | Indica che l'handle del file è obsoleto. |
| `ETIME` | Indica un timer scaduto. |
| `ETIMEDOUT` | Indica che la connessione è scaduta. |
| `ETXTBSY` | Indica che un file di testo è occupato. |
| `EWOULDBLOCK` | Indica che l'operazione si bloccherebbe. |
| `EXDEV` | Indica un collegamento improprio. |


#### Costanti di errore specifiche di Windows {#windows-specific-error-constants}

I seguenti codici di errore sono specifici del sistema operativo Windows.

| Costante | Descrizione |
| --- | --- |
| `WSAEINTR` | Indica una chiamata di funzione interrotta. |
| `WSAEBADF` | Indica un handle di file non valido. |
| `WSAEACCES` | Indica autorizzazioni insufficienti per completare l'operazione. |
| `WSAEFAULT` | Indica un indirizzo puntatore non valido. |
| `WSAEINVAL` | Indica che è stato passato un argomento non valido. |
| `WSAEMFILE` | Indica che ci sono troppi file aperti. |
| `WSAEWOULDBLOCK` | Indica che una risorsa è temporaneamente non disponibile. |
| `WSAEINPROGRESS` | Indica che un'operazione è attualmente in corso. |
| `WSAEALREADY` | Indica che un'operazione è già in corso. |
| `WSAENOTSOCK` | Indica che la risorsa non è un socket. |
| `WSAEDESTADDRREQ` | Indica che è richiesto un indirizzo di destinazione. |
| `WSAEMSGSIZE` | Indica che la dimensione del messaggio è troppo lunga. |
| `WSAEPROTOTYPE` | Indica il tipo di protocollo errato per il socket. |
| `WSAENOPROTOOPT` | Indica un'opzione di protocollo errata. |
| `WSAEPROTONOSUPPORT` | Indica che il protocollo non è supportato. |
| `WSAESOCKTNOSUPPORT` | Indica che il tipo di socket non è supportato. |
| `WSAEOPNOTSUPP` | Indica che l'operazione non è supportata. |
| `WSAEPFNOSUPPORT` | Indica che la famiglia di protocolli non è supportata. |
| `WSAEAFNOSUPPORT` | Indica che la famiglia di indirizzi non è supportata. |
| `WSAEADDRINUSE` | Indica che l'indirizzo di rete è già in uso. |
| `WSAEADDRNOTAVAIL` | Indica che l'indirizzo di rete non è disponibile. |
| `WSAENETDOWN` | Indica che la rete è inattiva. |
| `WSAENETUNREACH` | Indica che la rete non è raggiungibile. |
| `WSAENETRESET` | Indica che la connessione di rete è stata resettata. |
| `WSAECONNABORTED` | Indica che la connessione è stata interrotta. |
| `WSAECONNRESET` | Indica che la connessione è stata resettata dal peer. |
| `WSAENOBUFS` | Indica che non è disponibile spazio nel buffer. |
| `WSAEISCONN` | Indica che il socket è già connesso. |
| `WSAENOTCONN` | Indica che il socket non è connesso. |
| `WSAESHUTDOWN` | Indica che i dati non possono essere inviati dopo che il socket è stato     arrestato. |
| `WSAETOOMANYREFS` | Indica che ci sono troppi riferimenti. |
| `WSAETIMEDOUT` | Indica che la connessione è scaduta. |
| `WSAECONNREFUSED` | Indica che la connessione è stata rifiutata. |
| `WSAELOOP` | Indica che un nome non può essere tradotto. |
| `WSAENAMETOOLONG` | Indica che un nome era troppo lungo. |
| `WSAEHOSTDOWN` | Indica che un host di rete è inattivo. |
| `WSAEHOSTUNREACH` | Indica che non esiste una route verso un host di rete. |
| `WSAENOTEMPTY` | Indica che la directory non è vuota. |
| `WSAEPROCLIM` | Indica che ci sono troppi processi. |
| `WSAEUSERS` | Indica che la quota utente è stata superata. |
| `WSAEDQUOT` | Indica che la quota disco è stata superata. |
| `WSAESTALE` | Indica un riferimento a un handle di file obsoleto. |
| `WSAEREMOTE` | Indica che l'elemento è remoto. |
| `WSASYSNOTREADY` | Indica che il sottosistema di rete non è pronto. |
| `WSAVERNOTSUPPORTED` | Indica che la versione di `winsock.dll` è fuori     intervallo. |
| `WSANOTINITIALISED` | Indica che WSAStartup non è ancora stata eseguita con successo. |
| `WSAEDISCON` | Indica che è in corso un arresto graduale. |
| `WSAENOMORE` | Indica che non ci sono più risultati. |
| `WSAECANCELLED` | Indica che un'operazione è stata annullata. |
| `WSAEINVALIDPROCTABLE` | Indica che la tabella delle chiamate di procedura non è valida. |
| `WSAEINVALIDPROVIDER` | Indica un provider di servizi non valido. |
| `WSAEPROVIDERFAILEDINIT` | Indica che l'inizializzazione del provider di servizi non è riuscita. |
| `WSASYSCALLFAILURE` | Indica un errore di chiamata di sistema. |
| `WSASERVICE_NOT_FOUND` | Indica che un servizio non è stato trovato. |
| `WSATYPE_NOT_FOUND` | Indica che un tipo di classe non è stato trovato. |
| `WSA_E_NO_MORE` | Indica che non ci sono più risultati. |
| `WSA_E_CANCELLED` | Indica che la chiamata è stata annullata. |
| `WSAEREFUSED` | Indica che una query di database è stata rifiutata. |


### Costanti dlopen {#dlopen-constants}

Se disponibili sul sistema operativo, le seguenti costanti vengono esportate in `os.constants.dlopen`. Vedi [`dlopen(3)`](http://man7.org/linux/man-pages/man3/dlopen.3) per informazioni dettagliate.

| Costante | Descrizione |
| --- | --- |
| `RTLD_LAZY` | Esegue il binding lazy. Node.js imposta questo flag per impostazione predefinita. |
| `RTLD_NOW` | Risolve tutti i simboli non definiti nella libreria prima che dlopen(3) restituisca. |
| `RTLD_GLOBAL` | I simboli definiti dalla libreria saranno resi disponibili per la risoluzione dei simboli delle librerie caricate successivamente. |
| `RTLD_LOCAL` | L'opposto di `RTLD_GLOBAL`. Questo è il comportamento predefinito se non viene specificato alcun flag. |
| `RTLD_DEEPBIND` | Fa in modo che una libreria autonoma utilizzi i propri simboli invece dei simboli delle librerie caricate in precedenza. |
### Costanti di priorità {#priority-constants}

**Aggiunto in: v10.10.0**

Le seguenti costanti di pianificazione dei processi vengono esportate da `os.constants.priority`.

| Costante | Descrizione |
| --- | --- |
| `PRIORITY_LOW` | La priorità di pianificazione del processo più bassa. Ciò corrisponde a `IDLE_PRIORITY_CLASS` su Windows e un valore nice di `19` su tutte le altre piattaforme. |
| `PRIORITY_BELOW_NORMAL` | La priorità di pianificazione del processo superiore a `PRIORITY_LOW` e inferiore a `PRIORITY_NORMAL`. Ciò corrisponde a `BELOW_NORMAL_PRIORITY_CLASS` su Windows e un valore nice di `10` su tutte le altre piattaforme. |
| `PRIORITY_NORMAL` | La priorità di pianificazione del processo predefinita. Ciò corrisponde a `NORMAL_PRIORITY_CLASS` su Windows e un valore nice di `0` su tutte le altre piattaforme. |
| `PRIORITY_ABOVE_NORMAL` | La priorità di pianificazione del processo superiore a `PRIORITY_NORMAL` e inferiore a `PRIORITY_HIGH`. Ciò corrisponde a `ABOVE_NORMAL_PRIORITY_CLASS` su Windows e un valore nice di `-7` su tutte le altre piattaforme. |
| `PRIORITY_HIGH` | La priorità di pianificazione del processo superiore a `PRIORITY_ABOVE_NORMAL` e inferiore a `PRIORITY_HIGHEST`. Ciò corrisponde a `HIGH_PRIORITY_CLASS` su Windows e un valore nice di `-14` su tutte le altre piattaforme. |
| `PRIORITY_HIGHEST` | La priorità di pianificazione del processo più alta. Ciò corrisponde a `REALTIME_PRIORITY_CLASS` su Windows e un valore nice di `-20` su tutte le altre piattaforme. |


### Costanti libuv {#libuv-constants}

| Costante | Descrizione |
| --- | --- |
| `UV_UDP_REUSEADDR` ||

