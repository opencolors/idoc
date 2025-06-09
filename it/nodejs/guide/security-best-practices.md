---
title: Migliori pratiche di sicurezza per le applicazioni Node.js
description: Una guida completa per proteggere le applicazioni Node.js, coprendo la modellazione delle minacce, le migliori pratiche e la mitigazione delle vulnerabilità comuni come il rifiuto del servizio, la riassegnazione DNS e l'esposizione di informazioni sensibili.
head:
  - - meta
    - name: og:title
      content: Migliori pratiche di sicurezza per le applicazioni Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Una guida completa per proteggere le applicazioni Node.js, coprendo la modellazione delle minacce, le migliori pratiche e la mitigazione delle vulnerabilità comuni come il rifiuto del servizio, la riassegnazione DNS e l'esposizione di informazioni sensibili.
  - - meta
    - name: twitter:title
      content: Migliori pratiche di sicurezza per le applicazioni Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Una guida completa per proteggere le applicazioni Node.js, coprendo la modellazione delle minacce, le migliori pratiche e la mitigazione delle vulnerabilità comuni come il rifiuto del servizio, la riassegnazione DNS e l'esposizione di informazioni sensibili.
---


# Best Practice per la Sicurezza

### Intento

Questo documento intende estendere l'attuale [modello delle minacce](/it/nodejs/guide/security-best-practices#threat-model) e fornire linee guida estese su come proteggere un'applicazione Node.js.

## Contenuto del Documento

