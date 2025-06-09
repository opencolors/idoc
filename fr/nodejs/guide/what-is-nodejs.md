---
title: Introduction à Node.js
description: Node.js est un environnement d'exécution JavaScript open-source et multiplateforme qui permet aux développeurs d'exécuter JavaScript côté serveur, offrant des performances élevées et une grande évolutivité.
head:
  - - meta
    - name: og:title
      content: Introduction à Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js est un environnement d'exécution JavaScript open-source et multiplateforme qui permet aux développeurs d'exécuter JavaScript côté serveur, offrant des performances élevées et une grande évolutivité.
  - - meta
    - name: twitter:title
      content: Introduction à Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js est un environnement d'exécution JavaScript open-source et multiplateforme qui permet aux développeurs d'exécuter JavaScript côté serveur, offrant des performances élevées et une grande évolutivité.
---


# Introduction à Node.js

Node.js est un environnement d'exécution JavaScript open source et multiplateforme. C'est un outil populaire pour presque tous les types de projets !

Node.js exécute le moteur JavaScript V8, le cœur de Google Chrome, en dehors du navigateur. Cela permet à Node.js d'être très performant.

Une application Node.js s'exécute dans un seul processus, sans créer un nouveau thread pour chaque requête. Node.js fournit un ensemble de primitives d'E/S asynchrones dans sa bibliothèque standard qui empêchent le code JavaScript de se bloquer et, généralement, les bibliothèques dans Node.js sont écrites en utilisant des paradigmes non bloquants, faisant du comportement bloquant l'exception plutôt que la norme.

Lorsque Node.js effectue une opération d'E/S, comme la lecture à partir du réseau, l'accès à une base de données ou au système de fichiers, au lieu de bloquer le thread et de gaspiller des cycles CPU en attendant, Node.js reprendra les opérations lorsque la réponse reviendra.

Cela permet à Node.js de gérer des milliers de connexions simultanées avec un seul serveur sans introduire la charge de la gestion de la concurrence des threads, ce qui pourrait être une source importante de bugs.

Node.js a un avantage unique, car des millions de développeurs frontaux qui écrivent du JavaScript pour le navigateur sont maintenant capables d'écrire le code côté serveur en plus du code côté client sans avoir à apprendre un langage complètement différent.

Dans Node.js, les nouvelles normes ECMAScript peuvent être utilisées sans problème, car vous n'avez pas à attendre que tous vos utilisateurs mettent à jour leurs navigateurs - vous êtes responsable de la décision de la version ECMAScript à utiliser en modifiant la version de Node.js, et vous pouvez également activer des fonctionnalités expérimentales spécifiques en exécutant Node.js avec des flags.

## Un exemple d'application Node.js

L'exemple le plus courant de Hello World de Node.js est un serveur web :

```js
import { createServer } from 'node:http'
const hostname = '127.0.0.1'
const port = 3000
const server = createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  res.end('Hello World')
})
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})
```

Pour exécuter cet extrait, enregistrez-le sous le nom de fichier `server.js` et exécutez `node server.js` dans votre terminal. Si vous utilisez la version mjs du code, vous devez l'enregistrer sous le nom de fichier `server.mjs` et exécuter `node server.mjs` dans votre terminal.

Ce code inclut d'abord le [module http](/fr/nodejs/api/http) de Node.js.

Node.js possède une [bibliothèque standard](/fr/nodejs/api/synopsis) fantastique, incluant un support de premier ordre pour la mise en réseau.

La méthode `createServer()` de `http` crée un nouveau serveur HTTP et le renvoie.

Le serveur est configuré pour écouter sur le port et le nom d'hôte spécifiés. Lorsque le serveur est prêt, la fonction de rappel est appelée, dans ce cas pour nous informer que le serveur est en cours d'exécution.

Chaque fois qu'une nouvelle requête est reçue, l'[événement request](/fr/nodejs/api/http) est appelé, fournissant deux objets : une requête (un objet `http.IncomingMessage`) et une réponse (un objet `http.ServerResponse`).

Ces 2 objets sont essentiels pour gérer l'appel HTTP.

Le premier fournit les détails de la requête. Dans cet exemple simple, il n'est pas utilisé, mais vous pouvez accéder aux en-têtes de requête et aux données de requête.

Le second est utilisé pour renvoyer des données à l'appelant.

Dans ce cas, avec :

```js
res.setHeader('Content-Type', 'text/plain')
```

nous définissons la propriété statusCode à 200, pour indiquer une réponse réussie.

Nous définissons l'en-tête Content-Type :

```js
res.setHeader('Content-Type', 'text/plain')
```

et nous fermons la réponse, en ajoutant le contenu comme argument à `end()` :

```js
res.end('Hello World')
```

Cela enverra la réponse au client.

