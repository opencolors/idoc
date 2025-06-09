---
title: Einzelne ausführbare Anwendungen mit Node.js
description: Erfahren Sie, wie Sie mit Node.js einzelne ausführbare Anwendungen erstellen und verwalten, einschließlich der Verpackung Ihrer Anwendung, der Verwaltung von Abhängigkeiten und der Berücksichtigung von Sicherheitsaspekten.
head:
  - - meta
    - name: og:title
      content: Einzelne ausführbare Anwendungen mit Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Erfahren Sie, wie Sie mit Node.js einzelne ausführbare Anwendungen erstellen und verwalten, einschließlich der Verpackung Ihrer Anwendung, der Verwaltung von Abhängigkeiten und der Berücksichtigung von Sicherheitsaspekten.
  - - meta
    - name: twitter:title
      content: Einzelne ausführbare Anwendungen mit Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Erfahren Sie, wie Sie mit Node.js einzelne ausführbare Anwendungen erstellen und verwalten, einschließlich der Verpackung Ihrer Anwendung, der Verwaltung von Abhängigkeiten und der Berücksichtigung von Sicherheitsaspekten.
---


# Einzelne ausführbare Anwendungen {#single-executable-applications}


::: info [Historie]
| Version | Änderungen |
|---|---|
| v20.6.0 | Unterstützung für "useSnapshot" hinzugefügt. |
| v20.6.0 | Unterstützung für "useCodeCache" hinzugefügt. |
| v19.7.0, v18.16.0 | Hinzugefügt in: v19.7.0, v18.16.0 |
:::

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index).1 - Aktive Entwicklung
:::

