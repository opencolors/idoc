---
title: Le moteur JavaScript V8
description: V8 est le moteur JavaScript qui alimente Google Chrome, exécutant le code JavaScript et fournissant un environnement d'exécution. Il est indépendant du navigateur et a permis l'émergence de Node.js, alimentant le code côté serveur et les applications de bureau.
head:
  - - meta
    - name: og:title
      content: Le moteur JavaScript V8 | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: V8 est le moteur JavaScript qui alimente Google Chrome, exécutant le code JavaScript et fournissant un environnement d'exécution. Il est indépendant du navigateur et a permis l'émergence de Node.js, alimentant le code côté serveur et les applications de bureau.
  - - meta
    - name: twitter:title
      content: Le moteur JavaScript V8 | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: V8 est le moteur JavaScript qui alimente Google Chrome, exécutant le code JavaScript et fournissant un environnement d'exécution. Il est indépendant du navigateur et a permis l'émergence de Node.js, alimentant le code côté serveur et les applications de bureau.
---


# Le moteur JavaScript V8

V8 est le nom du moteur JavaScript qui alimente Google Chrome. C'est ce qui prend notre JavaScript et l'exécute lorsque nous naviguons avec Chrome.

V8 est le moteur JavaScript, c'est-à-dire qu'il analyse et exécute le code JavaScript. Le DOM et les autres API de la plate-forme Web (qui constituent tous l'environnement d'exécution) sont fournis par le navigateur.

Ce qui est intéressant, c'est que le moteur JavaScript est indépendant du navigateur dans lequel il est hébergé. Cette caractéristique essentielle a permis l'essor de Node.js. V8 a été choisi comme moteur pour alimenter Node.js en 2009, et avec l'explosion de la popularité de Node.js, V8 est devenu le moteur qui alimente désormais une quantité incroyable de code côté serveur écrit en JavaScript.

L'écosystème Node.js est énorme et grâce à V8, il alimente également les applications de bureau, avec des projets comme Electron.

## Autres moteurs JS

Les autres navigateurs ont leur propre moteur JavaScript :

+ `SpiderMonkey` (Firefox)
+ `JavaScriptCore` (également appelé `Nitro`) (Safari)
+ Edge était à l'origine basé sur `Chakra`, mais a été plus récemment reconstruit à l'aide de Chromium et du moteur V8.

et il en existe beaucoup d'autres.

Tous ces moteurs mettent en œuvre la [norme ECMA ES-262](https://www.ecma-international.org/publications-and-standards/standards/ecma-262/), également appelée ECMAScript, la norme utilisée par JavaScript.

## La quête de la performance

V8 est écrit en C++ et est continuellement amélioré. Il est portable et fonctionne sur Mac, Windows, Linux et plusieurs autres systèmes.

Dans cette introduction à V8, nous ignorerons les détails de l'implémentation de V8 : ils peuvent être trouvés sur des sites plus officiels (par exemple, le [site officiel de V8](https://v8.dev/)), et ils changent au fil du temps, souvent radicalement.

V8 est en constante évolution, tout comme les autres moteurs JavaScript, pour accélérer le Web et l'écosystème Node.js.

Sur le Web, il y a une course à la performance qui dure depuis des années, et nous (en tant qu'utilisateurs et développeurs) bénéficions beaucoup de cette concurrence car nous obtenons des machines plus rapides et plus optimisées année après année.


## Compilation

JavaScript est généralement considéré comme un langage interprété, mais les moteurs JavaScript modernes ne se contentent plus d'interpréter JavaScript, ils le compilent.

Cela se produit depuis 2009, lorsque le compilateur JavaScript SpiderMonkey a été ajouté à Firefox 3.5, et tout le monde a suivi cette idée.

JavaScript est compilé en interne par V8 avec une compilation à la volée (JIT) pour accélérer l'exécution.

Cela peut sembler contre-intuitif, mais depuis l'introduction de Google Maps en 2004, JavaScript est passé d'un langage qui exécutait généralement quelques dizaines de lignes de code à des applications complètes avec des milliers, voire des centaines de milliers de lignes exécutées dans le navigateur.

Nos applications peuvent désormais fonctionner pendant des heures dans un navigateur, au lieu de se limiter à quelques règles de validation de formulaires ou à des scripts simples.

Dans ce nouveau monde, compiler JavaScript est tout à fait logique car, même si la préparation de JavaScript peut prendre un peu plus de temps, une fois cela fait, il sera beaucoup plus performant qu'un code purement interprété.

