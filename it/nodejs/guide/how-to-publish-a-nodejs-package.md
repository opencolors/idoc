---
title: Pubblicazione di un pacchetto Node-API
description: Scopri come pubblicare una versione Node-API di un pacchetto insieme a una versione non Node-API e come introdurre una dipendenza da una versione Node-API di un pacchetto.
head:
  - - meta
    - name: og:title
      content: Pubblicazione di un pacchetto Node-API | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Scopri come pubblicare una versione Node-API di un pacchetto insieme a una versione non Node-API e come introdurre una dipendenza da una versione Node-API di un pacchetto.
  - - meta
    - name: twitter:title
      content: Pubblicazione di un pacchetto Node-API | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Scopri come pubblicare una versione Node-API di un pacchetto insieme a una versione non Node-API e come introdurre una dipendenza da una versione Node-API di un pacchetto.
---


# Come pubblicare un pacchetto Node-API

## Come pubblicare una versione Node-API di un pacchetto insieme a una versione non-Node-API

I seguenti passaggi sono illustrati utilizzando il pacchetto `iotivity-node`:

- Innanzitutto, pubblica la versione non-Node-API:
    - Aggiorna la versione in `package.json`. Per `iotivity-node`, la versione diventa 1.2.0-2.
    - Rivedi la checklist di rilascio (assicurati che test/demo/documentazione siano OK).
    - `npm publish`.

- Quindi, pubblica la versione Node-API:
    - Aggiorna la versione in `package.json`. Nel caso di `iotivity-node`, la versione diventa 1.2.0-3. Per il versionamento, consigliamo di seguire lo schema di versione pre-release come descritto da [semver.org](https://semver.org) es. 1.2.0-napi.
    - Rivedi la checklist di rilascio (assicurati che test/demo/documentazione siano OK).
    - `npm publish --tag n-api`.

In questo esempio, l'etichettatura del rilascio con `n-api` ha assicurato che, sebbene la versione 1.2.0-3 sia successiva alla versione pubblicata non-Node-APl (1.2.0-2), non verrà installata se qualcuno sceglie di installare `iotivity-node` semplicemente eseguendo `npm install iotivity-node`. Questo installerà la versione non-Node-APl per impostazione predefinita. L'utente dovrà eseguire `npm install iotivity-node@n api` per ricevere la versione Node-APlI. Per ulteriori informazioni sull'utilizzo dei tag con npm, consulta "Utilizzo di dist-tag".

## Come introdurre una dipendenza da una versione Node-API di un pacchetto

Per aggiungere la versione Node-API di `iotivity-node` come dipendenza, il file `package.json` sarà simile a questo:

```json
"dependencies": {
  "iotivity-node": "n-api"
}
```

Come spiegato in "Utilizzo di dist-tag", a differenza delle versioni regolari, le versioni etichettate non possono essere indirizzate da intervalli di versione come `"^2.0.0"` all'interno di `package.json`. Il motivo è che il tag si riferisce esattamente a una versione. Quindi, se il manutentore del pacchetto sceglie di taggare una versione successiva del pacchetto utilizzando lo stesso tag, `npm update` riceverà la versione successiva. Questa dovrebbe essere una versione accettabile diversa dall'ultima pubblicata, la dipendenza `package.json` dovrà fare riferimento alla versione esatta come la seguente:

```json
"dependencies": {
  "iotivity-node": "1.2.0-3"
}
```
