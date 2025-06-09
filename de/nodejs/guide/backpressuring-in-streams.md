---
title: Verständnis für Rückdruck in Node.js-Streams
description: Erfahren Sie, wie Sie benutzerdefinierte Readable- und Writable-Streams in Node.js implementieren können, während Sie den Rückdruck respektieren, um einen effizienten Datenfluss sicherzustellen und häufige Fallstricke zu vermeiden.
head:
  - - meta
    - name: og:title
      content: Verständnis für Rückdruck in Node.js-Streams | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Erfahren Sie, wie Sie benutzerdefinierte Readable- und Writable-Streams in Node.js implementieren können, während Sie den Rückdruck respektieren, um einen effizienten Datenfluss sicherzustellen und häufige Fallstricke zu vermeiden.
  - - meta
    - name: twitter:title
      content: Verständnis für Rückdruck in Node.js-Streams | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Erfahren Sie, wie Sie benutzerdefinierte Readable- und Writable-Streams in Node.js implementieren können, während Sie den Rückdruck respektieren, um einen effizienten Datenfluss sicherzustellen und häufige Fallstricke zu vermeiden.
---


# Backpressure in Streams

Es gibt ein allgemeines Problem, das bei der Datenverarbeitung auftritt und als Backpressure bezeichnet wird. Es beschreibt eine Ansammlung von Daten hinter einem Puffer während der Datenübertragung. Wenn das empfangende Ende der Übertragung komplexe Operationen ausführt oder aus irgendeinem Grund langsamer ist, besteht die Tendenz, dass sich Daten von der eingehenden Quelle ansammeln, wie eine Verstopfung.

Um dieses Problem zu lösen, muss ein Delegationssystem vorhanden sein, um einen reibungslosen Datenfluss von einer Quelle zur anderen zu gewährleisten. Verschiedene Communities haben dieses Problem auf einzigartige Weise für ihre Programme gelöst. Unix-Pipes und TCP-Sockets sind gute Beispiele dafür und werden oft als Flusskontrolle bezeichnet. In Node.js sind Streams die gängige Lösung.

Ziel dieses Leitfadens ist es, genauer zu erläutern, was Backpressure ist und wie Streams dies im Node.js-Quellcode genau adressieren. Der zweite Teil des Leitfadens stellt empfohlene Best Practices vor, um sicherzustellen, dass der Code Ihrer Anwendung sicher und optimiert ist, wenn Streams implementiert werden.

Wir setzen eine gewisse Vertrautheit mit der allgemeinen Definition von `Backpressure`, `Buffer` und `EventEmitters` in Node.js sowie einige Erfahrung mit `Stream` voraus. Wenn Sie diese Dokumente noch nicht gelesen haben, ist es keine schlechte Idee, zuerst einen Blick auf die [API-Dokumentation](/de/nodejs/api/stream) zu werfen, da dies Ihr Verständnis beim Lesen dieses Leitfadens erweitern wird.

## Das Problem bei der Datenverarbeitung

In einem Computersystem werden Daten von einem Prozess zu einem anderen über Pipes, Sockets und Signale übertragen. In Node.js finden wir einen ähnlichen Mechanismus, der als `Stream` bezeichnet wird. Streams sind großartig! Sie leisten so viel für Node.js und fast jeder Teil der internen Codebasis verwendet dieses Modul. Als Entwickler werden Sie mehr als ermutigt, sie auch zu verwenden!

```javascript
const readline = require('node:readline');

const rl = readline.createInterface({
    output: process.stdout,
    input: process.stdin,
});

rl.question('Warum sollten Sie Streams verwenden? ', answer => {
    console.log(`Vielleicht ist es ${answer}, vielleicht liegt es daran, dass sie großartig sind!`);
});

rl.close();
```

Ein gutes Beispiel dafür, warum der durch Streams implementierte Backpressure-Mechanismus eine großartige Optimierung darstellt, kann durch den Vergleich der internen Systemtools aus der Stream-Implementierung von Node.js demonstriert werden.

