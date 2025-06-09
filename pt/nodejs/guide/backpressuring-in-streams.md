---
title: Entendendo a pressão de retrocesso em fluxos do Node.js
description: Aprenda a implementar fluxos Readable e Writable personalizados no Node.js enquanto respeita a pressão de retrocesso para garantir um fluxo de dados eficiente e evitar armadilhas comuns.
head:
  - - meta
    - name: og:title
      content: Entendendo a pressão de retrocesso em fluxos do Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Aprenda a implementar fluxos Readable e Writable personalizados no Node.js enquanto respeita a pressão de retrocesso para garantir um fluxo de dados eficiente e evitar armadilhas comuns.
  - - meta
    - name: twitter:title
      content: Entendendo a pressão de retrocesso em fluxos do Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Aprenda a implementar fluxos Readable e Writable personalizados no Node.js enquanto respeita a pressão de retrocesso para garantir um fluxo de dados eficiente e evitar armadilhas comuns.
---


# Backpressure em Streams

Existe um problema geral que ocorre durante o manuseio de dados chamado backpressure e descreve um acúmulo de dados atrás de um buffer durante a transferência de dados. Quando a extremidade receptora da transferência tem operações complexas ou é mais lenta por qualquer motivo, há uma tendência de os dados da fonte de entrada se acumularem, como um entupimento.

Para resolver este problema, deve haver um sistema de delegação em vigor para garantir um fluxo suave de dados de uma fonte para outra. Diferentes comunidades resolveram este problema de forma única para seus programas, os pipes Unix e os sockets TCP são bons exemplos disso e são frequentemente referidos como controle de fluxo. Em Node.js, os streams têm sido a solução adotada.

O objetivo deste guia é detalhar melhor o que é o backpressure e como exatamente os streams o abordam no código-fonte do Node.js. A segunda parte do guia apresentará as melhores práticas sugeridas para garantir que o código do seu aplicativo seja seguro e otimizado ao implementar streams.

Assumimos um pouco de familiaridade com a definição geral de `backpressure`, `Buffer` e `EventEmitters` em Node.js, bem como alguma experiência com `Stream`. Se você não leu esses documentos, não é uma má ideia dar uma olhada na [documentação da API](/pt/nodejs/api/stream) primeiro, pois isso ajudará a expandir sua compreensão ao ler este guia.

## O Problema com o Manuseio de Dados

Em um sistema de computador, os dados são transferidos de um processo para outro por meio de pipes, sockets e sinais. Em Node.js, encontramos um mecanismo semelhante chamado `Stream`. Streams são ótimos! Eles fazem muito pelo Node.js e quase todas as partes do código interno utilizam esse módulo. Como desenvolvedor, você é mais do que incentivado a usá-los também!

```javascript
const readline = require('node:readline');

const rl = readline.createInterface({
    output: process.stdout,
    input: process.stdin,
});

rl.question('Por que você deveria usar streams? ', answer => {
    console.log(`Talvez seja ${answer}, talvez seja porque eles são incríveis!`);
});

rl.close();
```

Um bom exemplo de por que o mecanismo de backpressure implementado por meio de streams é uma ótima otimização pode ser demonstrado comparando as ferramentas internas do sistema da implementação de Stream do Node.js.

Em um cenário, pegaremos um arquivo grande (aproximadamente -9 GB) e o compactaremos usando a ferramenta familiar `zip(1)`.

```bash
zip The.Matrix.1080p.mkv
```

Embora isso leve alguns minutos para ser concluído, em outro shell podemos executar um script que usa o módulo `zlib` do Node.js, que envolve outra ferramenta de compactação, `gzip(1)`.

```javascript
const gzip = require('node:zlib').createGzip();
const fs = require('node:fs');

const inp = fs.createReadStream('The.Matrix.1080p.mkv');
const out = fs.createWriteStream('The.Matrix.1080p.mkv.gz');

inp.pipe(gzip).pipe(out);
```

Para testar os resultados, tente abrir cada arquivo compactado. O arquivo compactado pela ferramenta `zip(1)` irá notificá-lo de que o arquivo está corrompido, enquanto a compactação finalizada pelo Stream será descompactada sem erros.

