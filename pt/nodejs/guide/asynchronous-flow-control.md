---
title: Controle de fluxo assíncrono em JavaScript
description: Entender o controle de fluxo assíncrono em JavaScript, incluindo callbacks, gerenciamento de estado e padrões de fluxo de controle.
head:
  - - meta
    - name: og:title
      content: Controle de fluxo assíncrono em JavaScript | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Entender o controle de fluxo assíncrono em JavaScript, incluindo callbacks, gerenciamento de estado e padrões de fluxo de controle.
  - - meta
    - name: twitter:title
      content: Controle de fluxo assíncrono em JavaScript | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Entender o controle de fluxo assíncrono em JavaScript, incluindo callbacks, gerenciamento de estado e padrões de fluxo de controle.
---


# Controle de fluxo assíncrono

::: info
O material neste post é fortemente inspirado no [Mixu's Node.js Book](http://book.mixu.net/node/ch7.html).
:::

Em sua essência, o JavaScript é projetado para não bloquear a thread "principal", que é onde as views são renderizadas. Você pode imaginar a importância disso no navegador. Quando a thread principal é bloqueada, resulta no infame "congelamento" que os usuários finais detestam, e nenhum outro evento pode ser despachado, resultando na perda de aquisição de dados, por exemplo.

Isso cria algumas restrições únicas que apenas um estilo funcional de programação pode curar. É aqui que os callbacks entram em cena.

No entanto, os callbacks podem se tornar desafiadores de lidar em procedimentos mais complicados. Isso geralmente resulta no "inferno de callbacks", onde múltiplas funções aninhadas com callbacks tornam o código mais desafiador de ler, depurar, organizar, etc.

```js
async1(function (input, result1) {
  async2(function (result2) {
    async3(function (result3) {
      async4(function (result4) {
        async5(function (output) {
          // fazer algo com o output
        });
      });
    });
  });
});
```

É claro que, na vida real, provavelmente haveria linhas de código adicionais para lidar com `result1`, `result2`, etc., portanto, a extensão e a complexidade desse problema geralmente resultam em código que parece muito mais confuso do que o exemplo acima.

**É aqui que as funções entram em grande utilidade. Operações mais complexas são compostas por muitas funções:**

1. estilo de iniciador / input
2. middleware
3. terminator

**O "estilo de iniciador / input" é a primeira função na sequência. Esta função aceitará o input original, se houver, para a operação. A operação é uma série executável de funções, e o input original será principalmente:**

1. variáveis em um ambiente global
2. invocação direta com ou sem argumentos
3. valores obtidos por solicitações do sistema de arquivos ou de rede

As solicitações de rede podem ser solicitações de entrada iniciadas por uma rede estrangeira, por outro aplicativo na mesma rede ou pelo próprio aplicativo na mesma rede ou em uma rede estrangeira.

Uma função middleware retornará outra função, e uma função terminator invocará o callback. O seguinte ilustra o fluxo para solicitações de rede ou sistema de arquivos. Aqui a latência é 0 porque todos esses valores estão disponíveis na memória.

```js
function final(someInput, callback) {
  callback(`${someInput} e terminado executando callback `);
}
function middleware(someInput, callback) {
  return final(`${someInput} tocado pelo middleware `, callback);
}
function initiate() {
  const someInput = 'olá esta é uma função ';
  middleware(someInput, function (result) {
    console.log(result);
    // requer callback para `return` resultado
  });
}
initiate();
```


## Gerenciamento de estado

As funções podem ou não ser dependentes do estado. A dependência do estado surge quando a entrada ou outra variável de uma função depende de uma função externa.

**Dessa forma, existem duas estratégias principais para o gerenciamento de estado:**

1. passar variáveis diretamente para uma função e
2. adquirir um valor de variável de um cache, sessão, arquivo, banco de dados, rede ou outra fonte externa.

Observe que não mencionei variável global. Gerenciar o estado com variáveis globais é frequentemente um antipadrão desleixado que torna difícil ou impossível garantir o estado. Variáveis globais em programas complexos devem ser evitadas sempre que possível.

## Fluxo de controle

Se um objeto estiver disponível na memória, a iteração será possível e não haverá alteração no fluxo de controle:

```js
function getSong() {
  let _song = '';
  let i = 100;
  for (i; i > 0; i -= 1) {
    _song += `${i} cervejas na parede, você derruba uma e passa para frente, ${
      i - 1
    } garrafas de cerveja na parede\n`;
    if (i === 1) {
      _song += "Ei, vamos pegar mais cerveja";
    }
  }
  return _song;
}
function singSong(_song) {
  if (!_song) throw new Error("a música está '' vazia, ME DÊ UMA MÚSICA!");
  console.log(_song);
}
const song = getSong();
// isto irá funcionar
singSong(song);
```

No entanto, se os dados existirem fora da memória, a iteração não funcionará mais:

```js
function getSong() {
  let _song = '';
  let i = 100;
  for (i; i > 0; i -= 1) {
    /* eslint-disable no-loop-func */
    setTimeout(function () {
      _song += `${i} cervejas na parede, você derruba uma e passa para frente, ${
        i - 1
      } garrafas de cerveja na parede\n`;
      if (i === 1) {
        _song += "Ei, vamos pegar mais cerveja";
      }
    }, 0);
    /* eslint-enable no-loop-func */
  }
  return _song;
}
function singSong(_song) {
  if (!_song) throw new Error("a música está '' vazia, ME DÊ UMA MÚSICA!");
  console.log(_song);
}
const song = getSong('cerveja');
// isto não irá funcionar
singSong(song);
// Uncaught Error: song is '' empty, FEED ME A SONG!
```

Por que isso aconteceu? `setTimeout` instrui a CPU a armazenar as instruções em outro lugar no barramento e instrui que os dados sejam agendados para coleta posteriormente. Milhares de ciclos de CPU passam antes que a função atinja novamente a marca de 0 milissegundos, a CPU busca as instruções do barramento e as executa. O único problema é que a música ('') foi retornada milhares de ciclos antes.

A mesma situação surge ao lidar com sistemas de arquivos e solicitações de rede. O thread principal simplesmente não pode ser bloqueado por um período indeterminado de tempo - portanto, usamos callbacks para agendar a execução do código no tempo de maneira controlada.

Você poderá executar quase todas as suas operações com os 3 padrões a seguir:

1. **Em série:** as funções serão executadas em uma ordem sequencial estrita, esta é a mais semelhante aos loops `for`.

```js
// operações definidas em outro lugar e prontas para serem executadas
const operations = [
  { func: function1, args: args1 },
  { func: function2, args: args2 },
  { func: function3, args: args3 },
];
function executeFunctionWithArgs(operation, callback) {
  // executa função
  const { args, func } = operation;
  func(args, callback);
}
function serialProcedure(operation) {
  if (!operation) process.exit(0); // finalizado
  executeFunctionWithArgs(operation, function (result) {
    // continue APÓS o callback
    serialProcedure(operations.shift());
  });
}
serialProcedure(operations.shift());
```

2. `Paralelo completo`: quando a ordem não é um problema, como enviar e-mail para uma lista de 1.000.000 de destinatários de e-mail.

```js
let count = 0;
let success = 0;
const failed = [];
const recipients = [
  { name: 'Bart', email: 'bart@tld' },
  { name: 'Marge', email: 'marge@tld' },
  { name: 'Homer', email: 'homer@tld' },
  { name: 'Lisa', email: 'lisa@tld' },
  { name: 'Maggie', email: 'maggie@tld' },
];
function dispatch(recipient, callback) {
  // `sendEmail` é um cliente SMTP hipotético
  sendMail(
    {
      subject: 'Jantar hoje à noite',
      message: 'Temos muito repolho no prato. Você vem?',
      smtp: recipient.email,
    },
    callback
  );
}
function final(result) {
  console.log(`Resultado: ${result.count} tentativas \
      & ${result.success} e-mails bem-sucedidos`);
  if (result.failed.length)
    console.log(`Falha ao enviar para: \
        \n${result.failed.join('\n')}\n`);
}
recipients.forEach(function (recipient) {
  dispatch(recipient, function (err) {
    if (!err) {
      success += 1;
    } else {
      failed.push(recipient.name);
    }
    count += 1;
    if (count === recipients.length) {
      final({
        count,
        success,
        failed,
      });
    }
  });
});
```

3. **Paralelo limitado**: paralelo com limite, como enviar e-mail com sucesso para 1.000.000 de destinatários de uma lista de 10 milhões de usuários.

```js
let successCount = 0;
function final() {
  console.log(`enviado ${successCount} e-mails`);
  console.log('finalizado');
}
function dispatch(recipient, callback) {
  // `sendEmail` é um cliente SMTP hipotético
  sendMail(
    {
      subject: 'Jantar hoje à noite',
      message: 'Temos muito repolho no prato. Você vem?',
      smtp: recipient.email,
    },
    callback
  );
}
function sendOneMillionEmailsOnly() {
  getListOfTenMillionGreatEmails(function (err, bigList) {
    if (err) throw err;
    function serial(recipient) {
      if (!recipient || successCount >= 1000000) return final();
      dispatch(recipient, function (_err) {
        if (!_err) successCount += 1;
        serial(bigList.pop());
      });
    }
    serial(bigList.pop());
  });
}
sendOneMillionEmailsOnly();
```

Cada um tem seus próprios casos de uso, benefícios e problemas que você pode experimentar e ler com mais detalhes. Mais importante, lembre-se de modularizar suas operações e usar callbacks! Se você tiver alguma dúvida, trate tudo como se fosse middleware!
