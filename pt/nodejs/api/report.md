---
title: Documentação de Relatório do Node.js
description: A documentação de Relatório do Node.js fornece informações detalhadas sobre como gerar, configurar e analisar relatórios de diagnóstico para aplicações Node.js. Ela aborda o uso do módulo 'report', incluindo como acionar relatórios, personalizar o conteúdo dos relatórios e interpretar os dados gerados para depuração e análise de desempenho.
head:
  - - meta
    - name: og:title
      content: Documentação de Relatório do Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: A documentação de Relatório do Node.js fornece informações detalhadas sobre como gerar, configurar e analisar relatórios de diagnóstico para aplicações Node.js. Ela aborda o uso do módulo 'report', incluindo como acionar relatórios, personalizar o conteúdo dos relatórios e interpretar os dados gerados para depuração e análise de desempenho.
  - - meta
    - name: twitter:title
      content: Documentação de Relatório do Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: A documentação de Relatório do Node.js fornece informações detalhadas sobre como gerar, configurar e analisar relatórios de diagnóstico para aplicações Node.js. Ela aborda o uso do módulo 'report', incluindo como acionar relatórios, personalizar o conteúdo dos relatórios e interpretar os dados gerados para depuração e análise de desempenho.
---


# Relatório de diagnóstico {#diagnostic-report}

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável
:::


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v23.3.0 | Adicionada a opção `--report-exclude-env` para excluir variáveis de ambiente da geração de relatórios. |
| v22.0.0, v20.13.0 | Adicionada a opção `--report-exclude-network` para excluir operações de rede que podem retardar a geração de relatórios em alguns casos. |
:::

Entrega um resumo de diagnóstico formatado em JSON, gravado em um arquivo.

O relatório destina-se ao uso em desenvolvimento, teste e produção, para capturar e preservar informações para a determinação de problemas. Inclui rastreamentos de pilha JavaScript e nativos, estatísticas de heap, informações da plataforma, uso de recursos, etc. Com a opção de relatório ativada, os relatórios de diagnóstico podem ser acionados em exceções não tratadas, erros fatais e sinais de usuário, além de serem acionados programaticamente por meio de chamadas de API.

Um exemplo completo de relatório gerado em uma exceção não capturada é fornecido abaixo para referência.

