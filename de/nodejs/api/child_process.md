---
title: Node.js Dokumentation - Kindprozess
description: Die Node.js-Dokumentation für das Kindprozessmodul, das beschreibt, wie Kindprozesse gestartet, deren Lebenszyklus verwaltet und die Kommunikation zwischen Prozessen gehandhabt wird.
head:
  - - meta
    - name: og:title
      content: Node.js Dokumentation - Kindprozess | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Die Node.js-Dokumentation für das Kindprozessmodul, das beschreibt, wie Kindprozesse gestartet, deren Lebenszyklus verwaltet und die Kommunikation zwischen Prozessen gehandhabt wird.
  - - meta
    - name: twitter:title
      content: Node.js Dokumentation - Kindprozess | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Die Node.js-Dokumentation für das Kindprozessmodul, das beschreibt, wie Kindprozesse gestartet, deren Lebenszyklus verwaltet und die Kommunikation zwischen Prozessen gehandhabt wird.
---


# Kindprozess {#child-process}

::: tip [Stabil: 2 - Stabil]
[Stabil: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil
:::

**Quellcode:** [lib/child_process.js](https://github.com/nodejs/node/blob/v23.5.0/lib/child_process.js)

Das Modul `node:child_process` bietet die Möglichkeit, Unterprozesse auf eine Art und Weise zu erzeugen, die [`popen(3)`](http://man7.org/linux/man-pages/man3/popen.3) ähnlich, aber nicht identisch ist. Diese Fähigkeit wird hauptsächlich durch die Funktion [`child_process.spawn()`](/de/nodejs/api/child_process#child_processspawncommand-args-options) bereitgestellt:

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
```

```js [ESM]
import { spawn } from 'node:child_process';
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
```
:::

Standardmäßig werden Pipes für `stdin`, `stdout` und `stderr` zwischen dem übergeordneten Node.js-Prozess und dem erzeugten Unterprozess eingerichtet. Diese Pipes haben eine begrenzte (und plattformspezifische) Kapazität. Wenn der Unterprozess mehr Daten in stdout schreibt, als diese Kapazität zulässt, ohne dass die Ausgabe erfasst wird, blockiert der Unterprozess und wartet darauf, dass der Pipe-Puffer weitere Daten aufnimmt. Dies entspricht dem Verhalten von Pipes in der Shell. Verwenden Sie die Option `{ stdio: 'ignore' }`, wenn die Ausgabe nicht verbraucht wird.

Die Befehlssuche erfolgt über die Umgebungsvariable `options.env.PATH`, wenn sich `env` im Objekt `options` befindet. Andernfalls wird `process.env.PATH` verwendet. Wenn `options.env` ohne `PATH` gesetzt ist, erfolgt die Suche unter Unix auf einem Standardsuchpfad von `/usr/bin:/bin` (siehe das Handbuch Ihres Betriebssystems für execvpe/execvp), unter Windows wird die Umgebungsvariable `PATH` des aktuellen Prozesses verwendet.

Unter Windows wird bei Umgebungsvariablen die Groß-/Kleinschreibung nicht beachtet. Node.js sortiert die `env`-Schlüssel lexikografisch und verwendet den ersten, der (ohne Beachtung der Groß-/Kleinschreibung) übereinstimmt. Nur der erste (in lexikografischer Reihenfolge) Eintrag wird an den Unterprozess übergeben. Dies kann unter Windows zu Problemen führen, wenn Objekte an die Option `env` übergeben werden, die mehrere Varianten desselben Schlüssels aufweisen, z. B. `PATH` und `Path`.

Die Methode [`child_process.spawn()`](/de/nodejs/api/child_process#child_processspawncommand-args-options) erzeugt den Kindprozess asynchron, ohne die Node.js-Ereignisschleife zu blockieren. Die Funktion [`child_process.spawnSync()`](/de/nodejs/api/child_process#child_processspawnsynccommand-args-options) bietet eine äquivalente Funktionalität in einer synchronen Weise, die die Ereignisschleife blockiert, bis der erzeugte Prozess entweder beendet wird oder terminiert wird.

Der Einfachheit halber bietet das Modul `node:child_process` eine Handvoll synchroner und asynchroner Alternativen zu [`child_process.spawn()`](/de/nodejs/api/child_process#child_processspawncommand-args-options) und [`child_process.spawnSync()`](/de/nodejs/api/child_process#child_processspawnsynccommand-args-options). Jede dieser Alternativen wird auf Basis von [`child_process.spawn()`](/de/nodejs/api/child_process#child_processspawncommand-args-options) oder [`child_process.spawnSync()`](/de/nodejs/api/child_process#child_processspawnsynccommand-args-options) implementiert.

- [`child_process.exec()`](/de/nodejs/api/child_process#child_processexeccommand-options-callback): erzeugt eine Shell und führt einen Befehl innerhalb dieser Shell aus, wobei `stdout` und `stderr` nach Abschluss an eine Callback-Funktion übergeben werden.
- [`child_process.execFile()`](/de/nodejs/api/child_process#child_processexecfilefile-args-options-callback): ähnlich wie [`child_process.exec()`](/de/nodejs/api/child_process#child_processexeccommand-options-callback), außer dass es den Befehl direkt erzeugt, ohne zuerst standardmäßig eine Shell zu erzeugen.
- [`child_process.fork()`](/de/nodejs/api/child_process#child_processforkmodulepath-args-options): erzeugt einen neuen Node.js-Prozess und ruft ein angegebenes Modul mit einem eingerichteten IPC-Kommunikationskanal auf, der das Senden von Nachrichten zwischen Eltern und Kind ermöglicht.
- [`child_process.execSync()`](/de/nodejs/api/child_process#child_processexecsynccommand-options): eine synchrone Version von [`child_process.exec()`](/de/nodejs/api/child_process#child_processexeccommand-options-callback), die die Node.js-Ereignisschleife blockiert.
- [`child_process.execFileSync()`](/de/nodejs/api/child_process#child_processexecfilesyncfile-args-options): eine synchrone Version von [`child_process.execFile()`](/de/nodejs/api/child_process#child_processexecfilefile-args-options-callback), die die Node.js-Ereignisschleife blockiert.

Für bestimmte Anwendungsfälle, wie z. B. die Automatisierung von Shell-Skripten, können die [synchronen Gegenstücke](/de/nodejs/api/child_process#synchronous-process-creation) bequemer sein. In vielen Fällen können die synchronen Methoden jedoch erhebliche Auswirkungen auf die Leistung haben, da sie die Ereignisschleife blockieren, während erzeugte Prozesse abgeschlossen werden.


## Asynchrone Prozesserstellung {#asynchronous-process-creation}

Die Methoden [`child_process.spawn()`](/de/nodejs/api/child_process#child_processspawncommand-args-options), [`child_process.fork()`](/de/nodejs/api/child_process#child_processforkmodulepath-args-options), [`child_process.exec()`](/de/nodejs/api/child_process#child_processexeccommand-options-callback) und [`child_process.execFile()`](/de/nodejs/api/child_process#child_processexecfilefile-args-options-callback) folgen alle dem idiomatischen asynchronen Programmiermuster, das typisch für andere Node.js-APIs ist.

Jede der Methoden gibt eine [`ChildProcess`](/de/nodejs/api/child_process#class-childprocess)-Instanz zurück. Diese Objekte implementieren die Node.js [`EventEmitter`](/de/nodejs/api/events#class-eventemitter)-API, wodurch der übergeordnete Prozess Listener-Funktionen registrieren kann, die aufgerufen werden, wenn während des Lebenszyklus des untergeordneten Prozesses bestimmte Ereignisse auftreten.

Die Methoden [`child_process.exec()`](/de/nodejs/api/child_process#child_processexeccommand-options-callback) und [`child_process.execFile()`](/de/nodejs/api/child_process#child_processexecfilefile-args-options-callback) ermöglichen zusätzlich die Angabe einer optionalen `callback`-Funktion, die aufgerufen wird, wenn der untergeordnete Prozess beendet wird.

### Starten von `.bat`- und `.cmd`-Dateien unter Windows {#spawning-bat-and-cmd-files-on-windows}

Die Bedeutung der Unterscheidung zwischen [`child_process.exec()`](/de/nodejs/api/child_process#child_processexeccommand-options-callback) und [`child_process.execFile()`](/de/nodejs/api/child_process#child_processexecfilefile-args-options-callback) kann je nach Plattform variieren. Auf Unix-artigen Betriebssystemen (Unix, Linux, macOS) kann [`child_process.execFile()`](/de/nodejs/api/child_process#child_processexecfilefile-args-options-callback) effizienter sein, da es standardmäßig keine Shell startet. Unter Windows sind `.bat`- und `.cmd`-Dateien jedoch ohne Terminal nicht eigenständig ausführbar und können daher nicht mit [`child_process.execFile()`](/de/nodejs/api/child_process#child_processexecfilefile-args-options-callback) gestartet werden. Bei der Ausführung unter Windows können `.bat`- und `.cmd`-Dateien mit [`child_process.spawn()`](/de/nodejs/api/child_process#child_processspawncommand-args-options) mit der Option `shell` gestartet werden, mit [`child_process.exec()`](/de/nodejs/api/child_process#child_processexeccommand-options-callback) oder durch Starten von `cmd.exe` und Übergeben der `.bat`- oder `.cmd`-Datei als Argument (was die Option `shell` und [`child_process.exec()`](/de/nodejs/api/child_process#child_processexeccommand-options-callback) tun). In jedem Fall muss der Skriptdateiname in Anführungszeichen gesetzt werden, wenn er Leerzeichen enthält.

::: code-group
```js [CJS]
// ODER...
const { exec, spawn } = require('node:child_process');

exec('my.bat', (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(stdout);
});

// Skript mit Leerzeichen im Dateinamen:
const bat = spawn('"my script.cmd"', ['a', 'b'], { shell: true });
// oder:
exec('"my script.cmd" a b', (err, stdout, stderr) => {
  // ...
});
```

```js [ESM]
// ODER...
import { exec, spawn } from 'node:child_process';

exec('my.bat', (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(stdout);
});

// Skript mit Leerzeichen im Dateinamen:
const bat = spawn('"my script.cmd"', ['a', 'b'], { shell: true });
// oder:
exec('"my script.cmd" a b', (err, stdout, stderr) => {
  // ...
});
```
:::


### `child_process.exec(command[, options][, callback])` {#child_processexeccommand-options-callback}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v15.4.0 | Unterstützung für AbortSignal wurde hinzugefügt. |
| v16.4.0, v14.18.0 | Die Option `cwd` kann ein WHATWG `URL`-Objekt sein, das das `file:`-Protokoll verwendet. |
| v8.8.0 | Die Option `windowsHide` wird jetzt unterstützt. |
| v0.1.90 | Hinzugefügt in: v0.1.90 |
:::

- `command` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der auszuführende Befehl mit durch Leerzeichen getrennten Argumenten.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api) Aktuelles Arbeitsverzeichnis des Kindprozesses. **Standard:** `process.cwd()`.
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Umgebungsschlüssel-Wert-Paare. **Standard:** `process.env`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Standard:** `'utf8'`
    - `shell` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Shell, mit der der Befehl ausgeführt werden soll. Siehe [Shell-Anforderungen](/de/nodejs/api/child_process#shell-requirements) und [Standard-Windows-Shell](/de/nodejs/api/child_process#default-windows-shell). **Standard:** `'/bin/sh'` unter Unix, `process.env.ComSpec` unter Windows.
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) ermöglicht das Abbrechen des Kindprozesses mithilfe eines AbortSignals.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standard:** `0`
    - `maxBuffer` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Größte Datenmenge in Bytes, die auf stdout oder stderr zulässig ist. Bei Überschreitung wird der Kindprozess beendet und die Ausgabe abgeschnitten. Siehe Caveat unter [`maxBuffer` und Unicode](/de/nodejs/api/child_process#maxbuffer-and-unicode). **Standard:** `1024 * 1024`.
    - `killSignal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standard:** `'SIGTERM'`
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Legt die Benutzeridentität des Prozesses fest (siehe [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2)).
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Legt die Gruppenidentität des Prozesses fest (siehe [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2)).
    - `windowsHide` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Blendet das Unterprozess-Konsolenfenster aus, das normalerweise auf Windows-Systemen erstellt wird. **Standard:** `false`.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) wird mit der Ausgabe aufgerufen, wenn der Prozess beendet wird.
    - `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `stdout` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)
    - `stderr` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)


- Gibt zurück: [\<ChildProcess\>](/de/nodejs/api/child_process#class-childprocess)

Erzeugt eine Shell und führt dann den `Befehl` in dieser Shell aus, wobei die generierte Ausgabe gepuffert wird. Die an die Exec-Funktion übergebene `command`-Zeichenkette wird direkt von der Shell verarbeitet und Sonderzeichen (variieren je nach [Shell](https://en.wikipedia.org/wiki/List_of_command-line_interpreters)) müssen entsprechend behandelt werden:

::: code-group
```js [CJS]
const { exec } = require('node:child_process');

exec('"/path/to/test file/test.sh" arg1 arg2');
// Doppelte Anführungszeichen werden verwendet, damit das Leerzeichen im Pfad nicht als
// Trennzeichen für mehrere Argumente interpretiert wird.

exec('echo "Die \\$HOME Variable ist $HOME"');
// Die $HOME Variable wird im ersten Fall maskiert, aber nicht im zweiten.
```

```js [ESM]
import { exec } from 'node:child_process';

exec('"/path/to/test file/test.sh" arg1 arg2');
// Doppelte Anführungszeichen werden verwendet, damit das Leerzeichen im Pfad nicht als
// Trennzeichen für mehrere Argumente interpretiert wird.

exec('echo "Die \\$HOME Variable ist $HOME"');
// Die $HOME Variable wird im ersten Fall maskiert, aber nicht im zweiten.
```
:::

**Übergeben Sie dieser Funktion niemals ungeprüfte Benutzereingaben. Jede Eingabe, die Shell-Metazeichen enthält, kann verwendet werden, um die Ausführung beliebiger Befehle auszulösen.**

Wenn eine `callback`-Funktion bereitgestellt wird, wird sie mit den Argumenten `(error, stdout, stderr)` aufgerufen. Bei Erfolg ist `error` `null`. Im Fehlerfall ist `error` eine Instanz von [`Error`](/de/nodejs/api/errors#class-error). Die Eigenschaft `error.code` ist der Exit-Code des Prozesses. Konventionsgemäß deutet jeder andere Exit-Code als `0` auf einen Fehler hin. `error.signal` ist das Signal, das den Prozess beendet hat.

Die an den Callback übergebenen Argumente `stdout` und `stderr` enthalten die stdout- und stderr-Ausgabe des Kindprozesses. Standardmäßig dekodiert Node.js die Ausgabe als UTF-8 und übergibt Strings an den Callback. Die Option `encoding` kann verwendet werden, um die Zeichenkodierung anzugeben, die zum Dekodieren der stdout- und stderr-Ausgabe verwendet wird. Wenn `encoding` gleich `'buffer'` oder eine nicht erkannte Zeichenkodierung ist, werden stattdessen `Buffer`-Objekte an den Callback übergeben.

::: code-group
```js [CJS]
const { exec } = require('node:child_process');
exec('cat *.js missing_file | wc -l', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});
```

```js [ESM]
import { exec } from 'node:child_process';
exec('cat *.js missing_file | wc -l', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});
```
:::

Wenn `timeout` größer als `0` ist, sendet der übergeordnete Prozess das durch die Eigenschaft `killSignal` identifizierte Signal (Standard ist `'SIGTERM'`), wenn der Kindprozess länger als `timeout` Millisekunden läuft.

Im Gegensatz zum POSIX-Systemaufruf [`exec(3)`](http://man7.org/linux/man-pages/man3/exec.3) ersetzt `child_process.exec()` den vorhandenen Prozess nicht und verwendet eine Shell, um den Befehl auszuführen.

Wenn diese Methode als ihre [`util.promisify()`](/de/nodejs/api/util#utilpromisifyoriginal) -Version aufgerufen wird, gibt sie ein `Promise` für ein `Object` mit den Eigenschaften `stdout` und `stderr` zurück. Die zurückgegebene `ChildProcess`-Instanz ist als `child`-Eigenschaft an das `Promise` angehängt. Im Falle eines Fehlers (einschließlich eines Fehlers, der zu einem anderen Exit-Code als 0 führt) wird ein abgewiesenes Promise zurückgegeben, mit demselben `error`-Objekt, das im Callback angegeben ist, jedoch mit zwei zusätzlichen Eigenschaften `stdout` und `stderr`.

::: code-group
```js [CJS]
const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

