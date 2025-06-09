---
title: Node.js Dokumentation - Crypto
description: Das Crypto-Modul von Node.js bietet kryptografische Funktionen, die eine Reihe von Wrappern für die Hash-, HMAC-, Verschlüsselungs-, Entschlüsselungs-, Signatur- und Verifikationsfunktionen von OpenSSL umfassen. Es unterstützt verschiedene Verschlüsselungsalgorithmen, Schlüsselableitung und digitale Signaturen, wodurch Entwickler Daten und Kommunikationen innerhalb von Node.js-Anwendungen sichern können.
head:
  - - meta
    - name: og:title
      content: Node.js Dokumentation - Crypto | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Das Crypto-Modul von Node.js bietet kryptografische Funktionen, die eine Reihe von Wrappern für die Hash-, HMAC-, Verschlüsselungs-, Entschlüsselungs-, Signatur- und Verifikationsfunktionen von OpenSSL umfassen. Es unterstützt verschiedene Verschlüsselungsalgorithmen, Schlüsselableitung und digitale Signaturen, wodurch Entwickler Daten und Kommunikationen innerhalb von Node.js-Anwendungen sichern können.
  - - meta
    - name: twitter:title
      content: Node.js Dokumentation - Crypto | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Das Crypto-Modul von Node.js bietet kryptografische Funktionen, die eine Reihe von Wrappern für die Hash-, HMAC-, Verschlüsselungs-, Entschlüsselungs-, Signatur- und Verifikationsfunktionen von OpenSSL umfassen. Es unterstützt verschiedene Verschlüsselungsalgorithmen, Schlüsselableitung und digitale Signaturen, wodurch Entwickler Daten und Kommunikationen innerhalb von Node.js-Anwendungen sichern können.
---


# Krypto {#crypto}

