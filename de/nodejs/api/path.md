---
title: Node.js Path Modul Dokumentation
description: Das Path-Modul von Node.js bietet Werkzeuge zum Arbeiten mit Datei- und Verzeichnispfaden. Es bietet Methoden zur plattformunabhängigen Handhabung und Transformation von Dateipfaden, einschließlich Pfadnormalisierung, Pfadverbindung, Pfadauflösung und Pfadanalyse.
head:
  - - meta
    - name: og:title
      content: Node.js Path Modul Dokumentation | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Das Path-Modul von Node.js bietet Werkzeuge zum Arbeiten mit Datei- und Verzeichnispfaden. Es bietet Methoden zur plattformunabhängigen Handhabung und Transformation von Dateipfaden, einschließlich Pfadnormalisierung, Pfadverbindung, Pfadauflösung und Pfadanalyse.
  - - meta
    - name: twitter:title
      content: Node.js Path Modul Dokumentation | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Das Path-Modul von Node.js bietet Werkzeuge zum Arbeiten mit Datei- und Verzeichnispfaden. Es bietet Methoden zur plattformunabhängigen Handhabung und Transformation von Dateipfaden, einschließlich Pfadnormalisierung, Pfadverbindung, Pfadauflösung und Pfadanalyse.
---


# Pfad {#path}

