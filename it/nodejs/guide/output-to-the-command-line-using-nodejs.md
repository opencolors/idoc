---
title: Output sulla riga di comando con Node.js
description: Node.js fornisce un modulo console con vari metodi per interagire con la riga di comando, tra cui registrazione, conteggio, temporizzazione, ecc.
head:
  - - meta
    - name: og:title
      content: Output sulla riga di comando con Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js fornisce un modulo console con vari metodi per interagire con la riga di comando, tra cui registrazione, conteggio, temporizzazione, ecc.
  - - meta
    - name: twitter:title
      content: Output sulla riga di comando con Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js fornisce un modulo console con vari metodi per interagire con la riga di comando, tra cui registrazione, conteggio, temporizzazione, ecc.
---


# Output alla riga di comando usando Node.js

Output di base usando il modulo console
Node.js fornisce un modulo console che offre tantissimi modi utili per interagire con la riga di comando. È fondamentalmente lo stesso oggetto console che si trova nel browser.

Il metodo più basilare e utilizzato è `console.log()`, che stampa sulla console la stringa che gli si passa. Se si passa un oggetto, lo renderizzerà come una stringa.

Si possono passare più variabili a `console.log`, per esempio:
```javascript
const x = 'x';
const y = 'y';
console.log(x, y);
```

Possiamo anche formattare frasi carine passando variabili e uno specificatore di formato. Per esempio:
```javascript
console.log('Il mio %s ha %d orecchie', 'gatto', 2);
```

- %s formatta una variabile come stringa - %d formatta una variabile come numero - %i formatta una variabile solo come parte intera - %o formatta una variabile come oggetto
Esempio:
```javascript
console.log('%o', Number);
```
## Pulisci la console

`console.clear()` pulisce la console (il comportamento potrebbe dipendere dalla console utilizzata).

## Conteggio degli elementi

`console.count()` è un metodo pratico.
Prendi questo codice:
```javascript
const x = 1;
const y = 2;
const z = 3;
console.count('Il valore di x è '+x+' ed è stato controllato...quante volte?');
console.count('Il valore di x è'+x+'ed è stato controllato...quante volte?');
console.count('Il valore di y è'+y+'ed è stato controllato...quante volte?');
```

Ciò che accade è che `console.count()` conterà il numero di volte in cui una stringa viene stampata e stamperà il conteggio accanto ad essa:

Puoi semplicemente contare mele e arance:

```javascript
const oranges = ['orange', 'orange'];
const apples = ['just one apple'];
oranges.forEach(fruit => console.count(fruit));
apples.forEach(fruit => console.count(fruit));
```

## Reimposta il conteggio

Il metodo `console.countReset()` reimposta il contatore utilizzato con `console.count()`.

Useremo l'esempio delle mele e delle arance per dimostrarlo.

```javascript
const oranges = ['orange', 'orange'];
const apples = ['just one apple'];
oranges.forEach(fruit => console.count(fruit));
apples.forEach(fruit => console.count(fruit));
console.countReset('orange');
oranges.forEach(fruit => console.count(fruit));
```


## Stampa la traccia dello stack

Potrebbero esserci casi in cui è utile stampare la traccia dello stack di chiamate di una funzione, magari per rispondere alla domanda "come sono arrivato a questa parte del codice?".

Puoi farlo usando `console.trace()`:

```javascript
const function2 = () => console.trace();
const function1 = () => function2();
function1();
```

Questo stamperà la traccia dello stack. Questo è ciò che viene stampato se proviamo questo nel REPL di Node.js:

```bash
Trace
at function2 (repl:1:33)
at function1 (rep1:1:25)
at rep1:1:1
at ContextifyScript.Script.xunInThisContext (vm.js:44:33)
at REPLServer.defaultEval(repl.js:239:29)
at bound (domain.js:301:14)
at REPLServer.xunBound [as eval](domain.js:314:12)
at REPLServer.onLine (repl.js:440:10)
at emitone (events.js:120:20)
at REPLServer.emit (events.js:210:7)
```

## Calcola il tempo impiegato

Puoi facilmente calcolare quanto tempo impiega una funzione per essere eseguita, usando `time()` e `timeEnd()`.

```javascript
const doSomething = () => console.log('test');
const measureDoingSomething = () => {
    console.time('doSomething()');
    // fai qualcosa e misura il tempo necessario
    doSomething();
    console.timeEnd('doSomething()');
};
measureDoingSomething();
```

### stdout e stderr

Come abbiamo visto, `console.log` è ottimo per stampare messaggi nella Console. Questo è ciò che viene chiamato output standard o stdout.

`console.error` stampa nel flusso stderr.

Non apparirà nella console, ma apparirà nel registro degli errori.

## Colora l'output

Puoi colorare l'output del tuo testo nella console usando sequenze di escape. Una sequenza di escape è un insieme di caratteri che identifica un colore.

Esempio:

```javascript
console.log('x1b[33ms/x1b[0m', 'ciao!');
```

Puoi provarlo nel REPL di Node.js e stamperà ciao! in giallo.

Tuttavia, questo è il modo di basso livello per farlo. Il modo più semplice per colorare l'output della console è usare una libreria. Chalk è una di queste librerie e, oltre a colorare, aiuta anche con altre funzionalità di stile, come rendere il testo in grassetto, corsivo o sottolineato.

Lo installi con `npm install chalk`, quindi puoi usarlo:

```javascript
const chalk = require('chalk');
console.log(chalk.yellow('ciao!'));
```

Usare `chalk.yellow` è molto più conveniente che cercare di ricordare i codici di escape e il codice è molto più leggibile.

Controlla il link del progetto pubblicato sopra per ulteriori esempi di utilizzo.


## Crea una barra di progresso

`progress` è un pacchetto fantastico per creare una barra di progresso nella console. Installalo usando `npm install progress`.

Questo frammento crea una barra di progresso a 10 passi, e ogni 100ms un passo viene completato. Quando la barra è completa, cancelliamo l'intervallo:

```javascript
const ProgressBar = require('progress');
const bar = new ProgressBar(':bar', { total: 10 });
const timer = setInterval(() => {
    bar.tick();
    if (bar.complete) {
        clearInterval(timer);
    }
}, 100);
```
