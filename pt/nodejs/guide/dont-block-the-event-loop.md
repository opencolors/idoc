---
title: Não bloqueie o loop de eventos (ou a piscina de trabalho)
description: Como escrever um servidor web de alto desempenho e mais resistente a ataques DoS evitando bloquear o loop de eventos e a piscina de trabalho no Node.js.
head:
  - - meta
    - name: og:title
      content: Não bloqueie o loop de eventos (ou a piscina de trabalho) | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Como escrever um servidor web de alto desempenho e mais resistente a ataques DoS evitando bloquear o loop de eventos e a piscina de trabalho no Node.js.
  - - meta
    - name: twitter:title
      content: Não bloqueie o loop de eventos (ou a piscina de trabalho) | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Como escrever um servidor web de alto desempenho e mais resistente a ataques DoS evitando bloquear o loop de eventos e a piscina de trabalho no Node.js.
---


# Não Bloqueie o Loop de Evento (ou o Pool de Workers)

## Você deve ler este guia?

Se você está escrevendo algo mais complicado do que um script de linha de comando breve, ler isso deve ajudá-lo a escrever aplicações de maior desempenho e mais seguras.

Este documento foi escrito tendo em mente servidores Node.js, mas os conceitos se aplicam também a aplicações Node.js complexas. Onde os detalhes específicos do SO variam, este documento é centrado no Linux.

## Resumo

O Node.js executa código JavaScript no Loop de Evento (inicialização e callbacks) e oferece um Pool de Workers para lidar com tarefas dispendiosas como E/S de arquivos. O Node.js escala bem, às vezes melhor do que abordagens mais pesadas como o Apache. O segredo para a escalabilidade do Node.js é que ele usa um pequeno número de threads para lidar com muitos clientes. Se o Node.js pode se dar bem com menos threads, então ele pode gastar mais tempo e memória do seu sistema trabalhando em clientes em vez de gastar sobrecargas de espaço e tempo para threads (memória, troca de contexto). Mas como o Node.js tem apenas algumas threads, você deve estruturar sua aplicação para usá-las com sabedoria.

Aqui está uma boa regra prática para manter seu servidor Node.js rápido: *Node.js é rápido quando o trabalho associado a cada cliente em um dado momento é "pequeno".*

Isso se aplica a callbacks no Loop de Evento e a tarefas no Pool de Workers.

## Por que devo evitar bloquear o Loop de Evento e o Pool de Workers?

O Node.js usa um pequeno número de threads para lidar com muitos clientes. No Node.js, existem dois tipos de threads: um Loop de Evento (também conhecido como loop principal, thread principal, thread de evento, etc.) e um pool de `k` Workers em um Pool de Workers (também conhecido como threadpool).

Se uma thread está demorando muito para executar um callback (Loop de Evento) ou uma tarefa (Worker), nós a chamamos de "bloqueada". Enquanto uma thread está bloqueada trabalhando em nome de um cliente, ela não pode lidar com solicitações de nenhum outro cliente. Isso fornece duas motivações para não bloquear nem o Loop de Evento nem o Pool de Workers:

