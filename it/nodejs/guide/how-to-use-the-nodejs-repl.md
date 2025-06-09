---
title: Come utilizzare il REPL di Node.js
description: Scopri come utilizzare il REPL di Node.js per testare rapidamente codice JavaScript semplice ed esplorare le sue funzionalità, tra cui modalità multiriga, variabili speciali e comandi punto.
head:
  - - meta
    - name: og:title
      content: Come utilizzare il REPL di Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Scopri come utilizzare il REPL di Node.js per testare rapidamente codice JavaScript semplice ed esplorare le sue funzionalità, tra cui modalità multiriga, variabili speciali e comandi punto.
  - - meta
    - name: twitter:title
      content: Come utilizzare il REPL di Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Scopri come utilizzare il REPL di Node.js per testare rapidamente codice JavaScript semplice ed esplorare le sue funzionalità, tra cui modalità multiriga, variabili speciali e comandi punto.
---


# Come usare il REPL di Node.js

Il comando `node` è quello che usiamo per eseguire i nostri script Node.js:

```bash
node script.js
```

Se eseguiamo il comando `node` senza nessuno script da eseguire o senza argomenti, avviamo una sessione REPL:

```bash
node
```

::: tip NOTA
REPL sta per Read Evaluate Print Loop (Leggi, Valuta, Stampa, Ripeti), ed è un ambiente di linguaggio di programmazione (fondamentalmente una finestra di console) che prende una singola espressione come input dell'utente e restituisce il risultato alla console dopo l'esecuzione. La sessione REPL fornisce un modo conveniente per testare rapidamente codice JavaScript semplice.
:::

Se lo provi ora nel tuo terminale, ecco cosa succede:

```bash
> node
>
```

Il comando rimane in modalità inattiva e aspetta che inseriamo qualcosa.

::: tip
se non sei sicuro di come aprire il tuo terminale, cerca su Google "Come aprire il terminale su tuo-sistema-operativo".
:::

Il REPL sta aspettando che inseriamo codice JavaScript, per essere più precisi.

Inizia in modo semplice e inserisci:

```bash
> console.log('test')
test
undefined
>
```

Il primo valore, `test`, è l'output che abbiamo detto alla console di stampare, poi otteniamo `undefined` che è il valore di ritorno dell'esecuzione di `console.log()`. Node ha letto questa riga di codice, l'ha valutata, ha stampato il risultato e poi è tornato ad aspettare altre righe di codice. Node ripeterà questi tre passaggi per ogni pezzo di codice che eseguiamo nel REPL fino a quando non usciamo dalla sessione. È da lì che il REPL ha preso il suo nome.

Node stampa automaticamente il risultato di qualsiasi riga di codice JavaScript senza la necessità di istruirlo a farlo. Ad esempio, digita la riga seguente e premi invio:

```bash
> 5==5
false
>
```

Nota la differenza negli output delle due righe sopra. Il REPL di Node ha stampato `undefined` dopo aver eseguito `console.log()`, mentre d'altra parte, ha semplicemente stampato il risultato di `5== '5'`. Devi tenere presente che la prima è solo una dichiarazione in JavaScript e la seconda è un'espressione.

In alcuni casi, il codice che vuoi testare potrebbe aver bisogno di più righe. Ad esempio, supponiamo che tu voglia definire una funzione che genera un numero casuale, nella sessione REPL digita la riga seguente e premi invio:

```javascript
function generateRandom()
...
```

Il REPL di Node è abbastanza intelligente da determinare che non hai ancora finito di scrivere il tuo codice ed entrerà in modalità multi-linea per permetterti di digitare più codice. Ora termina la definizione della tua funzione e premi invio:

```javascript
function generateRandom()
...return Math.random()
```

### La variabile speciale:

Se dopo un po' di codice digiti `_`, questo stamperà il risultato dell'ultima operazione.

### Il tasto freccia su:

Se premi il tasto freccia su, avrai accesso alla cronologia delle righe di codice precedenti eseguite nella sessione REPL corrente, e anche nelle sessioni precedenti.

## Comandi con il punto

La REPL ha alcuni comandi speciali, tutti inizianti con un punto `.`. Sono:
- `.help`: mostra l'aiuto dei comandi con il punto.
- `.editor`: abilita la modalità editor, per scrivere facilmente codice JavaScript multilinea. Una volta che sei in questa modalità, digita `ctrl-D` per eseguire il codice che hai scritto.
- `.break`: quando si inserisce un'espressione multilinea, inserire il comando `.break` interromperà ulteriori input. Come premere `ctrl-C`.
- `.clear`: reimposta il contesto della REPL a un oggetto vuoto e cancella qualsiasi espressione multilinea attualmente in fase di inserimento.
- `.1oad`: carica un file JavaScript, relativo alla directory di lavoro corrente.
- `.save`: salva tutto ciò che hai inserito nella sessione REPL in un file (specifica il nome del file).
- `.exit`: esce dalla REPL (come premere `ctrl-C` due volte).

La REPL sa quando stai digitando un'istruzione multilinea senza la necessità di invocare `.editor`. Ad esempio, se inizi a digitare un'iterazione come questa:
```javascript
[1, 2,3].foxEach(num=>{
```
e premi invio, la REPL andrà a una nuova riga che inizia con 3 punti, indicando che ora puoi continuare a lavorare su quel blocco.
```javascript
1... console.log (num)
2...}
```

Se digiti `.break` alla fine di una riga, la modalità multilinea si interromperà e l'istruzione non verrà eseguita.

## Esegui la REPL da un file JavaScript

Possiamo importare la REPL in un file JavaScript usando `repl`.
```javascript
const repl = require('node:repl');
```

Usando la variabile `repl` possiamo eseguire varie operazioni. Per avviare il prompt dei comandi REPL, digita la seguente riga:
```javascript
repl.start();
```

Esegui il file nella riga di comando.
```bash
node repl.js
```

Puoi passare una stringa che mostra quando la REPL si avvia. Il valore predefinito è '>' (con uno spazio finale), ma possiamo definire un prompt personalizzato.
```javascript
// un prompt in stile Unix
const local = repl.start('$ ');
```

Puoi visualizzare un messaggio quando esci dalla REPL

```javascript
local.on('exit', () => {
  console.log('uscita dalla repl');
  process.exit();
});
```

Puoi leggere di più sul modulo REPL nella [documentazione repl](/it/nodejs/api/repl).

