---
title: Documentación de Node.js - Internacionalización
description: Esta sección de la documentación de Node.js cubre el módulo de Internacionalización (Intl), que proporciona acceso a diversas funcionalidades de internacionalización y localización, incluyendo la ordenación, el formato de números, fechas y horas, y más.
head:
  - - meta
    - name: og:title
      content: Documentación de Node.js - Internacionalización | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Esta sección de la documentación de Node.js cubre el módulo de Internacionalización (Intl), que proporciona acceso a diversas funcionalidades de internacionalización y localización, incluyendo la ordenación, el formato de números, fechas y horas, y más.
  - - meta
    - name: twitter:title
      content: Documentación de Node.js - Internacionalización | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Esta sección de la documentación de Node.js cubre el módulo de Internacionalización (Intl), que proporciona acceso a diversas funcionalidades de internacionalización y localización, incluyendo la ordenación, el formato de números, fechas y horas, y más.
---


# Soporte para la internacionalización {#internationalization-support}

Node.js tiene muchas características que facilitan la escritura de programas internacionalizados. Algunos de ellos son:

- Funciones sensibles a la configuración regional o compatibles con Unicode en la [Especificación del Lenguaje ECMAScript](https://tc39.github.io/ecma262/):
    - [`String.prototype.normalize()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize)
    - [`String.prototype.toLowerCase()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLowerCase)
    - [`String.prototype.toUpperCase()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase)


- Toda la funcionalidad descrita en la [Especificación de la API de Internacionalización de ECMAScript](https://tc39.github.io/ecma402/) (también conocida como ECMA-402):
    - Objeto [`Intl`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)
    - Métodos sensibles a la configuración regional como [`String.prototype.localeCompare()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare) y [`Date.prototype.toLocaleString()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString)


- El soporte de [nombres de dominio internacionalizados](https://en.wikipedia.org/wiki/Internationalized_domain_name) (IDNs) del [analizador de URL WHATWG](/es/nodejs/api/url#la-api-url-de-whatwg)
- [`require('node:buffer').transcode()`](/es/nodejs/api/buffer#buffertranscodesource-fromenc-toenc)
- Edición de línea [REPL](/es/nodejs/api/repl#repl) más precisa
- [`require('node:util').TextDecoder`](/es/nodejs/api/util#class-utiltextdecoder)
- [Secuencias de escape de propiedad Unicode `RegExp`](https://github.com/tc39/proposal-regexp-unicode-property-escapes)

Node.js y el motor V8 subyacente utilizan [Componentes Internacionales para Unicode (ICU)](http://site.icu-project.org/) para implementar estas características en código C/C++ nativo. El conjunto de datos ICU completo es proporcionado por Node.js de forma predeterminada. Sin embargo, debido al tamaño del archivo de datos ICU, se proporcionan varias opciones para personalizar el conjunto de datos ICU ya sea al construir o ejecutar Node.js.


## Opciones para construir Node.js {#options-for-building-nodejs}

Para controlar cómo se utiliza ICU en Node.js, hay cuatro opciones de `configure` disponibles durante la compilación. En [BUILDING.md](https://github.com/nodejs/node/blob/HEAD/BUILDING.md) se documentan detalles adicionales sobre cómo compilar Node.js.

- `--with-intl=none`/`--without-intl`
- `--with-intl=system-icu`
- `--with-intl=small-icu`
- `--with-intl=full-icu` (predeterminado)

Una descripción general de las características disponibles de Node.js y JavaScript para cada opción de `configure`:

| Característica | `none` | `system-icu` | `small-icu` | `full-icu` |
| --- | --- | --- | --- | --- |
| [`String.prototype.normalize()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize) | ninguna (la función es no-op) | completa | completa | completa |
| `String.prototype.to*Case()` | completa | completa | completa | completa |
| [`Intl`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl) | ninguna (el objeto no existe) | parcial/completa (depende del sistema operativo) | parcial (solo en inglés) | completa |
| [`String.prototype.localeCompare()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare) | parcial (no tiene en cuenta la configuración regional) | completa | completa | completa |
| `String.prototype.toLocale*Case()` | parcial (no tiene en cuenta la configuración regional) | completa | completa | completa |
| [`Number.prototype.toLocaleString()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString) | parcial (no tiene en cuenta la configuración regional) | parcial/completa (depende del sistema operativo) | parcial (solo en inglés) | completa |
| `Date.prototype.toLocale*String()` | parcial (no tiene en cuenta la configuración regional) | parcial/completa (depende del sistema operativo) | parcial (solo en inglés) | completa |
| [Analizador de URL heredado](/es/nodejs/api/url#legacy-url-api) | parcial (sin soporte IDN) | completa | completa | completa |
| [Analizador de URL WHATWG](/es/nodejs/api/url#the-whatwg-url-api) | parcial (sin soporte IDN) | completa | completa | completa |
| [`require('node:buffer').transcode()`](/es/nodejs/api/buffer#buffertranscodesource-fromenc-toenc) | ninguna (la función no existe) | completa | completa | completa |
| [REPL](/es/nodejs/api/repl#repl) | parcial (edición de línea inexacta) | completa | completa | completa |
| [`require('node:util').TextDecoder`](/es/nodejs/api/util#class-utiltextdecoder) | parcial (soporte de codificación básico) | parcial/completa (depende del sistema operativo) | parcial (solo Unicode) | completa |
| [`RegExp` Escapes de propiedades Unicode](https://github.com/tc39/proposal-regexp-unicode-property-escapes) | ninguna (error de   `RegExp`   no válido) | completa | completa | completa |
La designación "(no tiene en cuenta la configuración regional)" denota que la función lleva a cabo su operación de la misma manera que la versión no `Locale` de la función, si existe. Por ejemplo, en el modo `none`, la operación de `Date.prototype.toLocaleString()` es idéntica a la de `Date.prototype.toString()`.


### Deshabilitar todas las características de internacionalización (`none`) {#disable-all-internationalization-features-none}

Si se elige esta opción, ICU se desactiva y la mayoría de las características de internacionalización mencionadas anteriormente **no estarán disponibles** en el binario `node` resultante.

### Construir con una ICU preinstalada (`system-icu`) {#build-with-a-pre-installed-icu-system-icu}

Node.js puede enlazarse con una compilación de ICU ya instalada en el sistema. De hecho, la mayoría de las distribuciones de Linux ya vienen con ICU instalado, y esta opción permitiría reutilizar el mismo conjunto de datos utilizado por otros componentes del sistema operativo.

Las funcionalidades que solo requieren la biblioteca ICU en sí, como [`String.prototype.normalize()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize) y el [analizador WHATWG URL](/es/nodejs/api/url#the-whatwg-url-api), son totalmente compatibles con `system-icu`. Las características que requieren datos de localización de ICU además, como [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat) *pueden* ser total o parcialmente compatibles, dependiendo de la integridad de los datos de ICU instalados en el sistema.

### Integrar un conjunto limitado de datos de ICU (`small-icu`) {#embed-a-limited-set-of-icu-data-small-icu}

Esta opción hace que el binario resultante se enlace estáticamente a la biblioteca ICU, e incluye un subconjunto de datos de ICU (normalmente solo la configuración regional en inglés) dentro del ejecutable `node`.

Las funcionalidades que solo requieren la biblioteca ICU en sí, como [`String.prototype.normalize()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize) y el [analizador WHATWG URL](/es/nodejs/api/url#the-whatwg-url-api), son totalmente compatibles con `small-icu`. Las características que requieren datos de localización de ICU además, como [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat), generalmente solo funcionan con la configuración regional en inglés:

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
Este modo proporciona un equilibrio entre características y tamaño binario.


#### Proporcionar datos de ICU en tiempo de ejecución {#providing-icu-data-at-runtime}

Si se usa la opción `small-icu`, aún se pueden proporcionar datos de configuración regional adicionales en tiempo de ejecución para que los métodos JS funcionen para todas las configuraciones regionales de ICU. Suponiendo que el archivo de datos esté almacenado en `/runtime/directory/with/dat/file`, se puede poner a disposición de ICU a través de:

- La opción de configuración `--with-icu-default-data-dir`: Esto solo incrusta la ruta del directorio de datos predeterminado en el binario. El archivo de datos real se cargará en tiempo de ejecución desde esta ruta de directorio.
- La variable de entorno [`NODE_ICU_DATA`](/es/nodejs/api/cli#node_icu_datafile):
- El parámetro CLI [`--icu-data-dir`](/es/nodejs/api/cli#--icu-data-dirfile):

Cuando se especifica más de uno de ellos, el parámetro CLI `--icu-data-dir` tiene la mayor prioridad, luego la variable de entorno `NODE_ICU_DATA` y luego la opción de configuración `--with-icu-default-data-dir`.

ICU puede encontrar y cargar automáticamente una variedad de formatos de datos, pero los datos deben ser apropiados para la versión de ICU y el archivo debe tener el nombre correcto. El nombre más común para el archivo de datos es `icudtX[bl].dat`, donde `X` denota la versión de ICU prevista, y `b` o `l` indica el endianness del sistema. Node.js no se cargará si el archivo de datos esperado no se puede leer desde el directorio especificado. El nombre del archivo de datos correspondiente a la versión actual de Node.js se puede calcular con:

```js [ESM]
`icudt${process.versions.icu.split('.')[0]}${os.endianness()[0].toLowerCase()}.dat`;
```
Consulte el artículo ["Datos de ICU"](http://userguide.icu-project.org/icudata) en la Guía del usuario de ICU para obtener otros formatos admitidos y más detalles sobre los datos de ICU en general.

El módulo npm [full-icu](https://www.npmjs.com/package/full-icu) puede simplificar enormemente la instalación de datos de ICU al detectar la versión de ICU del ejecutable `node` en ejecución y descargar el archivo de datos apropiado. Después de instalar el módulo a través de `npm i full-icu`, el archivo de datos estará disponible en `./node_modules/full-icu`. Esta ruta se puede pasar a `NODE_ICU_DATA` o `--icu-data-dir` como se muestra arriba para habilitar la compatibilidad total con `Intl`.


### Incrustar todo el ICU (`full-icu`) {#embed-the-entire-icu-full-icu}

Esta opción hace que el binario resultante se enlace estáticamente con ICU e incluya un conjunto completo de datos de ICU. Un binario creado de esta manera no tiene más dependencias externas y admite todas las configuraciones regionales, pero podría ser bastante grande. Este es el comportamiento predeterminado si no se pasa ningún indicador `--with-intl`. Los binarios oficiales también se construyen en este modo.

## Detectar la compatibilidad con la internacionalización {#detecting-internationalization-support}

Para verificar que ICU esté habilitado en absoluto (`system-icu`, `small-icu` o `full-icu`), simplemente verificar la existencia de `Intl` debería ser suficiente:

```js [ESM]
const hasICU = typeof Intl === 'object';
```
Alternativamente, verificar `process.versions.icu`, una propiedad definida solo cuando ICU está habilitado, también funciona:

```js [ESM]
const hasICU = typeof process.versions.icu === 'string';
```
Para verificar la compatibilidad con una configuración regional que no sea inglés (es decir, `full-icu` o `system-icu`), [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat) puede ser un buen factor de distinción:

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
Para pruebas más detalladas de la compatibilidad con `Intl`, los siguientes recursos pueden ser útiles:

- [btest402](https://github.com/srl295/btest402): Generalmente se utiliza para verificar si Node.js con soporte `Intl` está construido correctamente.
- [Test262](https://github.com/tc39/test262/tree/HEAD/test/intl402): El conjunto de pruebas de conformidad oficial de ECMAScript incluye una sección dedicada a ECMA-402.

