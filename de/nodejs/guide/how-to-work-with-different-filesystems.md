---
title: Best Practices für die Arbeit mit verschiedenen Dateisystemen in Node.js
description: Erfahren Sie, wie Sie in Node.js mit verschiedenen Dateisystemen umgehen, einschließlich Groß- und Kleinschreibung, Unicode-Form-Preservation und Zeitstempelauflösung.
head:
  - - meta
    - name: og:title
      content: Best Practices für die Arbeit mit verschiedenen Dateisystemen in Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Erfahren Sie, wie Sie in Node.js mit verschiedenen Dateisystemen umgehen, einschließlich Groß- und Kleinschreibung, Unicode-Form-Preservation und Zeitstempelauflösung.
  - - meta
    - name: twitter:title
      content: Best Practices für die Arbeit mit verschiedenen Dateisystemen in Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Erfahren Sie, wie Sie in Node.js mit verschiedenen Dateisystemen umgehen, einschließlich Groß- und Kleinschreibung, Unicode-Form-Preservation und Zeitstempelauflösung.
---


# Umgang mit verschiedenen Dateisystemen

Node.js stellt viele Funktionen der Dateisysteme zur Verfügung. Aber nicht alle Dateisysteme sind gleich. Die folgenden sind empfohlene Best Practices, um Ihren Code einfach und sicher zu halten, wenn Sie mit verschiedenen Dateisystemen arbeiten.

## Verhalten von Dateisystemen

Bevor Sie mit einem Dateisystem arbeiten können, müssen Sie wissen, wie es sich verhält. Verschiedene Dateisysteme verhalten sich unterschiedlich und haben mehr oder weniger Funktionen als andere: Groß-/Kleinschreibung beachten, Groß-/Kleinschreibung nicht beachten, Groß-/Kleinschreibung beibehalten, Unicode-Form beibehalten, Zeitstempelauflösung, erweiterte Attribute, Inodes, Unix-Berechtigungen, alternative Datenströme usw.

Hüten Sie sich davor, das Verhalten des Dateisystems von `process.platform` abzuleiten. Nehmen Sie beispielsweise nicht an, dass Sie auf einem System mit Groß-/Kleinschreibung nicht beachtendem Dateisystem (HFS+) arbeiten, nur weil Ihr Programm unter Darwin ausgeführt wird, da der Benutzer möglicherweise ein Dateisystem verwendet, das Groß-/Kleinschreibung beachtet (HFSX). Gehen Sie ebenso wenig davon aus, dass Sie auf einem Dateisystem arbeiten, das Unix-Berechtigungen und Inodes unterstützt, nur weil Ihr Programm unter Linux ausgeführt wird, da Sie sich möglicherweise auf einem bestimmten externen Laufwerk, USB- oder Netzwerklaufwerk befinden, das dies nicht tut.

Das Betriebssystem macht es Ihnen möglicherweise nicht leicht, das Verhalten des Dateisystems abzuleiten, aber es ist noch nicht alles verloren. Anstatt eine Liste aller bekannten Dateisysteme und Verhaltensweisen zu führen (die immer unvollständig sein wird), können Sie das Dateisystem untersuchen, um zu sehen, wie es sich tatsächlich verhält. Das Vorhandensein oder Fehlen bestimmter Funktionen, die leicht zu untersuchen sind, reicht oft aus, um das Verhalten anderer Funktionen abzuleiten, die schwieriger zu untersuchen sind.

Denken Sie daran, dass einige Benutzer möglicherweise verschiedene Dateisysteme unter verschiedenen Pfaden im Arbeitsverzeichnis gemountet haben.

## Vermeiden Sie einen Ansatz des kleinsten gemeinsamen Nenners

