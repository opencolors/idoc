---
title: Meilleures pratiques pour travailler avec différents systèmes de fichiers dans Node.js
description: Découvrez comment gérer différents systèmes de fichiers dans Node.js, y compris la sensibilité à la casse, la préservation de la forme Unicode et la résolution de l'horodatage.
head:
  - - meta
    - name: og:title
      content: Meilleures pratiques pour travailler avec différents systèmes de fichiers dans Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Découvrez comment gérer différents systèmes de fichiers dans Node.js, y compris la sensibilité à la casse, la préservation de la forme Unicode et la résolution de l'horodatage.
  - - meta
    - name: twitter:title
      content: Meilleures pratiques pour travailler avec différents systèmes de fichiers dans Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Découvrez comment gérer différents systèmes de fichiers dans Node.js, y compris la sensibilité à la casse, la préservation de la forme Unicode et la résolution de l'horodatage.
---


# Comment travailler avec différents systèmes de fichiers

Node.js expose de nombreuses fonctionnalités des systèmes de fichiers. Mais tous les systèmes de fichiers ne sont pas identiques. Voici les meilleures pratiques suggérées pour que votre code reste simple et sûr lorsque vous travaillez avec différents systèmes de fichiers.

## Comportement du système de fichiers

Avant de pouvoir travailler avec un système de fichiers, vous devez savoir comment il se comporte. Différents systèmes de fichiers se comportent différemment et possèdent plus ou moins de fonctionnalités que d'autres : sensibilité à la casse, insensibilité à la casse, conservation de la casse, conservation de la forme Unicode, résolution des horodatages, attributs étendus, inodes, autorisations Unix, flux de données alternatifs, etc.

Méfiez-vous de la déduction du comportement du système de fichiers à partir de `process.platform`. Par exemple, ne supposez pas que parce que votre programme s'exécute sur Darwin, vous travaillez donc sur un système de fichiers insensible à la casse (HFS+), car l'utilisateur peut utiliser un système de fichiers sensible à la casse (HFSX). De même, ne supposez pas que parce que votre programme s'exécute sous Linux, vous travaillez donc sur un système de fichiers qui prend en charge les autorisations Unix et les inodes, car vous pouvez être sur un lecteur externe particulier, une clé USB ou un lecteur réseau qui ne le fait pas.

Le système d'exploitation peut ne pas faciliter la déduction du comportement du système de fichiers, mais tout n'est pas perdu. Au lieu de conserver une liste de tous les systèmes de fichiers et comportements connus (qui sera toujours incomplète), vous pouvez sonder le système de fichiers pour voir comment il se comporte réellement. La présence ou l'absence de certaines fonctionnalités faciles à sonder suffit souvent à déduire le comportement d'autres fonctionnalités plus difficiles à sonder.

N'oubliez pas que certains utilisateurs peuvent avoir différents systèmes de fichiers montés à différents chemins dans l'arborescence de travail.

## Éviter une approche du plus petit dénominateur commun

Vous pourriez être tenté de faire en sorte que votre programme se comporte comme un système de fichiers de plus petit dénominateur commun, en normalisant tous les noms de fichiers en majuscules, en normalisant tous les noms de fichiers en forme Unicode NFC et en normalisant tous les horodatages de fichiers à une résolution de 1 seconde, par exemple. Ce serait l'approche du plus petit dénominateur commun.

Ne faites pas cela. Vous ne pourriez interagir en toute sécurité qu'avec un système de fichiers qui possède exactement les mêmes caractéristiques de plus petit dénominateur commun dans tous les domaines. Vous ne pourriez pas travailler avec des systèmes de fichiers plus avancés de la manière dont les utilisateurs s'y attendent, et vous rencontreriez des collisions de noms de fichiers ou d'horodatages. Vous perdriez et corrompriez très certainement les données de l'utilisateur à travers une série d'événements dépendants compliqués, et vous créeriez des bugs qui seraient difficiles, voire impossibles, à résoudre.