```json [JSON]
{
  "header": {
    "reportVersion": 5,
    "event": "exception",
    "trigger": "Exception",
    "filename": "report.20181221.005011.8974.0.001.json",
    "dumpEventTime": "2018-12-21T00:50:11Z",
    "dumpEventTimeStamp": "1545371411331",
    "processId": 8974,
    "cwd": "/home/nodeuser/project/node",
    "commandLine": [
      "/home/nodeuser/project/node/out/Release/node",
      "--report-uncaught-exception",
      "/home/nodeuser/project/node/test/report/test-exception.js",
      "child"
    ],
    "nodejsVersion": "v12.0.0-pre",
    "glibcVersionRuntime": "2.17",
    "glibcVersionCompiler": "2.17",
    "wordSize": "64 bit",
    "arch": "x64",
    "platform": "linux",
    "componentVersions": {
      "node": "12.0.0-pre",
      "v8": "7.1.302.28-node.5",
      "uv": "1.24.1",
      "zlib": "1.2.11",
      "ares": "1.15.0",
      "modules": "68",
      "nghttp2": "1.34.0",
      "napi": "3",
      "llhttp": "1.0.1",
      "openssl": "1.1.0j"
    },
    "release": {
      "name": "node"
    },
    "osName": "Linux",
    "osRelease": "3.10.0-862.el7.x86_64",
    "osVersion": "#1 SMP Wed Mar 21 18:14:51 EDT 2018",
    "osMachine": "x86_64",
    "cpus": [
      {
        "model": "Intel(R) Core(TM) i7-6820HQ CPU @ 2.70GHz",
        "speed": 2700,
        "user": 88902660,
        "nice": 0,
        "sys": 50902570,
        "idle": 241732220,
        "irq": 0
      },
      {
        "model": "Intel(R) Core(TM) i7-6820HQ CPU @ 2.70GHz",
        "speed": 2700,
        "user": 88902660,
        "nice": 0,
        "sys": 50902570,
        "idle": 241732220,
        "irq": 0
      }
    ],
    "networkInterfaces": [
      {
        "name": "en0",
        "internal": false,
        "mac": "13:10:de:ad:be:ef",
        "address": "10.0.0.37",
        "netmask": "255.255.255.0",
        "family": "IPv4"
      }
    ],
    "host": "test_machine"
  },
  "javascriptStack": {
    "message": "Error: *** test-exception.js: throwing uncaught Error",
    "stack": [
      "at myException (/home/nodeuser/project/node/test/report/test-exception.js:9:11)",
      "at Object.<anonymous> (/home/nodeuser/project/node/test/report/test-exception.js:12:3)",
      "at Module._compile (internal/modules/cjs/loader.js:718:30)",
      "at Object.Module._extensions..js (internal/modules/cjs/loader.js:729:10)",
      "at Module.load (internal/modules/cjs/loader.js:617:32)",
      "at tryModuleLoad (internal/modules/cjs/loader.js:560:12)",
      "at Function.Module._load (internal/modules/cjs/loader.js:552:3)",
      "at Function.Module.runMain (internal/modules/cjs/loader.js:771:12)",
      "at executeUserCode (internal/bootstrap/node.js:332:15)"
    ]
  },
  "nativeStack": [
    {
      "pc": "0x000055b57f07a9ef",
      "symbol": "report::GetNodeReport(v8::Isolate*, node::Environment*, char const*, char const*, v8::Local<v8::String>, std::ostream&) [./node]"
    },
    {
      "pc": "0x000055b57f07cf03",
      "symbol": "report::GetReport(v8::FunctionCallbackInfo<v8::Value> const&) [./node]"
    },
    {
      "pc": "0x000055b57f1bccfd",
      "symbol": " [./node]"
    },
    {
      "pc": "0x000055b57f1be048",
      "symbol": "v8::internal::Builtin_HandleApiCall(int, v8::internal::Object**, v8::internal::Isolate*) [./node]"
    },
    {
      "pc": "0x000055b57feeda0e",
      "symbol": " [./node]"
    }
  ],
  "javascriptHeap": {
    "totalMemory": 5660672,
    "executableMemory": 524288,
    "totalCommittedMemory": 5488640,
    "availableMemory": 4341379928,
    "totalGlobalHandlesMemory": 8192,
    "usedGlobalHandlesMemory": 3136,
    "usedMemory": 4816432,
    "memoryLimit": 4345298944,
    "mallocedMemory": 254128,
    "externalMemory": 315644,
    "peakMallocedMemory": 98752,
    "nativeContextCount": 1,
    "detachedContextCount": 0,
    "doesZapGarbage": 0,
    "heapSpaces": {
      "read_only_space": {
        "memorySize": 524288,
        "committedMemory": 39208,
        "capacity": 515584,
        "used": 30504,
        "available": 485080
      },
      "new_space": {
        "memorySize": 2097152,
        "committedMemory": 2019312,
        "capacity": 1031168,
        "used": 985496,
        "available": 45672
      },
      "old_space": {
        "memorySize": 2273280,
        "committedMemory": 1769008,
        "capacity": 1974640,
        "used": 1725488,
        "available": 249152
      },
      "code_space": {
        "memorySize": 696320,
        "committedMemory": 184896,
        "capacity": 152128,
        "used": 152128,
        "available": 0
      },
      "map_space": {
        "memorySize": 536576,
        "committedMemory": 344928,
        "capacity": 327520,
        "used": 327520,
        "available": 0
      },
      "large_object_space": {
        "memorySize": 0,
        "committedMemory": 0,
        "capacity": 1520590336,
        "used": 0,
        "available": 1520590336
      },
      "new_large_object_space": {
        "memorySize": 0,
        "committedMemory": 0,
        "capacity": 0,
        "used": 0,
        "available": 0
      }
    }
  },
  "resourceUsage": {
    "rss": "35766272",
    "free_memory": "1598337024",
    "total_memory": "17179869184",
    "available_memory": "1598337024",
    "maxRss": "36624662528",
    "constrained_memory": "36624662528",
    "userCpuSeconds": 0.040072,
    "kernelCpuSeconds": 0.016029,
    "cpuConsumptionPercent": 5.6101,
    "userCpuConsumptionPercent": 4.0072,
    "kernelCpuConsumptionPercent": 1.6029,
    "pageFaults": {
      "IORequired": 0,
      "IONotRequired": 4610
    },
    "fsActivity": {
      "reads": 0,
      "writes": 0
    }
  },
  "uvthreadResourceUsage": {
    "userCpuSeconds": 0.039843,
    "kernelCpuSeconds": 0.015937,
    "cpuConsumptionPercent": 5.578,
    "userCpuConsumptionPercent": 3.9843,
    "kernelCpuConsumptionPercent": 1.5937,
    "fsActivity": {
      "reads": 0,
      "writes": 0
    }
  },
  "libuv": [
    {
      "type": "async",
      "is_active": true,
      "is_referenced": false,
      "address": "0x0000000102910900",
      "details": ""
    },
    {
      "type": "timer",
      "is_active": false,
      "is_referenced": false,
      "address": "0x00007fff5fbfeab0",
      "repeat": 0,
      "firesInMsFromNow": 94403548320796,
      "expired": true
    },
    {
      "type": "check",
      "is_active": true,
      "is_referenced": false,
      "address": "0x00007fff5fbfeb48"
    },
    {
      "type": "idle",
      "is_active": false,
      "is_referenced": true,
      "address": "0x00007fff5fbfebc0"
    },
    {
      "type": "prepare",
      "is_active": false,
      "is_referenced": false,
      "address": "0x00007fff5fbfec38"
    },
    {
      "type": "check",
      "is_active": false,
      "is_referenced": false,
      "address": "0x00007fff5fbfecb0"
    },
    {
      "type": "async",
      "is_active": true,
      "is_referenced": false,
      "address": "0x000000010188f2e0"
    },
    {
      "type": "tty",
      "is_active": false,
      "is_referenced": true,
      "address": "0x000055b581db0e18",
      "width": 204,
      "height": 55,
      "fd": 17,
      "writeQueueSize": 0,
      "readable": true,
      "writable": true
    },
    {
      "type": "signal",
      "is_active": true,
      "is_referenced": false,
      "address": "0x000055b581d80010",
      "signum": 28,
      "signal": "SIGWINCH"
    },
    {
      "type": "tty",
      "is_active": true,
      "is_referenced": true,
      "address": "0x000055b581df59f8",
      "width": 204,
      "height": 55,
      "fd": 19,
      "writeQueueSize": 0,
      "readable": true,
      "writable": true
    },
    {
      "type": "loop",
      "is_active": true,
      "address": "0x000055fc7b2cb180",
      "loopIdleTimeSeconds": 22644.8
    },
    {
      "type": "tcp",
      "is_active": true,
      "is_referenced": true,
      "address": "0x000055e70fcb85d8",
      "localEndpoint": {
        "host": "localhost",
        "ip4": "127.0.0.1",
        "port": 48986
      },
      "remoteEndpoint": {
        "host": "localhost",
        "ip4": "127.0.0.1",
        "port": 38573
      },
      "sendBufferSize": 2626560,
      "recvBufferSize": 131072,
      "fd": 24,
      "writeQueueSize": 0,
      "readable": true,
      "writable": true
    }
  ],
  "workers": [],
  "environmentVariables": {
    "REMOTEHOST": "REMOVED",
    "MANPATH": "/opt/rh/devtoolset-3/root/usr/share/man:",
    "XDG_SESSION_ID": "66126",
    "HOSTNAME": "test_machine",
    "HOST": "test_machine",
    "TERM": "xterm-256color",
    "SHELL": "/bin/csh",
    "SSH_CLIENT": "REMOVED",
    "PERL5LIB": "/opt/rh/devtoolset-3/root//usr/lib64/perl5/vendor_perl:/opt/rh/devtoolset-3/root/usr/lib/perl5:/opt/rh/devtoolset-3/root//usr/share/perl5/vendor_perl",
    "OLDPWD": "/home/nodeuser/project/node/src",
    "JAVACONFDIRS": "/opt/rh/devtoolset-3/root/etc/java:/etc/java",
    "SSH_TTY": "/dev/pts/0",
    "PCP_DIR": "/opt/rh/devtoolset-3/root",
    "GROUP": "normaluser",
    "USER": "nodeuser",
    "LD_LIBRARY_PATH": "/opt/rh/devtoolset-3/root/usr/lib64:/opt/rh/devtoolset-3/root/usr/lib",
    "HOSTTYPE": "x86_64-linux",
    "XDG_CONFIG_DIRS": "/opt/rh/devtoolset-3/root/etc/xdg:/etc/xdg",
    "MAIL": "/var/spool/mail/nodeuser",
    "PATH": "/home/nodeuser/project/node:/opt/rh/devtoolset-3/root/usr/bin:/usr/local/bin:/usr/bin:/usr/local/sbin:/usr/sbin",
    "PWD": "/home/nodeuser/project/node",
    "LANG": "en_US.UTF-8",
    "PS1": "\\u@\\h : \\[\\e[31m\\]\\w\\[\\e[m\\] >  ",
    "SHLVL": "2",
    "HOME": "/home/nodeuser",
    "OSTYPE": "linux",
    "VENDOR": "unknown",
    "PYTHONPATH": "/opt/rh/devtoolset-3/root/usr/lib64/python2.7/site-packages:/opt/rh/devtoolset-3/root/usr/lib/python2.7/site-packages",
    "MACHTYPE": "x86_64",
    "LOGNAME": "nodeuser",
    "XDG_DATA_DIRS": "/opt/rh/devtoolset-3/root/usr/share:/usr/local/share:/usr/share",
    "LESSOPEN": "||/usr/bin/lesspipe.sh %s",
    "INFOPATH": "/opt/rh/devtoolset-3/root/usr/share/info",
    "XDG_RUNTIME_DIR": "/run/user/50141",
    "_": "./node"
  },
  "userLimits": {
    "core_file_size_blocks": {
      "soft": "",
      "hard": "unlimited"
    },
    "data_seg_size_bytes": {
      "soft": "unlimited",
      "hard": "unlimited"
    },
    "file_size_blocks": {
      "soft": "unlimited",
      "hard": "unlimited"
    },
    "max_locked_memory_bytes": {
      "soft": "unlimited",
      "hard": 65536
    },
    "max_memory_size_bytes": {
      "soft": "unlimited",
      "hard": "unlimited"
    },
    "open_files": {
      "soft": "unlimited",
      "hard": 4096
    },
    "stack_size_bytes": {
      "soft": "unlimited",
      "hard": "unlimited"
    },
    "cpu_time_seconds": {
      "soft": "unlimited",
      "hard": "unlimited"
    },
    "max_user_processes": {
      "soft": "unlimited",
      "hard": 4127290
    },
    "virtual_memory_bytes": {
      "soft": "unlimited",
      "hard": "unlimited"
    }
  },
  "sharedObjects": [
    "/lib64/libdl.so.2",
    "/lib64/librt.so.1",
    "/lib64/libstdc++.so.6",
    "/lib64/libm.so.6",
    "/lib64/libgcc_s.so.1",
    "/lib64/libpthread.so.0",
    "/lib64/libc.so.6",
    "/lib64/ld-linux-x86-64.so.2"
  ]
}
```

