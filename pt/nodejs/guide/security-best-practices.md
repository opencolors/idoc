---
title: Melhores práticas de segurança para aplicações Node.js
description: Um guia completo para proteger aplicações Node.js, abordando a modelagem de ameaças, as melhores práticas e a mitigação de vulnerabilidades comuns como a negação de serviço, o rebinding de DNS e a exposição de informações sensíveis.
head:
  - - meta
    - name: og:title
      content: Melhores práticas de segurança para aplicações Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Um guia completo para proteger aplicações Node.js, abordando a modelagem de ameaças, as melhores práticas e a mitigação de vulnerabilidades comuns como a negação de serviço, o rebinding de DNS e a exposição de informações sensíveis.
  - - meta
    - name: twitter:title
      content: Melhores práticas de segurança para aplicações Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Um guia completo para proteger aplicações Node.js, abordando a modelagem de ameaças, as melhores práticas e a mitigação de vulnerabilidades comuns como a negação de serviço, o rebinding de DNS e a exposição de informações sensíveis.
---


# Melhores Práticas de Segurança

### Intenção

Este documento tem a intenção de estender o atual [modelo de ameaças](/pt/nodejs/guide/security-best-practices#threat-model) e fornecer diretrizes extensivas sobre como proteger uma aplicação Node.js.

## Conteúdo do Documento

- Melhores práticas: Uma maneira simplificada e condensada de ver as melhores práticas. Podemos usar [esta issue](https://github.com/nodejs/security-wg/issues/488) ou [esta diretriz](https://github.com/goldbergyoni/nodebestpractices) como ponto de partida. É importante notar que este documento é específico para Node.js, se você está procurando algo mais amplo, considere as [Melhores Práticas da OSSF](https://github.com/ossf/wg-best-practices-os-developers).
- Ataques explicados: ilustrar e documentar em inglês simples com alguns exemplos de código (se possível) dos ataques que estamos mencionando no modelo de ameaças.
- Bibliotecas de Terceiros: definir ameaças (ataques de typosquatting, pacotes maliciosos...) e melhores práticas em relação a dependências de módulos node, etc...

## Lista de Ameaças

### Negação de Serviço do servidor HTTP (CWE-400)

Este é um ataque onde a aplicação se torna indisponível para o propósito para o qual foi projetada devido à forma como processa as requisições HTTP recebidas. Estas requisições não precisam ser deliberadamente criadas por um ator malicioso: um cliente mal configurado ou com bugs também pode enviar um padrão de requisições para o servidor que resultam em uma negação de serviço.

As requisições HTTP são recebidas pelo servidor HTTP do Node.js e entregues ao código da aplicação através do manipulador de requisições registrado. O servidor não analisa o conteúdo do corpo da requisição. Portanto, qualquer DoS causado pelo conteúdo do corpo após ser entregue ao manipulador de requisições não é uma vulnerabilidade no Node.js em si, já que é responsabilidade do código da aplicação lidar com isso corretamente.

Certifique-se de que o WebServer lida com erros de socket adequadamente, por exemplo, quando um servidor é criado sem um manipulador de erros, ele estará vulnerável a DoS.

```javascript
import net from 'node:net'
const server = net.createServer(socket => {
  // socket.on('error', console.error) // isso impede que o servidor quebre
  socket.write('Echo server\r\n')
  socket.pipe(socket)
})
server.listen(5000, '0.0.0.0')
```

_Se uma requisição ruim for realizada, o servidor pode quebrar._

Um exemplo de um ataque DoS que não é causado pelo conteúdo da requisição é o Slowloris. Neste ataque, as requisições HTTP são enviadas lentamente e fragmentadas, um fragmento de cada vez. Até que a requisição completa seja entregue, o servidor manterá recursos dedicados à requisição em andamento. Se um número suficiente dessas requisições forem enviadas ao mesmo tempo, a quantidade de conexões concorrentes logo atingirá seu máximo, resultando em uma negação de serviço. É assim que o ataque depende não do conteúdo da requisição, mas do tempo e do padrão das requisições que estão sendo enviadas ao servidor.


#### Mitigações

- Use um proxy reverso para receber e encaminhar as requisições para a aplicação Node.js. Proxies reversos podem fornecer caching, balanceamento de carga, listas negras de IP, etc., o que reduz a probabilidade de um ataque DoS ser eficaz.
- Configure corretamente os timeouts do servidor, de modo que as conexões que estão ociosas ou onde as requisições estão chegando muito lentamente possam ser descartadas. Veja os diferentes timeouts em `http.Server`, particularmente `headersTimeout`, `requestTimeout`, `timeout` e `keepAliveTimeout`.
- Limite o número de sockets abertos por host e no total. Veja os [docs do http](/pt/nodejs/api/http), particularmente `agent.maxSockets`, `agent.maxTotalSockets`, `agent.maxFreeSockets` e `server.maxRequestsPerSocket`.

### Redirecionamento de DNS (CWE-346)

Este é um ataque que pode ter como alvo aplicações Node.js que estão sendo executadas com o inspetor de depuração habilitado usando a opção [--inspect switch](/pt/nodejs/guide/debugging-nodejs).

Como os sites abertos em um navegador da web podem fazer requisições WebSocket e HTTP, eles podem ter como alvo o inspetor de depuração em execução localmente. Isso geralmente é evitado pela [política de mesma origem](/pt/nodejs/guide/debugging-nodejs) implementada pelos navegadores modernos, que proíbe que scripts alcancem recursos de diferentes origens (o que significa que um site malicioso não pode ler dados solicitados de um endereço IP local).

No entanto, por meio do redirecionamento de DNS, um invasor pode controlar temporariamente a origem de suas requisições para que pareçam originar-se de um endereço IP local. Isso é feito controlando tanto um site quanto o servidor DNS usado para resolver seu endereço IP. Veja [DNS Rebinding wiki](https://en.wikipedia.org/wiki/DNS_rebinding) para mais detalhes.

#### Mitigações

- Desabilite o inspetor no sinal SIGUSR1 anexando um listener `process.on(‘SIGUSR1’, …)` a ele.
- Não execute o protocolo do inspetor em produção.

### Exposição de Informações Sensíveis a um Ator Não Autorizado (CWE-552)

Todos os arquivos e pastas incluídos no diretório atual são enviados para o registro npm durante a publicação do pacote.

Existem alguns mecanismos para controlar esse comportamento definindo uma lista de bloqueio com `.npmignore` e `.gitignore` ou definindo uma lista de permissões no `package.json`.


#### Mitigações

- Usar `npm publish --dry-run` para listar todos os arquivos a serem publicados. Certifique-se de revisar o conteúdo antes de publicar o pacote.
- Também é importante criar e manter arquivos de ignorar, como `.gitignore` e `.npmignore`. Nestes arquivos, você pode especificar quais arquivos/pastas não devem ser publicados. A [propriedade files](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#files) em `package.json` permite a operação inversa `-- lista permitida`.
- Em caso de exposição, certifique-se de [cancelar a publicação do pacote](https://docs.npmjs.com/unpublishing-packages-from-the-registry).

### Ataque de Contrabando de Requisição HTTP (CWE-444)

Este é um ataque que envolve dois servidores HTTP (geralmente um proxy e uma aplicação Node.js). Um cliente envia uma requisição HTTP que passa primeiro pelo servidor front-end (o proxy) e então é redirecionada para o servidor back-end (a aplicação). Quando o front-end e o back-end interpretam requisições HTTP ambíguas de forma diferente, existe o potencial para um atacante enviar uma mensagem maliciosa que não será vista pelo front-end, mas será vista pelo back-end, efetivamente "contrabandeando-a" pelo servidor proxy.

Veja o [CWE-444](https://cwe.mitre.org/data/definitions/444.html) para uma descrição mais detalhada e exemplos.

Como este ataque depende do Node.js interpretar as requisições HTTP de forma diferente de um servidor HTTP (arbitrário), um ataque bem-sucedido pode ser devido a uma vulnerabilidade no Node.js, no servidor front-end ou em ambos. Se a forma como a requisição é interpretada pelo Node.js é consistente com a especificação HTTP (veja [RFC7230](https://datatracker.ietf.org/doc/html/rfc7230#section-3)), então não é considerada uma vulnerabilidade no Node.js.

#### Mitigações

- Não use a opção `insecureHTTPParser` ao criar um Servidor HTTP.
- Configure o servidor front-end para normalizar requisições ambíguas.
- Monitore continuamente novas vulnerabilidades de contrabando de requisição HTTP tanto no Node.js quanto no servidor front-end de sua escolha.
- Use HTTP/2 de ponta a ponta e desative o downgrade de HTTP, se possível.


### Exposição de Informações Através de Ataques de Tempo (CWE-208)

Este é um ataque que permite ao atacante aprender informações potencialmente sensíveis, por exemplo, medindo quanto tempo leva para o aplicativo responder a uma solicitação. Este ataque não é específico do Node.js e pode ter como alvo quase todos os tempos de execução.

O ataque é possível sempre que o aplicativo usa um segredo em uma operação sensível ao tempo (por exemplo, branch). Considere o tratamento da autenticação em um aplicativo típico. Aqui, um método de autenticação básico inclui e-mail e senha como credenciais. As informações do usuário são recuperadas da entrada fornecida pelo usuário, idealmente de um SGBD. Ao recuperar as informações do usuário, a senha é comparada com as informações do usuário recuperadas do banco de dados. O uso da comparação de strings integrada leva mais tempo para valores de mesmo comprimento. Essa comparação, quando executada por um tempo aceitável, aumenta involuntariamente o tempo de resposta da solicitação. Ao comparar os tempos de resposta da solicitação, um invasor pode adivinhar o comprimento e o valor da senha em uma grande quantidade de solicitações.

#### Mitigações

- A API crypto expõe uma função `timingSafeEqual` para comparar valores sensíveis reais e esperados usando um algoritmo de tempo constante.
- Para comparação de senhas, você pode usar o [scrypt](/pt/nodejs/api/crypto) também disponível no módulo crypto nativo.
- De forma mais geral, evite usar segredos em operações de tempo variável. Isso inclui ramificação em segredos e, quando o invasor pode estar co-localizado na mesma infraestrutura (por exemplo, a mesma máquina na nuvem), usar um segredo como um índice na memória. Escrever código de tempo constante em JavaScript é difícil (em parte por causa do JIT). Para aplicações criptográficas, use as APIs criptográficas integradas ou WebAssembly (para algoritmos não implementados nativamente).

### Módulos Maliciosos de Terceiros (CWE-1357)

Atualmente, no Node.js, qualquer pacote pode acessar recursos poderosos, como acesso à rede. Além disso, como também têm acesso ao sistema de arquivos, podem enviar qualquer dado para qualquer lugar.

Todo o código em execução em um processo node tem a capacidade de carregar e executar código arbitrário adicional usando `eval()` (ou seus equivalentes). Todo o código com acesso de gravação ao sistema de arquivos pode conseguir a mesma coisa gravando em arquivos novos ou existentes que são carregados.

O Node.js possui um [mecanismo de política](/pt/nodejs/api/permissions) experimental¹ para declarar o recurso carregado como não confiável ou confiável. No entanto, esta política não está habilitada por padrão. Certifique-se de fixar as versões das dependências e execute verificações automáticas de vulnerabilidades usando fluxos de trabalho comuns ou scripts npm. Antes de instalar um pacote, certifique-se de que este pacote seja mantido e inclua todo o conteúdo que você esperava. Tenha cuidado, o código-fonte do GitHub nem sempre é o mesmo que o publicado, valide-o em `node_modules`.


#### Ataques à cadeia de fornecimento

Um ataque à cadeia de fornecimento em uma aplicação Node.js acontece quando uma de suas dependências (direta ou transitiva) é comprometida. Isso pode acontecer devido à aplicação ser muito permissiva na especificação das dependências (permitindo atualizações indesejadas) e/ou erros de digitação comuns na especificação (vulnerável a [typosquatting](https://en.wikipedia.org/wiki/Typosquatting)).

Um atacante que assume o controle de um pacote upstream pode publicar uma nova versão com código malicioso. Se uma aplicação Node.js depende desse pacote sem ser rigorosa sobre qual versão é segura para uso, o pacote pode ser automaticamente atualizado para a versão maliciosa mais recente, comprometendo a aplicação.

As dependências especificadas no arquivo `package.json` podem ter um número de versão exato ou um intervalo. No entanto, ao fixar uma dependência em uma versão exata, suas dependências transitivas não são fixadas. Isso ainda deixa a aplicação vulnerável a atualizações indesejadas/inesperadas.

Possíveis vetores de ataque:

- Ataques de Typosquatting
- Envenenamento de lockfile
- Mantenedores comprometidos
- Pacotes Maliciosos
- Confusões de Dependência

##### Mitigações

- Impeça o npm de executar scripts arbitrários com `--ignore-scripts`
  - Adicionalmente, você pode desabilitá-lo globalmente com `npm config set ignore-scripts true`
- Fixe as versões das dependências para uma versão imutável específica, não uma versão que seja um intervalo ou de uma fonte mutável.
- Use lockfiles, que fixam todas as dependências (diretas e transitivas).
  - Use [Mitigações para envenenamento de lockfile](https://blog.ulisesgascon.com/lockfile-posioned).
- Automatize verificações para novas vulnerabilidades usando CI, com ferramentas como [npm-audit](https://www.npmjs.com/package/npm-audit).
  - Ferramentas como `Socket` podem ser usadas para analisar pacotes com análise estática para encontrar comportamentos arriscados, como acesso à rede ou ao sistema de arquivos.
- Use `npm ci` em vez de `npm install`. Isso impõe o lockfile, de modo que inconsistências entre ele e o arquivo `package.json` causam um erro (em vez de ignorar silenciosamente o lockfile em favor de `package.json`).
- Verifique cuidadosamente o arquivo `package.json` em busca de erros/erros de digitação nos nomes das dependências.


### Violação de Acesso à Memória (CWE-284)

Ataques baseados em memória ou em heap dependem de uma combinação de erros de gerenciamento de memória e um alocador de memória explorável. Como todos os runtimes, o Node.js é vulnerável a esses ataques se seus projetos forem executados em uma máquina compartilhada. Usar um heap seguro é útil para evitar que informações confidenciais vazem devido a estouros e underuns de ponteiros.

Infelizmente, um heap seguro não está disponível no Windows. Mais informações podem ser encontradas na [documentação secure-heap](/pt/nodejs/api/cli) do Node.js.

#### Mitigações

- Use `--secure-heap=n` dependendo do seu aplicativo, onde n é o tamanho máximo alocado em bytes.
- Não execute seu aplicativo de produção em uma máquina compartilhada.

### Monkey Patching (CWE-349)

Monkey patching refere-se à modificação de propriedades em tempo de execução com o objetivo de alterar o comportamento existente. Exemplo:

```js
// eslint-disable-next-line no-extend-native
Array.prototype.push = function (item) {
  // substituindo o [].push global
}
```

#### Mitigações

A flag `--frozen-intrinsics` habilita intrinsics congelados experimentais¹, o que significa que todos os objetos e funções JavaScript integrados são congelados recursivamente. Portanto, o seguinte trecho não substituirá o comportamento padrão de `Array.prototype.push`

```js
// eslint-disable-next-line no-extend-native
Array.prototype.push = function (item) {
  // substituindo o [].push global
}
// Não capturado:
// TypeError <Object <Object <[Object: null prototype] {}>>>:
// Não é possível atribuir à propriedade somente leitura 'push' do objeto '
```

No entanto, é importante mencionar que você ainda pode definir novos globais e substituir os globais existentes usando `globalThis`

```bash
globalThis.foo = 3; foo; // você ainda pode definir novos globais 3
globalThis.Array = 4; Array; // No entanto, você também pode substituir os globais existentes 4
```

Portanto, `Object.freeze(globalThis)` pode ser usado para garantir que nenhum global seja substituído.

### Ataques de Poluição de Protótipos (CWE-1321)

Poluição de protótipos refere-se à possibilidade de modificar ou injetar propriedades em itens da linguagem JavaScript, abusando do uso de \__proto_, \_constructor, prototype e outras propriedades herdadas de protótipos integrados.

```js
const a = { a: 1, b: 2 }
const data = JSON.parse('{"__proto__": { "polluted": true}}')
const c = Object.assign({}, a, data)
console.log(c.polluted) // true
// DoS Potencial
const data2 = JSON.parse('{"__proto__": null}')
const d = Object.assign(a, data2)
d.hasOwnProperty('b') // TypeError não capturado: d.hasOwnProperty não é uma função
```

Esta é uma vulnerabilidade potencial herdada da linguagem JavaScript.


#### Exemplos

- [CVE-2022-21824](https://www.cvedetails.com/cve/CVE-2022-21824/) (Node.js)
- [CVE-2018-3721](https://www.cvedetails.com/cve/CVE-2018-3721/) (Biblioteca de Terceiros: Lodash)

#### Mitigações

- Evite [mesclagens recursivas inseguras](https://gist.github.com/DaniAkash/b3d7159fddcff0a9ee035bd10e34b277#file-unsafe-merge-js), veja [CVE-2018-16487](https://www.cve.org/CVERecord?id=CVE-2018-16487).
- Implemente validações de Esquema JSON para requisições externas/não confiáveis.
- Crie Objetos sem protótipo usando `Object.create(null)`.
- Congelando o protótipo: `Object.freeze(MyObject.prototype)`.
- Desabilite a propriedade `Object.prototype.__proto__` usando a flag `--disable-proto`.
- Verifique se a propriedade existe diretamente no objeto, não do protótipo usando `Object.hasOwn(obj, keyFromObj)`.
- Evite usar métodos de `Object.prototype`.

### Elemento de Caminho de Pesquisa Não Controlado (CWE-427)

Node.js carrega módulos seguindo o [Algoritmo de Resolução de Módulos](/pt/nodejs/api/modules). Portanto, ele assume que o diretório no qual um módulo é requisitado (require) é confiável.

Com isso, significa que o seguinte comportamento da aplicação é esperado. Assumindo a seguinte estrutura de diretório:

- app/
  - server.js
  - auth.js
  - auth

Se server.js usa `require('./auth')` ele seguirá o algoritmo de resolução de módulo e carregará auth ao invés de `auth.js`.

#### Mitigações

Usar o experimental¹ [mecanismo de política com verificação de integridade](/pt/nodejs/api/permissions) pode evitar a ameaça acima. Para o diretório descrito acima, pode-se usar o seguinte `policy.json`

```json
{
  "resources": {
    "./app/auth.js": {
      "integrity": "sha256-iuGZ6SFVFpMuHUcJciQTIKpIyaQVigMZlvg9Lx66HV8="
    },
    "./app/server.js": {
      "dependencies": {
        "./auth": "./app/auth.js"
      },
      "integrity": "sha256-NPtLCQ0ntPPWgfVEgX46ryTNpdvTWdQPoZO3kHo0bKI="
    }
  }
}
```

Portanto, ao requisitar o módulo auth, o sistema irá validar a integridade e lançar um erro se não corresponder ao esperado.

```bash
» node --experimental-policy=policy.json app/server.js
node:internal/policy/sri:65
      throw new ERR_SRI_PARSE(str, str[prevIndex], prevIndex);
      ^
SyntaxError [ERR_SRI_PARSE]: Subresource Integrity string "sha256-iuGZ6SFVFpMuHUcJciQTIKpIyaQVigMZlvg9Lx66HV8=%" had an unexpected "%" at position 51
    at new NodeError (node:internal/errors:393:5)
    at Object.parse (node:internal/policy/sri:65:13)
    at processEntry (node:internal/policy/manifest:581:38)
    at Manifest.assertIntegrity (node:internal/policy/manifest:588:32)
    at Module._compile (node:internal/modules/cjs/loader:1119:21)
    at Module._extensions..js (node:internal/modules/cjs/loader:1213:10)
    at Module.load (node:internal/modules/cjs/loader:1037:32)
    at Module._load (node:internal/modules/cjs/loader:878:12)
    at Module.require (node:internal/modules/cjs/loader:1061:19)
    at require (node:internal/modules/cjs/helpers:99:18) {
  code: 'ERR_SRI_PARSE'
}
```

Note, é sempre recomendado o uso de `--policy-integrity` para evitar mutações na política.


## Funcionalidades Experimentais em Produção

O uso de funcionalidades experimentais em produção não é recomendado. Funcionalidades experimentais podem sofrer alterações que quebram a compatibilidade, se necessário, e sua funcionalidade não é seguramente estável. No entanto, o feedback é muito apreciado.

## Ferramentas OpenSSF

O [OpenSSF](https://www.openssf.org) está liderando várias iniciativas que podem ser muito úteis, especialmente se você planeja publicar um pacote npm. Essas iniciativas incluem:

- [OpenSSF Scorecard](https://securityscorecards.dev/) Scorecard avalia projetos de código aberto usando uma série de verificações automatizadas de risco de segurança. Você pode usá-lo para avaliar proativamente vulnerabilidades e dependências em sua base de código e tomar decisões informadas sobre a aceitação de vulnerabilidades.
- [OpenSSF Best Practices Badge Program](https://bestpractices.coreinfrastructure.org/en) Projetos podem se auto-certificar voluntariamente descrevendo como eles cumprem cada prática recomendada. Isso gerará um selo que pode ser adicionado ao projeto.

