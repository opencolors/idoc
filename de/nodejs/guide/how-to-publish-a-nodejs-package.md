---
title: Veröffentlichung eines Node-API-Pakets
description: Erfahren Sie, wie Sie eine Node-API-Version eines Pakets neben einer nicht-Node-API-Version veröffentlichen und wie Sie eine Abhängigkeit von einer Node-API-Version eines Pakets einfügen.
head:
  - - meta
    - name: og:title
      content: Veröffentlichung eines Node-API-Pakets | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Erfahren Sie, wie Sie eine Node-API-Version eines Pakets neben einer nicht-Node-API-Version veröffentlichen und wie Sie eine Abhängigkeit von einer Node-API-Version eines Pakets einfügen.
  - - meta
    - name: twitter:title
      content: Veröffentlichung eines Node-API-Pakets | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Erfahren Sie, wie Sie eine Node-API-Version eines Pakets neben einer nicht-Node-API-Version veröffentlichen und wie Sie eine Abhängigkeit von einer Node-API-Version eines Pakets einfügen.
---


# So veröffentlichen Sie ein Node-API-Paket

## So veröffentlichen Sie eine Node-API-Version eines Pakets neben einer Nicht-Node-API-Version

Die folgenden Schritte werden am Beispiel des Pakets `iotivity-node` veranschaulicht:

- Veröffentlichen Sie zuerst die Nicht-Node-API-Version:
    - Aktualisieren Sie die Version in `package.json`. Für `iotivity-node` wird die Version 1.2.0-2.
    - Gehen Sie die Release-Checkliste durch (stellen Sie sicher, dass Tests/Demos/Dokumente in Ordnung sind).
    - `npm publish`.

- Veröffentlichen Sie dann die Node-API-Version:
    - Aktualisieren Sie die Version in `package.json`. Im Fall von `iotivity-node` wird die Version 1.2.0-3. Für die Versionsverwaltung empfehlen wir, dem Vorabversionsschema zu folgen, das unter [semver.org](https://semver.org) beschrieben ist, z. B. 1.2.0-napi.
    - Gehen Sie die Release-Checkliste durch (stellen Sie sicher, dass Tests/Demos/Dokumente in Ordnung sind).
    - `npm publish --tag n-api`.

In diesem Beispiel hat das Taggen des Releases mit `n-api` sichergestellt, dass, obwohl Version 1.2.0-3 später als die veröffentlichte Nicht-Node-API-Version (1.2.0-2) ist, sie nicht installiert wird, wenn jemand `iotivity-node` durch einfaches Ausführen von `npm install iotivity-node` installiert. Dadurch wird standardmäßig die Nicht-Node-API-Version installiert. Der Benutzer muss `npm install iotivity-node@n api` ausführen, um die Node-API-Version zu erhalten. Weitere Informationen zur Verwendung von Tags mit npm finden Sie unter "Using dist-tags".

## So führen Sie eine Abhängigkeit von einer Node-API-Version eines Pakets ein

Um die Node-API-Version von `iotivity-node` als Abhängigkeit hinzuzufügen, sieht die `package.json` wie folgt aus:

```json
"dependencies": {
  "iotivity-node": "n-api"
}
```

Wie in "Using dist-tags" erläutert, können getaggte Versionen im Gegensatz zu regulären Versionen nicht durch Versionsbereiche wie `"^2.0.0"` innerhalb von `package.json` adressiert werden. Der Grund dafür ist, dass sich das Tag auf genau eine Version bezieht. Wenn der Paketbetreuer also beschließt, eine spätere Version des Pakets mit demselben Tag zu versehen, erhält `npm update` die spätere Version. Dies sollte eine akzeptable Version sein. Wenn es sich um eine andere Version als die zuletzt veröffentlichte handelt, muss sich die `package.json`-Abhängigkeit auf die genaue Version wie folgt beziehen:

```json
"dependencies": {
  "iotivity-node": "1.2.0-3"
}
```
