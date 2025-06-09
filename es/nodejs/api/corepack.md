---
title: Documentación de Corepack de Node.js
description: Corepack es un binario que se distribuye con Node.js, proporcionando una interfaz estándar para gestionar gestores de paquetes como npm, pnpm y Yarn. Permite a los usuarios cambiar fácilmente entre diferentes gestores de paquetes y versiones, asegurando la compatibilidad y simplificando el flujo de trabajo de desarrollo.
head:
  - - meta
    - name: og:title
      content: Documentación de Corepack de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Corepack es un binario que se distribuye con Node.js, proporcionando una interfaz estándar para gestionar gestores de paquetes como npm, pnpm y Yarn. Permite a los usuarios cambiar fácilmente entre diferentes gestores de paquetes y versiones, asegurando la compatibilidad y simplificando el flujo de trabajo de desarrollo.
  - - meta
    - name: twitter:title
      content: Documentación de Corepack de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Corepack es un binario que se distribuye con Node.js, proporcionando una interfaz estándar para gestionar gestores de paquetes como npm, pnpm y Yarn. Permite a los usuarios cambiar fácilmente entre diferentes gestores de paquetes y versiones, asegurando la compatibilidad y simplificando el flujo de trabajo de desarrollo.
---


# Corepack {#corepack}

**Añadido en: v16.9.0, v14.19.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

