---
title: Risoluzione dei problemi di memoria in Node.js
description: Scopri come identificare e risolvere problemi di memoria relativi alle applicazioni Node.js, comprese le perdite di memoria e l'utilizzo inefficiente della memoria.
head:
  - - meta
    - name: og:title
      content: Risoluzione dei problemi di memoria in Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Scopri come identificare e risolvere problemi di memoria relativi alle applicazioni Node.js, comprese le perdite di memoria e l'utilizzo inefficiente della memoria.
  - - meta
    - name: twitter:title
      content: Risoluzione dei problemi di memoria in Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Scopri come identificare e risolvere problemi di memoria relativi alle applicazioni Node.js, comprese le perdite di memoria e l'utilizzo inefficiente della memoria.
---


# Memoria

In questo documento puoi imparare come eseguire il debug dei problemi relativi alla memoria.

## Il mio processo esaurisce la memoria

Node.js (*JavaScript*) è un linguaggio con garbage collection, quindi la presenza di memory leak è possibile tramite i retainer. Poiché le applicazioni Node.js sono solitamente multi-tenant, business critical e di lunga durata, fornire un modo accessibile ed efficiente per trovare una memory leak è essenziale.

### Sintomi

L'utente osserva un utilizzo della memoria in continuo aumento (*può essere veloce o lento, nell'arco di giorni o anche settimane*) e poi vede il processo bloccarsi e riavviarsi dal process manager. Il processo potrebbe essere più lento di prima e i riavvii causano il fallimento di alcune richieste (*il load balancer risponde con 502*).

### Effetti collaterali

- Riavvii del processo dovuti all'esaurimento della memoria e le richieste vengono abbandonate
- L'aumento dell'attività di GC porta a un maggiore utilizzo della CPU e a tempi di risposta più lenti
    - GC che blocca l'Event Loop causando lentezza
- L'aumento dello swapping di memoria rallenta il processo (attività di GC)
- Potrebbe non esserci abbastanza memoria disponibile per ottenere un Heap Snapshot

## Il mio processo utilizza la memoria in modo inefficiente

### Sintomi

L'applicazione utilizza una quantità inaspettata di memoria e/o osserviamo un'elevata attività del garbage collector.

### Effetti collaterali

- Un numero elevato di page fault
- Maggiore attività di GC e utilizzo della CPU

