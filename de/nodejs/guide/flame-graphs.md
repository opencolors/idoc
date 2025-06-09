---
title: Flammendiagramme für die Leistungsoptimierung von Node.js
description: Erfahren Sie, wie Sie Flammendiagramme erstellen, um die CPU-Zeit, die in Funktionen aufgewendet wird, zu visualisieren und die Leistung von Node.js zu optimieren.
head:
  - - meta
    - name: og:title
      content: Flammendiagramme für die Leistungsoptimierung von Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Erfahren Sie, wie Sie Flammendiagramme erstellen, um die CPU-Zeit, die in Funktionen aufgewendet wird, zu visualisieren und die Leistung von Node.js zu optimieren.
  - - meta
    - name: twitter:title
      content: Flammendiagramme für die Leistungsoptimierung von Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Erfahren Sie, wie Sie Flammendiagramme erstellen, um die CPU-Zeit, die in Funktionen aufgewendet wird, zu visualisieren und die Leistung von Node.js zu optimieren.
---


# Flame Graphs

## Wozu ist ein Flame Graph nützlich?

Flame Graphs sind eine Möglichkeit, die CPU-Zeit zu visualisieren, die in Funktionen verbracht wird. Sie können Ihnen helfen, festzustellen, wo Sie zu viel Zeit mit synchronen Operationen verbringen.

## Wie man einen Flame Graph erstellt

Sie haben vielleicht gehört, dass das Erstellen eines Flame Graphs für Node.js schwierig ist, aber das stimmt (nicht mehr). Solaris VMs werden nicht mehr für Flame Graphs benötigt!

