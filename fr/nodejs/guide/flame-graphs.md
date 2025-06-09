---
title: Graphiques de flammes pour l'optimisation des performances de Node.js
description: Découvrez comment créer des graphiques de flammes pour visualiser le temps CPU consacré aux fonctions et optimiser les performances de Node.js.
head:
  - - meta
    - name: og:title
      content: Graphiques de flammes pour l'optimisation des performances de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Découvrez comment créer des graphiques de flammes pour visualiser le temps CPU consacré aux fonctions et optimiser les performances de Node.js.
  - - meta
    - name: twitter:title
      content: Graphiques de flammes pour l'optimisation des performances de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Découvrez comment créer des graphiques de flammes pour visualiser le temps CPU consacré aux fonctions et optimiser les performances de Node.js.
---


# Graphiques de flammes

## À quoi sert un graphique de flammes ?

Les graphiques de flammes sont une façon de visualiser le temps CPU passé dans les fonctions. Ils peuvent vous aider à identifier où vous passez trop de temps à effectuer des opérations synchrones.

## Comment créer un graphique de flammes

Vous avez peut-être entendu dire qu'il était difficile de créer un graphique de flammes pour Node.js, mais ce n'est pas vrai (plus). Les VM Solaris ne sont plus nécessaires pour les graphiques de flammes !

Les graphiques de flammes sont générés à partir de la sortie de `perf`, qui n'est pas un outil spécifique à Node. Bien que ce soit la façon la plus puissante de visualiser le temps CPU passé, il peut y avoir des problèmes avec la façon dont le code JavaScript est optimisé dans Node.js 8 et versions ultérieures. Voir la section [problèmes de sortie de perf](#perf-output-issues) ci-dessous.

