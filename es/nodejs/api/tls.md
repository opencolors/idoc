---
title: Documentación de Node.js - TLS (Seguridad de la Capa de Transporte)
description: Esta sección de la documentación de Node.js cubre el módulo TLS (Seguridad de la Capa de Transporte), que proporciona una implementación de los protocolos TLS y SSL. Incluye detalles sobre la creación de conexiones seguras, la gestión de certificados, el manejo de la comunicación segura y varias opciones para configurar TLS/SSL en aplicaciones Node.js.
head:
  - - meta
    - name: og:title
      content: Documentación de Node.js - TLS (Seguridad de la Capa de Transporte) | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Esta sección de la documentación de Node.js cubre el módulo TLS (Seguridad de la Capa de Transporte), que proporciona una implementación de los protocolos TLS y SSL. Incluye detalles sobre la creación de conexiones seguras, la gestión de certificados, el manejo de la comunicación segura y varias opciones para configurar TLS/SSL en aplicaciones Node.js.
  - - meta
    - name: twitter:title
      content: Documentación de Node.js - TLS (Seguridad de la Capa de Transporte) | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Esta sección de la documentación de Node.js cubre el módulo TLS (Seguridad de la Capa de Transporte), que proporciona una implementación de los protocolos TLS y SSL. Incluye detalles sobre la creación de conexiones seguras, la gestión de certificados, el manejo de la comunicación segura y varias opciones para configurar TLS/SSL en aplicaciones Node.js.
---


# TLS (SSL) {#tls-ssl}

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable
:::

