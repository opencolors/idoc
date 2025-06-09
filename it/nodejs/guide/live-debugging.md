---
title: Debugging in diretta in Node.js
description: Scopri come eseguire il debug in diretta di un processo Node.js per identificare e risolvere problemi con la logica e la correttezza dell'applicazione.
head:
  - - meta
    - name: og:title
      content: Debugging in diretta in Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Scopri come eseguire il debug in diretta di un processo Node.js per identificare e risolvere problemi con la logica e la correttezza dell'applicazione.
  - - meta
    - name: twitter:title
      content: Debugging in diretta in Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Scopri come eseguire il debug in diretta di un processo Node.js per identificare e risolvere problemi con la logica e la correttezza dell'applicazione.
---


# Debugging in tempo reale

In questo documento puoi imparare come eseguire il debug in tempo reale di un processo Node.js.

## La mia applicazione non si comporta come previsto

### Sintomi

L'utente potrebbe osservare che l'applicazione non fornisce l'output previsto per determinati input, ad esempio, un server HTTP restituisce una risposta JSON dove alcuni campi sono vuoti. Diverse cose possono andare storte nel processo, ma in questo caso d'uso, ci concentriamo principalmente sulla logica dell'applicazione e sulla sua correttezza.

### Debugging

In questo caso d'uso, l'utente vorrebbe capire il percorso del codice che la nostra applicazione esegue per un determinato trigger come una richiesta HTTP in entrata. Potrebbe anche voler scorrere il codice e controllare l'esecuzione, nonché ispezionare quali valori le variabili contengono in memoria. A tale scopo, possiamo utilizzare il flag `--inspect` quando si avvia l'applicazione. La documentazione sul debugging è disponibile [qui](/it/nodejs/guide/debugging-nodejs).

