---
title: Documentação do Node.js - TLS (Segurança da Camada de Transporte)
description: Esta seção da documentação do Node.js aborda o módulo TLS (Segurança da Camada de Transporte), que fornece uma implementação dos protocolos TLS e SSL. Inclui detalhes sobre a criação de conexões seguras, gerenciamento de certificados, tratamento de comunicação segura e várias opções para configurar TLS/SSL em aplicações Node.js.
head:
  - - meta
    - name: og:title
      content: Documentação do Node.js - TLS (Segurança da Camada de Transporte) | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Esta seção da documentação do Node.js aborda o módulo TLS (Segurança da Camada de Transporte), que fornece uma implementação dos protocolos TLS e SSL. Inclui detalhes sobre a criação de conexões seguras, gerenciamento de certificados, tratamento de comunicação segura e várias opções para configurar TLS/SSL em aplicações Node.js.
  - - meta
    - name: twitter:title
      content: Documentação do Node.js - TLS (Segurança da Camada de Transporte) | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Esta seção da documentação do Node.js aborda o módulo TLS (Segurança da Camada de Transporte), que fornece uma implementação dos protocolos TLS e SSL. Inclui detalhes sobre a criação de conexões seguras, gerenciamento de certificados, tratamento de comunicação segura e várias opções para configurar TLS/SSL em aplicações Node.js.
---


# TLS (SSL) {#tls-ssl}

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável
:::

