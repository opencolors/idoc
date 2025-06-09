---
title: API de Permisos de Node.js
description: La documentación de la API de Permisos de Node.js describe cómo gestionar y controlar los permisos para diversas operaciones dentro de las aplicaciones de Node.js, asegurando un acceso seguro y controlado a los recursos del sistema.
head:
  - - meta
    - name: og:title
      content: API de Permisos de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: La documentación de la API de Permisos de Node.js describe cómo gestionar y controlar los permisos para diversas operaciones dentro de las aplicaciones de Node.js, asegurando un acceso seguro y controlado a los recursos del sistema.
  - - meta
    - name: twitter:title
      content: API de Permisos de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: La documentación de la API de Permisos de Node.js describe cómo gestionar y controlar los permisos para diversas operaciones dentro de las aplicaciones de Node.js, asegurando un acceso seguro y controlado a los recursos del sistema.
---


# Permisos {#permissions}

Los permisos se pueden usar para controlar a qué recursos del sistema tiene acceso el proceso de Node.js o qué acciones puede realizar el proceso con esos recursos.

- [Permisos basados en procesos](/es/nodejs/api/permissions#process-based-permissions) controlan el acceso del proceso de Node.js a los recursos. El recurso puede ser totalmente permitido o denegado, o las acciones relacionadas con él pueden ser controladas. Por ejemplo, las lecturas del sistema de archivos pueden ser permitidas mientras que se deniegan las escrituras. Esta característica no protege contra código malicioso. De acuerdo con la [Política de seguridad](https://github.com/nodejs/node/blob/main/SECURITY.md) de Node.js, Node.js confía en cualquier código que se le pida ejecutar.

El modelo de permisos implementa un enfoque de "cinturón de seguridad", que evita que el código de confianza cambie involuntariamente los archivos o use recursos cuyo acceso no ha sido explícitamente concedido. No proporciona garantías de seguridad en presencia de código malicioso. El código malicioso puede eludir el modelo de permisos y ejecutar código arbitrario sin las restricciones impuestas por el modelo de permisos.

Si encuentra una posible vulnerabilidad de seguridad, consulte nuestra [Política de seguridad](https://github.com/nodejs/node/blob/main/SECURITY.md).

## Permisos basados en procesos {#process-based-permissions}

### Modelo de permisos {#permission-model}

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable.
:::

El Modelo de permisos de Node.js es un mecanismo para restringir el acceso a recursos específicos durante la ejecución. La API existe detrás de una bandera [`--permission`](/es/nodejs/api/cli#--permission) que cuando se habilita, restringirá el acceso a todos los permisos disponibles.

Los permisos disponibles están documentados por la bandera [`--permission`](/es/nodejs/api/cli#--permission).

Al iniciar Node.js con `--permission`, la capacidad de acceder al sistema de archivos a través del módulo `fs`, generar procesos, usar `node:worker_threads`, usar complementos nativos, usar WASI y habilitar el inspector de tiempo de ejecución estará restringida.

```bash [BASH]
$ node --permission index.js

Error: Access to this API has been restricted
    at node:internal/main/run_main_module:23:47 {
  code: 'ERR_ACCESS_DENIED',
  permission: 'FileSystemRead',
  resource: '/home/user/index.js'
}
```

Permitir el acceso a la generación de un proceso y la creación de hilos de trabajador se puede hacer usando [`--allow-child-process`](/es/nodejs/api/cli#--allow-child-process) y [`--allow-worker`](/es/nodejs/api/cli#--allow-worker) respectivamente.

Para permitir complementos nativos al usar el modelo de permisos, use la bandera [`--allow-addons`](/es/nodejs/api/cli#--allow-addons). Para WASI, use la bandera [`--allow-wasi`](/es/nodejs/api/cli#--allow-wasi).


#### API de Tiempo de Ejecución {#runtime-api}

Al habilitar el Modelo de Permisos a través del flag [`--permission`](/es/nodejs/api/cli#--permission), se agrega una nueva propiedad `permission` al objeto `process`. Esta propiedad contiene una función:

##### `permission.has(scope[, reference])` {#permissionhasscope-reference}

Llamada a la API para verificar los permisos en tiempo de ejecución ([`permission.has()`](/es/nodejs/api/process#processpermissionhasscope-reference))

```js [ESM]
process.permission.has('fs.write'); // true
process.permission.has('fs.write', '/home/rafaelgss/protected-folder'); // true

process.permission.has('fs.read'); // true
process.permission.has('fs.read', '/home/rafaelgss/protected-folder'); // false
```
#### Permisos del Sistema de Archivos {#file-system-permissions}

El Modelo de Permisos, por defecto, restringe el acceso al sistema de archivos a través del módulo `node:fs`. No garantiza que los usuarios no puedan acceder al sistema de archivos por otros medios, como a través del módulo `node:sqlite`.

Para permitir el acceso al sistema de archivos, utilice los flags [`--allow-fs-read`](/es/nodejs/api/cli#--allow-fs-read) y [`--allow-fs-write`](/es/nodejs/api/cli#--allow-fs-write):

```bash [BASH]
$ node --permission --allow-fs-read=* --allow-fs-write=* index.js
Hello world!
```
Los argumentos válidos para ambos flags son:

- `*` - Para permitir todas las operaciones `FileSystemRead` o `FileSystemWrite`, respectivamente.
- Rutas delimitadas por comas (`,`) para permitir solo las operaciones `FileSystemRead` o `FileSystemWrite` coincidentes, respectivamente.

Ejemplo:

- `--allow-fs-read=*` - Permitirá todas las operaciones `FileSystemRead`.
- `--allow-fs-write=*` - Permitirá todas las operaciones `FileSystemWrite`.
- `--allow-fs-write=/tmp/` - Permitirá el acceso `FileSystemWrite` a la carpeta `/tmp/`.
- `--allow-fs-read=/tmp/ --allow-fs-read=/home/.gitignore` - Permite el acceso `FileSystemRead` a la carpeta `/tmp/` **y** la ruta `/home/.gitignore`.

También se admiten comodines:

- `--allow-fs-read=/home/test*` permitirá el acceso de lectura a todo lo que coincida con el comodín. por ejemplo: `/home/test/file1` o `/home/test2`

Después de pasar un carácter comodín (`*`), todos los caracteres posteriores se ignorarán. Por ejemplo: `/home/*.js` funcionará de manera similar a `/home/*`.

Cuando se inicializa el modelo de permisos, agregará automáticamente un comodín (*) si el directorio especificado existe. Por ejemplo, si `/home/test/files` existe, se tratará como `/home/test/files/*`. Sin embargo, si el directorio no existe, el comodín no se agregará y el acceso se limitará a `/home/test/files`. Si desea permitir el acceso a una carpeta que aún no existe, asegúrese de incluir explícitamente el comodín: `/my-path/folder-do-not-exist/*`.


#### Restricciones del modelo de permisos {#permission-model-constraints}

Existen restricciones que debe conocer antes de utilizar este sistema:

- El modelo no hereda a un proceso de nodo hijo o un hilo de trabajo.
- Cuando se utiliza el modelo de permisos, las siguientes características estarán restringidas:
    - Módulos nativos
    - Proceso hijo
    - Hilos de trabajo
    - Protocolo de inspector
    - Acceso al sistema de archivos
    - WASI
  
 
- El modelo de permisos se inicializa después de que se configura el entorno de Node.js. Sin embargo, ciertas banderas como `--env-file` o `--openssl-config` están diseñadas para leer archivos antes de la inicialización del entorno. Como resultado, tales banderas no están sujetas a las reglas del modelo de permisos. Lo mismo se aplica a las banderas de V8 que se pueden establecer a través del tiempo de ejecución mediante `v8.setFlagsFromString`.
- Los motores OpenSSL no se pueden solicitar en tiempo de ejecución cuando el modelo de permisos está habilitado, lo que afecta a los módulos crypto, https y tls integrados.
- Las extensiones cargables en tiempo de ejecución no se pueden cargar cuando el modelo de permisos está habilitado, lo que afecta al módulo sqlite.
- El uso de descriptores de archivos existentes a través del módulo `node:fs` omite el modelo de permisos.

#### Limitaciones y problemas conocidos {#limitations-and-known-issues}

- Los enlaces simbólicos se seguirán incluso a ubicaciones fuera del conjunto de rutas a las que se ha concedido acceso. Los enlaces simbólicos relativos pueden permitir el acceso a archivos y directorios arbitrarios. Al iniciar aplicaciones con el modelo de permisos habilitado, debe asegurarse de que ninguna ruta a la que se haya concedido acceso contenga enlaces simbólicos relativos.