async function lsExample() {
  const { stdout, stderr } = await exec('ls');
  console.log('stdout:', stdout);
  console.error('stderr:', stderr);
}
lsExample();
```

```js [ESM]
import { promisify } from 'node:util';
import child_process from 'node:child_process';
const exec = promisify(child_process.exec);

async function lsExample() {
  const { stdout, stderr } = await exec('ls');
  console.log('stdout:', stdout);
  console.error('stderr:', stderr);
}
lsExample();
```
:::

Wenn die Option `signal` aktiviert ist, ähnelt das Aufrufen von `.abort()` für den entsprechenden `AbortController` dem Aufrufen von `.kill()` für den Kindprozess, außer dass der an den Callback übergebene Fehler ein `AbortError` ist:

::: code-group
```js [CJS]
const { exec } = require('node:child_process');
const controller = new AbortController();
const { signal } = controller;
const child = exec('grep ssh', { signal }, (error) => {
  console.error(error); // an AbortError
});
controller.abort();
```

```js [ESM]
import { exec } from 'node:child_process';
const controller = new AbortController();
const { signal } = controller;
const child = exec('grep ssh', { signal }, (error) => {
  console.error(error); // an AbortError
});
controller.abort();
```
:::


### `child_process.execFile(file[, args][, options][, callback])` {#child_processexecfilefile-args-options-callback}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v16.4.0, v14.18.0 | Die Option `cwd` kann ein WHATWG `URL`-Objekt mit dem `file:`-Protokoll sein. |
| v15.4.0, v14.17.0 | AbortSignal-Unterstützung wurde hinzugefügt. |
| v8.8.0 | Die Option `windowsHide` wird jetzt unterstützt. |
| v0.1.91 | Hinzugefügt in: v0.1.91 |
:::

- `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der Name oder Pfad der auszuführenden Datei.
- `args` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Liste von String-Argumenten.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api) Aktuelles Arbeitsverzeichnis des Kindprozesses.
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Umgebungsschlüssel-Wert-Paare. **Standard:** `process.env`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Standard:** `'utf8'`
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standard:** `0`
    - `maxBuffer` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Größte Datenmenge in Byte, die auf stdout oder stderr zulässig ist. Wenn dieser Wert überschritten wird, wird der Kindprozess beendet und jegliche Ausgabe abgeschnitten. Siehe Caveat unter [`maxBuffer` und Unicode](/de/nodejs/api/child_process#maxbuffer-and-unicode). **Standard:** `1024 * 1024`.
    - `killSignal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standard:** `'SIGTERM'`
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Setzt die Benutzeridentität des Prozesses (siehe [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2)).
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Setzt die Gruppenidentität des Prozesses (siehe [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2)).
    - `windowsHide` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Verbirgt das Konsolenfenster des Subprozesses, das normalerweise auf Windows-Systemen erstellt würde. **Standard:** `false`.
    - `windowsVerbatimArguments` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Unter Windows erfolgt keine Maskierung oder Escaping von Argumenten. Wird unter Unix ignoriert. **Standard:** `false`.
    - `shell` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Wenn `true`, führt `command` innerhalb einer Shell aus. Verwendet `'/bin/sh'` unter Unix und `process.env.ComSpec` unter Windows. Eine andere Shell kann als String angegeben werden. Siehe [Shell-Anforderungen](/de/nodejs/api/child_process#shell-requirements) und [Standard-Windows-Shell](/de/nodejs/api/child_process#default-windows-shell). **Standard:** `false` (keine Shell).
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) ermöglicht das Abbrechen des Kindprozesses mit einem AbortSignal.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Wird mit der Ausgabe aufgerufen, wenn der Prozess beendet wird.
    - `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `stdout` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)
    - `stderr` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)
  
 
