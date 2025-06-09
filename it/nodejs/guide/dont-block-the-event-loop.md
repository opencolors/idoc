---
title: Non bloccare il ciclo degli eventi (o la piscina di lavoro)
description: Come scrivere un server web ad alte prestazioni e più resistente agli attacchi DoS evitando di bloccare il ciclo degli eventi e la piscina di lavoro in Node.js.
head:
  - - meta
    - name: og:title
      content: Non bloccare il ciclo degli eventi (o la piscina di lavoro) | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Come scrivere un server web ad alte prestazioni e più resistente agli attacchi DoS evitando di bloccare il ciclo degli eventi e la piscina di lavoro in Node.js.
  - - meta
    - name: twitter:title
      content: Non bloccare il ciclo degli eventi (o la piscina di lavoro) | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Come scrivere un server web ad alte prestazioni e più resistente agli attacchi DoS evitando di bloccare il ciclo degli eventi e la piscina di lavoro in Node.js.
---


# Non bloccare l'Event Loop (o il Worker Pool)

## Dovresti leggere questa guida?

Se stai scrivendo qualcosa di più complicato di un breve script da riga di comando, leggere questo dovrebbe aiutarti a scrivere applicazioni più performanti e più sicure.

Questo documento è scritto pensando ai server Node.js, ma i concetti si applicano anche ad applicazioni Node.js complesse. Dove i dettagli specifici del sistema operativo variano, questo documento è incentrato su Linux.

## Riepilogo

Node.js esegue codice JavaScript nell'Event Loop (inizializzazione e callback) e offre un Worker Pool per gestire attività dispendiose come l'I/O dei file. Node.js scala bene, a volte meglio di approcci più pesanti come Apache. Il segreto della scalabilità di Node.js è che utilizza un piccolo numero di thread per gestire molti client. Se Node.js può fare a meno di meno thread, può dedicare più tempo e memoria del tuo sistema a lavorare sui client piuttosto che a pagare costi generali di spazio e tempo per i thread (memoria, cambio di contesto). Ma poiché Node.js ha solo pochi thread, devi strutturare la tua applicazione per utilizzarli con saggezza.

Ecco una buona regola empirica per mantenere il tuo server Node.js veloce: *Node.js è veloce quando il lavoro associato a ciascun client in un dato momento è "piccolo".*

Questo si applica ai callback sull'Event Loop e alle attività sul Worker Pool.

## Perché dovrei evitare di bloccare l'Event Loop e il Worker Pool?

Node.js utilizza un piccolo numero di thread per gestire molti client. In Node.js ci sono due tipi di thread: un Event Loop (noto anche come loop principale, thread principale, thread evento, ecc.) e un pool di `k` Workers in un Worker Pool (noto anche come threadpool).

Se un thread impiega molto tempo per eseguire un callback (Event Loop) o un'attività (Worker), lo chiamiamo "bloccato". Mentre un thread è bloccato a lavorare per conto di un client, non può gestire le richieste da altri client. Questo fornisce due motivazioni per non bloccare né l'Event Loop né il Worker Pool:

