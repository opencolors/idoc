---
title: API delle Permessi di Node.js
description: La documentazione dell'API delle Permessi di Node.js descrive come gestire e controllare i permessi per varie operazioni all'interno delle applicazioni Node.js, garantendo un accesso sicuro e controllato alle risorse di sistema.
head:
  - - meta
    - name: og:title
      content: API delle Permessi di Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: La documentazione dell'API delle Permessi di Node.js descrive come gestire e controllare i permessi per varie operazioni all'interno delle applicazioni Node.js, garantendo un accesso sicuro e controllato alle risorse di sistema.
  - - meta
    - name: twitter:title
      content: API delle Permessi di Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: La documentazione dell'API delle Permessi di Node.js descrive come gestire e controllare i permessi per varie operazioni all'interno delle applicazioni Node.js, garantendo un accesso sicuro e controllato alle risorse di sistema.
---


# Autorizzazioni {#permissions}

Le autorizzazioni possono essere utilizzate per controllare a quali risorse di sistema ha accesso il processo Node.js o quali azioni il processo può intraprendere con tali risorse.

- [Autorizzazioni basate sul processo](/it/nodejs/api/permissions#process-based-permissions) controllano l'accesso del processo Node.js alle risorse. La risorsa può essere interamente consentita o negata, oppure le azioni relative ad essa possono essere controllate. Ad esempio, le letture del file system possono essere consentite negando al contempo le scritture. Questa funzionalità non protegge dal codice dannoso. Secondo la [Politica di sicurezza](https://github.com/nodejs/node/blob/main/SECURITY.md) di Node.js, Node.js si fida di qualsiasi codice che gli viene chiesto di eseguire.

Il modello di autorizzazione implementa un approccio "cinture di sicurezza", che impedisce al codice considerato affidabile di modificare involontariamente file o utilizzare risorse a cui l'accesso non è stato esplicitamente concesso. Non fornisce garanzie di sicurezza in presenza di codice dannoso. Il codice dannoso può বাইপাস il modello di autorizzazione ed eseguire codice arbitrario senza le restrizioni imposte dal modello di autorizzazione.

Se trovi una potenziale vulnerabilità di sicurezza, fai riferimento alla nostra [Politica di sicurezza](https://github.com/nodejs/node/blob/main/SECURITY.md).

## Autorizzazioni basate sul processo {#process-based-permissions}

### Modello di autorizzazione {#permission-model}

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile.
:::

Il modello di autorizzazione di Node.js è un meccanismo per limitare l'accesso a risorse specifiche durante l'esecuzione. L'API esiste dietro un flag [`--permission`](/it/nodejs/api/cli#--permission) che, quando abilitato, limiterà l'accesso a tutte le autorizzazioni disponibili.

Le autorizzazioni disponibili sono documentate dal flag [`--permission`](/it/nodejs/api/cli#--permission).

Quando si avvia Node.js con `--permission`, la possibilità di accedere al file system tramite il modulo `fs`, generare processi, utilizzare `node:worker_threads`, utilizzare componenti aggiuntivi nativi, utilizzare WASI e abilitare l'ispettore di runtime sarà limitata.

```bash [BASH]
$ node --permission index.js

Error: Access to this API has been restricted
    at node:internal/main/run_main_module:23:47 {
  code: 'ERR_ACCESS_DENIED',
  permission: 'FileSystemRead',
  resource: '/home/user/index.js'
}
```
Consentire l'accesso alla generazione di un processo e alla creazione di thread di lavoro può essere fatto utilizzando rispettivamente [`--allow-child-process`](/it/nodejs/api/cli#--allow-child-process) e [`--allow-worker`](/it/nodejs/api/cli#--allow-worker).

Per consentire i componenti aggiuntivi nativi quando si utilizza il modello di autorizzazione, utilizzare il flag [`--allow-addons`](/it/nodejs/api/cli#--allow-addons). Per WASI, utilizzare il flag [`--allow-wasi`](/it/nodejs/api/cli#--allow-wasi).


#### API di Runtime {#runtime-api}

Quando si abilita il Modello di Permessi tramite il flag [`--permission`](/it/nodejs/api/cli#--permission) viene aggiunta una nuova proprietà `permission` all'oggetto `process`. Questa proprietà contiene una funzione:

##### `permission.has(scope[, reference])` {#permissionhasscope-reference}

Chiamata API per verificare i permessi a runtime ([`permission.has()`](/it/nodejs/api/process#processpermissionhasscope-reference))

```js [ESM]
process.permission.has('fs.write'); // true
process.permission.has('fs.write', '/home/rafaelgss/protected-folder'); // true

process.permission.has('fs.read'); // true
process.permission.has('fs.read', '/home/rafaelgss/protected-folder'); // false
```
#### Permessi del File System {#file-system-permissions}

Il Modello di Permessi, di default, limita l'accesso al file system tramite il modulo `node:fs`. Non garantisce che gli utenti non saranno in grado di accedere al file system attraverso altri mezzi, come ad esempio tramite il modulo `node:sqlite`.

Per consentire l'accesso al file system, utilizzare i flag [`--allow-fs-read`](/it/nodejs/api/cli#--allow-fs-read) e [`--allow-fs-write`](/it/nodejs/api/cli#--allow-fs-write):

```bash [BASH]
$ node --permission --allow-fs-read=* --allow-fs-write=* index.js
Hello world!
```
Gli argomenti validi per entrambi i flag sono:

- `*` - Per consentire tutte le operazioni `FileSystemRead` o `FileSystemWrite`, rispettivamente.
- Percorsi delimitati da virgola (`,`) per consentire solo le operazioni `FileSystemRead` o `FileSystemWrite` corrispondenti, rispettivamente.

Esempio:

- `--allow-fs-read=*` - Consente tutte le operazioni `FileSystemRead`.
- `--allow-fs-write=*` - Consente tutte le operazioni `FileSystemWrite`.
- `--allow-fs-write=/tmp/` - Consente l'accesso `FileSystemWrite` alla cartella `/tmp/`.
- `--allow-fs-read=/tmp/ --allow-fs-read=/home/.gitignore` - Consente l'accesso `FileSystemRead` alla cartella `/tmp/` **e** al percorso `/home/.gitignore`.

Sono supportati anche i caratteri jolly:

- `--allow-fs-read=/home/test*` consentirà l'accesso in lettura a tutto ciò che corrisponde al carattere jolly. Es: `/home/test/file1` o `/home/test2`

Dopo aver passato un carattere jolly (`*`) tutti i caratteri successivi verranno ignorati. Ad esempio: `/home/*.js` funzionerà in modo simile a `/home/*`.

Quando il modello di autorizzazioni viene inizializzato, aggiungerà automaticamente un carattere jolly (*) se la directory specificata esiste. Ad esempio, se `/home/test/files` esiste, verrà trattata come `/home/test/files/*`. Tuttavia, se la directory non esiste, il carattere jolly non verrà aggiunto e l'accesso sarà limitato a `/home/test/files`. Se vuoi consentire l'accesso a una cartella che non esiste ancora, assicurati di includere esplicitamente il carattere jolly: `/my-path/folder-do-not-exist/*`.


#### Vincoli del modello di autorizzazioni {#permission-model-constraints}

Ci sono dei vincoli che devi conoscere prima di utilizzare questo sistema:

- Il modello non eredita a un processo figlio o un thread worker.
- Quando si utilizza il Modello di autorizzazioni, le seguenti funzionalità saranno limitate:
    - Moduli nativi
    - Processo figlio
    - Thread worker
    - Protocollo Inspector
    - Accesso al file system
    - WASI

- Il Modello di autorizzazioni viene inizializzato dopo che l'ambiente Node.js è stato impostato. Tuttavia, alcuni flag come `--env-file` o `--openssl-config` sono progettati per leggere i file prima dell'inizializzazione dell'ambiente. Di conseguenza, tali flag non sono soggetti alle regole del Modello di autorizzazioni. Lo stesso vale per i flag V8 che possono essere impostati tramite runtime tramite `v8.setFlagsFromString`.
- I motori OpenSSL non possono essere richiesti in fase di esecuzione quando il Modello di autorizzazioni è abilitato, il che influisce sui moduli crypto, https e tls integrati.
- Le estensioni caricabili in fase di esecuzione non possono essere caricate quando il Modello di autorizzazioni è abilitato, il che influisce sul modulo sqlite.
- L'utilizzo di descrittori di file esistenti tramite il modulo `node:fs` bypassa il Modello di autorizzazioni.

#### Limitazioni e problemi noti {#limitations-and-known-issues}

- I collegamenti simbolici verranno seguiti anche verso posizioni al di fuori dell'insieme di percorsi a cui è stato concesso l'accesso. I collegamenti simbolici relativi possono consentire l'accesso a file e directory arbitrari. Quando si avviano applicazioni con il modello di autorizzazioni abilitato, è necessario assicurarsi che nessun percorso a cui è stato concesso l'accesso contenga collegamenti simbolici relativi.