Sie könnten versucht sein, Ihr Programm wie ein Dateisystem mit dem kleinsten gemeinsamen Nenner agieren zu lassen, indem Sie alle Dateinamen in Großbuchstaben normalisieren, alle Dateinamen in die NFC-Unicode-Form normalisieren und alle Dateizeitstempel auf eine Auflösung von beispielsweise 1 Sekunde normalisieren. Dies wäre der Ansatz des kleinsten gemeinsamen Nenners.

Tun Sie dies nicht. Sie könnten nur sicher mit einem Dateisystem interagieren, das in jeder Hinsicht genau die gleichen Eigenschaften des kleinsten gemeinsamen Nenners aufweist. Sie wären nicht in der Lage, mit fortgeschritteneren Dateisystemen so zu arbeiten, wie es die Benutzer erwarten, und Sie würden auf Dateinamen- oder Zeitstempelkollisionen stoßen. Sie würden höchstwahrscheinlich Benutzerdaten durch eine Reihe komplizierter, voneinander abhängiger Ereignisse verlieren und beschädigen, und Sie würden Fehler erzeugen, die schwer, wenn nicht unmöglich zu beheben wären.

Was passiert, wenn Sie später ein Dateisystem unterstützen müssen, das nur eine Zeitstempelauflösung von 2 Sekunden oder 24 Stunden hat? Was passiert, wenn der Unicode-Standard so weit fortschreitet, dass er einen etwas anderen Normalisierungsalgorithmus enthält (wie in der Vergangenheit geschehen)?

Ein Ansatz des kleinsten gemeinsamen Nenners würde dazu neigen, ein portables Programm zu erstellen, indem nur "portable" Systemaufrufe verwendet werden. Dies führt zu Programmen, die undicht und tatsächlich nicht portabel sind.


## Einen Superset-Ansatz verfolgen

Nutzen Sie jede von Ihnen unterstützte Plattform optimal aus, indem Sie einen Superset-Ansatz verfolgen. Beispielsweise sollte ein portables Sicherungsprogramm die btimes (die Erstellungszeit einer Datei oder eines Ordners) zwischen Windows-Systemen korrekt synchronisieren und btimes weder zerstören noch verändern, auch wenn btimes auf Linux-Systemen nicht unterstützt werden. Dasselbe portable Sicherungsprogramm sollte Unix-Berechtigungen zwischen Linux-Systemen korrekt synchronisieren und Unix-Berechtigungen weder zerstören noch verändern, auch wenn Unix-Berechtigungen auf Windows-Systemen nicht unterstützt werden.

Behandeln Sie verschiedene Dateisysteme, indem Sie Ihr Programm wie ein fortschrittlicheres Dateisystem wirken lassen. Unterstützen Sie eine Obermenge aller möglichen Funktionen: Groß-/Kleinschreibungsempfindlichkeit, Groß-/Kleinschreibungserhaltung, Unicode-Formularsensitivität, Unicode-Formularerhaltung, Unix-Berechtigungen, hochauflösende Nanosekunden-Zeitstempel, erweiterte Attribute usw.

Sobald Sie die Groß-/Kleinschreibungserhaltung in Ihrem Programm haben, können Sie jederzeit die Groß-/Kleinschreibungunempfindlichkeit implementieren, wenn Sie mit einem Dateisystem interagieren müssen, das die Groß-/Kleinschreibung nicht beachtet. Wenn Sie jedoch die Groß-/Kleinschreibungserhaltung in Ihrem Programm aufgeben, können Sie nicht sicher mit einem Dateisystem interagieren, das die Groß-/Kleinschreibung beachtet. Das Gleiche gilt für die Unicode-Formularerhaltung und die Erhaltung der Zeitstempelauflösung.

Wenn ein Dateisystem Ihnen einen Dateinamen in einer Mischung aus Klein- und Großbuchstaben liefert, behalten Sie den Dateinamen in der exakten angegebenen Schreibweise bei. Wenn ein Dateisystem Ihnen einen Dateinamen in gemischter Unicode-Form oder NFC oder NFD (oder NFKC oder NFKD) liefert, behalten Sie den Dateinamen in der exakten angegebenen Bytefolge bei. Wenn ein Dateisystem Ihnen einen Millisekunden-Zeitstempel liefert, behalten Sie den Zeitstempel in Millisekunden-Auflösung bei.

