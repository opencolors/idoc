---
title: Soporte de TypeScript en Node.js
description: Aprende a usar TypeScript con Node.js, incluyendo la instalación, configuración y las mejores prácticas para integrar TypeScript en tus proyectos de Node.js.
head:
  - - meta
    - name: og:title
      content: Soporte de TypeScript en Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Aprende a usar TypeScript con Node.js, incluyendo la instalación, configuración y las mejores prácticas para integrar TypeScript en tus proyectos de Node.js.
  - - meta
    - name: twitter:title
      content: Soporte de TypeScript en Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Aprende a usar TypeScript con Node.js, incluyendo la instalación, configuración y las mejores prácticas para integrar TypeScript en tus proyectos de Node.js.
---


# Módulos: TypeScript {#modules-typescript}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v22.7.0 | Se añadió el flag `--experimental-transform-types`. |
:::

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index).1 - Desarrollo activo
:::

## Activación {#enabling}

Hay dos maneras de habilitar el soporte de TypeScript en tiempo de ejecución en Node.js:

## Soporte completo de TypeScript {#full-typescript-support}

Para usar TypeScript con soporte completo para todas las características de TypeScript, incluyendo `tsconfig.json`, puedes usar un paquete de terceros. Estas instrucciones usan [`tsx`](https://tsx.is/) como ejemplo, pero hay muchas otras librerías similares disponibles.

## Eliminación de tipos {#type-stripping}

**Añadido en: v22.6.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index).1 - Desarrollo activo
:::

