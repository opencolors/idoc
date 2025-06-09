---
title: Grafici di fiamma per l'ottimizzazione delle prestazioni di Node.js
description: Scopri come creare grafici di fiamma per visualizzare il tempo di CPU dedicato alle funzioni e ottimizzare le prestazioni di Node.js.
head:
  - - meta
    - name: og:title
      content: Grafici di fiamma per l'ottimizzazione delle prestazioni di Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Scopri come creare grafici di fiamma per visualizzare il tempo di CPU dedicato alle funzioni e ottimizzare le prestazioni di Node.js.
  - - meta
    - name: twitter:title
      content: Grafici di fiamma per l'ottimizzazione delle prestazioni di Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Scopri come creare grafici di fiamma per visualizzare il tempo di CPU dedicato alle funzioni e ottimizzare le prestazioni di Node.js.
---


# Grafici a fiamma

## A cosa serve un grafico a fiamma?

I grafici a fiamma sono un modo per visualizzare il tempo della CPU speso nelle funzioni. Possono aiutarti a individuare dove trascorri troppo tempo a eseguire operazioni sincrone.

## Come creare un grafico a fiamma

Potresti aver sentito dire che creare un grafico a fiamma per Node.js è difficile, ma non è vero (più). Le VM Solaris non sono più necessarie per i grafici a fiamma!

I grafici a fiamma vengono generati dall'output di `perf`, che non è uno strumento specifico per node. Mentre è il modo più potente per visualizzare il tempo della CPU speso, potrebbe avere problemi con il modo in cui il codice JavaScript è ottimizzato in Node.js 8 e versioni successive. Consulta la sezione [problemi di output di perf](#perf-output-issues) di seguito.