**Quellcode:** [src/node_sea.cc](https://github.com/nodejs/node/blob/v23.5.0/src/node_sea.cc)

Diese Funktion ermöglicht die komfortable Verteilung einer Node.js-Anwendung auf einem System, auf dem Node.js nicht installiert ist.

Node.js unterstützt die Erstellung von [einzelnen ausführbaren Anwendungen](https://github.com/nodejs/single-executable), indem ein von Node.js vorbereiteter Blob, der ein gebündeltes Skript enthalten kann, in die `node`-Binärdatei injiziert werden kann. Beim Start prüft das Programm, ob etwas injiziert wurde. Wenn der Blob gefunden wird, führt es das Skript im Blob aus. Andernfalls arbeitet Node.js wie gewohnt.

Die Funktion für einzelne ausführbare Anwendungen unterstützt derzeit nur die Ausführung eines einzelnen eingebetteten Skripts mit dem [CommonJS](/de/nodejs/api/modules#modules-commonjs-modules)-Modulsystem.

Benutzer können eine einzelne ausführbare Anwendung aus ihrem gebündelten Skript mit der `node`-Binärdatei selbst und jedem Tool erstellen, das Ressourcen in die Binärdatei injizieren kann.

Hier sind die Schritte zum Erstellen einer einzelnen ausführbaren Anwendung mit einem solchen Tool, [postject](https://github.com/nodejs/postject):

## Generieren von Vorbereitungs-Blobs für einzelne ausführbare Dateien {#generating-single-executable-preparation-blobs}

Vorbereitungs-Blobs für einzelne ausführbare Dateien, die in die Anwendung injiziert werden, können mit dem Flag `--experimental-sea-config` der Node.js-Binärdatei generiert werden, die zum Erstellen der einzelnen ausführbaren Datei verwendet wird. Es erwartet einen Pfad zu einer Konfigurationsdatei im JSON-Format. Wenn der an sie übergebene Pfad nicht absolut ist, verwendet Node.js den Pfad relativ zum aktuellen Arbeitsverzeichnis.

Die Konfiguration liest derzeit die folgenden Felder der obersten Ebene:

```json [JSON]
{
  "main": "/path/to/bundled/script.js",
  "output": "/path/to/write/the/generated/blob.blob",
  "disableExperimentalSEAWarning": true, // Standard: false
  "useSnapshot": false,  // Standard: false
  "useCodeCache": true, // Standard: false
  "assets": {  // Optional
    "a.dat": "/path/to/a.dat",
    "b.txt": "/path/to/b.txt"
  }
}
```
Wenn die Pfade nicht absolut sind, verwendet Node.js den Pfad relativ zum aktuellen Arbeitsverzeichnis. Die Version der Node.js-Binärdatei, die zum Erstellen des Blobs verwendet wird, muss mit der identisch sein, in die der Blob injiziert wird.

Hinweis: Beim Generieren von plattformübergreifenden SEAs (z. B. Generieren einer SEA für `linux-x64` unter `darwin-arm64`) müssen `useCodeCache` und `useSnapshot` auf false gesetzt werden, um die Generierung inkompatibler ausführbarer Dateien zu vermeiden. Da Code-Cache und Snapshots nur auf derselben Plattform geladen werden können, auf der sie kompiliert wurden, kann die generierte ausführbare Datei beim Start abstürzen, wenn versucht wird, Code-Cache oder Snapshots zu laden, die auf einer anderen Plattform erstellt wurden.


### Assets {#assets}

Benutzer können Assets einbinden, indem sie der Konfiguration ein Key-Path-Dictionary als `assets`-Feld hinzufügen. Während der Build-Zeit liest Node.js die Assets von den angegebenen Pfaden und bündelt sie in den Preparation Blob. In der generierten ausführbaren Datei können Benutzer die Assets mit den APIs [`sea.getAsset()`](/de/nodejs/api/single-executable-applications#seagetassetkey-encoding) und [`sea.getAssetAsBlob()`](/de/nodejs/api/single-executable-applications#seagetassetasblobkey-options) abrufen.

```json [JSON]
{
  "main": "/pfad/zum/gebündelten/skript.js",
  "output": "/pfad/zum/schreiben/des/generierten/blob.blob",
  "assets": {
    "a.jpg": "/pfad/zu/a.jpg",
    "b.txt": "/pfad/zu/b.txt"
  }
}
```
Die Single-Executable-Anwendung kann wie folgt auf die Assets zugreifen:

```js [CJS]
const { getAsset, getAssetAsBlob, getRawAsset } = require('node:sea');
// Gibt eine Kopie der Daten in einem ArrayBuffer zurück.
const image = getAsset('a.jpg');
// Gibt eine aus dem Asset dekodierte Zeichenkette als UTF8 zurück.
const text = getAsset('b.txt', 'utf8');
// Gibt einen Blob zurück, der das Asset enthält.
const blob = getAssetAsBlob('a.jpg');
// Gibt einen ArrayBuffer zurück, der das rohe Asset ohne Kopieren enthält.
const raw = getRawAsset('a.jpg');
```
Weitere Informationen finden Sie in der Dokumentation der APIs [`sea.getAsset()`](/de/nodejs/api/single-executable-applications#seagetassetkey-encoding), [`sea.getAssetAsBlob()`](/de/nodejs/api/single-executable-applications#seagetassetasblobkey-options) und [`sea.getRawAsset()`](/de/nodejs/api/single-executable-applications#seagetrawassetkey).

### Startup-Snapshot-Unterstützung {#startup-snapshot-support}

Das Feld `useSnapshot` kann verwendet werden, um die Startup-Snapshot-Unterstützung zu aktivieren. In diesem Fall wird das `main`-Skript nicht ausgeführt, wenn die endgültige ausführbare Datei gestartet wird. Stattdessen wird es ausgeführt, wenn der Single-Executable-Anwendungsvorbereitungs-Blob auf dem Build-Rechner generiert wird. Der generierte Vorbereitungs-Blob enthält dann einen Snapshot, der die vom `main`-Skript initialisierten Zustände erfasst. Die endgültige ausführbare Datei mit dem injizierten Vorbereitungs-Blob deserialisiert den Snapshot zur Laufzeit.

Wenn `useSnapshot` wahr ist, muss das Hauptskript die API [`v8.startupSnapshot.setDeserializeMainFunction()`](/de/nodejs/api/v8#v8startupsnapshotsetdeserializemainfunctioncallback-data) aufrufen, um Code zu konfigurieren, der ausgeführt werden muss, wenn die endgültige ausführbare Datei von den Benutzern gestartet wird.

Das typische Muster für eine Anwendung, die Snapshots in einer Single-Executable-Anwendung verwendet, ist:

Die allgemeinen Einschränkungen der Startup-Snapshot-Skripte gelten auch für das Hauptskript, wenn es zum Erstellen von Snapshots für die Single-Executable-Anwendung verwendet wird, und das Hauptskript kann die [`v8.startupSnapshot` API](/de/nodejs/api/v8#startup-snapshot-api) verwenden, um sich an diese Einschränkungen anzupassen. Siehe [Dokumentation zur Startup-Snapshot-Unterstützung in Node.js](/de/nodejs/api/cli#--build-snapshot).


### V8-Code-Cache-Unterstützung {#v8-code-cache-support}

Wenn `useCodeCache` in der Konfiguration auf `true` gesetzt ist, kompiliert Node.js während der Generierung des einzelnen ausführbaren Vorbereitungs-Blobs das `main`-Skript, um den V8-Code-Cache zu generieren. Der generierte Code-Cache ist Teil des Vorbereitungs-Blobs und wird in die endgültige ausführbare Datei eingefügt. Wenn die einzelne ausführbare Anwendung gestartet wird, verwendet Node.js den Code-Cache, um die Kompilierung zu beschleunigen, anstatt das `main`-Skript von Grund auf neu zu kompilieren, und führt dann das Skript aus, was die Startleistung verbessert.

**Hinweis:** `import()` funktioniert nicht, wenn `useCodeCache` auf `true` gesetzt ist.

## Im eingefügten Hauptskript {#in-the-injected-main-script}

### Single-Executable-Application-API {#single-executable-application-api}

Das integrierte `node:sea`-Modul ermöglicht die Interaktion mit der Single-Executable-Anwendung vom JavaScript-Hauptskript aus, das in die ausführbare Datei eingebettet ist.

#### `sea.isSea()` {#seaissea}

**Hinzugefügt in: v21.7.0, v20.12.0**

- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Ob dieses Skript innerhalb einer Single-Executable-Anwendung ausgeführt wird.

### `sea.getAsset(key[, encoding])` {#seagetassetkey-encoding}

**Hinzugefügt in: v21.7.0, v20.12.0**

Diese Methode kann verwendet werden, um die Assets abzurufen, die so konfiguriert sind, dass sie zur Build-Zeit in die Single-Executable-Anwendung gebündelt werden. Es wird ein Fehler ausgelöst, wenn kein übereinstimmendes Asset gefunden werden kann.

- `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der Schlüssel für das Asset in dem Dictionary, das durch das Feld `assets` in der Single-Executable-Application-Konfiguration angegeben wird.
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Wenn angegeben, wird das Asset als Zeichenkette dekodiert. Jede von `TextDecoder` unterstützte Kodierung wird akzeptiert. Wenn nicht angegeben, wird stattdessen ein `ArrayBuffer` zurückgegeben, das eine Kopie des Assets enthält.
- Gibt zurück: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)


### `sea.getAssetAsBlob(key[, options])` {#seagetassetasblobkey-options}

**Hinzugefügt in: v21.7.0, v20.12.0**

Ähnlich wie [`sea.getAsset()`](/de/nodejs/api/single-executable-applications#seagetassetkey-encoding), aber gibt das Ergebnis als [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob) zurück. Ein Fehler wird geworfen, wenn kein passendes Asset gefunden werden kann.

- `key`  [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der Schlüssel für das Asset im Dictionary, das durch das Feld `assets` in der Single-Executable-Application-Konfiguration angegeben wird.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Ein optionaler MIME-Typ für den Blob.
  
 
- Gibt zurück: [\<Blob\>](/de/nodejs/api/buffer#class-blob)

### `sea.getRawAsset(key)` {#seagetrawassetkey}

**Hinzugefügt in: v21.7.0, v20.12.0**

Diese Methode kann verwendet werden, um die Assets abzurufen, die so konfiguriert sind, dass sie zur Build-Zeit in die Single-Executable-Application gebündelt werden. Ein Fehler wird geworfen, wenn kein passendes Asset gefunden werden kann.

Im Gegensatz zu `sea.getAsset()` oder `sea.getAssetAsBlob()` gibt diese Methode keine Kopie zurück. Stattdessen gibt sie das rohe Asset zurück, das in die ausführbare Datei gebündelt ist.

Im Moment sollten Benutzer es vermeiden, in den zurückgegebenen Array-Puffer zu schreiben. Wenn der injizierte Abschnitt nicht als beschreibbar markiert oder nicht richtig ausgerichtet ist, führen Schreibvorgänge in den zurückgegebenen Array-Puffer wahrscheinlich zu einem Absturz.

- `key`  [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der Schlüssel für das Asset im Dictionary, das durch das Feld `assets` in der Single-Executable-Application-Konfiguration angegeben wird.
- Gibt zurück: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

### `require(id)` im injizierten Hauptskript ist nicht dateibasiert {#requireid-in-the-injected-main-script-is-not-file-based}

`require()` im injizierten Hauptskript ist nicht dasselbe wie das [`require()`](/de/nodejs/api/modules#requireid), das für Module verfügbar ist, die nicht injiziert werden. Es hat auch keine der Eigenschaften, die nicht-injiziertes [`require()`](/de/nodejs/api/modules#requireid) hat, außer [`require.main`](/de/nodejs/api/modules#accessing-the-main-module). Es kann nur verwendet werden, um integrierte Module zu laden. Der Versuch, ein Modul zu laden, das nur im Dateisystem gefunden werden kann, führt zu einem Fehler.

Anstatt sich auf ein dateibasiertes `require()` zu verlassen, können Benutzer ihre Anwendung in eine eigenständige JavaScript-Datei bündeln, um sie in die ausführbare Datei zu injizieren. Dies gewährleistet auch einen deterministischeren Abhängigkeitsgraphen.

Wenn jedoch ein dateibasiertes `require()` dennoch benötigt wird, kann dies auch erreicht werden:

```js [ESM]
const { createRequire } = require('node:module');
require = createRequire(__filename);
```

### `__filename` und `module.filename` im injizierten Hauptskript {#__filename-and-modulefilename-in-the-injected-main-script}

Die Werte von `__filename` und `module.filename` im injizierten Hauptskript sind gleich [`process.execPath`](/de/nodejs/api/process#processexecpath).

### `__dirname` im injizierten Hauptskript {#__dirname-in-the-injected-main-script}

Der Wert von `__dirname` im injizierten Hauptskript ist gleich dem Verzeichnisnamen von [`process.execPath`](/de/nodejs/api/process#processexecpath).

## Hinweise {#notes}

### Prozess zur Erstellung einer einzelnen ausführbaren Anwendung {#single-executable-application-creation-process}

Ein Tool, das eine einzelne ausführbare Node.js-Anwendung erstellen soll, muss den Inhalt des mit `--experimental-sea-config"` vorbereiteten Blobs in Folgendes injizieren:

- Eine Ressource namens `NODE_SEA_BLOB`, wenn die `node`-Binärdatei eine [PE](https://en.wikipedia.org/wiki/Portable_Executable)-Datei ist.
- Einen Abschnitt namens `NODE_SEA_BLOB` im `NODE_SEA`-Segment, wenn die `node`-Binärdatei eine [Mach-O](https://en.wikipedia.org/wiki/Mach-O)-Datei ist.
- Eine Notiz namens `NODE_SEA_BLOB`, wenn die `node`-Binärdatei eine [ELF](https://en.wikipedia.org/wiki/Executable_and_Linkable_Format)-Datei ist.

Suchen Sie in der Binärdatei nach der [Fuse](https://www.electronjs.org/docs/latest/tutorial/fuses)-Zeichenkette `NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2:0` und ändern Sie das letzte Zeichen in `1`, um anzuzeigen, dass eine Ressource injiziert wurde.

### Plattformunterstützung {#platform-support}

Die Unterstützung für einzelne ausführbare Dateien wird im CI-System regelmäßig nur auf den folgenden Plattformen getestet:

- Windows
- macOS
- Linux (alle von Node.js [unterstützten Distributionen](https://github.com/nodejs/node/blob/main/BUILDING.md#platform-list) außer Alpine und alle von Node.js [unterstützten Architekturen](https://github.com/nodejs/node/blob/main/BUILDING.md#platform-list) außer s390x)

Dies ist auf das Fehlen besserer Tools zur Erzeugung einzelner ausführbarer Dateien zurückzuführen, mit denen diese Funktion auf anderen Plattformen getestet werden kann.

Vorschläge für andere Tools/Workflows zur Ressourceninjektion sind willkommen. Bitte starten Sie eine Diskussion unter [https://github.com/nodejs/single-executable/discussions](https://github.com/nodejs/single-executable/discussions), um uns bei der Dokumentation zu helfen.

