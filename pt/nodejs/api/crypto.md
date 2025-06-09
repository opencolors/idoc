---
title: Documentação do Node.js - Crypto
description: O módulo Crypto do Node.js fornece funcionalidades criptográficas que incluem um conjunto de envoltórios para as funções de hash, HMAC, cifra, decifra, assinatura e verificação do OpenSSL. Ele suporta vários algoritmos de criptografia, derivação de chaves e assinaturas digitais, permitindo que os desenvolvedores protejam dados e comunicações dentro de aplicações Node.js.
head:
  - - meta
    - name: og:title
      content: Documentação do Node.js - Crypto | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: O módulo Crypto do Node.js fornece funcionalidades criptográficas que incluem um conjunto de envoltórios para as funções de hash, HMAC, cifra, decifra, assinatura e verificação do OpenSSL. Ele suporta vários algoritmos de criptografia, derivação de chaves e assinaturas digitais, permitindo que os desenvolvedores protejam dados e comunicações dentro de aplicações Node.js.
  - - meta
    - name: twitter:title
      content: Documentação do Node.js - Crypto | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: O módulo Crypto do Node.js fornece funcionalidades criptográficas que incluem um conjunto de envoltórios para as funções de hash, HMAC, cifra, decifra, assinatura e verificação do OpenSSL. Ele suporta vários algoritmos de criptografia, derivação de chaves e assinaturas digitais, permitindo que os desenvolvedores protejam dados e comunicações dentro de aplicações Node.js.
---


# Crypto {#crypto}

