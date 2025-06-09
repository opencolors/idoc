---
title: Documentation TTY de Node.js
description: Le module TTY de Node.js fournit une interface pour interagir avec les dispositifs TTY, incluant des méthodes pour vérifier si un flux est un TTY, obtenir la taille de la fenêtre et gérer les événements du terminal.
head:
  - - meta
    - name: og:title
      content: Documentation TTY de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Le module TTY de Node.js fournit une interface pour interagir avec les dispositifs TTY, incluant des méthodes pour vérifier si un flux est un TTY, obtenir la taille de la fenêtre et gérer les événements du terminal.
  - - meta
    - name: twitter:title
      content: Documentation TTY de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Le module TTY de Node.js fournit une interface pour interagir avec les dispositifs TTY, incluant des méthodes pour vérifier si un flux est un TTY, obtenir la taille de la fenêtre et gérer les événements du terminal.
---


# TTY {#tty}

::: tip [Stable: 2 - Stable]
[Stable: 2](/fr/nodejs/api/documentation#stability-index) [Stabilité: 2](/fr/nodejs/api/documentation#stability-index) - Stable
:::

**Code source:** [lib/tty.js](https://github.com/nodejs/node/blob/v23.5.0/lib/tty.js)

Le module `node:tty` fournit les classes `tty.ReadStream` et `tty.WriteStream`. Dans la plupart des cas, il ne sera ni nécessaire ni possible d'utiliser ce module directement. Cependant, il est accessible en utilisant :

```js [ESM]
const tty = require('node:tty');
```

Lorsque Node.js détecte qu'il est exécuté avec un terminal texte ("TTY") attaché, [`process.stdin`](/fr/nodejs/api/process#processstdin) sera, par défaut, initialisé comme une instance de `tty.ReadStream` et [`process.stdout`](/fr/nodejs/api/process#processstdout) et [`process.stderr`](/fr/nodejs/api/process#processstderr) seront, par défaut, des instances de `tty.WriteStream`. La méthode préférée pour déterminer si Node.js est exécuté dans un contexte TTY est de vérifier que la valeur de la propriété `process.stdout.isTTY` est `true` :

```bash [BASH]
$ node -p -e "Boolean(process.stdout.isTTY)"
true
$ node -p -e "Boolean(process.stdout.isTTY)" | cat
false
```

Dans la plupart des cas, il ne devrait y avoir que peu ou pas de raison pour qu'une application crée manuellement des instances des classes `tty.ReadStream` et `tty.WriteStream`.

## Classe : `tty.ReadStream` {#class-ttyreadstream}

**Ajoutée dans : v0.5.8**

- Hérite de : [\<net.Socket\>](/fr/nodejs/api/net#class-netsocket)

Représente le côté lisible d'un TTY. Dans des circonstances normales, [`process.stdin`](/fr/nodejs/api/process#processstdin) sera la seule instance `tty.ReadStream` dans un processus Node.js et il ne devrait y avoir aucune raison de créer des instances supplémentaires.

### `readStream.isRaw` {#readstreamisraw}

**Ajoutée dans : v0.7.7**

Un `boolean` qui vaut `true` si le TTY est actuellement configuré pour fonctionner comme un périphérique brut.

Cet indicateur est toujours `false` lorsqu'un processus démarre, même si le terminal fonctionne en mode brut. Sa valeur changera avec les appels ultérieurs à `setRawMode`.

### `readStream.isTTY` {#readstreamistty}

**Ajoutée dans : v0.5.8**

Un `boolean` qui est toujours `true` pour les instances `tty.ReadStream`.


### `readStream.setRawMode(mode)` {#readstreamsetrawmodemode}

**Ajouté dans : v0.7.7**

- `mode` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si `true`, configure le `tty.ReadStream` pour qu'il fonctionne comme un périphérique brut. Si `false`, configure le `tty.ReadStream` pour qu'il fonctionne dans son mode par défaut. La propriété `readStream.isRaw` sera définie sur le mode résultant.
- Retourne : [\<this\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) L'instance du flux de lecture.

Permet la configuration de `tty.ReadStream` afin qu'il fonctionne comme un périphérique brut.

En mode brut, l'entrée est toujours disponible caractère par caractère, sans inclure les modificateurs. De plus, tout traitement spécial des caractères par le terminal est désactivé, y compris l'écho des caractères d'entrée. + ne provoquera plus de `SIGINT` dans ce mode.

## Classe : `tty.WriteStream` {#class-ttywritestream}

**Ajouté dans : v0.5.8**

- Hérite de : [\<net.Socket\>](/fr/nodejs/api/net#class-netsocket)

Représente le côté accessible en écriture d’un TTY. Dans des circonstances normales, [`process.stdout`](/fr/nodejs/api/process#processstdout) et [`process.stderr`](/fr/nodejs/api/process#processstderr) seront les seules instances de `tty.WriteStream` créées pour un processus Node.js et il ne devrait y avoir aucune raison de créer des instances supplémentaires.

### `new tty.ReadStream(fd[, options])` {#new-ttyreadstreamfd-options}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v0.9.4 | L'argument `options` est pris en charge. |
| v0.5.8 | Ajouté dans : v0.5.8 |
:::

- `fd` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un descripteur de fichier associé à un TTY.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Options transmises au parent `net.Socket`, voir `options` du [`constructeur net.Socket`](/fr/nodejs/api/net#new-netsocketoptions).
- Retourne [\<tty.ReadStream\>](/fr/nodejs/api/tty#class-ttyreadstream)

Crée un `ReadStream` pour `fd` associé à un TTY.

### `new tty.WriteStream(fd)` {#new-ttywritestreamfd}

**Ajouté dans : v0.5.8**

- `fd` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Un descripteur de fichier associé à un TTY.
- Retourne [\<tty.WriteStream\>](/fr/nodejs/api/tty#class-ttywritestream)

Crée un `WriteStream` pour `fd` associé à un TTY.


### Événement : `'resize'` {#event-resize}

**Ajouté dans : v0.7.7**

L'événement `'resize'` est émis chaque fois que l'une des propriétés `writeStream.columns` ou `writeStream.rows` a changé. Aucun argument n'est passé à la fonction de rappel de l'écouteur lorsqu'elle est appelée.

```js [ESM]
process.stdout.on('resize', () => {
  console.log('la taille de l\'écran a changé !');
  console.log(`${process.stdout.columns}x${process.stdout.rows}`);
});
```
### `writeStream.clearLine(dir[, callback])` {#writestreamclearlinedir-callback}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v12.7.0 | La fonction de rappel et la valeur de retour de write() du flux sont exposées. |
| v0.7.7 | Ajouté dans : v0.7.7 |
:::

- `dir` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `-1` : à gauche du curseur
    - `1` : à droite du curseur
    - `0` : toute la ligne


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Invoquée une fois l'opération terminée.
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false` si le flux souhaite que le code appelant attende que l'événement `'drain'` soit émis avant de continuer à écrire des données supplémentaires ; sinon `true`.

`writeStream.clearLine()` efface la ligne actuelle de ce `WriteStream` dans une direction identifiée par `dir`.

### `writeStream.clearScreenDown([callback])` {#writestreamclearscreendowncallback}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v12.7.0 | La fonction de rappel et la valeur de retour de write() du flux sont exposées. |
| v0.7.7 | Ajouté dans : v0.7.7 |
:::

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Invoquée une fois l'opération terminée.
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false` si le flux souhaite que le code appelant attende que l'événement `'drain'` soit émis avant de continuer à écrire des données supplémentaires ; sinon `true`.

`writeStream.clearScreenDown()` efface ce `WriteStream` du curseur actuel vers le bas.


### `writeStream.columns` {#writestreamcolumns}

**Ajouté dans : v0.7.7**

Un `number` spécifiant le nombre de colonnes que le TTY possède actuellement. Cette propriété est mise à jour chaque fois que l'événement `'resize'` est émis.

### `writeStream.cursorTo(x[, y][, callback])` {#writestreamcursortox-y-callback}


::: info [Historique]
| Version  | Modifications                                                            |
| :------- | :----------------------------------------------------------------------- |
| v12.7.0  | Le rappel et la valeur de retour de write() du stream sont exposés. |
| v0.7.7   | Ajouté dans : v0.7.7                                                    |
:::

- `x` [\<number\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Number_type)
- `y` [\<number\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Function) Invoked once the operation completes.
- Retourne : [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Boolean_type) `false` si le stream souhaite que le code appelant attende que l'événement `'drain'` soit émis avant de continuer à écrire des données supplémentaires ; sinon, `true`.

`writeStream.cursorTo()` déplace le curseur de ce `WriteStream` à la position spécifiée.

### `writeStream.getColorDepth([env])` {#writestreamgetcolordepthenv}

**Ajouté dans : v9.9.0**

- `env` [\<Object\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object) Un objet contenant les variables d'environnement à vérifier. Ceci permet de simuler l'utilisation d'un terminal spécifique. **Par défaut :** `process.env`.
- Retourne : [\<number\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Number_type)

Retourne :

- `1` pour 2,
- `4` pour 16,
- `8` pour 256,
- `24` pour 16 777 216 couleurs supportées.

Utilisez ceci pour déterminer quelles couleurs le terminal prend en charge. En raison de la nature des couleurs dans les terminaux, il est possible d'avoir des faux positifs ou des faux négatifs. Cela dépend des informations du processus et des variables d'environnement qui peuvent mentir sur le terminal utilisé. Il est possible de transmettre un objet `env` pour simuler l'utilisation d'un terminal spécifique. Cela peut être utile pour vérifier le comportement de paramètres d'environnement spécifiques.

Pour forcer une prise en charge spécifique des couleurs, utilisez l'un des paramètres d'environnement ci-dessous.

- 2 couleurs : `FORCE_COLOR = 0` (désactive les couleurs)
- 16 couleurs : `FORCE_COLOR = 1`
- 256 couleurs : `FORCE_COLOR = 2`
- 16 777 216 couleurs : `FORCE_COLOR = 3`

La désactivation de la prise en charge des couleurs est également possible en utilisant les variables d'environnement `NO_COLOR` et `NODE_DISABLE_COLORS`.


### `writeStream.getWindowSize()` {#writestreamgetwindowsize}

**Ajouté dans : v0.7.7**

- Retourne : [\<number[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

`writeStream.getWindowSize()` renvoie la taille du TTY correspondant à ce `WriteStream`. Le tableau est du type `[numColumns, numRows]` où `numColumns` et `numRows` représentent le nombre de colonnes et de lignes dans le TTY correspondant.

### `writeStream.hasColors([count][, env])` {#writestreamhascolorscount-env}

**Ajouté dans : v11.13.0, v10.16.0**

- `count` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre de couleurs demandées (minimum 2). **Par défaut :** 16.
- `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un objet contenant les variables d'environnement à vérifier. Cela permet de simuler l'utilisation d'un terminal spécifique. **Par défaut :** `process.env`.
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retourne `true` si le `writeStream` prend en charge au moins autant de couleurs que celles fournies dans `count`. La prise en charge minimale est de 2 (noir et blanc).

Cela a les mêmes faux positifs et faux négatifs que ceux décrits dans [`writeStream.getColorDepth()`](/fr/nodejs/api/tty#writestreamgetcolordepthenv).

```js [ESM]
process.stdout.hasColors();
// Retourne true ou false selon que `stdout` prend en charge au moins 16 couleurs.
process.stdout.hasColors(256);
// Retourne true ou false selon que `stdout` prend en charge au moins 256 couleurs.
process.stdout.hasColors({ TMUX: '1' });
// Retourne true.
process.stdout.hasColors(2 ** 24, { TMUX: '1' });
// Retourne false (le paramètre d'environnement prétend prendre en charge 2 ** 8 couleurs).
```
### `writeStream.isTTY` {#writestreamistty}

**Ajouté dans : v0.5.8**

Un `boolean` qui est toujours `true`.

### `writeStream.moveCursor(dx, dy[, callback])` {#writestreammovecursordx-dy-callback}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v12.7.0 | Le rappel et la valeur de retour write() du flux sont exposés. |
| v0.7.7 | Ajouté dans : v0.7.7 |
:::

- `dx` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `dy` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Invoqué une fois l'opération terminée.
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `false` si le flux souhaite que le code appelant attende que l'événement `'drain'` soit émis avant de continuer à écrire des données supplémentaires ; sinon `true`.

`writeStream.moveCursor()` déplace le curseur de ce `WriteStream` *par rapport* à sa position actuelle.


### `writeStream.rows` {#writestreamrows}

**Ajouté dans : v0.7.7**

Un `number` spécifiant le nombre de lignes que le TTY a actuellement. Cette propriété est mise à jour chaque fois que l'événement `'resize'` est émis.

## `tty.isatty(fd)` {#ttyisattyfd}

**Ajouté dans : v0.5.8**

- `fd` [\<number\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Number) Un descripteur de fichier numérique
- Retourne : [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Boolean)

La méthode `tty.isatty()` renvoie `true` si le `fd` donné est associé à un TTY et `false` s'il ne l'est pas, y compris lorsque `fd` n'est pas un entier non négatif.