## Uso {#usage}

```bash [BASH]
node --report-uncaught-exception --report-on-signal \
--report-on-fatalerror app.js
```
- `--report-uncaught-exception` Habilita a geração de relatório em exceções não tratadas. Útil ao inspecionar a pilha JavaScript em conjunto com a pilha nativa e outros dados do ambiente de tempo de execução.
- `--report-on-signal` Habilita a geração de relatório ao receber o sinal especificado (ou predefinido) para o processo Node.js em execução. (Veja abaixo como modificar o sinal que aciona o relatório.) O sinal padrão é `SIGUSR2`. Útil quando um relatório precisa ser acionado a partir de outro programa. Os monitores de aplicativos podem aproveitar esse recurso para coletar relatórios em intervalos regulares e plotar um conjunto rico de dados internos do tempo de execução em suas visualizações.

A geração de relatórios baseada em sinal não é suportada no Windows.

Em circunstâncias normais, não há necessidade de modificar o sinal de acionamento do relatório. No entanto, se `SIGUSR2` já for usado para outros fins, esse sinalizador ajuda a alterar o sinal para a geração de relatórios e preservar o significado original de `SIGUSR2` para os referidos fins.

- `--report-on-fatalerror` Habilita o relatório a ser acionado em erros fatais (erros internos dentro do tempo de execução do Node.js, como falta de memória) que levam ao término do aplicativo. Útil para inspecionar vários elementos de dados de diagnóstico, como heap, pilha, estado do loop de eventos, consumo de recursos, etc., para raciocinar sobre o erro fatal.
- `--report-compact` Grava relatórios em um formato compacto, JSON de linha única, mais facilmente consumível por sistemas de processamento de log do que o formato multilinha padrão projetado para consumo humano.
- `--report-directory` Local onde o relatório será gerado.
- `--report-filename` Nome do arquivo no qual o relatório será escrito.
- `--report-signal` Define ou redefine o sinal para geração de relatório (não suportado no Windows). O sinal padrão é `SIGUSR2`.
- `--report-exclude-network` Exclui `header.networkInterfaces` e desativa as consultas DNS reversas em `libuv.*.(remote|local)Endpoint.host` do relatório de diagnóstico. Por padrão, isso não está definido e as interfaces de rede são incluídas.
- `--report-exclude-env` Exclui `environmentVariables` do relatório de diagnóstico. Por padrão, isso não está definido e as variáveis de ambiente são incluídas.