**Código fuente:** [lib/tls.js](https://github.com/nodejs/node/blob/v23.5.0/lib/tls.js)

El módulo `node:tls` proporciona una implementación de los protocolos Transport Layer Security (TLS) y Secure Socket Layer (SSL) que se construye sobre OpenSSL. Se puede acceder al módulo usando:

::: code-group
```js [ESM]
import tls from 'node:tls';
```

```js [CJS]
const tls = require('node:tls');
```
:::

## Determinación de si el soporte criptográfico no está disponible {#determining-if-crypto-support-is-unavailable}

Es posible que Node.js se compile sin incluir soporte para el módulo `node:crypto`. En tales casos, intentar `import` desde `tls` o llamar a `require('node:tls')` resultará en que se lance un error.

Cuando se usa CommonJS, el error lanzado puede ser capturado usando try/catch:

```js [CJS]
let tls;
try {
  tls = require('node:tls');
} catch (err) {
  console.error('¡el soporte de tls está deshabilitado!');
}
```
Cuando se usa la palabra clave léxica ESM `import`, el error solo se puede capturar si se registra un controlador para `process.on('uncaughtException')` *antes* de que se intente cargar el módulo (usando, por ejemplo, un módulo de precarga).

Cuando se usa ESM, si existe la posibilidad de que el código pueda ejecutarse en una compilación de Node.js donde el soporte criptográfico no está habilitado, considere usar la función [`import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) en lugar de la palabra clave léxica `import`:

```js [ESM]
let tls;
try {
  tls = await import('node:tls');
} catch (err) {
  console.error('¡el soporte de tls está deshabilitado!');
}
```
## Conceptos de TLS/SSL {#tls/ssl-concepts}

TLS/SSL es un conjunto de protocolos que se basan en una infraestructura de clave pública (PKI) para permitir la comunicación segura entre un cliente y un servidor. Para los casos más comunes, cada servidor debe tener una clave privada.

Las claves privadas se pueden generar de múltiples maneras. El siguiente ejemplo ilustra el uso de la interfaz de línea de comandos de OpenSSL para generar una clave privada RSA de 2048 bits:

```bash [BASH]
openssl genrsa -out ryans-key.pem 2048
```
Con TLS/SSL, todos los servidores (y algunos clientes) deben tener un *certificado*. Los certificados son *claves públicas* que corresponden a una clave privada, y que están firmadas digitalmente ya sea por una Autoridad de Certificación o por el propietario de la clave privada (tales certificados se denominan "auto-firmados"). El primer paso para obtener un certificado es crear un archivo de *Solicitud de Firma de Certificado* (CSR).

La interfaz de línea de comandos de OpenSSL se puede usar para generar un CSR para una clave privada:

```bash [BASH]
openssl req -new -sha256 -key ryans-key.pem -out ryans-csr.pem
```
Una vez que se genera el archivo CSR, se puede enviar a una Autoridad de Certificación para su firma o se puede usar para generar un certificado auto-firmado.

La creación de un certificado auto-firmado usando la interfaz de línea de comandos de OpenSSL se ilustra en el siguiente ejemplo:

```bash [BASH]
openssl x509 -req -in ryans-csr.pem -signkey ryans-key.pem -out ryans-cert.pem
```
Una vez que se genera el certificado, se puede usar para generar un archivo `.pfx` o `.p12`:

```bash [BASH]
openssl pkcs12 -export -in ryans-cert.pem -inkey ryans-key.pem \
      -certfile ca-cert.pem -out ryans.pfx
```
Donde:

- `in`: es el certificado firmado
- `inkey`: es la clave privada asociada
- `certfile`: es una concatenación de todos los certificados de la Autoridad de Certificación (CA) en un solo archivo, por ejemplo, `cat ca1-cert.pem ca2-cert.pem \> ca-cert.pem`


### Confidencialidad Perfecta Hacia Adelante {#perfect-forward-secrecy}

El término *<a href="https://en.wikipedia.org/wiki/Perfect_forward_secrecy">confidencialidad hacia adelante</a>* o *confidencialidad perfecta hacia adelante* describe una característica de los métodos de acuerdo de claves (es decir, intercambio de claves). Es decir, las claves del servidor y del cliente se utilizan para negociar nuevas claves temporales que se utilizan específica y únicamente para la sesión de comunicación actual. En la práctica, esto significa que incluso si la clave privada del servidor se ve comprometida, la comunicación solo puede ser descifrada por los espías si el atacante logra obtener el par de claves generado específicamente para la sesión.

La confidencialidad perfecta hacia adelante se logra generando aleatoriamente un par de claves para el acuerdo de claves en cada handshake TLS/SSL (en contraste con el uso de la misma clave para todas las sesiones). Los métodos que implementan esta técnica se denominan "efímeros".

Actualmente, se utilizan comúnmente dos métodos para lograr la confidencialidad perfecta hacia adelante (observe el carácter "E" añadido a las abreviaturas tradicionales):

- [ECDHE](https://en.wikipedia.org/wiki/Elliptic_curve_Diffie%E2%80%93Hellman): Una versión efímera del protocolo de acuerdo de claves Diffie-Hellman de curva elíptica.
- [DHE](https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange): Una versión efímera del protocolo de acuerdo de claves Diffie-Hellman.

La confidencialidad perfecta hacia adelante utilizando ECDHE está habilitada por defecto. La opción `ecdhCurve` se puede utilizar al crear un servidor TLS para personalizar la lista de curvas ECDH compatibles para usar. Consulte [`tls.createServer()`](/es/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener) para obtener más información.

DHE está deshabilitado por defecto, pero se puede habilitar junto con ECDHE configurando la opción `dhparam` en `'auto'`. También se admiten parámetros DHE personalizados, pero se desaconsejan en favor de parámetros bien conocidos seleccionados automáticamente.

La confidencialidad perfecta hacia adelante era opcional hasta TLSv1.2. A partir de TLSv1.3, (EC)DHE siempre se utiliza (con la excepción de las conexiones solo con PSK).

### ALPN y SNI {#alpn-and-sni}

ALPN (Extensión de Negociación de Protocolo de Capa de Aplicación) y SNI (Indicación del Nombre del Servidor) son extensiones de handshake TLS:

- ALPN: Permite el uso de un servidor TLS para múltiples protocolos (HTTP, HTTP/2)
- SNI: Permite el uso de un servidor TLS para múltiples nombres de host con diferentes certificados.


### Claves precompartidas {#pre-shared-keys}

La compatibilidad con TLS-PSK está disponible como una alternativa a la autenticación normal basada en certificados. Utiliza una clave precompartida en lugar de certificados para autenticar una conexión TLS, proporcionando autenticación mutua. TLS-PSK y la infraestructura de clave pública no son mutuamente excluyentes. Los clientes y los servidores pueden admitir ambos, eligiendo cualquiera de ellos durante el paso normal de negociación de cifrado.

TLS-PSK es una buena opción solo donde existen medios para compartir de forma segura una clave con cada máquina que se conecta, por lo que no reemplaza la infraestructura de clave pública (PKI) para la mayoría de los usos de TLS. La implementación de TLS-PSK en OpenSSL ha tenido muchos fallos de seguridad en los últimos años, principalmente porque solo la utiliza una minoría de aplicaciones. Considere todas las soluciones alternativas antes de cambiar a cifrados PSK. Al generar PSK, es de vital importancia utilizar suficiente entropía como se analiza en [RFC 4086](https://tools.ietf.org/html/rfc4086). Derivar un secreto compartido de una contraseña u otras fuentes de baja entropía no es seguro.

Los cifrados PSK están desactivados de forma predeterminada, y el uso de TLS-PSK, por lo tanto, requiere especificar explícitamente un conjunto de cifrado con la opción `ciphers`. La lista de cifrados disponibles se puede recuperar a través de `openssl ciphers -v 'PSK'`. Todos los cifrados TLS 1.3 son elegibles para PSK y se pueden recuperar a través de `openssl ciphers -v -s -tls1_3 -psk`. En la conexión del cliente, se debe pasar un `checkServerIdentity` personalizado porque el predeterminado fallará en ausencia de un certificado.

De acuerdo con [RFC 4279](https://tools.ietf.org/html/rfc4279), se deben admitir identidades PSK de hasta 128 bytes de longitud y PSK de hasta 64 bytes de longitud. A partir de OpenSSL 1.1.0, el tamaño máximo de identidad es de 128 bytes y la longitud máxima de PSK es de 256 bytes.

La implementación actual no admite devoluciones de llamada PSK asíncronas debido a las limitaciones de la API de OpenSSL subyacente.

Para usar TLS-PSK, el cliente y el servidor deben especificar la opción `pskCallback`, una función que devuelve el PSK que se utilizará (que debe ser compatible con el resumen del cifrado seleccionado).

Se llamará primero en el cliente:

- hint: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) mensaje opcional enviado desde el servidor para ayudar al cliente a decidir qué identidad usar durante la negociación. Siempre `null` si se usa TLS 1.3.
- Devuelve: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) en la forma `{ psk: \<Buffer|TypedArray|DataView\>, identity: \<string\> }` o `null`.

Luego en el servidor:

- socket: [\<tls.TLSSocket\>](/es/nodejs/api/tls#class-tlstlssocket) la instancia de socket del servidor, equivalente a `this`.
- identity: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) parámetro de identidad enviado desde el cliente.
- Devuelve: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) el PSK (o `null`).

Un valor de retorno de `null` detiene el proceso de negociación y envía un mensaje de alerta `unknown_psk_identity` a la otra parte. Si el servidor desea ocultar el hecho de que la identidad PSK no era conocida, la devolución de llamada debe proporcionar algunos datos aleatorios como `psk` para que la conexión falle con `decrypt_error` antes de que finalice la negociación.


### Mitigación del ataque de renegociación iniciada por el cliente {#client-initiated-renegotiation-attack-mitigation}

El protocolo TLS permite a los clientes renegociar ciertos aspectos de la sesión TLS. Desafortunadamente, la renegociación de la sesión requiere una cantidad desproporcionada de recursos del lado del servidor, lo que la convierte en un vector potencial para ataques de denegación de servicio.

Para mitigar el riesgo, la renegociación está limitada a tres veces cada diez minutos. Se emite un evento `'error'` en la instancia [`tls.TLSSocket`](/es/nodejs/api/tls#class-tlstlssocket) cuando se supera este umbral. Los límites son configurables:

- `tls.CLIENT_RENEG_LIMIT` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica el número de solicitudes de renegociación. **Predeterminado:** `3`.
- `tls.CLIENT_RENEG_WINDOW` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica el tiempo de la ventana de renegociación en segundos. **Predeterminado:** `600` (10 minutos).

Los límites de renegociación predeterminados no deben modificarse sin una comprensión completa de las implicaciones y los riesgos.

TLSv1.3 no admite la renegociación.

### Reanudación de la sesión {#session-resumption}

Establecer una sesión TLS puede ser relativamente lento. El proceso se puede acelerar guardando y reutilizando posteriormente el estado de la sesión. Existen varios mecanismos para hacerlo, que se discuten aquí desde el más antiguo hasta el más nuevo (y preferido).

#### Identificadores de sesión {#session-identifiers}

Los servidores generan una ID única para las nuevas conexiones y la envían al cliente. Los clientes y los servidores guardan el estado de la sesión. Al volver a conectarse, los clientes envían la ID de su estado de sesión guardado y, si el servidor también tiene el estado para esa ID, puede aceptar usarlo. De lo contrario, el servidor creará una nueva sesión. Consulte [RFC 2246](https://www.ietf.org/rfc/rfc2246.txt) para obtener más información, páginas 23 y 30.

La reanudación mediante identificadores de sesión es compatible con la mayoría de los navegadores web al realizar solicitudes HTTPS.

Para Node.js, los clientes esperan el evento [`'session'`](/es/nodejs/api/tls#event-session) para obtener los datos de la sesión y proporcionan los datos a la opción `session` de un [`tls.connect()`](/es/nodejs/api/tls#tlsconnectoptions-callback) posterior para reutilizar la sesión. Los servidores deben implementar controladores para los eventos [`'newSession'`](/es/nodejs/api/tls#event-newsession) y [`'resumeSession'`](/es/nodejs/api/tls#event-resumesession) para guardar y restaurar los datos de la sesión utilizando la ID de la sesión como clave de búsqueda para reutilizar las sesiones. Para reutilizar las sesiones en balanceadores de carga o trabajadores de clúster, los servidores deben utilizar una caché de sesión compartida (como Redis) en sus controladores de sesión.


#### Tickets de sesión {#session-tickets}

Los servidores cifran todo el estado de la sesión y lo envían al cliente como un "ticket". Al reconectar, el estado se envía al servidor en la conexión inicial. Este mecanismo evita la necesidad de una caché de sesión en el lado del servidor. Si el servidor no usa el ticket, por cualquier motivo (fallo al descifrarlo, es demasiado antiguo, etc.), creará una nueva sesión y enviará un nuevo ticket. Consulte [RFC 5077](https://tools.ietf.org/html/rfc5077) para obtener más información.

La reanudación mediante tickets de sesión está siendo comúnmente soportada por muchos navegadores web al realizar peticiones HTTPS.

Para Node.js, los clientes utilizan las mismas APIs para la reanudación con identificadores de sesión que para la reanudación con tickets de sesión. Para la depuración, si [`tls.TLSSocket.getTLSTicket()`](/es/nodejs/api/tls#tlssocketgettlsticket) devuelve un valor, los datos de la sesión contienen un ticket, de lo contrario contienen el estado de la sesión del lado del cliente.

Con TLSv1.3, tenga en cuenta que el servidor puede enviar varios tickets, lo que resulta en múltiples eventos `'session'`, consulte [`'session'`](/es/nodejs/api/tls#event-session) para obtener más información.

Los servidores de un solo proceso no necesitan una implementación específica para utilizar los tickets de sesión. Para utilizar los tickets de sesión a través de reinicios del servidor o balanceadores de carga, todos los servidores deben tener las mismas claves de ticket. Internamente hay tres claves de 16 bytes, pero la API tls las expone como un único buffer de 48 bytes para mayor comodidad.

Es posible obtener las claves de ticket llamando a [`server.getTicketKeys()`](/es/nodejs/api/tls#servergetticketkeys) en una instancia del servidor y luego distribuirlas, pero es más razonable generar de forma segura 48 bytes de datos aleatorios seguros y configurarlos con la opción `ticketKeys` de [`tls.createServer()`](/es/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener). Las claves deben regenerarse regularmente y las claves del servidor pueden restablecerse con [`server.setTicketKeys()`](/es/nodejs/api/tls#serversetticketkeyskeys).

Las claves de los tickets de sesión son claves criptográficas y *<strong>deben almacenarse de forma segura</strong>*. Con TLS 1.2 e inferior, si se ven comprometidas, todas las sesiones que utilizaron tickets cifrados con ellas pueden descifrarse. No deben almacenarse en el disco y deben regenerarse regularmente.

Si los clientes anuncian soporte para los tickets, el servidor los enviará. El servidor puede desactivar los tickets suministrando `require('node:constants').SSL_OP_NO_TICKET` en `secureOptions`.

Tanto los identificadores de sesión como los tickets de sesión caducan, lo que hace que el servidor cree nuevas sesiones. El tiempo de espera puede configurarse con la opción `sessionTimeout` de [`tls.createServer()`](/es/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener).

Para todos los mecanismos, cuando la reanudación falla, los servidores crearán nuevas sesiones. Dado que el fallo al reanudar la sesión no causa fallos en la conexión TLS/HTTPS, es fácil no notar un rendimiento TLS innecesariamente pobre. La CLI de OpenSSL puede utilizarse para verificar que los servidores están reanudando las sesiones. Utilice la opción `-reconnect` para `openssl s_client`, por ejemplo:

```bash [BASH]
openssl s_client -connect localhost:443 -reconnect
```
Lea la salida de depuración. La primera conexión debería decir "New", por ejemplo:

```text [TEXT]
New, TLSv1.2, Cipher is ECDHE-RSA-AES128-GCM-SHA256
```
Las conexiones subsiguientes deberían decir "Reused", por ejemplo:

```text [TEXT]
Reused, TLSv1.2, Cipher is ECDHE-RSA-AES128-GCM-SHA256
```

## Modificación del conjunto de cifrado TLS predeterminado {#modifying-the-default-tls-cipher-suite}

Node.js está construido con un conjunto predeterminado de cifrados TLS habilitados y deshabilitados. Esta lista de cifrado predeterminada se puede configurar al construir Node.js para permitir que las distribuciones proporcionen su propia lista predeterminada.

El siguiente comando se puede usar para mostrar el conjunto de cifrado predeterminado:

```bash [BASH]
node -p crypto.constants.defaultCoreCipherList | tr ':' '\n'
TLS_AES_256_GCM_SHA384
TLS_CHACHA20_POLY1305_SHA256
TLS_AES_128_GCM_SHA256
ECDHE-RSA-AES128-GCM-SHA256
ECDHE-ECDSA-AES128-GCM-SHA256
ECDHE-RSA-AES256-GCM-SHA384
ECDHE-ECDSA-AES256-GCM-SHA384
DHE-RSA-AES128-GCM-SHA256
ECDHE-RSA-AES128-SHA256
DHE-RSA-AES128-SHA256
ECDHE-RSA-AES256-SHA384
DHE-RSA-AES256-SHA384
ECDHE-RSA-AES256-SHA256
DHE-RSA-AES256-SHA256
HIGH
!aNULL
!eNULL
!EXPORT
!DES
!RC4
!MD5
!PSK
!SRP
!CAMELLIA
```
Este valor predeterminado se puede reemplazar por completo usando el modificador de línea de comandos [`--tls-cipher-list`](/es/nodejs/api/cli#--tls-cipher-listlist) (directamente o mediante la variable de entorno [`NODE_OPTIONS`](/es/nodejs/api/cli#node_optionsoptions)). Por ejemplo, lo siguiente hace que `ECDHE-RSA-AES128-GCM-SHA256:!RC4` sea el conjunto de cifrado TLS predeterminado:

```bash [BASH]
node --tls-cipher-list='ECDHE-RSA-AES128-GCM-SHA256:!RC4' server.js

export NODE_OPTIONS=--tls-cipher-list='ECDHE-RSA-AES128-GCM-SHA256:!RC4'
node server.js
```
Para verificar, use el siguiente comando para mostrar la lista de cifrado establecida, tenga en cuenta la diferencia entre `defaultCoreCipherList` y `defaultCipherList`:

```bash [BASH]
node --tls-cipher-list='ECDHE-RSA-AES128-GCM-SHA256:!RC4' -p crypto.constants.defaultCipherList | tr ':' '\n'
ECDHE-RSA-AES128-GCM-SHA256
!RC4
```
es decir, la lista `defaultCoreCipherList` se establece en tiempo de compilación y la `defaultCipherList` se establece en tiempo de ejecución.

Para modificar los conjuntos de cifrado predeterminados desde el tiempo de ejecución, modifique la variable `tls.DEFAULT_CIPHERS`, esto debe realizarse antes de escuchar en cualquier socket, no afectará a los sockets ya abiertos. Por ejemplo:

```js [ESM]
// Remove Obsolete CBC Ciphers and RSA Key Exchange based Ciphers as they don't provide Forward Secrecy
tls.DEFAULT_CIPHERS +=
  ':!ECDHE-RSA-AES128-SHA:!ECDHE-RSA-AES128-SHA256:!ECDHE-RSA-AES256-SHA:!ECDHE-RSA-AES256-SHA384' +
  ':!ECDHE-ECDSA-AES128-SHA:!ECDHE-ECDSA-AES128-SHA256:!ECDHE-ECDSA-AES256-SHA:!ECDHE-ECDSA-AES256-SHA384' +
  ':!kRSA';
```
El valor predeterminado también se puede reemplazar por cliente o por servidor usando la opción `ciphers` de [`tls.createSecureContext()`](/es/nodejs/api/tls#tlscreatesecurecontextoptions), que también está disponible en [`tls.createServer()`](/es/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener), [`tls.connect()`](/es/nodejs/api/tls#tlsconnectoptions-callback) y al crear nuevos [`tls.TLSSocket`](/es/nodejs/api/tls#class-tlstlssocket)s.

La lista de cifrados puede contener una combinación de nombres de conjuntos de cifrado TLSv1.3, los que comienzan con `'TLS_'`, y especificaciones para conjuntos de cifrado TLSv1.2 e inferiores. Los cifrados TLSv1.2 admiten un formato de especificación heredado, consulte la documentación del formato de lista de cifrado de OpenSSL [cipher list format](https://www.openssl.org/docs/man1.1.1/man1/ciphers#CIPHER-LIST-FORMAT) para obtener más detalles, pero esas especificaciones *no* se aplican a los cifrados TLSv1.3. Los conjuntos TLSv1.3 solo se pueden habilitar incluyendo su nombre completo en la lista de cifrado. No se pueden, por ejemplo, habilitar o deshabilitar utilizando la especificación heredada TLSv1.2 `'EECDH'` o `'!EECDH'`.

A pesar del orden relativo de los conjuntos de cifrado TLSv1.3 y TLSv1.2, el protocolo TLSv1.3 es significativamente más seguro que TLSv1.2, y siempre se elegirá sobre TLSv1.2 si el protocolo de enlace indica que es compatible, y si se habilita algún conjunto de cifrado TLSv1.3.

El conjunto de cifrado predeterminado incluido en Node.js se ha seleccionado cuidadosamente para reflejar las mejores prácticas de seguridad actuales y la mitigación de riesgos. Cambiar el conjunto de cifrado predeterminado puede tener un impacto significativo en la seguridad de una aplicación. El modificador `--tls-cipher-list` y la opción `ciphers` deben usarse solo si es absolutamente necesario.

El conjunto de cifrado predeterminado prefiere los cifrados GCM para la [configuración de "criptografía moderna" de Chrome](https://www.chromium.org/Home/chromium-security/education/tls#TOC-Cipher-Suites) y también prefiere los cifrados ECDHE y DHE para el secreto perfecto hacia adelante, al tiempo que ofrece *cierta* compatibilidad con versiones anteriores.

Los clientes antiguos que dependen de cifrados inseguros y obsoletos basados en RC4 o DES (como Internet Explorer 6) no pueden completar el proceso de protocolo de enlace con la configuración predeterminada. Si *deben* admitirse estos clientes, las [recomendaciones de TLS](https://wiki.mozilla.org/Security/Server_Side_TLS) pueden ofrecer un conjunto de cifrado compatible. Para obtener más detalles sobre el formato, consulte la documentación del formato de lista de cifrado de OpenSSL [cipher list format](https://www.openssl.org/docs/man1.1.1/man1/ciphers#CIPHER-LIST-FORMAT).

Solo hay cinco conjuntos de cifrado TLSv1.3:

- `'TLS_AES_256_GCM_SHA384'`
- `'TLS_CHACHA20_POLY1305_SHA256'`
- `'TLS_AES_128_GCM_SHA256'`
- `'TLS_AES_128_CCM_SHA256'`
- `'TLS_AES_128_CCM_8_SHA256'`

Los tres primeros están habilitados de forma predeterminada. Los dos conjuntos basados en `CCM` son compatibles con TLSv1.3 porque pueden ser más eficientes en sistemas limitados, pero no están habilitados de forma predeterminada ya que ofrecen menos seguridad.


## Nivel de seguridad de OpenSSL {#openssl-security-level}

La biblioteca OpenSSL impone niveles de seguridad para controlar el nivel mínimo aceptable de seguridad para las operaciones criptográficas. Los niveles de seguridad de OpenSSL varían de 0 a 5, y cada nivel impone requisitos de seguridad más estrictos. El nivel de seguridad predeterminado es 1, que generalmente es adecuado para la mayoría de las aplicaciones modernas. Sin embargo, algunas características y protocolos heredados, como TLSv1, requieren un nivel de seguridad más bajo (`SECLEVEL=0`) para funcionar correctamente. Para obtener información más detallada, consulte la [documentación de OpenSSL sobre los niveles de seguridad](https://www.openssl.org/docs/manmaster/man3/SSL_CTX_set_security_level#DEFAULT-CALLBACK-BEHAVIOUR).

### Establecimiento de niveles de seguridad {#setting-security-levels}

Para ajustar el nivel de seguridad en su aplicación Node.js, puede incluir `@SECLEVEL=X` dentro de una cadena de cifrado, donde `X` es el nivel de seguridad deseado. Por ejemplo, para establecer el nivel de seguridad en 0 mientras usa la lista de cifrados OpenSSL predeterminada, podría usar:

::: code-group
```js [ESM]
import { createServer, connect } from 'node:tls';
const port = 443;

createServer({ ciphers: 'DEFAULT@SECLEVEL=0', minVersion: 'TLSv1' }, function(socket) {
  console.log('Client connected with protocol:', socket.getProtocol());
  socket.end();
  this.close();
})
.listen(port, () => {
  connect(port, { ciphers: 'DEFAULT@SECLEVEL=0', maxVersion: 'TLSv1' });
});
```

```js [CJS]
const { createServer, connect } = require('node:tls');
const port = 443;

createServer({ ciphers: 'DEFAULT@SECLEVEL=0', minVersion: 'TLSv1' }, function(socket) {
  console.log('Client connected with protocol:', socket.getProtocol());
  socket.end();
  this.close();
})
.listen(port, () => {
  connect(port, { ciphers: 'DEFAULT@SECLEVEL=0', maxVersion: 'TLSv1' });
});
```
:::

Este enfoque establece el nivel de seguridad en 0, lo que permite el uso de características heredadas sin dejar de aprovechar los cifrados OpenSSL predeterminados.

### Usando {#using}

También puede establecer el nivel de seguridad y los cifrados desde la línea de comandos utilizando `--tls-cipher-list=DEFAULT@SECLEVEL=X` como se describe en [Modificación del conjunto de cifrado TLS predeterminado](/es/nodejs/api/tls#modifying-the-default-tls-cipher-suite). Sin embargo, generalmente se desaconseja usar la opción de la línea de comandos para configurar los cifrados y es preferible configurar los cifrados para contextos individuales dentro del código de su aplicación, ya que este enfoque proporciona un control más preciso y reduce el riesgo de degradar globalmente el nivel de seguridad.


## Códigos de error de certificado X509 {#x509-certificate-error-codes}

Múltiples funciones pueden fallar debido a errores de certificado que son reportados por OpenSSL. En tal caso, la función proporciona un [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) a través de su callback que tiene la propiedad `code` la cual puede tomar uno de los siguientes valores:

- `'UNABLE_TO_GET_ISSUER_CERT'`: No se puede obtener el certificado del emisor.
- `'UNABLE_TO_GET_CRL'`: No se puede obtener la CRL del certificado.
- `'UNABLE_TO_DECRYPT_CERT_SIGNATURE'`: No se puede descifrar la firma del certificado.
- `'UNABLE_TO_DECRYPT_CRL_SIGNATURE'`: No se puede descifrar la firma de la CRL.
- `'UNABLE_TO_DECODE_ISSUER_PUBLIC_KEY'`: No se puede decodificar la clave pública del emisor.
- `'CERT_SIGNATURE_FAILURE'`: Fallo en la firma del certificado.
- `'CRL_SIGNATURE_FAILURE'`: Fallo en la firma de la CRL.
- `'CERT_NOT_YET_VALID'`: El certificado aún no es válido.
- `'CERT_HAS_EXPIRED'`: El certificado ha expirado.
- `'CRL_NOT_YET_VALID'`: La CRL aún no es válida.
- `'CRL_HAS_EXPIRED'`: La CRL ha expirado.
- `'ERROR_IN_CERT_NOT_BEFORE_FIELD'`: Error de formato en el campo notBefore del certificado.
- `'ERROR_IN_CERT_NOT_AFTER_FIELD'`: Error de formato en el campo notAfter del certificado.
- `'ERROR_IN_CRL_LAST_UPDATE_FIELD'`: Error de formato en el campo lastUpdate de la CRL.
- `'ERROR_IN_CRL_NEXT_UPDATE_FIELD'`: Error de formato en el campo nextUpdate de la CRL.
- `'OUT_OF_MEM'`: Sin memoria.
- `'DEPTH_ZERO_SELF_SIGNED_CERT'`: Certificado autofirmado.
- `'SELF_SIGNED_CERT_IN_CHAIN'`: Certificado autofirmado en la cadena de certificados.
- `'UNABLE_TO_GET_ISSUER_CERT_LOCALLY'`: No se puede obtener el certificado del emisor localmente.
- `'UNABLE_TO_VERIFY_LEAF_SIGNATURE'`: No se puede verificar el primer certificado.
- `'CERT_CHAIN_TOO_LONG'`: La cadena de certificados es demasiado larga.
- `'CERT_REVOKED'`: Certificado revocado.
- `'INVALID_CA'`: Certificado CA inválido.
- `'PATH_LENGTH_EXCEEDED'`: Se excedió la restricción de longitud de la ruta.
- `'INVALID_PURPOSE'`: Propósito de certificado no compatible.
- `'CERT_UNTRUSTED'`: Certificado no confiable.
- `'CERT_REJECTED'`: Certificado rechazado.
- `'HOSTNAME_MISMATCH'`: Desajuste de nombre de host.


## Clase: `tls.CryptoStream` {#class-tlscryptostream}

**Agregada en: v0.3.4**

**Obsoleta desde: v0.11.3**

::: danger [Estable: 0 - Obsoleta]
[Estable: 0](/es/nodejs/api/documentation#stability-index) [Estabilidad: 0](/es/nodejs/api/documentation#stability-index) - Obsoleta: Use [`tls.TLSSocket`](/es/nodejs/api/tls#class-tlstlssocket) en su lugar.
:::

La clase `tls.CryptoStream` representa un flujo de datos cifrados. Esta clase está obsoleta y ya no debe utilizarse.

### `cryptoStream.bytesWritten` {#cryptostreambyteswritten}

**Agregada en: v0.3.4**

**Obsoleta desde: v0.11.3**

La propiedad `cryptoStream.bytesWritten` devuelve el número total de bytes escritos en el socket subyacente *incluidos* los bytes necesarios para la implementación del protocolo TLS.

## Clase: `tls.SecurePair` {#class-tlssecurepair}

**Agregada en: v0.3.2**

**Obsoleta desde: v0.11.3**

::: danger [Estable: 0 - Obsoleta]
[Estable: 0](/es/nodejs/api/documentation#stability-index) [Estabilidad: 0](/es/nodejs/api/documentation#stability-index) - Obsoleta: Use [`tls.TLSSocket`](/es/nodejs/api/tls#class-tlstlssocket) en su lugar.
:::

Devuelto por [`tls.createSecurePair()`](/es/nodejs/api/tls#tlscreatesecurepaircontext-isserver-requestcert-rejectunauthorized-options).

### Evento: `'secure'` {#event-secure}

**Agregada en: v0.3.2**

**Obsoleta desde: v0.11.3**

El evento `'secure'` es emitido por el objeto `SecurePair` una vez que se ha establecido una conexión segura.

Al igual que con la comprobación del evento [`'secureConnection'`](/es/nodejs/api/tls#event-secureconnection) del servidor, se debe inspeccionar `pair.cleartext.authorized` para confirmar si el certificado utilizado está debidamente autorizado.

## Clase: `tls.Server` {#class-tlsserver}

**Agregada en: v0.3.2**

- Extiende: [\<net.Server\>](/es/nodejs/api/net#class-netserver)

Acepta conexiones cifradas mediante TLS o SSL.

### Evento: `'connection'` {#event-connection}

**Agregada en: v0.3.2**

- `socket` [\<stream.Duplex\>](/es/nodejs/api/stream#class-streamduplex)

Este evento se emite cuando se establece un nuevo flujo TCP, antes de que comience el handshake de TLS. `socket` es típicamente un objeto de tipo [`net.Socket`](/es/nodejs/api/net#class-netsocket) pero no recibirá eventos a diferencia del socket creado a partir del evento `'connection'` de [`net.Server`](/es/nodejs/api/net#class-netserver). Por lo general, los usuarios no querrán acceder a este evento.

Este evento también puede ser emitido explícitamente por los usuarios para inyectar conexiones en el servidor TLS. En ese caso, se puede pasar cualquier flujo [`Duplex`](/es/nodejs/api/stream#class-streamduplex).


### Event: `'keylog'` {#event-keylog}

**Agregado en: v12.3.0, v10.20.0**

- `line` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) Línea de texto ASCII, en formato NSS `SSLKEYLOGFILE`.
- `tlsSocket` [\<tls.TLSSocket\>](/es/nodejs/api/tls#class-tlstlssocket) La instancia `tls.TLSSocket` en la que se generó.

El evento `keylog` se emite cuando el material de clave es generado o recibido por una conexión a este servidor (típicamente antes de que se complete el handshake, pero no necesariamente). Este material de clave puede ser almacenado para debugging, ya que permite que el tráfico TLS capturado sea descifrado. Puede ser emitido múltiples veces por cada socket.

Un caso de uso típico es añadir las líneas recibidas a un archivo de texto común, que luego es utilizado por software (como Wireshark) para descifrar el tráfico:

```js [ESM]
const logFile = fs.createWriteStream('/tmp/ssl-keys.log', { flags: 'a' });
// ...
server.on('keylog', (line, tlsSocket) => {
  if (tlsSocket.remoteAddress !== '...')
    return; // Solo registrar las claves para una IP particular
  logFile.write(line);
});
```
### Event: `'newSession'` {#event-newsession}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v0.11.12 | El argumento `callback` ahora es soportado. |
| v0.9.2 | Agregado en: v0.9.2 |
:::

El evento `'newSession'` se emite tras la creación de una nueva sesión TLS. Esto puede ser usado para almacenar sesiones en almacenamiento externo. Los datos deben ser proporcionados a la callback [`'resumeSession'`](/es/nodejs/api/tls#event-resumesession).

La función de callback del listener recibe tres argumentos cuando es llamada:

- `sessionId` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) El identificador de la sesión TLS
- `sessionData` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) Los datos de la sesión TLS
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una función de callback que no recibe argumentos que debe ser invocada para que los datos sean enviados o recibidos a través de la conexión segura.

Escuchar este evento tendrá un efecto solo en las conexiones establecidas después de la adición del listener del evento.

### Event: `'OCSPRequest'` {#event-ocsprequest}

**Agregado en: v0.11.13**

El evento `'OCSPRequest'` se emite cuando el cliente envía una solicitud de estado del certificado. La función de callback del listener recibe tres argumentos cuando es llamada:

- `certificate` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) El certificado del servidor
- `issuer` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) El certificado del emisor
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una función de callback que debe ser invocada para proporcionar los resultados de la solicitud OCSP.

El certificado actual del servidor puede ser analizado para obtener la URL OCSP y el ID del certificado; después de obtener una respuesta OCSP, `callback(null, resp)` es entonces invocada, donde `resp` es una instancia de `Buffer` que contiene la respuesta OCSP. Tanto `certificate` como `issuer` son representaciones DER de `Buffer` de los certificados primario y del emisor. Estos pueden ser usados para obtener el ID del certificado OCSP y la URL del endpoint OCSP.

Alternativamente, `callback(null, null)` puede ser llamada, indicando que no hubo respuesta OCSP.

Llamar a `callback(err)` resultará en una llamada a `socket.destroy(err)`.

El flujo típico de una solicitud OCSP es el siguiente:

El `issuer` puede ser `null` si el certificado es auto-firmado o el emisor no está en la lista de certificados raíz. (Un emisor puede ser proporcionado a través de la opción `ca` al establecer la conexión TLS.)

Escuchar este evento tendrá un efecto solo en las conexiones establecidas después de la adición del listener del evento.

Un módulo npm como [asn1.js](https://www.npmjs.com/package/asn1.js) puede ser usado para analizar los certificados.


### Event: `'resumeSession'` {#event-resumesession}

**Añadido en: v0.9.2**

El evento `'resumeSession'` se emite cuando el cliente solicita reanudar una sesión TLS anterior. La función de callback del listener recibe dos argumentos cuando es llamada:

- `sessionId` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) El identificador de la sesión TLS.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una función de callback que se llamará cuando la sesión anterior se haya recuperado: `callback([err[, sessionData]])`
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `sessionData` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer)

El listener del evento debe realizar una búsqueda en el almacenamiento externo de los `sessionData` guardados por el controlador del evento [`'newSession'`](/es/nodejs/api/tls#event-newsession) utilizando el `sessionId` dado. Si se encuentra, llama a `callback(null, sessionData)` para reanudar la sesión. Si no se encuentra, la sesión no se puede reanudar. `callback()` debe ser llamada sin `sessionData` para que el handshake pueda continuar y se pueda crear una nueva sesión. Es posible llamar a `callback(err)` para terminar la conexión entrante y destruir el socket.

Escuchar este evento tendrá un efecto sólo en las conexiones establecidas después de la adición del listener del evento.

Lo siguiente ilustra la reanudación de una sesión TLS:

```js [ESM]
const tlsSessionStore = {};
server.on('newSession', (id, data, cb) => {
  tlsSessionStore[id.toString('hex')] = data;
  cb();
});
server.on('resumeSession', (id, cb) => {
  cb(null, tlsSessionStore[id.toString('hex')] || null);
});
```
### Event: `'secureConnection'` {#event-secureconnection}

**Añadido en: v0.3.2**

El evento `'secureConnection'` se emite después de que el proceso de handshake para una nueva conexión se ha completado con éxito. La función de callback del listener recibe un único argumento cuando es llamada:

- `tlsSocket` [\<tls.TLSSocket\>](/es/nodejs/api/tls#class-tlstlssocket) El socket TLS establecido.

La propiedad `tlsSocket.authorized` es un `boolean` que indica si el cliente ha sido verificado por una de las Autoridades de Certificación suministradas para el servidor. Si `tlsSocket.authorized` es `false`, entonces `socket.authorizationError` se establece para describir cómo falló la autorización. Dependiendo de la configuración del servidor TLS, las conexiones no autorizadas pueden ser aceptadas.

La propiedad `tlsSocket.alpnProtocol` es una cadena que contiene el protocolo ALPN seleccionado. Cuando ALPN no tiene ningún protocolo seleccionado porque el cliente o el servidor no enviaron una extensión ALPN, `tlsSocket.alpnProtocol` es igual a `false`.

La propiedad `tlsSocket.servername` es una cadena que contiene el nombre del servidor solicitado a través de SNI.


### Evento: `'tlsClientError'` {#event-tlsclienterror}

**Agregado en: v6.0.0**

El evento `'tlsClientError'` se emite cuando ocurre un error antes de que se establezca una conexión segura. La función de callback del listener recibe dos argumentos cuando se llama:

- `exception` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) El objeto `Error` que describe el error.
- `tlsSocket` [\<tls.TLSSocket\>](/es/nodejs/api/tls#class-tlstlssocket) La instancia `tls.TLSSocket` desde la que se originó el error.

### `server.addContext(hostname, context)` {#serveraddcontexthostname-context}

**Agregado en: v0.5.3**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un nombre de host SNI o un comodín (ej. `'*'`)
- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<tls.SecureContext\>](/es/nodejs/api/tls#tlscreatesecurecontextoptions) Un objeto que contiene cualquiera de las propiedades posibles de los argumentos `options` de [`tls.createSecureContext()`](/es/nodejs/api/tls#tlscreatesecurecontextoptions) (ej. `key`, `cert`, `ca`, etc.), o un objeto de contexto TLS creado con [`tls.createSecureContext()`](/es/nodejs/api/tls#tlscreatesecurecontextoptions) mismo.

El método `server.addContext()` agrega un contexto seguro que se usará si el nombre SNI de la solicitud del cliente coincide con el `hostname` (o comodín) suministrado.

Cuando hay varios contextos coincidentes, se utiliza el agregado más recientemente.

### `server.address()` {#serveraddress}

**Agregado en: v0.6.0**

- Devuelve: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Devuelve la dirección vinculada, el nombre de la familia de direcciones y el puerto del servidor según lo informado por el sistema operativo. Consulte [`net.Server.address()`](/es/nodejs/api/net#serveraddress) para obtener más información.

### `server.close([callback])` {#serverclosecallback}

**Agregado en: v0.3.2**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una función de callback del listener que se registrará para escuchar el evento `'close'` de la instancia del servidor.
- Devuelve: [\<tls.Server\>](/es/nodejs/api/tls#class-tlsserver)

El método `server.close()` evita que el servidor acepte nuevas conexiones.

Esta función opera de forma asíncrona. El evento `'close'` se emitirá cuando el servidor no tenga más conexiones abiertas.


### `server.getTicketKeys()` {#servergetticketkeys}

**Agregado en: v3.0.0**

- Devuelve: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) Un búfer de 48 bytes que contiene las claves del ticket de sesión.

Devuelve las claves del ticket de sesión.

Consulte [Reanudación de sesión](/es/nodejs/api/tls#session-resumption) para obtener más información.

### `server.listen()` {#serverlisten}

Comienza a escuchar conexiones cifradas en el servidor. Este método es idéntico a [`server.listen()`](/es/nodejs/api/net#serverlisten) de [`net.Server`](/es/nodejs/api/net#class-netserver).

### `server.setSecureContext(options)` {#serversetsecurecontextoptions}

**Agregado en: v11.0.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un objeto que contiene cualquiera de las propiedades posibles de los argumentos `options` de [`tls.createSecureContext()`](/es/nodejs/api/tls#tlscreatesecurecontextoptions) (p. ej., `key`, `cert`, `ca`, etc.).

El método `server.setSecureContext()` reemplaza el contexto seguro de un servidor existente. Las conexiones existentes al servidor no se interrumpen.

### `server.setTicketKeys(keys)` {#serversetticketkeyskeys}

**Agregado en: v3.0.0**

- `keys` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Un búfer de 48 bytes que contiene las claves del ticket de sesión.

Establece las claves del ticket de sesión.

Los cambios en las claves del ticket solo son efectivos para futuras conexiones del servidor. Las conexiones de servidor existentes o actualmente pendientes utilizarán las claves anteriores.

Consulte [Reanudación de sesión](/es/nodejs/api/tls#session-resumption) para obtener más información.

## Clase: `tls.TLSSocket` {#class-tlstlssocket}

**Agregado en: v0.11.4**

- Extiende: [\<net.Socket\>](/es/nodejs/api/net#class-netsocket)

Realiza el cifrado transparente de los datos escritos y toda la negociación TLS requerida.

Las instancias de `tls.TLSSocket` implementan la interfaz [Stream](/es/nodejs/api/stream#stream) dúplex.

Los métodos que devuelven metadatos de conexión TLS (p. ej., [`tls.TLSSocket.getPeerCertificate()`](/es/nodejs/api/tls#tlssocketgetpeercertificatedetailed)) solo devolverán datos mientras la conexión esté abierta.


### `new tls.TLSSocket(socket[, options])` {#new-tlstlssocketsocket-options}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v12.2.0 | Ahora se admite la opción `enableTrace`. |
| v5.0.0 | Ahora se admiten las opciones de ALPN. |
| v0.11.4 | Añadido en: v0.11.4 |
:::

- `socket` [\<net.Socket\>](/es/nodejs/api/net#class-netsocket) | [\<stream.Duplex\>](/es/nodejs/api/stream#class-streamduplex) En el lado del servidor, cualquier flujo `Duplex`. En el lado del cliente, cualquier instancia de [`net.Socket`](/es/nodejs/api/net#class-netsocket) (para la compatibilidad genérica del flujo `Duplex` en el lado del cliente, se debe usar [`tls.connect()`](/es/nodejs/api/tls#tlsconnectoptions-callback)).
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `enableTrace`: Consulte [`tls.createServer()`](/es/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `isServer`: El protocolo SSL/TLS es asimétrico, los TLSSocket deben saber si deben comportarse como un servidor o un cliente. Si es `true`, el socket TLS se instanciará como un servidor. **Predeterminado:** `false`.
    - `server` [\<net.Server\>](/es/nodejs/api/net#class-netserver) Una instancia de [`net.Server`](/es/nodejs/api/net#class-netserver).
    - `requestCert`: Si se debe autenticar al par remoto solicitando un certificado. Los clientes siempre solicitan un certificado de servidor. Los servidores (`isServer` es true) pueden establecer `requestCert` en true para solicitar un certificado de cliente.
    - `rejectUnauthorized`: Consulte [`tls.createServer()`](/es/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `ALPNProtocols`: Consulte [`tls.createServer()`](/es/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `SNICallback`: Consulte [`tls.createServer()`](/es/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `session` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) Una instancia de `Buffer` que contiene una sesión TLS.
    - `requestOCSP` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si es `true`, especifica que la extensión de solicitud de estado OCSP se agregará al saludo del cliente y se emitirá un evento `'OCSPResponse'` en el socket antes de establecer una comunicación segura.
    - `secureContext`: Objeto de contexto TLS creado con [`tls.createSecureContext()`](/es/nodejs/api/tls#tlscreatesecurecontextoptions). Si *no* se proporciona un `secureContext`, se creará uno pasando todo el objeto `options` a `tls.createSecureContext()`.
    - ...: Opciones de [`tls.createSecureContext()`](/es/nodejs/api/tls#tlscreatesecurecontextoptions) que se utilizan si falta la opción `secureContext`. De lo contrario, se ignoran.

Construye un nuevo objeto `tls.TLSSocket` a partir de un socket TCP existente.


### Evento: `'keylog'` {#event-keylog_1}

**Agregado en: v12.3.0, v10.20.0**

- `line` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) Línea de texto ASCII, en formato NSS `SSLKEYLOGFILE`.

El evento `keylog` se emite en un `tls.TLSSocket` cuando el material de la clave es generado o recibido por el socket. Este material de clave se puede almacenar para la depuración, ya que permite descifrar el tráfico TLS capturado. Puede emitirse varias veces, antes o después de que se complete el handshake.

Un caso de uso típico es agregar las líneas recibidas a un archivo de texto común, que luego utiliza el software (como Wireshark) para descifrar el tráfico:

```js [ESM]
const logFile = fs.createWriteStream('/tmp/ssl-keys.log', { flags: 'a' });
// ...
tlsSocket.on('keylog', (line) => logFile.write(line));
```
### Evento: `'OCSPResponse'` {#event-ocspresponse}

**Agregado en: v0.11.13**

El evento `'OCSPResponse'` se emite si la opción `requestOCSP` se configuró cuando se creó el `tls.TLSSocket` y se ha recibido una respuesta OCSP. La función de callback del listener recibe un solo argumento cuando se llama:

- `response` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) La respuesta OCSP del servidor

Normalmente, la `response` es un objeto firmado digitalmente de la CA del servidor que contiene información sobre el estado de revocación del certificado del servidor.

### Evento: `'secureConnect'` {#event-secureconnect}

**Agregado en: v0.11.4**

El evento `'secureConnect'` se emite después de que el proceso de handshake para una nueva conexión se haya completado con éxito. La función de callback del listener se llamará independientemente de si el certificado del servidor ha sido autorizado o no. Es responsabilidad del cliente verificar la propiedad `tlsSocket.authorized` para determinar si el certificado del servidor fue firmado por una de las CA especificadas. Si `tlsSocket.authorized === false`, entonces el error se puede encontrar examinando la propiedad `tlsSocket.authorizationError`. Si se utilizó ALPN, se puede verificar la propiedad `tlsSocket.alpnProtocol` para determinar el protocolo negociado.

El evento `'secureConnect'` no se emite cuando se crea un [\<tls.TLSSocket\>](/es/nodejs/api/tls#class-tlstlssocket) utilizando el constructor `new tls.TLSSocket()`.


### Evento: `'session'` {#event-session}

**Añadido en: v11.10.0**

- `session` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer)

El evento `'session'` se emite en un `tls.TLSSocket` del cliente cuando una nueva sesión o ticket TLS está disponible. Esto puede o no ser antes de que se complete el handshake, dependiendo de la versión del protocolo TLS que se haya negociado. El evento no se emite en el servidor, o si no se creó una nueva sesión, por ejemplo, cuando se reanudó la conexión. Para algunas versiones del protocolo TLS, el evento puede emitirse varias veces, en cuyo caso todas las sesiones se pueden utilizar para la reanudación.

En el cliente, la `session` se puede proporcionar a la opción `session` de [`tls.connect()`](/es/nodejs/api/tls#tlsconnectoptions-callback) para reanudar la conexión.

Consulte [Reanudación de sesión](/es/nodejs/api/tls#session-resumption) para obtener más información.

Para TLSv1.2 e inferiores, se puede llamar a [`tls.TLSSocket.getSession()`](/es/nodejs/api/tls#tlssocketgetsession) una vez que se complete el handshake. Para TLSv1.3, el protocolo solo permite la reanudación basada en tickets, se envían varios tickets y los tickets no se envían hasta después de que se complete el handshake. Por lo tanto, es necesario esperar el evento `'session'` para obtener una sesión reanudable. Las aplicaciones deben usar el evento `'session'` en lugar de `getSession()` para asegurarse de que funcionen para todas las versiones de TLS. Las aplicaciones que solo esperan obtener o usar una sesión deben escuchar este evento solo una vez:

```js [ESM]
tlsSocket.once('session', (session) => {
  // La sesión se puede usar inmediatamente o más tarde.
  tls.connect({
    session: session,
    // Otras opciones de conexión...
  });
});
```
### `tlsSocket.address()` {#tlssocketaddress}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.4.0 | La propiedad `family` ahora devuelve una cadena en lugar de un número. |
| v18.0.0 | La propiedad `family` ahora devuelve un número en lugar de una cadena. |
| v0.11.4 | Añadido en: v0.11.4 |
:::

- Devuelve: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Devuelve la `address` vinculada, el nombre de la `family` de la dirección y el `port` del socket subyacente según lo informado por el sistema operativo: `{ port: 12346, family: 'IPv4', address: '127.0.0.1' }`.


### `tlsSocket.authorizationError` {#tlssocketauthorizationerror}

**Agregado en: v0.11.4**

Devuelve la razón por la que no se verificó el certificado del par. Esta propiedad se establece solo cuando `tlsSocket.authorized === false`.

### `tlsSocket.authorized` {#tlssocketauthorized}

**Agregado en: v0.11.4**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Esta propiedad es `true` si el certificado del par fue firmado por una de las CA especificadas al crear la instancia `tls.TLSSocket`, de lo contrario es `false`.

### `tlsSocket.disableRenegotiation()` {#tlssocketdisablerenegotiation}

**Agregado en: v8.4.0**

Desactiva la renegociación TLS para esta instancia `TLSSocket`. Una vez llamada, los intentos de renegociar activarán un evento `'error'` en `TLSSocket`.

### `tlsSocket.enableTrace()` {#tlssocketenabletrace}

**Agregado en: v12.2.0**

Cuando está habilitado, la información de seguimiento de paquetes TLS se escribe en `stderr`. Esto se puede usar para depurar problemas de conexión TLS.

El formato de la salida es idéntico a la salida de `openssl s_client -trace` o `openssl s_server -trace`. Si bien es producido por la función `SSL_trace()` de OpenSSL, el formato no está documentado, puede cambiar sin previo aviso y no se debe confiar en él.

### `tlsSocket.encrypted` {#tlssocketencrypted}

**Agregado en: v0.11.4**

Siempre devuelve `true`. Esto se puede usar para distinguir los sockets TLS de las instancias `net.Socket` regulares.

### `tlsSocket.exportKeyingMaterial(length, label[, context])` {#tlssocketexportkeyingmateriallength-label-context}

**Agregado en: v13.10.0, v12.17.0**

-  `length` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) número de bytes a recuperar del material de clave.
-  `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) una etiqueta específica de la aplicación, normalmente este será un valor del [Registro de etiquetas de exportación de IANA](https://www.iana.org/assignments/tls-parameters/tls-parameters.xhtml#exporter-labels).
-  `context` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) Opcionalmente, proporcione un contexto.
-  Devuelve: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) bytes solicitados del material de clave.

