---
title: Documentation Node.js - Module Domaine
description: Le module Domaine dans Node.js offre un moyen de gérer les erreurs et les exceptions dans le code asynchrone, permettant une gestion des erreurs et des opérations de nettoyage plus robustes.
head:
  - - meta
    - name: og:title
      content: Documentation Node.js - Module Domaine | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Le module Domaine dans Node.js offre un moyen de gérer les erreurs et les exceptions dans le code asynchrone, permettant une gestion des erreurs et des opérations de nettoyage plus robustes.
  - - meta
    - name: twitter:title
      content: Documentation Node.js - Module Domaine | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Le module Domaine dans Node.js offre un moyen de gérer les erreurs et les exceptions dans le code asynchrone, permettant une gestion des erreurs et des opérations de nettoyage plus robustes.
---


# Domaine {#domain}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v8.8.0 | Tous les `Promise` créés dans des contextes de VM n'ont plus de propriété `.domain`. Cependant, leurs gestionnaires sont toujours exécutés dans le domaine approprié, et les `Promise` créés dans le contexte principal possèdent toujours une propriété `.domain`. |
| v8.0.0 | Les gestionnaires pour les `Promise` sont maintenant invoqués dans le domaine dans lequel la première promesse d'une chaîne a été créée. |
| v1.4.2 | Déprécié depuis : v1.4.2 |
:::

::: danger [Stable : 0 - Déprécié]
[Stable : 0](/fr/nodejs/api/documentation#stability-index) [Stabilité : 0](/fr/nodejs/api/documentation#stability-index) - Déprécié
:::

**Code source :** [lib/domain.js](https://github.com/nodejs/node/blob/v23.5.0/lib/domain.js)

**Ce module est en attente de dépréciation.** Une fois qu'une API de remplacement aura été finalisée, ce module sera entièrement déprécié. La plupart des développeurs ne devraient **pas** avoir à utiliser ce module. Les utilisateurs qui ont absolument besoin des fonctionnalités fournies par les domaines peuvent s'y fier pour le moment, mais doivent s'attendre à devoir migrer vers une solution différente à l'avenir.

Les domaines fournissent un moyen de gérer plusieurs opérations d'E/S différentes en tant que groupe unique. Si l'un des émetteurs d'événements ou des rappels enregistrés dans un domaine émet un événement `'error'`, ou lève une erreur, alors l'objet de domaine sera notifié, au lieu de perdre le contexte de l'erreur dans le gestionnaire `process.on('uncaughtException')`, ou de provoquer la sortie immédiate du programme avec un code d'erreur.

## Avertissement : N'ignorez pas les erreurs ! {#warning-dont-ignore-errors!}

Les gestionnaires d'erreurs de domaine ne remplacent pas la fermeture d'un processus lorsqu'une erreur se produit.

De par la nature même du fonctionnement de [`throw`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw) en JavaScript, il n'y a presque jamais de moyen de "reprendre là où on s'était arrêté" en toute sécurité, sans fuite de références, ou en créant une autre sorte d'état fragile indéfini.

La façon la plus sûre de répondre à une erreur levée est de fermer le processus. Bien sûr, dans un serveur Web normal, il peut y avoir de nombreuses connexions ouvertes, et il n'est pas raisonnable de les fermer brusquement parce qu'une erreur a été déclenchée par quelqu'un d'autre.

La meilleure approche consiste à envoyer une réponse d'erreur à la requête qui a déclenché l'erreur, tout en laissant les autres se terminer dans leur temps normal, et d'arrêter d'écouter les nouvelles requêtes dans ce worker.

De cette façon, l'utilisation de `domain` va de pair avec le module cluster, car le processus principal peut forker un nouveau worker lorsqu'un worker rencontre une erreur. Pour les programmes Node.js qui s'étendent à plusieurs machines, le proxy de terminaison ou le registre de service peut prendre note de l'échec et réagir en conséquence.

Par exemple, ce n'est pas une bonne idée :

```js [ESM]
// XXX ATTENTION ! MAUVAISE IDÉE !

const d = require('node:domain').create();
d.on('error', (er) => {
  // L'erreur ne fera pas planter le processus, mais ce qu'elle fait est pire !
  // Bien que nous ayons empêché le redémarrage brutal du processus, nous fuyons
  // beaucoup de ressources si cela se produit.
  // Ce n'est pas mieux que process.on('uncaughtException') !
  console.log(`erreur, mais tant pis ${er.message}`);
});
d.run(() => {
  require('node:http').createServer((req, res) => {
    handleRequest(req, res);
  }).listen(PORT);
});
```
En utilisant le contexte d'un domaine, et la résilience de la séparation de notre programme en plusieurs processus worker, nous pouvons réagir de manière plus appropriée et gérer les erreurs avec beaucoup plus de sécurité.

```js [ESM]
// Bien mieux !

const cluster = require('node:cluster');
const PORT = +process.env.PORT || 1337;

if (cluster.isPrimary) {
  // Un scénario plus réaliste aurait plus de 2 workers,
  // et peut-être ne pas mettre le principal et le worker dans le même fichier.
  //
  // Il est également possible d'être un peu plus sophistiqué en matière de journalisation, et
  // implémenter toute logique personnalisée nécessaire pour prévenir les attaques DoS
  // et autres mauvais comportements.
  //
  // Voir les options dans la documentation du cluster.
  //
  // L'important est que le principal fasse très peu,
  // augmentant notre résilience aux erreurs inattendues.

  cluster.fork();
  cluster.fork();

  cluster.on('disconnect', (worker) => {
    console.error('déconnexion !');
    cluster.fork();
  });

} else {
  // le worker
  //
  // C'est là que nous mettons nos bugs !

  const domain = require('node:domain');

  // Voir la documentation du cluster pour plus de détails sur l'utilisation
  // des processus worker pour servir les requêtes. Comment ça marche, les mises en garde, etc.

  const server = require('node:http').createServer((req, res) => {
    const d = domain.create();
    d.on('error', (er) => {
      console.error(`erreur ${er.stack}`);

      // Nous sommes en territoire dangereux !
      // Par définition, quelque chose d'inattendu s'est produit,
      // ce que nous ne voulions probablement pas.
      // Tout peut arriver maintenant ! Soyez très prudent !

      try {
        // Assurez-vous que nous fermons dans les 30 secondes
        const killtimer = setTimeout(() => {
          process.exit(1);
        }, 30000);
        // Mais ne gardez pas le processus ouvert juste pour ça !
        killtimer.unref();

        // Arrêtez de prendre de nouvelles requêtes.
        server.close();

        // Faites savoir au principal que nous sommes morts. Cela déclenchera une
        // 'déconnexion' dans le principal du cluster, puis il forkera
        // un nouveau worker.
        cluster.worker.disconnect();

        // Essayez d'envoyer une erreur à la requête qui a déclenché le problème
        res.statusCode = 500;
        res.setHeader('content-type', 'text/plain');
        res.end('Oups, il y a eu un problème !\n');
      } catch (er2) {
        // Tant pis, on ne peut pas faire grand-chose à ce stade.
        console.error(`Erreur lors de l'envoi de 500 ! ${er2.stack}`);
      }
    });

    // Parce que req et res ont été créés avant l'existence de ce domaine,
    // nous devons les ajouter explicitement.
    // Voir l'explication de la liaison implicite vs explicite ci-dessous.
    d.add(req);
    d.add(res);

    // Maintenant, exécutez la fonction de gestionnaire dans le domaine.
    d.run(() => {
      handleRequest(req, res);
    });
  });
  server.listen(PORT);
}