::: tip Nota
Neste exemplo, usamos `.pipe()` para obter a fonte de dados de uma extremidade para a outra. No entanto, observe que não há manipuladores de erro adequados anexados. Se um pedaço de dados não for recebido adequadamente, a fonte Readable ou o stream `gzip` não serão destruídos. `pump` é uma ferramenta de utilitário que destruiria adequadamente todos os streams em um pipeline se um deles falhar ou fechar, e é essencial neste caso!
:::

`pump` é necessário apenas para Node.js 8.x ou anterior, pois para Node.js 10.x ou versão posterior, `pipeline` é introduzido para substituir `pump`. Este é um método de módulo para canalizar entre streams, encaminhando erros e limpando adequadamente e fornecendo um retorno de chamada quando o pipeline é concluído.

Aqui está um exemplo de como usar pipeline:

```javascript
const { pipeline } = require('node:stream');
const fs = require('node:fs');
const zlib = require('node:zlib');
// Use the pipeline API to easily pipe a series of streams
// together and get notified when the pipeline is fully done.
// A pipeline to gzip a potentially huge video file efficiently:
pipeline(
  fs.createReadStream('The.Matrix.1080p.mkv'),
  zlib.createGzip(),
  fs.createWriteStream('The.Matrix.1080p.mkv.gz'),
  err => {
    if (err) {
      console.error('Pipeline falhou', err);
    } else {
      console.log('Pipeline foi bem-sucedido');
    }
  }
);
```

Você também pode usar o módulo `stream/promises` para usar pipeline com `async / await`:

```javascript
const { pipeline } = require('node:stream/promises');
const fs = require('node:fs');
const zlib = require('node:zlib');
async function run() {
  try {
    await pipeline(
      fs.createReadStream('The.Matrix.1080p.mkv'),
      zlib.createGzip(),
      fs.createWriteStream('The.Matrix.1080p.mkv.gz')
    );
    console.log('Pipeline foi bem-sucedido');
  } catch (err) {
    console.error('Pipeline falhou', err);
  }
}
```


## Dados Demais, Muito Rapidamente

Há instâncias em que um fluxo `Readable` pode fornecer dados para o `Writable` muito rapidamente - muito mais do que o consumidor pode lidar!

Quando isso ocorre, o consumidor começará a enfileirar todos os blocos de dados para consumo posterior. A fila de escrita ficará cada vez maior e, por causa disso, mais dados devem ser mantidos na memória até que todo o processo seja concluído.

Escrever em um disco é muito mais lento do que ler de um disco, portanto, quando estamos tentando compactar um arquivo e gravá-lo em nosso disco rígido, ocorrerá contrapressão porque o disco de escrita não será capaz de acompanhar a velocidade da leitura.

```javascript
// Secretamente, o fluxo está dizendo: "opa, opa! Espere um pouco, isso é demais!"
// Os dados começarão a se acumular no lado de leitura do buffer de dados enquanto
// write tenta acompanhar o fluxo de dados de entrada.
inp.pipe(gzip).pipe(outputFile);
```

É por isso que um mecanismo de contrapressão é importante. Se um sistema de contrapressão não estivesse presente, o processo consumiria a memória do seu sistema, efetivamente diminuindo a velocidade de outros processos e monopolizando uma grande parte do seu sistema até a conclusão.

Isso resulta em algumas coisas:
- Diminuição da velocidade de todos os outros processos atuais
- Um coletor de lixo muito sobrecarregado
- Esgotamento da memória

Nos exemplos a seguir, removeremos o valor de retorno da função `.write()` e o alteraremos para `true`, o que efetivamente desativa o suporte à contrapressão no núcleo do Node.js. Em qualquer referência ao binário `'modified'`, estamos falando de executar o binário do node sem a linha `return ret;` e, em vez disso, com o `return true;` substituído.

## Excesso de Arraste na Coleta de Lixo

Vamos dar uma olhada em um benchmark rápido. Usando o mesmo exemplo acima, executamos alguns testes de tempo para obter um tempo médio para ambos os binários.

```bash
   trial (#)  | `node` binary (ms) | modified `node` binary (ms)
=================================================================
      1       |      56924         |           55011
      2       |      52686         |           55869
      3       |      59479         |           54043
      4       |      54473         |           55229
      5       |      52933         |           59723
=================================================================
average time: |      55299         |           55975
```

Ambos levam cerca de um minuto para serem executados, então não há muita diferença, mas vamos dar uma olhada mais de perto para confirmar se nossas suspeitas estão corretas. Usamos a ferramenta Linux `dtrace` para avaliar o que está acontecendo com o coletor de lixo V8.

