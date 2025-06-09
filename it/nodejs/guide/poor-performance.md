---
title: Ottimizzazione delle prestazioni Node.js
description: Scopri come analizzare un processo Node.js per identificare i colli di bottiglia delle prestazioni e ottimizzare il codice per una migliore efficienza e esperienza utente.
head:
  - - meta
    - name: og:title
      content: Ottimizzazione delle prestazioni Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Scopri come analizzare un processo Node.js per identificare i colli di bottiglia delle prestazioni e ottimizzare il codice per una migliore efficienza e esperienza utente.
  - - meta
    - name: twitter:title
      content: Ottimizzazione delle prestazioni Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Scopri come analizzare un processo Node.js per identificare i colli di bottiglia delle prestazioni e ottimizzare il codice per una migliore efficienza e esperienza utente.
---


# Performance Scarse
In questo documento puoi imparare come profilare un processo Node.js.

## La mia applicazione ha performance scarse

### Sintomi

La latenza della mia applicazione è alta e ho già confermato che il collo di bottiglia non sono le mie dipendenze come database e servizi downstream. Quindi sospetto che la mia applicazione spenda molto tempo per eseguire codice o elaborare informazioni.

Sei soddisfatto delle prestazioni generali della tua applicazione, ma vorresti capire quale parte della nostra applicazione può essere migliorata per funzionare più velocemente o in modo più efficiente. Può essere utile quando vogliamo migliorare l'esperienza utente o risparmiare sui costi di calcolo.

### Debug
In questo caso d'uso, siamo interessati ai frammenti di codice che utilizzano più cicli di CPU rispetto agli altri. Quando lo facciamo localmente, di solito cerchiamo di ottimizzare il nostro codice. [L'utilizzo del V8 Sampling Profiler](/it/nodejs/guide/profiling-nodejs-applications) può aiutarci a farlo.

