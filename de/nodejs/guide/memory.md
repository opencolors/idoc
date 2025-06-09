---
title: Fehlerbehebung bei Speicherproblemen in Node.js
description: Erfahren Sie, wie Sie Speicherprobleme in Node.js-Anwendungen identifizieren und beheben, einschließlich Speicherlecks und ineffizientem Speicherverbrauch.
head:
  - - meta
    - name: og:title
      content: Fehlerbehebung bei Speicherproblemen in Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Erfahren Sie, wie Sie Speicherprobleme in Node.js-Anwendungen identifizieren und beheben, einschließlich Speicherlecks und ineffizientem Speicherverbrauch.
  - - meta
    - name: twitter:title
      content: Fehlerbehebung bei Speicherproblemen in Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Erfahren Sie, wie Sie Speicherprobleme in Node.js-Anwendungen identifizieren und beheben, einschließlich Speicherlecks und ineffizientem Speicherverbrauch.
---


# Speicher

In diesem Dokument erfahren Sie, wie Sie Speicherprobleme debuggen können.

## Mein Prozess hat nicht genügend Speicher

Node.js (*JavaScript*) ist eine Garbage-Collected-Sprache, daher sind Speicherlecks durch Retainer möglich. Da Node.js-Anwendungen in der Regel Multi-Tenant-, geschäftskritisch und langlebig sind, ist es wichtig, eine zugängliche und effiziente Möglichkeit zum Auffinden eines Speicherlecks bereitzustellen.

### Symptome

Der Benutzer beobachtet eine kontinuierlich steigende Speichernutzung (*kann schnell oder langsam sein, über Tage oder sogar Wochen*) und sieht dann, wie der Prozess abstürzt und vom Prozessmanager neu gestartet wird. Der Prozess läuft möglicherweise langsamer als zuvor und die Neustarts führen dazu, dass einige Anfragen fehlschlagen (*Load Balancer antwortet mit 502*).

### Nebenwirkungen

- Prozessneustarts aufgrund von Speichererschöpfung und Anfragen gehen verloren
- Erhöhte GC-Aktivität führt zu höherer CPU-Auslastung und langsameren Antwortzeiten
    - GC blockiert die Event Loop und verursacht Verlangsamung
- Erhöhtes Speicherswapping verlangsamt den Prozess (GC-Aktivität)
- Möglicherweise nicht genügend verfügbarer Speicher, um einen Heap-Snapshot zu erhalten

## Mein Prozess nutzt Speicher ineffizient

### Symptome

Die Anwendung verbraucht eine unerwartete Menge an Speicher und/oder wir beobachten eine erhöhte Garbage Collector-Aktivität.

### Nebenwirkungen

- Eine erhöhte Anzahl von Page Faults
- Höhere GC-Aktivität und CPU-Auslastung

