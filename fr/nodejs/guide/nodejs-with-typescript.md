---
title: Node.js avec TypeScript
description: Apprenez à utiliser TypeScript avec Node.js, y compris ses avantages, son installation et son utilisation. Découvrez comment compiler et exécuter le code TypeScript et explorez ses fonctionnalités et outils.
head:
  - - meta
    - name: og:title
      content: Node.js avec TypeScript | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Apprenez à utiliser TypeScript avec Node.js, y compris ses avantages, son installation et son utilisation. Découvrez comment compiler et exécuter le code TypeScript et explorez ses fonctionnalités et outils.
  - - meta
    - name: twitter:title
      content: Node.js avec TypeScript | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Apprenez à utiliser TypeScript avec Node.js, y compris ses avantages, son installation et son utilisation. Découvrez comment compiler et exécuter le code TypeScript et explorez ses fonctionnalités et outils.
---


# Node.js avec TypeScript

## Qu'est-ce que TypeScript

[TypeScript](https://www.typescriptlang.org) est un langage open source maintenu et développé par Microsoft. Il est apprécié et utilisé par de nombreux développeurs de logiciels à travers le monde.

Fondamentalement, c'est un sur-ensemble de JavaScript qui ajoute de nouvelles capacités au langage. L'ajout le plus notable est la définition statique des types, ce qui n'est pas présent en JavaScript pur. Grâce aux types, il est possible, par exemple, de déclarer quel type d'arguments nous attendons et ce qui est retourné exactement dans nos fonctions ou quelle est la forme exacte de l'objet que nous créons. TypeScript est un outil très puissant et ouvre un nouveau monde de possibilités dans les projets JavaScript. Il rend notre code plus sûr et plus robuste en prévenant de nombreux bugs avant même que le code ne soit déployé - il détecte les problèmes pendant le développement du code et s'intègre merveilleusement avec les éditeurs de code comme Visual Studio Code.

Nous pourrons parler des autres avantages de TypeScript plus tard, voyons quelques exemples maintenant !

### Exemples

Jetez un coup d'œil à cet extrait de code, puis nous pourrons le décortiquer ensemble :

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

La première partie (avec le mot-clé `type`) est responsable de la déclaration de notre type d'objet personnalisé représentant les utilisateurs. Plus tard, nous utilisons ce type nouvellement créé pour créer la fonction `isAdult` qui accepte un argument de type `User` et renvoie `boolean`. Après cela, nous créons `justine`, nos données d'exemple qui peuvent être utilisées pour appeler la fonction définie précédemment. Enfin, nous créons une nouvelle variable avec des informations indiquant si `justine` est un adulte.

Il y a d'autres choses à savoir sur cet exemple. Premièrement, si nous ne nous conformions pas aux types déclarés, TypeScript nous alerterait que quelque chose ne va pas et empêcherait toute mauvaise utilisation. Deuxièmement, tout ne doit pas être typé explicitement - TypeScript est très intelligent et peut déduire les types pour nous. Par exemple, la variable `isJustineAnAdult` serait de type booléen même si nous ne l'avions pas typée explicitement ou `justine` serait un argument valide pour notre fonction même si nous n'avions pas déclaré cette variable comme étant de type `User`.

D'accord, nous avons donc du code TypeScript. Maintenant, comment l'exécuter ?

**La première chose à faire est d'installer TypeScript dans notre projet :**

```bash
npm install -D typescript
```

Nous pouvons maintenant le compiler en JavaScript à l'aide de la commande `tsc` dans le terminal. Faisons-le !

**En supposant que notre fichier est nommé `example.ts`, la commande ressemblerait à :**

```bash
npx tsc example.ts
```

::: tip
**[npx](https://www.npmjs.com/package/npx) signifie ici Node Package Execute. Cet outil nous permet d'exécuter le compilateur TypeScript sans l'installer globalement.**
:::

`tsc` est le compilateur TypeScript qui prendra notre code TypeScript et le compilera en JavaScript. Cette commande créera un nouveau fichier nommé `example.js` que nous pourrons exécuter à l'aide de Node.js. Maintenant que nous savons comment compiler et exécuter du code TypeScript, voyons les capacités de prévention des bogues de TypeScript en action !

**Voici comment nous allons modifier notre code :**

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

**Et voici ce que TypeScript a à dire à ce sujet :**

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

Comme vous pouvez le constater, TypeScript nous empêche avec succès de livrer du code qui pourrait fonctionner de manière inattendue. C'est merveilleux !


## En savoir plus sur TypeScript

TypeScript offre de nombreux autres mécanismes intéressants tels que les interfaces, les classes, les types utilitaires, etc. De plus, sur des projets plus importants, vous pouvez déclarer votre configuration de compilateur TypeScript dans un fichier séparé et ajuster de manière granulaire son fonctionnement, son niveau de striction et l'endroit où il stocke les fichiers compilés par exemple. Vous pouvez en savoir plus sur tout cela dans [la documentation officielle de TypeScript](https://www.typescriptlang.org/docs).

Certains des autres avantages de TypeScript qui méritent d'être mentionnés sont qu'il peut être adopté progressivement, qu'il contribue à rendre le code plus lisible et compréhensible et qu'il permet aux développeurs d'utiliser des fonctionnalités linguistiques modernes tout en expédiant du code pour des versions plus anciennes de Node.js.

## Exécuter du code TypeScript dans Node.js

Node.js ne peut pas exécuter TypeScript nativement. Vous ne pouvez pas appeler `node example.ts` directement depuis la ligne de commande. Mais il existe trois solutions à ce problème :

### Compiler TypeScript en JavaScript

Si vous voulez exécuter du code TypeScript dans Node.js, vous devez d'abord le compiler en JavaScript. Vous pouvez le faire en utilisant le compilateur TypeScript `tsc` comme indiqué précédemment.

Voici un petit exemple :

```bash
npx tsc example.ts
node example.js
```

### Exécuter du code TypeScript avec `ts-node`

Vous pouvez utiliser [ts-node](https://www.npmjs.com/package/ts-node) pour exécuter du code TypeScript directement dans Node.js sans avoir besoin de le compiler au préalable. Mais il ne vérifie pas les types de votre code. Nous vous recommandons donc de vérifier d'abord les types de votre code avec `tsc`, puis de l'exécuter avec `ts-node` avant de le livrer.

Pour utiliser `ts-node`, vous devez d'abord l'installer :

````bash
npm install -D ts-node
``

Ensuite, vous pouvez exécuter votre code TypeScript comme ceci :

```bash
npx ts-node example.ts
````

### Exécuter du code TypeScript avec `tsx`

Vous pouvez utiliser [tsx](https://www.npmjs.com/package/tsx) pour exécuter du code TypeScript directement dans Node.js sans avoir besoin de le compiler au préalable. Mais il ne vérifie pas les types de votre code. Nous vous recommandons donc de vérifier d'abord les types de votre code avec `tsc`, puis de l'exécuter avec `tsx` avant de le livrer.

Pour utiliser tsx, vous devez d'abord l'installer :

```bash
npm install -D tsx
```

Ensuite, vous pouvez exécuter votre code TypeScript comme ceci :

```bash
npx tsx example.ts
```

Si vous voulez utiliser `tsx` via `node`, vous pouvez enregistrer `tsx` via `--import`:

```bash
node --import=tsx example.ts
```


## TypeScript dans le monde Node.js

TypeScript est bien établi dans le monde Node.js et est utilisé par de nombreuses entreprises, projets open-source, outils et frameworks. Voici quelques exemples notables de projets open-source utilisant TypeScript :

- [NestJS](https://nestjs.com) - framework robuste et complet qui rend la création de systèmes évolutifs et bien architecturés facile et agréable
- [TypeORM](https://typeorm.io) - excellent ORM influencé par d'autres outils bien connus d'autres langages comme Hibernate, Doctrine ou Entity Framework
- [Prisma](https://prisma.io) - ORM de nouvelle génération doté d'un modèle de données déclaratif, de migrations générées et de requêtes de base de données entièrement typées
- [RxJS](https://rxjs.dev) - bibliothèque largement utilisée pour la programmation réactive
- [AdonisJS](https://adonisjs.com) - Un framework web complet avec Node.js
- [FoalTs](https://foal.dev) - Le framework Nodejs élégant

Et beaucoup, beaucoup d'autres grands projets... Peut-être même votre prochain !