In einem Szenario nehmen wir eine große Datei (ungefähr -9 GB) und komprimieren sie mit dem bekannten Tool `zip(1)`.

```bash
zip The.Matrix.1080p.mkv
```

Während dies einige Minuten dauern wird, können wir in einer anderen Shell ein Skript ausführen, das das Node.js-Modul `zlib` verwendet, das ein anderes Komprimierungstool, `gzip(1)`, umschließt.

```javascript
const gzip = require('node:zlib').createGzip();
const fs = require('node:fs');

const inp = fs.createReadStream('The.Matrix.1080p.mkv');
const out = fs.createWriteStream('The.Matrix.1080p.mkv.gz');

inp.pipe(gzip).pipe(out);
```

Um die Ergebnisse zu testen, versuchen Sie, jede komprimierte Datei zu öffnen. Die mit dem Tool `zip(1)` komprimierte Datei meldet, dass die Datei beschädigt ist, während die von Stream abgeschlossene Komprimierung fehlerfrei dekomprimiert wird.

::: tip Hinweis
In diesem Beispiel verwenden wir `.pipe()`, um die Datenquelle von einem Ende zum anderen zu bringen. Beachten Sie jedoch, dass keine geeigneten Fehlerbehandlungsroutinen angehängt sind. Wenn ein Datenblock nicht ordnungsgemäß empfangen werden kann, wird die Readable-Quelle oder der `gzip`-Stream nicht zerstört. `pump` ist ein Hilfsprogramm, das alle Streams in einer Pipeline ordnungsgemäß zerstört, wenn einer von ihnen fehlschlägt oder geschlossen wird, und ist in diesem Fall ein Muss!
:::

`pump` ist nur für Node.js 8.x oder früher erforderlich, da für Node.js 10.x oder spätere Versionen `pipeline` eingeführt wurde, um `pump` zu ersetzen. Dies ist eine Modulmethode, um zwischen Streams zu pipen, Fehler weiterzuleiten, ordnungsgemäß aufzuräumen und einen Callback bereitzustellen, wenn die Pipeline abgeschlossen ist.

Hier ist ein Beispiel für die Verwendung von Pipeline:

```javascript
const { pipeline } = require('node:stream');
const fs = require('node:fs');
const zlib = require('node:zlib');
// Verwenden Sie die Pipeline-API, um auf einfache Weise eine Reihe von Streams
// miteinander zu verbinden und benachrichtigt zu werden, wenn die Pipeline vollständig abgeschlossen ist.
// Eine Pipeline zum effizienten Gzippen einer potenziell riesigen Videodatei:
pipeline(
  fs.createReadStream('The.Matrix.1080p.mkv'),
  zlib.createGzip(),
  fs.createWriteStream('The.Matrix.1080p.mkv.gz'),
  err => {
    if (err) {
      console.error('Pipeline failed', err);
    } else {
      console.log('Pipeline succeeded');
    }
  }
);
```

Sie können auch das Modul `stream/promises` verwenden, um Pipeline mit `async / await` zu verwenden:

```javascript
const { pipeline } = require('node:stream/promises');
const fs = require('node:fs');
const zlib = require('node:zlib');
async function run() {
  try {
    await pipeline(
      fs.createReadStream('The.Matrix.1080p.mkv'),
      zlib.createGzip(),
      fs.createWriteStream('The.Matrix.1080p.mkv.gz')
    );
    console.log('Pipeline succeeded');
  } catch (err) {
    console.error('Pipeline failed', err);
  }
}
```

## Zu viele Daten, zu schnell

Es gibt Fälle, in denen ein `Readable`-Stream Daten viel zu schnell an den `Writable`-Stream weitergibt - viel mehr, als der Konsument verarbeiten kann!

