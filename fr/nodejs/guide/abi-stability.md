---
title: Stabilité ABI dans Node.js et N-API
description: Node.js fournit une ABI stable pour les modules complémentaires natifs via N-API, garantissant la compatibilité entre plusieurs versions majeures et réduisant les charges de maintenance des systèmes de production.
head:
  - - meta
    - name: og:title
      content: Stabilité ABI dans Node.js et N-API | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js fournit une ABI stable pour les modules complémentaires natifs via N-API, garantissant la compatibilité entre plusieurs versions majeures et réduisant les charges de maintenance des systèmes de production.
  - - meta
    - name: twitter:title
      content: Stabilité ABI dans Node.js et N-API | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js fournit une ABI stable pour les modules complémentaires natifs via N-API, garantissant la compatibilité entre plusieurs versions majeures et réduisant les charges de maintenance des systèmes de production.
---


# Stabilité ABI

## Introduction

Une Interface Binaire d'Application (ABI) est une façon pour les programmes d'appeler des fonctions et d'utiliser des structures de données à partir d'autres programmes compilés. C'est la version compilée d'une Interface de Programmation d'Application (API). En d'autres termes, les fichiers d'en-tête décrivant les classes, les fonctions, les structures de données, les énumérations et les constantes qui permettent à une application d'effectuer une tâche souhaitée correspondent, par le biais de la compilation, à un ensemble d'adresses et de valeurs de paramètres attendues, ainsi qu'à des tailles et des dispositions de structures de mémoire avec lesquelles le fournisseur de l'ABI a été compilé.

L'application utilisant l'ABI doit être compilée de telle sorte que les adresses disponibles, les valeurs de paramètres attendues et les tailles et dispositions des structures de mémoire concordent avec celles avec lesquelles le fournisseur de l'ABI a été compilé. Ceci est généralement accompli en compilant par rapport aux en-têtes fournis par le fournisseur de l'ABI.

Étant donné que le fournisseur de l'ABI et l'utilisateur de l'ABI peuvent être compilés à des moments différents avec des versions différentes du compilateur, une partie de la responsabilité d'assurer la compatibilité ABI incombe au compilateur. Différentes versions du compilateur, peut-être fournies par différents fournisseurs, doivent toutes produire la même ABI à partir d'un fichier d'en-tête avec un certain contenu, et doivent produire du code pour l'application utilisant l'ABI qui accède à l'API décrite dans un en-tête donné conformément aux conventions de l'ABI résultant de la description dans l'en-tête. Les compilateurs modernes ont un bilan assez bon en matière de non-rupture de la compatibilité ABI des applications qu'ils compilent.

La responsabilité restante d'assurer la compatibilité ABI incombe à l'équipe maintenant les fichiers d'en-tête qui fournissent l'API qui résulte, après compilation, en l'ABI qui doit rester stable. Des modifications peuvent être apportées aux fichiers d'en-tête, mais la nature des modifications doit être étroitement suivie pour garantir que, après compilation, l'ABI ne change pas d'une manière qui rendrait les utilisateurs existants de l'ABI incompatibles avec la nouvelle version.


## Stabilité ABI dans Node.js

Node.js fournit des fichiers d'en-tête maintenus par plusieurs équipes indépendantes. Par exemple, les fichiers d'en-tête tels que `node.h` et `node_buffer.h` sont maintenus par l'équipe Node.js. `v8.h` est maintenu par l'équipe V8 qui, bien qu'en étroite collaboration avec l'équipe Node.js, est indépendante et a son propre calendrier et ses propres priorités. Ainsi, l'équipe Node.js n'a qu'un contrôle partiel sur les modifications introduites dans les en-têtes que le projet fournit. Par conséquent, le projet Node.js a adopté le [versionnage sémantique](https://semver.org). Cela garantit que les API fournies par le projet se traduiront par une ABI stable pour toutes les versions mineures et correctives de Node.js publiées dans une version majeure. En pratique, cela signifie que le projet Node.js s'est engagé à garantir qu'un addon natif Node.js compilé pour une version majeure donnée de Node.js se chargera avec succès lorsqu'il sera chargé par une version mineure ou corrective de Node.js au sein de la version majeure pour laquelle il a été compilé.