Que se passe-t-il lorsque vous devez ultérieurement prendre en charge un système de fichiers qui n'a qu'une résolution d'horodatage de 2 secondes ou de 24 heures ? Que se passe-t-il lorsque la norme Unicode progresse pour inclure un algorithme de normalisation légèrement différent (comme cela s'est produit dans le passé) ?

Une approche du plus petit dénominateur commun aurait tendance à essayer de créer un programme portable en utilisant uniquement des appels système « portables ». Cela conduit à des programmes qui fuient et qui ne sont en fait pas portables.


## Adopter une approche de sur-ensemble

Tirez le meilleur parti de chaque plateforme que vous prenez en charge en adoptant une approche de sur-ensemble. Par exemple, un programme de sauvegarde portable doit synchroniser correctement les "btimes" (l'heure de création d'un fichier ou d'un dossier) entre les systèmes Windows, et ne doit pas détruire ni altérer les "btimes", même si les "btimes" ne sont pas pris en charge sur les systèmes Linux. Le même programme de sauvegarde portable doit synchroniser correctement les permissions Unix entre les systèmes Linux, et ne doit pas détruire ni altérer les permissions Unix, même si les permissions Unix ne sont pas prises en charge sur les systèmes Windows.

Gérez les différents systèmes de fichiers en faisant en sorte que votre programme agisse comme un système de fichiers plus avancé. Prenez en charge un sur-ensemble de toutes les fonctionnalités possibles : sensibilité à la casse, préservation de la casse, sensibilité à la forme Unicode, préservation de la forme Unicode, permissions Unix, horodatages haute résolution en nanosecondes, attributs étendus, etc.

Une fois que la préservation de la casse est intégrée à votre programme, vous pouvez toujours implémenter l'insensibilité à la casse si vous devez interagir avec un système de fichiers insensible à la casse. Mais si vous renoncez à la préservation de la casse dans votre programme, vous ne pouvez pas interagir en toute sécurité avec un système de fichiers préservant la casse. Il en va de même pour la préservation de la forme Unicode et la préservation de la résolution de l'horodatage.

Si un système de fichiers vous fournit un nom de fichier dans un mélange de minuscules et de majuscules, conservez le nom de fichier exactement dans la casse indiquée. Si un système de fichiers vous fournit un nom de fichier sous une forme Unicode mixte ou NFC ou NFD (ou NFKC ou NFKD), conservez le nom de fichier dans la séquence d'octets exacte indiquée. Si un système de fichiers vous fournit un horodatage en millisecondes, conservez l'horodatage en résolution milliseconde.

Lorsque vous travaillez avec un système de fichiers inférieur, vous pouvez toujours sous-échantillonner de manière appropriée, avec des fonctions de comparaison comme l'exige le comportement du système de fichiers sur lequel votre programme s'exécute. Si vous savez que le système de fichiers ne prend pas en charge les permissions Unix, vous ne devez pas vous attendre à lire les mêmes permissions Unix que vous écrivez. Si vous savez que le système de fichiers ne préserve pas la casse, vous devez vous attendre à voir `ABC` dans une liste de répertoires lorsque votre programme crée `abc`. Mais si vous savez que le système de fichiers préserve la casse, vous devez considérer `ABC` comme un nom de fichier différent de `abc`, lors de la détection de changements de nom de fichier ou si le système de fichiers est sensible à la casse.


## Préservation de la casse

Vous pouvez créer un répertoire nommé `test /abc` et être surpris de constater que parfois `fs.readdir('test')` renvoie `['ABC']`. Ce n'est pas un bug de Node. Node renvoie le nom de fichier tel que le système de fichiers le stocke, et tous les systèmes de fichiers ne prennent pas en charge la préservation de la casse. Certains systèmes de fichiers convertissent tous les noms de fichiers en majuscules (ou en minuscules).

## Préservation de la forme Unicode

La préservation de la casse et la préservation de la forme Unicode sont des concepts similaires. Pour comprendre pourquoi la forme Unicode doit être préservée, assurez-vous d'abord de comprendre pourquoi la casse doit être préservée. La préservation de la forme Unicode est tout aussi simple lorsqu'elle est comprise correctement. Unicode peut encoder les mêmes caractères en utilisant plusieurs séquences d'octets différentes. Plusieurs chaînes peuvent se ressembler, mais avoir des séquences d'octets différentes. Lorsque vous travaillez avec des chaînes UTF-8, veillez à ce que vos attentes correspondent à la façon dont Unicode fonctionne. Tout comme vous ne vous attendriez pas à ce que tous les caractères UTF-8 soient encodés sur un seul octet, vous ne devriez pas vous attendre à ce que plusieurs chaînes UTF-8 qui se ressemblent à l'œil nu aient la même représentation en octets. C'est peut-être une attente que vous pouvez avoir d'ASCll, mais pas d'UTF-8.

Vous pouvez créer un répertoire appelé `test/ café` (forme Unicode NFC avec la séquence d'octets `<63 61 66 c3 a9>` et `string.length ===5`) et être surpris de constater que parfois `fs.readdir('test')` renvoie `['café']` (forme Unicode NFD avec la séquence d'octets `<63 61 66 65 cc 81>` et `string.length ===6`). Ce n'est pas un bug de Node.js. Node.js renvoie le nom de fichier tel que le système de fichiers le stocke, et tous les systèmes de fichiers ne prennent pas en charge la préservation de la forme Unicode. HFS+, par exemple, normalisera tous les noms de fichiers vers une forme presque toujours identique à la forme NFD. Ne vous attendez pas à ce que HFS+ se comporte de la même manière que NTFS ou EXT 4 et inversement. N'essayez pas de modifier les données de manière permanente par la normalisation en tant qu'abstraction fuyante pour masquer les différences Unicode entre les systèmes de fichiers. Cela créerait des problèmes sans en résoudre aucun. Préservez plutôt la forme Unicode et utilisez la normalisation uniquement comme fonction de comparaison.


## Insensibilité à la forme Unicode

L'insensibilité à la forme Unicode et la préservation de la forme Unicode sont deux comportements de système de fichiers différents souvent confondus. Tout comme l'insensibilité à la casse a parfois été incorrectement implémentée en normalisant en permanence les noms de fichiers en majuscules lors du stockage et de la transmission des noms de fichiers, de même l'insensibilité à la forme Unicode a parfois été incorrectement implémentée en normalisant en permanence les noms de fichiers vers une certaine forme Unicode (NFD dans le cas de HFS+) lors du stockage et de la transmission des noms de fichiers. Il est possible et bien préférable d'implémenter l'insensibilité à la forme Unicode sans sacrifier la préservation de la forme Unicode, en utilisant la normalisation Unicode uniquement pour la comparaison.

## Comparaison de différentes formes Unicode

Node.js fournit `string.normalize ('NFC' / 'NFD')` que vous pouvez utiliser pour normaliser une chaîne UTF-8 en NFC ou en NFD. Vous ne devriez jamais stocker la sortie de cette fonction, mais l'utiliser uniquement dans le cadre d'une fonction de comparaison pour tester si deux chaînes UTF-8 auraient le même aspect pour l'utilisateur. Vous pouvez utiliser `string1.normalize('NFC')=== string2.normalize('NFC')` ou `string1.normalize('NFD')=== string2.normalize('NFD')` comme fonction de comparaison. La forme que vous utilisez n'a pas d'importance.

La normalisation est rapide, mais vous pouvez utiliser un cache comme entrée de votre fonction de comparaison pour éviter de normaliser la même chaîne plusieurs fois. Si la chaîne n'est pas présente dans le cache, normalisez-la et mettez-la en cache. Veillez à ne pas stocker ou rendre persistant le cache, utilisez-le uniquement comme cache.

Notez que l'utilisation de `normalize ()` nécessite que votre version de Node.js inclue ICU (sinon `normalize ()` renverra simplement la chaîne d'origine). Si vous téléchargez la dernière version de Node.js depuis le site web, elle inclura ICU.

