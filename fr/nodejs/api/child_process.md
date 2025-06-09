---
title: Documentation Node.js - Processus Enfant
description: La documentation de Node.js pour le module Processus Enfant, expliquant comment lancer des processus enfants, gérer leur cycle de vie et gérer la communication inter-processus.
head:
  - - meta
    - name: og:title
      content: Documentation Node.js - Processus Enfant | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: La documentation de Node.js pour le module Processus Enfant, expliquant comment lancer des processus enfants, gérer leur cycle de vie et gérer la communication inter-processus.
  - - meta
    - name: twitter:title
      content: Documentation Node.js - Processus Enfant | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: La documentation de Node.js pour le module Processus Enfant, expliquant comment lancer des processus enfants, gérer leur cycle de vie et gérer la communication inter-processus.
---


# Processus enfant {#child-process}

::: tip [Stable: 2 - Stable]
[Stable: 2](/fr/nodejs/api/documentation#stability-index) [Stabilité: 2](/fr/nodejs/api/documentation#stability-index) - Stable
:::

**Code source :** [lib/child_process.js](https://github.com/nodejs/node/blob/v23.5.0/lib/child_process.js)

Le module `node:child_process` permet de créer des sous-processus d'une manière similaire, mais pas identique, à [`popen(3)`](http://man7.org/linux/man-pages/man3/popen.3). Cette capacité est principalement fournie par la fonction [`child_process.spawn()`](/fr/nodejs/api/child_process#child_processspawncommand-args-options) :

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout : ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr : ${data}`);
});

ls.on('close', (code) => {
  console.log(`le processus enfant s'est arrêté avec le code ${code}`);
});
```

```js [ESM]
import { spawn } from 'node:child_process';
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout : ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr : ${data}`);
});

ls.on('close', (code) => {
  console.log(`le processus enfant s'est arrêté avec le code ${code}`);
});
```
:::

Par défaut, des pipes pour `stdin`, `stdout` et `stderr` sont établis entre le processus Node.js parent et le sous-processus créé. Ces pipes ont une capacité limitée (et spécifique à la plate-forme). Si le sous-processus écrit dans stdout au-delà de cette limite sans que la sortie ne soit capturée, le sous-processus se bloque en attendant que le buffer du pipe accepte plus de données. Ceci est identique au comportement des pipes dans le shell. Utilisez l'option `{ stdio: 'ignore' }` si la sortie ne doit pas être consommée.

La recherche de commande est effectuée en utilisant la variable d'environnement `options.env.PATH` si `env` est dans l'objet `options`. Sinon, `process.env.PATH` est utilisé. Si `options.env` est défini sans `PATH`, la recherche sous Unix est effectuée sur un chemin de recherche par défaut `/usr/bin:/bin` (consultez le manuel de votre système d'exploitation pour execvpe/execvp), sous Windows, la variable d'environnement `PATH` du processus actuel est utilisée.

Sous Windows, les variables d'environnement ne sont pas sensibles à la casse. Node.js trie lexicographiquement les clés `env` et utilise la première qui correspond sans tenir compte de la casse. Seule la première entrée (dans l'ordre lexicographique) sera transmise au sous-processus. Cela peut entraîner des problèmes sous Windows lors de la transmission d'objets à l'option `env` qui ont plusieurs variantes de la même clé, telles que `PATH` et `Path`.

La méthode [`child_process.spawn()`](/fr/nodejs/api/child_process#child_processspawncommand-args-options) crée le processus enfant de manière asynchrone, sans bloquer la boucle d'événements Node.js. La fonction [`child_process.spawnSync()`](/fr/nodejs/api/child_process#child_processspawnsynccommand-args-options) fournit des fonctionnalités équivalentes de manière synchrone qui bloque la boucle d'événements jusqu'à ce que le processus créé se termine ou soit arrêté.

Pour plus de commodité, le module `node:child_process` fournit une poignée d'alternatives synchrones et asynchrones à [`child_process.spawn()`](/fr/nodejs/api/child_process#child_processspawncommand-args-options) et [`child_process.spawnSync()`](/fr/nodejs/api/child_process#child_processspawnsynccommand-args-options). Chacune de ces alternatives est implémentée au-dessus de [`child_process.spawn()`](/fr/nodejs/api/child_process#child_processspawncommand-args-options) ou [`child_process.spawnSync()`](/fr/nodejs/api/child_process#child_processspawnsynccommand-args-options).

- [`child_process.exec()`](/fr/nodejs/api/child_process#child_processexeccommand-options-callback) : crée un shell et exécute une commande dans ce shell, en passant le `stdout` et le `stderr` à une fonction de callback une fois terminé.
- [`child_process.execFile()`](/fr/nodejs/api/child_process#child_processexecfilefile-args-options-callback) : similaire à [`child_process.exec()`](/fr/nodejs/api/child_process#child_processexeccommand-options-callback) sauf qu'elle crée la commande directement sans créer d'abord un shell par défaut.
- [`child_process.fork()`](/fr/nodejs/api/child_process#child_processforkmodulepath-args-options) : crée un nouveau processus Node.js et invoque un module spécifié avec un canal de communication IPC établi qui permet d'envoyer des messages entre le parent et l'enfant.
- [`child_process.execSync()`](/fr/nodejs/api/child_process#child_processexecsynccommand-options) : une version synchrone de [`child_process.exec()`](/fr/nodejs/api/child_process#child_processexeccommand-options-callback) qui bloquera la boucle d'événements Node.js.
- [`child_process.execFileSync()`](/fr/nodejs/api/child_process#child_processexecfilesyncfile-args-options) : une version synchrone de [`child_process.execFile()`](/fr/nodejs/api/child_process#child_processexecfilefile-args-options-callback) qui bloquera la boucle d'événements Node.js.

Pour certains cas d'utilisation, tels que l'automatisation de scripts shell, les [homologues synchrones](/fr/nodejs/api/child_process#synchronous-process-creation) peuvent être plus pratiques. Dans de nombreux cas, cependant, les méthodes synchrones peuvent avoir un impact significatif sur les performances en raison du blocage de la boucle d'événements pendant que les processus créés se terminent.


## Création asynchrone de processus {#asynchronous-process-creation}

Les méthodes [`child_process.spawn()`](/fr/nodejs/api/child_process#child_processspawncommand-args-options), [`child_process.fork()`](/fr/nodejs/api/child_process#child_processforkmodulepath-args-options), [`child_process.exec()`](/fr/nodejs/api/child_process#child_processexeccommand-options-callback) et [`child_process.execFile()`](/fr/nodejs/api/child_process#child_processexecfilefile-args-options-callback) suivent toutes le modèle de programmation asynchrone idiomatique typique des autres API Node.js.

Chacune de ces méthodes renvoie une instance de [`ChildProcess`](/fr/nodejs/api/child_process#class-childprocess). Ces objets implémentent l'API [`EventEmitter`](/fr/nodejs/api/events#class-eventemitter) de Node.js, ce qui permet au processus parent d'enregistrer des fonctions d'écoute qui sont appelées lorsque certains événements se produisent pendant le cycle de vie du processus enfant.

Les méthodes [`child_process.exec()`](/fr/nodejs/api/child_process#child_processexeccommand-options-callback) et [`child_process.execFile()`](/fr/nodejs/api/child_process#child_processexecfilefile-args-options-callback) permettent en outre de spécifier une fonction de `callback` facultative qui est invoquée lorsque le processus enfant se termine.

### Lancement de fichiers `.bat` et `.cmd` sous Windows {#spawning-bat-and-cmd-files-on-windows}

L'importance de la distinction entre [`child_process.exec()`](/fr/nodejs/api/child_process#child_processexeccommand-options-callback) et [`child_process.execFile()`](/fr/nodejs/api/child_process#child_processexecfilefile-args-options-callback) peut varier en fonction de la plateforme. Sur les systèmes d'exploitation de type Unix (Unix, Linux, macOS), [`child_process.execFile()`](/fr/nodejs/api/child_process#child_processexecfilefile-args-options-callback) peut être plus efficace car il ne lance pas de shell par défaut. Sous Windows, cependant, les fichiers `.bat` et `.cmd` ne sont pas exécutables seuls sans terminal, et ne peuvent donc pas être lancés à l'aide de [`child_process.execFile()`](/fr/nodejs/api/child_process#child_processexecfilefile-args-options-callback). Lors de l'exécution sous Windows, les fichiers `.bat` et `.cmd` peuvent être invoqués à l'aide de [`child_process.spawn()`](/fr/nodejs/api/child_process#child_processspawncommand-args-options) avec l'option `shell` définie, avec [`child_process.exec()`](/fr/nodejs/api/child_process#child_processexeccommand-options-callback), ou en lançant `cmd.exe` et en passant le fichier `.bat` ou `.cmd` en argument (ce qui est ce que font l'option `shell` et [`child_process.exec()`](/fr/nodejs/api/child_process#child_processexeccommand-options-callback)). Dans tous les cas, si le nom de fichier du script contient des espaces, il doit être mis entre guillemets.

::: code-group
```js [CJS]
// OU...
const { exec, spawn } = require('node:child_process');

exec('my.bat', (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(stdout);
});

// Script avec des espaces dans le nom de fichier :
const bat = spawn('"my script.cmd"', ['a', 'b'], { shell: true });
// or:
exec('"my script.cmd" a b', (err, stdout, stderr) => {
  // ...
});
```

```js [ESM]
// OU...
import { exec, spawn } from 'node:child_process';

exec('my.bat', (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(stdout);
});

// Script avec des espaces dans le nom de fichier :
const bat = spawn('"my script.cmd"', ['a', 'b'], { shell: true });
// or:
exec('"my script.cmd" a b', (err, stdout, stderr) => {
  // ...
});
```
:::


### `child_process.exec(command[, options][, callback])` {#child_processexeccommand-options-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v15.4.0 | Prise en charge d'AbortSignal ajoutée. |
| v16.4.0, v14.18.0 | L'option `cwd` peut être un objet WHATWG `URL` utilisant le protocole `file:`. |
| v8.8.0 | L'option `windowsHide` est désormais prise en charge. |
| v0.1.90 | Ajoutée dans : v0.1.90 |
:::

- `command` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La commande à exécuter, avec des arguments séparés par des espaces.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api) Répertoire de travail actuel du processus enfant. **Par défaut :** `process.cwd()`.
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Paires clé-valeur d'environnement. **Par défaut :** `process.env`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Par défaut :** `'utf8'`
    - `shell` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Shell avec lequel exécuter la commande. Voir [Exigences du shell](/fr/nodejs/api/child_process#shell-requirements) et [Shell Windows par défaut](/fr/nodejs/api/child_process#default-windows-shell). **Par défaut :** `'/bin/sh'` sur Unix, `process.env.ComSpec` sur Windows.
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) permet d'interrompre le processus enfant à l'aide d'un AbortSignal.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `0`
    - `maxBuffer` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La plus grande quantité de données en octets autorisée sur stdout ou stderr. Si elle est dépassée, le processus enfant est terminé et toute sortie est tronquée. Voir la mise en garde à [`maxBuffer` et Unicode](/fr/nodejs/api/child_process#maxbuffer-and-unicode). **Par défaut :** `1024 * 1024`.
    - `killSignal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `'SIGTERM'`
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Définit l'identité de l'utilisateur du processus (voir [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2)).
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Définit l'identité du groupe du processus (voir [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2)).
    - `windowsHide` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Masque la fenêtre de console du sous-processus qui serait normalement créée sur les systèmes Windows. **Par défaut :** `false`.
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) appelée avec la sortie lorsque le processus se termine.
    - `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `stdout` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer)
    - `stderr` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer)

- Retourne : [\<ChildProcess\>](/fr/nodejs/api/child_process#class-childprocess)

Lance un shell puis exécute la `commande` dans ce shell, en mettant en mémoire tampon toute sortie générée. La chaîne `command` transmise à la fonction exec est traitée directement par le shell et les caractères spéciaux (qui varient selon le [shell](https://en.wikipedia.org/wiki/List_of_command-line_interpreters)) doivent être gérés en conséquence :

::: code-group
```js [CJS]
const { exec } = require('node:child_process');

