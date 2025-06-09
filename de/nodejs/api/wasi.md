---
title: Node.js WASI Dokumentation
description: Erkunden Sie die Node.js-Dokumentation für die WebAssembly System Interface (WASI), die beschreibt, wie WASI in Node.js-Umgebungen verwendet wird, einschließlich APIs für Dateisystemoperationen, Umgebungsvariablen und mehr.
head:
  - - meta
    - name: og:title
      content: Node.js WASI Dokumentation | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Erkunden Sie die Node.js-Dokumentation für die WebAssembly System Interface (WASI), die beschreibt, wie WASI in Node.js-Umgebungen verwendet wird, einschließlich APIs für Dateisystemoperationen, Umgebungsvariablen und mehr.
  - - meta
    - name: twitter:title
      content: Node.js WASI Dokumentation | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Erkunden Sie die Node.js-Dokumentation für die WebAssembly System Interface (WASI), die beschreibt, wie WASI in Node.js-Umgebungen verwendet wird, einschließlich APIs für Dateisystemoperationen, Umgebungsvariablen und mehr.
---


# WebAssembly System Interface (WASI) {#webassembly-system-interface-wasi}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/de/nodejs/api/documentation#stability-index) [Stability: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

**Das Modul <code>node:wasi</code> bietet derzeit nicht die
umfassenden Dateisystemsicherheitseigenschaften, die von einigen WASI-Laufzeiten bereitgestellt werden.
Die vollständige Unterstützung für sicheres Dateisystem-Sandboxing kann in der
Zukunft implementiert werden oder auch nicht. Verwenden Sie es in der Zwischenzeit nicht, um nicht vertrauenswürdigen Code auszuführen.**

