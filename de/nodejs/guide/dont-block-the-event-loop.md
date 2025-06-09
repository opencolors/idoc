---
title: Blockieren Sie nicht die Ereignisschleife (oder den Arbeitspool)
description: Wie man einen Hochleistungs-Webserver schreibt, der DoS-Angriffen besser widerstehen kann, indem man die Ereignisschleife und den Arbeitspool in Node.js nicht blockiert.
head:
  - - meta
    - name: og:title
      content: Blockieren Sie nicht die Ereignisschleife (oder den Arbeitspool) | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Wie man einen Hochleistungs-Webserver schreibt, der DoS-Angriffen besser widerstehen kann, indem man die Ereignisschleife und den Arbeitspool in Node.js nicht blockiert.
  - - meta
    - name: twitter:title
      content: Blockieren Sie nicht die Ereignisschleife (oder den Arbeitspool) | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Wie man einen Hochleistungs-Webserver schreibt, der DoS-Angriffen besser widerstehen kann, indem man die Ereignisschleife und den Arbeitspool in Node.js nicht blockiert.
---


# Blockiere nicht die Event Loop (oder den Worker Pool)

## Solltest du diese Anleitung lesen?

Wenn du etwas Komplizierteres als ein kurzes Kommandozeilen-Skript schreibst, sollte dir das Lesen dieser Anleitung helfen, leistungsstärkere und sicherere Anwendungen zu schreiben.

Dieses Dokument ist mit Blick auf Node.js-Server geschrieben, aber die Konzepte gelten auch für komplexe Node.js-Anwendungen. Wo sich OS-spezifische Details unterscheiden, ist dieses Dokument Linux-zentriert.

## Zusammenfassung

Node.js führt JavaScript-Code in der Event Loop aus (Initialisierung und Callbacks) und bietet einen Worker Pool zur Bearbeitung aufwändiger Aufgaben wie Datei-I/O. Node.js skaliert gut, manchmal besser als schwergewichtigere Ansätze wie Apache. Das Geheimnis der Skalierbarkeit von Node.js besteht darin, dass es eine kleine Anzahl von Threads verwendet, um viele Clients zu bedienen. Wenn Node.js mit weniger Threads auskommt, kann es mehr Zeit und Speicher deines Systems darauf verwenden, an Clients zu arbeiten, anstatt Speicher- und Zeitoverhead für Threads zu bezahlen (Speicher, Kontextwechsel). Da Node.js aber nur wenige Threads hat, musst du deine Anwendung so strukturieren, dass du sie weise einsetzt.

Hier ist eine gute Faustregel, um deinen Node.js-Server schnell zu halten: *Node.js ist schnell, wenn die Arbeit, die zu einem bestimmten Zeitpunkt mit jedem Client verbunden ist, "gering" ist.*

Dies gilt für Callbacks in der Event Loop und Aufgaben im Worker Pool.

## Warum sollte ich es vermeiden, die Event Loop und den Worker Pool zu blockieren?

Node.js verwendet eine kleine Anzahl von Threads, um viele Clients zu bedienen. In Node.js gibt es zwei Arten von Threads: eine Event Loop (auch bekannt als Hauptschleife, Hauptthread, Ereignis-Thread usw.) und einen Pool von `k` Workers in einem Worker Pool (auch bekannt als Threadpool).

Wenn ein Thread lange braucht, um einen Callback (Event Loop) oder eine Aufgabe (Worker) auszuführen, nennen wir ihn "blockiert". Während ein Thread blockiert ist und im Auftrag eines Clients arbeitet, kann er keine Anfragen von anderen Clients bearbeiten. Dies liefert zwei Gründe, warum weder die Event Loop noch der Worker Pool blockiert werden sollten:

