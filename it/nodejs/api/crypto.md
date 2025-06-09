---
title: Documentazione Node.js - Crypto
description: Il modulo Crypto di Node.js fornisce funzionalità crittografiche che includono un set di wrapper per le funzioni di hash, HMAC, cifratura, decifratura, firma e verifica di OpenSSL. Supporta vari algoritmi di cifratura, derivazione delle chiavi e firme digitali, permettendo agli sviluppatori di proteggere dati e comunicazioni all'interno delle applicazioni Node.js.
head:
  - - meta
    - name: og:title
      content: Documentazione Node.js - Crypto | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Il modulo Crypto di Node.js fornisce funzionalità crittografiche che includono un set di wrapper per le funzioni di hash, HMAC, cifratura, decifratura, firma e verifica di OpenSSL. Supporta vari algoritmi di cifratura, derivazione delle chiavi e firme digitali, permettendo agli sviluppatori di proteggere dati e comunicazioni all'interno delle applicazioni Node.js.
  - - meta
    - name: twitter:title
      content: Documentazione Node.js - Crypto | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Il modulo Crypto di Node.js fornisce funzionalità crittografiche che includono un set di wrapper per le funzioni di hash, HMAC, cifratura, decifratura, firma e verifica di OpenSSL. Supporta vari algoritmi di cifratura, derivazione delle chiavi e firme digitali, permettendo agli sviluppatori di proteggere dati e comunicazioni all'interno delle applicazioni Node.js.
---


# Crittografia {#crypto}

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile
:::

**Codice sorgente:** [lib/crypto.js](https://github.com/nodejs/node/blob/v23.5.0/lib/crypto.js)

Il modulo `node:crypto` fornisce funzionalità crittografiche che includono una serie di wrapper per le funzioni hash, HMAC, cipher, decipher, sign e verify di OpenSSL.

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

## Determinare se il supporto alla crittografia non è disponibile {#determining-if-crypto-support-is-unavailable}

È possibile che Node.js venga compilato senza includere il supporto per il modulo `node:crypto`. In tali casi, tentare di eseguire `import` da `crypto` o chiamare `require('node:crypto')` comporterà la generazione di un errore.

Quando si utilizza CommonJS, l'errore generato può essere intercettato utilizzando try/catch:

```js [CJS]
let crypto;
try {
  crypto = require('node:crypto');
} catch (err) {
  console.error('il supporto alla crittografia è disabilitato!');
}
```
Quando si utilizza la parola chiave lessicale ESM `import`, l'errore può essere intercettato solo se un gestore per `process.on('uncaughtException')` viene registrato *prima* che venga effettuato qualsiasi tentativo di caricare il modulo (utilizzando, ad esempio, un modulo di precaricamento).

Quando si utilizza ESM, se esiste la possibilità che il codice possa essere eseguito su una build di Node.js in cui il supporto alla crittografia non è abilitato, prendere in considerazione l'utilizzo della funzione [`import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) anziché la parola chiave lessicale `import`:

```js [ESM]
let crypto;
try {
  crypto = await import('node:crypto');
} catch (err) {
  console.error('il supporto alla crittografia è disabilitato!');
}
```

## Classe: `Certificate` {#class-certificate}

**Aggiunta in: v0.11.8**

SPKAC è un meccanismo di Richiesta di Firma del Certificato originariamente implementato da Netscape e specificato formalmente come parte dell'elemento `keygen` di HTML5.

`\<keygen\>` è deprecato a partire da [HTML 5.2](https://www.w3.org/TR/html52/changes#features-removed) e i nuovi progetti non dovrebbero più usare questo elemento.

Il modulo `node:crypto` fornisce la classe `Certificate` per lavorare con i dati SPKAC. L'uso più comune è la gestione dell'output generato dall'elemento HTML5 `\<keygen\>`. Node.js utilizza internamente l'[implementazione SPKAC di OpenSSL](https://www.openssl.org/docs/man3.0/man1/openssl-spkac).

### Metodo statico: `Certificate.exportChallenge(spkac[, encoding])` {#static-method-certificateexportchallengespkac-encoding}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v15.0.0 | L'argomento spkac può essere un ArrayBuffer. Limitata la dimensione dell'argomento spkac a un massimo di 2**31 - 1 byte. |
| v9.0.0 | Aggiunta in: v9.0.0 |
:::

- `spkac` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codifica](/it/nodejs/api/buffer#buffers-and-character-encodings) della stringa `spkac`.
- Restituisce: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) Il componente challenge della struttura dati `spkac`, che include una chiave pubblica e una challenge.

::: code-group
```js [ESM]
const { Certificate } = await import('node:crypto');
const spkac = getSpkacSomehow();
const challenge = Certificate.exportChallenge(spkac);
console.log(challenge.toString('utf8'));
// Stampa: la challenge come stringa UTF8
```

```js [CJS]
const { Certificate } = require('node:crypto');
const spkac = getSpkacSomehow();
const challenge = Certificate.exportChallenge(spkac);
console.log(challenge.toString('utf8'));
// Stampa: la challenge come stringa UTF8
```
:::


### Metodo statico: `Certificate.exportPublicKey(spkac[, encoding])` {#static-method-certificateexportpublickeyspkac-encoding}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v15.0.0 | L'argomento spkac può essere un ArrayBuffer. Limitata la dimensione dell'argomento spkac a un massimo di 2**31 - 1 byte. |
| v9.0.0 | Aggiunto in: v9.0.0 |
:::

- `spkac` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codifica](/it/nodejs/api/buffer#buffers-and-character-encodings) della stringa `spkac`.
- Restituisce: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) Il componente della chiave pubblica della struttura dati `spkac`, che include una chiave pubblica e una challenge.

::: code-group
```js [ESM]
const { Certificate } = await import('node:crypto');
const spkac = getSpkacSomehow();
const publicKey = Certificate.exportPublicKey(spkac);
console.log(publicKey);
// Stampa: la chiave pubblica come <Buffer ...>
```

```js [CJS]
const { Certificate } = require('node:crypto');
const spkac = getSpkacSomehow();
const publicKey = Certificate.exportPublicKey(spkac);
console.log(publicKey);
// Stampa: la chiave pubblica come <Buffer ...>
```
:::

### Metodo statico: `Certificate.verifySpkac(spkac[, encoding])` {#static-method-certificateverifyspkacspkac-encoding}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v15.0.0 | L'argomento spkac può essere un ArrayBuffer. Aggiunta la codifica. Limitata la dimensione dell'argomento spkac a un massimo di 2**31 - 1 byte. |
| v9.0.0 | Aggiunto in: v9.0.0 |
:::

- `spkac` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codifica](/it/nodejs/api/buffer#buffers-and-character-encodings) della stringa `spkac`.
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` se la struttura dati `spkac` fornita è valida, `false` altrimenti.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const { Certificate } = await import('node:crypto');

const spkac = getSpkacSomehow();
console.log(Certificate.verifySpkac(Buffer.from(spkac)));
// Stampa: true o false
```

```js [CJS]
const { Buffer } = require('node:buffer');
const { Certificate } = require('node:crypto');

const spkac = getSpkacSomehow();
console.log(Certificate.verifySpkac(Buffer.from(spkac)));
// Stampa: true o false
```
:::


### API Legacy {#legacy-api}

::: danger [Stabile: 0 - Deprecato]
[Stabile: 0](/it/nodejs/api/documentation#stability-index) [Stabilità: 0](/it/nodejs/api/documentation#stability-index) - Deprecato
:::

Essendo un'interfaccia legacy, è possibile creare nuove istanze della classe `crypto.Certificate` come illustrato negli esempi seguenti.

#### `new crypto.Certificate()` {#new-cryptocertificate}

Le istanze della classe `Certificate` possono essere create utilizzando la parola chiave `new` o chiamando `crypto.Certificate()` come funzione:

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

**Aggiunto in: v0.11.8**

- `spkac` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codifica](/it/nodejs/api/buffer#buffers-and-character-encodings) della stringa `spkac`.
- Restituisce: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) Il componente challenge della struttura dati `spkac`, che include una chiave pubblica e una challenge.

::: code-group
```js [ESM]
const { Certificate } = await import('node:crypto');
const cert = Certificate();
const spkac = getSpkacSomehow();
const challenge = cert.exportChallenge(spkac);
console.log(challenge.toString('utf8'));
// Stampa: la challenge come stringa UTF8
```

```js [CJS]
const { Certificate } = require('node:crypto');
const cert = Certificate();
const spkac = getSpkacSomehow();
const challenge = cert.exportChallenge(spkac);
console.log(challenge.toString('utf8'));
// Stampa: la challenge come stringa UTF8
```
:::


#### `certificate.exportPublicKey(spkac[, encoding])` {#certificateexportpublickeyspkac-encoding}

**Aggiunto in: v0.11.8**

- `spkac` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codifica](/it/nodejs/api/buffer#buffers-and-character-encodings) della stringa `spkac`.
- Restituisce: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) Il componente della chiave pubblica della struttura dati `spkac`, che include una chiave pubblica e una challenge.

::: code-group
```js [ESM]
const { Certificate } = await import('node:crypto');
const cert = Certificate();
const spkac = getSpkacSomehow();
const publicKey = cert.exportPublicKey(spkac);
console.log(publicKey);
// Prints: the public key as <Buffer ...>
```

```js [CJS]
const { Certificate } = require('node:crypto');
const cert = Certificate();
const spkac = getSpkacSomehow();
const publicKey = cert.exportPublicKey(spkac);
console.log(publicKey);
// Prints: the public key as <Buffer ...>
```
:::

#### `certificate.verifySpkac(spkac[, encoding])` {#certificateverifyspkacspkac-encoding}

**Aggiunto in: v0.11.8**

