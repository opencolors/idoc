---
title: ABI-Stabilität in Node.js und N-API
description: Node.js bietet eine stabile ABI für native Add-Ons über N-API, die Kompatibilität zwischen mehreren Hauptversionen sicherstellt und die Wartungsbelastung für Produktionsumgebungen reduziert.
head:
  - - meta
    - name: og:title
      content: ABI-Stabilität in Node.js und N-API | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js bietet eine stabile ABI für native Add-Ons über N-API, die Kompatibilität zwischen mehreren Hauptversionen sicherstellt und die Wartungsbelastung für Produktionsumgebungen reduziert.
  - - meta
    - name: twitter:title
      content: ABI-Stabilität in Node.js und N-API | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js bietet eine stabile ABI für native Add-Ons über N-API, die Kompatibilität zwischen mehreren Hauptversionen sicherstellt und die Wartungsbelastung für Produktionsumgebungen reduziert.
---


# ABI-Stabilität

## Einführung

Eine Application Binary Interface (ABI) ist eine Möglichkeit für Programme, Funktionen aufzurufen und Datenstrukturen von anderen kompilierten Programmen zu verwenden. Sie ist die kompilierte Version einer Application Programming Interface (API). Mit anderen Worten, die Header-Dateien, die die Klassen, Funktionen, Datenstrukturen, Enumerationen und Konstanten beschreiben, die einer Anwendung die Ausführung einer gewünschten Aufgabe ermöglichen, entsprechen durch die Kompilierung einer Reihe von Adressen und erwarteten Parameterwerten sowie Speicherstrukturgrößen und -layouts, mit denen der Anbieter der ABI kompiliert wurde.

Die Anwendung, die die ABI verwendet, muss so kompiliert werden, dass die verfügbaren Adressen, die erwarteten Parameterwerte und die Speicherstrukturgrößen und -layouts mit denen übereinstimmen, mit denen der ABI-Anbieter kompiliert wurde. Dies wird normalerweise durch die Kompilierung gegen die vom ABI-Anbieter bereitgestellten Header erreicht.

Da der Anbieter der ABI und der Benutzer der ABI zu unterschiedlichen Zeiten mit unterschiedlichen Versionen des Compilers kompiliert werden können, liegt ein Teil der Verantwortung für die Gewährleistung der ABI-Kompatibilität beim Compiler. Verschiedene Versionen des Compilers, die möglicherweise von verschiedenen Anbietern stammen, müssen alle die gleiche ABI aus einer Header-Datei mit einem bestimmten Inhalt erzeugen und Code für die Anwendung erzeugen, die die ABI verwendet und auf die in einem bestimmten Header beschriebene API gemäß den Konventionen der aus der Beschreibung im Header resultierenden ABI zugreift. Moderne Compiler haben eine recht gute Erfolgsbilanz darin, die ABI-Kompatibilität der von ihnen kompilierten Anwendungen nicht zu beeinträchtigen.

Die verbleibende Verantwortung für die Gewährleistung der ABI-Kompatibilität liegt beim Team, das die Header-Dateien pflegt, die die API bereitstellen, die nach der Kompilierung zu der ABI führt, die stabil bleiben soll. Änderungen an den Header-Dateien können vorgenommen werden, aber die Art der Änderungen muss genau verfolgt werden, um sicherzustellen, dass sich die ABI nach der Kompilierung nicht auf eine Weise ändert, die bestehende Benutzer der ABI mit der neuen Version inkompatibel macht.


## ABI-Stabilität in Node.js

