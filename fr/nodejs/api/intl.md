---
title: Documentation Node.js - Internationalisation
description: Cette section de la documentation Node.js couvre le module Internationalisation (Intl), qui fournit l'accès à diverses fonctionnalités d'internationalisation et de localisation, y compris le tri, la mise en forme des nombres, des dates et des heures, et plus encore.
head:
  - - meta
    - name: og:title
      content: Documentation Node.js - Internationalisation | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Cette section de la documentation Node.js couvre le module Internationalisation (Intl), qui fournit l'accès à diverses fonctionnalités d'internationalisation et de localisation, y compris le tri, la mise en forme des nombres, des dates et des heures, et plus encore.
  - - meta
    - name: twitter:title
      content: Documentation Node.js - Internationalisation | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Cette section de la documentation Node.js couvre le module Internationalisation (Intl), qui fournit l'accès à diverses fonctionnalités d'internationalisation et de localisation, y compris le tri, la mise en forme des nombres, des dates et des heures, et plus encore.
---


# Prise en charge de l'internationalisation {#internationalization-support}

Node.js possède de nombreuses fonctionnalités qui facilitent l'écriture de programmes internationalisés. En voici quelques exemples :

- Fonctions sensibles aux paramètres régionaux ou compatibles avec Unicode dans la [Spécification du langage ECMAScript](https://tc39.github.io/ecma262/) :
    - [`String.prototype.normalize()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize)
    - [`String.prototype.toLowerCase()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLowerCase)
    - [`String.prototype.toUpperCase()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase)


- Toutes les fonctionnalités décrites dans la [Spécification de l'API d'internationalisation ECMAScript](https://tc39.github.io/ecma402/) (alias ECMA-402) :
    - Objet [`Intl`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)
    - Méthodes sensibles aux paramètres régionaux telles que [`String.prototype.localeCompare()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare) et [`Date.prototype.toLocaleString()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString)


- Prise en charge des [noms de domaine internationalisés](https://en.wikipedia.org/wiki/Internationalized_domain_name) (IDN) de l'[analyseur syntaxique d'URL WHATWG](/fr/nodejs/api/url#the-whatwg-url-api)
- [`require('node:buffer').transcode()`](/fr/nodejs/api/buffer#buffertranscodesource-fromenc-toenc)
- Édition de ligne [REPL](/fr/nodejs/api/repl#repl) plus précise
- [`require('node:util').TextDecoder`](/fr/nodejs/api/util#class-utiltextdecoder)
- [Séquences d'échappement de propriétés Unicode `RegExp`](https://github.com/tc39/proposal-regexp-unicode-property-escapes)

Node.js et le moteur V8 sous-jacent utilisent les [composants internationaux pour Unicode (ICU)](http://site.icu-project.org/) pour implémenter ces fonctionnalités dans du code C/C++ natif. L'ensemble complet de données ICU est fourni par défaut par Node.js. Cependant, en raison de la taille du fichier de données ICU, plusieurs options sont fournies pour personnaliser l'ensemble de données ICU lors de la construction ou de l'exécution de Node.js.


## Options pour la construction de Node.js {#options-for-building-nodejs}

Pour contrôler la façon dont ICU est utilisé dans Node.js, quatre options de `configure` sont disponibles pendant la compilation. Des détails supplémentaires sur la façon de compiler Node.js sont documentés dans [BUILDING.md](https://github.com/nodejs/node/blob/HEAD/BUILDING.md).

- `--with-intl=none`/`--without-intl`
- `--with-intl=system-icu`
- `--with-intl=small-icu`
- `--with-intl=full-icu` (par défaut)

Un aperçu des fonctionnalités Node.js et JavaScript disponibles pour chaque option `configure` :

| Fonctionnalité | `none` | `system-icu` | `small-icu` | `full-icu` |
| --- | --- | --- | --- | --- |
| [`String.prototype.normalize()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize) | aucune (la fonction ne fait rien) | complète | complète | complète |
| `String.prototype.to*Case()` | complète | complète | complète | complète |
| [`Intl`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) | aucun (l'objet n'existe pas) | partielle/complète (dépend du système d'exploitation) | partielle (anglais uniquement) | complète |
| [`String.prototype.localeCompare()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare) | partielle (non sensible à la localisation) | complète | complète | complète |
| `String.prototype.toLocale*Case()` | partielle (non sensible à la localisation) | complète | complète | complète |
| [`Number.prototype.toLocaleString()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString) | partielle (non sensible à la localisation) | partielle/complète (dépend du système d'exploitation) | partielle (anglais uniquement) | complète |
| `Date.prototype.toLocale*String()` | partielle (non sensible à la localisation) | partielle/complète (dépend du système d'exploitation) | partielle (anglais uniquement) | complète |
| [Ancien analyseur d'URL](/fr/nodejs/api/url#legacy-url-api) | partielle (pas de support IDN) | complète | complète | complète |
| [Analyseur d'URL WHATWG](/fr/nodejs/api/url#the-whatwg-url-api) | partielle (pas de support IDN) | complète | complète | complète |
| [`require('node:buffer').transcode()`](/fr/nodejs/api/buffer#buffertranscodesource-fromenc-toenc) | aucune (la fonction n'existe pas) | complète | complète | complète |
| [REPL](/fr/nodejs/api/repl#repl) | partielle (édition de ligne imprécise) | complète | complète | complète |
| [`require('node:util').TextDecoder`](/fr/nodejs/api/util#class-utiltextdecoder) | partielle (prise en charge des encodages de base) | partielle/complète (dépend du système d'exploitation) | partielle (Unicode uniquement) | complète |
| [`RegExp` Échappements de propriétés Unicode](https://github.com/tc39/proposal-regexp-unicode-property-escapes) | aucun (erreur   `RegExp`   invalide) | complète | complète | complète |

La désignation "(non sensible à la localisation)" indique que la fonction effectue son opération de la même manière que la version non-`Locale` de la fonction, si elle existe. Par exemple, en mode `none`, l'opération de `Date.prototype.toLocaleString()` est identique à celle de `Date.prototype.toString()`.


### Désactiver toutes les fonctionnalités d'internationalisation (`none`) {#disable-all-internationalization-features-none}

Si cette option est choisie, ICU est désactivé et la plupart des fonctionnalités d'internationalisation mentionnées ci-dessus seront **indisponibles** dans l'exécutable `node` résultant.

### Compiler avec une ICU préinstallée (`system-icu`) {#build-with-a-pre-installed-icu-system-icu}

Node.js peut être lié à une version d'ICU déjà installée sur le système. En fait, la plupart des distributions Linux sont déjà livrées avec ICU installé, et cette option permettrait de réutiliser le même ensemble de données utilisé par d'autres composants du système d'exploitation.

Les fonctionnalités qui nécessitent uniquement la bibliothèque ICU elle-même, telles que [`String.prototype.normalize()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize) et l'[analyseur d'URL WHATWG](/fr/nodejs/api/url#the-whatwg-url-api), sont entièrement prises en charge sous `system-icu`. Les fonctionnalités qui nécessitent également des données de paramètres régionaux ICU, telles que [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat), *peuvent* être entièrement ou partiellement prises en charge, en fonction de l'exhaustivité des données ICU installées sur le système.

### Intégrer un ensemble limité de données ICU (`small-icu`) {#embed-a-limited-set-of-icu-data-small-icu}

Cette option permet de lier l'exécutable résultant à la bibliothèque ICU statiquement, et inclut un sous-ensemble de données ICU (généralement uniquement les paramètres régionaux anglais) dans l'exécutable `node`.

Les fonctionnalités qui nécessitent uniquement la bibliothèque ICU elle-même, telles que [`String.prototype.normalize()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize) et l'[analyseur d'URL WHATWG](/fr/nodejs/api/url#the-whatwg-url-api), sont entièrement prises en charge sous `small-icu`. Les fonctionnalités qui nécessitent également des données de paramètres régionaux ICU, telles que [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat), ne fonctionnent généralement qu'avec les paramètres régionaux anglais :

```js [ESM]
const january = new Date(9e8);
const english = new Intl.DateTimeFormat('en', { month: 'long' });
const spanish = new Intl.DateTimeFormat('es', { month: 'long' });

console.log(english.format(january));
// Prints "January"
console.log(spanish.format(january));
// Prints either "M01" or "January" on small-icu, depending on the user’s default locale
// Should print "enero"
```
Ce mode offre un équilibre entre les fonctionnalités et la taille de l'exécutable.


#### Fournir des données ICU au moment de l’exécution {#providing-icu-data-at-runtime}

Si l’option `small-icu` est utilisée, il est toujours possible de fournir des données de locale supplémentaires au moment de l’exécution afin que les méthodes JS fonctionnent pour toutes les locales ICU. En supposant que le fichier de données soit stocké dans `/runtime/directory/with/dat/file`, il peut être mis à la disposition d’ICU via :

-  L’option de configuration `--with-icu-default-data-dir` : ceci n’intègre que le chemin d’accès au répertoire de données par défaut dans le binaire. Le fichier de données réel sera chargé au moment de l’exécution à partir de ce chemin d’accès au répertoire.
-  La variable d’environnement [`NODE_ICU_DATA`](/fr/nodejs/api/cli#node_icu_datafile) :
-  Le paramètre CLI [`--icu-data-dir`](/fr/nodejs/api/cli#--icu-data-dirfile) :

Lorsque plusieurs d’entre eux sont spécifiés, le paramètre CLI `--icu-data-dir` a la priorité la plus élevée, puis la variable d’environnement `NODE_ICU_DATA`, puis l’option de configuration `--with-icu-default-data-dir`.

ICU est capable de trouver et de charger automatiquement divers formats de données, mais les données doivent être appropriées pour la version d’ICU, et le fichier doit être correctement nommé. Le nom le plus courant pour le fichier de données est `icudtX[bl].dat`, où `X` désigne la version ICU prévue, et `b` ou `l` indique l’endianness du système. Node.js ne pourra pas se charger si le fichier de données attendu ne peut pas être lu depuis le répertoire spécifié. Le nom du fichier de données correspondant à la version actuelle de Node.js peut être calculé avec :

```js [ESM]
`icudt${process.versions.icu.split('.')[0]}${os.endianness()[0].toLowerCase()}.dat`;
```
Consultez l’article ["ICU Data"](http://userguide.icu-project.org/icudata) du guide de l’utilisateur d’ICU pour connaître les autres formats pris en charge et plus de détails sur les données ICU en général.

Le module npm [full-icu](https://www.npmjs.com/package/full-icu) peut grandement simplifier l’installation des données ICU en détectant la version ICU de l’exécutable `node` en cours d’exécution et en téléchargeant le fichier de données approprié. Après avoir installé le module via `npm i full-icu`, le fichier de données sera disponible à l’adresse `./node_modules/full-icu`. Ce chemin peut ensuite être transmis à `NODE_ICU_DATA` ou `--icu-data-dir` comme indiqué ci-dessus pour activer la prise en charge complète d’`Intl`.


### Intégrer l'ensemble d'ICU (`full-icu`) {#embed-the-entire-icu-full-icu}

Cette option fait en sorte que le binaire résultant soit lié statiquement à ICU et inclue un ensemble complet de données ICU. Un binaire créé de cette manière n'a pas d'autres dépendances externes et prend en charge tous les paramètres régionaux, mais peut être assez volumineux. C'est le comportement par défaut si aucun indicateur `--with-intl` n'est passé. Les binaires officiels sont également construits dans ce mode.

## Détection de la prise en charge de l'internationalisation {#detecting-internationalization-support}

Pour vérifier qu'ICU est activé (`system-icu`, `small-icu` ou `full-icu`), il suffit de vérifier l'existence de `Intl` :

```js [ESM]
const hasICU = typeof Intl === 'object';
```
Sinon, la vérification de `process.versions.icu`, une propriété définie uniquement lorsque ICU est activé, fonctionne également :

```js [ESM]
const hasICU = typeof process.versions.icu === 'string';
```
Pour vérifier la prise en charge d'un paramètre régional non anglais (c.-à-d. `full-icu` ou `system-icu`), [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat) peut être un bon facteur de distinction :

```js [ESM]
const hasFullICU = (() => {
  try {
    const january = new Date(9e8);
    const spanish = new Intl.DateTimeFormat('es', { month: 'long' });
    return spanish.format(january) === 'enero';
  } catch (err) {
    return false;
  }
})();
```
Pour des tests plus détaillés de la prise en charge d'`Intl`, les ressources suivantes peuvent être utiles :

- [btest402](https://github.com/srl295/btest402) : généralement utilisé pour vérifier si Node.js avec la prise en charge d'`Intl` est construit correctement.
- [Test262](https://github.com/tc39/test262/tree/HEAD/test/intl402) : la suite officielle de tests de conformité d'ECMAScript comprend une section dédiée à ECMA-402.

