---
title: La differenza tra sviluppo e produzione in Node.js
description: Comprendere il ruolo di NODE_ENV in Node.js e il suo impatto sugli ambienti di sviluppo e produzione.
head:
  - - meta
    - name: og:title
      content: La differenza tra sviluppo e produzione in Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Comprendere il ruolo di NODE_ENV in Node.js e il suo impatto sugli ambienti di sviluppo e produzione.
  - - meta
    - name: twitter:title
      content: La differenza tra sviluppo e produzione in Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Comprendere il ruolo di NODE_ENV in Node.js e il suo impatto sugli ambienti di sviluppo e produzione.
---


# Node.js, la differenza tra sviluppo e produzione

`Non c'è differenza tra sviluppo e produzione in Node.js`, ovvero, non ci sono impostazioni specifiche che devi applicare per far funzionare Node.js in una configurazione di produzione. Tuttavia, alcune librerie nel registro npm riconoscono l'utilizzo della variabile `NODE_ENV` e la impostano di default su `development`. Esegui sempre il tuo Node.js con `NODE_ENV=production` impostato.

Un modo popolare per configurare la tua applicazione è utilizzare la [metodologia dei dodici fattori](https://12factor.net).

## NODE_ENV in Express

Nel popolarissimo framework [express](https://expressjs.com), impostare NODE_ENV su production generalmente garantisce che:

+ la registrazione (logging) sia mantenuta al livello minimo ed essenziale
+ vengano eseguiti più livelli di caching per ottimizzare le prestazioni

Questo di solito viene fatto eseguendo il comando

```bash
export NODE_ENV=production
```

nella shell, ma è meglio metterlo nel file di configurazione della shell (ad es. `.bash_profile` con la shell Bash) perché altrimenti l'impostazione non persiste in caso di riavvio del sistema.

Puoi anche applicare la variabile d'ambiente anteponendola al comando di inizializzazione dell'applicazione:

```bash
NODE_ENV=production node app.js
```

Ad esempio, in un'app Express, puoi usarlo per impostare diversi gestori di errori per ambiente:

```javascript
if (process.env.NODE_ENV === 'development') {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
}
if (process.env.NODE_ENV === 'production') {
  app.use(express.errorHandler());
}
```

Ad esempio [Pug](https://pugjs.org), la libreria di templating utilizzata da [Express.js](https://expressjs.com), compila in modalità debug se `NODE_ENV` non è impostato su `production`. Le viste Express vengono compilate in ogni richiesta in modalità di sviluppo, mentre in produzione vengono memorizzate nella cache. Ci sono molti altri esempi.

`Questa variabile d'ambiente è una convenzione ampiamente utilizzata nelle librerie esterne, ma non all'interno di Node.js stesso.`

## Perché NODE_ENV è considerato un antipattern?

Un ambiente è una piattaforma digitale o un sistema in cui gli ingegneri possono costruire, testare, distribuire e gestire prodotti software. Convenzionalmente, ci sono quattro fasi o tipi di ambienti in cui viene eseguita la nostra applicazione:

+ Sviluppo
+ Staging
+ Produzione
+ Test

Il problema fondamentale di `NODE_ENV` deriva dal fatto che gli sviluppatori combinano ottimizzazioni e comportamento del software con l'ambiente in cui il loro software è in esecuzione. Il risultato è codice come il seguente:

```javascript
if (process.env.NODE_ENV === 'development') {
  // ...
}
if (process.env.NODE_ENV === 'staging') {
  // ...
}
if (process.env.NODE_ENV === 'production') {
  // ...
}
if (process.env.NODE_ENV === 'testing') {
  // ...
}
```

Sebbene possa sembrare innocuo, rende gli ambienti di produzione e staging diversi, rendendo quindi impossibile un test affidabile. Ad esempio, un test e quindi una funzionalità del tuo prodotto potrebbero passare quando `NODE_ENV` è impostato su `development` ma fallire quando si imposta `NODE_ENV` su `production`. Pertanto, impostare `NODE_ENV` su qualcosa di diverso da `production` è considerato un antipattern.

