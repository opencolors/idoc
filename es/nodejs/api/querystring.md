---
title: Documentación de Node.js - Cadena de consulta
description: Esta sección de la documentación de Node.js detalla el módulo querystring, que proporciona utilidades para analizar y formatear cadenas de consulta URL. Incluye métodos para escapar y desescapar caracteres especiales, manejar objetos anidados y gestionar la serialización de cadenas de consulta.
head:
  - - meta
    - name: og:title
      content: Documentación de Node.js - Cadena de consulta | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Esta sección de la documentación de Node.js detalla el módulo querystring, que proporciona utilidades para analizar y formatear cadenas de consulta URL. Incluye métodos para escapar y desescapar caracteres especiales, manejar objetos anidados y gestionar la serialización de cadenas de consulta.
  - - meta
    - name: twitter:title
      content: Documentación de Node.js - Cadena de consulta | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Esta sección de la documentación de Node.js detalla el módulo querystring, que proporciona utilidades para analizar y formatear cadenas de consulta URL. Incluye métodos para escapar y desescapar caracteres especiales, manejar objetos anidados y gestionar la serialización de cadenas de consulta.
---


# Cadena de consulta {#query-string}

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable
:::

**Código fuente:** [lib/querystring.js](https://github.com/nodejs/node/blob/v23.5.0/lib/querystring.js)

El módulo `node:querystring` proporciona utilidades para analizar y formatear cadenas de consulta de URL. Se puede acceder usando:

```js [ESM]
const querystring = require('node:querystring');
```
`querystring` es más eficiente que [\<URLSearchParams\>](/es/nodejs/api/url#class-urlsearchparams) pero no es una API estandarizada. Use [\<URLSearchParams\>](/es/nodejs/api/url#class-urlsearchparams) cuando el rendimiento no sea crítico o cuando sea deseable la compatibilidad con el código del navegador.

## `querystring.decode()` {#querystringdecode}

**Agregado en: v0.1.99**

La función `querystring.decode()` es un alias para `querystring.parse()`.

## `querystring.encode()` {#querystringencode}

**Agregado en: v0.1.99**

La función `querystring.encode()` es un alias para `querystring.stringify()`.

## `querystring.escape(str)` {#querystringescapestr}

**Agregado en: v0.1.25**

- `str` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

El método `querystring.escape()` realiza la codificación de porcentaje de URL en la `str` dada de una manera optimizada para los requisitos específicos de las cadenas de consulta de URL.

El método `querystring.escape()` es utilizado por `querystring.stringify()` y generalmente no se espera que se use directamente. Se exporta principalmente para permitir que el código de la aplicación proporcione una implementación de codificación de porcentaje de reemplazo si es necesario asignando `querystring.escape` a una función alternativa.

## `querystring.parse(str[, sep[, eq[, options]]])` {#querystringparsestr-sep-eq-options}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v8.0.0 | Ahora se analizan correctamente múltiples entradas vacías (por ejemplo, `&=&=`). |
| v6.0.0 | El objeto devuelto ya no hereda de `Object.prototype`. |
| v6.0.0, v4.2.4 | El parámetro `eq` ahora puede tener una longitud de más de `1`. |
| v0.1.25 | Agregado en: v0.1.25 |
:::

- `str` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La cadena de consulta de la URL para analizar
- `sep` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La subcadena utilizada para delimitar pares de clave y valor en la cadena de consulta. **Predeterminado:** `'&'`.
- `eq` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type). La subcadena utilizada para delimitar claves y valores en la cadena de consulta. **Predeterminado:** `'='`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `decodeURIComponent` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La función que se utilizará al decodificar caracteres codificados por porcentaje en la cadena de consulta. **Predeterminado:** `querystring.unescape()`.
    - `maxKeys` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica el número máximo de claves para analizar. Especifique `0` para eliminar las limitaciones de conteo de claves. **Predeterminado:** `1000`.
  
 

El método `querystring.parse()` analiza una cadena de consulta de URL (`str`) en una colección de pares de clave y valor.

Por ejemplo, la cadena de consulta `'foo=bar&abc=xyz&abc=123'` se analiza en:

```json [JSON]
{
  "foo": "bar",
  "abc": ["xyz", "123"]
}
```
El objeto devuelto por el método `querystring.parse()` *no* hereda prototípicamente del `Object` de JavaScript. Esto significa que los métodos típicos de `Object` como `obj.toString()`, `obj.hasOwnProperty()` y otros no están definidos y *no funcionarán*.

De forma predeterminada, se asumirá que los caracteres codificados por porcentaje dentro de la cadena de consulta utilizan la codificación UTF-8. Si se utiliza una codificación de caracteres alternativa, deberá especificarse una opción `decodeURIComponent` alternativa:

```js [ESM]
// Suponiendo que la función gbkDecodeURIComponent ya existe...

querystring.parse('w=%D6%D0%CE%C4&foo=bar', null, null,
                  { decodeURIComponent: gbkDecodeURIComponent });
```

## `querystring.stringify(obj[, sep[, eq[, options]]])` {#querystringstringifyobj-sep-eq-options}

**Agregado en: v0.1.25**

- `obj` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) El objeto a serializar en una cadena de consulta URL.
- `sep` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La subcadena utilizada para delimitar pares de clave y valor en la cadena de consulta. **Predeterminado:** `'&'`.
- `eq` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type). La subcadena utilizada para delimitar claves y valores en la cadena de consulta. **Predeterminado:** `'='`.
- `options`
    - `encodeURIComponent` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) La función a usar al convertir caracteres no seguros para URL a codificación de porcentaje en la cadena de consulta. **Predeterminado:** `querystring.escape()`.

El método `querystring.stringify()` produce una cadena de consulta URL a partir de un `obj` dado iterando a través de las "propiedades propias" del objeto.

Serializa los siguientes tipos de valores pasados en `obj`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<bigint[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) | [\<boolean[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Los valores numéricos deben ser finitos. Cualquier otro valor de entrada será coaccionado a cadenas vacías.

```js [ESM]
querystring.stringify({ foo: 'bar', baz: ['qux', 'quux'], corge: '' });
// Devuelve 'foo=bar&baz=qux&baz=quux&corge='

querystring.stringify({ foo: 'bar', baz: 'qux' }, ';', ':');
// Devuelve 'foo:bar;baz:qux'
```
De forma predeterminada, los caracteres que requieren codificación de porcentaje dentro de la cadena de consulta se codificarán como UTF-8. Si se requiere una codificación alternativa, entonces se deberá especificar una opción `encodeURIComponent` alternativa:

```js [ESM]
// Asumiendo que la función gbkEncodeURIComponent ya existe,

querystring.stringify({ w: '中文', foo: 'bar' }, null, null,
                      { encodeURIComponent: gbkEncodeURIComponent });
```

## `querystring.unescape(str)` {#querystringunescapestr}

**Agregado en: v0.1.25**

- `str` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

El método `querystring.unescape()` realiza la decodificación de los caracteres codificados en porcentaje de la URL en la `str` dada.

El método `querystring.unescape()` es utilizado por `querystring.parse()` y generalmente no se espera que se utilice directamente. Se exporta principalmente para permitir que el código de la aplicación proporcione una implementación de decodificación de reemplazo si es necesario asignando `querystring.unescape` a una función alternativa.

Por defecto, el método `querystring.unescape()` intentará usar el método incorporado de JavaScript `decodeURIComponent()` para decodificar. Si eso falla, se utilizará un equivalente más seguro que no se lance en URLs mal formadas.

