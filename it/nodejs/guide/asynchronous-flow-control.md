---
title: Controllo del flusso asincrono in JavaScript
description: Comprendere il controllo del flusso asincrono in JavaScript, inclusi callback, gestione dello stato e modelli di flusso di controllo.
head:
  - - meta
    - name: og:title
      content: Controllo del flusso asincrono in JavaScript | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Comprendere il controllo del flusso asincrono in JavaScript, inclusi callback, gestione dello stato e modelli di flusso di controllo.
  - - meta
    - name: twitter:title
      content: Controllo del flusso asincrono in JavaScript | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Comprendere il controllo del flusso asincrono in JavaScript, inclusi callback, gestione dello stato e modelli di flusso di controllo.
---


# Controllo del flusso asincrono

::: info
Il materiale in questo post è fortemente ispirato a [Mixu's Node.js Book](http://book.mixu.net/node/ch7.html).
:::

Nel suo nucleo, JavaScript è progettato per essere non bloccante sul thread "principale", dove vengono renderizzate le viste. Puoi immaginare l'importanza di questo nel browser. Quando il thread principale viene bloccato, si verifica il famigerato "congelamento" che gli utenti finali temono e nessun altro evento può essere inviato, con conseguente perdita di acquisizione dati, ad esempio.

Questo crea alcuni vincoli unici che solo uno stile di programmazione funzionale può curare. È qui che entrano in gioco le callback.

Tuttavia, le callback possono diventare difficili da gestire in procedure più complicate. Ciò spesso si traduce nel "callback hell" dove più funzioni nidificate con callback rendono il codice più difficile da leggere, debuggare, organizzare, ecc.

```js
async1(function (input, result1) {
  async2(function (result2) {
    async3(function (result3) {
      async4(function (result4) {
        async5(function (output) {
          // do something with output
        });
      });
    });
  });
});
```

Naturalmente, nella vita reale ci sarebbero molto probabilmente righe di codice aggiuntive per gestire `result1`, `result2`, ecc., quindi, la lunghezza e la complessità di questo problema di solito si traducono in codice che appare molto più disordinato dell'esempio sopra.

**È qui che le funzioni diventano di grande utilità. Operazioni più complesse sono costituite da molte funzioni:**

1. stile/input di avvio
2. middleware
3. terminatore

**Lo "stile/input di avvio" è la prima funzione nella sequenza. Questa funzione accetterà l'input originale, se presente, per l'operazione. L'operazione è una serie eseguibile di funzioni e l'input originale sarà principalmente:**

1. variabili in un ambiente globale
2. invocazione diretta con o senza argomenti
3. valori ottenuti da richieste di file system o di rete

Le richieste di rete possono essere richieste in entrata avviate da una rete esterna, da un'altra applicazione sulla stessa rete o dall'app stessa sulla stessa rete o su una rete esterna.

Una funzione middleware restituirà un'altra funzione e una funzione terminatore invocherà la callback. Quanto segue illustra il flusso alle richieste di rete o di file system. Qui la latenza è 0 perché tutti questi valori sono disponibili in memoria.

```js
function final(someInput, callback) {
  callback(`${someInput} e terminato eseguendo la callback `);
}
function middleware(someInput, callback) {
  return final(`${someInput} toccato dal middleware `, callback);
}
function initiate() {
  const someInput = 'ciao questa è una funzione ';
  middleware(someInput, function (result) {
    console.log(result);
    // richiede la callback per `restituire` il risultato
  });
}
initiate();
```


## Gestione dello stato

Le funzioni possono essere o meno dipendenti dallo stato. La dipendenza dallo stato si verifica quando l'input o un'altra variabile di una funzione si basa su una funzione esterna.

**In questo modo, esistono due strategie principali per la gestione dello stato:**

1. passare le variabili direttamente a una funzione e
2. acquisire un valore di variabile da una cache, sessione, file, database, rete o altra fonte esterna.

Nota, non ho menzionato le variabili globali. La gestione dello stato con variabili globali è spesso un anti-pattern trascurato che rende difficile o impossibile garantire lo stato. Le variabili globali in programmi complessi dovrebbero essere evitate quando possibile.

## Flusso di controllo

Se un oggetto è disponibile in memoria, l'iterazione è possibile e non ci sarà alcuna modifica al flusso di controllo:

```js
function getSong() {
  let _song = '';
  let i = 100;
  for (i; i > 0; i -= 1) {
    _song += `${i} birre sul muro, ne prendi una e la passi in giro, ${
      i - 1
    } bottiglie di birra sul muro\n`;
    if (i === 1) {
      _song += "Ehi, prendiamoci un'altra birra";
    }
  }
  return _song;
}
function singSong(_song) {
  if (!_song) throw new Error("song is '' empty, FEED ME A SONG!");
  console.log(_song);
}
const song = getSong();
// questo funzionerà
singSong(song);
```

Tuttavia, se i dati esistono al di fuori della memoria, l'iterazione non funzionerà più:

```js
function getSong() {
  let _song = '';
  let i = 100;
  for (i; i > 0; i -= 1) {
    /* eslint-disable no-loop-func */
    setTimeout(function () {
      _song += `${i} birre sul muro, ne prendi una e la passi in giro, ${
        i - 1
      } bottiglie di birra sul muro\n`;
      if (i === 1) {
        _song += "Ehi, prendiamoci un'altra birra";
      }
    }, 0);
    /* eslint-enable no-loop-func */
  }
  return _song;
}
function singSong(_song) {
  if (!_song) throw new Error("song is '' empty, FEED ME A SONG!");
  console.log(_song);
}
const song = getSong('beer');
// questo non funzionerà
singSong(song);
// Uncaught Error: song is '' empty, FEED ME A SONG!
```

Perché è successo? `setTimeout` indica alla CPU di memorizzare le istruzioni altrove sul bus e indica che i dati sono programmati per essere prelevati in un secondo momento. Migliaia di cicli di CPU passano prima che la funzione torni al segno di 0 millisecondi, la CPU preleva le istruzioni dal bus e le esegue. L'unico problema è che song ('') è stato restituito migliaia di cicli prima.

La stessa situazione si verifica quando si ha a che fare con file system e richieste di rete. Il thread principale semplicemente non può essere bloccato per un periodo di tempo indeterminato: pertanto, utilizziamo i callback per programmare l'esecuzione del codice nel tempo in modo controllato.

Sarai in grado di eseguire quasi tutte le tue operazioni con i seguenti 3 modelli:

1. **In serie:** le funzioni verranno eseguite in un ordine sequenziale rigoroso, questo è il più simile ai cicli `for`.

```js
// operazioni definite altrove e pronte per l'esecuzione
const operations = [
  { func: function1, args: args1 },
  { func: function2, args: args2 },
  { func: function3, args: args3 },
];
function executeFunctionWithArgs(operation, callback) {
  // esegue la funzione
  const { args, func } = operation;
  func(args, callback);
}
function serialProcedure(operation) {
  if (!operation) process.exit(0); // terminato
  executeFunctionWithArgs(operation, function (result) {
    // continua DOPO il callback
    serialProcedure(operations.shift());
  });
}
serialProcedure(operations.shift());
```

2. `Parallelismo completo`: quando l'ordinamento non è un problema, come l'invio di e-mail a un elenco di 1.000.000 di destinatari di e-mail.

```js
let count = 0;
let success = 0;
const failed = [];
const recipients = [
  { name: 'Bart', email: 'bart@tld' },
  { name: 'Marge', email: 'marge@tld' },
  { name: 'Homer', email: 'homer@tld' },
  { name: 'Lisa', email: 'lisa@tld' },
  { name: 'Maggie', email: 'maggie@tld' },
];
function dispatch(recipient, callback) {
  // `sendEmail` è un ipotetico client SMTP
  sendMail(
    {
      subject: 'Cena stasera',
      message: 'Abbiamo molta verza nel piatto. Vieni?',
      smtp: recipient.email,
    },
    callback
  );
}
function final(result) {
  console.log(`Risultato: ${result.count} tentativi \
      & ${result.success} email riuscite`);
  if (result.failed.length)
    console.log(`Impossibile inviare a: \
        \n${result.failed.join('\n')}\n`);
}
recipients.forEach(function (recipient) {
  dispatch(recipient, function (err) {
    if (!err) {
      success += 1;
    } else {
      failed.push(recipient.name);
    }
    count += 1;
    if (count === recipients.length) {
      final({
        count,
        success,
        failed,
      });
    }
  });
});
```

3. **Parallelismo limitato**: parallelismo con limite, come l'invio con successo di e-mail a 1.000.000 di destinatari da un elenco di 10 milioni di utenti.

```js
let successCount = 0;
function final() {
  console.log(`inviate ${successCount} email`);
  console.log('finito');
}
function dispatch(recipient, callback) {
  // `sendEmail` è un ipotetico client SMTP
  sendMail(
    {
      subject: 'Cena stasera',
      message: 'Abbiamo molta verza nel piatto. Vieni?',
      smtp: recipient.email,
    },
    callback
  );
}
function sendOneMillionEmailsOnly() {
  getListOfTenMillionGreatEmails(function (err, bigList) {
    if (err) throw err;
    function serial(recipient) {
      if (!recipient || successCount >= 1000000) return final();
      dispatch(recipient, function (_err) {
        if (!_err) successCount += 1;
        serial(bigList.pop());
      });
    }
    serial(bigList.pop());
  });
}
sendOneMillionEmailsOnly();
```

Ognuno ha i suoi casi d'uso, vantaggi e problemi che puoi sperimentare e leggere in modo più dettagliato. Soprattutto, ricorda di modularizzare le tue operazioni e di usare i callback! Se hai qualche dubbio, tratta tutto come se fosse middleware!