- `spkac` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codifica](/it/nodejs/api/buffer#buffers-and-character-encodings) della stringa `spkac`.
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` se la struttura dati `spkac` fornita è valida, `false` altrimenti.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const { Certificate } = await import('node:crypto');

const cert = Certificate();
const spkac = getSpkacSomehow();
console.log(cert.verifySpkac(Buffer.from(spkac)));
// Prints: true or false
```

```js [CJS]
const { Buffer } = require('node:buffer');
const { Certificate } = require('node:crypto');

const cert = Certificate();
const spkac = getSpkacSomehow();
console.log(cert.verifySpkac(Buffer.from(spkac)));
// Prints: true or false
```
:::


## Classe: `Cipher` {#class-cipher}

**Aggiunto in: v0.1.94**

- Estende: [\<stream.Transform\>](/it/nodejs/api/stream#class-streamtransform)

Le istanze della classe `Cipher` vengono utilizzate per crittografare i dati. La classe può essere utilizzata in uno dei due modi seguenti:

- Come [stream](/it/nodejs/api/stream) che è sia leggibile che scrivibile, dove i dati non crittografati vengono scritti per produrre dati crittografati sul lato leggibile, oppure
- Utilizzando i metodi [`cipher.update()`](/it/nodejs/api/crypto#cipherupdatedata-inputencoding-outputencoding) e [`cipher.final()`](/it/nodejs/api/crypto#cipherfinaloutputencoding) per produrre i dati crittografati.

Il metodo [`crypto.createCipheriv()`](/it/nodejs/api/crypto#cryptocreatecipherivalgorithm-key-iv-options) viene utilizzato per creare istanze `Cipher`. Gli oggetti `Cipher` non devono essere creati direttamente utilizzando la parola chiave `new`.

Esempio: Utilizzo di oggetti `Cipher` come stream:

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

Esempio: Utilizzo di `Cipher` e stream piped:

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

Esempio: Utilizzo dei metodi [`cipher.update()`](/it/nodejs/api/crypto#cipherupdatedata-inputencoding-outputencoding) e [`cipher.final()`](/it/nodejs/api/crypto#cipherfinaloutputencoding):

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

**Aggiunto in: v0.1.94**

- `outputEncoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codifica](/it/nodejs/api/buffer#buffers-and-character-encodings) del valore restituito.
- Restituisce: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Qualsiasi contenuto cifrato rimanente. Se viene specificato `outputEncoding`, viene restituita una stringa. Se non viene fornito un `outputEncoding`, viene restituito un [`Buffer`](/it/nodejs/api/buffer).

Una volta che il metodo `cipher.final()` è stato chiamato, l'oggetto `Cipher` non può più essere utilizzato per crittografare i dati. I tentativi di chiamare `cipher.final()` più di una volta comporteranno la generazione di un errore.

### `cipher.getAuthTag()` {#ciphergetauthtag}

**Aggiunto in: v1.0.0**

- Restituisce: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) Quando si utilizza una modalità di crittografia autenticata (attualmente sono supportati `GCM`, `CCM`, `OCB` e `chacha20-poly1305`), il metodo `cipher.getAuthTag()` restituisce un [`Buffer`](/it/nodejs/api/buffer) contenente il *tag di autenticazione* calcolato dai dati forniti.

Il metodo `cipher.getAuthTag()` deve essere chiamato solo dopo che la crittografia è stata completata utilizzando il metodo [`cipher.final()`](/it/nodejs/api/crypto#cipherfinaloutputencoding).

Se l'opzione `authTagLength` è stata impostata durante la creazione dell'istanza `cipher`, questa funzione restituirà esattamente `authTagLength` byte.

### `cipher.setAAD(buffer[, options])` {#ciphersetaadbuffer-options}

**Aggiunto in: v1.0.0**

- `buffer` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.transform` opzioni](/it/nodejs/api/stream#new-streamtransformoptions)
    - `plaintextLength` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `encoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La codifica della stringa da utilizzare quando `buffer` è una stringa.
  
 
- Restituisce: [\<Cipher\>](/it/nodejs/api/crypto#class-cipher) La stessa istanza `Cipher` per il concatenamento dei metodi.

Quando si utilizza una modalità di crittografia autenticata (attualmente sono supportati `GCM`, `CCM`, `OCB` e `chacha20-poly1305`), il metodo `cipher.setAAD()` imposta il valore utilizzato per il parametro di input *dati autenticati aggiuntivi* (AAD).

L'opzione `plaintextLength` è facoltativa per `GCM` e `OCB`. Quando si utilizza `CCM`, l'opzione `plaintextLength` deve essere specificata e il suo valore deve corrispondere alla lunghezza del testo in chiaro in byte. Vedi [modalità CCM](/it/nodejs/api/crypto#ccm-mode).

Il metodo `cipher.setAAD()` deve essere chiamato prima di [`cipher.update()`](/it/nodejs/api/crypto#cipherupdatedata-inputencoding-outputencoding).


### `cipher.setAutoPadding([autoPadding])` {#ciphersetautopaddingautopadding}

**Aggiunto in: v0.7.1**

- `autoPadding` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Predefinito:** `true`
- Restituisce: [\<Cipher\>](/it/nodejs/api/crypto#class-cipher) La stessa istanza `Cipher` per l'incatenamento dei metodi.

Quando si utilizzano algoritmi di crittografia a blocchi, la classe `Cipher` aggiungerà automaticamente il padding ai dati di input alla dimensione del blocco appropriata. Per disabilitare il padding predefinito, chiama `cipher.setAutoPadding(false)`.

Quando `autoPadding` è `false`, la lunghezza dell'intero dato di input deve essere un multiplo della dimensione del blocco della cifratura o [`cipher.final()`](/it/nodejs/api/crypto#cipherfinaloutputencoding) genererà un errore. La disabilitazione del padding automatico è utile per il padding non standard, ad esempio l'utilizzo di `0x0` invece del padding PKCS.

Il metodo `cipher.setAutoPadding()` deve essere chiamato prima di [`cipher.final()`](/it/nodejs/api/crypto#cipherfinaloutputencoding).

### `cipher.update(data[, inputEncoding][, outputEncoding])` {#cipherupdatedata-inputencoding-outputencoding}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v6.0.0 | La `inputEncoding` predefinita è cambiata da `binary` a `utf8`. |
| v0.1.94 | Aggiunto in: v0.1.94 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codifica](/it/nodejs/api/buffer#buffers-and-character-encodings) dei dati.
- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codifica](/it/nodejs/api/buffer#buffers-and-character-encodings) del valore restituito.
- Restituisce: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Aggiorna la cifratura con `data`. Se viene fornito l'argomento `inputEncoding`, l'argomento `data` è una stringa che utilizza la codifica specificata. Se l'argomento `inputEncoding` non viene fornito, `data` deve essere un [`Buffer`](/it/nodejs/api/buffer), `TypedArray` o `DataView`. Se `data` è un [`Buffer`](/it/nodejs/api/buffer), `TypedArray` o `DataView`, allora `inputEncoding` viene ignorato.

`outputEncoding` specifica il formato di output dei dati cifrati. Se viene specificato `outputEncoding`, viene restituita una stringa che utilizza la codifica specificata. Se non viene fornito `outputEncoding`, viene restituito un [`Buffer`](/it/nodejs/api/buffer).

Il metodo `cipher.update()` può essere chiamato più volte con nuovi dati fino a quando non viene chiamato [`cipher.final()`](/it/nodejs/api/crypto#cipherfinaloutputencoding). Chiamare `cipher.update()` dopo [`cipher.final()`](/it/nodejs/api/crypto#cipherfinaloutputencoding) comporterà la generazione di un errore.


## Classe: `Decipher` {#class-decipher}

**Aggiunto in: v0.1.94**

- Estende: [\<stream.Transform\>](/it/nodejs/api/stream#class-streamtransform)

Le istanze della classe `Decipher` vengono utilizzate per decrittografare i dati. La classe può essere utilizzata in uno dei due modi seguenti:

- Come uno [stream](/it/nodejs/api/stream) che è sia leggibile che scrivibile, dove i dati crittografati semplici vengono scritti per produrre dati non crittografati sul lato leggibile, oppure
- Utilizzando i metodi [`decipher.update()`](/it/nodejs/api/crypto#decipherupdatedata-inputencoding-outputencoding) e [`decipher.final()`](/it/nodejs/api/crypto#decipherfinaloutputencoding) per produrre i dati non crittografati.

Il metodo [`crypto.createDecipheriv()`](/it/nodejs/api/crypto#cryptocreatedecipherivalgorithm-key-iv-options) viene utilizzato per creare istanze `Decipher`. Gli oggetti `Decipher` non devono essere creati direttamente utilizzando la parola chiave `new`.

Esempio: Utilizzo di oggetti `Decipher` come stream:

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

Esempio: Utilizzo di `Decipher` e stream piped:

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

Esempio: Utilizzo dei metodi [`decipher.update()`](/it/nodejs/api/crypto#decipherupdatedata-inputencoding-outputencoding) e [`decipher.final()`](/it/nodejs/api/crypto#decipherfinaloutputencoding):

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

**Aggiunto in: v0.1.94**

- `outputEncoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codifica](/it/nodejs/api/buffer#buffers-and-character-encodings) del valore restituito.
- Restituisce: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Qualsiasi contenuto decifrato rimanente. Se `outputEncoding` è specificato, viene restituita una stringa. Se non viene fornito un `outputEncoding`, viene restituito un [`Buffer`](/it/nodejs/api/buffer).

Una volta che il metodo `decipher.final()` è stato chiamato, l'oggetto `Decipher` non può più essere utilizzato per decrittografare i dati. Tentativi di chiamare `decipher.final()` più di una volta comporteranno la generazione di un errore.

### `decipher.setAAD(buffer[, options])` {#deciphersetaadbuffer-options}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v15.0.0 | L'argomento buffer può essere una stringa o ArrayBuffer ed è limitato a non più di 2 ** 31 - 1 byte. |
| v7.2.0 | Questo metodo ora restituisce un riferimento a `decipher`. |
| v1.0.0 | Aggiunto in: v1.0.0 |
:::

- `buffer` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.transform` opzioni](/it/nodejs/api/stream#new-streamtransformoptions) 
    - `plaintextLength` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `encoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Codifica stringa da utilizzare quando `buffer` è una stringa.
  
 
- Restituisce: [\<Decipher\>](/it/nodejs/api/crypto#class-decipher) Lo stesso Decipher per il concatenamento di metodi.

Quando si utilizza una modalità di crittografia autenticata (attualmente sono supportati `GCM`, `CCM`, `OCB` e `chacha20-poly1305`), il metodo `decipher.setAAD()` imposta il valore utilizzato per il parametro di input *dati autenticati aggiuntivi* (AAD).

L'argomento `options` è facoltativo per `GCM`. Quando si utilizza `CCM`, è necessario specificare l'opzione `plaintextLength` e il suo valore deve corrispondere alla lunghezza del testo cifrato in byte. Vedi [modalità CCM](/it/nodejs/api/crypto#ccm-mode).

Il metodo `decipher.setAAD()` deve essere chiamato prima di [`decipher.update()`](/it/nodejs/api/crypto#decipherupdatedata-inputencoding-outputencoding).

Quando si passa una stringa come `buffer`, si prega di considerare [avvertenze quando si utilizzano stringhe come input alle API crittografiche](/it/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis).


### `decipher.setAuthTag(buffer[, encoding])` {#deciphersetauthtagbuffer-encoding}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v22.0.0, v20.13.0 | L'utilizzo di lunghezze di tag GCM diverse da 128 bit senza specificare l'opzione `authTagLength` durante la creazione di `decipher` è deprecato. |
| v15.0.0 | L'argomento buffer può essere una stringa o ArrayBuffer ed è limitato a non più di 2 ** 31 - 1 byte. |
| v11.0.0 | Questo metodo ora genera un'eccezione se la lunghezza del tag GCM non è valida. |
| v7.2.0 | Questo metodo ora restituisce un riferimento a `decipher`. |
| v1.0.0 | Aggiunto in: v1.0.0 |
:::

- `buffer` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Codifica della stringa da utilizzare quando `buffer` è una stringa.
- Restituisce: [\<Decipher\>](/it/nodejs/api/crypto#class-decipher) Lo stesso Decipher per il concatenamento di metodi.

Quando si utilizza una modalità di crittografia autenticata (attualmente sono supportati `GCM`, `CCM`, `OCB` e `chacha20-poly1305`), il metodo `decipher.setAuthTag()` viene utilizzato per passare il *tag di autenticazione* ricevuto. Se non viene fornito alcun tag, o se il testo cifrato è stato manomesso, [`decipher.final()`](/it/nodejs/api/crypto#decipherfinaloutputencoding) genererà un'eccezione, indicando che il testo cifrato deve essere scartato a causa dell'autenticazione fallita. Se la lunghezza del tag non è valida secondo [NIST SP 800-38D](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38d.pdf) o non corrisponde al valore dell'opzione `authTagLength`, `decipher.setAuthTag()` genererà un errore.

Il metodo `decipher.setAuthTag()` deve essere chiamato prima di [`decipher.update()`](/it/nodejs/api/crypto#decipherupdatedata-inputencoding-outputencoding) per la modalità `CCM` o prima di [`decipher.final()`](/it/nodejs/api/crypto#decipherfinaloutputencoding) per le modalità `GCM` e `OCB` e `chacha20-poly1305`. `decipher.setAuthTag()` può essere chiamato solo una volta.

Quando si passa una stringa come tag di autenticazione, si prega di considerare [avvertenze quando si usano stringhe come input alle API crittografiche](/it/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis).


### `decipher.setAutoPadding([autoPadding])` {#deciphersetautopaddingautopadding}

**Aggiunto in: v0.7.1**

- `autoPadding` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Predefinito:** `true`
- Restituisce: [\<Decipher\>](/it/nodejs/api/crypto#class-decipher) Lo stesso Decipher per il concatenamento dei metodi.

Quando i dati sono stati crittografati senza la standard padding a blocchi, chiamare `decipher.setAutoPadding(false)` disabiliterà l'automatic padding per impedire a [`decipher.final()`](/it/nodejs/api/crypto#decipherfinaloutputencoding) di controllare e rimuovere il padding.

Disattivare l'auto padding funzionerà solo se la lunghezza dei dati di input è un multiplo della dimensione del blocco delle cifre.

Il metodo `decipher.setAutoPadding()` deve essere chiamato prima di [`decipher.final()`](/it/nodejs/api/crypto#decipherfinaloutputencoding).

### `decipher.update(data[, inputEncoding][, outputEncoding])` {#decipherupdatedata-inputencoding-outputencoding}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v6.0.0 | L'`inputEncoding` predefinito è cambiato da `binary` a `utf8`. |
| v0.1.94 | Aggiunto in: v0.1.94 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codifica](/it/nodejs/api/buffer#buffers-and-character-encodings) della stringa `data`.
- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codifica](/it/nodejs/api/buffer#buffers-and-character-encodings) del valore restituito.
- Restituisce: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Aggiorna il decifratore con `data`. Se viene fornito l'argomento `inputEncoding`, l'argomento `data` è una stringa che utilizza la codifica specificata. Se l'argomento `inputEncoding` non viene fornito, `data` deve essere un [`Buffer`](/it/nodejs/api/buffer). Se `data` è un [`Buffer`](/it/nodejs/api/buffer) allora `inputEncoding` viene ignorato.

L'`outputEncoding` specifica il formato di output dei dati crittografati. Se viene specificato `outputEncoding`, viene restituita una stringa che utilizza la codifica specificata. Se non viene fornito `outputEncoding`, viene restituito un [`Buffer`](/it/nodejs/api/buffer).

Il metodo `decipher.update()` può essere chiamato più volte con nuovi dati fino a quando non viene chiamato [`decipher.final()`](/it/nodejs/api/crypto#decipherfinaloutputencoding). Chiamare `decipher.update()` dopo [`decipher.final()`](/it/nodejs/api/crypto#decipherfinaloutputencoding) comporterà la generazione di un errore.

Anche se la cifra sottostante implementa l'autenticazione, l'autenticità e l'integrità del testo non crittografato restituito da questa funzione potrebbero essere incerte in questo momento. Per gli algoritmi di crittografia autenticati, l'autenticità viene generalmente stabilita solo quando l'applicazione chiama [`decipher.final()`](/it/nodejs/api/crypto#decipherfinaloutputencoding).


## Classe: `DiffieHellman` {#class-diffiehellman}

**Aggiunta in: v0.5.0**

La classe `DiffieHellman` è un'utilità per la creazione di scambi di chiavi Diffie-Hellman.

Le istanze della classe `DiffieHellman` possono essere create utilizzando la funzione [`crypto.createDiffieHellman()`](/it/nodejs/api/crypto#cryptocreatediffiehellmanprime-primeencoding-generator-generatorencoding).

::: code-group
```js [ESM]
import assert from 'node:assert';

const {
  createDiffieHellman,
} = await import('node:crypto');

// Genera le chiavi di Alice...
const alice = createDiffieHellman(2048);
const aliceKey = alice.generateKeys();

// Genera le chiavi di Bob...
const bob = createDiffieHellman(alice.getPrime(), alice.getGenerator());
const bobKey = bob.generateKeys();

// Scambia e genera il segreto...
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

// Genera le chiavi di Alice...
const alice = createDiffieHellman(2048);
const aliceKey = alice.generateKeys();

// Genera le chiavi di Bob...
const bob = createDiffieHellman(alice.getPrime(), alice.getGenerator());
const bobKey = bob.generateKeys();

// Scambia e genera il segreto...
const aliceSecret = alice.computeSecret(bobKey);
const bobSecret = bob.computeSecret(aliceKey);

// OK
assert.strictEqual(aliceSecret.toString('hex'), bobSecret.toString('hex'));
```
:::

### `diffieHellman.computeSecret(otherPublicKey[, inputEncoding][, outputEncoding])` {#diffiehellmancomputesecretotherpublickey-inputencoding-outputencoding}

**Aggiunta in: v0.5.0**

- `otherPublicKey` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codifica](/it/nodejs/api/buffer#buffers-and-character-encodings) di una stringa `otherPublicKey`.
- `outputEncoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codifica](/it/nodejs/api/buffer#buffers-and-character-encodings) del valore di ritorno.
- Restituisce: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Calcola il segreto condiviso usando `otherPublicKey` come chiave pubblica dell'altra parte e restituisce il segreto condiviso calcolato. La chiave fornita viene interpretata utilizzando la `inputEncoding` specificata e il segreto viene codificato utilizzando la `outputEncoding` specificata. Se la `inputEncoding` non viene fornita, ci si aspetta che `otherPublicKey` sia un [`Buffer`](/it/nodejs/api/buffer), `TypedArray` o `DataView`.

Se viene fornita `outputEncoding`, viene restituita una stringa; altrimenti, viene restituito un [`Buffer`](/it/nodejs/api/buffer).


### `diffieHellman.generateKeys([encoding])` {#diffiehellmangeneratekeysencoding}

**Aggiunto in: v0.5.0**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codifica](/it/nodejs/api/buffer#buffers-and-character-encodings) del valore di ritorno.
- Restituisce: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Genera i valori delle chiavi Diffie-Hellman private e pubbliche a meno che non siano già stati generati o calcolati, e restituisce la chiave pubblica nella `codifica` specificata. Questa chiave deve essere trasferita all'altra parte. Se viene fornita una `codifica`, viene restituita una stringa; altrimenti viene restituito un [`Buffer`](/it/nodejs/api/buffer).

Questa funzione è un wrapper sottile attorno a [`DH_generate_key()`](https://www.openssl.org/docs/man3.0/man3/DH_generate_key). In particolare, una volta che una chiave privata è stata generata o impostata, chiamare questa funzione aggiorna solo la chiave pubblica ma non genera una nuova chiave privata.

### `diffieHellman.getGenerator([encoding])` {#diffiehellmangetgeneratorencoding}

**Aggiunto in: v0.5.0**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codifica](/it/nodejs/api/buffer#buffers-and-character-encodings) del valore di ritorno.
- Restituisce: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Restituisce il generatore Diffie-Hellman nella `codifica` specificata. Se viene fornita una `codifica`, viene restituita una stringa; altrimenti viene restituito un [`Buffer`](/it/nodejs/api/buffer).

### `diffieHellman.getPrime([encoding])` {#diffiehellmangetprimeencoding}

**Aggiunto in: v0.5.0**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codifica](/it/nodejs/api/buffer#buffers-and-character-encodings) del valore di ritorno.
- Restituisce: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Restituisce il numero primo Diffie-Hellman nella `codifica` specificata. Se viene fornita una `codifica`, viene restituita una stringa; altrimenti viene restituito un [`Buffer`](/it/nodejs/api/buffer).


### `diffieHellman.getPrivateKey([encoding])` {#diffiehellmangetprivatekeyencoding}

**Aggiunto in: v0.5.0**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codifica](/it/nodejs/api/buffer#buffers-and-character-encodings) del valore di ritorno.
- Restituisce: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Restituisce la chiave privata Diffie-Hellman nella `encoding` specificata. Se viene fornita `encoding`, viene restituita una stringa; altrimenti viene restituito un [`Buffer`](/it/nodejs/api/buffer).

### `diffieHellman.getPublicKey([encoding])` {#diffiehellmangetpublickeyencoding}

**Aggiunto in: v0.5.0**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codifica](/it/nodejs/api/buffer#buffers-and-character-encodings) del valore di ritorno.
- Restituisce: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Restituisce la chiave pubblica Diffie-Hellman nella `encoding` specificata. Se viene fornita `encoding`, viene restituita una stringa; altrimenti viene restituito un [`Buffer`](/it/nodejs/api/buffer).

### `diffieHellman.setPrivateKey(privateKey[, encoding])` {#diffiehellmansetprivatekeyprivatekey-encoding}

**Aggiunto in: v0.5.0**

- `privateKey` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codifica](/it/nodejs/api/buffer#buffers-and-character-encodings) della stringa `privateKey`.

Imposta la chiave privata Diffie-Hellman. Se viene fornito l'argomento `encoding`, si prevede che `privateKey` sia una stringa. Se non viene fornita alcuna `encoding`, si prevede che `privateKey` sia un [`Buffer`](/it/nodejs/api/buffer), `TypedArray` o `DataView`.

Questa funzione non calcola automaticamente la chiave pubblica associata. O [`diffieHellman.setPublicKey()`](/it/nodejs/api/crypto#diffiehellmansetpublickeypublickey-encoding) o [`diffieHellman.generateKeys()`](/it/nodejs/api/crypto#diffiehellmangeneratekeysencoding) possono essere usati per fornire manualmente la chiave pubblica o per derivarla automaticamente.


### `diffieHellman.setPublicKey(publicKey[, encoding])` {#diffiehellmansetpublickeypublickey-encoding}

**Aggiunto in: v0.5.0**

- `publicKey` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codifica](/it/nodejs/api/buffer#buffers-and-character-encodings) della stringa `publicKey`.

Imposta la chiave pubblica Diffie-Hellman. Se viene fornito l'argomento `encoding`, si prevede che `publicKey` sia una stringa. Se non viene fornito alcun `encoding`, si prevede che `publicKey` sia un [`Buffer`](/it/nodejs/api/buffer), `TypedArray` o `DataView`.

### `diffieHellman.verifyError` {#diffiehellmanverifyerror}

**Aggiunto in: v0.11.12**

Un campo di bit contenente eventuali avvisi e/o errori derivanti da un controllo eseguito durante l'inizializzazione dell'oggetto `DiffieHellman`.

I seguenti valori sono validi per questa proprietà (come definito nel modulo `node:constants`):

- `DH_CHECK_P_NOT_SAFE_PRIME`
- `DH_CHECK_P_NOT_PRIME`
- `DH_UNABLE_TO_CHECK_GENERATOR`
- `DH_NOT_SUITABLE_GENERATOR`

## Classe: `DiffieHellmanGroup` {#class-diffiehellmangroup}

**Aggiunto in: v0.7.5**

La classe `DiffieHellmanGroup` prende un gruppo modp ben noto come argomento. Funziona allo stesso modo di `DiffieHellman`, tranne per il fatto che non consente di modificare le sue chiavi dopo la creazione. In altre parole, non implementa i metodi `setPublicKey()` o `setPrivateKey()`.

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

Sono supportati i seguenti gruppi:

- `'modp14'` (2048 bit, [RFC 3526](https://www.rfc-editor.org/rfc/rfc3526.txt) Sezione 3)
- `'modp15'` (3072 bit, [RFC 3526](https://www.rfc-editor.org/rfc/rfc3526.txt) Sezione 4)
- `'modp16'` (4096 bit, [RFC 3526](https://www.rfc-editor.org/rfc/rfc3526.txt) Sezione 5)
- `'modp17'` (6144 bit, [RFC 3526](https://www.rfc-editor.org/rfc/rfc3526.txt) Sezione 6)
- `'modp18'` (8192 bit, [RFC 3526](https://www.rfc-editor.org/rfc/rfc3526.txt) Sezione 7)

I seguenti gruppi sono ancora supportati ma deprecati (vedere [Avvertenze](/it/nodejs/api/crypto#support-for-weak-or-compromised-algorithms)):

- `'modp1'` (768 bit, [RFC 2409](https://www.rfc-editor.org/rfc/rfc2409.txt) Sezione 6.1)
- `'modp2'` (1024 bit, [RFC 2409](https://www.rfc-editor.org/rfc/rfc2409.txt) Sezione 6.2)
- `'modp5'` (1536 bit, [RFC 3526](https://www.rfc-editor.org/rfc/rfc3526.txt) Sezione 2)

Questi gruppi deprecati potrebbero essere rimossi nelle future versioni di Node.js.


## Classe: `ECDH` {#class-ecdh}

**Aggiunto in: v0.11.14**

La classe `ECDH` è un'utilità per la creazione di scambi di chiavi Elliptic Curve Diffie-Hellman (ECDH).

Le istanze della classe `ECDH` possono essere create utilizzando la funzione [`crypto.createECDH()`](/it/nodejs/api/crypto#cryptocreateecdhcurvename).



::: code-group
```js [ESM]
import assert from 'node:assert';

const {
  createECDH,
} = await import('node:crypto');

// Genera le chiavi di Alice...
const alice = createECDH('secp521r1');
const aliceKey = alice.generateKeys();

// Genera le chiavi di Bob...
const bob = createECDH('secp521r1');
const bobKey = bob.generateKeys();

// Scambia e genera il segreto...
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

// Genera le chiavi di Alice...
const alice = createECDH('secp521r1');
const aliceKey = alice.generateKeys();

// Genera le chiavi di Bob...
const bob = createECDH('secp521r1');
const bobKey = bob.generateKeys();

// Scambia e genera il segreto...
const aliceSecret = alice.computeSecret(bobKey);
const bobSecret = bob.computeSecret(aliceKey);

assert.strictEqual(aliceSecret.toString('hex'), bobSecret.toString('hex'));
// OK
```
:::

### Metodo statico: `ECDH.convertKey(key, curve[, inputEncoding[, outputEncoding[, format]]])` {#static-method-ecdhconvertkeykey-curve-inputencoding-outputencoding-format}

**Aggiunto in: v10.0.0**

- `key` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `curve` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `inputEncoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codifica](/it/nodejs/api/buffer#buffers-and-character-encodings) della stringa `key`.
- `outputEncoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codifica](/it/nodejs/api/buffer#buffers-and-character-encodings) del valore di ritorno.
- `format` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Predefinito:** `'uncompressed'`
- Restituisce: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Converte la chiave pubblica EC Diffie-Hellman specificata da `key` e `curve` nel formato specificato da `format`. L'argomento `format` specifica la codifica del punto e può essere `'compressed'`, `'uncompressed'` o `'hybrid'`. La chiave fornita viene interpretata utilizzando la `inputEncoding` specificata e la chiave restituita viene codificata utilizzando la `outputEncoding` specificata.

Utilizzare [`crypto.getCurves()`](/it/nodejs/api/crypto#cryptogetcurves) per ottenere un elenco di nomi di curve disponibili. Sulle recenti versioni di OpenSSL, `openssl ecparam -list_curves` mostrerà anche il nome e la descrizione di ogni curva ellittica disponibile.

Se `format` non è specificato, il punto verrà restituito in formato `'uncompressed'`.

Se `inputEncoding` non è fornito, si prevede che `key` sia un [`Buffer`](/it/nodejs/api/buffer), `TypedArray` o `DataView`.

Esempio (decompressione di una chiave):



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

// La chiave convertita e la chiave pubblica non compressa dovrebbero essere le stesse
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

// La chiave convertita e la chiave pubblica non compressa dovrebbero essere le stesse
console.log(uncompressedKey === ecdh.getPublicKey('hex'));
```
:::


### `ecdh.computeSecret(otherPublicKey[, inputEncoding][, outputEncoding])` {#ecdhcomputesecretotherpublickey-inputencoding-outputencoding}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.0.0 | Formato dell'errore modificato per supportare meglio l'errore di chiave pubblica non valida. |
| v6.0.0 | L'`inputEncoding` predefinito è stato modificato da `binary` a `utf8`. |
| v0.11.14 | Aggiunto in: v0.11.14 |
:::

- `otherPublicKey` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codifica](/it/nodejs/api/buffer#buffers-and-character-encodings) della stringa `otherPublicKey`.
- `outputEncoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codifica](/it/nodejs/api/buffer#buffers-and-character-encodings) del valore di ritorno.
- Restituisce: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Calcola il segreto condiviso utilizzando `otherPublicKey` come chiave pubblica dell'altra parte e restituisce il segreto condiviso calcolato. La chiave fornita viene interpretata utilizzando la `inputEncoding` specificata e il segreto restituito viene codificato utilizzando la `outputEncoding` specificata. Se `inputEncoding` non viene fornito, si prevede che `otherPublicKey` sia un [`Buffer`](/it/nodejs/api/buffer), `TypedArray` o `DataView`.

Se viene fornito `outputEncoding`, verrà restituita una stringa; altrimenti viene restituito un [`Buffer`](/it/nodejs/api/buffer).

`ecdh.computeSecret` genererà un errore `ERR_CRYPTO_ECDH_INVALID_PUBLIC_KEY` quando `otherPublicKey` si trova al di fuori della curva ellittica. Poiché `otherPublicKey` viene solitamente fornito da un utente remoto su una rete non sicura, assicurarsi di gestire questa eccezione di conseguenza.


### `ecdh.generateKeys([encoding[, format]])` {#ecdhgeneratekeysencoding-format}

**Aggiunto in: v0.11.14**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codifica](/it/nodejs/api/buffer#buffers-and-character-encodings) del valore restituito.
- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Predefinito:** `'uncompressed'`
- Restituisce: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Genera valori di chiave EC Diffie-Hellman privata e pubblica, e restituisce la chiave pubblica nel `format` e nella `encoding` specificati. Questa chiave dovrebbe essere trasferita all'altra parte.

L'argomento `format` specifica la codifica del punto e può essere `'compressed'` o `'uncompressed'`. Se `format` non è specificato, il punto verrà restituito nel formato `'uncompressed'`.

Se viene fornita una `encoding`, viene restituita una stringa; altrimenti viene restituito un [`Buffer`](/it/nodejs/api/buffer).

### `ecdh.getPrivateKey([encoding])` {#ecdhgetprivatekeyencoding}

**Aggiunto in: v0.11.14**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codifica](/it/nodejs/api/buffer#buffers-and-character-encodings) del valore restituito.
- Restituisce: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'EC Diffie-Hellman nella `encoding` specificata.

Se viene specificata una `encoding`, viene restituita una stringa; altrimenti viene restituito un [`Buffer`](/it/nodejs/api/buffer).

### `ecdh.getPublicKey([encoding][, format])` {#ecdhgetpublickeyencoding-format}

**Aggiunto in: v0.11.14**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codifica](/it/nodejs/api/buffer#buffers-and-character-encodings) del valore restituito.
- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Predefinito:** `'uncompressed'`
- Restituisce: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La chiave pubblica EC Diffie-Hellman nella `encoding` e nel `format` specificati.

L'argomento `format` specifica la codifica del punto e può essere `'compressed'` o `'uncompressed'`. Se `format` non è specificato, il punto verrà restituito nel formato `'uncompressed'`.

Se viene specificata una `encoding`, viene restituita una stringa; altrimenti viene restituito un [`Buffer`](/it/nodejs/api/buffer).


### `ecdh.setPrivateKey(privateKey[, encoding])` {#ecdhsetprivatekeyprivatekey-encoding}

**Aggiunto in: v0.11.14**

- `privateKey` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codifica](/it/nodejs/api/buffer#buffers-and-character-encodings) della stringa `privateKey`.

Imposta la chiave privata EC Diffie-Hellman. Se viene fornita `encoding`, si prevede che `privateKey` sia una stringa; altrimenti si prevede che `privateKey` sia un [`Buffer`](/it/nodejs/api/buffer), `TypedArray` o `DataView`.

Se `privateKey` non è valida per la curva specificata quando è stato creato l'oggetto `ECDH`, viene generato un errore. All'impostazione della chiave privata, viene generato e impostato anche nell'oggetto `ECDH` il punto (chiave) pubblico associato.

### `ecdh.setPublicKey(publicKey[, encoding])` {#ecdhsetpublickeypublickey-encoding}

**Aggiunto in: v0.11.14**

**Deprecato a partire da: v5.2.0**

::: danger [Stabile: 0 - Deprecato]
[Stabile: 0](/it/nodejs/api/documentation#stability-index) [Stabilità: 0](/it/nodejs/api/documentation#stability-index) - Deprecato
:::

- `publicKey` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codifica](/it/nodejs/api/buffer#buffers-and-character-encodings) della stringa `publicKey`.

Imposta la chiave pubblica EC Diffie-Hellman. Se viene fornita `encoding`, si prevede che `publicKey` sia una stringa; altrimenti si prevede un [`Buffer`](/it/nodejs/api/buffer), `TypedArray` o `DataView`.

Normalmente non c'è motivo di chiamare questo metodo perché `ECDH` richiede solo una chiave privata e la chiave pubblica dell'altra parte per calcolare il segreto condiviso. In genere, verrà chiamato [`ecdh.generateKeys()`](/it/nodejs/api/crypto#ecdhgeneratekeysencoding-format) o [`ecdh.setPrivateKey()`](/it/nodejs/api/crypto#ecdhsetprivatekeyprivatekey-encoding). Il metodo [`ecdh.setPrivateKey()`](/it/nodejs/api/crypto#ecdhsetprivatekeyprivatekey-encoding) tenta di generare il punto/chiave pubblica associato alla chiave privata che viene impostata.

Esempio (ottenere un segreto condiviso):

::: code-group
```js [ESM]
const {
  createECDH,
  createHash,
} = await import('node:crypto');

const alice = createECDH('secp256k1');
const bob = createECDH('secp256k1');

// Questo è un modo rapido per specificare una delle chiavi private precedenti di Alice.
// Sarebbe imprudente usare una chiave privata così prevedibile in una vera
// applicazione.
alice.setPrivateKey(
  createHash('sha256').update('alice', 'utf8').digest(),
);

// Bob utilizza una coppia di chiavi pseudocasuali
// crittograficamente forti appena generata
bob.generateKeys();

const aliceSecret = alice.computeSecret(bob.getPublicKey(), null, 'hex');
const bobSecret = bob.computeSecret(alice.getPublicKey(), null, 'hex');

// aliceSecret e bobSecret dovrebbero essere lo stesso valore segreto condiviso
console.log(aliceSecret === bobSecret);
```

```js [CJS]
const {
  createECDH,
  createHash,
} = require('node:crypto');

const alice = createECDH('secp256k1');
const bob = createECDH('secp256k1');

// Questo è un modo rapido per specificare una delle chiavi private precedenti di Alice.
// Sarebbe imprudente usare una chiave privata così prevedibile in una vera
// applicazione.
alice.setPrivateKey(
  createHash('sha256').update('alice', 'utf8').digest(),
);

// Bob utilizza una coppia di chiavi pseudocasuali
// crittograficamente forti appena generata
bob.generateKeys();

const aliceSecret = alice.computeSecret(bob.getPublicKey(), null, 'hex');
const bobSecret = bob.computeSecret(alice.getPublicKey(), null, 'hex');

// aliceSecret e bobSecret dovrebbero essere lo stesso valore segreto condiviso
console.log(aliceSecret === bobSecret);
```
:::


## Classe: `Hash` {#class-hash}

**Aggiunta in: v0.1.92**

- Estende: [\<stream.Transform\>](/it/nodejs/api/stream#class-streamtransform)

La classe `Hash` è un'utility per la creazione di hash digest di dati. Può essere utilizzata in uno dei due modi seguenti:

- Come uno [stream](/it/nodejs/api/stream) che è sia leggibile che scrivibile, dove i dati vengono scritti per produrre un hash digest calcolato sul lato leggibile, oppure
- Utilizzando i metodi [`hash.update()`](/it/nodejs/api/crypto#hashupdatedata-inputencoding) e [`hash.digest()`](/it/nodejs/api/crypto#hashdigestencoding) per produrre l'hash calcolato.

Il metodo [`crypto.createHash()`](/it/nodejs/api/crypto#cryptocreatehashalgorithm-options) viene utilizzato per creare istanze `Hash`. Gli oggetti `Hash` non devono essere creati direttamente utilizzando la parola chiave `new`.

Esempio: Utilizzo degli oggetti `Hash` come stream:



::: code-group
```js [ESM]
const {
  createHash,
} = await import('node:crypto');

const hash = createHash('sha256');

hash.on('readable', () => {
  // Solo un elemento verrà prodotto dallo
  // stream hash.
  const data = hash.read();
  if (data) {
    console.log(data.toString('hex'));
    // Prints:
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
  // Solo un elemento verrà prodotto dallo
  // stream hash.
  const data = hash.read();
  if (data) {
    console.log(data.toString('hex'));
    // Prints:
    //   6a2da20943931e9834fc12cfe5bb47bbd9ae43489a30726962b576f4e3993e50
  }
});

hash.write('some data to hash');
hash.end();
```
:::

Esempio: Utilizzo di `Hash` e stream piped:



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

Esempio: Utilizzo dei metodi [`hash.update()`](/it/nodejs/api/crypto#hashupdatedata-inputencoding) e [`hash.digest()`](/it/nodejs/api/crypto#hashdigestencoding):



::: code-group
```js [ESM]
const {
  createHash,
} = await import('node:crypto');

const hash = createHash('sha256');

hash.update('some data to hash');
console.log(hash.digest('hex'));
// Prints:
//   6a2da20943931e9834fc12cfe5bb47bbd9ae43489a30726962b576f4e3993e50
```

```js [CJS]
const {
  createHash,
} = require('node:crypto');

const hash = createHash('sha256');

hash.update('some data to hash');
console.log(hash.digest('hex'));
// Prints:
//   6a2da20943931e9834fc12cfe5bb47bbd9ae43489a30726962b576f4e3993e50
```
:::


### `hash.copy([options])` {#hashcopyoptions}

**Aggiunto in: v13.1.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opzioni di [`stream.transform`](/it/nodejs/api/stream#new-streamtransformoptions)
- Restituisce: [\<Hash\>](/it/nodejs/api/crypto#class-hash)

Crea un nuovo oggetto `Hash` che contiene una copia completa dello stato interno dell'oggetto `Hash` corrente.

L'argomento opzionale `options` controlla il comportamento dello stream. Per le funzioni hash XOF come `'shake256'`, l'opzione `outputLength` può essere utilizzata per specificare la lunghezza di output desiderata in byte.

Viene generato un errore quando si tenta di copiare l'oggetto `Hash` dopo che è stato chiamato il suo metodo [`hash.digest()`](/it/nodejs/api/crypto#hashdigestencoding).

::: code-group
```js [ESM]
// Calcola un hash rolling.
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

// Ecc.
```

```js [CJS]
// Calcola un hash rolling.
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

// Ecc.
```
:::

### `hash.digest([encoding])` {#hashdigestencoding}

**Aggiunto in: v0.1.92**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codifica](/it/nodejs/api/buffer#buffers-and-character-encodings) del valore di ritorno.
- Restituisce: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Calcola il digest di tutti i dati passati per essere sottoposti ad hash (utilizzando il metodo [`hash.update()`](/it/nodejs/api/crypto#hashupdatedata-inputencoding)). Se viene fornita una `encoding`, verrà restituita una stringa; altrimenti viene restituito un [`Buffer`](/it/nodejs/api/buffer).

L'oggetto `Hash` non può più essere utilizzato dopo che è stato chiamato il metodo `hash.digest()`. Chiamate multiple causeranno la generazione di un errore.


### `hash.update(data[, inputEncoding])` {#hashupdatedata-inputencoding}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v6.0.0 | La `inputEncoding` predefinita è cambiata da `binary` a `utf8`. |
| v0.1.92 | Aggiunto in: v0.1.92 |
:::

- `data` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codifica](/it/nodejs/api/buffer#buffers-and-character-encodings) della stringa `data`.

Aggiorna il contenuto dell'hash con i `data` forniti, la cui codifica è indicata in `inputEncoding`. Se `encoding` non è fornita e i `data` sono una stringa, viene applicata una codifica di `'utf8'`. Se `data` è un [`Buffer`](/it/nodejs/api/buffer), `TypedArray` o `DataView`, allora `inputEncoding` viene ignorato.

Questo può essere chiamato più volte con nuovi dati man mano che vengono trasmessi in streaming.

## Classe: `Hmac` {#class-hmac}

**Aggiunto in: v0.1.94**

- Estende: [\<stream.Transform\>](/it/nodejs/api/stream#class-streamtransform)

La classe `Hmac` è un'utilità per la creazione di digest crittografici HMAC. Può essere utilizzata in uno dei due modi seguenti:

- Come uno [stream](/it/nodejs/api/stream) che è sia leggibile che scrivibile, dove i dati vengono scritti per produrre un digest HMAC calcolato sul lato leggibile, oppure
- Utilizzando i metodi [`hmac.update()`](/it/nodejs/api/crypto#hmacupdatedata-inputencoding) e [`hmac.digest()`](/it/nodejs/api/crypto#hmacdigestencoding) per produrre il digest HMAC calcolato.

Il metodo [`crypto.createHmac()`](/it/nodejs/api/crypto#cryptocreatehmacalgorithm-key-options) viene utilizzato per creare istanze `Hmac`. Gli oggetti `Hmac` non devono essere creati direttamente utilizzando la parola chiave `new`.

Esempio: Utilizzo di oggetti `Hmac` come stream:

::: code-group
```js [ESM]
const {
  createHmac,
} = await import('node:crypto');

const hmac = createHmac('sha256', 'a secret');

hmac.on('readable', () => {
  // Solo un elemento verrà prodotto dallo
  // stream hash.
  const data = hmac.read();
  if (data) {
    console.log(data.toString('hex'));
    // Stampe:
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
  // Solo un elemento verrà prodotto dallo
  // stream hash.
  const data = hmac.read();
  if (data) {
    console.log(data.toString('hex'));
    // Stampe:
    //   7fd04df92f636fd450bc841c9418e5825c17f33ad9c87c518115a45971f7f77e
  }
});

hmac.write('some data to hash');
hmac.end();
```
:::

Esempio: Utilizzo di `Hmac` e stream piped:

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

Esempio: Utilizzo dei metodi [`hmac.update()`](/it/nodejs/api/crypto#hmacupdatedata-inputencoding) e [`hmac.digest()`](/it/nodejs/api/crypto#hmacdigestencoding):

::: code-group
```js [ESM]
const {
  createHmac,
} = await import('node:crypto');

const hmac = createHmac('sha256', 'a secret');

hmac.update('some data to hash');
console.log(hmac.digest('hex'));
// Stampe:
//   7fd04df92f636fd450bc841c9418e5825c17f33ad9c87c518115a45971f7f77e
```

```js [CJS]
const {
  createHmac,
} = require('node:crypto');

const hmac = createHmac('sha256', 'a secret');

hmac.update('some data to hash');
console.log(hmac.digest('hex'));
// Stampe:
//   7fd04df92f636fd450bc841c9418e5825c17f33ad9c87c518115a45971f7f77e
```
:::


### `hmac.digest([encoding])` {#hmacdigestencoding}

**Aggiunto in: v0.1.94**

- `encoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codifica](/it/nodejs/api/buffer#buffers-and-character-encodings) del valore di ritorno.
- Restituisce: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Calcola il digest HMAC di tutti i dati passati utilizzando [`hmac.update()`](/it/nodejs/api/crypto#hmacupdatedata-inputencoding). Se viene fornita `encoding`, viene restituita una stringa; altrimenti viene restituito un [`Buffer`](/it/nodejs/api/buffer).

L'oggetto `Hmac` non può essere riutilizzato dopo che `hmac.digest()` è stato chiamato. Chiamate multiple a `hmac.digest()` comporteranno la generazione di un errore.

### `hmac.update(data[, inputEncoding])` {#hmacupdatedata-inputencoding}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v6.0.0 | La `inputEncoding` predefinita è cambiata da `binary` a `utf8`. |
| v0.1.94 | Aggiunto in: v0.1.94 |
:::

- `data` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codifica](/it/nodejs/api/buffer#buffers-and-character-encodings) della stringa `data`.

Aggiorna il contenuto di `Hmac` con i dati forniti, la cui codifica è indicata in `inputEncoding`. Se `encoding` non viene fornita e i `data` sono una stringa, viene applicata una codifica di `'utf8'`. Se `data` è un [`Buffer`](/it/nodejs/api/buffer), `TypedArray` o `DataView`, allora `inputEncoding` viene ignorata.

Questo può essere chiamato più volte con nuovi dati mentre vengono trasmessi in streaming.

## Classe: `KeyObject` {#class-keyobject}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v14.5.0, v12.19.0 | Le istanze di questa classe possono ora essere passate ai thread di lavoro utilizzando `postMessage`. |
| v11.13.0 | Questa classe è ora esportata. |
| v11.6.0 | Aggiunto in: v11.6.0 |
:::

Node.js utilizza una classe `KeyObject` per rappresentare una chiave simmetrica o asimmetrica e ogni tipo di chiave espone funzioni diverse. I metodi [`crypto.createSecretKey()`](/it/nodejs/api/crypto#cryptocreatesecretkeykey-encoding), [`crypto.createPublicKey()`](/it/nodejs/api/crypto#cryptocreatepublickeykey) e [`crypto.createPrivateKey()`](/it/nodejs/api/crypto#cryptocreateprivatekeykey) vengono utilizzati per creare istanze `KeyObject`. Gli oggetti `KeyObject` non devono essere creati direttamente utilizzando la parola chiave `new`.

La maggior parte delle applicazioni dovrebbe prendere in considerazione l'utilizzo della nuova API `KeyObject` invece di passare le chiavi come stringhe o `Buffer` a causa delle migliori funzionalità di sicurezza.

Le istanze `KeyObject` possono essere passate ad altri thread tramite [`postMessage()`](/it/nodejs/api/worker_threads#portpostmessagevalue-transferlist). Il destinatario ottiene un `KeyObject` clonato e il `KeyObject` non deve essere elencato nell'argomento `transferList`.


### Metodo statico: `KeyObject.from(key)` {#static-method-keyobjectfromkey}

**Aggiunto in: v15.0.0**

- `key` [\<CryptoKey\>](/it/nodejs/api/webcrypto#class-cryptokey)
- Restituisce: [\<KeyObject\>](/it/nodejs/api/crypto#class-keyobject)

Esempio: Conversione di un'istanza `CryptoKey` in un `KeyObject`:

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
// Prints: 32 (dimensione della chiave simmetrica in byte)
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
  // Prints: 32 (dimensione della chiave simmetrica in byte)
})();
```
:::

### `keyObject.asymmetricKeyDetails` {#keyobjectasymmetrickeydetails}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v16.9.0 | Espone i parametri di sequenza `RSASSA-PSS-params` per le chiavi RSA-PSS. |
| v15.7.0 | Aggiunto in: v15.7.0 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `modulusLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Dimensione della chiave in bit (RSA, DSA).
    - `publicExponent`: [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) Esponente pubblico (RSA).
    - `hashAlgorithm`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome del digest del messaggio (RSA-PSS).
    - `mgf1HashAlgorithm`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome del digest del messaggio utilizzato da MGF1 (RSA-PSS).
    - `saltLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Lunghezza minima del salt in byte (RSA-PSS).
    - `divisorLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Dimensione di `q` in bit (DSA).
    - `namedCurve`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome della curva (EC).

Questa proprietà esiste solo su chiavi asimmetriche. A seconda del tipo di chiave, questo oggetto contiene informazioni sulla chiave. Nessuna delle informazioni ottenute tramite questa proprietà può essere utilizzata per identificare univocamente una chiave o per compromettere la sicurezza della chiave.

Per le chiavi RSA-PSS, se il materiale della chiave contiene una sequenza `RSASSA-PSS-params`, le proprietà `hashAlgorithm`, `mgf1HashAlgorithm` e `saltLength` saranno impostate.

Altri dettagli della chiave potrebbero essere esposti tramite questa API utilizzando attributi aggiuntivi.


### `keyObject.asymmetricKeyType` {#keyobjectasymmetrickeytype}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v13.9.0, v12.17.0 | Aggiunto il supporto per `'dh'`. |
| v12.0.0 | Aggiunto il supporto per `'rsa-pss'`. |
| v12.0.0 | Questa proprietà ora restituisce `undefined` per le istanze di KeyObject di tipo non riconosciuto invece di interrompersi. |
| v12.0.0 | Aggiunto il supporto per `'x25519'` e `'x448'`. |
| v12.0.0 | Aggiunto il supporto per `'ed25519'` e `'ed448'`. |
| v11.6.0 | Aggiunto in: v11.6.0 |
:::

- [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Per le chiavi asimmetriche, questa proprietà rappresenta il tipo di chiave. I tipi di chiave supportati sono:

- `'rsa'` (OID 1.2.840.113549.1.1.1)
- `'rsa-pss'` (OID 1.2.840.113549.1.1.10)
- `'dsa'` (OID 1.2.840.10040.4.1)
- `'ec'` (OID 1.2.840.10045.2.1)
- `'x25519'` (OID 1.3.101.110)
- `'x448'` (OID 1.3.101.111)
- `'ed25519'` (OID 1.3.101.112)
- `'ed448'` (OID 1.3.101.113)
- `'dh'` (OID 1.2.840.113549.1.3.1)

Questa proprietà è `undefined` per i tipi `KeyObject` non riconosciuti e le chiavi simmetriche.

### `keyObject.equals(otherKeyObject)` {#keyobjectequalsotherkeyobject}

**Aggiunto in: v17.7.0, v16.15.0**

- `otherKeyObject`: [\<KeyObject\>](/it/nodejs/api/crypto#class-keyobject) Un `KeyObject` con cui confrontare `keyObject`.
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Restituisce `true` o `false` a seconda che le chiavi abbiano esattamente lo stesso tipo, valore e parametri. Questo metodo non è a [tempo costante](https://en.wikipedia.org/wiki/Timing_attack).

### `keyObject.export([options])` {#keyobjectexportoptions}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v15.9.0 | Aggiunto il supporto per il formato `'jwk'`. |
| v11.6.0 | Aggiunto in: v11.6.0 |
:::

- `options`: [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- Restituisce: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Per le chiavi simmetriche, è possibile utilizzare le seguenti opzioni di codifica:

- `format`: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve essere `'buffer'` (predefinito) o `'jwk'`.

Per le chiavi pubbliche, è possibile utilizzare le seguenti opzioni di codifica:

- `type`: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve essere uno tra `'pkcs1'` (solo RSA) o `'spki'`.
- `format`: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve essere `'pem'`, `'der'` o `'jwk'`.

Per le chiavi private, è possibile utilizzare le seguenti opzioni di codifica:

- `type`: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve essere uno tra `'pkcs1'` (solo RSA), `'pkcs8'` o `'sec1'` (solo EC).
- `format`: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve essere `'pem'`, `'der'` o `'jwk'`.
- `cipher`: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Se specificato, la chiave privata verrà crittografata con il `cipher` e la `passphrase` forniti utilizzando la crittografia basata su password PKCS#5 v2.0.
- `passphrase`: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) La passphrase da utilizzare per la crittografia, vedere `cipher`.

Il tipo di risultato dipende dal formato di codifica selezionato, quando PEM il risultato è una stringa, quando DER sarà un buffer contenente i dati codificati come DER, quando [JWK](https://tools.ietf.org/html/rfc7517) sarà un oggetto.

Quando è stato selezionato il formato di codifica [JWK](https://tools.ietf.org/html/rfc7517), tutte le altre opzioni di codifica vengono ignorate.

Le chiavi di tipo PKCS#1, SEC1 e PKCS#8 possono essere crittografate utilizzando una combinazione delle opzioni `cipher` e `format`. Il `type` PKCS#8 può essere utilizzato con qualsiasi `format` per crittografare qualsiasi algoritmo di chiave (RSA, EC o DH) specificando un `cipher`. PKCS#1 e SEC1 possono essere crittografati solo specificando un `cipher` quando viene utilizzato il `format` PEM. Per la massima compatibilità, utilizzare PKCS#8 per le chiavi private crittografate. Poiché PKCS#8 definisce il proprio meccanismo di crittografia, la crittografia a livello PEM non è supportata quando si crittografa una chiave PKCS#8. Vedere [RFC 5208](https://www.rfc-editor.org/rfc/rfc5208.txt) per la crittografia PKCS#8 e [RFC 1421](https://www.rfc-editor.org/rfc/rfc1421.txt) per la crittografia PKCS#1 e SEC1.


### `keyObject.symmetricKeySize` {#keyobjectsymmetrickeysize}

**Aggiunto in: v11.6.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Per le chiavi segrete, questa proprietà rappresenta la dimensione della chiave in byte. Questa proprietà è `undefined` per le chiavi asimmetriche.

### `keyObject.toCryptoKey(algorithm, extractable, keyUsages)` {#keyobjecttocryptokeyalgorithm-extractable-keyusages}

**Aggiunto in: v23.0.0**

- `algorithm`: [\<AlgorithmIdentifier\>](/it/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaHashedImportParams\>](/it/nodejs/api/webcrypto#class-rsahashedimportparams) | [\<EcKeyImportParams\>](/it/nodejs/api/webcrypto#class-eckeyimportparams) | [\<HmacImportParams\>](/it/nodejs/api/webcrypto#class-hmacimportparams)

- `extractable`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `keyUsages`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Vedi [Utilizzi della chiave](/it/nodejs/api/webcrypto#cryptokeyusages).
- Restituisce: [\<CryptoKey\>](/it/nodejs/api/webcrypto#class-cryptokey)

Converte un'istanza di `KeyObject` in una `CryptoKey`.

### `keyObject.type` {#keyobjecttype}

**Aggiunto in: v11.6.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

A seconda del tipo di questo `KeyObject`, questa proprietà è `'secret'` per le chiavi segrete (simmetriche), `'public'` per le chiavi pubbliche (asimmetriche) o `'private'` per le chiavi private (asimmetriche).

## Classe: `Sign` {#class-sign}

**Aggiunto in: v0.1.92**

- Estende: [\<stream.Writable\>](/it/nodejs/api/stream#class-streamwritable)

La classe `Sign` è un'utilità per generare firme. Può essere utilizzata in uno dei due modi seguenti:

- Come [stream](/it/nodejs/api/stream) scrivibile, dove i dati da firmare vengono scritti e il metodo [`sign.sign()`](/it/nodejs/api/crypto#signsignprivatekey-outputencoding) viene utilizzato per generare e restituire la firma, oppure
- Utilizzando i metodi [`sign.update()`](/it/nodejs/api/crypto#signupdatedata-inputencoding) e [`sign.sign()`](/it/nodejs/api/crypto#signsignprivatekey-outputencoding) per produrre la firma.

Il metodo [`crypto.createSign()`](/it/nodejs/api/crypto#cryptocreatesignalgorithm-options) viene utilizzato per creare istanze di `Sign`. L'argomento è il nome stringa della funzione hash da utilizzare. Gli oggetti `Sign` non devono essere creati direttamente utilizzando la parola chiave `new`.

Esempio: utilizzo degli oggetti `Sign` e [`Verify`](/it/nodejs/api/crypto#class-verify) come stream:

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

Esempio: utilizzo dei metodi [`sign.update()`](/it/nodejs/api/crypto#signupdatedata-inputencoding) e [`verify.update()`](/it/nodejs/api/crypto#verifyupdatedata-inputencoding):

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

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v15.0.0 | La privateKey può anche essere un ArrayBuffer e CryptoKey. |
| v13.2.0, v12.16.0 | Questa funzione ora supporta le firme IEEE-P1363 DSA e ECDSA. |
| v12.0.0 | Questa funzione ora supporta le chiavi RSA-PSS. |
| v11.6.0 | Questa funzione ora supporta gli oggetti chiave. |
| v8.0.0 | È stato aggiunto il supporto per RSASSA-PSS e opzioni aggiuntive. |
| v0.1.92 | Aggiunto in: v0.1.92 |
:::

- `privateKey` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/it/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/it/nodejs/api/webcrypto#class-cryptokey)
    - `dsaEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `padding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `saltLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)


- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codifica](/it/nodejs/api/buffer#buffers-and-character-encodings) del valore di ritorno.
- Restituisce: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Calcola la firma su tutti i dati passati tramite [`sign.update()`](/it/nodejs/api/crypto#signupdatedata-inputencoding) o [`sign.write()`](/it/nodejs/api/stream#writablewritechunk-encoding-callback).

Se `privateKey` non è un [`KeyObject`](/it/nodejs/api/crypto#class-keyobject), questa funzione si comporta come se `privateKey` fosse stato passato a [`crypto.createPrivateKey()`](/it/nodejs/api/crypto#cryptocreateprivatekeykey). Se è un oggetto, possono essere passate le seguenti proprietà aggiuntive:

-  `dsaEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Per DSA ed ECDSA, questa opzione specifica il formato della firma generata. Può essere uno dei seguenti:
    - `'der'` (predefinito): struttura di firma ASN.1 con codifica DER che codifica `(r, s)`.
    - `'ieee-p1363'`: formato firma `r || s` come proposto in IEEE-P1363.


-  `padding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Valore di padding opzionale per RSA, uno dei seguenti:
    - `crypto.constants.RSA_PKCS1_PADDING` (predefinito)
    - `crypto.constants.RSA_PKCS1_PSS_PADDING`

`RSA_PKCS1_PSS_PADDING` utilizzerà MGF1 con la stessa funzione hash utilizzata per firmare il messaggio come specificato nella sezione 3.1 di [RFC 4055](https://www.rfc-editor.org/rfc/rfc4055.txt), a meno che una funzione hash MGF1 non sia stata specificata come parte della chiave in conformità con la sezione 3.3 di [RFC 4055](https://www.rfc-editor.org/rfc/rfc4055.txt).
-  `saltLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Lunghezza del salt per quando il padding è `RSA_PKCS1_PSS_PADDING`. Il valore speciale `crypto.constants.RSA_PSS_SALTLEN_DIGEST` imposta la lunghezza del salt sulla dimensione del digest, `crypto.constants.RSA_PSS_SALTLEN_MAX_SIGN` (predefinito) la imposta sul valore massimo consentito.

Se viene fornito `outputEncoding`, viene restituita una stringa; altrimenti viene restituito un [`Buffer`](/it/nodejs/api/buffer).

L'oggetto `Sign` non può essere riutilizzato dopo che è stato chiamato il metodo `sign.sign()`. Chiamate multiple a `sign.sign()` comporteranno la generazione di un errore.


### `sign.update(data[, inputEncoding])` {#signupdatedata-inputencoding}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v6.0.0 | La `inputEncoding` predefinita è cambiata da `binary` a `utf8`. |
| v0.1.92 | Aggiunto in: v0.1.92 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codifica](/it/nodejs/api/buffer#buffers-and-character-encodings) della stringa `data`.

Aggiorna il contenuto di `Sign` con i `data` forniti, la cui codifica è indicata in `inputEncoding`. Se `encoding` non è fornita, e i `data` sono una stringa, viene applicata una codifica di `'utf8'`. Se `data` è un [`Buffer`](/it/nodejs/api/buffer), `TypedArray` o `DataView`, allora `inputEncoding` viene ignorata.

Questo può essere chiamato molte volte con nuovi dati man mano che vengono trasmessi in streaming.

## Classe: `Verify` {#class-verify}

**Aggiunto in: v0.1.92**

- Estende: [\<stream.Writable\>](/it/nodejs/api/stream#class-streamwritable)

La classe `Verify` è un'utilità per la verifica delle firme. Può essere utilizzata in uno dei due modi seguenti:

- Come [stream](/it/nodejs/api/stream) scrivibile in cui i dati scritti vengono utilizzati per la convalida rispetto alla firma fornita, oppure
- Utilizzando i metodi [`verify.update()`](/it/nodejs/api/crypto#verifyupdatedata-inputencoding) e [`verify.verify()`](/it/nodejs/api/crypto#verifyverifyobject-signature-signatureencoding) per verificare la firma.

Il metodo [`crypto.createVerify()`](/it/nodejs/api/crypto#cryptocreateverifyalgorithm-options) viene utilizzato per creare istanze `Verify`. Gli oggetti `Verify` non devono essere creati direttamente utilizzando la parola chiave `new`.

Vedere [`Sign`](/it/nodejs/api/crypto#class-sign) per degli esempi.

### `verify.update(data[, inputEncoding])` {#verifyupdatedata-inputencoding}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v6.0.0 | La `inputEncoding` predefinita è cambiata da `binary` a `utf8`. |
| v0.1.92 | Aggiunto in: v0.1.92 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codifica](/it/nodejs/api/buffer#buffers-and-character-encodings) della stringa `data`.

Aggiorna il contenuto di `Verify` con i `data` forniti, la cui codifica è indicata in `inputEncoding`. Se `inputEncoding` non è fornita, e i `data` sono una stringa, viene applicata una codifica di `'utf8'`. Se `data` è un [`Buffer`](/it/nodejs/api/buffer), `TypedArray` o `DataView`, allora `inputEncoding` viene ignorata.

Questo può essere chiamato molte volte con nuovi dati man mano che vengono trasmessi in streaming.


### `verify.verify(object, signature[, signatureEncoding])` {#verifyverifyobject-signature-signatureencoding}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v15.0.0 | L'oggetto può essere anche un ArrayBuffer e CryptoKey. |
| v13.2.0, v12.16.0 | Questa funzione ora supporta le firme DSA e ECDSA IEEE-P1363. |
| v12.0.0 | Questa funzione ora supporta le chiavi RSA-PSS. |
| v11.7.0 | La chiave ora può essere una chiave privata. |
| v8.0.0 | È stato aggiunto il supporto per RSASSA-PSS e opzioni aggiuntive. |
| v0.1.92 | Aggiunto in: v0.1.92 |
:::

- `object` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/it/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/it/nodejs/api/webcrypto#class-cryptokey)
    - `dsaEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `padding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `saltLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

- `signature` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `signatureEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codifica](/it/nodejs/api/buffer#buffers-and-character-encodings) della stringa `signature`.
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` o `false` a seconda della validità della firma per i dati e la chiave pubblica.

Verifica i dati forniti utilizzando l'`object` e la `signature` forniti.

Se `object` non è una [`KeyObject`](/it/nodejs/api/crypto#class-keyobject), questa funzione si comporta come se `object` fosse stato passato a [`crypto.createPublicKey()`](/it/nodejs/api/crypto#cryptocreatepublickeykey). Se è un oggetto, possono essere passate le seguenti proprietà aggiuntive:

- `dsaEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Per DSA e ECDSA, questa opzione specifica il formato della firma. Può essere uno dei seguenti:
    - `'der'` (predefinito): struttura di firma ASN.1 con codifica DER che codifica `(r, s)`.
    - `'ieee-p1363'`: formato firma `r || s` come proposto in IEEE-P1363.

- `padding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Valore di riempimento opzionale per RSA, uno dei seguenti:
    - `crypto.constants.RSA_PKCS1_PADDING` (predefinito)
    - `crypto.constants.RSA_PKCS1_PSS_PADDING`

`RSA_PKCS1_PSS_PADDING` utilizzerà MGF1 con la stessa funzione hash utilizzata per verificare il messaggio come specificato nella sezione 3.1 di [RFC 4055](https://www.rfc-editor.org/rfc/rfc4055.txt), a meno che una funzione hash MGF1 non sia stata specificata come parte della chiave in conformità con la sezione 3.3 di [RFC 4055](https://www.rfc-editor.org/rfc/rfc4055.txt).
- `saltLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Lunghezza del sale per quando il riempimento è `RSA_PKCS1_PSS_PADDING`. Il valore speciale `crypto.constants.RSA_PSS_SALTLEN_DIGEST` imposta la lunghezza del sale alla dimensione del digest, `crypto.constants.RSA_PSS_SALTLEN_AUTO` (predefinito) fa sì che venga determinata automaticamente.

L'argomento `signature` è la firma calcolata in precedenza per i dati, nella `signatureEncoding`. Se viene specificata una `signatureEncoding`, si prevede che `signature` sia una stringa; altrimenti si prevede che `signature` sia un [`Buffer`](/it/nodejs/api/buffer), `TypedArray` o `DataView`.

L'oggetto `verify` non può essere riutilizzato dopo che è stato chiamato `verify.verify()`. Chiamate multiple a `verify.verify()` comporteranno la generazione di un errore.

Poiché le chiavi pubbliche possono essere derivate da chiavi private, è possibile passare una chiave privata invece di una chiave pubblica.


## Classe: `X509Certificate` {#class-x509certificate}

**Aggiunta in: v15.6.0**

Incapsula un certificato X509 e fornisce accesso in sola lettura alle sue informazioni.

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

**Aggiunta in: v15.6.0**

- `buffer` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Un certificato X509 codificato PEM o DER.

### `x509.ca` {#x509ca}

**Aggiunta in: v15.6.0**

- Tipo: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Sarà `true` se questo è un certificato di Autorità di Certificazione (CA).

### `x509.checkEmail(email[, options])` {#x509checkemailemail-options}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | L'opzione subject ora ha come valore predefinito `'default'`. |
| v17.5.0, v16.15.0 | L'opzione subject ora può essere impostata su `'default'`. |
| v17.5.0, v16.14.1 | Le opzioni `wildcards`, `partialWildcards`, `multiLabelWildcards` e `singleLabelSubdomains` sono state rimosse poiché non avevano alcun effetto. |
| v15.6.0 | Aggiunta in: v15.6.0 |
:::

- `email` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `subject` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'default'`, `'always'` o `'never'`. **Predefinito:** `'default'`.


- Restituisce: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Restituisce `email` se il certificato corrisponde, `undefined` se non corrisponde.

Verifica se il certificato corrisponde all'indirizzo email specificato.

Se l'opzione `'subject'` è undefined o impostata su `'default'`, il soggetto del certificato viene preso in considerazione solo se l'estensione del nome alternativo del soggetto non esiste oppure non contiene alcun indirizzo email.

Se l'opzione `'subject'` è impostata su `'always'` e se l'estensione del nome alternativo del soggetto non esiste oppure non contiene un indirizzo email corrispondente, viene preso in considerazione il soggetto del certificato.

Se l'opzione `'subject'` è impostata su `'never'`, il soggetto del certificato non viene mai preso in considerazione, anche se il certificato non contiene nomi alternativi del soggetto.


### `x509.checkHost(name[, options])` {#x509checkhostname-options}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | L'opzione subject ora ha come valore predefinito `'default'`. |
| v17.5.0, v16.15.0 | L'opzione subject ora può essere impostata su `'default'`. |
| v15.6.0 | Aggiunto in: v15.6.0 |
:::

- `name` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `subject` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'default'`, `'always'` o `'never'`. **Predefinito:** `'default'`.
    - `wildcards` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Predefinito:** `true`.
    - `partialWildcards` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Predefinito:** `true`.
    - `multiLabelWildcards` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Predefinito:** `false`.
    - `singleLabelSubdomains` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Predefinito:** `false`.


- Restituisce: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Restituisce un nome soggetto che corrisponde a `name`, o `undefined` se nessun nome soggetto corrisponde a `name`.

Verifica se il certificato corrisponde al nome host specificato.

Se il certificato corrisponde al nome host specificato, viene restituito il nome soggetto corrispondente. Il nome restituito potrebbe essere una corrispondenza esatta (ad esempio, `foo.example.com`) oppure potrebbe contenere caratteri jolly (ad esempio, `*.example.com`). Poiché i confronti dei nomi host non fanno distinzione tra maiuscole e minuscole, il nome soggetto restituito potrebbe anche differire da `name` per quanto riguarda l'uso delle maiuscole.

Se l'opzione `'subject'` non è definita o è impostata su `'default'`, il soggetto del certificato viene considerato solo se l'estensione del nome alternativo del soggetto non esiste o non contiene alcun nome DNS. Questo comportamento è coerente con [RFC 2818](https://www.rfc-editor.org/rfc/rfc2818.txt) ("HTTP Over TLS").

Se l'opzione `'subject'` è impostata su `'always'` e se l'estensione del nome alternativo del soggetto non esiste o non contiene un nome DNS corrispondente, viene considerato il soggetto del certificato.

Se l'opzione `'subject'` è impostata su `'never'`, il soggetto del certificato non viene mai considerato, anche se il certificato non contiene nomi alternativi del soggetto.


### `x509.checkIP(ip)` {#x509checkipip}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v17.5.0, v16.14.1 | L'argomento `options` è stato rimosso perché non aveva effetto. |
| v15.6.0 | Aggiunto in: v15.6.0 |
:::

- `ip` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Restituisce: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Restituisce `ip` se il certificato corrisponde, `undefined` se non corrisponde.

Verifica se il certificato corrisponde all'indirizzo IP fornito (IPv4 o IPv6).

Vengono considerati solo i nomi alternativi del soggetto `iPAddress` [RFC 5280](https://www.rfc-editor.org/rfc/rfc5280.txt) e devono corrispondere esattamente all'indirizzo `ip` fornito. Altri nomi alternativi del soggetto, nonché il campo del soggetto del certificato, vengono ignorati.

### `x509.checkIssued(otherCert)` {#x509checkissuedothercert}

**Aggiunto in: v15.6.0**

- `otherCert` [\<X509Certificate\>](/it/nodejs/api/crypto#class-x509certificate)
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Verifica se questo certificato è stato emesso dal `otherCert` fornito.

### `x509.checkPrivateKey(privateKey)` {#x509checkprivatekeyprivatekey}

**Aggiunto in: v15.6.0**

- `privateKey` [\<KeyObject\>](/it/nodejs/api/crypto#class-keyobject) Una chiave privata.
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Verifica se la chiave pubblica per questo certificato è coerente con la chiave privata fornita.

### `x509.extKeyUsage` {#x509extkeyusage}

**Aggiunto in: v15.6.0**

- Tipo: [\<stringa[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Un array che descrive in dettaglio gli usi estesi della chiave per questo certificato.

### `x509.fingerprint` {#x509fingerprint}

**Aggiunto in: v15.6.0**

- Tipo: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

L'impronta digitale SHA-1 di questo certificato.

Poiché SHA-1 è crittograficamente compromesso e poiché la sicurezza di SHA-1 è significativamente inferiore a quella degli algoritmi comunemente usati per firmare i certificati, è consigliabile utilizzare [`x509.fingerprint256`](/it/nodejs/api/crypto#x509fingerprint256) invece.


### `x509.fingerprint256` {#x509fingerprint256}

**Aggiunto in: v15.6.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

L'impronta digitale SHA-256 di questo certificato.

### `x509.fingerprint512` {#x509fingerprint512}

**Aggiunto in: v17.2.0, v16.14.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

L'impronta digitale SHA-512 di questo certificato.

Poiché il calcolo dell'impronta digitale SHA-256 è generalmente più veloce ed è solo la metà della dimensione dell'impronta digitale SHA-512, [`x509.fingerprint256`](/it/nodejs/api/crypto#x509fingerprint256) potrebbe essere una scelta migliore. Sebbene SHA-512 presumibilmente fornisca un livello di sicurezza più elevato in generale, la sicurezza di SHA-256 corrisponde a quella della maggior parte degli algoritmi comunemente usati per firmare i certificati.

### `x509.infoAccess` {#x509infoaccess}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v17.3.1, v16.13.2 | Parti di questa stringa potrebbero essere codificate come valori letterali stringa JSON in risposta a CVE-2021-44532. |
| v15.6.0 | Aggiunto in: v15.6.0 |
:::

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Una rappresentazione testuale dell'estensione di accesso alle informazioni dell'autorità del certificato.

Questo è un elenco di descrizioni di accesso separate da un avanzamento riga. Ogni riga inizia con il metodo di accesso e il tipo di posizione di accesso, seguito da due punti e dal valore associato alla posizione di accesso.

Dopo il prefisso che denota il metodo di accesso e il tipo di posizione di accesso, il resto di ogni riga potrebbe essere racchiuso tra virgolette per indicare che il valore è un valore letterale stringa JSON. Per garantire la retrocompatibilità, Node.js utilizza i valori letterali stringa JSON all'interno di questa proprietà solo quando necessario per evitare ambiguità. Il codice di terze parti deve essere preparato a gestire entrambi i possibili formati di voce.

### `x509.issuer` {#x509issuer}

**Aggiunto in: v15.6.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

L'identificazione dell'emittente inclusa in questo certificato.


### `x509.issuerCertificate` {#x509issuercertificate}

**Aggiunto in: v15.9.0**

- Tipo: [\<X509Certificate\>](/it/nodejs/api/crypto#class-x509certificate)

Il certificato dell'emittente o `undefined` se il certificato dell'emittente non è disponibile.

### `x509.publicKey` {#x509publickey}

**Aggiunto in: v15.6.0**

- Tipo: [\<KeyObject\>](/it/nodejs/api/crypto#class-keyobject)

La chiave pubblica [\<KeyObject\>](/it/nodejs/api/crypto#class-keyobject) per questo certificato.

### `x509.raw` {#x509raw}

**Aggiunto in: v15.6.0**

- Tipo: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer)

Un `Buffer` contenente la codifica DER di questo certificato.

### `x509.serialNumber` {#x509serialnumber}

**Aggiunto in: v15.6.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Il numero di serie di questo certificato.

I numeri di serie sono assegnati dalle autorità di certificazione e non identificano univocamente i certificati. Si consideri l'utilizzo di [`x509.fingerprint256`](/it/nodejs/api/crypto#x509fingerprint256) come identificatore univoco.

### `x509.subject` {#x509subject}

**Aggiunto in: v15.6.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Il soggetto completo di questo certificato.

### `x509.subjectAltName` {#x509subjectaltname}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v17.3.1, v16.13.2 | Parti di questa stringa possono essere codificate come stringhe letterali JSON in risposta a CVE-2021-44532. |
| v15.6.0 | Aggiunto in: v15.6.0 |
:::

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Il nome alternativo del soggetto specificato per questo certificato.

Questo è un elenco separato da virgole di nomi alternativi del soggetto. Ogni voce inizia con una stringa che identifica il tipo del nome alternativo del soggetto seguita da due punti e dal valore associato alla voce.

Le versioni precedenti di Node.js presupponevano erroneamente che fosse sicuro dividere questa proprietà alla sequenza di due caratteri `', '` (vedere [CVE-2021-44532](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-44532)). Tuttavia, sia i certificati dannosi che quelli legittimi possono contenere nomi alternativi del soggetto che includono questa sequenza se rappresentati come stringa.

Dopo il prefisso che denota il tipo della voce, il resto di ogni voce potrebbe essere racchiuso tra virgolette per indicare che il valore è una stringa letterale JSON. Per compatibilità con le versioni precedenti, Node.js utilizza stringhe letterali JSON all'interno di questa proprietà solo quando necessario per evitare ambiguità. Il codice di terze parti dovrebbe essere pronto a gestire entrambi i possibili formati di voce.


### `x509.toJSON()` {#x509tojson}

**Aggiunto in: v15.6.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Non esiste una codifica JSON standard per i certificati X509. Il metodo `toJSON()` restituisce una stringa contenente il certificato codificato in formato PEM.

### `x509.toLegacyObject()` {#x509tolegacyobject}

**Aggiunto in: v15.6.0**

- Tipo: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Restituisce informazioni su questo certificato utilizzando la codifica [oggetto certificato](/it/nodejs/api/tls#certificate-object) legacy.

### `x509.toString()` {#x509tostring}

**Aggiunto in: v15.6.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Restituisce il certificato codificato in formato PEM.

### `x509.validFrom` {#x509validfrom}

**Aggiunto in: v15.6.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La data/ora da cui questo certificato è valido.

### `x509.validFromDate` {#x509validfromdate}

**Aggiunto in: v23.0.0**

- Tipo: [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

La data/ora da cui questo certificato è valido, incapsulata in un oggetto `Date`.

### `x509.validTo` {#x509validto}

**Aggiunto in: v15.6.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

La data/ora fino alla quale questo certificato è valido.

### `x509.validToDate` {#x509validtodate}

**Aggiunto in: v23.0.0**

- Tipo: [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

La data/ora fino alla quale questo certificato è valido, incapsulata in un oggetto `Date`.

### `x509.verify(publicKey)` {#x509verifypublickey}

**Aggiunto in: v15.6.0**

- `publicKey` [\<KeyObject\>](/it/nodejs/api/crypto#class-keyobject) Una chiave pubblica.
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Verifica che questo certificato sia stato firmato dalla chiave pubblica fornita. Non esegue altri controlli di validazione sul certificato.


## Metodi e proprietà del modulo `node:crypto` {#nodecrypto-module-methods-and-properties}

### `crypto.checkPrime(candidate[, options], callback)` {#cryptocheckprimecandidate-options-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare un callback non valido all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v15.8.0 | Aggiunto in: v15.8.0 |
:::

- `candidate` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) Un possibile numero primo codificato come una sequenza di ottetti big endian di lunghezza arbitraria.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `checks` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di iterazioni di primalità probabilistica di Miller-Rabin da eseguire. Quando il valore è `0` (zero), viene utilizzato un numero di controlli che produce un tasso di falsi positivi al massimo pari a 2 per input casuali. È necessario prestare attenzione quando si seleziona un numero di controlli. Fare riferimento alla documentazione OpenSSL per le opzioni `nchecks` della funzione [`BN_is_prime_ex`](https://www.openssl.org/docs/man1.1.1/man3/BN_is_prime_ex) per maggiori dettagli. **Predefinito:** `0`
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Impostato su un oggetto [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) se si è verificato un errore durante il controllo.
    - `result` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` se il candidato è un numero primo con una probabilità di errore inferiore a `0.25 ** options.checks`.
  
 

Verifica la primalità del `candidate`.


### `crypto.checkPrimeSync(candidate[, options])` {#cryptocheckprimesynccandidate-options}

**Aggiunto in: v15.8.0**

- `candidate` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) Un possibile numero primo codificato come una sequenza di ottetti big endian di lunghezza arbitraria.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `checks` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di iterazioni di primalità probabilistica di Miller-Rabin da eseguire. Quando il valore è `0` (zero), viene utilizzato un numero di controlli che produce un tasso di falsi positivi al massimo di 2 per input casuali. È necessario prestare attenzione quando si seleziona un numero di controlli. Fare riferimento alla documentazione OpenSSL per le opzioni `nchecks` della funzione [`BN_is_prime_ex`](https://www.openssl.org/docs/man1.1.1/man3/BN_is_prime_ex) per maggiori dettagli. **Predefinito:** `0`

- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` se il candidato è un numero primo con una probabilità di errore inferiore a `0.25 ** options.checks`.

Verifica la primalità del `candidate`.

### `crypto.constants` {#cryptoconstants}

**Aggiunto in: v6.3.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Un oggetto contenente costanti comunemente utilizzate per operazioni correlate alla crittografia e alla sicurezza. Le costanti specifiche attualmente definite sono descritte in [Costanti di crittografia](/it/nodejs/api/crypto#crypto-constants).


### `crypto.createCipheriv(algorithm, key, iv[, options])` {#cryptocreatecipherivalgorithm-key-iv-options}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v17.9.0, v16.17.0 | L'opzione `authTagLength` è ora facoltativa quando si utilizza la cifratura `chacha20-poly1305` e il valore predefinito è 16 byte. |
| v15.0.0 | Gli argomenti password e iv possono essere un ArrayBuffer e sono limitati a un massimo di 2 ** 31 - 1 byte ciascuno. |
| v11.6.0 | L'argomento `key` può ora essere un `KeyObject`. |
| v11.2.0, v10.17.0 | La cifratura `chacha20-poly1305` (la variante IETF di ChaCha20-Poly1305) è ora supportata. |
| v10.10.0 | Le cifrature in modalità OCB sono ora supportate. |
| v10.2.0 | L'opzione `authTagLength` può ora essere utilizzata per produrre tag di autenticazione più brevi in modalità GCM e il valore predefinito è 16 byte. |
| v9.9.0 | Il parametro `iv` può ora essere `null` per le cifrature che non necessitano di un vettore di inizializzazione. |
| v0.1.94 | Aggiunto in: v0.1.94 |
:::

- `algorithm` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `key` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/it/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/it/nodejs/api/webcrypto#class-cryptokey)
- `iv` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.transform` opzioni](/it/nodejs/api/stream#new-streamtransformoptions)
- Restituisce: [\<Cipher\>](/it/nodejs/api/crypto#class-cipher)

Crea e restituisce un oggetto `Cipher`, con l'`algorithm`, la `key` e il vettore di inizializzazione (`iv`) forniti.

L'argomento `options` controlla il comportamento dello stream ed è facoltativo tranne quando viene utilizzata una cifratura in modalità CCM o OCB (ad es. `'aes-128-ccm'`). In tal caso, l'opzione `authTagLength` è obbligatoria e specifica la lunghezza del tag di autenticazione in byte, vedi [modalità CCM](/it/nodejs/api/crypto#ccm-mode). In modalità GCM, l'opzione `authTagLength` non è obbligatoria ma può essere utilizzata per impostare la lunghezza del tag di autenticazione che verrà restituito da `getAuthTag()` e il valore predefinito è 16 byte. Per `chacha20-poly1305`, l'opzione `authTagLength` ha come valore predefinito 16 byte.

L'`algorithm` dipende da OpenSSL, ad esempio `'aes192'`, ecc. Nelle versioni recenti di OpenSSL, `openssl list -cipher-algorithms` mostrerà gli algoritmi di cifratura disponibili.

La `key` è la chiave non elaborata utilizzata dall'`algorithm` e `iv` è un [vettore di inizializzazione](https://en.wikipedia.org/wiki/Initialization_vector). Entrambi gli argomenti devono essere stringhe con codifica `'utf8'`, [Buffer](/it/nodejs/api/buffer), `TypedArray` o `DataView`. La `key` può facoltativamente essere un [`KeyObject`](/it/nodejs/api/crypto#class-keyobject) di tipo `secret`. Se la cifratura non necessita di un vettore di inizializzazione, `iv` può essere `null`.

Quando si passano stringhe per `key` o `iv`, si prega di considerare [le avvertenze quando si utilizzano stringhe come input per le API crittografiche](/it/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis).

I vettori di inizializzazione dovrebbero essere imprevedibili e univoci; idealmente, saranno crittograficamente casuali. Non devono essere segreti: gli IV vengono in genere aggiunti ai messaggi di testo cifrato non crittografati. Può sembrare contraddittorio che qualcosa debba essere imprevedibile e univoco, ma non deve essere segreto; ricorda che un utente malintenzionato non deve essere in grado di prevedere in anticipo quale sarà un determinato IV.


### `crypto.createDecipheriv(algorithm, key, iv[, options])` {#cryptocreatedecipherivalgorithm-key-iv-options}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v17.9.0, v16.17.0 | L'opzione `authTagLength` ora è opzionale quando si utilizza la cifratura `chacha20-poly1305` e il valore predefinito è di 16 byte. |
| v11.6.0 | L'argomento `key` ora può essere un `KeyObject`. |
| v11.2.0, v10.17.0 | La cifratura `chacha20-poly1305` (la variante IETF di ChaCha20-Poly1305) è ora supportata. |
| v10.10.0 | Le cifrature in modalità OCB sono ora supportate. |
| v10.2.0 | L'opzione `authTagLength` può ora essere utilizzata per limitare le lunghezze dei tag di autenticazione GCM accettati. |
| v9.9.0 | Il parametro `iv` ora può essere `null` per le cifrature che non necessitano di un vettore di inizializzazione. |
| v0.1.94 | Aggiunto in: v0.1.94 |
:::

- `algorithm` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `key` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/it/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/it/nodejs/api/webcrypto#class-cryptokey)
- `iv` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opzioni [`stream.transform`](/it/nodejs/api/stream#new-streamtransformoptions)
- Restituisce: [\<Decipher\>](/it/nodejs/api/crypto#class-decipher)

Crea e restituisce un oggetto `Decipher` che utilizza l'`algoritmo`, la `chiave` e il vettore di inizializzazione (`iv`) forniti.

L'argomento `options` controlla il comportamento del flusso ed è opzionale tranne quando viene utilizzata una cifratura in modalità CCM o OCB (ad es. `'aes-128-ccm'`). In tal caso, l'opzione `authTagLength` è obbligatoria e specifica la lunghezza del tag di autenticazione in byte, vedere [Modalità CCM](/it/nodejs/api/crypto#ccm-mode). Per AES-GCM e `chacha20-poly1305`, l'opzione `authTagLength` ha come valore predefinito 16 byte e deve essere impostata su un valore diverso se viene utilizzata una lunghezza diversa.

L'`algorithm` dipende da OpenSSL, ad esempio `'aes192'`, ecc. Nelle versioni recenti di OpenSSL, `openssl list -cipher-algorithms` visualizzerà gli algoritmi di cifratura disponibili.

La `key` è la chiave raw utilizzata dall'`algorithm` e `iv` è un [vettore di inizializzazione](https://en.wikipedia.org/wiki/Initialization_vector). Entrambi gli argomenti devono essere stringhe con codifica `'utf8'`, [Buffer](/it/nodejs/api/buffer), `TypedArray` o `DataView`. La `key` può facoltativamente essere un [`KeyObject`](/it/nodejs/api/crypto#class-keyobject) di tipo `secret`. Se la cifratura non necessita di un vettore di inizializzazione, `iv` può essere `null`.

Quando si passano stringhe per `key` o `iv`, si prega di considerare [avvertenze quando si utilizzano stringhe come input per le API crittografiche](/it/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis).

I vettori di inizializzazione devono essere imprevedibili e univoci; idealmente, saranno crittograficamente casuali. Non devono essere segreti: gli IV vengono in genere aggiunti ai messaggi di testo cifrato non crittografati. Può sembrare contraddittorio che qualcosa debba essere imprevedibile e univoco, ma non debba essere segreto; ricorda che un utente malintenzionato non deve essere in grado di prevedere in anticipo quale sarà un dato IV.


### `crypto.createDiffieHellman(prime[, primeEncoding][, generator][, generatorEncoding])` {#cryptocreatediffiehellmanprime-primeencoding-generator-generatorencoding}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v8.0.0 | L'argomento `prime` può ora essere qualsiasi `TypedArray` o `DataView`. |
| v8.0.0 | L'argomento `prime` può ora essere un `Uint8Array`. |
| v6.0.0 | Il valore predefinito per i parametri di codifica è cambiato da `binary` a `utf8`. |
| v0.11.12 | Aggiunto in: v0.11.12 |
:::

- `prime` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `primeEncoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codifica](/it/nodejs/api/buffer#buffers-and-character-encodings) della stringa `prime`.
- `generator` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) **Predefinito:** `2`
- `generatorEncoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La [codifica](/it/nodejs/api/buffer#buffers-and-character-encodings) della stringa `generator`.
- Restituisce: [\<DiffieHellman\>](/it/nodejs/api/crypto#class-diffiehellman)

Crea un oggetto di scambio di chiavi `DiffieHellman` utilizzando il `prime` fornito e un `generator` specifico opzionale.

L'argomento `generator` può essere un numero, una stringa o un [`Buffer`](/it/nodejs/api/buffer). Se `generator` non è specificato, viene utilizzato il valore `2`.

Se `primeEncoding` è specificato, si prevede che `prime` sia una stringa; altrimenti ci si aspetta un [`Buffer`](/it/nodejs/api/buffer), `TypedArray` o `DataView`.

Se `generatorEncoding` è specificato, si prevede che `generator` sia una stringa; altrimenti ci si aspetta un numero, [`Buffer`](/it/nodejs/api/buffer), `TypedArray` o `DataView`.


### `crypto.createDiffieHellman(primeLength[, generator])` {#cryptocreatediffiehellmanprimelength-generator}

**Aggiunto in: v0.5.0**

- `primeLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `generator` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `2`
- Restituisce: [\<DiffieHellman\>](/it/nodejs/api/crypto#class-diffiehellman)

Crea un oggetto di scambio di chiavi `DiffieHellman` e genera un numero primo di `primeLength` bit usando un `generator` numerico specifico opzionale. Se `generator` non è specificato, viene utilizzato il valore `2`.

### `crypto.createDiffieHellmanGroup(name)` {#cryptocreatediffiehellmangroupname}

**Aggiunto in: v0.9.3**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Restituisce: [\<DiffieHellmanGroup\>](/it/nodejs/api/crypto#class-diffiehellmangroup)

Un alias per [`crypto.getDiffieHellman()`](/it/nodejs/api/crypto#cryptogetdiffiehellmangroupname)

### `crypto.createECDH(curveName)` {#cryptocreateecdhcurvename}

**Aggiunto in: v0.11.14**

- `curveName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Restituisce: [\<ECDH\>](/it/nodejs/api/crypto#class-ecdh)

Crea un oggetto di scambio di chiavi Elliptic Curve Diffie-Hellman (`ECDH`) usando una curva predefinita specificata dalla stringa `curveName`. Utilizzare [`crypto.getCurves()`](/it/nodejs/api/crypto#cryptogetcurves) per ottenere un elenco di nomi di curve disponibili. Sulle versioni recenti di OpenSSL, `openssl ecparam -list_curves` mostrerà anche il nome e la descrizione di ogni curva ellittica disponibile.

### `crypto.createHash(algorithm[, options])` {#cryptocreatehashalgorithm-options}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v12.8.0 | L'opzione `outputLength` è stata aggiunta per le funzioni hash XOF. |
| v0.1.92 | Aggiunto in: v0.1.92 |
:::

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.transform` options](/it/nodejs/api/stream#new-streamtransformoptions)
- Restituisce: [\<Hash\>](/it/nodejs/api/crypto#class-hash)

Crea e restituisce un oggetto `Hash` che può essere utilizzato per generare hash digest usando l'`algorithm` specificato. L'argomento `options` opzionale controlla il comportamento del flusso. Per le funzioni hash XOF come `'shake256'`, l'opzione `outputLength` può essere utilizzata per specificare la lunghezza di output desiderata in byte.

L'`algorithm` dipende dagli algoritmi disponibili supportati dalla versione di OpenSSL sulla piattaforma. Esempi sono `'sha256'`, `'sha512'`, ecc. Sulle versioni recenti di OpenSSL, `openssl list -digest-algorithms` mostrerà gli algoritmi di digest disponibili.

Esempio: generazione della somma sha256 di un file



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

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v15.0.0 | La chiave può anche essere un ArrayBuffer o CryptoKey. L'opzione di codifica è stata aggiunta. La chiave non può contenere più di 2 ** 32 - 1 byte. |
| v11.6.0 | L'argomento `key` ora può essere un `KeyObject`. |
| v0.1.94 | Aggiunto in: v0.1.94 |
:::

- `algorithm` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `key` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/it/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/it/nodejs/api/webcrypto#class-cryptokey)
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.transform` options](/it/nodejs/api/stream#new-streamtransformoptions)
    - `encoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La codifica della stringa da utilizzare quando `key` è una stringa.

- Restituisce: [\<Hmac\>](/it/nodejs/api/crypto#class-hmac)

Crea e restituisce un oggetto `Hmac` che utilizza l'`algorithm` e la `key` forniti. L'argomento opzionale `options` controlla il comportamento dello stream.

L'`algorithm` dipende dagli algoritmi disponibili supportati dalla versione di OpenSSL sulla piattaforma. Gli esempi sono `'sha256'`, `'sha512'`, ecc. Nelle versioni recenti di OpenSSL, `openssl list -digest-algorithms` visualizzerà gli algoritmi di digest disponibili.

La `key` è la chiave HMAC utilizzata per generare l'hash HMAC crittografico. Se è un [`KeyObject`](/it/nodejs/api/crypto#class-keyobject), il suo tipo deve essere `secret`. Se è una stringa, si prega di considerare [avvertenze quando si utilizzano stringhe come input per le API crittografiche](/it/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis). Se è stata ottenuta da una fonte di entropia crittograficamente sicura, come [`crypto.randomBytes()`](/it/nodejs/api/crypto#cryptorandombytessize-callback) o [`crypto.generateKey()`](/it/nodejs/api/crypto#cryptogeneratekeytype-options-callback), la sua lunghezza non deve superare la dimensione del blocco di `algorithm` (ad esempio, 512 bit per SHA-256).

Esempio: generazione dell'HMAC sha256 di un file

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

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v15.12.0 | La chiave può essere anche un oggetto JWK. |
| v15.0.0 | La chiave può essere anche un ArrayBuffer. È stata aggiunta l'opzione di codifica. La chiave non può contenere più di 2 ** 32 - 1 byte. |
| v11.6.0 | Aggiunto in: v11.6.0 |
:::

- `key` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
    - `key`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Il materiale della chiave, sia in formato PEM, DER o JWK.
    - `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve essere `'pem'`, `'der'`, o '`'jwk'`. **Predefinito:** `'pem'`.
    - `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve essere `'pkcs1'`, `'pkcs8'` o `'sec1'`. Questa opzione è richiesta solo se il `format` è `'der'` e altrimenti ignorata.
    - `passphrase`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) La passphrase da utilizzare per la decrittazione.
    - `encoding`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La codifica stringa da utilizzare quando `key` è una stringa.
  
 
- Restituisce: [\<KeyObject\>](/it/nodejs/api/crypto#class-keyobject)

Crea e restituisce un nuovo oggetto chiave contenente una chiave privata. Se `key` è una stringa o `Buffer`, si presume che `format` sia `'pem'`; altrimenti, `key` deve essere un oggetto con le proprietà descritte sopra.

Se la chiave privata è crittografata, è necessario specificare una `passphrase`. La lunghezza della passphrase è limitata a 1024 byte.


### `crypto.createPublicKey(key)` {#cryptocreatepublickeykey}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v15.12.0 | La chiave può anche essere un oggetto JWK. |
| v15.0.0 | La chiave può anche essere un ArrayBuffer. L'opzione di codifica è stata aggiunta. La chiave non può contenere più di 2 ** 32 - 1 byte. |
| v11.13.0 | L'argomento `key` ora può essere un `KeyObject` con tipo `private`. |
| v11.7.0 | L'argomento `key` ora può essere una chiave privata. |
| v11.6.0 | Aggiunto in: v11.6.0 |
:::

- `key` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
    - `key`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Il materiale della chiave, in formato PEM, DER o JWK.
    - `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve essere `'pem'`, `'der'` o `'jwk'`. **Predefinito:** `'pem'`.
    - `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve essere `'pkcs1'` o `'spki'`. Questa opzione è richiesta solo se il `format` è `'der'` e ignorata altrimenti.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La codifica stringa da utilizzare quando `key` è una stringa.


- Restituisce: [\<KeyObject\>](/it/nodejs/api/crypto#class-keyobject)

Crea e restituisce un nuovo oggetto chiave contenente una chiave pubblica. Se `key` è una stringa o `Buffer`, si presume che `format` sia `'pem'`; se `key` è un `KeyObject` con tipo `'private'`, la chiave pubblica viene derivata dalla chiave privata fornita; altrimenti, `key` deve essere un oggetto con le proprietà descritte sopra.

Se il formato è `'pem'`, la `'key'` può anche essere un certificato X.509.

Poiché le chiavi pubbliche possono essere derivate dalle chiavi private, è possibile passare una chiave privata anziché una chiave pubblica. In tal caso, questa funzione si comporta come se fosse stato chiamato [`crypto.createPrivateKey()`](/it/nodejs/api/crypto#cryptocreateprivatekeykey), tranne per il fatto che il tipo del `KeyObject` restituito sarà `'public'` e che la chiave privata non può essere estratta dal `KeyObject` restituito. Allo stesso modo, se viene fornito un `KeyObject` con tipo `'private'`, verrà restituito un nuovo `KeyObject` con tipo `'public'` e sarà impossibile estrarre la chiave privata dall'oggetto restituito.


### `crypto.createSecretKey(key[, encoding])` {#cryptocreatesecretkeykey-encoding}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.8.0, v16.18.0 | La chiave ora può essere di lunghezza zero. |
| v15.0.0 | La chiave può anche essere un ArrayBuffer o una stringa. È stato aggiunto l'argomento encoding. La chiave non può contenere più di 2 ** 32 - 1 byte. |
| v11.6.0 | Aggiunto in: v11.6.0 |
:::

- `key` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La codifica della stringa quando `key` è una stringa.
- Restituisce: [\<KeyObject\>](/it/nodejs/api/crypto#class-keyobject)

Crea e restituisce un nuovo oggetto chiave contenente una chiave segreta per la crittografia simmetrica o `Hmac`.

### `crypto.createSign(algorithm[, options])` {#cryptocreatesignalgorithm-options}

**Aggiunto in: v0.1.92**

- `algorithm` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.Writable` opzioni](/it/nodejs/api/stream#new-streamwritableoptions)
- Restituisce: [\<Sign\>](/it/nodejs/api/crypto#class-sign)

Crea e restituisce un oggetto `Sign` che utilizza l'`algorithm` specificato. Usa [`crypto.getHashes()`](/it/nodejs/api/crypto#cryptogethashes) per ottenere i nomi degli algoritmi di digest disponibili. L'argomento opzionale `options` controlla il comportamento di `stream.Writable`.

In alcuni casi, un'istanza `Sign` può essere creata usando il nome di un algoritmo di firma, come `'RSA-SHA256'`, invece di un algoritmo di digest. Questo userà l'algoritmo di digest corrispondente. Questo non funziona per tutti gli algoritmi di firma, come `'ecdsa-with-SHA256'`, quindi è meglio usare sempre i nomi degli algoritmi di digest.


### `crypto.createVerify(algorithm[, options])` {#cryptocreateverifyalgorithm-options}

**Aggiunto in: v0.1.92**

- `algorithm` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.Writable` options](/it/nodejs/api/stream#new-streamwritableoptions)
- Restituisce: [\<Verify\>](/it/nodejs/api/crypto#class-verify)

Crea e restituisce un oggetto `Verify` che utilizza l'algoritmo specificato. Utilizzare [`crypto.getHashes()`](/it/nodejs/api/crypto#cryptogethashes) per ottenere un array di nomi degli algoritmi di firma disponibili. L'argomento opzionale `options` controlla il comportamento di `stream.Writable`.

In alcuni casi, un'istanza `Verify` può essere creata utilizzando il nome di un algoritmo di firma, come `'RSA-SHA256'`, invece di un algoritmo di digest. Questo utilizzerà l'algoritmo di digest corrispondente. Questo non funziona per tutti gli algoritmi di firma, come `'ecdsa-with-SHA256'`, quindi è meglio usare sempre i nomi degli algoritmi di digest.

### `crypto.diffieHellman(options)` {#cryptodiffiehellmanoptions}

**Aggiunto in: v13.9.0, v12.17.0**

- `options`: [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `privateKey`: [\<KeyObject\>](/it/nodejs/api/crypto#class-keyobject)
    - `publicKey`: [\<KeyObject\>](/it/nodejs/api/crypto#class-keyobject)
  
 
- Restituisce: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer)

Calcola il segreto Diffie-Hellman basato su una `privateKey` e una `publicKey`. Entrambe le chiavi devono avere lo stesso `asymmetricKeyType`, che deve essere uno tra `'dh'` (per Diffie-Hellman), `'ec'`, `'x448'` o `'x25519'` (per ECDH).

### `crypto.fips` {#cryptofips}

**Aggiunto in: v6.0.0**

**Deprecato dal: v10.0.0**

::: danger [Stabile: 0 - Deprecato]
[Stabile: 0](/it/nodejs/api/documentation#stability-index) [Stabilità: 0](/it/nodejs/api/documentation#stability-index) - Deprecato
:::

Proprietà per controllare se è in uso un provider crittografico conforme a FIPS. Impostare su true richiede una build FIPS di Node.js.

Questa proprietà è deprecata. Si prega di utilizzare `crypto.setFips()` e `crypto.getFips()` invece.


### `crypto.generateKey(type, options, callback)` {#cryptogeneratekeytype-options-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare una callback non valida all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v15.0.0 | Aggiunto in: v15.0.0 |
:::

- `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'uso previsto della chiave segreta generata. I valori attualmente accettati sono `'hmac'` e `'aes'`.
- `options`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `length`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La lunghezza in bit della chiave da generare. Questo deve essere un valore maggiore di 0.
    - Se `type` è `'hmac'`, il valore minimo è 8 e la lunghezza massima è 2-1. Se il valore non è un multiplo di 8, la chiave generata verrà troncata a `Math.floor(length / 8)`.
    - Se `type` è `'aes'`, la lunghezza deve essere una tra `128`, `192` o `256`.

- `callback`: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err`: [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `key`: [\<KeyObject\>](/it/nodejs/api/crypto#class-keyobject)

Genera asincronamente una nuova chiave segreta casuale della `length` specificata. Il `type` determinerà quali validazioni verranno eseguite sulla `length`.

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

La dimensione di una chiave HMAC generata non deve superare la dimensione del blocco della funzione hash sottostante. Vedere [`crypto.createHmac()`](/it/nodejs/api/crypto#cryptocreatehmacalgorithm-key-options) per maggiori informazioni.


### `crypto.generateKeyPair(type, options, callback)` {#cryptogeneratekeypairtype-options-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare un callback non valido all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v16.10.0 | Aggiunta la possibilità di definire i parametri della sequenza `RSASSA-PSS-params` per le coppie di chiavi RSA-PSS. |
| v13.9.0, v12.17.0 | Aggiunto il supporto per Diffie-Hellman. |
| v12.0.0 | Aggiunto il supporto per le coppie di chiavi RSA-PSS. |
| v12.0.0 | Aggiunta la possibilità di generare coppie di chiavi X25519 e X448. |
| v12.0.0 | Aggiunta la possibilità di generare coppie di chiavi Ed25519 e Ed448. |
| v11.6.0 | Le funzioni `generateKeyPair` e `generateKeyPairSync` ora producono oggetti chiave se non è stata specificata alcuna codifica. |
| v10.12.0 | Aggiunto in: v10.12.0 |
:::

- `type`: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve essere `'rsa'`, `'rsa-pss'`, `'dsa'`, `'ec'`, `'ed25519'`, `'ed448'`, `'x25519'`, `'x448'` o `'dh'`.
- `options`: [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `modulusLength`: [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Dimensione della chiave in bit (RSA, DSA).
    - `publicExponent`: [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Esponente pubblico (RSA). **Predefinito:** `0x10001`.
    - `hashAlgorithm`: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome del message digest (RSA-PSS).
    - `mgf1HashAlgorithm`: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome del message digest utilizzato da MGF1 (RSA-PSS).
    - `saltLength`: [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Lunghezza minima del salt in byte (RSA-PSS).
    - `divisorLength`: [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Dimensione di `q` in bit (DSA).
    - `namedCurve`: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome della curva da utilizzare (EC).
    - `prime`: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) Il parametro prime (DH).
    - `primeLength`: [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Lunghezza del prime in bit (DH).
    - `generator`: [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Generatore personalizzato (DH). **Predefinito:** `2`.
    - `groupName`: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome del gruppo Diffie-Hellman (DH). Vedere [`crypto.getDiffieHellman()`](/it/nodejs/api/crypto#cryptogetdiffiehellmangroupname).
    - `paramEncoding`: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve essere `'named'` o `'explicit'` (EC). **Predefinito:** `'named'`.
    - `publicKeyEncoding`: [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Vedere [`keyObject.export()`](/it/nodejs/api/crypto#keyobjectexportoptions).
    - `privateKeyEncoding`: [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Vedere [`keyObject.export()`](/it/nodejs/api/crypto#keyobjectexportoptions).


- `callback`: [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err`: [\<Errore\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `publicKey`: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<KeyObject\>](/it/nodejs/api/crypto#class-keyobject)
    - `privateKey`: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<KeyObject\>](/it/nodejs/api/crypto#class-keyobject)



Genera una nuova coppia di chiavi asimmetriche del `type` specificato. Attualmente sono supportati RSA, RSA-PSS, DSA, EC, Ed25519, Ed448, X25519, X448 e DH.

Se è stato specificato `publicKeyEncoding` o `privateKeyEncoding`, questa funzione si comporta come se [`keyObject.export()`](/it/nodejs/api/crypto#keyobjectexportoptions) fosse stato chiamato sul suo risultato. Altrimenti, la rispettiva parte della chiave viene restituita come [`KeyObject`](/it/nodejs/api/crypto#class-keyobject).

Si consiglia di codificare le chiavi pubbliche come `'spki'` e le chiavi private come `'pkcs8'` con crittografia per l'archiviazione a lungo termine:

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
  // Gestire gli errori e utilizzare la coppia di chiavi generata.
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
  // Gestire gli errori e utilizzare la coppia di chiavi generata.
});
```
:::

Al completamento, `callback` verrà chiamato con `err` impostato su `undefined` e `publicKey` / `privateKey` che rappresentano la coppia di chiavi generata.

Se questo metodo viene invocato come sua versione [`util.promisify()`](/it/nodejs/api/util#utilpromisifyoriginal)ed, restituisce una `Promise` per un `Object` con proprietà `publicKey` e `privateKey`.


### `crypto.generateKeyPairSync(type, options)` {#cryptogeneratekeypairsynctype-options}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v16.10.0 | Aggiunta la possibilità di definire i parametri di sequenza `RSASSA-PSS-params` per le coppie di chiavi RSA-PSS. |
| v13.9.0, v12.17.0 | Aggiunto il supporto per Diffie-Hellman. |
| v12.0.0 | Aggiunto il supporto per le coppie di chiavi RSA-PSS. |
| v12.0.0 | Aggiunta la possibilità di generare coppie di chiavi X25519 e X448. |
| v12.0.0 | Aggiunta la possibilità di generare coppie di chiavi Ed25519 e Ed448. |
| v11.6.0 | Le funzioni `generateKeyPair` e `generateKeyPairSync` ora producono oggetti chiave se non è stata specificata alcuna codifica. |
| v10.12.0 | Aggiunto in: v10.12.0 |
:::

- `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve essere `'rsa'`, `'rsa-pss'`, `'dsa'`, `'ec'`, `'ed25519'`, `'ed448'`, `'x25519'`, `'x448'` o `'dh'`.
- `options`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `modulusLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Dimensione della chiave in bit (RSA, DSA).
    - `publicExponent`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Esponente pubblico (RSA). **Predefinito:** `0x10001`.
    - `hashAlgorithm`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome del message digest (RSA-PSS).
    - `mgf1HashAlgorithm`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome del message digest utilizzato da MGF1 (RSA-PSS).
    - `saltLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Lunghezza minima del salt in byte (RSA-PSS).
    - `divisorLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Dimensione di `q` in bit (DSA).
    - `namedCurve`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome della curva da utilizzare (EC).
    - `prime`: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) Il parametro prime (DH).
    - `primeLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Lunghezza del prime in bit (DH).
    - `generator`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Generatore personalizzato (DH). **Predefinito:** `2`.
    - `groupName`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome del gruppo Diffie-Hellman (DH). Vedi [`crypto.getDiffieHellman()`](/it/nodejs/api/crypto#cryptogetdiffiehellmangroupname).
    - `paramEncoding`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve essere `'named'` o `'explicit'` (EC). **Predefinito:** `'named'`.
    - `publicKeyEncoding`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Vedi [`keyObject.export()`](/it/nodejs/api/crypto#keyobjectexportoptions).
    - `privateKeyEncoding`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Vedi [`keyObject.export()`](/it/nodejs/api/crypto#keyobjectexportoptions).
  
 
- Restituisce: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `publicKey`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<KeyObject\>](/it/nodejs/api/crypto#class-keyobject)
    - `privateKey`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<KeyObject\>](/it/nodejs/api/crypto#class-keyobject)
  
 

Genera una nuova coppia di chiavi asimmetriche del `type` specificato. RSA, RSA-PSS, DSA, EC, Ed25519, Ed448, X25519, X448 e DH sono attualmente supportati.

Se è stata specificata una `publicKeyEncoding` o `privateKeyEncoding`, questa funzione si comporta come se [`keyObject.export()`](/it/nodejs/api/crypto#keyobjectexportoptions) fosse stata chiamata sul suo risultato. Altrimenti, la rispettiva parte della chiave viene restituita come [`KeyObject`](/it/nodejs/api/crypto#class-keyobject).

Quando si codificano le chiavi pubbliche, si consiglia di utilizzare `'spki'`. Quando si codificano le chiavi private, si consiglia di utilizzare `'pkcs8'` con una passphrase robusta e di mantenere riservata la passphrase.



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

Il valore restituito `{ publicKey, privateKey }` rappresenta la coppia di chiavi generata. Quando è stata selezionata la codifica PEM, la chiave corrispondente sarà una stringa, altrimenti sarà un buffer contenente i dati codificati come DER.


### `crypto.generateKeySync(type, options)` {#cryptogeneratekeysynctype-options}

**Aggiunto in: v15.0.0**

- `type`: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'uso previsto della chiave segreta generata. I valori attualmente accettati sono `'hmac'` e `'aes'`.
- `options`: [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `length`: [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La lunghezza in bit della chiave da generare.
    - Se `type` è `'hmac'`, il minimo è 8 e la lunghezza massima è 2-1. Se il valore non è un multiplo di 8, la chiave generata verrà troncata a `Math.floor(length / 8)`.
    - Se `type` è `'aes'`, la lunghezza deve essere una tra `128`, `192` o `256`.




- Restituisce: [\<KeyObject\>](/it/nodejs/api/crypto#class-keyobject)

Genera sincronicamente una nuova chiave segreta casuale della `length` specificata. Il `type` determinerà quali validazioni verranno eseguite sulla `length`.

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

La dimensione di una chiave HMAC generata non deve superare la dimensione del blocco della funzione hash sottostante. Vedere [`crypto.createHmac()`](/it/nodejs/api/crypto#cryptocreatehmacalgorithm-key-options) per maggiori informazioni.

### `crypto.generatePrime(size[, options[, callback]])` {#cryptogenerateprimesize-options-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare una callback non valida all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v15.8.0 | Aggiunto in: v15.8.0 |
:::

- `size` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La dimensione (in bit) del numero primo da generare.
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `add` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
    - `rem` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
    - `safe` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Predefinito:** `false`.
    - `bigint` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, il numero primo generato viene restituito come un `bigint`.


- `callback` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Errore\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `prime` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)



Genera un numero primo pseudocasuale di `size` bit.

Se `options.safe` è `true`, il numero primo sarà un numero primo sicuro, ovvero `(prime - 1) / 2` sarà anche un numero primo.

I parametri `options.add` e `options.rem` possono essere utilizzati per imporre requisiti aggiuntivi, ad esempio per Diffie-Hellman:

- Se `options.add` e `options.rem` sono entrambi impostati, il numero primo soddisferà la condizione `prime % add = rem`.
- Se è impostato solo `options.add` e `options.safe` non è `true`, il numero primo soddisferà la condizione `prime % add = 1`.
- Se è impostato solo `options.add` e `options.safe` è impostato su `true`, il numero primo soddisferà invece la condizione `prime % add = 3`. Ciò è necessario perché `prime % add = 1` per `options.add \> 2` contraddirebbe la condizione imposta da `options.safe`.
- `options.rem` viene ignorato se `options.add` non è specificato.

Sia `options.add` che `options.rem` devono essere codificati come sequenze big-endian se forniti come `ArrayBuffer`, `SharedArrayBuffer`, `TypedArray`, `Buffer` o `DataView`.

Per impostazione predefinita, il numero primo è codificato come una sequenza big-endian di ottetti in un [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer). Se l'opzione `bigint` è `true`, viene fornito un [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt).


### `crypto.generatePrimeSync(size[, options])` {#cryptogenerateprimesyncsize-options}

**Aggiunto in: v15.8.0**

- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La dimensione (in bit) del numero primo da generare.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `add` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
    - `rem` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
    - `safe` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Predefinito:** `false`.
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, il numero primo generato viene restituito come un `bigint`.


- Restituisce: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Genera un numero primo pseudocasuale di `size` bit.

Se `options.safe` è `true`, il numero primo sarà un numero primo sicuro, ovvero `(prime - 1) / 2` sarà anche un numero primo.

I parametri `options.add` e `options.rem` possono essere utilizzati per imporre requisiti aggiuntivi, ad esempio, per Diffie-Hellman:

- Se `options.add` e `options.rem` sono entrambi impostati, il numero primo soddisferà la condizione che `prime % add = rem`.
- Se è impostato solo `options.add` e `options.safe` non è `true`, il numero primo soddisferà la condizione che `prime % add = 1`.
- Se è impostato solo `options.add` e `options.safe` è impostato su `true`, il numero primo soddisferà invece la condizione che `prime % add = 3`. Questo è necessario perché `prime % add = 1` per `options.add \> 2` contraddirebbe la condizione imposta da `options.safe`.
- `options.rem` viene ignorato se `options.add` non viene fornito.

Sia `options.add` che `options.rem` devono essere codificati come sequenze big-endian se forniti come `ArrayBuffer`, `SharedArrayBuffer`, `TypedArray`, `Buffer` o `DataView`.

Per impostazione predefinita, il numero primo viene codificato come una sequenza big-endian di ottetti in un [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer). Se l'opzione `bigint` è `true`, viene fornito un [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt).


### `crypto.getCipherInfo(nameOrNid[, options])` {#cryptogetcipherinfonameornid-options}

**Aggiunto in: v15.0.0**

- `nameOrNid`: [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il nome o nid della cifra da interrogare.
- `options`: [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `keyLength`: [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Una lunghezza della chiave di prova.
    - `ivLength`: [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Una lunghezza IV di prova.
  
 
- Restituisce: [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `name` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il nome della cifra
    - `nid` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il nid della cifra
    - `blockSize` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La dimensione del blocco della cifra in byte. Questa proprietà viene omessa quando `mode` è `'stream'`.
    - `ivLength` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La lunghezza del vettore di inizializzazione prevista o predefinita in byte. Questa proprietà viene omessa se la cifra non utilizza un vettore di inizializzazione.
    - `keyLength` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La lunghezza della chiave prevista o predefinita in byte.
    - `mode` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La modalità di cifratura. Uno tra `'cbc'`, `'ccm'`, `'cfb'`, `'ctr'`, `'ecb'`, `'gcm'`, `'ocb'`, `'ofb'`, `'stream'`, `'wrap'`, `'xts'`.
  
 

Restituisce informazioni su una determinata cifra.

Alcune cifre accettano chiavi e vettori di inizializzazione di lunghezza variabile. Per impostazione predefinita, il metodo `crypto.getCipherInfo()` restituirà i valori predefiniti per queste cifre. Per verificare se una determinata lunghezza della chiave o lunghezza iv è accettabile per una determinata cifra, utilizzare le opzioni `keyLength` e `ivLength`. Se i valori forniti non sono accettabili, verrà restituito `undefined`.


### `crypto.getCiphers()` {#cryptogetciphers}

**Aggiunto in: v0.9.3**

- Restituisce: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un array con i nomi degli algoritmi di cifratura supportati.

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

**Aggiunto in: v2.3.0**

- Restituisce: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un array con i nomi delle curve ellittiche supportate.

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

**Aggiunto in: v0.7.5**

- `groupName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Restituisce: [\<DiffieHellmanGroup\>](/it/nodejs/api/crypto#class-diffiehellmangroup)

Crea un oggetto di scambio di chiavi `DiffieHellmanGroup` predefinito. I gruppi supportati sono elencati nella documentazione per [`DiffieHellmanGroup`](/it/nodejs/api/crypto#class-diffiehellmangroup).

L'oggetto restituito simula l'interfaccia degli oggetti creati da [`crypto.createDiffieHellman()`](/it/nodejs/api/crypto#cryptocreatediffiehellmanprime-primeencoding-generator-generatorencoding), ma non consentirà la modifica delle chiavi (con [`diffieHellman.setPublicKey()`](/it/nodejs/api/crypto#diffiehellmansetpublickeypublickey-encoding), ad esempio). Il vantaggio dell'utilizzo di questo metodo è che le parti non devono generare né scambiare un modulo di gruppo in anticipo, risparmiando sia il tempo del processore che quello di comunicazione.

Esempio (ottenere un segreto condiviso):

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

/* aliceSecret e bobSecret dovrebbero essere uguali */
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

/* aliceSecret e bobSecret dovrebbero essere uguali */
console.log(aliceSecret === bobSecret);
```
:::


### `crypto.getFips()` {#cryptogetfips}

**Aggiunto in: v10.0.0**

- Restituisce: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `1` se e solo se è attualmente in uso un provider di crittografia conforme a FIPS, `0` altrimenti. Una futura release semver-major potrebbe modificare il tipo di ritorno di questa API in un [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type).

### `crypto.getHashes()` {#cryptogethashes}

**Aggiunto in: v0.9.3**

- Restituisce: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un array dei nomi degli algoritmi hash supportati, come `'RSA-SHA256'`. Gli algoritmi hash sono anche chiamati algoritmi "digest".



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

**Aggiunto in: v17.4.0**

- `typedArray` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
- Restituisce: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) Restituisce `typedArray`.

Un comodo alias per [`crypto.webcrypto.getRandomValues()`](/it/nodejs/api/webcrypto#cryptogetrandomvaluestypedarray). Questa implementazione non è conforme alla specifica Web Crypto, per scrivere codice compatibile con il web utilizzare invece [`crypto.webcrypto.getRandomValues()`](/it/nodejs/api/webcrypto#cryptogetrandomvaluestypedarray).


### `crypto.hash(algorithm, data[, outputEncoding])` {#cryptohashalgorithm-data-outputencoding}

**Aggiunto in: v21.7.0, v20.12.0**

::: warning [Stabile: 1 - Sperimentale]
[Stabile: 1](/it/nodejs/api/documentation#stability-index) [Stabilità: 1](/it/nodejs/api/documentation#stability-index).2 - Candidato al rilascio
:::

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Quando `data` è una stringa, verrà codificata come UTF-8 prima di essere sottoposta a hashing. Se si desidera una codifica di input diversa per un input di stringa, l'utente può codificare la stringa in un `TypedArray` utilizzando `TextEncoder` o `Buffer.from()` e passare il `TypedArray` codificato a questa API.
- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)  [Codifica](/it/nodejs/api/buffer#buffers-and-character-encodings) utilizzata per codificare il digest restituito. **Predefinito:** `'hex'`.
- Restituisce: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer)

Un'utilità per creare digest hash one-shot dei dati. Può essere più veloce di `crypto.createHash()` basato su oggetti quando si esegue l'hashing di una quantità minore di dati (\<= 5 MB) che è prontamente disponibile. Se i dati possono essere grandi o se vengono trasmessi in streaming, si consiglia comunque di utilizzare `crypto.createHash()` invece.

L'`algorithm` dipende dagli algoritmi disponibili supportati dalla versione di OpenSSL sulla piattaforma. Gli esempi sono `'sha256'`, `'sha512'`, ecc. Nelle versioni recenti di OpenSSL, `openssl list -digest-algorithms` visualizzerà gli algoritmi di digest disponibili.

Esempio:

::: code-group
```js [CJS]
const crypto = require('node:crypto');
const { Buffer } = require('node:buffer');

// Esegue l'hashing di una stringa e restituisce il risultato come una stringa con codifica esadecimale.
const string = 'Node.js';
// 10b3493287f831e81a438811a1ffba01f8cec4b7
console.log(crypto.hash('sha1', string));

// Codifica una stringa con codifica base64 in un Buffer, la sottopone a hashing e restituisce
// il risultato come buffer.
const base64 = 'Tm9kZS5qcw==';
// <Buffer 10 b3 49 32 87 f8 31 e8 1a 43 88 11 a1 ff ba 01 f8 ce c4 b7>
console.log(crypto.hash('sha1', Buffer.from(base64, 'base64'), 'buffer'));
```

```js [ESM]
import crypto from 'node:crypto';
import { Buffer } from 'node:buffer';

// Esegue l'hashing di una stringa e restituisce il risultato come una stringa con codifica esadecimale.
const string = 'Node.js';
// 10b3493287f831e81a438811a1ffba01f8cec4b7
console.log(crypto.hash('sha1', string));

// Codifica una stringa con codifica base64 in un Buffer, la sottopone a hashing e restituisce
// il risultato come buffer.
const base64 = 'Tm9kZS5qcw==';
// <Buffer 10 b3 49 32 87 f8 31 e8 1a 43 88 11 a1 ff ba 01 f8 ce c4 b7>
console.log(crypto.hash('sha1', Buffer.from(base64, 'base64'), 'buffer'));
```
:::


### `crypto.hkdf(digest, ikm, salt, info, keylen, callback)` {#cryptohkdfdigest-ikm-salt-info-keylen-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare un callback non valido all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v18.8.0, v16.18.0 | Il materiale di chiave di input ora può essere di lunghezza zero. |
| v15.0.0 | Aggiunto in: v15.0.0 |
:::

- `digest` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'algoritmo di digest da utilizzare.
- `ikm` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/it/nodejs/api/crypto#class-keyobject) Il materiale di chiave di input. Deve essere fornito ma può essere di lunghezza zero.
- `salt` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Il valore salt. Deve essere fornito ma può essere di lunghezza zero.
- `info` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Valore info aggiuntivo. Deve essere fornito ma può essere di lunghezza zero e non può superare i 1024 byte.
- `keylen` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La lunghezza della chiave da generare. Deve essere maggiore di 0. Il valore massimo consentito è `255` volte il numero di byte prodotti dalla funzione di digest selezionata (ad es. `sha512` genera hash di 64 byte, rendendo l'output HKDF massimo di 16320 byte).
- `callback` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Errore\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `derivedKey` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)



HKDF è una semplice funzione di derivazione della chiave definita in RFC 5869. Gli elementi `ikm`, `salt` e `info` forniti vengono utilizzati con il `digest` per derivare una chiave di `keylen` byte.

La funzione `callback` fornita viene chiamata con due argomenti: `err` e `derivedKey`. Se si verifica un errore durante la derivazione della chiave, `err` verrà impostato; altrimenti `err` sarà `null`. La `derivedKey` generata correttamente verrà passata al callback come un [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer). Verrà generato un errore se uno degli argomenti di input specifica valori o tipi non validi.

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

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.8.0, v16.18.0 | Il materiale di keying in ingresso ora può avere lunghezza zero. |
| v15.0.0 | Aggiunto in: v15.0.0 |
:::

- `digest` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'algoritmo di digest da utilizzare.
- `ikm` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/it/nodejs/api/crypto#class-keyobject) Il materiale di keying in ingresso. Deve essere fornito ma può avere lunghezza zero.
- `salt` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Il valore salt. Deve essere fornito ma può avere lunghezza zero.
- `info` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Valore info aggiuntivo. Deve essere fornito ma può avere lunghezza zero e non può superare i 1024 byte.
- `keylen` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La lunghezza della chiave da generare. Deve essere maggiore di 0. Il valore massimo consentito è `255` volte il numero di byte prodotti dalla funzione di digest selezionata (ad esempio, `sha512` genera hash di 64 byte, rendendo l'output HKDF massimo di 16320 byte).
- Restituisce: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

Fornisce una funzione di derivazione di chiavi HKDF sincrona come definita in RFC 5869. I dati `ikm`, `salt` e `info` forniti vengono utilizzati con il `digest` per derivare una chiave di `keylen` byte.

La `derivedKey` generata correttamente verrà restituita come un [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer).

Verrà generato un errore se uno qualsiasi degli argomenti di input specifica valori o tipi non validi, o se la chiave derivata non può essere generata.

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

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare un callback non valido all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v15.0.0 | Gli argomenti password e salt possono anche essere istanze di ArrayBuffer. |
| v14.0.0 | Il parametro `iterations` è ora limitato a valori positivi. Le versioni precedenti trattavano altri valori come uno. |
| v8.0.0 | Il parametro `digest` è ora sempre richiesto. |
| v6.0.0 | Chiamare questa funzione senza passare il parametro `digest` è ora deprecato ed emetterà un avviso. |
| v6.0.0 | La codifica predefinita per `password` se è una stringa è cambiata da `binary` a `utf8`. |
| v0.5.5 | Aggiunto in: v0.5.5 |
:::

- `password` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `salt` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `iterations` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `keylen` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `digest` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Errore\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `derivedKey` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer)

Fornisce un'implementazione asincrona della Password-Based Key Derivation Function 2 (PBKDF2). Un algoritmo di digest HMAC selezionato specificato da `digest` viene applicato per derivare una chiave della lunghezza in byte richiesta (`keylen`) dalla `password`, dal `salt` e da `iterations`.

La funzione `callback` fornita viene chiamata con due argomenti: `err` e `derivedKey`. Se si verifica un errore durante la derivazione della chiave, `err` verrà impostato; altrimenti `err` sarà `null`. Per impostazione predefinita, la `derivedKey` generata correttamente verrà passata al callback come un [`Buffer`](/it/nodejs/api/buffer). Verrà generato un errore se uno qualsiasi degli argomenti di input specifica valori o tipi non validi.

L'argomento `iterations` deve essere un numero impostato il più alto possibile. Più alto è il numero di iterazioni, più sicura sarà la chiave derivata, ma richiederà più tempo per essere completata.

Il `salt` dovrebbe essere il più univoco possibile. Si raccomanda che un salt sia casuale e lungo almeno 16 byte. Vedi [NIST SP 800-132](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-132.pdf) per i dettagli.

Quando si passano stringhe per `password` o `salt`, si prega di considerare [avvertenze quando si utilizzano stringhe come input per le API crittografiche](/it/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis).

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

Un array di funzioni di digest supportate può essere recuperato utilizzando [`crypto.getHashes()`](/it/nodejs/api/crypto#cryptogethashes).

Questa API utilizza il threadpool di libuv, che può avere implicazioni sulle prestazioni sorprendenti e negative per alcune applicazioni; consultare la documentazione di [`UV_THREADPOOL_SIZE`](/it/nodejs/api/cli#uv_threadpool_sizesize) per ulteriori informazioni.


### `crypto.pbkdf2Sync(password, salt, iterations, keylen, digest)` {#cryptopbkdf2syncpassword-salt-iterations-keylen-digest}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v14.0.0 | Il parametro `iterations` è ora limitato a valori positivi. Le versioni precedenti trattavano altri valori come uno. |
| v6.0.0 | Chiamare questa funzione senza passare il parametro `digest` è ora deprecato ed emetterà un avviso. |
| v6.0.0 | La codifica predefinita per `password` se è una stringa è cambiata da `binary` a `utf8`. |
| v0.9.3 | Aggiunto in: v0.9.3 |
:::

- `password` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `salt` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `iterations` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `keylen` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `digest` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Restituisce: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer)

Fornisce un'implementazione sincrona della funzione di derivazione della chiave basata su password 2 (PBKDF2). Un algoritmo di digest HMAC selezionato specificato da `digest` viene applicato per derivare una chiave della lunghezza in byte richiesta (`keylen`) dalla `password`, dal `salt` e dalle `iterations`.

Se si verifica un errore, verrà generato un `Error`, altrimenti la chiave derivata verrà restituita come [`Buffer`](/it/nodejs/api/buffer).

L'argomento `iterations` deve essere un numero impostato il più alto possibile. Maggiore è il numero di iterazioni, più sicura sarà la chiave derivata, ma richiederà più tempo per essere completata.

Il `salt` dovrebbe essere il più unico possibile. Si consiglia che un salt sia casuale e lungo almeno 16 byte. Vedi [NIST SP 800-132](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-132.pdf) per i dettagli.

Quando si passano stringhe per `password` o `salt`, si prega di considerare [avvertenze quando si usano stringhe come input per le API crittografiche](/it/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis).

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

Un array di funzioni digest supportate può essere recuperato utilizzando [`crypto.getHashes()`](/it/nodejs/api/crypto#cryptogethashes).


### `crypto.privateDecrypt(privateKey, buffer)` {#cryptoprivatedecryptprivatekey-buffer}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v21.6.2, v20.11.1, v18.19.1 | Il padding `RSA_PKCS1_PADDING` è stato disabilitato a meno che la build di OpenSSL supporti il rifiuto implicito. |
| v15.0.0 | Aggiunti stringa, ArrayBuffer e CryptoKey come tipi di chiave consentiti. oaepLabel può essere un ArrayBuffer. Il buffer può essere una stringa o un ArrayBuffer. Tutti i tipi che accettano buffer sono limitati a un massimo di 2 ** 31 - 1 byte. |
| v12.11.0 | Aggiunta l'opzione `oaepLabel`. |
| v12.9.0 | Aggiunta l'opzione `oaepHash`. |
| v11.6.0 | Questa funzione ora supporta gli oggetti chiave. |
| v0.11.14 | Aggiunta in: v0.11.14 |
:::

- `privateKey` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/it/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/it/nodejs/api/webcrypto#class-cryptokey)
    - `oaepHash` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La funzione hash da utilizzare per il padding OAEP e MGF1. **Predefinito:** `'sha1'`
    - `oaepLabel` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) L'etichetta da utilizzare per il padding OAEP. Se non specificato, non viene utilizzata alcuna etichetta.
    - `padding` [\<crypto.constants\>](/it/nodejs/api/crypto#cryptoconstants) Un valore di padding opzionale definito in `crypto.constants`, che può essere: `crypto.constants.RSA_NO_PADDING`, `crypto.constants.RSA_PKCS1_PADDING` o `crypto.constants.RSA_PKCS1_OAEP_PADDING`.
  
 
- `buffer` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- Restituisce: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) Un nuovo `Buffer` con il contenuto decrittografato.

Decrittografa `buffer` con `privateKey`. `buffer` è stato precedentemente crittografato utilizzando la chiave pubblica corrispondente, ad esempio utilizzando [`crypto.publicEncrypt()`](/it/nodejs/api/crypto#cryptopublicencryptkey-buffer).

Se `privateKey` non è un [`KeyObject`](/it/nodejs/api/crypto#class-keyobject), questa funzione si comporta come se `privateKey` fosse stato passato a [`crypto.createPrivateKey()`](/it/nodejs/api/crypto#cryptocreateprivatekeykey). Se è un oggetto, è possibile passare la proprietà `padding`. Altrimenti, questa funzione utilizza `RSA_PKCS1_OAEP_PADDING`.

L'utilizzo di `crypto.constants.RSA_PKCS1_PADDING` in [`crypto.privateDecrypt()`](/it/nodejs/api/crypto#cryptoprivatedecryptprivatekey-buffer) richiede che OpenSSL supporti il rifiuto implicito (`rsa_pkcs1_implicit_rejection`). Se la versione di OpenSSL utilizzata da Node.js non supporta questa funzionalità, il tentativo di utilizzare `RSA_PKCS1_PADDING` non riuscirà.


### `crypto.privateEncrypt(privateKey, buffer)` {#cryptoprivateencryptprivatekey-buffer}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v15.0.0 | Aggiunti string, ArrayBuffer e CryptoKey come tipi di chiave consentiti. La passphrase può essere un ArrayBuffer. Il buffer può essere una string o ArrayBuffer. Tutti i tipi che accettano buffer sono limitati a un massimo di 2 ** 31 - 1 byte. |
| v11.6.0 | Questa funzione ora supporta oggetti chiave. |
| v1.1.0 | Aggiunto in: v1.1.0 |
:::

- `privateKey` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/it/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/it/nodejs/api/webcrypto#class-cryptokey)
    - `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/it/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/it/nodejs/api/webcrypto#class-cryptokey) Una chiave privata con codifica PEM.
    - `passphrase` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Una passphrase opzionale per la chiave privata.
    - `padding` [\<crypto.constants\>](/it/nodejs/api/crypto#cryptoconstants) Un valore di padding opzionale definito in `crypto.constants`, che può essere: `crypto.constants.RSA_NO_PADDING` o `crypto.constants.RSA_PKCS1_PADDING`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La codifica della stringa da utilizzare quando `buffer`, `key` o `passphrase` sono stringhe.


- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- Restituisce: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) Un nuovo `Buffer` con il contenuto crittografato.

Crittografa `buffer` con `privateKey`. I dati restituiti possono essere decrittografati utilizzando la chiave pubblica corrispondente, ad esempio utilizzando [`crypto.publicDecrypt()`](/it/nodejs/api/crypto#cryptopublicdecryptkey-buffer).

Se `privateKey` non è un [`KeyObject`](/it/nodejs/api/crypto#class-keyobject), questa funzione si comporta come se `privateKey` fosse stato passato a [`crypto.createPrivateKey()`](/it/nodejs/api/crypto#cryptocreateprivatekeykey). Se è un oggetto, è possibile passare la proprietà `padding`. Altrimenti, questa funzione utilizza `RSA_PKCS1_PADDING`.


### `crypto.publicDecrypt(key, buffer)` {#cryptopublicdecryptkey-buffer}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v15.0.0 | Aggiunti stringa, ArrayBuffer e CryptoKey come tipi di chiave consentiti. La passphrase può essere un ArrayBuffer. Il buffer può essere una stringa o un ArrayBuffer. Tutti i tipi che accettano buffer sono limitati a un massimo di 2 ** 31 - 1 byte. |
| v11.6.0 | Questa funzione ora supporta gli oggetti chiave. |
| v1.1.0 | Aggiunto in: v1.1.0 |
:::

- `key` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/it/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/it/nodejs/api/webcrypto#class-cryptokey)
    - `passphrase` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Una passphrase opzionale per la chiave privata.
    - `padding` [\<crypto.constants\>](/it/nodejs/api/crypto#cryptoconstants) Un valore di padding opzionale definito in `crypto.constants`, che può essere: `crypto.constants.RSA_NO_PADDING` o `crypto.constants.RSA_PKCS1_PADDING`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La codifica della stringa da utilizzare quando `buffer`, `key` o `passphrase` sono stringhe.

- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- Restituisce: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) Un nuovo `Buffer` con il contenuto decrittografato.

Decrittografa `buffer` con `key`. `buffer` è stato precedentemente crittografato usando la chiave privata corrispondente, ad esempio usando [`crypto.privateEncrypt()`](/it/nodejs/api/crypto#cryptoprivateencryptprivatekey-buffer).

Se `key` non è un [`KeyObject`](/it/nodejs/api/crypto#class-keyobject), questa funzione si comporta come se `key` fosse stato passato a [`crypto.createPublicKey()`](/it/nodejs/api/crypto#cryptocreatepublickeykey). Se è un oggetto, è possibile passare la proprietà `padding`. Altrimenti, questa funzione usa `RSA_PKCS1_PADDING`.

Poiché le chiavi pubbliche RSA possono essere derivate da chiavi private, è possibile passare una chiave privata invece di una chiave pubblica.


### `crypto.publicEncrypt(key, buffer)` {#cryptopublicencryptkey-buffer}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v15.0.0 | Aggiunti string, ArrayBuffer e CryptoKey come tipi di chiave consentiti. oaepLabel e passphrase possono essere ArrayBuffer. Il buffer può essere una stringa o ArrayBuffer. Tutti i tipi che accettano buffer sono limitati a un massimo di 2 ** 31 - 1 byte. |
| v12.11.0 | Aggiunta l'opzione `oaepLabel`. |
| v12.9.0 | Aggiunta l'opzione `oaepHash`. |
| v11.6.0 | Questa funzione ora supporta oggetti chiave. |
| v0.11.14 | Aggiunto in: v0.11.14 |
:::

- `key` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/it/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/it/nodejs/api/webcrypto#class-cryptokey)
    - `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/it/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/it/nodejs/api/webcrypto#class-cryptokey) Una chiave pubblica o privata codificata PEM, [\<KeyObject\>](/it/nodejs/api/crypto#class-keyobject), o [\<CryptoKey\>](/it/nodejs/api/webcrypto#class-cryptokey).
    - `oaepHash` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La funzione hash da utilizzare per il riempimento OAEP e MGF1. **Predefinito:** `'sha1'`
    - `oaepLabel` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) L'etichetta da utilizzare per il riempimento OAEP. Se non specificato, non viene utilizzata alcuna etichetta.
    - `passphrase` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Una passphrase opzionale per la chiave privata.
    - `padding` [\<crypto.constants\>](/it/nodejs/api/crypto#cryptoconstants) Un valore di riempimento opzionale definito in `crypto.constants`, che può essere: `crypto.constants.RSA_NO_PADDING`, `crypto.constants.RSA_PKCS1_PADDING`, o `crypto.constants.RSA_PKCS1_OAEP_PADDING`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La codifica della stringa da utilizzare quando `buffer`, `key`, `oaepLabel` o `passphrase` sono stringhe.

- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- Restituisce: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) Un nuovo `Buffer` con il contenuto crittografato.

Crittografa il contenuto di `buffer` con `key` e restituisce un nuovo [`Buffer`](/it/nodejs/api/buffer) con contenuto crittografato. I dati restituiti possono essere decrittografati utilizzando la chiave privata corrispondente, ad esempio utilizzando [`crypto.privateDecrypt()`](/it/nodejs/api/crypto#cryptoprivatedecryptprivatekey-buffer).

Se `key` non è un [`KeyObject`](/it/nodejs/api/crypto#class-keyobject), questa funzione si comporta come se `key` fosse stato passato a [`crypto.createPublicKey()`](/it/nodejs/api/crypto#cryptocreatepublickeykey). Se è un oggetto, la proprietà `padding` può essere passata. Altrimenti, questa funzione utilizza `RSA_PKCS1_OAEP_PADDING`.

Poiché le chiavi pubbliche RSA possono essere derivate da chiavi private, una chiave privata può essere passata invece di una chiave pubblica.


### `crypto.randomBytes(size[, callback])` {#cryptorandombytessize-callback}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare una callback non valida all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v9.0.0 | Passare `null` come argomento `callback` ora genera `ERR_INVALID_CALLBACK`. |
| v0.5.8 | Aggiunto in: v0.5.8 |
:::

- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di byte da generare. `size` non deve essere maggiore di `2**31 - 1`.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `buf` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer)
  
 
- Restituisce: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) se la funzione `callback` non viene fornita.

Genera dati pseudocasuali crittograficamente robusti. L'argomento `size` è un numero che indica il numero di byte da generare.

Se viene fornita una funzione `callback`, i byte vengono generati in modo asincrono e la funzione `callback` viene richiamata con due argomenti: `err` e `buf`. Se si verifica un errore, `err` sarà un oggetto `Error`; altrimenti è `null`. L'argomento `buf` è un [`Buffer`](/it/nodejs/api/buffer) contenente i byte generati.



::: code-group
```js [ESM]
// Asincrono
const {
  randomBytes,
} = await import('node:crypto');

randomBytes(256, (err, buf) => {
  if (err) throw err;
  console.log(`${buf.length} byte di dati casuali: ${buf.toString('hex')}`);
});
```

```js [CJS]
// Asincrono
const {
  randomBytes,
} = require('node:crypto');

randomBytes(256, (err, buf) => {
  if (err) throw err;
  console.log(`${buf.length} byte di dati casuali: ${buf.toString('hex')}`);
});
```
:::

Se la funzione `callback` non viene fornita, i byte casuali vengono generati in modo sincrono e restituiti come [`Buffer`](/it/nodejs/api/buffer). Verrà generato un errore se si verifica un problema durante la generazione dei byte.



::: code-group
```js [ESM]
// Sincrono
const {
  randomBytes,
} = await import('node:crypto');

const buf = randomBytes(256);
console.log(
  `${buf.length} byte di dati casuali: ${buf.toString('hex')}`);
```

```js [CJS]
// Sincrono
const {
  randomBytes,
} = require('node:crypto');

const buf = randomBytes(256);
console.log(
  `${buf.length} byte di dati casuali: ${buf.toString('hex')}`);
```
:::

Il metodo `crypto.randomBytes()` non verrà completato finché non sarà disponibile sufficiente entropia. Normalmente questo non dovrebbe mai richiedere più di pochi millisecondi. L'unico momento in cui la generazione dei byte casuali potrebbe teoricamente bloccarsi per un periodo di tempo più lungo è subito dopo l'avvio, quando l'intero sistema è ancora a corto di entropia.

Questa API utilizza il threadpool di libuv, che può avere implicazioni prestazionali sorprendenti e negative per alcune applicazioni; vedere la documentazione [`UV_THREADPOOL_SIZE`](/it/nodejs/api/cli#uv_threadpool_sizesize) per maggiori informazioni.

La versione asincrona di `crypto.randomBytes()` viene eseguita in una singola richiesta threadpool. Per ridurre al minimo la variazione della lunghezza dell'attività threadpool, partiziona le richieste `randomBytes` di grandi dimensioni quando lo fai come parte dell'adempimento di una richiesta del client.


### `crypto.randomFill(buffer[, offset][, size], callback)` {#cryptorandomfillbuffer-offset-size-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare una callback non valida all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v9.0.0 | L'argomento `buffer` può essere qualsiasi `TypedArray` o `DataView`. |
| v7.10.0, v6.13.0 | Aggiunto in: v7.10.0, v6.13.0 |
:::

- `buffer` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Deve essere fornito. La dimensione del `buffer` fornito non deve essere maggiore di `2**31 - 1`.
- `offset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `0`
- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `buffer.length - offset`. La `size` non deve essere maggiore di `2**31 - 1`.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `function(err, buf) {}`.

Questa funzione è simile a [`crypto.randomBytes()`](/it/nodejs/api/crypto#cryptorandombytessize-callback) ma richiede che il primo argomento sia un [`Buffer`](/it/nodejs/api/buffer) che verrà riempito. Richiede inoltre che venga passata una callback.

Se la funzione `callback` non viene fornita, verrà generato un errore.

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

Qualsiasi istanza di `ArrayBuffer`, `TypedArray` o `DataView` può essere passata come `buffer`.

Sebbene ciò includa le istanze di `Float32Array` e `Float64Array`, questa funzione non deve essere utilizzata per generare numeri a virgola mobile casuali. Il risultato può contenere `+Infinity`, `-Infinity` e `NaN`, e anche se l'array contiene solo numeri finiti, non sono tratti da una distribuzione casuale uniforme e non hanno limiti inferiori o superiori significativi.

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

Questa API utilizza il threadpool di libuv, che può avere implicazioni sulle prestazioni sorprendenti e negative per alcune applicazioni; consulta la documentazione [`UV_THREADPOOL_SIZE`](/it/nodejs/api/cli#uv_threadpool_sizesize) per ulteriori informazioni.

La versione asincrona di `crypto.randomFill()` viene eseguita in una singola richiesta del threadpool. Per ridurre al minimo la variazione della lunghezza delle attività del threadpool, partiziona le grandi richieste `randomFill` quando lo fai come parte dell'evasione di una richiesta del cliente.


### `crypto.randomFillSync(buffer[, offset][, size])` {#cryptorandomfillsyncbuffer-offset-size}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v9.0.0 | L'argomento `buffer` può essere qualsiasi `TypedArray` o `DataView`. |
| v7.10.0, v6.13.0 | Aggiunto in: v7.10.0, v6.13.0 |
:::

- `buffer` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Deve essere fornito. La dimensione del `buffer` fornito non deve essere maggiore di `2**31 - 1`.
- `offset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `0`
- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Predefinito:** `buffer.length - offset`. La `size` non deve essere maggiore di `2**31 - 1`.
- Restituisce: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) L'oggetto passato come argomento `buffer`.

Versione sincrona di [`crypto.randomFill()`](/it/nodejs/api/crypto#cryptorandomfillbuffer-offset-size-callback).

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const { randomFillSync } = await import('node:crypto');

const buf = Buffer.alloc(10);
console.log(randomFillSync(buf).toString('hex'));

randomFillSync(buf, 5);
console.log(buf.toString('hex'));

// Quanto sopra è equivalente a quanto segue:
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

// Quanto sopra è equivalente a quanto segue:
randomFillSync(buf, 5, 5);
console.log(buf.toString('hex'));
```
:::

Qualsiasi istanza `ArrayBuffer`, `TypedArray` o `DataView` può essere passata come `buffer`.

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

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare una callback non valida all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v14.10.0, v12.19.0 | Aggiunto in: v14.10.0, v12.19.0 |
:::

- `min` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Inizio dell'intervallo casuale (incluso). **Predefinito:** `0`.
- `max` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Fine dell'intervallo casuale (escluso).
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `function(err, n) {}`.

Restituisce un numero intero casuale `n` tale che `min \<= n \< max`. Questa implementazione evita il [modulo bias](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#Modulo_bias).

L'intervallo (`max - min`) deve essere inferiore a 2. `min` e `max` devono essere [safe integers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger).

Se la funzione `callback` non viene fornita, il numero intero casuale viene generato in modo sincrono.

::: code-group
```js [ESM]
// Asincrono
const {
  randomInt,
} = await import('node:crypto');

randomInt(3, (err, n) => {
  if (err) throw err;
  console.log(`Numero casuale scelto da (0, 1, 2): ${n}`);
});
```

```js [CJS]
// Asincrono
const {
  randomInt,
} = require('node:crypto');

randomInt(3, (err, n) => {
  if (err) throw err;
  console.log(`Numero casuale scelto da (0, 1, 2): ${n}`);
});
```
:::

::: code-group
```js [ESM]
// Sincrono
const {
  randomInt,
} = await import('node:crypto');

const n = randomInt(3);
console.log(`Numero casuale scelto da (0, 1, 2): ${n}`);
```

```js [CJS]
// Sincrono
const {
  randomInt,
} = require('node:crypto');

const n = randomInt(3);
console.log(`Numero casuale scelto da (0, 1, 2): ${n}`);
```
:::

::: code-group
```js [ESM]
// Con argomento `min`
const {
  randomInt,
} = await import('node:crypto');

const n = randomInt(1, 7);
console.log(`Il dado ha tirato: ${n}`);
```

```js [CJS]
// Con argomento `min`
const {
  randomInt,
} = require('node:crypto');

const n = randomInt(1, 7);
console.log(`Il dado ha tirato: ${n}`);
```
:::


### `crypto.randomUUID([options])` {#cryptorandomuuidoptions}

**Aggiunto in: v15.6.0, v14.17.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `disableEntropyCache` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Per impostazione predefinita, per migliorare le prestazioni, Node.js genera e memorizza nella cache dati casuali sufficienti per generare fino a 128 UUID casuali. Per generare un UUID senza utilizzare la cache, impostare `disableEntropyCache` su `true`. **Predefinito:** `false`.


- Restituisce: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Genera un UUID casuale versione 4 [RFC 4122](https://www.rfc-editor.org/rfc/rfc4122.txt). L'UUID viene generato utilizzando un generatore di numeri pseudocasuali crittografico.

### `crypto.scrypt(password, salt, keylen[, options], callback)` {#cryptoscryptpassword-salt-keylen-options-callback}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare una callback non valida all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v15.0.0 | Gli argomenti password e salt possono essere anche istanze ArrayBuffer. |
| v12.8.0, v10.17.0 | Il valore `maxmem` ora può essere qualsiasi intero sicuro. |
| v10.9.0 | Sono stati aggiunti i nomi delle opzioni `cost`, `blockSize` e `parallelization`. |
| v10.5.0 | Aggiunto in: v10.5.0 |
:::

- `password` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `salt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `keylen` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cost` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Parametro di costo CPU/memoria. Deve essere una potenza di due maggiore di uno. **Predefinito:** `16384`.
    - `blockSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Parametro dimensione blocco. **Predefinito:** `8`.
    - `parallelization` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Parametro di parallelizzazione. **Predefinito:** `1`.
    - `N` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Alias per `cost`. Solo uno dei due può essere specificato.
    - `r` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Alias per `blockSize`. Solo uno dei due può essere specificato.
    - `p` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Alias per `parallelization`. Solo uno dei due può essere specificato.
    - `maxmem` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Limite superiore di memoria. È un errore quando (approssimativamente) `128 * N * r \> maxmem`. **Predefinito:** `32 * 1024 * 1024`.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `derivedKey` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer)



Fornisce un'implementazione asincrona di [scrypt](https://en.wikipedia.org/wiki/Scrypt). Scrypt è una funzione di derivazione di chiavi basata su password progettata per essere costosa dal punto di vista computazionale e della memoria, al fine di rendere gli attacchi di forza bruta poco gratificanti.

Il `salt` dovrebbe essere il più univoco possibile. Si raccomanda che un salt sia casuale e lungo almeno 16 byte. Vedere [NIST SP 800-132](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-132.pdf) per i dettagli.

Quando si passano stringhe per `password` o `salt`, si prega di considerare [avvertenze quando si utilizzano stringhe come input per le API crittografiche](/it/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis).

La funzione `callback` viene chiamata con due argomenti: `err` e `derivedKey`. `err` è un oggetto eccezione quando la derivazione della chiave fallisce, altrimenti `err` è `null`. `derivedKey` viene passato alla callback come [`Buffer`](/it/nodejs/api/buffer).

Viene generata un'eccezione quando uno qualsiasi degli argomenti di input specifica valori o tipi non validi.



::: code-group
```js [ESM]
const {
  scrypt,
} = await import('node:crypto');

// Utilizzo delle impostazioni predefinite di fabbrica.
scrypt('password', 'salt', 64, (err, derivedKey) => {
  if (err) throw err;
  console.log(derivedKey.toString('hex'));  // '3745e48...08d59ae'
});
// Utilizzo di un parametro N personalizzato. Deve essere una potenza di due.
scrypt('password', 'salt', 64, { N: 1024 }, (err, derivedKey) => {
  if (err) throw err;
  console.log(derivedKey.toString('hex'));  // '3745e48...aa39b34'
});
```

```js [CJS]
const {
  scrypt,
} = require('node:crypto');

// Utilizzo delle impostazioni predefinite di fabbrica.
scrypt('password', 'salt', 64, (err, derivedKey) => {
  if (err) throw err;
  console.log(derivedKey.toString('hex'));  // '3745e48...08d59ae'
});
// Utilizzo di un parametro N personalizzato. Deve essere una potenza di due.
scrypt('password', 'salt', 64, { N: 1024 }, (err, derivedKey) => {
  if (err) throw err;
  console.log(derivedKey.toString('hex'));  // '3745e48...aa39b34'
});
```
:::


### `crypto.scryptSync(password, salt, keylen[, options])` {#cryptoscryptsyncpassword-salt-keylen-options}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v12.8.0, v10.17.0 | Il valore `maxmem` ora può essere qualsiasi intero sicuro. |
| v10.9.0 | Sono stati aggiunti i nomi delle opzioni `cost`, `blockSize` e `parallelization`. |
| v10.5.0 | Aggiunto in: v10.5.0 |
:::

- `password` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `salt` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `keylen` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cost` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Parametro costo CPU/memoria. Deve essere una potenza di due maggiore di uno. **Predefinito:** `16384`.
    - `blockSize` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Parametro dimensione blocco. **Predefinito:** `8`.
    - `parallelization` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Parametro parallelizzazione. **Predefinito:** `1`.
    - `N` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Alias per `cost`. Può essere specificato solo uno dei due.
    - `r` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Alias per `blockSize`. Può essere specificato solo uno dei due.
    - `p` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Alias per `parallelization`. Può essere specificato solo uno dei due.
    - `maxmem` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Limite superiore della memoria. È un errore quando (approssimativamente) `128 * N * r \> maxmem`. **Predefinito:** `32 * 1024 * 1024`.
  
 
- Restituisce: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer)

Fornisce un'implementazione sincrona di [scrypt](https://en.wikipedia.org/wiki/Scrypt). Scrypt è una funzione di derivazione della chiave basata su password progettata per essere costosa dal punto di vista computazionale e della memoria al fine di rendere non gratificanti gli attacchi di forza bruta.

Il `salt` dovrebbe essere il più unico possibile. Si raccomanda che un salt sia casuale e lungo almeno 16 byte. Vedere [NIST SP 800-132](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-132.pdf) per i dettagli.

Quando si passano stringhe per `password` o `salt`, si prega di considerare [avvertenze quando si utilizzano stringhe come input per le API crittografiche](/it/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis).

Viene generata un'eccezione quando la derivazione della chiave fallisce, altrimenti la chiave derivata viene restituita come [`Buffer`](/it/nodejs/api/buffer).

Viene generata un'eccezione quando uno qualsiasi degli argomenti di input specifica valori o tipi non validi.

::: code-group
```js [ESM]
const {
  scryptSync,
} = await import('node:crypto');
// Utilizzo delle impostazioni predefinite di fabbrica.

const key1 = scryptSync('password', 'salt', 64);
console.log(key1.toString('hex'));  // '3745e48...08d59ae'
// Utilizzo di un parametro N personalizzato. Deve essere una potenza di due.
const key2 = scryptSync('password', 'salt', 64, { N: 1024 });
console.log(key2.toString('hex'));  // '3745e48...aa39b34'
```

```js [CJS]
const {
  scryptSync,
} = require('node:crypto');
// Utilizzo delle impostazioni predefinite di fabbrica.

const key1 = scryptSync('password', 'salt', 64);
console.log(key1.toString('hex'));  // '3745e48...08d59ae'
// Utilizzo di un parametro N personalizzato. Deve essere una potenza di due.
const key2 = scryptSync('password', 'salt', 64, { N: 1024 });
console.log(key2.toString('hex'));  // '3745e48...aa39b34'
```
:::


### `crypto.secureHeapUsed()` {#cryptosecureheapused}

**Aggiunto in: v15.6.0**

- Restituisce: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `total` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La dimensione totale dell'heap sicuro allocato come specificato utilizzando il flag della riga di comando `--secure-heap=n`.
    - `min` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) L'allocazione minima dall'heap sicuro come specificato utilizzando il flag della riga di comando `--secure-heap-min`.
    - `used` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero totale di byte attualmente allocati dall'heap sicuro.
    - `utilization` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il rapporto calcolato tra `used` e il totale dei byte allocati.



### `crypto.setEngine(engine[, flags])` {#cryptosetengineengine-flags}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v22.4.0, v20.16.0 | Il supporto per i motori personalizzati in OpenSSL 3 è deprecato. |
| v0.11.11 | Aggiunto in: v0.11.11 |
:::

- `engine` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `flags` [\<crypto.constants\>](/it/nodejs/api/crypto#cryptoconstants) **Predefinito:** `crypto.constants.ENGINE_METHOD_ALL`

Carica e imposta il `engine` per alcune o tutte le funzioni OpenSSL (selezionate dai flag). Il supporto per i motori personalizzati in OpenSSL è deprecato da OpenSSL 3.

`engine` può essere un id o un percorso alla libreria condivisa del motore.

L'argomento opzionale `flags` utilizza `ENGINE_METHOD_ALL` per impostazione predefinita. `flags` è un campo di bit che prende uno o un mix dei seguenti flag (definiti in `crypto.constants`):

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

**Aggiunto in: v10.0.0**

- `bool` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` per abilitare la modalità FIPS.

Abilita il provider di crittografia conforme a FIPS in una build Node.js abilitata per FIPS. Genera un errore se la modalità FIPS non è disponibile.

### `crypto.sign(algorithm, data, key[, callback])` {#cryptosignalgorithm-data-key-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare un callback non valido all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v15.12.0 | Aggiunto l'argomento callback opzionale. |
| v13.2.0, v12.16.0 | Questa funzione ora supporta le firme DSA e ECDSA IEEE-P1363. |
| v12.0.0 | Aggiunto in: v12.0.0 |
:::

- `algorithm` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
- `data` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `key` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/it/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/it/nodejs/api/webcrypto#class-cryptokey)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `signature` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer)

- Restituisce: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) se la funzione `callback` non viene fornita.

Calcola e restituisce la firma per `data` utilizzando la chiave privata e l'algoritmo forniti. Se `algorithm` è `null` o `undefined`, allora l'algoritmo dipende dal tipo di chiave (specialmente Ed25519 e Ed448).

Se `key` non è un [`KeyObject`](/it/nodejs/api/crypto#class-keyobject), questa funzione si comporta come se `key` fosse stato passato a [`crypto.createPrivateKey()`](/it/nodejs/api/crypto#cryptocreateprivatekeykey). Se è un oggetto, è possibile passare le seguenti proprietà aggiuntive:

- `dsaEncoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Per DSA ed ECDSA, questa opzione specifica il formato della firma generata. Può essere uno dei seguenti:
    - `'der'` (predefinito): struttura di firma ASN.1 con codifica DER che codifica `(r, s)`.
    - `'ieee-p1363'`: formato della firma `r || s` come proposto in IEEE-P1363.

- `padding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Valore di padding opzionale per RSA, uno dei seguenti:
    - `crypto.constants.RSA_PKCS1_PADDING` (predefinito)
    - `crypto.constants.RSA_PKCS1_PSS_PADDING`

`RSA_PKCS1_PSS_PADDING` utilizzerà MGF1 con la stessa funzione hash utilizzata per firmare il messaggio come specificato nella sezione 3.1 di [RFC 4055](https://www.rfc-editor.org/rfc/rfc4055.txt).
- `saltLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Lunghezza del salt quando il padding è `RSA_PKCS1_PSS_PADDING`. Il valore speciale `crypto.constants.RSA_PSS_SALTLEN_DIGEST` imposta la lunghezza del salt alla dimensione del digest, `crypto.constants.RSA_PSS_SALTLEN_MAX_SIGN` (predefinito) la imposta al valore massimo consentito.

Se viene fornita la funzione `callback`, questa funzione utilizza il threadpool di libuv.


### `crypto.subtle` {#cryptosubtle}

**Aggiunto in: v17.4.0**

- Tipo: [\<SubtleCrypto\>](/it/nodejs/api/webcrypto#class-subtlecrypto)

Un alias comodo per [`crypto.webcrypto.subtle`](/it/nodejs/api/webcrypto#class-subtlecrypto).

### `crypto.timingSafeEqual(a, b)` {#cryptotimingsafeequala-b}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v15.0.0 | Gli argomenti a e b possono essere anche ArrayBuffer. |
| v6.6.0 | Aggiunto in: v6.6.0 |
:::

- `a` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `b` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Questa funzione confronta i byte sottostanti che rappresentano le date istanze `ArrayBuffer`, `TypedArray` o `DataView` utilizzando un algoritmo a tempo costante.

Questa funzione non divulga informazioni sui tempi che consentirebbero a un utente malintenzionato di indovinare uno dei valori. Ciò è adatto per confrontare i digest HMAC o i valori segreti come i cookie di autenticazione o gli [URL di capacità](https://www.w3.org/TR/capability-urls/).

`a` e `b` devono essere entrambi `Buffer`, `TypedArray` o `DataView` e devono avere la stessa lunghezza in byte. Viene generato un errore se `a` e `b` hanno lunghezze in byte diverse.

Se almeno uno tra `a` e `b` è un `TypedArray` con più di un byte per voce, come `Uint16Array`, il risultato verrà calcolato utilizzando l'ordine dei byte della piattaforma.

**Quando entrambi gli input sono <code>Float32Array</code> o
<code>Float64Array</code>, questa funzione potrebbe restituire risultati inattesi a causa della codifica IEEE 754 dei numeri in virgola mobile. In particolare, né <code>x === y</code> né
<code>Object.is(x, y)</code> implica che le rappresentazioni in byte di due numeri in virgola mobile <code>x</code> e <code>y</code> siano uguali.**

L'utilizzo di `crypto.timingSafeEqual` non garantisce che il codice *circostante* sia sicuro rispetto ai tempi. È necessario prestare attenzione per garantire che il codice circostante non introduca vulnerabilità temporali.


### `crypto.verify(algorithm, data, key, signature[, callback])` {#cryptoverifyalgorithm-data-key-signature-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare un callback non valido all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v15.12.0 | Aggiunto l'argomento callback opzionale. |
| v15.0.0 | Gli argomenti data, key e signature possono anche essere ArrayBuffer. |
| v13.2.0, v12.16.0 | Questa funzione ora supporta le firme DSA ed ECDSA IEEE-P1363. |
| v12.0.0 | Aggiunto in: v12.0.0 |
:::

- `algorithm` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
- `data` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `key` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/it/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/it/nodejs/api/webcrypto#class-cryptokey)
- `signature` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `callback` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Errore\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `result` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)


- Restituisce: [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` o `false` a seconda della validità della firma per i dati e la chiave pubblica se la funzione `callback` non è fornita.

Verifica la firma fornita per `data` utilizzando la chiave e l'algoritmo specificati. Se `algorithm` è `null` o `undefined`, l'algoritmo dipende dal tipo di chiave (specialmente Ed25519 ed Ed448).

Se `key` non è un [`KeyObject`](/it/nodejs/api/crypto#class-keyobject), questa funzione si comporta come se `key` fosse stato passato a [`crypto.createPublicKey()`](/it/nodejs/api/crypto#cryptocreatepublickeykey). Se è un oggetto, è possibile passare le seguenti proprietà aggiuntive:

- `dsaEncoding` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Per DSA ed ECDSA, questa opzione specifica il formato della firma. Può essere uno dei seguenti:
    - `'der'` (predefinito): struttura di firma ASN.1 con codifica DER che codifica `(r, s)`.
    - `'ieee-p1363'`: formato della firma `r || s` come proposto in IEEE-P1363.


- `padding` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Valore di padding opzionale per RSA, uno dei seguenti:
    - `crypto.constants.RSA_PKCS1_PADDING` (predefinito)
    - `crypto.constants.RSA_PKCS1_PSS_PADDING`

`RSA_PKCS1_PSS_PADDING` utilizzerà MGF1 con la stessa funzione hash utilizzata per firmare il messaggio come specificato nella sezione 3.1 di [RFC 4055](https://www.rfc-editor.org/rfc/rfc4055.txt).
- `saltLength` [\<numero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Lunghezza del salt quando il padding è `RSA_PKCS1_PSS_PADDING`. Il valore speciale `crypto.constants.RSA_PSS_SALTLEN_DIGEST` imposta la lunghezza del salt sulla dimensione del digest, `crypto.constants.RSA_PSS_SALTLEN_MAX_SIGN` (predefinito) lo imposta sul valore massimo consentito.

L'argomento `signature` è la firma calcolata in precedenza per i `data`.

Poiché le chiavi pubbliche possono essere derivate da chiavi private, è possibile passare una chiave privata o una chiave pubblica per `key`.

Se viene fornita la funzione `callback`, questa funzione utilizza il threadpool di libuv.


### `crypto.webcrypto` {#cryptowebcrypto}

**Aggiunto in: v15.0.0**

Tipo: [\<Crypto\>](/it/nodejs/api/webcrypto#class-crypto) Un'implementazione dello standard Web Crypto API.

Vedi la [documentazione Web Crypto API](/it/nodejs/api/webcrypto) per i dettagli.

## Note {#notes}

### Utilizzo di stringhe come input per le API crittografiche {#using-strings-as-inputs-to-cryptographic-apis}

Per ragioni storiche, molte API crittografiche fornite da Node.js accettano stringhe come input laddove l'algoritmo crittografico sottostante funziona su sequenze di byte. Queste istanze includono testi in chiaro, testi cifrati, chiavi simmetriche, vettori di inizializzazione, password, salt, tag di autenticazione e dati autenticati aggiuntivi.

Quando si passano stringhe alle API crittografiche, considerare i seguenti fattori.

- Non tutte le sequenze di byte sono stringhe UTF-8 valide. Pertanto, quando una sequenza di byte di lunghezza `n` viene derivata da una stringa, la sua entropia è generalmente inferiore all'entropia di una sequenza di `n` byte casuale o pseudocasuale. Ad esempio, nessuna stringa UTF-8 risulterà nella sequenza di byte `c0 af`. Le chiavi segrete dovrebbero quasi esclusivamente essere sequenze di byte casuali o pseudocasuali.
- Allo stesso modo, quando si convertono sequenze di byte casuali o pseudocasuali in stringhe UTF-8, le sottosequenze che non rappresentano punti di codice validi possono essere sostituite dal carattere di sostituzione Unicode (`U+FFFD`). La rappresentazione in byte della stringa Unicode risultante potrebbe, quindi, non essere uguale alla sequenza di byte da cui è stata creata la stringa. Gli output di cifrari, funzioni hash, algoritmi di firma e funzioni di derivazione della chiave sono sequenze di byte pseudocasuali e non devono essere usati come stringhe Unicode.
- Quando le stringhe vengono ottenute dall'input dell'utente, alcuni caratteri Unicode possono essere rappresentati in diversi modi equivalenti che risultano in diverse sequenze di byte. Ad esempio, quando si passa una password utente a una funzione di derivazione della chiave, come PBKDF2 o scrypt, il risultato della funzione di derivazione della chiave dipende dal fatto che la stringa usi caratteri composti o scomposti. Node.js non normalizza le rappresentazioni dei caratteri. Gli sviluppatori dovrebbero considerare l'utilizzo di [`String.prototype.normalize()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize) sugli input dell'utente prima di passarli alle API crittografiche.


### API stream legacy (precedente a Node.js 0.10) {#legacy-streams-api-prior-to-nodejs-010}

Il modulo Crypto è stato aggiunto a Node.js prima che esistesse il concetto di un'API Stream unificata e prima che esistessero oggetti [`Buffer`](/it/nodejs/api/buffer) per la gestione di dati binari. Pertanto, molte classi `crypto` hanno metodi che in genere non si trovano su altre classi Node.js che implementano l'API [streams](/it/nodejs/api/stream) (ad es. `update()`, `final()` o `digest()`). Inoltre, molti metodi accettavano e restituivano stringhe codificate `'latin1'` per impostazione predefinita anziché `Buffer`. Questa impostazione predefinita è stata modificata dopo Node.js v0.8 per utilizzare invece gli oggetti [`Buffer`](/it/nodejs/api/buffer) per impostazione predefinita.

### Supporto per algoritmi deboli o compromessi {#support-for-weak-or-compromised-algorithms}

Il modulo `node:crypto` supporta ancora alcuni algoritmi che sono già compromessi e il cui utilizzo non è raccomandato. L'API consente anche l'uso di cifrari e hash con una dimensione di chiave ridotta che sono troppo deboli per un uso sicuro.

Gli utenti si assumono la piena responsabilità della selezione dell'algoritmo crittografico e della dimensione della chiave in base ai propri requisiti di sicurezza.

In base alle raccomandazioni di [NIST SP 800-131A](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-131Ar2.pdf):

- MD5 e SHA-1 non sono più accettabili dove è richiesta la resistenza alla collisione come le firme digitali.
- Si raccomanda che la chiave utilizzata con gli algoritmi RSA, DSA e DH abbia almeno 2048 bit e quella della curva di ECDSA e ECDH almeno 224 bit, per essere sicura da usare per diversi anni.
- I gruppi DH di `modp1`, `modp2` e `modp5` hanno una dimensione della chiave inferiore a 2048 bit e non sono raccomandati.

Consultare il riferimento per altre raccomandazioni e dettagli.

Alcuni algoritmi che hanno debolezze note e sono di scarsa rilevanza nella pratica sono disponibili solo tramite il [provider legacy](/it/nodejs/api/cli#--openssl-legacy-provider), che non è abilitato per impostazione predefinita.

### Modalità CCM {#ccm-mode}

CCM è uno degli [algoritmi AEAD](https://en.wikipedia.org/wiki/Authenticated_encryption) supportati. Le applicazioni che utilizzano questa modalità devono aderire a determinate restrizioni quando utilizzano l'API del cifrario:

- La lunghezza del tag di autenticazione deve essere specificata durante la creazione del cifrario impostando l'opzione `authTagLength` e deve essere una tra 4, 6, 8, 10, 12, 14 o 16 byte.
- La lunghezza del vettore di inizializzazione (nonce) `N` deve essere compresa tra 7 e 13 byte (`7 ≤ N ≤ 13`).
- La lunghezza del testo in chiaro è limitata a `2 ** (8 * (15 - N))` byte.
- Durante la decrittografia, il tag di autenticazione deve essere impostato tramite `setAuthTag()` prima di chiamare `update()`. In caso contrario, la decrittografia fallirà e `final()` genererà un errore in conformità con la sezione 2.6 di [RFC 3610](https://www.rfc-editor.org/rfc/rfc3610.txt).
- L'uso di metodi stream come `write(data)`, `end(data)` o `pipe()` in modalità CCM potrebbe non riuscire poiché CCM non può gestire più di un blocco di dati per istanza.
- Quando si passano dati autenticati aggiuntivi (AAD), la lunghezza del messaggio effettivo in byte deve essere passata a `setAAD()` tramite l'opzione `plaintextLength`. Molte librerie crittografiche includono il tag di autenticazione nel testo cifrato, il che significa che producono testi cifrati della lunghezza `plaintextLength + authTagLength`. Node.js non include il tag di autenticazione, quindi la lunghezza del testo cifrato è sempre `plaintextLength`. Ciò non è necessario se non viene utilizzato alcun AAD.
- Poiché CCM elabora l'intero messaggio in una sola volta, `update()` deve essere chiamato esattamente una volta.
- Anche se chiamare `update()` è sufficiente per crittografare/decrittografare il messaggio, le applicazioni *devono* chiamare `final()` per calcolare o verificare il tag di autenticazione.



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


### Modalità FIPS {#fips-mode}

Quando si utilizza OpenSSL 3, Node.js supporta FIPS 140-2 se utilizzato con un provider OpenSSL 3 appropriato, come il [provider FIPS da OpenSSL 3](https://www.openssl.org/docs/man3.0/man7/crypto#FIPS-provider) che può essere installato seguendo le istruzioni nel [file README FIPS di OpenSSL](https://github.com/openssl/openssl/blob/openssl-3.0/README-FIPS.md).

Per il supporto FIPS in Node.js sarà necessario:

- Un provider FIPS OpenSSL 3 installato correttamente.
- Un [file di configurazione del modulo FIPS](https://www.openssl.org/docs/man3.0/man5/fips_config) OpenSSL 3.
- Un file di configurazione OpenSSL 3 che fa riferimento al file di configurazione del modulo FIPS.

Node.js dovrà essere configurato con un file di configurazione OpenSSL che punti al provider FIPS. Un esempio di file di configurazione è simile a questo:

```text [TEXT]
nodejs_conf = nodejs_init

.include /<percorso assoluto>/fipsmodule.cnf

[nodejs_init]
providers = provider_sect

[provider_sect]
default = default_sect
# Il nome della sezione fips deve corrispondere al nome della sezione all'interno {#the-fips-section-name-should-match-the-section-name-inside-the}
# del file fipsmodule.cnf incluso.
fips = fips_sect

[default_sect]
activate = 1
```
dove `fipsmodule.cnf` è il file di configurazione del modulo FIPS generato dal passaggio di installazione del provider FIPS:

```bash [BASH]
openssl fipsinstall
```
Imposta la variabile d'ambiente `OPENSSL_CONF` in modo che punti al tuo file di configurazione e `OPENSSL_MODULES` alla posizione della libreria dinamica del provider FIPS. ad esempio

```bash [BASH]
export OPENSSL_CONF=/<percorso al file di configurazione>/nodejs.cnf
export OPENSSL_MODULES=/<percorso alla libreria openssl>/ossl-modules
```
La modalità FIPS può quindi essere abilitata in Node.js tramite:

- Avviando Node.js con i flag della riga di comando `--enable-fips` o `--force-fips`.
- Chiamando programmaticamente `crypto.setFips(true)`.

Opzionalmente, la modalità FIPS può essere abilitata in Node.js tramite il file di configurazione OpenSSL. ad esempio

```text [TEXT]
nodejs_conf = nodejs_init

.include /<percorso assoluto>/fipsmodule.cnf

[nodejs_init]
providers = provider_sect
alg_section = algorithm_sect

[provider_sect]
default = default_sect
# Il nome della sezione fips deve corrispondere al nome della sezione all'interno {#included-fipsmodulecnf}
# del file fipsmodule.cnf incluso.
fips = fips_sect

[default_sect]
activate = 1

[algorithm_sect]
default_properties = fips=yes
```

## Costanti crittografiche {#the-fips-section-name-should-match-the-section-name-inside-the_1}

Le seguenti costanti esportate da `crypto.constants` si applicano a vari usi dei moduli `node:crypto`, `node:tls` e `node:https` e sono generalmente specifiche per OpenSSL.

### Opzioni di OpenSSL {#included-fipsmodulecnf_1}

Vedere l'[elenco dei flag SSL OP](https://wiki.openssl.org/index.php/List_of_SSL_OP_Flags#Table_of_Options) per i dettagli.

| Costante | Descrizione |
| --- | --- |
| `SSL_OP_ALL` | Applica molteplici soluzioni alternative per bug all'interno di OpenSSL. Vedere       [https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options.html](https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options)       per i dettagli. |
| `SSL_OP_ALLOW_NO_DHE_KEX` | Indica a OpenSSL di consentire una modalità di scambio di chiavi non basata su [EC]DHE     per TLS v1.3 |
| `SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION` | Consente la rinegoziazione legacy non sicura tra OpenSSL e client o server non patchati. Vedere       [https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options.html](https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options)  . |
| `SSL_OP_CIPHER_SERVER_PREFERENCE` | Tenta di utilizzare le preferenze del server invece di quelle del client durante la selezione di una cifra. Il comportamento dipende dalla versione del protocollo. Vedere       [https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options.html](https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options)  . |
| `SSL_OP_CISCO_ANYCONNECT` | Indica a OpenSSL di utilizzare l'identificatore di versione di Cisco di DTLS_BAD_VER. |
| `SSL_OP_COOKIE_EXCHANGE` | Indica a OpenSSL di attivare lo scambio di cookie. |
| `SSL_OP_CRYPTOPRO_TLSEXT_BUG` | Indica a OpenSSL di aggiungere l'estensione server-hello da una versione precedente     della bozza di cryptopro. |
| `SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS` | Indica a OpenSSL di disabilitare una soluzione alternativa per la vulnerabilità SSL 3.0/TLS 1.0     aggiunta in OpenSSL 0.9.6d. |
| `SSL_OP_LEGACY_SERVER_CONNECT` | Consente la connessione iniziale a server che non supportano RI. |
| `SSL_OP_NO_COMPRESSION` | Indica a OpenSSL di disabilitare il supporto per la compressione SSL/TLS. |
| `SSL_OP_NO_ENCRYPT_THEN_MAC` | Indica a OpenSSL di disabilitare encrypt-then-MAC. |
| `SSL_OP_NO_QUERY_MTU` ||
| `SSL_OP_NO_RENEGOTIATION` | Indica a OpenSSL di disabilitare la rinegoziazione. |
| `SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION` | Indica a OpenSSL di avviare sempre una nuova sessione quando si esegue la rinegoziazione. |
| `SSL_OP_NO_SSLv2` | Indica a OpenSSL di disattivare SSL v2 |
| `SSL_OP_NO_SSLv3` | Indica a OpenSSL di disattivare SSL v3 |
| `SSL_OP_NO_TICKET` | Indica a OpenSSL di disabilitare l'uso dei ticket RFC4507bis. |
| `SSL_OP_NO_TLSv1` | Indica a OpenSSL di disattivare TLS v1 |
| `SSL_OP_NO_TLSv1_1` | Indica a OpenSSL di disattivare TLS v1.1 |
| `SSL_OP_NO_TLSv1_2` | Indica a OpenSSL di disattivare TLS v1.2 |
| `SSL_OP_NO_TLSv1_3` | Indica a OpenSSL di disattivare TLS v1.3 |
| `SSL_OP_PRIORITIZE_CHACHA` | Indica al server OpenSSL di dare la priorità a ChaCha20-Poly1305     quando lo fa il client.     Questa opzione non ha effetto se       `SSL_OP_CIPHER_SERVER_PREFERENCE`       non è abilitata. |
| `SSL_OP_TLS_ROLLBACK_BUG` | Indica a OpenSSL di disabilitare il rilevamento degli attacchi di rollback di versione. |

### Costanti del motore OpenSSL {#crypto-constants}

| Costante | Descrizione |
| --- | --- |
| `ENGINE_METHOD_RSA` | Limita l'utilizzo del motore a RSA |
| `ENGINE_METHOD_DSA` | Limita l'utilizzo del motore a DSA |
| `ENGINE_METHOD_DH` | Limita l'utilizzo del motore a DH |
| `ENGINE_METHOD_RAND` | Limita l'utilizzo del motore a RAND |
| `ENGINE_METHOD_EC` | Limita l'utilizzo del motore a EC |
| `ENGINE_METHOD_CIPHERS` | Limita l'utilizzo del motore a CIFRARI |
| `ENGINE_METHOD_DIGESTS` | Limita l'utilizzo del motore a DIGEST |
| `ENGINE_METHOD_PKEY_METHS` | Limita l'utilizzo del motore a PKEY_METHS |
| `ENGINE_METHOD_PKEY_ASN1_METHS` | Limita l'utilizzo del motore a PKEY_ASN1_METHS |
| `ENGINE_METHOD_ALL` ||
| `ENGINE_METHOD_NONE` ||
### Altre costanti OpenSSL {#openssl-options}

| Costante | Descrizione |
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
| `RSA_PSS_SALTLEN_DIGEST` | Imposta la lunghezza del salt per `RSA_PKCS1_PSS_PADDING` alla dimensione del digest durante la firma o la verifica. |
| `RSA_PSS_SALTLEN_MAX_SIGN` | Imposta la lunghezza del salt per `RSA_PKCS1_PSS_PADDING` al valore massimo consentito durante la firma dei dati. |
| `RSA_PSS_SALTLEN_AUTO` | Fa sì che la lunghezza del salt per `RSA_PKCS1_PSS_PADDING` venga determinata automaticamente durante la verifica di una firma. |
| `POINT_CONVERSION_COMPRESSED` ||
| `POINT_CONVERSION_UNCOMPRESSED` ||
| `POINT_CONVERSION_HYBRID` ||
### Costanti crypto di Node.js {#openssl-engine-constants}

| Costante | Descrizione |
| --- | --- |
| `defaultCoreCipherList` | Specifica l'elenco di cifrari predefinito incorporato utilizzato da Node.js. |
| `defaultCipherList` | Specifica l'elenco di cifrari predefinito attivo utilizzato dal processo Node.js corrente. |