In diesem Fall beginnt der Konsument, alle Datenchunks für den späteren Verbrauch zu puffern. Die Schreibwarteschlange wird immer länger, und aus diesem Grund müssen mehr Daten im Speicher gehalten werden, bis der gesamte Prozess abgeschlossen ist.

Das Schreiben auf eine Festplatte ist viel langsamer als das Lesen von einer Festplatte. Wenn wir also versuchen, eine Datei zu komprimieren und auf unsere Festplatte zu schreiben, entsteht ein Rückstau, da die Schreibfestplatte nicht mit der Geschwindigkeit des Lesens mithalten kann.

```javascript
// Insgeheim sagt der Stream: "whoa, whoa! Halt, das ist viel zu viel!"
// Daten beginnen sich auf der Leseseite des Datenpuffers anzusammeln, während
// write' versucht, mit dem eingehenden Datenstrom Schritt zu halten.
inp.pipe(gzip).pipe(outputFile);
```

Aus diesem Grund ist ein Backpressure-Mechanismus wichtig. Wenn kein Backpressure-System vorhanden wäre, würde der Prozess den Speicher Ihres Systems aufbrauchen, was andere Prozesse effektiv verlangsamen und einen großen Teil Ihres Systems bis zum Abschluss monopolisieren würde.

Dies führt zu einigen Dingen:
- Verlangsamung aller anderen laufenden Prozesse
- Ein sehr überlasteter Garbage Collector
- Speichererschöpfung

In den folgenden Beispielen werden wir den Rückgabewert der Funktion `.write()` entfernen und ihn in `true` ändern, wodurch die Backpressure-Unterstützung im Node.js-Kern effektiv deaktiviert wird. In jeder Bezugnahme auf die `'modifizierte'` Binärdatei sprechen wir von der Ausführung der Node-Binärdatei ohne die Zeile `return ret;`, sondern mit dem ersetzten `return true;`.

## Übermäßiger Widerstand bei der Garbage Collection

Werfen wir einen Blick auf einen kurzen Benchmark. Am gleichen Beispiel wie oben haben wir einige Zeitmessungen durchgeführt, um eine mittlere Zeit für beide Binärdateien zu erhalten.

```bash
   trial (#)  | `node` binary (ms) | modified `node` binary (ms)
=================================================================
      1       |      56924         |           55011
      2       |      52686         |           55869
      3       |      59479         |           54043
      4       |      54473         |           55229
      5       |      52933         |           59723
=================================================================
average time: |      55299         |           55975
```

Beide benötigen etwa eine Minute für die Ausführung, es gibt also keinen großen Unterschied. Lassen Sie uns jedoch genauer hinsehen, um zu bestätigen, ob unsere Vermutungen richtig sind. Wir verwenden das Linux-Tool `dtrace`, um zu beurteilen, was mit dem V8-Garbage Collector passiert.

Die gemessene Zeit des GC (Garbage Collector) gibt die Intervalle eines vollen Zyklus einer einzelnen Bereinigung durch den Garbage Collector an:

```bash
approx. time (ms) | GC (ms) | modified GC (ms)
=================================================
          0       |    0    |      0
          1       |    0    |      0
         40       |    0    |      2
        170       |    3    |      1
        300       |    3    |      1
         *             *           *
         *             *           *
         *             *           *
      39000       |    6    |     26
      42000       |    6    |     21
      47000       |    5    |     32
      50000       |    8    |     28
      54000       |    6    |     35
```

Während die beiden Prozesse gleich starten und der GC scheinbar mit der gleichen Rate arbeitet, wird deutlich, dass er nach einigen Sekunden mit einem funktionierenden Backpressure-System die GC-Last über konsistente Intervalle von 4-8 Millisekunden bis zum Ende der Datenübertragung verteilt.

Wenn jedoch kein Backpressure-System vorhanden ist, beginnt sich die V8-Garbage Collection zu verzögern. Die normale Binärdatei ruft den GC etwa 75 Mal pro Minute auf, während die modifizierte Binärdatei ihn nur 36 Mal aufruft.

