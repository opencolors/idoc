---
title: Der V8-JavaScript-Motor
description: V8 ist der JavaScript-Motor, der Google Chrome antreibt, indem er JavaScript-Code ausführt und eine Laufzeitumgebung bereitstellt. Er ist unabhängig vom Browser und hat den Aufstieg von Node.js ermöglicht, indem er Server-Code und Desktop-Anwendungen antreibt.
head:
  - - meta
    - name: og:title
      content: Der V8-JavaScript-Motor | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: V8 ist der JavaScript-Motor, der Google Chrome antreibt, indem er JavaScript-Code ausführt und eine Laufzeitumgebung bereitstellt. Er ist unabhängig vom Browser und hat den Aufstieg von Node.js ermöglicht, indem er Server-Code und Desktop-Anwendungen antreibt.
  - - meta
    - name: twitter:title
      content: Der V8-JavaScript-Motor | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: V8 ist der JavaScript-Motor, der Google Chrome antreibt, indem er JavaScript-Code ausführt und eine Laufzeitumgebung bereitstellt. Er ist unabhängig vom Browser und hat den Aufstieg von Node.js ermöglicht, indem er Server-Code und Desktop-Anwendungen antreibt.
---


# Die V8 JavaScript Engine

V8 ist der Name der JavaScript-Engine, die Google Chrome antreibt. Sie ist das, was unser JavaScript nimmt und es beim Browsen mit Chrome ausführt.

V8 ist die JavaScript-Engine, d.h. sie parst und führt JavaScript-Code aus. Das DOM und die anderen Web Platform APIs (sie alle bilden die Laufzeitumgebung) werden vom Browser bereitgestellt.

Das Coole daran ist, dass die JavaScript-Engine unabhängig von dem Browser ist, in dem sie gehostet wird. Diese Schlüsseleigenschaft ermöglichte den Aufstieg von Node.js. V8 wurde 2009 als die Engine ausgewählt, die Node.js antreibt, und mit der wachsenden Popularität von Node.js wurde V8 zur Engine, die nun eine unglaubliche Menge an serverseitigem Code antreibt, der in JavaScript geschrieben ist.

Das Node.js-Ökosystem ist riesig und dank V8, das mit Projekten wie Electron auch Desktop-Apps antreibt.

## Andere JS Engines

Andere Browser haben ihre eigenen JavaScript-Engines:

+ `SpiderMonkey` (Firefox)
+ `JavaScriptCore` (auch `Nitro` genannt) (Safari)
+ Edge basierte ursprünglich auf `Chakra`, wurde aber vor kurzem mit Chromium und der V8-Engine neu aufgebaut.

und viele andere existieren ebenfalls.

All diese Engines implementieren den [ECMA ES-262 Standard](https://www.ecma-international.org/publications-and-standards/standards/ecma-262/), auch ECMAScript genannt, den von JavaScript verwendeten Standard.

## Das Streben nach Leistung

V8 ist in C++ geschrieben und wird kontinuierlich verbessert. Es ist portabel und läuft unter Mac, Windows, Linux und verschiedenen anderen Systemen.

In dieser V8-Einführung werden wir die Implementierungsdetails von V8 ignorieren: Sie sind auf maßgeblicheren Seiten zu finden (z.B. der [offiziellen V8-Seite](https://v8.dev/)), und sie ändern sich im Laufe der Zeit, oft radikal.

V8 entwickelt sich ständig weiter, genau wie die anderen JavaScript-Engines, um das Web und das Node.js-Ökosystem zu beschleunigen.

Im Web gibt es seit Jahren ein Wettrennen um die Leistung, und wir (als Benutzer und Entwickler) profitieren sehr von diesem Wettbewerb, weil wir Jahr für Jahr schnellere und optimiertere Maschinen bekommen.


## Kompilierung

JavaScript wird im Allgemeinen als interpretierte Sprache betrachtet, aber moderne JavaScript-Engines interpretieren JavaScript nicht mehr nur, sie kompilieren es.

Dies geschieht seit 2009, als der SpiderMonkey JavaScript-Compiler zu Firefox 3.5 hinzugefügt wurde, und alle folgten dieser Idee.

JavaScript wird intern von V8 mit Just-in-Time (JIT)-Kompilierung kompiliert, um die Ausführung zu beschleunigen.

Dies mag kontraintuitiv erscheinen, aber seit der Einführung von Google Maps im Jahr 2004 hat sich JavaScript von einer Sprache, die im Allgemeinen ein paar Dutzend Codezeilen ausführte, zu kompletten Anwendungen mit Tausenden bis Hunderttausenden von Zeilen entwickelt, die im Browser laufen.

Unsere Anwendungen können jetzt stundenlang in einem Browser laufen, anstatt nur ein paar Formularvalidierungsregeln oder einfache Skripte zu sein.

In dieser neuen Welt ist die Kompilierung von JavaScript absolut sinnvoll, denn obwohl es etwas länger dauern kann, bis das JavaScript fertig ist, ist es, sobald es fertig ist, viel performanter als rein interpretierter Code.

