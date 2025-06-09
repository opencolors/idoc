---
title: Node.js OS Modul Dokumentation
description: Das OS-Modul von Node.js bietet eine Reihe von betriebssystembezogenen Hilfsmethoden. Es kann verwendet werden, um mit dem zugrunde liegenden Betriebssystem zu interagieren, Systeminformationen abzurufen und Systemebene-Operationen durchzuführen.
head:
  - - meta
    - name: og:title
      content: Node.js OS Modul Dokumentation | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Das OS-Modul von Node.js bietet eine Reihe von betriebssystembezogenen Hilfsmethoden. Es kann verwendet werden, um mit dem zugrunde liegenden Betriebssystem zu interagieren, Systeminformationen abzurufen und Systemebene-Operationen durchzuführen.
  - - meta
    - name: twitter:title
      content: Node.js OS Modul Dokumentation | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Das OS-Modul von Node.js bietet eine Reihe von betriebssystembezogenen Hilfsmethoden. Es kann verwendet werden, um mit dem zugrunde liegenden Betriebssystem zu interagieren, Systeminformationen abzurufen und Systemebene-Operationen durchzuführen.
---


# OS {#os}

::: tip [Stabil: 2 - Stabil]
[Stabil: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil
:::

**Quellcode:** [lib/os.js](https://github.com/nodejs/node/blob/v23.5.0/lib/os.js)

Das Modul `node:os` stellt Dienstprogramme und Eigenschaften im Zusammenhang mit dem Betriebssystem bereit. Der Zugriff erfolgt über:

::: code-group
```js [ESM]
import os from 'node:os';
```

```js [CJS]
const os = require('node:os');
```
:::

## `os.EOL` {#oseol}

**Hinzugefügt in: v0.7.8**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Das betriebssystemspezifische Zeilenendezeichen.

- `\n` unter POSIX
- `\r\n` unter Windows

## `os.availableParallelism()` {#osavailableparallelism}

**Hinzugefügt in: v19.4.0, v18.14.0**

- Gibt zurück: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Gibt eine Schätzung des Standardgrads an Parallelität zurück, den ein Programm verwenden sollte. Gibt immer einen Wert größer als Null zurück.

Diese Funktion ist ein kleiner Wrapper um libuvs [`uv_available_parallelism()`](https://docs.libuv.org/en/v1.x/misc#c.uv_available_parallelism).

## `os.arch()` {#osarch}

**Hinzugefügt in: v0.5.0**

- Gibt zurück: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Gibt die Betriebssystem-CPU-Architektur zurück, für die die Node.js-Binärdatei kompiliert wurde. Mögliche Werte sind `'arm'`, `'arm64'`, `'ia32'`, `'loong64'`, `'mips'`, `'mipsel'`, `'ppc'`, `'ppc64'`, `'riscv64'`, `'s390'`, `'s390x'` und `'x64'`.

Der Rückgabewert entspricht [`process.arch`](/de/nodejs/api/process#processarch).

## `os.constants` {#osconstants}

**Hinzugefügt in: v6.3.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Enthält häufig verwendete betriebssystemspezifische Konstanten für Fehlercodes, Prozesssignale usw. Die spezifischen definierten Konstanten sind unter [OS-Konstanten](/de/nodejs/api/os#os-constants) beschrieben.

## `os.cpus()` {#oscpus}

**Hinzugefügt in: v0.3.3**

- Gibt zurück: [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Gibt ein Array von Objekten zurück, das Informationen zu jedem logischen CPU-Kern enthält. Das Array ist leer, wenn keine CPU-Informationen verfügbar sind, z. B. wenn das `/proc`-Dateisystem nicht verfügbar ist.

Die in jedem Objekt enthaltenen Eigenschaften sind:

- `model` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `speed` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) (in MHz)
- `times` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `user` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der Millisekunden, die die CPU im Benutzermodus verbracht hat.
    - `nice` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der Millisekunden, die die CPU im Nice-Modus verbracht hat.
    - `sys` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der Millisekunden, die die CPU im Sys-Modus verbracht hat.
    - `idle` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der Millisekunden, die die CPU im Leerlauf verbracht hat.
    - `irq` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der Millisekunden, die die CPU im IRQ-Modus verbracht hat.

```js [ESM]
[
  {
    model: 'Intel(R) Core(TM) i7 CPU         860  @ 2.80GHz',
    speed: 2926,
    times: {
      user: 252020,
      nice: 0,
      sys: 30340,
      idle: 1070356870,
      irq: 0,
    },
  },
  {
    model: 'Intel(R) Core(TM) i7 CPU         860  @ 2.80GHz',
    speed: 2926,
    times: {
      user: 306960,
      nice: 0,
      sys: 26980,
      idle: 1071569080,
      irq: 0,
    },
  },
  {
    model: 'Intel(R) Core(TM) i7 CPU         860  @ 2.80GHz',
    speed: 2926,
    times: {
      user: 248450,
      nice: 0,
      sys: 21750,
      idle: 1070919370,
      irq: 0,
    },
  },
  {
    model: 'Intel(R) Core(TM) i7 CPU         860  @ 2.80GHz',
    speed: 2926,
    times: {
      user: 256880,
      nice: 0,
      sys: 19430,
      idle: 1070905480,
      irq: 20,
    },
  },
]
```

`nice`-Werte sind nur für POSIX. Unter Windows sind die `nice`-Werte aller Prozessoren immer 0.

`os.cpus().length` sollte nicht verwendet werden, um den Grad an Parallelität zu berechnen, der einer Anwendung zur Verfügung steht. Verwenden Sie stattdessen [`os.availableParallelism()`](/de/nodejs/api/os#osavailableparallelism).


## `os.devNull` {#osdevnull}

**Hinzugefügt in: v16.3.0, v14.18.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Der plattformspezifische Dateipfad des Nullgeräts.

- `\\.\nul` unter Windows
- `/dev/null` unter POSIX

## `os.endianness()` {#osendianness}

**Hinzugefügt in: v0.9.4**

- Gibt zurück: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Gibt eine Zeichenkette zurück, die die Endianness der CPU identifiziert, für die die Node.js-Binärdatei kompiliert wurde.

Mögliche Werte sind `'BE'` für Big Endian und `'LE'` für Little Endian.

## `os.freemem()` {#osfreemem}

**Hinzugefügt in: v0.3.3**

- Gibt zurück: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Gibt die Menge des freien Systemspeichers in Bytes als Integer zurück.

## `os.getPriority([pid])` {#osgetprioritypid}

**Hinzugefügt in: v10.10.0**

- `pid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Prozess-ID, für die die Scheduling-Priorität abgerufen werden soll. **Standard:** `0`.
- Gibt zurück: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Gibt die Scheduling-Priorität für den durch `pid` angegebenen Prozess zurück. Wenn `pid` nicht angegeben oder `0` ist, wird die Priorität des aktuellen Prozesses zurückgegeben.

## `os.homedir()` {#oshomedir}

**Hinzugefügt in: v2.3.0**

- Gibt zurück: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Gibt den String-Pfad zum Home-Verzeichnis des aktuellen Benutzers zurück.

Unter POSIX wird die Umgebungsvariable `$HOME` verwendet, falls definiert. Andernfalls wird die [effektive UID](https://en.wikipedia.org/wiki/User_identifier#Effective_user_ID) verwendet, um das Home-Verzeichnis des Benutzers zu suchen.

Unter Windows wird die Umgebungsvariable `USERPROFILE` verwendet, falls definiert. Andernfalls wird der Pfad zum Profilverzeichnis des aktuellen Benutzers verwendet.

## `os.hostname()` {#oshostname}

**Hinzugefügt in: v0.3.3**

- Gibt zurück: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Gibt den Hostnamen des Betriebssystems als String zurück.


## `os.loadavg()` {#osloadavg}

**Hinzugefügt in: v0.3.3**

- Gibt zurück: [\<number[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Gibt ein Array zurück, das die Load Averages für 1, 5 und 15 Minuten enthält.

Die Load Average ist ein Maß für die Systemaktivität, das vom Betriebssystem berechnet und als Bruchzahl ausgedrückt wird.

Die Load Average ist ein Unix-spezifisches Konzept. Unter Windows ist der Rückgabewert immer `[0, 0, 0]`.

## `os.machine()` {#osmachine}

**Hinzugefügt in: v18.9.0, v16.18.0**

- Gibt zurück: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Gibt den Maschinentyp als Zeichenkette zurück, z. B. `arm`, `arm64`, `aarch64`, `mips`, `mips64`, `ppc64`, `ppc64le`, `s390`, `s390x`, `i386`, `i686`, `x86_64`.

Auf POSIX-Systemen wird der Maschinentyp durch Aufruf von [`uname(3)`](https://linux.die.net/man/3/uname) bestimmt. Unter Windows wird `RtlGetVersion()` verwendet, und wenn diese nicht verfügbar ist, wird `GetVersionExW()` verwendet. Siehe [https://en.wikipedia.org/wiki/Uname#Examples](https://en.wikipedia.org/wiki/Uname#Examples) für weitere Informationen.

## `os.networkInterfaces()` {#osnetworkinterfaces}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v18.4.0 | Die Eigenschaft `family` gibt jetzt eine Zeichenkette anstelle einer Zahl zurück. |
| v18.0.0 | Die Eigenschaft `family` gibt jetzt eine Zahl anstelle einer Zeichenkette zurück. |
| v0.6.0 | Hinzugefügt in: v0.6.0 |
:::

- Gibt zurück: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Gibt ein Objekt zurück, das Netzwerkschnittstellen enthält, denen eine Netzwerkadresse zugewiesen wurde.

Jeder Schlüssel im zurückgegebenen Objekt identifiziert eine Netzwerkschnittstelle. Der zugeordnete Wert ist ein Array von Objekten, die jeweils eine zugewiesene Netzwerkadresse beschreiben.

Die für das zugewiesene Netzwerkadressenobjekt verfügbaren Eigenschaften umfassen:

- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die zugewiesene IPv4- oder IPv6-Adresse
- `netmask` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die IPv4- oder IPv6-Netzwerkmaske
- `family` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Entweder `IPv4` oder `IPv6`
- `mac` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die MAC-Adresse der Netzwerkschnittstelle
- `internal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, wenn die Netzwerkschnittstelle ein Loopback oder eine ähnliche Schnittstelle ist, die nicht aus der Ferne zugänglich ist; andernfalls `false`
- `scopeid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die numerische IPv6-Scope-ID (nur angegeben, wenn `family` `IPv6` ist)
- `cidr` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die zugewiesene IPv4- oder IPv6-Adresse mit dem Routing-Präfix in CIDR-Notation. Wenn die `netmask` ungültig ist, wird diese Eigenschaft auf `null` gesetzt.

```js [ESM]
{
  lo: [
    {
      address: '127.0.0.1',
      netmask: '255.0.0.0',
      family: 'IPv4',
      mac: '00:00:00:00:00:00',
      internal: true,
      cidr: '127.0.0.1/8'
    },
    {
      address: '::1',
      netmask: 'ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff',
      family: 'IPv6',
      mac: '00:00:00:00:00:00',
      scopeid: 0,
      internal: true,
      cidr: '::1/128'
    }
  ],
  eth0: [
    {
      address: '192.168.1.108',
      netmask: '255.255.255.0',
      family: 'IPv4',
      mac: '01:02:03:0a:0b:0c',
      internal: false,
      cidr: '192.168.1.108/24'
    },
    {
      address: 'fe80::a00:27ff:fe4e:66a1',
      netmask: 'ffff:ffff:ffff:ffff::',
      family: 'IPv6',
      mac: '01:02:03:0a:0b:0c',
      scopeid: 1,
      internal: false,
      cidr: 'fe80::a00:27ff:fe4e:66a1/64'
    }
  ]
}
```

## `os.platform()` {#osplatform}

**Hinzugefügt in: v0.5.0**

- Gibt zurück: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Gibt einen String zurück, der die Betriebssystemplattform identifiziert, für die die Node.js-Binärdatei kompiliert wurde. Der Wert wird zur Kompilierzeit festgelegt. Mögliche Werte sind `'aix'`, `'darwin'`, `'freebsd'`, `'linux'`, `'openbsd'`, `'sunos'` und `'win32'`.

Der Rückgabewert entspricht [`process.platform`](/de/nodejs/api/process#processplatform).

Der Wert `'android'` kann auch zurückgegeben werden, wenn Node.js auf dem Android-Betriebssystem aufgebaut ist. [Android-Unterstützung ist experimentell](https://github.com/nodejs/node/blob/HEAD/BUILDING.md#android).

## `os.release()` {#osrelease}

**Hinzugefügt in: v0.3.3**

- Gibt zurück: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Gibt das Betriebssystem als String zurück.

Auf POSIX-Systemen wird die Betriebssystemversion durch Aufruf von [`uname(3)`](https://linux.die.net/man/3/uname) ermittelt. Unter Windows wird `GetVersionExW()` verwendet. Siehe [https://en.wikipedia.org/wiki/Uname#Examples](https://en.wikipedia.org/wiki/Uname#Examples) für weitere Informationen.

## `os.setPriority([pid, ]priority)` {#ossetprioritypid-priority}

**Hinzugefügt in: v10.10.0**

- `pid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Prozess-ID, für die die Scheduling-Priorität festgelegt werden soll. **Standard:** `0`.
- `priority` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die dem Prozess zuzuweisende Scheduling-Priorität.

Versucht, die Scheduling-Priorität für den durch `pid` angegebenen Prozess festzulegen. Wenn `pid` nicht angegeben oder `0` ist, wird die Prozess-ID des aktuellen Prozesses verwendet.

Der `priority`-Eingabewert muss eine ganze Zahl zwischen `-20` (hohe Priorität) und `19` (niedrige Priorität) sein. Aufgrund von Unterschieden zwischen Unix-Prioritätsstufen und Windows-Prioritätsklassen wird `priority` auf eine von sechs Prioritätskonstanten in `os.constants.priority` abgebildet. Beim Abrufen einer Prozessprioritätsstufe kann diese Bereichszuordnung dazu führen, dass der Rückgabewert unter Windows geringfügig abweicht. Um Verwirrung zu vermeiden, setzen Sie `priority` auf eine der Prioritätskonstanten.

Unter Windows erfordert das Setzen der Priorität auf `PRIORITY_HIGHEST` erhöhte Benutzerrechte. Andernfalls wird die eingestellte Priorität stillschweigend auf `PRIORITY_HIGH` reduziert.


## `os.tmpdir()` {#ostmpdir}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v2.0.0 | Diese Funktion ist jetzt plattformübergreifend konsistent und gibt auf keiner Plattform mehr einen Pfad mit einem nachgestellten Schrägstrich zurück. |
| v0.9.9 | Hinzugefügt in: v0.9.9 |
:::

- Gibt zurück: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Gibt das Standardverzeichnis des Betriebssystems für temporäre Dateien als Zeichenkette zurück.

Unter Windows kann das Ergebnis durch die Umgebungsvariablen `TEMP` und `TMP` überschrieben werden, wobei `TEMP` Vorrang vor `TMP` hat. Wenn keine von beiden gesetzt ist, wird standardmäßig `%SystemRoot%\temp` oder `%windir%\temp` verwendet.

Auf Nicht-Windows-Plattformen werden die Umgebungsvariablen `TMPDIR`, `TMP` und `TEMP` in der beschriebenen Reihenfolge geprüft, um das Ergebnis dieser Methode zu überschreiben. Wenn keine von ihnen gesetzt ist, wird standardmäßig `/tmp` verwendet.

Einige Betriebssystemdistributionen würden entweder `TMPDIR` (Nicht-Windows) oder `TEMP` und `TMP` (Windows) standardmäßig ohne zusätzliche Konfigurationen durch die Systemadministratoren konfigurieren. Das Ergebnis von `os.tmpdir()` spiegelt typischerweise die Systemeinstellung wider, es sei denn, sie wird explizit durch die Benutzer überschrieben.

## `os.totalmem()` {#ostotalmem}

**Hinzugefügt in: v0.3.3**

- Gibt zurück: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Gibt die Gesamtmenge des Systemspeichers in Bytes als Ganzzahl zurück.

## `os.type()` {#ostype}

**Hinzugefügt in: v0.3.3**

- Gibt zurück: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Gibt den Betriebssystemnamen zurück, wie er von [`uname(3)`](https://linux.die.net/man/3/uname) zurückgegeben wird. Zum Beispiel gibt es `'Linux'` auf Linux, `'Darwin'` auf macOS und `'Windows_NT'` auf Windows zurück.

Siehe [https://en.wikipedia.org/wiki/Uname#Examples](https://en.wikipedia.org/wiki/Uname#Examples) für weitere Informationen über die Ausgabe der Ausführung von [`uname(3)`](https://linux.die.net/man/3/uname) auf verschiedenen Betriebssystemen.

## `os.uptime()` {#osuptime}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v10.0.0 | Das Ergebnis dieser Funktion enthält unter Windows keine Nachkommastellen mehr. |
| v0.3.3 | Hinzugefügt in: v0.3.3 |
:::

- Gibt zurück: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Gibt die Systemlaufzeit in Sekunden zurück.


## `os.userInfo([options])` {#osuserinfooptions}

**Hinzugefügt in: v6.0.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Zeichenkodierung, die zum Interpretieren der resultierenden Strings verwendet wird. Wenn `encoding` auf `'buffer'` gesetzt ist, sind die Werte `username`, `shell` und `homedir` `Buffer`-Instanzen. **Standard:** `'utf8'`.


- Gibt zurück: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Gibt Informationen über den aktuell effektiven Benutzer zurück. Auf POSIX-Plattformen ist dies typischerweise eine Teilmenge der Passwortdatei. Das zurückgegebene Objekt enthält `username`, `uid`, `gid`, `shell` und `homedir`. Unter Windows sind die Felder `uid` und `gid` `-1` und `shell` ist `null`.

Der von `os.userInfo()` zurückgegebene Wert von `homedir` wird vom Betriebssystem bereitgestellt. Dies unterscheidet sich vom Ergebnis von `os.homedir()`, das Umgebungsvariablen nach dem Home-Verzeichnis abfragt, bevor es auf die Antwort des Betriebssystems zurückgreift.

Wirft einen [`SystemError`](/de/nodejs/api/errors#class-systemerror), wenn ein Benutzer keinen `username` oder `homedir` hat.

## `os.version()` {#osversion}

**Hinzugefügt in: v13.11.0, v12.17.0**

- Gibt zurück: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Gibt einen String zurück, der die Kernel-Version identifiziert.

Auf POSIX-Systemen wird die Betriebssystemversion durch Aufrufen von [`uname(3)`](https://linux.die.net/man/3/uname) ermittelt. Unter Windows wird `RtlGetVersion()` verwendet, und falls diese nicht verfügbar ist, wird `GetVersionExW()` verwendet. Weitere Informationen finden Sie unter [https://en.wikipedia.org/wiki/Uname#Examples](https://en.wikipedia.org/wiki/Uname#Examples).

## OS-Konstanten {#os-constants}

Die folgenden Konstanten werden von `os.constants` exportiert.

Nicht alle Konstanten sind auf jedem Betriebssystem verfügbar.

### Signalkonstanten {#signal-constants}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v5.11.0 | Unterstützung für `SIGINFO` hinzugefügt. |
:::

Die folgenden Signalkonstanten werden von `os.constants.signals` exportiert.

| Konstante | Beschreibung |
| --- | --- |
| `SIGHUP` | Wird gesendet, um anzuzeigen, wenn ein steuerndes Terminal geschlossen wird oder ein übergeordneter Prozess beendet wird. |
| `SIGINT` | Wird gesendet, um anzuzeigen, wenn ein Benutzer einen Prozess unterbrechen möchte (    +    ). |
| `SIGQUIT` | Wird gesendet, um anzuzeigen, wenn ein Benutzer einen Prozess beenden und einen Core-Dump durchführen möchte. |
| `SIGILL` | Wird an einen Prozess gesendet, um ihn darüber zu informieren, dass er versucht hat, eine illegale, fehlerhafte, unbekannte oder privilegierte Anweisung auszuführen. |
| `SIGTRAP` | Wird an einen Prozess gesendet, wenn eine Ausnahme aufgetreten ist. |
| `SIGABRT` | Wird an einen Prozess gesendet, um ihn aufzufordern, abzubrechen. |
| `SIGIOT` | Synonym für   `SIGABRT` |
| `SIGBUS` | Wird an einen Prozess gesendet, um ihn darüber zu informieren, dass er einen Bus-Fehler verursacht hat. |
| `SIGFPE` | Wird an einen Prozess gesendet, um ihn darüber zu informieren, dass er eine illegale arithmetische Operation durchgeführt hat. |
| `SIGKILL` | Wird an einen Prozess gesendet, um ihn sofort zu beenden. |
| `SIGUSR1`     `SIGUSR2` | Wird an einen Prozess gesendet, um benutzerdefinierte Bedingungen zu identifizieren. |
| `SIGSEGV` | Wird an einen Prozess gesendet, um ihn über eine Speichersegmentierungsverletzung zu informieren. |
| `SIGPIPE` | Wird an einen Prozess gesendet, wenn er versucht hat, in eine getrennte Pipe zu schreiben. |
| `SIGALRM` | Wird an einen Prozess gesendet, wenn ein Systemtimer abgelaufen ist. |
| `SIGTERM` | Wird an einen Prozess gesendet, um die Beendigung anzufordern. |
| `SIGCHLD` | Wird an einen Prozess gesendet, wenn ein untergeordneter Prozess beendet wird. |
| `SIGSTKFLT` | Wird an einen Prozess gesendet, um einen Stack-Fehler auf einem Coprozessor anzuzeigen. |
| `SIGCONT` | Wird gesendet, um das Betriebssystem anzuweisen, einen pausierten Prozess fortzusetzen. |
| `SIGSTOP` | Wird gesendet, um das Betriebssystem anzuweisen, einen Prozess anzuhalten. |
| `SIGTSTP` | Wird an einen Prozess gesendet, um ihn aufzufordern, zu stoppen. |
| `SIGBREAK` | Wird gesendet, um anzuzeigen, wenn ein Benutzer einen Prozess unterbrechen möchte. |
| `SIGTTIN` | Wird an einen Prozess gesendet, wenn er vom TTY liest, während er sich im Hintergrund befindet. |
| `SIGTTOU` | Wird an einen Prozess gesendet, wenn er in den TTY schreibt, während er sich im Hintergrund befindet. |
| `SIGURG` | Wird an einen Prozess gesendet, wenn ein Socket dringende Daten zum Lesen hat. |
| `SIGXCPU` | Wird an einen Prozess gesendet, wenn er sein Limit für die CPU-Nutzung überschritten hat. |
| `SIGXFSZ` | Wird an einen Prozess gesendet, wenn er eine Datei größer als das maximal zulässige Volumen erstellt. |
| `SIGVTALRM` | Wird an einen Prozess gesendet, wenn ein virtueller Timer abgelaufen ist. |
| `SIGPROF` | Wird an einen Prozess gesendet, wenn ein Systemtimer abgelaufen ist. |
| `SIGWINCH` | Wird an einen Prozess gesendet, wenn das steuernde Terminal seine Größe geändert hat. |
| `SIGIO` | Wird an einen Prozess gesendet, wenn E/A verfügbar ist. |
| `SIGPOLL` | Synonym für   `SIGIO` |
| `SIGLOST` | Wird an einen Prozess gesendet, wenn eine Dateisperre verloren gegangen ist. |
| `SIGPWR` | Wird an einen Prozess gesendet, um ihn über einen Stromausfall zu informieren. |
| `SIGINFO` | Synonym für   `SIGPWR` |
| `SIGSYS` | Wird an einen Prozess gesendet, um ihn über ein fehlerhaftes Argument zu informieren. |
| `SIGUNUSED` | Synonym für   `SIGSYS` |


### Fehlerkonstanten {#error-constants}

Die folgenden Fehlerkonstanten werden von `os.constants.errno` exportiert.

#### POSIX-Fehlerkonstanten {#posix-error-constants}

| Konstante | Beschreibung |
| --- | --- |
| `E2BIG` | Gibt an, dass die Liste der Argumente länger als erwartet ist. |
| `EACCES` | Gibt an, dass die Operation nicht über ausreichende Berechtigungen verfügt. |
| `EADDRINUSE` | Gibt an, dass die Netzwerkadresse bereits verwendet wird. |
| `EADDRNOTAVAIL` | Gibt an, dass die Netzwerkadresse derzeit nicht verfügbar ist. |
| `EAFNOSUPPORT` | Gibt an, dass die Netzwerkadressfamilie nicht unterstützt wird. |
| `EAGAIN` | Gibt an, dass keine Daten verfügbar sind und die Operation später erneut versucht werden soll. |
| `EALREADY` | Gibt an, dass der Socket bereits eine ausstehende Verbindung hat. |
| `EBADF` | Gibt an, dass ein Dateideskriptor ungültig ist. |
| `EBADMSG` | Gibt eine ungültige Datennachricht an. |
| `EBUSY` | Gibt an, dass ein Gerät oder eine Ressource ausgelastet ist. |
| `ECANCELED` | Gibt an, dass eine Operation abgebrochen wurde. |
| `ECHILD` | Gibt an, dass keine Kindprozesse vorhanden sind. |
| `ECONNABORTED` | Gibt an, dass die Netzwerkverbindung abgebrochen wurde. |
| `ECONNREFUSED` | Gibt an, dass die Netzwerkverbindung verweigert wurde. |
| `ECONNRESET` | Gibt an, dass die Netzwerkverbindung zurückgesetzt wurde. |
| `EDEADLK` | Gibt an, dass eine Ressourcensperre vermieden wurde. |
| `EDESTADDRREQ` | Gibt an, dass eine Zieladresse erforderlich ist. |
| `EDOM` | Gibt an, dass ein Argument außerhalb des Definitionsbereichs der Funktion liegt. |
| `EDQUOT` | Gibt an, dass das Festplattenkontingent überschritten wurde. |
| `EEXIST` | Gibt an, dass die Datei bereits vorhanden ist. |
| `EFAULT` | Gibt eine ungültige Zeigeradresse an. |
| `EFBIG` | Gibt an, dass die Datei zu groß ist. |
| `EHOSTUNREACH` | Gibt an, dass der Host nicht erreichbar ist. |
| `EIDRM` | Gibt an, dass der Bezeichner entfernt wurde. |
| `EILSEQ` | Gibt eine ungültige Byte-Sequenz an. |
| `EINPROGRESS` | Gibt an, dass eine Operation bereits ausgeführt wird. |
| `EINTR` | Gibt an, dass ein Funktionsaufruf unterbrochen wurde. |
| `EINVAL` | Gibt an, dass ein ungültiges Argument angegeben wurde. |
| `EIO` | Gibt einen ansonsten nicht spezifizierten I/O-Fehler an. |
| `EISCONN` | Gibt an, dass der Socket verbunden ist. |
| `EISDIR` | Gibt an, dass der Pfad ein Verzeichnis ist. |
| `ELOOP` | Gibt zu viele Ebenen symbolischer Verknüpfungen in einem Pfad an. |
| `EMFILE` | Gibt an, dass zu viele Dateien geöffnet sind. |
| `EMLINK` | Gibt an, dass zu viele Hardlinks zu einer Datei vorhanden sind. |
| `EMSGSIZE` | Gibt an, dass die bereitgestellte Nachricht zu lang ist. |
| `EMULTIHOP` | Gibt an, dass ein Multihop-Versuch unternommen wurde. |
| `ENAMETOOLONG` | Gibt an, dass der Dateiname zu lang ist. |
| `ENETDOWN` | Gibt an, dass das Netzwerk ausgefallen ist. |
| `ENETRESET` | Gibt an, dass die Verbindung vom Netzwerk abgebrochen wurde. |
| `ENETUNREACH` | Gibt an, dass das Netzwerk nicht erreichbar ist. |
| `ENFILE` | Gibt an, dass zu viele Dateien im System geöffnet sind. |
| `ENOBUFS` | Gibt an, dass kein Pufferspeicherplatz verfügbar ist. |
| `ENODATA` | Gibt an, dass keine Nachricht in der Lesewarteschlange des Stream-Kopfes verfügbar ist. |
| `ENODEV` | Gibt an, dass kein solches Gerät vorhanden ist. |
| `ENOENT` | Gibt an, dass keine solche Datei oder kein solches Verzeichnis vorhanden ist. |
| `ENOEXEC` | Gibt einen exec-Formatfehler an. |
| `ENOLCK` | Gibt an, dass keine Sperren verfügbar sind. |
| `ENOLINK` | Gibt an, dass eine Verbindung getrennt wurde. |
| `ENOMEM` | Gibt an, dass nicht genügend Speicherplatz vorhanden ist. |
| `ENOMSG` | Gibt an, dass keine Nachricht des gewünschten Typs vorhanden ist. |
| `ENOPROTOOPT` | Gibt an, dass ein bestimmtes Protokoll nicht verfügbar ist. |
| `ENOSPC` | Gibt an, dass auf dem Gerät kein Speicherplatz verfügbar ist. |
| `ENOSR` | Gibt an, dass keine Stream-Ressourcen verfügbar sind. |
| `ENOSTR` | Gibt an, dass eine bestimmte Ressource kein Stream ist. |
| `ENOSYS` | Gibt an, dass eine Funktion nicht implementiert wurde. |
| `ENOTCONN` | Gibt an, dass der Socket nicht verbunden ist. |
| `ENOTDIR` | Gibt an, dass der Pfad kein Verzeichnis ist. |
| `ENOTEMPTY` | Gibt an, dass das Verzeichnis nicht leer ist. |
| `ENOTSOCK` | Gibt an, dass das angegebene Element kein Socket ist. |
| `ENOTSUP` | Gibt an, dass eine bestimmte Operation nicht unterstützt wird. |
| `ENOTTY` | Gibt eine unangemessene I/O-Steuerungsoperation an. |
| `ENXIO` | Gibt kein solches Gerät oder keine solche Adresse an. |
| `EOPNOTSUPP` | Gibt an, dass eine Operation auf dem Socket nicht unterstützt wird. Obwohl `ENOTSUP` und `EOPNOTSUPP` unter Linux den gleichen Wert haben, sollten diese Fehlerwerte gemäß POSIX.1 unterschiedlich sein.) |
| `EOVERFLOW` | Gibt an, dass ein Wert zu groß ist, um in einem bestimmten Datentyp gespeichert zu werden. |
| `EPERM` | Gibt an, dass die Operation nicht zulässig ist. |
| `EPIPE` | Gibt eine unterbrochene Pipe an. |
| `EPROTO` | Gibt einen Protokollfehler an. |
| `EPROTONOSUPPORT` | Gibt an, dass ein Protokoll nicht unterstützt wird. |
| `EPROTOTYPE` | Gibt den falschen Protokolltyp für einen Socket an. |
| `ERANGE` | Gibt an, dass die Ergebnisse zu groß sind. |
| `EROFS` | Gibt an, dass das Dateisystem schreibgeschützt ist. |
| `ESPIPE` | Gibt eine ungültige Suchoperation an. |
| `ESRCH` | Gibt an, dass kein solcher Prozess vorhanden ist. |
| `ESTALE` | Gibt an, dass das Dateihandle veraltet ist. |
| `ETIME` | Gibt einen abgelaufenen Timer an. |
| `ETIMEDOUT` | Gibt an, dass die Verbindung eine Zeitüberschreitung hatte. |
| `ETXTBSY` | Gibt an, dass eine Textdatei ausgelastet ist. |
| `EWOULDBLOCK` | Gibt an, dass die Operation blockieren würde. |
| `EXDEV` | Gibt eine unsachgemäße Verknüpfung an. |


#### Windows-spezifische Fehlerkonstanten {#windows-specific-error-constants}

Die folgenden Fehlercodes sind spezifisch für das Windows-Betriebssystem.

| Konstante | Beschreibung |
| --- | --- |
| `WSAEINTR` | Gibt einen unterbrochenen Funktionsaufruf an. |
| `WSAEBADF` | Gibt ein ungültiges Dateihandle an. |
| `WSAEACCES` | Gibt unzureichende Berechtigungen zum Abschließen des Vorgangs an. |
| `WSAEFAULT` | Gibt eine ungültige Zeigeradresse an. |
| `WSAEINVAL` | Gibt an, dass ein ungültiges Argument übergeben wurde. |
| `WSAEMFILE` | Gibt an, dass zu viele Dateien geöffnet sind. |
| `WSAEWOULDBLOCK` | Gibt an, dass eine Ressource vorübergehend nicht verfügbar ist. |
| `WSAEINPROGRESS` | Gibt an, dass ein Vorgang gerade ausgeführt wird. |
| `WSAEALREADY` | Gibt an, dass ein Vorgang bereits ausgeführt wird. |
| `WSAENOTSOCK` | Gibt an, dass die Ressource kein Socket ist. |
| `WSAEDESTADDRREQ` | Gibt an, dass eine Zieladresse erforderlich ist. |
| `WSAEMSGSIZE` | Gibt an, dass die Nachrichtengröße zu lang ist. |
| `WSAEPROTOTYPE` | Gibt den falschen Protokolltyp für den Socket an. |
| `WSAENOPROTOOPT` | Gibt eine fehlerhafte Protokolloption an. |
| `WSAEPROTONOSUPPORT` | Gibt an, dass das Protokoll nicht unterstützt wird. |
| `WSAESOCKTNOSUPPORT` | Gibt an, dass der Sockettyp nicht unterstützt wird. |
| `WSAEOPNOTSUPP` | Gibt an, dass die Operation nicht unterstützt wird. |
| `WSAEPFNOSUPPORT` | Gibt an, dass die Protokollfamilie nicht unterstützt wird. |
| `WSAEAFNOSUPPORT` | Gibt an, dass die Adressfamilie nicht unterstützt wird. |
| `WSAEADDRINUSE` | Gibt an, dass die Netzwerkadresse bereits verwendet wird. |
| `WSAEADDRNOTAVAIL` | Gibt an, dass die Netzwerkadresse nicht verfügbar ist. |
| `WSAENETDOWN` | Gibt an, dass das Netzwerk ausgefallen ist. |
| `WSAENETUNREACH` | Gibt an, dass das Netzwerk nicht erreichbar ist. |
| `WSAENETRESET` | Gibt an, dass die Netzwerkverbindung zurückgesetzt wurde. |
| `WSAECONNABORTED` | Gibt an, dass die Verbindung abgebrochen wurde. |
| `WSAECONNRESET` | Gibt an, dass die Verbindung vom Peer zurückgesetzt wurde. |
| `WSAENOBUFS` | Gibt an, dass kein Pufferspeicher verfügbar ist. |
| `WSAEISCONN` | Gibt an, dass der Socket bereits verbunden ist. |
| `WSAENOTCONN` | Gibt an, dass der Socket nicht verbunden ist. |
| `WSAESHUTDOWN` | Gibt an, dass keine Daten gesendet werden können, nachdem der Socket heruntergefahren wurde. |
| `WSAETOOMANYREFS` | Gibt an, dass zu viele Referenzen vorhanden sind. |
| `WSAETIMEDOUT` | Gibt an, dass für die Verbindung ein Zeitlimit überschritten wurde. |
| `WSAECONNREFUSED` | Gibt an, dass die Verbindung verweigert wurde. |
| `WSAELOOP` | Gibt an, dass ein Name nicht übersetzt werden kann. |
| `WSAENAMETOOLONG` | Gibt an, dass ein Name zu lang war. |
| `WSAEHOSTDOWN` | Gibt an, dass ein Netzwerkhost ausgefallen ist. |
| `WSAEHOSTUNREACH` | Gibt an, dass es keine Route zu einem Netzwerkhost gibt. |
| `WSAENOTEMPTY` | Gibt an, dass das Verzeichnis nicht leer ist. |
| `WSAEPROCLIM` | Gibt an, dass es zu viele Prozesse gibt. |
| `WSAEUSERS` | Gibt an, dass das Benutzerkontingent überschritten wurde. |
| `WSAEDQUOT` | Gibt an, dass das Festplattenkontingent überschritten wurde. |
| `WSAESTALE` | Gibt einen veralteten Dateihandle-Verweis an. |
| `WSAEREMOTE` | Gibt an, dass das Element entfernt ist. |
| `WSASYSNOTREADY` | Gibt an, dass das Netzwerksubsystem nicht bereit ist. |
| `WSAVERNOTSUPPORTED` | Gibt an, dass die   `winsock.dll`   -Version außerhalb des gültigen Bereichs liegt. |
| `WSANOTINITIALISED` | Gibt an, dass WSAStartup noch nicht erfolgreich ausgeführt wurde. |
| `WSAEDISCON` | Gibt an, dass ein ordnungsgemäßes Herunterfahren in Bearbeitung ist. |
| `WSAENOMORE` | Gibt an, dass keine weiteren Ergebnisse vorhanden sind. |
| `WSAECANCELLED` | Gibt an, dass ein Vorgang abgebrochen wurde. |
| `WSAEINVALIDPROCTABLE` | Gibt an, dass die Prozeduraufruftabelle ungültig ist. |
| `WSAEINVALIDPROVIDER` | Gibt einen ungültigen Dienstanbieter an. |
| `WSAEPROVIDERFAILEDINIT` | Gibt an, dass die Initialisierung des Dienstanbieters fehlgeschlagen ist. |
| `WSASYSCALLFAILURE` | Gibt einen Fehler bei einem Systemaufruf an. |
| `WSASERVICE_NOT_FOUND` | Gibt an, dass ein Dienst nicht gefunden wurde. |
| `WSATYPE_NOT_FOUND` | Gibt an, dass ein Klassentyp nicht gefunden wurde. |
| `WSA_E_NO_MORE` | Gibt an, dass keine weiteren Ergebnisse vorhanden sind. |
| `WSA_E_CANCELLED` | Gibt an, dass der Aufruf abgebrochen wurde. |
| `WSAEREFUSED` | Gibt an, dass eine Datenbankabfrage verweigert wurde. |


### dlopen-Konstanten {#dlopen-constants}

Falls im Betriebssystem verfügbar, werden die folgenden Konstanten in `os.constants.dlopen` exportiert. Siehe [`dlopen(3)`](http://man7.org/linux/man-pages/man3/dlopen.3) für detaillierte Informationen.

| Konstante | Beschreibung |
|---|---|
| `RTLD_LAZY` | Führt Lazy Binding aus. Node.js setzt dieses Flag standardmäßig. |
| `RTLD_NOW` | Löst alle undefinierten Symbole in der Bibliothek auf, bevor dlopen(3) zurückkehrt. |
| `RTLD_GLOBAL` | Symbole, die von der Bibliothek definiert werden, werden für die Symbolauflösung von nachfolgend geladenen Bibliotheken verfügbar gemacht. |
| `RTLD_LOCAL` | Das Gegenteil von `RTLD_GLOBAL`. Dies ist das Standardverhalten, wenn keines der Flags angegeben ist. |
| `RTLD_DEEPBIND` | Sorge dafür, dass eine in sich geschlossene Bibliothek ihre eigenen Symbole gegenüber Symbolen aus zuvor geladenen Bibliotheken bevorzugt verwendet. |
### Prioritätskonstanten {#priority-constants}

**Hinzugefügt in: v10.10.0**

Die folgenden Prozessplanungskonstanten werden von `os.constants.priority` exportiert.

| Konstante | Beschreibung |
|---|---|
| `PRIORITY_LOW` | Die niedrigste Prozessplanungspriorität. Dies entspricht `IDLE_PRIORITY_CLASS` unter Windows und einem Nice-Wert von `19` auf allen anderen Plattformen. |
| `PRIORITY_BELOW_NORMAL` | Die Prozessplanungspriorität über `PRIORITY_LOW` und unter `PRIORITY_NORMAL`. Dies entspricht `BELOW_NORMAL_PRIORITY_CLASS` unter Windows und einem Nice-Wert von `10` auf allen anderen Plattformen. |
| `PRIORITY_NORMAL` | Die standardmäßige Prozessplanungspriorität. Dies entspricht `NORMAL_PRIORITY_CLASS` unter Windows und einem Nice-Wert von `0` auf allen anderen Plattformen. |
| `PRIORITY_ABOVE_NORMAL` | Die Prozessplanungspriorität über `PRIORITY_NORMAL` und unter `PRIORITY_HIGH`. Dies entspricht `ABOVE_NORMAL_PRIORITY_CLASS` unter Windows und einem Nice-Wert von `-7` auf allen anderen Plattformen. |
| `PRIORITY_HIGH` | Die Prozessplanungspriorität über `PRIORITY_ABOVE_NORMAL` und unter `PRIORITY_HIGHEST`. Dies entspricht `HIGH_PRIORITY_CLASS` unter Windows und einem Nice-Wert von `-14` auf allen anderen Plattformen. |
| `PRIORITY_HIGHEST` | Die höchste Prozessplanungspriorität. Dies entspricht `REALTIME_PRIORITY_CLASS` unter Windows und einem Nice-Wert von `-20` auf allen anderen Plattformen. |


### libuv-Konstanten {#libuv-constants}

| Konstante | Beschreibung |
| --- | --- |
| `UV_UDP_REUSEADDR` ||