**Código Fonte:** [lib/tls.js](https://github.com/nodejs/node/blob/v23.5.0/lib/tls.js)

O módulo `node:tls` fornece uma implementação dos protocolos Transport Layer Security (TLS) e Secure Socket Layer (SSL) que é construída sobre o OpenSSL. O módulo pode ser acessado usando:

::: code-group
```js [ESM]
import tls from 'node:tls';
```

```js [CJS]
const tls = require('node:tls');
```
:::

## Determinar se o suporte à criptografia não está disponível {#determining-if-crypto-support-is-unavailable}

É possível que o Node.js seja construído sem incluir suporte ao módulo `node:crypto`. Nesses casos, tentar `import` de `tls` ou chamar `require('node:tls')` resultará em um erro sendo lançado.

Ao usar CommonJS, o erro lançado pode ser capturado usando try/catch:

```js [CJS]
let tls;
try {
  tls = require('node:tls');
} catch (err) {
  console.error('o suporte a tls está desabilitado!');
}
```
Ao usar a palavra-chave léxica ESM `import`, o erro só pode ser capturado se um manipulador para `process.on('uncaughtException')` for registrado *antes* de qualquer tentativa de carregar o módulo ser feita (usando, por exemplo, um módulo de pré-carregamento).

Ao usar ESM, se houver uma chance de que o código possa ser executado em uma build do Node.js onde o suporte à criptografia não está habilitado, considere usar a função [`import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) em vez da palavra-chave léxica `import`:

```js [ESM]
let tls;
try {
  tls = await import('node:tls');
} catch (err) {
  console.error('o suporte a tls está desabilitado!');
}
```
## Conceitos de TLS/SSL {#tls/ssl-concepts}

TLS/SSL é um conjunto de protocolos que dependem de uma infraestrutura de chave pública (PKI) para permitir a comunicação segura entre um cliente e um servidor. Para os casos mais comuns, cada servidor deve ter uma chave privada.

Chaves privadas podem ser geradas de várias maneiras. O exemplo abaixo ilustra o uso da interface de linha de comando do OpenSSL para gerar uma chave privada RSA de 2048 bits:

```bash [BASH]
openssl genrsa -out ryans-key.pem 2048
```
Com TLS/SSL, todos os servidores (e alguns clientes) devem ter um *certificado*. Certificados são *chaves públicas* que correspondem a uma chave privada e que são assinadas digitalmente por uma Autoridade de Certificação ou pelo proprietário da chave privada (tais certificados são referidos como "autoassinados"). O primeiro passo para obter um certificado é criar um arquivo de *Solicitação de Assinatura de Certificado* (CSR).

A interface de linha de comando do OpenSSL pode ser usada para gerar um CSR para uma chave privada:

```bash [BASH]
openssl req -new -sha256 -key ryans-key.pem -out ryans-csr.pem
```
Uma vez que o arquivo CSR é gerado, ele pode ser enviado para uma Autoridade de Certificação para assinatura ou usado para gerar um certificado autoassinado.

A criação de um certificado autoassinado usando a interface de linha de comando do OpenSSL é ilustrada no exemplo abaixo:

```bash [BASH]
openssl x509 -req -in ryans-csr.pem -signkey ryans-key.pem -out ryans-cert.pem
```
Uma vez que o certificado é gerado, ele pode ser usado para gerar um arquivo `.pfx` ou `.p12`:

```bash [BASH]
openssl pkcs12 -export -in ryans-cert.pem -inkey ryans-key.pem \
      -certfile ca-cert.pem -out ryans.pfx
```
Onde:

- `in`: é o certificado assinado
- `inkey`: é a chave privada associada
- `certfile`: é uma concatenação de todos os certificados da Autoridade de Certificação (CA) em um único arquivo, por exemplo, `cat ca1-cert.pem ca2-cert.pem \> ca-cert.pem`


### Sigilo de encaminhamento perfeito {#perfect-forward-secrecy}

O termo *<a href="https://en.wikipedia.org/wiki/Perfect_forward_secrecy">sigilo de encaminhamento</a>* ou *sigilo de encaminhamento perfeito* descreve uma característica dos métodos de acordo de chaves (isto é, troca de chaves). Ou seja, as chaves do servidor e do cliente são usadas para negociar novas chaves temporárias que são usadas especificamente e apenas para a sessão de comunicação atual. Na prática, isso significa que, mesmo que a chave privada do servidor seja comprometida, a comunicação só pode ser descriptografada por bisbilhoteiros se o invasor conseguir obter o par de chaves gerado especificamente para a sessão.

O sigilo de encaminhamento perfeito é alcançado gerando aleatoriamente um par de chaves para o acordo de chaves em cada handshake TLS/SSL (em contraste com o uso da mesma chave para todas as sessões). Os métodos que implementam esta técnica são chamados de "efêmeros".

Atualmente, dois métodos são comumente usados para alcançar o sigilo de encaminhamento perfeito (observe o caractere "E" anexado às abreviações tradicionais):

- [ECDHE](https://en.wikipedia.org/wiki/Elliptic_curve_Diffie%E2%80%93Hellman): Uma versão efêmera do protocolo de acordo de chaves Elliptic Curve Diffie-Hellman.
- [DHE](https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange): Uma versão efêmera do protocolo de acordo de chaves Diffie-Hellman.

O sigilo de encaminhamento perfeito usando ECDHE é ativado por padrão. A opção `ecdhCurve` pode ser usada ao criar um servidor TLS para personalizar a lista de curvas ECDH suportadas a serem usadas. Veja [`tls.createServer()`](/pt/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener) para mais informações.

DHE está desativado por padrão, mas pode ser ativado junto com ECDHE definindo a opção `dhparam` para `'auto'`. Parâmetros DHE personalizados também são suportados, mas desencorajados em favor de parâmetros bem conhecidos selecionados automaticamente.

O sigilo de encaminhamento perfeito era opcional até o TLSv1.2. A partir do TLSv1.3, (EC)DHE é sempre usado (com exceção de conexões somente PSK).

### ALPN e SNI {#alpn-and-sni}

ALPN (Application-Layer Protocol Negotiation Extension) e SNI (Server Name Indication) são extensões de handshake TLS:

- ALPN: Permite o uso de um servidor TLS para múltiplos protocolos (HTTP, HTTP/2)
- SNI: Permite o uso de um servidor TLS para múltiplos nomes de host com diferentes certificados.


### Chaves pré-compartilhadas {#pre-shared-keys}

O suporte a TLS-PSK está disponível como uma alternativa à autenticação normal baseada em certificado. Ele usa uma chave pré-compartilhada em vez de certificados para autenticar uma conexão TLS, fornecendo autenticação mútua. TLS-PSK e infraestrutura de chave pública não são mutuamente exclusivas. Clientes e servidores podem acomodar ambos, escolhendo um deles durante a etapa normal de negociação de cifra.

TLS-PSK é uma boa escolha apenas onde existem meios para compartilhar com segurança uma chave com cada máquina conectada, portanto, não substitui a infraestrutura de chave pública (PKI) para a maioria dos usos de TLS. A implementação TLS-PSK no OpenSSL tem visto muitas falhas de segurança nos últimos anos, principalmente porque é usada apenas por uma minoria de aplicativos. Considere todas as soluções alternativas antes de mudar para cifras PSK. Ao gerar o PSK, é de importância crítica usar entropia suficiente, conforme discutido em [RFC 4086](https://tools.ietf.org/html/rfc4086). Derivar um segredo compartilhado de uma senha ou outras fontes de baixa entropia não é seguro.

As cifras PSK são desativadas por padrão e, portanto, o uso de TLS-PSK requer a especificação explícita de um conjunto de cifras com a opção `ciphers`. A lista de cifras disponíveis pode ser recuperada via `openssl ciphers -v 'PSK'`. Todas as cifras TLS 1.3 são elegíveis para PSK e podem ser recuperadas via `openssl ciphers -v -s -tls1_3 -psk`. Na conexão do cliente, um `checkServerIdentity` personalizado deve ser passado porque o padrão falhará na ausência de um certificado.

De acordo com a [RFC 4279](https://tools.ietf.org/html/rfc4279), identidades PSK de até 128 bytes de comprimento e PSKs de até 64 bytes de comprimento devem ser suportados. A partir do OpenSSL 1.1.0, o tamanho máximo da identidade é 128 bytes e o comprimento máximo do PSK é 256 bytes.

A implementação atual não oferece suporte a callbacks PSK assíncronos devido às limitações da API OpenSSL subjacente.

Para usar TLS-PSK, cliente e servidor devem especificar a opção `pskCallback`, uma função que retorna o PSK a ser usado (que deve ser compatível com o digest da cifra selecionada).

Ele será chamado primeiro no cliente:

- hint: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) mensagem opcional enviada do servidor para ajudar o cliente a decidir qual identidade usar durante a negociação. Sempre `null` se o TLS 1.3 for usado.
- Returns: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) no formato `{ psk: \<Buffer|TypedArray|DataView\>, identity: \<string\> }` ou `null`.

Então no servidor:

- socket: [\<tls.TLSSocket\>](/pt/nodejs/api/tls#class-tlstlssocket) a instância do socket do servidor, equivalente a `this`.
- identity: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) parâmetro de identidade enviado do cliente.
- Returns: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) o PSK (ou `null`).

Um valor de retorno de `null` interrompe o processo de negociação e envia uma mensagem de alerta `unknown_psk_identity` para a outra parte. Se o servidor deseja ocultar o fato de que a identidade PSK não era conhecida, o callback deve fornecer alguns dados aleatórios como `psk` para fazer com que a conexão falhe com `decrypt_error` antes que a negociação seja concluída.


### Mitigação de Ataques de Renegociação Iniciados pelo Cliente {#client-initiated-renegotiation-attack-mitigation}

O protocolo TLS permite que os clientes renegociem certos aspectos da sessão TLS. Infelizmente, a renegociação de sessão requer uma quantidade desproporcional de recursos do lado do servidor, tornando-a um vetor potencial para ataques de negação de serviço.

Para mitigar o risco, a renegociação é limitada a três vezes a cada dez minutos. Um evento `'error'` é emitido na instância [`tls.TLSSocket`](/pt/nodejs/api/tls#class-tlstlssocket) quando este limite é excedido. Os limites são configuráveis:

- `tls.CLIENT_RENEG_LIMIT` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica o número de solicitações de renegociação. **Padrão:** `3`.
- `tls.CLIENT_RENEG_WINDOW` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Especifica a janela de tempo de renegociação em segundos. **Padrão:** `600` (10 minutos).

Os limites de renegociação padrão não devem ser modificados sem uma compreensão completa das implicações e dos riscos.

TLSv1.3 não suporta renegociação.

### Retomada de Sessão {#session-resumption}

Estabelecer uma sessão TLS pode ser relativamente lento. O processo pode ser acelerado salvando e reutilizando posteriormente o estado da sessão. Existem vários mecanismos para fazer isso, discutidos aqui do mais antigo ao mais novo (e preferido).

#### Identificadores de Sessão {#session-identifiers}

Os servidores geram um ID exclusivo para novas conexões e o enviam ao cliente. Clientes e servidores salvam o estado da sessão. Ao reconectar, os clientes enviam o ID de seu estado de sessão salvo e, se o servidor também tiver o estado para esse ID, ele pode concordar em usá-lo. Caso contrário, o servidor criará uma nova sessão. Consulte [RFC 2246](https://www.ietf.org/rfc/rfc2246.txt) para obter mais informações, páginas 23 e 30.

A retomada usando identificadores de sessão é suportada pela maioria dos navegadores da web ao fazer solicitações HTTPS.

Para Node.js, os clientes aguardam o evento [`'session'`](/pt/nodejs/api/tls#event-session) para obter os dados da sessão e fornecem os dados para a opção `session` de um [`tls.connect()`](/pt/nodejs/api/tls#tlsconnectoptions-callback) subsequente para reutilizar a sessão. Os servidores devem implementar manipuladores para os eventos [`'newSession'`](/pt/nodejs/api/tls#event-newsession) e [`'resumeSession'`](/pt/nodejs/api/tls#event-resumesession) para salvar e restaurar os dados da sessão usando o ID da sessão como a chave de pesquisa para reutilizar as sessões. Para reutilizar sessões entre balanceadores de carga ou workers de cluster, os servidores devem usar um cache de sessão compartilhado (como o Redis) em seus manipuladores de sessão.


#### Tickets de Sessão {#session-tickets}

Os servidores criptografam todo o estado da sessão e o enviam ao cliente como um "ticket". Ao reconectar, o estado é enviado ao servidor na conexão inicial. Este mecanismo evita a necessidade de um cache de sessão no lado do servidor. Se o servidor não usar o ticket, por qualquer motivo (falha ao descriptografá-lo, está muito antigo, etc.), ele criará uma nova sessão e enviará um novo ticket. Veja [RFC 5077](https://tools.ietf.org/html/rfc5077) para mais informações.

A retomada usando tickets de sessão está se tornando comumente suportada por muitos navegadores da web ao fazer solicitações HTTPS.

Para Node.js, os clientes usam as mesmas APIs para retomada com identificadores de sessão como para retomada com tickets de sessão. Para depuração, se [`tls.TLSSocket.getTLSTicket()`](/pt/nodejs/api/tls#tlssocketgettlsticket) retornar um valor, os dados da sessão contêm um ticket, caso contrário, ele contém o estado da sessão no lado do cliente.

Com TLSv1.3, esteja ciente de que vários tickets podem ser enviados pelo servidor, resultando em vários eventos `'session'`, veja [`'session'`](/pt/nodejs/api/tls#event-session) para mais informações.

Servidores de processo único não precisam de nenhuma implementação específica para usar tickets de sessão. Para usar tickets de sessão entre reinicializações do servidor ou balanceadores de carga, os servidores devem ter as mesmas chaves de ticket. Existem três chaves de 16 bytes internamente, mas a API tls as expõe como um único buffer de 48 bytes para conveniência.

É possível obter as chaves do ticket chamando [`server.getTicketKeys()`](/pt/nodejs/api/tls#servergetticketkeys) em uma instância do servidor e, em seguida, distribuí-las, mas é mais razoável gerar com segurança 48 bytes de dados aleatórios seguros e configurá-los com a opção `ticketKeys` de [`tls.createServer()`](/pt/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener). As chaves devem ser regeneradas regularmente e as chaves do servidor podem ser redefinidas com [`server.setTicketKeys()`](/pt/nodejs/api/tls#serversetticketkeyskeys).

As chaves do ticket de sessão são chaves criptográficas e *<strong>devem ser armazenadas com segurança</strong>*. Com TLS 1.2 e abaixo, se forem comprometidas, todas as sessões que usaram tickets criptografados com elas podem ser descriptografadas. Elas não devem ser armazenadas no disco e devem ser regeneradas regularmente.

Se os clientes anunciarem suporte para tickets, o servidor os enviará. O servidor pode desativar os tickets fornecendo `require('node:constants').SSL_OP_NO_TICKET` em `secureOptions`.

Tanto os identificadores de sessão quanto os tickets de sessão expiram, fazendo com que o servidor crie novas sessões. O tempo limite pode ser configurado com a opção `sessionTimeout` de [`tls.createServer()`](/pt/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener).

Para todos os mecanismos, quando a retomada falha, os servidores criarão novas sessões. Como a falha ao retomar a sessão não causa falhas na conexão TLS/HTTPS, é fácil não notar um desempenho TLS desnecessariamente ruim. A CLI OpenSSL pode ser usada para verificar se os servidores estão retomando as sessões. Use a opção `-reconnect` para `openssl s_client`, por exemplo:

```bash [BASH]
openssl s_client -connect localhost:443 -reconnect
```
Leia a saída de depuração. A primeira conexão deve dizer "New", por exemplo:

```text [TEXT]
New, TLSv1.2, Cipher is ECDHE-RSA-AES128-GCM-SHA256
```
As conexões subsequentes devem dizer "Reused", por exemplo:

```text [TEXT]
Reused, TLSv1.2, Cipher is ECDHE-RSA-AES128-GCM-SHA256
```

## Modificando o conjunto de cifras TLS padrão {#modifying-the-default-tls-cipher-suite}

O Node.js é construído com um conjunto padrão de cifras TLS habilitadas e desabilitadas. Essa lista de cifras padrão pode ser configurada ao construir o Node.js para permitir que as distribuições forneçam sua própria lista padrão.

O seguinte comando pode ser usado para mostrar o conjunto de cifras padrão:

```bash [BASH]
node -p crypto.constants.defaultCoreCipherList | tr ':' '\n'
TLS_AES_256_GCM_SHA384
TLS_CHACHA20_POLY1305_SHA256
TLS_AES_128_GCM_SHA256
ECDHE-RSA-AES128-GCM-SHA256
ECDHE-ECDSA-AES128-GCM-SHA256
ECDHE-RSA-AES256-GCM-SHA384
ECDHE-ECDSA-AES256-GCM-SHA384
DHE-RSA-AES128-GCM-SHA256
ECDHE-RSA-AES128-SHA256
DHE-RSA-AES128-SHA256
ECDHE-RSA-AES256-SHA384
DHE-RSA-AES256-SHA384
ECDHE-RSA-AES256-SHA256
DHE-RSA-AES256-SHA256
HIGH
!aNULL
!eNULL
!EXPORT
!DES
!RC4
!MD5
!PSK
!SRP
!CAMELLIA
```
Este padrão pode ser substituído completamente usando a opção de linha de comando [`--tls-cipher-list`](/pt/nodejs/api/cli#--tls-cipher-listlist) (diretamente ou via variável de ambiente [`NODE_OPTIONS`](/pt/nodejs/api/cli#node_optionsoptions)). Por exemplo, o seguinte torna `ECDHE-RSA-AES128-GCM-SHA256:!RC4` o conjunto de cifras TLS padrão:

```bash [BASH]
node --tls-cipher-list='ECDHE-RSA-AES128-GCM-SHA256:!RC4' server.js

export NODE_OPTIONS=--tls-cipher-list='ECDHE-RSA-AES128-GCM-SHA256:!RC4'
node server.js
```
Para verificar, use o seguinte comando para mostrar a lista de cifras definida, observe a diferença entre `defaultCoreCipherList` e `defaultCipherList`:

```bash [BASH]
node --tls-cipher-list='ECDHE-RSA-AES128-GCM-SHA256:!RC4' -p crypto.constants.defaultCipherList | tr ':' '\n'
ECDHE-RSA-AES128-GCM-SHA256
!RC4
```
Ou seja, a lista `defaultCoreCipherList` é definida no momento da compilação e a `defaultCipherList` é definida em tempo de execução.

Para modificar os conjuntos de cifras padrão de dentro do tempo de execução, modifique a variável `tls.DEFAULT_CIPHERS`, isso deve ser feito antes de ouvir qualquer socket, não afetará os sockets já abertos. Por exemplo:

```js [ESM]
// Remova cifras CBC obsoletas e cifras baseadas em troca de chaves RSA, pois elas não fornecem sigilo de encaminhamento
tls.DEFAULT_CIPHERS +=
  ':!ECDHE-RSA-AES128-SHA:!ECDHE-RSA-AES128-SHA256:!ECDHE-RSA-AES256-SHA:!ECDHE-RSA-AES256-SHA384' +
  ':!ECDHE-ECDSA-AES128-SHA:!ECDHE-ECDSA-AES128-SHA256:!ECDHE-ECDSA-AES256-SHA:!ECDHE-ECDSA-AES256-SHA384' +
  ':!kRSA';
```
O padrão também pode ser substituído por cliente ou servidor usando a opção `ciphers` de [`tls.createSecureContext()`](/pt/nodejs/api/tls#tlscreatesecurecontextoptions), que também está disponível em [`tls.createServer()`](/pt/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener), [`tls.connect()`](/pt/nodejs/api/tls#tlsconnectoptions-callback), e ao criar novos [`tls.TLSSocket`](/pt/nodejs/api/tls#class-tlstlssocket)s.

A lista de cifras pode conter uma mistura de nomes de conjuntos de cifras TLSv1.3, aqueles que começam com `'TLS_'`, e especificações para conjuntos de cifras TLSv1.2 e inferiores. As cifras TLSv1.2 suportam um formato de especificação legado, consulte a documentação do OpenSSL [formato da lista de cifras](https://www.openssl.org/docs/man1.1.1/man1/ciphers#CIPHER-LIST-FORMAT) para obter detalhes, mas essas especificações *não* se aplicam a cifras TLSv1.3. Os conjuntos TLSv1.3 só podem ser ativados incluindo seu nome completo na lista de cifras. Eles não podem, por exemplo, ser ativados ou desativados usando a especificação legada TLSv1.2 `'EECDH'` ou `'!EECDH'`.

Apesar da ordem relativa dos conjuntos de cifras TLSv1.3 e TLSv1.2, o protocolo TLSv1.3 é significativamente mais seguro que o TLSv1.2 e sempre será escolhido em vez do TLSv1.2 se o handshake indicar que é suportado e se algum conjunto de cifras TLSv1.3 estiver habilitado.

O conjunto de cifras padrão incluído no Node.js foi cuidadosamente selecionado para refletir as melhores práticas de segurança e mitigação de riscos atuais. Alterar o conjunto de cifras padrão pode ter um impacto significativo na segurança de um aplicativo. A opção `--tls-cipher-list` e a opção `ciphers` devem ser usadas apenas se for absolutamente necessário.

O conjunto de cifras padrão prefere as cifras GCM para a [configuração de 'criptografia moderna' do Chrome](https://www.chromium.org/Home/chromium-security/education/tls#TOC-Cipher-Suites) e também prefere as cifras ECDHE e DHE para sigilo de encaminhamento perfeito, ao mesmo tempo em que oferece *alguma* compatibilidade com versões anteriores.

Clientes antigos que dependem de cifras RC4 ou baseadas em DES inseguras e descontinuadas (como o Internet Explorer 6) não podem concluir o processo de handshake com a configuração padrão. Se esses clientes *devem* ser suportados, as [recomendações TLS](https://wiki.mozilla.org/Security/Server_Side_TLS) podem oferecer um conjunto de cifras compatível. Para obter mais detalhes sobre o formato, consulte a documentação do OpenSSL [formato da lista de cifras](https://www.openssl.org/docs/man1.1.1/man1/ciphers#CIPHER-LIST-FORMAT).

Existem apenas cinco conjuntos de cifras TLSv1.3:

- `'TLS_AES_256_GCM_SHA384'`
- `'TLS_CHACHA20_POLY1305_SHA256'`
- `'TLS_AES_128_GCM_SHA256'`
- `'TLS_AES_128_CCM_SHA256'`
- `'TLS_AES_128_CCM_8_SHA256'`

Os três primeiros estão habilitados por padrão. Os dois conjuntos baseados em `CCM` são suportados pelo TLSv1.3 porque podem ter um desempenho melhor em sistemas restritos, mas não estão habilitados por padrão, pois oferecem menos segurança.


## Nível de segurança do OpenSSL {#openssl-security-level}

A biblioteca OpenSSL impõe níveis de segurança para controlar o nível mínimo aceitável de segurança para operações criptográficas. Os níveis de segurança do OpenSSL variam de 0 a 5, com cada nível impondo requisitos de segurança mais rigorosos. O nível de segurança padrão é 1, que geralmente é adequado para a maioria das aplicações modernas. No entanto, alguns recursos e protocolos legados, como o TLSv1, exigem um nível de segurança mais baixo (`SECLEVEL=0`) para funcionar corretamente. Para obter informações mais detalhadas, consulte a [documentação do OpenSSL sobre níveis de segurança](https://www.openssl.org/docs/manmaster/man3/SSL_CTX_set_security_level#DEFAULT-CALLBACK-BEHAVIOUR).

### Definindo níveis de segurança {#setting-security-levels}

Para ajustar o nível de segurança em sua aplicação Node.js, você pode incluir `@SECLEVEL=X` dentro de uma string de cifra, onde `X` é o nível de segurança desejado. Por exemplo, para definir o nível de segurança como 0 ao usar a lista de cifras OpenSSL padrão, você pode usar:

::: code-group
```js [ESM]
import { createServer, connect } from 'node:tls';
const port = 443;

createServer({ ciphers: 'DEFAULT@SECLEVEL=0', minVersion: 'TLSv1' }, function(socket) {
  console.log('Client connected with protocol:', socket.getProtocol());
  socket.end();
  this.close();
})
.listen(port, () => {
  connect(port, { ciphers: 'DEFAULT@SECLEVEL=0', maxVersion: 'TLSv1' });
});
```

```js [CJS]
const { createServer, connect } = require('node:tls');
const port = 443;

createServer({ ciphers: 'DEFAULT@SECLEVEL=0', minVersion: 'TLSv1' }, function(socket) {
  console.log('Client connected with protocol:', socket.getProtocol());
  socket.end();
  this.close();
})
.listen(port, () => {
  connect(port, { ciphers: 'DEFAULT@SECLEVEL=0', maxVersion: 'TLSv1' });
});
```
:::

Esta abordagem define o nível de segurança para 0, permitindo o uso de recursos legados enquanto ainda aproveita as cifras OpenSSL padrão.

### Usando {#using}

Você também pode definir o nível de segurança e as cifras na linha de comando usando `--tls-cipher-list=DEFAULT@SECLEVEL=X`, conforme descrito em [Modificando o conjunto de cifras TLS padrão](/pt/nodejs/api/tls#modifying-the-default-tls-cipher-suite). No entanto, geralmente não é recomendado usar a opção de linha de comando para definir cifras e é preferível configurar as cifras para contextos individuais dentro do código da sua aplicação, pois esta abordagem fornece um controle mais preciso e reduz o risco de diminuir globalmente o nível de segurança.


## Códigos de erro de certificado X509 {#x509-certificate-error-codes}

Múltiplas funções podem falhar devido a erros de certificado que são reportados pelo OpenSSL. Em tal caso, a função fornece um [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) através do seu callback que tem a propriedade `code` que pode assumir um dos seguintes valores:

- `'UNABLE_TO_GET_ISSUER_CERT'`: Impossível obter o certificado do emissor.
- `'UNABLE_TO_GET_CRL'`: Impossível obter a CRL do certificado.
- `'UNABLE_TO_DECRYPT_CERT_SIGNATURE'`: Impossível decifrar a assinatura do certificado.
- `'UNABLE_TO_DECRYPT_CRL_SIGNATURE'`: Impossível decifrar a assinatura da CRL.
- `'UNABLE_TO_DECODE_ISSUER_PUBLIC_KEY'`: Impossível decodificar a chave pública do emissor.
- `'CERT_SIGNATURE_FAILURE'`: Falha na assinatura do certificado.
- `'CRL_SIGNATURE_FAILURE'`: Falha na assinatura da CRL.
- `'CERT_NOT_YET_VALID'`: O certificado ainda não é válido.
- `'CERT_HAS_EXPIRED'`: O certificado expirou.
- `'CRL_NOT_YET_VALID'`: A CRL ainda não é válida.
- `'CRL_HAS_EXPIRED'`: A CRL expirou.
- `'ERROR_IN_CERT_NOT_BEFORE_FIELD'`: Erro de formato no campo notBefore do certificado.
- `'ERROR_IN_CERT_NOT_AFTER_FIELD'`: Erro de formato no campo notAfter do certificado.
- `'ERROR_IN_CRL_LAST_UPDATE_FIELD'`: Erro de formato no campo lastUpdate da CRL.
- `'ERROR_IN_CRL_NEXT_UPDATE_FIELD'`: Erro de formato no campo nextUpdate da CRL.
- `'OUT_OF_MEM'`: Sem memória.
- `'DEPTH_ZERO_SELF_SIGNED_CERT'`: Certificado autoassinado.
- `'SELF_SIGNED_CERT_IN_CHAIN'`: Certificado autoassinado na cadeia de certificados.
- `'UNABLE_TO_GET_ISSUER_CERT_LOCALLY'`: Impossível obter o certificado do emissor localmente.
- `'UNABLE_TO_VERIFY_LEAF_SIGNATURE'`: Impossível verificar o primeiro certificado.
- `'CERT_CHAIN_TOO_LONG'`: Cadeia de certificados muito longa.
- `'CERT_REVOKED'`: Certificado revogado.
- `'INVALID_CA'`: Certificado CA inválido.
- `'PATH_LENGTH_EXCEEDED'`: Restrição de comprimento do caminho excedida.
- `'INVALID_PURPOSE'`: Propósito de certificado não suportado.
- `'CERT_UNTRUSTED'`: Certificado não confiável.
- `'CERT_REJECTED'`: Certificado rejeitado.
- `'HOSTNAME_MISMATCH'`: Incompatibilidade de hostname.


## Classe: `tls.CryptoStream` {#class-tlscryptostream}

**Adicionado em: v0.3.4**

**Obsoleto desde: v0.11.3**

::: danger [Estável: 0 - Obsoleto]
[Estável: 0](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 0](/pt/nodejs/api/documentation#stability-index) - Obsoleto: Use [`tls.TLSSocket`](/pt/nodejs/api/tls#class-tlstlssocket) em vez disso.
:::

A classe `tls.CryptoStream` representa um fluxo de dados criptografados. Esta classe está obsoleta e não deve mais ser usada.

### `cryptoStream.bytesWritten` {#cryptostreambyteswritten}

**Adicionado em: v0.3.4**

**Obsoleto desde: v0.11.3**

A propriedade `cryptoStream.bytesWritten` retorna o número total de bytes gravados no socket subjacente *incluindo* os bytes necessários para a implementação do protocolo TLS.

## Classe: `tls.SecurePair` {#class-tlssecurepair}

**Adicionado em: v0.3.2**

**Obsoleto desde: v0.11.3**

::: danger [Estável: 0 - Obsoleto]
[Estável: 0](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 0](/pt/nodejs/api/documentation#stability-index) - Obsoleto: Use [`tls.TLSSocket`](/pt/nodejs/api/tls#class-tlstlssocket) em vez disso.
:::

Retornado por [`tls.createSecurePair()`](/pt/nodejs/api/tls#tlscreatesecurepaircontext-isserver-requestcert-rejectunauthorized-options).

### Evento: `'secure'` {#event-secure}

**Adicionado em: v0.3.2**

**Obsoleto desde: v0.11.3**

O evento `'secure'` é emitido pelo objeto `SecurePair` assim que uma conexão segura é estabelecida.

Assim como na verificação do evento [`'secureConnection'`](/pt/nodejs/api/tls#event-secureconnection) do servidor, `pair.cleartext.authorized` deve ser inspecionado para confirmar se o certificado usado está devidamente autorizado.

## Classe: `tls.Server` {#class-tlsserver}

**Adicionado em: v0.3.2**

- Estende: [\<net.Server\>](/pt/nodejs/api/net#class-netserver)

Aceita conexões criptografadas usando TLS ou SSL.

### Evento: `'connection'` {#event-connection}

**Adicionado em: v0.3.2**

- `socket` [\<stream.Duplex\>](/pt/nodejs/api/stream#class-streamduplex)

Este evento é emitido quando um novo fluxo TCP é estabelecido, antes que o handshake TLS comece. `socket` é normalmente um objeto do tipo [`net.Socket`](/pt/nodejs/api/net#class-netsocket), mas não receberá eventos ao contrário do socket criado a partir do evento `'connection'` de [`net.Server`](/pt/nodejs/api/net#class-netserver). Normalmente, os usuários não desejam acessar este evento.

Este evento também pode ser emitido explicitamente pelos usuários para injetar conexões no servidor TLS. Nesse caso, qualquer fluxo [`Duplex`](/pt/nodejs/api/stream#class-streamduplex) pode ser passado.


### Evento: `'keylog'` {#event-keylog}

**Adicionado em: v12.3.0, v10.20.0**

- `line` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) Linha de texto ASCII, no formato NSS `SSLKEYLOGFILE`.
- `tlsSocket` [\<tls.TLSSocket\>](/pt/nodejs/api/tls#class-tlstlssocket) A instância `tls.TLSSocket` na qual foi gerado.

O evento `keylog` é emitido quando o material da chave é gerado ou recebido por uma conexão a este servidor (normalmente antes da conclusão do handshake, mas não necessariamente). Este material de chave pode ser armazenado para depuração, pois permite que o tráfego TLS capturado seja descriptografado. Ele pode ser emitido várias vezes para cada socket.

Um caso de uso típico é anexar as linhas recebidas a um arquivo de texto comum, que é usado posteriormente por software (como o Wireshark) para descriptografar o tráfego:

```js [ESM]
const logFile = fs.createWriteStream('/tmp/ssl-keys.log', { flags: 'a' });
// ...
server.on('keylog', (line, tlsSocket) => {
  if (tlsSocket.remoteAddress !== '...')
    return; // Registra apenas as chaves para um IP específico
  logFile.write(line);
});
```
### Evento: `'newSession'` {#event-newsession}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v0.11.12 | O argumento `callback` agora é suportado. |
| v0.9.2 | Adicionado em: v0.9.2 |
:::

O evento `'newSession'` é emitido na criação de uma nova sessão TLS. Isso pode ser usado para armazenar sessões em armazenamento externo. Os dados devem ser fornecidos ao callback [`'resumeSession'`](/pt/nodejs/api/tls#event-resumesession).

O callback do listener recebe três argumentos quando chamado:

- `sessionId` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) O identificador da sessão TLS
- `sessionData` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) Os dados da sessão TLS
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Uma função de callback que não recebe argumentos e que deve ser invocada para que os dados sejam enviados ou recebidos pela conexão segura.

Ouvir este evento terá efeito apenas nas conexões estabelecidas após a adição do listener de evento.

### Evento: `'OCSPRequest'` {#event-ocsprequest}

**Adicionado em: v0.11.13**

O evento `'OCSPRequest'` é emitido quando o cliente envia uma solicitação de status de certificado. O callback do listener recebe três argumentos quando chamado:

- `certificate` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) O certificado do servidor
- `issuer` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) O certificado do emissor
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Uma função de callback que deve ser invocada para fornecer os resultados da solicitação OCSP.

O certificado atual do servidor pode ser analisado para obter o URL do OCSP e o ID do certificado; depois de obter uma resposta OCSP, `callback(null, resp)` é então invocado, onde `resp` é uma instância de `Buffer` contendo a resposta OCSP. Tanto `certificate` quanto `issuer` são representações DER em `Buffer` dos certificados primário e do emissor. Estes podem ser usados para obter o ID do certificado OCSP e o URL do endpoint OCSP.

Alternativamente, `callback(null, null)` pode ser chamado, indicando que não houve resposta OCSP.

Chamar `callback(err)` resultará em uma chamada `socket.destroy(err)`.

O fluxo típico de uma solicitação OCSP é o seguinte:

O `issuer` pode ser `null` se o certificado for autoassinado ou se o emissor não estiver na lista de certificados raiz. (Um emissor pode ser fornecido através da opção `ca` ao estabelecer a conexão TLS.)

Ouvir este evento terá efeito apenas nas conexões estabelecidas após a adição do listener de evento.

Um módulo npm como [asn1.js](https://www.npmjs.com/package/asn1.js) pode ser usado para analisar os certificados.


### Event: `'resumeSession'` {#event-resumesession}

**Adicionado em: v0.9.2**

O evento `'resumeSession'` é emitido quando o cliente solicita a retomada de uma sessão TLS anterior. O retorno de chamada do listener recebe dois argumentos quando é chamado:

- `sessionId` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) O identificador da sessão TLS
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Uma função de retorno de chamada a ser chamada quando a sessão anterior for recuperada: `callback([err[, sessionData]])`
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `sessionData` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer)
  
 

O listener de eventos deve realizar uma pesquisa no armazenamento externo pelos `sessionData` salvos pelo manipulador de eventos [`'newSession'`](/pt/nodejs/api/tls#event-newsession) usando o `sessionId` fornecido. Se encontrado, chame `callback(null, sessionData)` para retomar a sessão. Se não for encontrado, a sessão não pode ser retomada. `callback()` deve ser chamado sem `sessionData` para que o handshake possa continuar e uma nova sessão possa ser criada. É possível chamar `callback(err)` para encerrar a conexão de entrada e destruir o socket.

Ouvir este evento terá um efeito apenas nas conexões estabelecidas após a adição do listener de eventos.

O seguinte ilustra a retomada de uma sessão TLS:

```js [ESM]
const tlsSessionStore = {};
server.on('newSession', (id, data, cb) => {
  tlsSessionStore[id.toString('hex')] = data;
  cb();
});
server.on('resumeSession', (id, cb) => {
  cb(null, tlsSessionStore[id.toString('hex')] || null);
});
```
### Event: `'secureConnection'` {#event-secureconnection}

**Adicionado em: v0.3.2**

O evento `'secureConnection'` é emitido após a conclusão bem-sucedida do processo de handshake para uma nova conexão. O retorno de chamada do listener recebe um único argumento quando é chamado:

- `tlsSocket` [\<tls.TLSSocket\>](/pt/nodejs/api/tls#class-tlstlssocket) O socket TLS estabelecido.

A propriedade `tlsSocket.authorized` é um `boolean` que indica se o cliente foi verificado por uma das Autoridades de Certificação fornecidas para o servidor. Se `tlsSocket.authorized` for `false`, então `socket.authorizationError` é definido para descrever como a autorização falhou. Dependendo das configurações do servidor TLS, conexões não autorizadas ainda podem ser aceitas.

A propriedade `tlsSocket.alpnProtocol` é uma string que contém o protocolo ALPN selecionado. Quando o ALPN não tem um protocolo selecionado porque o cliente ou o servidor não enviou uma extensão ALPN, `tlsSocket.alpnProtocol` é igual a `false`.

A propriedade `tlsSocket.servername` é uma string que contém o nome do servidor solicitado via SNI.


### Evento: `'tlsClientError'` {#event-tlsclienterror}

**Adicionado em: v6.0.0**

O evento `'tlsClientError'` é emitido quando ocorre um erro antes que uma conexão segura seja estabelecida. O callback do listener recebe dois argumentos quando chamado:

- `exception` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) O objeto `Error` descrevendo o erro.
- `tlsSocket` [\<tls.TLSSocket\>](/pt/nodejs/api/tls#class-tlstlssocket) A instância `tls.TLSSocket` da qual o erro se originou.

### `server.addContext(hostname, context)` {#serveraddcontexthostname-context}

**Adicionado em: v0.5.3**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Um nome de host SNI ou curinga (por exemplo, `'*'`)
- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<tls.SecureContext\>](/pt/nodejs/api/tls#tlscreatesecurecontextoptions) Um objeto contendo qualquer uma das propriedades possíveis dos argumentos `options` de [`tls.createSecureContext()`](/pt/nodejs/api/tls#tlscreatesecurecontextoptions) (por exemplo, `key`, `cert`, `ca`, etc), ou um objeto de contexto TLS criado com [`tls.createSecureContext()`](/pt/nodejs/api/tls#tlscreatesecurecontextoptions) em si.

O método `server.addContext()` adiciona um contexto seguro que será usado se o nome SNI da solicitação do cliente corresponder ao `hostname` fornecido (ou curinga).

Quando existem vários contextos correspondentes, o adicionado mais recentemente é usado.

### `server.address()` {#serveraddress}

**Adicionado em: v0.6.0**

- Retorna: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Retorna o endereço vinculado, o nome da família de endereços e a porta do servidor, conforme relatado pelo sistema operacional. Consulte [`net.Server.address()`](/pt/nodejs/api/net#serveraddress) para obter mais informações.

### `server.close([callback])` {#serverclosecallback}

**Adicionado em: v0.3.2**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Um callback de listener que será registrado para ouvir o evento `'close'` da instância do servidor.
- Retorna: [\<tls.Server\>](/pt/nodejs/api/tls#class-tlsserver)

O método `server.close()` impede que o servidor aceite novas conexões.

Esta função opera de forma assíncrona. O evento `'close'` será emitido quando o servidor não tiver mais conexões abertas.


### `server.getTicketKeys()` {#servergetticketkeys}

**Adicionado em: v3.0.0**

- Retorna: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) Um buffer de 48 bytes contendo as chaves do ticket de sessão.

Retorna as chaves do ticket de sessão.

Veja [Retomada de Sessão](/pt/nodejs/api/tls#session-resumption) para mais informações.

### `server.listen()` {#serverlisten}

Inicia o servidor ouvindo por conexões criptografadas. Este método é idêntico a [`server.listen()`](/pt/nodejs/api/net#serverlisten) de [`net.Server`](/pt/nodejs/api/net#class-netserver).

### `server.setSecureContext(options)` {#serversetsecurecontextoptions}

**Adicionado em: v11.0.0**

- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Um objeto contendo qualquer uma das propriedades possíveis dos argumentos `options` de [`tls.createSecureContext()`](/pt/nodejs/api/tls#tlscreatesecurecontextoptions) (por exemplo, `key`, `cert`, `ca`, etc.).

O método `server.setSecureContext()` substitui o contexto seguro de um servidor existente. As conexões existentes com o servidor não são interrompidas.

### `server.setTicketKeys(keys)` {#serversetticketkeyskeys}

**Adicionado em: v3.0.0**

- `keys` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Um buffer de 48 bytes contendo as chaves do ticket de sessão.

Define as chaves do ticket de sessão.

As alterações nas chaves do ticket são efetivas apenas para futuras conexões de servidor. Conexões de servidor existentes ou atualmente pendentes usarão as chaves anteriores.

Veja [Retomada de Sessão](/pt/nodejs/api/tls#session-resumption) para mais informações.

## Classe: `tls.TLSSocket` {#class-tlstlssocket}

**Adicionado em: v0.11.4**

- Estende: [\<net.Socket\>](/pt/nodejs/api/net#class-netsocket)

Realiza criptografia transparente dos dados gravados e toda a negociação TLS necessária.

Instâncias de `tls.TLSSocket` implementam a interface duplex [Stream](/pt/nodejs/api/stream#stream).

Métodos que retornam metadados de conexão TLS (por exemplo, [`tls.TLSSocket.getPeerCertificate()`](/pt/nodejs/api/tls#tlssocketgetpeercertificatedetailed)) retornarão dados apenas enquanto a conexão estiver aberta.


### `new tls.TLSSocket(socket[, options])` {#new-tlstlssocketsocket-options}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v12.2.0 | A opção `enableTrace` agora é suportada. |
| v5.0.0 | As opções ALPN agora são suportadas. |
| v0.11.4 | Adicionado em: v0.11.4 |
:::

- `socket` [\<net.Socket\>](/pt/nodejs/api/net#class-netsocket) | [\<stream.Duplex\>](/pt/nodejs/api/stream#class-streamduplex) No lado do servidor, qualquer stream `Duplex`. No lado do cliente, qualquer instância de [`net.Socket`](/pt/nodejs/api/net#class-netsocket) (para suporte genérico ao stream `Duplex` no lado do cliente, [`tls.connect()`](/pt/nodejs/api/tls#tlsconnectoptions-callback) deve ser usado).
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `enableTrace`: Veja [`tls.createServer()`](/pt/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `isServer`: O protocolo SSL/TLS é assimétrico, TLSSockets devem saber se devem se comportar como um servidor ou um cliente. Se `true`, o socket TLS será instanciado como um servidor. **Padrão:** `false`.
    - `server` [\<net.Server\>](/pt/nodejs/api/net#class-netserver) Uma instância de [`net.Server`](/pt/nodejs/api/net#class-netserver).
    - `requestCert`: Se deve autenticar o peer remoto solicitando um certificado. Os clientes sempre solicitam um certificado de servidor. Os servidores (`isServer` é verdadeiro) podem definir `requestCert` como verdadeiro para solicitar um certificado de cliente.
    - `rejectUnauthorized`: Veja [`tls.createServer()`](/pt/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `ALPNProtocols`: Veja [`tls.createServer()`](/pt/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `SNICallback`: Veja [`tls.createServer()`](/pt/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `session` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) Uma instância de `Buffer` contendo uma sessão TLS.
    - `requestOCSP` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, especifica que a extensão de solicitação de status OCSP será adicionada ao client hello e um evento `'OCSPResponse'` será emitido no socket antes de estabelecer uma comunicação segura.
    - `secureContext`: Objeto de contexto TLS criado com [`tls.createSecureContext()`](/pt/nodejs/api/tls#tlscreatesecurecontextoptions). Se um `secureContext` *não* for fornecido, um será criado passando o objeto `options` inteiro para `tls.createSecureContext()`.
    - ...: Opções de [`tls.createSecureContext()`](/pt/nodejs/api/tls#tlscreatesecurecontextoptions) que são usadas se a opção `secureContext` estiver faltando. Caso contrário, elas são ignoradas.

Construa um novo objeto `tls.TLSSocket` a partir de um socket TCP existente.


### Evento: `'keylog'` {#event-keylog_1}

**Adicionado em: v12.3.0, v10.20.0**

- `line` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) Linha de texto ASCII, no formato `SSLKEYLOGFILE` do NSS.

O evento `keylog` é emitido em um `tls.TLSSocket` quando o material chave é gerado ou recebido pelo socket. Este material chave pode ser armazenado para depuração, pois permite que o tráfego TLS capturado seja descriptografado. Ele pode ser emitido várias vezes, antes ou depois que o handshake for concluído.

Um caso de uso típico é anexar as linhas recebidas a um arquivo de texto comum, que é usado posteriormente por um software (como o Wireshark) para descriptografar o tráfego:

```js [ESM]
const logFile = fs.createWriteStream('/tmp/ssl-keys.log', { flags: 'a' });
// ...
tlsSocket.on('keylog', (line) => logFile.write(line));
```
### Evento: `'OCSPResponse'` {#event-ocspresponse}

**Adicionado em: v0.11.13**

O evento `'OCSPResponse'` é emitido se a opção `requestOCSP` foi definida quando o `tls.TLSSocket` foi criado e uma resposta OCSP foi recebida. O retorno de chamada do listener recebe um único argumento quando chamado:

- `response` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) A resposta OCSP do servidor

Normalmente, a `response` é um objeto digitalmente assinado da CA do servidor que contém informações sobre o status de revogação do certificado do servidor.

### Evento: `'secureConnect'` {#event-secureconnect}

**Adicionado em: v0.11.4**

O evento `'secureConnect'` é emitido após a conclusão bem-sucedida do processo de handshake para uma nova conexão. O retorno de chamada do listener será chamado independentemente de o certificado do servidor ter sido autorizado ou não. É responsabilidade do cliente verificar a propriedade `tlsSocket.authorized` para determinar se o certificado do servidor foi assinado por uma das CAs especificadas. Se `tlsSocket.authorized === false`, então o erro pode ser encontrado examinando a propriedade `tlsSocket.authorizationError`. Se ALPN foi usado, a propriedade `tlsSocket.alpnProtocol` pode ser verificada para determinar o protocolo negociado.

O evento `'secureConnect'` não é emitido quando um [\<tls.TLSSocket\>](/pt/nodejs/api/tls#class-tlstlssocket) é criado usando o construtor `new tls.TLSSocket()`.


### Evento: `'session'` {#event-session}

**Adicionado em: v11.10.0**

- `session` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer)

O evento `'session'` é emitido em um `tls.TLSSocket` do cliente quando uma nova sessão ou ticket TLS está disponível. Isso pode ou não ocorrer antes da conclusão do handshake, dependendo da versão do protocolo TLS que foi negociada. O evento não é emitido no servidor, ou se uma nova sessão não foi criada, por exemplo, quando a conexão foi retomada. Para algumas versões do protocolo TLS, o evento pode ser emitido várias vezes, caso em que todas as sessões podem ser usadas para retomada.

No cliente, a `session` pode ser fornecida para a opção `session` de [`tls.connect()`](/pt/nodejs/api/tls#tlsconnectoptions-callback) para retomar a conexão.

Veja [Retomada de Sessão](/pt/nodejs/api/tls#session-resumption) para mais informações.

Para TLSv1.2 e versões anteriores, [`tls.TLSSocket.getSession()`](/pt/nodejs/api/tls#tlssocketgetsession) pode ser chamado assim que o handshake for concluído. Para TLSv1.3, apenas a retomada baseada em ticket é permitida pelo protocolo, vários tickets são enviados e os tickets não são enviados até que o handshake seja concluído. Portanto, é necessário esperar pelo evento `'session'` para obter uma sessão retomável. Os aplicativos devem usar o evento `'session'` em vez de `getSession()` para garantir que funcionarão para todas as versões TLS. Aplicativos que esperam obter ou usar apenas uma sessão devem ouvir este evento apenas uma vez:

```js [ESM]
tlsSocket.once('session', (session) => {
  // A sessão pode ser usada imediatamente ou posteriormente.
  tls.connect({
    session: session,
    // Outras opções de conexão...
  });
});
```
### `tlsSocket.address()` {#tlssocketaddress}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.4.0 | A propriedade `family` agora retorna uma string em vez de um número. |
| v18.0.0 | A propriedade `family` agora retorna um número em vez de uma string. |
| v0.11.4 | Adicionado em: v0.11.4 |
:::

- Retorna: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Retorna o `address` vinculado, o nome da `family` do endereço e a `port` do socket subjacente, conforme relatado pelo sistema operacional: `{ port: 12346, family: 'IPv4', address: '127.0.0.1' }`.


### `tlsSocket.authorizationError` {#tlssocketauthorizationerror}

**Adicionado em: v0.11.4**

Retorna o motivo pelo qual o certificado do par não foi verificado. Esta propriedade é definida apenas quando `tlsSocket.authorized === false`.

### `tlsSocket.authorized` {#tlssocketauthorized}

**Adicionado em: v0.11.4**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Esta propriedade é `true` se o certificado do par foi assinado por uma das CAs especificadas ao criar a instância `tls.TLSSocket`, caso contrário, `false`.

### `tlsSocket.disableRenegotiation()` {#tlssocketdisablerenegotiation}

**Adicionado em: v8.4.0**

Desativa a renegociação TLS para esta instância `TLSSocket`. Uma vez chamado, as tentativas de renegociação acionarão um evento `'error'` no `TLSSocket`.

### `tlsSocket.enableTrace()` {#tlssocketenabletrace}

**Adicionado em: v12.2.0**

Quando habilitado, as informações de rastreamento de pacotes TLS são gravadas em `stderr`. Isso pode ser usado para depurar problemas de conexão TLS.

O formato da saída é idêntico à saída de `openssl s_client -trace` ou `openssl s_server -trace`. Embora seja produzido pela função `SSL_trace()` do OpenSSL, o formato não está documentado, pode mudar sem aviso prévio e não deve ser confiável.

### `tlsSocket.encrypted` {#tlssocketencrypted}

**Adicionado em: v0.11.4**

Sempre retorna `true`. Isso pode ser usado para distinguir sockets TLS de instâncias `net.Socket` regulares.

### `tlsSocket.exportKeyingMaterial(length, label[, context])` {#tlssocketexportkeyingmateriallength-label-context}

**Adicionado em: v13.10.0, v12.17.0**

-  `length` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) número de bytes a serem recuperados do material de chaves
-  `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) um rótulo específico do aplicativo, normalmente este será um valor do [Registro de Rótulos do Exportador IANA](https://www.iana.org/assignments/tls-parameters/tls-parameters.xhtml#exporter-labels).
-  `context` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) Opcionalmente, forneça um contexto.
-  Retorna: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) bytes solicitados do material de chaves

