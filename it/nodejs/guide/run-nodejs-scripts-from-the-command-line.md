---
title: Eseguire script Node.js dalla riga di comando
description: Scopri come eseguire programmi Node.js dalla riga di comando, inclusa l'utilizzo del comando node, le linee shebang, i permessi di esecuzione, la trasmissione di stringhe come argomenti e il riavvio automatico dell'applicazione.
head:
  - - meta
    - name: og:title
      content: Eseguire script Node.js dalla riga di comando | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Scopri come eseguire programmi Node.js dalla riga di comando, inclusa l'utilizzo del comando node, le linee shebang, i permessi di esecuzione, la trasmissione di stringhe come argomenti e il riavvio automatico dell'applicazione.
  - - meta
    - name: twitter:title
      content: Eseguire script Node.js dalla riga di comando | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Scopri come eseguire programmi Node.js dalla riga di comando, inclusa l'utilizzo del comando node, le linee shebang, i permessi di esecuzione, la trasmissione di stringhe come argomenti e il riavvio automatico dell'applicazione.
---


# Esecuzione di script Node.js dalla riga di comando

Il modo consueto per eseguire un programma Node.js è eseguire il comando `node` disponibile globalmente (una volta installato Node.js) e passare il nome del file che si desidera eseguire.

Se il file principale dell'applicazione Node.js è `app.js`, è possibile chiamarlo digitando:

```bash
node app.js
```

Sopra, si sta dicendo esplicitamente alla shell di eseguire lo script con `node`. È anche possibile incorporare queste informazioni nel file JavaScript con una riga "shebang". Lo "shebang" è la prima riga del file e indica al sistema operativo quale interprete utilizzare per l'esecuzione dello script. Di seguito è riportata la prima riga di JavaScript:

```javascript
#!/usr/bin/node
```

Sopra, stiamo fornendo esplicitamente il percorso assoluto dell'interprete. Non tutti i sistemi operativi hanno `node` nella cartella `bin`, ma tutti dovrebbero avere `env`. Puoi dire al sistema operativo di eseguire `env` con `node` come parametro:

```javascript
#!/usr/bin/env node
// your javascript code
```

## Per utilizzare uno shebang, il file deve avere il permesso di esecuzione.

È possibile concedere a `app.js` il permesso di esecuzione eseguendo:

```bash
chmod u+x app.js
```

Durante l'esecuzione del comando, assicurati di trovarti nella stessa directory che contiene il file `app.js`.

## Passa una stringa come argomento a node invece del percorso del file

Per eseguire una stringa come argomento, è possibile utilizzare `-e`, `--eval "script"`. Valuta il seguente argomento come JavaScript. I moduli predefiniti in REPL possono essere utilizzati anche nello script. Su Windows, utilizzando `cmd.exe`, un singolo apice non funzionerà correttamente perché riconosce solo le virgolette doppie `"` per la citazione. In Powershell o Git bash, sia `"` che `'` sono utilizzabili.

```bash
node -e "console.log(123)"
```

## Riavvia automaticamente l'applicazione

A partire da nodejs V 16, è presente un'opzione integrata per riavviare automaticamente l'applicazione quando un file cambia. Questo è utile per scopi di sviluppo. Per utilizzare questa funzione, è necessario passare il flag `watch` a nodejs.

```bash
node --watch app.js
```

Quindi, quando si modifica il file, l'applicazione si riavvierà automaticamente. Leggi la documentazione del flag --watch [/api/cli#watch](https://nodejs.org/api/cli.html#--watch).

