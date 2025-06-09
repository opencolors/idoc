---
title: Differenze tra Node.js e il browser
description: Scopri le principali differenze tra la creazione di applicazioni con Node.js e il browser, tra cui l'ecosistema, il controllo dell'ambiente e i sistemi di moduli.
head:
  - - meta
    - name: og:title
      content: Differenze tra Node.js e il browser | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Scopri le principali differenze tra la creazione di applicazioni con Node.js e il browser, tra cui l'ecosistema, il controllo dell'ambiente e i sistemi di moduli.
  - - meta
    - name: twitter:title
      content: Differenze tra Node.js e il browser | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Scopri le principali differenze tra la creazione di applicazioni con Node.js e il browser, tra cui l'ecosistema, il controllo dell'ambiente e i sistemi di moduli.
---


# Differenze tra Node.js e il Browser

Sia il browser che Node.js utilizzano JavaScript come linguaggio di programmazione. Costruire app che vengono eseguite nel browser è completamente diverso dal costruire un'applicazione Node.js. Nonostante sia sempre JavaScript, ci sono alcune differenze chiave che rendono l'esperienza radicalmente diversa.

Dal punto di vista di uno sviluppatore frontend che utilizza ampiamente JavaScript, le app Node.js portano con sé un enorme vantaggio: la comodità di programmare tutto - il frontend e il backend - in un singolo linguaggio.

Hai una grande opportunità perché sappiamo quanto sia difficile imparare completamente e profondamente un linguaggio di programmazione e, utilizzando lo stesso linguaggio per svolgere tutto il tuo lavoro sul web - sia sul client che sul server, ti trovi in una posizione di vantaggio unica.

::: tip
Ciò che cambia è l'ecosistema.
:::

Nel browser, la maggior parte delle volte quello che fai è interagire con il DOM o altre API della piattaforma Web come i Cookie. Questi non esistono in Node.js, ovviamente. Non hai il `document`, `window` e tutti gli altri oggetti forniti dal browser.

E nel browser, non abbiamo tutte le belle API che Node.js fornisce attraverso i suoi moduli, come la funzionalità di accesso al filesystem.

Un'altra grande differenza è che in Node.js hai il controllo dell'ambiente. A meno che tu non stia costruendo un'applicazione open source che chiunque può distribuire ovunque, sai su quale versione di Node.js eseguirai l'applicazione. Rispetto all'ambiente del browser, dove non hai il lusso di scegliere quale browser utilizzeranno i tuoi visitatori, questo è molto conveniente.

Ciò significa che puoi scrivere tutto il JavaScript moderno ES2015+ supportato dalla tua versione di Node.js. Poiché JavaScript si muove così velocemente, ma i browser possono essere un po' lenti ad aggiornarsi, a volte sul web sei bloccato con l'utilizzo di versioni JavaScript/ECMAScript precedenti. Puoi usare Babel per trasformare il tuo codice in modo che sia compatibile con ES5 prima di spedirlo al browser, ma in Node.js non ne avrai bisogno.

Un'altra differenza è che Node.js supporta sia i sistemi di moduli CommonJS che ES (da Node.js v12), mentre nel browser stiamo iniziando a vedere l'implementazione dello standard ES Modules.

In pratica, questo significa che puoi usare sia `require()` che `import` in Node.js, mentre sei limitato a `import` nel browser.

