---
title: Optimisation des performances Node.js
description: Découvrez comment profiler un processus Node.js pour identifier les goulots d'étranglement de performances et optimiser le code pour une meilleure efficacité et une meilleure expérience utilisateur.
head:
  - - meta
    - name: og:title
      content: Optimisation des performances Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Découvrez comment profiler un processus Node.js pour identifier les goulots d'étranglement de performances et optimiser le code pour une meilleure efficacité et une meilleure expérience utilisateur.
  - - meta
    - name: twitter:title
      content: Optimisation des performances Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Découvrez comment profiler un processus Node.js pour identifier les goulots d'étranglement de performances et optimiser le code pour une meilleure efficacité et une meilleure expérience utilisateur.
---


# Performances médiocres
Dans ce document, vous apprendrez comment profiler un processus Node.js.

## Mon application a de mauvaises performances

### Symptômes

La latence de mon application est élevée et j'ai déjà confirmé que le goulot d'étranglement ne provient pas de mes dépendances telles que les bases de données et les services en aval. Je soupçonne donc que mon application passe un temps considérable à exécuter du code ou à traiter des informations.

Vous êtes généralement satisfait des performances de votre application, mais vous aimeriez comprendre quelle partie de notre application peut être améliorée pour fonctionner plus rapidement ou plus efficacement. Cela peut être utile lorsque nous souhaitons améliorer l'expérience utilisateur ou réduire les coûts de calcul.

### Débogage
Dans ce cas d'utilisation, nous sommes intéressés par les morceaux de code qui utilisent plus de cycles CPU que les autres. Lorsque nous faisons cela localement, nous essayons généralement d'optimiser notre code. [L'utilisation du profileur d'échantillonnage V8](/fr/nodejs/guide/profiling-nodejs-applications) peut nous aider à le faire.