O material de chaves é usado para validações para evitar diferentes tipos de ataques em protocolos de rede, por exemplo, nas especificações do IEEE 802.1X.

Exemplo

```js [ESM]
const keyingMaterial = tlsSocket.exportKeyingMaterial(
  128,
  'client finished');

/*
 Exemplo de valor de retorno de keyingMaterial:
 <Buffer 76 26 af 99 c5 56 8e 42 09 91 ef 9f 93 cb ad 6c 7b 65 f8 53 f1 d8 d9
    12 5a 33 b8 b5 25 df 7b 37 9f e0 e2 4f b8 67 83 a3 2f cd 5d 41 42 4c 91
    74 ef 2c ... 78 more bytes>
*/
```
Consulte a documentação do OpenSSL [`SSL_export_keying_material`](https://www.openssl.org/docs/man1.1.1/man3/SSL_export_keying_material) para obter mais informações.


### `tlsSocket.getCertificate()` {#tlssocketgetcertificate}

**Adicionado em: v11.2.0**

- Retorna: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Retorna um objeto representando o certificado local. O objeto retornado tem algumas propriedades correspondentes aos campos do certificado.

Veja [`tls.TLSSocket.getPeerCertificate()`](/pt/nodejs/api/tls#tlssocketgetpeercertificatedetailed) para um exemplo da estrutura do certificado.

Se não houver certificado local, um objeto vazio será retornado. Se o socket tiver sido destruído, `null` será retornado.

### `tlsSocket.getCipher()` {#tlssocketgetcipher}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v13.4.0, v12.16.0 | Retorna o nome da cifra IETF como `standardName`. |
| v12.0.0 | Retorna a versão mínima da cifra, em vez de uma string fixa (`'TLSv1/SSLv3'`). |
| v0.11.4 | Adicionado em: v0.11.4 |
:::

- Retorna: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome OpenSSL para o conjunto de cifras.
    - `standardName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome IETF para o conjunto de cifras.
    - `version` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A versão mínima do protocolo TLS suportada por este conjunto de cifras. Para o protocolo negociado real, consulte [`tls.TLSSocket.getProtocol()`](/pt/nodejs/api/tls#tlssocketgetprotocol).
  
 

Retorna um objeto contendo informações sobre o conjunto de cifras negociado.

Por exemplo, um protocolo TLSv1.2 com cifra AES256-SHA:

```json [JSON]
{
    "name": "AES256-SHA",
    "standardName": "TLS_RSA_WITH_AES_256_CBC_SHA",
    "version": "SSLv3"
}
```
Veja [SSL_CIPHER_get_name](https://www.openssl.org/docs/man1.1.1/man3/SSL_CIPHER_get_name) para mais informações.

### `tlsSocket.getEphemeralKeyInfo()` {#tlssocketgetephemeralkeyinfo}

**Adicionado em: v5.0.0**

- Retorna: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Retorna um objeto representando o tipo, nome e tamanho do parâmetro de uma troca de chaves efêmeras em [sigilo de encaminhamento perfeito](/pt/nodejs/api/tls#perfect-forward-secrecy) em uma conexão de cliente. Retorna um objeto vazio quando a troca de chaves não é efêmera. Como isso só é suportado em um socket de cliente; `null` é retornado se chamado em um socket de servidor. Os tipos suportados são `'DH'` e `'ECDH'`. A propriedade `name` está disponível apenas quando o tipo é `'ECDH'`.

Por exemplo: `{ type: 'ECDH', name: 'prime256v1', size: 256 }`.


### `tlsSocket.getFinished()` {#tlssocketgetfinished}

**Adicionado em: v9.9.0**

- Retorna: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) A última mensagem `Finished` que foi enviada para o socket como parte de um handshake SSL/TLS, ou `undefined` se nenhuma mensagem `Finished` foi enviada ainda.

Como as mensagens `Finished` são resumos de mensagens do handshake completo (com um total de 192 bits para TLS 1.0 e mais para SSL 3.0), elas podem ser usadas para procedimentos de autenticação externa quando a autenticação fornecida por SSL/TLS não for desejada ou não for suficiente.

Corresponde à rotina `SSL_get_finished` em OpenSSL e pode ser usada para implementar a vinculação de canal `tls-unique` de [RFC 5929](https://tools.ietf.org/html/rfc5929).

### `tlsSocket.getPeerCertificate([detailed])` {#tlssocketgetpeercertificatedetailed}

**Adicionado em: v0.11.4**

- `detailed` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Inclui a cadeia de certificados completa se `true`, caso contrário, inclui apenas o certificado do par.
- Retorna: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Um objeto de certificado.

Retorna um objeto representando o certificado do par. Se o par não fornecer um certificado, um objeto vazio será retornado. Se o socket foi destruído, `null` será retornado.

Se a cadeia de certificados completa foi solicitada, cada certificado incluirá uma propriedade `issuerCertificate` contendo um objeto representando o certificado de seu emissor.

#### Objeto de certificado {#certificate-object}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v19.1.0, v18.13.0 | Adiciona a propriedade "ca". |
| v17.2.0, v16.14.0 | Adiciona fingerprint512. |
| v11.4.0 | Suporte para informações de chave pública de Curva Elíptica. |
:::

Um objeto de certificado tem propriedades correspondentes aos campos do certificado.

- `ca` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` se uma Autoridade Certificadora (CA), `false` caso contrário.
- `raw` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) Os dados do certificado X.509 codificados em DER.
- `subject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) O sujeito do certificado, descrito em termos de País (`C`), EstadoOuProvíncia (`ST`), Localidade (`L`), Organização (`O`), UnidadeOrganizacional (`OU`) e NomeComum (`CN`). O NomeComum é normalmente um nome DNS com certificados TLS. Exemplo: `{C: 'UK', ST: 'BC', L: 'Metro', O: 'Node Fans', OU: 'Docs', CN: 'example.com'}`.
- `issuer` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) O emissor do certificado, descrito nos mesmos termos do `subject`.
- `valid_from` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A data e hora em que o certificado é válido a partir de.
- `valid_to` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A data e hora em que o certificado é válido até.
- `serialNumber` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O número de série do certificado, como uma string hexadecimal. Exemplo: `'B9B0D332A1AA5635'`.
- `fingerprint` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O resumo SHA-1 do certificado codificado em DER. Ele é retornado como uma string hexadecimal separada por `:`. Exemplo: `'2A:7A:C2:DD:...'`.
- `fingerprint256` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O resumo SHA-256 do certificado codificado em DER. Ele é retornado como uma string hexadecimal separada por `:`. Exemplo: `'2A:7A:C2:DD:...'`.
- `fingerprint512` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O resumo SHA-512 do certificado codificado em DER. Ele é retornado como uma string hexadecimal separada por `:`. Exemplo: `'2A:7A:C2:DD:...'`.
- `ext_key_usage` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) (Opcional) O uso estendido de chave, um conjunto de OIDs.
- `subjectaltname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) (Opcional) Uma string contendo nomes concatenados para o sujeito, uma alternativa aos nomes do `subject`.
- `infoAccess` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) (Opcional) Um array descrevendo o AuthorityInfoAccess, usado com OCSP.
- `issuerCertificate` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) (Opcional) O objeto de certificado do emissor. Para certificados autoassinados, isso pode ser uma referência circular.

