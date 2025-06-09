---
title: Ne bloquez pas la boucle d'événements (ou la piscine de travail)
description: Comment écrire un serveur Web à haute performance et plus résistant aux attaques DoS en évitant de bloquer la boucle d'événements et la piscine de travail dans Node.js.
head:
  - - meta
    - name: og:title
      content: Ne bloquez pas la boucle d'événements (ou la piscine de travail) | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Comment écrire un serveur Web à haute performance et plus résistant aux attaques DoS en évitant de bloquer la boucle d'événements et la piscine de travail dans Node.js.
  - - meta
    - name: twitter:title
      content: Ne bloquez pas la boucle d'événements (ou la piscine de travail) | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Comment écrire un serveur Web à haute performance et plus résistant aux attaques DoS en évitant de bloquer la boucle d'événements et la piscine de travail dans Node.js.
---


# Ne bloquez pas la boucle d'événements (ni le pool de travailleurs)

## Devez-vous lire ce guide ?

Si vous écrivez quelque chose de plus compliqué qu'un bref script en ligne de commande, la lecture de ce guide devrait vous aider à écrire des applications plus performantes et plus sécurisées.

Ce document est écrit en pensant aux serveurs Node.js, mais les concepts s'appliquent également aux applications Node.js complexes. Lorsque les détails spécifiques au système d'exploitation varient, ce document est centré sur Linux.

## Résumé

Node.js exécute le code JavaScript dans la boucle d'événements (initialisation et rappels), et offre un pool de travailleurs pour gérer les tâches coûteuses comme les E/S de fichiers. Node.js évolue bien, parfois mieux que des approches plus lourdes comme Apache. Le secret de l'évolutivité de Node.js est qu'il utilise un petit nombre de threads pour gérer de nombreux clients. Si Node.js peut se contenter de moins de threads, il peut consacrer plus de temps et de mémoire de votre système à travailler sur les clients plutôt que sur les frais généraux d'espace et de temps pour les threads (mémoire, commutation de contexte). Mais comme Node.js n'a que quelques threads, vous devez structurer votre application pour les utiliser judicieusement.

Voici une bonne règle de base pour maintenir la rapidité de votre serveur Node.js : *Node.js est rapide lorsque le travail associé à chaque client à un moment donné est "petit".*

Cela s'applique aux rappels sur la boucle d'événements et aux tâches sur le pool de travailleurs.

## Pourquoi devrais-je éviter de bloquer la boucle d'événements et le pool de travailleurs ?

Node.js utilise un petit nombre de threads pour gérer de nombreux clients. Dans Node.js, il existe deux types de threads : une boucle d'événements (aka la boucle principale, le thread principal, le thread d'événements, etc.) et un pool de `k` travailleurs dans un pool de travailleurs (aka le pool de threads).

