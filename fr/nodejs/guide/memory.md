---
title: Débogage des problèmes de mémoire dans Node.js
description: Découvrez comment identifier et déboguer les problèmes de mémoire liés aux applications Node.js, notamment les fuites de mémoire et l'utilisation inefficace de la mémoire.
head:
  - - meta
    - name: og:title
      content: Débogage des problèmes de mémoire dans Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Découvrez comment identifier et déboguer les problèmes de mémoire liés aux applications Node.js, notamment les fuites de mémoire et l'utilisation inefficace de la mémoire.
  - - meta
    - name: twitter:title
      content: Débogage des problèmes de mémoire dans Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Découvrez comment identifier et déboguer les problèmes de mémoire liés aux applications Node.js, notamment les fuites de mémoire et l'utilisation inefficace de la mémoire.
---


# Mémoire

Dans ce document, vous pouvez apprendre à déboguer les problèmes liés à la mémoire.

## Mon processus manque de mémoire

Node.js (*JavaScript*) est un langage à ramasse-miettes, il est donc possible d'avoir des fuites de mémoire par le biais de rétenteurs. Étant donné que les applications Node.js sont généralement multi-locataires, critiques pour l'entreprise et à longue durée de fonctionnement, il est essentiel de fournir un moyen accessible et efficace de trouver une fuite de mémoire.

### Symptômes

L'utilisateur observe une utilisation de la mémoire qui augmente continuellement (*peut être rapide ou lente, sur des jours voire des semaines*), puis voit le processus planter et redémarrer par le gestionnaire de processus. Le processus est peut-être plus lent qu'avant et les redémarrages entraînent l'échec de certaines requêtes (*l'équilibreur de charge répond avec 502*).

### Effets secondaires

- Redémarrages du processus en raison de l'épuisement de la mémoire et les requêtes sont perdues
- Une activité GC accrue entraîne une utilisation du CPU plus élevée et un temps de réponse plus lent
    - GC bloquant la boucle d'événements, ce qui provoque des ralentissements
- L'augmentation de la permutation de la mémoire ralentit le processus (activité GC)
- Peut ne pas avoir suffisamment de mémoire disponible pour obtenir un instantané de tas

## Mon processus utilise la mémoire de manière inefficace

### Symptômes

L'application utilise une quantité de mémoire inattendue et/ou nous observons une activité élevée du ramasse-miettes.

### Effets secondaires

- Un nombre élevé de défauts de page
- Une activité GC et une utilisation du CPU plus élevées

