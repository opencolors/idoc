---
title: Documentazione Node.js - Sinossi
description: Una panoramica di Node.js, che dettaglia la sua architettura asincrona basata su eventi, i moduli principali e come iniziare lo sviluppo con Node.js.
head:
  - - meta
    - name: og:title
      content: Documentazione Node.js - Sinossi | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Una panoramica di Node.js, che dettaglia la sua architettura asincrona basata su eventi, i moduli principali e come iniziare lo sviluppo con Node.js.
  - - meta
    - name: twitter:title
      content: Documentazione Node.js - Sinossi | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Una panoramica di Node.js, che dettaglia la sua architettura asincrona basata su eventi, i moduli principali e come iniziare lo sviluppo con Node.js.
---


# Utilizzo ed esempio {#usage-and-example}

## Utilizzo {#usage}

`node [opzioni] [opzioni V8] [script.js | -e "script" | - ] [argomenti]`

Per maggiori informazioni, consulta il documento [Opzioni della riga di comando](/it/nodejs/api/cli#options).

## Esempio {#example}

Un esempio di [web server](/it/nodejs/api/http) scritto con Node.js che risponde con `'Ciao, Mondo!'`:

I comandi in questo documento iniziano con `$` o `\>` per replicare come apparirebbero nel terminale di un utente. Non includere i caratteri `$` e `\>`. Sono lì per mostrare l'inizio di ogni comando.

Le righe che non iniziano con il carattere `$` o `\>` mostrano l'output del comando precedente.

Innanzitutto, assicurati di aver scaricato e installato Node.js. Per ulteriori informazioni sull'installazione, consulta [Installazione di Node.js tramite package manager](https://nodejs.org/en/download/package-manager/).

Ora, crea una cartella di progetto vuota chiamata `projects`, quindi accedi ad essa.

Linux e Mac:

```bash [BASH]
mkdir ~/projects
cd ~/projects
```
Windows CMD:

```bash [BASH]
mkdir %USERPROFILE%\projects
cd %USERPROFILE%\projects
```
Windows PowerShell:

```bash [BASH]
mkdir $env:USERPROFILE\projects
cd $env:USERPROFILE\projects
```
Successivamente, crea un nuovo file sorgente nella cartella `projects` e chiamalo `hello-world.js`.

Apri `hello-world.js` in un editor di testo a tua scelta e incolla il seguente contenuto:

```js [ESM]
const http = require('node:http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Ciao, Mondo!\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```
Salva il file. Quindi, nella finestra del terminale, per eseguire il file `hello-world.js`, digita:

```bash [BASH]
node hello-world.js
```
Un output come questo dovrebbe apparire nel terminale:

```bash [BASH]
Server running at http://127.0.0.1:3000/
```
Ora, apri un browser web a tua scelta e visita `http://127.0.0.1:3000`.

Se il browser visualizza la stringa `Ciao, Mondo!`, ciò indica che il server funziona.