exec('"/path/to/test file/test.sh" arg1 arg2');
// Les guillemets doubles sont utilisés afin que l'espace dans le chemin ne soit pas interprété comme
// un délimiteur d'arguments multiples.

exec('echo "La variable \\$HOME est $HOME"');
// La variable $HOME est échappée dans le premier cas, mais pas dans le second.
```

```js [ESM]
import { exec } from 'node:child_process';

exec('"/path/to/test file/test.sh" arg1 arg2');
// Les guillemets doubles sont utilisés afin que l'espace dans le chemin ne soit pas interprété comme
// un délimiteur d'arguments multiples.

exec('echo "La variable \\$HOME est $HOME"');
// La variable $HOME est échappée dans le premier cas, mais pas dans le second.
```
:::

**Ne transmettez jamais d'entrées utilisateur non désinfectées à cette fonction. Toute entrée contenant des métacaractères shell peut être utilisée pour déclencher l'exécution de commandes arbitraires.**

Si une fonction de `callback` est fournie, elle est appelée avec les arguments `(error, stdout, stderr)`. En cas de succès, `error` sera `null`. En cas d'erreur, `error` sera une instance de [`Error`](/fr/nodejs/api/errors#class-error). La propriété `error.code` sera le code de sortie du processus. Par convention, tout code de sortie autre que `0` indique une erreur. `error.signal` sera le signal qui a terminé le processus.

Les arguments `stdout` et `stderr` passés au callback contiendront la sortie stdout et stderr du processus enfant. Par défaut, Node.js décode la sortie en UTF-8 et transmet des chaînes au callback. L'option `encoding` peut être utilisée pour spécifier l'encodage des caractères utilisé pour décoder la sortie stdout et stderr. Si `encoding` est `'buffer'`, ou un encodage de caractères non reconnu, des objets `Buffer` seront passés au callback à la place.

::: code-group
```js [CJS]
const { exec } = require('node:child_process');
exec('cat *.js missing_file | wc -l', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});
```

```js [ESM]
import { exec } from 'node:child_process';
exec('cat *.js missing_file | wc -l', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});
```
:::

Si `timeout` est supérieur à `0`, le processus parent envoie le signal identifié par la propriété `killSignal` (la valeur par défaut est `'SIGTERM'`) si le processus enfant s'exécute plus longtemps que `timeout` millisecondes.

Contrairement à l'appel système POSIX [`exec(3)`](http://man7.org/linux/man-pages/man3/exec.3), `child_process.exec()` ne remplace pas le processus existant et utilise un shell pour exécuter la commande.

Si cette méthode est invoquée comme sa version [`util.promisify()`](/fr/nodejs/api/util#utilpromisifyoriginal)ée, elle retourne une `Promise` pour un `Object` avec des propriétés `stdout` et `stderr`. L'instance `ChildProcess` retournée est attachée à la `Promise` en tant que propriété `child`. En cas d'erreur (y compris toute erreur entraînant un code de sortie autre que 0), une promesse rejetée est retournée, avec le même objet `error` que celui donné dans le rappel, mais avec deux propriétés supplémentaires `stdout` et `stderr`.

::: code-group
```js [CJS]
const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

async function lsExample() {
  const { stdout, stderr } = await exec('ls');
  console.log('stdout:', stdout);
  console.error('stderr:', stderr);
}
lsExample();
```

```js [ESM]
import { promisify } from 'node:util';
import child_process from 'node:child_process';
const exec = promisify(child_process.exec);

async function lsExample() {
  const { stdout, stderr } = await exec('ls');
  console.log('stdout:', stdout);
  console.error('stderr:', stderr);
}
lsExample();
```
:::

Si l'option `signal` est activée, l'appel de `.abort()` sur le `AbortController` correspondant est similaire à l'appel de `.kill()` sur le processus enfant, sauf que l'erreur transmise au callback sera une `AbortError` :

::: code-group
```js [CJS]
const { exec } = require('node:child_process');
const controller = new AbortController();
const { signal } = controller;
const child = exec('grep ssh', { signal }, (error) => {
  console.error(error); // an AbortError
});
controller.abort();
```

```js [ESM]
import { exec } from 'node:child_process';
const controller = new AbortController();
const { signal } = controller;
const child = exec('grep ssh', { signal }, (error) => {
  console.error(error); // an AbortError
});
controller.abort();
```
:::

### `child_process.execFile(file[, args][, options][, callback])` {#child_processexecfilefile-args-options-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v16.4.0, v14.18.0 | L'option `cwd` peut être un objet `URL` WHATWG utilisant le protocole `file:`. |
| v15.4.0, v14.17.0 | Le support d'AbortSignal a été ajouté. |
| v8.8.0 | L'option `windowsHide` est désormais supportée. |
| v0.1.91 | Ajoutée dans : v0.1.91 |
:::

- `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le nom ou le chemin du fichier exécutable à exécuter.
- `args` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Liste des arguments de type chaîne de caractères.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api) Répertoire de travail actuel du processus enfant.
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Paires clé-valeur de l'environnement. **Par défaut :** `process.env`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Par défaut :** `'utf8'`
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `0`
    - `maxBuffer` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La plus grande quantité de données en octets autorisée sur stdout ou stderr. Si elle est dépassée, le processus enfant est terminé et toute sortie est tronquée. Voir l'avertissement à [`maxBuffer` et Unicode](/fr/nodejs/api/child_process#maxbuffer-and-unicode). **Par défaut :** `1024 * 1024`.
    - `killSignal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `'SIGTERM'`
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Définit l'identité de l'utilisateur du processus (voir [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2)).
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Définit l'identité du groupe du processus (voir [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2)).
    - `windowsHide` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Masque la fenêtre de console du sous-processus qui serait normalement créée sur les systèmes Windows. **Par défaut :** `false`.
    - `windowsVerbatimArguments` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Aucune citation ou échappement des arguments n'est effectué sous Windows. Ignoré sous Unix. **Par défaut :** `false`.
    - `shell` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Si `true`, exécute `command` à l'intérieur d'un shell. Utilise `'/bin/sh'` sur Unix et `process.env.ComSpec` sur Windows. Un shell différent peut être spécifié sous forme de chaîne de caractères. Voir [Exigences du shell](/fr/nodejs/api/child_process#shell-requirements) et [Shell Windows par défaut](/fr/nodejs/api/child_process#default-windows-shell). **Par défaut :** `false` (pas de shell).
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) permet d'abandonner le processus enfant à l'aide d'un AbortSignal.

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Appelée avec la sortie lorsque le processus se termine.
    - `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `stdout` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer)
    - `stderr` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer)

