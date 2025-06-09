---
title: Documentation du module OS de Node.js
description: Le module OS de Node.js fournit plusieurs méthodes utilitaires liées au système d'exploitation. Il peut être utilisé pour interagir avec le système d'exploitation sous-jacent, récupérer des informations sur le système et effectuer des opérations au niveau du système.
head:
  - - meta
    - name: og:title
      content: Documentation du module OS de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Le module OS de Node.js fournit plusieurs méthodes utilitaires liées au système d'exploitation. Il peut être utilisé pour interagir avec le système d'exploitation sous-jacent, récupérer des informations sur le système et effectuer des opérations au niveau du système.
  - - meta
    - name: twitter:title
      content: Documentation du module OS de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Le module OS de Node.js fournit plusieurs méthodes utilitaires liées au système d'exploitation. Il peut être utilisé pour interagir avec le système d'exploitation sous-jacent, récupérer des informations sur le système et effectuer des opérations au niveau du système.
---


# OS {#os}

::: tip [Stable: 2 - Stable]
[Stable: 2](/fr/nodejs/api/documentation#stability-index) [Stability: 2](/fr/nodejs/api/documentation#stability-index) - Stable
:::

**Code source:** [lib/os.js](https://github.com/nodejs/node/blob/v23.5.0/lib/os.js)

Le module `node:os` fournit des méthodes et des propriétés utilitaires liées au système d'exploitation. Il est accessible en utilisant :

::: code-group
```js [ESM]
import os from 'node:os';
```

```js [CJS]
const os = require('node:os');
```
:::

## `os.EOL` {#oseol}

**Ajouté dans: v0.7.8**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Le marqueur de fin de ligne spécifique au système d'exploitation.

- `\n` sur POSIX
- `\r\n` sur Windows

## `os.availableParallelism()` {#osavailableparallelism}

**Ajouté dans: v19.4.0, v18.14.0**

- Retourne: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Retourne une estimation de la quantité par défaut de parallélisme qu'un programme devrait utiliser. Retourne toujours une valeur supérieure à zéro.

Cette fonction est un petit wrapper autour de [`uv_available_parallelism()`](https://docs.libuv.org/en/v1.x/misc#c.uv_available_parallelism) de libuv.

## `os.arch()` {#osarch}

**Ajouté dans: v0.5.0**

- Retourne: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retourne l'architecture CPU du système d'exploitation pour laquelle le binaire Node.js a été compilé. Les valeurs possibles sont `'arm'`, `'arm64'`, `'ia32'`, `'loong64'`, `'mips'`, `'mipsel'`, `'ppc'`, `'ppc64'`, `'riscv64'`, `'s390'`, `'s390x'` et `'x64'`.

La valeur de retour est équivalente à [`process.arch`](/fr/nodejs/api/process#processarch).

## `os.constants` {#osconstants}

**Ajouté dans: v6.3.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Contient des constantes spécifiques au système d'exploitation couramment utilisées pour les codes d'erreur, les signaux de processus, etc. Les constantes spécifiques définies sont décrites dans [Constantes OS](/fr/nodejs/api/os#os-constants).

## `os.cpus()` {#oscpus}

**Ajouté dans: v0.3.3**

- Retourne: [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Retourne un tableau d'objets contenant des informations sur chaque cœur de CPU logique. Le tableau sera vide si aucune information CPU n'est disponible, par exemple si le système de fichiers `/proc` n'est pas disponible.

Les propriétés incluses dans chaque objet incluent :

- `model` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `speed` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) (en MHz)
- `times` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `user` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre de millisecondes que le CPU a passé en mode utilisateur.
    - `nice` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre de millisecondes que le CPU a passé en mode nice.
    - `sys` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre de millisecondes que le CPU a passé en mode sys.
    - `idle` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre de millisecondes que le CPU a passé en mode idle.
    - `irq` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre de millisecondes que le CPU a passé en mode irq.

```js [ESM]
[
  {
    model: 'Intel(R) Core(TM) i7 CPU         860  @ 2.80GHz',
    speed: 2926,
    times: {
      user: 252020,
      nice: 0,
      sys: 30340,
      idle: 1070356870,
      irq: 0,
    },
  },
  {
    model: 'Intel(R) Core(TM) i7 CPU         860  @ 2.80GHz',
    speed: 2926,
    times: {
      user: 306960,
      nice: 0,
      sys: 26980,
      idle: 1071569080,
      irq: 0,
    },
  },
  {
    model: 'Intel(R) Core(TM) i7 CPU         860  @ 2.80GHz',
    speed: 2926,
    times: {
      user: 248450,
      nice: 0,
      sys: 21750,
      idle: 1070919370,
      irq: 0,
    },
  },
  {
    model: 'Intel(R) Core(TM) i7 CPU         860  @ 2.80GHz',
    speed: 2926,
    times: {
      user: 256880,
      nice: 0,
      sys: 19430,
      idle: 1070905480,
      irq: 20,
    },
  },
]
```

Les valeurs `nice` sont spécifiques à POSIX. Sur Windows, les valeurs `nice` de tous les processeurs sont toujours 0.

`os.cpus().length` ne doit pas être utilisé pour calculer la quantité de parallélisme disponible pour une application. Utilisez [`os.availableParallelism()`](/fr/nodejs/api/os#osavailableparallelism) à cet effet.


## `os.devNull` {#osdevnull}

**Ajouté dans : v16.3.0, v14.18.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Le chemin de fichier spécifique à la plateforme du périphérique null.

- `\\.\nul` sous Windows
- `/dev/null` sous POSIX

## `os.endianness()` {#osendianness}

**Ajouté dans : v0.9.4**

- Retourne : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Renvoie une chaîne identifiant l’endianness du CPU pour lequel le binaire Node.js a été compilé.

Les valeurs possibles sont `'BE'` pour big endian et `'LE'` pour little endian.

## `os.freemem()` {#osfreemem}

**Ajouté dans : v0.3.3**

- Retourne : [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Retourne la quantité de mémoire système libre en octets sous forme d’entier.

## `os.getPriority([pid])` {#osgetprioritypid}

**Ajouté dans : v10.10.0**

- `pid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L’ID du processus pour lequel récupérer la priorité de planification. **Par défaut :** `0`.
- Retourne : [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Retourne la priorité de planification pour le processus spécifié par `pid`. Si `pid` n’est pas fourni ou est `0`, la priorité du processus actuel est retournée.

## `os.homedir()` {#oshomedir}

**Ajouté dans : v2.3.0**

- Retourne : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retourne le chemin d’accès sous forme de chaîne du répertoire personnel de l’utilisateur actuel.

Sous POSIX, il utilise la variable d’environnement `$HOME` si elle est définie. Sinon, il utilise l’[UID effectif](https://en.wikipedia.org/wiki/User_identifier#Effective_user_ID) pour rechercher le répertoire personnel de l’utilisateur.

Sous Windows, il utilise la variable d’environnement `USERPROFILE` si elle est définie. Sinon, il utilise le chemin d’accès au répertoire de profil de l’utilisateur actuel.

## `os.hostname()` {#oshostname}

**Ajouté dans : v0.3.3**

- Retourne : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retourne le nom d’hôte du système d’exploitation sous forme de chaîne.


## `os.loadavg()` {#osloadavg}

**Ajoutée dans : v0.3.3**

- Retourne : [\<number[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Retourne un tableau contenant les moyennes de charge sur 1, 5 et 15 minutes.

La moyenne de charge est une mesure de l’activité du système calculée par le système d’exploitation et exprimée sous forme de nombre fractionnaire.

La moyenne de charge est un concept spécifique à Unix. Sous Windows, la valeur de retour est toujours `[0, 0, 0]`.

## `os.machine()` {#osmachine}

**Ajoutée dans : v18.9.0, v16.18.0**

- Retourne : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retourne le type de machine sous forme de chaîne de caractères, par exemple : `arm`, `arm64`, `aarch64`, `mips`, `mips64`, `ppc64`, `ppc64le`, `s390`, `s390x`, `i386`, `i686`, `x86_64`.

Sur les systèmes POSIX, le type de machine est déterminé en appelant [`uname(3)`](https://linux.die.net/man/3/uname). Sous Windows, `RtlGetVersion()` est utilisé, et s’il n’est pas disponible, `GetVersionExW()` sera utilisé. Consultez [https://en.wikipedia.org/wiki/Uname#Examples](https://en.wikipedia.org/wiki/Uname#Examples) pour plus d’informations.

## `os.networkInterfaces()` {#osnetworkinterfaces}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.4.0 | La propriété `family` renvoie désormais une chaîne de caractères au lieu d’un nombre. |
| v18.0.0 | La propriété `family` renvoie désormais un nombre au lieu d’une chaîne de caractères. |
| v0.6.0 | Ajoutée dans : v0.6.0 |
:::

- Retourne : [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Retourne un objet contenant les interfaces réseau auxquelles une adresse réseau a été attribuée.

Chaque clé de l’objet retourné identifie une interface réseau. La valeur associée est un tableau d’objets décrivant chacun une adresse réseau attribuée.

Les propriétés disponibles sur l’objet adresse réseau attribuée comprennent :

- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L’adresse IPv4 ou IPv6 attribuée
- `netmask` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le masque de réseau IPv4 ou IPv6
- `family` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Soit `IPv4`, soit `IPv6`
- `mac` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L’adresse MAC de l’interface réseau
- `internal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` si l’interface réseau est une interface de bouclage ou une interface similaire qui n’est pas accessible à distance ; sinon, `false`
- `scopeid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L’ID de portée IPv6 numérique (spécifié uniquement lorsque `family` est `IPv6`)
- `cidr` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L’adresse IPv4 ou IPv6 attribuée avec le préfixe de routage en notation CIDR. Si le `netmask` n’est pas valide, cette propriété est définie sur `null`.

```js [ESM]
{
  lo: [
    {
      address: '127.0.0.1',
      netmask: '255.0.0.0',
      family: 'IPv4',
      mac: '00:00:00:00:00:00',
      internal: true,
      cidr: '127.0.0.1/8'
    },
    {
      address: '::1',
      netmask: 'ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff',
      family: 'IPv6',
      mac: '00:00:00:00:00:00',
      scopeid: 0,
      internal: true,
      cidr: '::1/128'
    }
  ],
  eth0: [
    {
      address: '192.168.1.108',
      netmask: '255.255.255.0',
      family: 'IPv4',
      mac: '01:02:03:0a:0b:0c',
      internal: false,
      cidr: '192.168.1.108/24'
    },
    {
      address: 'fe80::a00:27ff:fe4e:66a1',
      netmask: 'ffff:ffff:ffff:ffff::',
      family: 'IPv6',
      mac: '01:02:03:0a:0b:0c',
      scopeid: 1,
      internal: false,
      cidr: 'fe80::a00:27ff:fe4e:66a1/64'
    }
  ]
}
```

## `os.platform()` {#osplatform}

**Ajouté dans : v0.5.0**

- Retourne : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Renvoie une chaîne identifiant la plateforme du système d'exploitation pour laquelle le binaire Node.js a été compilé. La valeur est définie au moment de la compilation. Les valeurs possibles sont `'aix'`, `'darwin'`, `'freebsd'`, `'linux'`, `'openbsd'`, `'sunos'` et `'win32'`.

La valeur de retour est équivalente à [`process.platform`](/fr/nodejs/api/process#processplatform).

La valeur `'android'` peut également être renvoyée si Node.js est construit sur le système d'exploitation Android. [La prise en charge d'Android est expérimentale](https://github.com/nodejs/node/blob/HEAD/BUILDING.md#android).

## `os.release()` {#osrelease}

**Ajouté dans : v0.3.3**

- Retourne : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Renvoie le système d'exploitation sous forme de chaîne.

Sur les systèmes POSIX, la version du système d'exploitation est déterminée en appelant [`uname(3)`](https://linux.die.net/man/3/uname). Sur Windows, `GetVersionExW()` est utilisé. Voir [https://en.wikipedia.org/wiki/Uname#Examples](https://en.wikipedia.org/wiki/Uname#Examples) pour plus d'informations.

## `os.setPriority([pid, ]priority)` {#ossetprioritypid-priority}

**Ajouté dans : v10.10.0**

- `pid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'ID du processus pour lequel définir la priorité de planification. **Par défaut :** `0`.
- `priority` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La priorité de planification à attribuer au processus.

Tente de définir la priorité de planification pour le processus spécifié par `pid`. Si `pid` n'est pas fourni ou vaut `0`, l'ID de processus du processus actuel est utilisé.

L'entrée `priority` doit être un entier compris entre `-20` (haute priorité) et `19` (basse priorité). En raison des différences entre les niveaux de priorité Unix et les classes de priorité Windows, `priority` est mappé à l'une des six constantes de priorité dans `os.constants.priority`. Lors de la récupération d'un niveau de priorité de processus, ce mappage de plage peut entraîner une légère différence de la valeur renvoyée sur Windows. Pour éviter toute confusion, définissez `priority` sur l'une des constantes de priorité.

Sur Windows, la définition de la priorité sur `PRIORITY_HIGHEST` nécessite des privilèges utilisateur élevés. Sinon, la priorité définie sera réduite silencieusement à `PRIORITY_HIGH`.


## `os.tmpdir()` {#ostmpdir}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v2.0.0 | Cette fonction est désormais cohérente entre les plateformes et ne renvoie plus un chemin avec une barre oblique de fin sur aucune plateforme. |
| v0.9.9 | Ajoutée dans : v0.9.9 |
:::

- Retourne : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Renvoie le répertoire par défaut du système d'exploitation pour les fichiers temporaires sous forme de chaîne de caractères.

Sous Windows, le résultat peut être remplacé par les variables d'environnement `TEMP` et `TMP`, et `TEMP` est prioritaire sur `TMP`. Si aucune n'est définie, la valeur par défaut est `%SystemRoot%\temp` ou `%windir%\temp`.

Sur les plateformes non-Windows, les variables d'environnement `TMPDIR`, `TMP` et `TEMP` seront vérifiées pour remplacer le résultat de cette méthode, dans l'ordre décrit. Si aucune d'entre elles n'est définie, la valeur par défaut est `/tmp`.

Certaines distributions de système d'exploitation peuvent configurer `TMPDIR` (non-Windows) ou `TEMP` et `TMP` (Windows) par défaut sans configurations supplémentaires par les administrateurs système. Le résultat de `os.tmpdir()` reflète généralement la préférence du système, sauf s'il est explicitement remplacé par les utilisateurs.

## `os.totalmem()` {#ostotalmem}

**Ajoutée dans : v0.3.3**

- Retourne : [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Retourne la quantité totale de mémoire système en octets sous forme d'entier.

## `os.type()` {#ostype}

**Ajoutée dans : v0.3.3**

- Retourne : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retourne le nom du système d'exploitation tel qu'il est renvoyé par [`uname(3)`](https://linux.die.net/man/3/uname). Par exemple, il retourne `'Linux'` sous Linux, `'Darwin'` sous macOS et `'Windows_NT'` sous Windows.

Consultez [https://en.wikipedia.org/wiki/Uname#Examples](https://en.wikipedia.org/wiki/Uname#Examples) pour plus d'informations sur la sortie de l'exécution de [`uname(3)`](https://linux.die.net/man/3/uname) sur divers systèmes d'exploitation.

## `os.uptime()` {#osuptime}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.0.0 | Le résultat de cette fonction ne contient plus de composante fractionnaire sous Windows. |
| v0.3.3 | Ajoutée dans : v0.3.3 |
:::

- Retourne : [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Retourne la durée de fonctionnement du système en nombre de secondes.


## `os.userInfo([options])` {#osuserinfooptions}

**Ajouté dans : v6.0.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Encodage de caractères utilisé pour interpréter les chaînes résultantes. Si `encoding` est défini sur `'buffer'`, les valeurs `username`, `shell` et `homedir` seront des instances `Buffer`. **Par défaut :** `'utf8'`.


- Retourne : [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Retourne des informations sur l’utilisateur actuellement actif. Sur les plateformes POSIX, il s’agit généralement d’un sous-ensemble du fichier de mots de passe. L’objet retourné comprend `username`, `uid`, `gid`, `shell` et `homedir`. Sous Windows, les champs `uid` et `gid` sont `-1` et `shell` est `null`.

La valeur de `homedir` retournée par `os.userInfo()` est fournie par le système d’exploitation. Elle diffère du résultat de `os.homedir()`, qui interroge les variables d’environnement pour le répertoire personnel avant de revenir à la réponse du système d’exploitation.

Lève une exception [`SystemError`](/fr/nodejs/api/errors#class-systemerror) si un utilisateur n’a pas de `username` ou de `homedir`.

## `os.version()` {#osversion}

**Ajouté dans : v13.11.0, v12.17.0**

- Retourne : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retourne une chaîne identifiant la version du noyau.

Sur les systèmes POSIX, la version du système d’exploitation est déterminée en appelant [`uname(3)`](https://linux.die.net/man/3/uname). Sous Windows, `RtlGetVersion()` est utilisé et, s’il n’est pas disponible, `GetVersionExW()` sera utilisé. Voir [https://en.wikipedia.org/wiki/Uname#Examples](https://en.wikipedia.org/wiki/Uname#Examples) pour plus d’informations.

## Constantes OS {#os-constants}

Les constantes suivantes sont exportées par `os.constants`.

Toutes les constantes ne seront pas disponibles sur tous les systèmes d’exploitation.

### Constantes de signal {#signal-constants}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v5.11.0 | Ajout du support pour `SIGINFO`. |
:::

Les constantes de signal suivantes sont exportées par `os.constants.signals`.

| Constante | Description |
| --- | --- |
| `SIGHUP` | Envoyé pour indiquer qu’un terminal de contrôle est fermé ou qu’un processus parent s’arrête. |
| `SIGINT` | Envoyé pour indiquer qu’un utilisateur souhaite interrompre un processus (+). |
| `SIGQUIT` | Envoyé pour indiquer qu’un utilisateur souhaite terminer un processus et effectuer un vidage de mémoire. |
| `SIGILL` | Envoyé à un processus pour lui notifier qu’il a tenté d’exécuter une instruction illégale, mal formée, inconnue ou privilégiée. |
| `SIGTRAP` | Envoyé à un processus lorsqu’une exception s’est produite. |
| `SIGABRT` | Envoyé à un processus pour lui demander de s’interrompre. |
| `SIGIOT` | Synonyme de `SIGABRT` |
| `SIGBUS` | Envoyé à un processus pour lui notifier qu’il a causé une erreur de bus. |
| `SIGFPE` | Envoyé à un processus pour lui notifier qu’il a effectué une opération arithmétique illégale. |
| `SIGKILL` | Envoyé à un processus pour le terminer immédiatement. |
| `SIGUSR1` `SIGUSR2` | Envoyé à un processus pour identifier les conditions définies par l’utilisateur. |
| `SIGSEGV` | Envoyé à un processus pour lui notifier une erreur de segmentation. |
| `SIGPIPE` | Envoyé à un processus lorsqu’il a tenté d’écrire dans un tube déconnecté. |
| `SIGALRM` | Envoyé à un processus lorsqu’une minuterie système s’est écoulée. |
| `SIGTERM` | Envoyé à un processus pour demander la fin. |
| `SIGCHLD` | Envoyé à un processus lorsqu’un processus enfant se termine. |
| `SIGSTKFLT` | Envoyé à un processus pour indiquer une erreur de pile sur un coprocesseur. |
| `SIGCONT` | Envoyé pour demander au système d’exploitation de continuer un processus mis en pause. |
| `SIGSTOP` | Envoyé pour demander au système d’exploitation d’arrêter un processus. |
| `SIGTSTP` | Envoyé à un processus pour lui demander de s’arrêter. |
| `SIGBREAK` | Envoyé pour indiquer qu’un utilisateur souhaite interrompre un processus. |
| `SIGTTIN` | Envoyé à un processus lorsqu’il lit à partir du TTY en arrière-plan. |
| `SIGTTOU` | Envoyé à un processus lorsqu’il écrit dans le TTY en arrière-plan. |
| `SIGURG` | Envoyé à un processus lorsqu’un socket a des données urgentes à lire. |
| `SIGXCPU` | Envoyé à un processus lorsqu’il a dépassé sa limite d’utilisation du CPU. |
| `SIGXFSZ` | Envoyé à un processus lorsqu’il agrandit un fichier au-delà du maximum autorisé. |
| `SIGVTALRM` | Envoyé à un processus lorsqu’une minuterie virtuelle s’est écoulée. |
| `SIGPROF` | Envoyé à un processus lorsqu’une minuterie système s’est écoulée. |
| `SIGWINCH` | Envoyé à un processus lorsque le terminal de contrôle a changé de taille. |
| `SIGIO` | Envoyé à un processus lorsque l’E/S est disponible. |
| `SIGPOLL` | Synonyme de `SIGIO` |
| `SIGLOST` | Envoyé à un processus lorsqu’un verrouillage de fichier a été perdu. |
| `SIGPWR` | Envoyé à un processus pour lui notifier une panne de courant. |
| `SIGINFO` | Synonyme de `SIGPWR` |
| `SIGSYS` | Envoyé à un processus pour lui notifier un argument incorrect. |
| `SIGUNUSED` | Synonyme de `SIGSYS` |


### Constantes d'erreur {#error-constants}

Les constantes d'erreur suivantes sont exportées par `os.constants.errno`.

#### Constantes d'erreur POSIX {#posix-error-constants}

| Constante | Description |
| --- | --- |
| `E2BIG` | Indique que la liste des arguments est plus longue que prévu. |
| `EACCES` | Indique que l'opération n'avait pas les autorisations suffisantes. |
| `EADDRINUSE` | Indique que l'adresse réseau est déjà utilisée. |
| `EADDRNOTAVAIL` | Indique que l'adresse réseau n'est actuellement pas disponible pour utilisation. |
| `EAFNOSUPPORT` | Indique que la famille d'adresses réseau n'est pas prise en charge. |
| `EAGAIN` | Indique qu'il n'y a pas de données disponibles et qu'il faut réessayer l'opération plus tard. |
| `EALREADY` | Indique que le socket a déjà une connexion en attente en cours. |
| `EBADF` | Indique qu'un descripteur de fichier n'est pas valide. |
| `EBADMSG` | Indique un message de données non valide. |
| `EBUSY` | Indique qu'un appareil ou une ressource est occupé. |
| `ECANCELED` | Indique qu'une opération a été annulée. |
| `ECHILD` | Indique qu'il n'y a pas de processus enfants. |
| `ECONNABORTED` | Indique que la connexion réseau a été abandonnée. |
| `ECONNREFUSED` | Indique que la connexion réseau a été refusée. |
| `ECONNRESET` | Indique que la connexion réseau a été réinitialisée. |
| `EDEADLK` | Indique qu'un interblocage de ressources a été évité. |
| `EDESTADDRREQ` | Indique qu'une adresse de destination est requise. |
| `EDOM` | Indique qu'un argument est hors du domaine de la fonction. |
| `EDQUOT` | Indique que le quota de disque a été dépassé. |
| `EEXIST` | Indique que le fichier existe déjà. |
| `EFAULT` | Indique une adresse de pointeur non valide. |
| `EFBIG` | Indique que le fichier est trop grand. |
| `EHOSTUNREACH` | Indique que l'hôte est inaccessible. |
| `EIDRM` | Indique que l'identifiant a été supprimé. |
| `EILSEQ` | Indique une séquence d'octets illégale. |
| `EINPROGRESS` | Indique qu'une opération est déjà en cours. |
| `EINTR` | Indique qu'un appel de fonction a été interrompu. |
| `EINVAL` | Indique qu'un argument non valide a été fourni. |
| `EIO` | Indique une erreur d'E/S non spécifiée par ailleurs. |
| `EISCONN` | Indique que le socket est connecté. |
| `EISDIR` | Indique que le chemin est un répertoire. |
| `ELOOP` | Indique un nombre excessif de niveaux de liens symboliques dans un chemin. |
| `EMFILE` | Indique qu'il y a trop de fichiers ouverts. |
| `EMLINK` | Indique qu'il y a trop de liens physiques vers un fichier. |
| `EMSGSIZE` | Indique que le message fourni est trop long. |
| `EMULTIHOP` | Indique qu'un multihop a été tenté. |
| `ENAMETOOLONG` | Indique que le nom de fichier est trop long. |
| `ENETDOWN` | Indique que le réseau est hors service. |
| `ENETRESET` | Indique que la connexion a été abandonnée par le réseau. |
| `ENETUNREACH` | Indique que le réseau est inaccessible. |
| `ENFILE` | Indique qu'il y a trop de fichiers ouverts dans le système. |
| `ENOBUFS` | Indique qu'il n'y a pas d'espace tampon disponible. |
| `ENODATA` | Indique qu'aucun message n'est disponible dans la file d'attente de lecture de la tête de flux. |
| `ENODEV` | Indique qu'il n'y a pas de périphérique de ce type. |
| `ENOENT` | Indique qu'il n'y a pas de fichier ou de répertoire de ce type. |
| `ENOEXEC` | Indique une erreur de format d'exécution. |
| `ENOLCK` | Indique qu'il n'y a pas de verrous disponibles. |
| `ENOLINK` | Indique qu'un lien a été rompu. |
| `ENOMEM` | Indique qu'il n'y a pas assez d'espace. |
| `ENOMSG` | Indique qu'il n'y a pas de message du type souhaité. |
| `ENOPROTOOPT` | Indique qu'un protocole donné n'est pas disponible. |
| `ENOSPC` | Indique qu'il n'y a pas d'espace disponible sur le périphérique. |
| `ENOSR` | Indique qu'il n'y a pas de ressources de flux disponibles. |
| `ENOSTR` | Indique qu'une ressource donnée n'est pas un flux. |
| `ENOSYS` | Indique qu'une fonction n'a pas été implémentée. |
| `ENOTCONN` | Indique que le socket n'est pas connecté. |
| `ENOTDIR` | Indique que le chemin n'est pas un répertoire. |
| `ENOTEMPTY` | Indique que le répertoire n'est pas vide. |
| `ENOTSOCK` | Indique que l'élément donné n'est pas un socket. |
| `ENOTSUP` | Indique qu'une opération donnée n'est pas prise en charge. |
| `ENOTTY` | Indique une opération de contrôle d'E/S inappropriée. |
| `ENXIO` | Indique qu'il n'y a pas de périphérique ou d'adresse de ce type. |
| `EOPNOTSUPP` | Indique qu'une opération n'est pas prise en charge sur le socket. Bien que `ENOTSUP` et `EOPNOTSUPP` aient la même valeur sous Linux, selon POSIX.1, ces valeurs d'erreur devraient être distinctes.) |
| `EOVERFLOW` | Indique qu'une valeur est trop grande pour être stockée dans un type de données donné. |
| `EPERM` | Indique que l'opération n'est pas autorisée. |
| `EPIPE` | Indique un tube cassé. |
| `EPROTO` | Indique une erreur de protocole. |
| `EPROTONOSUPPORT` | Indique qu'un protocole n'est pas pris en charge. |
| `EPROTOTYPE` | Indique le mauvais type de protocole pour un socket. |
| `ERANGE` | Indique que les résultats sont trop grands. |
| `EROFS` | Indique que le système de fichiers est en lecture seule. |
| `ESPIPE` | Indique une opération de recherche non valide. |
| `ESRCH` | Indique qu'il n'y a pas de processus de ce type. |
| `ESTALE` | Indique que le descripteur de fichier est obsolète. |
| `ETIME` | Indique un temporisateur expiré. |
| `ETIMEDOUT` | Indique que la connexion a expiré. |
| `ETXTBSY` | Indique qu'un fichier texte est occupé. |
| `EWOULDBLOCK` | Indique que l'opération serait bloquée. |
| `EXDEV` | Indique un lien incorrect. |


#### Constantes d'erreur spécifiques à Windows {#windows-specific-error-constants}

Les codes d'erreur suivants sont spécifiques au système d'exploitation Windows.

| Constante | Description |
| --- | --- |
| `WSAEINTR` | Indique un appel de fonction interrompu. |
| `WSAEBADF` | Indique un handle de fichier non valide. |
| `WSAEACCES` | Indique des permissions insuffisantes pour terminer l'opération. |
| `WSAEFAULT` | Indique une adresse de pointeur non valide. |
| `WSAEINVAL` | Indique qu'un argument non valide a été passé. |
| `WSAEMFILE` | Indique qu'il y a trop de fichiers ouverts. |
| `WSAEWOULDBLOCK` | Indique qu'une ressource est temporairement indisponible. |
| `WSAEINPROGRESS` | Indique qu'une opération est en cours. |
| `WSAEALREADY` | Indique qu'une opération est déjà en cours. |
| `WSAENOTSOCK` | Indique que la ressource n'est pas un socket. |
| `WSAEDESTADDRREQ` | Indique qu'une adresse de destination est requise. |
| `WSAEMSGSIZE` | Indique que la taille du message est trop longue. |
| `WSAEPROTOTYPE` | Indique le mauvais type de protocole pour le socket. |
| `WSAENOPROTOOPT` | Indique une mauvaise option de protocole. |
| `WSAEPROTONOSUPPORT` | Indique que le protocole n'est pas supporté. |
| `WSAESOCKTNOSUPPORT` | Indique que le type de socket n'est pas supporté. |
| `WSAEOPNOTSUPP` | Indique que l'opération n'est pas supportée. |
| `WSAEPFNOSUPPORT` | Indique que la famille de protocole n'est pas supportée. |
| `WSAEAFNOSUPPORT` | Indique que la famille d'adresses n'est pas supportée. |
| `WSAEADDRINUSE` | Indique que l'adresse réseau est déjà utilisée. |
| `WSAEADDRNOTAVAIL` | Indique que l'adresse réseau n'est pas disponible. |
| `WSAENETDOWN` | Indique que le réseau est hors service. |
| `WSAENETUNREACH` | Indique que le réseau est inaccessible. |
| `WSAENETRESET` | Indique que la connexion réseau a été réinitialisée. |
| `WSAECONNABORTED` | Indique que la connexion a été abandonnée. |
| `WSAECONNRESET` | Indique que la connexion a été réinitialisée par le pair. |
| `WSAENOBUFS` | Indique qu'il n'y a pas d'espace tampon disponible. |
| `WSAEISCONN` | Indique que le socket est déjà connecté. |
| `WSAENOTCONN` | Indique que le socket n'est pas connecté. |
| `WSAESHUTDOWN` | Indique que les données ne peuvent pas être envoyées après que le socket a été arrêté. |
| `WSAETOOMANYREFS` | Indique qu'il y a trop de références. |
| `WSAETIMEDOUT` | Indique que la connexion a expiré. |
| `WSAECONNREFUSED` | Indique que la connexion a été refusée. |
| `WSAELOOP` | Indique qu'un nom ne peut pas être traduit. |
| `WSAENAMETOOLONG` | Indique qu'un nom était trop long. |
| `WSAEHOSTDOWN` | Indique qu'un hôte réseau est hors service. |
| `WSAEHOSTUNREACH` | Indique qu'il n'y a pas de route vers un hôte réseau. |
| `WSAENOTEMPTY` | Indique que le répertoire n'est pas vide. |
| `WSAEPROCLIM` | Indique qu'il y a trop de processus. |
| `WSAEUSERS` | Indique que le quota d'utilisateurs a été dépassé. |
| `WSAEDQUOT` | Indique que le quota de disque a été dépassé. |
| `WSAESTALE` | Indique une référence de handle de fichier obsolète. |
| `WSAEREMOTE` | Indique que l'élément est distant. |
| `WSASYSNOTREADY` | Indique que le sous-système réseau n'est pas prêt. |
| `WSAVERNOTSUPPORTED` | Indique que la version de `winsock.dll` est hors     de portée. |
| `WSANOTINITIALISED` | Indique que WSAStartup n'a pas encore été exécuté avec succès. |
| `WSAEDISCON` | Indique qu'un arrêt propre est en cours. |
| `WSAENOMORE` | Indique qu'il n'y a plus de résultats. |
| `WSAECANCELLED` | Indique qu'une opération a été annulée. |
| `WSAEINVALIDPROCTABLE` | Indique que la table d'appel de procédure n'est pas valide. |
| `WSAEINVALIDPROVIDER` | Indique un fournisseur de services non valide. |
| `WSAEPROVIDERFAILEDINIT` | Indique que le fournisseur de services n'a pas réussi à s'initialiser. |
| `WSASYSCALLFAILURE` | Indique un échec d'appel système. |
| `WSASERVICE_NOT_FOUND` | Indique qu'un service n'a pas été trouvé. |
| `WSATYPE_NOT_FOUND` | Indique qu'un type de classe n'a pas été trouvé. |
| `WSA_E_NO_MORE` | Indique qu'il n'y a plus de résultats. |
| `WSA_E_CANCELLED` | Indique que l'appel a été annulé. |
| `WSAEREFUSED` | Indique qu'une requête de base de données a été refusée. |


### Constantes dlopen {#dlopen-constants}

Si elles sont disponibles sur le système d'exploitation, les constantes suivantes sont exportées dans `os.constants.dlopen`. Voir [`dlopen(3)`](http://man7.org/linux/man-pages/man3/dlopen.3) pour des informations détaillées.

| Constante | Description |
| --- | --- |
| `RTLD_LAZY` | Effectuer une liaison paresseuse. Node.js définit cet indicateur par défaut. |
| `RTLD_NOW` | Résoudre tous les symboles non définis dans la bibliothèque avant que dlopen(3) ne renvoie. |
| `RTLD_GLOBAL` | Les symboles définis par la bibliothèque seront mis à disposition pour la résolution des symboles des bibliothèques chargées ultérieurement. |
| `RTLD_LOCAL` | L'inverse de `RTLD_GLOBAL`. C'est le comportement par défaut si aucun indicateur n'est spécifié. |
| `RTLD_DEEPBIND` | Faire en sorte qu'une bibliothèque autonome utilise ses propres symboles de préférence aux symboles des bibliothèques chargées précédemment. |
### Constantes de priorité {#priority-constants}

**Ajouté dans : v10.10.0**

Les constantes de planification de processus suivantes sont exportées par `os.constants.priority`.

| Constante | Description |
| --- | --- |
| `PRIORITY_LOW` | La priorité de planification de processus la plus basse. Cela correspond à `IDLE_PRIORITY_CLASS` sur Windows, et à une valeur nice de `19` sur toutes les autres plateformes. |
| `PRIORITY_BELOW_NORMAL` | La priorité de planification de processus au-dessus de `PRIORITY_LOW` et en dessous de `PRIORITY_NORMAL`. Cela correspond à `BELOW_NORMAL_PRIORITY_CLASS` sur Windows, et à une valeur nice de `10` sur toutes les autres plateformes. |
| `PRIORITY_NORMAL` | La priorité de planification de processus par défaut. Cela correspond à `NORMAL_PRIORITY_CLASS` sur Windows, et à une valeur nice de `0` sur toutes les autres plateformes. |
| `PRIORITY_ABOVE_NORMAL` | La priorité de planification de processus au-dessus de `PRIORITY_NORMAL` et en dessous de `PRIORITY_HIGH`. Cela correspond à `ABOVE_NORMAL_PRIORITY_CLASS` sur Windows, et à une valeur nice de `-7` sur toutes les autres plateformes. |
| `PRIORITY_HIGH` | La priorité de planification de processus au-dessus de `PRIORITY_ABOVE_NORMAL` et en dessous de `PRIORITY_HIGHEST`. Cela correspond à `HIGH_PRIORITY_CLASS` sur Windows, et à une valeur nice de `-14` sur toutes les autres plateformes. |
| `PRIORITY_HIGHEST` | La priorité de planification de processus la plus élevée. Cela correspond à `REALTIME_PRIORITY_CLASS` sur Windows, et à une valeur nice de `-20` sur toutes les autres plateformes. |


### Constantes libuv {#libuv-constants}

| Constante | Description |
| --- | --- |
| `UV_UDP_REUSEADDR` ||

