---
title: Meilleures pratiques de sécurité pour les applications Node.js
description: Un guide complet pour sécuriser les applications Node.js, couvrant la modélisation des menaces, les meilleures pratiques et les atténuations des vulnérabilités courantes telles que le refus de service, la rebinding DNS et l'exposition d'informations sensibles.
head:
  - - meta
    - name: og:title
      content: Meilleures pratiques de sécurité pour les applications Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Un guide complet pour sécuriser les applications Node.js, couvrant la modélisation des menaces, les meilleures pratiques et les atténuations des vulnérabilités courantes telles que le refus de service, la rebinding DNS et l'exposition d'informations sensibles.
  - - meta
    - name: twitter:title
      content: Meilleures pratiques de sécurité pour les applications Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Un guide complet pour sécuriser les applications Node.js, couvrant la modélisation des menaces, les meilleures pratiques et les atténuations des vulnérabilités courantes telles que le refus de service, la rebinding DNS et l'exposition d'informations sensibles.
---


# Bonnes pratiques de sécurité

### Intention

Ce document a pour but d'étendre le [modèle de menace](/fr/nodejs/guide/security-best-practices#threat-model) actuel et de fournir des directives complètes sur la manière de sécuriser une application Node.js.

## Contenu du document

- Bonnes pratiques : Une manière simplifiée et condensée de voir les meilleures pratiques. Nous pouvons utiliser [ce problème](https://github.com/nodejs/security-wg/issues/488) ou [cette directive](https://github.com/goldbergyoni/nodebestpractices) comme point de départ. Il est important de noter que ce document est spécifique à Node.js. Si vous recherchez quelque chose de plus large, envisagez les [OSSF Best Practices](https://github.com/ossf/wg-best-practices-os-developers).
- Attaques expliquées : illustrer et documenter en termes simples avec quelques exemples de code (si possible) les attaques que nous mentionnons dans le modèle de menace.
- Bibliothèques tierces : définir les menaces (attaques de typosquattage, paquets malveillants...) et les bonnes pratiques concernant les dépendances des modules node, etc...

## Liste des menaces

### Déni de service du serveur HTTP (CWE-400)

Il s'agit d'une attaque où l'application devient indisponible pour l'usage auquel elle est destinée en raison de la manière dont elle traite les requêtes HTTP entrantes. Ces requêtes ne doivent pas nécessairement être délibérément conçues par un acteur malveillant : un client mal configuré ou bogué peut également envoyer un modèle de requêtes au serveur qui entraîne un déni de service.

Les requêtes HTTP sont reçues par le serveur HTTP de Node.js et transmises au code de l'application via le gestionnaire de requêtes enregistré. Le serveur n'analyse pas le contenu du corps de la requête. Par conséquent, tout DoS causé par le contenu du corps après qu'il ait été transmis au gestionnaire de requêtes n'est pas une vulnérabilité de Node.js lui-même, car il incombe au code de l'application de le gérer correctement.

Assurez-vous que le serveur Web gère correctement les erreurs de socket, par exemple, lorsqu'un serveur est créé sans gestionnaire d'erreurs, il sera vulnérable aux DoS.

```javascript
import net from 'node:net'
const server = net.createServer(socket => {
  // socket.on('error', console.error) // ceci empêche le serveur de planter
  socket.write('Echo server\r\n')
  socket.pipe(socket)
})
server.listen(5000, '0.0.0.0')
```

_Si une mauvaise requête est effectuée, le serveur pourrait planter._

Un exemple d'attaque DoS qui n'est pas causée par le contenu de la requête est Slowloris. Dans cette attaque, les requêtes HTTP sont envoyées lentement et fragmentées, un fragment à la fois. Jusqu'à ce que la requête complète soit livrée, le serveur conservera les ressources dédiées à la requête en cours. Si suffisamment de ces requêtes sont envoyées en même temps, le nombre de connexions simultanées atteindra bientôt son maximum, ce qui entraînera un déni de service. C'est ainsi que l'attaque ne dépend pas du contenu de la requête, mais du timing et du modèle des requêtes envoyées au serveur.


#### Mesures d'atténuation

- Utiliser un proxy inverse pour recevoir et transférer les requêtes vers l'application Node.js. Les proxys inverses peuvent fournir une mise en cache, un équilibrage de charge, une liste noire d'adresses IP, etc., ce qui réduit la probabilité qu'une attaque DoS soit efficace.
- Configurer correctement les délais d'attente du serveur, afin que les connexions inactives ou pour lesquelles les requêtes arrivent trop lentement puissent être abandonnées. Voir les différents délais d'attente dans `http.Server`, en particulier `headersTimeout`, `requestTimeout`, `timeout` et `keepAliveTimeout`.
- Limiter le nombre de sockets ouverts par hôte et au total. Voir la [documentation http](/fr/nodejs/api/http), en particulier `agent.maxSockets`, `agent.maxTotalSockets`, `agent.maxFreeSockets` et `server.maxRequestsPerSocket`.

### DNS Rebinding (CWE-346)

Il s'agit d'une attaque qui peut cibler les applications Node.js exécutées avec l'inspecteur de débogage activé à l'aide de l'option [--inspect switch](/fr/nodejs/guide/debugging-nodejs).

Étant donné que les sites Web ouverts dans un navigateur Web peuvent effectuer des requêtes WebSocket et HTTP, ils peuvent cibler l'inspecteur de débogage exécuté localement. Ceci est généralement empêché par la [politique de même origine](/fr/nodejs/guide/debugging-nodejs) mise en œuvre par les navigateurs modernes, qui interdit aux scripts d'atteindre des ressources provenant d'origines différentes (ce qui signifie qu'un site Web malveillant ne peut pas lire les données demandées à partir d'une adresse IP locale).

Cependant, grâce au DNS rebinding, un attaquant peut temporairement contrôler l'origine de ses requêtes afin qu'elles semblent provenir d'une adresse IP locale. Pour ce faire, il contrôle à la fois un site Web et le serveur DNS utilisé pour résoudre son adresse IP. Voir [DNS Rebinding wiki](https://en.wikipedia.org/wiki/DNS_rebinding) pour plus de détails.

#### Mesures d'atténuation

- Désactiver l'inspecteur sur le signal SIGUSR1 en attachant un écouteur `process.on('SIGUSR1', …)` à celui-ci.
- Ne pas exécuter le protocole d'inspecteur en production.

### Exposition d'informations sensibles à un acteur non autorisé (CWE-552)

Tous les fichiers et dossiers inclus dans le répertoire courant sont transférés vers le registre npm lors de la publication du paquet.

Il existe des mécanismes pour contrôler ce comportement en définissant une liste de blocage avec `.npmignore` et `.gitignore` ou en définissant une liste d'autorisation dans le `package.json`.


#### Mesures d'atténuation

- Utilisez `npm publish --dry-run` pour lister tous les fichiers à publier. Assurez-vous de vérifier le contenu avant de publier le paquet.
- Il est également important de créer et de maintenir des fichiers d'exclusion tels que `.gitignore` et `.npmignore`. Dans ces fichiers, vous pouvez spécifier les fichiers/dossiers qui ne doivent pas être publiés. La [propriété files](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#files) dans `package.json` permet l'opération inverse -- liste `allowed`.
- En cas d'exposition, assurez-vous de [dépublier le paquet](https://docs.npmjs.com/unpublishing-packages-from-the-registry).

### Contrebande de requêtes HTTP (CWE-444)

Il s'agit d'une attaque impliquant deux serveurs HTTP (généralement un proxy et une application Node.js). Un client envoie une requête HTTP qui passe d'abord par le serveur frontal (le proxy) puis est redirigée vers le serveur dorsal (l'application). Lorsque le frontal et le dorsal interprètent différemment les requêtes HTTP ambiguës, il est possible pour un attaquant d'envoyer un message malveillant qui ne sera pas vu par le frontal mais sera vu par le dorsal, le "faisant passer en contrebande" devant le serveur proxy.

