---
title: Documentazione del modulo Path di Node.js
description: Il modulo Path di Node.js fornisce utilità per lavorare con i percorsi di file e directory. Offre metodi per gestire e trasformare i percorsi dei file in modo indipendente dalla piattaforma, inclusa la normalizzazione, l'unione, la risoluzione e l'analisi dei percorsi.
head:
  - - meta
    - name: og:title
      content: Documentazione del modulo Path di Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Il modulo Path di Node.js fornisce utilità per lavorare con i percorsi di file e directory. Offre metodi per gestire e trasformare i percorsi dei file in modo indipendente dalla piattaforma, inclusa la normalizzazione, l'unione, la risoluzione e l'analisi dei percorsi.
  - - meta
    - name: twitter:title
      content: Documentazione del modulo Path di Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Il modulo Path di Node.js fornisce utilità per lavorare con i percorsi di file e directory. Offre metodi per gestire e trasformare i percorsi dei file in modo indipendente dalla piattaforma, inclusa la normalizzazione, l'unione, la risoluzione e l'analisi dei percorsi.
---


# Path {#path}

::: tip [Stable: 2 - Stable]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile
:::

**Codice sorgente:** [lib/path.js](https://github.com/nodejs/node/blob/v23.5.0/lib/path.js)

Il modulo `node:path` fornisce utilità per lavorare con percorsi di file e directory. È possibile accedervi utilizzando:

::: code-group
```js [CJS]
const path = require('node:path');
```

```js [ESM]
import path from 'node:path';
```
:::

## Windows vs. POSIX {#windows-vs-posix}

Il funzionamento predefinito del modulo `node:path` varia in base al sistema operativo su cui è in esecuzione un'applicazione Node.js. In particolare, quando è in esecuzione su un sistema operativo Windows, il modulo `node:path` presupporrà che vengano utilizzati percorsi in stile Windows.

Quindi l'utilizzo di `path.basename()` potrebbe produrre risultati diversi su POSIX e Windows:

Su POSIX:

```js [ESM]
path.basename('C:\\temp\\myfile.html');
// Restituisce: 'C:\\temp\\myfile.html'
```
Su Windows:

```js [ESM]
path.basename('C:\\temp\\myfile.html');
// Restituisce: 'myfile.html'
```
Per ottenere risultati coerenti quando si lavora con percorsi di file Windows su qualsiasi sistema operativo, utilizzare [`path.win32`](/it/nodejs/api/path#pathwin32):

Su POSIX e Windows:

```js [ESM]
path.win32.basename('C:\\temp\\myfile.html');
// Restituisce: 'myfile.html'
```
Per ottenere risultati coerenti quando si lavora con percorsi di file POSIX su qualsiasi sistema operativo, utilizzare [`path.posix`](/it/nodejs/api/path#pathposix):

Su POSIX e Windows:

```js [ESM]
path.posix.basename('/tmp/myfile.html');
// Restituisce: 'myfile.html'
```
Su Windows, Node.js segue il concetto di directory di lavoro per unità. Questo comportamento può essere osservato quando si utilizza un percorso di unità senza una barra rovesciata. Ad esempio, `path.resolve('C:\\')` può potenzialmente restituire un risultato diverso da `path.resolve('C:')`. Per ulteriori informazioni, vedere [questa pagina MSDN](https://docs.microsoft.com/en-us/windows/desktop/FileIO/naming-a-file#fully-qualified-vs-relative-paths).

## `path.basename(path[, suffix])` {#pathbasenamepath-suffix}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v6.0.0 | Il passaggio di un valore non stringa come argomento `path` ora genererà un errore. |
| v0.1.25 | Aggiunto in: v0.1.25 |
:::

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `suffix` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un suffisso opzionale da rimuovere
- Restituisce: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Il metodo `path.basename()` restituisce l'ultima porzione di un `path`, simile al comando Unix `basename`. I [separatori di directory](/it/nodejs/api/path#pathsep) finali vengono ignorati.

```js [ESM]
path.basename('/foo/bar/baz/asdf/quux.html');
// Restituisce: 'quux.html'

path.basename('/foo/bar/baz/asdf/quux.html', '.html');
// Restituisce: 'quux'
```
Sebbene Windows di solito tratti i nomi dei file, comprese le estensioni dei file, in modo non distinzione tra maiuscole e minuscole, questa funzione non lo fa. Ad esempio, `C:\\foo.html` e `C:\\foo.HTML` si riferiscono allo stesso file, ma `basename` tratta l'estensione come una stringa sensibile al caso:

```js [ESM]
path.win32.basename('C:\\foo.html', '.html');
// Restituisce: 'foo'

path.win32.basename('C:\\foo.HTML', '.html');
// Restituisce: 'foo.HTML'
```
Viene generato un [`TypeError`](/it/nodejs/api/errors#class-typeerror) se `path` non è una stringa o se `suffix` viene fornito e non è una stringa.


## `path.delimiter` {#pathdelimiter}

**Aggiunto in: v0.9.3**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Fornisce il delimitatore di percorso specifico della piattaforma:

- `;` per Windows
- `:` per POSIX

Ad esempio, su POSIX:

```js [ESM]
console.log(process.env.PATH);
// Stampa: '/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin'

process.env.PATH.split(path.delimiter);
// Restituisce: ['/usr/bin', '/bin', '/usr/sbin', '/sbin', '/usr/local/bin']
```
Su Windows:

```js [ESM]
console.log(process.env.PATH);
// Stampa: 'C:\Windows\system32;C:\Windows;C:\Program Files\node\'

process.env.PATH.split(path.delimiter);
// Restituisce ['C:\\Windows\\system32', 'C:\\Windows', 'C:\\Program Files\\node\\']
```
## `path.dirname(path)` {#pathdirnamepath}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v6.0.0 | Passare un valore non stringa come argomento `path` ora genererà un errore. |
| v0.1.16 | Aggiunto in: v0.1.16 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Restituisce: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Il metodo `path.dirname()` restituisce il nome della directory di un `path`, simile al comando Unix `dirname`. I separatori di directory finali vengono ignorati, vedi [`path.sep`](/it/nodejs/api/path#pathsep).

```js [ESM]
path.dirname('/foo/bar/baz/asdf/quux');
// Restituisce: '/foo/bar/baz/asdf'
```
Un [`TypeError`](/it/nodejs/api/errors#class-typeerror) viene generato se `path` non è una stringa.

## `path.extname(path)` {#pathextnamepath}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v6.0.0 | Passare un valore non stringa come argomento `path` ora genererà un errore. |
| v0.1.25 | Aggiunto in: v0.1.25 |
:::

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Restituisce: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Il metodo `path.extname()` restituisce l'estensione del `path`, dall'ultima occorrenza del carattere `.` (punto) alla fine della stringa nell'ultima porzione del `path`. Se non c'è un `.` nell'ultima porzione del `path`, o se non ci sono caratteri `.` diversi dal primo carattere del nome base del `path` (vedi `path.basename()`), viene restituita una stringa vuota.

```js [ESM]
path.extname('index.html');
// Restituisce: '.html'

path.extname('index.coffee.md');
// Restituisce: '.md'

path.extname('index.');
// Restituisce: '.'

path.extname('index');
// Restituisce: ''

path.extname('.index');
// Restituisce: ''

path.extname('.index.md');
// Restituisce: '.md'
```
Un [`TypeError`](/it/nodejs/api/errors#class-typeerror) viene generato se `path` non è una stringa.


## `path.format(pathObject)` {#pathformatpathobject}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.0.0 | Il punto verrà aggiunto se non è specificato in `ext`. |
| v0.11.15 | Aggiunto in: v0.11.15 |
:::

- `pathObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Qualsiasi oggetto JavaScript con le seguenti proprietà:
    - `dir` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `root` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `base` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `ext` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
  
 
- Restituisce: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Il metodo `path.format()` restituisce una stringa di percorso da un oggetto. Questo è l'opposto di [`path.parse()`](/it/nodejs/api/path#pathparsepath).

Quando si forniscono proprietà a `pathObject` ricordare che ci sono combinazioni in cui una proprietà ha la priorità su un'altra:

- `pathObject.root` viene ignorato se viene fornito `pathObject.dir`
- `pathObject.ext` e `pathObject.name` vengono ignorati se esiste `pathObject.base`

Ad esempio, su POSIX:

```js [ESM]
// Se vengono forniti `dir`, `root` e `base`,
// verrà restituito `${dir}${path.sep}${base}`. `root` viene ignorato.
path.format({
  root: '/ignored',
  dir: '/home/user/dir',
  base: 'file.txt',
});
// Restituisce: '/home/user/dir/file.txt'

// `root` verrà utilizzato se `dir` non è specificato.
// Se viene fornito solo `root` o `dir` è uguale a `root`, allora il
// separatore di piattaforma non verrà incluso. `ext` verrà ignorato.
path.format({
  root: '/',
  base: 'file.txt',
  ext: 'ignored',
});
// Restituisce: '/file.txt'

// Verranno utilizzati `name` + `ext` se `base` non è specificato.
path.format({
  root: '/',
  name: 'file',
  ext: '.txt',
});
// Restituisce: '/file.txt'

// Il punto verrà aggiunto se non è specificato in `ext`.
path.format({
  root: '/',
  name: 'file',
  ext: 'txt',
});
// Restituisce: '/file.txt'
```
Su Windows:

```js [ESM]
path.format({
  dir: 'C:\\path\\dir',
  base: 'file.txt',
});
// Restituisce: 'C:\\path\\dir\\file.txt'
```

## `path.matchesGlob(path, pattern)` {#pathmatchesglobpath-pattern}

**Aggiunto in: v22.5.0, v20.17.0**

::: warning [Stable: 1 - Sperimentale]
[Stable: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index) - Sperimentale
:::

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il percorso da confrontare con il glob.
- `pattern` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il glob rispetto al quale controllare il percorso.
- Restituisce: [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indica se il `path` corrisponde al `pattern`.

Il metodo `path.matchesGlob()` determina se `path` corrisponde a `pattern`.

Ad esempio:

```js [ESM]
path.matchesGlob('/foo/bar', '/foo/*'); // true
path.matchesGlob('/foo/bar*', 'foo/bird'); // false
```
Viene generato un [`TypeError`](/it/nodejs/api/errors#class-typeerror) se `path` o `pattern` non sono stringhe.

## `path.isAbsolute(path)` {#pathisabsolutepath}

**Aggiunto in: v0.11.2**

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Restituisce: [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Il metodo `path.isAbsolute()` determina se `path` è un percorso assoluto.

Se il `path` fornito è una stringa di lunghezza zero, verrà restituito `false`.

Ad esempio, su POSIX:

```js [ESM]
path.isAbsolute('/foo/bar'); // true
path.isAbsolute('/baz/..');  // true
path.isAbsolute('qux/');     // false
path.isAbsolute('.');        // false
```
Su Windows:

```js [ESM]
path.isAbsolute('//server');    // true
path.isAbsolute('\\\\server');  // true
path.isAbsolute('C:/foo/..');   // true
path.isAbsolute('C:\\foo\\..'); // true
path.isAbsolute('bar\\baz');    // false
path.isAbsolute('bar/baz');     // false
path.isAbsolute('.');           // false
```
Viene generato un [`TypeError`](/it/nodejs/api/errors#class-typeerror) se `path` non è una stringa.

## `path.join([...paths])` {#pathjoinpaths}

**Aggiunto in: v0.1.16**

- `...paths` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Una sequenza di segmenti di percorso
- Restituisce: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Il metodo `path.join()` unisce tutti i segmenti di `path` forniti utilizzando il separatore specifico della piattaforma come delimitatore, quindi normalizza il percorso risultante.

I segmenti di `path` di lunghezza zero vengono ignorati. Se la stringa del percorso unito è una stringa di lunghezza zero, verrà restituito `'.'`, che rappresenta la directory di lavoro corrente.

```js [ESM]
path.join('/foo', 'bar', 'baz/asdf', 'quux', '..');
// Restituisce: '/foo/bar/baz/asdf'

path.join('foo', {}, 'bar');
// Genera 'TypeError: Path must be a string. Received {}'
```
Viene generato un [`TypeError`](/it/nodejs/api/errors#class-typeerror) se uno qualsiasi dei segmenti di percorso non è una stringa.


## `path.normalize(path)` {#pathnormalizepath}

**Aggiunto in: v0.1.23**

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Restituisce: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Il metodo `path.normalize()` normalizza il `path` dato, risolvendo i segmenti `'..'` e `'.'`.

Quando vengono trovati più caratteri di separazione del segmento di percorso sequenziali (ad es. `/` su POSIX e `\` o `/` su Windows), vengono sostituiti da una singola istanza del separatore di segmento di percorso specifico della piattaforma (`/` su POSIX e `\` su Windows). I separatori finali vengono conservati.

Se il `path` è una stringa di lunghezza zero, viene restituito `'.'`, che rappresenta la directory di lavoro corrente.

Su POSIX, i tipi di normalizzazione applicati da questa funzione non aderiscono strettamente alla specifica POSIX. Ad esempio, questa funzione sostituirà due barre iniziali con una singola barra come se fosse un normale percorso assoluto, mentre alcuni sistemi POSIX assegnano un significato speciale ai percorsi che iniziano con esattamente due barre. Allo stesso modo, altre sostituzioni eseguite da questa funzione, come la rimozione dei segmenti `..`, potrebbero modificare il modo in cui il sistema sottostante risolve il percorso.

Ad esempio, su POSIX:

```js [ESM]
path.normalize('/foo/bar//baz/asdf/quux/..');
// Restituisce: '/foo/bar/baz/asdf'
```
Su Windows:

```js [ESM]
path.normalize('C:\\temp\\\\foo\\bar\\..\\');
// Restituisce: 'C:\\temp\\foo\\'
```
Poiché Windows riconosce più separatori di percorso, entrambi i separatori verranno sostituiti da istanze del separatore preferito di Windows (`\`):

```js [ESM]
path.win32.normalize('C:////temp\\\\/\\/\\/foo/bar');
// Restituisce: 'C:\\temp\\foo\\bar'
```
Un [`TypeError`](/it/nodejs/api/errors#class-typeerror) viene generato se `path` non è una stringa.

## `path.parse(path)` {#pathparsepath}

**Aggiunto in: v0.11.15**

- `path` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Restituisce: [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Il metodo `path.parse()` restituisce un oggetto le cui proprietà rappresentano elementi significativi del `path`. I separatori di directory finali vengono ignorati, vedi [`path.sep`](/it/nodejs/api/path#pathsep).

L'oggetto restituito avrà le seguenti proprietà:

- `dir` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `root` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `base` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `name` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `ext` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Ad esempio, su POSIX:

```js [ESM]
path.parse('/home/user/dir/file.txt');
// Restituisce:
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
(Tutti gli spazi nella riga "" devono essere ignorati. Sono puramente per la formattazione.)
```
Su Windows:

```js [ESM]
path.parse('C:\\path\\dir\\file.txt');
// Restituisce:
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
(Tutti gli spazi nella riga "" devono essere ignorati. Sono puramente per la formattazione.)
```
Un [`TypeError`](/it/nodejs/api/errors#class-typeerror) viene generato se `path` non è una stringa.


## `path.posix` {#pathposix}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v15.3.0 | Esposto come `require('path/posix')`. |
| v0.11.15 | Aggiunto in: v0.11.15 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

La proprietà `path.posix` fornisce l'accesso a implementazioni specifiche POSIX dei metodi `path`.

L'API è accessibile tramite `require('node:path').posix` o `require('node:path/posix')`.

## `path.relative(from, to)` {#pathrelativefrom-to}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v6.8.0 | Su Windows, le barre iniziali per i percorsi UNC sono ora incluse nel valore di ritorno. |
| v0.5.0 | Aggiunto in: v0.5.0 |
:::

- `from` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `to` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Restituisce: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Il metodo `path.relative()` restituisce il percorso relativo da `from` a `to` in base alla directory di lavoro corrente. Se `from` e `to` si risolvono nello stesso percorso (dopo aver chiamato `path.resolve()` su ciascuno), viene restituita una stringa di lunghezza zero.

Se viene passata una stringa di lunghezza zero come `from` o `to`, verrà utilizzata la directory di lavoro corrente al posto delle stringhe di lunghezza zero.

Ad esempio, su POSIX:

```js [ESM]
path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb');
// Restituisce: '../../impl/bbb'
```
Su Windows:

```js [ESM]
path.relative('C:\\orandea\\test\\aaa', 'C:\\orandea\\impl\\bbb');
// Restituisce: '..\\..\\impl\\bbb'
```
Viene generato un [`TypeError`](/it/nodejs/api/errors#class-typeerror) se `from` o `to` non sono una stringa.

## `path.resolve([...paths])` {#pathresolvepaths}

**Aggiunto in: v0.3.4**

- `...paths` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Una sequenza di percorsi o segmenti di percorso
- Restituisce: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Il metodo `path.resolve()` risolve una sequenza di percorsi o segmenti di percorso in un percorso assoluto.

La sequenza di percorsi fornita viene elaborata da destra a sinistra, con ogni successivo `path` anteposto finché non viene costruito un percorso assoluto. Ad esempio, data la sequenza di segmenti di percorso: `/foo`, `/bar`, `baz`, chiamando `path.resolve('/foo', '/bar', 'baz')` restituirebbe `/bar/baz` perché `'baz'` non è un percorso assoluto ma `'/bar' + '/' + 'baz'` lo è.

Se, dopo aver elaborato tutti i segmenti `path` forniti, non è stato ancora generato un percorso assoluto, viene utilizzata la directory di lavoro corrente.

Il percorso risultante è normalizzato e le barre finali vengono rimosse a meno che il percorso non venga risolto nella directory root.

I segmenti `path` di lunghezza zero vengono ignorati.

Se non vengono passati segmenti `path`, `path.resolve()` restituirà il percorso assoluto della directory di lavoro corrente.

```js [ESM]
path.resolve('/foo/bar', './baz');
// Restituisce: '/foo/bar/baz'

path.resolve('/foo/bar', '/tmp/file/');
// Restituisce: '/tmp/file'

path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif');
// Se la directory di lavoro corrente è /home/myself/node,
// questo restituisce '/home/myself/node/wwwroot/static_files/gif/image.gif'
```
Viene generato un [`TypeError`](/it/nodejs/api/errors#class-typeerror) se uno qualsiasi degli argomenti non è una stringa.


## `path.sep` {#pathsep}

**Aggiunto in: v0.7.9**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Fornisce il separatore di segmenti di percorso specifico per la piattaforma:

- `\` su Windows
- `/` su POSIX

Ad esempio, su POSIX:

```js [ESM]
'foo/bar/baz'.split(path.sep);
// Restituisce: ['foo', 'bar', 'baz']
```
Su Windows:

```js [ESM]
'foo\\bar\\baz'.split(path.sep);
// Restituisce: ['foo', 'bar', 'baz']
```
Su Windows, sia la barra (`/`) che la barra rovesciata (`\`) sono accettate come separatori di segmenti di percorso; tuttavia, i metodi `path` aggiungono solo barre rovesciate (`\`).

## `path.toNamespacedPath(path)` {#pathtonamespacedpathpath}

**Aggiunto in: v9.0.0**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Restituisce: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Solo su sistemi Windows, restituisce un [percorso con prefisso namespace](https://docs.microsoft.com/en-us/windows/desktop/FileIO/naming-a-file#namespaces) equivalente per il `path` specificato. Se `path` non è una stringa, `path` verrà restituito senza modifiche.

Questo metodo è significativo solo su sistemi Windows. Sui sistemi POSIX, il metodo non è operativo e restituisce sempre `path` senza modifiche.

## `path.win32` {#pathwin32}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v15.3.0 | Esposto come `require('path/win32')`. |
| v0.11.15 | Aggiunto in: v0.11.15 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

La proprietà `path.win32` fornisce l'accesso alle implementazioni specifiche di Windows dei metodi `path`.

L'API è accessibile tramite `require('node:path').win32` o `require('node:path/win32')`.

