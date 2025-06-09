---
title: Node.js con TypeScript
description: Impara a utilizzare TypeScript con Node.js, inclusi i suoi vantaggi, installazione e utilizzo. Scopri come compilare e eseguire codice TypeScript ed esplora le sue funzionalità e strumenti.
head:
  - - meta
    - name: og:title
      content: Node.js con TypeScript | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Impara a utilizzare TypeScript con Node.js, inclusi i suoi vantaggi, installazione e utilizzo. Scopri come compilare e eseguire codice TypeScript ed esplora le sue funzionalità e strumenti.
  - - meta
    - name: twitter:title
      content: Node.js con TypeScript | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Impara a utilizzare TypeScript con Node.js, inclusi i suoi vantaggi, installazione e utilizzo. Scopri come compilare e eseguire codice TypeScript ed esplora le sue funzionalità e strumenti.
---


# Node.js con TypeScript

## Cos'è TypeScript

[TypeScript](https://www.typescriptlang.org) è un linguaggio open-source mantenuto e sviluppato da Microsoft. È amato e utilizzato da molti sviluppatori software in tutto il mondo.

Fondamentalmente, è un superset di JavaScript che aggiunge nuove funzionalità al linguaggio. L'aggiunta più notevole sono le definizioni di tipo statico, qualcosa che non è presente in JavaScript puro. Grazie ai tipi, è possibile, ad esempio, dichiarare che tipo di argomenti ci aspettiamo e cosa viene restituito esattamente nelle nostre funzioni o qual è la forma esatta dell'oggetto che stiamo creando. TypeScript è uno strumento davvero potente e apre un nuovo mondo di possibilità nei progetti JavaScript. Rende il nostro codice più sicuro e robusto prevenendo molti bug prima ancora che il codice venga spedito - cattura i problemi durante lo sviluppo del codice e si integra meravigliosamente con editor di codice come Visual Studio Code.

Possiamo parlare di altri vantaggi di TypeScript più avanti, vediamo subito alcuni esempi!

### Esempi

Dai un'occhiata a questo frammento di codice e poi possiamo analizzarlo insieme:

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

La prima parte (con la parola chiave `type`) è responsabile della dichiarazione del nostro tipo di oggetto personalizzato che rappresenta gli utenti. Successivamente utilizziamo questo tipo appena creato per creare la funzione `isAdult` che accetta un argomento di tipo `User` e restituisce `boolean`. Dopo questo, creiamo `justine`, i nostri dati di esempio che possono essere utilizzati per chiamare la funzione precedentemente definita. Infine, creiamo una nuova variabile con informazioni sul fatto che `justine` sia un adulto.

Ci sono ulteriori cose su questo esempio che dovresti sapere. In primo luogo, se non rispettassimo i tipi dichiarati, TypeScript ci avviserebbe che qualcosa non va e impedirebbe l'uso improprio. In secondo luogo, non tutto deve essere tipizzato esplicitamente - TypeScript è molto intelligente e può dedurre i tipi per noi. Ad esempio, la variabile `isJustineAnAdult` sarebbe di tipo booleano anche se non l'avessimo tipizzata esplicitamente o `justine` sarebbe un argomento valido per la nostra funzione anche se non avessimo dichiarato questa variabile come di tipo `User`.

Ok, quindi abbiamo del codice TypeScript. Ora come lo eseguiamo?

**La prima cosa da fare è installare TypeScript nel nostro progetto:**

```bash
npm install -D typescript
```

Ora possiamo compilarlo in JavaScript usando il comando `tsc` nel terminale. Facciamolo!

**Supponendo che il nostro file sia denominato `example.ts`, il comando sarebbe simile a:**

```bash
npx tsc example.ts
```

::: tip
**[npx](https://www.npmjs.com/package/npx) qui sta per Node Package Execute. Questo strumento ci consente di eseguire il compilatore di TypeScript senza installarlo globalmente.**
:::

`tsc` è il compilatore TypeScript che prenderà il nostro codice TypeScript e lo compilerà in JavaScript. Questo comando risulterà in un nuovo file chiamato `example.js` che possiamo eseguire usando Node.js. Ora che sappiamo come compilare ed eseguire il codice TypeScript, vediamo le capacità di prevenzione dei bug di TypeScript in azione!

**Ecco come modificheremo il nostro codice:**

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

**E questo è ciò che TypeScript ha da dire su questo:**

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

Come puoi vedere TypeScript ci impedisce con successo di spedire codice che potrebbe funzionare in modo inaspettato. È meraviglioso!


## Maggiori informazioni su TypeScript

TypeScript offre un sacco di altri ottimi meccanismi come interfacce, classi, tipi di utilità e così via. Inoltre, su progetti più grandi puoi dichiarare la configurazione del tuo compilatore TypeScript in un file separato e regolare in modo granulare come funziona, quanto è rigoroso e dove memorizza i file compilati, ad esempio. Puoi leggere di più su tutte queste fantastiche cose nella [documentazione ufficiale di TypeScript](https://www.typescriptlang.org/docs).

Alcuni degli altri vantaggi di TypeScript che vale la pena menzionare sono che può essere adottato progressivamente, aiuta a rendere il codice più leggibile e comprensibile e consente agli sviluppatori di utilizzare funzionalità linguistiche moderne durante la spedizione di codice per versioni precedenti di Node.js.

## Esecuzione di codice TypeScript in Node.js

Node.js non può eseguire TypeScript nativamente. Non puoi chiamare `node example.ts` direttamente dalla riga di comando. Ma ci sono tre soluzioni a questo problema:

### Compilazione di TypeScript in JavaScript

Se vuoi eseguire codice TypeScript in Node.js, devi prima compilarlo in JavaScript. Puoi farlo usando il compilatore TypeScript `tsc` come mostrato in precedenza.

Ecco un piccolo esempio:

```bash
npx tsc example.ts
node example.js
```

### Esecuzione di codice TypeScript con `ts-node`

Puoi usare [ts-node](https://www.npmjs.com/package/ts-node) per eseguire codice TypeScript direttamente in Node.js senza la necessità di compilarlo prima. Ma non esegue il controllo dei tipi del tuo codice. Pertanto, raccomandiamo di controllare prima i tipi del tuo codice con `tsc` e poi eseguirlo con `ts-node` prima di spedirlo.

Per usare `ts-node`, devi prima installarlo:

````bash
npm install -D ts-node
````

Quindi puoi eseguire il tuo codice TypeScript in questo modo:

```bash
npx ts-node example.ts
````

### Esecuzione di codice TypeScript con `tsx`

Puoi usare [tsx](https://www.npmjs.com/package/tsx) per eseguire codice TypeScript direttamente in Node.js senza la necessità di compilarlo prima. Ma non esegue il controllo dei tipi del tuo codice. Pertanto, raccomandiamo di controllare prima i tipi del tuo codice con `tsc` e poi eseguirlo con `tsx` prima di spedirlo.

Per usare tsx, devi prima installarlo:

```bash
npm install -D tsx
```

Quindi puoi eseguire il tuo codice TypeScript in questo modo:

```bash
npx tsx example.ts
```

Se vuoi usare `tsx` tramite `node`, puoi registrare `tsx` tramite `--import`:

```bash
node --import=tsx example.ts
```


## TypeScript nel mondo di Node.js

TypeScript è ben consolidato nel mondo di Node.js ed è utilizzato da molte aziende, progetti open source, strumenti e framework. Alcuni degli esempi notevoli di progetti open source che utilizzano TypeScript sono:

- [NestJS](https://nestjs.com) - framework robusto e completo che rende la creazione di sistemi scalabili e ben architettati facile e piacevole
- [TypeORM](https://typeorm.io) - ottimo ORM influenzato da altri strumenti ben noti di altri linguaggi come Hibernate, Doctrine o Entity Framework
- [Prisma](https://prisma.io) - ORM di nuova generazione con un modello di dati dichiarativo, migrazioni generate e query di database completamente type-safe
- [RxJS](https://rxjs.dev) - libreria ampiamente utilizzata per la programmazione reattiva
- [AdonisJS](https://adonisjs.com) - Un framework web completo con Node.js
- [FoalTs](https://foal.dev) - L'elegante framework Nodejs

E molti, molti altri fantastici progetti... Forse anche il tuo prossimo!