1. Leistung: Wenn du regelmäßig ressourcenintensive Aktivitäten in einem der beiden Threadtypen durchführst, leidet der *Durchsatz* (Anfragen/Sekunde) deines Servers.
2. Sicherheit: Wenn es möglich ist, dass einer deiner Threads bei bestimmten Eingaben blockiert, könnte ein bösartiger Client diese "böse Eingabe" übermitteln, deine Threads blockieren und sie daran hindern, an anderen Clients zu arbeiten. Dies wäre ein [Denial-of-Service-Angriff](https://en.wikipedia.org/wiki/Denial-of-service_attack).


## Eine kurze Übersicht über Node

Node.js verwendet die Event-Driven-Architektur: Es verfügt über eine Event-Loop für die Orchestrierung und einen Worker-Pool für rechenintensive Aufgaben.

### Welcher Code wird in der Event-Loop ausgeführt?

Beim Start durchlaufen Node.js-Anwendungen zunächst eine Initialisierungsphase, in der Module mit `require` geladen und Callbacks für Ereignisse registriert werden. Anschließend treten Node.js-Anwendungen in die Event-Loop ein und reagieren auf eingehende Client-Anfragen, indem sie den entsprechenden Callback ausführen. Dieser Callback wird synchron ausgeführt und kann asynchrone Anfragen registrieren, um die Verarbeitung nach Abschluss fortzusetzen. Die Callbacks für diese asynchronen Anfragen werden ebenfalls in der Event-Loop ausgeführt.

Die Event-Loop erfüllt auch die nicht-blockierenden asynchronen Anfragen, die von ihren Callbacks gestellt werden, z. B. Netzwerk-I/O.

Zusammenfassend lässt sich sagen, dass die Event-Loop die für Ereignisse registrierten JavaScript-Callbacks ausführt und auch für die Erfüllung nicht-blockierender asynchroner Anfragen wie Netzwerk-I/O verantwortlich ist.

### Welcher Code wird im Worker-Pool ausgeführt?

Der Worker-Pool von Node.js ist in libuv implementiert ([Dokumentation](http://docs.libuv.org/en/v1.x/threadpool.html)), das eine allgemeine API zur Aufgabenübermittlung bereitstellt.

Node.js verwendet den Worker-Pool, um "rechenintensive" Aufgaben zu verarbeiten. Dazu gehören I/O, für die ein Betriebssystem keine nicht-blockierende Version bereitstellt, sowie besonders CPU-intensive Aufgaben.

Dies sind die Node.js-Modul-APIs, die diesen Worker-Pool verwenden:

1. I/O-intensiv
    1. [DNS](/de/nodejs/api/dns): `dns.lookup()`, `dns.lookupService()`.
    2. [Dateisystem](/de/nodejs/api/fs): Alle Dateisystem-APIs außer `fs.FSWatcher()` und diejenigen, die explizit synchron sind, verwenden den Threadpool von libuv.
2. CPU-intensiv
    1. [Crypto](/de/nodejs/api/crypto): `crypto.pbkdf2()`, `crypto.scrypt()`, `crypto.randomBytes()`, `crypto.randomFill()`, `crypto.generateKeyPair()`.
    2. [Zlib](/de/nodejs/api/zlib): Alle Zlib-APIs außer diejenigen, die explizit synchron sind, verwenden den Threadpool von libuv.

In vielen Node.js-Anwendungen sind diese APIs die einzigen Quellen für Aufgaben für den Worker-Pool. Anwendungen und Module, die ein [C++-Add-on](/de/nodejs/api/addons) verwenden, können andere Aufgaben an den Worker-Pool senden.

Der Vollständigkeit halber sei angemerkt, dass die Event-Loop beim Aufruf einer dieser APIs von einem Callback in der Event-Loop geringfügige Setup-Kosten verursacht, wenn sie die Node.js C++-Bindings für diese API aufruft und eine Aufgabe an den Worker-Pool sendet. Diese Kosten sind im Vergleich zu den Gesamtkosten der Aufgabe vernachlässigbar, weshalb die Event-Loop sie auslagert. Beim Übermitteln einer dieser Aufgaben an den Worker-Pool stellt Node.js einen Zeiger auf die entsprechende C++-Funktion in den Node.js C++-Bindings bereit.


### Wie entscheidet Node.js, welcher Code als Nächstes ausgeführt wird?

Abstrakt gesehen verwalten die Event Loop und der Worker Pool jeweils Warteschlangen für ausstehende Ereignisse und ausstehende Aufgaben.

In Wahrheit verwaltet die Event Loop keine tatsächliche Warteschlange. Stattdessen verfügt sie über eine Sammlung von Dateideskriptoren, die sie das Betriebssystem überwachen lässt, wobei ein Mechanismus wie [epoll](http://man7.org/linux/man-pages/man7/epoll.7.html) (Linux), [kqueue](https://developer.apple.com/library/content/documentation/Darwin/Conceptual/FSEvents_ProgGuide/KernelQueues/KernelQueues.html) (OSX), Event-Ports (Solaris) oder [IOCP](https://msdn.microsoft.com/en-us/library/windows/desktop/aa365198.aspx) (Windows) verwendet wird. Diese Dateideskriptoren entsprechen Netzwerk-Sockets, allen Dateien, die sie überwacht, und so weiter. Wenn das Betriebssystem sagt, dass einer dieser Dateideskriptoren bereit ist, übersetzt die Event Loop ihn in das entsprechende Ereignis und ruft die mit diesem Ereignis verbundenen Callback(s) auf. Sie können mehr über diesen Prozess [hier](https://www.youtube.com/watch?v=P9csgxBgaZ8) erfahren.

Im Gegensatz dazu verwendet der Worker Pool eine echte Warteschlange, deren Einträge Aufgaben sind, die bearbeitet werden müssen. Ein Worker entnimmt eine Aufgabe aus dieser Warteschlange und bearbeitet sie. Nach Abschluss löst der Worker ein Ereignis "Mindestens eine Aufgabe ist abgeschlossen" für die Event Loop aus.

### Was bedeutet das für das Anwendungsdesign?
In einem System mit einem Thread pro Client wie Apache wird jedem ausstehenden Client ein eigener Thread zugewiesen. Wenn ein Thread, der einen Client bearbeitet, blockiert, unterbricht das Betriebssystem ihn und gibt einem anderen Client die Möglichkeit. Das Betriebssystem stellt somit sicher, dass Clients, die nur wenig Arbeit benötigen, nicht durch Clients benachteiligt werden, die mehr Arbeit benötigen.

Da Node.js viele Clients mit wenigen Threads bearbeitet, kann es vorkommen, dass ausstehende Client-Anfragen keine Möglichkeit erhalten, bis der Thread seinen Callback oder seine Aufgabe beendet hat, wenn ein Thread bei der Bearbeitung der Anfrage eines Clients blockiert. Die faire Behandlung von Clients liegt somit in der Verantwortung Ihrer Anwendung. Das bedeutet, dass Sie in keinem einzelnen Callback oder keiner einzelnen Aufgabe zu viel Arbeit für einen Client erledigen sollten.

Dies ist ein Grund dafür, dass Node.js gut skalieren kann, aber es bedeutet auch, dass Sie für eine faire Planung verantwortlich sind. In den nächsten Abschnitten wird erläutert, wie Sie eine faire Planung für die Event Loop und den Worker Pool sicherstellen können.


## Blockieren Sie nicht die Event Loop
Die Event Loop bemerkt jede neue Client-Verbindung und orchestriert die Erzeugung einer Antwort. Alle eingehenden Anfragen und ausgehenden Antworten laufen über die Event Loop. Das bedeutet, dass wenn die Event Loop zu lange an irgendeinem Punkt verbringt, alle aktuellen und neuen Clients keine Chance bekommen.

Sie sollten sicherstellen, dass Sie die Event Loop niemals blockieren. Mit anderen Worten, jeder Ihrer JavaScript-Callbacks sollte schnell abgeschlossen sein. Dies gilt natürlich auch für Ihre `await`'s, Ihre `Promise.then`'s und so weiter.

Ein guter Weg, um dies sicherzustellen, ist, über die ["Rechenkomplexität"](https://en.wikipedia.org/wiki/Time_complexity) Ihrer Callbacks nachzudenken. Wenn Ihr Callback eine konstante Anzahl von Schritten benötigt, egal welche Argumente er hat, dann geben Sie jedem ausstehenden Client immer eine faire Chance. Wenn Ihr Callback je nach seinen Argumenten eine unterschiedliche Anzahl von Schritten benötigt, dann sollten Sie darüber nachdenken, wie lang die Argumente sein könnten.

Beispiel 1: Ein Callback mit konstanter Zeit.

```js
app.get('/constant-time', (req, res) => {
  res.sendStatus(200);
});
```

Beispiel 2: Ein `O(n)` Callback. Dieser Callback wird für kleine `n` schnell und für große `n` langsamer ausgeführt.

```js
app.get('/countToN', (req, res) => {
  let n = req.query.n;
  // n Iterationen, bevor jemand anderes an der Reihe ist
  for (let i = 0; i < n; i++) {
    console.log(`Iter ${i}`);
  }
  res.sendStatus(200);
});
```
Beispiel 3: Ein `O(n^2)` Callback. Dieser Callback wird für kleine `n` immer noch schnell ausgeführt, aber für große `n` wird er viel langsamer ausgeführt als das vorherige `O(n)` Beispiel.

```js
app.get('/countToN2', (req, res) => {
  let n = req.query.n;
  // n^2 Iterationen, bevor jemand anderes an der Reihe ist
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      console.log(`Iter ${i}.${j}`);
    }
  }
  res.sendStatus(200);
});
```

### Wie vorsichtig sollten Sie sein?
Node.js verwendet die Google V8 Engine für JavaScript, die für viele gängige Operationen recht schnell ist. Ausnahmen von dieser Regel sind Regexps und JSON-Operationen, die unten besprochen werden.

Für komplexe Aufgaben sollten Sie jedoch in Erwägung ziehen, die Eingabe zu begrenzen und Eingaben, die zu lang sind, abzulehnen. Auf diese Weise stellen Sie sicher, dass der Callback, selbst wenn er eine große Komplexität aufweist, nicht mehr als die Worst-Case-Zeit für die längste akzeptable Eingabe benötigt, indem Sie die Eingabe begrenzen. Sie können dann die Worst-Case-Kosten dieses Callbacks bewerten und feststellen, ob seine Laufzeit in Ihrem Kontext akzeptabel ist.


## Blockierung der Event Loop: REDOS

Eine häufige Möglichkeit, die Event Loop auf katastrophale Weise zu blockieren, ist die Verwendung eines "anfälligen" [regulären Ausdrucks](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions).

### Vermeidung anfälliger regulärer Ausdrücke
Ein regulärer Ausdruck (Regexp) gleicht eine Eingabezeichenkette mit einem Muster ab. Normalerweise gehen wir davon aus, dass ein Regexp-Abgleich einen einzigen Durchlauf durch die Eingabezeichenkette erfordert `--- O(n)` Zeit, wobei `n` die Länge der Eingabezeichenkette ist. In vielen Fällen ist ein einziger Durchlauf tatsächlich alles, was es braucht. Leider kann der Regexp-Abgleich in einigen Fällen eine exponentielle Anzahl von Durchläufen durch die Eingabezeichenkette erfordern `--- O(2^n)` Zeit. Eine exponentielle Anzahl von Durchläufen bedeutet, dass, wenn die Engine x Durchläufe benötigt, um eine Übereinstimmung zu ermitteln, sie `2*x` Durchläufe benötigt, wenn wir der Eingabezeichenkette nur ein weiteres Zeichen hinzufügen. Da die Anzahl der Durchläufe in linearem Verhältnis zur benötigten Zeit steht, besteht die Auswirkung dieser Auswertung darin, die Event Loop zu blockieren.

Ein *anfälliger regulärer Ausdruck* ist ein solcher, bei dem Ihre Regexp-Engine möglicherweise exponentielle Zeit benötigt, wodurch Sie [REDOS](https://owasp.org/www-community/attacks/Regular_expression_Denial_of_Service_-_ReDoS) auf "böser Eingabe" ausgesetzt sind. Ob Ihr reguläres Ausdrucksmuster anfällig ist oder nicht (d. h. die Regexp-Engine möglicherweise exponentielle Zeit dafür benötigt), ist in der Tat eine schwer zu beantwortende Frage und variiert je nachdem, ob Sie Perl, Python, Ruby, Java, JavaScript usw. verwenden, aber hier sind einige Faustregeln, die für alle diese Sprachen gelten:

1. Vermeiden Sie verschachtelte Quantifizierer wie `(a+)*`. Die Regexp-Engine von V8 kann einige davon schnell verarbeiten, aber andere sind anfällig.
2. Vermeiden Sie ODER-Verknüpfungen mit überlappenden Klauseln, wie `(a|a)*`. Auch diese sind manchmal schnell.
3. Vermeiden Sie die Verwendung von Rückbezügen, wie `(a.*) \1`. Keine Regexp-Engine kann garantieren, diese in linearer Zeit auszuwerten.
4. Wenn Sie einen einfachen String-Abgleich durchführen, verwenden Sie `indexOf` oder das lokale Äquivalent. Dies ist kostengünstiger und benötigt nie mehr als `O(n)`.

Wenn Sie sich nicht sicher sind, ob Ihr regulärer Ausdruck anfällig ist, denken Sie daran, dass Node.js im Allgemeinen keine Probleme hat, eine Übereinstimmung auch für einen anfälligen regulären Ausdruck und eine lange Eingabezeichenkette zu melden. Das exponentielle Verhalten wird ausgelöst, wenn es eine Nichtübereinstimmung gibt, Node.js sich aber erst sicher sein kann, wenn es viele Pfade durch die Eingabezeichenkette ausprobiert hat.


### Ein REDOS-Beispiel

Hier ist ein Beispiel für einen anfälligen regulären Ausdruck, der seinen Server REDOS aussetzt:

```js
app.get('/redos-me', (req, res) => {
  let filePath = req.query.filePath;
  // REDOS
  if (filePath.match(/(\/.+)+$/)) {
    console.log('valid path');
  } else {
    console.log('invalid path');
  }
  res.sendStatus(200);
});
```

Der anfällige reguläre Ausdruck in diesem Beispiel ist eine (schlechte!) Möglichkeit, einen gültigen Pfad unter Linux zu überprüfen. Er findet Übereinstimmungen mit Zeichenketten, die eine Sequenz von durch "/" getrennten Namen sind, wie "`/a/b/c`". Er ist gefährlich, weil er gegen Regel 1 verstößt: Er hat einen doppelt verschachtelten Quantifizierer.

Wenn ein Client eine Abfrage mit filePath `///.../\n` (100 /'s gefolgt von einem Zeilenumbruchzeichen, das der "." des regulären Ausdrucks nicht findet) durchführt, dann wird die Event Loop effektiv ewig dauern und die Event Loop blockieren. Der REDOS-Angriff dieses Clients führt dazu, dass alle anderen Clients erst dann an die Reihe kommen, wenn die Übereinstimmung des regulären Ausdrucks abgeschlossen ist.

Aus diesem Grund sollten Sie komplexe reguläre Ausdrücke zur Validierung von Benutzereingaben mit Vorsicht verwenden.

### Anti-REDOS-Ressourcen
Es gibt einige Tools, um Ihre regulären Ausdrücke auf Sicherheit zu überprüfen, wie z. B.

- [safe-regex](https://github.com/davisjam/safe-regex)
- [rxxr2](https://github.com/superhuman/rxxr2)

Allerdings fangen diese nicht alle anfälligen regulären Ausdrücke ab.

Ein anderer Ansatz ist die Verwendung einer anderen Regexp-Engine. Sie könnten das Modul [node-re2](https://github.com/uhop/node-re2) verwenden, das Googles blitzschnelle [RE2](https://github.com/google/re2) Regexp-Engine verwendet. Aber Vorsicht, RE2 ist nicht zu 100 % mit den Regexps von V8 kompatibel, also prüfen Sie auf Regressionen, wenn Sie das node-re2-Modul austauschen, um Ihre Regexps zu verarbeiten. Und besonders komplizierte Regexps werden von node-re2 nicht unterstützt.

Wenn Sie versuchen, etwas "Offensichtliches" abzugleichen, wie z. B. eine URL oder einen Dateipfad, suchen Sie ein Beispiel in einer [Regexp-Bibliothek](http://www.regexlib.com/) oder verwenden Sie ein npm-Modul, z. B. [ip-regex](https://www.npmjs.com/package/ip-regex).

### Blockierung der Event Loop: Node.js-Kernmodule

Mehrere Node.js-Kernmodule verfügen über synchrone, rechenintensive APIs, darunter:

- [Verschlüsselung](/de/nodejs/api/crypto)
- [Komprimierung](/de/nodejs/api/zlib)
- [Dateisystem](/de/nodejs/api/fs)
- [Kindprozess](/de/nodejs/api/child_process)

Diese APIs sind rechenintensiv, da sie erhebliche Berechnungen (Verschlüsselung, Komprimierung) beinhalten, E/A (Datei-E/A) erfordern oder potenziell beides (Kindprozess). Diese APIs sind für die Scripting-Bequemlichkeit gedacht, aber nicht für die Verwendung im Serverkontext. Wenn Sie sie auf der Event Loop ausführen, dauert es viel länger, bis sie abgeschlossen sind, als eine typische JavaScript-Anweisung, wodurch die Event Loop blockiert wird.

In einem Server sollten Sie die folgenden synchronen APIs aus diesen Modulen nicht verwenden:

- Verschlüsselung:
    - `crypto.randomBytes` (synchrone Version)
    - `crypto.randomFillSync`
    - `crypto.pbkdf2Sync`
    - Sie sollten auch vorsichtig sein, wenn Sie große Eingaben für die Verschlüsselungs- und Entschlüsselungsroutinen bereitstellen.
- Komprimierung:
    - `zlib.inflateSync`
    - `zlib.deflateSync`
- Dateisystem:
    - Verwenden Sie nicht die synchronen Dateisystem-APIs. Wenn sich die Datei, auf die Sie zugreifen, beispielsweise in einem [verteilten Dateisystem](https://en.wikipedia.org/wiki/Clustered_file_system#Distributed_file_systems) wie [NFS](https://en.wikipedia.org/wiki/Network_File_System) befindet, können die Zugriffszeiten stark variieren.
- Kindprozess:
    - `child_process.spawnSync`
    - `child_process.execSync`
    - `child_process.execFileSync`

Diese Liste ist mit Stand Node.js v9 einigermaßen vollständig.


## Blockierung der Event-Loop: JSON DOS

`JSON.parse` und `JSON.stringify` sind weitere potenziell kostspielige Operationen. Obwohl diese O(n) in der Länge der Eingabe sind, können sie für große n überraschend lange dauern.

Wenn Ihr Server JSON-Objekte manipuliert, insbesondere solche von einem Client, sollten Sie vorsichtig sein, wie groß die Objekte oder Zeichenketten sind, mit denen Sie in der Event-Loop arbeiten.

Beispiel: JSON-Blockierung. Wir erstellen ein Objekt `obj` der Größe 2^21 und wenden `JSON.stringify` darauf an, führen indexOf auf der Zeichenkette aus und dann `JSON.parse`. Die mit `JSON.stringify` erstellte Zeichenkette ist 50MB groß. Es dauert 0,7 Sekunden, um das Objekt zu stringifizieren, 0,03 Sekunden, um indexOf auf der 50MB großen Zeichenkette auszuführen, und 1,3 Sekunden, um die Zeichenkette zu parsen.

```js
let obj = { a: 1 };
let niter = 20;
let before, str, pos, res, took;
for (let i = 0; i < niter; i++) {
  obj = { obj1: obj, obj2: obj }; // Verdoppelt die Größe in jeder Iteration
}
before = process.hrtime();
str = JSON.stringify(obj);
took = process.hrtime(before);
console.log('JSON.stringify dauerte ' + took);
before = process.hrtime();
pos = str.indexOf('nomatch');
took = process.hrtime(before);
console.log('Pure indexof dauerte ' + took);
before = process.hrtime();
res = JSON.parse(str);
took = process.hrtime(before);
console.log('JSON.parse dauerte ' + took);
```

Es gibt npm-Module, die asynchrone JSON-APIs anbieten. Siehe zum Beispiel:

- [JSONStream](https://www.npmjs.com/package/JSONStream), das Stream-APIs hat.
- [Big-Friendly JSON](https://www.npmjs.com/package/bfj), das sowohl Stream-APIs als auch asynchrone Versionen der Standard-JSON-APIs mit dem unten beschriebenen Partitionierungs-auf-der-Event-Loop-Paradigma bietet.

## Komplexe Berechnungen ohne Blockierung der Event-Loop

Angenommen, Sie möchten komplexe Berechnungen in JavaScript durchführen, ohne die Event-Loop zu blockieren. Sie haben zwei Möglichkeiten: Partitionierung oder Auslagerung.

### Partitionierung

Sie können Ihre Berechnungen *partitionieren*, so dass jede in der Event-Loop ausgeführt wird, aber regelmäßig andere ausstehende Ereignisse abgibt (an diese übergibt). In JavaScript ist es einfach, den Zustand einer laufenden Aufgabe in einer Closure zu speichern, wie in Beispiel 2 unten gezeigt.

Nehmen wir als einfaches Beispiel an, Sie möchten den Durchschnitt der Zahlen von `1` bis `n` berechnen.

Beispiel 1: Unpartitionierter Durchschnitt, Kosten `O(n)`

```js
for (let i = 0; i < n; i++) sum += i;
let avg = sum / n;
console.log('avg: ' + avg);
```

Beispiel 2: Partitionierter Durchschnitt, jeder der `n` asynchronen Schritte kostet `O(1)`.

```js
function asyncAvg(n, avgCB) {
  // Speichere die laufende Summe in einer JS Closure.
  let sum = 0;
  function help(i, cb) {
    sum += i;
    if (i == n) {
      cb(sum);
      return;
    }
    // "Asynchrone Rekursion".
    // Plane die nächste Operation asynchron.
    setImmediate(help.bind(null, i + 1, cb));
  }
  // Starte den Helfer, mit CB zum Aufrufen von avgCB.
  help(1, function (sum) {
    let avg = sum / n;
    avgCB(avg);
  });
}
asyncAvg(n, function (avg) {
  console.log('avg of 1-n: ' + avg);
});
```

Sie können dieses Prinzip auf Array-Iterationen und so weiter anwenden.


### Auslagerung

Wenn Sie etwas Komplexeres tun müssen, ist Partitionierung keine gute Option. Das liegt daran, dass Partitionierung nur den Event Loop verwendet und Sie nicht von mehreren Kernen profitieren, die auf Ihrem Rechner mit ziemlicher Sicherheit verfügbar sind. **Denken Sie daran, dass der Event Loop Client-Anfragen orchestrieren sollte, nicht sie selbst erfüllen.** Für eine komplizierte Aufgabe verlagern Sie die Arbeit vom Event Loop auf einen Worker Pool.

#### Wie man auslagert

Sie haben zwei Optionen für einen Ziel-Worker-Pool, an den Sie Arbeit auslagern können.

1. Sie können den eingebauten Node.js Worker Pool verwenden, indem Sie ein [C++-Addon](/de/nodejs/api/addons) entwickeln. Bei älteren Versionen von Node erstellen Sie Ihr [C++-Addon](/de/nodejs/api/addons) mit [NAN](https://github.com/nodejs/nan), und bei neueren Versionen verwenden Sie [N-API](/de/nodejs/api/n-api). [node-webworker-threads](https://www.npmjs.com/package/webworker-threads) bietet eine reine JavaScript-Möglichkeit, auf den Node.js Worker Pool zuzugreifen.
2. Sie können Ihren eigenen Worker Pool erstellen und verwalten, der der Berechnung gewidmet ist und nicht dem I/O-orientierten Node.js Worker Pool. Der einfachste Weg, dies zu tun, ist die Verwendung von [Child Process](/de/nodejs/api/child_process) oder [Cluster](/de/nodejs/api/cluster).

Sie sollten nicht einfach für jeden Client einen [Child Process](/de/nodejs/api/child_process) erstellen. Sie können Client-Anfragen schneller empfangen, als Sie Kinder erstellen und verwalten können, und Ihr Server könnte zu einer [Fork-Bombe](https://en.wikipedia.org/wiki/Fork_bomb) werden.

Nachteil der Auslagerung
Der Nachteil des Auslagerungsansatzes ist, dass er Overhead in Form von Kommunikationskosten verursacht. Nur der Event Loop darf den "Namespace" (JavaScript-Zustand) Ihrer Anwendung sehen. Von einem Worker aus können Sie kein JavaScript-Objekt im Namespace des Event Loops manipulieren. Stattdessen müssen Sie alle Objekte, die Sie teilen möchten, serialisieren und deserialisieren. Dann kann der Worker mit seiner eigenen Kopie dieser Objekte arbeiten und das modifizierte Objekt (oder einen "Patch") an den Event Loop zurückgeben.

Bezüglich Serialisierungsbedenken siehe den Abschnitt über JSON DOS.

#### Einige Vorschläge zur Auslagerung

Sie sollten zwischen CPU-intensiven und I/O-intensiven Aufgaben unterscheiden, da sie deutlich unterschiedliche Eigenschaften haben.

Eine CPU-intensive Aufgabe macht nur dann Fortschritte, wenn ihr Worker eingeplant ist, und der Worker muss auf einem der [logischen Kerne](/de/nodejs/api/os) Ihres Rechners eingeplant werden. Wenn Sie 4 logische Kerne und 5 Worker haben, kann einer dieser Worker keine Fortschritte machen. Infolgedessen zahlen Sie Overhead (Speicher- und Planungskosten) für diesen Worker und erhalten keine Gegenleistung dafür.

I/O-intensive Aufgaben beinhalten das Abfragen eines externen Dienstanbieters (DNS, Dateisystem usw.) und das Warten auf dessen Antwort. Während ein Worker mit einer I/O-intensiven Aufgabe auf seine Antwort wartet, hat er nichts anderes zu tun und kann vom Betriebssystem descheduled werden, wodurch ein anderer Worker die Möglichkeit erhält, seine Anfrage zu stellen. Somit machen I/O-intensive Aufgaben Fortschritte, auch wenn der zugehörige Thread nicht läuft. Externe Dienstanbieter wie Datenbanken und Dateisysteme wurden stark optimiert, um viele ausstehende Anfragen gleichzeitig zu bearbeiten. Beispielsweise untersucht ein Dateisystem eine große Menge ausstehender Schreib- und Leseanfragen, um widersprüchliche Aktualisierungen zusammenzuführen und Dateien in einer optimalen Reihenfolge abzurufen.

Wenn Sie sich nur auf einen Worker Pool verlassen, z. B. den Node.js Worker Pool, können die unterschiedlichen Eigenschaften von CPU-gebundener und I/O-gebundener Arbeit die Leistung Ihrer Anwendung beeinträchtigen.

Aus diesem Grund sollten Sie einen separaten Computation Worker Pool verwalten.


### Auslagern: Schlussfolgerungen

Für einfache Aufgaben, wie das Durchlaufen der Elemente eines beliebig langen Arrays, kann Partitionierung eine gute Option sein. Wenn Ihre Berechnung komplexer ist, ist das Auslagern ein besserer Ansatz: Die Kommunikationskosten, d. h. der Overhead des Übertragens serialisierter Objekte zwischen der Event Loop und dem Worker Pool, werden durch den Vorteil der Nutzung mehrerer Kerne ausgeglichen.

Wenn Ihr Server jedoch stark auf komplexen Berechnungen beruht, sollten Sie darüber nachdenken, ob Node.js wirklich gut geeignet ist. Node.js zeichnet sich durch I/O-gebundene Arbeit aus, aber für aufwendige Berechnungen ist es möglicherweise nicht die beste Option.

Wenn Sie den Ansatz des Auslagerns wählen, lesen Sie den Abschnitt über das Nicht-Blockieren des Worker Pools.

### Den Worker Pool nicht blockieren
Node.js verfügt über einen Worker Pool, der aus k Workern besteht. Wenn Sie das oben beschriebene Auslagerungs-Paradigma verwenden, haben Sie möglicherweise einen separaten Computational Worker Pool, für den die gleichen Prinzipien gelten. Nehmen wir in beiden Fällen an, dass k viel kleiner ist als die Anzahl der Clients, die Sie möglicherweise gleichzeitig bedienen. Dies entspricht der "ein Thread für viele Clients"-Philosophie von Node.js, dem Geheimnis seiner Skalierbarkeit.

Wie oben beschrieben, schließt jeder Worker seine aktuelle Aufgabe ab, bevor er zur nächsten in der Worker Pool-Warteschlange übergeht.

Nun wird es Unterschiede in den Kosten der Aufgaben geben, die zur Bearbeitung der Anfragen Ihrer Clients erforderlich sind. Einige Aufgaben können schnell erledigt werden (z. B. das Lesen kurzer oder zwischengespeicherter Dateien oder das Erzeugen einer kleinen Anzahl von Zufallsbytes), und andere dauern länger (z. B. das Lesen größerer oder nicht zwischengespeicherter Dateien oder das Erzeugen von mehr Zufallsbytes). Ihr Ziel sollte es sein, die Variationen der Aufgabenzeiten zu minimieren, und Sie sollten die Aufgabenpartitionierung verwenden, um dies zu erreichen.

#### Minimierung der Variation der Aufgabenzeiten

Wenn die aktuelle Aufgabe eines Workers viel aufwendiger ist als andere Aufgaben, steht er nicht für die Bearbeitung anderer ausstehender Aufgaben zur Verfügung. Mit anderen Worten, jede relativ lange Aufgabe verringert die Größe des Worker Pools effektiv um eins, bis sie abgeschlossen ist. Dies ist unerwünscht, da bis zu einem gewissen Punkt gilt: Je mehr Worker sich im Worker Pool befinden, desto höher ist der Durchsatz des Worker Pools (Aufgaben/Sekunde) und somit desto höher ist der Durchsatz des Servers (Client-Anfragen/Sekunde). Ein Client mit einer relativ aufwendigen Aufgabe verringert den Durchsatz des Worker Pools, was wiederum den Durchsatz des Servers verringert.

Um dies zu vermeiden, sollten Sie versuchen, die Variation in der Länge der Aufgaben, die Sie an den Worker Pool übermitteln, zu minimieren. Während es angemessen ist, die externen Systeme, auf die Ihre I/O-Anfragen zugreifen (DB, FS usw.), als Black Boxes zu behandeln, sollten Sie sich der relativen Kosten dieser I/O-Anfragen bewusst sein und Anfragen vermeiden, von denen Sie erwarten, dass sie besonders lange dauern.

Zwei Beispiele sollen die möglichen Variationen der Aufgabenzeiten veranschaulichen.


#### Variationsbeispiel: Lang andauernde Dateisystemleseoperationen

Angenommen, Ihr Server muss Dateien lesen, um Clientanfragen zu bearbeiten. Nach der Konsultation der Node.js [Dateisystem](/de/nodejs/api/fs)-APIs haben Sie sich aus Gründen der Einfachheit für `fs.readFile()` entschieden. `fs.readFile()` ist jedoch (derzeit) nicht partitioniert: Es übermittelt eine einzelne `fs.read()`-Aufgabe, die die gesamte Datei umfasst. Wenn Sie für einige Benutzer kürzere und für andere längere Dateien lesen, kann `fs.readFile()` zu erheblichen Schwankungen in der Länge der Aufgaben führen, was den Durchsatz des Worker-Pools beeinträchtigt.

Für ein Worst-Case-Szenario nehmen wir an, dass ein Angreifer Ihren Server dazu bringen kann, eine beliebige Datei zu lesen (dies ist eine [Directory-Traversal-Schwachstelle](https://www.owasp.org/index.php/Path_Traversal)). Wenn Ihr Server unter Linux läuft, kann der Angreifer eine extrem langsame Datei angeben: `/dev/random`. Praktisch gesehen ist `/dev/random` unendlich langsam, und jeder Worker, der aufgefordert wird, von `/dev/random` zu lesen, wird diese Aufgabe nie beenden. Ein Angreifer sendet dann k Anfragen, eine für jeden Worker, und keine anderen Clientanfragen, die den Worker-Pool verwenden, kommen voran.

#### Variationsbeispiel: Lang andauernde Kryptooperationen

Angenommen, Ihr Server generiert kryptografisch sichere Zufallsbytes mit `crypto.randomBytes()`. `crypto.randomBytes()` ist nicht partitioniert: Es erstellt eine einzelne `randomBytes()`-Aufgabe, um so viele Bytes zu generieren, wie Sie angefordert haben. Wenn Sie für einige Benutzer weniger und für andere mehr Bytes erstellen, ist `crypto.randomBytes()` eine weitere Quelle für Variationen in der Aufgabenlänge.

### Aufgabenpartitionierung

Aufgaben mit variablen Zeitkosten können den Durchsatz des Worker-Pools beeinträchtigen. Um die Variation der Aufgabenzeiten so weit wie möglich zu minimieren, sollten Sie jede Aufgabe in Sub-Tasks mit vergleichbaren Kosten partitionieren. Wenn jeder Sub-Task abgeschlossen ist, sollte er den nächsten Sub-Task übermitteln, und wenn der letzte Sub-Task abgeschlossen ist, sollte er den Absender benachrichtigen.

Um das `fs.readFile()`-Beispiel fortzusetzen, sollten Sie stattdessen `fs.read()` (manuelle Partitionierung) oder `ReadStream` (automatisch partitioniert) verwenden.

Das gleiche Prinzip gilt für CPU-gebundene Aufgaben; das `asyncAvg`-Beispiel ist möglicherweise ungeeignet für die Event-Loop, aber es ist gut geeignet für den Worker-Pool.

Wenn Sie eine Aufgabe in Sub-Tasks partitionieren, werden kürzere Aufgaben in eine kleine Anzahl von Sub-Tasks und längere Aufgaben in eine größere Anzahl von Sub-Tasks erweitert. Zwischen jedem Sub-Task einer längeren Aufgabe kann der Worker, dem sie zugewiesen wurde, an einem Sub-Task einer anderen, kürzeren Aufgabe arbeiten, wodurch der Gesamtaufgabendurchsatz des Worker-Pools verbessert wird.

Beachten Sie, dass die Anzahl der abgeschlossenen Sub-Tasks keine nützliche Metrik für den Durchsatz des Worker-Pools ist. Konzentrieren Sie sich stattdessen auf die Anzahl der abgeschlossenen Aufgaben.


### Vermeidung von Aufgabenpartitionierung

Erinnern Sie sich daran, dass der Zweck der Aufgabenpartitionierung darin besteht, die Variation der Aufgabenzeiten zu minimieren. Wenn Sie zwischen kürzeren und längeren Aufgaben unterscheiden können (z. B. das Summieren eines Arrays im Vergleich zum Sortieren eines Arrays), könnten Sie für jede Aufgabenklasse einen eigenen Worker-Pool erstellen. Das Weiterleiten kürzerer und längerer Aufgaben an separate Worker-Pools ist eine weitere Möglichkeit, die Variation der Aufgabenzeit zu minimieren.

Im Gegensatz zu diesem Ansatz verursacht die Partitionierung von Aufgaben Overhead (die Kosten für das Erstellen einer Worker-Pool-Aufgabendarstellung und für die Bearbeitung der Worker-Pool-Warteschlange), und das Vermeiden der Partitionierung spart Ihnen die Kosten für zusätzliche Fahrten zum Worker-Pool. Es bewahrt Sie auch davor, Fehler bei der Partitionierung Ihrer Aufgaben zu machen.

Der Nachteil dieses Ansatzes ist, dass Worker in all diesen Worker-Pools Platz- und Zeit-Overhead verursachen und miteinander um CPU-Zeit konkurrieren. Denken Sie daran, dass jede CPU-gebundene Aufgabe nur dann Fortschritte macht, wenn sie geplant ist. Daher sollten Sie diesen Ansatz erst nach sorgfältiger Analyse in Betracht ziehen.

### Worker Pool: Schlussfolgerungen

Unabhängig davon, ob Sie nur den Node.js Worker Pool verwenden oder separate Worker Pool(s) unterhalten, sollten Sie den Aufgabendurchsatz Ihrer Pool(s) optimieren.

Minimieren Sie dazu die Variation der Aufgabenzeiten, indem Sie die Aufgabenpartitionierung verwenden.

## Die Risiken von npm-Modulen

Während die Node.js-Kernmodule Bausteine für eine Vielzahl von Anwendungen bieten, wird manchmal etwas mehr benötigt. Node.js-Entwickler profitieren enorm vom npm-Ökosystem mit Hunderttausenden von Modulen, die Funktionen zur Beschleunigung Ihres Entwicklungsprozesses bieten.

Denken Sie jedoch daran, dass die meisten dieser Module von Drittanbietern geschrieben und in der Regel nur mit Best-Effort-Garantien veröffentlicht werden. Ein Entwickler, der ein npm-Modul verwendet, sollte sich um zwei Dinge kümmern, obwohl Letzteres häufig vergessen wird.

1. Hält es seine APIs ein?
2. Könnten seine APIs die Event Loop oder einen Worker blockieren? Viele Module bemühen sich nicht, die Kosten ihrer APIs anzugeben, was sich nachteilig auf die Community auswirkt.

Für einfache APIs können Sie die Kosten der APIs abschätzen; die Kosten für die Stringmanipulation sind nicht schwer zu ergründen. In vielen Fällen ist jedoch unklar, wie viel eine API kosten könnte.

Wenn Sie eine API aufrufen, die etwas Aufwendiges tun könnte, überprüfen Sie die Kosten doppelt. Bitten Sie die Entwickler, sie zu dokumentieren, oder untersuchen Sie den Quellcode selbst (und reichen Sie einen PR ein, der die Kosten dokumentiert).

Denken Sie daran, selbst wenn die API asynchron ist, wissen Sie nicht, wie viel Zeit sie in jedem ihrer Abschnitte für einen Worker oder die Event Loop aufwenden könnte. Nehmen wir zum Beispiel an, dass im obigen Beispiel `asyncAvg` jeder Aufruf der Hilfsfunktion die Hälfte der Zahlen statt einer von ihnen summiert. Dann wäre diese Funktion immer noch asynchron, aber die Kosten für jede Partition wären `O(n)` und nicht `O(1)`, wodurch sie für beliebige Werte von `n` viel weniger sicher zu verwenden wäre.


## Schlussfolgerung

Node.js hat zwei Arten von Threads: eine Event-Schleife und k Worker. Die Event-Schleife ist für JavaScript-Callbacks und nicht-blockierendes I/O zuständig, und ein Worker führt Aufgaben aus, die C++-Code entsprechen, der eine asynchrone Anfrage abschließt, einschließlich blockierendem I/O und CPU-intensiver Arbeit. Beide Arten von Threads arbeiten jeweils an maximal einer Aktivität gleichzeitig. Wenn ein Callback oder eine Aufgabe lange dauert, wird der Thread, der sie ausführt, blockiert. Wenn Ihre Anwendung blockierende Callbacks oder Aufgaben ausführt, kann dies bestenfalls zu einem verringerten Durchsatz (Clients/Sekunde) und schlimmstenfalls zu einer vollständigen Dienstverweigerung führen.

Um einen Webserver mit hohem Durchsatz und besserem Schutz vor DoS-Angriffen zu schreiben, müssen Sie sicherstellen, dass weder Ihre Event-Schleife noch Ihre Worker bei gutartigen oder bösartigen Eingaben blockieren.