// Cette partie n'est pas importante. Juste un exemple de routage.
// Mettez une logique d'application sophistiquée ici.
function handleRequest(req, res) {
  switch (req.url) {
    case '/error':
      // Nous faisons des trucs asynchrones, et puis...
      setTimeout(() => {
        // Oups !
        flerb.bark();
      }, timeout);
      break;
    default:
      res.end('ok');
  }
}
```

## Ajouts aux objets `Error` {#additions-to-error-objects}

Chaque fois qu'un objet `Error` est acheminé via un domaine, quelques champs supplémentaires lui sont ajoutés.

- `error.domain` Le domaine qui a géré l'erreur en premier.
- `error.domainEmitter` L'émetteur d'événements qui a émis un événement `'error'` avec l'objet d'erreur.
- `error.domainBound` La fonction de rappel qui a été liée au domaine, et à laquelle une erreur a été passée comme premier argument.
- `error.domainThrown` Un booléen indiquant si l'erreur a été levée, émise ou transmise à une fonction de rappel liée.

## Liaison implicite {#implicit-binding}

Si les domaines sont utilisés, alors tous les **nouveaux** objets `EventEmitter` (y compris les objets Stream, les requêtes, les réponses, etc.) seront implicitement liés au domaine actif au moment de leur création.

De plus, les fonctions de rappel passées aux requêtes de boucle d'événements de bas niveau (telles que `fs.open()`, ou d'autres méthodes acceptant des rappels) seront automatiquement liées au domaine actif. Si elles lèvent une exception, le domaine interceptera l'erreur.

Afin d'éviter une utilisation excessive de la mémoire, les objets `Domain` eux-mêmes ne sont pas implicitement ajoutés en tant qu'enfants du domaine actif. S'ils l'étaient, il serait trop facile d'empêcher la récupération correcte des objets de requête et de réponse par le garbage collector.

Pour imbriquer les objets `Domain` en tant qu'enfants d'un `Domain` parent, ils doivent être ajoutés explicitement.

La liaison implicite achemine les erreurs levées et les événements `'error'` vers l'événement `'error'` du `Domain`, mais n'enregistre pas le `EventEmitter` sur le `Domain`. La liaison implicite ne prend en charge que les erreurs levées et les événements `'error'`.

## Liaison explicite {#explicit-binding}

Parfois, le domaine utilisé n'est pas celui qui devrait être utilisé pour un émetteur d'événements spécifique. Ou, l'émetteur d'événements aurait pu être créé dans le contexte d'un domaine, mais devrait plutôt être lié à un autre domaine.

Par exemple, il pourrait y avoir un domaine utilisé pour un serveur HTTP, mais nous pourrions souhaiter avoir un domaine séparé à utiliser pour chaque requête.

Cela est possible via la liaison explicite.

```js [ESM]
// Créer un domaine de niveau supérieur pour le serveur
const domain = require('node:domain');
const http = require('node:http');
const serverDomain = domain.create();

