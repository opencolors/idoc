---
title: Der Unterschied zwischen Entwicklung und Produktion in Node.js
description: Das Verständnis von NODE_ENV in Node.js und seine Auswirkungen auf die Entwicklungs- und Produktionsumgebungen.
head:
  - - meta
    - name: og:title
      content: Der Unterschied zwischen Entwicklung und Produktion in Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Das Verständnis von NODE_ENV in Node.js und seine Auswirkungen auf die Entwicklungs- und Produktionsumgebungen.
  - - meta
    - name: twitter:title
      content: Der Unterschied zwischen Entwicklung und Produktion in Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Das Verständnis von NODE_ENV in Node.js und seine Auswirkungen auf die Entwicklungs- und Produktionsumgebungen.
---


# Node.js, der Unterschied zwischen Entwicklung und Produktion

`Es gibt keinen Unterschied zwischen Entwicklung und Produktion in Node.js`, d. h., es gibt keine spezifischen Einstellungen, die Sie anwenden müssen, damit Node.js in einer Produktionskonfiguration funktioniert. Einige Bibliotheken im npm-Registry erkennen jedoch die Verwendung der `NODE_ENV`-Variable und setzen sie standardmäßig auf die Einstellung `development`. Führen Sie Ihr Node.js immer mit gesetzter `NODE_ENV=production` aus.

Eine beliebte Methode zur Konfiguration Ihrer Anwendung ist die Verwendung der [Twelve-Factor-Methodologie](https://12factor.net).

## NODE_ENV in Express

Im äußerst beliebten [Express](https://expressjs.com)-Framework stellt das Setzen von NODE_ENV auf Produktion im Allgemeinen sicher, dass:

+ die Protokollierung auf ein Minimum beschränkt wird
+ mehr Caching-Ebenen stattfinden, um die Leistung zu optimieren

Dies geschieht normalerweise durch Ausführen des Befehls

```bash
export NODE_ENV=production
```

in der Shell, aber es ist besser, dies in Ihre Shell-Konfigurationsdatei (z. B. `.bash_profile` mit der Bash-Shell) einzutragen, da die Einstellung sonst im Falle eines Systemneustarts nicht erhalten bleibt.

Sie können die Umgebungsvariable auch anwenden, indem Sie sie dem Initialisierungsbefehl Ihrer Anwendung voranstellen:

```bash
NODE_ENV=production node app.js
```

In einer Express-App können Sie dies beispielsweise verwenden, um verschiedene Fehlerbehandlungsroutinen pro Umgebung festzulegen:

```javascript
if (process.env.NODE_ENV === 'development') {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
}
if (process.env.NODE_ENV === 'production') {
  app.use(express.errorHandler());
}
```

Beispielsweise wird [Pug](https://pugjs.org), die von [Express.js](https://expressjs.com) verwendete Template-Bibliothek, im Debug-Modus kompiliert, wenn `NODE_ENV` nicht auf `production` gesetzt ist. Express-Ansichten werden im Entwicklungsmodus bei jeder Anfrage kompiliert, während sie in der Produktion zwischengespeichert werden. Es gibt noch viele weitere Beispiele.

`Diese Umgebungsvariable ist eine Konvention, die in externen Bibliotheken weit verbreitet ist, aber nicht in Node.js selbst.`

## Warum wird NODE_ENV als Anti-Pattern betrachtet?

Eine Umgebung ist eine digitale Plattform oder ein System, in dem Ingenieure Softwareprodukte erstellen, testen, bereitstellen und verwalten können. Konventionell gibt es vier Stufen oder Arten von Umgebungen, in denen unsere Anwendung ausgeführt wird:

+ Entwicklung
+ Staging
+ Produktion
+ Test

Das grundlegende Problem von `NODE_ENV` rührt daher, dass Entwickler Optimierungen und Softwareverhalten mit der Umgebung kombinieren, in der ihre Software ausgeführt wird. Das Ergebnis ist Code wie der folgende:

```javascript
if (process.env.NODE_ENV === 'development') {
  // ...
}
if (process.env.NODE_ENV === 'staging') {
  // ...
}
if (process.env.NODE_ENV === 'production') {
  // ...
}
if (process.env.NODE_ENV === 'testing') {
  // ...
}
```

Auch wenn dies harmlos erscheinen mag, macht es die Produktions- und Staging-Umgebungen unterschiedlich und somit zuverlässige Tests unmöglich. Beispielsweise könnte ein Test und damit eine Funktionalität Ihres Produkts bestanden werden, wenn `NODE_ENV` auf `development` gesetzt ist, aber fehlschlagen, wenn `NODE_ENV` auf `production` gesetzt ist. Daher wird das Setzen von `NODE_ENV` auf etwas anderes als `production` als Anti-Pattern betrachtet.