Wenn Sie mit einem weniger leistungsfähigen Dateisystem arbeiten, können Sie immer entsprechend herunterskalieren, mit Vergleichsfunktionen, wie sie für das Verhalten des Dateisystems erforderlich sind, auf dem Ihr Programm ausgeführt wird. Wenn Sie wissen, dass das Dateisystem keine Unix-Berechtigungen unterstützt, sollten Sie nicht erwarten, dieselben Unix-Berechtigungen zu lesen, die Sie schreiben. Wenn Sie wissen, dass das Dateisystem die Groß-/Kleinschreibung nicht beachtet, sollten Sie darauf vorbereitet sein, `ABC` in einer Verzeichnisauflistung zu sehen, wenn Ihr Programm `abc` erstellt. Wenn Sie jedoch wissen, dass das Dateisystem die Groß-/Kleinschreibung beachtet, sollten Sie `ABC` als einen anderen Dateinamen als `abc` betrachten, wenn Sie Dateiumbenennungen erkennen oder wenn das Dateisystem die Groß-/Kleinschreibung beachtet.


## Groß-/Kleinschreibung beibehalten

Sie können ein Verzeichnis namens `test /abc` erstellen und überrascht sein, wenn `fs.readdir('test')` manchmal `['ABC']` zurückgibt. Dies ist kein Fehler in Node. Node gibt den Dateinamen so zurück, wie er vom Dateisystem gespeichert wird, und nicht alle Dateisysteme unterstützen die Beibehaltung der Groß-/Kleinschreibung. Einige Dateisysteme wandeln alle Dateinamen in Großbuchstaben (oder Kleinbuchstaben) um.

## Unicode-Form Beibehalten

Groß-/Kleinschreibung und Unicode-Form Beibehalten sind ähnliche Konzepte. Um zu verstehen, warum die Unicode-Form beibehalten werden sollte, stellen Sie sicher, dass Sie zuerst verstehen, warum die Groß-/Kleinschreibung beibehalten werden sollte. Die Unicode-Form Beibehalten ist genauso einfach, wenn man sie richtig versteht. Unicode kann dieselben Zeichen mit verschiedenen Byte-Sequenzen codieren. Mehrere Zeichenketten können gleich aussehen, haben aber unterschiedliche Byte-Sequenzen. Seien Sie beim Arbeiten mit UTF-8-Zeichenketten vorsichtig, dass Ihre Erwartungen mit der Funktionsweise von Unicode übereinstimmen. So wie Sie nicht erwarten würden, dass alle UTF-8-Zeichen in ein einzelnes Byte codiert werden, sollten Sie auch nicht erwarten, dass mehrere UTF-8-Zeichenketten, die für das menschliche Auge gleich aussehen, die gleiche Byte-Darstellung haben. Dies mag eine Erwartung sein, die Sie von ASCll haben können, aber nicht von UTF-8.

Sie können ein Verzeichnis namens `test/ café` erstellen (NFC-Unicode-Form mit Byte-Sequenz `<63 61 66 c3 a9>` und `string.length ===5`) und überrascht sein, wenn `fs.readdir('test')` manchmal `['café']` zurückgibt (NFD-Unicode-Form mit Byte-Sequenz `<63 61 66 65 cc 81>` und `string.length ===6`). Dies ist kein Fehler in Node. Node.js gibt den Dateinamen so zurück, wie er vom Dateisystem gespeichert wird, und nicht alle Dateisysteme unterstützen die Beibehaltung der Unicode-Form. HFS+ normalisiert beispielsweise alle Dateinamen in eine Form, die fast immer mit der NFD-Form übereinstimmt. Erwarten Sie nicht, dass sich HFS+ genauso verhält wie NTFS oder EXT 4 und umgekehrt. Versuchen Sie nicht, Daten dauerhaft durch Normalisierung zu ändern, um Unicode-Unterschiede zwischen Dateisystemen zu überdecken. Dies würde Probleme schaffen, ohne etwas zu lösen. Behalten Sie stattdessen die Unicode-Form bei und verwenden Sie die Normalisierung nur als Vergleichsfunktion.


