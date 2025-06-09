---
title: Analisi delle prestazioni delle applicazioni Node.js
description: Scopri come utilizzare il profiler integrato di Node.js per identificare i colli di bottiglia delle prestazioni della tua applicazione e migliorare le prestazioni.
head:
  - - meta
    - name: og:title
      content: Analisi delle prestazioni delle applicazioni Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Scopri come utilizzare il profiler integrato di Node.js per identificare i colli di bottiglia delle prestazioni della tua applicazione e migliorare le prestazioni.
  - - meta
    - name: twitter:title
      content: Analisi delle prestazioni delle applicazioni Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Scopri come utilizzare il profiler integrato di Node.js per identificare i colli di bottiglia delle prestazioni della tua applicazione e migliorare le prestazioni.
---


# Profilazione delle applicazioni Node.js

Esistono molti strumenti di terze parti disponibili per la profilazione delle applicazioni Node.js ma, in molti casi, l'opzione più semplice è utilizzare il profiler integrato di Node.js. Il profiler integrato utilizza il [profiler all'interno di V8](https://v8.dev/docs/profile) che campiona lo stack a intervalli regolari durante l'esecuzione del programma. Registra i risultati di questi campioni, insieme a importanti eventi di ottimizzazione come le compilazioni JIT, come una serie di tick:

```bash
code-creation,LazyCompile,0,0x2d5000a337a0,396,"bp native array.js:1153:16",0x289f644df68,~
code-creation,LazyCompile,0,0x2d5000a33940,716,"hasOwnProperty native v8natives.js:198:30",0x289f64438d0,~
code-creation,LazyCompile,0,0x2d5000a33c20,284,"ToName native runtime.js:549:16",0x289f643bb28,~
code-creation,Stub,2,0x2d5000a33d40,182,"DoubleToIStub"
code-creation,Stub,2,0x2d5000a33e00,507,"NumberToStringStub"
```
In passato, era necessario il codice sorgente di V8 per poter interpretare i tick. Fortunatamente, sono stati introdotti strumenti a partire da Node.js 4.4.0 che facilitano l'utilizzo di queste informazioni senza dover compilare separatamente V8 dai sorgenti. Vediamo come il profiler integrato può aiutare a fornire informazioni sulle prestazioni dell'applicazione.

Per illustrare l'uso del tick profiler, lavoreremo con una semplice applicazione Express. La nostra applicazione avrà due gestori, uno per aggiungere nuovi utenti al nostro sistema:

```javascript
app.get('/newUser', (req, res) => {
  let username = req.query.username || '';
  const password = req.query.password || '';
  username = username.replace(/[!@#$%^&*]/g, '');
  if (!username || !password || users[username]) {
    return res.sendStatus(400);
  }
  const salt = crypto.randomBytes(128).toString('base64');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512');
  users[username] = { salt, hash };
  res.sendStatus(200);
});
```

e un altro per convalidare i tentativi di autenticazione dell'utente:

```javascript
app.get('/auth', (req, res) => {
  let username = req.query.username || '';
  const password = req.query.password || '';
  username = username.replace(/[!@#$%^&*]/g, '');
  if (!username || !password || !users[username]) {
    return res.sendStatus(400);
  }
  const { salt, hash } = users[username];
  const encryptHash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512');
  if (crypto.timingSafeEqual(hash, encryptHash)) {
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});
```

*Si prega di notare che questi NON sono gestori raccomandati per l'autenticazione degli utenti nelle vostre applicazioni Node.js e sono utilizzati puramente a scopo illustrativo. In generale, non dovreste cercare di progettare i vostri meccanismi di autenticazione crittografica. È molto meglio usare soluzioni di autenticazione esistenti e collaudate.*

Ora supponiamo di aver distribuito la nostra applicazione e gli utenti si lamentano dell'elevata latenza delle richieste. Possiamo facilmente eseguire l'app con il profiler integrato:

```bash
NODE_ENV=production node --prof app.js
```

e mettere un po' di carico sul server usando `ab` (ApacheBench):

```bash
curl -X GET "http://localhost:8080/newUser?username=matt&password=password"
ab -k -c 20 -n 250 "http://localhost:8080/auth?username=matt&password=password"
```

e ottenere un output ab di:

```bash
Concurrency Level:      20
Time taken for tests:   46.932 seconds
Complete requests:      250
Failed requests:        0
Keep-Alive requests:    250
Total transferred:      50250 bytes
HTML transferred:       500 bytes
Requests per second:    5.33 [#/sec] (mean)
Time per request:       3754.556 [ms] (mean)
Time per request:       187.728 [ms] (mean, across all concurrent requests)
Transfer rate:          1.05 [Kbytes/sec] received
...
Percentage of the requests served within a certain time (ms)
  50%   3755
  66%   3804
  75%   3818
  80%   3825
  90%   3845
  95%   3858
  98%   3874
  99%   3875
 100%   4225 (longest request)
```

Da questo output, vediamo che riusciamo a servire solo circa 5 richieste al secondo e che la richiesta media impiega poco meno di 4 secondi andata e ritorno. In un esempio reale, potremmo fare un sacco di lavoro in molte funzioni per conto di una richiesta dell'utente, ma anche nel nostro semplice esempio, il tempo potrebbe essere perso compilando espressioni regolari, generando salti casuali, generando hash univoci dalle password degli utenti o all'interno dello stesso framework Express.

Poiché abbiamo eseguito la nostra applicazione usando l'opzione `--prof`, è stato generato un file tick nella stessa directory della tua esecuzione locale dell'applicazione. Dovrebbe avere la forma `isolate-0xnnnnnnnnnnnn-v8.log` (dove n è una cifra).

Per dare un senso a questo file, dobbiamo usare il tick processor incluso nel binario Node.js. Per eseguire il processore, usa il flag `--prof-process`:

```bash
node --prof-process isolate-0xnnnnnnnnnnnn-v8.log > processed.txt
```

Aprire processed.txt nel tuo editor di testo preferito ti darà alcuni diversi tipi di informazioni. Il file è suddiviso in sezioni che sono a loro volta suddivise per linguaggio. Per prima cosa, guardiamo la sezione di riepilogo e vediamo:

```bash
[Summary]:
   ticks  total  nonlib   name
     79    0.2%    0.2%  JavaScript
  36703   97.2%   99.2%  C++
      7    0.0%    0.0%  GC
    767    2.0%          Shared libraries
    215    0.6%          Unaccounted
```

Questo ci dice che il 97% di tutti i campioni raccolti si sono verificati nel codice C++ e che quando si visualizzano altre sezioni dell'output elaborato dovremmo prestare maggiore attenzione al lavoro svolto in C++ (invece che in JavaScript). Tenendo presente questo, troviamo la sezione [C++] che contiene informazioni su quali funzioni C++ stanno prendendo più tempo della CPU e vediamo:

```bash
 [C++]:
   ticks  total  nonlib   name
  19557   51.8%   52.9%  node::crypto::PBKDF2(v8::FunctionCallbackInfo<v8::Value> const&)
   4510   11.9%   12.2%  _sha1_block_data_order
   3165    8.4%    8.6%  _malloc_zone_malloc
```

Vediamo che le prime 3 voci rappresentano il 72,1% del tempo della CPU impiegato dal programma. Da questo output, vediamo immediatamente che almeno il 51,8% del tempo della CPU è occupato da una funzione chiamata PBKDF2 che corrisponde alla nostra generazione di hash dalla password di un utente. Tuttavia, potrebbe non essere immediatamente ovvio come le due voci inferiori rientrino nella nostra applicazione (o se lo è, faremo finta di no per amore dell'esempio). Per capire meglio la relazione tra queste funzioni, daremo un'occhiata alla sezione [Bottom up (heavy) profile] che fornisce informazioni sui principali chiamanti di ogni funzione. Esaminando questa sezione, troviamo:

```bash
  ticks parent  name
  19557   51.8%  node::crypto::PBKDF2(v8::FunctionCallbackInfo<v8::Value> const&)
  19557  100.0%    v8::internal::Builtins::~Builtins()
  19557  100.0%      LazyCompile: ~pbkdf2 crypto.js:557:16
   4510   11.9%  _sha1_block_data_order
   4510  100.0%    LazyCompile: *pbkdf2 crypto.js:557:16
   4510  100.0%      LazyCompile: *exports.pbkdf2Sync crypto.js:552:30
   3165    8.4%  _malloc_zone_malloc
   3161   99.9%    LazyCompile: *pbkdf2 crypto.js:557:16
   3161  100.0%      LazyCompile: *exports.pbkdf2Sync crypto.js:552:30
```

L'analisi di questa sezione richiede un po' più di lavoro rispetto ai conteggi dei tick grezzi di cui sopra. All'interno di ciascuno degli "stack di chiamate" di cui sopra, la percentuale nella colonna parent ti dice la percentuale di campioni per i quali la funzione nella riga sopra è stata chiamata dalla funzione nella riga corrente. Ad esempio, nello "stack di chiamate" centrale di cui sopra per `_sha1_block_data_order`, vediamo che `_sha1_block_data_order` si è verificato nell'11,9% dei campioni, cosa che sapevamo dai conteggi grezzi di cui sopra. Tuttavia, qui, possiamo anche dire che è stato sempre chiamato dalla funzione pbkdf2 all'interno del modulo crypto di Node.js. Vediamo che, allo stesso modo, _malloc_zone_malloc è stato chiamato quasi esclusivamente dalla stessa funzione pbkdf2. Pertanto, usando le informazioni in questa vista, possiamo dire che il nostro calcolo dell'hash dalla password dell'utente rappresenta non solo il 51,8% di cui sopra, ma anche tutto il tempo della CPU nelle prime 3 funzioni più campionate poiché le chiamate a `_sha1_block_data_order` e `_malloc_zone_malloc` sono state fatte per conto della funzione pbkdf2.

A questo punto, è molto chiaro che la generazione di hash basata sulla password dovrebbe essere l'obiettivo della nostra ottimizzazione. Per fortuna, hai interiorizzato completamente i [vantaggi della programmazione asincrona](https://nodesource.com/blog/why-asynchronous) e ti rendi conto che il lavoro per generare un hash dalla password dell'utente viene fatto in modo sincrono e quindi vincolando il ciclo degli eventi. Questo ci impedisce di lavorare su altre richieste in entrata durante il calcolo di un hash.

Per risolvere questo problema, apporti una piccola modifica ai gestori di cui sopra per usare la versione asincrona della funzione pbkdf2:

```javascript
app.get('/auth', (req, res) => {
  let username = req.query.username || '';
  const password = req.query.password || '';
  username = username.replace(/[!@#$%^&*]/g, '');
  if (!username || !password || !users[username]) {
    return res.sendStatus(400);
  }
  crypto.pbkdf2(
    password,
    users[username].salt,
    10000,
    512,
    'sha512',
    (err, hash) => {
      if (users[username].hash.toString() === hash.toString()) {
        res.sendStatus(200);
      } else {
        res.sendStatus(401);
      }
    }
  );
});
```

Una nuova esecuzione del benchmark ab di cui sopra con la versione asincrona della tua app produce:

```bash
Concurrency Level:      20
Time taken for tests:   12.846 seconds
Complete requests:      250
Failed requests:        0
Keep-Alive requests:    250
Total transferred:      50250 bytes
HTML transferred:       500 bytes
Requests per second:    19.46 [#/sec] (mean)
Time per request:       1027.689 [ms] (mean)
Time per request:       51.384 [ms] (mean, across all concurrent requests)
Transfer rate:          3.82 [Kbytes/sec] received
...
Percentage of the requests served within a certain time (ms)
  50%   1018
  66%   1035
  75%   1041
  80%   1043
  90%   1049
  95%   1063
  98%   1070
  99%   1071
 100%   1079 (longest request)
```

Evviva! La tua app ora serve circa 20 richieste al secondo, circa 4 volte di più di quanto non facesse con la generazione di hash sincrona. Inoltre, la latenza media è scesa dai 4 secondi precedenti a poco più di 1 secondo.

Speriamo che, attraverso l'indagine sulle prestazioni di questo esempio (per quanto artificioso), tu abbia visto come il tick processor V8 può aiutarti a ottenere una migliore comprensione delle prestazioni delle tue applicazioni Node.js.

Potresti anche trovare utile [come creare un flame graph](/it/nodejs/guide/flame-graphs).

