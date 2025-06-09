---
title: Come leggere le variabili di ambiente in Node.js
description: Scopri come accedere alle variabili di ambiente in Node.js utilizzando la proprietà process.env e i file .env.
head:
  - - meta
    - name: og:title
      content: Come leggere le variabili di ambiente in Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Scopri come accedere alle variabili di ambiente in Node.js utilizzando la proprietà process.env e i file .env.
  - - meta
    - name: twitter:title
      content: Come leggere le variabili di ambiente in Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Scopri come accedere alle variabili di ambiente in Node.js utilizzando la proprietà process.env e i file .env.
---


# Come leggere le variabili d'ambiente da Node.js

Il modulo core `process` di Node.js fornisce la proprietà `env` che ospita tutte le variabili d'ambiente impostate al momento dell'avvio del processo.

Il codice seguente esegue `app.js` e imposta `USER_ID` e `USER_KEY`.

```bash
USER_ID=239482 USER_KEY=foobar node app.js
```

Questo passerà l'utente `USER_ID` come 239482 e `USER_KEY` come foobar. Questo è adatto per i test, tuttavia per la produzione probabilmente configurerai alcuni script bash per esportare le variabili.

::: tip NOTE
`process` non richiede un `"require"`, è automaticamente disponibile.
:::

Ecco un esempio che accede alle variabili d'ambiente `USER_ID` e `USER_KEY`, che abbiamo impostato nel codice sopra.

```javascript
process.env.USER_ID; // "239482
process.env.USER_KEY; // "foobar
```

Allo stesso modo puoi accedere a qualsiasi variabile d'ambiente personalizzata che hai impostato. Node.js 20 ha introdotto il [supporto sperimentale per i file .env](/it/nodejs/api/cli#env-file-config).

Ora puoi utilizzare il flag `--env-file` per specificare un file di ambiente quando esegui la tua applicazione Node.js. Ecco un esempio di file `.env` e come accedere alle sue variabili usando `process.env`.

```bash
.env file
PORT=3000
```

Nel tuo file js

```javascript
process.env.PORT; // 3000
```

Esegui il file `app.js` con le variabili d'ambiente impostate nel file `.env`.

```js
node --env-file=.env app.js
```

Questo comando carica tutte le variabili d'ambiente dal file `.env`, rendendole disponibili all'applicazione su `process.env`. Inoltre, puoi passare più argomenti --env-file. I file successivi sovrascrivono le variabili preesistenti definite nei file precedenti.

```bash
node --env-file=.env --env-file=.development.env app.js
```
::: tip NOTE
se la stessa variabile è definita nell'ambiente e nel file, il valore dell'ambiente ha la precedenza.
:::

