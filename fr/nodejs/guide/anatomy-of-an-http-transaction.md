---
title: Comprendre la gestion des requêtes HTTP avec Node.js
description: Un guide complet pour gérer les requêtes HTTP avec Node.js, couvrant des sujets tels que la création d'un serveur, la gestion des requêtes et des réponses, la routage et la gestion des erreurs.
head:
  - - meta
    - name: og:title
      content: Comprendre la gestion des requêtes HTTP avec Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Un guide complet pour gérer les requêtes HTTP avec Node.js, couvrant des sujets tels que la création d'un serveur, la gestion des requêtes et des réponses, la routage et la gestion des erreurs.
  - - meta
    - name: twitter:title
      content: Comprendre la gestion des requêtes HTTP avec Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Un guide complet pour gérer les requêtes HTTP avec Node.js, couvrant des sujets tels que la création d'un serveur, la gestion des requêtes et des réponses, la routage et la gestion des erreurs.
---


# Anatomie d'une transaction HTTP

Le but de ce guide est de donner une compréhension solide du processus de gestion HTTP de Node.js. Nous supposerons que vous savez, de manière générale, comment fonctionnent les requêtes HTTP, quel que soit le langage ou l'environnement de programmation. Nous supposerons également une certaine familiarité avec les EventEmitters et les Streams de Node.js. Si vous ne les connaissez pas tout à fait, il vaut la peine de lire rapidement la documentation de l'API pour chacun d'eux.

## Créer le serveur

Toute application de serveur Web Node devra à un moment donné créer un objet serveur Web. Ceci est fait en utilisant `createServer`.

```javascript
const http = require('node:http');
const server = http.createServer((request, response) => {
    // La magie opère ici !
});
```

La fonction qui est passée à `createServer` est appelée une fois pour chaque requête HTTP qui est faite contre ce serveur, elle est donc appelée le gestionnaire de requête. En fait, l'objet Server renvoyé par `createServer` est un EventEmitter, et ce que nous avons ici n'est qu'un raccourci pour créer un objet serveur et ensuite ajouter l'écouteur plus tard.

```javascript
const server = http.createServer();
server.on('request', (request, response) => {
    // le même genre de magie opère ici !
});
```

Lorsqu'une requête HTTP atteint le serveur, Node appelle la fonction de gestion de requête avec quelques objets pratiques pour traiter la transaction, la requête et la réponse. Nous y reviendrons sous peu. Afin de réellement servir les requêtes, la méthode `listen` doit être appelée sur l'objet serveur. Dans la plupart des cas, tout ce que vous aurez à passer à `listen` est le numéro de port sur lequel vous voulez que le serveur écoute. Il existe également d'autres options, alors consultez la référence de l'API.

## Méthode, URL et En-têtes

Lors de la gestion d'une requête, la première chose que vous voudrez probablement faire est de regarder la méthode et l'URL, afin que des actions appropriées puissent être prises. Node.js rend cela relativement indolore en plaçant des propriétés pratiques sur l'objet requête.

```javascript
const { method, url } = request;
```

L'objet requête est une instance de `IncomingMessage`. La méthode ici sera toujours une méthode/verbe HTTP normale. L'URL est l'URL complète sans le serveur, le protocole ou le port. Pour une URL typique, cela signifie tout ce qui suit et comprend le troisième slash.

Les en-têtes ne sont pas loin non plus. Ils sont dans leur propre objet sur la requête appelé `headers`.

```javascript
const { headers } = request;
const userAgent = headers['user-agent'];
```

Il est important de noter ici que tous les en-têtes sont représentés en minuscules uniquement, quelle que soit la manière dont le client les a réellement envoyés. Cela simplifie la tâche d'analyse des en-têtes à quelque fin que ce soit.

Si certains en-têtes sont répétés, leurs valeurs sont remplacées ou jointes sous forme de chaînes séparées par des virgules, selon l'en-tête. Dans certains cas, cela peut être problématique, donc `rawHeaders` est également disponible.


## Corps de la Requête