::: tip [Stabil: 2 - Stabil]
[Stabil: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil
:::

**Quellcode:** [lib/path.js](https://github.com/nodejs/node/blob/v23.5.0/lib/path.js)

Das Modul `node:path` bietet Hilfsfunktionen für die Arbeit mit Datei- und Verzeichnispfaden. Es kann folgendermaßen aufgerufen werden:

::: code-group
```js [CJS]
const path = require('node:path');
```

```js [ESM]
import path from 'node:path';
```
:::

## Windows vs. POSIX {#windows-vs-posix}

Das Standardverhalten des Moduls `node:path` variiert je nach dem Betriebssystem, auf dem eine Node.js-Anwendung ausgeführt wird. Insbesondere bei der Ausführung unter einem Windows-Betriebssystem geht das Modul `node:path` davon aus, dass Pfade im Windows-Stil verwendet werden.

Die Verwendung von `path.basename()` kann also unter POSIX und Windows zu unterschiedlichen Ergebnissen führen:

Unter POSIX:

```js [ESM]
path.basename('C:\\temp\\myfile.html');
// Gibt zurück: 'C:\\temp\\myfile.html'
```
Unter Windows:

```js [ESM]
path.basename('C:\\temp\\myfile.html');
// Gibt zurück: 'myfile.html'
```
Um konsistente Ergebnisse bei der Arbeit mit Windows-Dateipfaden auf jedem Betriebssystem zu erzielen, verwenden Sie [`path.win32`](/de/nodejs/api/path#pathwin32):

Unter POSIX und Windows:

```js [ESM]
path.win32.basename('C:\\temp\\myfile.html');
// Gibt zurück: 'myfile.html'
```
Um konsistente Ergebnisse bei der Arbeit mit POSIX-Dateipfaden auf jedem Betriebssystem zu erzielen, verwenden Sie [`path.posix`](/de/nodejs/api/path#pathposix):

Unter POSIX und Windows:

```js [ESM]
path.posix.basename('/tmp/myfile.html');
// Gibt zurück: 'myfile.html'
```
Unter Windows folgt Node.js dem Konzept des Arbeitsverzeichnisses pro Laufwerk. Dieses Verhalten kann beobachtet werden, wenn ein Laufwerkspfad ohne Backslash verwendet wird. Beispielsweise kann `path.resolve('C:\\')` potenziell ein anderes Ergebnis liefern als `path.resolve('C:')`. Weitere Informationen finden Sie auf [dieser MSDN-Seite](https://docs.microsoft.com/en-us/windows/desktop/FileIO/naming-a-file#fully-qualified-vs-relative-paths).

## `path.basename(path[, suffix])` {#pathbasenamepath-suffix}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v6.0.0 | Die Übergabe eines Nicht-Strings als `path`-Argument wirft jetzt einen Fehler. |
| v0.1.25 | Hinzugefügt in: v0.1.25 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `suffix` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Ein optionales Suffix zum Entfernen
- Gibt zurück: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Die Methode `path.basename()` gibt den letzten Teil eines `path` zurück, ähnlich dem Unix-Befehl `basename`. Nachfolgende [Verzeichnistrennzeichen](/de/nodejs/api/path#pathsep) werden ignoriert.

```js [ESM]
path.basename('/foo/bar/baz/asdf/quux.html');
// Gibt zurück: 'quux.html'

path.basename('/foo/bar/baz/asdf/quux.html', '.html');
// Gibt zurück: 'quux'
```
Obwohl Windows Dateinamen, einschließlich Dateierweiterungen, normalerweise ohne Beachtung der Groß-/Kleinschreibung behandelt, tut dies diese Funktion nicht. Beispielsweise beziehen sich `C:\\foo.html` und `C:\\foo.HTML` auf dieselbe Datei, aber `basename` behandelt die Erweiterung als eine Zeichenkette, bei der die Groß-/Kleinschreibung beachtet wird:

```js [ESM]
path.win32.basename('C:\\foo.html', '.html');
// Gibt zurück: 'foo'

path.win32.basename('C:\\foo.HTML', '.html');
// Gibt zurück: 'foo.HTML'
```
Ein [`TypeError`](/de/nodejs/api/errors#class-typeerror) wird ausgelöst, wenn `path` kein String ist oder wenn `suffix` angegeben ist und kein String ist.


## `path.delimiter` {#pathdelimiter}

**Hinzugefügt in: v0.9.3**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Stellt das plattformspezifische Pfadtrennzeichen bereit:

- `;` für Windows
- `:` für POSIX

Zum Beispiel auf POSIX:

```js [ESM]
console.log(process.env.PATH);
// Gibt aus: '/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin'

process.env.PATH.split(path.delimiter);
// Gibt zurück: ['/usr/bin', '/bin', '/usr/sbin', '/sbin', '/usr/local/bin']
```
Auf Windows:

```js [ESM]
console.log(process.env.PATH);
// Gibt aus: 'C:\Windows\system32;C:\Windows;C:\Program Files\node\'

process.env.PATH.split(path.delimiter);
// Gibt zurück ['C:\\Windows\\system32', 'C:\\Windows', 'C:\\Program Files\\node\\']
```
## `path.dirname(path)` {#pathdirnamepath}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v6.0.0 | Die Übergabe eines Nicht-Strings als `path`-Argument löst nun einen Fehler aus. |
| v0.1.16 | Hinzugefügt in: v0.1.16 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Gibt zurück: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Die Methode `path.dirname()` gibt den Verzeichnisnamen eines `path` zurück, ähnlich dem Unix-Befehl `dirname`. Nachfolgende Verzeichnistrennzeichen werden ignoriert, siehe [`path.sep`](/de/nodejs/api/path#pathsep).

```js [ESM]
path.dirname('/foo/bar/baz/asdf/quux');
// Gibt zurück: '/foo/bar/baz/asdf'
```
Ein [`TypeError`](/de/nodejs/api/errors#class-typeerror) wird ausgelöst, wenn `path` kein String ist.

## `path.extname(path)` {#pathextnamepath}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v6.0.0 | Die Übergabe eines Nicht-Strings als `path`-Argument löst nun einen Fehler aus. |
| v0.1.25 | Hinzugefügt in: v0.1.25 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Gibt zurück: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Die Methode `path.extname()` gibt die Dateiendung des `path` zurück, vom letzten Vorkommnis des Zeichens `.` (Punkt) bis zum Ende der Zeichenkette im letzten Teil des `path`. Wenn im letzten Teil des `path` kein `.` vorhanden ist oder wenn es keine `.`-Zeichen außer dem ersten Zeichen des Basisnamens von `path` gibt (siehe `path.basename()`), wird eine leere Zeichenkette zurückgegeben.

```js [ESM]
path.extname('index.html');
// Gibt zurück: '.html'

path.extname('index.coffee.md');
// Gibt zurück: '.md'

path.extname('index.');
// Gibt zurück: '.'

path.extname('index');
// Gibt zurück: ''

path.extname('.index');
// Gibt zurück: ''

path.extname('.index.md');
// Gibt zurück: '.md'
```
Ein [`TypeError`](/de/nodejs/api/errors#class-typeerror) wird ausgelöst, wenn `path` kein String ist.


## `path.format(pathObject)` {#pathformatpathobject}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v19.0.0 | Der Punkt wird hinzugefügt, wenn er in `ext` nicht angegeben ist. |
| v0.11.15 | Hinzugefügt in: v0.11.15 |
:::

- `pathObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Ein beliebiges JavaScript-Objekt mit den folgenden Eigenschaften:
    - `dir` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `root` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `base` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `ext` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)


- Gibt zurück: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Die Methode `path.format()` gibt eine Pfadzeichenfolge aus einem Objekt zurück. Dies ist das Gegenteil von [`path.parse()`](/de/nodejs/api/path#pathparsepath).

Wenn Sie Eigenschaften für `pathObject` bereitstellen, denken Sie daran, dass es Kombinationen gibt, bei denen eine Eigenschaft Vorrang vor einer anderen hat:

- `pathObject.root` wird ignoriert, wenn `pathObject.dir` bereitgestellt wird.
- `pathObject.ext` und `pathObject.name` werden ignoriert, wenn `pathObject.base` vorhanden ist.

Zum Beispiel auf POSIX:

```js [ESM]
// Wenn `dir`, `root` und `base` bereitgestellt werden,
// wird `${dir}${path.sep}${base}`
// zurückgegeben. `root` wird ignoriert.
path.format({
  root: '/ignored',
  dir: '/home/user/dir',
  base: 'file.txt',
});
// Gibt zurück: '/home/user/dir/file.txt'

// `root` wird verwendet, wenn `dir` nicht angegeben ist.
// Wenn nur `root` bereitgestellt wird oder `dir` gleich `root` ist, dann wird das
// Plattformtrennzeichen nicht eingefügt. `ext` wird ignoriert.
path.format({
  root: '/',
  base: 'file.txt',
  ext: 'ignored',
});
// Gibt zurück: '/file.txt'

// `name` + `ext` wird verwendet, wenn `base` nicht angegeben ist.
path.format({
  root: '/',
  name: 'file',
  ext: '.txt',
});
// Gibt zurück: '/file.txt'

// Der Punkt wird hinzugefügt, wenn er in `ext` nicht angegeben ist.
path.format({
  root: '/',
  name: 'file',
  ext: 'txt',
});
// Gibt zurück: '/file.txt'
```
Unter Windows:

```js [ESM]
path.format({
  dir: 'C:\\path\\dir',
  base: 'file.txt',
});
// Gibt zurück: 'C:\\path\\dir\\file.txt'
```

## `path.matchesGlob(path, pattern)` {#pathmatchesglobpath-pattern}

**Hinzugefügt in: v22.5.0, v20.17.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index) - Experimentell
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der Pfad, der mit dem Glob abgeglichen werden soll.
- `pattern` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Das Glob-Muster, mit dem der Pfad abgeglichen werden soll.
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Gibt an, ob der `path` mit dem `pattern` übereinstimmt oder nicht.

Die `path.matchesGlob()`-Methode bestimmt, ob `path` mit dem `pattern` übereinstimmt.

Zum Beispiel:

```js [ESM]
path.matchesGlob('/foo/bar', '/foo/*'); // true
path.matchesGlob('/foo/bar*', 'foo/bird'); // false
```
Ein [`TypeError`](/de/nodejs/api/errors#class-typeerror) wird ausgelöst, wenn `path` oder `pattern` keine Strings sind.

## `path.isAbsolute(path)` {#pathisabsolutepath}

**Hinzugefügt in: v0.11.2**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Die `path.isAbsolute()`-Methode bestimmt, ob `path` ein absoluter Pfad ist.

Wenn der gegebene `path` ein String der Länge Null ist, wird `false` zurückgegeben.

Zum Beispiel, unter POSIX:

```js [ESM]
path.isAbsolute('/foo/bar'); // true
path.isAbsolute('/baz/..');  // true
path.isAbsolute('qux/');     // false
path.isAbsolute('.');        // false
```
Unter Windows:

```js [ESM]
path.isAbsolute('//server');    // true
path.isAbsolute('\\\\server');  // true
path.isAbsolute('C:/foo/..');   // true
path.isAbsolute('C:\\foo\\..'); // true
path.isAbsolute('bar\\baz');    // false
path.isAbsolute('bar/baz');     // false
path.isAbsolute('.');           // false
```
Ein [`TypeError`](/de/nodejs/api/errors#class-typeerror) wird ausgelöst, wenn `path` kein String ist.

## `path.join([...paths])` {#pathjoinpaths}

**Hinzugefügt in: v0.1.16**

- `...paths` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Eine Sequenz von Pfadsegmenten
- Gibt zurück: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Die `path.join()`-Methode verbindet alle gegebenen `path`-Segmente miteinander, wobei das plattformspezifische Trennzeichen als Begrenzer verwendet und der resultierende Pfad normalisiert wird.

Pfadsegmente der Länge Null werden ignoriert. Wenn der verbundene Pfadstring ein String der Länge Null ist, wird `'.'` zurückgegeben, was das aktuelle Arbeitsverzeichnis darstellt.

```js [ESM]
path.join('/foo', 'bar', 'baz/asdf', 'quux', '..');
// Gibt zurück: '/foo/bar/baz/asdf'

path.join('foo', {}, 'bar');
// Wirft 'TypeError: Path must be a string. Received {}'
```
Ein [`TypeError`](/de/nodejs/api/errors#class-typeerror) wird ausgelöst, wenn eines der Pfadsegmente kein String ist.


## `path.normalize(path)` {#pathnormalizepath}

**Hinzugefügt in: v0.1.23**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Gibt zurück: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Die Methode `path.normalize()` normalisiert den angegebenen `Pfad` und löst `'..'`- und `'.'`-Segmente auf.

Wenn mehrere aufeinanderfolgende Pfadsegmenttrennzeichen gefunden werden (z. B. `/` auf POSIX und entweder `\` oder `/` auf Windows), werden diese durch eine einzelne Instanz des plattformspezifischen Pfadsegmenttrennzeichens ersetzt (`/` auf POSIX und `\` auf Windows). Nachgestellte Trennzeichen werden beibehalten.

Wenn der `Pfad` eine Zeichenfolge der Länge Null ist, wird `'.'` zurückgegeben, was das aktuelle Arbeitsverzeichnis darstellt.

Unter POSIX halten sich die von dieser Funktion angewandten Arten der Normalisierung nicht strikt an die POSIX-Spezifikation. Beispielsweise ersetzt diese Funktion zwei führende Schrägstriche durch einen einzelnen Schrägstrich, als wäre es ein regulärer absoluter Pfad, während einige POSIX-Systeme Pfaden, die mit genau zwei Schrägstrichen beginnen, eine besondere Bedeutung zumessen. In ähnlicher Weise können andere von dieser Funktion durchgeführte Ersetzungen, wie z. B. das Entfernen von `..`-Segmenten, die Art und Weise verändern, wie das zugrunde liegende System den Pfad auflöst.

Zum Beispiel auf POSIX:

```js [ESM]
path.normalize('/foo/bar//baz/asdf/quux/..');
// Gibt zurück: '/foo/bar/baz/asdf'
```
Unter Windows:

```js [ESM]
path.normalize('C:\\temp\\\\foo\\bar\\..\\');
// Gibt zurück: 'C:\\temp\\foo\\'
```
Da Windows mehrere Pfadtrennzeichen erkennt, werden beide Trennzeichen durch Instanzen des von Windows bevorzugten Trennzeichens (`\`) ersetzt:

```js [ESM]
path.win32.normalize('C:////temp\\\\/\\/\\/foo/bar');
// Gibt zurück: 'C:\\temp\\foo\\bar'
```
Ein [`TypeError`](/de/nodejs/api/errors#class-typeerror) wird geworfen, wenn `Pfad` keine Zeichenkette ist.

## `path.parse(path)` {#pathparsepath}

**Hinzugefügt in: v0.11.15**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Gibt zurück: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Die Methode `path.parse()` gibt ein Objekt zurück, dessen Eigenschaften signifikante Elemente des `Pfads` darstellen. Nachgestellte Verzeichnistrennzeichen werden ignoriert, siehe [`path.sep`](/de/nodejs/api/path#pathsep).

Das zurückgegebene Objekt hat die folgenden Eigenschaften:

- `dir` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `root` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `base` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `ext` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Zum Beispiel auf POSIX:

```js [ESM]
path.parse('/home/user/dir/file.txt');
// Gibt zurück:
// { root: '/',
//   dir: '/home/user/dir',
//   base: 'file.txt',
//   ext: '.txt',
//   name: 'file' }
```
```text [TEXT]
┌─────────────────────┬────────────┐
│          dir        │    base    │
├──────┬              ├──────┬─────┤
│ root │              │ name │ ext │
"  /    home/user/dir / file  .txt "
└──────┴──────────────┴──────┴─────┘
(Alle Leerzeichen in der "" Zeile sollten ignoriert werden. Sie dienen nur der Formatierung.)
```
Unter Windows:

```js [ESM]
path.parse('C:\\path\\dir\\file.txt');
// Gibt zurück:
// { root: 'C:\\',
//   dir: 'C:\\path\\dir',
//   base: 'file.txt',
//   ext: '.txt',
//   name: 'file' }
```
```text [TEXT]
┌─────────────────────┬────────────┐
│          dir        │    base    │
├──────┬              ├──────┬─────┤
│ root │              │ name │ ext │
" C:\      path\dir   \ file  .txt "
└──────┴──────────────┴──────┴─────┘
(Alle Leerzeichen in der "" Zeile sollten ignoriert werden. Sie dienen nur der Formatierung.)
```
Ein [`TypeError`](/de/nodejs/api/errors#class-typeerror) wird geworfen, wenn `Pfad` keine Zeichenkette ist.


## `path.posix` {#pathposix}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v15.3.0 | Als `require('path/posix')` verfügbar gemacht. |
| v0.11.15 | Hinzugefügt in: v0.11.15 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Die Eigenschaft `path.posix` bietet Zugriff auf POSIX-spezifische Implementierungen der `path`-Methoden.

Die API ist über `require('node:path').posix` oder `require('node:path/posix')` zugänglich.

## `path.relative(from, to)` {#pathrelativefrom-to}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v6.8.0 | Unter Windows sind die führenden Schrägstriche für UNC-Pfade jetzt im Rückgabewert enthalten. |
| v0.5.0 | Hinzugefügt in: v0.5.0 |
:::

- `from` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `to` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Gibt zurück: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Die Methode `path.relative()` gibt den relativen Pfad von `from` nach `to` basierend auf dem aktuellen Arbeitsverzeichnis zurück. Wenn `from` und `to` jeweils zum gleichen Pfad aufgelöst werden (nachdem `path.resolve()` für jeden aufgerufen wurde), wird eine leere Zeichenkette zurückgegeben.

Wenn eine leere Zeichenkette als `from` oder `to` übergeben wird, wird stattdessen das aktuelle Arbeitsverzeichnis anstelle der leeren Zeichenketten verwendet.

Zum Beispiel unter POSIX:

```js [ESM]
path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb');
// Gibt zurück: '../../impl/bbb'
```
Unter Windows:

```js [ESM]
path.relative('C:\\orandea\\test\\aaa', 'C:\\orandea\\impl\\bbb');
// Gibt zurück: '..\\..\\impl\\bbb'
```
Ein [`TypeError`](/de/nodejs/api/errors#class-typeerror) wird geworfen, wenn entweder `from` oder `to` keine Zeichenkette ist.

## `path.resolve([...paths])` {#pathresolvepaths}

**Hinzugefügt in: v0.3.4**

- `...paths` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Eine Sequenz von Pfaden oder Pfadsegmenten
- Gibt zurück: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Die Methode `path.resolve()` löst eine Sequenz von Pfaden oder Pfadsegmenten in einen absoluten Pfad auf.

Die gegebene Sequenz von Pfaden wird von rechts nach links verarbeitet, wobei jeder nachfolgende `path` vorangestellt wird, bis ein absoluter Pfad erstellt ist. Gegeben sei beispielsweise die Sequenz von Pfadsegmenten: `/foo`, `/bar`, `baz`. Der Aufruf von `path.resolve('/foo', '/bar', 'baz')` würde `/bar/baz` zurückgeben, da `'baz'` kein absoluter Pfad ist, aber `'/bar' + '/' + 'baz'` es ist.

Wenn nach der Verarbeitung aller gegebenen `path`-Segmente noch kein absoluter Pfad generiert wurde, wird das aktuelle Arbeitsverzeichnis verwendet.

Der resultierende Pfad wird normalisiert, und nachfolgende Schrägstriche werden entfernt, es sei denn, der Pfad wird zum Stammverzeichnis aufgelöst.

Leere `path`-Segmente werden ignoriert.

Wenn keine `path`-Segmente übergeben werden, gibt `path.resolve()` den absoluten Pfad des aktuellen Arbeitsverzeichnisses zurück.

```js [ESM]
path.resolve('/foo/bar', './baz');
// Gibt zurück: '/foo/bar/baz'

path.resolve('/foo/bar', '/tmp/file/');
// Gibt zurück: '/tmp/file'

path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif');
// Wenn das aktuelle Arbeitsverzeichnis /home/myself/node ist,
// gibt dies '/home/myself/node/wwwroot/static_files/gif/image.gif' zurück
```
Ein [`TypeError`](/de/nodejs/api/errors#class-typeerror) wird geworfen, wenn eines der Argumente keine Zeichenkette ist.


## `path.sep` {#pathsep}

**Hinzugefügt in: v0.7.9**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Stellt das plattformspezifische Pfadsegmenttrennzeichen bereit:

- `\` unter Windows
- `/` unter POSIX

Zum Beispiel unter POSIX:

```js [ESM]
'foo/bar/baz'.split(path.sep);
// Gibt zurück: ['foo', 'bar', 'baz']
```
Unter Windows:

```js [ESM]
'foo\\bar\\baz'.split(path.sep);
// Gibt zurück: ['foo', 'bar', 'baz']
```
Unter Windows werden sowohl der Schrägstrich (`/`) als auch der umgekehrte Schrägstrich (`\`) als Pfadsegmenttrennzeichen akzeptiert; die `path`-Methoden fügen jedoch nur umgekehrte Schrägstriche (`\`) hinzu.

## `path.toNamespacedPath(path)` {#pathtonamespacedpathpath}

**Hinzugefügt in: v9.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Gibt zurück: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Gibt nur auf Windows-Systemen einen äquivalenten [Namespace-präfixierten Pfad](https://docs.microsoft.com/en-us/windows/desktop/FileIO/naming-a-file#namespaces) für den gegebenen `path` zurück. Wenn `path` keine Zeichenkette ist, wird `path` ohne Änderungen zurückgegeben.

Diese Methode ist nur auf Windows-Systemen sinnvoll. Auf POSIX-Systemen ist die Methode funktionslos und gibt immer `path` ohne Änderungen zurück.

## `path.win32` {#pathwin32}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v15.3.0 | Als `require('path/win32')` verfügbar gemacht. |
| v0.11.15 | Hinzugefügt in: v0.11.15 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Die Eigenschaft `path.win32` bietet Zugriff auf Windows-spezifische Implementierungen der `path`-Methoden.

Die API ist über `require('node:path').win32` oder `require('node:path/win32')` zugänglich.