Dies ist die langsame und allmähliche Verschuldung, die sich aus dem wachsenden Speicherverbrauch ergibt. Während Daten übertragen werden, wird ohne ein Backpressure-System mehr Speicher für jede Chunk-Übertragung verwendet.

Je mehr Speicher zugewiesen wird, desto mehr muss der GC in einem einzigen Durchlauf verarbeiten. Je größer der Durchlauf, desto mehr muss der GC entscheiden, was freigegeben werden kann, und das Scannen nach getrennten Zeigern in einem größeren Speicherbereich verbraucht mehr Rechenleistung.


## Speichererschöpfung

Um den Speicherverbrauch jeder Binärdatei zu bestimmen, haben wir jeden Prozess einzeln mit `/usr/bin/time -lp sudo ./node ./backpressure-example/zlib.js` getaktet.

Dies ist die Ausgabe der normalen Binärdatei:

```bash
Die Rückgabewert von .write() wird beachtet
=============================================
real        58.88
user        56.79
sys          8.79
  87810048  maximale Resident Set Size
         0  durchschnittliche Größe des gemeinsam genutzten Speichers
         0  durchschnittliche Größe ungeteilter Daten
         0  durchschnittliche Größe des ungeteilten Stacks
     19427  Page Reclaims
      3134  Page Faults
         0  Swaps
         5  Block-Eingabeoperationen
       194  Block-Ausgabeoperationen
         0  gesendete Nachrichten
         0  empfangene Nachrichten
         1  empfangene Signale
        12  freiwillige Kontextwechsel
    666037  unfreiwillige Kontextwechsel
```

Die maximale Byte-Größe, die vom virtuellen Speicher belegt wird, beträgt ungefähr 87,81 MB.

Und jetzt ändern wir den Rückgabewert der Funktion `.write()`:

```bash
Ohne Beachtung des Rückgabewerts von .write():
==================================================
real        54.48
user        53.15
sys          7.43
1524965376  maximale Resident Set Size
         0  durchschnittliche Größe des gemeinsam genutzten Speichers
         0  durchschnittliche Größe ungeteilter Daten
         0  durchschnittliche Größe des ungeteilten Stacks
    373617  Page Reclaims
      3139  Page Faults
         0  Swaps
        18  Block-Eingabeoperationen
       199  Block-Ausgabeoperationen
         0  gesendete Nachrichten
         0  empfangene Nachrichten
         1  empfangene Signale
        25  freiwillige Kontextwechsel
    629566  unfreiwillige Kontextwechsel
```

Die maximale Byte-Größe, die vom virtuellen Speicher belegt wird, beträgt ungefähr 1,52 GB.

Ohne vorhandene Streams zur Delegierung des Gegendrucks wird eine Größenordnung mehr Speicherplatz zugewiesen - ein enormer Unterschied zwischen demselben Prozess!

Dieses Experiment zeigt, wie optimiert und kosteneffizient der Gegendruckmechanismus von Node.js für Ihr Computersystem ist. Lassen Sie uns nun eine Aufschlüsselung der Funktionsweise vornehmen!


## Wie löst Backpressure diese Probleme?

Es gibt verschiedene Funktionen, um Daten von einem Prozess zu einem anderen zu übertragen. In Node.js gibt es eine interne, eingebaute Funktion namens `.pipe()`. Es gibt auch andere Pakete, die Sie verwenden können! Letztendlich haben wir aber auf der grundlegendsten Ebene dieses Prozesses zwei separate Komponenten: die Datenquelle und den Konsumenten.

Wenn `.pipe()` von der Quelle aufgerufen wird, signalisiert es dem Konsumenten, dass Daten übertragen werden sollen. Die Pipe-Funktion hilft, die geeigneten Backpressure-Closures für die Ereignisauslöser einzurichten.