O tempo medido do GC (coletor de lixo) indica os intervalos de um ciclo completo de uma única varredura feita pelo coletor de lixo:

```bash
approx. time (ms) | GC (ms) | modified GC (ms)
=================================================
          0       |    0    |      0
          1       |    0    |      0
         40       |    0    |      2
        170       |    3    |      1
        300       |    3    |      1
         *             *           *
         *             *           *
         *             *           *
      39000       |    6    |     26
      42000       |    6    |     21
      47000       |    5    |     32
      50000       |    8    |     28
      54000       |    6    |     35
```

Embora os dois processos comecem da mesma forma e pareçam trabalhar o GC na mesma taxa, torna-se evidente que, após alguns segundos com um sistema de contrapressão funcionando corretamente, ele espalha a carga do GC em intervalos consistentes de 4 a 8 milissegundos até o final da transferência de dados.

No entanto, quando um sistema de contrapressão não está em vigor, a coleta de lixo V8 começa a se arrastar. O binário normal chamou o GC aproximadamente 75 vezes em um minuto, enquanto o binário modificado é acionado apenas 36 vezes.

Esta é a dívida lenta e gradual que se acumula devido ao aumento do uso de memória. À medida que os dados são transferidos, sem um sistema de contrapressão em vigor, mais memória está sendo usada para cada transferência de bloco.

Quanto mais memória está sendo alocada, mais o GC precisa cuidar em uma varredura. Quanto maior a varredura, mais o GC precisa decidir o que pode ser liberado, e a busca por ponteiros desanexados em um espaço de memória maior consumirá mais poder de computação.


## Esgotamento de Memória

Para determinar o consumo de memória de cada binário, cronometramos cada processo individualmente com `/usr/bin/time -lp sudo ./node ./backpressure-example/zlib.js`.

Esta é a saída no binário normal:

```bash
Respeitando o valor de retorno de .write()
=============================================
real        58.88
user        56.79
sys          8.79
  87810048  tamanho máximo do conjunto residente
         0  tamanho médio da memória compartilhada
         0  tamanho médio dos dados não compartilhados
         0  tamanho médio da pilha não compartilhada
     19427  recuperações de página
      3134  faltas de página
         0  trocas
         5  operações de entrada de bloco
       194  operações de saída de bloco
         0  mensagens enviadas
         0  mensagens recebidas
         1  sinais recebidos
        12  trocas de contexto voluntárias
    666037  trocas de contexto involuntárias
```

O tamanho máximo em bytes ocupado pela memória virtual acaba sendo de aproximadamente 87,81 mb.

E agora, alterando o valor de retorno da função `.write()`, obtemos:

```bash
Sem respeitar o valor de retorno de .write():
==================================================
real        54.48
user        53.15
sys          7.43
1524965376  tamanho máximo do conjunto residente
         0  tamanho médio da memória compartilhada
         0  tamanho médio dos dados não compartilhados
         0  tamanho médio da pilha não compartilhada
    373617  recuperações de página
      3139  faltas de página
         0  trocas
        18  operações de entrada de bloco
       199  operações de saída de bloco
         0  mensagens enviadas
         0  mensagens recebidas
         1  sinais recebidos
        25  trocas de contexto voluntárias
    629566  trocas de contexto involuntárias
```

O tamanho máximo em bytes ocupado pela memória virtual acaba sendo de aproximadamente 1,52 gb.

Sem streams no local para delegar a contrapressão, há uma ordem de magnitude maior de espaço de memória sendo alocado - uma enorme margem de diferença entre o mesmo processo!

Este experimento mostra o quão otimizado e econômico é o mecanismo de contrapressão do Node.js para o seu sistema de computação. Agora, vamos fazer uma análise de como ele funciona!


## Como o Backpressure Resolve Esses Problemas?

Existem diferentes funções para transferir dados de um processo para outro. No Node.js, existe uma função interna chamada `.pipe()`. Existem outros pacotes que você também pode usar! No entanto, no nível básico desse processo, temos dois componentes separados: a fonte dos dados e o consumidor.

Quando `.pipe()` é chamado da fonte, ele sinaliza ao consumidor que há dados a serem transferidos. A função pipe ajuda a configurar os closures de backpressure apropriados para os gatilhos de evento.

