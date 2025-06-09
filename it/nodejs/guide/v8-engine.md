---
title: Il motore JavaScript V8
description: V8 è il motore JavaScript che alimenta Google Chrome, eseguendo il codice JavaScript e fornendo un ambiente di esecuzione. È indipendente dal browser e ha permesso l'emergere di Node.js, alimentando il codice lato server e le applicazioni desktop.
head:
  - - meta
    - name: og:title
      content: Il motore JavaScript V8 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: V8 è il motore JavaScript che alimenta Google Chrome, eseguendo il codice JavaScript e fornendo un ambiente di esecuzione. È indipendente dal browser e ha permesso l'emergere di Node.js, alimentando il codice lato server e le applicazioni desktop.
  - - meta
    - name: twitter:title
      content: Il motore JavaScript V8 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: V8 è il motore JavaScript che alimenta Google Chrome, eseguendo il codice JavaScript e fornendo un ambiente di esecuzione. È indipendente dal browser e ha permesso l'emergere di Node.js, alimentando il codice lato server e le applicazioni desktop.
---


# Il Motore JavaScript V8

V8 è il nome del motore JavaScript che alimenta Google Chrome. È ciò che prende il nostro JavaScript e lo esegue mentre navighiamo con Chrome.

V8 è il motore JavaScript, cioè analizza ed esegue il codice JavaScript. Il DOM e le altre API della piattaforma Web (tutti costituiscono l'ambiente di runtime) sono forniti dal browser.

La cosa interessante è che il motore JavaScript è indipendente dal browser in cui è ospitato. Questa caratteristica fondamentale ha permesso l'ascesa di Node.js. V8 è stato scelto per essere il motore che alimentava Node.js nel 2009 e, con l'esplosione della popolarità di Node.js, V8 è diventato il motore che ora alimenta un'incredibile quantità di codice lato server scritto in JavaScript.

L'ecosistema Node.js è enorme e grazie a V8 alimenta anche le app desktop, con progetti come Electron.

## Altri motori JS

Altri browser hanno il proprio motore JavaScript:

+ `SpiderMonkey` (Firefox)
+ `JavaScriptCore` (chiamato anche `Nitro`) (Safari)
+ Edge era originariamente basato su `Chakra` ma più recentemente è stato ricostruito utilizzando Chromium e il motore V8.

e ne esistono molti altri.

Tutti questi motori implementano lo [standard ECMA ES-262](https://www.ecma-international.org/publications-and-standards/standards/ecma-262/), chiamato anche ECMAScript, lo standard utilizzato da JavaScript.

## La ricerca delle prestazioni

V8 è scritto in C++ ed è continuamente migliorato. È portabile e funziona su Mac, Windows, Linux e molti altri sistemi.

In questa introduzione a V8, ignoreremo i dettagli di implementazione di V8: possono essere trovati su siti più autorevoli (ad es. il [sito ufficiale di V8](https://v8.dev/)) e cambiano nel tempo, spesso radicalmente.

V8 è in continua evoluzione, proprio come gli altri motori JavaScript in circolazione, per velocizzare il Web e l'ecosistema Node.js.

Sul Web, c'è una corsa alle prestazioni che va avanti da anni e noi (come utenti e sviluppatori) beneficiamo molto di questa competizione perché otteniamo macchine più veloci e ottimizzate anno dopo anno.


## Compilazione

JavaScript è generalmente considerato un linguaggio interpretato, ma i moderni motori JavaScript non si limitano più a interpretare JavaScript, lo compilano.

Questo accade dal 2009, quando il compilatore JavaScript SpiderMonkey è stato aggiunto a Firefox 3.5, e tutti hanno seguito questa idea.

JavaScript viene internamente compilato da V8 con la compilazione just-in-time (JIT) per velocizzare l'esecuzione.

Questo potrebbe sembrare controintuitivo, ma dall'introduzione di Google Maps nel 2004, JavaScript si è evoluto da un linguaggio che generalmente eseguiva poche decine di righe di codice a applicazioni complete con migliaia o centinaia di migliaia di righe in esecuzione nel browser.

Le nostre applicazioni ora possono essere eseguite per ore all'interno di un browser, invece di essere solo poche regole di convalida dei moduli o semplici script.

In questo nuovo mondo, compilare JavaScript ha perfettamente senso perché, anche se potrebbe richiedere un po' più di tempo per preparare JavaScript, una volta fatto sarà molto più performante del codice puramente interpretato.

