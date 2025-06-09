---
title: Comment lire les variables d'environnement dans Node.js
description: Découvrez comment accéder aux variables d'environnement dans Node.js en utilisant la propriété process.env et les fichiers .env.
head:
  - - meta
    - name: og:title
      content: Comment lire les variables d'environnement dans Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Découvrez comment accéder aux variables d'environnement dans Node.js en utilisant la propriété process.env et les fichiers .env.
  - - meta
    - name: twitter:title
      content: Comment lire les variables d'environnement dans Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Découvrez comment accéder aux variables d'environnement dans Node.js en utilisant la propriété process.env et les fichiers .env.
---


# Comment lire les variables d'environnement depuis Node.js

Le module central `process` de Node.js fournit la propriété `env` qui héberge toutes les variables d'environnement qui ont été définies au moment où le processus a été démarré.

Le code ci-dessous exécute `app.js` et définit `USER_ID` et `USER_KEY`.

```bash
USER_ID=239482 USER_KEY=foobar node app.js
```

Cela passera l'utilisateur `USER_ID` comme 239482 et la `USER_KEY` comme foobar. Ceci est approprié pour les tests, cependant pour la production, vous configurerez probablement des scripts bash pour exporter les variables.

::: tip NOTE
`process` ne nécessite pas de `"require"`, il est automatiquement disponible.
:::

Voici un exemple qui accède aux variables d'environnement `USER_ID` et `USER_KEY`, que nous avons définies dans le code ci-dessus.

```javascript
process.env.USER_ID; // "239482
process.env.USER_KEY; // "foobar
```

De la même manière, vous pouvez accéder à n'importe quelle variable d'environnement personnalisée que vous définissez. Node.js 20 a introduit un [support expérimental pour les fichiers .env](/fr/nodejs/api/cli#env-file-config).

Maintenant, vous pouvez utiliser l'option `--env-file` pour spécifier un fichier d'environnement lors de l'exécution de votre application Node.js. Voici un exemple de fichier `.env` et comment accéder à ses variables en utilisant `process.env`.

```bash
.env file
PORT=3000
```

Dans votre fichier js

```javascript
process.env.PORT; // 3000
```

Exécutez le fichier `app.js` avec les variables d'environnement définies dans le fichier `.env`.

```js
node --env-file=.env app.js
```

Cette commande charge toutes les variables d'environnement du fichier `.env`, les rendant disponibles à l'application sur `process.env`. De plus, vous pouvez passer plusieurs arguments --env-file. Les fichiers suivants remplacent les variables préexistantes définies dans les fichiers précédents.

```bash
node --env-file=.env --env-file=.development.env app.js
```
::: tip NOTE
si la même variable est définie dans l'environnement et dans le fichier, la valeur de l'environnement est prioritaire.
:::