El material de clave se utiliza para validaciones para evitar diferentes tipos de ataques en protocolos de red, por ejemplo, en las especificaciones de IEEE 802.1X.

Ejemplo

```js [ESM]
const keyingMaterial = tlsSocket.exportKeyingMaterial(
  128,
  'client finished');

/*
 Ejemplo de valor de retorno de keyingMaterial:
 <Buffer 76 26 af 99 c5 56 8e 42 09 91 ef 9f 93 cb ad 6c 7b 65 f8 53 f1 d8 d9
    12 5a 33 b8 b5 25 df 7b 37 9f e0 e2 4f b8 67 83 a3 2f cd 5d 41 42 4c 91
    74 ef 2c ... 78 more bytes>
*/
```
Consulte la documentación de OpenSSL [`SSL_export_keying_material`](https://www.openssl.org/docs/man1.1.1/man3/SSL_export_keying_material) para obtener más información.


### `tlsSocket.getCertificate()` {#tlssocketgetcertificate}

**Añadido en: v11.2.0**

- Devuelve: [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Devuelve un objeto que representa el certificado local. El objeto devuelto tiene algunas propiedades que corresponden a los campos del certificado.

Consulte [`tls.TLSSocket.getPeerCertificate()`](/es/nodejs/api/tls#tlssocketgetpeercertificatedetailed) para ver un ejemplo de la estructura del certificado.

Si no hay un certificado local, se devolverá un objeto vacío. Si el socket ha sido destruido, se devolverá `null`.

### `tlsSocket.getCipher()` {#tlssocketgetcipher}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v13.4.0, v12.16.0 | Devuelve el nombre del cifrado IETF como `standardName`. |
| v12.0.0 | Devuelve la versión mínima del cifrado, en lugar de una cadena fija (`'TLSv1/SSLv3'`). |
| v0.11.4 | Añadido en: v0.11.4 |
:::

- Devuelve: [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nombre OpenSSL para el conjunto de cifrado.
    - `standardName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nombre IETF para el conjunto de cifrado.
    - `version` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La versión mínima del protocolo TLS soportada por este conjunto de cifrado. Para el protocolo negociado real, consulte [`tls.TLSSocket.getProtocol()`](/es/nodejs/api/tls#tlssocketgetprotocol).
  
 

Devuelve un objeto que contiene información sobre el conjunto de cifrado negociado.

Por ejemplo, un protocolo TLSv1.2 con cifrado AES256-SHA:

```json [JSON]
{
    "name": "AES256-SHA",
    "standardName": "TLS_RSA_WITH_AES_256_CBC_SHA",
    "version": "SSLv3"
}
```
Consulte [SSL_CIPHER_get_name](https://www.openssl.org/docs/man1.1.1/man3/SSL_CIPHER_get_name) para obtener más información.

### `tlsSocket.getEphemeralKeyInfo()` {#tlssocketgetephemeralkeyinfo}

**Añadido en: v5.0.0**

- Devuelve: [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Devuelve un objeto que representa el tipo, el nombre y el tamaño del parámetro de un intercambio de claves efímeras en [secreto perfecto hacia adelante](/es/nodejs/api/tls#perfect-forward-secrecy) en una conexión de cliente. Devuelve un objeto vacío cuando el intercambio de claves no es efímero. Como esto solo es compatible con un socket de cliente; se devuelve `null` si se llama en un socket de servidor. Los tipos admitidos son `'DH'` y `'ECDH'`. La propiedad `name` solo está disponible cuando el tipo es `'ECDH'`.

Por ejemplo: `{ type: 'ECDH', name: 'prime256v1', size: 256 }`.


### `tlsSocket.getFinished()` {#tlssocketgetfinished}

**Añadido en: v9.9.0**

- Devuelve: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) El mensaje `Finished` más reciente que se ha enviado al socket como parte de un handshake SSL/TLS, o `undefined` si aún no se ha enviado ningún mensaje `Finished`.

Como los mensajes `Finished` son resúmenes de mensajes del handshake completo (con un total de 192 bits para TLS 1.0 y más para SSL 3.0), se pueden usar para procedimientos de autenticación externos cuando la autenticación proporcionada por SSL/TLS no es deseada o no es suficiente.

Corresponde a la rutina `SSL_get_finished` en OpenSSL y se puede usar para implementar el enlace de canal `tls-unique` de [RFC 5929](https://tools.ietf.org/html/rfc5929).

### `tlsSocket.getPeerCertificate([detailed])` {#tlssocketgetpeercertificatedetailed}

**Añadido en: v0.11.4**

- `detailed` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Incluir la cadena de certificados completa si es `true`, de lo contrario, incluir solo el certificado del par.
- Devuelve: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un objeto de certificado.

Devuelve un objeto que representa el certificado del par. Si el par no proporciona un certificado, se devolverá un objeto vacío. Si el socket se ha destruido, se devolverá `null`.

Si se solicitó la cadena de certificados completa, cada certificado incluirá una propiedad `issuerCertificate` que contiene un objeto que representa el certificado de su emisor.

#### Objeto de certificado {#certificate-object}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v19.1.0, v18.13.0 | Añadir la propiedad "ca". |
| v17.2.0, v16.14.0 | Añadir fingerprint512. |
| v11.4.0 | Soporte para información de clave pública de curva elíptica. |
:::

Un objeto de certificado tiene propiedades que corresponden a los campos del certificado.

- `ca` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` si es una Autoridad de Certificación (CA), `false` en caso contrario.
- `raw` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) Los datos del certificado X.509 codificados en DER.
- `subject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) El sujeto del certificado, descrito en términos de País (`C`), Estado o Provincia (`ST`), Localidad (`L`), Organización (`O`), Unidad Organizativa (`OU`) y Nombre Común (`CN`). El Nombre Común suele ser un nombre DNS con certificados TLS. Ejemplo: `{C: 'UK', ST: 'BC', L: 'Metro', O: 'Node Fans', OU: 'Docs', CN: 'example.com'}`.
- `issuer` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) El emisor del certificado, descrito en los mismos términos que el `subject`.
- `valid_from` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La fecha y hora desde la que el certificado es válido.
- `valid_to` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La fecha y hora hasta la que el certificado es válido.
- `serialNumber` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El número de serie del certificado, como una cadena hexadecimal. Ejemplo: `'B9B0D332A1AA5635'`.
- `fingerprint` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El resumen SHA-1 del certificado codificado en DER. Se devuelve como una cadena hexadecimal separada por `:`. Ejemplo: `'2A:7A:C2:DD:...'`.
- `fingerprint256` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El resumen SHA-256 del certificado codificado en DER. Se devuelve como una cadena hexadecimal separada por `:`. Ejemplo: `'2A:7A:C2:DD:...'`.
- `fingerprint512` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El resumen SHA-512 del certificado codificado en DER. Se devuelve como una cadena hexadecimal separada por `:`. Ejemplo: `'2A:7A:C2:DD:...'`.
- `ext_key_usage` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) (Opcional) El uso extendido de clave, un conjunto de OID.
- `subjectaltname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) (Opcional) Una cadena que contiene nombres concatenados para el sujeto, una alternativa a los nombres del `subject`.
- `infoAccess` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) (Opcional) Un array que describe el AuthorityInfoAccess, utilizado con OCSP.
- `issuerCertificate` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) (Opcional) El objeto de certificado del emisor. Para certificados autofirmados, esto puede ser una referencia circular.