## Résolution des horodatages

Vous pouvez définir le mtime (l'heure de modification) d'un fichier à 1444291759414 (résolution en millisecondes) et être surpris de constater parfois que `fs.stat` renvoie le nouveau mtime sous la forme 1444291759000 (résolution en 1 seconde) ou 1444291758000 (résolution en 2 secondes). Ce n'est pas un bug dans Node. Node.js renvoie l'horodatage tel qu'il est stocké par le système de fichiers, et tous les systèmes de fichiers ne prennent pas en charge la résolution des horodatages en nanosecondes, millisecondes ou 1 seconde. Certains systèmes de fichiers ont même une résolution très grossière pour l'horodatage atime en particulier, par exemple 24 heures pour certains systèmes de fichiers FAT.


## Ne pas corrompre les noms de fichiers et les horodatages par la normalisation

Les noms de fichiers et les horodatages sont des données utilisateur. Tout comme vous ne réécririez jamais automatiquement les données de fichier de l'utilisateur pour mettre les données en majuscules ou normaliser les fins de ligne CRLF en LF, vous ne devriez jamais modifier, interférer ou corrompre les noms de fichiers ou les horodatages par la normalisation de la casse / forme Unicode / horodatage. La normalisation ne doit être utilisée que pour la comparaison, jamais pour modifier les données.

La normalisation est effectivement un code de hachage avec perte. Vous pouvez l'utiliser pour tester certains types d'équivalence (par exemple, plusieurs chaînes semblent-elles identiques même si elles ont des séquences d'octets différentes), mais vous ne pouvez jamais l'utiliser comme substitut aux données réelles. Votre programme doit transmettre les données de nom de fichier et d'horodatage telles quelles.

Votre programme peut créer de nouvelles données en NFC (ou dans toute combinaison de forme Unicode qu'il préfère) ou avec un nom de fichier en minuscule ou en majuscule, ou avec un horodatage de résolution de 2 secondes, mais votre programme ne doit pas corrompre les données utilisateur existantes en imposant la normalisation de la casse / forme Unicode / horodatage. Adoptez plutôt une approche de surensemble et préservez la casse, la forme Unicode et la résolution d'horodatage dans votre programme. De cette façon, vous pourrez interagir en toute sécurité avec les systèmes de fichiers qui font de même.

## Utiliser les fonctions de comparaison de normalisation de manière appropriée

Assurez-vous d'utiliser les fonctions de comparaison de casse / forme Unicode / horodatage de manière appropriée. N'utilisez pas une fonction de comparaison de nom de fichier insensible à la casse si vous travaillez sur un système de fichiers sensible à la casse. N'utilisez pas une fonction de comparaison insensible à la forme Unicode si vous travaillez sur un système de fichiers sensible à la forme Unicode (par exemple, NTFS et la plupart des systèmes de fichiers Linux qui préservent à la fois NFC et NFD ou des formes Unicode mixtes). Ne comparez pas les horodatages avec une résolution de 2 secondes si vous travaillez sur un système de fichiers avec une résolution d'horodatage en nanosecondes.

## Être préparé à de légères différences dans les fonctions de comparaison

Soyez prudent et assurez-vous que vos fonctions de comparaison correspondent à celles du système de fichiers (ou sondez le système de fichiers si possible pour voir comment il se comparerait réellement). L'insensibilité à la casse, par exemple, est plus complexe qu'une simple comparaison `toLowerCase()`. En fait, `toUpperCase()` est généralement meilleur que `toLowerCase ()` (car il gère différemment certains caractères de langues étrangères). Mais le mieux serait encore de sonder le système de fichiers, car chaque système de fichiers a sa propre table de comparaison de casse intégrée.

À titre d'exemple, le HFS+ d'Apple normalise les noms de fichiers en forme NFD, mais cette forme NFD est en fait une ancienne version de la forme NFD actuelle et peut parfois être légèrement différente de la forme NFD de la dernière norme Unicode. Ne vous attendez pas à ce que HFS+ NFD soit exactement le même que Unicode NFD tout le temps.

