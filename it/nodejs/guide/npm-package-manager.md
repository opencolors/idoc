---
title: Guida completa a npm, il gestore di pacchetti di Node.js
description: Scopri come utilizzare npm per gestire le dipendenze, installare e aggiornare pacchetti ed eseguire attività nei tuoi progetti Node.js.
head:
  - - meta
    - name: og:title
      content: Guida completa a npm, il gestore di pacchetti di Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Scopri come utilizzare npm per gestire le dipendenze, installare e aggiornare pacchetti ed eseguire attività nei tuoi progetti Node.js.
  - - meta
    - name: twitter:title
      content: Guida completa a npm, il gestore di pacchetti di Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Scopri come utilizzare npm per gestire le dipendenze, installare e aggiornare pacchetti ed eseguire attività nei tuoi progetti Node.js.
---


# Introduzione a npm, il gestore di pacchetti

## Introduzione a npm

`npm` è il gestore di pacchetti standard per Node.js.

A settembre 2022, nel registro npm erano elencati oltre 2,1 milioni di pacchetti, il che lo rende il più grande repository di codice a linguaggio singolo sulla Terra, e puoi essere sicuro che esiste un pacchetto per (quasi!) ogni cosa.

È nato come un modo per scaricare e gestire le dipendenze dei pacchetti Node.js, ma da allora è diventato uno strumento utilizzato anche in JavaScript frontend.

::: tip
`Yarn` e `pnpm` sono alternative all'interfaccia a riga di comando di npm. Puoi dare un'occhiata anche a quelli.
:::

## Pacchetti

### Installazione di tutte le dipendenze

Puoi installare tutte le dipendenze elencate nel tuo file `package.json` eseguendo:

```bash
npm install
```

installerà tutto ciò di cui il progetto ha bisogno, nella cartella `node_modules`, creandola se non esiste già.

### Installazione di un singolo pacchetto

Puoi installare un singolo pacchetto eseguendo:

```bash
npm install <nome-pacchetto>
```

Inoltre, da npm 5, questo comando aggiunge `<nome-pacchetto>` alle dipendenze del file `package.json`. Prima della versione 5, era necessario aggiungere il flag `--save`.

Spesso vedrai più flag aggiunti a questo comando:

+ `--save-dev` (o `-D`) che aggiunge il pacchetto alla sezione `devDependencies` del file `package.json`.
+ `--no-save` che impedisce il salvataggio del pacchetto nel file `package.json`.
+ `--no-optional` che impedisce l'installazione di dipendenze opzionali.
+ `--save-optional` che aggiunge il pacchetto alla sezione `optionalDependencies` del file `package.json`.

È anche possibile utilizzare le abbreviazioni dei flag:

+ `-S`: `--save`
+ `-D`: `--save-dev`
+ `-O`: `--save-optional`

La differenza tra devDependencies e dependencies è che il primo contiene strumenti di sviluppo, come una libreria di testing, mentre il secondo è incluso nell'app in produzione.

Per quanto riguarda le optionalDependencies, la differenza è che il fallimento della build della dipendenza non causerà il fallimento dell'installazione. Ma è responsabilità del tuo programma gestire la mancanza della dipendenza. Leggi di più sulle [dipendenze opzionali](https://docs.npmjs.com/cli/v10/using-npm/config#optional).


### Aggiornamento dei pacchetti
Anche l'aggiornamento è reso semplice, eseguendo

```bash
npm update
```

Questo aggiornerà tutte le dipendenze alla loro versione più recente.

Puoi specificare anche un singolo pacchetto da aggiornare:

```bash
npm update <package-name>
```

### Rimozione dei pacchetti

Per rimuovere un pacchetto, puoi eseguire:

```bash
npm uninstall <package-name>
```

### Versionamento
Oltre ai semplici download, `npm` gestisce anche il versionamento, in modo da poter specificare una versione specifica di un pacchetto o richiedere una versione superiore o inferiore a quella necessaria.

Molte volte scoprirai che una libreria è compatibile solo con una versione principale di un'altra libreria.

Oppure un bug nell'ultima versione di una libreria, ancora non risolto, sta causando un problema.

Specificare una versione esplicita di una libreria aiuta anche a mantenere tutti sulla stessa identica versione di un pacchetto, in modo che l'intero team esegua la stessa versione finché il file `package.json` non viene aggiornato.

In tutti questi casi, il versionamento aiuta molto e `npm` segue lo standard del [versionamento semantico (semver)](https://semver.org/).

Puoi installare una versione specifica di un pacchetto, eseguendo

```bash
npm install <package-name>@<version>
```

Puoi anche installare l'ultima versione di un pacchetto, eseguendo

```bash
npm install <package-name>@latest
```

### Esecuzione di attività
Il file package.json supporta un formato per specificare le attività della riga di comando che possono essere eseguite utilizzando

```bash
npm run <task-name>
```

Ad esempio, se hai un file package.json con il seguente contenuto:

```json
{
  "scripts": {
    "start": "node index.js",
    "test": "jest"
  }
}
```

È molto comune usare questa funzionalità per eseguire Webpack:

```json
{
  "scripts": {
    "watch": "webpack --watch --progress --colors --config webpack.conf.js",
    "dev": "webpack --progress --colors --config webpack.conf.js",
    "prod": "NODE_ENV=production webpack -p --config webpack.conf.js"
  }
}
```

Quindi, invece di digitare quei lunghi comandi, che sono facili da dimenticare o digitare in modo errato, puoi eseguire


```bash
npm run watch
npm run dev
npm run prod
```

