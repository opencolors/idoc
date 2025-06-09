---
title: Unterschiede zwischen Node.js und dem Browser
description: Erfahren Sie mehr über die wichtigsten Unterschiede zwischen der Entwicklung von Anwendungen mit Node.js und dem Browser, einschließlich Ökosystem, Umgebungskontrolle und Modulsystemen.
head:
  - - meta
    - name: og:title
      content: Unterschiede zwischen Node.js und dem Browser | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Erfahren Sie mehr über die wichtigsten Unterschiede zwischen der Entwicklung von Anwendungen mit Node.js und dem Browser, einschließlich Ökosystem, Umgebungskontrolle und Modulsystemen.
  - - meta
    - name: twitter:title
      content: Unterschiede zwischen Node.js und dem Browser | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Erfahren Sie mehr über die wichtigsten Unterschiede zwischen der Entwicklung von Anwendungen mit Node.js und dem Browser, einschließlich Ökosystem, Umgebungskontrolle und Modulsystemen.
---


# Unterschiede zwischen Node.js und dem Browser

Sowohl der Browser als auch Node.js verwenden JavaScript als ihre Programmiersprache. Das Erstellen von Apps, die im Browser laufen, unterscheidet sich komplett von der Erstellung einer Node.js-Anwendung. Trotz der Tatsache, dass es immer JavaScript ist, gibt es einige wichtige Unterschiede, die die Erfahrung radikal verändern.

Aus der Perspektive eines Frontend-Entwicklers, der JavaScript ausgiebig nutzt, bringen Node.js-Apps einen enormen Vorteil mit sich: den Komfort, alles – das Frontend und das Backend – in einer einzigen Sprache zu programmieren.

Du hast eine riesige Chance, denn wir wissen, wie schwer es ist, eine Programmiersprache vollständig und tiefgehend zu erlernen, und indem du dieselbe Sprache verwendest, um all deine Arbeit im Web zu erledigen – sowohl auf dem Client als auch auf dem Server – befindest du dich in einer einzigartigen vorteilhaften Position.

::: tip
Was sich ändert, ist das Ökosystem.
:::

Im Browser interagierst du die meiste Zeit mit dem DOM oder anderen Web Platform APIs wie Cookies. Diese existieren in Node.js natürlich nicht. Du hast nicht das `document`, `window` und all die anderen Objekte, die vom Browser bereitgestellt werden.

Und im Browser haben wir nicht all die schönen APIs, die Node.js über seine Module bereitstellt, wie z. B. die Funktionalität für den Dateisystemzugriff.

Ein weiterer großer Unterschied besteht darin, dass du in Node.js die Umgebung kontrollierst. Sofern du keine Open-Source-Anwendung entwickelst, die jeder überall bereitstellen kann, weißt du, welche Version von Node.js du die Anwendung ausführen wirst. Im Vergleich zur Browserumgebung, in der du nicht den Luxus hast, zu wählen, welchen Browser deine Besucher verwenden werden, ist dies sehr angenehm.

Das bedeutet, dass du das gesamte moderne ES2015+ JavaScript schreiben kannst, das deine Node.js-Version unterstützt. Da sich JavaScript so schnell bewegt, Browser aber etwas langsam beim Aktualisieren sein können, bist du im Web manchmal gezwungen, ältere JavaScript / ECMAScript-Versionen zu verwenden. Du kannst Babel verwenden, um deinen Code in ES5-kompatibel zu transformieren, bevor du ihn an den Browser auslieferst, aber in Node.js brauchst du das nicht.

Ein weiterer Unterschied besteht darin, dass Node.js sowohl die CommonJS- als auch die ES-Modulsysteme unterstützt (seit Node.js v12), während wir im Browser sehen, dass der ES-Module-Standard implementiert wird.

In der Praxis bedeutet dies, dass du sowohl `require()` als auch `import` in Node.js verwenden kannst, während du im Browser auf `import` beschränkt bist.

