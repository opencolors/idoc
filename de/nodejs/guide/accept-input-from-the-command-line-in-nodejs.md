---
title: Benutzereingaben in Node.js abrufen
description: Erfahren Sie, wie Sie interaktive Node.js-CLI-Programme mit dem readline-Modul und dem Inquirer.js-Paket erstellen.
head:
  - - meta
    - name: og:title
      content: Benutzereingaben in Node.js abrufen | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Erfahren Sie, wie Sie interaktive Node.js-CLI-Programme mit dem readline-Modul und dem Inquirer.js-Paket erstellen.
  - - meta
    - name: twitter:title
      content: Benutzereingaben in Node.js abrufen | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Erfahren Sie, wie Sie interaktive Node.js-CLI-Programme mit dem readline-Modul und dem Inquirer.js-Paket erstellen.
---


# Eingabe von der Befehlszeile in Node.js entgegennehmen

Wie macht man ein Node.js CLI Programm interaktiv?

Node.js stellt seit Version 7 das Modul `readline` zur Verfügung, um genau dies zu tun: Eingaben von einem lesbaren Stream wie dem `process.stdin` Stream zeilenweise entgegenzunehmen. Dieser Stream ist während der Ausführung eines Node.js Programms die Terminaleingabe.

```javascript
const readline = require('node:readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.question("Wie heißt du?", name => {
    console.log('Hallo ' + name + '!');
    rl.close();
});
```

Dieses Codefragment fragt den Namen des Benutzers und sendet nach der Eingabe des Texts und dem Drücken der Eingabetaste eine Begrüßung.

Die Methode `question()` zeigt den ersten Parameter (eine Frage) an und wartet auf die Benutzereingabe. Sie ruft die Callback-Funktion auf, sobald die Eingabetaste gedrückt wird.

In dieser Callback-Funktion schließen wir die readline-Schnittstelle.

`readline` bietet verschiedene andere Methoden. Bitte informieren Sie sich in der oben verlinkten Paketdokumentation.

Wenn Sie ein Passwort benötigen, ist es am besten, es nicht zurückzugeben, sondern stattdessen ein * Symbol anzuzeigen.

Der einfachste Weg ist die Verwendung des `readline-sync` Pakets, das in Bezug auf die API sehr ähnlich ist und dies standardmäßig unterstützt. Eine vollständigere und abstraktere Lösung bietet das `Inquirer.js` Paket.

Sie können es mit `npm install inquirer` installieren und dann den obigen Code wie folgt replizieren:

```javascript
const inquirer = require('inquirer');
const questions = [
    {
        type: 'input',
        name: 'name',
        message: "Wie heißt du?"
    }
];
inquirer.prompt(questions).then(answers => {
    console.log('Hallo ' + answers.name + '!');
});
```

Mit `Inquirer.js` können Sie viele Dinge tun, wie z. B. Mehrfachauswahl anbieten, Optionsfelder haben, Bestätigungen und mehr.

Es lohnt sich, alle Alternativen zu kennen, insbesondere die in Node.js integrierten, aber wenn Sie die CLI-Eingabe auf die nächste Stufe heben möchten, ist `Inquirer.js` eine optimale Wahl.

