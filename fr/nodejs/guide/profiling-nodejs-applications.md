---
title: Analyse de performances des applications Node.js
description: Découvrez comment utiliser le profilage intégré de Node.js pour identifier les goulots d'étranglement des performances de votre application et améliorer ses performances.
head:
  - - meta
    - name: og:title
      content: Analyse de performances des applications Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Découvrez comment utiliser le profilage intégré de Node.js pour identifier les goulots d'étranglement des performances de votre application et améliorer ses performances.
  - - meta
    - name: twitter:title
      content: Analyse de performances des applications Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Découvrez comment utiliser le profilage intégré de Node.js pour identifier les goulots d'étranglement des performances de votre application et améliorer ses performances.
---


# Profilage d'applications Node.js

Il existe de nombreux outils tiers disponibles pour le profilage des applications Node.js, mais, dans de nombreux cas, l'option la plus simple consiste à utiliser le profileur intégré de Node.js. Le profileur intégré utilise le [profileur à l'intérieur de V8](https://v8.dev/docs/profile) qui échantillonne la pile à intervalles réguliers pendant l'exécution du programme. Il enregistre les résultats de ces échantillons, ainsi que les événements d'optimisation importants tels que les compilations JIT, sous forme de série de ticks :

```bash
code-creation,LazyCompile,0,0x2d5000a337a0,396,"bp native array.js:1153:16",0x289f644df68,~
code-creation,LazyCompile,0,0x2d5000a33940,716,"hasOwnProperty native v8natives.js:198:30",0x289f64438d0,~
code-creation,LazyCompile,0,0x2d5000a33c20,284,"ToName native runtime.js:549:16",0x289f643bb28,~
code-creation,Stub,2,0x2d5000a33d40,182,"DoubleToIStub"
code-creation,Stub,2,0x2d5000a33e00,507,"NumberToStringStub"
```

Auparavant, vous aviez besoin du code source V8 pour pouvoir interpréter les ticks. Heureusement, des outils ont été introduits depuis Node.js 4.4.0 qui facilitent la consommation de ces informations sans avoir à compiler séparément V8 à partir des sources. Voyons comment le profileur intégré peut aider à mieux comprendre les performances de l'application.

Pour illustrer l'utilisation du profileur de ticks, nous allons travailler avec une simple application Express. Notre application aura deux gestionnaires, un pour ajouter de nouveaux utilisateurs à notre système :

```javascript
app.get('/newUser', (req, res) => {
  let username = req.query.username || '';
  const password = req.query.password || '';
  username = username.replace(/[!@#$%^&*]/g, '');
  if (!username || !password || users[username]) {
    return res.sendStatus(400);
  }
  const salt = crypto.randomBytes(128).toString('base64');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512');
  users[username] = { salt, hash };
  res.sendStatus(200);
});
```

et un autre pour valider les tentatives d'authentification des utilisateurs :

```javascript
app.get('/auth', (req, res) => {
  let username = req.query.username || '';
  const password = req.query.password || '';
  username = username.replace(/[!@#$%^&*]/g, '');
  if (!username || !password || !users[username]) {
    return res.sendStatus(400);
  }
  const { salt, hash } = users[username];
  const encryptHash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512');
  if (crypto.timingSafeEqual(hash, encryptHash)) {
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});
```

*Veuillez noter que ce ne sont PAS des gestionnaires recommandés pour l'authentification des utilisateurs dans vos applications Node.js et qu'ils sont utilisés uniquement à des fins d'illustration. En général, vous ne devriez pas essayer de concevoir vos propres mécanismes d'authentification cryptographique. Il est bien préférable d'utiliser des solutions d'authentification existantes et éprouvées.*

Supposons maintenant que nous ayons déployé notre application et que les utilisateurs se plaignent d'une latence élevée des requêtes. Nous pouvons facilement exécuter l'application avec le profileur intégré :

```bash
NODE_ENV=production node --prof app.js
```

et mettre une certaine charge sur le serveur en utilisant `ab` (ApacheBench) :

```bash
curl -X GET "http://localhost:8080/newUser?username=matt&password=password"
ab -k -c 20 -n 250 "http://localhost:8080/auth?username=matt&password=password"
```

et obtenir une sortie ab de :

```bash
Concurrency Level:      20
Time taken for tests:   46.932 seconds
Complete requests:      250
Failed requests:        0
Keep-Alive requests:    250
Total transferred:      50250 bytes
HTML transferred:       500 bytes
Requests per second:    5.33 [#/sec] (mean)
Time per request:       3754.556 [ms] (mean)
Time per request:       187.728 [ms] (mean, across all concurrent requests)
Transfer rate:          1.05 [Kbytes/sec] received
...
Percentage of the requests served within a certain time (ms)
  50%   3755
  66%   3804
  75%   3818
  80%   3825
  90%   3845
  95%   3858
  98%   3874
  99%   3875
 100%   4225 (longest request)
```

D'après cette sortie, nous voyons que nous ne parvenons à traiter qu'environ 5 requêtes par seconde et que la requête moyenne prend un peu moins de 4 secondes aller-retour. Dans un exemple réel, nous pourrions faire beaucoup de travail dans de nombreuses fonctions pour le compte d'une requête utilisateur, mais même dans notre simple exemple, du temps pourrait être perdu à compiler des expressions régulières, à générer des sels aléatoires, à générer des hachages uniques à partir des mots de passe des utilisateurs ou à l'intérieur du framework Express lui-même.

Étant donné que nous avons exécuté notre application à l'aide de l'option `--prof`, un fichier de ticks a été généré dans le même répertoire que votre exécution locale de l'application. Il devrait avoir la forme `isolate-0xnnnnnnnnnnnn-v8.log` (où n est un chiffre).

Afin de comprendre ce fichier, nous devons utiliser le processeur de ticks fourni avec le binaire Node.js. Pour exécuter le processeur, utilisez l'indicateur `--prof-process` :

```bash
node --prof-process isolate-0xnnnnnnnnnnnn-v8.log > processed.txt
```

L'ouverture de processed.txt dans votre éditeur de texte préféré vous donnera plusieurs types d'informations différents. Le fichier est divisé en sections qui sont à leur tour divisées par langue. Tout d'abord, nous regardons la section de résumé et voyons :

```bash
[Summary]:
   ticks  total  nonlib   name
     79    0.2%    0.2%  JavaScript
  36703   97.2%   99.2%  C++
      7    0.0%    0.0%  GC
    767    2.0%          Shared libraries
    215    0.6%          Unaccounted
```

Cela nous indique que 97 % de tous les échantillons collectés se sont produits dans du code C++ et que lorsque nous visualisons d'autres sections de la sortie traitée, nous devons accorder plus d'attention au travail effectué en C++ (par opposition à JavaScript). Dans cette optique, nous trouvons ensuite la section [C++] qui contient des informations sur les fonctions C++ qui prennent le plus de temps CPU et nous voyons :

```bash
 [C++]:
   ticks  total  nonlib   name
  19557   51.8%   52.9%  node::crypto::PBKDF2(v8::FunctionCallbackInfo<v8::Value> const&)
   4510   11.9%   12.2%  _sha1_block_data_order
   3165    8.4%    8.6%  _malloc_zone_malloc
```

Nous voyons que les 3 premières entrées représentent 72,1 % du temps CPU pris par le programme. D'après cette sortie, nous voyons immédiatement qu'au moins 51,8 % du temps CPU est pris par une fonction appelée PBKDF2 qui correspond à notre génération de hachage à partir du mot de passe d'un utilisateur. Cependant, il peut ne pas être immédiatement évident de savoir comment les deux entrées inférieures interviennent dans notre application (ou si c'est le cas, nous ferons semblant du contraire pour l'exemple). Pour mieux comprendre la relation entre ces fonctions, nous allons ensuite examiner la section [Bottom up (heavy) profile] qui fournit des informations sur les principaux appelants de chaque fonction. En examinant cette section, nous trouvons :

```bash
  ticks parent  name
  19557   51.8%  node::crypto::PBKDF2(v8::FunctionCallbackInfo<v8::Value> const&)
  19557  100.0%    v8::internal::Builtins::~Builtins()
  19557  100.0%      LazyCompile: ~pbkdf2 crypto.js:557:16
   4510   11.9%  _sha1_block_data_order
   4510  100.0%    LazyCompile: *pbkdf2 crypto.js:557:16
   4510  100.0%      LazyCompile: *exports.pbkdf2Sync crypto.js:552:30
   3165    8.4%  _malloc_zone_malloc
   3161   99.9%    LazyCompile: *pbkdf2 crypto.js:557:16
   3161  100.0%      LazyCompile: *exports.pbkdf2Sync crypto.js:552:30
```

L'analyse de cette section demande un peu plus de travail que les nombres de ticks bruts ci-dessus. Dans chacune des "piles d'appels" ci-dessus, le pourcentage dans la colonne parent vous indique le pourcentage d'échantillons pour lesquels la fonction dans la ligne au-dessus a été appelée par la fonction dans la ligne actuelle. Par exemple, dans la "pile d'appels" du milieu ci-dessus pour `_sha1_block_data_order`, nous voyons que `_sha1_block_data_order` s'est produit dans 11,9 % des échantillons, ce que nous savions d'après les nombres bruts ci-dessus. Cependant, ici, nous pouvons également dire qu'elle a toujours été appelée par la fonction pbkdf2 à l'intérieur du module crypto de Node.js. Nous voyons que de même, _malloc_zone_malloc a été appelé presque exclusivement par la même fonction pbkdf2. Ainsi, en utilisant les informations de cette vue, nous pouvons dire que notre calcul de hachage à partir du mot de passe de l'utilisateur représente non seulement les 51,8 % d'en haut, mais également tout le temps CPU dans les 3 fonctions les plus échantillonnées, car les appels à `_sha1_block_data_order` et `_malloc_zone_malloc` ont été effectués pour le compte de la fonction pbkdf2.

À ce stade, il est très clair que la génération de hachage basée sur le mot de passe doit être la cible de notre optimisation. Heureusement, vous avez pleinement intériorisé les [avantages de la programmation asynchrone](https://nodesource.com/blog/why-asynchronous) et vous réalisez que le travail de génération d'un hachage à partir du mot de passe de l'utilisateur est effectué de manière synchrone et lie donc la boucle d'événement. Cela nous empêche de travailler sur d'autres demandes entrantes tout en calculant un hachage.

Pour remédier à ce problème, vous apportez une petite modification aux gestionnaires ci-dessus pour utiliser la version asynchrone de la fonction pbkdf2 :

```javascript
app.get('/auth', (req, res) => {
  let username = req.query.username || '';
  const password = req.query.password || '';
  username = username.replace(/[!@#$%^&*]/g, '');
  if (!username || !password || !users[username]) {
    return res.sendStatus(400);
  }
  crypto.pbkdf2(
    password,
    users[username].salt,
    10000,
    512,
    'sha512',
    (err, hash) => {
      if (users[username].hash.toString() === hash.toString()) {
        res.sendStatus(200);
      } else {
        res.sendStatus(401);
      }
    }
  );
});
```

Une nouvelle exécution du benchmark ab ci-dessus avec la version asynchrone de votre application donne :

```bash
Concurrency Level:      20
Time taken for tests:   12.846 seconds
Complete requests:      250
Failed requests:        0
Keep-Alive requests:    250
Total transferred:      50250 bytes
HTML transferred:       500 bytes
Requests per second:    19.46 [#/sec] (mean)
Time per request:       1027.689 [ms] (mean)
Time per request:       51.384 [ms] (mean, across all concurrent requests)
Transfer rate:          3.82 [Kbytes/sec] received
...
Percentage of the requests served within a certain time (ms)
  50%   1018
  66%   1035
  75%   1041
  80%   1043
  90%   1049
  95%   1063
  98%   1070
  99%   1071
 100%   1079 (longest request)
```

Super ! Votre application traite maintenant environ 20 requêtes par seconde, soit environ 4 fois plus qu'avec la génération de hachage synchrone. De plus, la latence moyenne est passée des 4 secondes précédentes à un peu plus de 1 seconde.

Espérons que, grâce à l'enquête de performance de cet exemple (certes artificiel), vous avez vu comment le processeur de ticks V8 peut vous aider à mieux comprendre les performances de vos applications Node.js.

Vous pouvez également trouver [comment créer un graphique de flammes utile](/fr/nodejs/guide/flame-graphs).

