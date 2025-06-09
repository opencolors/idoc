---
title: Documentación de Node.js - Crypto
description: El módulo Crypto de Node.js proporciona funcionalidades criptográficas que incluyen un conjunto de envoltorios para las funciones de hash, HMAC, cifrado, descifrado, firma y verificación de OpenSSL. Soporta varios algoritmos de cifrado, derivación de claves y firmas digitales, permitiendo a los desarrolladores asegurar datos y comunicaciones dentro de las aplicaciones de Node.js.
head:
  - - meta
    - name: og:title
      content: Documentación de Node.js - Crypto | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: El módulo Crypto de Node.js proporciona funcionalidades criptográficas que incluyen un conjunto de envoltorios para las funciones de hash, HMAC, cifrado, descifrado, firma y verificación de OpenSSL. Soporta varios algoritmos de cifrado, derivación de claves y firmas digitales, permitiendo a los desarrolladores asegurar datos y comunicaciones dentro de las aplicaciones de Node.js.
  - - meta
    - name: twitter:title
      content: Documentación de Node.js - Crypto | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: El módulo Crypto de Node.js proporciona funcionalidades criptográficas que incluyen un conjunto de envoltorios para las funciones de hash, HMAC, cifrado, descifrado, firma y verificación de OpenSSL. Soporta varios algoritmos de cifrado, derivación de claves y firmas digitales, permitiendo a los desarrolladores asegurar datos y comunicaciones dentro de las aplicaciones de Node.js.
---


# Crypto {#crypto}

