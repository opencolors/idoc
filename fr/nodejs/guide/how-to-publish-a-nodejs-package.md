---
title: Publication d'un package Node-API
description: Découvrez comment publier une version Node-API d'un package aux côtés d'une version non Node-API et comment introduire une dépendance à une version Node-API d'un package.
head:
  - - meta
    - name: og:title
      content: Publication d'un package Node-API | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Découvrez comment publier une version Node-API d'un package aux côtés d'une version non Node-API et comment introduire une dépendance à une version Node-API d'un package.
  - - meta
    - name: twitter:title
      content: Publication d'un package Node-API | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Découvrez comment publier une version Node-API d'un package aux côtés d'une version non Node-API et comment introduire une dépendance à une version Node-API d'un package.
---


# Comment publier un package Node-API

## Comment publier une version Node-API d'un package à côté d'une version non-Node-API

Les étapes suivantes sont illustrées à l'aide du package `iotivity-node` :

- Tout d'abord, publiez la version non-Node-API :
    - Mettez à jour la version dans `package.json`. Pour `iotivity-node`, la version devient 1.2.0-2.
    - Parcourez la liste de contrôle de publication (assurez-vous que les tests/démos/docs sont OK).
    - `npm publish`.

- Ensuite, publiez la version Node-API :
    - Mettez à jour la version dans `package.json`. Dans le cas de `iotivity-node`, la version devient 1.2.0-3. Pour la gestion des versions, nous vous recommandons de suivre le schéma de version préliminaire tel que décrit par [semver.org](https://semver.org), par ex. 1.2.0-napi.
    - Parcourez la liste de contrôle de publication (assurez-vous que les tests/démos/docs sont OK).
    - `npm publish --tag n-api`.

Dans cet exemple, le marquage de la version avec `n-api` a garanti que, bien que la version 1.2.0-3 soit postérieure à la version non-Node-APl publiée (1.2.0-2), elle ne sera pas installée si quelqu'un choisit d'installer `iotivity-node` en exécutant simplement `npm install iotivity-node`. Cela installera la version non-Node-APl par défaut. L'utilisateur devra exécuter `npm install iotivity-node@n api` pour recevoir la version Node-APlI. Pour plus d'informations sur l'utilisation des balises avec npm, consultez « Utilisation des dist-tags ».

## Comment introduire une dépendance à une version Node-API d'un package

Pour ajouter la version Node-API de `iotivity-node` comme dépendance, le `package.json` ressemblera à ceci :

```json
"dependencies": {
  "iotivity-node": "n-api"
}
```

Comme expliqué dans « Utilisation des dist-tags », contrairement aux versions régulières, les versions balisées ne peuvent pas être traitées par des plages de versions telles que `"^2.0.0"` à l'intérieur de `package.json`. La raison en est que la balise fait référence à une seule version. Ainsi, si le responsable du package choisit de baliser une version ultérieure du package en utilisant la même balise, `npm update` recevra la version ultérieure. Cela devrait être une version acceptable autre que la dernière publiée, la dépendance `package.json` devra faire référence à la version exacte comme suit :

```json
"dependencies": {
  "iotivity-node": "1.2.0-3"
}
```