O certificado pode conter informações sobre a chave pública, dependendo do tipo de chave.

Para chaves RSA, as seguintes propriedades podem ser definidas:

- `bits` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O tamanho do bit RSA. Exemplo: `1024`.
- `exponent` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O expoente RSA, como uma string em notação de número hexadecimal. Exemplo: `'0x010001'`.
- `modulus` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) O módulo RSA, como uma string hexadecimal. Exemplo: `'B56CE45CB7...'`.
- `pubkey` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) A chave pública.

Para chaves EC, as seguintes propriedades podem ser definidas:

- `pubkey` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) A chave pública.
- `bits` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O tamanho da chave em bits. Exemplo: `256`.
- `asn1Curve` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) (Opcional) O nome ASN.1 do OID da curva elíptica. Curvas bem conhecidas são identificadas por um OID. Embora seja incomum, é possível que a curva seja identificada por suas propriedades matemáticas, caso em que não terá um OID. Exemplo: `'prime256v1'`.
- `nistCurve` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) (Opcional) O nome NIST para a curva elíptica, se tiver um (nem todas as curvas bem conhecidas foram atribuídas nomes pelo NIST). Exemplo: `'P-256'`.

Exemplo de certificado:

```js [ESM]
{ subject:
   { OU: [ 'Domain Control Validated', 'PositiveSSL Wildcard' ],
     CN: '*.nodejs.org' },
  issuer:
   { C: 'GB',
     ST: 'Greater Manchester',
     L: 'Salford',
     O: 'COMODO CA Limited',
     CN: 'COMODO RSA Domain Validation Secure Server CA' },
  subjectaltname: 'DNS:*.nodejs.org, DNS:nodejs.org',
  infoAccess:
   { 'CA Issuers - URI':
      [ 'http://crt.comodoca.com/COMODORSADomainValidationSecureServerCA.crt' ],
     'OCSP - URI': [ 'http://ocsp.comodoca.com' ] },
  modulus: 'B56CE45CB740B09A13F64AC543B712FF9EE8E4C284B542A1708A27E82A8D151CA178153E12E6DDA15BF70FFD96CB8A88618641BDFCCA03527E665B70D779C8A349A6F88FD4EF6557180BD4C98192872BCFE3AF56E863C09DDD8BC1EC58DF9D94F914F0369102B2870BECFA1348A0838C9C49BD1C20124B442477572347047506B1FCD658A80D0C44BCC16BC5C5496CFE6E4A8428EF654CD3D8972BF6E5BFAD59C93006830B5EB1056BBB38B53D1464FA6E02BFDF2FF66CD949486F0775EC43034EC2602AEFBF1703AD221DAA2A88353C3B6A688EFE8387811F645CEED7B3FE46E1F8B9F59FAD028F349B9BC14211D5830994D055EEA3D547911E07A0ADDEB8A82B9188E58720D95CD478EEC9AF1F17BE8141BE80906F1A339445A7EB5B285F68039B0F294598A7D1C0005FC22B5271B0752F58CCDEF8C8FD856FB7AE21C80B8A2CE983AE94046E53EDE4CB89F42502D31B5360771C01C80155918637490550E3F555E2EE75CC8C636DDE3633CFEDD62E91BF0F7688273694EEEBA20C2FC9F14A2A435517BC1D7373922463409AB603295CEB0BB53787A334C9CA3CA8B30005C5A62FC0715083462E00719A8FA3ED0A9828C3871360A73F8B04A4FC1E71302844E9BB9940B77E745C9D91F226D71AFCAD4B113AAF68D92B24DDB4A2136B55A1CD1ADF39605B63CB639038ED0F4C987689866743A68769CC55847E4A06D6E2E3F1',
  exponent: '0x10001',
  pubkey: <Buffer ... >,
  valid_from: 'Aug 14 00:00:00 2017 GMT',
  valid_to: 'Nov 20 23:59:59 2019 GMT',
  fingerprint: '01:02:59:D9:C3:D2:0D:08:F7:82:4E:44:A4:B4:53:C5:E2:3A:87:4D',
  fingerprint256: '69:AE:1A:6A:D4:3D:C6:C1:1B:EA:C6:23:DE:BA:2A:14:62:62:93:5C:7A:EA:06:41:9B:0B:BC:87:CE:48:4E:02',
  fingerprint512: '19:2B:3E:C3:B3:5B:32:E8:AE:BB:78:97:27:E4:BA:6C:39:C9:92:79:4F:31:46:39:E2:70:E5:5F:89:42:17:C9:E8:64:CA:FF:BB:72:56:73:6E:28:8A:92:7E:A3:2A:15:8B:C2:E0:45:CA:C3:BC:EA:40:52:EC:CA:A2:68:CB:32',
  ext_key_usage: [ '1.3.6.1.5.5.7.3.1', '1.3.6.1.5.5.7.3.2' ],
  serialNumber: '66593D57F20CBC573E433381B5FEC280',
  raw: <Buffer ... > }
```

