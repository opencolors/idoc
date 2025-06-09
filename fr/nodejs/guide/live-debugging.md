---
title: Débogage en direct sous Node.js
description: Découvrez comment déboguer en direct un processus Node.js pour identifier et résoudre les problèmes liés à la logique et à la correction de l'application.
head:
  - - meta
    - name: og:title
      content: Débogage en direct sous Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Découvrez comment déboguer en direct un processus Node.js pour identifier et résoudre les problèmes liés à la logique et à la correction de l'application.
  - - meta
    - name: twitter:title
      content: Débogage en direct sous Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Découvrez comment déboguer en direct un processus Node.js pour identifier et résoudre les problèmes liés à la logique et à la correction de l'application.
---


# Débogage en direct

Dans ce document, vous pouvez découvrir comment déboguer en direct un processus Node.js.

## Mon application ne se comporte pas comme prévu

### Symptômes

L'utilisateur peut observer que l'application ne fournit pas la sortie attendue pour certaines entrées, par exemple, un serveur HTTP renvoie une réponse JSON où certains champs sont vides. Diverses choses peuvent mal tourner dans le processus, mais dans ce cas d'utilisation, nous nous concentrons principalement sur la logique de l'application et son exactitude.

### Débogage

Dans ce cas d'utilisation, l'utilisateur souhaite comprendre le chemin de code que notre application exécute pour un certain déclencheur, comme une requête HTTP entrante. Il peut également vouloir parcourir le code pas à pas et contrôler l'exécution, ainsi qu'inspecter les valeurs que les variables contiennent en mémoire. À cette fin, nous pouvons utiliser l'indicateur `--inspect` lors du démarrage de l'application. La documentation sur le débogage se trouve [ici](/fr/nodejs/guide/debugging-nodejs).