::: tip [Stable: 2 - Stable]
[Stable: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável
:::

**Código Fonte:** [lib/crypto.js](https://github.com/nodejs/node/blob/v23.5.0/lib/crypto.js)

O módulo `node:crypto` fornece funcionalidade criptográfica que inclui um conjunto de wrappers para as funções de hash, HMAC, cifra, decifrar, assinar e verificar do OpenSSL.

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

## Determinando se o suporte ao crypto está indisponível {#determining-if-crypto-support-is-unavailable}

É possível que o Node.js seja construído sem incluir suporte para o módulo `node:crypto`. Nesses casos, tentar `import` de `crypto` ou chamar `require('node:crypto')` resultará em um erro sendo lançado.

Ao usar CommonJS, o erro lançado pode ser capturado usando try/catch:

```js [CJS]
let crypto;
try {
  crypto = require('node:crypto');
} catch (err) {
  console.error('crypto support is disabled!');
}
```
Ao usar a palavra-chave léxica ESM `import`, o erro só pode ser capturado se um manipulador para `process.on('uncaughtException')` for registrado *antes* de qualquer tentativa de carregar o módulo ser feita (usando, por exemplo, um módulo de pré-carregamento).

Ao usar ESM, se houver uma chance de que o código possa ser executado em uma compilação do Node.js onde o suporte ao crypto não está habilitado, considere usar a função [`import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) em vez da palavra-chave léxica `import`:

```js [ESM]
let crypto;
try {
  crypto = await import('node:crypto');
} catch (err) {
  console.error('crypto support is disabled!');
}
```

## Classe: `Certificate` {#class-certificate}

**Adicionado em: v0.11.8**

SPKAC é um mecanismo de Solicitação de Assinatura de Certificado originalmente implementado pela Netscape e especificado formalmente como parte do elemento `keygen` do HTML5.

`\<keygen\>` está obsoleto desde o [HTML 5.2](https://www.w3.org/TR/html52/changes#features-removed) e novos projetos não devem mais usar este elemento.

O módulo `node:crypto` fornece a classe `Certificate` para trabalhar com dados SPKAC. O uso mais comum é lidar com a saída gerada pelo elemento HTML5 `\<keygen\>`. O Node.js usa a [implementação SPKAC do OpenSSL](https://www.openssl.org/docs/man3.0/man1/openssl-spkac) internamente.

### Método estático: `Certificate.exportChallenge(spkac[, encoding])` {#static-method-certificateexportchallengespkac-encoding}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v15.0.0 | O argumento spkac pode ser um ArrayBuffer. Limitou o tamanho do argumento spkac a um máximo de 2**31 - 1 bytes. |
| v9.0.0 | Adicionado em: v9.0.0 |
:::

- `spkac` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A [codificação](/pt/nodejs/api/buffer#buffers-and-character-encodings) da string `spkac`.
- Retorna: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) O componente de desafio da estrutura de dados `spkac`, que inclui uma chave pública e um desafio.



::: code-group
```js [ESM]
const { Certificate } = await import('node:crypto');
const spkac = getSpkacSomehow();
const challenge = Certificate.exportChallenge(spkac);
console.log(challenge.toString('utf8'));
// Imprime: o desafio como uma string UTF8
```

```js [CJS]
const { Certificate } = require('node:crypto');
const spkac = getSpkacSomehow();
const challenge = Certificate.exportChallenge(spkac);
console.log(challenge.toString('utf8'));
// Imprime: o desafio como uma string UTF8
```
:::


### Método estático: `Certificate.exportPublicKey(spkac[, encoding])` {#static-method-certificateexportpublickeyspkac-encoding}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v15.0.0 | O argumento spkac pode ser um ArrayBuffer. Limitou o tamanho do argumento spkac para um máximo de 2**31 - 1 bytes. |
| v9.0.0 | Adicionado em: v9.0.0 |
:::

- `spkac` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A [codificação](/pt/nodejs/api/buffer#buffers-and-character-encodings) da string `spkac`.
- Retorna: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) O componente de chave pública da estrutura de dados `spkac`, que inclui uma chave pública e um desafio.

::: code-group
```js [ESM]
const { Certificate } = await import('node:crypto');
const spkac = getSpkacSomehow();
const publicKey = Certificate.exportPublicKey(spkac);
console.log(publicKey);
// Imprime: a chave pública como <Buffer ...>
```

```js [CJS]
const { Certificate } = require('node:crypto');
const spkac = getSpkacSomehow();
const publicKey = Certificate.exportPublicKey(spkac);
console.log(publicKey);
// Imprime: a chave pública como <Buffer ...>
```
:::

### Método estático: `Certificate.verifySpkac(spkac[, encoding])` {#static-method-certificateverifyspkacspkac-encoding}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v15.0.0 | O argumento spkac pode ser um ArrayBuffer. Adicionada a codificação. Limitou o tamanho do argumento spkac para um máximo de 2**31 - 1 bytes. |
| v9.0.0 | Adicionado em: v9.0.0 |
:::

- `spkac` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A [codificação](/pt/nodejs/api/buffer#buffers-and-character-encodings) da string `spkac`.
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` se a estrutura de dados `spkac` fornecida for válida, `false` caso contrário.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const { Certificate } = await import('node:crypto');

const spkac = getSpkacSomehow();
console.log(Certificate.verifySpkac(Buffer.from(spkac)));
// Imprime: true ou false
```

```js [CJS]
const { Buffer } = require('node:buffer');
const { Certificate } = require('node:crypto');

const spkac = getSpkacSomehow();
console.log(Certificate.verifySpkac(Buffer.from(spkac)));
// Imprime: true ou false
```
:::


### API Legada {#legacy-api}

::: danger [Estável: 0 - Obsoleto]
[Estável: 0](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 0](/pt/nodejs/api/documentation#stability-index) - Obsoleto
:::

Como uma interface legada, é possível criar novas instâncias da classe `crypto.Certificate`, conforme ilustrado nos exemplos abaixo.

#### `new crypto.Certificate()` {#new-cryptocertificate}

Instâncias da classe `Certificate` podem ser criadas usando a palavra-chave `new` ou chamando `crypto.Certificate()` como uma função:

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

**Adicionado em: v0.11.8**

- `spkac` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A [codificação](/pt/nodejs/api/buffer#buffers-and-character-encodings) da string `spkac`.
- Retorna: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) O componente de desafio da estrutura de dados `spkac`, que inclui uma chave pública e um desafio.

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

**Adicionado em: v0.11.8**

- `spkac` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A [codificação](/pt/nodejs/api/buffer#buffers-and-character-encodings) da string `spkac`.
- Retorna: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) O componente de chave pública da estrutura de dados `spkac`, que inclui uma chave pública e um desafio.

::: code-group
```js [ESM]
const { Certificate } = await import('node:crypto');
const cert = Certificate();
const spkac = getSpkacSomehow();
const publicKey = cert.exportPublicKey(spkac);
console.log(publicKey);
// Imprime: a chave pública como <Buffer ...>
```

```js [CJS]
const { Certificate } = require('node:crypto');
const cert = Certificate();
const spkac = getSpkacSomehow();
const publicKey = cert.exportPublicKey(spkac);
console.log(publicKey);
// Imprime: a chave pública como <Buffer ...>
```
:::

#### `certificate.verifySpkac(spkac[, encoding])` {#certificateverifyspkacspkac-encoding}

**Adicionado em: v0.11.8**

- `spkac` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A [codificação](/pt/nodejs/api/buffer#buffers-and-character-encodings) da string `spkac`.
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` se a estrutura de dados `spkac` fornecida for válida, `false` caso contrário.

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const { Certificate } = await import('node:crypto');

const cert = Certificate();
const spkac = getSpkacSomehow();
console.log(cert.verifySpkac(Buffer.from(spkac)));
// Imprime: true ou false
```

```js [CJS]
const { Buffer } = require('node:buffer');
const { Certificate } = require('node:crypto');

const cert = Certificate();
const spkac = getSpkacSomehow();
console.log(cert.verifySpkac(Buffer.from(spkac)));
// Imprime: true ou false
```
:::


## Classe: `Cipher` {#class-cipher}

**Adicionado em: v0.1.94**

- Estende: [\<stream.Transform\>](/pt/nodejs/api/stream#class-streamtransform)

Instâncias da classe `Cipher` são usadas para criptografar dados. A classe pode ser usada de duas maneiras:

- Como um [stream](/pt/nodejs/api/stream) que é legível e gravável, onde dados não criptografados simples são gravados para produzir dados criptografados no lado legível, ou
- Usando os métodos [`cipher.update()`](/pt/nodejs/api/crypto#cipherupdatedata-inputencoding-outputencoding) e [`cipher.final()`](/pt/nodejs/api/crypto#cipherfinaloutputencoding) para produzir os dados criptografados.

O método [`crypto.createCipheriv()`](/pt/nodejs/api/crypto#cryptocreatecipherivalgorithm-key-iv-options) é usado para criar instâncias de `Cipher`. Objetos `Cipher` não devem ser criados diretamente usando a palavra-chave `new`.

Exemplo: Usando objetos `Cipher` como streams:

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

Exemplo: Usando `Cipher` e streams encadeados:

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

Exemplo: Usando os métodos [`cipher.update()`](/pt/nodejs/api/crypto#cipherupdatedata-inputencoding-outputencoding) e [`cipher.final()`](/pt/nodejs/api/crypto#cipherfinaloutputencoding):

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

**Adicionado em: v0.1.94**

- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A [codificação](/pt/nodejs/api/buffer#buffers-and-character-encodings) do valor de retorno.
- Retorna: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Quaisquer conteúdos cifrados restantes. Se `outputEncoding` for especificado, uma string será retornada. Se um `outputEncoding` não for fornecido, um [`Buffer`](/pt/nodejs/api/buffer) será retornado.

Depois que o método `cipher.final()` for chamado, o objeto `Cipher` não poderá mais ser usado para criptografar dados. Tentativas de chamar `cipher.final()` mais de uma vez resultarão em um erro sendo lançado.

### `cipher.getAuthTag()` {#ciphergetauthtag}

**Adicionado em: v1.0.0**

- Retorna: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) Ao usar um modo de criptografia autenticada (atualmente, `GCM`, `CCM`, `OCB` e `chacha20-poly1305` são suportados), o método `cipher.getAuthTag()` retorna um [`Buffer`](/pt/nodejs/api/buffer) contendo a *tag de autenticação* que foi computada a partir dos dados fornecidos.

O método `cipher.getAuthTag()` deve ser chamado apenas depois que a criptografia for concluída usando o método [`cipher.final()`](/pt/nodejs/api/crypto#cipherfinaloutputencoding).

Se a opção `authTagLength` foi definida durante a criação da instância `cipher`, esta função retornará exatamente `authTagLength` bytes.

### `cipher.setAAD(buffer[, options])` {#ciphersetaadbuffer-options}

**Adicionado em: v1.0.0**

- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.transform` options](/pt/nodejs/api/stream#new-streamtransformoptions)
    - `plaintextLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A codificação de string a ser usada quando `buffer` é uma string.

- Retorna: [\<Cipher\>](/pt/nodejs/api/crypto#class-cipher) A mesma instância `Cipher` para encadeamento de métodos.

Ao usar um modo de criptografia autenticada (atualmente, `GCM`, `CCM`, `OCB` e `chacha20-poly1305` são suportados), o método `cipher.setAAD()` define o valor usado para o parâmetro de entrada *dados autenticados adicionais* (AAD).

A opção `plaintextLength` é opcional para `GCM` e `OCB`. Ao usar `CCM`, a opção `plaintextLength` deve ser especificada e seu valor deve corresponder ao comprimento do texto simples em bytes. Consulte [Modo CCM](/pt/nodejs/api/crypto#ccm-mode).

O método `cipher.setAAD()` deve ser chamado antes de [`cipher.update()`](/pt/nodejs/api/crypto#cipherupdatedata-inputencoding-outputencoding).


### `cipher.setAutoPadding([autoPadding])` {#ciphersetautopaddingautopadding}

**Adicionado em: v0.7.1**

- `autoPadding` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Padrão:** `true`
- Retorna: [\<Cipher\>](/pt/nodejs/api/crypto#class-cipher) A mesma instância `Cipher` para encadeamento de métodos.

Ao usar algoritmos de criptografia de bloco, a classe `Cipher` adicionará automaticamente preenchimento aos dados de entrada para o tamanho de bloco apropriado. Para desativar o preenchimento padrão, chame `cipher.setAutoPadding(false)`.

Quando `autoPadding` é `false`, o comprimento de todos os dados de entrada deve ser um múltiplo do tamanho do bloco da cifra ou [`cipher.final()`](/pt/nodejs/api/crypto#cipherfinaloutputencoding) lançará um erro. Desativar o preenchimento automático é útil para preenchimento não padrão, por exemplo, usando `0x0` em vez de preenchimento PKCS.

O método `cipher.setAutoPadding()` deve ser chamado antes de [`cipher.final()`](/pt/nodejs/api/crypto#cipherfinaloutputencoding).

### `cipher.update(data[, inputEncoding][, outputEncoding])` {#cipherupdatedata-inputencoding-outputencoding}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v6.0.0 | O `inputEncoding` padrão foi alterado de `binary` para `utf8`. |
| v0.1.94 | Adicionado em: v0.1.94 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A [codificação](/pt/nodejs/api/buffer#buffers-and-character-encodings) dos dados.
- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A [codificação](/pt/nodejs/api/buffer#buffers-and-character-encodings) do valor de retorno.
- Retorna: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Atualiza a cifra com `data`. Se o argumento `inputEncoding` for fornecido, o argumento `data` é uma string usando a codificação especificada. Se o argumento `inputEncoding` não for fornecido, `data` deve ser um [`Buffer`](/pt/nodejs/api/buffer), `TypedArray` ou `DataView`. Se `data` for um [`Buffer`](/pt/nodejs/api/buffer), `TypedArray` ou `DataView`, então `inputEncoding` é ignorado.

O `outputEncoding` especifica o formato de saída dos dados criptografados. Se o `outputEncoding` for especificado, uma string usando a codificação especificada é retornada. Se nenhum `outputEncoding` for fornecido, um [`Buffer`](/pt/nodejs/api/buffer) é retornado.

O método `cipher.update()` pode ser chamado várias vezes com novos dados até que [`cipher.final()`](/pt/nodejs/api/crypto#cipherfinaloutputencoding) seja chamado. Chamar `cipher.update()` após [`cipher.final()`](/pt/nodejs/api/crypto#cipherfinaloutputencoding) resultará no lançamento de um erro.


## Classe: `Decipher` {#class-decipher}

**Adicionado em: v0.1.94**

- Estende: [\<stream.Transform\>](/pt/nodejs/api/stream#class-streamtransform)

Instâncias da classe `Decipher` são usadas para descriptografar dados. A classe pode ser usada de duas maneiras:

- Como um [stream](/pt/nodejs/api/stream) que é legível e gravável, onde dados criptografados simples são gravados para produzir dados não criptografados no lado legível, ou
- Usando os métodos [`decipher.update()`](/pt/nodejs/api/crypto#decipherupdatedata-inputencoding-outputencoding) e [`decipher.final()`](/pt/nodejs/api/crypto#decipherfinaloutputencoding) para produzir os dados não criptografados.

O método [`crypto.createDecipheriv()`](/pt/nodejs/api/crypto#cryptocreatedecipherivalgorithm-key-iv-options) é usado para criar instâncias de `Decipher`. Objetos `Decipher` não devem ser criados diretamente usando a palavra-chave `new`.

Exemplo: Usando objetos `Decipher` como streams:



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

Exemplo: Usando `Decipher` e streams encadeados:



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

Exemplo: Usando os métodos [`decipher.update()`](/pt/nodejs/api/crypto#decipherupdatedata-inputencoding-outputencoding) e [`decipher.final()`](/pt/nodejs/api/crypto#decipherfinaloutputencoding):



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

**Adicionado em: v0.1.94**

- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A [codificação](/pt/nodejs/api/buffer#buffers-and-character-encodings) do valor de retorno.
- Retorna: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Qualquer conteúdo decifrado restante. Se `outputEncoding` for especificado, uma string é retornada. Se um `outputEncoding` não for fornecido, um [`Buffer`](/pt/nodejs/api/buffer) é retornado.

Depois que o método `decipher.final()` for chamado, o objeto `Decipher` não poderá mais ser usado para descriptografar dados. Tentativas de chamar `decipher.final()` mais de uma vez resultarão em um erro sendo lançado.

### `decipher.setAAD(buffer[, options])` {#deciphersetaadbuffer-options}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v15.0.0 | O argumento buffer pode ser uma string ou ArrayBuffer e é limitado a não mais que 2 ** 31 - 1 bytes. |
| v7.2.0 | Este método agora retorna uma referência para `decipher`. |
| v1.0.0 | Adicionado em: v1.0.0 |
:::

- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.transform` options](/pt/nodejs/api/stream#new-streamtransformoptions) 
    - `plaintextLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Codificação de string para usar quando `buffer` é uma string.
  
 
- Retorna: [\<Decipher\>](/pt/nodejs/api/crypto#class-decipher) O mesmo Decipher para encadeamento de métodos.

Ao usar um modo de criptografia autenticado (`GCM`, `CCM`, `OCB` e `chacha20-poly1305` são atualmente suportados), o método `decipher.setAAD()` define o valor usado para o parâmetro de entrada *dados autenticados adicionais* (AAD).

O argumento `options` é opcional para `GCM`. Ao usar `CCM`, a opção `plaintextLength` deve ser especificada e seu valor deve corresponder ao comprimento do texto cifrado em bytes. Consulte [Modo CCM](/pt/nodejs/api/crypto#ccm-mode).

O método `decipher.setAAD()` deve ser chamado antes de [`decipher.update()`](/pt/nodejs/api/crypto#decipherupdatedata-inputencoding-outputencoding).

Ao passar uma string como `buffer`, considere [ressalvas ao usar strings como entradas para APIs criptográficas](/pt/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis).


### `decipher.setAuthTag(buffer[, encoding])` {#deciphersetauthtagbuffer-encoding}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v22.0.0, v20.13.0 | Usar comprimentos de tag GCM diferentes de 128 bits sem especificar a opção `authTagLength` ao criar `decipher` está obsoleto. |
| v15.0.0 | O argumento buffer pode ser uma string ou ArrayBuffer e é limitado a no máximo 2 ** 31 - 1 bytes. |
| v11.0.0 | Este método agora lança um erro se o comprimento da tag GCM for inválido. |
| v7.2.0 | Este método agora retorna uma referência a `decipher`. |
| v1.0.0 | Adicionado em: v1.0.0 |
:::

- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Codificação de string a ser usada quando `buffer` é uma string.
- Retorna: [\<Decipher\>](/pt/nodejs/api/crypto#class-decipher) O mesmo Decipher para encadeamento de métodos.

Ao usar um modo de criptografia autenticada (atualmente, `GCM`, `CCM`, `OCB` e `chacha20-poly1305` são suportados), o método `decipher.setAuthTag()` é usado para passar a *tag de autenticação* recebida. Se nenhuma tag for fornecida ou se o texto cifrado tiver sido adulterado, [`decipher.final()`](/pt/nodejs/api/crypto#decipherfinaloutputencoding) lançará um erro, indicando que o texto cifrado deve ser descartado devido à falha na autenticação. Se o comprimento da tag for inválido de acordo com [NIST SP 800-38D](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38d.pdf) ou não corresponder ao valor da opção `authTagLength`, `decipher.setAuthTag()` lançará um erro.

O método `decipher.setAuthTag()` deve ser chamado antes de [`decipher.update()`](/pt/nodejs/api/crypto#decipherupdatedata-inputencoding-outputencoding) para o modo `CCM` ou antes de [`decipher.final()`](/pt/nodejs/api/crypto#decipherfinaloutputencoding) para os modos `GCM` e `OCB` e `chacha20-poly1305`. `decipher.setAuthTag()` só pode ser chamado uma vez.

Ao passar uma string como a tag de autenticação, considere [ressalvas ao usar strings como entradas para APIs criptográficas](/pt/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis).


### `decipher.setAutoPadding([autoPadding])` {#deciphersetautopaddingautopadding}

**Adicionado em: v0.7.1**

- `autoPadding` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Padrão:** `true`
- Retorna: [\<Decipher\>](/pt/nodejs/api/crypto#class-decipher) O mesmo Decipher para encadeamento de métodos.

Quando os dados são criptografados sem o preenchimento de bloco padrão, chamar `decipher.setAutoPadding(false)` desativará o preenchimento automático para evitar que [`decipher.final()`](/pt/nodejs/api/crypto#decipherfinaloutputencoding) verifique e remova o preenchimento.

Desativar o preenchimento automático só funcionará se o comprimento dos dados de entrada for um múltiplo do tamanho do bloco da cifra.

O método `decipher.setAutoPadding()` deve ser chamado antes de [`decipher.final()`](/pt/nodejs/api/crypto#decipherfinaloutputencoding).

### `decipher.update(data[, inputEncoding][, outputEncoding])` {#decipherupdatedata-inputencoding-outputencoding}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v6.0.0 | O `inputEncoding` padrão foi alterado de `binary` para `utf8`. |
| v0.1.94 | Adicionado em: v0.1.94 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A [codificação](/pt/nodejs/api/buffer#buffers-and-character-encodings) da string `data`.
- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A [codificação](/pt/nodejs/api/buffer#buffers-and-character-encodings) do valor de retorno.
- Retorna: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Atualiza a decifração com `data`. Se o argumento `inputEncoding` for fornecido, o argumento `data` é uma string usando a codificação especificada. Se o argumento `inputEncoding` não for fornecido, `data` deve ser um [`Buffer`](/pt/nodejs/api/buffer). Se `data` for um [`Buffer`](/pt/nodejs/api/buffer), então `inputEncoding` é ignorado.

O `outputEncoding` especifica o formato de saída dos dados cifrados. Se o `outputEncoding` for especificado, uma string usando a codificação especificada é retornada. Se nenhum `outputEncoding` for fornecido, um [`Buffer`](/pt/nodejs/api/buffer) é retornado.

O método `decipher.update()` pode ser chamado várias vezes com novos dados até que [`decipher.final()`](/pt/nodejs/api/crypto#decipherfinaloutputencoding) seja chamado. Chamar `decipher.update()` após [`decipher.final()`](/pt/nodejs/api/crypto#decipherfinaloutputencoding) resultará em um erro sendo lançado.

Mesmo que a cifra subjacente implemente autenticação, a autenticidade e integridade do texto simples retornado desta função podem ser incertas neste momento. Para algoritmos de criptografia autenticada, a autenticidade geralmente só é estabelecida quando o aplicativo chama [`decipher.final()`](/pt/nodejs/api/crypto#decipherfinaloutputencoding).


## Classe: `DiffieHellman` {#class-diffiehellman}

**Adicionado em: v0.5.0**

A classe `DiffieHellman` é uma utilidade para criar trocas de chaves Diffie-Hellman.

Instâncias da classe `DiffieHellman` podem ser criadas usando a função [`crypto.createDiffieHellman()`](/pt/nodejs/api/crypto#cryptocreatediffiehellmanprime-primeencoding-generator-generatorencoding).

::: code-group
```js [ESM]
import assert from 'node:assert';

const {
  createDiffieHellman,
} = await import('node:crypto');

// Generate Alice's keys...
const alice = createDiffieHellman(2048);
const aliceKey = alice.generateKeys();

// Generate Bob's keys...
const bob = createDiffieHellman(alice.getPrime(), alice.getGenerator());
const bobKey = bob.generateKeys();

// Exchange and generate the secret...
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

// Generate Alice's keys...
const alice = createDiffieHellman(2048);
const aliceKey = alice.generateKeys();

// Generate Bob's keys...
const bob = createDiffieHellman(alice.getPrime(), alice.getGenerator());
const bobKey = bob.generateKeys();

// Exchange and generate the secret...
const aliceSecret = alice.computeSecret(bobKey);
const bobSecret = bob.computeSecret(aliceKey);

// OK
assert.strictEqual(aliceSecret.toString('hex'), bobSecret.toString('hex'));
```
:::

### `diffieHellman.computeSecret(otherPublicKey[, inputEncoding][, outputEncoding])` {#diffiehellmancomputesecretotherpublickey-inputencoding-outputencoding}

**Adicionado em: v0.5.0**

- `otherPublicKey` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A [codificação](/pt/nodejs/api/buffer#buffers-and-character-encodings) de uma string `otherPublicKey`.
- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A [codificação](/pt/nodejs/api/buffer#buffers-and-character-encodings) do valor de retorno.
- Retorna: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Calcula o segredo compartilhado usando `otherPublicKey` como a chave pública da outra parte e retorna o segredo compartilhado calculado. A chave fornecida é interpretada usando a `inputEncoding` especificada e o segredo é codificado usando a `outputEncoding` especificada. Se a `inputEncoding` não for fornecida, espera-se que `otherPublicKey` seja um [`Buffer`](/pt/nodejs/api/buffer), `TypedArray` ou `DataView`.

Se `outputEncoding` for fornecida, uma string é retornada; caso contrário, um [`Buffer`](/pt/nodejs/api/buffer) é retornado.


### `diffieHellman.generateKeys([encoding])` {#diffiehellmangeneratekeysencoding}

**Adicionado em: v0.5.0**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A [codificação](/pt/nodejs/api/buffer#buffers-and-character-encodings) do valor de retorno.
- Retorna: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Gera valores de chave Diffie-Hellman privada e pública, a menos que já tenham sido gerados ou computados, e retorna a chave pública na `codificação` especificada. Esta chave deve ser transferida para a outra parte. Se `encoding` for fornecido, uma string será retornada; caso contrário, um [`Buffer`](/pt/nodejs/api/buffer) será retornado.

Esta função é um wrapper fino em torno de [`DH_generate_key()`](https://www.openssl.org/docs/man3.0/man3/DH_generate_key). Em particular, uma vez que uma chave privada tenha sido gerada ou definida, chamar esta função apenas atualiza a chave pública, mas não gera uma nova chave privada.

### `diffieHellman.getGenerator([encoding])` {#diffiehellmangetgeneratorencoding}

**Adicionado em: v0.5.0**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A [codificação](/pt/nodejs/api/buffer#buffers-and-character-encodings) do valor de retorno.
- Retorna: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retorna o gerador Diffie-Hellman na `codificação` especificada. Se `encoding` for fornecido, uma string será retornada; caso contrário, um [`Buffer`](/pt/nodejs/api/buffer) será retornado.

### `diffieHellman.getPrime([encoding])` {#diffiehellmangetprimeencoding}

**Adicionado em: v0.5.0**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A [codificação](/pt/nodejs/api/buffer#buffers-and-character-encodings) do valor de retorno.
- Retorna: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retorna o primo Diffie-Hellman na `codificação` especificada. Se `encoding` for fornecido, uma string será retornada; caso contrário, um [`Buffer`](/pt/nodejs/api/buffer) será retornado.


### `diffieHellman.getPrivateKey([encoding])` {#diffiehellmangetprivatekeyencoding}

**Adicionado em: v0.5.0**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A [codificação](/pt/nodejs/api/buffer#buffers-and-character-encodings) do valor de retorno.
- Retorna: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retorna a chave privada Diffie-Hellman na `encoding` especificada. Se `encoding` for fornecida, uma string será retornada; caso contrário, um [`Buffer`](/pt/nodejs/api/buffer) será retornado.

### `diffieHellman.getPublicKey([encoding])` {#diffiehellmangetpublickeyencoding}

**Adicionado em: v0.5.0**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A [codificação](/pt/nodejs/api/buffer#buffers-and-character-encodings) do valor de retorno.
- Retorna: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retorna a chave pública Diffie-Hellman na `encoding` especificada. Se `encoding` for fornecida, uma string será retornada; caso contrário, um [`Buffer`](/pt/nodejs/api/buffer) será retornado.

### `diffieHellman.setPrivateKey(privateKey[, encoding])` {#diffiehellmansetprivatekeyprivatekey-encoding}

**Adicionado em: v0.5.0**

- `privateKey` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A [codificação](/pt/nodejs/api/buffer#buffers-and-character-encodings) da string `privateKey`.

Define a chave privada Diffie-Hellman. Se o argumento `encoding` for fornecido, espera-se que `privateKey` seja uma string. Se nenhuma `encoding` for fornecida, espera-se que `privateKey` seja um [`Buffer`](/pt/nodejs/api/buffer), `TypedArray` ou `DataView`.

Esta função não calcula automaticamente a chave pública associada. [`diffieHellman.setPublicKey()`](/pt/nodejs/api/crypto#diffiehellmansetpublickeypublickey-encoding) ou [`diffieHellman.generateKeys()`](/pt/nodejs/api/crypto#diffiehellmangeneratekeysencoding) podem ser usados para fornecer manualmente a chave pública ou para derivá-la automaticamente.


### `diffieHellman.setPublicKey(publicKey[, encoding])` {#diffiehellmansetpublickeypublickey-encoding}

**Adicionado em: v0.5.0**

- `publicKey` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A [codificação](/pt/nodejs/api/buffer#buffers-and-character-encodings) da string `publicKey`.

Define a chave pública Diffie-Hellman. Se o argumento `encoding` for fornecido, espera-se que `publicKey` seja uma string. Se nenhuma `encoding` for fornecida, espera-se que `publicKey` seja um [`Buffer`](/pt/nodejs/api/buffer), `TypedArray` ou `DataView`.

### `diffieHellman.verifyError` {#diffiehellmanverifyerror}

**Adicionado em: v0.11.12**

Um campo de bits contendo quaisquer avisos e/ou erros resultantes de uma verificação realizada durante a inicialização do objeto `DiffieHellman`.

Os seguintes valores são válidos para esta propriedade (conforme definido no módulo `node:constants`):

- `DH_CHECK_P_NOT_SAFE_PRIME`
- `DH_CHECK_P_NOT_PRIME`
- `DH_UNABLE_TO_CHECK_GENERATOR`
- `DH_NOT_SUITABLE_GENERATOR`

## Classe: `DiffieHellmanGroup` {#class-diffiehellmangroup}

**Adicionado em: v0.7.5**

A classe `DiffieHellmanGroup` recebe um grupo modp bem conhecido como seu argumento. Ela funciona da mesma forma que `DiffieHellman`, exceto que não permite alterar suas chaves após a criação. Em outras palavras, ela não implementa os métodos `setPublicKey()` ou `setPrivateKey()`.

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

Os seguintes grupos são suportados:

- `'modp14'` (2048 bits, [RFC 3526](https://www.rfc-editor.org/rfc/rfc3526.txt) Seção 3)
- `'modp15'` (3072 bits, [RFC 3526](https://www.rfc-editor.org/rfc/rfc3526.txt) Seção 4)
- `'modp16'` (4096 bits, [RFC 3526](https://www.rfc-editor.org/rfc/rfc3526.txt) Seção 5)
- `'modp17'` (6144 bits, [RFC 3526](https://www.rfc-editor.org/rfc/rfc3526.txt) Seção 6)
- `'modp18'` (8192 bits, [RFC 3526](https://www.rfc-editor.org/rfc/rfc3526.txt) Seção 7)

Os seguintes grupos ainda são suportados, mas estão obsoletos (ver [Advertências](/pt/nodejs/api/crypto#support-for-weak-or-compromised-algorithms)):

- `'modp1'` (768 bits, [RFC 2409](https://www.rfc-editor.org/rfc/rfc2409.txt) Seção 6.1)
- `'modp2'` (1024 bits, [RFC 2409](https://www.rfc-editor.org/rfc/rfc2409.txt) Seção 6.2)
- `'modp5'` (1536 bits, [RFC 3526](https://www.rfc-editor.org/rfc/rfc3526.txt) Seção 2)

Esses grupos obsoletos podem ser removidos em versões futuras do Node.js.


## Classe: `ECDH` {#class-ecdh}

**Adicionado em: v0.11.14**

A classe `ECDH` é uma utilidade para criar trocas de chaves Elliptic Curve Diffie-Hellman (ECDH).

Instâncias da classe `ECDH` podem ser criadas usando a função [`crypto.createECDH()`](/pt/nodejs/api/crypto#cryptocreateecdhcurvename).

::: code-group
```js [ESM]
import assert from 'node:assert';

const {
  createECDH,
} = await import('node:crypto');

// Gerar as chaves de Alice...
const alice = createECDH('secp521r1');
const aliceKey = alice.generateKeys();

// Gerar as chaves de Bob...
const bob = createECDH('secp521r1');
const bobKey = bob.generateKeys();

// Trocar e gerar o segredo...
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

// Gerar as chaves de Alice...
const alice = createECDH('secp521r1');
const aliceKey = alice.generateKeys();

// Gerar as chaves de Bob...
const bob = createECDH('secp521r1');
const bobKey = bob.generateKeys();

// Trocar e gerar o segredo...
const aliceSecret = alice.computeSecret(bobKey);
const bobSecret = bob.computeSecret(aliceKey);

assert.strictEqual(aliceSecret.toString('hex'), bobSecret.toString('hex'));
// OK
```
:::

### Método Estático: `ECDH.convertKey(key, curve[, inputEncoding[, outputEncoding[, format]]])` {#static-method-ecdhconvertkeykey-curve-inputencoding-outputencoding-format}

**Adicionado em: v10.0.0**

- `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `curve` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A [codificação](/pt/nodejs/api/buffer#buffers-and-character-encodings) da string `key`.
- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A [codificação](/pt/nodejs/api/buffer#buffers-and-character-encodings) do valor de retorno.
- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Padrão:** `'uncompressed'`
- Retorna: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Converte a chave pública EC Diffie-Hellman especificada por `key` e `curve` para o formato especificado por `format`. O argumento `format` especifica a codificação de ponto e pode ser `'compressed'`, `'uncompressed'` ou `'hybrid'`. A chave fornecida é interpretada usando o `inputEncoding` especificado, e a chave retornada é codificada usando o `outputEncoding` especificado.

Use [`crypto.getCurves()`](/pt/nodejs/api/crypto#cryptogetcurves) para obter uma lista de nomes de curvas disponíveis. Nas versões recentes do OpenSSL, `openssl ecparam -list_curves` também exibirá o nome e a descrição de cada curva elíptica disponível.

Se `format` não for especificado, o ponto será retornado no formato `'uncompressed'`.

Se o `inputEncoding` não for fornecido, espera-se que `key` seja um [`Buffer`](/pt/nodejs/api/buffer), `TypedArray` ou `DataView`.

Exemplo (descompactando uma chave):

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

// A chave convertida e a chave pública não compactada devem ser as mesmas
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

// A chave convertida e a chave pública não compactada devem ser as mesmas
console.log(uncompressedKey === ecdh.getPublicKey('hex'));
```
:::


### `ecdh.computeSecret(otherPublicKey[, inputEncoding][, outputEncoding])` {#ecdhcomputesecretotherpublickey-inputencoding-outputencoding}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v10.0.0 | Formato de erro alterado para melhor suportar erro de chave pública inválida. |
| v6.0.0 | O `inputEncoding` padrão mudou de `binary` para `utf8`. |
| v0.11.14 | Adicionado em: v0.11.14 |
:::

- `otherPublicKey` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A [codificação](/pt/nodejs/api/buffer#buffers-and-character-encodings) da string `otherPublicKey`.
- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A [codificação](/pt/nodejs/api/buffer#buffers-and-character-encodings) do valor de retorno.
- Retorna: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Calcula o segredo compartilhado usando `otherPublicKey` como a chave pública da outra parte e retorna o segredo compartilhado calculado. A chave fornecida é interpretada usando o `inputEncoding` especificado, e o segredo retornado é codificado usando o `outputEncoding` especificado. Se o `inputEncoding` não for fornecido, espera-se que `otherPublicKey` seja um [`Buffer`](/pt/nodejs/api/buffer), `TypedArray` ou `DataView`.

Se `outputEncoding` for fornecido, uma string será retornada; caso contrário, um [`Buffer`](/pt/nodejs/api/buffer) será retornado.

`ecdh.computeSecret` lançará um erro `ERR_CRYPTO_ECDH_INVALID_PUBLIC_KEY` quando `otherPublicKey` estiver fora da curva elíptica. Como `otherPublicKey` geralmente é fornecido por um usuário remoto por meio de uma rede não segura, certifique-se de lidar com essa exceção adequadamente.


### `ecdh.generateKeys([encoding[, format]])` {#ecdhgeneratekeysencoding-format}

**Adicionado em: v0.11.14**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A [codificação](/pt/nodejs/api/buffer#buffers-and-character-encodings) do valor de retorno.
- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Padrão:** `'uncompressed'`
- Retorna: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Gera valores de chave privada e pública EC Diffie-Hellman, e retorna a chave pública no `formato` e `codificação` especificados. Esta chave deve ser transferida para a outra parte.

O argumento `format` especifica a codificação do ponto e pode ser `'compressed'` ou `'uncompressed'`. Se `format` não for especificado, o ponto será retornado no formato `'uncompressed'`.

Se `encoding` for fornecido, uma string será retornada; caso contrário, um [`Buffer`](/pt/nodejs/api/buffer) será retornado.

### `ecdh.getPrivateKey([encoding])` {#ecdhgetprivatekeyencoding}

**Adicionado em: v0.11.14**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A [codificação](/pt/nodejs/api/buffer#buffers-and-character-encodings) do valor de retorno.
- Retorna: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O EC Diffie-Hellman na `codificação` especificada.

Se `encoding` for especificado, uma string será retornada; caso contrário, um [`Buffer`](/pt/nodejs/api/buffer) será retornado.

### `ecdh.getPublicKey([encoding][, format])` {#ecdhgetpublickeyencoding-format}

**Adicionado em: v0.11.14**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A [codificação](/pt/nodejs/api/buffer#buffers-and-character-encodings) do valor de retorno.
- `format` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Padrão:** `'uncompressed'`
- Retorna: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A chave pública EC Diffie-Hellman na `codificação` e `formato` especificados.

O argumento `format` especifica a codificação do ponto e pode ser `'compressed'` ou `'uncompressed'`. Se `format` não for especificado, o ponto será retornado no formato `'uncompressed'`.

Se `encoding` for especificado, uma string será retornada; caso contrário, um [`Buffer`](/pt/nodejs/api/buffer) será retornado.


### `ecdh.setPrivateKey(privateKey[, encoding])` {#ecdhsetprivatekeyprivatekey-encoding}

**Adicionado em: v0.11.14**

- `privateKey` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A [codificação](/pt/nodejs/api/buffer#buffers-and-character-encodings) da string `privateKey`.

Define a chave privada EC Diffie-Hellman. Se `encoding` for fornecido, espera-se que `privateKey` seja uma string; caso contrário, espera-se que `privateKey` seja um [`Buffer`](/pt/nodejs/api/buffer), `TypedArray` ou `DataView`.

Se `privateKey` não for válida para a curva especificada quando o objeto `ECDH` foi criado, um erro será lançado. Ao definir a chave privada, o ponto (chave) público associado também é gerado e definido no objeto `ECDH`.

### `ecdh.setPublicKey(publicKey[, encoding])` {#ecdhsetpublickeypublickey-encoding}

**Adicionado em: v0.11.14**

**Obsoleto desde: v5.2.0**

::: danger [Estável: 0 - Obsoleto]
[Estável: 0](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 0](/pt/nodejs/api/documentation#stability-index) - Obsoleto
:::

- `publicKey` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A [codificação](/pt/nodejs/api/buffer#buffers-and-character-encodings) da string `publicKey`.

Define a chave pública EC Diffie-Hellman. Se `encoding` for fornecido, espera-se que `publicKey` seja uma string; caso contrário, espera-se um [`Buffer`](/pt/nodejs/api/buffer), `TypedArray` ou `DataView`.

Normalmente, não há razão para chamar este método, pois `ECDH` requer apenas uma chave privada e a chave pública da outra parte para calcular o segredo compartilhado. Normalmente, [`ecdh.generateKeys()`](/pt/nodejs/api/crypto#ecdhgeneratekeysencoding-format) ou [`ecdh.setPrivateKey()`](/pt/nodejs/api/crypto#ecdhsetprivatekeyprivatekey-encoding) serão chamados. O método [`ecdh.setPrivateKey()`](/pt/nodejs/api/crypto#ecdhsetprivatekeyprivatekey-encoding) tenta gerar o ponto/chave público associado à chave privada que está sendo definida.

Exemplo (obtendo um segredo compartilhado):

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


## Classe: `Hash` {#class-hash}

**Adicionado em: v0.1.92**

- Estende: [\<stream.Transform\>](/pt/nodejs/api/stream#class-streamtransform)

A classe `Hash` é uma utilidade para criar resumos de hash de dados. Ela pode ser usada de duas maneiras:

- Como um [stream](/pt/nodejs/api/stream) que é legível e gravável, onde os dados são escritos para produzir um resumo de hash computado no lado legível, ou
- Usando os métodos [`hash.update()`](/pt/nodejs/api/crypto#hashupdatedata-inputencoding) e [`hash.digest()`](/pt/nodejs/api/crypto#hashdigestencoding) para produzir o hash computado.

O método [`crypto.createHash()`](/pt/nodejs/api/crypto#cryptocreatehashalgorithm-options) é usado para criar instâncias de `Hash`. Objetos `Hash` não devem ser criados diretamente usando a palavra-chave `new`.

Exemplo: Usando objetos `Hash` como streams:

::: code-group
```js [ESM]
const {
  createHash,
} = await import('node:crypto');

const hash = createHash('sha256');

hash.on('readable', () => {
  // Apenas um elemento será produzido pelo
  // stream de hash.
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
  // Apenas um elemento será produzido pelo
  // stream de hash.
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

Exemplo: Usando `Hash` e streams encadeados:

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

Exemplo: Usando os métodos [`hash.update()`](/pt/nodejs/api/crypto#hashupdatedata-inputencoding) e [`hash.digest()`](/pt/nodejs/api/crypto#hashdigestencoding):

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

**Adicionado em: v13.1.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.transform` options](/pt/nodejs/api/stream#new-streamtransformoptions)
- Retorna: [\<Hash\>](/pt/nodejs/api/crypto#class-hash)

Cria um novo objeto `Hash` que contém uma cópia profunda do estado interno do objeto `Hash` atual.

O argumento opcional `options` controla o comportamento do stream. Para funções hash XOF como `'shake256'`, a opção `outputLength` pode ser usada para especificar o comprimento de saída desejado em bytes.

Um erro é lançado quando uma tentativa é feita para copiar o objeto `Hash` após o método [`hash.digest()`](/pt/nodejs/api/crypto#hashdigestencoding) ter sido chamado.

::: code-group
```js [ESM]
// Calcular um hash rotativo.
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
// Calcular um hash rotativo.
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

**Adicionado em: v0.1.92**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A [codificação](/pt/nodejs/api/buffer#buffers-and-character-encodings) do valor de retorno.
- Retorna: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Calcula o resumo de todos os dados passados para serem hashed (usando o método [`hash.update()`](/pt/nodejs/api/crypto#hashupdatedata-inputencoding)). Se `encoding` for fornecido, uma string será retornada; caso contrário, um [`Buffer`](/pt/nodejs/api/buffer) será retornado.

O objeto `Hash` não pode ser usado novamente após o método `hash.digest()` ter sido chamado. Várias chamadas farão com que um erro seja lançado.


### `hash.update(data[, inputEncoding])` {#hashupdatedata-inputencoding}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v6.0.0 | O `inputEncoding` padrão mudou de `binary` para `utf8`. |
| v0.1.92 | Adicionado em: v0.1.92 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A [codificação](/pt/nodejs/api/buffer#buffers-and-character-encodings) da string `data`.

Atualiza o conteúdo do hash com os `data` fornecidos, cuja codificação é fornecida em `inputEncoding`. Se `encoding` não for fornecido e os `data` forem uma string, uma codificação de `'utf8'` será aplicada. Se `data` for um [`Buffer`](/pt/nodejs/api/buffer), `TypedArray` ou `DataView`, então `inputEncoding` é ignorado.

Isso pode ser chamado várias vezes com novos dados à medida que são transmitidos.

## Classe: `Hmac` {#class-hmac}

**Adicionado em: v0.1.94**

- Estende: [\<stream.Transform\>](/pt/nodejs/api/stream#class-streamtransform)

A classe `Hmac` é uma utilidade para criar resumos criptográficos HMAC. Ele pode ser usado de uma das duas maneiras:

- Como um [stream](/pt/nodejs/api/stream) que é legível e gravável, onde os dados são gravados para produzir um resumo HMAC computado no lado legível, ou
- Usando os métodos [`hmac.update()`](/pt/nodejs/api/crypto#hmacupdatedata-inputencoding) e [`hmac.digest()`](/pt/nodejs/api/crypto#hmacdigestencoding) para produzir o resumo HMAC computado.

O método [`crypto.createHmac()`](/pt/nodejs/api/crypto#cryptocreatehmacalgorithm-key-options) é usado para criar instâncias `Hmac`. Os objetos `Hmac` não devem ser criados diretamente usando a palavra-chave `new`.

Exemplo: Usando objetos `Hmac` como streams:

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

Exemplo: Usando `Hmac` e streams canalizados:

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

Exemplo: Usando os métodos [`hmac.update()`](/pt/nodejs/api/crypto#hmacupdatedata-inputencoding) e [`hmac.digest()`](/pt/nodejs/api/crypto#hmacdigestencoding):

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

**Adicionado em: v0.1.94**

- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A [codificação](/pt/nodejs/api/buffer#buffers-and-character-encodings) do valor de retorno.
- Retorna: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Calcula o resumo HMAC de todos os dados passados usando [`hmac.update()`](/pt/nodejs/api/crypto#hmacupdatedata-inputencoding). Se `encoding` for fornecido, uma string será retornada; caso contrário, um [`Buffer`](/pt/nodejs/api/buffer) será retornado;

O objeto `Hmac` não pode ser usado novamente após `hmac.digest()` ter sido chamado. Várias chamadas para `hmac.digest()` resultarão em um erro sendo lançado.

### `hmac.update(data[, inputEncoding])` {#hmacupdatedata-inputencoding}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v6.0.0 | O `inputEncoding` padrão mudou de `binary` para `utf8`. |
| v0.1.94 | Adicionado em: v0.1.94 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A [codificação](/pt/nodejs/api/buffer#buffers-and-character-encodings) da string `data`.

Atualiza o conteúdo `Hmac` com os `data` fornecidos, cuja codificação é fornecida em `inputEncoding`. Se `encoding` não for fornecido e os `data` forem uma string, uma codificação de `'utf8'` será imposta. Se `data` for um [`Buffer`](/pt/nodejs/api/buffer), `TypedArray` ou `DataView`, então `inputEncoding` será ignorado.

Isto pode ser chamado várias vezes com novos dados à medida que são transmitidos.

## Classe: `KeyObject` {#class-keyobject}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v14.5.0, v12.19.0 | Instâncias desta classe agora podem ser passadas para threads de worker usando `postMessage`. |
| v11.13.0 | Esta classe agora é exportada. |
| v11.6.0 | Adicionado em: v11.6.0 |
:::

O Node.js usa uma classe `KeyObject` para representar uma chave simétrica ou assimétrica, e cada tipo de chave expõe funções diferentes. Os métodos [`crypto.createSecretKey()`](/pt/nodejs/api/crypto#cryptocreatesecretkeykey-encoding), [`crypto.createPublicKey()`](/pt/nodejs/api/crypto#cryptocreatepublickeykey) e [`crypto.createPrivateKey()`](/pt/nodejs/api/crypto#cryptocreateprivatekeykey) são usados para criar instâncias de `KeyObject`. Objetos `KeyObject` não devem ser criados diretamente usando a palavra-chave `new`.

A maioria das aplicações devem considerar usar a nova API `KeyObject` em vez de passar chaves como strings ou `Buffer`s devido aos recursos de segurança aprimorados.

Instâncias de `KeyObject` podem ser passadas para outras threads através de [`postMessage()`](/pt/nodejs/api/worker_threads#portpostmessagevalue-transferlist). O receptor obtém um `KeyObject` clonado, e o `KeyObject` não precisa ser listado no argumento `transferList`.


### Método estático: `KeyObject.from(key)` {#static-method-keyobjectfromkey}

**Adicionado em: v15.0.0**

- `key` [\<CryptoKey\>](/pt/nodejs/api/webcrypto#class-cryptokey)
- Retorna: [\<KeyObject\>](/pt/nodejs/api/crypto#class-keyobject)

Exemplo: Convertendo uma instância `CryptoKey` para um `KeyObject`:

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
// Prints: 32 (tamanho da chave simétrica em bytes)
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
  // Prints: 32 (tamanho da chave simétrica em bytes)
})();
```
:::

### `keyObject.asymmetricKeyDetails` {#keyobjectasymmetrickeydetails}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v16.9.0 | Expõe os parâmetros de sequência `RSASSA-PSS-params` para chaves RSA-PSS. |
| v15.7.0 | Adicionado em: v15.7.0 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `modulusLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Tamanho da chave em bits (RSA, DSA).
    - `publicExponent`: [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) Expoente público (RSA).
    - `hashAlgorithm`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome do resumo da mensagem (RSA-PSS).
    - `mgf1HashAlgorithm`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome do resumo da mensagem usado pelo MGF1 (RSA-PSS).
    - `saltLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Tamanho mínimo do salt em bytes (RSA-PSS).
    - `divisorLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Tamanho de `q` em bits (DSA).
    - `namedCurve`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome da curva (EC).

Esta propriedade existe apenas em chaves assimétricas. Dependendo do tipo da chave, este objeto contém informações sobre a chave. Nenhuma das informações obtidas por meio desta propriedade pode ser usada para identificar exclusivamente uma chave ou para comprometer a segurança da chave.

Para chaves RSA-PSS, se o material da chave contiver uma sequência `RSASSA-PSS-params`, as propriedades `hashAlgorithm`, `mgf1HashAlgorithm` e `saltLength` serão definidas.

Outros detalhes da chave podem ser expostos por meio desta API usando atributos adicionais.


### `keyObject.asymmetricKeyType` {#keyobjectasymmetrickeytype}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v13.9.0, v12.17.0 | Adicionado suporte para `'dh'`. |
| v12.0.0 | Adicionado suporte para `'rsa-pss'`. |
| v12.0.0 | Esta propriedade agora retorna `undefined` para instâncias de KeyObject de tipo não reconhecido em vez de abortar. |
| v12.0.0 | Adicionado suporte para `'x25519'` e `'x448'`. |
| v12.0.0 | Adicionado suporte para `'ed25519'` e `'ed448'`. |
| v11.6.0 | Adicionado em: v11.6.0 |
:::

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Para chaves assimétricas, esta propriedade representa o tipo da chave. Os tipos de chave suportados são:

- `'rsa'` (OID 1.2.840.113549.1.1.1)
- `'rsa-pss'` (OID 1.2.840.113549.1.1.10)
- `'dsa'` (OID 1.2.840.10040.4.1)
- `'ec'` (OID 1.2.840.10045.2.1)
- `'x25519'` (OID 1.3.101.110)
- `'x448'` (OID 1.3.101.111)
- `'ed25519'` (OID 1.3.101.112)
- `'ed448'` (OID 1.3.101.113)
- `'dh'` (OID 1.2.840.113549.1.3.1)

Esta propriedade é `undefined` para tipos `KeyObject` não reconhecidos e chaves simétricas.

### `keyObject.equals(otherKeyObject)` {#keyobjectequalsotherkeyobject}

**Adicionado em: v17.7.0, v16.15.0**

- `otherKeyObject`: [\<KeyObject\>](/pt/nodejs/api/crypto#class-keyobject) Um `KeyObject` com o qual comparar `keyObject`.
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Retorna `true` ou `false` dependendo se as chaves têm exatamente o mesmo tipo, valor e parâmetros. Este método não é [tempo constante](https://en.wikipedia.org/wiki/Timing_attack).

### `keyObject.export([options])` {#keyobjectexportoptions}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v15.9.0 | Adicionado suporte para o formato `'jwk'`. |
| v11.6.0 | Adicionado em: v11.6.0 |
:::

- `options`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Para chaves simétricas, as seguintes opções de codificação podem ser usadas:

- `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve ser `'buffer'` (padrão) ou `'jwk'`.

Para chaves públicas, as seguintes opções de codificação podem ser usadas:

- `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve ser um de `'pkcs1'` (somente RSA) ou `'spki'`.
- `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve ser `'pem'`, `'der'` ou `'jwk'`.

Para chaves privadas, as seguintes opções de codificação podem ser usadas:

- `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve ser um de `'pkcs1'` (somente RSA), `'pkcs8'` ou `'sec1'` (somente EC).
- `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve ser `'pem'`, `'der'` ou `'jwk'`.
- `cipher`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Se especificado, a chave privada será criptografada com o `cipher` e `passphrase` fornecidos usando a criptografia baseada em senha PKCS#5 v2.0.
- `passphrase`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) A senha a ser usada para criptografia, consulte `cipher`.

O tipo de resultado depende do formato de codificação selecionado, quando PEM o resultado é uma string, quando DER será um buffer contendo os dados codificados como DER, quando [JWK](https://tools.ietf.org/html/rfc7517) será um objeto.

Quando o formato de codificação [JWK](https://tools.ietf.org/html/rfc7517) foi selecionado, todas as outras opções de codificação são ignoradas.

Chaves do tipo PKCS#1, SEC1 e PKCS#8 podem ser criptografadas usando uma combinação das opções `cipher` e `format`. O `type` PKCS#8 pode ser usado com qualquer `format` para criptografar qualquer algoritmo de chave (RSA, EC ou DH) especificando um `cipher`. PKCS#1 e SEC1 só podem ser criptografados especificando um `cipher` quando o `format` PEM é usado. Para máxima compatibilidade, use PKCS#8 para chaves privadas criptografadas. Como o PKCS#8 define seu próprio mecanismo de criptografia, a criptografia em nível PEM não é suportada ao criptografar uma chave PKCS#8. Consulte [RFC 5208](https://www.rfc-editor.org/rfc/rfc5208.txt) para criptografia PKCS#8 e [RFC 1421](https://www.rfc-editor.org/rfc/rfc1421.txt) para criptografia PKCS#1 e SEC1.


### `keyObject.symmetricKeySize` {#keyobjectsymmetrickeysize}

**Adicionado em: v11.6.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Para chaves secretas, esta propriedade representa o tamanho da chave em bytes. Esta propriedade é `undefined` para chaves assimétricas.

### `keyObject.toCryptoKey(algorithm, extractable, keyUsages)` {#keyobjecttocryptokeyalgorithm-extractable-keyusages}

**Adicionado em: v23.0.0**

- `algorithm`: [\<AlgorithmIdentifier\>](/pt/nodejs/api/webcrypto#class-algorithmidentifier) | [\<RsaHashedImportParams\>](/pt/nodejs/api/webcrypto#class-rsahashedimportparams) | [\<EcKeyImportParams\>](/pt/nodejs/api/webcrypto#class-eckeyimportparams) | [\<HmacImportParams\>](/pt/nodejs/api/webcrypto#class-hmacimportparams)

- `extractable`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)
- `keyUsages`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Veja [Usos de Chave](/pt/nodejs/api/webcrypto#cryptokeyusages).
- Retorna: [\<CryptoKey\>](/pt/nodejs/api/webcrypto#class-cryptokey)

Converte uma instância de `KeyObject` para uma `CryptoKey`.

### `keyObject.type` {#keyobjecttype}

**Adicionado em: v11.6.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Dependendo do tipo deste `KeyObject`, esta propriedade é `'secret'` para chaves secretas (simétricas), `'public'` para chaves públicas (assimétricas) ou `'private'` para chaves privadas (assimétricas).

## Classe: `Sign` {#class-sign}

**Adicionado em: v0.1.92**

- Estende: [\<stream.Writable\>](/pt/nodejs/api/stream#class-streamwritable)

A classe `Sign` é uma utilidade para gerar assinaturas. Ela pode ser usada de duas maneiras:

- Como um [stream](/pt/nodejs/api/stream) gravável, onde os dados a serem assinados são escritos e o método [`sign.sign()`](/pt/nodejs/api/crypto#signsignprivatekey-outputencoding) é usado para gerar e retornar a assinatura, ou
- Usando os métodos [`sign.update()`](/pt/nodejs/api/crypto#signupdatedata-inputencoding) e [`sign.sign()`](/pt/nodejs/api/crypto#signsignprivatekey-outputencoding) para produzir a assinatura.

O método [`crypto.createSign()`](/pt/nodejs/api/crypto#cryptocreatesignalgorithm-options) é usado para criar instâncias de `Sign`. O argumento é o nome em string da função de hash a ser usada. Objetos `Sign` não devem ser criados diretamente usando a palavra-chave `new`.

Exemplo: Usando objetos `Sign` e [`Verify`](/pt/nodejs/api/crypto#class-verify) como streams:

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

Exemplo: Usando os métodos [`sign.update()`](/pt/nodejs/api/crypto#signupdatedata-inputencoding) e [`verify.update()`](/pt/nodejs/api/crypto#verifyupdatedata-inputencoding):

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

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v15.0.0 | O privateKey também pode ser um ArrayBuffer e CryptoKey. |
| v13.2.0, v12.16.0 | Esta função agora suporta assinaturas IEEE-P1363 DSA e ECDSA. |
| v12.0.0 | Esta função agora suporta chaves RSA-PSS. |
| v11.6.0 | Esta função agora suporta objetos de chave. |
| v8.0.0 | Foi adicionado suporte para RSASSA-PSS e opções adicionais. |
| v0.1.92 | Adicionado em: v0.1.92 |
:::

- `privateKey` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/pt/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/pt/nodejs/api/webcrypto#class-cryptokey) 
    - `dsaEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `padding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `saltLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
  
 
- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A [codificação](/pt/nodejs/api/buffer#buffers-and-character-encodings) do valor de retorno.
- Retorna: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Calcula a assinatura em todos os dados passados usando [`sign.update()`](/pt/nodejs/api/crypto#signupdatedata-inputencoding) ou [`sign.write()`](/pt/nodejs/api/stream#writablewritechunk-encoding-callback).

Se `privateKey` não for um [`KeyObject`](/pt/nodejs/api/crypto#class-keyobject), esta função se comporta como se `privateKey` tivesse sido passado para [`crypto.createPrivateKey()`](/pt/nodejs/api/crypto#cryptocreateprivatekeykey). Se for um objeto, as seguintes propriedades adicionais podem ser passadas:

-  `dsaEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Para DSA e ECDSA, esta opção especifica o formato da assinatura gerada. Pode ser um dos seguintes: 
    - `'der'` (padrão): estrutura de assinatura ASN.1 codificada em DER codificando `(r, s)`.
    - `'ieee-p1363'`: Formato de assinatura `r || s` conforme proposto em IEEE-P1363.
  
 
-  `padding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Valor de preenchimento opcional para RSA, um dos seguintes: 
    - `crypto.constants.RSA_PKCS1_PADDING` (padrão)
    - `crypto.constants.RSA_PKCS1_PSS_PADDING`
  
 `RSA_PKCS1_PSS_PADDING` usará MGF1 com a mesma função de hash usada para assinar a mensagem, conforme especificado na seção 3.1 do [RFC 4055](https://www.rfc-editor.org/rfc/rfc4055.txt), a menos que uma função de hash MGF1 tenha sido especificada como parte da chave em conformidade com a seção 3.3 do [RFC 4055](https://www.rfc-editor.org/rfc/rfc4055.txt). 
-  `saltLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Comprimento do sal para quando o preenchimento for `RSA_PKCS1_PSS_PADDING`. O valor especial `crypto.constants.RSA_PSS_SALTLEN_DIGEST` define o comprimento do sal para o tamanho do digest, `crypto.constants.RSA_PSS_SALTLEN_MAX_SIGN` (padrão) define-o para o valor máximo permitido. 

Se `outputEncoding` for fornecido, uma string será retornada; caso contrário, um [`Buffer`](/pt/nodejs/api/buffer) será retornado.

O objeto `Sign` não pode ser usado novamente após a chamada do método `sign.sign()`. Várias chamadas para `sign.sign()` resultarão em um erro sendo lançado.


### `sign.update(data[, inputEncoding])` {#signupdatedata-inputencoding}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v6.0.0 | O `inputEncoding` padrão foi alterado de `binary` para `utf8`. |
| v0.1.92 | Adicionado em: v0.1.92 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A [codificação](/pt/nodejs/api/buffer#buffers-and-character-encodings) da string `data`.

Atualiza o conteúdo do `Sign` com os dados fornecidos em `data`, cuja codificação é fornecida em `inputEncoding`. Se `encoding` não for fornecido e os `data` forem uma string, uma codificação de `'utf8'` será aplicada. Se `data` for um [`Buffer`](/pt/nodejs/api/buffer), `TypedArray` ou `DataView`, então `inputEncoding` é ignorado.

Isso pode ser chamado várias vezes com novos dados à medida que são transmitidos.

## Classe: `Verify` {#class-verify}

**Adicionado em: v0.1.92**

- Estende: [\<stream.Writable\>](/pt/nodejs/api/stream#class-streamwritable)

A classe `Verify` é um utilitário para verificar assinaturas. Ele pode ser usado de duas maneiras:

- Como um [stream](/pt/nodejs/api/stream) gravável onde os dados gravados são usados para validar a assinatura fornecida, ou
- Usando os métodos [`verify.update()`](/pt/nodejs/api/crypto#verifyupdatedata-inputencoding) e [`verify.verify()`](/pt/nodejs/api/crypto#verifyverifyobject-signature-signatureencoding) para verificar a assinatura.

O método [`crypto.createVerify()`](/pt/nodejs/api/crypto#cryptocreateverifyalgorithm-options) é usado para criar instâncias de `Verify`. Os objetos `Verify` não devem ser criados diretamente usando a palavra-chave `new`.

Veja [`Sign`](/pt/nodejs/api/crypto#class-sign) para exemplos.

### `verify.update(data[, inputEncoding])` {#verifyupdatedata-inputencoding}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v6.0.0 | O `inputEncoding` padrão foi alterado de `binary` para `utf8`. |
| v0.1.92 | Adicionado em: v0.1.92 |
:::

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `inputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A [codificação](/pt/nodejs/api/buffer#buffers-and-character-encodings) da string `data`.

Atualiza o conteúdo do `Verify` com os dados fornecidos em `data`, cuja codificação é fornecida em `inputEncoding`. Se `inputEncoding` não for fornecido e os `data` forem uma string, uma codificação de `'utf8'` será aplicada. Se `data` for um [`Buffer`](/pt/nodejs/api/buffer), `TypedArray` ou `DataView`, então `inputEncoding` é ignorado.

Isso pode ser chamado várias vezes com novos dados à medida que são transmitidos.


### `verify.verify(object, signature[, signatureEncoding])` {#verifyverifyobject-signature-signatureencoding}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v15.0.0 | O objeto também pode ser um ArrayBuffer e CryptoKey. |
| v13.2.0, v12.16.0 | Esta função agora suporta assinaturas IEEE-P1363 DSA e ECDSA. |
| v12.0.0 | Esta função agora suporta chaves RSA-PSS. |
| v11.7.0 | A chave agora pode ser uma chave privada. |
| v8.0.0 | Foi adicionado suporte para RSASSA-PSS e opções adicionais. |
| v0.1.92 | Adicionado em: v0.1.92 |
:::

- `object` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/pt/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/pt/nodejs/api/webcrypto#class-cryptokey)
    - `dsaEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
    - `padding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
    - `saltLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

- `signature` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `signatureEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A [codificação](/pt/nodejs/api/buffer#buffers-and-character-encodings) da string `signature`.
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` ou `false` dependendo da validade da assinatura para os dados e a chave pública.

Verifica os dados fornecidos usando o `object` e a `signature` fornecidos.

Se `object` não for um [`KeyObject`](/pt/nodejs/api/crypto#class-keyobject), esta função se comporta como se `object` tivesse sido passado para [`crypto.createPublicKey()`](/pt/nodejs/api/crypto#cryptocreatepublickeykey). Se for um objeto, as seguintes propriedades adicionais podem ser passadas:

- `dsaEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Para DSA e ECDSA, esta opção especifica o formato da assinatura. Pode ser um dos seguintes:
    - `'der'` (padrão): Estrutura de assinatura ASN.1 com codificação DER codificando `(r, s)`.
    - `'ieee-p1363'`: Formato de assinatura `r || s` conforme proposto em IEEE-P1363.

- `padding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Valor de preenchimento opcional para RSA, um dos seguintes:
    - `crypto.constants.RSA_PKCS1_PADDING` (padrão)
    - `crypto.constants.RSA_PKCS1_PSS_PADDING`

`RSA_PKCS1_PSS_PADDING` usará MGF1 com a mesma função de hash usada para verificar a mensagem, conforme especificado na seção 3.1 do [RFC 4055](https://www.rfc-editor.org/rfc/rfc4055.txt), a menos que uma função de hash MGF1 tenha sido especificada como parte da chave em conformidade com a seção 3.3 do [RFC 4055](https://www.rfc-editor.org/rfc/rfc4055.txt).
- `saltLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Comprimento do salt para quando o preenchimento é `RSA_PKCS1_PSS_PADDING`. O valor especial `crypto.constants.RSA_PSS_SALTLEN_DIGEST` define o comprimento do salt para o tamanho do digest, `crypto.constants.RSA_PSS_SALTLEN_AUTO` (padrão) faz com que ele seja determinado automaticamente.

O argumento `signature` é a assinatura previamente calculada para os dados, na `signatureEncoding`. Se uma `signatureEncoding` for especificada, espera-se que a `signature` seja uma string; caso contrário, espera-se que a `signature` seja um [`Buffer`](/pt/nodejs/api/buffer), `TypedArray` ou `DataView`.

O objeto `verify` não pode ser usado novamente depois que `verify.verify()` foi chamado. Várias chamadas para `verify.verify()` resultarão em um erro sendo lançado.

Como as chaves públicas podem ser derivadas de chaves privadas, uma chave privada pode ser passada em vez de uma chave pública.


## Classe: `X509Certificate` {#class-x509certificate}

**Adicionado em: v15.6.0**

Encapsula um certificado X509 e fornece acesso somente leitura às suas informações.

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

**Adicionado em: v15.6.0**

- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Um Certificado X509 codificado em PEM ou DER.

### `x509.ca` {#x509ca}

**Adicionado em: v15.6.0**

- Tipo: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Será `true` se este for um certificado de Autoridade de Certificação (CA).

### `x509.checkEmail(email[, options])` {#x509checkemailemail-options}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | A opção subject agora tem como padrão `'default'`. |
| v17.5.0, v16.15.0 | A opção subject agora pode ser definida como `'default'`. |
| v17.5.0, v16.14.1 | As opções `wildcards`, `partialWildcards`, `multiLabelWildcards` e `singleLabelSubdomains` foram removidas, pois não tinham efeito. |
| v15.6.0 | Adicionado em: v15.6.0 |
:::

- `email` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `subject` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'default'`, `'always'` ou `'never'`. **Padrão:** `'default'`.

- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Retorna `email` se o certificado corresponder, `undefined` se não corresponder.

Verifica se o certificado corresponde ao endereço de e-mail fornecido.

Se a opção `'subject'` não estiver definida ou estiver definida como `'default'`, o assunto do certificado só será considerado se a extensão de nome alternativo do assunto não existir ou não contiver nenhum endereço de e-mail.

Se a opção `'subject'` estiver definida como `'always'` e se a extensão de nome alternativo do assunto não existir ou não contiver um endereço de e-mail correspondente, o assunto do certificado será considerado.

Se a opção `'subject'` estiver definida como `'never'`, o assunto do certificado nunca será considerado, mesmo que o certificado não contenha nomes alternativos de assunto.


### `x509.checkHost(name[, options])` {#x509checkhostname-options}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | A opção subject agora usa o valor padrão `'default'`. |
| v17.5.0, v16.15.0 | A opção subject agora pode ser definida como `'default'`. |
| v15.6.0 | Adicionado em: v15.6.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `subject` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'default'`, `'always'` ou `'never'`. **Padrão:** `'default'`.
    - `wildcards` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Padrão:** `true`.
    - `partialWildcards` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Padrão:** `true`.
    - `multiLabelWildcards` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Padrão:** `false`.
    - `singleLabelSubdomains` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Padrão:** `false`.

- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Retorna um nome de assunto que corresponde a `name` ou `undefined` se nenhum nome de assunto corresponder a `name`.

Verifica se o certificado corresponde ao nome de host fornecido.

Se o certificado corresponder ao nome de host fornecido, o nome do assunto correspondente será retornado. O nome retornado pode ser uma correspondência exata (por exemplo, `foo.example.com`) ou pode conter curingas (por exemplo, `*.example.com`). Como as comparações de nome de host não diferenciam maiúsculas de minúsculas, o nome do assunto retornado também pode diferir do `name` fornecido na capitalização.

Se a opção `'subject'` for indefinida ou definida como `'default'`, o assunto do certificado só será considerado se a extensão de nome alternativo do assunto não existir ou não contiver nenhum nome DNS. Esse comportamento é consistente com [RFC 2818](https://www.rfc-editor.org/rfc/rfc2818.txt) ("HTTP Over TLS").

Se a opção `'subject'` estiver definida como `'always'` e se a extensão de nome alternativo do assunto não existir ou não contiver um nome DNS correspondente, o assunto do certificado será considerado.

Se a opção `'subject'` estiver definida como `'never'`, o assunto do certificado nunca será considerado, mesmo que o certificado não contenha nomes alternativos de assunto.


### `x509.checkIP(ip)` {#x509checkipip}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v17.5.0, v16.14.1 | O argumento `options` foi removido pois não tinha efeito. |
| v15.6.0 | Adicionado em: v15.6.0 |
:::

- `ip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Retorna `ip` se o certificado corresponder, `undefined` se não corresponder.

Verifica se o certificado corresponde ao endereço IP fornecido (IPv4 ou IPv6).

Apenas nomes alternativos de assunto `iPAddress` [RFC 5280](https://www.rfc-editor.org/rfc/rfc5280.txt) são considerados, e eles devem corresponder exatamente ao endereço `ip` fornecido. Outros nomes alternativos de assunto, bem como o campo de assunto do certificado, são ignorados.

### `x509.checkIssued(otherCert)` {#x509checkissuedothercert}

**Adicionado em: v15.6.0**

- `otherCert` [\<X509Certificate\>](/pt/nodejs/api/crypto#class-x509certificate)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Verifica se este certificado foi emitido pelo `otherCert` fornecido.

### `x509.checkPrivateKey(privateKey)` {#x509checkprivatekeyprivatekey}

**Adicionado em: v15.6.0**

- `privateKey` [\<KeyObject\>](/pt/nodejs/api/crypto#class-keyobject) Uma chave privada.
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Verifica se a chave pública para este certificado é consistente com a chave privada fornecida.

### `x509.extKeyUsage` {#x509extkeyusage}

**Adicionado em: v15.6.0**

- Tipo: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Um array detalhando os usos estendidos da chave para este certificado.

### `x509.fingerprint` {#x509fingerprint}

**Adicionado em: v15.6.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

A impressão digital SHA-1 deste certificado.

Como o SHA-1 é criptograficamente quebrado e porque a segurança do SHA-1 é significativamente pior do que a dos algoritmos que são comumente usados para assinar certificados, considere usar [`x509.fingerprint256`](/pt/nodejs/api/crypto#x509fingerprint256) em vez disso.


### `x509.fingerprint256` {#x509fingerprint256}

**Adicionado em: v15.6.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

A impressão digital SHA-256 deste certificado.

### `x509.fingerprint512` {#x509fingerprint512}

**Adicionado em: v17.2.0, v16.14.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

A impressão digital SHA-512 deste certificado.

Como o cálculo da impressão digital SHA-256 geralmente é mais rápido e porque tem apenas metade do tamanho da impressão digital SHA-512, [`x509.fingerprint256`](/pt/nodejs/api/crypto#x509fingerprint256) pode ser uma escolha melhor. Embora o SHA-512 presumivelmente forneça um nível mais alto de segurança em geral, a segurança do SHA-256 corresponde à da maioria dos algoritmos comumente usados para assinar certificados.

### `x509.infoAccess` {#x509infoaccess}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v17.3.1, v16.13.2 | Partes desta string podem ser codificadas como literais de string JSON em resposta à CVE-2021-44532. |
| v15.6.0 | Adicionado em: v15.6.0 |
:::

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Uma representação textual da extensão de acesso às informações da autoridade do certificado.

Esta é uma lista separada por quebras de linha de descrições de acesso. Cada linha começa com o método de acesso e o tipo do local de acesso, seguido por dois pontos e o valor associado ao local de acesso.

Após o prefixo que denota o método de acesso e o tipo do local de acesso, o restante de cada linha pode ser colocado entre aspas para indicar que o valor é um literal de string JSON. Para compatibilidade com versões anteriores, o Node.js usa literais de string JSON nesta propriedade apenas quando necessário para evitar ambiguidade. O código de terceiros deve estar preparado para lidar com os dois formatos de entrada possíveis.

### `x509.issuer` {#x509issuer}

**Adicionado em: v15.6.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

A identificação do emissor incluída neste certificado.


### `x509.issuerCertificate` {#x509issuercertificate}

**Adicionado em: v15.9.0**

- Tipo: [\<X509Certificate\>](/pt/nodejs/api/crypto#class-x509certificate)

O certificado do emissor ou `undefined` se o certificado do emissor não estiver disponível.

### `x509.publicKey` {#x509publickey}

**Adicionado em: v15.6.0**

- Tipo: [\<KeyObject\>](/pt/nodejs/api/crypto#class-keyobject)

A chave pública [\<KeyObject\>](/pt/nodejs/api/crypto#class-keyobject) para este certificado.

### `x509.raw` {#x509raw}

**Adicionado em: v15.6.0**

- Tipo: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer)

Um `Buffer` contendo a codificação DER deste certificado.

### `x509.serialNumber` {#x509serialnumber}

**Adicionado em: v15.6.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

O número de série deste certificado.

Os números de série são atribuídos por autoridades de certificação e não identificam exclusivamente os certificados. Considere usar [`x509.fingerprint256`](/pt/nodejs/api/crypto#x509fingerprint256) como um identificador exclusivo.

### `x509.subject` {#x509subject}

**Adicionado em: v15.6.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

O assunto completo deste certificado.

### `x509.subjectAltName` {#x509subjectaltname}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v17.3.1, v16.13.2 | Partes desta string podem ser codificadas como literais de string JSON em resposta ao CVE-2021-44532. |
| v15.6.0 | Adicionado em: v15.6.0 |
:::

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

O nome alternativo do assunto especificado para este certificado.

Esta é uma lista separada por vírgulas de nomes alternativos de assunto. Cada entrada começa com uma string que identifica o tipo do nome alternativo do assunto, seguido por dois pontos e o valor associado à entrada.

As versões anteriores do Node.js assumiram incorretamente que é seguro dividir esta propriedade na sequência de dois caracteres `', '` (ver [CVE-2021-44532](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-44532)). No entanto, certificados maliciosos e legítimos podem conter nomes alternativos de assunto que incluem esta sequência quando representados como uma string.

Após o prefixo que denota o tipo de entrada, o restante de cada entrada pode ser colocado entre aspas para indicar que o valor é um literal de string JSON. Para compatibilidade retroativa, o Node.js usa apenas literais de string JSON nesta propriedade quando necessário para evitar ambiguidade. O código de terceiros deve estar preparado para lidar com ambos os formatos de entrada possíveis.


### `x509.toJSON()` {#x509tojson}

**Adicionado em: v15.6.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Não existe uma codificação JSON padrão para certificados X509. O método `toJSON()` retorna uma string contendo o certificado codificado em PEM.

### `x509.toLegacyObject()` {#x509tolegacyobject}

**Adicionado em: v15.6.0**

- Tipo: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Retorna informações sobre este certificado usando a codificação do [objeto de certificado](/pt/nodejs/api/tls#certificate-object) legado.

### `x509.toString()` {#x509tostring}

**Adicionado em: v15.6.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retorna o certificado codificado em PEM.

### `x509.validFrom` {#x509validfrom}

**Adicionado em: v15.6.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

A data/hora a partir da qual este certificado é válido.

### `x509.validFromDate` {#x509validfromdate}

**Adicionado em: v23.0.0**

- Tipo: [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

A data/hora a partir da qual este certificado é válido, encapsulada em um objeto `Date`.

### `x509.validTo` {#x509validto}

**Adicionado em: v15.6.0**

- Tipo: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

A data/hora até a qual este certificado é válido.

### `x509.validToDate` {#x509validtodate}

**Adicionado em: v23.0.0**

- Tipo: [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

A data/hora até a qual este certificado é válido, encapsulada em um objeto `Date`.

### `x509.verify(publicKey)` {#x509verifypublickey}

**Adicionado em: v15.6.0**

- `publicKey` [\<KeyObject\>](/pt/nodejs/api/crypto#class-keyobject) Uma chave pública.
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Verifica se este certificado foi assinado pela chave pública fornecida. Não realiza nenhuma outra verificação de validação no certificado.


## Métodos e propriedades do módulo `node:crypto` {#nodecrypto-module-methods-and-properties}

### `crypto.checkPrime(candidate[, options], callback)` {#cryptocheckprimecandidate-options-callback}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v15.8.0 | Adicionado em: v15.8.0 |
:::

- `candidate` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) Um possível número primo codificado como uma sequência de octetos big endian de comprimento arbitrário.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `checks` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de iterações de primalidade probabilística de Miller-Rabin a serem executadas. Quando o valor é `0` (zero), um número de verificações é usado que produz uma taxa de falsos positivos de no máximo 2 para entrada aleatória. Deve-se ter cuidado ao selecionar um número de verificações. Consulte a documentação do OpenSSL para a função [`BN_is_prime_ex`](https://www.openssl.org/docs/man1.1.1/man3/BN_is_prime_ex) opções `nchecks` para obter mais detalhes. **Padrão:** `0`
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Definido como um objeto [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) se ocorrer um erro durante a verificação.
    - `result` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` se o candidato for um número primo com uma probabilidade de erro menor que `0.25 ** options.checks`.
  
 

Verifica a primalidade do `candidate`.


### `crypto.checkPrimeSync(candidate[, options])` {#cryptocheckprimesynccandidate-options}

**Adicionado em: v15.8.0**

- `candidate` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) Um possível número primo codificado como uma sequência de octetos big endian de comprimento arbitrário.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `checks` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de iterações de primalidade probabilísticas de Miller-Rabin a serem realizadas. Quando o valor é `0` (zero), um número de verificações é usado que produz uma taxa de falsos positivos de no máximo 2 para entrada aleatória. Deve-se ter cuidado ao selecionar um número de verificações. Consulte a documentação do OpenSSL para a função [`BN_is_prime_ex`](https://www.openssl.org/docs/man1.1.1/man3/BN_is_prime_ex) opções `nchecks` para obter mais detalhes. **Padrão:** `0`


- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` se o candidato for um número primo com uma probabilidade de erro menor que `0.25 ** options.checks`.

Verifica a primalidade do `candidate`.

### `crypto.constants` {#cryptoconstants}

**Adicionado em: v6.3.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Um objeto contendo constantes comumente usadas para criptografia e operações relacionadas à segurança. As constantes específicas atualmente definidas são descritas em [Constantes criptográficas](/pt/nodejs/api/crypto#crypto-constants).


### `crypto.createCipheriv(algorithm, key, iv[, options])` {#cryptocreatecipherivalgorithm-key-iv-options}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v17.9.0, v16.17.0 | A opção `authTagLength` agora é opcional ao usar a cifra `chacha20-poly1305` e o padrão é 16 bytes. |
| v15.0.0 | Os argumentos password e iv podem ser um ArrayBuffer e são limitados a um máximo de 2 ** 31 - 1 bytes cada. |
| v11.6.0 | O argumento `key` agora pode ser um `KeyObject`. |
| v11.2.0, v10.17.0 | A cifra `chacha20-poly1305` (a variante IETF do ChaCha20-Poly1305) agora é suportada. |
| v10.10.0 | Cifras no modo OCB agora são suportadas. |
| v10.2.0 | A opção `authTagLength` agora pode ser usada para produzir tags de autenticação mais curtas no modo GCM e o padrão é 16 bytes. |
| v9.9.0 | O parâmetro `iv` agora pode ser `null` para cifras que não precisam de um vetor de inicialização. |
| v0.1.94 | Adicionado em: v0.1.94 |
:::

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/pt/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/pt/nodejs/api/webcrypto#class-cryptokey)
- `iv` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.transform` options](/pt/nodejs/api/stream#new-streamtransformoptions)
- Retorna: [\<Cipher\>](/pt/nodejs/api/crypto#class-cipher)

Cria e retorna um objeto `Cipher`, com o `algorithm`, `key` e vetor de inicialização (`iv`) fornecidos.

O argumento `options` controla o comportamento do fluxo e é opcional, exceto quando uma cifra no modo CCM ou OCB (por exemplo, `'aes-128-ccm'`) é usada. Nesse caso, a opção `authTagLength` é obrigatória e especifica o comprimento da tag de autenticação em bytes, consulte [modo CCM](/pt/nodejs/api/crypto#ccm-mode). No modo GCM, a opção `authTagLength` não é obrigatória, mas pode ser usada para definir o comprimento da tag de autenticação que será retornada por `getAuthTag()` e o padrão é 16 bytes. Para `chacha20-poly1305`, a opção `authTagLength` tem como padrão 16 bytes.

O `algorithm` depende do OpenSSL, exemplos são `'aes192'`, etc. Nas versões recentes do OpenSSL, `openssl list -cipher-algorithms` exibirá os algoritmos de cifra disponíveis.

A `key` é a chave bruta usada pelo `algorithm` e `iv` é um [vetor de inicialização](https://en.wikipedia.org/wiki/Initialization_vector). Ambos os argumentos devem ser strings codificadas em `'utf8'`, [Buffers](/pt/nodejs/api/buffer), `TypedArray` ou `DataView`s. O `key` pode opcionalmente ser um [`KeyObject`](/pt/nodejs/api/crypto#class-keyobject) do tipo `secret`. Se a cifra não precisar de um vetor de inicialização, `iv` pode ser `null`.

Ao passar strings para `key` ou `iv`, considere [ressalvas ao usar strings como entradas para APIs criptográficas](/pt/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis).

Os vetores de inicialização devem ser imprevisíveis e exclusivos; idealmente, eles serão criptograficamente aleatórios. Eles não precisam ser secretos: os IVs são normalmente apenas adicionados a mensagens de texto cifrado não criptografadas. Pode parecer contraditório que algo tenha que ser imprevisível e exclusivo, mas não precisa ser secreto; lembre-se de que um invasor não deve ser capaz de prever com antecedência qual será um determinado IV.


### `crypto.createDecipheriv(algorithm, key, iv[, options])` {#cryptocreatedecipherivalgorithm-key-iv-options}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v17.9.0, v16.17.0 | A opção `authTagLength` agora é opcional ao usar a cifra `chacha20-poly1305` e o padrão é 16 bytes. |
| v11.6.0 | O argumento `key` agora pode ser um `KeyObject`. |
| v11.2.0, v10.17.0 | A cifra `chacha20-poly1305` (a variante IETF do ChaCha20-Poly1305) agora é suportada. |
| v10.10.0 | Cifras no modo OCB agora são suportadas. |
| v10.2.0 | A opção `authTagLength` agora pode ser usada para restringir os comprimentos de tag de autenticação GCM aceitos. |
| v9.9.0 | O parâmetro `iv` agora pode ser `null` para cifras que não precisam de um vetor de inicialização. |
| v0.1.94 | Adicionado em: v0.1.94 |
:::

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/pt/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/pt/nodejs/api/webcrypto#class-cryptokey)
- `iv` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.transform` options](/pt/nodejs/api/stream#new-streamtransformoptions)
- Retorna: [\<Decipher\>](/pt/nodejs/api/crypto#class-decipher)

Cria e retorna um objeto `Decipher` que usa o `algorithm`, a `key` e o vetor de inicialização (`iv`) fornecidos.

O argumento `options` controla o comportamento do fluxo e é opcional, exceto quando uma cifra no modo CCM ou OCB (por exemplo, `'aes-128-ccm'`) é usada. Nesse caso, a opção `authTagLength` é obrigatória e especifica o comprimento da tag de autenticação em bytes, consulte [modo CCM](/pt/nodejs/api/crypto#ccm-mode). Para AES-GCM e `chacha20-poly1305`, a opção `authTagLength` é padrão para 16 bytes e deve ser definida para um valor diferente se um comprimento diferente for usado.

O `algorithm` depende do OpenSSL, exemplos são `'aes192'`, etc. Em versões recentes do OpenSSL, `openssl list -cipher-algorithms` exibirá os algoritmos de cifra disponíveis.

A `key` é a chave bruta usada pelo `algorithm` e `iv` é um [vetor de inicialização](https://en.wikipedia.org/wiki/Initialization_vector). Ambos os argumentos devem ser strings codificadas em `'utf8'`, [Buffers](/pt/nodejs/api/buffer), `TypedArray` ou `DataView`s. O `key` pode opcionalmente ser um [`KeyObject`](/pt/nodejs/api/crypto#class-keyobject) do tipo `secret`. Se a cifra não precisar de um vetor de inicialização, `iv` pode ser `null`.

Ao passar strings para `key` ou `iv`, considere [ressalvas ao usar strings como entradas para APIs criptográficas](/pt/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis).

Vetores de inicialização devem ser imprevisíveis e únicos; idealmente, eles serão criptograficamente aleatórios. Eles não precisam ser secretos: os IVs normalmente são apenas adicionados às mensagens de texto cifrado não criptografadas. Pode parecer contraditório que algo tenha que ser imprevisível e único, mas não precisa ser secreto; lembre-se de que um invasor não deve ser capaz de prever com antecedência qual será um determinado IV.


### `crypto.createDiffieHellman(prime[, primeEncoding][, generator][, generatorEncoding])` {#cryptocreatediffiehellmanprime-primeencoding-generator-generatorencoding}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v8.0.0 | O argumento `prime` agora pode ser qualquer `TypedArray` ou `DataView`. |
| v8.0.0 | O argumento `prime` agora pode ser um `Uint8Array`. |
| v6.0.0 | O padrão para os parâmetros de codificação mudou de `binary` para `utf8`. |
| v0.11.12 | Adicionado em: v0.11.12 |
:::

- `prime` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `primeEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A [codificação](/pt/nodejs/api/buffer#buffers-and-character-encodings) da string `prime`.
- `generator` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) **Padrão:** `2`
- `generatorEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A [codificação](/pt/nodejs/api/buffer#buffers-and-character-encodings) da string `generator`.
- Retorna: [\<DiffieHellman\>](/pt/nodejs/api/crypto#class-diffiehellman)

Cria um objeto de troca de chaves `DiffieHellman` usando o `prime` fornecido e um `generator` específico opcional.

O argumento `generator` pode ser um número, string ou [`Buffer`](/pt/nodejs/api/buffer). Se `generator` não for especificado, o valor `2` é usado.

Se `primeEncoding` for especificado, espera-se que `prime` seja uma string; caso contrário, espera-se um [`Buffer`](/pt/nodejs/api/buffer), `TypedArray` ou `DataView`.

Se `generatorEncoding` for especificado, espera-se que `generator` seja uma string; caso contrário, espera-se um número, [`Buffer`](/pt/nodejs/api/buffer), `TypedArray` ou `DataView`.


### `crypto.createDiffieHellman(primeLength[, generator])` {#cryptocreatediffiehellmanprimelength-generator}

**Adicionado em: v0.5.0**

- `primeLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `generator` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `2`
- Retorna: [\<DiffieHellman\>](/pt/nodejs/api/crypto#class-diffiehellman)

Cria um objeto de troca de chaves `DiffieHellman` e gera um primo de `primeLength` bits usando um `generator` numérico específico opcional. Se `generator` não for especificado, o valor `2` será usado.

### `crypto.createDiffieHellmanGroup(name)` {#cryptocreatediffiehellmangroupname}

**Adicionado em: v0.9.3**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retorna: [\<DiffieHellmanGroup\>](/pt/nodejs/api/crypto#class-diffiehellmangroup)

Um alias para [`crypto.getDiffieHellman()`](/pt/nodejs/api/crypto#cryptogetdiffiehellmangroupname)

### `crypto.createECDH(curveName)` {#cryptocreateecdhcurvename}

**Adicionado em: v0.11.14**

- `curveName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retorna: [\<ECDH\>](/pt/nodejs/api/crypto#class-ecdh)

Cria um objeto de troca de chaves Elliptic Curve Diffie-Hellman (`ECDH`) usando uma curva predefinida especificada pela string `curveName`. Use [`crypto.getCurves()`](/pt/nodejs/api/crypto#cryptogetcurves) para obter uma lista de nomes de curvas disponíveis. Em versões recentes do OpenSSL, `openssl ecparam -list_curves` também exibirá o nome e a descrição de cada curva elíptica disponível.

### `crypto.createHash(algorithm[, options])` {#cryptocreatehashalgorithm-options}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v12.8.0 | A opção `outputLength` foi adicionada para funções de hash XOF. |
| v0.1.92 | Adicionado em: v0.1.92 |
:::

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.transform` options](/pt/nodejs/api/stream#new-streamtransformoptions)
- Retorna: [\<Hash\>](/pt/nodejs/api/crypto#class-hash)

Cria e retorna um objeto `Hash` que pode ser usado para gerar resumos de hash usando o `algorithm` fornecido. O argumento opcional `options` controla o comportamento do fluxo. Para funções de hash XOF como `'shake256'`, a opção `outputLength` pode ser usada para especificar o comprimento de saída desejado em bytes.

O `algorithm` depende dos algoritmos disponíveis suportados pela versão do OpenSSL na plataforma. Exemplos são `'sha256'`, `'sha512'`, etc. Em versões recentes do OpenSSL, `openssl list -digest-algorithms` exibirá os algoritmos de resumo disponíveis.

Exemplo: gerando a soma sha256 de um arquivo



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

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v15.0.0 | A chave também pode ser um ArrayBuffer ou CryptoKey. A opção de codificação foi adicionada. A chave não pode conter mais de 2 ** 32 - 1 bytes. |
| v11.6.0 | O argumento `key` agora pode ser um `KeyObject`. |
| v0.1.94 | Adicionado em: v0.1.94 |
:::

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/pt/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/pt/nodejs/api/webcrypto#class-cryptokey)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.transform` options](/pt/nodejs/api/stream#new-streamtransformoptions)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A codificação de string a ser usada quando `key` é uma string.


- Retorna: [\<Hmac\>](/pt/nodejs/api/crypto#class-hmac)

Cria e retorna um objeto `Hmac` que usa o `algorithm` e a `key` fornecidos. O argumento `options` opcional controla o comportamento do fluxo.

O `algorithm` depende dos algoritmos disponíveis suportados pela versão do OpenSSL na plataforma. Os exemplos são `'sha256'`, `'sha512'`, etc. Em versões recentes do OpenSSL, `openssl list -digest-algorithms` exibirá os algoritmos de digest disponíveis.

A `key` é a chave HMAC usada para gerar o hash HMAC criptográfico. Se for um [`KeyObject`](/pt/nodejs/api/crypto#class-keyobject), seu tipo deve ser `secret`. Se for uma string, considere [ressalvas ao usar strings como entradas para APIs criptográficas](/pt/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis). Se foi obtido de uma fonte de entropia criptograficamente segura, como [`crypto.randomBytes()`](/pt/nodejs/api/crypto#cryptorandombytessize-callback) ou [`crypto.generateKey()`](/pt/nodejs/api/crypto#cryptogeneratekeytype-options-callback), seu comprimento não deve exceder o tamanho do bloco de `algorithm` (por exemplo, 512 bits para SHA-256).

Exemplo: gerando o HMAC sha256 de um arquivo

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

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v15.12.0 | A chave também pode ser um objeto JWK. |
| v15.0.0 | A chave também pode ser um ArrayBuffer. A opção de codificação foi adicionada. A chave não pode conter mais de 2 ** 32 - 1 bytes. |
| v11.6.0 | Adicionado em: v11.6.0 |
:::

- `key` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
    - `key`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) O material da chave, seja no formato PEM, DER ou JWK.
    - `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve ser `'pem'`, `'der'` ou `'jwk'`. **Padrão:** `'pem'`.
    - `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve ser `'pkcs1'`, `'pkcs8'` ou `'sec1'`. Esta opção é necessária apenas se o `format` for `'der'` e ignorada caso contrário.
    - `passphrase`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) A senha a ser usada para descriptografia.
    - `encoding`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A codificação de string a ser usada quando `key` é uma string.


- Retorna: [\<KeyObject\>](/pt/nodejs/api/crypto#class-keyobject)

Cria e retorna um novo objeto de chave contendo uma chave privada. Se `key` for uma string ou `Buffer`, `format` é considerado como `'pem'`; caso contrário, `key` deve ser um objeto com as propriedades descritas acima.

Se a chave privada estiver criptografada, uma `passphrase` deve ser especificada. O comprimento da senha é limitado a 1024 bytes.


### `crypto.createPublicKey(key)` {#cryptocreatepublickeykey}

::: info [Histórico]
| Versão  | Mudanças                                                                                               |
| :-------- | :----------------------------------------------------------------------------------------------------- |
| v15.12.0 | A chave também pode ser um objeto JWK.                                                              |
| v15.0.0  | A chave também pode ser um ArrayBuffer. A opção de codificação foi adicionada. A chave não pode conter mais de 2 ** 32 - 1 bytes. |
| v11.13.0 | O argumento `key` agora pode ser um `KeyObject` com o tipo `private`.                                |
| v11.7.0  | O argumento `key` agora pode ser uma chave privada.                                                     |
| v11.6.0  | Adicionado em: v11.6.0                                                                                |
:::

- `key` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
    - `key`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) O material da chave, no formato PEM, DER ou JWK.
    - `format`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve ser `'pem'`, `'der'` ou `'jwk'`. **Padrão:** `'pem'`.
    - `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve ser `'pkcs1'` ou `'spki'`. Esta opção é necessária apenas se o `format` for `'der'` e ignorada caso contrário.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A codificação de string a ser usada quando `key` for uma string.

- Retorna: [\<KeyObject\>](/pt/nodejs/api/crypto#class-keyobject)

Cria e retorna um novo objeto de chave contendo uma chave pública. Se `key` for uma string ou `Buffer`, `format` é considerado como `'pem'`; se `key` for um `KeyObject` com o tipo `'private'`, a chave pública é derivada da chave privada fornecida; caso contrário, `key` deve ser um objeto com as propriedades descritas acima.

Se o formato for `'pem'`, a `'key'` também pode ser um certificado X.509.

Como as chaves públicas podem ser derivadas de chaves privadas, uma chave privada pode ser passada em vez de uma chave pública. Nesse caso, esta função se comporta como se [`crypto.createPrivateKey()`](/pt/nodejs/api/crypto#cryptocreateprivatekeykey) tivesse sido chamada, exceto que o tipo do `KeyObject` retornado será `'public'` e que a chave privada não pode ser extraída do `KeyObject` retornado. Da mesma forma, se um `KeyObject` com o tipo `'private'` for fornecido, um novo `KeyObject` com o tipo `'public'` será retornado e será impossível extrair a chave privada do objeto retornado.


### `crypto.createSecretKey(key[, encoding])` {#cryptocreatesecretkeykey-encoding}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.8.0, v16.18.0 | A chave agora pode ter comprimento zero. |
| v15.0.0 | A chave também pode ser um ArrayBuffer ou string. O argumento de codificação foi adicionado. A chave não pode conter mais de 2 ** 32 - 1 bytes. |
| v11.6.0 | Adicionado em: v11.6.0 |
:::

- `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A codificação de string quando `key` é uma string.
- Retorna: [\<KeyObject\>](/pt/nodejs/api/crypto#class-keyobject)

Cria e retorna um novo objeto de chave contendo uma chave secreta para criptografia simétrica ou `Hmac`.

### `crypto.createSign(algorithm[, options])` {#cryptocreatesignalgorithm-options}

**Adicionado em: v0.1.92**

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [`stream.Writable` options](/pt/nodejs/api/stream#new-streamwritableoptions)
- Retorna: [\<Sign\>](/pt/nodejs/api/crypto#class-sign)

Cria e retorna um objeto `Sign` que usa o `algorithm` fornecido. Use [`crypto.getHashes()`](/pt/nodejs/api/crypto#cryptogethashes) para obter os nomes dos algoritmos de digest disponíveis. O argumento opcional `options` controla o comportamento de `stream.Writable`.

Em alguns casos, uma instância de `Sign` pode ser criada usando o nome de um algoritmo de assinatura, como `'RSA-SHA256'`, em vez de um algoritmo de digest. Isso usará o algoritmo de digest correspondente. Isso não funciona para todos os algoritmos de assinatura, como `'ecdsa-with-SHA256'`, portanto, é melhor sempre usar nomes de algoritmos de digest.


### `crypto.createVerify(algorithm[, options])` {#cryptocreateverifyalgorithm-options}

**Adicionado em: v0.1.92**

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Opções de [`stream.Writable`](/pt/nodejs/api/stream#new-streamwritableoptions)
- Retorna: [\<Verify\>](/pt/nodejs/api/crypto#class-verify)

Cria e retorna um objeto `Verify` que usa o algoritmo fornecido. Use [`crypto.getHashes()`](/pt/nodejs/api/crypto#cryptogethashes) para obter um array de nomes dos algoritmos de assinatura disponíveis. O argumento opcional `options` controla o comportamento de `stream.Writable`.

Em alguns casos, uma instância `Verify` pode ser criada usando o nome de um algoritmo de assinatura, como `'RSA-SHA256'`, em vez de um algoritmo de digestão. Isso usará o algoritmo de digestão correspondente. Isso não funciona para todos os algoritmos de assinatura, como `'ecdsa-with-SHA256'`, portanto, é melhor sempre usar nomes de algoritmos de digestão.

### `crypto.diffieHellman(options)` {#cryptodiffiehellmanoptions}

**Adicionado em: v13.9.0, v12.17.0**

- `options`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `privateKey`: [\<KeyObject\>](/pt/nodejs/api/crypto#class-keyobject)
    - `publicKey`: [\<KeyObject\>](/pt/nodejs/api/crypto#class-keyobject)


- Retorna: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer)

Calcula o segredo Diffie-Hellman com base em uma `privateKey` e uma `publicKey`. Ambas as chaves devem ter o mesmo `asymmetricKeyType`, que deve ser um de `'dh'` (para Diffie-Hellman), `'ec'`, `'x448'` ou `'x25519'` (para ECDH).

### `crypto.fips` {#cryptofips}

**Adicionado em: v6.0.0**

**Obsoleto desde: v10.0.0**

::: danger [Estável: 0 - Obsoleto]
[Estável: 0](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 0](/pt/nodejs/api/documentation#stability-index) - Obsoleto
:::

Propriedade para verificar e controlar se um provedor criptográfico compatível com FIPS está atualmente em uso. Definir como verdadeiro requer uma build FIPS do Node.js.

Esta propriedade está obsoleta. Use `crypto.setFips()` e `crypto.getFips()` em vez disso.


### `crypto.generateKey(type, options, callback)` {#cryptogeneratekeytype-options-callback}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v15.0.0 | Adicionado em: v15.0.0 |
:::

- `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O uso pretendido da chave secreta gerada. Os valores aceitos atualmente são `'hmac'` e `'aes'`.
- `options`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `length`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O tamanho em bits da chave a ser gerada. Este deve ser um valor maior que 0.
    - Se `type` for `'hmac'`, o mínimo é 8 e o comprimento máximo é 2-1. Se o valor não for um múltiplo de 8, a chave gerada será truncada para `Math.floor(length / 8)`.
    - Se `type` for `'aes'`, o comprimento deve ser um de `128`, `192` ou `256`.




- `callback`: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err`: [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `key`: [\<KeyObject\>](/pt/nodejs/api/crypto#class-keyobject)



Gera assincronamente uma nova chave secreta aleatória do `length` fornecido. O `type` determinará quais validações serão executadas no `length`.

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

O tamanho de uma chave HMAC gerada não deve exceder o tamanho do bloco da função hash subjacente. Consulte [`crypto.createHmac()`](/pt/nodejs/api/crypto#cryptocreatehmacalgorithm-key-options) para obter mais informações.


### `crypto.generateKeyPair(type, options, callback)` {#cryptogeneratekeypairtype-options-callback}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v16.10.0 | Adicionada a capacidade de definir parâmetros de sequência `RSASSA-PSS-params` para pares de chaves RSA-PSS. |
| v13.9.0, v12.17.0 | Adicionado suporte para Diffie-Hellman. |
| v12.0.0 | Adicionado suporte para pares de chaves RSA-PSS. |
| v12.0.0 | Adicionada a capacidade de gerar pares de chaves X25519 e X448. |
| v12.0.0 | Adicionada a capacidade de gerar pares de chaves Ed25519 e Ed448. |
| v11.6.0 | As funções `generateKeyPair` e `generateKeyPairSync` agora produzem objetos de chave se nenhuma codificação foi especificada. |
| v10.12.0 | Adicionado em: v10.12.0 |
:::

- `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve ser `'rsa'`, `'rsa-pss'`, `'dsa'`, `'ec'`, `'ed25519'`, `'ed448'`, `'x25519'`, `'x448'` ou `'dh'`.
- `options`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `modulusLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Tamanho da chave em bits (RSA, DSA).
    - `publicExponent`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Expoente público (RSA). **Padrão:** `0x10001`.
    - `hashAlgorithm`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome do resumo da mensagem (RSA-PSS).
    - `mgf1HashAlgorithm`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome do resumo da mensagem usado pelo MGF1 (RSA-PSS).
    - `saltLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Comprimento mínimo do salt em bytes (RSA-PSS).
    - `divisorLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Tamanho de `q` em bits (DSA).
    - `namedCurve`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome da curva a ser usada (EC).
    - `prime`: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) O parâmetro primo (DH).
    - `primeLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Comprimento primo em bits (DH).
    - `generator`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Gerador personalizado (DH). **Padrão:** `2`.
    - `groupName`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome do grupo Diffie-Hellman (DH). Consulte [`crypto.getDiffieHellman()`](/pt/nodejs/api/crypto#cryptogetdiffiehellmangroupname).
    - `paramEncoding`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve ser `'named'` ou `'explicit'` (EC). **Padrão:** `'named'`.
    - `publicKeyEncoding`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Consulte [`keyObject.export()`](/pt/nodejs/api/crypto#keyobjectexportoptions).
    - `privateKeyEncoding`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Consulte [`keyObject.export()`](/pt/nodejs/api/crypto#keyobjectexportoptions).
  
 
- `callback`: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err`: [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `publicKey`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<KeyObject\>](/pt/nodejs/api/crypto#class-keyobject)
    - `privateKey`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<KeyObject\>](/pt/nodejs/api/crypto#class-keyobject)
  
 

Gera um novo par de chaves assimétricas do `tipo` fornecido. RSA, RSA-PSS, DSA, EC, Ed25519, Ed448, X25519, X448 e DH são suportados atualmente.

Se um `publicKeyEncoding` ou `privateKeyEncoding` foi especificado, esta função se comporta como se [`keyObject.export()`](/pt/nodejs/api/crypto#keyobjectexportoptions) tivesse sido chamado em seu resultado. Caso contrário, a respectiva parte da chave é retornada como um [`KeyObject`](/pt/nodejs/api/crypto#class-keyobject).

É recomendado codificar chaves públicas como `'spki'` e chaves privadas como `'pkcs8'` com criptografia para armazenamento de longo prazo:

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
  // Lidar com erros e usar o par de chaves gerado.
});
```
:::

Na conclusão, `callback` será chamado com `err` definido como `undefined` e `publicKey` / `privateKey` representando o par de chaves gerado.

Se este método for invocado como sua versão [`util.promisify()`](/pt/nodejs/api/util#utilpromisifyoriginal)ed, ele retorna uma `Promise` para um `Object` com propriedades `publicKey` e `privateKey`.


### `crypto.generateKeyPairSync(type, options)` {#cryptogeneratekeypairsynctype-options}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v16.10.0 | Adiciona a capacidade de definir parâmetros de sequência `RSASSA-PSS-params` para pares de chaves RSA-PSS. |
| v13.9.0, v12.17.0 | Adiciona suporte para Diffie-Hellman. |
| v12.0.0 | Adiciona suporte para pares de chaves RSA-PSS. |
| v12.0.0 | Adiciona a capacidade de gerar pares de chaves X25519 e X448. |
| v12.0.0 | Adiciona a capacidade de gerar pares de chaves Ed25519 e Ed448. |
| v11.6.0 | As funções `generateKeyPair` e `generateKeyPairSync` agora produzem objetos de chave se nenhuma codificação foi especificada. |
| v10.12.0 | Adicionado em: v10.12.0 |
:::

- `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve ser `'rsa'`, `'rsa-pss'`, `'dsa'`, `'ec'`, `'ed25519'`, `'ed448'`, `'x25519'`, `'x448'` ou `'dh'`.
- `options`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `modulusLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Tamanho da chave em bits (RSA, DSA).
    - `publicExponent`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Expoente público (RSA). **Padrão:** `0x10001`.
    - `hashAlgorithm`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome do resumo da mensagem (RSA-PSS).
    - `mgf1HashAlgorithm`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome do resumo da mensagem usado por MGF1 (RSA-PSS).
    - `saltLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Comprimento mínimo do salt em bytes (RSA-PSS).
    - `divisorLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Tamanho de `q` em bits (DSA).
    - `namedCurve`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome da curva a ser usada (EC).
    - `prime`: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) O parâmetro primo (DH).
    - `primeLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Comprimento primo em bits (DH).
    - `generator`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Gerador personalizado (DH). **Padrão:** `2`.
    - `groupName`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome do grupo Diffie-Hellman (DH). Veja [`crypto.getDiffieHellman()`](/pt/nodejs/api/crypto#cryptogetdiffiehellmangroupname).
    - `paramEncoding`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Deve ser `'named'` ou `'explicit'` (EC). **Padrão:** `'named'`.
    - `publicKeyEncoding`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Veja [`keyObject.export()`](/pt/nodejs/api/crypto#keyobjectexportoptions).
    - `privateKeyEncoding`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Veja [`keyObject.export()`](/pt/nodejs/api/crypto#keyobjectexportoptions).


- Retorna: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `publicKey`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<KeyObject\>](/pt/nodejs/api/crypto#class-keyobject)
    - `privateKey`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<KeyObject\>](/pt/nodejs/api/crypto#class-keyobject)



Gera um novo par de chaves assimétricas do `tipo` fornecido. RSA, RSA-PSS, DSA, EC, Ed25519, Ed448, X25519, X448 e DH são suportados atualmente.

Se um `publicKeyEncoding` ou `privateKeyEncoding` foi especificado, esta função se comporta como se [`keyObject.export()`](/pt/nodejs/api/crypto#keyobjectexportoptions) tivesse sido chamado em seu resultado. Caso contrário, a parte respectiva da chave é retornada como um [`KeyObject`](/pt/nodejs/api/crypto#class-keyobject).

Ao codificar chaves públicas, é recomendado usar `'spki'`. Ao codificar chaves privadas, é recomendado usar `'pkcs8'` com uma senha forte e manter a senha confidencial.

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

O valor de retorno `{ publicKey, privateKey }` representa o par de chaves gerado. Quando a codificação PEM foi selecionada, a respectiva chave será uma string, caso contrário, será um buffer contendo os dados codificados como DER.


### `crypto.generateKeySync(type, options)` {#cryptogeneratekeysynctype-options}

**Adicionado em: v15.0.0**

- `type`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O uso pretendido da chave secreta gerada. Os valores atualmente aceitos são `'hmac'` e `'aes'`.
- `options`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `length`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O comprimento em bits da chave a ser gerada.
    - Se `type` for `'hmac'`, o mínimo é 8 e o comprimento máximo é 2-1. Se o valor não for um múltiplo de 8, a chave gerada será truncada para `Math.floor(length / 8)`.
    - Se `type` for `'aes'`, o comprimento deve ser um de `128`, `192` ou `256`.




- Retorna: [\<KeyObject\>](/pt/nodejs/api/crypto#class-keyobject)

Gera sincronamente uma nova chave secreta aleatória do `length` fornecido. O `type` determinará quais validações serão realizadas no `length`.

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

O tamanho de uma chave HMAC gerada não deve exceder o tamanho do bloco da função hash subjacente. Consulte [`crypto.createHmac()`](/pt/nodejs/api/crypto#cryptocreatehmacalgorithm-key-options) para obter mais informações.

### `crypto.generatePrime(size[, options[, callback]])` {#cryptogenerateprimesize-options-callback}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v15.8.0 | Adicionado em: v15.8.0 |
:::

- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O tamanho (em bits) do primo a ser gerado.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `add` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
    - `rem` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
    - `safe` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Padrão:** `false`.
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, o primo gerado é retornado como um `bigint`.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `prime` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)



Gera um primo pseudoaleatório de `size` bits.

Se `options.safe` for `true`, o primo será um primo seguro -- isto é, `(prime - 1) / 2` também será um primo.

Os parâmetros `options.add` e `options.rem` podem ser usados para impor requisitos adicionais, por exemplo, para Diffie-Hellman:

- Se `options.add` e `options.rem` estiverem ambos definidos, o primo satisfará a condição de que `prime % add = rem`.
- Se apenas `options.add` estiver definido e `options.safe` não for `true`, o primo satisfará a condição de que `prime % add = 1`.
- Se apenas `options.add` estiver definido e `options.safe` estiver definido como `true`, o primo satisfará a condição de que `prime % add = 3`. Isso é necessário porque `prime % add = 1` para `options.add \> 2` contradiria a condição imposta por `options.safe`.
- `options.rem` é ignorado se `options.add` não for fornecido.

Tanto `options.add` quanto `options.rem` devem ser codificados como sequências big-endian se forem fornecidos como um `ArrayBuffer`, `SharedArrayBuffer`, `TypedArray`, `Buffer` ou `DataView`.

Por padrão, o primo é codificado como uma sequência big-endian de octetos em um [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer). Se a opção `bigint` for `true`, então um [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) é fornecido.


### `crypto.generatePrimeSync(size[, options])` {#cryptogenerateprimesyncsize-options}

**Adicionado em: v15.8.0**

- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O tamanho (em bits) do número primo a ser gerado.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `add` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
    - `rem` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<SharedArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
    - `safe` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) **Padrão:** `false`.
    - `bigint` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Quando `true`, o número primo gerado é retornado como um `bigint`.

- Retorna: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

Gera um número primo pseudoaleatório de `size` bits.

Se `options.safe` for `true`, o número primo será um número primo seguro -- ou seja, `(prime - 1) / 2` também será um número primo.

Os parâmetros `options.add` e `options.rem` podem ser usados para impor requisitos adicionais, por exemplo, para Diffie-Hellman:

- Se `options.add` e `options.rem` estiverem ambos definidos, o número primo satisfará a condição de que `prime % add = rem`.
- Se apenas `options.add` estiver definido e `options.safe` não for `true`, o número primo satisfará a condição de que `prime % add = 1`.
- Se apenas `options.add` estiver definido e `options.safe` estiver definido como `true`, o número primo satisfará a condição de que `prime % add = 3`. Isso é necessário porque `prime % add = 1` para `options.add \> 2` contradiria a condição imposta por `options.safe`.
- `options.rem` é ignorado se `options.add` não for fornecido.

Tanto `options.add` quanto `options.rem` devem ser codificados como sequências big-endian se forem fornecidos como um `ArrayBuffer`, `SharedArrayBuffer`, `TypedArray`, `Buffer` ou `DataView`.

Por padrão, o número primo é codificado como uma sequência big-endian de octetos em um [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer). Se a opção `bigint` for `true`, então um [\<bigint\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) é fornecido.


### `crypto.getCipherInfo(nameOrNid[, options])` {#cryptogetcipherinfonameornid-options}

**Adicionado em: v15.0.0**

- `nameOrNid`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O nome ou nid da cifra para consultar.
- `options`: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `keyLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Um tamanho de chave de teste.
    - `ivLength`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Um tamanho de IV de teste.


- Retorna: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O nome da cifra
    - `nid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O nid da cifra
    - `blockSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O tamanho do bloco da cifra em bytes. Esta propriedade é omitida quando `mode` é `'stream'`.
    - `ivLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O tamanho do vetor de inicialização esperado ou padrão em bytes. Esta propriedade é omitida se a cifra não usar um vetor de inicialização.
    - `keyLength` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O tamanho da chave esperado ou padrão em bytes.
    - `mode` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O modo da cifra. Um de `'cbc'`, `'ccm'`, `'cfb'`, `'ctr'`, `'ecb'`, `'gcm'`, `'ocb'`, `'ofb'`, `'stream'`, `'wrap'`, `'xts'`.



Retorna informações sobre uma determinada cifra.

Algumas cifras aceitam chaves e vetores de inicialização de comprimento variável. Por padrão, o método `crypto.getCipherInfo()` retornará os valores padrão para essas cifras. Para testar se um determinado comprimento de chave ou comprimento de IV é aceitável para uma determinada cifra, use as opções `keyLength` e `ivLength`. Se os valores fornecidos forem inaceitáveis, `undefined` será retornado.


### `crypto.getCiphers()` {#cryptogetciphers}

**Adicionado em: v0.9.3**

- Retorna: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Um array com os nomes dos algoritmos de cifra suportados.

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

**Adicionado em: v2.3.0**

- Retorna: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Um array com os nomes das curvas elípticas suportadas.

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

**Adicionado em: v0.7.5**

- `groupName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retorna: [\<DiffieHellmanGroup\>](/pt/nodejs/api/crypto#class-diffiehellmangroup)

Cria um objeto de troca de chaves `DiffieHellmanGroup` predefinido. Os grupos suportados estão listados na documentação para [`DiffieHellmanGroup`](/pt/nodejs/api/crypto#class-diffiehellmangroup).

O objeto retornado imita a interface de objetos criados por [`crypto.createDiffieHellman()`](/pt/nodejs/api/crypto#cryptocreatediffiehellmanprime-primeencoding-generator-generatorencoding), mas não permitirá alterar as chaves (com [`diffieHellman.setPublicKey()`](/pt/nodejs/api/crypto#diffiehellmansetpublickeypublickey-encoding), por exemplo). A vantagem de usar este método é que as partes não precisam gerar nem trocar um módulo de grupo antecipadamente, economizando tempo de processador e comunicação.

Exemplo (obtendo um segredo compartilhado):

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

/* aliceSecret and bobSecret should be the same */
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

/* aliceSecret and bobSecret should be the same */
console.log(aliceSecret === bobSecret);
```
:::


### `crypto.getFips()` {#cryptogetfips}

**Adicionado em: v10.0.0**

- Retorna: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) `1` se e somente se um provedor de criptografia compatível com FIPS estiver em uso, `0` caso contrário. Uma futura versão semver-major pode alterar o tipo de retorno desta API para um [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type).

### `crypto.getHashes()` {#cryptogethashes}

**Adicionado em: v0.9.3**

- Retorna: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Um array com os nomes dos algoritmos de hash suportados, como `'RSA-SHA256'`. Algoritmos de hash também são chamados de algoritmos de "digest".

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

**Adicionado em: v17.4.0**

- `typedArray` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
- Retorna: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) Retorna `typedArray`.

Um alias conveniente para [`crypto.webcrypto.getRandomValues()`](/pt/nodejs/api/webcrypto#cryptogetrandomvaluestypedarray). Esta implementação não é compatível com a especificação da Web Crypto, para escrever código compatível com a web, use [`crypto.webcrypto.getRandomValues()`](/pt/nodejs/api/webcrypto#cryptogetrandomvaluestypedarray) em vez disso.


### `crypto.hash(algorithm, data[, outputEncoding])` {#cryptohashalgorithm-data-outputencoding}

**Adicionado em: v21.7.0, v20.12.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index).2 - Candidato ao lançamento
:::

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Quando `data` é uma string, ela será codificada como UTF-8 antes de ser hasheada. Se uma codificação de entrada diferente for desejada para uma entrada de string, o usuário pode codificar a string em um `TypedArray` usando `TextEncoder` ou `Buffer.from()` e passar o `TypedArray` codificado para esta API.
- `outputEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)  [Codificação](/pt/nodejs/api/buffer#buffers-and-character-encodings) usada para codificar o digest retornado. **Padrão:** `'hex'`.
- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer)

Uma utilidade para criar digests de hash únicos de dados. Pode ser mais rápido que o `crypto.createHash()` baseado em objeto ao fazer o hash de uma quantidade menor de dados (\<= 5 MB) que esteja prontamente disponível. Se os dados puderem ser grandes ou se forem transmitidos, ainda é recomendável usar `crypto.createHash()` em vez disso.

O `algorithm` depende dos algoritmos disponíveis suportados pela versão do OpenSSL na plataforma. Exemplos são `'sha256'`, `'sha512'`, etc. Nas versões recentes do OpenSSL, `openssl list -digest-algorithms` exibirá os algoritmos de digest disponíveis.

Exemplo:

::: code-group
```js [CJS]
const crypto = require('node:crypto');
const { Buffer } = require('node:buffer');

// Fazendo o hash de uma string e retornando o resultado como uma string codificada em hexadecimal.
const string = 'Node.js';
// 10b3493287f831e81a438811a1ffba01f8cec4b7
console.log(crypto.hash('sha1', string));

// Codifica uma string codificada em base64 em um Buffer, faz o hash e retorna
// o resultado como um buffer.
const base64 = 'Tm9kZS5qcw==';
// <Buffer 10 b3 49 32 87 f8 31 e8 1a 43 88 11 a1 ff ba 01 f8 ce c4 b7>
console.log(crypto.hash('sha1', Buffer.from(base64, 'base64'), 'buffer'));
```

```js [ESM]
import crypto from 'node:crypto';
import { Buffer } from 'node:buffer';

// Fazendo o hash de uma string e retornando o resultado como uma string codificada em hexadecimal.
const string = 'Node.js';
// 10b3493287f831e81a438811a1ffba01f8cec4b7
console.log(crypto.hash('sha1', string));

// Codifica uma string codificada em base64 em um Buffer, faz o hash e retorna
// o resultado como um buffer.
const base64 = 'Tm9kZS5qcw==';
// <Buffer 10 b3 49 32 87 f8 31 e8 1a 43 88 11 a1 ff ba 01 f8 ce c4 b7>
console.log(crypto.hash('sha1', Buffer.from(base64, 'base64'), 'buffer'));
```
:::


### `crypto.hkdf(digest, ikm, salt, info, keylen, callback)` {#cryptohkdfdigest-ikm-salt-info-keylen-callback}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v18.8.0, v16.18.0 | O material de chave de entrada agora pode ter comprimento zero. |
| v15.0.0 | Adicionado em: v15.0.0 |
:::

- `digest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O algoritmo de digestão a ser usado.
- `ikm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/pt/nodejs/api/crypto#class-keyobject) O material de chave de entrada. Deve ser fornecido, mas pode ter comprimento zero.
- `salt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) O valor de salt. Deve ser fornecido, mas pode ter comprimento zero.
- `info` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Valor de informação adicional. Deve ser fornecido, mas pode ter comprimento zero e não pode ter mais de 1024 bytes.
- `keylen` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O comprimento da chave a ser gerada. Deve ser maior que 0. O valor máximo permitido é `255` vezes o número de bytes produzidos pela função de digestão selecionada (por exemplo, `sha512` gera hashes de 64 bytes, tornando a saída HKDF máxima de 16320 bytes).
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `derivedKey` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
  
 

HKDF é uma função de derivação de chave simples definida na RFC 5869. O `ikm`, `salt` e `info` fornecidos são usados com o `digest` para derivar uma chave de `keylen` bytes.

A função `callback` fornecida é chamada com dois argumentos: `err` e `derivedKey`. Se ocorrer um erro ao derivar a chave, `err` será definido; caso contrário, `err` será `null`. A `derivedKey` gerada com sucesso será passada para o callback como um [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer). Um erro será lançado se algum dos argumentos de entrada especificar valores ou tipos inválidos.

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

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.8.0, v16.18.0 | O material de chave de entrada agora pode ter comprimento zero. |
| v15.0.0 | Adicionado em: v15.0.0 |
:::

- `digest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O algoritmo de digest a ser usado.
- `ikm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/pt/nodejs/api/crypto#class-keyobject) O material de chave de entrada. Deve ser fornecido, mas pode ter comprimento zero.
- `salt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) O valor do salt. Deve ser fornecido, mas pode ter comprimento zero.
- `info` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Valor de info adicional. Deve ser fornecido, mas pode ter comprimento zero, e não pode ter mais de 1024 bytes.
- `keylen` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O comprimento da chave a ser gerada. Deve ser maior que 0. O valor máximo permitido é `255` vezes o número de bytes produzidos pela função de digest selecionada (por exemplo, `sha512` gera hashes de 64 bytes, tornando a saída HKDF máxima de 16320 bytes).
- Retorna: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)

Fornece uma função de derivação de chave HKDF síncrona conforme definido em RFC 5869. O `ikm`, `salt` e `info` fornecidos são usados com o `digest` para derivar uma chave de `keylen` bytes.

O `derivedKey` gerado com sucesso será retornado como um [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer).

Um erro será lançado se algum dos argumentos de entrada especificar valores ou tipos inválidos, ou se a chave derivada não puder ser gerada.

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

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v15.0.0 | Os argumentos password e salt também podem ser instâncias de ArrayBuffer. |
| v14.0.0 | O parâmetro `iterations` agora é restrito a valores positivos. Versões anteriores tratavam outros valores como um. |
| v8.0.0 | O parâmetro `digest` agora é sempre obrigatório. |
| v6.0.0 | Chamar esta função sem passar o parâmetro `digest` agora está obsoleto e emitirá um aviso. |
| v6.0.0 | A codificação padrão para `password` se for uma string mudou de `binary` para `utf8`. |
| v0.5.5 | Adicionado em: v0.5.5 |
:::

- `password` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `salt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `iterations` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `keylen` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `digest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `derivedKey` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer)
 

Fornece uma implementação assíncrona da Função de Derivação de Chave Baseada em Senha 2 (PBKDF2). Um algoritmo de digest HMAC selecionado especificado por `digest` é aplicado para derivar uma chave do comprimento de byte solicitado (`keylen`) da `password`, `salt` e `iterations`.

A função `callback` fornecida é chamada com dois argumentos: `err` e `derivedKey`. Se ocorrer um erro ao derivar a chave, `err` será definido; caso contrário, `err` será `null`. Por padrão, a `derivedKey` gerada com sucesso será passada para o callback como um [`Buffer`](/pt/nodejs/api/buffer). Um erro será lançado se algum dos argumentos de entrada especificar valores ou tipos inválidos.

O argumento `iterations` deve ser um número definido o mais alto possível. Quanto maior o número de iterações, mais segura será a chave derivada, mas levará mais tempo para ser concluída.

O `salt` deve ser o mais exclusivo possível. Recomenda-se que um salt seja aleatório e tenha pelo menos 16 bytes de comprimento. Consulte [NIST SP 800-132](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-132.pdf) para obter detalhes.

Ao passar strings para `password` ou `salt`, considere as [ressalvas ao usar strings como entradas para APIs criptográficas](/pt/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis).

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

Um array de funções de digest suportadas pode ser recuperado usando [`crypto.getHashes()`](/pt/nodejs/api/crypto#cryptogethashes).

Esta API usa o threadpool do libuv, que pode ter implicações de desempenho surpreendentes e negativas para algumas aplicações; veja a documentação de [`UV_THREADPOOL_SIZE`](/pt/nodejs/api/cli#uv_threadpool_sizesize) para mais informações.


### `crypto.pbkdf2Sync(password, salt, iterations, keylen, digest)` {#cryptopbkdf2syncpassword-salt-iterations-keylen-digest}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v14.0.0 | O parâmetro `iterations` agora é restrito a valores positivos. Versões anteriores tratavam outros valores como um. |
| v6.0.0 | Chamar esta função sem passar o parâmetro `digest` agora está obsoleto e emitirá um aviso. |
| v6.0.0 | A codificação padrão para `password` se for uma string foi alterada de `binary` para `utf8`. |
| v0.9.3 | Adicionado em: v0.9.3 |
:::

- `password` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `salt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `iterations` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `keylen` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `digest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retorna: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer)

Fornece uma implementação síncrona da Função de Derivação de Chave Baseada em Senha 2 (PBKDF2). Um algoritmo de digest HMAC selecionado especificado por `digest` é aplicado para derivar uma chave do comprimento de byte solicitado (`keylen`) da `password`, `salt` e `iterations`.

Se ocorrer um erro, um `Error` será lançado, caso contrário, a chave derivada será retornada como um [`Buffer`](/pt/nodejs/api/buffer).

O argumento `iterations` deve ser um número definido o mais alto possível. Quanto maior o número de iterações, mais segura será a chave derivada, mas levará mais tempo para ser concluída.

O `salt` deve ser o mais exclusivo possível. Recomenda-se que um salt seja aleatório e tenha pelo menos 16 bytes de comprimento. Veja [NIST SP 800-132](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-132.pdf) para detalhes.

Ao passar strings para `password` ou `salt`, considere [ressalvas ao usar strings como entradas para APIs criptográficas](/pt/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis).

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

Uma array de funções de digest suportadas pode ser recuperada usando [`crypto.getHashes()`](/pt/nodejs/api/crypto#cryptogethashes).


### `crypto.privateDecrypt(privateKey, buffer)` {#cryptoprivatedecryptprivatekey-buffer}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v21.6.2, v20.11.1, v18.19.1 | O preenchimento `RSA_PKCS1_PADDING` foi desativado a menos que a compilação do OpenSSL suporte rejeição implícita. |
| v15.0.0 | Adicionado string, ArrayBuffer e CryptoKey como tipos de chave permitidos. O oaepLabel pode ser um ArrayBuffer. O buffer pode ser uma string ou ArrayBuffer. Todos os tipos que aceitam buffers são limitados a um máximo de 2 ** 31 - 1 bytes. |
| v12.11.0 | A opção `oaepLabel` foi adicionada. |
| v12.9.0 | A opção `oaepHash` foi adicionada. |
| v11.6.0 | Esta função agora suporta objetos de chave. |
| v0.11.14 | Adicionado em: v0.11.14 |
:::

- `privateKey` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/pt/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/pt/nodejs/api/webcrypto#class-cryptokey)
    - `oaepHash` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A função hash a ser usada para preenchimento OAEP e MGF1. **Padrão:** `'sha1'`
    - `oaepLabel` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) O rótulo a ser usado para preenchimento OAEP. Se não for especificado, nenhum rótulo é usado.
    - `padding` [\<crypto.constants\>](/pt/nodejs/api/crypto#cryptoconstants) Um valor de preenchimento opcional definido em `crypto.constants`, que pode ser: `crypto.constants.RSA_NO_PADDING`, `crypto.constants.RSA_PKCS1_PADDING` ou `crypto.constants.RSA_PKCS1_OAEP_PADDING`.

- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- Retorna: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) Um novo `Buffer` com o conteúdo descriptografado.

Descriptografa `buffer` com `privateKey`. `buffer` foi previamente criptografado usando a chave pública correspondente, por exemplo, usando [`crypto.publicEncrypt()`](/pt/nodejs/api/crypto#cryptopublicencryptkey-buffer).

Se `privateKey` não for um [`KeyObject`](/pt/nodejs/api/crypto#class-keyobject), esta função se comporta como se `privateKey` tivesse sido passado para [`crypto.createPrivateKey()`](/pt/nodejs/api/crypto#cryptocreateprivatekeykey). Se for um objeto, a propriedade `padding` pode ser passada. Caso contrário, esta função usa `RSA_PKCS1_OAEP_PADDING`.

Usar `crypto.constants.RSA_PKCS1_PADDING` em [`crypto.privateDecrypt()`](/pt/nodejs/api/crypto#cryptoprivatedecryptprivatekey-buffer) requer que o OpenSSL suporte rejeição implícita (`rsa_pkcs1_implicit_rejection`). Se a versão do OpenSSL usada pelo Node.js não suportar este recurso, tentar usar `RSA_PKCS1_PADDING` falhará.


### `crypto.privateEncrypt(privateKey, buffer)` {#cryptoprivateencryptprivatekey-buffer}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v15.0.0 | Adicionado string, ArrayBuffer e CryptoKey como tipos de chave permitidos. A senha pode ser um ArrayBuffer. O buffer pode ser uma string ou ArrayBuffer. Todos os tipos que aceitam buffers são limitados a um máximo de 2 ** 31 - 1 bytes. |
| v11.6.0 | Esta função agora suporta objetos de chave. |
| v1.1.0 | Adicionado em: v1.1.0 |
:::

- `privateKey` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/pt/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/pt/nodejs/api/webcrypto#class-cryptokey)
    - `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/pt/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/pt/nodejs/api/webcrypto#class-cryptokey) Uma chave privada codificada em PEM.
    - `passphrase` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Uma senha opcional para a chave privada.
    - `padding` [\<crypto.constants\>](/pt/nodejs/api/crypto#cryptoconstants) Um valor de preenchimento opcional definido em `crypto.constants`, que pode ser: `crypto.constants.RSA_NO_PADDING` ou `crypto.constants.RSA_PKCS1_PADDING`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A codificação de string a ser usada quando `buffer`, `key` ou `passphrase` são strings.
  
 
- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- Retorna: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) Um novo `Buffer` com o conteúdo criptografado.

Criptografa `buffer` com `privateKey`. Os dados retornados podem ser descriptografados usando a chave pública correspondente, por exemplo, usando [`crypto.publicDecrypt()`](/pt/nodejs/api/crypto#cryptopublicdecryptkey-buffer).

Se `privateKey` não for um [`KeyObject`](/pt/nodejs/api/crypto#class-keyobject), esta função se comporta como se `privateKey` tivesse sido passado para [`crypto.createPrivateKey()`](/pt/nodejs/api/crypto#cryptocreateprivatekeykey). Se for um objeto, a propriedade `padding` pode ser passada. Caso contrário, esta função usa `RSA_PKCS1_PADDING`.


### `crypto.publicDecrypt(key, buffer)` {#cryptopublicdecryptkey-buffer}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v15.0.0 | Adicionado string, ArrayBuffer e CryptoKey como tipos de chave aceitáveis. A senha pode ser um ArrayBuffer. O buffer pode ser uma string ou ArrayBuffer. Todos os tipos que aceitam buffers são limitados a um máximo de 2 ** 31 - 1 bytes. |
| v11.6.0 | Esta função agora suporta objetos de chave. |
| v1.1.0 | Adicionado em: v1.1.0 |
:::

- `key` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/pt/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/pt/nodejs/api/webcrypto#class-cryptokey)
    - `passphrase` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Uma senha opcional para a chave privada.
    - `padding` [\<crypto.constants\>](/pt/nodejs/api/crypto#cryptoconstants) Um valor de preenchimento opcional definido em `crypto.constants`, que pode ser: `crypto.constants.RSA_NO_PADDING` ou `crypto.constants.RSA_PKCS1_PADDING`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A codificação de string a ser usada quando `buffer`, `key` ou `passphrase` são strings.

 
- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- Retorna: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) Um novo `Buffer` com o conteúdo descriptografado.

Descriptografa o `buffer` com a `key`. O `buffer` foi previamente criptografado usando a chave privada correspondente, por exemplo, usando [`crypto.privateEncrypt()`](/pt/nodejs/api/crypto#cryptoprivateencryptprivatekey-buffer).

Se `key` não for um [`KeyObject`](/pt/nodejs/api/crypto#class-keyobject), esta função se comporta como se `key` tivesse sido passado para [`crypto.createPublicKey()`](/pt/nodejs/api/crypto#cryptocreatepublickeykey). Se for um objeto, a propriedade `padding` pode ser passada. Caso contrário, esta função usa `RSA_PKCS1_PADDING`.

Como as chaves públicas RSA podem ser derivadas de chaves privadas, uma chave privada pode ser passada em vez de uma chave pública.


### `crypto.publicEncrypt(key, buffer)` {#cryptopublicencryptkey-buffer}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v15.0.0 | Adicionado string, ArrayBuffer e CryptoKey como tipos de chave permitidos. O oaepLabel e a passphrase podem ser ArrayBuffers. O buffer pode ser uma string ou ArrayBuffer. Todos os tipos que aceitam buffers são limitados a um máximo de 2 ** 31 - 1 bytes. |
| v12.11.0 | A opção `oaepLabel` foi adicionada. |
| v12.9.0 | A opção `oaepHash` foi adicionada. |
| v11.6.0 | Esta função agora suporta objetos de chave. |
| v0.11.14 | Adicionado em: v0.11.14 |
:::

- `key` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/pt/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/pt/nodejs/api/webcrypto#class-cryptokey)
    - `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/pt/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/pt/nodejs/api/webcrypto#class-cryptokey) Uma chave pública ou privada codificada em PEM, [\<KeyObject\>](/pt/nodejs/api/crypto#class-keyobject) ou [\<CryptoKey\>](/pt/nodejs/api/webcrypto#class-cryptokey).
    - `oaepHash` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A função hash para usar para preenchimento OAEP e MGF1. **Padrão:** `'sha1'`
    - `oaepLabel` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) O rótulo a ser usado para o preenchimento OAEP. Se não for especificado, nenhum rótulo é usado.
    - `passphrase` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Uma senha opcional para a chave privada.
    - `padding` [\<crypto.constants\>](/pt/nodejs/api/crypto#cryptoconstants) Um valor de preenchimento opcional definido em `crypto.constants`, que pode ser: `crypto.constants.RSA_NO_PADDING`, `crypto.constants.RSA_PKCS1_PADDING` ou `crypto.constants.RSA_PKCS1_OAEP_PADDING`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A codificação de string a ser usada quando `buffer`, `key`, `oaepLabel` ou `passphrase` são strings.
  
 
- `buffer` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- Retorna: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) Um novo `Buffer` com o conteúdo criptografado.

Criptografa o conteúdo de `buffer` com `key` e retorna um novo [`Buffer`](/pt/nodejs/api/buffer) com o conteúdo criptografado. Os dados retornados podem ser descriptografados usando a chave privada correspondente, por exemplo, usando [`crypto.privateDecrypt()`](/pt/nodejs/api/crypto#cryptoprivatedecryptprivatekey-buffer).

Se `key` não for um [`KeyObject`](/pt/nodejs/api/crypto#class-keyobject), esta função se comporta como se `key` tivesse sido passado para [`crypto.createPublicKey()`](/pt/nodejs/api/crypto#cryptocreatepublickeykey). Se for um objeto, a propriedade `padding` pode ser passada. Caso contrário, esta função usa `RSA_PKCS1_OAEP_PADDING`.

Como as chaves públicas RSA podem ser derivadas de chaves privadas, uma chave privada pode ser passada em vez de uma chave pública.


### `crypto.randomBytes(size[, callback])` {#cryptorandombytessize-callback}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v9.0.0 | Passar `null` como o argumento `callback` agora lança `ERR_INVALID_CALLBACK`. |
| v0.5.8 | Adicionado em: v0.5.8 |
:::

- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de bytes a serem gerados. O `size` não deve ser maior que `2**31 - 1`.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `buf` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer)


- Retorna: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) se a função `callback` não for fornecida.

Gera dados pseudoaleatórios criptograficamente fortes. O argumento `size` é um número que indica o número de bytes a serem gerados.

Se uma função `callback` for fornecida, os bytes são gerados de forma assíncrona e a função `callback` é invocada com dois argumentos: `err` e `buf`. Se ocorrer um erro, `err` será um objeto `Error`; caso contrário, será `null`. O argumento `buf` é um [`Buffer`](/pt/nodejs/api/buffer) contendo os bytes gerados.

::: code-group
```js [ESM]
// Assíncrono
const {
  randomBytes,
} = await import('node:crypto');

randomBytes(256, (err, buf) => {
  if (err) throw err;
  console.log(`${buf.length} bytes de dados aleatórios: ${buf.toString('hex')}`);
});
```

```js [CJS]
// Assíncrono
const {
  randomBytes,
} = require('node:crypto');

randomBytes(256, (err, buf) => {
  if (err) throw err;
  console.log(`${buf.length} bytes de dados aleatórios: ${buf.toString('hex')}`);
});
```
:::

Se a função `callback` não for fornecida, os bytes aleatórios serão gerados de forma síncrona e retornados como um [`Buffer`](/pt/nodejs/api/buffer). Um erro será lançado se houver um problema ao gerar os bytes.

::: code-group
```js [ESM]
// Síncrono
const {
  randomBytes,
} = await import('node:crypto');

const buf = randomBytes(256);
console.log(
  `${buf.length} bytes de dados aleatórios: ${buf.toString('hex')}`);
```

```js [CJS]
// Síncrono
const {
  randomBytes,
} = require('node:crypto');

const buf = randomBytes(256);
console.log(
  `${buf.length} bytes de dados aleatórios: ${buf.toString('hex')}`);
```
:::

O método `crypto.randomBytes()` não será concluído até que haja entropia suficiente disponível. Isso normalmente nunca deve demorar mais do que alguns milissegundos. A única vez em que a geração de bytes aleatórios pode concebivelmente bloquear por um período de tempo mais longo é logo após a inicialização, quando todo o sistema ainda está com pouca entropia.

Esta API usa o threadpool do libuv, o que pode ter implicações de desempenho surpreendentes e negativas para algumas aplicações; consulte a documentação [`UV_THREADPOOL_SIZE`](/pt/nodejs/api/cli#uv_threadpool_sizesize) para obter mais informações.

A versão assíncrona de `crypto.randomBytes()` é realizada em uma única solicitação de threadpool. Para minimizar a variação da duração das tarefas do threadpool, particione grandes solicitações de `randomBytes` ao fazer isso como parte do atendimento de uma solicitação do cliente.


### `crypto.randomFill(buffer[, offset][, size], callback)` {#cryptorandomfillbuffer-offset-size-callback}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v9.0.0 | O argumento `buffer` pode ser qualquer `TypedArray` ou `DataView`. |
| v7.10.0, v6.13.0 | Adicionado em: v7.10.0, v6.13.0 |
:::

- `buffer` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Deve ser fornecido. O tamanho do `buffer` fornecido não deve ser maior que `2**31 - 1`.
- `offset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `0`
- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `buffer.length - offset`. O `size` não deve ser maior que `2**31 - 1`.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `function(err, buf) {}`.

Esta função é semelhante a [`crypto.randomBytes()`](/pt/nodejs/api/crypto#cryptorandombytessize-callback), mas requer que o primeiro argumento seja um [`Buffer`](/pt/nodejs/api/buffer) que será preenchido. Também requer que um callback seja passado.

Se a função `callback` não for fornecida, um erro será lançado.

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

// O acima é equivalente ao seguinte:
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

// O acima é equivalente ao seguinte:
randomFill(buf, 5, 5, (err, buf) => {
  if (err) throw err;
  console.log(buf.toString('hex'));
});
```
:::

Qualquer instância de `ArrayBuffer`, `TypedArray` ou `DataView` pode ser passada como `buffer`.

Embora isso inclua instâncias de `Float32Array` e `Float64Array`, esta função não deve ser usada para gerar números de ponto flutuante aleatórios. O resultado pode conter `+Infinity`, `-Infinity` e `NaN`, e mesmo que o array contenha apenas números finitos, eles não são extraídos de uma distribuição aleatória uniforme e não têm limites inferiores ou superiores significativos.

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

Esta API usa o threadpool do libuv, o que pode ter implicações de desempenho surpreendentes e negativas para algumas aplicações; consulte a documentação [`UV_THREADPOOL_SIZE`](/pt/nodejs/api/cli#uv_threadpool_sizesize) para obter mais informações.

A versão assíncrona de `crypto.randomFill()` é realizada em uma única requisição de threadpool. Para minimizar a variação do comprimento da tarefa do threadpool, particione grandes requisições de `randomFill` ao fazer isso como parte do atendimento a uma requisição do cliente.


### `crypto.randomFillSync(buffer[, offset][, size])` {#cryptorandomfillsyncbuffer-offset-size}

::: info [Histórico]
| Versão | Mudanças |
|---|---|
| v9.0.0 | O argumento `buffer` pode ser qualquer `TypedArray` ou `DataView`. |
| v7.10.0, v6.13.0 | Adicionado em: v7.10.0, v6.13.0 |
:::

- `buffer` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Deve ser fornecido. O tamanho do `buffer` fornecido não deve ser maior que `2**31 - 1`.
- `offset` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `0`
- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `buffer.length - offset`. O `size` não deve ser maior que `2**31 - 1`.
- Retorna: [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) O objeto passado como argumento `buffer`.

Versão síncrona de [`crypto.randomFill()`](/pt/nodejs/api/crypto#cryptorandomfillbuffer-offset-size-callback).

::: code-group
```js [ESM]
import { Buffer } from 'node:buffer';
const { randomFillSync } = await import('node:crypto');

const buf = Buffer.alloc(10);
console.log(randomFillSync(buf).toString('hex'));

randomFillSync(buf, 5);
console.log(buf.toString('hex'));

// O acima é equivalente ao seguinte:
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

// O acima é equivalente ao seguinte:
randomFillSync(buf, 5, 5);
console.log(buf.toString('hex'));
```
:::

Qualquer instância de `ArrayBuffer`, `TypedArray` ou `DataView` pode ser passada como `buffer`.

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

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v14.10.0, v12.19.0 | Adicionado em: v14.10.0, v12.19.0 |
:::

- `min` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Início do intervalo aleatório (inclusivo). **Padrão:** `0`.
- `max` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Fim do intervalo aleatório (exclusivo).
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) `function(err, n) {}`.

Retorna um inteiro aleatório `n` tal que `min \<= n \< max`. Esta implementação evita [viés de módulo](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#Modulo_bias).

O intervalo (`max - min`) deve ser menor que 2<sup>53</sup>. `min` e `max` devem ser [inteiros seguros](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger).

Se a função `callback` não for fornecida, o inteiro aleatório é gerado síncronamente.

::: code-group
```js [ESM]
// Assíncrono
const {
  randomInt,
} = await import('node:crypto');

randomInt(3, (err, n) => {
  if (err) throw err;
  console.log(`Número aleatório escolhido de (0, 1, 2): ${n}`);
});
```

```js [CJS]
// Assíncrono
const {
  randomInt,
} = require('node:crypto');

randomInt(3, (err, n) => {
  if (err) throw err;
  console.log(`Número aleatório escolhido de (0, 1, 2): ${n}`);
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
console.log(`Número aleatório escolhido de (0, 1, 2): ${n}`);
```

```js [CJS]
// Síncrono
const {
  randomInt,
} = require('node:crypto');

const n = randomInt(3);
console.log(`Número aleatório escolhido de (0, 1, 2): ${n}`);
```
:::

::: code-group
```js [ESM]
// Com argumento `min`
const {
  randomInt,
} = await import('node:crypto');

const n = randomInt(1, 7);
console.log(`O dado rolou: ${n}`);
```

```js [CJS]
// Com argumento `min`
const {
  randomInt,
} = require('node:crypto');

const n = randomInt(1, 7);
console.log(`O dado rolou: ${n}`);
```
:::


### `crypto.randomUUID([options])` {#cryptorandomuuidoptions}

**Adicionado em: v15.6.0, v14.17.0**

- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `disableEntropyCache` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Por padrão, para melhorar o desempenho, o Node.js gera e armazena em cache dados aleatórios suficientes para gerar até 128 UUIDs aleatórios. Para gerar um UUID sem usar o cache, defina `disableEntropyCache` como `true`. **Padrão:** `false`.


- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Gera um UUID versão 4 [RFC 4122](https://www.rfc-editor.org/rfc/rfc4122.txt) aleatório. O UUID é gerado usando um gerador de números pseudoaleatórios criptográfico.

### `crypto.scrypt(password, salt, keylen[, options], callback)` {#cryptoscryptpassword-salt-keylen-options-callback}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v15.0.0 | Os argumentos password e salt também podem ser instâncias ArrayBuffer. |
| v12.8.0, v10.17.0 | O valor `maxmem` agora pode ser qualquer inteiro seguro. |
| v10.9.0 | Os nomes das opções `cost`, `blockSize` e `parallelization` foram adicionados. |
| v10.5.0 | Adicionado em: v10.5.0 |
:::

- `password` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `salt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `keylen` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cost` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Parâmetro de custo de CPU/memória. Deve ser uma potência de dois maior que um. **Padrão:** `16384`.
    - `blockSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Parâmetro de tamanho do bloco. **Padrão:** `8`.
    - `parallelization` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Parâmetro de paralelização. **Padrão:** `1`.
    - `N` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Alias para `cost`. Apenas um dos dois pode ser especificado.
    - `r` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Alias para `blockSize`. Apenas um dos dois pode ser especificado.
    - `p` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Alias para `parallelization`. Apenas um dos dois pode ser especificado.
    - `maxmem` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Limite superior de memória. É um erro quando (aproximadamente) `128 * N * r \> maxmem`. **Padrão:** `32 * 1024 * 1024`.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `derivedKey` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer)



Fornece uma implementação [scrypt](https://en.wikipedia.org/wiki/Scrypt) assíncrona. Scrypt é uma função de derivação de chave baseada em senha projetada para ser computacionalmente e em termos de memória cara, a fim de tornar os ataques de força bruta não recompensadores.

O `salt` deve ser o mais exclusivo possível. Recomenda-se que um salt seja aleatório e tenha pelo menos 16 bytes de comprimento. Veja [NIST SP 800-132](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-132.pdf) para detalhes.

Ao passar strings para `password` ou `salt`, considere [ressalvas ao usar strings como entradas para APIs criptográficas](/pt/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis).

A função `callback` é chamada com dois argumentos: `err` e `derivedKey`. `err` é um objeto de exceção quando a derivação da chave falha, caso contrário, `err` é `null`. `derivedKey` é passado para o callback como um [`Buffer`](/pt/nodejs/api/buffer).

Uma exceção é lançada quando qualquer um dos argumentos de entrada especifica valores ou tipos inválidos.



::: code-group
```js [ESM]
const {
  scrypt,
} = await import('node:crypto');

// Usando os padrões de fábrica.
scrypt('password', 'salt', 64, (err, derivedKey) => {
  if (err) throw err;
  console.log(derivedKey.toString('hex'));  // '3745e48...08d59ae'
});
// Usando um parâmetro N personalizado. Deve ser uma potência de dois.
scrypt('password', 'salt', 64, { N: 1024 }, (err, derivedKey) => {
  if (err) throw err;
  console.log(derivedKey.toString('hex'));  // '3745e48...aa39b34'
});
```

```js [CJS]
const {
  scrypt,
} = require('node:crypto');

// Usando os padrões de fábrica.
scrypt('password', 'salt', 64, (err, derivedKey) => {
  if (err) throw err;
  console.log(derivedKey.toString('hex'));  // '3745e48...08d59ae'
});
// Usando um parâmetro N personalizado. Deve ser uma potência de dois.
scrypt('password', 'salt', 64, { N: 1024 }, (err, derivedKey) => {
  if (err) throw err;
  console.log(derivedKey.toString('hex'));  // '3745e48...aa39b34'
});
```
:::

### `crypto.scryptSync(password, salt, keylen[, options])` {#cryptoscryptsyncpassword-salt-keylen-options}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v12.8.0, v10.17.0 | O valor de `maxmem` agora pode ser qualquer inteiro seguro. |
| v10.9.0 | Os nomes das opções `cost`, `blockSize` e `parallelization` foram adicionados. |
| v10.5.0 | Adicionado em: v10.5.0 |
:::

- `password` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `salt` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `keylen` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cost` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Parâmetro de custo de CPU/memória. Deve ser uma potência de dois maior que um. **Padrão:** `16384`.
    - `blockSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Parâmetro de tamanho do bloco. **Padrão:** `8`.
    - `parallelization` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Parâmetro de paralelização. **Padrão:** `1`.
    - `N` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Alias para `cost`. Apenas um dos dois pode ser especificado.
    - `r` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Alias para `blockSize`. Apenas um dos dois pode ser especificado.
    - `p` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Alias para `parallelization`. Apenas um dos dois pode ser especificado.
    - `maxmem` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Limite superior de memória. É um erro quando (aproximadamente) `128 * N * r \> maxmem`. **Padrão:** `32 * 1024 * 1024`.


- Retorna: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer)

Fornece uma implementação síncrona de [scrypt](https://en.wikipedia.org/wiki/Scrypt). Scrypt é uma função de derivação de chave baseada em senha que é projetada para ser cara computacionalmente e em termos de memória, a fim de tornar os ataques de força bruta não compensadores.

O `salt` deve ser o mais exclusivo possível. Recomenda-se que um salt seja aleatório e tenha pelo menos 16 bytes de comprimento. Consulte [NIST SP 800-132](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-132.pdf) para obter detalhes.

Ao passar strings para `password` ou `salt`, considere as [ressalvas ao usar strings como entradas para APIs criptográficas](/pt/nodejs/api/crypto#using-strings-as-inputs-to-cryptographic-apis).

Uma exceção é lançada quando a derivação da chave falha, caso contrário, a chave derivada é retornada como um [`Buffer`](/pt/nodejs/api/buffer).

Uma exceção é lançada quando algum dos argumentos de entrada especifica valores ou tipos inválidos.



::: code-group
```js [ESM]
const {
  scryptSync,
} = await import('node:crypto');
// Usando os padrões de fábrica.

const key1 = scryptSync('password', 'salt', 64);
console.log(key1.toString('hex'));  // '3745e48...08d59ae'
// Usando um parâmetro N personalizado. Deve ser uma potência de dois.
const key2 = scryptSync('password', 'salt', 64, { N: 1024 });
console.log(key2.toString('hex'));  // '3745e48...aa39b34'
```

```js [CJS]
const {
  scryptSync,
} = require('node:crypto');
// Usando os padrões de fábrica.

const key1 = scryptSync('password', 'salt', 64);
console.log(key1.toString('hex'));  // '3745e48...08d59ae'
// Usando um parâmetro N personalizado. Deve ser uma potência de dois.
const key2 = scryptSync('password', 'salt', 64, { N: 1024 });
console.log(key2.toString('hex'));  // '3745e48...aa39b34'
```
:::


### `crypto.secureHeapUsed()` {#cryptosecureheapused}

**Adicionado em: v15.6.0**

- Retorna: [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `total` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O tamanho total do heap seguro alocado, conforme especificado usando o sinalizador de linha de comando `--secure-heap=n`.
    - `min` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) A alocação mínima do heap seguro, conforme especificado usando o sinalizador de linha de comando `--secure-heap-min`.
    - `used` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número total de bytes atualmente alocados do heap seguro.
    - `utilization` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) A proporção calculada de `used` para o `total` de bytes alocados.



### `crypto.setEngine(engine[, flags])` {#cryptosetengineengine-flags}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v22.4.0, v20.16.0 | O suporte para mecanismos personalizados no OpenSSL 3 está obsoleto. |
| v0.11.11 | Adicionado em: v0.11.11 |
:::

- `engine` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `flags` [\<crypto.constants\>](/pt/nodejs/api/crypto#cryptoconstants) **Padrão:** `crypto.constants.ENGINE_METHOD_ALL`

Carrega e define o `engine` para algumas ou todas as funções do OpenSSL (selecionadas por flags). O suporte para mecanismos personalizados no OpenSSL está obsoleto a partir do OpenSSL 3.

`engine` pode ser um id ou um caminho para a biblioteca compartilhada do mecanismo.

O argumento opcional `flags` usa `ENGINE_METHOD_ALL` por padrão. O `flags` é um campo de bits que usa um ou uma combinação dos seguintes flags (definidos em `crypto.constants`):

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

**Adicionado em: v10.0.0**

- `bool` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` para habilitar o modo FIPS.

Habilita o provedor crypto compatível com FIPS em uma build do Node.js habilitada para FIPS. Lança um erro se o modo FIPS não estiver disponível.

### `crypto.sign(algorithm, data, key[, callback])` {#cryptosignalgorithm-data-key-callback}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v15.12.0 | Argumento callback opcional adicionado. |
| v13.2.0, v12.16.0 | Esta função agora suporta assinaturas DSA e ECDSA IEEE-P1363. |
| v12.0.0 | Adicionado em: v12.0.0 |
:::

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
- `data` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `key` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/pt/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/pt/nodejs/api/webcrypto#class-cryptokey)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) 
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `signature` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer)
  
 
- Retorna: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) se a função `callback` não for fornecida.

Calcula e retorna a assinatura para `data` usando a chave privada e o algoritmo fornecidos. Se `algorithm` for `null` ou `undefined`, então o algoritmo é dependente do tipo de chave (especialmente Ed25519 e Ed448).

Se `key` não for um [`KeyObject`](/pt/nodejs/api/crypto#class-keyobject), esta função se comporta como se `key` tivesse sido passado para [`crypto.createPrivateKey()`](/pt/nodejs/api/crypto#cryptocreateprivatekeykey). Se for um objeto, as seguintes propriedades adicionais podem ser passadas:

-  `dsaEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Para DSA e ECDSA, esta opção especifica o formato da assinatura gerada. Pode ser um dos seguintes: 
    - `'der'` (padrão): Estrutura de assinatura ASN.1 codificada em DER que codifica `(r, s)`.
    - `'ieee-p1363'`: Formato de assinatura `r || s` conforme proposto em IEEE-P1363.
  
 
-  `padding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Valor de preenchimento opcional para RSA, um dos seguintes: 
    - `crypto.constants.RSA_PKCS1_PADDING` (padrão)
    - `crypto.constants.RSA_PKCS1_PSS_PADDING`
  
 `RSA_PKCS1_PSS_PADDING` usará MGF1 com a mesma função hash usada para assinar a mensagem, conforme especificado na seção 3.1 da [RFC 4055](https://www.rfc-editor.org/rfc/rfc4055.txt). 
-  `saltLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Comprimento do salt para quando o preenchimento for `RSA_PKCS1_PSS_PADDING`. O valor especial `crypto.constants.RSA_PSS_SALTLEN_DIGEST` define o comprimento do salt para o tamanho do digest, `crypto.constants.RSA_PSS_SALTLEN_MAX_SIGN` (padrão) define-o para o valor máximo permitido. 

Se a função `callback` for fornecida, esta função usa o threadpool do libuv.


### `crypto.subtle` {#cryptosubtle}

**Adicionado em: v17.4.0**

- Tipo: [\<SubtleCrypto\>](/pt/nodejs/api/webcrypto#class-subtlecrypto)

Um alias conveniente para [`crypto.webcrypto.subtle`](/pt/nodejs/api/webcrypto#class-subtlecrypto).

### `crypto.timingSafeEqual(a, b)` {#cryptotimingsafeequala-b}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v15.0.0 | Os argumentos a e b também podem ser ArrayBuffer. |
| v6.6.0 | Adicionado em: v6.6.0 |
:::

- `a` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `b` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Esta função compara os bytes subjacentes que representam as instâncias `ArrayBuffer`, `TypedArray` ou `DataView` fornecidas usando um algoritmo de tempo constante.

Esta função não vaza informações de tempo que permitiriam a um invasor adivinhar um dos valores. Isso é adequado para comparar resumos HMAC ou valores secretos, como cookies de autenticação ou [URLs de capacidade](https://www.w3.org/TR/capability-urls/).

`a` e `b` devem ser ambos `Buffer`s, `TypedArray`s ou `DataView`s e devem ter o mesmo comprimento em bytes. Um erro é lançado se `a` e `b` tiverem comprimentos de byte diferentes.

Se pelo menos um de `a` e `b` for um `TypedArray` com mais de um byte por entrada, como `Uint16Array`, o resultado será calculado usando a ordem de bytes da plataforma.

**Quando ambas as entradas são <code>Float32Array</code>s ou
<code>Float64Array</code>s, esta função pode retornar resultados inesperados devido à codificação
IEEE 754 de números de ponto flutuante. Em particular, nem <code>x === y</code> nem
<code>Object.is(x, y)</code> implica que as representações de byte de dois números de ponto
flutuante <code>x</code> e <code>y</code> são iguais.**

O uso de `crypto.timingSafeEqual` não garante que o código *circundante* seja seguro em termos de tempo. Deve-se ter cuidado para garantir que o código circundante não introduza vulnerabilidades de tempo.


### `crypto.verify(algorithm, data, key, signature[, callback])` {#cryptoverifyalgorithm-data-key-signature-callback}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v15.12.0 | Argumento de callback opcional adicionado. |
| v15.0.0 | Os argumentos data, key e signature também podem ser ArrayBuffer. |
| v13.2.0, v12.16.0 | Esta função agora suporta assinaturas DSA e ECDSA IEEE-P1363. |
| v12.0.0 | Adicionado em: v12.0.0 |
:::

- `algorithm` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)
- `data` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `key` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<KeyObject\>](/pt/nodejs/api/crypto#class-keyobject) | [\<CryptoKey\>](/pt/nodejs/api/webcrypto#class-cryptokey)
- `signature` [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `result` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` ou `false` dependendo da validade da assinatura para os dados e chave pública se a função `callback` não for fornecida.

Verifica a assinatura fornecida para `data` usando a chave e o algoritmo fornecidos. Se `algorithm` for `null` ou `undefined`, o algoritmo depende do tipo de chave (especialmente Ed25519 e Ed448).

Se `key` não for um [`KeyObject`](/pt/nodejs/api/crypto#class-keyobject), esta função se comporta como se `key` tivesse sido passado para [`crypto.createPublicKey()`](/pt/nodejs/api/crypto#cryptocreatepublickeykey). Se for um objeto, as seguintes propriedades adicionais podem ser passadas:

- `dsaEncoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Para DSA e ECDSA, esta opção especifica o formato da assinatura. Pode ser um dos seguintes:
    - `'der'` (padrão): Estrutura de assinatura ASN.1 codificada em DER que codifica `(r, s)`.
    - `'ieee-p1363'`: Formato de assinatura `r || s` conforme proposto em IEEE-P1363.

- `padding` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Valor de preenchimento opcional para RSA, um dos seguintes:
    - `crypto.constants.RSA_PKCS1_PADDING` (padrão)
    - `crypto.constants.RSA_PKCS1_PSS_PADDING`

`RSA_PKCS1_PSS_PADDING` usará MGF1 com a mesma função de hash usada para assinar a mensagem, conforme especificado na seção 3.1 do [RFC 4055](https://www.rfc-editor.org/rfc/rfc4055.txt).
- `saltLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Comprimento do salt para quando o preenchimento for `RSA_PKCS1_PSS_PADDING`. O valor especial `crypto.constants.RSA_PSS_SALTLEN_DIGEST` define o comprimento do salt para o tamanho do digest, `crypto.constants.RSA_PSS_SALTLEN_MAX_SIGN` (padrão) define-o para o valor máximo permitido.

O argumento `signature` é a assinatura calculada anteriormente para os `data`.

Como as chaves públicas podem ser derivadas de chaves privadas, uma chave privada ou uma chave pública pode ser passada para `key`.

Se a função `callback` for fornecida, esta função usará o threadpool do libuv.


### `crypto.webcrypto` {#cryptowebcrypto}

**Adicionado em: v15.0.0**

Tipo: [\<Crypto\>](/pt/nodejs/api/webcrypto#class-crypto) Uma implementação do padrão Web Crypto API.

Consulte a [documentação da Web Crypto API](/pt/nodejs/api/webcrypto) para obter detalhes.

## Notas {#notes}

### Usando strings como entradas para APIs criptográficas {#using-strings-as-inputs-to-cryptographic-apis}

Por razões históricas, muitas APIs criptográficas fornecidas pelo Node.js aceitam strings como entradas onde o algoritmo criptográfico subjacente funciona em sequências de bytes. Essas instâncias incluem textos simples, textos cifrados, chaves simétricas, vetores de inicialização, senhas, salts, tags de autenticação e dados autenticados adicionais.

Ao passar strings para APIs criptográficas, considere os seguintes fatores.

- Nem todas as sequências de bytes são strings UTF-8 válidas. Portanto, quando uma sequência de bytes de comprimento `n` é derivada de uma string, sua entropia é geralmente menor que a entropia de uma sequência de bytes `n` aleatória ou pseudoaleatória. Por exemplo, nenhuma string UTF-8 resultará na sequência de bytes `c0 af`. As chaves secretas devem ser quase exclusivamente sequências de bytes aleatórias ou pseudoaleatórias.
- Da mesma forma, ao converter sequências de bytes aleatórias ou pseudoaleatórias em strings UTF-8, subsequências que não representam pontos de código válidos podem ser substituídas pelo caractere de substituição Unicode (`U+FFFD`). A representação de byte da string Unicode resultante pode, portanto, não ser igual à sequência de bytes da qual a string foi criada. As saídas de cifras, funções de hash, algoritmos de assinatura e funções de derivação de chaves são sequências de bytes pseudoaleatórias e não devem ser usadas como strings Unicode.
- Quando as strings são obtidas da entrada do usuário, alguns caracteres Unicode podem ser representados de várias maneiras equivalentes que resultam em sequências de bytes diferentes. Por exemplo, ao passar uma senha de usuário para uma função de derivação de chave, como PBKDF2 ou scrypt, o resultado da função de derivação de chave depende se a string usa caracteres compostos ou decompostos. O Node.js não normaliza as representações de caracteres. Os desenvolvedores devem considerar o uso de [`String.prototype.normalize()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize) nas entradas do usuário antes de passá-las para APIs criptográficas.


### API de streams legada (anterior ao Node.js 0.10) {#legacy-streams-api-prior-to-nodejs-010}

O módulo Crypto foi adicionado ao Node.js antes de existir o conceito de uma API de Stream unificada e antes de existirem objetos [`Buffer`](/pt/nodejs/api/buffer) para lidar com dados binários. Como tal, muitas classes `crypto` têm métodos que não são normalmente encontrados em outras classes Node.js que implementam a API de [streams](/pt/nodejs/api/stream) (por exemplo, `update()`, `final()` ou `digest()`). Além disso, muitos métodos aceitavam e retornavam strings codificadas em `'latin1'` por padrão, em vez de `Buffer`s. Este padrão foi alterado após o Node.js v0.8 para usar objetos [`Buffer`](/pt/nodejs/api/buffer) por padrão.

### Suporte para algoritmos fracos ou comprometidos {#support-for-weak-or-compromised-algorithms}

O módulo `node:crypto` ainda suporta alguns algoritmos que já estão comprometidos e não são recomendados para uso. A API também permite o uso de cifras e hashes com um tamanho de chave pequeno que são muito fracos para uso seguro.

Os usuários devem assumir total responsabilidade por selecionar o algoritmo de criptografia e o tamanho da chave de acordo com seus requisitos de segurança.

Com base nas recomendações do [NIST SP 800-131A](https://nvlpubs.nist.nistpubs/SpecialPublications/NIST.SP.800-131Ar2.pdf):

- MD5 e SHA-1 não são mais aceitáveis onde a resistência à colisão é necessária, como assinaturas digitais.
- A chave usada com os algoritmos RSA, DSA e DH é recomendada para ter pelo menos 2048 bits e a da curva de ECDSA e ECDH pelo menos 224 bits, para ser segura para uso por vários anos.
- Os grupos DH de `modp1`, `modp2` e `modp5` têm um tamanho de chave menor que 2048 bits e não são recomendados.

Veja a referência para outras recomendações e detalhes.

Alguns algoritmos que têm fraquezas conhecidas e são de pouca relevância na prática estão disponíveis apenas através do [provedor legado](/pt/nodejs/api/cli#--openssl-legacy-provider), que não está habilitado por padrão.

### Modo CCM {#ccm-mode}

CCM é um dos [algoritmos AEAD](https://en.wikipedia.org/wiki/Authenticated_encryption) suportados. As aplicações que usam este modo devem obedecer a certas restrições ao usar a API de cifra:

- O comprimento da tag de autenticação deve ser especificado durante a criação da cifra, definindo a opção `authTagLength` e deve ser um de 4, 6, 8, 10, 12, 14 ou 16 bytes.
- O comprimento do vetor de inicialização (nonce) `N` deve estar entre 7 e 13 bytes (`7 ≤ N ≤ 13`).
- O comprimento do texto simples é limitado a `2 ** (8 * (15 - N))` bytes.
- Ao descriptografar, a tag de autenticação deve ser definida via `setAuthTag()` antes de chamar `update()`. Caso contrário, a descriptografia falhará e `final()` lançará um erro em conformidade com a seção 2.6 da [RFC 3610](https://www.rfc-editor.org/rfc/rfc3610.txt).
- O uso de métodos de stream como `write(data)`, `end(data)` ou `pipe()` no modo CCM pode falhar, pois o CCM não pode lidar com mais de um pedaço de dados por instância.
- Ao passar dados autenticados adicionais (AAD), o comprimento da mensagem real em bytes deve ser passado para `setAAD()` através da opção `plaintextLength`. Muitas bibliotecas de criptografia incluem a tag de autenticação no texto cifrado, o que significa que elas produzem textos cifrados do comprimento `plaintextLength + authTagLength`. O Node.js não inclui a tag de autenticação, então o comprimento do texto cifrado é sempre `plaintextLength`. Isso não é necessário se nenhum AAD for usado.
- Como o CCM processa a mensagem inteira de uma vez, `update()` deve ser chamado exatamente uma vez.
- Mesmo que chamar `update()` seja suficiente para criptografar/descriptografar a mensagem, as aplicações *devem* chamar `final()` para computar ou verificar a tag de autenticação.

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

Ao usar o OpenSSL 3, o Node.js suporta o FIPS 140-2 quando usado com um provedor OpenSSL 3 apropriado, como o [provedor FIPS do OpenSSL 3](https://www.openssl.org/docs/man3.0/man7/crypto#FIPS-provider) que pode ser instalado seguindo as instruções no [arquivo README do FIPS do OpenSSL](https://github.com/openssl/openssl/blob/openssl-3.0/README-FIPS.md).

Para suporte FIPS no Node.js, você precisará de:

- Um provedor OpenSSL 3 FIPS corretamente instalado.
- Um [arquivo de configuração do módulo FIPS](https://www.openssl.org/docs/man3.0/man5/fips_config) do OpenSSL 3.
- Um arquivo de configuração OpenSSL 3 que referencia o arquivo de configuração do módulo FIPS.

O Node.js precisará ser configurado com um arquivo de configuração OpenSSL que aponte para o provedor FIPS. Um exemplo de arquivo de configuração é:

```text [TEXT]
nodejs_conf = nodejs_init

.include /<caminho absoluto>/fipsmodule.cnf

[nodejs_init]
providers = provider_sect

[provider_sect]
default = default_sect
# O nome da seção fips deve corresponder ao nome da seção dentro do {#the-fips-section-name-should-match-the-section-name-inside-the}
# fipsmodule.cnf incluído.
fips = fips_sect

[default_sect]
activate = 1
```
onde `fipsmodule.cnf` é o arquivo de configuração do módulo FIPS gerado a partir da etapa de instalação do provedor FIPS:

```bash [BASH]
openssl fipsinstall
```
Defina a variável de ambiente `OPENSSL_CONF` para apontar para o seu arquivo de configuração e `OPENSSL_MODULES` para o local da biblioteca dinâmica do provedor FIPS. Ex:

```bash [BASH]
export OPENSSL_CONF=/<caminho para o arquivo de configuração>/nodejs.cnf
export OPENSSL_MODULES=/<caminho para a lib do openssl>/ossl-modules
```
O modo FIPS pode então ser habilitado no Node.js por:

- Iniciar o Node.js com as flags de linha de comando `--enable-fips` ou `--force-fips`.
- Chamar programaticamente `crypto.setFips(true)`.

Opcionalmente, o modo FIPS pode ser habilitado no Node.js através do arquivo de configuração OpenSSL. Ex:

```text [TEXT]
nodejs_conf = nodejs_init

.include /<caminho absoluto>/fipsmodule.cnf

[nodejs_init]
providers = provider_sect
alg_section = algorithm_sect

[provider_sect]
default = default_sect
# O nome da seção fips deve corresponder ao nome da seção dentro do {#included-fipsmodulecnf}
# fipsmodule.cnf incluído.
fips = fips_sect

[default_sect]
activate = 1

[algorithm_sect]
default_properties = fips=yes
```

## Constantes Criptográficas {#the-fips-section-name-should-match-the-section-name-inside-the_1}

As seguintes constantes exportadas por `crypto.constants` aplicam-se a vários usos dos módulos `node:crypto`, `node:tls` e `node:https` e são geralmente específicas do OpenSSL.

### Opções do OpenSSL {#included-fipsmodulecnf_1}

Consulte a [lista de Flags SSL OP](https://wiki.openssl.org/index.php/List_of_SSL_OP_Flags#Table_of_Options) para obter detalhes.

| Constante | Descrição |
| --- | --- |
| `SSL_OP_ALL` | Aplica várias soluções alternativas para bugs dentro do OpenSSL. Consulte       [https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options.html](https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options)       para detalhes. |
| `SSL_OP_ALLOW_NO_DHE_KEX` | Instrui o OpenSSL a permitir um modo de troca de chaves não baseado em [EC]DHE     para TLS v1.3 |
| `SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION` | Permite a renegociação legada insegura entre o OpenSSL e clientes ou servidores     não corrigidos. Consulte       [https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options.html](https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options)  . |
| `SSL_OP_CIPHER_SERVER_PREFERENCE` | Tenta usar as preferências do servidor em vez das do cliente ao     selecionar uma cifra. O comportamento depende da versão do protocolo. Consulte       [https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options.html](https://www.openssl.org/docs/man3.0/man3/SSL_CTX_set_options)  . |
| `SSL_OP_CISCO_ANYCONNECT` | Instrui o OpenSSL a usar o identificador de versão da Cisco do DTLS_BAD_VER. |
| `SSL_OP_COOKIE_EXCHANGE` | Instrui o OpenSSL a ativar a troca de cookies. |
| `SSL_OP_CRYPTOPRO_TLSEXT_BUG` | Instrui o OpenSSL a adicionar uma extensão server-hello de uma versão antiga     do rascunho cryptopro. |
| `SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS` | Instrui o OpenSSL a desativar uma solução alternativa de vulnerabilidade SSL 3.0/TLS 1.0     adicionada no OpenSSL 0.9.6d. |
| `SSL_OP_LEGACY_SERVER_CONNECT` | Permite a conexão inicial a servidores que não suportam RI. |
| `SSL_OP_NO_COMPRESSION` | Instrui o OpenSSL a desativar o suporte para compactação SSL/TLS. |
| `SSL_OP_NO_ENCRYPT_THEN_MAC` | Instrui o OpenSSL a desativar encrypt-then-MAC. |
| `SSL_OP_NO_QUERY_MTU` ||
| `SSL_OP_NO_RENEGOTIATION` | Instrui o OpenSSL a desativar a renegociação. |
| `SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION` | Instrui o OpenSSL a sempre iniciar uma nova sessão ao realizar     a renegociação. |
| `SSL_OP_NO_SSLv2` | Instrui o OpenSSL a desativar o SSL v2 |
| `SSL_OP_NO_SSLv3` | Instrui o OpenSSL a desativar o SSL v3 |
| `SSL_OP_NO_TICKET` | Instrui o OpenSSL a desativar o uso de tickets RFC4507bis. |
| `SSL_OP_NO_TLSv1` | Instrui o OpenSSL a desativar o TLS v1 |
| `SSL_OP_NO_TLSv1_1` | Instrui o OpenSSL a desativar o TLS v1.1 |
| `SSL_OP_NO_TLSv1_2` | Instrui o OpenSSL a desativar o TLS v1.2 |
| `SSL_OP_NO_TLSv1_3` | Instrui o OpenSSL a desativar o TLS v1.3 |
| `SSL_OP_PRIORITIZE_CHACHA` | Instrui o servidor OpenSSL a priorizar ChaCha20-Poly1305     quando o cliente o faz.     Esta opção não tem efeito se       `SSL_OP_CIPHER_SERVER_PREFERENCE`       não estiver ativado. |
| `SSL_OP_TLS_ROLLBACK_BUG` | Instrui o OpenSSL a desativar a detecção de ataque de rollback de versão. |

### Constantes do engine OpenSSL {#crypto-constants}

| Constante | Descrição |
| --- | --- |
| `ENGINE_METHOD_RSA` | Limita o uso do engine a RSA |
| `ENGINE_METHOD_DSA` | Limita o uso do engine a DSA |
| `ENGINE_METHOD_DH` | Limita o uso do engine a DH |
| `ENGINE_METHOD_RAND` | Limita o uso do engine a RAND |
| `ENGINE_METHOD_EC` | Limita o uso do engine a EC |
| `ENGINE_METHOD_CIPHERS` | Limita o uso do engine a CIPHERS |
| `ENGINE_METHOD_DIGESTS` | Limita o uso do engine a DIGESTS |
| `ENGINE_METHOD_PKEY_METHS` | Limita o uso do engine a PKEY_METHS |
| `ENGINE_METHOD_PKEY_ASN1_METHS` | Limita o uso do engine a PKEY_ASN1_METHS |
| `ENGINE_METHOD_ALL` ||
| `ENGINE_METHOD_NONE` ||
### Outras constantes OpenSSL {#openssl-options}

| Constante | Descrição |
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
| `RSA_PSS_SALTLEN_DIGEST` | Define o comprimento do salt para `RSA_PKCS1_PSS_PADDING` para o tamanho do digest ao assinar ou verificar. |
| `RSA_PSS_SALTLEN_MAX_SIGN` | Define o comprimento do salt para `RSA_PKCS1_PSS_PADDING` para o valor máximo permitido ao assinar dados. |
| `RSA_PSS_SALTLEN_AUTO` | Faz com que o comprimento do salt para `RSA_PKCS1_PSS_PADDING` seja determinado automaticamente ao verificar uma assinatura. |
| `POINT_CONVERSION_COMPRESSED` ||
| `POINT_CONVERSION_UNCOMPRESSED` ||
| `POINT_CONVERSION_HYBRID` ||
### Constantes crypto do Node.js {#openssl-engine-constants}

| Constante | Descrição |
| --- | --- |
| `defaultCoreCipherList` | Especifica a lista de cifras padrão integrada usada pelo Node.js. |
| `defaultCipherList` | Especifica a lista de cifras padrão ativa usada pelo processo Node.js atual. |