Um relatório também pode ser acionado por meio de uma chamada de API de um aplicativo JavaScript:

```js [ESM]
process.report.writeReport();
```
Esta função recebe um argumento adicional opcional `filename`, que é o nome de um arquivo no qual o relatório é escrito.

```js [ESM]
process.report.writeReport('./foo.json');
```
Esta função recebe um argumento adicional opcional `err` que é um objeto `Error` que será usado como contexto para a pilha JavaScript impressa no relatório. Ao usar o relatório para lidar com erros em um retorno de chamada ou um manipulador de exceções, isso permite que o relatório inclua o local do erro original, bem como onde ele foi tratado.

```js [ESM]
try {
  process.chdir('/non-existent-path');
} catch (err) {
  process.report.writeReport(err);
}
// Any other code
```
Se o nome do arquivo e o objeto de erro forem passados para `writeReport()`, o objeto de erro deve ser o segundo parâmetro.

```js [ESM]
try {
  process.chdir('/non-existent-path');
} catch (err) {
  process.report.writeReport(filename, err);
}
// Any other code
```
O conteúdo do relatório de diagnóstico pode ser retornado como um objeto JavaScript por meio de uma chamada de API de um aplicativo JavaScript:

```js [ESM]
const report = process.report.getReport();
console.log(typeof report === 'object'); // true

// Similar to process.report.writeReport() output
console.log(JSON.stringify(report, null, 2));
```
Esta função recebe um argumento adicional opcional `err`, que é um objeto `Error` que será usado como contexto para a pilha JavaScript impressa no relatório.

