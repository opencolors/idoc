---
title: Debug di Node.js
description: Opzioni di debug di Node.js, comprese --inspect, --inspect-brk e --debug, nonché scenari di debug remoto e informazioni sul debugger legacy.
head:
  - - meta
    - name: og:title
      content: Debug di Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Opzioni di debug di Node.js, comprese --inspect, --inspect-brk e --debug, nonché scenari di debug remoto e informazioni sul debugger legacy.
  - - meta
    - name: twitter:title
      content: Debug di Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Opzioni di debug di Node.js, comprese --inspect, --inspect-brk e --debug, nonché scenari di debug remoto e informazioni sul debugger legacy.
---


# Debugging di Node.js

Questa guida ti aiuterà ad iniziare il debugging delle tue app e script Node.js.

## Abilitare l'Inspector

Quando viene avviato con l'opzione `--inspect`, un processo Node.js rimane in ascolto di un client di debugging. Di default, ascolterà sull'host e sulla porta `127.0.0.1:9229`. A ogni processo viene anche assegnato un UUID univoco.

I client Inspector devono conoscere e specificare l'indirizzo host, la porta e l'UUID per connettersi. Un URL completo avrà un aspetto simile a `ws://127.0.0.1:9229/0f2c936f-b1cd-4ac9-aab3-f63b0f33d55e`.

Node.js inizierà anche ad ascoltare i messaggi di debug se riceve un segnale `SIGUSR1`. ( `SIGUSR1` non è disponibile su Windows.) In Node.js 7 e versioni precedenti, questo attiva la legacy Debugger API. In Node.js 8 e versioni successive, attiverà l'Inspector API.

## Implicazioni sulla sicurezza

Poiché il debugger ha pieno accesso all'ambiente di esecuzione Node.js, un malintenzionato in grado di connettersi a questa porta potrebbe essere in grado di eseguire codice arbitrario per conto del processo Node.js. È importante comprendere le implicazioni sulla sicurezza dell'esposizione della porta del debugger su reti pubbliche e private.

### Esporre pubblicamente la porta di debug è pericoloso

Se il debugger è associato a un indirizzo IP pubblico o a 0.0.0.0, tutti i client che possono raggiungere il tuo indirizzo IP saranno in grado di connettersi al debugger senza alcuna restrizione e saranno in grado di eseguire codice arbitrario.

Di default `node --inspect` si collega a 127.0.0.1. Devi fornire esplicitamente un indirizzo IP pubblico o 0.0.0.0, ecc., se intendi consentire connessioni esterne al debugger. Ciò potrebbe esporti a una potenziale minaccia alla sicurezza significativa. Ti suggeriamo di assicurarti che siano in atto firewall e controlli di accesso adeguati per prevenire un'esposizione alla sicurezza.

Consulta la sezione su '[Abilitazione di scenari di debug remoto](/it/nodejs/guide/debugging-nodejs#enabling-remote-debugging-scenarios)' per alcuni suggerimenti su come consentire in modo sicuro ai client di debug remoti di connettersi.

### Le applicazioni locali hanno pieno accesso all'inspector

Anche se associ la porta dell'inspector a 127.0.0.1 (l'impostazione predefinita), tutte le applicazioni in esecuzione localmente sulla tua macchina avranno accesso illimitato. Questo è intenzionale per consentire ai debugger locali di potersi collegare comodamente.


### Browser, WebSocket e politica della stessa origine