### Utilizzare uno strumento pre-pacchettizzato
Se desideri un singolo passaggio che produca un grafico a fiamma localmente, prova [0x](https://www.npmjs.com/package/0x)

Per diagnosticare le implementazioni di produzione, leggi queste note: [0x server di produzione](https://github.com/davidmarkclements/0x/blob/master/docs/production-servers.md).

### Crea un grafico a fiamma con gli strumenti perf di sistema
Lo scopo di questa guida è mostrare i passaggi necessari per creare un grafico a fiamma e mantenerti in controllo di ogni passaggio.

Se desideri comprendere meglio ogni passaggio, dai un'occhiata alle sezioni seguenti in cui approfondiamo i dettagli.

Ora mettiamoci al lavoro.

1. Installa `perf` (di solito disponibile tramite il pacchetto linux-tools-common se non è già installato)
2. Prova a eseguire `perf` - potrebbe lamentarsi della mancanza di moduli del kernel, installa anche quelli
3. Esegui node con perf abilitato (vedi [problemi di output di perf](#perf-output-issues) per suggerimenti specifici per le versioni di Node.js)
```bash
perf record -e cycles:u -g -- node --perf-basic-prof app.js
```
4. Ignora gli avvisi a meno che non ti dicano che non puoi eseguire perf a causa di pacchetti mancanti; potresti ricevere alcuni avvisi sull'impossibilità di accedere agli esempi del modulo del kernel, che comunque non stai cercando.
5. Esegui `perf script > perfs.out` per generare il file di dati che visualizzerai tra un momento. È utile applicare una pulizia per un grafico più leggibile
6. Installa stackvis se non è già installato `npm i -g stackvis`
7. Esegui `stackvis perf < perfs.out > flamegraph.htm`

Ora apri il file del grafico a fiamma nel tuo browser preferito e guardalo bruciare. È codificato a colori in modo da poterti concentrare prima sulle barre arancioni più sature. È probabile che rappresentino funzioni ad alta intensità di CPU.

Vale la pena ricordare: se fai clic su un elemento di un grafico a fiamma, sopra il grafico verrà visualizzato uno zoom dei suoi dintorni.


### Utilizzare `perf` per campionare un processo in esecuzione

Questo è ottimo per registrare dati di flame graph da un processo già in esecuzione che non si vuole interrompere. Immagina un processo di produzione con un problema difficile da riprodurre.

```bash
perf record -F99 -p `pgrep -n node` -- sleep 3
```

A cosa serve quello `sleep 3`? Serve per mantenere `perf` in esecuzione - nonostante l'opzione `-p` punti a un PID diverso, il comando deve essere eseguito su un processo e terminare con esso. `perf` è in esecuzione per tutta la durata del comando che gli si passa, indipendentemente dal fatto che si stia effettivamente profilando quel comando. `sleep 3` assicura che `perf` sia in esecuzione per 3 secondi.

Perché `-F` (frequenza di profilazione) è impostato su 99? È un valore predefinito ragionevole. Puoi regolarlo se vuoi. `-F99` dice a `perf` di prelevare 99 campioni al secondo, per una maggiore precisione aumenta il valore. Valori inferiori dovrebbero produrre meno output con risultati meno precisi. La precisione di cui hai bisogno dipende da quanto tempo sono effettivamente in esecuzione le tue funzioni ad alta intensità di CPU. Se stai cercando la ragione di un rallentamento notevole, 99 frame al secondo dovrebbero essere più che sufficienti.

Dopo aver ottenuto quella registrazione `perf` di 3 secondi, procedi con la generazione del flame graph con gli ultimi due passaggi di sopra.

### Filtrare le funzioni interne di Node.js

Di solito, vuoi solo guardare le prestazioni delle tue chiamate, quindi filtrare le funzioni interne di Node.js e V8 può rendere il grafico molto più facile da leggere. Puoi pulire il tuo file `perf` con:

```bash
sed -i -r \
    -e '/(_libc_start|LazyCompile) |v8::internal::BuiltIn|Stub|LoadIC:\\[\\[' \
    -e '/^$/d' \
    perf.data > perf.out
```

Se leggi il tuo flame graph e ti sembra strano, come se mancasse qualcosa nella funzione chiave che occupa la maggior parte del tempo, prova a generare il tuo flame graph senza i filtri - forse hai un raro caso di un problema con Node.js stesso.

### Opzioni di profilazione di Node.js

`--perf-basic-prof-only-functions` e `--perf-basic-prof` sono le due che sono utili per il debug del tuo codice JavaScript. Altre opzioni vengono utilizzate per la profilazione di Node.js stesso, il che esula dallo scopo di questa guida.

`--perf-basic-prof-only-functions` produce meno output, quindi è l'opzione con il minor overhead.


### Perché ne ho bisogno?

Bene, senza queste opzioni, otterrai comunque un flame graph, ma con la maggior parte delle barre etichettate come `v8::Function::Call`.

## Problemi con l'output di `Perf`

### Modifiche alla pipeline V8 in Node.js 8.x

Node.js 8.x e versioni successive vengono forniti con nuove ottimizzazioni alla pipeline di compilazione JavaScript nel motore V8 che a volte rende irraggiungibili i nomi/riferimenti delle funzioni per perf. (Si chiama Turbofan)

Il risultato è che potresti non ottenere i nomi delle tue funzioni correttamente nel flame graph.

Noterai `ByteCodeHandler:` dove ti aspetteresti i nomi delle funzioni.

0x ha alcune mitigazioni integrate per questo.

Per i dettagli, vedere:
- <https://github.com/nodejs/benchmarking/issues/168>
- <https://github.com/nodejs/diagnostics/issues/148#issuecomment-369348961>

### Node.js 10+

Node.js 10.x risolve il problema con Turbofan usando il flag `--interpreted-frames-native-stack`.

Esegui `node --interpreted-frames-native-stack --perf-basic-prof-only-functions` per ottenere i nomi delle funzioni nel flame graph indipendentemente da quale pipeline V8 ha utilizzato per compilare il tuo JavaScript.

### Etichette danneggiate nel flame graph

Se vedi etichette simili a questa

```bash
node`_ZN2v88internal11interpreter17BytecodeGenerator15VisitStatementsEPMS0_8Zone
```

significa che il Linux perf che stai usando non è stato compilato con il supporto demangle, vedi <https://bugs.launchpad.net/ubuntu/+source/linux/+bug/1396654> per esempio

## Esempi

Esercitati a catturare flame graph da solo con un [esercizio di flame graph](https://github.com/naugtur/node-example-flamegraph)!

