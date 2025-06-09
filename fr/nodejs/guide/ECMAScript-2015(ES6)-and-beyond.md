---
title: ECMAScript 2015 (ES6) et au-delà dans Node.js
description: Node.js prend en charge les fonctionnalités ECMAScript modernes via le moteur V8, avec de nouvelles fonctionnalités et améliorations apportées de manière opportune.
head:
  - - meta
    - name: og:title
      content: ECMAScript 2015 (ES6) et au-delà dans Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js prend en charge les fonctionnalités ECMAScript modernes via le moteur V8, avec de nouvelles fonctionnalités et améliorations apportées de manière opportune.
  - - meta
    - name: twitter:title
      content: ECMAScript 2015 (ES6) et au-delà dans Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js prend en charge les fonctionnalités ECMAScript modernes via le moteur V8, avec de nouvelles fonctionnalités et améliorations apportées de manière opportune.
---


# ECMAScript 2015 (ES6) et versions ultérieures

Node.js est construit sur des versions modernes de [V8](https://v8.dev/). En restant à jour avec les dernières versions de ce moteur, nous nous assurons que les nouvelles fonctionnalités de la [spécification JavaScript ECMA-262](https://tc39.es/ecma262/) soient mises à la disposition des développeurs Node.js en temps opportun, ainsi que des améliorations continues de la performance et de la stabilité.

Toutes les fonctionnalités ECMAScript 2015 (ES6) sont divisées en trois groupes : fonctionnalités `livrées`, `en phase de préparation` et `en cours de développement` :

+ Toutes les fonctionnalités `livrées`, que V8 considère comme stables, sont activées `par défaut sur Node.js` et ne nécessitent `AUCUN` type de drapeau d'exécution.
+ Les fonctionnalités `en phase de préparation`, qui sont des fonctionnalités presque terminées mais qui ne sont pas considérées comme stables par l'équipe V8, nécessitent un drapeau d'exécution : `--harmony`.
+ Les fonctionnalités `en cours de développement` peuvent être activées individuellement par leur drapeau d'harmonie respectif, bien que cela soit fortement déconseillé, sauf à des fins de test. Remarque : ces drapeaux sont exposés par V8 et sont susceptibles de changer sans aucun avis de dépréciation.

## Quelles fonctionnalités sont livrées par défaut avec quelle version de Node.js ?

Le site web [node.green](https://node.green) fournit un excellent aperçu des fonctionnalités ECMAScript prises en charge dans diverses versions de Node.js, basé sur la table de compatibilité de kangax.

## Quelles sont les fonctionnalités en cours de développement ?

De nouvelles fonctionnalités sont constamment ajoutées au moteur V8. En règle générale, attendez-vous à ce qu'elles arrivent dans une future version de Node.js, bien que le calendrier soit inconnu.

Vous pouvez répertorier toutes les fonctionnalités en cours de développement disponibles sur chaque version de Node.js en effectuant une recherche dans l'argument `--v8-options`. Veuillez noter qu'il s'agit de fonctionnalités incomplètes et potentiellement défectueuses de V8, utilisez-les donc à vos risques et périls :

```sh
node --v8-options | grep "in progress"
```

## J'ai configuré mon infrastructure pour tirer parti du drapeau --harmony. Dois-je le supprimer ?

Le comportement actuel du drapeau `--harmony` sur Node.js est d'activer uniquement les fonctionnalités `en phase de préparation`. Après tout, c'est maintenant un synonyme de `--es_staging`. Comme mentionné ci-dessus, ce sont des fonctionnalités terminées qui n'ont pas encore été considérées comme stables. Si vous voulez jouer la sécurité, surtout dans les environnements de production, envisagez de supprimer ce drapeau d'exécution jusqu'à ce qu'il soit livré par défaut sur V8 et, par conséquent, sur Node.js. Si vous le maintenez activé, vous devez vous préparer à ce que les futures mises à niveau de Node.js cassent votre code si V8 modifie sa sémantique pour se conformer plus étroitement à la norme.


## Comment trouver la version de V8 fournie avec une version particulière de Node.js ?

Node.js offre un moyen simple de lister toutes les dépendances et versions respectives fournies avec un binaire spécifique via l'objet global `process`. Dans le cas du moteur V8, tapez la commande suivante dans votre terminal pour récupérer sa version :

```sh
node -p process.versions.v8
```