## N-API

Une demande s'est fait sentir pour doter Node.js d'une API qui se traduit par une ABI qui reste stable sur plusieurs versions majeures de Node.js. La motivation pour créer une telle API est la suivante :

- Le langage JavaScript est resté compatible avec lui-même depuis ses débuts, alors que l'ABI du moteur exécutant le code JavaScript change à chaque version majeure de Node.js. Cela signifie que les applications constituées de packages Node.js entièrement écrits en JavaScript n'ont pas besoin d'être recompilées, réinstallées ou redéployées lorsqu'une nouvelle version majeure de Node.js est déployée dans l'environnement de production dans lequel ces applications s'exécutent. En revanche, si une application dépend d'un package contenant un addon natif, l'application doit être recompilée, réinstallée et redéployée chaque fois qu'une nouvelle version majeure de Node.js est introduite dans l'environnement de production. Cette disparité entre les packages Node.js contenant des addons natifs et ceux qui sont écrits entièrement en JavaScript a alourdi la charge de maintenance des systèmes de production qui dépendent des addons natifs.

- D'autres projets ont commencé à produire des interfaces JavaScript qui sont essentiellement des implémentations alternatives de Node.js. Étant donné que ces projets sont généralement construits sur un moteur JavaScript différent de V8, leurs addons natifs adoptent nécessairement une structure différente et utilisent une API différente. Néanmoins, l'utilisation d'une seule API pour un addon natif sur différentes implémentations de l'API JavaScript de Node.js permettrait à ces projets de profiter de l'écosystème de packages JavaScript qui s'est constitué autour de Node.js.

- Node.js peut contenir un moteur JavaScript différent à l'avenir. Cela signifie qu'en externe, toutes les interfaces Node.js resteraient les mêmes, mais le fichier d'en-tête V8 serait absent. Une telle étape perturberait l'écosystème Node.js en général, et celui des addons natifs en particulier, si une API agnostique au moteur JavaScript n'est pas d'abord fournie par Node.js et adoptée par les addons natifs.

À ces fins, Node.js a introduit N-API dans la version 8.6.0 et l'a marquée comme un composant stable du projet à partir de Node.js 8.12.0. L'API est définie dans les en-têtes `node_api.h` et `node_api_types.h` et fournit une garantie de compatibilité ascendante qui dépasse la limite de la version majeure de Node.js. La garantie peut être énoncée comme suit :

**Une version n donnée de N-API sera disponible dans la version majeure de Node.js dans laquelle elle a été publiée, et dans toutes les versions ultérieures de Node.js, y compris les versions majeures ultérieures.**

Un auteur d'addon natif peut profiter de la garantie de compatibilité ascendante de N-API en s'assurant que l'addon utilise uniquement les API définies dans `node_api.h` et les structures de données et les constantes définies dans `node_api_types.h`. Ce faisant, l'auteur facilite l'adoption de son addon en indiquant aux utilisateurs de production que la charge de maintenance de leur application n'augmentera pas plus avec l'ajout de l'addon natif à leur projet qu'elle ne le ferait avec l'ajout d'un package écrit uniquement en JavaScript.

N-API est versionnée car de nouvelles API sont ajoutées de temps en temps. Contrairement au versionnage sémantique, le versionnage N-API est cumulatif. C'est-à-dire que chaque version de N-API véhicule la même signification qu'une version mineure dans le système semver, ce qui signifie que toutes les modifications apportées à N-API seront rétrocompatibles. De plus, de nouvelles N-API sont ajoutées sous un drapeau expérimental pour donner à la communauté la possibilité de les vérifier dans un environnement de production. Le statut expérimental signifie que, bien que des précautions aient été prises pour garantir que la nouvelle API n'aura pas à être modifiée d'une manière incompatible avec l'ABI à l'avenir, elle n'a pas encore été suffisamment éprouvée en production pour être correcte et utile telle que conçue et, en tant que telle, peut subir des modifications incompatibles avec l'ABI avant d'être finalement intégrée à une prochaine version de N-API. C'est-à-dire qu'une N-API expérimentale n'est pas encore couverte par la garantie de compatibilité ascendante.

