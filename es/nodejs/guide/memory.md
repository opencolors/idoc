---
title: Depuración de problemas de memoria en Node.js
description: Aprenda a identificar y depurar problemas de memoria relacionados con aplicaciones Node.js, incluyendo fugas de memoria y uso ineficiente de la memoria.
head:
  - - meta
    - name: og:title
      content: Depuración de problemas de memoria en Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Aprenda a identificar y depurar problemas de memoria relacionados con aplicaciones Node.js, incluyendo fugas de memoria y uso ineficiente de la memoria.
  - - meta
    - name: twitter:title
      content: Depuración de problemas de memoria en Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Aprenda a identificar y depurar problemas de memoria relacionados con aplicaciones Node.js, incluyendo fugas de memoria y uso ineficiente de la memoria.
---


# Memoria

En este documento puede aprender sobre cómo depurar problemas relacionados con la memoria.

## Mi proceso se queda sin memoria

Node.js (*JavaScript*) es un lenguaje con recolección de basura, por lo que es posible tener fugas de memoria a través de retenedores. Como las aplicaciones de Node.js suelen ser multiusuario, críticas para el negocio y de larga ejecución, proporcionar una forma accesible y eficiente de encontrar una fuga de memoria es esencial.

### Síntomas

El usuario observa un aumento continuo en el uso de la memoria (*puede ser rápido o lento, durante días o incluso semanas*), luego ve que el proceso se bloquea y se reinicia mediante el administrador de procesos. El proceso puede estar funcionando más lento que antes y los reinicios hacen que algunas solicitudes fallen (*el balanceador de carga responde con 502*).

### Efectos Secundarios

- Reinicios del proceso debido al agotamiento de la memoria y las solicitudes se descartan
- El aumento de la actividad de GC conduce a un mayor uso de la CPU y un tiempo de respuesta más lento
    - GC bloqueando el bucle de eventos causando lentitud
- El aumento del intercambio de memoria ralentiza el proceso (actividad de GC)
- Es posible que no haya suficiente memoria disponible para obtener una instantánea del montón

## Mi proceso utiliza la memoria de manera ineficiente

### Síntomas

La aplicación utiliza una cantidad inesperada de memoria y/o observamos una actividad elevada del recolector de basura.

### Efectos Secundarios

- Un número elevado de fallos de página
- Mayor actividad de GC y uso de CPU

