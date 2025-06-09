---
title: Node.js-Debugging
description: Node.js-Debugging-Optionen, einschließlich --inspect, --inspect-brk und --debug, sowie Remote-Debugging-Szenarien und Informationen zum Legacy-Debugger.
head:
  - - meta
    - name: og:title
      content: Node.js-Debugging | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js-Debugging-Optionen, einschließlich --inspect, --inspect-brk und --debug, sowie Remote-Debugging-Szenarien und Informationen zum Legacy-Debugger.
  - - meta
    - name: twitter:title
      content: Node.js-Debugging | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js-Debugging-Optionen, einschließlich --inspect, --inspect-brk und --debug, sowie Remote-Debugging-Szenarien und Informationen zum Legacy-Debugger.
---


# Node.js Debugging

Dieser Leitfaden hilft Ihnen, mit dem Debuggen Ihrer Node.js-Apps und -Skripte zu beginnen.

## Inspector aktivieren

Wenn ein Node.js-Prozess mit dem Schalter `--inspect` gestartet wird, lauscht er auf einen Debugging-Client. Standardmäßig lauscht er auf Host und Port `127.0.0.1:9229`. Jedem Prozess wird auch eine eindeutige UUID zugewiesen.

Inspector-Clients müssen Hostadresse, Port und UUID kennen und angeben, um sich zu verbinden. Eine vollständige URL sieht in etwa so aus: `ws://127.0.0.1:9229/0f2c936f-b1cd-4ac9-aab3-f63b0f33d55e`.

Node.js beginnt auch mit dem Lauschen auf Debugging-Nachrichten, wenn es ein `SIGUSR1`-Signal empfängt. (`SIGUSR1` ist unter Windows nicht verfügbar.) In Node.js 7 und früher aktiviert dies die ältere Debugger-API. In Node.js 8 und später wird die Inspector-API aktiviert.

## Sicherheitsimplikationen

Da der Debugger vollen Zugriff auf die Node.js-Ausführungsumgebung hat, kann ein böswilliger Akteur, der sich mit diesem Port verbinden kann, möglicherweise beliebigen Code im Namen des Node.js-Prozesses ausführen. Es ist wichtig, die Sicherheitsimplikationen der Bereitstellung des Debugger-Ports in öffentlichen und privaten Netzwerken zu verstehen.

### Die öffentliche Bereitstellung des Debug-Ports ist unsicher

Wenn der Debugger an eine öffentliche IP-Adresse oder an 0.0.0.0 gebunden ist, können sich alle Clients, die Ihre IP-Adresse erreichen können, ohne Einschränkung mit dem Debugger verbinden und beliebigen Code ausführen.

Standardmäßig bindet `node --inspect` an 127.0.0.1. Sie müssen explizit eine öffentliche IP-Adresse oder 0.0.0.0 usw. angeben, wenn Sie externe Verbindungen zum Debugger zulassen möchten. Dies kann Sie einer potenziell erheblichen Sicherheitsbedrohung aussetzen. Wir empfehlen Ihnen, sicherzustellen, dass geeignete Firewalls und Zugriffskontrollen vorhanden sind, um eine Sicherheitsgefährdung zu verhindern.

Im Abschnitt '[Aktivieren von Remote-Debugging-Szenarien](/de/nodejs/guide/debugging-nodejs#enabling-remote-debugging-scenarios)' finden Sie einige Ratschläge, wie Sie Remote-Debugger-Clients sicher verbinden können.

### Lokale Anwendungen haben vollen Zugriff auf den Inspector

Selbst wenn Sie den Inspector-Port an 127.0.0.1 (Standard) binden, haben alle Anwendungen, die lokal auf Ihrem Computer ausgeführt werden, uneingeschränkten Zugriff. Dies ist so konzipiert, dass sich lokale Debugger bequem verbinden können.


### Browser, WebSockets und Same-Origin-Policy