### Utiliser un outil pré-emballé
Si vous voulez une seule étape qui produit un graphique de flammes localement, essayez [0x](https://www.npmjs.com/package/0x)

Pour diagnostiquer les déploiements en production, lisez ces notes : [0x serveurs de production](https://github.com/davidmarkclements/0x/blob/master/docs/production-servers.md).

### Créer un graphique de flammes avec les outils système perf
Le but de ce guide est de montrer les étapes impliquées dans la création d'un graphique de flammes et de vous permettre de contrôler chaque étape.

Si vous voulez mieux comprendre chaque étape, jetez un œil aux sections suivantes où nous entrons plus dans les détails.

Maintenant, mettons-nous au travail.

1. Installez `perf` (généralement disponible via le package linux-tools-common s'il n'est pas déjà installé)
2. Essayez d'exécuter `perf` - il pourrait se plaindre de modules du noyau manquants, installez-les aussi
3. Exécutez node avec perf activé (voir [problèmes de sortie de perf](#perf-output-issues) pour des conseils spécifiques aux versions de Node.js)
```bash
perf record -e cycles:u -g -- node --perf-basic-prof app.js
```
4. Ne tenez pas compte des avertissements, sauf s'ils indiquent que vous ne pouvez pas exécuter perf en raison de packages manquants ; vous pouvez obtenir des avertissements concernant l'impossibilité d'accéder aux échantillons de modules du noyau que vous ne recherchez pas de toute façon.
5. Exécutez `perf script > perfs.out` pour générer le fichier de données que vous visualiserez dans un instant. Il est utile d'appliquer un peu de nettoyage pour un graphique plus lisible
6. Installez stackvis si ce n'est pas déjà fait `npm i -g stackvis`
7. Exécutez `stackvis perf < perfs.out > flamegraph.htm`

Maintenant, ouvrez le fichier de graphique de flammes dans votre navigateur préféré et regardez-le brûler. Il est codé par couleur afin que vous puissiez vous concentrer d'abord sur les barres orange les plus saturées. Elles sont susceptibles de représenter des fonctions gourmandes en CPU.

Il est utile de mentionner que si vous cliquez sur un élément d'un graphique de flammes, un zoom de son environnement sera affiché au-dessus du graphique.


### Utiliser `perf` pour échantillonner un processus en cours d'exécution

C'est idéal pour enregistrer des données de graphique de flamme à partir d'un processus déjà en cours d'exécution que vous ne souhaitez pas interrompre. Imaginez un processus de production avec un problème difficile à reproduire.

```bash
perf record -F99 -p `pgrep -n node` -- sleep 3
```

À quoi sert ce `sleep 3` ? Il est là pour maintenir perf en cours d'exécution - bien que l'option `-p` pointe vers un PID différent, la commande doit être exécutée sur un processus et se terminer avec celui-ci. perf s'exécute pendant toute la durée de la commande que vous lui transmettez, que vous profiliez ou non cette commande. `sleep 3` garantit que perf s'exécute pendant 3 secondes.

Pourquoi `-F` (fréquence de profilage) est-il réglé sur 99 ? C'est une valeur par défaut raisonnable. Vous pouvez l'ajuster si vous le souhaitez. `-F99` indique à perf de prendre 99 échantillons par seconde ; pour plus de précision, augmentez la valeur. Des valeurs plus faibles devraient produire moins de sortie avec des résultats moins précis. La précision dont vous avez besoin dépend de la durée réelle d'exécution de vos fonctions gourmandes en CPU. Si vous recherchez la raison d'un ralentissement notable, 99 images par seconde devraient être plus que suffisantes.

Une fois que vous avez obtenu cet enregistrement perf de 3 secondes, passez à la génération du graphique de flamme avec les deux dernières étapes ci-dessus.

### Filtrage des fonctions internes de Node.js

Habituellement, vous voulez simplement examiner les performances de vos appels, donc filtrer les fonctions internes de Node.js et V8 peut rendre le graphique beaucoup plus facile à lire. Vous pouvez nettoyer votre fichier perf avec :

```bash
sed -i -r \
    -e '/(_libc_start|LazyCompile) |v8::internal::BuiltIn|Stub|LoadIC:\\[\\[' \
    -e '/^$/d' \
    perf.data > perf.out
```

Si vous lisez votre graphique de flamme et qu'il semble étrange, comme s'il manquait quelque chose dans la fonction clé qui prend le plus de temps, essayez de générer votre graphique de flamme sans les filtres - vous avez peut-être rencontré un cas rare de problème avec Node.js lui-même.

### Options de profilage de Node.js

`--perf-basic-prof-only-functions` et `--perf-basic-prof` sont les deux options utiles pour déboguer votre code JavaScript. Les autres options sont utilisées pour profiler Node.js lui-même, ce qui dépasse le cadre de ce guide.

`--perf-basic-prof-only-functions` produit moins de sortie, c'est donc l'option avec le moins de surcharge.


### Pourquoi en ai-je besoin ?

Eh bien, sans ces options, vous obtiendrez toujours un graphique de flammes, mais avec la plupart des barres étiquetées `v8::Function::Call`.

## Problèmes de sortie de `Perf`

### Modifications du pipeline V8 dans Node.js 8.x

Node.js 8.x et versions ultérieures sont livrés avec de nouvelles optimisations du pipeline de compilation JavaScript dans le moteur V8 qui rendent parfois les noms/références de fonction inaccessibles pour perf. (Cela s'appelle Turbofan)

Le résultat est que vous pourriez ne pas obtenir correctement vos noms de fonction dans le graphique de flammes.

Vous remarquerez `ByteCodeHandler:` là où vous vous attendriez à des noms de fonction.

0x a des mesures d'atténuation intégrées pour cela.

Pour plus de détails, voir :
- <https://github.com/nodejs/benchmarking/issues/168>
- <https://github.com/nodejs/diagnostics/issues/148#issuecomment-369348961>

### Node.js 10+

Node.js 10.x résout le problème avec Turbofan en utilisant l'option `--interpreted-frames-native-stack`.

Exécutez `node --interpreted-frames-native-stack --perf-basic-prof-only-functions` pour obtenir les noms de fonction dans le graphique de flammes, quel que soit le pipeline que V8 a utilisé pour compiler votre JavaScript.

### Étiquettes brisées dans le graphique de flammes

Si vous voyez des étiquettes ressemblant à ceci

```bash
node`_ZN2v88internal11interpreter17BytecodeGenerator15VisitStatementsEPMS0_8Zone
```

cela signifie que le Linux perf que vous utilisez n'a pas été compilé avec le support de démasquage, voir <https://bugs.launchpad.net/ubuntu/+source/linux/+bug/1396654> par exemple

## Exemples

Entraînez-vous à capturer vous-même des graphiques de flammes avec un [exercice de graphique de flammes](https://github.com/naugtur/node-example-flamegraph) !

