---
title: Análise de desempenho de aplicações Node.js
description: Saiba como usar o perfilador integrado do Node.js para identificar gargalos de desempenho em sua aplicação e melhorar seu desempenho.
head:
  - - meta
    - name: og:title
      content: Análise de desempenho de aplicações Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Saiba como usar o perfilador integrado do Node.js para identificar gargalos de desempenho em sua aplicação e melhorar seu desempenho.
  - - meta
    - name: twitter:title
      content: Análise de desempenho de aplicações Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Saiba como usar o perfilador integrado do Node.js para identificar gargalos de desempenho em sua aplicação e melhorar seu desempenho.
---


# Criando Perfil de Aplicações Node.js

Existem muitas ferramentas de terceiros disponíveis para criar perfis de aplicações Node.js, mas, em muitos casos, a opção mais fácil é usar o criador de perfil embutido do Node.js. O criador de perfil embutido usa o [criador de perfil dentro do V8](https://v8.dev/docs/profile) que amostra a pilha em intervalos regulares durante a execução do programa. Ele registra os resultados dessas amostras, juntamente com eventos importantes de otimização, como compilações jit, como uma série de ticks:

```bash
code-creation,LazyCompile,0,0x2d5000a337a0,396,"bp native array.js:1153:16",0x289f644df68,~
code-creation,LazyCompile,0,0x2d5000a33940,716,"hasOwnProperty native v8natives.js:198:30",0x289f64438d0,~
code-creation,LazyCompile,0,0x2d5000a33c20,284,"ToName native runtime.js:549:16",0x289f643bb28,~
code-creation,Stub,2,0x2d5000a33d40,182,"DoubleToIStub"
code-creation,Stub,2,0x2d5000a33e00,507,"NumberToStringStub"
```
No passado, você precisava do código-fonte do V8 para poder interpretar os ticks. Felizmente, ferramentas foram introduzidas desde o Node.js 4.4.0 que facilitam o consumo dessas informações sem construir separadamente o V8 a partir do código-fonte. Vamos ver como o criador de perfil embutido pode ajudar a fornecer informações sobre o desempenho da aplicação.

Para ilustrar o uso do criador de perfil de tick, vamos trabalhar com uma aplicação Express simples. Nossa aplicação terá dois manipuladores, um para adicionar novos usuários ao nosso sistema:

```javascript
app.get('/newUser', (req, res) => {
  let username = req.query.username || '';
  const password = req.query.password || '';
  username = username.replace(/[!@#$%^&*]/g, '');
  if (!username || !password || users[username]) {
    return res.sendStatus(400);
  }
  const salt = crypto.randomBytes(128).toString('base64');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512');
  users[username] = { salt, hash };
  res.sendStatus(200);
});
```

e outro para validar tentativas de autenticação de usuário:

```javascript
app.get('/auth', (req, res) => {
  let username = req.query.username || '';
  const password = req.query.password || '';
  username = username.replace(/[!@#$%^&*]/g, '');
  if (!username || !password || !users[username]) {
    return res.sendStatus(400);
  }
  const { salt, hash } = users[username];
  const encryptHash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512');
  if (crypto.timingSafeEqual(hash, encryptHash)) {
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});
```

*Observe que estes NÃO são manipuladores recomendados para autenticar usuários em suas aplicações Node.js e são usados puramente para fins de ilustração. Você não deve tentar projetar seus próprios mecanismos de autenticação criptográfica em geral. É muito melhor usar soluções de autenticação existentes e comprovadas.*

Agora, suponha que implantamos nossa aplicação e os usuários estão reclamando de alta latência nas solicitações. Podemos facilmente executar a aplicação com o criador de perfil embutido:

```bash
NODE_ENV=production node --prof app.js
```

e colocar alguma carga no servidor usando `ab` (ApacheBench):

```bash
curl -X GET "http://localhost:8080/newUser?username=matt&password=password"
ab -k -c 20 -n 250 "http://localhost:8080/auth?username=matt&password=password"
```

e obter uma saída ab de:

```bash
Concurrency Level:      20
Time taken for tests:   46.932 seconds
Complete requests:      250
Failed requests:        0
Keep-Alive requests:    250
Total transferred:      50250 bytes
HTML transferred:       500 bytes
Requests per second:    5.33 [#/sec] (mean)
Time per request:       3754.556 [ms] (mean)
Time per request:       187.728 [ms] (mean, across all concurrent requests)
Transfer rate:          1.05 [Kbytes/sec] received
...
Percentage of the requests served within a certain time (ms)
  50%   3755
  66%   3804
  75%   3818
  80%   3825
  90%   3845
  95%   3858
  98%   3874
  99%   3875
 100%   4225 (longest request)
```

A partir desta saída, vemos que estamos apenas conseguindo atender cerca de 5 solicitações por segundo e que a solicitação média leva pouco menos de 4 segundos de ida e volta. Em um exemplo do mundo real, poderíamos estar fazendo muito trabalho em muitas funções em nome de uma solicitação de usuário, mas mesmo em nosso exemplo simples, o tempo poderia ser perdido compilando expressões regulares, gerando salts aleatórios, gerando hashes exclusivos a partir de senhas de usuário ou dentro do próprio framework Express.

Como executamos nossa aplicação usando a opção `--prof`, um arquivo de tick foi gerado no mesmo diretório da sua execução local da aplicação. Ele deve ter o formato `isolate-0xnnnnnnnnnnnn-v8.log` (onde n é um dígito).

Para entender este arquivo, precisamos usar o processador de tick incluído no binário do Node.js. Para executar o processador, use o sinalizador `--prof-process`:

```bash
node --prof-process isolate-0xnnnnnnnnnnnn-v8.log > processed.txt
```

Abrir processed.txt em seu editor de texto favorito lhe dará alguns tipos diferentes de informações. O arquivo é dividido em seções que são novamente divididas por idioma. Primeiro, olhamos para a seção de resumo e vemos:

```bash
[Summary]:
   ticks  total  nonlib   name
     79    0.2%    0.2%  JavaScript
  36703   97.2%   99.2%  C++
      7    0.0%    0.0%  GC
    767    2.0%          Shared libraries
    215    0.6%          Unaccounted
```

Isto nos diz que 97% de todas as amostras coletadas ocorreram no código C++ e que, ao visualizar outras seções da saída processada, devemos prestar mais atenção ao trabalho que está sendo feito em C++ (em oposição ao JavaScript). Com isto em mente, encontramos em seguida a seção [C++] que contém informações sobre quais funções C++ estão consumindo mais tempo de CPU e vemos:

```bash
 [C++]:
   ticks  total  nonlib   name
  19557   51.8%   52.9%  node::crypto::PBKDF2(v8::FunctionCallbackInfo<v8::Value> const&)
   4510   11.9%   12.2%  _sha1_block_data_order
   3165    8.4%    8.6%  _malloc_zone_malloc
```

Vemos que as 3 principais entradas respondem por 72,1% do tempo de CPU gasto pelo programa. A partir desta saída, vemos imediatamente que pelo menos 51,8% do tempo de CPU é gasto por uma função chamada PBKDF2 que corresponde à nossa geração de hash a partir da senha de um usuário. No entanto, pode não ser imediatamente óbvio como as duas entradas inferiores entram em nossa aplicação (ou se for, vamos fingir o contrário por uma questão de exemplo). Para entender melhor a relação entre estas funções, vamos olhar em seguida para a seção [Bottom up (heavy) profile] que fornece informações sobre os principais chamadores de cada função. Examinando esta seção, encontramos:

```bash
  ticks parent  name
  19557   51.8%  node::crypto::PBKDF2(v8::FunctionCallbackInfo<v8::Value> const&)
  19557  100.0%    v8::internal::Builtins::~Builtins()
  19557  100.0%      LazyCompile: ~pbkdf2 crypto.js:557:16
   4510   11.9%  _sha1_block_data_order
   4510  100.0%    LazyCompile: *pbkdf2 crypto.js:557:16
   4510  100.0%      LazyCompile: *exports.pbkdf2Sync crypto.js:552:30
   3165    8.4%  _malloc_zone_malloc
   3161   99.9%    LazyCompile: *pbkdf2 crypto.js:557:16
   3161  100.0%      LazyCompile: *exports.pbkdf2Sync crypto.js:552:30
```

Analisar esta seção exige um pouco mais de trabalho do que as contagens de tick brutas acima. Dentro de cada uma das "pilhas de chamadas" acima, a porcentagem na coluna pai informa a porcentagem de amostras para as quais a função na linha acima foi chamada pela função na linha atual. Por exemplo, na "pilha de chamadas" intermediária acima para `_sha1_block_data_order`, vemos que `_sha1_block_data_order` ocorreu em 11,9% das amostras, o que sabíamos pelas contagens brutas acima. No entanto, aqui, também podemos dizer que ela foi sempre chamada pela função pbkdf2 dentro do módulo crypto do Node.js. Vemos que, da mesma forma, _malloc_zone_malloc foi chamada quase exclusivamente pela mesma função pbkdf2. Assim, usando as informações nesta visualização, podemos dizer que nossa computação de hash baseada em senha do usuário responde não apenas pelos 51,8% acima, mas também por todo o tempo de CPU nas 3 funções mais amostradas, já que as chamadas para `_sha1_block_data_order` e `_malloc_zone_malloc` foram feitas em nome da função pbkdf2.

Neste ponto, fica muito claro que a geração de hash baseada em senha deve ser o alvo de nossa otimização. Felizmente, você internalizou totalmente os [benefícios da programação assíncrona](https://nodesource.com/blog/why-asynchronous) e percebe que o trabalho para gerar um hash a partir da senha do usuário está sendo feito de forma síncrona e, portanto, prendendo o loop de eventos. Isto nos impede de trabalhar em outras solicitações de entrada enquanto computamos um hash.

Para remediar este problema, você faz uma pequena modificação nos manipuladores acima para usar a versão assíncrona da função pbkdf2:

```javascript
app.get('/auth', (req, res) => {
  let username = req.query.username || '';
  const password = req.query.password || '';
  username = username.replace(/[!@#$%^&*]/g, '');
  if (!username || !password || !users[username]) {
    return res.sendStatus(400);
  }
  crypto.pbkdf2(
    password,
    users[username].salt,
    10000,
    512,
    'sha512',
    (err, hash) => {
      if (users[username].hash.toString() === hash.toString()) {
        res.sendStatus(200);
      } else {
        res.sendStatus(401);
      }
    }
  );
});
```

Uma nova execução do benchmark ab acima com a versão assíncrona da sua aplicação produz:

```bash
Concurrency Level:      20
Time taken for tests:   12.846 seconds
Complete requests:      250
Failed requests:        0
Keep-Alive requests:    250
Total transferred:      50250 bytes
HTML transferred:       500 bytes
Requests per second:    19.46 [#/sec] (mean)
Time per request:       1027.689 [ms] (mean)
Time per request:       51.384 [ms] (mean, across all concurrent requests)
Transfer rate:          3.82 [Kbytes/sec] received
...
Percentage of the requests served within a certain time (ms)
  50%   1018
  66%   1035
  75%   1041
  80%   1043
  90%   1049
  95%   1063
  98%   1070
  99%   1071
 100%   1079 (longest request)
```

Yay! Sua aplicação agora está atendendo cerca de 20 solicitações por segundo, aproximadamente 4 vezes mais do que antes com a geração de hash síncrona. Além disso, a latência média caiu dos 4 segundos anteriores para pouco mais de 1 segundo.

Esperamos que, através da investigação de desempenho deste exemplo (reconhecidamente artificial), você tenha visto como o processador de tick V8 pode ajudá-lo a obter uma melhor compreensão do desempenho de suas aplicações Node.js.

Você também pode achar [como criar um gráfico de chamas útil](/pt/nodejs/guide/flame-graphs).

