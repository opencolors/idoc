---
title: Documentation Node.js - HTTPS
description: Le module HTTPS dans Node.js fournit une implémentation du protocole TLS/SSL pour permettre des connexions HTTP sécurisées. Il inclut des méthodes pour créer des serveurs et des clients sécurisés, gérer les certificats et gérer les connexions sécurisées.
head:
  - - meta
    - name: og:title
      content: Documentation Node.js - HTTPS | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Le module HTTPS dans Node.js fournit une implémentation du protocole TLS/SSL pour permettre des connexions HTTP sécurisées. Il inclut des méthodes pour créer des serveurs et des clients sécurisés, gérer les certificats et gérer les connexions sécurisées.
  - - meta
    - name: twitter:title
      content: Documentation Node.js - HTTPS | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Le module HTTPS dans Node.js fournit une implémentation du protocole TLS/SSL pour permettre des connexions HTTP sécurisées. Il inclut des méthodes pour créer des serveurs et des clients sécurisés, gérer les certificats et gérer les connexions sécurisées.
---


# HTTPS {#https}

::: tip [Stable: 2 - Stable]
[Stable: 2](/fr/nodejs/api/documentation#stability-index) [Stability: 2](/fr/nodejs/api/documentation#stability-index) - Stable
:::

**Code source :** [lib/https.js](https://github.com/nodejs/node/blob/v23.5.0/lib/https.js)

HTTPS est le protocole HTTP sur TLS/SSL. Dans Node.js, il est implémenté en tant que module distinct.

## Déterminer si la prise en charge de crypto est indisponible {#determining-if-crypto-support-is-unavailable}

Il est possible que Node.js soit construit sans inclure la prise en charge du module `node:crypto`. Dans de tels cas, tenter d'`importer` depuis `https` ou d'appeler `require('node:https')` entraînera la levée d'une erreur.

Lors de l'utilisation de CommonJS, l'erreur renvoyée peut être interceptée à l'aide de try/catch :

```js [CJS]
let https;
try {
  https = require('node:https');
} catch (err) {
  console.error('https support is disabled!');
}
```
Lors de l'utilisation du mot-clé lexical ESM `import`, l'erreur ne peut être interceptée que si un gestionnaire pour `process.on('uncaughtException')` est enregistré *avant* toute tentative de chargement du module (en utilisant, par exemple, un module de préchargement).

Lors de l'utilisation d'ESM, s'il existe une possibilité que le code soit exécuté sur une version de Node.js où la prise en charge de crypto n'est pas activée, envisagez d'utiliser la fonction [`import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) au lieu du mot-clé lexical `import` :

```js [ESM]
let https;
try {
  https = await import('node:https');
} catch (err) {
  console.error('https support is disabled!');
}
```
## Classe : `https.Agent` {#class-httpsagent}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v5.3.0 | prise en charge de `0` `maxCachedSessions` pour désactiver la mise en cache des sessions TLS. |
| v2.5.0 | paramètre `maxCachedSessions` ajouté à `options` pour la réutilisation des sessions TLS. |
| v0.4.5 | Ajoutée dans : v0.4.5 |
:::

Un objet [`Agent`](/fr/nodejs/api/https#class-httpsagent) pour HTTPS similaire à [`http.Agent`](/fr/nodejs/api/http#class-httpagent). Voir [`https.request()`](/fr/nodejs/api/https#httpsrequestoptions-callback) pour plus d'informations.

### `new Agent([options])` {#new-agentoptions}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v12.5.0 | ne définit pas automatiquement servername si l'hôte cible a été spécifié à l'aide d'une adresse IP. |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Ensemble d'options configurables à définir sur l'agent. Peut avoir les mêmes champs que pour [`http.Agent(options)`](/fr/nodejs/api/http#new-agentoptions), et
    - `maxCachedSessions` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) nombre maximal de sessions TLS mises en cache. Utilisez `0` pour désactiver la mise en cache des sessions TLS. **Par défaut :** `100`.
    - `servername` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) la valeur de [l'extension Server Name Indication](https://en.wikipedia.org/wiki/Server_Name_Indication) à envoyer au serveur. Utilisez une chaîne vide `''` pour désactiver l'envoi de l'extension. **Par défaut :** nom d'hôte du serveur cible, sauf si le serveur cible est spécifié à l'aide d'une adresse IP, auquel cas la valeur par défaut est `''` (aucune extension). Voir [`Reprise de session`](/fr/nodejs/api/tls#session-resumption) pour plus d'informations sur la réutilisation des sessions TLS.


#### Événement : `'keylog'` {#event-keylog}

**Ajouté dans : v13.2.0, v12.16.0**

- `line` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) Ligne de texte ASCII, au format NSS `SSLKEYLOGFILE`.
- `tlsSocket` [\<tls.TLSSocket\>](/fr/nodejs/api/tls#class-tlstlssocket) L'instance `tls.TLSSocket` sur laquelle elle a été générée.

L'événement `keylog` est émis lorsque le matériel de clé est généré ou reçu par une connexion gérée par cet agent (généralement avant que la négociation n'ait été achevée, mais pas nécessairement). Ce matériel de clé peut être stocké à des fins de débogage, car il permet de décrypter le trafic TLS capturé. Il peut être émis plusieurs fois pour chaque socket.

Un cas d'utilisation typique consiste à ajouter les lignes reçues à un fichier texte commun, qui est ensuite utilisé par un logiciel (tel que Wireshark) pour décrypter le trafic :

```js [ESM]
// ...
https.globalAgent.on('keylog', (line, tlsSocket) => {
  fs.appendFileSync('/tmp/ssl-keys.log', line, { mode: 0o600 });
});
```
## Classe : `https.Server` {#class-httpsserver}

**Ajouté dans : v0.3.4**

- Hérite de : [\<tls.Server\>](/fr/nodejs/api/tls#class-tlsserver)

Voir [`http.Server`](/fr/nodejs/api/http#class-httpserver) pour plus d'informations.

### `server.close([callback])` {#serverclosecallback}

**Ajouté dans : v0.1.90**

- `callback` [\<Function\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retourne : [\<https.Server\>](/fr/nodejs/api/https#class-httpsserver)

Voir [`server.close()`](/fr/nodejs/api/http#serverclosecallback) dans le module `node:http`.

### `server[Symbol.asyncDispose]()` {#serversymbolasyncdispose}

**Ajouté dans : v20.4.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/fr/nodejs/api/documentation#stability-index) [Stability: 1](/fr/nodejs/api/documentation#stability-index) - Expérimental
:::

Appelle [`server.close()`](/fr/nodejs/api/https#serverclosecallback) et retourne une promesse qui est remplie lorsque le serveur a été fermé.

### `server.closeAllConnections()` {#servercloseallconnections}

**Ajouté dans : v18.2.0**

Voir [`server.closeAllConnections()`](/fr/nodejs/api/http#servercloseallconnections) dans le module `node:http`.

### `server.closeIdleConnections()` {#servercloseidleconnections}

**Ajouté dans : v18.2.0**

Voir [`server.closeIdleConnections()`](/fr/nodejs/api/http#servercloseidleconnections) dans le module `node:http`.


### `server.headersTimeout` {#serverheaderstimeout}

**Ajouté dans : v11.3.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `60000`

Voir [`server.headersTimeout`](/fr/nodejs/api/http#serverheaderstimeout) dans le module `node:http`.

### `server.listen()` {#serverlisten}

Démarre le serveur HTTPS en écoutant les connexions chiffrées. Cette méthode est identique à [`server.listen()`](/fr/nodejs/api/net#serverlisten) de [`net.Server`](/fr/nodejs/api/net#class-netserver).

### `server.maxHeadersCount` {#servermaxheaderscount}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `2000`

Voir [`server.maxHeadersCount`](/fr/nodejs/api/http#servermaxheaderscount) dans le module `node:http`.

### `server.requestTimeout` {#serverrequesttimeout}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Le délai d'attente par défaut de la requête est passé de l'absence de délai d'attente à 300 s (5 minutes). |
| v14.11.0 | Ajouté dans : v14.11.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `300000`

Voir [`server.requestTimeout`](/fr/nodejs/api/http#serverrequesttimeout) dans le module `node:http`.

### `server.setTimeout([msecs][, callback])` {#serversettimeoutmsecs-callback}

**Ajouté dans : v0.11.2**

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `120000` (2 minutes)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retourne : [\<https.Server\>](/fr/nodejs/api/https#class-httpsserver)

Voir [`server.setTimeout()`](/fr/nodejs/api/http#serversettimeoutmsecs-callback) dans le module `node:http`.

### `server.timeout` {#servertimeout}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v13.0.0 | Le délai d'expiration par défaut est passé de 120 s à 0 (pas de délai d'expiration). |
| v0.11.2 | Ajouté dans : v0.11.2 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** 0 (pas de délai d'expiration)

Voir [`server.timeout`](/fr/nodejs/api/http#servertimeout) dans le module `node:http`.


### `server.keepAliveTimeout` {#serverkeepalivetimeout}

**Ajouté dans : v8.0.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Par défaut :** `5000` (5 secondes)

Voir [`server.keepAliveTimeout`](/fr/nodejs/api/http#serverkeepalivetimeout) dans le module `node:http`.

## `https.createServer([options][, requestListener])` {#httpscreateserveroptions-requestlistener}

**Ajouté dans : v0.3.4**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Accepte les `options` de [`tls.createServer()`](/fr/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener), [`tls.createSecureContext()`](/fr/nodejs/api/tls#tlscreatesecurecontextoptions) et [`http.createServer()`](/fr/nodejs/api/http#httpcreateserveroptions-requestlistener).
- `requestListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Un écouteur à ajouter à l'événement `'request'`.
- Retourne : [\<https.Server\>](/fr/nodejs/api/https#class-httpsserver)



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

Ou



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

Pour générer le certificat et la clé de cet exemple, exécutez :

```bash [BASH]
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
  -keyout private-key.pem -out certificate.pem
```
Ensuite, pour générer le certificat `pfx` pour cet exemple, exécutez :

```bash [BASH]
openssl pkcs12 -certpbe AES-256-CBC -export -out test_cert.pfx \
  -inkey private-key.pem -in certificate.pem -passout pass:sample
```

## `https.get(options[, callback])` {#httpsgetoptions-callback}

## `https.get(url[, options][, callback])` {#httpsgeturl-options-callback}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.9.0 | Le paramètre `url` peut maintenant être passé avec un objet `options` séparé. |
| v7.5.0 | Le paramètre `options` peut être un objet WHATWG `URL`. |
| v0.3.6 | Ajoutée dans : v0.3.6 |
:::

- `url` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api) Accepte les mêmes `options` que [`https.request()`](/fr/nodejs/api/https#httpsrequestoptions-callback), avec la méthode définie sur GET par défaut.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Comme [`http.get()`](/fr/nodejs/api/http#httpgetoptions-callback) mais pour HTTPS.

`options` peut être un objet, une chaîne de caractères ou un objet [`URL`](/fr/nodejs/api/url#the-whatwg-url-api). Si `options` est une chaîne de caractères, elle est automatiquement analysée avec [`new URL()`](/fr/nodejs/api/url#new-urlinput-base). Si c'est un objet [`URL`](/fr/nodejs/api/url#the-whatwg-url-api), il sera automatiquement converti en un objet `options` ordinaire.



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

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v19.0.0 | L'agent utilise désormais HTTP Keep-Alive et un délai d'attente de 5 secondes par défaut. |
| v0.5.9 | Ajoutée dans : v0.5.9 |
:::

Instance globale de [`https.Agent`](/fr/nodejs/api/https#class-httpsagent) pour toutes les requêtes client HTTPS. Diffère d'une configuration [`https.Agent`](/fr/nodejs/api/https#class-httpsagent) par défaut en ayant `keepAlive` activé et un `timeout` de 5 secondes.

## `https.request(options[, callback])` {#httpsrequestoptions-callback}

## `https.request(url[, options][, callback])` {#httpsrequesturl-options-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v22.4.0, v20.16.0 | L'option `clientCertEngine` dépend du support du moteur personnalisé dans OpenSSL, qui est obsolète dans OpenSSL 3. |
| v16.7.0, v14.18.0 | Lors de l'utilisation d'un objet `URL` analysé, le nom d'utilisateur et le mot de passe seront désormais correctement décodés en URI. |
| v14.1.0, v13.14.0 | L'option `highWaterMark` est désormais acceptée. |
| v10.9.0 | Le paramètre `url` peut désormais être transmis avec un objet `options` distinct. |
| v9.3.0 | Le paramètre `options` peut désormais inclure `clientCertEngine`. |
| v7.5.0 | Le paramètre `options` peut être un objet `URL` WHATWG. |
| v0.3.6 | Ajoutée dans : v0.3.6 |
:::

- `url` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/fr/nodejs/api/url#the-whatwg-url-api) Accepte toutes les `options` de [`http.request()`](/fr/nodejs/api/http#httprequestoptions-callback), avec quelques différences dans les valeurs par défaut :
    - `protocol` **Par défaut :** `'https:'`
    - `port` **Par défaut :** `443`
    - `agent` **Par défaut :** `https.globalAgent`

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retourne : [\<http.ClientRequest\>](/fr/nodejs/api/http#class-httpclientrequest)

Effectue une requête vers un serveur web sécurisé.

Les `options` supplémentaires suivantes de [`tls.connect()`](/fr/nodejs/api/tls#tlsconnectoptions-callback) sont également acceptées : `ca`, `cert`, `ciphers`, `clientCertEngine` (obsolète), `crl`, `dhparam`, `ecdhCurve`, `honorCipherOrder`, `key`, `passphrase`, `pfx`, `rejectUnauthorized`, `secureOptions`, `secureProtocol`, `servername`, `sessionIdContext`, `highWaterMark`.

`options` peut être un objet, une chaîne de caractères ou un objet [`URL`](/fr/nodejs/api/url#the-whatwg-url-api). Si `options` est une chaîne de caractères, elle est automatiquement analysée avec [`new URL()`](/fr/nodejs/api/url#new-urlinput-base). Si c'est un objet [`URL`](/fr/nodejs/api/url#the-whatwg-url-api), il sera automatiquement converti en un objet `options` ordinaire.

`https.request()` retourne une instance de la classe [`http.ClientRequest`](/fr/nodejs/api/http#class-httpclientrequest). L'instance `ClientRequest` est un flux inscriptible. Si vous avez besoin de télécharger un fichier avec une requête POST, écrivez ensuite dans l'objet `ClientRequest`.

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

Exemple d'utilisation des options de [`tls.connect()`](/fr/nodejs/api/tls#tlsconnectoptions-callback) :

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
Alternativement, désactivez le pool de connexions en n'utilisant pas de [`Agent`](/fr/nodejs/api/https#class-httpsagent).

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
Exemple d'utilisation d'une [`URL`](/fr/nodejs/api/url#the-whatwg-url-api) en tant que `options` :

```js [ESM]
const options = new URL('https://abc:');

const req = https.request(options, (res) => {
  // ...
});
```
Exemple d'épinglage sur l'empreinte du certificat ou sur la clé publique (similaire à `pin-sha256`) :

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

Sorties par exemple :

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
