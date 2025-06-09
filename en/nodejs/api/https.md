---
title: Node.js Documentation - HTTPS
description: The HTTPS module in Node.js provides an implementation of the TLS/SSL protocol to enable secure HTTP connections. It includes methods for creating secure servers and clients, handling certificates, and managing secure connections.
head:
  - - meta
    - name: og:title
      content: Node.js Documentation - HTTPS | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: The HTTPS module in Node.js provides an implementation of the TLS/SSL protocol to enable secure HTTP connections. It includes methods for creating secure servers and clients, handling certificates, and managing secure connections.
  - - meta
    - name: twitter:title
      content: Node.js Documentation - HTTPS | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: The HTTPS module in Node.js provides an implementation of the TLS/SSL protocol to enable secure HTTP connections. It includes methods for creating secure servers and clients, handling certificates, and managing secure connections.
---

# HTTPS {#https}

::: tip [Stable: 2 - Stable]
[Stable: 2](/nodejs/api/documentation#stability-index) [Stability: 2](/nodejs/api/documentation#stability-index) - Stable
:::

**Source Code:** [lib/https.js](https://github.com/nodejs/node/blob/v23.8.0/lib/https.js)

HTTPS is the HTTP protocol over TLS/SSL. In Node.js this is implemented as a separate module.

## Determining if crypto support is unavailable {#determining-if-crypto-support-is-unavailable}

It is possible for Node.js to be built without including support for the `node:crypto` module. In such cases, attempting to `import` from `https` or calling `require('node:https')` will result in an error being thrown.

When using CommonJS, the error thrown can be caught using try/catch:

```js [CJS]
let https;
try {
  https = require('node:https');
} catch (err) {
  console.error('https support is disabled!');
}
```
When using the lexical ESM `import` keyword, the error can only be caught if a handler for `process.on('uncaughtException')` is registered *before* any attempt to load the module is made (using, for instance, a preload module).

When using ESM, if there is a chance that the code may be run on a build of Node.js where crypto support is not enabled, consider using the [`import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) function instead of the lexical `import` keyword:

```js [ESM]
let https;
try {
  https = await import('node:https');
} catch (err) {
  console.error('https support is disabled!');
}
```
## Class: `https.Agent` {#class-httpsagent}


::: info [History]
| Version | Changes |
| --- | --- |
| v5.3.0 | support `0` `maxCachedSessions` to disable TLS session caching. |
| v2.5.0 | parameter `maxCachedSessions` added to `options` for TLS sessions reuse. |
| v0.4.5 | Added in: v0.4.5 |
:::

An [`Agent`](/nodejs/api/https#class-httpsagent) object for HTTPS similar to [`http.Agent`](/nodejs/api/http#class-httpagent). See [`https.request()`](/nodejs/api/https#httpsrequestoptions-callback) for more information.

### `new Agent([options])` {#new-agentoptions}


::: info [History]
| Version | Changes |
| --- | --- |
| v12.5.0 | do not automatically set servername if the target host was specified using an IP address. |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Set of configurable options to set on the agent. Can have the same fields as for [`http.Agent(options)`](/nodejs/api/http#new-agentoptions), and 
    -  `maxCachedSessions` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) maximum number of TLS cached sessions. Use `0` to disable TLS session caching. **Default:** `100`. 
    -  `servername` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) the value of [Server Name Indication extension](https://en.wikipedia.org/wiki/Server_Name_Indication) to be sent to the server. Use empty string `''` to disable sending the extension. **Default:** host name of the target server, unless the target server is specified using an IP address, in which case the default is `''` (no extension). See [`Session Resumption`](/nodejs/api/tls#session-resumption) for information about TLS session reuse. 
  
 

#### Event: `'keylog'` {#event-keylog}

**Added in: v13.2.0, v12.16.0**

- `line` [\<Buffer\>](/nodejs/api/buffer#class-buffer) Line of ASCII text, in NSS `SSLKEYLOGFILE` format.
- `tlsSocket` [\<tls.TLSSocket\>](/nodejs/api/tls#class-tlstlssocket) The `tls.TLSSocket` instance on which it was generated.

The `keylog` event is emitted when key material is generated or received by a connection managed by this agent (typically before handshake has completed, but not necessarily). This keying material can be stored for debugging, as it allows captured TLS traffic to be decrypted. It may be emitted multiple times for each socket.

A typical use case is to append received lines to a common text file, which is later used by software (such as Wireshark) to decrypt the traffic:

```js [ESM]
// ...
https.globalAgent.on('keylog', (line, tlsSocket) => {
  fs.appendFileSync('/tmp/ssl-keys.log', line, { mode: 0o600 });
});
```
## Class: `https.Server` {#class-httpsserver}

**Added in: v0.3.4**

- Extends: [\<tls.Server\>](/nodejs/api/tls#class-tlsserver)

See [`http.Server`](/nodejs/api/http#class-httpserver) for more information.

### `server.close([callback])` {#serverclosecallback}

**Added in: v0.1.90**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Returns: [\<https.Server\>](/nodejs/api/https#class-httpsserver)

See [`server.close()`](/nodejs/api/http#serverclosecallback) in the `node:http` module.

### `server[Symbol.asyncDispose]()` {#serversymbolasyncdispose}

**Added in: v20.4.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index) - Experimental
:::

Calls [`server.close()`](/nodejs/api/https#serverclosecallback) and returns a promise that fulfills when the server has closed.

### `server.closeAllConnections()` {#servercloseallconnections}

**Added in: v18.2.0**

See [`server.closeAllConnections()`](/nodejs/api/http#servercloseallconnections) in the `node:http` module.

### `server.closeIdleConnections()` {#servercloseidleconnections}

**Added in: v18.2.0**

See [`server.closeIdleConnections()`](/nodejs/api/http#servercloseidleconnections) in the `node:http` module.

### `server.headersTimeout` {#serverheaderstimeout}

**Added in: v11.3.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Default:** `60000`

See [`server.headersTimeout`](/nodejs/api/http#serverheaderstimeout) in the `node:http` module.

### `server.listen()` {#serverlisten}

Starts the HTTPS server listening for encrypted connections. This method is identical to [`server.listen()`](/nodejs/api/net#serverlisten) from [`net.Server`](/nodejs/api/net#class-netserver).

### `server.maxHeadersCount` {#servermaxheaderscount}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Default:** `2000`

See [`server.maxHeadersCount`](/nodejs/api/http#servermaxheaderscount) in the `node:http` module.

### `server.requestTimeout` {#serverrequesttimeout}


::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | The default request timeout changed from no timeout to 300s (5 minutes). |
| v14.11.0 | Added in: v14.11.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Default:** `300000`

See [`server.requestTimeout`](/nodejs/api/http#serverrequesttimeout) in the `node:http` module.

### `server.setTimeout([msecs][, callback])` {#serversettimeoutmsecs-callback}

**Added in: v0.11.2**

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Default:** `120000` (2 minutes)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Returns: [\<https.Server\>](/nodejs/api/https#class-httpsserver)

See [`server.setTimeout()`](/nodejs/api/http#serversettimeoutmsecs-callback) in the `node:http` module.

### `server.timeout` {#servertimeout}


::: info [History]
| Version | Changes |
| --- | --- |
| v13.0.0 | The default timeout changed from 120s to 0 (no timeout). |
| v0.11.2 | Added in: v0.11.2 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Default:** 0 (no timeout)

See [`server.timeout`](/nodejs/api/http#servertimeout) in the `node:http` module.

### `server.keepAliveTimeout` {#serverkeepalivetimeout}

**Added in: v8.0.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Default:** `5000` (5 seconds)

See [`server.keepAliveTimeout`](/nodejs/api/http#serverkeepalivetimeout) in the `node:http` module.

## `https.createServer([options][, requestListener])` {#httpscreateserveroptions-requestlistener}

**Added in: v0.3.4**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Accepts `options` from [`tls.createServer()`](/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener), [`tls.createSecureContext()`](/nodejs/api/tls#tlscreatesecurecontextoptions) and [`http.createServer()`](/nodejs/api/http#httpcreateserveroptions-requestlistener).
- `requestListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) A listener to be added to the `'request'` event.
- Returns: [\<https.Server\>](/nodejs/api/https#class-httpsserver)



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

Or



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

To generate the certificate and key for this example, run:

```bash [BASH]
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
  -keyout private-key.pem -out certificate.pem
```
Then, to generate the `pfx` certificate for this example, run:

```bash [BASH]
openssl pkcs12 -certpbe AES-256-CBC -export -out test_cert.pfx \
  -inkey private-key.pem -in certificate.pem -passout pass:sample
```
## `https.get(options[, callback])` {#httpsgetoptions-callback}

## `https.get(url[, options][, callback])` {#httpsgeturl-options-callback}


::: info [History]
| Version | Changes |
| --- | --- |
| v10.9.0 | The `url` parameter can now be passed along with a separate `options` object. |
| v7.5.0 | The `options` parameter can be a WHATWG `URL` object. |
| v0.3.6 | Added in: v0.3.6 |
:::

- `url` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/nodejs/api/url#the-whatwg-url-api) Accepts the same `options` as [`https.request()`](/nodejs/api/https#httpsrequestoptions-callback), with the method set to GET by default.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Like [`http.get()`](/nodejs/api/http#httpgetoptions-callback) but for HTTPS.

`options` can be an object, a string, or a [`URL`](/nodejs/api/url#the-whatwg-url-api) object. If `options` is a string, it is automatically parsed with [`new URL()`](/nodejs/api/url#new-urlinput-base). If it is a [`URL`](/nodejs/api/url#the-whatwg-url-api) object, it will be automatically converted to an ordinary `options` object.



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


::: info [History]
| Version | Changes |
| --- | --- |
| v19.0.0 | The agent now uses HTTP Keep-Alive and a 5 second timeout by default. |
| v0.5.9 | Added in: v0.5.9 |
:::

Global instance of [`https.Agent`](/nodejs/api/https#class-httpsagent) for all HTTPS client requests. Diverges from a default [`https.Agent`](/nodejs/api/https#class-httpsagent) configuration by having `keepAlive` enabled and a `timeout` of 5 seconds.

## `https.request(options[, callback])` {#httpsrequestoptions-callback}

## `https.request(url[, options][, callback])` {#httpsrequesturl-options-callback}


::: info [History]
| Version | Changes |
| --- | --- |
| v22.4.0, v20.16.0 | The `clientCertEngine` option depends on custom engine support in OpenSSL which is deprecated in OpenSSL 3. |
| v16.7.0, v14.18.0 | When using a `URL` object parsed username and password will now be properly URI decoded. |
| v14.1.0, v13.14.0 | The `highWaterMark` option is accepted now. |
| v10.9.0 | The `url` parameter can now be passed along with a separate `options` object. |
| v9.3.0 | The `options` parameter can now include `clientCertEngine`. |
| v7.5.0 | The `options` parameter can be a WHATWG `URL` object. |
| v0.3.6 | Added in: v0.3.6 |
:::

- `url` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/nodejs/api/url#the-whatwg-url-api) Accepts all `options` from [`http.request()`](/nodejs/api/http#httprequestoptions-callback), with some differences in default values: 
    - `protocol` **Default:** `'https:'`
    - `port` **Default:** `443`
    - `agent` **Default:** `https.globalAgent`
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Returns: [\<http.ClientRequest\>](/nodejs/api/http#class-httpclientrequest)

Makes a request to a secure web server.

The following additional `options` from [`tls.connect()`](/nodejs/api/tls#tlsconnectoptions-callback) are also accepted: `ca`, `cert`, `ciphers`, `clientCertEngine` (deprecated), `crl`, `dhparam`, `ecdhCurve`, `honorCipherOrder`, `key`, `passphrase`, `pfx`, `rejectUnauthorized`, `secureOptions`, `secureProtocol`, `servername`, `sessionIdContext`, `highWaterMark`.

`options` can be an object, a string, or a [`URL`](/nodejs/api/url#the-whatwg-url-api) object. If `options` is a string, it is automatically parsed with [`new URL()`](/nodejs/api/url#new-urlinput-base). If it is a [`URL`](/nodejs/api/url#the-whatwg-url-api) object, it will be automatically converted to an ordinary `options` object.

`https.request()` returns an instance of the [`http.ClientRequest`](/nodejs/api/http#class-httpclientrequest) class. The `ClientRequest` instance is a writable stream. If one needs to upload a file with a POST request, then write to the `ClientRequest` object.



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

Example using options from [`tls.connect()`](/nodejs/api/tls#tlsconnectoptions-callback):

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
Alternatively, opt out of connection pooling by not using an [`Agent`](/nodejs/api/https#class-httpsagent).

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
Example using a [`URL`](/nodejs/api/url#the-whatwg-url-api) as `options`:

```js [ESM]
const options = new URL('https://abc:');

const req = https.request(options, (res) => {
  // ...
});
```
Example pinning on certificate fingerprint, or the public key (similar to `pin-sha256`):



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

Outputs for example:

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