Si un thread met beaucoup de temps à exécuter un rappel (boucle d'événements) ou une tâche (travailleur), nous l'appelons "bloqué". Lorsqu'un thread est bloqué en travaillant pour le compte d'un client, il ne peut pas traiter les demandes d'autres clients. Cela fournit deux motivations pour ne bloquer ni la boucle d'événements ni le pool de travailleurs :

1. Performances : Si vous effectuez régulièrement une activité lourde sur l'un ou l'autre type de thread, le *débit* (requêtes/seconde) de votre serveur en souffrira.
2. Sécurité : S'il est possible que pour certaines entrées, l'un de vos threads puisse se bloquer, un client malveillant pourrait soumettre cette "entrée maléfique", faire bloquer vos threads et les empêcher de travailler sur d'autres clients. Il s'agirait d'une [attaque par déni de service](https://en.wikipedia.org/wiki/Denial-of-service_attack).


## Un bref aperçu de Node

Node.js utilise l'architecture événementielle : il possède une boucle d'événement (Event Loop) pour l'orchestration et un pool de workers (Worker Pool) pour les tâches coûteuses.

### Quel code s'exécute dans la boucle d'événement ?

Au démarrage, les applications Node.js effectuent d'abord une phase d'initialisation, en important des modules via `require` et en enregistrant des fonctions de rappel pour les événements. Les applications Node.js entrent ensuite dans la boucle d'événement, répondant aux demandes entrantes des clients en exécutant la fonction de rappel appropriée. Cette fonction de rappel s'exécute de manière synchrone et peut enregistrer des requêtes asynchrones pour poursuivre le traitement une fois qu'elle est terminée. Les fonctions de rappel pour ces requêtes asynchrones seront également exécutées dans la boucle d'événement.

La boucle d'événement répondra également aux requêtes asynchrones non bloquantes effectuées par ses fonctions de rappel, par exemple, les E/S réseau.

En résumé, la boucle d'événement exécute les fonctions de rappel JavaScript enregistrées pour les événements et est également responsable de la gestion des requêtes asynchrones non bloquantes telles que les E/S réseau.

### Quel code s'exécute dans le pool de workers ?

Le pool de workers de Node.js est implémenté dans libuv ([docs](http://docs.libuv.org/en/v1.x/threadpool.html)), qui expose une API générale de soumission de tâches.

Node.js utilise le pool de workers pour gérer les tâches "coûteuses". Cela inclut les E/S pour lesquelles un système d'exploitation ne fournit pas de version non bloquante, ainsi que les tâches particulièrement gourmandes en ressources CPU.

Voici les API de modules Node.js qui utilisent ce pool de workers :

1. Intensive en E/S
    1. [DNS](/fr/nodejs/api/dns) : `dns.lookup()`, `dns.lookupService()`.
    2. [Système de fichiers][/api/fs] : Toutes les API du système de fichiers, à l'exception de `fs.FSWatcher()` et celles qui sont explicitement synchrones, utilisent le pool de threads de libuv.
2. Intensive en CPU
    1. [Crypto](/fr/nodejs/api/crypto) : `crypto.pbkdf2()`, `crypto.scrypt()`, `crypto.randomBytes()`, `crypto.randomFill()`, `crypto.generateKeyPair()`.
    2. [Zlib](/fr/nodejs/api/zlib) : Toutes les API zlib, à l'exception de celles qui sont explicitement synchrones, utilisent le pool de threads de libuv.

Dans de nombreuses applications Node.js, ces API sont les seules sources de tâches pour le pool de workers. Les applications et les modules qui utilisent un [add-on C++](/fr/nodejs/api/addons) peuvent soumettre d'autres tâches au pool de workers.

Par souci d'exhaustivité, nous notons que lorsque vous appelez l'une de ces API à partir d'une fonction de rappel dans la boucle d'événement, la boucle d'événement supporte des coûts de configuration mineurs lorsqu'elle entre dans les liaisons C++ de Node.js pour cette API et soumet une tâche au pool de workers. Ces coûts sont négligeables par rapport au coût global de la tâche, c'est pourquoi la boucle d'événement la décharge. Lors de la soumission de l'une de ces tâches au pool de workers, Node.js fournit un pointeur vers la fonction C++ correspondante dans les liaisons C++ de Node.js.


### Comment Node.js décide-t-il quel code exécuter ensuite ?

De manière abstraite, la boucle d'événements et le pool de travailleurs maintiennent des files d'attente pour les événements en attente et les tâches en attente, respectivement.

En réalité, la boucle d'événements ne maintient pas réellement une file d'attente. Au lieu de cela, il dispose d'une collection de descripteurs de fichiers qu'il demande au système d'exploitation de surveiller, à l'aide d'un mécanisme tel que [epoll](http://man7.org/linux/man-pages/man7/epoll.7.html) (Linux), [kqueue](https://developer.apple.com/library/content/documentation/Darwin/Conceptual/FSEvents_ProgGuide/KernelQueues/KernelQueues.html) (OSX), des ports d'événements (Solaris) ou [IOCP](https://msdn.microsoft.com/en-us/library/windows/desktop/aa365198.aspx) (Windows). Ces descripteurs de fichiers correspondent aux sockets réseau, à tous les fichiers qu'il surveille, etc. Lorsque le système d'exploitation indique que l'un de ces descripteurs de fichiers est prêt, la boucle d'événements le traduit en l'événement approprié et invoque le(s) rappel(s) associé(s) à cet événement. Vous pouvez en savoir plus sur ce processus [ici](https://www.youtube.com/watch?v=P9csgxBgaZ8).

En revanche, le pool de travailleurs utilise une véritable file d'attente dont les entrées sont des tâches à traiter. Un travailleur extrait une tâche de cette file d'attente et la traite, et une fois terminée, le travailleur déclenche un événement "Au moins une tâche est terminée" pour la boucle d'événements.

### Qu'est-ce que cela signifie pour la conception d'applications ?
Dans un système à un thread par client comme Apache, chaque client en attente se voit attribuer son propre thread. Si un thread gérant un client se bloque, le système d'exploitation l'interrompra et donnera son tour à un autre client. Le système d'exploitation garantit ainsi que les clients qui nécessitent une petite quantité de travail ne sont pas pénalisés par les clients qui nécessitent plus de travail.

Étant donné que Node.js gère de nombreux clients avec peu de threads, si un thread se bloque lors du traitement de la demande d'un client, les demandes de client en attente peuvent ne pas avoir leur tour tant que le thread n'a pas terminé son rappel ou sa tâche. Le traitement équitable des clients est donc la responsabilité de votre application. Cela signifie que vous ne devriez pas faire trop de travail pour un client dans un seul rappel ou une seule tâche.

Cela explique en partie pourquoi Node.js peut bien évoluer, mais cela signifie également que vous êtes responsable de la garantie d'une planification équitable. Les sections suivantes expliquent comment assurer une planification équitable pour la boucle d'événements et pour le pool de travailleurs.


## Ne bloquez pas la boucle d'événement
La boucle d'événement remarque chaque nouvelle connexion client et orchestre la génération d'une réponse. Toutes les requêtes entrantes et les réponses sortantes transitent par la boucle d'événement. Cela signifie que si la boucle d'événement passe trop de temps à un moment donné, tous les clients actuels et nouveaux ne pourront pas jouer leur tour.

Vous devez vous assurer de ne jamais bloquer la boucle d'événement. En d'autres termes, chacun de vos rappels JavaScript doit se terminer rapidement. Ceci s'applique bien sûr également à vos `await`, vos `Promise.then`, etc.

Un bon moyen de s'en assurer est de raisonner sur la ["complexité computationnelle"](https://en.wikipedia.org/wiki/Time_complexity) de vos rappels. Si votre rappel prend un nombre constant d'étapes, quels que soient ses arguments, alors vous donnerez toujours à chaque client en attente un tour équitable. Si votre rappel prend un nombre différent d'étapes en fonction de ses arguments, alors vous devriez réfléchir à la durée possible des arguments.

Exemple 1 : un rappel à temps constant.

```js
app.get('/constant-time', (req, res) => {
  res.sendStatus(200);
});
```

Exemple 2 : un rappel `O(n)`. Ce rappel s'exécutera rapidement pour les petits `n` et plus lentement pour les grands `n`.

```js
app.get('/countToN', (req, res) => {
  let n = req.query.n;
  // n itérations avant de donner la main à quelqu'un d'autre
  for (let i = 0; i < n; i++) {
    console.log(`Iter ${i}`);
  }
  res.sendStatus(200);
});
```
Exemple 3 : un rappel `O(n^2)`. Ce rappel s'exécutera toujours rapidement pour les petits `n`, mais pour les grands `n`, il s'exécutera beaucoup plus lentement que l'exemple `O(n)` précédent.

```js
app.get('/countToN2', (req, res) => {
  let n = req.query.n;
  // n^2 itérations avant de donner la main à quelqu'un d'autre
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      console.log(`Iter ${i}.${j}`);
    }
  }
  res.sendStatus(200);
});
```

### Avec quelle prudence devriez-vous agir ?
Node.js utilise le moteur Google V8 pour JavaScript, qui est assez rapide pour de nombreuses opérations courantes. Les exceptions à cette règle sont les expressions régulières et les opérations JSON, décrites ci-dessous.

Cependant, pour les tâches complexes, vous devriez envisager de limiter l'entrée et de rejeter les entrées trop longues. De cette façon, même si votre rappel a une grande complexité, en limitant l'entrée, vous vous assurez que le rappel ne peut pas prendre plus que le temps du pire des cas sur l'entrée acceptable la plus longue. Vous pouvez ensuite évaluer le coût du pire des cas de ce rappel et déterminer si son temps d'exécution est acceptable dans votre contexte.


## Blocage de la boucle d'événement : REDOS

Une façon courante de bloquer la boucle d'événement de manière désastreuse est d'utiliser une [expression régulière](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) "vulnérable".

### Éviter les expressions régulières vulnérables
Une expression régulière (regexp) compare une chaîne d'entrée à un modèle. Nous pensons généralement qu'une correspondance regexp nécessite un seul passage dans la chaîne d'entrée `--- O(n)` où `n` est la longueur de la chaîne d'entrée. Dans de nombreux cas, un seul passage est en effet tout ce qu'il faut. Malheureusement, dans certains cas, la correspondance regexp peut nécessiter un nombre exponentiel de passages dans la chaîne d'entrée `--- O(2^n)`. Un nombre exponentiel de passages signifie que si le moteur nécessite x passages pour déterminer une correspondance, il aura besoin de `2*x` passages si nous ajoutons un seul caractère de plus à la chaîne d'entrée. Étant donné que le nombre de passages est linéairement lié au temps requis, l'effet de cette évaluation sera de bloquer la boucle d'événement.

Une *expression régulière vulnérable* est une expression sur laquelle votre moteur d'expression régulière pourrait prendre un temps exponentiel, vous exposant à [REDOS](https://owasp.org/www-community/attacks/Regular_expression_Denial_of_Service_-_ReDoS) sur une "entrée malveillante". La question de savoir si votre modèle d'expression régulière est vulnérable (c'est-à-dire si le moteur regexp peut prendre un temps exponentiel dessus) est en fait une question difficile à répondre, et varie selon que vous utilisez Perl, Python, Ruby, Java, JavaScript, etc., mais voici quelques règles générales qui s'appliquent à toutes ces langues :

1. Évitez les quantificateurs imbriqués comme `(a+)*`. Le moteur regexp de V8 peut traiter certains d'entre eux rapidement, mais d'autres sont vulnérables.
2. Évitez les OR avec des clauses qui se chevauchent, comme `(a|a)*`. Encore une fois, ceux-ci sont parfois rapides.
3. Évitez d'utiliser des références arrière, comme `(a.*) \1`. Aucun moteur regexp ne peut garantir leur évaluation en temps linéaire.
4. Si vous effectuez une correspondance de chaîne simple, utilisez `indexOf` ou l'équivalent local. Ce sera moins cher et ne prendra jamais plus de `O(n)`.

Si vous n'êtes pas sûr que votre expression régulière soit vulnérable, n'oubliez pas que Node.js n'a généralement pas de problème à signaler une correspondance, même pour une expression régulière vulnérable et une longue chaîne d'entrée. Le comportement exponentiel est déclenché lorsqu'il y a une non-concordance, mais Node.js ne peut pas en être certain tant qu'il n'a pas essayé de nombreux chemins dans la chaîne d'entrée.


### Un exemple de REDOS

Voici un exemple d'expression régulière vulnérable exposant son serveur à REDOS :

```js
app.get('/redos-me', (req, res) => {
  let filePath = req.query.filePath;
  // REDOS
  if (filePath.match(/(\/.+)+$/)) {
    console.log('valid path');
  } else {
    console.log('invalid path');
  }
  res.sendStatus(200);
});
```

L'expression régulière vulnérable dans cet exemple est une (mauvaise !) façon de vérifier un chemin valide sous Linux. Elle correspond aux chaînes qui sont une séquence de noms délimités par « / », comme « `/a/b/c` ». Elle est dangereuse car elle viole la règle 1 : elle comporte un quantificateur doublement imbriqué.

Si un client interroge avec filePath `///.../\n` (100 « / » suivis d'un caractère de saut de ligne auquel le « . » de l'expression régulière ne correspondra pas), alors la boucle d'événement prendra un temps infini, bloquant la boucle d'événement. L'attaque REDOS de ce client empêche tous les autres clients de passer jusqu'à ce que la correspondance d'expression régulière soit terminée.

Pour cette raison, vous devriez vous méfier de l'utilisation d'expressions régulières complexes pour valider les entrées utilisateur.

### Ressources anti-REDOS
Il existe des outils pour vérifier la sécurité de vos expressions régulières, comme

- [safe-regex](https://github.com/davisjam/safe-regex)
- [rxxr2](https://github.com/superhuman/rxxr2)

Cependant, aucun de ces outils ne détectera toutes les expressions régulières vulnérables.

Une autre approche consiste à utiliser un moteur d'expression régulière différent. Vous pouvez utiliser le module [node-re2](https://github.com/uhop/node-re2), qui utilise le moteur d'expression régulière [RE2](https://github.com/google/re2) ultra-rapide de Google. Mais attention, RE2 n'est pas compatible à 100 % avec les expressions régulières de V8, alors vérifiez les régressions si vous échangez le module node-re2 pour gérer vos expressions régulières. Et les expressions régulières particulièrement compliquées ne sont pas prises en charge par node-re2.

Si vous essayez de faire correspondre quelque chose d'« évident », comme une URL ou un chemin de fichier, trouvez un exemple dans une [bibliothèque d'expressions régulières](http://www.regexlib.com/) ou utilisez un module npm, par exemple [ip-regex](https://www.npmjs.com/package/ip-regex).

### Blocage de la boucle d'événement : modules principaux de Node.js

Plusieurs modules principaux de Node.js ont des API synchrones coûteuses, notamment :

- [Chiffrement](/fr/nodejs/api/crypto)
- [Compression](/fr/nodejs/api/zlib)
- [Système de fichiers](/fr/nodejs/api/fs)
- [Processus enfant](/fr/nodejs/api/child_process)

Ces API sont coûteuses, car elles impliquent des calculs importants (chiffrement, compression), nécessitent des E/S (E/S de fichiers) ou potentiellement les deux (processus enfant). Ces API sont destinées à faciliter l'écriture de scripts, mais ne sont pas destinées à être utilisées dans le contexte du serveur. Si vous les exécutez sur la boucle d'événement, ils prendront beaucoup plus de temps à se terminer qu'une instruction JavaScript typique, bloquant la boucle d'événement.

Dans un serveur, vous ne devez pas utiliser les API synchrones suivantes de ces modules :

- Chiffrement :
    - `crypto.randomBytes` (version synchrone)
    - `crypto.randomFillSync`
    - `crypto.pbkdf2Sync`
    - Vous devez également veiller à fournir des entrées volumineuses aux routines de chiffrement et de déchiffrement.
- Compression :
    - `zlib.inflateSync`
    - `zlib.deflateSync`
- Système de fichiers :
    - N'utilisez pas les API de système de fichiers synchrones. Par exemple, si le fichier auquel vous accédez se trouve dans un [système de fichiers distribué](https://en.wikipedia.org/wiki/Clustered_file_system#Distributed_file_systems) comme [NFS](https://en.wikipedia.org/wiki/Network_File_System), les temps d'accès peuvent varier considérablement.
- Processus enfant :
    - `child_process.spawnSync`
    - `child_process.execSync`
    - `child_process.execFileSync`

Cette liste est raisonnablement complète à partir de Node.js v9.


## Blocage de la boucle d'événements : Déni de service JSON

`JSON.parse` et `JSON.stringify` sont d'autres opérations potentiellement coûteuses. Bien qu'elles soient en O(n) de la longueur de l'entrée, pour un grand n, elles peuvent prendre étonnamment longtemps.

Si votre serveur manipule des objets JSON, en particulier ceux provenant d'un client, vous devez faire preuve de prudence quant à la taille des objets ou des chaînes avec lesquels vous travaillez sur la boucle d'événements.

Exemple : Blocage JSON. Nous créons un objet `obj` de taille 2^21 et nous l'envoyons à `JSON.stringify`, exécutons indexOf sur la chaîne, puis `JSON.parse`. La chaîne `JSON.stringify` fait 50 Mo. Il faut 0,7 seconde pour stringify l'objet, 0,03 seconde pour indexOf sur la chaîne de 50 Mo et 1,3 seconde pour parser la chaîne.

```js
let obj = { a: 1 };
let niter = 20;
let before, str, pos, res, took;
for (let i = 0; i < niter; i++) {
  obj = { obj1: obj, obj2: obj }; // Double de taille à chaque itération
}
before = process.hrtime();
str = JSON.stringify(obj);
took = process.hrtime(before);
console.log('JSON.stringify a pris ' + took);
before = process.hrtime();
pos = str.indexOf('nomatch');
took = process.hrtime(before);
console.log('Pure indexof a pris ' + took);
before = process.hrtime();
res = JSON.parse(str);
took = process.hrtime(before);
console.log('JSON.parse a pris ' + took);
```

Il existe des modules npm qui offrent des API JSON asynchrones. Voir par exemple :

- [JSONStream](https://www.npmjs.com/package/JSONStream), qui possède des API de flux.
- [Big-Friendly JSON](https://www.npmjs.com/package/bfj), qui possède des API de flux ainsi que des versions asynchrones des API JSON standard utilisant le paradigme de partitionnement sur la boucle d'événements décrit ci-dessous.

## Calculs complexes sans bloquer la boucle d'événements

Supposons que vous souhaitiez effectuer des calculs complexes en JavaScript sans bloquer la boucle d'événements. Vous avez deux options : le partitionnement ou le délestage.

### Partitionnement

Vous pouvez *partitionner* vos calculs afin que chacun s'exécute sur la boucle d'événements, mais cède régulièrement (donne son tour à) d'autres événements en attente. En JavaScript, il est facile d'enregistrer l'état d'une tâche en cours dans une fermeture, comme le montre l'exemple 2 ci-dessous.

Pour un exemple simple, supposons que vous souhaitiez calculer la moyenne des nombres de `1` à `n`.

Exemple 1 : Moyenne non partitionnée, coûte `O(n)`

```js
for (let i = 0; i < n; i++) sum += i;
let avg = sum / n;
console.log('avg: ' + avg);
```

Exemple 2 : Moyenne partitionnée, chacune des `n` étapes asynchrones coûte `O(1)`.

```js
function asyncAvg(n, avgCB) {
  // Enregistrer la somme en cours dans une fermeture JS.
  let sum = 0;
  function help(i, cb) {
    sum += i;
    if (i == n) {
      cb(sum);
      return;
    }
    // "Récursion asynchrone".
    // Planifier la prochaine opération de manière asynchrone.
    setImmediate(help.bind(null, i + 1, cb));
  }
  // Démarrer l'assistant, avec CB pour appeler avgCB.
  help(1, function (sum) {
    let avg = sum / n;
    avgCB(avg);
  });
}
asyncAvg(n, function (avg) {
  console.log('avg de 1-n: ' + avg);
});
```

Vous pouvez appliquer ce principe aux itérations de tableaux et ainsi de suite.


### Déchargement

Si vous devez effectuer une tâche plus complexe, le partitionnement n'est pas une bonne option. En effet, le partitionnement utilise uniquement la boucle d'événements, et vous ne bénéficierez pas des multiples cœurs presque certainement disponibles sur votre machine. **N'oubliez pas que la boucle d'événements doit orchestrer les demandes des clients, et non les traiter elle-même.** Pour une tâche complexe, déchargez le travail de la boucle d'événements vers un pool de travailleurs.

#### Comment décharger

Vous avez deux options pour un pool de travailleurs de destination vers lequel décharger le travail.

1. Vous pouvez utiliser le pool de travailleurs Node.js intégré en développant un [module complémentaire C++](/fr/nodejs/api/addons). Sur les anciennes versions de Node, construisez votre [module complémentaire C++](/fr/nodejs/api/addons) en utilisant [NAN](https://github.com/nodejs/nan), et sur les versions plus récentes, utilisez [N-API](/fr/nodejs/api/n-api). [node-webworker-threads](https://www.npmjs.com/package/webworker-threads) offre un moyen en JavaScript uniquement d'accéder au pool de travailleurs Node.js.
2. Vous pouvez créer et gérer votre propre pool de travailleurs dédié au calcul plutôt qu'au pool de travailleurs Node.js sur le thème des E/S. La façon la plus simple de le faire est d'utiliser [Processus enfant](/fr/nodejs/api/child_process) ou [Cluster](/fr/nodejs/api/cluster).

Vous ne devez pas simplement créer un [Processus enfant](/fr/nodejs/api/child_process) pour chaque client. Vous pouvez recevoir les demandes des clients plus rapidement que vous ne pouvez créer et gérer des enfants, et votre serveur pourrait devenir une [bombe à fourche](https://en.wikipedia.org/wiki/Fork_bomb).

Inconvénient du déchargement
L'inconvénient de l'approche du déchargement est qu'elle entraîne des frais généraux sous la forme de coûts de communication. Seule la boucle d'événements est autorisée à voir l'"espace de noms" (état JavaScript) de votre application. À partir d'un travailleur, vous ne pouvez pas manipuler un objet JavaScript dans l'espace de noms de la boucle d'événements. Au lieu de cela, vous devez sérialiser et désérialiser tous les objets que vous souhaitez partager. Ensuite, le travailleur peut opérer sur sa propre copie de ces objets et renvoyer l'objet modifié (ou un "correctif") à la boucle d'événements.

Pour les problèmes de sérialisation, consultez la section sur JSON DOS.

#### Quelques suggestions pour le déchargement

Vous pouvez distinguer les tâches gourmandes en CPU et les tâches gourmandes en E/S, car elles ont des caractéristiques très différentes.

Une tâche gourmande en CPU ne progresse que lorsque son travailleur est planifié, et le travailleur doit être planifié sur l'un des [cœurs logiques](/fr/nodejs/api/os) de votre machine. Si vous avez 4 cœurs logiques et 5 travailleurs, l'un de ces travailleurs ne peut pas progresser. Par conséquent, vous payez des frais généraux (mémoire et coûts de planification) pour ce travailleur et vous n'en retirez aucun avantage.

Les tâches gourmandes en E/S impliquent d'interroger un fournisseur de services externe (DNS, système de fichiers, etc.) et d'attendre sa réponse. Pendant qu'un travailleur avec une tâche gourmande en E/S attend sa réponse, il n'a rien d'autre à faire et peut être désélectionné par le système d'exploitation, donnant à un autre travailleur la possibilité de soumettre sa demande. Ainsi, les tâches gourmandes en E/S progresseront même lorsque le thread associé ne sera pas en cours d'exécution. Les fournisseurs de services externes comme les bases de données et les systèmes de fichiers ont été hautement optimisés pour gérer de nombreuses demandes en attente simultanément. Par exemple, un système de fichiers examinera un grand ensemble de demandes d'écriture et de lecture en attente pour fusionner les mises à jour conflictuelles et pour récupérer les fichiers dans un ordre optimal.

Si vous ne comptez que sur un seul pool de travailleurs, par exemple le pool de travailleurs Node.js, les caractéristiques différentes du travail lié au CPU et du travail lié aux E/S peuvent nuire aux performances de votre application.

Pour cette raison, vous pouvez souhaiter maintenir un pool de travailleurs de calcul séparé.


### Déchargement : conclusions

Pour des tâches simples, comme itérer sur les éléments d'un tableau arbitrairement long, le partitionnement peut être une bonne option. Si votre calcul est plus complexe, le déchargement est une meilleure approche : les coûts de communication, c'est-à-dire la surcharge liée au passage d'objets sérialisés entre la boucle d'événements et le pool de workers, sont compensés par l'avantage d'utiliser plusieurs cœurs.

Cependant, si votre serveur repose fortement sur des calculs complexes, vous devriez vous demander si Node.js est vraiment adapté. Node.js excelle pour les tâches liées aux E/S, mais pour les calculs coûteux, ce n'est peut-être pas la meilleure option.

Si vous adoptez l'approche du déchargement, consultez la section sur la manière de ne pas bloquer le pool de workers.

### Ne bloquez pas le pool de workers
Node.js possède un pool de workers composé de k workers. Si vous utilisez le paradigme de déchargement évoqué ci-dessus, vous pouvez avoir un pool de workers de calcul distinct, auquel les mêmes principes s'appliquent. Dans les deux cas, supposons que k est beaucoup plus petit que le nombre de clients que vous pouvez gérer simultanément. Ceci est conforme à la philosophie de Node.js "un thread pour de nombreux clients", le secret de son évolutivité.

Comme mentionné ci-dessus, chaque worker termine sa tâche en cours avant de passer à la suivante dans la file d'attente du pool de workers.

Or, il y aura une variation dans le coût des tâches nécessaires pour traiter les requêtes de vos clients. Certaines tâches peuvent être accomplies rapidement (par exemple, la lecture de fichiers courts ou mis en cache, ou la production d'un petit nombre d'octets aléatoires), et d'autres prendront plus de temps (par exemple, la lecture de fichiers plus volumineux ou non mis en cache, ou la génération de plus d'octets aléatoires). Votre objectif devrait être de minimiser la variation des temps d'exécution des tâches, et vous devriez utiliser le partitionnement des tâches pour y parvenir.

#### Minimiser la variation des temps d'exécution des tâches

Si la tâche actuelle d'un worker est beaucoup plus coûteuse que les autres tâches, alors il ne sera pas disponible pour travailler sur les autres tâches en attente. En d'autres termes, chaque tâche relativement longue diminue effectivement la taille du pool de workers d'une unité jusqu'à ce qu'elle soit terminée. Ceci est indésirable car, jusqu'à un certain point, plus il y a de workers dans le pool de workers, plus le débit du pool de workers (tâches/seconde) est élevé, et donc plus le débit du serveur (requêtes client/seconde) est élevé. Un client avec une tâche relativement coûteuse diminuera le débit du pool de workers, ce qui diminuera à son tour le débit du serveur.

Pour éviter cela, vous devriez essayer de minimiser la variation de la durée des tâches que vous soumettez au pool de workers. Bien qu'il soit approprié de traiter les systèmes externes auxquels accèdent vos requêtes d'E/S (BD, FS, etc.) comme des boîtes noires, vous devez être conscient du coût relatif de ces requêtes d'E/S, et vous devriez éviter de soumettre des requêtes dont vous pouvez vous attendre à ce qu'elles soient particulièrement longues.

Deux exemples devraient illustrer la variation possible des temps d'exécution des tâches.


#### Exemple de variation : lectures longues du système de fichiers

Supposons que votre serveur doive lire des fichiers afin de traiter des requêtes client. Après avoir consulté les API du [système de fichiers](/fr/nodejs/api/fs) de Node.js, vous avez opté pour `fs.readFile()` pour plus de simplicité. Cependant, `fs.readFile()` n’est (actuellement) pas partitionné : il soumet une seule tâche `fs.read()` couvrant l’ensemble du fichier. Si vous lisez des fichiers plus courts pour certains utilisateurs et des fichiers plus longs pour d’autres, `fs.readFile()` peut introduire une variation significative dans la durée des tâches, au détriment du débit du pool de workers.

Dans le pire des cas, supposons qu’un attaquant puisse convaincre votre serveur de lire un fichier arbitraire (il s’agit d’une [vulnérabilité de parcours de répertoire](https://www.owasp.org/index.php/Path_Traversal)). Si votre serveur exécute Linux, l’attaquant peut nommer un fichier extrêmement lent : `/dev/random`. À toutes fins pratiques, `/dev/random` est infiniment lent, et chaque worker à qui on demande de lire depuis `/dev/random` ne terminera jamais cette tâche. Un attaquant soumet ensuite k requêtes, une pour chaque worker, et aucune autre requête client qui utilise le pool de workers ne progressera.

#### Exemple de variation : opérations de chiffrement longues

Supposons que votre serveur génère des octets aléatoires cryptographiquement sécurisés à l’aide de `crypto.randomBytes()`. `crypto.randomBytes()` n’est pas partitionné : il crée une seule tâche `randomBytes()` pour générer autant d’octets que vous l’avez demandé. Si vous créez moins d’octets pour certains utilisateurs et plus pour d’autres, `crypto.randomBytes()` est une autre source de variation dans la durée des tâches.

### Partitionnement des tâches

Les tâches dont les coûts de temps sont variables peuvent nuire au débit du pool de workers. Pour minimiser la variation des temps de tâche, dans la mesure du possible, vous devez partitionner chaque tâche en sous-tâches de coût comparable. Lorsque chaque sous-tâche est terminée, elle doit soumettre la sous-tâche suivante, et lorsque la sous-tâche finale est terminée, elle doit en informer l’expéditeur.

Pour poursuivre l’exemple de `fs.readFile()`, vous devriez plutôt utiliser `fs.read()` (partitionnement manuel) ou `ReadStream` (partitionnement automatique).

Le même principe s’applique aux tâches liées au CPU ; l’exemple `asyncAvg` pourrait être inapproprié pour la boucle d’événements, mais il est bien adapté au pool de workers.

Lorsque vous partitionnez une tâche en sous-tâches, les tâches plus courtes se développent en un petit nombre de sous-tâches, et les tâches plus longues se développent en un plus grand nombre de sous-tâches. Entre chaque sous-tâche d’une tâche plus longue, le worker auquel elle a été affectée peut travailler sur une sous-tâche d’une autre tâche plus courte, améliorant ainsi le débit global des tâches du pool de workers.

Notez que le nombre de sous-tâches terminées n’est pas une mesure utile du débit du pool de workers. Au lieu de cela, concentrez-vous sur le nombre de tâches terminées.


### Éviter le partitionnement des tâches

Rappelez-vous que le but du partitionnement des tâches est de minimiser la variation des temps de tâche. Si vous pouvez distinguer les tâches plus courtes des tâches plus longues (par exemple, sommer un tableau par rapport à trier un tableau), vous pouvez créer un pool de travailleurs pour chaque classe de tâches. Router les tâches plus courtes et les tâches plus longues vers des pools de travailleurs séparés est une autre façon de minimiser la variation des temps de tâche.

En faveur de cette approche, le partitionnement des tâches entraîne des frais généraux (les coûts de création d'une représentation de tâche du pool de travailleurs et de manipulation de la file d'attente du pool de travailleurs), et éviter le partitionnement vous évite les coûts de voyages supplémentaires vers le pool de travailleurs. Cela vous évite également de faire des erreurs dans le partitionnement de vos tâches.

L'inconvénient de cette approche est que les travailleurs de tous ces pools de travailleurs entraîneront des frais généraux d'espace et de temps et se feront concurrence pour le temps CPU. N'oubliez pas que chaque tâche liée au CPU ne progresse que lorsqu'elle est planifiée. Par conséquent, vous ne devriez envisager cette approche qu'après une analyse approfondie.

### Pool de travailleurs : conclusions

Que vous utilisiez uniquement le pool de travailleurs Node.js ou que vous mainteniez des pools de travailleurs séparés, vous devez optimiser le débit de tâches de votre ou vos pools.

Pour ce faire, minimisez la variation des temps de tâche en utilisant le partitionnement des tâches.

## Les risques des modules npm

Bien que les modules de base de Node.js offrent des blocs de construction pour une grande variété d'applications, parfois quelque chose de plus est nécessaire. Les développeurs Node.js bénéficient énormément de l'écosystème npm, avec des centaines de milliers de modules offrant des fonctionnalités pour accélérer votre processus de développement.

N'oubliez pas, cependant, que la majorité de ces modules sont écrits par des développeurs tiers et sont généralement publiés avec uniquement les meilleures garanties d'efforts. Un développeur utilisant un module npm doit se soucier de deux choses, bien que cette dernière soit fréquemment oubliée.

1. Honore-t-il ses API ?
2. Ses API pourraient-elles bloquer la boucle d'événements ou un Worker ? De nombreux modules ne font aucun effort pour indiquer le coût de leurs API, au détriment de la communauté.

Pour les API simples, vous pouvez estimer le coût des API ; le coût de la manipulation de chaînes n'est pas difficile à comprendre. Mais dans de nombreux cas, il n'est pas clair combien une API peut coûter.

Si vous appelez une API qui pourrait faire quelque chose de coûteux, vérifiez le coût. Demandez aux développeurs de le documenter, ou examinez le code source vous-même (et soumettez une RP documentant le coût).

N'oubliez pas que même si l'API est asynchrone, vous ne savez pas combien de temps elle peut passer sur un Worker ou sur la boucle d'événements dans chacune de ses partitions. Par exemple, supposons que dans l'exemple `asyncAvg` donné ci-dessus, chaque appel à la fonction d'assistance additionne la moitié des nombres plutôt qu'un seul. Alors cette fonction serait toujours asynchrone, mais le coût de chaque partition serait `O(n)`, pas `O(1)`, ce qui la rendrait beaucoup moins sûre à utiliser pour des valeurs arbitraires de `n`.


## Conclusion

Node.js possède deux types de threads : une boucle d'événements et k Workers. La boucle d'événements est responsable des rappels JavaScript et des E/S non bloquantes, et un Worker exécute les tâches correspondant au code C++ qui effectue une requête asynchrone, y compris les E/S bloquantes et le travail gourmand en CPU. Les deux types de threads ne fonctionnent que sur une seule activité à la fois. Si un rappel ou une tâche prend beaucoup de temps, le thread qui l'exécute est bloqué. Si votre application effectue des rappels ou des tâches bloquantes, cela peut entraîner une dégradation du débit (clients/seconde) au mieux, et un déni de service complet au pire.

Pour écrire un serveur web à haut débit et plus résistant aux attaques DoS, vous devez vous assurer que, que l'entrée soit bénigne ou malveillante, ni votre boucle d'événements, ni vos Workers ne se bloquent.

