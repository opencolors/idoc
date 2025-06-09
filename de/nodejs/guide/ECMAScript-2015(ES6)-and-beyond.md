---
title: ECMAScript 2015 (ES6) und darüber hinaus in Node.js
description: Node.js unterstützt moderne ECMAScript-Features durch den V8-Motor, mit neuen Features und Verbesserungen, die rechtzeitig eingeführt werden.
head:
  - - meta
    - name: og:title
      content: ECMAScript 2015 (ES6) und darüber hinaus in Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js unterstützt moderne ECMAScript-Features durch den V8-Motor, mit neuen Features und Verbesserungen, die rechtzeitig eingeführt werden.
  - - meta
    - name: twitter:title
      content: ECMAScript 2015 (ES6) und darüber hinaus in Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js unterstützt moderne ECMAScript-Features durch den V8-Motor, mit neuen Features und Verbesserungen, die rechtzeitig eingeführt werden.
---


# ECMAScript 2015 (ES6) und darüber hinaus

Node.js basiert auf modernen Versionen von [V8](https://v8.dev/). Indem wir mit den neuesten Versionen dieser Engine auf dem Laufenden bleiben, stellen wir sicher, dass neue Funktionen aus der [JavaScript ECMA-262 Spezifikation](https://tc39.es/ecma262/) den Node.js-Entwicklern zeitnah zur Verfügung gestellt werden, sowie kontinuierliche Leistungs- und Stabilitätsverbesserungen.

Alle ECMAScript 2015 (ES6)-Funktionen sind in drei Gruppen unterteilt: `shipping` (ausgeliefert), `staged` (in der Entwicklung) und `in progress` (in Bearbeitung):

+ Alle `shipping`-Funktionen, die V8 als stabil betrachtet, sind `standardmäßig in Node.js aktiviert` und benötigen `KEINE` Art von Runtime-Flag.
+ `Staged`-Funktionen, fast fertiggestellte Funktionen, die vom V8-Team noch nicht als stabil angesehen werden, benötigen ein Runtime-Flag: `--harmony`.
+ `In progress`-Funktionen können einzeln durch ihr jeweiliges Harmony-Flag aktiviert werden, obwohl dies dringend davon abgeraten wird, außer zu Testzwecken. Hinweis: Diese Flags werden von V8 bereitgestellt und können sich potenziell ohne Vorankündigung ändern.

## Welche Funktionen werden standardmäßig mit welcher Node.js-Version ausgeliefert?

Die Website [node.green](https://node.green) bietet einen hervorragenden Überblick über unterstützte ECMAScript-Funktionen in verschiedenen Versionen von Node.js, basierend auf kangax's compat-table.

## Welche Funktionen sind in Bearbeitung?

Der V8-Engine werden ständig neue Funktionen hinzugefügt. Im Allgemeinen kann man davon ausgehen, dass sie in einer zukünftigen Node.js-Version landen werden, obwohl der Zeitpunkt unbekannt ist.

Sie können alle in Bearbeitung befindlichen Funktionen auflisten, die in jeder Node.js-Version verfügbar sind, indem Sie das Argument `--v8-options` durchsuchen (greppen). Bitte beachten Sie, dass dies unvollständige und möglicherweise fehlerhafte Funktionen von V8 sind, verwenden Sie sie also auf eigenes Risiko:

```sh
node --v8-options | grep "in progress"
```

## Meine Infrastruktur ist so eingerichtet, dass sie das --harmony-Flag nutzt. Sollte ich es entfernen?

Das aktuelle Verhalten des `--harmony`-Flags in Node.js ist die Aktivierung von `staged`-Funktionen. Schließlich ist es jetzt ein Synonym für `--es_staging`. Wie oben erwähnt, sind dies fertiggestellte Funktionen, die noch nicht als stabil angesehen werden. Wenn Sie auf Nummer sicher gehen wollen, insbesondere in Produktionsumgebungen, sollten Sie in Erwägung ziehen, dieses Runtime-Flag zu entfernen, bis es standardmäßig in V8 und folglich in Node.js ausgeliefert wird. Wenn Sie dies aktiviert lassen, sollten Sie darauf vorbereitet sein, dass weitere Node.js-Upgrades Ihren Code beschädigen, wenn V8 seine Semantik ändert, um dem Standard genauer zu folgen.


## Wie finde ich heraus, welche Version von V8 mit einer bestimmten Version von Node.js ausgeliefert wird?

Node.js bietet eine einfache Möglichkeit, alle Abhängigkeiten und die jeweiligen Versionen, die mit einem bestimmten Binary ausgeliefert werden, über das globale `process`-Objekt aufzulisten. Im Fall der V8-Engine gibst du Folgendes in deinem Terminal ein, um die Version abzurufen:

```sh
node -p process.versions.v8
```