Node.js stellt Header-Dateien bereit, die von mehreren unabhängigen Teams verwaltet werden. Zum Beispiel werden Header-Dateien wie `node.h` und `node_buffer.h` vom Node.js-Team verwaltet. `v8.h` wird vom V8-Team verwaltet, das zwar eng mit dem Node.js-Team zusammenarbeitet, aber unabhängig ist und seinen eigenen Zeitplan und Prioritäten hat. Daher hat das Node.js-Team nur teilweisen Einfluss auf die Änderungen, die in den vom Projekt bereitgestellten Headern eingeführt werden. Infolgedessen hat das Node.js-Projekt [Semantic Versioning](https://semver.org) eingeführt. Dies stellt sicher, dass die vom Projekt bereitgestellten APIs zu einer stabilen ABI für alle Neben- und Patch-Versionen von Node.js innerhalb einer Hauptversion führen. In der Praxis bedeutet dies, dass sich das Node.js-Projekt verpflichtet hat, sicherzustellen, dass ein Node.js Native Addon, das gegen eine bestimmte Hauptversion von Node.js kompiliert wurde, erfolgreich geladen wird, wenn es von einer beliebigen Neben- oder Patch-Version von Node.js innerhalb der Hauptversion geladen wird, gegen die es kompiliert wurde.

## N-API

Es ist die Forderung entstanden, Node.js mit einer API auszustatten, die zu einer ABI führt, die über mehrere Node.js-Hauptversionen hinweg stabil bleibt. Die Motivation für die Erstellung einer solchen API ist folgende:

- Die JavaScript-Sprache ist seit ihren frühesten Tagen mit sich selbst kompatibel geblieben, während sich die ABI der Engine, die den JavaScript-Code ausführt, mit jeder Hauptversion von Node.js ändert. Dies bedeutet, dass Anwendungen, die aus Node.js-Paketen bestehen, die vollständig in JavaScript geschrieben sind, nicht neu kompiliert, neu installiert oder neu bereitgestellt werden müssen, wenn eine neue Hauptversion von Node.js in die Produktionsumgebung eingeführt wird, in der diese Anwendungen ausgeführt werden. Im Gegensatz dazu muss eine Anwendung, wenn sie von einem Paket abhängt, das ein Native Addon enthält, neu kompiliert, neu installiert und neu bereitgestellt werden, wenn eine neue Hauptversion von Node.js in die Produktionsumgebung eingeführt wird. Diese Diskrepanz zwischen Node.js-Paketen, die Native Addons enthalten, und solchen, die vollständig in JavaScript geschrieben sind, hat die Wartungslast von Produktionssystemen, die auf Native Addons angewiesen sind, erhöht.

- Andere Projekte haben begonnen, JavaScript-Schnittstellen zu erstellen, die im Wesentlichen alternative Implementierungen von Node.js darstellen. Da diese Projekte in der Regel auf einer anderen JavaScript-Engine als V8 aufbauen, nehmen ihre Native Addons notwendigerweise eine andere Struktur an und verwenden eine andere API. Dennoch würde die Verwendung einer einzigen API für ein Native Addon über verschiedene Implementierungen der Node.js JavaScript-API hinweg es diesen Projekten ermöglichen, die Vorteile des Ökosystems von JavaScript-Paketen zu nutzen, das sich um Node.js herum gebildet hat.

- Node.js kann in Zukunft eine andere JavaScript-Engine enthalten. Dies bedeutet, dass extern alle Node.js-Schnittstellen gleich bleiben würden, aber die V8-Header-Datei fehlen würde. Ein solcher Schritt würde die Störung des Node.js-Ökosystems im Allgemeinen und die der Native Addons im Besonderen verursachen, wenn nicht zuerst eine API von Node.js bereitgestellt und von Native Addons übernommen wird, die JavaScript-Engine-agnostisch ist.

Zu diesem Zweck hat Node.js N-API in Version 8.6.0 eingeführt und sie ab Node.js 8.12.0 als stabile Komponente des Projekts gekennzeichnet. Die API ist in den Headern `node_api.h` und `node_api_types.h` definiert und bietet eine Vorwärtskompatibilitätsgarantie, die die Node.js-Hauptversionsgrenze überschreitet. Die Garantie kann wie folgt formuliert werden:

**Eine bestimmte Version n von N-API wird in der Hauptversion von Node.js verfügbar sein, in der sie veröffentlicht wurde, und in allen nachfolgenden Versionen von Node.js, einschließlich nachfolgender Hauptversionen.**

Ein Native-Addon-Autor kann die Vorteile der N-API-Vorwärtskompatibilitätsgarantie nutzen, indem er sicherstellt, dass das Addon nur APIs verwendet, die in `node_api.h` definiert sind, sowie Datenstrukturen und Konstanten, die in `node_api_types.h` definiert sind. Auf diese Weise erleichtert der Autor die Akzeptanz seines Addons, indem er den Produktionsbenutzern signalisiert, dass sich die Wartungslast für ihre Anwendung durch das Hinzufügen des Native Addons zu ihrem Projekt nicht stärker erhöht als durch das Hinzufügen eines Pakets, das rein in JavaScript geschrieben ist.

N-API ist versioniert, da von Zeit zu Zeit neue APIs hinzugefügt werden. Im Gegensatz zum Semantic Versioning ist die N-API-Versionierung kumulativ. Das heißt, jede Version von N-API hat die gleiche Bedeutung wie eine Nebenversion im Semver-System, was bedeutet, dass alle Änderungen an N-API abwärtskompatibel sind. Darüber hinaus werden neue N-APIs unter einem experimentellen Flag hinzugefügt, um der Community die Möglichkeit zu geben, sie in einer Produktionsumgebung zu prüfen. Der experimentelle Status bedeutet, dass zwar darauf geachtet wurde, dass die neue API in Zukunft nicht auf ABI-inkompatible Weise geändert werden muss, sie aber in der Produktion noch nicht ausreichend bewiesen wurde, um als korrekt und nützlich im Sinne des Designs zu gelten, und daher ABI-inkompatible Änderungen erfahren kann, bevor sie endgültig in eine kommende Version von N-API aufgenommen wird. Das heißt, eine experimentelle N-API ist noch nicht durch die Vorwärtskompatibilitätsgarantie abgedeckt.

