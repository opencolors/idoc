---
title: Comprendre la pression arrière dans les flux Node.js
description: Apprenez à implémenter des flux Readable et Writable personnalisés dans Node.js tout en respectant la pression arrière pour assurer un flux de données efficace et éviter les pièges courants.
head:
  - - meta
    - name: og:title
      content: Comprendre la pression arrière dans les flux Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Apprenez à implémenter des flux Readable et Writable personnalisés dans Node.js tout en respectant la pression arrière pour assurer un flux de données efficace et éviter les pièges courants.
  - - meta
    - name: twitter:title
      content: Comprendre la pression arrière dans les flux Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Apprenez à implémenter des flux Readable et Writable personnalisés dans Node.js tout en respectant la pression arrière pour assurer un flux de données efficace et éviter les pièges courants.
---


# Rétro-pression dans les flux

Un problème général se produit lors de la manipulation des données, appelé rétro-pression, et décrit une accumulation de données derrière un tampon pendant le transfert de données. Lorsque l'extrémité réceptrice du transfert effectue des opérations complexes ou est plus lente pour une raison quelconque, les données provenant de la source entrante ont tendance à s'accumuler, comme un bouchon.

Pour résoudre ce problème, un système de délégation doit être en place afin d'assurer un flux de données fluide d'une source à l'autre. Différentes communautés ont résolu ce problème de manière unique pour leurs programmes. Les pipes Unix et les sockets TCP en sont de bons exemples, et sont souvent appelés contrôle de flux. Dans Node.js, les flux ont été la solution adoptée.

Le but de ce guide est de détailler ce qu'est la rétro-pression, et comment les flux l'abordent exactement dans le code source de Node.js. La deuxième partie du guide présentera les meilleures pratiques suggérées pour s'assurer que le code de votre application est sûr et optimisé lors de l'implémentation des flux.

Nous supposons une certaine familiarité avec la définition générale de `rétro-pression`, `Buffer` et `EventEmitters` dans Node.js, ainsi qu'une certaine expérience avec `Stream`. Si vous n'avez pas lu ces documents, il n'est pas inutile de consulter d'abord la [documentation de l'API](/fr/nodejs/api/stream), car cela vous aidera à mieux comprendre en lisant ce guide.

## Le problème de la gestion des données

Dans un système informatique, les données sont transférées d'un processus à un autre par le biais de pipes, de sockets et de signaux. Dans Node.js, nous trouvons un mécanisme similaire appelé `Stream`. Les flux sont géniaux ! Ils font beaucoup pour Node.js et presque toutes les parties du code interne utilisent ce module. En tant que développeur, vous êtes plus qu'encouragé à les utiliser aussi !

```javascript
const readline = require('node:readline');

const rl = readline.createInterface({
    output: process.stdout,
    input: process.stdin,
});

rl.question('Pourquoi devriez-vous utiliser les flux ? ', answer => {
    console.log(`Peut-être que c'est ${answer}, peut-être que c'est parce qu'ils sont géniaux !`);
});

rl.close();
```

Un bon exemple de la raison pour laquelle le mécanisme de rétro-pression implémenté par le biais des flux est une excellente optimisation peut être démontré en comparant les outils système internes de l'implémentation des flux de Node.js.

Dans un scénario, nous allons prendre un grand fichier (environ -9 Go) et le compresser à l'aide de l'outil familier `zip(1)`.

```bash
zip The.Matrix.1080p.mkv
```

Bien que cela prenne quelques minutes, dans un autre shell, nous pouvons exécuter un script qui prend le module `zlib` de Node.js, qui encapsule un autre outil de compression, `gzip(1)`.

```javascript
const gzip = require('node:zlib').createGzip();
const fs = require('node:fs');

const inp = fs.createReadStream('The.Matrix.1080p.mkv');
const out = fs.createWriteStream('The.Matrix.1080p.mkv.gz');

