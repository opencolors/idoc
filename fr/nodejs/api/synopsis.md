---
title: Documentation Node.js - Synopsis
description: Un aperçu de Node.js, détaillant son architecture asynchrone basée sur les événements, les modules de base et comment commencer le développement avec Node.js.
head:
  - - meta
    - name: og:title
      content: Documentation Node.js - Synopsis | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Un aperçu de Node.js, détaillant son architecture asynchrone basée sur les événements, les modules de base et comment commencer le développement avec Node.js.
  - - meta
    - name: twitter:title
      content: Documentation Node.js - Synopsis | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Un aperçu de Node.js, détaillant son architecture asynchrone basée sur les événements, les modules de base et comment commencer le développement avec Node.js.
---


# Utilisation et exemple {#usage-and-example}

## Utilisation {#usage}

`node [options] [options V8] [script.js | -e "script" | - ] [arguments]`

Veuillez consulter le document [Options de ligne de commande](/fr/nodejs/api/cli#options) pour plus d'informations.

## Exemple {#example}

Un exemple de [serveur web](/fr/nodejs/api/http) écrit avec Node.js qui répond avec `'Hello, World !'` :

Les commandes dans ce document commencent par `$` ou `\>` pour reproduire la façon dont elles apparaîtraient dans le terminal d'un utilisateur. N'incluez pas les caractères `$` et `\>`. Ils sont là pour indiquer le début de chaque commande.

Les lignes qui ne commencent pas par le caractère `$` ou `\>` montrent la sortie de la commande précédente.

Tout d'abord, assurez-vous d'avoir téléchargé et installé Node.js. Consultez [Installation de Node.js via un gestionnaire de paquets](https://nodejs.org/en/download/package-manager/) pour plus d'informations sur l'installation.

Maintenant, créez un dossier de projet vide appelé `projects`, puis naviguez dedans.

Linux et Mac :

```bash [BASH]
mkdir ~/projects
cd ~/projects
```
Windows CMD :

```bash [BASH]
mkdir %USERPROFILE%\projects
cd %USERPROFILE%\projects
```
Windows PowerShell :

```bash [BASH]
mkdir $env:USERPROFILE\projects
cd $env:USERPROFILE\projects
```
Ensuite, créez un nouveau fichier source dans le dossier `projects` et appelez-le `hello-world.js`.

Ouvrez `hello-world.js` dans n'importe quel éditeur de texte préféré et collez le contenu suivant :

```js [ESM]
const http = require('node:http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World!\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```
Enregistrez le fichier. Ensuite, dans la fenêtre du terminal, pour exécuter le fichier `hello-world.js`, entrez :

```bash [BASH]
node hello-world.js
```
Une sortie comme celle-ci devrait apparaître dans le terminal :

```bash [BASH]
Server running at http://127.0.0.1:3000/
```
Maintenant, ouvrez n'importe quel navigateur Web préféré et visitez `http://127.0.0.1:3000`.

Si le navigateur affiche la chaîne `Hello, World !`, cela indique que le serveur fonctionne.