El certificado puede contener información sobre la clave pública, dependiendo del tipo de clave.

Para claves RSA, se pueden definir las siguientes propiedades:

- `bits` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El tamaño de bits RSA. Ejemplo: `1024`.
- `exponent` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El exponente RSA, como una cadena en notación de número hexadecimal. Ejemplo: `'0x010001'`.
- `modulus` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El módulo RSA, como una cadena hexadecimal. Ejemplo: `'B56CE45CB7...'`.
- `pubkey` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) La clave pública.

Para claves EC, se pueden definir las siguientes propiedades:

- `pubkey` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) La clave pública.
- `bits` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El tamaño de la clave en bits. Ejemplo: `256`.
- `asn1Curve` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) (Opcional) El nombre ASN.1 del OID de la curva elíptica. Las curvas conocidas se identifican por un OID. Si bien es inusual, es posible que la curva se identifique por sus propiedades matemáticas, en cuyo caso no tendrá un OID. Ejemplo: `'prime256v1'`.
- `nistCurve` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) (Opcional) El nombre NIST para la curva elíptica, si tiene uno (no todas las curvas conocidas han sido asignadas nombres por NIST). Ejemplo: `'P-256'`.

Ejemplo de certificado:

```js [ESM]
{ subject:
   { OU: [ 'Domain Control Validated', 'PositiveSSL Wildcard' ],
     CN: '*.nodejs.org' },
  issuer:
   { C: 'GB',
     ST: 'Greater Manchester',
     L: 'Salford',
     O: 'COMODO CA Limited',
     CN: 'COMODO RSA Domain Validation Secure Server CA' },
  subjectaltname: 'DNS:*.nodejs.org, DNS:nodejs.org',
  infoAccess:
   { 'CA Issuers - URI':
      [ 'http://crt.comodoca.com/COMODORSADomainValidationSecureServerCA.crt' ],
     'OCSP - URI': [ 'http://ocsp.comodoca.com' ] },
  modulus: 'B56CE45CB740B09A13F64AC543B712FF9EE8E4C284B542A1708A27E82A8D151CA178153E12E6DDA15BF70FFD96CB8A88618641BDFCCA03527E665B70D779C8A349A6F88FD4EF6557180BD4C98192872BCFE3AF56E863C09DDD8BC1EC58DF9D94F914F0369102B2870BECFA1348A0838C9C49BD1C20124B442477572347047506B1FCD658A80D0C44BCC16BC5C5496CFE6E4A8428EF654CD3D8972BF6E5BFAD59C93006830B5EB1056BBB38B53D1464FA6E02BFDF2FF66CD949486F0775EC43034EC2602AEFBF1703AD221DAA2A88353C3B6A688EFE8387811F645CEED7B3FE46E1F8B9F59FAD028F349B9BC14211D5830994D055EEA3D547911E07A0ADDEB8A82B9188E58720D95CD478EEC9AF1F17BE8141BE80906F1A339445A7EB5B285F68039B0F294598A7D1C0005FC22B5271B0752F58CCDEF8C8FD856FB7AE21C80B8A2CE983AE94046E53EDE4CB89F42502D31B5360771C01C80155918637490550E3F555E2EE75CC8C636DDE3633CFEDD62E91BF0F7688273694EEEBA20C2FC9F14A2A435517BC1D7373922463409AB603295CEB0BB53787A334C9CA3CA8B30005C5A62FC0715083462E00719A8FA3ED0A9828C3871360A73F8B04A4FC1E71302844E9BB9940B77E745C9D91F226D71AFCAD4B113AAF68D92B24DDB4A2136B55A1CD1ADF39605B63CB639038ED0F4C987689866743A68769CC55847E4A06D6E2E3F1',
  exponent: '0x10001',
  pubkey: <Buffer ... >,
  valid_from: 'Aug 14 00:00:00 2017 GMT',
  valid_to: 'Nov 20 23:59:59 2019 GMT',
  fingerprint: '01:02:59:D9:C3:D2:0D:08:F7:82:4E:44:A4:B4:53:C5:E2:3A:87:4D',
  fingerprint256: '69:AE:1A:6A:D4:3D:C6:C1:1B:EA:C6:23:DE:BA:2A:14:62:62:93:5C:7A:EA:06:41:9B:0B:BC:87:CE:48:4E:02',
  fingerprint512: '19:2B:3E:C3:B3:5B:32:E8:AE:BB:78:97:27:E4:BA:6C:39:C9:92:79:4F:31:46:39:E2:70:E5:5F:89:42:17:C9:E8:64:CA:FF:BB:72:56:73:6E:28:8A:92:7E:A3:2A:15:8B:C2:E0:45:CA:C3:BC:EA:40:52:EC:CA:A2:68:CB:32',
  ext_key_usage: [ '1.3.6.1.5.5.7.3.1', '1.3.6.1.5.5.7.3.2' ],
  serialNumber: '66593D57F20CBC573E433381B5FEC280',
  raw: <Buffer ... > }
```