```js [ESM]
const report = process.report.getReport(new Error('custom error'));
console.log(typeof report === 'object'); // true
```
As versões da API são úteis ao inspecionar o estado do tempo de execução de dentro do aplicativo, na expectativa de auto-ajustar o consumo de recursos, balanceamento de carga, monitoramento, etc.

O conteúdo do relatório consiste em uma seção de cabeçalho contendo o tipo de evento, data, hora, PID e versão do Node.js, seções contendo rastreamentos de pilha JavaScript e nativa, uma seção contendo informações de heap V8, uma seção contendo informações de identificador `libuv` e uma seção de informações da plataforma OS mostrando o uso de CPU e memória e os limites do sistema. Um relatório de exemplo pode ser acionado usando o Node.js REPL:

```bash [BASH]
$ node
> process.report.writeReport();
Writing Node.js report to file: report.20181126.091102.8480.0.001.json
Node.js report completed
>
```
Quando um relatório é escrito, as mensagens de início e fim são emitidas para stderr e o nome do arquivo do relatório é retornado ao chamador. O nome do arquivo padrão inclui a data, hora, PID e um número de sequência. O número de sequência ajuda a associar o despejo do relatório ao estado do tempo de execução se gerado várias vezes para o mesmo processo Node.js.


## Versão do Relatório {#report-version}