Lors de la réception d'une requête POST ou PUT, le corps de la requête peut être important pour votre application. Accéder aux données du corps est un peu plus complexe que d'accéder aux en-têtes de la requête. L'objet de requête qui est passé à un gestionnaire implémente l'interface `ReadableStream`. Ce flux peut être écouté ou redirigé ailleurs, comme n'importe quel autre flux. Nous pouvons extraire les données directement du flux en écoutant les événements `'data'` et `'end'` du flux.

Le fragment émis dans chaque événement `'data'` est un `Buffer`. Si vous savez qu'il s'agit de données de type chaîne de caractères, la meilleure chose à faire est de collecter les données dans un tableau, puis, à la fin de l'événement `'end'`, de les concaténer et de les convertir en chaîne de caractères.

```javascript
let body = [];
request.on('data', chunk => {
    body.push(chunk);
});
request.on('end', () => {
    body = Buffer.concat(body).toString();
    // à ce stade, 'body' contient l'intégralité du corps de la requête stocké sous forme de chaîne de caractères
});
```
::: tip REMARQUE
Cela peut sembler un peu fastidieux, et dans de nombreux cas, ça l'est. Heureusement, il existe des modules comme `concat-stream` et `body` sur npm qui peuvent aider à masquer une partie de cette logique. Il est important d'avoir une bonne compréhension de ce qui se passe avant de s'engager sur cette voie, et c'est pourquoi vous êtes ici !
:::

## Un Mot Rapide sur les Erreurs

Étant donné que l'objet de requête est un `ReadableStream`, il est également un `EventEmitter` et se comporte comme tel lorsqu'une erreur se produit.

Une erreur dans le flux de la requête se manifeste par l'émission d'un événement `'error'` sur le flux. Si vous n'avez pas d'écouteur pour cet événement, l'erreur sera levée, ce qui pourrait planter votre programme Node.js. Vous devez donc ajouter un écouteur `'error'` sur vos flux de requête, même si vous vous contentez de le journaliser et de continuer votre chemin. (Bien qu'il soit probablement préférable d'envoyer une sorte de réponse d'erreur HTTP. Plus d'informations à ce sujet plus tard.)

```javascript
request.on('error', err => {
    // Ceci affiche le message d'erreur et la pile d'exécution dans stderr.
    console.error(err.stack);
});
```

Il existe d'autres façons de [gérer ces erreurs](/fr/nodejs/api/errors) telles que d'autres abstractions et outils, mais soyez toujours conscient que des erreurs peuvent et se produisent, et que vous allez devoir les gérer.


## Ce que nous avons jusqu'à présent

À ce stade, nous avons couvert la création d'un serveur et l'extraction de la méthode, de l'URL, des en-têtes et du corps des requêtes. Lorsque nous mettons tout cela ensemble, cela pourrait ressembler à ceci :

```javascript
const http = require('node:http');

http.createServer((request, response) => {
    const { headers, method, url } = request;
    let body = [];
    request.on('error', err => console.error(err));
    request.on('data', chunk => {
        body.push(chunk);
    });
    request.on('end', () => {
        body = Buffer.concat(body).toString();
        // À ce stade, nous avons les en-têtes, la méthode, l'URL et le corps, et nous pouvons maintenant
        // faire tout ce que nous devons faire pour répondre à cette requête.
    });
});

.listen(8080); // Active ce serveur, en écoutant sur le port 8080.
```

Si nous exécutons cet exemple, nous pourrons recevoir des requêtes, mais pas y répondre. En fait, si vous atteignez cet exemple dans un navigateur Web, votre requête expirera, car rien n'est renvoyé au client.

Jusqu'à présent, nous n'avons pas du tout abordé l'objet response, qui est une instance de `ServerResponse`, qui est un `WritableStream`. Il contient de nombreuses méthodes utiles pour renvoyer des données au client. Nous allons aborder cela ensuite.

## Code d'état HTTP

Si vous ne vous souciez pas de le définir, le code d'état HTTP d'une réponse sera toujours 200. Bien sûr, toutes les réponses HTTP ne le justifient pas, et à un moment donné, vous voudrez certainement envoyer un code d'état différent. Pour ce faire, vous pouvez définir la propriété `statusCode`.

