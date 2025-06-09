---
title: Node.js Veraltungen
description: Diese Seite dokumentiert veraltete Funktionen in Node.js und bietet Anleitungen, wie der Code aktualisiert werden kann, um veraltete APIs und Praktiken zu vermeiden.
head:
  - - meta
    - name: og:title
      content: Node.js Veraltungen | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Diese Seite dokumentiert veraltete Funktionen in Node.js und bietet Anleitungen, wie der Code aktualisiert werden kann, um veraltete APIs und Praktiken zu vermeiden.
  - - meta
    - name: twitter:title
      content: Node.js Veraltungen | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Diese Seite dokumentiert veraltete Funktionen in Node.js und bietet Anleitungen, wie der Code aktualisiert werden kann, um veraltete APIs und Praktiken zu vermeiden.
---


# Veraltete APIs {#deprecated-apis}

Node.js APIs können aus einem der folgenden Gründe als veraltet markiert werden:

- Die Verwendung der API ist unsicher.
- Eine verbesserte Alternative API ist verfügbar.
- In einer zukünftigen Hauptversion werden bahnbrechende Änderungen an der API erwartet.

Node.js verwendet vier Arten von Veraltungen:

- Nur Dokumentation
- Anwendung (nur Nicht-`node_modules`-Code)
- Laufzeit (gesamter Code)
- End-of-Life (Lebensende)

