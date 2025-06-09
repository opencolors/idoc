---
title: Documentazione di Corepack di Node.js
description: Corepack è un binario distribuito con Node.js, che fornisce un'interfaccia standard per gestire i gestori di pacchetti come npm, pnpm e Yarn. Permette agli utenti di passare facilmente tra diversi gestori di pacchetti e versioni, garantendo compatibilità e semplificando il flusso di lavoro di sviluppo.
head:
  - - meta
    - name: og:title
      content: Documentazione di Corepack di Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Corepack è un binario distribuito con Node.js, che fornisce un'interfaccia standard per gestire i gestori di pacchetti come npm, pnpm e Yarn. Permette agli utenti di passare facilmente tra diversi gestori di pacchetti e versioni, garantendo compatibilità e semplificando il flusso di lavoro di sviluppo.
  - - meta
    - name: twitter:title
      content: Documentazione di Corepack di Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Corepack è un binario distribuito con Node.js, che fornisce un'interfaccia standard per gestire i gestori di pacchetti come npm, pnpm e Yarn. Permette agli utenti di passare facilmente tra diversi gestori di pacchetti e versioni, garantendo compatibilità e semplificando il flusso di lavoro di sviluppo.
---


# Corepack {#corepack}

**Aggiunto in: v16.9.0, v14.19.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

