---
title: ECMAScript 2015 (ES6) e oltre in Node.js
description: Node.js supporta le funzionalità ECMAScript moderne attraverso il motore V8, con nuove funzionalità e miglioramenti introdotti in modo tempestivo.
head:
  - - meta
    - name: og:title
      content: ECMAScript 2015 (ES6) e oltre in Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js supporta le funzionalità ECMAScript moderne attraverso il motore V8, con nuove funzionalità e miglioramenti introdotti in modo tempestivo.
  - - meta
    - name: twitter:title
      content: ECMAScript 2015 (ES6) e oltre in Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js supporta le funzionalità ECMAScript moderne attraverso il motore V8, con nuove funzionalità e miglioramenti introdotti in modo tempestivo.
---


# ECMAScript 2015 (ES6) e successivi

Node.js è costruito sulle versioni moderne di [V8](https://v8.dev/). Mantenendoci aggiornati con le ultime versioni di questo motore, assicuriamo che le nuove funzionalità della [specifica JavaScript ECMA-262](https://tc39.es/ecma262/) siano fornite agli sviluppatori Node.js in modo tempestivo, nonché continui miglioramenti in termini di prestazioni e stabilità.

Tutte le funzionalità ECMAScript 2015 (ES6) sono suddivise in tre gruppi per funzionalità `shipping`, `staged` e `in progress`:

+ Tutte le funzionalità `shipping`, che V8 considera stabili, sono attivate `on by default on Node.js` e `NON` richiedono alcun tipo di flag di runtime.
+ Le funzionalità `Staged`, che sono funzionalità quasi completate che non sono considerate stabili dal team V8, richiedono un flag di runtime: `--harmony`.
+ Le funzionalità `In progress` possono essere attivate individualmente tramite il rispettivo flag harmony, sebbene ciò sia fortemente sconsigliato a meno che non sia a scopo di test. Nota: questi flag sono esposti da V8 e potenzialmente cambieranno senza alcun avviso di deprecazione.

## Quali funzionalità vengono fornite con quale versione di Node.js per impostazione predefinita?

Il sito web [node.green](https://node.green) fornisce un'eccellente panoramica delle funzionalità ECMAScript supportate in varie versioni di Node.js, basata sulla tabella di compatibilità di kangax.

## Quali funzionalità sono in corso?

Nuove funzionalità vengono costantemente aggiunte al motore V8. In generale, aspettati che arrivino in una futura release di Node.js, anche se i tempi sono sconosciuti.

Puoi elencare tutte le funzionalità in corso disponibili su ogni release di Node.js eseguendo un grep sull'argomento `--v8-options`. Tieni presente che queste sono funzionalità incomplete e possibilmente danneggiate di V8, quindi usale a tuo rischio:

```sh
node --v8-options | grep "in progress"
```

## Ho la mia infrastruttura impostata per sfruttare il flag --harmony. Dovrei rimuoverlo?

Il comportamento attuale del flag `--harmony` su Node.js è quello di abilitare solo le funzionalità `staged`. Dopotutto, ora è un sinonimo di `--es_staging`. Come accennato in precedenza, queste sono funzionalità completate che non sono state ancora considerate stabili. Se vuoi andare sul sicuro, soprattutto in ambienti di produzione, valuta la possibilità di rimuovere questo flag di runtime finché non viene fornito per impostazione predefinita su V8 e, di conseguenza, su Node.js. Se lo mantieni abilitato, dovresti essere preparato per ulteriori aggiornamenti di Node.js che potrebbero interrompere il tuo codice se V8 cambia la sua semantica per seguire più da vicino lo standard.


## Come faccio a trovare quale versione di V8 è inclusa in una particolare versione di Node.js?

Node.js fornisce un modo semplice per elencare tutte le dipendenze e le rispettive versioni incluse in uno specifico binario tramite l'oggetto globale `process`. Nel caso del motore V8, digita quanto segue nel tuo terminale per recuperare la sua versione:

```sh
node -p process.versions.v8
```

