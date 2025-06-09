---
title: Node.js Dokumentation
description: Erkunden Sie die umfassende Dokumentation von Node.js, die APIs, Module und Nutzungsbeispiele abdeckt, um Entwicklern zu helfen, Node.js effektiv zu verstehen und zu nutzen.
head:
  - - meta
    - name: og:title
      content: Node.js Dokumentation | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Erkunden Sie die umfassende Dokumentation von Node.js, die APIs, Module und Nutzungsbeispiele abdeckt, um Entwicklern zu helfen, Node.js effektiv zu verstehen und zu nutzen.
  - - meta
    - name: twitter:title
      content: Node.js Dokumentation | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Erkunden Sie die umfassende Dokumentation von Node.js, die APIs, Module und Nutzungsbeispiele abdeckt, um Entwicklern zu helfen, Node.js effektiv zu verstehen und zu nutzen.
---


# Über diese Dokumentation {#about-this-documentation}

Willkommen zur offiziellen API-Referenzdokumentation für Node.js!

Node.js ist eine JavaScript-Laufzeitumgebung, die auf der [V8 JavaScript Engine](https://v8.dev/) basiert.

## Mitwirken {#contributing}

Melden Sie Fehler in dieser Dokumentation im [Issue Tracker](https://github.com/nodejs/node/issues/new). Im [Leitfaden für Mitwirkende](https://github.com/nodejs/node/blob/HEAD/CONTRIBUTING.md) finden Sie Anweisungen zum Einreichen von Pull Requests.

## Stabilitätsindex {#stability-index}

In der gesamten Dokumentation gibt es Hinweise auf die Stabilität eines Abschnitts. Einige APIs sind so bewährt und werden so stark genutzt, dass es unwahrscheinlich ist, dass sie sich jemals ändern werden. Andere sind brandneu und experimentell oder als gefährlich bekannt.

Die Stabilitätsindizes sind wie folgt:

::: danger [Stabil: 0 - Veraltet]
[Stabil: 0](/de/nodejs/api/documentation#stability-index) Stabilität: 0 - Veraltet. Das Feature kann Warnungen ausgeben. Die Abwärtskompatibilität ist nicht garantiert.
:::

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) Stabilität: 1 - Experimentell. Das Feature unterliegt nicht den Regeln der [semantischen Versionierung](https://semver.org/). Nicht abwärtskompatible Änderungen oder Entfernungen können in zukünftigen Versionen auftreten. Die Verwendung des Features in Produktionsumgebungen wird nicht empfohlen.
:::

::: tip [Stabil: 2 - Stabil]
[Stabil: 2](/de/nodejs/api/documentation#stability-index) Stabilität: 2 - Stabil. Die Kompatibilität mit dem npm-Ökosystem hat hohe Priorität.
:::

::: info [Stabil: 3 - Legacy]
[Stabil: 3](/de/nodejs/api/documentation#stability-index) Stabilität: 3 - Legacy. Obwohl dieses Feature wahrscheinlich nicht entfernt wird und weiterhin durch semantische Versionsgarantien abgedeckt ist, wird es nicht mehr aktiv gewartet, und es sind andere Alternativen verfügbar.
:::

Funktionen werden als Legacy und nicht als veraltet gekennzeichnet, wenn ihre Verwendung keinen Schaden anrichtet und sie im npm-Ökosystem weit verbreitet sind. Fehler, die in Legacy-Funktionen gefunden werden, werden wahrscheinlich nicht behoben.

Seien Sie vorsichtig, wenn Sie experimentelle Funktionen verwenden, insbesondere wenn Sie Bibliotheken erstellen. Benutzer sind sich möglicherweise nicht bewusst, dass experimentelle Funktionen verwendet werden. Fehler oder Verhaltensänderungen können Benutzer überraschen, wenn experimentelle API-Änderungen auftreten. Um Überraschungen zu vermeiden, benötigt die Verwendung einer experimentellen Funktion möglicherweise ein Befehlszeilen-Flag. Experimentelle Funktionen können auch eine [Warnung](/de/nodejs/api/process#event-warning) ausgeben.


## Stabilitätsübersicht {#stability-overview}

| API | Stabilität |
| --- | --- |
| [Assert](/de/nodejs/api/assert) |<div class="custom-block tip"> (2) Stabil </div>|
| [Asynchrone Hooks](/de/nodejs/api/async_hooks) |<div class="custom-block warning"> (1) Experimentell </div>|
| [Asynchrone Kontextverfolgung](/de/nodejs/api/async_context) |<div class="custom-block tip"> (2) Stabil </div>|
| [Buffer](/de/nodejs/api/buffer) |<div class="custom-block tip"> (2) Stabil </div>|
| [Kindprozess](/de/nodejs/api/child_process) |<div class="custom-block tip"> (2) Stabil </div>|
| [Cluster](/de/nodejs/api/cluster) |<div class="custom-block tip"> (2) Stabil </div>|
| [Konsole](/de/nodejs/api/console) |<div class="custom-block tip"> (2) Stabil </div>|
| [Krypto](/de/nodejs/api/crypto) |<div class="custom-block tip"> (2) Stabil </div>|
| [Diagnosekanal](/de/nodejs/api/diagnostics_channel) |<div class="custom-block tip"> (2) Stabil </div>|
| [DNS](/de/nodejs/api/dns) |<div class="custom-block tip"> (2) Stabil </div>|
| [Domain](/de/nodejs/api/domain) |<div class="custom-block danger"> (0) Veraltet </div>|
| [Dateisystem](/de/nodejs/api/fs) |<div class="custom-block tip"> (2) Stabil </div>|
| [HTTP](/de/nodejs/api/http) |<div class="custom-block tip"> (2) Stabil </div>|
| [HTTP/2](/de/nodejs/api/http2) |<div class="custom-block tip"> (2) Stabil </div>|
| [HTTPS](/de/nodejs/api/https) |<div class="custom-block tip"> (2) Stabil </div>|
| [Inspektor](/de/nodejs/api/inspector) |<div class="custom-block tip"> (2) Stabil </div>|
| [Module: `node:module` API](/de/nodejs/api/module) |<div class="custom-block warning"> (1) .2 - Release Candidate (asynchrone Version) Stabilität: 1.1 - Aktive Entwicklung (synchrone Version) </div>|
| [Module: CommonJS-Module](/de/nodejs/api/modules) |<div class="custom-block tip"> (2) Stabil </div>|
| [Module: TypeScript](/de/nodejs/api/typescript) |<div class="custom-block warning"> (1) .1 - Aktive Entwicklung </div>|
| [OS](/de/nodejs/api/os) |<div class="custom-block tip"> (2) Stabil </div>|
| [Pfad](/de/nodejs/api/path) |<div class="custom-block tip"> (2) Stabil </div>|
| [APIs zur Leistungsmessung](/de/nodejs/api/perf_hooks) |<div class="custom-block tip"> (2) Stabil </div>|
| [Punycode](/de/nodejs/api/punycode) |<div class="custom-block danger"> (0) Veraltet </div>|
| [Query-String](/de/nodejs/api/querystring) |<div class="custom-block tip"> (2) Stabil </div>|
| [Readline](/de/nodejs/api/readline) |<div class="custom-block tip"> (2) Stabil </div>|
| [REPL](/de/nodejs/api/repl) |<div class="custom-block tip"> (2) Stabil </div>|
| [Einzelne ausführbare Anwendungen](/de/nodejs/api/single-executable-applications) |<div class="custom-block warning"> (1) .1 - Aktive Entwicklung </div>|
| [SQLite](/de/nodejs/api/sqlite) |<div class="custom-block warning"> (1) .1 - Aktive Entwicklung. </div>|
| [Stream](/de/nodejs/api/stream) |<div class="custom-block tip"> (2) Stabil </div>|
| [String Decoder](/de/nodejs/api/string_decoder) |<div class="custom-block tip"> (2) Stabil </div>|
| [Test Runner](/de/nodejs/api/test) |<div class="custom-block tip"> (2) Stabil </div>|
| [Timer](/de/nodejs/api/timers) |<div class="custom-block tip"> (2) Stabil </div>|
| [TLS (SSL)](/de/nodejs/api/tls) |<div class="custom-block tip"> (2) Stabil </div>|
| [Trace-Events](/de/nodejs/api/tracing) |<div class="custom-block warning"> (1) Experimentell </div>|
| [TTY](/de/nodejs/api/tty) |<div class="custom-block tip"> (2) Stabil </div>|
| [UDP/Datagram-Sockets](/de/nodejs/api/dgram) |<div class="custom-block tip"> (2) Stabil </div>|
| [URL](/de/nodejs/api/url) |<div class="custom-block tip"> (2) Stabil </div>|
| [Util](/de/nodejs/api/util) |<div class="custom-block tip"> (2) Stabil </div>|
| [VM (JavaScript ausführen)](/de/nodejs/api/vm) |<div class="custom-block tip"> (2) Stabil </div>|
| [Web Crypto API](/de/nodejs/api/webcrypto) |<div class="custom-block tip"> (2) Stabil </div>|
| [Web Streams API](/de/nodejs/api/webstreams) |<div class="custom-block tip"> (2) Stabil </div>|
| [WebAssembly System Interface (WASI)](/de/nodejs/api/wasi) |<div class="custom-block warning"> (1) Experimentell </div>|
| [Worker-Threads](/de/nodejs/api/worker_threads) |<div class="custom-block tip"> (2) Stabil </div>|
| [Zlib](/de/nodejs/api/zlib) |<div class="custom-block tip"> (2) Stabil </div>|


## JSON-Ausgabe {#json-output}

**Hinzugefügt in: v0.6.12**

Jedes `.html`-Dokument hat ein entsprechendes `.json`-Dokument. Dies ist für IDEs und andere Dienstprogramme, die die Dokumentation nutzen.

## Systemaufrufe und Manpages {#system-calls-and-man-pages}

Node.js-Funktionen, die einen Systemaufruf umschließen, dokumentieren dies. Die Dokumente verlinken auf die entsprechenden Manpages, die beschreiben, wie der Systemaufruf funktioniert.

Die meisten Unix-Systemaufrufe haben Windows-Analoga. Dennoch können Verhaltensunterschiede unvermeidlich sein.