*<a href="https://github.com/nodejs/corepack">Corepack</a>* è uno strumento sperimentale per aiutare nella gestione delle versioni dei tuoi gestori di pacchetti. Espone proxy binari per ogni [gestore di pacchetti supportato](/it/nodejs/api/corepack#supported-package-managers) che, quando chiamato, identificherà quale gestore di pacchetti è configurato per il progetto corrente, lo scaricherà se necessario e infine lo eseguirà.

Nonostante Corepack sia distribuito con le installazioni predefinite di Node.js, i gestori di pacchetti gestiti da Corepack non fanno parte della distribuzione di Node.js e:

- Al primo utilizzo, Corepack scarica l'ultima versione dalla rete.
- Qualsiasi aggiornamento richiesto (relativo a vulnerabilità di sicurezza o altro) è fuori dalla portata del progetto Node.js. Se necessario, gli utenti finali devono capire come aggiornare da soli.

Questa funzionalità semplifica due flussi di lavoro principali:

- Facilita l'onboarding di nuovi collaboratori, poiché non dovranno più seguire processi di installazione specifici del sistema solo per avere il gestore di pacchetti che desideri.
- Ti consente di assicurarti che tutti nel tuo team utilizzino esattamente la versione del gestore di pacchetti che intendi, senza che debbano sincronizzarla manualmente ogni volta che devi apportare un aggiornamento.

## Flussi di lavoro {#workflows}

### Abilitazione della funzionalità {#enabling-the-feature}

A causa del suo stato sperimentale, Corepack deve attualmente essere esplicitamente abilitato per avere effetto. Per fare ciò, esegui [`corepack enable`](https://github.com/nodejs/corepack#corepack-enable--name), che imposterà i collegamenti simbolici nel tuo ambiente accanto al binario `node` (e sovrascriverà i collegamenti simbolici esistenti se necessario).

Da questo punto in poi, qualsiasi chiamata ai [binari supportati](/it/nodejs/api/corepack#supported-package-managers) funzionerà senza ulteriori impostazioni. In caso di problemi, esegui [`corepack disable`](https://github.com/nodejs/corepack#corepack-disable--name) per rimuovere i proxy dal tuo sistema (e prendi in considerazione l'apertura di un problema sul [repository Corepack](https://github.com/nodejs/corepack) per farcelo sapere).


### Configurazione di un pacchetto {#configuring-a-package}

I proxy di Corepack troveranno il file [`package.json`](/it/nodejs/api/packages#nodejs-packagejson-field-definitions) più vicino nella gerarchia di directory corrente per estrarre la sua proprietà [`"packageManager"`](/it/nodejs/api/packages#packagemanager).

Se il valore corrisponde a un [gestore di pacchetti supportato](/it/nodejs/api/corepack#supported-package-managers), Corepack si assicurerà che tutte le chiamate ai binari pertinenti vengano eseguite rispetto alla versione richiesta, scaricandola su richiesta se necessario e interrompendo se non può essere recuperata correttamente.

Puoi usare [`corepack use`](https://github.com/nodejs/corepack#corepack-use-nameversion) per chiedere a Corepack di aggiornare il tuo `package.json` locale per usare il gestore di pacchetti che preferisci:

```bash [BASH]
corepack use  # imposta l'ultima versione 7.x nel package.json
corepack use yarn@* # imposta l'ultima versione nel package.json
```
### Aggiornamento delle versioni globali {#upgrading-the-global-versions}

Quando viene eseguito al di fuori di un progetto esistente (ad esempio quando si esegue `yarn init`), Corepack utilizzerà di default versioni predefinite che corrispondono approssimativamente alle ultime versioni stabili di ogni strumento. Queste versioni possono essere sovrascritte eseguendo il comando [`corepack install`](https://github.com/nodejs/corepack#corepack-install--g--global---all--nameversion) insieme alla versione del gestore di pacchetti che desideri impostare:

```bash [BASH]
corepack install --global
```
In alternativa, è possibile utilizzare un tag o un intervallo:

```bash [BASH]
corepack install --global pnpm@*
corepack install --global yarn@stable
```
### Workflow offline {#offline-workflow}

Molti ambienti di produzione non hanno accesso alla rete. Poiché Corepack di solito scarica le versioni del gestore di pacchetti direttamente dai loro registri, può entrare in conflitto con tali ambienti. Per evitare che ciò accada, chiama il comando [`corepack pack`](https://github.com/nodejs/corepack#corepack-pack---all--nameversion) mentre hai ancora accesso alla rete (in genere contemporaneamente alla preparazione dell'immagine di distribuzione). Ciò garantirà che i gestori di pacchetti richiesti siano disponibili anche senza accesso alla rete.

Il comando `pack` ha [varie flag](https://github.com/nodejs/corepack#utility-commands). Consulta la [documentazione dettagliata di Corepack](https://github.com/nodejs/corepack#readme) per ulteriori informazioni.


## Gestori di pacchetti supportati {#supported-package-managers}

I seguenti binari sono forniti tramite Corepack:

| Gestore di pacchetti | Nomi binari |
| --- | --- |
| [Yarn](https://yarnpkg.com/) | `yarn`  ,   `yarnpkg` |
| [pnpm](https://pnpm.io/) | `pnpm`  ,   `pnpx` |
## Domande comuni {#common-questions}

### Come interagisce Corepack con npm? {#how-does-corepack-interact-with-npm?}

Sebbene Corepack possa supportare npm come qualsiasi altro gestore di pacchetti, i suoi shim non sono abilitati per impostazione predefinita. Questo ha alcune conseguenze:

- È sempre possibile eseguire un comando `npm` all'interno di un progetto configurato per essere utilizzato con un altro gestore di pacchetti, poiché Corepack non può intercettarlo.
- Sebbene `npm` sia un'opzione valida nella proprietà [`"packageManager"`](/it/nodejs/api/packages#packagemanager), la mancanza di shim farà sì che venga utilizzato l'npm globale.

### L'esecuzione di `npm install -g yarn` non funziona {#running-npm-install--g-yarn-doesnt-work}

npm impedisce di sovrascrivere accidentalmente i binari di Corepack durante un'installazione globale. Per evitare questo problema, prendi in considerazione una delle seguenti opzioni:

- Non eseguire questo comando; Corepack fornirà comunque i binari del gestore di pacchetti e si assicurerà che le versioni richieste siano sempre disponibili, quindi non è necessario installare esplicitamente i gestori di pacchetti.
- Aggiungi il flag `--force` a `npm install`; questo dirà a npm che va bene sovrascrivere i binari, ma cancellerai quelli di Corepack nel processo. (Esegui [`corepack enable`](https://github.com/nodejs/corepack#corepack-enable--name) per aggiungerli di nuovo.)