::: tip [Stabil: 2 - Stabil]
[Stabil: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil
:::

**Quellcode:** [lib/crypto.js](https://github.com/nodejs/node/blob/v23.5.0/lib/crypto.js)

Das Modul `node:crypto` bietet kryptografische Funktionalität, die eine Reihe von Wrappern für die Hash-, HMAC-, Cipher-, Decipher-, Sign- und Verify-Funktionen von OpenSSL umfasst.

::: code-group
```js [ESM]
const { createHmac } = await import('node:crypto');

const secret = 'abcdefg';
const hash = createHmac('sha256', secret)
               .update('I love cupcakes')
               .digest('hex');
console.log(hash);
// Prints:
//   c0fa1bc00531bd78ef38c628449c5102aeabd49b5dc3a2a516ea6ea959d6658e
```

```js [CJS]
const { createHmac } = require('node:crypto');

const secret = 'abcdefg';
const hash = createHmac('sha256', secret)
               .update('I love cupcakes')
               .digest('hex');
console.log(hash);
// Prints:
//   c0fa1bc00531bd78ef38c628449c5102aeabd49b5dc3a2a516ea6ea959d6658e
```
:::

## Feststellen, ob Krypto-Unterstützung nicht verfügbar ist {#determining-if-crypto-support-is-unavailable}

Es ist möglich, dass Node.js ohne Unterstützung für das Modul `node:crypto` erstellt wird. In solchen Fällen führt der Versuch, von `crypto` zu `import` oder `require('node:crypto')` aufzurufen, zu einem Fehler.

Bei Verwendung von CommonJS kann der ausgelöste Fehler mit try/catch abgefangen werden:

```js [CJS]
let crypto;
try {
  crypto = require('node:crypto');
} catch (err) {
  console.error('crypto support is disabled!');
}
```
Bei Verwendung des lexikalischen ESM-Schlüsselworts `import` kann der Fehler nur abgefangen werden, wenn ein Handler für `process.on('uncaughtException')` registriert wird, *bevor* ein Versuch unternommen wird, das Modul zu laden (z. B. mithilfe eines Preload-Moduls).

Wenn Sie ESM verwenden und die Möglichkeit besteht, dass der Code in einem Build von Node.js ausgeführt wird, in dem die Krypto-Unterstützung nicht aktiviert ist, sollten Sie die Funktion [`import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) anstelle des lexikalischen Schlüsselworts `import` verwenden:

```js [ESM]
let crypto;
try {
  crypto = await import('node:crypto');
} catch (err) {
  console.error('crypto support is disabled!');
}
```

## Klasse: `Certificate` {#class-certificate}

**Hinzugefügt in: v0.11.8**

SPKAC ist ein Mechanismus zur Anforderung von Zertifikatsignaturen, der ursprünglich von Netscape implementiert und formal als Teil des `keygen`-Elements von HTML5 spezifiziert wurde.

`\<keygen\>` ist seit [HTML 5.2](https://www.w3.org/TR/html52/changes#features-removed) veraltet, und neue Projekte sollten dieses Element nicht mehr verwenden.

Das `node:crypto`-Modul stellt die Klasse `Certificate` für die Arbeit mit SPKAC-Daten bereit. Die häufigste Verwendung ist die Verarbeitung von Ausgaben, die vom HTML5-Element `\<keygen\>` generiert werden. Node.js verwendet intern [OpenSSLs SPKAC-Implementierung](https://www.openssl.org/docs/man3.0/man1/openssl-spkac).

### Statische Methode: `Certificate.exportChallenge(spkac[, encoding])` {#static-method-certificateexportchallengespkac-encoding}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v15.0.0 | Das Argument spkac kann ein ArrayBuffer sein. Die Größe des Arguments spkac wurde auf maximal 2**31 - 1 Byte begrenzt. |
| v9.0.0 | Hinzugefügt in: v9.0.0 |
:::

- `spkac` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die [Kodierung](/de/nodejs/api/buffer#buffers-and-character-encodings) der `spkac`-Zeichenkette.
- Rückgabe: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) Die Challenge-Komponente der `spkac`-Datenstruktur, die einen öffentlichen Schlüssel und eine Challenge enthält.



::: code-group
```js [ESM]
const { Certificate } = await import('node:crypto');
const spkac = getSpkacSomehow();
const challenge = Certificate.exportChallenge(spkac);
console.log(challenge.toString('utf8'));
// Gibt aus: die Challenge als UTF8-Zeichenkette
```

```js [CJS]
const { Certificate } = require('node:crypto');
const spkac = getSpkacSomehow();
const challenge = Certificate.exportChallenge(spkac);
console.log(challenge.toString('utf8'));
// Gibt aus: die Challenge als UTF8-Zeichenkette
```
:::


### Statische Methode: `Certificate.exportPublicKey(spkac[, encoding])` {#static-method-certificateexportpublickeyspkac-encoding}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v15.0.0 | Das spkac-Argument kann ein ArrayBuffer sein. Die Größe des spkac-Arguments wurde auf maximal 2**31 - 1 Bytes begrenzt. |
| v9.0.0 | Hinzugefügt in: v9.0.0 |
:::

- `spkac` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die [Kodierung](/de/nodejs/api/buffer#buffers-and-character-encodings) der `spkac`-Zeichenfolge.
- Gibt zurück: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) Die Public-Key-Komponente der `spkac`-Datenstruktur, die einen Public Key und eine Challenge enthält.

::: code-group
```js [ESM]
const { Certificate } = await import('node:crypto');
const spkac = getSpkacSomehow();
const publicKey = Certificate.exportPublicKey(spkac);
console.log(publicKey);
// Gibt aus: den öffentlichen Schlüssel als <Buffer ...>
```

```js [CJS]
const { Certificate } = require('node:crypto');
const spkac = getSpkacSomehow();
const publicKey = Certificate.exportPublicKey(spkac);
console.log(publicKey);
// Gibt aus: den öffentlichen Schlüssel als <Buffer ...>
```
:::

### Statische Methode: `Certificate.verifySpkac(spkac[, encoding])` {#static-method-certificateverifyspkacspkac-encoding}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v15.0.0 | Das spkac-Argument kann ein ArrayBuffer sein. Kodierung hinzugefügt. Die Größe des spkac-Arguments wurde auf maximal 2**31 - 1 Bytes begrenzt. |
| v9.0.0 | Hinzugefügt in: v9.0.0 |
:::

- `spkac` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die [Kodierung](/de/nodejs/api/buffer#buffers-and-character-encodings) der `spkac`-Zeichenfolge.
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, wenn die angegebene `spkac`-Datenstruktur gültig ist, andernfalls `false`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const { Certificate } = await import('node:crypto');

const spkac = getSpkacSomehow();
console.log(Certificate.verifySpkac(Buffer.from(spkac)));
// Gibt aus: true oder false
```

```js [CJS]
const { Buffer } = require('node:buffer');
const { Certificate } = require('node:crypto');

const spkac = getSpkacSomehow();
console.log(Certificate.verifySpkac(Buffer.from(spkac)));
// Gibt aus: true oder false
```
:::


### Legacy API {#legacy-api}

::: danger [Stable: 0 - Veraltet]
[Stable: 0](/de/nodejs/api/documentation#stability-index) [Stability: 0](/de/nodejs/api/documentation#stability-index) - Veraltet
:::

Als Legacy-Schnittstelle ist es möglich, neue Instanzen der Klasse `crypto.Certificate` zu erstellen, wie in den folgenden Beispielen veranschaulicht.

#### `new crypto.Certificate()` {#new-cryptocertificate}

Instanzen der Klasse `Certificate` können mit dem Schlüsselwort `new` oder durch Aufrufen von `crypto.Certificate()` als Funktion erstellt werden:

::: code-group
```js [ESM]
const { Certificate } = await import('node:crypto');

const cert1 = new Certificate();
const cert2 = Certificate();
```

```js [CJS]
const { Certificate } = require('node:crypto');

const cert1 = new Certificate();
const cert2 = Certificate();
```
:::

#### `certificate.exportChallenge(spkac[, encoding])` {#certificateexportchallengespkac-encoding}

**Hinzugefügt in: v0.11.8**

- `spkac` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die [Kodierung](/de/nodejs/api/buffer#buffers-and-character-encodings) der `spkac`-Zeichenkette.
- Rückgabe: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) Die Challenge-Komponente der `spkac`-Datenstruktur, die einen öffentlichen Schlüssel und eine Challenge enthält.

::: code-group
```js [ESM]
const { Certificate } = await import('node:crypto');
const cert = Certificate();
const spkac = getSpkacSomehow();
const challenge = cert.exportChallenge(spkac);
console.log(challenge.toString('utf8'));
// Prints: the challenge as a UTF8 string
```

```js [CJS]
const { Certificate } = require('node:crypto');
const cert = Certificate();
const spkac = getSpkacSomehow();
const challenge = cert.exportChallenge(spkac);
console.log(challenge.toString('utf8'));
// Prints: the challenge as a UTF8 string
```
:::


#### `certificate.exportPublicKey(spkac[, encoding])` {#certificateexportpublickeyspkac-encoding}

**Hinzugefügt in: v0.11.8**

- `spkac` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die [Kodierung](/de/nodejs/api/buffer#buffers-and-character-encodings) der `spkac`-Zeichenkette.
- Rückgabe: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) Die Komponente des öffentlichen Schlüssels der `spkac`-Datenstruktur, die einen öffentlichen Schlüssel und eine Challenge enthält.

::: code-group
```js [ESM]
const { Certificate } = await import('node:crypto');
const cert = Certificate();
const spkac = getSpkacSomehow();
const publicKey = cert.exportPublicKey(spkac);
console.log(publicKey);
// Gibt aus: den öffentlichen Schlüssel als <Buffer ...>
```

```js [CJS]
const { Certificate } = require('node:crypto');
const cert = Certificate();
const spkac = getSpkacSomehow();
const publicKey = cert.exportPublicKey(spkac);
console.log(publicKey);
// Gibt aus: den öffentlichen Schlüssel als <Buffer ...>
```
:::

#### `certificate.verifySpkac(spkac[, encoding])` {#certificateverifyspkacspkac-encoding}

**Hinzugefügt in: v0.11.8**

- `spkac` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die [Kodierung](/de/nodejs/api/buffer#buffers-and-character-encodings) der `spkac`-Zeichenkette.
- Rückgabe: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, wenn die gegebene `spkac`-Datenstruktur gültig ist, andernfalls `false`.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const { Certificate } = await import('node:crypto');

const cert = Certificate();
const spkac = getSpkacSomehow();
console.log(cert.verifySpkac(Buffer.from(spkac)));
// Gibt aus: true oder false
```

```js [CJS]
const { Buffer } = require('node:buffer');
const { Certificate } = require('node:crypto');

const cert = Certificate();
const spkac = getSpkacSomehow();
console.log(cert.verifySpkac(Buffer.from(spkac)));
// Gibt aus: true oder false
```
:::


## Klasse: `Cipher` {#class-cipher}

**Hinzugefügt in: v0.1.94**

- Erweitert: [\<stream.Transform\>](/de/nodejs/api/stream#class-streamtransform)

Instanzen der Klasse `Cipher` werden verwendet, um Daten zu verschlüsseln. Die Klasse kann auf zwei Arten verwendet werden:

- Als [Stream](/de/nodejs/api/stream), der sowohl lesbar als auch schreibbar ist, wobei unverschlüsselte Klartextdaten geschrieben werden, um verschlüsselte Daten auf der lesbaren Seite zu erzeugen, oder
- Mithilfe der Methoden [`cipher.update()`](/de/nodejs/api/crypto#cipherupdatedata-inputencoding-outputencoding) und [`cipher.final()`](/de/nodejs/api/crypto#cipherfinaloutputencoding), um die verschlüsselten Daten zu erzeugen.

Die Methode [`crypto.createCipheriv()`](/de/nodejs/api/crypto#cryptocreatecipherivalgorithm-key-iv-options) wird verwendet, um `Cipher`-Instanzen zu erstellen. `Cipher`-Objekte dürfen nicht direkt mit dem Schlüsselwort `new` erstellt werden.

Beispiel: Verwendung von `Cipher`-Objekten als Streams:

::: code-group
```js [ESM]
const {
  scrypt,
  randomFill,
  createCipheriv,
} = await import('node:crypto');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';

// Zuerst generieren wir den Schlüssel. Die Schlüssellänge hängt vom Algorithmus ab.
// In diesem Fall sind es für aes192 24 Bytes (192 Bit).
scrypt(password, 'salt', 24, (err, key) => {
  if (err) throw err;
  // Dann generieren wir einen zufälligen Initialisierungsvektor
  randomFill(new Uint8Array(16), (err, iv) => {
    if (err) throw err;

    // Sobald wir den Schlüssel und den IV haben, können wir den Cipher erstellen und verwenden...
    const cipher = createCipheriv(algorithm, key, iv);

    let encrypted = '';
    cipher.setEncoding('hex');

    cipher.on('data', (chunk) => encrypted += chunk);
    cipher.on('end', () => console.log(encrypted));

    cipher.write('some clear text data');
    cipher.end();
  });
});
```

```js [CJS]
const {
  scrypt,
  randomFill,
  createCipheriv,
} = require('node:crypto');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';

// Zuerst generieren wir den Schlüssel. Die Schlüssellänge hängt vom Algorithmus ab.
// In diesem Fall sind es für aes192 24 Bytes (192 Bit).
scrypt(password, 'salt', 24, (err, key) => {
  if (err) throw err;
  // Dann generieren wir einen zufälligen Initialisierungsvektor
  randomFill(new Uint8Array(16), (err, iv) => {
    if (err) throw err;

    // Sobald wir den Schlüssel und den IV haben, können wir den Cipher erstellen und verwenden...
    const cipher = createCipheriv(algorithm, key, iv);

    let encrypted = '';
    cipher.setEncoding('hex');

    cipher.on('data', (chunk) => encrypted += chunk);
    cipher.on('end', () => console.log(encrypted));

    cipher.write('some clear text data');
    cipher.end();
  });
});
```
:::

Beispiel: Verwendung von `Cipher` und Piped Streams:

::: code-group
```js [ESM]
import {
  createReadStream,
  createWriteStream,
} from 'node:fs';

import {
  pipeline,
} from 'node:stream';

const {
  scrypt,
  randomFill,
  createCipheriv,
} = await import('node:crypto');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';

// Zuerst generieren wir den Schlüssel. Die Schlüssellänge hängt vom Algorithmus ab.
// In diesem Fall sind es für aes192 24 Bytes (192 Bit).
scrypt(password, 'salt', 24, (err, key) => {
  if (err) throw err;
  // Dann generieren wir einen zufälligen Initialisierungsvektor
  randomFill(new Uint8Array(16), (err, iv) => {
    if (err) throw err;

    const cipher = createCipheriv(algorithm, key, iv);

    const input = createReadStream('test.js');
    const output = createWriteStream('test.enc');

    pipeline(input, cipher, output, (err) => {
      if (err) throw err;
    });
  });
});
```

```js [CJS]
const {
  createReadStream,
  createWriteStream,
} = require('node:fs');

const {
  pipeline,
} = require('node:stream');

const {
  scrypt,
  randomFill,
  createCipheriv,
} = require('node:crypto');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';

// Zuerst generieren wir den Schlüssel. Die Schlüssellänge hängt vom Algorithmus ab.
// In diesem Fall sind es für aes192 24 Bytes (192 Bit).
scrypt(password, 'salt', 24, (err, key) => {
  if (err) throw err;
  // Dann generieren wir einen zufälligen Initialisierungsvektor
  randomFill(new Uint8Array(16), (err, iv) => {
    if (err) throw err;

    const cipher = createCipheriv(algorithm, key, iv);

    const input = createReadStream('test.js');
    const output = createWriteStream('test.enc');

    pipeline(input, cipher, output, (err) => {
      if (err) throw err;
    });
  });
});
```
:::

Beispiel: Verwenden der Methoden [`cipher.update()`](/de/nodejs/api/crypto#cipherupdatedata-inputencoding-outputencoding) und [`cipher.final()`](/de/nodejs/api/crypto#cipherfinaloutputencoding):

::: code-group
```js [ESM]
const {
  scrypt,
  randomFill,
  createCipheriv,
} = await import('node:crypto');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';

// Zuerst generieren wir den Schlüssel. Die Schlüssellänge hängt vom Algorithmus ab.
// In diesem Fall sind es für aes192 24 Bytes (192 Bit).
scrypt(password, 'salt', 24, (err, key) => {
  if (err) throw err;
  // Dann generieren wir einen zufälligen Initialisierungsvektor
  randomFill(new Uint8Array(16), (err, iv) => {
    if (err) throw err;

    const cipher = createCipheriv(algorithm, key, iv);

    let encrypted = cipher.update('some clear text data', 'utf8', 'hex');
    encrypted += cipher.final('hex');
    console.log(encrypted);
  });
});
```

```js [CJS]
const {
  scrypt,
  randomFill,
  createCipheriv,
} = require('node:crypto');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';

// Zuerst generieren wir den Schlüssel. Die Schlüssellänge hängt vom Algorithmus ab.
// In diesem Fall sind es für aes192 24 Bytes (192 Bit).
scrypt(password, 'salt', 24, (err, key) => {
  if (err) throw err;
  // Dann generieren wir einen zufälligen Initialisierungsvektor
  randomFill(new Uint8Array(16), (err, iv) => {
    if (err) throw err;

    const cipher = createCipheriv(algorithm, key, iv);

    let encrypted = cipher.update('some clear text data', 'utf8', 'hex');
    encrypted += cipher.final('hex');
    console.log(encrypted);
  });
});
```
:::


### `cipher.final([outputEncoding])` {#cipherfinaloutputencoding}

**Hinzugefügt in: v0.1.94**

- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die [Kodierung](/de/nodejs/api/buffer#buffers-and-character-encodings) des Rückgabewerts.
- Rückgabe: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Jeglicher verbleibender verschlüsselter Inhalt. Wenn `outputEncoding` angegeben ist, wird ein String zurückgegeben. Wenn keine `outputEncoding` angegeben ist, wird ein [`Buffer`](/de/nodejs/api/buffer) zurückgegeben.

Sobald die `cipher.final()`-Methode aufgerufen wurde, kann das `Cipher`-Objekt nicht mehr zum Verschlüsseln von Daten verwendet werden. Der Versuch, `cipher.final()` mehr als einmal aufzurufen, führt dazu, dass ein Fehler ausgelöst wird.

### `cipher.getAuthTag()` {#ciphergetauthtag}

**Hinzugefügt in: v1.0.0**

- Rückgabe: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) Bei Verwendung eines authentifizierten Verschlüsselungsmodus (derzeit werden `GCM`, `CCM`, `OCB` und `chacha20-poly1305` unterstützt) gibt die `cipher.getAuthTag()`-Methode einen [`Buffer`](/de/nodejs/api/buffer) zurück, der das *Authentifizierungs-Tag* enthält, das aus den angegebenen Daten berechnet wurde.

Die `cipher.getAuthTag()`-Methode sollte erst aufgerufen werden, nachdem die Verschlüsselung mit der Methode [`cipher.final()`](/de/nodejs/api/crypto#cipherfinaloutputencoding) abgeschlossen wurde.

Wenn die Option `authTagLength` bei der Erstellung der `cipher`-Instanz gesetzt wurde, gibt diese Funktion genau `authTagLength` Bytes zurück.

### `cipher.setAAD(buffer[, options])` {#ciphersetaadbuffer-options}

**Hinzugefügt in: v1.0.0**

- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.transform`-Optionen](/de/nodejs/api/stream#new-streamtransformoptions)
    - `plaintextLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die zu verwendende Zeichenkettenkodierung, wenn `buffer` eine Zeichenkette ist.


- Rückgabe: [\<Cipher\>](/de/nodejs/api/crypto#class-cipher) Die gleiche `Cipher`-Instanz für Methodenverkettung.

Bei Verwendung eines authentifizierten Verschlüsselungsmodus (derzeit werden `GCM`, `CCM`, `OCB` und `chacha20-poly1305` unterstützt) setzt die `cipher.setAAD()`-Methode den Wert, der für den Eingabeparameter *Additional Authenticated Data* (AAD) verwendet wird.

Die Option `plaintextLength` ist für `GCM` und `OCB` optional. Bei Verwendung von `CCM` muss die Option `plaintextLength` angegeben werden und ihr Wert muss mit der Länge des Klartexts in Bytes übereinstimmen. Siehe [CCM-Modus](/de/nodejs/api/crypto#ccm-mode).

Die `cipher.setAAD()`-Methode muss vor [`cipher.update()`](/de/nodejs/api/crypto#cipherupdatedata-inputencoding-outputencoding) aufgerufen werden.


### `cipher.setAutoPadding([autoPadding])` {#ciphersetautopaddingautopadding}

**Hinzugefügt in: v0.7.1**

- `autoPadding` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Standardwert:** `true`
- Gibt zurück: [\<Cipher\>](/de/nodejs/api/crypto#class-cipher) Die gleiche `Cipher`-Instanz für Methodenverkettung.

Bei Verwendung von Blockverschlüsselungsalgorithmen fügt die `Cipher`-Klasse automatisch Padding zu den Eingabedaten hinzu, um die passende Blockgröße zu erreichen. Um das Standard-Padding zu deaktivieren, rufen Sie `cipher.setAutoPadding(false)` auf.

Wenn `autoPadding` den Wert `false` hat, muss die Länge der gesamten Eingabedaten ein Vielfaches der Blockgröße des Chiffres sein, oder [`cipher.final()`](/de/nodejs/api/crypto#cipherfinaloutputencoding) löst einen Fehler aus. Das Deaktivieren der automatischen Auffüllung ist nützlich für nicht standardmäßige Auffüllungen, z. B. die Verwendung von `0x0` anstelle von PKCS-Padding.

Die Methode `cipher.setAutoPadding()` muss vor [`cipher.final()`](/de/nodejs/api/crypto#cipherfinaloutputencoding) aufgerufen werden.

### `cipher.update(data[, inputEncoding][, outputEncoding])` {#cipherupdatedata-inputencoding-outputencoding}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v6.0.0 | Die Standardeinstellung für `inputEncoding` wurde von `binary` in `utf8` geändert. |
| v0.1.94 | Hinzugefügt in: v0.1.94 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die [Kodierung](/de/nodejs/api/buffer#buffers-and-character-encodings) der Daten.
- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die [Kodierung](/de/nodejs/api/buffer#buffers-and-character-encodings) des Rückgabewerts.
- Gibt zurück: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Aktualisiert den Cipher mit `data`. Wenn das Argument `inputEncoding` angegeben wird, ist das Argument `data` ein String, der die angegebene Kodierung verwendet. Wenn das Argument `inputEncoding` nicht angegeben wird, muss `data` ein [`Buffer`](/de/nodejs/api/buffer), `TypedArray` oder `DataView` sein. Wenn `data` ein [`Buffer`](/de/nodejs/api/buffer), `TypedArray` oder `DataView` ist, wird `inputEncoding` ignoriert.

Die `outputEncoding` gibt das Ausgabeformat der verschlüsselten Daten an. Wenn die `outputEncoding` angegeben ist, wird ein String zurückgegeben, der die angegebene Kodierung verwendet. Wenn keine `outputEncoding` angegeben wird, wird ein [`Buffer`](/de/nodejs/api/buffer) zurückgegeben.

Die Methode `cipher.update()` kann mehrmals mit neuen Daten aufgerufen werden, bis [`cipher.final()`](/de/nodejs/api/crypto#cipherfinaloutputencoding) aufgerufen wird. Der Aufruf von `cipher.update()` nach [`cipher.final()`](/de/nodejs/api/crypto#cipherfinaloutputencoding) führt zu einem Fehler.


## Klasse: `Decipher` {#class-decipher}

**Hinzugefügt in: v0.1.94**

- Erweitert: [\<stream.Transform\>](/de/nodejs/api/stream#class-streamtransform)

Instanzen der Klasse `Decipher` werden verwendet, um Daten zu entschlüsseln. Die Klasse kann auf zwei Arten verwendet werden:

- Als ein [Stream](/de/nodejs/api/stream), der sowohl lesbar als auch beschreibbar ist, wobei einfache verschlüsselte Daten geschrieben werden, um unverschlüsselte Daten auf der lesbaren Seite zu erzeugen, oder
- Mit den Methoden [`decipher.update()`](/de/nodejs/api/crypto#decipherupdatedata-inputencoding-outputencoding) und [`decipher.final()`](/de/nodejs/api/crypto#decipherfinaloutputencoding), um die unverschlüsselten Daten zu erzeugen.

Die Methode [`crypto.createDecipheriv()`](/de/nodejs/api/crypto#cryptocreatedecipherivalgorithm-key-iv-options) wird verwendet, um `Decipher`-Instanzen zu erstellen. `Decipher`-Objekte dürfen nicht direkt mit dem Schlüsselwort `new` erstellt werden.

Beispiel: Verwendung von `Decipher`-Objekten als Streams:

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const {
  scryptSync,
  createDecipheriv,
} = await import('node:crypto');

const algorithm = 'aes-192-cbc';
const password = 'Passwort zum Generieren des Schlüssels';
// Die Schlüssellänge ist vom Algorithmus abhängig. In diesem Fall sind es für aes192
// 24 Bytes (192 Bit).
// Verwenden Sie stattdessen das asynchrone `crypto.scrypt()`.
const key = scryptSync(password, 'salt', 24);
// Der IV wird normalerweise zusammen mit dem Chiffretext übergeben.
const iv = Buffer.alloc(16, 0); // Initialisierungsvektor.

const decipher = createDecipheriv(algorithm, key, iv);

let decrypted = '';
decipher.on('readable', () => {
  let chunk;
  while (null !== (chunk = decipher.read())) {
    decrypted += chunk.toString('utf8');
  }
});
decipher.on('end', () => {
  console.log(decrypted);
  // Gibt aus: some clear text data
});

// Verschlüsselt mit dem gleichen Algorithmus, Schlüssel und IV.
const encrypted =
  'e5f79c5915c02171eec6b212d5520d44480993d7d622a7c4c2da32f6efda0ffa';
decipher.write(encrypted, 'hex');
decipher.end();
```

```js [CJS]
const {
  scryptSync,
  createDecipheriv,
} = require('node:crypto');
const { Buffer } = require('node:buffer');

const algorithm = 'aes-192-cbc';
const password = 'Passwort zum Generieren des Schlüssels';
// Die Schlüssellänge ist vom Algorithmus abhängig. In diesem Fall sind es für aes192
// 24 Bytes (192 Bit).
// Verwenden Sie stattdessen das asynchrone `crypto.scrypt()`.
const key = scryptSync(password, 'salt', 24);
// Der IV wird normalerweise zusammen mit dem Chiffretext übergeben.
const iv = Buffer.alloc(16, 0); // Initialisierungsvektor.

const decipher = createDecipheriv(algorithm, key, iv);

let decrypted = '';
decipher.on('readable', () => {
  let chunk;
  while (null !== (chunk = decipher.read())) {
    decrypted += chunk.toString('utf8');
  }
});
decipher.on('end', () => {
  console.log(decrypted);
  // Gibt aus: some clear text data
});

// Verschlüsselt mit dem gleichen Algorithmus, Schlüssel und IV.
const encrypted =
  'e5f79c5915c02171eec6b212d5520d44480993d7d622a7c4c2da32f6efda0ffa';
decipher.write(encrypted, 'hex');
decipher.end();
```
:::

Beispiel: Verwendung von `Decipher` und verrohrten Streams:

::: code-group
```js [ESM]
import {
  createReadStream,
  createWriteStream,
} from 'node:fs';
import { Buffer } from 'node:buffer';
const {
  scryptSync,
  createDecipheriv,
} = await import('node:crypto');

const algorithm = 'aes-192-cbc';
const password = 'Passwort zum Generieren des Schlüssels';
// Verwenden Sie stattdessen das asynchrone `crypto.scrypt()`.
const key = scryptSync(password, 'salt', 24);
// Der IV wird normalerweise zusammen mit dem Chiffretext übergeben.
const iv = Buffer.alloc(16, 0); // Initialisierungsvektor.

const decipher = createDecipheriv(algorithm, key, iv);

const input = createReadStream('test.enc');
const output = createWriteStream('test.js');

input.pipe(decipher).pipe(output);
```

```js [CJS]
const {
  createReadStream,
  createWriteStream,
} = require('node:fs');
const {
  scryptSync,
  createDecipheriv,
} = require('node:crypto');
const { Buffer } = require('node:buffer');

const algorithm = 'aes-192-cbc';
const password = 'Passwort zum Generieren des Schlüssels';
// Verwenden Sie stattdessen das asynchrone `crypto.scrypt()`.
const key = scryptSync(password, 'salt', 24);
// Der IV wird normalerweise zusammen mit dem Chiffretext übergeben.
const iv = Buffer.alloc(16, 0); // Initialisierungsvektor.

const decipher = createDecipheriv(algorithm, key, iv);

const input = createReadStream('test.enc');
const output = createWriteStream('test.js');

input.pipe(decipher).pipe(output);
```
:::

Beispiel: Verwendung der Methoden [`decipher.update()`](/de/nodejs/api/crypto#decipherupdatedata-inputencoding-outputencoding) und [`decipher.final()`](/de/nodejs/api/crypto#decipherfinaloutputencoding):

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const {
  scryptSync,
  createDecipheriv,
} = await import('node:crypto');

const algorithm = 'aes-192-cbc';
const password = 'Passwort zum Generieren des Schlüssels';
// Verwenden Sie stattdessen das asynchrone `crypto.scrypt()`.
const key = scryptSync(password, 'salt', 24);
// Der IV wird normalerweise zusammen mit dem Chiffretext übergeben.
const iv = Buffer.alloc(16, 0); // Initialisierungsvektor.

const decipher = createDecipheriv(algorithm, key, iv);

// Verschlüsselt mit dem gleichen Algorithmus, Schlüssel und IV.
const encrypted =
  'e5f79c5915c02171eec6b212d5520d44480993d7d622a7c4c2da32f6efda0ffa';
let decrypted = decipher.update(encrypted, 'hex', 'utf8');
decrypted += decipher.final('utf8');
console.log(decrypted);
// Gibt aus: some clear text data
```

```js [CJS]
const {
  scryptSync,
  createDecipheriv,
} = require('node:crypto');
const { Buffer } = require('node:buffer');

const algorithm = 'aes-192-cbc';
const password = 'Passwort zum Generieren des Schlüssels';
// Verwenden Sie stattdessen das asynchrone `crypto.scrypt()`.
const key = scryptSync(password, 'salt', 24);
// Der IV wird normalerweise zusammen mit dem Chiffretext übergeben.
const iv = Buffer.alloc(16, 0); // Initialisierungsvektor.

const decipher = createDecipheriv(algorithm, key, iv);

// Verschlüsselt mit dem gleichen Algorithmus, Schlüssel und IV.
const encrypted =
  'e5f79c5915c02171eec6b212d5520d44480993d7d622a7c4c2da32f6efda0ffa';
let decrypted = decipher.update(encrypted, 'hex', 'utf8');
decrypted += decipher.final('utf8');
console.log(decrypted);
// Gibt aus: some clear text data
```
:::


### `decipher.final([outputEncoding])` {#decipherfinaloutputencoding}

**Hinzugefügt in: v0.1.94**

- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die [Kodierung](/de/nodejs/api/buffer#buffers-and-character-encodings) des Rückgabewertes.
- Rückgabe: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Alle verbleibenden entschlüsselten Inhalte. Wenn `outputEncoding` angegeben ist, wird ein String zurückgegeben. Wenn keine `outputEncoding` angegeben wird, wird ein [`Buffer`](/de/nodejs/api/buffer) zurückgegeben.

Sobald die Methode `decipher.final()` aufgerufen wurde, kann das `Decipher`-Objekt nicht mehr zum Entschlüsseln von Daten verwendet werden. Versuche, `decipher.final()` mehr als einmal aufzurufen, führen zu einem Fehler.

### `decipher.setAAD(buffer[, options])` {#deciphersetaadbuffer-options}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v15.0.0 | Das Puffer-Argument kann ein String oder ArrayBuffer sein und ist auf maximal 2 ** 31 - 1 Bytes begrenzt. |
| v7.2.0 | Diese Methode gibt nun eine Referenz auf `decipher` zurück. |
| v1.0.0 | Hinzugefügt in: v1.0.0 |
:::

- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.transform` Optionen](/de/nodejs/api/stream#new-streamtransformoptions)
    - `plaintextLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) String-Kodierung, die verwendet werden soll, wenn `buffer` ein String ist.

- Rückgabe: [\<Decipher\>](/de/nodejs/api/crypto#class-decipher) Dasselbe Decipher für Methodenverkettung.

Bei Verwendung eines authentifizierten Verschlüsselungsmodus (derzeit werden `GCM`, `CCM`, `OCB` und `chacha20-poly1305` unterstützt) legt die Methode `decipher.setAAD()` den Wert fest, der für den Eingabeparameter *Additional Authenticated Data* (AAD) verwendet wird.

Das Argument `options` ist für `GCM` optional. Bei Verwendung von `CCM` muss die Option `plaintextLength` angegeben werden und ihr Wert muss mit der Länge des Chiffretextes in Byte übereinstimmen. Siehe [CCM-Modus](/de/nodejs/api/crypto#ccm-mode).

Die Methode `decipher.setAAD()` muss vor [`decipher.update()`](/de/nodejs/api/crypto#decipherupdatedata-inputencoding-outputencoding) aufgerufen werden.

Wenn ein String als `buffer` übergeben wird, beachten Sie bitte die [Vorbehalte bei der Verwendung von Strings als Eingaben für kryptografische APIs](/de/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis).


### `decipher.setAuthTag(buffer[, encoding])` {#deciphersetauthtagbuffer-encoding}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v22.0.0, v20.13.0 | Die Verwendung anderer GCM-Tag-Längen als 128 Bit ohne Angabe der Option `authTagLength` beim Erstellen von `decipher` ist veraltet. |
| v15.0.0 | Das `buffer`-Argument kann ein String oder ein ArrayBuffer sein und ist auf maximal 2 ** 31 - 1 Bytes beschränkt. |
| v11.0.0 | Diese Methode wirft nun einen Fehler, wenn die GCM-Tag-Länge ungültig ist. |
| v7.2.0 | Diese Methode gibt nun eine Referenz auf `decipher` zurück. |
| v1.0.0 | Hinzugefügt in: v1.0.0 |
:::

- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) String-Kodierung, die verwendet werden soll, wenn `buffer` ein String ist.
- Rückgabe: [\<Decipher\>](/de/nodejs/api/crypto#class-decipher) Dasselbe Decipher für Method Chaining.

Bei Verwendung eines authentifizierten Verschlüsselungsmodus (derzeit werden `GCM`, `CCM`, `OCB` und `chacha20-poly1305` unterstützt) wird die Methode `decipher.setAuthTag()` verwendet, um das empfangene *Authentifizierungs-Tag* zu übergeben. Wenn kein Tag bereitgestellt wird oder der Chiffretext manipuliert wurde, löst [`decipher.final()`](/de/nodejs/api/crypto#decipherfinaloutputencoding) eine Ausnahme aus, die angibt, dass der Chiffretext aufgrund fehlgeschlagener Authentifizierung verworfen werden sollte. Wenn die Tag-Länge gemäß [NIST SP 800-38D](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38d.pdf) ungültig ist oder nicht mit dem Wert der Option `authTagLength` übereinstimmt, löst `decipher.setAuthTag()` einen Fehler aus.

Die Methode `decipher.setAuthTag()` muss vor [`decipher.update()`](/de/nodejs/api/crypto#decipherupdatedata-inputencoding-outputencoding) für den `CCM`-Modus oder vor [`decipher.final()`](/de/nodejs/api/crypto#decipherfinaloutputencoding) für die Modi `GCM` und `OCB` und `chacha20-poly1305` aufgerufen werden. `decipher.setAuthTag()` kann nur einmal aufgerufen werden.

Wenn ein String als Authentifizierungs-Tag übergeben wird, beachten Sie bitte die [Vorbehalte bei der Verwendung von Strings als Eingabe für kryptografische APIs](/de/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis).


### `decipher.setAutoPadding([autoPadding])` {#deciphersetautopaddingautopadding}

**Hinzugefügt in: v0.7.1**

- `autoPadding` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Standardwert:** `true`
- Gibt zurück: [\<Decipher\>](/de/nodejs/api/crypto#class-decipher) Das gleiche Decipher für Methodenverkettung.

Wenn Daten ohne Standard-Blockauffüllung verschlüsselt wurden, deaktiviert der Aufruf von `decipher.setAutoPadding(false)` die automatische Auffüllung, um zu verhindern, dass [`decipher.final()`](/de/nodejs/api/crypto#decipherfinaloutputencoding) die Auffüllung überprüft und entfernt.

Das Deaktivieren der automatischen Auffüllung funktioniert nur, wenn die Länge der Eingabedaten ein Vielfaches der Blockgröße der Chiffren ist.

Die Methode `decipher.setAutoPadding()` muss vor [`decipher.final()`](/de/nodejs/api/crypto#decipherfinaloutputencoding) aufgerufen werden.

### `decipher.update(data[, inputEncoding][, outputEncoding])` {#decipherupdatedata-inputencoding-outputencoding}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v6.0.0 | Die Standard `inputEncoding` wurde von `binary` auf `utf8` geändert. |
| v0.1.94 | Hinzugefügt in: v0.1.94 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die [Kodierung](/de/nodejs/api/buffer#buffers-and-character-encodings) der `data`-Zeichenkette.
- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die [Kodierung](/de/nodejs/api/buffer#buffers-and-character-encodings) des Rückgabewertes.
- Gibt zurück: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Aktualisiert die Entschlüsselung mit `data`. Wenn das Argument `inputEncoding` angegeben ist, ist das Argument `data` eine Zeichenkette, die die angegebene Kodierung verwendet. Wenn das Argument `inputEncoding` nicht angegeben ist, muss `data` ein [`Buffer`](/de/nodejs/api/buffer) sein. Wenn `data` ein [`Buffer`](/de/nodejs/api/buffer) ist, wird `inputEncoding` ignoriert.

Die `outputEncoding` gibt das Ausgabeformat der verschlüsselten Daten an. Wenn die `outputEncoding` angegeben ist, wird eine Zeichenkette mit der angegebenen Kodierung zurückgegeben. Wenn keine `outputEncoding` angegeben ist, wird ein [`Buffer`](/de/nodejs/api/buffer) zurückgegeben.

Die Methode `decipher.update()` kann mehrmals mit neuen Daten aufgerufen werden, bis [`decipher.final()`](/de/nodejs/api/crypto#decipherfinaloutputencoding) aufgerufen wird. Der Aufruf von `decipher.update()` nach [`decipher.final()`](/de/nodejs/api/crypto#decipherfinaloutputencoding) führt zu einem Fehler.

Auch wenn die zugrunde liegende Chiffre Authentifizierung implementiert, können die Authentizität und Integrität des von dieser Funktion zurückgegebenen Klartexts zu diesem Zeitpunkt ungewiss sein. Für authentifizierte Verschlüsselungsalgorithmen wird die Authentizität in der Regel erst hergestellt, wenn die Anwendung [`decipher.final()`](/de/nodejs/api/crypto#decipherfinaloutputencoding) aufruft.


## Klasse: `DiffieHellman` {#class-diffiehellman}

**Hinzugefügt in: v0.5.0**

Die Klasse `DiffieHellman` ist ein Hilfsmittel zum Erstellen von Diffie-Hellman-Schlüsselaustauschen.

Instanzen der Klasse `DiffieHellman` können mithilfe der Funktion [`crypto.createDiffieHellman()`](/de/nodejs/api/crypto#cryptocreatediffiehellmanprime-primeencoding-generator-generatorencoding) erstellt werden.

::: code-group
```js [ESM]
import assert from 'node:assert';

const {
  createDiffieHellman,
} = await import('node:crypto');

// Alice' Schlüssel generieren...
const alice = createDiffieHellman(2048);
const aliceKey = alice.generateKeys();

// Bobs Schlüssel generieren...
const bob = createDiffieHellman(alice.getPrime(), alice.getGenerator());
const bobKey = bob.generateKeys();

// Austauschen und das Geheimnis generieren...
const aliceSecret = alice.computeSecret(bobKey);
const bobSecret = bob.computeSecret(aliceKey);

// OK
assert.strictEqual(aliceSecret.toString('hex'), bobSecret.toString('hex'));
```

```js [CJS]
const assert = require('node:assert');

const {
  createDiffieHellman,
} = require('node:crypto');

// Alice' Schlüssel generieren...
const alice = createDiffieHellman(2048);
const aliceKey = alice.generateKeys();

// Bobs Schlüssel generieren...
const bob = createDiffieHellman(alice.getPrime(), alice.getGenerator());
const bobKey = bob.generateKeys();

// Austauschen und das Geheimnis generieren...
const aliceSecret = alice.computeSecret(bobKey);
const bobSecret = bob.computeSecret(aliceKey);

// OK
assert.strictEqual(aliceSecret.toString('hex'), bobSecret.toString('hex'));
```
:::

### `diffieHellman.computeSecret(otherPublicKey[, inputEncoding][, outputEncoding])` {#diffiehellmancomputesecretotherpublickey-inputencoding-outputencoding}

**Hinzugefügt in: v0.5.0**

- `otherPublicKey` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die [Kodierung](/de/nodejs/api/buffer#buffers-and-character-encodings) einer `otherPublicKey`-Zeichenkette.
- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die [Kodierung](/de/nodejs/api/buffer#buffers-and-character-encodings) des Rückgabewerts.
- Rückgabe: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Berechnet das gemeinsame Geheimnis unter Verwendung von `otherPublicKey` als öffentlicher Schlüssel der anderen Partei und gibt das berechnete gemeinsame Geheimnis zurück. Der bereitgestellte Schlüssel wird unter Verwendung der angegebenen `inputEncoding` interpretiert, und das Geheimnis wird unter Verwendung der angegebenen `outputEncoding` kodiert. Wenn `inputEncoding` nicht angegeben wird, wird erwartet, dass `otherPublicKey` ein [`Buffer`](/de/nodejs/api/buffer), `TypedArray` oder `DataView` ist.

Wenn `outputEncoding` angegeben wird, wird eine Zeichenkette zurückgegeben; andernfalls wird ein [`Buffer`](/de/nodejs/api/buffer) zurückgegeben.


### `diffieHellman.generateKeys([encoding])` {#diffiehellmangeneratekeysencoding}

**Hinzugefügt in: v0.5.0**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die [Kodierung](/de/nodejs/api/buffer#buffers-and-character-encodings) des Rückgabewerts.
- Gibt zurück: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Generiert private und öffentliche Diffie-Hellman-Schlüsselwerte, falls diese nicht bereits generiert oder berechnet wurden, und gibt den öffentlichen Schlüssel in der angegebenen `encoding` zurück. Dieser Schlüssel sollte an die andere Partei übertragen werden. Wenn `encoding` angegeben ist, wird eine Zeichenkette zurückgegeben; andernfalls wird ein [`Buffer`](/de/nodejs/api/buffer) zurückgegeben.

Diese Funktion ist ein schlanker Wrapper um [`DH_generate_key()`](https://www.openssl.org/docs/man3.0/man3/DH_generate_key). Insbesondere, sobald ein privater Schlüssel generiert oder gesetzt wurde, aktualisiert der Aufruf dieser Funktion nur den öffentlichen Schlüssel, generiert aber keinen neuen privaten Schlüssel.

### `diffieHellman.getGenerator([encoding])` {#diffiehellmangetgeneratorencoding}

**Hinzugefügt in: v0.5.0**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die [Kodierung](/de/nodejs/api/buffer#buffers-and-character-encodings) des Rückgabewerts.
- Gibt zurück: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Gibt den Diffie-Hellman-Generator in der angegebenen `encoding` zurück. Wenn `encoding` angegeben ist, wird eine Zeichenkette zurückgegeben; andernfalls wird ein [`Buffer`](/de/nodejs/api/buffer) zurückgegeben.

### `diffieHellman.getPrime([encoding])` {#diffiehellmangetprimeencoding}

**Hinzugefügt in: v0.5.0**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die [Kodierung](/de/nodejs/api/buffer#buffers-and-character-encodings) des Rückgabewerts.
- Gibt zurück: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Gibt die Diffie-Hellman-Primzahl in der angegebenen `encoding` zurück. Wenn `encoding` angegeben ist, wird eine Zeichenkette zurückgegeben; andernfalls wird ein [`Buffer`](/de/nodejs/api/buffer) zurückgegeben.


### `diffieHellman.getPrivateKey([encoding])` {#diffiehellmangetprivatekeyencoding}

**Hinzugefügt in: v0.5.0**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die [Kodierung](/de/nodejs/api/buffer#buffers-and-character-encodings) des Rückgabewerts.
- Rückgabe: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Gibt den privaten Diffie-Hellman-Schlüssel in der angegebenen `encoding` zurück. Wenn `encoding` angegeben ist, wird eine Zeichenkette zurückgegeben; andernfalls wird ein [`Buffer`](/de/nodejs/api/buffer) zurückgegeben.

### `diffieHellman.getPublicKey([encoding])` {#diffiehellmangetpublickeyencoding}

**Hinzugefügt in: v0.5.0**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die [Kodierung](/de/nodejs/api/buffer#buffers-and-character-encodings) des Rückgabewerts.
- Rückgabe: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Gibt den öffentlichen Diffie-Hellman-Schlüssel in der angegebenen `encoding` zurück. Wenn `encoding` angegeben ist, wird eine Zeichenkette zurückgegeben; andernfalls wird ein [`Buffer`](/de/nodejs/api/buffer) zurückgegeben.

### `diffieHellman.setPrivateKey(privateKey[, encoding])` {#diffiehellmansetprivatekeyprivatekey-encoding}

**Hinzugefügt in: v0.5.0**

- `privateKey` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die [Kodierung](/de/nodejs/api/buffer#buffers-and-character-encodings) der `privateKey`-Zeichenkette.

Setzt den privaten Diffie-Hellman-Schlüssel. Wenn das Argument `encoding` angegeben ist, wird erwartet, dass `privateKey` eine Zeichenkette ist. Wenn keine `encoding` angegeben ist, wird erwartet, dass `privateKey` ein [`Buffer`](/de/nodejs/api/buffer), `TypedArray` oder `DataView` ist.

Diese Funktion berechnet nicht automatisch den zugehörigen öffentlichen Schlüssel. Entweder [`diffieHellman.setPublicKey()`](/de/nodejs/api/crypto#diffiehellmansetpublickeypublickey-encoding) oder [`diffieHellman.generateKeys()`](/de/nodejs/api/crypto#diffiehellmangeneratekeysencoding) kann verwendet werden, um den öffentlichen Schlüssel manuell bereitzustellen oder ihn automatisch abzuleiten.


### `diffieHellman.setPublicKey(publicKey[, encoding])` {#diffiehellmansetpublickeypublickey-encoding}

**Hinzugefügt in: v0.5.0**

- `publicKey` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die [Kodierung](/de/nodejs/api/buffer#buffers-and-character-encodings) der `publicKey`-Zeichenkette.

Setzt den öffentlichen Schlüssel von Diffie-Hellman. Wenn das `encoding`-Argument angegeben wird, wird erwartet, dass `publicKey` eine Zeichenkette ist. Wenn keine `encoding` angegeben ist, wird erwartet, dass `publicKey` ein [`Buffer`](/de/nodejs/api/buffer), `TypedArray` oder `DataView` ist.

### `diffieHellman.verifyError` {#diffiehellmanverifyerror}

**Hinzugefügt in: v0.11.12**

Ein Bitfeld, das alle Warnungen und/oder Fehler enthält, die aus einer Überprüfung resultieren, die während der Initialisierung des `DiffieHellman`-Objekts durchgeführt wurde.

Die folgenden Werte sind für diese Eigenschaft gültig (wie im `node:constants`-Modul definiert):

- `DH_CHECK_P_NOT_SAFE_PRIME`
- `DH_CHECK_P_NOT_PRIME`
- `DH_UNABLE_TO_CHECK_GENERATOR`
- `DH_NOT_SUITABLE_GENERATOR`

## Klasse: `DiffieHellmanGroup` {#class-diffiehellmangroup}

**Hinzugefügt in: v0.7.5**

Die Klasse `DiffieHellmanGroup` nimmt eine bekannte Modp-Gruppe als Argument entgegen. Sie funktioniert genauso wie `DiffieHellman`, außer dass sie keine Änderung ihrer Schlüssel nach der Erstellung zulässt. Mit anderen Worten, sie implementiert keine Methoden `setPublicKey()` oder `setPrivateKey()`.

::: code-group
```js [ESM]
const { createDiffieHellmanGroup } = await import('node:crypto');
const dh = createDiffieHellmanGroup('modp16');
```

```js [CJS]
const { createDiffieHellmanGroup } = require('node:crypto');
const dh = createDiffieHellmanGroup('modp16');
```
:::

Die folgenden Gruppen werden unterstützt:

- `'modp14'` (2048 Bits, [RFC 3526](https://www.rfc-editor.org/rfc/rfc3526.txt) Abschnitt 3)
- `'modp15'` (3072 Bits, [RFC 3526](https://www.rfc-editor.org/rfc/rfc3526.txt) Abschnitt 4)
- `'modp16'` (4096 Bits, [RFC 3526](https://www.rfc-editor.org/rfc/rfc3526.txt) Abschnitt 5)
- `'modp17'` (6144 Bits, [RFC 3526](https://www.rfc-editor.org/rfc/rfc3526.txt) Abschnitt 6)
- `'modp18'` (8192 Bits, [RFC 3526](https://www.rfc-editor.org/rfc/rfc3526.txt) Abschnitt 7)

Die folgenden Gruppen werden weiterhin unterstützt, sind aber veraltet (siehe [Hinweise](/de/nodejs/api/crypto#support-for-weak-or-compromised-algorithms)):

- `'modp1'` (768 Bits, [RFC 2409](https://www.rfc-editor.org/rfc/rfc2409.txt) Abschnitt 6.1)
- `'modp2'` (1024 Bits, [RFC 2409](https://www.rfc-editor.org/rfc/rfc2409.txt) Abschnitt 6.2)
- `'modp5'` (1536 Bits, [RFC 3526](https://www.rfc-editor.org/rfc/rfc3526.txt) Abschnitt 2)

Diese veralteten Gruppen könnten in zukünftigen Versionen von Node.js entfernt werden.


## Klasse: `ECDH` {#class-ecdh}

**Hinzugefügt in: v0.11.14**

Die Klasse `ECDH` ist ein Hilfsmittel zum Erstellen von Elliptic Curve Diffie-Hellman (ECDH)-Schlüsselaustauschen.

Instanzen der Klasse `ECDH` können mit der Funktion [`crypto.createECDH()`](/de/nodejs/api/crypto#cryptocreateecdhcurvename) erstellt werden.

::: code-group
```js [ESM]
import assert from 'node:assert';

const {
  createECDH,
} = await import('node:crypto');

// Alice' Schlüssel generieren...
const alice = createECDH('secp521r1');
const aliceKey = alice.generateKeys();

// Bobs Schlüssel generieren...
const bob = createECDH('secp521r1');
const bobKey = bob.generateKeys();

// Austauschen und das Geheimnis generieren...
const aliceSecret = alice.computeSecret(bobKey);
const bobSecret = bob.computeSecret(aliceKey);

assert.strictEqual(aliceSecret.toString('hex'), bobSecret.toString('hex'));
// OK
```

```js [CJS]
const assert = require('node:assert');

const {
  createECDH,
} = require('node:crypto');

// Alice' Schlüssel generieren...
const alice = createECDH('secp521r1');
const aliceKey = alice.generateKeys();

// Bobs Schlüssel generieren...
const bob = createECDH('secp521r1');
const bobKey = bob.generateKeys();

// Austauschen und das Geheimnis generieren...
const aliceSecret = alice.computeSecret(bobKey);
const bobSecret = bob.computeSecret(aliceKey);

assert.strictEqual(aliceSecret.toString('hex'), bobSecret.toString('hex'));
// OK
```
:::

### Statische Methode: `ECDH.convertKey(key, curve[, inputEncoding[, outputEncoding[, format]]])` {#static-method-ecdhconvertkeykey-curve-inputencoding-outputencoding-format}

**Hinzugefügt in: v10.0.0**

- `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `curve` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die [Kodierung](/de/nodejs/api/buffer#buffers-and-character-encodings) der `key`-Zeichenkette.
- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die [Kodierung](/de/nodejs/api/buffer#buffers-and-character-encodings) des Rückgabewerts.
- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Standard:** `'uncompressed'`
- Gibt zurück: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Konvertiert den durch `key` und `curve` angegebenen öffentlichen EC Diffie-Hellman-Schlüssel in das durch `format` angegebene Format. Das `format`-Argument gibt die Punktkodierung an und kann `'compressed'`, `'uncompressed'` oder `'hybrid'` sein. Der bereitgestellte Schlüssel wird unter Verwendung der angegebenen `inputEncoding` interpretiert und der zurückgegebene Schlüssel wird unter Verwendung der angegebenen `outputEncoding` kodiert.

Verwenden Sie [`crypto.getCurves()`](/de/nodejs/api/crypto#cryptogetcurves), um eine Liste der verfügbaren Kurvennamen zu erhalten. Bei neueren OpenSSL-Releases zeigt `openssl ecparam -list_curves` auch den Namen und die Beschreibung jeder verfügbaren elliptischen Kurve an.

Wenn `format` nicht angegeben ist, wird der Punkt im Format `'uncompressed'` zurückgegeben.

Wenn die `inputEncoding` nicht angegeben wird, wird erwartet, dass `key` ein [`Buffer`](/de/nodejs/api/buffer), `TypedArray` oder `DataView` ist.

Beispiel (Entpacken eines Schlüssels):

::: code-group
```js [ESM]
const {
  createECDH,
  ECDH,
} = await import('node:crypto');

const ecdh = createECDH('secp256k1');
ecdh.generateKeys();

const compressedKey = ecdh.getPublicKey('hex', 'compressed');

const uncompressedKey = ECDH.convertKey(compressedKey,
                                        'secp256k1',
                                        'hex',
                                        'hex',
                                        'uncompressed');

// Der konvertierte Schlüssel und der unkomprimierte öffentliche Schlüssel sollten identisch sein
console.log(uncompressedKey === ecdh.getPublicKey('hex'));
```

```js [CJS]
const {
  createECDH,
  ECDH,
} = require('node:crypto');

const ecdh = createECDH('secp256k1');
ecdh.generateKeys();

const compressedKey = ecdh.getPublicKey('hex', 'compressed');

const uncompressedKey = ECDH.convertKey(compressedKey,
                                        'secp256k1',
                                        'hex',
                                        'hex',
                                        'uncompressed');

// Der konvertierte Schlüssel und der unkomprimierte öffentliche Schlüssel sollten identisch sein
console.log(uncompressedKey === ecdh.getPublicKey('hex'));
```
:::


### `ecdh.computeSecret(otherPublicKey[, inputEncoding][, outputEncoding])` {#ecdhcomputesecretotherpublickey-inputencoding-outputencoding}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v10.0.0 | Fehlerformat geändert, um ungültige Public-Key-Fehler besser zu unterstützen. |
| v6.0.0 | Die Standard-`inputEncoding` wurde von `binary` auf `utf8` geändert. |
| v0.11.14 | Hinzugefügt in: v0.11.14 |
:::

- `otherPublicKey` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die [Kodierung](/de/nodejs/api/buffer#buffers-and-character-encodings) der `otherPublicKey`-Zeichenkette.
- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die [Kodierung](/de/nodejs/api/buffer#buffers-and-character-encodings) des Rückgabewerts.
- Rückgabe: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Berechnet das gemeinsame Geheimnis unter Verwendung von `otherPublicKey` als öffentlicher Schlüssel der anderen Partei und gibt das berechnete gemeinsame Geheimnis zurück. Der bereitgestellte Schlüssel wird mit der angegebenen `inputEncoding` interpretiert, und das zurückgegebene Geheimnis wird mit der angegebenen `outputEncoding` kodiert. Wenn `inputEncoding` nicht angegeben ist, wird erwartet, dass `otherPublicKey` ein [`Buffer`](/de/nodejs/api/buffer), `TypedArray` oder `DataView` ist.

Wenn `outputEncoding` angegeben ist, wird eine Zeichenkette zurückgegeben; andernfalls wird ein [`Buffer`](/de/nodejs/api/buffer) zurückgegeben.

`ecdh.computeSecret` löst einen `ERR_CRYPTO_ECDH_INVALID_PUBLIC_KEY`-Fehler aus, wenn `otherPublicKey` außerhalb der elliptischen Kurve liegt. Da `otherPublicKey` normalerweise von einem Remote-Benutzer über ein unsicheres Netzwerk bereitgestellt wird, stellen Sie sicher, dass Sie diese Ausnahme entsprechend behandeln.


### `ecdh.generateKeys([encoding[, format]])` {#ecdhgeneratekeysencoding-format}

**Hinzugefügt in: v0.11.14**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die [Kodierung](/de/nodejs/api/buffer#buffers-and-character-encodings) des Rückgabewerts.
- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Standard:** `'uncompressed'`
- Gibt zurück: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Generiert private und öffentliche EC-Diffie-Hellman-Schlüsselwerte und gibt den öffentlichen Schlüssel im angegebenen `format` und `encoding` zurück. Dieser Schlüssel sollte an die andere Partei übertragen werden.

Das `format`-Argument gibt die Punktkodierung an und kann `'compressed'` oder `'uncompressed'` sein. Wenn `format` nicht angegeben ist, wird der Punkt im Format `'uncompressed'` zurückgegeben.

Wenn `encoding` angegeben ist, wird ein String zurückgegeben; andernfalls wird ein [`Buffer`](/de/nodejs/api/buffer) zurückgegeben.

### `ecdh.getPrivateKey([encoding])` {#ecdhgetprivatekeyencoding}

**Hinzugefügt in: v0.11.14**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die [Kodierung](/de/nodejs/api/buffer#buffers-and-character-encodings) des Rückgabewerts.
- Gibt zurück: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der EC-Diffie-Hellman in der angegebenen `encoding`.

Wenn `encoding` angegeben ist, wird ein String zurückgegeben; andernfalls wird ein [`Buffer`](/de/nodejs/api/buffer) zurückgegeben.

### `ecdh.getPublicKey([encoding][, format])` {#ecdhgetpublickeyencoding-format}

**Hinzugefügt in: v0.11.14**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die [Kodierung](/de/nodejs/api/buffer#buffers-and-character-encodings) des Rückgabewerts.
- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Standard:** `'uncompressed'`
- Gibt zurück: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der öffentliche EC-Diffie-Hellman-Schlüssel in der angegebenen `encoding` und `format`.

Das `format`-Argument gibt die Punktkodierung an und kann `'compressed'` oder `'uncompressed'` sein. Wenn `format` nicht angegeben ist, wird der Punkt im Format `'uncompressed'` zurückgegeben.

Wenn `encoding` angegeben ist, wird ein String zurückgegeben; andernfalls wird ein [`Buffer`](/de/nodejs/api/buffer) zurückgegeben.


### `ecdh.setPrivateKey(privateKey[, encoding])` {#ecdhsetprivatekeyprivatekey-encoding}

**Hinzugefügt in: v0.11.14**

- `privateKey` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die [Kodierung](/de/nodejs/api/buffer#buffers-and-character-encodings) der `privateKey`-Zeichenkette.

Setzt den privaten EC-Diffie-Hellman-Schlüssel. Wenn `encoding` angegeben ist, wird erwartet, dass `privateKey` eine Zeichenkette ist; andernfalls wird erwartet, dass `privateKey` ein [`Buffer`](/de/nodejs/api/buffer), `TypedArray` oder `DataView` ist.

Wenn `privateKey` für die Kurve, die beim Erstellen des `ECDH`-Objekts angegeben wurde, ungültig ist, wird ein Fehler geworfen. Beim Setzen des privaten Schlüssels wird auch der zugehörige öffentliche Punkt (Schlüssel) erzeugt und im `ECDH`-Objekt gesetzt.

### `ecdh.setPublicKey(publicKey[, encoding])` {#ecdhsetpublickeypublickey-encoding}

**Hinzugefügt in: v0.11.14**

**Veraltet seit: v5.2.0**

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/de/nodejs/api/documentation#stability-index) [Stabilität: 0](/de/nodejs/api/documentation#stability-index) - Veraltet
:::

- `publicKey` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die [Kodierung](/de/nodejs/api/buffer#buffers-and-character-encodings) der `publicKey`-Zeichenkette.

Setzt den öffentlichen EC-Diffie-Hellman-Schlüssel. Wenn `encoding` angegeben ist, wird erwartet, dass `publicKey` eine Zeichenkette ist; andernfalls wird ein [`Buffer`](/de/nodejs/api/buffer), `TypedArray` oder `DataView` erwartet.

Es gibt normalerweise keinen Grund, diese Methode aufzurufen, da `ECDH` nur einen privaten Schlüssel und den öffentlichen Schlüssel der anderen Partei benötigt, um das gemeinsame Geheimnis zu berechnen. Typischerweise wird entweder [`ecdh.generateKeys()`](/de/nodejs/api/crypto#ecdhgeneratekeysencoding-format) oder [`ecdh.setPrivateKey()`](/de/nodejs/api/crypto#ecdhsetprivatekeyprivatekey-encoding) aufgerufen. Die Methode [`ecdh.setPrivateKey()`](/de/nodejs/api/crypto#ecdhsetprivatekeyprivatekey-encoding) versucht, den öffentlichen Punkt/Schlüssel zu erzeugen, der mit dem gesetzten privaten Schlüssel verbunden ist.

Beispiel (Ermittlung eines gemeinsamen Geheimnisses):

::: code-group
```js [ESM]
const {
  createECDH,
  createHash,
} = await import('node:crypto');

const alice = createECDH('secp256k1');
const bob = createECDH('secp256k1');

// This is a shortcut way of specifying one of Alice's previous private
// keys. It would be unwise to use such a predictable private key in a real
// application.
alice.setPrivateKey(
  createHash('sha256').update('alice', 'utf8').digest(),
);

// Bob uses a newly generated cryptographically strong
// pseudorandom key pair
bob.generateKeys();

const aliceSecret = alice.computeSecret(bob.getPublicKey(), null, 'hex');
const bobSecret = bob.computeSecret(alice.getPublicKey(), null, 'hex');

// aliceSecret and bobSecret should be the same shared secret value
console.log(aliceSecret === bobSecret);
```

```js [CJS]
const {
  createECDH,
  createHash,
} = require('node:crypto');

const alice = createECDH('secp256k1');
const bob = createECDH('secp256k1');

// This is a shortcut way of specifying one of Alice's previous private
// keys. It would be unwise to use such a predictable private key in a real
// application.
alice.setPrivateKey(
  createHash('sha256').update('alice', 'utf8').digest(),
);

// Bob uses a newly generated cryptographically strong
// pseudorandom key pair
bob.generateKeys();

const aliceSecret = alice.computeSecret(bob.getPublicKey(), null, 'hex');
const bobSecret = bob.computeSecret(alice.getPublicKey(), null, 'hex');

// aliceSecret and bobSecret should be the same shared secret value
console.log(aliceSecret === bobSecret);
```
:::


## Klasse: `Hash` {#class-hash}

**Hinzugefügt in: v0.1.92**

- Erweitert: [\<stream.Transform\>](/de/nodejs/api/stream#class-streamtransform)

Die Klasse `Hash` ist ein Hilfsprogramm zum Erstellen von Hash-Digests von Daten. Sie kann auf zwei Arten verwendet werden:

- Als [Stream](/de/nodejs/api/stream), der sowohl lesbar als auch beschreibbar ist, wobei Daten geschrieben werden, um einen berechneten Hash-Digest auf der lesbaren Seite zu erzeugen, oder
- Mithilfe der Methoden [`hash.update()`](/de/nodejs/api/crypto#hashupdatedata-inputencoding) und [`hash.digest()`](/de/nodejs/api/crypto#hashdigestencoding), um den berechneten Hash zu erzeugen.

Die Methode [`crypto.createHash()`](/de/nodejs/api/crypto#cryptocreatehashalgorithm-options) wird verwendet, um `Hash`-Instanzen zu erstellen. `Hash`-Objekte dürfen nicht direkt mit dem Schlüsselwort `new` erstellt werden.

Beispiel: Verwenden von `Hash`-Objekten als Streams:



::: code-group
```js [ESM]
const {
  createHash,
} = await import('node:crypto');

const hash = createHash('sha256');

hash.on('readable', () => {
  // Es wird nur ein Element vom
  // Hash-Stream erzeugt.
  const data = hash.read();
  if (data) {
    console.log(data.toString('hex'));
    // Gibt aus:
    //   6a2da20943931e9834fc12cfe5bb47bbd9ae43489a30726962b576f4e3993e50
  }
});

hash.write('some data to hash');
hash.end();
```

```js [CJS]
const {
  createHash,
} = require('node:crypto');

const hash = createHash('sha256');

hash.on('readable', () => {
  // Es wird nur ein Element vom
  // Hash-Stream erzeugt.
  const data = hash.read();
  if (data) {
    console.log(data.toString('hex'));
    // Gibt aus:
    //   6a2da20943931e9834fc12cfe5bb47bbd9ae43489a30726962b576f4e3993e50
  }
});

hash.write('some data to hash');
hash.end();
```
:::

Beispiel: Verwenden von `Hash` und gepipten Streams:



::: code-group
```js [ESM]
import { createReadStream } from 'node:fs';
import { stdout } from 'node:process';
const { createHash } = await import('node:crypto');

const hash = createHash('sha256');

const input = createReadStream('test.js');
input.pipe(hash).setEncoding('hex').pipe(stdout);
```

```js [CJS]
const { createReadStream } = require('node:fs');
const { createHash } = require('node:crypto');
const { stdout } = require('node:process');

const hash = createHash('sha256');

const input = createReadStream('test.js');
input.pipe(hash).setEncoding('hex').pipe(stdout);
```
:::

Beispiel: Verwenden der Methoden [`hash.update()`](/de/nodejs/api/crypto#hashupdatedata-inputencoding) und [`hash.digest()`](/de/nodejs/api/crypto#hashdigestencoding):



::: code-group
```js [ESM]
const {
  createHash,
} = await import('node:crypto');

const hash = createHash('sha256');

hash.update('some data to hash');
console.log(hash.digest('hex'));
// Gibt aus:
//   6a2da20943931e9834fc12cfe5bb47bbd9ae43489a30726962b576f4e3993e50
```

```js [CJS]
const {
  createHash,
} = require('node:crypto');

const hash = createHash('sha256');

hash.update('some data to hash');
console.log(hash.digest('hex'));
// Gibt aus:
//   6a2da20943931e9834fc12cfe5bb47bbd9ae43489a30726962b576f4e3993e50
```
:::


### `hash.copy([options])` {#hashcopyoptions}

**Hinzugefügt in: v13.1.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.transform`-Optionen](/de/nodejs/api/stream#new-streamtransformoptions)
- Rückgabe: [\<Hash\>](/de/nodejs/api/crypto#class-hash)

Erstellt ein neues `Hash`-Objekt, das eine tiefe Kopie des internen Zustands des aktuellen `Hash`-Objekts enthält.

Das optionale Argument `options` steuert das Stream-Verhalten. Für XOF-Hash-Funktionen wie `'shake256'` kann die Option `outputLength` verwendet werden, um die gewünschte Ausgabelänge in Bytes anzugeben.

Ein Fehler wird ausgelöst, wenn versucht wird, das `Hash`-Objekt zu kopieren, nachdem seine [`hash.digest()`](/de/nodejs/api/crypto#hashdigestencoding)-Methode aufgerufen wurde.

::: code-group
```js [ESM]
// Berechnet einen Rolling Hash.
const {
  createHash,
} = await import('node:crypto');

const hash = createHash('sha256');

hash.update('one');
console.log(hash.copy().digest('hex'));

hash.update('two');
console.log(hash.copy().digest('hex'));

hash.update('three');
console.log(hash.copy().digest('hex'));

// Etc.
```

```js [CJS]
// Berechnet einen Rolling Hash.
const {
  createHash,
} = require('node:crypto');

const hash = createHash('sha256');

hash.update('one');
console.log(hash.copy().digest('hex'));

hash.update('two');
console.log(hash.copy().digest('hex'));

hash.update('three');
console.log(hash.copy().digest('hex'));

// Etc.
```
:::

### `hash.digest([encoding])` {#hashdigestencoding}

**Hinzugefügt in: v0.1.92**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die [Kodierung](/de/nodejs/api/buffer#buffers-and-character-encodings) des Rückgabewerts.
- Rückgabe: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Berechnet den Digest aller Daten, die zum Hashen übergeben wurden (mit der Methode [`hash.update()`](/de/nodejs/api/crypto#hashupdatedata-inputencoding)). Wenn `encoding` angegeben ist, wird eine Zeichenfolge zurückgegeben; andernfalls wird ein [`Buffer`](/de/nodejs/api/buffer) zurückgegeben.

Das `Hash`-Objekt kann nicht mehr verwendet werden, nachdem die Methode `hash.digest()` aufgerufen wurde. Mehrfache Aufrufe führen dazu, dass ein Fehler ausgelöst wird.


### `hash.update(data[, inputEncoding])` {#hashupdatedata-inputencoding}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v6.0.0 | Die Standardeinstellung für `inputEncoding` wurde von `binary` auf `utf8` geändert. |
| v0.1.92 | Hinzugefügt in: v0.1.92 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die [Kodierung](/de/nodejs/api/buffer#buffers-and-character-encodings) der `data`-Zeichenkette.

Aktualisiert den Hash-Inhalt mit den angegebenen `data`, dessen Kodierung in `inputEncoding` angegeben ist. Wenn `encoding` nicht angegeben ist und die `data` eine Zeichenkette ist, wird eine Kodierung von `'utf8'` erzwungen. Wenn `data` ein [`Buffer`](/de/nodejs/api/buffer), `TypedArray` oder `DataView` ist, wird `inputEncoding` ignoriert.

Dies kann mehrmals mit neuen Daten aufgerufen werden, da diese gestreamt werden.

## Klasse: `Hmac` {#class-hmac}

**Hinzugefügt in: v0.1.94**

- Erweitert: [\<stream.Transform\>](/de/nodejs/api/stream#class-streamtransform)

Die Klasse `Hmac` ist ein Hilfsmittel zum Erstellen kryptografischer HMAC-Digests. Sie kann auf zwei Arten verwendet werden:

- Als [Stream](/de/nodejs/api/stream), der sowohl lesbar als auch beschreibbar ist, wobei Daten geschrieben werden, um einen berechneten HMAC-Digest auf der lesbaren Seite zu erzeugen, oder
- Verwenden der Methoden [`hmac.update()`](/de/nodejs/api/crypto#hmacupdatedata-inputencoding) und [`hmac.digest()`](/de/nodejs/api/crypto#hmacdigestencoding) um den berechneten HMAC-Digest zu erzeugen.

Die Methode [`crypto.createHmac()`](/de/nodejs/api/crypto#cryptocreatehmacalgorithm-key-options) wird verwendet, um `Hmac`-Instanzen zu erstellen. `Hmac`-Objekte dürfen nicht direkt mit dem Schlüsselwort `new` erstellt werden.

Beispiel: Verwendung von `Hmac`-Objekten als Streams:



::: code-group
```js [ESM]
const {
  createHmac,
} = await import('node:crypto');

const hmac = createHmac('sha256', 'a secret');

hmac.on('readable', () => {
  // Nur ein Element wird vom
  // Hash-Stream erzeugt.
  const data = hmac.read();
  if (data) {
    console.log(data.toString('hex'));
    // Gibt aus:
    //   7fd04df92f636fd450bc841c9418e5825c17f33ad9c87c518115a45971f7f77e
  }
});

hmac.write('some data to hash');
hmac.end();
```

```js [CJS]
const {
  createHmac,
} = require('node:crypto');

const hmac = createHmac('sha256', 'a secret');

hmac.on('readable', () => {
  // Nur ein Element wird vom
  // Hash-Stream erzeugt.
  const data = hmac.read();
  if (data) {
    console.log(data.toString('hex'));
    // Gibt aus:
    //   7fd04df92f636fd450bc841c9418e5825c17f33ad9c87c518115a45971f7f77e
  }
});

hmac.write('some data to hash');
hmac.end();
```
:::

Beispiel: Verwendung von `Hmac` und verrohrten Streams:



::: code-group
```js [ESM]
import { createReadStream } from 'node:fs';
import { stdout } from 'node:process';
const {
  createHmac,
} = await import('node:crypto');

const hmac = createHmac('sha256', 'a secret');

const input = createReadStream('test.js');
input.pipe(hmac).pipe(stdout);
```

```js [CJS]
const {
  createReadStream,
} = require('node:fs');
const {
  createHmac,
} = require('node:crypto');
const { stdout } = require('node:process');

const hmac = createHmac('sha256', 'a secret');

const input = createReadStream('test.js');
input.pipe(hmac).pipe(stdout);
```
:::

Beispiel: Verwendung der Methoden [`hmac.update()`](/de/nodejs/api/crypto#hmacupdatedata-inputencoding) und [`hmac.digest()`](/de/nodejs/api/crypto#hmacdigestencoding):



::: code-group
```js [ESM]
const {
  createHmac,
} = await import('node:crypto');

const hmac = createHmac('sha256', 'a secret');

hmac.update('some data to hash');
console.log(hmac.digest('hex'));
// Gibt aus:
//   7fd04df92f636fd450bc841c9418e5825c17f33ad9c87c518115a45971f7f77e
```

```js [CJS]
const {
  createHmac,
} = require('node:crypto');

const hmac = createHmac('sha256', 'a secret');

hmac.update('some data to hash');
console.log(hmac.digest('hex'));
// Gibt aus:
//   7fd04df92f636fd450bc841c9418e5825c17f33ad9c87c518115a45971f7f77e
```
:::


### `hmac.digest([encoding])` {#hmacdigestencoding}

**Hinzugefügt in: v0.1.94**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die [Kodierung](/de/nodejs/api/buffer#buffers-and-character-encodings) des Rückgabewerts.
- Gibt zurück: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Berechnet den HMAC-Digest aller Daten, die mit [`hmac.update()`](/de/nodejs/api/crypto#hmacupdatedata-inputencoding) übergeben wurden. Wenn `encoding` angegeben ist, wird ein String zurückgegeben; andernfalls wird ein [`Buffer`](/de/nodejs/api/buffer) zurückgegeben.

Das `Hmac`-Objekt kann nicht mehr verwendet werden, nachdem `hmac.digest()` aufgerufen wurde. Mehrere Aufrufe von `hmac.digest()` führen dazu, dass ein Fehler ausgelöst wird.

### `hmac.update(data[, inputEncoding])` {#hmacupdatedata-inputencoding}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v6.0.0 | Die Standard `inputEncoding` wurde von `binary` zu `utf8` geändert. |
| v0.1.94 | Hinzugefügt in: v0.1.94 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die [Kodierung](/de/nodejs/api/buffer#buffers-and-character-encodings) des `data`-Strings.

Aktualisiert den `Hmac`-Inhalt mit den angegebenen `data`, dessen Kodierung in `inputEncoding` angegeben ist. Wenn `encoding` nicht angegeben ist und die `data` ein String ist, wird eine Kodierung von `'utf8'` erzwungen. Wenn `data` ein [`Buffer`](/de/nodejs/api/buffer), `TypedArray` oder `DataView` ist, wird `inputEncoding` ignoriert.

Dies kann mehrmals mit neuen Daten aufgerufen werden, während diese gestreamt werden.

## Klasse: `KeyObject` {#class-keyobject}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v14.5.0, v12.19.0 | Instanzen dieser Klasse können nun mit `postMessage` an Worker-Threads übergeben werden. |
| v11.13.0 | Diese Klasse wird jetzt exportiert. |
| v11.6.0 | Hinzugefügt in: v11.6.0 |
:::

Node.js verwendet eine `KeyObject`-Klasse, um einen symmetrischen oder asymmetrischen Schlüssel darzustellen, und jede Art von Schlüssel stellt verschiedene Funktionen bereit. Die Methoden [`crypto.createSecretKey()`](/de/nodejs/api/crypto#cryptocreatesecretkeykey-encoding), [`crypto.createPublicKey()`](/de/nodejs/api/crypto#cryptocreatepublickeykey) und [`crypto.createPrivateKey()`](/de/nodejs/api/crypto#cryptocreateprivatekeykey) werden verwendet, um `KeyObject`-Instanzen zu erstellen. `KeyObject`-Objekte dürfen nicht direkt mit dem Schlüsselwort `new` erstellt werden.

Die meisten Anwendungen sollten die neue `KeyObject`-API anstelle der Übergabe von Schlüsseln als Strings oder `Buffer`s aufgrund verbesserter Sicherheitsfunktionen in Betracht ziehen.

`KeyObject`-Instanzen können über [`postMessage()`](/de/nodejs/api/worker_threads#portpostmessagevalue-transferlist) an andere Threads übergeben werden. Der Empfänger erhält ein geklontes `KeyObject`, und das `KeyObject` muss nicht im Argument `transferList` aufgeführt werden.


### Statische Methode: `KeyObject.from(key)` {#static-method-keyobjectfromkey}

**Hinzugefügt in: v15.0.0**

- `key` [\<CryptoKey\>](/de/nodejs/api/webcrypto#class-cryptokey)
- Rückgabe: [\<KeyObject\>](/de/nodejs/api/crypto#class-keyobject)

Beispiel: Konvertieren einer `CryptoKey`-Instanz in ein `KeyObject`:

::: code-group
```js [ESM]
const { KeyObject } = await import('node:crypto');
const { subtle } = globalThis.crypto;

const key = await subtle.generateKey({
  name: 'HMAC',
  hash: 'SHA-256',
  length: 256,
}, true, ['sign', 'verify']);

const keyObject = KeyObject.from(key);
console.log(keyObject.symmetricKeySize);
// Gibt aus: 32 (Größe des symmetrischen Schlüssels in Bytes)
```

```js [CJS]
const { KeyObject } = require('node:crypto');
const { subtle } = globalThis.crypto;

(async function() {
  const key = await subtle.generateKey({
    name: 'HMAC',
    hash: 'SHA-256',
    length: 256,
  }, true, ['sign', 'verify']);

  const keyObject = KeyObject.from(key);
  console.log(keyObject.symmetricKeySize);
  // Gibt aus: 32 (Größe des symmetrischen Schlüssels in Bytes)
})();
```
:::

### `keyObject.asymmetricKeyDetails` {#keyobjectasymmetrickeydetails}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v16.9.0 | `RSASSA-PSS-params`-Sequenzparameter für RSA-PSS-Schlüssel freigeben. |
| v15.7.0 | Hinzugefügt in: v15.7.0 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `modulusLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Schlüsselgröße in Bits (RSA, DSA).
    - `publicExponent`: [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) Öffentlicher Exponent (RSA).
    - `hashAlgorithm`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Name des Message Digest (RSA-PSS).
    - `mgf1HashAlgorithm`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Name des Message Digest, der von MGF1 verwendet wird (RSA-PSS).
    - `saltLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Minimale Salt-Länge in Bytes (RSA-PSS).
    - `divisorLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Größe von `q` in Bits (DSA).
    - `namedCurve`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Name der Kurve (EC).

Diese Eigenschaft existiert nur bei asymmetrischen Schlüsseln. Abhängig vom Typ des Schlüssels enthält dieses Objekt Informationen über den Schlüssel. Keine der Informationen, die über diese Eigenschaft erhalten werden, kann verwendet werden, um einen Schlüssel eindeutig zu identifizieren oder die Sicherheit des Schlüssels zu gefährden.

Für RSA-PSS-Schlüssel werden die Eigenschaften `hashAlgorithm`, `mgf1HashAlgorithm` und `saltLength` gesetzt, wenn das Schlüsselmaterial eine `RSASSA-PSS-params`-Sequenz enthält.

Weitere Schlüsseldetails können über diese API mithilfe zusätzlicher Attribute verfügbar gemacht werden.


### `keyObject.asymmetricKeyType` {#keyobjectasymmetrickeytype}

::: info [History]
| Version | Changes |
| --- | --- |
| v13.9.0, v12.17.0 | Unterstützung für `'dh'` hinzugefügt. |
| v12.0.0 | Unterstützung für `'rsa-pss'` hinzugefügt. |
| v12.0.0 | Diese Eigenschaft gibt jetzt `undefined` für KeyObject-Instanzen von nicht erkanntem Typ zurück, anstatt abzubrechen. |
| v12.0.0 | Unterstützung für `'x25519'` und `'x448'` hinzugefügt. |
| v12.0.0 | Unterstützung für `'ed25519'` und `'ed448'` hinzugefügt. |
| v11.6.0 | Hinzugefügt in: v11.6.0 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Bei asymmetrischen Schlüsseln stellt diese Eigenschaft den Typ des Schlüssels dar. Unterstützte Schlüsseltypen sind:

- `'rsa'` (OID 1.2.840.113549.1.1.1)
- `'rsa-pss'` (OID 1.2.840.113549.1.1.10)
- `'dsa'` (OID 1.2.840.10040.4.1)
- `'ec'` (OID 1.2.840.10045.2.1)
- `'x25519'` (OID 1.3.101.110)
- `'x448'` (OID 1.3.101.111)
- `'ed25519'` (OID 1.3.101.112)
- `'ed448'` (OID 1.3.101.113)
- `'dh'` (OID 1.2.840.113549.1.3.1)

Diese Eigenschaft ist `undefined` für nicht erkannte `KeyObject`-Typen und symmetrische Schlüssel.

### `keyObject.equals(otherKeyObject)` {#keyobjectequalsotherkeyobject}

**Hinzugefügt in: v17.7.0, v16.15.0**

- `otherKeyObject`: [\<KeyObject\>](/de/nodejs/api/crypto#class-keyobject) Ein `KeyObject`, mit dem `keyObject` verglichen werden soll.
- Rückgabe: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Gibt `true` oder `false` zurück, je nachdem, ob die Schlüssel genau den gleichen Typ, Wert und Parameter haben. Diese Methode ist nicht [konstant zeitaufwendig](https://en.wikipedia.org/wiki/Timing_attack).

### `keyObject.export([options])` {#keyobjectexportoptions}

::: info [History]
| Version | Changes |
| --- | --- |
| v15.9.0 | Unterstützung für das Format `'jwk'` hinzugefügt. |
| v11.6.0 | Hinzugefügt in: v11.6.0 |
:::

- `options`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- Rückgabe: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Für symmetrische Schlüssel können die folgenden Codierungsoptionen verwendet werden:

- `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Muss `'buffer'` (Standard) oder `'jwk'` sein.

Für öffentliche Schlüssel können die folgenden Codierungsoptionen verwendet werden:

- `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Muss entweder `'pkcs1'` (nur RSA) oder `'spki'` sein.
- `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Muss `'pem'`, `'der'` oder `'jwk'` sein.

Für private Schlüssel können die folgenden Codierungsoptionen verwendet werden:

- `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Muss entweder `'pkcs1'` (nur RSA), `'pkcs8'` oder `'sec1'` (nur EC) sein.
- `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Muss `'pem'`, `'der'` oder `'jwk'` sein.
- `cipher`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Wenn angegeben, wird der private Schlüssel mit dem angegebenen `cipher` und `passphrase` unter Verwendung der PKCS#5 v2.0 passwortbasierten Verschlüsselung verschlüsselt.
- `passphrase`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) Die für die Verschlüsselung zu verwendende Passphrase, siehe `cipher`.

Der Ergebnistyp hängt vom ausgewählten Codierungsformat ab. Bei PEM ist das Ergebnis eine Zeichenfolge, bei DER ist es ein Puffer, der die als DER codierten Daten enthält, bei [JWK](https://tools.ietf.org/html/rfc7517) ist es ein Objekt.

Wenn das [JWK](https://tools.ietf.org/html/rfc7517)-Codierungsformat ausgewählt wurde, werden alle anderen Codierungsoptionen ignoriert.

Schlüssel vom Typ PKCS#1, SEC1 und PKCS#8 können durch eine Kombination der Optionen `cipher` und `format` verschlüsselt werden. Der PKCS#8 `type` kann mit jedem `format` verwendet werden, um jeden Schlüsselalgorithmus (RSA, EC oder DH) durch Angabe eines `cipher` zu verschlüsseln. PKCS#1 und SEC1 können nur durch Angabe eines `cipher` verschlüsselt werden, wenn das PEM `format` verwendet wird. Für maximale Kompatibilität verwenden Sie PKCS#8 für verschlüsselte private Schlüssel. Da PKCS#8 seinen eigenen Verschlüsselungsmechanismus definiert, wird die PEM-basierte Verschlüsselung beim Verschlüsseln eines PKCS#8-Schlüssels nicht unterstützt. Siehe [RFC 5208](https://www.rfc-editor.org/rfc/rfc5208.txt) für die PKCS#8-Verschlüsselung und [RFC 1421](https://www.rfc-editor.org/rfc/rfc1421.txt) für die PKCS#1- und SEC1-Verschlüsselung.


### `keyObject.symmetricKeySize` {#keyobjectsymmetrickeysize}

**Hinzugefügt in: v11.6.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Für geheime Schlüssel stellt diese Eigenschaft die Größe des Schlüssels in Byte dar. Diese Eigenschaft ist für asymmetrische Schlüssel `undefined`.

### `keyObject.toCryptoKey(algorithm, extractable, keyUsages)` {#keyobjecttocryptokeyalgorithm-extractable-keyusages}

**Hinzugefügt in: v23.0.0**

- `algorithm`: [\<AlgorithmIdentifier\>](/de/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaHashedImportParams\>](/de/nodejs/api/webcrypto#class-rsahashedimportparams) | [\<EcKeyImportParams\>](/de/nodejs/api/webcrypto#class-eckeyimportparams) | [\<HmacImportParams\>](/de/nodejs/api/webcrypto#class-hmacimportparams)

- `extractable`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `keyUsages`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Siehe [Key usages](/de/nodejs/api/webcrypto#cryptokeyusages).
- Gibt zurück: [\<CryptoKey\>](/de/nodejs/api/webcrypto#class-cryptokey)

Konvertiert eine `KeyObject`-Instanz in einen `CryptoKey`.

### `keyObject.type` {#keyobjecttype}

**Hinzugefügt in: v11.6.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Abhängig vom Typ dieses `KeyObject` ist diese Eigenschaft entweder `'secret'` für geheime (symmetrische) Schlüssel, `'public'` für öffentliche (asymmetrische) Schlüssel oder `'private'` für private (asymmetrische) Schlüssel.

## Klasse: `Sign` {#class-sign}

**Hinzugefügt in: v0.1.92**

- Erweitert: [\<stream.Writable\>](/de/nodejs/api/stream#class-streamwritable)

Die `Sign`-Klasse ist ein Hilfsmittel zum Erzeugen von Signaturen. Sie kann auf zwei Arten verwendet werden:

- Als beschreibbarer [Stream](/de/nodejs/api/stream), in den zu signierende Daten geschrieben werden und die [`sign.sign()`](/de/nodejs/api/crypto#signsignprivatekey-outputencoding)-Methode verwendet wird, um die Signatur zu erzeugen und zurückzugeben, oder
- Verwenden der Methoden [`sign.update()`](/de/nodejs/api/crypto#signupdatedata-inputencoding) und [`sign.sign()`](/de/nodejs/api/crypto#signsignprivatekey-outputencoding), um die Signatur zu erzeugen.

Die Methode [`crypto.createSign()`](/de/nodejs/api/crypto#cryptocreatesignalgorithm-options) wird verwendet, um `Sign`-Instanzen zu erstellen. Das Argument ist der String-Name der zu verwendenden Hash-Funktion. `Sign`-Objekte dürfen nicht direkt mit dem Schlüsselwort `new` erstellt werden.

Beispiel: Verwenden von `Sign`- und [`Verify`](/de/nodejs/api/crypto#class-verify)-Objekten als Streams:

::: code-group
```js [ESM]
const {
  generateKeyPairSync,
  createSign,
  createVerify,
} = await import('node:crypto');

const { privateKey, publicKey } = generateKeyPairSync('ec', {
  namedCurve: 'sect239k1',
});

const sign = createSign('SHA256');
sign.write('some data to sign');
sign.end();
const signature = sign.sign(privateKey, 'hex');

const verify = createVerify('SHA256');
verify.write('some data to sign');
verify.end();
console.log(verify.verify(publicKey, signature, 'hex'));
// Prints: true
```

```js [CJS]
const {
  generateKeyPairSync,
  createSign,
  createVerify,
} = require('node:crypto');

const { privateKey, publicKey } = generateKeyPairSync('ec', {
  namedCurve: 'sect239k1',
});

const sign = createSign('SHA256');
sign.write('some data to sign');
sign.end();
const signature = sign.sign(privateKey, 'hex');

const verify = createVerify('SHA256');
verify.write('some data to sign');
verify.end();
console.log(verify.verify(publicKey, signature, 'hex'));
// Prints: true
```
:::

Beispiel: Verwenden der Methoden [`sign.update()`](/de/nodejs/api/crypto#signupdatedata-inputencoding) und [`verify.update()`](/de/nodejs/api/crypto#verifyupdatedata-inputencoding):

::: code-group
```js [ESM]
const {
  generateKeyPairSync,
  createSign,
  createVerify,
} = await import('node:crypto');

const { privateKey, publicKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
});

const sign = createSign('SHA256');
sign.update('some data to sign');
sign.end();
const signature = sign.sign(privateKey);

const verify = createVerify('SHA256');
verify.update('some data to sign');
verify.end();
console.log(verify.verify(publicKey, signature));
// Prints: true
```

```js [CJS]
const {
  generateKeyPairSync,
  createSign,
  createVerify,
} = require('node:crypto');

const { privateKey, publicKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
});

const sign = createSign('SHA256');
sign.update('some data to sign');
sign.end();
const signature = sign.sign(privateKey);

const verify = createVerify('SHA256');
verify.update('some data to sign');
verify.end();
console.log(verify.verify(publicKey, signature));
// Prints: true
```
:::


### `sign.sign(privateKey[, outputEncoding])` {#signsignprivatekey-outputencoding}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v15.0.0 | Der privateKey kann auch ein ArrayBuffer und CryptoKey sein. |
| v13.2.0, v12.16.0 | Diese Funktion unterstützt jetzt IEEE-P1363 DSA- und ECDSA-Signaturen. |
| v12.0.0 | Diese Funktion unterstützt jetzt RSA-PSS-Schlüssel. |
| v11.6.0 | Diese Funktion unterstützt jetzt Schlüsselobjekte. |
| v8.0.0 | Unterstützung für RSASSA-PSS und zusätzliche Optionen wurde hinzugefügt. |
| v0.1.92 | Hinzugefügt in: v0.1.92 |
:::

- `privateKey` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/de/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/de/nodejs/api/webcrypto#class-cryptokey)
    - `dsaEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `padding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `saltLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)


- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die [Kodierung](/de/nodejs/api/buffer#buffers-and-character-encodings) des Rückgabewerts.
- Gibt zurück: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Berechnet die Signatur für alle Daten, die über [`sign.update()`](/de/nodejs/api/crypto#signupdatedata-inputencoding) oder [`sign.write()`](/de/nodejs/api/stream#writablewritechunk-encoding-callback) übertragen wurden.

Wenn `privateKey` kein [`KeyObject`](/de/nodejs/api/crypto#class-keyobject) ist, verhält sich diese Funktion so, als ob `privateKey` an [`crypto.createPrivateKey()`](/de/nodejs/api/crypto#cryptocreateprivatekeykey) übergeben worden wäre. Wenn es sich um ein Objekt handelt, können die folgenden zusätzlichen Eigenschaften übergeben werden:

-  `dsaEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Für DSA und ECDSA gibt diese Option das Format der generierten Signatur an. Es kann eines der folgenden sein:
    - `'der'` (Standard): DER-kodierte ASN.1-Signaturstruktur, die `(r, s)` kodiert.
    - `'ieee-p1363'`: Signaturformat `r || s` wie in IEEE-P1363 vorgeschlagen.


-  `padding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Optionaler Auffüllwert für RSA, einer der folgenden:
    - `crypto.constants.RSA_PKCS1_PADDING` (Standard)
    - `crypto.constants.RSA_PKCS1_PSS_PADDING`

`RSA_PKCS1_PSS_PADDING` verwendet MGF1 mit derselben Hash-Funktion, die zum Signieren der Nachricht verwendet wird, wie in Abschnitt 3.1 von [RFC 4055](https://www.rfc-editor.org/rfc/rfc4055.txt) angegeben, es sei denn, eine MGF1-Hash-Funktion wurde als Teil des Schlüssels in Übereinstimmung mit Abschnitt 3.3 von [RFC 4055](https://www.rfc-editor.org/rfc/rfc4055.txt) angegeben.
-  `saltLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Salz-Länge für den Fall, dass die Auffüllung `RSA_PKCS1_PSS_PADDING` ist. Der Sonderwert `crypto.constants.RSA_PSS_SALTLEN_DIGEST` setzt die Salz-Länge auf die Digest-Größe, `crypto.constants.RSA_PSS_SALTLEN_MAX_SIGN` (Standard) setzt sie auf den maximal zulässigen Wert.

Wenn `outputEncoding` angegeben ist, wird eine Zeichenkette zurückgegeben; andernfalls wird ein [`Buffer`](/de/nodejs/api/buffer) zurückgegeben.

Das `Sign`-Objekt kann nach dem Aufruf der Methode `sign.sign()` nicht mehr verwendet werden. Mehrfache Aufrufe von `sign.sign()` führen zu einem Fehler.


### `sign.update(data[, inputEncoding])` {#signupdatedata-inputencoding}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v6.0.0 | Die Standard `inputEncoding` wurde von `binary` zu `utf8` geändert. |
| v0.1.92 | Hinzugefügt in: v0.1.92 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die [Kodierung](/de/nodejs/api/buffer#buffers-and-character-encodings) der `data`-Zeichenkette.

Aktualisiert den `Sign`-Inhalt mit den gegebenen `data`, dessen Kodierung in `inputEncoding` angegeben ist. Wenn `encoding` nicht angegeben ist und die `data` eine Zeichenkette ist, wird eine Kodierung von `'utf8'` erzwungen. Wenn `data` ein [`Buffer`](/de/nodejs/api/buffer), `TypedArray` oder `DataView` ist, wird `inputEncoding` ignoriert.

Dies kann viele Male mit neuen Daten aufgerufen werden, während diese gestreamt werden.

## Klasse: `Verify` {#class-verify}

**Hinzugefügt in: v0.1.92**

- Erweitert: [\<stream.Writable\>](/de/nodejs/api/stream#class-streamwritable)

Die `Verify`-Klasse ist ein Hilfsmittel zum Verifizieren von Signaturen. Sie kann auf zwei Arten verwendet werden:

- Als beschreibbarer [Stream](/de/nodejs/api/stream), wobei geschriebene Daten verwendet werden, um gegen die bereitgestellte Signatur zu validieren, oder
- Mithilfe der Methoden [`verify.update()`](/de/nodejs/api/crypto#verifyupdatedata-inputencoding) und [`verify.verify()`](/de/nodejs/api/crypto#verifyverifyobject-signature-signatureencoding) zum Verifizieren der Signatur.

Die Methode [`crypto.createVerify()`](/de/nodejs/api/crypto#cryptocreateverifyalgorithm-options) wird verwendet, um `Verify`-Instanzen zu erstellen. `Verify`-Objekte dürfen nicht direkt mit dem Schlüsselwort `new` erstellt werden.

Siehe [`Sign`](/de/nodejs/api/crypto#class-sign) für Beispiele.

### `verify.update(data[, inputEncoding])` {#verifyupdatedata-inputencoding}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v6.0.0 | Die Standard `inputEncoding` wurde von `binary` zu `utf8` geändert. |
| v0.1.92 | Hinzugefügt in: v0.1.92 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die [Kodierung](/de/nodejs/api/buffer#buffers-and-character-encodings) der `data`-Zeichenkette.

Aktualisiert den `Verify`-Inhalt mit den gegebenen `data`, dessen Kodierung in `inputEncoding` angegeben ist. Wenn `inputEncoding` nicht angegeben ist und die `data` eine Zeichenkette ist, wird eine Kodierung von `'utf8'` erzwungen. Wenn `data` ein [`Buffer`](/de/nodejs/api/buffer), `TypedArray` oder `DataView` ist, wird `inputEncoding` ignoriert.

Dies kann viele Male mit neuen Daten aufgerufen werden, während diese gestreamt werden.


### `verify.verify(object, signature[, signatureEncoding])` {#verifyverifyobject-signature-signatureencoding}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v15.0.0 | Das Objekt kann auch ein ArrayBuffer und CryptoKey sein. |
| v13.2.0, v12.16.0 | Diese Funktion unterstützt jetzt IEEE-P1363 DSA- und ECDSA-Signaturen. |
| v12.0.0 | Diese Funktion unterstützt jetzt RSA-PSS-Schlüssel. |
| v11.7.0 | Der Schlüssel kann jetzt ein privater Schlüssel sein. |
| v8.0.0 | Unterstützung für RSASSA-PSS und zusätzliche Optionen wurde hinzugefügt. |
| v0.1.92 | Hinzugefügt in: v0.1.92 |
:::

- `object` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/de/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/de/nodejs/api/webcrypto#class-cryptokey)
    - `dsaEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `padding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `saltLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)


- `signature` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `signatureEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die [Kodierung](/de/nodejs/api/buffer#buffers-and-character-encodings) der `signature`-Zeichenkette.
- Rückgabe: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` oder `false` abhängig von der Gültigkeit der Signatur für die Daten und den öffentlichen Schlüssel.

Verifiziert die bereitgestellten Daten mit dem gegebenen `object` und der `signature`.

Wenn `object` kein [`KeyObject`](/de/nodejs/api/crypto#class-keyobject) ist, verhält sich diese Funktion so, als ob `object` an [`crypto.createPublicKey()`](/de/nodejs/api/crypto#cryptocreatepublickeykey) übergeben worden wäre. Wenn es sich um ein Objekt handelt, können die folgenden zusätzlichen Eigenschaften übergeben werden:

- `dsaEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Für DSA und ECDSA legt diese Option das Format der Signatur fest. Es kann eine der folgenden Optionen sein:
    - `'der'` (Standard): DER-kodierte ASN.1-Signaturstruktur, die `(r, s)` kodiert.
    - `'ieee-p1363'`: Signaturformat `r || s` wie in IEEE-P1363 vorgeschlagen.


- `padding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Optionaler Padding-Wert für RSA, einer der folgenden:
    - `crypto.constants.RSA_PKCS1_PADDING` (Standard)
    - `crypto.constants.RSA_PKCS1_PSS_PADDING`

`RSA_PKCS1_PSS_PADDING` verwendet MGF1 mit derselben Hash-Funktion, die zum Verifizieren der Nachricht verwendet wird, wie in Abschnitt 3.1 von [RFC 4055](https://www.rfc-editor.org/rfc/rfc4055.txt) spezifiziert, es sei denn, eine MGF1-Hash-Funktion wurde als Teil des Schlüssels in Übereinstimmung mit Abschnitt 3.3 von [RFC 4055](https://www.rfc-editor.org/rfc/rfc4055.txt) spezifiziert.
- `saltLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Salt-Länge für den Fall, dass Padding `RSA_PKCS1_PSS_PADDING` ist. Der spezielle Wert `crypto.constants.RSA_PSS_SALTLEN_DIGEST` setzt die Salt-Länge auf die Digest-Größe, `crypto.constants.RSA_PSS_SALTLEN_AUTO` (Standard) bewirkt, dass sie automatisch bestimmt wird.

Das `signature`-Argument ist die zuvor berechnete Signatur für die Daten, in der `signatureEncoding`. Wenn eine `signatureEncoding` angegeben ist, wird erwartet, dass die `signature` eine Zeichenkette ist; andernfalls wird erwartet, dass die `signature` ein [`Buffer`](/de/nodejs/api/buffer), `TypedArray` oder `DataView` ist.

Das `verify`-Objekt kann nach dem Aufruf von `verify.verify()` nicht mehr verwendet werden. Mehrfache Aufrufe von `verify.verify()` führen dazu, dass ein Fehler ausgelöst wird.

Da öffentliche Schlüssel von privaten Schlüsseln abgeleitet werden können, kann anstelle eines öffentlichen Schlüssels auch ein privater Schlüssel übergeben werden.


## Klasse: `X509Certificate` {#class-x509certificate}

**Hinzugefügt in: v15.6.0**

Kapselt ein X509-Zertifikat und bietet schreibgeschützten Zugriff auf dessen Informationen.

::: code-group
```js [ESM]
const { X509Certificate } = await import('node:crypto');

const x509 = new X509Certificate('{... pem encoded cert ...}');

console.log(x509.subject);
```

```js [CJS]
const { X509Certificate } = require('node:crypto');

const x509 = new X509Certificate('{... pem encoded cert ...}');

console.log(x509.subject);
```
:::

### `new X509Certificate(buffer)` {#new-x509certificatebuffer}

**Hinzugefügt in: v15.6.0**

- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Ein PEM- oder DER-kodiertes X509-Zertifikat.

### `x509.ca` {#x509ca}

**Hinzugefügt in: v15.6.0**

- Typ: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Ist `true`, wenn dies ein Zertifikat einer Zertifizierungsstelle (CA) ist.

### `x509.checkEmail(email[, options])` {#x509checkemailemail-options}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Die Subject-Option hat jetzt standardmäßig den Wert `'default'`. |
| v17.5.0, v16.15.0 | Die Subject-Option kann jetzt auf `'default'` gesetzt werden. |
| v17.5.0, v16.14.1 | Die Optionen `wildcards`, `partialWildcards`, `multiLabelWildcards` und `singleLabelSubdomains` wurden entfernt, da sie keine Wirkung hatten. |
| v15.6.0 | Hinzugefügt in: v15.6.0 |
:::

- `email` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `subject` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'default'`, `'always'` oder `'never'`. **Standard:** `'default'`.


- Gibt zurück: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Gibt `email` zurück, wenn das Zertifikat übereinstimmt, `undefined`, wenn es nicht übereinstimmt.

Prüft, ob das Zertifikat mit der angegebenen E-Mail-Adresse übereinstimmt.

Wenn die Option `'subject'` nicht definiert oder auf `'default'` gesetzt ist, wird der Zertifikatsbetreff nur berücksichtigt, wenn die Subject Alternative Name Extension entweder nicht existiert oder keine E-Mail-Adressen enthält.

Wenn die Option `'subject'` auf `'always'` gesetzt ist und die Subject Alternative Name Extension entweder nicht existiert oder keine übereinstimmende E-Mail-Adresse enthält, wird der Zertifikatsbetreff berücksichtigt.

Wenn die Option `'subject'` auf `'never'` gesetzt ist, wird der Zertifikatsbetreff niemals berücksichtigt, selbst wenn das Zertifikat keine Subject Alternative Names enthält.


### `x509.checkHost(name[, options])` {#x509checkhostname-options}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Die Option subject hat jetzt standardmäßig den Wert `'default'`. |
| v17.5.0, v16.15.0 | Die Option subject kann jetzt auf `'default'` gesetzt werden. |
| v15.6.0 | Hinzugefügt in: v15.6.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `subject` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'default'`, `'always'` oder `'never'`. **Standard:** `'default'`.
    - `wildcards` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Standard:** `true`.
    - `partialWildcards` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Standard:** `true`.
    - `multiLabelWildcards` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Standard:** `false`.
    - `singleLabelSubdomains` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Standard:** `false`.


- Gibt zurück: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Gibt einen Betreffnamen zurück, der mit `name` übereinstimmt, oder `undefined`, wenn kein Betreffname mit `name` übereinstimmt.

Überprüft, ob das Zertifikat mit dem angegebenen Hostnamen übereinstimmt.

Wenn das Zertifikat mit dem angegebenen Hostnamen übereinstimmt, wird der übereinstimmende Betreffname zurückgegeben. Der zurückgegebene Name kann eine exakte Übereinstimmung sein (z. B. `foo.example.com`) oder er kann Platzhalter enthalten (z. B. `*.example.com`). Da Hostnamenvergleiche nicht zwischen Groß- und Kleinschreibung unterscheiden, kann sich der zurückgegebene Betreffname auch in der Groß-/Kleinschreibung von dem angegebenen `name` unterscheiden.

Wenn die Option `'subject'` nicht definiert oder auf `'default'` gesetzt ist, wird der Zertifikatbetreff nur dann berücksichtigt, wenn die Subject Alternative Name Extension entweder nicht vorhanden ist oder keine DNS-Namen enthält. Dieses Verhalten stimmt mit [RFC 2818](https://www.rfc-editor.org/rfc/rfc2818.txt) ("HTTP Over TLS") überein.

Wenn die Option `'subject'` auf `'always'` gesetzt ist und die Subject Alternative Name Extension entweder nicht vorhanden ist oder keinen übereinstimmenden DNS-Namen enthält, wird der Zertifikatbetreff berücksichtigt.

Wenn die Option `'subject'` auf `'never'` gesetzt ist, wird der Zertifikatbetreff niemals berücksichtigt, selbst wenn das Zertifikat keine Subject Alternative Names enthält.


### `x509.checkIP(ip)` {#x509checkipip}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v17.5.0, v16.14.1 | Das `options` Argument wurde entfernt, da es keine Wirkung hatte. |
| v15.6.0 | Hinzugefügt in: v15.6.0 |
:::

- `ip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Gibt zurück: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Gibt `ip` zurück, wenn das Zertifikat übereinstimmt, `undefined`, wenn dies nicht der Fall ist.

Prüft, ob das Zertifikat mit der angegebenen IP-Adresse (IPv4 oder IPv6) übereinstimmt.

Es werden nur [RFC 5280](https://www.rfc-editor.org/rfc/rfc5280.txt) `iPAddress` Subject Alternative Names berücksichtigt, und diese müssen exakt mit der angegebenen `ip`-Adresse übereinstimmen. Andere Subject Alternative Names sowie das Subject-Feld des Zertifikats werden ignoriert.

### `x509.checkIssued(otherCert)` {#x509checkissuedothercert}

**Hinzugefügt in: v15.6.0**

- `otherCert` [\<X509Certificate\>](/de/nodejs/api/crypto#class-x509certificate)
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Prüft, ob dieses Zertifikat von dem angegebenen `otherCert` ausgestellt wurde.

### `x509.checkPrivateKey(privateKey)` {#x509checkprivatekeyprivatekey}

**Hinzugefügt in: v15.6.0**

- `privateKey` [\<KeyObject\>](/de/nodejs/api/crypto#class-keyobject) Ein privater Schlüssel.
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Prüft, ob der öffentliche Schlüssel für dieses Zertifikat mit dem angegebenen privaten Schlüssel übereinstimmt.

### `x509.extKeyUsage` {#x509extkeyusage}

**Hinzugefügt in: v15.6.0**

- Typ: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Ein Array, das die erweiterten Schlüsselverwendungen für dieses Zertifikat detailliert beschreibt.

### `x509.fingerprint` {#x509fingerprint}

**Hinzugefügt in: v15.6.0**

- Typ: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Der SHA-1-Fingerabdruck dieses Zertifikats.

Da SHA-1 kryptografisch gebrochen ist und die Sicherheit von SHA-1 deutlich schlechter ist als die von Algorithmen, die üblicherweise zum Signieren von Zertifikaten verwendet werden, sollte stattdessen [`x509.fingerprint256`](/de/nodejs/api/crypto#x509fingerprint256) verwendet werden.


### `x509.fingerprint256` {#x509fingerprint256}

**Hinzugefügt in: v15.6.0**

- Typ: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Der SHA-256-Fingerabdruck dieses Zertifikats.

### `x509.fingerprint512` {#x509fingerprint512}

**Hinzugefügt in: v17.2.0, v16.14.0**

- Typ: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Der SHA-512-Fingerabdruck dieses Zertifikats.

Da die Berechnung des SHA-256-Fingerabdrucks in der Regel schneller ist und er nur halb so groß ist wie der SHA-512-Fingerabdruck, ist [`x509.fingerprint256`](/de/nodejs/api/crypto#x509fingerprint256) möglicherweise die bessere Wahl. Während SHA-512 vermutlich im Allgemeinen ein höheres Maß an Sicherheit bietet, entspricht die Sicherheit von SHA-256 der der meisten Algorithmen, die üblicherweise zum Signieren von Zertifikaten verwendet werden.

### `x509.infoAccess` {#x509infoaccess}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v17.3.1, v16.13.2 | Teile dieser Zeichenkette können als JSON-Stringliterale als Reaktion auf CVE-2021-44532 kodiert werden. |
| v15.6.0 | Hinzugefügt in: v15.6.0 |
:::

- Typ: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Eine textuelle Darstellung der Authority Information Access Extension des Zertifikats.

Dies ist eine durch Zeilenumbrüche getrennte Liste von Zugriffsbeschreibungen. Jede Zeile beginnt mit der Zugriffsmethode und der Art des Zugriffsorts, gefolgt von einem Doppelpunkt und dem Wert, der dem Zugriffsort zugeordnet ist.

Nach dem Präfix, das die Zugriffsmethode und die Art des Zugriffsorts angibt, kann der Rest jeder Zeile in Anführungszeichen eingeschlossen sein, um anzuzeigen, dass der Wert ein JSON-Stringliteral ist. Aus Gründen der Abwärtskompatibilität verwendet Node.js JSON-Stringliterale innerhalb dieser Eigenschaft nur, wenn dies erforderlich ist, um Mehrdeutigkeiten zu vermeiden. Drittanbieter-Code sollte darauf vorbereitet sein, beide möglichen Eintragsformate zu verarbeiten.

### `x509.issuer` {#x509issuer}

**Hinzugefügt in: v15.6.0**

- Typ: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Die in diesem Zertifikat enthaltene Ausstellerkennung.


### `x509.issuerCertificate` {#x509issuercertificate}

**Hinzugefügt in: v15.9.0**

- Typ: [\<X509Certificate\>](/de/nodejs/api/crypto#class-x509certificate)

Das Ausstellerzertifikat oder `undefined`, wenn das Ausstellerzertifikat nicht verfügbar ist.

### `x509.publicKey` {#x509publickey}

**Hinzugefügt in: v15.6.0**

- Typ: [\<KeyObject\>](/de/nodejs/api/crypto#class-keyobject)

Der öffentliche Schlüssel [\<KeyObject\>](/de/nodejs/api/crypto#class-keyobject) für dieses Zertifikat.

### `x509.raw` {#x509raw}

**Hinzugefügt in: v15.6.0**

- Typ: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)

Ein `Buffer` mit der DER-Kodierung dieses Zertifikats.

### `x509.serialNumber` {#x509serialnumber}

**Hinzugefügt in: v15.6.0**

- Typ: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Die Seriennummer dieses Zertifikats.

Seriennummern werden von Zertifizierungsstellen vergeben und identifizieren Zertifikate nicht eindeutig. Erwägen Sie stattdessen die Verwendung von [`x509.fingerprint256`](/de/nodejs/api/crypto#x509fingerprint256) als eindeutige Kennung.

### `x509.subject` {#x509subject}

**Hinzugefügt in: v15.6.0**

- Typ: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Der vollständige Betreff dieses Zertifikats.

### `x509.subjectAltName` {#x509subjectaltname}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v17.3.1, v16.13.2 | Teile dieser Zeichenkette können als JSON-String-Literale als Reaktion auf CVE-2021-44532 kodiert sein. |
| v15.6.0 | Hinzugefügt in: v15.6.0 |
:::

- Typ: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Der für dieses Zertifikat angegebene alternative Antragstellername.

Dies ist eine kommagetrennte Liste alternativer Antragstellernamen. Jeder Eintrag beginnt mit einer Zeichenkette, die die Art des alternativen Antragstellernamens identifiziert, gefolgt von einem Doppelpunkt und dem Wert, der dem Eintrag zugeordnet ist.

Frühere Versionen von Node.js nahmen fälschlicherweise an, dass es sicher ist, diese Eigenschaft an der zweistelligen Sequenz `', '` zu teilen (siehe [CVE-2021-44532](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-44532)). Sowohl bösartige als auch legitime Zertifikate können jedoch alternative Antragstellernamen enthalten, die diese Sequenz enthalten, wenn sie als Zeichenkette dargestellt werden.

Nach dem Präfix, das den Typ des Eintrags angibt, kann der Rest jedes Eintrags in Anführungszeichen gesetzt werden, um anzuzeigen, dass der Wert ein JSON-String-Literal ist. Aus Gründen der Abwärtskompatibilität verwendet Node.js JSON-String-Literale innerhalb dieser Eigenschaft nur, wenn dies zur Vermeidung von Mehrdeutigkeiten erforderlich ist. Drittanbieter-Code sollte darauf vorbereitet sein, beide möglichen Eintragsformate zu verarbeiten.


### `x509.toJSON()` {#x509tojson}

**Hinzugefügt in: v15.6.0**

- Typ: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Es gibt keine Standard-JSON-Kodierung für X509-Zertifikate. Die `toJSON()`-Methode gibt eine Zeichenfolge zurück, die das PEM-kodierte Zertifikat enthält.

### `x509.toLegacyObject()` {#x509tolegacyobject}

**Hinzugefügt in: v15.6.0**

- Typ: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Gibt Informationen über dieses Zertifikat mithilfe der Legacy-Kodierung des [Zertifikatobjekts](/de/nodejs/api/tls#certificate-object) zurück.

### `x509.toString()` {#x509tostring}

**Hinzugefügt in: v15.6.0**

- Typ: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Gibt das PEM-kodierte Zertifikat zurück.

### `x509.validFrom` {#x509validfrom}

**Hinzugefügt in: v15.6.0**

- Typ: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Das Datum/die Uhrzeit, ab dem/der dieses Zertifikat gültig ist.

### `x509.validFromDate` {#x509validfromdate}

**Hinzugefügt in: v23.0.0**

- Typ: [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

Das Datum/die Uhrzeit, ab dem/der dieses Zertifikat gültig ist, gekapselt in einem `Date`-Objekt.

### `x509.validTo` {#x509validto}

**Hinzugefügt in: v15.6.0**

- Typ: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Das Datum/die Uhrzeit, bis zu dem/der dieses Zertifikat gültig ist.

### `x509.validToDate` {#x509validtodate}

**Hinzugefügt in: v23.0.0**

- Typ: [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

Das Datum/die Uhrzeit, bis zu dem/der dieses Zertifikat gültig ist, gekapselt in einem `Date`-Objekt.

### `x509.verify(publicKey)` {#x509verifypublickey}

**Hinzugefügt in: v15.6.0**

- `publicKey` [\<KeyObject\>](/de/nodejs/api/crypto#class-keyobject) Ein öffentlicher Schlüssel.
- Rückgabe: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Überprüft, ob dieses Zertifikat mit dem angegebenen öffentlichen Schlüssel signiert wurde. Führt keine weiteren Validierungsprüfungen am Zertifikat durch.


## `node:crypto` Modulmethoden und -eigenschaften {#nodecrypto-module-methods-and-properties}

### `crypto.checkPrime(candidate[, options], callback)` {#cryptocheckprimecandidate-options-callback}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Die Übergabe eines ungültigen Callbacks an das `callback`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v15.8.0 | Hinzugefügt in: v15.8.0 |
:::

- `candidate` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) Eine mögliche Primzahl, die als Sequenz von Big-Endian-Oktetten beliebiger Länge kodiert ist.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `checks` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der durchzuführenden Miller-Rabin-Probabilistik-Primzahltests. Wenn der Wert `0` (Null) ist, wird eine Anzahl von Überprüfungen verwendet, die eine Falsch-Positiv-Rate von höchstens 2 für zufällige Eingaben ergibt. Bei der Auswahl einer Anzahl von Überprüfungen ist Vorsicht geboten. Weitere Informationen finden Sie in der OpenSSL-Dokumentation für die [`BN_is_prime_ex`](https://www.openssl.org/docs/man1.1.1/man3/BN_is_prime_ex)-Funktion `nchecks`-Optionen. **Standard:** `0`
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Wird auf ein [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)-Objekt gesetzt, wenn während der Überprüfung ein Fehler aufgetreten ist.
    - `result` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, wenn der Kandidat eine Primzahl mit einer Fehlerwahrscheinlichkeit von weniger als `0.25 ** options.checks` ist.
  
 

Überprüft die Primalität des `candidate`.


### `crypto.checkPrimeSync(candidate[, options])` {#cryptocheckprimesynccandidate-options}

**Hinzugefügt in: v15.8.0**

- `candidate` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) Eine mögliche Primzahl, die als eine Sequenz von Big-Endian-Oktetten beliebiger Länge kodiert ist.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `checks` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der durchzuführenden probabilistischen Miller-Rabin-Primzahltests. Wenn der Wert `0` (Null) ist, wird eine Anzahl von Überprüfungen verwendet, die für zufällige Eingaben eine Falsch-Positiv-Rate von höchstens 2 ergibt. Bei der Auswahl einer Anzahl von Überprüfungen ist Vorsicht geboten. Weitere Einzelheiten finden Sie in der OpenSSL-Dokumentation für die Option `nchecks` der Funktion [`BN_is_prime_ex`](https://www.openssl.org/docs/man1.1.1/man3/BN_is_prime_ex). **Standard:** `0`
  
 
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, wenn der Kandidat eine Primzahl mit einer Fehlerwahrscheinlichkeit von weniger als `0.25 ** options.checks` ist.

Überprüft die Primzahleigenschaft des `candidate`.

### `crypto.constants` {#cryptoconstants}

**Hinzugefügt in: v6.3.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Ein Objekt, das häufig verwendete Konstanten für Krypto- und sicherheitsbezogene Operationen enthält. Die spezifischen aktuell definierten Konstanten werden in [Crypto-Konstanten](/de/nodejs/api/crypto#crypto-constants) beschrieben.


### `crypto.createCipheriv(algorithm, key, iv[, options])` {#cryptocreatecipherivalgorithm-key-iv-options}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v17.9.0, v16.17.0 | Die Option `authTagLength` ist jetzt optional, wenn der Cipher `chacha20-poly1305` verwendet wird, und hat standardmäßig eine Länge von 16 Bytes. |
| v15.0.0 | Die Argumente `password` und `iv` können ein ArrayBuffer sein und sind jeweils auf maximal 2 ** 31 - 1 Bytes begrenzt. |
| v11.6.0 | Das Argument `key` kann jetzt ein `KeyObject` sein. |
| v11.2.0, v10.17.0 | Der Cipher `chacha20-poly1305` (die IETF-Variante von ChaCha20-Poly1305) wird jetzt unterstützt. |
| v10.10.0 | Cipher im OCB-Modus werden jetzt unterstützt. |
| v10.2.0 | Die Option `authTagLength` kann jetzt verwendet werden, um kürzere Authentifizierungs-Tags im GCM-Modus zu erzeugen, und hat standardmäßig eine Länge von 16 Bytes. |
| v9.9.0 | Der Parameter `iv` kann jetzt `null` sein für Cipher, die keinen Initialisierungsvektor benötigen. |
| v0.1.94 | Hinzugefügt in: v0.1.94 |
:::

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/de/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/de/nodejs/api/webcrypto#class-cryptokey)
- `iv` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.transform` options](/de/nodejs/api/stream#new-streamtransformoptions)
- Gibt zurück: [\<Cipher\>](/de/nodejs/api/crypto#class-cipher)

Erstellt und gibt ein `Cipher`-Objekt mit dem angegebenen `algorithm`, `key` und Initialisierungsvektor (`iv`) zurück.

Das Argument `options` steuert das Stream-Verhalten und ist optional, außer wenn ein Cipher im CCM- oder OCB-Modus verwendet wird (z. B. `'aes-128-ccm'`). In diesem Fall ist die Option `authTagLength` erforderlich und gibt die Länge des Authentifizierungs-Tags in Bytes an, siehe [CCM-Modus](/de/nodejs/api/crypto#ccm-mode). Im GCM-Modus ist die Option `authTagLength` nicht erforderlich, kann aber verwendet werden, um die Länge des Authentifizierungs-Tags festzulegen, das von `getAuthTag()` zurückgegeben wird, und hat standardmäßig eine Länge von 16 Bytes. Für `chacha20-poly1305` hat die Option `authTagLength` standardmäßig eine Länge von 16 Bytes.

Der `algorithm` ist von OpenSSL abhängig, Beispiele sind `'aes192'` usw. Bei neueren OpenSSL-Versionen zeigt `openssl list -cipher-algorithms` die verfügbaren Cipher-Algorithmen an.

Der `key` ist der Rohschlüssel, der vom `algorithm` verwendet wird, und `iv` ist ein [Initialisierungsvektor](https://en.wikipedia.org/wiki/Initialization_vector). Beide Argumente müssen `'utf8'`-kodierte Strings, [Buffers](/de/nodejs/api/buffer), `TypedArray` oder `DataView`s sein. Der `key` kann optional ein [`KeyObject`](/de/nodejs/api/crypto#class-keyobject) vom Typ `secret` sein. Wenn der Cipher keinen Initialisierungsvektor benötigt, kann `iv` `null` sein.

Wenn Strings für `key` oder `iv` übergeben werden, beachten Sie bitte [Hinweise zur Verwendung von Strings als Eingaben für kryptografische APIs](/de/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis).

Initialisierungsvektoren sollten unvorhersehbar und eindeutig sein; idealerweise sind sie kryptografisch zufällig. Sie müssen nicht geheim sein: IVs werden typischerweise einfach unverschlüsselt zu Chiffretext-Nachrichten hinzugefügt. Es mag widersprüchlich klingen, dass etwas unvorhersehbar und eindeutig sein muss, aber nicht geheim sein muss; denken Sie daran, dass ein Angreifer nicht in der Lage sein darf, im Voraus vorherzusagen, wie ein bestimmter IV aussehen wird.


### `crypto.createDecipheriv(algorithm, key, iv[, options])` {#cryptocreatedecipherivalgorithm-key-iv-options}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v17.9.0, v16.17.0 | Die Option `authTagLength` ist jetzt optional, wenn der Cipher `chacha20-poly1305` verwendet wird und standardmäßig 16 Byte beträgt. |
| v11.6.0 | Das Argument `key` kann jetzt ein `KeyObject` sein. |
| v11.2.0, v10.17.0 | Der Cipher `chacha20-poly1305` (die IETF-Variante von ChaCha20-Poly1305) wird jetzt unterstützt. |
| v10.10.0 | Cipher im OCB-Modus werden jetzt unterstützt. |
| v10.2.0 | Die Option `authTagLength` kann jetzt verwendet werden, um akzeptierte GCM-Authentifizierungstag-Längen zu beschränken. |
| v9.9.0 | Der Parameter `iv` kann jetzt `null` sein für Cipher, die keinen Initialisierungsvektor benötigen. |
| v0.1.94 | Hinzugefügt in: v0.1.94 |
:::

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/de/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/de/nodejs/api/webcrypto#class-cryptokey)
- `iv` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.transform`-Optionen](/de/nodejs/api/stream#new-streamtransformoptions)
- Rückgabe: [\<Decipher\>](/de/nodejs/api/crypto#class-decipher)

Erstellt ein `Decipher`-Objekt, das den angegebenen `algorithm`, `key` und Initialisierungsvektor (`iv`) verwendet, und gibt es zurück.

Das Argument `options` steuert das Stream-Verhalten und ist optional, außer wenn ein Cipher im CCM- oder OCB-Modus (z. B. `'aes-128-ccm'`) verwendet wird. In diesem Fall ist die Option `authTagLength` erforderlich und gibt die Länge des Authentifizierungstags in Byte an, siehe [CCM-Modus](/de/nodejs/api/crypto#ccm-mode). Für AES-GCM und `chacha20-poly1305` ist die Option `authTagLength` standardmäßig 16 Byte und muss auf einen anderen Wert gesetzt werden, wenn eine andere Länge verwendet wird.

Der `algorithm` ist von OpenSSL abhängig, Beispiele sind `'aes192'`, usw. Bei neueren OpenSSL-Releases zeigt `openssl list -cipher-algorithms` die verfügbaren Cipher-Algorithmen an.

Der `key` ist der vom `algorithm` verwendete Rohschlüssel und `iv` ist ein [Initialisierungsvektor](https://en.wikipedia.org/wiki/Initialization_vector). Beide Argumente müssen `'utf8'`-kodierte Strings, [Buffers](/de/nodejs/api/buffer), `TypedArray`s oder `DataView`s sein. Der `key` kann optional ein [`KeyObject`](/de/nodejs/api/crypto#class-keyobject) vom Typ `secret` sein. Wenn der Cipher keinen Initialisierungsvektor benötigt, kann `iv` `null` sein.

Wenn Strings für `key` oder `iv` übergeben werden, beachten Sie bitte die [Vorbehalte bei der Verwendung von Strings als Eingaben für kryptografische APIs](/de/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis).

Initialisierungsvektoren sollten unvorhersehbar und einzigartig sein; idealerweise sind sie kryptografisch zufällig. Sie müssen nicht geheim sein: IVs werden typischerweise einfach unverschlüsselt zu Ciphertext-Nachrichten hinzugefügt. Es mag widersprüchlich klingen, dass etwas unvorhersehbar und einzigartig sein muss, aber nicht geheim sein muss; denken Sie daran, dass ein Angreifer nicht in der Lage sein darf, im Voraus vorherzusagen, wie ein bestimmter IV aussehen wird.


### `crypto.createDiffieHellman(prime[, primeEncoding][, generator][, generatorEncoding])` {#cryptocreatediffiehellmanprime-primeencoding-generator-generatorencoding}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v8.0.0 | Das Argument `prime` kann jetzt ein beliebiges `TypedArray` oder `DataView` sein. |
| v8.0.0 | Das Argument `prime` kann jetzt ein `Uint8Array` sein. |
| v6.0.0 | Der Standardwert für die Encoding-Parameter hat sich von `binary` zu `utf8` geändert. |
| v0.11.12 | Hinzugefügt in: v0.11.12 |
:::

- `prime` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `primeEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Das [Encoding](/de/nodejs/api/buffer#buffers-and-character-encodings) der `prime`-Zeichenkette.
- `generator` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) **Standard:** `2`
- `generatorEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Das [Encoding](/de/nodejs/api/buffer#buffers-and-character-encodings) der `generator`-Zeichenkette.
- Gibt zurück: [\<DiffieHellman\>](/de/nodejs/api/crypto#class-diffiehellman)

Erstellt ein `DiffieHellman`-Schlüsselaustauschobjekt unter Verwendung der angegebenen `prime` und einem optionalen spezifischen `generator`.

Das Argument `generator` kann eine Zahl, eine Zeichenkette oder ein [`Buffer`](/de/nodejs/api/buffer) sein. Wenn `generator` nicht angegeben wird, wird der Wert `2` verwendet.

Wenn `primeEncoding` angegeben ist, wird erwartet, dass `prime` eine Zeichenkette ist; andernfalls wird ein [`Buffer`](/de/nodejs/api/buffer), `TypedArray` oder `DataView` erwartet.

Wenn `generatorEncoding` angegeben ist, wird erwartet, dass `generator` eine Zeichenkette ist; andernfalls wird eine Zahl, ein [`Buffer`](/de/nodejs/api/buffer), `TypedArray` oder `DataView` erwartet.


### `crypto.createDiffieHellman(primeLength[, generator])` {#cryptocreatediffiehellmanprimelength-generator}

**Hinzugefügt in: v0.5.0**

- `primeLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `generator` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standard:** `2`
- Gibt zurück: [\<DiffieHellman\>](/de/nodejs/api/crypto#class-diffiehellman)

Erstellt ein `DiffieHellman`-Key-Exchange-Objekt und generiert eine Primzahl von `primeLength`-Bits unter Verwendung eines optionalen numerischen `generator`. Wenn `generator` nicht angegeben ist, wird der Wert `2` verwendet.

### `crypto.createDiffieHellmanGroup(name)` {#cryptocreatediffiehellmangroupname}

**Hinzugefügt in: v0.9.3**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Gibt zurück: [\<DiffieHellmanGroup\>](/de/nodejs/api/crypto#class-diffiehellmangroup)

Ein Alias für [`crypto.getDiffieHellman()`](/de/nodejs/api/crypto#cryptogetdiffiehellmangroupname)

### `crypto.createECDH(curveName)` {#cryptocreateecdhcurvename}

**Hinzugefügt in: v0.11.14**

- `curveName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Gibt zurück: [\<ECDH\>](/de/nodejs/api/crypto#class-ecdh)

Erstellt ein Elliptic Curve Diffie-Hellman (`ECDH`)-Key-Exchange-Objekt unter Verwendung einer vordefinierten Kurve, die durch die `curveName`-Zeichenkette angegeben wird. Verwenden Sie [`crypto.getCurves()`](/de/nodejs/api/crypto#cryptogetcurves), um eine Liste der verfügbaren Kurvennamen zu erhalten. Bei neueren OpenSSL-Versionen zeigt `openssl ecparam -list_curves` auch den Namen und die Beschreibung jeder verfügbaren elliptischen Kurve an.

### `crypto.createHash(algorithm[, options])` {#cryptocreatehashalgorithm-options}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v12.8.0 | Die Option `outputLength` wurde für XOF-Hashfunktionen hinzugefügt. |
| v0.1.92 | Hinzugefügt in: v0.1.92 |
:::

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.transform` options](/de/nodejs/api/stream#new-streamtransformoptions)
- Gibt zurück: [\<Hash\>](/de/nodejs/api/crypto#class-hash)

Erstellt und gibt ein `Hash`-Objekt zurück, das verwendet werden kann, um Hash-Digests mit dem angegebenen `algorithm` zu generieren. Das optionale Argument `options` steuert das Stream-Verhalten. Für XOF-Hashfunktionen wie `'shake256'` kann die Option `outputLength` verwendet werden, um die gewünschte Ausgabelänge in Bytes anzugeben.

Der `algorithm` ist abhängig von den verfügbaren Algorithmen, die von der OpenSSL-Version auf der Plattform unterstützt werden. Beispiele sind `'sha256'`, `'sha512'` usw. Bei neueren Versionen von OpenSSL zeigt `openssl list -digest-algorithms` die verfügbaren Digest-Algorithmen an.

Beispiel: Generieren der sha256-Summe einer Datei

::: code-group
```js [ESM]
import {
  createReadStream,
} from 'node:fs';
import { argv } from 'node:process';
const {
  createHash,
} = await import('node:crypto');

const filename = argv[2];

const hash = createHash('sha256');

const input = createReadStream(filename);
input.on('readable', () => {
  // Only one element is going to be produced by the
  // hash stream.
  const data = input.read();
  if (data)
    hash.update(data);
  else {
    console.log(`${hash.digest('hex')} ${filename}`);
  }
});
```

```js [CJS]
const {
  createReadStream,
} = require('node:fs');
const {
  createHash,
} = require('node:crypto');
const { argv } = require('node:process');

const filename = argv[2];

const hash = createHash('sha256');

const input = createReadStream(filename);
input.on('readable', () => {
  // Only one element is going to be produced by the
  // hash stream.
  const data = input.read();
  if (data)
    hash.update(data);
  else {
    console.log(`${hash.digest('hex')} ${filename}`);
  }
});
```
:::


### `crypto.createHmac(algorithm, key[, options])` {#cryptocreatehmacalgorithm-key-options}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v15.0.0 | Der Schlüssel kann auch ein ArrayBuffer oder CryptoKey sein. Die Encoding-Option wurde hinzugefügt. Der Schlüssel darf nicht mehr als 2 ** 32 - 1 Bytes enthalten. |
| v11.6.0 | Das `key`-Argument kann jetzt ein `KeyObject` sein. |
| v0.1.94 | Hinzugefügt in: v0.1.94 |
:::

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/de/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/de/nodejs/api/webcrypto#class-cryptokey)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.transform`-Optionen](/de/nodejs/api/stream#new-streamtransformoptions)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die zu verwendende String-Kodierung, wenn `key` ein String ist.

- Gibt zurück: [\<Hmac\>](/de/nodejs/api/crypto#class-hmac)

Erstellt und gibt ein `Hmac`-Objekt zurück, das den gegebenen `algorithm` und `key` verwendet. Das optionale `options`-Argument steuert das Stream-Verhalten.

Der `algorithm` hängt von den verfügbaren Algorithmen ab, die von der OpenSSL-Version auf der Plattform unterstützt werden. Beispiele sind `'sha256'`, `'sha512'` usw. In neueren Versionen von OpenSSL zeigt `openssl list -digest-algorithms` die verfügbaren Digest-Algorithmen an.

Der `key` ist der HMAC-Schlüssel, der zum Generieren des kryptografischen HMAC-Hashs verwendet wird. Wenn es sich um ein [`KeyObject`](/de/nodejs/api/crypto#class-keyobject) handelt, muss sein Typ `secret` sein. Wenn es sich um einen String handelt, beachten Sie bitte die [Vorbehalte bei der Verwendung von Strings als Eingaben für kryptografische APIs](/de/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis). Wenn er aus einer kryptografisch sicheren Entropiequelle wie [`crypto.randomBytes()`](/de/nodejs/api/crypto#cryptorandombytessize-callback) oder [`crypto.generateKey()`](/de/nodejs/api/crypto#cryptogeneratekeytype-options-callback) stammt, sollte seine Länge die Blockgröße von `algorithm` nicht überschreiten (z. B. 512 Bit für SHA-256).

Beispiel: Generieren des sha256-HMAC einer Datei

::: code-group
```js [ESM]
import {
  createReadStream,
} from 'node:fs';
import { argv } from 'node:process';
const {
  createHmac,
} = await import('node:crypto');

const filename = argv[2];

const hmac = createHmac('sha256', 'a secret');

const input = createReadStream(filename);
input.on('readable', () => {
  // Only one element is going to be produced by the
  // hash stream.
  const data = input.read();
  if (data)
    hmac.update(data);
  else {
    console.log(`${hmac.digest('hex')} ${filename}`);
  }
});
```

```js [CJS]
const {
  createReadStream,
} = require('node:fs');
const {
  createHmac,
} = require('node:crypto');
const { argv } = require('node:process');

const filename = argv[2];

const hmac = createHmac('sha256', 'a secret');

const input = createReadStream(filename);
input.on('readable', () => {
  // Only one element is going to be produced by the
  // hash stream.
  const data = input.read();
  if (data)
    hmac.update(data);
  else {
    console.log(`${hmac.digest('hex')} ${filename}`);
  }
});
```
:::


### `crypto.createPrivateKey(key)` {#cryptocreateprivatekeykey}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v15.12.0 | Der Schlüssel kann auch ein JWK-Objekt sein. |
| v15.0.0 | Der Schlüssel kann auch ein ArrayBuffer sein. Die Option `encoding` wurde hinzugefügt. Der Schlüssel darf nicht mehr als 2 ** 32 - 1 Bytes enthalten. |
| v11.6.0 | Hinzugefügt in: v11.6.0 |
:::

- `key` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
    - `key`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Das Schlüsselmaterial, entweder im PEM-, DER- oder JWK-Format.
    - `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Muss `'pem'`, `'der'` oder `'jwk'` sein. **Standard:** `'pem'`.
    - `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Muss `'pkcs1'`, `'pkcs8'` oder `'sec1'` sein. Diese Option ist nur erforderlich, wenn das `format` `'der'` ist und wird ansonsten ignoriert.
    - `passphrase`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) Die für die Entschlüsselung zu verwendende Passphrase.
    - `encoding`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die zu verwendende Zeichenkettenkodierung, wenn `key` eine Zeichenkette ist.

- Rückgabe: [\<KeyObject\>](/de/nodejs/api/crypto#class-keyobject)

Erstellt und gibt ein neues Schlüsselobjekt zurück, das einen privaten Schlüssel enthält. Wenn `key` ein String oder ein `Buffer` ist, wird angenommen, dass `format` `'pem'` ist; andernfalls muss `key` ein Objekt mit den oben beschriebenen Eigenschaften sein.

Wenn der private Schlüssel verschlüsselt ist, muss eine `passphrase` angegeben werden. Die Länge der Passphrase ist auf 1024 Bytes begrenzt.


### `crypto.createPublicKey(key)` {#cryptocreatepublickeykey}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v15.12.0 | Der Schlüssel kann auch ein JWK-Objekt sein. |
| v15.0.0 | Der Schlüssel kann auch ein ArrayBuffer sein. Die Encoding-Option wurde hinzugefügt. Der Schlüssel darf nicht mehr als 2 ** 32 - 1 Bytes enthalten. |
| v11.13.0 | Das Argument `key` kann jetzt ein `KeyObject` mit dem Typ `private` sein. |
| v11.7.0 | Das Argument `key` kann jetzt ein privater Schlüssel sein. |
| v11.6.0 | Hinzugefügt in: v11.6.0 |
:::

- `key` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
    - `key`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Das Schlüsselmaterial, entweder im PEM-, DER- oder JWK-Format.
    - `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Muss `'pem'`, `'der'` oder `'jwk'` sein. **Standard:** `'pem'`.
    - `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Muss `'pkcs1'` oder `'spki'` sein. Diese Option ist nur erforderlich, wenn das `format` `'der'` ist, und wird ansonsten ignoriert.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die zu verwendende String-Kodierung, wenn `key` ein String ist.

- Returns: [\<KeyObject\>](/de/nodejs/api/crypto#class-keyobject)

Erstellt und gibt ein neues Schlüsselobjekt zurück, das einen öffentlichen Schlüssel enthält. Wenn `key` ein String oder `Buffer` ist, wird angenommen, dass `format` `'pem'` ist; wenn `key` ein `KeyObject` mit dem Typ `'private'` ist, wird der öffentliche Schlüssel von dem gegebenen privaten Schlüssel abgeleitet; ansonsten muss `key` ein Objekt mit den oben beschriebenen Eigenschaften sein.

Wenn das Format `'pem'` ist, kann der `'key'` auch ein X.509-Zertifikat sein.

Da öffentliche Schlüssel von privaten Schlüsseln abgeleitet werden können, kann anstelle eines öffentlichen Schlüssels auch ein privater Schlüssel übergeben werden. In diesem Fall verhält sich diese Funktion so, als ob [`crypto.createPrivateKey()`](/de/nodejs/api/crypto#cryptocreateprivatekeykey) aufgerufen worden wäre, außer dass der Typ des zurückgegebenen `KeyObject` `'public'` ist und dass der private Schlüssel nicht aus dem zurückgegebenen `KeyObject` extrahiert werden kann. Wenn auf ähnliche Weise ein `KeyObject` mit dem Typ `'private'` angegeben wird, wird ein neues `KeyObject` mit dem Typ `'public'` zurückgegeben, und es ist unmöglich, den privaten Schlüssel aus dem zurückgegebenen Objekt zu extrahieren.


### `crypto.createSecretKey(key[, encoding])` {#cryptocreatesecretkeykey-encoding}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.8.0, v16.18.0 | Der Schlüssel kann jetzt die Länge Null haben. |
| v15.0.0 | Der Schlüssel kann jetzt auch ein ArrayBuffer oder String sein. Das Encoding-Argument wurde hinzugefügt. Der Schlüssel darf nicht mehr als 2 ** 32 - 1 Bytes enthalten. |
| v11.6.0 | Hinzugefügt in: v11.6.0 |
:::

- `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die String-Kodierung, wenn `key` ein String ist.
- Gibt zurück: [\<KeyObject\>](/de/nodejs/api/crypto#class-keyobject)

Erstellt und gibt ein neues Key-Objekt zurück, das einen geheimen Schlüssel für symmetrische Verschlüsselung oder `Hmac` enthält.

### `crypto.createSign(algorithm[, options])` {#cryptocreatesignalgorithm-options}

**Hinzugefügt in: v0.1.92**

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.Writable`-Optionen](/de/nodejs/api/stream#new-streamwritableoptions)
- Gibt zurück: [\<Sign\>](/de/nodejs/api/crypto#class-sign)

Erstellt und gibt ein `Sign`-Objekt zurück, das den gegebenen `algorithm` verwendet. Verwenden Sie [`crypto.getHashes()`](/de/nodejs/api/crypto#cryptogethashes), um die Namen der verfügbaren Digest-Algorithmen zu erhalten. Das optionale `options`-Argument steuert das `stream.Writable`-Verhalten.

In einigen Fällen kann eine `Sign`-Instanz unter Verwendung des Namens eines Signaturalgorithmus, wie z. B. `'RSA-SHA256'`, anstelle eines Digest-Algorithmus erstellt werden. Dies verwendet den entsprechenden Digest-Algorithmus. Dies funktioniert nicht für alle Signaturalgorithmen, wie z. B. `'ecdsa-with-SHA256'`, daher ist es am besten, immer Digest-Algorithmusnamen zu verwenden.


### `crypto.createVerify(algorithm[, options])` {#cryptocreateverifyalgorithm-options}

**Hinzugefügt in: v0.1.92**

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.Writable` Optionen](/de/nodejs/api/stream#new-streamwritableoptions)
- Gibt zurück: [\<Verify\>](/de/nodejs/api/crypto#class-verify)

Erstellt und gibt ein `Verify`-Objekt zurück, das den angegebenen Algorithmus verwendet. Verwenden Sie [`crypto.getHashes()`](/de/nodejs/api/crypto#cryptogethashes), um ein Array mit Namen der verfügbaren Signieralgorithmen zu erhalten. Das optionale Argument `options` steuert das Verhalten von `stream.Writable`.

In einigen Fällen kann eine `Verify`-Instanz unter Verwendung des Namens eines Signaturalgorithmus erstellt werden, z. B. `'RSA-SHA256'`, anstelle eines Digest-Algorithmus. Dies verwendet den entsprechenden Digest-Algorithmus. Dies funktioniert nicht für alle Signaturalgorithmen, wie z. B. `'ecdsa-with-SHA256'`, daher ist es am besten, immer Digest-Algorithmusnamen zu verwenden.

### `crypto.diffieHellman(options)` {#cryptodiffiehellmanoptions}

**Hinzugefügt in: v13.9.0, v12.17.0**

- `options`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `privateKey`: [\<KeyObject\>](/de/nodejs/api/crypto#class-keyobject)
    - `publicKey`: [\<KeyObject\>](/de/nodejs/api/crypto#class-keyobject)


- Gibt zurück: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)

Berechnet das Diffie-Hellman-Geheimnis basierend auf einem `privateKey` und einem `publicKey`. Beide Schlüssel müssen denselben `asymmetricKeyType` haben, der entweder `'dh'` (für Diffie-Hellman), `'ec'`, `'x448'` oder `'x25519'` (für ECDH) sein muss.

### `crypto.fips` {#cryptofips}

**Hinzugefügt in: v6.0.0**

**Veraltet seit: v10.0.0**

::: danger [Stabil: 0 - Veraltet]
[Stabil: 0](/de/nodejs/api/documentation#stability-index) [Stabilität: 0](/de/nodejs/api/documentation#stability-index) - Veraltet
:::

Eigenschaft zum Überprüfen und Steuern, ob ein FIPS-konformer Krypto-Provider derzeit verwendet wird. Die Einstellung auf true erfordert einen FIPS-Build von Node.js.

Diese Eigenschaft ist veraltet. Bitte verwenden Sie stattdessen `crypto.setFips()` und `crypto.getFips()`.


### `crypto.generateKey(type, options, callback)` {#cryptogeneratekeytype-options-callback}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Die Übergabe eines ungültigen Rückrufs an das `callback`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v15.0.0 | Hinzugefügt in: v15.0.0 |
:::

- `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die beabsichtigte Verwendung des generierten geheimen Schlüssels. Derzeit akzeptierte Werte sind `'hmac'` und `'aes'`.
- `options`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `length`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Bitlänge des zu generierenden Schlüssels. Dies muss ein Wert größer als 0 sein.
    - Wenn `type` `'hmac'` ist, beträgt das Minimum 8 und die maximale Länge 2-1. Wenn der Wert kein Vielfaches von 8 ist, wird der generierte Schlüssel auf `Math.floor(length / 8)` gekürzt.
    - Wenn `type` `'aes'` ist, muss die Länge entweder `128`, `192` oder `256` sein.
  
 
  
 
- `callback`: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err`: [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `key`: [\<KeyObject\>](/de/nodejs/api/crypto#class-keyobject)
  
 

Generiert asynchron einen neuen zufälligen geheimen Schlüssel der gegebenen `length`. Der `type` bestimmt, welche Validierungen für die `length` durchgeführt werden.

::: code-group
```js [ESM]
const {
  generateKey,
} = await import('node:crypto');

generateKey('hmac', { length: 512 }, (err, key) => {
  if (err) throw err;
  console.log(key.export().toString('hex'));  // 46e..........620
});
```

```js [CJS]
const {
  generateKey,
} = require('node:crypto');

generateKey('hmac', { length: 512 }, (err, key) => {
  if (err) throw err;
  console.log(key.export().toString('hex'));  // 46e..........620
});
```
:::

Die Größe eines generierten HMAC-Schlüssels sollte die Blockgröße der zugrunde liegenden Hash-Funktion nicht überschreiten. Weitere Informationen finden Sie unter [`crypto.createHmac()`](/de/nodejs/api/crypto#cryptocreatehmacalgorithm-key-options).


### `crypto.generateKeyPair(type, options, callback)` {#cryptogeneratekeypairtype-options-callback}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Das Übergeben eines ungültigen Callbacks an das `callback`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v16.10.0 | Möglichkeit hinzugefügt, `RSASSA-PSS-params`-Sequenzparameter für RSA-PSS-Schlüsselpaare zu definieren. |
| v13.9.0, v12.17.0 | Unterstützung für Diffie-Hellman hinzugefügt. |
| v12.0.0 | Unterstützung für RSA-PSS-Schlüsselpaare hinzugefügt. |
| v12.0.0 | Möglichkeit hinzugefügt, X25519- und X448-Schlüsselpaare zu generieren. |
| v12.0.0 | Möglichkeit hinzugefügt, Ed25519- und Ed448-Schlüsselpaare zu generieren. |
| v11.6.0 | Die Funktionen `generateKeyPair` und `generateKeyPairSync` erzeugen jetzt Schlüsselobjekte, wenn keine Kodierung angegeben wurde. |
| v10.12.0 | Hinzugefügt in: v10.12.0 |
:::

- `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Muss `'rsa'`, `'rsa-pss'`, `'dsa'`, `'ec'`, `'ed25519'`, `'ed448'`, `'x25519'`, `'x448'` oder `'dh'` sein.
- `options`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `modulusLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Schlüsselgröße in Bits (RSA, DSA).
    - `publicExponent`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Öffentlicher Exponent (RSA). **Standard:** `0x10001`.
    - `hashAlgorithm`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Name des Message-Digest (RSA-PSS).
    - `mgf1HashAlgorithm`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Name des Message-Digest, der von MGF1 verwendet wird (RSA-PSS).
    - `saltLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Minimale Salt-Länge in Bytes (RSA-PSS).
    - `divisorLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Größe von `q` in Bits (DSA).
    - `namedCurve`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Name der zu verwendenden Kurve (EC).
    - `prime`: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) Der Primparameter (DH).
    - `primeLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Primlänge in Bits (DH).
    - `generator`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Benutzerdefinierter Generator (DH). **Standard:** `2`.
    - `groupName`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Diffie-Hellman-Gruppenname (DH). Siehe [`crypto.getDiffieHellman()`](/de/nodejs/api/crypto#cryptogetdiffiehellmangroupname).
    - `paramEncoding`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Muss `'named'` oder `'explicit'` sein (EC). **Standard:** `'named'`.
    - `publicKeyEncoding`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Siehe [`keyObject.export()`](/de/nodejs/api/crypto#keyobjectexportoptions).
    - `privateKeyEncoding`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Siehe [`keyObject.export()`](/de/nodejs/api/crypto#keyobjectexportoptions).


- `callback`: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err`: [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `publicKey`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<KeyObject\>](/de/nodejs/api/crypto#class-keyobject)
    - `privateKey`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<KeyObject\>](/de/nodejs/api/crypto#class-keyobject)



Generiert ein neues asymmetrisches Schlüsselpaar des angegebenen `type`. RSA, RSA-PSS, DSA, EC, Ed25519, Ed448, X25519, X448 und DH werden derzeit unterstützt.

Wenn eine `publicKeyEncoding` oder `privateKeyEncoding` angegeben wurde, verhält sich diese Funktion so, als ob [`keyObject.export()`](/de/nodejs/api/crypto#keyobjectexportoptions) auf das Ergebnis angewendet worden wäre. Andernfalls wird der jeweilige Teil des Schlüssels als [`KeyObject`](/de/nodejs/api/crypto#class-keyobject) zurückgegeben.

Es wird empfohlen, öffentliche Schlüssel als `'spki'` und private Schlüssel als `'pkcs8'` mit Verschlüsselung für die langfristige Speicherung zu kodieren:

::: code-group
```js [ESM]
const {
  generateKeyPair,
} = await import('node:crypto');

generateKeyPair('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
    cipher: 'aes-256-cbc',
    passphrase: 'top secret',
  },
}, (err, publicKey, privateKey) => {
  // Handle errors and use the generated key pair.
});
```

```js [CJS]
const {
  generateKeyPair,
} = require('node:crypto');

generateKeyPair('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
    cipher: 'aes-256-cbc',
    passphrase: 'top secret',
  },
}, (err, publicKey, privateKey) => {
  // Handle errors and use the generated key pair.
});
```
:::

Nach Abschluss wird `callback` aufgerufen, wobei `err` auf `undefined` gesetzt ist und `publicKey` / `privateKey` das generierte Schlüsselpaar darstellen.

Wenn diese Methode als ihre [`util.promisify()`](/de/nodejs/api/util#utilpromisifyoriginal)ed-Version aufgerufen wird, gibt sie ein `Promise` für ein `Object` mit den Eigenschaften `publicKey` und `privateKey` zurück.


### `crypto.generateKeyPairSync(type, options)` {#cryptogeneratekeypairsynctype-options}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v16.10.0 | Fähigkeit hinzugefügt, `RSASSA-PSS-params`-Sequenzparameter für RSA-PSS-Schlüsselpaare zu definieren. |
| v13.9.0, v12.17.0 | Unterstützung für Diffie-Hellman hinzugefügt. |
| v12.0.0 | Unterstützung für RSA-PSS-Schlüsselpaare hinzugefügt. |
| v12.0.0 | Fähigkeit hinzugefügt, X25519- und X448-Schlüsselpaare zu generieren. |
| v12.0.0 | Fähigkeit hinzugefügt, Ed25519- und Ed448-Schlüsselpaare zu generieren. |
| v11.6.0 | Die Funktionen `generateKeyPair` und `generateKeyPairSync` erzeugen jetzt Schlüsselobjekte, wenn keine Kodierung angegeben wurde. |
| v10.12.0 | Hinzugefügt in: v10.12.0 |
:::

- `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Muss `'rsa'`, `'rsa-pss'`, `'dsa'`, `'ec'`, `'ed25519'`, `'ed448'`, `'x25519'`, `'x448'` oder `'dh'` sein.
- `options`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `modulusLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Schlüsselgröße in Bits (RSA, DSA).
    - `publicExponent`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Öffentlicher Exponent (RSA). **Standard:** `0x10001`.
    - `hashAlgorithm`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Name des Message Digest (RSA-PSS).
    - `mgf1HashAlgorithm`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Name des Message Digest, der von MGF1 verwendet wird (RSA-PSS).
    - `saltLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Minimale Salt-Länge in Bytes (RSA-PSS).
    - `divisorLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Größe von `q` in Bits (DSA).
    - `namedCurve`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Name der zu verwendenden Kurve (EC).
    - `prime`: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) Der Primzahl-Parameter (DH).
    - `primeLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Primzahllänge in Bits (DH).
    - `generator`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Benutzerdefinierter Generator (DH). **Standard:** `2`.
    - `groupName`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Diffie-Hellman-Gruppenname (DH). Siehe [`crypto.getDiffieHellman()`](/de/nodejs/api/crypto#cryptogetdiffiehellmangroupname).
    - `paramEncoding`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Muss `'named'` oder `'explicit'` sein (EC). **Standard:** `'named'`.
    - `publicKeyEncoding`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Siehe [`keyObject.export()`](/de/nodejs/api/crypto#keyobjectexportoptions).
    - `privateKeyEncoding`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Siehe [`keyObject.export()`](/de/nodejs/api/crypto#keyobjectexportoptions).


- Gibt zurück: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `publicKey`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<KeyObject\>](/de/nodejs/api/crypto#class-keyobject)
    - `privateKey`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<KeyObject\>](/de/nodejs/api/crypto#class-keyobject)



Generiert ein neues asymmetrisches Schlüsselpaar des angegebenen `type`. RSA, RSA-PSS, DSA, EC, Ed25519, Ed448, X25519, X448 und DH werden derzeit unterstützt.

Wenn eine `publicKeyEncoding` oder `privateKeyEncoding` angegeben wurde, verhält sich diese Funktion so, als ob [`keyObject.export()`](/de/nodejs/api/crypto#keyobjectexportoptions) auf das Ergebnis angewendet worden wäre. Andernfalls wird der jeweilige Teil des Schlüssels als [`KeyObject`](/de/nodejs/api/crypto#class-keyobject) zurückgegeben.

Beim Kodieren öffentlicher Schlüssel wird empfohlen, `'spki'` zu verwenden. Beim Kodieren privater Schlüssel wird empfohlen, `'pkcs8'` mit einer starken Passphrase zu verwenden und die Passphrase vertraulich zu behandeln.

::: code-group
```js [ESM]
const {
  generateKeyPairSync,
} = await import('node:crypto');

const {
  publicKey,
  privateKey,
} = generateKeyPairSync('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
    cipher: 'aes-256-cbc',
    passphrase: 'top secret',
  },
});
```

```js [CJS]
const {
  generateKeyPairSync,
} = require('node:crypto');

const {
  publicKey,
  privateKey,
} = generateKeyPairSync('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem',
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem',
    cipher: 'aes-256-cbc',
    passphrase: 'top secret',
  },
});
```
:::

Der Rückgabewert `{ publicKey, privateKey }` repräsentiert das generierte Schlüsselpaar. Wenn die PEM-Kodierung ausgewählt wurde, ist der jeweilige Schlüssel eine Zeichenfolge, andernfalls ist er ein Puffer, der die als DER kodierten Daten enthält.


### `crypto.generateKeySync(type, options)` {#cryptogeneratekeysynctype-options}

**Hinzugefügt in: v15.0.0**

- `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die beabsichtigte Verwendung des generierten geheimen Schlüssels. Aktuell akzeptierte Werte sind `'hmac'` und `'aes'`.
- `options`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `length`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Bitlänge des zu generierenden Schlüssels.
    - Wenn `type` `'hmac'` ist, beträgt das Minimum 8 und die maximale Länge 2-1. Wenn der Wert kein Vielfaches von 8 ist, wird der generierte Schlüssel auf `Math.floor(length / 8)` gekürzt.
    - Wenn `type` `'aes'` ist, muss die Länge einer von `128`, `192` oder `256` sein.




- Gibt zurück: [\<KeyObject\>](/de/nodejs/api/crypto#class-keyobject)

Generiert synchron einen neuen zufälligen geheimen Schlüssel der angegebenen `length`. Der `type` bestimmt, welche Validierungen an der `length` durchgeführt werden.



::: code-group
```js [ESM]
const {
  generateKeySync,
} = await import('node:crypto');

const key = generateKeySync('hmac', { length: 512 });
console.log(key.export().toString('hex'));  // e89..........41e
```

```js [CJS]
const {
  generateKeySync,
} = require('node:crypto');

const key = generateKeySync('hmac', { length: 512 });
console.log(key.export().toString('hex'));  // e89..........41e
```
:::

Die Größe eines generierten HMAC-Schlüssels sollte die Blockgröße der zugrunde liegenden Hash-Funktion nicht überschreiten. Siehe [`crypto.createHmac()`](/de/nodejs/api/crypto#cryptocreatehmacalgorithm-key-options) für weitere Informationen.

### `crypto.generatePrime(size[, options[, callback]])` {#cryptogenerateprimesize-options-callback}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Die Übergabe eines ungültigen Callbacks an das `callback`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v15.8.0 | Hinzugefügt in: v15.8.0 |
:::

- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Größe (in Bits) der zu generierenden Primzahl.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `add` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
    - `rem` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
    - `safe` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Standard:** `false`.
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, wird die generierte Primzahl als `bigint` zurückgegeben.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `prime` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)



Generiert eine pseudozufällige Primzahl von `size` Bits.

Wenn `options.safe` `true` ist, ist die Primzahl eine sichere Primzahl -- das heißt, `(prime - 1) / 2` ist ebenfalls eine Primzahl.

Die Parameter `options.add` und `options.rem` können verwendet werden, um zusätzliche Anforderungen durchzusetzen, z. B. für Diffie-Hellman:

- Wenn `options.add` und `options.rem` beide gesetzt sind, erfüllt die Primzahl die Bedingung `prime % add = rem`.
- Wenn nur `options.add` gesetzt ist und `options.safe` nicht `true` ist, erfüllt die Primzahl die Bedingung `prime % add = 1`.
- Wenn nur `options.add` gesetzt ist und `options.safe` auf `true` gesetzt ist, erfüllt die Primzahl stattdessen die Bedingung `prime % add = 3`. Dies ist notwendig, da `prime % add = 1` für `options.add \> 2` der von `options.safe` erzwungenen Bedingung widersprechen würde.
- `options.rem` wird ignoriert, wenn `options.add` nicht angegeben wird.

Sowohl `options.add` als auch `options.rem` müssen als Big-Endian-Sequenzen kodiert werden, wenn sie als `ArrayBuffer`, `SharedArrayBuffer`, `TypedArray`, `Buffer` oder `DataView` angegeben werden.

Standardmäßig wird die Primzahl als Big-Endian-Sequenz von Oktetten in einem [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) kodiert. Wenn die Option `bigint` `true` ist, wird ein [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) bereitgestellt.


### `crypto.generatePrimeSync(size[, options])` {#cryptogenerateprimesyncsize-options}

**Hinzugefügt in: v15.8.0**

- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Größe (in Bits) der zu generierenden Primzahl.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `add` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
    - `rem` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
    - `safe` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Standardwert:** `false`.
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, wird die generierte Primzahl als `bigint` zurückgegeben.


- Rückgabe: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Generiert eine pseudozufällige Primzahl von `size` Bits.

Wenn `options.safe` `true` ist, ist die Primzahl eine sichere Primzahl -- das heißt, `(prime - 1) / 2` ist auch eine Primzahl.

Die Parameter `options.add` und `options.rem` können verwendet werden, um zusätzliche Anforderungen durchzusetzen, z. B. für Diffie-Hellman:

- Wenn `options.add` und `options.rem` beide gesetzt sind, erfüllt die Primzahl die Bedingung `prime % add = rem`.
- Wenn nur `options.add` gesetzt ist und `options.safe` nicht `true` ist, erfüllt die Primzahl die Bedingung `prime % add = 1`.
- Wenn nur `options.add` gesetzt ist und `options.safe` auf `true` gesetzt ist, erfüllt die Primzahl stattdessen die Bedingung `prime % add = 3`. Dies ist notwendig, da `prime % add = 1` für `options.add \> 2` der von `options.safe` erzwungenen Bedingung widersprechen würde.
- `options.rem` wird ignoriert, wenn `options.add` nicht angegeben wird.

Sowohl `options.add` als auch `options.rem` müssen als Big-Endian-Sequenzen kodiert werden, wenn sie als `ArrayBuffer`, `SharedArrayBuffer`, `TypedArray`, `Buffer` oder `DataView` angegeben werden.

Standardmäßig wird die Primzahl als Big-Endian-Sequenz von Oktetten in einem [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) kodiert. Wenn die Option `bigint` `true` ist, wird ein [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) bereitgestellt.


### `crypto.getCipherInfo(nameOrNid[, options])` {#cryptogetcipherinfonameornid-options}

**Hinzugefügt in: v15.0.0**

- `nameOrNid`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Der Name oder die NID des zu abfragenden Chiffre.
- `options`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `keyLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Eine Testschlüssellänge.
    - `ivLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Eine Test-IV-Länge.


- Gibt zurück: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der Name des Chiffre
    - `nid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die NID des Chiffre
    - `blockSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Blockgröße des Chiffre in Bytes. Diese Eigenschaft wird ausgelassen, wenn `mode` gleich `'stream'` ist.
    - `ivLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die erwartete oder standardmäßige Initialisierungsvektorlänge in Bytes. Diese Eigenschaft wird ausgelassen, wenn der Chiffre keinen Initialisierungsvektor verwendet.
    - `keyLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die erwartete oder standardmäßige Schlüssellänge in Bytes.
    - `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der Chiffre-Modus. Einer von `'cbc'`, `'ccm'`, `'cfb'`, `'ctr'`, `'ecb'`, `'gcm'`, `'ocb'`, `'ofb'`, `'stream'`, `'wrap'`, `'xts'`.



Gibt Informationen über einen gegebenen Chiffre zurück.

Einige Chiffren akzeptieren Schlüssel und Initialisierungsvektoren variabler Länge. Standardmäßig gibt die Methode `crypto.getCipherInfo()` die Standardwerte für diese Chiffren zurück. Um zu testen, ob eine bestimmte Schlüssellänge oder IV-Länge für einen gegebenen Chiffre akzeptabel ist, verwenden Sie die Optionen `keyLength` und `ivLength`. Wenn die angegebenen Werte inakzeptabel sind, wird `undefined` zurückgegeben.


### `crypto.getCiphers()` {#cryptogetciphers}

**Hinzugefügt in: v0.9.3**

- Rückgabe: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Ein Array mit den Namen der unterstützten Verschlüsselungsalgorithmen.

::: code-group
```js [ESM]
const {
  getCiphers,
} = await import('node:crypto');

console.log(getCiphers()); // ['aes-128-cbc', 'aes-128-ccm', ...]
```

```js [CJS]
const {
  getCiphers,
} = require('node:crypto');

console.log(getCiphers()); // ['aes-128-cbc', 'aes-128-ccm', ...]
```
:::

### `crypto.getCurves()` {#cryptogetcurves}

**Hinzugefügt in: v2.3.0**

- Rückgabe: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Ein Array mit den Namen der unterstützten elliptischen Kurven.

::: code-group
```js [ESM]
const {
  getCurves,
} = await import('node:crypto');

console.log(getCurves()); // ['Oakley-EC2N-3', 'Oakley-EC2N-4', ...]
```

```js [CJS]
const {
  getCurves,
} = require('node:crypto');

console.log(getCurves()); // ['Oakley-EC2N-3', 'Oakley-EC2N-4', ...]
```
:::

### `crypto.getDiffieHellman(groupName)` {#cryptogetdiffiehellmangroupname}

**Hinzugefügt in: v0.7.5**

- `groupName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Rückgabe: [\<DiffieHellmanGroup\>](/de/nodejs/api/crypto#class-diffiehellmangroup)

Erstellt ein vordefiniertes `DiffieHellmanGroup`-Schlüsselaustauschobjekt. Die unterstützten Gruppen sind in der Dokumentation für [`DiffieHellmanGroup`](/de/nodejs/api/crypto#class-diffiehellmangroup) aufgeführt.

Das zurückgegebene Objekt ahmt die Schnittstelle von Objekten nach, die von [`crypto.createDiffieHellman()`](/de/nodejs/api/crypto#cryptocreatediffiehellmanprime-primeencoding-generator-generatorencoding) erstellt wurden, erlaubt jedoch keine Änderung der Schlüssel (z. B. mit [`diffieHellman.setPublicKey()`](/de/nodejs/api/crypto#diffiehellmansetpublickeypublickey-encoding)). Der Vorteil der Verwendung dieser Methode besteht darin, dass die Parteien weder einen Gruppenmodul vorab erzeugen noch austauschen müssen, wodurch sowohl Prozessor- als auch Kommunikationszeit gespart werden.

Beispiel (Ermittlung eines gemeinsamen Geheimnisses):

::: code-group
```js [ESM]
const {
  getDiffieHellman,
} = await import('node:crypto');
const alice = getDiffieHellman('modp14');
const bob = getDiffieHellman('modp14');

alice.generateKeys();
bob.generateKeys();

const aliceSecret = alice.computeSecret(bob.getPublicKey(), null, 'hex');
const bobSecret = bob.computeSecret(alice.getPublicKey(), null, 'hex');

/* aliceSecret und bobSecret sollten identisch sein */
console.log(aliceSecret === bobSecret);
```

```js [CJS]
const {
  getDiffieHellman,
} = require('node:crypto');

const alice = getDiffieHellman('modp14');
const bob = getDiffieHellman('modp14');

alice.generateKeys();
bob.generateKeys();

const aliceSecret = alice.computeSecret(bob.getPublicKey(), null, 'hex');
const bobSecret = bob.computeSecret(alice.getPublicKey(), null, 'hex');

/* aliceSecret und bobSecret sollten identisch sein */
console.log(aliceSecret === bobSecret);
```
:::


### `crypto.getFips()` {#cryptogetfips}

**Hinzugefügt in: v10.0.0**

- Gibt zurück: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `1` genau dann, wenn ein FIPS-konformer Krypto-Provider aktuell verwendet wird, andernfalls `0`. Eine zukünftige Semver-Major-Version kann den Rückgabetyp dieser API in ein [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ändern.

### `crypto.getHashes()` {#cryptogethashes}

**Hinzugefügt in: v0.9.3**

- Gibt zurück: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Ein Array mit den Namen der unterstützten Hash-Algorithmen, wie z. B. `'RSA-SHA256'`. Hash-Algorithmen werden auch als "Digest"-Algorithmen bezeichnet.

::: code-group
```js [ESM]
const {
  getHashes,
} = await import('node:crypto');

console.log(getHashes()); // ['DSA', 'DSA-SHA', 'DSA-SHA1', ...]
```

```js [CJS]
const {
  getHashes,
} = require('node:crypto');

console.log(getHashes()); // ['DSA', 'DSA-SHA', 'DSA-SHA1', ...]
```
:::

### `crypto.getRandomValues(typedArray)` {#cryptogetrandomvaluestypedarray}

**Hinzugefügt in: v17.4.0**

- `typedArray` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
- Gibt zurück: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) Gibt `typedArray` zurück.

Ein praktischer Alias für [`crypto.webcrypto.getRandomValues()`](/de/nodejs/api/webcrypto#cryptogetrandomvaluestypedarray). Diese Implementierung ist nicht konform mit der Web Crypto-Spezifikation. Um webkompatiblen Code zu schreiben, verwenden Sie stattdessen [`crypto.webcrypto.getRandomValues()`](/de/nodejs/api/webcrypto#cryptogetrandomvaluestypedarray).


### `crypto.hash(algorithm, data[, outputEncoding])` {#cryptohashalgorithm-data-outputencoding}

**Hinzugefügt in: v21.7.0, v20.12.0**

::: warning [Stabil: 1 - Experimentell]
[Stabil: 1](/de/nodejs/api/documentation#stability-index) [Stabilität: 1](/de/nodejs/api/documentation#stability-index).2 - Release Candidate
:::

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Wenn `data` ein String ist, wird er vor dem Hashing als UTF-8 kodiert. Wenn für eine String-Eingabe eine andere Eingabekodierung gewünscht ist, kann der Benutzer den String entweder mit `TextEncoder` oder `Buffer.from()` in ein `TypedArray` kodieren und das kodierte `TypedArray` stattdessen an diese API übergeben.
- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) [Encoding](/de/nodejs/api/buffer#buffers-and-character-encodings), das zum Kodieren des zurückgegebenen Digests verwendet wird. **Standard:** `'hex'`.
- Rückgabe: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)

Ein Hilfsprogramm zum Erstellen von einmaligen Hash-Digests von Daten. Es kann schneller sein als das objektbasierte `crypto.createHash()`, wenn eine kleinere Datenmenge (<= 5 MB), die leicht verfügbar ist, gehasht wird. Wenn die Daten groß sein können oder gestreamt werden, wird weiterhin empfohlen, stattdessen `crypto.createHash()` zu verwenden.

Der `algorithm` hängt von den verfügbaren Algorithmen ab, die von der Version von OpenSSL auf der Plattform unterstützt werden. Beispiele sind `'sha256'`, `'sha512'` usw. In den letzten Versionen von OpenSSL zeigt `openssl list -digest-algorithms` die verfügbaren Digest-Algorithmen an.

Beispiel:

::: code-group
```js [CJS]
const crypto = require('node:crypto');
const { Buffer } = require('node:buffer');

// Hashing eines Strings und Rückgabe des Ergebnisses als hex-kodierter String.
const string = 'Node.js';
// 10b3493287f831e81a438811a1ffba01f8cec4b7
console.log(crypto.hash('sha1', string));

// Kodieren eines base64-kodierten Strings in einen Buffer, Hashen und zurückgeben
// des Ergebnisses als Buffer.
const base64 = 'Tm9kZS5qcw==';
// <Buffer 10 b3 49 32 87 f8 31 e8 1a 43 88 11 a1 ff ba 01 f8 ce c4 b7>
console.log(crypto.hash('sha1', Buffer.from(base64, 'base64'), 'buffer'));
```

```js [ESM]
import crypto from 'node:crypto';
import { Buffer } from 'node:buffer';

// Hashing eines Strings und Rückgabe des Ergebnisses als hex-kodierter String.
const string = 'Node.js';
// 10b3493287f831e81a438811a1ffba01f8cec4b7
console.log(crypto.hash('sha1', string));

// Kodieren eines base64-kodierten Strings in einen Buffer, Hashen und zurückgeben
// des Ergebnisses als Buffer.
const base64 = 'Tm9kZS5qcw==';
// <Buffer 10 b3 49 32 87 f8 31 e8 1a 43 88 11 a1 ff ba 01 f8 ce c4 b7>
console.log(crypto.hash('sha1', Buffer.from(base64, 'base64'), 'buffer'));
```
:::


### `crypto.hkdf(digest, ikm, salt, info, keylen, callback)` {#cryptohkdfdigest-ikm-salt-info-keylen-callback}

::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | Die Übergabe eines ungültigen Callbacks an das `callback`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v18.8.0, v16.18.0 | Das Input Keying Material darf nun die Länge Null haben. |
| v15.0.0 | Hinzugefügt in: v15.0.0 |
:::

- `digest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der zu verwendende Digest-Algorithmus.
- `ikm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/de/nodejs/api/crypto#class-keyobject) Das Input Keying Material. Muss angegeben werden, kann aber die Länge Null haben.
- `salt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Der Salt-Wert. Muss angegeben werden, kann aber die Länge Null haben.
- `info` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Zusätzlicher Info-Wert. Muss angegeben werden, kann aber die Länge Null haben und darf nicht mehr als 1024 Byte betragen.
- `keylen` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Länge des zu generierenden Schlüssels. Muss größer als 0 sein. Der maximal zulässige Wert ist das `255`-fache der Anzahl der Bytes, die von der ausgewählten Digest-Funktion erzeugt werden (z. B. erzeugt `sha512` 64-Byte-Hashes, wodurch die maximale HKDF-Ausgabe 16320 Byte beträgt).
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `derivedKey` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

HKDF ist eine einfache Schlüss ableitungs Funktion, die in RFC 5869 definiert ist. Die angegebenen `ikm`, `salt` und `info` werden zusammen mit dem `digest` verwendet, um einen Schlüssel der Länge `keylen` abzuleiten.

Die mitgelieferte `callback`-Funktion wird mit zwei Argumenten aufgerufen: `err` und `derivedKey`. Wenn beim Ableiten des Schlüssels ein Fehler auftritt, wird `err` gesetzt; andernfalls ist `err` `null`. Der erfolgreich generierte `derivedKey` wird als [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) an den Callback übergeben. Es wird ein Fehler ausgelöst, wenn eines der Eingabeargumente ungültige Werte oder Typen angibt.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const {
  hkdf,
} = await import('node:crypto');

hkdf('sha512', 'key', 'salt', 'info', 64, (err, derivedKey) => {
  if (err) throw err;
  console.log(Buffer.from(derivedKey).toString('hex'));  // '24156e2...5391653'
});
```

```js [CJS]
const {
  hkdf,
} = require('node:crypto');
const { Buffer } = require('node:buffer');

hkdf('sha512', 'key', 'salt', 'info', 64, (err, derivedKey) => {
  if (err) throw err;
  console.log(Buffer.from(derivedKey).toString('hex'));  // '24156e2...5391653'
});
```
:::


### `crypto.hkdfSync(digest, ikm, salt, info, keylen)` {#cryptohkdfsyncdigest-ikm-salt-info-keylen}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.8.0, v16.18.0 | Das Input Keying Material kann jetzt null lang sein. |
| v15.0.0 | Hinzugefügt in: v15.0.0 |
:::

- `digest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der zu verwendende Digest-Algorithmus.
- `ikm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/de/nodejs/api/crypto#class-keyobject) Das Input Keying Material. Muss angegeben werden, kann aber null lang sein.
- `salt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Der Salt-Wert. Muss angegeben werden, kann aber null lang sein.
- `info` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Zusätzlicher Info-Wert. Muss angegeben werden, kann aber null lang sein und darf nicht mehr als 1024 Byte betragen.
- `keylen` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Länge des zu generierenden Schlüssels. Muss größer als 0 sein. Der maximal zulässige Wert ist das `255`-fache der Anzahl von Bytes, die von der ausgewählten Digest-Funktion erzeugt werden (z. B. erzeugt `sha512` 64-Byte-Hashes, wodurch die maximale HKDF-Ausgabe 16320 Byte beträgt).
- Rückgabe: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

Stellt eine synchrone HKDF-Schlüsselableitungsfunktion bereit, wie in RFC 5869 definiert. Die angegebenen `ikm`, `salt` und `info` werden mit dem `digest` verwendet, um einen Schlüssel der Länge `keylen` Byte abzuleiten.

Der erfolgreich generierte `derivedKey` wird als [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) zurückgegeben.

Ein Fehler wird ausgelöst, wenn eines der Eingabeargumente ungültige Werte oder Typen angibt oder wenn der abgeleitete Schlüssel nicht generiert werden kann.



::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const {
  hkdfSync,
} = await import('node:crypto');

const derivedKey = hkdfSync('sha512', 'key', 'salt', 'info', 64);
console.log(Buffer.from(derivedKey).toString('hex'));  // '24156e2...5391653'
```

```js [CJS]
const {
  hkdfSync,
} = require('node:crypto');
const { Buffer } = require('node:buffer');

const derivedKey = hkdfSync('sha512', 'key', 'salt', 'info', 64);
console.log(Buffer.from(derivedKey).toString('hex'));  // '24156e2...5391653'
```
:::


### `crypto.pbkdf2(password, salt, iterations, keylen, digest, callback)` {#cryptopbkdf2password-salt-iterations-keylen-digest-callback}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Die Übergabe eines ungültigen Callbacks an das `callback`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v15.0.0 | Die Argumente `password` und `salt` können auch ArrayBuffer-Instanzen sein. |
| v14.0.0 | Der Parameter `iterations` ist jetzt auf positive Werte beschränkt. Frühere Versionen behandelten andere Werte als Eins. |
| v8.0.0 | Der Parameter `digest` ist jetzt immer erforderlich. |
| v6.0.0 | Der Aufruf dieser Funktion ohne Übergabe des Parameters `digest` ist jetzt veraltet und gibt eine Warnung aus. |
| v6.0.0 | Die Standardkodierung für `password`, wenn es sich um einen String handelt, wurde von `binary` in `utf8` geändert. |
| v0.5.5 | Hinzugefügt in: v0.5.5 |
:::

- `password` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `salt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `iterations` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `keylen` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `digest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `derivedKey` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)

Bietet eine asynchrone Password-Based Key Derivation Function 2 (PBKDF2)-Implementierung. Ein ausgewählter HMAC-Digest-Algorithmus, der durch `digest` spezifiziert wird, wird angewendet, um einen Schlüssel der angeforderten Bytelänge (`keylen`) von `password`, `salt` und `iterations` abzuleiten.

Die mitgelieferte `callback`-Funktion wird mit zwei Argumenten aufgerufen: `err` und `derivedKey`. Wenn beim Ableiten des Schlüssels ein Fehler auftritt, wird `err` gesetzt; andernfalls ist `err` `null`. Standardmäßig wird der erfolgreich generierte `derivedKey` als [`Buffer`](/de/nodejs/api/buffer) an den Callback übergeben. Ein Fehler wird ausgelöst, wenn eines der Eingabeargumente ungültige Werte oder Typen angibt.

Das Argument `iterations` muss eine so hoch wie möglich eingestellte Zahl sein. Je höher die Anzahl der Iterationen, desto sicherer ist der abgeleitete Schlüssel, aber die Durchführung dauert länger.

Das `salt` sollte so einzigartig wie möglich sein. Es wird empfohlen, dass ein Salt zufällig und mindestens 16 Bytes lang ist. Siehe [NIST SP 800-132](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-132.pdf) für Details.

Wenn Strings für `password` oder `salt` übergeben werden, beachten Sie bitte die [Einschränkungen bei der Verwendung von Strings als Eingaben für kryptografische APIs](/de/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis).

::: code-group
```js [ESM]
const {
  pbkdf2,
} = await import('node:crypto');

pbkdf2('secret', 'salt', 100000, 64, 'sha512', (err, derivedKey) => {
  if (err) throw err;
  console.log(derivedKey.toString('hex'));  // '3745e48...08d59ae'
});
```

```js [CJS]
const {
  pbkdf2,
} = require('node:crypto');

pbkdf2('secret', 'salt', 100000, 64, 'sha512', (err, derivedKey) => {
  if (err) throw err;
  console.log(derivedKey.toString('hex'));  // '3745e48...08d59ae'
});
```
:::

Eine Liste der unterstützten Digest-Funktionen kann mit [`crypto.getHashes()`](/de/nodejs/api/crypto#cryptogethashes) abgerufen werden.

Diese API verwendet den Threadpool von libuv, was überraschende und negative Auswirkungen auf die Leistung einiger Anwendungen haben kann. Weitere Informationen finden Sie in der Dokumentation zu [`UV_THREADPOOL_SIZE`](/de/nodejs/api/cli#uv_threadpool_sizesize).


### `crypto.pbkdf2Sync(password, salt, iterations, keylen, digest)` {#cryptopbkdf2syncpassword-salt-iterations-keylen-digest}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v14.0.0 | Der Parameter `iterations` ist jetzt auf positive Werte beschränkt. Frühere Versionen behandelten andere Werte als eins. |
| v6.0.0 | Der Aufruf dieser Funktion ohne Übergabe des Parameters `digest` ist jetzt veraltet und gibt eine Warnung aus. |
| v6.0.0 | Die Standardkodierung für `password`, wenn es sich um einen String handelt, hat sich von `binary` zu `utf8` geändert. |
| v0.9.3 | Hinzugefügt in: v0.9.3 |
:::

- `password` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `salt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `iterations` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `keylen` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `digest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Rückgabe: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)

Bietet eine synchrone Implementierung der Password-Based Key Derivation Function 2 (PBKDF2). Ein ausgewählter HMAC-Digest-Algorithmus, der durch `digest` spezifiziert wird, wird angewendet, um einen Schlüssel der angeforderten Bytelänge (`keylen`) aus dem `password`, `salt` und `iterations` abzuleiten.

Wenn ein Fehler auftritt, wird ein `Error` ausgelöst, andernfalls wird der abgeleitete Schlüssel als [`Buffer`](/de/nodejs/api/buffer) zurückgegeben.

Das Argument `iterations` muss eine möglichst hohe Zahl sein. Je höher die Anzahl der Iterationen, desto sicherer ist der abgeleitete Schlüssel, aber es dauert auch länger, bis er fertiggestellt ist.

Das `salt` sollte so eindeutig wie möglich sein. Es wird empfohlen, dass ein Salt zufällig und mindestens 16 Byte lang ist. Siehe [NIST SP 800-132](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-132.pdf) für Details.

Wenn Sie Strings für `password` oder `salt` übergeben, beachten Sie bitte die [Vorbehalte bei der Verwendung von Strings als Eingaben für kryptografische APIs](/de/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis).

::: code-group
```js [ESM]
const {
  pbkdf2Sync,
} = await import('node:crypto');

const key = pbkdf2Sync('secret', 'salt', 100000, 64, 'sha512');
console.log(key.toString('hex'));  // '3745e48...08d59ae'
```

```js [CJS]
const {
  pbkdf2Sync,
} = require('node:crypto');

const key = pbkdf2Sync('secret', 'salt', 100000, 64, 'sha512');
console.log(key.toString('hex'));  // '3745e48...08d59ae'
```
:::

Eine Liste der unterstützten Digest-Funktionen kann mit [`crypto.getHashes()`](/de/nodejs/api/crypto#cryptogethashes) abgerufen werden.


### `crypto.privateDecrypt(privateKey, buffer)` {#cryptoprivatedecryptprivatekey-buffer}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v21.6.2, v20.11.1, v18.19.1 | Die `RSA_PKCS1_PADDING`-Auffüllung wurde deaktiviert, es sei denn, der OpenSSL-Build unterstützt implizite Ablehnung. |
| v15.0.0 | Zeichenkette, ArrayBuffer und CryptoKey wurden als zulässige Schlüsseltypen hinzugefügt. Der oaepLabel kann ein ArrayBuffer sein. Der Buffer kann eine Zeichenkette oder ein ArrayBuffer sein. Alle Typen, die Buffer akzeptieren, sind auf maximal 2 ** 31 - 1 Bytes beschränkt. |
| v12.11.0 | Die Option `oaepLabel` wurde hinzugefügt. |
| v12.9.0 | Die Option `oaepHash` wurde hinzugefügt. |
| v11.6.0 | Diese Funktion unterstützt jetzt Schlüsselobjekte. |
| v0.11.14 | Hinzugefügt in: v0.11.14 |
:::

- `privateKey` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/de/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/de/nodejs/api/webcrypto#class-cryptokey)
    - `oaepHash` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die Hash-Funktion, die für OAEP-Padding und MGF1 verwendet werden soll. **Standard:** `'sha1'`
    - `oaepLabel` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Das Label, das für OAEP-Padding verwendet werden soll. Wenn nicht angegeben, wird kein Label verwendet.
    - `padding` [\<crypto.constants\>](/de/nodejs/api/crypto#cryptoconstants) Ein optionaler Padding-Wert, der in `crypto.constants` definiert ist und folgende Werte haben kann: `crypto.constants.RSA_NO_PADDING`, `crypto.constants.RSA_PKCS1_PADDING` oder `crypto.constants.RSA_PKCS1_OAEP_PADDING`.


- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- Returns: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) Ein neuer `Buffer` mit dem entschlüsselten Inhalt.

Entschlüsselt `buffer` mit `privateKey`. `buffer` wurde zuvor mit dem entsprechenden öffentlichen Schlüssel verschlüsselt, z. B. mit [`crypto.publicEncrypt()`](/de/nodejs/api/crypto#cryptopublicencryptkey-buffer).

Wenn `privateKey` kein [`KeyObject`](/de/nodejs/api/crypto#class-keyobject) ist, verhält sich diese Funktion so, als ob `privateKey` an [`crypto.createPrivateKey()`](/de/nodejs/api/crypto#cryptocreateprivatekeykey) übergeben worden wäre. Wenn es sich um ein Objekt handelt, kann die Eigenschaft `padding` übergeben werden. Andernfalls verwendet diese Funktion `RSA_PKCS1_OAEP_PADDING`.

Die Verwendung von `crypto.constants.RSA_PKCS1_PADDING` in [`crypto.privateDecrypt()`](/de/nodejs/api/crypto#cryptoprivatedecryptprivatekey-buffer) erfordert, dass OpenSSL die implizite Ablehnung unterstützt (`rsa_pkcs1_implicit_rejection`). Wenn die von Node.js verwendete OpenSSL-Version diese Funktion nicht unterstützt, schlägt der Versuch, `RSA_PKCS1_PADDING` zu verwenden, fehl.


### `crypto.privateEncrypt(privateKey, buffer)` {#cryptoprivateencryptprivatekey-buffer}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v15.0.0 | String, ArrayBuffer und CryptoKey als zulässige Schlüsseltypen hinzugefügt. Die Passphrase kann ein ArrayBuffer sein. Der Puffer kann ein String oder ArrayBuffer sein. Alle Typen, die Puffer akzeptieren, sind auf maximal 2 ** 31 - 1 Bytes beschränkt. |
| v11.6.0 | Diese Funktion unterstützt jetzt Schlüsselobjekte. |
| v1.1.0 | Hinzugefügt in: v1.1.0 |
:::

- `privateKey` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/de/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/de/nodejs/api/webcrypto#class-cryptokey)
    - `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/de/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/de/nodejs/api/webcrypto#class-cryptokey) Ein PEM-codierter privater Schlüssel.
    - `passphrase` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Eine optionale Passphrase für den privaten Schlüssel.
    - `padding` [\<crypto.constants\>](/de/nodejs/api/crypto#cryptoconstants) Ein optionaler Padding-Wert, der in `crypto.constants` definiert ist und folgende Werte haben kann: `crypto.constants.RSA_NO_PADDING` oder `crypto.constants.RSA_PKCS1_PADDING`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die zu verwendende String-Kodierung, wenn `buffer`, `key` oder `passphrase` Strings sind.


- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- Rückgabe: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) Ein neuer `Buffer` mit dem verschlüsselten Inhalt.

Verschlüsselt `buffer` mit `privateKey`. Die zurückgegebenen Daten können mit dem entsprechenden öffentlichen Schlüssel entschlüsselt werden, beispielsweise mit [`crypto.publicDecrypt()`](/de/nodejs/api/crypto#cryptopublicdecryptkey-buffer).

Wenn `privateKey` kein [`KeyObject`](/de/nodejs/api/crypto#class-keyobject) ist, verhält sich diese Funktion so, als ob `privateKey` an [`crypto.createPrivateKey()`](/de/nodejs/api/crypto#cryptocreateprivatekeykey) übergeben worden wäre. Wenn es sich um ein Objekt handelt, kann die Eigenschaft `padding` übergeben werden. Andernfalls verwendet diese Funktion `RSA_PKCS1_PADDING`.


### `crypto.publicDecrypt(key, buffer)` {#cryptopublicdecryptkey-buffer}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v15.0.0 | String, ArrayBuffer und CryptoKey als zulässige Schlüsseltypen hinzugefügt. Die Passphrase kann ein ArrayBuffer sein. Der Buffer kann ein String oder ArrayBuffer sein. Alle Typen, die Buffer akzeptieren, sind auf maximal 2 ** 31 - 1 Bytes begrenzt. |
| v11.6.0 | Diese Funktion unterstützt jetzt Schlüsselobjekte. |
| v1.1.0 | Hinzugefügt in: v1.1.0 |
:::

- `key` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/de/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/de/nodejs/api/webcrypto#class-cryptokey)
    - `passphrase` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Eine optionale Passphrase für den privaten Schlüssel.
    - `padding` [\<crypto.constants\>](/de/nodejs/api/crypto#cryptoconstants) Ein optionaler Padding-Wert, der in `crypto.constants` definiert ist und Folgendes sein kann: `crypto.constants.RSA_NO_PADDING` oder `crypto.constants.RSA_PKCS1_PADDING`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die zu verwendende String-Kodierung, wenn `buffer`, `key` oder `passphrase` Strings sind.

- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- Rückgabe: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) Ein neuer `Buffer` mit dem entschlüsselten Inhalt.

Entschlüsselt `buffer` mit `key`. `buffer` wurde zuvor mit dem entsprechenden privaten Schlüssel verschlüsselt, z. B. mit [`crypto.privateEncrypt()`](/de/nodejs/api/crypto#cryptoprivateencryptprivatekey-buffer).

Wenn `key` kein [`KeyObject`](/de/nodejs/api/crypto#class-keyobject) ist, verhält sich diese Funktion so, als ob `key` an [`crypto.createPublicKey()`](/de/nodejs/api/crypto#cryptocreatepublickeykey) übergeben worden wäre. Wenn es sich um ein Objekt handelt, kann die Eigenschaft `padding` übergeben werden. Andernfalls verwendet diese Funktion `RSA_PKCS1_PADDING`.

Da RSA Public Keys von Private Keys abgeleitet werden können, kann anstelle eines Public Keys ein Private Key übergeben werden.


### `crypto.publicEncrypt(key, buffer)` {#cryptopublicencryptkey-buffer}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v15.0.0 | String, ArrayBuffer und CryptoKey als zulässige Schlüsseltypen hinzugefügt. Die oaepLabel und die Passphrase können ArrayBuffer sein. Der Puffer kann ein String oder ArrayBuffer sein. Alle Typen, die Puffer akzeptieren, sind auf maximal 2 ** 31 - 1 Bytes beschränkt. |
| v12.11.0 | Die Option `oaepLabel` wurde hinzugefügt. |
| v12.9.0 | Die Option `oaepHash` wurde hinzugefügt. |
| v11.6.0 | Diese Funktion unterstützt jetzt Schlüsselobjekte. |
| v0.11.14 | Hinzugefügt in: v0.11.14 |
:::

- `key` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/de/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/de/nodejs/api/webcrypto#class-cryptokey)
    - `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/de/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/de/nodejs/api/webcrypto#class-cryptokey) Ein PEM-codierter öffentlicher oder privater Schlüssel, [\<KeyObject\>](/de/nodejs/api/crypto#class-keyobject) oder [\<CryptoKey\>](/de/nodejs/api/webcrypto#class-cryptokey).
    - `oaepHash` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die Hash-Funktion, die für OAEP-Padding und MGF1 verwendet werden soll. **Standard:** `'sha1'`
    - `oaepLabel` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Die Bezeichnung, die für OAEP-Padding verwendet werden soll. Wenn nicht angegeben, wird keine Bezeichnung verwendet.
    - `passphrase` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Eine optionale Passphrase für den privaten Schlüssel.
    - `padding` [\<crypto.constants\>](/de/nodejs/api/crypto#cryptoconstants) Ein optionaler Padding-Wert, der in `crypto.constants` definiert ist und Folgendes sein kann: `crypto.constants.RSA_NO_PADDING`, `crypto.constants.RSA_PKCS1_PADDING` oder `crypto.constants.RSA_PKCS1_OAEP_PADDING`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die Zeichenkettenkodierung, die verwendet werden soll, wenn `buffer`, `key`, `oaepLabel` oder `passphrase` Zeichenketten sind.

- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- Rückgabe: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) Ein neuer `Buffer` mit dem verschlüsselten Inhalt.

Verschlüsselt den Inhalt von `buffer` mit `key` und gibt einen neuen [`Buffer`](/de/nodejs/api/buffer) mit verschlüsseltem Inhalt zurück. Die zurückgegebenen Daten können mit dem entsprechenden privaten Schlüssel entschlüsselt werden, z. B. mit [`crypto.privateDecrypt()`](/de/nodejs/api/crypto#cryptoprivatedecryptprivatekey-buffer).

Wenn `key` kein [`KeyObject`](/de/nodejs/api/crypto#class-keyobject) ist, verhält sich diese Funktion so, als ob `key` an [`crypto.createPublicKey()`](/de/nodejs/api/crypto#cryptocreatepublickeykey) übergeben worden wäre. Wenn es sich um ein Objekt handelt, kann die Eigenschaft `padding` übergeben werden. Andernfalls verwendet diese Funktion `RSA_PKCS1_OAEP_PADDING`.

Da RSA-öffentliche Schlüssel von privaten Schlüsseln abgeleitet werden können, kann anstelle eines öffentlichen Schlüssels auch ein privater Schlüssel übergeben werden.


### `crypto.randomBytes(size[, callback])` {#cryptorandombytessize-callback}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Die Übergabe eines ungültigen Callbacks an das `callback`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v9.0.0 | Die Übergabe von `null` als `callback`-Argument wirft jetzt `ERR_INVALID_CALLBACK`. |
| v0.5.8 | Hinzugefügt in: v0.5.8 |
:::

- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der zu generierenden Bytes. `size` darf nicht größer als `2**31 - 1` sein.
- `callback` [\<Funktion\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `buf` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)
  
 
- Gibt zurück: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer), wenn die `callback`-Funktion nicht angegeben wird.

Generiert kryptografisch starke Pseudozufallsdaten. Das Argument `size` ist eine Zahl, die die Anzahl der zu generierenden Bytes angibt.

Wenn eine `callback`-Funktion bereitgestellt wird, werden die Bytes asynchron generiert und die `callback`-Funktion mit zwei Argumenten aufgerufen: `err` und `buf`. Wenn ein Fehler auftritt, ist `err` ein `Error`-Objekt; andernfalls ist es `null`. Das `buf`-Argument ist ein [`Buffer`](/de/nodejs/api/buffer), der die generierten Bytes enthält.

::: code-group
```js [ESM]
// Asynchron
const {
  randomBytes,
} = await import('node:crypto');

randomBytes(256, (err, buf) => {
  if (err) throw err;
  console.log(`${buf.length} Bytes an Zufallsdaten: ${buf.toString('hex')}`);
});
```

```js [CJS]
// Asynchron
const {
  randomBytes,
} = require('node:crypto');

randomBytes(256, (err, buf) => {
  if (err) throw err;
  console.log(`${buf.length} Bytes an Zufallsdaten: ${buf.toString('hex')}`);
});
```
:::

Wenn die `callback`-Funktion nicht bereitgestellt wird, werden die Zufallsbytes synchron generiert und als [`Buffer`](/de/nodejs/api/buffer) zurückgegeben. Ein Fehler wird ausgelöst, wenn ein Problem beim Generieren der Bytes auftritt.

::: code-group
```js [ESM]
// Synchron
const {
  randomBytes,
} = await import('node:crypto');

const buf = randomBytes(256);
console.log(
  `${buf.length} Bytes an Zufallsdaten: ${buf.toString('hex')}`);
```

```js [CJS]
// Synchron
const {
  randomBytes,
} = require('node:crypto');

const buf = randomBytes(256);
console.log(
  `${buf.length} Bytes an Zufallsdaten: ${buf.toString('hex')}`);
```
:::

Die `crypto.randomBytes()`-Methode wird erst abgeschlossen, wenn genügend Entropie verfügbar ist. Dies sollte normalerweise nicht länger als ein paar Millisekunden dauern. Die einzige Zeit, in der die Generierung der Zufallsbytes möglicherweise länger blockiert, ist direkt nach dem Booten, wenn das gesamte System noch wenig Entropie aufweist.

Diese API verwendet den Threadpool von libuv, was für einige Anwendungen überraschende und negative Auswirkungen auf die Leistung haben kann. Weitere Informationen finden Sie in der Dokumentation zu [`UV_THREADPOOL_SIZE`](/de/nodejs/api/cli#uv_threadpool_sizesize).

Die asynchrone Version von `crypto.randomBytes()` wird in einer einzelnen Threadpool-Anfrage ausgeführt. Um die Längenvarianz der Threadpool-Aufgaben zu minimieren, partitionieren Sie große `randomBytes`-Anforderungen, wenn Sie dies im Rahmen der Erfüllung einer Clientanforderung tun.


### `crypto.randomFill(buffer[, offset][, size], callback)` {#cryptorandomfillbuffer-offset-size-callback}

::: info [History]
| Version | Changes |
| --- | --- |
| v18.0.0 | Die Übergabe eines ungültigen Callbacks an das `callback`-Argument wirft nun `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v9.0.0 | Das `buffer`-Argument kann ein beliebiges `TypedArray` oder `DataView` sein. |
| v7.10.0, v6.13.0 | Hinzugefügt in: v7.10.0, v6.13.0 |
:::

- `buffer` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Muss angegeben werden. Die Größe des bereitgestellten `buffer` darf nicht größer als `2**31 - 1` sein.
- `offset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standard:** `0`
- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standard:** `buffer.length - offset`. Die `size` darf nicht größer als `2**31 - 1` sein.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `function(err, buf) {}`.

Diese Funktion ähnelt [`crypto.randomBytes()`](/de/nodejs/api/crypto#cryptorandombytessize-callback), erfordert aber, dass das erste Argument ein [`Buffer`](/de/nodejs/api/buffer) ist, der gefüllt wird. Sie erfordert auch, dass ein Callback übergeben wird.

Wenn die `callback`-Funktion nicht bereitgestellt wird, wird ein Fehler ausgegeben.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const { randomFill } = await import('node:crypto');

const buf = Buffer.alloc(10);
randomFill(buf, (err, buf) => {
  if (err) throw err;
  console.log(buf.toString('hex'));
});

randomFill(buf, 5, (err, buf) => {
  if (err) throw err;
  console.log(buf.toString('hex'));
});

// The above is equivalent to the following:
randomFill(buf, 5, 5, (err, buf) => {
  if (err) throw err;
  console.log(buf.toString('hex'));
});
```

```js [CJS]
const { randomFill } = require('node:crypto');
const { Buffer } = require('node:buffer');

const buf = Buffer.alloc(10);
randomFill(buf, (err, buf) => {
  if (err) throw err;
  console.log(buf.toString('hex'));
});

randomFill(buf, 5, (err, buf) => {
  if (err) throw err;
  console.log(buf.toString('hex'));
});

// The above is equivalent to the following:
randomFill(buf, 5, 5, (err, buf) => {
  if (err) throw err;
  console.log(buf.toString('hex'));
});
```
:::

Jede `ArrayBuffer`-, `TypedArray`- oder `DataView`-Instanz kann als `buffer` übergeben werden.

Obwohl dies Instanzen von `Float32Array` und `Float64Array` einschließt, sollte diese Funktion nicht verwendet werden, um zufällige Gleitkommazahlen zu erzeugen. Das Ergebnis kann `+Infinity`, `-Infinity` und `NaN` enthalten, und selbst wenn das Array nur endliche Zahlen enthält, stammen diese nicht aus einer gleichmäßigen Zufallsverteilung und haben keine aussagekräftigen Unter- oder Obergrenzen.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const { randomFill } = await import('node:crypto');

const a = new Uint32Array(10);
randomFill(a, (err, buf) => {
  if (err) throw err;
  console.log(Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength)
    .toString('hex'));
});

const b = new DataView(new ArrayBuffer(10));
randomFill(b, (err, buf) => {
  if (err) throw err;
  console.log(Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength)
    .toString('hex'));
});

const c = new ArrayBuffer(10);
randomFill(c, (err, buf) => {
  if (err) throw err;
  console.log(Buffer.from(buf).toString('hex'));
});
```

```js [CJS]
const { randomFill } = require('node:crypto');
const { Buffer } = require('node:buffer');

const a = new Uint32Array(10);
randomFill(a, (err, buf) => {
  if (err) throw err;
  console.log(Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength)
    .toString('hex'));
});

const b = new DataView(new ArrayBuffer(10));
randomFill(b, (err, buf) => {
  if (err) throw err;
  console.log(Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength)
    .toString('hex'));
});

const c = new ArrayBuffer(10);
randomFill(c, (err, buf) => {
  if (err) throw err;
  console.log(Buffer.from(buf).toString('hex'));
});
```
:::

Diese API verwendet den Threadpool von libuv, was für einige Anwendungen überraschende und negative Auswirkungen auf die Leistung haben kann. Weitere Informationen finden Sie in der Dokumentation zu [`UV_THREADPOOL_SIZE`](/de/nodejs/api/cli#uv_threadpool_sizesize).

Die asynchrone Version von `crypto.randomFill()` wird in einer einzigen Threadpool-Anfrage ausgeführt. Um die Längenvariation der Threadpool-Aufgaben zu minimieren, partitionieren Sie große `randomFill`-Anfragen, wenn Sie dies im Rahmen der Erfüllung einer Client-Anfrage tun.


### `crypto.randomFillSync(buffer[, offset][, size])` {#cryptorandomfillsyncbuffer-offset-size}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v9.0.0 | Das Argument `buffer` kann ein beliebiges `TypedArray` oder `DataView` sein. |
| v7.10.0, v6.13.0 | Hinzugefügt in: v7.10.0, v6.13.0 |
:::

- `buffer` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Muss angegeben werden. Die Größe des bereitgestellten `buffer` darf nicht größer als `2**31 - 1` sein.
- `offset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standard:** `0`
- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Standard:** `buffer.length - offset`. Die `size` darf nicht größer als `2**31 - 1` sein.
- Rückgabe: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Das Objekt, das als Argument `buffer` übergeben wurde.

Synchrone Version von [`crypto.randomFill()`](/de/nodejs/api/crypto#cryptorandomfillbuffer-offset-size-callback).

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const { randomFillSync } = await import('node:crypto');

const buf = Buffer.alloc(10);
console.log(randomFillSync(buf).toString('hex'));

randomFillSync(buf, 5);
console.log(buf.toString('hex'));

// Das obige ist äquivalent zu Folgendem:
randomFillSync(buf, 5, 5);
console.log(buf.toString('hex'));
```

```js [CJS]
const { randomFillSync } = require('node:crypto');
const { Buffer } = require('node:buffer');

const buf = Buffer.alloc(10);
console.log(randomFillSync(buf).toString('hex'));

randomFillSync(buf, 5);
console.log(buf.toString('hex'));

// Das obige ist äquivalent zu Folgendem:
randomFillSync(buf, 5, 5);
console.log(buf.toString('hex'));
```
:::

Jede `ArrayBuffer`-, `TypedArray`- oder `DataView`-Instanz kann als `buffer` übergeben werden.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const { randomFillSync } = await import('node:crypto');

const a = new Uint32Array(10);
console.log(Buffer.from(randomFillSync(a).buffer,
                        a.byteOffset, a.byteLength).toString('hex'));

const b = new DataView(new ArrayBuffer(10));
console.log(Buffer.from(randomFillSync(b).buffer,
                        b.byteOffset, b.byteLength).toString('hex'));

const c = new ArrayBuffer(10);
console.log(Buffer.from(randomFillSync(c)).toString('hex'));
```

```js [CJS]
const { randomFillSync } = require('node:crypto');
const { Buffer } = require('node:buffer');

const a = new Uint32Array(10);
console.log(Buffer.from(randomFillSync(a).buffer,
                        a.byteOffset, a.byteLength).toString('hex'));

const b = new DataView(new ArrayBuffer(10));
console.log(Buffer.from(randomFillSync(b).buffer,
                        b.byteOffset, b.byteLength).toString('hex'));

const c = new ArrayBuffer(10);
console.log(Buffer.from(randomFillSync(c)).toString('hex'));
```
:::


### `crypto.randomInt([min, ]max[, callback])` {#cryptorandomintmin-max-callback}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Das Übergeben eines ungültigen Callbacks an das `callback`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v14.10.0, v12.19.0 | Hinzugefügt in: v14.10.0, v12.19.0 |
:::

- `min` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Start des Zufallsbereichs (einschließlich). **Standard:** `0`.
- `max` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Ende des Zufallsbereichs (ausschließlich).
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `function(err, n) {}`.

Gibt eine zufällige Ganzzahl `n` zurück, so dass `min \<= n \< max` gilt. Diese Implementierung vermeidet [Modulo-Bias](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#Modulo_bias).

Der Bereich (`max - min`) muss kleiner als 2 sein. `min` und `max` müssen [sichere Ganzzahlen](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger) sein.

Wenn die `callback`-Funktion nicht angegeben wird, wird die zufällige Ganzzahl synchron generiert.

::: code-group
```js [ESM]
// Asynchron
const {
  randomInt,
} = await import('node:crypto');

randomInt(3, (err, n) => {
  if (err) throw err;
  console.log(`Zufallszahl gewählt aus (0, 1, 2): ${n}`);
});
```

```js [CJS]
// Asynchron
const {
  randomInt,
} = require('node:crypto');

randomInt(3, (err, n) => {
  if (err) throw err;
  console.log(`Zufallszahl gewählt aus (0, 1, 2): ${n}`);
});
```
:::

::: code-group
```js [ESM]
// Synchron
const {
  randomInt,
} = await import('node:crypto');

const n = randomInt(3);
console.log(`Zufallszahl gewählt aus (0, 1, 2): ${n}`);
```

```js [CJS]
// Synchron
const {
  randomInt,
} = require('node:crypto');

const n = randomInt(3);
console.log(`Zufallszahl gewählt aus (0, 1, 2): ${n}`);
```
:::

::: code-group
```js [ESM]
// Mit `min`-Argument
const {
  randomInt,
} = await import('node:crypto');

const n = randomInt(1, 7);
console.log(`Der Würfel ist gefallen: ${n}`);
```

```js [CJS]
// Mit `min`-Argument
const {
  randomInt,
} = require('node:crypto');

const n = randomInt(1, 7);
console.log(`Der Würfel ist gefallen: ${n}`);
```
:::


### `crypto.randomUUID([options])` {#cryptorandomuuidoptions}

**Hinzugefügt in: v15.6.0, v14.17.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `disableEntropyCache` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Standardmäßig generiert und speichert Node.js zur Leistungsverbesserung genügend Zufallsdaten, um bis zu 128 zufällige UUIDs zu generieren. Um eine UUID zu generieren, ohne den Cache zu verwenden, setzen Sie `disableEntropyCache` auf `true`. **Standardwert:** `false`.
  
 
- Gibt zurück: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Generiert eine zufällige [RFC 4122](https://www.rfc-editor.org/rfc/rfc4122.txt) Version 4 UUID. Die UUID wird mit einem kryptografischen Pseudozufallszahlengenerator erzeugt.

### `crypto.scrypt(password, salt, keylen[, options], callback)` {#cryptoscryptpassword-salt-keylen-options-callback}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Das Übergeben eines ungültigen Rückrufs an das `callback`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v15.0.0 | Die Argumente password und salt können auch ArrayBuffer-Instanzen sein. |
| v12.8.0, v10.17.0 | Der `maxmem`-Wert kann jetzt eine sichere Ganzzahl sein. |
| v10.9.0 | Die Optionsnamen `cost`, `blockSize` und `parallelization` wurden hinzugefügt. |
| v10.5.0 | Hinzugefügt in: v10.5.0 |
:::

- `password` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `salt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `keylen` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cost` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) CPU-/Speicher-Kostenparameter. Muss eine Zweierpotenz größer als eins sein. **Standardwert:** `16384`.
    - `blockSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Blockgrößenparameter. **Standardwert:** `8`.
    - `parallelization` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Parallelisierungsparameter. **Standardwert:** `1`.
    - `N` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Alias für `cost`. Es darf nur eine von beiden angegeben werden.
    - `r` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Alias für `blockSize`. Es darf nur eine von beiden angegeben werden.
    - `p` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Alias für `parallelization`. Es darf nur eine von beiden angegeben werden.
    - `maxmem` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Obere Speichergrenze. Es ist ein Fehler, wenn (ungefähr) `128 * N * r \> maxmem`. **Standardwert:** `32 * 1024 * 1024`.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `derivedKey` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)
  
 

Bietet eine asynchrone [scrypt](https://en.wikipedia.org/wiki/Scrypt)-Implementierung. Scrypt ist eine passwortbasierte Schlüsselableitungsfunktion, die rechnerisch und speichermäßig aufwendig sein soll, um Brute-Force-Angriffe unattraktiv zu machen.

Das `salt` sollte so eindeutig wie möglich sein. Es wird empfohlen, dass ein Salt zufällig und mindestens 16 Byte lang ist. Siehe [NIST SP 800-132](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-132.pdf) für Details.

Wenn Sie Zeichenketten für `password` oder `salt` übergeben, beachten Sie bitte [Hinweise zur Verwendung von Zeichenketten als Eingaben für kryptografische APIs](/de/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis).

Die `callback`-Funktion wird mit zwei Argumenten aufgerufen: `err` und `derivedKey`. `err` ist ein Ausnahmeobjekt, wenn die Schlüsselableitung fehlschlägt, andernfalls ist `err` `null`. `derivedKey` wird als [`Buffer`](/de/nodejs/api/buffer) an den Callback übergeben.

Es wird eine Ausnahme ausgelöst, wenn eines der Eingabeargumente ungültige Werte oder Typen angibt.



::: code-group
```js [ESM]
const {
  scrypt,
} = await import('node:crypto');

// Verwenden der werkseitigen Standardwerte.
scrypt('password', 'salt', 64, (err, derivedKey) => {
  if (err) throw err;
  console.log(derivedKey.toString('hex'));  // '3745e48...08d59ae'
});
// Verwenden eines benutzerdefinierten N-Parameters. Muss eine Zweierpotenz sein.
scrypt('password', 'salt', 64, { N: 1024 }, (err, derivedKey) => {
  if (err) throw err;
  console.log(derivedKey.toString('hex'));  // '3745e48...aa39b34'
});
```

```js [CJS]
const {
  scrypt,
} = require('node:crypto');

// Verwenden der werkseitigen Standardwerte.
scrypt('password', 'salt', 64, (err, derivedKey) => {
  if (err) throw err;
  console.log(derivedKey.toString('hex'));  // '3745e48...08d59ae'
});
// Verwenden eines benutzerdefinierten N-Parameters. Muss eine Zweierpotenz sein.
scrypt('password', 'salt', 64, { N: 1024 }, (err, derivedKey) => {
  if (err) throw err;
  console.log(derivedKey.toString('hex'));  // '3745e48...aa39b34'
});
```
:::


### `crypto.scryptSync(password, salt, keylen[, options])` {#cryptoscryptsyncpassword-salt-keylen-options}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v12.8.0, v10.17.0 | Der `maxmem`-Wert kann jetzt eine sichere Ganzzahl sein. |
| v10.9.0 | Die Optionsnamen `cost`, `blockSize` und `parallelization` wurden hinzugefügt. |
| v10.5.0 | Hinzugefügt in: v10.5.0 |
:::

- `password` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `salt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `keylen` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cost` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) CPU/Speicher-Kostenparameter. Muss eine Zweierpotenz größer als eins sein. **Standard:** `16384`.
    - `blockSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Blockgrößenparameter. **Standard:** `8`.
    - `parallelization` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Parallelisierungsparameter. **Standard:** `1`.
    - `N` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Alias für `cost`. Es darf nur einer von beiden angegeben werden.
    - `r` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Alias für `blockSize`. Es darf nur einer von beiden angegeben werden.
    - `p` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Alias für `parallelization`. Es darf nur einer von beiden angegeben werden.
    - `maxmem` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Obere Speichergrenze. Es ist ein Fehler, wenn (ungefähr) `128 * N * r \> maxmem`. **Standard:** `32 * 1024 * 1024`.


- Rückgabe: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)

Stellt eine synchrone [scrypt](https://en.wikipedia.org/wiki/Scrypt)-Implementierung bereit. Scrypt ist eine passwortbasierte Schlüsselerzeugungsfunktion, die so konzipiert ist, dass sie rechen- und speicherintensiv ist, um Brute-Force-Angriffe unattraktiv zu machen.

Der `salt` sollte so eindeutig wie möglich sein. Es wird empfohlen, dass ein Salt zufällig und mindestens 16 Byte lang ist. Siehe [NIST SP 800-132](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-132.pdf) für Details.

Wenn Strings für `password` oder `salt` übergeben werden, beachten Sie bitte [Vorbehalte bei der Verwendung von Strings als Eingaben für kryptografische APIs](/de/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis).

Eine Ausnahme wird ausgelöst, wenn die Schlüsselableitung fehlschlägt, andernfalls wird der abgeleitete Schlüssel als [`Buffer`](/de/nodejs/api/buffer) zurückgegeben.

Eine Ausnahme wird ausgelöst, wenn eines der Eingabeargumente ungültige Werte oder Typen angibt.

::: code-group
```js [ESM]
const {
  scryptSync,
} = await import('node:crypto');
// Verwenden der werkseitigen Standardeinstellungen.

const key1 = scryptSync('password', 'salt', 64);
console.log(key1.toString('hex'));  // '3745e48...08d59ae'
// Verwenden eines benutzerdefinierten N-Parameters. Muss eine Zweierpotenz sein.
const key2 = scryptSync('password', 'salt', 64, { N: 1024 });
console.log(key2.toString('hex'));  // '3745e48...aa39b34'
```

```js [CJS]
const {
  scryptSync,
} = require('node:crypto');
// Verwenden der werkseitigen Standardeinstellungen.

const key1 = scryptSync('password', 'salt', 64);
console.log(key1.toString('hex'));  // '3745e48...08d59ae'
// Verwenden eines benutzerdefinierten N-Parameters. Muss eine Zweierpotenz sein.
const key2 = scryptSync('password', 'salt', 64, { N: 1024 });
console.log(key2.toString('hex'));  // '3745e48...aa39b34'
```
:::


### `crypto.secureHeapUsed()` {#cryptosecureheapused}

**Hinzugefügt in: v15.6.0**

- Rückgabe: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `total` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die gesamte zugewiesene Größe des sicheren Heaps, wie mit dem Befehlszeilen-Flag `--secure-heap=n` angegeben.
    - `min` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die minimale Zuweisung aus dem sicheren Heap, wie mit dem Befehlszeilen-Flag `--secure-heap-min` angegeben.
    - `used` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Gesamtzahl der aktuell aus dem sicheren Heap zugewiesenen Bytes.
    - `utilization` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Das berechnete Verhältnis von `used` zu `total` zugewiesenen Bytes.



### `crypto.setEngine(engine[, flags])` {#cryptosetengineengine-flags}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v22.4.0, v20.16.0 | Unterstützung für benutzerdefinierte Engines in OpenSSL 3 ist veraltet. |
| v0.11.11 | Hinzugefügt in: v0.11.11 |
:::

- `engine` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `flags` [\<crypto.constants\>](/de/nodejs/api/crypto#cryptoconstants) **Standard:** `crypto.constants.ENGINE_METHOD_ALL`

Lädt und setzt die `engine` für einige oder alle OpenSSL-Funktionen (ausgewählt durch Flags). Die Unterstützung für benutzerdefinierte Engines in OpenSSL ist ab OpenSSL 3 veraltet.

`engine` kann entweder eine ID oder ein Pfad zur gemeinsam genutzten Bibliothek der Engine sein.

Das optionale Argument `flags` verwendet standardmäßig `ENGINE_METHOD_ALL`. Die `flags` sind ein Bitfeld, das einen oder eine Mischung der folgenden Flags annimmt (definiert in `crypto.constants`):

- `crypto.constants.ENGINE_METHOD_RSA`
- `crypto.constants.ENGINE_METHOD_DSA`
- `crypto.constants.ENGINE_METHOD_DH`
- `crypto.constants.ENGINE_METHOD_RAND`
- `crypto.constants.ENGINE_METHOD_EC`
- `crypto.constants.ENGINE_METHOD_CIPHERS`
- `crypto.constants.ENGINE_METHOD_DIGESTS`
- `crypto.constants.ENGINE_METHOD_PKEY_METHS`
- `crypto.constants.ENGINE_METHOD_PKEY_ASN1_METHS`
- `crypto.constants.ENGINE_METHOD_ALL`
- `crypto.constants.ENGINE_METHOD_NONE`


### `crypto.setFips(bool)` {#cryptosetfipsbool}

**Hinzugefügt in: v10.0.0**

- `bool` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, um den FIPS-Modus zu aktivieren.

Aktiviert den FIPS-konformen Krypto-Provider in einem FIPS-aktivierten Node.js-Build. Wirft einen Fehler, wenn der FIPS-Modus nicht verfügbar ist.

### `crypto.sign(algorithm, data, key[, callback])` {#cryptosignalgorithm-data-key-callback}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Die Übergabe eines ungültigen Callbacks an das Argument `callback` wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v15.12.0 | Optionales Callback-Argument hinzugefügt. |
| v13.2.0, v12.16.0 | Diese Funktion unterstützt jetzt IEEE-P1363 DSA- und ECDSA-Signaturen. |
| v12.0.0 | Hinzugefügt in: v12.0.0 |
:::

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
- `data` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `key` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/de/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/de/nodejs/api/webcrypto#class-cryptokey)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `signature` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)
  
 
- Gibt zurück: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer), wenn die `callback`-Funktion nicht bereitgestellt wird.

Berechnet und gibt die Signatur für `data` unter Verwendung des gegebenen privaten Schlüssels und Algorithmus zurück. Wenn `algorithm` `null` oder `undefined` ist, hängt der Algorithmus vom Schlüsseltyp ab (insbesondere Ed25519 und Ed448).

Wenn `key` kein [`KeyObject`](/de/nodejs/api/crypto#class-keyobject) ist, verhält sich diese Funktion so, als ob `key` an [`crypto.createPrivateKey()`](/de/nodejs/api/crypto#cryptocreateprivatekeykey) übergeben worden wäre. Wenn es sich um ein Objekt handelt, können die folgenden zusätzlichen Eigenschaften übergeben werden:

-  `dsaEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Für DSA und ECDSA gibt diese Option das Format der generierten Signatur an. Es kann eines der folgenden sein:
    - `'der'` (Standard): DER-codierte ASN.1-Signaturstruktur, die `(r, s)` codiert.
    - `'ieee-p1363'`: Signaturformat `r || s` wie in IEEE-P1363 vorgeschlagen.
  
 
-  `padding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Optionaler Auffüllwert für RSA, einer der folgenden:
    - `crypto.constants.RSA_PKCS1_PADDING` (Standard)
    - `crypto.constants.RSA_PKCS1_PSS_PADDING`
  
 `RSA_PKCS1_PSS_PADDING` verwendet MGF1 mit derselben Hash-Funktion, die zum Signieren der Nachricht verwendet wird, wie in Abschnitt 3.1 von [RFC 4055](https://www.rfc-editor.org/rfc/rfc4055.txt) angegeben.
-  `saltLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Salt-Länge für den Fall, dass `padding` `RSA_PKCS1_PSS_PADDING` ist. Der Sonderwert `crypto.constants.RSA_PSS_SALTLEN_DIGEST` setzt die Salt-Länge auf die Digest-Größe, `crypto.constants.RSA_PSS_SALTLEN_MAX_SIGN` (Standard) setzt sie auf den maximal zulässigen Wert.

Wenn die `callback`-Funktion bereitgestellt wird, verwendet diese Funktion den Threadpool von libuv.


### `crypto.subtle` {#cryptosubtle}

**Hinzugefügt in: v17.4.0**

- Typ: [\<SubtleCrypto\>](/de/nodejs/api/webcrypto#class-subtlecrypto)

Ein praktischer Alias für [`crypto.webcrypto.subtle`](/de/nodejs/api/webcrypto#class-subtlecrypto).

### `crypto.timingSafeEqual(a, b)` {#cryptotimingsafeequala-b}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v15.0.0 | Die Argumente a und b können auch ArrayBuffer sein. |
| v6.6.0 | Hinzugefügt in: v6.6.0 |
:::

- `a` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `b` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Diese Funktion vergleicht die zugrunde liegenden Bytes, die die gegebenen `ArrayBuffer`-, `TypedArray`- oder `DataView`-Instanzen darstellen, mithilfe eines Konstantzeit-Algorithmus.

Diese Funktion gibt keine Zeitinformationen preis, die es einem Angreifer ermöglichen würden, einen der Werte zu erraten. Dies ist geeignet, um HMAC-Digests oder geheime Werte wie Authentifizierungs-Cookies oder [Capability-URLs](https://www.w3.org/TR/capability-urls/) zu vergleichen.

`a` und `b` müssen beide `Buffer`s, `TypedArray`s oder `DataView`s sein, und sie müssen die gleiche Bytelänge haben. Es wird ein Fehler ausgelöst, wenn `a` und `b` unterschiedliche Bytelängen haben.

Wenn mindestens eines von `a` und `b` ein `TypedArray` mit mehr als einem Byte pro Eintrag ist, wie z. B. `Uint16Array`, wird das Ergebnis unter Verwendung der Plattform-Byte-Reihenfolge berechnet.

**Wenn beide Eingaben <code>Float32Array</code>s oder
<code>Float64Array</code>s sind, kann diese Funktion aufgrund der IEEE 754
Codierung von Gleitkommazahlen unerwartete Ergebnisse liefern. Insbesondere impliziert weder <code>x === y</code> noch
<code>Object.is(x, y)</code>, dass die Byte-Darstellungen von zwei Gleitkommazahlen
<code>x</code> und <code>y</code> gleich sind.**

Die Verwendung von `crypto.timingSafeEqual` garantiert nicht, dass der *umgebende* Code zeitsicher ist. Es sollte darauf geachtet werden, dass der umgebende Code keine Timing-Schwachstellen einführt.


### `crypto.verify(algorithm, data, key, signature[, callback])` {#cryptoverifyalgorithm-data-key-signature-callback}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Die Übergabe eines ungültigen Callbacks an das `callback`-Argument wirft nun `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v15.12.0 | Optionales Callback-Argument hinzugefügt. |
| v15.0.0 | Die Argumente Daten, Schlüssel und Signatur können auch ArrayBuffer sein. |
| v13.2.0, v12.16.0 | Diese Funktion unterstützt jetzt IEEE-P1363 DSA- und ECDSA-Signaturen. |
| v12.0.0 | Hinzugefügt in: v12.0.0 |
:::

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
- `data` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `key` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/de/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/de/nodejs/api/webcrypto#class-cryptokey)
- `signature` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `result` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` oder `false`, je nach Gültigkeit der Signatur für die Daten und den öffentlichen Schlüssel, wenn die `callback`-Funktion nicht bereitgestellt wird.

Überprüft die angegebene Signatur für `data` mit dem angegebenen Schlüssel und Algorithmus. Wenn `algorithm` `null` oder `undefined` ist, hängt der Algorithmus vom Schlüsseltyp ab (insbesondere Ed25519 und Ed448).

Wenn `key` kein [`KeyObject`](/de/nodejs/api/crypto#class-keyobject) ist, verhält sich diese Funktion so, als ob `key` an [`crypto.createPublicKey()`](/de/nodejs/api/crypto#cryptocreatepublickeykey) übergeben worden wäre. Wenn es sich um ein Objekt handelt, können die folgenden zusätzlichen Eigenschaften übergeben werden:

- `dsaEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Für DSA und ECDSA gibt diese Option das Format der Signatur an. Es kann eines der folgenden sein:
    - `'der'` (Standard): DER-kodierte ASN.1-Signaturstruktur, die `(r, s)` kodiert.
    - `'ieee-p1363'`: Signaturformat `r || s`, wie in IEEE-P1363 vorgeschlagen.

- `padding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Optionaler Padding-Wert für RSA, einer der folgenden:
    - `crypto.constants.RSA_PKCS1_PADDING` (Standard)
    - `crypto.constants.RSA_PKCS1_PSS_PADDING`

`RSA_PKCS1_PSS_PADDING` verwendet MGF1 mit derselben Hash-Funktion, die zum Signieren der Nachricht verwendet wurde, wie in Abschnitt 3.1 von [RFC 4055](https://www.rfc-editor.org/rfc/rfc4055.txt) angegeben.
- `saltLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Salt-Länge, wenn Padding `RSA_PKCS1_PSS_PADDING` ist. Der spezielle Wert `crypto.constants.RSA_PSS_SALTLEN_DIGEST` setzt die Salt-Länge auf die Digest-Größe, `crypto.constants.RSA_PSS_SALTLEN_MAX_SIGN` (Standard) setzt sie auf den maximal zulässigen Wert.

Das `signature`-Argument ist die zuvor berechnete Signatur für die `data`.

Da öffentliche Schlüssel von privaten Schlüsseln abgeleitet werden können, kann ein privater Schlüssel oder ein öffentlicher Schlüssel für `key` übergeben werden.

Wenn die `callback`-Funktion bereitgestellt wird, verwendet diese Funktion den Threadpool von libuv.


### `crypto.webcrypto` {#cryptowebcrypto}

**Hinzugefügt in: v15.0.0**

Typ: [\<Crypto\>](/de/nodejs/api/webcrypto#class-crypto) Eine Implementierung des Web Crypto API-Standards.

Weitere Informationen finden Sie in der [Web Crypto API-Dokumentation](/de/nodejs/api/webcrypto).

## Hinweise {#notes}

### Verwendung von Zeichenketten als Eingaben für kryptografische APIs {#using-strings-as-inputs-to-cryptographic-apis}

Aus historischen Gründen akzeptieren viele von Node.js bereitgestellte kryptografische APIs Zeichenketten als Eingaben, obwohl der zugrunde liegende kryptografische Algorithmus mit Byte-Sequenzen arbeitet. Zu diesen Instanzen gehören Klartexte, Chiffretexte, symmetrische Schlüssel, Initialisierungsvektoren, Passphrasen, Salts, Authentifizierungs-Tags und zusätzliche authentifizierte Daten.

Beim Übergeben von Zeichenketten an kryptografische APIs sind die folgenden Faktoren zu berücksichtigen.

-  Nicht alle Byte-Sequenzen sind gültige UTF-8-Zeichenketten. Wenn also eine Byte-Sequenz der Länge `n` von einer Zeichenkette abgeleitet wird, ist ihre Entropie im Allgemeinen geringer als die Entropie einer zufälligen oder pseudozufälligen Byte-Sequenz der Länge `n`. Zum Beispiel führt keine UTF-8-Zeichenkette zu der Byte-Sequenz `c0 af`. Geheime Schlüssel sollten fast ausschließlich zufällige oder pseudozufällige Byte-Sequenzen sein.
-  Wenn zufällige oder pseudozufällige Byte-Sequenzen in UTF-8-Zeichenketten konvertiert werden, können Teilsequenzen, die keine gültigen Codepunkte darstellen, durch das Unicode-Ersetzungszeichen (`U+FFFD`) ersetzt werden. Die Byte-Darstellung der resultierenden Unicode-Zeichenkette ist daher möglicherweise nicht gleich der Byte-Sequenz, aus der die Zeichenkette erstellt wurde. Die Ausgaben von Chiffren, Hash-Funktionen, Signaturalgorithmen und Schlüss ableitungsfunktionen sind pseudozufällige Byte-Sequenzen und sollten nicht als Unicode-Zeichenketten verwendet werden.
-  Wenn Zeichenketten aus Benutzereingaben stammen, können einige Unicode-Zeichen auf mehrere gleichwertige Arten dargestellt werden, die zu unterschiedlichen Byte-Sequenzen führen. Wenn Sie beispielsweise eine Benutzer-Passphrase an eine Schlüss ableitungsfunktion wie PBKDF2 oder Scrypt übergeben, hängt das Ergebnis der Schlüss ableitungsfunktion davon ab, ob die Zeichenkette zusammengesetzte oder zerlegte Zeichen verwendet. Node.js normalisiert keine Zeichendarstellungen. Entwickler sollten erwägen, [`String.prototype.normalize()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize) auf Benutzereingaben zu verwenden, bevor sie diese an kryptografische APIs übergeben.


### Legacy-Streams-API (vor Node.js 0.10) {#legacy-streams-api-prior-to-nodejs-010}

Das Crypto-Modul wurde zu Node.js hinzugefügt, bevor es das Konzept einer einheitlichen Stream-API und [`Buffer`](/de/nodejs/api/buffer)-Objekte zur Verarbeitung binärer Daten gab. Daher haben viele `crypto`-Klassen Methoden, die typischerweise nicht in anderen Node.js-Klassen zu finden sind, die die [Streams](/de/nodejs/api/stream)-API implementieren (z. B. `update()`, `final()` oder `digest()`). Außerdem akzeptierten und gaben viele Methoden standardmäßig `'latin1'`-kodierte Strings anstelle von `Buffer`s zurück. Diese Standardeinstellung wurde nach Node.js v0.8 geändert, um stattdessen standardmäßig [`Buffer`](/de/nodejs/api/buffer)-Objekte zu verwenden.

### Unterstützung für schwache oder kompromittierte Algorithmen {#support-for-weak-or-compromised-algorithms}

Das Modul `node:crypto` unterstützt weiterhin einige Algorithmen, die bereits kompromittiert sind und deren Verwendung nicht empfohlen wird. Die API ermöglicht auch die Verwendung von Chiffren und Hashes mit einer kleinen Schlüsselgröße, die für eine sichere Verwendung zu schwach sind.

Benutzer sollten die volle Verantwortung für die Auswahl des Krypto-Algorithmus und der Schlüsselgröße gemäß ihren Sicherheitsanforderungen übernehmen.

Basierend auf den Empfehlungen von [NIST SP 800-131A](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-131Ar2.pdf):

- MD5 und SHA-1 sind nicht mehr akzeptabel, wenn Kollisionsresistenz erforderlich ist, wie z. B. bei digitalen Signaturen.
- Es wird empfohlen, dass der mit RSA-, DSA- und DH-Algorithmen verwendete Schlüssel mindestens 2048 Bit und die Kurve von ECDSA und ECDH mindestens 224 Bit aufweist, um über mehrere Jahre sicher zu sein.
- Die DH-Gruppen von `modp1`, `modp2` und `modp5` haben eine Schlüsselgröße von weniger als 2048 Bit und werden nicht empfohlen.

Weitere Empfehlungen und Details finden Sie in der Referenz.

Einige Algorithmen, die bekannte Schwächen aufweisen und in der Praxis von geringer Relevanz sind, sind nur über den [Legacy-Provider](/de/nodejs/api/cli#--openssl-legacy-provider) verfügbar, der standardmäßig nicht aktiviert ist.

### CCM-Modus {#ccm-mode}

CCM ist einer der unterstützten [AEAD-Algorithmen](https://en.wikipedia.org/wiki/Authenticated_encryption). Anwendungen, die diesen Modus verwenden, müssen bei Verwendung der Cipher-API bestimmte Einschränkungen beachten:

- Die Länge des Authentifizierungs-Tags muss bei der Erstellung der Chiffre durch Festlegen der Option `authTagLength` angegeben werden und muss 4, 6, 8, 10, 12, 14 oder 16 Byte betragen.
- Die Länge des Initialisierungsvektors (Nonce) `N` muss zwischen 7 und 13 Byte liegen (`7 ≤ N ≤ 13`).
- Die Länge des Klartexts ist auf `2 ** (8 * (15 - N))` Byte begrenzt.
- Beim Entschlüsseln muss das Authentifizierungs-Tag über `setAuthTag()` festgelegt werden, bevor `update()` aufgerufen wird. Andernfalls schlägt die Entschlüsselung fehl und `final()` löst in Übereinstimmung mit Abschnitt 2.6 von [RFC 3610](https://www.rfc-editor.org/rfc/rfc3610.txt) einen Fehler aus.
- Die Verwendung von Stream-Methoden wie `write(data)`, `end(data)` oder `pipe()` im CCM-Modus kann fehlschlagen, da CCM nicht mehr als einen Daten-Chunk pro Instanz verarbeiten kann.
- Beim Übergeben zusätzlicher authentifizierter Daten (AAD) muss die Länge der tatsächlichen Nachricht in Byte über die Option `plaintextLength` an `setAAD()` übergeben werden. Viele Krypto-Bibliotheken enthalten das Authentifizierungs-Tag im Chiffretext, was bedeutet, dass sie Chiffretexte der Länge `plaintextLength + authTagLength` erzeugen. Node.js enthält das Authentifizierungs-Tag nicht, sodass die Chiffretextlänge immer `plaintextLength` beträgt. Dies ist nicht erforderlich, wenn kein AAD verwendet wird.
- Da CCM die gesamte Nachricht auf einmal verarbeitet, muss `update()` genau einmal aufgerufen werden.
- Auch wenn der Aufruf von `update()` ausreicht, um die Nachricht zu verschlüsseln/entschlüsseln, *müssen* Anwendungen `final()` aufrufen, um das Authentifizierungs-Tag zu berechnen oder zu überprüfen.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const {
  createCipheriv,
  createDecipheriv,
  randomBytes,
} = await import('node:crypto');

const key = 'keykeykeykeykeykeykeykey';
const nonce = randomBytes(12);

const aad = Buffer.from('0123456789', 'hex');

const cipher = createCipheriv('aes-192-ccm', key, nonce, {
  authTagLength: 16,
});
const plaintext = 'Hello world';
cipher.setAAD(aad, {
  plaintextLength: Buffer.byteLength(plaintext),
});
const ciphertext = cipher.update(plaintext, 'utf8');
cipher.final();
const tag = cipher.getAuthTag();

// Now transmit { ciphertext, nonce, tag }.

const decipher = createDecipheriv('aes-192-ccm', key, nonce, {
  authTagLength: 16,
});
decipher.setAuthTag(tag);
decipher.setAAD(aad, {
  plaintextLength: ciphertext.length,
});
const receivedPlaintext = decipher.update(ciphertext, null, 'utf8');

try {
  decipher.final();
} catch (err) {
  throw new Error('Authentication failed!', { cause: err });
}

console.log(receivedPlaintext);
```

```js [CJS]
const { Buffer } = require('node:buffer');
const {
  createCipheriv,
  createDecipheriv,
  randomBytes,
} = require('node:crypto');

const key = 'keykeykeykeykeykeykeykey';
const nonce = randomBytes(12);

const aad = Buffer.from('0123456789', 'hex');

const cipher = createCipheriv('aes-192-ccm', key, nonce, {
  authTagLength: 16,
});
const plaintext = 'Hello world';
cipher.setAAD(aad, {
  plaintextLength: Buffer.byteLength(plaintext),
});
const ciphertext = cipher.update(plaintext, 'utf8');
cipher.final();
const tag = cipher.getAuthTag();

// Now transmit { ciphertext, nonce, tag }.

const decipher = createDecipheriv('aes-192-ccm', key, nonce, {
  authTagLength: 16,
});
decipher.setAuthTag(tag);
decipher.setAAD(aad, {
  plaintextLength: ciphertext.length,
});
const receivedPlaintext = decipher.update(ciphertext, null, 'utf8');

try {
  decipher.final();
} catch (err) {
  throw new Error('Authentication failed!', { cause: err });
}

console.log(receivedPlaintext);
```
:::


### FIPS-Modus {#fips-mode}

Bei Verwendung von OpenSSL 3 unterstützt Node.js FIPS 140-2, wenn es mit einem geeigneten OpenSSL 3-Provider verwendet wird, z. B. dem [FIPS-Provider von OpenSSL 3](https://www.openssl.org/docs/man3.0/man7/crypto#FIPS-provider), der gemäß den Anweisungen in der [FIPS-README-Datei von OpenSSL](https://github.com/openssl/openssl/blob/openssl-3.0/README-FIPS.md) installiert werden kann.

Für FIPS-Unterstützung in Node.js benötigen Sie:

- Einen korrekt installierten OpenSSL 3 FIPS-Provider.
- Eine OpenSSL 3 [FIPS-Modulkonfigurationsdatei](https://www.openssl.org/docs/man3.0/man5/fips_config).
- Eine OpenSSL 3-Konfigurationsdatei, die auf die FIPS-Modulkonfigurationsdatei verweist.

Node.js muss mit einer OpenSSL-Konfigurationsdatei konfiguriert werden, die auf den FIPS-Provider verweist. Eine Beispielkonfigurationsdatei sieht wie folgt aus:

```text [TEXT]
nodejs_conf = nodejs_init

.include /<absoluter Pfad>/fipsmodule.cnf

[nodejs_init]
providers = provider_sect

[provider_sect]
default = default_sect
# Der FIPS-Abschnittsname sollte mit dem Abschnittsnamen in der {#the-fips-section-name-should-match-the-section-name-inside-the}
# eingeschlossenen fipsmodule.cnf übereinstimmen.
fips = fips_sect

[default_sect]
activate = 1
```
wobei `fipsmodule.cnf` die FIPS-Modulkonfigurationsdatei ist, die aus dem FIPS-Provider-Installationsschritt generiert wurde:

```bash [BASH]
openssl fipsinstall
```
Setzen Sie die Umgebungsvariable `OPENSSL_CONF` so, dass sie auf Ihre Konfigurationsdatei verweist, und `OPENSSL_MODULES` auf den Speicherort der dynamischen Bibliothek des FIPS-Providers. z.B.

```bash [BASH]
export OPENSSL_CONF=/<Pfad zur Konfigurationsdatei>/nodejs.cnf
export OPENSSL_MODULES=/<Pfad zur openssl lib>/ossl-modules
```
Der FIPS-Modus kann dann in Node.js entweder aktiviert werden durch:

- Starten von Node.js mit den Befehlszeilen-Flags `--enable-fips` oder `--force-fips`.
- Programmgesteuertes Aufrufen von `crypto.setFips(true)`.

Optional kann der FIPS-Modus in Node.js über die OpenSSL-Konfigurationsdatei aktiviert werden. z.B.

```text [TEXT]
nodejs_conf = nodejs_init

.include /<absoluter Pfad>/fipsmodule.cnf

[nodejs_init]
providers = provider_sect
alg_section = algorithm_sect

[provider_sect]
default = default_sect
# Der FIPS-Abschnittsname sollte mit dem Abschnittsnamen in der {#included-fipsmodulecnf}
# eingeschlossenen fipsmodule.cnf übereinstimmen.
fips = fips_sect

[default_sect]
activate = 1

[algorithm_sect]
default_properties = fips=yes
```

## Krypto-Konstanten {#the-fips-section-name-should-match-the-section-name-inside-the_1}

Die folgenden von `crypto.constants` exportierten Konstanten gelten für verschiedene Verwendungen der Module `node:crypto`, `node:tls` und `node:https` und sind im Allgemeinen spezifisch für OpenSSL.

### OpenSSL-Optionen {#included-fipsmodulecnf_1}

Weitere Informationen finden Sie in der [Liste der SSL-OP-Flags](https://wiki.openssl.org/index.php/List_of_SSL_OP_Flags#Table_of_Options).

| Konstante | Beschreibung |
|---|---|
| `SSL_OP_ALL` | Wendet mehrere Fehlerbehebungen innerhalb von OpenSSL an. Siehe [https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options.html](https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options) für Details. |
| `SSL_OP_ALLOW_NO_DHE_KEX` | Weist OpenSSL an, einen Nicht-[EC]DHE-basierten Schlüsselaustauschmodus für TLS v1.3 zuzulassen. |
| `SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION` | Erlaubt die Legacy-unsichere Neuverhandlung zwischen OpenSSL und ungepatchten Clients oder Servern. Siehe [https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options.html](https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options). |
| `SSL_OP_CIPHER_SERVER_PREFERENCE` | Versucht, die Einstellungen des Servers anstelle der des Clients zu verwenden, wenn eine Chiffre ausgewählt wird. Das Verhalten hängt von der Protokollversion ab. Siehe [https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options.html](https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options). |
| `SSL_OP_CISCO_ANYCONNECT` | Weist OpenSSL an, Ciscos Versionskennung von DTLS_BAD_VER zu verwenden. |
| `SSL_OP_COOKIE_EXCHANGE` | Weist OpenSSL an, Cookie-Exchange zu aktivieren. |
| `SSL_OP_CRYPTOPRO_TLSEXT_BUG` | Weist OpenSSL an, die Server-Hallo-Erweiterung aus einer frühen Version des Cryptopro-Entwurfs hinzuzufügen. |
| `SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS` | Weist OpenSSL an, eine in OpenSSL 0.9.6d hinzugefügte Problemumgehung für eine SSL 3.0/TLS 1.0-Schwachstelle zu deaktivieren. |
| `SSL_OP_LEGACY_SERVER_CONNECT` | Erlaubt die anfängliche Verbindung zu Servern, die RI nicht unterstützen. |
| `SSL_OP_NO_COMPRESSION` | Weist OpenSSL an, die Unterstützung für SSL/TLS-Komprimierung zu deaktivieren. |
| `SSL_OP_NO_ENCRYPT_THEN_MAC` | Weist OpenSSL an, Encrypt-then-MAC zu deaktivieren. |
| `SSL_OP_NO_QUERY_MTU` ||
| `SSL_OP_NO_RENEGOTIATION` | Weist OpenSSL an, die Neuverhandlung zu deaktivieren. |
| `SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION` | Weist OpenSSL an, immer eine neue Sitzung zu starten, wenn eine Neuverhandlung durchgeführt wird. |
| `SSL_OP_NO_SSLv2` | Weist OpenSSL an, SSL v2 zu deaktivieren. |
| `SSL_OP_NO_SSLv3` | Weist OpenSSL an, SSL v3 zu deaktivieren. |
| `SSL_OP_NO_TICKET` | Weist OpenSSL an, die Verwendung von RFC4507bis-Tickets zu deaktivieren. |
| `SSL_OP_NO_TLSv1` | Weist OpenSSL an, TLS v1 zu deaktivieren. |
| `SSL_OP_NO_TLSv1_1` | Weist OpenSSL an, TLS v1.1 zu deaktivieren. |
| `SSL_OP_NO_TLSv1_2` | Weist OpenSSL an, TLS v1.2 zu deaktivieren. |
| `SSL_OP_NO_TLSv1_3` | Weist OpenSSL an, TLS v1.3 zu deaktivieren. |
| `SSL_OP_PRIORITIZE_CHACHA` | Weist den OpenSSL-Server an, ChaCha20-Poly1305 zu priorisieren, wenn der Client dies tut. Diese Option hat keine Auswirkung, wenn `SSL_OP_CIPHER_SERVER_PREFERENCE` nicht aktiviert ist. |
| `SSL_OP_TLS_ROLLBACK_BUG` | Weist OpenSSL an, die Erkennung von Versions-Rollback-Angriffen zu deaktivieren. |

### OpenSSL Engine-Konstanten {#crypto-constants}

| Konstante | Beschreibung |
| --- | --- |
| `ENGINE_METHOD_RSA` | Beschränkt die Engine-Nutzung auf RSA |
| `ENGINE_METHOD_DSA` | Beschränkt die Engine-Nutzung auf DSA |
| `ENGINE_METHOD_DH` | Beschränkt die Engine-Nutzung auf DH |
| `ENGINE_METHOD_RAND` | Beschränkt die Engine-Nutzung auf RAND |
| `ENGINE_METHOD_EC` | Beschränkt die Engine-Nutzung auf EC |
| `ENGINE_METHOD_CIPHERS` | Beschränkt die Engine-Nutzung auf CIPHERS |
| `ENGINE_METHOD_DIGESTS` | Beschränkt die Engine-Nutzung auf DIGESTS |
| `ENGINE_METHOD_PKEY_METHS` | Beschränkt die Engine-Nutzung auf PKEY_METHS |
| `ENGINE_METHOD_PKEY_ASN1_METHS` | Beschränkt die Engine-Nutzung auf PKEY_ASN1_METHS |
| `ENGINE_METHOD_ALL` ||
| `ENGINE_METHOD_NONE` ||
### Andere OpenSSL-Konstanten {#openssl-options}

| Konstante | Beschreibung |
| --- | --- |
| `DH_CHECK_P_NOT_SAFE_PRIME` ||
| `DH_CHECK_P_NOT_PRIME` ||
| `DH_UNABLE_TO_CHECK_GENERATOR` ||
| `DH_NOT_SUITABLE_GENERATOR` ||
| `RSA_PKCS1_PADDING` ||
| `RSA_SSLV23_PADDING` ||
| `RSA_NO_PADDING` ||
| `RSA_PKCS1_OAEP_PADDING` ||
| `RSA_X931_PADDING` ||
| `RSA_PKCS1_PSS_PADDING` ||
| `RSA_PSS_SALTLEN_DIGEST` | Setzt die Salzlänge für `RSA_PKCS1_PSS_PADDING` beim Signieren oder Verifizieren auf die Digest-Größe. |
| `RSA_PSS_SALTLEN_MAX_SIGN` | Setzt die Salzlänge für `RSA_PKCS1_PSS_PADDING` beim Signieren von Daten auf den maximal zulässigen Wert. |
| `RSA_PSS_SALTLEN_AUTO` | Bewirkt, dass die Salzlänge für `RSA_PKCS1_PSS_PADDING` beim Verifizieren einer Signatur automatisch bestimmt wird. |
| `POINT_CONVERSION_COMPRESSED` ||
| `POINT_CONVERSION_UNCOMPRESSED` ||
| `POINT_CONVERSION_HYBRID` ||
### Node.js Crypto-Konstanten {#openssl-engine-constants}

| Konstante | Beschreibung |
| --- | --- |
| `defaultCoreCipherList` | Gibt die integrierte Standard-Cipher-Liste an, die von Node.js verwendet wird. |
| `defaultCipherList` | Gibt die aktive Standard-Cipher-Liste an, die vom aktuellen Node.js-Prozess verwendet wird. |

