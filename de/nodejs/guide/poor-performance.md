---
title: Optimierung der Node.js-Leistung
description: Erfahren Sie, wie Sie einen Node.js-Prozess analysieren können, um Leistungsbottlenecks zu identifizieren und den Code für eine bessere Effizienz und Benutzererfahrung zu optimieren.
head:
  - - meta
    - name: og:title
      content: Optimierung der Node.js-Leistung | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Erfahren Sie, wie Sie einen Node.js-Prozess analysieren können, um Leistungsbottlenecks zu identifizieren und den Code für eine bessere Effizienz und Benutzererfahrung zu optimieren.
  - - meta
    - name: twitter:title
      content: Optimierung der Node.js-Leistung | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Erfahren Sie, wie Sie einen Node.js-Prozess analysieren können, um Leistungsbottlenecks zu identifizieren und den Code für eine bessere Effizienz und Benutzererfahrung zu optimieren.
---


# Schlechte Leistung
In diesem Dokument erfahren Sie, wie Sie einen Node.js-Prozess profilieren können.

## Meine Anwendung hat eine schlechte Leistung

### Symptome

Die Latenz meiner Anwendung ist hoch und ich habe bereits bestätigt, dass der Engpass nicht in meinen Abhängigkeiten wie Datenbanken und nachgelagerten Diensten liegt. Daher vermute ich, dass meine Anwendung viel Zeit damit verbringt, Code auszuführen oder Informationen zu verarbeiten.

Sie sind im Allgemeinen mit der Leistung Ihrer Anwendung zufrieden, möchten aber verstehen, welcher Teil unserer Anwendung verbessert werden kann, um schneller oder effizienter zu laufen. Dies kann nützlich sein, wenn wir die Benutzererfahrung verbessern oder Rechenkosten sparen wollen.

### Debugging
In diesem Anwendungsfall sind wir an Code-Abschnitten interessiert, die mehr CPU-Zyklen verbrauchen als andere. Wenn wir dies lokal tun, versuchen wir normalerweise, unseren Code zu optimieren. [Die Verwendung des V8 Sampling Profilers](/de/nodejs/guide/profiling-nodejs-applications) kann uns dabei helfen.

