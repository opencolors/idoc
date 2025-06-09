---
title: Asynchrone Flusssteuerung in JavaScript
description: Verstehen der asynchronen Flusssteuerung in JavaScript, einschließlich Callbacks, Zustandsverwaltung und Flusssteuerungsmuster.
head:
  - - meta
    - name: og:title
      content: Asynchrone Flusssteuerung in JavaScript | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Verstehen der asynchronen Flusssteuerung in JavaScript, einschließlich Callbacks, Zustandsverwaltung und Flusssteuerungsmuster.
  - - meta
    - name: twitter:title
      content: Asynchrone Flusssteuerung in JavaScript | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Verstehen der asynchronen Flusssteuerung in JavaScript, einschließlich Callbacks, Zustandsverwaltung und Flusssteuerungsmuster.
---


# Asynchrone Ablaufsteuerung

::: info
Das Material in diesem Beitrag ist stark von [Mixu's Node.js Book](http://book.mixu.net/node/ch7.html) inspiriert.
:::

Im Kern ist JavaScript so konzipiert, dass es den "Haupt"-Thread, in dem Ansichten gerendert werden, nicht blockiert. Man kann sich die Bedeutung dessen im Browser vorstellen. Wenn der Haupt-Thread blockiert wird, führt dies zum berüchtigten "Einfrieren", das Endbenutzer fürchten, und es können keine anderen Ereignisse ausgelöst werden, was beispielsweise zu Datenverlust führt.

Dies erzeugt einige einzigartige Einschränkungen, die nur ein funktionaler Programmierstil beheben kann. Hier kommen Callbacks ins Spiel.

Allerdings können Callbacks in komplizierteren Prozeduren schwierig zu handhaben sein. Dies führt oft zur "Callback-Hölle", in der mehrere verschachtelte Funktionen mit Callbacks den Code schwieriger lesbar, debuggbar, organisierbar usw. machen.

```js
async1(function (input, result1) {
  async2(function (result2) {
    async3(function (result3) {
      async4(function (result4) {
        async5(function (output) {
          // do something with output
        });
      });
    });
  });
});
```

In der Realität gäbe es natürlich höchstwahrscheinlich zusätzliche Codezeilen, um `result1`, `result2` usw. zu verarbeiten, sodass die Länge und Komplexität dieses Problems normalerweise zu Code führt, der viel unordentlicher aussieht als das obige Beispiel.

**Hier kommen Funktionen sehr gut zur Geltung. Komplexere Operationen bestehen aus vielen Funktionen:**

1. Initiator-Stil / Eingabe
2. Middleware
3. Terminator

**Der "Initiator-Stil / Eingabe" ist die erste Funktion in der Sequenz. Diese Funktion akzeptiert die ursprüngliche Eingabe, falls vorhanden, für die Operation. Die Operation ist eine ausführbare Reihe von Funktionen, und die ursprüngliche Eingabe wird hauptsächlich sein:**

1. Variablen in einer globalen Umgebung
2. Direkter Aufruf mit oder ohne Argumente
3. Werte, die durch Dateisystem- oder Netzwerkanfragen erhalten werden

Netzwerkanfragen können eingehende Anfragen sein, die von einem fremden Netzwerk, von einer anderen Anwendung im selben Netzwerk oder von der App selbst im selben oder in einem fremden Netzwerk initiiert werden.

Eine Middleware-Funktion gibt eine andere Funktion zurück, und eine Terminator-Funktion ruft den Callback auf. Das Folgende veranschaulicht den Fluss zu Netzwerk- oder Dateisystemanfragen. Hier ist die Latenz 0, da alle diese Werte im Speicher verfügbar sind.

```js
function final(someInput, callback) {
  callback(`${someInput} und terminiert durch Ausführen des Callback `);
}
function middleware(someInput, callback) {
  return final(`${someInput} berührt von Middleware `, callback);
}
function initiate() {
  const someInput = 'hallo dies ist eine Funktion ';
  middleware(someInput, function (result) {
    console.log(result);
    // benötigt Callback, um Ergebnis zu `return`
  });
}
initiate();
```


## Zustandsverwaltung

Funktionen können zustandsabhängig sein oder nicht. Zustandsabhängigkeit entsteht, wenn die Eingabe oder eine andere Variable einer Funktion von einer externen Funktion abhängt.

**Auf diese Weise gibt es zwei Hauptstrategien für die Zustandsverwaltung:**

1. Variablen direkt an eine Funktion übergeben, und
2. einen Variablenwert aus einem Cache, einer Sitzung, einer Datei, einer Datenbank, einem Netzwerk oder einer anderen externen Quelle beziehen.

Beachten Sie, dass ich globale Variablen nicht erwähnt habe. Die Zustandsverwaltung mit globalen Variablen ist oft ein schlampiges Anti-Pattern, das es schwierig oder unmöglich macht, den Zustand zu gewährleisten. Globale Variablen sollten in komplexen Programmen nach Möglichkeit vermieden werden.

## Kontrollfluss

Wenn ein Objekt im Speicher verfügbar ist, ist Iteration möglich, und es wird keine Änderung des Kontrollflusses geben:

```js
function getSong() {
  let _song = '';
  let i = 100;
  for (i; i > 0; i -= 1) {
    _song += `${i} Flaschen Bier an der Wand, du nimmst eine runter und gibst sie herum, ${
      i - 1
    } Flaschen Bier an der Wand\n`;
    if (i === 1) {
      _song += "Hey, lass uns noch etwas Bier holen";
    }
  }
  return _song;
}
function singSong(_song) {
  if (!_song) throw new Error("Song ist '' leer, GIB MIR EINEN SONG!");
  console.log(_song);
}
const song = getSong();
// das wird funktionieren
singSong(song);
```

Wenn sich die Daten jedoch außerhalb des Speichers befinden, funktioniert die Iteration nicht mehr:

```js
function getSong() {
  let _song = '';
  let i = 100;
  for (i; i > 0; i -= 1) {
    /* eslint-disable no-loop-func */
    setTimeout(function () {
      _song += `${i} Flaschen Bier an der Wand, du nimmst eine runter und gibst sie herum, ${
        i - 1
      } Flaschen Bier an der Wand\n`;
      if (i === 1) {
        _song += "Hey, lass uns noch etwas Bier holen";
      }
    }, 0);
    /* eslint-enable no-loop-func */
  }
  return _song;
}
function singSong(_song) {
  if (!_song) throw new Error("Song ist '' leer, GIB MIR EINEN SONG!");
  console.log(_song);
}
const song = getSong('beer');
// das wird nicht funktionieren
singSong(song);
// Uncaught Error: Song ist '' leer, GIB MIR EINEN SONG!
```

Warum ist das passiert? `setTimeout` weist die CPU an, die Anweisungen an anderer Stelle im Bus zu speichern und anzuweisen, dass die Daten für die spätere Abholung geplant sind. Tausende von CPU-Zyklen vergehen, bevor die Funktion wieder die 0-Millisekunden-Marke erreicht, die CPU die Anweisungen vom Bus abruft und sie ausführt. Das einzige Problem ist, dass Song ('') Tausende von Zyklen zuvor zurückgegeben wurde.

Die gleiche Situation ergibt sich beim Umgang mit Dateisystemen und Netzwerkanfragen. Der Haupt-Thread kann einfach nicht für einen unbestimmten Zeitraum blockiert werden - daher verwenden wir Callbacks, um die Ausführung von Code rechtzeitig auf kontrollierte Weise zu planen.

Sie können fast alle Ihre Operationen mit den folgenden 3 Mustern durchführen:

1. **In Serie:** Funktionen werden in einer streng sequentiellen Reihenfolge ausgeführt, dies ähnelt am ehesten `for`-Schleifen.

```js
// Operationen, die an anderer Stelle definiert und zur Ausführung bereit sind
const operations = [
  { func: function1, args: args1 },
  { func: function2, args: args2 },
  { func: function3, args: args3 },
];
function executeFunctionWithArgs(operation, callback) {
  // führt Funktion aus
  const { args, func } = operation;
  func(args, callback);
}
function serialProcedure(operation) {
  if (!operation) process.exit(0); // fertig
  executeFunctionWithArgs(operation, function (result) {
    // fortsetzen NACH Callback
    serialProcedure(operations.shift());
  });
}
serialProcedure(operations.shift());
```

2. `Vollständig parallel`: wenn die Reihenfolge kein Problem darstellt, z. B. beim Versenden von E-Mails an eine Liste von 1.000.000 E-Mail-Empfängern.

```js
let count = 0;
let success = 0;
const failed = [];
const recipients = [
  { name: 'Bart', email: 'bart@tld' },
  { name: 'Marge', email: 'marge@tld' },
  { name: 'Homer', email: 'homer@tld' },
  { name: 'Lisa', email: 'lisa@tld' },
  { name: 'Maggie', email: 'maggie@tld' },
];
function dispatch(recipient, callback) {
  // `sendEmail` ist ein hypothetischer SMTP-Client
  sendMail(
    {
      subject: 'Abendessen heute Abend',
      message: 'Wir haben viel Kohl auf dem Teller. Kommst du?',
      smtp: recipient.email,
    },
    callback
  );
}
function final(result) {
  console.log(`Ergebnis: ${result.count} Versuche \
      & ${result.success} erfolgreiche E-Mails`);
  if (result.failed.length)
    console.log(`Fehler beim Senden an: \
        \n${result.failed.join('\n')}\n`);
}
recipients.forEach(function (recipient) {
  dispatch(recipient, function (err) {
    if (!err) {
      success += 1;
    } else {
      failed.push(recipient.name);
    }
    count += 1;
    if (count === recipients.length) {
      final({
        count,
        success,
        failed,
      });
    }
  });
});
```

3. **Begrenzt parallel**: parallel mit Limit, z. B. das erfolgreiche Versenden von E-Mails an 1.000.000 Empfänger aus einer Liste von 10 Millionen Benutzern.

```js
let successCount = 0;
function final() {
  console.log(`dispatched ${successCount} emails`);
  console.log('finished');
}
function dispatch(recipient, callback) {
  // `sendEmail` ist ein hypothetischer SMTP-Client
  sendMail(
    {
      subject: 'Abendessen heute Abend',
      message: 'Wir haben viel Kohl auf dem Teller. Kommst du?',
      smtp: recipient.email,
    },
    callback
  );
}
function sendOneMillionEmailsOnly() {
  getListOfTenMillionGreatEmails(function (err, bigList) {
    if (err) throw err;
    function serial(recipient) {
      if (!recipient || successCount >= 1000000) return final();
      dispatch(recipient, function (_err) {
        if (!_err) successCount += 1;
        serial(bigList.pop());
      });
    }
    serial(bigList.pop());
  });
}
sendOneMillionEmailsOnly();
```

Jedes hat seine eigenen Anwendungsfälle, Vorteile und Probleme, mit denen Sie experimentieren und über die Sie detaillierter lesen können. Am wichtigsten ist, denken Sie daran, Ihre Operationen zu modularisieren und Callbacks zu verwenden! Wenn Sie Zweifel haben, behandeln Sie alles so, als wäre es Middleware!

