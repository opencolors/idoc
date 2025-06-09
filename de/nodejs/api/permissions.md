---
title: Node.js Berechtigungs-API
description: Die Dokumentation der Node.js Berechtigungs-API beschreibt, wie Berechtigungen für verschiedene Operationen innerhalb von Node.js-Anwendungen verwaltet und kontrolliert werden, um einen sicheren und kontrollierten Zugriff auf Systemressourcen zu gewährleisten.
head:
  - - meta
    - name: og:title
      content: Node.js Berechtigungs-API | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Die Dokumentation der Node.js Berechtigungs-API beschreibt, wie Berechtigungen für verschiedene Operationen innerhalb von Node.js-Anwendungen verwaltet und kontrolliert werden, um einen sicheren und kontrollierten Zugriff auf Systemressourcen zu gewährleisten.
  - - meta
    - name: twitter:title
      content: Node.js Berechtigungs-API | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Die Dokumentation der Node.js Berechtigungs-API beschreibt, wie Berechtigungen für verschiedene Operationen innerhalb von Node.js-Anwendungen verwaltet und kontrolliert werden, um einen sicheren und kontrollierten Zugriff auf Systemressourcen zu gewährleisten.
---


# Berechtigungen {#permissions}

Berechtigungen können verwendet werden, um zu steuern, auf welche Systemressourcen der Node.js-Prozess Zugriff hat oder welche Aktionen der Prozess mit diesen Ressourcen ausführen kann.

