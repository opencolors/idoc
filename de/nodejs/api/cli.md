---
title: Node.js CLI-Optionen
description: Diese Seite bietet eine umfassende Anleitung zu den in Node.js verfügbaren Kommandozeilenoptionen, die detailliert beschreibt, wie verschiedene Flags und Argumente verwendet werden, um die Laufzeitumgebung zu konfigurieren, das Debugging zu verwalten und das Ausführungsverhalten zu steuern.
head:
  - - meta
    - name: og:title
      content: Node.js CLI-Optionen | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Diese Seite bietet eine umfassende Anleitung zu den in Node.js verfügbaren Kommandozeilenoptionen, die detailliert beschreibt, wie verschiedene Flags und Argumente verwendet werden, um die Laufzeitumgebung zu konfigurieren, das Debugging zu verwalten und das Ausführungsverhalten zu steuern.
  - - meta
    - name: twitter:title
      content: Node.js CLI-Optionen | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Diese Seite bietet eine umfassende Anleitung zu den in Node.js verfügbaren Kommandozeilenoptionen, die detailliert beschreibt, wie verschiedene Flags und Argumente verwendet werden, um die Laufzeitumgebung zu konfigurieren, das Debugging zu verwalten und das Ausführungsverhalten zu steuern.
---


# Befehlszeilen-API {#command-line-api}

Node.js verfügt über eine Vielzahl von CLI-Optionen. Diese Optionen bieten integriertes Debugging, mehrere Möglichkeiten zum Ausführen von Skripten und andere hilfreiche Laufzeitoptionen.

Um diese Dokumentation als Handbuchseite in einem Terminal anzuzeigen, führen Sie `man node` aus.

## Übersicht {#synopsis}

`node [Optionen] [V8-Optionen] [<Programmeinstiegspunkt> | -e "Skript" | -] [--] [Argumente]`

`node inspect [<Programmeinstiegspunkt> | -e "Skript" | <Host>:<Port>] …`

`node --v8-options`

Ohne Argumente ausführen, um die [REPL](/de/nodejs/api/repl) zu starten.

Weitere Informationen zu `node inspect` finden Sie in der [Debugger](/de/nodejs/api/debugger)-Dokumentation.

## Programmeinstiegspunkt {#program-entry-point}

Der Programmeinstiegspunkt ist eine spezifiziererähnliche Zeichenkette. Wenn die Zeichenkette kein absoluter Pfad ist, wird sie als relativer Pfad vom aktuellen Arbeitsverzeichnis aufgelöst. Dieser Pfad wird dann vom [CommonJS](/de/nodejs/api/modules)-Modul-Loader aufgelöst. Wenn keine entsprechende Datei gefunden wird, wird ein Fehler ausgegeben.