Webseiten, die in einem Webbrowser geöffnet werden, können unter dem Sicherheitsmodell des Browsers WebSocket- und HTTP-Anfragen stellen. Eine anfängliche HTTP-Verbindung ist erforderlich, um eine eindeutige Debugger-Sitzungs-ID zu erhalten. Die Same-Origin-Policy verhindert, dass Webseiten diese HTTP-Verbindung herstellen können. Für zusätzliche Sicherheit gegen [DNS-Rebinding-Angriffe](https://en.wikipedia.org/wiki/DNS_rebinding) überprüft Node.js, ob die 'Host'-Header für die Verbindung entweder eine IP-Adresse oder genau `localhost` angeben.

Diese Sicherheitsrichtlinien untersagen die Verbindung zu einem Remote-Debug-Server durch Angabe des Hostnamens. Sie können diese Einschränkung umgehen, indem Sie entweder die IP-Adresse angeben oder SSH-Tunnel verwenden, wie unten beschrieben.

## Inspector-Clients

Ein minimaler CLI-Debugger ist mit `node inspect myscript.js` verfügbar. Verschiedene kommerzielle und Open-Source-Tools können sich ebenfalls mit dem Node.js Inspector verbinden.

### Chrome DevTools 55+, Microsoft Edge
+ **Option 1**: Öffnen Sie `chrome://inspect` in einem Chromium-basierten Browser oder `edge://inspect` in Edge. Klicken Sie auf die Schaltfläche "Konfigurieren" und stellen Sie sicher, dass Ihr Zielhost und -port aufgeführt sind.
+ **Option 2**: Kopieren Sie die `devtoolsFrontendUrl` aus der Ausgabe von `/json/list` (siehe oben) oder dem `--inspect`-Hinweis und fügen Sie sie in Chrome ein.

Weitere Informationen finden Sie unter [https://github.com/ChromeDevTools/devtools-frontend](https://github.com/ChromeDevTools/devtools-frontend), [https://www.microsoftedgeinsider.com](https://www.microsoftedgeinsider.com).

### Visual Studio Code 1.10+
+ Klicken Sie im Debug-Panel auf das Einstellungssymbol, um `.vscode/launch.json` zu öffnen. Wählen Sie für die Ersteinrichtung "Node.js" aus.

Weitere Informationen finden Sie unter [https://github.com/microsoft/vscode](https://github.com/microsoft/vscode).

### JetBrains WebStorm und andere JetBrains IDEs

+ Erstellen Sie eine neue Node.js-Debugkonfiguration und klicken Sie auf Debuggen. `--inspect` wird standardmäßig für Node.js 7+ verwendet. Um dies zu deaktivieren, deaktivieren Sie `js.debugger.node.use.inspect` in der IDE-Registry. Um mehr über das Ausführen und Debuggen von Node.js in WebStorm und anderen JetBrains IDEs zu erfahren, lesen Sie die [WebStorm-Online-Hilfe](https://www.jetbrains.com/help/webstorm/running-and-debugging-node-js.html).


### chrome-remote-interface

+ Bibliothek zur Vereinfachung von Verbindungen zu [Inspector Protocol](https://chromedevtools.github.io/debugger-protocol-viewer/v8/)-Endpunkten.
Weitere Informationen finden Sie unter [https://github.com/cyrus-and/chrome-remote-interface](https://github.com/cyrus-and/chrome-remote-interface).

### Gitpod

+ Starten Sie eine Node.js-Debugkonfiguration aus der `Debug`-Ansicht oder drücken Sie `F5`. Detaillierte Anweisungen

Weitere Informationen finden Sie unter [https://www.gitpod.io](https://www.gitpod.io).

### Eclipse IDE mit Eclipse Wild Web Developer Erweiterung

+ Wählen Sie in einer `.js`-Datei `Debug As... > Node program` oder erstellen Sie eine Debug-Konfiguration, um den Debugger an eine laufende Node.js-Anwendung anzuhängen (bereits mit `--inspect` gestartet).

Weitere Informationen finden Sie unter [https://eclipse.org/eclipseide](https://eclipse.org/eclipseide).

## Befehlszeilenoptionen

Die folgende Tabelle listet die Auswirkungen verschiedener Runtime-Flags auf das Debuggen auf:

| Flag | Bedeutung |
| --- | --- |
| `--inspect` | Aktiviert das Debuggen mit dem Node.js Inspector. Lauschen an der Standardadresse und dem Standardport (127.0.0.1:9229) |
| `--inspect-brk` | Aktiviert das Debuggen mit dem Node.js Inspector. Lauschen an der Standardadresse und dem Standardport (127.0.0.1:9229); Stoppt, bevor der Benutzercode startet|
| `--inspect=[host:port]` | Aktiviert den Inspector-Agenten; Bindet an die Adresse oder den Hostnamen Host (Standard: 127.0.0.1); Lauschen am Port Port (Standard: 9229) |
| `--inspect-brk=[host:port]` | Aktiviert den Inspector-Agenten; Bindet an die Adresse oder den Hostnamen Host (Standard: 127.0.0.1); Lauschen am Port Port (Standard: 9229); Stoppt, bevor der Benutzercode startet |
| `--inspect-wait` | Aktiviert den Inspector-Agenten; Lauschen an der Standardadresse und dem Standardport (127.0.0.1:9229); Wartet, bis der Debugger angehängt wird. |
| `--inspect-wait=[host:port]` | Aktiviert den Inspector-Agenten; Bindet an die Adresse oder den Hostnamen Host (Standard: 127.0.0.1); Lauschen am Port Port (Standard: 9229); Wartet, bis der Debugger angehängt wird. |
| `node inspect script.js` | Erzeugt einen Child-Prozess, um das Skript des Benutzers mit dem --inspect-Flag auszuführen; und verwendet den Hauptprozess, um den CLI-Debugger auszuführen. |
| `node inspect --port=xxxx script.js` | Erzeugt einen Child-Prozess, um das Skript des Benutzers mit dem --inspect-Flag auszuführen; und verwendet den Hauptprozess, um den CLI-Debugger auszuführen. Lauschen am Port Port (Standard: 9229) |


## Aktivieren von Remote-Debugging-Szenarien

Wir empfehlen, den Debugger niemals auf einer öffentlichen IP-Adresse lauschen zu lassen. Wenn Sie Remote-Debugging-Verbindungen zulassen müssen, empfehlen wir stattdessen die Verwendung von SSH-Tunneln. Das folgende Beispiel dient nur zur Veranschaulichung. Bitte verstehen Sie das Sicherheitsrisiko, das mit der Gewährung von Fernzugriff auf einen privilegierten Dienst verbunden ist, bevor Sie fortfahren.

Nehmen wir an, Sie führen Node.js auf einem Remote-Rechner, remote.example.com, aus, den Sie debuggen möchten. Auf diesem Rechner sollten Sie den Node-Prozess mit dem Inspector starten, der nur auf localhost (Standard) lauscht.

```bash
node --inspect app.js
```

Nun können Sie auf Ihrem lokalen Rechner, von dem aus Sie eine Debug-Client-Verbindung initiieren möchten, einen SSH-Tunnel einrichten:

```bash
ssh -L 9225:localhost:9229 remote.example.com
```

Dies startet eine SSH-Tunnel-Sitzung, in der eine Verbindung zu Port 9225 auf Ihrem lokalen Rechner an Port 9229 auf remote.example.com weitergeleitet wird. Sie können nun einen Debugger wie Chrome DevTools oder Visual Studio Code an localhost:9225 anhängen, der in der Lage sein sollte, zu debuggen, als ob die Node.js-Anwendung lokal ausgeführt würde.

## Legacy Debugger

**Der Legacy Debugger ist seit Node.js 7.7.0 veraltet. Bitte verwenden Sie stattdessen --inspect und Inspector.**

Wenn Node.js mit den Schaltern `--debug` oder `--debug-brk` in Version 7 und früher gestartet wurde, lauscht er auf einem TCP-Port, standardmäßig `5858`, auf Debugging-Befehle, die durch das eingestellte V8 Debugging Protocol definiert sind. Jeder Debugger-Client, der dieses Protokoll spricht, kann sich mit dem laufenden Prozess verbinden und ihn debuggen; ein paar beliebte sind unten aufgeführt.

Das V8 Debugging Protocol wird nicht mehr gepflegt oder dokumentiert.

### Eingebauter Debugger

Starten Sie `node debug script_name.js`, um Ihr Skript unter dem eingebauten Kommandozeilen-Debugger zu starten. Ihr Skript startet in einem anderen Node.js-Prozess, der mit der Option `--debug-brk` gestartet wurde, und der erste Node.js-Prozess führt das Skript `_debugger.js` aus und verbindet sich mit Ihrem Ziel. Weitere Informationen finden Sie in den [docs](/de/nodejs/api/debugger).


### node-inspector

Debuggen Sie Ihre Node.js-Anwendung mit den Chrome DevTools, indem Sie einen Vermittlungsprozess verwenden, der das im Chromium verwendete [Inspector Protocol](https://chromedevtools.github.io/debugger-protocol-viewer/v8/) in das in Node.js verwendete V8 Debugger-Protokoll übersetzt. Weitere Informationen finden Sie unter [https://github.com/node-inspector/node-inspector](https://github.com/node-inspector/node-inspector).

