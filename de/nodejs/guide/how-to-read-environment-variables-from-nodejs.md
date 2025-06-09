---
title: So lesen Sie Umgebungsvariablen in Node.js
description: Erfahren Sie, wie Sie Umgebungsvariablen in Node.js mit der Eigenschaft process.env und .env-Dateien zugreifen.
head:
  - - meta
    - name: og:title
      content: So lesen Sie Umgebungsvariablen in Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Erfahren Sie, wie Sie Umgebungsvariablen in Node.js mit der Eigenschaft process.env und .env-Dateien zugreifen.
  - - meta
    - name: twitter:title
      content: So lesen Sie Umgebungsvariablen in Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Erfahren Sie, wie Sie Umgebungsvariablen in Node.js mit der Eigenschaft process.env und .env-Dateien zugreifen.
---


# Wie man Umgebungsvariablen von Node.js liest

Das Prozesskernmodul von Node.js stellt die `env`-Eigenschaft bereit, die alle Umgebungsvariablen enthält, die zum Zeitpunkt des Prozessstarts gesetzt wurden.

Der folgende Code führt `app.js` aus und setzt `USER_ID` und `USER_KEY`.

```bash
USER_ID=239482 USER_KEY=foobar node app.js
```

Dadurch wird der Benutzer `USER_ID` als 239482 und der `USER_KEY` als foobar übergeben. Dies ist für Tests geeignet, aber für die Produktion konfigurieren Sie wahrscheinlich einige Bash-Skripte, um Variablen zu exportieren.

::: tip HINWEIS
`process` benötigt kein `"require"`, es ist automatisch verfügbar.
:::

Hier ist ein Beispiel, das auf die Umgebungsvariablen `USER_ID` und `USER_KEY` zugreift, die wir im obigen Code gesetzt haben.

```javascript
process.env.USER_ID; // "239482
process.env.USER_KEY; // "foobar
```

Auf die gleiche Weise können Sie auf jede benutzerdefinierte Umgebungsvariable zugreifen, die Sie gesetzt haben. Node.js 20 führte experimentelle [Unterstützung für .env-Dateien](/de/nodejs/api/cli#env-file-config) ein.

Jetzt können Sie das Flag `--env-file` verwenden, um eine Umgebungsdatei anzugeben, wenn Sie Ihre Node.js-Anwendung ausführen. Hier ist ein Beispiel für eine `.env`-Datei und wie Sie mit `process.env` auf ihre Variablen zugreifen können.

```bash
.env Datei
PORT=3000
```

In Ihrer js-Datei

```javascript
process.env.PORT; // 3000
```

Führen Sie die Datei `app.js` mit Umgebungsvariablen aus, die in der Datei `.env` gesetzt sind.

```js
node --env-file=.env app.js
```

Dieser Befehl lädt alle Umgebungsvariablen aus der Datei `.env` und stellt sie der Anwendung unter `process.env` zur Verfügung. Außerdem können Sie mehrere `--env-file`-Argumente übergeben. Nachfolgende Dateien überschreiben bereits vorhandene Variablen, die in vorherigen Dateien definiert wurden.

```bash
node --env-file=.env --env-file=.development.env app.js
```
::: tip HINWEIS
Wenn dieselbe Variable in der Umgebung und in der Datei definiert ist, hat der Wert aus der Umgebung Vorrang.
:::