In Node.js ist die Quelle ein `Readable`-Stream und der Konsument ein `Writable`-Stream (beide können mit einem Duplex- oder einem Transform-Stream ausgetauscht werden, aber das geht über den Rahmen dieses Leitfadens hinaus).

Der Moment, in dem Backpressure ausgelöst wird, kann genau auf den Rückgabewert der `.write()`-Funktion eines `Writable` eingegrenzt werden. Dieser Rückgabewert wird natürlich durch einige Bedingungen bestimmt.

In jedem Szenario, in dem der Datenpuffer das `highwaterMark` überschritten hat oder die Schreibwarteschlange gerade ausgelastet ist, `return false` `.write()`.

Wenn ein `false`-Wert zurückgegeben wird, springt das Backpressure-System an. Es pausiert den eingehenden `Readable`-Stream, um keine Daten zu senden, und wartet, bis der Konsument wieder bereit ist. Sobald der Datenpuffer geleert ist, wird ein `'drain'`-Ereignis ausgelöst und der eingehende Datenfluss wird fortgesetzt.

Sobald die Warteschlange abgearbeitet ist, ermöglicht Backpressure wieder das Senden von Daten. Der Speicherplatz, der verwendet wurde, wird freigegeben und bereitet sich auf den nächsten Datenstapel vor.

Dies ermöglicht effektiv, dass zu jedem Zeitpunkt eine feste Menge an Speicher für eine `.pipe()`-Funktion verwendet wird. Es gibt keine Speicherlecks, keine unendliche Pufferung und der Garbage Collector muss sich nur mit einem Speicherbereich befassen!

Wenn Backpressure also so wichtig ist, warum haben Sie (wahrscheinlich) noch nichts davon gehört? Die Antwort ist einfach: Node.js erledigt das alles automatisch für Sie.

Das ist toll! Aber auch nicht so toll, wenn wir versuchen zu verstehen, wie wir unsere eigenen Streams implementieren können.

::: info NOTE
Auf den meisten Rechnern gibt es eine Byte-Größe, die bestimmt, wann ein Puffer voll ist (was je nach Rechner variiert). Node.js erlaubt es Ihnen, Ihr eigenes `highWaterMark` festzulegen, aber üblicherweise ist der Standard auf 16kb (16384 oder 16 für objectMode-Streams) eingestellt. In Fällen, in denen Sie diesen Wert erhöhen möchten, tun Sie dies, aber mit Vorsicht!
:::


## Lebenszyklus von `.pipe()`

Um ein besseres Verständnis von Gegendruck zu erlangen, hier ein Flussdiagramm zum Lebenszyklus eines `Readable`-Streams, der in einen `Writable`-Stream [gepiped](/de/nodejs/api/stream) wird:

```bash
                                                     +===================+
                         x-->  Piping-Funktionen  +-->   src.pipe(dest)  |
                         x     werden während         |===================|
                         x     der .pipe-Methode      |  Event-Callbacks  |
  +===============+      x     eingerichtet.          |-------------------|
  |   Ihre Daten   |      x                           | .on('close', cb)  |
  +=======+=======+      x     Sie existieren außerhalb| .on('data', cb)   |
          |              x     des Datenflusses, aber  | .on('drain', cb)  |
          |              x     wichtig ist, dass sie   | .on('unpipe', cb) |
+---------v---------+    x     Events und deren       | .on('error', cb)  |
|  Readable Stream  +----+     jeweilige Callbacks    | .on('finish', cb) |
+-^-------^-------^-+    |     anhängen.              | .on('end', cb)    |
  ^       |       ^      |                           +-------------------+
  |       |       |      |
  |       ^       |      |
  ^       ^       ^      |    +-------------------+         +=================+
  ^       |       ^      +---->  Writable Stream  +--------->  .write(chunk)  |
  |       |       |           +-------------------+         +=======+=========+
  |       |       |                                                 |
  |       ^       |                              +------------------v---------+
  ^       |       +-> if (!chunk)                | Ist dieser Chunk zu groß? |
  ^       |       |     emit .end();             | Ist die Warteschlange beschäftigt?      |
  |       |       +-> else                       +-------+----------------+---+
  |       ^       |     emit .write();                   |                |
  |       ^       ^                                   +--v---+        +---v---+
  |       |       ^-----------------------------------<  Nein |        |  Ja   |
  ^       |                                           +------+        +---v---+
  ^       |                                                               |
  |       ^               emit .pause();          +=================+     |
  |       ^---------------^-----------------------+  return false;  <-----+---+
  |                                               +=================+         |
  |                                                                           |
  ^            wenn Warteschlange leer  +============+                         |
  ^------------^-----------------------<  Pufferung  |                         |
               |                       |============|                         |
               +> emit .drain();       |  ^Buffer^  |                         |
               +> emit .resume();      +------------+                         |
                                       |  ^Buffer^  |                         |
                                       +------------+   Chunk zur Warteschlange hinzufügen  |
                                       |            <---^---------------------<
                                       +============+
```