Consultez [CWE-444](https://cwe.mitre.org/data/definitions/444.html) pour une description plus détaillée et des exemples.

Étant donné que cette attaque dépend de l'interprétation des requêtes HTTP par Node.js différemment d'un serveur HTTP (arbitraire), une attaque réussie peut être due à une vulnérabilité dans Node.js, le serveur frontal, ou les deux. Si la manière dont la requête est interprétée par Node.js est conforme à la spécification HTTP (voir [RFC7230](https://datatracker.ietf.org/doc/html/rfc7230#section-3)), alors elle n'est pas considérée comme une vulnérabilité dans Node.js.

#### Mesures d'atténuation

- N'utilisez pas l'option `insecureHTTPParser` lors de la création d'un serveur HTTP.
- Configurez le serveur frontal pour normaliser les requêtes ambiguës.
- Surveillez en permanence les nouvelles vulnérabilités de contrebande de requêtes HTTP à la fois dans Node.js et dans le serveur frontal de votre choix.
- Utilisez HTTP/2 de bout en bout et désactivez la rétrogradation HTTP si possible.


### Exposition d'informations via des attaques de synchronisation (CWE-208)

Il s'agit d'une attaque qui permet à l'attaquant d'apprendre des informations potentiellement sensibles, par exemple, en mesurant le temps nécessaire à l'application pour répondre à une requête. Cette attaque n'est pas spécifique à Node.js et peut cibler presque tous les environnements d'exécution.

L'attaque est possible chaque fois que l'application utilise un secret dans une opération sensible au temps (par exemple, une branche). Prenons l'exemple de la gestion de l'authentification dans une application typique. Ici, une méthode d'authentification de base comprend l'email et le mot de passe comme informations d'identification. Les informations de l'utilisateur sont récupérées à partir de la saisie que l'utilisateur a fournie, idéalement à partir d'un SGBD. Lors de la récupération des informations de l'utilisateur, le mot de passe est comparé aux informations de l'utilisateur récupérées dans la base de données. L'utilisation de la comparaison de chaînes intégrée prend plus de temps pour les valeurs de même longueur. Cette comparaison, lorsqu'elle est exécutée pendant une durée acceptable, augmente involontairement le temps de réponse de la requête. En comparant les temps de réponse des requêtes, un attaquant peut deviner la longueur et la valeur du mot de passe dans une grande quantité de requêtes.

#### Atténuations

- L'API crypto expose une fonction `timingSafeEqual` pour comparer les valeurs sensibles réelles et attendues à l'aide d'un algorithme à temps constant.
- Pour la comparaison des mots de passe, vous pouvez utiliser le [scrypt](/fr/nodejs/api/crypto) également disponible sur le module crypto natif.
- Plus généralement, évitez d'utiliser des secrets dans des opérations à temps variable. Cela inclut la ramification sur des secrets et, lorsque l'attaquant pourrait être colocalisé sur la même infrastructure (par exemple, la même machine cloud), l'utilisation d'un secret comme index dans la mémoire. L'écriture de code à temps constant en JavaScript est difficile (en partie à cause du JIT). Pour les applications de crypto, utilisez les API crypto intégrées ou WebAssembly (pour les algorithmes qui ne sont pas implémentés en mode natif).

### Modules tiers malveillants (CWE-1357)

Actuellement, dans Node.js, n'importe quel package peut accéder à des ressources puissantes telles que l'accès au réseau. De plus, comme ils ont également accès au système de fichiers, ils peuvent envoyer n'importe quelles données n'importe où.

Tout code s'exécutant dans un processus Node a la possibilité de charger et d'exécuter du code arbitraire supplémentaire en utilisant `eval()` (ou ses équivalents). Tout code avec un accès en écriture au système de fichiers peut faire de même en écrivant dans des fichiers nouveaux ou existants qui sont chargés.

Node.js dispose d'un [mécanisme de politique](/fr/nodejs/api/permissions) expérimental¹ pour déclarer la ressource chargée comme non approuvée ou approuvée. Cependant, cette politique n'est pas activée par défaut. Assurez-vous de bloquer les versions des dépendances et d'exécuter des vérifications automatiques des vulnérabilités à l'aide de workflows courants ou de scripts npm. Avant d'installer un package, assurez-vous que ce package est maintenu et qu'il inclut tout le contenu attendu. Soyez prudent, le code source GitHub n'est pas toujours le même que celui publié, validez-le dans `node_modules`.


#### Attaques de la chaîne d'approvisionnement

Une attaque de la chaîne d'approvisionnement sur une application Node.js se produit lorsque l'une de ses dépendances (directes ou transitives) est compromise. Cela peut se produire soit parce que l'application est trop laxiste dans la spécification des dépendances (autorisant des mises à jour indésirables) et/ou des fautes de frappe courantes dans la spécification (vulnérable au [typosquatting](https://en.wikipedia.org/wiki/Typosquatting)).

Un attaquant qui prend le contrôle d'un paquet en amont peut publier une nouvelle version contenant du code malveillant. Si une application Node.js dépend de ce paquet sans être stricte sur la version sûre à utiliser, le paquet peut être automatiquement mis à jour vers la dernière version malveillante, compromettant ainsi l'application.

Les dépendances spécifiées dans le fichier `package.json` peuvent avoir un numéro de version exact ou une plage. Cependant, lorsque l'on fixe une dépendance à une version exacte, ses dépendances transitives ne sont pas elles-mêmes fixées. Cela laisse toujours l'application vulnérable à des mises à jour indésirables/inattendues.

Vecteurs d'attaque possibles :

- Attaques de typosquatting
- Empoisonnement de lockfile
- Mainteneurs compromis
- Paquets malveillants
- Confusions de dépendances

##### Atténuations

- Empêcher npm d'exécuter des scripts arbitraires avec `--ignore-scripts`
  - De plus, vous pouvez le désactiver globalement avec `npm config set ignore-scripts true`
- Épingler les versions de dépendances à une version immuable spécifique, et non à une version qui est une plage ou provenant d'une source mutable.
- Utiliser des lockfiles, qui épinglent chaque dépendance (directe et transitive).
  - Utiliser [Atténuations pour l'empoisonnement de lockfile](https://blog.ulisesgascon.com/lockfile-posioned).
- Automatiser les vérifications des nouvelles vulnérabilités à l'aide de l'IC, avec des outils tels que [npm-audit](https://www.npmjs.com/package/npm-audit).
  - Des outils tels que `Socket` peuvent être utilisés pour analyser les paquets avec une analyse statique afin de trouver les comportements risqués tels que l'accès au réseau ou au système de fichiers.
- Utiliser `npm ci` au lieu de `npm install`. Cela applique le lockfile de sorte que les incohérences entre celui-ci et le fichier `package.json` provoquent une erreur (au lieu d'ignorer silencieusement le lockfile au profit de `package.json`).
- Vérifier attentivement le fichier `package.json` pour détecter les erreurs/fautes de frappe dans les noms des dépendances.


### Violation d'accès mémoire (CWE-284)

Les attaques basées sur la mémoire ou le tas dépendent d'une combinaison d'erreurs de gestion de la mémoire et d'un allocateur de mémoire exploitable. Comme tous les environnements d'exécution, Node.js est vulnérable à ces attaques si vos projets s'exécutent sur une machine partagée. L'utilisation d'un tas sécurisé est utile pour empêcher la fuite d'informations sensibles en raison de dépassements ou de sous-dépassements de pointeurs.

Malheureusement, un tas sécurisé n'est pas disponible sur Windows. Plus d'informations peuvent être trouvées dans la [documentation secure-heap](/fr/nodejs/api/cli) de Node.js.

#### Mesures d'atténuation

- Utilisez `--secure-heap=n` en fonction de votre application, où n est la taille maximale en octets allouée.
- N'exécutez pas votre application de production sur une machine partagée.

### Monkey Patching (CWE-349)

Le monkey patching fait référence à la modification des propriétés lors de l'exécution dans le but de modifier le comportement existant. Exemple :

```js
// eslint-disable-next-line no-extend-native
Array.prototype.push = function (item) {
  // surcharge de [].push global
}
```

#### Mesures d'atténuation

L'indicateur `--frozen-intrinsics` active les intrinsèques figés expérimentaux¹, ce qui signifie que tous les objets et fonctions JavaScript intégrés sont figés de manière récursive. Par conséquent, l'extrait de code suivant ne remplacera pas le comportement par défaut de `Array.prototype.push`

```js
// eslint-disable-next-line no-extend-native
Array.prototype.push = function (item) {
  // surcharge de [].push global
}
// Non intercepté :
// TypeError <Object <Object <[Object: null prototype] {}>>>:
// Impossible d'assigner à la propriété en lecture seule 'push' de l'objet '
```

Cependant, il est important de mentionner que vous pouvez toujours définir de nouvelles variables globales et remplacer les variables globales existantes à l'aide de `globalThis`

```bash
globalThis.foo = 3; foo; // vous pouvez toujours définir de nouvelles variables globales 3
globalThis.Array = 4; Array; // Cependant, vous pouvez également remplacer les variables globales existantes 4
```

Par conséquent, `Object.freeze(globalThis)` peut être utilisé pour garantir qu'aucune variable globale ne sera remplacée.

### Attaques par pollution de prototype (CWE-1321)

La pollution de prototype fait référence à la possibilité de modifier ou d'injecter des propriétés dans des éléments du langage Javascript en abusant de l'utilisation de \__proto_, \_constructor, prototype et d'autres propriétés héritées des prototypes intégrés.

```js
const a = { a: 1, b: 2 }
const data = JSON.parse('{"__proto__": { "polluted": true}}')
const c = Object.assign({}, a, data)
console.log(c.polluted) // true
// DoS potentiel
const data2 = JSON.parse('{"__proto__": null}')
const d = Object.assign(a, data2)
d.hasOwnProperty('b') // Uncaught TypeError: d.hasOwnProperty is not a function
```

Il s'agit d'une vulnérabilité potentielle héritée du langage JavaScript.


#### Exemples

- [CVE-2022-21824](https://www.cvedetails.com/cve/CVE-2022-21824/) (Node.js)
- [CVE-2018-3721](https://www.cvedetails.com/cve/CVE-2018-3721/) (Bibliothèque tierce : Lodash)

#### Atténuations

- Évitez les [fusions récursives non sécurisées](https://gist.github.com/DaniAkash/b3d7159fddcff0a9ee035bd10e34b277#file-unsafe-merge-js), voir [CVE-2018-16487](https://www.cve.org/CVERecord?id=CVE-2018-16487).
- Mettez en œuvre des validations de schéma JSON pour les requêtes externes/non fiables.
- Créez des objets sans prototype en utilisant `Object.create(null)`.
- Geler le prototype : `Object.freeze(MyObject.prototype)`.
- Désactivez la propriété `Object.prototype.__proto__` à l'aide de l'indicateur `--disable-proto`.
- Vérifiez que la propriété existe directement sur l'objet, et non à partir du prototype, en utilisant `Object.hasOwn(obj, keyFromObj)`.
- Évitez d'utiliser des méthodes de `Object.prototype`.

### Élément de chemin de recherche non contrôlé (CWE-427)

Node.js charge les modules en suivant l'[algorithme de résolution de module](/fr/nodejs/api/modules). Par conséquent, il suppose que le répertoire dans lequel un module est requis (require) est fiable.

Par conséquent, cela signifie le comportement d'application attendu suivant. En supposant la structure de répertoire suivante :

- app/
  - server.js
  - auth.js
  - auth

Si server.js utilise `require('./auth')`, il suivra l'algorithme de résolution de module et chargera auth au lieu de `auth.js`.

#### Atténuations

L'utilisation du [mécanisme de stratégie expérimental¹ avec vérification de l'intégrité](/fr/nodejs/api/permissions) peut éviter la menace ci-dessus. Pour le répertoire décrit ci-dessus, on peut utiliser le `policy.json` suivant.

```json
{
  "resources": {
    "./app/auth.js": {
      "integrity": "sha256-iuGZ6SFVFpMuHUcJciQTIKpIyaQVigMZlvg9Lx66HV8="
    },
    "./app/server.js": {
      "dependencies": {
        "./auth": "./app/auth.js"
      },
      "integrity": "sha256-NPtLCQ0ntPPWgfVEgX46ryTNpdvTWdQPoZO3kHo0bKI="
    }
  }
}
```

Par conséquent, lors de la demande du module d'authentification, le système validera l'intégrité et renverra une erreur si elle ne correspond pas à celle attendue.

```bash
» node --experimental-policy=policy.json app/server.js
node:internal/policy/sri:65
      throw new ERR_SRI_PARSE(str, str[prevIndex], prevIndex);
      ^
SyntaxError [ERR_SRI_PARSE]: Subresource Integrity string "sha256-iuGZ6SFVFpMuHUcJciQTIKpIyaQVigMZlvg9Lx66HV8=%" had an unexpected "%" at position 51
    at new NodeError (node:internal/errors:393:5)
    at Object.parse (node:internal/policy/sri:65:13)
    at processEntry (node:internal/policy/manifest:581:38)
    at Manifest.assertIntegrity (node:internal/policy/manifest:588:32)
    at Module._compile (node:internal/modules/cjs/loader:1119:21)
    at Module._extensions..js (node:internal/modules/cjs/loader:1213:10)
    at Module.load (node:internal/modules/cjs/loader:1037:32)
    at Module._load (node:internal/modules/cjs/loader:878:12)
    at Module.require (node:internal/modules/cjs/loader:1061:19)
    at require (node:internal/modules/cjs/helpers:99:18) {
  code: 'ERR_SRI_PARSE'
}
```

Notez qu'il est toujours recommandé d'utiliser `--policy-integrity` pour éviter les mutations de stratégie.


## Fonctionnalités Expérimentales en Production

L'utilisation de fonctionnalités expérimentales en production n'est pas recommandée. Les fonctionnalités expérimentales peuvent subir des modifications importantes si nécessaire, et leur fonctionnalité n'est pas stable en toute sécurité. Cependant, les commentaires sont très appréciés.

## Outils OpenSSF

L'[OpenSSF](https://www.openssf.org) dirige plusieurs initiatives qui peuvent être très utiles, surtout si vous prévoyez de publier un paquet npm. Ces initiatives comprennent :

- [OpenSSF Scorecard](https://securityscorecards.dev/) Scorecard évalue les projets open source en utilisant une série de contrôles automatisés des risques de sécurité. Vous pouvez l'utiliser pour évaluer de manière proactive les vulnérabilités et les dépendances dans votre base de code et prendre des décisions éclairées quant à l'acceptation des vulnérabilités.
- [Programme de badge des meilleures pratiques de l'OpenSSF](https://bestpractices.coreinfrastructure.org/en) Les projets peuvent volontairement s'auto-certifier en décrivant comment ils se conforment à chaque bonne pratique. Cela générera un badge qui pourra être ajouté au projet.

