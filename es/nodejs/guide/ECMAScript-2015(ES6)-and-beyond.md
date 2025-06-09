---
title: ECMAScript 2015 (ES6) y más allá en Node.js
description: Node.js admite características ECMAScript modernas a través del motor V8, con nuevas características y mejoras incorporadas de manera oportuna.
head:
  - - meta
    - name: og:title
      content: ECMAScript 2015 (ES6) y más allá en Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js admite características ECMAScript modernas a través del motor V8, con nuevas características y mejoras incorporadas de manera oportuna.
  - - meta
    - name: twitter:title
      content: ECMAScript 2015 (ES6) y más allá en Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js admite características ECMAScript modernas a través del motor V8, con nuevas características y mejoras incorporadas de manera oportuna.
---


# ECMAScript 2015 (ES6) y posteriores

Node.js está construido sobre versiones modernas de [V8](https://v8.dev/). Al mantenernos actualizados con las últimas versiones de este motor, nos aseguramos de que las nuevas características de la [especificación JavaScript ECMA-262](https://tc39.es/ecma262/) se pongan a disposición de los desarrolladores de Node.js de manera oportuna, así como mejoras continuas de rendimiento y estabilidad.

Todas las características de ECMAScript 2015 (ES6) se dividen en tres grupos para características `shipping`, `staged` y `in progress`:

+ Todas las características `shipping`, que V8 considera estables, están `activadas de forma predeterminada en Node.js` y `NO` requieren ningún tipo de indicador de tiempo de ejecución.
+ Las características `Staged`, que son características casi completas que el equipo de V8 no considera estables, requieren un indicador de tiempo de ejecución: `--harmony`.
+ Las características `In progress` se pueden activar individualmente mediante su respectivo indicador harmony, aunque esto está altamente desaconsejado a menos que sea para fines de prueba. Nota: estos indicadores son expuestos por V8 y podrían cambiar sin previo aviso de obsolescencia.

## ¿Qué características se envían con qué versión de Node.js de forma predeterminada?

El sitio web [node.green](https://node.green) proporciona una excelente descripción general de las características de ECMAScript compatibles en varias versiones de Node.js, basadas en la tabla de compatibilidad de kangax.

## ¿Qué características están en progreso?

Constantemente se agregan nuevas características al motor V8. En términos generales, espere que lleguen a una futura versión de Node.js, aunque se desconoce el momento.

Puede enumerar todas las características en progreso disponibles en cada versión de Node.js buscando en el argumento `--v8-options`. Tenga en cuenta que estas son características incompletas y posiblemente rotas de V8, así que utilícelas bajo su propio riesgo:

```sh
node --v8-options | grep "in progress"
```

## Tengo mi infraestructura configurada para aprovechar el indicador --harmony. ¿Debería eliminarlo?

El comportamiento actual del indicador `--harmony` en Node.js es habilitar solo las características `staged`. Después de todo, ahora es sinónimo de `--es_staging`. Como se mencionó anteriormente, estas son características completadas que aún no se han considerado estables. Si desea ir sobre seguro, especialmente en entornos de producción, considere eliminar este indicador de tiempo de ejecución hasta que se envíe de forma predeterminada en V8 y, en consecuencia, en Node.js. Si lo mantiene habilitado, debe estar preparado para que las futuras actualizaciones de Node.js rompan su código si V8 cambia su semántica para seguir más de cerca el estándar.


## ¿Cómo encuentro qué versión de V8 se incluye con una versión particular de Node.js?

Node.js proporciona una forma sencilla de listar todas las dependencias y las versiones respectivas que se incluyen con un binario específico a través del objeto global `process`. En el caso del motor V8, escriba lo siguiente en su terminal para recuperar su versión:

```sh
node -p process.versions.v8
```