```javascript
response.statusCode = 404; // Indique au client que la ressource n'a pas été trouvée.
```

Il existe d'autres raccourcis à cela, comme nous le verrons bientôt.

## Définition des en-têtes de réponse

Les en-têtes sont définis via une méthode pratique appelée `setHeader`.

```javascript
response.setHeader('Content-Type', 'application/json');
response.setHeader('X-Powered-By', 'bacon');
```

Lors de la définition des en-têtes d'une réponse, la casse n'est pas sensible à leurs noms. Si vous définissez un en-tête à plusieurs reprises, la dernière valeur que vous définissez est la valeur qui est envoyée.


## Envoi explicite des données d'en-tête

Les méthodes de définition des en-têtes et du code d'état dont nous avons déjà discuté supposent que vous utilisez des "en-têtes implicites". Cela signifie que vous comptez sur Node pour envoyer les en-têtes à votre place au bon moment, avant de commencer à envoyer des données de corps.

Si vous le souhaitez, vous pouvez écrire explicitement les en-têtes dans le flux de réponse. Pour ce faire, il existe une méthode appelée `writeHead`, qui écrit le code d'état et les en-têtes dans le flux.

## Envoi explicite des données d'en-tête

```javascript
response.writeHead(200, {
    'Content-Type': 'application/json',
    'X-Powered-By': 'bacon',
});
```

Une fois que vous avez défini les en-têtes (implicitement ou explicitement), vous êtes prêt à commencer à envoyer des données de réponse.

## Envoi du corps de la réponse

Étant donné que l'objet de réponse est un `WritableStream`, l'écriture d'un corps de réponse au client consiste simplement à utiliser les méthodes de flux habituelles.

```javascript
response.write('<html>');
response.write('<body>');
response.write('<h1>Hello, World!</h1>');
response.write('</body>');
response.write('</html>');
response.end();
```

La fonction `end` sur les flux peut également prendre des données facultatives à envoyer comme dernier élément de données sur le flux, nous pouvons donc simplifier l'exemple ci-dessus comme suit.

```javascript
response.end('<html><body><h1>hello,world!</h1></body></html>');
```

::: tip NOTE
Il est important de définir l'état et les en-têtes avant de commencer à écrire des blocs de données dans le corps. Cela a du sens, car les en-têtes précèdent le corps dans les réponses HTTP.
:::

## Une autre chose rapide à propos des erreurs

Le flux de réponse peut également émettre des événements « erreur », et à un moment donné, vous devrez également y faire face. Tous les conseils pour les erreurs de flux de requête s'appliquent toujours ici.

## Tout mettre ensemble

Maintenant que nous avons appris à créer des réponses HTTP, mettons tout cela ensemble. En nous basant sur l'exemple précédent, nous allons créer un serveur qui renvoie toutes les données qui nous ont été envoyées par l'utilisateur. Nous formaterons ces données au format JSON à l'aide de `JSON.stringify`.

```javascript
const http = require('node:http');
http
  .createServer((request, response) => {
    const { headers, method, url } = request;
    let body = [];
    request
      .on('error', err => {
        console.error(err);
      })
      .on('data', chunk => {
        body.push(chunk);
      })
      .on('end', () => {
        body = Buffer.concat(body).toString();
        // BEGINNING OF NEW STUFF
        response.on('error', err => {
          console.error(err);
        });
        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');
        // Note: the 2 lines above could be replaced with this next one:
        // response.writeHead(200, {'Content-Type': 'application/json'})
        const responseBody = { headers, method, url, body };
        response.write(JSON.stringify(responseBody));
        response.end();
        // Note: the 2 lines above could be replaced with this next one:
        // response.end(JSON.stringify(responseBody))
        // END OF NEW STUFF
      });
  })
  .listen(8080);
```


## Exemple EchoServer

Simplifions l'exemple précédent pour créer un serveur d'écho simple, qui renvoie simplement les données reçues dans la requête directement dans la réponse. Tout ce que nous devons faire est de récupérer les données du flux de requête et d'écrire ces données dans le flux de réponse, comme nous l'avons fait précédemment.