inp.pipe(gzip).pipe(out);
```

Pour tester les résultats, essayez d'ouvrir chaque fichier compressé. Le fichier compressé par l'outil `zip(1)` vous avertira que le fichier est corrompu, alors que la compression terminée par Stream se décompressera sans erreur.

::: tip Note
Dans cet exemple, nous utilisons `.pipe()` pour obtenir la source de données d'une extrémité à l'autre. Cependant, remarquez qu'il n'y a pas de gestionnaires d'erreurs appropriés attachés. Si un bloc de données ne pouvait pas être correctement reçu, la source Readable ou le flux `gzip` ne seraient pas détruits. `pump` est un outil utilitaire qui détruirait correctement tous les flux dans un pipeline si l'un d'eux échoue ou se ferme, et est un incontournable dans ce cas !
:::

`pump` n'est nécessaire que pour Node.js 8.x ou les versions antérieures, car pour Node.js 10.x ou les versions ultérieures, `pipeline` est introduit pour remplacer `pump`. Il s'agit d'une méthode de module pour relier les flux en transmettant les erreurs et en nettoyant correctement et en fournissant un rappel lorsque le pipeline est terminé.

Voici un exemple d'utilisation de pipeline :

```javascript
const { pipeline } = require('node:stream');
const fs = require('node:fs');
const zlib = require('node:zlib');
// Utilisez l'API pipeline pour relier facilement une série de flux
// ensemble et être notifié lorsque le pipeline est entièrement terminé.
// Un pipeline pour compresser un fichier vidéo potentiellement énorme efficacement :
pipeline(
  fs.createReadStream('The.Matrix.1080p.mkv'),
  zlib.createGzip(),
  fs.createWriteStream('The.Matrix.1080p.mkv.gz'),
  err => {
    if (err) {
      console.error('Pipeline a échoué', err);
    } else {
      console.log('Pipeline a réussi');
    }
  }
);
```

Vous pouvez également utiliser le module `stream/promises` pour utiliser pipeline avec `async / await` :

```javascript
const { pipeline } = require('node:stream/promises');
const fs = require('node:fs');
const zlib = require('node:zlib');
async function run() {
  try {
    await pipeline(
      fs.createReadStream('The.Matrix.1080p.mkv'),
      zlib.createGzip(),
      fs.createWriteStream('The.Matrix.1080p.mkv.gz')
    );
    console.log('Pipeline a réussi');
  } catch (err) {
    console.error('Pipeline a échoué', err);
  }
}
```


## Trop de données, trop rapidement

Il arrive qu'un flux `Readable` transmette des données à un flux `Writable` beaucoup trop rapidement - bien plus que ce que le consommateur peut gérer !

Lorsque cela se produit, le consommateur commence à mettre en file d'attente tous les blocs de données pour une consommation ultérieure. La file d'attente d'écriture s'allonge de plus en plus, et de ce fait, davantage de données doivent être conservées en mémoire jusqu'à la fin du processus.

L'écriture sur un disque est beaucoup plus lente que la lecture à partir d'un disque. Ainsi, lorsque nous essayons de compresser un fichier et de l'écrire sur notre disque dur, une contre-pression se produit car le disque d'écriture ne sera pas en mesure de suivre la vitesse de la lecture.

```javascript
// Secrètement, le flux dit : "whoa, whoa ! Attends, c'est beaucoup trop !"
// Les données vont commencer à s'accumuler sur le côté lecture du tampon de données car
// write essaie de suivre le flux de données entrant.
inp.pipe(gzip).pipe(outputFile);
```

C'est pourquoi un mécanisme de contre-pression est important. Si un système de contre-pression n'était pas présent, le processus utiliserait la mémoire de votre système, ralentissant ainsi les autres processus et monopolisant une grande partie de votre système jusqu'à son achèvement.

Cela entraîne plusieurs conséquences :
- Ralentissement de tous les autres processus en cours
- Un collecteur d'ordures très surchargé
- Épuisement de la mémoire

Dans les exemples suivants, nous supprimerons la valeur de retour de la fonction `.write()` et la remplacerons par `true`, ce qui désactivera effectivement la prise en charge de la contre-pression dans le cœur de Node.js. Dans toute référence au binaire "modifié", nous parlons de l'exécution du binaire node sans la ligne `return ret;`, mais avec la ligne `return true;` remplacée.

## Excès de traînée sur le ramasse-miettes

Jetons un coup d'œil à un benchmark rapide. En utilisant le même exemple que ci-dessus, nous avons effectué quelques essais chronométrés pour obtenir un temps médian pour les deux binaires.

```bash
   trial (#)  | `node` binary (ms) | modified `node` binary (ms)
=================================================================
      1       |      56924         |           55011
      2       |      52686         |           55869
      3       |      59479         |           54043
      4       |      54473         |           55229
      5       |      52933         |           59723
=================================================================
average time: |      55299         |           55975
```

Les deux prennent environ une minute à s'exécuter, il n'y a donc pas beaucoup de différence, mais regardons de plus près pour confirmer si nos soupçons sont corrects. Nous utilisons l'outil Linux `dtrace` pour évaluer ce qui se passe avec le ramasse-miettes V8.

Le temps mesuré du GC (ramasse-miettes) indique les intervalles d'un cycle complet d'un seul balayage effectué par le ramasse-miettes :

```bash
approx. time (ms) | GC (ms) | modified GC (ms)
=================================================
          0       |    0    |      0
          1       |    0    |      0
         40       |    0    |      2
        170       |    3    |      1
        300       |    3    |      1
         *             *           *
         *             *           *
         *             *           *
      39000       |    6    |     26
      42000       |    6    |     21
      47000       |    5    |     32
      50000       |    8    |     28
      54000       |    6    |     35
```

Alors que les deux processus démarrent de la même manière et semblent faire fonctionner le GC au même rythme, il devient évident qu'après quelques secondes avec un système de contre-pression correctement fonctionnel en place, il répartit la charge du GC sur des intervalles cohérents de 4 à 8 millisecondes jusqu'à la fin du transfert de données.

Cependant, lorsqu'un système de contre-pression n'est pas en place, le ramasse-miettes V8 commence à s'éterniser. Le binaire normal a appelé le GC environ 75 fois en une minute, alors que le binaire modifié ne se déclenche que 36 fois.

C'est la dette lente et progressive qui s'accumule à partir de l'utilisation croissante de la mémoire. Au fur et à mesure que les données sont transférées, sans système de contre-pression en place, plus de mémoire est utilisée pour chaque transfert de bloc.

Plus il y a de mémoire allouée, plus le GC doit s'occuper d'un seul balayage. Plus le balayage est important, plus le GC doit décider de ce qui peut être libéré, et la recherche de pointeurs détachés dans un espace mémoire plus grand consommera plus de puissance de calcul.


## Épuisement de la mémoire

Pour déterminer la consommation de mémoire de chaque binaire, nous avons chronométré chaque processus individuellement avec `/usr/bin/time -lp sudo ./node ./backpressure-example/zlib.js`.

Voici la sortie sur le binaire normal :

```bash
Respect du retour de la valeur de .write()
=============================================
real        58.88
user        56.79
sys          8.79
  87810048  taille maximale de l'ensemble résident
         0  taille moyenne de la mémoire partagée
         0  taille moyenne des données non partagées
         0  taille moyenne de la pile non partagée
     19427  récupérations de pages
      3134  défauts de page
         0  swaps
         5  opérations d'entrée de bloc
       194  opérations de sortie de bloc
         0  messages envoyés
         0  messages reçus
         1  signaux reçus
        12  commutateurs de contexte volontaires
    666037  commutateurs de contexte involontaires
```

La taille maximale en octets occupée par la mémoire virtuelle s'avère être d'environ 87,81 Mo.

Et maintenant, en modifiant la valeur de retour de la fonction `.write()`, nous obtenons :

```bash
Sans respecter la valeur de retour de .write() :
==================================================
real        54.48
user        53.15
sys          7.43
1524965376  taille maximale de l'ensemble résident
         0  taille moyenne de la mémoire partagée
         0  taille moyenne des données non partagées
         0  taille moyenne de la pile non partagée
    373617  récupérations de pages
      3139  défauts de page
         0  swaps
        18  opérations d'entrée de bloc
       199  opérations de sortie de bloc
         0  messages envoyés
         0  messages reçus
         1  signaux reçus
        25  commutateurs de contexte volontaires
    629566  commutateurs de contexte involontaires
```

La taille maximale en octets occupée par la mémoire virtuelle s'avère être d'environ 1,52 Go.

Sans les flux en place pour déléguer la contre-pression, il y a un ordre de grandeur supérieur d'espace mémoire alloué - une énorme marge de différence entre le même processus !

Cette expérience montre à quel point le mécanisme de contre-pression de Node.js est optimisé et rentable pour votre système informatique. Maintenant, faisons une analyse de son fonctionnement !


## Comment la contre-pression résout-elle ces problèmes ?

Il existe différentes fonctions pour transférer des données d'un processus à un autre. Dans Node.js, il existe une fonction interne intégrée appelée `.pipe()`. Il existe également d'autres packages que vous pouvez utiliser ! Cependant, au niveau élémentaire de ce processus, nous avons deux composants distincts : la source des données et le consommateur.

Lorsque `.pipe()` est appelé depuis la source, il signale au consommateur qu'il y a des données à transférer. La fonction pipe aide à configurer les fermetures de contre-pression appropriées pour les déclencheurs d'événements.

Dans Node.js, la source est un flux `Readable` et le consommateur est le flux `Writable` (ces deux-là peuvent être interchangés avec un flux Duplex ou Transform, mais cela dépasse le cadre de ce guide).

Le moment où la contre-pression est déclenchée peut être réduit exactement à la valeur de retour de la fonction `.write()` d'un `Writable`. Cette valeur de retour est bien sûr déterminée par quelques conditions.

Dans tout scénario où la mémoire tampon de données a dépassé la `highwaterMark` ou que la file d'attente d'écriture est actuellement occupée, `.write()` `renverra false`.

Lorsqu'une valeur `false` est renvoyée, le système de contre-pression se met en marche. Il interrompra le flux `Readable` entrant de l'envoi de données et attendra que le consommateur soit à nouveau prêt. Une fois la mémoire tampon de données vidée, un événement `'drain'` sera émis et reprendra le flux de données entrant.

Une fois la file d'attente terminée, la contre-pression permettra à nouveau d'envoyer des données. L'espace mémoire qui était utilisé se libérera et se préparera pour le prochain lot de données.

Cela permet effectivement d'utiliser une quantité fixe de mémoire à tout moment pour une fonction `.pipe()`. Il n'y aura pas de fuite de mémoire, pas de mise en mémoire tampon infinie et le ramasse-miettes n'aura à gérer qu'une seule zone de la mémoire !

Alors, si la contre-pression est si importante, pourquoi n'en avez-vous (probablement) jamais entendu parler ? Eh bien, la réponse est simple : Node.js fait tout cela automatiquement pour vous.

C'est génial ! Mais aussi pas si génial quand on essaie de comprendre comment implémenter nos flux personnalisés.

::: info NOTE
Dans la plupart des machines, il existe une taille d'octet qui détermine quand une mémoire tampon est pleine (qui variera d'une machine à l'autre). Node.js vous permet de définir votre propre `highWaterMark`, mais généralement, la valeur par défaut est de 16 ko (16 384 ou 16 pour les flux objectMode). Dans les cas où vous voudriez augmenter cette valeur, n'hésitez pas, mais faites-le avec prudence !
:::


## Cycle de vie de `.pipe()`

Pour mieux comprendre la contre-pression, voici un organigramme du cycle de vie d'un flux `Readable` qui est [connecté](/fr/nodejs/api/stream) à un flux `Writable` :

```bash
                                                     +===================+
                         x-->  Fonctions de pipeline +-->   src.pipe(dest)  |
                         x     sont configurées pendant|===================|
                         x     la méthode .pipe.       |  Callbacks d'événements  |
  +===============+      x                           |-------------------|
  |   Vos données   |      x     Elles existent en dehors| .on('close', cb)  |
  +=======+=======+      x     du flux de données, mais | .on('data', cb)   |
          |              x     attachent des événements| .on('drain', cb)  |
          |              x     et leurs callbacks   | .on('unpipe', cb) |
+---------v---------+    x     respectifs.          | .on('error', cb)  |
|  Flux Readable  +----+                           | .on('finish', cb) |
+-^-------^-------^-+    |                           | .on('end', cb)    |
  ^       |       ^      |                           +-------------------+
  |       |       |      |
  |       ^       |      |
  ^       ^       ^      |    +-------------------+         +=================+
  ^       |       ^      +---->  Flux Writable  +--------->  .write(chunk)  |
  |       |       |           +-------------------+         +=======+=========+
  |       ^       |                                                 |
  |       |       |                              +------------------v---------+
  ^       |       +-> if (!chunk)                |    Ce chunk est-il trop gros ? |
  ^       |       |     emit .end();             |    La queue est-elle occupée ?      |
  |       |       +-> else                       +-------+----------------+---+
  |       ^       |     emit .write();                   |                |
  |       ^       ^                                   +--v---+        +---v---+
  |       |       ^-----------------------------------<  Non  |        |  Oui  |
  ^       |                                           +------+        +---v---+
  ^       |                                                               |
  |       ^               emit .pause();          +=================+     |
  |       ^---------------^-----------------------+  return false;  <-----+---+
  |                                               +=================+         |
  |                                                                           |
  ^            lorsque la queue est vide +============+                         |
  ^------------^-----------------------<  Buffering |                         |
               |                       |============|                         |
               +> emit .drain();       |  ^Buffer^  |                         |
               +> emit .resume();      +------------+                         |
                                       |  ^Buffer^  |                         |
                                       +------------+   ajouter le chunk à la queue |
                                       |            <---^---------------------<
                                       +============+
```

::: tip NOTE
Si vous configurez un pipeline pour enchaîner quelques flux afin de manipuler vos données, vous implémenterez très probablement un flux Transform.
:::

Dans ce cas, la sortie de votre flux `Readable` entrera dans le `Transform` et sera connectée au `Writable`.

```javascript
Readable.pipe(Transformable).pipe(Writable);
```

La contre-pression sera automatiquement appliquée, mais notez que les `highwaterMark` entrants et sortants du flux `Transform` peuvent être manipulés et affecteront le système de contre-pression.


## Directives concernant la contre-pression

Depuis Node.js v0.10, la classe Stream offre la possibilité de modifier le comportement de `.read()` ou `.write()` en utilisant la version soulignée de ces fonctions respectives (`._read()` et `._write()`).

Des directives sont documentées pour implémenter des flux Readable et implémenter des flux Writable. Nous supposerons que vous les avez lues, et la section suivante approfondira un peu plus le sujet.

## Règles à respecter lors de l'implémentation de flux personnalisés

La règle d'or des flux est de toujours respecter la contre-pression. Ce qui constitue une bonne pratique est une pratique non contradictoire. Tant que vous veillez à éviter les comportements qui entrent en conflit avec la prise en charge interne de la contre-pression, vous pouvez être sûr de suivre de bonnes pratiques.

En général,

1. Ne jamais `.push()` si vous n'êtes pas invité à le faire.
2. Ne jamais appeler `.write()` après qu'il ait renvoyé false, mais attendre plutôt 'drain'.
3. Les flux changent entre les différentes versions de Node.js et la bibliothèque que vous utilisez. Soyez prudent et testez les choses.

::: tip NOTE
En ce qui concerne le point 3, un package extrêmement utile pour la construction de flux de navigateur est `readable-stream`. Rodd Vagg a écrit un [excellent article de blog](https://r.va.gg/2014/06/why-i-dont-use-nodes-core-stream-module.html) décrivant l'utilité de cette bibliothèque. En bref, il fournit une sorte de dégradation progressive automatisée pour les flux Readable et prend en charge les anciennes versions des navigateurs et de Node.js.
:::

## Règles spécifiques aux flux Readable

Jusqu'à présent, nous avons examiné comment `.write()` affecte la contre-pression et nous nous sommes concentrés principalement sur le flux Writable. En raison de la fonctionnalité de Node.js, les données circulent techniquement en aval du Readable vers le Writable. Cependant, comme nous pouvons l'observer dans toute transmission de données, de matière ou d'énergie, la source est tout aussi importante que la destination, et le flux Readable est vital pour la manière dont la contre-pression est gérée.

Ces deux processus dépendent l'un de l'autre pour communiquer efficacement. Si le Readable ignore le moment où le flux Writable lui demande d'arrêter d'envoyer des données, cela peut être tout aussi problématique que lorsque la valeur de retour de `.write()` est incorrecte.

Ainsi, en plus de respecter le retour de `.write()`, nous devons également respecter la valeur de retour de `.push()` utilisée dans la méthode `._read()`. Si `.push()` renvoie une valeur false, le flux cessera de lire à partir de la source. Sinon, il continuera sans pause.

Voici un exemple de mauvaise pratique utilisant `.push()` :
```javascript
// Ceci est problématique car cela ignore complètement la valeur de retour du push
// qui peut être un signal de contre-pression du flux de destination !
class MyReadable extends Readable {
  _read(size) {
    let chunk;
    while (null == (chunk = getNextChunk())) {
      this.push(chunk);
    }
  }
}
```

De plus, de l'extérieur du flux personnalisé, il existe des pièges à ignorer la contre-pression. Dans ce contre-exemple de bonne pratique, le code de l'application force le passage des données chaque fois qu'elles sont disponibles (signalé par l'événement `'data'`) :

```javascript
// Ceci ignore les mécanismes de contre-pression que Node.js a mis en place,
// et pousse inconditionnellement les données, peu importe si le
// flux de destination est prêt ou non.
readable.on('data', data => writable.write(data));
```

Voici un exemple d'utilisation de `.push()` avec un flux Readable.

```javascript
const { Readable } = require('node:stream');

// Créer un flux Readable personnalisé
const myReadableStream = new Readable({
  objectMode: true,
  read(size) {
    // Pousser des données sur le flux
    this.push({ message: 'Hello, world!' });
    this.push(null); // Marquer la fin du flux
  },
});

// Consommer le flux
myReadableStream.on('data', chunk => {
  console.log(chunk);
});

// Sortie :
// { message: 'Hello, world!' }
```


## Règles spécifiques aux flux inscriptibles

Rappelez-vous qu'un `.write()` peut renvoyer true ou false en fonction de certaines conditions. Heureusement pour nous, lors de la construction de notre propre flux Writable, la machine d'état du flux gérera nos rappels et déterminera quand gérer la contre-pression et optimiser le flux de données pour nous. Cependant, lorsque nous voulons utiliser un Writable directement, nous devons respecter la valeur de retour de `.write()` et porter une attention particulière à ces conditions :
- Si la file d'attente d'écriture est occupée, `.write()` renverra false.
- Si le bloc de données est trop volumineux, `.write()` renverra false (la limite est indiquée par la variable highWaterMark).

Dans cet exemple, nous créons un flux Readable personnalisé qui pousse un seul objet sur le flux en utilisant `.push()`. La méthode `._read()` est appelée lorsque le flux est prêt à consommer des données, et dans ce cas, nous poussons immédiatement des données sur le flux et marquons la fin du flux en poussant `null`.
```javascript
const stream = require('stream');

class MyReadable extends stream.Readable {
  constructor() {
    super();
  }

  _read() {
    const data = { message: 'Hello, world!' };
    this.push(data);
    this.push(null);
  }
}

const readableStream = new MyReadable();

readableStream.pipe(process.stdout);
```
Nous consommons ensuite le flux en écoutant l'événement 'data' et en enregistrant chaque bloc de données qui est poussé sur le flux. Dans ce cas, nous ne poussons qu'un seul bloc de données sur le flux, nous ne voyons donc qu'un seul message de journal.

## Règles spécifiques aux flux inscriptibles

Rappelez-vous qu'un `.write()` peut renvoyer true ou false en fonction de certaines conditions. Heureusement pour nous, lors de la construction de notre propre flux Writable, la machine d'état du flux gérera nos rappels et déterminera quand gérer la contre-pression et optimiser le flux de données pour nous.

Cependant, lorsque nous voulons utiliser un Writable directement, nous devons respecter la valeur de retour de `.write()` et porter une attention particulière à ces conditions :
- Si la file d'attente d'écriture est occupée, `.write()` renverra false.
- Si le bloc de données est trop volumineux, `.write()` renverra false (la limite est indiquée par la variable highWaterMark).

```javascript
class MyWritable extends Writable {
  // Ce writable n'est pas valide en raison de la nature asynchrone des rappels JavaScript.
  // Sans instruction de retour pour chaque rappel avant le dernier,
  // il y a de fortes chances que plusieurs rappels soient appelés.
  write(chunk, encoding, callback) {
    if (chunk.toString().indexOf('a') >= 0) callback();
    else if (chunk.toString().indexOf('b') >= 0) callback();
    callback();
  }
}
```

Il y a aussi des choses à surveiller lors de l'implémentation de `._writev()`. La fonction est couplée à `.cork()`, mais il y a une erreur courante lors de l'écriture :

```javascript
// L'utilisation de .uncork() deux fois ici fait deux appels sur la couche C++, ce qui rend le
// la technique du bouchon/débouchage inutile.
ws.cork();
ws.write('hello ');
ws.write('world ');
ws.uncork();

ws.cork();
ws.write('from ');
ws.write('Matteo');
ws.uncork();

// La façon correcte d'écrire ceci est d'utiliser process.nextTick(), qui se déclenche
// sur la prochaine boucle d'événements.
ws.cork();
ws.write('hello ');
ws.write('world ');
process.nextTick(doUncork, ws);

ws.cork();
ws.write('from ');
ws.write('Matteo');
process.nextTick(doUncork, ws);

// En tant que fonction globale.
function doUncork(stream) {
  stream.uncork();
}
```

`.cork()` peut être appelé autant de fois que nous le souhaitons, nous devons juste faire attention à appeler `.uncork()` le même nombre de fois pour le faire couler à nouveau.


## Conclusion

Les streams sont un module fréquemment utilisé dans Node.js. Ils sont importants pour la structure interne et, pour les développeurs, pour s'étendre et se connecter à travers l'écosystème des modules Node.js.

Nous espérons que vous serez maintenant en mesure de dépanner et de coder en toute sécurité vos propres streams `Writable` et `Readable` en gardant à l'esprit la contre-pression, et de partager vos connaissances avec vos collègues et amis.

N'oubliez pas de vous renseigner davantage sur `Stream` pour connaître d'autres fonctions API qui vous aideront à améliorer et à libérer vos capacités de streaming lors de la création d'une application avec Node.js.