- Gibt zurück: [\<ChildProcess\>](/de/nodejs/api/child_process#class-childprocess)

Die Funktion `child_process.execFile()` ähnelt [`child_process.exec()`](/de/nodejs/api/child_process#child_processexeccommand-options-callback), außer dass sie standardmäßig keine Shell erzeugt. Stattdessen wird die angegebene ausführbare `Datei` direkt als neuer Prozess erzeugt, was sie etwas effizienter macht als [`child_process.exec()`](/de/nodejs/api/child_process#child_processexeccommand-options-callback).

Die gleichen Optionen wie bei [`child_process.exec()`](/de/nodejs/api/child_process#child_processexeccommand-options-callback) werden unterstützt. Da keine Shell erzeugt wird, werden Verhaltensweisen wie I/O-Umleitung und File-Globbing nicht unterstützt.

::: code-group
```js [CJS]
const { execFile } = require('node:child_process');
const child = execFile('node', ['--version'], (error, stdout, stderr) => {
  if (error) {
    throw error;
  }
  console.log(stdout);
});
```

```js [ESM]
import { execFile } from 'node:child_process';
const child = execFile('node', ['--version'], (error, stdout, stderr) => {
  if (error) {
    throw error;
  }
  console.log(stdout);
});
```
:::

Die an den Callback übergebenen Argumente `stdout` und `stderr` enthalten die stdout- und stderr-Ausgabe des Kindprozesses. Standardmäßig dekodiert Node.js die Ausgabe als UTF-8 und übergibt Strings an den Callback. Die Option `encoding` kann verwendet werden, um die Zeichenkodierung anzugeben, die zum Dekodieren der stdout- und stderr-Ausgabe verwendet wird. Wenn `encoding` `'buffer'` oder eine nicht erkannte Zeichenkodierung ist, werden stattdessen `Buffer`-Objekte an den Callback übergeben.

Wenn diese Methode als ihre [`util.promisify()`](/de/nodejs/api/util#utilpromisifyoriginal)ed-Version aufgerufen wird, gibt sie ein `Promise` für ein `Object` mit `stdout`- und `stderr`-Eigenschaften zurück. Die zurückgegebene `ChildProcess`-Instanz ist dem `Promise` als `child`-Eigenschaft angehängt. Im Falle eines Fehlers (einschließlich jedes Fehlers, der zu einem anderen Exit-Code als 0 führt) wird ein abgewiesenes Promise zurückgegeben, mit demselben `error`-Objekt, das im Callback angegeben ist, jedoch mit zwei zusätzlichen Eigenschaften `stdout` und `stderr`.

::: code-group
```js [CJS]
const util = require('node:util');
const execFile = util.promisify(require('node:child_process').execFile);
async function getVersion() {
  const { stdout } = await execFile('node', ['--version']);
  console.log(stdout);
}
getVersion();
```

```js [ESM]
import { promisify } from 'node:util';
import child_process from 'node:child_process';
const execFile = promisify(child_process.execFile);
async function getVersion() {
  const { stdout } = await execFile('node', ['--version']);
  console.log(stdout);
}
getVersion();
```
:::

**Wenn die Option <code>shell</code> aktiviert ist, übergeben Sie keine unbereinigten
Benutzereingaben an diese Funktion. Jede Eingabe, die Shell-Metazeichen enthält,
kann verwendet werden, um die Ausführung von beliebigem Code auszulösen.**

Wenn die Option `signal` aktiviert ist, ist der Aufruf von `.abort()` für den entsprechenden `AbortController` ähnlich wie der Aufruf von `.kill()` für den Kindprozess, außer dass der an den Callback übergebene Fehler ein `AbortError` ist:

::: code-group
```js [CJS]
const { execFile } = require('node:child_process');
const controller = new AbortController();
const { signal } = controller;
const child = execFile('node', ['--version'], { signal }, (error) => {
  console.error(error); // an AbortError
});
controller.abort();
```

```js [ESM]
import { execFile } from 'node:child_process';
const controller = new AbortController();
const { signal } = controller;
const child = execFile('node', ['--version'], { signal }, (error) => {
  console.error(error); // an AbortError
});
controller.abort();
```
:::


### `child_process.fork(modulePath[, args][, options])` {#child_processforkmodulepath-args-options}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v17.4.0, v16.14.0 | Der Parameter `modulePath` kann ein WHATWG `URL`-Objekt mit dem Protokoll `file:` sein. |
| v16.4.0, v14.18.0 | Die Option `cwd` kann ein WHATWG `URL`-Objekt mit dem Protokoll `file:` sein. |
| v15.13.0, v14.18.0 | Timeout wurde hinzugefügt. |
| v15.11.0, v14.18.0 | KillSignal für AbortSignal wurde hinzugefügt. |
| v15.6.0, v14.17.0 | AbortSignal-Unterstützung wurde hinzugefügt. |
| v13.2.0, v12.16.0 | Die Option `serialization` wird jetzt unterstützt. |
| v8.0.0 | Die Option `stdio` kann jetzt eine Zeichenkette sein. |
| v6.4.0 | Die Option `stdio` wird jetzt unterstützt. |
| v0.5.0 | Hinzugefügt in: v0.5.0 |
:::

- `modulePath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api) Das Modul, das im Kindprozess ausgeführt werden soll.
- `args` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Liste von Zeichenkettenargumenten.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api) Aktuelles Arbeitsverzeichnis des Kindprozesses.
    - `detached` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Bereitet den Kindprozess vor, unabhängig von seinem Elternprozess zu laufen. Das spezifische Verhalten hängt von der Plattform ab, siehe [`options.detached`](/de/nodejs/api/child_process#optionsdetached)).
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Umgebungsschlüssel-Wert-Paare. **Standard:** `process.env`.
    - `execPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Ausführbare Datei, die zum Erstellen des Kindprozesses verwendet wird.
    - `execArgv` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Liste von Zeichenkettenargumenten, die an die ausführbare Datei übergeben werden. **Standard:** `process.execArgv`.
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Setzt die Gruppenidentität des Prozesses (siehe [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2)).
    - `serialization` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Gibt die Art der Serialisierung an, die zum Senden von Nachrichten zwischen Prozessen verwendet wird. Mögliche Werte sind `'json'` und `'advanced'`. Siehe [Erweiterte Serialisierung](/de/nodejs/api/child_process#advanced-serialization) für weitere Details. **Standard:** `'json'`.
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) Erlaubt das Schließen des Kindprozesses mit einem AbortSignal.
    - `killSignal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Der Signalwert, der verwendet werden soll, wenn der erzeugte Prozess durch Timeout oder Abort-Signal beendet wird. **Standard:** `'SIGTERM'`.
    - `silent` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, werden stdin, stdout und stderr des Kindprozesses zum Elternprozess geleitet, andernfalls werden sie vom Elternprozess übernommen, siehe die Optionen `'pipe'` und `'inherit'` für [`child_process.spawn()`](/de/nodejs/api/child_process#child_processspawncommand-args-options)'s [`stdio`](/de/nodejs/api/child_process#optionsstdio) für weitere Details. **Standard:** `false`.
    - `stdio` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Siehe [`child_process.spawn()`](/de/nodejs/api/child_process#child_processspawncommand-args-options)'s [`stdio`](/de/nodejs/api/child_process#optionsstdio). Wenn diese Option angegeben wird, überschreibt sie `silent`. Wenn die Array-Variante verwendet wird, muss sie genau ein Element mit dem Wert `'ipc'` enthalten, sonst wird ein Fehler geworfen. Zum Beispiel `[0, 1, 2, 'ipc']`.
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Setzt die Benutzeridentität des Prozesses (siehe [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2)).
    - `windowsVerbatimArguments` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Unter Windows werden Argumente weder in Anführungszeichen gesetzt noch maskiert. Wird unter Unix ignoriert. **Standard:** `false`.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) In Millisekunden die maximale Zeit, die der Prozess laufen darf. **Standard:** `undefined`.
 
- Gibt zurück: [\<ChildProcess\>](/de/nodejs/api/child_process#class-childprocess)

Die Methode `child_process.fork()` ist ein Sonderfall von [`child_process.spawn()`](/de/nodejs/api/child_process#child_processspawncommand-args-options), der speziell zum Starten neuer Node.js-Prozesse verwendet wird. Wie [`child_process.spawn()`](/de/nodejs/api/child_process#child_processspawncommand-args-options) wird ein [`ChildProcess`](/de/nodejs/api/child_process#class-childprocess)-Objekt zurückgegeben. Der zurückgegebene [`ChildProcess`](/de/nodejs/api/child_process#class-childprocess) verfügt über einen zusätzlichen eingebauten Kommunikationskanal, der es ermöglicht, Nachrichten zwischen Eltern- und Kindprozess hin und her zu senden. Siehe [`subprocess.send()`](/de/nodejs/api/child_process#subprocesssendmessage-sendhandle-options-callback) für Details.

Beachten Sie, dass gestartete Node.js-Kindprozesse unabhängig vom Elternprozess sind, mit Ausnahme des IPC-Kommunikationskanals, der zwischen den beiden eingerichtet wird. Jeder Prozess hat seinen eigenen Speicher mit eigenen V8-Instanzen. Aufgrund der zusätzlichen erforderlichen Ressourcenzuweisungen wird das Starten einer großen Anzahl von Node.js-Kindprozessen nicht empfohlen.

Standardmäßig startet `child_process.fork()` neue Node.js-Instanzen mit dem [`process.execPath`](/de/nodejs/api/process#processexecpath) des Elternprozesses. Die Eigenschaft `execPath` im `options`-Objekt ermöglicht die Verwendung eines alternativen Ausführungspfads.

Node.js-Prozesse, die mit einem benutzerdefinierten `execPath` gestartet werden, kommunizieren mit dem Elternprozess über den Dateideskriptor (fd), der über die Umgebungsvariable `NODE_CHANNEL_FD` im Kindprozess identifiziert wird.

Im Gegensatz zum POSIX-Systemaufruf [`fork(2)`](http://man7.org/linux/man-pages/man2/fork.2) klont `child_process.fork()` nicht den aktuellen Prozess.

Die in [`child_process.spawn()`](/de/nodejs/api/child_process#child_processspawncommand-args-options) verfügbare Option `shell` wird von `child_process.fork()` nicht unterstützt und wird ignoriert, wenn sie gesetzt ist.

Wenn die Option `signal` aktiviert ist, ist der Aufruf von `.abort()` auf dem entsprechenden `AbortController` ähnlich dem Aufruf von `.kill()` auf dem Kindprozess, außer dass der an den Callback übergebene Fehler ein `AbortError` ist:

::: code-group
```js [CJS]
const { fork } = require('node:child_process');
const process = require('node:process');

if (process.argv[2] === 'child') {
  setTimeout(() => {
    console.log(`Hello from ${process.argv[2]}!`);
  }, 1_000);
} else {
  const controller = new AbortController();
  const { signal } = controller;
  const child = fork(__filename, ['child'], { signal });
  child.on('error', (err) => {
    // This will be called with err being an AbortError if the controller aborts
  });
  controller.abort(); // Stops the child process
}
```

```js [ESM]
import { fork } from 'node:child_process';
import process from 'node:process';

if (process.argv[2] === 'child') {
  setTimeout(() => {
    console.log(`Hello from ${process.argv[2]}!`);
  }, 1_000);
} else {
  const controller = new AbortController();
  const { signal } = controller;
  const child = fork(import.meta.url, ['child'], { signal });
  child.on('error', (err) => {
    // This will be called with err being an AbortError if the controller aborts
  });
  controller.abort(); // Stops the child process
}
```
:::


### `child_process.spawn(command[, args][, options])` {#child_processspawncommand-args-options}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v16.4.0, v14.18.0 | Die Option `cwd` kann ein WHATWG `URL`-Objekt mit dem `file:`-Protokoll sein. |
| v15.13.0, v14.18.0 | Timeout wurde hinzugefügt. |
| v15.11.0, v14.18.0 | killSignal für AbortSignal wurde hinzugefügt. |
| v15.5.0, v14.17.0 | AbortSignal-Unterstützung wurde hinzugefügt. |
| v13.2.0, v12.16.0 | Die Option `serialization` wird jetzt unterstützt. |
| v8.8.0 | Die Option `windowsHide` wird jetzt unterstützt. |
| v6.4.0 | Die Option `argv0` wird jetzt unterstützt. |
| v5.7.0 | Die Option `shell` wird jetzt unterstützt. |
| v0.1.90 | Hinzugefügt in: v0.1.90 |
:::

- `command` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der auszuführende Befehl.
- `args` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Liste der Zeichenkettenargumente.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api) Aktuelles Arbeitsverzeichnis des Kindprozesses.
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Umgebungsvariablen-Schlüssel-Wert-Paare. **Standard:** `process.env`.
    - `argv0` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Legt explizit den Wert von `argv[0]` fest, der an den Kindprozess gesendet wird. Dieser wird auf `command` gesetzt, wenn er nicht angegeben ist.
    - `stdio` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die stdio-Konfiguration des Kindprozesses (siehe [`options.stdio`](/de/nodejs/api/child_process#optionsstdio)).
    - `detached` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Bereitet den Kindprozess vor, unabhängig von seinem Elternprozess zu laufen. Das spezifische Verhalten hängt von der Plattform ab, siehe [`options.detached`](/de/nodejs/api/child_process#optionsdetached)).
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Setzt die Benutzeridentität des Prozesses (siehe [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2)).
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Setzt die Gruppenidentität des Prozesses (siehe [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2)).
    - `serialization` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Gibt die Art der Serialisierung an, die zum Senden von Nachrichten zwischen Prozessen verwendet wird. Mögliche Werte sind `'json'` und `'advanced'`. Weitere Informationen finden Sie unter [Erweiterte Serialisierung](/de/nodejs/api/child_process#advanced-serialization). **Standard:** `'json'`.
    - `shell` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Wenn `true`, führt `command` innerhalb einer Shell aus. Verwendet `'/bin/sh'` unter Unix und `process.env.ComSpec` unter Windows. Eine andere Shell kann als String angegeben werden. Siehe [Shell-Anforderungen](/de/nodejs/api/child_process#shell-requirements) und [Standard-Windows-Shell](/de/nodejs/api/child_process#default-windows-shell). **Standard:** `false` (keine Shell).
    - `windowsVerbatimArguments` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Unter Windows werden Argumente weder in Anführungszeichen gesetzt noch maskiert. Wird unter Unix ignoriert. Dies wird automatisch auf `true` gesetzt, wenn `shell` angegeben ist und CMD ist. **Standard:** `false`.
    - `windowsHide` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Blendet das Subprozess-Konsolenfenster aus, das normalerweise unter Windows-Systemen erstellt würde. **Standard:** `false`.
    - `signal` [\<AbortSignal\>](/de/nodejs/api/globals#class-abortsignal) ermöglicht das Abbrechen des Kindprozesses mit einem AbortSignal.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) In Millisekunden die maximale Zeit, die der Prozess laufen darf. **Standard:** `undefined`.
    - `killSignal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Der Signalwert, der verwendet werden soll, wenn der erzeugte Prozess durch Timeout oder Abbruchsignal beendet wird. **Standard:** `'SIGTERM'`.

- Gibt zurück: [\<ChildProcess\>](/de/nodejs/api/child_process#class-childprocess)

Die Methode `child_process.spawn()` erzeugt einen neuen Prozess mit dem gegebenen `command`, mit Kommandozeilenargumenten in `args`. Wenn ausgelassen, ist `args` standardmäßig ein leeres Array.

**Wenn die Option <code>shell</code> aktiviert ist, übergeben Sie dieser Funktion keine
ungeprüften Benutzereingaben. Jede Eingabe, die Shell-Metazeichen enthält, kann
verwendet werden, um die Ausführung beliebiger Befehle auszulösen.**

Ein drittes Argument kann verwendet werden, um zusätzliche Optionen anzugeben, mit diesen Standardwerten:

```js [ESM]
const defaults = {
  cwd: undefined,
  env: process.env,
};
```
Verwenden Sie `cwd`, um das Arbeitsverzeichnis anzugeben, aus dem der Prozess erzeugt wird. Wenn nicht angegeben, wird standardmäßig das aktuelle Arbeitsverzeichnis geerbt. Wenn angegeben, aber der Pfad nicht existiert, gibt der Kindprozess einen `ENOENT`-Fehler aus und beendet sich sofort. `ENOENT` wird auch ausgegeben, wenn der Befehl nicht existiert.

Verwenden Sie `env`, um Umgebungsvariablen anzugeben, die für den neuen Prozess sichtbar sind, der Standardwert ist [`process.env`](/de/nodejs/api/process#processenv).

`undefined`-Werte in `env` werden ignoriert.

Beispiel für die Ausführung von `ls -lh /usr`, wobei `stdout`, `stderr` und der Exit-Code erfasst werden:

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
```

```js [ESM]
import { spawn } from 'node:child_process';
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
```
:::

Beispiel: Eine sehr aufwändige Art, `ps ax | grep ssh` auszuführen

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const ps = spawn('ps', ['ax']);
const grep = spawn('grep', ['ssh']);

ps.stdout.on('data', (data) => {
  grep.stdin.write(data);
});

ps.stderr.on('data', (data) => {
  console.error(`ps stderr: ${data}`);
});

ps.on('close', (code) => {
  if (code !== 0) {
    console.log(`ps process exited with code ${code}`);
  }
  grep.stdin.end();
});

grep.stdout.on('data', (data) => {
  console.log(data.toString());
});

grep.stderr.on('data', (data) => {
  console.error(`grep stderr: ${data}`);
});

grep.on('close', (code) => {
  if (code !== 0) {
    console.log(`grep process exited with code ${code}`);
  }
});
```

```js [ESM]
import { spawn } from 'node:child_process';
const ps = spawn('ps', ['ax']);
const grep = spawn('grep', ['ssh']);

ps.stdout.on('data', (data) => {
  grep.stdin.write(data);
});

ps.stderr.on('data', (data) => {
  console.error(`ps stderr: ${data}`);
});

ps.on('close', (code) => {
  if (code !== 0) {
    console.log(`ps process exited with code ${code}`);
  }
  grep.stdin.end();
});

grep.stdout.on('data', (data) => {
  console.log(data.toString());
});

grep.stderr.on('data', (data) => {
  console.error(`grep stderr: ${data}`);
});

grep.on('close', (code) => {
  if (code !== 0) {
    console.log(`grep process exited with code ${code}`);
  }
});
```
:::

Beispiel für die Prüfung auf fehlgeschlagenes `spawn`:

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const subprocess = spawn('bad_command');

subprocess.on('error', (err) => {
  console.error('Failed to start subprocess.');
});
```

```js [ESM]
import { spawn } from 'node:child_process';
const subprocess = spawn('bad_command');

subprocess.on('error', (err) => {
  console.error('Failed to start subprocess.');
});
```
:::

Bestimmte Plattformen (macOS, Linux) verwenden den Wert von `argv[0]` für den Prozesstitel, während andere (Windows, SunOS) `command` verwenden.

Node.js überschreibt `argv[0]` beim Start mit `process.execPath`, sodass `process.argv[0]` in einem Node.js-Kindprozess nicht mit dem `argv0`-Parameter übereinstimmt, der von `spawn` vom Elternprozess übergeben wird. Rufen Sie ihn stattdessen mit der Eigenschaft `process.argv0` ab.

Wenn die Option `signal` aktiviert ist, ist das Aufrufen von `.abort()` für den entsprechenden `AbortController` ähnlich wie das Aufrufen von `.kill()` für den Kindprozess, mit der Ausnahme, dass der an den Callback übergebene Fehler ein `AbortError` ist:

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const controller = new AbortController();
const { signal } = controller;
const grep = spawn('grep', ['ssh'], { signal });
grep.on('error', (err) => {
  // Dies wird aufgerufen, wobei err ein AbortError ist, wenn der Controller abbricht
});
controller.abort(); // Stoppt den Kindprozess
```

```js [ESM]
import { spawn } from 'node:child_process';
const controller = new AbortController();
const { signal } = controller;
const grep = spawn('grep', ['ssh'], { signal });
grep.on('error', (err) => {
  // Dies wird aufgerufen, wobei err ein AbortError ist, wenn der Controller abbricht
});
controller.abort(); // Stoppt den Kindprozess
```
:::


#### `options.detached` {#optionsdetached}

**Hinzugefügt in: v0.7.10**

Unter Windows ermöglicht die Einstellung von `options.detached` auf `true`, dass der Kindprozess nach dem Beenden des Elternprozesses weiterläuft. Der Kindprozess erhält ein eigenes Konsolenfenster. Sobald diese Option für einen Kindprozess aktiviert ist, kann sie nicht mehr deaktiviert werden.

Auf Nicht-Windows-Plattformen wird der Kindprozess, wenn `options.detached` auf `true` gesetzt ist, zum Leiter einer neuen Prozessgruppe und Sitzung gemacht. Kindprozesse können nach dem Beenden des Elternprozesses weiterlaufen, unabhängig davon, ob sie abgetrennt sind oder nicht. Siehe [`setsid(2)`](http://man7.org/linux/man-pages/man2/setsid.2) für weitere Informationen.

Standardmäßig wartet der Elternprozess darauf, dass der abgetrennte Kindprozess beendet wird. Um zu verhindern, dass der Elternprozess auf die Beendigung eines bestimmten `subprocess` wartet, verwenden Sie die Methode `subprocess.unref()`. Dadurch wird die Ereignisschleife des Elternprozesses den Kindprozess nicht in ihre Referenzzählung aufnehmen, wodurch der Elternprozess unabhängig vom Kindprozess beendet werden kann, es sei denn, es besteht ein etablierter IPC-Kanal zwischen dem Kind- und dem Elternprozess.

Wenn die Option `detached` verwendet wird, um einen langlaufenden Prozess zu starten, bleibt der Prozess nach dem Beenden des Elternprozesses nicht im Hintergrund aktiv, es sei denn, er wird mit einer `stdio`-Konfiguration versehen, die nicht mit dem Elternprozess verbunden ist. Wenn das `stdio` des Elternprozesses geerbt wird, bleibt der Kindprozess mit dem steuernden Terminal verbunden.

Beispiel für einen langlaufenden Prozess durch Abtrennen und Ignorieren der `stdio`-Dateideskriptoren des Elternprozesses, um die Beendigung des Elternprozesses zu ignorieren:

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const process = require('node:process');

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
```

```js [ESM]
import { spawn } from 'node:child_process';
import process from 'node:process';

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
```
:::

Alternativ kann man die Ausgabe des Kindprozesses in Dateien umleiten:

::: code-group
```js [CJS]
const { openSync } = require('node:fs');
const { spawn } = require('node:child_process');
const out = openSync('./out.log', 'a');
const err = openSync('./out.log', 'a');

const subprocess = spawn('prg', [], {
  detached: true,
  stdio: [ 'ignore', out, err ],
});

subprocess.unref();
```

```js [ESM]
import { openSync } from 'node:fs';
import { spawn } from 'node:child_process';
const out = openSync('./out.log', 'a');
const err = openSync('./out.log', 'a');

const subprocess = spawn('prg', [], {
  detached: true,
  stdio: [ 'ignore', out, err ],
});

subprocess.unref();
```
:::


#### `options.stdio` {#optionsstdio}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v15.6.0, v14.18.0 | Der `overlapped`-Stdio-Flag wurde hinzugefügt. |
| v3.3.1 | Der Wert `0` wird jetzt als Dateideskriptor akzeptiert. |
| v0.7.10 | Hinzugefügt in: v0.7.10 |
:::

Die Option `options.stdio` wird verwendet, um die Pipes zu konfigurieren, die zwischen dem Eltern- und Kindprozess eingerichtet werden. Standardmäßig werden die stdin-, stdout- und stderr-Kanäle des Kindprozesses zu den entsprechenden [`subprocess.stdin`](/de/nodejs/api/child_process#subprocessstdin)-, [`subprocess.stdout`](/de/nodejs/api/child_process#subprocessstdout)- und [`subprocess.stderr`](/de/nodejs/api/child_process#subprocessstderr)-Streams auf dem [`ChildProcess`](/de/nodejs/api/child_process#class-childprocess)-Objekt umgeleitet. Dies entspricht der Einstellung von `options.stdio` auf `['pipe', 'pipe', 'pipe']`.

Der Einfachheit halber kann `options.stdio` eine der folgenden Zeichenketten sein:

- `'pipe'`: entspricht `['pipe', 'pipe', 'pipe']` (der Standard)
- `'overlapped'`: entspricht `['overlapped', 'overlapped', 'overlapped']`
- `'ignore'`: entspricht `['ignore', 'ignore', 'ignore']`
- `'inherit'`: entspricht `['inherit', 'inherit', 'inherit']` oder `[0, 1, 2]`

Andernfalls ist der Wert von `options.stdio` ein Array, bei dem jeder Index einem Filedeskriptor (fd) im Kindprozess entspricht. Die Filedeskriptoren 0, 1 und 2 entsprechen stdin, stdout bzw. stderr. Zusätzliche Filedeskriptoren können angegeben werden, um zusätzliche Pipes zwischen dem Eltern- und Kindprozess zu erstellen. Der Wert ist einer der folgenden:

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const process = require('node:process');

// Kindprozess verwendet die stdios des Elternprozesses.
spawn('prg', [], { stdio: 'inherit' });

// Kindprozess nur mit gemeinsam genutztem stderr starten.
spawn('prg', [], { stdio: ['pipe', 'pipe', process.stderr] });

// Öffne einen zusätzlichen fd=4, um mit Programmen zu interagieren,
// die eine Startd-ähnliche Schnittstelle darstellen.
spawn('prg', [], { stdio: ['pipe', null, null, null, 'pipe'] });
```

```js [ESM]
import { spawn } from 'node:child_process';
import process from 'node:process';

// Kindprozess verwendet die stdios des Elternprozesses.
spawn('prg', [], { stdio: 'inherit' });

// Kindprozess nur mit gemeinsam genutztem stderr starten.
spawn('prg', [], { stdio: ['pipe', 'pipe', process.stderr] });

// Öffne einen zusätzlichen fd=4, um mit Programmen zu interagieren,
// die eine Startd-ähnliche Schnittstelle darstellen.
spawn('prg', [], { stdio: ['pipe', null, null, null, 'pipe'] });
```
:::

*Es ist erwähnenswert, dass, wenn ein IPC-Kanal zwischen den Eltern- und Kindprozessen eingerichtet wird und der Kindprozess eine Node.js-Instanz ist, der Kindprozess mit dem IPC-Kanal dereferenziert (mit <code>unref()</code>) gestartet wird, bis der Kindprozess einen Ereignishandler für das <a href="process.html#event-disconnect"><code>'disconnect'</code></a>-Ereignis oder das <a href="process.html#event-message"><code>'message'</code></a>-Ereignis registriert. Dies ermöglicht es dem Kindprozess, normal zu beenden, ohne dass der Prozess durch den offenen IPC-Kanal offen gehalten wird.* Siehe auch: [`child_process.exec()`](/de/nodejs/api/child_process#child_processexeccommand-options-callback) und [`child_process.fork()`](/de/nodejs/api/child_process#child_processforkmodulepath-args-options).


## Synchrone Prozesserstellung {#synchronous-process-creation}

Die Methoden [`child_process.spawnSync()`](/de/nodejs/api/child_process#child_processspawnsynccommand-args-options), [`child_process.execSync()`](/de/nodejs/api/child_process#child_processexecsynccommand-options) und [`child_process.execFileSync()`](/de/nodejs/api/child_process#child_processexecfilesyncfile-args-options) sind synchron und blockieren die Node.js Event-Loop, wodurch die Ausführung von zusätzlichem Code angehalten wird, bis der gestartete Prozess beendet ist.

Blockierende Aufrufe wie diese sind meistens nützlich, um allgemeine Skripting-Aufgaben zu vereinfachen und das Laden/Verarbeiten von Anwendungskonfigurationen beim Start zu vereinfachen.

### `child_process.execFileSync(file[, args][, options])` {#child_processexecfilesyncfile-args-options}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v16.4.0, v14.18.0 | Die `cwd`-Option kann ein WHATWG `URL`-Objekt mit dem `file:`-Protokoll sein. |
| v10.10.0 | Die `input`-Option kann jetzt ein beliebiges `TypedArray` oder ein `DataView` sein. |
| v8.8.0 | Die `windowsHide`-Option wird jetzt unterstützt. |
| v8.0.0 | Die `input`-Option kann jetzt ein `Uint8Array` sein. |
| v6.2.1, v4.5.0 | Die `encoding`-Option kann jetzt explizit auf `buffer` gesetzt werden. |
| v0.11.12 | Hinzugefügt in: v0.11.12 |
:::

- `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der Name oder Pfad der ausführbaren Datei, die ausgeführt werden soll.
- `args` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Liste der Zeichenfolgenargumente.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api) Aktuelles Arbeitsverzeichnis des Kindprozesses.
    - `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Der Wert, der als stdin an den gestarteten Prozess übergeben wird. Wenn `stdio[0]` auf `'pipe'` gesetzt ist, überschreibt die Angabe dieses Wertes `stdio[0]`.
    - `stdio` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Stdio-Konfiguration des Kindes. Siehe [`child_process.spawn()`](/de/nodejs/api/child_process#child_processspawncommand-args-options)'s [`stdio`](/de/nodejs/api/child_process#optionsstdio). `stderr` wird standardmäßig an den stderr des Elternprozesses ausgegeben, es sei denn, `stdio` ist angegeben. **Standard:** `'pipe'`.
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Umgebungsschlüssel-Wert-Paare. **Standard:** `process.env`.
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Setzt die Benutzeridentität des Prozesses (siehe [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2)).
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Setzt die Gruppenidentität des Prozesses (siehe [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2)).
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) In Millisekunden die maximale Zeit, die der Prozess laufen darf. **Standard:** `undefined`.
    - `killSignal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Der Signalwert, der verwendet werden soll, wenn der gestartete Prozess beendet wird. **Standard:** `'SIGTERM'`.
    - `maxBuffer` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Größte Datenmenge in Bytes, die auf stdout oder stderr zulässig ist. Wenn dies überschritten wird, wird der Kindprozess beendet. Siehe Caveat unter [`maxBuffer` und Unicode](/de/nodejs/api/child_process#maxbuffer-and-unicode). **Standard:** `1024 * 1024`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die Kodierung, die für alle stdio-Eingaben und -Ausgaben verwendet wird. **Standard:** `'buffer'`.
    - `windowsHide` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Blendet das Konsolenfenster des Subprozesses aus, das normalerweise auf Windows-Systemen erstellt wird. **Standard:** `false`.
    - `shell` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Wenn `true`, führt `command` innerhalb einer Shell aus. Verwendet `'/bin/sh'` unter Unix und `process.env.ComSpec` unter Windows. Eine andere Shell kann als Zeichenkette angegeben werden. Siehe [Shell-Anforderungen](/de/nodejs/api/child_process#shell-requirements) und [Standard-Windows-Shell](/de/nodejs/api/child_process#default-windows-shell). **Standard:** `false` (keine Shell).


- Gibt zurück: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die stdout-Ausgabe des Befehls.

Die Methode `child_process.execFileSync()` ist im Allgemeinen identisch mit [`child_process.execFile()`](/de/nodejs/api/child_process#child_processexecfilefile-args-options-callback) mit der Ausnahme, dass die Methode erst zurückkehrt, wenn der Kindprozess vollständig geschlossen wurde. Wenn ein Timeout aufgetreten ist und `killSignal` gesendet wird, kehrt die Methode erst zurück, wenn der Prozess vollständig beendet wurde.

Wenn der Kindprozess das `SIGTERM`-Signal abfängt und behandelt und nicht beendet wird, wartet der Elternprozess weiterhin, bis der Kindprozess beendet wurde.

Wenn der Prozess eine Zeitüberschreitung hat oder einen Exit-Code ungleich Null hat, wirft diese Methode einen [`Error`](/de/nodejs/api/errors#class-error), der das vollständige Ergebnis von zugrunde liegenden [`child_process.spawnSync()`](/de/nodejs/api/child_process#child_processspawnsynccommand-args-options) enthält.

**Wenn die Option <code>shell</code> aktiviert ist, übergeben Sie dieser Funktion keine ungeprüften
Benutzereingaben. Alle Eingaben, die Shell-Metazeichen enthalten, können verwendet werden, um die
Ausführung von beliebigem Code auszulösen.**



::: code-group
```js [CJS]
const { execFileSync } = require('node:child_process');

try {
  const stdout = execFileSync('my-script.sh', ['my-arg'], {
    // Capture stdout and stderr from child process. Overrides the
    // default behavior of streaming child stderr to the parent stderr
    stdio: 'pipe',

    // Use utf8 encoding for stdio pipes
    encoding: 'utf8',
  });

  console.log(stdout);
} catch (err) {
  if (err.code) {
    // Spawning child process failed
    console.error(err.code);
  } else {
    // Child was spawned but exited with non-zero exit code
    // Error contains any stdout and stderr from the child
    const { stdout, stderr } = err;

    console.error({ stdout, stderr });
  }
}
```

```js [ESM]
import { execFileSync } from 'node:child_process';

try {
  const stdout = execFileSync('my-script.sh', ['my-arg'], {
    // Capture stdout and stderr from child process. Overrides the
    // default behavior of streaming child stderr to the parent stderr
    stdio: 'pipe',

    // Use utf8 encoding for stdio pipes
    encoding: 'utf8',
  });

  console.log(stdout);
} catch (err) {
  if (err.code) {
    // Spawning child process failed
    console.error(err.code);
  } else {
    // Child was spawned but exited with non-zero exit code
    // Error contains any stdout and stderr from the child
    const { stdout, stderr } = err;

    console.error({ stdout, stderr });
  }
}
```
:::


### `child_process.execSync(command[, options])` {#child_processexecsynccommand-options}

::: info [Verlauf]
| Version       | Änderungen                                                                 |
| ------------- | -------------------------------------------------------------------------- |
| v16.4.0, v14.18.0 | Die Option `cwd` kann ein WHATWG `URL`-Objekt mit dem `file:`-Protokoll sein. |
| v10.10.0      | Die Option `input` kann nun ein beliebiges `TypedArray` oder ein `DataView` sein. |
| v8.8.0        | Die Option `windowsHide` wird jetzt unterstützt.                               |
| v8.0.0        | Die Option `input` kann nun ein `Uint8Array` sein.                           |
| v0.11.12      | Hinzugefügt in: v0.11.12                                                     |
:::

- `command` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der auszuführende Befehl.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api) Aktuelles Arbeitsverzeichnis des Kindprozesses.
    - `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Der Wert, der als stdin an den erzeugten Prozess übergeben wird. Wenn `stdio[0]` auf `'pipe'` gesetzt ist, überschreibt die Angabe dieses Wertes `stdio[0]`.
    - `stdio` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Die stdio-Konfiguration des Kindes. Siehe [`child_process.spawn()`](/de/nodejs/api/child_process#child_processspawncommand-args-options)'s [`stdio`](/de/nodejs/api/child_process#optionsstdio). `stderr` wird standardmäßig an das stderr des Elternprozesses ausgegeben, es sei denn, `stdio` ist angegeben. **Standard:** `'pipe'`.
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Umgebungsschlüssel-Wert-Paare. **Standard:** `process.env`.
    - `shell` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Shell, mit der der Befehl ausgeführt werden soll. Siehe [Shell-Anforderungen](/de/nodejs/api/child_process#shell-requirements) und [Standard-Windows-Shell](/de/nodejs/api/child_process#default-windows-shell). **Standard:** `'/bin/sh'` auf Unix, `process.env.ComSpec` auf Windows.
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Setzt die Benutzerkennung des Prozesses. (Siehe [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2)).
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Setzt die Gruppenkennung des Prozesses. (Siehe [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2)).
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) In Millisekunden die maximale Zeitspanne, die der Prozess laufen darf. **Standard:** `undefined`.
    - `killSignal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Das Signal, das verwendet werden soll, wenn der erzeugte Prozess beendet wird. **Standard:** `'SIGTERM'`.
    - `maxBuffer` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die größte Datenmenge in Bytes, die in stdout oder stderr zulässig ist. Wenn diese überschritten wird, wird der Kindprozess beendet und jegliche Ausgabe wird abgeschnitten. Siehe den Hinweis unter [`maxBuffer` und Unicode](/de/nodejs/api/child_process#maxbuffer-and-unicode). **Standard:** `1024 * 1024`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die für alle stdio-Ein- und Ausgaben verwendete Kodierung. **Standard:** `'buffer'`.
    - `windowsHide` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Verbirgt das Konsolenfenster des Subprozesses, das normalerweise auf Windows-Systemen erstellt wird. **Standard:** `false`.

- Gibt zurück: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die stdout-Ausgabe des Befehls.

Die Methode `child_process.execSync()` ist im Allgemeinen identisch mit [`child_process.exec()`](/de/nodejs/api/child_process#child_processexeccommand-options-callback) mit der Ausnahme, dass die Methode erst zurückkehrt, wenn der Kindprozess vollständig beendet wurde. Wenn ein Timeout aufgetreten ist und `killSignal` gesendet wird, kehrt die Methode erst zurück, wenn der Prozess vollständig beendet wurde. Wenn der Kindprozess das `SIGTERM`-Signal abfängt und behandelt und nicht beendet wird, wartet der Elternprozess, bis der Kindprozess beendet wurde.

Wenn der Prozess ein Timeout hat oder einen Exit-Code ungleich Null hat, wirft diese Methode eine Ausnahme. Das [`Error`](/de/nodejs/api/errors#class-error)-Objekt enthält das gesamte Ergebnis von [`child_process.spawnSync()`](/de/nodejs/api/child_process#child_processspawnsynccommand-args-options).

**Geben Sie niemals ungeprüfte Benutzereingaben an diese Funktion weiter. Jede Eingabe, die Shell-Metazeichen enthält, kann verwendet werden, um die Ausführung beliebiger Befehle auszulösen.**


### `child_process.spawnSync(command[, args][, options])` {#child_processspawnsynccommand-args-options}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v16.4.0, v14.18.0 | Die Option `cwd` kann ein WHATWG `URL`-Objekt mit dem `file:`-Protokoll sein. |
| v10.10.0 | Die Option `input` kann nun ein beliebiges `TypedArray` oder eine `DataView` sein. |
| v8.8.0 | Die Option `windowsHide` wird jetzt unterstützt. |
| v8.0.0 | Die Option `input` kann nun ein `Uint8Array` sein. |
| v5.7.0 | Die Option `shell` wird jetzt unterstützt. |
| v6.2.1, v4.5.0 | Die Option `encoding` kann jetzt explizit auf `buffer` gesetzt werden. |
| v0.11.12 | Hinzugefügt in: v0.11.12 |
:::

- `command` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der auszuführende Befehl.
- `args` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Liste von String-Argumenten.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/de/nodejs/api/url#the-whatwg-url-api) Aktuelles Arbeitsverzeichnis des Kindprozesses.
    - `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Der Wert, der als stdin an den erzeugten Prozess übergeben wird. Wenn `stdio[0]` auf `'pipe'` gesetzt ist, überschreibt die Angabe dieses Werts `stdio[0]`.
    - `argv0` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Legt explizit den Wert von `argv[0]` fest, der an den Kindprozess gesendet wird. Dieser wird auf `command` gesetzt, wenn er nicht angegeben ist.
    - `stdio` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Stdio-Konfiguration des Kindprozesses. Siehe [`child_process.spawn()`](/de/nodejs/api/child_process#child_processspawncommand-args-options)'s [`stdio`](/de/nodejs/api/child_process#optionsstdio). **Standard:** `'pipe'`.
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Umgebungsschlüssel-Wert-Paare. **Standard:** `process.env`.
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Setzt die Benutzeridentität des Prozesses (siehe [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2)).
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Setzt die Gruppenidentität des Prozesses (siehe [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2)).
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) In Millisekunden die maximale Zeitspanne, die der Prozess laufen darf. **Standard:** `undefined`.
    - `killSignal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Das Signal, das verwendet werden soll, wenn der erzeugte Prozess beendet wird. **Standard:** `'SIGTERM'`.
    - `maxBuffer` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die größte Datenmenge in Bytes, die in stdout oder stderr zulässig ist. Wenn dieser Wert überschritten wird, wird der Kindprozess beendet und die Ausgabe wird abgeschnitten. Siehe Caveat unter [`maxBuffer` und Unicode](/de/nodejs/api/child_process#maxbuffer-and-unicode). **Standard:** `1024 * 1024`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die Kodierung, die für alle stdio-Eingaben und -Ausgaben verwendet wird. **Standard:** `'buffer'`.
    - `shell` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Wenn `true`, wird `command` innerhalb einer Shell ausgeführt. Verwendet `'/bin/sh'` unter Unix und `process.env.ComSpec` unter Windows. Eine andere Shell kann als String angegeben werden. Siehe [Shell-Anforderungen](/de/nodejs/api/child_process#shell-requirements) und [Standard-Windows-Shell](/de/nodejs/api/child_process#default-windows-shell). **Standard:** `false` (keine Shell).
    - `windowsVerbatimArguments` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Unter Windows werden keine Argumente in Anführungszeichen gesetzt oder maskiert. Wird unter Unix ignoriert. Dies wird automatisch auf `true` gesetzt, wenn `shell` angegeben ist und CMD ist. **Standard:** `false`.
    - `windowsHide` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Blendet das Konsolenfenster des Subprozesses aus, das normalerweise auf Windows-Systemen erstellt würde. **Standard:** `false`.

- Gibt zurück: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `pid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Pid des Kindprozesses.
    - `output` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Array der Ergebnisse der stdio-Ausgabe.
    - `stdout` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der Inhalt von `output[1]`.
    - `stderr` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der Inhalt von `output[2]`.
    - `status` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) Der Exit-Code des Subprozesses oder `null`, wenn der Subprozess aufgrund eines Signals beendet wurde.
    - `signal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) Das Signal, das zum Beenden des Subprozesses verwendet wurde, oder `null`, wenn der Subprozess nicht aufgrund eines Signals beendet wurde.
    - `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Das Fehlerobjekt, wenn der Kindprozess fehlgeschlagen ist oder ein Timeout aufgetreten ist.

Die Methode `child_process.spawnSync()` ist im Allgemeinen identisch mit [`child_process.spawn()`](/de/nodejs/api/child_process#child_processspawncommand-args-options), mit der Ausnahme, dass die Funktion erst zurückkehrt, wenn der Kindprozess vollständig geschlossen wurde. Wenn ein Timeout aufgetreten ist und `killSignal` gesendet wird, kehrt die Methode erst zurück, wenn der Prozess vollständig beendet wurde. Wenn der Prozess das Signal `SIGTERM` abfängt und verarbeitet und nicht beendet wird, wartet der Elternprozess, bis der Kindprozess beendet wurde.

**Wenn die Option <code>shell</code> aktiviert ist, geben Sie dieser Funktion keine
ungeprüften Benutzereingaben. Jede Eingabe, die Shell-Metazeichen enthält, kann
verwendet werden, um die Ausführung beliebiger Befehle auszulösen.**


## Klasse: `ChildProcess` {#class-childprocess}

**Hinzugefügt in: v2.2.0**

- Erweitert: [\<EventEmitter\>](/de/nodejs/api/events#class-eventemitter)

Instanzen von `ChildProcess` repräsentieren erzeugte Kindprozesse.

Es ist nicht vorgesehen, Instanzen von `ChildProcess` direkt zu erstellen. Verwenden Sie stattdessen die Methoden [`child_process.spawn()`](/de/nodejs/api/child_process#child_processspawncommand-args-options), [`child_process.exec()`](/de/nodejs/api/child_process#child_processexeccommand-options-callback), [`child_process.execFile()`](/de/nodejs/api/child_process#child_processexecfilefile-args-options-callback) oder [`child_process.fork()`](/de/nodejs/api/child_process#child_processforkmodulepath-args-options), um Instanzen von `ChildProcess` zu erstellen.

### Ereignis: `'close'` {#event-close}

**Hinzugefügt in: v0.7.7**

- `code` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Der Exit-Code, wenn der Kindprozess von selbst beendet wurde.
- `signal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Das Signal, durch das der Kindprozess beendet wurde.

Das Ereignis `'close'` wird ausgelöst, nachdem ein Prozess beendet wurde *und* die stdio-Streams eines Kindprozesses geschlossen wurden. Dies unterscheidet sich vom Ereignis [`'exit'`](/de/nodejs/api/child_process#event-exit), da mehrere Prozesse möglicherweise dieselben stdio-Streams verwenden. Das Ereignis `'close'` wird immer ausgelöst, nachdem [`'exit'`](/de/nodejs/api/child_process#event-exit) bereits ausgelöst wurde, oder [`'error'`](/de/nodejs/api/child_process#event-error), wenn der Kindprozess nicht gestartet werden konnte.

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process close all stdio with code ${code}`);
});

ls.on('exit', (code) => {
  console.log(`child process exited with code ${code}`);
});
```

```js [ESM]
import { spawn } from 'node:child_process';
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process close all stdio with code ${code}`);
});

ls.on('exit', (code) => {
  console.log(`child process exited with code ${code}`);
});
```
:::


### Ereignis: `'disconnect'` {#event-disconnect}

**Hinzugefügt in: v0.7.2**

Das Ereignis `'disconnect'` wird ausgelöst, nachdem die Methode [`subprocess.disconnect()`](/de/nodejs/api/child_process#subprocessdisconnect) im Elternprozess oder [`process.disconnect()`](/de/nodejs/api/process#processdisconnect) im Kindprozess aufgerufen wurde. Nach dem Trennen ist es nicht mehr möglich, Nachrichten zu senden oder zu empfangen, und die Eigenschaft [`subprocess.connected`](/de/nodejs/api/child_process#subprocessconnected) ist `false`.

### Ereignis: `'error'` {#event-error}

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Der Fehler.

Das Ereignis `'error'` wird immer dann ausgelöst, wenn:

- Der Prozess nicht gestartet werden konnte.
- Der Prozess nicht beendet werden konnte.
- Das Senden einer Nachricht an den Kindprozess fehlgeschlagen ist.
- Der Kindprozess über die Option `signal` abgebrochen wurde.

Das Ereignis `'exit'` kann nach dem Auftreten eines Fehlers ausgelöst werden oder auch nicht. Wenn sowohl das Ereignis `'exit'` als auch das Ereignis `'error'` überwacht werden, sollten Sie sich davor hüten, Handlerfunktionen versehentlich mehrmals aufzurufen.

Siehe auch [`subprocess.kill()`](/de/nodejs/api/child_process#subprocesskillsignal) und [`subprocess.send()`](/de/nodejs/api/child_process#subprocesssendmessage-sendhandle-options-callback).

### Ereignis: `'exit'` {#event-exit}

**Hinzugefügt in: v0.1.90**

- `code` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Der Exit-Code, falls der Kindprozess von selbst beendet wurde.
- `signal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Das Signal, durch das der Kindprozess beendet wurde.

Das Ereignis `'exit'` wird ausgelöst, nachdem der Kindprozess beendet wurde. Wenn der Prozess beendet wurde, ist `code` der endgültige Exit-Code des Prozesses, andernfalls `null`. Wenn der Prozess aufgrund des Empfangs eines Signals beendet wurde, ist `signal` der Stringname des Signals, andernfalls `null`. Einer der beiden Werte ist immer ungleich `null`.

Wenn das Ereignis `'exit'` ausgelöst wird, können die stdio-Streams des Kindprozesses noch geöffnet sein.

Node.js richtet Signalhandler für `SIGINT` und `SIGTERM` ein, und Node.js-Prozesse werden aufgrund des Empfangs dieser Signale nicht sofort beendet. Stattdessen führt Node.js eine Reihe von Bereinigungsaktionen durch und löst dann das behandelte Signal erneut aus.

Siehe [`waitpid(2)`](http://man7.org/linux/man-pages/man2/waitpid.2).


### Event: `'message'` {#event-message}

**Hinzugefügt in: v0.5.9**

- `message` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Ein geparstes JSON-Objekt oder ein primitiver Wert.
- `sendHandle` [\<Handle\>](/de/nodejs/api/net#serverlistenhandle-backlog-callback) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) `undefined` oder ein [`net.Socket`](/de/nodejs/api/net#class-netsocket)-, [`net.Server`](/de/nodejs/api/net#class-netserver)- oder [`dgram.Socket`](/de/nodejs/api/dgram#class-dgramsocket)-Objekt.

Das `'message'`-Ereignis wird ausgelöst, wenn ein Kindprozess [`process.send()`](/de/nodejs/api/process#processsendmessage-sendhandle-options-callback) verwendet, um Nachrichten zu senden.

Die Nachricht durchläuft Serialisierung und Parsen. Die resultierende Nachricht ist möglicherweise nicht die gleiche wie die ursprünglich gesendete.

Wenn die Option `serialization` beim Erzeugen des Kindprozesses auf `'advanced'` gesetzt wurde, kann das `message`-Argument Daten enthalten, die JSON nicht darstellen kann. Weitere Informationen finden Sie unter [Erweiterte Serialisierung](/de/nodejs/api/child_process#advanced-serialization).

### Event: `'spawn'` {#event-spawn}

**Hinzugefügt in: v15.1.0, v14.17.0**

Das `'spawn'`-Ereignis wird ausgelöst, sobald der Kindprozess erfolgreich erzeugt wurde. Wenn der Kindprozess nicht erfolgreich erzeugt wird, wird das `'spawn'`-Ereignis nicht ausgelöst und stattdessen das `'error'`-Ereignis ausgelöst.

Wenn es ausgelöst wird, kommt das `'spawn'`-Ereignis vor allen anderen Ereignissen und bevor Daten über `stdout` oder `stderr` empfangen werden.

Das `'spawn'`-Ereignis wird unabhängig davon ausgelöst, ob ein Fehler **innerhalb** des erzeugten Prozesses auftritt. Wenn beispielsweise `bash some-command` erfolgreich erzeugt wird, wird das `'spawn'`-Ereignis ausgelöst, obwohl `bash` möglicherweise `some-command` nicht erzeugen kann. Dieser Vorbehalt gilt auch bei Verwendung von `{ shell: true }`.

### `subprocess.channel` {#subprocesschannel}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v14.0.0 | Das Objekt legt nicht mehr versehentlich native C++-Bindings offen. |
| v7.1.0 | Hinzugefügt in: v7.1.0 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Eine Pipe, die den IPC-Kanal zum Kindprozess darstellt.

Die `subprocess.channel`-Eigenschaft ist ein Verweis auf den IPC-Kanal des Kindprozesses. Wenn kein IPC-Kanal vorhanden ist, ist diese Eigenschaft `undefined`.


#### `subprocess.channel.ref()` {#subprocesschannelref}

**Hinzugefügt in: v7.1.0**

Diese Methode bewirkt, dass der IPC-Kanal die Ereignisschleife des übergeordneten Prozesses am Laufen hält, falls `.unref()` zuvor aufgerufen wurde.

#### `subprocess.channel.unref()` {#subprocesschannelunref}

**Hinzugefügt in: v7.1.0**

Diese Methode bewirkt, dass der IPC-Kanal die Ereignisschleife des übergeordneten Prozesses nicht am Laufen hält und sie auch bei geöffnetem Kanal beendet.

### `subprocess.connected` {#subprocessconnected}

**Hinzugefügt in: v0.7.2**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wird auf `false` gesetzt, nachdem `subprocess.disconnect()` aufgerufen wurde.

Die `subprocess.connected`-Eigenschaft gibt an, ob es noch möglich ist, Nachrichten von einem Kindprozess zu senden und zu empfangen. Wenn `subprocess.connected` auf `false` steht, ist es nicht mehr möglich, Nachrichten zu senden oder zu empfangen.

### `subprocess.disconnect()` {#subprocessdisconnect}

**Hinzugefügt in: v0.7.2**

Schließt den IPC-Kanal zwischen übergeordneten und untergeordneten Prozessen, sodass der untergeordnete Prozess ordnungsgemäß beendet werden kann, sobald keine anderen Verbindungen mehr bestehen, die ihn am Leben erhalten. Nach dem Aufruf dieser Methode werden die Eigenschaften `subprocess.connected` und `process.connected` sowohl im übergeordneten als auch im untergeordneten Prozess (bzw.) auf `false` gesetzt, und es ist nicht mehr möglich, Nachrichten zwischen den Prozessen auszutauschen.

Das `'disconnect'`-Ereignis wird ausgelöst, wenn sich keine Nachrichten im Empfang befinden. Dies wird meistens unmittelbar nach dem Aufruf von `subprocess.disconnect()` ausgelöst.

Wenn der untergeordnete Prozess eine Node.js-Instanz ist (z. B. erzeugt mit [`child_process.fork()`](/de/nodejs/api/child_process#child_processforkmodulepath-args-options)), kann die Methode `process.disconnect()` auch innerhalb des untergeordneten Prozesses aufgerufen werden, um den IPC-Kanal zu schließen.

### `subprocess.exitCode` {#subprocessexitcode}

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Die `subprocess.exitCode`-Eigenschaft gibt den Exit-Code des Kindprozesses an. Wenn der Kindprozess noch läuft, ist das Feld `null`.

### `subprocess.kill([signal])` {#subprocesskillsignal}

**Hinzugefügt in: v0.1.90**

- `signal` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Die Methode `subprocess.kill()` sendet ein Signal an den untergeordneten Prozess. Wenn kein Argument angegeben wird, wird dem Prozess das Signal `'SIGTERM'` gesendet. Siehe [`signal(7)`](http://man7.org/linux/man-pages/man7/signal.7) für eine Liste der verfügbaren Signale. Diese Funktion gibt `true` zurück, wenn [`kill(2)`](http://man7.org/linux/man-pages/man2/kill.2) erfolgreich ist, und `false` andernfalls.

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const grep = spawn('grep', ['ssh']);

grep.on('close', (code, signal) => {
  console.log(
    `Kindprozess wurde aufgrund des Empfangs des Signals ${signal} beendet`);
});

// Sende SIGHUP an Prozess.
grep.kill('SIGHUP');
```

```js [ESM]
import { spawn } from 'node:child_process';
const grep = spawn('grep', ['ssh']);

grep.on('close', (code, signal) => {
  console.log(
    `Kindprozess wurde aufgrund des Empfangs des Signals ${signal} beendet`);
});

// Sende SIGHUP an Prozess.
grep.kill('SIGHUP');
```
:::

Das [`ChildProcess`](/de/nodejs/api/child_process#class-childprocess)-Objekt kann ein [`'error'`](/de/nodejs/api/child_process#event-error)-Ereignis auslösen, wenn das Signal nicht zugestellt werden kann. Das Senden eines Signals an einen untergeordneten Prozess, der bereits beendet wurde, ist kein Fehler, kann aber unvorhergesehene Folgen haben. Insbesondere wenn die Prozesskennung (PID) einem anderen Prozess zugewiesen wurde, wird das Signal stattdessen an diesen Prozess zugestellt, was zu unerwarteten Ergebnissen führen kann.

Obwohl die Funktion `kill` genannt wird, führt das an den Kindprozess übermittelte Signal nicht unbedingt zur Beendigung des Prozesses.

Siehe [`kill(2)`](http://man7.org/linux/man-pages/man2/kill.2) als Referenz.

Unter Windows, wo keine POSIX-Signale existieren, wird das `signal`-Argument ignoriert, außer für `'SIGKILL'`, `'SIGTERM'`, `'SIGINT'` und `'SIGQUIT'`, und der Prozess wird immer gewaltsam und abrupt beendet (ähnlich wie `'SIGKILL'`). Siehe [Signal Events](/de/nodejs/api/process#signal-events) für weitere Details.

Unter Linux werden Kindprozesse von Kindprozessen nicht beendet, wenn versucht wird, ihren Elternprozess zu beenden. Dies geschieht wahrscheinlich, wenn ein neuer Prozess in einer Shell oder mit der Option `shell` von `ChildProcess` ausgeführt wird:

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');

const subprocess = spawn(
  'sh',
  [
    '-c',
    `node -e "setInterval(() => {
      console.log(process.pid, 'is alive')
    }, 500);"`,
  ], {
    stdio: ['inherit', 'inherit', 'inherit'],
  },
);

setTimeout(() => {
  subprocess.kill(); // Beendet nicht den Node.js-Prozess in der Shell.
}, 2000);
```

```js [ESM]
import { spawn } from 'node:child_process';

const subprocess = spawn(
  'sh',
  [
    '-c',
    `node -e "setInterval(() => {
      console.log(process.pid, 'is alive')
    }, 500);"`,
  ], {
    stdio: ['inherit', 'inherit', 'inherit'],
  },
);

setTimeout(() => {
  subprocess.kill(); // Beendet nicht den Node.js-Prozess in der Shell.
}, 2000);
```
:::


### `subprocess[Symbol.dispose]()` {#subprocesssymboldispose}

**Hinzugefügt in: v20.5.0, v18.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

Ruft [`subprocess.kill()`](/de/nodejs/api/child_process#subprocesskillsignal) mit `'SIGTERM'` auf.

### `subprocess.killed` {#subprocesskilled}

**Hinzugefügt in: v0.5.10**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Auf `true` gesetzt, nachdem `subprocess.kill()` verwendet wurde, um erfolgreich ein Signal an den Kindprozess zu senden.

Die Eigenschaft `subprocess.killed` gibt an, ob der Kindprozess erfolgreich ein Signal von `subprocess.kill()` empfangen hat. Die Eigenschaft `killed` gibt nicht an, dass der Kindprozess beendet wurde.

### `subprocess.pid` {#subprocesspid}

**Hinzugefügt in: v0.1.90**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Gibt die Prozess-ID (PID) des Kindprozesses zurück. Wenn der Kindprozess aufgrund von Fehlern nicht gestartet werden kann, ist der Wert `undefined` und `error` wird ausgelöst.

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const grep = spawn('grep', ['ssh']);

console.log(`Spawned child pid: ${grep.pid}`);
grep.stdin.end();
```

```js [ESM]
import { spawn } from 'node:child_process';
const grep = spawn('grep', ['ssh']);

console.log(`Spawned child pid: ${grep.pid}`);
grep.stdin.end();
```
:::

### `subprocess.ref()` {#subprocessref}

**Hinzugefügt in: v0.7.10**

Wenn Sie `subprocess.ref()` aufrufen, nachdem Sie `subprocess.unref()` aufgerufen haben, wird die entfernte Referenzanzahl für den Kindprozess wiederhergestellt, wodurch der Elternprozess gezwungen wird, auf das Beenden des Kindprozesses zu warten, bevor er sich selbst beendet.

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const process = require('node:process');

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
subprocess.ref();
```

```js [ESM]
import { spawn } from 'node:child_process';
import process from 'node:process';

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
subprocess.ref();
```
:::


### `subprocess.send(message[, sendHandle[, options]][, callback])` {#subprocesssendmessage-sendhandle-options-callback}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v5.8.0 | Der Parameter `options` und insbesondere die Option `keepOpen` werden jetzt unterstützt. |
| v5.0.0 | Diese Methode gibt jetzt einen booleschen Wert zur Flusssteuerung zurück. |
| v4.0.0 | Der Parameter `callback` wird jetzt unterstützt. |
| v0.5.9 | Hinzugefügt in: v0.5.9 |
:::

- `message` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `sendHandle` [\<Handle\>](/de/nodejs/api/net#serverlistenhandle-backlog-callback) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) `undefined` oder ein [`net.Socket`](/de/nodejs/api/net#class-netsocket)-, [`net.Server`](/de/nodejs/api/net#class-netserver)- oder [`dgram.Socket`](/de/nodejs/api/dgram#class-dgramsocket)-Objekt.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Das Argument `options` ist, falls vorhanden, ein Objekt, das zur Parametrisierung des Sendens bestimmter Handle-Typen verwendet wird. `options` unterstützt die folgenden Eigenschaften:
    - `keepOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Ein Wert, der beim Übergeben von Instanzen von `net.Socket` verwendet werden kann. Wenn `true`, wird der Socket im sendenden Prozess offen gehalten. **Standard:** `false`.

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Wenn ein IPC-Kanal zwischen dem Eltern- und Kindprozess eingerichtet wurde (d. h. bei Verwendung von [`child_process.fork()`](/de/nodejs/api/child_process#child_processforkmodulepath-args-options)), kann die Methode `subprocess.send()` verwendet werden, um Nachrichten an den Kindprozess zu senden. Wenn der Kindprozess eine Node.js-Instanz ist, können diese Nachrichten über das [`'message'`](/de/nodejs/api/process#event-message)-Ereignis empfangen werden.

Die Nachricht durchläuft Serialisierung und Parsing. Die resultierende Nachricht ist möglicherweise nicht die gleiche wie die ursprünglich gesendete.

Zum Beispiel im Elternskript:

::: code-group
```js [CJS]
const { fork } = require('node:child_process');
const forkedProcess = fork(`${__dirname}/sub.js`);

forkedProcess.on('message', (message) => {
  console.log('PARENT got message:', message);
});

// Veranlasst den Kindprozess, Folgendes auszugeben: CHILD got message: { hello: 'world' }
forkedProcess.send({ hello: 'world' });
```

```js [ESM]
import { fork } from 'node:child_process';
const forkedProcess = fork(`${import.meta.dirname}/sub.js`);

forkedProcess.on('message', (message) => {
  console.log('PARENT got message:', message);
});

// Veranlasst den Kindprozess, Folgendes auszugeben: CHILD got message: { hello: 'world' }
forkedProcess.send({ hello: 'world' });
```
:::

Und dann könnte das Kindskript, `'sub.js'`, wie folgt aussehen:

```js [ESM]
process.on('message', (message) => {
  console.log('CHILD got message:', message);
});

// Veranlasst den Elternprozess, Folgendes auszugeben: PARENT got message: { foo: 'bar', baz: null }
process.send({ foo: 'bar', baz: NaN });
```
Kind-Node.js-Prozesse haben eine eigene [`process.send()`](/de/nodejs/api/process#processsendmessage-sendhandle-options-callback)-Methode, die es dem Kindprozess ermöglicht, Nachrichten zurück an den Elternprozess zu senden.

Es gibt einen Sonderfall beim Senden einer `{cmd: 'NODE_foo'}`-Nachricht. Nachrichten, die ein `NODE_`-Präfix in der `cmd`-Eigenschaft enthalten, sind für die Verwendung innerhalb von Node.js core reserviert und werden nicht im [`'message'`](/de/nodejs/api/process#event-message)-Ereignis des Kindes ausgegeben. Stattdessen werden solche Nachrichten mit dem `'internalMessage'`-Ereignis ausgegeben und intern von Node.js verarbeitet. Anwendungen sollten es vermeiden, solche Nachrichten zu verwenden oder auf `'internalMessage'`-Ereignisse zu hören, da dies ohne Vorankündigung geändert werden kann.

Das optionale `sendHandle`-Argument, das an `subprocess.send()` übergeben werden kann, dient zum Übergeben eines TCP-Server- oder Socket-Objekts an den Kindprozess. Der Kindprozess empfängt das Objekt als zweites Argument, das an die Callback-Funktion übergeben wird, die für das [`'message'`](/de/nodejs/api/process#event-message)-Ereignis registriert ist. Alle Daten, die im Socket empfangen und gepuffert werden, werden nicht an das Kind gesendet. Das Senden von IPC-Sockets wird unter Windows nicht unterstützt.

Das optionale `callback` ist eine Funktion, die aufgerufen wird, nachdem die Nachricht gesendet wurde, aber bevor der Kindprozess sie möglicherweise empfangen hat. Die Funktion wird mit einem einzigen Argument aufgerufen: `null` bei Erfolg oder ein [`Error`](/de/nodejs/api/errors#class-error)-Objekt bei Fehlschlag.

Wenn keine `callback`-Funktion bereitgestellt wird und die Nachricht nicht gesendet werden kann, wird ein `'error'`-Ereignis vom [`ChildProcess`](/de/nodejs/api/child_process#class-childprocess)-Objekt ausgegeben. Dies kann beispielsweise vorkommen, wenn der Kindprozess bereits beendet wurde.

`subprocess.send()` gibt `false` zurück, wenn der Kanal geschlossen wurde oder wenn der Rückstand nicht gesendeter Nachrichten eine Schwelle überschreitet, die es unklug macht, weitere zu senden. Andernfalls gibt die Methode `true` zurück. Die `callback`-Funktion kann verwendet werden, um die Flusssteuerung zu implementieren.


#### Beispiel: Senden eines Serverobjekts {#example-sending-a-server-object}

Das Argument `sendHandle` kann beispielsweise verwendet werden, um das Handle eines TCP-Serverobjekts an den Kindprozess zu übergeben, wie im folgenden Beispiel veranschaulicht:

::: code-group
```js [CJS]
const { fork } = require('node:child_process');
const { createServer } = require('node:net');

const subprocess = fork('subprocess.js');

// Öffnen Sie das Serverobjekt und senden Sie das Handle.
const server = createServer();
server.on('connection', (socket) => {
  socket.end('handled by parent');
});
server.listen(1337, () => {
  subprocess.send('server', server);
});
```

```js [ESM]
import { fork } from 'node:child_process';
import { createServer } from 'node:net';

const subprocess = fork('subprocess.js');

// Öffnen Sie das Serverobjekt und senden Sie das Handle.
const server = createServer();
server.on('connection', (socket) => {
  socket.end('handled by parent');
});
server.listen(1337, () => {
  subprocess.send('server', server);
});
```
:::

Der Kindprozess würde dann das Serverobjekt wie folgt empfangen:

```js [ESM]
process.on('message', (m, server) => {
  if (m === 'server') {
    server.on('connection', (socket) => {
      socket.end('handled by child');
    });
  }
});
```
Sobald der Server nun zwischen dem Eltern- und dem Kindprozess geteilt ist, können einige Verbindungen vom Elternteil und einige vom Kind verarbeitet werden.

Während das obige Beispiel einen mit dem Modul `node:net` erstellten Server verwendet, verwenden Server des Moduls `node:dgram` genau den gleichen Workflow mit den Ausnahmen, dass sie auf ein `'message'`-Ereignis anstelle von `'connection'` hören und `server.bind()` anstelle von `server.listen()` verwenden. Dies wird jedoch nur auf Unix-Plattformen unterstützt.

#### Beispiel: Senden eines Socket-Objekts {#example-sending-a-socket-object}

In ähnlicher Weise kann das Argument `sendHandler` verwendet werden, um das Handle eines Sockets an den Kindprozess zu übergeben. Das folgende Beispiel erzeugt zwei Kinder, die jeweils Verbindungen mit "normaler" oder "spezieller" Priorität verarbeiten:

::: code-group
```js [CJS]
const { fork } = require('node:child_process');
const { createServer } = require('node:net');

const normal = fork('subprocess.js', ['normal']);
const special = fork('subprocess.js', ['special']);

// Öffnen Sie den Server und senden Sie Sockets an das Kind. Verwenden Sie pauseOnConnect, um zu verhindern, dass
// die Sockets gelesen werden, bevor sie an den Kindprozess gesendet werden.
const server = createServer({ pauseOnConnect: true });
server.on('connection', (socket) => {

  // Wenn dies spezielle Priorität hat...
  if (socket.remoteAddress === '74.125.127.100') {
    special.send('socket', socket);
    return;
  }
  // Dies ist normale Priorität.
  normal.send('socket', socket);
});
server.listen(1337);
```

```js [ESM]
import { fork } from 'node:child_process';
import { createServer } from 'node:net';

const normal = fork('subprocess.js', ['normal']);
const special = fork('subprocess.js', ['special']);

// Öffnen Sie den Server und senden Sie Sockets an das Kind. Verwenden Sie pauseOnConnect, um zu verhindern, dass
// die Sockets gelesen werden, bevor sie an den Kindprozess gesendet werden.
const server = createServer({ pauseOnConnect: true });
server.on('connection', (socket) => {

  // Wenn dies spezielle Priorität hat...
  if (socket.remoteAddress === '74.125.127.100') {
    special.send('socket', socket);
    return;
  }
  // Dies ist normale Priorität.
  normal.send('socket', socket);
});
server.listen(1337);
```
:::

Die `subprocess.js` würde das Socket-Handle als das zweite an die Ereignis-Callback-Funktion übergebene Argument empfangen:

```js [ESM]
process.on('message', (m, socket) => {
  if (m === 'socket') {
    if (socket) {
      // Überprüfen Sie, ob der Client-Socket vorhanden ist.
      // Es ist möglich, dass der Socket zwischen dem Zeitpunkt, zu dem er gesendet wird, und dem Zeitpunkt, zu dem er im Kindprozess empfangen wird, geschlossen wird.
      socket.end(`Request handled with ${process.argv[2]} priority`);
    }
  }
});
```
Verwenden Sie kein `.maxConnections` auf einem Socket, der an einen Unterprozess übergeben wurde. Der Elternprozess kann nicht verfolgen, wann der Socket zerstört wird.

Alle `'message'`-Handler im Unterprozess sollten überprüfen, ob `socket` existiert, da die Verbindung möglicherweise geschlossen wurde, während die Verbindung an das Kind gesendet wurde.


### `subprocess.signalCode` {#subprocesssignalcode}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

Die Eigenschaft `subprocess.signalCode` gibt das vom Kindprozess empfangene Signal an, falls vorhanden, andernfalls `null`.

### `subprocess.spawnargs` {#subprocessspawnargs}

- [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

Die Eigenschaft `subprocess.spawnargs` stellt die vollständige Liste der Befehlszeilenargumente dar, mit denen der Kindprozess gestartet wurde.

### `subprocess.spawnfile` {#subprocessspawnfile}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Die Eigenschaft `subprocess.spawnfile` gibt den ausführbaren Dateinamen des gestarteten Kindprozesses an.

Für [`child_process.fork()`](/de/nodejs/api/child_process#child_processforkmodulepath-args-options) entspricht der Wert [`process.execPath`](/de/nodejs/api/process#processexecpath). Für [`child_process.spawn()`](/de/nodejs/api/child_process#child_processspawncommand-args-options) ist der Wert der Name der ausführbaren Datei. Für [`child_process.exec()`](/de/nodejs/api/child_process#child_processexeccommand-options-callback) ist der Wert der Name der Shell, in der der Kindprozess gestartet wird.

### `subprocess.stderr` {#subprocessstderr}

**Hinzugefügt in: v0.1.90**

- [\<stream.Readable\>](/de/nodejs/api/stream#class-streamreadable) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Ein `Readable Stream`, der das `stderr` des Kindprozesses darstellt.

Wenn der Kindprozess mit `stdio[2]` auf etwas anderes als `'pipe'` gesetzt wurde, ist dies `null`.

`subprocess.stderr` ist ein Alias für `subprocess.stdio[2]`. Beide Eigenschaften beziehen sich auf denselben Wert.

Die Eigenschaft `subprocess.stderr` kann `null` oder `undefined` sein, wenn der Kindprozess nicht erfolgreich gestartet werden konnte.


### `subprocess.stdin` {#subprocessstdin}

**Hinzugefügt in: v0.1.90**

- [\<stream.Writable\>](/de/nodejs/api/stream#class-streamwritable) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Ein `Writable Stream`, der die `stdin` des Kindprozesses darstellt.

Wenn ein Kindprozess darauf wartet, seine gesamte Eingabe zu lesen, wird der Kindprozess erst fortgesetzt, wenn dieser Stream über `end()` geschlossen wurde.

Wenn der Kindprozess mit `stdio[0]` auf einen anderen Wert als `'pipe'` gestartet wurde, ist dieser Wert `null`.

`subprocess.stdin` ist ein Alias für `subprocess.stdio[0]`. Beide Eigenschaften verweisen auf denselben Wert.

Die Eigenschaft `subprocess.stdin` kann `null` oder `undefined` sein, wenn der Kindprozess nicht erfolgreich gestartet werden konnte.

### `subprocess.stdio` {#subprocessstdio}

**Hinzugefügt in: v0.7.10**

- [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

Ein spärliches Array von Pipes zum Kindprozess, das Positionen in der [`stdio`](/de/nodejs/api/child_process#optionsstdio)-Option entspricht, die an [`child_process.spawn()`](/de/nodejs/api/child_process#child_processspawncommand-args-options) übergeben wurde und auf den Wert `'pipe'` gesetzt wurde. `subprocess.stdio[0]`, `subprocess.stdio[1]` und `subprocess.stdio[2]` sind auch als `subprocess.stdin`, `subprocess.stdout` bzw. `subprocess.stderr` verfügbar.

Im folgenden Beispiel ist nur die fd `1` (stdout) des Kindprozesses als Pipe konfiguriert, sodass nur die `subprocess.stdio[1]` des Elternprozesses ein Stream ist, alle anderen Werte im Array sind `null`.

::: code-group
```js [CJS]
const assert = require('node:assert');
const fs = require('node:fs');
const child_process = require('node:child_process');

const subprocess = child_process.spawn('ls', {
  stdio: [
    0, // Use parent's stdin for child.
    'pipe', // Pipe child's stdout to parent.
    fs.openSync('err.out', 'w'), // Direct child's stderr to a file.
  ],
});

assert.strictEqual(subprocess.stdio[0], null);
assert.strictEqual(subprocess.stdio[0], subprocess.stdin);

assert(subprocess.stdout);
assert.strictEqual(subprocess.stdio[1], subprocess.stdout);

assert.strictEqual(subprocess.stdio[2], null);
assert.strictEqual(subprocess.stdio[2], subprocess.stderr);
```

```js [ESM]
import assert from 'node:assert';
import fs from 'node:fs';
import child_process from 'node:child_process';

const subprocess = child_process.spawn('ls', {
  stdio: [
    0, // Use parent's stdin for child.
    'pipe', // Pipe child's stdout to parent.
    fs.openSync('err.out', 'w'), // Direct child's stderr to a file.
  ],
});

assert.strictEqual(subprocess.stdio[0], null);
assert.strictEqual(subprocess.stdio[0], subprocess.stdin);

assert(subprocess.stdout);
assert.strictEqual(subprocess.stdio[1], subprocess.stdout);

assert.strictEqual(subprocess.stdio[2], null);
assert.strictEqual(subprocess.stdio[2], subprocess.stderr);
```
:::

Die Eigenschaft `subprocess.stdio` kann `undefined` sein, wenn der Kindprozess nicht erfolgreich gestartet werden konnte.


### `subprocess.stdout` {#subprocessstdout}

**Hinzugefügt in: v0.1.90**

- [\<stream.Readable\>](/de/nodejs/api/stream#class-streamreadable) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Ein `Readable Stream`, der das `stdout` des Kindprozesses darstellt.

Wenn der Kindprozess mit `stdio[1]` auf etwas anderes als `'pipe'` gesetzt wurde, dann ist dies `null`.

`subprocess.stdout` ist ein Alias für `subprocess.stdio[1]`. Beide Eigenschaften beziehen sich auf denselben Wert.

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');

const subprocess = spawn('ls');

subprocess.stdout.on('data', (data) => {
  console.log(`Received chunk ${data}`);
});
```

```js [ESM]
import { spawn } from 'node:child_process';

const subprocess = spawn('ls');

subprocess.stdout.on('data', (data) => {
  console.log(`Received chunk ${data}`);
});
```
:::

Die Eigenschaft `subprocess.stdout` kann `null` oder `undefined` sein, wenn der Kindprozess nicht erfolgreich gestartet werden konnte.

### `subprocess.unref()` {#subprocessunref}

**Hinzugefügt in: v0.7.10**

Standardmäßig wartet der Elternprozess darauf, dass sich der getrennte Kindprozess beendet. Um zu verhindern, dass der Elternprozess auf die Beendigung eines bestimmten `subprocess` wartet, verwenden Sie die Methode `subprocess.unref()`. Dadurch wird die Ereignisschleife des Elternprozesses den Kindprozess nicht in ihre Referenzzählung aufnehmen, sodass sich der Elternprozess unabhängig vom Kind beenden kann, es sei denn, es besteht ein etablierter IPC-Kanal zwischen dem Kind- und dem Elternprozess.

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const process = require('node:process');

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
```

```js [ESM]
import { spawn } from 'node:child_process';
import process from 'node:process';

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
```
:::


## `maxBuffer` und Unicode {#maxbuffer-and-unicode}

Die Option `maxBuffer` gibt die maximale Anzahl von Bytes an, die auf `stdout` oder `stderr` zulässig sind. Wenn dieser Wert überschritten wird, wird der Kindprozess beendet. Dies wirkt sich auf die Ausgabe aus, die Multibyte-Zeichencodierungen wie UTF-8 oder UTF-16 enthält. Zum Beispiel sendet `console.log('中文测试')` 13 UTF-8-kodierte Bytes an `stdout`, obwohl es nur 4 Zeichen sind.

## Shell-Anforderungen {#shell-requirements}

Die Shell sollte den Schalter `-c` verstehen. Wenn die Shell `'cmd.exe'` ist, sollte sie die Schalter `/d /s /c` verstehen und die Befehlszeilenanalyse sollte kompatibel sein.

## Standard-Windows-Shell {#default-windows-shell}

Obwohl Microsoft festlegt, dass `%COMSPEC%` den Pfad zu `'cmd.exe'` in der Stammumgebung enthalten muss, unterliegen Kindprozesse nicht immer derselben Anforderung. Daher wird in `child_process`-Funktionen, in denen eine Shell gestartet werden kann, `'cmd.exe'` als Fallback verwendet, wenn `process.env.ComSpec` nicht verfügbar ist.

## Erweiterte Serialisierung {#advanced-serialization}

**Hinzugefügt in: v13.2.0, v12.16.0**

Kindprozesse unterstützen einen Serialisierungsmechanismus für IPC, der auf der [Serialisierungs-API des `node:v8`-Moduls](/de/nodejs/api/v8#serialization-api) basiert, die auf dem [HTML structured clone algorithm](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm) basiert. Dies ist im Allgemeinen leistungsfähiger und unterstützt mehr integrierte JavaScript-Objekttypen, wie z. B. `BigInt`, `Map` und `Set`, `ArrayBuffer` und `TypedArray`, `Buffer`, `Error`, `RegExp` usw.

Dieses Format ist jedoch keine vollständige Obermenge von JSON, und z. B. Eigenschaften, die auf Objekten solcher integrierten Typen gesetzt sind, werden nicht durch den Serialisierungsschritt weitergegeben. Darüber hinaus ist die Leistung möglicherweise nicht äquivalent zu der von JSON, abhängig von der Struktur der übergebenen Daten. Daher erfordert diese Funktion die Aktivierung, indem die Option `serialization` auf `'advanced'` gesetzt wird, wenn [`child_process.spawn()`](/de/nodejs/api/child_process#child_processspawncommand-args-options) oder [`child_process.fork()`](/de/nodejs/api/child_process#child_processforkmodulepath-args-options) aufgerufen wird.

