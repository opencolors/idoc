---
title: Node.js mit TypeScript
description: Erfahren Sie, wie Sie TypeScript mit Node.js verwenden können, einschließlich seiner Vorteile, Installation und Verwendung. Entdecken Sie, wie Sie TypeScript-Code kompilieren und ausführen können und erkunden Sie seine Funktionen und Tools.
head:
  - - meta
    - name: og:title
      content: Node.js mit TypeScript | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Erfahren Sie, wie Sie TypeScript mit Node.js verwenden können, einschließlich seiner Vorteile, Installation und Verwendung. Entdecken Sie, wie Sie TypeScript-Code kompilieren und ausführen können und erkunden Sie seine Funktionen und Tools.
  - - meta
    - name: twitter:title
      content: Node.js mit TypeScript | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Erfahren Sie, wie Sie TypeScript mit Node.js verwenden können, einschließlich seiner Vorteile, Installation und Verwendung. Entdecken Sie, wie Sie TypeScript-Code kompilieren und ausführen können und erkunden Sie seine Funktionen und Tools.
---


# Node.js mit TypeScript

## Was ist TypeScript

[TypeScript](https://www.typescriptlang.org) ist eine Open-Source-Sprache, die von Microsoft verwaltet und entwickelt wird. Sie wird von vielen Softwareentwicklern auf der ganzen Welt geliebt und verwendet.

Im Grunde ist es eine Obermenge von JavaScript, die der Sprache neue Funktionen hinzufügt. Die bemerkenswerteste Ergänzung sind statische Typdefinitionen, die in einfachem JavaScript nicht vorhanden sind. Dank der Typen ist es beispielsweise möglich, zu deklarieren, welche Art von Argumenten wir erwarten und was genau in unseren Funktionen zurückgegeben wird oder wie genau die Form des Objekts ist, das wir erstellen. TypeScript ist ein wirklich leistungsstarkes Werkzeug und eröffnet eine neue Welt von Möglichkeiten in JavaScript-Projekten. Es macht unseren Code sicherer und robuster, indem es viele Fehler verhindert, bevor der Code überhaupt ausgeliefert wird - es fängt Probleme während der Codeentwicklung ab und lässt sich wunderbar in Code-Editoren wie Visual Studio Code integrieren.

Wir können später über weitere Vorteile von TypeScript sprechen, sehen wir uns jetzt einige Beispiele an!

### Beispiele

Schauen Sie sich diesen Code-Schnipsel an und dann können wir ihn gemeinsam entpacken:

```ts
type User = {
  name: string
  age: number
}
function isAdult(user: User): boolean {
  return user.age >= 18
}
const justine: User = {
  name: 'Justine',
  age: 23,
}
const isJustineAnAdult: boolean = isAdult(justine)
```

Der erste Teil (mit dem Schlüsselwort `type`) ist für die Deklaration unseres benutzerdefinierten Objekttyps verantwortlich, der Benutzer darstellt. Später verwenden wir diesen neu erstellten Typ, um die Funktion `isAdult` zu erstellen, die ein Argument vom Typ `User` akzeptiert und `boolean` zurückgibt. Danach erstellen wir `justine`, unsere Beispieldaten, die zum Aufrufen der zuvor definierten Funktion verwendet werden können. Schließlich erstellen wir eine neue Variable mit Informationen darüber, ob `justine` erwachsen ist.

Es gibt zusätzliche Dinge an diesem Beispiel, die Sie wissen sollten. Erstens, wenn wir die deklarierten Typen nicht einhalten würden, würde TypeScript uns alarmieren, dass etwas nicht stimmt und Missbrauch verhindern. Zweitens muss nicht alles explizit typisiert werden - TypeScript ist sehr intelligent und kann Typen für uns ableiten. Beispielsweise wäre die Variable `isJustineAnAdult` vom Typ Boolean, selbst wenn wir sie nicht explizit typisiert hätten, oder `justine` wäre ein gültiges Argument für unsere Funktion, selbst wenn wir diese Variable nicht als vom Typ `User` deklariert hätten.

Okay, wir haben also etwas TypeScript-Code. Wie führen wir ihn jetzt aus?

**Als Erstes müssen wir TypeScript in unserem Projekt installieren:**

```bash
npm install -D typescript
```

Jetzt können wir es mit dem Befehl `tsc` im Terminal in JavaScript kompilieren. Lasst uns das tun!

**Angenommen, unsere Datei heißt `example.ts`, würde der Befehl wie folgt aussehen:**

```bash
npx tsc example.ts
```

::: tip
**[npx](https://www.npmjs.com/package/npx) steht hier für Node Package Execute. Mit diesem Tool können wir den TypeScript-Compiler ausführen, ohne ihn global zu installieren.**
:::

`tsc` ist der TypeScript-Compiler, der unseren TypeScript-Code nimmt und in JavaScript kompiliert. Dieser Befehl führt zu einer neuen Datei namens `example.js`, die wir mit Node.js ausführen können. Jetzt, wo wir wissen, wie man TypeScript-Code kompiliert und ausführt, wollen wir die Fähigkeiten von TypeScript zur Fehlervermeidung in Aktion sehen!

**So werden wir unseren Code ändern:**

```ts
type User = {
  name: string
  age: number
}
function isAdult(user: User): boolean {
  return user.age >= 18
}
const justine: User = {
  name: 'Justine',
  age: 'Secret!',
}
const isJustineAnAdult: string = isAdult(justine, "I shouldn't be here!")
```

**Und das hat TypeScript dazu zu sagen:**

```bash
example.ts:12:5 - error TS2322: Type 'string' is not assignable to type 'number'.
12     age: 'Secret!',
       ~~~
  example.ts:3:5
    3     age: number;
          ~~~
    The expected type comes from property 'age' which is declared here on type 'User'
example.ts:15:7 - error TS2322: Type 'boolean' is not assignable to type 'string'.
15 const isJustineAnAdult: string = isAdult(justine, "I shouldn't be here!");
         ~~~~~~~~~~~~~~~~
example.ts:15:51 - error TS2554: Expected 1 arguments, but got 2.
15 const isJustineAnAdult: string = isAdult(justine, "I shouldn't be here!");
                                                     ~~~~~~~~~~~~~~~~~~~~~~
Found 3 errors in the same file, starting at: example.ts:12
```

Wie Sie sehen, hindert uns TypeScript erfolgreich daran, Code auszuliefern, der unerwartet funktionieren könnte. Das ist wunderbar!


## Mehr über TypeScript

TypeScript bietet eine ganze Reihe weiterer großartiger Mechanismen wie Interfaces, Klassen, Utility-Typen und so weiter. Außerdem können Sie in größeren Projekten Ihre TypeScript-Compilerkonfiguration in einer separaten Datei deklarieren und granular anpassen, wie sie funktioniert, wie streng sie ist und wo sie beispielsweise kompilierte Dateien speichert. Mehr über all diese großartigen Dinge können Sie in [der offiziellen TypeScript-Dokumentation](https://www.typescriptlang.org/docs) lesen.

Einige der anderen Vorteile von TypeScript, die erwähnenswert sind, sind, dass es schrittweise eingeführt werden kann, es hilft, Code lesbarer und verständlicher zu machen, und es ermöglicht Entwicklern, moderne Sprachfunktionen zu verwenden und gleichzeitig Code für ältere Node.js-Versionen bereitzustellen.

## TypeScript-Code in Node.js ausführen

Node.js kann TypeScript nicht nativ ausführen. Sie können nicht direkt `node example.ts` von der Kommandozeile aufrufen. Aber es gibt drei Lösungen für dieses Problem:

### TypeScript zu JavaScript kompilieren

Wenn Sie TypeScript-Code in Node.js ausführen möchten, müssen Sie ihn zuerst zu JavaScript kompilieren. Sie können dies mit dem TypeScript-Compiler `tsc` tun, wie bereits gezeigt.

Hier ist ein kleines Beispiel:

```bash
npx tsc example.ts
node example.js
```

### TypeScript-Code mit `ts-node` ausführen

Sie können [ts-node](https://www.npmjs.com/package/ts-node) verwenden, um TypeScript-Code direkt in Node.js auszuführen, ohne ihn vorher kompilieren zu müssen. Es führt jedoch keine Typprüfung Ihres Codes durch. Wir empfehlen daher, Ihren Code zuerst mit `tsc` zu prüfen und ihn dann vor der Auslieferung mit `ts-node` auszuführen.

Um `ts-node` zu verwenden, müssen Sie es zuerst installieren:

````bash
npm install -D ts-node
``

Dann können Sie Ihren TypeScript-Code wie folgt ausführen:

```bash
npx ts-node example.ts
````

### TypeScript-Code mit `tsx` ausführen

Sie können [tsx](https://www.npmjs.com/package/tsx) verwenden, um TypeScript-Code direkt in Node.js auszuführen, ohne ihn vorher kompilieren zu müssen. Es führt jedoch keine Typprüfung Ihres Codes durch. Wir empfehlen daher, Ihren Code zuerst mit `tsc` zu prüfen und ihn dann vor der Auslieferung mit `tsx` auszuführen.

Um tsx zu verwenden, müssen Sie es zuerst installieren:

```bash
npm install -D tsx
```

Dann können Sie Ihren TypeScript-Code wie folgt ausführen:

```bash
npx tsx example.ts
```

Wenn Sie `tsx` über `node` verwenden möchten, können Sie `tsx` über `--import` registrieren:

```bash
node --import=tsx example.ts
```


## TypeScript in der Node.js-Welt

TypeScript ist in der Node.js-Welt etabliert und wird von vielen Unternehmen, Open-Source-Projekten, Tools und Frameworks verwendet. Einige der bemerkenswertesten Beispiele für Open-Source-Projekte, die TypeScript verwenden, sind:

- [NestJS](https://nestjs.com) - robustes und voll ausgestattetes Framework, das die Erstellung skalierbarer und gut strukturierter Systeme einfach und angenehm macht
- [TypeORM](https://typeorm.io) - großartiges ORM, das von anderen bekannten Tools aus anderen Sprachen wie Hibernate, Doctrine oder Entity Framework beeinflusst wurde
- [Prisma](https://prisma.io) - ORM der nächsten Generation mit einem deklarativen Datenmodell, generierten Migrationen und vollständig typsicheren Datenbankabfragen
- [RxJS](https://rxjs.dev) - weit verbreitete Bibliothek für reaktive Programmierung
- [AdonisJS](https://adonisjs.com) - Ein voll ausgestattetes Webframework mit Node.js
- [FoalTs](https://foal.dev) - Das elegante Nodejs-Framework

Und viele, viele weitere großartige Projekte... Vielleicht sogar Ihr nächstes!

