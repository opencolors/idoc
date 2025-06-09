---
title: Documentação do Node.js - Zlib
description: O módulo zlib no Node.js oferece funcionalidades de compressão utilizando os algoritmos Gzip, Deflate/Inflate e Brotli. Ele inclui métodos síncronos e assíncronos para comprimir e descomprimir dados, além de várias opções para personalizar o comportamento da compressão.
head:
  - - meta
    - name: og:title
      content: Documentação do Node.js - Zlib | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: O módulo zlib no Node.js oferece funcionalidades de compressão utilizando os algoritmos Gzip, Deflate/Inflate e Brotli. Ele inclui métodos síncronos e assíncronos para comprimir e descomprimir dados, além de várias opções para personalizar o comportamento da compressão.
  - - meta
    - name: twitter:title
      content: Documentação do Node.js - Zlib | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: O módulo zlib no Node.js oferece funcionalidades de compressão utilizando os algoritmos Gzip, Deflate/Inflate e Brotli. Ele inclui métodos síncronos e assíncronos para comprimir e descomprimir dados, além de várias opções para personalizar o comportamento da compressão.
---


# Zlib {#zlib}

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável
:::

**Código-fonte:** [lib/zlib.js](https://github.com/nodejs/node/blob/v23.5.0/lib/zlib.js)

O módulo `node:zlib` fornece funcionalidade de compressão implementada usando Gzip, Deflate/Inflate e Brotli.

Para acessá-lo:

::: code-group
```js [ESM]
import os from 'node:zlib';
```

```js [CJS]
const zlib = require('node:zlib');
```
:::

A compressão e descompressão são construídas em torno da [API de Streams](/pt/nodejs/api/stream) do Node.js.

Comprimir ou descomprimir um stream (como um arquivo) pode ser realizado encaminhando o stream de origem através de um stream `Transform` `zlib` para um stream de destino:

::: code-group
```js [ESM]
import {
  createReadStream,
  createWriteStream,
} from 'node:fs';
import process from 'node:process';
import { createGzip } from 'node:zlib';
import { pipeline } from 'node:stream';

const gzip = createGzip();
const source = createReadStream('input.txt');
const destination = createWriteStream('input.txt.gz');

pipeline(source, gzip, destination, (err) => {
  if (err) {
    console.error('Ocorreu um erro:', err);
    process.exitCode = 1;
  }
});
```

```js [CJS]
const {
  createReadStream,
  createWriteStream,
} = require('node:fs');
const process = require('node:process');
const { createGzip } = require('node:zlib');
const { pipeline } = require('node:stream');

const gzip = createGzip();
const source = createReadStream('input.txt');
const destination = createWriteStream('input.txt.gz');

pipeline(source, gzip, destination, (err) => {
  if (err) {
    console.error('Ocorreu um erro:', err);
    process.exitCode = 1;
  }
});
```
:::

Ou, usando a API `pipeline` da promessa:

::: code-group
```js [ESM]
import {
  createReadStream,
  createWriteStream,
} from 'node:fs';
import process from 'node:process';
import { createGzip } from 'node:zlib';
import { pipeline } from 'node:stream/promises';

async function do_gzip(input, output) {
  const gzip = createGzip();
  const source = createReadStream(input);
  const destination = createWriteStream(output);
  await pipeline(source, gzip, destination);
}

await do_gzip('input.txt', 'input.txt.gz');
```

```js [CJS]
const {
  createReadStream,
  createWriteStream,
} = require('node:fs');
const process = require('node:process');
const { createGzip } = require('node:zlib');
const { pipeline } = require('node:stream/promises');

async function do_gzip(input, output) {
  const gzip = createGzip();
  const source = createReadStream(input);
  const destination = createWriteStream(output);
  await pipeline(source, gzip, destination);
}

do_gzip('input.txt', 'input.txt.gz')
  .catch((err) => {
    console.error('Ocorreu um erro:', err);
    process.exitCode = 1;
  });
```
:::

Também é possível comprimir ou descomprimir dados em uma única etapa:

::: code-group
```js [ESM]
import process from 'node:process';
import { Buffer } from 'node:buffer';
import { deflate, unzip } from 'node:zlib';

const input = '.................................';
deflate(input, (err, buffer) => {
  if (err) {
    console.error('Ocorreu um erro:', err);
    process.exitCode = 1;
  }
  console.log(buffer.toString('base64'));
});

const buffer = Buffer.from('eJzT0yMAAGTvBe8=', 'base64');
unzip(buffer, (err, buffer) => {
  if (err) {
    console.error('Ocorreu um erro:', err);
    process.exitCode = 1;
  }
  console.log(buffer.toString());
});

// Or, Promisified

import { promisify } from 'node:util';
const do_unzip = promisify(unzip);

const unzippedBuffer = await do_unzip(buffer);
console.log(unzippedBuffer.toString());
```

```js [CJS]
const { deflate, unzip } = require('node:zlib');

const input = '.................................';
deflate(input, (err, buffer) => {
  if (err) {
    console.error('Ocorreu um erro:', err);
    process.exitCode = 1;
  }
  console.log(buffer.toString('base64'));
});

const buffer = Buffer.from('eJzT0yMAAGTvBe8=', 'base64');
unzip(buffer, (err, buffer) => {
  if (err) {
    console.error('Ocorreu um erro:', err);
    process.exitCode = 1;
  }
  console.log(buffer.toString());
});

// Or, Promisified

const { promisify } = require('node:util');
const do_unzip = promisify(unzip);

do_unzip(buffer)
  .then((buf) => console.log(buf.toString()))
  .catch((err) => {
    console.error('Ocorreu um erro:', err);
    process.exitCode = 1;
  });
```
:::

## Utilização do pool de threads e considerações sobre desempenho {#threadpool-usage-and-performance-considerations}

Todas as APIs `zlib`, exceto aquelas que são explicitamente síncronas, usam o pool de threads interno do Node.js. Isso pode levar a efeitos surpreendentes e limitações de desempenho em algumas aplicações.

Criar e usar um grande número de objetos zlib simultaneamente pode causar fragmentação significativa da memória.

::: code-group
```js [ESM]
import zlib from 'node:zlib';
import { Buffer } from 'node:buffer';

const payload = Buffer.from('This is some data');

// WARNING: DO NOT DO THIS!
for (let i = 0; i < 30000; ++i) {
  zlib.deflate(payload, (err, buffer) => {});
}
```

```js [CJS]
const zlib = require('node:zlib');

const payload = Buffer.from('This is some data');

// WARNING: DO NOT DO THIS!
for (let i = 0; i < 30000; ++i) {
  zlib.deflate(payload, (err, buffer) => {});
}
```
:::

No exemplo anterior, 30.000 instâncias de deflate são criadas concorrentemente. Devido à forma como alguns sistemas operacionais lidam com alocação e desalocação de memória, isso pode levar a uma fragmentação significativa da memória.

É altamente recomendável que os resultados das operações de compressão sejam armazenados em cache para evitar a duplicação de esforços.

## Comprimindo requisições e respostas HTTP {#compressing-http-requests-and-responses}

O módulo `node:zlib` pode ser usado para implementar suporte para os mecanismos de codificação de conteúdo `gzip`, `deflate` e `br` definidos por [HTTP](https://tools.ietf.org/html/rfc7230#section-4.2).

O cabeçalho HTTP [`Accept-Encoding`](https://www.w3.org/Protocols/rfc2616/rfc2616-sec14#sec14.3) é usado dentro de uma requisição HTTP para identificar as codificações de compressão aceitas pelo cliente. O cabeçalho [`Content-Encoding`](https://www.w3.org/Protocols/rfc2616/rfc2616-sec14#sec14.11) é usado para identificar as codificações de compressão realmente aplicadas a uma mensagem.

Os exemplos fornecidos abaixo são drasticamente simplificados para mostrar o conceito básico. Usar a codificação `zlib` pode ser caro, e os resultados devem ser armazenados em cache. Veja [Ajuste do uso de memória](/pt/nodejs/api/zlib#memory-usage-tuning) para mais informações sobre as compensações de velocidade/memória/compressão envolvidas no uso de `zlib`.

::: code-group
```js [ESM]
// Exemplo de requisição do cliente
import fs from 'node:fs';
import zlib from 'node:zlib';
import http from 'node:http';
import process from 'node:process';
import { pipeline } from 'node:stream';

const request = http.get({ host: 'example.com',
                           path: '/',
                           port: 80,
                           headers: { 'Accept-Encoding': 'br,gzip,deflate' } });
request.on('response', (response) => {
  const output = fs.createWriteStream('example.com_index.html');

  const onError = (err) => {
    if (err) {
      console.error('An error occurred:', err);
      process.exitCode = 1;
    }
  };

  switch (response.headers['content-encoding']) {
    case 'br':
      pipeline(response, zlib.createBrotliDecompress(), output, onError);
      break;
    // Ou, apenas use zlib.createUnzip() para lidar com ambos os casos a seguir:
    case 'gzip':
      pipeline(response, zlib.createGunzip(), output, onError);
      break;
    case 'deflate':
      pipeline(response, zlib.createInflate(), output, onError);
      break;
    default:
      pipeline(response, output, onError);
      break;
  }
});
```

```js [CJS]
// Exemplo de requisição do cliente
const zlib = require('node:zlib');
const http = require('node:http');
const fs = require('node:fs');
const { pipeline } = require('node:stream');

const request = http.get({ host: 'example.com',
                           path: '/',
                           port: 80,
                           headers: { 'Accept-Encoding': 'br,gzip,deflate' } });
request.on('response', (response) => {
  const output = fs.createWriteStream('example.com_index.html');

  const onError = (err) => {
    if (err) {
      console.error('An error occurred:', err);
      process.exitCode = 1;
    }
  };

  switch (response.headers['content-encoding']) {
    case 'br':
      pipeline(response, zlib.createBrotliDecompress(), output, onError);
      break;
    // Ou, apenas use zlib.createUnzip() para lidar com ambos os casos a seguir:
    case 'gzip':
      pipeline(response, zlib.createGunzip(), output, onError);
      break;
    case 'deflate':
      pipeline(response, zlib.createInflate(), output, onError);
      break;
    default:
      pipeline(response, output, onError);
      break;
  }
});
```
:::

::: code-group
```js [ESM]
// exemplo de servidor
// Executar uma operação gzip em cada requisição é bastante caro.
// Seria muito mais eficiente armazenar o buffer comprimido em cache.
import zlib from 'node:zlib';
import http from 'node:http';
import fs from 'node:fs';
import { pipeline } from 'node:stream';

http.createServer((request, response) => {
  const raw = fs.createReadStream('index.html');
  // Armazene tanto uma versão comprimida quanto uma não comprimida do recurso.
  response.setHeader('Vary', 'Accept-Encoding');
  const acceptEncoding = request.headers['accept-encoding'] || '';

  const onError = (err) => {
    if (err) {
      // Se ocorrer um erro, não há muito que possamos fazer porque
      // o servidor já enviou o código de resposta 200 e
      // alguma quantidade de dados já foi enviada para o cliente.
      // O melhor que podemos fazer é encerrar a resposta imediatamente
      // e registrar o erro.
      response.end();
      console.error('An error occurred:', err);
    }
  };

  // Observação: Este não é um analisador accept-encoding compatível.
  // Veja https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.3
  if (/\bdeflate\b/.test(acceptEncoding)) {
    response.writeHead(200, { 'Content-Encoding': 'deflate' });
    pipeline(raw, zlib.createDeflate(), response, onError);
  } else if (/\bgzip\b/.test(acceptEncoding)) {
    response.writeHead(200, { 'Content-Encoding': 'gzip' });
    pipeline(raw, zlib.createGzip(), response, onError);
  } else if (/\bbr\b/.test(acceptEncoding)) {
    response.writeHead(200, { 'Content-Encoding': 'br' });
    pipeline(raw, zlib.createBrotliCompress(), response, onError);
  } else {
    response.writeHead(200, {});
    pipeline(raw, response, onError);
  }
}).listen(1337);
```

```js [CJS]
// exemplo de servidor
// Executar uma operação gzip em cada requisição é bastante caro.
// Seria muito mais eficiente armazenar o buffer comprimido em cache.
const zlib = require('node:zlib');
const http = require('node:http');
const fs = require('node:fs');
const { pipeline } = require('node:stream');

http.createServer((request, response) => {
  const raw = fs.createReadStream('index.html');
  // Armazene tanto uma versão comprimida quanto uma não comprimida do recurso.
  response.setHeader('Vary', 'Accept-Encoding');
  const acceptEncoding = request.headers['accept-encoding'] || '';

  const onError = (err) => {
    if (err) {
      // Se ocorrer um erro, não há muito que possamos fazer porque
      // o servidor já enviou o código de resposta 200 e
      // alguma quantidade de dados já foi enviada para o cliente.
      // O melhor que podemos fazer é encerrar a resposta imediatamente
      // e registrar o erro.
      response.end();
      console.error('An error occurred:', err);
    }
  };

  // Observação: Este não é um analisador accept-encoding compatível.
  // Veja https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.3
  if (/\bdeflate\b/.test(acceptEncoding)) {
    response.writeHead(200, { 'Content-Encoding': 'deflate' });
    pipeline(raw, zlib.createDeflate(), response, onError);
  } else if (/\bgzip\b/.test(acceptEncoding)) {
    response.writeHead(200, { 'Content-Encoding': 'gzip' });
    pipeline(raw, zlib.createGzip(), response, onError);
  } else if (/\bbr\b/.test(acceptEncoding)) {
    response.writeHead(200, { 'Content-Encoding': 'br' });
    pipeline(raw, zlib.createBrotliCompress(), response, onError);
  } else {
    response.writeHead(200, {});
    pipeline(raw, response, onError);
  }
}).listen(1337);
```
:::

Por padrão, os métodos `zlib` lançarão um erro ao descomprimir dados truncados. No entanto, se for sabido que os dados estão incompletos, ou se o desejo for inspecionar apenas o início de um arquivo comprimido, é possível suprimir o tratamento de erro padrão alterando o método de limpeza que é usado para descomprimir o último pedaço de dados de entrada:

```js [ESM]
// Esta é uma versão truncada do buffer dos exemplos acima
const buffer = Buffer.from('eJzT0yMA', 'base64');

zlib.unzip(
  buffer,
  // Para Brotli, o equivalente é zlib.constants.BROTLI_OPERATION_FLUSH.
  { finishFlush: zlib.constants.Z_SYNC_FLUSH },
  (err, buffer) => {
    if (err) {
      console.error('An error occurred:', err);
      process.exitCode = 1;
    }
    console.log(buffer.toString());
  });
```
Isso não mudará o comportamento em outras situações de lançamento de erro, por exemplo, quando os dados de entrada têm um formato inválido. Usando este método, não será possível determinar se a entrada terminou prematuramente ou carece de verificações de integridade, tornando necessário verificar manualmente se o resultado descompactado é válido.


## Ajuste do uso de memória {#memory-usage-tuning}

### Para fluxos baseados em zlib {#for-zlib-based-streams}

De `zlib/zconf.h`, modificado para uso no Node.js:

Os requisitos de memória para deflate são (em bytes):

```js [ESM]
(1 << (windowBits + 2)) + (1 << (memLevel + 9))
```
Ou seja: 128K para `windowBits` = 15 + 128K para `memLevel` = 8 (valores padrão) mais alguns kilobytes para objetos pequenos.

Por exemplo, para reduzir os requisitos de memória padrão de 256K para 128K, as opções devem ser definidas como:

```js [ESM]
const options = { windowBits: 14, memLevel: 7 };
```
Isso, no entanto, geralmente degrada a compressão.

Os requisitos de memória para inflate são (em bytes) `1 \<\< windowBits`. Ou seja, 32K para `windowBits` = 15 (valor padrão) mais alguns kilobytes para objetos pequenos.

Isso é adicional a um único buffer de saída interno de tamanho `chunkSize`, que por padrão é 16K.

A velocidade da compressão `zlib` é afetada mais dramaticamente pela configuração `level`. Um nível mais alto resultará em melhor compressão, mas levará mais tempo para ser concluído. Um nível mais baixo resultará em menos compressão, mas será muito mais rápido.

Em geral, opções de maior uso de memória significarão que o Node.js terá que fazer menos chamadas para `zlib` porque ele poderá processar mais dados em cada operação `write`. Portanto, este é outro fator que afeta a velocidade, ao custo do uso de memória.

### Para fluxos baseados em Brotli {#for-brotli-based-streams}

Existem equivalentes para as opções zlib para fluxos baseados em Brotli, embora essas opções tenham intervalos diferentes das opções zlib:

- A opção `level` do zlib corresponde à opção `BROTLI_PARAM_QUALITY` do Brotli.
- A opção `windowBits` do zlib corresponde à opção `BROTLI_PARAM_LGWIN` do Brotli.

Veja [abaixo](/pt/nodejs/api/zlib#brotli-constants) para mais detalhes sobre as opções específicas do Brotli.

## Flushing {#flushing}

Chamar [`.flush()`](/pt/nodejs/api/zlib#zlibflushkind-callback) em um fluxo de compressão fará com que `zlib` retorne o máximo de saída possível no momento. Isso pode ocorrer ao custo de uma qualidade de compressão degradada, mas pode ser útil quando os dados precisam estar disponíveis o mais rápido possível.

No exemplo a seguir, `flush()` é usado para escrever uma resposta HTTP parcial compactada para o cliente:

::: code-group
```js [ESM]
import zlib from 'node:zlib';
import http from 'node:http';
import { pipeline } from 'node:stream';

http.createServer((request, response) => {
  // For the sake of simplicity, the Accept-Encoding checks are omitted.
  response.writeHead(200, { 'content-encoding': 'gzip' });
  const output = zlib.createGzip();
  let i;

  pipeline(output, response, (err) => {
    if (err) {
      // If an error occurs, there's not much we can do because
      // the server has already sent the 200 response code and
      // some amount of data has already been sent to the client.
      // The best we can do is terminate the response immediately
      // and log the error.
      clearInterval(i);
      response.end();
      console.error('An error occurred:', err);
    }
  });

  i = setInterval(() => {
    output.write(`The current time is ${Date()}\n`, () => {
      // The data has been passed to zlib, but the compression algorithm may
      // have decided to buffer the data for more efficient compression.
      // Calling .flush() will make the data available as soon as the client
      // is ready to receive it.
      output.flush();
    });
  }, 1000);
}).listen(1337);
```

```js [CJS]
const zlib = require('node:zlib');
const http = require('node:http');
const { pipeline } = require('node:stream');

http.createServer((request, response) => {
  // For the sake of simplicity, the Accept-Encoding checks are omitted.
  response.writeHead(200, { 'content-encoding': 'gzip' });
  const output = zlib.createGzip();
  let i;

  pipeline(output, response, (err) => {
    if (err) {
      // If an error occurs, there's not much we can do because
      // the server has already sent the 200 response code and
      // some amount of data has already been sent to the client.
      // The best we can do is terminate the response immediately
      // and log the error.
      clearInterval(i);
      response.end();
      console.error('An error occurred:', err);
    }
  });

  i = setInterval(() => {
    output.write(`The current time is ${Date()}\n`, () => {
      // The data has been passed to zlib, but the compression algorithm may
      // have decided to buffer the data for more efficient compression.
      // Calling .flush() will make the data available as soon as the client
      // is ready to receive it.
      output.flush();
    });
  }, 1000);
}).listen(1337);
```
:::


## Constantes {#constants}

**Adicionado em: v0.5.8**

### Constantes zlib {#zlib-constants}

Todas as constantes definidas em `zlib.h` também são definidas em `require('node:zlib').constants`. No curso normal das operações, não será necessário usar essas constantes. Elas são documentadas para que sua presença não seja surpreendente. Esta seção foi extraída quase diretamente da [documentação do zlib](https://zlib.net/manual#Constants).

Anteriormente, as constantes estavam disponíveis diretamente em `require('node:zlib')`, por exemplo, `zlib.Z_NO_FLUSH`. Acessar as constantes diretamente do módulo ainda é possível atualmente, mas está obsoleto.

Valores de flush permitidos.

- `zlib.constants.Z_NO_FLUSH`
- `zlib.constants.Z_PARTIAL_FLUSH`
- `zlib.constants.Z_SYNC_FLUSH`
- `zlib.constants.Z_FULL_FLUSH`
- `zlib.constants.Z_FINISH`
- `zlib.constants.Z_BLOCK`
- `zlib.constants.Z_TREES`

Códigos de retorno para as funções de compressão/descompressão. Valores negativos são erros, valores positivos são usados para eventos especiais, mas normais.

- `zlib.constants.Z_OK`
- `zlib.constants.Z_STREAM_END`
- `zlib.constants.Z_NEED_DICT`
- `zlib.constants.Z_ERRNO`
- `zlib.constants.Z_STREAM_ERROR`
- `zlib.constants.Z_DATA_ERROR`
- `zlib.constants.Z_MEM_ERROR`
- `zlib.constants.Z_BUF_ERROR`
- `zlib.constants.Z_VERSION_ERROR`

Níveis de compressão.

- `zlib.constants.Z_NO_COMPRESSION`
- `zlib.constants.Z_BEST_SPEED`
- `zlib.constants.Z_BEST_COMPRESSION`
- `zlib.constants.Z_DEFAULT_COMPRESSION`

Estratégia de compressão.

- `zlib.constants.Z_FILTERED`
- `zlib.constants.Z_HUFFMAN_ONLY`
- `zlib.constants.Z_RLE`
- `zlib.constants.Z_FIXED`
- `zlib.constants.Z_DEFAULT_STRATEGY`

### Constantes Brotli {#brotli-constants}

**Adicionado em: v11.7.0, v10.16.0**

Existem várias opções e outras constantes disponíveis para fluxos baseados em Brotli:

#### Operações de flush {#flush-operations}

Os seguintes valores são operações de flush válidas para fluxos baseados em Brotli:

- `zlib.constants.BROTLI_OPERATION_PROCESS` (padrão para todas as operações)
- `zlib.constants.BROTLI_OPERATION_FLUSH` (padrão ao chamar `.flush()`)
- `zlib.constants.BROTLI_OPERATION_FINISH` (padrão para o último bloco)
- `zlib.constants.BROTLI_OPERATION_EMIT_METADATA`
    - Esta operação em particular pode ser difícil de usar em um contexto Node.js, pois a camada de streaming dificulta saber quais dados acabarão neste quadro. Além disso, atualmente não há como consumir esses dados por meio da API Node.js.


#### Opções do Compressor {#compressor-options}

Existem várias opções que podem ser definidas nos codificadores Brotli, afetando a eficiência e a velocidade da compressão. Tanto as chaves quanto os valores podem ser acessados como propriedades do objeto `zlib.constants`.

As opções mais importantes são:

- `BROTLI_PARAM_MODE`
    - `BROTLI_MODE_GENERIC` (padrão)
    - `BROTLI_MODE_TEXT`, ajustado para texto UTF-8
    - `BROTLI_MODE_FONT`, ajustado para fontes WOFF 2.0

 
- `BROTLI_PARAM_QUALITY`
    - Varia de `BROTLI_MIN_QUALITY` a `BROTLI_MAX_QUALITY`, com um padrão de `BROTLI_DEFAULT_QUALITY`.

 
- `BROTLI_PARAM_SIZE_HINT`
    - Valor inteiro que representa o tamanho esperado da entrada; o padrão é `0` para um tamanho de entrada desconhecido.

 

As seguintes flags podem ser definidas para controle avançado sobre o algoritmo de compressão e ajuste do uso de memória:

- `BROTLI_PARAM_LGWIN`
    - Varia de `BROTLI_MIN_WINDOW_BITS` a `BROTLI_MAX_WINDOW_BITS`, com um padrão de `BROTLI_DEFAULT_WINDOW`, ou até `BROTLI_LARGE_MAX_WINDOW_BITS` se a flag `BROTLI_PARAM_LARGE_WINDOW` estiver definida.

 
- `BROTLI_PARAM_LGBLOCK`
    - Varia de `BROTLI_MIN_INPUT_BLOCK_BITS` a `BROTLI_MAX_INPUT_BLOCK_BITS`.

 
- `BROTLI_PARAM_DISABLE_LITERAL_CONTEXT_MODELING`
    - Flag booleana que diminui a taxa de compressão em favor da velocidade de descompressão.

 
- `BROTLI_PARAM_LARGE_WINDOW`
    - Flag booleana que habilita o modo "Large Window Brotli" (não compatível com o formato Brotli padronizado em [RFC 7932](https://www.rfc-editor.org/rfc/rfc7932.txt)).

 
- `BROTLI_PARAM_NPOSTFIX`
    - Varia de `0` a `BROTLI_MAX_NPOSTFIX`.

 
- `BROTLI_PARAM_NDIRECT`
    - Varia de `0` a `15 \<\< NPOSTFIX` em passos de `1 \<\< NPOSTFIX`.

 

#### Opções do Descompressor {#decompressor-options}

Estas opções avançadas estão disponíveis para controlar a descompressão:

- `BROTLI_DECODER_PARAM_DISABLE_RING_BUFFER_REALLOCATION`
    - Flag booleana que afeta os padrões de alocação de memória interna.

 
- `BROTLI_DECODER_PARAM_LARGE_WINDOW`
    - Flag booleana que habilita o modo "Large Window Brotli" (não compatível com o formato Brotli padronizado em [RFC 7932](https://www.rfc-editor.org/rfc/rfc7932.txt)).


## Classe: `Options` {#class-options}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v14.5.0, v12.19.0 | A opção `maxOutputLength` agora é suportada. |
| v9.4.0 | A opção `dictionary` pode ser um `ArrayBuffer`. |
| v8.0.0 | A opção `dictionary` pode ser um `Uint8Array` agora. |
| v5.11.0 | A opção `finishFlush` agora é suportada. |
| v0.11.1 | Adicionado em: v0.11.1 |
:::

Cada classe baseada em zlib recebe um objeto `options`. Nenhuma opção é obrigatória.

Algumas opções são relevantes apenas ao compactar e são ignoradas pelas classes de descompressão.

- `flush` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `zlib.constants.Z_NO_FLUSH`
- `finishFlush` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `zlib.constants.Z_FINISH`
- `chunkSize` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `16 * 1024`
- `windowBits` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `level` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) (somente compactação)
- `memLevel` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) (somente compactação)
- `strategy` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) (somente compactação)
- `dictionary` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) (somente deflate/inflate, dicionário vazio por padrão)
- `info` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) (Se `true`, retorna um objeto com `buffer` e `engine`.)
- `maxOutputLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Limita o tamanho da saída ao usar [métodos de conveniência](/pt/nodejs/api/zlib#convenience-methods). **Padrão:** [`buffer.kMaxLength`](/pt/nodejs/api/buffer#bufferkmaxlength)

Consulte a documentação [`deflateInit2` e `inflateInit2`](https://zlib.net/manual#Advanced) para obter mais informações.


## Classe: `BrotliOptions` {#class-brotlioptions}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v14.5.0, v12.19.0 | A opção `maxOutputLength` agora é suportada. |
| v11.7.0 | Adicionado em: v11.7.0 |
:::

Cada classe baseada em Brotli recebe um objeto `options`. Todas as opções são opcionais.

- `flush` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `zlib.constants.BROTLI_OPERATION_PROCESS`
- `finishFlush` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `zlib.constants.BROTLI_OPERATION_FINISH`
- `chunkSize` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `16 * 1024`
- `params` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Objeto chave-valor contendo [parâmetros Brotli](/pt/nodejs/api/zlib#brotli-constants) indexados.
- `maxOutputLength` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Limita o tamanho da saída ao usar [métodos de conveniência](/pt/nodejs/api/zlib#convenience-methods). **Padrão:** [`buffer.kMaxLength`](/pt/nodejs/api/buffer#bufferkmaxlength)

Por exemplo:

```js [ESM]
const stream = zlib.createBrotliCompress({
  chunkSize: 32 * 1024,
  params: {
    [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
    [zlib.constants.BROTLI_PARAM_QUALITY]: 4,
    [zlib.constants.BROTLI_PARAM_SIZE_HINT]: fs.statSync(inputFile).size,
  },
});
```
## Classe: `zlib.BrotliCompress` {#class-zlibbrotlicompress}

**Adicionado em: v11.7.0, v10.16.0**

Comprime dados usando o algoritmo Brotli.

## Classe: `zlib.BrotliDecompress` {#class-zlibbrotlidecompress}

**Adicionado em: v11.7.0, v10.16.0**

Descomprime dados usando o algoritmo Brotli.

## Classe: `zlib.Deflate` {#class-zlibdeflate}

**Adicionado em: v0.5.8**

Comprime dados usando deflate.

## Classe: `zlib.DeflateRaw` {#class-zlibdeflateraw}

**Adicionado em: v0.5.8**

Comprime dados usando deflate e não anexe um cabeçalho `zlib`.

## Classe: `zlib.Gunzip` {#class-zlibgunzip}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v6.0.0 | Lixo no final do fluxo de entrada agora resultará em um evento `'error'`. |
| v5.9.0 | Vários membros de arquivo gzip concatenados agora são suportados. |
| v5.0.0 | Um fluxo de entrada truncado agora resultará em um evento `'error'`. |
| v0.5.8 | Adicionado em: v0.5.8 |
:::

Descomprime um fluxo gzip.


## Classe: `zlib.Gzip` {#class-zlibgzip}

**Adicionado em: v0.5.8**

Comprime dados usando gzip.

## Classe: `zlib.Inflate` {#class-zlibinflate}

::: info [Histórico]
| Versão | Mudanças |
|---|---|
| v5.0.0 | Um fluxo de entrada truncado agora resultará em um evento `'error'`. |
| v0.5.8 | Adicionado em: v0.5.8 |
:::

Descomprime um fluxo deflate.

## Classe: `zlib.InflateRaw` {#class-zlibinflateraw}

::: info [Histórico]
| Versão | Mudanças |
|---|---|
| v6.8.0 | Dicionários personalizados agora são suportados por `InflateRaw`. |
| v5.0.0 | Um fluxo de entrada truncado agora resultará em um evento `'error'`. |
| v0.5.8 | Adicionado em: v0.5.8 |
:::

Descomprime um fluxo deflate bruto.

## Classe: `zlib.Unzip` {#class-zlibunzip}

**Adicionado em: v0.5.8**

Descomprime um fluxo compactado com Gzip ou Deflate, detectando automaticamente o cabeçalho.

## Classe: `zlib.ZlibBase` {#class-zlibzlibbase}

::: info [Histórico]
| Versão | Mudanças |
|---|---|
| v11.7.0, v10.16.0 | Esta classe foi renomeada de `Zlib` para `ZlibBase`. |
| v0.5.8 | Adicionado em: v0.5.8 |
:::

Não é exportado pelo módulo `node:zlib`. Está documentado aqui porque é a classe base das classes compressor/descompressor.

Esta classe herda de [`stream.Transform`](/pt/nodejs/api/stream#class-streamtransform), permitindo que objetos `node:zlib` sejam usados em pipes e operações de stream semelhantes.

### `zlib.bytesWritten` {#zlibbyteswritten}

**Adicionado em: v10.0.0**

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

A propriedade `zlib.bytesWritten` especifica o número de bytes gravados no mecanismo, antes que os bytes sejam processados (compactados ou descompactados, conforme apropriado para a classe derivada).

### `zlib.crc32(data[, value])` {#zlibcrc32data-value}

**Adicionado em: v22.2.0, v20.15.0**

- `data` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Quando `data` é uma string, ela será codificada como UTF-8 antes de ser usada para computação.
- `value` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Um valor inicial opcional. Deve ser um inteiro não assinado de 32 bits. **Padrão:** `0`
- Retorna: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Um inteiro não assinado de 32 bits contendo o checksum.

Calcula um checksum de [Verificação de Redundância Cíclica](https://en.wikipedia.org/wiki/Cyclic_redundancy_check) de 32 bits de `data`. Se `value` for especificado, ele será usado como o valor inicial do checksum, caso contrário, 0 será usado como o valor inicial.

O algoritmo CRC é projetado para calcular checksums e detectar erros na transmissão de dados. Não é adequado para autenticação criptográfica.

Para ser consistente com outras APIs, se os `data` forem uma string, eles serão codificados com UTF-8 antes de serem usados para computação. Se os usuários usarem apenas o Node.js para calcular e corresponder aos checksums, isso funcionará bem com outras APIs que usam a codificação UTF-8 por padrão.

Algumas bibliotecas JavaScript de terceiros calculam o checksum em uma string com base em `str.charCodeAt()` para que possa ser executado em navegadores. Se os usuários quiserem corresponder ao checksum calculado com este tipo de biblioteca no navegador, é melhor usar a mesma biblioteca no Node.js se também for executado no Node.js. Se os usuários tiverem que usar `zlib.crc32()` para corresponder ao checksum produzido por tal biblioteca de terceiros:

::: code-group
```js [ESM]
import zlib from 'node:zlib';
import { Buffer } from 'node:buffer';

let crc = zlib.crc32('hello');  // 907060870
crc = zlib.crc32('world', crc);  // 4192936109

crc = zlib.crc32(Buffer.from('hello', 'utf16le'));  // 1427272415
crc = zlib.crc32(Buffer.from('world', 'utf16le'), crc);  // 4150509955
```

```js [CJS]
const zlib = require('node:zlib');
const { Buffer } = require('node:buffer');

let crc = zlib.crc32('hello');  // 907060870
crc = zlib.crc32('world', crc);  // 4192936109

crc = zlib.crc32(Buffer.from('hello', 'utf16le'));  // 1427272415
crc = zlib.crc32(Buffer.from('world', 'utf16le'), crc);  // 4150509955
```
:::


### `zlib.close([callback])` {#zlibclosecallback}

**Adicionado em: v0.9.4**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Fecha o manipulador subjacente.

### `zlib.flush([kind, ]callback)` {#zlibflushkind-callback}

**Adicionado em: v0.5.8**

- `kind` **Padrão:** `zlib.constants.Z_FULL_FLUSH` para streams baseados em zlib, `zlib.constants.BROTLI_OPERATION_FLUSH` para streams baseados em Brotli.
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Descarrega dados pendentes. Não chame isso de forma leviana, descarregamentos prematuros impactam negativamente a eficácia do algoritmo de compressão.

Chamar isso apenas descarrega dados do estado `zlib` interno e não realiza nenhum tipo de descarregamento no nível dos streams. Em vez disso, ele se comporta como uma chamada normal para `.write()`, ou seja, será enfileirado atrás de outras escritas pendentes e só produzirá saída quando os dados estiverem sendo lidos do stream.

### `zlib.params(level, strategy, callback)` {#zlibparamslevel-strategy-callback}

**Adicionado em: v0.11.4**

- `level` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `strategy` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Esta função está disponível apenas para streams baseados em zlib, ou seja, não Brotli.

Atualiza dinamicamente o nível de compressão e a estratégia de compressão. Aplicável apenas ao algoritmo deflate.

### `zlib.reset()` {#zlibreset}

**Adicionado em: v0.7.0**

Redefine o compressor/descompressor para os padrões de fábrica. Aplicável apenas aos algoritmos inflate e deflate.

## `zlib.constants` {#zlibconstants}

**Adicionado em: v7.0.0**

Fornece um objeto enumerando constantes relacionadas ao Zlib.

## `zlib.createBrotliCompress([options])` {#zlibcreatebrotlicompressoptions}

**Adicionado em: v11.7.0, v10.16.0**

- `options` [\<brotli options\>](/pt/nodejs/api/zlib#class-brotlioptions)

Cria e retorna um novo objeto [`BrotliCompress`](/pt/nodejs/api/zlib#class-zlibbrotlicompress).


## `zlib.createBrotliDecompress([options])` {#zlibcreatebrotlidecompressoptions}

**Adicionado em: v11.7.0, v10.16.0**

- `options` [\<brotli options\>](/pt/nodejs/api/zlib#class-brotlioptions)

Cria e retorna um novo objeto [`BrotliDecompress`](/pt/nodejs/api/zlib#class-zlibbrotlidecompress).

## `zlib.createDeflate([options])` {#zlibcreatedeflateoptions}

**Adicionado em: v0.5.8**

- `options` [\<zlib options\>](/pt/nodejs/api/zlib#class-options)

Cria e retorna um novo objeto [`Deflate`](/pt/nodejs/api/zlib#class-zlibdeflate).

## `zlib.createDeflateRaw([options])` {#zlibcreatedeflaterawoptions}

**Adicionado em: v0.5.8**

- `options` [\<zlib options\>](/pt/nodejs/api/zlib#class-options)

Cria e retorna um novo objeto [`DeflateRaw`](/pt/nodejs/api/zlib#class-zlibdeflateraw).

Uma atualização do zlib de 1.2.8 para 1.2.11 mudou o comportamento quando `windowBits` é definido como 8 para fluxos deflate brutos. O zlib definia automaticamente `windowBits` para 9 se fosse inicialmente definido para 8. As versões mais recentes do zlib lançarão uma exceção, então o Node.js restaurou o comportamento original de atualizar um valor de 8 para 9, já que passar `windowBits = 9` para o zlib realmente resulta em um fluxo compactado que efetivamente usa apenas uma janela de 8 bits.

## `zlib.createGunzip([options])` {#zlibcreategunzipoptions}

**Adicionado em: v0.5.8**

- `options` [\<zlib options\>](/pt/nodejs/api/zlib#class-options)

Cria e retorna um novo objeto [`Gunzip`](/pt/nodejs/api/zlib#class-zlibgunzip).

## `zlib.createGzip([options])` {#zlibcreategzipoptions}

**Adicionado em: v0.5.8**

- `options` [\<zlib options\>](/pt/nodejs/api/zlib#class-options)

Cria e retorna um novo objeto [`Gzip`](/pt/nodejs/api/zlib#class-zlibgzip). Veja [exemplo](/pt/nodejs/api/zlib#zlib).

## `zlib.createInflate([options])` {#zlibcreateinflateoptions}

**Adicionado em: v0.5.8**

- `options` [\<zlib options\>](/pt/nodejs/api/zlib#class-options)

Cria e retorna um novo objeto [`Inflate`](/pt/nodejs/api/zlib#class-zlibinflate).

## `zlib.createInflateRaw([options])` {#zlibcreateinflaterawoptions}

**Adicionado em: v0.5.8**

- `options` [\<zlib options\>](/pt/nodejs/api/zlib#class-options)

Cria e retorna um novo objeto [`InflateRaw`](/pt/nodejs/api/zlib#class-zlibinflateraw).

## `zlib.createUnzip([options])` {#zlibcreateunzipoptions}

**Adicionado em: v0.5.8**

- `options` [\<zlib options\>](/pt/nodejs/api/zlib#class-options)

Cria e retorna um novo objeto [`Unzip`](/pt/nodejs/api/zlib#class-zlibunzip).


## Métodos de conveniência {#convenience-methods}

Todos estes recebem um [`Buffer`](/pt/nodejs/api/buffer#class-buffer), [`TypedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), [`DataView`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView), [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) ou string como primeiro argumento, um segundo argumento opcional para fornecer opções às classes `zlib` e chamarão o callback fornecido com `callback(error, result)`.

Cada método tem uma contraparte `*Sync`, que aceita os mesmos argumentos, mas sem um callback.

### `zlib.brotliCompress(buffer[, options], callback)` {#zlibbrotlicompressbuffer-options-callback}

**Adicionado em: v11.7.0, v10.16.0**

- `buffer` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<brotli options\>](/pt/nodejs/api/zlib#class-brotlioptions)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

### `zlib.brotliCompressSync(buffer[, options])` {#zlibbrotlicompresssyncbuffer-options}

**Adicionado em: v11.7.0, v10.16.0**

- `buffer` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<brotli options\>](/pt/nodejs/api/zlib#class-brotlioptions)

Comprime um pedaço de dados com [`BrotliCompress`](/pt/nodejs/api/zlib#class-zlibbrotlicompress).


### `zlib.brotliDecompress(buffer[, options], callback)` {#zlibbrotlidecompressbuffer-options-callback}

**Adicionado em: v11.7.0, v10.16.0**

- `buffer` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<brotli options\>](/pt/nodejs/api/zlib#class-brotlioptions)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

### `zlib.brotliDecompressSync(buffer[, options])` {#zlibbrotlidecompresssyncbuffer-options}

**Adicionado em: v11.7.0, v10.16.0**

- `buffer` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<brotli options\>](/pt/nodejs/api/zlib#class-brotlioptions)

Descompacta um pedaço de dados com [`BrotliDecompress`](/pt/nodejs/api/zlib#class-zlibbrotlidecompress).

### `zlib.deflate(buffer[, options], callback)` {#zlibdeflatebuffer-options-callback}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v9.4.0 | O parâmetro `buffer` pode ser um `ArrayBuffer`. |
| v8.0.0 | O parâmetro `buffer` pode ser qualquer `TypedArray` ou `DataView`. |
| v8.0.0 | O parâmetro `buffer` agora pode ser um `Uint8Array`. |
| v0.6.0 | Adicionado em: v0.6.0 |
:::

- `buffer` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib options\>](/pt/nodejs/api/zlib#class-options)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)


### `zlib.deflateSync(buffer[, options])` {#zlibdeflatesyncbuffer-options}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v9.4.0 | O parâmetro `buffer` pode ser um `ArrayBuffer`. |
| v8.0.0 | O parâmetro `buffer` pode ser qualquer `TypedArray` ou `DataView`. |
| v8.0.0 | O parâmetro `buffer` agora pode ser um `Uint8Array`. |
| v0.11.12 | Adicionado em: v0.11.12 |
:::

- `buffer` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<opções zlib\>](/pt/nodejs/api/zlib#class-options)

Comprime um bloco de dados com [`Deflate`](/pt/nodejs/api/zlib#class-zlibdeflate).

### `zlib.deflateRaw(buffer[, options], callback)` {#zlibdeflaterawbuffer-options-callback}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v8.0.0 | O parâmetro `buffer` pode ser qualquer `TypedArray` ou `DataView`. |
| v8.0.0 | O parâmetro `buffer` agora pode ser um `Uint8Array`. |
| v0.6.0 | Adicionado em: v0.6.0 |
:::

- `buffer` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<opções zlib\>](/pt/nodejs/api/zlib#class-options)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

### `zlib.deflateRawSync(buffer[, options])` {#zlibdeflaterawsyncbuffer-options}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v9.4.0 | O parâmetro `buffer` pode ser um `ArrayBuffer`. |
| v8.0.0 | O parâmetro `buffer` pode ser qualquer `TypedArray` ou `DataView`. |
| v8.0.0 | O parâmetro `buffer` agora pode ser um `Uint8Array`. |
| v0.11.12 | Adicionado em: v0.11.12 |
:::

- `buffer` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<opções zlib\>](/pt/nodejs/api/zlib#class-options)

Comprime um bloco de dados com [`DeflateRaw`](/pt/nodejs/api/zlib#class-zlibdeflateraw).


### `zlib.gunzip(buffer[, options], callback)` {#zlibgunzipbuffer-options-callback}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v9.4.0 | O parâmetro `buffer` pode ser um `ArrayBuffer`. |
| v8.0.0 | O parâmetro `buffer` pode ser qualquer `TypedArray` ou `DataView`. |
| v8.0.0 | O parâmetro `buffer` agora pode ser um `Uint8Array`. |
| v0.6.0 | Adicionado em: v0.6.0 |
:::

- `buffer` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib options\>](/pt/nodejs/api/zlib#class-options)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

### `zlib.gunzipSync(buffer[, options])` {#zlibgunzipsyncbuffer-options}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v9.4.0 | O parâmetro `buffer` pode ser um `ArrayBuffer`. |
| v8.0.0 | O parâmetro `buffer` pode ser qualquer `TypedArray` ou `DataView`. |
| v8.0.0 | O parâmetro `buffer` agora pode ser um `Uint8Array`. |
| v0.11.12 | Adicionado em: v0.11.12 |
:::

- `buffer` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib options\>](/pt/nodejs/api/zlib#class-options)

Descompacte um bloco de dados com [`Gunzip`](/pt/nodejs/api/zlib#class-zlibgunzip).

### `zlib.gzip(buffer[, options], callback)` {#zlibgzipbuffer-options-callback}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v9.4.0 | O parâmetro `buffer` pode ser um `ArrayBuffer`. |
| v8.0.0 | O parâmetro `buffer` pode ser qualquer `TypedArray` ou `DataView`. |
| v8.0.0 | O parâmetro `buffer` agora pode ser um `Uint8Array`. |
| v0.6.0 | Adicionado em: v0.6.0 |
:::

- `buffer` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib options\>](/pt/nodejs/api/zlib#class-options)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)


### `zlib.gzipSync(buffer[, options])` {#zlibgzipsyncbuffer-options}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v9.4.0 | O parâmetro `buffer` pode ser um `ArrayBuffer`. |
| v8.0.0 | O parâmetro `buffer` pode ser qualquer `TypedArray` ou `DataView`. |
| v8.0.0 | O parâmetro `buffer` agora pode ser um `Uint8Array`. |
| v0.11.12 | Adicionado em: v0.11.12 |
:::

- `buffer` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib options\>](/pt/nodejs/api/zlib#class-options)

Comprime um pedaço de dados com [`Gzip`](/pt/nodejs/api/zlib#class-zlibgzip).

### `zlib.inflate(buffer[, options], callback)` {#zlibinflatebuffer-options-callback}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v9.4.0 | O parâmetro `buffer` pode ser um `ArrayBuffer`. |
| v8.0.0 | O parâmetro `buffer` pode ser qualquer `TypedArray` ou `DataView`. |
| v8.0.0 | O parâmetro `buffer` agora pode ser um `Uint8Array`. |
| v0.6.0 | Adicionado em: v0.6.0 |
:::

- `buffer` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib options\>](/pt/nodejs/api/zlib#class-options)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

### `zlib.inflateSync(buffer[, options])` {#zlibinflatesyncbuffer-options}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v9.4.0 | O parâmetro `buffer` pode ser um `ArrayBuffer`. |
| v8.0.0 | O parâmetro `buffer` pode ser qualquer `TypedArray` ou `DataView`. |
| v8.0.0 | O parâmetro `buffer` agora pode ser um `Uint8Array`. |
| v0.11.12 | Adicionado em: v0.11.12 |
:::

- `buffer` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<zlib options\>](/pt/nodejs/api/zlib#class-options)

Descomprime um pedaço de dados com [`Inflate`](/pt/nodejs/api/zlib#class-zlibinflate).


### `zlib.inflateRaw(buffer[, options], callback)` {#zlibinflaterawbuffer-options-callback}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v9.4.0 | O parâmetro `buffer` pode ser um `ArrayBuffer`. |
| v8.0.0 | O parâmetro `buffer` pode ser qualquer `TypedArray` ou `DataView`. |
| v8.0.0 | O parâmetro `buffer` agora pode ser um `Uint8Array`. |
| v0.6.0 | Adicionado em: v0.6.0 |
:::

- `buffer` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<opções zlib\>](/pt/nodejs/api/zlib#class-options)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

### `zlib.inflateRawSync(buffer[, options])` {#zlibinflaterawsyncbuffer-options}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v9.4.0 | O parâmetro `buffer` pode ser um `ArrayBuffer`. |
| v8.0.0 | O parâmetro `buffer` pode ser qualquer `TypedArray` ou `DataView`. |
| v8.0.0 | O parâmetro `buffer` agora pode ser um `Uint8Array`. |
| v0.11.12 | Adicionado em: v0.11.12 |
:::

- `buffer` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<opções zlib\>](/pt/nodejs/api/zlib#class-options)

Descompacta um bloco de dados com [`InflateRaw`](/pt/nodejs/api/zlib#class-zlibinflateraw).

### `zlib.unzip(buffer[, options], callback)` {#zlibunzipbuffer-options-callback}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v9.4.0 | O parâmetro `buffer` pode ser um `ArrayBuffer`. |
| v8.0.0 | O parâmetro `buffer` pode ser qualquer `TypedArray` ou `DataView`. |
| v8.0.0 | O parâmetro `buffer` agora pode ser um `Uint8Array`. |
| v0.6.0 | Adicionado em: v0.6.0 |
:::

- `buffer` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<opções zlib\>](/pt/nodejs/api/zlib#class-options)
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)


### `zlib.unzipSync(buffer[, options])` {#zlibunzipsyncbuffer-options}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v9.4.0 | O parâmetro `buffer` pode ser um `ArrayBuffer`. |
| v8.0.0 | O parâmetro `buffer` pode ser qualquer `TypedArray` ou `DataView`. |
| v8.0.0 | O parâmetro `buffer` agora pode ser um `Uint8Array`. |
| v0.11.12 | Adicionado em: v0.11.12 |
:::

- `buffer` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<ArrayBuffer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<opções zlib\>](/pt/nodejs/api/zlib#class-options)

Descompacta um bloco de dados com [`Unzip`](/pt/nodejs/api/zlib#class-zlibunzip).