## Unicode-Form-Unempfindlichkeit

Unicode-Form-Unempfindlichkeit und Unicode-Form-Erhaltung sind zwei verschiedene Verhaltensweisen von Dateisystemen, die oft miteinander verwechselt werden. So wie Groß-/Kleinschreibung-Unempfindlichkeit manchmal falsch implementiert wurde, indem Dateinamen beim Speichern und Übertragen dauerhaft in Großbuchstaben normalisiert wurden, so wurde Unicode-Form-Unempfindlichkeit manchmal falsch implementiert, indem Dateinamen beim Speichern und Übertragen dauerhaft in eine bestimmte Unicode-Form (NFD im Fall von HFS+) normalisiert wurden. Es ist möglich und viel besser, Unicode-Form-Unempfindlichkeit zu implementieren, ohne die Unicode-Form-Erhaltung zu beeinträchtigen, indem man die Unicode-Normalisierung nur für den Vergleich verwendet.

## Vergleichen verschiedener Unicode-Formen

Node.js bietet `string.normalize ('NFC' / 'NFD')` an, womit man eine UTF-8-Zeichenkette entweder nach NFC oder NFD normalisieren kann. Sie sollten die Ausgabe dieser Funktion niemals speichern, sondern sie nur als Teil einer Vergleichsfunktion verwenden, um zu testen, ob zwei UTF-8-Zeichenketten für den Benutzer gleich aussehen würden. Sie können `string1.normalize('NFC')=== string2.normalize('NFC')` oder `string1.normalize('NFD')=== string2.normalize('NFD')` als Ihre Vergleichsfunktion verwenden. Welche Form Sie verwenden, spielt keine Rolle.

Die Normalisierung ist schnell, aber Sie sollten einen Cache als Eingabe für Ihre Vergleichsfunktion verwenden, um zu vermeiden, dass dieselbe Zeichenkette viele Male normalisiert wird. Wenn die Zeichenkette nicht im Cache vorhanden ist, normalisieren Sie sie und speichern Sie sie im Cache. Achten Sie darauf, den Cache nicht zu speichern oder persistent zu machen, sondern verwenden Sie ihn nur als Cache.

Beachten Sie, dass die Verwendung von `normalize ()` voraussetzt, dass Ihre Node.js-Version ICU enthält (ansonsten gibt `normalize ()` nur die Originalzeichenkette zurück). Wenn Sie die neueste Version von Node.js von der Website herunterladen, wird ICU enthalten sein.

## Zeitstempelauflösung

Sie können die mtime (die Änderungszeit) einer Datei auf 1444291759414 (Millisekundenauflösung) setzen und überrascht sein, wenn `fs.stat` die neue mtime manchmal als 1444291759000 (1 Sekunde Auflösung) oder 1444291758000 (2 Sekunden Auflösung) zurückgibt. Dies ist kein Fehler in Node. Node.js gibt den Zeitstempel so zurück, wie er vom Dateisystem gespeichert wird, und nicht alle Dateisysteme unterstützen Nanosekunden-, Millisekunden- oder 1-Sekunden-Zeitstempelauflösung. Einige Dateisysteme haben sogar eine sehr grobe Auflösung für den atime-Zeitstempel im Besonderen, z. B. 24 Stunden für einige FAT-Dateisysteme.


## Dateinamen und Zeitstempel nicht durch Normalisierung verfälschen

