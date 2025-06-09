---
title: Stabilità ABI in Node.js e N-API
description: Node.js fornisce una ABI stabile per i moduli nativi attraverso N-API, garantendo la compatibilità tra più versioni principali e riducendo gli oneri di manutenzione dei sistemi di produzione.
head:
  - - meta
    - name: og:title
      content: Stabilità ABI in Node.js e N-API | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js fornisce una ABI stabile per i moduli nativi attraverso N-API, garantendo la compatibilità tra più versioni principali e riducendo gli oneri di manutenzione dei sistemi di produzione.
  - - meta
    - name: twitter:title
      content: Stabilità ABI in Node.js e N-API | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js fornisce una ABI stabile per i moduli nativi attraverso N-API, garantendo la compatibilità tra più versioni principali e riducendo gli oneri di manutenzione dei sistemi di produzione.
---


# Stabilità ABI

## Introduzione

Un'interfaccia binaria dell'applicazione (ABI) è un modo per i programmi di chiamare funzioni e utilizzare strutture di dati da altri programmi compilati. È la versione compilata di un'interfaccia di programmazione dell'applicazione (API). In altre parole, i file di intestazione che descrivono le classi, le funzioni, le strutture di dati, le enumerazioni e le costanti che consentono a un'applicazione di eseguire un'attività desiderata corrispondono, tramite compilazione, a un insieme di indirizzi e valori di parametri previsti, nonché a dimensioni e layout della struttura di memoria con cui è stato compilato il fornitore dell'ABI.

L'applicazione che utilizza l'ABI deve essere compilata in modo tale che gli indirizzi disponibili, i valori dei parametri previsti e le dimensioni e i layout della struttura di memoria concordino con quelli con cui è stato compilato il fornitore dell'ABI. Questo viene solitamente realizzato compilando rispetto alle intestazioni fornite dal fornitore dell'ABI.

Poiché il fornitore dell'ABI e l'utente dell'ABI possono essere compilati in momenti diversi con versioni diverse del compilatore, una parte della responsabilità di garantire la compatibilità dell'ABI spetta al compilatore. Diverse versioni del compilatore, magari fornite da diversi fornitori, devono tutte produrre la stessa ABI da un file di intestazione con un certo contenuto e devono produrre codice per l'applicazione che utilizza l'ABI che accede all'API descritta in una data intestazione secondo le convenzioni dell'ABI risultante dalla descrizione nell'intestazione. I compilatori moderni hanno un track record abbastanza buono nel non interrompere la compatibilità ABI delle applicazioni che compilano.

La restante responsabilità di garantire la compatibilità dell'ABI spetta al team che mantiene i file di intestazione che forniscono l'API che si traduce, dopo la compilazione, nell'ABI che deve rimanere stabile. È possibile apportare modifiche ai file di intestazione, ma la natura delle modifiche deve essere monitorata attentamente per garantire che, dopo la compilazione, l'ABI non cambi in un modo che renda gli utenti esistenti dell'ABI incompatibili con la nuova versione.


## Stabilità ABI in Node.js

