---
title: Documentação do Node.js - HTTPS
description: O módulo HTTPS no Node.js fornece uma implementação do protocolo TLS/SSL para permitir conexões HTTP seguras. Ele inclui métodos para criar servidores e clientes seguros, lidar com certificados e gerenciar conexões seguras.
head:
  - - meta
    - name: og:title
      content: Documentação do Node.js - HTTPS | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: O módulo HTTPS no Node.js fornece uma implementação do protocolo TLS/SSL para permitir conexões HTTP seguras. Ele inclui métodos para criar servidores e clientes seguros, lidar com certificados e gerenciar conexões seguras.
  - - meta
    - name: twitter:title
      content: Documentação do Node.js - HTTPS | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: O módulo HTTPS no Node.js fornece uma implementação do protocolo TLS/SSL para permitir conexões HTTP seguras. Ele inclui métodos para criar servidores e clientes seguros, lidar com certificados e gerenciar conexões seguras.
---


# HTTPS {#https}

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável
:::

**Código Fonte:** [lib/https.js](https://github.com/nodejs/node/blob/v23.5.0/lib/https.js)

HTTPS é o protocolo HTTP sobre TLS/SSL. No Node.js, isso é implementado como um módulo separado.

## Determinando se o suporte ao crypto está indisponível {#determining-if-crypto-support-is-unavailable}

É possível que o Node.js seja construído sem incluir suporte para o módulo `node:crypto`. Nesses casos, tentar `importar` de `https` ou chamar `require('node:https')` resultará em um erro sendo lançado.

Ao usar CommonJS, o erro lançado pode ser capturado usando try/catch:

```js [CJS]
let https;
try {
  https = require('node:https');
} catch (err) {
  console.error('o suporte a https está desativado!');
}
```
Ao usar a palavra-chave léxica ESM `import`, o erro só pode ser capturado se um manipulador para `process.on('uncaughtException')` for registrado *antes* de qualquer tentativa de carregar o módulo ser feita (usando, por exemplo, um módulo de pré-carregamento).

Ao usar ESM, se houver uma chance de que o código possa ser executado em uma construção do Node.js onde o suporte ao crypto não está habilitado, considere usar a função [`import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) em vez da palavra-chave léxica `import`:

```js [ESM]
let https;
try {
  https = await import('node:https');
} catch (err) {
  console.error('o suporte a https está desativado!');
}
```
## Classe: `https.Agent` {#class-httpsagent}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v5.3.0 | suporte `0` `maxCachedSessions` para desativar o cache de sessão TLS. |
| v2.5.0 | parâmetro `maxCachedSessions` adicionado às `options` para reutilização de sessões TLS. |
| v0.4.5 | Adicionado em: v0.4.5 |
:::

Um objeto [`Agent`](/pt/nodejs/api/https#class-httpsagent) para HTTPS semelhante a [`http.Agent`](/pt/nodejs/api/http#class-httpagent). Veja [`https.request()`](/pt/nodejs/api/https#httpsrequestoptions-callback) para mais informações.

### `new Agent([options])` {#new-agentoptions}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v12.5.0 | não define automaticamente o servername se o host de destino foi especificado usando um endereço IP. |
:::

- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Conjunto de opções configuráveis para definir no agente. Pode ter os mesmos campos que para [`http.Agent(options)`](/pt/nodejs/api/http#new-agentoptions), e 
    -  `maxCachedSessions` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) número máximo de sessões TLS armazenadas em cache. Use `0` para desativar o cache de sessão TLS. **Padrão:** `100`.
    -  `servername` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) o valor da [extensão Server Name Indication](https://en.wikipedia.org/wiki/Server_Name_Indication) a ser enviado para o servidor. Use uma string vazia `''` para desativar o envio da extensão. **Padrão:** nome do host do servidor de destino, a menos que o servidor de destino seja especificado usando um endereço IP, caso em que o padrão é `''` (sem extensão). Veja [`Retomada de Sessão`](/pt/nodejs/api/tls#session-resumption) para obter informações sobre a reutilização da sessão TLS.
  
 


#### Evento: `'keylog'` {#event-keylog}

**Adicionado em: v13.2.0, v12.16.0**

- `line` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) Linha de texto ASCII, no formato `SSLKEYLOGFILE` da NSS.
- `tlsSocket` [\<tls.TLSSocket\>](/pt/nodejs/api/tls#class-tlstlssocket) A instância `tls.TLSSocket` na qual foi gerada.

O evento `keylog` é emitido quando o material chave é gerado ou recebido por uma conexão gerenciada por este agente (tipicamente antes que o handshake seja completado, mas não necessariamente). Este material de chaveamento pode ser armazenado para depuração, pois permite que o tráfego TLS capturado seja descriptografado. Ele pode ser emitido várias vezes para cada socket.

Um caso de uso típico é anexar as linhas recebidas a um arquivo de texto comum, que é posteriormente usado por software (como o Wireshark) para descriptografar o tráfego:

```js [ESM]
// ...
https.globalAgent.on('keylog', (line, tlsSocket) => {
  fs.appendFileSync('/tmp/ssl-keys.log', line, { mode: 0o600 });
});
```

## Classe: `https.Server` {#class-httpsserver}

**Adicionado em: v0.3.4**

- Estende: [\<tls.Server\>](/pt/nodejs/api/tls#class-tlsserver)

Veja [`http.Server`](/pt/nodejs/api/http#class-httpserver) para mais informações.

### `server.close([callback])` {#serverclosecallback}

**Adicionado em: v0.1.90**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retorna: [\<https.Server\>](/pt/nodejs/api/https#class-httpsserver)

Veja [`server.close()`](/pt/nodejs/api/http#serverclosecallback) no módulo `node:http`.

### `server[Symbol.asyncDispose]()` {#serversymbolasyncdispose}

**Adicionado em: v20.4.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

Chama [`server.close()`](/pt/nodejs/api/https#serverclosecallback) e retorna uma promise que é cumprida quando o servidor é fechado.

### `server.closeAllConnections()` {#servercloseallconnections}

**Adicionado em: v18.2.0**

Veja [`server.closeAllConnections()`](/pt/nodejs/api/http#servercloseallconnections) no módulo `node:http`.

### `server.closeIdleConnections()` {#servercloseidleconnections}

**Adicionado em: v18.2.0**

Veja [`server.closeIdleConnections()`](/pt/nodejs/api/http#servercloseidleconnections) no módulo `node:http`.


### `server.headersTimeout` {#serverheaderstimeout}

**Adicionado em: v11.3.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `60000`

Veja [`server.headersTimeout`](/pt/nodejs/api/http#serverheaderstimeout) no módulo `node:http`.

### `server.listen()` {#serverlisten}

Inicia o servidor HTTPS escutando conexões criptografadas. Este método é idêntico a [`server.listen()`](/pt/nodejs/api/net#serverlisten) de [`net.Server`](/pt/nodejs/api/net#class-netserver).

### `server.maxHeadersCount` {#servermaxheaderscount}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `2000`

Veja [`server.maxHeadersCount`](/pt/nodejs/api/http#servermaxheaderscount) no módulo `node:http`.

### `server.requestTimeout` {#serverrequesttimeout}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | O tempo limite de requisição padrão mudou de sem tempo limite para 300s (5 minutos). |
| v14.11.0 | Adicionado em: v14.11.0 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `300000`

Veja [`server.requestTimeout`](/pt/nodejs/api/http#serverrequesttimeout) no módulo `node:http`.

### `server.setTimeout([msecs][, callback])` {#serversettimeoutmsecs-callback}

**Adicionado em: v0.11.2**

- `msecs` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `120000` (2 minutos)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retorna: [\<https.Server\>](/pt/nodejs/api/https#class-httpsserver)

Veja [`server.setTimeout()`](/pt/nodejs/api/http#serversettimeoutmsecs-callback) no módulo `node:http`.

### `server.timeout` {#servertimeout}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v13.0.0 | O tempo limite padrão mudou de 120s para 0 (sem tempo limite). |
| v0.11.2 | Adicionado em: v0.11.2 |
:::

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** 0 (sem tempo limite)

Veja [`server.timeout`](/pt/nodejs/api/http#servertimeout) no módulo `node:http`.


### `server.keepAliveTimeout` {#serverkeepalivetimeout}

**Adicionado em: v8.0.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `5000` (5 segundos)

Veja [`server.keepAliveTimeout`](/pt/nodejs/api/http#serverkeepalivetimeout) no módulo `node:http`.

## `https.createServer([options][, requestListener])` {#httpscreateserveroptions-requestlistener}

**Adicionado em: v0.3.4**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Aceita `options` de [`tls.createServer()`](/pt/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener), [`tls.createSecureContext()`](/pt/nodejs/api/tls#tlscreatesecurecontextoptions) e [`http.createServer()`](/pt/nodejs/api/http#httpcreateserveroptions-requestlistener).
- `requestListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Um listener a ser adicionado ao evento `'request'`.
- Retorna: [\<https.Server\>](/pt/nodejs/api/https#class-httpsserver)

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

Para gerar o certificado e a chave para este exemplo, execute:

```bash [BASH]
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
  -keyout private-key.pem -out certificate.pem
```
Então, para gerar o certificado `pfx` para este exemplo, execute:

```bash [BASH]
openssl pkcs12 -certpbe AES-256-CBC -export -out test_cert.pfx \
  -inkey private-key.pem -in certificate.pem -passout pass:sample
```

## `https.get(options[, callback])` {#httpsgetoptions-callback}

## `https.get(url[, options][, callback])` {#httpsgeturl-options-callback}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v10.9.0 | O parâmetro `url` agora pode ser passado junto com um objeto `options` separado. |
| v7.5.0 | O parâmetro `options` pode ser um objeto `URL` WHATWG. |
| v0.3.6 | Adicionado em: v0.3.6 |
:::

- `url` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api) Aceita as mesmas `options` que [`https.request()`](/pt/nodejs/api/https#httpsrequestoptions-callback), com o método definido como GET por padrão.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Semelhante a [`http.get()`](/pt/nodejs/api/http#httpgetoptions-callback), mas para HTTPS.

`options` pode ser um objeto, uma string ou um objeto [`URL`](/pt/nodejs/api/url#the-whatwg-url-api). Se `options` for uma string, ela é automaticamente analisada com [`new URL()`](/pt/nodejs/api/url#new-urlinput-base). Se for um objeto [`URL`](/pt/nodejs/api/url#the-whatwg-url-api), ele será automaticamente convertido em um objeto `options` comum.



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

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v19.0.0 | O agente agora usa HTTP Keep-Alive e um tempo limite de 5 segundos por padrão. |
| v0.5.9 | Adicionado em: v0.5.9 |
:::

Instância global de [`https.Agent`](/pt/nodejs/api/https#class-httpsagent) para todas as requisições de cliente HTTPS. Diverge de uma configuração padrão de [`https.Agent`](/pt/nodejs/api/https#class-httpsagent) por ter `keepAlive` habilitado e um `timeout` de 5 segundos.

## `https.request(options[, callback])` {#httpsrequestoptions-callback}

## `https.request(url[, options][, callback])` {#httpsrequesturl-options-callback}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v22.4.0, v20.16.0 | A opção `clientCertEngine` depende do suporte do engine personalizado no OpenSSL que está obsoleto no OpenSSL 3. |
| v16.7.0, v14.18.0 | Ao usar um objeto `URL` analisado, o nome de usuário e a senha agora serão devidamente decodificados por URI. |
| v14.1.0, v13.14.0 | A opção `highWaterMark` agora é aceita. |
| v10.9.0 | O parâmetro `url` agora pode ser passado junto com um objeto `options` separado. |
| v9.3.0 | O parâmetro `options` agora pode incluir `clientCertEngine`. |
| v7.5.0 | O parâmetro `options` pode ser um objeto WHATWG `URL`. |
| v0.3.6 | Adicionado em: v0.3.6 |
:::

- `url` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api) Aceita todas as `options` de [`http.request()`](/pt/nodejs/api/http#httprequestoptions-callback), com algumas diferenças nos valores padrão:
    - `protocol` **Padrão:** `'https:'`
    - `port` **Padrão:** `443`
    - `agent` **Padrão:** `https.globalAgent`


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retorna: [\<http.ClientRequest\>](/pt/nodejs/api/http#class-httpclientrequest)

Faz uma requisição para um servidor web seguro.

As seguintes `options` adicionais de [`tls.connect()`](/pt/nodejs/api/tls#tlsconnectoptions-callback) também são aceitas: `ca`, `cert`, `ciphers`, `clientCertEngine` (obsoleto), `crl`, `dhparam`, `ecdhCurve`, `honorCipherOrder`, `key`, `passphrase`, `pfx`, `rejectUnauthorized`, `secureOptions`, `secureProtocol`, `servername`, `sessionIdContext`, `highWaterMark`.

`options` pode ser um objeto, uma string ou um objeto [`URL`](/pt/nodejs/api/url#the-whatwg-url-api). Se `options` for uma string, ela será automaticamente analisada com [`new URL()`](/pt/nodejs/api/url#new-urlinput-base). Se for um objeto [`URL`](/pt/nodejs/api/url#the-whatwg-url-api), ele será automaticamente convertido em um objeto `options` comum.

`https.request()` retorna uma instância da classe [`http.ClientRequest`](/pt/nodejs/api/http#class-httpclientrequest). A instância `ClientRequest` é um stream gravável. Se for necessário fazer o upload de um arquivo com uma requisição POST, então escreva no objeto `ClientRequest`.

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

Exemplo usando options de [`tls.connect()`](/pt/nodejs/api/tls#tlsconnectoptions-callback):

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
Alternativamente, desative o pool de conexões não usando um [`Agent`](/pt/nodejs/api/https#class-httpsagent).

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
Exemplo usando uma [`URL`](/pt/nodejs/api/url#the-whatwg-url-api) como `options`:

```js [ESM]
const options = new URL('https://abc:');

const req = https.request(options, (res) => {
  // ...
});
```
Exemplo de fixação na impressão digital do certificado ou na chave pública (semelhante a `pin-sha256`):

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

Saídas por exemplo:

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
