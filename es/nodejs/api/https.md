---
title: Documentación de Node.js - HTTPS
description: El módulo HTTPS en Node.js proporciona una implementación del protocolo TLS/SSL para habilitar conexiones HTTP seguras. Incluye métodos para crear servidores y clientes seguros, manejar certificados y gestionar conexiones seguras.
head:
  - - meta
    - name: og:title
      content: Documentación de Node.js - HTTPS | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: El módulo HTTPS en Node.js proporciona una implementación del protocolo TLS/SSL para habilitar conexiones HTTP seguras. Incluye métodos para crear servidores y clientes seguros, manejar certificados y gestionar conexiones seguras.
  - - meta
    - name: twitter:title
      content: Documentación de Node.js - HTTPS | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: El módulo HTTPS en Node.js proporciona una implementación del protocolo TLS/SSL para habilitar conexiones HTTP seguras. Incluye métodos para crear servidores y clientes seguros, manejar certificados y gestionar conexiones seguras.
---


# HTTPS {#https}

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable
:::

**Código fuente:** [lib/https.js](https://github.com/nodejs/node/blob/v23.5.0/lib/https.js)

HTTPS es el protocolo HTTP sobre TLS/SSL. En Node.js, esto se implementa como un módulo separado.

## Determinar si el soporte de crypto no está disponible {#determining-if-crypto-support-is-unavailable}

Es posible que Node.js se construya sin incluir soporte para el módulo `node:crypto`. En tales casos, intentar `import` desde `https` o llamar a `require('node:https')` resultará en un error.

Cuando se utiliza CommonJS, el error que se produce se puede capturar utilizando try/catch:

```js [CJS]
let https;
try {
  https = require('node:https');
} catch (err) {
  console.error('¡el soporte de https está desactivado!');
}
```
Cuando se utiliza la palabra clave léxica ESM `import`, el error solo se puede capturar si se registra un controlador para `process.on('uncaughtException')` *antes* de que se intente cargar el módulo (utilizando, por ejemplo, un módulo de precarga).

Cuando se utiliza ESM, si existe la posibilidad de que el código se ejecute en una compilación de Node.js donde el soporte de crypto no está habilitado, considere usar la función [`import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) en lugar de la palabra clave léxica `import`:

```js [ESM]
let https;
try {
  https = await import('node:https');
} catch (err) {
  console.error('¡el soporte de https está desactivado!');
}
```
## Clase: `https.Agent` {#class-httpsagent}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v5.3.0 | admite `0` `maxCachedSessions` para deshabilitar el almacenamiento en caché de sesiones TLS. |
| v2.5.0 | parámetro `maxCachedSessions` añadido a `options` para la reutilización de sesiones TLS. |
| v0.4.5 | Añadido en: v0.4.5 |
:::

Un objeto [`Agent`](/es/nodejs/api/https#class-httpsagent) para HTTPS similar a [`http.Agent`](/es/nodejs/api/http#class-httpagent). Consulte [`https.request()`](/es/nodejs/api/https#httpsrequestoptions-callback) para obtener más información.

### `new Agent([options])` {#new-agentoptions}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v12.5.0 | no establezca automáticamente servername si el host de destino se especificó utilizando una dirección IP. |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Conjunto de opciones configurables para establecer en el agente. Puede tener los mismos campos que para [`http.Agent(options)`](/es/nodejs/api/http#new-agentoptions), y
    - `maxCachedSessions` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) número máximo de sesiones TLS almacenadas en caché. Use `0` para deshabilitar el almacenamiento en caché de sesiones TLS. **Predeterminado:** `100`.
    - `servername` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) el valor de [Extensión de indicación de nombre de servidor](https://en.wikipedia.org/wiki/Server_Name_Indication) que se enviará al servidor. Utilice una cadena vacía `''` para deshabilitar el envío de la extensión. **Predeterminado:** nombre de host del servidor de destino, a menos que el servidor de destino se especifique utilizando una dirección IP, en cuyo caso el valor predeterminado es `''` (sin extensión). Consulte [`Reanudación de sesión`](/es/nodejs/api/tls#session-resumption) para obtener información sobre la reutilización de la sesión TLS.


#### Evento: `'keylog'` {#event-keylog}

**Agregado en: v13.2.0, v12.16.0**

- `line` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) Línea de texto ASCII, en formato `SSLKEYLOGFILE` de NSS.
- `tlsSocket` [\<tls.TLSSocket\>](/es/nodejs/api/tls#class-tlstlssocket) La instancia `tls.TLSSocket` en la que se generó.

El evento `keylog` se emite cuando el material de la clave es generado o recibido por una conexión gestionada por este agente (normalmente antes de que se complete el handshake, pero no necesariamente). Este material de clave puede ser almacenado para la depuración, ya que permite que el tráfico TLS capturado sea descifrado. Puede ser emitido varias veces para cada socket.

Un caso de uso típico es añadir las líneas recibidas a un archivo de texto común, que luego es utilizado por software (como Wireshark) para descifrar el tráfico:

```js [ESM]
// ...
https.globalAgent.on('keylog', (line, tlsSocket) => {
  fs.appendFileSync('/tmp/ssl-keys.log', line, { mode: 0o600 });
});
```
## Clase: `https.Server` {#class-httpsserver}

**Agregado en: v0.3.4**

- Extiende: [\<tls.Server\>](/es/nodejs/api/tls#class-tlsserver)

Ver [`http.Server`](/es/nodejs/api/http#class-httpserver) para más información.

### `server.close([callback])` {#serverclosecallback}

**Agregado en: v0.1.90**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Devuelve: [\<https.Server\>](/es/nodejs/api/https#class-httpsserver)

Ver [`server.close()`](/es/nodejs/api/http#serverclosecallback) en el módulo `node:http`.

### `server[Symbol.asyncDispose]()` {#serversymbolasyncdispose}

**Agregado en: v20.4.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index) - Experimental
:::

Llama a [`server.close()`](/es/nodejs/api/https#serverclosecallback) y devuelve una promesa que se cumple cuando el servidor se ha cerrado.

### `server.closeAllConnections()` {#servercloseallconnections}

**Agregado en: v18.2.0**

Ver [`server.closeAllConnections()`](/es/nodejs/api/http#servercloseallconnections) en el módulo `node:http`.

### `server.closeIdleConnections()` {#servercloseidleconnections}

**Agregado en: v18.2.0**

Ver [`server.closeIdleConnections()`](/es/nodejs/api/http#servercloseidleconnections) en el módulo `node:http`.


### `server.headersTimeout` {#serverheaderstimeout}

**Agregado en: v11.3.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `60000`

Ver [`server.headersTimeout`](/es/nodejs/api/http#serverheaderstimeout) en el módulo `node:http`.

### `server.listen()` {#serverlisten}

Inicia el servidor HTTPS escuchando conexiones encriptadas. Este método es idéntico a [`server.listen()`](/es/nodejs/api/net#serverlisten) de [`net.Server`](/es/nodejs/api/net#class-netserver).

### `server.maxHeadersCount` {#servermaxheaderscount}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `2000`

Ver [`server.maxHeadersCount`](/es/nodejs/api/http#servermaxheaderscount) en el módulo `node:http`.

### `server.requestTimeout` {#serverrequesttimeout}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | El tiempo de espera predeterminado de la solicitud cambió de sin tiempo de espera a 300s (5 minutos). |
| v14.11.0 | Agregado en: v14.11.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `300000`

Ver [`server.requestTimeout`](/es/nodejs/api/http#serverrequesttimeout) en el módulo `node:http`.

### `server.setTimeout([msecs][, callback])` {#serversettimeoutmsecs-callback}

**Agregado en: v0.11.2**

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `120000` (2 minutos)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Devuelve: [\<https.Server\>](/es/nodejs/api/https#class-httpsserver)

Ver [`server.setTimeout()`](/es/nodejs/api/http#serversettimeoutmsecs-callback) en el módulo `node:http`.

### `server.timeout` {#servertimeout}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v13.0.0 | El tiempo de espera predeterminado cambió de 120s a 0 (sin tiempo de espera). |
| v0.11.2 | Agregado en: v0.11.2 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** 0 (sin tiempo de espera)

Ver [`server.timeout`](/es/nodejs/api/http#servertimeout) en el módulo `node:http`.


### `server.keepAliveTimeout` {#serverkeepalivetimeout}

**Añadido en: v8.0.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `5000` (5 segundos)

Ver [`server.keepAliveTimeout`](/es/nodejs/api/http#serverkeepalivetimeout) en el módulo `node:http`.

## `https.createServer([options][, requestListener])` {#httpscreateserveroptions-requestlistener}

**Añadido en: v0.3.4**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Acepta `options` de [`tls.createServer()`](/es/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener), [`tls.createSecureContext()`](/es/nodejs/api/tls#tlscreatesecurecontextoptions) y [`http.createServer()`](/es/nodejs/api/http#httpcreateserveroptions-requestlistener).
- `requestListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Un listener que se añadirá al evento `'request'`.
- Devuelve: [\<https.Server\>](/es/nodejs/api/https#class-httpsserver)



::: code-group
```js [ESM]
// curl -k https://localhost:8000/
import { createServer } from 'node:https';
import { readFileSync } from 'node:fs';

const options = {
  key: readFileSync('private-key.pem'),
  cert: readFileSync('certificate.pem'),
};

createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('hello world\n');
}).listen(8000);
```

```js [CJS]
// curl -k https://localhost:8000/
const https = require('node:https');
const fs = require('node:fs');

const options = {
  key: fs.readFileSync('private-key.pem'),
  cert: fs.readFileSync('certificate.pem'),
};

https.createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('hello world\n');
}).listen(8000);
```
:::

O



::: code-group
```js [ESM]
import { createServer } from 'node:https';
import { readFileSync } from 'node:fs';

const options = {
  pfx: readFileSync('test_cert.pfx'),
  passphrase: 'sample',
};

createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('hello world\n');
}).listen(8000);
```

```js [CJS]
const https = require('node:https');
const fs = require('node:fs');

const options = {
  pfx: fs.readFileSync('test_cert.pfx'),
  passphrase: 'sample',
};

https.createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('hello world\n');
}).listen(8000);
```
:::

Para generar el certificado y la clave para este ejemplo, ejecute:

```bash [BASH]
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
  -keyout private-key.pem -out certificate.pem
```
Luego, para generar el certificado `pfx` para este ejemplo, ejecute:

```bash [BASH]
openssl pkcs12 -certpbe AES-256-CBC -export -out test_cert.pfx \
  -inkey private-key.pem -in certificate.pem -passout pass:sample
```

## `https.get(options[, callback])` {#httpsgetoptions-callback}

## `https.get(url[, options][, callback])` {#httpsgeturl-options-callback}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.9.0 | El parámetro `url` ahora se puede pasar junto con un objeto `options` separado. |
| v7.5.0 | El parámetro `options` puede ser un objeto `URL` WHATWG. |
| v0.3.6 | Añadido en: v0.3.6 |
:::

- `url` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api) Acepta las mismas `options` que [`https.request()`](/es/nodejs/api/https#httpsrequestoptions-callback), con el método establecido en GET por defecto.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Similar a [`http.get()`](/es/nodejs/api/http#httpgetoptions-callback) pero para HTTPS.

`options` puede ser un objeto, una cadena o un objeto [`URL`](/es/nodejs/api/url#the-whatwg-url-api). Si `options` es una cadena, se analiza automáticamente con [`new URL()`](/es/nodejs/api/url#new-urlinput-base). Si es un objeto [`URL`](/es/nodejs/api/url#the-whatwg-url-api), se convertirá automáticamente en un objeto `options` ordinario.



::: code-group
```js [ESM]
import { get } from 'node:https';
import process from 'node:process';

get('https://encrypted.google.com/', (res) => {
  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);

  res.on('data', (d) => {
    process.stdout.write(d);
  });

}).on('error', (e) => {
  console.error(e);
});
```

```js [CJS]
const https = require('node:https');

https.get('https://encrypted.google.com/', (res) => {
  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);

  res.on('data', (d) => {
    process.stdout.write(d);
  });

}).on('error', (e) => {
  console.error(e);
});
```
:::


## `https.globalAgent` {#httpsglobalagent}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v19.0.0 | El agente ahora usa HTTP Keep-Alive y un tiempo de espera de 5 segundos de forma predeterminada. |
| v0.5.9 | Añadido en: v0.5.9 |
:::

Instancia global de [`https.Agent`](/es/nodejs/api/https#class-httpsagent) para todas las solicitudes de cliente HTTPS. Difiere de una configuración predeterminada de [`https.Agent`](/es/nodejs/api/https#class-httpsagent) al tener `keepAlive` habilitado y un `timeout` de 5 segundos.

## `https.request(options[, callback])` {#httpsrequestoptions-callback}

## `https.request(url[, options][, callback])` {#httpsrequesturl-options-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v22.4.0, v20.16.0 | La opción `clientCertEngine` depende del soporte del motor personalizado en OpenSSL que está obsoleto en OpenSSL 3. |
| v16.7.0, v14.18.0 | Al usar un objeto `URL` analizado, el nombre de usuario y la contraseña ahora se decodificarán correctamente en URI. |
| v14.1.0, v13.14.0 | Ahora se acepta la opción `highWaterMark`. |
| v10.9.0 | El parámetro `url` ahora se puede pasar junto con un objeto `options` separado. |
| v9.3.0 | El parámetro `options` ahora puede incluir `clientCertEngine`. |
| v7.5.0 | El parámetro `options` puede ser un objeto WHATWG `URL`. |
| v0.3.6 | Añadido en: v0.3.6 |
:::

- `url` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/es/nodejs/api/url#the-whatwg-url-api) Acepta todas las `options` de [`http.request()`](/es/nodejs/api/http#httprequestoptions-callback), con algunas diferencias en los valores predeterminados:
    - `protocol` **Predeterminado:** `'https:'`
    - `port` **Predeterminado:** `443`
    - `agent` **Predeterminado:** `https.globalAgent`
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Devuelve: [\<http.ClientRequest\>](/es/nodejs/api/http#class-httpclientrequest)

Realiza una solicitud a un servidor web seguro.

Las siguientes `options` adicionales de [`tls.connect()`](/es/nodejs/api/tls#tlsconnectoptions-callback) también se aceptan: `ca`, `cert`, `ciphers`, `clientCertEngine` (obsoleto), `crl`, `dhparam`, `ecdhCurve`, `honorCipherOrder`, `key`, `passphrase`, `pfx`, `rejectUnauthorized`, `secureOptions`, `secureProtocol`, `servername`, `sessionIdContext`, `highWaterMark`.

`options` puede ser un objeto, una cadena o un objeto [`URL`](/es/nodejs/api/url#the-whatwg-url-api). Si `options` es una cadena, se analiza automáticamente con [`new URL()`](/es/nodejs/api/url#new-urlinput-base). Si es un objeto [`URL`](/es/nodejs/api/url#the-whatwg-url-api), se convertirá automáticamente en un objeto `options` ordinario.

`https.request()` devuelve una instancia de la clase [`http.ClientRequest`](/es/nodejs/api/http#class-httpclientrequest). La instancia `ClientRequest` es un flujo de escritura. Si se necesita cargar un archivo con una solicitud POST, entonces escriba en el objeto `ClientRequest`.

::: code-group
```js [ESM]
import { request } from 'node:https';
import process from 'node:process';

const options = {
  hostname: 'encrypted.google.com',
  port: 443,
  path: '/',
  method: 'GET',
};

const req = request(options, (res) => {
  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);

  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (e) => {
  console.error(e);
});
req.end();
```

```js [CJS]
const https = require('node:https');

const options = {
  hostname: 'encrypted.google.com',
  port: 443,
  path: '/',
  method: 'GET',
};

const req = https.request(options, (res) => {
  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);

  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (e) => {
  console.error(e);
});
req.end();
```
:::

Ejemplo usando opciones de [`tls.connect()`](/es/nodejs/api/tls#tlsconnectoptions-callback):

```js [ESM]
const options = {
  hostname: 'encrypted.google.com',
  port: 443,
  path: '/',
  method: 'GET',
  key: fs.readFileSync('private-key.pem'),
  cert: fs.readFileSync('certificate.pem'),
};
options.agent = new https.Agent(options);

const req = https.request(options, (res) => {
  // ...
});
```
Alternativamente, opte por no utilizar la agrupación de conexiones al no usar un [`Agent`](/es/nodejs/api/https#class-httpsagent).

```js [ESM]
const options = {
  hostname: 'encrypted.google.com',
  port: 443,
  path: '/',
  method: 'GET',
  key: fs.readFileSync('private-key.pem'),
  cert: fs.readFileSync('certificate.pem'),
  agent: false,
};

const req = https.request(options, (res) => {
  // ...
});
```
Ejemplo usando una [`URL`](/es/nodejs/api/url#the-whatwg-url-api) como `options`:

```js [ESM]
const options = new URL('https://abc:');

const req = https.request(options, (res) => {
  // ...
});
```
Ejemplo de fijación en la huella digital del certificado o en la clave pública (similar a `pin-sha256`):

::: code-group
```js [ESM]
import { checkServerIdentity } from 'node:tls';
import { Agent, request } from 'node:https';
import { createHash } from 'node:crypto';

function sha256(s) {
  return createHash('sha256').update(s).digest('base64');
}
const options = {
  hostname: 'github.com',
  port: 443,
  path: '/',
  method: 'GET',
  checkServerIdentity: function(host, cert) {
    // Make sure the certificate is issued to the host we are connected to
    const err = checkServerIdentity(host, cert);
    if (err) {
      return err;
    }

    // Pin the public key, similar to HPKP pin-sha256 pinning
    const pubkey256 = 'SIXvRyDmBJSgatgTQRGbInBaAK+hZOQ18UmrSwnDlK8=';
    if (sha256(cert.pubkey) !== pubkey256) {
      const msg = 'Certificate verification error: ' +
        `The public key of '${cert.subject.CN}' ` +
        'does not match our pinned fingerprint';
      return new Error(msg);
    }

    // Pin the exact certificate, rather than the pub key
    const cert256 = 'FD:6E:9B:0E:F3:98:BC:D9:04:C3:B2:EC:16:7A:7B:' +
      '0F:DA:72:01:C9:03:C5:3A:6A:6A:E5:D0:41:43:63:EF:65';
    if (cert.fingerprint256 !== cert256) {
      const msg = 'Certificate verification error: ' +
        `The certificate of '${cert.subject.CN}' ` +
        'does not match our pinned fingerprint';
      return new Error(msg);
    }

    // This loop is informational only.
    // Print the certificate and public key fingerprints of all certs in the
    // chain. Its common to pin the public key of the issuer on the public
    // internet, while pinning the public key of the service in sensitive
    // environments.
    let lastprint256;
    do {
      console.log('Subject Common Name:', cert.subject.CN);
      console.log('  Certificate SHA256 fingerprint:', cert.fingerprint256);

      const hash = createHash('sha256');
      console.log('  Public key ping-sha256:', sha256(cert.pubkey));

      lastprint256 = cert.fingerprint256;
      cert = cert.issuerCertificate;
    } while (cert.fingerprint256 !== lastprint256);

  },
};

options.agent = new Agent(options);
const req = request(options, (res) => {
  console.log('All OK. Server matched our pinned cert or public key');
  console.log('statusCode:', res.statusCode);

  res.on('data', (d) => {});
});

req.on('error', (e) => {
  console.error(e.message);
});
req.end();
```

```js [CJS]
const tls = require('node:tls');
const https = require('node:https');
const crypto = require('node:crypto');

function sha256(s) {
  return crypto.createHash('sha256').update(s).digest('base64');
}
const options = {
  hostname: 'github.com',
  port: 443,
  path: '/',
  method: 'GET',
  checkServerIdentity: function(host, cert) {
    // Make sure the certificate is issued to the host we are connected to
    const err = tls.checkServerIdentity(host, cert);
    if (err) {
      return err;
    }

    // Pin the public key, similar to HPKP pin-sha256 pinning
    const pubkey256 = 'SIXvRyDmBJSgatgTQRGbInBaAK+hZOQ18UmrSwnDlK8=';
    if (sha256(cert.pubkey) !== pubkey256) {
      const msg = 'Certificate verification error: ' +
        `The public key of '${cert.subject.CN}' ` +
        'does not match our pinned fingerprint';
      return new Error(msg);
    }

    // Pin the exact certificate, rather than the pub key
    const cert256 = 'FD:6E:9B:0E:F3:98:BC:D9:04:C3:B2:EC:16:7A:7B:' +
      '0F:DA:72:01:C9:03:C5:3A:6A:6A:E5:D0:41:43:63:EF:65';
    if (cert.fingerprint256 !== cert256) {
      const msg = 'Certificate verification error: ' +
        `The certificate of '${cert.subject.CN}' ` +
        'does not match our pinned fingerprint';
      return new Error(msg);
    }

    // This loop is informational only.
    // Print the certificate and public key fingerprints of all certs in the
    // chain. Its common to pin the public key of the issuer on the public
    // internet, while pinning the public key of the service in sensitive
    // environments.
    do {
      console.log('Subject Common Name:', cert.subject.CN);
      console.log('  Certificate SHA256 fingerprint:', cert.fingerprint256);

      hash = crypto.createHash('sha256');
      console.log('  Public key ping-sha256:', sha256(cert.pubkey));

      lastprint256 = cert.fingerprint256;
      cert = cert.issuerCertificate;
    } while (cert.fingerprint256 !== lastprint256);

  },
};

options.agent = new https.Agent(options);
const req = https.request(options, (res) => {
  console.log('All OK. Server matched our pinned cert or public key');
  console.log('statusCode:', res.statusCode);

  res.on('data', (d) => {});
});

req.on('error', (e) => {
  console.error(e.message);
});
req.end();
```
:::

Salidas por ejemplo:

```text [TEXT]
Subject Common Name: github.com
  Certificate SHA256 fingerprint: FD:6E:9B:0E:F3:98:BC:D9:04:C3:B2:EC:16:7A:7B:0F:DA:72:01:C9:03:C5:3A:6A:6A:E5:D0:41:43:63:EF:65
  Public key ping-sha256: SIXvRyDmBJSgatgTQRGbInBaAK+hZOQ18UmrSwnDlK8=
Subject Common Name: Sectigo ECC Domain Validation Secure Server CA
  Certificate SHA256 fingerprint: 61:E9:73:75:E9:F6:DA:98:2F:F5:C1:9E:2F:94:E6:6C:4E:35:B6:83:7C:E3:B9:14:D2:24:5C:7F:5F:65:82:5F
  Public key ping-sha256: Eep0p/AsSa9lFUH6KT2UY+9s1Z8v7voAPkQ4fGknZ2g=
Subject Common Name: USERTrust ECC Certification Authority
  Certificate SHA256 fingerprint: A6:CF:64:DB:B4:C8:D5:FD:19:CE:48:89:60:68:DB:03:B5:33:A8:D1:33:6C:62:56:A8:7D:00:CB:B3:DE:F3:EA
  Public key ping-sha256: UJM2FOhG9aTNY0Pg4hgqjNzZ/lQBiMGRxPD5Y2/e0bw=
Subject Common Name: AAA Certificate Services
  Certificate SHA256 fingerprint: D7:A7:A0:FB:5D:7E:27:31:D7:71:E9:48:4E:BC:DE:F7:1D:5F:0C:3E:0A:29:48:78:2B:C8:3E:E0:EA:69:9E:F4
  Public key ping-sha256: vRU+17BDT2iGsXvOi76E7TQMcTLXAqj0+jGPdW7L1vM=
All OK. Server matched our pinned cert or public key
statusCode: 200
```