O relatório de diagnóstico tem um número de versão de um único dígito associado (`report.header.reportVersion`), representando exclusivamente o formato do relatório. O número da versão é incrementado quando uma nova chave é adicionada ou removida, ou o tipo de dados de um valor é alterado. As definições da versão do relatório são consistentes entre as versões LTS.

### Histórico de versões {#version-history}

#### Versão 5 {#version-5}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v23.5.0 | Correção de erros de digitação nas unidades de limite de memória. |
:::

Substitua as chaves `data_seg_size_kbytes`, `max_memory_size_kbytes` e `virtual_memory_kbytes` por `data_seg_size_bytes`, `max_memory_size_bytes` e `virtual_memory_bytes`, respectivamente, na seção `userLimits`, pois esses valores são fornecidos em bytes.

```json [JSON]
{
  "userLimits": {
    // Ignorar algumas chaves ...
    "data_seg_size_bytes": { // substituindo data_seg_size_kbytes
      "soft": "unlimited",
      "hard": "unlimited"
    },
    // ...
    "max_memory_size_bytes": { // substituindo max_memory_size_kbytes
      "soft": "unlimited",
      "hard": "unlimited"
    },
    // ...
    "virtual_memory_bytes": { // substituindo virtual_memory_kbytes
      "soft": "unlimited",
      "hard": "unlimited"
    }
  }
}
```
#### Versão 4 {#version-4}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v23.3.0 | Adicionada a opção `--report-exclude-env` para excluir variáveis de ambiente da geração de relatórios. |
:::

Novos campos `ipv4` e `ipv6` são adicionados aos endpoints de handles libuv `tcp` e `udp`. Exemplos:

```json [JSON]
{
  "libuv": [
    {
      "type": "tcp",
      "is_active": true,
      "is_referenced": true,
      "address": "0x000055e70fcb85d8",
      "localEndpoint": {
        "host": "localhost",
        "ip4": "127.0.0.1", // nova chave
        "port": 48986
      },
      "remoteEndpoint": {
        "host": "localhost",
        "ip4": "127.0.0.1", // nova chave
        "port": 38573
      },
      "sendBufferSize": 2626560,
      "recvBufferSize": 131072,
      "fd": 24,
      "writeQueueSize": 0,
      "readable": true,
      "writable": true
    },
    {
      "type": "tcp",
      "is_active": true,
      "is_referenced": true,
      "address": "0x000055e70fcd68c8",
      "localEndpoint": {
        "host": "ip6-localhost",
        "ip6": "::1", // nova chave
        "port": 52266
      },
      "remoteEndpoint": {
        "host": "ip6-localhost",
        "ip6": "::1", // nova chave
        "port": 38573
      },
      "sendBufferSize": 2626560,
      "recvBufferSize": 131072,
      "fd": 25,
      "writeQueueSize": 0,
      "readable": false,
      "writable": false
    }
  ]
}
```