No Node.js, a fonte é um stream `Readable` e o consumidor é o stream `Writable` (ambos podem ser trocados por um stream Duplex ou Transform, mas isso está fora do escopo deste guia).

O momento em que o backpressure é acionado pode ser definido exatamente como o valor de retorno da função `.write()` de um `Writable`. Este valor de retorno é determinado por algumas condições, é claro.

Em qualquer cenário em que o buffer de dados excedeu o `highwaterMark` ou a fila de escrita está atualmente ocupada, `.write()` `retornará falso`.

Quando um valor `false` é retornado, o sistema de backpressure entra em ação. Ele pausará o stream `Readable` de entrada de enviar quaisquer dados e esperará até que o consumidor esteja pronto novamente. Assim que o buffer de dados for esvaziado, um evento `'drain'` será emitido e retomará o fluxo de dados de entrada.

Assim que a fila terminar, o backpressure permitirá que os dados sejam enviados novamente. O espaço na memória que estava sendo usado se liberará e se preparará para o próximo lote de dados.

Isso efetivamente permite que uma quantidade fixa de memória seja usada a qualquer momento para uma função `.pipe()`. Não haverá vazamento de memória, nem bufferização infinita, e o coletor de lixo só terá que lidar com uma área na memória!

Então, se o backpressure é tão importante, por que você (provavelmente) não ouviu falar dele? Bem, a resposta é simples: o Node.js faz tudo isso automaticamente para você.

Isso é ótimo! Mas também não é tão bom quando estamos tentando entender como implementar nossos streams personalizados.

::: info NOTE
Na maioria das máquinas, existe um tamanho de byte que determina quando um buffer está cheio (o que varia entre as diferentes máquinas). O Node.js permite que você defina seu `highWaterMark` personalizado, mas comumente, o padrão é definido para 16kb (16384 ou 16 para streams objectMode). Em casos em que você deseja aumentar esse valor, vá em frente, mas faça-o com cautela!
:::


## Ciclo de vida de `.pipe()`

Para obter uma melhor compreensão do backpressure, aqui está um fluxograma sobre o ciclo de vida de um stream `Readable` sendo [conectado](/pt/nodejs/api/stream) a um stream `Writable`:

```bash
                                                     +===================+
                         x-->  Funções de conexão  +-->   src.pipe(dest)  |
                         x     são configuradas      |===================|
                         x     durante o método     |  Callbacks de Eventos |
  +===============+      x     .pipe.                 |-------------------|
  |   Seus Dados  |      x                           | .on('close', cb)  |
  +=======+=======+      x     Elas existem fora     | .on('data', cb)   |
          |              x     do fluxo de dados,    | .on('drain', cb)  |
          |              x     mas importantemente    | .on('unpipe', cb) |
+---------v---------+    x     anexam eventos e seus  | .on('error', cb)  |
| Stream Readable   +----+     respectivos callbacks.| .on('finish', cb) |
+-^-------^-------^-+    |                           | .on('end', cb)    |
  ^       |       ^      |                           +-------------------+
  |       |       |      |
  |       ^       |      |
  ^       ^       ^      |    +-------------------+         +=================+
  ^       |       ^      +---->  Stream Writable  +--------->  .write(chunk)  |
  |       |       |           +-------------------+         +=======+=========+
  |       |       |                                                 |
  |       ^       |                              +------------------v---------+
  ^       |       +-> if (!chunk)                |    Este chunk é muito grande? |
  ^       |       |     emit .end();             |    A fila está ocupada?      |
  |       |       +-> else                       +-------+----------------+---+
  |       ^       |     emit .write();                   |                |
  |       ^       ^                                   +--v---+        +---v---+
  |       |       ^-----------------------------------<  Não  |        |  Sim  |
  ^       |                                           +------+        +---v---+
  ^       |                                                               |
  |       ^               emit .pause();          +=================+     |
  |       ^---------------^-----------------------+  return false;  <-----+---+
  |                                               +=================+         |
  |                                                                           |
  ^            quando a fila está vazia     +============+                         |
  ^------------^-----------------------<  Armazenamento |                         |
               |                       |============|                         |
               +> emit .drain();       |  ^Buffer^  |                         |
               +> emit .resume();      +------------+                         |
                                       |  ^Buffer^  |                         |
                                       +------------+   adicionar chunk à fila  |
                                       |            <---^---------------------<
                                       +============+
```