Flame Graphs werden aus der `perf`-Ausgabe generiert, die kein Node-spezifisches Tool ist. Obwohl es die leistungsstärkste Möglichkeit ist, die verbrauchte CPU-Zeit zu visualisieren, kann es Probleme damit geben, wie JavaScript-Code in Node.js 8 und höher optimiert wird. Siehe Abschnitt [perf output issues](#perf-output-issues) unten.

### Verwenden Sie ein vorgefertigtes Tool
Wenn Sie einen einzelnen Schritt wünschen, der lokal einen Flame Graph erzeugt, versuchen Sie es mit [0x](https://www.npmjs.com/package/0x)

Für die Diagnose von Produktionsumgebungen lesen Sie diese Hinweise: [0x production servers](https://github.com/davidmarkclements/0x/blob/master/docs/production-servers.md).

### Erstellen Sie einen Flame Graph mit System-Perf-Tools
Der Zweck dieser Anleitung ist es, die Schritte zur Erstellung eines Flame Graphs zu zeigen und Ihnen die Kontrolle über jeden Schritt zu ermöglichen.

Wenn Sie jeden Schritt besser verstehen möchten, werfen Sie einen Blick auf die folgenden Abschnitte, in denen wir detaillierter darauf eingehen.

Jetzt lasst uns an die Arbeit gehen.

1. Installieren Sie `perf` (normalerweise über das Paket linux-tools-common verfügbar, falls noch nicht installiert)
2. Versuchen Sie, `perf` auszuführen - es könnte sich über fehlende Kernel-Module beschweren, installieren Sie diese ebenfalls
3. Führen Sie Node mit aktiviertem Perf aus (siehe [perf output issues](#perf-output-issues) für Tipps speziell für Node.js-Versionen)
```bash
perf record -e cycles:u -g -- node --perf-basic-prof app.js
```
4. Ignorieren Sie Warnungen, es sei denn, sie besagen, dass Sie Perf aufgrund fehlender Pakete nicht ausführen können. Sie erhalten möglicherweise einige Warnungen, dass Sie nicht auf Kernelmodul-Samples zugreifen können, nach denen Sie sowieso nicht suchen.
5. Führen Sie `perf script > perfs.out` aus, um die Datendatei zu generieren, die Sie gleich visualisieren werden. Es ist nützlich, etwas Bereinigung anzuwenden, um einen besser lesbaren Graphen zu erhalten
6. Installieren Sie Stackvis, falls noch nicht installiert `npm i -g stackvis`
7. Führen Sie `stackvis perf < perfs.out > flamegraph.htm` aus

Öffnen Sie nun die Flame-Graph-Datei in Ihrem Lieblingsbrowser und sehen Sie zu, wie sie brennt. Sie ist farblich gekennzeichnet, sodass Sie sich zuerst auf die am stärksten gesättigten orangefarbenen Balken konzentrieren können. Diese stellen wahrscheinlich CPU-intensive Funktionen dar.

Erwähnenswert ist, dass beim Klicken auf ein Element eines Flame Graphs eine Vergrößerung seiner Umgebung über dem Graphen angezeigt wird.


### Verwenden von `perf` zum Sampeln eines laufenden Prozesses

Dies ist ideal, um Flame-Graph-Daten von einem bereits laufenden Prozess aufzuzeichnen, den Sie nicht unterbrechen möchten. Stellen Sie sich einen Produktionsprozess mit einem schwer zu reproduzierenden Problem vor.

```bash
perf record -F99 -p `pgrep -n node` -- sleep 3
```

Wozu dient dieses `sleep 3`? Es dient dazu, perf am Laufen zu halten - obwohl die Option `-p` auf eine andere PID verweist, muss der Befehl in einem Prozess ausgeführt werden und mit diesem enden. perf läuft für die Lebensdauer des Befehls, den Sie ihm übergeben, unabhängig davon, ob Sie diesen Befehl tatsächlich profilieren oder nicht. `sleep 3` stellt sicher, dass perf 3 Sekunden lang läuft.

Warum ist `-F` (Profiling-Frequenz) auf 99 gesetzt? Dies ist ein sinnvoller Standardwert. Sie können ihn bei Bedarf anpassen. `-F99` weist perf an, 99 Samples pro Sekunde zu nehmen. Erhöhen Sie den Wert, um eine höhere Präzision zu erzielen. Niedrigere Werte sollten weniger Ausgaben mit weniger präzisen Ergebnissen erzeugen. Die benötigte Präzision hängt davon ab, wie lange Ihre CPU-intensiven Funktionen tatsächlich laufen. Wenn Sie nach der Ursache für eine spürbare Verlangsamung suchen, sollten 99 Frames pro Sekunde mehr als ausreichend sein.

Nachdem Sie die 3-Sekunden-perf-Aufzeichnung erhalten haben, fahren Sie mit den letzten beiden Schritten von oben fort, um den Flame-Graph zu erstellen.

### Herausfiltern von internen Node.js-Funktionen

Normalerweise möchten Sie nur die Leistung Ihrer Aufrufe betrachten. Das Herausfiltern von internen Node.js- und V8-Funktionen kann den Graph erheblich übersichtlicher machen. Sie können Ihre perf-Datei mit folgendem Befehl bereinigen:

```bash
sed -i -r \
    -e '/(_libc_start|LazyCompile) |v8::internal::BuiltIn|Stub|LoadIC:\\[\\[' \
    -e '/^$/d' \
    perf.data > perf.out
```

Wenn Ihr Flame-Graph seltsam erscheint, als ob in der Schlüsselfunktion, die die meiste Zeit beansprucht, etwas fehlt, versuchen Sie, Ihren Flame-Graph ohne die Filter zu erstellen - vielleicht haben Sie einen seltenen Fall eines Problems mit Node.js selbst.

### Profiling-Optionen von Node.js

`--perf-basic-prof-only-functions` und `--perf-basic-prof` sind die beiden Optionen, die für das Debuggen Ihres JavaScript-Codes nützlich sind. Andere Optionen werden für das Profilieren von Node.js selbst verwendet, was jedoch außerhalb des Rahmens dieses Leitfadens liegt.

`--perf-basic-prof-only-functions` erzeugt weniger Ausgaben, daher ist es die Option mit dem geringsten Overhead.


### Warum brauche ich sie überhaupt?

Nun, ohne diese Optionen erhalten Sie zwar trotzdem ein Flame Graph, aber die meisten Balken sind mit `v8::Function::Call` beschriftet.

## `Perf` Ausgabe Probleme

### Node.js 8.x V8 Pipeline Änderungen

Node.js 8.x und höher werden mit neuen Optimierungen an der JavaScript-Kompilierungs-Pipeline in der V8-Engine ausgeliefert, die Funktionsnamen/Referenzen für perf manchmal unerreichbar macht. (Es heißt Turbofan)

Das Ergebnis ist, dass Sie möglicherweise nicht die richtigen Funktionsnamen im Flame Graph erhalten.

Sie werden `ByteCodeHandler:` bemerken, wo Sie Funktionsnamen erwarten würden.

0x hat einige integrierte Abschwächungen dafür.

Für Details siehe:
- <https://github.com/nodejs/benchmarking/issues/168>
- <https://github.com/nodejs/diagnostics/issues/148#issuecomment-369348961>

### Node.js 10+

Node.js 10.x behebt das Problem mit Turbofan mit dem Flag `--interpreted-frames-native-stack`.

Führen Sie `node --interpreted-frames-native-stack --perf-basic-prof-only-functions` aus, um Funktionsnamen im Flame Graph zu erhalten, unabhängig davon, welche Pipeline V8 zum Kompilieren Ihres JavaScript verwendet hat.

### Fehlerhafte Beschriftungen im Flame Graph

Wenn Sie Beschriftungen sehen, die so aussehen

```bash
node`_ZN2v88internal11interpreter17BytecodeGenerator15VisitStatementsEPMS0_8Zone
```

bedeutet dies, dass das von Ihnen verwendete Linux perf nicht mit Demangle-Unterstützung kompiliert wurde, siehe z.B. <https://bugs.launchpad.net/ubuntu/+source/linux/+bug/1396654>

## Beispiele

Üben Sie selbst das Erstellen von Flame Graphs mit einer [Flame Graph Übung](https://github.com/naugtur/node-example-flamegraph)!