I siti web aperti in un browser web possono effettuare richieste WebSocket e HTTP secondo il modello di sicurezza del browser. È necessaria una connessione HTTP iniziale per ottenere un ID di sessione debugger univoco. La politica della stessa origine impedisce ai siti web di effettuare questa connessione HTTP. Per una maggiore sicurezza contro gli [attacchi di DNS rebinding](https://en.wikipedia.org/wiki/DNS_rebinding), Node.js verifica che gli header 'Host' per la connessione specifichino un indirizzo IP o precisamente `localhost`.

Queste politiche di sicurezza impediscono la connessione a un server di debug remoto specificando il nome host. È possibile aggirare questa restrizione specificando l'indirizzo IP oppure utilizzando tunnel ssh come descritto di seguito.

## Client Inspector

Un debugger CLI minimale è disponibile con node inspect myscript.js. Diversi strumenti commerciali e open source possono anche connettersi all'Inspector di Node.js.

### Chrome DevTools 55+, Microsoft Edge
+ **Opzione 1**: Apri `chrome://inspect` in un browser basato su Chromium oppure `edge://inspect` in Edge. Fai clic sul pulsante Configura e assicurati che l'host e la porta di destinazione siano elencati.
+ **Opzione 2**: Copia l'URL `devtoolsFrontendUrl` dall'output di `/json/list` (vedi sopra) o il testo di suggerimento `--inspect` e incollalo in Chrome.

Vedi [https://github.com/ChromeDevTools/devtools-frontend](https://github.com/ChromeDevTools/devtools-frontend), [https://www.microsoftedgeinsider.com](https://www.microsoftedgeinsider.com) per maggiori informazioni.

### Visual Studio Code 1.10+
+ Nel pannello Debug, fai clic sull'icona delle impostazioni per aprire `.vscode/launch.json`. Seleziona "Node.js" per la configurazione iniziale.

Vedi [https://github.com/microsoft/vscode](https://github.com/microsoft/vscode) per maggiori informazioni.

### JetBrains WebStorm e altri IDE JetBrains

+ Crea una nuova configurazione di debug Node.js e premi Debug. `--inspect` verrà utilizzato per impostazione predefinita per Node.js 7+. Per disabilitare, deseleziona `js.debugger.node.use.inspect` nel Registro IDE. Per saperne di più sull'esecuzione e il debug di Node.js in WebStorm e altri IDE JetBrains, consulta la [guida online di WebStorm](https://www.jetbrains.com/help/webstorm/running-and-debugging-node-js.html).


### chrome-remote-interface

+ Libreria per semplificare le connessioni agli endpoint dell'[Inspector Protocol](https://chromedevtools.github.io/debugger-protocol-viewer/v8/).
Vedi [https://github.com/cyrus-and/chrome-remote-interface](https://github.com/cyrus-and/chrome-remote-interface) per maggiori informazioni.

### Gitpod

+ Avvia una configurazione di debug Node.js dalla vista `Debug` o premi `F5`. Istruzioni dettagliate

Vedi [https://www.gitpod.io](https://www.gitpod.io) per maggiori informazioni.

### Eclipse IDE con l'estensione Eclipse Wild Web Developer

+ Da un file `.js`, scegli `Debug As... > Node program`, oppure Crea una configurazione di debug per collegare il debugger all'applicazione Node.js in esecuzione (già avviata con `--inspect`).

Vedi [https://eclipse.org/eclipseide](https://eclipse.org/eclipseide) per maggiori informazioni.

## Opzioni della riga di comando

La seguente tabella elenca l'impatto di vari flag di runtime sul debug:

| Flag | Significato |
| --- | --- |
| `--inspect` | Abilita il debug con Node.js Inspector. Ascolta sull'indirizzo e la porta predefiniti (127.0.0.1:9229) |
| `--inspect-brk` | Abilita il debug con Node.js Inspector. Ascolta sull'indirizzo e la porta predefiniti (127.0.0.1:9229); Interrompi prima che inizi il codice utente |
| `--inspect=[host:port]` | Abilita l'agente inspector; Associa all'indirizzo o al nome host (predefinito: 127.0.0.1); Ascolta sulla porta (predefinita: 9229) |
| `--inspect-brk=[host:port]` | Abilita l'agente inspector; Associa all'indirizzo o al nome host (predefinito: 127.0.0.1); Ascolta sulla porta (predefinita: 9229); Interrompi prima che inizi il codice utente |
| `--inspect-wait` | Abilita l'agente inspector; Ascolta sull'indirizzo e la porta predefiniti (127.0.0.1:9229); Attendi che venga collegato un debugger. |
| `--inspect-wait=[host:port]` | Abilita l'agente inspector; Associa all'indirizzo o al nome host (predefinito: 127.0.0.1); Ascolta sulla porta (predefinita: 9229); Attendi che venga collegato un debugger. |
| `node inspect script.js` | Genera un processo figlio per eseguire lo script dell'utente con il flag --inspect; e utilizza il processo principale per eseguire il debugger CLI. |
| `node inspect --port=xxxx script.js` | Genera un processo figlio per eseguire lo script dell'utente con il flag --inspect; e utilizza il processo principale per eseguire il debugger CLI. Ascolta sulla porta (predefinita: 9229) |


## Abilitazione di scenari di debug remoto

Raccomandiamo di non fare mai in modo che il debugger ascolti su un indirizzo IP pubblico. Se è necessario consentire connessioni di debug remoto, raccomandiamo invece l'uso di tunnel ssh. Forniamo il seguente esempio solo a scopo illustrativo. Si prega di comprendere il rischio per la sicurezza di consentire l'accesso remoto a un servizio privilegiato prima di procedere.

Supponiamo che tu stia eseguendo Node.js su una macchina remota, remote.example.com, che desideri poter eseguire il debug. Su quella macchina, dovresti avviare il processo node con l'inspector che ascolta solo su localhost (l'impostazione predefinita).

```bash
node --inspect app.js
```

Ora, sulla tua macchina locale da cui desideri avviare una connessione client di debug, puoi impostare un tunnel ssh:

```bash
ssh -L 9225:localhost:9229 remote.example.com
```

Questo avvia una sessione di tunnel ssh in cui una connessione alla porta 9221 sulla tua macchina locale verrà inoltrata alla porta 9229 su remote.example.com. Ora puoi collegare un debugger come Chrome DevTools o Visual Studio Code a localhost:9221, che dovrebbe essere in grado di eseguire il debug come se l'applicazione Node.js fosse in esecuzione localmente.

## Debugger Legacy

**Il debugger legacy è stato deprecato a partire da Node.js 7.7.0. Si prega di utilizzare --inspect e Inspector invece.**

Quando avviato con gli switch `--debug` o `--debug-brk` nella versione 7 e precedenti, Node.js è in ascolto di comandi di debug definiti dal protocollo di debug V8 obsoleto su una porta TCP, per impostazione predefinita `5858`. Qualsiasi client debugger che parla questo protocollo può connettersi e eseguire il debug del processo in esecuzione; un paio di quelli popolari sono elencati di seguito.

Il protocollo di debug V8 non è più mantenuto o documentato.

### Debugger Integrato

Avvia `node debug script_name.js` per avviare il tuo script sotto il debugger a riga di comando integrato. Il tuo script viene avviato in un altro processo Node.js avviato con l'opzione `--debug-brk`, e il processo Node.js iniziale esegue lo script `_debugger.js` e si connette al tuo target. Consulta [docs](/it/nodejs/api/debugger) per maggiori informazioni.


### node-inspector

Debugga la tua app Node.js con Chrome DevTools utilizzando un processo intermedio che traduce il [Protocollo dell'ispettore](https://chromedevtools.github.io/debugger-protocol-viewer/v8/) utilizzato in Chromium nel protocollo V8 Debugger utilizzato in Node.js. Vedi [https://github.com/node-inspector/node-inspector](https://github.com/node-inspector/node-inspector) per maggiori informazioni.