1. Desempenho: Se você realiza regularmente atividades pesadas em qualquer tipo de thread, a *taxa de transferência* (solicitações/segundo) do seu servidor sofrerá.
2. Segurança: Se for possível que, para certas entradas, uma de suas threads possa bloquear, um cliente malicioso pode enviar essa "entrada maligna", fazer com que suas threads bloqueiem e impedi-las de trabalhar em outros clientes. Isso seria um [Ataque de Negação de Serviço](https://en.wikipedia.org/wiki/Denial-of-service_attack).


## Uma rápida revisão do Node

Node.js usa a Arquitetura Orientada a Eventos: ele possui um Loop de Eventos para orquestração e um Pool de Workers para tarefas dispendiosas.

### Qual código é executado no Loop de Eventos?

Quando iniciam, as aplicações Node.js primeiro completam uma fase de inicialização, `require`-ndo módulos e registrando callbacks para eventos. As aplicações Node.js então entram no Loop de Eventos, respondendo a requisições de clientes recebidas executando o callback apropriado. Este callback executa de forma síncrona e pode registrar requisições assíncronas para continuar o processamento após sua conclusão. Os callbacks para essas requisições assíncronas também serão executados no Loop de Eventos.

O Loop de Eventos também atenderá às requisições assíncronas não bloqueantes feitas por seus callbacks, por exemplo, E/S de rede.

Em resumo, o Loop de Eventos executa os callbacks JavaScript registrados para eventos e também é responsável por atender às requisições assíncronas não bloqueantes, como E/S de rede.

### Qual código é executado no Pool de Workers?

O Pool de Workers do Node.js é implementado em libuv ([docs](http://docs.libuv.org/en/v1.x/threadpool.html)), que expõe uma API geral de submissão de tarefas.

Node.js usa o Pool de Workers para lidar com tarefas "dispendiosas". Isso inclui E/S para as quais um sistema operacional não fornece uma versão não bloqueante, bem como tarefas particularmente intensivas em CPU.

Estas são as APIs de módulo do Node.js que utilizam este Pool de Workers:

1. Intensivas em E/S
    1. [DNS](/pt/nodejs/api/dns): `dns.lookup()`, `dns.lookupService()`.
    2. [Sistema de Arquivos](/pt/nodejs/api/fs): Todas as APIs de sistema de arquivos, exceto `fs.FSWatcher()` e aquelas que são explicitamente síncronas, usam o threadpool do libuv.
2. Intensivas em CPU
    1. [Crypto](/pt/nodejs/api/crypto): `crypto.pbkdf2()`, `crypto.scrypt()`, `crypto.randomBytes()`, `crypto.randomFill()`, `crypto.generateKeyPair()`.
    2. [Zlib](/pt/nodejs/api/zlib): Todas as APIs zlib, exceto aquelas que são explicitamente síncronas, usam o threadpool do libuv.

Em muitas aplicações Node.js, essas APIs são as únicas fontes de tarefas para o Pool de Workers. Aplicações e módulos que usam um [add-on C++](/pt/nodejs/api/addons) podem submeter outras tarefas ao Pool de Workers.

Para fins de completude, notamos que, ao chamar uma dessas APIs de um callback no Loop de Eventos, o Loop de Eventos paga alguns custos de configuração menores ao entrar nas ligações C++ do Node.js para essa API e submeter uma tarefa ao Pool de Workers. Esses custos são desprezíveis em comparação com o custo geral da tarefa, e é por isso que o Loop de Eventos está descarregando-a. Ao submeter uma dessas tarefas ao Pool de Workers, o Node.js fornece um ponteiro para a função C++ correspondente nas ligações C++ do Node.js.


### Como o Node.js decide qual código executar em seguida?

Abstratamente, o Event Loop e o Worker Pool mantêm filas para eventos pendentes e tarefas pendentes, respectivamente.

Na verdade, o Event Loop não mantém realmente uma fila. Em vez disso, ele tem uma coleção de descritores de arquivo que ele pede ao sistema operacional para monitorar, usando um mecanismo como [epoll](http://man7.org/linux/man-pages/man7/epoll.7.html) (Linux), [kqueue](https://developer.apple.com/library/content/documentation/Darwin/Conceptual/FSEvents_ProgGuide/KernelQueues/KernelQueues.html) (OSX), portas de evento (Solaris) ou [IOCP](https://msdn.microsoft.com/en-us/library/windows/desktop/aa365198.aspx) (Windows). Esses descritores de arquivo correspondem a sockets de rede, quaisquer arquivos que ele esteja observando e assim por diante. Quando o sistema operacional diz que um desses descritores de arquivo está pronto, o Event Loop o traduz para o evento apropriado e invoca os callbacks associados a esse evento. Você pode aprender mais sobre este processo [aqui](https://www.youtube.com/watch?v=P9csgxBgaZ8).

Em contraste, o Worker Pool usa uma fila real cujas entradas são tarefas a serem processadas. Um Worker retira uma tarefa dessa fila e trabalha nela e, quando termina, o Worker levanta um evento "Pelo menos uma tarefa foi concluída" para o Event Loop.

### O que isso significa para o design de aplicativos?
Em um sistema de um thread por cliente como o Apache, cada cliente pendente recebe seu próprio thread. Se um thread que manipula um cliente for bloqueado, o sistema operacional o interromperá e dará a outro cliente uma vez. O sistema operacional, portanto, garante que os clientes que exigem uma pequena quantidade de trabalho não sejam penalizados por clientes que exigem mais trabalho.

Como o Node.js lida com muitos clientes com poucos threads, se um thread bloquear o tratamento da solicitação de um cliente, as solicitações de cliente pendentes podem não ter uma vez até que o thread termine seu callback ou tarefa. O tratamento justo dos clientes é, portanto, responsabilidade do seu aplicativo. Isso significa que você não deve fazer muito trabalho para nenhum cliente em nenhum callback ou tarefa única.

Isso faz parte do motivo pelo qual o Node.js pode escalar bem, mas também significa que você é responsável por garantir o agendamento justo. As próximas seções falam sobre como garantir o agendamento justo para o Event Loop e para o Worker Pool.


## Não bloqueie o Loop de Eventos
O Loop de Eventos percebe cada nova conexão de cliente e orquestra a geração de uma resposta. Todas as requisições de entrada e respostas de saída passam pelo Loop de Eventos. Isso significa que, se o Loop de Eventos gastar muito tempo em algum ponto, todos os clientes atuais e novos não terão sua vez.

Você deve garantir que nunca bloqueie o Loop de Eventos. Em outras palavras, cada um de seus callbacks JavaScript deve ser concluído rapidamente. Isso, é claro, também se aplica aos seus `await`'s, seus `Promise.then`'s e assim por diante.

Uma boa maneira de garantir isso é raciocinar sobre a ["complexidade computacional"](https://en.wikipedia.org/wiki/Time_complexity) de seus callbacks. Se seu callback leva um número constante de etapas, não importa quais sejam seus argumentos, então você sempre dará a cada cliente pendente uma chance justa. Se seu callback leva um número diferente de etapas, dependendo de seus argumentos, então você deve pensar sobre quanto tempo os argumentos podem levar.

Exemplo 1: Um callback de tempo constante.

```js
app.get('/constant-time', (req, res) => {
  res.sendStatus(200);
});
```

Exemplo 2: Um callback `O(n)`. Este callback será executado rapidamente para `n` pequeno e mais lentamente para `n` grande.

```js
app.get('/countToN', (req, res) => {
  let n = req.query.n;
  // n iterações antes de dar a vez para outra pessoa
  for (let i = 0; i < n; i++) {
    console.log(`Iter ${i}`);
  }
  res.sendStatus(200);
});
```
Exemplo 3: Um callback `O(n^2)`. Este callback ainda será executado rapidamente para `n` pequeno, mas para `n` grande, ele será executado muito mais lentamente do que o exemplo `O(n)` anterior.

```js
app.get('/countToN2', (req, res) => {
  let n = req.query.n;
  // n^2 iterações antes de dar a vez para outra pessoa
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      console.log(`Iter ${i}.${j}`);
    }
  }
  res.sendStatus(200);
});
```

### Quão cuidadoso você deve ser?
Node.js usa o motor Google V8 para JavaScript, que é bastante rápido para muitas operações comuns. Exceções a esta regra são regexps e operações JSON, discutidas abaixo.

No entanto, para tarefas complexas, você deve considerar limitar a entrada e rejeitar entradas que são muito longas. Dessa forma, mesmo que seu callback tenha grande complexidade, ao limitar a entrada você garante que o callback não pode demorar mais do que o tempo do pior caso na entrada aceitável mais longa. Você pode então avaliar o custo do pior caso deste callback e determinar se seu tempo de execução é aceitável em seu contexto.


## Bloqueando o Loop de Eventos: REDOS

Uma maneira comum de bloquear o Loop de Eventos de forma desastrosa é usando uma [expressão regular](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) "vulnerável".

### Evitando expressões regulares vulneráveis
Uma expressão regular (regexp) compara uma string de entrada com um padrão. Normalmente pensamos em uma correspondência de regexp como exigindo uma única passagem pela string de entrada `--- O(n)` tempo onde `n` é o comprimento da string de entrada. Em muitos casos, uma única passagem é realmente tudo o que é necessário. Infelizmente, em alguns casos, a correspondência de regexp pode exigir um número exponencial de viagens pela string de entrada `--- O(2^n)` tempo. Um número exponencial de viagens significa que, se o mecanismo exigir x viagens para determinar uma correspondência, ele precisará de `2*x` viagens se adicionarmos apenas mais um caractere à string de entrada. Como o número de viagens está linearmente relacionado ao tempo necessário, o efeito dessa avaliação será bloquear o Loop de Eventos.

Uma *expressão regular vulnerável* é aquela na qual seu mecanismo de expressão regular pode levar um tempo exponencial, expondo você a [REDOS](https://owasp.org/www-community/attacks/Regular_expression_Denial_of_Service_-_ReDoS) em "entrada maligna". Se seu padrão de expressão regular é vulnerável ou não (ou seja, o mecanismo de regexp pode levar um tempo exponencial nele) é realmente uma pergunta difícil de responder e varia dependendo se você está usando Perl, Python, Ruby, Java, JavaScript, etc., mas aqui estão algumas regras práticas que se aplicam a todas essas linguagens:

1. Evite quantificadores aninhados como `(a+)*`. O mecanismo de regexp do V8 pode lidar com alguns deles rapidamente, mas outros são vulneráveis.
2. Evite ORs com cláusulas sobrepostas, como `(a|a)*`. Novamente, estes são às vezes rápidos.
3. Evite usar backreferences, como `(a.*) \1`. Nenhum mecanismo de regexp pode garantir a avaliação destes em tempo linear.
4. Se você estiver fazendo uma correspondência de string simples, use `indexOf` ou o equivalente local. Será mais barato e nunca levará mais do que `O(n)`.

Se você não tiver certeza se sua expressão regular é vulnerável, lembre-se de que o Node.js geralmente não tem problemas para relatar uma correspondência, mesmo para uma regexp vulnerável e uma string de entrada longa. O comportamento exponencial é acionado quando há uma incompatibilidade, mas o Node.js não pode ter certeza até tentar muitos caminhos pela string de entrada.


### Um exemplo de REDOS

Aqui está um exemplo de regexp vulnerável expondo seu servidor ao REDOS:

```js
app.get('/redos-me', (req, res) => {
  let filePath = req.query.filePath;
  // REDOS
  if (filePath.match(/(\/.+)+$/)) {
    console.log('valid path');
  } else {
    console.log('invalid path');
  }
  res.sendStatus(200);
});
```

O regexp vulnerável neste exemplo é uma maneira (ruim!) de verificar um caminho válido no Linux. Ele corresponde a strings que são uma sequência de nomes delimitados por "/", como "`/a/b/c`". É perigoso porque viola a regra 1: tem um quantificador duplamente aninhado.

Se um cliente consultar com filePath `///.../\n` (100 /'s seguidos por um caractere de nova linha que o "." do regexp não corresponderá), então o Event Loop levará efetivamente uma eternidade, bloqueando o Event Loop. O ataque REDOS deste cliente faz com que todos os outros clientes não tenham a vez até que a correspondência do regexp termine.

Por esta razão, você deve ter cuidado ao usar expressões regulares complexas para validar a entrada do usuário.

### Recursos Anti-REDOS
Existem algumas ferramentas para verificar seus regexps quanto à segurança, como

- [safe-regex](https://github.com/davisjam/safe-regex)
- [rxxr2](https://github.com/superhuman/rxxr2)

No entanto, nenhum deles detectará todos os regexps vulneráveis.

Outra abordagem é usar um mecanismo regexp diferente. Você pode usar o módulo [node-re2](https://github.com/uhop/node-re2), que usa o mecanismo regexp [RE2](https://github.com/google/re2) incrivelmente rápido do Google. Mas esteja avisado, o RE2 não é 100% compatível com os regexps do V8, então verifique se há regressões se você trocar o módulo node-re2 para lidar com seus regexps. E regexps particularmente complicados não são suportados pelo node-re2.

Se você estiver tentando corresponder algo "óbvio", como um URL ou um caminho de arquivo, encontre um exemplo em uma [biblioteca regexp](http://www.regexlib.com/) ou use um módulo npm, por exemplo, [ip-regex](https://www.npmjs.com/package/ip-regex).

### Bloqueando o Event Loop: Módulos principais do Node.js

Vários módulos principais do Node.js têm APIs síncronas dispendiosas, incluindo:

- [Criptografia](/pt/nodejs/api/crypto)
- [Compressão](/pt/nodejs/api/zlib)
- [Sistema de arquivos](/pt/nodejs/api/fs)
- [Processo filho](/pt/nodejs/api/child_process)

Essas APIs são dispendiosas, porque envolvem computação significativa (criptografia, compressão), exigem E/S (E/S de arquivo) ou potencialmente ambos (processo filho). Essas APIs são destinadas à conveniência de script, mas não se destinam ao uso no contexto do servidor. Se você os executar no Event Loop, eles levarão muito mais tempo para serem concluídos do que uma instrução JavaScript típica, bloqueando o Event Loop.

Em um servidor, você não deve usar as seguintes APIs síncronas desses módulos:

- Criptografia:
    - `crypto.randomBytes` (versão síncrona)
    - `crypto.randomFillSync`
    - `crypto.pbkdf2Sync`
    - Você também deve ter cuidado ao fornecer uma grande entrada para as rotinas de criptografia e descriptografia.
- Compressão:
    - `zlib.inflateSync`
    - `zlib.deflateSync`
- Sistema de arquivos:
    - Não use as APIs síncronas do sistema de arquivos. Por exemplo, se o arquivo que você acessa estiver em um [sistema de arquivos distribuído](https://en.wikipedia.org/wiki/Clustered_file_system#Distributed_file_systems) como [NFS](https://en.wikipedia.org/wiki/Network_File_System), os tempos de acesso podem variar amplamente.
- Processo filho:
    - `child_process.spawnSync`
    - `child_process.execSync`
    - `child_process.execFileSync`

Esta lista está razoavelmente completa a partir do Node.js v9.


## Bloqueando o Loop de Eventos: JSON DOS

`JSON.parse` e `JSON.stringify` são outras operações potencialmente caras. Embora estas sejam O(n) no comprimento da entrada, para grandes n podem demorar surpreendentemente.

Se o seu servidor manipula objetos JSON, particularmente aqueles de um cliente, você deve ser cauteloso sobre o tamanho dos objetos ou strings com os quais você trabalha no Loop de Eventos.

Exemplo: bloqueio JSON. Criamos um objeto `obj` de tamanho 2^21 e `JSON.stringify` ele, executamos indexOf na string e então `JSON.parse` ele. A string `JSON.stringify`'d tem 50MB. Leva 0,7 segundos para stringificar o objeto, 0,03 segundos para indexOf na string de 50MB e 1,3 segundos para analisar a string.

```js
let obj = { a: 1 };
let niter = 20;
let before, str, pos, res, took;
for (let i = 0; i < niter; i++) {
  obj = { obj1: obj, obj2: obj }; // Dobra de tamanho a cada iter
}
before = process.hrtime();
str = JSON.stringify(obj);
took = process.hrtime(before);
console.log('JSON.stringify took ' + took);
before = process.hrtime();
pos = str.indexOf('nomatch');
took = process.hrtime(before);
console.log('Pure indexof took ' + took);
before = process.hrtime();
res = JSON.parse(str);
took = process.hrtime(before);
console.log('JSON.parse took ' + took);
```

Existem módulos npm que oferecem APIs JSON assíncronas. Veja por exemplo:

- [JSONStream](https://www.npmjs.com/package/JSONStream), que possui APIs de stream.
- [Big-Friendly JSON](https://www.npmjs.com/package/bfj), que possui APIs de stream, bem como versões assíncronas das APIs JSON padrão usando o paradigma de particionamento no Loop de Eventos descrito abaixo.

## Cálculos complexos sem bloquear o Loop de Eventos

Suponha que você queira fazer cálculos complexos em JavaScript sem bloquear o Loop de Eventos. Você tem duas opções: particionamento ou descarregamento.

### Particionamento

Você pode *particionar* seus cálculos para que cada um seja executado no Loop de Eventos, mas regularmente ceda (dê turnos a) outros eventos pendentes. Em JavaScript, é fácil salvar o estado de uma tarefa em andamento em um closure, como mostrado no exemplo 2 abaixo.

Para um exemplo simples, suponha que você queira calcular a média dos números `1` a `n`.

Exemplo 1: Média não particionada, custa `O(n)`

```js
for (let i = 0; i < n; i++) sum += i;
let avg = sum / n;
console.log('avg: ' + avg);
```

Exemplo 2: Média particionada, cada uma das `n` etapas assíncronas custa `O(1)`.

```js
function asyncAvg(n, avgCB) {
  // Salva a soma em andamento no closure JS.
  let sum = 0;
  function help(i, cb) {
    sum += i;
    if (i == n) {
      cb(sum);
      return;
    }
    // "Recursão assíncrona".
    // Agende a próxima operação de forma assíncrona.
    setImmediate(help.bind(null, i + 1, cb));
  }
  // Inicie o auxiliar, com CB para chamar avgCB.
  help(1, function (sum) {
    let avg = sum / n;
    avgCB(avg);
  });
}
asyncAvg(n, function (avg) {
  console.log('avg of 1-n: ' + avg);
});
```

Você pode aplicar este princípio a iterações de array e assim por diante.


### Descarregamento

Se você precisa fazer algo mais complexo, o particionamento não é uma boa opção. Isso ocorre porque o particionamento usa apenas o Loop de Eventos, e você não se beneficiará dos múltiplos núcleos quase certamente disponíveis em sua máquina. **Lembre-se, o Loop de Eventos deve orquestrar as requisições do cliente, não atendê-las ele mesmo.** Para uma tarefa complicada, mova o trabalho para fora do Loop de Eventos para um Worker Pool.

#### Como descarregar

Você tem duas opções para um Worker Pool de destino para o qual descarregar o trabalho.

1. Você pode usar o Worker Pool embutido do Node.js desenvolvendo um [addon em C++](/pt/nodejs/api/addons). Em versões mais antigas do Node, construa seu [addon em C++](/pt/nodejs/api/addons) usando [NAN](https://github.com/nodejs/nan), e em versões mais recentes use [N-API](/pt/nodejs/api/n-api). [node-webworker-threads](https://www.npmjs.com/package/webworker-threads) oferece uma maneira apenas em JavaScript de acessar o Worker Pool do Node.js.
2. Você pode criar e gerenciar seu próprio Worker Pool dedicado à computação em vez do Worker Pool temático de I/O do Node.js. A maneira mais direta de fazer isso é usando [Processo Filho](/pt/nodejs/api/child_process) ou [Cluster](/pt/nodejs/api/cluster).

Você não deve simplesmente criar um [Processo Filho](/pt/nodejs/api/child_process) para cada cliente. Você pode receber requisições de clientes mais rapidamente do que pode criar e gerenciar filhos, e seu servidor pode se tornar uma [bomba de fork](https://en.wikipedia.org/wiki/Fork_bomb).

Desvantagem do descarregamento
A desvantagem da abordagem de descarregamento é que ela acarreta sobrecarga na forma de custos de comunicação. Apenas o Loop de Eventos tem permissão para ver o "namespace" (estado JavaScript) de sua aplicação. De um Worker, você não pode manipular um objeto JavaScript no namespace do Loop de Eventos. Em vez disso, você tem que serializar e desserializar quaisquer objetos que você deseja compartilhar. Então o Worker pode operar em sua própria cópia desses objetos e retornar o objeto modificado (ou um "patch") para o Loop de Eventos.

Para preocupações de serialização, veja a seção sobre JSON DOS.

#### Algumas sugestões para descarregamento

Você pode querer distinguir entre tarefas intensivas em CPU e tarefas intensivas em I/O porque elas têm características marcadamente diferentes.

Uma tarefa intensiva em CPU só progride quando seu Worker é agendado, e o Worker deve ser agendado para um dos [núcleos lógicos](/pt/nodejs/api/os) de sua máquina. Se você tem 4 núcleos lógicos e 5 Workers, um desses Workers não pode progredir. Como resultado, você está pagando sobrecarga (memória e custos de agendamento) para este Worker e não obtendo retorno por isso.

Tarefas intensivas em I/O envolvem consultar um provedor de serviços externo (DNS, sistema de arquivos, etc.) e esperar por sua resposta. Enquanto um Worker com uma tarefa intensiva em I/O está esperando por sua resposta, ele não tem mais nada para fazer e pode ser desprogramado pelo sistema operacional, dando a outro Worker a chance de enviar sua requisição. Assim, tarefas intensivas em I/O estarão progredindo mesmo enquanto a thread associada não estiver rodando. Provedores de serviços externos como bancos de dados e sistemas de arquivos foram altamente otimizados para lidar com muitas requisições pendentes simultaneamente. Por exemplo, um sistema de arquivos examinará um grande conjunto de requisições de escrita e leitura pendentes para mesclar atualizações conflitantes e para recuperar arquivos em uma ordem ideal.

Se você depende de apenas um Worker Pool, por exemplo, o Worker Pool do Node.js, então as diferentes características do trabalho limitado por CPU e limitado por I/O podem prejudicar o desempenho da sua aplicação.

Por esta razão, você pode querer manter um Worker Pool de Computação separado.


### Offloading: conclusões

Para tarefas simples, como iterar sobre os elementos de um array arbitrariamente longo, o particionamento pode ser uma boa opção. Se sua computação for mais complexa, o offloading é uma abordagem melhor: os custos de comunicação, ou seja, a sobrecarga de passar objetos serializados entre o Event Loop e o Worker Pool, são compensados pelo benefício de usar múltiplos cores.

No entanto, se seu servidor depende fortemente de cálculos complexos, você deve pensar se o Node.js é realmente uma boa opção. O Node.js se destaca para trabalho vinculado a I/O, mas para computação dispendiosa pode não ser a melhor opção.

Se você adotar a abordagem de offloading, consulte a seção sobre não bloquear o Worker Pool.

### Não bloqueie o Worker Pool
O Node.js possui um Worker Pool composto por k Workers. Se você estiver usando o paradigma de Offloading discutido acima, você pode ter um Worker Pool Computacional separado, ao qual os mesmos princípios se aplicam. Em ambos os casos, vamos supor que k é muito menor que o número de clientes que você pode estar atendendo simultaneamente. Isso está de acordo com a filosofia "uma thread para muitos clientes" do Node.js, o segredo de sua escalabilidade.

Conforme discutido acima, cada Worker conclui sua Tarefa atual antes de prosseguir para a próxima na fila do Worker Pool.

Agora, haverá variação no custo das Tarefas necessárias para lidar com as solicitações de seus clientes. Algumas Tarefas podem ser concluídas rapidamente (por exemplo, ler arquivos curtos ou em cache, ou produzir um pequeno número de bytes aleatórios), e outras levarão mais tempo (por exemplo, ler arquivos maiores ou não armazenados em cache, ou gerar mais bytes aleatórios). Seu objetivo deve ser minimizar a variação nos tempos das Tarefas, e você deve usar o particionamento de Tarefas para realizar isso.

#### Minimizando a variação nos tempos das Tarefas

Se a Tarefa atual de um Worker for muito mais dispendiosa do que outras Tarefas, então ele não estará disponível para trabalhar em outras Tarefas pendentes. Em outras palavras, cada Tarefa relativamente longa efetivamente diminui o tamanho do Worker Pool em um até que seja concluída. Isso é indesejável porque, até certo ponto, quanto mais Workers no Worker Pool, maior o throughput do Worker Pool (tarefas/segundo) e, portanto, maior o throughput do servidor (solicitações de clientes/segundo). Um cliente com uma Tarefa relativamente dispendiosa diminuirá o throughput do Worker Pool, diminuindo por sua vez o throughput do servidor.

Para evitar isso, você deve tentar minimizar a variação na duração das Tarefas que você envia para o Worker Pool. Embora seja apropriado tratar os sistemas externos acessados por suas solicitações de I/O (DB, FS, etc.) como caixas pretas, você deve estar ciente do custo relativo dessas solicitações de I/O e deve evitar enviar solicitações que você pode esperar que sejam particularmente longas.

Dois exemplos devem ilustrar a possível variação nos tempos das tarefas.


#### Exemplo de variação: Leituras de sistema de arquivos de longa duração

Suponha que seu servidor precise ler arquivos para lidar com algumas solicitações de clientes. Após consultar as APIs do Node.js [Sistema de arquivos](/pt/nodejs/api/fs), você optou por usar `fs.readFile()` por simplicidade. No entanto, `fs.readFile()` (atualmente) não é particionado: ele envia uma única Tarefa `fs.read()` abrangendo todo o arquivo. Se você ler arquivos mais curtos para alguns usuários e arquivos mais longos para outros, `fs.readFile()` pode introduzir uma variação significativa nos comprimentos das Tarefas, em detrimento do rendimento do Pool de Workers.

Para um cenário de pior caso, suponha que um invasor possa convencer seu servidor a ler um arquivo arbitrário (esta é uma [vulnerabilidade de path traversal](https://www.owasp.org/index.php/Path_Traversal)). Se seu servidor estiver executando Linux, o invasor pode nomear um arquivo extremamente lento: `/dev/random`. Para todos os fins práticos, `/dev/random` é infinitamente lento, e cada Worker solicitado a ler de `/dev/random` nunca terminará essa Tarefa. Um invasor então envia k solicitações, uma para cada Worker, e nenhuma outra solicitação de cliente que use o Pool de Workers progredirá.

#### Exemplo de variação: Operações criptográficas de longa duração

Suponha que seu servidor gere bytes aleatórios criptograficamente seguros usando `crypto.randomBytes()`. `crypto.randomBytes()` não é particionado: ele cria uma única Tarefa `randomBytes()` para gerar tantos bytes quanto você solicitou. Se você criar menos bytes para alguns usuários e mais bytes para outros, `crypto.randomBytes()` é outra fonte de variação nos comprimentos das Tarefas.

### Particionamento de tarefas

Tarefas com custos de tempo variáveis ​​podem prejudicar o rendimento do Pool de Workers. Para minimizar a variação nos tempos das Tarefas, tanto quanto possível, você deve particionar cada Tarefa em sub-Tarefas de custo comparável. Quando cada sub-Tarefa for concluída, ela deve enviar a próxima sub-Tarefa e, quando a sub-Tarefa final for concluída, ela deve notificar o remetente.

Para continuar o exemplo `fs.readFile()`, você deve usar `fs.read()` (particionamento manual) ou `ReadStream` (particionado automaticamente).

O mesmo princípio se aplica a tarefas vinculadas à CPU; o exemplo `asyncAvg` pode ser inadequado para o Event Loop, mas é adequado para o Pool de Workers.

Quando você particiona uma Tarefa em sub-Tarefas, Tarefas mais curtas se expandem em um pequeno número de sub-Tarefas, e Tarefas mais longas se expandem em um número maior de sub-Tarefas. Entre cada sub-Tarefa de uma Tarefa mais longa, o Worker ao qual ela foi atribuída pode trabalhar em uma sub-Tarefa de outra Tarefa mais curta, melhorando assim o rendimento geral da Tarefa do Pool de Workers.

Observe que o número de sub-Tarefas concluídas não é uma métrica útil para o rendimento do Pool de Workers. Em vez disso, preocupe-se com o número de Tarefas concluídas.


### Evitando o particionamento de tarefas

Lembre-se que o propósito do particionamento de tarefas é minimizar a variação nos tempos das tarefas. Se você puder distinguir entre tarefas mais curtas e tarefas mais longas (por exemplo, somar um array versus ordenar um array), você pode criar um Worker Pool para cada classe de tarefa. Roteamento de tarefas mais curtas e tarefas mais longas para Worker Pools separados é outra forma de minimizar a variação do tempo da tarefa.

Em favor desta abordagem, o particionamento de tarefas acarreta sobrecarga (os custos de criar uma representação de tarefa do Worker Pool e de manipular a fila do Worker Pool), e evitar o particionamento economiza os custos de viagens adicionais ao Worker Pool. Também evita que você cometa erros ao particionar suas tarefas.

A desvantagem desta abordagem é que os Workers em todos esses Worker Pools incorrerão em sobrecargas de espaço e tempo e competirão entre si por tempo de CPU. Lembre-se que cada tarefa ligada à CPU só progride enquanto está agendada. Como resultado, você só deve considerar esta abordagem após uma análise cuidadosa.

### Worker Pool: conclusões

Se você usar apenas o Node.js Worker Pool ou manter Worker Pool(s) separados, você deve otimizar o throughput de tarefas do(s) seu(s) Pool(s).

Para fazer isso, minimize a variação nos tempos das tarefas usando o particionamento de tarefas.

## Os riscos dos módulos npm

Embora os módulos principais do Node.js ofereçam blocos de construção para uma ampla variedade de aplicativos, às vezes algo mais é necessário. Os desenvolvedores do Node.js se beneficiam enormemente do ecossistema npm, com centenas de milhares de módulos que oferecem funcionalidades para acelerar seu processo de desenvolvimento.

Lembre-se, no entanto, que a maioria desses módulos são escritos por desenvolvedores terceirizados e geralmente são lançados com apenas as melhores garantias de esforço. Um desenvolvedor que usa um módulo npm deve se preocupar com duas coisas, embora a última seja frequentemente esquecida.

1. Ele honra suas APIs?
2. Suas APIs podem bloquear o Event Loop ou um Worker? Muitos módulos não fazem nenhum esforço para indicar o custo de suas APIs, para detrimento da comunidade.

Para APIs simples, você pode estimar o custo das APIs; o custo da manipulação de strings não é difícil de entender. Mas em muitos casos, não está claro quanto uma API pode custar.

Se você estiver chamando uma API que pode fazer algo caro, verifique o custo. Peça aos desenvolvedores para documentá-lo, ou examine o código-fonte você mesmo (e envie um PR documentando o custo).

Lembre-se, mesmo que a API seja assíncrona, você não sabe quanto tempo ela pode gastar em um Worker ou no Event Loop em cada uma de suas partições. Por exemplo, suponha que no exemplo `asyncAvg` fornecido acima, cada chamada para a função auxiliar somasse metade dos números em vez de um deles. Então, esta função ainda seria assíncrona, mas o custo de cada partição seria `O(n)`, não `O(1)`, tornando-a muito menos segura para usar para valores arbitrários de `n`.


## Conclusão

Node.js tem dois tipos de threads: um Event Loop e k Workers. O Event Loop é responsável por callbacks JavaScript e I/O não bloqueante, e um Worker executa tarefas correspondentes ao código C++ que completa uma requisição assíncrona, incluindo I/O bloqueante e trabalho intensivo em CPU. Ambos os tipos de threads trabalham em não mais que uma atividade por vez. Se qualquer callback ou tarefa levar muito tempo, a thread que a executa fica bloqueada. Se sua aplicação faz callbacks ou tarefas bloqueantes, isso pode levar a uma taxa de transferência degradada (clientes/segundo) no melhor dos casos, e a uma completa negação de serviço no pior.

Para escrever um servidor web de alta taxa de transferência e mais à prova de DoS, você deve garantir que, tanto em entradas benignas quanto maliciosas, nem seu Event Loop nem seus Workers sejam bloqueados.