1. Prestazioni: se esegui regolarmente attività pesanti su entrambi i tipi di thread, il *throughput* (richieste/secondo) del tuo server ne risentirà.
2. Sicurezza: se è possibile che per determinati input uno dei tuoi thread possa bloccarsi, un client dannoso potrebbe inviare questo "input malvagio", far bloccare i tuoi thread e impedirgli di lavorare su altri client. Questo sarebbe un [attacco Denial of Service](https://en.wikipedia.org/wiki/Denial-of-service_attack).


## Una rapida revisione di Node

Node.js utilizza l'Architettura Event-Driven: ha un Event Loop per l'orchestrazione e un Worker Pool per task onerosi.

### Quale codice viene eseguito sull'Event Loop?

Quando iniziano, le applicazioni Node.js completano prima una fase di inizializzazione, `require`-endo moduli e registrando callback per eventi. Le applicazioni Node.js entrano quindi nell'Event Loop, rispondendo alle richieste in entrata del client eseguendo il callback appropriato. Questo callback viene eseguito in modo sincrono e può registrare richieste asincrone per continuare l'elaborazione dopo che è stato completato. I callback per queste richieste asincrone verranno anch'essi eseguiti sull'Event Loop.

L'Event Loop soddisferà anche le richieste asincrone non bloccanti effettuate dai suoi callback, ad es., I/O di rete.

In sintesi, l'Event Loop esegue i callback JavaScript registrati per gli eventi ed è anche responsabile del soddisfacimento delle richieste asincrone non bloccanti come l'I/O di rete.

### Quale codice viene eseguito sul Worker Pool?

Il Worker Pool di Node.js è implementato in libuv ([docs](http://docs.libuv.org/en/v1.x/threadpool.html)), che espone un'API di invio task generale.

Node.js utilizza il Worker Pool per gestire task "onerosi". Ciò include l'I/O per il quale un sistema operativo non fornisce una versione non bloccante, nonché task particolarmente intensivi per la CPU.

Queste sono le API del modulo Node.js che fanno uso di questo Worker Pool:

1. I/O-intensive
    1. [DNS](/it/nodejs/api/dns): `dns.lookup()`, `dns.lookupService()`.
    2. [File System](/it/nodejs/api/fs): Tutte le API del file system, ad eccezione di `fs.FSWatcher()` e quelle esplicitamente sincrone, utilizzano il threadpool di libuv.
2. CPU-intensive
    1. [Crypto](/it/nodejs/api/crypto): `crypto.pbkdf2()`, `crypto.scrypt()`, `crypto.randomBytes()`, `crypto.randomFill()`, `crypto.generateKeyPair()`.
    2. [Zlib](/it/nodejs/api/zlib): Tutte le API zlib, ad eccezione di quelle esplicitamente sincrone, utilizzano il threadpool di libuv.

In molte applicazioni Node.js, queste API sono le uniche fonti di task per il Worker Pool. Applicazioni e moduli che utilizzano un [C++ add-on](/it/nodejs/api/addons) possono inviare altri task al Worker Pool.

Per completezza, notiamo che quando si chiama una di queste API da un callback sull'Event Loop, l'Event Loop paga alcuni piccoli costi di configurazione quando entra nei binding C++ di Node.js per quella API e invia un task al Worker Pool. Questi costi sono trascurabili rispetto al costo complessivo del task, motivo per cui l'Event Loop lo sta scaricando. Quando si invia uno di questi task al Worker Pool, Node.js fornisce un puntatore alla funzione C++ corrispondente nei binding C++ di Node.js.


### Come fa Node.js a decidere quale codice eseguire successivamente?

In astratto, l'Event Loop e il Worker Pool mantengono rispettivamente le code per gli eventi in sospeso e per le attività in sospeso.

In realtà, l'Event Loop non mantiene effettivamente una coda. Invece, ha una raccolta di descrittori di file che chiede al sistema operativo di monitorare, utilizzando un meccanismo come [epoll](http://man7.org/linux/man-pages/man7/epoll.7.html) (Linux), [kqueue](https://developer.apple.com/library/content/documentation/Darwin/Conceptual/FSEvents_ProgGuide/KernelQueues/KernelQueues.html) (OSX), porte evento (Solaris) o [IOCP](https://msdn.microsoft.com/en-us/library/windows/desktop/aa365198.aspx) (Windows). Questi descrittori di file corrispondono a socket di rete, a tutti i file che sta osservando e così via. Quando il sistema operativo afferma che uno di questi descrittori di file è pronto, l'Event Loop lo traduce nell'evento appropriato e richiama i callback associati a tale evento. Puoi saperne di più su questo processo [qui](https://www.youtube.com/watch?v=P9csgxBgaZ8).

Al contrario, il Worker Pool utilizza una coda reale le cui voci sono attività da elaborare. Un Worker estrae un'attività da questa coda e ci lavora e, una volta terminato, il Worker genera un evento "Almeno un'attività è terminata" per l'Event Loop.

### Cosa significa questo per la progettazione dell'applicazione?
In un sistema con un thread per client come Apache, a ogni client in sospeso viene assegnato il proprio thread. Se un thread che gestisce un client si blocca, il sistema operativo lo interromperà e darà la possibilità a un altro client. Il sistema operativo garantisce quindi che i client che richiedono una piccola quantità di lavoro non siano penalizzati dai client che richiedono più lavoro.

Poiché Node.js gestisce molti client con pochi thread, se un thread si blocca durante la gestione della richiesta di un client, le richieste dei client in sospeso potrebbero non avere la possibilità fino a quando il thread non termina il suo callback o attività. Il trattamento equo dei clienti è quindi responsabilità della tua applicazione. Ciò significa che non dovresti fare troppo lavoro per nessun client in un singolo callback o attività.

Questo è in parte il motivo per cui Node.js può scalare bene, ma significa anche che sei responsabile di garantire una pianificazione equa. Le sezioni successive parlano di come garantire una pianificazione equa per l'Event Loop e per il Worker Pool.


## Non bloccare l'Event Loop
L'Event Loop nota ogni nuova connessione client e orchestra la generazione di una risposta. Tutte le richieste in entrata e le risposte in uscita passano attraverso l'Event Loop. Ciò significa che se l'Event Loop impiega troppo tempo in un qualsiasi punto, tutti i client attuali e nuovi non avranno la possibilità di essere serviti.

Dovresti assicurarti di non bloccare mai l'Event Loop. In altre parole, ogni tua callback JavaScript dovrebbe completarsi rapidamente. Questo, ovviamente, vale anche per i tuoi `await`, i tuoi `Promise.then` e così via.

Un buon modo per garantirlo è ragionare sulla ["complessità computazionale"](https://en.wikipedia.org/wiki/Time_complexity) delle tue callback. Se la tua callback richiede un numero costante di passaggi indipendentemente dai suoi argomenti, allora darai sempre a ogni client in attesa un'opportunità equa. Se la tua callback richiede un numero diverso di passaggi a seconda dei suoi argomenti, allora dovresti pensare a quanto potrebbero essere lunghi gli argomenti.

Esempio 1: Una callback a tempo costante.

```js
app.get('/constant-time', (req, res) => {
  res.sendStatus(200);
});
```

Esempio 2: Una callback `O(n)`. Questa callback verrà eseguita rapidamente per piccoli `n` e più lentamente per grandi `n`.

```js
app.get('/countToN', (req, res) => {
  let n = req.query.n;
  // n iterazioni prima di dare a qualcun altro la possibilità di essere servito
  for (let i = 0; i < n; i++) {
    console.log(`Iter ${i}`);
  }
  res.sendStatus(200);
});
```
Esempio 3: Una callback `O(n^2)`. Questa callback verrà comunque eseguita rapidamente per piccoli `n`, ma per grandi `n` verrà eseguita molto più lentamente rispetto al precedente esempio `O(n)`.

```js
app.get('/countToN2', (req, res) => {
  let n = req.query.n;
  // n^2 iterazioni prima di dare a qualcun altro la possibilità di essere servito
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      console.log(`Iter ${i}.${j}`);
    }
  }
  res.sendStatus(200);
});
```

### Quanto dovresti stare attento?
Node.js utilizza il motore Google V8 per JavaScript, che è abbastanza veloce per molte operazioni comuni. Eccezioni a questa regola sono le regex e le operazioni JSON, discusse di seguito.

Tuttavia, per attività complesse dovresti considerare di limitare l'input e rifiutare gli input troppo lunghi. In questo modo, anche se la tua callback ha una grande complessità, limitando l'input ti assicuri che la callback non possa impiegare più del tempo nel caso peggiore sull'input accettabile più lungo. Puoi quindi valutare il costo nel caso peggiore di questa callback e determinare se il suo tempo di esecuzione è accettabile nel tuo contesto.


## Bloccare l'Event Loop: REDOS

Un modo comune per bloccare l'Event Loop in modo disastroso è usare una [espressione regolare](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) "vulnerabile".

### Evitare espressioni regolari vulnerabili
Un'espressione regolare (regexp) confronta una stringa di input con un modello. Solitamente pensiamo che una corrispondenza regexp richieda un singolo passaggio attraverso la stringa di input `--- O(n)` dove `n` è la lunghezza della stringa di input. In molti casi, un singolo passaggio è effettivamente tutto ciò che serve. Sfortunatamente, in alcuni casi la corrispondenza regexp potrebbe richiedere un numero esponenziale di passaggi attraverso la stringa di input `--- O(2^n)`. Un numero esponenziale di passaggi significa che se il motore richiede x passaggi per determinare una corrispondenza, avrà bisogno di `2*x` passaggi se aggiungiamo solo un carattere in più alla stringa di input. Poiché il numero di passaggi è linearmente correlato al tempo necessario, l'effetto di questa valutazione sarà quello di bloccare l'Event Loop.

Una *espressione regolare vulnerabile* è una in cui il tuo motore di espressioni regolari potrebbe impiegare un tempo esponenziale, esponendoti a [REDOS](https://owasp.org/www-community/attacks/Regular_expression_Denial_of_Service_-_ReDoS) su "input maligno". Che il tuo modello di espressione regolare sia vulnerabile o meno (cioè, il motore regexp potrebbe impiegare un tempo esponenziale su di esso) è in realtà una domanda difficile a cui rispondere, e varia a seconda che tu stia usando Perl, Python, Ruby, Java, JavaScript, ecc., ma ecco alcune regole generali che si applicano a tutte queste lingue:

1. Evita quantificatori nidificati come `(a+)*`. Il motore regexp di V8 può gestirne alcuni rapidamente, ma altri sono vulnerabili.
2. Evita OR con clausole sovrapposte, come `(a|a)*`. Di nuovo, questi sono a volte veloci.
3. Evita di usare backreference, come `(a.*) \1`. Nessun motore regexp può garantire la valutazione di questi in tempo lineare.
4. Se stai facendo una semplice corrispondenza di stringhe, usa `indexOf` o l'equivalente locale. Sarà più economico e non richiederà mai più di `O(n)`.

Se non sei sicuro che la tua espressione regolare sia vulnerabile, ricorda che Node.js generalmente non ha problemi a segnalare una corrispondenza anche per una regexp vulnerabile e una stringa di input lunga. Il comportamento esponenziale viene attivato quando c'è una mancata corrispondenza ma Node.js non può esserne certo finché non prova molti percorsi attraverso la stringa di input.


### Un esempio di REDOS

Ecco un esempio di regexp vulnerabile che espone il server a REDOS:

```js
app.get('/redos-me', (req, res) => {
  let filePath = req.query.filePath;
  // REDOS
  if (filePath.match(/(\/.+)+$/)) {
    console.log('valid path');
  } else {
    console.log('invalid path');
  }
  res.sendStatus(200);
});
```

La regexp vulnerabile in questo esempio è un modo (sbagliato!) per controllare un percorso valido su Linux. Abbina stringhe che sono una sequenza di nomi delimitati da "/", come "`/a/b/c`". È pericolosa perché viola la regola 1: ha un quantificatore doppiamente nidificato.

Se un client esegue una query con filePath `///.../\n` (100 / seguiti da un carattere di nuova riga che il "." della regexp non abbinerà), allora l'Event Loop impiegherà praticamente un'eternità, bloccando l'Event Loop. L'attacco REDOS di questo client fa sì che tutti gli altri client non abbiano la possibilità di intervenire finché l'abbinamento della regexp non è terminato.

Per questo motivo, dovresti diffidare dell'uso di espressioni regolari complesse per convalidare l'input dell'utente.

### Risorse Anti-REDOS
Esistono alcuni strumenti per verificare la sicurezza delle tue regexp, come

- [safe-regex](https://github.com/davisjam/safe-regex)
- [rxxr2](https://github.com/superhuman/rxxr2)

Tuttavia, nessuno di questi catturerà tutte le regexp vulnerabili.

Un altro approccio è quello di utilizzare un motore di regexp diverso. Potresti usare il modulo [node-re2](https://github.com/uhop/node-re2), che utilizza il motore di regexp [RE2](https://github.com/google/re2) di Google, velocissimo. Ma attenzione, RE2 non è compatibile al 100% con le regexp di V8, quindi verifica la presenza di regressioni se sostituisci il modulo node-re2 per gestire le tue regexp. E le regexp particolarmente complicate non sono supportate da node-re2.

Se stai cercando di abbinare qualcosa di "ovvio", come un URL o un percorso di file, trova un esempio in una [libreria di regexp](http://www.regexlib.com/) o usa un modulo npm, ad esempio [ip-regex](https://www.npmjs.com/package/ip-regex).

### Bloccare l'Event Loop: Moduli core di Node.js

Diversi moduli core di Node.js hanno API sincrone costose, tra cui:

- [Crittografia](/it/nodejs/api/crypto)
- [Compressione](/it/nodejs/api/zlib)
- [File system](/it/nodejs/api/fs)
- [Processo figlio](/it/nodejs/api/child_process)

Queste API sono costose, perché implicano una computazione significativa (crittografia, compressione), richiedono I/O (I/O di file) o potenzialmente entrambi (processo figlio). Queste API sono destinate alla comodità di scripting, ma non sono destinate all'uso nel contesto del server. Se le esegui sull'Event Loop, impiegheranno molto più tempo per essere completate rispetto a una tipica istruzione JavaScript, bloccando l'Event Loop.

In un server, non dovresti usare le seguenti API sincrone da questi moduli:

- Crittografia:
    - `crypto.randomBytes` (versione sincrona)
    - `crypto.randomFillSync`
    - `crypto.pbkdf2Sync`
    - Dovresti anche fare attenzione a fornire input di grandi dimensioni alle routine di crittografia e decrittografia.
- Compressione:
    - `zlib.inflateSync`
    - `zlib.deflateSync`
- File system:
    - Non usare le API sincrone del file system. Ad esempio, se il file a cui accedi si trova in un [file system distribuito](https://en.wikipedia.org/wiki/Clustered_file_system#Distributed_file_systems) come [NFS](https://en.wikipedia.org/wiki/Network_File_System), i tempi di accesso possono variare notevolmente.
- Processo figlio:
    - `child_process.spawnSync`
    - `child_process.execSync`
    - `child_process.execFileSync`

Questo elenco è ragionevolmente completo a partire da Node.js v9.


## Blocco del ciclo di eventi: JSON DOS

`JSON.parse` e `JSON.stringify` sono altre operazioni potenzialmente costose. Sebbene siano O(n) nella lunghezza dell'input, per n grandi possono richiedere sorprendentemente molto tempo.

Se il tuo server manipola oggetti JSON, in particolare quelli provenienti da un client, dovresti fare attenzione alle dimensioni degli oggetti o delle stringhe con cui lavori nel ciclo di eventi.

Esempio: blocco JSON. Creiamo un oggetto `obj` di dimensione 2^21 e lo `JSON.stringify`, eseguiamo indexOf sulla stringa e quindi lo `JSON.parse`. La stringa `JSON.stringify`'d è di 50MB. Impiega 0,7 secondi per trasformare l'oggetto in stringa, 0,03 secondi per indexOf sulla stringa di 50MB e 1,3 secondi per analizzare la stringa.

```js
let obj = { a: 1 };
let niter = 20;
let before, str, pos, res, took;
for (let i = 0; i < niter; i++) {
  obj = { obj1: obj, obj2: obj }; // Raddoppia le dimensioni ad ogni iterazione
}
before = process.hrtime();
str = JSON.stringify(obj);
took = process.hrtime(before);
console.log('JSON.stringify ha impiegato ' + took);
before = process.hrtime();
pos = str.indexOf('nomatch');
took = process.hrtime(before);
console.log('Pure indexof ha impiegato ' + took);
before = process.hrtime();
res = JSON.parse(str);
took = process.hrtime(before);
console.log('JSON.parse ha impiegato ' + took);
```

Esistono moduli npm che offrono API JSON asincrone. Vedere per esempio:

- [JSONStream](https://www.npmjs.com/package/JSONStream), che ha API di flusso.
- [Big-Friendly JSON](https://www.npmjs.com/package/bfj), che ha API di flusso e versioni asincrone delle API JSON standard utilizzando il paradigma di partizionamento sul ciclo di eventi descritto di seguito.

## Calcoli complessi senza bloccare il ciclo di eventi

Supponiamo di voler eseguire calcoli complessi in JavaScript senza bloccare il ciclo di eventi. Hai due opzioni: partizionamento o offload.

### Partizionamento

Potresti *partizionare* i tuoi calcoli in modo che ognuno venga eseguito sul ciclo di eventi ma ceda regolarmente (dà spazio a) altri eventi in sospeso. In JavaScript è facile salvare lo stato di un'attività in corso in una closure, come mostrato nell'esempio 2 di seguito.

Per un semplice esempio, supponiamo di voler calcolare la media dei numeri da `1` a `n`.

Esempio 1: media non partizionata, costa `O(n)`

```js
for (let i = 0; i < n; i++) sum += i;
let avg = sum / n;
console.log('avg: ' + avg);
```

Esempio 2: media partizionata, ognuno degli `n` passaggi asincroni costa `O(1)`.

```js
function asyncAvg(n, avgCB) {
  // Salva la somma in corso nella closure JS.
  let sum = 0;
  function help(i, cb) {
    sum += i;
    if (i == n) {
      cb(sum);
      return;
    }
    // "Ricorsione asincrona".
    // Pianifica la prossima operazione in modo asincrono.
    setImmediate(help.bind(null, i + 1, cb));
  }
  // Avvia l'helper, con CB per chiamare avgCB.
  help(1, function (sum) {
    let avg = sum / n;
    avgCB(avg);
  });
}
asyncAvg(n, function (avg) {
  console.log('avg di 1-n: ' + avg);
});
```

Puoi applicare questo principio alle iterazioni degli array e così via.


### Offloading

Se devi fare qualcosa di più complesso, il partizionamento non è una buona opzione. Questo perché il partizionamento utilizza solo l'Event Loop e non beneficerai dei molteplici core quasi certamente disponibili sulla tua macchina. **Ricorda, l'Event Loop dovrebbe orchestrare le richieste del client, non soddisfarle direttamente.** Per un'attività complicata, sposta il lavoro dall'Event Loop a un Worker Pool.

#### Come eseguire l'offload

Hai due opzioni per un Worker Pool di destinazione a cui eseguire l'offload del lavoro.

1. Puoi utilizzare il Worker Pool integrato di Node.js sviluppando un [addon C++](/it/nodejs/api/addons). Sulle versioni precedenti di Node, costruisci il tuo [addon C++](/it/nodejs/api/addons) usando [NAN](https://github.com/nodejs/nan), e sulle versioni più recenti usa [N-API](/it/nodejs/api/n-api). [node-webworker-threads](https://www.npmjs.com/package/webworker-threads) offre un modo solo JavaScript per accedere al Worker Pool di Node.js.
2. Puoi creare e gestire il tuo Worker Pool dedicato al calcolo piuttosto che il Worker Pool di Node.js a tema I/O. Il modo più semplice per farlo è utilizzare [Child Process](/it/nodejs/api/child_process) o [Cluster](/it/nodejs/api/cluster).

Non dovresti semplicemente creare un [Child Process](/it/nodejs/api/child_process) per ogni client. Puoi ricevere le richieste del client più velocemente di quanto tu possa creare e gestire i processi figlio, e il tuo server potrebbe diventare una [fork bomb](https://en.wikipedia.org/wiki/Fork_bomb).

Svantaggi dell'offload
Lo svantaggio dell'approccio di offload è che comporta un overhead sotto forma di costi di comunicazione. Solo l'Event Loop è autorizzato a vedere il "namespace" (stato JavaScript) della tua applicazione. Da un Worker, non puoi manipolare un oggetto JavaScript nel namespace dell'Event Loop. Invece, devi serializzare e deserializzare qualsiasi oggetto tu voglia condividere. Quindi il Worker può operare sulla propria copia di questi oggetti e restituire l'oggetto modificato (o una "patch") all'Event Loop.

Per problemi di serializzazione, vedi la sezione su JSON DOS.

#### Alcuni suggerimenti per l'offload

Potresti voler distinguere tra attività ad alta intensità di CPU e attività ad alta intensità di I/O perché hanno caratteristiche notevolmente diverse.

Un'attività ad alta intensità di CPU fa progressi solo quando il suo Worker è pianificato e il Worker deve essere pianificato su uno dei [core logici](/it/nodejs/api/os) della tua macchina. Se hai 4 core logici e 5 Worker, uno di questi Worker non può fare progressi. Di conseguenza, stai pagando overhead (memoria e costi di pianificazione) per questo Worker e non ottieni alcun ritorno.

Le attività ad alta intensità di I/O comportano l'interrogazione di un fornitore di servizi esterno (DNS, file system, ecc.) e l'attesa della sua risposta. Mentre un Worker con un'attività ad alta intensità di I/O è in attesa della sua risposta, non ha nient'altro da fare e può essere de-schedulato dal sistema operativo, dando a un altro Worker la possibilità di inviare la sua richiesta. Pertanto, le attività ad alta intensità di I/O faranno progressi anche mentre il thread associato non è in esecuzione. I fornitori di servizi esterni come database e file system sono stati altamente ottimizzati per gestire molte richieste in sospeso contemporaneamente. Ad esempio, un file system esaminerà un ampio set di richieste di scrittura e lettura in sospeso per unire aggiornamenti in conflitto e recuperare file in un ordine ottimale.

Se ti affidi a un solo Worker Pool, ad es. il Worker Pool di Node.js, allora le diverse caratteristiche del lavoro CPU-bound e I/O-bound possono danneggiare le prestazioni della tua applicazione.

Per questo motivo, potresti voler mantenere un Worker Pool di calcolo separato.


### Offloading: conclusioni

Per compiti semplici, come iterare sugli elementi di un array arbitrariamente lungo, il partizionamento potrebbe essere una buona opzione. Se il calcolo è più complesso, l'offloading è un approccio migliore: i costi di comunicazione, ovvero l'overhead del passaggio di oggetti serializzati tra l'Event Loop e il Worker Pool, sono compensati dal vantaggio di utilizzare più core.

Tuttavia, se il tuo server si basa fortemente su calcoli complessi, dovresti valutare se Node.js sia davvero una buona soluzione. Node.js eccelle per il lavoro I/O-bound, ma per calcoli costosi potrebbe non essere l'opzione migliore.

Se adotti l'approccio dell'offloading, consulta la sezione su come non bloccare il Worker Pool.

### Non bloccare il Worker Pool
Node.js ha un Worker Pool composto da k Workers. Se stai utilizzando il paradigma di Offloading discusso sopra, potresti avere un Worker Pool Computazionale separato, al quale si applicano gli stessi principi. In entrambi i casi, supponiamo che k sia molto più piccolo del numero di client che potresti gestire contemporaneamente. Questo è in linea con la filosofia "un thread per molti client" di Node.js, il segreto della sua scalabilità.

Come discusso sopra, ogni Worker completa il suo Task corrente prima di passare al successivo nella coda del Worker Pool.

Ora, ci sarà variazione nel costo dei Task necessari per gestire le richieste dei tuoi client. Alcuni Task possono essere completati rapidamente (ad esempio, leggere file brevi o memorizzati nella cache, o produrre un piccolo numero di byte casuali), e altri richiederanno più tempo (ad esempio, leggere file più grandi o non memorizzati nella cache, o generare più byte casuali). Il tuo obiettivo dovrebbe essere quello di minimizzare la variazione nei tempi dei Task, e dovresti utilizzare il partizionamento dei Task per raggiungere questo obiettivo.

#### Minimizzare la variazione nei tempi dei Task

Se il Task corrente di un Worker è molto più costoso di altri Task, allora non sarà disponibile a lavorare su altri Task in sospeso. In altre parole, ogni Task relativamente lungo riduce effettivamente la dimensione del Worker Pool di uno fino a quando non viene completato. Questo è indesiderabile perché, fino a un certo punto, più Worker ci sono nel Worker Pool, maggiore è la produttività del Worker Pool (task/secondo) e quindi maggiore è la produttività del server (richieste client/secondo). Un client con un Task relativamente costoso diminuirà la produttività del Worker Pool, diminuendo a sua volta la produttività del server.

Per evitare questo, dovresti cercare di minimizzare la variazione nella lunghezza dei Task che invii al Worker Pool. Sebbene sia appropriato trattare i sistemi esterni a cui accedono le tue richieste I/O (DB, FS, ecc.) come black box, dovresti essere consapevole del costo relativo di queste richieste I/O, e dovresti evitare di inviare richieste che ti aspetti che siano particolarmente lunghe.

Due esempi dovrebbero illustrare la possibile variazione nei tempi dei task.


#### Esempio di variazione: Letture del file system di lunga durata

Supponiamo che il tuo server debba leggere file per gestire alcune richieste dei client. Dopo aver consultato le API del [File system](/it/nodejs/api/fs) di Node.js, hai optato per l'uso di `fs.readFile()` per semplicità. Tuttavia, `fs.readFile()` (attualmente) non è partizionato: invia un singolo Task `fs.read()` che copre l'intero file. Se leggi file più brevi per alcuni utenti e file più lunghi per altri, `fs.readFile()` può introdurre una variazione significativa nella lunghezza dei Task, a scapito della produttività del Worker Pool.

Nello scenario peggiore, supponiamo che un aggressore possa convincere il tuo server a leggere un file arbitrario (questa è una [vulnerabilità di directory traversal](https://www.owasp.org/index.php/Path_Traversal)). Se il tuo server esegue Linux, l'aggressore può nominare un file estremamente lento: `/dev/random`. Per tutti gli scopi pratici, `/dev/random` è infinitamente lento e ogni Worker a cui viene chiesto di leggere da `/dev/random` non finirà mai quel Task. Un aggressore quindi invia k richieste, una per ogni Worker, e nessun'altra richiesta del client che utilizza il Worker Pool farà progressi.

#### Esempio di variazione: Operazioni di crittografia di lunga durata

Supponiamo che il tuo server generi byte casuali crittograficamente sicuri usando `crypto.randomBytes()`. `crypto.randomBytes()` non è partizionato: crea un singolo Task `randomBytes()` per generare tutti i byte richiesti. Se crei meno byte per alcuni utenti e più byte per altri, `crypto.randomBytes()` è un'altra fonte di variazione nella lunghezza dei Task.

### Partizionamento dei Task

I Task con costi di tempo variabili possono danneggiare la produttività del Worker Pool. Per ridurre al minimo la variazione dei tempi dei Task, per quanto possibile è necessario partizionare ogni Task in sub-Task a costo comparabile. Quando ogni sub-Task viene completato, deve inviare il sub-Task successivo e, quando il sub-Task finale viene completato, deve notificare il mittente.

Per continuare con l'esempio `fs.readFile()`, dovresti invece usare `fs.read()` (partizionamento manuale) o `ReadStream` (partizionato automaticamente).

Lo stesso principio si applica ai task vincolati alla CPU; l'esempio `asyncAvg` potrebbe non essere appropriato per l'Event Loop, ma è adatto al Worker Pool.

Quando si partiziona un Task in sub-Task, i Task più brevi si espandono in un piccolo numero di sub-Task e i Task più lunghi si espandono in un numero maggiore di sub-Task. Tra ogni sub-Task di un Task più lungo, il Worker a cui è stato assegnato può lavorare su un sub-Task da un altro Task più breve, migliorando così la produttività complessiva del Worker Pool.

Si noti che il numero di sub-Task completati non è una metrica utile per la produttività del Worker Pool. Invece, preoccupati del numero di Task completati.


### Evitare il partizionamento delle Task

Ricorda che lo scopo del partizionamento delle Task è minimizzare la variazione nei tempi delle Task. Se riesci a distinguere tra Task più brevi e Task più lunghe (ad esempio, sommare un array rispetto a ordinare un array), potresti creare un Worker Pool per ogni classe di Task. Instradare Task più brevi e Task più lunghe a Worker Pool separati è un altro modo per minimizzare la variazione del tempo delle Task.

A favore di questo approccio, il partizionamento delle Task comporta overhead (i costi di creazione di una rappresentazione della Task nel Worker Pool e di manipolazione della coda del Worker Pool) ed evitare il partizionamento ti fa risparmiare i costi di ulteriori viaggi al Worker Pool. Ti impedisce anche di commettere errori nel partizionamento delle tue Task.

Lo svantaggio di questo approccio è che i Worker in tutti questi Worker Pool incorreranno in overhead di spazio e tempo e competeranno tra loro per il tempo della CPU. Ricorda che ogni Task legata alla CPU fa progressi solo mentre è pianificata. Di conseguenza, dovresti considerare questo approccio solo dopo un'attenta analisi.

### Worker Pool: conclusioni

Sia che utilizzi solo il Worker Pool di Node.js o che mantenga Worker Pool separati, dovresti ottimizzare il throughput delle Task dei tuoi Pool.

Per fare ciò, minimizza la variazione nei tempi delle Task utilizzando il partizionamento delle Task.

## I rischi dei moduli npm

Mentre i moduli core di Node.js offrono elementi costitutivi per un'ampia varietà di applicazioni, a volte è necessario qualcosa di più. Gli sviluppatori Node.js traggono enormi vantaggi dall'ecosistema npm, con centinaia di migliaia di moduli che offrono funzionalità per accelerare il processo di sviluppo.

Ricorda, tuttavia, che la maggior parte di questi moduli sono scritti da sviluppatori di terze parti e sono generalmente rilasciati con solo garanzie del miglior sforzo. Uno sviluppatore che utilizza un modulo npm dovrebbe preoccuparsi di due cose, anche se quest'ultima viene spesso dimenticata.

1. Rispetta le sue API?
2. Le sue API potrebbero bloccare l'Event Loop o un Worker? Molti moduli non si sforzano di indicare il costo delle loro API, a detrimento della comunità.

Per le API semplici puoi stimare il costo delle API; il costo della manipolazione delle stringhe non è difficile da capire. Ma in molti casi non è chiaro quanto potrebbe costare un'API.

Se stai chiamando un'API che potrebbe fare qualcosa di costoso, ricontrolla il costo. Chiedi agli sviluppatori di documentarlo o esamina tu stesso il codice sorgente (e invia una PR documentando il costo).

Ricorda, anche se l'API è asincrona, non sai quanto tempo potrebbe trascorrere su un Worker o sull'Event Loop in ciascuna delle sue partizioni. Ad esempio, supponi che nell'esempio `asyncAvg` fornito sopra, ogni chiamata alla funzione helper sommasse la metà dei numeri anziché uno di essi. Allora questa funzione sarebbe ancora asincrona, ma il costo di ogni partizione sarebbe `O(n)`, non `O(1)`, rendendola molto meno sicura da usare per valori arbitrari di `n`.


## Conclusione

Node.js ha due tipi di thread: un Event Loop e k Worker. L'Event Loop è responsabile dei callback JavaScript e I/O non bloccante, e un Worker esegue task corrispondenti a codice C++ che completa una richiesta asincrona, includendo I/O bloccante e lavoro CPU-intensive. Entrambi i tipi di thread lavorano su non più di una attività alla volta. Se un callback o task impiega molto tempo, il thread che lo esegue viene bloccato. Se la tua applicazione esegue callback o task bloccanti, ciò può portare a un throughput degradato (client/secondo) nella migliore delle ipotesi, e a un completo denial of service nella peggiore.

Per scrivere un web server ad alto throughput e più resistente agli attacchi DoS, devi assicurarti che, sia con input benigni che con input malevoli, né il tuo Event Loop né i tuoi Worker vengano bloccati.