::: tip NOTA
Se você estiver configurando um pipeline para encadear alguns streams para manipular seus dados, provavelmente estará implementando um stream Transform.
:::

Nesse caso, a saída do seu stream `Readable` entrará no `Transform` e será direcionada para o `Writable`.

```javascript
Readable.pipe(Transformable).pipe(Writable);
```

O backpressure será aplicado automaticamente, mas observe que o `highwaterMark` de entrada e saída do stream `Transform` pode ser manipulado e afetará o sistema de backpressure.


## Diretrizes de Contrapressão

Desde o Node.js v0.10, a classe Stream oferece a capacidade de modificar o comportamento de `.read()` ou `.write()` usando a versão com sublinhado dessas respectivas funções (`._read()` e `._write()`).

Existem diretrizes documentadas para implementar streams Readable e implementar streams Writable. Assumiremos que você já as leu, e a próxima seção irá um pouco mais a fundo.

## Regras a Seguir ao Implementar Streams Personalizadas

A regra de ouro dos streams é sempre respeitar a contrapressão. O que constitui a melhor prática é a prática não contraditória. Contanto que você tenha cuidado para evitar comportamentos que entrem em conflito com o suporte interno de contrapressão, você pode ter certeza de que está seguindo uma boa prática.

Em geral,

1. Nunca `.push()` se não for solicitado.
2. Nunca chame `.write()` depois que ele retornar falso, mas espere por 'drain' em vez disso.
3. Os streams mudam entre diferentes versões do Node.js e a biblioteca que você usa. Tenha cuidado e teste as coisas.

