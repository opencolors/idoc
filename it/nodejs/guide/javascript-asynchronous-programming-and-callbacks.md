---
title: Programmazione asincrona di JavaScript e callback
description: JavaScript è sincrono di default, ma può gestire le operazioni asincrone tramite callback, che sono funzioni passate come argomenti ad altre funzioni ed eseguite quando si verifica un evento specifico.
head:
  - - meta
    - name: og:title
      content: Programmazione asincrona di JavaScript e callback | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: JavaScript è sincrono di default, ma può gestire le operazioni asincrone tramite callback, che sono funzioni passate come argomenti ad altre funzioni ed eseguite quando si verifica un evento specifico.
  - - meta
    - name: twitter:title
      content: Programmazione asincrona di JavaScript e callback | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: JavaScript è sincrono di default, ma può gestire le operazioni asincrone tramite callback, che sono funzioni passate come argomenti ad altre funzioni ed eseguite quando si verifica un evento specifico.
---


# Programmazione Asincrona in JavaScript e Callback

## Asincronia nei Linguaggi di Programmazione
I computer sono asincroni per progettazione.

Asincrono significa che le cose possono accadere indipendentemente dal flusso principale del programma.

Nei computer consumer attuali, ogni programma viene eseguito per un intervallo di tempo specifico e quindi interrompe la sua esecuzione per consentire a un altro programma di continuare la sua esecuzione. Questa cosa viene eseguita in un ciclo così veloce che è impossibile notarlo. Pensiamo che i nostri computer eseguano molti programmi contemporaneamente, ma questa è un'illusione (tranne che sulle macchine multiprocessore).

I programmi internamente usano interrupt, un segnale che viene emesso al processore per attirare l'attenzione del sistema.

Non entriamo ora nei dettagli interni di questo, ma teniamo presente che è normale che i programmi siano asincroni e interrompano la loro esecuzione fino a quando non hanno bisogno di attenzione, consentendo al computer di eseguire altre cose nel frattempo. Quando un programma è in attesa di una risposta dalla rete, non può bloccare il processore fino al completamento della richiesta.

Normalmente, i linguaggi di programmazione sono sincroni e alcuni forniscono un modo per gestire l'asincronia nel linguaggio o tramite librerie. C, Java, C#, PHP, Go, Ruby, Swift e Python sono tutti sincroni per impostazione predefinita. Alcuni di essi gestiscono le operazioni asincrone utilizzando thread, generando un nuovo processo.

## JavaScript
JavaScript è **sincrono** per impostazione predefinita ed è a thread singolo. Ciò significa che il codice non può creare nuovi thread ed eseguire in parallelo.

Le righe di codice vengono eseguite in serie, una dopo l'altra, ad esempio:

```js
const a = 1;
const b = 2;
const c = a * b;
console.log(c);
doSomething();
```

Ma JavaScript è nato all'interno del browser, il suo compito principale, all'inizio, era quello di rispondere alle azioni dell'utente, come `onClick`, `onMouseOver`, `onChange`, `onSubmit` e così via. Come poteva farlo con un modello di programmazione sincrono?

La risposta era nel suo ambiente. Il **browser** fornisce un modo per farlo fornendo una serie di API in grado di gestire questo tipo di funzionalità.

Più recentemente, Node.js ha introdotto un ambiente I/O non bloccante per estendere questo concetto all'accesso ai file, alle chiamate di rete e così via.


## Callback
Non puoi sapere quando un utente farà clic su un pulsante. Quindi, definisci un gestore di eventi per l'evento click. Questo gestore di eventi accetta una funzione, che verrà chiamata quando l'evento viene attivato:

```js
document.getElementById('button').addEventListener('click', () => {
  // elemento cliccato
});
```

Questa è la cosiddetta **callback**.

Una callback è una semplice funzione che viene passata come valore a un'altra funzione e verrà eseguita solo quando si verifica l'evento. Possiamo farlo perché JavaScript ha funzioni di prima classe, che possono essere assegnate a variabili e passate ad altre funzioni (chiamate **funzioni di ordine superiore**)

È comune racchiudere tutto il codice client in un listener di eventi **load** sull'oggetto **window**, che esegue la funzione di callback solo quando la pagina è pronta:

```js
window.addEventListener('load', () => {
  // finestra caricata
  // fai quello che vuoi
});
```

Le callback sono utilizzate ovunque, non solo negli eventi DOM.

Un esempio comune è l'utilizzo dei timer:

```js
setTimeout(() => {
  // viene eseguito dopo 2 secondi
}, 2000);
```

Le richieste XHR accettano anche una callback, in questo esempio assegnando una funzione a una proprietà che verrà chiamata quando si verifica un particolare evento (in questo caso, lo stato della richiesta cambia):

```js
const xhr = new XMLHttpRequest();
xhr.onreadystatechange = () => {
  if (xhr.readyState === 4) {
    xhr.status === 200 ? console.log(xhr.responseText) : console.error('error');
  }
};
xhr.open('GET', 'https://yoursite.com');
xhr.send();
```

## Gestione degli errori nelle callback
Come si gestiscono gli errori con le callback? Una strategia molto comune è quella adottata da Node.js: il primo parametro in qualsiasi funzione di callback è l'oggetto errore: callback con errore come primo parametro

Se non ci sono errori, l'oggetto è null. Se c'è un errore, contiene una descrizione dell'errore e altre informazioni.

```js
const fs = require('node:fs');
fs.readFile('/file.json', (err, data) => {
  if (err) {
    // gestisci l'errore
    console.log(err);
    return;
  }
  // nessun errore, elabora i dati
  console.log(data);
});
```


## Il problema con le callback
Le callback sono ottime per i casi semplici!

Tuttavia ogni callback aggiunge un livello di annidamento, e quando si hanno molte callback, il codice inizia a diventare complicato molto rapidamente:

```js
window.addEventListener('load', () => {
  document.getElementById('button').addEventListener('click', () => {
    setTimeout(() => {
      items.forEach(item => {
        // il tuo codice qui
      });
    }, 2000);
  });
});
```

Questo è solo un semplice codice a 4 livelli, ma ho visto molti più livelli di annidamento e non è divertente.

Come possiamo risolvere questo?

## Alternative alle callback
A partire da ES6, JavaScript ha introdotto diverse funzionalità che ci aiutano con il codice asincrono che non implicano l'uso di callback: `Promises` (ES6) e `Async/Await` (ES2017).

