---
title: Exécuter des scripts Node.js à partir de la ligne de commande
description: Découvrez comment exécuter des programmes Node.js à partir de la ligne de commande, y compris l'utilisation de la commande node, les lignes shebang, les permissions d'exécution, la transmission de chaînes de caractères en tant qu'arguments et la réinitialisation automatique de l'application.
head:
  - - meta
    - name: og:title
      content: Exécuter des scripts Node.js à partir de la ligne de commande | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Découvrez comment exécuter des programmes Node.js à partir de la ligne de commande, y compris l'utilisation de la commande node, les lignes shebang, les permissions d'exécution, la transmission de chaînes de caractères en tant qu'arguments et la réinitialisation automatique de l'application.
  - - meta
    - name: twitter:title
      content: Exécuter des scripts Node.js à partir de la ligne de commande | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Découvrez comment exécuter des programmes Node.js à partir de la ligne de commande, y compris l'utilisation de la commande node, les lignes shebang, les permissions d'exécution, la transmission de chaînes de caractères en tant qu'arguments et la réinitialisation automatique de l'application.
---


# Exécuter des scripts Node.js depuis la ligne de commande

La manière habituelle d'exécuter un programme Node.js est d'utiliser la commande `node` disponible globalement (une fois que vous avez installé Node.js) et de passer le nom du fichier que vous souhaitez exécuter.

Si votre fichier d'application Node.js principal est `app.js`, vous pouvez l'appeler en tapant :

```bash
node app.js
```

Ci-dessus, vous demandez explicitement au shell d'exécuter votre script avec `node`. Vous pouvez également intégrer ces informations dans votre fichier JavaScript avec une ligne "shebang". Le "shebang" est la première ligne du fichier et indique au système d'exploitation quel interpréteur utiliser pour exécuter le script. Voici la première ligne de JavaScript :

```javascript
#!/usr/bin/node
```

Ci-dessus, nous donnons explicitement le chemin absolu de l'interpréteur. Tous les systèmes d'exploitation n'ont pas `node` dans le dossier `bin`, mais tous devraient avoir `env`. Vous pouvez demander au système d'exploitation d'exécuter `env` avec `node` comme paramètre :

```javascript
#!/usr/bin/env node
// votre code javascript
```

## Pour utiliser un shebang, votre fichier doit avoir l'autorisation d'exécution.

Vous pouvez donner à `app.js` l'autorisation d'exécution en exécutant :

```bash
chmod u+x app.js
```

Lors de l'exécution de la commande, assurez-vous d'être dans le même répertoire qui contient le fichier `app.js`.

## Passer une chaîne de caractères comme argument à node au lieu du chemin d'accès au fichier

Pour exécuter une chaîne de caractères comme argument, vous pouvez utiliser `-e`, `--eval "script"`. Évaluez l'argument suivant comme JavaScript. Les modules qui sont prédéfinis dans le REPL peuvent également être utilisés dans le script. Sous Windows, en utilisant `cmd.exe`, un guillemet simple ne fonctionnera pas correctement car il ne reconnaît que les guillemets doubles `"` pour la citation. Dans Powershell ou Git bash, les deux `"` et `'` sont utilisables.

```bash
node -e "console.log(123)"
```

## Redémarrer l'application automatiquement

À partir de nodejs V 16, il existe une option intégrée pour redémarrer automatiquement l'application lorsqu'un fichier change. Ceci est utile à des fins de développement. Pour utiliser cette fonctionnalité, vous devez passer l'indicateur `watch` à nodejs.

```bash
node --watch app.js
```

Ainsi, lorsque vous modifiez le fichier, l'application redémarre automatiquement. Lisez la documentation de l'indicateur --watch [/api/cli#watch](/fr/nodejs/api/cli#watch).

