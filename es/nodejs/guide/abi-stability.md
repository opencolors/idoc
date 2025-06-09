---
title: Estabilidad de ABI en Node.js y N-API
description: Node.js proporciona una ABI estable para complementos nativos a través de N-API, garantizando la compatibilidad entre varias versiones principales y reduciendo las cargas de mantenimiento de los sistemas de producción.
head:
  - - meta
    - name: og:title
      content: Estabilidad de ABI en Node.js y N-API | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js proporciona una ABI estable para complementos nativos a través de N-API, garantizando la compatibilidad entre varias versiones principales y reduciendo las cargas de mantenimiento de los sistemas de producción.
  - - meta
    - name: twitter:title
      content: Estabilidad de ABI en Node.js y N-API | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js proporciona una ABI estable para complementos nativos a través de N-API, garantizando la compatibilidad entre varias versiones principales y reduciendo las cargas de mantenimiento de los sistemas de producción.
---


# Estabilidad de la ABI

## Introducción

Una Interfaz Binaria de Aplicación (ABI) es una forma en que los programas pueden llamar a funciones y usar estructuras de datos de otros programas compilados. Es la versión compilada de una Interfaz de Programación de Aplicaciones (API). En otras palabras, los archivos de encabezado que describen las clases, funciones, estructuras de datos, enumeraciones y constantes que permiten a una aplicación realizar una tarea deseada, corresponden mediante la compilación a un conjunto de direcciones y valores de parámetros esperados y tamaños y diseños de estructuras de memoria con los que se compiló el proveedor de la ABI.

La aplicación que utiliza la ABI debe compilarse de tal manera que las direcciones disponibles, los valores de parámetros esperados y los tamaños y diseños de las estructuras de memoria coincidan con aquellos con los que se compiló el proveedor de la ABI. Esto generalmente se logra compilando contra los encabezados proporcionados por el proveedor de la ABI.

Dado que el proveedor de la ABI y el usuario de la ABI pueden compilarse en diferentes momentos con diferentes versiones del compilador, una parte de la responsabilidad de garantizar la compatibilidad de la ABI recae en el compilador. Diferentes versiones del compilador, quizás proporcionadas por diferentes proveedores, deben producir la misma ABI a partir de un archivo de encabezado con un cierto contenido, y deben producir código para la aplicación que usa la ABI que acceda a la API descrita en un encabezado dado de acuerdo con las convenciones de la ABI resultante de la descripción en el encabezado. Los compiladores modernos tienen un historial bastante bueno de no romper la compatibilidad de la ABI de las aplicaciones que compilan.

La responsabilidad restante de garantizar la compatibilidad de la ABI recae en el equipo que mantiene los archivos de encabezado que proporcionan la API que resulta, después de la compilación, en la ABI que debe permanecer estable. Se pueden realizar cambios en los archivos de encabezado, pero la naturaleza de los cambios debe rastrearse de cerca para garantizar que, después de la compilación, la ABI no cambie de una manera que haga que los usuarios existentes de la ABI sean incompatibles con la nueva versión.


## Estabilidad de la ABI en Node.js