Eine Nur-Dokumentations-Veraltung ist eine, die nur in den Node.js API-Dokumenten zum Ausdruck kommt. Diese erzeugen keine Nebenwirkungen beim Ausführen von Node.js. Einige Nur-Dokumentations-Veraltungen lösen eine Laufzeitwarnung aus, wenn sie mit dem Flag [`--pending-deprecation`](/de/nodejs/api/cli#--pending-deprecation) (oder seiner Alternative, der Umgebungsvariable `NODE_PENDING_DEPRECATION=1`) gestartet werden, ähnlich wie Laufzeit-Veraltungen unten. Nur-Dokumentations-Veraltungen, die dieses Flag unterstützen, sind in der [Liste der veralteten APIs](/de/nodejs/api/deprecations#list-of-deprecated-apis) explizit als solche gekennzeichnet.

Eine Anwendungs-Veraltung nur für Nicht-`node_modules`-Code generiert standardmäßig eine Prozesswarnung, die das erste Mal, wenn die veraltete API in Code verwendet wird, der nicht aus `node_modules` geladen wird, nach `stderr` ausgegeben wird. Wenn das Kommandozeilen-Flag [`--throw-deprecation`](/de/nodejs/api/cli#--throw-deprecation) verwendet wird, verursacht eine Laufzeit-Veraltung das Auslösen eines Fehlers. Wenn [`--pending-deprecation`](/de/nodejs/api/cli#--pending-deprecation) verwendet wird, werden auch Warnungen für Code ausgegeben, der aus `node_modules` geladen wird.

Eine Laufzeit-Veraltung für gesamten Code ähnelt der Laufzeit-Veraltung für Nicht-`node_modules`-Code, mit der Ausnahme, dass sie auch eine Warnung für Code ausgibt, der aus `node_modules` geladen wird.

Eine End-of-Life-Veraltung wird verwendet, wenn eine Funktionalität aus Node.js entfernt wurde oder in Kürze entfernt wird.

## Widerruf von Veraltungen {#revoking-deprecations}

Gelegentlich kann die Veraltung einer API rückgängig gemacht werden. In solchen Situationen wird dieses Dokument mit Informationen aktualisiert, die für die Entscheidung relevant sind. Die Veraltungs-ID wird jedoch nicht geändert.

## Liste der veralteten APIs {#list-of-deprecated-apis}

### DEP0001: `http.OutgoingMessage.prototype.flush` {#dep0001-httpoutgoingmessageprototypeflush}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v14.0.0 | End-of-Life. |
| v6.12.0, v4.8.6 | Ein Veraltungscode wurde zugewiesen. |
| v1.6.0 | Laufzeit-Veraltung. |
:::

Typ: End-of-Life

`OutgoingMessage.prototype.flush()` wurde entfernt. Verwenden Sie stattdessen `OutgoingMessage.prototype.flushHeaders()`.


### DEP0002: `require('_linklist')` {#dep0002-require_linklist}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v8.0.0 | Lebensende. |
| v6.12.0 | Ein Veraltungscode wurde zugewiesen. |
| v5.0.0 | Laufzeit-Veraltung. |
:::

Typ: Lebensende

Das Modul `_linklist` ist veraltet. Bitte verwenden Sie eine Userland-Alternative.

### DEP0003: `_writableState.buffer` {#dep0003-_writablestatebuffer}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v14.0.0 | Lebensende. |
| v6.12.0, v4.8.6 | Ein Veraltungscode wurde zugewiesen. |
| v0.11.15 | Laufzeit-Veraltung. |
:::

Typ: Lebensende

`_writableState.buffer` wurde entfernt. Verwenden Sie stattdessen `_writableState.getBuffer()`.

### DEP0004: `CryptoStream.prototype.readyState` {#dep0004-cryptostreamprototypereadystate}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v10.0.0 | Lebensende. |
| v6.12.0, v4.8.6 | Ein Veraltungscode wurde zugewiesen. |
| v0.4.0 | Nur-Dokumentations-Veraltung. |
:::

Typ: Lebensende

Die Eigenschaft `CryptoStream.prototype.readyState` wurde entfernt.

### DEP0005: `Buffer()` Konstruktor {#dep0005-buffer-constructor}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v10.0.0 | Laufzeit-Veraltung. |
| v6.12.0 | Ein Veraltungscode wurde zugewiesen. |
| v6.0.0 | Nur-Dokumentations-Veraltung. |
:::

Typ: Anwendung (nur Code außerhalb von `node_modules`)

Die Funktion `Buffer()` und der Konstruktor `new Buffer()` sind aufgrund von API-Benutzerfreundlichkeitsproblemen, die zu unbeabsichtigten Sicherheitsproblemen führen können, veraltet.

Verwenden Sie alternativ eine der folgenden Methoden zum Erstellen von `Buffer`-Objekten:

- [`Buffer.alloc(size[, fill[, encoding]])`](/de/nodejs/api/buffer#static-method-bufferallocsize-fill-encoding): Erstellt einen `Buffer` mit *initialisiertem* Speicher.
- [`Buffer.allocUnsafe(size)`](/de/nodejs/api/buffer#static-method-bufferallocunsafesize): Erstellt einen `Buffer` mit *nicht initialisiertem* Speicher.
- [`Buffer.allocUnsafeSlow(size)`](/de/nodejs/api/buffer#static-method-bufferallocunsafeslowsize): Erstellt einen `Buffer` mit *nicht initialisiertem* Speicher.
- [`Buffer.from(array)`](/de/nodejs/api/buffer#static-method-bufferfromarray): Erstellt einen `Buffer` mit einer Kopie von `array`.
- [`Buffer.from(arrayBuffer[, byteOffset[, length]])`](/de/nodejs/api/buffer#static-method-bufferfromarraybuffer-byteoffset-length) - Erstellt einen `Buffer`, der das gegebene `arrayBuffer` umschließt.
- [`Buffer.from(buffer)`](/de/nodejs/api/buffer#static-method-bufferfrombuffer): Erstellt einen `Buffer`, der `buffer` kopiert.
- [`Buffer.from(string[, encoding])`](/de/nodejs/api/buffer#static-method-bufferfromstring-encoding): Erstellt einen `Buffer`, der `string` kopiert.

Ohne `--pending-deprecation` treten Laufzeitwarnungen nur für Code außerhalb von `node_modules` auf. Das bedeutet, dass es keine Veraltungswarnungen für die Verwendung von `Buffer()` in Abhängigkeiten gibt. Mit `--pending-deprecation` führt die Verwendung von `Buffer()` immer zu einer Laufzeitwarnung, unabhängig davon, wo sie auftritt.


### DEP0006: `child_process` `options.customFds` {#dep0006-child_process-optionscustomfds}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v12.0.0 | End-of-Life. |
| v6.12.0, v4.8.6 | Ein Deprecation-Code wurde zugewiesen. |
| v0.11.14 | Laufzeit-Deprecation. |
| v0.5.10 | Nur-Dokumentations-Deprecation. |
:::

Typ: End-of-Life

Innerhalb der `spawn()`, `fork()` und `exec()`-Methoden des [`child_process`](/de/nodejs/api/child_process)-Moduls ist die Option `options.customFds` veraltet. Stattdessen sollte die Option `options.stdio` verwendet werden.

### DEP0007: Ersetzen Sie `cluster` `worker.suicide` durch `worker.exitedAfterDisconnect` {#dep0007-replace-cluster-workersuicide-with-workerexitedafterdisconnect}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v9.0.0 | End-of-Life. |
| v7.0.0 | Laufzeit-Deprecation. |
| v6.12.0 | Ein Deprecation-Code wurde zugewiesen. |
| v6.0.0 | Nur-Dokumentations-Deprecation. |
:::

Typ: End-of-Life

In einer früheren Version des Node.js `cluster` wurde dem `Worker`-Objekt eine boolesche Eigenschaft namens `suicide` hinzugefügt. Die Absicht dieser Eigenschaft war es, einen Hinweis darauf zu geben, wie und warum die `Worker`-Instanz beendet wurde. In Node.js 6.0.0 wurde die alte Eigenschaft als veraltet markiert und durch eine neue [`worker.exitedAfterDisconnect`](/de/nodejs/api/cluster#workerexitedafterdisconnect)-Eigenschaft ersetzt. Der alte Eigenschaftsname beschrieb die tatsächliche Semantik nicht präzise und war unnötig emotional belastet.

### DEP0008: `require('node:constants')` {#dep0008-requirenodeconstants}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v6.12.0 | Ein Deprecation-Code wurde zugewiesen. |
| v6.3.0 | Nur-Dokumentations-Deprecation. |
:::

Typ: Nur-Dokumentations-Deprecation

Das `node:constants`-Modul ist veraltet. Wenn Entwickler Zugriff auf Konstanten benötigen, die für bestimmte Node.js-Built-in-Module relevant sind, sollten sie stattdessen auf die `constants`-Eigenschaft verweisen, die vom jeweiligen Modul bereitgestellt wird. Zum Beispiel `require('node:fs').constants` und `require('node:os').constants`.

### DEP0009: `crypto.pbkdf2` ohne Digest {#dep0009-cryptopbkdf2-without-digest}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v14.0.0 | End-of-Life (für `digest === null`). |
| v11.0.0 | Laufzeit-Deprecation (für `digest === null`). |
| v8.0.0 | End-of-Life (für `digest === undefined`). |
| v6.12.0 | Ein Deprecation-Code wurde zugewiesen. |
| v6.0.0 | Laufzeit-Deprecation (für `digest === undefined`). |
:::

Typ: End-of-Life

Die Verwendung der [`crypto.pbkdf2()`](/de/nodejs/api/crypto#cryptopbkdf2password-salt-iterations-keylen-digest-callback)-API ohne Angabe eines Digest wurde in Node.js 6.0 als veraltet markiert, da die Methode standardmäßig den nicht empfohlenen `'SHA1'`-Digest verwendete. Zuvor wurde eine Deprecation-Warnung ausgegeben. Ab Node.js 8.0.0 löst der Aufruf von `crypto.pbkdf2()` oder `crypto.pbkdf2Sync()` mit `digest` auf `undefined` einen `TypeError` aus.

Ab Node.js v11.0.0 würde der Aufruf dieser Funktionen mit `digest` auf `null` eine Deprecation-Warnung ausgeben, um sich an das Verhalten anzupassen, wenn `digest` `undefined` ist.

Jetzt löst die Übergabe von entweder `undefined` oder `null` jedoch einen `TypeError` aus.


### DEP0010: `crypto.createCredentials` {#dep0010-cryptocreatecredentials}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v11.0.0 | End-of-Life. |
| v6.12.0, v4.8.6 | Ein Deprecation-Code wurde zugewiesen. |
| v0.11.13 | Laufzeit-Deprecation. |
:::

Typ: End-of-Life

Die `crypto.createCredentials()` API wurde entfernt. Bitte verwenden Sie stattdessen [`tls.createSecureContext()`](/de/nodejs/api/tls#tlscreatesecurecontextoptions).

### DEP0011: `crypto.Credentials` {#dep0011-cryptocredentials}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v11.0.0 | End-of-Life. |
| v6.12.0, v4.8.6 | Ein Deprecation-Code wurde zugewiesen. |
| v0.11.13 | Laufzeit-Deprecation. |
:::

Typ: End-of-Life

Die `crypto.Credentials` Klasse wurde entfernt. Bitte verwenden Sie stattdessen [`tls.SecureContext`](/de/nodejs/api/tls#tlscreatesecurecontextoptions).

### DEP0012: `Domain.dispose` {#dep0012-domaindispose}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v9.0.0 | End-of-Life. |
| v6.12.0, v4.8.6 | Ein Deprecation-Code wurde zugewiesen. |
| v0.11.7 | Laufzeit-Deprecation. |
:::

Typ: End-of-Life

`Domain.dispose()` wurde entfernt. Stellen Sie fehlerhafte I/O-Aktionen explizit über Fehler-Event-Handler wieder her, die auf der Domain gesetzt sind.

### DEP0013: `fs` asynchrone Funktion ohne Callback {#dep0013-fs-asynchronous-function-without-callback}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v10.0.0 | End-of-Life. |
| v7.0.0 | Laufzeit-Deprecation. |
:::

Typ: End-of-Life

Das Aufrufen einer asynchronen Funktion ohne Callback wirft ab Node.js 10.0.0 einen `TypeError`. Siehe [https://github.com/nodejs/node/pull/12562](https://github.com/nodejs/node/pull/12562).

### DEP0014: `fs.read` Legacy-String-Schnittstelle {#dep0014-fsread-legacy-string-interface}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v8.0.0 | End-of-Life. |
| v6.0.0 | Laufzeit-Deprecation. |
| v6.12.0, v4.8.6 | Ein Deprecation-Code wurde zugewiesen. |
| v0.1.96 | Deprecation nur in der Dokumentation. |
:::

Typ: End-of-Life

Die Legacy [`fs.read()`](/de/nodejs/api/fs#fsreadfd-buffer-offset-length-position-callback) `String`-Schnittstelle ist veraltet. Verwenden Sie stattdessen die `Buffer`-API, wie in der Dokumentation erwähnt.

### DEP0015: `fs.readSync` Legacy-String-Schnittstelle {#dep0015-fsreadsync-legacy-string-interface}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v8.0.0 | End-of-Life. |
| v6.0.0 | Laufzeit-Deprecation. |
| v6.12.0, v4.8.6 | Ein Deprecation-Code wurde zugewiesen. |
| v0.1.96 | Deprecation nur in der Dokumentation. |
:::

Typ: End-of-Life

Die Legacy [`fs.readSync()`](/de/nodejs/api/fs#fsreadsyncfd-buffer-offset-length-position) `String`-Schnittstelle ist veraltet. Verwenden Sie stattdessen die `Buffer`-API, wie in der Dokumentation erwähnt.


### DEP0016: `GLOBAL`/`root` {#dep0016-global/root}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v14.0.0 | End-of-Life. |
| v6.12.0 | Ein Deprecation-Code wurde zugewiesen. |
| v6.0.0 | Laufzeit-Deprecation. |
:::

Typ: End-of-Life

Die Aliase `GLOBAL` und `root` für die Eigenschaft `global` wurden in Node.js 6.0.0 als veraltet markiert und wurden seither entfernt.

### DEP0017: `Intl.v8BreakIterator` {#dep0017-intlv8breakiterator}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v9.0.0 | End-of-Life. |
| v7.0.0 | Laufzeit-Deprecation. |
:::

Typ: End-of-Life

`Intl.v8BreakIterator` war eine nicht standardmäßige Erweiterung und wurde entfernt. Siehe [`Intl.Segmenter`](https://github.com/tc39/proposal-intl-segmenter).

### DEP0018: Unbehandelte Promise-Abweisungen {#dep0018-unhandled-promise-rejections}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v15.0.0 | End-of-Life. |
| v7.0.0 | Laufzeit-Deprecation. |
:::

Typ: End-of-Life

Unbehandelte Promise-Abweisungen sind veraltet. Standardmäßig beenden Promise-Abweisungen, die nicht behandelt werden, den Node.js-Prozess mit einem Exit-Code ungleich Null. Um die Art und Weise zu ändern, wie Node.js unbehandelte Abweisungen behandelt, verwenden Sie die Befehlszeilenoption [`--unhandled-rejections`](/de/nodejs/api/cli#--unhandled-rejectionsmode).

### DEP0019: `require('.')` außerhalb des Verzeichnisses aufgelöst {#dep0019-require-resolved-outside-directory}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v12.0.0 | Funktionalität entfernt. |
| v6.12.0, v4.8.6 | Ein Deprecation-Code wurde zugewiesen. |
| v1.8.1 | Laufzeit-Deprecation. |
:::

Typ: End-of-Life

In bestimmten Fällen konnte `require('.')` außerhalb des Paketverzeichnisses aufgelöst werden. Dieses Verhalten wurde entfernt.

### DEP0020: `Server.connections` {#dep0020-serverconnections}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v15.0.0 | Server.connections wurde entfernt. |
| v6.12.0, v4.8.6 | Ein Deprecation-Code wurde zugewiesen. |
| v0.9.7 | Laufzeit-Deprecation. |
:::

Typ: End-of-Life

Die Eigenschaft `Server.connections` wurde in Node.js v0.9.7 als veraltet markiert und wurde entfernt. Verwenden Sie stattdessen die Methode [`Server.getConnections()`](/de/nodejs/api/net#servergetconnectionscallback).

### DEP0021: `Server.listenFD` {#dep0021-serverlistenfd}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v12.0.0 | End-of-Life. |
| v6.12.0, v4.8.6 | Ein Deprecation-Code wurde zugewiesen. |
| v0.7.12 | Laufzeit-Deprecation. |
:::

Typ: End-of-Life

Die Methode `Server.listenFD()` wurde als veraltet markiert und entfernt. Verwenden Sie stattdessen [`Server.listen({fd: \<number\>})`](/de/nodejs/api/net#serverlistenhandle-backlog-callback).


### DEP0022: `os.tmpDir()` {#dep0022-ostmpdir}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v14.0.0 | End-of-Life. |
| v7.0.0 | Laufzeit-Veraltung. |
:::

Typ: End-of-Life

Die `os.tmpDir()` API wurde in Node.js 7.0.0 als veraltet markiert und wurde inzwischen entfernt. Bitte verwenden Sie stattdessen [`os.tmpdir()`](/de/nodejs/api/os#ostmpdir).

### DEP0023: `os.getNetworkInterfaces()` {#dep0023-osgetnetworkinterfaces}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v12.0.0 | End-of-Life. |
| v6.12.0, v4.8.6 | Ein Veraltungscode wurde zugewiesen. |
| v0.6.0 | Laufzeit-Veraltung. |
:::

Typ: End-of-Life

Die `os.getNetworkInterfaces()` Methode ist veraltet. Bitte verwenden Sie stattdessen die [`os.networkInterfaces()`](/de/nodejs/api/os#osnetworkinterfaces) Methode.

### DEP0024: `REPLServer.prototype.convertToContext()` {#dep0024-replserverprototypeconverttocontext}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v9.0.0 | End-of-Life. |
| v7.0.0 | Laufzeit-Veraltung. |
:::

Typ: End-of-Life

Die `REPLServer.prototype.convertToContext()` API wurde entfernt.

### DEP0025: `require('node:sys')` {#dep0025-requirenodesys}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v6.12.0, v4.8.6 | Ein Veraltungscode wurde zugewiesen. |
| v1.0.0 | Laufzeit-Veraltung. |
:::

Typ: Laufzeit

Das `node:sys` Modul ist veraltet. Bitte verwenden Sie stattdessen das [`util`](/de/nodejs/api/util) Modul.

### DEP0026: `util.print()` {#dep0026-utilprint}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v12.0.0 | End-of-Life. |
| v6.12.0, v4.8.6 | Ein Veraltungscode wurde zugewiesen. |
| v0.11.3 | Laufzeit-Veraltung. |
:::

Typ: End-of-Life

`util.print()` wurde entfernt. Bitte verwenden Sie stattdessen [`console.log()`](/de/nodejs/api/console#consolelogdata-args).

### DEP0027: `util.puts()` {#dep0027-utilputs}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v12.0.0 | End-of-Life. |
| v6.12.0, v4.8.6 | Ein Veraltungscode wurde zugewiesen. |
| v0.11.3 | Laufzeit-Veraltung. |
:::

Typ: End-of-Life

`util.puts()` wurde entfernt. Bitte verwenden Sie stattdessen [`console.log()`](/de/nodejs/api/console#consolelogdata-args).

### DEP0028: `util.debug()` {#dep0028-utildebug}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v12.0.0 | End-of-Life. |
| v6.12.0, v4.8.6 | Ein Veraltungscode wurde zugewiesen. |
| v0.11.3 | Laufzeit-Veraltung. |
:::

Typ: End-of-Life

`util.debug()` wurde entfernt. Bitte verwenden Sie stattdessen [`console.error()`](/de/nodejs/api/console#consoleerrordata-args).


### DEP0029: `util.error()` {#dep0029-utilerror}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v12.0.0 | End-of-Life. |
| v6.12.0, v4.8.6 | Ein Deprecation-Code wurde zugewiesen. |
| v0.11.3 | Runtime-Deprecation. |
:::

Typ: End-of-Life

`util.error()` wurde entfernt. Bitte verwenden Sie stattdessen [`console.error()`](/de/nodejs/api/console#consoleerrordata-args).

### DEP0030: `SlowBuffer` {#dep0030-slowbuffer}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v6.12.0 | Ein Deprecation-Code wurde zugewiesen. |
| v6.0.0 | Documentation-only-Deprecation. |
:::

Typ: Documentation-only

Die [`SlowBuffer`](/de/nodejs/api/buffer#class-slowbuffer)-Klasse ist veraltet. Bitte verwenden Sie stattdessen [`Buffer.allocUnsafeSlow(size)`](/de/nodejs/api/buffer#static-method-bufferallocunsafeslowsize).

### DEP0031: `ecdh.setPublicKey()` {#dep0031-ecdhsetpublickey}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v6.12.0 | Ein Deprecation-Code wurde zugewiesen. |
| v5.2.0 | Documentation-only-Deprecation. |
:::

Typ: Documentation-only

Die [`ecdh.setPublicKey()`](/de/nodejs/api/crypto#ecdhsetpublickeypublickey-encoding)-Methode ist jetzt veraltet, da ihre Aufnahme in die API nicht nützlich ist.

### DEP0032: `node:domain` Modul {#dep0032-nodedomain-module}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v6.12.0, v4.8.6 | Ein Deprecation-Code wurde zugewiesen. |
| v1.4.2 | Documentation-only-Deprecation. |
:::

Typ: Documentation-only

Das [`domain`](/de/nodejs/api/domain)-Modul ist veraltet und sollte nicht verwendet werden.

### DEP0033: `EventEmitter.listenerCount()` {#dep0033-eventemitterlistenercount}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v6.12.0, v4.8.6 | Ein Deprecation-Code wurde zugewiesen. |
| v3.2.0 | Documentation-only-Deprecation. |
:::

Typ: Documentation-only

Die [`events.listenerCount(emitter, eventName)`](/de/nodejs/api/events#eventslistenercountemitter-eventname)-API ist veraltet. Bitte verwenden Sie stattdessen [`emitter.listenerCount(eventName)`](/de/nodejs/api/events#emitterlistenercounteventname-listener).

### DEP0034: `fs.exists(path, callback)` {#dep0034-fsexistspath-callback}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v6.12.0, v4.8.6 | Ein Deprecation-Code wurde zugewiesen. |
| v1.0.0 | Documentation-only-Deprecation. |
:::

Typ: Documentation-only

Die [`fs.exists(path, callback)`](/de/nodejs/api/fs#fsexistspath-callback)-API ist veraltet. Bitte verwenden Sie stattdessen [`fs.stat()`](/de/nodejs/api/fs#fsstatpath-options-callback) oder [`fs.access()`](/de/nodejs/api/fs#fsaccesspath-mode-callback).


### DEP0035: `fs.lchmod(Pfad, Modus, Callback)` {#dep0035-fslchmodpath-mode-callback}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v6.12.0, v4.8.6 | Ein Deprecation-Code wurde zugewiesen. |
| v0.4.7 | Nur-Dokumentations-Deprecation. |
:::

Typ: Nur-Dokumentation

Die [`fs.lchmod(Pfad, Modus, Callback)`](/de/nodejs/api/fs#fslchmodpath-mode-callback)-API ist veraltet.

### DEP0036: `fs.lchmodSync(Pfad, Modus)` {#dep0036-fslchmodsyncpath-mode}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v6.12.0, v4.8.6 | Ein Deprecation-Code wurde zugewiesen. |
| v0.4.7 | Nur-Dokumentations-Deprecation. |
:::

Typ: Nur-Dokumentation

Die [`fs.lchmodSync(Pfad, Modus)`](/de/nodejs/api/fs#fslchmodsyncpath-mode)-API ist veraltet.

### DEP0037: `fs.lchown(Pfad, Uid, Gid, Callback)` {#dep0037-fslchownpath-uid-gid-callback}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v10.6.0 | Deprecation wurde widerrufen. |
| v6.12.0, v4.8.6 | Ein Deprecation-Code wurde zugewiesen. |
| v0.4.7 | Nur-Dokumentations-Deprecation. |
:::

Typ: Deprecation widerrufen

Die [`fs.lchown(Pfad, Uid, Gid, Callback)`](/de/nodejs/api/fs#fslchownpath-uid-gid-callback)-API war veraltet. Die Deprecation wurde widerrufen, da die erforderlichen unterstützenden APIs in libuv hinzugefügt wurden.

### DEP0038: `fs.lchownSync(Pfad, Uid, Gid)` {#dep0038-fslchownsyncpath-uid-gid}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v10.6.0 | Deprecation wurde widerrufen. |
| v6.12.0, v4.8.6 | Ein Deprecation-Code wurde zugewiesen. |
| v0.4.7 | Nur-Dokumentations-Deprecation. |
:::

Typ: Deprecation widerrufen

Die [`fs.lchownSync(Pfad, Uid, Gid)`](/de/nodejs/api/fs#fslchownsyncpath-uid-gid)-API war veraltet. Die Deprecation wurde widerrufen, da die erforderlichen unterstützenden APIs in libuv hinzugefügt wurden.

### DEP0039: `require.extensions` {#dep0039-requireextensions}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v6.12.0, v4.8.6 | Ein Deprecation-Code wurde zugewiesen. |
| v0.10.6 | Nur-Dokumentations-Deprecation. |
:::

Typ: Nur-Dokumentation

Die [`require.extensions`](/de/nodejs/api/modules#requireextensions)-Eigenschaft ist veraltet.

### DEP0040: `node:punycode`-Modul {#dep0040-nodepunycode-module}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v21.0.0 | Laufzeit-Deprecation. |
| v16.6.0 | Unterstützung für `--pending-deprecation` hinzugefügt. |
| v7.0.0 | Nur-Dokumentations-Deprecation. |
:::

Typ: Laufzeit

Das [`punycode`](/de/nodejs/api/punycode)-Modul ist veraltet. Bitte verwenden Sie stattdessen eine Userland-Alternative.


### DEP0041: `NODE_REPL_HISTORY_FILE` Umgebungsvariable {#dep0041-node_repl_history_file-environment-variable}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v10.0.0 | End-of-Life. |
| v6.12.0, v4.8.6 | Ein Deprecation-Code wurde zugewiesen. |
| v3.0.0 | Nur-Dokumentations-Deprecation. |
:::

Typ: End-of-Life

Die Umgebungsvariable `NODE_REPL_HISTORY_FILE` wurde entfernt. Bitte verwenden Sie stattdessen `NODE_REPL_HISTORY`.

### DEP0042: `tls.CryptoStream` {#dep0042-tlscryptostream}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v10.0.0 | End-of-Life. |
| v6.12.0, v4.8.6 | Ein Deprecation-Code wurde zugewiesen. |
| v0.11.3 | Nur-Dokumentations-Deprecation. |
:::

Typ: End-of-Life

Die Klasse [`tls.CryptoStream`](/de/nodejs/api/tls#class-tlscryptostream) wurde entfernt. Bitte verwenden Sie stattdessen [`tls.TLSSocket`](/de/nodejs/api/tls#class-tlstlssocket).

### DEP0043: `tls.SecurePair` {#dep0043-tlssecurepair}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v8.0.0 | Laufzeit-Deprecation. |
| v6.12.0 | Ein Deprecation-Code wurde zugewiesen. |
| v6.0.0 | Nur-Dokumentations-Deprecation. |
| v0.11.15 | Deprecation widerrufen. |
| v0.11.3 | Laufzeit-Deprecation. |
:::

Typ: Nur-Dokumentation

Die Klasse [`tls.SecurePair`](/de/nodejs/api/tls#class-tlssecurepair) ist veraltet. Bitte verwenden Sie stattdessen [`tls.TLSSocket`](/de/nodejs/api/tls#class-tlstlssocket).

### DEP0044: `util.isArray()` {#dep0044-utilisarray}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v22.0.0 | Laufzeit-Deprecation. |
| v6.12.0, v4.8.6 | Ein Deprecation-Code wurde zugewiesen. |
| v4.0.0, v3.3.1 | Nur-Dokumentations-Deprecation. |
:::

Typ: Laufzeit

Die API [`util.isArray()`](/de/nodejs/api/util#utilisarrayobject) ist veraltet. Bitte verwenden Sie stattdessen `Array.isArray()`.

### DEP0045: `util.isBoolean()` {#dep0045-utilisboolean}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v23.0.0 | End-of-Life Deprecation. |
| v22.0.0 | Laufzeit-Deprecation. |
| v6.12.0, v4.8.6 | Ein Deprecation-Code wurde zugewiesen. |
| v4.0.0, v3.3.1 | Nur-Dokumentations-Deprecation. |
:::

Typ: End-of-Life

Die API `util.isBoolean()` wurde entfernt. Bitte verwenden Sie stattdessen `typeof arg === 'boolean'`.

### DEP0046: `util.isBuffer()` {#dep0046-utilisbuffer}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v23.0.0 | End-of-Life Deprecation. |
| v22.0.0 | Laufzeit-Deprecation. |
| v6.12.0, v4.8.6 | Ein Deprecation-Code wurde zugewiesen. |
| v4.0.0, v3.3.1 | Nur-Dokumentations-Deprecation. |
:::

Typ: End-of-Life

Die API `util.isBuffer()` wurde entfernt. Bitte verwenden Sie stattdessen [`Buffer.isBuffer()`](/de/nodejs/api/buffer#static-method-bufferisbufferobj).


### DEP0047: `util.isDate()` {#dep0047-utilisdate}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v23.0.0 | End-of-Life-Missbilligung. |
| v22.0.0 | Laufzeit-Missbilligung. |
| v6.12.0, v4.8.6 | Ein Missbilligungs-Code wurde zugewiesen. |
| v4.0.0, v3.3.1 | Nur-Dokumentations-Missbilligung. |
:::

Typ: End-of-Life

Die `util.isDate()`-API wurde entfernt. Bitte verwenden Sie stattdessen `arg instanceof Date`.

### DEP0048: `util.isError()` {#dep0048-utiliserror}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v23.0.0 | End-of-Life-Missbilligung. |
| v22.0.0 | Laufzeit-Missbilligung. |
| v6.12.0, v4.8.6 | Ein Missbilligungs-Code wurde zugewiesen. |
| v4.0.0, v3.3.1 | Nur-Dokumentations-Missbilligung. |
:::

Typ: End-of-Life

Die `util.isError()`-API wurde entfernt. Bitte verwenden Sie stattdessen `Object.prototype.toString(arg) === '[object Error]' || arg instanceof Error`.

### DEP0049: `util.isFunction()` {#dep0049-utilisfunction}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v23.0.0 | End-of-Life-Missbilligung. |
| v22.0.0 | Laufzeit-Missbilligung. |
| v6.12.0, v4.8.6 | Ein Missbilligungs-Code wurde zugewiesen. |
| v4.0.0, v3.3.1 | Nur-Dokumentations-Missbilligung. |
:::

Typ: End-of-Life

Die `util.isFunction()`-API wurde entfernt. Bitte verwenden Sie stattdessen `typeof arg === 'function'`.

### DEP0050: `util.isNull()` {#dep0050-utilisnull}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v23.0.0 | End-of-Life-Missbilligung. |
| v22.0.0 | Laufzeit-Missbilligung. |
| v6.12.0, v4.8.6 | Ein Missbilligungs-Code wurde zugewiesen. |
| v4.0.0, v3.3.1 | Nur-Dokumentations-Missbilligung. |
:::

Typ: End-of-Life

Die `util.isNull()`-API wurde entfernt. Bitte verwenden Sie stattdessen `arg === null`.

### DEP0051: `util.isNullOrUndefined()` {#dep0051-utilisnullorundefined}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v23.0.0 | End-of-Life-Missbilligung. |
| v22.0.0 | Laufzeit-Missbilligung. |
| v6.12.0, v4.8.6 | Ein Missbilligungs-Code wurde zugewiesen. |
| v4.0.0, v3.3.1 | Nur-Dokumentations-Missbilligung. |
:::

Typ: End-of-Life

Die `util.isNullOrUndefined()`-API wurde entfernt. Bitte verwenden Sie stattdessen `arg === null || arg === undefined`.


### DEP0052: `util.isNumber()` {#dep0052-utilisnumber}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v23.0.0 | Endgültige Stilllegung. |
| v22.0.0 | Laufzeit-Stilllegung. |
| v6.12.0, v4.8.6 | Ein Stilllegungscode wurde zugewiesen. |
| v4.0.0, v3.3.1 | Nur Dokumentations-Stilllegung. |
:::

Typ: Endgültige Stilllegung

Die `util.isNumber()`-API wurde entfernt. Bitte verwende stattdessen `typeof arg === 'number'`.

### DEP0053: `util.isObject()` {#dep0053-utilisobject}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v23.0.0 | Endgültige Stilllegung. |
| v22.0.0 | Laufzeit-Stilllegung. |
| v6.12.0, v4.8.6 | Ein Stilllegungscode wurde zugewiesen. |
| v4.0.0, v3.3.1 | Nur Dokumentations-Stilllegung. |
:::

Typ: Endgültige Stilllegung

Die `util.isObject()`-API wurde entfernt. Bitte verwende stattdessen `arg && typeof arg === 'object'`.

### DEP0054: `util.isPrimitive()` {#dep0054-utilisprimitive}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v23.0.0 | Endgültige Stilllegung. |
| v22.0.0 | Laufzeit-Stilllegung. |
| v6.12.0, v4.8.6 | Ein Stilllegungscode wurde zugewiesen. |
| v4.0.0, v3.3.1 | Nur Dokumentations-Stilllegung. |
:::

Typ: Endgültige Stilllegung

Die `util.isPrimitive()`-API wurde entfernt. Bitte verwende stattdessen `arg === null || (typeof arg !=='object' && typeof arg !== 'function')`.

### DEP0055: `util.isRegExp()` {#dep0055-utilisregexp}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v23.0.0 | Endgültige Stilllegung. |
| v22.0.0 | Laufzeit-Stilllegung. |
| v6.12.0, v4.8.6 | Ein Stilllegungscode wurde zugewiesen. |
| v4.0.0, v3.3.1 | Nur Dokumentations-Stilllegung. |
:::

Typ: Endgültige Stilllegung

Die `util.isRegExp()`-API wurde entfernt. Bitte verwende stattdessen `arg instanceof RegExp`.

### DEP0056: `util.isString()` {#dep0056-utilisstring}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v23.0.0 | Endgültige Stilllegung. |
| v22.0.0 | Laufzeit-Stilllegung. |
| v6.12.0, v4.8.6 | Ein Stilllegungscode wurde zugewiesen. |
| v4.0.0, v3.3.1 | Nur Dokumentations-Stilllegung. |
:::

Typ: Endgültige Stilllegung

Die `util.isString()`-API wurde entfernt. Bitte verwende stattdessen `typeof arg === 'string'`.


### DEP0057: `util.isSymbol()` {#dep0057-utilissymbol}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v23.0.0 | End-of-Life-Verwerfung. |
| v22.0.0 | Laufzeit-Verwerfung. |
| v6.12.0, v4.8.6 | Ein Verwerfungscode wurde zugewiesen. |
| v4.0.0, v3.3.1 | Nur-Dokumentations-Verwerfung. |
:::

Typ: End-of-Life

Die `util.isSymbol()`-API wurde entfernt. Bitte verwenden Sie stattdessen `typeof arg === 'symbol'`.

### DEP0058: `util.isUndefined()` {#dep0058-utilisundefined}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v23.0.0 | End-of-Life-Verwerfung. |
| v22.0.0 | Laufzeit-Verwerfung. |
| v6.12.0, v4.8.6 | Ein Verwerfungscode wurde zugewiesen. |
| v4.0.0, v3.3.1 | Nur-Dokumentations-Verwerfung. |
:::

Typ: End-of-Life

Die `util.isUndefined()`-API wurde entfernt. Bitte verwenden Sie stattdessen `arg === undefined`.

### DEP0059: `util.log()` {#dep0059-utillog}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v23.0.0 | End-of-Life-Verwerfung. |
| v22.0.0 | Laufzeit-Verwerfung. |
| v6.12.0 | Ein Verwerfungscode wurde zugewiesen. |
| v6.0.0 | Nur-Dokumentations-Verwerfung. |
:::

Typ: End-of-Life

Die `util.log()`-API wurde entfernt, da es sich um eine nicht gewartete Legacy-API handelt, die versehentlich für Benutzer zugänglich gemacht wurde. Stattdessen sollten Sie je nach Ihren spezifischen Bedürfnissen die folgenden Alternativen in Betracht ziehen:

-  **Protokollierungsbibliotheken von Drittanbietern**
-  **Verwenden Sie <code>console.log(new Date().toLocaleString(), message)</code>**

Durch die Einführung einer dieser Alternativen können Sie von `util.log()` weggehen und eine Protokollierungsstrategie wählen, die auf die spezifischen Anforderungen und die Komplexität Ihrer Anwendung abgestimmt ist.

### DEP0060: `util._extend()` {#dep0060-util_extend}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v22.0.0 | Laufzeit-Verwerfung. |
| v6.12.0 | Ein Verwerfungscode wurde zugewiesen. |
| v6.0.0 | Nur-Dokumentations-Verwerfung. |
:::

Typ: Laufzeit

Die [`util._extend()`](/de/nodejs/api/util#util_extendtarget-source)-API ist veraltet, da es sich um eine nicht gewartete Legacy-API handelt, die versehentlich für Benutzer zugänglich gemacht wurde. Bitte verwenden Sie stattdessen `target = Object.assign(target, source)`.


### DEP0061: `fs.SyncWriteStream` {#dep0061-fssyncwritestream}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v11.0.0 | End-of-Life. |
| v8.0.0 | Laufzeit-Missbilligung. |
| v7.0.0 | Nur-Dokumentations-Missbilligung. |
:::

Typ: End-of-Life

Die Klasse `fs.SyncWriteStream` war nie als öffentlich zugängliche API gedacht und wurde entfernt. Es ist keine alternative API verfügbar. Bitte verwenden Sie eine Userland-Alternative.

### DEP0062: `node --debug` {#dep0062-node---debug}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v12.0.0 | End-of-Life. |
| v8.0.0 | Laufzeit-Missbilligung. |
:::

Typ: End-of-Life

`--debug` aktiviert die Legacy-V8-Debugger-Schnittstelle, die mit V8 5.8 entfernt wurde. Sie wird durch Inspector ersetzt, der stattdessen mit `--inspect` aktiviert wird.

### DEP0063: `ServerResponse.prototype.writeHeader()` {#dep0063-serverresponseprototypewriteheader}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v8.0.0 | Nur-Dokumentations-Missbilligung. |
:::

Typ: Nur-Dokumentations-Missbilligung

Die `node:http`-Modul-API `ServerResponse.prototype.writeHeader()` ist veraltet. Bitte verwenden Sie stattdessen `ServerResponse.prototype.writeHead()`.

Die Methode `ServerResponse.prototype.writeHeader()` wurde nie als offiziell unterstützte API dokumentiert.

### DEP0064: `tls.createSecurePair()` {#dep0064-tlscreatesecurepair}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v8.0.0 | Laufzeit-Missbilligung. |
| v6.12.0 | Ein Missbilligungs-Code wurde zugewiesen. |
| v6.0.0 | Nur-Dokumentations-Missbilligung. |
| v0.11.15 | Missbilligung widerrufen. |
| v0.11.3 | Laufzeit-Missbilligung. |
:::

Typ: Laufzeit

Die API `tls.createSecurePair()` wurde in der Dokumentation in Node.js 0.11.3 als veraltet markiert. Benutzer sollten stattdessen `tls.Socket` verwenden.

### DEP0065: `repl.REPL_MODE_MAGIC` und `NODE_REPL_MODE=magic` {#dep0065-replrepl_mode_magic-and-node_repl_mode=magic}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v10.0.0 | End-of-Life. |
| v8.0.0 | Nur-Dokumentations-Missbilligung. |
:::

Typ: End-of-Life

Die `REPL_MODE_MAGIC`-Konstante des Moduls `node:repl`, die für die Option `replMode` verwendet wird, wurde entfernt. Ihr Verhalten ist seit Node.js 6.0.0, als V8 5.0 importiert wurde, funktional identisch mit dem von `REPL_MODE_SLOPPY`. Bitte verwenden Sie stattdessen `REPL_MODE_SLOPPY`.

Die Umgebungsvariable `NODE_REPL_MODE` wird verwendet, um den zugrunde liegenden `replMode` einer interaktiven `node`-Sitzung festzulegen. Ihr Wert `magic` wurde ebenfalls entfernt. Bitte verwenden Sie stattdessen `sloppy`.


### DEP0066: `OutgoingMessage.prototype._headers, OutgoingMessage.prototype._headerNames` {#dep0066-outgoingmessageprototype_headers-outgoingmessageprototype_headernames}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v12.0.0 | Laufzeit-Deprecation. |
| v8.0.0 | Nur-Dokumentations-Deprecation. |
:::

Typ: Laufzeit

Die Eigenschaften `OutgoingMessage.prototype._headers` und `OutgoingMessage.prototype._headerNames` des Moduls `node:http` sind veraltet. Verwenden Sie eine der öffentlichen Methoden (z.B. `OutgoingMessage.prototype.getHeader()`, `OutgoingMessage.prototype.getHeaders()`, `OutgoingMessage.prototype.getHeaderNames()`, `OutgoingMessage.prototype.getRawHeaderNames()`, `OutgoingMessage.prototype.hasHeader()`, `OutgoingMessage.prototype.removeHeader()`, `OutgoingMessage.prototype.setHeader()`), um mit ausgehenden Headern zu arbeiten.

Die Eigenschaften `OutgoingMessage.prototype._headers` und `OutgoingMessage.prototype._headerNames` wurden nie als offiziell unterstützte Eigenschaften dokumentiert.

### DEP0067: `OutgoingMessage.prototype._renderHeaders` {#dep0067-outgoingmessageprototype_renderheaders}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v8.0.0 | Nur-Dokumentations-Deprecation. |
:::

Typ: Nur-Dokumentation

Die API `OutgoingMessage.prototype._renderHeaders()` des Moduls `node:http` ist veraltet.

Die Eigenschaft `OutgoingMessage.prototype._renderHeaders` wurde nie als offiziell unterstützte API dokumentiert.

### DEP0068: `node debug` {#dep0068-node-debug}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v15.0.0 | Der Legacy-Befehl `node debug` wurde entfernt. |
| v8.0.0 | Laufzeit-Deprecation. |
:::

Typ: End-of-Life

`node debug` entspricht dem Legacy-CLI-Debugger, der durch einen V8-Inspector-basierten CLI-Debugger ersetzt wurde, der über `node inspect` verfügbar ist.

### DEP0069: `vm.runInDebugContext(string)` {#dep0069-vmrunindebugcontextstring}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v10.0.0 | End-of-Life. |
| v9.0.0 | Laufzeit-Deprecation. |
| v8.0.0 | Nur-Dokumentations-Deprecation. |
:::

Typ: End-of-Life

DebugContext wurde in V8 entfernt und ist in Node.js 10+ nicht verfügbar.

DebugContext war eine experimentelle API.

### DEP0070: `async_hooks.currentId()` {#dep0070-async_hookscurrentid}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v9.0.0 | End-of-Life. |
| v8.2.0 | Laufzeit-Deprecation. |
:::

Typ: End-of-Life

`async_hooks.currentId()` wurde zur Verdeutlichung in `async_hooks.executionAsyncId()` umbenannt.

Diese Änderung wurde vorgenommen, als `async_hooks` eine experimentelle API war.


### DEP0071: `async_hooks.triggerId()` {#dep0071-async_hookstriggerid}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v9.0.0 | Lebensende. |
| v8.2.0 | Laufzeit-Deprecation. |
:::

Typ: Lebensende

`async_hooks.triggerId()` wurde zur Klarheit in `async_hooks.triggerAsyncId()` umbenannt.

Diese Änderung wurde vorgenommen, als `async_hooks` eine experimentelle API war.

### DEP0072: `async_hooks.AsyncResource.triggerId()` {#dep0072-async_hooksasyncresourcetriggerid}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v9.0.0 | Lebensende. |
| v8.2.0 | Laufzeit-Deprecation. |
:::

Typ: Lebensende

`async_hooks.AsyncResource.triggerId()` wurde zur Klarheit in `async_hooks.AsyncResource.triggerAsyncId()` umbenannt.

Diese Änderung wurde vorgenommen, als `async_hooks` eine experimentelle API war.

### DEP0073: Verschiedene interne Eigenschaften von `net.Server` {#dep0073-several-internal-properties-of-netserver}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v10.0.0 | Lebensende. |
| v9.0.0 | Laufzeit-Deprecation. |
:::

Typ: Lebensende

Der Zugriff auf verschiedene interne, undokumentierte Eigenschaften von `net.Server`-Instanzen mit ungeeigneten Namen ist veraltet.

Da die ursprüngliche API undokumentiert und für nicht-internen Code im Allgemeinen nicht nützlich war, wird keine Ersatz-API bereitgestellt.

### DEP0074: `REPLServer.bufferedCommand` {#dep0074-replserverbufferedcommand}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v15.0.0 | Lebensende. |
| v9.0.0 | Laufzeit-Deprecation. |
:::

Typ: Lebensende

Die Eigenschaft `REPLServer.bufferedCommand` wurde zugunsten von [`REPLServer.clearBufferedCommand()`](/de/nodejs/api/repl#replserverclearbufferedcommand) als veraltet markiert.

### DEP0075: `REPLServer.parseREPLKeyword()` {#dep0075-replserverparsereplkeyword}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v15.0.0 | Lebensende. |
| v9.0.0 | Laufzeit-Deprecation. |
:::

Typ: Lebensende

`REPLServer.parseREPLKeyword()` wurde aus der Userland-Sichtbarkeit entfernt.

### DEP0076: `tls.parseCertString()` {#dep0076-tlsparsecertstring}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Lebensende. |
| v9.0.0 | Laufzeit-Deprecation. |
| v8.6.0 | Nur-Dokumentations-Deprecation. |
:::

Typ: Lebensende

`tls.parseCertString()` war ein trivialer Parsing-Helfer, der versehentlich öffentlich gemacht wurde. Obwohl es Zertifikat-Subjekt- und Aussteller-Strings parsen sollte, hat es mehrwertige Relative Distinguished Names nie korrekt verarbeitet.

Frühere Versionen dieses Dokuments schlugen vor, `querystring.parse()` als Alternative zu `tls.parseCertString()` zu verwenden. `querystring.parse()` verarbeitet jedoch auch nicht alle Zertifikatssubjekte korrekt und sollte nicht verwendet werden.


### DEP0077: `Module._debug()` {#dep0077-module_debug}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v9.0.0 | Laufzeit-Deprecation. |
:::

Typ: Laufzeit

`Module._debug()` ist veraltet.

Die Funktion `Module._debug()` wurde nie als offiziell unterstützte API dokumentiert.

### DEP0078: `REPLServer.turnOffEditorMode()` {#dep0078-replserverturnoffeditormode}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v15.0.0 | End-of-Life. |
| v9.0.0 | Laufzeit-Deprecation. |
:::

Typ: End-of-Life

`REPLServer.turnOffEditorMode()` wurde von der Userland-Sichtbarkeit entfernt.

### DEP0079: Benutzerdefinierte Inspect-Funktion auf Objekten über `.inspect()` {#dep0079-custom-inspection-function-on-objects-via-inspect}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v11.0.0 | End-of-Life. |
| v10.0.0 | Laufzeit-Deprecation. |
| v8.7.0 | Deprecation nur in der Dokumentation. |
:::

Typ: End-of-Life

Die Verwendung einer Eigenschaft namens `inspect` auf einem Objekt, um eine benutzerdefinierte Inspect-Funktion für [`util.inspect()`](/de/nodejs/api/util#utilinspectobject-options) anzugeben, ist veraltet. Verwenden Sie stattdessen [`util.inspect.custom`](/de/nodejs/api/util#utilinspectcustom). Für die Abwärtskompatibilität mit Node.js vor Version 6.4.0 können beide angegeben werden.

### DEP0080: `path._makeLong()` {#dep0080-path_makelong}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v9.0.0 | Deprecation nur in der Dokumentation. |
:::

Typ: Nur Dokumentation

Die interne `path._makeLong()` war nicht für die öffentliche Nutzung bestimmt. Userland-Module haben sie jedoch als nützlich empfunden. Die interne API ist veraltet und wird durch eine identische, öffentliche Methode `path.toNamespacedPath()` ersetzt.

### DEP0081: `fs.truncate()` unter Verwendung eines Dateideskriptors {#dep0081-fstruncate-using-a-file-descriptor}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v9.0.0 | Laufzeit-Deprecation. |
:::

Typ: Laufzeit

Die Verwendung von `fs.truncate()` `fs.truncateSync()` mit einem Dateideskriptor ist veraltet. Bitte verwenden Sie `fs.ftruncate()` oder `fs.ftruncateSync()`, um mit Dateideskriptoren zu arbeiten.

### DEP0082: `REPLServer.prototype.memory()` {#dep0082-replserverprototypememory}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v15.0.0 | End-of-Life. |
| v9.0.0 | Laufzeit-Deprecation. |
:::

Typ: End-of-Life

`REPLServer.prototype.memory()` ist nur für die interne Mechanik des `REPLServer` selbst erforderlich. Verwenden Sie diese Funktion nicht.


### DEP0083: Deaktivieren von ECDH durch Setzen von `ecdhCurve` auf `false` {#dep0083-disabling-ecdh-by-setting-ecdhcurve-to-false}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v10.0.0 | End-of-Life. |
| v9.2.0 | Laufzeit-Deprecation. |
:::

Typ: End-of-Life.

Die Option `ecdhCurve` für `tls.createSecureContext()` und `tls.TLSSocket` konnte auf `false` gesetzt werden, um ECDH nur auf dem Server vollständig zu deaktivieren. Dieser Modus wurde in Vorbereitung auf die Migration zu OpenSSL 1.1.0 und zur Wahrung der Konsistenz mit dem Client als veraltet markiert und wird jetzt nicht mehr unterstützt. Verwenden Sie stattdessen den Parameter `ciphers`.

### DEP0084: Benötigen von gebündelten internen Abhängigkeiten {#dep0084-requiring-bundled-internal-dependencies}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v12.0.0 | Diese Funktionalität wurde entfernt. |
| v10.0.0 | Laufzeit-Deprecation. |
:::

Typ: End-of-Life

Seit den Node.js-Versionen 4.4.0 und 5.2.0 wurden versehentlich mehrere Module, die nur für den internen Gebrauch bestimmt waren, über `require()` für den Benutzercode zugänglich gemacht. Diese Module waren:

- `v8/tools/codemap`
- `v8/tools/consarray`
- `v8/tools/csvparser`
- `v8/tools/logreader`
- `v8/tools/profile_view`
- `v8/tools/profile`
- `v8/tools/SourceMap`
- `v8/tools/splaytree`
- `v8/tools/tickprocessor-driver`
- `v8/tools/tickprocessor`
- `node-inspect/lib/_inspect` (ab 7.6.0)
- `node-inspect/lib/internal/inspect_client` (ab 7.6.0)
- `node-inspect/lib/internal/inspect_repl` (ab 7.6.0)

Die `v8/*`-Module haben keine Exporte, und wenn sie nicht in einer bestimmten Reihenfolge importiert werden, würden sie tatsächlich Fehler auslösen. Daher gibt es praktisch keine legitimen Anwendungsfälle für den Import über `require()`.

Andererseits kann `node-inspect` lokal über einen Paketmanager installiert werden, da es im npm-Registry unter dem gleichen Namen veröffentlicht wird. Es sind keine Quellcodeänderungen erforderlich, wenn dies getan wird.

### DEP0085: AsyncHooks sensitive API {#dep0085-asynchooks-sensitive-api}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v10.0.0 | End-of-Life. |
| v9.4.0, v8.10.0 | Laufzeit-Deprecation. |
:::

Typ: End-of-Life

Die AsyncHooks sensitive API war nie dokumentiert und hatte verschiedene kleinere Probleme. Verwenden Sie stattdessen die `AsyncResource` API. Siehe [https://github.com/nodejs/node/issues/15572](https://github.com/nodejs/node/issues/15572).


### DEP0086: `runInAsyncIdScope` entfernen {#dep0086-remove-runinasyncidscope}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v10.0.0 | End-of-Life. |
| v9.4.0, v8.10.0 | Laufzeit-Deprecation. |
:::

Typ: End-of-Life

`runInAsyncIdScope` sendet nicht das `'before'`- oder `'after'`-Ereignis und kann daher viele Probleme verursachen. Siehe [https://github.com/nodejs/node/issues/14328](https://github.com/nodejs/node/issues/14328).

### DEP0089: `require('node:assert')` {#dep0089-requirenodeassert}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v12.8.0 | Deprecation aufgehoben. |
| v9.9.0, v8.13.0 | Dokumentations-Deprecation. |
:::

Typ: Deprecation aufgehoben

Der direkte Import von assert wurde nicht empfohlen, da die exponierten Funktionen lose Gleichheitsprüfungen verwenden. Die Deprecation wurde aufgehoben, da die Verwendung des `node:assert`-Moduls nicht entmutigt wird und die Deprecation zu Verwirrung bei Entwicklern führte.

### DEP0090: Ungültige GCM-Authentifizierungstag-Längen {#dep0090-invalid-gcm-authentication-tag-lengths}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v11.0.0 | End-of-Life. |
| v10.0.0 | Laufzeit-Deprecation. |
:::

Typ: End-of-Life

Node.js unterstützte alle GCM-Authentifizierungstag-Längen, die von OpenSSL akzeptiert werden, wenn [`decipher.setAuthTag()`](/de/nodejs/api/crypto#deciphersetauthtagbuffer-encoding) aufgerufen wird. Ab Node.js v11.0.0 sind nur Authentifizierungstag-Längen von 128, 120, 112, 104, 96, 64 und 32 Bit zulässig. Authentifizierungstags anderer Längen sind gemäß [NIST SP 800-38D](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38d.pdf) ungültig.

### DEP0091: `crypto.DEFAULT_ENCODING` {#dep0091-cryptodefault_encoding}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v20.0.0 | End-of-Life. |
| v10.0.0 | Laufzeit-Deprecation. |
:::

Typ: End-of-Life

Die `crypto.DEFAULT_ENCODING`-Eigenschaft existierte nur zur Kompatibilität mit Node.js-Releases vor den Versionen 0.9.3 und wurde entfernt.

### DEP0092: Top-Level `this` gebunden an `module.exports` {#dep0092-top-level-this-bound-to-moduleexports}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v10.0.0 | Dokumentations-Deprecation. |
:::

Typ: Nur Dokumentation

Das Zuweisen von Eigenschaften zu `this` auf oberster Ebene als Alternative zu `module.exports` ist veraltet. Entwickler sollten stattdessen `exports` oder `module.exports` verwenden.


### DEP0093: `crypto.fips` ist veraltet und wurde ersetzt {#dep0093-cryptofips-is-deprecated-and-replaced}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v23.0.0 | Laufzeit-Deprecation. |
| v10.0.0 | Deprecation nur in der Dokumentation. |
:::

Typ: Laufzeit

Die Eigenschaft [`crypto.fips`](/de/nodejs/api/crypto#cryptofips) ist veraltet. Bitte verwenden Sie stattdessen `crypto.setFips()` und `crypto.getFips()`.

### DEP0094: Verwendung von `assert.fail()` mit mehr als einem Argument {#dep0094-using-assertfail-with-more-than-one-argument}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v10.0.0 | Laufzeit-Deprecation. |
:::

Typ: Laufzeit

Die Verwendung von `assert.fail()` mit mehr als einem Argument ist veraltet. Verwenden Sie `assert.fail()` mit nur einem Argument oder verwenden Sie eine andere Methode des `node:assert`-Moduls.

### DEP0095: `timers.enroll()` {#dep0095-timersenroll}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v10.0.0 | Laufzeit-Deprecation. |
:::

Typ: Laufzeit

`timers.enroll()` ist veraltet. Bitte verwenden Sie stattdessen die öffentlich dokumentierten [`setTimeout()`](/de/nodejs/api/timers#settimeoutcallback-delay-args) oder [`setInterval()`](/de/nodejs/api/timers#setintervalcallback-delay-args).

### DEP0096: `timers.unenroll()` {#dep0096-timersunenroll}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v10.0.0 | Laufzeit-Deprecation. |
:::

Typ: Laufzeit

`timers.unenroll()` ist veraltet. Bitte verwenden Sie stattdessen die öffentlich dokumentierten [`clearTimeout()`](/de/nodejs/api/timers#cleartimeouttimeout) oder [`clearInterval()`](/de/nodejs/api/timers#clearintervaltimeout).

### DEP0097: `MakeCallback` mit `domain`-Eigenschaft {#dep0097-makecallback-with-domain-property}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v10.0.0 | Laufzeit-Deprecation. |
:::

Typ: Laufzeit

Benutzer von `MakeCallback`, die die Eigenschaft `domain` hinzufügen, um den Kontext zu übertragen, sollten mit der Verwendung der `async_context`-Variante von `MakeCallback` oder `CallbackScope` oder der High-Level-Klasse `AsyncResource` beginnen.

### DEP0098: AsyncHooks Embedder `AsyncResource.emitBefore`- und `AsyncResource.emitAfter`-APIs {#dep0098-asynchooks-embedder-asyncresourceemitbefore-and-asyncresourceemitafter-apis}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v12.0.0 | End-of-Life. |
| v10.0.0, v9.6.0, v8.12.0 | Laufzeit-Deprecation. |
:::

Typ: End-of-Life

Die eingebettete API von AsyncHooks stellt die Methoden `.emitBefore()` und `.emitAfter()` zur Verfügung, die sehr einfach falsch zu verwenden sind, was zu nicht behebbaren Fehlern führen kann.

Verwenden Sie stattdessen die [`asyncResource.runInAsyncScope()`](/de/nodejs/api/async_context#asyncresourceruninasyncscopefn-thisarg-args)-API, die eine viel sicherere und bequemere Alternative bietet. Siehe [https://github.com/nodejs/node/pull/18513](https://github.com/nodejs/node/pull/18513).


### DEP0099: Async-Context-Unaware `node::MakeCallback` C++ APIs {#dep0099-async-context-unaware-nodemakecallback-c-apis}

::: info [Historie]
| Version | Änderungen |
|---|---|
| v10.0.0 | Compile-Zeit-Deprecation. |
:::

Typ: Compile-Zeit

Bestimmte Versionen der `node::MakeCallback`-APIs, die für native Add-ons verfügbar sind, sind veraltet. Bitte verwenden Sie die Versionen der API, die einen `async_context`-Parameter akzeptieren.

### DEP0100: `process.assert()` {#dep0100-processassert}

::: info [Historie]
| Version | Änderungen |
|---|---|
| v23.0.0 | End-of-Life. |
| v10.0.0 | Runtime-Deprecation. |
| v0.3.7 | Documentation-Only-Deprecation. |
:::

Typ: End-of-Life

`process.assert()` ist veraltet. Bitte verwenden Sie stattdessen das [`assert`](/de/nodejs/api/assert)-Modul.

Dies war nie eine dokumentierte Funktion.

### DEP0101: `--with-lttng` {#dep0101---with-lttng}

::: info [Historie]
| Version | Änderungen |
|---|---|
| v10.0.0 | End-of-Life. |
:::

Typ: End-of-Life

Die Compile-Zeit-Option `--with-lttng` wurde entfernt.

### DEP0102: Verwendung von `noAssert` in `Buffer#(read|write)` Operationen {#dep0102-using-noassert-in-bufferread|write-operations}

::: info [Historie]
| Version | Änderungen |
|---|---|
| v10.0.0 | End-of-Life. |
:::

Typ: End-of-Life

Die Verwendung des `noAssert`-Arguments hat keine Funktionalität mehr. Alle Eingaben werden unabhängig vom Wert von `noAssert` verifiziert. Das Überspringen der Verifizierung kann zu schwer zu findenden Fehlern und Abstürzen führen.

### DEP0103: `process.binding('util').is[...]` Typüberprüfungen {#dep0103-processbindingutilis-typechecks}

::: info [Historie]
| Version | Änderungen |
|---|---|
| v10.9.0 | Ersetzt durch [DEP0111](/de/nodejs/api/deprecations#DEP0111). |
| v10.0.0 | Documentation-Only-Deprecation. |
:::

Typ: Documentation-Only (unterstützt [`--pending-deprecation`](/de/nodejs/api/cli#--pending-deprecation))

Die Verwendung von `process.binding()` im Allgemeinen sollte vermieden werden. Die Typüberprüfungsmethoden im Besonderen können durch die Verwendung von [`util.types`](/de/nodejs/api/util#utiltypes) ersetzt werden.

Diese Deprecation wurde durch die Deprecation der `process.binding()`-API ([DEP0111](/de/nodejs/api/deprecations#DEP0111)) ersetzt.

### DEP0104: `process.env` String-Konvertierung {#dep0104-processenv-string-coercion}

::: info [Historie]
| Version | Änderungen |
|---|---|
| v10.0.0 | Documentation-Only-Deprecation. |
:::

Typ: Documentation-Only (unterstützt [`--pending-deprecation`](/de/nodejs/api/cli#--pending-deprecation))

Wenn einer Eigenschaft, die kein String ist, [`process.env`](/de/nodejs/api/process#processenv) zugewiesen wird, wird der zugewiesene Wert implizit in einen String konvertiert. Dieses Verhalten ist veraltet, wenn der zugewiesene Wert kein String, Boolean oder Number ist. In Zukunft kann eine solche Zuweisung zu einem Fehler führen. Bitte konvertieren Sie die Eigenschaft in einen String, bevor Sie sie `process.env` zuweisen.


### DEP0105: `decipher.finaltol` {#dep0105-decipherfinaltol}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v11.0.0 | End-of-Life. |
| v10.0.0 | Laufzeit-Deprecation. |
:::

Typ: End-of-Life

`decipher.finaltol()` wurde nie dokumentiert und war ein Alias für [`decipher.final()`](/de/nodejs/api/crypto#decipherfinaloutputencoding). Diese API wurde entfernt, und es wird empfohlen, stattdessen [`decipher.final()`](/de/nodejs/api/crypto#decipherfinaloutputencoding) zu verwenden.

### DEP0106: `crypto.createCipher` und `crypto.createDecipher` {#dep0106-cryptocreatecipher-and-cryptocreatedecipher}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v22.0.0 | End-of-Life. |
| v11.0.0 | Laufzeit-Deprecation. |
| v10.0.0 | Nur-Dokumentations-Deprecation. |
:::

Typ: End-of-Life

`crypto.createCipher()` und `crypto.createDecipher()` wurden entfernt, da sie eine schwache Schlüsselableitungsfunktion (MD5 ohne Salt) und statische Initialisierungsvektoren verwenden. Es wird empfohlen, einen Schlüssel mit [`crypto.pbkdf2()`](/de/nodejs/api/crypto#cryptopbkdf2password-salt-iterations-keylen-digest-callback) oder [`crypto.scrypt()`](/de/nodejs/api/crypto#cryptoscryptpassword-salt-keylen-options-callback) mit zufälligen Salts abzuleiten und [`crypto.createCipheriv()`](/de/nodejs/api/crypto#cryptocreatecipherivalgorithm-key-iv-options) und [`crypto.createDecipheriv()`](/de/nodejs/api/crypto#cryptocreatedecipherivalgorithm-key-iv-options) zu verwenden, um die [`Cipher`](/de/nodejs/api/crypto#class-cipher) und [`Decipher`](/de/nodejs/api/crypto#class-decipher) Objekte zu erhalten.

### DEP0107: `tls.convertNPNProtocols()` {#dep0107-tlsconvertnpnprotocols}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v11.0.0 | End-of-Life. |
| v10.0.0 | Laufzeit-Deprecation. |
:::

Typ: End-of-Life

Dies war eine undokumentierte Hilfsfunktion, die nicht für die Verwendung außerhalb des Node.js-Kerns vorgesehen war und durch die Entfernung der NPN-Unterstützung (Next Protocol Negotiation) obsolet wurde.

### DEP0108: `zlib.bytesRead` {#dep0108-zlibbytesread}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v23.0.0 | End-of-Life. |
| v11.0.0 | Laufzeit-Deprecation. |
| v10.0.0 | Nur-Dokumentations-Deprecation. |
:::

Typ: End-of-Life

Veralteter Alias für [`zlib.bytesWritten`](/de/nodejs/api/zlib#zlibbyteswritten). Dieser ursprüngliche Name wurde gewählt, weil es auch sinnvoll war, den Wert als die Anzahl der vom Engine gelesenen Bytes zu interpretieren, aber er stimmt nicht mit anderen Streams in Node.js überein, die Werte unter diesen Namen bereitstellen.


### DEP0109: `http`-, `https`- und `tls`-Unterstützung für ungültige URLs {#dep0109-http-https-and-tls-support-for-invalid-urls}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v16.0.0 | End-of-Life. |
| v11.0.0 | Laufzeit-Deprecation. |
:::

Typ: End-of-Life

Einige zuvor unterstützte (aber streng genommen ungültige) URLs wurden durch die APIs [`http.request()`](/de/nodejs/api/http#httprequestoptions-callback), [`http.get()`](/de/nodejs/api/http#httpgetoptions-callback), [`https.request()`](/de/nodejs/api/https#httpsrequestoptions-callback), [`https.get()`](/de/nodejs/api/https#httpsgetoptions-callback) und [`tls.checkServerIdentity()`](/de/nodejs/api/tls#tlscheckserveridentityhostname-cert) akzeptiert, da diese von der Legacy-API `url.parse()` akzeptiert wurden. Die genannten APIs verwenden jetzt den WHATWG-URL-Parser, der streng gültige URLs erfordert. Die Übergabe einer ungültigen URL ist veraltet und die Unterstützung wird in Zukunft entfernt.

### DEP0110: `vm.Script` zwischengespeicherte Daten {#dep0110-vmscript-cached-data}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v10.6.0 | Nur-Dokumentations-Deprecation. |
:::

Typ: Nur-Dokumentations-Deprecation

Die Option `produceCachedData` ist veraltet. Verwenden Sie stattdessen [`script.createCachedData()`](/de/nodejs/api/vm#scriptcreatecacheddata).

### DEP0111: `process.binding()` {#dep0111-processbinding}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v11.12.0 | Unterstützung für `--pending-deprecation` hinzugefügt. |
| v10.9.0 | Nur-Dokumentations-Deprecation. |
:::

Typ: Nur-Dokumentations-Deprecation (unterstützt [`--pending-deprecation`](/de/nodejs/api/cli#--pending-deprecation))

`process.binding()` ist nur für die Verwendung durch internen Node.js-Code bestimmt.

Während `process.binding()` im Allgemeinen noch keinen End-of-Life-Status erreicht hat, ist es nicht verfügbar, wenn das [Berechtigungsmodell](/de/nodejs/api/permissions#permission-model) aktiviert ist.

### DEP0112: Private `dgram`-APIs {#dep0112-dgram-private-apis}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v11.0.0 | Laufzeit-Deprecation. |
:::

Typ: Laufzeit

Das Modul `node:dgram` enthielt zuvor mehrere APIs, die nie für den Zugriff außerhalb des Node.js-Kerns vorgesehen waren: `Socket.prototype._handle`, `Socket.prototype._receiving`, `Socket.prototype._bindState`, `Socket.prototype._queue`, `Socket.prototype._reuseAddr`, `Socket.prototype._healthCheck()`, `Socket.prototype._stopReceiving()` und `dgram._createSocketHandle()`.


### DEP0113: `Cipher.setAuthTag()`, `Decipher.getAuthTag()` {#dep0113-ciphersetauthtag-deciphergetauthtag}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v12.0.0 | End-of-Life. |
| v11.0.0 | Laufzeit-Deprecation. |
:::

Typ: End-of-Life

`Cipher.setAuthTag()` und `Decipher.getAuthTag()` sind nicht mehr verfügbar. Sie waren nie dokumentiert und haben bei Aufruf eine Ausnahme ausgelöst.

### DEP0114: `crypto._toBuf()` {#dep0114-crypto_tobuf}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v12.0.0 | End-of-Life. |
| v11.0.0 | Laufzeit-Deprecation. |
:::

Typ: End-of-Life

Die Funktion `crypto._toBuf()` war nicht für die Verwendung durch Module außerhalb des Node.js-Kerns vorgesehen und wurde entfernt.

### DEP0115: `crypto.prng()`, `crypto.pseudoRandomBytes()`, `crypto.rng()` {#dep0115-cryptoprng-cryptopseudorandombytes-cryptorng}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v11.0.0 | Dokumentations-Deprecation mit Unterstützung für `--pending-deprecation` hinzugefügt. |
:::

Typ: Nur Dokumentation (unterstützt [`--pending-deprecation`](/de/nodejs/api/cli#--pending-deprecation))

In neueren Versionen von Node.js gibt es keinen Unterschied zwischen [`crypto.randomBytes()`](/de/nodejs/api/crypto#cryptorandombytessize-callback) und `crypto.pseudoRandomBytes()`. Letzteres ist zusammen mit den undokumentierten Aliasen `crypto.prng()` und `crypto.rng()` zugunsten von [`crypto.randomBytes()`](/de/nodejs/api/crypto#cryptorandombytessize-callback) als veraltet markiert und könnte in einer zukünftigen Version entfernt werden.

### DEP0116: Legacy-URL-API {#dep0116-legacy-url-api}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v19.0.0, v18.13.0 | `url.parse()` ist in DEP0169 erneut als veraltet markiert. |
| v15.13.0, v14.17.0 | Deprecation widerrufen. Status auf "Legacy" geändert. |
| v11.0.0 | Dokumentations-Deprecation. |
:::

Typ: Deprecation widerrufen

Die [Legacy-URL-API](/de/nodejs/api/url#legacy-url-api) ist als veraltet markiert. Dies beinhaltet [`url.format()`](/de/nodejs/api/url#urlformaturlobject), [`url.parse()`](/de/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost), [`url.resolve()`](/de/nodejs/api/url#urlresolvefrom-to) und das [Legacy `urlObject`](/de/nodejs/api/url#legacy-urlobject). Bitte verwenden Sie stattdessen die [WHATWG-URL-API](/de/nodejs/api/url#the-whatwg-url-api).


### DEP0117: Native Crypto-Handles {#dep0117-native-crypto-handles}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v12.0.0 | End-of-Life. |
| v11.0.0 | Laufzeit-Deprecation. |
:::

Typ: End-of-Life

Frühere Versionen von Node.js stellten Handles zu internen nativen Objekten über die Eigenschaft `_handle` der Klassen `Cipher`, `Decipher`, `DiffieHellman`, `DiffieHellmanGroup`, `ECDH`, `Hash`, `Hmac`, `Sign` und `Verify` bereit. Die Eigenschaft `_handle` wurde entfernt, da eine unsachgemäße Verwendung des nativen Objekts zum Absturz der Anwendung führen kann.

### DEP0118: `dns.lookup()`-Unterstützung für einen Falsy-Hostnamen {#dep0118-dnslookup-support-for-a-falsy-host-name}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v11.0.0 | Laufzeit-Deprecation. |
:::

Typ: Laufzeit

Frühere Versionen von Node.js unterstützten `dns.lookup()` mit einem Falsy-Hostnamen wie `dns.lookup(false)` aufgrund der Abwärtskompatibilität. Dieses Verhalten ist undokumentiert und dürfte in realen Anwendungen nicht verwendet werden. In zukünftigen Versionen von Node.js wird dies zu einem Fehler führen.

### DEP0119: Private API `process.binding('uv').errname()` {#dep0119-processbindinguverrname-private-api}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v11.0.0 | Nur-Dokumentations-Deprecation. |
:::

Typ: Nur Dokumentation (unterstützt [`--pending-deprecation`](/de/nodejs/api/cli#--pending-deprecation))

`process.binding('uv').errname()` ist veraltet. Bitte verwenden Sie stattdessen [`util.getSystemErrorName()`](/de/nodejs/api/util#utilgetsystemerrornameerr).

### DEP0120: Unterstützung für Windows Performance Counter {#dep0120-windows-performance-counter-support}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v12.0.0 | End-of-Life. |
| v11.0.0 | Laufzeit-Deprecation. |
:::

Typ: End-of-Life

Die Unterstützung für Windows Performance Counter wurde aus Node.js entfernt. Die undokumentierten Funktionen `COUNTER_NET_SERVER_CONNECTION()`, `COUNTER_NET_SERVER_CONNECTION_CLOSE()`, `COUNTER_HTTP_SERVER_REQUEST()`, `COUNTER_HTTP_SERVER_RESPONSE()`, `COUNTER_HTTP_CLIENT_REQUEST()` und `COUNTER_HTTP_CLIENT_RESPONSE()` wurden als veraltet markiert.

### DEP0121: `net._setSimultaneousAccepts()` {#dep0121-net_setsimultaneousaccepts}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v12.0.0 | Laufzeit-Deprecation. |
:::

Typ: Laufzeit

Die undokumentierte Funktion `net._setSimultaneousAccepts()` war ursprünglich für das Debuggen und die Leistungsoptimierung bei der Verwendung der Module `node:child_process` und `node:cluster` unter Windows vorgesehen. Die Funktion ist im Allgemeinen nicht nützlich und wird entfernt. Siehe Diskussion hier: [https://github.com/nodejs/node/issues/18391](https://github.com/nodejs/node/issues/18391)


### DEP0122: `tls` `Server.prototype.setOptions()` {#dep0122-tls-serverprototypesetoptions}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v12.0.0 | Laufzeit-Deprecation. |
:::

Typ: Laufzeit

Bitte verwenden Sie stattdessen `Server.prototype.setSecureContext()`.

### DEP0123: Setzen des TLS ServerName auf eine IP-Adresse {#dep0123-setting-the-tls-servername-to-an-ip-address}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v12.0.0 | Laufzeit-Deprecation. |
:::

Typ: Laufzeit

Das Setzen des TLS ServerName auf eine IP-Adresse ist nicht durch [RFC 6066](https://tools.ietf.org/html/rfc6066#section-3) erlaubt. Dies wird in einer zukünftigen Version ignoriert.

### DEP0124: Verwendung von `REPLServer.rli` {#dep0124-using-replserverrli}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v15.0.0 | End-of-Life. |
| v12.0.0 | Laufzeit-Deprecation. |
:::

Typ: End-of-Life

Diese Eigenschaft ist eine Referenz auf die Instanz selbst.

### DEP0125: `require('node:_stream_wrap')` {#dep0125-requirenode_stream_wrap}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v12.0.0 | Laufzeit-Deprecation. |
:::

Typ: Laufzeit

Das Modul `node:_stream_wrap` ist veraltet.

### DEP0126: `timers.active()` {#dep0126-timersactive}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v11.14.0 | Laufzeit-Deprecation. |
:::

Typ: Laufzeit

Das zuvor undokumentierte `timers.active()` ist veraltet. Bitte verwenden Sie stattdessen das öffentlich dokumentierte [`timeout.refresh()`](/de/nodejs/api/timers#timeoutrefresh). Wenn ein erneutes Referenzieren des Timeouts erforderlich ist, kann [`timeout.ref()`](/de/nodejs/api/timers#timeoutref) ohne Performance-Einbußen seit Node.js 10 verwendet werden.

### DEP0127: `timers._unrefActive()` {#dep0127-timers_unrefactive}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v11.14.0 | Laufzeit-Deprecation. |
:::

Typ: Laufzeit

Das zuvor undokumentierte und "private" `timers._unrefActive()` ist veraltet. Bitte verwenden Sie stattdessen das öffentlich dokumentierte [`timeout.refresh()`](/de/nodejs/api/timers#timeoutrefresh). Wenn das Dereferenzieren des Timeouts erforderlich ist, kann [`timeout.unref()`](/de/nodejs/api/timers#timeoutunref) ohne Performance-Einbußen seit Node.js 10 verwendet werden.

### DEP0128: Module mit einem ungültigen `main`-Eintrag und einer `index.js`-Datei {#dep0128-modules-with-an-invalid-main-entry-and-an-indexjs-file}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v16.0.0 | Laufzeit-Deprecation. |
| v12.0.0 | Nur Dokumentation. |
:::

Typ: Laufzeit

Module, die einen ungültigen `main`-Eintrag haben (z. B. `./does-not-exist.js`) und auch eine `index.js`-Datei im obersten Verzeichnis haben, werden die `index.js`-Datei auflösen. Das ist veraltet und wird in zukünftigen Node.js-Versionen einen Fehler auslösen.


### DEP0129: `ChildProcess._channel` {#dep0129-childprocess_channel}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v13.0.0 | Laufzeit-Deprecation. |
| v11.14.0 | Nur Dokumentation. |
:::

Typ: Laufzeit

Die Eigenschaft `_channel` von Child-Prozess-Objekten, die von `spawn()` und ähnlichen Funktionen zurückgegeben werden, ist nicht für die öffentliche Verwendung bestimmt. Verwenden Sie stattdessen `ChildProcess.channel`.

### DEP0130: `Module.createRequireFromPath()` {#dep0130-modulecreaterequirefrompath}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v16.0.0 | End-of-Life. |
| v13.0.0 | Laufzeit-Deprecation. |
| v12.2.0 | Nur Dokumentation. |
:::

Typ: End-of-Life

Verwenden Sie stattdessen [`module.createRequire()`](/de/nodejs/api/module#modulecreaterequirefilename).

### DEP0131: Legacy HTTP parser {#dep0131-legacy-http-parser}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v13.0.0 | Dieses Feature wurde entfernt. |
| v12.22.0 | Laufzeit-Deprecation. |
| v12.3.0 | Nur Dokumentation. |
:::

Typ: End-of-Life

Der Legacy-HTTP-Parser, der standardmäßig in Node.js-Versionen vor 12.0.0 verwendet wurde, ist veraltet und wurde in v13.0.0 entfernt. Vor v13.0.0 konnte das Befehlszeilen-Flag `--http-parser=legacy` verwendet werden, um zur Verwendung des Legacy-Parsers zurückzukehren.

### DEP0132: `worker.terminate()` mit Callback {#dep0132-workerterminate-with-callback}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v12.5.0 | Laufzeit-Deprecation. |
:::

Typ: Laufzeit

Das Übergeben eines Callbacks an [`worker.terminate()`](/de/nodejs/api/worker_threads#workerterminate) ist veraltet. Verwenden Sie stattdessen das zurückgegebene `Promise` oder einen Listener für das `'exit'`-Ereignis des Workers.

### DEP0133: `http` `connection` {#dep0133-http-connection}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v12.12.0 | Nur Dokumentations-Deprecation. |
:::

Typ: Nur Dokumentation

Bevorzugen Sie [`response.socket`](/de/nodejs/api/http#responsesocket) gegenüber [`response.connection`](/de/nodejs/api/http#responseconnection) und [`request.socket`](/de/nodejs/api/http#requestsocket) gegenüber [`request.connection`](/de/nodejs/api/http#requestconnection).

### DEP0134: `process._tickCallback` {#dep0134-process_tickcallback}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v12.12.0 | Nur Dokumentations-Deprecation. |
:::

Typ: Nur Dokumentation (unterstützt [`--pending-deprecation`](/de/nodejs/api/cli#--pending-deprecation))

Die Eigenschaft `process._tickCallback` wurde nie als offiziell unterstützte API dokumentiert.


### DEP0135: `WriteStream.open()` und `ReadStream.open()` sind intern {#dep0135-writestreamopen-and-readstreamopen-are-internal}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v13.0.0 | Laufzeit-Deprecation. |
:::

Typ: Laufzeit

[`WriteStream.open()`](/de/nodejs/api/fs#class-fswritestream) und [`ReadStream.open()`](/de/nodejs/api/fs#class-fsreadstream) sind undokumentierte interne APIs, deren Verwendung in Userland keinen Sinn ergibt. Dateistreams sollten immer über ihre entsprechenden Factory-Methoden [`fs.createWriteStream()`](/de/nodejs/api/fs#fscreatewritestreampath-options) und [`fs.createReadStream()`](/de/nodejs/api/fs#fscreatereadstreampath-options) geöffnet werden oder indem ein Dateideskriptor in Optionen übergeben wird.

### DEP0136: `http` `finished` {#dep0136-http-finished}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v13.4.0, v12.16.0 | Nur-Dokumentations-Deprecation. |
:::

Typ: Nur-Dokumentation

[`response.finished`](/de/nodejs/api/http#responsefinished) gibt an, ob [`response.end()`](/de/nodejs/api/http#responseenddata-encoding-callback) aufgerufen wurde, nicht ob `'finish'` ausgegeben wurde und die zugrunde liegenden Daten geleert wurden.

Verwenden Sie stattdessen [`response.writableFinished`](/de/nodejs/api/http#responsewritablefinished) oder [`response.writableEnded`](/de/nodejs/api/http#responsewritableended), um die Mehrdeutigkeit zu vermeiden.

Um das bestehende Verhalten beizubehalten, sollte `response.finished` durch `response.writableEnded` ersetzt werden.

### DEP0137: Schließen von fs.FileHandle bei Garbage Collection {#dep0137-closing-fsfilehandle-on-garbage-collection}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v14.0.0 | Laufzeit-Deprecation. |
:::

Typ: Laufzeit

Das Schließen eines [`fs.FileHandle`](/de/nodejs/api/fs#class-filehandle)-Objekts bei der Garbage Collection ist veraltet. In Zukunft kann dies zu einem Fehler führen, der den Prozess beendet.

Bitte stellen Sie sicher, dass alle `fs.FileHandle`-Objekte explizit mit `FileHandle.prototype.close()` geschlossen werden, wenn der `fs.FileHandle` nicht mehr benötigt wird:

```js [ESM]
const fsPromises = require('node:fs').promises;
async function openAndClose() {
  let filehandle;
  try {
    filehandle = await fsPromises.open('thefile.txt', 'r');
  } finally {
    if (filehandle !== undefined)
      await filehandle.close();
  }
}
```

### DEP0138: `process.mainModule` {#dep0138-processmainmodule}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v14.0.0 | Nur Dokumentations-Deprecation. |
:::

Typ: Nur Dokumentation

[`process.mainModule`](/de/nodejs/api/process#processmainmodule) ist eine reine CommonJS-Funktion, während das globale `process`-Objekt mit Nicht-CommonJS-Umgebungen geteilt wird. Die Verwendung innerhalb von ECMAScript-Modulen wird nicht unterstützt.

Es ist zugunsten von [`require.main`](/de/nodejs/api/modules#accessing-the-main-module) als veraltet markiert, da es den gleichen Zweck erfüllt und nur in CommonJS-Umgebungen verfügbar ist.

### DEP0139: `process.umask()` ohne Argumente {#dep0139-processumask-with-no-arguments}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v14.0.0, v12.19.0 | Nur Dokumentations-Deprecation. |
:::

Typ: Nur Dokumentation

Der Aufruf von `process.umask()` ohne Argument bewirkt, dass die prozessweite Umask zweimal geschrieben wird. Dies führt zu einer Race-Condition zwischen Threads und ist eine potenzielle Sicherheitslücke. Es gibt keine sichere, plattformübergreifende alternative API.

### DEP0140: Verwenden Sie `request.destroy()` anstelle von `request.abort()` {#dep0140-use-requestdestroy-instead-of-requestabort}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v14.1.0, v13.14.0 | Nur Dokumentations-Deprecation. |
:::

Typ: Nur Dokumentation

Verwenden Sie [`request.destroy()`](/de/nodejs/api/http#requestdestroyerror) anstelle von [`request.abort()`](/de/nodejs/api/http#requestabort).

### DEP0141: `repl.inputStream` und `repl.outputStream` {#dep0141-replinputstream-and-reploutputstream}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v14.3.0 | Nur Dokumentation (unterstützt [`--pending-deprecation`][]). |
:::

Typ: Nur Dokumentation (unterstützt [`--pending-deprecation`](/de/nodejs/api/cli#--pending-deprecation))

Das `node:repl`-Modul exportierte den Eingabe- und Ausgabestream zweimal. Verwenden Sie `.input` anstelle von `.inputStream` und `.output` anstelle von `.outputStream`.

### DEP0142: `repl._builtinLibs` {#dep0142-repl_builtinlibs}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v14.3.0 | Nur Dokumentation (unterstützt [`--pending-deprecation`][]). |
:::

Typ: Nur Dokumentation

Das `node:repl`-Modul exportiert eine `_builtinLibs`-Eigenschaft, die ein Array integrierter Module enthält. Es war bisher unvollständig und stattdessen ist es besser, sich auf `require('node:module').builtinModules` zu verlassen.


### DEP0143: `Transform._transformState` {#dep0143-transform_transformstate}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v14.5.0 | Laufzeit-Deprecation. |
:::

Typ: Laufzeit `Transform._transformState` wird in zukünftigen Versionen entfernt, da es aufgrund der Vereinfachung der Implementierung nicht mehr benötigt wird.

### DEP0144: `module.parent` {#dep0144-moduleparent}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v14.6.0, v12.19.0 | Nur-Dokumentations-Deprecation. |
:::

Typ: Nur-Dokumentations-Deprecation (unterstützt [`--pending-deprecation`](/de/nodejs/api/cli#--pending-deprecation))

Ein CommonJS-Modul kann über `module.parent` auf das erste Modul zugreifen, das es benötigt hat. Dieses Feature ist veraltet, da es in Gegenwart von ECMAScript-Modulen nicht konsistent funktioniert und eine ungenaue Darstellung des CommonJS-Modulgraphen liefert.

Einige Module verwenden es, um zu überprüfen, ob sie der Einstiegspunkt des aktuellen Prozesses sind. Stattdessen wird empfohlen, `require.main` und `module` zu vergleichen:

```js [ESM]
if (require.main === module) {
  // Code-Abschnitt, der nur ausgeführt wird, wenn die aktuelle Datei der Einstiegspunkt ist.
}
```
Bei der Suche nach den CommonJS-Modulen, die das aktuelle Modul benötigt haben, können `require.cache` und `module.children` verwendet werden:

```js [ESM]
const moduleParents = Object.values(require.cache)
  .filter((m) => m.children.includes(module));
```
### DEP0145: `socket.bufferSize` {#dep0145-socketbuffersize}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v14.6.0 | Nur-Dokumentations-Deprecation. |
:::

Typ: Nur-Dokumentations-Deprecation

[`socket.bufferSize`](/de/nodejs/api/net#socketbuffersize) ist nur ein Alias für [`writable.writableLength`](/de/nodejs/api/stream#writablewritablelength).

### DEP0146: `new crypto.Certificate()` {#dep0146-new-cryptocertificate}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v14.9.0 | Nur-Dokumentations-Deprecation. |
:::

Typ: Nur-Dokumentations-Deprecation

Der [`crypto.Certificate()` Konstruktor](/de/nodejs/api/crypto#legacy-api) ist veraltet. Verwenden Sie stattdessen [statische Methoden von `crypto.Certificate()`](/de/nodejs/api/crypto#class-certificate).

### DEP0147: `fs.rmdir(path, { recursive: true })` {#dep0147-fsrmdirpath-{-recursive-true-}}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v16.0.0 | Laufzeit-Deprecation. |
| v15.0.0 | Laufzeit-Deprecation für permissives Verhalten. |
| v14.14.0 | Nur-Dokumentations-Deprecation. |
:::

Typ: Laufzeit

In zukünftigen Versionen von Node.js wird die Option `recursive` für `fs.rmdir`, `fs.rmdirSync` und `fs.promises.rmdir` ignoriert.

Verwenden Sie stattdessen `fs.rm(path, { recursive: true, force: true })`, `fs.rmSync(path, { recursive: true, force: true })` oder `fs.promises.rm(path, { recursive: true, force: true })`.


### DEP0148: Ordnerzuordnungen in `"exports"` (nachgestelltes `"/"`) {#dep0148-folder-mappings-in-"exports"-trailing-"/"}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v17.0.0 | End-of-Life. |
| v16.0.0 | Laufzeit-Missbilligung. |
| v15.1.0 | Laufzeit-Missbilligung für selbst-referenzierende Importe. |
| v14.13.0 | Nur-Dokumentations-Missbilligung. |
:::

Typ: Laufzeit

Die Verwendung eines nachgestellten `"/"` zur Definition von Subpfad-Ordnerzuordnungen in den Feldern [Subpfad-Exporte](/de/nodejs/api/packages#subpath-exports) oder [Subpfad-Importe](/de/nodejs/api/packages#subpath-imports) ist veraltet. Verwenden Sie stattdessen [Subpfad-Muster](/de/nodejs/api/packages#subpath-patterns).

### DEP0149: `http.IncomingMessage#connection` {#dep0149-httpincomingmessageconnection}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v16.0.0 | Nur-Dokumentations-Missbilligung. |
:::

Typ: Nur-Dokumentation.

Bevorzugen Sie [`message.socket`](/de/nodejs/api/http#messagesocket) gegenüber [`message.connection`](/de/nodejs/api/http#messageconnection).

### DEP0150: Ändern des Wertes von `process.config` {#dep0150-changing-the-value-of-processconfig}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v19.0.0 | End-of-Life. |
| v16.0.0 | Laufzeit-Missbilligung. |
:::

Typ: End-of-Life

Die Eigenschaft `process.config` bietet Zugriff auf die Node.js-Kompilierzeiteinstellungen. Die Eigenschaft ist jedoch veränderbar und daher anfällig für Manipulationen. Die Möglichkeit, den Wert zu ändern, wird in einer zukünftigen Version von Node.js entfernt.

### DEP0151: Hauptindexsuche und Erweiterungssuche {#dep0151-main-index-lookup-and-extension-searching}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v16.0.0 | Laufzeit-Missbilligung. |
| v15.8.0, v14.18.0 | Nur-Dokumentations-Missbilligung mit `--pending-deprecation`-Unterstützung. |
:::

Typ: Laufzeit

Zuvor galten `index.js`- und Erweiterungssuchen für die Auflösung des Haupteinstiegspunkts `import 'pkg'`, selbst wenn ES-Module aufgelöst wurden.

Mit dieser Missbilligung erfordern alle ES-Modul-Haupteinstiegspunktauflösungen einen expliziten [`"exports"` oder `"main"`-Eintrag](/de/nodejs/api/packages#main-entry-point-export) mit der genauen Dateierweiterung.

### DEP0152: Erweiterungs-PerformanceEntry-Eigenschaften {#dep0152-extension-performanceentry-properties}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v16.0.0 | Laufzeit-Missbilligung. |
:::

Typ: Laufzeit

Die Objekttypen `'gc'`, `'http2'` und `'http'` [\<PerformanceEntry\>](/de/nodejs/api/perf_hooks#class-performanceentry) haben zusätzliche Eigenschaften, die zusätzliche Informationen liefern. Diese Eigenschaften sind jetzt innerhalb der Standardeigenschaft `detail` des `PerformanceEntry`-Objekts verfügbar. Die bestehenden Accessoren sind veraltet und sollten nicht mehr verwendet werden.


### DEP0153: Typumwandlung für Optionen von `dns.lookup` und `dnsPromises.lookup` {#dep0153-dnslookup-and-dnspromiseslookup-options-type-coercion}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | End-of-Life. |
| v17.0.0 | Laufzeit-Deprecation. |
| v16.8.0 | Nur-Dokumentations-Deprecation. |
:::

Typ: End-of-Life

Die Verwendung eines Nicht-Null-Nicht-Integer-Werts für die Option `family`, eines Nicht-Null-Nicht-Zahlenwerts für die Option `hints`, eines Nicht-Null-Nicht-Boolean-Werts für die Option `all` oder eines Nicht-Null-Nicht-Boolean-Werts für die Option `verbatim` in [`dns.lookup()`](/de/nodejs/api/dns#dnslookuphostname-options-callback) und [`dnsPromises.lookup()`](/de/nodejs/api/dns#dnspromiseslookuphostname-options) löst einen `ERR_INVALID_ARG_TYPE`-Fehler aus.

### DEP0154: RSA-PSS Optionen zum Generieren von Schlüsselpaaren {#dep0154-rsa-pss-generate-key-pair-options}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v20.0.0 | Laufzeit-Deprecation. |
| v16.10.0 | Nur-Dokumentations-Deprecation. |
:::

Typ: Laufzeit

Die Optionen `'hash'` und `'mgf1Hash'` werden durch `'hashAlgorithm'` und `'mgf1HashAlgorithm'` ersetzt.

### DEP0155: Abschließende Schrägstriche in Musterspezifizierer-Auflösungen {#dep0155-trailing-slashes-in-pattern-specifier-resolutions}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v17.0.0 | Laufzeit-Deprecation. |
| v16.10.0 | Nur-Dokumentations-Deprecation mit `--pending-deprecation`-Unterstützung. |
:::

Typ: Laufzeit

Die Neuzuordnung von Spezifizierern, die mit `"/"` enden, wie `import 'pkg/x/'`, ist für Paket-`"exports"`- und `"imports"`-Musterauflösungen veraltet.

### DEP0156: Eigenschaft `.aborted` und Event `'abort'`, `'aborted'` in `http` {#dep0156-aborted-property-and-abort-aborted-event-in-http}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v17.0.0, v16.12.0 | Nur-Dokumentations-Deprecation. |
:::

Typ: Nur-Dokumentations-Deprecation

Wechseln Sie stattdessen zur [\<Stream\>](/de/nodejs/api/stream#stream) API, da [`http.ClientRequest`](/de/nodejs/api/http#class-httpclientrequest), [`http.ServerResponse`](/de/nodejs/api/http#class-httpserverresponse) und [`http.IncomingMessage`](/de/nodejs/api/http#class-httpincomingmessage) alle stream-basiert sind. Überprüfen Sie `stream.destroyed` anstelle der Eigenschaft `.aborted` und lauschen Sie auf `'close'` anstelle des Events `'abort'`, `'aborted'`.

Die Eigenschaft `.aborted` und das Event `'abort'` sind nur nützlich, um `.abort()`-Aufrufe zu erkennen. Für das vorzeitige Schließen einer Anfrage verwenden Sie Stream `.destroy([error])`, überprüfen Sie dann die Eigenschaft `.destroyed` und das Event `'close'` sollte den gleichen Effekt haben. Das empfangende Ende sollte auch den Wert [`readable.readableEnded`](/de/nodejs/api/stream#readablereadableended) in [`http.IncomingMessage`](/de/nodejs/api/http#class-httpincomingmessage) überprüfen, um festzustellen, ob es sich um eine abgebrochene oder ordnungsgemäße Zerstörung handelte.


### DEP0157: Thenable-Unterstützung in Streams {#dep0157-thenable-support-in-streams}

::: info [Verlauf]
| Version | Änderungen |
|---|---|
| v18.0.0 | End-of-Life. |
| v17.2.0, v16.14.0 | Nur Dokumentations-Deprecation. |
:::

Typ: End-of-Life

Ein undokumentiertes Feature von Node.js-Streams war die Unterstützung von Thenables in Implementierungsmethoden. Dies ist jetzt veraltet. Verwenden Sie stattdessen Callbacks und vermeiden Sie die Verwendung von Async-Funktionen für Stream-Implementierungsmethoden.

Dieses Feature führte dazu, dass Benutzer unerwartete Probleme hatten, wenn der Benutzer die Funktion im Callback-Stil implementiert, aber z. B. eine Async-Methode verwendet, die einen Fehler verursachen würde, da das Mischen von Promise- und Callback-Semantik ungültig ist.

```js [ESM]
const w = new Writable({
  async final(callback) {
    await someOp();
    callback();
  },
});
```
### DEP0158: `buffer.slice(start, end)` {#dep0158-bufferslicestart-end}

::: info [Verlauf]
| Version | Änderungen |
|---|---|
| v17.5.0, v16.15.0 | Nur Dokumentations-Deprecation. |
:::

Typ: Nur Dokumentation

Diese Methode wurde als veraltet markiert, da sie nicht mit `Uint8Array.prototype.slice()` kompatibel ist, was eine Superklasse von `Buffer` ist.

Verwenden Sie stattdessen [`buffer.subarray`](/de/nodejs/api/buffer#bufsubarraystart-end), was dasselbe bewirkt.

### DEP0159: `ERR_INVALID_CALLBACK` {#dep0159-err_invalid_callback}

::: info [Verlauf]
| Version | Änderungen |
|---|---|
| v18.0.0 | End-of-Life. |
:::

Typ: End-of-Life

Dieser Fehlercode wurde entfernt, da er die Fehler, die für die Validierung von Werttypen verwendet werden, zusätzlich verwirrte.

### DEP0160: `process.on('multipleResolves', handler)` {#dep0160-processonmultipleresolves-handler}

::: info [Verlauf]
| Version | Änderungen |
|---|---|
| v18.0.0 | Runtime-Deprecation. |
| v17.6.0, v16.15.0 | Nur Dokumentations-Deprecation. |
:::

Typ: Runtime.

Dieses Ereignis wurde als veraltet markiert, da es nicht mit V8-Promise-Kombinatoren funktionierte, was seinen Nutzen verringerte.

### DEP0161: `process._getActiveRequests()` und `process._getActiveHandles()` {#dep0161-process_getactiverequests-and-process_getactivehandles}

::: info [Verlauf]
| Version | Änderungen |
|---|---|
| v17.6.0, v16.15.0 | Nur Dokumentations-Deprecation. |
:::

Typ: Nur Dokumentation

Die Funktionen `process._getActiveHandles()` und `process._getActiveRequests()` sind nicht für die öffentliche Verwendung bestimmt und können in zukünftigen Versionen entfernt werden.

Verwenden Sie [`process.getActiveResourcesInfo()`](/de/nodejs/api/process#processgetactiveresourcesinfo), um eine Liste von Typen aktiver Ressourcen und nicht die tatsächlichen Referenzen abzurufen.


### DEP0162: `fs.write()`, `fs.writeFileSync()` Typumwandlung zu String {#dep0162-fswrite-fswritefilesync-coercion-to-string}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v19.0.0 | End-of-Life. |
| v18.0.0 | Laufzeit-Deprecation. |
| v17.8.0, v16.15.0 | Nur-Dokumentations-Deprecation. |
:::

Typ: End-of-Life

Implizite Typumwandlung von Objekten mit eigener `toString`-Eigenschaft, die als zweiter Parameter in [`fs.write()`](/de/nodejs/api/fs#fswritefd-buffer-offset-length-position-callback), [`fs.writeFile()`](/de/nodejs/api/fs#fswritefilefile-data-options-callback), [`fs.appendFile()`](/de/nodejs/api/fs#fsappendfilepath-data-options-callback), [`fs.writeFileSync()`](/de/nodejs/api/fs#fswritefilesyncfile-data-options) und [`fs.appendFileSync()`](/de/nodejs/api/fs#fsappendfilesyncpath-data-options) übergeben werden, ist veraltet. Wandeln Sie diese in primitive Strings um.

### DEP0163: `channel.subscribe(onMessage)`, `channel.unsubscribe(onMessage)` {#dep0163-channelsubscribeonmessage-channelunsubscribeonmessage}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v18.7.0, v16.17.0 | Nur-Dokumentations-Deprecation. |
:::

Typ: Nur-Dokumentations-Deprecation

Diese Methoden wurden als veraltet markiert, weil sie so verwendet werden können, dass die Kanalreferenz nicht lange genug am Leben gehalten wird, um die Ereignisse zu empfangen.

Verwenden Sie stattdessen [`diagnostics_channel.subscribe(name, onMessage)`](/de/nodejs/api/diagnostics_channel#diagnostics_channelsubscribename-onmessage) oder [`diagnostics_channel.unsubscribe(name, onMessage)`](/de/nodejs/api/diagnostics_channel#diagnostics_channelunsubscribename-onmessage), die dasselbe tun.

### DEP0164: `process.exit(code)`, `process.exitCode` Typumwandlung zu Integer {#dep0164-processexitcode-processexitcode-coercion-to-integer}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v20.0.0 | End-of-Life. |
| v19.0.0 | Laufzeit-Deprecation. |
| v18.10.0, v16.18.0 | Nur-Dokumentations-Deprecation der Integer-Typumwandlung von `process.exitCode`. |
| v18.7.0, v16.17.0 | Nur-Dokumentations-Deprecation der Integer-Typumwandlung von `process.exit(code)`. |
:::

Typ: End-of-Life

Andere Werte als `undefined`, `null`, ganze Zahlen und Integer-Strings (z. B. `'1'`) sind als Wert für den Parameter `code` in [`process.exit()`](/de/nodejs/api/process#processexitcode) und als Wert, der [`process.exitCode`](/de/nodejs/api/process#processexitcode_1) zugewiesen wird, veraltet.


### DEP0165: `--trace-atomics-wait` {#dep0165---trace-atomics-wait}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v23.0.0 | End-of-Life. |
| v22.0.0 | Laufzeit-Deprecation. |
| v18.8.0, v16.18.0 | Nur-Dokumentations-Deprecation. |
:::

Typ: End-of-Life

Das Flag `--trace-atomics-wait` wurde entfernt, da es den V8-Hook `SetAtomicsWaitCallback` verwendet, der in einer zukünftigen V8-Version entfernt wird.

### DEP0166: Doppelte Schrägstriche in Import- und Exportzielen {#dep0166-double-slashes-in-imports-and-exports-targets}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v19.0.0 | Laufzeit-Deprecation. |
| v18.10.0 | Nur-Dokumentations-Deprecation mit `--pending-deprecation`-Unterstützung. |
:::

Typ: Laufzeit

Paketimport- und Exportziele, die Pfade mit einem doppelten Schrägstrich (von *"/"* oder *"\"*) abbilden, sind veraltet und führen in einer zukünftigen Version zu einem Auflösungsvalidierungsfehler. Die gleiche Deprecation gilt auch für Musterübereinstimmungen, die mit einem Schrägstrich beginnen oder enden.

### DEP0167: Schwache `DiffieHellmanGroup`-Instanzen (`modp1`, `modp2`, `modp5`) {#dep0167-weak-diffiehellmangroup-instances-modp1-modp2-modp5}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.10.0, v16.18.0 | Nur-Dokumentations-Deprecation. |
:::

Typ: Nur-Dokumentation

Die bekannten MODP-Gruppen `modp1`, `modp2` und `modp5` sind veraltet, da sie nicht sicher gegen praktische Angriffe sind. Siehe [RFC 8247 Abschnitt 2.4](https://www.rfc-editor.org/rfc/rfc8247#section-2.4) für Details.

Diese Gruppen könnten in zukünftigen Versionen von Node.js entfernt werden. Anwendungen, die auf diese Gruppen angewiesen sind, sollten stattdessen die Verwendung stärkerer MODP-Gruppen in Erwägung ziehen.

### DEP0168: Unbehandelte Ausnahme in Node-API-Callbacks {#dep0168-unhandled-exception-in-node-api-callbacks}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.3.0, v16.17.0 | Laufzeit-Deprecation. |
:::

Typ: Laufzeit

Die implizite Unterdrückung von unbehandelten Ausnahmen in Node-API-Callbacks ist jetzt veraltet.

Setzen Sie das Flag [`--force-node-api-uncaught-exceptions-policy`](/de/nodejs/api/cli#--force-node-api-uncaught-exceptions-policy), um Node.js zu zwingen, ein [`'uncaughtException'`-Ereignis](/de/nodejs/api/process#event-uncaughtexception) auszugeben, wenn die Ausnahme nicht in Node-API-Callbacks behandelt wird.


### DEP0169: Unsichere url.parse() {#dep0169-insecure-urlparse}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v19.9.0, v18.17.0 | Unterstützung für `--pending-deprecation` hinzugefügt. |
| v19.0.0, v18.13.0 | Nur-Dokumentations-Deprecation. |
:::

Typ: Nur Dokumentation (unterstützt [`--pending-deprecation`](/de/nodejs/api/cli#--pending-deprecation))

Das Verhalten von [`url.parse()`](/de/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) ist nicht standardisiert und anfällig für Fehler, die Sicherheitsrisiken bergen. Verwenden Sie stattdessen die [WHATWG URL API](/de/nodejs/api/url#the-whatwg-url-api). Für Schwachstellen in `url.parse()` werden keine CVEs ausgestellt.

### DEP0170: Ungültiger Port bei Verwendung von `url.parse()` {#dep0170-invalid-port-when-using-urlparse}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v20.0.0 | Laufzeit-Deprecation. |
| v19.2.0, v18.13.0 | Nur-Dokumentations-Deprecation. |
:::

Typ: Laufzeit

[`url.parse()`](/de/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) akzeptiert URLs mit Ports, die keine Zahlen sind. Dieses Verhalten kann zu Hostname-Spoofing mit unerwarteten Eingaben führen. Diese URLs werfen in zukünftigen Versionen von Node.js einen Fehler, wie es die [WHATWG URL API](/de/nodejs/api/url#the-whatwg-url-api) bereits tut.

### DEP0171: Setter für `http.IncomingMessage` Header und Trailer {#dep0171-setters-for-httpincomingmessage-headers-and-trailers}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v19.3.0, v18.13.0 | Nur-Dokumentations-Deprecation. |
:::

Typ: Nur Dokumentation

In einer zukünftigen Version von Node.js sind [`message.headers`](/de/nodejs/api/http#messageheaders), [`message.headersDistinct`](/de/nodejs/api/http#messageheadersdistinct), [`message.trailers`](/de/nodejs/api/http#messagetrailers) und [`message.trailersDistinct`](/de/nodejs/api/http#messagetrailersdistinct) schreibgeschützt.

### DEP0172: Die Eigenschaft `asyncResource` von an `AsyncResource` gebundenen Funktionen {#dep0172-the-asyncresource-property-of-asyncresource-bound-functions}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v20.0.0 | Laufzeit-Deprecation. |
:::

Typ: Laufzeit

In einer zukünftigen Version von Node.js wird die Eigenschaft `asyncResource` nicht mehr hinzugefügt, wenn eine Funktion an eine `AsyncResource` gebunden ist.

### DEP0173: Die Klasse `assert.CallTracker` {#dep0173-the-assertcalltracker-class}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v20.1.0 | Nur-Dokumentations-Deprecation. |
:::

Typ: Nur Dokumentation

In einer zukünftigen Version von Node.js wird [`assert.CallTracker`](/de/nodejs/api/assert#class-assertcalltracker) entfernt. Erwägen Sie die Verwendung von Alternativen wie der Helferfunktion [`mock`](/de/nodejs/api/test#mocking).


### DEP0174: Aufruf von `promisify` für eine Funktion, die ein `Promise` zurückgibt {#dep0174-calling-promisify-on-a-function-that-returns-a-promise}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v21.0.0 | Laufzeit-Veraltung. |
| v20.8.0 | Veraltung nur in der Dokumentation. |
:::

Typ: Laufzeit

Der Aufruf von [`util.promisify`](/de/nodejs/api/util#utilpromisifyoriginal) für eine Funktion, die ein 

### DEP0175: `util.toUSVString` {#dep0175-utiltousvstring}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v20.8.0 | Veraltung nur in der Dokumentation. |
:::

Typ: Veraltung nur in der Dokumentation

Die [`util.toUSVString()`](/de/nodejs/api/util#utiltousvstringstring)-API ist veraltet. Verwenden Sie stattdessen [`String.prototype.toWellFormed`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toWellFormed).

### DEP0176: `fs.F_OK`, `fs.R_OK`, `fs.W_OK`, `fs.X_OK` {#dep0176-fsf_ok-fsr_ok-fsw_ok-fsx_ok}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v20.8.0 | Veraltung nur in der Dokumentation. |
:::

Typ: Veraltung nur in der Dokumentation

`F_OK`, `R_OK`, `W_OK` und `X_OK`-Getter, die direkt auf `node:fs` verfügbar gemacht werden, sind veraltet. Rufen Sie sie stattdessen von `fs.constants` oder `fs.promises.constants` ab.

### DEP0177: `util.types.isWebAssemblyCompiledModule` {#dep0177-utiltypesiswebassemblycompiledmodule}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v21.7.0, v20.12.0 | End-of-Life. |
| v21.3.0, v20.11.0 | Ein Veraltungscode wurde zugewiesen. |
| v14.0.0 | Veraltung nur in der Dokumentation. |
:::

Typ: End-of-Life

Die `util.types.isWebAssemblyCompiledModule`-API wurde entfernt. Verwenden Sie stattdessen `value instanceof WebAssembly.Module`.

### DEP0178: `dirent.path` {#dep0178-direntpath}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v23.0.0 | Laufzeit-Veraltung. |
| v21.5.0, v20.12.0, v18.20.0 | Veraltung nur in der Dokumentation. |
:::

Typ: Laufzeit

Die [`dirent.path`](/de/nodejs/api/fs#direntpath) ist aufgrund mangelnder Konsistenz über Release-Linien hinweg veraltet. Verwenden Sie stattdessen [`dirent.parentPath`](/de/nodejs/api/fs#direntparentpath).

### DEP0179: `Hash`-Konstruktor {#dep0179-hash-constructor}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v22.0.0 | Laufzeit-Veraltung. |
| v21.5.0, v20.12.0 | Veraltung nur in der Dokumentation. |
:::

Typ: Laufzeit

Der direkte Aufruf der `Hash`-Klasse mit `Hash()` oder `new Hash()` ist veraltet, da es sich um interne Elemente handelt, die nicht für die öffentliche Verwendung bestimmt sind. Verwenden Sie stattdessen die Methode [`crypto.createHash()`](/de/nodejs/api/crypto#cryptocreatehashalgorithm-options), um Hash-Instanzen zu erstellen.


### DEP0180: `fs.Stats` Konstruktor {#dep0180-fsstats-constructor}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v22.0.0 | Laufzeit-Deprecation. |
| v20.13.0 | Nur-Dokumentations-Deprecation. |
:::

Typ: Laufzeit

Der direkte Aufruf der Klasse `fs.Stats` mit `Stats()` oder `new Stats()` ist veraltet, da es sich um interne Elemente handelt, die nicht für die öffentliche Verwendung bestimmt sind.

### DEP0181: `Hmac` Konstruktor {#dep0181-hmac-constructor}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v22.0.0 | Laufzeit-Deprecation. |
| v20.13.0 | Nur-Dokumentations-Deprecation. |
:::

Typ: Laufzeit

Der direkte Aufruf der Klasse `Hmac` mit `Hmac()` oder `new Hmac()` ist veraltet, da es sich um interne Elemente handelt, die nicht für die öffentliche Verwendung bestimmt sind. Bitte verwenden Sie die Methode [`crypto.createHmac()`](/de/nodejs/api/crypto#cryptocreatehmacalgorithm-key-options), um Hmac-Instanzen zu erstellen.

### DEP0182: Kurze GCM-Authentifizierungs-Tags ohne explizite `authTagLength` {#dep0182-short-gcm-authentication-tags-without-explicit-authtaglength}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v23.0.0 | Laufzeit-Deprecation. |
| v20.13.0 | Nur-Dokumentations-Deprecation. |
:::

Typ: Laufzeit

Anwendungen, die Authentifizierungs-Tags verwenden möchten, die kürzer als die standardmäßige Authentifizierungs-Tag-Länge sind, müssen die Option `authTagLength` der Funktion [`crypto.createDecipheriv()`](/de/nodejs/api/crypto#cryptocreatedecipherivalgorithm-key-iv-options) auf die entsprechende Länge setzen.

Für Chiffren im GCM-Modus akzeptiert die Funktion [`decipher.setAuthTag()`](/de/nodejs/api/crypto#deciphersetauthtagbuffer-encoding) Authentifizierungs-Tags beliebiger gültiger Länge (siehe [DEP0090](/de/nodejs/api/deprecations#DEP0090)). Dieses Verhalten ist veraltet, um es besser an die Empfehlungen gemäß [NIST SP 800-38D](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38d.pdf) anzupassen.

### DEP0183: OpenSSL-Engine-basierte APIs {#dep0183-openssl-engine-based-apis}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v22.4.0, v20.16.0 | Nur-Dokumentations-Deprecation. |
:::

Typ: Nur-Dokumentations-Deprecation

OpenSSL 3 hat die Unterstützung für benutzerdefinierte Engines als veraltet markiert und empfiehlt, auf das neue Provider-Modell umzusteigen. Die Option `clientCertEngine` für `https.request()`, [`tls.createSecureContext()`](/de/nodejs/api/tls#tlscreatesecurecontextoptions) und [`tls.createServer()`](/de/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener); `privateKeyEngine` und `privateKeyIdentifier` für [`tls.createSecureContext()`](/de/nodejs/api/tls#tlscreatesecurecontextoptions); und [`crypto.setEngine()`](/de/nodejs/api/crypto#cryptosetengineengine-flags) hängen alle von dieser Funktionalität von OpenSSL ab.


### DEP0184: Instanziierung von `node:zlib`-Klassen ohne `new` {#dep0184-instantiating-nodezlib-classes-without-new}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v22.9.0, v20.18.0 | Nur-Dokumentations-Veraltung. |
:::

Typ: Nur-Dokumentation

Das Instanziieren von Klassen ohne das `new`-Qualifikationsmerkmal, das vom `node:zlib`-Modul exportiert wird, ist veraltet. Es wird empfohlen, stattdessen das `new`-Qualifikationsmerkmal zu verwenden. Dies gilt für alle Zlib-Klassen, wie z. B. `Deflate`, `DeflateRaw`, `Gunzip`, `Inflate`, `InflateRaw`, `Unzip` und `Zlib`.

### DEP0185: Instanziierung von `node:repl`-Klassen ohne `new` {#dep0185-instantiating-noderepl-classes-without-new}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v22.9.0, v20.18.0 | Nur-Dokumentations-Veraltung. |
:::

Typ: Nur-Dokumentation

Das Instanziieren von Klassen ohne das `new`-Qualifikationsmerkmal, das vom `node:repl`-Modul exportiert wird, ist veraltet. Es wird empfohlen, stattdessen das `new`-Qualifikationsmerkmal zu verwenden. Dies gilt für alle REPL-Klassen, einschließlich `REPLServer` und `Recoverable`.

### DEP0187: Übergabe ungültiger Argumenttypen an `fs.existsSync` {#dep0187-passing-invalid-argument-types-to-fsexistssync}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v23.4.0 | Nur Dokumentation. |
:::

Typ: Nur-Dokumentation

Die Übergabe nicht unterstützter Argumenttypen ist veraltet und führt in einer zukünftigen Version zu einem Fehler, anstatt `false` zurückzugeben.

### DEP0188: `process.features.ipv6` und `process.features.uv` {#dep0188-processfeaturesipv6-and-processfeaturesuv}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v23.4.0 | Nur-Dokumentations-Veraltung. |
:::

Typ: Nur-Dokumentation

Diese Eigenschaften sind bedingungslos `true`. Alle auf diesen Eigenschaften basierenden Prüfungen sind redundant.

### DEP0189: `process.features.tls_*` {#dep0189-processfeaturestls_*}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v23.4.0 | Nur-Dokumentations-Veraltung. |
:::

Typ: Nur-Dokumentation

`process.features.tls_alpn`, `process.features.tls_ocsp` und `process.features.tls_sni` sind veraltet, da ihre Werte garantiert mit denen von `process.features.tls` identisch sind.

