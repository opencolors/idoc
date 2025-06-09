---
title: Live-Debugging in Node.js
description: Erfahren Sie, wie Sie einen Node.js-Prozess live debuggen können, um Probleme mit der Anwendungslogik und -korrektheit zu identifizieren und zu beheben.
head:
  - - meta
    - name: og:title
      content: Live-Debugging in Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Erfahren Sie, wie Sie einen Node.js-Prozess live debuggen können, um Probleme mit der Anwendungslogik und -korrektheit zu identifizieren und zu beheben.
  - - meta
    - name: twitter:title
      content: Live-Debugging in Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Erfahren Sie, wie Sie einen Node.js-Prozess live debuggen können, um Probleme mit der Anwendungslogik und -korrektheit zu identifizieren und zu beheben.
---


# Live-Debugging

In diesem Dokument erfahren Sie, wie Sie einen Node.js-Prozess live debuggen können.

## Meine Anwendung verhält sich nicht wie erwartet

### Symptome

Der Benutzer stellt möglicherweise fest, dass die Anwendung nicht die erwartete Ausgabe für bestimmte Eingaben liefert, z. B. ein HTTP-Server eine JSON-Antwort zurückgibt, in der bestimmte Felder leer sind. Im Prozess können verschiedene Dinge schiefgehen, aber in diesem Anwendungsfall konzentrieren wir uns hauptsächlich auf die Anwendungslogik und ihre Korrektheit.

### Debugging

In diesem Anwendungsfall möchte der Benutzer den Codepfad verstehen, den unsere Anwendung für einen bestimmten Auslöser wie eine eingehende HTTP-Anfrage ausführt. Möglicherweise möchten sie auch den Code schrittweise durchgehen und die Ausführung steuern sowie die Werte der Variablen im Speicher überprüfen. Zu diesem Zweck können wir beim Starten der Anwendung das Flag `--inspect` verwenden. Debugging-Dokumentationen finden Sie [hier](/de/nodejs/guide/debugging-nodejs).