::: tip NOTE
Em relação ao ponto 3, um pacote incrivelmente útil para construir streams de navegador é `readable-stream`. Rodd Vagg escreveu uma [ótima postagem no blog](https://r.va.gg/2014/06/why-i-dont-use-nodes-core-stream-module.html) descrevendo a utilidade desta biblioteca. Em resumo, ele fornece um tipo de degradação elegante automatizada para streams Readable e oferece suporte a versões mais antigas de navegadores e Node.js.
:::

## Regras específicas para Streams Readable

Até agora, examinamos como `.write()` afeta a contrapressão e nos concentramos muito no stream Writable. Por causa da funcionalidade do Node.js, os dados estão tecnicamente fluindo a jusante de Readable para Writable. No entanto, como podemos observar em qualquer transmissão de dados, matéria ou energia, a fonte é tão importante quanto o destino, e o stream Readable é vital para como a contrapressão é tratada.

Ambos os processos dependem um do outro para se comunicar de forma eficaz, se o Readable ignorar quando o stream Writable pedir para parar de enviar dados, pode ser tão problemático quanto quando o valor de retorno de `.write()` está incorreto.

Portanto, além de respeitar o retorno de `.write()`, também devemos respeitar o valor de retorno de `.push()` usado no método `._read()`. Se `.push()` retornar um valor falso, o stream interromperá a leitura da fonte. Caso contrário, continuará sem pausa.

Aqui está um exemplo de má prática usando `.push()`:
```javascript
// Isso é problemático, pois ignora completamente o valor de retorno do push
// que pode ser um sinal de contrapressão do stream de destino!
class MyReadable extends Readable {
  _read(size) {
    let chunk;
    while (null == (chunk = getNextChunk())) {
      this.push(chunk);
    }
  }
}
```

Além disso, de fora do stream personalizado, existem armadilhas ao ignorar a contrapressão. Neste contra-exemplo de boa prática, o código do aplicativo força a passagem de dados sempre que eles estão disponíveis (sinalizado pelo evento `'data'`):

```javascript
// Isso ignora os mecanismos de contrapressão que o Node.js definiu,
// e empurra incondicionalmente os dados, independentemente de o
// stream de destino estar pronto para eles ou não.
readable.on('data', data => writable.write(data));
```

Aqui está um exemplo de uso de `.push()` com um stream Readable.

```javascript
const { Readable } = require('node:stream');

// Crie um stream Readable personalizado
const myReadableStream = new Readable({
  objectMode: true,
  read(size) {
    // Envie alguns dados para o stream
    this.push({ message: 'Hello, world!' });
    this.push(null); // Marque o final do stream
  },
});

// Consuma o stream
myReadableStream.on('data', chunk => {
  console.log(chunk);
});

// Saída:
// { message: 'Hello, world!' }
```

## Regras específicas para Streams Graváveis

Lembre-se que um `.write()` pode retornar verdadeiro ou falso dependendo de algumas condições. Felizmente para nós, ao construir nosso próprio stream Gravável, a máquina de estados do stream irá lidar com nossos callbacks e determinar quando lidar com a contrapressão e otimizar o fluxo de dados para nós. No entanto, quando queremos usar um Gravável diretamente, devemos respeitar o valor de retorno de `.write()` e prestar muita atenção a estas condições:
- Se a fila de escrita estiver ocupada, `.write()` retornará falso.
- Se o bloco de dados for muito grande, `.write()` retornará falso (o limite é indicado pela variável, highWaterMark).

Neste exemplo, criamos um stream Legível personalizado que empurra um único objeto para o stream usando `.push()`. O método `._read()` é chamado quando o stream está pronto para consumir dados e, neste caso, nós imediatamente empurramos alguns dados para o stream e marcamos o fim do stream empurrando `null`.
```javascript
const stream = require('stream');

class MyReadable extends stream.Readable {
  constructor() {
    super();
  }

  _read() {
    const data = { message: 'Olá, mundo!' };
    this.push(data);
    this.push(null);
  }
}

const readableStream = new MyReadable();

readableStream.pipe(process.stdout);
```
Então consumimos o stream ouvindo o evento 'data' e registrando cada bloco de dados que é empurrado para o stream. Neste caso, nós apenas empurramos um único bloco de dados para o stream, então nós vemos apenas uma mensagem de registro.

## Regras específicas para Streams Graváveis

Lembre-se que um `.write()` pode retornar verdadeiro ou falso dependendo de algumas condições. Felizmente para nós, ao construir nosso próprio stream Gravável, a máquina de estados do stream irá lidar com nossos callbacks e determinar quando lidar com a contrapressão e otimizar o fluxo de dados para nós.

No entanto, quando queremos usar um Gravável diretamente, devemos respeitar o valor de retorno de `.write()` e prestar muita atenção a estas condições:
- Se a fila de escrita estiver ocupada, `.write()` retornará falso.
- Se o bloco de dados for muito grande, `.write()` retornará falso (o limite é indicado pela variável, highWaterMark).

```javascript
class MyWritable extends Writable {
  // Este gravável é inválido devido à natureza assíncrona dos callbacks do JavaScript.
  // Sem uma declaração de retorno para cada callback antes do último,
  // há uma grande chance de múltiplos callbacks serem chamados.
  write(chunk, encoding, callback) {
    if (chunk.toString().indexOf('a') >= 0) callback();
    else if (chunk.toString().indexOf('b') >= 0) callback();
    callback();
  }
}
```

Existem também algumas coisas a serem observadas ao implementar `._writev()`. A função é acoplada com `.cork()`, mas há um erro comum ao escrever:

```javascript
// Usar .uncork() duas vezes aqui faz duas chamadas na camada C++, tornando a
// técnica de cork/uncork inútil.
ws.cork();
ws.write('hello ');
ws.write('world ');
ws.uncork();

ws.cork();
ws.write('from ');
ws.write('Matteo');
ws.uncork();

// A maneira correta de escrever isso é utilizar process.nextTick(), que dispara
// no próximo loop de eventos.
ws.cork();
ws.write('hello ');
ws.write('world ');
process.nextTick(doUncork, ws);

ws.cork();
ws.write('from ');
ws.write('Matteo');
process.nextTick(doUncork, ws);

// Como uma função global.
function doUncork(stream) {
  stream.uncork();
}
```

`.cork()` pode ser chamado quantas vezes quisermos, só precisamos ter cuidado para chamar `.uncork()` a mesma quantidade de vezes para fazê-lo fluir novamente.


## Conclusão

Streams são um módulo frequentemente usado no Node.js. Eles são importantes para a estrutura interna e, para os desenvolvedores, para expandir e conectar em todo o ecossistema de módulos do Node.js.

Esperançosamente, agora você será capaz de solucionar problemas e codificar com segurança seus próprios streams `Writable` e `Readable` com o backpressure em mente, e compartilhar seu conhecimento com colegas e amigos.

Certifique-se de ler mais sobre `Stream` para outras funções de API para ajudar a melhorar e liberar suas capacidades de streaming ao construir um aplicativo com Node.js.