::: tip [Estable: 2 - Estable]
[Estable: 2](/es/nodejs/api/documentation#stability-index) [Estabilidad: 2](/es/nodejs/api/documentation#stability-index) - Estable
:::

**Código fuente:** [lib/crypto.js](https://github.com/nodejs/node/blob/v23.5.0/lib/crypto.js)

El módulo `node:crypto` proporciona funcionalidad criptográfica que incluye un conjunto de wrappers para las funciones hash, HMAC, cifrado, descifrado, firma y verificación de OpenSSL.

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

## Determinar si el soporte de crypto no está disponible {#determining-if-crypto-support-is-unavailable}

Es posible que Node.js se construya sin incluir soporte para el módulo `node:crypto`. En tales casos, intentar `import` desde `crypto` o llamar a `require('node:crypto')` resultará en un error.

Cuando se utiliza CommonJS, el error lanzado puede ser capturado utilizando try/catch:

```js [CJS]
let crypto;
try {
  crypto = require('node:crypto');
} catch (err) {
  console.error('¡el soporte de crypto está deshabilitado!');
}
```
Cuando se utiliza la palabra clave léxica ESM `import`, el error solo puede ser capturado si un controlador para `process.on('uncaughtException')` está registrado *antes* de cualquier intento de cargar el módulo (utilizando, por ejemplo, un módulo de precarga).

Cuando se utiliza ESM, si existe la posibilidad de que el código se ejecute en una compilación de Node.js donde el soporte de crypto no está habilitado, considere la posibilidad de utilizar la función [`import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) en lugar de la palabra clave léxica `import`:

```js [ESM]
let crypto;
try {
  crypto = await import('node:crypto');
} catch (err) {
  console.error('¡el soporte de crypto está deshabilitado!');
}
```

## Clase: `Certificate` {#class-certificate}

**Agregado en: v0.11.8**

SPKAC es un mecanismo de Solicitud de Firma de Certificado implementado originalmente por Netscape y especificado formalmente como parte del elemento `keygen` de HTML5.

`\<keygen\>` está obsoleto desde [HTML 5.2](https://www.w3.org/TR/html52/changes#features-removed) y los nuevos proyectos ya no deberían usar este elemento.

El módulo `node:crypto` proporciona la clase `Certificate` para trabajar con datos SPKAC. El uso más común es el manejo de la salida generada por el elemento `\<keygen\>` de HTML5. Node.js utiliza internamente la [implementación SPKAC de OpenSSL](https://www.openssl.org/docs/man3.0/man1/openssl-spkac).

### Método estático: `Certificate.exportChallenge(spkac[, encoding])` {#static-method-certificateexportchallengespkac-encoding}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v15.0.0 | El argumento spkac puede ser un ArrayBuffer. Se limitó el tamaño del argumento spkac a un máximo de 2**31 - 1 bytes. |
| v9.0.0 | Agregado en: v9.0.0 |
:::

- `spkac` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codificación](/es/nodejs/api/buffer#buffers-and-character-encodings) de la cadena `spkac`.
- Devuelve: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) El componente de desafío de la estructura de datos `spkac`, que incluye una clave pública y un desafío.



::: code-group
```js [ESM]
const { Certificate } = await import('node:crypto');
const spkac = getSpkacSomehow();
const challenge = Certificate.exportChallenge(spkac);
console.log(challenge.toString('utf8'));
// Imprime: el desafío como una cadena UTF8
```

```js [CJS]
const { Certificate } = require('node:crypto');
const spkac = getSpkacSomehow();
const challenge = Certificate.exportChallenge(spkac);
console.log(challenge.toString('utf8'));
// Imprime: el desafío como una cadena UTF8
```
:::


### Método estático: `Certificate.exportPublicKey(spkac[, encoding])` {#static-method-certificateexportpublickeyspkac-encoding}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v15.0.0 | El argumento spkac puede ser un ArrayBuffer. Se limitó el tamaño del argumento spkac a un máximo de 2**31 - 1 bytes. |
| v9.0.0 | Añadido en: v9.0.0 |
:::

- `spkac` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codificación](/es/nodejs/api/buffer#buffers-and-character-encodings) de la cadena `spkac`.
- Devuelve: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) El componente de clave pública de la estructura de datos `spkac`, que incluye una clave pública y un desafío.

::: code-group
```js [ESM]
const { Certificate } = await import('node:crypto');
const spkac = getSpkacSomehow();
const publicKey = Certificate.exportPublicKey(spkac);
console.log(publicKey);
// Prints: the public key as <Buffer ...>
```

```js [CJS]
const { Certificate } = require('node:crypto');
const spkac = getSpkacSomehow();
const publicKey = Certificate.exportPublicKey(spkac);
console.log(publicKey);
// Prints: the public key as <Buffer ...>
```
:::

### Método estático: `Certificate.verifySpkac(spkac[, encoding])` {#static-method-certificateverifyspkacspkac-encoding}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v15.0.0 | El argumento spkac puede ser un ArrayBuffer. Se agregó la codificación. Se limitó el tamaño del argumento spkac a un máximo de 2**31 - 1 bytes. |
| v9.0.0 | Añadido en: v9.0.0 |
:::

- `spkac` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codificación](/es/nodejs/api/buffer#buffers-and-character-encodings) de la cadena `spkac`.
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` si la estructura de datos `spkac` dada es válida, `false` en caso contrario.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const { Certificate } = await import('node:crypto');

const spkac = getSpkacSomehow();
console.log(Certificate.verifySpkac(Buffer.from(spkac)));
// Prints: true or false
```

```js [CJS]
const { Buffer } = require('node:buffer');
const { Certificate } = require('node:crypto');

const spkac = getSpkacSomehow();
console.log(Certificate.verifySpkac(Buffer.from(spkac)));
// Prints: true or false
```
:::


### API Legado {#legacy-api}

::: danger [Estable: 0 - Obsoleto]
[Estable: 0](/es/nodejs/api/documentation#stability-index) [Estabilidad: 0](/es/nodejs/api/documentation#stability-index) - Obsoleto
:::

Como una interfaz legada, es posible crear nuevas instancias de la clase `crypto.Certificate` como se ilustra en los ejemplos a continuación.

#### `new crypto.Certificate()` {#new-cryptocertificate}

Las instancias de la clase `Certificate` pueden ser creadas usando la palabra clave `new` o llamando a `crypto.Certificate()` como una función:

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

**Añadido en: v0.11.8**

- `spkac` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codificación](/es/nodejs/api/buffer#buffers-and-character-encodings) de la cadena `spkac`.
- Devuelve: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) El componente de desafío de la estructura de datos `spkac`, que incluye una clave pública y un desafío.

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

**Agregado en: v0.11.8**

- `spkac` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codificación](/es/nodejs/api/buffer#buffers-and-character-encodings) de la cadena `spkac`.
- Devuelve: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) El componente de clave pública de la estructura de datos `spkac`, que incluye una clave pública y un desafío.

::: code-group
```js [ESM]
const { Certificate } = await import('node:crypto');
const cert = Certificate();
const spkac = getSpkacSomehow();
const publicKey = cert.exportPublicKey(spkac);
console.log(publicKey);
// Imprime: la clave pública como <Buffer ...>
```

```js [CJS]
const { Certificate } = require('node:crypto');
const cert = Certificate();
const spkac = getSpkacSomehow();
const publicKey = cert.exportPublicKey(spkac);
console.log(publicKey);
// Imprime: la clave pública como <Buffer ...>
```
:::

#### `certificate.verifySpkac(spkac[, encoding])` {#certificateverifyspkacspkac-encoding}

**Agregado en: v0.11.8**

- `spkac` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codificación](/es/nodejs/api/buffer#buffers-and-character-encodings) de la cadena `spkac`.
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` si la estructura de datos `spkac` dada es válida, `false` en caso contrario.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const { Certificate } = await import('node:crypto');

const cert = Certificate();
const spkac = getSpkacSomehow();
console.log(cert.verifySpkac(Buffer.from(spkac)));
// Imprime: true o false
```

```js [CJS]
const { Buffer } = require('node:buffer');
const { Certificate } = require('node:crypto');

const cert = Certificate();
const spkac = getSpkacSomehow();
console.log(cert.verifySpkac(Buffer.from(spkac)));
// Imprime: true o false
```
:::


## Clase: `Cipher` {#class-cipher}

**Añadido en: v0.1.94**

- Extiende: [\<stream.Transform\>](/es/nodejs/api/stream#class-streamtransform)

Las instancias de la clase `Cipher` se utilizan para cifrar datos. La clase se puede utilizar de dos maneras:

- Como un [stream](/es/nodejs/api/stream) que es tanto legible como escribible, donde los datos planos no cifrados se escriben para producir datos cifrados en el lado legible, o
- Utilizando los métodos [`cipher.update()`](/es/nodejs/api/crypto#cipherupdatedata-inputencoding-outputencoding) y [`cipher.final()`](/es/nodejs/api/crypto#cipherfinaloutputencoding) para producir los datos cifrados.

El método [`crypto.createCipheriv()`](/es/nodejs/api/crypto#cryptocreatecipherivalgorithm-key-iv-options) se utiliza para crear instancias de `Cipher`. Los objetos `Cipher` no deben crearse directamente utilizando la palabra clave `new`.

Ejemplo: Usando objetos `Cipher` como streams:

::: code-group
```js [ESM]
const {
  scrypt,
  randomFill,
  createCipheriv,
} = await import('node:crypto');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';

// First, we'll generate the key. The key length is dependent on the algorithm.
// In this case for aes192, it is 24 bytes (192 bits).
scrypt(password, 'salt', 24, (err, key) => {
  if (err) throw err;
  // Then, we'll generate a random initialization vector
  randomFill(new Uint8Array(16), (err, iv) => {
    if (err) throw err;

    // Once we have the key and iv, we can create and use the cipher...
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

// First, we'll generate the key. The key length is dependent on the algorithm.
// In this case for aes192, it is 24 bytes (192 bits).
scrypt(password, 'salt', 24, (err, key) => {
  if (err) throw err;
  // Then, we'll generate a random initialization vector
  randomFill(new Uint8Array(16), (err, iv) => {
    if (err) throw err;

    // Once we have the key and iv, we can create and use the cipher...
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

Ejemplo: Usando `Cipher` y streams canalizados:

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

// First, we'll generate the key. The key length is dependent on the algorithm.
// In this case for aes192, it is 24 bytes (192 bits).
scrypt(password, 'salt', 24, (err, key) => {
  if (err) throw err;
  // Then, we'll generate a random initialization vector
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

// First, we'll generate the key. The key length is dependent on the algorithm.
// In this case for aes192, it is 24 bytes (192 bits).
scrypt(password, 'salt', 24, (err, key) => {
  if (err) throw err;
  // Then, we'll generate a random initialization vector
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

Ejemplo: Usando los métodos [`cipher.update()`](/es/nodejs/api/crypto#cipherupdatedata-inputencoding-outputencoding) y [`cipher.final()`](/es/nodejs/api/crypto#cipherfinaloutputencoding):

::: code-group
```js [ESM]
const {
  scrypt,
  randomFill,
  createCipheriv,
} = await import('node:crypto');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';

// First, we'll generate the key. The key length is dependent on the algorithm.
// In this case for aes192, it is 24 bytes (192 bits).
scrypt(password, 'salt', 24, (err, key) => {
  if (err) throw err;
  // Then, we'll generate a random initialization vector
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

// First, we'll generate the key. The key length is dependent on the algorithm.
// In this case for aes192, it is 24 bytes (192 bits).
scrypt(password, 'salt', 24, (err, key) => {
  if (err) throw err;
  // Then, we'll generate a random initialization vector
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

**Agregado en: v0.1.94**

- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codificación](/es/nodejs/api/buffer#buffers-and-character-encodings) del valor de retorno.
- Devuelve: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Cualquier contenido cifrado restante. Si se especifica `outputEncoding`, se devuelve una cadena. Si no se proporciona `outputEncoding`, se devuelve un [`Buffer`](/es/nodejs/api/buffer).

Una vez que se ha llamado al método `cipher.final()`, el objeto `Cipher` ya no se puede usar para cifrar datos. Los intentos de llamar a `cipher.final()` más de una vez provocarán que se arroje un error.

### `cipher.getAuthTag()` {#ciphergetauthtag}

**Agregado en: v1.0.0**

- Devuelve: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) Cuando se utiliza un modo de cifrado autenticado (actualmente se admiten `GCM`, `CCM`, `OCB` y `chacha20-poly1305`), el método `cipher.getAuthTag()` devuelve un [`Buffer`](/es/nodejs/api/buffer) que contiene la *etiqueta de autenticación* que se ha calculado a partir de los datos proporcionados.

El método `cipher.getAuthTag()` solo debe llamarse una vez que el cifrado se haya completado utilizando el método [`cipher.final()`](/es/nodejs/api/crypto#cipherfinaloutputencoding).

Si la opción `authTagLength` se estableció durante la creación de la instancia `cipher`, esta función devolverá exactamente `authTagLength` bytes.

### `cipher.setAAD(buffer[, options])` {#ciphersetaadbuffer-options}

**Agregado en: v1.0.0**

- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.transform` opciones](/es/nodejs/api/stream#new-streamtransformoptions)
    - `plaintextLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La codificación de cadena que se utilizará cuando `buffer` sea una cadena.

- Devuelve: [\<Cipher\>](/es/nodejs/api/crypto#class-cipher) La misma instancia de `Cipher` para el encadenamiento de métodos.

Cuando se utiliza un modo de cifrado autenticado (actualmente se admiten `GCM`, `CCM`, `OCB` y `chacha20-poly1305`), el método `cipher.setAAD()` establece el valor utilizado para el parámetro de entrada *datos autenticados adicionales* (AAD).

La opción `plaintextLength` es opcional para `GCM` y `OCB`. Cuando se utiliza `CCM`, la opción `plaintextLength` debe especificarse y su valor debe coincidir con la longitud del texto sin cifrar en bytes. Consulte [modo CCM](/es/nodejs/api/crypto#ccm-mode).

El método `cipher.setAAD()` debe llamarse antes de [`cipher.update()`](/es/nodejs/api/crypto#cipherupdatedata-inputencoding-outputencoding).


### `cipher.setAutoPadding([autoPadding])` {#ciphersetautopaddingautopadding}

**Agregado en: v0.7.1**

- `autoPadding` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Predeterminado:** `true`
- Devuelve: [\<Cipher\>](/es/nodejs/api/crypto#class-cipher) La misma instancia de `Cipher` para el encadenamiento de métodos.

Cuando se utilizan algoritmos de cifrado por bloques, la clase `Cipher` agregará automáticamente relleno a los datos de entrada al tamaño de bloque apropiado. Para deshabilitar el relleno predeterminado, llame a `cipher.setAutoPadding(false)`.

Cuando `autoPadding` es `false`, la longitud de todos los datos de entrada debe ser un múltiplo del tamaño de bloque del cifrado o [`cipher.final()`](/es/nodejs/api/crypto#cipherfinaloutputencoding) generará un error. Deshabilitar el relleno automático es útil para el relleno no estándar, por ejemplo, usar `0x0` en lugar del relleno PKCS.

El método `cipher.setAutoPadding()` debe llamarse antes de [`cipher.final()`](/es/nodejs/api/crypto#cipherfinaloutputencoding).

### `cipher.update(data[, inputEncoding][, outputEncoding])` {#cipherupdatedata-inputencoding-outputencoding}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v6.0.0 | El `inputEncoding` predeterminado cambió de `binary` a `utf8`. |
| v0.1.94 | Agregado en: v0.1.94 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codificación](/es/nodejs/api/buffer#buffers-and-character-encodings) de los datos.
- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codificación](/es/nodejs/api/buffer#buffers-and-character-encodings) del valor devuelto.
- Devuelve: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Actualiza el cifrado con `data`. Si se proporciona el argumento `inputEncoding`, el argumento `data` es una cadena que utiliza la codificación especificada. Si no se proporciona el argumento `inputEncoding`, `data` debe ser un [`Buffer`](/es/nodejs/api/buffer), `TypedArray` o `DataView`. Si `data` es un [`Buffer`](/es/nodejs/api/buffer), `TypedArray` o `DataView`, entonces se ignora `inputEncoding`.

El `outputEncoding` especifica el formato de salida de los datos cifrados. Si se especifica `outputEncoding`, se devuelve una cadena que utiliza la codificación especificada. Si no se proporciona `outputEncoding`, se devuelve un [`Buffer`](/es/nodejs/api/buffer).

El método `cipher.update()` se puede llamar varias veces con datos nuevos hasta que se llame a [`cipher.final()`](/es/nodejs/api/crypto#cipherfinaloutputencoding). Llamar a `cipher.update()` después de [`cipher.final()`](/es/nodejs/api/crypto#cipherfinaloutputencoding) provocará que se produzca un error.


## Clase: `Decipher` {#class-decipher}

**Agregado en: v0.1.94**

- Extiende: [\<stream.Transform\>](/es/nodejs/api/stream#class-streamtransform)

Las instancias de la clase `Decipher` se utilizan para descifrar datos. La clase se puede usar de dos maneras:

- Como un [stream](/es/nodejs/api/stream) que es tanto legible como escribible, donde se escriben datos cifrados sin formato para producir datos descifrados en el lado legible, o
- Usando los métodos [`decipher.update()`](/es/nodejs/api/crypto#decipherupdatedata-inputencoding-outputencoding) y [`decipher.final()`](/es/nodejs/api/crypto#decipherfinaloutputencoding) para producir los datos descifrados.

El método [`crypto.createDecipheriv()`](/es/nodejs/api/crypto#cryptocreatedecipherivalgorithm-key-iv-options) se utiliza para crear instancias de `Decipher`. Los objetos `Decipher` no deben crearse directamente usando la palabra clave `new`.

Ejemplo: Usando objetos `Decipher` como streams:

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const {
  scryptSync,
  createDecipheriv,
} = await import('node:crypto');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';
// Key length is dependent on the algorithm. In this case for aes192, it is
// 24 bytes (192 bits).
// Use the async `crypto.scrypt()` instead.
const key = scryptSync(password, 'salt', 24);
// The IV is usually passed along with the ciphertext.
const iv = Buffer.alloc(16, 0); // Initialization vector.

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
  // Prints: some clear text data
});

// Encrypted with same algorithm, key and iv.
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
const password = 'Password used to generate key';
// Key length is dependent on the algorithm. In this case for aes192, it is
// 24 bytes (192 bits).
// Use the async `crypto.scrypt()` instead.
const key = scryptSync(password, 'salt', 24);
// The IV is usually passed along with the ciphertext.
const iv = Buffer.alloc(16, 0); // Initialization vector.

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
  // Prints: some clear text data
});

// Encrypted with same algorithm, key and iv.
const encrypted =
  'e5f79c5915c02171eec6b212d5520d44480993d7d622a7c4c2da32f6efda0ffa';
decipher.write(encrypted, 'hex');
decipher.end();
```
:::

Ejemplo: Usando `Decipher` y streams canalizados:

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
const password = 'Password used to generate key';
// Use the async `crypto.scrypt()` instead.
const key = scryptSync(password, 'salt', 24);
// The IV is usually passed along with the ciphertext.
const iv = Buffer.alloc(16, 0); // Initialization vector.

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
const password = 'Password used to generate key';
// Use the async `crypto.scrypt()` instead.
const key = scryptSync(password, 'salt', 24);
// The IV is usually passed along with the ciphertext.
const iv = Buffer.alloc(16, 0); // Initialization vector.

const decipher = createDecipheriv(algorithm, key, iv);

const input = createReadStream('test.enc');
const output = createWriteStream('test.js');

input.pipe(decipher).pipe(output);
```
:::

Ejemplo: Usando los métodos [`decipher.update()`](/es/nodejs/api/crypto#decipherupdatedata-inputencoding-outputencoding) y [`decipher.final()`](/es/nodejs/api/crypto#decipherfinaloutputencoding):

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const {
  scryptSync,
  createDecipheriv,
} = await import('node:crypto');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';
// Use the async `crypto.scrypt()` instead.
const key = scryptSync(password, 'salt', 24);
// The IV is usually passed along with the ciphertext.
const iv = Buffer.alloc(16, 0); // Initialization vector.

const decipher = createDecipheriv(algorithm, key, iv);

// Encrypted using same algorithm, key and iv.
const encrypted =
  'e5f79c5915c02171eec6b212d5520d44480993d7d622a7c4c2da32f6efda0ffa';
let decrypted = decipher.update(encrypted, 'hex', 'utf8');
decrypted += decipher.final('utf8');
console.log(decrypted);
// Prints: some clear text data
```

```js [CJS]
const {
  scryptSync,
  createDecipheriv,
} = require('node:crypto');
const { Buffer } = require('node:buffer');

const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key';
// Use the async `crypto.scrypt()` instead.
const key = scryptSync(password, 'salt', 24);
// The IV is usually passed along with the ciphertext.
const iv = Buffer.alloc(16, 0); // Initialization vector.

const decipher = createDecipheriv(algorithm, key, iv);

// Encrypted using same algorithm, key and iv.
const encrypted =
  'e5f79c5915c02171eec6b212d5520d44480993d7d622a7c4c2da32f6efda0ffa';
let decrypted = decipher.update(encrypted, 'hex', 'utf8');
decrypted += decipher.final('utf8');
console.log(decrypted);
// Prints: some clear text data
```
:::

### `decipher.final([outputEncoding])` {#decipherfinaloutputencoding}

**Añadido en: v0.1.94**

- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codificación](/es/nodejs/api/buffer#buffers-and-character-encodings) del valor de retorno.
- Devuelve: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Cualquier contenido descifrado restante. Si se especifica `outputEncoding`, se devuelve una cadena. Si no se proporciona `outputEncoding`, se devuelve un [`Buffer`](/es/nodejs/api/buffer).

Una vez que se ha llamado al método `decipher.final()`, el objeto `Decipher` ya no se puede utilizar para descifrar datos. Los intentos de llamar a `decipher.final()` más de una vez provocarán que se lance un error.

### `decipher.setAAD(buffer[, options])` {#deciphersetaadbuffer-options}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v15.0.0 | El argumento buffer puede ser una cadena o ArrayBuffer y está limitado a no más de 2 ** 31 - 1 bytes. |
| v7.2.0 | Este método ahora devuelve una referencia a `decipher`. |
| v1.0.0 | Añadido en: v1.0.0 |
:::

- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.transform` opciones](/es/nodejs/api/stream#new-streamtransformoptions) 
    - `plaintextLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Codificación de cadena a utilizar cuando `buffer` es una cadena.
  
 
- Devuelve: [\<Decipher\>](/es/nodejs/api/crypto#class-decipher) El mismo Decipher para el encadenamiento de métodos.

Cuando se utiliza un modo de cifrado autenticado (actualmente se admiten `GCM`, `CCM`, `OCB` y `chacha20-poly1305`), el método `decipher.setAAD()` establece el valor utilizado para el parámetro de entrada de *datos autenticados adicionales* (AAD).

El argumento `options` es opcional para `GCM`. Cuando se utiliza `CCM`, se debe especificar la opción `plaintextLength` y su valor debe coincidir con la longitud del texto cifrado en bytes. Consulte [modo CCM](/es/nodejs/api/crypto#ccm-mode).

El método `decipher.setAAD()` debe llamarse antes de [`decipher.update()`](/es/nodejs/api/crypto#decipherupdatedata-inputencoding-outputencoding).

Cuando se pasa una cadena como `buffer`, considere [advertencias al usar cadenas como entradas para las API criptográficas](/es/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis).


### `decipher.setAuthTag(buffer[, encoding])` {#deciphersetauthtagbuffer-encoding}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v22.0.0, v20.13.0 | El uso de longitudes de etiqueta GCM distintas de 128 bits sin especificar la opción `authTagLength` al crear `decipher` está obsoleto. |
| v15.0.0 | El argumento buffer puede ser una cadena o ArrayBuffer y está limitado a no más de 2 ** 31 - 1 bytes. |
| v11.0.0 | Este método ahora lanza un error si la longitud de la etiqueta GCM no es válida. |
| v7.2.0 | Este método ahora devuelve una referencia a `decipher`. |
| v1.0.0 | Añadido en: v1.0.0 |
:::

- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Codificación de cadena a utilizar cuando `buffer` es una cadena.
- Devuelve: [\<Decipher\>](/es/nodejs/api/crypto#class-decipher) El mismo Decipher para el encadenamiento de métodos.

Cuando se utiliza un modo de cifrado autenticado (actualmente se admiten `GCM`, `CCM`, `OCB` y `chacha20-poly1305`), el método `decipher.setAuthTag()` se utiliza para pasar la *etiqueta de autenticación* recibida. Si no se proporciona ninguna etiqueta, o si el texto cifrado ha sido manipulado, [`decipher.final()`](/es/nodejs/api/crypto#decipherfinaloutputencoding) lanzará un error, indicando que el texto cifrado debe ser descartado debido a un fallo de autenticación. Si la longitud de la etiqueta no es válida según [NIST SP 800-38D](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38d.pdf) o no coincide con el valor de la opción `authTagLength`, `decipher.setAuthTag()` lanzará un error.

El método `decipher.setAuthTag()` debe ser llamado antes de [`decipher.update()`](/es/nodejs/api/crypto#decipherupdatedata-inputencoding-outputencoding) para el modo `CCM` o antes de [`decipher.final()`](/es/nodejs/api/crypto#decipherfinaloutputencoding) para los modos `GCM` y `OCB` y `chacha20-poly1305`. `decipher.setAuthTag()` sólo puede ser llamado una vez.

Cuando se pasa una cadena como etiqueta de autenticación, por favor, considere [advertencias al usar cadenas como entradas para las APIs criptográficas](/es/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis).


### `decipher.setAutoPadding([autoPadding])` {#deciphersetautopaddingautopadding}

**Agregado en: v0.7.1**

- `autoPadding` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Predeterminado:** `true`
- Devuelve: [\<Decipher\>](/es/nodejs/api/crypto#class-decipher) El mismo Decipher para el encadenamiento de métodos.

Cuando los datos se han cifrado sin relleno de bloque estándar, llamar a `decipher.setAutoPadding(false)` desactivará el relleno automático para evitar que [`decipher.final()`](/es/nodejs/api/crypto#decipherfinaloutputencoding) compruebe y elimine el relleno.

Desactivar el relleno automático solo funcionará si la longitud de los datos de entrada es un múltiplo del tamaño del bloque de los cifrados.

El método `decipher.setAutoPadding()` debe ser llamado antes de [`decipher.final()`](/es/nodejs/api/crypto#decipherfinaloutputencoding).

### `decipher.update(data[, inputEncoding][, outputEncoding])` {#decipherupdatedata-inputencoding-outputencoding}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v6.0.0 | El `inputEncoding` predeterminado cambió de `binary` a `utf8`. |
| v0.1.94 | Agregado en: v0.1.94 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codificación](/es/nodejs/api/buffer#buffers-and-character-encodings) de la cadena `data`.
- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codificación](/es/nodejs/api/buffer#buffers-and-character-encodings) del valor de retorno.
- Devuelve: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Actualiza el descifrado con `data`. Si se proporciona el argumento `inputEncoding`, el argumento `data` es una cadena que utiliza la codificación especificada. Si no se proporciona el argumento `inputEncoding`, `data` debe ser un [`Buffer`](/es/nodejs/api/buffer). Si `data` es un [`Buffer`](/es/nodejs/api/buffer) entonces `inputEncoding` se ignora.

El `outputEncoding` especifica el formato de salida de los datos cifrados. Si se especifica el `outputEncoding`, se devuelve una cadena utilizando la codificación especificada. Si no se proporciona ningún `outputEncoding`, se devuelve un [`Buffer`](/es/nodejs/api/buffer).

El método `decipher.update()` se puede llamar varias veces con nuevos datos hasta que se llame a [`decipher.final()`](/es/nodejs/api/crypto#decipherfinaloutputencoding). Llamar a `decipher.update()` después de [`decipher.final()`](/es/nodejs/api/crypto#decipherfinaloutputencoding) provocará que se lance un error.

Incluso si el cifrado subyacente implementa la autenticación, la autenticidad y la integridad del texto plano devuelto por esta función pueden ser inciertas en este momento. Para los algoritmos de cifrado autenticados, la autenticidad generalmente solo se establece cuando la aplicación llama a [`decipher.final()`](/es/nodejs/api/crypto#decipherfinaloutputencoding).


## Clase: `DiffieHellman` {#class-diffiehellman}

**Añadido en: v0.5.0**

La clase `DiffieHellman` es una utilidad para crear intercambios de claves Diffie-Hellman.

Las instancias de la clase `DiffieHellman` se pueden crear utilizando la función [`crypto.createDiffieHellman()`](/es/nodejs/api/crypto#cryptocreatediffiehellmanprime-primeencoding-generator-generatorencoding).

::: code-group
```js [ESM]
import assert from 'node:assert';

const {
  createDiffieHellman,
} = await import('node:crypto');

// Generar las claves de Alice...
const alice = createDiffieHellman(2048);
const aliceKey = alice.generateKeys();

// Generar las claves de Bob...
const bob = createDiffieHellman(alice.getPrime(), alice.getGenerator());
const bobKey = bob.generateKeys();

// Intercambiar y generar el secreto...
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

// Generar las claves de Alice...
const alice = createDiffieHellman(2048);
const aliceKey = alice.generateKeys();

// Generar las claves de Bob...
const bob = createDiffieHellman(alice.getPrime(), alice.getGenerator());
const bobKey = bob.generateKeys();

// Intercambiar y generar el secreto...
const aliceSecret = alice.computeSecret(bobKey);
const bobSecret = bob.computeSecret(aliceKey);

// OK
assert.strictEqual(aliceSecret.toString('hex'), bobSecret.toString('hex'));
```
:::

### `diffieHellman.computeSecret(otherPublicKey[, inputEncoding][, outputEncoding])` {#diffiehellmancomputesecretotherpublickey-inputencoding-outputencoding}

**Añadido en: v0.5.0**

- `otherPublicKey` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codificación](/es/nodejs/api/buffer#buffers-and-character-encodings) de una cadena `otherPublicKey`.
- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codificación](/es/nodejs/api/buffer#buffers-and-character-encodings) del valor de retorno.
- Devuelve: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Calcula el secreto compartido usando `otherPublicKey` como la clave pública de la otra parte y devuelve el secreto compartido calculado. La clave proporcionada se interpreta utilizando el `inputEncoding` especificado, y el secreto se codifica utilizando el `outputEncoding` especificado. Si no se proporciona el `inputEncoding`, se espera que `otherPublicKey` sea un [`Buffer`](/es/nodejs/api/buffer), `TypedArray` o `DataView`.

Si se proporciona `outputEncoding`, se devuelve una cadena; de lo contrario, se devuelve un [`Buffer`](/es/nodejs/api/buffer).


### `diffieHellman.generateKeys([encoding])` {#diffiehellmangeneratekeysencoding}

**Añadido en: v0.5.0**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codificación](/es/nodejs/api/buffer#buffers-and-character-encodings) del valor de retorno.
- Devuelve: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Genera valores de clave Diffie-Hellman privada y pública a menos que ya hayan sido generados o calculados, y devuelve la clave pública en la `encoding` especificada. Esta clave debe ser transferida a la otra parte. Si se proporciona `encoding`, se devuelve una cadena; de lo contrario, se devuelve un [`Buffer`](/es/nodejs/api/buffer).

Esta función es un simple contenedor alrededor de [`DH_generate_key()`](https://www.openssl.org/docs/man3.0/man3/DH_generate_key). En particular, una vez que se ha generado o establecido una clave privada, la llamada a esta función solo actualiza la clave pública, pero no genera una nueva clave privada.

### `diffieHellman.getGenerator([encoding])` {#diffiehellmangetgeneratorencoding}

**Añadido en: v0.5.0**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codificación](/es/nodejs/api/buffer#buffers-and-character-encodings) del valor de retorno.
- Devuelve: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Devuelve el generador Diffie-Hellman en la `encoding` especificada. Si se proporciona `encoding`, se devuelve una cadena; de lo contrario, se devuelve un [`Buffer`](/es/nodejs/api/buffer).

### `diffieHellman.getPrime([encoding])` {#diffiehellmangetprimeencoding}

**Añadido en: v0.5.0**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codificación](/es/nodejs/api/buffer#buffers-and-character-encodings) del valor de retorno.
- Devuelve: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Devuelve el primo Diffie-Hellman en la `encoding` especificada. Si se proporciona `encoding`, se devuelve una cadena; de lo contrario, se devuelve un [`Buffer`](/es/nodejs/api/buffer).


### `diffieHellman.getPrivateKey([encoding])` {#diffiehellmangetprivatekeyencoding}

**Agregado en: v0.5.0**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codificación](/es/nodejs/api/buffer#buffers-and-character-encodings) del valor de retorno.
- Devuelve: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Devuelve la clave privada de Diffie-Hellman en la `encoding` especificada. Si se proporciona `encoding`, se devuelve una string; de lo contrario, se devuelve un [`Buffer`](/es/nodejs/api/buffer).

### `diffieHellman.getPublicKey([encoding])` {#diffiehellmangetpublickeyencoding}

**Agregado en: v0.5.0**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codificación](/es/nodejs/api/buffer#buffers-and-character-encodings) del valor de retorno.
- Devuelve: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Devuelve la clave pública de Diffie-Hellman en la `encoding` especificada. Si se proporciona `encoding`, se devuelve una string; de lo contrario, se devuelve un [`Buffer`](/es/nodejs/api/buffer).

### `diffieHellman.setPrivateKey(privateKey[, encoding])` {#diffiehellmansetprivatekeyprivatekey-encoding}

**Agregado en: v0.5.0**

- `privateKey` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codificación](/es/nodejs/api/buffer#buffers-and-character-encodings) de la string `privateKey`.

Establece la clave privada Diffie-Hellman. Si se proporciona el argumento `encoding`, se espera que `privateKey` sea una string. Si no se proporciona `encoding`, se espera que `privateKey` sea un [`Buffer`](/es/nodejs/api/buffer), `TypedArray` o `DataView`.

Esta función no calcula automáticamente la clave pública asociada. Se puede usar [`diffieHellman.setPublicKey()`](/es/nodejs/api/crypto#diffiehellmansetpublickeypublickey-encoding) o [`diffieHellman.generateKeys()`](/es/nodejs/api/crypto#diffiehellmangeneratekeysencoding) para proporcionar manualmente la clave pública o para derivarla automáticamente.


### `diffieHellman.setPublicKey(publicKey[, encoding])` {#diffiehellmansetpublickeypublickey-encoding}

**Agregado en: v0.5.0**

- `publicKey` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codificación](/es/nodejs/api/buffer#buffers-and-character-encodings) de la cadena `publicKey`.

Establece la clave pública de Diffie-Hellman. Si se proporciona el argumento `encoding`, se espera que `publicKey` sea una cadena. Si no se proporciona `encoding`, se espera que `publicKey` sea un [`Buffer`](/es/nodejs/api/buffer), `TypedArray` o `DataView`.

### `diffieHellman.verifyError` {#diffiehellmanverifyerror}

**Agregado en: v0.11.12**

Un campo de bits que contiene cualquier advertencia y/o error resultante de una verificación realizada durante la inicialización del objeto `DiffieHellman`.

Los siguientes valores son válidos para esta propiedad (como se define en el módulo `node:constants`):

- `DH_CHECK_P_NOT_SAFE_PRIME`
- `DH_CHECK_P_NOT_PRIME`
- `DH_UNABLE_TO_CHECK_GENERATOR`
- `DH_NOT_SUITABLE_GENERATOR`

## Clase: `DiffieHellmanGroup` {#class-diffiehellmangroup}

**Agregado en: v0.7.5**

La clase `DiffieHellmanGroup` toma un grupo modp bien conocido como su argumento. Funciona igual que `DiffieHellman`, excepto que no permite cambiar sus claves después de la creación. En otras palabras, no implementa los métodos `setPublicKey()` o `setPrivateKey()`.

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

Los siguientes grupos son compatibles:

- `'modp14'` (2048 bits, [RFC 3526](https://www.rfc-editor.org/rfc/rfc3526.txt) Sección 3)
- `'modp15'` (3072 bits, [RFC 3526](https://www.rfc-editor.org/rfc/rfc3526.txt) Sección 4)
- `'modp16'` (4096 bits, [RFC 3526](https://www.rfc-editor.org/rfc/rfc3526.txt) Sección 5)
- `'modp17'` (6144 bits, [RFC 3526](https://www.rfc-editor.org/rfc/rfc3526.txt) Sección 6)
- `'modp18'` (8192 bits, [RFC 3526](https://www.rfc-editor.org/rfc/rfc3526.txt) Sección 7)

Los siguientes grupos todavía son compatibles pero están obsoletos (ver [Advertencias](/es/nodejs/api/crypto#support-for-weak-or-compromised-algorithms)):

- `'modp1'` (768 bits, [RFC 2409](https://www.rfc-editor.org/rfc/rfc2409.txt) Sección 6.1)
- `'modp2'` (1024 bits, [RFC 2409](https://www.rfc-editor.org/rfc/rfc2409.txt) Sección 6.2)
- `'modp5'` (1536 bits, [RFC 3526](https://www.rfc-editor.org/rfc/rfc3526.txt) Sección 2)

Estos grupos obsoletos podrían eliminarse en futuras versiones de Node.js.


## Clase: `ECDH` {#class-ecdh}

**Agregado en: v0.11.14**

La clase `ECDH` es una utilidad para crear intercambios de claves Diffie-Hellman de curva elíptica (ECDH).

Las instancias de la clase `ECDH` se pueden crear usando la función [`crypto.createECDH()`](/es/nodejs/api/crypto#cryptocreateecdhcurvename).

::: code-group
```js [ESM]
import assert from 'node:assert';

const {
  createECDH,
} = await import('node:crypto');

// Genera las claves de Alice...
const alice = createECDH('secp521r1');
const aliceKey = alice.generateKeys();

// Genera las claves de Bob...
const bob = createECDH('secp521r1');
const bobKey = bob.generateKeys();

// Intercambia y genera el secreto...
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

// Genera las claves de Alice...
const alice = createECDH('secp521r1');
const aliceKey = alice.generateKeys();

// Genera las claves de Bob...
const bob = createECDH('secp521r1');
const bobKey = bob.generateKeys();

// Intercambia y genera el secreto...
const aliceSecret = alice.computeSecret(bobKey);
const bobSecret = bob.computeSecret(aliceKey);

assert.strictEqual(aliceSecret.toString('hex'), bobSecret.toString('hex'));
// OK
```
:::

### Método estático: `ECDH.convertKey(key, curve[, inputEncoding[, outputEncoding[, format]]])` {#static-method-ecdhconvertkeykey-curve-inputencoding-outputencoding-format}

**Agregado en: v10.0.0**

- `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `curve` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codificación](/es/nodejs/api/buffer#buffers-and-character-encodings) de la cadena `key`.
- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codificación](/es/nodejs/api/buffer#buffers-and-character-encodings) del valor de retorno.
- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Predeterminado:** `'uncompressed'`
- Devuelve: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Convierte la clave pública EC Diffie-Hellman especificada por `key` y `curve` al formato especificado por `format`. El argumento `format` especifica la codificación de puntos y puede ser `'compressed'`, `'uncompressed'` o `'hybrid'`. La clave suministrada se interpreta utilizando la `inputEncoding` especificada, y la clave devuelta se codifica utilizando la `outputEncoding` especificada.

Utilice [`crypto.getCurves()`](/es/nodejs/api/crypto#cryptogetcurves) para obtener una lista de nombres de curvas disponibles. En las versiones recientes de OpenSSL, `openssl ecparam -list_curves` también mostrará el nombre y la descripción de cada curva elíptica disponible.

Si no se especifica `format`, el punto se devolverá en formato `'uncompressed'`.

Si no se proporciona `inputEncoding`, se espera que `key` sea un [`Buffer`](/es/nodejs/api/buffer), `TypedArray` o `DataView`.

Ejemplo (descomprimiendo una clave):

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

// La clave convertida y la clave pública sin comprimir deben ser iguales
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

// La clave convertida y la clave pública sin comprimir deben ser iguales
console.log(uncompressedKey === ecdh.getPublicKey('hex'));
```
:::


### `ecdh.computeSecret(otherPublicKey[, inputEncoding][, outputEncoding])` {#ecdhcomputesecretotherpublickey-inputencoding-outputencoding}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v10.0.0 | Se cambió el formato de error para admitir mejor el error de clave pública no válida. |
| v6.0.0 | El `inputEncoding` predeterminado cambió de `binary` a `utf8`. |
| v0.11.14 | Añadido en: v0.11.14 |
:::

- `otherPublicKey` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codificación](/es/nodejs/api/buffer#buffers-and-character-encodings) de la cadena `otherPublicKey`.
- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codificación](/es/nodejs/api/buffer#buffers-and-character-encodings) del valor de retorno.
- Devuelve: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Calcula el secreto compartido usando `otherPublicKey` como la clave pública de la otra parte y devuelve el secreto compartido calculado. La clave suministrada se interpreta utilizando el `inputEncoding` especificado, y el secreto devuelto se codifica utilizando el `outputEncoding` especificado. Si no se proporciona el `inputEncoding`, se espera que `otherPublicKey` sea un [`Buffer`](/es/nodejs/api/buffer), `TypedArray` o `DataView`.

Si se proporciona `outputEncoding`, se devolverá una cadena; de lo contrario, se devolverá un [`Buffer`](/es/nodejs/api/buffer).

`ecdh.computeSecret` lanzará un error `ERR_CRYPTO_ECDH_INVALID_PUBLIC_KEY` cuando `otherPublicKey` se encuentre fuera de la curva elíptica. Dado que `otherPublicKey` generalmente se suministra desde un usuario remoto a través de una red insegura, asegúrese de manejar esta excepción en consecuencia.


### `ecdh.generateKeys([encoding[, format]])` {#ecdhgeneratekeysencoding-format}

**Agregado en: v0.11.14**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codificación](/es/nodejs/api/buffer#buffers-and-character-encodings) del valor de retorno.
- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Predeterminado:** `'uncompressed'`
- Devuelve: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Genera valores de clave privada y pública EC Diffie-Hellman, y devuelve la clave pública en el `format` y `encoding` especificados. Esta clave debe transferirse a la otra parte.

El argumento `format` especifica la codificación de puntos y puede ser `'compressed'` o `'uncompressed'`. Si no se especifica `format`, el punto se devolverá en formato `'uncompressed'`.

Si se proporciona `encoding`, se devuelve una cadena; de lo contrario, se devuelve un [`Buffer`](/es/nodejs/api/buffer).

### `ecdh.getPrivateKey([encoding])` {#ecdhgetprivatekeyencoding}

**Agregado en: v0.11.14**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codificación](/es/nodejs/api/buffer#buffers-and-character-encodings) del valor de retorno.
- Devuelve: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El EC Diffie-Hellman en el `encoding` especificado.

Si se especifica `encoding`, se devuelve una cadena; de lo contrario, se devuelve un [`Buffer`](/es/nodejs/api/buffer).

### `ecdh.getPublicKey([encoding][, format])` {#ecdhgetpublickeyencoding-format}

**Agregado en: v0.11.14**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codificación](/es/nodejs/api/buffer#buffers-and-character-encodings) del valor de retorno.
- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Predeterminado:** `'uncompressed'`
- Devuelve: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La clave pública EC Diffie-Hellman en el `encoding` y `format` especificados.

El argumento `format` especifica la codificación de puntos y puede ser `'compressed'` o `'uncompressed'`. Si no se especifica `format`, el punto se devolverá en formato `'uncompressed'`.

Si se especifica `encoding`, se devuelve una cadena; de lo contrario, se devuelve un [`Buffer`](/es/nodejs/api/buffer).


### `ecdh.setPrivateKey(privateKey[, encoding])` {#ecdhsetprivatekeyprivatekey-encoding}

**Añadido en: v0.11.14**

- `privateKey` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codificación](/es/nodejs/api/buffer#buffers-and-character-encodings) de la cadena `privateKey`.

Establece la clave privada EC Diffie-Hellman. Si se proporciona `encoding`, se espera que `privateKey` sea una cadena; de lo contrario, se espera que `privateKey` sea un [`Buffer`](/es/nodejs/api/buffer), `TypedArray` o `DataView`.

Si `privateKey` no es válido para la curva especificada cuando se creó el objeto `ECDH`, se genera un error. Al establecer la clave privada, también se genera el punto (clave) público asociado y se establece en el objeto `ECDH`.

### `ecdh.setPublicKey(publicKey[, encoding])` {#ecdhsetpublickeypublickey-encoding}

**Añadido en: v0.11.14**

**Obsoleto desde: v5.2.0**

::: danger [Estable: 0 - Obsoleto]
[Estable: 0](/es/nodejs/api/documentation#stability-index) [Estabilidad: 0](/es/nodejs/api/documentation#stability-index) - Obsoleto
:::

- `publicKey` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codificación](/es/nodejs/api/buffer#buffers-and-character-encodings) de la cadena `publicKey`.

Establece la clave pública EC Diffie-Hellman. Si se proporciona `encoding`, se espera que `publicKey` sea una cadena; de lo contrario, se espera un [`Buffer`](/es/nodejs/api/buffer), `TypedArray` o `DataView`.

Normalmente, no hay razón para llamar a este método porque `ECDH` solo requiere una clave privada y la clave pública de la otra parte para calcular el secreto compartido. Por lo general, se llamará a [`ecdh.generateKeys()`](/es/nodejs/api/crypto#ecdhgeneratekeysencoding-format) o [`ecdh.setPrivateKey()`](/es/nodejs/api/crypto#ecdhsetprivatekeyprivatekey-encoding). El método [`ecdh.setPrivateKey()`](/es/nodejs/api/crypto#ecdhsetprivatekeyprivatekey-encoding) intenta generar el punto/clave pública asociado con la clave privada que se está estableciendo.

Ejemplo (obtención de un secreto compartido):

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


## Clase: `Hash` {#class-hash}

**Añadido en: v0.1.92**

- Extiende: [\<stream.Transform\>](/es/nodejs/api/stream#class-streamtransform)

La clase `Hash` es una utilidad para crear resúmenes hash de datos. Puede utilizarse de dos maneras:

- Como un [stream](/es/nodejs/api/stream) que es tanto legible como escribible, donde los datos se escriben para producir un resumen hash calculado en el lado legible, o
- Utilizando los métodos [`hash.update()`](/es/nodejs/api/crypto#hashupdatedata-inputencoding) y [`hash.digest()`](/es/nodejs/api/crypto#hashdigestencoding) para producir el hash calculado.

El método [`crypto.createHash()`](/es/nodejs/api/crypto#cryptocreatehashalgorithm-options) se utiliza para crear instancias de `Hash`. Los objetos `Hash` no deben crearse directamente utilizando la palabra clave `new`.

Ejemplo: Utilización de objetos `Hash` como streams:

::: code-group
```js [ESM]
const {
  createHash,
} = await import('node:crypto');

const hash = createHash('sha256');

hash.on('readable', () => {
  // Sólo un elemento va a ser producido por el
  // stream hash.
  const data = hash.read();
  if (data) {
    console.log(data.toString('hex'));
    // Imprime:
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
  // Sólo un elemento va a ser producido por el
  // stream hash.
  const data = hash.read();
  if (data) {
    console.log(data.toString('hex'));
    // Imprime:
    //   6a2da20943931e9834fc12cfe5bb47bbd9ae43489a30726962b576f4e3993e50
  }
});

hash.write('some data to hash');
hash.end();
```
:::

Ejemplo: Utilización de `Hash` y streams canalizados:

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

Ejemplo: Utilización de los métodos [`hash.update()`](/es/nodejs/api/crypto#hashupdatedata-inputencoding) y [`hash.digest()`](/es/nodejs/api/crypto#hashdigestencoding):

::: code-group
```js [ESM]
const {
  createHash,
} = await import('node:crypto');

const hash = createHash('sha256');

hash.update('some data to hash');
console.log(hash.digest('hex'));
// Imprime:
//   6a2da20943931e9834fc12cfe5bb47bbd9ae43489a30726962b576f4e3993e50
```

```js [CJS]
const {
  createHash,
} = require('node:crypto');

const hash = createHash('sha256');

hash.update('some data to hash');
console.log(hash.digest('hex'));
// Imprime:
//   6a2da20943931e9834fc12cfe5bb47bbd9ae43489a30726962b576f4e3993e50
```
:::


### `hash.copy([options])` {#hashcopyoptions}

**Agregado en: v13.1.0**

- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opciones de [`stream.transform`](/es/nodejs/api/stream#new-streamtransformoptions)
- Devuelve: [\<Hash\>](/es/nodejs/api/crypto#class-hash)

Crea un nuevo objeto `Hash` que contiene una copia profunda del estado interno del objeto `Hash` actual.

El argumento opcional `options` controla el comportamiento del flujo. Para las funciones hash XOF como `'shake256'`, la opción `outputLength` se puede utilizar para especificar la longitud de salida deseada en bytes.

Se produce un error cuando se intenta copiar el objeto `Hash` después de que se haya llamado a su método [`hash.digest()`](/es/nodejs/api/crypto#hashdigestencoding).

::: code-group
```js [ESM]
// Calcula un hash rodante.
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
// Calcula un hash rodante.
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

**Agregado en: v0.1.92**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codificación](/es/nodejs/api/buffer#buffers-and-character-encodings) del valor de retorno.
- Devuelve: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Calcula el resumen de todos los datos pasados para ser hasheados (usando el método [`hash.update()`](/es/nodejs/api/crypto#hashupdatedata-inputencoding)). Si se proporciona `encoding` se devolverá una cadena; de lo contrario, se devuelve un [`Buffer`](/es/nodejs/api/buffer).

El objeto `Hash` no se puede volver a utilizar después de que se haya llamado al método `hash.digest()`. Las llamadas múltiples provocarán que se lance un error.


### `hash.update(data[, inputEncoding])` {#hashupdatedata-inputencoding}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v6.0.0 | El `inputEncoding` predeterminado cambió de `binary` a `utf8`. |
| v0.1.92 | Añadido en: v0.1.92 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codificación](/es/nodejs/api/buffer#buffers-and-character-encodings) de la cadena `data`.

Actualiza el contenido del hash con los `data` dados, cuya codificación se indica en `inputEncoding`. Si no se proporciona `encoding` y los `data` son una cadena, se aplica una codificación de `'utf8'`. Si `data` es un [`Buffer`](/es/nodejs/api/buffer), `TypedArray` o `DataView`, entonces se ignora `inputEncoding`.

Se puede llamar a esto muchas veces con nuevos datos a medida que se transmiten.

## Clase: `Hmac` {#class-hmac}

**Añadido en: v0.1.94**

- Extiende: [\<stream.Transform\>](/es/nodejs/api/stream#class-streamtransform)

La clase `Hmac` es una utilidad para crear resúmenes criptográficos HMAC. Se puede usar de una de estas dos maneras:

- Como un [stream](/es/nodejs/api/stream) que es tanto legible como escribible, donde los datos se escriben para producir un resumen HMAC calculado en el lado legible, o
- Usando los métodos [`hmac.update()`](/es/nodejs/api/crypto#hmacupdatedata-inputencoding) y [`hmac.digest()`](/es/nodejs/api/crypto#hmacdigestencoding) para producir el resumen HMAC calculado.

El método [`crypto.createHmac()`](/es/nodejs/api/crypto#cryptocreatehmacalgorithm-key-options) se usa para crear instancias de `Hmac`. Los objetos `Hmac` no deben crearse directamente usando la palabra clave `new`.

Ejemplo: Usando objetos `Hmac` como streams:

::: code-group
```js [ESM]
const {
  createHmac,
} = await import('node:crypto');

const hmac = createHmac('sha256', 'a secret');

hmac.on('readable', () => {
  // Only one element is going to be produced by the
  // hash stream.
  const data = hmac.read();
  if (data) {
    console.log(data.toString('hex'));
    // Prints:
    //   7fd04df92f636fd450bc841c9418e5825c17f33ad9c87c518115a45971f7f33ad9c87c518115a45971f7f77e
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
  // Only one element is going to be produced by the
  // hash stream.
  const data = hmac.read();
  if (data) {
    console.log(data.toString('hex'));
    // Prints:
    //   7fd04df92f636fd450bc841c9418e5825c17f33ad9c87c518115a45971f7f77e
  }
});

hmac.write('some data to hash');
hmac.end();
```
:::

Ejemplo: Usando `Hmac` y streams canalizados:

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

Ejemplo: Usando los métodos [`hmac.update()`](/es/nodejs/api/crypto#hmacupdatedata-inputencoding) y [`hmac.digest()`](/es/nodejs/api/crypto#hmacdigestencoding):

::: code-group
```js [ESM]
const {
  createHmac,
} = await import('node:crypto');

const hmac = createHmac('sha256', 'a secret');

hmac.update('some data to hash');
console.log(hmac.digest('hex'));
// Prints:
//   7fd04df92f636fd450bc841c9418e5825c17f33ad9c87c518115a45971f7f77e
```

```js [CJS]
const {
  createHmac,
} = require('node:crypto');

const hmac = createHmac('sha256', 'a secret');

hmac.update('some data to hash');
console.log(hmac.digest('hex'));
// Prints:
//   7fd04df92f636fd450bc841c9418e5825c17f33ad9c87c518115a45971f7f77e
```
:::


### `hmac.digest([encoding])` {#hmacdigestencoding}

**Agregado en: v0.1.94**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codificación](/es/nodejs/api/buffer#buffers-and-character-encodings) del valor de retorno.
- Devuelve: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Calcula el resumen HMAC de todos los datos pasados usando [`hmac.update()`](/es/nodejs/api/crypto#hmacupdatedata-inputencoding). Si se proporciona `encoding`, se devuelve una cadena; de lo contrario, se devuelve un [`Buffer`](/es/nodejs/api/buffer).

El objeto `Hmac` no se puede volver a utilizar después de que se haya llamado a `hmac.digest()`. Las llamadas múltiples a `hmac.digest()` provocarán que se lance un error.

### `hmac.update(data[, inputEncoding])` {#hmacupdatedata-inputencoding}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v6.0.0 | El `inputEncoding` predeterminado cambió de `binary` a `utf8`. |
| v0.1.94 | Agregado en: v0.1.94 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codificación](/es/nodejs/api/buffer#buffers-and-character-encodings) de la cadena `data`.

Actualiza el contenido de `Hmac` con los `data` dados, cuya codificación se da en `inputEncoding`. Si no se proporciona `encoding` y los `data` son una cadena, se aplica una codificación de `'utf8'`. Si `data` es un [`Buffer`](/es/nodejs/api/buffer), `TypedArray` o `DataView`, entonces `inputEncoding` se ignora.

Esto se puede llamar muchas veces con nuevos datos a medida que se transmiten.

## Clase: `KeyObject` {#class-keyobject}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v14.5.0, v12.19.0 | Las instancias de esta clase ahora se pueden pasar a hilos de trabajo usando `postMessage`. |
| v11.13.0 | Esta clase ahora se exporta. |
| v11.6.0 | Agregado en: v11.6.0 |
:::

Node.js usa una clase `KeyObject` para representar una clave simétrica o asimétrica, y cada tipo de clave expone diferentes funciones. Los métodos [`crypto.createSecretKey()`](/es/nodejs/api/crypto#cryptocreatesecretkeykey-encoding), [`crypto.createPublicKey()`](/es/nodejs/api/crypto#cryptocreatepublickeykey) y [`crypto.createPrivateKey()`](/es/nodejs/api/crypto#cryptocreateprivatekeykey) se utilizan para crear instancias de `KeyObject`. Los objetos `KeyObject` no deben crearse directamente usando la palabra clave `new`.

La mayoría de las aplicaciones deberían considerar usar la nueva API `KeyObject` en lugar de pasar claves como cadenas o `Buffer`s debido a las características de seguridad mejoradas.

Las instancias de `KeyObject` se pueden pasar a otros hilos a través de [`postMessage()`](/es/nodejs/api/worker_threads#portpostmessagevalue-transferlist). El receptor obtiene un `KeyObject` clonado y el `KeyObject` no necesita estar listado en el argumento `transferList`.


### Método estático: `KeyObject.from(key)` {#static-method-keyobjectfromkey}

**Añadido en: v15.0.0**

- `key` [\<CryptoKey\>](/es/nodejs/api/webcrypto#class-cryptokey)
- Devuelve: [\<KeyObject\>](/es/nodejs/api/crypto#class-keyobject)

Ejemplo: Convertir una instancia de `CryptoKey` a un `KeyObject`:

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
// Imprime: 32 (tamaño de la clave simétrica en bytes)
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
  // Imprime: 32 (tamaño de la clave simétrica en bytes)
})();
```
:::

### `keyObject.asymmetricKeyDetails` {#keyobjectasymmetrickeydetails}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v16.9.0 | Expone los parámetros de la secuencia `RSASSA-PSS-params` para las claves RSA-PSS. |
| v15.7.0 | Añadido en: v15.7.0 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `modulusLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Tamaño de la clave en bits (RSA, DSA).
    - `publicExponent`: [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) Exponente público (RSA).
    - `hashAlgorithm`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nombre del resumen del mensaje (RSA-PSS).
    - `mgf1HashAlgorithm`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nombre del resumen del mensaje utilizado por MGF1 (RSA-PSS).
    - `saltLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Longitud mínima de la sal en bytes (RSA-PSS).
    - `divisorLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Tamaño de `q` en bits (DSA).
    - `namedCurve`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nombre de la curva (EC).
  
 

Esta propiedad existe sólo en las claves asimétricas. Dependiendo del tipo de la clave, este objeto contiene información sobre la clave. Ninguna de la información obtenida a través de esta propiedad puede ser utilizada para identificar de forma única una clave o para comprometer la seguridad de la clave.

Para las claves RSA-PSS, si el material de la clave contiene una secuencia `RSASSA-PSS-params`, las propiedades `hashAlgorithm`, `mgf1HashAlgorithm` y `saltLength` se establecerán.

Otros detalles de la clave pueden ser expuestos a través de esta API utilizando atributos adicionales.


### `keyObject.asymmetricKeyType` {#keyobjectasymmetrickeytype}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v13.9.0, v12.17.0 | Se agregó soporte para `'dh'`. |
| v12.0.0 | Se agregó soporte para `'rsa-pss'`. |
| v12.0.0 | Esta propiedad ahora devuelve `undefined` para instancias de KeyObject de tipo no reconocido en lugar de abortar. |
| v12.0.0 | Se agregó soporte para `'x25519'` y `'x448'`. |
| v12.0.0 | Se agregó soporte para `'ed25519'` y `'ed448'`. |
| v11.6.0 | Agregado en: v11.6.0 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Para claves asimétricas, esta propiedad representa el tipo de clave. Los tipos de clave admitidos son:

- `'rsa'` (OID 1.2.840.113549.1.1.1)
- `'rsa-pss'` (OID 1.2.840.113549.1.1.10)
- `'dsa'` (OID 1.2.840.10040.4.1)
- `'ec'` (OID 1.2.840.10045.2.1)
- `'x25519'` (OID 1.3.101.110)
- `'x448'` (OID 1.3.101.111)
- `'ed25519'` (OID 1.3.101.112)
- `'ed448'` (OID 1.3.101.113)
- `'dh'` (OID 1.2.840.113549.1.3.1)

Esta propiedad es `undefined` para tipos `KeyObject` no reconocidos y claves simétricas.

### `keyObject.equals(otherKeyObject)` {#keyobjectequalsotherkeyobject}

**Agregado en: v17.7.0, v16.15.0**

- `otherKeyObject`: [\<KeyObject\>](/es/nodejs/api/crypto#class-keyobject) Un `KeyObject` con el que comparar `keyObject`.
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Devuelve `true` o `false` dependiendo de si las claves tienen exactamente el mismo tipo, valor y parámetros. Este método no es de [tiempo constante](https://en.wikipedia.org/wiki/Timing_attack).

### `keyObject.export([options])` {#keyobjectexportoptions}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v15.9.0 | Se agregó soporte para el formato `'jwk'`. |
| v11.6.0 | Agregado en: v11.6.0 |
:::

- `options`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- Devuelve: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Para claves simétricas, se pueden utilizar las siguientes opciones de codificación:

- `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Debe ser `'buffer'` (predeterminado) o `'jwk'`.

Para claves públicas, se pueden utilizar las siguientes opciones de codificación:

- `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Debe ser uno de `'pkcs1'` (solo RSA) o `'spki'`.
- `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Debe ser `'pem'`, `'der'` o `'jwk'`.

Para claves privadas, se pueden utilizar las siguientes opciones de codificación:

- `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Debe ser uno de `'pkcs1'` (solo RSA), `'pkcs8'` o `'sec1'` (solo EC).
- `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Debe ser `'pem'`, `'der'` o `'jwk'`.
- `cipher`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Si se especifica, la clave privada se cifrará con el `cipher` y la `passphrase` dados utilizando el cifrado basado en contraseña PKCS#5 v2.0.
- `passphrase`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) La contraseña para usar para el cifrado, vea `cipher`.

El tipo de resultado depende del formato de codificación seleccionado, cuando PEM el resultado es una cadena, cuando DER será un búfer que contiene los datos codificados como DER, cuando [JWK](https://tools.ietf.org/html/rfc7517) será un objeto.

Cuando se seleccionó el formato de codificación [JWK](https://tools.ietf.org/html/rfc7517), se ignoran todas las demás opciones de codificación.

Las claves de tipo PKCS#1, SEC1 y PKCS#8 se pueden cifrar utilizando una combinación de las opciones `cipher` y `format`. El `type` PKCS#8 se puede utilizar con cualquier `format` para cifrar cualquier algoritmo de clave (RSA, EC o DH) especificando un `cipher`. PKCS#1 y SEC1 solo se pueden cifrar especificando un `cipher` cuando se utiliza el `format` PEM. Para una máxima compatibilidad, utilice PKCS#8 para claves privadas cifradas. Dado que PKCS#8 define su propio mecanismo de cifrado, el cifrado a nivel de PEM no es compatible al cifrar una clave PKCS#8. Consulte [RFC 5208](https://www.rfc-editor.org/rfc/rfc5208.txt) para el cifrado PKCS#8 y [RFC 1421](https://www.rfc-editor.org/rfc/rfc1421.txt) para el cifrado PKCS#1 y SEC1.


### `keyObject.symmetricKeySize` {#keyobjectsymmetrickeysize}

**Añadido en: v11.6.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Para claves secretas, esta propiedad representa el tamaño de la clave en bytes. Esta propiedad es `undefined` para claves asimétricas.

### `keyObject.toCryptoKey(algorithm, extractable, keyUsages)` {#keyobjecttocryptokeyalgorithm-extractable-keyusages}

**Añadido en: v23.0.0**

- `algorithm`: [\<AlgorithmIdentifier\>](/es/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaHashedImportParams\>](/es/nodejs/api/webcrypto#class-rsahashedimportparams) | [\<EcKeyImportParams\>](/es/nodejs/api/webcrypto#class-eckeyimportparams) | [\<HmacImportParams\>](/es/nodejs/api/webcrypto#class-hmacimportparams)
- `extractable`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `keyUsages`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Consulte [Usos de clave](/es/nodejs/api/webcrypto#cryptokeyusages).
- Devuelve: [\<CryptoKey\>](/es/nodejs/api/webcrypto#class-cryptokey)

Convierte una instancia de `KeyObject` en una `CryptoKey`.

### `keyObject.type` {#keyobjecttype}

**Añadido en: v11.6.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Dependiendo del tipo de este `KeyObject`, esta propiedad es `'secret'` para claves secretas (simétricas), `'public'` para claves públicas (asimétricas) o `'private'` para claves privadas (asimétricas).

## Clase: `Sign` {#class-sign}

**Añadido en: v0.1.92**

- Extiende: [\<stream.Writable\>](/es/nodejs/api/stream#class-streamwritable)

La clase `Sign` es una utilidad para generar firmas. Se puede usar de dos maneras:

- Como un [flujo](/es/nodejs/api/stream) de escritura, donde se escriben los datos que se van a firmar y el método [`sign.sign()`](/es/nodejs/api/crypto#signsignprivatekey-outputencoding) se utiliza para generar y devolver la firma, o
- Usando los métodos [`sign.update()`](/es/nodejs/api/crypto#signupdatedata-inputencoding) y [`sign.sign()`](/es/nodejs/api/crypto#signsignprivatekey-outputencoding) para producir la firma.

El método [`crypto.createSign()`](/es/nodejs/api/crypto#cryptocreatesignalgorithm-options) se utiliza para crear instancias de `Sign`. El argumento es el nombre de cadena de la función hash que se va a utilizar. Los objetos `Sign` no deben crearse directamente utilizando la palabra clave `new`.

Ejemplo: Usando objetos `Sign` y [`Verify`](/es/nodejs/api/crypto#class-verify) como flujos:

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

Ejemplo: Usando los métodos [`sign.update()`](/es/nodejs/api/crypto#signupdatedata-inputencoding) y [`verify.update()`](/es/nodejs/api/crypto#verifyupdatedata-inputencoding):

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

::: info [Historia]
| Versión | Cambios |
| --- | --- |
| v15.0.0 | La privateKey también puede ser un ArrayBuffer y CryptoKey. |
| v13.2.0, v12.16.0 | Esta función ahora es compatible con firmas IEEE-P1363 DSA y ECDSA. |
| v12.0.0 | Esta función ahora es compatible con claves RSA-PSS. |
| v11.6.0 | Esta función ahora es compatible con objetos de clave. |
| v8.0.0 | Se agregó soporte para RSASSA-PSS y opciones adicionales. |
| v0.1.92 | Agregado en: v0.1.92 |
:::

- `privateKey` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/es/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/es/nodejs/api/webcrypto#class-cryptokey)
    - `dsaEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `padding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `saltLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)


- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codificación](/es/nodejs/api/buffer#buffers-and-character-encodings) del valor de retorno.
- Devuelve: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Calcula la firma de todos los datos pasados a través de [`sign.update()`](/es/nodejs/api/crypto#signupdatedata-inputencoding) o [`sign.write()`](/es/nodejs/api/stream#writablewritechunk-encoding-callback).

Si `privateKey` no es un [`KeyObject`](/es/nodejs/api/crypto#class-keyobject), esta función se comporta como si `privateKey` se hubiera pasado a [`crypto.createPrivateKey()`](/es/nodejs/api/crypto#cryptocreateprivatekeykey). Si es un objeto, se pueden pasar las siguientes propiedades adicionales:

- `dsaEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Para DSA y ECDSA, esta opción especifica el formato de la firma generada. Puede ser uno de los siguientes:
    - `'der'` (predeterminado): estructura de firma ASN.1 codificada en DER que codifica `(r, s)`.
    - `'ieee-p1363'`: Formato de firma `r || s` como se propone en IEEE-P1363.


- `padding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Valor de relleno opcional para RSA, uno de los siguientes:
    - `crypto.constants.RSA_PKCS1_PADDING` (predeterminado)
    - `crypto.constants.RSA_PKCS1_PSS_PADDING`

`RSA_PKCS1_PSS_PADDING` usará MGF1 con la misma función hash utilizada para firmar el mensaje como se especifica en la sección 3.1 de [RFC 4055](https://www.rfc-editor.org/rfc/rfc4055.txt), a menos que se haya especificado una función hash MGF1 como parte de la clave de acuerdo con la sección 3.3 de [RFC 4055](https://www.rfc-editor.org/rfc/rfc4055.txt).
- `saltLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Longitud de la sal cuando el relleno es `RSA_PKCS1_PSS_PADDING`. El valor especial `crypto.constants.RSA_PSS_SALTLEN_DIGEST` establece la longitud de la sal al tamaño del resumen, `crypto.constants.RSA_PSS_SALTLEN_MAX_SIGN` (predeterminado) la establece al valor máximo permisible.

Si se proporciona `outputEncoding`, se devuelve una cadena; de lo contrario, se devuelve un [`Buffer`](/es/nodejs/api/buffer).

El objeto `Sign` no se puede volver a utilizar después de que se haya llamado al método `sign.sign()`. Varias llamadas a `sign.sign()` provocarán que se produzca un error.


### `sign.update(data[, inputEncoding])` {#signupdatedata-inputencoding}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v6.0.0 | La `inputEncoding` predeterminada cambió de `binary` a `utf8`. |
| v0.1.92 | Añadido en: v0.1.92 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codificación](/es/nodejs/api/buffer#buffers-and-character-encodings) de la cadena `data`.

Actualiza el contenido de `Sign` con los `data` dados, cuya codificación se indica en `inputEncoding`. Si no se proporciona `encoding` y `data` es una cadena, se aplica una codificación de `'utf8'`. Si `data` es un [`Buffer`](/es/nodejs/api/buffer), `TypedArray` o `DataView`, entonces se ignora `inputEncoding`.

Esto se puede llamar muchas veces con datos nuevos a medida que se transmiten.

## Clase: `Verify` {#class-verify}

**Añadido en: v0.1.92**

- Extiende: [\<stream.Writable\>](/es/nodejs/api/stream#class-streamwritable)

La clase `Verify` es una utilidad para verificar firmas. Se puede utilizar de una de estas dos maneras:

- Como un [stream](/es/nodejs/api/stream) de escritura donde los datos escritos se utilizan para validar la firma suministrada, o
- Utilizando los métodos [`verify.update()`](/es/nodejs/api/crypto#verifyupdatedata-inputencoding) y [`verify.verify()`](/es/nodejs/api/crypto#verifyverifyobject-signature-signatureencoding) para verificar la firma.

El método [`crypto.createVerify()`](/es/nodejs/api/crypto#cryptocreateverifyalgorithm-options) se utiliza para crear instancias de `Verify`. Los objetos `Verify` no se deben crear directamente utilizando la palabra clave `new`.

Ver [`Sign`](/es/nodejs/api/crypto#class-sign) para ejemplos.

### `verify.update(data[, inputEncoding])` {#verifyupdatedata-inputencoding}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v6.0.0 | La `inputEncoding` predeterminada cambió de `binary` a `utf8`. |
| v0.1.92 | Añadido en: v0.1.92 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codificación](/es/nodejs/api/buffer#buffers-and-character-encodings) de la cadena `data`.

Actualiza el contenido de `Verify` con los `data` dados, cuya codificación se indica en `inputEncoding`. Si no se proporciona `inputEncoding` y `data` es una cadena, se aplica una codificación de `'utf8'`. Si `data` es un [`Buffer`](/es/nodejs/api/buffer), `TypedArray` o `DataView`, entonces se ignora `inputEncoding`.

Esto se puede llamar muchas veces con datos nuevos a medida que se transmiten.


### `verify.verify(object, signature[, signatureEncoding])` {#verifyverifyobject-signature-signatureencoding}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v15.0.0 | El objeto también puede ser un ArrayBuffer y CryptoKey. |
| v13.2.0, v12.16.0 | Esta función ahora es compatible con las firmas DSA y ECDSA de IEEE-P1363. |
| v12.0.0 | Esta función ahora es compatible con las claves RSA-PSS. |
| v11.7.0 | La clave ahora puede ser una clave privada. |
| v8.0.0 | Se añadió compatibilidad para RSASSA-PSS y opciones adicionales. |
| v0.1.92 | Añadido en: v0.1.92 |
:::

- `object` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/es/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/es/nodejs/api/webcrypto#class-cryptokey)
    - `dsaEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `padding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `saltLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)


- `signature` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `signatureEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codificación](/es/nodejs/api/buffer#buffers-and-character-encodings) de la cadena `signature`.
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` o `false` dependiendo de la validez de la firma para los datos y la clave pública.

Verifica los datos proporcionados utilizando el `object` y la `signature` dados.

Si `object` no es un [`KeyObject`](/es/nodejs/api/crypto#class-keyobject), esta función se comporta como si `object` se hubiera pasado a [`crypto.createPublicKey()`](/es/nodejs/api/crypto#cryptocreatepublickeykey). Si es un objeto, se pueden pasar las siguientes propiedades adicionales:

- `dsaEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Para DSA y ECDSA, esta opción especifica el formato de la firma. Puede ser uno de los siguientes:
    - `'der'` (predeterminado): Estructura de firma ASN.1 codificada en DER que codifica `(r, s)`.
    - `'ieee-p1363'`: Formato de firma `r || s` como se propone en IEEE-P1363.


- `padding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Valor de relleno opcional para RSA, uno de los siguientes:
    - `crypto.constants.RSA_PKCS1_PADDING` (predeterminado)
    - `crypto.constants.RSA_PKCS1_PSS_PADDING`

`RSA_PKCS1_PSS_PADDING` utilizará MGF1 con la misma función hash utilizada para verificar el mensaje, tal como se especifica en la sección 3.1 de [RFC 4055](https://www.rfc-editor.org/rfc/rfc4055.txt), a menos que se haya especificado una función hash MGF1 como parte de la clave de conformidad con la sección 3.3 de [RFC 4055](https://www.rfc-editor.org/rfc/rfc4055.txt).
- `saltLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Longitud de la sal para cuando el relleno es `RSA_PKCS1_PSS_PADDING`. El valor especial `crypto.constants.RSA_PSS_SALTLEN_DIGEST` establece la longitud de la sal al tamaño del resumen, `crypto.constants.RSA_PSS_SALTLEN_AUTO` (predeterminado) hace que se determine automáticamente.

El argumento `signature` es la firma calculada previamente para los datos, en `signatureEncoding`. Si se especifica un `signatureEncoding`, se espera que `signature` sea una cadena; de lo contrario, se espera que `signature` sea un [`Buffer`](/es/nodejs/api/buffer), `TypedArray` o `DataView`.

El objeto `verify` no se puede volver a utilizar después de que se haya llamado a `verify.verify()`. Varias llamadas a `verify.verify()` darán como resultado que se lance un error.

Dado que las claves públicas pueden derivarse de las claves privadas, se puede pasar una clave privada en lugar de una clave pública.


## Clase: `X509Certificate` {#class-x509certificate}

**Agregado en: v15.6.0**

Encapsula un certificado X509 y proporciona acceso de solo lectura a su información.

::: code-group
```js [ESM]
const { X509Certificate } = await import('node:crypto');

const x509 = new X509Certificate('{... certificado codificado en pem ...}');

console.log(x509.subject);
```

```js [CJS]
const { X509Certificate } = require('node:crypto');

const x509 = new X509Certificate('{... certificado codificado en pem ...}');

console.log(x509.subject);
```
:::

### `new X509Certificate(buffer)` {#new-x509certificatebuffer}

**Agregado en: v15.6.0**

- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Un certificado X509 codificado en PEM o DER.

### `x509.ca` {#x509ca}

**Agregado en: v15.6.0**

- Tipo: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Será `true` si este es un certificado de Autoridad de Certificación (CA).

### `x509.checkEmail(email[, options])` {#x509checkemailemail-options}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | La opción subject ahora tiene como valor predeterminado `'default'`. |
| v17.5.0, v16.15.0 | La opción subject ahora se puede establecer en `'default'`. |
| v17.5.0, v16.14.1 | Se eliminaron las opciones `wildcards`, `partialWildcards`, `multiLabelWildcards` y `singleLabelSubdomains` ya que no tenían ningún efecto. |
| v15.6.0 | Agregado en: v15.6.0 |
:::

- `email` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `subject` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'default'`, `'always'` o `'never'`. **Predeterminado:** `'default'`.
  
 
- Devuelve: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Devuelve `email` si el certificado coincide, `undefined` si no lo hace.

Comprueba si el certificado coincide con la dirección de correo electrónico dada.

Si la opción `'subject'` no está definida o está establecida en `'default'`, el asunto del certificado solo se considera si la extensión de nombre alternativo del asunto no existe o no contiene ninguna dirección de correo electrónico.

Si la opción `'subject'` está establecida en `'always'` y si la extensión de nombre alternativo del asunto no existe o no contiene una dirección de correo electrónico coincidente, se considera el asunto del certificado.

Si la opción `'subject'` está establecida en `'never'`, el asunto del certificado nunca se considera, incluso si el certificado no contiene nombres alternativos de asunto.


### `x509.checkHost(name[, options])` {#x509checkhostname-options}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | La opción subject ahora tiene como valor predeterminado `'default'`. |
| v17.5.0, v16.15.0 | La opción subject ahora se puede establecer en `'default'`. |
| v15.6.0 | Agregado en: v15.6.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `subject` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'default'`, `'always'` o `'never'`. **Predeterminado:** `'default'`.
    - `wildcards` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Predeterminado:** `true`.
    - `partialWildcards` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Predeterminado:** `true`.
    - `multiLabelWildcards` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Predeterminado:** `false`.
    - `singleLabelSubdomains` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Predeterminado:** `false`.


- Devuelve: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Devuelve un nombre de asunto que coincide con `name`, o `undefined` si ningún nombre de asunto coincide con `name`.

Comprueba si el certificado coincide con el nombre de host dado.

Si el certificado coincide con el nombre de host dado, se devuelve el nombre de asunto coincidente. El nombre devuelto puede ser una coincidencia exacta (por ejemplo, `foo.example.com`) o puede contener comodines (por ejemplo, `*.example.com`). Debido a que las comparaciones de nombres de host no distinguen entre mayúsculas y minúsculas, el nombre de asunto devuelto también puede diferir del `name` dado en el uso de mayúsculas.

Si la opción `'subject'` no está definida o se establece en `'default'`, el asunto del certificado solo se considera si la extensión del nombre alternativo del asunto no existe o no contiene ningún nombre DNS. Este comportamiento es coherente con [RFC 2818](https://www.rfc-editor.org/rfc/rfc2818.txt) ("HTTP Over TLS").

Si la opción `'subject'` se establece en `'always'` y si la extensión del nombre alternativo del asunto no existe o no contiene un nombre DNS coincidente, se considera el asunto del certificado.

Si la opción `'subject'` se establece en `'never'`, el asunto del certificado nunca se considera, incluso si el certificado no contiene nombres alternativos del asunto.


### `x509.checkIP(ip)` {#x509checkipip}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v17.5.0, v16.14.1 | El argumento `options` ha sido eliminado ya que no tenía efecto. |
| v15.6.0 | Añadido en: v15.6.0 |
:::

- `ip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Devuelve: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Devuelve `ip` si el certificado coincide, `undefined` si no coincide.

Comprueba si el certificado coincide con la dirección IP dada (IPv4 o IPv6).

Solo se consideran los nombres alternativos del sujeto `iPAddress` [RFC 5280](https://www.rfc-editor.org/rfc/rfc5280.txt), y deben coincidir exactamente con la dirección `ip` dada. Se ignoran otros nombres alternativos del sujeto, así como el campo del sujeto del certificado.

### `x509.checkIssued(otherCert)` {#x509checkissuedothercert}

**Añadido en: v15.6.0**

- `otherCert` [\<X509Certificate\>](/es/nodejs/api/crypto#class-x509certificate)
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Comprueba si este certificado fue emitido por el `otherCert` dado.

### `x509.checkPrivateKey(privateKey)` {#x509checkprivatekeyprivatekey}

**Añadido en: v15.6.0**

- `privateKey` [\<KeyObject\>](/es/nodejs/api/crypto#class-keyobject) Una clave privada.
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Comprueba si la clave pública de este certificado es consistente con la clave privada dada.

### `x509.extKeyUsage` {#x509extkeyusage}

**Añadido en: v15.6.0**

- Tipo: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Un array que detalla los usos extendidos de la clave para este certificado.

### `x509.fingerprint` {#x509fingerprint}

**Añadido en: v15.6.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La huella digital SHA-1 de este certificado.

Debido a que SHA-1 está roto criptográficamente y a que la seguridad de SHA-1 es significativamente peor que la de los algoritmos que se utilizan comúnmente para firmar certificados, considere usar [`x509.fingerprint256`](/es/nodejs/api/crypto#x509fingerprint256) en su lugar.


### `x509.fingerprint256` {#x509fingerprint256}

**Agregado en: v15.6.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La huella digital SHA-256 de este certificado.

### `x509.fingerprint512` {#x509fingerprint512}

**Agregado en: v17.2.0, v16.14.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La huella digital SHA-512 de este certificado.

Dado que calcular la huella digital SHA-256 suele ser más rápido y porque es solo la mitad del tamaño de la huella digital SHA-512, [`x509.fingerprint256`](/es/nodejs/api/crypto#x509fingerprint256) puede ser una mejor opción. Si bien SHA-512 presumiblemente proporciona un nivel de seguridad más alto en general, la seguridad de SHA-256 coincide con la de la mayoría de los algoritmos que se utilizan comúnmente para firmar certificados.

### `x509.infoAccess` {#x509infoaccess}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v17.3.1, v16.13.2 | Partes de esta cadena pueden estar codificadas como literales de cadena JSON en respuesta a CVE-2021-44532. |
| v15.6.0 | Agregado en: v15.6.0 |
:::

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Una representación textual de la extensión de acceso a la información de la autoridad del certificado.

Esta es una lista separada por saltos de línea de descripciones de acceso. Cada línea comienza con el método de acceso y el tipo de ubicación de acceso, seguido de dos puntos y el valor asociado con la ubicación de acceso.

Después del prefijo que denota el método de acceso y el tipo de ubicación de acceso, el resto de cada línea podría estar entre comillas para indicar que el valor es un literal de cadena JSON. Por compatibilidad con versiones anteriores, Node.js solo usa literales de cadena JSON dentro de esta propiedad cuando es necesario para evitar ambigüedades. El código de terceros debe estar preparado para manejar ambos formatos de entrada posibles.

### `x509.issuer` {#x509issuer}

**Agregado en: v15.6.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La identificación del emisor incluida en este certificado.


### `x509.issuerCertificate` {#x509issuercertificate}

**Agregado en: v15.9.0**

- Tipo: [\<X509Certificate\>](/es/nodejs/api/crypto#class-x509certificate)

El certificado del emisor o `undefined` si el certificado del emisor no está disponible.

### `x509.publicKey` {#x509publickey}

**Agregado en: v15.6.0**

- Tipo: [\<KeyObject\>](/es/nodejs/api/crypto#class-keyobject)

La clave pública [\<KeyObject\>](/es/nodejs/api/crypto#class-keyobject) para este certificado.

### `x509.raw` {#x509raw}

**Agregado en: v15.6.0**

- Tipo: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer)

Un `Buffer` que contiene la codificación DER de este certificado.

### `x509.serialNumber` {#x509serialnumber}

**Agregado en: v15.6.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

El número de serie de este certificado.

Los números de serie son asignados por las autoridades de certificación y no identifican de forma única los certificados. Considere usar [`x509.fingerprint256`](/es/nodejs/api/crypto#x509fingerprint256) como un identificador único en su lugar.

### `x509.subject` {#x509subject}

**Agregado en: v15.6.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

El sujeto completo de este certificado.

### `x509.subjectAltName` {#x509subjectaltname}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v17.3.1, v16.13.2 | Partes de esta cadena pueden estar codificadas como literales de cadena JSON en respuesta a CVE-2021-44532. |
| v15.6.0 | Agregado en: v15.6.0 |
:::

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

El nombre alternativo del sujeto especificado para este certificado.

Esta es una lista de nombres alternativos del sujeto separados por comas. Cada entrada comienza con una cadena que identifica el tipo de nombre alternativo del sujeto, seguida de dos puntos y el valor asociado con la entrada.

Las versiones anteriores de Node.js asumieron incorrectamente que es seguro dividir esta propiedad en la secuencia de dos caracteres `', '` (consulte [CVE-2021-44532](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-44532)). Sin embargo, tanto los certificados maliciosos como los legítimos pueden contener nombres alternativos del sujeto que incluyen esta secuencia cuando se representan como una cadena.

Después del prefijo que denota el tipo de entrada, el resto de cada entrada puede estar entre comillas para indicar que el valor es un literal de cadena JSON. Por compatibilidad con versiones anteriores, Node.js solo usa literales de cadena JSON dentro de esta propiedad cuando es necesario para evitar la ambigüedad. El código de terceros debe estar preparado para manejar ambos formatos de entrada posibles.


### `x509.toJSON()` {#x509tojson}

**Agregado en: v15.6.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

No existe una codificación JSON estándar para los certificados X509. El método `toJSON()` devuelve una cadena que contiene el certificado codificado en PEM.

### `x509.toLegacyObject()` {#x509tolegacyobject}

**Agregado en: v15.6.0**

- Tipo: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Devuelve información sobre este certificado utilizando la codificación de [objeto de certificado](/es/nodejs/api/tls#certificate-object) heredada.

### `x509.toString()` {#x509tostring}

**Agregado en: v15.6.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Devuelve el certificado codificado en PEM.

### `x509.validFrom` {#x509validfrom}

**Agregado en: v15.6.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La fecha/hora a partir de la cual este certificado es válido.

### `x509.validFromDate` {#x509validfromdate}

**Agregado en: v23.0.0**

- Tipo: [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

La fecha/hora a partir de la cual este certificado es válido, encapsulada en un objeto `Date`.

### `x509.validTo` {#x509validto}

**Agregado en: v15.6.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La fecha/hora hasta la cual este certificado es válido.

### `x509.validToDate` {#x509validtodate}

**Agregado en: v23.0.0**

- Tipo: [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

La fecha/hora hasta la cual este certificado es válido, encapsulada en un objeto `Date`.

### `x509.verify(publicKey)` {#x509verifypublickey}

**Agregado en: v15.6.0**

- `publicKey` [\<KeyObject\>](/es/nodejs/api/crypto#class-keyobject) Una clave pública.
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Verifica que este certificado fue firmado por la clave pública dada. No realiza ninguna otra comprobación de validación en el certificado.


## Métodos y propiedades del módulo `node:crypto` {#nodecrypto-module-methods-and-properties}

### `crypto.checkPrime(candidate[, options], callback)` {#cryptocheckprimecandidate-options-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una callback inválida al argumento `callback` ahora lanza `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v15.8.0 | Añadido en: v15.8.0 |
:::

- `candidate` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) Un posible número primo codificado como una secuencia de octetos big endian de longitud arbitraria.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `checks` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de iteraciones probabilísticas de primalidad de Miller-Rabin a realizar. Cuando el valor es `0` (cero), se utiliza un número de comprobaciones que produce una tasa de falsos positivos de como máximo 2 para entradas aleatorias. Se debe tener cuidado al seleccionar un número de comprobaciones. Consulte la documentación de OpenSSL para la función [`BN_is_prime_ex`](https://www.openssl.org/docs/man1.1.1/man3/BN_is_prime_ex) para obtener más detalles sobre las opciones de `nchecks`. **Predeterminado:** `0`
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Se establece en un objeto [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) si se produjo un error durante la comprobación.
    - `result` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` si el candidato es un número primo con una probabilidad de error menor que `0.25 ** options.checks`.
  
 

Comprueba la primalidad del `candidate`.


### `crypto.checkPrimeSync(candidate[, options])` {#cryptocheckprimesynccandidate-options}

**Agregada en: v15.8.0**

- `candidate` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) Un posible número primo codificado como una secuencia de octetos big endian de longitud arbitraria.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `checks` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de iteraciones probabilísticas de primalidad de Miller-Rabin a realizar. Cuando el valor es `0` (cero), se utiliza un número de comprobaciones que produce una tasa de falsos positivos de como máximo 2 para la entrada aleatoria. Se debe tener cuidado al seleccionar un número de comprobaciones. Consulte la documentación de OpenSSL para la función [`BN_is_prime_ex`](https://www.openssl.org/docs/man1.1.1/man3/BN_is_prime_ex) opciones `nchecks` para obtener más detalles. **Predeterminado:** `0`


- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` si el candidato es un número primo con una probabilidad de error inferior a `0.25 ** options.checks`.

Comprueba la primalidad del `candidate`.

### `crypto.constants` {#cryptoconstants}

**Agregada en: v6.3.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Un objeto que contiene constantes de uso común para operaciones relacionadas con la criptografía y la seguridad. Las constantes específicas actualmente definidas se describen en [Constantes criptográficas](/es/nodejs/api/crypto#crypto-constants).


### `crypto.createCipheriv(algorithm, key, iv[, options])` {#cryptocreatecipherivalgorithm-key-iv-options}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v17.9.0, v16.17.0 | La opción `authTagLength` ahora es opcional cuando se usa el cifrado `chacha20-poly1305` y el valor predeterminado es de 16 bytes. |
| v15.0.0 | Los argumentos `password` e `iv` pueden ser un ArrayBuffer y cada uno está limitado a un máximo de 2 ** 31 - 1 bytes. |
| v11.6.0 | El argumento `key` ahora puede ser un `KeyObject`. |
| v11.2.0, v10.17.0 | Ahora se admite el cifrado `chacha20-poly1305` (la variante IETF de ChaCha20-Poly1305). |
| v10.10.0 | Ahora se admiten los cifrados en modo OCB. |
| v10.2.0 | Ahora se puede usar la opción `authTagLength` para producir etiquetas de autenticación más cortas en modo GCM y el valor predeterminado es de 16 bytes. |
| v9.9.0 | El parámetro `iv` ahora puede ser `null` para los cifrados que no necesitan un vector de inicialización. |
| v0.1.94 | Añadido en: v0.1.94 |
:::

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/es/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/es/nodejs/api/webcrypto#class-cryptokey)
- `iv` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.transform` options](/es/nodejs/api/stream#new-streamtransformoptions)
- Devuelve: [\<Cipher\>](/es/nodejs/api/crypto#class-cipher)

Crea y devuelve un objeto `Cipher`, con el `algorithm`, la `key` y el vector de inicialización (`iv`) dados.

El argumento `options` controla el comportamiento de la transmisión y es opcional, excepto cuando se usa un cifrado en modo CCM u OCB (por ejemplo, `'aes-128-ccm'`). En ese caso, la opción `authTagLength` es obligatoria y especifica la longitud de la etiqueta de autenticación en bytes, consulte [modo CCM](/es/nodejs/api/crypto#ccm-mode). En el modo GCM, la opción `authTagLength` no es obligatoria, pero se puede usar para establecer la longitud de la etiqueta de autenticación que devolverá `getAuthTag()` y el valor predeterminado es de 16 bytes. Para `chacha20-poly1305`, la opción `authTagLength` tiene un valor predeterminado de 16 bytes.

El `algorithm` depende de OpenSSL, ejemplos son `'aes192'`, etc. En las versiones recientes de OpenSSL, `openssl list -cipher-algorithms` mostrará los algoritmos de cifrado disponibles.

La `key` es la clave sin procesar utilizada por el `algorithm` e `iv` es un [vector de inicialización](https://en.wikipedia.org/wiki/Initialization_vector). Ambos argumentos deben ser cadenas codificadas `'utf8'`, [Buffers](/es/nodejs/api/buffer), `TypedArray` o `DataView`s. La `key` puede ser opcionalmente un [`KeyObject`](/es/nodejs/api/crypto#class-keyobject) de tipo `secret`. Si el cifrado no necesita un vector de inicialización, `iv` puede ser `null`.

Cuando pase cadenas para `key` o `iv`, considere las [advertencias al usar cadenas como entradas para las API criptográficas](/es/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis).

Los vectores de inicialización deben ser impredecibles y únicos; idealmente, serán criptográficamente aleatorios. No tienen que ser secretos: los IV generalmente se agregan a los mensajes de texto cifrado sin cifrar. Puede sonar contradictorio que algo tenga que ser impredecible y único, pero no tiene que ser secreto; recuerde que un atacante no debe poder predecir de antemano cuál será un IV dado.


### `crypto.createDecipheriv(algorithm, key, iv[, options])` {#cryptocreatedecipherivalgorithm-key-iv-options}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v17.9.0, v16.17.0 | La opción `authTagLength` ahora es opcional al usar el cifrado `chacha20-poly1305` y tiene un valor predeterminado de 16 bytes. |
| v11.6.0 | El argumento `key` ahora puede ser un `KeyObject`. |
| v11.2.0, v10.17.0 | Ahora se admite el cifrado `chacha20-poly1305` (la variante IETF de ChaCha20-Poly1305). |
| v10.10.0 | Ahora se admiten cifrados en modo OCB. |
| v10.2.0 | La opción `authTagLength` ahora se puede usar para restringir las longitudes de etiquetas de autenticación GCM aceptadas. |
| v9.9.0 | El parámetro `iv` ahora puede ser `null` para cifrados que no necesitan un vector de inicialización. |
| v0.1.94 | Añadido en: v0.1.94 |
:::

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/es/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/es/nodejs/api/webcrypto#class-cryptokey)
- `iv` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.transform` options](/es/nodejs/api/stream#new-streamtransformoptions)
- Devuelve: [\<Decipher\>](/es/nodejs/api/crypto#class-decipher)

Crea y devuelve un objeto `Decipher` que usa el `algorithm`, la `key` y el vector de inicialización (`iv`) dados.

El argumento `options` controla el comportamiento del flujo y es opcional, excepto cuando se usa un cifrado en modo CCM u OCB (por ejemplo, `'aes-128-ccm'`). En ese caso, la opción `authTagLength` es obligatoria y especifica la longitud de la etiqueta de autenticación en bytes, consulte [modo CCM](/es/nodejs/api/crypto#ccm-mode). Para AES-GCM y `chacha20-poly1305`, la opción `authTagLength` tiene un valor predeterminado de 16 bytes y debe establecerse en un valor diferente si se usa una longitud diferente.

El `algorithm` depende de OpenSSL, los ejemplos son `'aes192'`, etc. En las versiones recientes de OpenSSL, `openssl list -cipher-algorithms` mostrará los algoritmos de cifrado disponibles.

La `key` es la clave sin procesar utilizada por el `algorithm` e `iv` es un [vector de inicialización](https://en.wikipedia.org/wiki/Initialization_vector). Ambos argumentos deben ser cadenas codificadas en `'utf8'`, [Buffers](/es/nodejs/api/buffer), `TypedArray` o `DataView`s. La `key` puede ser opcionalmente un [`KeyObject`](/es/nodejs/api/crypto#class-keyobject) de tipo `secret`. Si el cifrado no necesita un vector de inicialización, `iv` puede ser `null`.

Cuando pase cadenas para `key` o `iv`, considere las [advertencias al usar cadenas como entradas para las API criptográficas](/es/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis).

Los vectores de inicialización deben ser impredecibles y únicos; idealmente, serán criptográficamente aleatorios. No tienen que ser secretos: los IV normalmente se agregan a los mensajes de texto cifrado sin cifrar. Puede sonar contradictorio que algo tenga que ser impredecible y único, pero no tiene que ser secreto; recuerde que un atacante no debe poder predecir de antemano cuál será un IV determinado.


### `crypto.createDiffieHellman(prime[, primeEncoding][, generator][, generatorEncoding])` {#cryptocreatediffiehellmanprime-primeencoding-generator-generatorencoding}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v8.0.0 | El argumento `prime` ahora puede ser cualquier `TypedArray` o `DataView`. |
| v8.0.0 | El argumento `prime` ahora puede ser un `Uint8Array`. |
| v6.0.0 | El valor predeterminado para los parámetros de codificación cambió de `binary` a `utf8`. |
| v0.11.12 | Añadido en: v0.11.12 |
:::

- `prime` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `primeEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codificación](/es/nodejs/api/buffer#buffers-and-character-encodings) de la cadena `prime`.
- `generator` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) **Predeterminado:** `2`
- `generatorEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codificación](/es/nodejs/api/buffer#buffers-and-character-encodings) de la cadena `generator`.
- Devuelve: [\<DiffieHellman\>](/es/nodejs/api/crypto#class-diffiehellman)

Crea un objeto de intercambio de claves `DiffieHellman` utilizando el `prime` proporcionado y un `generator` específico opcional.

El argumento `generator` puede ser un número, una cadena o un [`Buffer`](/es/nodejs/api/buffer). Si no se especifica `generator`, se utiliza el valor `2`.

Si se especifica `primeEncoding`, se espera que `prime` sea una cadena; de lo contrario, se espera un [`Buffer`](/es/nodejs/api/buffer), `TypedArray` o `DataView`.

Si se especifica `generatorEncoding`, se espera que `generator` sea una cadena; de lo contrario, se espera un número, [`Buffer`](/es/nodejs/api/buffer), `TypedArray` o `DataView`.


### `crypto.createDiffieHellman(primeLength[, generator])` {#cryptocreatediffiehellmanprimelength-generator}

**Añadido en: v0.5.0**

- `primeLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `generator` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `2`
- Devuelve: [\<DiffieHellman\>](/es/nodejs/api/crypto#class-diffiehellman)

Crea un objeto de intercambio de claves `DiffieHellman` y genera un número primo de `primeLength` bits utilizando un `generator` numérico específico opcional. Si no se especifica `generator`, se utiliza el valor `2`.

### `crypto.createDiffieHellmanGroup(name)` {#cryptocreatediffiehellmangroupname}

**Añadido en: v0.9.3**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Devuelve: [\<DiffieHellmanGroup\>](/es/nodejs/api/crypto#class-diffiehellmangroup)

Un alias para [`crypto.getDiffieHellman()`](/es/nodejs/api/crypto#cryptogetdiffiehellmangroupname)

### `crypto.createECDH(curveName)` {#cryptocreateecdhcurvename}

**Añadido en: v0.11.14**

- `curveName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Devuelve: [\<ECDH\>](/es/nodejs/api/crypto#class-ecdh)

Crea un objeto de intercambio de claves Diffie-Hellman de curva elíptica (`ECDH`) utilizando una curva predefinida especificada por la cadena `curveName`. Utilice [`crypto.getCurves()`](/es/nodejs/api/crypto#cryptogetcurves) para obtener una lista de nombres de curva disponibles. En las versiones recientes de OpenSSL, `openssl ecparam -list_curves` también mostrará el nombre y la descripción de cada curva elíptica disponible.

### `crypto.createHash(algorithm[, options])` {#cryptocreatehashalgorithm-options}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v12.8.0 | Se agregó la opción `outputLength` para las funciones hash XOF. |
| v0.1.92 | Añadido en: v0.1.92 |
:::

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opciones de [`stream.transform`](/es/nodejs/api/stream#new-streamtransformoptions)
- Devuelve: [\<Hash\>](/es/nodejs/api/crypto#class-hash)

Crea y devuelve un objeto `Hash` que se puede utilizar para generar resúmenes hash utilizando el `algorithm` dado. El argumento `options` opcional controla el comportamiento del flujo. Para funciones hash XOF como `'shake256'`, se puede utilizar la opción `outputLength` para especificar la longitud de salida deseada en bytes.

El `algorithm` depende de los algoritmos disponibles admitidos por la versión de OpenSSL en la plataforma. Los ejemplos son `'sha256'`, `'sha512'`, etc. En las versiones recientes de OpenSSL, `openssl list -digest-algorithms` mostrará los algoritmos de resumen disponibles.

Ejemplo: generar la suma sha256 de un archivo



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

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v15.0.0 | La clave también puede ser un ArrayBuffer o CryptoKey. Se agregó la opción de codificación. La clave no puede contener más de 2 ** 32 - 1 bytes. |
| v11.6.0 | El argumento `key` ahora puede ser un `KeyObject`. |
| v0.1.94 | Agregado en: v0.1.94 |
:::

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/es/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/es/nodejs/api/webcrypto#class-cryptokey)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.transform` options](/es/nodejs/api/stream#new-streamtransformoptions)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La codificación de cadena a utilizar cuando `key` es una cadena.

- Devuelve: [\<Hmac\>](/es/nodejs/api/crypto#class-hmac)

Crea y devuelve un objeto `Hmac` que utiliza el `algorithm` y la `key` dados. El argumento `options` opcional controla el comportamiento del flujo.

El `algorithm` depende de los algoritmos disponibles soportados por la versión de OpenSSL en la plataforma. Algunos ejemplos son `'sha256'`, `'sha512'`, etc. En las versiones recientes de OpenSSL, `openssl list -digest-algorithms` mostrará los algoritmos de resumen disponibles.

La `key` es la clave HMAC utilizada para generar el hash HMAC criptográfico. Si es un [`KeyObject`](/es/nodejs/api/crypto#class-keyobject), su tipo debe ser `secret`. Si es una cadena, considere las [advertencias al usar cadenas como entradas para las API criptográficas](/es/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis). Si se obtuvo de una fuente de entropía criptográficamente segura, como [`crypto.randomBytes()`](/es/nodejs/api/crypto#cryptorandombytessize-callback) o [`crypto.generateKey()`](/es/nodejs/api/crypto#cryptogeneratekeytype-options-callback), su longitud no debe exceder el tamaño de bloque de `algorithm` (por ejemplo, 512 bits para SHA-256).

Ejemplo: generar el HMAC sha256 de un archivo

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

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v15.12.0 | La clave también puede ser un objeto JWK. |
| v15.0.0 | La clave también puede ser un ArrayBuffer. Se añadió la opción de codificación. La clave no puede contener más de 2 ** 32 - 1 bytes. |
| v11.6.0 | Añadido en: v11.6.0 |
:::

- `key` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
    - `key`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) El material de la clave, ya sea en formato PEM, DER o JWK.
    - `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Debe ser `'pem'`, `'der'` o `'jwk'`. **Predeterminado:** `'pem'`.
    - `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Debe ser `'pkcs1'`, `'pkcs8'` o `'sec1'`. Esta opción sólo es necesaria si el `format` es `'der'` y se ignora en caso contrario.
    - `passphrase`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) La frase de contraseña para usar para el descifrado.
    - `encoding`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La codificación de cadena que se utilizará cuando `key` sea una cadena.
  
 
- Devuelve: [\<KeyObject\>](/es/nodejs/api/crypto#class-keyobject)

Crea y devuelve un nuevo objeto clave que contiene una clave privada. Si `key` es una cadena o `Buffer`, se asume que el `format` es `'pem'`; de lo contrario, `key` debe ser un objeto con las propiedades descritas anteriormente.

Si la clave privada está cifrada, debe especificarse una `passphrase`. La longitud de la frase de contraseña está limitada a 1024 bytes.


### `crypto.createPublicKey(key)` {#cryptocreatepublickeykey}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v15.12.0 | La clave también puede ser un objeto JWK. |
| v15.0.0 | La clave también puede ser un ArrayBuffer. Se añadió la opción de codificación. La clave no puede contener más de 2 ** 32 - 1 bytes. |
| v11.13.0 | El argumento `key` ahora puede ser un `KeyObject` con tipo `private`. |
| v11.7.0 | El argumento `key` ahora puede ser una clave privada. |
| v11.6.0 | Añadido en: v11.6.0 |
:::

- `key` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
    - `key`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) El material de la clave, ya sea en formato PEM, DER o JWK.
    - `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Debe ser `'pem'`, `'der'` o `'jwk'`. **Predeterminado:** `'pem'`.
    - `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Debe ser `'pkcs1'` o `'spki'`. Esta opción solo es necesaria si el `format` es `'der'` y se ignora en caso contrario.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La codificación de cadena que se utilizará cuando `key` sea una cadena.


- Devuelve: [\<KeyObject\>](/es/nodejs/api/crypto#class-keyobject)

Crea y devuelve un nuevo objeto de clave que contiene una clave pública. Si `key` es una cadena o `Buffer`, se asume que el `format` es `'pem'`; si `key` es un `KeyObject` con tipo `'private'`, la clave pública se deriva de la clave privada dada; de lo contrario, `key` debe ser un objeto con las propiedades descritas anteriormente.

Si el formato es `'pem'`, la `'key'` también puede ser un certificado X.509.

Dado que las claves públicas se pueden derivar de claves privadas, se puede pasar una clave privada en lugar de una clave pública. En ese caso, esta función se comporta como si se hubiera llamado a [`crypto.createPrivateKey()`](/es/nodejs/api/crypto#cryptocreateprivatekeykey), excepto que el tipo del `KeyObject` devuelto será `'public'` y que la clave privada no se puede extraer del `KeyObject` devuelto. Del mismo modo, si se proporciona un `KeyObject` con tipo `'private'`, se devolverá un nuevo `KeyObject` con tipo `'public'` y será imposible extraer la clave privada del objeto devuelto.


### `crypto.createSecretKey(key[, encoding])` {#cryptocreatesecretkeykey-encoding}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.8.0, v16.18.0 | La clave ahora puede tener longitud cero. |
| v15.0.0 | La clave también puede ser un ArrayBuffer o una cadena. Se añadió el argumento de codificación. La clave no puede contener más de 2 ** 32 - 1 bytes. |
| v11.6.0 | Añadido en: v11.6.0 |
:::

- `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La codificación de cadena cuando `key` es una cadena.
- Devuelve: [\<KeyObject\>](/es/nodejs/api/crypto#class-keyobject)

Crea y devuelve un nuevo objeto de clave que contiene una clave secreta para el cifrado simétrico o `Hmac`.

### `crypto.createSign(algorithm[, options])` {#cryptocreatesignalgorithm-options}

**Añadido en: v0.1.92**

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opciones de [`stream.Writable`](/es/nodejs/api/stream#new-streamwritableoptions)
- Devuelve: [\<Sign\>](/es/nodejs/api/crypto#class-sign)

Crea y devuelve un objeto `Sign` que utiliza el `algorithm` dado. Utilice [`crypto.getHashes()`](/es/nodejs/api/crypto#cryptogethashes) para obtener los nombres de los algoritmos de resumen disponibles. El argumento `options` opcional controla el comportamiento de `stream.Writable`.

En algunos casos, se puede crear una instancia de `Sign` utilizando el nombre de un algoritmo de firma, como `'RSA-SHA256'`, en lugar de un algoritmo de resumen. Esto utilizará el algoritmo de resumen correspondiente. Esto no funciona para todos los algoritmos de firma, como `'ecdsa-with-SHA256'`, por lo que es mejor utilizar siempre nombres de algoritmos de resumen.


### `crypto.createVerify(algorithm[, options])` {#cryptocreateverifyalgorithm-options}

**Agregado en: v0.1.92**

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opciones [`stream.Writable`](/es/nodejs/api/stream#new-streamwritableoptions)
- Devuelve: [\<Verify\>](/es/nodejs/api/crypto#class-verify)

Crea y devuelve un objeto `Verify` que utiliza el algoritmo dado. Utilice [`crypto.getHashes()`](/es/nodejs/api/crypto#cryptogethashes) para obtener una matriz de nombres de los algoritmos de firma disponibles. El argumento opcional `options` controla el comportamiento de `stream.Writable`.

En algunos casos, se puede crear una instancia de `Verify` utilizando el nombre de un algoritmo de firma, como `'RSA-SHA256'`, en lugar de un algoritmo de resumen. Esto utilizará el algoritmo de resumen correspondiente. Esto no funciona para todos los algoritmos de firma, como `'ecdsa-with-SHA256'`, por lo que es mejor utilizar siempre los nombres de los algoritmos de resumen.

### `crypto.diffieHellman(options)` {#cryptodiffiehellmanoptions}

**Agregado en: v13.9.0, v12.17.0**

- `options`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `privateKey`: [\<KeyObject\>](/es/nodejs/api/crypto#class-keyobject)
    - `publicKey`: [\<KeyObject\>](/es/nodejs/api/crypto#class-keyobject)
  
 
- Devuelve: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer)

Calcula el secreto de Diffie-Hellman basado en una `privateKey` y una `publicKey`. Ambas claves deben tener el mismo `asymmetricKeyType`, que debe ser uno de `'dh'` (para Diffie-Hellman), `'ec'`, `'x448'` o `'x25519'` (para ECDH).

### `crypto.fips` {#cryptofips}

**Agregado en: v6.0.0**

**Obsoleto desde: v10.0.0**

::: danger [Estable: 0 - Obsoleto]
[Estable: 0](/es/nodejs/api/documentation#stability-index) [Estabilidad: 0](/es/nodejs/api/documentation#stability-index) - Obsoleto
:::

Propiedad para comprobar y controlar si se está utilizando actualmente un proveedor criptográfico compatible con FIPS. Establecer en true requiere una compilación FIPS de Node.js.

Esta propiedad está obsoleta. Por favor, use `crypto.setFips()` y `crypto.getFips()` en su lugar.


### `crypto.generateKey(type, options, callback)` {#cryptogeneratekeytype-options-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una devolución de llamada no válida al argumento `callback` ahora arroja `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v15.0.0 | Agregado en: v15.0.0 |
:::

- `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El uso previsto de la clave secreta generada. Los valores aceptados actualmente son `'hmac'` y `'aes'`.
- `options`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `length`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La longitud en bits de la clave a generar. Esto debe ser un valor mayor que 0.
    - Si `type` es `'hmac'`, el mínimo es 8 y la longitud máxima es 2-1. Si el valor no es un múltiplo de 8, la clave generada se truncará a `Math.floor(length / 8)`.
    - Si `type` es `'aes'`, la longitud debe ser una de `128`, `192` o `256`.




- `callback`: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err`: [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `key`: [\<KeyObject\>](/es/nodejs/api/crypto#class-keyobject)



Genera asincrónicamente una nueva clave secreta aleatoria de la `length` dada. El `type` determinará qué validaciones se realizarán en la `length`.

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

El tamaño de una clave HMAC generada no debe exceder el tamaño de bloque de la función hash subyacente. Consulte [`crypto.createHmac()`](/es/nodejs/api/crypto#cryptocreatehmacalgorithm-key-options) para obtener más información.


### `crypto.generateKeyPair(type, options, callback)` {#cryptogeneratekeypairtype-options-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una callback inválida al argumento `callback` ahora lanza `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v16.10.0 | Agrega la capacidad de definir parámetros de secuencia `RSASSA-PSS-params` para pares de claves RSA-PSS. |
| v13.9.0, v12.17.0 | Agrega soporte para Diffie-Hellman. |
| v12.0.0 | Agrega soporte para pares de claves RSA-PSS. |
| v12.0.0 | Agrega la capacidad de generar pares de claves X25519 y X448. |
| v12.0.0 | Agrega la capacidad de generar pares de claves Ed25519 y Ed448. |
| v11.6.0 | Las funciones `generateKeyPair` y `generateKeyPairSync` ahora producen objetos de clave si no se especificó ninguna codificación. |
| v10.12.0 | Agregado en: v10.12.0 |
:::

- `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Debe ser `'rsa'`, `'rsa-pss'`, `'dsa'`, `'ec'`, `'ed25519'`, `'ed448'`, `'x25519'`, `'x448'` o `'dh'`.
- `options`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `modulusLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Tamaño de la clave en bits (RSA, DSA).
    - `publicExponent`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Exponente público (RSA). **Predeterminado:** `0x10001`.
    - `hashAlgorithm`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nombre del resumen del mensaje (RSA-PSS).
    - `mgf1HashAlgorithm`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nombre del resumen del mensaje utilizado por MGF1 (RSA-PSS).
    - `saltLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Longitud mínima de la sal en bytes (RSA-PSS).
    - `divisorLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Tamaño de `q` en bits (DSA).
    - `namedCurve`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nombre de la curva a utilizar (EC).
    - `prime`: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) El parámetro primo (DH).
    - `primeLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Longitud prima en bits (DH).
    - `generator`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Generador personalizado (DH). **Predeterminado:** `2`.
    - `groupName`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nombre del grupo Diffie-Hellman (DH). Consulte [`crypto.getDiffieHellman()`](/es/nodejs/api/crypto#cryptogetdiffiehellmangroupname).
    - `paramEncoding`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Debe ser `'named'` o `'explicit'` (EC). **Predeterminado:** `'named'`.
    - `publicKeyEncoding`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Consulte [`keyObject.export()`](/es/nodejs/api/crypto#keyobjectexportoptions).
    - `privateKeyEncoding`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Consulte [`keyObject.export()`](/es/nodejs/api/crypto#keyobjectexportoptions).
  
 
- `callback`: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err`: [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `publicKey`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<KeyObject\>](/es/nodejs/api/crypto#class-keyobject)
    - `privateKey`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<KeyObject\>](/es/nodejs/api/crypto#class-keyobject)
  
 

Genera un nuevo par de claves asimétricas del `type` dado. Actualmente se admiten RSA, RSA-PSS, DSA, EC, Ed25519, Ed448, X25519, X448 y DH.

Si se especificó un `publicKeyEncoding` o `privateKeyEncoding`, esta función se comporta como si se hubiera llamado a [`keyObject.export()`](/es/nodejs/api/crypto#keyobjectexportoptions) en su resultado. De lo contrario, la parte respectiva de la clave se devuelve como un [`KeyObject`](/es/nodejs/api/crypto#class-keyobject).

Se recomienda codificar las claves públicas como `'spki'` y las claves privadas como `'pkcs8'` con cifrado para el almacenamiento a largo plazo:

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

Al finalizar, se llamará a `callback` con `err` establecido en `undefined` y `publicKey` / `privateKey` representando el par de claves generado.

Si este método se invoca como su versión [`util.promisify()`](/es/nodejs/api/util#utilpromisifyoriginal)ed, devuelve una `Promise` para un `Object` con propiedades `publicKey` y `privateKey`.


### `crypto.generateKeyPairSync(type, options)` {#cryptogeneratekeypairsynctype-options}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v16.10.0 | Se agregó la capacidad de definir parámetros de secuencia `RSASSA-PSS-params` para pares de claves RSA-PSS. |
| v13.9.0, v12.17.0 | Se agregó soporte para Diffie-Hellman. |
| v12.0.0 | Se agregó soporte para pares de claves RSA-PSS. |
| v12.0.0 | Se agregó la capacidad de generar pares de claves X25519 y X448. |
| v12.0.0 | Se agregó la capacidad de generar pares de claves Ed25519 y Ed448. |
| v11.6.0 | Las funciones `generateKeyPair` y `generateKeyPairSync` ahora producen objetos clave si no se especificó ninguna codificación. |
| v10.12.0 | Se agregó en: v10.12.0 |
:::

- `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Debe ser `'rsa'`, `'rsa-pss'`, `'dsa'`, `'ec'`, `'ed25519'`, `'ed448'`, `'x25519'`, `'x448'` o `'dh'`.
- `options`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `modulusLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Tamaño de la clave en bits (RSA, DSA).
    - `publicExponent`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Exponente público (RSA). **Predeterminado:** `0x10001`.
    - `hashAlgorithm`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nombre del resumen del mensaje (RSA-PSS).
    - `mgf1HashAlgorithm`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nombre del resumen del mensaje utilizado por MGF1 (RSA-PSS).
    - `saltLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Longitud mínima de la sal en bytes (RSA-PSS).
    - `divisorLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Tamaño de `q` en bits (DSA).
    - `namedCurve`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nombre de la curva a utilizar (EC).
    - `prime`: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) El parámetro primo (DH).
    - `primeLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Longitud prima en bits (DH).
    - `generator`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Generador personalizado (DH). **Predeterminado:** `2`.
    - `groupName`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nombre del grupo Diffie-Hellman (DH). Consulte [`crypto.getDiffieHellman()`](/es/nodejs/api/crypto#cryptogetdiffiehellmangroupname).
    - `paramEncoding`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Debe ser `'named'` o `'explicit'` (EC). **Predeterminado:** `'named'`.
    - `publicKeyEncoding`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Consulte [`keyObject.export()`](/es/nodejs/api/crypto#keyobjectexportoptions).
    - `privateKeyEncoding`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Consulte [`keyObject.export()`](/es/nodejs/api/crypto#keyobjectexportoptions).
  
 
- Devuelve: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `publicKey`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<KeyObject\>](/es/nodejs/api/crypto#class-keyobject)
    - `privateKey`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<KeyObject\>](/es/nodejs/api/crypto#class-keyobject)
  
 

Genera un nuevo par de claves asimétricas del `type` dado. Actualmente se admiten RSA, RSA-PSS, DSA, EC, Ed25519, Ed448, X25519, X448 y DH.

Si se especificó una `publicKeyEncoding` o `privateKeyEncoding`, esta función se comporta como si se hubiera llamado a [`keyObject.export()`](/es/nodejs/api/crypto#keyobjectexportoptions) en su resultado. De lo contrario, la parte respectiva de la clave se devuelve como un [`KeyObject`](/es/nodejs/api/crypto#class-keyobject).

Al codificar claves públicas, se recomienda utilizar `'spki'`. Al codificar claves privadas, se recomienda utilizar `'pkcs8'` con una contraseña segura y mantener la confidencialidad de la contraseña.

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

El valor de retorno `{ publicKey, privateKey }` representa el par de claves generado. Cuando se seleccionó la codificación PEM, la clave respectiva será una cadena, de lo contrario, será un búfer que contiene los datos codificados como DER.


### `crypto.generateKeySync(type, options)` {#cryptogeneratekeysynctype-options}

**Agregado en: v15.0.0**

- `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El uso previsto de la clave secreta generada. Los valores aceptados actualmente son `'hmac'` y `'aes'`.
- `options`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `length`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La longitud en bits de la clave a generar.
    - Si `type` es `'hmac'`, el mínimo es 8 y la longitud máxima es 2-1. Si el valor no es múltiplo de 8, la clave generada se truncará a `Math.floor(length / 8)`.
    - Si `type` es `'aes'`, la longitud debe ser una de `128`, `192` o `256`.




- Devuelve: [\<KeyObject\>](/es/nodejs/api/crypto#class-keyobject)

Genera sincrónicamente una nueva clave secreta aleatoria de la `length` dada. El `type` determinará qué validaciones se realizarán en la `length`.



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

El tamaño de una clave HMAC generada no debe exceder el tamaño de bloque de la función hash subyacente. Consulte [`crypto.createHmac()`](/es/nodejs/api/crypto#cryptocreatehmacalgorithm-key-options) para obtener más información.

### `crypto.generatePrime(size[, options[, callback]])` {#cryptogenerateprimesize-options-callback}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una callback inválida al argumento `callback` ahora lanza `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v15.8.0 | Agregado en: v15.8.0 |
:::

- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El tamaño (en bits) del primo a generar.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `add` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
    - `rem` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
    - `safe` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Predeterminado:** `false`.
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Cuando es `true`, el primo generado se devuelve como un `bigint`.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `prime` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)



Genera un primo pseudoaleatorio de `size` bits.

Si `options.safe` es `true`, el primo será un primo seguro, es decir, `(prime - 1) / 2` también será un primo.

Los parámetros `options.add` y `options.rem` se pueden usar para imponer requisitos adicionales, por ejemplo, para Diffie-Hellman:

- Si `options.add` y `options.rem` están ambos establecidos, el primo satisfará la condición de que `prime % add = rem`.
- Si solo se establece `options.add` y `options.safe` no es `true`, el primo satisfará la condición de que `prime % add = 1`.
- Si solo se establece `options.add` y `options.safe` se establece en `true`, el primo satisfará en cambio la condición de que `prime % add = 3`. Esto es necesario porque `prime % add = 1` para `options.add \> 2` contradiría la condición impuesta por `options.safe`.
- `options.rem` se ignora si no se proporciona `options.add`.

Tanto `options.add` como `options.rem` deben codificarse como secuencias big-endian si se dan como `ArrayBuffer`, `SharedArrayBuffer`, `TypedArray`, `Buffer` o `DataView`.

De forma predeterminada, el primo se codifica como una secuencia big-endian de octetos en un [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer). Si la opción `bigint` es `true`, entonces se proporciona un [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt).


### `crypto.generatePrimeSync(size[, options])` {#cryptogenerateprimesyncsize-options}

**Agregado en: v15.8.0**

- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El tamaño (en bits) del número primo a generar.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `add` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
    - `rem` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
    - `safe` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Predeterminado:** `false`.
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Cuando es `true`, el número primo generado se devuelve como un `bigint`.
  
 
- Devuelve: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Genera un número primo pseudoaleatorio de `size` bits.

Si `options.safe` es `true`, el número primo será un número primo seguro; es decir, `(prime - 1) / 2` también será un número primo.

Los parámetros `options.add` y `options.rem` se pueden utilizar para aplicar requisitos adicionales, por ejemplo, para Diffie-Hellman:

- Si `options.add` y `options.rem` están ambos establecidos, el número primo satisfará la condición de que `prime % add = rem`.
- Si solo se establece `options.add` y `options.safe` no es `true`, el número primo satisfará la condición de que `prime % add = 1`.
- Si solo se establece `options.add` y `options.safe` se establece en `true`, el número primo satisfará en su lugar la condición de que `prime % add = 3`. Esto es necesario porque `prime % add = 1` para `options.add \> 2` contradeciría la condición impuesta por `options.safe`.
- `options.rem` se ignora si no se proporciona `options.add`.

Tanto `options.add` como `options.rem` deben codificarse como secuencias big-endian si se proporcionan como `ArrayBuffer`, `SharedArrayBuffer`, `TypedArray`, `Buffer` o `DataView`.

De forma predeterminada, el número primo se codifica como una secuencia big-endian de octetos en un [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer). Si la opción `bigint` es `true`, entonces se proporciona un [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt).


### `crypto.getCipherInfo(nameOrNid[, options])` {#cryptogetcipherinfonameornid-options}

**Agregado en: v15.0.0**

- `nameOrNid`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El nombre o nid del cifrado a consultar.
- `options`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `keyLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Una longitud de clave de prueba.
    - `ivLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Una longitud de IV de prueba.
  
 
- Devuelve: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El nombre del cifrado
    - `nid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El nid del cifrado
    - `blockSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El tamaño del bloque del cifrado en bytes. Esta propiedad se omite cuando `mode` es `'stream'`.
    - `ivLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La longitud del vector de inicialización esperada o predeterminada en bytes. Esta propiedad se omite si el cifrado no utiliza un vector de inicialización.
    - `keyLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La longitud de clave esperada o predeterminada en bytes.
    - `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El modo de cifrado. Uno de `'cbc'`, `'ccm'`, `'cfb'`, `'ctr'`, `'ecb'`, `'gcm'`, `'ocb'`, `'ofb'`, `'stream'`, `'wrap'`, `'xts'`.
  
 

Devuelve información sobre un cifrado dado.

Algunos cifrados aceptan claves y vectores de inicialización de longitud variable. Por defecto, el método `crypto.getCipherInfo()` devolverá los valores predeterminados para estos cifrados. Para probar si una longitud de clave o una longitud de IV dadas son aceptables para un cifrado dado, utilice las opciones `keyLength` e `ivLength`. Si los valores dados no son aceptables, se devolverá `undefined`.


### `crypto.getCiphers()` {#cryptogetciphers}

**Agregado en: v0.9.3**

- Devuelve: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un array con los nombres de los algoritmos de cifrado soportados.



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

**Agregado en: v2.3.0**

- Devuelve: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un array con los nombres de las curvas elípticas soportadas.



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

**Agregado en: v0.7.5**

- `groupName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Devuelve: [\<DiffieHellmanGroup\>](/es/nodejs/api/crypto#class-diffiehellmangroup)

Crea un objeto de intercambio de claves `DiffieHellmanGroup` predefinido. Los grupos soportados se listan en la documentación para [`DiffieHellmanGroup`](/es/nodejs/api/crypto#class-diffiehellmangroup).

El objeto devuelto imita la interfaz de los objetos creados por [`crypto.createDiffieHellman()`](/es/nodejs/api/crypto#cryptocreatediffiehellmanprime-primeencoding-generator-generatorencoding), pero no permitirá cambiar las claves (con [`diffieHellman.setPublicKey()`](/es/nodejs/api/crypto#diffiehellmansetpublickeypublickey-encoding), por ejemplo). La ventaja de usar este método es que las partes no tienen que generar ni intercambiar un módulo de grupo de antemano, ahorrando tiempo de procesador y comunicación.

Ejemplo (obtener un secreto compartido):



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

/* aliceSecret y bobSecret deberían ser iguales */
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

/* aliceSecret y bobSecret deberían ser iguales */
console.log(aliceSecret === bobSecret);
```
:::


### `crypto.getFips()` {#cryptogetfips}

**Agregado en: v10.0.0**

- Devuelve: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `1` si y solo si un proveedor de criptografía compatible con FIPS está actualmente en uso, `0` en caso contrario. Una futura versión semver-major puede cambiar el tipo de retorno de esta API a un [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type).

### `crypto.getHashes()` {#cryptogethashes}

**Agregado en: v0.9.3**

- Devuelve: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un array de los nombres de los algoritmos hash soportados, como `'RSA-SHA256'`. Los algoritmos hash también se denominan algoritmos "digest".

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

**Agregado en: v17.4.0**

- `typedArray` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
- Devuelve: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) Devuelve `typedArray`.

Un alias conveniente para [`crypto.webcrypto.getRandomValues()`](/es/nodejs/api/webcrypto#cryptogetrandomvaluestypedarray). Esta implementación no es compatible con la especificación Web Crypto, para escribir código compatible con la web utilice [`crypto.webcrypto.getRandomValues()`](/es/nodejs/api/webcrypto#cryptogetrandomvaluestypedarray) en su lugar.


### `crypto.hash(algorithm, data[, outputEncoding])` {#cryptohashalgorithm-data-outputencoding}

**Agregado en: v21.7.0, v20.12.0**

::: warning [Estable: 1 - Experimental]
[Estable: 1](/es/nodejs/api/documentation#stability-index) [Estabilidad: 1](/es/nodejs/api/documentation#stability-index).2 - Candidato a lanzamiento
:::

- `algorithm` [\<string\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Undefined_type)
- `data` [\<string\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/DataView) Cuando `data` es una cadena, se codificará como UTF-8 antes de ser hasheada. Si se desea una codificación de entrada diferente para una entrada de cadena, el usuario podría codificar la cadena en un `TypedArray` usando `TextEncoder` o `Buffer.from()` y pasar el `TypedArray` codificado a esta API en su lugar.
- `outputEncoding` [\<string\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#Undefined_type)  [Codificación](/es/nodejs/api/buffer#buffers-and-character-encodings) usada para codificar el resumen devuelto. **Predeterminado:** `'hex'`.
- Devuelve: [\<string\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer)

Una utilidad para crear resúmenes hash únicos de datos. Puede ser más rápido que el `crypto.createHash()` basado en objetos al hashear una cantidad menor de datos (\<= 5 MB) que están disponibles de inmediato. Si los datos pueden ser grandes o si se transmiten, todavía se recomienda usar `crypto.createHash()` en su lugar.

El `algorithm` depende de los algoritmos disponibles compatibles con la versión de OpenSSL en la plataforma. Los ejemplos son `'sha256'`, `'sha512'`, etc. En las versiones recientes de OpenSSL, `openssl list -digest-algorithms` mostrará los algoritmos de resumen disponibles.

Ejemplo:

::: code-group
```js [CJS]
const crypto = require('node:crypto');
const { Buffer } = require('node:buffer');

// Hasheando una cadena y devolviendo el resultado como una cadena codificada en hexadecimal.
const string = 'Node.js';
// 10b3493287f831e81a438811a1ffba01f8cec4b7
console.log(crypto.hash('sha1', string));

// Codifica una cadena codificada en base64 en un Buffer, la hashea y devuelve
// el resultado como un búfer.
const base64 = 'Tm9kZS5qcw==';
// <Buffer 10 b3 49 32 87 f8 31 e8 1a 43 88 11 a1 ff ba 01 f8 ce c4 b7>
console.log(crypto.hash('sha1', Buffer.from(base64, 'base64'), 'buffer'));
```

```js [ESM]
import crypto from 'node:crypto';
import { Buffer } from 'node:buffer';

// Hasheando una cadena y devolviendo el resultado como una cadena codificada en hexadecimal.
const string = 'Node.js';
// 10b3493287f831e81a438811a1ffba01f8cec4b7
console.log(crypto.hash('sha1', string));

// Codifica una cadena codificada en base64 en un Buffer, la hashea y devuelve
// el resultado como un búfer.
const base64 = 'Tm9kZS5qcw==';
// <Buffer 10 b3 49 32 87 f8 31 e8 1a 43 88 11 a1 ff ba 01 f8 ce c4 b7>
console.log(crypto.hash('sha1', Buffer.from(base64, 'base64'), 'buffer'));
```
:::


### `crypto.hkdf(digest, ikm, salt, info, keylen, callback)` {#cryptohkdfdigest-ikm-salt-info-keylen-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una callback inválida al argumento `callback` ahora lanza `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v18.8.0, v16.18.0 | El material de clave de entrada ahora puede tener longitud cero. |
| v15.0.0 | Añadido en: v15.0.0 |
:::

- `digest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El algoritmo digest a usar.
- `ikm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/es/nodejs/api/crypto#class-keyobject) El material de clave de entrada. Debe proporcionarse pero puede tener longitud cero.
- `salt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) El valor de salt. Debe proporcionarse pero puede tener longitud cero.
- `info` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Valor de información adicional. Debe proporcionarse pero puede tener longitud cero, y no puede tener más de 1024 bytes.
- `keylen` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La longitud de la clave a generar. Debe ser mayor que 0. El valor máximo permitido es `255` veces el número de bytes producidos por la función digest seleccionada (p. ej., `sha512` genera hashes de 64 bytes, haciendo que la salida HKDF máxima sea de 16320 bytes).
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `derivedKey` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

HKDF es una función de derivación de clave simple definida en RFC 5869. Los `ikm`, `salt` e `info` dados se utilizan con el `digest` para derivar una clave de `keylen` bytes.

La función `callback` suministrada se llama con dos argumentos: `err` y `derivedKey`. Si ocurre un error al derivar la clave, se establecerá `err`; de lo contrario, `err` será `null`. La `derivedKey` generada con éxito se pasará al callback como un [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer). Se lanzará un error si alguno de los argumentos de entrada especifica valores o tipos no válidos.

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

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.8.0, v16.18.0 | El material de clave de entrada ahora puede tener longitud cero. |
| v15.0.0 | Añadido en: v15.0.0 |
:::

- `digest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) El algoritmo de resumen a utilizar.
- `ikm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/es/nodejs/api/crypto#class-keyobject) El material de clave de entrada. Debe proporcionarse, pero puede tener longitud cero.
- `salt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) El valor de salt. Debe proporcionarse, pero puede tener longitud cero.
- `info` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Valor de info adicional. Debe proporcionarse, pero puede tener longitud cero, y no puede superar los 1024 bytes.
- `keylen` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La longitud de la clave a generar. Debe ser mayor que 0. El valor máximo permitido es `255` veces el número de bytes producidos por la función de resumen seleccionada (por ejemplo, `sha512` genera hashes de 64 bytes, lo que hace que la salida HKDF máxima sea de 16320 bytes).
- Devuelve: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

Proporciona una función de derivación de claves HKDF síncrona como se define en RFC 5869. El `ikm`, `salt` e `info` dados se utilizan con el `digest` para derivar una clave de `keylen` bytes.

La `derivedKey` generada correctamente se devolverá como un [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer).

Se lanzará un error si alguno de los argumentos de entrada especifica valores o tipos no válidos, o si no se puede generar la clave derivada.

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

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar un callback inválido al argumento `callback` ahora lanza `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v15.0.0 | Los argumentos password y salt también pueden ser instancias de ArrayBuffer. |
| v14.0.0 | El parámetro `iterations` ahora está restringido a valores positivos. Las versiones anteriores trataban otros valores como uno. |
| v8.0.0 | El parámetro `digest` ahora siempre es requerido. |
| v6.0.0 | Llamar a esta función sin pasar el parámetro `digest` ahora está obsoleto y emitirá una advertencia. |
| v6.0.0 | La codificación predeterminada para `password` si es una cadena cambió de `binary` a `utf8`. |
| v0.5.5 | Añadido en: v0.5.5 |
:::

- `password` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `salt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `iterations` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `keylen` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `digest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `derivedKey` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer)

Proporciona una implementación asíncrona de la Función de Derivación de Claves Basada en Contraseña 2 (PBKDF2). Un algoritmo de resumen HMAC seleccionado especificado por `digest` se aplica para derivar una clave de la longitud de bytes solicitada (`keylen`) de la `password`, `salt` e `iterations`.

La función `callback` suministrada se llama con dos argumentos: `err` y `derivedKey`. Si ocurre un error al derivar la clave, se establecerá `err`; de lo contrario, `err` será `null`. Por defecto, la `derivedKey` generada correctamente se pasará al callback como un [`Buffer`](/es/nodejs/api/buffer). Se lanzará un error si alguno de los argumentos de entrada especifica valores o tipos no válidos.

El argumento `iterations` debe ser un número establecido lo más alto posible. Cuanto mayor sea el número de iteraciones, más segura será la clave derivada, pero tardará más tiempo en completarse.

El `salt` debe ser lo más único posible. Se recomienda que un salt sea aleatorio y de al menos 16 bytes de longitud. Consulte [NIST SP 800-132](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-132.pdf) para obtener más detalles.

Cuando se pasan cadenas para `password` o `salt`, por favor considere las [advertencias al usar cadenas como entradas para APIs criptográficas](/es/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis).

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

Se puede recuperar una matriz de funciones hash admitidas utilizando [`crypto.getHashes()`](/es/nodejs/api/crypto#cryptogethashes).

Esta API utiliza el threadpool de libuv, lo que puede tener implicaciones de rendimiento sorprendentes y negativas para algunas aplicaciones; consulte la documentación de [`UV_THREADPOOL_SIZE`](/es/nodejs/api/cli#uv_threadpool_sizesize) para obtener más información.


### `crypto.pbkdf2Sync(password, salt, iterations, keylen, digest)` {#cryptopbkdf2syncpassword-salt-iterations-keylen-digest}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v14.0.0 | El parámetro `iterations` ahora está restringido a valores positivos. Las versiones anteriores trataban otros valores como uno. |
| v6.0.0 | Llamar a esta función sin pasar el parámetro `digest` ahora está en desuso y emitirá una advertencia. |
| v6.0.0 | La codificación predeterminada para `password` si es una cadena cambió de `binary` a `utf8`. |
| v0.9.3 | Agregado en: v0.9.3 |
:::

- `password` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `salt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `iterations` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `keylen` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `digest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Devuelve: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer)

Proporciona una implementación sincrónica de la función de derivación de claves basada en contraseñas 2 (PBKDF2). Un algoritmo de resumen HMAC seleccionado especificado por `digest` se aplica para derivar una clave de la longitud de bytes solicitada (`keylen`) de la `password`, `salt` e `iterations`.

Si ocurre un error, se lanzará un `Error`, de lo contrario, la clave derivada se devolverá como un [`Buffer`](/es/nodejs/api/buffer).

El argumento `iterations` debe ser un número establecido lo más alto posible. Cuanto mayor sea el número de iteraciones, más segura será la clave derivada, pero tardará más tiempo en completarse.

El `salt` debe ser lo más único posible. Se recomienda que un salt sea aleatorio y tenga al menos 16 bytes de longitud. Consulte [NIST SP 800-132](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-132.pdf) para obtener más detalles.

Cuando pase cadenas para `password` o `salt`, considere las [advertencias al usar cadenas como entradas a las API criptográficas](/es/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis).

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

Se puede recuperar una matriz de funciones de resumen admitidas mediante [`crypto.getHashes()`](/es/nodejs/api/crypto#cryptogethashes).


### `crypto.privateDecrypt(privateKey, buffer)` {#cryptoprivatedecryptprivatekey-buffer}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v21.6.2, v20.11.1, v18.19.1 | El relleno `RSA_PKCS1_PADDING` se deshabilitó a menos que la compilación de OpenSSL admita el rechazo implícito. |
| v15.0.0 | Se agregaron string, ArrayBuffer y CryptoKey como tipos de clave permitidos. El oaepLabel puede ser un ArrayBuffer. El buffer puede ser un string o ArrayBuffer. Todos los tipos que aceptan buffers están limitados a un máximo de 2 ** 31 - 1 bytes. |
| v12.11.0 | Se agregó la opción `oaepLabel`. |
| v12.9.0 | Se agregó la opción `oaepHash`. |
| v11.6.0 | Esta función ahora admite objetos de clave. |
| v0.11.14 | Agregado en: v0.11.14 |
:::

- `privateKey` [\<Object\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/es/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/es/nodejs/api/webcrypto#class-cryptokey)
    - `oaepHash` [\<string\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#String_type) La función hash que se utilizará para el relleno OAEP y MGF1. **Predeterminado:** `'sha1'`
    - `oaepLabel` [\<string\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/DataView) La etiqueta que se utilizará para el relleno OAEP. Si no se especifica, no se utiliza ninguna etiqueta.
    - `padding` [\<crypto.constants\>](/es/nodejs/api/crypto#cryptoconstants) Un valor de relleno opcional definido en `crypto.constants`, que puede ser: `crypto.constants.RSA_NO_PADDING`, `crypto.constants.RSA_PKCS1_PADDING` o `crypto.constants.RSA_PKCS1_OAEP_PADDING`.
  
 
- `buffer` [\<string\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- Devuelve: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) Un nuevo `Buffer` con el contenido descifrado.

Descifra `buffer` con `privateKey`. `buffer` se cifró previamente utilizando la clave pública correspondiente, por ejemplo, utilizando [`crypto.publicEncrypt()`](/es/nodejs/api/crypto#cryptopublicencryptkey-buffer).

Si `privateKey` no es un [`KeyObject`](/es/nodejs/api/crypto#class-keyobject), esta función se comporta como si `privateKey` se hubiera pasado a [`crypto.createPrivateKey()`](/es/nodejs/api/crypto#cryptocreateprivatekeykey). Si es un objeto, se puede pasar la propiedad `padding`. De lo contrario, esta función utiliza `RSA_PKCS1_OAEP_PADDING`.

El uso de `crypto.constants.RSA_PKCS1_PADDING` en [`crypto.privateDecrypt()`](/es/nodejs/api/crypto#cryptoprivatedecryptprivatekey-buffer) requiere que OpenSSL admita el rechazo implícito (`rsa_pkcs1_implicit_rejection`). Si la versión de OpenSSL utilizada por Node.js no admite esta función, el intento de utilizar `RSA_PKCS1_PADDING` fallará.


### `crypto.privateEncrypt(privateKey, buffer)` {#cryptoprivateencryptprivatekey-buffer}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v15.0.0 | Se agregaron string, ArrayBuffer y CryptoKey como tipos de clave permitidos. La frase de contraseña puede ser un ArrayBuffer. El búfer puede ser un string o ArrayBuffer. Todos los tipos que aceptan búferes están limitados a un máximo de 2 ** 31 - 1 bytes. |
| v11.6.0 | Esta función ahora soporta objetos clave. |
| v1.1.0 | Agregado en: v1.1.0 |
:::

- `privateKey` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/es/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/es/nodejs/api/webcrypto#class-cryptokey) 
    - `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/es/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/es/nodejs/api/webcrypto#class-cryptokey) Una clave privada codificada en PEM.
    - `passphrase` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Una frase de contraseña opcional para la clave privada.
    - `padding` [\<crypto.constants\>](/es/nodejs/api/crypto#cryptoconstants) Un valor de relleno opcional definido en `crypto.constants`, que puede ser: `crypto.constants.RSA_NO_PADDING` o `crypto.constants.RSA_PKCS1_PADDING`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La codificación de cadena a usar cuando `buffer`, `key` o `passphrase` son cadenas.
  
 
- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- Devuelve: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) Un nuevo `Buffer` con el contenido encriptado.

Encripta `buffer` con `privateKey`. Los datos devueltos pueden ser desencriptados usando la clave pública correspondiente, por ejemplo usando [`crypto.publicDecrypt()`](/es/nodejs/api/crypto#cryptopublicdecryptkey-buffer).

Si `privateKey` no es un [`KeyObject`](/es/nodejs/api/crypto#class-keyobject), esta función se comporta como si `privateKey` se hubiera pasado a [`crypto.createPrivateKey()`](/es/nodejs/api/crypto#cryptocreateprivatekeykey). Si es un objeto, se puede pasar la propiedad `padding`. De lo contrario, esta función usa `RSA_PKCS1_PADDING`.


### `crypto.publicDecrypt(key, buffer)` {#cryptopublicdecryptkey-buffer}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v15.0.0 | Se agregaron string, ArrayBuffer y CryptoKey como tipos de clave permitidos. La contraseña puede ser un ArrayBuffer. El buffer puede ser un string o ArrayBuffer. Todos los tipos que aceptan buffers están limitados a un máximo de 2 ** 31 - 1 bytes. |
| v11.6.0 | Esta función ahora admite objetos de clave. |
| v1.1.0 | Agregado en: v1.1.0 |
:::

- `key` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/es/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/es/nodejs/api/webcrypto#class-cryptokey)
    - `passphrase` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Una contraseña opcional para la clave privada.
    - `padding` [\<crypto.constants\>](/es/nodejs/api/crypto#cryptoconstants) Un valor de padding opcional definido en `crypto.constants`, que puede ser: `crypto.constants.RSA_NO_PADDING` o `crypto.constants.RSA_PKCS1_PADDING`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La codificación de cadena a utilizar cuando `buffer`, `key` o `passphrase` son cadenas.


- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- Devuelve: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) Un nuevo `Buffer` con el contenido descifrado.

Descifra el `buffer` con `key`. El `buffer` se cifró previamente utilizando la clave privada correspondiente, por ejemplo, utilizando [`crypto.privateEncrypt()`](/es/nodejs/api/crypto#cryptoprivateencryptprivatekey-buffer).

Si `key` no es un [`KeyObject`](/es/nodejs/api/crypto#class-keyobject), esta función se comporta como si `key` se hubiera pasado a [`crypto.createPublicKey()`](/es/nodejs/api/crypto#cryptocreatepublickeykey). Si es un objeto, se puede pasar la propiedad `padding`. De lo contrario, esta función utiliza `RSA_PKCS1_PADDING`.

Dado que las claves públicas RSA se pueden derivar de las claves privadas, se puede pasar una clave privada en lugar de una clave pública.


### `crypto.publicEncrypt(key, buffer)` {#cryptopublicencryptkey-buffer}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v15.0.0 | Se agregaron string, ArrayBuffer y CryptoKey como tipos de clave permitidos. oaepLabel y passphrase pueden ser ArrayBuffers. El buffer puede ser un string o ArrayBuffer. Todos los tipos que aceptan buffers están limitados a un máximo de 2 ** 31 - 1 bytes. |
| v12.11.0 | Se agregó la opción `oaepLabel`. |
| v12.9.0 | Se agregó la opción `oaepHash`. |
| v11.6.0 | Esta función ahora soporta objetos key. |
| v0.11.14 | Agregado en: v0.11.14 |
:::

- `key` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/es/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/es/nodejs/api/webcrypto#class-cryptokey) 
    - `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/es/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/es/nodejs/api/webcrypto#class-cryptokey) Una clave pública o privada codificada en PEM, [\<KeyObject\>](/es/nodejs/api/crypto#class-keyobject) o [\<CryptoKey\>](/es/nodejs/api/webcrypto#class-cryptokey).
    - `oaepHash` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La función hash a utilizar para el relleno OAEP y MGF1. **Por defecto:** `'sha1'`
    - `oaepLabel` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) La etiqueta a utilizar para el relleno OAEP. Si no se especifica, no se utiliza ninguna etiqueta.
    - `passphrase` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Una frase de contraseña opcional para la clave privada.
    - `padding` [\<crypto.constants\>](/es/nodejs/api/crypto#cryptoconstants) Un valor de relleno opcional definido en `crypto.constants`, que puede ser: `crypto.constants.RSA_NO_PADDING`, `crypto.constants.RSA_PKCS1_PADDING` o `crypto.constants.RSA_PKCS1_OAEP_PADDING`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La codificación de cadena a utilizar cuando `buffer`, `key`, `oaepLabel` o `passphrase` son strings.
  
 
- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- Devuelve: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) Un nuevo `Buffer` con el contenido encriptado.

Encripta el contenido de `buffer` con `key` y devuelve un nuevo [`Buffer`](/es/nodejs/api/buffer) con el contenido encriptado. Los datos devueltos se pueden desencriptar utilizando la clave privada correspondiente, por ejemplo utilizando [`crypto.privateDecrypt()`](/es/nodejs/api/crypto#cryptoprivatedecryptprivatekey-buffer).

Si `key` no es un [`KeyObject`](/es/nodejs/api/crypto#class-keyobject), esta función se comporta como si `key` hubiera sido pasado a [`crypto.createPublicKey()`](/es/nodejs/api/crypto#cryptocreatepublickeykey). Si es un objeto, se puede pasar la propiedad `padding`. De lo contrario, esta función utiliza `RSA_PKCS1_OAEP_PADDING`.

Dado que las claves públicas RSA se pueden derivar de las claves privadas, se puede pasar una clave privada en lugar de una clave pública.


### `crypto.randomBytes(size[, callback])` {#cryptorandombytessize-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar un callback inválido al argumento `callback` ahora arroja `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v9.0.0 | Pasar `null` como el argumento `callback` ahora arroja `ERR_INVALID_CALLBACK`. |
| v0.5.8 | Agregado en: v0.5.8 |
:::

- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número de bytes a generar. El `size` no debe ser mayor que `2**31 - 1`.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `buf` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer)
  
 
- Devuelve: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) si la función `callback` no es proporcionada.

Genera datos pseudorandom seguros criptográficamente. El argumento `size` es un número que indica la cantidad de bytes a generar.

Si se proporciona una función `callback`, los bytes se generan de forma asíncrona y la función `callback` se invoca con dos argumentos: `err` y `buf`. Si ocurre un error, `err` será un objeto `Error`; de lo contrario, será `null`. El argumento `buf` es un [`Buffer`](/es/nodejs/api/buffer) que contiene los bytes generados.

::: code-group
```js [ESM]
// Asíncrono
const {
  randomBytes,
} = await import('node:crypto');

randomBytes(256, (err, buf) => {
  if (err) throw err;
  console.log(`${buf.length} bytes de datos aleatorios: ${buf.toString('hex')}`);
});
```

```js [CJS]
// Asíncrono
const {
  randomBytes,
} = require('node:crypto');

randomBytes(256, (err, buf) => {
  if (err) throw err;
  console.log(`${buf.length} bytes de datos aleatorios: ${buf.toString('hex')}`);
});
```
:::

Si no se proporciona la función `callback`, los bytes aleatorios se generan de forma síncrona y se devuelven como un [`Buffer`](/es/nodejs/api/buffer). Se lanzará un error si hay un problema al generar los bytes.

::: code-group
```js [ESM]
// Síncrono
const {
  randomBytes,
} = await import('node:crypto');

const buf = randomBytes(256);
console.log(
  `${buf.length} bytes de datos aleatorios: ${buf.toString('hex')}`);
```

```js [CJS]
// Síncrono
const {
  randomBytes,
} = require('node:crypto');

const buf = randomBytes(256);
console.log(
  `${buf.length} bytes de datos aleatorios: ${buf.toString('hex')}`);
```
:::

El método `crypto.randomBytes()` no se completará hasta que haya suficiente entropía disponible. Normalmente, esto no debería tardar más de unos pocos milisegundos. La única vez que la generación de bytes aleatorios puede bloquearse durante un período de tiempo más prolongado es inmediatamente después del arranque, cuando todo el sistema todavía tiene poca entropía.

Esta API utiliza el threadpool de libuv, lo que puede tener implicaciones de rendimiento sorprendentes y negativas para algunas aplicaciones; consulte la documentación de [`UV_THREADPOOL_SIZE`](/es/nodejs/api/cli#uv_threadpool_sizesize) para obtener más información.

La versión asíncrona de `crypto.randomBytes()` se lleva a cabo en una única solicitud de threadpool. Para minimizar la variación en la duración de las tareas del threadpool, particione las solicitudes grandes de `randomBytes` cuando lo haga como parte del cumplimiento de una solicitud del cliente.


### `crypto.randomFill(buffer[, offset][, size], callback)` {#cryptorandomfillbuffer-offset-size-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una callback no válida al argumento `callback` ahora lanza `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v9.0.0 | El argumento `buffer` puede ser cualquier `TypedArray` o `DataView`. |
| v7.10.0, v6.13.0 | Añadido en: v7.10.0, v6.13.0 |
:::

- `buffer` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Debe ser suministrado. El tamaño del `buffer` proporcionado no debe ser mayor que `2**31 - 1`.
- `offset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `0`
- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `buffer.length - offset`. El `size` no debe ser mayor que `2**31 - 1`.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `function(err, buf) {}`.

Esta función es similar a [`crypto.randomBytes()`](/es/nodejs/api/crypto#cryptorandombytessize-callback) pero requiere que el primer argumento sea un [`Buffer`](/es/nodejs/api/buffer) que será rellenado. También requiere que se pase un callback.

Si no se proporciona la función `callback`, se lanzará un error.

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

// Lo anterior es equivalente a lo siguiente:
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

// Lo anterior es equivalente a lo siguiente:
randomFill(buf, 5, 5, (err, buf) => {
  if (err) throw err;
  console.log(buf.toString('hex'));
});
```
:::

Cualquier instancia de `ArrayBuffer`, `TypedArray` o `DataView` puede ser pasada como `buffer`.

Aunque esto incluye instancias de `Float32Array` y `Float64Array`, esta función no debe ser utilizada para generar números de punto flotante aleatorios. El resultado puede contener `+Infinity`, `-Infinity` y `NaN`, e incluso si el array contiene sólo números finitos, no se extraen de una distribución aleatoria uniforme y no tienen límites inferiores o superiores significativos.

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

Esta API utiliza el threadpool de libuv, lo cual puede tener implicaciones de rendimiento sorprendentes y negativas para algunas aplicaciones; consulte la documentación de [`UV_THREADPOOL_SIZE`](/es/nodejs/api/cli#uv_threadpool_sizesize) para más información.

La versión asíncrona de `crypto.randomFill()` se lleva a cabo en una única solicitud de threadpool. Para minimizar la variación de la longitud de la tarea del threadpool, particione las solicitudes grandes de `randomFill` cuando lo haga como parte del cumplimiento de una solicitud de cliente.


### `crypto.randomFillSync(buffer[, offset][, size])` {#cryptorandomfillsyncbuffer-offset-size}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v9.0.0 | El argumento `buffer` puede ser cualquier `TypedArray` o `DataView`. |
| v7.10.0, v6.13.0 | Añadido en: v7.10.0, v6.13.0 |
:::

- `buffer` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Debe ser proporcionado. El tamaño del `buffer` proporcionado no debe ser mayor que `2**31 - 1`.
- `offset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `0`
- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predeterminado:** `buffer.length - offset`. El `size` no debe ser mayor que `2**31 - 1`.
- Devuelve: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) El objeto pasado como argumento `buffer`.

Versión síncrona de [`crypto.randomFill()`](/es/nodejs/api/crypto#cryptorandomfillbuffer-offset-size-callback).

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const { randomFillSync } = await import('node:crypto');

const buf = Buffer.alloc(10);
console.log(randomFillSync(buf).toString('hex'));

randomFillSync(buf, 5);
console.log(buf.toString('hex'));

// The above is equivalent to the following:
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

// The above is equivalent to the following:
randomFillSync(buf, 5, 5);
console.log(buf.toString('hex'));
```
:::

Cualquier instancia de `ArrayBuffer`, `TypedArray` o `DataView` puede ser pasada como `buffer`.

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

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una devolución de llamada inválida al argumento `callback` ahora lanza `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v14.10.0, v12.19.0 | Añadido en: v14.10.0, v12.19.0 |
:::

- `min` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Inicio del rango aleatorio (inclusivo). **Predeterminado:** `0`.
- `max` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Fin del rango aleatorio (exclusivo).
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `function(err, n) {}`.

Devuelve un entero aleatorio `n` tal que `min \<= n \< max`. Esta implementación evita el [sesgo de módulo](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#Modulo_bias).

El rango (`max - min`) debe ser menor que 2. `min` y `max` deben ser [enteros seguros](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger).

Si no se proporciona la función `callback`, el entero aleatorio se genera de forma síncrona.

::: code-group
```js [ESM]
// Asíncrono
const {
  randomInt,
} = await import('node:crypto');

randomInt(3, (err, n) => {
  if (err) throw err;
  console.log(`Número aleatorio elegido de (0, 1, 2): ${n}`);
});
```

```js [CJS]
// Asíncrono
const {
  randomInt,
} = require('node:crypto');

randomInt(3, (err, n) => {
  if (err) throw err;
  console.log(`Número aleatorio elegido de (0, 1, 2): ${n}`);
});
```
:::

::: code-group
```js [ESM]
// Síncrono
const {
  randomInt,
} = await import('node:crypto');

const n = randomInt(3);
console.log(`Número aleatorio elegido de (0, 1, 2): ${n}`);
```

```js [CJS]
// Síncrono
const {
  randomInt,
} = require('node:crypto');

const n = randomInt(3);
console.log(`Número aleatorio elegido de (0, 1, 2): ${n}`);
```
:::

::: code-group
```js [ESM]
// Con el argumento `min`
const {
  randomInt,
} = await import('node:crypto');

const n = randomInt(1, 7);
console.log(`El dado rodó: ${n}`);
```

```js [CJS]
// Con el argumento `min`
const {
  randomInt,
} = require('node:crypto');

const n = randomInt(1, 7);
console.log(`El dado rodó: ${n}`);
```
:::


### `crypto.randomUUID([options])` {#cryptorandomuuidoptions}

**Añadido en: v15.6.0, v14.17.0**

- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `disableEntropyCache` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Por defecto, para mejorar el rendimiento, Node.js genera y almacena en caché suficientes datos aleatorios para generar hasta 128 UUID aleatorios. Para generar un UUID sin usar la caché, establece `disableEntropyCache` en `true`. **Predeterminado:** `false`.


- Devuelve: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Genera un UUID aleatorio [RFC 4122](https://www.rfc-editor.org/rfc/rfc4122.txt) versión 4. El UUID se genera utilizando un generador de números pseudoaleatorios criptográfico.

### `crypto.scrypt(password, salt, keylen[, options], callback)` {#cryptoscryptpassword-salt-keylen-options-callback}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una callback no válida al argumento `callback` ahora lanza `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v15.0.0 | Los argumentos password y salt también pueden ser instancias de ArrayBuffer. |
| v12.8.0, v10.17.0 | El valor `maxmem` ahora puede ser cualquier entero seguro. |
| v10.9.0 | Se han añadido los nombres de las opciones `cost`, `blockSize` y `parallelization`. |
| v10.5.0 | Añadido en: v10.5.0 |
:::

- `password` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `salt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `keylen` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cost` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Parámetro de coste de CPU/memoria. Debe ser una potencia de dos mayor que uno. **Predeterminado:** `16384`.
    - `blockSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Data_structures#Number_type) Parámetro de tamaño de bloque. **Predeterminado:** `8`.
    - `parallelization` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Parámetro de paralelización. **Predeterminado:** `1`.
    - `N` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Alias de `cost`. Sólo se puede especificar uno de los dos.
    - `r` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Alias de `blockSize`. Sólo se puede especificar uno de los dos.
    - `p` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Alias de `parallelization`. Sólo se puede especificar uno de los dos.
    - `maxmem` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Límite superior de memoria. Es un error cuando (aproximadamente) `128 * N * r \> maxmem`. **Predeterminado:** `32 * 1024 * 1024`.


- `callback` [\<Función\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `derivedKey` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer)



Proporciona una implementación [scrypt](https://en.wikipedia.org/wiki/Scrypt) asíncrona. Scrypt es una función de derivación de claves basada en contraseñas que está diseñada para ser costosa desde el punto de vista computacional y de la memoria con el fin de que los ataques de fuerza bruta no sean gratificantes.

El `salt` debe ser lo más único posible. Se recomienda que un salt sea aleatorio y tenga al menos 16 bytes de longitud. Consulta [NIST SP 800-132](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-132.pdf) para obtener más detalles.

Al pasar cadenas para `password` o `salt`, considera [las advertencias al usar cadenas como entradas a las API criptográficas](/es/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis).

La función `callback` se llama con dos argumentos: `err` y `derivedKey`. `err` es un objeto de excepción cuando falla la derivación de la clave, de lo contrario `err` es `null`. `derivedKey` se pasa a la callback como un [`Buffer`](/es/nodejs/api/buffer).

Se lanza una excepción cuando cualquiera de los argumentos de entrada especifica valores o tipos no válidos.



::: code-group
```js [ESM]
const {
  scrypt,
} = await import('node:crypto');

// Usando los valores predeterminados de fábrica.
scrypt('password', 'salt', 64, (err, derivedKey) => {
  if (err) throw err;
  console.log(derivedKey.toString('hex'));  // '3745e48...08d59ae'
});
// Usando un parámetro N personalizado. Debe ser una potencia de dos.
scrypt('password', 'salt', 64, { N: 1024 }, (err, derivedKey) => {
  if (err) throw err;
  console.log(derivedKey.toString('hex'));  // '3745e48...aa39b34'
});
```

```js [CJS]
const {
  scrypt,
} = require('node:crypto');

// Usando los valores predeterminados de fábrica.
scrypt('password', 'salt', 64, (err, derivedKey) => {
  if (err) throw err;
  console.log(derivedKey.toString('hex'));  // '3745e48...08d59ae'
});
// Usando un parámetro N personalizado. Debe ser una potencia de dos.
scrypt('password', 'salt', 64, { N: 1024 }, (err, derivedKey) => {
  if (err) throw err;
  console.log(derivedKey.toString('hex'));  // '3745e48...aa39b34'
});
```
:::


### `crypto.scryptSync(password, salt, keylen[, options])` {#cryptoscryptsyncpassword-salt-keylen-options}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v12.8.0, v10.17.0 | El valor de `maxmem` ahora puede ser cualquier entero seguro. |
| v10.9.0 | Se han añadido los nombres de las opciones `cost`, `blockSize` y `parallelization`. |
| v10.5.0 | Añadido en: v10.5.0 |
:::

- `password` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `salt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `keylen` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cost` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Parámetro de coste de CPU/memoria. Debe ser una potencia de dos mayor que uno. **Predeterminado:** `16384`.
    - `blockSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Parámetro de tamaño de bloque. **Predeterminado:** `8`.
    - `parallelization` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Parámetro de paralelización. **Predeterminado:** `1`.
    - `N` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Alias para `cost`. Sólo se puede especificar uno de los dos.
    - `r` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Alias para `blockSize`. Sólo se puede especificar uno de los dos.
    - `p` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Alias para `parallelization`. Sólo se puede especificar uno de los dos.
    - `maxmem` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Límite superior de memoria. Es un error cuando (aproximadamente) `128 * N * r \> maxmem`. **Predeterminado:** `32 * 1024 * 1024`.


- Devuelve: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer)

Proporciona una implementación síncrona de [scrypt](https://en.wikipedia.org/wiki/Scrypt). Scrypt es una función de derivación de claves basada en contraseñas que está diseñada para ser costosa computacionalmente y en cuanto a memoria con el fin de hacer que los ataques de fuerza bruta no sean gratificantes.

El `salt` debe ser lo más único posible. Se recomienda que un salt sea aleatorio y tenga al menos 16 bytes de longitud. Consulte [NIST SP 800-132](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-132.pdf) para obtener más detalles.

Cuando se pasan cadenas para `password` o `salt`, por favor considere [precauciones al usar cadenas como entradas para APIs criptográficas](/es/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis).

Se lanza una excepción cuando la derivación de claves falla, de lo contrario la clave derivada se devuelve como un [`Buffer`](/es/nodejs/api/buffer).

Se lanza una excepción cuando cualquiera de los argumentos de entrada especifica valores o tipos no válidos.

::: code-group
```js [ESM]
const {
  scryptSync,
} = await import('node:crypto');
// Using the factory defaults.

const key1 = scryptSync('password', 'salt', 64);
console.log(key1.toString('hex'));  // '3745e48...08d59ae'
// Using a custom N parameter. Must be a power of two.
const key2 = scryptSync('password', 'salt', 64, { N: 1024 });
console.log(key2.toString('hex'));  // '3745e48...aa39b34'
```

```js [CJS]
const {
  scryptSync,
} = require('node:crypto');
// Using the factory defaults.

const key1 = scryptSync('password', 'salt', 64);
console.log(key1.toString('hex'));  // '3745e48...08d59ae'
// Using a custom N parameter. Must be a power of two.
const key2 = scryptSync('password', 'salt', 64, { N: 1024 });
console.log(key2.toString('hex'));  // '3745e48...aa39b34'
```
:::

### `crypto.secureHeapUsed()` {#cryptosecureheapused}

**Agregada en: v15.6.0**

- Devuelve: [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `total` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El tamaño total del heap seguro asignado, tal como se especifica mediante el indicador de línea de comandos `--secure-heap=n`.
    - `min` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La asignación mínima del heap seguro, tal como se especifica mediante el indicador de línea de comandos `--secure-heap-min`.
    - `used` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) El número total de bytes actualmente asignados desde el heap seguro.
    - `utilization` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La relación calculada de `used` a `total` bytes asignados.



### `crypto.setEngine(engine[, flags])` {#cryptosetengineengine-flags}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v22.4.0, v20.16.0 | El soporte del motor personalizado en OpenSSL 3 está obsoleto. |
| v0.11.11 | Agregada en: v0.11.11 |
:::

- `engine` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `flags` [\<crypto.constants\>](/es/nodejs/api/crypto#cryptoconstants) **Predeterminado:** `crypto.constants.ENGINE_METHOD_ALL`

Cargue y establezca el `engine` para algunas o todas las funciones de OpenSSL (seleccionadas por flags). El soporte para motores personalizados en OpenSSL está obsoleto desde OpenSSL 3.

`engine` podría ser un id o una ruta a la biblioteca compartida del motor.

El argumento opcional `flags` usa `ENGINE_METHOD_ALL` de forma predeterminada. Los `flags` son un campo de bits que toma uno o una mezcla de los siguientes flags (definidos en `crypto.constants`):

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

**Agregado en: v10.0.0**

- `bool` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` para habilitar el modo FIPS.

Habilita el proveedor de cifrado compatible con FIPS en una compilación de Node.js habilitada para FIPS. Lanza un error si el modo FIPS no está disponible.

### `crypto.sign(algorithm, data, key[, callback])` {#cryptosignalgorithm-data-key-callback}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar una función de retrollamada no válida al argumento `callback` ahora lanza `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v15.12.0 | Se agregó el argumento opcional de retrollamada. |
| v13.2.0, v12.16.0 | Esta función ahora soporta firmas DSA y ECDSA IEEE-P1363. |
| v12.0.0 | Agregado en: v12.0.0 |
:::

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
- `data` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `key` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/es/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/es/nodejs/api/webcrypto#class-cryptokey)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `signature` [\<Buffer\>](/es/nodejs/api/buffer#class-buffer)
  
 
- Devuelve: [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) si la función `callback` no se proporciona.

Calcula y devuelve la firma para `data` utilizando la clave privada y el algoritmo dados. Si `algorithm` es `null` o `undefined`, entonces el algoritmo depende del tipo de clave (especialmente Ed25519 y Ed448).

Si `key` no es un [`KeyObject`](/es/nodejs/api/crypto#class-keyobject), esta función se comporta como si `key` se hubiera pasado a [`crypto.createPrivateKey()`](/es/nodejs/api/crypto#cryptocreateprivatekeykey). Si es un objeto, se pueden pasar las siguientes propiedades adicionales:

-  `dsaEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Para DSA y ECDSA, esta opción especifica el formato de la firma generada. Puede ser uno de los siguientes: 
    - `'der'` (predeterminado): Estructura de firma ASN.1 con codificación DER que codifica `(r, s)`.
    - `'ieee-p1363'`: Formato de firma `r || s` como se propone en IEEE-P1363.
  
 
-  `padding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Valor de relleno opcional para RSA, uno de los siguientes: 
    - `crypto.constants.RSA_PKCS1_PADDING` (predeterminado)
    - `crypto.constants.RSA_PKCS1_PSS_PADDING`
  
 `RSA_PKCS1_PSS_PADDING` utilizará MGF1 con la misma función hash utilizada para firmar el mensaje como se especifica en la sección 3.1 de [RFC 4055](https://www.rfc-editor.org/rfc/rfc4055.txt). 
-  `saltLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Longitud de la sal para cuando el relleno es `RSA_PKCS1_PSS_PADDING`. El valor especial `crypto.constants.RSA_PSS_SALTLEN_DIGEST` establece la longitud de la sal al tamaño del resumen, `crypto.constants.RSA_PSS_SALTLEN_MAX_SIGN` (predeterminado) la establece al valor máximo permitido. 

Si se proporciona la función `callback`, esta función utiliza el grupo de hilos de libuv.


### `crypto.subtle` {#cryptosubtle}

**Agregado en: v17.4.0**

- Tipo: [\<SubtleCrypto\>](/es/nodejs/api/webcrypto#class-subtlecrypto)

Un alias conveniente para [`crypto.webcrypto.subtle`](/es/nodejs/api/webcrypto#class-subtlecrypto).

### `crypto.timingSafeEqual(a, b)` {#cryptotimingsafeequala-b}


::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v15.0.0 | Los argumentos a y b también pueden ser ArrayBuffer. |
| v6.6.0 | Agregado en: v6.6.0 |
:::

- `a` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `b` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Esta función compara los bytes subyacentes que representan las instancias de `ArrayBuffer`, `TypedArray` o `DataView` dadas utilizando un algoritmo de tiempo constante.

Esta función no filtra información de tiempo que permitiría a un atacante adivinar uno de los valores. Esto es adecuado para comparar resúmenes HMAC o valores secretos como cookies de autenticación o [URL de capacidad](https://www.w3.org/TR/capability-urls/).

`a` y `b` deben ser ambos `Buffer`s, `TypedArray`s o `DataView`s, y deben tener la misma longitud de bytes. Se genera un error si `a` y `b` tienen diferentes longitudes de bytes.

Si al menos uno de `a` y `b` es un `TypedArray` con más de un byte por entrada, como `Uint16Array`, el resultado se calculará utilizando el orden de bytes de la plataforma.

**Cuando ambas entradas son <code>Float32Array</code>s o
<code>Float64Array</code>s, esta función podría devolver resultados inesperados debido a la
codificación IEEE 754 de números de coma flotante. En particular, ni <code>x === y</code> ni
<code>Object.is(x, y)</code> implica que las representaciones de bytes de dos números de coma
flotante <code>x</code> e <code>y</code> sean iguales.**

El uso de `crypto.timingSafeEqual` no garantiza que el código *circundante* sea seguro en el tiempo. Se debe tener cuidado para garantizar que el código circundante no introduzca vulnerabilidades de tiempo.


### `crypto.verify(algorithm, data, key, signature[, callback])` {#cryptoverifyalgorithm-data-key-signature-callback}

::: info [Historial]
| Versión | Cambios |
| --- | --- |
| v18.0.0 | Pasar un callback inválido al argumento `callback` ahora arroja `ERR_INVALID_ARG_TYPE` en lugar de `ERR_INVALID_CALLBACK`. |
| v15.12.0 | Se agregó el argumento callback opcional. |
| v15.0.0 | Los argumentos data, key y signature también pueden ser ArrayBuffer. |
| v13.2.0, v12.16.0 | Esta función ahora soporta firmas DSA y ECDSA IEEE-P1363. |
| v12.0.0 | Agregado en: v12.0.0 |
:::

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
- `data` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `key` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/es/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/es/nodejs/api/webcrypto#class-cryptokey)
- `signature` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/es/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `result` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
  
 
- Devuelve: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` o `false` dependiendo de la validez de la firma para los datos y la clave pública si no se proporciona la función `callback`.

Verifica la firma dada para `data` utilizando la clave y el algoritmo dados. Si `algorithm` es `null` o `undefined`, entonces el algoritmo depende del tipo de clave (especialmente Ed25519 y Ed448).

Si `key` no es un [`KeyObject`](/es/nodejs/api/crypto#class-keyobject), esta función se comporta como si `key` se hubiera pasado a [`crypto.createPublicKey()`](/es/nodejs/api/crypto#cryptocreatepublickeykey). Si es un objeto, se pueden pasar las siguientes propiedades adicionales:

-  `dsaEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Para DSA y ECDSA, esta opción especifica el formato de la firma. Puede ser uno de los siguientes: 
    - `'der'` (por defecto): Estructura de firma ASN.1 codificada en DER que codifica `(r, s)`.
    - `'ieee-p1363'`: Formato de firma `r || s` como se propone en IEEE-P1363.
  
 
-  `padding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Valor de relleno opcional para RSA, uno de los siguientes: 
    - `crypto.constants.RSA_PKCS1_PADDING` (por defecto)
    - `crypto.constants.RSA_PKCS1_PSS_PADDING`
  
 `RSA_PKCS1_PSS_PADDING` utilizará MGF1 con la misma función hash utilizada para firmar el mensaje como se especifica en la sección 3.1 de [RFC 4055](https://www.rfc-editor.org/rfc/rfc4055.txt). 
-  `saltLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Longitud de la sal para cuando el relleno es `RSA_PKCS1_PSS_PADDING`. El valor especial `crypto.constants.RSA_PSS_SALTLEN_DIGEST` establece la longitud de la sal al tamaño del resumen, `crypto.constants.RSA_PSS_SALTLEN_MAX_SIGN` (por defecto) lo establece al valor máximo permisible. 

El argumento `signature` es la firma previamente calculada para los `data`.

Dado que las claves públicas pueden derivarse de las claves privadas, se puede pasar una clave privada o una clave pública para `key`.

Si se proporciona la función `callback`, esta función utiliza el threadpool de libuv.


### `crypto.webcrypto` {#cryptowebcrypto}

**Agregado en: v15.0.0**

Tipo: [\<Crypto\>](/es/nodejs/api/webcrypto#class-crypto) Una implementación del estándar Web Crypto API.

Consulte la [documentación de Web Crypto API](/es/nodejs/api/webcrypto) para obtener más detalles.

## Notas {#notes}

### Uso de cadenas como entradas para las API criptográficas {#using-strings-as-inputs-to-cryptographic-apis}

Por razones históricas, muchas API criptográficas proporcionadas por Node.js aceptan cadenas como entradas donde el algoritmo criptográfico subyacente funciona con secuencias de bytes. Estas instancias incluyen textos planos, textos cifrados, claves simétricas, vectores de inicialización, contraseñas, sales, etiquetas de autenticación y datos autenticados adicionales.

Al pasar cadenas a las API criptográficas, tenga en cuenta los siguientes factores.

-  No todas las secuencias de bytes son cadenas UTF-8 válidas. Por lo tanto, cuando una secuencia de bytes de longitud `n` se deriva de una cadena, su entropía es generalmente menor que la entropía de una secuencia `n` de bytes aleatoria o pseudoaleatoria. Por ejemplo, ninguna cadena UTF-8 dará como resultado la secuencia de bytes `c0 af`. Las claves secretas deben ser casi exclusivamente secuencias de bytes aleatorias o pseudoaleatorias.
-  De manera similar, al convertir secuencias de bytes aleatorias o pseudoaleatorias en cadenas UTF-8, las subsecuencias que no representan puntos de código válidos pueden ser reemplazadas por el carácter de reemplazo Unicode (`U+FFFD`). La representación de bytes de la cadena Unicode resultante puede, por lo tanto, no ser igual a la secuencia de bytes de la que se creó la cadena. Las salidas de los cifrados, las funciones hash, los algoritmos de firma y las funciones de derivación de claves son secuencias de bytes pseudoaleatorias y no deben usarse como cadenas Unicode.
-  Cuando las cadenas se obtienen de la entrada del usuario, algunos caracteres Unicode se pueden representar de múltiples formas equivalentes que dan como resultado diferentes secuencias de bytes. Por ejemplo, al pasar una contraseña de usuario a una función de derivación de claves, como PBKDF2 o scrypt, el resultado de la función de derivación de claves depende de si la cadena usa caracteres compuestos o descompuestos. Node.js no normaliza las representaciones de caracteres. Los desarrolladores deben considerar usar [`String.prototype.normalize()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize) en las entradas del usuario antes de pasarlas a las API criptográficas.


### API de streams heredada (anterior a Node.js 0.10) {#legacy-streams-api-prior-to-nodejs-010}

El módulo Crypto se añadió a Node.js antes de que existiera el concepto de una API de Stream unificada, y antes de que existieran los objetos [`Buffer`](/es/nodejs/api/buffer) para manejar datos binarios. Como tal, muchas clases `crypto` tienen métodos que no se encuentran normalmente en otras clases de Node.js que implementan la API de [streams](/es/nodejs/api/stream) (p.ej. `update()`, `final()` o `digest()`). Además, muchos métodos aceptaban y devolvían cadenas codificadas en `'latin1'` por defecto en lugar de `Buffer`s. Este valor predeterminado se cambió después de Node.js v0.8 para utilizar objetos [`Buffer`](/es/nodejs/api/buffer) de forma predeterminada.

### Soporte para algoritmos débiles o comprometidos {#support-for-weak-or-compromised-algorithms}

El módulo `node:crypto` todavía soporta algunos algoritmos que ya están comprometidos y no se recomienda su uso. La API también permite el uso de cifrados y hashes con un tamaño de clave pequeño que son demasiado débiles para un uso seguro.

Los usuarios deben asumir toda la responsabilidad de seleccionar el algoritmo criptográfico y el tamaño de la clave de acuerdo con sus requisitos de seguridad.

Basado en las recomendaciones de [NIST SP 800-131A](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-131Ar2.pdf):

- MD5 y SHA-1 ya no son aceptables cuando se requiere resistencia a la colisión, como en las firmas digitales.
- Se recomienda que la clave utilizada con los algoritmos RSA, DSA y DH tenga al menos 2048 bits y la de la curva de ECDSA y ECDH al menos 224 bits, para ser segura para su uso durante varios años.
- Los grupos DH de `modp1`, `modp2` y `modp5` tienen un tamaño de clave menor a 2048 bits y no se recomiendan.

Consulta la referencia para otras recomendaciones y detalles.

Algunos algoritmos que tienen debilidades conocidas y son de poca relevancia en la práctica sólo están disponibles a través del [proveedor heredado](/es/nodejs/api/cli#--openssl-legacy-provider), que no está habilitado por defecto.

### Modo CCM {#ccm-mode}

CCM es uno de los [algoritmos AEAD](https://en.wikipedia.org/wiki/Authenticated_encryption) soportados. Las aplicaciones que utilizan este modo deben adherirse a ciertas restricciones al usar la API de cifrado:

- La longitud de la etiqueta de autenticación debe especificarse durante la creación del cifrado estableciendo la opción `authTagLength` y debe ser una de 4, 6, 8, 10, 12, 14 o 16 bytes.
- La longitud del vector de inicialización (nonce) `N` debe estar entre 7 y 13 bytes (`7 ≤ N ≤ 13`).
- La longitud del texto plano está limitada a `2 ** (8 * (15 - N))` bytes.
- Al descifrar, la etiqueta de autenticación debe establecerse a través de `setAuthTag()` antes de llamar a `update()`. De lo contrario, el descifrado fallará y `final()` lanzará un error en cumplimiento de la sección 2.6 de [RFC 3610](https://www.rfc-editor.org/rfc/rfc3610.txt).
- El uso de métodos de flujo como `write(data)`, `end(data)` o `pipe()` en modo CCM podría fallar ya que CCM no puede manejar más de un trozo de datos por instancia.
- Al pasar datos autenticados adicionales (AAD), la longitud del mensaje real en bytes debe pasarse a `setAAD()` a través de la opción `plaintextLength`. Muchas bibliotecas criptográficas incluyen la etiqueta de autenticación en el texto cifrado, lo que significa que producen textos cifrados de la longitud `plaintextLength + authTagLength`. Node.js no incluye la etiqueta de autenticación, por lo que la longitud del texto cifrado es siempre `plaintextLength`. Esto no es necesario si no se utiliza AAD.
- Como CCM procesa todo el mensaje a la vez, `update()` debe llamarse exactamente una vez.
- Aunque llamar a `update()` es suficiente para cifrar/descifrar el mensaje, las aplicaciones *deben* llamar a `final()` para calcular o verificar la etiqueta de autenticación.

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


### Modo FIPS {#fips-mode}

Cuando se utiliza OpenSSL 3, Node.js soporta FIPS 140-2 cuando se usa con un proveedor OpenSSL 3 apropiado, como el [proveedor FIPS de OpenSSL 3](https://www.openssl.org/docs/man3.0/man7/crypto#FIPS-provider), que se puede instalar siguiendo las instrucciones del [archivo README de FIPS de OpenSSL](https://github.com/openssl/openssl/blob/openssl-3.0/README-FIPS.md).

Para el soporte de FIPS en Node.js necesitará:

- Un proveedor FIPS de OpenSSL 3 correctamente instalado.
- Un [archivo de configuración del módulo FIPS](https://www.openssl.org/docs/man3.0/man5/fips_config) de OpenSSL 3.
- Un archivo de configuración de OpenSSL 3 que haga referencia al archivo de configuración del módulo FIPS.

Node.js deberá configurarse con un archivo de configuración de OpenSSL que apunte al proveedor FIPS. Un archivo de configuración de ejemplo se ve así:

```text [TEXT]
nodejs_conf = nodejs_init

.include /<ruta absoluta>/fipsmodule.cnf

[nodejs_init]
providers = provider_sect

[provider_sect]
default = default_sect
# El nombre de la sección fips debe coincidir con el nombre de la sección dentro del {#the-fips-section-name-should-match-the-section-name-inside-the}
# fipsmodule.cnf incluido.
fips = fips_sect

[default_sect]
activate = 1
```
donde `fipsmodule.cnf` es el archivo de configuración del módulo FIPS generado a partir del paso de instalación del proveedor FIPS:

```bash [BASH]
openssl fipsinstall
```
Establezca la variable de entorno `OPENSSL_CONF` para que apunte a su archivo de configuración y `OPENSSL_MODULES` a la ubicación de la biblioteca dinámica del proveedor FIPS. Por ejemplo:

```bash [BASH]
export OPENSSL_CONF=/<ruta al archivo de configuración>/nodejs.cnf
export OPENSSL_MODULES=/<ruta a la libreria openssl>/ossl-modules
```
El modo FIPS se puede habilitar en Node.js ya sea:

- Iniciando Node.js con los flags de línea de comandos `--enable-fips` o `--force-fips`.
- Llamando programáticamente a `crypto.setFips(true)`.

Opcionalmente, el modo FIPS se puede habilitar en Node.js a través del archivo de configuración de OpenSSL. Por ejemplo:

```text [TEXT]
nodejs_conf = nodejs_init

.include /<ruta absoluta>/fipsmodule.cnf

[nodejs_init]
providers = provider_sect
alg_section = algorithm_sect

[provider_sect]
default = default_sect
# El nombre de la sección fips debe coincidir con el nombre de la sección dentro del {#included-fipsmodulecnf}
# fipsmodule.cnf incluido.
fips = fips_sect

[default_sect]
activate = 1

[algorithm_sect]
default_properties = fips=yes
```

## Constantes criptográficas {#the-fips-section-name-should-match-the-section-name-inside-the_1}

Las siguientes constantes exportadas por `crypto.constants` se aplican a varios usos de los módulos `node:crypto`, `node:tls` y `node:https` y generalmente son específicas de OpenSSL.

### Opciones de OpenSSL {#included-fipsmodulecnf_1}

Consulte la [lista de banderas SSL OP](https://wiki.openssl.org/index.php/List_of_SSL_OP_Flags#Table_of_Options) para obtener detalles.

| Constante | Descripción |
| --- | --- |
| `SSL_OP_ALL` | Aplica múltiples soluciones para errores dentro de OpenSSL. Consulte       [https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options.html](https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options)       para más detalles. |
| `SSL_OP_ALLOW_NO_DHE_KEX` | Indica a OpenSSL que permita un modo de intercambio de claves no basado en [EC]DHE     para TLS v1.3 |
| `SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION` | Permite la renegociación insegura heredada entre OpenSSL y clientes o servidores sin parches. Consulte       [https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options.html](https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options)  . |
| `SSL_OP_CIPHER_SERVER_PREFERENCE` | Intenta usar las preferencias del servidor en lugar de las del cliente al     seleccionar un cifrado. El comportamiento depende de la versión del protocolo. Consulte       [https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options.html](https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options)  . |
| `SSL_OP_CISCO_ANYCONNECT` | Indica a OpenSSL que use el identificador de versión de Cisco de DTLS_BAD_VER. |
| `SSL_OP_COOKIE_EXCHANGE` | Indica a OpenSSL que active el intercambio de cookies. |
| `SSL_OP_CRYPTOPRO_TLSEXT_BUG` | Indica a OpenSSL que agregue la extensión server-hello de una versión temprana     del borrador de cryptopro. |
| `SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS` | Indica a OpenSSL que deshabilite una solución para una vulnerabilidad de SSL 3.0/TLS 1.0     agregada en OpenSSL 0.9.6d. |
| `SSL_OP_LEGACY_SERVER_CONNECT` | Permite la conexión inicial a servidores que no admiten RI. |
| `SSL_OP_NO_COMPRESSION` | Indica a OpenSSL que deshabilite el soporte para la compresión SSL/TLS. |
| `SSL_OP_NO_ENCRYPT_THEN_MAC` | Indica a OpenSSL que deshabilite encrypt-then-MAC. |
| `SSL_OP_NO_QUERY_MTU` ||
| `SSL_OP_NO_RENEGOTIATION` | Indica a OpenSSL que deshabilite la renegociación. |
| `SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION` | Indica a OpenSSL que siempre inicie una nueva sesión al realizar la     renegociación. |
| `SSL_OP_NO_SSLv2` | Indica a OpenSSL que desactive SSL v2 |
| `SSL_OP_NO_SSLv3` | Indica a OpenSSL que desactive SSL v3 |
| `SSL_OP_NO_TICKET` | Indica a OpenSSL que deshabilite el uso de tickets RFC4507bis. |
| `SSL_OP_NO_TLSv1` | Indica a OpenSSL que desactive TLS v1 |
| `SSL_OP_NO_TLSv1_1` | Indica a OpenSSL que desactive TLS v1.1 |
| `SSL_OP_NO_TLSv1_2` | Indica a OpenSSL que desactive TLS v1.2 |
| `SSL_OP_NO_TLSv1_3` | Indica a OpenSSL que desactive TLS v1.3 |
| `SSL_OP_PRIORITIZE_CHACHA` | Indica al servidor OpenSSL que priorice ChaCha20-Poly1305     cuando el cliente lo haga.     Esta opción no tiene efecto si       `SSL_OP_CIPHER_SERVER_PREFERENCE`       no está habilitada. |
| `SSL_OP_TLS_ROLLBACK_BUG` | Indica a OpenSSL que deshabilite la detección de ataques de reversión de versión. |


### Constantes del motor OpenSSL {#crypto-constants}

| Constante | Descripción |
| --- | --- |
| `ENGINE_METHOD_RSA` | Limitar el uso del motor a RSA |
| `ENGINE_METHOD_DSA` | Limitar el uso del motor a DSA |
| `ENGINE_METHOD_DH` | Limitar el uso del motor a DH |
| `ENGINE_METHOD_RAND` | Limitar el uso del motor a RAND |
| `ENGINE_METHOD_EC` | Limitar el uso del motor a EC |
| `ENGINE_METHOD_CIPHERS` | Limitar el uso del motor a CIPHERS |
| `ENGINE_METHOD_DIGESTS` | Limitar el uso del motor a DIGESTS |
| `ENGINE_METHOD_PKEY_METHS` | Limitar el uso del motor a PKEY_METHS |
| `ENGINE_METHOD_PKEY_ASN1_METHS` | Limitar el uso del motor a PKEY_ASN1_METHS |
| `ENGINE_METHOD_ALL` ||
| `ENGINE_METHOD_NONE` ||
### Otras constantes de OpenSSL {#openssl-options}

| Constante | Descripción |
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
| `RSA_PSS_SALTLEN_DIGEST` | Establece la longitud de la sal para `RSA_PKCS1_PSS_PADDING` al tamaño del resumen al firmar o verificar. |
| `RSA_PSS_SALTLEN_MAX_SIGN` | Establece la longitud de la sal para `RSA_PKCS1_PSS_PADDING` al valor máximo permitido al firmar datos. |
| `RSA_PSS_SALTLEN_AUTO` | Hace que la longitud de la sal para `RSA_PKCS1_PSS_PADDING` se determine automáticamente al verificar una firma. |
| `POINT_CONVERSION_COMPRESSED` ||
| `POINT_CONVERSION_UNCOMPRESSED` ||
| `POINT_CONVERSION_HYBRID` ||
### Constantes de crypto de Node.js {#openssl-engine-constants}

| Constante | Descripción |
| --- | --- |
| `defaultCoreCipherList` | Especifica la lista de cifrado predeterminada incorporada utilizada por Node.js. |
| `defaultCipherList` | Especifica la lista de cifrado predeterminada activa utilizada por el proceso actual de Node.js. |