```javascript
const http = require('node:http');

http.createServer((request, response) => {
    let body = [];
    request.on('data', chunk => {
        body.push(chunk);
    });
    request.on('end', () => {
        body = Buffer.concat(body).toString();
        response.end(body);
    });
});

.listen(8080);
```

Maintenant, ajustons cela. Nous voulons uniquement envoyer un écho dans les conditions suivantes :
- La méthode de requête est POST.
- L'URL est /echo.

Dans tous les autres cas, nous voulons simplement répondre avec un 404.

```javascript
const http = require('node:http');
http
  .createServer((request, response) => {
    if (request.method === 'POST' && request.url === '/echo') {
      let body = [];
      request
        .on('data', chunk => {
          body.push(chunk);
        })
        .on('end', () => {
          body = Buffer.concat(body).toString();
          response.end(body);
        });
    } else {
      response.statusCode = 404;
      response.end();
    }
  })
  .listen(8080);
```

::: tip NOTE
En vérifiant l'URL de cette manière, nous effectuons une forme de "routage". D'autres formes de routage peuvent être aussi simples que des instructions `switch` ou aussi complexes que des frameworks entiers comme `express`. Si vous recherchez quelque chose qui ne fait que du routage, essayez `router`.
:::

Super! Essayons maintenant de simplifier cela. N'oubliez pas que l'objet request est un `ReadableStream` et que l'objet response est un `WritableStream`. Cela signifie que nous pouvons utiliser `pipe` pour diriger les données de l'un à l'autre. C'est exactement ce que nous voulons pour un serveur d'écho!

```javascript
const http = require('node:http');

http.createServer((request, response) => {
    if (request.method === 'POST' && request.url === '/echo') {
        request.pipe(response);
    } else {
        response.statusCode = 404;
        response.end();
    }
})
.listen(8080);
```

Vive les streams !

Nous n'avons pas encore tout à fait terminé. Comme mentionné à plusieurs reprises dans ce guide, des erreurs peuvent se produire et se produisent, et nous devons les gérer.

Pour gérer les erreurs sur le flux de requête, nous allons enregistrer l'erreur dans `stderr` et envoyer un code d'état 400 pour indiquer une `Bad Request`. Dans une application du monde réel, cependant, nous voudrions inspecter l'erreur pour déterminer le code d'état et le message corrects. Comme d'habitude avec les erreurs, vous devriez consulter la [documentation sur les erreurs](/fr/nodejs/api/errors).

Sur la réponse, nous allons simplement enregistrer l'erreur dans `stderr`.

```javascript
const http = require('node:http');

http.createServer((request, response) => {
    request.on('error', err => {
        console.error(err);
        response.statusCode = 400;
        response.end();
    });
    response.on('error', err => {
        console.error(err);
    });
    if (request.method === 'POST' && request.url === '/echo') {
        request.pipe(response);
    } else {
        response.statusCode = 404;
        response.end();
    }
})
.listen(8080);
```

Nous avons maintenant couvert la plupart des bases de la gestion des requêtes HTTP. À ce stade, vous devriez être en mesure de :
- Instancier un serveur HTTP avec une fonction de gestionnaire `request`, et le faire écouter sur un port.
- Obtenir les en-têtes, l'URL, la méthode et les données de corps à partir des objets `request`.
- Prendre des décisions de routage en fonction de l'URL et/ou d'autres données dans les objets `request`.
- Envoyer des en-têtes, des codes d'état HTTP et des données de corps via des objets `response`.
- Transférer des données des objets `request` et vers les objets `response`.
- Gérer les erreurs de flux dans les flux `request` et `response`.

À partir de ces bases, des serveurs HTTP Node.js pour de nombreux cas d'utilisation typiques peuvent être construits. Il existe de nombreuses autres choses que ces API fournissent, alors assurez-vous de lire la documentation de l'API pour [`EventEmitters`](/fr/nodejs/api/events), [`Streams`](/fr/nodejs/api/stream) et [`HTTP`](/fr/nodejs/api/http).