::: tip NOTE
Wenn Sie eine Pipeline einrichten, um ein paar Streams zu verketten, um Ihre Daten zu bearbeiten, werden Sie höchstwahrscheinlich einen Transform-Stream implementieren.
:::

In diesem Fall gelangt Ihre Ausgabe aus Ihrem `Readable`-Stream in den `Transform` und wird in den `Writable` gepiped.

```javascript
Readable.pipe(Transformable).pipe(Writable);
```

Gegendruck wird automatisch angewendet, aber beachten Sie, dass sowohl die eingehende als auch die ausgehende `highwaterMark` des `Transform`-Streams manipuliert werden können und das Gegendrucksystem beeinflussen.


## Backpressure-Richtlinien

Seit Node.js v0.10 bietet die Stream-Klasse die Möglichkeit, das Verhalten von `.read()` oder `.write()` mithilfe der Underscore-Version dieser jeweiligen Funktionen (`._read()` und `._write()`) zu ändern.

Es gibt dokumentierte Richtlinien für die Implementierung von Readable Streams und die Implementierung von Writable Streams. Wir gehen davon aus, dass Sie diese gelesen haben, und der nächste Abschnitt wird etwas detaillierter darauf eingehen.

## Regeln, die bei der Implementierung von benutzerdefinierten Streams zu beachten sind

Die goldene Regel für Streams ist, immer Backpressure zu respektieren. Was als Best Practice gilt, ist eine nicht widersprüchliche Praxis. Solange Sie darauf achten, Verhaltensweisen zu vermeiden, die mit der internen Backpressure-Unterstützung in Konflikt stehen, können Sie sicher sein, dass Sie eine gute Praxis befolgen.

Im Allgemeinen gilt:

1. Niemals `.push()` verwenden, wenn Sie nicht dazu aufgefordert werden.
2. Niemals `.write()` aufrufen, nachdem es false zurückgegeben hat, sondern stattdessen auf 'drain' warten.
3. Streams ändern sich zwischen verschiedenen Node.js-Versionen und der von Ihnen verwendeten Bibliothek. Seien Sie vorsichtig und testen Sie die Dinge.