*<a href="https://github.com/nodejs/corepack">Corepack</a>* es una herramienta experimental para ayudar a gestionar las versiones de tus gestores de paquetes. Expone proxies binarios para cada [gestor de paquetes soportado](/es/nodejs/api/corepack#supported-package-managers) que, cuando se llaman, identificarán qué gestor de paquetes está configurado para el proyecto actual, lo descargarán si es necesario y, finalmente, lo ejecutarán.

A pesar de que Corepack se distribuye con las instalaciones predeterminadas de Node.js, los gestores de paquetes gestionados por Corepack no forman parte de la distribución de Node.js y:

- En el primer uso, Corepack descarga la última versión de la red.
- Cualquier actualización requerida (relacionada con vulnerabilidades de seguridad o de otro tipo) está fuera del alcance del proyecto Node.js. Si es necesario, los usuarios finales deben averiguar cómo actualizar por su cuenta.

Esta característica simplifica dos flujos de trabajo principales:

- Facilita la incorporación de nuevos colaboradores, ya que ya no tendrán que seguir procesos de instalación específicos del sistema solo para tener el gestor de paquetes que deseas que tengan.
- Te permite asegurarte de que todos en tu equipo usarán exactamente la versión del gestor de paquetes que deseas que usen, sin que tengan que sincronizarla manualmente cada vez que necesites hacer una actualización.

## Flujos de trabajo {#workflows}

### Habilitar la característica {#enabling-the-feature}

Debido a su estado experimental, Corepack actualmente necesita ser habilitado explícitamente para tener algún efecto. Para ello, ejecuta [`corepack enable`](https://github.com/nodejs/corepack#corepack-enable--name), que configurará los enlaces simbólicos en tu entorno junto al binario `node` (y sobrescribirá los enlaces simbólicos existentes si es necesario).

A partir de este momento, cualquier llamada a los [binarios soportados](/es/nodejs/api/corepack#supported-package-managers) funcionará sin necesidad de configuración adicional. Si experimentas algún problema, ejecuta [`corepack disable`](https://github.com/nodejs/corepack#corepack-disable--name) para eliminar los proxies de tu sistema (y considera la posibilidad de abrir un problema en el [repositorio de Corepack](https://github.com/nodejs/corepack) para hacérnoslo saber).


### Configurando un paquete {#configuring-a-package}

Los proxies de Corepack encontrarán el archivo [`package.json`](/es/nodejs/api/packages#nodejs-packagejson-field-definitions) más cercano en la jerarquía de tu directorio actual para extraer su propiedad [`"packageManager"`](/es/nodejs/api/packages#packagemanager).

Si el valor corresponde a un [administrador de paquetes soportado](/es/nodejs/api/corepack#supported-package-managers), Corepack se asegurará de que todas las llamadas a los binarios relevantes se ejecuten contra la versión solicitada, descargándola bajo demanda si es necesario y abortando si no se puede recuperar correctamente.

Puedes usar [`corepack use`](https://github.com/nodejs/corepack#corepack-use-nameversion) para pedirle a Corepack que actualice tu `package.json` local para usar el administrador de paquetes de tu elección:

```bash [BASH]
corepack use  # establece la última versión 7.x en el package.json
corepack use yarn@* # establece la última versión en el package.json
```
### Actualizando las versiones globales {#upgrading-the-global-versions}

Cuando se ejecuta fuera de un proyecto existente (por ejemplo, al ejecutar `yarn init`), Corepack utilizará por defecto versiones predefinidas que corresponden aproximadamente a las últimas versiones estables de cada herramienta. Esas versiones se pueden anular ejecutando el comando [`corepack install`](https://github.com/nodejs/corepack#corepack-install--g--global---all--nameversion) junto con la versión del administrador de paquetes que deseas establecer:

```bash [BASH]
corepack install --global 
```
Alternativamente, se puede usar una etiqueta o rango:

```bash [BASH]
corepack install --global pnpm@*
corepack install --global yarn@stable
```
### Flujo de trabajo sin conexión {#offline-workflow}

Muchos entornos de producción no tienen acceso a la red. Dado que Corepack generalmente descarga las versiones del administrador de paquetes directamente desde sus registros, puede entrar en conflicto con dichos entornos. Para evitar que eso suceda, llama al comando [`corepack pack`](https://github.com/nodejs/corepack#corepack-pack---all--nameversion) mientras todavía tienes acceso a la red (normalmente al mismo tiempo que estás preparando tu imagen de despliegue). Esto garantizará que los administradores de paquetes requeridos estén disponibles incluso sin acceso a la red.

El comando `pack` tiene [varias banderas](https://github.com/nodejs/corepack#utility-commands). Consulta la [documentación detallada de Corepack](https://github.com/nodejs/corepack#readme) para obtener más información.


## Administradores de paquetes compatibles {#supported-package-managers}

Los siguientes binarios se proporcionan a través de Corepack:

| Administrador de paquetes | Nombres de binarios |
| --- | --- |
| [Yarn](https://yarnpkg.com/) | `yarn`  ,   `yarnpkg` |
| [pnpm](https://pnpm.io/) | `pnpm`  ,   `pnpx` |
## Preguntas comunes {#common-questions}

### ¿Cómo interactúa Corepack con npm? {#how-does-corepack-interact-with-npm?}

Si bien Corepack podría admitir npm como cualquier otro administrador de paquetes, sus shims no están habilitados de forma predeterminada. Esto tiene algunas consecuencias:

-  Siempre es posible ejecutar un comando `npm` dentro de un proyecto configurado para ser usado con otro administrador de paquetes, ya que Corepack no puede interceptarlo.
-  Si bien `npm` es una opción válida en la propiedad [`"packageManager"`](/es/nodejs/api/packages#packagemanager), la falta de shim hará que se utilice el npm global.

### Ejecutar `npm install -g yarn` no funciona {#running-npm-install--g-yarn-doesnt-work}

npm evita la sobreescritura accidental de los binarios de Corepack al realizar una instalación global. Para evitar este problema, considere una de las siguientes opciones:

-  No ejecute este comando; Corepack proporcionará los binarios del administrador de paquetes de todos modos y se asegurará de que las versiones solicitadas estén siempre disponibles, por lo que no es necesario instalar los administradores de paquetes explícitamente.
-  Agregue el flag `--force` a `npm install`; esto le dirá a npm que está bien sobrescribir binarios, pero borrará los de Corepack en el proceso. (Ejecute [`corepack enable`](https://github.com/nodejs/corepack#corepack-enable--name) para agregarlos de nuevo.)