Dateinamen und Zeitstempel sind Benutzerdaten. So wie Sie niemals automatisch Benutzerdateidaten umschreiben würden, um die Daten in Großbuchstaben zu setzen oder CRLF in LF-Zeilenenden zu normalisieren, sollten Sie niemals Dateinamen oder Zeitstempel durch Fall-/Unicode-Form-/Zeitstempelnormalisierung ändern, beeinträchtigen oder verfälschen. Die Normalisierung sollte nur für Vergleiche verwendet werden, niemals zur Veränderung von Daten.

Die Normalisierung ist effektiv ein verlustbehafteter Hash-Code. Sie können ihn verwenden, um auf bestimmte Arten von Äquivalenz zu testen (z. B. sehen mehrere Zeichenketten gleich aus, obwohl sie unterschiedliche Byte-Sequenzen haben), aber Sie können ihn niemals als Ersatz für die tatsächlichen Daten verwenden. Ihr Programm sollte Dateinamen- und Zeitstempeldaten so weitergeben, wie sie sind.

Ihr Programm kann neue Daten in NFC (oder in einer beliebigen Kombination von Unicode-Formen, die es bevorzugt) oder mit einem Dateinamen in Klein- oder Großbuchstaben oder mit einem Zeitstempel mit einer Auflösung von 2 Sekunden erstellen, aber Ihr Programm sollte keine vorhandenen Benutzerdaten durch die Erzwingung von Fall-/Unicode-Form-/Zeitstempelnormalisierung verfälschen. Wählen Sie stattdessen einen Obermengen-Ansatz und bewahren Sie Fall, Unicode-Form und Zeitstempelauflösung in Ihrem Programm. Auf diese Weise können Sie sicher mit Dateisystemen interagieren, die dies ebenfalls tun.

## Normalisierungsvergleichsfunktionen richtig verwenden

Stellen Sie sicher, dass Sie Fall-/Unicode-Form-/Zeitstempelvergleichsfunktionen richtig verwenden. Verwenden Sie keine Funktion für den Fall-unempfindlichen Dateinamenvergleich, wenn Sie auf einem Fall-empfindlichen Dateisystem arbeiten. Verwenden Sie keine Funktion für den Unicode-Form-unempfindlichen Vergleich, wenn Sie auf einem Unicode-Form-empfindlichen Dateisystem arbeiten (z. B. NTFS und die meisten Linux-Dateisysteme, die sowohl NFC als auch NFD oder gemischte Unicode-Formen beibehalten). Vergleichen Sie keine Zeitstempel mit einer Auflösung von 2 Sekunden, wenn Sie auf einem Dateisystem mit Nanosekunden-Zeitstempelauflösung arbeiten.

## Auf leichte Unterschiede in den Vergleichsfunktionen vorbereitet sein

Achten Sie darauf, dass Ihre Vergleichsfunktionen mit denen des Dateisystems übereinstimmen (oder das Dateisystem, falls möglich, untersuchen, um zu sehen, wie es tatsächlich vergleichen würde). Die Fall-Unempfindlichkeit ist beispielsweise komplexer als ein einfacher `toLowerCase()`-Vergleich. Tatsächlich ist `toUpperCase()` normalerweise besser als `toLowerCase()` (da es bestimmte fremdsprachige Zeichen unterschiedlich behandelt). Aber noch besser wäre es, das Dateisystem zu untersuchen, da jedes Dateisystem seine eigene Fallvergleichstabelle integriert hat.

Als Beispiel normalisiert Apples HFS+ Dateinamen in die NFD-Form, aber diese NFD-Form ist eigentlich eine ältere Version der aktuellen NFD-Form und kann manchmal geringfügig von der neuesten NFD-Form des Unicode-Standards abweichen. Erwarten Sie nicht, dass HFS+ NFD immer genau mit Unicode NFD übereinstimmt.