#### Versão 3 {#version-3}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v19.1.0, v18.13.0 | Adiciona mais informações de memória. |
:::

As seguintes chaves de uso de memória são adicionadas à seção `resourceUsage`.

```json [JSON]
{
  "resourceUsage": {
    "rss": "35766272",
    "free_memory": "1598337024",
    "total_memory": "17179869184",
    "available_memory": "1598337024",
    "constrained_memory": "36624662528"
  }
}
```
#### Versão 2 {#version-2}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v13.9.0, v12.16.2 | Os workers agora estão incluídos no relatório. |
:::

Adicionado suporte a [`Worker`](/pt/nodejs/api/worker_threads). Consulte a seção [Interação com workers](/pt/nodejs/api/report#interaction-with-workers) para obter mais detalhes.

#### Versão 1 {#version-1}

Esta é a primeira versão do relatório de diagnóstico.

## Configuração {#configuration}

A configuração adicional em tempo de execução da geração de relatórios está disponível por meio das seguintes propriedades de `process.report`:

`reportOnFatalError` aciona a geração de relatórios de diagnóstico em erros fatais quando `true`. O padrão é `false`.

`reportOnSignal` aciona a geração de relatórios de diagnóstico no sinal quando `true`. Isso não é suportado no Windows. O padrão é `false`.

`reportOnUncaughtException` aciona a geração de relatórios de diagnóstico em exceção não capturada quando `true`. O padrão é `false`.

`signal` especifica o identificador de sinal POSIX que será usado para interceptar gatilhos externos para geração de relatórios. O padrão é `'SIGUSR2'`.

`filename` especifica o nome do arquivo de saída no sistema de arquivos. Um significado especial é atribuído a `stdout` e `stderr`. O uso deles resultará na gravação do relatório nos fluxos padrão associados. Nos casos em que os fluxos padrão são usados, o valor em `directory` é ignorado. URLs não são suportados. O padrão é um nome de arquivo composto que contém carimbo de data/hora, PID e número de sequência.

`directory` especifica o diretório do sistema de arquivos onde o relatório será gravado. URLs não são suportados. O padrão é o diretório de trabalho atual do processo Node.js.

`excludeNetwork` exclui `header.networkInterfaces` do relatório de diagnóstico.

```js [ESM]
// Acionar relatório apenas em exceções não capturadas.
process.report.reportOnFatalError = false;
process.report.reportOnSignal = false;
process.report.reportOnUncaughtException = true;

// Acionar relatório para erros internos e sinal externo.
process.report.reportOnFatalError = true;
process.report.reportOnSignal = true;
process.report.reportOnUncaughtException = false;

// Altere o sinal padrão para 'SIGQUIT' e habilite-o.
process.report.reportOnFatalError = false;
process.report.reportOnUncaughtException = false;
process.report.reportOnSignal = true;
process.report.signal = 'SIGQUIT';

// Desativar o relatório de interfaces de rede
process.report.excludeNetwork = true;
```
A configuração na inicialização do módulo também está disponível por meio de variáveis de ambiente:

```bash [BASH]
NODE_OPTIONS="--report-uncaught-exception \
  --report-on-fatalerror --report-on-signal \
  --report-signal=SIGUSR2  --report-filename=./report.json \
  --report-directory=/home/nodeuser"
```
A documentação específica da API pode ser encontrada na seção [`process API documentation`](/pt/nodejs/api/process).


## Interação com workers {#interaction-with-workers}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v13.9.0, v12.16.2 | Workers agora estão incluídos no relatório. |
:::

Threads [`Worker`](/pt/nodejs/api/worker_threads) podem criar relatórios da mesma forma que a thread principal.

Os relatórios incluirão informações sobre quaisquer Workers que sejam filhos da thread atual como parte da seção `workers`, com cada Worker gerando um relatório no formato de relatório padrão.

A thread que está gerando o relatório esperará que os relatórios das threads Worker terminem. No entanto, a latência para isso geralmente será baixa, pois tanto a execução do JavaScript quanto o loop de eventos são interrompidos para gerar o relatório.