El flag [`--experimental-strip-types`](/es/nodejs/api/cli#--experimental-strip-types) permite a Node.js ejecutar archivos TypeScript. Por defecto, Node.js ejecutará solo los archivos que no contengan características de TypeScript que requieran transformación, como enums o namespaces. Node.js reemplazará las anotaciones de tipo inline con espacios en blanco, y no se realizará ninguna verificación de tipo. Para habilitar la transformación de tales características, usa el flag [`--experimental-transform-types`](/es/nodejs/api/cli#--experimental-transform-types). Las características de TypeScript que dependen de configuraciones dentro de `tsconfig.json`, como paths o convertir sintaxis JavaScript más nueva a estándares más antiguos, no son compatibles intencionalmente. Para obtener soporte completo de TypeScript, consulta [Soporte completo de TypeScript](/es/nodejs/api/typescript#full-typescript-support).

La característica de eliminación de tipos está diseñada para ser ligera. Al no admitir intencionalmente sintaxis que requieren generación de código JavaScript, y al reemplazar los tipos inline con espacios en blanco, Node.js puede ejecutar código TypeScript sin la necesidad de source maps.

La eliminación de tipos funciona con la mayoría de las versiones de TypeScript, pero recomendamos la versión 5.7 o más reciente con la siguiente configuración de `tsconfig.json`:

```json [JSON]
{
  "compilerOptions": {
     "target": "esnext",
     "module": "nodenext",
     "allowImportingTsExtensions": true,
     "rewriteRelativeImportExtensions": true,
     "verbatimModuleSyntax": true
  }
}
```

### Determinación del sistema de módulos {#determining-module-system}

Node.js admite tanto la sintaxis de [CommonJS](/es/nodejs/api/modules) como la de [Módulos ES](/es/nodejs/api/esm) en los archivos de TypeScript. Node.js no convertirá de un sistema de módulos a otro; si quieres que tu código se ejecute como un módulo ES, debes usar la sintaxis `import` y `export`, y si quieres que tu código se ejecute como CommonJS debes usar `require` y `module.exports`.

- Los archivos `.ts` tendrán su sistema de módulos determinado [de la misma manera que los archivos `.js`.](/es/nodejs/api/packages#determining-module-system) Para usar la sintaxis `import` y `export`, añade `"type": "module"` al `package.json` padre más cercano.
- Los archivos `.mts` siempre se ejecutarán como módulos ES, de forma similar a los archivos `.mjs`.
- Los archivos `.cts` siempre se ejecutarán como módulos CommonJS, de forma similar a los archivos `.cjs`.
- Los archivos `.tsx` no son compatibles.

Al igual que en los archivos JavaScript, [las extensiones de archivo son obligatorias](/es/nodejs/api/esm#mandatory-file-extensions) en las sentencias `import` y en las expresiones `import()`: `import './file.ts'`, no `import './file'`. Debido a la compatibilidad con versiones anteriores, las extensiones de archivo también son obligatorias en las llamadas `require()`: `require('./file.ts')`, no `require('./file')`, de forma similar a como la extensión `.cjs` es obligatoria en las llamadas `require` en los archivos CommonJS.

La opción `tsconfig.json` `allowImportingTsExtensions` permitirá al compilador de TypeScript `tsc` comprobar el tipo de los archivos con especificadores `import` que incluyan la extensión `.ts`.

### Características de TypeScript {#typescript-features}

Dado que Node.js sólo está eliminando los tipos en línea, cualquier característica de TypeScript que implique *reemplazar* la sintaxis de TypeScript con una nueva sintaxis de JavaScript generará un error, a menos que se pase el flag [`--experimental-transform-types`](/es/nodejs/api/cli#--experimental-transform-types).

Las características más destacadas que requieren transformación son:

- `Enum`
- `namespaces`
- `legacy module`
- propiedades de los parámetros

Dado que los decoradores son actualmente una [propuesta de la etapa 3 de TC39](https://github.com/tc39/proposal-decorators) y pronto serán compatibles con el motor de JavaScript, no se transforman y darán como resultado un error de análisis sintáctico. Esta es una limitación temporal y se resolverá en el futuro.

Además, Node.js no lee los archivos `tsconfig.json` y no admite las características que dependen de la configuración dentro de `tsconfig.json`, como las rutas o la conversión de la sintaxis JavaScript más reciente en estándares más antiguos.


### Importando tipos sin la palabra clave `type` {#importing-types-without-type-keyword}

Debido a la naturaleza de la eliminación de tipos, la palabra clave `type` es necesaria para eliminar correctamente las importaciones de tipos. Sin la palabra clave `type`, Node.js tratará la importación como una importación de valor, lo que resultará en un error en tiempo de ejecución. La opción de tsconfig [`verbatimModuleSyntax`](https://www.typescriptlang.org/tsconfig/#verbatimModuleSyntax) se puede utilizar para que coincida con este comportamiento.

Este ejemplo funcionará correctamente:

```ts [TYPESCRIPT]
import type { Type1, Type2 } from './module.ts';
import { fn, type FnParams } from './fn.ts';
```
Esto resultará en un error en tiempo de ejecución:

```ts [TYPESCRIPT]
import { Type1, Type2 } from './module.ts';
import { fn, FnParams } from './fn.ts';
```
### Formas de entrada que no son archivos {#non-file-forms-of-input}

La eliminación de tipos se puede habilitar para `--eval`. El sistema de módulos estará determinado por `--input-type`, como lo está para JavaScript.

La sintaxis de TypeScript no es compatible con REPL, la entrada STDIN, `--print`, `--check` e `inspect`.

### Mapas de origen (Source maps) {#source-maps}

Dado que los tipos en línea se reemplazan por espacios en blanco, los mapas de origen son innecesarios para los números de línea correctos en los seguimientos de pila; y Node.js no los genera. Cuando [`--experimental-transform-types`](/es/nodejs/api/cli#--experimental-transform-types) está habilitado, los mapas de origen se habilitan de forma predeterminada.

### Eliminación de tipos en dependencias {#type-stripping-in-dependencies}

Para desalentar a los autores de paquetes a publicar paquetes escritos en TypeScript, Node.js, de forma predeterminada, se negará a manejar archivos TypeScript dentro de carpetas bajo una ruta `node_modules`.

### Alias de rutas {#paths-aliases}

[`tsconfig` "paths"](https://www.typescriptlang.org/tsconfig/#paths) no se transformarán y, por lo tanto, producirán un error. La característica más cercana disponible son las [importaciones de subrutas](/es/nodejs/api/packages#subpath-imports) con la limitación de que deben comenzar con `#`.