- Best practice: Un modo semplificato e condensato per vedere le best practice. Possiamo usare [questo issue](https://github.com/nodejs/security-wg/issues/488) o [questa linea guida](https://github.com/goldbergyoni/nodebestpractices) come punto di partenza. È importante notare che questo documento è specifico per Node.js, se stai cercando qualcosa di più ampio, considera [OSSF Best Practices](https://github.com/ossf/wg-best-practices-os-developers).
- Attacchi spiegati: illustrare e documentare in un linguaggio semplice con alcuni esempi di codice (se possibile) degli attacchi che stiamo menzionando nel modello delle minacce.
- Librerie di Terze Parti: definire le minacce (attacchi typosquatting, pacchetti dannosi...) e le best practice riguardanti le dipendenze dei moduli node, ecc...

## Elenco delle Minacce

### Denial of Service del server HTTP (CWE-400)

Questo è un attacco in cui l'applicazione diventa non disponibile per lo scopo per cui è stata progettata a causa del modo in cui elabora le richieste HTTP in entrata. Queste richieste non devono essere necessariamente create intenzionalmente da un attore malintenzionato: un client mal configurato o difettoso può anche inviare un modello di richieste al server che si traduce in un denial of service.

Le richieste HTTP vengono ricevute dal server HTTP di Node.js e consegnate al codice dell'applicazione tramite il gestore di richieste registrato. Il server non analizza il contenuto del corpo della richiesta. Pertanto, qualsiasi DoS causato dal contenuto del corpo dopo che è stato consegnato al gestore di richieste non è una vulnerabilità in Node.js stesso, poiché è responsabilità del codice dell'applicazione gestirlo correttamente.

Assicurarsi che il WebServer gestisca correttamente gli errori socket, ad esempio, quando un server viene creato senza un gestore di errori, sarà vulnerabile al DoS.

```javascript
import net from 'node:net'
const server = net.createServer(socket => {
  // socket.on('error', console.error) // questo impedisce al server di bloccarsi
  socket.write('Echo server\r\n')
  socket.pipe(socket)
})
server.listen(5000, '0.0.0.0')
```

_Se viene eseguita una richiesta errata, il server potrebbe bloccarsi._

Un esempio di attacco DoS che non è causato dal contenuto della richiesta è Slowloris. In questo attacco, le richieste HTTP vengono inviate lentamente e frammentate, un frammento alla volta. Fino a quando la richiesta completa non viene consegnata, il server manterrà le risorse dedicate alla richiesta in corso. Se un numero sufficiente di queste richieste viene inviato contemporaneamente, la quantità di connessioni simultanee raggiungerà presto il suo massimo, con conseguente denial of service. Questo è il modo in cui l'attacco dipende non dal contenuto della richiesta, ma dalla tempistica e dallo schema delle richieste inviate al server.


#### Mitigazioni

- Utilizzare un proxy inverso per ricevere e inoltrare le richieste all'applicazione Node.js. I proxy inversi possono fornire caching, bilanciamento del carico, inserimento di IP in blacklist, ecc. che riducono la probabilità che un attacco DoS sia efficace.
- Configurare correttamente i timeout del server, in modo che le connessioni inattive o in cui le richieste arrivano troppo lentamente possano essere interrotte. Vedere i diversi timeout in `http.Server`, in particolare `headersTimeout`, `requestTimeout`, `timeout` e `keepAliveTimeout`.
- Limitare il numero di socket aperti per host e in totale. Vedere la [documentazione http](/it/nodejs/api/http), in particolare `agent.maxSockets`, `agent.maxTotalSockets`, `agent.maxFreeSockets` e `server.maxRequestsPerSocket`.

### DNS Rebinding (CWE-346)

Questo è un attacco che può prendere di mira le applicazioni Node.js in esecuzione con l'ispettore di debug abilitato tramite l'opzione [--inspect](/it/nodejs/guide/debugging-nodejs).

Poiché i siti web aperti in un browser web possono effettuare richieste WebSocket e HTTP, possono prendere di mira l'ispettore di debug in esecuzione localmente. Ciò è solitamente impedito dalla [politica della stessa origine](/it/nodejs/guide/debugging-nodejs) implementata dai browser moderni, che vieta agli script di raggiungere risorse da origini diverse (il che significa che un sito web dannoso non può leggere dati richiesti da un indirizzo IP locale).

Tuttavia, attraverso il DNS rebinding, un aggressore può temporaneamente controllare l'origine delle proprie richieste in modo che sembrino provenire da un indirizzo IP locale. Ciò viene fatto controllando sia un sito web sia il server DNS utilizzato per risolvere il suo indirizzo IP. Vedere [DNS Rebinding wiki](https://en.wikipedia.org/wiki/DNS_rebinding) per maggiori dettagli.

#### Mitigazioni

- Disabilitare l'ispettore sul segnale SIGUSR1 collegando un listener `process.on(‘SIGUSR1’, …)` ad esso.
- Non eseguire il protocollo dell'ispettore in produzione.

### Esposizione di informazioni sensibili a un attore non autorizzato (CWE-552)

Tutti i file e le cartelle inclusi nella directory corrente vengono inviati al registro npm durante la pubblicazione del pacchetto.

Esistono alcuni meccanismi per controllare questo comportamento definendo una blocklist con `.npmignore` e `.gitignore` o definendo una allowlist nel `package.json`.


#### Misure di mitigazione

- Utilizzare `npm publish --dry-run` per elencare tutti i file da pubblicare. Assicurarsi di rivedere il contenuto prima di pubblicare il pacchetto.
- È inoltre importante creare e mantenere file di esclusione come `.gitignore` e `.npmignore`. All'interno di questi file, è possibile specificare quali file/cartelle non devono essere pubblicati. La [proprietà files](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#files) in `package.json` consente l'operazione inversa: `-- allowed` list.
- In caso di esposizione, assicurarsi di [annullare la pubblicazione del pacchetto](https://docs.npmjs.com/unpublishing-packages-from-the-registry).

### HTTP Request Smuggling (CWE-444)

Questo è un attacco che coinvolge due server HTTP (solitamente un proxy e un'applicazione Node.js). Un client invia una richiesta HTTP che passa prima attraverso il server front-end (il proxy) e poi viene reindirizzata al server back-end (l'applicazione). Quando il front-end e il back-end interpretano in modo diverso le richieste HTTP ambigue, c'è il potenziale per un attaccante di inviare un messaggio dannoso che non sarà visto dal front-end ma sarà visto dal back-end, "contrabbandandolo" efficacemente oltre il server proxy.

Vedere [CWE-444](https://cwe.mitre.org/data/definitions/444.html) per una descrizione più dettagliata ed esempi.

Poiché questo attacco dipende dal fatto che Node.js interpreta le richieste HTTP in modo diverso da un server HTTP (arbitrario), un attacco riuscito può essere dovuto a una vulnerabilità in Node.js, nel server front-end o in entrambi. Se il modo in cui la richiesta viene interpretata da Node.js è coerente con la specifica HTTP (vedere [RFC7230](https://datatracker.org/doc/html/rfc7230#section-3)), allora non è considerata una vulnerabilità in Node.js.

#### Misure di mitigazione

- Non utilizzare l'opzione `insecureHTTPParser` durante la creazione di un server HTTP.
- Configurare il server front-end per normalizzare le richieste ambigue.
- Monitorare continuamente nuove vulnerabilità di HTTP request smuggling sia in Node.js che nel server front-end di scelta.
- Utilizzare HTTP/2 end-to-end e disabilitare il downgrade HTTP, se possibile.


### Esposizione di informazioni tramite attacchi temporali (CWE-208)

Questo è un attacco che consente all'attaccante di apprendere informazioni potenzialmente sensibili, ad esempio misurando il tempo impiegato dall'applicazione per rispondere a una richiesta. Questo attacco non è specifico per Node.js e può prendere di mira quasi tutti i runtime.

L'attacco è possibile ogni volta che l'applicazione utilizza un segreto in un'operazione sensibile al tempo (ad esempio, una ramificazione). Considera la gestione dell'autenticazione in una tipica applicazione. Qui, un metodo di autenticazione di base include e-mail e password come credenziali. Le informazioni sull'utente vengono recuperate dall'input fornito dall'utente, idealmente da un DBMS. Dopo aver recuperato le informazioni sull'utente, la password viene confrontata con le informazioni sull'utente recuperate dal database. L'utilizzo del confronto di stringhe integrato richiede più tempo per i valori della stessa lunghezza. Questo confronto, se eseguito per un tempo accettabile, aumenta involontariamente il tempo di risposta della richiesta. Confrontando i tempi di risposta delle richieste, un attaccante può indovinare la lunghezza e il valore della password in una grande quantità di richieste.

#### Mitigazioni

- L'API crypto espone una funzione `timingSafeEqual` per confrontare i valori sensibili effettivi e previsti utilizzando un algoritmo a tempo costante.
- Per il confronto delle password, è possibile utilizzare [scrypt](/it/nodejs/api/crypto) disponibile anche sul modulo crypto nativo.
- Più in generale, evitare di utilizzare segreti in operazioni a tempo variabile. Ciò include la ramificazione sui segreti e, quando l'attaccante potrebbe trovarsi nella stessa infrastruttura (ad esempio, la stessa macchina cloud), l'utilizzo di un segreto come indice in memoria. Scrivere codice a tempo costante in JavaScript è difficile (in parte a causa del JIT). Per le applicazioni crittografiche, utilizzare le API crittografiche integrate o WebAssembly (per algoritmi non implementati nativamente).

### Moduli dannosi di terze parti (CWE-1357)

Attualmente, in Node.js, qualsiasi pacchetto può accedere a risorse potenti come l'accesso alla rete. Inoltre, poiché hanno anche accesso al file system, possono inviare qualsiasi dato ovunque.

Tutto il codice in esecuzione in un processo node ha la capacità di caricare ed eseguire codice arbitrario aggiuntivo utilizzando `eval()` (o i suoi equivalenti). Tutto il codice con accesso in scrittura al file system può ottenere la stessa cosa scrivendo su file nuovi o esistenti che vengono caricati.

Node.js ha un [meccanismo di policy](/it/nodejs/api/permissions) sperimentale¹ per dichiarare la risorsa caricata come non attendibile o attendibile. Tuttavia, questa politica non è abilitata per impostazione predefinita. Assicurati di bloccare le versioni delle dipendenze ed esegui controlli automatici per le vulnerabilità utilizzando flussi di lavoro comuni o script npm. Prima di installare un pacchetto, assicurati che questo pacchetto sia mantenuto e includa tutti i contenuti che ti aspetti. Fai attenzione, il codice sorgente di GitHub non è sempre lo stesso di quello pubblicato, convalidalo in `node_modules`.


#### Attacchi alla catena di approvvigionamento

Un attacco alla catena di approvvigionamento su un'applicazione Node.js si verifica quando una delle sue dipendenze (dirette o transitive) è compromessa. Ciò può accadere a causa dell'eccessiva lassità dell'applicazione nella specifica delle dipendenze (consentendo aggiornamenti indesiderati) e/o di errori di battitura comuni nella specifica (vulnerabili al [typosquatting](https://en.wikipedia.org/wiki/Typosquatting)).

Un aggressore che prende il controllo di un pacchetto a monte può pubblicare una nuova versione con codice dannoso al suo interno. Se un'applicazione Node.js dipende da quel pacchetto senza essere rigorosa su quale versione è sicura da usare, il pacchetto può essere automaticamente aggiornato all'ultima versione dannosa, compromettendo l'applicazione.

Le dipendenze specificate nel file `package.json` possono avere un numero di versione esatto o un intervallo. Tuttavia, quando si blocca una dipendenza su un numero di versione esatto, le sue dipendenze transitive non vengono bloccate a loro volta. Questo lascia comunque l'applicazione vulnerabile ad aggiornamenti indesiderati/inattesi.

Possibili vettori di attacco:

- Attacchi di Typosquatting
- Avvelenamento del file di blocco (Lockfile poisoning)
- Manutentori compromessi
- Pacchetti dannosi
- Confusione di dipendenze

##### Mitigazioni

- Impedisci a npm di eseguire script arbitrari con `--ignore-scripts`
  - Inoltre, puoi disabilitarlo globalmente con `npm config set ignore-scripts true`
- Blocca le versioni delle dipendenze su una specifica versione immutabile, non una versione che sia un intervallo o da una sorgente mutabile.
- Usa i file di blocco (lockfiles), che bloccano ogni dipendenza (diretta e transitiva).
  - Usa [Mitigations for lockfile poisoning](https://blog.ulisesgascon.com/lockfile-posioned).
- Automatizza i controlli per nuove vulnerabilità utilizzando CI, con strumenti come [npm-audit](https://www.npmjs.com/package/npm-audit).
  - Strumenti come `Socket` possono essere utilizzati per analizzare i pacchetti con analisi statica per trovare comportamenti rischiosi come l'accesso alla rete o al filesystem.
- Usa `npm ci` invece di `npm install`. Questo impone il file di blocco in modo che le incongruenze tra esso e il file `package.json` causino un errore (invece di ignorare silenziosamente il file di blocco a favore di `package.json`).
- Controlla attentamente il file `package.json` per errori/errori di battitura nei nomi delle dipendenze.


### Violazione dell'accesso alla memoria (CWE-284)

Gli attacchi basati sulla memoria o sull'heap dipendono da una combinazione di errori di gestione della memoria e di un allocatore di memoria sfruttabile. Come tutti i runtime, Node.js è vulnerabile a questi attacchi se i tuoi progetti vengono eseguiti su una macchina condivisa. L'utilizzo di un heap sicuro è utile per prevenire la perdita di informazioni sensibili a causa di overrun e underrun del puntatore.

Sfortunatamente, un heap sicuro non è disponibile su Windows. Ulteriori informazioni sono disponibili nella [documentazione secure-heap](/it/nodejs/api/cli) di Node.js.

#### Mitigazioni

- Usa `--secure-heap=n` a seconda della tua applicazione, dove n è la dimensione massima in byte allocata.
- Non eseguire la tua app di produzione su una macchina condivisa.

### Monkey Patching (CWE-349)

Il monkey patching si riferisce alla modifica delle proprietà in fase di runtime con l'obiettivo di modificare il comportamento esistente. Esempio:

```js
// eslint-disable-next-line no-extend-native
Array.prototype.push = function (item) {
  // sovrascrive il [].push globale
}
```

#### Mitigazioni

Il flag `--frozen-intrinsics` abilita gli intrinsici congelati sperimentali¹, il che significa che tutti gli oggetti e le funzioni JavaScript integrati sono congelati ricorsivamente. Pertanto, il seguente snippet non sovrascriverà il comportamento predefinito di `Array.prototype.push`

```js
// eslint-disable-next-line no-extend-native
Array.prototype.push = function (item) {
  // sovrascrive il [].push globale
}
// Non rilevato:
// TypeError <Object <Object <[Object: null prototype] {}>>>:
// Cannot assign to read only property 'push' of object '
```

Tuttavia, è importante ricordare che puoi comunque definire nuovi elementi globali e sostituire quelli esistenti utilizzando `globalThis`

```bash
globalThis.foo = 3; foo; // puoi comunque definire nuovi elementi globali 3
globalThis.Array = 4; Array; // Tuttavia, puoi anche sostituire gli elementi globali esistenti 4
```

Pertanto, `Object.freeze(globalThis)` può essere utilizzato per garantire che nessun elemento globale venga sostituito.

### Attacchi Prototype Pollution (CWE-1321)

Prototype pollution si riferisce alla possibilità di modificare o iniettare proprietà negli elementi del linguaggio Javascript abusando dell'uso di \__proto_, \_constructor, prototype e altre proprietà ereditate dai prototipi integrati.

```js
const a = { a: 1, b: 2 }
const data = JSON.parse('{"__proto__": { "polluted": true}}')
const c = Object.assign({}, a, data)
console.log(c.polluted) // true
// Potenziale DoS
const data2 = JSON.parse('{"__proto__": null}')
const d = Object.assign(a, data2)
d.hasOwnProperty('b') // Uncaught TypeError: d.hasOwnProperty is not a function
```

Questa è una potenziale vulnerabilità ereditata dal linguaggio JavaScript.


#### Esempi

- [CVE-2022-21824](https://www.cvedetails.com/cve/CVE-2022-21824/) (Node.js)
- [CVE-2018-3721](https://www.cvedetails.com/cve/CVE-2018-3721/) (Libreria di terze parti: Lodash)

#### Mitigazioni

- Evitare [unioni ricorsive non sicure](https://gist.github.com/DaniAkash/b3d7159fddcff0a9ee035bd10e34b277#file-unsafe-merge-js), vedere [CVE-2018-16487](https://www.cve.org/CVERecord?id=CVE-2018-16487).
- Implementare le validazioni dello schema JSON per richieste esterne/non attendibili.
- Creare oggetti senza prototipo utilizzando `Object.create(null)`.
- Congelare il prototipo: `Object.freeze(MyObject.prototype)`.
- Disabilitare la proprietà `Object.prototype.__proto__` usando il flag `--disable-proto`.
- Controllare che la proprietà esista direttamente sull'oggetto, non dal prototipo, usando `Object.hasOwn(obj, keyFromObj)`.
- Evitare di usare metodi da `Object.prototype`.

### Elemento del percorso di ricerca non controllato (CWE-427)

Node.js carica i moduli seguendo l'[algoritmo di risoluzione dei moduli](/it/nodejs/api/modules). Pertanto, presume che la directory in cui viene richiesto (require) un modulo sia attendibile.

Con ciò, si intende il seguente comportamento dell'applicazione. Supponendo la seguente struttura di directory:

- app/
  - server.js
  - auth.js
  - auth

Se server.js usa `require('./auth')` seguirà l'algoritmo di risoluzione dei moduli e caricherà auth invece di `auth.js`.

#### Mitigazioni

Usare il [meccanismo di policy sperimentale¹ con controllo di integrità](/it/nodejs/api/permissions) può evitare la minaccia sopra descritta. Per la directory descritta sopra, si può usare il seguente `policy.json`

```json
{
  "resources": {
    "./app/auth.js": {
      "integrity": "sha256-iuGZ6SFVFpMuHUcJciQTIKpIyaQVigMZlvg9Lx66HV8="
    },
    "./app/server.js": {
      "dependencies": {
        "./auth": "./app/auth.js"
      },
      "integrity": "sha256-NPtLCQ0ntPPWgfVEgX46ryTNpdvTWdQPoZO3kHo0bKI="
    }
  }
}
```

Pertanto, quando si richiede il modulo auth, il sistema convaliderà l'integrità e genererà un errore se non corrisponde a quella prevista.

```bash
» node --experimental-policy=policy.json app/server.js
node:internal/policy/sri:65
      throw new ERR_SRI_PARSE(str, str[prevIndex], prevIndex);
      ^
SyntaxError [ERR_SRI_PARSE]: Subresource Integrity string "sha256-iuGZ6SFVFpMuHUcJciQTIKpIyaQVigMZlvg9Lx66HV8=%" had an unexpected "%" at position 51
    at new NodeError (node:internal/errors:393:5)
    at Object.parse (node:internal/policy/sri:65:13)
    at processEntry (node:internal/policy/manifest:581:38)
    at Manifest.assertIntegrity (node:internal/policy/manifest:588:32)
    at Module._compile (node:internal/modules/cjs/loader:1119:21)
    at Module._extensions..js (node:internal/modules/cjs/loader:1213:10)
    at Module.load (node:internal/modules/cjs/loader:1037:32)
    at Module._load (node:internal/modules/cjs/loader:878:12)
    at Module.require (node:internal/modules/cjs/loader:1061:19)
    at require (node:internal/modules/cjs/helpers:99:18) {
  code: 'ERR_SRI_PARSE'
}
```

Nota: è sempre consigliabile usare `--policy-integrity` per evitare mutazioni delle policy.


## Funzionalità sperimentali in produzione

L'uso di funzionalità sperimentali in produzione non è raccomandato. Le funzionalità sperimentali possono subire modifiche che causano problemi se necessario, e la loro funzionalità non è stabilmente sicura. Tuttavia, il feedback è molto apprezzato.

## Strumenti OpenSSF

L'[OpenSSF](https://www.openssf.org) sta guidando diverse iniziative che possono essere molto utili, specialmente se prevedi di pubblicare un pacchetto npm. Queste iniziative includono:

- [OpenSSF Scorecard](https://securityscorecards.dev/) Scorecard valuta i progetti open source utilizzando una serie di controlli automatizzati dei rischi per la sicurezza. Puoi usarlo per valutare in modo proattivo le vulnerabilità e le dipendenze nella tua base di codice e prendere decisioni informate sull'accettazione delle vulnerabilità.
- [OpenSSF Best Practices Badge Program](https://bestpractices.coreinfrastructure.org/en) I progetti possono auto-certificarsi volontariamente descrivendo come rispettano ogni best practice. Questo genererà un badge che può essere aggiunto al progetto.