- Retourne : [\<ChildProcess\>](/fr/nodejs/api/child_process#class-childprocess)

La fonction `child_process.execFile()` est similaire à [`child_process.exec()`](/fr/nodejs/api/child_process#child_processexeccommand-options-callback) sauf qu'elle ne génère pas de shell par défaut. Au lieu de cela, le `file` exécutable spécifié est généré directement en tant que nouveau processus, ce qui le rend légèrement plus efficace que [`child_process.exec()`](/fr/nodejs/api/child_process#child_processexeccommand-options-callback).

Les mêmes options que [`child_process.exec()`](/fr/nodejs/api/child_process#child_processexeccommand-options-callback) sont prises en charge. Puisqu'aucun shell n'est généré, les comportements tels que la redirection d'E/S et la globalisation de fichiers ne sont pas pris en charge.

::: code-group
```js [CJS]
const { execFile } = require('node:child_process');
const child = execFile('node', ['--version'], (error, stdout, stderr) => {
  if (error) {
    throw error;
  }
  console.log(stdout);
});
```

```js [ESM]
import { execFile } from 'node:child_process';
const child = execFile('node', ['--version'], (error, stdout, stderr) => {
  if (error) {
    throw error;
  }
  console.log(stdout);
});
```
:::

Les arguments `stdout` et `stderr` passés au callback contiendront la sortie stdout et stderr du processus enfant. Par défaut, Node.js décodera la sortie en UTF-8 et passera des chaînes de caractères au callback. L'option `encoding` peut être utilisée pour spécifier l'encodage des caractères utilisés pour décoder la sortie stdout et stderr. Si `encoding` est `'buffer'`, ou un encodage de caractères non reconnu, des objets `Buffer` seront passés au callback à la place.

Si cette méthode est invoquée comme sa version [`util.promisify()`](/fr/nodejs/api/util#utilpromisifyoriginal)ée, elle renvoie une `Promise` pour un `Object` avec les propriétés `stdout` et `stderr`. L'instance `ChildProcess` renvoyée est attachée à la `Promise` en tant que propriété `child`. En cas d'erreur (y compris toute erreur entraînant un code de sortie autre que 0), une promesse rejetée est renvoyée, avec le même objet `error` donné dans le callback, mais avec deux propriétés supplémentaires `stdout` et `stderr`.

::: code-group
```js [CJS]
const util = require('node:util');
const execFile = util.promisify(require('node:child_process').execFile);
async function getVersion() {
  const { stdout } = await execFile('node', ['--version']);
  console.log(stdout);
}
getVersion();
```

```js [ESM]
import { promisify } from 'node:util';
import child_process from 'node:child_process';
const execFile = promisify(child_process.execFile);
async function getVersion() {
  const { stdout } = await execFile('node', ['--version']);
  console.log(stdout);
}
getVersion();
```
:::

**Si l'option <code>shell</code> est activée, ne transmettez pas de données utilisateur non nettoyées à cette
fonction. Toute entrée contenant des métacaractères de shell peut être utilisée pour déclencher
l'exécution de commandes arbitraires.**

Si l'option `signal` est activée, appeler `.abort()` sur le `AbortController` correspondant est similaire à appeler `.kill()` sur le processus enfant, sauf que l'erreur passée au callback sera une `AbortError` :

::: code-group
```js [CJS]
const { execFile } = require('node:child_process');
const controller = new AbortController();
const { signal } = controller;
const child = execFile('node', ['--version'], { signal }, (error) => {
  console.error(error); // an AbortError
});
controller.abort();
```

```js [ESM]
import { execFile } from 'node:child_process';
const controller = new AbortController();
const { signal } = controller;
const child = execFile('node', ['--version'], { signal }, (error) => {
  console.error(error); // an AbortError
});
controller.abort();
```
:::


### `child_process.fork(modulePath[, args][, options])` {#child_processforkmodulepath-args-options}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v17.4.0, v16.14.0 | Le paramètre `modulePath` peut être un objet `URL` WHATWG utilisant le protocole `file:`. |
| v16.4.0, v14.18.0 | L'option `cwd` peut être un objet `URL` WHATWG utilisant le protocole `file:`. |
| v15.13.0, v14.18.0 | Le timeout a été ajouté. |
| v15.11.0, v14.18.0 | killSignal pour AbortSignal a été ajouté. |
| v15.6.0, v14.17.0 | La prise en charge d'AbortSignal a été ajoutée. |
| v13.2.0, v12.16.0 | L'option `serialization` est désormais prise en charge. |
| v8.0.0 | L'option `stdio` peut maintenant être une chaîne de caractères. |
| v6.4.0 | L'option `stdio` est désormais prise en charge. |
| v0.5.0 | Ajoutée dans : v0.5.0 |
:::

- `modulePath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api) Le module à exécuter dans l'enfant.
- `args` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Liste des arguments de type chaîne de caractères.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api) Répertoire de travail actuel du processus enfant.
    - `detached` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Prépare le processus enfant à s'exécuter indépendamment de son processus parent. Le comportement spécifique dépend de la plateforme, voir [`options.detached`](/fr/nodejs/api/child_process#optionsdetached)).
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Paires clé-valeur d'environnement. **Par défaut :** `process.env`.
    - `execPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Exécutable utilisé pour créer le processus enfant.
    - `execArgv` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Liste des arguments de type chaîne de caractères passés à l'exécutable. **Par défaut :** `process.execArgv`.
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Définit l'identité de groupe du processus (voir [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2)).
    - `serialization` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Spécifie le type de sérialisation utilisé pour l'envoi de messages entre les processus. Les valeurs possibles sont `'json'` et `'advanced'`. Voir [Sérialisation avancée](/fr/nodejs/api/child_process#advanced-serialization) pour plus de détails. **Par défaut :** `'json'`.
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) Permet de fermer le processus enfant en utilisant un AbortSignal.
    - `killSignal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La valeur du signal à utiliser lorsque le processus lancé sera tué par un timeout ou un signal d'abandon. **Par défaut :** `'SIGTERM'`.
    - `silent` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si `true`, stdin, stdout et stderr du processus enfant seront dirigés vers le processus parent, sinon ils seront hérités du processus parent, voir les options `'pipe'` et `'inherit'` pour [`child_process.spawn()`](/fr/nodejs/api/child_process#child_processspawncommand-args-options)'s [`stdio`](/fr/nodejs/api/child_process#optionsstdio) pour plus de détails. **Par défaut :** `false`.
    - `stdio` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Voir [`stdio`](/fr/nodejs/api/child_process#optionsstdio) de [`child_process.spawn()`](/fr/nodejs/api/child_process#child_processspawncommand-args-options). Lorsque cette option est fournie, elle remplace `silent`. Si la variante de tableau est utilisée, elle doit contenir exactement un élément avec la valeur `'ipc'` sinon une erreur sera levée. Par exemple `[0, 1, 2, 'ipc']`.
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Définit l'identité d'utilisateur du processus (voir [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2)).
    - `windowsVerbatimArguments` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Aucune citation ou échappement d'arguments n'est effectué sous Windows. Ignoré sous Unix. **Par défaut :** `false`.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) En millisecondes, le temps maximal pendant lequel le processus est autorisé à s'exécuter. **Par défaut :** `undefined`.

- Retourne : [\<ChildProcess\>](/fr/nodejs/api/child_process#class-childprocess)

La méthode `child_process.fork()` est un cas particulier de [`child_process.spawn()`](/fr/nodejs/api/child_process#child_processspawncommand-args-options) utilisée spécifiquement pour lancer de nouveaux processus Node.js. Comme [`child_process.spawn()`](/fr/nodejs/api/child_process#child_processspawncommand-args-options), un objet [`ChildProcess`](/fr/nodejs/api/child_process#class-childprocess) est retourné. Le [`ChildProcess`](/fr/nodejs/api/child_process#class-childprocess) retourné aura un canal de communication supplémentaire intégré qui permet de transmettre des messages entre le parent et l'enfant. Voir [`subprocess.send()`](/fr/nodejs/api/child_process#subprocesssendmessage-sendhandle-options-callback) pour plus de détails.

Gardez à l'esprit que les processus enfants Node.js lancés sont indépendants du parent, à l'exception du canal de communication IPC qui est établi entre les deux. Chaque processus a sa propre mémoire, avec ses propres instances V8. En raison des allocations de ressources supplémentaires requises, il n'est pas recommandé de lancer un grand nombre de processus enfants Node.js.

Par défaut, `child_process.fork()` lancera de nouvelles instances Node.js en utilisant le [`process.execPath`](/fr/nodejs/api/process#processexecpath) du processus parent. La propriété `execPath` dans l'objet `options` permet d'utiliser un chemin d'exécution alternatif.

Les processus Node.js lancés avec un `execPath` personnalisé communiqueront avec le processus parent en utilisant le descripteur de fichier (fd) identifié à l'aide de la variable d'environnement `NODE_CHANNEL_FD` sur le processus enfant.

Contrairement à l'appel système POSIX [`fork(2)`](http://man7.org/linux/man-pages/man2/fork.2), `child_process.fork()` ne clone pas le processus actuel.

L'option `shell` disponible dans [`child_process.spawn()`](/fr/nodejs/api/child_process#child_processspawncommand-args-options) n'est pas prise en charge par `child_process.fork()` et sera ignorée si elle est définie.

Si l'option `signal` est activée, appeler `.abort()` sur l'`AbortController` correspondant est similaire à appeler `.kill()` sur le processus enfant, sauf que l'erreur transmise au callback sera une `AbortError`:

::: code-group
```js [CJS]
const { fork } = require('node:child_process');
const process = require('node:process');

if (process.argv[2] === 'child') {
  setTimeout(() => {
    console.log(`Hello from ${process.argv[2]}!`);
  }, 1_000);
} else {
  const controller = new AbortController();
  const { signal } = controller;
  const child = fork(__filename, ['child'], { signal });
  child.on('error', (err) => {
    // This will be called with err being an AbortError if the controller aborts
  });
  controller.abort(); // Stops the child process
}
```

```js [ESM]
import { fork } from 'node:child_process';
import process from 'node:process';

if (process.argv[2] === 'child') {
  setTimeout(() => {
    console.log(`Hello from ${process.argv[2]}!`);
  }, 1_000);
} else {
  const controller = new AbortController();
  const { signal } = controller;
  const child = fork(import.meta.url, ['child'], { signal });
  child.on('error', (err) => {
    // This will be called with err being an AbortError if the controller aborts
  });
  controller.abort(); // Stops the child process
}
```
:::

### `child_process.spawn(command[, args][, options])` {#child_processspawncommand-args-options}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v16.4.0, v14.18.0 | L'option `cwd` peut être un objet `URL` WHATWG utilisant le protocole `file:`. |
| v15.13.0, v14.18.0 | Le délai d'attente a été ajouté. |
| v15.11.0, v14.18.0 | killSignal pour AbortSignal a été ajouté. |
| v15.5.0, v14.17.0 | La prise en charge d'AbortSignal a été ajoutée. |
| v13.2.0, v12.16.0 | L'option `serialization` est désormais prise en charge. |
| v8.8.0 | L'option `windowsHide` est désormais prise en charge. |
| v6.4.0 | L'option `argv0` est désormais prise en charge. |
| v5.7.0 | L'option `shell` est désormais prise en charge. |
| v0.1.90 | Ajouté dans : v0.1.90 |
:::

- `command` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/String) La commande à exécuter.
- `args` [\<string[]\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/String) Liste d'arguments de type chaîne de caractères.
- `options` [\<Object\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/String) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api) Répertoire de travail actuel du processus enfant.
    - `env` [\<Object\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object) Paires clé-valeur d'environnement. **Par défaut :** `process.env`.
    - `argv0` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/String) Définir explicitement la valeur de `argv[0]` envoyée au processus enfant. Cette valeur sera définie sur `command` si elle n'est pas spécifiée.
    - `stdio` [\<Array\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array) | [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/String) Configuration stdio de l'enfant (voir [`options.stdio`](/fr/nodejs/api/child_process#optionsstdio)).
    - `detached` [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Boolean) Préparer le processus enfant à s'exécuter indépendamment de son processus parent. Le comportement spécifique dépend de la plateforme, voir [`options.detached`](/fr/nodejs/api/child_process#optionsdetached)).
    - `uid` [\<number\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Number) Définit l'identité de l'utilisateur du processus (voir [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2)).
    - `gid` [\<number\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Number) Définit l'identité du groupe du processus (voir [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2)).
    - `serialization` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/String) Spécifie le type de sérialisation utilisé pour l'envoi de messages entre les processus. Les valeurs possibles sont `'json'` et `'advanced'`. Voir [Sérialisation avancée](/fr/nodejs/api/child_process#advanced-serialization) pour plus de détails. **Par défaut :** `'json'`.
    - `shell` [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Boolean) | [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/String) Si `true`, exécute `command` à l'intérieur d'un shell. Utilise `'/bin/sh'` sur Unix, et `process.env.ComSpec` sur Windows. Un shell différent peut être spécifié comme une chaîne de caractères. Voir [Exigences du shell](/fr/nodejs/api/child_process#shell-requirements) et [Shell Windows par défaut](/fr/nodejs/api/child_process#default-windows-shell). **Par défaut :** `false` (pas de shell).
    - `windowsVerbatimArguments` [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Boolean) Aucune citation ou échappement d'arguments n'est effectué sur Windows. Ignoré sur Unix. Ceci est défini sur `true` automatiquement lorsque `shell` est spécifié et est CMD. **Par défaut :** `false`.
    - `windowsHide` [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Boolean) Masquer la fenêtre de console du sous-processus qui serait normalement créée sur les systèmes Windows. **Par défaut :** `false`.
    - `signal` [\<AbortSignal\>](/fr/nodejs/api/globals#class-abortsignal) permet d'abandonner le processus enfant en utilisant un AbortSignal.
    - `timeout` [\<number\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Number) En millisecondes, la durée maximale pendant laquelle le processus est autorisé à s'exécuter. **Par défaut :** `undefined`.
    - `killSignal` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/String) | [\<integer\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Number) La valeur du signal à utiliser lorsque le processus engendré sera tué par timeout ou signal d'abandon. **Par défaut :** `'SIGTERM'`.

- Retourne : [\<ChildProcess\>](/fr/nodejs/api/child_process#class-childprocess)

La méthode `child_process.spawn()` engendre un nouveau processus en utilisant la `commande` donnée, avec des arguments de ligne de commande dans `args`. S'il est omis, `args` est par défaut un tableau vide.

**Si l'option <code>shell</code> est activée, ne transmettez pas d'entrée utilisateur non désinfectée à cette
fonction. Toute entrée contenant des métacaractères shell peut être utilisée pour déclencher
l'exécution de commandes arbitraires.**

Un troisième argument peut être utilisé pour spécifier des options supplémentaires, avec les valeurs par défaut suivantes :

```js [ESM]
const defaults = {
  cwd: undefined,
  env: process.env,
};
```
Utilisez `cwd` pour spécifier le répertoire de travail à partir duquel le processus est engendré. Si elle n'est pas donnée, la valeur par défaut est d'hériter du répertoire de travail actuel. Si elle est donnée, mais que le chemin n'existe pas, le processus enfant émet une erreur `ENOENT` et se termine immédiatement. `ENOENT` est également émis lorsque la commande n'existe pas.

Utilisez `env` pour spécifier les variables d'environnement qui seront visibles par le nouveau processus, la valeur par défaut est [`process.env`](/fr/nodejs/api/process#processenv).

Les valeurs `undefined` dans `env` seront ignorées.

Exemple d'exécution de `ls -lh /usr`, en capturant `stdout`, `stderr` et le code de sortie :

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
```

```js [ESM]
import { spawn } from 'node:child_process';
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
```
:::

Exemple : une façon très élaborée d'exécuter `ps ax | grep ssh`

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const ps = spawn('ps', ['ax']);
const grep = spawn('grep', ['ssh']);

ps.stdout.on('data', (data) => {
  grep.stdin.write(data);
});

ps.stderr.on('data', (data) => {
  console.error(`ps stderr: ${data}`);
});

ps.on('close', (code) => {
  if (code !== 0) {
    console.log(`ps process exited with code ${code}`);
  }
  grep.stdin.end();
});

grep.stdout.on('data', (data) => {
  console.log(data.toString());
});

grep.stderr.on('data', (data) => {
  console.error(`grep stderr: ${data}`);
});

grep.on('close', (code) => {
  if (code !== 0) {
    console.log(`grep process exited with code ${code}`);
  }
});
```

```js [ESM]
import { spawn } from 'node:child_process';
const ps = spawn('ps', ['ax']);
const grep = spawn('grep', ['ssh']);

ps.stdout.on('data', (data) => {
  grep.stdin.write(data);
});

ps.stderr.on('data', (data) => {
  console.error(`ps stderr: ${data}`);
});

ps.on('close', (code) => {
  if (code !== 0) {
    console.log(`ps process exited with code ${code}`);
  }
  grep.stdin.end();
});

grep.stdout.on('data', (data) => {
  console.log(data.toString());
});

grep.stderr.on('data', (data) => {
  console.error(`grep stderr: ${data}`);
});

grep.on('close', (code) => {
  if (code !== 0) {
    console.log(`grep process exited with code ${code}`);
  }
});
```
:::

Exemple de vérification de l'échec de `spawn` :

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const subprocess = spawn('bad_command');

subprocess.on('error', (err) => {
  console.error('Failed to start subprocess.');
});
```

```js [ESM]
import { spawn } from 'node:child_process';
const subprocess = spawn('bad_command');

subprocess.on('error', (err) => {
  console.error('Failed to start subprocess.');
});
```
:::

Certaines plateformes (macOS, Linux) utiliseront la valeur de `argv[0]` pour le titre du processus tandis que d'autres (Windows, SunOS) utiliseront `command`.

Node.js remplace `argv[0]` par `process.execPath` au démarrage, de sorte que `process.argv[0]` dans un processus enfant Node.js ne correspondra pas au paramètre `argv0` passé à `spawn` depuis le parent. Récupérez-le plutôt avec la propriété `process.argv0`.

Si l'option `signal` est activée, l'appel de `.abort()` sur le `AbortController` correspondant est similaire à l'appel de `.kill()` sur le processus enfant, sauf que l'erreur transmise au callback sera une `AbortError` :

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const controller = new AbortController();
const { signal } = controller;
const grep = spawn('grep', ['ssh'], { signal });
grep.on('error', (err) => {
  // Ceci sera appelé avec err étant une AbortError si le contrôleur abandonne
});
controller.abort(); // Arrête le processus enfant
```

```js [ESM]
import { spawn } from 'node:child_process';
const controller = new AbortController();
const { signal } = controller;
const grep = spawn('grep', ['ssh'], { signal });
grep.on('error', (err) => {
  // Ceci sera appelé avec err étant une AbortError si le contrôleur abandonne
});
controller.abort(); // Arrête le processus enfant
```
:::


#### `options.detached` {#optionsdetached}

**Ajouté dans : v0.7.10**

Sous Windows, définir `options.detached` sur `true` permet au processus enfant de continuer à s'exécuter après la fermeture du parent. Le processus enfant aura sa propre fenêtre de console. Une fois activé pour un processus enfant, il ne peut plus être désactivé.

Sur les plateformes non-Windows, si `options.detached` est défini sur `true`, le processus enfant deviendra le chef de file d'un nouveau groupe de processus et d'une nouvelle session. Les processus enfants peuvent continuer à s'exécuter après la fermeture du parent, qu'ils soient détachés ou non. Voir [`setsid(2)`](http://man7.org/linux/man-pages/man2/setsid.2) pour plus d'informations.

Par défaut, le parent attendra que le processus enfant détaché se termine. Pour empêcher le processus parent d'attendre la fin d'un `subprocess` donné, utilisez la méthode `subprocess.unref()`. Cela aura pour effet de ne pas inclure le processus enfant dans le nombre de références de la boucle d'événements du processus parent, ce qui permettra au processus parent de se fermer indépendamment du processus enfant, sauf s'il existe un canal IPC établi entre le processus enfant et le processus parent.

Lorsque vous utilisez l'option `detached` pour démarrer un processus de longue durée, le processus ne restera pas en arrière-plan après la fermeture du parent, sauf s'il est doté d'une configuration `stdio` qui n'est pas connectée au parent. Si le `stdio` du processus parent est hérité, le processus enfant restera attaché au terminal de contrôle.

Exemple d'un processus de longue durée, en le détachant et en ignorant également les descripteurs de fichiers `stdio` de son parent, afin d'ignorer la terminaison du parent :

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const process = require('node:process');

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
```

```js [ESM]
import { spawn } from 'node:child_process';
import process from 'node:process';

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
```
:::

Il est également possible de rediriger la sortie du processus enfant vers des fichiers :

::: code-group
```js [CJS]
const { openSync } = require('node:fs');
const { spawn } = require('node:child_process');
const out = openSync('./out.log', 'a');
const err = openSync('./out.log', 'a');

const subprocess = spawn('prg', [], {
  detached: true,
  stdio: [ 'ignore', out, err ],
});

subprocess.unref();
```

```js [ESM]
import { openSync } from 'node:fs');
import { spawn } from 'node:child_process';
const out = openSync('./out.log', 'a');
const err = openSync('./out.log', 'a');

const subprocess = spawn('prg', [], {
  detached: true,
  stdio: [ 'ignore', out, err ],
});

subprocess.unref();
```
:::


#### `options.stdio` {#optionsstdio}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v15.6.0, v14.18.0 | Ajout du drapeau stdio `overlapped`. |
| v3.3.1 | La valeur `0` est désormais acceptée comme descripteur de fichier. |
| v0.7.10 | Ajouté dans : v0.7.10 |
:::

L'option `options.stdio` est utilisée pour configurer les pipes établis entre le processus parent et le processus enfant. Par défaut, les entrées/sorties standard (stdin), les sorties standard (stdout) et les erreurs standard (stderr) de l'enfant sont redirigées vers les flux [`subprocess.stdin`](/fr/nodejs/api/child_process#subprocessstdin), [`subprocess.stdout`](/fr/nodejs/api/child_process#subprocessstdout) et [`subprocess.stderr`](/fr/nodejs/api/child_process#subprocessstderr) correspondants sur l'objet [`ChildProcess`](/fr/nodejs/api/child_process#class-childprocess). Cela équivaut à définir `options.stdio` sur `['pipe', 'pipe', 'pipe']`.

Par commodité, `options.stdio` peut être l'une des chaînes suivantes :

- `'pipe'` : équivalent à `['pipe', 'pipe', 'pipe']` (par défaut)
- `'overlapped'` : équivalent à `['overlapped', 'overlapped', 'overlapped']`
- `'ignore'` : équivalent à `['ignore', 'ignore', 'ignore']`
- `'inherit'` : équivalent à `['inherit', 'inherit', 'inherit']` ou `[0, 1, 2]`

Sinon, la valeur de `options.stdio` est un tableau où chaque index correspond à un fd dans l'enfant. Les fd 0, 1 et 2 correspondent respectivement à stdin, stdout et stderr. Des fd supplémentaires peuvent être spécifiés pour créer des pipes supplémentaires entre le parent et l'enfant. La valeur est l'une des suivantes :

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const process = require('node:process');

// L'enfant utilisera les stdios du parent.
spawn('prg', [], { stdio: 'inherit' });

// Crée un enfant partageant uniquement stderr.
spawn('prg', [], { stdio: ['pipe', 'pipe', process.stderr] });

// Ouvrir un fd supplémentaire=4, pour interagir avec les programmes présentant une
// interface de type startd.
spawn('prg', [], { stdio: ['pipe', null, null, null, 'pipe'] });
```

```js [ESM]
import { spawn } from 'node:child_process';
import process from 'node:process';

// L'enfant utilisera les stdios du parent.
spawn('prg', [], { stdio: 'inherit' });

// Crée un enfant partageant uniquement stderr.
spawn('prg', [], { stdio: ['pipe', 'pipe', process.stderr] });

// Ouvrir un fd supplémentaire=4, pour interagir avec les programmes présentant une
// interface de type startd.
spawn('prg', [], { stdio: ['pipe', null, null, null, 'pipe'] });
```
:::

*Il est important de noter que lorsqu'un canal IPC est établi entre les
processus parent et enfant, et que le processus enfant est une instance Node.js,
le processus enfant est lancé avec le canal IPC non référencé (en utilisant
<code>unref()</code>) jusqu'à ce que le processus enfant enregistre un gestionnaire d'événements pour l'événement
<a href="process.html#event-disconnect"><code>'disconnect'</code></a> ou l'événement <a href="process.html#event-message"><code>'message'</code></a>. Cela permet au
processus enfant de se terminer normalement sans que le processus ne soit maintenu ouvert par le
canal IPC ouvert.* Voir aussi : [`child_process.exec()`](/fr/nodejs/api/child_process#child_processexeccommand-options-callback) et [`child_process.fork()`](/fr/nodejs/api/child_process#child_processforkmodulepath-args-options).


## Création synchrone de processus {#synchronous-process-creation}

Les méthodes [`child_process.spawnSync()`](/fr/nodejs/api/child_process#child_processspawnsynccommand-args-options), [`child_process.execSync()`](/fr/nodejs/api/child_process#child_processexecsynccommand-options) et [`child_process.execFileSync()`](/fr/nodejs/api/child_process#child_processexecfilesyncfile-args-options) sont synchrones et bloquent la boucle d’événements de Node.js, interrompant l’exécution de tout code supplémentaire jusqu’à ce que le processus enfant se termine.

Les appels bloquants comme ceux-ci sont surtout utiles pour simplifier les tâches de script à usage général et pour simplifier le chargement/traitement de la configuration de l’application au démarrage.

### `child_process.execFileSync(file[, args][, options])` {#child_processexecfilesyncfile-args-options}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v16.4.0, v14.18.0 | L’option `cwd` peut être un objet `URL` WHATWG utilisant le protocole `file:`. |
| v10.10.0 | L’option `input` peut maintenant être n’importe quel `TypedArray` ou `DataView`. |
| v8.8.0 | L’option `windowsHide` est désormais prise en charge. |
| v8.0.0 | L’option `input` peut maintenant être un `Uint8Array`. |
| v6.2.1, v4.5.0 | L’option `encoding` peut désormais être explicitement définie sur `buffer`. |
| v0.11.12 | Ajoutée dans : v0.11.12 |
:::

- `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le nom ou le chemin d’accès du fichier exécutable à exécuter.
- `args` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Liste des arguments de chaîne de caractères.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api) Répertoire de travail actuel du processus enfant.
    - `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) La valeur qui sera transmise en tant que stdin au processus engendré. Si `stdio[0]` est défini sur `'pipe'`, la fourniture de cette valeur remplacera `stdio[0]`.
    - `stdio` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Configuration stdio de l’enfant. Voir le [`stdio`](/fr/nodejs/api/child_process#optionsstdio) de [`child_process.spawn()`](/fr/nodejs/api/child_process#child_processspawncommand-args-options). `stderr` sera par défaut envoyé au stderr du processus parent, sauf si `stdio` est spécifié. **Par défaut :** `'pipe'`.
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Paires clé-valeur d’environnement. **Par défaut :** `process.env`.
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Définit l’identité de l’utilisateur du processus (voir [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2)).
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Définit l’identité du groupe du processus (voir [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2)).
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) En millisecondes, la durée maximale pendant laquelle le processus est autorisé à s’exécuter. **Par défaut :** `undefined`.
    - `killSignal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La valeur du signal à utiliser lorsque le processus engendré sera tué. **Par défaut :** `'SIGTERM'`.
    - `maxBuffer` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Quantité maximale de données en octets autorisée sur stdout ou stderr. Si elle est dépassée, le processus enfant est terminé. Voir la mise en garde à [`maxBuffer` et Unicode](/fr/nodejs/api/child_process#maxbuffer-and-unicode). **Par défaut :** `1024 * 1024`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L’encodage utilisé pour toutes les entrées et sorties stdio. **Par défaut :** `'buffer'`.
    - `windowsHide` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Masquer la fenêtre de console du sous-processus qui serait normalement créée sur les systèmes Windows. **Par défaut :** `false`.
    - `shell` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Si `true`, exécute `command` à l’intérieur d’un shell. Utilise `'/bin/sh'` sur Unix et `process.env.ComSpec` sur Windows. Un shell différent peut être spécifié en tant que chaîne de caractères. Voir [Exigences du shell](/fr/nodejs/api/child_process#shell-requirements) et [Shell Windows par défaut](/fr/nodejs/api/child_process#default-windows-shell). **Par défaut :** `false` (pas de shell).

- Renvoie : [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La sortie stdout de la commande.

La méthode `child_process.execFileSync()` est généralement identique à [`child_process.execFile()`](/fr/nodejs/api/child_process#child_processexecfilefile-args-options-callback), à l’exception que la méthode ne renvoie pas de résultat tant que le processus enfant n’est pas entièrement fermé. Lorsqu’un délai d’attente a été rencontré et que `killSignal` est envoyé, la méthode ne renvoie pas de résultat tant que le processus n’est pas complètement terminé.

Si le processus enfant intercepte et gère le signal `SIGTERM` et ne se termine pas, le processus parent attendra quand même jusqu’à ce que le processus enfant se soit terminé.

Si le processus expire ou a un code de sortie différent de zéro, cette méthode lèvera une [`Error`](/fr/nodejs/api/errors#class-error) qui inclura le résultat complet du [`child_process.spawnSync()`](/fr/nodejs/api/child_process#child_processspawnsynccommand-args-options) sous-jacent.

**Si l’option <code>shell</code> est activée, ne transmettez pas d’entrée utilisateur non nettoyée à cette
fonction. Toute entrée contenant des métacaractères de shell peut être utilisée pour déclencher
l’exécution de commandes arbitraires.**

::: code-group
```js [CJS]
const { execFileSync } = require('node:child_process');

try {
  const stdout = execFileSync('my-script.sh', ['my-arg'], {
    // Capture stdout and stderr from child process. Overrides the
    // default behavior of streaming child stderr to the parent stderr
    stdio: 'pipe',

    // Use utf8 encoding for stdio pipes
    encoding: 'utf8',
  });

  console.log(stdout);
} catch (err) {
  if (err.code) {
    // Spawning child process failed
    console.error(err.code);
  } else {
    // Child was spawned but exited with non-zero exit code
    // Error contains any stdout and stderr from the child
    const { stdout, stderr } = err;

    console.error({ stdout, stderr });
  }
}
```

```js [ESM]
import { execFileSync } from 'node:child_process';

try {
  const stdout = execFileSync('my-script.sh', ['my-arg'], {
    // Capture stdout and stderr from child process. Overrides the
    // default behavior of streaming child stderr to the parent stderr
    stdio: 'pipe',

    // Use utf8 encoding for stdio pipes
    encoding: 'utf8',
  });

  console.log(stdout);
} catch (err) {
  if (err.code) {
    // Spawning child process failed
    console.error(err.code);
  } else {
    // Child was spawned but exited with non-zero exit code
    // Error contains any stdout and stderr from the child
    const { stdout, stderr } = err;

    console.error({ stdout, stderr });
  }
}
```
:::


### `child_process.execSync(command[, options])` {#child_processexecsynccommand-options}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v16.4.0, v14.18.0 | L'option `cwd` peut être un objet `URL` WHATWG utilisant le protocole `file:`. |
| v10.10.0 | L'option `input` peut maintenant être n'importe quel `TypedArray` ou un `DataView`. |
| v8.8.0 | L'option `windowsHide` est désormais prise en charge. |
| v8.0.0 | L'option `input` peut maintenant être un `Uint8Array`. |
| v0.11.12 | Ajoutée dans : v0.11.12 |
:::

- `command` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La commande à exécuter.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api) Répertoire de travail actuel du processus enfant.
    - `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) La valeur qui sera transmise en tant que stdin au processus généré. Si `stdio[0]` est défini sur `'pipe'`, la fourniture de cette valeur remplacera `stdio[0]`.
    - `stdio` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Configuration stdio de l'enfant. Voir le [`stdio`](/fr/nodejs/api/child_process#optionsstdio) de [`child_process.spawn()`](/fr/nodejs/api/child_process#child_processspawncommand-args-options). `stderr` sera par défaut envoyé vers stderr du processus parent, sauf si `stdio` est spécifié. **Par défaut :** `'pipe'`.
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Paires clé-valeur d'environnement. **Par défaut :** `process.env`.
    - `shell` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Shell avec lequel exécuter la commande. Voir [Exigences du Shell](/fr/nodejs/api/child_process#shell-requirements) et [Shell Windows par défaut](/fr/nodejs/api/child_process#default-windows-shell). **Par défaut :** `'/bin/sh'` sur Unix, `process.env.ComSpec` sur Windows.
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Définit l'identité de l'utilisateur du processus. (Voir [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2)).
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Définit l'identité du groupe du processus. (Voir [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2)).
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) En millisecondes, la durée maximale pendant laquelle le processus est autorisé à s'exécuter. **Par défaut :** `undefined`.
    - `killSignal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La valeur de signal à utiliser lorsque le processus généré sera tué. **Par défaut :** `'SIGTERM'`.
    - `maxBuffer` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La quantité maximale de données en octets autorisée sur stdout ou stderr. Si elle est dépassée, le processus enfant est terminé et toute sortie est tronquée. Voir la mise en garde à [`maxBuffer` et Unicode](/fr/nodejs/api/child_process#maxbuffer-and-unicode). **Par défaut :** `1024 * 1024`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'encodage utilisé pour toutes les entrées et sorties stdio. **Par défaut :** `'buffer'`.
    - `windowsHide` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Masque la fenêtre de console du sous-processus qui serait normalement créée sur les systèmes Windows. **Par défaut :** `false`.

- Returns: [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La stdout de la commande.

La méthode `child_process.execSync()` est généralement identique à [`child_process.exec()`](/fr/nodejs/api/child_process#child_processexeccommand-options-callback) à l'exception que la méthode ne renverra pas tant que le processus enfant n'est pas complètement fermé. Lorsqu'un timeout a été rencontré et que `killSignal` est envoyé, la méthode ne retournera pas tant que le processus n'aura pas complètement quitté. Si le processus enfant intercepte et gère le signal `SIGTERM` et ne quitte pas, le processus parent attendra que le processus enfant ait quitté.

Si le processus expire ou a un code de sortie différent de zéro, cette méthode lèvera une erreur. L'objet [`Error`](/fr/nodejs/api/errors#class-error) contiendra le résultat complet de [`child_process.spawnSync()`](/fr/nodejs/api/child_process#child_processspawnsynccommand-args-options).

**Ne transmettez jamais d'entrées utilisateur non désinfectées à cette fonction. Toute entrée contenant des métacaractères de shell peut être utilisée pour déclencher l'exécution de commandes arbitraires.**


### `child_process.spawnSync(command[, args][, options])` {#child_processspawnsynccommand-args-options}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v16.4.0, v14.18.0 | L'option `cwd` peut être un objet `URL` WHATWG utilisant le protocole `file:`. |
| v10.10.0 | L'option `input` peut maintenant être n'importe quel `TypedArray` ou un `DataView`. |
| v8.8.0 | L'option `windowsHide` est maintenant prise en charge. |
| v8.0.0 | L'option `input` peut maintenant être un `Uint8Array`. |
| v5.7.0 | L'option `shell` est maintenant prise en charge. |
| v6.2.1, v4.5.0 | L'option `encoding` peut maintenant être définie explicitement sur `buffer`. |
| v0.11.12 | Ajoutée dans : v0.11.12 |
:::

- `command` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La commande à exécuter.
- `args` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Liste des arguments de chaîne.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api) Répertoire de travail actuel du processus enfant.
    - `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) La valeur qui sera passée comme stdin au processus généré. Si `stdio[0]` est défini sur `'pipe'`, la fourniture de cette valeur remplacera `stdio[0]`.
    - `argv0` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Définit explicitement la valeur de `argv[0]` envoyée au processus enfant. Elle sera définie sur `command` si elle n'est pas spécifiée.
    - `stdio` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Configuration stdio de l'enfant. Voir [`child_process.spawn()`](/fr/nodejs/api/child_process#child_processspawncommand-args-options)'s [`stdio`](/fr/nodejs/api/child_process#optionsstdio). **Par défaut:** `'pipe'`.
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Paires clé-valeur d'environnement. **Par défaut:** `process.env`.
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Définit l'identité de l'utilisateur du processus (voir [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2)).
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Définit l'identité du groupe du processus (voir [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2)).
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) En millisecondes, la durée maximale pendant laquelle le processus est autorisé à s'exécuter. **Par défaut:** `undefined`.
    - `killSignal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La valeur du signal à utiliser lorsque le processus généré sera tué. **Par défaut:** `'SIGTERM'`.
    - `maxBuffer` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La plus grande quantité de données en octets autorisée sur stdout ou stderr. Si elle est dépassée, le processus enfant est terminé et toute sortie est tronquée. Voir la mise en garde à [`maxBuffer` et Unicode](/fr/nodejs/api/child_process#maxbuffer-and-unicode). **Par défaut:** `1024 * 1024`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'encodage utilisé pour toutes les entrées et sorties stdio. **Par défaut:** `'buffer'`.
    - `shell` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Si `true`, exécute `command` à l'intérieur d'un shell. Utilise `'/bin/sh'` sur Unix, et `process.env.ComSpec` sur Windows. Un shell différent peut être spécifié sous forme de chaîne. Voir [Exigences du shell](/fr/nodejs/api/child_process#shell-requirements) et [Shell Windows par défaut](/fr/nodejs/api/child_process#default-windows-shell). **Par défaut:** `false` (pas de shell).
    - `windowsVerbatimArguments` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Aucune citation ou échappement des arguments n'est effectué sur Windows. Ignoré sur Unix. Ceci est défini sur `true` automatiquement lorsque `shell` est spécifié et est CMD. **Par défaut:** `false`.
    - `windowsHide` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Masque la fenêtre de console du sous-processus qui serait normalement créée sur les systèmes Windows. **Par défaut:** `false`.
  
 
- Returns: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `pid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Pid du processus enfant.
    - `output` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Tableau des résultats de la sortie stdio.
    - `stdout` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le contenu de `output[1]`.
    - `stderr` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le contenu de `output[2]`.
    - `status` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) Le code de sortie du sous-processus, ou `null` si le sous-processus s'est terminé en raison d'un signal.
    - `signal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) Le signal utilisé pour tuer le sous-processus, ou `null` si le sous-processus ne s'est pas terminé en raison d'un signal.
    - `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) L'objet d'erreur si le processus enfant a échoué ou a expiré.
  
 

La méthode `child_process.spawnSync()` est généralement identique à [`child_process.spawn()`](/fr/nodejs/api/child_process#child_processspawncommand-args-options) à l'exception que la fonction ne renvoie pas tant que le processus enfant n'est pas complètement fermé. Lorsqu'un délai d'attente a été rencontré et que `killSignal` est envoyé, la méthode ne renvoie pas tant que le processus n'a pas complètement quitté. Si le processus intercepte et gère le signal `SIGTERM` et ne quitte pas, le processus parent attendra que le processus enfant ait quitté.

**Si l'option <code>shell</code> est activée, ne transmettez pas d'entrée utilisateur non
désinfectée à cette fonction. Toute entrée contenant des métacaractères shell peut
être utilisée pour déclencher l'exécution de commandes arbitraires.**


## Classe : `ChildProcess` {#class-childprocess}

**Ajouté dans : v2.2.0**

- Hérite de : [\<EventEmitter\>](/fr/nodejs/api/events#class-eventemitter)

Les instances de `ChildProcess` représentent les processus enfants générés.

Les instances de `ChildProcess` ne sont pas destinées à être créées directement. Utilisez plutôt les méthodes [`child_process.spawn()`](/fr/nodejs/api/child_process#child_processspawncommand-args-options), [`child_process.exec()`](/fr/nodejs/api/child_process#child_processexeccommand-options-callback), [`child_process.execFile()`](/fr/nodejs/api/child_process#child_processexecfilefile-args-options-callback) ou [`child_process.fork()`](/fr/nodejs/api/child_process#child_processforkmodulepath-args-options) pour créer des instances de `ChildProcess`.

### Événement : `'close'` {#event-close}

**Ajouté dans : v0.7.7**

- `code` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le code de sortie si le processus enfant s’est terminé de lui-même.
- `signal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le signal par lequel le processus enfant a été arrêté.

L’événement `'close'` est émis après qu’un processus s’est terminé *et* que les flux stdio d’un processus enfant ont été fermés. Il est distinct de l’événement [`'exit'`](/fr/nodejs/api/child_process#event-exit), car plusieurs processus peuvent partager les mêmes flux stdio. L’événement `'close'` sera toujours émis après que [`'exit'`](/fr/nodejs/api/child_process#event-exit) a déjà été émis, ou [`'error'`](/fr/nodejs/api/child_process#event-error) si le processus enfant n’a pas pu être généré.

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process close all stdio with code ${code}`);
});

ls.on('exit', (code) => {
  console.log(`child process exited with code ${code}`);
});
```

```js [ESM]
import { spawn } from 'node:child_process';
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process close all stdio with code ${code}`);
});

ls.on('exit', (code) => {
  console.log(`child process exited with code ${code}`);
});
```
:::


### Événement : `'disconnect'` {#event-disconnect}

**Ajouté dans : v0.7.2**

L'événement `'disconnect'` est émis après l'appel de la méthode [`subprocess.disconnect()`](/fr/nodejs/api/child_process#subprocessdisconnect) dans le processus parent ou [`process.disconnect()`](/fr/nodejs/api/process#processdisconnect) dans le processus enfant. Après la déconnexion, il n'est plus possible d'envoyer ou de recevoir des messages, et la propriété [`subprocess.connected`](/fr/nodejs/api/child_process#subprocessconnected) est `false`.

### Événement : `'error'` {#event-error}

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) L'erreur.

L'événement `'error'` est émis chaque fois que :

- Le processus n'a pas pu être lancé.
- Le processus n'a pas pu être arrêté.
- L'envoi d'un message au processus enfant a échoué.
- Le processus enfant a été abandonné via l'option `signal`.

L'événement `'exit'` peut se déclencher ou non après une erreur. Lorsque vous écoutez à la fois les événements `'exit'` et `'error'`, protégez-vous contre l'invocation accidentelle de fonctions de gestion plusieurs fois.

Voir aussi [`subprocess.kill()`](/fr/nodejs/api/child_process#subprocesskillsignal) et [`subprocess.send()`](/fr/nodejs/api/child_process#subprocesssendmessage-sendhandle-options-callback).

### Événement : `'exit'` {#event-exit}

**Ajouté dans : v0.1.90**

- `code` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le code de sortie si le processus enfant s'est terminé de lui-même.
- `signal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le signal par lequel le processus enfant a été terminé.

L'événement `'exit'` est émis après la fin du processus enfant. Si le processus s'est terminé, `code` est le code de sortie final du processus, sinon `null`. Si le processus s'est terminé en raison de la réception d'un signal, `signal` est le nom de chaîne du signal, sinon `null`. L'un des deux sera toujours non-`null`.

Lorsque l'événement `'exit'` est déclenché, les flux stdio du processus enfant peuvent toujours être ouverts.

Node.js établit des gestionnaires de signaux pour `SIGINT` et `SIGTERM` et les processus Node.js ne se termineront pas immédiatement en raison de la réception de ces signaux. Au lieu de cela, Node.js effectuera une séquence d'actions de nettoyage, puis relancera le signal géré.

Voir [`waitpid(2)`](http://man7.org/linux/man-pages/man2/waitpid.2).


### Événement : `'message'` {#event-message}

**Ajouté dans la version : v0.5.9**

- `message` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un objet JSON analysé ou une valeur primitive.
- `sendHandle` [\<Handle\>](/fr/nodejs/api/net#serverlistenhandle-backlog-callback) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) `undefined` ou un objet [`net.Socket`](/fr/nodejs/api/net#class-netsocket), [`net.Server`](/fr/nodejs/api/net#class-netserver), ou [`dgram.Socket`](/fr/nodejs/api/dgram#class-dgramsocket).

L'événement `'message'` est déclenché lorsqu'un processus enfant utilise [`process.send()`](/fr/nodejs/api/process#processsendmessage-sendhandle-options-callback) pour envoyer des messages.

Le message passe par la sérialisation et l'analyse. Le message résultant peut ne pas être le même que celui envoyé à l'origine.

Si l'option `serialization` a été définie sur `'advanced'` lors de la création du processus enfant, l'argument `message` peut contenir des données que JSON n'est pas en mesure de représenter. Voir [Sérialisation avancée](/fr/nodejs/api/child_process#advanced-serialization) pour plus de détails.

### Événement : `'spawn'` {#event-spawn}

**Ajouté dans la version : v15.1.0, v14.17.0**

L'événement `'spawn'` est émis une fois que le processus enfant a été créé avec succès. Si le processus enfant n'est pas créé avec succès, l'événement `'spawn'` n'est pas émis et l'événement `'error'` est émis à la place.

S'il est émis, l'événement `'spawn'` se produit avant tous les autres événements et avant que toute donnée ne soit reçue via `stdout` ou `stderr`.

L'événement `'spawn'` se déclenchera, qu'une erreur se produise ou non **dans** le processus créé. Par exemple, si `bash some-command` est créé avec succès, l'événement `'spawn'` se déclenchera, bien que `bash` puisse échouer à créer `some-command`. Cette mise en garde s'applique également lors de l'utilisation de `{ shell: true }`.

### `subprocess.channel` {#subprocesschannel}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v14.0.0 | L'objet n'expose plus accidentellement les liaisons C++ natives. |
| v7.1.0 | Ajouté dans la version : v7.1.0 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un tube représentant le canal IPC vers le processus enfant.

La propriété `subprocess.channel` est une référence au canal IPC de l'enfant. Si aucun canal IPC n'existe, cette propriété est `undefined`.


#### `subprocess.channel.ref()` {#subprocesschannelref}

**Ajouté dans : v7.1.0**

Cette méthode permet au canal IPC de maintenir la boucle d’événements du processus parent en cours d’exécution si `.unref()` a été appelé auparavant.

#### `subprocess.channel.unref()` {#subprocesschannelunref}

**Ajouté dans : v7.1.0**

Cette méthode permet au canal IPC de ne pas maintenir la boucle d’événements du processus parent en cours d’exécution, et de la laisser se terminer même lorsque le canal est ouvert.

### `subprocess.connected` {#subprocessconnected}

**Ajouté dans : v0.7.2**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Définie sur `false` après l’appel de `subprocess.disconnect()`.

La propriété `subprocess.connected` indique s’il est toujours possible d’envoyer et de recevoir des messages d’un processus enfant. Lorsque `subprocess.connected` est `false`, il n’est plus possible d’envoyer ou de recevoir des messages.

### `subprocess.disconnect()` {#subprocessdisconnect}

**Ajouté dans : v0.7.2**

Ferme le canal IPC entre les processus parent et enfant, ce qui permet au processus enfant de se terminer correctement une fois qu’il n’y a plus d’autres connexions le maintenant en vie. Après avoir appelé cette méthode, les propriétés `subprocess.connected` et `process.connected` dans les processus parent et enfant (respectivement) seront définies sur `false`, et il ne sera plus possible de transmettre des messages entre les processus.

L’événement `'disconnect'` sera émis lorsqu’il n’y aura plus de messages en cours de réception. Cela sera le plus souvent déclenché immédiatement après l’appel de `subprocess.disconnect()`.

Lorsque le processus enfant est une instance Node.js (par exemple, générée à l’aide de [`child_process.fork()`](/fr/nodejs/api/child_process#child_processforkmodulepath-args-options)), la méthode `process.disconnect()` peut être invoquée dans le processus enfant pour fermer également le canal IPC.

### `subprocess.exitCode` {#subprocessexitcode}

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

La propriété `subprocess.exitCode` indique le code de sortie du processus enfant. Si le processus enfant est toujours en cours d’exécution, le champ sera `null`.

### `subprocess.kill([signal])` {#subprocesskillsignal}

**Ajouté dans : v0.1.90**

- `signal` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

La méthode `subprocess.kill()` envoie un signal au processus enfant. Si aucun argument n’est fourni, le signal `'SIGTERM'` est envoyé au processus. Voir [`signal(7)`](http://man7.org/linux/man-pages/man7/signal.7) pour une liste des signaux disponibles. Cette fonction renvoie `true` si [`kill(2)`](http://man7.org/linux/man-pages/man2/kill.2) réussit, et `false` sinon.

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const grep = spawn('grep', ['ssh']);

grep.on('close', (code, signal) => {
  console.log(
    `child process terminated due to receipt of signal ${signal}`);
});

// Send SIGHUP to process.
grep.kill('SIGHUP');
```

```js [ESM]
import { spawn } from 'node:child_process';
const grep = spawn('grep', ['ssh']);

grep.on('close', (code, signal) => {
  console.log(
    `child process terminated due to receipt of signal ${signal}`);
});

// Send SIGHUP to process.
grep.kill('SIGHUP');
```
:::

L’objet [`ChildProcess`](/fr/nodejs/api/child_process#class-childprocess) peut émettre un événement [`'error'`](/fr/nodejs/api/child_process#event-error) si le signal ne peut pas être distribué. L’envoi d’un signal à un processus enfant qui a déjà quitté n’est pas une erreur, mais peut avoir des conséquences imprévues. Plus précisément, si l’identifiant du processus (PID) a été réattribué à un autre processus, le signal sera distribué à ce processus à la place, ce qui peut avoir des résultats inattendus.

Bien que la fonction soit appelée `kill`, le signal distribué au processus enfant peut ne pas mettre fin au processus.

Voir [`kill(2)`](http://man7.org/linux/man-pages/man2/kill.2) pour référence.

Sous Windows, où les signaux POSIX n’existent pas, l’argument `signal` sera ignoré, sauf pour `'SIGKILL'`, `'SIGTERM'`, `'SIGINT'` et `'SIGQUIT'`, et le processus sera toujours arrêté de force et brutalement (similaire à `'SIGKILL'`). Voir [Signal Events](/fr/nodejs/api/process#signal-events) pour plus de détails.

Sous Linux, les processus enfants des processus enfants ne seront pas terminés lorsque vous tenterez de tuer leur parent. Cela risque de se produire lorsque vous exécutez un nouveau processus dans un shell ou avec l’utilisation de l’option `shell` de `ChildProcess` :

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');

const subprocess = spawn(
  'sh',
  [
    '-c',
    `node -e "setInterval(() => {
      console.log(process.pid, 'is alive')
    }, 500);"`,
  ], {
    stdio: ['inherit', 'inherit', 'inherit'],
  },
);

setTimeout(() => {
  subprocess.kill(); // Does not terminate the Node.js process in the shell.
}, 2000);
```

```js [ESM]
import { spawn } from 'node:child_process';

const subprocess = spawn(
  'sh',
  [
    '-c',
    `node -e "setInterval(() => {
      console.log(process.pid, 'is alive')
    }, 500);"`,
  ], {
    stdio: ['inherit', 'inherit', 'inherit'],
  },
);

setTimeout(() => {
  subprocess.kill(); // Does not terminate the Node.js process in the shell.
}, 2000);
```
:::


### `subprocess[Symbol.dispose]()` {#subprocesssymboldispose}

**Ajoutée dans: v20.5.0, v18.18.0**

::: warning [Stable: 1 - Expérimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stability: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

Appelle [`subprocess.kill()`](/fr/nodejs/api/child_process#subprocesskillsignal) avec `'SIGTERM'`.

### `subprocess.killed` {#subprocesskilled}

**Ajoutée dans: v0.5.10**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Défini sur `true` après que `subprocess.kill()` est utilisé pour envoyer avec succès un signal au processus enfant.

La propriété `subprocess.killed` indique si le processus enfant a bien reçu un signal de `subprocess.kill()`. La propriété `killed` n'indique pas que le processus enfant a été terminé.

### `subprocess.pid` {#subprocesspid}

**Ajoutée dans: v0.1.90**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Renvoie l'identifiant de processus (PID) du processus enfant. Si le processus enfant ne parvient pas à démarrer en raison d'erreurs, la valeur est `undefined` et `error` est émis.

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const grep = spawn('grep', ['ssh']);

console.log(`Spawned child pid: ${grep.pid}`);
grep.stdin.end();
```

```js [ESM]
import { spawn } from 'node:child_process';
const grep = spawn('grep', ['ssh']);

console.log(`Spawned child pid: ${grep.pid}`);
grep.stdin.end();
```
:::

### `subprocess.ref()` {#subprocessref}

**Ajoutée dans: v0.7.10**

Appeler `subprocess.ref()` après avoir appelé `subprocess.unref()` rétablira le nombre de références supprimées pour le processus enfant, forçant le processus parent à attendre que le processus enfant se termine avant de se terminer lui-même.

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const process = require('node:process');

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
subprocess.ref();
```

```js [ESM]
import { spawn } from 'node:child_process';
import process from 'node:process';

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
subprocess.ref();
```
:::


### `subprocess.send(message[, sendHandle[, options]][, callback])` {#subprocesssendmessage-sendhandle-options-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v5.8.0 | Le paramètre `options`, et l'option `keepOpen` en particulier, sont désormais pris en charge. |
| v5.0.0 | Cette méthode renvoie désormais un booléen pour le contrôle de flux. |
| v4.0.0 | Le paramètre `callback` est désormais pris en charge. |
| v0.5.9 | Ajouté dans : v0.5.9 |
:::

- `message` [\<Objet\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `sendHandle` [\<Handle\>](/fr/nodejs/api/net#serverlistenhandle-backlog-callback) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) `undefined`, ou un objet [`net.Socket`](/fr/nodejs/api/net#class-netsocket), [`net.Server`](/fr/nodejs/api/net#class-netserver), ou [`dgram.Socket`](/fr/nodejs/api/dgram#class-dgramsocket).
- `options` [\<Objet\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) L'argument `options`, s'il est présent, est un objet utilisé pour paramétrer l'envoi de certains types de handles. `options` prend en charge les propriétés suivantes :
    - `keepOpen` [\<booléen\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Une valeur qui peut être utilisée lors du passage d'instances de `net.Socket`. Lorsque `true`, le socket est maintenu ouvert dans le processus d'envoi. **Par défaut :** `false`.


- `callback` [\<Fonction\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retourne : [\<booléen\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Lorsqu'un canal IPC a été établi entre les processus parent et enfant (c'est-à-dire lors de l'utilisation de [`child_process.fork()`](/fr/nodejs/api/child_process#child_processforkmodulepath-args-options)), la méthode `subprocess.send()` peut être utilisée pour envoyer des messages au processus enfant. Lorsque le processus enfant est une instance Node.js, ces messages peuvent être reçus via l'événement [`'message'`](/fr/nodejs/api/process#event-message).

Le message passe par la sérialisation et l'analyse. Le message résultant peut ne pas être le même que celui qui est envoyé à l'origine.

Par exemple, dans le script parent :

::: code-group
```js [CJS]
const { fork } = require('node:child_process');
const forkedProcess = fork(`${__dirname}/sub.js`);

forkedProcess.on('message', (message) => {
  console.log('PARENT got message:', message);
});

// Causes the child to print: CHILD got message: { hello: 'world' }
forkedProcess.send({ hello: 'world' });
```

```js [ESM]
import { fork } from 'node:child_process';
const forkedProcess = fork(`${import.meta.dirname}/sub.js`);

forkedProcess.on('message', (message) => {
  console.log('PARENT got message:', message);
});

// Causes the child to print: CHILD got message: { hello: 'world' }
forkedProcess.send({ hello: 'world' });
```
:::

Et ensuite, le script enfant, `'sub.js'` pourrait ressembler à ceci :

```js [ESM]
process.on('message', (message) => {
  console.log('CHILD got message:', message);
});

// Causes the parent to print: PARENT got message: { foo: 'bar', baz: null }
process.send({ foo: 'bar', baz: NaN });
```
Les processus enfants Node.js auront une méthode [`process.send()`](/fr/nodejs/api/process#processsendmessage-sendhandle-options-callback) propre qui permet au processus enfant de renvoyer des messages au processus parent.

Il existe un cas particulier lors de l'envoi d'un message `{cmd: 'NODE_foo'}`. Les messages contenant un préfixe `NODE_` dans la propriété `cmd` sont réservés pour une utilisation dans le cœur de Node.js et ne seront pas émis dans l'événement [`'message'`](/fr/nodejs/api/process#event-message) de l'enfant. Au lieu de cela, ces messages sont émis à l'aide de l'événement `'internalMessage'` et sont consommés en interne par Node.js. Les applications doivent éviter d'utiliser de tels messages ou d'écouter les événements `'internalMessage'` car ils sont susceptibles d'être modifiés sans préavis.

L'argument facultatif `sendHandle` qui peut être passé à `subprocess.send()` sert à transmettre un serveur TCP ou un objet socket au processus enfant. Le processus enfant recevra l'objet comme deuxième argument passé à la fonction de rappel enregistrée sur l'événement [`'message'`](/fr/nodejs/api/process#event-message). Toutes les données reçues et mises en mémoire tampon dans le socket ne seront pas envoyées à l'enfant. L'envoi de sockets IPC n'est pas pris en charge sous Windows.

Le `callback` facultatif est une fonction qui est invoquée après l'envoi du message mais avant que le processus enfant ne l'ait reçu. La fonction est appelée avec un seul argument : `null` en cas de succès, ou un objet [`Error`](/fr/nodejs/api/errors#class-error) en cas d'échec.

Si aucune fonction `callback` n'est fournie et que le message ne peut pas être envoyé, un événement `'error'` sera émis par l'objet [`ChildProcess`](/fr/nodejs/api/child_process#class-childprocess). Cela peut se produire, par exemple, lorsque le processus enfant a déjà quitté.

`subprocess.send()` renverra `false` si le canal est fermé ou lorsque le backlog des messages non envoyés dépasse un seuil qui rend imprudent l'envoi de messages supplémentaires. Sinon, la méthode renvoie `true`. La fonction `callback` peut être utilisée pour implémenter le contrôle de flux.


#### Exemple : envoyer un objet serveur {#example-sending-a-server-object}

L’argument `sendHandle` peut être utilisé, par exemple, pour transmettre le handle d’un objet serveur TCP au processus enfant, comme illustré dans l’exemple ci-dessous :

::: code-group
```js [CJS]
const { fork } = require('node:child_process');
const { createServer } = require('node:net');

const subprocess = fork('subprocess.js');

// Open up the server object and send the handle.
const server = createServer();
server.on('connection', (socket) => {
  socket.end('handled by parent');
});
server.listen(1337, () => {
  subprocess.send('server', server);
});
```

```js [ESM]
import { fork } from 'node:child_process';
import { createServer } from 'node:net';

const subprocess = fork('subprocess.js');

// Open up the server object and send the handle.
const server = createServer();
server.on('connection', (socket) => {
  socket.end('handled by parent');
});
server.listen(1337, () => {
  subprocess.send('server', server);
});
```
:::

Le processus enfant recevrait alors l’objet serveur comme ceci :

```js [ESM]
process.on('message', (m, server) => {
  if (m === 'server') {
    server.on('connection', (socket) => {
      socket.end('handled by child');
    });
  }
});
```
Une fois que le serveur est partagé entre le parent et l’enfant, certaines connexions peuvent être gérées par le parent et d’autres par l’enfant.

Bien que l’exemple ci-dessus utilise un serveur créé à l’aide du module `node:net`, les serveurs de module `node:dgram` utilisent exactement le même workflow, à l’exception de l’écoute d’un événement `'message'` au lieu de `'connection'` et de l’utilisation de `server.bind()` au lieu de `server.listen()`. Ceci, cependant, n’est pris en charge que sur les plateformes Unix.

#### Exemple : envoyer un objet socket {#example-sending-a-socket-object}

De même, l’argument `sendHandler` peut être utilisé pour transmettre le handle d’un socket au processus enfant. L’exemple ci-dessous génère deux enfants qui gèrent chacun les connexions avec une priorité « normale » ou « spéciale » :

::: code-group
```js [CJS]
const { fork } = require('node:child_process');
const { createServer } = require('node:net');

const normal = fork('subprocess.js', ['normal']);
const special = fork('subprocess.js', ['special']);

// Open up the server and send sockets to child. Use pauseOnConnect to prevent
// the sockets from being read before they are sent to the child process.
const server = createServer({ pauseOnConnect: true });
server.on('connection', (socket) => {

  // If this is special priority...
  if (socket.remoteAddress === '74.125.127.100') {
    special.send('socket', socket);
    return;
  }
  // This is normal priority.
  normal.send('socket', socket);
});
server.listen(1337);
```

```js [ESM]
import { fork } from 'node:child_process';
import { createServer } from 'node:net';

const normal = fork('subprocess.js', ['normal']);
const special = fork('subprocess.js', ['special']);

// Open up the server and send sockets to child. Use pauseOnConnect to prevent
// the sockets from being read before they are sent to the child process.
const server = createServer({ pauseOnConnect: true });
server.on('connection', (socket) => {

  // If this is special priority...
  if (socket.remoteAddress === '74.125.127.100') {
    special.send('socket', socket);
    return;
  }
  // This is normal priority.
  normal.send('socket', socket);
});
server.listen(1337);
```
:::

`subprocess.js` recevrait le handle du socket comme deuxième argument passé à la fonction de rappel d’événement :

```js [ESM]
process.on('message', (m, socket) => {
  if (m === 'socket') {
    if (socket) {
      // Check that the client socket exists.
      // It is possible for the socket to be closed between the time it is
      // sent and the time it is received in the child process.
      socket.end(`Request handled with ${process.argv[2]} priority`);
    }
  }
});
```
N’utilisez pas `.maxConnections` sur un socket qui a été transmis à un sous-processus. Le parent ne peut pas suivre la destruction du socket.

Tous les gestionnaires `'message'` du sous-processus doivent vérifier que `socket` existe, car la connexion peut avoir été fermée pendant le temps nécessaire pour envoyer la connexion à l’enfant.


### `subprocess.signalCode` {#subprocesssignalcode}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

La propriété `subprocess.signalCode` indique le signal reçu par le processus enfant, le cas échéant, sinon `null`.

### `subprocess.spawnargs` {#subprocessspawnargs}

- [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

La propriété `subprocess.spawnargs` représente la liste complète des arguments de ligne de commande avec lesquels le processus enfant a été lancé.

### `subprocess.spawnfile` {#subprocessspawnfile}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La propriété `subprocess.spawnfile` indique le nom du fichier exécutable du processus enfant qui est lancé.

Pour [`child_process.fork()`](/fr/nodejs/api/child_process#child_processforkmodulepath-args-options), sa valeur sera égale à [`process.execPath`](/fr/nodejs/api/process#processexecpath). Pour [`child_process.spawn()`](/fr/nodejs/api/child_process#child_processspawncommand-args-options), sa valeur sera le nom du fichier exécutable. Pour [`child_process.exec()`](/fr/nodejs/api/child_process#child_processexeccommand-options-callback), sa valeur sera le nom du shell dans lequel le processus enfant est lancé.

### `subprocess.stderr` {#subprocessstderr}

**Ajouté dans : v0.1.90**

- [\<stream.Readable\>](/fr/nodejs/api/stream#class-streamreadable) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Un `Readable Stream` qui représente le `stderr` du processus enfant.

Si le processus enfant a été lancé avec `stdio[2]` défini sur autre chose que `'pipe'`, alors ce sera `null`.

`subprocess.stderr` est un alias pour `subprocess.stdio[2]`. Les deux propriétés feront référence à la même valeur.

La propriété `subprocess.stderr` peut être `null` ou `undefined` si le processus enfant n'a pas pu être lancé avec succès.


### `subprocess.stdin` {#subprocessstdin}

**Ajouté dans : v0.1.90**

- [\<stream.Writable\>](/fr/nodejs/api/stream#class-streamwritable) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Un `Writable Stream` qui représente le `stdin` du processus enfant.

Si un processus enfant attend de lire toute son entrée, il ne continuera pas tant que ce flux n'aura pas été fermé via `end()`.

Si le processus enfant a été créé avec `stdio[0]` défini sur autre chose que `'pipe'`, alors ce sera `null`.

`subprocess.stdin` est un alias pour `subprocess.stdio[0]`. Les deux propriétés feront référence à la même valeur.

La propriété `subprocess.stdin` peut être `null` ou `undefined` si le processus enfant n'a pas pu être créé avec succès.

### `subprocess.stdio` {#subprocessstdio}

**Ajouté dans : v0.7.10**

- [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

Un tableau creux de pipes vers le processus enfant, correspondant aux positions de l'option [`stdio`](/fr/nodejs/api/child_process#optionsstdio) passée à [`child_process.spawn()`](/fr/nodejs/api/child_process#child_processspawncommand-args-options) qui ont été définies sur la valeur `'pipe'`. `subprocess.stdio[0]`, `subprocess.stdio[1]` et `subprocess.stdio[2]` sont également disponibles respectivement sous les noms `subprocess.stdin`, `subprocess.stdout` et `subprocess.stderr`.

Dans l'exemple suivant, seul le fd `1` (stdout) de l'enfant est configuré comme un pipe, donc seul le `subprocess.stdio[1]` du parent est un flux, toutes les autres valeurs dans le tableau sont `null`.

::: code-group
```js [CJS]
const assert = require('node:assert');
const fs = require('node:fs');
const child_process = require('node:child_process');

const subprocess = child_process.spawn('ls', {
  stdio: [
    0, // Use parent's stdin for child.
    'pipe', // Pipe child's stdout to parent.
    fs.openSync('err.out', 'w'), // Direct child's stderr to a file.
  ],
});

assert.strictEqual(subprocess.stdio[0], null);
assert.strictEqual(subprocess.stdio[0], subprocess.stdin);

assert(subprocess.stdout);
assert.strictEqual(subprocess.stdio[1], subprocess.stdout);

assert.strictEqual(subprocess.stdio[2], null);
assert.strictEqual(subprocess.stdio[2], subprocess.stderr);
```

```js [ESM]
import assert from 'node:assert';
import fs from 'node:fs';
import child_process from 'node:child_process';

const subprocess = child_process.spawn('ls', {
  stdio: [
    0, // Use parent's stdin for child.
    'pipe', // Pipe child's stdout to parent.
    fs.openSync('err.out', 'w'), // Direct child's stderr to a file.
  ],
});

assert.strictEqual(subprocess.stdio[0], null);
assert.strictEqual(subprocess.stdio[0], subprocess.stdin);

assert(subprocess.stdout);
assert.strictEqual(subprocess.stdio[1], subprocess.stdout);

assert.strictEqual(subprocess.stdio[2], null);
assert.strictEqual(subprocess.stdio[2], subprocess.stderr);
```
:::

La propriété `subprocess.stdio` peut être `undefined` si le processus enfant n'a pas pu être créé avec succès.


### `subprocess.stdout` {#subprocessstdout}

**Ajouté dans : v0.1.90**

- [\<stream.Readable\>](/fr/nodejs/api/stream#class-streamreadable) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Un `Readable Stream` qui représente le `stdout` du processus enfant.

Si le processus enfant a été lancé avec `stdio[1]` défini sur autre chose que `'pipe'`, alors ce sera `null`.

`subprocess.stdout` est un alias de `subprocess.stdio[1]`. Les deux propriétés feront référence à la même valeur.

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');

const subprocess = spawn('ls');

subprocess.stdout.on('data', (data) => {
  console.log(`Received chunk ${data}`);
});
```

```js [ESM]
import { spawn } from 'node:child_process';

const subprocess = spawn('ls');

subprocess.stdout.on('data', (data) => {
  console.log(`Received chunk ${data}`);
});
```
:::

La propriété `subprocess.stdout` peut être `null` ou `undefined` si le processus enfant n'a pas pu être lancé avec succès.

### `subprocess.unref()` {#subprocessunref}

**Ajouté dans : v0.7.10**

Par défaut, le processus parent attendra que le processus enfant détaché se termine. Pour empêcher le processus parent d'attendre qu'un `subprocess` donné se termine, utilisez la méthode `subprocess.unref()`. Cela aura pour effet que la boucle d'événements du parent n'inclura pas le processus enfant dans son nombre de références, ce qui permettra au parent de se terminer indépendamment de l'enfant, à moins qu'un canal IPC ne soit établi entre les processus enfant et parent.

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const process = require('node:process');

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
```

```js [ESM]
import { spawn } from 'node:child_process';
import process from 'node:process';

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
```
:::


## `maxBuffer` et Unicode {#maxbuffer-and-unicode}

L'option `maxBuffer` spécifie le nombre maximal d'octets autorisés sur `stdout` ou `stderr`. Si cette valeur est dépassée, le processus enfant est terminé. Cela a un impact sur la sortie qui inclut des encodages de caractères multi-octets tels que UTF-8 ou UTF-16. Par exemple, `console.log('中文测试')` enverra 13 octets encodés en UTF-8 à `stdout` bien qu'il n'y ait que 4 caractères.

## Exigences du Shell {#shell-requirements}

Le shell doit comprendre l'option `-c`. Si le shell est `'cmd.exe'`, il doit comprendre les options `/d /s /c` et l'analyse de la ligne de commande doit être compatible.

## Shell Windows par défaut {#default-windows-shell}

Bien que Microsoft spécifie que `%COMSPEC%` doit contenir le chemin vers `'cmd.exe'` dans l'environnement racine, les processus enfants ne sont pas toujours soumis à la même exigence. Ainsi, dans les fonctions `child_process` où un shell peut être lancé, `'cmd.exe'` est utilisé comme solution de repli si `process.env.ComSpec` n'est pas disponible.

## Sérialisation Avancée {#advanced-serialization}

**Ajouté dans : v13.2.0, v12.16.0**

Les processus enfants prennent en charge un mécanisme de sérialisation pour IPC qui est basé sur l'[API de sérialisation du module `node:v8`](/fr/nodejs/api/v8#serialization-api), basé sur l'[algorithme de clonage structuré HTML](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm). Ceci est généralement plus puissant et prend en charge plus de types d'objets JavaScript intégrés, tels que `BigInt`, `Map` et `Set`, `ArrayBuffer` et `TypedArray`, `Buffer`, `Error`, `RegExp` etc.

Cependant, ce format n'est pas un surensemble complet de JSON, et par exemple, les propriétés définies sur les objets de ces types intégrés ne seront pas transmises par l'étape de sérialisation. De plus, les performances peuvent ne pas être équivalentes à celles de JSON, en fonction de la structure des données transmises. Par conséquent, cette fonctionnalité nécessite une activation en définissant l'option `serialization` sur `'advanced'` lors de l'appel de [`child_process.spawn()`](/fr/nodejs/api/child_process#child_processspawncommand-args-options) ou [`child_process.fork()`](/fr/nodejs/api/child_process#child_processforkmodulepath-args-options).

