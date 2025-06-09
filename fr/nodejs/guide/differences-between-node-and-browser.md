---
title: Différences entre Node.js et le navigateur
description: Découvrez les principales différences entre la création d'applications sous Node.js et le navigateur, notamment en termes d'écosystème, de contrôle de l'environnement et de systèmes de modules.
head:
  - - meta
    - name: og:title
      content: Différences entre Node.js et le navigateur | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Découvrez les principales différences entre la création d'applications sous Node.js et le navigateur, notamment en termes d'écosystème, de contrôle de l'environnement et de systèmes de modules.
  - - meta
    - name: twitter:title
      content: Différences entre Node.js et le navigateur | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Découvrez les principales différences entre la création d'applications sous Node.js et le navigateur, notamment en termes d'écosystème, de contrôle de l'environnement et de systèmes de modules.
---


# Différences entre Node.js et le navigateur

Le navigateur et Node.js utilisent JavaScript comme langage de programmation. La création d'applications exécutées dans le navigateur est complètement différente de la création d'une application Node.js. Bien qu'il s'agisse toujours de JavaScript, certaines différences clés rendent l'expérience radicalement différente.

Du point de vue d'un développeur frontend qui utilise intensivement JavaScript, les applications Node.js présentent un énorme avantage : le confort de programmer tout - le frontend et le backend - dans un seul langage.

Vous avez une énorme opportunité car nous savons combien il est difficile d'apprendre pleinement et profondément un langage de programmation, et en utilisant le même langage pour effectuer tout votre travail sur le web - à la fois sur le client et sur le serveur, vous êtes dans une position d'avantage unique.

::: tip
Ce qui change, c'est l'écosystème.
:::

Dans le navigateur, la plupart du temps, vous interagissez avec le DOM ou d'autres API de la plateforme Web comme les Cookies. Ceux-ci n'existent pas dans Node.js, bien sûr. Vous n'avez pas le `document`, `window` et tous les autres objets fournis par le navigateur.

Et dans le navigateur, nous n'avons pas toutes les API intéressantes que Node.js fournit via ses modules, comme la fonctionnalité d'accès au système de fichiers.

Une autre grande différence est que dans Node.js, vous contrôlez l'environnement. À moins que vous ne construisiez une application open source que n'importe qui peut déployer n'importe où, vous savez sur quelle version de Node.js vous exécuterez l'application. Comparé à l'environnement du navigateur, où vous n'avez pas le luxe de choisir le navigateur que vos visiteurs utiliseront, c'est très pratique.

Cela signifie que vous pouvez écrire tout le JavaScript moderne ES2015+ pris en charge par votre version de Node.js. Étant donné que JavaScript évolue si rapidement, mais que les navigateurs peuvent être un peu lents à se mettre à niveau, parfois sur le web, vous êtes bloqué avec l'utilisation d'anciennes versions de JavaScript / ECMAScript. Vous pouvez utiliser Babel pour transformer votre code afin qu'il soit compatible ES5 avant de l'envoyer au navigateur, mais dans Node.js, vous n'en aurez pas besoin.

Une autre différence est que Node.js prend en charge les systèmes de modules CommonJS et ES (depuis Node.js v12), alors que dans le navigateur, nous commençons à voir la norme ES Modules être implémentée.

En pratique, cela signifie que vous pouvez utiliser `require()` et `import` dans Node.js, alors que vous êtes limité à `import` dans le navigateur.