- [Prozessbasierte Berechtigungen](/de/nodejs/api/permissions#process-based-permissions) steuern den Zugriff des Node.js-Prozesses auf Ressourcen. Die Ressource kann vollständig erlaubt oder verweigert werden, oder Aktionen im Zusammenhang damit können gesteuert werden. Beispielsweise können Dateisystemlesevorgänge erlaubt werden, während Schreibvorgänge verweigert werden. Diese Funktion schützt nicht vor bösartigem Code. Gemäß der Node.js [Sicherheitsrichtlinie](https://github.com/nodejs/node/blob/main/SECURITY.md) vertraut Node.js jedem Code, der zur Ausführung aufgefordert wird.

Das Berechtigungsmodell implementiert einen "Sicherheitsgurt"-Ansatz, der verhindert, dass vertrauenswürdiger Code unbeabsichtigt Dateien ändert oder Ressourcen verwendet, deren Zugriff nicht explizit gewährt wurde. Es bietet keine Sicherheitsgarantien bei bösartigem Code. Bösartiger Code kann das Berechtigungsmodell umgehen und beliebigen Code ohne die Einschränkungen des Berechtigungsmodells ausführen.

Wenn Sie eine potenzielle Sicherheitslücke finden, lesen Sie bitte unsere [Sicherheitsrichtlinie](https://github.com/nodejs/node/blob/main/SECURITY.md).

## Prozessbasierte Berechtigungen {#process-based-permissions}

### Berechtigungsmodell {#permission-model}

::: tip [Stabil: 2 - Stabil]
[Stabil: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil.
:::

Das Node.js-Berechtigungsmodell ist ein Mechanismus, um den Zugriff auf bestimmte Ressourcen während der Ausführung einzuschränken. Die API befindet sich hinter einem Flag [`--permission`](/de/nodejs/api/cli#--permission), das, wenn aktiviert, den Zugriff auf alle verfügbaren Berechtigungen einschränkt.

Die verfügbaren Berechtigungen sind durch das Flag [`--permission`](/de/nodejs/api/cli#--permission) dokumentiert.

Beim Starten von Node.js mit `--permission` wird die Möglichkeit, über das Modul `fs` auf das Dateisystem zuzugreifen, Prozesse zu erzeugen, `node:worker_threads` zu verwenden, native Add-ons zu verwenden, WASI zu verwenden und den Laufzeitinspektor zu aktivieren, eingeschränkt.

```bash [BASH]
$ node --permission index.js

Error: Access to this API has been restricted
    at node:internal/main/run_main_module:23:47 {
  code: 'ERR_ACCESS_DENIED',
  permission: 'FileSystemRead',
  resource: '/home/user/index.js'
}
```
Der Zugriff zum Erzeugen eines Prozesses und zum Erstellen von Worker-Threads kann mit den Flags [`--allow-child-process`](/de/nodejs/api/cli#--allow-child-process) bzw. [`--allow-worker`](/de/nodejs/api/cli#--allow-worker) ermöglicht werden.

Um native Add-ons bei Verwendung des Berechtigungsmodells zuzulassen, verwenden Sie das Flag [`--allow-addons`](/de/nodejs/api/cli#--allow-addons). Für WASI verwenden Sie das Flag [`--allow-wasi`](/de/nodejs/api/cli#--allow-wasi).


#### Runtime-API {#runtime-api}

Wenn das Berechtigungsmodell durch das Flag [`--permission`](/de/nodejs/api/cli#--permission) aktiviert wird, wird dem `process`-Objekt eine neue Eigenschaft `permission` hinzugefügt. Diese Eigenschaft enthält eine Funktion:

##### `permission.has(scope[, reference])` {#permissionhasscope-reference}

API-Aufruf zur Überprüfung von Berechtigungen zur Laufzeit ([`permission.has()`](/de/nodejs/api/process#processpermissionhasscope-reference))

```js [ESM]
process.permission.has('fs.write'); // true
process.permission.has('fs.write', '/home/rafaelgss/protected-folder'); // true

process.permission.has('fs.read'); // true
process.permission.has('fs.read', '/home/rafaelgss/protected-folder'); // false
```
#### Dateisystemberechtigungen {#file-system-permissions}

Das Berechtigungsmodell beschränkt standardmäßig den Zugriff auf das Dateisystem über das Modul `node:fs`. Es garantiert nicht, dass Benutzer nicht über andere Wege auf das Dateisystem zugreifen können, beispielsweise über das Modul `node:sqlite`.

Um den Zugriff auf das Dateisystem zu ermöglichen, verwenden Sie die Flags [`--allow-fs-read`](/de/nodejs/api/cli#--allow-fs-read) und [`--allow-fs-write`](/de/nodejs/api/cli#--allow-fs-write):

```bash [BASH]
$ node --permission --allow-fs-read=* --allow-fs-write=* index.js
Hello world!
```
Die gültigen Argumente für beide Flags sind:

- `*` - Um alle `FileSystemRead`- bzw. `FileSystemWrite`-Operationen zuzulassen.
- Durch Komma (`,`) getrennte Pfade, um nur übereinstimmende `FileSystemRead`- bzw. `FileSystemWrite`-Operationen zuzulassen.

Beispiel:

- `--allow-fs-read=*` - Erlaubt alle `FileSystemRead`-Operationen.
- `--allow-fs-write=*` - Erlaubt alle `FileSystemWrite`-Operationen.
- `--allow-fs-write=/tmp/` - Erlaubt den `FileSystemWrite`-Zugriff auf den Ordner `/tmp/`.
- `--allow-fs-read=/tmp/ --allow-fs-read=/home/.gitignore` - Erlaubt den `FileSystemRead`-Zugriff auf den Ordner `/tmp/` **und** den Pfad `/home/.gitignore`.

Wildcards werden ebenfalls unterstützt:

- `--allow-fs-read=/home/test*` erlaubt den Lesezugriff auf alles, was mit dem Wildcard übereinstimmt. z.B.: `/home/test/file1` oder `/home/test2`

Nachdem ein Wildcard-Zeichen (`*`) übergeben wurde, werden alle nachfolgenden Zeichen ignoriert. Beispielsweise funktioniert `/home/*.js` ähnlich wie `/home/*`.

Wenn das Berechtigungsmodell initialisiert wird, fügt es automatisch einen Wildcard (*) hinzu, wenn das angegebene Verzeichnis existiert. Wenn beispielsweise `/home/test/files` existiert, wird es wie `/home/test/files/*` behandelt. Wenn das Verzeichnis jedoch nicht existiert, wird der Wildcard nicht hinzugefügt und der Zugriff ist auf `/home/test/files` beschränkt. Wenn Sie den Zugriff auf einen Ordner erlauben möchten, der noch nicht existiert, stellen Sie sicher, dass Sie den Wildcard explizit angeben: `/my-path/folder-do-not-exist/*`.


#### Einschränkungen des Berechtigungsmodells {#permission-model-constraints}

Es gibt Einschränkungen, die Sie vor der Verwendung dieses Systems kennen sollten:

- Das Modell wird nicht an einen Kindknotenprozess oder einen Worker-Thread vererbt.
- Bei Verwendung des Berechtigungsmodells werden die folgenden Funktionen eingeschränkt:
    - Native Module
    - Kindprozesse
    - Worker-Threads
    - Inspektorenprotokoll
    - Dateisystemzugriff
    - WASI
  
 
- Das Berechtigungsmodell wird initialisiert, nachdem die Node.js-Umgebung eingerichtet wurde. Bestimmte Flags wie `--env-file` oder `--openssl-config` sind jedoch so konzipiert, dass sie Dateien vor der Initialisierung der Umgebung lesen. Folglich unterliegen solche Flags nicht den Regeln des Berechtigungsmodells. Das Gleiche gilt für V8-Flags, die zur Laufzeit über `v8.setFlagsFromString` gesetzt werden können.
- OpenSSL-Engines können zur Laufzeit nicht angefordert werden, wenn das Berechtigungsmodell aktiviert ist, was sich auf die integrierten Module crypto, https und tls auswirkt.
- Run-Time Loadable Extensions können nicht geladen werden, wenn das Berechtigungsmodell aktiviert ist, was sich auf das sqlite-Modul auswirkt.
- Die Verwendung vorhandener Dateideskriptoren über das Modul `node:fs` umgeht das Berechtigungsmodell.

#### Einschränkungen und bekannte Probleme {#limitations-and-known-issues}

- Symbolische Links werden auch zu Orten außerhalb der Menge von Pfaden verfolgt, denen der Zugriff gewährt wurde. Relative symbolische Links können den Zugriff auf beliebige Dateien und Verzeichnisse ermöglichen. Wenn Sie Anwendungen starten, bei denen das Berechtigungsmodell aktiviert ist, müssen Sie sicherstellen, dass keine Pfade, denen der Zugriff gewährt wurde, relative symbolische Links enthalten.