### `tlsSocket.getPeerFinished()` {#tlssocketgetpeerfinished}

**Agregado en: v9.9.0**

- Devuelve: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) El último mensaje `Finished` que se espera o que realmente se ha recibido del socket como parte de un handshake SSL/TLS, o `undefined` si no hay ningún mensaje `Finished` hasta el momento.

Como los mensajes `Finished` son resúmenes de mensajes del handshake completo (con un total de 192 bits para TLS 1.0 y más para SSL 3.0), se pueden utilizar para procedimientos de autenticación externos cuando la autenticación proporcionada por SSL/TLS no es deseada o no es suficiente.

Corresponde a la rutina `SSL_get_peer_finished` en OpenSSL y puede utilizarse para implementar el enlace de canal `tls-unique` de [RFC 5929](https://tools.ietf.org/html/rfc5929).

### `tlsSocket.getPeerX509Certificate()` {#tlssocketgetpeerx509certificate}

**Agregado en: v15.9.0**

- Devuelve: [\<X509Certificate\>](/es/nodejs/api/crypto#class-x509certificate)

Devuelve el certificado del par como un objeto [\<X509Certificate\>](/es/nodejs/api/crypto#class-x509certificate).

Si no hay certificado del par o el socket ha sido destruido, se devolverá `undefined`.

### `tlsSocket.getProtocol()` {#tlssocketgetprotocol}

**Agregado en: v5.7.0**

- Devuelve: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

Devuelve una cadena que contiene la versión del protocolo SSL/TLS negociada de la conexión actual. El valor `'unknown'` se devolverá para los sockets conectados que no hayan completado el proceso de handshake. El valor `null` se devolverá para los sockets del servidor o los sockets del cliente desconectados.

Las versiones del protocolo son:

- `'SSLv3'`
- `'TLSv1'`
- `'TLSv1.1'`
- `'TLSv1.2'`
- `'TLSv1.3'`

Consulte la documentación de OpenSSL [`SSL_get_version`](https://www.openssl.org/docs/man1.1.1/man3/SSL_get_version) para obtener más información.

### `tlsSocket.getSession()` {#tlssocketgetsession}

**Agregado en: v0.11.4**

- [\<Buffer\>](/es/nodejs/api/buffer#class-buffer)

Devuelve los datos de la sesión TLS o `undefined` si no se negoció ninguna sesión. En el cliente, los datos pueden proporcionarse a la opción `session` de [`tls.connect()`](/es/nodejs/api/tls#tlsconnectoptions-callback) para reanudar la conexión. En el servidor, puede ser útil para la depuración.

Consulte [Reanudación de sesión](/es/nodejs/api/tls#session-resumption) para obtener más información.

Nota: `getSession()` solo funciona para TLSv1.2 y versiones anteriores. Para TLSv1.3, las aplicaciones deben utilizar el evento [`'session'`](/es/nodejs/api/tls#event-session) (también funciona para TLSv1.2 y versiones anteriores).


### `tlsSocket.getSharedSigalgs()` {#tlssocketgetsharedsigalgs}

**Agregado en: v12.11.0**

- Regresa: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Lista de algoritmos de firma compartidos entre el servidor y el cliente en orden de preferencia decreciente.

Ver [SSL_get_shared_sigalgs](https://www.openssl.org/docs/man1.1.1/man3/SSL_get_shared_sigalgs) para más información.

### `tlsSocket.getTLSTicket()` {#tlssocketgettlsticket}

**Agregado en: v0.11.4**

- [\<Buffer\>](/es/nodejs/api/buffer#class-buffer)

Para un cliente, devuelve el ticket de sesión TLS si está disponible, o `undefined`. Para un servidor, siempre devuelve `undefined`.

Puede ser útil para la depuración.

Ver [Reanudación de sesión](/es/nodejs/api/tls#session-resumption) para más información.

### `tlsSocket.getX509Certificate()` {#tlssocketgetx509certificate}

**Agregado en: v15.9.0**

- Regresa: [\<X509Certificate\>](/es/nodejs/api/crypto#class-x509certificate)

Devuelve el certificado local como un objeto [\<X509Certificate\>](/es/nodejs/api/crypto#class-x509certificate).

Si no hay un certificado local, o el socket ha sido destruido, se regresará `undefined`.

### `tlsSocket.isSessionReused()` {#tlssocketissessionreused}

**Agregado en: v0.5.6**

- Regresa: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` si la sesión fue reutilizada, `false` de lo contrario.

Ver [Reanudación de sesión](/es/nodejs/api/tls#session-resumption) para más información.

### `tlsSocket.localAddress` {#tlssocketlocaladdress}

**Agregado en: v0.11.4**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Devuelve la representación de cadena de la dirección IP local.

### `tlsSocket.localPort` {#tlssocketlocalport}

**Agregado en: v0.11.4**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Devuelve la representación numérica del puerto local.

### `tlsSocket.remoteAddress` {#tlssocketremoteaddress}

**Agregado en: v0.11.4**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Devuelve la representación de cadena de la dirección IP remota. Por ejemplo, `'74.125.127.100'` o `'2001:4860:a005::68'`.


### `tlsSocket.remoteFamily` {#tlssocketremotefamily}

**Agregado en: v0.11.4**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Devuelve la representación de cadena de la familia IP remota. `'IPv4'` o `'IPv6'`.

### `tlsSocket.remotePort` {#tlssocketremoteport}

**Agregado en: v0.11.4**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Devuelve la representación numérica del puerto remoto. Por ejemplo, `443`.

### `tlsSocket.renegotiate(options, callback)` {#tlssocketrenegotiateoptions-callback}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una devolución de llamada no válida al argumento `callback` ahora arroja `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v0.11.8 | Agregado en: v0.11.8 |
:::

- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `rejectUnauthorized` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si no es `false`, el certificado del servidor se verifica con la lista de CA suministradas. Se emite un evento `'error'` si la verificación falla; `err.code` contiene el código de error de OpenSSL. **Predeterminado:** `true`.
    - `requestCert`


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Si `renegotiate()` devolvió `true`, la devolución de llamada se adjunta una vez al evento `'secure'`. Si `renegotiate()` devolvió `false`, `callback` se llamará en el siguiente ciclo con un error, a menos que se haya destruido el `tlsSocket`, en cuyo caso no se llamará a `callback` en absoluto.
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` si se inició la renegociación, `false` en caso contrario.

El método `tlsSocket.renegotiate()` inicia un proceso de renegociación TLS. Una vez completada, a la función `callback` se le pasará un solo argumento que es un `Error` (si la solicitud falló) o `null`.

Este método se puede utilizar para solicitar el certificado de un par después de que se haya establecido la conexión segura.

Cuando se ejecuta como servidor, el socket se destruirá con un error después del tiempo de espera de `handshakeTimeout`.

Para TLSv1.3, la renegociación no se puede iniciar, no es compatible con el protocolo.


### `tlsSocket.setKeyCert(context)` {#tlssocketsetkeycertcontext}

**Agregado en: v22.5.0, v20.17.0**

- `context` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<tls.SecureContext\>](/es/nodejs/api/tls#tlscreatesecurecontextoptions) Un objeto que contiene al menos las propiedades `key` y `cert` de las `options` de [`tls.createSecureContext()`](/es/nodejs/api/tls#tlscreatesecurecontextoptions), o un objeto de contexto TLS creado con [`tls.createSecureContext()`](/es/nodejs/api/tls#tlscreatesecurecontextoptions) en sí mismo.

El método `tlsSocket.setKeyCert()` establece la clave privada y el certificado que se utilizarán para el socket. Esto es principalmente útil si desea seleccionar un certificado de servidor desde el `ALPNCallback` de un servidor TLS.

### `tlsSocket.setMaxSendFragment(size)` {#tlssocketsetmaxsendfragmentsize}

**Agregado en: v0.11.11**

- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El tamaño máximo del fragmento TLS. El valor máximo es `16384`. **Predeterminado:** `16384`.
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

El método `tlsSocket.setMaxSendFragment()` establece el tamaño máximo del fragmento TLS. Devuelve `true` si la configuración del límite se realizó correctamente; `false` en caso contrario.

Los tamaños de fragmento más pequeños disminuyen la latencia de almacenamiento en búfer en el cliente: los fragmentos más grandes son almacenados en búfer por la capa TLS hasta que se recibe todo el fragmento y se verifica su integridad; los fragmentos grandes pueden abarcar múltiples viajes de ida y vuelta y su procesamiento puede retrasarse debido a la pérdida o reordenación de paquetes. Sin embargo, los fragmentos más pequeños agregan bytes de encuadre TLS adicionales y sobrecarga de CPU, lo que puede disminuir el rendimiento general del servidor.

## `tls.checkServerIdentity(hostname, cert)` {#tlscheckserveridentityhostname-cert}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v17.3.1, v16.13.2, v14.18.3, v12.22.9 | El soporte para nombres alternativos de asunto `uniformResourceIdentifier` ha sido deshabilitado en respuesta a CVE-2021-44531. |
| v0.8.4 | Agregado en: v0.8.4 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El nombre de host o la dirección IP para verificar el certificado.
- `cert` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un [objeto de certificado](/es/nodejs/api/tls#certificate-object) que representa el certificado del par.
- Devuelve: [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Verifica que el certificado `cert` se emita para `hostname`.

Devuelve un objeto [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error), llenándolo con `reason`, `host` y `cert` en caso de fallo. En caso de éxito, devuelve [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type).

Esta función está destinada a ser utilizada en combinación con la opción `checkServerIdentity` que se puede pasar a [`tls.connect()`](/es/nodejs/api/tls#tlsconnectoptions-callback) y, como tal, opera en un [objeto de certificado](/es/nodejs/api/tls#certificate-object). Para otros propósitos, considere usar [`x509.checkHost()`](/es/nodejs/api/crypto#x509checkhostname-options) en su lugar.

Esta función se puede sobrescribir proporcionando una función alternativa como la opción `options.checkServerIdentity` que se pasa a `tls.connect()`. La función de sobrescritura puede llamar a `tls.checkServerIdentity()` por supuesto, para aumentar las comprobaciones realizadas con verificación adicional.

Esta función solo se llama si el certificado pasó todas las demás comprobaciones, como ser emitido por una CA de confianza (`options.ca`).

Las versiones anteriores de Node.js aceptaban incorrectamente los certificados para un `hostname` dado si un nombre alternativo de sujeto `uniformResourceIdentifier` coincidente estaba presente (consulte [CVE-2021-44531](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-44531)). Las aplicaciones que deseen aceptar nombres alternativos de sujeto `uniformResourceIdentifier` pueden usar una función `options.checkServerIdentity` personalizada que implemente el comportamiento deseado.


## `tls.connect(options[, callback])` {#tlsconnectoptions-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v15.1.0, v14.18.0 | Se agregó la opción `onread`. |
| v14.1.0, v13.14.0 | Ahora se acepta la opción `highWaterMark`. |
| v13.6.0, v12.16.0 | Ahora se soporta la opción `pskCallback`. |
| v12.9.0 | Soporta la opción `allowHalfOpen`. |
| v12.4.0 | Ahora se soporta la opción `hints`. |
| v12.2.0 | Ahora se soporta la opción `enableTrace`. |
| v11.8.0, v10.16.0 | Ahora se soporta la opción `timeout`. |
| v8.0.0 | Ahora se soporta la opción `lookup`. |
| v8.0.0 | La opción `ALPNProtocols` ahora puede ser un `TypedArray` o `DataView`. |
| v5.0.0 | Ahora se soportan las opciones ALPN. |
| v5.3.0, v4.7.0 | Ahora se soporta la opción `secureContext`. |
| v0.11.3 | Añadido en: v0.11.3 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `enableTrace`: Consulte [`tls.createServer()`](/es/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Host al que debe conectarse el cliente. **Predeterminado:** `'localhost'`.
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Puerto al que debe conectarse el cliente.
    - `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Crea una conexión de socket Unix a la ruta. Si se especifica esta opción, se ignoran `host` y `port`.
    - `socket` [\<stream.Duplex\>](/es/nodejs/api/stream#class-streamduplex) Establece una conexión segura en un socket dado en lugar de crear un nuevo socket. Normalmente, esta es una instancia de [`net.Socket`](/es/nodejs/api/net#class-netsocket), pero se permite cualquier flujo `Duplex`. Si se especifica esta opción, se ignoran `path`, `host` y `port`, excepto para la validación del certificado. Por lo general, un socket ya está conectado cuando se pasa a `tls.connect()`, pero se puede conectar más tarde. La conexión/desconexión/destrucción de `socket` es responsabilidad del usuario; llamar a `tls.connect()` no provocará que se llame a `net.connect()`.
    - `allowHalfOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si se establece en `false`, el socket finalizará automáticamente el lado de escritura cuando finalice el lado de lectura. Si se establece la opción `socket`, esta opción no tiene efecto. Consulte la opción `allowHalfOpen` de [`net.Socket`](/es/nodejs/api/net#class-netsocket) para obtener más detalles. **Predeterminado:** `false`.
    - `rejectUnauthorized` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si no es `false`, el certificado del servidor se verifica con la lista de CA suministradas. Se emite un evento `'error'` si la verificación falla; `err.code` contiene el código de error de OpenSSL. **Predeterminado:** `true`.
    - `pskCallback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Para la negociación TLS-PSK, consulte [Claves precompartidas](/es/nodejs/api/tls#pre-shared-keys).
    - `ALPNProtocols`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer[]\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Un array de cadenas, `Buffer`s, `TypedArray`s o `DataView`s, o un solo `Buffer`, `TypedArray` o `DataView` que contiene los protocolos ALPN soportados. Los `Buffer`s deben tener el formato `[len][name][len][name]...` por ejemplo, `'\x08http/1.1\x08http/1.0'`, donde el byte `len` es la longitud del siguiente nombre de protocolo. Pasar un array suele ser mucho más sencillo, por ejemplo, `['http/1.1', 'http/1.0']`. Los protocolos anteriores en la lista tienen mayor preferencia que los posteriores.
    - `servername`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nombre del servidor para la extensión SNI (Server Name Indication) TLS. Es el nombre del host al que se está conectando y debe ser un nombre de host, no una dirección IP. Un servidor multi-homed puede usarlo para elegir el certificado correcto para presentar al cliente, consulte la opción `SNICallback` en [`tls.createServer()`](/es/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener).
    - `checkServerIdentity(servername, cert)` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una función de callback para usar (en lugar de la función integrada `tls.checkServerIdentity()`) al verificar el nombre de host del servidor (o el `servername` proporcionado cuando se establece explícitamente) con el certificado. Esto debe devolver un [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) si la verificación falla. El método debe devolver `undefined` si se verifican el `servername` y el `cert`.
    - `session` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) Una instancia de `Buffer` que contiene la sesión TLS.
    - `minDHSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Tamaño mínimo del parámetro DH en bits para aceptar una conexión TLS. Cuando un servidor ofrece un parámetro DH con un tamaño inferior a `minDHSize`, la conexión TLS se destruye y se produce un error. **Predeterminado:** `1024`.
    - `highWaterMark`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Coherente con el parámetro `highWaterMark` del flujo de lectura. **Predeterminado:** `16 * 1024`.
    - `secureContext`: Objeto de contexto TLS creado con [`tls.createSecureContext()`](/es/nodejs/api/tls#tlscreatesecurecontextoptions). Si *no* se proporciona un `secureContext`, se creará uno pasando todo el objeto `options` a `tls.createSecureContext()`.
    - `onread` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Si falta la opción `socket`, los datos entrantes se almacenan en un solo `buffer` y se pasan al `callback` suministrado cuando llegan datos al socket, de lo contrario, la opción se ignora. Consulte la opción `onread` de [`net.Socket`](/es/nodejs/api/net#class-netsocket) para obtener más detalles.
    - ...: Opciones de [`tls.createSecureContext()`](/es/nodejs/api/tls#tlscreatesecurecontextoptions) que se utilizan si falta la opción `secureContext`, de lo contrario, se ignoran.
    - ...: Cualquier opción [`socket.connect()`](/es/nodejs/api/net#socketconnectoptions-connectlistener) que aún no esté en la lista.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Devuelve: [\<tls.TLSSocket\>](/es/nodejs/api/tls#class-tlstlssocket)

La función `callback`, si se especifica, se agregará como un listener para el evento [`'secureConnect'`](/es/nodejs/api/tls#event-secureconnect).

`tls.connect()` devuelve un objeto [`tls.TLSSocket`](/es/nodejs/api/tls#class-tlstlssocket).

A diferencia de la API `https`, `tls.connect()` no habilita la extensión SNI (Server Name Indication) de forma predeterminada, lo que puede provocar que algunos servidores devuelvan un certificado incorrecto o rechacen la conexión por completo. Para habilitar SNI, establezca la opción `servername` además de `host`.

Lo siguiente ilustra un cliente para el ejemplo de servidor eco de [`tls.createServer()`](/es/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener):

::: code-group
```js [ESM]
// Asume un servidor eco que está escuchando en el puerto 8000.
import { connect } from 'node:tls';
import { readFileSync } from 'node:fs';
import { stdin } from 'node:process';

const options = {
  // Necesario solo si el servidor requiere autenticación de certificado de cliente.
  key: readFileSync('client-key.pem'),
  cert: readFileSync('client-cert.pem'),

  // Necesario solo si el servidor usa un certificado autofirmado.
  ca: [ readFileSync('server-cert.pem') ],

  // Necesario solo si el certificado del servidor no es para "localhost".
  checkServerIdentity: () => { return null; },
};

const socket = connect(8000, options, () => {
  console.log('client connected',
              socket.authorized ? 'authorized' : 'unauthorized');
  stdin.pipe(socket);
  stdin.resume();
});
socket.setEncoding('utf8');
socket.on('data', (data) => {
  console.log(data);
});
socket.on('end', () => {
  console.log('server ends connection');
});
```

```js [CJS]
// Asume un servidor eco que está escuchando en el puerto 8000.
const { connect } = require('node:tls');
const { readFileSync } = require('node:fs');

const options = {
  // Necesario solo si el servidor requiere autenticación de certificado de cliente.
  key: readFileSync('client-key.pem'),
  cert: readFileSync('client-cert.pem'),

  // Necesario solo si el servidor usa un certificado autofirmado.
  ca: [ readFileSync('server-cert.pem') ],

  // Necesario solo si el certificado del servidor no es para "localhost".
  checkServerIdentity: () => { return null; },
};

const socket = connect(8000, options, () => {
  console.log('client connected',
              socket.authorized ? 'authorized' : 'unauthorized');
  process.stdin.pipe(socket);
  process.stdin.resume();
});
socket.setEncoding('utf8');
socket.on('data', (data) => {
  console.log(data);
});
socket.on('end', () => {
  console.log('server ends connection');
});
```
:::

Para generar el certificado y la clave para este ejemplo, ejecute:

```bash [BASH]
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
  -keyout client-key.pem -out client-cert.pem
```
Luego, para generar el certificado `server-cert.pem` para este ejemplo, ejecute:

```bash [BASH]
openssl pkcs12 -certpbe AES-256-CBC -export -out server-cert.pem \
  -inkey client-key.pem -in client-cert.pem
```

## `tls.connect(path[, options][, callback])` {#tlsconnectpath-options-callback}

**Añadido en: v0.11.3**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Valor predeterminado para `options.path`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Consulte [`tls.connect()`](/es/nodejs/api/tls#tlsconnectoptions-callback).
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Consulte [`tls.connect()`](/es/nodejs/api/tls#tlsconnectoptions-callback).
- Devuelve: [\<tls.TLSSocket\>](/es/nodejs/api/tls#class-tlstlssocket)

Igual que [`tls.connect()`](/es/nodejs/api/tls#tlsconnectoptions-callback) excepto que `path` se puede proporcionar como argumento en lugar de como opción.

Una opción de ruta, si se especifica, tendrá prioridad sobre el argumento de ruta.

## `tls.connect(port[, host][, options][, callback])` {#tlsconnectport-host-options-callback}

**Añadido en: v0.11.3**

- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Valor predeterminado para `options.port`.
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Valor predeterminado para `options.host`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Consulte [`tls.connect()`](/es/nodejs/api/tls#tlsconnectoptions-callback).
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Consulte [`tls.connect()`](/es/nodejs/api/tls#tlsconnectoptions-callback).
- Devuelve: [\<tls.TLSSocket\>](/es/nodejs/api/tls#class-tlstlssocket)

Igual que [`tls.connect()`](/es/nodejs/api/tls#tlsconnectoptions-callback) excepto que `port` y `host` se pueden proporcionar como argumentos en lugar de como opciones.

Una opción de puerto o host, si se especifica, tendrá prioridad sobre cualquier argumento de puerto o host.

## `tls.createSecureContext([options])` {#tlscreatesecurecontextoptions}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v22.9.0, v20.18.0 | Se ha añadido la opción `allowPartialTrustChain`. |
| v22.4.0, v20.16.0 | Las opciones `clientCertEngine`, `privateKeyEngine` y `privateKeyIdentifier` dependen de la compatibilidad con motores personalizados en OpenSSL, que está en desuso en OpenSSL 3. |
| v19.8.0, v18.16.0 | La opción `dhparam` ahora se puede establecer en `'auto'` para habilitar DHE con parámetros conocidos apropiados. |
| v12.12.0 | Se añadieron las opciones `privateKeyIdentifier` y `privateKeyEngine` para obtener la clave privada de un motor OpenSSL. |
| v12.11.0 | Se añadió la opción `sigalgs` para invalidar los algoritmos de firma soportados. |
| v12.0.0 | Se añadió soporte para TLSv1.3. |
| v11.5.0 | La opción `ca:` ahora soporta `BEGIN TRUSTED CERTIFICATE`. |
| v11.4.0, v10.16.0 | `minVersion` y `maxVersion` se pueden usar para restringir las versiones del protocolo TLS permitidas. |
| v10.0.0 | El `ecdhCurve` ya no se puede establecer en `false` debido a un cambio en OpenSSL. |
| v9.3.0 | El parámetro `options` ahora puede incluir `clientCertEngine`. |
| v9.0.0 | La opción `ecdhCurve` ahora puede ser múltiples nombres de curvas separados por `':'` o `'auto'`. |
| v7.3.0 | Si la opción `key` es un array, las entradas individuales ya no necesitan una propiedad `passphrase`. Las entradas del `Array` también pueden ser simplemente `string`s o `Buffer`s ahora. |
| v5.2.0 | La opción `ca` ahora puede ser una única cadena que contenga múltiples certificados CA. |
| v0.11.13 | Añadido en: v0.11.13 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `allowPartialTrustChain` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Tratar los certificados intermedios (no autofirmados) en la lista de certificados CA de confianza como de confianza.
    - `ca` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<Buffer[]\>](/es/nodejs/api/buffer#class-buffer) Opcionalmente, anula los certificados CA de confianza. El valor predeterminado es confiar en las CA conocidas seleccionadas por Mozilla. Las CA de Mozilla se reemplazan por completo cuando las CA se especifican explícitamente usando esta opción. El valor puede ser una cadena o `Buffer`, o un `Array` de cadenas y/o `Buffer`s. Cualquier cadena o `Buffer` puede contener múltiples CA PEM concatenadas. El certificado del par debe poder encadenarse a una CA de confianza para que la conexión sea autenticada. Cuando use certificados que no puedan encadenarse a una CA conocida, la CA del certificado debe especificarse explícitamente como de confianza o la conexión fallará al autenticarse. Si el par usa un certificado que no coincide o no se encadena a una de las CA predeterminadas, use la opción `ca` para proporcionar un certificado CA al que el certificado del par pueda coincidir o encadenarse. Para los certificados autofirmados, el certificado es su propia CA, y debe proporcionarse. Para los certificados codificados en PEM, los tipos admitidos son "TRUSTED CERTIFICATE", "X509 CERTIFICATE" y "CERTIFICATE". Consulte también [`tls.rootCertificates`](/es/nodejs/api/tls#tlsrootcertificates).
    - `cert` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<Buffer[]\>](/es/nodejs/api/buffer#class-buffer) Cadenas de certificados en formato PEM. Se debe proporcionar una cadena de certificados por clave privada. Cada cadena de certificados debe constar del certificado con formato PEM para una `key` privada proporcionada, seguido de los certificados intermedios con formato PEM (si los hay), en orden, y sin incluir la CA raíz (la CA raíz debe ser conocida previamente por el par, consulte `ca`). Cuando proporcione varias cadenas de certificados, no tienen que estar en el mismo orden que sus claves privadas en `key`. Si no se proporcionan los certificados intermedios, el par no podrá validar el certificado y el handshake fallará.
    - `sigalgs` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Lista separada por dos puntos de algoritmos de firma soportados. La lista puede contener algoritmos de resumen (`SHA256`, `MD5`, etc.), algoritmos de clave pública (`RSA-PSS`, `ECDSA`, etc.), combinación de ambos (por ejemplo, 'RSA+SHA384') o nombres de esquema TLS v1.3 (por ejemplo, `rsa_pss_pss_sha512`). Consulte [páginas de manual de OpenSSL](https://www.openssl.org/docs/man1.1.1/man3/SSL_CTX_set1_sigalgs_list) para obtener más información.
    - `ciphers` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Especificación del conjunto de cifrado, reemplazando el valor predeterminado. Para obtener más información, consulte [Modificación del conjunto de cifrado TLS predeterminado](/es/nodejs/api/tls#modifying-the-default-tls-cipher-suite). Los cifrados permitidos se pueden obtener a través de [`tls.getCiphers()`](/es/nodejs/api/tls#tlsgetciphers). Los nombres de los cifrados deben estar en mayúsculas para que OpenSSL los acepte.
    - `clientCertEngine` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nombre de un motor OpenSSL que puede proporcionar el certificado de cliente. **Obsoleto.**
    - `crl` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<Buffer[]\>](/es/nodejs/api/buffer#class-buffer) CRL (Listas de revocación de certificados) con formato PEM.
    - `dhparam` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) `'auto'` o parámetros Diffie-Hellman personalizados, requeridos para [secreto perfecto hacia adelante](/es/nodejs/api/tls#perfect-forward-secrecy) no ECDHE. Si se omite o no es válido, los parámetros se descartan silenciosamente y los cifrados DHE no estarán disponibles. El [secreto perfecto hacia adelante](/es/nodejs/api/tls#perfect-forward-secrecy) basado en [ECDHE](https://en.wikipedia.org/wiki/Elliptic_curve_Diffie%E2%80%93Hellman) seguirá estando disponible.
    - `ecdhCurve` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Una cadena que describe una curva con nombre o una lista separada por dos puntos de NID o nombres de curvas, por ejemplo, `P-521:P-384:P-256`, para usar para el acuerdo de clave ECDH. Establezca en `auto` para seleccionar la curva automáticamente. Use [`crypto.getCurves()`](/es/nodejs/api/crypto#cryptogetcurves) para obtener una lista de nombres de curvas disponibles. En versiones recientes, `openssl ecparam -list_curves` también mostrará el nombre y la descripción de cada curva elíptica disponible. **Predeterminado:** [`tls.DEFAULT_ECDH_CURVE`](/es/nodejs/api/tls#tlsdefault_ecdh_curve).
    - `honorCipherOrder` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Intente usar las preferencias del conjunto de cifrado del servidor en lugar de las del cliente. Cuando es `true`, hace que `SSL_OP_CIPHER_SERVER_PREFERENCE` se establezca en `secureOptions`, consulte [Opciones de OpenSSL](/es/nodejs/api/crypto#openssl-options) para obtener más información.
    - `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<Buffer[]\>](/es/nodejs/api/buffer#class-buffer) | [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Claves privadas en formato PEM. PEM permite la opción de que las claves privadas se cifren. Las claves cifradas se descifrarán con `options.passphrase`. Se pueden proporcionar varias claves usando diferentes algoritmos como un array de cadenas o buffers de claves no cifradas, o un array de objetos en la forma `{pem: \<string|buffer\>[, passphrase: \<string\>]}`. La forma de objeto solo puede ocurrir en un array. `object.passphrase` es opcional. Las claves cifradas se descifrarán con `object.passphrase` si se proporciona, o `options.passphrase` si no lo está.
    - `privateKeyEngine` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nombre de un motor OpenSSL para obtener la clave privada de. Debe usarse junto con `privateKeyIdentifier`. **Obsoleto.**
    - `privateKeyIdentifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Identificador de una clave privada gestionada por un motor OpenSSL. Debe usarse junto con `privateKeyEngine`. No debe establecerse junto con `key`, porque ambas opciones definen una clave privada de diferentes maneras. **Obsoleto.**
    - `maxVersion` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Opcionalmente, establezca la versión máxima de TLS para permitir. Uno de `'TLSv1.3'`, `'TLSv1.2'`, `'TLSv1.1'` o `'TLSv1'`. No se puede especificar junto con la opción `secureProtocol`; use uno u otro. **Predeterminado:** [`tls.DEFAULT_MAX_VERSION`](/es/nodejs/api/tls#tlsdefault_max_version).
    - `minVersion` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Opcionalmente, establezca la versión mínima de TLS para permitir. Uno de `'TLSv1.3'`, `'TLSv1.2'`, `'TLSv1.1'` o `'TLSv1'`. No se puede especificar junto con la opción `secureProtocol`; use uno u otro. Evite establecerlo en menos de TLSv1.2, pero puede ser necesario para la interoperabilidad. Las versiones anteriores a TLSv1.2 pueden requerir la degradación del [Nivel de seguridad de OpenSSL](/es/nodejs/api/tls#openssl-security-level). **Predeterminado:** [`tls.DEFAULT_MIN_VERSION`](/es/nodejs/api/tls#tlsdefault_min_version).
    - `passphrase` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Frase de contraseña compartida utilizada para una sola clave privada y/o un PFX.
    - `pfx` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<Buffer[]\>](/es/nodejs/api/buffer#class-buffer) | [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Clave privada y cadena de certificados codificadas en PFX o PKCS12. `pfx` es una alternativa a proporcionar `key` y `cert` individualmente. PFX suele estar cifrado, si lo está, `passphrase` se usará para descifrarlo. Se pueden proporcionar múltiples PFX como un array de buffers PFX no cifrados, o un array de objetos en la forma `{buf: \<string|buffer\>[, passphrase: \<string\>]}`. La forma de objeto solo puede ocurrir en un array. `object.passphrase` es opcional. Los PFX cifrados se descifrarán con `object.passphrase` si se proporciona, o `options.passphrase` si no lo está.
    - `secureOptions` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Afecta opcionalmente el comportamiento del protocolo OpenSSL, lo cual no suele ser necesario. ¡Esto debe usarse con cuidado, si es que se usa! El valor es una máscara de bits numérica de las opciones `SSL_OP_*` de [Opciones de OpenSSL](/es/nodejs/api/crypto#openssl-options).
    - `secureProtocol` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Mecanismo heredado para seleccionar la versión del protocolo TLS para usar, no admite el control independiente de la versión mínima y máxima, y no admite la limitación del protocolo a TLSv1.3. Use `minVersion` y `maxVersion` en su lugar. Los valores posibles se enumeran como [SSL_METHODS](https://www.openssl.org/docs/man1.1.1/man7/ssl#Dealing-with-Protocol-Methods), use los nombres de las funciones como cadenas. Por ejemplo, use `'TLSv1_1_method'` para forzar la versión 1.1 de TLS, o `'TLS_method'` para permitir cualquier versión del protocolo TLS hasta TLSv1.3. No se recomienda usar versiones TLS inferiores a 1.2, pero puede ser necesario para la interoperabilidad. **Predeterminado:** ninguno, consulte `minVersion`.
    - `sessionIdContext` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Identificador opaco utilizado por los servidores para garantizar que el estado de la sesión no se comparta entre las aplicaciones. No utilizado por los clientes.
    - `ticketKeys`: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) 48 bytes de datos pseudoaleatorios criptográficamente fuertes. Consulte [Reanudación de sesión](/es/nodejs/api/tls#session-resumption) para obtener más información.
    - `sessionTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de segundos después de los cuales una sesión TLS creada por el servidor ya no se podrá reanudar. Consulte [Reanudación de sesión](/es/nodejs/api/tls#session-resumption) para obtener más información. **Predeterminado:** `300`.
  
 

[`tls.createServer()`](/es/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener) establece el valor predeterminado de la opción `honorCipherOrder` en `true`, otras API que crean contextos seguros lo dejan sin establecer.

[`tls.createServer()`](/es/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener) usa un valor hash SHA1 truncado de 128 bits generado a partir de `process.argv` como el valor predeterminado de la opción `sessionIdContext`, otras API que crean contextos seguros no tienen un valor predeterminado.

El método `tls.createSecureContext()` crea un objeto `SecureContext`. Es utilizable como argumento para varias API `tls`, como [`server.addContext()`](/es/nodejs/api/tls#serveraddcontexthostname-context), pero no tiene métodos públicos. El constructor [`tls.Server`](/es/nodejs/api/tls#class-tlsserver) y el método [`tls.createServer()`](/es/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener) no admiten la opción `secureContext`.

Se *requiere* una clave para los cifrados que usan certificados. Se puede usar `key` o `pfx` para proporcionarla.

Si no se proporciona la opción `ca`, entonces Node.js usará por defecto la [lista de CA de confianza pública de Mozilla](https://hg.mozilla.org/mozilla-central/raw-file/tip/security/nss/lib/ckfw/builtins/certdata.txt).

Se desaconsejan los parámetros DHE personalizados en favor de la nueva opción `dhparam: 'auto'`. Cuando se establece en `'auto'`, se seleccionarán automáticamente parámetros DHE conocidos de suficiente solidez. De lo contrario, si es necesario, se puede usar `openssl dhparam` para crear parámetros personalizados. La longitud de la clave debe ser mayor o igual que 1024 bits o se generará un error. Aunque 1024 bits es permisible, use 2048 bits o más para una mayor seguridad.


## `tls.createSecurePair([context][, isServer][, requestCert][, rejectUnauthorized][, options])` {#tlscreatesecurepaircontext-isserver-requestcert-rejectunauthorized-options}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v5.0.0 | Ahora se admiten las opciones ALPN. |
| v0.11.3 | Obsoleto desde: v0.11.3 |
| v0.3.2 | Añadido en: v0.3.2 |
:::

::: danger [Estable: 0 - Obsoleto]
[Estable: 0](/es/nodejs/api/documentation#stability-index) [Estabilidad: 0](/es/nodejs/api/documentation#stability-index) - Obsoleto: Utilice [`tls.TLSSocket`](/es/nodejs/api/tls#class-tlstlssocket) en su lugar.
:::

- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un objeto de contexto seguro devuelto por `tls.createSecureContext()`
- `isServer` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` para especificar que esta conexión TLS debe abrirse como un servidor.
- `requestCert` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` para especificar si un servidor debe solicitar un certificado de un cliente conectado. Solo se aplica cuando `isServer` es `true`.
- `rejectUnauthorized` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si no es `false`, un servidor rechazará automáticamente a los clientes con certificados no válidos. Solo se aplica cuando `isServer` es `true`.
- `options`
    - `enableTrace`: Consulte [`tls.createServer()`](/es/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `secureContext`: Un objeto de contexto TLS de [`tls.createSecureContext()`](/es/nodejs/api/tls#tlscreatesecurecontextoptions)
    - `isServer`: Si es `true`, el socket TLS se instanciará en modo servidor. **Predeterminado:** `false`.
    - `server` [\<net.Server\>](/es/nodejs/api/net#class-netserver) Una instancia de [`net.Server`](/es/nodejs/api/net#class-netserver)
    - `requestCert`: Consulte [`tls.createServer()`](/es/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `rejectUnauthorized`: Consulte [`tls.createServer()`](/es/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `ALPNProtocols`: Consulte [`tls.createServer()`](/es/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `SNICallback`: Consulte [`tls.createServer()`](/es/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `session` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) Una instancia de `Buffer` que contiene una sesión TLS.
    - `requestOCSP` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si es `true`, especifica que la extensión de solicitud de estado OCSP se añadirá al saludo del cliente y se emitirá un evento `'OCSPResponse'` en el socket antes de establecer una comunicación segura.

 

Crea un nuevo objeto de par seguro con dos flujos, uno de los cuales lee y escribe los datos cifrados y el otro lee y escribe los datos de texto sin cifrar. Generalmente, el flujo cifrado se canaliza hacia/desde un flujo de datos cifrados entrante y el flujo de texto sin cifrar se utiliza como reemplazo del flujo cifrado inicial.

`tls.createSecurePair()` devuelve un objeto `tls.SecurePair` con propiedades de flujo `cleartext` y `encrypted`.

El uso de `cleartext` tiene la misma API que [`tls.TLSSocket`](/es/nodejs/api/tls#class-tlstlssocket).

El método `tls.createSecurePair()` ahora está obsoleto en favor de `tls.TLSSocket()`. Por ejemplo, el código:

```js [ESM]
pair = tls.createSecurePair(/* ... */);
pair.encrypted.pipe(socket);
socket.pipe(pair.encrypted);
```
se puede reemplazar por:

```js [ESM]
secureSocket = tls.TLSSocket(socket, options);
```
donde `secureSocket` tiene la misma API que `pair.cleartext`.


## `tls.createServer([options][, secureConnectionListener])` {#tlscreateserveroptions-secureconnectionlistener}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v22.4.0, v20.16.0 | La opción `clientCertEngine` depende del soporte de motores personalizados en OpenSSL, que está en desuso en OpenSSL 3. |
| v19.0.0 | Si `ALPNProtocols` está configurado, las conexiones entrantes que envían una extensión ALPN sin protocolos compatibles se terminan con una alerta fatal `no_application_protocol`. |
| v20.4.0, v18.19.0 | El parámetro `options` ahora puede incluir `ALPNCallback`. |
| v12.3.0 | El parámetro `options` ahora soporta opciones `net.createServer()`. |
| v9.3.0 | El parámetro `options` ahora puede incluir `clientCertEngine`. |
| v8.0.0 | La opción `ALPNProtocols` ahora puede ser un `TypedArray` o `DataView`. |
| v5.0.0 | Ahora se admiten las opciones ALPN. |
| v0.3.2 | Añadido en: v0.3.2 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ALPNProtocols`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer[]\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Una matriz de cadenas, `Buffer`s, `TypedArray`s, o `DataView`s, o un solo `Buffer`, `TypedArray`, o `DataView` que contiene los protocolos ALPN compatibles. Los `Buffer`s deben tener el formato `[len][name][len][name]...` p. ej. `0x05hello0x05world`, donde el primer byte es la longitud del siguiente nombre de protocolo. Pasar una matriz suele ser mucho más sencillo, p. ej. `['hello', 'world']`. (Los protocolos deben ordenarse por su prioridad).
    - `ALPNCallback`: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Si se establece, esto se llamará cuando un cliente abra una conexión usando la extensión ALPN. Se pasará un argumento a la retrollamada: un objeto que contiene los campos `servername` y `protocols`, que contienen respectivamente el nombre del servidor de la extensión SNI (si existe) y una matriz de cadenas de nombres de protocolo ALPN. La retrollamada debe devolver una de las cadenas que figuran en `protocols`, que se devolverá al cliente como el protocolo ALPN seleccionado, o `undefined`, para rechazar la conexión con una alerta fatal. Si se devuelve una cadena que no coincide con uno de los protocolos ALPN del cliente, se lanzará un error. Esta opción no se puede utilizar con la opción `ALPNProtocols`, y establecer ambas opciones lanzará un error.
    - `clientCertEngine` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nombre de un motor OpenSSL que puede proporcionar el certificado del cliente. **Obsoleto.**
    - `enableTrace` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si es `true`, [`tls.TLSSocket.enableTrace()`](/es/nodejs/api/tls#tlssocketenabletrace) se llamará en las nuevas conexiones. El rastreo se puede habilitar después de que se establezca la conexión segura, pero esta opción debe utilizarse para rastrear la configuración de la conexión segura. **Predeterminado:** `false`.
    - `handshakeTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Abortar la conexión si el handshake SSL/TLS no termina en el número de milisegundos especificado. Se emite un `'tlsClientError'` en el objeto `tls.Server` cada vez que un handshake se agota. **Predeterminado:** `120000` (120 segundos).
    - `rejectUnauthorized` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si no es `false`, el servidor rechazará cualquier conexión que no esté autorizada con la lista de CAs proporcionadas. Esta opción sólo tiene efecto si `requestCert` es `true`. **Predeterminado:** `true`.
    - `requestCert` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si es `true`, el servidor solicitará un certificado a los clientes que se conecten e intentará verificar ese certificado. **Predeterminado:** `false`.
    - `sessionTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de segundos después de los cuales una sesión TLS creada por el servidor ya no será reanudable. Consulte [Reanudación de sesión](/es/nodejs/api/tls#session-resumption) para obtener más información. **Predeterminado:** `300`.
    - `SNICallback(servername, callback)` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una función que se llamará si el cliente soporta la extensión SNI TLS. Se pasarán dos argumentos cuando se llame: `servername` y `callback`. `callback` es una retrollamada de primer error que toma dos argumentos opcionales: `error` y `ctx`. `ctx`, si se proporciona, es una instancia de `SecureContext`. Se puede utilizar [`tls.createSecureContext()`](/es/nodejs/api/tls#tlscreatesecurecontextoptions) para obtener un `SecureContext` adecuado. Si se llama a `callback` con un argumento `ctx` falso, se utilizará el contexto seguro predeterminado del servidor. Si no se proporcionó `SNICallback`, se utilizará la retrollamada predeterminada con la API de alto nivel (véase más abajo).
    - `ticketKeys`: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) 48 bytes de datos pseudoaleatorios criptográficamente fuertes. Consulte [Reanudación de sesión](/es/nodejs/api/tls#session-resumption) para obtener más información.
    - `pskCallback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Para la negociación TLS-PSK, consulte [Claves precompartidas](/es/nodejs/api/tls#pre-shared-keys).
    - `pskIdentityHint` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) pista opcional para enviar a un cliente para ayudar a seleccionar la identidad durante la negociación TLS-PSK. Se ignorará en TLS 1.3. Al no poder establecer pskIdentityHint, se emitirá `'tlsClientError'` con el código `'ERR_TLS_PSK_SET_IDENTITY_HINT_FAILED'`.
    - ...: Se puede proporcionar cualquier opción [`tls.createSecureContext()`](/es/nodejs/api/tls#tlscreatesecurecontextoptions). Para los servidores, las opciones de identidad (`pfx`, `key`/`cert`, o `pskCallback`) suelen ser obligatorias.
    - ...: Se puede proporcionar cualquier opción [`net.createServer()`](/es/nodejs/api/net#netcreateserveroptions-connectionlistener).


- `secureConnectionListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Devuelve: [\<tls.Server\>](/es/nodejs/api/tls#class-tlsserver)

Crea un nuevo [`tls.Server`](/es/nodejs/api/tls#class-tlsserver). El `secureConnectionListener`, si se proporciona, se establece automáticamente como un listener para el evento [`'secureConnection'`](/es/nodejs/api/tls#event-secureconnection).

Las opciones de `ticketKeys` se comparten automáticamente entre los trabajadores del módulo `node:cluster`.

Lo siguiente ilustra un simple servidor de eco:

::: code-group
```js [ESM]
import { createServer } from 'node:tls';
import { readFileSync } from 'node:fs';

const options = {
  key: readFileSync('server-key.pem'),
  cert: readFileSync('server-cert.pem'),

  // Esto es necesario sólo si se utiliza la autenticación de certificado de cliente.
  requestCert: true,

  // Esto es necesario sólo si el cliente utiliza un certificado autofirmado.
  ca: [ readFileSync('client-cert.pem') ],
};

const server = createServer(options, (socket) => {
  console.log('servidor conectado',
              socket.authorized ? 'authorized' : 'unauthorized');
  socket.write('¡bienvenido!\n');
  socket.setEncoding('utf8');
  socket.pipe(socket);
});
server.listen(8000, () => {
  console.log('servidor enlazado');
});
```

```js [CJS]
const { createServer } = require('node:tls');
const { readFileSync } = require('node:fs');

const options = {
  key: readFileSync('server-key.pem'),
  cert: readFileSync('server-cert.pem'),

  // Esto es necesario sólo si se utiliza la autenticación de certificado de cliente.
  requestCert: true,

  // Esto es necesario sólo si el cliente utiliza un certificado autofirmado.
  ca: [ readFileSync('client-cert.pem') ],
};

const server = createServer(options, (socket) => {
  console.log('servidor conectado',
              socket.authorized ? 'authorized' : 'unauthorized');
  socket.write('¡bienvenido!\n');
  socket.setEncoding('utf8');
  socket.pipe(socket);
});
server.listen(8000, () => {
  console.log('servidor enlazado');
});
```
:::

Para generar el certificado y la clave para este ejemplo, ejecute:

```bash [BASH]
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
  -keyout server-key.pem -out server-cert.pem
```
Luego, para generar el certificado `client-cert.pem` para este ejemplo, ejecute:

```bash [BASH]
openssl pkcs12 -certpbe AES-256-CBC -export -out client-cert.pem \
  -inkey server-key.pem -in server-cert.pem
```
El servidor se puede probar conectándose a él utilizando el cliente de ejemplo de [`tls.connect()`](/es/nodejs/api/tls#tlsconnectoptions-callback).


## `tls.getCiphers()` {#tlsgetciphers}

**Agregado en: v0.10.2**

- Devuelve: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Devuelve un arreglo con los nombres de los cifrados TLS compatibles. Los nombres están en minúsculas por razones históricas, pero deben estar en mayúsculas para ser utilizados en la opción `ciphers` de [`tls.createSecureContext()`](/es/nodejs/api/tls#tlscreatesecurecontextoptions).

No todos los cifrados compatibles están habilitados de forma predeterminada. Consulte [Modificar el conjunto de cifrado TLS predeterminado](/es/nodejs/api/tls#modifying-the-default-tls-cipher-suite).

Los nombres de cifrado que comienzan con `'tls_'` son para TLSv1.3, todos los demás son para TLSv1.2 e inferiores.

```js [ESM]
console.log(tls.getCiphers()); // ['aes128-gcm-sha256', 'aes128-sha', ...]
```
## `tls.rootCertificates` {#tlsrootcertificates}

**Agregado en: v12.3.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Un arreglo inmutable de cadenas que representan los certificados raíz (en formato PEM) de la tienda CA de Mozilla incluida, tal como la proporciona la versión actual de Node.js.

La tienda CA incluida, tal como la proporciona Node.js, es una instantánea de la tienda CA de Mozilla que se fija en el momento del lanzamiento. Es idéntica en todas las plataformas compatibles.

## `tls.DEFAULT_ECDH_CURVE` {#tlsdefault_ecdh_curve}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.0.0 | El valor predeterminado cambió a `'auto'`. |
| v0.11.13 | Agregado en: v0.11.13 |
:::

El nombre de la curva predeterminada que se utilizará para el acuerdo de clave ECDH en un servidor tls. El valor predeterminado es `'auto'`. Consulte [`tls.createSecureContext()`](/es/nodejs/api/tls#tlscreatesecurecontextoptions) para obtener más información.

## `tls.DEFAULT_MAX_VERSION` {#tlsdefault_max_version}

**Agregado en: v11.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El valor predeterminado de la opción `maxVersion` de [`tls.createSecureContext()`](/es/nodejs/api/tls#tlscreatesecurecontextoptions). Se le puede asignar cualquiera de las versiones de protocolo TLS compatibles, `'TLSv1.3'`, `'TLSv1.2'`, `'TLSv1.1'` o `'TLSv1'`. **Predeterminado:** `'TLSv1.3'`, a menos que se cambie mediante las opciones de CLI. El uso de `--tls-max-v1.2` establece el valor predeterminado en `'TLSv1.2'`. El uso de `--tls-max-v1.3` establece el valor predeterminado en `'TLSv1.3'`. Si se proporcionan varias opciones, se utiliza el máximo más alto.


## `tls.DEFAULT_MIN_VERSION` {#tlsdefault_min_version}

**Agregado en: v11.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El valor predeterminado de la opción `minVersion` de [`tls.createSecureContext()`](/es/nodejs/api/tls#tlscreatesecurecontextoptions). Se le puede asignar cualquiera de las versiones de protocolo TLS compatibles, `'TLSv1.3'`, `'TLSv1.2'`, `'TLSv1.1'` o `'TLSv1'`. Las versiones anteriores a TLSv1.2 pueden requerir la degradación del [Nivel de seguridad de OpenSSL](/es/nodejs/api/tls#openssl-security-level). **Predeterminado:** `'TLSv1.2'`, a menos que se cambie usando las opciones de la CLI. Usar `--tls-min-v1.0` establece el valor predeterminado en `'TLSv1'`. Usar `--tls-min-v1.1` establece el valor predeterminado en `'TLSv1.1'`. Usar `--tls-min-v1.3` establece el valor predeterminado en `'TLSv1.3'`. Si se proporcionan varias de las opciones, se utiliza el mínimo más bajo.

## `tls.DEFAULT_CIPHERS` {#tlsdefault_ciphers}

**Agregado en: v19.8.0, v18.16.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El valor predeterminado de la opción `ciphers` de [`tls.createSecureContext()`](/es/nodejs/api/tls#tlscreatesecurecontextoptions). Se le puede asignar cualquiera de los cifrados OpenSSL compatibles. El valor predeterminado es el contenido de `crypto.constants.defaultCoreCipherList`, a menos que se cambie usando las opciones de la CLI usando `--tls-default-ciphers`.