serverDomain.run(() => {
  // Le serveur est créé dans le contexte de serverDomain
  http.createServer((req, res) => {
    // Req et res sont également créés dans le contexte de serverDomain
    // Cependant, nous préférerions avoir un domaine séparé pour chaque requête.
    // Créez-le en premier et ajoutez req et res.
    const reqd = domain.create();
    reqd.add(req);
    reqd.add(res);
    reqd.on('error', (er) => {
      console.error('Error', er, req.url);
      try {
        res.writeHead(500);
        res.end('Une erreur s'est produite, désolé.');
      } catch (er2) {
        console.error('Erreur lors de l\'envoi de 500', er2, req.url);
      }
    });
  }).listen(1337);
});
```

## `domain.create()` {#domaincreate}

- Renvoie : [\<Domain\>](/fr/nodejs/api/domain#class-domain)

## Classe : `Domain` {#class-domain}

- Hérite de : [\<EventEmitter\>](/fr/nodejs/api/events#class-eventemitter)

La classe `Domain` encapsule la fonctionnalité de routage des erreurs et des exceptions non interceptées vers l’objet `Domain` actif.

Pour gérer les erreurs qu’elle intercepte, écoutez son événement `'error'`.

### `domain.members` {#domainmembers}

- [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

Un tableau de minuteurs et d’émetteurs d’événements qui ont été explicitement ajoutés au domaine.

### `domain.add(emitter)` {#domainaddemitter}

- `emitter` [\<EventEmitter\>](/fr/nodejs/api/events#class-eventemitter) | [\<Timer\>](/fr/nodejs/api/timers#timers) émetteur ou minuteur à ajouter au domaine

Ajoute explicitement un émetteur au domaine. Si des gestionnaires d’événements appelés par l’émetteur lèvent une erreur, ou si l’émetteur émet un événement `'error'`, il sera routé vers l’événement `'error'` du domaine, comme avec la liaison implicite.

Cela fonctionne également avec les minuteurs qui sont renvoyés par [`setInterval()`](/fr/nodejs/api/timers#setintervalcallback-delay-args) et [`setTimeout()`](/fr/nodejs/api/timers#settimeoutcallback-delay-args). Si leur fonction de rappel lève une exception, elle sera interceptée par le gestionnaire `'error'` du domaine.

Si le minuteur ou `EventEmitter` était déjà lié à un domaine, il est supprimé de celui-ci et lié à celui-ci à la place.

### `domain.bind(callback)` {#domainbindcallback}

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La fonction de rappel
- Renvoie : [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La fonction liée

La fonction renvoyée sera un wrapper autour de la fonction de rappel fournie. Lorsque la fonction renvoyée est appelée, toutes les erreurs qui sont levées seront routées vers l’événement `'error'` du domaine.

```js [ESM]
const d = domain.create();

function readSomeFile(filename, cb) {
  fs.readFile(filename, 'utf8', d.bind((er, data) => {
    // Si cela lève une exception, elle sera également transmise au domaine.
    return cb(er, data ? JSON.parse(data) : null);
  }));
}

d.on('error', (er) => {
  // Une erreur s’est produite quelque part. Si nous la levons maintenant, cela plantera le programme
  // avec le numéro de ligne normal et le message de pile.
});
```

### `domain.enter()` {#domainenter}

La méthode `enter()` est un mécanisme utilisé par les méthodes `run()`, `bind()` et `intercept()` pour définir le domaine actif. Elle définit `domain.active` et `process.domain` sur le domaine, et pousse implicitement le domaine sur la pile de domaines gérée par le module `domain` (voir [`domain.exit()`](/fr/nodejs/api/domain#domainexit) pour plus de détails sur la pile de domaines). L'appel à `enter()` délimite le début d'une chaîne d'appels asynchrones et d'opérations d'E/S liées à un domaine.

L'appel à `enter()` ne modifie que le domaine actif et ne modifie pas le domaine lui-même. `enter()` et `exit()` peuvent être appelés un nombre arbitraire de fois sur un seul domaine.

### `domain.exit()` {#domainexit}

La méthode `exit()` quitte le domaine actuel, le retirant de la pile de domaines. Chaque fois que l'exécution va passer au contexte d'une chaîne différente d'appels asynchrones, il est important de s'assurer que le domaine actuel est quitté. L'appel à `exit()` délimite soit la fin, soit une interruption de la chaîne d'appels asynchrones et d'opérations d'E/S liées à un domaine.

S'il existe plusieurs domaines imbriqués liés au contexte d'exécution actuel, `exit()` quittera tous les domaines imbriqués dans ce domaine.

L'appel à `exit()` ne modifie que le domaine actif et ne modifie pas le domaine lui-même. `enter()` et `exit()` peuvent être appelés un nombre arbitraire de fois sur un seul domaine.

### `domain.intercept(callback)` {#domaininterceptcallback}

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La fonction de rappel
- Retourne : [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La fonction interceptée

Cette méthode est presque identique à [`domain.bind(callback)`](/fr/nodejs/api/domain#domainbindcallback). Cependant, en plus d'intercepter les erreurs levées, elle interceptera également les objets [`Error`](/fr/nodejs/api/errors#class-error) envoyés comme premier argument à la fonction.

De cette façon, le modèle courant `if (err) return callback(err);` peut être remplacé par un seul gestionnaire d'erreurs en un seul endroit.

```js [ESM]
const d = domain.create();

function readSomeFile(filename, cb) {
  fs.readFile(filename, 'utf8', d.intercept((data) => {
    // Notez que le premier argument n'est jamais passé au
    // rappel car il est supposé être l'argument 'Error'
    // et donc intercepté par le domaine.

    // Si cela lève une exception, elle sera également transmise au domaine
    // afin que la logique de gestion des erreurs puisse être déplacée vers l'événement 'error'
    // sur le domaine au lieu d'être répétée dans tout
    // le programme.
    return cb(null, JSON.parse(data));
  }));
}

d.on('error', (er) => {
  // Une erreur s'est produite quelque part. Si nous la levons maintenant, cela plantera le programme
  // avec le numéro de ligne et le message de pile normaux.
});
```

### `domain.remove(emitter)` {#domainremoveemitter}

- `emitter` [\<EventEmitter\>](/fr/nodejs/api/events#class-eventemitter) | [\<Timer\>](/fr/nodejs/api/timers#timers) émetteur ou minuteur à supprimer du domaine

L'opposé de [`domain.add(emitter)`](/fr/nodejs/api/domain#domainaddemitter). Supprime la gestion de domaine de l'émetteur spécifié.

### `domain.run(fn[, ...args])` {#domainrunfn-args}

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- `...args` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Exécute la fonction fournie dans le contexte du domaine, en liant implicitement tous les émetteurs d'événements, les minuteurs et les requêtes de bas niveau qui sont créés dans ce contexte. En option, des arguments peuvent être passés à la fonction.

C'est la façon la plus basique d'utiliser un domaine.

```js [ESM]
const domain = require('node:domain');
const fs = require('node:fs');
const d = domain.create();
d.on('error', (er) => {
  console.error('Erreur détectée !', er);
});
d.run(() => {
  process.nextTick(() => {
    setTimeout(() => { // Simulation de diverses choses asynchrones
      fs.open('fichier inexistant', 'r', (er, fd) => {
        if (er) throw er;
        // procéder...
      });
    }, 100);
  });
});
```
Dans cet exemple, le gestionnaire `d.on('error')` sera déclenché, au lieu de planter le programme.

## Domaines et promesses {#domains-and-promises}

À partir de Node.js 8.0.0, les gestionnaires de promesses sont exécutés à l'intérieur du domaine dans lequel l'appel à `.then()` ou `.catch()` lui-même a été effectué :

```js [ESM]
const d1 = domain.create();
const d2 = domain.create();

let p;
d1.run(() => {
  p = Promise.resolve(42);
});

d2.run(() => {
  p.then((v) => {
    // exécution dans d2
  });
});
```
Un rappel peut être lié à un domaine spécifique en utilisant [`domain.bind(callback)`](/fr/nodejs/api/domain#domainbindcallback) :

```js [ESM]
const d1 = domain.create();
const d2 = domain.create();

let p;
d1.run(() => {
  p = Promise.resolve(42);
});

d2.run(() => {
  p.then(p.domain.bind((v) => {
    // exécution dans d1
  }));
});
```
Les domaines n'interféreront pas avec les mécanismes de gestion des erreurs pour les promesses. En d'autres termes, aucun événement `'error'` ne sera émis pour les rejets `Promise` non gérés.

