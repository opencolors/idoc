---
title: Guide du débogueur Node.js
description: Un guide complet sur l'utilisation du débogueur intégré dans Node.js, détaillant les commandes, l'utilisation et les techniques de débogage.
head:
  - - meta
    - name: og:title
      content: Guide du débogueur Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Un guide complet sur l'utilisation du débogueur intégré dans Node.js, détaillant les commandes, l'utilisation et les techniques de débogage.
  - - meta
    - name: twitter:title
      content: Guide du débogueur Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Un guide complet sur l'utilisation du débogueur intégré dans Node.js, détaillant les commandes, l'utilisation et les techniques de débogage.
---


# Débogueur {#debugger}

::: tip [Stable: 2 - Stable]
[Stable: 2](/fr/nodejs/api/documentation#stability-index) [Stability: 2](/fr/nodejs/api/documentation#stability-index) - Stable
:::

Node.js inclut un utilitaire de débogage en ligne de commande. Le client de débogage Node.js n'est pas un débogueur complet, mais il est possible d'effectuer un pas-à-pas simple et une inspection.

Pour l'utiliser, démarrez Node.js avec l'argument `inspect` suivi du chemin d'accès au script à déboguer.

```bash [BASH]
$ node inspect myscript.js
< Debugger listening on ws://127.0.0.1:9229/621111f9-ffcb-4e82-b718-48a145fa5db8
< For help, see: https://nodejs.org/en/docs/inspector
<
connecting to 127.0.0.1:9229 ... ok
< Debugger attached.
<
 ok
Break on start in myscript.js:2
  1 // myscript.js
> 2 global.x = 5;
  3 setTimeout(() => {
  4   debugger;
debug>
```

Le débogueur s'arrête automatiquement à la première ligne exécutable. Pour exécuter plutôt jusqu'au premier point d'arrêt (spécifié par une instruction [`debugger`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/debugger)), définissez la variable d'environnement `NODE_INSPECT_RESUME_ON_START` sur `1`.

```bash [BASH]
$ cat myscript.js
// myscript.js
global.x = 5;
setTimeout(() => {
  debugger;
  console.log('world');
}, 1000);
console.log('hello');
$ NODE_INSPECT_RESUME_ON_START=1 node inspect myscript.js
< Debugger listening on ws://127.0.0.1:9229/f1ed133e-7876-495b-83ae-c32c6fc319c2
< For help, see: https://nodejs.org/en/docs/inspector
<
connecting to 127.0.0.1:9229 ... ok
< Debugger attached.
<
< hello
<
break in myscript.js:4
  2 global.x = 5;
  3 setTimeout(() => {
> 4   debugger;
  5   console.log('world');
  6 }, 1000);
debug> next
break in myscript.js:5
  3 setTimeout(() => {
  4   debugger;
> 5   console.log('world');
  6 }, 1000);
  7 console.log('hello');
debug> repl
Press Ctrl+C to leave debug repl
> x
5
> 2 + 2
4
debug> next
< world
<
break in myscript.js:6
  4   debugger;
  5   console.log('world');
> 6 }, 1000);
  7 console.log('hello');
  8
debug> .exit
$
```

La commande `repl` permet d'évaluer le code à distance. La commande `next` passe à la ligne suivante. Tapez `help` pour voir quelles autres commandes sont disponibles.

Appuyer sur `Entrée` sans taper de commande répètera la commande précédente du débogueur.


## Observateurs {#watchers}

Il est possible d'observer les valeurs des expressions et des variables pendant le débogage. À chaque point d'arrêt, chaque expression de la liste des observateurs sera évaluée dans le contexte actuel et affichée immédiatement avant la liste du code source du point d'arrêt.

Pour commencer à observer une expression, tapez `watch('mon_expression')`. La commande `watchers` affichera les observateurs actifs. Pour supprimer un observateur, tapez `unwatch('mon_expression')`.

## Référence des commandes {#command-reference}

### Pas à pas {#stepping}

- `cont`, `c` : Continuer l'exécution
- `next`, `n` : Pas suivant
- `step`, `s` : Entrer
- `out`, `o` : Sortir
- `pause` : Mettre le code en pause (comme le bouton pause dans les outils de développement)

### Points d'arrêt {#breakpoints}

- `setBreakpoint()`, `sb()` : Définir un point d'arrêt sur la ligne actuelle
- `setBreakpoint(line)`, `sb(line)` : Définir un point d'arrêt sur une ligne spécifique
- `setBreakpoint('fn()')`, `sb(...)` : Définir un point d'arrêt sur la première instruction dans le corps de la fonction
- `setBreakpoint('script.js', 1)`, `sb(...)` : Définir un point d'arrêt sur la première ligne de `script.js`
- `setBreakpoint('script.js', 1, 'num \< 4')`, `sb(...)` : Définir un point d'arrêt conditionnel sur la première ligne de `script.js` qui ne s'arrête que lorsque `num \< 4` est évalué à `true`
- `clearBreakpoint('script.js', 1)`, `cb(...)` : Supprimer le point d'arrêt dans `script.js` à la ligne 1

Il est également possible de définir un point d'arrêt dans un fichier (module) qui n'est pas encore chargé :

```bash [BASH]
$ node inspect main.js
< Debugger listening on ws://127.0.0.1:9229/48a5b28a-550c-471b-b5e1-d13dd7165df9
< For help, see: https://nodejs.org/en/docs/inspector
<
connecting to 127.0.0.1:9229 ... ok
< Debugger attached.
<
Break on start in main.js:1
> 1 const mod = require('./mod.js');
  2 mod.hello();
  3 mod.hello();
debug> setBreakpoint('mod.js', 22)
Warning: script 'mod.js' was not loaded yet.
debug> c
break in mod.js:22
 20 // USE OR OTHER DEALINGS IN THE SOFTWARE.
 21
>22 exports.hello = function() {
 23   return 'hello from module';
 24 };
debug>
```
Il est également possible de définir un point d'arrêt conditionnel qui ne s'arrête que lorsqu'une expression donnée est évaluée à `true` :

```bash [BASH]
$ node inspect main.js
< Debugger listening on ws://127.0.0.1:9229/ce24daa8-3816-44d4-b8ab-8273c8a66d35
< For help, see: https://nodejs.org/en/docs/inspector
<
connecting to 127.0.0.1:9229 ... ok
< Debugger attached.
Break on start in main.js:7
  5 }
  6
> 7 addOne(10);
  8 addOne(-1);
  9
debug> setBreakpoint('main.js', 4, 'num < 0')
  1 'use strict';
  2
  3 function addOne(num) {
> 4   return num + 1;
  5 }
  6
  7 addOne(10);
  8 addOne(-1);
  9
debug> cont
break in main.js:4
  2
  3 function addOne(num) {
> 4   return num + 1;
  5 }
  6
debug> exec('num')
-1
debug>
```

### Information {#information}

- `backtrace`, `bt` : Afficher le backtrace de la frame d'exécution courante
- `list(5)` : Afficher le code source du script avec un contexte de 5 lignes (5 lignes avant et après)
- `watch(expr)` : Ajouter une expression à la liste de surveillance
- `unwatch(expr)` : Retirer une expression de la liste de surveillance
- `unwatch(index)` : Retirer une expression à un index spécifique de la liste de surveillance
- `watchers` : Afficher tous les surveillants et leurs valeurs (automatiquement affichés à chaque point d'arrêt)
- `repl` : Ouvrir le repl du débogueur pour l'évaluation dans le contexte du script de débogage
- `exec expr`, `p expr` : Exécuter une expression dans le contexte du script de débogage et afficher sa valeur
- `profile` : Démarrer une session de profilage du CPU
- `profileEnd` : Arrêter la session de profilage CPU courante
- `profiles` : Afficher toutes les sessions de profilage CPU terminées
- `profiles[n].save(filepath = 'node.cpuprofile')` : Sauvegarder la session de profilage CPU sur le disque en tant que JSON
- `takeHeapSnapshot(filepath = 'node.heapsnapshot')` : Prendre un instantané de la mémoire et sauvegarder sur le disque en tant que JSON

### Contrôle de l'exécution {#execution-control}

- `run` : Exécuter le script (s'exécute automatiquement au démarrage du débogueur)
- `restart` : Redémarrer le script
- `kill` : Tuer le script

### Divers {#various}

- `scripts` : Afficher tous les scripts chargés
- `version` : Afficher la version de V8

## Utilisation avancée {#advanced-usage}

### Intégration de V8 Inspector pour Node.js {#v8-inspector-integration-for-nodejs}

L'intégration de V8 Inspector permet d'attacher les Chrome DevTools aux instances Node.js pour le débogage et le profilage. Il utilise le [Protocole Chrome DevTools](https://chromedevtools.github.io/devtools-protocol/).

V8 Inspector peut être activé en passant l'indicateur `--inspect` lors du démarrage d'une application Node.js. Il est également possible de fournir un port personnalisé avec cet indicateur, par exemple `--inspect=9222` acceptera les connexions DevTools sur le port 9222.

L'utilisation de l'indicateur `--inspect` exécutera le code immédiatement avant que le débogueur ne soit connecté. Cela signifie que le code commencera à s'exécuter avant que vous ne puissiez commencer à déboguer, ce qui pourrait ne pas être idéal si vous voulez déboguer depuis le tout début.

Dans de tels cas, vous avez deux alternatives :

Ainsi, lorsque vous choisissez entre `--inspect`, `--inspect-wait` et `--inspect-brk`, déterminez si vous voulez que le code commence à s'exécuter immédiatement, attende que le débogueur soit attaché avant l'exécution, ou s'arrête à la première ligne pour un débogage pas à pas.

```bash [BASH]
$ node --inspect index.js
Debugger listening on ws://127.0.0.1:9229/dc9010dd-f8b8-4ac5-a510-c1a114ec7d29
For help, see: https://nodejs.org/en/docs/inspector
```
(Dans l'exemple ci-dessus, l'UUID dc9010dd-f8b8-4ac5-a510-c1a114ec7d29 à la fin de l'URL est généré à la volée, il varie selon les sessions de débogage.)

Si le navigateur Chrome est plus ancien que la version 66.0.3345.0, utilisez `inspector.html` au lieu de `js_app.html` dans l'URL ci-dessus.

Chrome DevTools ne prend pas encore en charge le débogage des [threads de travail](/fr/nodejs/api/worker_threads). [ndb](https://github.com/GoogleChromeLabs/ndb/) peut être utilisé pour les déboguer.