Node.js fornisce file di intestazione gestiti da diversi team indipendenti. Ad esempio, i file di intestazione come `node.h` e `node_buffer.h` sono gestiti dal team Node.js. `v8.h` è gestito dal team V8 che, sebbene in stretta collaborazione con il team Node.js, è indipendente e con i propri tempi e priorità. Pertanto, il team Node.js ha solo un controllo parziale sulle modifiche introdotte nelle intestazioni fornite dal progetto. Di conseguenza, il progetto Node.js ha adottato il [versioning semantico](https://semver.org). Ciò garantisce che le API fornite dal progetto si tradurranno in una ABI stabile per tutte le versioni minor e patch di Node.js rilasciate all'interno di una versione major. In pratica, questo significa che il progetto Node.js si è impegnato a garantire che un addon nativo di Node.js compilato per una determinata versione major di Node.js si carichi correttamente quando caricato da qualsiasi versione minor o patch di Node.js all'interno della versione major rispetto alla quale è stato compilato.

## N-API

È sorta la richiesta di dotare Node.js di un'API che si traduca in una ABI che rimanga stabile tra più versioni major di Node.js. La motivazione per la creazione di tale API è la seguente:

- Il linguaggio JavaScript è rimasto compatibile con se stesso fin dai suoi primi giorni, mentre l'ABI del motore che esegue il codice JavaScript cambia con ogni versione major di Node.js. Ciò significa che le applicazioni costituite da pacchetti Node.js scritti interamente in JavaScript non devono essere ricompilate, reinstallate o ridistribuite quando una nuova versione major di Node.js viene rilasciata nell'ambiente di produzione in cui tali applicazioni vengono eseguite. Al contrario, se un'applicazione dipende da un pacchetto che contiene un addon nativo, l'applicazione deve essere ricompilata, reinstallata e ridistribuita ogni volta che una nuova versione major di Node.js viene introdotta nell'ambiente di produzione. Questa disparità tra i pacchetti Node.js contenenti addon nativi e quelli scritti interamente in JavaScript ha aumentato l'onere di manutenzione dei sistemi di produzione che si basano su addon nativi.

- Altri progetti hanno iniziato a produrre interfacce JavaScript che sono essenzialmente implementazioni alternative di Node.js. Poiché questi progetti sono solitamente costruiti su un motore JavaScript diverso da V8, i loro addon nativi assumono necessariamente una struttura diversa e utilizzano un'API diversa. Tuttavia, l'utilizzo di una singola API per un addon nativo tra diverse implementazioni dell'API JavaScript di Node.js consentirebbe a questi progetti di sfruttare l'ecosistema di pacchetti JavaScript che si è accumulato attorno a Node.js.

- Node.js potrebbe contenere un motore JavaScript diverso in futuro. Ciò significa che, esternamente, tutte le interfacce Node.js rimarrebbero le stesse, ma il file di intestazione V8 sarebbe assente. Un tale passo causerebbe l'interruzione dell'ecosistema Node.js in generale e di quello degli addon nativi in particolare, se un'API agnostica al motore JavaScript non viene prima fornita da Node.js e adottata dagli addon nativi.

A tal fine, Node.js ha introdotto N-API nella versione 8.6.0 e l'ha contrassegnata come componente stabile del progetto a partire da Node.js 8.12.0. L'API è definita nelle intestazioni `node_api.h` e `node_api_types.h` e fornisce una garanzia di compatibilità futura che attraversa il limite della versione major di Node.js. La garanzia può essere enunciata come segue:

**Una data versione n di N-API sarà disponibile nella versione major di Node.js in cui è stata pubblicata e in tutte le versioni successive di Node.js, comprese le successive versioni major.**

Un autore di addon nativi può sfruttare la garanzia di compatibilità futura di N-API assicurandosi che l'addon utilizzi solo le API definite in `node_api.h` e le strutture dati e le costanti definite in `node_api_types.h`. In tal modo, l'autore facilita l'adozione del proprio addon indicando agli utenti di produzione che l'onere di manutenzione per la loro applicazione non aumenterà più con l'aggiunta dell'addon nativo al loro progetto di quanto farebbe con l'aggiunta di un pacchetto scritto puramente in JavaScript.

N-API è versionata perché di tanto in tanto vengono aggiunte nuove API. A differenza del versioning semantico, il versioning di N-API è cumulativo. Vale a dire, ogni versione di N-API trasmette lo stesso significato di una versione minor nel sistema semver, il che significa che tutte le modifiche apportate a N-API saranno retrocompatibili. Inoltre, nuove N-API vengono aggiunte sotto un flag sperimentale per dare alla comunità l'opportunità di esaminarle in un ambiente di produzione. Lo stato sperimentale significa che, sebbene sia stata prestata attenzione per garantire che la nuova API non debba essere modificata in futuro in modo incompatibile con ABI, non è stata ancora sufficientemente provata in produzione per essere corretta e utile come progettata e, come tale, può subire modifiche incompatibili con ABI prima di essere finalmente incorporata in una prossima versione di N-API. Cioè, una N-API sperimentale non è ancora coperta dalla garanzia di compatibilità futura.

