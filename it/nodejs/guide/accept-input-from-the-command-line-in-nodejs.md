---
title: Ottenere input utente in Node.js
description: Scopri come creare programmi CLI interattivi Node.js utilizzando il modulo readline e il pacchetto Inquirer.js.
head:
  - - meta
    - name: og:title
      content: Ottenere input utente in Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Scopri come creare programmi CLI interattivi Node.js utilizzando il modulo readline e il pacchetto Inquirer.js.
  - - meta
    - name: twitter:title
      content: Ottenere input utente in Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Scopri come creare programmi CLI interattivi Node.js utilizzando il modulo readline e il pacchetto Inquirer.js.
---


# Accettare input dalla riga di comando in Node.js

Come rendere interattivo un programma CLI Node.js?

Node.js dalla versione 7 mette a disposizione il modulo readline per fare esattamente questo: ottenere input da uno stream leggibile come lo stream `process.stdin`, che durante l'esecuzione di un programma Node.js è l'input del terminale, una riga alla volta.

```javascript
const readline = require('node:readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.question("Qual è il tuo nome?", name => {
    console.log('Ciao ' + name + '!');
    rl.close();
});
```

Questo frammento di codice chiede il nome dell'utente e, una volta che il testo è stato inserito e l'utente preme invio, inviamo un saluto.

Il metodo `question()` mostra il primo parametro (una domanda) e attende l'input dell'utente. Chiama la funzione di callback una volta premuto invio.

In questa funzione di callback, chiudiamo l'interfaccia readline.

`readline` offre molti altri metodi, si prega di controllarli sulla documentazione del pacchetto collegata sopra.

Se è necessario richiedere una password, è meglio non ripeterla, ma invece mostrare un simbolo *.

Il modo più semplice è usare il pacchetto readline-sync che è molto simile in termini di API e gestisce questo immediatamente. Una soluzione più completa e astratta è fornita dal pacchetto Inquirer.js.

È possibile installarlo usando `npm install inquirer` e quindi è possibile replicare il codice di cui sopra in questo modo:

```javascript
const inquirer = require('inquirer');
const questions = [
    {
        type: 'input',
        name: 'name',
        message: "qual è il tuo nome?"
    }
];
inquirer.prompt(questions).then(answers => {
    console.log('Ciao ' + answers.name + '!');
});
```

`Inquirer.js` ti consente di fare molte cose come chiedere scelte multiple, avere pulsanti radio, conferme e altro ancora.

Vale la pena conoscere tutte le alternative, soprattutto quelle integrate fornite da Node.js, ma se hai intenzione di portare l'input CLI al livello successivo, `Inquirer.js` è una scelta ottimale.