**Quellcode:** [lib/wasi.js](https://github.com/nodejs/node/blob/v23.5.0/lib/wasi.js)

Die WASI API bietet eine Implementierung der [WebAssembly System Interface](https://wasi.dev/) Spezifikation. WASI ermöglicht WebAssembly-Anwendungen über eine Sammlung von POSIX-ähnlichen Funktionen den Zugriff auf das zugrunde liegende Betriebssystem.

::: code-group
```js [ESM]
import { readFile } from 'node:fs/promises';
import { WASI } from 'node:wasi';
import { argv, env } from 'node:process';

const wasi = new WASI({
  version: 'preview1',
  args: argv,
  env,
  preopens: {
    '/local': '/some/real/path/that/wasm/can/access',
  },
});

const wasm = await WebAssembly.compile(
  await readFile(new URL('./demo.wasm', import.meta.url)),
);
const instance = await WebAssembly.instantiate(wasm, wasi.getImportObject());

wasi.start(instance);
```

```js [CJS]
'use strict';
const { readFile } = require('node:fs/promises');
const { WASI } = require('node:wasi');
const { argv, env } = require('node:process');
const { join } = require('node:path');

const wasi = new WASI({
  version: 'preview1',
  args: argv,
  env,
  preopens: {
    '/local': '/some/real/path/that/wasm/can/access',
  },
});

(async () => {
  const wasm = await WebAssembly.compile(
    await readFile(join(__dirname, 'demo.wasm')),
  );
  const instance = await WebAssembly.instantiate(wasm, wasi.getImportObject());

  wasi.start(instance);
})();
```
:::

Um das obige Beispiel auszuführen, erstellen Sie eine neue WebAssembly-Textformatdatei namens `demo.wat`:

```text [TEXT]
(module
    ;; Importiere die benötigte fd_write WASI Funktion, welche die gegebenen IO Vektoren nach stdout schreibt
    ;; Die Funktionssignatur für fd_write ist:
    ;; (File Descriptor, *iovs, iovs_len, nwritten) -> Gibt die Anzahl der geschriebenen Bytes zurück
    (import "wasi_snapshot_preview1" "fd_write" (func $fd_write (param i32 i32 i32 i32) (result i32)))

    (memory 1)
    (export "memory" (memory 0))

    ;; Schreibe 'hello world\n' in den Speicher an einem Offset von 8 Bytes
    ;; Beachte den abschließenden Zeilenumbruch, der erforderlich ist, damit der Text erscheint
    (data (i32.const 8) "hello world\n")

    (func $main (export "_start")
        ;; Erstellen eines neuen IO Vektors im linearen Speicher
        (i32.store (i32.const 0) (i32.const 8))  ;; iov.iov_base - Dies ist ein Pointer zum Beginn des 'hello world\n' Strings
        (i32.store (i32.const 4) (i32.const 12)) ;; iov.iov_len - Die Länge des 'hello world\n' Strings

        (call $fd_write
            (i32.const 1) ;; file_descriptor - 1 für stdout
            (i32.const 0) ;; *iovs - Der Pointer zum iov Array, welches an Speicherort 0 gespeichert ist
            (i32.const 1) ;; iovs_len - Wir drucken 1 String, der in einem iov gespeichert ist - also eins.
            (i32.const 20) ;; nwritten - Ein Platz im Speicher, um die Anzahl der geschriebenen Bytes zu speichern
        )
        drop ;; Verwerfe die Anzahl der geschriebenen Bytes vom oberen Ende des Stacks
    )
)
```
Verwenden Sie [wabt](https://github.com/WebAssembly/wabt), um `.wat` in `.wasm` zu kompilieren

```bash [BASH]
wat2wasm demo.wat
```

## Sicherheit {#security}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v21.2.0, v20.11.0 | WASI-Sicherheitseigenschaften klargestellt. |
| v21.2.0, v20.11.0 | Hinzugefügt in: v21.2.0, v20.11.0 |
:::

WASI bietet ein Capabilities-basiertes Modell, über das Anwendungen ihre eigenen benutzerdefinierten `env`-, `preopens`-, `stdin`-, `stdout`-, `stderr`- und `exit`-Capabilities erhalten.

**Das aktuelle Node.js-Bedrohungsmodell bietet keine sichere Sandboxing-Umgebung, wie sie in einigen WASI-Laufzeitumgebungen vorhanden ist.**

Obwohl die Capability-Funktionen unterstützt werden, bilden sie in Node.js kein Sicherheitsmodell. Beispielsweise kann die Dateisystem-Sandboxing mit verschiedenen Techniken umgangen werden. Das Projekt untersucht, ob diese Sicherheitsgarantien in Zukunft hinzugefügt werden könnten.

## Klasse: `WASI` {#class-wasi}

**Hinzugefügt in: v13.3.0, v12.16.0**

Die `WASI`-Klasse stellt die WASI-Systemaufruf-API und zusätzliche Hilfsmethoden für die Arbeit mit WASI-basierten Anwendungen bereit. Jede `WASI`-Instanz repräsentiert eine separate Umgebung.

### `new WASI([options])` {#new-wasioptions}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v20.1.0 | Der Standardwert von returnOnExit wurde auf true geändert. |
| v20.0.0 | Die Option version ist jetzt erforderlich und hat keinen Standardwert mehr. |
| v19.8.0 | Das Feld version wurde zu den Optionen hinzugefügt. |
| v13.3.0, v12.16.0 | Hinzugefügt in: v13.3.0, v12.16.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `args` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Ein Array von Strings, das die WebAssembly-Anwendung als Befehlszeilenargumente sieht. Das erste Argument ist der virtuelle Pfad zum WASI-Befehl selbst. **Standard:** `[]`.
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Ein Objekt ähnlich wie `process.env`, das die WebAssembly-Anwendung als ihre Umgebung sieht. **Standard:** `{}`.
    - `preopens` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Dieses Objekt repräsentiert die lokale Verzeichnisstruktur der WebAssembly-Anwendung. Die String-Schlüssel von `preopens` werden als Verzeichnisse innerhalb des Dateisystems behandelt. Die entsprechenden Werte in `preopens` sind die realen Pfade zu diesen Verzeichnissen auf dem Host-Rechner.
    - `returnOnExit` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Standardmäßig gibt `wasi.start()` mit dem angegebenen Exit-Code zurück, wenn WASI-Anwendungen `__wasi_proc_exit()` aufrufen, anstatt den Prozess zu beenden. Wenn diese Option auf `false` gesetzt ist, beendet der Node.js-Prozess stattdessen mit dem angegebenen Exit-Code. **Standard:** `true`.
    - `stdin` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Der Dateideskriptor, der als Standardeingabe in der WebAssembly-Anwendung verwendet wird. **Standard:** `0`.
    - `stdout` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Der Dateideskriptor, der als Standardausgabe in der WebAssembly-Anwendung verwendet wird. **Standard:** `1`.
    - `stderr` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Der Dateideskriptor, der als Standardfehlerausgabe in der WebAssembly-Anwendung verwendet wird. **Standard:** `2`.
    - `version` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die angeforderte WASI-Version. Derzeit werden nur die Versionen `unstable` und `preview1` unterstützt. Diese Option ist obligatorisch.


### `wasi.getImportObject()` {#wasigetimportobject}

**Hinzugefügt in: v19.8.0**

Gibt ein Importobjekt zurück, das an `WebAssembly.instantiate()` übergeben werden kann, wenn keine anderen WASM-Importe benötigt werden, die über die von WASI bereitgestellten hinausgehen.

Wenn die Version `unstable` an den Konstruktor übergeben wurde, wird Folgendes zurückgegeben:

```json [JSON]
{ wasi_unstable: wasi.wasiImport }
```
Wenn die Version `preview1` an den Konstruktor übergeben wurde oder keine Version angegeben wurde, wird Folgendes zurückgegeben:

```json [JSON]
{ wasi_snapshot_preview1: wasi.wasiImport }
```
### `wasi.start(instance)` {#wasistartinstance}

**Hinzugefügt in: v13.3.0, v12.16.0**

- `instance` [\<WebAssembly.Instance\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Instance)

Versucht, die Ausführung von `instance` als WASI-Befehl zu starten, indem der `_start()`-Export aufgerufen wird. Wenn `instance` keinen `_start()`-Export enthält oder `instance` einen `_initialize()`-Export enthält, wird eine Ausnahme ausgelöst.

`start()` erfordert, dass `instance` ein [`WebAssembly.Memory`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Memory) namens `memory` exportiert. Wenn `instance` keinen `memory`-Export hat, wird eine Ausnahme ausgelöst.

Wenn `start()` mehr als einmal aufgerufen wird, wird eine Ausnahme ausgelöst.

### `wasi.initialize(instance)` {#wasiinitializeinstance}

**Hinzugefügt in: v14.6.0, v12.19.0**

- `instance` [\<WebAssembly.Instance\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Instance)

Versucht, `instance` als WASI-Reaktor zu initialisieren, indem der `_initialize()`-Export aufgerufen wird, falls vorhanden. Wenn `instance` einen `_start()`-Export enthält, wird eine Ausnahme ausgelöst.

`initialize()` erfordert, dass `instance` ein [`WebAssembly.Memory`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Memory) namens `memory` exportiert. Wenn `instance` keinen `memory`-Export hat, wird eine Ausnahme ausgelöst.

Wenn `initialize()` mehr als einmal aufgerufen wird, wird eine Ausnahme ausgelöst.

### `wasi.wasiImport` {#wasiwasiimport}

**Hinzugefügt in: v13.3.0, v12.16.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

`wasiImport` ist ein Objekt, das die WASI-Systemaufruf-API implementiert. Dieses Objekt sollte als `wasi_snapshot_preview1`-Import während der Instanziierung einer [`WebAssembly.Instance`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Instance) übergeben werden.