::: tip NOTE
In Bezug auf Punkt 3 ist ein unglaublich nützliches Paket für die Erstellung von Browser-Streams `readable-stream`. Rodd Vagg hat einen [großartigen Blog-Beitrag](https://r.va.gg/2014/06/why-i-dont-use-nodes-core-stream-module.html) geschrieben, der den Nutzen dieser Bibliothek beschreibt. Kurz gesagt, sie bietet eine Art automatisierte, sanfte Verschlechterung für Readable Streams und unterstützt ältere Versionen von Browsern und Node.js.
:::

## Spezifische Regeln für Readable Streams

Bisher haben wir uns angesehen, wie sich `.write()` auf Backpressure auswirkt, und uns stark auf den Writable Stream konzentriert. Aufgrund der Funktionalität von Node.js fließt Daten technisch gesehen Downstream von Readable zu Writable. Wie wir jedoch bei jeder Übertragung von Daten, Materie oder Energie beobachten können, ist die Quelle genauso wichtig wie das Ziel, und der Readable Stream ist entscheidend für die Handhabung von Backpressure.

Beide Prozesse sind aufeinander angewiesen, um effektiv zu kommunizieren. Wenn der Readable ignoriert, wenn der Writable Stream ihn auffordert, das Senden von Daten einzustellen, kann dies genauso problematisch sein wie wenn der Rückgabewert von `.write()` falsch ist.

Neben der Beachtung des Rückgabewerts von `.write()` müssen wir auch den Rückgabewert von `.push()` beachten, der in der `._read()`-Methode verwendet wird. Wenn `.push()` einen falschen Wert zurückgibt, stoppt der Stream das Lesen aus der Quelle. Andernfalls wird er ohne Pause fortgesetzt.

Hier ist ein Beispiel für eine schlechte Praxis bei der Verwendung von `.push()`:
```javascript
// Dies ist problematisch, da der Rückgabewert von push vollständig ignoriert wird,
// was ein Signal für Backpressure vom Ziel-Stream sein kann!
class MyReadable extends Readable {
  _read(size) {
    let chunk;
    while (null == (chunk = getNextChunk())) {
      this.push(chunk);
    }
  }
}
```

Darüber hinaus gibt es von außerhalb des benutzerdefinierten Streams Fallstricke, wenn Backpressure ignoriert wird. In diesem Gegenbeispiel für eine gute Praxis erzwingt der Code der Anwendung die Datenübertragung, sobald sie verfügbar sind (signalisiert durch das `'data'`-Ereignis):

```javascript
// Dies ignoriert die von Node.js eingerichteten Backpressure-Mechanismen
// und drückt Daten bedingungslos durch, unabhängig davon, ob der
// Ziel-Stream bereit dafür ist oder nicht.
readable.on('data', data => writable.write(data));
```

Hier ist ein Beispiel für die Verwendung von `.push()` mit einem Readable Stream.

```javascript
const { Readable } = require('node:stream');

// Erstellen Sie einen benutzerdefinierten Readable Stream
const myReadableStream = new Readable({
  objectMode: true,
  read(size) {
    // Schieben Sie einige Daten in den Stream
    this.push({ message: 'Hello, world!' });
    this.push(null); // Markieren Sie das Ende des Streams
  },
});

// Konsumieren Sie den Stream
myReadableStream.on('data', chunk => {
  console.log(chunk);
});

// Ausgabe:
// { message: 'Hello, world!' }
```

## Regeln speziell für Writable Streams

Erinnern wir uns, dass ein `.write()` abhängig von bestimmten Bedingungen true oder false zurückgeben kann. Zum Glück für uns handhabt die Stream-Zustandsmaschine unsere Callbacks, wenn wir unseren eigenen Writable Stream erstellen, und bestimmt, wann Gegendruck behandelt und der Datenfluss für uns optimiert werden soll. Wenn wir jedoch einen Writable direkt verwenden möchten, müssen wir den Rückgabewert von `.write()` beachten und auf diese Bedingungen achten:
- Wenn die Schreibwarteschlange belegt ist, gibt `.write()` false zurück.
- Wenn der Datenblock zu groß ist, gibt `.write()` false zurück (die Grenze wird durch die Variable highWaterMark angegeben).

In diesem Beispiel erstellen wir einen benutzerdefinierten Readable Stream, der mit `.push()` ein einzelnes Objekt in den Stream schiebt. Die Methode `._read()` wird aufgerufen, wenn der Stream bereit ist, Daten zu verarbeiten, und in diesem Fall schieben wir sofort einige Daten in den Stream und markieren das Ende des Streams, indem wir `null` schieben.
```javascript
const stream = require('stream');

class MyReadable extends stream.Readable {
  constructor() {
    super();
  }

  _read() {
    const data = { message: 'Hello, world!' };
    this.push(data);
    this.push(null);
  }
}

const readableStream = new MyReadable();

readableStream.pipe(process.stdout);
```
Wir verarbeiten dann den Stream, indem wir auf das Ereignis 'data' lauschen und jeden Datenblock protokollieren, der in den Stream geschoben wird. In diesem Fall schieben wir nur einen einzigen Datenblock in den Stream, sodass wir nur eine Protokollnachricht sehen.

## Regeln speziell für Writable Streams

Erinnern wir uns, dass ein `.write()` abhängig von bestimmten Bedingungen true oder false zurückgeben kann. Zum Glück für uns handhabt die Stream-Zustandsmaschine unsere Callbacks, wenn wir unseren eigenen Writable Stream erstellen, und bestimmt, wann Gegendruck behandelt und der Datenfluss für uns optimiert werden soll.

Wenn wir jedoch einen Writable direkt verwenden möchten, müssen wir den Rückgabewert von `.write()` beachten und auf diese Bedingungen achten:
- Wenn die Schreibwarteschlange belegt ist, gibt `.write()` false zurück.
- Wenn der Datenblock zu groß ist, gibt `.write()` false zurück (die Grenze wird durch die Variable highWaterMark angegeben).

```javascript
class MyWritable extends Writable {
  // Dieser Writable ist aufgrund der asynchronen Natur von JavaScript-Callbacks ungültig.
  // Ohne eine return-Anweisung für jeden Callback vor dem letzten,
  // besteht eine große Chance, dass mehrere Callbacks aufgerufen werden.
  write(chunk, encoding, callback) {
    if (chunk.toString().indexOf('a') >= 0) callback();
    else if (chunk.toString().indexOf('b') >= 0) callback();
    callback();
  }
}
```

Es gibt auch einige Dinge, auf die man bei der Implementierung von `._writev()` achten sollte. Die Funktion ist mit `.cork()` gekoppelt, aber es gibt einen häufigen Fehler beim Schreiben:

```javascript
// Die zweimalige Verwendung von .uncork() führt hier zu zwei Aufrufen auf der C++-Ebene, wodurch die
// Kork-/Entkorktechnik unbrauchbar wird.
ws.cork();
ws.write('hello ');
ws.write('world ');
ws.uncork();

ws.cork();
ws.write('from ');
ws.write('Matteo');
ws.uncork();

// Die korrekte Art, dies zu schreiben, ist die Verwendung von process.nextTick(), das
// im nächsten Event Loop ausgelöst wird.
ws.cork();
ws.write('hello ');
ws.write('world ');
process.nextTick(doUncork, ws);

ws.cork();
ws.write('from ');
ws.write('Matteo');
process.nextTick(doUncork, ws);

// Als globale Funktion.
function doUncork(stream) {
  stream.uncork();
}
```

`.cork()` kann beliebig oft aufgerufen werden, wir müssen nur darauf achten, `.uncork()` genauso oft aufzurufen, damit der Fluss wiederhergestellt wird.


## Fazit

Streams sind ein häufig verwendetes Modul in Node.js. Sie sind wichtig für die interne Struktur und für Entwickler, um sich im gesamten Node.js-Modul-Ökosystem zu erweitern und zu vernetzen.

Hoffentlich können Sie nun Ihre eigenen `Writable`- und `Readable`-Streams unter Berücksichtigung des Gegendrucks beheben und sicher programmieren und Ihr Wissen mit Kollegen und Freunden teilen.

Lesen Sie unbedingt mehr über `Stream` für andere API-Funktionen, um Ihre Streaming-Fähigkeiten beim Erstellen einer Anwendung mit Node.js zu verbessern und zu entfesseln.

