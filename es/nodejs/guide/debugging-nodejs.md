---
title: Depuración de Node.js
description: Opciones de depuración de Node.js, incluyendo --inspect, --inspect-brk y --debug, así como escenarios de depuración remota e información sobre el depurador heredado.
head:
  - - meta
    - name: og:title
      content: Depuración de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Opciones de depuración de Node.js, incluyendo --inspect, --inspect-brk y --debug, así como escenarios de depuración remota e información sobre el depurador heredado.
  - - meta
    - name: twitter:title
      content: Depuración de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Opciones de depuración de Node.js, incluyendo --inspect, --inspect-brk y --debug, así como escenarios de depuración remota e información sobre el depurador heredado.
---


# Depuración de Node.js

Esta guía te ayudará a empezar a depurar tus aplicaciones y scripts de Node.js.

## Habilitar el Inspector

Cuando se inicia con el modificador `--inspect`, un proceso de Node.js escucha a un cliente de depuración. Por defecto, escuchará en el host y puerto `127.0.0.1:9229`. A cada proceso también se le asigna un UUID único.

Los clientes del Inspector deben conocer y especificar la dirección del host, el puerto y el UUID para conectarse. Una URL completa se verá algo así: `ws://127.0.0.1:9229/0f2c936f-b1cd-4ac9-aab3-f63b0f33d55e`.

Node.js también empezará a escuchar mensajes de depuración si recibe una señal `SIGUSR1`. (La señal `SIGUSR1` no está disponible en Windows). En Node.js 7 y versiones anteriores, esto activa la API del Depurador heredado. En Node.js 8 y versiones posteriores, activará la API del Inspector.

## Implicaciones de seguridad

Dado que el depurador tiene acceso completo al entorno de ejecución de Node.js, un actor malicioso capaz de conectarse a este puerto podría ejecutar código arbitrario en nombre del proceso de Node.js. Es importante comprender las implicaciones de seguridad de exponer el puerto del depurador en redes públicas y privadas.

### Exponer públicamente el puerto de depuración no es seguro

Si el depurador está enlazado a una dirección IP pública, o a 0.0.0.0, cualquier cliente que pueda alcanzar tu dirección IP podrá conectarse al depurador sin ninguna restricción y podrá ejecutar código arbitrario.

Por defecto, `node --inspect` se enlaza a 127.0.0.1. Necesitas proporcionar explícitamente una dirección IP pública o 0.0.0.0, etc., si pretendes permitir conexiones externas al depurador. Hacerlo puede exponerte a una amenaza de seguridad potencialmente significativa. Te sugerimos que te asegures de que existen cortafuegos y controles de acceso adecuados para evitar una exposición a la seguridad.

Consulta la sección sobre '[Habilitación de escenarios de depuración remota](/es/nodejs/guide/debugging-nodejs#enabling-remote-debugging-scenarios)' para obtener algunos consejos sobre cómo permitir de forma segura que los clientes de depuración remota se conecten.

### Las aplicaciones locales tienen acceso completo al inspector

Incluso si enlazas el puerto del inspector a 127.0.0.1 (el valor por defecto), cualquier aplicación que se ejecute localmente en tu máquina tendrá acceso sin restricciones. Esto es por diseño para permitir que los depuradores locales puedan adjuntarse convenientemente.


### Navegadores, WebSockets y política del mismo origen