### `tlsSocket.getPeerFinished()` {#tlssocketgetpeerfinished}

**Adicionado em: v9.9.0**

- Retorna: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) A última mensagem `Finished` que é esperada ou que foi realmente recebida do socket como parte de um handshake SSL/TLS, ou `undefined` se não houver nenhuma mensagem `Finished` até o momento.

Como as mensagens `Finished` são resumos de mensagens do handshake completo (com um total de 192 bits para TLS 1.0 e mais para SSL 3.0), elas podem ser usadas para procedimentos de autenticação externa quando a autenticação fornecida por SSL/TLS não for desejada ou não for suficiente.

Corresponde à rotina `SSL_get_peer_finished` no OpenSSL e pode ser usada para implementar a vinculação de canal `tls-unique` do [RFC 5929](https://tools.ietf.org/html/rfc5929).

### `tlsSocket.getPeerX509Certificate()` {#tlssocketgetpeerx509certificate}

**Adicionado em: v15.9.0**

- Retorna: [\<X509Certificate\>](/pt/nodejs/api/crypto#class-x509certificate)

Retorna o certificado do peer como um objeto [\<X509Certificate\>](/pt/nodejs/api/crypto#class-x509certificate).

Se não houver certificado do peer, ou o socket tiver sido destruído, `undefined` será retornado.

### `tlsSocket.getProtocol()` {#tlssocketgetprotocol}

**Adicionado em: v5.7.0**

- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

Retorna uma string contendo a versão do protocolo SSL/TLS negociada da conexão atual. O valor `'unknown'` será retornado para sockets conectados que não completaram o processo de handshake. O valor `null` será retornado para sockets de servidor ou sockets de cliente desconectados.

As versões de protocolo são:

- `'SSLv3'`
- `'TLSv1'`
- `'TLSv1.1'`
- `'TLSv1.2'`
- `'TLSv1.3'`

Consulte a documentação do OpenSSL [`SSL_get_version`](https://www.openssl.org/docs/man1.1.1/man3/SSL_get_version) para obter mais informações.

### `tlsSocket.getSession()` {#tlssocketgetsession}

**Adicionado em: v0.11.4**

- [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer)

Retorna os dados da sessão TLS ou `undefined` se nenhuma sessão foi negociada. No cliente, os dados podem ser fornecidos para a opção `session` de [`tls.connect()`](/pt/nodejs/api/tls#tlsconnectoptions-callback) para retomar a conexão. No servidor, pode ser útil para depuração.

Consulte [Retomada de Sessão](/pt/nodejs/api/tls#session-resumption) para obter mais informações.

Observação: `getSession()` funciona apenas para TLSv1.2 e versões anteriores. Para TLSv1.3, os aplicativos devem usar o evento [`'session'`](/pt/nodejs/api/tls#event-session) (também funciona para TLSv1.2 e versões anteriores).


### `tlsSocket.getSharedSigalgs()` {#tlssocketgetsharedsigalgs}

**Adicionado em: v12.11.0**

- Retorna: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Lista de algoritmos de assinatura compartilhados entre o servidor e o cliente na ordem de preferência decrescente.

Veja [SSL_get_shared_sigalgs](https://www.openssl.org/docs/man1.1.1/man3/SSL_get_shared_sigalgs) para mais informações.

### `tlsSocket.getTLSTicket()` {#tlssocketgettlsticket}

**Adicionado em: v0.11.4**

- [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer)

Para um cliente, retorna o ticket de sessão TLS se um estiver disponível, ou `undefined`. Para um servidor, sempre retorna `undefined`.

Pode ser útil para depuração.

Veja [Retomada de Sessão](/pt/nodejs/api/tls#session-resumption) para mais informações.

### `tlsSocket.getX509Certificate()` {#tlssocketgetx509certificate}

**Adicionado em: v15.9.0**

- Retorna: [\<X509Certificate\>](/pt/nodejs/api/crypto#class-x509certificate)

Retorna o certificado local como um objeto [\<X509Certificate\>](/pt/nodejs/api/crypto#class-x509certificate).

Se não houver certificado local, ou o socket tiver sido destruído, `undefined` será retornado.

### `tlsSocket.isSessionReused()` {#tlssocketissessionreused}

**Adicionado em: v0.5.6**

- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` se a sessão foi reutilizada, `false` caso contrário.

Veja [Retomada de Sessão](/pt/nodejs/api/tls#session-resumption) para mais informações.

### `tlsSocket.localAddress` {#tlssocketlocaladdress}

**Adicionado em: v0.11.4**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retorna a representação em string do endereço IP local.

### `tlsSocket.localPort` {#tlssocketlocalport}

**Adicionado em: v0.11.4**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Retorna a representação numérica da porta local.

### `tlsSocket.remoteAddress` {#tlssocketremoteaddress}

**Adicionado em: v0.11.4**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retorna a representação em string do endereço IP remoto. Por exemplo, `'74.125.127.100'` ou `'2001:4860:a005::68'`.


### `tlsSocket.remoteFamily` {#tlssocketremotefamily}

**Adicionado em: v0.11.4**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retorna a representação em string da família de IP remota. `'IPv4'` ou `'IPv6'`.

### `tlsSocket.remotePort` {#tlssocketremoteport}

**Adicionado em: v0.11.4**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Retorna a representação numérica da porta remota. Por exemplo, `443`.

### `tlsSocket.renegotiate(options, callback)` {#tlssocketrenegotiateoptions-callback}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.0.0 | Passar um callback inválido para o argumento `callback` agora lança `ERR_INVALID_ARG_TYPE` em vez de `ERR_INVALID_CALLBACK`. |
| v0.11.8 | Adicionado em: v0.11.8 |
:::

-  `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `rejectUnauthorized` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se não for `false`, o certificado do servidor é verificado em relação à lista de CAs fornecidas. Um evento `'error'` é emitido se a verificação falhar; `err.code` contém o código de erro OpenSSL. **Padrão:** `true`.
    - `requestCert`
  
 
-  `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Se `renegotiate()` retornou `true`, o callback é anexado uma vez ao evento `'secure'`. Se `renegotiate()` retornou `false`, o `callback` será chamado no próximo tick com um erro, a menos que o `tlsSocket` tenha sido destruído, caso em que o `callback` não será chamado. 
-  Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` se a renegociação foi iniciada, `false` caso contrário. 

O método `tlsSocket.renegotiate()` inicia um processo de renegociação TLS. Após a conclusão, a função `callback` receberá um único argumento que é um `Error` (se a solicitação falhar) ou `null`.

Este método pode ser usado para solicitar o certificado de um par após o estabelecimento da conexão segura.

Ao ser executado como servidor, o socket será destruído com um erro após o timeout `handshakeTimeout`.

Para TLSv1.3, a renegociação não pode ser iniciada, pois não é suportada pelo protocolo.


### `tlsSocket.setKeyCert(context)` {#tlssocketsetkeycertcontext}

**Adicionado em: v22.5.0, v20.17.0**

- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<tls.SecureContext\>](/pt/nodejs/api/tls#tlscreatesecurecontextoptions) Um objeto contendo pelo menos as propriedades `key` e `cert` das `options` de [`tls.createSecureContext()`](/pt/nodejs/api/tls#tlscreatesecurecontextoptions), ou um objeto de contexto TLS criado com [`tls.createSecureContext()`](/pt/nodejs/api/tls#tlscreatesecurecontextoptions) em si.

O método `tlsSocket.setKeyCert()` define a chave privada e o certificado a serem usados para o socket. Isso é principalmente útil se você deseja selecionar um certificado de servidor do `ALPNCallback` de um servidor TLS.

### `tlsSocket.setMaxSendFragment(size)` {#tlssocketsetmaxsendfragmentsize}

**Adicionado em: v0.11.11**

- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O tamanho máximo do fragmento TLS. O valor máximo é `16384`. **Padrão:** `16384`.
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

O método `tlsSocket.setMaxSendFragment()` define o tamanho máximo do fragmento TLS. Retorna `true` se a definição do limite foi bem-sucedida; `false` caso contrário.

Tamanhos de fragmento menores diminuem a latência de buffer no cliente: fragmentos maiores são armazenados em buffer pela camada TLS até que o fragmento inteiro seja recebido e sua integridade seja verificada; fragmentos grandes podem abranger várias viagens de ida e volta e seu processamento pode ser atrasado devido à perda ou reordenação de pacotes. No entanto, fragmentos menores adicionam bytes de enquadramento TLS extras e sobrecarga de CPU, o que pode diminuir a taxa de transferência geral do servidor.

## `tls.checkServerIdentity(hostname, cert)` {#tlscheckserveridentityhostname-cert}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v17.3.1, v16.13.2, v14.18.3, v12.22.9 | O suporte para nomes alternativos de assunto `uniformResourceIdentifier` foi desativado em resposta ao CVE-2021-44531. |
| v0.8.4 | Adicionado em: v0.8.4 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O nome do host ou endereço IP para verificar o certificado.
- `cert` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Um [objeto de certificado](/pt/nodejs/api/tls#certificate-object) representando o certificado do par.
- Retorna: [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Verifica se o certificado `cert` foi emitido para `hostname`.

Retorna o objeto [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error), preenchendo-o com `reason`, `host` e `cert` em caso de falha. Em caso de sucesso, retorna [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type).

Esta função se destina a ser usada em combinação com a opção `checkServerIdentity` que pode ser passada para [`tls.connect()`](/pt/nodejs/api/tls#tlsconnectoptions-callback) e, como tal, opera em um [objeto de certificado](/pt/nodejs/api/tls#certificate-object). Para outros fins, considere usar [`x509.checkHost()`](/pt/nodejs/api/crypto#x509checkhostname-options) em vez disso.

Esta função pode ser substituída, fornecendo uma função alternativa como a opção `options.checkServerIdentity` que é passada para `tls.connect()`. A função de substituição pode chamar `tls.checkServerIdentity()` é claro, para aumentar as verificações feitas com verificação adicional.

Esta função só é chamada se o certificado passar em todas as outras verificações, como ser emitido por uma CA confiável (`options.ca`).

Versões anteriores do Node.js aceitavam incorretamente certificados para um determinado `hostname` se um nome alternativo de assunto `uniformResourceIdentifier` correspondente estivesse presente (consulte [CVE-2021-44531](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-44531)). Aplicativos que desejam aceitar nomes alternativos de assunto `uniformResourceIdentifier` podem usar uma função `options.checkServerIdentity` personalizada que implementa o comportamento desejado.


## `tls.connect(options[, callback])` {#tlsconnectoptions-callback}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v15.1.0, v14.18.0 | Adicionada a opção `onread`. |
| v14.1.0, v13.14.0 | A opção `highWaterMark` é aceita agora. |
| v13.6.0, v12.16.0 | A opção `pskCallback` é suportada agora. |
| v12.9.0 | Suporte para a opção `allowHalfOpen`. |
| v12.4.0 | A opção `hints` é suportada agora. |
| v12.2.0 | A opção `enableTrace` é suportada agora. |
| v11.8.0, v10.16.0 | A opção `timeout` é suportada agora. |
| v8.0.0 | A opção `lookup` é suportada agora. |
| v8.0.0 | A opção `ALPNProtocols` pode ser um `TypedArray` ou `DataView` agora. |
| v5.0.0 | As opções ALPN são suportadas agora. |
| v5.3.0, v4.7.0 | A opção `secureContext` é suportada agora. |
| v0.11.3 | Adicionado em: v0.11.3 |
:::

- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `enableTrace`: Veja [`tls.createServer()`](/pt/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Host ao qual o cliente deve se conectar. **Padrão:** `'localhost'`.
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Porta à qual o cliente deve se conectar.
    - `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Cria uma conexão de socket Unix para o caminho. Se esta opção for especificada, `host` e `port` serão ignorados.
    - `socket` [\<stream.Duplex\>](/pt/nodejs/api/stream#class-streamduplex) Estabelece uma conexão segura em um socket fornecido em vez de criar um novo socket. Normalmente, esta é uma instância de [`net.Socket`](/pt/nodejs/api/net#class-netsocket), mas qualquer fluxo `Duplex` é permitido. Se esta opção for especificada, `path`, `host` e `port` são ignorados, exceto para a validação do certificado. Normalmente, um socket já está conectado quando passado para `tls.connect()`, mas pode ser conectado mais tarde. A conexão/desconexão/destruição de `socket` é responsabilidade do usuário; chamar `tls.connect()` não fará com que `net.connect()` seja chamado.
    - `allowHalfOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se definido como `false`, o socket encerrará automaticamente o lado gravável quando o lado legível terminar. Se a opção `socket` estiver definida, esta opção não terá efeito. Veja a opção `allowHalfOpen` de [`net.Socket`](/pt/nodejs/api/net#class-netsocket) para mais detalhes. **Padrão:** `false`.
    - `rejectUnauthorized` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se não for `false`, o certificado do servidor é verificado na lista de CAs fornecidas. Um evento `'error'` é emitido se a verificação falhar; `err.code` contém o código de erro OpenSSL. **Padrão:** `true`.
    - `pskCallback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Para a negociação TLS-PSK, veja [Chaves pré-compartilhadas](/pt/nodejs/api/tls#pre-shared-keys).
    - `ALPNProtocols`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer[]\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Um array de strings, `Buffer`s, `TypedArray`s ou `DataView`s, ou um único `Buffer`, `TypedArray` ou `DataView` contendo os protocolos ALPN suportados. Os `Buffer`s devem ter o formato `[len][name][len][name]...` ex. `'\x08http/1.1\x08http/1.0'`, onde o byte `len` é o comprimento do próximo nome de protocolo. Passar um array geralmente é muito mais simples, ex. `['http/1.1', 'http/1.0']`. Protocolos anteriores na lista têm maior preferência do que os posteriores.
    - `servername`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome do servidor para a extensão TLS SNI (Server Name Indication). É o nome do host ao qual está sendo conectado e deve ser um nome de host, e não um endereço IP. Ele pode ser usado por um servidor multi-homed para escolher o certificado correto a ser apresentado ao cliente, veja a opção `SNICallback` para [`tls.createServer()`](/pt/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener).
    - `checkServerIdentity(servername, cert)` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Uma função de callback a ser usada (em vez da função `tls.checkServerIdentity()` embutida) ao verificar o nome do host do servidor (ou o `servername` fornecido quando explicitamente definido) em relação ao certificado. Isso deve retornar um [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) se a verificação falhar. O método deve retornar `undefined` se o `servername` e `cert` forem verificados.
    - `session` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) Uma instância de `Buffer`, contendo a sessão TLS.
    - `minDHSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Tamanho mínimo do parâmetro DH em bits para aceitar uma conexão TLS. Quando um servidor oferece um parâmetro DH com um tamanho menor que `minDHSize`, a conexão TLS é destruída e um erro é lançado. **Padrão:** `1024`.
    - `highWaterMark`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Consistente com o parâmetro `highWaterMark` do stream legível. **Padrão:** `16 * 1024`.
    - `secureContext`: Objeto de contexto TLS criado com [`tls.createSecureContext()`](/pt/nodejs/api/tls#tlscreatesecurecontextoptions). Se um `secureContext` *não* for fornecido, um será criado passando o objeto `options` inteiro para `tls.createSecureContext()`.
    - `onread` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Se a opção `socket` estiver ausente, os dados de entrada são armazenados em um único `buffer` e passados para o `callback` fornecido quando os dados chegam no socket, caso contrário, a opção é ignorada. Veja a opção `onread` de [`net.Socket`](/pt/nodejs/api/net#class-netsocket) para mais detalhes.
    - ...: Opções [`tls.createSecureContext()`](/pt/nodejs/api/tls#tlscreatesecurecontextoptions) que são usadas se a opção `secureContext` estiver ausente, caso contrário, elas são ignoradas.
    - ...: Qualquer opção [`socket.connect()`](/pt/nodejs/api/net#socketconnectoptions-connectlistener) que ainda não esteja listada.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retorna: [\<tls.TLSSocket\>](/pt/nodejs/api/tls#class-tlstlssocket)

A função `callback`, se especificada, será adicionada como um listener para o evento [`'secureConnect'`](/pt/nodejs/api/tls#event-secureconnect).

`tls.connect()` retorna um objeto [`tls.TLSSocket`](/pt/nodejs/api/tls#class-tlstlssocket).

Ao contrário da API `https`, `tls.connect()` não habilita a extensão SNI (Server Name Indication) por padrão, o que pode fazer com que alguns servidores retornem um certificado incorreto ou rejeitem a conexão por completo. Para habilitar o SNI, defina a opção `servername` além de `host`.

O seguinte ilustra um cliente para o exemplo de servidor echo de [`tls.createServer()`](/pt/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener):

::: code-group
```js [ESM]
// Assume que um servidor echo está escutando na porta 8000.
import { connect } from 'node:tls';
import { readFileSync } from 'node:fs';
import { stdin } from 'node:process';

const options = {
  // Necessário apenas se o servidor exigir autenticação de certificado do cliente.
  key: readFileSync('client-key.pem'),
  cert: readFileSync('client-cert.pem'),

  // Necessário apenas se o servidor usar um certificado autoassinado.
  ca: [ readFileSync('server-cert.pem') ],

  // Necessário apenas se o certificado do servidor não for para "localhost".
  checkServerIdentity: () => { return null; },
};

const socket = connect(8000, options, () => {
  console.log('cliente conectado',
              socket.authorized ? 'autorizado' : 'não autorizado');
  stdin.pipe(socket);
  stdin.resume();
});
socket.setEncoding('utf8');
socket.on('data', (data) => {
  console.log(data);
});
socket.on('end', () => {
  console.log('servidor encerra a conexão');
});
```

```js [CJS]
// Assume que um servidor echo está escutando na porta 8000.
const { connect } = require('node:tls');
const { readFileSync } = require('node:fs');

const options = {
  // Necessário apenas se o servidor exigir autenticação de certificado do cliente.
  key: readFileSync('client-key.pem'),
  cert: readFileSync('client-cert.pem'),

  // Necessário apenas se o servidor usar um certificado autoassinado.
  ca: [ readFileSync('server-cert.pem') ],

  // Necessário apenas se o certificado do servidor não for para "localhost".
  checkServerIdentity: () => { return null; },
};

const socket = connect(8000, options, () => {
  console.log('cliente conectado',
              socket.authorized ? 'autorizado' : 'não autorizado');
  process.stdin.pipe(socket);
  process.stdin.resume();
});
socket.setEncoding('utf8');
socket.on('data', (data) => {
  console.log(data);
});
socket.on('end', () => {
  console.log('servidor encerra a conexão');
});
```
:::

Para gerar o certificado e a chave para este exemplo, execute:

```bash [BASH]
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
  -keyout client-key.pem -out client-cert.pem
```
Então, para gerar o certificado `server-cert.pem` para este exemplo, execute:

```bash [BASH]
openssl pkcs12 -certpbe AES-256-CBC -export -out server-cert.pem \
  -inkey client-key.pem -in client-cert.pem
```

## `tls.connect(path[, options][, callback])` {#tlsconnectpath-options-callback}

**Adicionado em: v0.11.3**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Valor padrão para `options.path`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Consulte [`tls.connect()`](/pt/nodejs/api/tls#tlsconnectoptions-callback).
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Consulte [`tls.connect()`](/pt/nodejs/api/tls#tlsconnectoptions-callback).
- Retorna: [\<tls.TLSSocket\>](/pt/nodejs/api/tls#class-tlstlssocket)

O mesmo que [`tls.connect()`](/pt/nodejs/api/tls#tlsconnectoptions-callback), exceto que `path` pode ser fornecido como um argumento em vez de uma opção.

Uma opção de caminho, se especificada, terá precedência sobre o argumento de caminho.

## `tls.connect(port[, host][, options][, callback])` {#tlsconnectport-host-options-callback}

**Adicionado em: v0.11.3**

- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Valor padrão para `options.port`.
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Valor padrão para `options.host`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Consulte [`tls.connect()`](/pt/nodejs/api/tls#tlsconnectoptions-callback).
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Consulte [`tls.connect()`](/pt/nodejs/api/tls#tlsconnectoptions-callback).
- Retorna: [\<tls.TLSSocket\>](/pt/nodejs/api/tls#class-tlstlssocket)

O mesmo que [`tls.connect()`](/pt/nodejs/api/tls#tlsconnectoptions-callback), exceto que `port` e `host` podem ser fornecidos como argumentos em vez de opções.

Uma opção de porta ou host, se especificada, terá precedência sobre qualquer argumento de porta ou host.

## `tls.createSecureContext([options])` {#tlscreatesecurecontextoptions}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v22.9.0, v20.18.0 | A opção `allowPartialTrustChain` foi adicionada. |
| v22.4.0, v20.16.0 | As opções `clientCertEngine`, `privateKeyEngine` e `privateKeyIdentifier` dependem do suporte de mecanismo personalizado no OpenSSL, que está obsoleto no OpenSSL 3. |
| v19.8.0, v18.16.0 | A opção `dhparam` agora pode ser definida como `'auto'` para habilitar DHE com parâmetros conhecidos apropriados. |
| v12.12.0 | Adicionadas as opções `privateKeyIdentifier` e `privateKeyEngine` para obter a chave privada de um mecanismo OpenSSL. |
| v12.11.0 | Adicionada a opção `sigalgs` para substituir os algoritmos de assinatura suportados. |
| v12.0.0 | Suporte para TLSv1.3 adicionado. |
| v11.5.0 | A opção `ca:` agora suporta `BEGIN TRUSTED CERTIFICATE`. |
| v11.4.0, v10.16.0 | O `minVersion` e `maxVersion` podem ser usados para restringir as versões de protocolo TLS permitidas. |
| v10.0.0 | O `ecdhCurve` não pode mais ser definido como `false` devido a uma alteração no OpenSSL. |
| v9.3.0 | O parâmetro `options` agora pode incluir `clientCertEngine`. |
| v9.0.0 | A opção `ecdhCurve` agora pode ser múltiplos nomes de curva separados por `':'` ou `'auto'`. |
| v7.3.0 | Se a opção `key` for uma matriz, as entradas individuais não precisam mais de uma propriedade `passphrase`. As entradas `Array` também podem ser apenas `string`s ou `Buffer`s agora. |
| v5.2.0 | A opção `ca` agora pode ser uma única string contendo vários certificados CA. |
| v0.11.13 | Adicionado em: v0.11.13 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `allowPartialTrustChain` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Tratar certificados intermediários (não autoassinados) na lista de certificados CA de confiança como confiáveis.
    - `ca` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<Buffer[]\>](/pt/nodejs/api/buffer#class-buffer) Opcionalmente, substitua os certificados CA confiáveis. O padrão é confiar nas CAs conhecidas selecionadas pela Mozilla. As CAs da Mozilla são completamente substituídas quando as CAs são explicitamente especificadas usando esta opção. O valor pode ser uma string ou `Buffer`, ou um `Array` de strings e/ou `Buffer`s. Qualquer string ou `Buffer` pode conter várias CAs PEM concatenadas. O certificado do par deve ser encadeável a uma CA confiável pelo servidor para que a conexão seja autenticada. Ao usar certificados que não são encadeáveis a uma CA conhecida, a CA do certificado deve ser explicitamente especificada como confiável ou a conexão não será autenticada. Se o par usar um certificado que não corresponda ou não se encadeie a uma das CAs padrão, use a opção `ca` para fornecer um certificado CA ao qual o certificado do par possa corresponder ou se encadear. Para certificados autoassinados, o certificado é sua própria CA e deve ser fornecido. Para certificados codificados em PEM, os tipos suportados são "TRUSTED CERTIFICATE", "X509 CERTIFICATE" e "CERTIFICATE". Consulte também [`tls.rootCertificates`](/pt/nodejs/api/tls#tlsrootcertificates).
    - `cert` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<Buffer[]\>](/pt/nodejs/api/buffer#class-buffer) Cadeias de certificados em formato PEM. Uma cadeia de certificados deve ser fornecida por chave privada. Cada cadeia de certificados deve consistir no certificado formatado em PEM para uma `key` privada fornecida, seguido pelos certificados intermediários formatados em PEM (se houver), em ordem, e não incluindo a CA raiz (a CA raiz deve ser pré-conhecida pelo par, consulte `ca`). Ao fornecer várias cadeias de certificados, elas não precisam estar na mesma ordem que suas chaves privadas em `key`. Se os certificados intermediários não forem fornecidos, o par não poderá validar o certificado e o handshake falhará.
    - `sigalgs` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Lista separada por dois pontos de algoritmos de assinatura suportados. A lista pode conter algoritmos de resumo (`SHA256`, `MD5` etc.), algoritmos de chave pública (`RSA-PSS`, `ECDSA` etc.), combinação de ambos (por exemplo, 'RSA+SHA384') ou nomes de esquema TLS v1.3 (por exemplo, `rsa_pss_pss_sha512`). Consulte as [páginas do manual do OpenSSL](https://www.openssl.org/docs/man1.1.1/man3/SSL_CTX_set1_sigalgs_list) para obter mais informações.
    - `ciphers` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Especificação do conjunto de cifras, substituindo o padrão. Para obter mais informações, consulte [Modificando o conjunto de cifras TLS padrão](/pt/nodejs/api/tls#modifying-the-default-tls-cipher-suite). As cifras permitidas podem ser obtidas via [`tls.getCiphers()`](/pt/nodejs/api/tls#tlsgetciphers). Os nomes das cifras devem ser maiúsculos para que o OpenSSL os aceite.
    - `clientCertEngine` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome de um mecanismo OpenSSL que pode fornecer o certificado do cliente. **Obsoleto.**
    - `crl` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<Buffer[]\>](/pt/nodejs/api/buffer#class-buffer) CRLs formatadas em PEM (Listas de Revogação de Certificados).
    - `dhparam` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) `'auto'` ou parâmetros Diffie-Hellman personalizados, necessários para [sigilo direto](/pt/nodejs/api/tls#perfect-forward-secrecy) não ECDHE. Se omitidos ou inválidos, os parâmetros serão silenciosamente descartados e as cifras DHE não estarão disponíveis. O [sigilo direto](/pt/nodejs/api/tls#perfect-forward-secrecy) baseado em [ECDHE](https://en.wikipedia.org/wiki/Elliptic_curve_Diffie%E2%80%93Hellman) ainda estará disponível.
    - `ecdhCurve` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Uma string descrevendo uma curva nomeada ou uma lista separada por dois pontos de NIDs ou nomes de curva, por exemplo, `P-521:P-384:P-256`, para usar para o acordo de chave ECDH. Defina como `auto` para selecionar a curva automaticamente. Use [`crypto.getCurves()`](/pt/nodejs/api/crypto#cryptogetcurves) para obter uma lista de nomes de curva disponíveis. Nas versões recentes, `openssl ecparam -list_curves` também exibirá o nome e a descrição de cada curva elíptica disponível. **Padrão:** [`tls.DEFAULT_ECDH_CURVE`](/pt/nodejs/api/tls#tlsdefault_ecdh_curve).
    - `honorCipherOrder` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Tentar usar as preferências do conjunto de cifras do servidor em vez das do cliente. Quando `true`, faz com que `SSL_OP_CIPHER_SERVER_PREFERENCE` seja definido em `secureOptions`, consulte [Opções OpenSSL](/pt/nodejs/api/crypto#openssl-options) para obter mais informações.
    - `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<Buffer[]\>](/pt/nodejs/api/buffer#class-buffer) | [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Chaves privadas no formato PEM. PEM permite a opção de chaves privadas serem criptografadas. As chaves criptografadas serão descriptografadas com `options.passphrase`. Várias chaves usando algoritmos diferentes podem ser fornecidas como uma matriz de strings ou buffers de chave não criptografados, ou uma matriz de objetos no formato `{pem: \<string|buffer\>[, passphrase: \<string\>]}`. A forma do objeto só pode ocorrer em uma matriz. `object.passphrase` é opcional. As chaves criptografadas serão descriptografadas com `object.passphrase` se fornecido, ou `options.passphrase` se não for.
    - `privateKeyEngine` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome de um mecanismo OpenSSL para obter a chave privada. Deve ser usado em conjunto com `privateKeyIdentifier`. **Obsoleto.**
    - `privateKeyIdentifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Identificador de uma chave privada gerenciada por um mecanismo OpenSSL. Deve ser usado em conjunto com `privateKeyEngine`. Não deve ser definido junto com `key`, porque ambas as opções definem uma chave privada de maneiras diferentes. **Obsoleto.**
    - `maxVersion` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Opcionalmente, define a versão máxima do TLS para permitir. Um de `'TLSv1.3'`, `'TLSv1.2'`, `'TLSv1.1'` ou `'TLSv1'`. Não pode ser especificado junto com a opção `secureProtocol`; use um ou outro. **Padrão:** [`tls.DEFAULT_MAX_VERSION`](/pt/nodejs/api/tls#tlsdefault_max_version).
    - `minVersion` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Opcionalmente, defina a versão mínima do TLS para permitir. Um de `'TLSv1.3'`, `'TLSv1.2'`, `'TLSv1.1'` ou `'TLSv1'`. Não pode ser especificado junto com a opção `secureProtocol`; use um ou outro. Evite definir para menos de TLSv1.2, mas pode ser necessário para interoperabilidade. As versões anteriores ao TLSv1.2 podem exigir o rebaixamento do [Nível de segurança do OpenSSL](/pt/nodejs/api/tls#openssl-security-level). **Padrão:** [`tls.DEFAULT_MIN_VERSION`](/pt/nodejs/api/tls#tlsdefault_min_version).
    - `passphrase` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Senha compartilhada usada para uma única chave privada e/ou um PFX.
    - `pfx` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<Buffer[]\>](/pt/nodejs/api/buffer#class-buffer) | [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Chave privada e cadeia de certificados codificadas em PFX ou PKCS12. `pfx` é uma alternativa ao fornecimento de `key` e `cert` individualmente. PFX geralmente é criptografado, se for, `passphrase` será usado para descriptografá-lo. Vários PFX podem ser fornecidos como uma matriz de buffers PFX não criptografados ou uma matriz de objetos no formato `{buf: \<string|buffer\>[, passphrase: \<string\>]}`. A forma do objeto só pode ocorrer em uma matriz. `object.passphrase` é opcional. PFX criptografado será descriptografado com `object.passphrase` se fornecido, ou `options.passphrase` se não for.
    - `secureOptions` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Opcionalmente, afeta o comportamento do protocolo OpenSSL, o que geralmente não é necessário. Isso deve ser usado com cuidado, se for o caso! O valor é uma máscara de bits numérica das opções `SSL_OP_*` de [Opções OpenSSL](/pt/nodejs/api/crypto#openssl-options).
    - `secureProtocol` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Mecanismo legado para selecionar a versão do protocolo TLS a ser usada, não oferece suporte ao controle independente da versão mínima e máxima e não oferece suporte à limitação do protocolo ao TLSv1.3. Use `minVersion` e `maxVersion` em vez disso. Os valores possíveis estão listados como [SSL_METHODS](https://www.openssl.org/docs/man1.1.1/man7/ssl#Dealing-with-Protocol-Methods), use os nomes das funções como strings. Por exemplo, use `'TLSv1_1_method'` para forçar a versão 1.1 do TLS ou `'TLS_method'` para permitir qualquer versão do protocolo TLS até TLSv1.3. Não é recomendável usar versões TLS inferiores a 1.2, mas pode ser necessário para interoperabilidade. **Padrão:** nenhum, consulte `minVersion`.
    - `sessionIdContext` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Identificador opaco usado pelos servidores para garantir que o estado da sessão não seja compartilhado entre os aplicativos. Não usado pelos clientes.
    - `ticketKeys`: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) 48 bytes de dados pseudorraleatórios criptograficamente fortes. Consulte [Retomada de sessão](/pt/nodejs/api/tls#session-resumption) para obter mais informações.
    - `sessionTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de segundos após o qual uma sessão TLS criada pelo servidor não será mais retomável. Consulte [Retomada de sessão](/pt/nodejs/api/tls#session-resumption) para obter mais informações. **Padrão:** `300`.
  
 

[`tls.createServer()`](/pt/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener) define o valor padrão da opção `honorCipherOrder` como `true`, outras APIs que criam contextos seguros deixam-no não definido.

[`tls.createServer()`](/pt/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener) usa um valor de hash SHA1 truncado de 128 bits gerado a partir de `process.argv` como o valor padrão da opção `sessionIdContext`, outras APIs que criam contextos seguros não têm valor padrão.

O método `tls.createSecureContext()` cria um objeto `SecureContext`. Ele é utilizável como um argumento para várias APIs `tls`, como [`server.addContext()`](/pt/nodejs/api/tls#serveraddcontexthostname-context), mas não possui métodos públicos. O construtor [`tls.Server`](/pt/nodejs/api/tls#class-tlsserver) e o método [`tls.createServer()`](/pt/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener) não suportam a opção `secureContext`.

Uma chave é *necessária* para cifras que usam certificados. `key` ou `pfx` podem ser usados para fornecê-la.

Se a opção `ca` não for fornecida, o Node.js usará por padrão a [lista de CAs publicamente confiáveis da Mozilla](https://hg.mozilla.org/mozilla-central/raw-file/tip/security/nss/lib/ckfw/builtins/certdata.txt).

Parâmetros DHE personalizados são desaconselhados em favor da nova opção `dhparam: 'auto'`. Quando definido como `'auto'`, parâmetros DHE conhecidos de força suficiente serão selecionados automaticamente. Caso contrário, se necessário, `openssl dhparam` pode ser usado para criar parâmetros personalizados. O comprimento da chave deve ser maior ou igual a 1024 bits ou um erro será lançado. Embora 1024 bits sejam permitidos, use 2048 bits ou mais para maior segurança.


## `tls.createSecurePair([context][, isServer][, requestCert][, rejectUnauthorized][, options])` {#tlscreatesecurepaircontext-isserver-requestcert-rejectunauthorized-options}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v5.0.0 | As opções ALPN agora são suportadas. |
| v0.11.3 | Obsoleto desde: v0.11.3 |
| v0.3.2 | Adicionado em: v0.3.2 |
:::

::: danger [Estável: 0 - Obsoleto]
[Estável: 0](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 0](/pt/nodejs/api/documentation#stability-index) - Obsoleto: Use [`tls.TLSSocket`](/pt/nodejs/api/tls#class-tlstlssocket) em vez disso.
:::

- `context` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Um objeto de contexto seguro retornado por `tls.createSecureContext()`
- `isServer` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` para especificar que esta conexão TLS deve ser aberta como um servidor.
- `requestCert` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` para especificar se um servidor deve solicitar um certificado de um cliente conectado. Aplica-se apenas quando `isServer` é `true`.
- `rejectUnauthorized` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se não for `false`, um servidor rejeitará automaticamente clientes com certificados inválidos. Aplica-se apenas quando `isServer` é `true`.
- `options`
    - `enableTrace`: Consulte [`tls.createServer()`](/pt/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `secureContext`: Um objeto de contexto TLS de [`tls.createSecureContext()`](/pt/nodejs/api/tls#tlscreatesecurecontextoptions)
    - `isServer`: Se `true`, o socket TLS será instanciado no modo servidor. **Padrão:** `false`.
    - `server` [\<net.Server\>](/pt/nodejs/api/net#class-netserver) Uma instância de [`net.Server`](/pt/nodejs/api/net#class-netserver)
    - `requestCert`: Consulte [`tls.createServer()`](/pt/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `rejectUnauthorized`: Consulte [`tls.createServer()`](/pt/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `ALPNProtocols`: Consulte [`tls.createServer()`](/pt/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `SNICallback`: Consulte [`tls.createServer()`](/pt/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `session` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) Uma instância de `Buffer` contendo uma sessão TLS.
    - `requestOCSP` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, especifica que a extensão de solicitação de status OCSP será adicionada ao client hello e um evento `'OCSPResponse'` será emitido no socket antes de estabelecer uma comunicação segura.



Cria um novo objeto de par seguro com dois fluxos, um dos quais lê e grava os dados criptografados e o outro dos quais lê e grava os dados em texto não criptografado. Geralmente, o fluxo criptografado é canalizado para/de um fluxo de dados criptografados de entrada e o fluxo de texto não criptografado é usado como um substituto para o fluxo criptografado inicial.

`tls.createSecurePair()` retorna um objeto `tls.SecurePair` com propriedades de fluxo `cleartext` e `encrypted`.

Usar `cleartext` tem a mesma API que [`tls.TLSSocket`](/pt/nodejs/api/tls#class-tlstlssocket).

O método `tls.createSecurePair()` agora está obsoleto em favor de `tls.TLSSocket()`. Por exemplo, o código:

```js [ESM]
pair = tls.createSecurePair(/* ... */);
pair.encrypted.pipe(socket);
socket.pipe(pair.encrypted);
```
pode ser substituído por:

```js [ESM]
secureSocket = tls.TLSSocket(socket, options);
```
onde `secureSocket` tem a mesma API que `pair.cleartext`.


## `tls.createServer([options][, secureConnectionListener])` {#tlscreateserveroptions-secureconnectionlistener}


::: info [Histórico]
| Versão  | Mudanças                                                                                                                                                             |
| :-------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| v22.4.0, v20.16.0 | A opção `clientCertEngine` depende do suporte a engine customizada no OpenSSL, que está obsoleta no OpenSSL 3.                                                      |
| v19.0.0 | Se `ALPNProtocols` estiver definido, conexões de entrada que enviam uma extensão ALPN sem protocolos suportados são encerradas com um alerta fatal `no_application_protocol`. |
| v20.4.0, v18.19.0 | O parâmetro `options` agora pode incluir `ALPNCallback`.                                                                                                        |
| v12.3.0 | O parâmetro `options` agora suporta opções `net.createServer()`.                                                                                                     |
| v9.3.0  | O parâmetro `options` agora pode incluir `clientCertEngine`.                                                                                                           |
| v8.0.0  | A opção `ALPNProtocols` agora pode ser um `TypedArray` ou `DataView`.                                                                                                   |
| v5.0.0  | As opções ALPN agora são suportadas.                                                                                                                                    |
| v0.3.2  | Adicionado em: v0.3.2                                                                                                                                                    |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ALPNProtocols`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer[]\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Um array de strings, `Buffer`s, `TypedArray`s ou `DataView`s, ou um único `Buffer`, `TypedArray` ou `DataView` contendo os protocolos ALPN suportados. `Buffer`s devem ter o formato `[len][name][len][name]...` e.g. `0x05hello0x05world`, onde o primeiro byte é o tamanho do próximo nome de protocolo. Passar um array geralmente é muito mais simples, e.g. `['hello', 'world']`. (Os protocolos devem ser ordenados por sua prioridade.)
    - `ALPNCallback`: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Se definido, isso será chamado quando um cliente abrir uma conexão usando a extensão ALPN. Um argumento será passado para o callback: um objeto contendo os campos `servername` e `protocols`, contendo respectivamente o nome do servidor da extensão SNI (se houver) e um array de strings de nome de protocolo ALPN. O callback deve retornar uma das strings listadas em `protocols`, que será retornada ao cliente como o protocolo ALPN selecionado, ou `undefined`, para rejeitar a conexão com um alerta fatal. Se uma string for retornada que não corresponda a um dos protocolos ALPN do cliente, um erro será lançado. Esta opção não pode ser usada com a opção `ALPNProtocols`, e definir ambas as opções lançará um erro.
    - `clientCertEngine` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome de um engine OpenSSL que pode fornecer o certificado do cliente. **Obsoleto.**
    - `enableTrace` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, [`tls.TLSSocket.enableTrace()`](/pt/nodejs/api/tls#tlssocketenabletrace) será chamado em novas conexões. O rastreamento pode ser ativado após o estabelecimento da conexão segura, mas esta opção deve ser usada para rastrear a configuração da conexão segura. **Padrão:** `false`.
    - `handshakeTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Aborta a conexão se o handshake SSL/TLS não terminar no número especificado de milissegundos. Um `'tlsClientError'` é emitido no objeto `tls.Server` sempre que um handshake atinge o tempo limite. **Padrão:** `120000` (120 segundos).
    - `rejectUnauthorized` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se não for `false`, o servidor rejeitará qualquer conexão que não seja autorizada com a lista de CAs fornecidas. Esta opção só tem efeito se `requestCert` for `true`. **Padrão:** `true`.
    - `requestCert` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, o servidor solicitará um certificado de clientes que se conectam e tentará verificar esse certificado. **Padrão:** `false`.
    - `sessionTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de segundos após o qual uma sessão TLS criada pelo servidor não será mais retomável. Consulte [Retomada de Sessão](/pt/nodejs/api/tls#session-resumption) para obter mais informações. **Padrão:** `300`.
    - `SNICallback(servername, callback)` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Uma função que será chamada se o cliente suportar a extensão SNI TLS. Dois argumentos serão passados quando chamados: `servername` e `callback`. `callback` é um callback de primeiro erro que recebe dois argumentos opcionais: `error` e `ctx`. `ctx`, se fornecido, é uma instância de `SecureContext`. [`tls.createSecureContext()`](/pt/nodejs/api/tls#tlscreatesecurecontextoptions) pode ser usado para obter um `SecureContext` adequado. Se `callback` for chamado com um argumento `ctx` falso, o contexto seguro padrão do servidor será usado. Se `SNICallback` não foi fornecido, o callback padrão com API de alto nível será usado (veja abaixo).
    - `ticketKeys`: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) 48 bytes de dados pseudoaleatórios criptograficamente fortes. Consulte [Retomada de Sessão](/pt/nodejs/api/tls#session-resumption) para obter mais informações.
    - `pskCallback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Para negociação TLS-PSK, consulte [Chaves Pré-Compartilhadas](/pt/nodejs/api/tls#pre-shared-keys).
    - `pskIdentityHint` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) dica opcional para enviar a um cliente para ajudar na seleção da identidade durante a negociação TLS-PSK. Será ignorado no TLS 1.3. Ao falhar ao definir pskIdentityHint `'tlsClientError'` será emitido com o código `'ERR_TLS_PSK_SET_IDENTITY_HINT_FAILED'`.
    - ...: Qualquer opção de [`tls.createSecureContext()`](/pt/nodejs/api/tls#tlscreatesecurecontextoptions) pode ser fornecida. Para servidores, as opções de identidade (`pfx`, `key`/`cert` ou `pskCallback`) são geralmente necessárias.
    - ...: Qualquer opção de [`net.createServer()`](/pt/nodejs/api/net#netcreateserveroptions-connectionlistener) pode ser fornecida.
  
 
- `secureConnectionListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retorna: [\<tls.Server\>](/pt/nodejs/api/tls#class-tlsserver)

Cria um novo [`tls.Server`](/pt/nodejs/api/tls#class-tlsserver). O `secureConnectionListener`, se fornecido, é automaticamente definido como um listener para o evento [`'secureConnection'`](/pt/nodejs/api/tls#event-secureconnection).

As opções `ticketKeys` são automaticamente compartilhadas entre os workers do módulo `node:cluster`.

O exemplo a seguir ilustra um servidor de eco simples:



::: code-group
```js [ESM]
import { createServer } from 'node:tls';
import { readFileSync } from 'node:fs';

const options = {
  key: readFileSync('server-key.pem'),
  cert: readFileSync('server-cert.pem'),

  // Isso é necessário apenas se estiver usando autenticação de certificado do cliente.
  requestCert: true,

  // Isso é necessário apenas se o cliente usar um certificado autoassinado.
  ca: [ readFileSync('client-cert.pem') ],
};

const server = createServer(options, (socket) => {
  console.log('server connected',
              socket.authorized ? 'authorized' : 'unauthorized');
  socket.write('welcome!\n');
  socket.setEncoding('utf8');
  socket.pipe(socket);
});
server.listen(8000, () => {
  console.log('server bound');
});
```

```js [CJS]
const { createServer } = require('node:tls');
const { readFileSync } = require('node:fs');

const options = {
  key: readFileSync('server-key.pem'),
  cert: readFileSync('server-cert.pem'),

  // Isso é necessário apenas se estiver usando autenticação de certificado do cliente.
  requestCert: true,

  // Isso é necessário apenas se o cliente usar um certificado autoassinado.
  ca: [ readFileSync('client-cert.pem') ],
};

const server = createServer(options, (socket) => {
  console.log('server connected',
              socket.authorized ? 'authorized' : 'unauthorized');
  socket.write('welcome!\n');
  socket.setEncoding('utf8');
  socket.pipe(socket);
});
server.listen(8000, () => {
  console.log('server bound');
});
```
:::

Para gerar o certificado e a chave para este exemplo, execute:

```bash [BASH]
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
  -keyout server-key.pem -out server-cert.pem
```
Então, para gerar o certificado `client-cert.pem` para este exemplo, execute:

```bash [BASH]
openssl pkcs12 -certpbe AES-256-CBC -export -out client-cert.pem \
  -inkey server-key.pem -in server-cert.pem
```
O servidor pode ser testado conectando-se a ele usando o cliente de exemplo de [`tls.connect()`](/pt/nodejs/api/tls#tlsconnectoptions-callback).


## `tls.getCiphers()` {#tlsgetciphers}

**Adicionado em: v0.10.2**

- Retorna: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retorna um array com os nomes das cifras TLS suportadas. Os nomes estão em minúsculas por razões históricas, mas devem ser convertidos para maiúsculas para serem usados na opção `ciphers` de [`tls.createSecureContext()`](/pt/nodejs/api/tls#tlscreatesecurecontextoptions).

Nem todas as cifras suportadas são habilitadas por padrão. Consulte [Modificando o conjunto de cifras TLS padrão](/pt/nodejs/api/tls#modifying-the-default-tls-cipher-suite).

Nomes de cifras que começam com `'tls_'` são para TLSv1.3, todos os outros são para TLSv1.2 e abaixo.

```js [ESM]
console.log(tls.getCiphers()); // ['aes128-gcm-sha256', 'aes128-sha', ...]
```
## `tls.rootCertificates` {#tlsrootcertificates}

**Adicionado em: v12.3.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Um array imutável de strings representando os certificados de raiz (em formato PEM) da loja Mozilla CA embutida, conforme fornecida pela versão atual do Node.js.

A loja CA embutida, conforme fornecida pelo Node.js, é um snapshot da loja Mozilla CA que é fixada no momento do lançamento. É idêntica em todas as plataformas suportadas.

## `tls.DEFAULT_ECDH_CURVE` {#tlsdefault_ecdh_curve}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v10.0.0 | O valor padrão foi alterado para `'auto'`. |
| v0.11.13 | Adicionado em: v0.11.13 |
:::

O nome da curva padrão a ser usado para o acordo de chave ECDH em um servidor tls. O valor padrão é `'auto'`. Consulte [`tls.createSecureContext()`](/pt/nodejs/api/tls#tlscreatesecurecontextoptions) para obter mais informações.

## `tls.DEFAULT_MAX_VERSION` {#tlsdefault_max_version}

**Adicionado em: v11.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O valor padrão da opção `maxVersion` de [`tls.createSecureContext()`](/pt/nodejs/api/tls#tlscreatesecurecontextoptions). Pode ser atribuído a qualquer uma das versões de protocolo TLS suportadas, `'TLSv1.3'`, `'TLSv1.2'`, `'TLSv1.1'` ou `'TLSv1'`. **Padrão:** `'TLSv1.3'`, a menos que seja alterado usando as opções da CLI. Usar `--tls-max-v1.2` define o padrão para `'TLSv1.2'`. Usar `--tls-max-v1.3` define o padrão para `'TLSv1.3'`. Se várias das opções forem fornecidas, o máximo mais alto será usado.


## `tls.DEFAULT_MIN_VERSION` {#tlsdefault_min_version}

**Adicionado em: v11.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O valor padrão da opção `minVersion` de [`tls.createSecureContext()`](/pt/nodejs/api/tls#tlscreatesecurecontextoptions). Pode ser atribuído a qualquer uma das versões de protocolo TLS suportadas, `'TLSv1.3'`, `'TLSv1.2'`, `'TLSv1.1'` ou `'TLSv1'`. Versões anteriores ao TLSv1.2 podem exigir o rebaixamento do [Nível de Segurança OpenSSL](/pt/nodejs/api/tls#openssl-security-level). **Padrão:** `'TLSv1.2'`, a menos que alterado usando opções de CLI. Usar `--tls-min-v1.0` define o padrão para `'TLSv1'`. Usar `--tls-min-v1.1` define o padrão para `'TLSv1.1'`. Usar `--tls-min-v1.3` define o padrão para `'TLSv1.3'`. Se várias opções forem fornecidas, o mínimo mais baixo será usado.

## `tls.DEFAULT_CIPHERS` {#tlsdefault_ciphers}

**Adicionado em: v19.8.0, v18.16.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O valor padrão da opção `ciphers` de [`tls.createSecureContext()`](/pt/nodejs/api/tls#tlscreatesecurecontextoptions). Pode ser atribuído a qualquer uma das cifras OpenSSL suportadas. O padrão é o conteúdo de `crypto.constants.defaultCoreCipherList`, a menos que seja alterado usando opções de CLI usando `--tls-default-ciphers`.