Wenn eine Datei gefunden wird, wird ihr Pfad an den [ES-Modul-Loader](/de/nodejs/api/packages#modules-loaders) unter einer der folgenden Bedingungen übergeben:

- Das Programm wurde mit einem Befehlszeilen-Flag gestartet, das erzwingt, dass der Einstiegspunkt mit dem ECMAScript-Modul-Loader geladen wird, z. B. `--import`.
- Die Datei hat die Erweiterung `.mjs`.
- Die Datei hat nicht die Erweiterung `.cjs` und die nächstgelegene übergeordnete `package.json`-Datei enthält ein Feld der obersten Ebene [`"type"`](/de/nodejs/api/packages#type) mit dem Wert `"module"`.

Andernfalls wird die Datei mit dem CommonJS-Modul-Loader geladen. Weitere Informationen finden Sie unter [Modul-Loader](/de/nodejs/api/packages#modules-loaders).

### Einschränkung des Einstiegspunkts des ECMAScript-Modul-Loaders {#ecmascript-modules-loader-entry-point-caveat}

Beim Laden durch den [ES-Modul-Loader](/de/nodejs/api/packages#modules-loaders) des Programmeinstiegspunkts akzeptiert der `node`-Befehl als Eingabe nur Dateien mit den Erweiterungen `.js`, `.mjs` oder `.cjs`; und mit `.wasm`-Erweiterungen, wenn [`--experimental-wasm-modules`](/de/nodejs/api/cli#--experimental-wasm-modules) aktiviert ist.

## Optionen {#options}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v10.12.0 | Unterstriche anstelle von Bindestrichen sind jetzt auch für Node.js-Optionen erlaubt, zusätzlich zu V8-Optionen. |
:::

Bei allen Optionen, einschließlich der V8-Optionen, können Wörter sowohl durch Bindestriche (`-`) als auch durch Unterstriche (`_`) getrennt werden. Beispielsweise ist `--pending-deprecation` äquivalent zu `--pending_deprecation`.

Wenn eine Option, die einen einzelnen Wert akzeptiert (z. B. `--max-http-header-size`), mehr als einmal übergeben wird, wird der zuletzt übergebene Wert verwendet. Optionen von der Befehlszeile haben Vorrang vor Optionen, die über die Umgebungsvariable [`NODE_OPTIONS`](/de/nodejs/api/cli#node_optionsoptions) übergeben werden.


### `-` {#-}

**Hinzugefügt in: v8.0.0**

Alias für stdin. Analog zur Verwendung von `-` in anderen Befehlszeilenprogrammen bedeutet dies, dass das Skript von stdin gelesen wird und die restlichen Optionen an dieses Skript übergeben werden.

### `--` {#--}

**Hinzugefügt in: v6.11.0**

Kennzeichnet das Ende der Node-Optionen. Übergibt die restlichen Argumente an das Skript. Wenn vor dieser Option kein Skriptdateiname oder eval/print-Skript angegeben wurde, wird das nächste Argument als Skriptdateiname verwendet.

### `--abort-on-uncaught-exception` {#--abort-on-uncaught-exception}

**Hinzugefügt in: v0.10.8**

Das Abbrechen anstelle des Beendens führt dazu, dass eine Core-Datei für die Post-Mortem-Analyse mit einem Debugger (wie `lldb`, `gdb` und `mdb`) generiert wird.

Wenn dieses Flag übergeben wird, kann das Verhalten immer noch so eingestellt werden, dass kein Abbruch erfolgt, und zwar über [`process.setUncaughtExceptionCaptureCallback()`](/de/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn) (und durch die Verwendung des `node:domain`-Moduls, das es verwendet).

### `--allow-addons` {#--allow-addons}

**Hinzugefügt in: v21.6.0, v20.12.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index).1 - Aktive Entwicklung
:::

Bei Verwendung des [Berechtigungsmodells](/de/nodejs/api/permissions#permission-model) kann der Prozess standardmäßig keine nativen Addons verwenden. Versuche dies zu tun, lösen einen `ERR_DLOPEN_DISABLED` aus, es sei denn, der Benutzer übergibt beim Starten von Node.js explizit das Flag `--allow-addons`.

Beispiel:

```js [CJS]
// Versuch, ein natives Addon zu laden
require('nodejs-addon-example');
```
```bash [BASH]
$ node --permission --allow-fs-read=* index.js
node:internal/modules/cjs/loader:1319
  return process.dlopen(module, path.toNamespacedPath(filename));
                 ^

Error: Cannot load native addon because loading addons is disabled.
    at Module._extensions..node (node:internal/modules/cjs/loader:1319:18)
    at Module.load (node:internal/modules/cjs/loader:1091:32)
    at Module._load (node:internal/modules/cjs/loader:938:12)
    at Module.require (node:internal/modules/cjs/loader:1115:19)
    at require (node:internal/modules/helpers:130:18)
    at Object.<anonymous> (/home/index.js:1:15)
    at Module._compile (node:internal/modules/cjs/loader:1233:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1287:10)
    at Module.load (node:internal/modules/cjs/loader:1091:32)
    at Module._load (node:internal/modules/cjs/loader:938:12) {
  code: 'ERR_DLOPEN_DISABLED'
}
```

### `--allow-child-process` {#--allow-child-process}

**Hinzugefügt in: v20.0.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index).1 - Aktive Entwicklung
:::

Bei Verwendung des [Berechtigungsmodells](/de/nodejs/api/permissions#permission-model) kann der Prozess standardmäßig keine untergeordneten Prozesse erzeugen. Versuche dies zu tun, lösen einen `ERR_ACCESS_DENIED` aus, es sei denn, der Benutzer übergibt explizit das Flag `--allow-child-process` beim Starten von Node.js.

Beispiel:

```js [ESM]
const childProcess = require('node:child_process');
// Versuch, die Berechtigung zu umgehen
childProcess.spawn('node', ['-e', 'require("fs").writeFileSync("/new-file", "example")']);
```
```bash [BASH]
$ node --permission --allow-fs-read=* index.js
node:internal/child_process:388
  const err = this._handle.spawn(options);
                           ^
Error: Access to this API has been restricted
    at ChildProcess.spawn (node:internal/child_process:388:28)
    at Object.spawn (node:child_process:723:9)
    at Object.<anonymous> (/home/index.js:3:14)
    at Module._compile (node:internal/modules/cjs/loader:1120:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1174:10)
    at Module.load (node:internal/modules/cjs/loader:998:32)
    at Module._load (node:internal/modules/cjs/loader:839:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:81:12)
    at node:internal/main/run_main_module:17:47 {
  code: 'ERR_ACCESS_DENIED',
  permission: 'ChildProcess'
}
```
### `--allow-fs-read` {#--allow-fs-read}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v23.5.0 | Berechtigungsmodell und --allow-fs-Flags sind stabil. |
| v20.7.0 | Durch Komma (`,`) getrennte Pfade sind nicht mehr zulässig. |
| v20.0.0 | Hinzugefügt in: v20.0.0 |
:::

::: tip [Stabil: 2 - Stabil]
[Stabil: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil.
:::

Dieses Flag konfiguriert Dateisystem-Leseberechtigungen mithilfe des [Berechtigungsmodells](/de/nodejs/api/permissions#permission-model).

Die gültigen Argumente für das Flag `--allow-fs-read` sind:

- `*` - Um alle `FileSystemRead`-Operationen zu erlauben.
- Mehrere Pfade können durch mehrere `--allow-fs-read`-Flags erlaubt werden. Beispiel `--allow-fs-read=/folder1/ --allow-fs-read=/folder1/`

Beispiele finden Sie in der Dokumentation [Dateisystemberechtigungen](/de/nodejs/api/permissions#file-system-permissions).

Das Initialisierungsmodul muss ebenfalls erlaubt sein. Betrachten Sie das folgende Beispiel:

```bash [BASH]
$ node --permission index.js

Error: Access to this API has been restricted
    at node:internal/main/run_main_module:23:47 {
  code: 'ERR_ACCESS_DENIED',
  permission: 'FileSystemRead',
  resource: '/Users/rafaelgss/repos/os/node/index.js'
}
```
Der Prozess benötigt Zugriff auf das `index.js`-Modul:

```bash [BASH]
node --permission --allow-fs-read=/path/to/index.js index.js
```

### `--allow-fs-write` {#--allow-fs-write}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v23.5.0 | Berechtigungsmodell und --allow-fs-Flags sind stabil. |
| v20.7.0 | Durch Komma (`,`) getrennte Pfade sind nicht mehr zulässig. |
| v20.0.0 | Hinzugefügt in: v20.0.0 |
:::

::: tip [Stabil: 2 - Stabil]
[Stabil: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil.
:::

Dieses Flag konfiguriert Dateisystem-Schreibberechtigungen mithilfe des [Berechtigungsmodells](/de/nodejs/api/permissions#permission-model).

Die gültigen Argumente für das Flag `--allow-fs-write` sind:

- `*` - Um alle `FileSystemWrite`-Operationen zu erlauben.
- Mehrere Pfade können mithilfe mehrerer `--allow-fs-write`-Flags erlaubt werden. Beispiel `--allow-fs-write=/folder1/ --allow-fs-write=/folder1/`

Durch Komma (`,`) getrennte Pfade sind nicht mehr zulässig. Wenn ein einzelnes Flag mit einem Komma übergeben wird, wird eine Warnung angezeigt.

Beispiele finden Sie in der Dokumentation zu [Dateisystemberechtigungen](/de/nodejs/api/permissions#file-system-permissions).

### `--allow-wasi` {#--allow-wasi}

**Hinzugefügt in: v22.3.0, v20.16.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index).1 - Aktive Entwicklung
:::

Bei Verwendung des [Berechtigungsmodells](/de/nodejs/api/permissions#permission-model) kann der Prozess standardmäßig keine WASI-Instanzen erstellen. Aus Sicherheitsgründen löst der Aufruf einen `ERR_ACCESS_DENIED`-Fehler aus, es sei denn, der Benutzer übergibt explizit das Flag `--allow-wasi` im Haupt-Node.js-Prozess.

Beispiel:

```js [ESM]
const { WASI } = require('node:wasi');
// Versuch, die Berechtigung zu umgehen
new WASI({
  version: 'preview1',
  // Versuch, das gesamte Dateisystem zu mounten
  preopens: {
    '/': '/',
  },
});
```
```bash [BASH]
$ node --permission --allow-fs-read=* index.js

Error: Access to this API has been restricted
    at node:internal/main/run_main_module:30:49 {
  code: 'ERR_ACCESS_DENIED',
  permission: 'WASI',
}
```
### `--allow-worker` {#--allow-worker}

**Hinzugefügt in: v20.0.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index).1 - Aktive Entwicklung
:::

Bei Verwendung des [Berechtigungsmodells](/de/nodejs/api/permissions#permission-model) kann der Prozess standardmäßig keine Worker-Threads erstellen. Aus Sicherheitsgründen löst der Aufruf einen `ERR_ACCESS_DENIED`-Fehler aus, es sei denn, der Benutzer übergibt explizit das Flag `--allow-worker` im Haupt-Node.js-Prozess.

Beispiel:

```js [ESM]
const { Worker } = require('node:worker_threads');
// Versuch, die Berechtigung zu umgehen
new Worker(__filename);
```
```bash [BASH]
$ node --permission --allow-fs-read=* index.js

Error: Access to this API has been restricted
    at node:internal/main/run_main_module:17:47 {
  code: 'ERR_ACCESS_DENIED',
  permission: 'WorkerThreads'
}
```

### `--build-snapshot` {#--build-snapshot}

**Hinzugefügt in: v18.8.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

Generiert einen Snapshot-Blob, wenn der Prozess beendet wird, und schreibt ihn auf die Festplatte, der später mit `--snapshot-blob` geladen werden kann.

Wenn der Snapshot erstellt wird und `--snapshot-blob` nicht angegeben ist, wird der generierte Blob standardmäßig in `snapshot.blob` im aktuellen Arbeitsverzeichnis geschrieben. Andernfalls wird er in den Pfad geschrieben, der durch `--snapshot-blob` angegeben wird.

```bash [BASH]
$ echo "globalThis.foo = 'Ich bin aus dem Snapshot'" > snapshot.js

# Führen Sie snapshot.js aus, um die Anwendung zu initialisieren und den {#run-snapshotjs-to-initialize-the-application-and-snapshot-the}
# Zustand davon in snapshot.blob zu speichern.
$ node --snapshot-blob snapshot.blob --build-snapshot snapshot.js

$ echo "console.log(globalThis.foo)" > index.js

# Laden Sie den generierten Snapshot und starten Sie die Anwendung von index.js. {#state-of-it-into-snapshotblob}
$ node --snapshot-blob snapshot.blob index.js
Ich bin aus dem Snapshot
```
Die [`v8.startupSnapshot` API](/de/nodejs/api/v8#startup-snapshot-api) kann verwendet werden, um einen Einstiegspunkt zum Zeitpunkt der Snapshot-Erstellung anzugeben, wodurch die Notwendigkeit eines zusätzlichen Entry-Skripts zum Zeitpunkt der Deserialisierung vermieden wird:

```bash [BASH]
$ echo "require('v8').startupSnapshot.setDeserializeMainFunction(() => console.log('Ich bin aus dem Snapshot'))" > snapshot.js
$ node --snapshot-blob snapshot.blob --build-snapshot snapshot.js
$ node --snapshot-blob snapshot.blob
Ich bin aus dem Snapshot
```
Weitere Informationen finden Sie in der [`v8.startupSnapshot` API](/de/nodejs/api/v8#startup-snapshot-api) Dokumentation.

Derzeit ist die Unterstützung für Run-Time-Snapshots experimentell in dem Sinne, dass:

### `--build-snapshot-config` {#load-the-generated-snapshot-and-start-the-application-from-indexjs}

**Hinzugefügt in: v21.6.0, v20.12.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

Gibt den Pfad zu einer JSON-Konfigurationsdatei an, die das Verhalten bei der Snapshot-Erstellung konfiguriert.

Die folgenden Optionen werden derzeit unterstützt:

- `builder` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Erforderlich. Stellt den Namen für das Skript bereit, das vor dem Erstellen des Snapshots ausgeführt wird, so als ob [`--build-snapshot`](/de/nodejs/api/cli#--build-snapshot) mit `builder` als Hauptskriptname übergeben worden wäre.
- `withoutCodeCache` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Optional. Das Einbeziehen des Code-Cache reduziert die Zeit, die für das Kompilieren von im Snapshot enthaltenen Funktionen aufgewendet wird, auf Kosten einer größeren Snapshot-Größe und potenziell der Beeinträchtigung der Portabilität des Snapshots.

Wenn dieses Flag verwendet wird, werden zusätzliche Skriptdateien, die in der Befehlszeile bereitgestellt werden, nicht ausgeführt, sondern als reguläre Befehlszeilenargumente interpretiert.


### `-c`, `--check` {#--build-snapshot-config}

::: info [Verlauf]
| Version | Änderungen |
|---|---|
| v10.0.0 | Die Option `--require` wird jetzt beim Überprüfen einer Datei unterstützt. |
| v5.0.0, v4.2.0 | Hinzugefügt in: v5.0.0, v4.2.0 |
:::

Syntaxprüfung des Skripts ohne Ausführung.

### `--completion-bash` {#-c---check}

**Hinzugefügt in: v10.12.0**

Gibt ein quellfähiges Bash-Vervollständigungsskript für Node.js aus.

```bash [BASH]
node --completion-bash > node_bash_completion
source node_bash_completion
```

### `-C condition`, `--conditions=condition` {#--completion-bash}

::: info [Verlauf]
| Version | Änderungen |
|---|---|
| v22.9.0, v20.18.0 | Das Flag ist nicht mehr experimentell. |
| v14.9.0, v12.19.0 | Hinzugefügt in: v14.9.0, v12.19.0 |
:::

::: tip [Stabil: 2 - Stabil]
[Stabil: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil
:::

Bietet benutzerdefinierte Auflösungsbedingungen für [bedingte Exporte](/de/nodejs/api/packages#conditional-exports).

Es sind beliebig viele benutzerdefinierte Zeichenketten-Bedingungsnamen zulässig.

Die standardmäßigen Node.js-Bedingungen `"node"`, `"default"`, `"import"` und `"require"` werden immer wie definiert angewendet.

Zum Beispiel, um ein Modul mit "Entwicklungs"-Auflösungen auszuführen:

```bash [BASH]
node -C development app.js
```

### `--cpu-prof` {#-c-condition---conditions=condition}

::: info [Verlauf]
| Version | Änderungen |
|---|---|
| v22.4.0, v20.16.0 | Die `--cpu-prof`-Flags sind jetzt stabil. |
| v12.0.0 | Hinzugefügt in: v12.0.0 |
:::

::: tip [Stabil: 2 - Stabil]
[Stabil: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil
:::

Startet den V8-CPU-Profiler beim Start und schreibt das CPU-Profil vor dem Beenden auf die Festplatte.

Wenn `--cpu-prof-dir` nicht angegeben ist, wird das generierte Profil im aktuellen Arbeitsverzeichnis platziert.

Wenn `--cpu-prof-name` nicht angegeben ist, wird das generierte Profil `CPU.${yyyymmdd}.${hhmmss}.${pid}.${tid}.${seq}.cpuprofile` benannt.

```bash [BASH]
$ node --cpu-prof index.js
$ ls *.cpuprofile
CPU.20190409.202950.15293.0.0.cpuprofile
```

### `--cpu-prof-dir` {#--cpu-prof}

::: info [Verlauf]
| Version | Änderungen |
|---|---|
| v22.4.0, v20.16.0 | Die `--cpu-prof`-Flags sind jetzt stabil. |
| v12.0.0 | Hinzugefügt in: v12.0.0 |
:::

::: tip [Stabil: 2 - Stabil]
[Stabil: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil
:::

Gibt das Verzeichnis an, in dem die von `--cpu-prof` generierten CPU-Profile platziert werden.

Der Standardwert wird durch die Befehlszeilenoption [`--diagnostic-dir`](/de/nodejs/api/cli#--diagnostic-dirdirectory) gesteuert.


### `--cpu-prof-interval` {#--cpu-prof-dir}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v22.4.0, v20.16.0 | Die `--cpu-prof` Flags sind jetzt stabil. |
| v12.2.0 | Hinzugefügt in: v12.2.0 |
:::

::: tip [Stabil: 2 - Stabil]
[Stabil: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil
:::

Gibt das Abtastintervall in Mikrosekunden für die von `--cpu-prof` generierten CPU-Profile an. Der Standardwert ist 1000 Mikrosekunden.

### `--cpu-prof-name` {#--cpu-prof-interval}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v22.4.0, v20.16.0 | Die `--cpu-prof` Flags sind jetzt stabil. |
| v12.0.0 | Hinzugefügt in: v12.0.0 |
:::

::: tip [Stabil: 2 - Stabil]
[Stabil: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil
:::

Gibt den Dateinamen des von `--cpu-prof` generierten CPU-Profils an.

### `--diagnostic-dir=directory` {#--cpu-prof-name}

Legt das Verzeichnis fest, in das alle diagnostischen Ausgabedateien geschrieben werden. Standardmäßig ist dies das aktuelle Arbeitsverzeichnis.

Beeinflusst das Standardausgabeverzeichnis von:

- [`--cpu-prof-dir`](/de/nodejs/api/cli#--cpu-prof-dir)
- [`--heap-prof-dir`](/de/nodejs/api/cli#--heap-prof-dir)
- [`--redirect-warnings`](/de/nodejs/api/cli#--redirect-warningsfile)

### `--disable-proto=mode` {#--diagnostic-dir=directory}

**Hinzugefügt in: v13.12.0, v12.17.0**

Deaktiviert die `Object.prototype.__proto__` Eigenschaft. Wenn `mode` `delete` ist, wird die Eigenschaft vollständig entfernt. Wenn `mode` `throw` ist, werfen Zugriffe auf die Eigenschaft eine Ausnahme mit dem Code `ERR_PROTO_ACCESS`.

### `--disable-warning=code-or-type` {#--disable-proto=mode}

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Aktive Entwicklung
:::

**Hinzugefügt in: v21.3.0, v20.11.0**

Deaktiviert spezifische Prozesswarnungen nach `code` oder `type`.

Von [`process.emitWarning()`](/de/nodejs/api/process#processemitwarningwarning-options) ausgegebene Warnungen können einen `code` und einen `type` enthalten. Diese Option unterdrückt die Ausgabe von Warnungen, die einen übereinstimmenden `code` oder `type` haben.

Liste der [Deprecated Warnings](/de/nodejs/api/deprecations#list-of-deprecated-apis).

Die Node.js Core-Warnungstypen sind: `DeprecationWarning` und `ExperimentalWarning`

Zum Beispiel wird das folgende Skript [DEP0025 `require('node:sys')`](/de/nodejs/api/deprecations#dep0025-requirenodesys) nicht ausgeben, wenn es mit `node --disable-warning=DEP0025` ausgeführt wird:

::: code-group
```js [ESM]
import sys from 'node:sys';
```

```js [CJS]
const sys = require('node:sys');
```
:::

Zum Beispiel wird das folgende Skript [DEP0025 `require('node:sys')`](/de/nodejs/api/deprecations#dep0025-requirenodesys) ausgeben, aber keine Experimental Warnings (wie [ExperimentalWarning: `vm.measureMemory` is an experimental feature](/de/nodejs/api/vm#vmmeasurememoryoptions) in \<=v21), wenn es mit `node --disable-warning=ExperimentalWarning` ausgeführt wird:

::: code-group
```js [ESM]
import sys from 'node:sys';
import vm from 'node:vm';

vm.measureMemory();
```

```js [CJS]
const sys = require('node:sys');
const vm = require('node:vm');

vm.measureMemory();
```
:::


### `--disable-wasm-trap-handler` {#--disable-warning=code-or-type}

**Hinzugefügt in: v22.2.0, v20.15.0**

Standardmäßig aktiviert Node.js Trap-Handler-basierte WebAssembly-Bound-Checks. Infolgedessen muss V8 keine Inline-Bound-Checks in den aus WebAssembly kompilierten Code einfügen, was die WebAssembly-Ausführung erheblich beschleunigen kann. Diese Optimierung erfordert jedoch die Zuweisung eines großen virtuellen Speicherbereichs (derzeit 10 GB). Wenn der Node.js-Prozess aufgrund von Systemkonfigurationen oder Hardwarebeschränkungen keinen Zugriff auf einen ausreichend großen virtuellen Speicheradressraum hat, können Benutzer kein WebAssembly ausführen, das eine Zuweisung in diesem virtuellen Speicherbereich beinhaltet, und es wird ein Out-of-Memory-Fehler angezeigt.

```bash [BASH]
$ ulimit -v 5000000
$ node -p "new WebAssembly.Memory({ initial: 10, maximum: 100 });"
[eval]:1
new WebAssembly.Memory({ initial: 10, maximum: 100 });
^

RangeError: WebAssembly.Memory(): could not allocate memory
    at [eval]:1:1
    at runScriptInThisContext (node:internal/vm:209:10)
    at node:internal/process/execution:118:14
    at [eval]-wrapper:6:24
    at runScript (node:internal/process/execution:101:62)
    at evalScript (node:internal/process/execution:136:3)
    at node:internal/main/eval_string:49:3

```
`--disable-wasm-trap-handler` deaktiviert diese Optimierung, sodass Benutzer WebAssembly (mit weniger optimaler Leistung) zumindest dann ausführen können, wenn der für ihren Node.js-Prozess verfügbare virtuelle Speicheradressraum geringer ist als der, den der V8-WebAssembly-Speicherbereich benötigt.

### `--disallow-code-generation-from-strings` {#--disable-wasm-trap-handler}

**Hinzugefügt in: v9.8.0**

Bewirkt, dass integrierte Sprachfunktionen wie `eval` und `new Function`, die Code aus Strings generieren, stattdessen eine Ausnahme auslösen. Dies betrifft nicht das Node.js `node:vm`-Modul.

### `--dns-result-order=order` {#--disallow-code-generation-from-strings}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v22.1.0, v20.13.0 | `ipv6first` wird jetzt unterstützt. |
| v17.0.0 | Standardwert auf `verbatim` geändert. |
| v16.4.0, v14.18.0 | Hinzugefügt in: v16.4.0, v14.18.0 |
:::

Legt den Standardwert von `order` in [`dns.lookup()`](/de/nodejs/api/dns#dnslookuphostname-options-callback) und [`dnsPromises.lookup()`](/de/nodejs/api/dns#dnspromiseslookuphostname-options) fest. Der Wert kann sein:

- `ipv4first`: setzt den Standardwert für `order` auf `ipv4first`.
- `ipv6first`: setzt den Standardwert für `order` auf `ipv6first`.
- `verbatim`: setzt den Standardwert für `order` auf `verbatim`.

Der Standardwert ist `verbatim`, und [`dns.setDefaultResultOrder()`](/de/nodejs/api/dns#dnssetdefaultresultorderorder) hat eine höhere Priorität als `--dns-result-order`.


### `--enable-fips` {#--dns-result-order=order}

**Hinzugefügt in: v6.0.0**

Aktiviert FIPS-konforme Krypto beim Start. (Erfordert, dass Node.js gegen ein FIPS-kompatibles OpenSSL gebaut wird.)

### `--enable-network-family-autoselection` {#--enable-fips}

**Hinzugefügt in: v18.18.0**

Aktiviert den Algorithmus zur automatischen Auswahl der Familie, es sei denn, Verbindungsoptionen deaktivieren ihn explizit.

### `--enable-source-maps` {#--enable-network-family-autoselection}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v15.11.0, v14.18.0 | Diese API ist nicht mehr experimentell. |
| v12.12.0 | Hinzugefügt in: v12.12.0 |
:::

Aktiviert die Unterstützung für [Source Map v3](https://sourcemaps.info/spec) für Stacktraces.

Bei Verwendung eines Transpilers, wie z. B. TypeScript, verweisen Stacktraces, die von einer Anwendung ausgelöst werden, auf den transpilierten Code, nicht auf die ursprüngliche Quellposition. `--enable-source-maps` aktiviert das Caching von Source Maps und unternimmt nach besten Kräften, Stacktraces relativ zur ursprünglichen Quelldatei zu melden.

Das Überschreiben von `Error.prepareStackTrace` kann verhindern, dass `--enable-source-maps` den Stacktrace ändert. Rufen Sie die Ergebnisse des ursprünglichen `Error.prepareStackTrace` in der überschreibenden Funktion auf und geben Sie diese zurück, um den Stacktrace mit Source Maps zu ändern.

```js [ESM]
const originalPrepareStackTrace = Error.prepareStackTrace;
Error.prepareStackTrace = (error, trace) => {
  // Ändern Sie Fehler und Trace und formatieren Sie den Stacktrace mit
  // original Error.prepareStackTrace.
  return originalPrepareStackTrace(error, trace);
};
```
Beachten Sie, dass die Aktivierung von Source Maps zu Latenz in Ihrer Anwendung führen kann, wenn auf `Error.stack` zugegriffen wird. Wenn Sie in Ihrer Anwendung häufig auf `Error.stack` zugreifen, berücksichtigen Sie die Leistungsauswirkungen von `--enable-source-maps`.

### `--entry-url` {#--enable-source-maps}

**Hinzugefügt in: v23.0.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

Wenn vorhanden, interpretiert Node.js den Einstiegspunkt als URL und nicht als Pfad.

Folgt den Auflösungsregeln für [ECMAScript-Module](/de/nodejs/api/esm#modules-ecmascript-modules).

Alle Abfrageparameter oder Hashes in der URL sind über [`import.meta.url`](/de/nodejs/api/esm#importmetaurl) zugänglich.

```bash [BASH]
node --entry-url 'file:///path/to/file.js?queryparams=work#and-hashes-too'
node --entry-url --experimental-strip-types 'file.ts?query#hash'
node --entry-url 'data:text/javascript,console.log("Hello")'
```

### `--env-file-if-exists=config` {#--entry-url}

**Hinzugefügt in: v22.9.0**

Das Verhalten ist dasselbe wie bei [`--env-file`](/de/nodejs/api/cli#--env-fileconfig), aber es wird kein Fehler ausgelöst, wenn die Datei nicht existiert.

### `--env-file=config` {#--env-file-if-exists=config}

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index).1 - Aktive Entwicklung
:::


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v21.7.0, v20.12.0 | Unterstützung für mehrzeilige Werte hinzugefügt. |
| v20.6.0 | Hinzugefügt in: v20.6.0 |
:::

Lädt Umgebungsvariablen aus einer Datei relativ zum aktuellen Verzeichnis und stellt sie Anwendungen in `process.env` zur Verfügung. Die [Umgebungsvariablen, die Node.js konfigurieren](/de/nodejs/api/cli#environment-variables), wie z. B. `NODE_OPTIONS`, werden analysiert und angewendet. Wenn dieselbe Variable in der Umgebung und in der Datei definiert ist, hat der Wert aus der Umgebung Vorrang.

Sie können mehrere `--env-file`-Argumente übergeben. Nachfolgende Dateien überschreiben bereits vorhandene Variablen, die in vorherigen Dateien definiert wurden.

Es wird ein Fehler ausgelöst, wenn die Datei nicht existiert.

```bash [BASH]
node --env-file=.env --env-file=.development.env index.js
```
Das Format der Datei sollte eine Zeile pro Schlüssel-Wert-Paar von Umgebungsvariablennamen und -werten sein, getrennt durch `=`:

```text [TEXT]
PORT=3000
```
Jeglicher Text nach einem `#` wird als Kommentar behandelt:

```text [TEXT]
# Dies ist ein Kommentar {#--env-file=config}
PORT=3000 # Dies ist auch ein Kommentar
```
Werte können mit den folgenden Anführungszeichen beginnen und enden: ```, `"` oder `'`. Diese werden aus den Werten entfernt.

```text [TEXT]
USERNAME="nodejs" # führt zu `nodejs` als Wert.
```
Mehrzeilige Werte werden unterstützt:

```text [TEXT]
MULTI_LINE="DAS IST
MEHRZEILIG"
# führt zu `DAS IST\nMEHRZEILIG` als Wert. {#this-is-a-comment}
```
Das Schlüsselwort Export vor einem Schlüssel wird ignoriert:

```text [TEXT]
export USERNAME="nodejs" # führt zu `nodejs` als Wert.
```
Wenn Sie Umgebungsvariablen aus einer Datei laden möchten, die möglicherweise nicht existiert, können Sie stattdessen das Flag [`--env-file-if-exists`](/de/nodejs/api/cli#--env-file-if-existsconfig) verwenden.


### `-e`, `--eval "script"` {#will-result-in-this-is\na-multiline-as-the-value}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v22.6.0 | Eval unterstützt jetzt experimentelles Typ-Stripping. |
| v5.11.0 | Integrierte Bibliotheken sind jetzt als vordefinierte Variablen verfügbar. |
| v0.5.2 | Hinzugefügt in: v0.5.2 |
:::

Wertet das folgende Argument als JavaScript aus. Die im REPL vordefinierten Module können auch in `script` verwendet werden.

Unter Windows funktioniert ein einfaches Anführungszeichen mit `cmd.exe` nicht richtig, da es nur doppelte `"` zum Quoten erkennt. In Powershell oder Git Bash sind sowohl `'` als auch `"` verwendbar.

Es ist möglich, Code mit Inline-Typen auszuführen, indem [`--experimental-strip-types`](/de/nodejs/api/cli#--experimental-strip-types) übergeben wird.

### `--experimental-async-context-frame` {#-e---eval-"script"}

**Hinzugefügt in: v22.7.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

Aktiviert die Verwendung von [`AsyncLocalStorage`](/de/nodejs/api/async_context#class-asynclocalstorage) unterstützt von `AsyncContextFrame` anstelle der Standardimplementierung, die auf async_hooks basiert. Dieses neue Modell ist sehr unterschiedlich implementiert und könnte daher Unterschiede darin aufweisen, wie Kontextdaten innerhalb der Anwendung fließen. Daher wird derzeit empfohlen, sicherzustellen, dass das Verhalten Ihrer Anwendung durch diese Änderung nicht beeinträchtigt wird, bevor Sie sie in der Produktion verwenden.

### `--experimental-eventsource` {#--experimental-async-context-frame}

**Hinzugefügt in: v22.3.0, v20.18.0**

Aktivieren Sie die Bereitstellung der [EventSource Web API](https://html.spec.whatwg.org/multipage/server-sent-events#server-sent-events) im globalen Gültigkeitsbereich.

### `--experimental-import-meta-resolve` {#--experimental-eventsource}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v20.6.0, v18.19.0 | Synchrones import.meta.resolve standardmäßig verfügbar, wobei das Flag beibehalten wird, um das experimentelle zweite Argument wie zuvor unterstützt zu aktivieren. |
| v13.9.0, v12.16.2 | Hinzugefügt in: v13.9.0, v12.16.2 |
:::

Aktiviert die experimentelle Unterstützung für `import.meta.resolve()`-Eltern-URL, wodurch ein zweites `parentURL`-Argument zur kontextbezogenen Auflösung übergeben werden kann.

Bisher war die gesamte Funktion `import.meta.resolve` gesperrt.


### `--experimental-loader=module` {#--experimental-import-meta-resolve}

::: info [History]
| Version | Changes |
| --- | --- |
| v12.11.1 | Dieses Flag wurde von `--loader` in `--experimental-loader` umbenannt. |
| v8.8.0 | Hinzugefügt in: v8.8.0 |
:::

Gibt das `Modul` an, das exportierte [Modul-Anpassungshooks](/de/nodejs/api/module#customization-hooks) enthält. `Modul` kann eine beliebige Zeichenkette sein, die als [`import`-Spezifizierer](/de/nodejs/api/esm#import-specifiers) akzeptiert wird.

### `--experimental-network-inspection` {#--experimental-loader=module}

**Hinzugefügt in: v22.6.0, v20.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

Aktiviert die experimentelle Unterstützung für die Netzwerkprüfung mit Chrome DevTools.

### `--experimental-print-required-tla` {#--experimental-network-inspection}

**Hinzugefügt in: v22.0.0, v20.17.0**

Wenn das ES-Modul, das `require()`'d wird, Top-Level `await` enthält, erlaubt dieses Flag Node.js, das Modul auszuwerten, zu versuchen, die Top-Level Awaits zu finden und deren Position auszugeben, um Benutzern zu helfen, sie zu finden.

### `--experimental-require-module` {#--experimental-print-required-tla}

::: info [History]
| Version | Changes |
| --- | --- |
| v23.0.0 | Dies ist jetzt standardmäßig wahr. |
| v22.0.0, v20.17.0 | Hinzugefügt in: v22.0.0, v20.17.0 |
:::

::: warning [Stable: 1 - Experimental]
[Stable: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Aktive Entwicklung
:::

Unterstützt das Laden eines synchronen ES-Modulgraphen in `require()`.

Siehe [Laden von ECMAScript-Modulen mit `require()`](/de/nodejs/api/modules#loading-ecmascript-modules-using-require).

### `--experimental-sea-config` {#--experimental-require-module}

**Hinzugefügt in: v20.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

Verwenden Sie dieses Flag, um einen Blob zu erzeugen, der in die Node.js-Binärdatei injiziert werden kann, um eine [einzelne ausführbare Anwendung](/de/nodejs/api/single-executable-applications) zu erzeugen. Siehe die Dokumentation über [diese Konfiguration](/de/nodejs/api/single-executable-applications#generating-single-executable-preparation-blobs) für Details.


### `--experimental-shadow-realm` {#--experimental-sea-config}

**Hinzugefügt in: v19.0.0, v18.13.0**

Verwenden Sie dieses Flag, um die Unterstützung für [ShadowRealm](https://github.com/tc39/proposal-shadowrealm) zu aktivieren.

### `--experimental-strip-types` {#--experimental-shadow-realm}

**Hinzugefügt in: v22.6.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index).1 - Aktive Entwicklung
:::

Aktiviert das experimentelle Type-Stripping für TypeScript-Dateien. Weitere Informationen finden Sie in der Dokumentation zum [TypeScript Type-Stripping](/de/nodejs/api/typescript#type-stripping).

### `--experimental-test-coverage` {#--experimental-strip-types}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v20.1.0, v18.17.0 | Diese Option kann mit `--test` verwendet werden. |
| v19.7.0, v18.15.0 | Hinzugefügt in: v19.7.0, v18.15.0 |
:::

In Verbindung mit dem Modul `node:test` wird ein Code Coverage-Bericht als Teil der Ausgabe des Test-Runners generiert. Wenn keine Tests ausgeführt werden, wird kein Coverage-Bericht generiert. Weitere Informationen finden Sie in der Dokumentation zum [Sammeln von Code Coverage aus Tests](/de/nodejs/api/test#collecting-code-coverage).

### `--experimental-test-isolation=mode` {#--experimental-test-coverage}

**Hinzugefügt in: v22.8.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index).0 - Frühe Entwicklung
:::

Konfiguriert die Art der Testisolierung, die im Test-Runner verwendet wird. Wenn `mode` `'process'` ist, wird jede Testdatei in einem separaten Kindprozess ausgeführt. Wenn `mode` `'none'` ist, werden alle Testdateien im selben Prozess wie der Test-Runner ausgeführt. Der Standard-Isolationsmodus ist `'process'`. Dieses Flag wird ignoriert, wenn das Flag `--test` nicht vorhanden ist. Weitere Informationen finden Sie im Abschnitt [Ausführungsmodell des Test-Runners](/de/nodejs/api/test#test-runner-execution-model).

### `--experimental-test-module-mocks` {#--experimental-test-isolation=mode}

**Hinzugefügt in: v22.3.0, v20.18.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index).0 - Frühe Entwicklung
:::

Aktiviert das Module-Mocking im Test-Runner.


### `--experimental-transform-types` {#--experimental-test-module-mocks}

**Hinzugefügt in: v22.7.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Aktive Entwicklung
:::

Aktiviert die Transformation von reiner TypeScript-Syntax in JavaScript-Code. Impliziert `--experimental-strip-types` und `--enable-source-maps`.

### `--experimental-vm-modules` {#--experimental-transform-types}

**Hinzugefügt in: v9.6.0**

Aktiviert die experimentelle ES-Modulunterstützung im Modul `node:vm`.

### `--experimental-wasi-unstable-preview1` {#--experimental-vm-modules}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v20.0.0, v18.17.0 | Diese Option ist nicht mehr erforderlich, da WASI standardmäßig aktiviert ist, aber weiterhin übergeben werden kann. |
| v13.6.0 | Geändert von `--experimental-wasi-unstable-preview0` zu `--experimental-wasi-unstable-preview1`. |
| v13.3.0, v12.16.0 | Hinzugefügt in: v13.3.0, v12.16.0 |
:::

Aktiviert die experimentelle WebAssembly System Interface (WASI)-Unterstützung.

### `--experimental-wasm-modules` {#--experimental-wasi-unstable-preview1}

**Hinzugefügt in: v12.3.0**

Aktiviert die experimentelle WebAssembly-Modulunterstützung.

### `--experimental-webstorage` {#--experimental-wasm-modules}

**Hinzugefügt in: v22.4.0**

Aktiviert die experimentelle [`Web Storage`](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)-Unterstützung.

### `--expose-gc` {#--experimental-webstorage}

**Hinzugefügt in: v22.3.0, v20.18.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell. Dieses Flag wird von V8 übernommen und kann sich Upstream ändern.
:::

Dieses Flag macht die GC-Erweiterung von V8 verfügbar.

```js [ESM]
if (globalThis.gc) {
  globalThis.gc();
}
```
### `--force-context-aware` {#--expose-gc}

**Hinzugefügt in: v12.12.0**

Deaktiviert das Laden nativer Add-ons, die nicht [Context-Aware](/de/nodejs/api/addons#context-aware-addons) sind.

### `--force-fips` {#--force-context-aware}

**Hinzugefügt in: v6.0.0**

Erzwingt FIPS-konforme Kryptografie beim Start. (Kann nicht über Skriptcode deaktiviert werden.) (Gleiche Anforderungen wie `--enable-fips`.)

### `--force-node-api-uncaught-exceptions-policy` {#--force-fips}

**Hinzugefügt in: v18.3.0, v16.17.0**

Erzwingt das `uncaughtException`-Ereignis bei asynchronen Node-API-Callbacks.

Um zu verhindern, dass ein vorhandenes Add-on den Prozess zum Absturz bringt, ist dieses Flag standardmäßig nicht aktiviert. Zukünftig wird dieses Flag standardmäßig aktiviert, um das korrekte Verhalten zu erzwingen.


### `--frozen-intrinsics` {#--force-node-api-uncaught-exceptions-policy}

**Hinzugefügt in: v11.12.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

Aktiviert experimentelle "frozen intrinsics" wie `Array` und `Object`.

Es wird nur der Root-Kontext unterstützt. Es gibt keine Garantie dafür, dass `globalThis.Array` tatsächlich die Standard-Intrinsic-Referenz ist. Code kann unter diesem Flag fehlschlagen.

Um das Hinzufügen von Polyfills zu ermöglichen, werden sowohl [`--require`](/de/nodejs/api/cli#-r---require-module) als auch [`--import`](/de/nodejs/api/cli#--importmodule) ausgeführt, bevor Intrinsics eingefroren werden.

### `--heap-prof` {#--frozen-intrinsics}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v22.4.0, v20.16.0 | Die `--heap-prof`-Flags sind jetzt stabil. |
| v12.4.0 | Hinzugefügt in: v12.4.0 |
:::

::: tip [Stabil: 2 - Stabil]
[Stabil: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil
:::

Startet den V8-Heap-Profiler beim Start und schreibt das Heap-Profil vor dem Beenden auf die Festplatte.

Wenn `--heap-prof-dir` nicht angegeben ist, wird das generierte Profil im aktuellen Arbeitsverzeichnis platziert.

Wenn `--heap-prof-name` nicht angegeben ist, wird das generierte Profil `Heap.${yyyymmdd}.${hhmmss}.${pid}.${tid}.${seq}.heapprofile` benannt.

```bash [BASH]
$ node --heap-prof index.js
$ ls *.heapprofile
Heap.20190409.202950.15293.0.001.heapprofile
```
### `--heap-prof-dir` {#--heap-prof}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v22.4.0, v20.16.0 | Die `--heap-prof`-Flags sind jetzt stabil. |
| v12.4.0 | Hinzugefügt in: v12.4.0 |
:::

::: tip [Stabil: 2 - Stabil]
[Stabil: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil
:::

Gibt das Verzeichnis an, in dem die von `--heap-prof` generierten Heap-Profile abgelegt werden.

Der Standardwert wird durch die Befehlszeilenoption [`--diagnostic-dir`](/de/nodejs/api/cli#--diagnostic-dirdirectory) gesteuert.

### `--heap-prof-interval` {#--heap-prof-dir}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v22.4.0, v20.16.0 | Die `--heap-prof`-Flags sind jetzt stabil. |
| v12.4.0 | Hinzugefügt in: v12.4.0 |
:::

::: tip [Stabil: 2 - Stabil]
[Stabil: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil
:::

Gibt das durchschnittliche Sampling-Intervall in Byte für die von `--heap-prof` generierten Heap-Profile an. Der Standardwert beträgt 512 * 1024 Byte.


### `--heap-prof-name` {#--heap-prof-interval}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v22.4.0, v20.16.0 | Die `--heap-prof` Flags sind jetzt stabil. |
| v12.4.0 | Hinzugefügt in: v12.4.0 |
:::

::: tip [Stabil: 2 - Stabil]
[Stabil: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil
:::

Gibt den Dateinamen des Heap-Profils an, das von `--heap-prof` generiert wird.

### `--heapsnapshot-near-heap-limit=max_count` {#--heap-prof-name}

**Hinzugefügt in: v15.1.0, v14.18.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

Schreibt einen V8-Heap-Snapshot auf die Festplatte, wenn die V8-Heap-Nutzung sich der Heap-Grenze nähert. `count` sollte eine nicht-negative ganze Zahl sein (in diesem Fall schreibt Node.js nicht mehr als `max_count` Snapshots auf die Festplatte).

Beim Generieren von Snapshots kann die Speicherbereinigung ausgelöst werden und die Heap-Nutzung senken. Daher können mehrere Snapshots auf die Festplatte geschrieben werden, bevor die Node.js-Instanz schließlich kein Speicher mehr hat. Diese Heap-Snapshots können verglichen werden, um zu bestimmen, welche Objekte während der Zeit aufeinanderfolgender Snapshots zugewiesen werden. Es wird nicht garantiert, dass Node.js genau `max_count` Snapshots auf die Festplatte schreibt, aber es wird sein Bestes tun, um mindestens einen und bis zu `max_count` Snapshots zu generieren, bevor der Node.js-Instanz der Speicher ausgeht, wenn `max_count` größer als `0` ist.

Das Generieren von V8-Snapshots benötigt Zeit und Speicher (sowohl Speicher, der vom V8-Heap verwaltet wird, als auch nativer Speicher außerhalb des V8-Heaps). Je größer der Heap ist, desto mehr Ressourcen werden benötigt. Node.js passt den V8-Heap an, um den zusätzlichen V8-Heap-Speicher-Overhead zu berücksichtigen, und versucht sein Bestes, um nicht den gesamten für den Prozess verfügbaren Speicher zu verbrauchen. Wenn der Prozess mehr Speicher verwendet, als das System für angemessen hält, kann der Prozess je nach Systemkonfiguration abrupt vom System beendet werden.

```bash [BASH]
$ node --max-old-space-size=100 --heapsnapshot-near-heap-limit=3 index.js
Wrote snapshot to Heap.20200430.100036.49580.0.001.heapsnapshot
Wrote snapshot to Heap.20200430.100037.49580.0.002.heapsnapshot
Wrote snapshot to Heap.20200430.100038.49580.0.003.heapsnapshot

<--- Last few GCs --->

[49580:0x110000000]     4826 ms: Mark-sweep 130.6 (147.8) -> 130.5 (147.8) MB, 27.4 / 0.0 ms  (average mu = 0.126, current mu = 0.034) allocation failure scavenge might not succeed
[49580:0x110000000]     4845 ms: Mark-sweep 130.6 (147.8) -> 130.6 (147.8) MB, 18.8 / 0.0 ms  (average mu = 0.088, current mu = 0.031) allocation failure scavenge might not succeed


<--- JS stacktrace --->

FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
....
```


### `--heapsnapshot-signal=signal` {#--heapsnapshot-near-heap-limit=max_count}

**Hinzugefügt in: v12.0.0**

Aktiviert einen Signalhandler, der den Node.js-Prozess veranlasst, einen Heap-Dump zu schreiben, wenn das angegebene Signal empfangen wird. `signal` muss ein gültiger Signalname sein. Standardmäßig deaktiviert.

```bash [BASH]
$ node --heapsnapshot-signal=SIGUSR2 index.js &
$ ps aux
USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
node         1  5.5  6.1 787252 247004 ?       Ssl  16:43   0:02 node --heapsnapshot-signal=SIGUSR2 index.js
$ kill -USR2 1
$ ls
Heap.20190718.133405.15554.0.001.heapsnapshot
```
### `-h`, `--help` {#--heapsnapshot-signal=signal}

**Hinzugefügt in: v0.1.3**

Gibt die Node-Befehlszeilenoptionen aus. Die Ausgabe dieser Option ist weniger detailliert als dieses Dokument.

### `--icu-data-dir=file` {#-h---help}

**Hinzugefügt in: v0.11.15**

Gibt den ICU-Datenladepfad an. (Überschreibt `NODE_ICU_DATA`.)

### `--import=module` {#--icu-data-dir=file}

**Hinzugefügt in: v19.0.0, v18.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

Lädt das angegebene Modul beim Start vor. Wenn das Flag mehrmals angegeben wird, wird jedes Modul nacheinander in der Reihenfolge ausgeführt, in der sie erscheinen, beginnend mit denen, die in [`NODE_OPTIONS`](/de/nodejs/api/cli#node_optionsoptions) angegeben sind.

Folgt den [ECMAScript-Modul](/de/nodejs/api/esm#modules-ecmascript-modules)-Auflösungsregeln. Verwenden Sie [`--require`](/de/nodejs/api/cli#-r---require-module), um ein [CommonJS-Modul](/de/nodejs/api/modules) zu laden. Module, die mit `--require` vorgeladen werden, werden vor Modulen ausgeführt, die mit `--import` vorgeladen werden.

Module werden sowohl in den Haupt-Thread als auch in alle Worker-Threads, verzweigten Prozesse oder geclusterten Prozesse vorgeladen.

### `--input-type=type` {#--import=module}

**Hinzugefügt in: v12.0.0**

Dies konfiguriert Node.js so, dass `--eval`- oder `STDIN`-Eingaben als CommonJS oder als ES-Modul interpretiert werden. Gültige Werte sind `"commonjs"` oder `"module"`. Der Standardwert ist `"commonjs"`.

Die REPL unterstützt diese Option nicht. Die Verwendung von `--input-type=module` mit [`--print`](/de/nodejs/api/cli#-p---print-script) löst einen Fehler aus, da `--print` die ES-Modul-Syntax nicht unterstützt.


### `--insecure-http-parser` {#--input-type=type}

**Hinzugefügt in: v13.4.0, v12.15.0, v10.19.0**

Aktiviert Nachsichtigkeits-Flags im HTTP-Parser. Dies kann die Interoperabilität mit nicht konformen HTTP-Implementierungen ermöglichen.

Wenn aktiviert, akzeptiert der Parser Folgendes:

- Ungültige HTTP-Headerwerte.
- Ungültige HTTP-Versionen.
- Nachrichten zulassen, die sowohl `Transfer-Encoding`- als auch `Content-Length`-Header enthalten.
- Zusätzliche Daten nach der Nachricht zulassen, wenn `Connection: close` vorhanden ist.
- Zusätzliche Transfer-Encodings zulassen, nachdem `chunked` bereitgestellt wurde.
- Zulassen, dass `\n` anstelle von `\r\n` als Trennzeichen verwendet wird.
- Zulassen, dass `\r\n` nach einem Chunk nicht bereitgestellt wird.
- Leerzeichen nach einer Chunk-Größe und vor `\r\n` zulassen.

All das oben Genannte setzt Ihre Anwendung Request-Schmuggel- oder Vergiftungsangriffen aus. Vermeiden Sie die Verwendung dieser Option.

#### Warnung: Das Binden des Inspectors an eine öffentliche IP:Port-Kombination ist unsicher {#--insecure-http-parser}

Das Binden des Inspectors an eine öffentliche IP (einschließlich `0.0.0.0`) mit einem offenen Port ist unsicher, da es externen Hosts ermöglicht, sich mit dem Inspector zu verbinden und einen [Remote Code Execution](https://www.owasp.org/index.php/Code_Injection)-Angriff durchzuführen.

Wenn Sie einen Host angeben, stellen Sie sicher, dass entweder:

- Der Host nicht über öffentliche Netzwerke erreichbar ist.
- Eine Firewall unerwünschte Verbindungen auf dem Port unterbindet.

**Genauer gesagt ist <code>--inspect=0.0.0.0</code> unsicher, wenn der Port (standardmäßig
<code>9229</code>) nicht durch eine Firewall geschützt ist.**

Weitere Informationen finden Sie im Abschnitt [Sicherheitsrisiken beim Debuggen](https://nodejs.org/en/docs/guides/debugging-getting-started/#security-implications).

### `--inspect-brk[=[host:]port]` {#warning-binding-inspector-to-a-public-ipport-combination-is-insecure}

**Hinzugefügt in: v7.6.0**

Aktiviert den Inspector auf `host:port` und unterbricht am Anfang des Benutzerskripts. Der Standardwert für `host:port` ist `127.0.0.1:9229`. Wenn Port `0` angegeben wird, wird ein zufälliger verfügbarer Port verwendet.

Weitere Erläuterungen zum Node.js-Debugger finden Sie unter [V8 Inspector Integration für Node.js](/de/nodejs/api/debugger#v8-inspector-integration-for-nodejs).

### `--inspect-port=[host:]port` {#--inspect-brk=hostport}

**Hinzugefügt in: v7.6.0**

Legt den `host:port` fest, der verwendet werden soll, wenn der Inspector aktiviert wird. Nützlich, wenn der Inspector durch Senden des `SIGUSR1`-Signals aktiviert wird.

Der Standard-Host ist `127.0.0.1`. Wenn Port `0` angegeben wird, wird ein zufälliger verfügbarer Port verwendet.

Beachten Sie die [Sicherheitswarnung](/de/nodejs/api/cli#warning-binding-inspector-to-a-public-ipport-combination-is-insecure) unten bezüglich der Verwendung des `host`-Parameters.


### `--inspect-publish-uid=stderr,http` {#--inspect-port=hostport}

Legt fest, auf welche Weise die WebSocket-URL des Inspectors veröffentlicht wird.

Standardmäßig ist die WebSocket-URL des Inspectors in `stderr` und unter dem Endpunkt `/json/list` auf `http://host:port/json/list` verfügbar.

### `--inspect-wait[=[host:]port]` {#--inspect-publish-uid=stderrhttp}

**Hinzugefügt in: v22.2.0, v20.15.0**

Aktiviert den Inspector auf `host:port` und wartet, bis ein Debugger verbunden ist. Der Standardwert für `host:port` ist `127.0.0.1:9229`. Wenn Port `0` angegeben ist, wird ein zufälliger verfügbarer Port verwendet.

Weitere Erläuterungen zum Node.js-Debugger finden Sie unter [V8 Inspector-Integration für Node.js](/de/nodejs/api/debugger#v8-inspector-integration-for-nodejs).

### `--inspect[=[host:]port]` {#--inspect-wait=hostport}

**Hinzugefügt in: v6.3.0**

Aktiviert den Inspector auf `host:port`. Der Standardwert ist `127.0.0.1:9229`. Wenn Port `0` angegeben ist, wird ein zufälliger verfügbarer Port verwendet.

Die V8 Inspector-Integration ermöglicht es Tools wie Chrome DevTools und IDEs, Node.js-Instanzen zu debuggen und zu profilieren. Die Tools verbinden sich über einen TCP-Port mit Node.js-Instanzen und kommunizieren über das [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/). Weitere Erläuterungen zum Node.js-Debugger finden Sie unter [V8 Inspector-Integration für Node.js](/de/nodejs/api/debugger#v8-inspector-integration-for-nodejs).

### `-i`, `--interactive` {#--inspect=hostport}

**Hinzugefügt in: v0.7.7**

Öffnet die REPL, auch wenn stdin scheinbar kein Terminal ist.

### `--jitless` {#-i---interactive}

**Hinzugefügt in: v12.0.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell. Dieses Flag wird von V8 übernommen und kann sich upstream ändern.
:::

Deaktiviert die [Laufzeitzuweisung von ausführbarem Speicher](https://v8.dev/blog/jitless). Dies kann auf einigen Plattformen aus Sicherheitsgründen erforderlich sein. Es kann auch die Angriffsfläche auf anderen Plattformen verringern, aber die Leistungseinbußen können erheblich sein.

### `--localstorage-file=file` {#--jitless}

**Hinzugefügt in: v22.4.0**

Die Datei, die zum Speichern von `localStorage`-Daten verwendet wird. Wenn die Datei nicht existiert, wird sie beim ersten Zugriff auf `localStorage` erstellt. Dieselbe Datei kann von mehreren Node.js-Prozessen gleichzeitig genutzt werden. Dieses Flag hat keine Auswirkung, es sei denn, Node.js wird mit dem Flag `--experimental-webstorage` gestartet.


### `--max-http-header-size=size` {#--localstorage-file=file}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v13.13.0 | Maximale Standardgröße von HTTP-Headern von 8 KiB auf 16 KiB geändert. |
| v11.6.0, v10.15.0 | Hinzugefügt in: v11.6.0, v10.15.0 |
:::

Legt die maximale Größe von HTTP-Headern in Bytes fest. Der Standardwert ist 16 KiB.

### `--napi-modules` {#--max-http-header-size=size}

**Hinzugefügt in: v7.10.0**

Diese Option hat keine Auswirkung. Sie wird aus Kompatibilitätsgründen beibehalten.

### `--network-family-autoselection-attempt-timeout` {#--napi-modules}

**Hinzugefügt in: v22.1.0, v20.13.0**

Legt den Standardwert für das Timeout des Autoselection-Versuchs für die Netzwerkfamilie fest. Weitere Informationen finden Sie unter [`net.getDefaultAutoSelectFamilyAttemptTimeout()`](/de/nodejs/api/net#netgetdefaultautoselectfamilyattempttimeout).

### `--no-addons` {#--network-family-autoselection-attempt-timeout}

**Hinzugefügt in: v16.10.0, v14.19.0**

Deaktiviert die `node-addons` Exportbedingung und das Laden von nativen Addons. Wenn `--no-addons` angegeben wird, schlägt der Aufruf von `process.dlopen` oder das Anfordern eines nativen C++ Addons fehl und löst eine Ausnahme aus.

### `--no-deprecation` {#--no-addons}

**Hinzugefügt in: v0.8.0**

Unterdrückt Warnungen wegen Veraltung.

### `--no-experimental-detect-module` {#--no-deprecation}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v22.7.0 | Die Syntaxerkennung ist standardmäßig aktiviert. |
| v21.1.0, v20.10.0 | Hinzugefügt in: v21.1.0, v20.10.0 |
:::

Deaktiviert die Verwendung der [Syntaxerkennung](/de/nodejs/api/packages#syntax-detection) zur Bestimmung des Modultyps.

### `--no-experimental-global-navigator` {#--no-experimental-detect-module}

**Hinzugefügt in: v21.2.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

Deaktiviert die Bereitstellung der [Navigator API](/de/nodejs/api/globals#navigator) im globalen Gültigkeitsbereich.

### `--no-experimental-repl-await` {#--no-experimental-global-navigator}

**Hinzugefügt in: v16.6.0**

Verwenden Sie dieses Flag, um Top-Level Await im REPL zu deaktivieren.

### `--no-experimental-require-module` {#--no-experimental-repl-await}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v23.0.0 | Dies ist jetzt standardmäßig false. |
| v22.0.0, v20.17.0 | Hinzugefügt in: v22.0.0, v20.17.0 |
:::

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index).1 - Aktive Entwicklung
:::

Deaktiviert die Unterstützung für das Laden eines synchronen ES-Modulgraphen in `require()`.

Siehe [Laden von ECMAScript-Modulen mit `require()`](/de/nodejs/api/modules#loading-ecmascript-modules-using-require).


### `--no-experimental-sqlite` {#--no-experimental-require-module}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v23.4.0 | SQLite ist nicht mehr als experimentell gekennzeichnet, aber immer noch experimentell. |
| v22.5.0 | Hinzugefügt in: v22.5.0 |
:::

Deaktiviert das experimentelle Modul [`node:sqlite`](/de/nodejs/api/sqlite).

### `--no-experimental-websocket` {#--no-experimental-sqlite}

**Hinzugefügt in: v22.0.0**

Deaktiviert die Bereitstellung von [`WebSocket`](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) im globalen Gültigkeitsbereich.

### `--no-extra-info-on-fatal-exception` {#--no-experimental-websocket}

**Hinzugefügt in: v17.0.0**

Blendet zusätzliche Informationen zu schwerwiegenden Ausnahmen aus, die zum Beenden führen.

### `--no-force-async-hooks-checks` {#--no-extra-info-on-fatal-exception}

**Hinzugefügt in: v9.0.0**

Deaktiviert Laufzeitprüfungen für `async_hooks`. Diese werden weiterhin dynamisch aktiviert, wenn `async_hooks` aktiviert ist.

### `--no-global-search-paths` {#--no-force-async-hooks-checks}

**Hinzugefügt in: v16.10.0**

Durchsucht keine Module aus globalen Pfaden wie `$HOME/.node_modules` und `$NODE_PATH`.

### `--no-network-family-autoselection` {#--no-global-search-paths}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v20.0.0 | Das Flag wurde von `--no-enable-network-family-autoselection` in `--no-network-family-autoselection` umbenannt. Der alte Name kann weiterhin als Alias funktionieren. |
| v19.4.0 | Hinzugefügt in: v19.4.0 |
:::

Deaktiviert den Algorithmus zur automatischen Auswahl der Familie, es sei denn, die Verbindungsoptionen aktivieren ihn explizit.

### `--no-warnings` {#--no-network-family-autoselection}

**Hinzugefügt in: v6.0.0**

Unterdrückt alle Prozesswarnungen (einschließlich Veraltungen).

### `--node-memory-debug` {#--no-warnings}

**Hinzugefügt in: v15.0.0, v14.18.0**

Aktiviert zusätzliche Debug-Prüfungen auf Speicherlecks in Node.js-Interna. Dies ist normalerweise nur für Entwickler nützlich, die Node.js selbst debuggen.

### `--openssl-config=file` {#--node-memory-debug}

**Hinzugefügt in: v6.9.0**

Lädt beim Start eine OpenSSL-Konfigurationsdatei. Unter anderem kann dies verwendet werden, um FIPS-konforme Krypto zu aktivieren, wenn Node.js gegen FIPS-fähiges OpenSSL gebaut ist.

### `--openssl-legacy-provider` {#--openssl-config=file}

**Hinzugefügt in: v17.0.0, v16.17.0**

Aktiviert den OpenSSL 3.0 Legacy-Provider. Weitere Informationen finden Sie unter [OSSL_PROVIDER-legacy](https://www.openssl.org/docs/man3.0/man7/OSSL_PROVIDER-legacy).

### `--openssl-shared-config` {#--openssl-legacy-provider}

**Hinzugefügt in: v18.5.0, v16.17.0, v14.21.0**

Aktiviert den OpenSSL-Standardkonfigurationsabschnitt `openssl_conf`, der aus der OpenSSL-Konfigurationsdatei gelesen werden soll. Die Standardkonfigurationsdatei heißt `openssl.cnf`, dies kann jedoch mithilfe der Umgebungsvariablen `OPENSSL_CONF` oder der Befehlszeilenoption `--openssl-config` geändert werden. Der Speicherort der OpenSSL-Standardkonfigurationsdatei hängt davon ab, wie OpenSSL mit Node.js verknüpft ist. Das gemeinsame Nutzen der OpenSSL-Konfiguration kann unerwünschte Auswirkungen haben, und es wird empfohlen, einen Konfigurationsabschnitt zu verwenden, der spezifisch für Node.js ist, nämlich `nodejs_conf`, was standardmäßig der Fall ist, wenn diese Option nicht verwendet wird.


### `--pending-deprecation` {#--openssl-shared-config}

**Hinzugefügt in: v8.0.0**

Gibt ausstehende Veraltungswarnungen aus.

Ausstehende Veraltungen sind im Allgemeinen identisch mit einer Laufzeit-Veraltung, mit der bemerkenswerten Ausnahme, dass sie standardmäßig *deaktiviert* sind und erst ausgegeben werden, wenn entweder das Befehlszeilen-Flag `--pending-deprecation` oder die Umgebungsvariable `NODE_PENDING_DEPRECATION=1` gesetzt ist. Ausstehende Veraltungen werden verwendet, um eine Art selektiven "Frühwarnmechanismus" bereitzustellen, den Entwickler nutzen können, um die Verwendung veralteter APIs zu erkennen.

### `--permission` {#--pending-deprecation}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v23.5.0 | Das Berechtigungsmodell ist jetzt stabil. |
| v20.0.0 | Hinzugefügt in: v20.0.0 |
:::

::: tip [Stabil: 2 - Stabil]
[Stabil: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil.
:::

Aktiviert das Berechtigungsmodell für den aktuellen Prozess. Wenn aktiviert, sind die folgenden Berechtigungen eingeschränkt:

- Dateisystem - verwaltbar über die Flags [`--allow-fs-read`](/de/nodejs/api/cli#--allow-fs-read), [`--allow-fs-write`](/de/nodejs/api/cli#--allow-fs-write)
- Kindprozess - verwaltbar über das Flag [`--allow-child-process`](/de/nodejs/api/cli#--allow-child-process)
- Worker-Threads - verwaltbar über das Flag [`--allow-worker`](/de/nodejs/api/cli#--allow-worker)
- WASI - verwaltbar über das Flag [`--allow-wasi`](/de/nodejs/api/cli#--allow-wasi)
- Addons - verwaltbar über das Flag [`--allow-addons`](/de/nodejs/api/cli#--allow-addons)

### `--preserve-symlinks` {#--permission}

**Hinzugefügt in: v6.3.0**

Weist den Modul-Loader an, symbolische Links beim Auflösen und Cachen von Modulen beizubehalten.

Standardmäßig dereferenziert Node.js den Link und verwendet den tatsächlichen "realen Pfad" des Moduls auf der Festplatte sowohl als Kennung als auch als Stammpfad, um andere Abhängigkeitsmodule zu finden, wenn Node.js ein Modul von einem Pfad lädt, der symbolisch mit einem anderen Speicherort auf der Festplatte verknüpft ist. In den meisten Fällen ist dieses Standardverhalten akzeptabel. Bei der Verwendung symbolisch verknüpfter Peer-Abhängigkeiten, wie im folgenden Beispiel veranschaulicht, führt das Standardverhalten jedoch dazu, dass eine Ausnahme ausgelöst wird, wenn `moduleA` versucht, `moduleB` als Peer-Abhängigkeit anzufordern:

```text [TEXT]
{appDir}
 ├── app
 │   ├── index.js
 │   └── node_modules
 │       ├── moduleA -> {appDir}/moduleA
 │       └── moduleB
 │           ├── index.js
 │           └── package.json
 └── moduleA
     ├── index.js
     └── package.json
```
Das Befehlszeilen-Flag `--preserve-symlinks` weist Node.js an, den Symlink-Pfad für Module anstelle des realen Pfads zu verwenden, wodurch symbolisch verknüpfte Peer-Abhängigkeiten gefunden werden können.

Beachten Sie jedoch, dass die Verwendung von `--preserve-symlinks` andere Nebenwirkungen haben kann. Insbesondere können symbolisch verknüpfte *native* Module nicht geladen werden, wenn diese von mehr als einem Ort in der Abhängigkeitsstruktur verknüpft sind (Node.js würde diese als zwei separate Module betrachten und versuchen, das Modul mehrmals zu laden, was zum Auslösen einer Ausnahme führt).

Das Flag `--preserve-symlinks` gilt nicht für das Hauptmodul, wodurch `node --preserve-symlinks node_module/.bin/\<foo\>` funktioniert. Um das gleiche Verhalten für das Hauptmodul anzuwenden, verwenden Sie auch `--preserve-symlinks-main`.


### `--preserve-symlinks-main` {#--preserve-symlinks}

**Hinzugefügt in: v10.2.0**

Weist den Modul-Loader an, symbolische Links bei der Auflösung und dem Caching des Hauptmoduls (`require.main`) beizubehalten.

Dieses Flag existiert, damit das Hauptmodul das gleiche Verhalten erhalten kann, das `--preserve-symlinks` allen anderen Importen gibt; es handelt sich jedoch um separate Flags, um die Abwärtskompatibilität mit älteren Node.js-Versionen zu gewährleisten.

`--preserve-symlinks-main` impliziert nicht `--preserve-symlinks`; Verwenden Sie `--preserve-symlinks-main` zusätzlich zu `--preserve-symlinks`, wenn es nicht erwünscht ist, Symlinks zu folgen, bevor relative Pfade aufgelöst werden.

Weitere Informationen finden Sie unter [`--preserve-symlinks`](/de/nodejs/api/cli#--preserve-symlinks).

### `-p`, `--print "script"` {#--preserve-symlinks-main}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v5.11.0 | Eingebaute Bibliotheken sind jetzt als vordefinierte Variablen verfügbar. |
| v0.6.4 | Hinzugefügt in: v0.6.4 |
:::

Identisch mit `-e`, druckt aber das Ergebnis.

### `--prof` {#-p---print-"script"}

**Hinzugefügt in: v2.0.0**

Generiert eine V8-Profiler-Ausgabe.

### `--prof-process` {#--prof}

**Hinzugefügt in: v5.2.0**

Verarbeitet die mit der V8-Option `--prof` generierte V8-Profiler-Ausgabe.

### `--redirect-warnings=file` {#--prof-process}

**Hinzugefügt in: v8.0.0**

Schreibt Prozesswarnungen in die angegebene Datei, anstatt sie in stderr auszugeben. Die Datei wird erstellt, falls sie nicht existiert, und wird angehängt, falls sie existiert. Wenn beim Versuch, die Warnung in die Datei zu schreiben, ein Fehler auftritt, wird die Warnung stattdessen in stderr geschrieben.

Der `file`-Name kann ein absoluter Pfad sein. Wenn dies nicht der Fall ist, wird das Standardverzeichnis, in das er geschrieben wird, durch die Befehlszeilenoption [`--diagnostic-dir`](/de/nodejs/api/cli#--diagnostic-dirdirectory) gesteuert.

### `--report-compact` {#--redirect-warnings=file}

**Hinzugefügt in: v13.12.0, v12.17.0**

Schreibt Berichte in einem kompakten Format, einzeiliges JSON, das von Protokollverarbeitungssystemen leichter verarbeitet werden kann als das standardmäßige mehrzeilige Format, das für den menschlichen Gebrauch entwickelt wurde.

### `--report-dir=directory`, `report-directory=directory` {#--report-compact}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v13.12.0, v12.17.0 | Diese Option ist nicht mehr experimentell. |
| v12.0.0 | Von `--diagnostic-report-directory` zu `--report-directory` geändert. |
| v11.8.0 | Hinzugefügt in: v11.8.0 |
:::

Speicherort, an dem der Bericht generiert wird.


### `--report-exclude-env` {#--report-dir=directory-report-directory=directory}

**Hinzugefügt in: v23.3.0**

Wenn `--report-exclude-env` übergeben wird, enthält der generierte Diagnosebericht nicht die `environmentVariables`-Daten.

### `--report-exclude-network` {#--report-exclude-env}

**Hinzugefügt in: v22.0.0, v20.13.0**

Schließt `header.networkInterfaces` aus dem Diagnosebericht aus. Standardmäßig ist dies nicht gesetzt und die Netzwerkschnittstellen sind enthalten.

### `--report-filename=filename` {#--report-exclude-network}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v13.12.0, v12.17.0 | Diese Option ist nicht mehr experimentell. |
| v12.0.0 | geändert von `--diagnostic-report-filename` zu `--report-filename`. |
| v11.8.0 | Hinzugefügt in: v11.8.0 |
:::

Name der Datei, in die der Bericht geschrieben wird.

Wenn der Dateiname auf `'stdout'` oder `'stderr'` gesetzt ist, wird der Bericht in die Standardausgabe bzw. den Standardfehler des Prozesses geschrieben.

### `--report-on-fatalerror` {#--report-filename=filename}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v14.0.0, v13.14.0, v12.17.0 | Diese Option ist nicht mehr experimentell. |
| v12.0.0 | geändert von `--diagnostic-report-on-fatalerror` zu `--report-on-fatalerror`. |
| v11.8.0 | Hinzugefügt in: v11.8.0 |
:::

Ermöglicht das Auslösen des Berichts bei schwerwiegenden Fehlern (interne Fehler innerhalb der Node.js-Laufzeitumgebung, wie z. B. unzureichender Speicher), die zur Beendigung der Anwendung führen. Nützlich, um verschiedene diagnostische Datenelemente wie Heap, Stack, Event-Loop-Status, Ressourcenverbrauch usw. zu untersuchen, um den schwerwiegenden Fehler zu begründen.

### `--report-on-signal` {#--report-on-fatalerror}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v13.12.0, v12.17.0 | Diese Option ist nicht mehr experimentell. |
| v12.0.0 | geändert von `--diagnostic-report-on-signal` zu `--report-on-signal`. |
| v11.8.0 | Hinzugefügt in: v11.8.0 |
:::

Ermöglicht die Generierung eines Berichts beim Empfang des angegebenen (oder vordefinierten) Signals an den laufenden Node.js-Prozess. Das Signal zum Auslösen des Berichts wird über `--report-signal` angegeben.

### `--report-signal=signal` {#--report-on-signal}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v13.12.0, v12.17.0 | Diese Option ist nicht mehr experimentell. |
| v12.0.0 | geändert von `--diagnostic-report-signal` zu `--report-signal`. |
| v11.8.0 | Hinzugefügt in: v11.8.0 |
:::

Legt das Signal für die Berichtgenerierung fest oder setzt es zurück (nicht unter Windows unterstützt). Das Standardsignal ist `SIGUSR2`.


### `--report-uncaught-exception` {#--report-signal=signal}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v18.8.0, v16.18.0 | Der Bericht wird nicht generiert, wenn die unbehandelte Ausnahme behandelt wird. |
| v13.12.0, v12.17.0 | Diese Option ist nicht mehr experimentell. |
| v12.0.0 | von `--diagnostic-report-uncaught-exception` zu `--report-uncaught-exception` geändert. |
| v11.8.0 | Hinzugefügt in: v11.8.0 |
:::

Ermöglicht die Generierung eines Berichts, wenn der Prozess aufgrund einer unbehandelten Ausnahme beendet wird. Nützlich bei der Inspektion des JavaScript-Stacks in Verbindung mit dem nativen Stack und anderen Laufzeitumgebungsdaten.

### `-r`, `--require module` {#--report-uncaught-exception}

**Hinzugefügt in: v1.6.0**

Lädt das angegebene Modul beim Start vor.

Befolgt die Modulauflösungsregeln von `require()`. `module` kann entweder ein Pfad zu einer Datei oder ein Node-Modulname sein.

Es werden nur CommonJS-Module unterstützt. Verwenden Sie [`--import`](/de/nodejs/api/cli#--importmodule), um ein [ECMAScript-Modul](/de/nodejs/api/esm#modules-ecmascript-modules) vorzuladen. Mit `--require` vorgeladene Module werden vor mit `--import` vorgeladenen Modulen ausgeführt.

Module werden sowohl in den Haupt-Thread als auch in alle Worker-Threads, verzweigten Prozesse oder gruppierten Prozesse vorgeladen.

### `--run` {#-r---require-module}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v22.3.0 | Die Umgebungsvariable NODE_RUN_SCRIPT_NAME wurde hinzugefügt. |
| v22.3.0 | Die Umgebungsvariable NODE_RUN_PACKAGE_JSON_PATH wurde hinzugefügt. |
| v22.3.0 | Durchläuft bis zum Stammverzeichnis und findet eine `package.json`-Datei, um den Befehl auszuführen, und aktualisiert die Umgebungsvariable `PATH` entsprechend. |
| v22.0.0 | Hinzugefügt in: v22.0.0 |
:::

::: tip [Stabil: 2 - Stabil]
[Stabil: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil
:::

Dies führt einen angegebenen Befehl aus dem `"scripts"`-Objekt einer package.json aus. Wenn ein fehlender `"command"` angegeben wird, werden die verfügbaren Skripte aufgelistet.

`--run` durchläuft bis zum Stammverzeichnis und findet eine `package.json`-Datei, um den Befehl auszuführen.

`--run` stellt `./node_modules/.bin` für jeden Vorfahren des aktuellen Verzeichnisses dem `PATH` voran, um die Binärdateien aus verschiedenen Ordnern auszuführen, in denen mehrere `node_modules`-Verzeichnisse vorhanden sind, wenn `ancestor-folder/node_modules/.bin` ein Verzeichnis ist.

`--run` führt den Befehl in dem Verzeichnis aus, das die zugehörige `package.json` enthält.

Beispielsweise führt der folgende Befehl das `test`-Skript der `package.json` im aktuellen Ordner aus:

```bash [BASH]
$ node --run test
```
Sie können auch Argumente an den Befehl übergeben. Jedes Argument nach `--` wird an das Skript angehängt:

```bash [BASH]
$ node --run test -- --verbose
```

#### Beabsichtigte Einschränkungen {#--run}

`node --run` soll nicht mit dem Verhalten von `npm run` oder den `run`-Befehlen anderer Paketmanager übereinstimmen. Die Node.js-Implementierung ist absichtlich stärker eingeschränkt, um sich auf die Spitzenleistung für die häufigsten Anwendungsfälle zu konzentrieren. Einige Funktionen anderer `run`-Implementierungen, die absichtlich ausgeschlossen werden, sind:

- Ausführen von `pre`- oder `post`-Skripten zusätzlich zu dem angegebenen Skript.
- Definieren von Paketmanager-spezifischen Umgebungsvariablen.

#### Umgebungsvariablen {#intentional-limitations}

Die folgenden Umgebungsvariablen werden gesetzt, wenn ein Skript mit `--run` ausgeführt wird:

- `NODE_RUN_SCRIPT_NAME`: Der Name des Skripts, das ausgeführt wird. Wenn `--run` beispielsweise verwendet wird, um `test` auszuführen, ist der Wert dieser Variablen `test`.
- `NODE_RUN_PACKAGE_JSON_PATH`: Der Pfad zur `package.json`, die verarbeitet wird.

### `--secure-heap-min=n` {#environment-variables}

**Hinzugefügt in: v15.6.0**

Bei Verwendung von `--secure-heap` gibt das Flag `--secure-heap-min` die minimale Allokation aus dem sicheren Heap an. Der Mindestwert ist `2`. Der Höchstwert ist das Minimum aus `--secure-heap` oder `2147483647`. Der angegebene Wert muss eine Potenz von Zwei sein.

### `--secure-heap=n` {#--secure-heap-min=n}

**Hinzugefügt in: v15.6.0**

Initialisiert einen OpenSSL-Sicherheits-Heap von `n` Bytes. Bei der Initialisierung wird der sichere Heap für ausgewählte Arten von Allokationen innerhalb von OpenSSL während der Schlüsselerzeugung und anderer Operationen verwendet. Dies ist beispielsweise nützlich, um zu verhindern, dass sensible Informationen aufgrund von Zeigerüberschreitungen oder -unterschreitungen verloren gehen.

Der sichere Heap hat eine feste Größe und kann zur Laufzeit nicht geändert werden. Daher ist es wichtig, bei Verwendung einen ausreichend großen Heap auszuwählen, um alle Anwendungsfälle abzudecken.

Die angegebene Heap-Größe muss eine Potenz von Zwei sein. Jeder Wert unter 2 deaktiviert den sicheren Heap.

Der sichere Heap ist standardmäßig deaktiviert.

Der sichere Heap ist unter Windows nicht verfügbar.

Weitere Informationen finden Sie unter [`CRYPTO_secure_malloc_init`](https://www.openssl.org/docs/man3.0/man3/CRYPTO_secure_malloc_init).

### `--snapshot-blob=path` {#--secure-heap=n}

**Hinzugefügt in: v18.8.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

In Kombination mit `--build-snapshot` gibt `--snapshot-blob` den Pfad an, in den der generierte Snapshot-Blob geschrieben wird. Wenn nicht angegeben, wird der generierte Blob in `snapshot.blob` im aktuellen Arbeitsverzeichnis gespeichert.

Wenn es ohne `--build-snapshot` verwendet wird, gibt `--snapshot-blob` den Pfad zum Blob an, der zum Wiederherstellen des Anwendungsstatus verwendet wird.

Beim Laden eines Snapshots überprüft Node.js Folgendes:

Wenn sie nicht übereinstimmen, weigert sich Node.js, den Snapshot zu laden und beendet den Vorgang mit dem Statuscode 1.


### `--test` {#--snapshot-blob=path}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v20.0.0 | Der Test Runner ist jetzt stabil. |
| v19.2.0, v18.13.0 | Der Test Runner unterstützt jetzt die Ausführung im Beobachtungsmodus. |
| v18.1.0, v16.17.0 | Hinzugefügt in: v18.1.0, v16.17.0 |
:::

Startet den Node.js Befehlszeilen-Test Runner. Dieses Flag kann nicht mit `--watch-path`, `--check`, `--eval`, `--interactive` oder dem Inspektor kombiniert werden. Weitere Informationen finden Sie in der Dokumentation zum [Ausführen von Tests über die Befehlszeile](/de/nodejs/api/test#running-tests-from-the-command-line).

### `--test-concurrency` {#--test}

**Hinzugefügt in: v21.0.0, v20.10.0, v18.19.0**

Die maximale Anzahl von Testdateien, die die Test Runner CLI gleichzeitig ausführt. Wenn `--experimental-test-isolation` auf `'none'` gesetzt ist, wird dieses Flag ignoriert und die Parallelität ist eins. Andernfalls ist die Parallelität standardmäßig `os.availableParallelism() - 1`.

### `--test-coverage-branches=threshold` {#--test-concurrency}

**Hinzugefügt in: v22.8.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

Erfordert einen Mindestprozentsatz an abgedeckten Branches. Wenn die Codeabdeckung den angegebenen Schwellenwert nicht erreicht, wird der Prozess mit dem Code `1` beendet.

### `--test-coverage-exclude` {#--test-coverage-branches=threshold}

**Hinzugefügt in: v22.5.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

Schließt bestimmte Dateien mit einem Glob-Muster von der Codeabdeckung aus. Das Muster kann sowohl absolute als auch relative Dateipfade abgleichen.

Diese Option kann mehrfach angegeben werden, um mehrere Glob-Muster auszuschließen.

Wenn sowohl `--test-coverage-exclude` als auch `--test-coverage-include` angegeben werden, müssen Dateien **beide** Kriterien erfüllen, um in den Abdeckungsbericht aufgenommen zu werden.

Standardmäßig werden alle übereinstimmenden Testdateien vom Abdeckungsbericht ausgeschlossen. Die Angabe dieser Option überschreibt das Standardverhalten.

### `--test-coverage-functions=threshold` {#--test-coverage-exclude}

**Hinzugefügt in: v22.8.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

Erfordert einen Mindestprozentsatz an abgedeckten Funktionen. Wenn die Codeabdeckung den angegebenen Schwellenwert nicht erreicht, wird der Prozess mit dem Code `1` beendet.


### `--test-coverage-include` {#--test-coverage-functions=threshold}

**Hinzugefügt in: v22.5.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

Schließt bestimmte Dateien in die Codeabdeckung ein, indem ein Glob-Muster verwendet wird, das sowohl absolute als auch relative Dateipfade abgleichen kann.

Diese Option kann mehrmals angegeben werden, um mehrere Glob-Muster einzuschließen.

Wenn sowohl `--test-coverage-exclude` als auch `--test-coverage-include` angegeben werden, müssen Dateien **beide** Kriterien erfüllen, um in den Abdeckungsbericht aufgenommen zu werden.

### `--test-coverage-lines=threshold` {#--test-coverage-include}

**Hinzugefügt in: v22.8.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

Erfordert einen Mindestprozentsatz abgedeckter Zeilen. Wenn die Codeabdeckung den angegebenen Schwellenwert nicht erreicht, wird der Prozess mit dem Code `1` beendet.

### `--test-force-exit` {#--test-coverage-lines=threshold}

**Hinzugefügt in: v22.0.0, v20.14.0**

Konfiguriert den Test Runner, um den Prozess zu beenden, sobald alle bekannten Tests abgeschlossen sind, auch wenn die Ereignisschleife ansonsten aktiv bleiben würde.

### `--test-name-pattern` {#--test-force-exit}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v20.0.0 | Der Test Runner ist jetzt stabil. |
| v18.11.0 | Hinzugefügt in: v18.11.0 |
:::

Ein regulärer Ausdruck, der den Test Runner so konfiguriert, dass er nur Tests ausführt, deren Name mit dem angegebenen Muster übereinstimmt. Weitere Informationen finden Sie in der Dokumentation zum [Filtern von Tests nach Namen](/de/nodejs/api/test#filtering-tests-by-name).

Wenn sowohl `--test-name-pattern` als auch `--test-skip-pattern` angegeben werden, müssen Tests **beide** Anforderungen erfüllen, um ausgeführt zu werden.

### `--test-only` {#--test-name-pattern}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v20.0.0 | Der Test Runner ist jetzt stabil. |
| v18.0.0, v16.17.0 | Hinzugefügt in: v18.0.0, v16.17.0 |
:::

Konfiguriert den Test Runner so, dass nur Top-Level-Tests ausgeführt werden, die die Option `only` gesetzt haben. Dieses Flag ist nicht erforderlich, wenn die Testisolierung deaktiviert ist.

### `--test-reporter` {#--test-only}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v20.0.0 | Der Test Runner ist jetzt stabil. |
| v19.6.0, v18.15.0 | Hinzugefügt in: v19.6.0, v18.15.0 |
:::

Ein Test-Reporter, der beim Ausführen von Tests verwendet werden soll. Weitere Informationen finden Sie in der Dokumentation zu [Test-Reportern](/de/nodejs/api/test#test-reporters).


### `--test-reporter-destination` {#--test-reporter}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v20.0.0 | Der Test Runner ist jetzt stabil. |
| v19.6.0, v18.15.0 | Hinzugefügt in: v19.6.0, v18.15.0 |
:::

Das Ziel für den entsprechenden Testreporter. Siehe die Dokumentation zu [Test Reportern](/de/nodejs/api/test#test-reporters) für weitere Details.

### `--test-shard` {#--test-reporter-destination}

**Hinzugefügt in: v20.5.0, v18.19.0**

Testsuite-Shard, der in einem Format von `\<Index\>/\<Gesamt\>` ausgeführt werden soll, wobei

`Index` eine positive ganze Zahl ist, Index der geteilten Teile. `Gesamt` ist eine positive ganze Zahl, Summe der geteilten Teile. Dieser Befehl teilt alle Testdateien in `Gesamt` gleiche Teile auf und führt nur diejenigen aus, die sich in einem `Index`-Teil befinden.

Um beispielsweise Ihre Testsuite in drei Teile zu teilen, verwenden Sie Folgendes:

```bash [BASH]
node --test --test-shard=1/3
node --test --test-shard=2/3
node --test --test-shard=3/3
```
### `--test-skip-pattern` {#--test-shard}

**Hinzugefügt in: v22.1.0**

Ein regulärer Ausdruck, der den Test Runner so konfiguriert, dass Tests übersprungen werden, deren Name mit dem bereitgestellten Muster übereinstimmt. Siehe die Dokumentation zum [Filtern von Tests nach Namen](/de/nodejs/api/test#filtering-tests-by-name) für weitere Details.

Wenn sowohl `--test-name-pattern` als auch `--test-skip-pattern` angegeben werden, müssen Tests **beide** Anforderungen erfüllen, um ausgeführt zu werden.

### `--test-timeout` {#--test-skip-pattern}

**Hinzugefügt in: v21.2.0, v20.11.0**

Eine Anzahl von Millisekunden, nach denen die Testausführung fehlschlägt. Wenn nicht angegeben, erben Subtests diesen Wert von ihrem übergeordneten Element. Der Standardwert ist `Infinity`.

### `--test-update-snapshots` {#--test-timeout}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v23.4.0 | Snapshot-Tests sind nicht mehr experimentell. |
| v22.3.0 | Hinzugefügt in: v22.3.0 |
:::

Generiert die Snapshot-Dateien neu, die vom Test Runner für [Snapshot-Tests](/de/nodejs/api/test#snapshot-testing) verwendet werden.

### `--throw-deprecation` {#--test-update-snapshots}

**Hinzugefügt in: v0.11.14**

Löst Fehler für Deprecations aus.

### `--title=title` {#--throw-deprecation}

**Hinzugefügt in: v10.7.0**

Setzt `process.title` beim Start.

### `--tls-cipher-list=list` {#--title=title}

**Hinzugefügt in: v4.0.0**

Gibt eine alternative Standard-TLS-Cipher-Liste an. Erfordert, dass Node.js mit Crypto-Unterstützung (Standard) erstellt wird.


### `--tls-keylog=file` {#--tls-cipher-list=list}

**Hinzugefügt in: v13.2.0, v12.16.0**

Protokolliert TLS-Schlüsselmaterial in einer Datei. Das Schlüsselmaterial liegt im NSS `SSLKEYLOGFILE`-Format vor und kann von Software (wie z. B. Wireshark) zum Entschlüsseln des TLS-Traffics verwendet werden.

### `--tls-max-v1.2` {#--tls-keylog=file}

**Hinzugefügt in: v12.0.0, v10.20.0**

Setzt [`tls.DEFAULT_MAX_VERSION`](/de/nodejs/api/tls#tlsdefault_max_version) auf 'TLSv1.2'. Verwenden Sie dies, um die Unterstützung für TLSv1.3 zu deaktivieren.

### `--tls-max-v1.3` {#--tls-max-v12}

**Hinzugefügt in: v12.0.0**

Setzt standardmäßig [`tls.DEFAULT_MAX_VERSION`](/de/nodejs/api/tls#tlsdefault_max_version) auf 'TLSv1.3'. Verwenden Sie dies, um die Unterstützung für TLSv1.3 zu aktivieren.

### `--tls-min-v1.0` {#--tls-max-v13}

**Hinzugefügt in: v12.0.0, v10.20.0**

Setzt standardmäßig [`tls.DEFAULT_MIN_VERSION`](/de/nodejs/api/tls#tlsdefault_min_version) auf 'TLSv1'. Verwenden Sie dies zur Kompatibilität mit alten TLS-Clients oder -Servern.

### `--tls-min-v1.1` {#--tls-min-v10}

**Hinzugefügt in: v12.0.0, v10.20.0**

Setzt standardmäßig [`tls.DEFAULT_MIN_VERSION`](/de/nodejs/api/tls#tlsdefault_min_version) auf 'TLSv1.1'. Verwenden Sie dies zur Kompatibilität mit alten TLS-Clients oder -Servern.

### `--tls-min-v1.2` {#--tls-min-v11}

**Hinzugefügt in: v12.2.0, v10.20.0**

Setzt standardmäßig [`tls.DEFAULT_MIN_VERSION`](/de/nodejs/api/tls#tlsdefault_min_version) auf 'TLSv1.2'. Dies ist die Standardeinstellung für 12.x und höher, aber die Option wird zur Kompatibilität mit älteren Node.js-Versionen unterstützt.

### `--tls-min-v1.3` {#--tls-min-v12}

**Hinzugefügt in: v12.0.0**

Setzt standardmäßig [`tls.DEFAULT_MIN_VERSION`](/de/nodejs/api/tls#tlsdefault_min_version) auf 'TLSv1.3'. Verwenden Sie dies, um die Unterstützung für TLSv1.2 zu deaktivieren, das nicht so sicher ist wie TLSv1.3.

### `--trace-deprecation` {#--tls-min-v13}

**Hinzugefügt in: v0.8.0**

Gibt Stacktraces für Veraltungen aus.

### `--trace-env` {#--trace-deprecation}

**Hinzugefügt in: v23.4.0**

Gibt Informationen über jeden Zugriff auf Umgebungsvariablen aus, der in der aktuellen Node.js-Instanz erfolgt, auf stderr aus, einschließlich:

- Die Umgebungsvariablen-Lesevorgänge, die Node.js intern durchführt.
- Schreibvorgänge in der Form `process.env.KEY = "SOME VALUE"`.
- Lesevorgänge in der Form `process.env.KEY`.
- Definitionen in der Form `Object.defineProperty(process.env, 'KEY', {...})`.
- Abfragen in der Form `Object.hasOwn(process.env, 'KEY')`, `process.env.hasOwnProperty('KEY')` oder `'KEY' in process.env`.
- Löschungen in der Form `delete process.env.KEY`.
- Aufzählungen in der Form `...process.env` oder `Object.keys(process.env)`.

Es werden nur die Namen der Umgebungsvariablen ausgegeben, auf die zugegriffen wird. Die Werte werden nicht ausgegeben.

Um den Stacktrace des Zugriffs auszugeben, verwenden Sie `--trace-env-js-stack` und/oder `--trace-env-native-stack`.


### `--trace-env-js-stack` {#--trace-env}

**Hinzugefügt in: v23.4.0**

Zusätzlich zu dem, was `--trace-env` tut, gibt dies den JavaScript-Stack-Trace des Zugriffs aus.

### `--trace-env-native-stack` {#--trace-env-js-stack}

**Hinzugefügt in: v23.4.0**

Zusätzlich zu dem, was `--trace-env` tut, gibt dies den nativen Stack-Trace des Zugriffs aus.

### `--trace-event-categories` {#--trace-env-native-stack}

**Hinzugefügt in: v7.7.0**

Eine kommagetrennte Liste von Kategorien, die verfolgt werden sollen, wenn die Trace-Event-Verfolgung mit `--trace-events-enabled` aktiviert ist.

### `--trace-event-file-pattern` {#--trace-event-categories}

**Hinzugefügt in: v9.8.0**

Template-String, der den Dateipfad für die Trace-Event-Daten angibt. Er unterstützt `${rotation}` und `${pid}`.

### `--trace-events-enabled` {#--trace-event-file-pattern}

**Hinzugefügt in: v7.7.0**

Aktiviert die Sammlung von Trace-Event-Verfolgungsinformationen.

### `--trace-exit` {#--trace-events-enabled}

**Hinzugefügt in: v13.5.0, v12.16.0**

Gibt einen Stack-Trace aus, wenn eine Umgebung proaktiv verlassen wird, d. h. durch Aufrufen von `process.exit()`.

### `--trace-require-module=mode` {#--trace-exit}

**Hinzugefügt in: v23.5.0**

Gibt Informationen über die Verwendung von [Laden von ECMAScript-Modulen mit `require()` aus](/de/nodejs/api/modules#loading-ecmascript-modules-using-require).

Wenn `mode` gleich `all` ist, wird die gesamte Verwendung ausgegeben. Wenn `mode` gleich `no-node-modules` ist, wird die Verwendung aus dem Ordner `node_modules` ausgeschlossen.

### `--trace-sigint` {#--trace-require-module=mode}

**Hinzugefügt in: v13.9.0, v12.17.0**

Gibt einen Stack-Trace bei SIGINT aus.

### `--trace-sync-io` {#--trace-sigint}

**Hinzugefügt in: v2.1.0**

Gibt einen Stack-Trace aus, wenn synchrones I/O nach der ersten Runde der Ereignisschleife erkannt wird.

### `--trace-tls` {#--trace-sync-io}

**Hinzugefügt in: v12.2.0**

Gibt TLS-Paketverfolgungsinformationen an `stderr` aus. Dies kann zur Fehlersuche bei TLS-Verbindungsproblemen verwendet werden.

### `--trace-uncaught` {#--trace-tls}

**Hinzugefügt in: v13.1.0**

Gibt Stack-Traces für unbehandelte Ausnahmen aus; normalerweise wird der Stack-Trace ausgegeben, der mit der Erstellung eines `Error` verbunden ist, während dies Node.js auch den Stack-Trace ausgeben lässt, der mit dem Werfen des Wertes verbunden ist (der keine `Error`-Instanz sein muss).

Die Aktivierung dieser Option kann das Verhalten der Garbage Collection negativ beeinflussen.

### `--trace-warnings` {#--trace-uncaught}

**Hinzugefügt in: v6.0.0**

Gibt Stack-Traces für Prozesswarnungen (einschließlich Veraltungen) aus.


### `--track-heap-objects` {#--trace-warnings}

**Hinzugefügt in: v2.4.0**

Heap-Objektzuweisungen für Heap-Snapshots verfolgen.

### `--unhandled-rejections=mode` {#--track-heap-objects}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v15.0.0 | Standardmodus auf `throw` geändert. Zuvor wurde eine Warnung ausgegeben. |
| v12.0.0, v10.17.0 | Hinzugefügt in: v12.0.0, v10.17.0 |
:::

Die Verwendung dieses Flags ermöglicht es, zu ändern, was passieren soll, wenn eine unbehandelte Ablehnung auftritt. Einer der folgenden Modi kann ausgewählt werden:

- `throw`: Gibt [`unhandledRejection`](/de/nodejs/api/process#event-unhandledrejection) aus. Wenn dieser Hook nicht gesetzt ist, wirft die unbehandelte Ablehnung als unbehandelte Ausnahme aus. Dies ist die Standardeinstellung.
- `strict`: Wirft die unbehandelte Ablehnung als unbehandelte Ausnahme aus. Wenn die Ausnahme behandelt wird, wird [`unhandledRejection`](/de/nodejs/api/process#event-unhandledrejection) ausgegeben.
- `warn`: Löst immer eine Warnung aus, unabhängig davon, ob der [`unhandledRejection`](/de/nodejs/api/process#event-unhandledrejection)-Hook gesetzt ist oder nicht, aber gibt die Deprecation-Warnung nicht aus.
- `warn-with-error-code`: Gibt [`unhandledRejection`](/de/nodejs/api/process#event-unhandledrejection) aus. Wenn dieser Hook nicht gesetzt ist, löst eine Warnung aus und setzt den Prozess-Exit-Code auf 1.
- `none`: Unterdrückt alle Warnungen.

Wenn eine Ablehnung während der statischen Ladephase des ES-Moduls des Befehlszeileneinstiegspunkts auftritt, wird sie immer als unbehandelte Ausnahme ausgelöst.

### `--use-bundled-ca`, `--use-openssl-ca` {#--unhandled-rejections=mode}

**Hinzugefügt in: v6.11.0**

Verwendet den mitgelieferten Mozilla CA Store, wie er von der aktuellen Node.js-Version bereitgestellt wird, oder den Standard-CA-Store von OpenSSL. Der Standard-Store kann zur Build-Zeit ausgewählt werden.

Der mitgelieferte CA Store, wie er von Node.js bereitgestellt wird, ist ein Snapshot des Mozilla CA Stores, der zum Zeitpunkt der Veröffentlichung festgelegt wird. Er ist auf allen unterstützten Plattformen identisch.

Die Verwendung des OpenSSL-Stores ermöglicht externe Änderungen des Stores. Für die meisten Linux- und BSD-Distributionen wird dieser Store von den Distributionsverantwortlichen und Systemadministratoren gepflegt. Der Speicherort des OpenSSL CA Stores ist von der Konfiguration der OpenSSL-Bibliothek abhängig, kann aber zur Laufzeit mithilfe von Umgebungsvariablen geändert werden.

Siehe `SSL_CERT_DIR` und `SSL_CERT_FILE`.


### `--use-largepages=modus` {#--use-bundled-ca---use-openssl-ca}

**Hinzugefügt in: v13.6.0, v12.17.0**

Weist den statischen Node.js-Code beim Start auf große Speicherseiten um. Wenn dies auf dem Zielsystem unterstützt wird, wird der statische Node.js-Code auf 2-MiB-Seiten anstelle von 4-KiB-Seiten verschoben.

Die folgenden Werte sind für `modus` gültig:

- `off`: Es wird kein Mapping versucht. Dies ist die Standardeinstellung.
- `on`: Wenn es vom Betriebssystem unterstützt wird, wird ein Mapping versucht. Ein Fehler beim Mapping wird ignoriert und eine Meldung wird in die Standardfehlerausgabe gedruckt.
- `silent`: Wenn es vom Betriebssystem unterstützt wird, wird ein Mapping versucht. Ein Fehler beim Mapping wird ignoriert und nicht gemeldet.

### `--v8-options` {#--use-largepages=mode}

**Hinzugefügt in: v0.1.3**

Gibt V8-Befehlszeilenoptionen aus.

### `--v8-pool-size=num` {#--v8-options}

**Hinzugefügt in: v5.10.0**

Legt die Größe des V8-Thread-Pools fest, der zum Zuweisen von Hintergrundaufgaben verwendet wird.

Wenn auf `0` gesetzt, wählt Node.js eine geeignete Größe des Thread-Pools basierend auf einer Schätzung des Parallelisierungsgrades.

Der Parallelisierungsgrad bezieht sich auf die Anzahl der Berechnungen, die gleichzeitig auf einer gegebenen Maschine durchgeführt werden können. Im Allgemeinen entspricht dies der Anzahl der CPUs, kann aber in Umgebungen wie VMs oder Containern abweichen.

### `-v`, `--version` {#--v8-pool-size=num}

**Hinzugefügt in: v0.1.3**

Gibt die Node-Version aus.

### `--watch` {#-v---version}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v22.0.0, v20.13.0 | Der Watch-Modus ist jetzt stabil. |
| v19.2.0, v18.13.0 | Der Test-Runner unterstützt jetzt die Ausführung im Watch-Modus. |
| v18.11.0, v16.19.0 | Hinzugefügt in: v18.11.0, v16.19.0 |
:::

::: tip [Stabil: 2 - Stabil]
[Stabil: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil
:::

Startet Node.js im Watch-Modus. Im Watch-Modus bewirken Änderungen in den überwachten Dateien einen Neustart des Node.js-Prozesses. Standardmäßig überwacht der Watch-Modus den Einstiegspunkt und alle erforderlichen oder importierten Module. Verwenden Sie `--watch-path`, um anzugeben, welche Pfade überwacht werden sollen.

Dieses Flag kann nicht mit `--check`, `--eval`, `--interactive` oder der REPL kombiniert werden.

```bash [BASH]
node --watch index.js
```

### `--watch-path` {#--watch}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v22.0.0, v20.13.0 | Der Beobachtungsmodus ist jetzt stabil. |
| v18.11.0, v16.19.0 | Hinzugefügt in: v18.11.0, v16.19.0 |
:::

::: tip [Stabil: 2 - Stabil]
[Stabil: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil
:::

Startet Node.js im Beobachtungsmodus und gibt an, welche Pfade überwacht werden sollen. Im Beobachtungsmodus führen Änderungen in den überwachten Pfaden zu einem Neustart des Node.js-Prozesses. Dadurch wird die Überwachung von erforderlichen oder importierten Modulen deaktiviert, auch wenn es in Kombination mit `--watch` verwendet wird.

Dieses Flag kann nicht mit `--check`, `--eval`, `--interactive`, `--test` oder der REPL kombiniert werden.

```bash [BASH]
node --watch-path=./src --watch-path=./tests index.js
```
Diese Option wird nur unter macOS und Windows unterstützt. Eine `ERR_FEATURE_UNAVAILABLE_ON_PLATFORM`-Ausnahme wird ausgelöst, wenn die Option auf einer Plattform verwendet wird, die sie nicht unterstützt.

### `--watch-preserve-output` {#--watch-path}

**Hinzugefügt in: v19.3.0, v18.13.0**

Deaktiviert das Löschen der Konsole, wenn der Beobachtungsmodus den Prozess neu startet.

```bash [BASH]
node --watch --watch-preserve-output test.js
```
### `--zero-fill-buffers` {#--watch-preserve-output}

**Hinzugefügt in: v6.0.0**

Füllt automatisch alle neu zugewiesenen [`Buffer`](/de/nodejs/api/buffer#class-buffer)- und [`SlowBuffer`](/de/nodejs/api/buffer#class-slowbuffer)-Instanzen mit Nullen.

## Umgebungsvariablen {#--zero-fill-buffers}

### `FORCE_COLOR=[1, 2, 3]` {#environment-variables_1}

Die Umgebungsvariable `FORCE_COLOR` wird verwendet, um die ANSI-farbige Ausgabe zu aktivieren. Der Wert kann sein:

- `1`, `true` oder die leere Zeichenkette `''` geben 16-Farben-Unterstützung an,
- `2` gibt 256-Farben-Unterstützung an, oder
- `3` gibt 16-Millionen-Farben-Unterstützung an.

Wenn `FORCE_COLOR` verwendet und auf einen unterstützten Wert gesetzt ist, werden sowohl die Umgebungsvariablen `NO_COLOR` als auch `NODE_DISABLE_COLORS` ignoriert.

Jeder andere Wert führt dazu, dass die farbige Ausgabe deaktiviert wird.

### `NODE_COMPILE_CACHE=dir` {#force_color=1-2-3}

**Hinzugefügt in: v22.1.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index).1 - Aktive Entwicklung
:::

Aktivieren Sie den [Modul-Kompilierungs-Cache](/de/nodejs/api/module#module-compile-cache) für die Node.js-Instanz. Weitere Informationen finden Sie in der Dokumentation zum [Modul-Kompilierungs-Cache](/de/nodejs/api/module#module-compile-cache).


### `NODE_DEBUG=module[,…]` {#node_compile_cache=dir}

**Hinzugefügt in: v0.1.32**

`,`-getrennte Liste von Kernmodulen, die Debug-Informationen ausgeben sollen.

### `NODE_DEBUG_NATIVE=module[,…]` {#node_debug=module}

`,`-getrennte Liste von Kern-C++-Modulen, die Debug-Informationen ausgeben sollen.

### `NODE_DISABLE_COLORS=1` {#node_debug_native=module}

**Hinzugefügt in: v0.3.0**

Wenn gesetzt, werden Farben in der REPL nicht verwendet.

### `NODE_DISABLE_COMPILE_CACHE=1` {#node_disable_colors=1}

**Hinzugefügt in: v22.8.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index).1 - Aktive Entwicklung
:::

Deaktiviert den [Modul-Kompilierungs-Cache](/de/nodejs/api/module#module-compile-cache) für die Node.js-Instanz. Siehe die Dokumentation des [Modul-Kompilierungs-Cache](/de/nodejs/api/module#module-compile-cache) für Details.

### `NODE_EXTRA_CA_CERTS=file` {#node_disable_compile_cache=1}

**Hinzugefügt in: v7.3.0**

Wenn gesetzt, werden die bekannten "Root"-CAs (wie VeriSign) mit den zusätzlichen Zertifikaten in `file` erweitert. Die Datei sollte aus einem oder mehreren vertrauenswürdigen Zertifikaten im PEM-Format bestehen. Eine Nachricht wird (einmalig) mit [`process.emitWarning()`](/de/nodejs/api/process#processemitwarningwarning-options) ausgegeben, wenn die Datei fehlt oder fehlerhaft ist, aber alle anderen Fehler werden ignoriert.

Weder die bekannten noch die zusätzlichen Zertifikate werden verwendet, wenn die `ca`-Options-Eigenschaft explizit für einen TLS- oder HTTPS-Client oder -Server angegeben wird.

Diese Umgebungsvariable wird ignoriert, wenn `node` als Setuid-Root ausgeführt wird oder Linux-Datei-Capabilities gesetzt hat.

Die Umgebungsvariable `NODE_EXTRA_CA_CERTS` wird nur gelesen, wenn der Node.js-Prozess zum ersten Mal gestartet wird. Das Ändern des Werts zur Laufzeit mit `process.env.NODE_EXTRA_CA_CERTS` hat keine Auswirkungen auf den aktuellen Prozess.

### `NODE_ICU_DATA=file` {#node_extra_ca_certs=file}

**Hinzugefügt in: v0.11.15**

Datenpfad für ICU (`Intl`-Objekt)-Daten. Erweitert verlinkte Daten, wenn mit Small-ICU-Unterstützung kompiliert.

### `NODE_NO_WARNINGS=1` {#node_icu_data=file}

**Hinzugefügt in: v6.11.0**

Wenn auf `1` gesetzt, werden Prozesswarnungen unterdrückt.

### `NODE_OPTIONS=options...` {#node_no_warnings=1}

**Hinzugefügt in: v8.0.0**

Eine durch Leerzeichen getrennte Liste von Befehlszeilenoptionen. `options...` werden vor Befehlszeilenoptionen interpretiert, sodass Befehlszeilenoptionen alles in `options...` überschreiben oder ergänzen. Node.js wird mit einem Fehler beendet, wenn eine Option verwendet wird, die in der Umgebung nicht zulässig ist, z. B. `-p` oder eine Skriptdatei.

Wenn ein Optionswert ein Leerzeichen enthält, kann er mit doppelten Anführungszeichen maskiert werden:

```bash [BASH]
NODE_OPTIONS='--require "./my path/file.js"'
```
Ein Singleton-Flag, das als Befehlszeilenoption übergeben wird, überschreibt dasselbe Flag, das an `NODE_OPTIONS` übergeben wird:

```bash [BASH]
# Der Inspektor ist auf Port 5555 verfügbar {#node_options=options}
NODE_OPTIONS='--inspect=localhost:4444' node --inspect=localhost:5555
```
Ein Flag, das mehrmals übergeben werden kann, wird so behandelt, als ob seine `NODE_OPTIONS`-Instanzen zuerst und dann seine Befehlszeileninstanzen danach übergeben würden:

```bash [BASH]
NODE_OPTIONS='--require "./a.js"' node --require "./b.js"
# entspricht: {#the-inspector-will-be-available-on-port-5555}
node --require "./a.js" --require "./b.js"
```
Node.js-Optionen, die zulässig sind, befinden sich in der folgenden Liste. Wenn eine Option sowohl --XX- als auch --no-XX-Varianten unterstützt, werden beide unterstützt, aber nur eine ist in der folgenden Liste enthalten.

- `--allow-addons`
- `--allow-child-process`
- `--allow-fs-read`
- `--allow-fs-write`
- `--allow-wasi`
- `--allow-worker`
- `--conditions`, `-C`
- `--diagnostic-dir`
- `--disable-proto`
- `--disable-warning`
- `--disable-wasm-trap-handler`
- `--dns-result-order`
- `--enable-fips`
- `--enable-network-family-autoselection`
- `--enable-source-maps`
- `--entry-url`
- `--experimental-abortcontroller`
- `--experimental-async-context-frame`
- `--experimental-detect-module`
- `--experimental-eventsource`
- `--experimental-import-meta-resolve`
- `--experimental-json-modules`
- `--experimental-loader`
- `--experimental-modules`
- `--experimental-permission`
- `--experimental-print-required-tla`
- `--experimental-require-module`
- `--experimental-shadow-realm`
- `--experimental-specifier-resolution`
- `--experimental-strip-types`
- `--experimental-top-level-await`
- `--experimental-transform-types`
- `--experimental-vm-modules`
- `--experimental-wasi-unstable-preview1`
- `--experimental-wasm-modules`
- `--experimental-webstorage`
- `--force-context-aware`
- `--force-fips`
- `--force-node-api-uncaught-exceptions-policy`
- `--frozen-intrinsics`
- `--heap-prof-dir`
- `--heap-prof-interval`
- `--heap-prof-name`
- `--heap-prof`
- `--heapsnapshot-near-heap-limit`
- `--heapsnapshot-signal`
- `--http-parser`
- `--icu-data-dir`
- `--import`
- `--input-type`
- `--insecure-http-parser`
- `--inspect-brk`
- `--inspect-port`, `--debug-port`
- `--inspect-publish-uid`
- `--inspect-wait`
- `--inspect`
- `--localstorage-file`
- `--max-http-header-size`
- `--napi-modules`
- `--network-family-autoselection-attempt-timeout`
- `--no-addons`
- `--no-deprecation`
- `--no-experimental-global-navigator`
- `--no-experimental-repl-await`
- `--no-experimental-sqlite`
- `--no-experimental-websocket`
- `--no-extra-info-on-fatal-exception`
- `--no-force-async-hooks-checks`
- `--no-global-search-paths`
- `--no-network-family-autoselection`
- `--no-warnings`
- `--node-memory-debug`
- `--openssl-config`
- `--openssl-legacy-provider`
- `--openssl-shared-config`
- `--pending-deprecation`
- `--permission`
- `--preserve-symlinks-main`
- `--preserve-symlinks`
- `--prof-process`
- `--redirect-warnings`
- `--report-compact`
- `--report-dir`, `--report-directory`
- `--report-exclude-env`
- `--report-exclude-network`
- `--report-filename`
- `--report-on-fatalerror`
- `--report-on-signal`
- `--report-signal`
- `--report-uncaught-exception`
- `--require`, `-r`
- `--secure-heap-min`
- `--secure-heap`
- `--snapshot-blob`
- `--test-coverage-branches`
- `--test-coverage-exclude`
- `--test-coverage-functions`
- `--test-coverage-include`
- `--test-coverage-lines`
- `--test-name-pattern`
- `--test-only`
- `--test-reporter-destination`
- `--test-reporter`
- `--test-shard`
- `--test-skip-pattern`
- `--throw-deprecation`
- `--title`
- `--tls-cipher-list`
- `--tls-keylog`
- `--tls-max-v1.2`
- `--tls-max-v1.3`
- `--tls-min-v1.0`
- `--tls-min-v1.1`
- `--tls-min-v1.2`
- `--tls-min-v1.3`
- `--trace-deprecation`
- `--trace-env-js-stack`
- `--trace-env-native-stack`
- `--trace-env`
- `--trace-event-categories`
- `--trace-event-file-pattern`
- `--trace-events-enabled`
- `--trace-exit`
- `--trace-require-module`
- `--trace-sigint`
- `--trace-sync-io`
- `--trace-tls`
- `--trace-uncaught`
- `--trace-warnings`
- `--track-heap-objects`
- `--unhandled-rejections`
- `--use-bundled-ca`
- `--use-largepages`
- `--use-openssl-ca`
- `--v8-pool-size`
- `--watch-path`
- `--watch-preserve-output`
- `--watch`
- `--zero-fill-buffers`

V8-Optionen, die zulässig sind, sind:

- `--abort-on-uncaught-exception`
- `--disallow-code-generation-from-strings`
- `--enable-etw-stack-walking`
- `--expose-gc`
- `--interpreted-frames-native-stack`
- `--jitless`
- `--max-old-space-size`
- `--max-semi-space-size`
- `--perf-basic-prof-only-functions`
- `--perf-basic-prof`
- `--perf-prof-unwinding-info`
- `--perf-prof`
- `--stack-trace-limit`

`--perf-basic-prof-only-functions`, `--perf-basic-prof`, `--perf-prof-unwinding-info` und `--perf-prof` sind nur unter Linux verfügbar.

`--enable-etw-stack-walking` ist nur unter Windows verfügbar.


### `NODE_PATH=Pfad[:…]` {#is-equivalent-to}

**Hinzugefügt in: v0.1.32**

`':'`-separierte Liste von Verzeichnissen, die dem Modulsuchpfad vorangestellt werden.

Unter Windows ist dies stattdessen eine `';'`-separierte Liste.

### `NODE_PENDING_DEPRECATION=1` {#node_path=path}

**Hinzugefügt in: v8.0.0**

Wenn auf `1` gesetzt, werden ausstehende Veraltungswarnungen ausgegeben.

Ausstehende Veraltungen sind im Allgemeinen identisch mit einer Laufzeitveraltung, mit der bemerkenswerten Ausnahme, dass sie standardmäßig *deaktiviert* sind und nur ausgegeben werden, wenn entweder das Kommandozeilen-Flag `--pending-deprecation` oder die Umgebungsvariable `NODE_PENDING_DEPRECATION=1` gesetzt ist. Ausstehende Veraltungen werden verwendet, um eine Art selektiven "Frühwarnmechanismus" bereitzustellen, den Entwickler nutzen können, um die Verwendung veralteter APIs zu erkennen.

### `NODE_PENDING_PIPE_INSTANCES=Instanzen` {#node_pending_deprecation=1}

Legt die Anzahl der ausstehenden Pipe-Instanz-Handles fest, wenn der Pipe-Server auf Verbindungen wartet. Diese Einstellung gilt nur für Windows.

### `NODE_PRESERVE_SYMLINKS=1` {#node_pending_pipe_instances=instances}

**Hinzugefügt in: v7.1.0**

Wenn auf `1` gesetzt, weist der Modul-Loader an, symbolische Links beim Auflösen und Cachen von Modulen beizubehalten.

### `NODE_REDIRECT_WARNINGS=Datei` {#node_preserve_symlinks=1}

**Hinzugefügt in: v8.0.0**

Wenn gesetzt, werden Prozesswarnungen in die angegebene Datei ausgegeben, anstatt auf stderr auszugeben. Die Datei wird erstellt, falls sie nicht existiert, und wird angehängt, falls sie existiert. Wenn beim Versuch, die Warnung in die Datei zu schreiben, ein Fehler auftritt, wird die Warnung stattdessen auf stderr geschrieben. Dies entspricht der Verwendung des Kommandozeilen-Flags `--redirect-warnings=Datei`.

### `NODE_REPL_EXTERNAL_MODULE=Datei` {#node_redirect_warnings=file}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v22.3.0, v20.16.0 | Entfernen Sie die Möglichkeit, diese Umgebungsvariable mit kDisableNodeOptionsEnv für Embedder zu verwenden. |
| v13.0.0, v12.16.0 | Hinzugefügt in: v13.0.0, v12.16.0 |
:::

Pfad zu einem Node.js-Modul, das anstelle der integrierten REPL geladen wird. Das Überschreiben dieses Werts mit einer leeren Zeichenkette (`''`) verwendet die integrierte REPL.

### `NODE_REPL_HISTORY=Datei` {#node_repl_external_module=file}

**Hinzugefügt in: v3.0.0**

Pfad zu der Datei, die zum Speichern des persistenten REPL-Verlaufs verwendet wird. Der Standardpfad ist `~/.node_repl_history`, der durch diese Variable überschrieben wird. Das Setzen des Werts auf eine leere Zeichenkette (`''` oder `' '`) deaktiviert den persistenten REPL-Verlauf.


### `NODE_SKIP_PLATFORM_CHECK=value` {#node_repl_history=file}

**Hinzugefügt in: v14.5.0**

Wenn `value` gleich `'1'` ist, wird die Überprüfung auf eine unterstützte Plattform während des Node.js-Starts übersprungen. Node.js wird möglicherweise nicht korrekt ausgeführt. Alle Probleme, die auf nicht unterstützten Plattformen auftreten, werden nicht behoben.

### `NODE_TEST_CONTEXT=value` {#node_skip_platform_check=value}

Wenn `value` gleich `'child'` ist, werden die Optionen des Test Reporters überschrieben und die Testausgabe wird im TAP-Format an stdout gesendet. Wenn ein anderer Wert angegeben wird, übernimmt Node.js keine Garantie für das verwendete Reporterformat oder dessen Stabilität.

### `NODE_TLS_REJECT_UNAUTHORIZED=value` {#node_test_context=value}

Wenn `value` gleich `'0'` ist, wird die Zertifikatsvalidierung für TLS-Verbindungen deaktiviert. Dies macht TLS und HTTPS im weiteren Sinne unsicher. Die Verwendung dieser Umgebungsvariable wird dringend abgeraten.

### `NODE_V8_COVERAGE=dir` {#node_tls_reject_unauthorized=value}

Wenn gesetzt, beginnt Node.js mit der Ausgabe von [V8 JavaScript Code Coverage](https://v8project.blogspot.com/2017/12/javascript-code-coverage) und [Source Map](https://sourcemaps.info/spec) Daten in das als Argument angegebene Verzeichnis (Coverage-Informationen werden als JSON in Dateien mit dem Präfix `coverage` geschrieben).

`NODE_V8_COVERAGE` wird automatisch an Subprozesse weitergegeben, was es einfacher macht, Anwendungen zu instrumentieren, die die `child_process.spawn()`-Familie von Funktionen aufrufen. `NODE_V8_COVERAGE` kann auf eine leere Zeichenkette gesetzt werden, um die Weitergabe zu verhindern.

### `NO_COLOR=&lt;beliebig&gt;` {#node_v8_coverage=dir}

[`NO_COLOR`](https://no-color.org/) ist ein Alias für `NODE_DISABLE_COLORS`. Der Wert der Umgebungsvariable ist beliebig.

#### Coverage-Ausgabe {#no_color=&lt;any&gt;}

Die Coverage wird als Array von [ScriptCoverage](https://chromedevtools.github.io/devtools-protocol/tot/Profiler#type-ScriptCoverage)-Objekten unter dem Schlüssel der obersten Ebene `result` ausgegeben:

```json [JSON]
{
  "result": [
    {
      "scriptId": "67",
      "url": "internal/tty.js",
      "functions": []
    }
  ]
}
```

#### Source-Map-Cache {#coverage-output}

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

Wenn gefunden, werden Source-Map-Daten an den Top-Level-Schlüssel `source-map-cache` im JSON-Coverage-Objekt angehängt.

`source-map-cache` ist ein Objekt, dessen Schlüssel die Dateien darstellen, aus denen die Source Maps extrahiert wurden, und dessen Werte die rohe Source-Map-URL (im Schlüssel `url`), die geparsten Source Map v3-Informationen (im Schlüssel `data`) und die Zeilenlängen der Quelldatei (im Schlüssel `lineLengths`) enthalten.

```json [JSON]
{
  "result": [
    {
      "scriptId": "68",
      "url": "file:///absolute/path/to/source.js",
      "functions": []
    }
  ],
  "source-map-cache": {
    "file:///absolute/path/to/source.js": {
      "url": "./path-to-map.json",
      "data": {
        "version": 3,
        "sources": [
          "file:///absolute/path/to/original.js"
        ],
        "names": [
          "Foo",
          "console",
          "info"
        ],
        "mappings": "MAAMA,IACJC,YAAaC",
        "sourceRoot": "./"
      },
      "lineLengths": [
        13,
        62,
        38,
        27
      ]
    }
  }
}
```

### `OPENSSL_CONF=file` {#source-map-cache}

**Hinzugefügt in: v6.11.0**

Lädt beim Start eine OpenSSL-Konfigurationsdatei. Unter anderem kann dies verwendet werden, um FIPS-konforme Kryptographie zu aktivieren, wenn Node.js mit `./configure --openssl-fips` erstellt wurde.

Wenn die Befehlszeilenoption [`--openssl-config`](/de/nodejs/api/cli#--openssl-configfile) verwendet wird, wird die Umgebungsvariable ignoriert.

### `SSL_CERT_DIR=dir` {#openssl_conf=file}

**Hinzugefügt in: v7.7.0**

Wenn `--use-openssl-ca` aktiviert ist, überschreibt diese das OpenSSL-Verzeichnis mit vertrauenswürdigen Zertifikaten und legt es fest.

Beachten Sie, dass diese Umgebungsvariable, sofern die Kindumgebung nicht explizit festgelegt wird, von allen Kindprozessen geerbt wird und, wenn diese OpenSSL verwenden, dazu führen kann, dass sie denselben CAs wie Node vertrauen.

### `SSL_CERT_FILE=file` {#ssl_cert_dir=dir}

**Hinzugefügt in: v7.7.0**

Wenn `--use-openssl-ca` aktiviert ist, überschreibt diese die OpenSSL-Datei mit vertrauenswürdigen Zertifikaten und legt sie fest.

Beachten Sie, dass diese Umgebungsvariable, sofern die Kindumgebung nicht explizit festgelegt wird, von allen Kindprozessen geerbt wird und, wenn diese OpenSSL verwenden, dazu führen kann, dass sie denselben CAs wie Node vertrauen.

### `TZ` {#ssl_cert_file=file}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v16.2.0 | Das Ändern der TZ-Variable mit process.env.TZ = ändert die Zeitzone auch unter Windows. |
| v13.0.0 | Das Ändern der TZ-Variable mit process.env.TZ = ändert die Zeitzone auf POSIX-Systemen. |
| v0.0.1 | Hinzugefügt in: v0.0.1 |
:::

Die Umgebungsvariable `TZ` wird verwendet, um die Zeitzonenkonfiguration anzugeben.

Während Node.js nicht alle verschiedenen [Arten unterstützt, wie `TZ` in anderen Umgebungen behandelt wird](https://www.gnu.org/software/libc/manual/html_node/TZ-Variable), unterstützt es grundlegende [Zeitzonen-IDs](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) (z. B. `'Etc/UTC'`, `'Europe/Paris'` oder `'America/New_York'`). Es unterstützt möglicherweise einige andere Abkürzungen oder Aliase, aber diese werden dringend davon abgeraten und sind nicht garantiert.

```bash [BASH]
$ TZ=Europe/Dublin node -pe "new Date().toString()"
Wed May 12 2021 20:30:48 GMT+0100 (Irish Standard Time)
```

### `UV_THREADPOOL_SIZE=size` {#tz}

Legt die Anzahl der Threads fest, die im Threadpool von libuv verwendet werden, auf `size` Threads.

Asynchrone System-APIs werden von Node.js nach Möglichkeit verwendet. Wenn sie jedoch nicht vorhanden sind, wird der Threadpool von libuv verwendet, um asynchrone Node-APIs basierend auf synchronen System-APIs zu erstellen. Node.js-APIs, die den Threadpool verwenden, sind:

- alle `fs`-APIs, mit Ausnahme der File-Watcher-APIs und derjenigen, die explizit synchron sind
- asynchrone Crypto-APIs wie `crypto.pbkdf2()`, `crypto.scrypt()`, `crypto.randomBytes()`, `crypto.randomFill()`, `crypto.generateKeyPair()`
- `dns.lookup()`
- alle `zlib`-APIs, mit Ausnahme derjenigen, die explizit synchron sind

Da der Threadpool von libuv eine feste Größe hat, bedeutet dies, dass, wenn aus irgendeinem Grund eine dieser APIs lange dauert, andere (scheinbar unabhängige) APIs, die im Threadpool von libuv ausgeführt werden, eine verminderte Leistung erfahren. Um dieses Problem zu mildern, besteht eine mögliche Lösung darin, die Größe des Threadpools von libuv zu erhöhen, indem die Umgebungsvariable `'UV_THREADPOOL_SIZE'` auf einen Wert größer als `4` (ihr aktueller Standardwert) gesetzt wird. Das Setzen dieser Variable innerhalb des Prozesses mit `process.env.UV_THREADPOOL_SIZE=size` funktioniert jedoch nicht garantiert, da der Threadpool als Teil der Laufzeitinitialisierung erstellt worden wäre, lange bevor der Benutzercode ausgeführt wird. Weitere Informationen finden Sie in der [libuv Threadpool-Dokumentation](https://docs.libuv.org/en/latest/threadpool).

## Nützliche V8-Optionen {#uv_threadpool_size=size}

V8 hat seine eigenen CLI-Optionen. Jede V8-CLI-Option, die an `node` übergeben wird, wird an V8 zur Bearbeitung weitergeleitet. Die Optionen von V8 haben *keine Stabilitätsgarantie*. Das V8-Team selbst betrachtet sie nicht als Teil seiner formalen API und behält sich das Recht vor, sie jederzeit zu ändern. Ebenso werden sie nicht von den Node.js-Stabilitätsgarantien abgedeckt. Viele der V8-Optionen sind nur für V8-Entwickler von Interesse. Trotzdem gibt es eine kleine Anzahl von V8-Optionen, die in Node.js weit verbreitet sind und hier dokumentiert werden:

### `--abort-on-uncaught-exception` {#useful-v8-options}


### `--disallow-code-generation-from-strings` {#--abort-on-uncaught-exception_1}

### `--enable-etw-stack-walking` {#--disallow-code-generation-from-strings_1}

### `--expose-gc` {#--enable-etw-stack-walking}

### `--harmony-shadow-realm` {#--expose-gc_1}

### `--interpreted-frames-native-stack` {#--harmony-shadow-realm}

### `--jitless` {#--interpreted-frames-native-stack}

### `--max-old-space-size=SIZE` (in MiB) {#--jitless_1}

Legt die maximale Speichergröße des alten Speicherbereichs von V8 fest. Wenn sich der Speicherverbrauch der Grenze nähert, wird V8 mehr Zeit mit der Garbage Collection verbringen, um ungenutzten Speicher freizugeben.

Auf einem Rechner mit 2 GiB Speicher sollte dies auf 1536 (1,5 GiB) gesetzt werden, um etwas Speicher für andere Zwecke zu lassen und Swapping zu vermeiden.

```bash [BASH]
node --max-old-space-size=1536 index.js
```
### `--max-semi-space-size=SIZE` (in MiB) {#--max-old-space-size=size-in-mib}

Legt die maximale [Semi-Space](https://www.memorymanagement.org/glossary/s#semi.space) Größe für den [Scavenge Garbage Collector](https://v8.dev/blog/orinoco-parallel-scavenger) von V8 in MiB (Mebibytes) fest. Das Erhöhen der maximalen Größe eines Semi-Space kann den Durchsatz für Node.js verbessern, geht aber mit einem höheren Speicherverbrauch einher.

Da die Größe der Young Generation des V8-Heaps das Dreifache der Größe des Semi-Space beträgt (siehe [`YoungGenerationSizeFromSemiSpaceSize`](https://chromium.googlesource.com/v8/v8.git/+/refs/tags/10.3.129/src/heap/heap.cc#328) in V8), bewirkt eine Erhöhung des Semi-Space um 1 MiB, dass jede der drei einzelnen Semi-Spaces um 1 MiB erhöht wird und die Heap-Größe um 3 MiB ansteigt. Die Verbesserung des Durchsatzes hängt von Ihrer Workload ab (siehe [#42511](https://github.com/nodejs/node/issues/42511)).

Der Standardwert hängt vom Speicherlimit ab. Auf 64-Bit-Systemen mit einem Speicherlimit von 512 MiB beträgt die maximale Größe eines Semi-Space standardmäßig 1 MiB. Bei Speicherlimits bis einschließlich 2 GiB ist die maximale Standardgröße eines Semi-Space auf 64-Bit-Systemen weniger als 16 MiB.

Um die beste Konfiguration für Ihre Anwendung zu erhalten, sollten Sie verschiedene max-semi-space-size Werte ausprobieren, wenn Sie Benchmarks für Ihre Anwendung ausführen.

Zum Beispiel Benchmark auf einem 64-Bit-System:

```bash [BASH]
for MiB in 16 32 64 128; do
    node --max-semi-space-size=$MiB index.js
done
```

### `--perf-basic-prof` {#--max-semi-space-size=size-in-mib}

### `--perf-basic-prof-only-functions` {#--perf-basic-prof}

### `--perf-prof` {#--perf-basic-prof-only-functions}

### `--perf-prof-unwinding-info` {#--perf-prof}

### `--prof` {#--perf-prof-unwinding-info}

### `--security-revert` {#--prof_1}

### `--stack-trace-limit=limit` {#--security-revert}

Die maximale Anzahl an Stack-Frames, die in einem Stack-Trace eines Fehlers erfasst werden sollen. Die Einstellung auf 0 deaktiviert die Stack-Trace-Erfassung. Der Standardwert ist 10.

```bash [BASH]
node --stack-trace-limit=12 -p -e "Error.stackTraceLimit" # prints 12
```

