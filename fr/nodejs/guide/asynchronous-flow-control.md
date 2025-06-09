---
title: Contrôle du flux asynchrone dans JavaScript
description: Comprendre le contrôle du flux asynchrone dans JavaScript, y compris les rappels, la gestion des états et les modèles de flux de contrôle.
head:
  - - meta
    - name: og:title
      content: Contrôle du flux asynchrone dans JavaScript | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Comprendre le contrôle du flux asynchrone dans JavaScript, y compris les rappels, la gestion des états et les modèles de flux de contrôle.
  - - meta
    - name: twitter:title
      content: Contrôle du flux asynchrone dans JavaScript | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Comprendre le contrôle du flux asynchrone dans JavaScript, y compris les rappels, la gestion des états et les modèles de flux de contrôle.
---


# Contrôle de flux asynchrone

::: info
Le contenu de cet article est fortement inspiré du [Mixu's Node.js Book](http://book.mixu.net/node/ch7.html).
:::

JavaScript est conçu pour être non bloquant sur le thread "principal", c'est là que les vues sont rendues. Vous pouvez imaginer l'importance de ceci dans le navigateur. Lorsque le thread principal est bloqué, cela entraîne le fameux "gel" que les utilisateurs finaux redoutent, et aucun autre événement ne peut être déclenché, entraînant la perte d'acquisition de données, par exemple.

Cela crée des contraintes uniques que seul un style de programmation fonctionnel peut résoudre. C'est là que les callbacks entrent en jeu.

Cependant, les callbacks peuvent devenir difficiles à gérer dans des procédures plus compliquées. Cela aboutit souvent à "l'enfer des callbacks" où de multiples fonctions imbriquées avec des callbacks rendent le code plus difficile à lire, à déboguer, à organiser, etc.

```js
async1(function (input, result1) {
  async2(function (result2) {
    async3(function (result3) {
      async4(function (result4) {
        async5(function (output) {
          // faire quelque chose avec output
        });
      });
    });
  });
});
```

Bien sûr, dans la vie réelle, il y aurait très probablement des lignes de code supplémentaires pour gérer `result1`, `result2`, etc., ainsi, la longueur et la complexité de ce problème aboutissent généralement à un code qui est beaucoup plus désordonné que l'exemple ci-dessus.

**C'est là que les fonctions sont très utiles. Les opérations plus complexes sont constituées de nombreuses fonctions :**

1. style d'initiateur / entrée
2. middleware
3. terminateur

**Le "style d'initiateur / entrée" est la première fonction de la séquence. Cette fonction acceptera l'entrée originale, le cas échéant, pour l'opération. L'opération est une série exécutable de fonctions, et l'entrée originale sera principalement :**

1. variables dans un environnement global
2. invocation directe avec ou sans arguments
3. valeurs obtenues par le système de fichiers ou les requêtes réseau

Les requêtes réseau peuvent être des requêtes entrantes initiées par un réseau étranger, par une autre application sur le même réseau, ou par l'application elle-même sur le même réseau ou un réseau étranger.

Une fonction middleware renverra une autre fonction, et une fonction de terminateur invoquera le callback. Ce qui suit illustre le flux vers les requêtes réseau ou du système de fichiers. Ici, la latence est de 0 car toutes ces valeurs sont disponibles en mémoire.

```js
function final(someInput, callback) {
  callback(`${someInput} et terminé par l'exécution du callback `);
}
function middleware(someInput, callback) {
  return final(`${someInput} touché par le middleware `, callback);
}
function initiate() {
  const someInput = 'bonjour ceci est une fonction ';
  middleware(someInput, function (result) {
    console.log(result);
    // nécessite un callback pour `return` result
  });
}
initiate();
```


## Gestion de l'état

Les fonctions peuvent être dépendantes ou non de l'état. La dépendance de l'état se produit lorsque l'entrée ou une autre variable d'une fonction dépend d'une fonction externe.

**De cette manière, il existe deux stratégies principales pour la gestion de l'état :**

1. passer les variables directement à une fonction, et
2. acquérir une valeur de variable à partir d'un cache, d'une session, d'un fichier, d'une base de données, d'un réseau ou d'une autre source externe.

Notez que je n'ai pas mentionné les variables globales. La gestion de l'état avec des variables globales est souvent un anti-pattern négligé qui rend difficile, voire impossible, de garantir l'état. Les variables globales dans les programmes complexes doivent être évitées autant que possible.

## Flux de contrôle

Si un objet est disponible en mémoire, l'itération est possible et il n'y aura pas de changement de flux de contrôle :

```js
function getSong() {
  let _song = '';
  let i = 100;
  for (i; i > 0; i -= 1) {
    _song += `${i} bières au mur, tu en prends une et tu la fais passer, ${
      i - 1
    } bouteilles de bière au mur\n`;
    if (i === 1) {
      _song += "Hé, allons chercher de la bière";
    }
  }
  return _song;
}
function singSong(_song) {
  if (!_song) throw new Error("la chanson est '' vide, DONNEZ-MOI UNE CHANSON !");
  console.log(_song);
}
const song = getSong();
// ceci fonctionnera
singSong(song);
```

Cependant, si les données existent en dehors de la mémoire, l'itération ne fonctionnera plus :

```js
function getSong() {
  let _song = '';
  let i = 100;
  for (i; i > 0; i -= 1) {
    /* eslint-disable no-loop-func */
    setTimeout(function () {
      _song += `${i} bières au mur, tu en prends une et tu la fais passer, ${
        i - 1
      } bouteilles de bière au mur\n`;
      if (i === 1) {
        _song += "Hé, allons chercher de la bière";
      }
    }, 0);
    /* eslint-enable no-loop-func */
  }
  return _song;
}
function singSong(_song) {
  if (!_song) throw new Error("la chanson est '' vide, DONNEZ-MOI UNE CHANSON !");
  console.log(_song);
}
const song = getSong('beer');
// ceci ne fonctionnera pas
singSong(song);
// Uncaught Error: song is '' empty, FEED ME A SONG!
```

Pourquoi cela s'est-il produit ? `setTimeout` indique au CPU de stocker les instructions ailleurs sur le bus et indique que les données doivent être récupérées ultérieurement. Des milliers de cycles CPU se passent avant que la fonction ne revienne à la marque de 0 milliseconde, le CPU récupère les instructions du bus et les exécute. Le seul problème est que la chanson ('') a été renvoyée des milliers de cycles auparavant.

La même situation se produit lors de la gestion des systèmes de fichiers et des requêtes réseau. Le thread principal ne peut tout simplement pas être bloqué pendant une période indéterminée - par conséquent, nous utilisons des rappels pour planifier l'exécution du code dans le temps de manière contrôlée.

Vous pourrez effectuer presque toutes vos opérations avec les 3 modèles suivants :

1. **En série :** les fonctions seront exécutées dans un ordre séquentiel strict, celui-ci est le plus similaire aux boucles `for`.

```js
// opérations définies ailleurs et prêtes à être exécutées
const operations = [
  { func: function1, args: args1 },
  { func: function2, args: args2 },
  { func: function3, args: args3 },
];
function executeFunctionWithArgs(operation, callback) {
  // exécute la fonction
  const { args, func } = operation;
  func(args, callback);
}
function serialProcedure(operation) {
  if (!operation) process.exit(0); // terminé
  executeFunctionWithArgs(operation, function (result) {
    // continue APRÈS le rappel
    serialProcedure(operations.shift());
  });
}
serialProcedure(operations.shift());
```

2. `Parallèle complet` : lorsque l'ordre n'est pas un problème, comme l'envoi d'un courriel à une liste de 1 000 000 de destinataires.

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
  // `sendEmail` est un client SMTP hypothétique
  sendMail(
    {
      subject: 'Dîner ce soir',
      message: 'Nous avons beaucoup de chou dans l'assiette. Tu viens ?',
      smtp: recipient.email,
    },
    callback
  );
}
function final(result) {
  console.log(`Résultat : ${result.count} tentatives \
      & ${result.success} courriels réussis`);
  if (result.failed.length)
    console.log(`Échec de l'envoi à : \
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

3. **Parallèle limité** : parallèle avec une limite, comme l'envoi réussi de courriels à 1 000 000 de destinataires à partir d'une liste de 10 millions d'utilisateurs.

```js
let successCount = 0;
function final() {
  console.log(`dispatched ${successCount} emails`);
  console.log('finished');
}
function dispatch(recipient, callback) {
  // `sendEmail` est un client SMTP hypothétique
  sendMail(
    {
      subject: 'Dîner ce soir',
      message: 'Nous avons beaucoup de chou dans l'assiette. Tu viens ?',
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

Chacun a ses propres cas d'utilisation, avantages et problèmes que vous pouvez expérimenter et lire plus en détail. Plus important encore, n'oubliez pas de modulariser vos opérations et d'utiliser des rappels ! Si vous avez le moindre doute, traitez tout comme s'il s'agissait d'un middleware !

