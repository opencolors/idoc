---
title: Documentação do Módulo OS do Node.js
description: O módulo OS do Node.js fornece vários métodos utilitários relacionados ao sistema operacional. Pode ser usado para interagir com o sistema operacional subjacente, obter informações do sistema e realizar operações no nível do sistema.
head:
  - - meta
    - name: og:title
      content: Documentação do Módulo OS do Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: O módulo OS do Node.js fornece vários métodos utilitários relacionados ao sistema operacional. Pode ser usado para interagir com o sistema operacional subjacente, obter informações do sistema e realizar operações no nível do sistema.
  - - meta
    - name: twitter:title
      content: Documentação do Módulo OS do Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: O módulo OS do Node.js fornece vários métodos utilitários relacionados ao sistema operacional. Pode ser usado para interagir com o sistema operacional subjacente, obter informações do sistema e realizar operações no nível do sistema.
---


# OS {#os}

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável
:::

**Código Fonte:** [lib/os.js](https://github.com/nodejs/node/blob/v23.5.0/lib/os.js)

O módulo `node:os` fornece métodos e propriedades de utilidade relacionados ao sistema operacional. Ele pode ser acessado usando:

::: code-group
```js [ESM]
import os from 'node:os';
```

```js [CJS]
const os = require('node:os');
```
:::

## `os.EOL` {#oseol}

**Adicionado em: v0.7.8**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

O marcador de fim de linha específico do sistema operacional.

- `\n` no POSIX
- `\r\n` no Windows

## `os.availableParallelism()` {#osavailableparallelism}

**Adicionado em: v19.4.0, v18.14.0**

- Retorna: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Retorna uma estimativa da quantidade padrão de paralelismo que um programa deve usar. Sempre retorna um valor maior que zero.

Esta função é um pequeno wrapper sobre o [`uv_available_parallelism()`](https://docs.libuv.org/en/v1.x/misc#c.uv_available_parallelism) do libuv.

## `os.arch()` {#osarch}

**Adicionado em: v0.5.0**

- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retorna a arquitetura da CPU do sistema operacional para a qual o binário Node.js foi compilado. Os valores possíveis são `'arm'`, `'arm64'`, `'ia32'`, `'loong64'`, `'mips'`, `'mipsel'`, `'ppc'`, `'ppc64'`, `'riscv64'`, `'s390'`, `'s390x'` e `'x64'`.

O valor de retorno é equivalente a [`process.arch`](/pt/nodejs/api/process#processarch).

## `os.constants` {#osconstants}

**Adicionado em: v6.3.0**

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Contém constantes específicas do sistema operacional comumente usadas para códigos de erro, sinais de processo e assim por diante. As constantes específicas definidas são descritas em [Constantes do SO](/pt/nodejs/api/os#os-constants).

## `os.cpus()` {#oscpus}

**Adicionado em: v0.3.3**

- Retorna: [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Retorna um array de objetos contendo informações sobre cada núcleo de CPU lógico. O array estará vazio se nenhuma informação da CPU estiver disponível, como se o sistema de arquivos `/proc` não estiver disponível.

As propriedades incluídas em cada objeto incluem:

- `model` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `speed` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) (em MHz)
- `times` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `user` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de milissegundos que a CPU gastou no modo de usuário.
    - `nice` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de milissegundos que a CPU gastou no modo nice.
    - `sys` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de milissegundos que a CPU gastou no modo sys.
    - `idle` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de milissegundos que a CPU gastou no modo idle.
    - `irq` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O número de milissegundos que a CPU gastou no modo irq.

```js [ESM]
[
  {
    model: 'Intel(R) Core(TM) i7 CPU         860  @ 2.80GHz',
    speed: 2926,
    times: {
      user: 252020,
      nice: 0,
      sys: 30340,
      idle: 1070356870,
      irq: 0,
    },
  },
  {
    model: 'Intel(R) Core(TM) i7 CPU         860  @ 2.80GHz',
    speed: 2926,
    times: {
      user: 306960,
      nice: 0,
      sys: 26980,
      idle: 1071569080,
      irq: 0,
    },
  },
  {
    model: 'Intel(R) Core(TM) i7 CPU         860  @ 2.80GHz',
    speed: 2926,
    times: {
      user: 248450,
      nice: 0,
      sys: 21750,
      idle: 1070919370,
      irq: 0,
    },
  },
  {
    model: 'Intel(R) Core(TM) i7 CPU         860  @ 2.80GHz',
    speed: 2926,
    times: {
      user: 256880,
      nice: 0,
      sys: 19430,
      idle: 1070905480,
      irq: 20,
    },
  },
]
```

Os valores `nice` são apenas POSIX. No Windows, os valores `nice` de todos os processadores são sempre 0.

`os.cpus().length` não deve ser usado para calcular a quantidade de paralelismo disponível para um aplicativo. Use [`os.availableParallelism()`](/pt/nodejs/api/os#osavailableparallelism) para esta finalidade.


## `os.devNull` {#osdevnull}

**Adicionado em: v16.3.0, v14.18.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

O caminho do arquivo específico da plataforma do dispositivo nulo.

- `\\.\nul` no Windows
- `/dev/null` no POSIX

## `os.endianness()` {#osendianness}

**Adicionado em: v0.9.4**

- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retorna uma string identificando a endianness da CPU para a qual o binário Node.js foi compilado.

Os valores possíveis são `'BE'` para big endian e `'LE'` para little endian.

## `os.freemem()` {#osfreemem}

**Adicionado em: v0.3.3**

- Retorna: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Retorna a quantidade de memória livre do sistema em bytes como um inteiro.

## `os.getPriority([pid])` {#osgetprioritypid}

**Adicionado em: v10.10.0**

- `pid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O ID do processo para o qual recuperar a prioridade de agendamento. **Padrão:** `0`.
- Retorna: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Retorna a prioridade de agendamento para o processo especificado por `pid`. Se `pid` não for fornecido ou for `0`, a prioridade do processo atual será retornada.

## `os.homedir()` {#oshomedir}

**Adicionado em: v2.3.0**

- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retorna o caminho da string para o diretório inicial do usuário atual.

No POSIX, ele usa a variável de ambiente `$HOME` se definida. Caso contrário, ele usa o [UID efetivo](https://en.wikipedia.org/wiki/User_identifier#Effective_user_ID) para procurar o diretório inicial do usuário.

No Windows, ele usa a variável de ambiente `USERPROFILE` se definida. Caso contrário, ele usa o caminho para o diretório de perfil do usuário atual.

## `os.hostname()` {#oshostname}

**Adicionado em: v0.3.3**

- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retorna o nome do host do sistema operacional como uma string.


## `os.loadavg()` {#osloadavg}

**Adicionado em: v0.3.3**

- Retorna: [\<number[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Retorna um array contendo as médias de carga de 1, 5 e 15 minutos.

A média de carga é uma medida da atividade do sistema calculada pelo sistema operacional e expressa como um número fracionário.

A média de carga é um conceito específico do Unix. No Windows, o valor de retorno é sempre `[0, 0, 0]`.

## `os.machine()` {#osmachine}

**Adicionado em: v18.9.0, v16.18.0**

- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retorna o tipo de máquina como uma string, como `arm`, `arm64`, `aarch64`, `mips`, `mips64`, `ppc64`, `ppc64le`, `s390`, `s390x`, `i386`, `i686`, `x86_64`.

Em sistemas POSIX, o tipo de máquina é determinado chamando [`uname(3)`](https://linux.die.net/man/3/uname). No Windows, `RtlGetVersion()` é usado e, se não estiver disponível, `GetVersionExW()` será usado. Consulte [https://en.wikipedia.org/wiki/Uname#Examples](https://en.wikipedia.org/wiki/Uname#Examples) para obter mais informações.

## `os.networkInterfaces()` {#osnetworkinterfaces}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v18.4.0 | A propriedade `family` agora retorna uma string em vez de um número. |
| v18.0.0 | A propriedade `family` agora retorna um número em vez de uma string. |
| v0.6.0 | Adicionado em: v0.6.0 |
:::

- Retorna: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Retorna um objeto contendo interfaces de rede que receberam um endereço de rede.

Cada chave no objeto retornado identifica uma interface de rede. O valor associado é um array de objetos que descrevem cada um um endereço de rede atribuído.

As propriedades disponíveis no objeto de endereço de rede atribuído incluem:

- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O endereço IPv4 ou IPv6 atribuído
- `netmask` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A máscara de rede IPv4 ou IPv6
- `family` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `IPv4` ou `IPv6`
- `mac` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O endereço MAC da interface de rede
- `internal` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` se a interface de rede for um loopback ou interface semelhante que não seja acessível remotamente; caso contrário, `false`
- `scopeid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O ID de escopo IPv6 numérico (especificado apenas quando `family` é `IPv6`)
- `cidr` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O endereço IPv4 ou IPv6 atribuído com o prefixo de roteamento na notação CIDR. Se o `netmask` for inválido, esta propriedade será definida como `null`.

```js [ESM]
{
  lo: [
    {
      address: '127.0.0.1',
      netmask: '255.0.0.0',
      family: 'IPv4',
      mac: '00:00:00:00:00:00',
      internal: true,
      cidr: '127.0.0.1/8'
    },
    {
      address: '::1',
      netmask: 'ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff',
      family: 'IPv6',
      mac: '00:00:00:00:00:00',
      scopeid: 0,
      internal: true,
      cidr: '::1/128'
    }
  ],
  eth0: [
    {
      address: '192.168.1.108',
      netmask: '255.255.255.0',
      family: 'IPv4',
      mac: '01:02:03:0a:0b:0c',
      internal: false,
      cidr: '192.168.1.108/24'
    },
    {
      address: 'fe80::a00:27ff:fe4e:66a1',
      netmask: 'ffff:ffff:ffff:ffff::',
      family: 'IPv6',
      mac: '01:02:03:0a:0b:0c',
      scopeid: 1,
      internal: false,
      cidr: 'fe80::a00:27ff:fe4e:66a1/64'
    }
  ]
}
```

## `os.platform()` {#osplatform}

**Adicionado em: v0.5.0**

- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retorna uma string identificando a plataforma do sistema operacional para a qual o binário do Node.js foi compilado. O valor é definido em tempo de compilação. Os valores possíveis são `'aix'`, `'darwin'`, `'freebsd'`, `'linux'`, `'openbsd'`, `'sunos'` e `'win32'`.

O valor de retorno é equivalente a [`process.platform`](/pt/nodejs/api/process#processplatform).

O valor `'android'` também pode ser retornado se o Node.js for construído no sistema operacional Android. [O suporte ao Android é experimental](https://github.com/nodejs/node/blob/HEAD/BUILDING.md#android).

## `os.release()` {#osrelease}

**Adicionado em: v0.3.3**

- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retorna o sistema operacional como uma string.

Em sistemas POSIX, a versão do sistema operacional é determinada chamando [`uname(3)`](https://linux.die.net/man/3/uname). No Windows, `GetVersionExW()` é usado. Consulte [https://en.wikipedia.org/wiki/Uname#Examples](https://en.wikipedia.org/wiki/Uname#Examples) para obter mais informações.

## `os.setPriority([pid, ]priority)` {#ossetprioritypid-priority}

**Adicionado em: v10.10.0**

- `pid` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O ID do processo para definir a prioridade de agendamento. **Padrão:** `0`.
- `priority` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) A prioridade de agendamento a ser atribuída ao processo.

Tenta definir a prioridade de agendamento para o processo especificado por `pid`. Se `pid` não for fornecido ou for `0`, o ID do processo atual é usado.

A entrada `priority` deve ser um inteiro entre `-20` (alta prioridade) e `19` (baixa prioridade). Devido às diferenças entre os níveis de prioridade do Unix e as classes de prioridade do Windows, `priority` é mapeado para uma das seis constantes de prioridade em `os.constants.priority`. Ao recuperar um nível de prioridade do processo, esse mapeamento de intervalo pode fazer com que o valor de retorno seja ligeiramente diferente no Windows. Para evitar confusão, defina `priority` para uma das constantes de prioridade.

No Windows, definir a prioridade para `PRIORITY_HIGHEST` requer privilégios de usuário elevados. Caso contrário, a prioridade definida será reduzida silenciosamente para `PRIORITY_HIGH`.


## `os.tmpdir()` {#ostmpdir}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v2.0.0 | Esta função agora é consistente entre plataformas e não retorna mais um caminho com uma barra final em nenhuma plataforma. |
| v0.9.9 | Adicionado em: v0.9.9 |
:::

- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retorna o diretório padrão do sistema operacional para arquivos temporários como uma string.

No Windows, o resultado pode ser substituído pelas variáveis de ambiente `TEMP` e `TMP`, e `TEMP` tem precedência sobre `TMP`. Se nenhum estiver definido, o padrão é `%SystemRoot%\temp` ou `%windir%\temp`.

Em plataformas não Windows, as variáveis de ambiente `TMPDIR`, `TMP` e `TEMP` serão verificadas para substituir o resultado deste método, na ordem descrita. Se nenhuma delas estiver definida, o padrão é `/tmp`.

Algumas distribuições de sistemas operacionais configuram `TMPDIR` (não Windows) ou `TEMP` e `TMP` (Windows) por padrão, sem configurações adicionais pelos administradores do sistema. O resultado de `os.tmpdir()` normalmente reflete a preferência do sistema, a menos que seja explicitamente substituído pelos usuários.

## `os.totalmem()` {#ostotalmem}

**Adicionado em: v0.3.3**

- Retorna: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Retorna a quantidade total de memória do sistema em bytes como um inteiro.

## `os.type()` {#ostype}

**Adicionado em: v0.3.3**

- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retorna o nome do sistema operacional conforme retornado por [`uname(3)`](https://linux.die.net/man/3/uname). Por exemplo, retorna `'Linux'` no Linux, `'Darwin'` no macOS e `'Windows_NT'` no Windows.

Consulte [https://en.wikipedia.org/wiki/Uname#Examples](https://en.wikipedia.org/wiki/Uname#Examples) para obter informações adicionais sobre a saída da execução de [`uname(3)`](https://linux.die.net/man/3/uname) em vários sistemas operacionais.

## `os.uptime()` {#osuptime}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v10.0.0 | O resultado desta função não contém mais um componente de fração no Windows. |
| v0.3.3 | Adicionado em: v0.3.3 |
:::

- Retorna: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Retorna o tempo de atividade do sistema em número de segundos.


## `os.userInfo([options])` {#osuserinfooptions}

**Adicionado em: v6.0.0**

- `options` [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Codificação de caracteres usada para interpretar as strings resultantes. Se `encoding` estiver definido como `'buffer'`, os valores de `username`, `shell` e `homedir` serão instâncias de `Buffer`. **Padrão:** `'utf8'`.
  
 
- Retorna: [\<Objeto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Retorna informações sobre o usuário atualmente efetivo. Em plataformas POSIX, este é normalmente um subconjunto do arquivo de senha. O objeto retornado inclui o `username`, `uid`, `gid`, `shell` e `homedir`. No Windows, os campos `uid` e `gid` são `-1` e `shell` é `null`.

O valor de `homedir` retornado por `os.userInfo()` é fornecido pelo sistema operacional. Isso difere do resultado de `os.homedir()`, que consulta as variáveis de ambiente para o diretório inicial antes de recorrer à resposta do sistema operacional.

Lança um [`SystemError`](/pt/nodejs/api/errors#class-systemerror) se um usuário não tiver `username` ou `homedir`.

## `os.version()` {#osversion}

**Adicionado em: v13.11.0, v12.17.0**

- Retorna: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retorna uma string identificando a versão do kernel.

Em sistemas POSIX, a versão do sistema operacional é determinada chamando [`uname(3)`](https://linux.die.net/man/3/uname). No Windows, `RtlGetVersion()` é usado e, se não estiver disponível, `GetVersionExW()` será usado. Veja [https://en.wikipedia.org/wiki/Uname#Examples](https://en.wikipedia.org/wiki/Uname#Examples) para obter mais informações.

## Constantes do SO {#os-constants}

As seguintes constantes são exportadas por `os.constants`.

Nem todas as constantes estarão disponíveis em todos os sistemas operacionais.

### Constantes de sinal {#signal-constants}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v5.11.0 | Adicionado suporte para `SIGINFO`. |
:::

As seguintes constantes de sinal são exportadas por `os.constants.signals`.

| Constante | Descrição |
| --- | --- |
| `SIGHUP` | Enviado para indicar quando um terminal de controle é fechado ou um processo pai sai. |
| `SIGINT` | Enviado para indicar quando um usuário deseja interromper um processo ( + ). |
| `SIGQUIT` | Enviado para indicar quando um usuário deseja encerrar um processo e realizar um despejo de memória (core dump). |
| `SIGILL` | Enviado a um processo para notificá-lo de que tentou executar uma instrução ilegal, malformada, desconhecida ou privilegiada. |
| `SIGTRAP` | Enviado a um processo quando uma exceção ocorreu. |
| `SIGABRT` | Enviado a um processo para solicitar que ele aborte. |
| `SIGIOT` | Sinônimo de `SIGABRT` |
| `SIGBUS` | Enviado a um processo para notificá-lo de que causou um erro de barramento. |
| `SIGFPE` | Enviado a um processo para notificá-lo de que realizou uma operação aritmética ilegal. |
| `SIGKILL` | Enviado a um processo para encerrá-lo imediatamente. |
| `SIGUSR1` `SIGUSR2` | Enviado a um processo para identificar condições definidas pelo usuário. |
| `SIGSEGV` | Enviado a um processo para notificá-lo de uma falha de segmentação. |
| `SIGPIPE` | Enviado a um processo quando ele tentou gravar em um pipe desconectado. |
| `SIGALRM` | Enviado a um processo quando um temporizador do sistema expira. |
| `SIGTERM` | Enviado a um processo para solicitar o encerramento. |
| `SIGCHLD` | Enviado a um processo quando um processo filho é encerrado. |
| `SIGSTKFLT` | Enviado a um processo para indicar uma falha de pilha em um coprocessador. |
| `SIGCONT` | Enviado para instruir o sistema operacional a continuar um processo pausado. |
| `SIGSTOP` | Enviado para instruir o sistema operacional a interromper um processo. |
| `SIGTSTP` | Enviado a um processo para solicitar que ele pare. |
| `SIGBREAK` | Enviado para indicar quando um usuário deseja interromper um processo. |
| `SIGTTIN` | Enviado a um processo quando ele lê do TTY enquanto está em segundo plano. |
| `SIGTTOU` | Enviado a um processo quando ele grava no TTY enquanto está em segundo plano. |
| `SIGURG` | Enviado a um processo quando um soquete tem dados urgentes para ler. |
| `SIGXCPU` | Enviado a um processo quando ele excedeu seu limite de uso da CPU. |
| `SIGXFSZ` | Enviado a um processo quando ele aumenta um arquivo maior que o máximo permitido. |
| `SIGVTALRM` | Enviado a um processo quando um temporizador virtual expirou. |
| `SIGPROF` | Enviado a um processo quando um temporizador do sistema expirou. |
| `SIGWINCH` | Enviado a um processo quando o terminal de controle mudou seu tamanho. |
| `SIGIO` | Enviado a um processo quando E/S está disponível. |
| `SIGPOLL` | Sinônimo de `SIGIO` |
| `SIGLOST` | Enviado a um processo quando um bloqueio de arquivo foi perdido. |
| `SIGPWR` | Enviado a um processo para notificar uma falha de energia. |
| `SIGINFO` | Sinônimo de `SIGPWR` |
| `SIGSYS` | Enviado a um processo para notificar um argumento inválido. |
| `SIGUNUSED` | Sinônimo de `SIGSYS` |


### Constantes de erro {#error-constants}

As seguintes constantes de erro são exportadas por `os.constants.errno`.

#### Constantes de erro POSIX {#posix-error-constants}

| Constante | Descrição |
| --- | --- |
| `E2BIG` | Indica que a lista de argumentos é maior do que o esperado. |
| `EACCES` | Indica que a operação não tinha permissões suficientes. |
| `EADDRINUSE` | Indica que o endereço de rede já está em uso. |
| `EADDRNOTAVAIL` | Indica que o endereço de rede está atualmente indisponível para uso. |
| `EAFNOSUPPORT` | Indica que a família de endereços de rede não é suportada. |
| `EAGAIN` | Indica que não há dados disponíveis e para tentar a operação novamente mais tarde. |
| `EALREADY` | Indica que o socket já tem uma conexão pendente em andamento. |
| `EBADF` | Indica que um descritor de arquivo não é válido. |
| `EBADMSG` | Indica uma mensagem de dados inválida. |
| `EBUSY` | Indica que um dispositivo ou recurso está ocupado. |
| `ECANCELED` | Indica que uma operação foi cancelada. |
| `ECHILD` | Indica que não há processos filhos. |
| `ECONNABORTED` | Indica que a conexão de rede foi abortada. |
| `ECONNREFUSED` | Indica que a conexão de rede foi recusada. |
| `ECONNRESET` | Indica que a conexão de rede foi redefinida. |
| `EDEADLK` | Indica que um deadlock de recurso foi evitado. |
| `EDESTADDRREQ` | Indica que um endereço de destino é necessário. |
| `EDOM` | Indica que um argumento está fora do domínio da função. |
| `EDQUOT` | Indica que a cota de disco foi excedida. |
| `EEXIST` | Indica que o arquivo já existe. |
| `EFAULT` | Indica um endereço de ponteiro inválido. |
| `EFBIG` | Indica que o arquivo é muito grande. |
| `EHOSTUNREACH` | Indica que o host está inacessível. |
| `EIDRM` | Indica que o identificador foi removido. |
| `EILSEQ` | Indica uma sequência de bytes ilegal. |
| `EINPROGRESS` | Indica que uma operação já está em andamento. |
| `EINTR` | Indica que uma chamada de função foi interrompida. |
| `EINVAL` | Indica que um argumento inválido foi fornecido. |
| `EIO` | Indica um erro de I/O não especificado. |
| `EISCONN` | Indica que o socket está conectado. |
| `EISDIR` | Indica que o caminho é um diretório. |
| `ELOOP` | Indica muitos níveis de links simbólicos em um caminho. |
| `EMFILE` | Indica que existem muitos arquivos abertos. |
| `EMLINK` | Indica que existem muitos links rígidos para um arquivo. |
| `EMSGSIZE` | Indica que a mensagem fornecida é muito longa. |
| `EMULTIHOP` | Indica que um multihop foi tentado. |
| `ENAMETOOLONG` | Indica que o nome do arquivo é muito longo. |
| `ENETDOWN` | Indica que a rede está inativa. |
| `ENETRESET` | Indica que a conexão foi abortada pela rede. |
| `ENETUNREACH` | Indica que a rede está inacessível. |
| `ENFILE` | Indica muitos arquivos abertos no sistema. |
| `ENOBUFS` | Indica que não há espaço de buffer disponível. |
| `ENODATA` | Indica que nenhuma mensagem está disponível na fila de leitura do cabeçalho do fluxo. |
| `ENODEV` | Indica que não existe tal dispositivo. |
| `ENOENT` | Indica que não existe tal arquivo ou diretório. |
| `ENOEXEC` | Indica um erro de formato exec. |
| `ENOLCK` | Indica que não há bloqueios disponíveis. |
| `ENOLINK` | Indicações de que um link foi cortado. |
| `ENOMEM` | Indica que não há espaço suficiente. |
| `ENOMSG` | Indica que não há mensagem do tipo desejado. |
| `ENOPROTOOPT` | Indica que um determinado protocolo não está disponível. |
| `ENOSPC` | Indica que não há espaço disponível no dispositivo. |
| `ENOSR` | Indica que não há recursos de fluxo disponíveis. |
| `ENOSTR` | Indica que um determinado recurso não é um fluxo. |
| `ENOSYS` | Indica que uma função não foi implementada. |
| `ENOTCONN` | Indica que o socket não está conectado. |
| `ENOTDIR` | Indica que o caminho não é um diretório. |
| `ENOTEMPTY` | Indica que o diretório não está vazio. |
| `ENOTSOCK` | Indica que o item fornecido não é um socket. |
| `ENOTSUP` | Indica que uma determinada operação não é suportada. |
| `ENOTTY` | Indica uma operação de controle de I/O inadequada. |
| `ENXIO` | Indica que não existe tal dispositivo ou endereço. |
| `EOPNOTSUPP` | Indica que uma operação não é suportada no socket. Embora `ENOTSUP` e `EOPNOTSUPP` tenham o mesmo valor no Linux, de acordo com POSIX.1 esses valores de erro devem ser distintos.) |
| `EOVERFLOW` | Indica que um valor é muito grande para ser armazenado em um determinado tipo de dado. |
| `EPERM` | Indica que a operação não é permitida. |
| `EPIPE` | Indica um pipe quebrado. |
| `EPROTO` | Indica um erro de protocolo. |
| `EPROTONOSUPPORT` | Indica que um protocolo não é suportado. |
| `EPROTOTYPE` | Indica o tipo errado de protocolo para um socket. |
| `ERANGE` | Indica que os resultados são muito grandes. |
| `EROFS` | Indica que o sistema de arquivos é somente leitura. |
| `ESPIPE` | Indica uma operação de busca inválida. |
| `ESRCH` | Indica que não existe tal processo. |
| `ESTALE` | Indica que o identificador de arquivo está obsoleto. |
| `ETIME` | Indica um temporizador expirado. |
| `ETIMEDOUT` | Indica que a conexão expirou. |
| `ETXTBSY` | Indica que um arquivo de texto está ocupado. |
| `EWOULDBLOCK` | Indica que a operação seria bloqueada. |
| `EXDEV` | Indica um link impróprio. |

#### Constantes de erro específicas do Windows {#windows-specific-error-constants}

Os seguintes códigos de erro são específicos do sistema operacional Windows.

| Constante | Descrição |
| --- | --- |
| `WSAEINTR` | Indica uma chamada de função interrompida. |
| `WSAEBADF` | Indica um identificador de arquivo inválido. |
| `WSAEACCES` | Indica permissões insuficientes para concluir a operação. |
| `WSAEFAULT` | Indica um endereço de ponteiro inválido. |
| `WSAEINVAL` | Indica que um argumento inválido foi passado. |
| `WSAEMFILE` | Indica que há muitos arquivos abertos. |
| `WSAEWOULDBLOCK` | Indica que um recurso está temporariamente indisponível. |
| `WSAEINPROGRESS` | Indica que uma operação está atualmente em andamento. |
| `WSAEALREADY` | Indica que uma operação já está em andamento. |
| `WSAENOTSOCK` | Indica que o recurso não é um socket. |
| `WSAEDESTADDRREQ` | Indica que um endereço de destino é necessário. |
| `WSAEMSGSIZE` | Indica que o tamanho da mensagem é muito longo. |
| `WSAEPROTOTYPE` | Indica o tipo de protocolo errado para o socket. |
| `WSAENOPROTOOPT` | Indica uma opção de protocolo ruim. |
| `WSAEPROTONOSUPPORT` | Indica que o protocolo não é suportado. |
| `WSAESOCKTNOSUPPORT` | Indica que o tipo de socket não é suportado. |
| `WSAEOPNOTSUPP` | Indica que a operação não é suportada. |
| `WSAEPFNOSUPPORT` | Indica que a família de protocolos não é suportada. |
| `WSAEAFNOSUPPORT` | Indica que a família de endereços não é suportada. |
| `WSAEADDRINUSE` | Indica que o endereço de rede já está em uso. |
| `WSAEADDRNOTAVAIL` | Indica que o endereço de rede não está disponível. |
| `WSAENETDOWN` | Indica que a rede está inativa. |
| `WSAENETUNREACH` | Indica que a rede está inacessível. |
| `WSAENETRESET` | Indica que a conexão de rede foi redefinida. |
| `WSAECONNABORTED` | Indica que a conexão foi interrompida. |
| `WSAECONNRESET` | Indica que a conexão foi redefinida pelo par. |
| `WSAENOBUFS` | Indica que não há espaço de buffer disponível. |
| `WSAEISCONN` | Indica que o socket já está conectado. |
| `WSAENOTCONN` | Indica que o socket não está conectado. |
| `WSAESHUTDOWN` | Indica que os dados não podem ser enviados após o socket ter sido     desligado. |
| `WSAETOOMANYREFS` | Indica que há muitas referências. |
| `WSAETIMEDOUT` | Indica que a conexão expirou. |
| `WSAECONNREFUSED` | Indica que a conexão foi recusada. |
| `WSAELOOP` | Indica que um nome não pode ser traduzido. |
| `WSAENAMETOOLONG` | Indica que um nome era muito longo. |
| `WSAEHOSTDOWN` | Indica que um host de rede está inativo. |
| `WSAEHOSTUNREACH` | Indica que não há rota para um host de rede. |
| `WSAENOTEMPTY` | Indica que o diretório não está vazio. |
| `WSAEPROCLIM` | Indica que há muitos processos. |
| `WSAEUSERS` | Indica que a cota do usuário foi excedida. |
| `WSAEDQUOT` | Indica que a cota de disco foi excedida. |
| `WSAESTALE` | Indica uma referência de identificador de arquivo obsoleto. |
| `WSAEREMOTE` | Indica que o item é remoto. |
| `WSASYSNOTREADY` | Indica que o subsistema de rede não está pronto. |
| `WSAVERNOTSUPPORTED` | Indica que a versão do  `winsock.dll`  está fora do intervalo. |
| `WSANOTINITIALISED` | Indica que WSAStartup bem-sucedido ainda não foi executado. |
| `WSAEDISCON` | Indica que um desligamento normal está em andamento. |
| `WSAENOMORE` | Indica que não há mais resultados. |
| `WSAECANCELLED` | Indica que uma operação foi cancelada. |
| `WSAEINVALIDPROCTABLE` | Indica que a tabela de chamadas de procedimento é inválida. |
| `WSAEINVALIDPROVIDER` | Indica um provedor de serviços inválido. |
| `WSAEPROVIDERFAILEDINIT` | Indica que o provedor de serviços falhou ao inicializar. |
| `WSASYSCALLFAILURE` | Indica uma falha na chamada do sistema. |
| `WSASERVICE_NOT_FOUND` | Indica que um serviço não foi encontrado. |
| `WSATYPE_NOT_FOUND` | Indica que um tipo de classe não foi encontrado. |
| `WSA_E_NO_MORE` | Indica que não há mais resultados. |
| `WSA_E_CANCELLED` | Indica que a chamada foi cancelada. |
| `WSAEREFUSED` | Indica que uma consulta de banco de dados foi recusada. |


### Constantes dlopen {#dlopen-constants}

Se disponível no sistema operacional, as seguintes constantes são exportadas em `os.constants.dlopen`. Veja [`dlopen(3)`](http://man7.org/linux/man-pages/man3/dlopen.3) para obter informações detalhadas.

| Constante | Descrição |
| --- | --- |
| `RTLD_LAZY` | Realize o binding preguiçoso. O Node.js define esta flag por padrão. |
| `RTLD_NOW` | Resolva todos os símbolos indefinidos na biblioteca antes que dlopen(3) retorne. |
| `RTLD_GLOBAL` | Os símbolos definidos pela biblioteca estarão disponíveis para resolução de símbolos de bibliotecas carregadas posteriormente. |
| `RTLD_LOCAL` | O inverso de `RTLD_GLOBAL`. Este é o comportamento padrão se nenhuma flag for especificada. |
| `RTLD_DEEPBIND` | Faça com que uma biblioteca autocontida use seus próprios símbolos em vez de símbolos de bibliotecas carregadas anteriormente. |
### Constantes de Prioridade {#priority-constants}

**Adicionado em: v10.10.0**

As seguintes constantes de agendamento de processos são exportadas por `os.constants.priority`.

| Constante | Descrição |
| --- | --- |
| `PRIORITY_LOW` | A prioridade de agendamento de processos mais baixa. Isso corresponde a `IDLE_PRIORITY_CLASS` no Windows e a um valor nice de `19` em todas as outras plataformas. |
| `PRIORITY_BELOW_NORMAL` | A prioridade de agendamento de processos acima de `PRIORITY_LOW` e abaixo de `PRIORITY_NORMAL`. Isso corresponde a `BELOW_NORMAL_PRIORITY_CLASS` no Windows e a um valor nice de `10` em todas as outras plataformas. |
| `PRIORITY_NORMAL` | A prioridade de agendamento de processos padrão. Isso corresponde a `NORMAL_PRIORITY_CLASS` no Windows e a um valor nice de `0` em todas as outras plataformas. |
| `PRIORITY_ABOVE_NORMAL` | A prioridade de agendamento de processos acima de `PRIORITY_NORMAL` e abaixo de `PRIORITY_HIGH`. Isso corresponde a `ABOVE_NORMAL_PRIORITY_CLASS` no Windows e a um valor nice de `-7` em todas as outras plataformas. |
| `PRIORITY_HIGH` | A prioridade de agendamento de processos acima de `PRIORITY_ABOVE_NORMAL` e abaixo de `PRIORITY_HIGHEST`. Isso corresponde a `HIGH_PRIORITY_CLASS` no Windows e a um valor nice de `-14` em todas as outras plataformas. |
| `PRIORITY_HIGHEST` | A prioridade de agendamento de processos mais alta. Isso corresponde a `REALTIME_PRIORITY_CLASS` no Windows e a um valor nice de `-20` em todas as outras plataformas. |


### Constantes libuv {#libuv-constants}

| Constante | Descrição |
| --- | --- |
| `UV_UDP_REUSEADDR` ||

