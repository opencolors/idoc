---
title: Node.js avec WebAssembly
description: WebAssembly est un langage assembleur haute performance qui peut être compilé à partir de divers langages, notamment C/C++, Rust et AssemblyScript. Node.js fournit les API nécessaires via l'objet WebAssembly global pour communiquer avec WebAssembly.
head:
  - - meta
    - name: og:title
      content: Node.js avec WebAssembly | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: WebAssembly est un langage assembleur haute performance qui peut être compilé à partir de divers langages, notamment C/C++, Rust et AssemblyScript. Node.js fournit les API nécessaires via l'objet WebAssembly global pour communiquer avec WebAssembly.
  - - meta
    - name: twitter:title
      content: Node.js avec WebAssembly | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: WebAssembly est un langage assembleur haute performance qui peut être compilé à partir de divers langages, notamment C/C++, Rust et AssemblyScript. Node.js fournit les API nécessaires via l'objet WebAssembly global pour communiquer avec WebAssembly.
---


# Node.js avec WebAssembly

[WebAssembly](https://webassembly.org/) est un langage de type assembleur haute performance qui peut être compilé à partir de divers langages, notamment C/C++, Rust et AssemblyScript. Il est actuellement pris en charge par Chrome, Firefox, Safari, Edge et Node.js !

La spécification WebAssembly détaille deux formats de fichiers, un format binaire appelé module WebAssembly avec une extension `.wasm` et une représentation textuelle correspondante appelée format texte WebAssembly avec une extension `.wat`.

## Concepts clés

- Module - Un binaire WebAssembly compilé, c'est-à-dire un fichier `.wasm`.
- Mémoire - Un ArrayBuffer redimensionnable.
- Table - Un tableau typé redimensionnable de références non stockées dans la mémoire.
- Instance - Une instanciation d'un module avec sa mémoire, sa table et ses variables.

Pour utiliser WebAssembly, vous avez besoin d'un fichier binaire `.wasm` et d'un ensemble d'API pour communiquer avec WebAssembly. Node.js fournit les API nécessaires via l'objet global `WebAssembly`.

```javascript
console.log(WebAssembly)
/*
Object [WebAssembly] {
  compile: [Function: compile],
  validate: [Function: validate],
  instantiate: [Function: instantiate]
}
*/
```

## Génération de modules WebAssembly

Il existe plusieurs méthodes disponibles pour générer des fichiers binaires WebAssembly, notamment :

- Écrire WebAssembly (`.wat`) à la main et convertir au format binaire à l'aide d'outils tels que [wabt](https://github.com/WebAssembly/wabt).
- Utiliser [emscripten](https://github.com/emscripten-core/emscripten) avec une application C/C++
- Utiliser [wasm-pack](https://github.com/rustwasm/wasm-pack) avec une application Rust
- Utiliser [AssemblyScript](https://github.com/AssemblyScript/assemblyscript) si vous préférez une expérience de type TypeScript

::: tip
**Certains de ces outils génèrent non seulement le fichier binaire, mais aussi le code JavaScript "glue" et les fichiers HTML correspondants pour s'exécuter dans le navigateur.**
:::

## Comment l'utiliser

Une fois que vous avez un module WebAssembly, vous pouvez utiliser l'objet `WebAssembly` de Node.js pour l'instancier.

```javascript
const fs = require('node:fs')
const wasmBuffer = fs.readFileSync('/path/to/add.wasm')
WebAssembly.instantiate(wasmBuffer).then(wasmModule => {
  // La fonction exportée se trouve sous instance.exports
  const { add } = wasmModule.instance.exports
  const sum = add(5, 6)
  console.log(sum) // Affiche : 11
})
```


## Interagir avec le système d'exploitation

Les modules WebAssembly ne peuvent pas accéder directement aux fonctionnalités du système d'exploitation par eux-mêmes. Un outil tiers [Wasmtime](https://github.com/bytecodealliance/wasmtime) peut être utilisé pour accéder à cette fonctionnalité. `Wasmtime` utilise l'API [WASI](https://webassembly.org/WASI) pour accéder aux fonctionnalités du système d'exploitation.

## Ressources

- [Informations générales sur WebAssembly](https://webassembly.org/)
- [Documentation MDN](https://developer.mozilla.org/fr/docs/WebAssembly)
- [Écrire WebAssembly à la main](https://webassembly.github.io/spec/core/text/index.html)

