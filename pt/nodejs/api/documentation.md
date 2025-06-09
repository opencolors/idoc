---
title: Documentação do Node.js
description: Explore a documentação completa do Node.js, cobrindo APIs, módulos e exemplos de uso para ajudar os desenvolvedores a entender e utilizar o Node.js de forma eficaz.
head:
  - - meta
    - name: og:title
      content: Documentação do Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Explore a documentação completa do Node.js, cobrindo APIs, módulos e exemplos de uso para ajudar os desenvolvedores a entender e utilizar o Node.js de forma eficaz.
  - - meta
    - name: twitter:title
      content: Documentação do Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Explore a documentação completa do Node.js, cobrindo APIs, módulos e exemplos de uso para ajudar os desenvolvedores a entender e utilizar o Node.js de forma eficaz.
---


# Sobre esta documentação {#about-this-documentation}

Bem-vindo à documentação oficial de referência da API para Node.js!

Node.js é um runtime JavaScript construído no [mecanismo JavaScript V8](https://v8.dev/).

## Contribuindo {#contributing}

Reporte erros nesta documentação no [rastreador de problemas](https://github.com/nodejs/node/issues/new). Consulte o [guia de contribuição](https://github.com/nodejs/node/blob/HEAD/CONTRIBUTING.md) para obter instruções sobre como enviar pull requests.

## Índice de estabilidade {#stability-index}

Ao longo da documentação, há indicações da estabilidade de uma seção. Algumas APIs são tão comprovadas e confiáveis que é improvável que mudem. Outras são novas e experimentais, ou conhecidas por serem perigosas.

Os índices de estabilidade são os seguintes:

::: danger [Estável: 0 - Descontinuado]
[Estável: 0](/pt/nodejs/api/documentation#stability-index) Estabilidade: 0 - Descontinuado. O recurso pode emitir avisos. A compatibilidade com versões anteriores não é garantida.
:::

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) Estabilidade: 1 - Experimental. O recurso não está sujeito às regras de [versionamento semântico](https://semver.org/). Alterações não compatíveis com versões anteriores ou remoção podem ocorrer em qualquer versão futura. O uso do recurso não é recomendado em ambientes de produção.
:::

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) Estabilidade: 2 - Estável. A compatibilidade com o ecossistema npm é uma alta prioridade.
:::

::: info [Estável: 3 - Legado]
[Estável: 3](/pt/nodejs/api/documentation#stability-index) Estabilidade: 3 - Legado. Embora seja improvável que este recurso seja removido e ainda esteja coberto pelas garantias de versionamento semântico, ele não é mais mantido ativamente e outras alternativas estão disponíveis.
:::

Os recursos são marcados como legados em vez de serem descontinuados se seu uso não causar danos e forem amplamente utilizados no ecossistema npm. É improvável que bugs encontrados em recursos legados sejam corrigidos.

Tenha cuidado ao usar recursos experimentais, principalmente ao criar bibliotecas. Os usuários podem não estar cientes de que recursos experimentais estão sendo usados. Bugs ou mudanças de comportamento podem surpreender os usuários quando modificações experimentais da API ocorrerem. Para evitar surpresas, o uso de um recurso experimental pode precisar de um sinalizador de linha de comando. Recursos experimentais também podem emitir um [aviso](/pt/nodejs/api/process#event-warning).


## Visão geral da estabilidade {#stability-overview}

| API | Estabilidade |
| --- | --- |
| [Assert](/pt/nodejs/api/assert) |<div class="custom-block tip"> (2) Estável </div>|
| [Hooks assíncronos](/pt/nodejs/api/async_hooks) |<div class="custom-block warning"> (1) Experimental </div>|
| [Rastreamento de contexto assíncrono](/pt/nodejs/api/async_context) |<div class="custom-block tip"> (2) Estável </div>|
| [Buffer](/pt/nodejs/api/buffer) |<div class="custom-block tip"> (2) Estável </div>|
| [Processo filho](/pt/nodejs/api/child_process) |<div class="custom-block tip"> (2) Estável </div>|
| [Cluster](/pt/nodejs/api/cluster) |<div class="custom-block tip"> (2) Estável </div>|
| [Console](/pt/nodejs/api/console) |<div class="custom-block tip"> (2) Estável </div>|
| [Crypto](/pt/nodejs/api/crypto) |<div class="custom-block tip"> (2) Estável </div>|
| [Canal de diagnósticos](/pt/nodejs/api/diagnostics_channel) |<div class="custom-block tip"> (2) Estável </div>|
| [DNS](/pt/nodejs/api/dns) |<div class="custom-block tip"> (2) Estável </div>|
| [Domain](/pt/nodejs/api/domain) |<div class="custom-block danger"> (0) Descontinuado </div>|
| [Sistema de arquivos](/pt/nodejs/api/fs) |<div class="custom-block tip"> (2) Estável </div>|
| [HTTP](/pt/nodejs/api/http) |<div class="custom-block tip"> (2) Estável </div>|
| [HTTP/2](/pt/nodejs/api/http2) |<div class="custom-block tip"> (2) Estável </div>|
| [HTTPS](/pt/nodejs/api/https) |<div class="custom-block tip"> (2) Estável </div>|
| [Inspector](/pt/nodejs/api/inspector) |<div class="custom-block tip"> (2) Estável </div>|
| [Módulos: API `node:module`](/pt/nodejs/api/module) |<div class="custom-block warning"> (1) .2 - Candidato a lançamento (versão assíncrona) Estabilidade: 1.1 - Desenvolvimento ativo (versão síncrona) </div>|
| [Módulos: módulos CommonJS](/pt/nodejs/api/modules) |<div class="custom-block tip"> (2) Estável </div>|
| [Módulos: TypeScript](/pt/nodejs/api/typescript) |<div class="custom-block warning"> (1) .1 - Desenvolvimento ativo </div>|
| [SO](/pt/nodejs/api/os) |<div class="custom-block tip"> (2) Estável </div>|
| [Path](/pt/nodejs/api/path) |<div class="custom-block tip"> (2) Estável </div>|
| [APIs de medição de desempenho](/pt/nodejs/api/perf_hooks) |<div class="custom-block tip"> (2) Estável </div>|
| [Punycode](/pt/nodejs/api/punycode) |<div class="custom-block danger"> (0) Descontinuado </div>|
| [String de consulta](/pt/nodejs/api/querystring) |<div class="custom-block tip"> (2) Estável </div>|
| [Readline](/pt/nodejs/api/readline) |<div class="custom-block tip"> (2) Estável </div>|
| [REPL](/pt/nodejs/api/repl) |<div class="custom-block tip"> (2) Estável </div>|
| [Aplicações executáveis únicas](/pt/nodejs/api/single-executable-applications) |<div class="custom-block warning"> (1) .1 - Desenvolvimento ativo </div>|
| [SQLite](/pt/nodejs/api/sqlite) |<div class="custom-block warning"> (1) .1 - Desenvolvimento ativo. </div>|
| [Stream](/pt/nodejs/api/stream) |<div class="custom-block tip"> (2) Estável </div>|
| [Decodificador de string](/pt/nodejs/api/string_decoder) |<div class="custom-block tip"> (2) Estável </div>|
| [Executador de testes](/pt/nodejs/api/test) |<div class="custom-block tip"> (2) Estável </div>|
| [Timers](/pt/nodejs/api/timers) |<div class="custom-block tip"> (2) Estável </div>|
| [TLS (SSL)](/pt/nodejs/api/tls) |<div class="custom-block tip"> (2) Estável </div>|
| [Eventos de rastreamento](/pt/nodejs/api/tracing) |<div class="custom-block warning"> (1) Experimental </div>|
| [TTY](/pt/nodejs/api/tty) |<div class="custom-block tip"> (2) Estável </div>|
| [Sockets UDP/datagrama](/pt/nodejs/api/dgram) |<div class="custom-block tip"> (2) Estável </div>|
| [URL](/pt/nodejs/api/url) |<div class="custom-block tip"> (2) Estável </div>|
| [Util](/pt/nodejs/api/util) |<div class="custom-block tip"> (2) Estável </div>|
| [VM (executando JavaScript)](/pt/nodejs/api/vm) |<div class="custom-block tip"> (2) Estável </div>|
| [API Web Crypto](/pt/nodejs/api/webcrypto) |<div class="custom-block tip"> (2) Estável </div>|
| [API Web Streams](/pt/nodejs/api/webstreams) |<div class="custom-block tip"> (2) Estável </div>|
| [Interface do sistema WebAssembly (WASI)](/pt/nodejs/api/wasi) |<div class="custom-block warning"> (1) Experimental </div>|
| [Threads de worker](/pt/nodejs/api/worker_threads) |<div class="custom-block tip"> (2) Estável </div>|
| [Zlib](/pt/nodejs/api/zlib) |<div class="custom-block tip"> (2) Estável </div>|


## Saída JSON {#json-output}

**Adicionado em: v0.6.12**

Cada documento `.html` tem um documento `.json` correspondente. Isto é para IDEs e outras utilidades que consomem a documentação.

## Chamadas de sistema e páginas de manual {#system-calls-and-man-pages}

As funções do Node.js que envolvem uma chamada de sistema documentarão isso. Os documentos ligam às páginas de manual correspondentes que descrevem como a chamada de sistema funciona.

A maioria das chamadas de sistema Unix têm análogos no Windows. Ainda assim, diferenças de comportamento podem ser inevitáveis.

