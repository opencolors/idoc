---
title: La différence entre développement et production dans Node.js
description: Comprendre le rôle de NODE_ENV dans Node.js et son impact sur les environnements de développement et de production.
head:
  - - meta
    - name: og:title
      content: La différence entre développement et production dans Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Comprendre le rôle de NODE_ENV dans Node.js et son impact sur les environnements de développement et de production.
  - - meta
    - name: twitter:title
      content: La différence entre développement et production dans Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Comprendre le rôle de NODE_ENV dans Node.js et son impact sur les environnements de développement et de production.
---


# Node.js, la différence entre développement et production

`Il n'y a pas de différence entre le développement et la production dans Node.js`, c'est-à-dire qu'il n'y a pas de paramètres spécifiques que vous devez appliquer pour que Node.js fonctionne dans une configuration de production. Cependant, quelques bibliothèques dans le registre npm reconnaissent l'utilisation de la variable `NODE_ENV` et la définissent par défaut sur un paramètre de `development`. Exécutez toujours votre Node.js avec `NODE_ENV=production` défini.

Une façon populaire de configurer votre application est d'utiliser la [méthodologie des douze facteurs](https://12factor.net).

## NODE_ENV dans Express

Dans le framework [express](https://expressjs.com), extrêmement populaire, définir NODE_ENV sur production garantit généralement que :

+ la journalisation est réduite au minimum, au niveau essentiel
+ davantage de niveaux de mise en cache ont lieu pour optimiser les performances

Cela se fait généralement en exécutant la commande

```bash
export NODE_ENV=production
```

dans le shell, mais il est préférable de le mettre dans votre fichier de configuration shell (par exemple `.bash_profile` avec le shell Bash), car sinon le paramètre ne persiste pas en cas de redémarrage du système.

Vous pouvez également appliquer la variable d'environnement en la faisant précéder de votre commande d'initialisation d'application :

```bash
NODE_ENV=production node app.js
```

Par exemple, dans une application Express, vous pouvez l'utiliser pour définir différents gestionnaires d'erreurs par environnement :

```javascript
if (process.env.NODE_ENV === 'development') {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
}
if (process.env.NODE_ENV === 'production') {
  app.use(express.errorHandler());
}
```

Par exemple, [Pug](https://pugjs.org], la bibliothèque de modèles utilisée par [Express.js](https://expressjs.com], compile en mode débogage si `NODE_ENV` n'est pas défini sur `production`. Les vues Express sont compilées dans chaque requête en mode développement, tandis qu'en production, elles sont mises en cache. Il existe de nombreux autres exemples.

`Cette variable d'environnement est une convention largement utilisée dans les bibliothèques externes, mais pas dans Node.js lui-même.`

## Pourquoi NODE_ENV est-il considéré comme un antipattern ?

Un environnement est une plateforme numérique ou un système où les ingénieurs peuvent créer, tester, déployer et gérer des produits logiciels. Conventionnellement, il existe quatre étapes ou types d'environnements où notre application est exécutée :

+ Développement
+ Préproduction
+ Production
+ Test

Le problème fondamental de `NODE_ENV` découle du fait que les développeurs combinent les optimisations et le comportement du logiciel avec l'environnement dans lequel leur logiciel est exécuté. Le résultat est un code comme le suivant :

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

Bien que cela puisse sembler inoffensif, cela rend les environnements de production et de préproduction différents, ce qui rend les tests fiables impossibles. Par exemple, un test et donc une fonctionnalité de votre produit pourraient réussir lorsque `NODE_ENV` est défini sur `development`, mais échouer lorsque `NODE_ENV` est défini sur `production`. Par conséquent, définir `NODE_ENV` sur autre chose que `production` est considéré comme un antipattern.