Node.js proporciona archivos de encabezado mantenidos por varios equipos independientes. Por ejemplo, los archivos de encabezado como `node.h` y `node_buffer.h` son mantenidos por el equipo de Node.js. `v8.h` es mantenido por el equipo de V8, que, aunque en estrecha cooperación con el equipo de Node.js, es independiente y tiene su propio cronograma y prioridades. Por lo tanto, el equipo de Node.js solo tiene un control parcial sobre los cambios que se introducen en los encabezados que proporciona el proyecto. Como resultado, el proyecto Node.js ha adoptado el [versionamiento semántico](https://semver.org). Esto asegura que las API proporcionadas por el proyecto resultarán en una ABI estable para todas las versiones menores y de parche de Node.js lanzadas dentro de una versión principal. En la práctica, esto significa que el proyecto Node.js se ha comprometido a garantizar que un complemento nativo de Node.js compilado contra una versión principal determinada de Node.js se cargará correctamente cuando sea cargado por cualquier versión menor o de parche de Node.js dentro de la versión principal contra la que fue compilado.

## N-API

Ha surgido la demanda de equipar a Node.js con una API que resulte en una ABI que permanezca estable en múltiples versiones principales de Node.js. La motivación para crear tal API es la siguiente:

- El lenguaje JavaScript ha permanecido compatible consigo mismo desde sus inicios, mientras que la ABI del motor que ejecuta el código JavaScript cambia con cada versión principal de Node.js. Esto significa que las aplicaciones que consisten en paquetes de Node.js escritos completamente en JavaScript no necesitan ser recompiladas, reinstaladas o redistribuidas a medida que una nueva versión principal de Node.js se introduce en el entorno de producción en el que se ejecutan dichas aplicaciones. Por el contrario, si una aplicación depende de un paquete que contiene un complemento nativo, la aplicación tiene que ser recompilada, reinstalada y redistribuida cada vez que se introduce una nueva versión principal de Node.js en el entorno de producción. Esta disparidad entre los paquetes de Node.js que contienen complementos nativos y los que están escritos completamente en JavaScript ha aumentado la carga de mantenimiento de los sistemas de producción que dependen de complementos nativos.

- Otros proyectos han comenzado a producir interfaces de JavaScript que son esencialmente implementaciones alternativas de Node.js. Dado que estos proyectos generalmente se construyen sobre un motor de JavaScript diferente al V8, sus complementos nativos necesariamente adoptan una estructura diferente y utilizan una API diferente. Sin embargo, el uso de una sola API para un complemento nativo en diferentes implementaciones de la API de JavaScript de Node.js permitiría a estos proyectos aprovechar el ecosistema de paquetes de JavaScript que se ha acumulado alrededor de Node.js.

- Node.js puede contener un motor de JavaScript diferente en el futuro. Esto significa que, externamente, todas las interfaces de Node.js seguirían siendo las mismas, pero el archivo de encabezado V8 estaría ausente. Tal paso causaría la interrupción del ecosistema de Node.js en general, y el de los complementos nativos en particular, si Node.js no proporciona primero una API que sea agnóstica del motor de JavaScript y es adoptada por los complementos nativos.

Con estos fines, Node.js ha introducido N-API en la versión 8.6.0 y la ha marcado como un componente estable del proyecto a partir de Node.js 8.12.0. La API se define en los encabezados `node_api.h` y `node_api_types.h`, y proporciona una garantía de compatibilidad futura que cruza el límite de la versión principal de Node.js. La garantía se puede enunciar de la siguiente manera:

**Una versión dada n de N-API estará disponible en la versión principal de Node.js en la que se publicó, y en todas las versiones posteriores de Node.js, incluidas las versiones principales posteriores.**

Un autor de un complemento nativo puede aprovechar la garantía de compatibilidad futura de N-API asegurándose de que el complemento haga uso únicamente de las API definidas en `node_api.h` y las estructuras de datos y constantes definidas en `node_api_types.h`. Al hacerlo, el autor facilita la adopción de su complemento al indicar a los usuarios de producción que la carga de mantenimiento de su aplicación no aumentará más por la adición del complemento nativo a su proyecto de lo que lo haría por la adición de un paquete escrito puramente en JavaScript.

N-API está versionada porque se agregan nuevas API de vez en cuando. A diferencia del versionamiento semántico, el versionamiento de N-API es acumulativo. Es decir, cada versión de N-API transmite el mismo significado que una versión menor en el sistema semver, lo que significa que todos los cambios realizados en N-API serán compatibles con versiones anteriores. Además, las nuevas N-API se agregan bajo una bandera experimental para dar a la comunidad la oportunidad de vetarlas en un entorno de producción. El estado experimental significa que, aunque se ha tenido cuidado de asegurar que la nueva API no tendrá que ser modificada de una manera incompatible con la ABI en el futuro, aún no se ha probado lo suficiente en producción para ser correcta y útil tal como está diseñada y, como tal, puede sufrir cambios incompatibles con la ABI antes de que finalmente se incorpore a una próxima versión de N-API. Es decir, una N-API experimental aún no está cubierta por la garantía de compatibilidad futura.