Los sitios web que se abren en un navegador web pueden realizar solicitudes WebSocket y HTTP bajo el modelo de seguridad del navegador. Se necesita una conexión HTTP inicial para obtener un ID de sesión de depuración único. La política del mismo origen impide que los sitios web puedan realizar esta conexión HTTP. Para mayor seguridad contra [ataques de revinculación de DNS](https://en.wikipedia.org/wiki/DNS_rebinding), Node.js verifica que los encabezados 'Host' para la conexión especifiquen una dirección IP o `localhost` precisamente.

Estas políticas de seguridad impiden la conexión a un servidor de depuración remoto especificando el nombre de host. Puede solucionar esta restricción especificando la dirección IP o utilizando túneles ssh como se describe a continuación.

## Clientes del Inspector

Un depurador CLI mínimo está disponible con node inspect myscript.js. Varias herramientas comerciales y de código abierto también pueden conectarse al Inspector de Node.js.

### Chrome DevTools 55+, Microsoft Edge
+ **Opción 1**: Abra `chrome://inspect` en un navegador basado en Chromium o `edge://inspect` en Edge. Haga clic en el botón Configurar y asegúrese de que su host y puerto de destino estén en la lista.
+ **Opción 2**: Copie el `devtoolsFrontendUrl` de la salida de `/json/list` (ver arriba) o el texto de sugerencia `--inspect` y péguelo en Chrome.

Consulte [https://github.com/ChromeDevTools/devtools-frontend](https://github.com/ChromeDevTools/devtools-frontend), [https://www.microsoftedgeinsider.com](https://www.microsoftedgeinsider.com) para obtener más información.

### Visual Studio Code 1.10+
+ En el panel Depurar, haga clic en el icono de configuración para abrir `.vscode/launch.json`. Seleccione "Node.js" para la configuración inicial.

Consulte [https://github.com/microsoft/vscode](https://github.com/microsoft/vscode) para obtener más información.

### JetBrains WebStorm y otros IDE de JetBrains

+ Cree una nueva configuración de depuración de Node.js y pulse Depurar. `--inspect` se utilizará de forma predeterminada para Node.js 7+. Para deshabilitar, desmarque `js.debugger.node.use.inspect` en el Registro del IDE. Para obtener más información sobre cómo ejecutar y depurar Node.js en WebStorm y otros IDE de JetBrains, consulte [ayuda en línea de WebStorm](https://www.jetbrains.com/help/webstorm/running-and-debugging-node-js.html).


### chrome-remote-interface

+ Librería para facilitar las conexiones a los endpoints del [Protocolo Inspector](https://chromedevtools.github.io/debugger-protocol-viewer/v8/).
Ver [https://github.com/cyrus-and/chrome-remote-interface](https://github.com/cyrus-and/chrome-remote-interface) para más información.

### Gitpod

+ Inicie una configuración de depuración de Node.js desde la vista `Debug` o presione `F5`. Instrucciones detalladas

Ver [https://www.gitpod.io](https://www.gitpod.io) para más información.

### Eclipse IDE con la extensión Eclipse Wild Web Developer

+ Desde un archivo `.js`, elija `Debug As... > Node program`, o cree una configuración de depuración para adjuntar el depurador a la aplicación Node.js en ejecución (ya iniciada con `--inspect`).

Ver [https://eclipse.org/eclipseide](https://eclipse.org/eclipseide) para más información.

## Opciones de línea de comandos

La siguiente tabla enumera el impacto de varias flags de tiempo de ejecución en la depuración:

| Flag | Significado |
| --- | --- |
| `--inspect` | Habilita la depuración con el Inspector de Node.js. Escucha en la dirección y el puerto predeterminados (127.0.0.1:9229) |
| `--inspect-brk` | Habilita la depuración con el Inspector de Node.js. Escucha en la dirección y el puerto predeterminados (127.0.0.1:9229); Interrumpe antes de que comience el código del usuario |
| `--inspect=[host:port]` | Habilita el agente inspector; Se une a la dirección o al nombre de host (predeterminado: 127.0.0.1); Escucha en el puerto (predeterminado: 9229) |
| `--inspect-brk=[host:port]` | Habilita el agente inspector; Se une a la dirección o al nombre de host (predeterminado: 127.0.0.1); Escucha en el puerto (predeterminado: 9229); Interrumpe antes de que comience el código del usuario |
| `--inspect-wait` | Habilita el agente inspector; Escucha en la dirección y el puerto predeterminados (127.0.0.1:9229); Espera a que se adjunte el depurador. |
| `--inspect-wait=[host:port]` | Habilita el agente inspector; Se une a la dirección o al nombre de host (predeterminado: 127.0.0.1); Escucha en el puerto (predeterminado: 9229); Espera a que se adjunte el depurador. |
| `node inspect script.js` | Engendra un proceso hijo para ejecutar el script del usuario bajo la flag --inspect; y usa el proceso principal para ejecutar el depurador CLI. |
| `node inspect --port=xxxx script.js` | Engendra un proceso hijo para ejecutar el script del usuario bajo la flag --inspect; y usa el proceso principal para ejecutar el depurador CLI. Escucha en el puerto (predeterminado: 9229) |


## Habilitación de escenarios de depuración remota

Recomendamos que nunca haga que el depurador escuche en una dirección IP pública. Si necesita permitir conexiones de depuración remota, recomendamos el uso de túneles ssh en su lugar. Proporcionamos el siguiente ejemplo solo con fines ilustrativos. Por favor, comprenda el riesgo de seguridad de permitir el acceso remoto a un servicio privilegiado antes de continuar.

Digamos que está ejecutando Node.js en una máquina remota, remote.example.com, que desea poder depurar. En esa máquina, debe iniciar el proceso de nodo con el inspector escuchando solo a localhost (el valor predeterminado).

```bash
node --inspect app.js
```

Ahora, en su máquina local desde donde desea iniciar una conexión de cliente de depuración, puede configurar un túnel ssh:

```bash
ssh -L 9225:localhost:9229 remote.example.com
```

Esto inicia una sesión de túnel ssh donde una conexión al puerto 9221 en su máquina local se reenviará al puerto 9229 en remote.example.com. Ahora puede adjuntar un depurador como Chrome DevTools o Visual Studio Code a localhost:9221, que debería poder depurar como si la aplicación Node.js se estuviera ejecutando localmente.

## Depurador Legacy

**El depurador legacy ha sido desaprobado a partir de Node.js 7.7.0. Por favor, use --inspect e Inspector en su lugar.**

Cuando se inicia con los modificadores `--debug` o `--debug-brk` en la versión 7 y anteriores, Node.js escucha los comandos de depuración definidos por el Protocolo de Depuración V8 descontinuado en un puerto TCP, por defecto `5858`. Cualquier cliente de depuración que hable este protocolo puede conectarse y depurar el proceso en ejecución; a continuación se enumeran algunos populares.

El Protocolo de Depuración V8 ya no se mantiene ni se documenta.

### Depurador integrado

Inicie `node debug script_name.js` para iniciar su script bajo el depurador de línea de comandos integrado. Su script se inicia en otro proceso de Node.js iniciado con la opción `--debug-brk`, y el proceso inicial de Node.js ejecuta el script `_debugger.js` y se conecta a su objetivo. Consulte [docs](/es/nodejs/api/debugger) para obtener más información.


### node-inspector

Depura tu aplicación Node.js con las Chrome DevTools mediante un proceso intermediario que traduce el [Protocolo del Inspector](https://chromedevtools.github.io/debugger-protocol-viewer/v8/) utilizado en Chromium al protocolo V8 Debugger utilizado en Node.js. Consulta [https://github.com/node-inspector/node-inspector](https://github.com/node-inspector/node-inspector) para obtener más información.

