---
title: Gráficos de llamas para la optimización del rendimiento de Node.js
description: Aprenda a crear gráficos de llamas para visualizar el tiempo de CPU dedicado a las funciones y optimizar el rendimiento de Node.js.
head:
  - - meta
    - name: og:title
      content: Gráficos de llamas para la optimización del rendimiento de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Aprenda a crear gráficos de llamas para visualizar el tiempo de CPU dedicado a las funciones y optimizar el rendimiento de Node.js.
  - - meta
    - name: twitter:title
      content: Gráficos de llamas para la optimización del rendimiento de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Aprenda a crear gráficos de llamas para visualizar el tiempo de CPU dedicado a las funciones y optimizar el rendimiento de Node.js.
---


# Gráficos de Llamas

## ¿Para qué sirve un gráfico de llamas?

Los gráficos de llamas son una forma de visualizar el tiempo de CPU dedicado a las funciones. Pueden ayudarte a identificar dónde pasas demasiado tiempo realizando operaciones síncronas.

## Cómo crear un gráfico de llamas

Es posible que hayas oído que crear un gráfico de llamas para Node.js es difícil, pero eso no es cierto (ya no). ¡Las máquinas virtuales Solaris ya no son necesarias para los gráficos de llamas!

Los gráficos de llamas se generan a partir de la salida de `perf`, que no es una herramienta específica de node. Si bien es la forma más poderosa de visualizar el tiempo de CPU dedicado, puede tener problemas con la forma en que el código JavaScript se optimiza en Node.js 8 y superior. Consulta la sección [problemas de salida de perf](#perf-output-issues) a continuación.

### Utiliza una herramienta preempaquetada
Si deseas un solo paso que produzca un gráfico de llamas localmente, prueba [0x](https://www.npmjs.com/package/0x)

Para diagnosticar implementaciones de producción, lee estas notas: [0x servidores de producción](https://github.com/davidmarkclements/0x/blob/master/docs/production-servers.md).

### Crea un gráfico de llamas con las herramientas del sistema perf
El propósito de esta guía es mostrar los pasos involucrados en la creación de un gráfico de llamas y mantenerte en control de cada paso.

Si deseas comprender mejor cada paso, echa un vistazo a las secciones que siguen donde entraremos en más detalles.

Ahora, pongámonos a trabajar.

1. Instala `perf` (generalmente disponible a través del paquete linux-tools-common si aún no está instalado)
2. Intenta ejecutar `perf`: podría quejarse de que faltan módulos del kernel, instálalos también
3. Ejecuta node con perf habilitado (consulta [problemas de salida de perf](#perf-output-issues) para obtener consejos específicos de las versiones de Node.js)
```bash
perf record -e cycles:u -g -- node --perf-basic-prof app.js
```
4. Ignora las advertencias a menos que digan que no puedes ejecutar perf debido a la falta de paquetes; es posible que recibas algunas advertencias sobre la imposibilidad de acceder a las muestras del módulo del kernel que no estás buscando de todos modos.
5. Ejecuta `perf script > perfs.out` para generar el archivo de datos que visualizarás en un momento. Es útil aplicar una limpieza para obtener un gráfico más legible
6. Instala stackvis si aún no está instalado `npm i -g stackvis`
7. Ejecuta `stackvis perf < perfs.out > flamegraph.htm`

Ahora abre el archivo de gráfico de llamas en tu navegador favorito y observa cómo se quema. Está codificado por colores para que puedas concentrarte primero en las barras naranjas más saturadas. Es probable que representen funciones que consumen mucha CPU.

Vale la pena mencionar: si haces clic en un elemento de un gráfico de llamas, se mostrará un zoom de sus alrededores encima del gráfico.


### Usando `perf` para muestrear un proceso en ejecución

Esto es genial para grabar datos de gráficos de llamas de un proceso ya en ejecución que no quieres interrumpir. Imagina un proceso en producción con un problema difícil de reproducir.

```bash
perf record -F99 -p `pgrep -n node` -- sleep 3
```

¿Para qué sirve ese `sleep 3`? Está ahí para mantener `perf` en ejecución: a pesar de que la opción `-p` apunta a un PID diferente, el comando necesita ser ejecutado en un proceso y terminar con él. `perf` se ejecuta durante la vida útil del comando que le pasas, independientemente de si realmente estás perfilando ese comando. `sleep 3` asegura que `perf` se ejecute durante 3 segundos.

¿Por qué `-F` (frecuencia de perfilado) está establecido en 99? Es un valor predeterminado razonable. Puedes ajustarlo si quieres. `-F99` le dice a `perf` que tome 99 muestras por segundo, para mayor precisión aumenta el valor. Los valores más bajos deberían producir menos salida con resultados menos precisos. La precisión que necesitas depende de cuánto tiempo realmente se ejecutan tus funciones intensivas en CPU. Si estás buscando la razón de una ralentización notable, 99 fotogramas por segundo deberían ser más que suficientes.

Después de obtener ese registro de `perf` de 3 segundos, continúa con la generación del gráfico de llamas con los dos últimos pasos de arriba.

### Filtrando las funciones internas de Node.js

Normalmente, solo quieres observar el rendimiento de tus llamadas, por lo que filtrar las funciones internas de Node.js y V8 puede hacer que el gráfico sea mucho más fácil de leer. Puedes limpiar tu archivo `perf` con:

```bash
sed -i -r \
    -e '/(_libc_start|LazyCompile) |v8::internal::BuiltIn|Stub|LoadIC:\\[\\[' \
    -e '/^$/d' \
    perf.data > perf.out
```

Si lees tu gráfico de llamas y te parece extraño, como si faltara algo en la función clave que ocupa la mayor parte del tiempo, intenta generar tu gráfico de llamas sin los filtros; tal vez tengas un caso raro de un problema con el propio Node.js.

### Opciones de perfilado de Node.js

`--perf-basic-prof-only-functions` y `--perf-basic-prof` son las dos que son útiles para depurar tu código JavaScript. Otras opciones se utilizan para perfilar el propio Node.js, lo cual está fuera del alcance de esta guía.

`--perf-basic-prof-only-functions` produce menos salida, por lo que es la opción con la menor sobrecarga.


### ¿Por qué los necesito en absoluto?

Bueno, sin estas opciones, aún obtendrá un gráfico de llamas, pero con la mayoría de las barras etiquetadas como `v8::Function::Call`.

## Problemas con la salida de `Perf`

### Cambios en el pipeline V8 de Node.js 8.x

Node.js 8.x y superior se envían con nuevas optimizaciones al pipeline de compilación de JavaScript en el motor V8 que hacen que los nombres/referencias de las funciones sean inalcanzables para perf a veces. (Se llama Turbofan)

El resultado es que es posible que no obtenga los nombres de sus funciones correctamente en el gráfico de llamas.

Notará `ByteCodeHandler:` donde esperaría nombres de funciones.

0x tiene algunas mitigaciones integradas para eso.

Para más detalles, consulte:
- <https://github.com/nodejs/benchmarking/issues/168>
- <https://github.com/nodejs/diagnostics/issues/148#issuecomment-369348961>

### Node.js 10+

Node.js 10.x soluciona el problema con Turbofan usando el indicador `--interpreted-frames-native-stack`.

Ejecute `node --interpreted-frames-native-stack --perf-basic-prof-only-functions` para obtener los nombres de las funciones en el gráfico de llamas independientemente de qué pipeline utilizó V8 para compilar su JavaScript.

### Etiquetas rotas en el gráfico de llamas

Si ve etiquetas como esta

```bash
node`_ZN2v88internal11interpreter17BytecodeGenerator15VisitStatementsEPMS0_8Zone
```

significa que el Linux perf que está utilizando no se compiló con soporte de demangle, consulte <https://bugs.launchpad.net/ubuntu/+source/linux/+bug/1396654> por ejemplo

## Ejemplos

¡Practique la captura de gráficos de llamas usted mismo con un [ejercicio de gráficos de llamas](https://github.com/naugtur/node-example-flamegraph)!

