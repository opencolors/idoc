---
title: Documentação da N-API do Node.js
description: A N-API (Node.js API) oferece uma interface estável e consistente para complementos nativos, permitindo que os desenvolvedores criem módulos compatíveis com diferentes versões do Node.js.
head:
  - - meta
    - name: og:title
      content: Documentação da N-API do Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: A N-API (Node.js API) oferece uma interface estável e consistente para complementos nativos, permitindo que os desenvolvedores criem módulos compatíveis com diferentes versões do Node.js.
  - - meta
    - name: twitter:title
      content: Documentação da N-API do Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: A N-API (Node.js API) oferece uma interface estável e consistente para complementos nativos, permitindo que os desenvolvedores criem módulos compatíveis com diferentes versões do Node.js.
---


# Node-API {#node-api}

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável
:::

Node-API (anteriormente N-API) é uma API para construir Addons nativos. É independente do tempo de execução JavaScript subjacente (por exemplo, V8) e é mantido como parte do próprio Node.js. Esta API será Application Binary Interface (ABI) estável entre as versões do Node.js. Destina-se a isolar os addons das mudanças no motor JavaScript subjacente e permitir que os módulos compilados para uma versão principal sejam executados em versões principais posteriores do Node.js sem recompilação. O guia de [Estabilidade ABI](https://nodejs.org/en/docs/guides/abi-stability/) fornece uma explicação mais aprofundada.

Os Addons são construídos/embalados com a mesma abordagem/ferramentas descritas na seção intitulada [Addons C++](/pt/nodejs/api/addons). A única diferença é o conjunto de APIs que são usadas pelo código nativo. Em vez de usar o V8 ou [Abstrações Nativas para Node.js](https://github.com/nodejs/nan) APIs, as funções disponíveis no Node-API são usadas.

APIs expostas pelo Node-API são geralmente usadas para criar e manipular valores JavaScript. Conceitos e operações geralmente mapeiam para ideias especificadas na Especificação da Linguagem ECMA-262. As APIs têm as seguintes propriedades:

- Todas as chamadas Node-API retornam um código de status do tipo `napi_status`. Este status indica se a chamada da API foi bem-sucedida ou falhou.
- O valor de retorno da API é passado através de um parâmetro out.
- Todos os valores JavaScript são abstraídos por trás de um tipo opaco chamado `napi_value`.
- Em caso de um código de status de erro, informações adicionais podem ser obtidas usando `napi_get_last_error_info`. Mais informações podem ser encontradas na seção de tratamento de erros [Tratamento de erros](/pt/nodejs/api/n-api#error-handling).

Node-API é uma API C que garante estabilidade ABI entre as versões do Node.js e diferentes níveis de compilador. Uma API C++ pode ser mais fácil de usar. Para suportar o uso de C++, o projeto mantém um módulo wrapper C++ chamado [`node-addon-api`](https://github.com/nodejs/node-addon-api). Este wrapper fornece uma API C++ inlinable. Binários construídos com `node-addon-api` dependerão dos símbolos para as funções Node-API baseadas em C exportadas pelo Node.js. `node-addon-api` é uma maneira mais eficiente de escrever código que chama Node-API. Tome, por exemplo, o seguinte código `node-addon-api`. A primeira seção mostra o código `node-addon-api` e a segunda seção mostra o que realmente é usado no addon.

```C++ [C++]
Object obj = Object::New(env);
obj["foo"] = String::New(env, "bar");
```
```C++ [C++]
napi_status status;
napi_value object, string;
status = napi_create_object(env, &object);
if (status != napi_ok) {
  napi_throw_error(env, ...);
  return;
}

status = napi_create_string_utf8(env, "bar", NAPI_AUTO_LENGTH, &string);
if (status != napi_ok) {
  napi_throw_error(env, ...);
  return;
}

status = napi_set_named_property(env, object, "foo", string);
if (status != napi_ok) {
  napi_throw_error(env, ...);
  return;
}
```
O resultado final é que o addon usa apenas as APIs C exportadas. Como resultado, ainda obtém os benefícios da estabilidade ABI fornecida pela API C.

Ao usar `node-addon-api` em vez das APIs C, comece com a API [docs](https://github.com/nodejs/node-addon-api#api-documentation) para `node-addon-api`.

O [Node-API Resource](https://nodejs.github.io/node-addon-examples/) oferece uma excelente orientação e dicas para desenvolvedores que estão apenas começando com Node-API e `node-addon-api`. Recursos de mídia adicionais podem ser encontrados na página [Node-API Media](https://github.com/nodejs/abi-stable-node/blob/HEAD/node-api-media.md).


## Implicações da estabilidade da ABI {#implications-of-abi-stability}

Embora a Node-API forneça uma garantia de estabilidade da ABI, outras partes do Node.js não o fazem, e quaisquer bibliotecas externas usadas a partir do addon podem não o fazer. Em particular, nenhuma das seguintes APIs fornece uma garantia de estabilidade da ABI entre versões principais:

- as APIs C++ do Node.js disponíveis via  
- as APIs libuv que também estão incluídas no Node.js e disponíveis via  
- a API V8 disponível via  

Assim, para que um addon permaneça compatível com a ABI entre as principais versões do Node.js, ele deve usar exclusivamente a Node-API restringindo-se ao uso de

```C [C]
#include <node_api.h>
```
e verificando, para todas as bibliotecas externas que usa, se a biblioteca externa oferece garantias de estabilidade da ABI semelhantes à Node-API.

## Construindo {#building}

Ao contrário dos módulos escritos em JavaScript, desenvolver e implementar addons nativos do Node.js usando Node-API requer um conjunto adicional de ferramentas. Além das ferramentas básicas necessárias para desenvolver para Node.js, o desenvolvedor de addon nativo precisa de uma cadeia de ferramentas que possa compilar código C e C++ em um binário. Além disso, dependendo de como o addon nativo é implementado, o *usuário* do addon nativo também precisará ter uma cadeia de ferramentas C/C++ instalada.

Para desenvolvedores Linux, os pacotes de cadeia de ferramentas C/C++ necessários estão prontamente disponíveis. O [GCC](https://gcc.gnu.org/) é amplamente utilizado na comunidade Node.js para construir e testar em uma variedade de plataformas. Para muitos desenvolvedores, a infraestrutura do compilador [LLVM](https://llvm.org/) também é uma boa escolha.

Para desenvolvedores Mac, o [Xcode](https://developer.apple.com/xcode/) oferece todas as ferramentas de compilador necessárias. No entanto, não é necessário instalar todo o IDE do Xcode. O comando a seguir instala a cadeia de ferramentas necessária:

```bash [BASH]
xcode-select --install
```
Para desenvolvedores Windows, o [Visual Studio](https://visualstudio.microsoft.com/) oferece todas as ferramentas de compilador necessárias. No entanto, não é necessário instalar todo o IDE do Visual Studio. O comando a seguir instala a cadeia de ferramentas necessária:

```bash [BASH]
npm install --global windows-build-tools
```
As seções abaixo descrevem as ferramentas adicionais disponíveis para desenvolver e implementar addons nativos do Node.js.


### Ferramentas de compilação {#build-tools}

Ambas as ferramentas listadas aqui exigem que os *usuários* do complemento nativo tenham uma cadeia de ferramentas C/C++ instalada para instalar com sucesso o complemento nativo.

#### node-gyp {#node-gyp}

[node-gyp](https://github.com/nodejs/node-gyp) é um sistema de compilação baseado no fork [gyp-next](https://github.com/nodejs/gyp-next) da ferramenta [GYP](https://gyp.gsrc.io/) do Google e vem junto com o npm. O GYP, e, portanto, o node-gyp, exige que o Python esteja instalado.

Historicamente, o node-gyp tem sido a ferramenta de escolha para construir complementos nativos. Tem ampla adoção e documentação. No entanto, alguns desenvolvedores encontraram limitações no node-gyp.

#### CMake.js {#cmakejs}

[CMake.js](https://github.com/cmake-js/cmake-js) é um sistema de compilação alternativo baseado no [CMake](https://cmake.org/).

O CMake.js é uma boa escolha para projetos que já usam o CMake ou para desenvolvedores afetados por limitações no node-gyp. [`build_with_cmake`](https://github.com/nodejs/node-addon-examples/tree/main/src/8-tooling/build_with_cmake) é um exemplo de um projeto de complemento nativo baseado em CMake.

### Enviando binários pré-compilados {#uploading-precompiled-binaries}

As três ferramentas listadas aqui permitem que desenvolvedores e mantenedores de complementos nativos criem e carreguem binários para servidores públicos ou privados. Essas ferramentas são normalmente integradas a sistemas de compilação CI/CD como [Travis CI](https://travis-ci.org/) e [AppVeyor](https://www.appveyor.com/) para construir e carregar binários para uma variedade de plataformas e arquiteturas. Esses binários estão então disponíveis para download por usuários que não precisam ter uma cadeia de ferramentas C/C++ instalada.

#### node-pre-gyp {#node-pre-gyp}

[node-pre-gyp](https://github.com/mapbox/node-pre-gyp) é uma ferramenta baseada em node-gyp que adiciona a capacidade de carregar binários para um servidor de escolha do desenvolvedor. O node-pre-gyp tem um suporte particularmente bom para carregar binários para o Amazon S3.

#### prebuild {#prebuild}

[prebuild](https://github.com/prebuild/prebuild) é uma ferramenta que suporta compilações usando node-gyp ou CMake.js. Ao contrário do node-pre-gyp que suporta uma variedade de servidores, o prebuild carrega binários apenas para [lançamentos do GitHub](https://help.github.com/en/github/administering-a-repository/about-releases). O prebuild é uma boa escolha para projetos do GitHub que usam o CMake.js.


#### prebuildify {#prebuildify}

[prebuildify](https://github.com/prebuild/prebuildify) é uma ferramenta baseada no node-gyp. A vantagem do prebuildify é que os binários construídos são agrupados com o addon nativo quando são enviados para o npm. Os binários são baixados do npm e ficam imediatamente disponíveis para o usuário do módulo quando o addon nativo é instalado.

## Uso {#usage}

Para usar as funções Node-API, inclua o arquivo [`node_api.h`](https://github.com/nodejs/node/blob/HEAD/src/node_api.h) que está localizado no diretório src na árvore de desenvolvimento do node:

```C [C]
#include <node_api.h>
```
Isso irá optar pelo `NAPI_VERSION` padrão para a versão fornecida do Node.js. Para garantir a compatibilidade com versões específicas do Node-API, a versão pode ser especificada explicitamente ao incluir o cabeçalho:

```C [C]
#define NAPI_VERSION 3
#include <node_api.h>
```
Isso restringe a superfície do Node-API apenas à funcionalidade que estava disponível nas versões especificadas (e anteriores).

Parte da superfície do Node-API é experimental e requer adesão explícita:

```C [C]
#define NAPI_EXPERIMENTAL
#include <node_api.h>
```
Nesse caso, toda a superfície da API, incluindo quaisquer APIs experimentais, estará disponível para o código do módulo.

Ocasionalmente, recursos experimentais são introduzidos que afetam APIs já lançadas e estáveis. Esses recursos podem ser desativados por meio de uma exclusão:

```C [C]
#define NAPI_EXPERIMENTAL
#define NODE_API_EXPERIMENTAL_<FEATURE_NAME>_OPT_OUT
#include <node_api.h>
```
onde `\<FEATURE_NAME\>` é o nome de um recurso experimental que afeta APIs experimentais e estáveis.

## Matriz de versão do Node-API {#node-api-version-matrix}

Até a versão 9, as versões do Node-API eram aditivas e versionadas independentemente do Node.js. Isso significava que qualquer versão era uma extensão da versão anterior, pois continha todas as APIs da versão anterior com algumas adições. Cada versão do Node.js suportava apenas uma única versão do Node-API. Por exemplo, v18.15.0 suporta apenas a versão 8 do Node-API. A estabilidade da ABI foi alcançada porque a versão 8 era um superconjunto estrito de todas as versões anteriores.

A partir da versão 9, embora as versões do Node-API continuem a ser versionadas independentemente, um addon que era executado com a versão 9 do Node-API pode precisar de atualizações de código para ser executado com a versão 10 do Node-API. A estabilidade da ABI é mantida, no entanto, porque as versões do Node.js que suportam versões do Node-API superiores a 8 suportarão todas as versões entre 8 e a versão mais alta que suportam e fornecerão por padrão as APIs da versão 8, a menos que um addon opte por uma versão superior do Node-API. Essa abordagem oferece a flexibilidade de otimizar melhor as funções Node-API existentes, mantendo a estabilidade da ABI. Os addons existentes podem continuar a ser executados sem recompilação usando uma versão anterior do Node-API. Se um addon precisar de funcionalidade de uma versão mais recente do Node-API, serão necessárias alterações no código existente e recompilação para usar essas novas funções de qualquer maneira.

Em versões do Node.js que suportam a versão 9 e posterior do Node-API, definir `NAPI_VERSION=X` e usar as macros de inicialização de addon existentes incorporará a versão solicitada do Node-API que será usada em tempo de execução no addon. Se `NAPI_VERSION` não estiver definido, o padrão será 8.

Esta tabela pode não estar atualizada em fluxos mais antigos, as informações mais atualizadas estão na documentação da API mais recente em: [Matriz de versão do Node-API](/pt/nodejs/api/n-api#node-api-version-matrix)

| Versão do Node-API | Suportado em |
|---|---|
| 9 | v18.17.0+, 20.3.0+, 21.0.0 e todas as versões posteriores |
| 8 | v12.22.0+, v14.17.0+, v15.12.0+, 16.0.0 e todas as versões posteriores |
| 7 | v10.23.0+, v12.19.0+, v14.12.0+, 15.0.0 e todas as versões posteriores |
| 6 | v10.20.0+, v12.17.0+, 14.0.0 e todas as versões posteriores |
| 5 | v10.17.0+, v12.11.0+, 13.0.0 e todas as versões posteriores |
| 4 | v10.16.0+, v11.8.0+, 12.0.0 e todas as versões posteriores |
| 3 | v6.14.2*, 8.11.2+, v9.11.0+*, 10.0.0 e todas as versões posteriores |
| 2 | v8.10.0+*, v9.3.0+*, 10.0.0 e todas as versões posteriores |
| 1 | v8.6.0+**, v9.0.0+*, 10.0.0 e todas as versões posteriores |

* O Node-API era experimental.

** O Node.js 8.0.0 incluiu o Node-API como experimental. Ele foi lançado como Node-API versão 1, mas continuou a evoluir até o Node.js 8.6.0. A API é diferente em versões anteriores ao Node.js 8.6.0. Recomendamos o Node-API versão 3 ou posterior.

Cada API documentada para Node-API terá um cabeçalho denominado `added in:` e as APIs que são estáveis terão o cabeçalho adicional `Node-API version:`. As APIs são diretamente utilizáveis ao usar uma versão do Node.js que suporte a versão do Node-API mostrada em `Node-API version:` ou superior. Ao usar uma versão do Node.js que não suporta o `Node-API version:` listado ou se não houver `Node-API version:` listado, a API só estará disponível se `#define NAPI_EXPERIMENTAL` preceder a inclusão de `node_api.h` ou `js_native_api.h`. Se uma API parecer não estar disponível em uma versão do Node.js que seja posterior àquela mostrada em `added in:`, é muito provável que seja esse o motivo da aparente ausência.

As Node-APIs associadas estritamente ao acesso a recursos ECMAScript a partir de código nativo podem ser encontradas separadamente em `js_native_api.h` e `js_native_api_types.h`. As APIs definidas nesses cabeçalhos estão incluídas em `node_api.h` e `node_api_types.h`. Os cabeçalhos são estruturados dessa forma para permitir implementações de Node-API fora do Node.js. Para essas implementações, as APIs específicas do Node.js podem não ser aplicáveis.

As partes específicas do Node.js de um addon podem ser separadas do código que expõe a funcionalidade real ao ambiente JavaScript, de modo que este último possa ser usado com várias implementações do Node-API. No exemplo abaixo, `addon.c` e `addon.h` referem-se apenas a `js_native_api.h`. Isso garante que `addon.c` possa ser reutilizado para compilar em relação à implementação Node.js do Node-API ou qualquer implementação do Node-API fora do Node.js.

`addon_node.c` é um arquivo separado que contém o ponto de entrada específico do Node.js para o addon e que instancia o addon chamando `addon.c` quando o addon é carregado em um ambiente Node.js.

```C [C]
// addon.h
#ifndef _ADDON_H_
#define _ADDON_H_
#include <js_native_api.h>
napi_value create_addon(napi_env env);
#endif  // _ADDON_H_
```
```C [C]
// addon.c
#include "addon.h"

#define NODE_API_CALL(env, call)                                  \
  do {                                                            \
    napi_status status = (call);                                  \
    if (status != napi_ok) {                                      \
      const napi_extended_error_info* error_info = NULL;          \
      napi_get_last_error_info((env), &error_info);               \
      const char* err_message = error_info->error_message;        \
      bool is_pending;                                            \
      napi_is_exception_pending((env), &is_pending);              \
      /* If an exception is already pending, don't rethrow it */  \
      if (!is_pending) {                                          \
        const char* message = (err_message == NULL)               \
            ? "empty error message"                               \
            : err_message;                                        \
        napi_throw_error((env), NULL, message);                   \
      }                                                           \
      return NULL;                                                \
    }                                                             \
  } while(0)

static napi_value
DoSomethingUseful(napi_env env, napi_callback_info info) {
  // Do something useful.
  return NULL;
}

napi_value create_addon(napi_env env) {
  napi_value result;
  NODE_API_CALL(env, napi_create_object(env, &result));

  napi_value exported_function;
  NODE_API_CALL(env, napi_create_function(env,
                                          "doSomethingUseful",
                                          NAPI_AUTO_LENGTH,
                                          DoSomethingUseful,
                                          NULL,
                                          &exported_function));

  NODE_API_CALL(env, napi_set_named_property(env,
                                             result,
                                             "doSomethingUseful",
                                             exported_function));

  return result;
}
```
```C [C]
// addon_node.c
#include <node_api.h>
#include "addon.h"

NAPI_MODULE_INIT(/* napi_env env, napi_value exports */) {
  // This function body is expected to return a `napi_value`.
  // The variables `napi_env env` and `napi_value exports` may be used within
  // the body, as they are provided by the definition of `NAPI_MODULE_INIT()`.
  return create_addon(env);
}
```

## APIs do ciclo de vida do ambiente {#environment-life-cycle-apis}

A [Seção 8.7](https://tc39.es/ecma262/#sec-agents) da [Especificação da Linguagem ECMAScript](https://tc39.github.io/ecma262/) define o conceito de "Agente" como um ambiente autocontido no qual o código JavaScript é executado. Vários desses Agentes podem ser iniciados e encerrados simultaneamente ou em sequência pelo processo.

Um ambiente Node.js corresponde a um Agente ECMAScript. No processo principal, um ambiente é criado na inicialização e ambientes adicionais podem ser criados em threads separados para servir como [threads de trabalho](https://nodejs.org/api/worker_threads). Quando o Node.js é incorporado em outro aplicativo, a thread principal do aplicativo também pode construir e destruir um ambiente Node.js várias vezes durante o ciclo de vida do processo do aplicativo, de modo que cada ambiente Node.js criado pelo aplicativo pode, por sua vez, durante seu ciclo de vida, criar e destruir ambientes adicionais como threads de trabalho.

Da perspectiva de um addon nativo, isso significa que os bindings que ele fornece podem ser chamados várias vezes, de vários contextos e até mesmo simultaneamente de várias threads.

Addons nativos podem precisar alocar um estado global que eles usam durante o ciclo de vida de um ambiente Node.js, de forma que o estado possa ser único para cada instância do addon.

Para esse fim, o Node-API fornece uma maneira de associar dados de forma que seu ciclo de vida esteja vinculado ao ciclo de vida de um ambiente Node.js.

### `napi_set_instance_data` {#napi_set_instance_data}

**Adicionado em: v12.8.0, v10.20.0**

**Versão N-API: 6**

```C [C]
napi_status napi_set_instance_data(node_api_basic_env env,
                                   void* data,
                                   napi_finalize finalize_cb,
                                   void* finalize_hint);
```
- `[in] env`: O ambiente sob o qual a chamada Node-API é invocada.
- `[in] data`: O item de dados a ser disponibilizado para os bindings desta instância.
- `[in] finalize_cb`: A função a ser chamada quando o ambiente está sendo desmontado. A função recebe `data` para que possa liberá-lo. [`napi_finalize`](/pt/nodejs/api/n-api#napi_finalize) fornece mais detalhes.
- `[in] finalize_hint`: Dica opcional para passar para o callback de finalização durante a coleta.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API associa `data` ao ambiente Node.js em execução no momento. `data` pode ser recuperado posteriormente usando `napi_get_instance_data()`. Quaisquer dados existentes associados ao ambiente Node.js em execução no momento que foram definidos por meio de uma chamada anterior para `napi_set_instance_data()` serão sobrescritos. Se um `finalize_cb` foi fornecido pela chamada anterior, ele não será chamado.


### `napi_get_instance_data` {#napi_get_instance_data}

**Adicionado em: v12.8.0, v10.20.0**

**Versão N-API: 6**

```C [C]
napi_status napi_get_instance_data(node_api_basic_env env,
                                   void** data);
```
- `[in] env`: O ambiente sob o qual a chamada da Node-API é invocada.
- `[out] data`: O item de dados que foi previamente associado ao ambiente Node.js atualmente em execução por uma chamada a `napi_set_instance_data()`.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API recupera dados que foram previamente associados ao ambiente Node.js atualmente em execução através de `napi_set_instance_data()`. Se nenhum dado for definido, a chamada será bem-sucedida e `data` será definido como `NULL`.

## Tipos de dados básicos da Node-API {#basic-node-api-data-types}

A Node-API expõe os seguintes tipos de dados fundamentais como abstrações que são consumidas pelas várias APIs. Essas APIs devem ser tratadas como opacas, introspectáveis apenas com outras chamadas da Node-API.

### `napi_status` {#napi_status}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

Código de status integral indicando o sucesso ou falha de uma chamada da Node-API. Atualmente, os seguintes códigos de status são suportados.

```C [C]
typedef enum {
  napi_ok,
  napi_invalid_arg,
  napi_object_expected,
  napi_string_expected,
  napi_name_expected,
  napi_function_expected,
  napi_number_expected,
  napi_boolean_expected,
  napi_array_expected,
  napi_generic_failure,
  napi_pending_exception,
  napi_cancelled,
  napi_escape_called_twice,
  napi_handle_scope_mismatch,
  napi_callback_scope_mismatch,
  napi_queue_full,
  napi_closing,
  napi_bigint_expected,
  napi_date_expected,
  napi_arraybuffer_expected,
  napi_detachable_arraybuffer_expected,
  napi_would_deadlock,  /* unused */
  napi_no_external_buffers_allowed,
  napi_cannot_run_js
} napi_status;
```
Se informações adicionais forem necessárias quando uma API retornar um status de falha, elas podem ser obtidas chamando `napi_get_last_error_info`.

### `napi_extended_error_info` {#napi_extended_error_info}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

```C [C]
typedef struct {
  const char* error_message;
  void* engine_reserved;
  uint32_t engine_error_code;
  napi_status error_code;
} napi_extended_error_info;
```
- `error_message`: String codificada em UTF8 contendo uma descrição neutra para VM do erro.
- `engine_reserved`: Reservado para detalhes de erro específicos da VM. Atualmente, isso não está implementado para nenhuma VM.
- `engine_error_code`: Código de erro específico da VM. Atualmente, isso não está implementado para nenhuma VM.
- `error_code`: O código de status da Node-API que se originou com o último erro.

Veja a seção [Tratamento de erros](/pt/nodejs/api/n-api#error-handling) para informações adicionais.


### `napi_env` {#napi_env}

`napi_env` é usado para representar um contexto que a implementação Node-API subjacente pode usar para persistir o estado específico da VM. Essa estrutura é passada para funções nativas quando elas são invocadas e deve ser retornada ao fazer chamadas Node-API. Especificamente, o mesmo `napi_env` que foi passado quando a função nativa inicial foi chamada deve ser passado para quaisquer chamadas Node-API aninhadas subsequentes. O cache do `napi_env` com o objetivo de reutilização geral e a passagem do `napi_env` entre instâncias do mesmo addon em execução em diferentes threads [`Worker`](/pt/nodejs/api/worker_threads#class-worker) não são permitidos. O `napi_env` se torna inválido quando uma instância de um addon nativo é descarregada. A notificação desse evento é entregue por meio dos callbacks fornecidos para [`napi_add_env_cleanup_hook`](/pt/nodejs/api/n-api#napi_add_env_cleanup_hook) e [`napi_set_instance_data`](/pt/nodejs/api/n-api#napi_set_instance_data).

### `node_api_basic_env` {#node_api_basic_env}

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

Esta variante de `napi_env` é passada para finalizadores síncronos ([`node_api_basic_finalize`](/pt/nodejs/api/n-api#node_api_basic_finalize)). Há um subconjunto de Node-APIs que aceitam um parâmetro do tipo `node_api_basic_env` como seu primeiro argumento. Essas APIs não acessam o estado do mecanismo JavaScript e, portanto, são seguras para serem chamadas de finalizadores síncronos. Passar um parâmetro do tipo `napi_env` para essas APIs é permitido, no entanto, passar um parâmetro do tipo `node_api_basic_env` para APIs que acessam o estado do mecanismo JavaScript não é permitido. Tentar fazer isso sem uma conversão produzirá um aviso do compilador ou um erro quando os addons forem compilados com flags que fazem com que eles emitam avisos e/ou erros quando tipos de ponteiro incorretos forem passados para uma função. Chamar tais APIs de um finalizador síncrono acabará resultando no encerramento do aplicativo.

### `napi_value` {#napi_value}

Este é um ponteiro opaco que é usado para representar um valor JavaScript.


### `napi_threadsafe_function` {#napi_threadsafe_function}

**Adicionado em: v10.6.0**

**Versão N-API: 4**

Este é um ponteiro opaco que representa uma função JavaScript que pode ser chamada assincronamente de várias threads através de `napi_call_threadsafe_function()`.

### `napi_threadsafe_function_release_mode` {#napi_threadsafe_function_release_mode}

**Adicionado em: v10.6.0**

**Versão N-API: 4**

Um valor a ser dado para `napi_release_threadsafe_function()` para indicar se a função thread-safe deve ser fechada imediatamente (`napi_tsfn_abort`) ou meramente liberada (`napi_tsfn_release`) e, portanto, disponível para uso subsequente através de `napi_acquire_threadsafe_function()` e `napi_call_threadsafe_function()`.

```C [C]
typedef enum {
  napi_tsfn_release,
  napi_tsfn_abort
} napi_threadsafe_function_release_mode;
```
### `napi_threadsafe_function_call_mode` {#napi_threadsafe_function_call_mode}

**Adicionado em: v10.6.0**

**Versão N-API: 4**

Um valor a ser dado para `napi_call_threadsafe_function()` para indicar se a chamada deve bloquear sempre que a fila associada à função thread-safe estiver cheia.

```C [C]
typedef enum {
  napi_tsfn_nonblocking,
  napi_tsfn_blocking
} napi_threadsafe_function_call_mode;
```
### Tipos de gerenciamento de memória Node-API {#node-api-memory-management-types}

#### `napi_handle_scope` {#napi_handle_scope}

Esta é uma abstração usada para controlar e modificar o tempo de vida dos objetos criados dentro de um escopo particular. Em geral, os valores Node-API são criados dentro do contexto de um escopo de manipulador. Quando um método nativo é chamado a partir do JavaScript, um escopo de manipulador padrão existirá. Se o usuário não criar explicitamente um novo escopo de manipulador, os valores Node-API serão criados no escopo de manipulador padrão. Para quaisquer invocações de código fora da execução de um método nativo (por exemplo, durante uma invocação de callback libuv), o módulo é obrigado a criar um escopo antes de invocar quaisquer funções que possam resultar na criação de valores JavaScript.

Os escopos de manipulador são criados usando [`napi_open_handle_scope`](/pt/nodejs/api/n-api#napi_open_handle_scope) e são destruídos usando [`napi_close_handle_scope`](/pt/nodejs/api/n-api#napi_close_handle_scope). Fechar o escopo pode indicar ao GC que todos os `napi_value`s criados durante o tempo de vida do escopo de manipulador não são mais referenciados a partir do frame de pilha atual.

Para mais detalhes, revise o [Gerenciamento do tempo de vida do objeto](/pt/nodejs/api/n-api#object-lifetime-management).


#### `napi_escapable_handle_scope` {#napi_escapable_handle_scope}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

Escopos de manipulador escapáveis são um tipo especial de escopo de manipulador para retornar valores criados dentro de um escopo de manipulador específico para um escopo pai.

#### `napi_ref` {#napi_ref}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

Esta é a abstração a ser usada para referenciar um `napi_value`. Isso permite que os usuários gerenciem os tempos de vida dos valores JavaScript, incluindo a definição explícita de seus tempos de vida mínimos.

Para obter mais detalhes, revise o [Gerenciamento do tempo de vida do objeto](/pt/nodejs/api/n-api#object-lifetime-management).

#### `napi_type_tag` {#napi_type_tag}

**Adicionado em: v14.8.0, v12.19.0**

**Versão N-API: 8**

Um valor de 128 bits armazenado como dois inteiros não assinados de 64 bits. Ele serve como um UUID com o qual objetos JavaScript ou [externals](/pt/nodejs/api/n-api#napi_create_external) podem ser "marcados" para garantir que sejam de um determinado tipo. Esta é uma verificação mais forte do que [`napi_instanceof`](/pt/nodejs/api/n-api#napi_instanceof), porque esta última pode relatar um falso positivo se o protótipo do objeto tiver sido manipulado. A marcação de tipo é mais útil em conjunto com [`napi_wrap`](/pt/nodejs/api/n-api#napi_wrap) porque garante que o ponteiro recuperado de um objeto encapsulado possa ser convertido com segurança para o tipo nativo correspondente à tag de tipo que havia sido aplicada anteriormente ao objeto JavaScript.

```C [C]
typedef struct {
  uint64_t lower;
  uint64_t upper;
} napi_type_tag;
```
#### `napi_async_cleanup_hook_handle` {#napi_async_cleanup_hook_handle}

**Adicionado em: v14.10.0, v12.19.0**

Um valor opaco retornado por [`napi_add_async_cleanup_hook`](/pt/nodejs/api/n-api#napi_add_async_cleanup_hook). Ele deve ser passado para [`napi_remove_async_cleanup_hook`](/pt/nodejs/api/n-api#napi_remove_async_cleanup_hook) quando a cadeia de eventos de limpeza assíncronos for concluída.

### Tipos de callback Node-API {#node-api-callback-types}

#### `napi_callback_info` {#napi_callback_info}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

Tipo de dados opaco que é passado para uma função de callback. Pode ser usado para obter informações adicionais sobre o contexto no qual o callback foi invocado.

#### `napi_callback` {#napi_callback}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

Tipo de ponteiro de função para funções nativas fornecidas pelo usuário que devem ser expostas ao JavaScript via Node-API. As funções de callback devem satisfazer a seguinte assinatura:

```C [C]
typedef napi_value (*napi_callback)(napi_env, napi_callback_info);
```
A menos que por razões discutidas em [Gerenciamento do Tempo de Vida do Objeto](/pt/nodejs/api/n-api#object-lifetime-management), criar um escopo de manipulador e/ou callback dentro de um `napi_callback` não é necessário.


#### `node_api_basic_finalize` {#node_api_basic_finalize}

**Adicionado em: v21.6.0, v20.12.0, v18.20.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

Tipo de ponteiro de função para funções fornecidas pelo add-on que permitem que o usuário seja notificado quando os dados de propriedade externa estão prontos para serem limpos porque o objeto ao qual estavam associados foi coletado pelo coletor de lixo. O usuário deve fornecer uma função que satisfaça a seguinte assinatura, que seria chamada no momento da coleta do objeto. Atualmente, `node_api_basic_finalize` pode ser usado para descobrir quando objetos que possuem dados externos são coletados.

```C [C]
typedef void (*node_api_basic_finalize)(node_api_basic_env env,
                                      void* finalize_data,
                                      void* finalize_hint);
```
A menos que por razões discutidas em [Gerenciamento do Tempo de Vida do Objeto](/pt/nodejs/api/n-api#object-lifetime-management), criar um identificador e/ou escopo de callback dentro do corpo da função não é necessário.

Como essas funções podem ser chamadas enquanto o mecanismo JavaScript está em um estado onde não pode executar código JavaScript, apenas as Node-APIs que aceitam um `node_api_basic_env` como seu primeiro parâmetro podem ser chamadas. [`node_api_post_finalizer`](/pt/nodejs/api/n-api#node_api_post_finalizer) pode ser usado para agendar chamadas de Node-API que requerem acesso ao estado do mecanismo JavaScript para serem executadas após a conclusão do ciclo de coleta de lixo atual.

No caso de [`node_api_create_external_string_latin1`](/pt/nodejs/api/n-api#node_api_create_external_string_latin1) e [`node_api_create_external_string_utf16`](/pt/nodejs/api/n-api#node_api_create_external_string_utf16), o parâmetro `env` pode ser nulo, porque strings externas podem ser coletadas durante a última parte do encerramento do ambiente.

Histórico de Alterações:

- experimental (`NAPI_EXPERIMENTAL`): Apenas as chamadas Node-API que aceitam um `node_api_basic_env` como seu primeiro parâmetro podem ser chamadas, caso contrário, a aplicação será terminada com uma mensagem de erro apropriada. Este recurso pode ser desativado definindo `NODE_API_EXPERIMENTAL_BASIC_ENV_OPT_OUT`.


#### `napi_finalize` {#napi_finalize}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

Tipo de ponteiro de função para a função fornecida pelo add-on que permite ao usuário agendar um grupo de chamadas para as APIs do Node em resposta a um evento de coleta de lixo, após a conclusão do ciclo de coleta de lixo. Esses ponteiros de função podem ser usados com [`node_api_post_finalizer`](/pt/nodejs/api/n-api#node_api_post_finalizer).

```C [C]
typedef void (*napi_finalize)(napi_env env,
                              void* finalize_data,
                              void* finalize_hint);
```
Histórico de alterações:

- experimental (o `NAPI_EXPERIMENTAL` está definido): Uma função deste tipo pode não ser mais usada como finalizador, exceto com [`node_api_post_finalizer`](/pt/nodejs/api/n-api#node_api_post_finalizer). [`node_api_basic_finalize`](/pt/nodejs/api/n-api#node_api_basic_finalize) deve ser usado em vez disso. Este recurso pode ser desativado definindo `NODE_API_EXPERIMENTAL_BASIC_ENV_OPT_OUT`.

#### `napi_async_execute_callback` {#napi_async_execute_callback}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

Ponteiro de função usado com funções que suportam operações assíncronas. As funções de callback devem satisfazer a seguinte assinatura:

```C [C]
typedef void (*napi_async_execute_callback)(napi_env env, void* data);
```
As implementações desta função devem evitar fazer chamadas Node-API que executem JavaScript ou interajam com objetos JavaScript. As chamadas Node-API devem estar no `napi_async_complete_callback` em vez disso. Não use o parâmetro `napi_env`, pois provavelmente resultará na execução de JavaScript.

#### `napi_async_complete_callback` {#napi_async_complete_callback}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

Ponteiro de função usado com funções que suportam operações assíncronas. As funções de callback devem satisfazer a seguinte assinatura:

```C [C]
typedef void (*napi_async_complete_callback)(napi_env env,
                                             napi_status status,
                                             void* data);
```
A menos que por razões discutidas em [Gerenciamento do Tempo de Vida do Objeto](/pt/nodejs/api/n-api#object-lifetime-management), criar um handle e/ou escopo de callback dentro do corpo da função não é necessário.


#### `napi_threadsafe_function_call_js` {#napi_threadsafe_function_call_js}

**Adicionado em: v10.6.0**

**Versão N-API: 4**

Ponteiro de função usado com chamadas de função assíncronas thread-safe. O callback será chamado na thread principal. Seu propósito é usar um item de dados que chega através da fila de uma das threads secundárias para construir os parâmetros necessários para uma chamada para JavaScript, geralmente através de `napi_call_function`, e então fazer a chamada para JavaScript.

Os dados que chegam da thread secundária através da fila são fornecidos no parâmetro `data` e a função JavaScript para chamar é fornecida no parâmetro `js_callback`.

Node-API configura o ambiente antes de chamar este callback, então é suficiente chamar a função JavaScript através de `napi_call_function` ao invés de através de `napi_make_callback`.

As funções de callback devem satisfazer a seguinte assinatura:

```C [C]
typedef void (*napi_threadsafe_function_call_js)(napi_env env,
                                                 napi_value js_callback,
                                                 void* context,
                                                 void* data);
```
- `[in] env`: O ambiente para usar para chamadas de API, ou `NULL` se a função thread-safe estiver sendo desmontada e `data` pode precisar ser liberado.
- `[in] js_callback`: A função JavaScript para chamar, ou `NULL` se a função thread-safe estiver sendo desmontada e `data` pode precisar ser liberado. Também pode ser `NULL` se a função thread-safe foi criada sem `js_callback`.
- `[in] context`: Os dados opcionais com os quais a função thread-safe foi criada.
- `[in] data`: Dados criados pela thread secundária. É responsabilidade do callback converter esses dados nativos em valores JavaScript (com funções Node-API) que podem ser passados como parâmetros quando `js_callback` é invocado. Este ponteiro é gerenciado inteiramente pelas threads e este callback. Portanto, este callback deve liberar os dados.

A menos que por razões discutidas em [Gerenciamento do Tempo de Vida do Objeto](/pt/nodejs/api/n-api#object-lifetime-management), criar um handle e/ou um escopo de callback dentro do corpo da função não é necessário.


#### `napi_cleanup_hook` {#napi_cleanup_hook}

**Adicionado em: v19.2.0, v18.13.0**

**Versão N-API: 3**

Ponteiro de função usado com [`napi_add_env_cleanup_hook`](/pt/nodejs/api/n-api#napi_add_env_cleanup_hook). Será chamado quando o ambiente estiver sendo desmontado.

As funções de callback devem satisfazer a seguinte assinatura:

```C [C]
typedef void (*napi_cleanup_hook)(void* data);
```
- `[in] data`: Os dados que foram passados para [`napi_add_env_cleanup_hook`](/pt/nodejs/api/n-api#napi_add_env_cleanup_hook).

#### `napi_async_cleanup_hook` {#napi_async_cleanup_hook}

**Adicionado em: v14.10.0, v12.19.0**

Ponteiro de função usado com [`napi_add_async_cleanup_hook`](/pt/nodejs/api/n-api#napi_add_async_cleanup_hook). Será chamado quando o ambiente estiver sendo desmontado.

As funções de callback devem satisfazer a seguinte assinatura:

```C [C]
typedef void (*napi_async_cleanup_hook)(napi_async_cleanup_hook_handle handle,
                                        void* data);
```
- `[in] handle`: O handle que deve ser passado para [`napi_remove_async_cleanup_hook`](/pt/nodejs/api/n-api#napi_remove_async_cleanup_hook) após a conclusão da limpeza assíncrona.
- `[in] data`: Os dados que foram passados para [`napi_add_async_cleanup_hook`](/pt/nodejs/api/n-api#napi_add_async_cleanup_hook).

O corpo da função deve iniciar as ações de limpeza assíncronas, no final das quais `handle` deve ser passado em uma chamada para [`napi_remove_async_cleanup_hook`](/pt/nodejs/api/n-api#napi_remove_async_cleanup_hook).

## Tratamento de erros {#error-handling}

Node-API usa valores de retorno e exceções JavaScript para tratamento de erros. As seções a seguir explicam a abordagem para cada caso.

### Valores de retorno {#return-values}

Todas as funções Node-API compartilham o mesmo padrão de tratamento de erros. O tipo de retorno de todas as funções API é `napi_status`.

O valor de retorno será `napi_ok` se a solicitação for bem-sucedida e nenhuma exceção JavaScript não capturada for lançada. Se ocorrer um erro E uma exceção for lançada, o valor `napi_status` para o erro será retornado. Se uma exceção for lançada e nenhum erro ocorrer, `napi_pending_exception` será retornado.

Nos casos em que um valor de retorno diferente de `napi_ok` ou `napi_pending_exception` for retornado, [`napi_is_exception_pending`](/pt/nodejs/api/n-api#napi_is_exception_pending) deve ser chamado para verificar se há uma exceção pendente. Consulte a seção sobre exceções para obter mais detalhes.

O conjunto completo de valores `napi_status` possíveis é definido em `napi_api_types.h`.

O valor de retorno `napi_status` fornece uma representação independente da VM do erro que ocorreu. Em alguns casos, é útil poder obter informações mais detalhadas, incluindo uma string representando o erro, bem como informações específicas da VM (engine).

Para recuperar essas informações, [`napi_get_last_error_info`](/pt/nodejs/api/n-api#napi_get_last_error_info) é fornecido e retorna uma estrutura `napi_extended_error_info`. O formato da estrutura `napi_extended_error_info` é o seguinte:

**Adicionado em: v8.0.0**

**Versão N-API: 1**

```C [C]
typedef struct napi_extended_error_info {
  const char* error_message;
  void* engine_reserved;
  uint32_t engine_error_code;
  napi_status error_code;
};
```
- `error_message`: Representação textual do erro que ocorreu.
- `engine_reserved`: Handle opaco reservado apenas para uso do engine.
- `engine_error_code`: Código de erro específico da VM.
- `error_code`: Código de status Node-API para o último erro.

[`napi_get_last_error_info`](/pt/nodejs/api/n-api#napi_get_last_error_info) retorna as informações da última chamada Node-API que foi feita.

Não confie no conteúdo ou formato de nenhuma das informações estendidas, pois não está sujeito ao SemVer e pode mudar a qualquer momento. Destina-se apenas a fins de registro.


#### `napi_get_last_error_info` {#napi_get_last_error_info}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

```C [C]
napi_status
napi_get_last_error_info(node_api_basic_env env,
                         const napi_extended_error_info** result);
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[out] result`: A estrutura `napi_extended_error_info` com mais informações sobre o erro.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API recupera uma estrutura `napi_extended_error_info` com informações sobre o último erro que ocorreu.

O conteúdo do `napi_extended_error_info` retornado é válido apenas até que uma função Node-API seja chamada no mesmo `env`. Isso inclui uma chamada para `napi_is_exception_pending`, portanto, muitas vezes pode ser necessário fazer uma cópia das informações para que possam ser usadas posteriormente. O ponteiro retornado em `error_message` aponta para uma string definida estaticamente, portanto, é seguro usar esse ponteiro se você o copiou do campo `error_message` (que será substituído) antes que outra função Node-API fosse chamada.

Não confie no conteúdo ou formato de nenhuma das informações estendidas, pois não estão sujeitas ao SemVer e podem mudar a qualquer momento. Destina-se apenas para fins de registro.

Esta API pode ser chamada mesmo que haja uma exceção JavaScript pendente.

### Exceções {#exceptions}

Qualquer chamada de função Node-API pode resultar em uma exceção JavaScript pendente. Este é o caso para qualquer uma das funções da API, mesmo aquelas que podem não causar a execução do JavaScript.

Se o `napi_status` retornado por uma função for `napi_ok`, nenhuma exceção está pendente e nenhuma ação adicional é necessária. Se o `napi_status` retornado for diferente de `napi_ok` ou `napi_pending_exception`, para tentar recuperar e continuar em vez de simplesmente retornar imediatamente, [`napi_is_exception_pending`](/pt/nodejs/api/n-api#napi_is_exception_pending) deve ser chamado para determinar se uma exceção está pendente ou não.

Em muitos casos, quando uma função Node-API é chamada e uma exceção já está pendente, a função retornará imediatamente com um `napi_status` de `napi_pending_exception`. No entanto, este não é o caso para todas as funções. A Node-API permite que um subconjunto das funções seja chamado para permitir alguma limpeza mínima antes de retornar ao JavaScript. Nesse caso, `napi_status` refletirá o status da função. Não refletirá exceções pendentes anteriores. Para evitar confusão, verifique o status do erro após cada chamada de função.

Quando uma exceção está pendente, uma de duas abordagens pode ser empregada.

A primeira abordagem é fazer qualquer limpeza apropriada e, em seguida, retornar para que a execução retorne ao JavaScript. Como parte da transição de volta ao JavaScript, a exceção será lançada no ponto do código JavaScript onde o método nativo foi invocado. O comportamento da maioria das chamadas Node-API não é especificado enquanto uma exceção está pendente, e muitas simplesmente retornarão `napi_pending_exception`, então faça o mínimo possível e, em seguida, retorne ao JavaScript onde a exceção pode ser tratada.

A segunda abordagem é tentar tratar a exceção. Haverá casos em que o código nativo pode capturar a exceção, tomar a ação apropriada e, em seguida, continuar. Isso é recomendado apenas em casos específicos onde é conhecido que a exceção pode ser tratada com segurança. Nesses casos, [`napi_get_and_clear_last_exception`](/pt/nodejs/api/n-api#napi_get_and_clear_last_exception) pode ser usado para obter e limpar a exceção. Em caso de sucesso, o resultado conterá o manipulador para o último `Object` JavaScript lançado. Se for determinado, após recuperar a exceção, que a exceção não pode ser tratada, ela pode ser relançada com [`napi_throw`](/pt/nodejs/api/n-api#napi_throw), onde error é o valor JavaScript a ser lançado.

As seguintes funções de utilidade também estão disponíveis caso o código nativo precise lançar uma exceção ou determinar se um `napi_value` é uma instância de um objeto `Error` JavaScript: [`napi_throw_error`](/pt/nodejs/api/n-api#napi_throw_error), [`napi_throw_type_error`](/pt/nodejs/api/n-api#napi_throw_type_error), [`napi_throw_range_error`](/pt/nodejs/api/n-api#napi_throw_range_error), [`node_api_throw_syntax_error`](/pt/nodejs/api/n-api#node_api_throw_syntax_error) e [`napi_is_error`](/pt/nodejs/api/n-api#napi_is_error).

As seguintes funções de utilidade também estão disponíveis caso o código nativo precise criar um objeto `Error`: [`napi_create_error`](/pt/nodejs/api/n-api#napi_create_error), [`napi_create_type_error`](/pt/nodejs/api/n-api#napi_create_type_error), [`napi_create_range_error`](/pt/nodejs/api/n-api#napi_create_range_error) e [`node_api_create_syntax_error`](/pt/nodejs/api/n-api#node_api_create_syntax_error), onde result é o `napi_value` que se refere ao objeto `Error` JavaScript recém-criado.

O projeto Node.js está adicionando códigos de erro a todos os erros gerados internamente. O objetivo é que os aplicativos usem esses códigos de erro para todas as verificações de erro. As mensagens de erro associadas permanecerão, mas devem ser usadas apenas para registro e exibição, com a expectativa de que a mensagem possa mudar sem que o SemVer seja aplicado. Para dar suporte a este modelo com Node-API, tanto na funcionalidade interna quanto para a funcionalidade específica do módulo (como é uma boa prática), as funções `throw_` e `create_` recebem um parâmetro de código opcional que é a string para o código a ser adicionado ao objeto de erro. Se o parâmetro opcional for `NULL`, nenhum código será associado ao erro. Se um código for fornecido, o nome associado ao erro também será atualizado para ser:

```text [TEXT]
originalName [code]
```
onde `originalName` é o nome original associado ao erro e `code` é o código que foi fornecido. Por exemplo, se o código for `'ERR_ERROR_1'` e um `TypeError` estiver sendo criado, o nome será:

```text [TEXT]
TypeError [ERR_ERROR_1]
```

#### `napi_throw` {#napi_throw}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_throw(napi_env env, napi_value error);
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] error`: O valor JavaScript a ser lançado.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API lança o valor JavaScript fornecido.

#### `napi_throw_error` {#napi_throw_error}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_throw_error(napi_env env,
                                         const char* code,
                                         const char* msg);
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] code`: Código de erro opcional a ser definido no erro.
- `[in] msg`: String C representando o texto a ser associado ao erro.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API lança um `Error` JavaScript com o texto fornecido.

#### `napi_throw_type_error` {#napi_throw_type_error}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_throw_type_error(napi_env env,
                                              const char* code,
                                              const char* msg);
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] code`: Código de erro opcional a ser definido no erro.
- `[in] msg`: String C representando o texto a ser associado ao erro.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API lança um `TypeError` JavaScript com o texto fornecido.

#### `napi_throw_range_error` {#napi_throw_range_error}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_throw_range_error(napi_env env,
                                               const char* code,
                                               const char* msg);
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] code`: Código de erro opcional a ser definido no erro.
- `[in] msg`: String C representando o texto a ser associado ao erro.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API lança um `RangeError` JavaScript com o texto fornecido.


#### `node_api_throw_syntax_error` {#node_api_throw_syntax_error}

**Adicionado em: v17.2.0, v16.14.0**

**Versão da N-API: 9**

```C [C]
NAPI_EXTERN napi_status node_api_throw_syntax_error(napi_env env,
                                                    const char* code,
                                                    const char* msg);
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] code`: Código de erro opcional a ser definido no erro.
- `[in] msg`: String C representando o texto a ser associado ao erro.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API lança um `SyntaxError` do JavaScript com o texto fornecido.

#### `napi_is_error` {#napi_is_error}

**Adicionado em: v8.0.0**

**Versão da N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_is_error(napi_env env,
                                      napi_value value,
                                      bool* result);
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] value`: O `napi_value` a ser verificado.
- `[out] result`: Valor booleano que é definido como verdadeiro se `napi_value` representa um erro, falso caso contrário.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API consulta um `napi_value` para verificar se ele representa um objeto de erro.

#### `napi_create_error` {#napi_create_error}

**Adicionado em: v8.0.0**

**Versão da N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_create_error(napi_env env,
                                          napi_value code,
                                          napi_value msg,
                                          napi_value* result);
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] code`: `napi_value` opcional com a string para o código de erro a ser associado ao erro.
- `[in] msg`: `napi_value` que referencia uma `string` JavaScript a ser usada como a mensagem para o `Error`.
- `[out] result`: `napi_value` representando o erro criado.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API retorna um `Error` do JavaScript com o texto fornecido.

#### `napi_create_type_error` {#napi_create_type_error}

**Adicionado em: v8.0.0**

**Versão da N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_create_type_error(napi_env env,
                                               napi_value code,
                                               napi_value msg,
                                               napi_value* result);
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] code`: `napi_value` opcional com a string para o código de erro a ser associado ao erro.
- `[in] msg`: `napi_value` que referencia uma `string` JavaScript a ser usada como a mensagem para o `Error`.
- `[out] result`: `napi_value` representando o erro criado.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API retorna um `TypeError` do JavaScript com o texto fornecido.


#### `napi_create_range_error` {#napi_create_range_error}

**Adicionado em: v8.0.0**

**Versão da N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_create_range_error(napi_env env,
                                                napi_value code,
                                                napi_value msg,
                                                napi_value* result);
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] code`: `napi_value` opcional com a string para o código de erro a ser associado ao erro.
- `[in] msg`: `napi_value` que referencia uma `string` JavaScript a ser usada como a mensagem para o `Error`.
- `[out] result`: `napi_value` representando o erro criado.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API retorna um `RangeError` JavaScript com o texto fornecido.

#### `node_api_create_syntax_error` {#node_api_create_syntax_error}

**Adicionado em: v17.2.0, v16.14.0**

**Versão da N-API: 9**

```C [C]
NAPI_EXTERN napi_status node_api_create_syntax_error(napi_env env,
                                                     napi_value code,
                                                     napi_value msg,
                                                     napi_value* result);
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] code`: `napi_value` opcional com a string para o código de erro a ser associado ao erro.
- `[in] msg`: `napi_value` que referencia uma `string` JavaScript a ser usada como a mensagem para o `Error`.
- `[out] result`: `napi_value` representando o erro criado.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API retorna um `SyntaxError` JavaScript com o texto fornecido.

#### `napi_get_and_clear_last_exception` {#napi_get_and_clear_last_exception}

**Adicionado em: v8.0.0**

**Versão da N-API: 1**

```C [C]
napi_status napi_get_and_clear_last_exception(napi_env env,
                                              napi_value* result);
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[out] result`: A exceção se houver uma pendente, `NULL` caso contrário.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API pode ser chamada mesmo que haja uma exceção JavaScript pendente.


#### `napi_is_exception_pending` {#napi_is_exception_pending}

**Adicionado em: v8.0.0**

**Versão da N-API: 1**

```C [C]
napi_status napi_is_exception_pending(napi_env env, bool* result);
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[out] result`: Valor booleano que é definido como verdadeiro se uma exceção estiver pendente.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API pode ser chamada mesmo que haja uma exceção JavaScript pendente.

#### `napi_fatal_exception` {#napi_fatal_exception}

**Adicionado em: v9.10.0**

**Versão da N-API: 3**

```C [C]
napi_status napi_fatal_exception(napi_env env, napi_value err);
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] err`: O erro que é passado para `'uncaughtException'`.

Aciona uma `'uncaughtException'` em JavaScript. Útil se um retorno de chamada assíncrono lançar uma exceção sem como se recuperar.

### Erros fatais {#fatal-errors}

No caso de um erro irrecuperável em um addon nativo, um erro fatal pode ser lançado para terminar imediatamente o processo.

#### `napi_fatal_error` {#napi_fatal_error}

**Adicionado em: v8.2.0**

**Versão da N-API: 1**

```C [C]
NAPI_NO_RETURN void napi_fatal_error(const char* location,
                                     size_t location_len,
                                     const char* message,
                                     size_t message_len);
```
- `[in] location`: Localização opcional em que o erro ocorreu.
- `[in] location_len`: O comprimento da localização em bytes ou `NAPI_AUTO_LENGTH` se for terminado em nulo.
- `[in] message`: A mensagem associada ao erro.
- `[in] message_len`: O comprimento da mensagem em bytes ou `NAPI_AUTO_LENGTH` se for terminado em nulo.

A chamada de função não retorna, o processo será terminado.

Esta API pode ser chamada mesmo que haja uma exceção JavaScript pendente.

## Gerenciamento do tempo de vida do objeto {#object-lifetime-management}

À medida que as chamadas Node-API são feitas, os identificadores para objetos no heap para a VM subjacente podem ser retornados como `napi_values`. Esses identificadores devem manter os objetos 'ativos' até que não sejam mais necessários pelo código nativo, caso contrário, os objetos podem ser coletados antes que o código nativo termine de usá-los.

À medida que os identificadores de objeto são retornados, eles são associados a um 'escopo'. A vida útil do escopo padrão está ligada à vida útil da chamada do método nativo. O resultado é que, por padrão, os identificadores permanecem válidos e os objetos associados a esses identificadores serão mantidos ativos durante a vida útil da chamada do método nativo.

Em muitos casos, no entanto, é necessário que os identificadores permaneçam válidos por uma vida útil mais curta ou mais longa do que a do método nativo. As seções a seguir descrevem as funções Node-API que podem ser usadas para alterar a vida útil do identificador do padrão.


### Tornando a vida útil do identificador menor do que a do método nativo {#making-handle-lifespan-shorter-than-that-of-the-native-method}

Muitas vezes, é necessário tornar a vida útil dos identificadores menor do que a vida útil de um método nativo. Por exemplo, considere um método nativo que possui um loop que itera pelos elementos em uma matriz grande:

```C [C]
for (int i = 0; i < 1000000; i++) {
  napi_value result;
  napi_status status = napi_get_element(env, object, i, &result);
  if (status != napi_ok) {
    break;
  }
  // do something with element
}
```
Isso resultaria em um grande número de identificadores sendo criados, consumindo recursos substanciais. Além disso, mesmo que o código nativo pudesse usar apenas o identificador mais recente, todos os objetos associados também seriam mantidos ativos, pois todos compartilham o mesmo escopo.

Para lidar com este caso, a Node-API fornece a capacidade de estabelecer um novo 'escopo' ao qual os identificadores recém-criados serão associados. Depois que esses identificadores não forem mais necessários, o escopo poderá ser 'fechado' e todos os identificadores associados ao escopo serão invalidados. Os métodos disponíveis para abrir/fechar escopos são [`napi_open_handle_scope`](/pt/nodejs/api/n-api#napi_open_handle_scope) e [`napi_close_handle_scope`](/pt/nodejs/api/n-api#napi_close_handle_scope).

A Node-API suporta apenas uma única hierarquia aninhada de escopos. Existe apenas um escopo ativo a qualquer momento, e todos os novos identificadores serão associados a esse escopo enquanto ele estiver ativo. Os escopos devem ser fechados na ordem inversa de sua abertura. Além disso, todos os escopos criados dentro de um método nativo devem ser fechados antes de retornar desse método.

Pegando o exemplo anterior, adicionar chamadas para [`napi_open_handle_scope`](/pt/nodejs/api/n-api#napi_open_handle_scope) e [`napi_close_handle_scope`](/pt/nodejs/api/n-api#napi_close_handle_scope) garantiria que, no máximo, um único identificador seja válido durante toda a execução do loop:

```C [C]
for (int i = 0; i < 1000000; i++) {
  napi_handle_scope scope;
  napi_status status = napi_open_handle_scope(env, &scope);
  if (status != napi_ok) {
    break;
  }
  napi_value result;
  status = napi_get_element(env, object, i, &result);
  if (status != napi_ok) {
    break;
  }
  // do something with element
  status = napi_close_handle_scope(env, scope);
  if (status != napi_ok) {
    break;
  }
}
```
Ao aninhar escopos, existem casos em que um identificador de um escopo interno precisa viver além da vida útil desse escopo. A Node-API oferece suporte a um 'escopo escapável' para dar suporte a este caso. Um escopo escapável permite que um identificador seja 'promovido' para que ele 'escape' do escopo atual e a vida útil do identificador mude do escopo atual para o do escopo externo.

Os métodos disponíveis para abrir/fechar escopos escapáveis são [`napi_open_escapable_handle_scope`](/pt/nodejs/api/n-api#napi_open_escapable_handle_scope) e [`napi_close_escapable_handle_scope`](/pt/nodejs/api/n-api#napi_close_escapable_handle_scope).

A solicitação para promover um identificador é feita através de [`napi_escape_handle`](/pt/nodejs/api/n-api#napi_escape_handle) que só pode ser chamado uma vez.


#### `napi_open_handle_scope` {#napi_open_handle_scope}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_open_handle_scope(napi_env env,
                                               napi_handle_scope* result);
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[out] result`: `napi_value` representando o novo escopo.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API abre um novo escopo.

#### `napi_close_handle_scope` {#napi_close_handle_scope}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_close_handle_scope(napi_env env,
                                                napi_handle_scope scope);
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] scope`: `napi_value` representando o escopo a ser fechado.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API fecha o escopo passado. Os escopos devem ser fechados na ordem inversa em que foram criados.

Esta API pode ser chamada mesmo se houver uma exceção JavaScript pendente.

#### `napi_open_escapable_handle_scope` {#napi_open_escapable_handle_scope}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

```C [C]
NAPI_EXTERN napi_status
    napi_open_escapable_handle_scope(napi_env env,
                                     napi_handle_scope* result);
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[out] result`: `napi_value` representando o novo escopo.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API abre um novo escopo a partir do qual um objeto pode ser promovido para o escopo externo.

#### `napi_close_escapable_handle_scope` {#napi_close_escapable_handle_scope}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

```C [C]
NAPI_EXTERN napi_status
    napi_close_escapable_handle_scope(napi_env env,
                                      napi_handle_scope scope);
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] scope`: `napi_value` representando o escopo a ser fechado.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API fecha o escopo passado. Os escopos devem ser fechados na ordem inversa em que foram criados.

Esta API pode ser chamada mesmo se houver uma exceção JavaScript pendente.


#### `napi_escape_handle` {#napi_escape_handle}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

```C [C]
napi_status napi_escape_handle(napi_env env,
                               napi_escapable_handle_scope scope,
                               napi_value escapee,
                               napi_value* result);
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] scope`: `napi_value` representando o escopo atual.
- `[in] escapee`: `napi_value` representando o `Object` JavaScript a ser escapado.
- `[out] result`: `napi_value` representando o manipulador para o `Object` escapado no escopo externo.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API promove o manipulador para o objeto JavaScript para que seja válido durante toda a vida útil do escopo externo. Ele só pode ser chamado uma vez por escopo. Se for chamado mais de uma vez, um erro será retornado.

Esta API pode ser chamada mesmo que haja uma exceção JavaScript pendente.

### Referências a valores com uma vida útil maior do que a do método nativo {#references-to-values-with-a-lifespan-longer-than-that-of-the-native-method}

Em alguns casos, um addon precisará ser capaz de criar e referenciar valores com uma vida útil maior do que a de uma única invocação de método nativo. Por exemplo, para criar um construtor e, posteriormente, usar esse construtor em uma solicitação para criar instâncias, deve ser possível referenciar o objeto construtor em muitas solicitações de criação de instâncias diferentes. Isso não seria possível com um manipulador normal retornado como um `napi_value`, conforme descrito na seção anterior. A vida útil de um manipulador normal é gerenciada por escopos e todos os escopos devem ser fechados antes do final de um método nativo.

Node-API fornece métodos para criar referências persistentes a valores. Atualmente, Node-API permite que referências sejam criadas apenas para um conjunto limitado de tipos de valor, incluindo objeto, externo, função e símbolo.

Cada referência tem uma contagem associada com um valor de 0 ou superior, que determina se a referência manterá o valor correspondente ativo. Referências com uma contagem de 0 não impedem que os valores sejam coletados. Valores de tipos de objeto (objeto, função, externo) e símbolo estão se tornando referências 'fracas' e ainda podem ser acessados enquanto não são coletados. Qualquer contagem maior que 0 impedirá que os valores sejam coletados.

Os valores de símbolo têm diferentes tipos. O verdadeiro comportamento de referência fraca é suportado apenas por símbolos locais criados com a função `napi_create_symbol` ou as chamadas do construtor `Symbol()` do JavaScript. Símbolos registrados globalmente criados com a função `node_api_symbol_for` ou as chamadas da função `Symbol.for()` do JavaScript permanecem sempre referências fortes porque o coletor de lixo não os coleta. O mesmo é verdade para símbolos bem conhecidos, como `Symbol.iterator`. Eles também nunca são coletados pelo coletor de lixo.

As referências podem ser criadas com uma contagem de referência inicial. A contagem pode então ser modificada através de [`napi_reference_ref`](/pt/nodejs/api/n-api#napi_reference_ref) e [`napi_reference_unref`](/pt/nodejs/api/n-api#napi_reference_unref). Se um objeto for coletado enquanto a contagem para uma referência for 0, todas as chamadas subsequentes para obter o objeto associado à referência [`napi_get_reference_value`](/pt/nodejs/api/n-api#napi_get_reference_value) retornarão `NULL` para o `napi_value` retornado. Uma tentativa de chamar [`napi_reference_ref`](/pt/nodejs/api/n-api#napi_reference_ref) para uma referência cujo objeto foi coletado resulta em um erro.

As referências devem ser excluídas assim que não forem mais necessárias pelo addon. Quando uma referência é excluída, ela não impedirá mais que o objeto correspondente seja coletado. A falha ao excluir uma referência persistente resulta em um 'vazamento de memória' com a memória nativa para a referência persistente e o objeto correspondente no heap sendo retidos para sempre.

Pode haver várias referências persistentes criadas que se referem ao mesmo objeto, cada uma das quais manterá o objeto ativo ou não com base em sua contagem individual. Várias referências persistentes ao mesmo objeto podem resultar em manter inesperadamente a memória nativa ativa. As estruturas nativas para uma referência persistente devem ser mantidas ativas até que os finalizadores para o objeto referenciado sejam executados. Se uma nova referência persistente for criada para o mesmo objeto, os finalizadores para esse objeto não serão executados e a memória nativa apontada pela referência persistente anterior não será liberada. Isso pode ser evitado chamando `napi_delete_reference` além de `napi_reference_unref` quando possível.

**Histórico de alterações:**

- Experimental (`NAPI_EXPERIMENTAL` está definido): Referências podem ser criadas para todos os tipos de valor. Os novos tipos de valor suportados não suportam semântica de referência fraca e os valores desses tipos são liberados quando a contagem de referência se torna 0 e não podem mais ser acessados a partir da referência.


#### `napi_create_reference` {#napi_create_reference}

**Adicionado em: v8.0.0**

**Versão da N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_create_reference(napi_env env,
                                              napi_value value,
                                              uint32_t initial_refcount,
                                              napi_ref* result);
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] value`: O `napi_value` para o qual uma referência está sendo criada.
- `[in] initial_refcount`: Contagem inicial de referência para a nova referência.
- `[out] result`: `napi_ref` apontando para a nova referência.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API cria uma nova referência com a contagem de referência especificada para o valor passado.

#### `napi_delete_reference` {#napi_delete_reference}

**Adicionado em: v8.0.0**

**Versão da N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_delete_reference(napi_env env, napi_ref ref);
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] ref`: `napi_ref` a ser excluído.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API exclui a referência passada.

Esta API pode ser chamada mesmo que haja uma exceção JavaScript pendente.

#### `napi_reference_ref` {#napi_reference_ref}

**Adicionado em: v8.0.0**

**Versão da N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_reference_ref(napi_env env,
                                           napi_ref ref,
                                           uint32_t* result);
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] ref`: `napi_ref` para o qual a contagem de referência será incrementada.
- `[out] result`: A nova contagem de referência.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API incrementa a contagem de referência para a referência passada e retorna a contagem de referência resultante.

#### `napi_reference_unref` {#napi_reference_unref}

**Adicionado em: v8.0.0**

**Versão da N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_reference_unref(napi_env env,
                                             napi_ref ref,
                                             uint32_t* result);
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] ref`: `napi_ref` para o qual a contagem de referência será decrementada.
- `[out] result`: A nova contagem de referência.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API decrementa a contagem de referência para a referência passada e retorna a contagem de referência resultante.


#### `napi_get_reference_value` {#napi_get_reference_value}

**Adicionado em: v8.0.0**

**Versão da N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_get_reference_value(napi_env env,
                                                 napi_ref ref,
                                                 napi_value* result);
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] ref`: O `napi_ref` para o qual o valor correspondente está sendo solicitado.
- `[out] result`: O `napi_value` referenciado pelo `napi_ref`.

Retorna `napi_ok` se a API for bem-sucedida.

Se ainda for válido, esta API retorna o `napi_value` que representa o valor JavaScript associado ao `napi_ref`. Caso contrário, o resultado será `NULL`.

### Limpeza na saída do ambiente Node.js atual {#cleanup-on-exit-of-the-current-nodejs-environment}

Embora um processo Node.js normalmente libere todos os seus recursos ao sair, incorporadores do Node.js ou suporte futuro ao Worker podem exigir que os addons registrem hooks de limpeza que serão executados quando o ambiente Node.js atual for encerrado.

A Node-API fornece funções para registrar e cancelar o registro de tais callbacks. Quando esses callbacks são executados, todos os recursos que estão sendo mantidos pelo addon devem ser liberados.

#### `napi_add_env_cleanup_hook` {#napi_add_env_cleanup_hook}

**Adicionado em: v10.2.0**

**Versão da N-API: 3**

```C [C]
NODE_EXTERN napi_status napi_add_env_cleanup_hook(node_api_basic_env env,
                                                  napi_cleanup_hook fun,
                                                  void* arg);
```
Registra `fun` como uma função a ser executada com o parâmetro `arg` quando o ambiente Node.js atual for encerrado.

Uma função pode ser especificada com segurança várias vezes com valores `arg` diferentes. Nesse caso, ela também será chamada várias vezes. Fornecer os mesmos valores `fun` e `arg` várias vezes não é permitido e fará com que o processo seja abortado.

Os hooks serão chamados em ordem inversa, ou seja, o mais recentemente adicionado será chamado primeiro.

A remoção deste hook pode ser feita usando [`napi_remove_env_cleanup_hook`](/pt/nodejs/api/n-api#napi_remove_env_cleanup_hook). Normalmente, isso acontece quando o recurso para o qual este hook foi adicionado está sendo desfeito de qualquer maneira.

Para limpeza assíncrona, [`napi_add_async_cleanup_hook`](/pt/nodejs/api/n-api#napi_add_async_cleanup_hook) está disponível.


#### `napi_remove_env_cleanup_hook` {#napi_remove_env_cleanup_hook}

**Adicionado em: v10.2.0**

**Versão N-API: 3**

```C [C]
NAPI_EXTERN napi_status napi_remove_env_cleanup_hook(node_api_basic_env env,
                                                     void (*fun)(void* arg),
                                                     void* arg);
```
Cancela o registro de `fun` como uma função a ser executada com o parâmetro `arg` assim que o ambiente Node.js atual for encerrado. Tanto o argumento quanto o valor da função precisam ser correspondências exatas.

A função deve ter sido originalmente registrada com `napi_add_env_cleanup_hook`, caso contrário, o processo será abortado.

#### `napi_add_async_cleanup_hook` {#napi_add_async_cleanup_hook}


::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v14.10.0, v12.19.0 | Assinatura alterada do callback `hook`. |
| v14.8.0, v12.19.0 | Adicionado em: v14.8.0, v12.19.0 |
:::

**Versão N-API: 8**

```C [C]
NAPI_EXTERN napi_status napi_add_async_cleanup_hook(
    node_api_basic_env env,
    napi_async_cleanup_hook hook,
    void* arg,
    napi_async_cleanup_hook_handle* remove_handle);
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] hook`: O ponteiro de função para chamar no encerramento do ambiente.
- `[in] arg`: O ponteiro para passar para `hook` quando for chamado.
- `[out] remove_handle`: Manipulador opcional que se refere ao hook de limpeza assíncrono.

Registra `hook`, que é uma função do tipo [`napi_async_cleanup_hook`](/pt/nodejs/api/n-api#napi_async_cleanup_hook), como uma função a ser executada com os parâmetros `remove_handle` e `arg` assim que o ambiente Node.js atual for encerrado.

Ao contrário de [`napi_add_env_cleanup_hook`](/pt/nodejs/api/n-api#napi_add_env_cleanup_hook), o hook pode ser assíncrono.

Caso contrário, o comportamento geralmente corresponde ao de [`napi_add_env_cleanup_hook`](/pt/nodejs/api/n-api#napi_add_env_cleanup_hook).

Se `remove_handle` não for `NULL`, um valor opaco será armazenado nele, que deve ser posteriormente passado para [`napi_remove_async_cleanup_hook`](/pt/nodejs/api/n-api#napi_remove_async_cleanup_hook), independentemente de o hook já ter sido invocado ou não. Normalmente, isso acontece quando o recurso para o qual este hook foi adicionado está sendo destruído de qualquer maneira.


#### `napi_remove_async_cleanup_hook` {#napi_remove_async_cleanup_hook}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v14.10.0, v12.19.0 | Removido o parâmetro `env`. |
| v14.8.0, v12.19.0 | Adicionado em: v14.8.0, v12.19.0 |
:::

```C [C]
NAPI_EXTERN napi_status napi_remove_async_cleanup_hook(
    napi_async_cleanup_hook_handle remove_handle);
```
- `[in] remove_handle`: O manipulador para um hook de limpeza assíncrono que foi criado com [`napi_add_async_cleanup_hook`](/pt/nodejs/api/n-api#napi_add_async_cleanup_hook).

Cancela o registro do hook de limpeza correspondente a `remove_handle`. Isso impedirá que o hook seja executado, a menos que já tenha começado a ser executado. Isso deve ser chamado em qualquer valor `napi_async_cleanup_hook_handle` obtido de [`napi_add_async_cleanup_hook`](/pt/nodejs/api/n-api#napi_add_async_cleanup_hook).

### Finalização na saída do ambiente Node.js {#finalization-on-the-exit-of-the-nodejs-environment}

O ambiente Node.js pode ser desmontado em um momento arbitrário o mais rápido possível com a execução do JavaScript proibida, como a pedido de [`worker.terminate()`](/pt/nodejs/api/worker_threads#workerterminate). Quando o ambiente está sendo desmontado, os callbacks `napi_finalize` registrados de objetos JavaScript, funções thread-safe e dados de instância de ambiente são invocados imediatamente e independentemente.

A invocação de callbacks `napi_finalize` é agendada após os hooks de limpeza registrados manualmente. Para garantir uma ordem adequada de finalização do addon durante o desligamento do ambiente para evitar uso após liberação no callback `napi_finalize`, os addons devem registrar um hook de limpeza com `napi_add_env_cleanup_hook` e `napi_add_async_cleanup_hook` para liberar manualmente o recurso alocado em uma ordem adequada.

## Registro de Módulo {#module-registration}

Os módulos Node-API são registrados de maneira semelhante a outros módulos, exceto que, em vez de usar a macro `NODE_MODULE`, o seguinte é usado:

```C [C]
NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)
```
A próxima diferença é a assinatura para o método `Init`. Para um módulo Node-API, é o seguinte:

```C [C]
napi_value Init(napi_env env, napi_value exports);
```
O valor de retorno de `Init` é tratado como o objeto `exports` para o módulo. O método `Init` recebe um objeto vazio através do parâmetro `exports` como uma conveniência. Se `Init` retornar `NULL`, o parâmetro passado como `exports` é exportado pelo módulo. Os módulos Node-API não podem modificar o objeto `module`, mas podem especificar qualquer coisa como a propriedade `exports` do módulo.

Para adicionar o método `hello` como uma função para que ele possa ser chamado como um método fornecido pelo addon:

```C [C]
napi_value Init(napi_env env, napi_value exports) {
  napi_status status;
  napi_property_descriptor desc = {
    "hello",
    NULL,
    Method,
    NULL,
    NULL,
    NULL,
    napi_writable | napi_enumerable | napi_configurable,
    NULL
  };
  status = napi_define_properties(env, exports, 1, &desc);
  if (status != napi_ok) return NULL;
  return exports;
}
```
Para definir uma função a ser retornada pelo `require()` para o addon:

```C [C]
napi_value Init(napi_env env, napi_value exports) {
  napi_value method;
  napi_status status;
  status = napi_create_function(env, "exports", NAPI_AUTO_LENGTH, Method, NULL, &method);
  if (status != napi_ok) return NULL;
  return method;
}
```
Para definir uma classe para que novas instâncias possam ser criadas (geralmente usadas com [Object wrap](/pt/nodejs/api/n-api#object-wrap)):

```C [C]
// NOTE: exemplo parcial, nem todo o código referenciado está incluído
napi_value Init(napi_env env, napi_value exports) {
  napi_status status;
  napi_property_descriptor properties[] = {
    { "value", NULL, NULL, GetValue, SetValue, NULL, napi_writable | napi_configurable, NULL },
    DECLARE_NAPI_METHOD("plusOne", PlusOne),
    DECLARE_NAPI_METHOD("multiply", Multiply),
  };

  napi_value cons;
  status =
      napi_define_class(env, "MyObject", New, NULL, 3, properties, &cons);
  if (status != napi_ok) return NULL;

  status = napi_create_reference(env, cons, 1, &constructor);
  if (status != napi_ok) return NULL;

  status = napi_set_named_property(env, exports, "MyObject", cons);
  if (status != napi_ok) return NULL;

  return exports;
}
```
Você também pode usar a macro `NAPI_MODULE_INIT`, que atua como um atalho para `NAPI_MODULE` e define uma função `Init`:

```C [C]
NAPI_MODULE_INIT(/* napi_env env, napi_value exports */) {
  napi_value answer;
  napi_status result;

  status = napi_create_int64(env, 42, &answer);
  if (status != napi_ok) return NULL;

  status = napi_set_named_property(env, exports, "answer", answer);
  if (status != napi_ok) return NULL;

  return exports;
}
```
Os parâmetros `env` e `exports` são fornecidos ao corpo da macro `NAPI_MODULE_INIT`.

Todos os addons Node-API são context-aware, o que significa que eles podem ser carregados várias vezes. Existem algumas considerações de design ao declarar tal módulo. A documentação sobre [addons context-aware](/pt/nodejs/api/addons#context-aware-addons) fornece mais detalhes.

As variáveis `env` e `exports` estarão disponíveis dentro do corpo da função após a invocação da macro.

Para mais detalhes sobre como definir propriedades em objetos, consulte a seção sobre [Trabalhando com propriedades JavaScript](/pt/nodejs/api/n-api#working-with-javascript-properties).

Para mais detalhes sobre como construir módulos addon em geral, consulte a API existente.


## Trabalhando com valores JavaScript {#working-with-javascript-values}

A Node-API expõe um conjunto de APIs para criar todos os tipos de valores JavaScript. Alguns destes tipos estão documentados na [Seção 6](https://tc39.github.io/ecma262/#sec-ecmascript-data-types-and-values) da [Especificação da Linguagem ECMAScript](https://tc39.github.io/ecma262/).

Fundamentalmente, estas APIs são usadas para fazer uma das seguintes ações:

Os valores da Node-API são representados pelo tipo `napi_value`. Qualquer chamada da Node-API que requer um valor JavaScript recebe um `napi_value`. Em alguns casos, a API verifica o tipo do `napi_value` antecipadamente. No entanto, para melhor desempenho, é melhor para o chamador garantir que o `napi_value` em questão seja do tipo JavaScript esperado pela API.

### Tipos Enum {#enum-types}

#### `napi_key_collection_mode` {#napi_key_collection_mode}

**Adicionado em: v13.7.0, v12.17.0, v10.20.0**

**Versão N-API: 6**

```C [C]
typedef enum {
  napi_key_include_prototypes,
  napi_key_own_only
} napi_key_collection_mode;
```
Descreve os enums de filtro de `Keys/Properties` (Chaves/Propriedades):

`napi_key_collection_mode` limita o alcance das propriedades coletadas.

`napi_key_own_only` limita as propriedades coletadas apenas ao objeto fornecido. `napi_key_include_prototypes` incluirá todas as chaves da cadeia de protótipos do objeto também.

#### `napi_key_filter` {#napi_key_filter}

**Adicionado em: v13.7.0, v12.17.0, v10.20.0**

**Versão N-API: 6**

```C [C]
typedef enum {
  napi_key_all_properties = 0,
  napi_key_writable = 1,
  napi_key_enumerable = 1 << 1,
  napi_key_configurable = 1 << 2,
  napi_key_skip_strings = 1 << 3,
  napi_key_skip_symbols = 1 << 4
} napi_key_filter;
```
Bits de filtro de propriedade. Eles podem ser combinados com OR para construir um filtro composto.

#### `napi_key_conversion` {#napi_key_conversion}

**Adicionado em: v13.7.0, v12.17.0, v10.20.0**

**Versão N-API: 6**

```C [C]
typedef enum {
  napi_key_keep_numbers,
  napi_key_numbers_to_strings
} napi_key_conversion;
```
`napi_key_numbers_to_strings` irá converter índices inteiros em strings. `napi_key_keep_numbers` retornará números para índices inteiros.

#### `napi_valuetype` {#napi_valuetype}

```C [C]
typedef enum {
  // ES6 types (corresponds to typeof)
  napi_undefined,
  napi_null,
  napi_boolean,
  napi_number,
  napi_string,
  napi_symbol,
  napi_object,
  napi_function,
  napi_external,
  napi_bigint,
} napi_valuetype;
```
Descreve o tipo de um `napi_value`. Isso geralmente corresponde aos tipos descritos na [Seção 6.1](https://tc39.github.io/ecma262/#sec-ecmascript-language-types) da Especificação da Linguagem ECMAScript. Além dos tipos nessa seção, `napi_valuetype` também pode representar `Function`s e `Object`s com dados externos.

Um valor JavaScript do tipo `napi_external` aparece em JavaScript como um objeto simples, de forma que nenhuma propriedade pode ser definida nele, e nenhum protótipo.


#### `napi_typedarray_type` {#napi_typedarray_type}

```C [C]
typedef enum {
  napi_int8_array,
  napi_uint8_array,
  napi_uint8_clamped_array,
  napi_int16_array,
  napi_uint16_array,
  napi_int32_array,
  napi_uint32_array,
  napi_float32_array,
  napi_float64_array,
  napi_bigint64_array,
  napi_biguint64_array,
} napi_typedarray_type;
```
Isto representa o tipo de dado escalar binário subjacente do `TypedArray`. Os elementos desta enumeração correspondem à [Seção 22.2](https://tc39.github.io/ecma262/#sec-typedarray-objects) da [Especificação da Linguagem ECMAScript](https://tc39.github.io/ecma262/).

### Funções de criação de objeto {#object-creation-functions}

#### `napi_create_array` {#napi_create_array}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

```C [C]
napi_status napi_create_array(napi_env env, napi_value* result)
```
- `[in] env`: O ambiente sob o qual a chamada Node-API é invocada.
- `[out] result`: Um `napi_value` representando um `Array` JavaScript.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API retorna um valor Node-API correspondente a um tipo `Array` JavaScript. Arrays JavaScript são descritos na [Seção 22.1](https://tc39.github.io/ecma262/#sec-array-objects) da Especificação da Linguagem ECMAScript.

#### `napi_create_array_with_length` {#napi_create_array_with_length}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

```C [C]
napi_status napi_create_array_with_length(napi_env env,
                                          size_t length,
                                          napi_value* result)
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] length`: O comprimento inicial do `Array`.
- `[out] result`: Um `napi_value` representando um `Array` JavaScript.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API retorna um valor Node-API correspondente a um tipo `Array` JavaScript. A propriedade length do `Array` é definida para o parâmetro length passado. No entanto, não é garantido que o buffer subjacente seja pré-alocado pela VM quando o array é criado. Esse comportamento é deixado para a implementação da VM subjacente. Se o buffer precisar ser um bloco de memória contíguo que pode ser lido e/ou gravado diretamente via C, considere usar [`napi_create_external_arraybuffer`](/pt/nodejs/api/n-api#napi_create_external_arraybuffer).

Arrays JavaScript são descritos na [Seção 22.1](https://tc39.github.io/ecma262/#sec-array-objects) da Especificação da Linguagem ECMAScript.


#### `napi_create_arraybuffer` {#napi_create_arraybuffer}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

```C [C]
napi_status napi_create_arraybuffer(napi_env env,
                                    size_t byte_length,
                                    void** data,
                                    napi_value* result)
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] length`: O comprimento em bytes do buffer de array a ser criado.
- `[out] data`: Ponteiro para o buffer de byte subjacente do `ArrayBuffer`. `data` pode opcionalmente ser ignorado passando `NULL`.
- `[out] result`: Um `napi_value` representando um `ArrayBuffer` JavaScript.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API retorna um valor Node-API correspondente a um `ArrayBuffer` JavaScript. `ArrayBuffer`s são usados para representar buffers de dados binários de comprimento fixo. Eles são normalmente usados como um buffer de suporte para objetos `TypedArray`. O `ArrayBuffer` alocado terá um buffer de byte subjacente cujo tamanho é determinado pelo parâmetro `length` que é passado. O buffer subjacente é opcionalmente retornado ao chamador caso o chamador queira manipular o buffer diretamente. Este buffer só pode ser gravado diretamente do código nativo. Para gravar neste buffer do JavaScript, um array tipado ou objeto `DataView` precisaria ser criado.

Os objetos JavaScript `ArrayBuffer` são descritos na [Seção 24.1](https://tc39.github.io/ecma262/#sec-arraybuffer-objects) da Especificação da Linguagem ECMAScript.

#### `napi_create_buffer` {#napi_create_buffer}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

```C [C]
napi_status napi_create_buffer(napi_env env,
                               size_t size,
                               void** data,
                               napi_value* result)
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] size`: Tamanho em bytes do buffer subjacente.
- `[out] data`: Ponteiro bruto para o buffer subjacente. `data` pode opcionalmente ser ignorado passando `NULL`.
- `[out] result`: Um `napi_value` representando um `node::Buffer`.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API aloca um objeto `node::Buffer`. Embora esta ainda seja uma estrutura de dados totalmente suportada, na maioria dos casos, usar um `TypedArray` será suficiente.


#### `napi_create_buffer_copy` {#napi_create_buffer_copy}

**Adicionado em: v8.0.0**

**Versão da N-API: 1**

```C [C]
napi_status napi_create_buffer_copy(napi_env env,
                                    size_t length,
                                    const void* data,
                                    void** result_data,
                                    napi_value* result)
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] size`: Tamanho em bytes do buffer de entrada (deve ser o mesmo tamanho do novo buffer).
- `[in] data`: Ponteiro bruto para o buffer subjacente do qual copiar.
- `[out] result_data`: Ponteiro para o buffer de dados subjacente do novo `Buffer`. `result_data` pode opcionalmente ser ignorado passando `NULL`.
- `[out] result`: Um `napi_value` representando um `node::Buffer`.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API aloca um objeto `node::Buffer` e o inicializa com dados copiados do buffer transmitido. Embora esta ainda seja uma estrutura de dados totalmente suportada, na maioria dos casos, o uso de um `TypedArray` será suficiente.

#### `napi_create_date` {#napi_create_date}

**Adicionado em: v11.11.0, v10.17.0**

**Versão da N-API: 5**

```C [C]
napi_status napi_create_date(napi_env env,
                             double time,
                             napi_value* result);
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] time`: Valor de tempo ECMAScript em milissegundos desde 01 de janeiro de 1970 UTC.
- `[out] result`: Um `napi_value` representando um `Date` JavaScript.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API não observa segundos bissextos; eles são ignorados, pois o ECMAScript se alinha com a especificação de tempo POSIX.

Esta API aloca um objeto JavaScript `Date`.

Os objetos JavaScript `Date` são descritos na [Seção 20.3](https://tc39.github.io/ecma262/#sec-date-objects) da Especificação da Linguagem ECMAScript.

#### `napi_create_external` {#napi_create_external}

**Adicionado em: v8.0.0**

**Versão da N-API: 1**

```C [C]
napi_status napi_create_external(napi_env env,
                                 void* data,
                                 napi_finalize finalize_cb,
                                 void* finalize_hint,
                                 napi_value* result)
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] data`: Ponteiro bruto para os dados externos.
- `[in] finalize_cb`: Callback opcional a ser chamado quando o valor externo está sendo coletado. [`napi_finalize`](/pt/nodejs/api/n-api#napi_finalize) fornece mais detalhes.
- `[in] finalize_hint`: Dica opcional para passar para o callback de finalização durante a coleta.
- `[out] result`: Um `napi_value` representando um valor externo.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API aloca um valor JavaScript com dados externos anexados a ele. Isso é usado para passar dados externos através do código JavaScript, para que ele possa ser recuperado posteriormente pelo código nativo usando [`napi_get_value_external`](/pt/nodejs/api/n-api#napi_get_value_external).

A API adiciona um callback `napi_finalize` que será chamado quando o objeto JavaScript recém-criado tiver sido coletado como lixo.

O valor criado não é um objeto e, portanto, não suporta propriedades adicionais. É considerado um tipo de valor distinto: chamar `napi_typeof()` com um valor externo produz `napi_external`.


#### `napi_create_external_arraybuffer` {#napi_create_external_arraybuffer}

**Adicionado em: v8.0.0**

**Versão da N-API: 1**

```C [C]
napi_status
napi_create_external_arraybuffer(napi_env env,
                                 void* external_data,
                                 size_t byte_length,
                                 napi_finalize finalize_cb,
                                 void* finalize_hint,
                                 napi_value* result)
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] external_data`: Ponteiro para o buffer de bytes subjacente do `ArrayBuffer`.
- `[in] byte_length`: O comprimento em bytes do buffer subjacente.
- `[in] finalize_cb`: Callback opcional a ser chamado quando o `ArrayBuffer` estiver sendo coletado. [`napi_finalize`](/pt/nodejs/api/n-api#napi_finalize) fornece mais detalhes.
- `[in] finalize_hint`: Dica opcional para passar para o callback de finalização durante a coleta.
- `[out] result`: Um `napi_value` representando um `ArrayBuffer` JavaScript.

Retorna `napi_ok` se a API for bem-sucedida.

**Alguns tempos de execução diferentes do Node.js removeram o suporte para buffers externos**. Em tempos de execução diferentes do Node.js, este método pode retornar `napi_no_external_buffers_allowed` para indicar que buffers externos não são suportados. Um desses tempos de execução é o Electron, conforme descrito nesta issue [electron/issues/35801](https://github.com/electron/electron/issues/35801).

Para manter a mais ampla compatibilidade com todos os tempos de execução, você pode definir `NODE_API_NO_EXTERNAL_BUFFERS_ALLOWED` em seu addon antes dos includes para os cabeçalhos da node-api. Fazer isso ocultará as 2 funções que criam buffers externos. Isso garantirá que ocorra um erro de compilação se você usar acidentalmente um desses métodos.

Esta API retorna um valor Node-API correspondente a um `ArrayBuffer` JavaScript. O buffer de bytes subjacente do `ArrayBuffer` é alocado e gerenciado externamente. O chamador deve garantir que o buffer de bytes permaneça válido até que o callback de finalização seja chamado.

A API adiciona um callback `napi_finalize` que será chamado quando o objeto JavaScript recém-criado for coletado pelo coletor de lixo.

`ArrayBuffer`s JavaScript são descritos na [Seção 24.1](https://tc39.github.io/ecma262/#sec-arraybuffer-objects) da Especificação da Linguagem ECMAScript.


#### `napi_create_external_buffer` {#napi_create_external_buffer}

**Adicionado em: v8.0.0**

**Versão da N-API: 1**

```C [C]
napi_status napi_create_external_buffer(napi_env env,
                                        size_t length,
                                        void* data,
                                        napi_finalize finalize_cb,
                                        void* finalize_hint,
                                        napi_value* result)
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] length`: Tamanho em bytes do buffer de entrada (deve ser o mesmo tamanho do novo buffer).
- `[in] data`: Ponteiro bruto para o buffer subjacente a ser exposto ao JavaScript.
- `[in] finalize_cb`: Callback opcional a ser chamado quando o `ArrayBuffer` está sendo coletado. [`napi_finalize`](/pt/nodejs/api/n-api#napi_finalize) fornece mais detalhes.
- `[in] finalize_hint`: Dica opcional para passar para o callback de finalização durante a coleta.
- `[out] result`: Um `napi_value` representando um `node::Buffer`.

Retorna `napi_ok` se a API for bem-sucedida.

**Alguns runtimes além do Node.js abandonaram o suporte para buffers externos**. Em runtimes diferentes do Node.js, este método pode retornar `napi_no_external_buffers_allowed` para indicar que buffers externos não são suportados. Um desses runtimes é o Electron, conforme descrito nesta issue [electron/issues/35801](https://github.com/electron/electron/issues/35801).

Para manter a compatibilidade mais ampla com todos os runtimes, você pode definir `NODE_API_NO_EXTERNAL_BUFFERS_ALLOWED` em seu addon antes das inclusões para os cabeçalhos da node-api. Fazer isso ocultará as 2 funções que criam buffers externos. Isso garantirá que ocorra um erro de compilação se você usar acidentalmente um desses métodos.

Esta API aloca um objeto `node::Buffer` e o inicializa com dados apoiados pelo buffer passado. Embora esta ainda seja uma estrutura de dados totalmente suportada, na maioria dos casos, o uso de um `TypedArray` será suficiente.

A API adiciona um callback `napi_finalize` que será chamado quando o objeto JavaScript recém-criado for coletado como lixo.

Para Node.js \>=4, `Buffers` são `Uint8Array`s.


#### `napi_create_object` {#napi_create_object}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

```C [C]
napi_status napi_create_object(napi_env env, napi_value* result)
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[out] result`: Um `napi_value` representando um `Object` JavaScript.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API aloca um `Object` JavaScript padrão. É o equivalente a fazer `new Object()` em JavaScript.

O tipo `Object` do JavaScript é descrito na [Seção 6.1.7](https://tc39.github.io/ecma262/#sec-object-type) da Especificação da Linguagem ECMAScript.

#### `napi_create_symbol` {#napi_create_symbol}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

```C [C]
napi_status napi_create_symbol(napi_env env,
                               napi_value description,
                               napi_value* result)
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] description`: `napi_value` opcional que se refere a uma `string` JavaScript a ser definida como a descrição do símbolo.
- `[out] result`: Um `napi_value` representando um `symbol` JavaScript.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API cria um valor `symbol` JavaScript a partir de uma string C codificada em UTF8.

O tipo `symbol` do JavaScript é descrito na [Seção 19.4](https://tc39.github.io/ecma262/#sec-symbol-objects) da Especificação da Linguagem ECMAScript.

#### `node_api_symbol_for` {#node_api_symbol_for}

**Adicionado em: v17.5.0, v16.15.0**

**Versão N-API: 9**

```C [C]
napi_status node_api_symbol_for(napi_env env,
                                const char* utf8description,
                                size_t length,
                                napi_value* result)
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] utf8description`: String C UTF-8 representando o texto a ser usado como a descrição para o símbolo.
- `[in] length`: O comprimento da string de descrição em bytes, ou `NAPI_AUTO_LENGTH` se for terminada em nulo.
- `[out] result`: Um `napi_value` representando um `symbol` JavaScript.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API pesquisa no registro global por um símbolo existente com a descrição fornecida. Se o símbolo já existir, ele será retornado, caso contrário, um novo símbolo será criado no registro.

O tipo `symbol` do JavaScript é descrito na [Seção 19.4](https://tc39.github.io/ecma262/#sec-symbol-objects) da Especificação da Linguagem ECMAScript.


#### `napi_create_typedarray` {#napi_create_typedarray}

**Adicionado em: v8.0.0**

**Versão da N-API: 1**

```C [C]
napi_status napi_create_typedarray(napi_env env,
                                   napi_typedarray_type type,
                                   size_t length,
                                   napi_value arraybuffer,
                                   size_t byte_offset,
                                   napi_value* result)
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] type`: Tipo de dados escalar dos elementos dentro do `TypedArray`.
- `[in] length`: Número de elementos no `TypedArray`.
- `[in] arraybuffer`: `ArrayBuffer` subjacente à matriz tipada.
- `[in] byte_offset`: O deslocamento de byte dentro do `ArrayBuffer` a partir do qual iniciar a projeção do `TypedArray`.
- `[out] result`: Um `napi_value` representando um `TypedArray` JavaScript.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API cria um objeto `TypedArray` JavaScript sobre um `ArrayBuffer` existente. Os objetos `TypedArray` fornecem uma visualização semelhante a uma matriz sobre um buffer de dados subjacente, onde cada elemento tem o mesmo tipo de dados escalar binário subjacente.

É necessário que `(length * size_of_element) + byte_offset` seja \<= o tamanho em bytes da matriz passada. Caso contrário, uma exceção `RangeError` é lançada.

Os objetos `TypedArray` JavaScript são descritos na [Seção 22.2](https://tc39.github.io/ecma262/#sec-typedarray-objects) da Especificação da Linguagem ECMAScript.

#### `node_api_create_buffer_from_arraybuffer` {#node_api_create_buffer_from_arraybuffer}

**Adicionado em: v23.0.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

```C [C]
napi_status NAPI_CDECL node_api_create_buffer_from_arraybuffer(napi_env env,
                                                              napi_value arraybuffer,
                                                              size_t byte_offset,
                                                              size_t byte_length,
                                                              napi_value* result)
```
- **<code>[in] env</code>**: O ambiente sob o qual a API é invocada.
- **<code>[in] arraybuffer</code>**: O `ArrayBuffer` a partir do qual o buffer será criado.
- **<code>[in] byte_offset</code>**: O deslocamento de byte dentro do `ArrayBuffer` a partir do qual iniciar a criação do buffer.
- **<code>[in] byte_length</code>**: O comprimento em bytes do buffer a ser criado a partir do `ArrayBuffer`.
- **<code>[out] result</code>**: Um `napi_value` representando o objeto `Buffer` JavaScript criado.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API cria um objeto `Buffer` JavaScript a partir de um `ArrayBuffer` existente. O objeto `Buffer` é uma classe específica do Node.js que fornece uma maneira de trabalhar com dados binários diretamente no JavaScript.

O intervalo de bytes `[byte_offset, byte_offset + byte_length)` deve estar dentro dos limites do `ArrayBuffer`. Se `byte_offset + byte_length` exceder o tamanho do `ArrayBuffer`, uma exceção `RangeError` é lançada.


#### `napi_create_dataview` {#napi_create_dataview}

**Adicionado em: v8.3.0**

**Versão N-API: 1**

```C [C]
napi_status napi_create_dataview(napi_env env,
                                 size_t byte_length,
                                 napi_value arraybuffer,
                                 size_t byte_offset,
                                 napi_value* result)
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] length`: Número de elementos no `DataView`.
- `[in] arraybuffer`: `ArrayBuffer` subjacente ao `DataView`.
- `[in] byte_offset`: O deslocamento de byte dentro do `ArrayBuffer` a partir do qual iniciar a projeção do `DataView`.
- `[out] result`: Um `napi_value` representando um `DataView` JavaScript.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API cria um objeto JavaScript `DataView` sobre um `ArrayBuffer` existente. Os objetos `DataView` fornecem uma visualização semelhante a um array sobre um buffer de dados subjacente, mas que permite itens de diferentes tamanhos e tipos no `ArrayBuffer`.

É necessário que `byte_length + byte_offset` seja menor ou igual ao tamanho em bytes do array passado. Caso contrário, uma exceção `RangeError` é lançada.

Os objetos JavaScript `DataView` são descritos na [Seção 24.3](https://tc39.github.io/ecma262/#sec-dataview-objects) da Especificação da Linguagem ECMAScript.

### Funções para converter de tipos C para Node-API {#functions-to-convert-from-c-types-to-node-api}

#### `napi_create_int32` {#napi_create_int32}

**Adicionado em: v8.4.0**

**Versão N-API: 1**

```C [C]
napi_status napi_create_int32(napi_env env, int32_t value, napi_value* result)
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] value`: Valor inteiro a ser representado em JavaScript.
- `[out] result`: Um `napi_value` representando um `number` JavaScript.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API é usada para converter do tipo C `int32_t` para o tipo JavaScript `number`.

O tipo JavaScript `number` é descrito na [Seção 6.1.6](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-number-type) da Especificação da Linguagem ECMAScript.


#### `napi_create_uint32` {#napi_create_uint32}

**Adicionado em: v8.4.0**

**Versão da N-API: 1**

```C [C]
napi_status napi_create_uint32(napi_env env, uint32_t value, napi_value* result)
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] value`: Valor inteiro não assinado a ser representado em JavaScript.
- `[out] result`: Um `napi_value` representando um `number` JavaScript.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API é usada para converter do tipo C `uint32_t` para o tipo `number` JavaScript.

O tipo `number` JavaScript é descrito na [Seção 6.1.6](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-number-type) da Especificação da Linguagem ECMAScript.

#### `napi_create_int64` {#napi_create_int64}

**Adicionado em: v8.4.0**

**Versão da N-API: 1**

```C [C]
napi_status napi_create_int64(napi_env env, int64_t value, napi_value* result)
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] value`: Valor inteiro a ser representado em JavaScript.
- `[out] result`: Um `napi_value` representando um `number` JavaScript.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API é usada para converter do tipo C `int64_t` para o tipo `number` JavaScript.

O tipo `number` JavaScript é descrito na [Seção 6.1.6](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-number-type) da Especificação da Linguagem ECMAScript. Observe que a faixa completa de `int64_t` não pode ser representada com precisão total em JavaScript. Valores inteiros fora do intervalo de [`Number.MIN_SAFE_INTEGER`](https://tc39.github.io/ecma262/#sec-number.min_safe_integer) `-(2**53 - 1)` - [`Number.MAX_SAFE_INTEGER`](https://tc39.github.io/ecma262/#sec-number.max_safe_integer) `(2**53 - 1)` perderão precisão.

#### `napi_create_double` {#napi_create_double}

**Adicionado em: v8.4.0**

**Versão da N-API: 1**

```C [C]
napi_status napi_create_double(napi_env env, double value, napi_value* result)
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] value`: Valor de precisão dupla a ser representado em JavaScript.
- `[out] result`: Um `napi_value` representando um `number` JavaScript.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API é usada para converter do tipo C `double` para o tipo `number` JavaScript.

O tipo `number` JavaScript é descrito na [Seção 6.1.6](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-number-type) da Especificação da Linguagem ECMAScript.


#### `napi_create_bigint_int64` {#napi_create_bigint_int64}

**Adicionado em: v10.7.0**

**Versão N-API: 6**

```C [C]
napi_status napi_create_bigint_int64(napi_env env,
                                     int64_t value,
                                     napi_value* result);
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] value`: Valor inteiro a ser representado em JavaScript.
- `[out] result`: Um `napi_value` representando um `BigInt` JavaScript.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API converte o tipo C `int64_t` para o tipo `BigInt` JavaScript.

#### `napi_create_bigint_uint64` {#napi_create_bigint_uint64}

**Adicionado em: v10.7.0**

**Versão N-API: 6**

```C [C]
napi_status napi_create_bigint_uint64(napi_env env,
                                      uint64_t value,
                                      napi_value* result);
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] value`: Valor inteiro não assinado a ser representado em JavaScript.
- `[out] result`: Um `napi_value` representando um `BigInt` JavaScript.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API converte o tipo C `uint64_t` para o tipo `BigInt` JavaScript.

#### `napi_create_bigint_words` {#napi_create_bigint_words}

**Adicionado em: v10.7.0**

**Versão N-API: 6**

```C [C]
napi_status napi_create_bigint_words(napi_env env,
                                     int sign_bit,
                                     size_t word_count,
                                     const uint64_t* words,
                                     napi_value* result);
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] sign_bit`: Determina se o `BigInt` resultante será positivo ou negativo.
- `[in] word_count`: O comprimento do array `words`.
- `[in] words`: Um array de palavras de 64 bits little-endian `uint64_t`.
- `[out] result`: Um `napi_value` representando um `BigInt` JavaScript.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API converte um array de palavras não assinadas de 64 bits em um único valor `BigInt`.

O `BigInt` resultante é calculado como: (–1) (`words[0]` × (2) + `words[1]` × (2) + …)


#### `napi_create_string_latin1` {#napi_create_string_latin1}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

```C [C]
napi_status napi_create_string_latin1(napi_env env,
                                      const char* str,
                                      size_t length,
                                      napi_value* result);
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] str`: Buffer de caracteres representando uma string codificada em ISO-8859-1.
- `[in] length`: O comprimento da string em bytes, ou `NAPI_AUTO_LENGTH` se for terminada em nulo.
- `[out] result`: Um `napi_value` representando uma `string` JavaScript.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API cria um valor de `string` JavaScript a partir de uma string C codificada em ISO-8859-1. A string nativa é copiada.

O tipo `string` JavaScript é descrito na [Seção 6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type) da Especificação da Linguagem ECMAScript.

#### `node_api_create_external_string_latin1` {#node_api_create_external_string_latin1}

**Adicionado em: v20.4.0, v18.18.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

```C [C]
napi_status
node_api_create_external_string_latin1(napi_env env,
                                       char* str,
                                       size_t length,
                                       napi_finalize finalize_callback,
                                       void* finalize_hint,
                                       napi_value* result,
                                       bool* copied);
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] str`: Buffer de caracteres representando uma string codificada em ISO-8859-1.
- `[in] length`: O comprimento da string em bytes, ou `NAPI_AUTO_LENGTH` se for terminada em nulo.
- `[in] finalize_callback`: A função a ser chamada quando a string está sendo coletada. A função será chamada com os seguintes parâmetros:
    - `[in] env`: O ambiente no qual o add-on está sendo executado. Este valor pode ser nulo se a string estiver sendo coletada como parte do término do worker ou da instância principal do Node.js.
    - `[in] data`: Este é o valor `str` como um ponteiro `void*`.
    - `[in] finalize_hint`: Este é o valor `finalize_hint` que foi fornecido à API. [`napi_finalize`](/pt/nodejs/api/n-api#napi_finalize) fornece mais detalhes. Este parâmetro é opcional. Passar um valor nulo significa que o add-on não precisa ser notificado quando a string JavaScript correspondente é coletada.


- `[in] finalize_hint`: Dica opcional para passar para o callback de finalização durante a coleta.
- `[out] result`: Um `napi_value` representando uma `string` JavaScript.
- `[out] copied`: Se a string foi copiada. Se foi, o finalizador já terá sido invocado para destruir `str`.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API cria um valor de `string` JavaScript a partir de uma string C codificada em ISO-8859-1. A string nativa pode não ser copiada e, portanto, deve existir durante todo o ciclo de vida do valor JavaScript.

O tipo `string` JavaScript é descrito na [Seção 6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type) da Especificação da Linguagem ECMAScript.


#### `napi_create_string_utf16` {#napi_create_string_utf16}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

```C [C]
napi_status napi_create_string_utf16(napi_env env,
                                     const char16_t* str,
                                     size_t length,
                                     napi_value* result)
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] str`: Buffer de caracteres representando uma string codificada em UTF16-LE.
- `[in] length`: O comprimento da string em unidades de código de dois bytes ou `NAPI_AUTO_LENGTH` se ela for terminada em nulo.
- `[out] result`: Um `napi_value` representando uma `string` JavaScript.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API cria um valor de `string` JavaScript a partir de uma string C codificada em UTF16-LE. A string nativa é copiada.

O tipo `string` JavaScript é descrito na [Seção 6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type) da Especificação da Linguagem ECMAScript.

#### `node_api_create_external_string_utf16` {#node_api_create_external_string_utf16}

**Adicionado em: v20.4.0, v18.18.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

```C [C]
napi_status
node_api_create_external_string_utf16(napi_env env,
                                      char16_t* str,
                                      size_t length,
                                      napi_finalize finalize_callback,
                                      void* finalize_hint,
                                      napi_value* result,
                                      bool* copied);
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] str`: Buffer de caracteres representando uma string codificada em UTF16-LE.
- `[in] length`: O comprimento da string em unidades de código de dois bytes ou `NAPI_AUTO_LENGTH` se ela for terminada em nulo.
- `[in] finalize_callback`: A função a ser chamada quando a string está sendo coletada. A função será chamada com os seguintes parâmetros:
    - `[in] env`: O ambiente no qual o add-on está sendo executado. Este valor pode ser nulo se a string estiver sendo coletada como parte do encerramento do trabalhador ou da instância principal do Node.js.
    - `[in] data`: Este é o valor `str` como um ponteiro `void*`.
    - `[in] finalize_hint`: Este é o valor `finalize_hint` que foi dado à API. [`napi_finalize`](/pt/nodejs/api/n-api#napi_finalize) fornece mais detalhes. Este parâmetro é opcional. Passar um valor nulo significa que o add-on não precisa ser notificado quando a string JavaScript correspondente for coletada.


- `[in] finalize_hint`: Dica opcional para passar para o callback de finalização durante a coleta.
- `[out] result`: Um `napi_value` representando uma `string` JavaScript.
- `[out] copied`: Indica se a string foi copiada. Se foi, o finalizador já terá sido invocado para destruir `str`.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API cria um valor de `string` JavaScript a partir de uma string C codificada em UTF16-LE. A string nativa pode não ser copiada e, portanto, deve existir durante todo o ciclo de vida do valor JavaScript.

O tipo `string` JavaScript é descrito na [Seção 6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type) da Especificação da Linguagem ECMAScript.


#### `napi_create_string_utf8` {#napi_create_string_utf8}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

```C [C]
napi_status napi_create_string_utf8(napi_env env,
                                    const char* str,
                                    size_t length,
                                    napi_value* result)
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] str`: Buffer de caracteres representando uma string codificada em UTF8.
- `[in] length`: O comprimento da string em bytes, ou `NAPI_AUTO_LENGTH` se for terminada em nulo.
- `[out] result`: Um `napi_value` representando uma `string` JavaScript.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API cria um valor `string` JavaScript a partir de uma string C codificada em UTF8. A string nativa é copiada.

O tipo `string` JavaScript é descrito na [Seção 6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type) da Especificação da Linguagem ECMAScript.

### Funções para criar chaves de propriedade otimizadas {#functions-to-create-optimized-property-keys}

Muitas engines JavaScript, incluindo V8, usam strings internalizadas como chaves para definir e obter valores de propriedade. Elas normalmente usam uma tabela hash para criar e procurar essas strings. Embora adicione algum custo por criação de chave, melhora o desempenho depois disso, permitindo a comparação de ponteiros de string em vez das strings inteiras.

Se uma nova string JavaScript pretende ser usada como uma chave de propriedade, então para algumas engines JavaScript será mais eficiente usar as funções nesta seção. Caso contrário, use as funções da série `napi_create_string_utf8` ou `node_api_create_external_string_utf8`, pois pode haver sobrecarga adicional na criação/armazenamento de strings com os métodos de criação de chave de propriedade.

#### `node_api_create_property_key_latin1` {#node_api_create_property_key_latin1}

**Adicionado em: v22.9.0, v20.18.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

```C [C]
napi_status NAPI_CDECL node_api_create_property_key_latin1(napi_env env,
                                                           const char* str,
                                                           size_t length,
                                                           napi_value* result);
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] str`: Buffer de caracteres representando uma string codificada em ISO-8859-1.
- `[in] length`: O comprimento da string em bytes, ou `NAPI_AUTO_LENGTH` se for terminada em nulo.
- `[out] result`: Um `napi_value` representando uma `string` JavaScript otimizada para ser usada como uma chave de propriedade para objetos.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API cria um valor `string` JavaScript otimizado a partir de uma string C codificada em ISO-8859-1 para ser usada como uma chave de propriedade para objetos. A string nativa é copiada. Em contraste com `napi_create_string_latin1`, chamadas subsequentes para esta função com o mesmo ponteiro `str` podem se beneficiar de um aumento de velocidade na criação do `napi_value` solicitado, dependendo da engine.

O tipo `string` JavaScript é descrito na [Seção 6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type) da Especificação da Linguagem ECMAScript.


#### `node_api_create_property_key_utf16` {#node_api_create_property_key_utf16}

**Adicionado em: v21.7.0, v20.12.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

```C [C]
napi_status NAPI_CDECL node_api_create_property_key_utf16(napi_env env,
                                                          const char16_t* str,
                                                          size_t length,
                                                          napi_value* result);
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] str`: Buffer de caracteres representando uma string codificada em UTF16-LE.
- `[in] length`: O comprimento da string em unidades de código de dois bytes, ou `NAPI_AUTO_LENGTH` se for terminada em nulo.
- `[out] result`: Um `napi_value` representando uma `string` JavaScript otimizada para ser usada como uma chave de propriedade para objetos.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API cria um valor `string` JavaScript otimizado a partir de uma string C codificada em UTF16-LE para ser usado como uma chave de propriedade para objetos. A string nativa é copiada.

O tipo `string` JavaScript é descrito na [Seção 6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type) da Especificação da Linguagem ECMAScript.

#### `node_api_create_property_key_utf8` {#node_api_create_property_key_utf8}

**Adicionado em: v22.9.0, v20.18.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

```C [C]
napi_status NAPI_CDECL node_api_create_property_key_utf8(napi_env env,
                                                         const char* str,
                                                         size_t length,
                                                         napi_value* result);
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] str`: Buffer de caracteres representando uma string codificada em UTF8.
- `[in] length`: O comprimento da string em unidades de código de dois bytes, ou `NAPI_AUTO_LENGTH` se for terminada em nulo.
- `[out] result`: Um `napi_value` representando uma `string` JavaScript otimizada para ser usada como uma chave de propriedade para objetos.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API cria um valor `string` JavaScript otimizado a partir de uma string C codificada em UTF8 para ser usado como uma chave de propriedade para objetos. A string nativa é copiada.

O tipo `string` JavaScript é descrito na [Seção 6.1.4](https://tc39.github.io/ecma262/#sec-ecmascript-language-types-string-type) da Especificação da Linguagem ECMAScript.


### Funções para converter de Node-API para tipos C {#functions-to-convert-from-node-api-to-c-types}

#### `napi_get_array_length` {#napi_get_array_length}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

```C [C]
napi_status napi_get_array_length(napi_env env,
                                  napi_value value,
                                  uint32_t* result)
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] value`: `napi_value` representando o `Array` JavaScript cujo tamanho está sendo consultado.
- `[out] result`: `uint32` representando o tamanho do array.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API retorna o tamanho de um array.

O tamanho do `Array` é descrito na [Seção 22.1.4.1](https://tc39.github.io/ecma262/#sec-properties-of-array-instances-length) da Especificação da Linguagem ECMAScript.

#### `napi_get_arraybuffer_info` {#napi_get_arraybuffer_info}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

```C [C]
napi_status napi_get_arraybuffer_info(napi_env env,
                                      napi_value arraybuffer,
                                      void** data,
                                      size_t* byte_length)
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] arraybuffer`: `napi_value` representando o `ArrayBuffer` que está sendo consultado.
- `[out] data`: O buffer de dados subjacente do `ArrayBuffer`. Se byte_length for `0`, isso pode ser `NULL` ou qualquer outro valor de ponteiro.
- `[out] byte_length`: Comprimento em bytes do buffer de dados subjacente.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API é usada para recuperar o buffer de dados subjacente de um `ArrayBuffer` e seu tamanho.

*AVISO*: Tenha cuidado ao usar esta API. O tempo de vida do buffer de dados subjacente é gerenciado pelo `ArrayBuffer` mesmo depois de retornado. Uma maneira segura possível de usar esta API é em conjunto com [`napi_create_reference`](/pt/nodejs/api/n-api#napi_create_reference), que pode ser usada para garantir o controle sobre o tempo de vida do `ArrayBuffer`. Também é seguro usar o buffer de dados retornado no mesmo retorno de chamada, desde que não haja chamadas para outras APIs que possam acionar um GC.


#### `napi_get_buffer_info` {#napi_get_buffer_info}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

```C [C]
napi_status napi_get_buffer_info(napi_env env,
                                 napi_value value,
                                 void** data,
                                 size_t* length)
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] value`: `napi_value` representando o `node::Buffer` ou `Uint8Array` que está sendo consultado.
- `[out] data`: O buffer de dados subjacente do `node::Buffer` ou `Uint8Array`. Se o comprimento for `0`, isso pode ser `NULL` ou qualquer outro valor de ponteiro.
- `[out] length`: Comprimento em bytes do buffer de dados subjacente.

Retorna `napi_ok` se a API for bem-sucedida.

Este método retorna os mesmos `data` e `byte_length` que [`napi_get_typedarray_info`](/pt/nodejs/api/n-api#napi_get_typedarray_info). E `napi_get_typedarray_info` também aceita um `node::Buffer` (um Uint8Array) como o valor.

Esta API é usada para recuperar o buffer de dados subjacente de um `node::Buffer` e seu comprimento.

*Aviso*: Tenha cuidado ao usar esta API, pois o tempo de vida útil do buffer de dados subjacente não é garantido se for gerenciado pela VM.

#### `napi_get_prototype` {#napi_get_prototype}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

```C [C]
napi_status napi_get_prototype(napi_env env,
                               napi_value object,
                               napi_value* result)
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] object`: `napi_value` representando o `Object` JavaScript cujo protótipo deve ser retornado. Isso retorna o equivalente a `Object.getPrototypeOf` (que não é o mesmo que a propriedade `prototype` da função).
- `[out] result`: `napi_value` representando o protótipo do objeto fornecido.

Retorna `napi_ok` se a API for bem-sucedida.

#### `napi_get_typedarray_info` {#napi_get_typedarray_info}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

```C [C]
napi_status napi_get_typedarray_info(napi_env env,
                                     napi_value typedarray,
                                     napi_typedarray_type* type,
                                     size_t* length,
                                     void** data,
                                     napi_value* arraybuffer,
                                     size_t* byte_offset)
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] typedarray`: `napi_value` representando o `TypedArray` cujas propriedades devem ser consultadas.
- `[out] type`: Tipo de dados escalar dos elementos dentro do `TypedArray`.
- `[out] length`: O número de elementos no `TypedArray`.
- `[out] data`: O buffer de dados subjacente ao `TypedArray` ajustado pelo valor `byte_offset` para que aponte para o primeiro elemento no `TypedArray`. Se o comprimento da matriz for `0`, isso pode ser `NULL` ou qualquer outro valor de ponteiro.
- `[out] arraybuffer`: O `ArrayBuffer` subjacente ao `TypedArray`.
- `[out] byte_offset`: O deslocamento de byte dentro da matriz nativa subjacente na qual o primeiro elemento das matrizes está localizado. O valor para o parâmetro data já foi ajustado para que os dados apontem para o primeiro elemento da matriz. Portanto, o primeiro byte da matriz nativa estaria em `data - byte_offset`.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API retorna várias propriedades de uma matriz tipada.

Qualquer um dos parâmetros de saída pode ser `NULL` se essa propriedade for desnecessária.

*Aviso*: Tenha cuidado ao usar esta API, pois o buffer de dados subjacente é gerenciado pela VM.


#### `napi_get_dataview_info` {#napi_get_dataview_info}

**Adicionado em: v8.3.0**

**Versão N-API: 1**

```C [C]
napi_status napi_get_dataview_info(napi_env env,
                                   napi_value dataview,
                                   size_t* byte_length,
                                   void** data,
                                   napi_value* arraybuffer,
                                   size_t* byte_offset)
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] dataview`: `napi_value` representando o `DataView` cujas propriedades devem ser consultadas.
- `[out] byte_length`: Número de bytes no `DataView`.
- `[out] data`: O buffer de dados subjacente ao `DataView`. Se byte_length for `0`, isso pode ser `NULL` ou qualquer outro valor de ponteiro.
- `[out] arraybuffer`: `ArrayBuffer` subjacente ao `DataView`.
- `[out] byte_offset`: O deslocamento de byte dentro do buffer de dados a partir do qual iniciar a projeção do `DataView`.

Retorna `napi_ok` se a API for bem-sucedida.

Qualquer um dos parâmetros de saída pode ser `NULL` se essa propriedade não for necessária.

Esta API retorna várias propriedades de um `DataView`.

#### `napi_get_date_value` {#napi_get_date_value}

**Adicionado em: v11.11.0, v10.17.0**

**Versão N-API: 5**

```C [C]
napi_status napi_get_date_value(napi_env env,
                                napi_value value,
                                double* result)
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] value`: `napi_value` representando um `Date` JavaScript.
- `[out] result`: Valor de tempo como um `double` representado como milissegundos desde a meia-noite no início de 01 de janeiro de 1970 UTC.

Esta API não observa segundos bissextos; eles são ignorados, pois o ECMAScript se alinha à especificação de tempo POSIX.

Retorna `napi_ok` se a API for bem-sucedida. Se um `napi_value` que não seja uma data for passado, ele retorna `napi_date_expected`.

Esta API retorna o primitivo C double do valor de tempo para o `Date` JavaScript fornecido.

#### `napi_get_value_bool` {#napi_get_value_bool}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

```C [C]
napi_status napi_get_value_bool(napi_env env, napi_value value, bool* result)
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] value`: `napi_value` representando o `Boolean` JavaScript.
- `[out] result`: Primitivo booleano C equivalente ao `Boolean` JavaScript fornecido.

Retorna `napi_ok` se a API for bem-sucedida. Se um `napi_value` não booleano for passado, ele retorna `napi_boolean_expected`.

Esta API retorna o primitivo booleano C equivalente ao `Boolean` JavaScript fornecido.


#### `napi_get_value_double` {#napi_get_value_double}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

```C [C]
napi_status napi_get_value_double(napi_env env,
                                  napi_value value,
                                  double* result)
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] value`: `napi_value` representando um `number` JavaScript.
- `[out] result`: Primitivo C double equivalente ao `number` JavaScript fornecido.

Retorna `napi_ok` se a API for bem-sucedida. Se um `napi_value` que não seja um número for passado, ele retorna `napi_number_expected`.

Esta API retorna o primitivo C double equivalente ao `number` JavaScript fornecido.

#### `napi_get_value_bigint_int64` {#napi_get_value_bigint_int64}

**Adicionado em: v10.7.0**

**Versão N-API: 6**

```C [C]
napi_status napi_get_value_bigint_int64(napi_env env,
                                        napi_value value,
                                        int64_t* result,
                                        bool* lossless);
```
- `[in] env`: O ambiente sob o qual a API é invocada
- `[in] value`: `napi_value` representando um `BigInt` JavaScript.
- `[out] result`: Primitivo C `int64_t` equivalente ao `BigInt` JavaScript fornecido.
- `[out] lossless`: Indica se o valor `BigInt` foi convertido sem perdas.

Retorna `napi_ok` se a API for bem-sucedida. Se um não-`BigInt` for passado, ele retorna `napi_bigint_expected`.

Esta API retorna o primitivo C `int64_t` equivalente ao `BigInt` JavaScript fornecido. Se necessário, ele truncará o valor, definindo `lossless` como `false`.

#### `napi_get_value_bigint_uint64` {#napi_get_value_bigint_uint64}

**Adicionado em: v10.7.0**

**Versão N-API: 6**

```C [C]
napi_status napi_get_value_bigint_uint64(napi_env env,
                                        napi_value value,
                                        uint64_t* result,
                                        bool* lossless);
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] value`: `napi_value` representando um `BigInt` JavaScript.
- `[out] result`: Primitivo C `uint64_t` equivalente ao `BigInt` JavaScript fornecido.
- `[out] lossless`: Indica se o valor `BigInt` foi convertido sem perdas.

Retorna `napi_ok` se a API for bem-sucedida. Se um não-`BigInt` for passado, ele retorna `napi_bigint_expected`.

Esta API retorna o primitivo C `uint64_t` equivalente ao `BigInt` JavaScript fornecido. Se necessário, ele truncará o valor, definindo `lossless` como `false`.


#### `napi_get_value_bigint_words` {#napi_get_value_bigint_words}

**Adicionado em: v10.7.0**

**Versão N-API: 6**

```C [C]
napi_status napi_get_value_bigint_words(napi_env env,
                                        napi_value value,
                                        int* sign_bit,
                                        size_t* word_count,
                                        uint64_t* words);
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] value`: `napi_value` representando JavaScript `BigInt`.
- `[out] sign_bit`: Inteiro representando se o JavaScript `BigInt` é positivo ou negativo.
- `[in/out] word_count`: Deve ser inicializado com o comprimento do array `words`. Ao retornar, ele será definido como o número real de palavras que seriam necessárias para armazenar este `BigInt`.
- `[out] words`: Ponteiro para um array de palavras de 64 bits pré-alocado.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API converte um único valor `BigInt` em um bit de sinal, um array little-endian de 64 bits e o número de elementos no array. `sign_bit` e `words` podem ser definidos como `NULL`, para obter apenas `word_count`.

#### `napi_get_value_external` {#napi_get_value_external}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

```C [C]
napi_status napi_get_value_external(napi_env env,
                                    napi_value value,
                                    void** result)
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] value`: `napi_value` representando valor externo JavaScript.
- `[out] result`: Ponteiro para os dados envolvidos pelo valor externo JavaScript.

Retorna `napi_ok` se a API for bem-sucedida. Se um `napi_value` não externo for passado, ele retorna `napi_invalid_arg`.

Esta API recupera o ponteiro de dados externos que foi passado anteriormente para `napi_create_external()`.

#### `napi_get_value_int32` {#napi_get_value_int32}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

```C [C]
napi_status napi_get_value_int32(napi_env env,
                                 napi_value value,
                                 int32_t* result)
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] value`: `napi_value` representando JavaScript `number`.
- `[out] result`: Primitivo C `int32` equivalente ao dado JavaScript `number`.

Retorna `napi_ok` se a API for bem-sucedida. Se um `napi_value` não numérico for passado, `napi_number_expected`.

Esta API retorna o primitivo C `int32` equivalente ao JavaScript `number` fornecido.

Se o número exceder o intervalo do inteiro de 32 bits, o resultado será truncado ao equivalente aos 32 bits inferiores. Isso pode resultar em um grande número positivo se tornando um número negativo se o valor for \> 2 - 1.

Valores numéricos não finitos (`NaN`, `+Infinity` ou `-Infinity`) definem o resultado como zero.


#### `napi_get_value_int64` {#napi_get_value_int64}

**Adicionado em: v8.0.0**

**Versão da N-API: 1**

```C [C]
napi_status napi_get_value_int64(napi_env env,
                                 napi_value value,
                                 int64_t* result)
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] value`: `napi_value` representando um `number` JavaScript.
- `[out] result`: Primitivo C `int64` equivalente ao `number` JavaScript fornecido.

Retorna `napi_ok` se a API for bem-sucedida. Se um `napi_value` que não é um número for passado, retorna `napi_number_expected`.

Esta API retorna o primitivo C `int64` equivalente ao `number` JavaScript fornecido.

Valores de `number` fora do intervalo de [`Number.MIN_SAFE_INTEGER`](https://tc39.github.io/ecma262/#sec-number.min_safe_integer) `-(2**53 - 1)` - [`Number.MAX_SAFE_INTEGER`](https://tc39.github.io/ecma262/#sec-number.max_safe_integer) `(2**53 - 1)` perderão precisão.

Valores numéricos não finitos (`NaN`, `+Infinity` ou `-Infinity`) definem o resultado como zero.

#### `napi_get_value_string_latin1` {#napi_get_value_string_latin1}

**Adicionado em: v8.0.0**

**Versão da N-API: 1**

```C [C]
napi_status napi_get_value_string_latin1(napi_env env,
                                         napi_value value,
                                         char* buf,
                                         size_t bufsize,
                                         size_t* result)
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] value`: `napi_value` representando uma string JavaScript.
- `[in] buf`: Buffer para gravar a string codificada em ISO-8859-1. Se `NULL` for passado, o tamanho da string em bytes, excluindo o terminador nulo, é retornado em `result`.
- `[in] bufsize`: Tamanho do buffer de destino. Quando este valor é insuficiente, a string retornada é truncada e terminada em nulo.
- `[out] result`: Número de bytes copiados para o buffer, excluindo o terminador nulo.

Retorna `napi_ok` se a API for bem-sucedida. Se um `napi_value` que não é uma `string` for passado, retorna `napi_string_expected`.

Esta API retorna a string codificada em ISO-8859-1 correspondente ao valor passado.


#### `napi_get_value_string_utf8` {#napi_get_value_string_utf8}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

```C [C]
napi_status napi_get_value_string_utf8(napi_env env,
                                       napi_value value,
                                       char* buf,
                                       size_t bufsize,
                                       size_t* result)
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] value`: `napi_value` representando a string JavaScript.
- `[in] buf`: Buffer para gravar a string codificada em UTF8. Se `NULL` for passado, o comprimento da string em bytes, excluindo o terminador nulo, é retornado em `result`.
- `[in] bufsize`: Tamanho do buffer de destino. Quando este valor é insuficiente, a string retornada é truncada e terminada em nulo.
- `[out] result`: Número de bytes copiados para o buffer, excluindo o terminador nulo.

Retorna `napi_ok` se a API for bem-sucedida. Se um `napi_value` não `string` for passado, ele retorna `napi_string_expected`.

Esta API retorna a string codificada em UTF8 correspondente ao valor passado.

#### `napi_get_value_string_utf16` {#napi_get_value_string_utf16}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

```C [C]
napi_status napi_get_value_string_utf16(napi_env env,
                                        napi_value value,
                                        char16_t* buf,
                                        size_t bufsize,
                                        size_t* result)
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] value`: `napi_value` representando a string JavaScript.
- `[in] buf`: Buffer para gravar a string codificada em UTF16-LE. Se `NULL` for passado, o comprimento da string em unidades de código de 2 bytes, excluindo o terminador nulo, é retornado.
- `[in] bufsize`: Tamanho do buffer de destino. Quando este valor é insuficiente, a string retornada é truncada e terminada em nulo.
- `[out] result`: Número de unidades de código de 2 bytes copiadas para o buffer, excluindo o terminador nulo.

Retorna `napi_ok` se a API for bem-sucedida. Se um `napi_value` não `string` for passado, ele retorna `napi_string_expected`.

Esta API retorna a string codificada em UTF16 correspondente ao valor passado.


#### `napi_get_value_uint32` {#napi_get_value_uint32}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

```C [C]
napi_status napi_get_value_uint32(napi_env env,
                                  napi_value value,
                                  uint32_t* result)
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] value`: `napi_value` representando o `number` JavaScript.
- `[out] result`: Primitivo C equivalente do `napi_value` fornecido como um `uint32_t`.

Retorna `napi_ok` se a API for bem-sucedida. Se um `napi_value` não numérico for passado, retorna `napi_number_expected`.

Esta API retorna o primitivo C equivalente do `napi_value` fornecido como um `uint32_t`.

### Funções para obter instâncias globais {#functions-to-get-global-instances}

#### `napi_get_boolean` {#napi_get_boolean}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

```C [C]
napi_status napi_get_boolean(napi_env env, bool value, napi_value* result)
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] value`: O valor do booleano a ser recuperado.
- `[out] result`: `napi_value` representando o singleton `Boolean` JavaScript a ser recuperado.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API é usada para retornar o objeto singleton JavaScript que é usado para representar o valor booleano fornecido.

#### `napi_get_global` {#napi_get_global}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

```C [C]
napi_status napi_get_global(napi_env env, napi_value* result)
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[out] result`: `napi_value` representando o objeto `global` JavaScript.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API retorna o objeto `global`.

#### `napi_get_null` {#napi_get_null}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

```C [C]
napi_status napi_get_null(napi_env env, napi_value* result)
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[out] result`: `napi_value` representando o objeto `null` JavaScript.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API retorna o objeto `null`.

#### `napi_get_undefined` {#napi_get_undefined}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

```C [C]
napi_status napi_get_undefined(napi_env env, napi_value* result)
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[out] result`: `napi_value` representando o valor Undefined do JavaScript.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API retorna o objeto Undefined.


## Trabalhando com valores JavaScript e operações abstratas {#working-with-javascript-values-and-abstract-operations}

A Node-API expõe um conjunto de APIs para executar algumas operações abstratas em valores JavaScript. Algumas dessas operações são documentadas na [Seção 7](https://tc39.github.io/ecma262/#sec-abstract-operations) da [Especificação da Linguagem ECMAScript](https://tc39.github.io/ecma262/).

Essas APIs suportam fazer um dos seguintes:

### `napi_coerce_to_bool` {#napi_coerce_to_bool}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

```C [C]
napi_status napi_coerce_to_bool(napi_env env,
                                napi_value value,
                                napi_value* result)
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] value`: O valor JavaScript a ser forçado.
- `[out] result`: `napi_value` representando o `Boolean` JavaScript forçado.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API implementa a operação abstrata `ToBoolean()` conforme definido na [Seção 7.1.2](https://tc39.github.io/ecma262/#sec-toboolean) da Especificação da Linguagem ECMAScript.

### `napi_coerce_to_number` {#napi_coerce_to_number}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

```C [C]
napi_status napi_coerce_to_number(napi_env env,
                                  napi_value value,
                                  napi_value* result)
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] value`: O valor JavaScript a ser forçado.
- `[out] result`: `napi_value` representando o `number` JavaScript forçado.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API implementa a operação abstrata `ToNumber()` conforme definido na [Seção 7.1.3](https://tc39.github.io/ecma262/#sec-tonumber) da Especificação da Linguagem ECMAScript. Esta função potencialmente executa código JS se o valor passado for um objeto.

### `napi_coerce_to_object` {#napi_coerce_to_object}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

```C [C]
napi_status napi_coerce_to_object(napi_env env,
                                  napi_value value,
                                  napi_value* result)
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] value`: O valor JavaScript a ser forçado.
- `[out] result`: `napi_value` representando o `Object` JavaScript forçado.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API implementa a operação abstrata `ToObject()` conforme definido na [Seção 7.1.13](https://tc39.github.io/ecma262/#sec-toobject) da Especificação da Linguagem ECMAScript.


### `napi_coerce_to_string` {#napi_coerce_to_string}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

```C [C]
napi_status napi_coerce_to_string(napi_env env,
                                  napi_value value,
                                  napi_value* result)
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] value`: O valor JavaScript a ser convertido.
- `[out] result`: `napi_value` representando a `string` JavaScript convertida.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API implementa a operação abstrata `ToString()` conforme definido na [Seção 7.1.13](https://tc39.github.io/ecma262/#sec-toobject) da Especificação da Linguagem ECMAScript. Esta função pode executar código JS se o valor passado for um objeto.

### `napi_typeof` {#napi_typeof}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

```C [C]
napi_status napi_typeof(napi_env env, napi_value value, napi_valuetype* result)
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] value`: O valor JavaScript cujo tipo consultar.
- `[out] result`: O tipo do valor JavaScript.

Retorna `napi_ok` se a API for bem-sucedida.

- `napi_invalid_arg` se o tipo de `value` não for um tipo ECMAScript conhecido e `value` não for um valor Externo.

Esta API representa um comportamento semelhante à invocação do Operador `typeof` no objeto, conforme definido na [Seção 12.5.5](https://tc39.github.io/ecma262/#sec-typeof-operator) da Especificação da Linguagem ECMAScript. No entanto, existem algumas diferenças:

Se `value` tiver um tipo que é inválido, um erro é retornado.

### `napi_instanceof` {#napi_instanceof}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

```C [C]
napi_status napi_instanceof(napi_env env,
                            napi_value object,
                            napi_value constructor,
                            bool* result)
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] object`: O valor JavaScript a ser verificado.
- `[in] constructor`: O objeto de função JavaScript da função construtora a ser verificada.
- `[out] result`: Booleano que é definido como verdadeiro se `object instanceof constructor` for verdadeiro.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API representa a invocação do Operador `instanceof` no objeto, conforme definido na [Seção 12.10.4](https://tc39.github.io/ecma262/#sec-instanceofoperator) da Especificação da Linguagem ECMAScript.


### `napi_is_array` {#napi_is_array}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

```C [C]
napi_status napi_is_array(napi_env env, napi_value value, bool* result)
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] value`: O valor JavaScript a ser verificado.
- `[out] result`: Indica se o objeto fornecido é um array.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API representa a invocação da operação `IsArray` no objeto conforme definido na [Seção 7.2.2](https://tc39.github.io/ecma262/#sec-isarray) da Especificação da Linguagem ECMAScript.

### `napi_is_arraybuffer` {#napi_is_arraybuffer}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

```C [C]
napi_status napi_is_arraybuffer(napi_env env, napi_value value, bool* result)
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] value`: O valor JavaScript a ser verificado.
- `[out] result`: Indica se o objeto fornecido é um `ArrayBuffer`.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API verifica se o `Object` passado é um array buffer.

### `napi_is_buffer` {#napi_is_buffer}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

```C [C]
napi_status napi_is_buffer(napi_env env, napi_value value, bool* result)
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] value`: O valor JavaScript a ser verificado.
- `[out] result`: Indica se o `napi_value` fornecido representa um objeto `node::Buffer` ou `Uint8Array`.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API verifica se o `Object` passado é um buffer ou Uint8Array. [`napi_is_typedarray`](/pt/nodejs/api/n-api#napi_is_typedarray) deve ser preferido se o chamador precisar verificar se o valor é um Uint8Array.

### `napi_is_date` {#napi_is_date}

**Adicionado em: v11.11.0, v10.17.0**

**Versão N-API: 5**

```C [C]
napi_status napi_is_date(napi_env env, napi_value value, bool* result)
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] value`: O valor JavaScript a ser verificado.
- `[out] result`: Indica se o `napi_value` fornecido representa um objeto JavaScript `Date`.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API verifica se o `Object` passado é uma data.


### `napi_is_error` {#napi_is_error_1}

**Adicionado em: v8.0.0**

**Versão da N-API: 1**

```C [C]
napi_status napi_is_error(napi_env env, napi_value value, bool* result)
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] value`: O valor JavaScript a ser verificado.
- `[out] result`: Indica se o `napi_value` fornecido representa um objeto `Error`.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API verifica se o `Object` passado é um `Error`.

### `napi_is_typedarray` {#napi_is_typedarray}

**Adicionado em: v8.0.0**

**Versão da N-API: 1**

```C [C]
napi_status napi_is_typedarray(napi_env env, napi_value value, bool* result)
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] value`: O valor JavaScript a ser verificado.
- `[out] result`: Indica se o `napi_value` fornecido representa um `TypedArray`.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API verifica se o `Object` passado é um array tipado.

### `napi_is_dataview` {#napi_is_dataview}

**Adicionado em: v8.3.0**

**Versão da N-API: 1**

```C [C]
napi_status napi_is_dataview(napi_env env, napi_value value, bool* result)
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] value`: O valor JavaScript a ser verificado.
- `[out] result`: Indica se o `napi_value` fornecido representa um `DataView`.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API verifica se o `Object` passado é um `DataView`.

### `napi_strict_equals` {#napi_strict_equals}

**Adicionado em: v8.0.0**

**Versão da N-API: 1**

```C [C]
napi_status napi_strict_equals(napi_env env,
                               napi_value lhs,
                               napi_value rhs,
                               bool* result)
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] lhs`: O valor JavaScript a ser verificado.
- `[in] rhs`: O valor JavaScript com o qual comparar.
- `[out] result`: Indica se os dois objetos `napi_value` são iguais.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API representa a invocação do algoritmo de Igualdade Estrita, conforme definido na [Seção 7.2.14](https://tc39.github.io/ecma262/#sec-strict-equality-comparison) da Especificação da Linguagem ECMAScript.


### `napi_detach_arraybuffer` {#napi_detach_arraybuffer}

**Adicionado em: v13.0.0, v12.16.0, v10.22.0**

**Versão N-API: 7**

```C [C]
napi_status napi_detach_arraybuffer(napi_env env,
                                    napi_value arraybuffer)
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] arraybuffer`: O `ArrayBuffer` JavaScript a ser desanexado.

Retorna `napi_ok` se a API for bem-sucedida. Se um `ArrayBuffer` não destacável for passado, retorna `napi_detachable_arraybuffer_expected`.

Geralmente, um `ArrayBuffer` não é destacável se já tiver sido desanexado antes. O mecanismo pode impor condições adicionais sobre se um `ArrayBuffer` é destacável. Por exemplo, o V8 exige que o `ArrayBuffer` seja externo, ou seja, criado com [`napi_create_external_arraybuffer`](/pt/nodejs/api/n-api#napi_create_external_arraybuffer).

Esta API representa a invocação da operação de desanexação `ArrayBuffer` conforme definido na [Seção 24.1.1.3](https://tc39.es/ecma262/#sec-detacharraybuffer) da Especificação da Linguagem ECMAScript.

### `napi_is_detached_arraybuffer` {#napi_is_detached_arraybuffer}

**Adicionado em: v13.3.0, v12.16.0, v10.22.0**

**Versão N-API: 7**

```C [C]
napi_status napi_is_detached_arraybuffer(napi_env env,
                                         napi_value arraybuffer,
                                         bool* result)
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] arraybuffer`: O `ArrayBuffer` JavaScript a ser verificado.
- `[out] result`: Indica se o `arraybuffer` está desanexado.

Retorna `napi_ok` se a API for bem-sucedida.

O `ArrayBuffer` é considerado desanexado se seus dados internos forem `null`.

Esta API representa a invocação da operação `IsDetachedBuffer` do `ArrayBuffer` conforme definido na [Seção 24.1.1.2](https://tc39.es/ecma262/#sec-isdetachedbuffer) da Especificação da Linguagem ECMAScript.

## Trabalhando com propriedades JavaScript {#working-with-javascript-properties}

A Node-API expõe um conjunto de APIs para obter e definir propriedades em objetos JavaScript. Alguns desses tipos são documentados na [Seção 7](https://tc39.github.io/ecma262/#sec-abstract-operations) da [Especificação da Linguagem ECMAScript](https://tc39.github.io/ecma262/).

As propriedades em JavaScript são representadas como uma tupla de uma chave e um valor. Fundamentalmente, todas as chaves de propriedade na Node-API podem ser representadas em uma das seguintes formas:

- Nomeado: uma string simples codificada em UTF8
- Indexado por inteiro: um valor de índice representado por `uint32_t`
- Valor JavaScript: estes são representados na Node-API por `napi_value`. Isso pode ser um `napi_value` representando uma `string`, `number` ou `symbol`.

Os valores Node-API são representados pelo tipo `napi_value`. Qualquer chamada Node-API que exija um valor JavaScript recebe um `napi_value`. No entanto, é responsabilidade do chamador garantir que o `napi_value` em questão seja do tipo JavaScript esperado pela API.

As APIs documentadas nesta seção fornecem uma interface simples para obter e definir propriedades em objetos JavaScript arbitrários representados por `napi_value`.

Por exemplo, considere o seguinte trecho de código JavaScript:

```js [ESM]
const obj = {};
obj.myProp = 123;
```
O equivalente pode ser feito usando valores Node-API com o seguinte trecho:

```C [C]
napi_status status = napi_generic_failure;

// const obj = {}
napi_value obj, value;
status = napi_create_object(env, &obj);
if (status != napi_ok) return status;

// Create a napi_value for 123
status = napi_create_int32(env, 123, &value);
if (status != napi_ok) return status;

// obj.myProp = 123
status = napi_set_named_property(env, obj, "myProp", value);
if (status != napi_ok) return status;
```
As propriedades indexadas podem ser definidas de maneira semelhante. Considere o seguinte trecho de código JavaScript:

```js [ESM]
const arr = [];
arr[123] = 'hello';
```
O equivalente pode ser feito usando valores Node-API com o seguinte trecho:

```C [C]
napi_status status = napi_generic_failure;

// const arr = [];
napi_value arr, value;
status = napi_create_array(env, &arr);
if (status != napi_ok) return status;

// Create a napi_value for 'hello'
status = napi_create_string_utf8(env, "hello", NAPI_AUTO_LENGTH, &value);
if (status != napi_ok) return status;

// arr[123] = 'hello';
status = napi_set_element(env, arr, 123, value);
if (status != napi_ok) return status;
```
As propriedades podem ser recuperadas usando as APIs descritas nesta seção. Considere o seguinte trecho de código JavaScript:

```js [ESM]
const arr = [];
const value = arr[123];
```
A seguir está o equivalente aproximado da contraparte da Node-API:

```C [C]
napi_status status = napi_generic_failure;

// const arr = []
napi_value arr, value;
status = napi_create_array(env, &arr);
if (status != napi_ok) return status;

// const value = arr[123]
status = napi_get_element(env, arr, 123, &value);
if (status != napi_ok) return status;
```
Finalmente, várias propriedades também podem ser definidas em um objeto por motivos de desempenho. Considere o seguinte JavaScript:

```js [ESM]
const obj = {};
Object.defineProperties(obj, {
  'foo': { value: 123, writable: true, configurable: true, enumerable: true },
  'bar': { value: 456, writable: true, configurable: true, enumerable: true },
});
```
A seguir está o equivalente aproximado da contraparte da Node-API:

```C [C]
napi_status status = napi_status_generic_failure;

// const obj = {};
napi_value obj;
status = napi_create_object(env, &obj);
if (status != napi_ok) return status;

// Create napi_values for 123 and 456
napi_value fooValue, barValue;
status = napi_create_int32(env, 123, &fooValue);
if (status != napi_ok) return status;
status = napi_create_int32(env, 456, &barValue);
if (status != napi_ok) return status;

// Set the properties
napi_property_descriptor descriptors[] = {
  { "foo", NULL, NULL, NULL, NULL, fooValue, napi_writable | napi_configurable, NULL },
  { "bar", NULL, NULL, NULL, NULL, barValue, napi_writable | napi_configurable, NULL }
}
status = napi_define_properties(env,
                                obj,
                                sizeof(descriptors) / sizeof(descriptors[0]),
                                descriptors);
if (status != napi_ok) return status;
```

### Estruturas {#structures}

#### `napi_property_attributes` {#napi_property_attributes}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v14.12.0 | adicionado `napi_default_method` e `napi_default_property`. |
:::

```C [C]
typedef enum {
  napi_default = 0,
  napi_writable = 1 << 0,
  napi_enumerable = 1 << 1,
  napi_configurable = 1 << 2,

  // Usado com napi_define_class para distinguir propriedades estáticas
  // de propriedades de instância. Ignorado por napi_define_properties.
  napi_static = 1 << 10,

  // Padrão para métodos de classe.
  napi_default_method = napi_writable | napi_configurable,

  // Padrão para propriedades de objeto, como em JS obj[prop].
  napi_default_jsproperty = napi_writable |
                          napi_enumerable |
                          napi_configurable,
} napi_property_attributes;
```
`napi_property_attributes` são flags usadas para controlar o comportamento das propriedades definidas em um objeto JavaScript. Além de `napi_static`, elas correspondem aos atributos listados na [Seção 6.1.7.1](https://tc39.github.io/ecma262/#table-2) da [Especificação da Linguagem ECMAScript](https://tc39.github.io/ecma262/). Elas podem ser um ou mais dos seguintes bitflags:

- `napi_default`: Nenhum atributo explícito é definido na propriedade. Por padrão, uma propriedade é somente leitura, não enumerável e não configurável.
- `napi_writable`: A propriedade é gravável.
- `napi_enumerable`: A propriedade é enumerável.
- `napi_configurable`: A propriedade é configurável, conforme definido na [Seção 6.1.7.1](https://tc39.github.io/ecma262/#table-2) da [Especificação da Linguagem ECMAScript](https://tc39.github.io/ecma262/).
- `napi_static`: A propriedade será definida como uma propriedade estática em uma classe, em vez de uma propriedade de instância, que é o padrão. Isso é usado apenas por [`napi_define_class`](/pt/nodejs/api/n-api#napi_define_class). É ignorado por `napi_define_properties`.
- `napi_default_method`: Como um método em uma classe JS, a propriedade é configurável e gravável, mas não enumerável.
- `napi_default_jsproperty`: Como uma propriedade definida por meio de atribuição em JavaScript, a propriedade é gravável, enumerável e configurável.


#### `napi_property_descriptor` {#napi_property_descriptor}

```C [C]
typedef struct {
  // Um de utf8name ou name deve ser NULL.
  const char* utf8name;
  napi_value name;

  napi_callback method;
  napi_callback getter;
  napi_callback setter;
  napi_value value;

  napi_property_attributes attributes;
  void* data;
} napi_property_descriptor;
```
- `utf8name`: String opcional descrevendo a chave da propriedade, codificada como UTF8. Um de `utf8name` ou `name` deve ser fornecido para a propriedade.
- `name`: `napi_value` opcional que aponta para uma string JavaScript ou símbolo a ser usado como chave para a propriedade. Um de `utf8name` ou `name` deve ser fornecido para a propriedade.
- `value`: O valor que é recuperado por um acesso get da propriedade se a propriedade for uma propriedade de dados. Se isso for passado, defina `getter`, `setter`, `method` e `data` como `NULL` (já que esses membros não serão usados).
- `getter`: Uma função a ser chamada quando um acesso get da propriedade é executado. Se isso for passado, defina `value` e `method` como `NULL` (já que esses membros não serão usados). A função fornecida é chamada implicitamente pelo runtime quando a propriedade é acessada a partir do código JavaScript (ou se um get na propriedade é executado usando uma chamada Node-API). [`napi_callback`](/pt/nodejs/api/n-api#napi_callback) fornece mais detalhes.
- `setter`: Uma função a ser chamada quando um acesso set da propriedade é executado. Se isso for passado, defina `value` e `method` como `NULL` (já que esses membros não serão usados). A função fornecida é chamada implicitamente pelo runtime quando a propriedade é definida a partir do código JavaScript (ou se um set na propriedade é executado usando uma chamada Node-API). [`napi_callback`](/pt/nodejs/api/n-api#napi_callback) fornece mais detalhes.
- `method`: Defina isso para fazer com que a propriedade `value` do descritor de propriedade seja uma função JavaScript representada por `method`. Se isso for passado, defina `value`, `getter` e `setter` como `NULL` (já que esses membros não serão usados). [`napi_callback`](/pt/nodejs/api/n-api#napi_callback) fornece mais detalhes.
- `attributes`: Os atributos associados à propriedade específica. Consulte [`napi_property_attributes`](/pt/nodejs/api/n-api#napi_property_attributes).
- `data`: Os dados de callback passados para `method`, `getter` e `setter` se esta função for invocada.


### Funções {#functions}

#### `napi_get_property_names` {#napi_get_property_names}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

```C [C]
napi_status napi_get_property_names(napi_env env,
                                    napi_value object,
                                    napi_value* result);
```
- `[in] env`: O ambiente sob o qual a chamada Node-API é invocada.
- `[in] object`: O objeto do qual recuperar as propriedades.
- `[out] result`: Um `napi_value` representando um array de valores JavaScript que representam os nomes de propriedade do objeto. A API pode ser usada para iterar sobre `result` usando [`napi_get_array_length`](/pt/nodejs/api/n-api#napi_get_array_length) e [`napi_get_element`](/pt/nodejs/api/n-api#napi_get_element).

Retorna `napi_ok` se a API for bem-sucedida.

Esta API retorna os nomes das propriedades enumeráveis de `object` como um array de strings. As propriedades de `object` cuja chave é um símbolo não serão incluídas.

#### `napi_get_all_property_names` {#napi_get_all_property_names}

**Adicionado em: v13.7.0, v12.17.0, v10.20.0**

**Versão N-API: 6**

```C [C]
napi_get_all_property_names(napi_env env,
                            napi_value object,
                            napi_key_collection_mode key_mode,
                            napi_key_filter key_filter,
                            napi_key_conversion key_conversion,
                            napi_value* result);
```
- `[in] env`: O ambiente sob o qual a chamada Node-API é invocada.
- `[in] object`: O objeto do qual recuperar as propriedades.
- `[in] key_mode`: Se deve recuperar também as propriedades do protótipo.
- `[in] key_filter`: Quais propriedades recuperar (enumerável/legível/gravável).
- `[in] key_conversion`: Se deve converter chaves de propriedade numeradas em strings.
- `[out] result`: Um `napi_value` representando um array de valores JavaScript que representam os nomes de propriedade do objeto. [`napi_get_array_length`](/pt/nodejs/api/n-api#napi_get_array_length) e [`napi_get_element`](/pt/nodejs/api/n-api#napi_get_element) podem ser usados para iterar sobre `result`.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API retorna um array contendo os nomes das propriedades disponíveis deste objeto.


#### `napi_set_property` {#napi_set_property}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

```C [C]
napi_status napi_set_property(napi_env env,
                              napi_value object,
                              napi_value key,
                              napi_value value);
```
- `[in] env`: O ambiente sob o qual a chamada da Node-API é invocada.
- `[in] object`: O objeto no qual definir a propriedade.
- `[in] key`: O nome da propriedade a ser definida.
- `[in] value`: O valor da propriedade.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API define uma propriedade no `Object` passado.

#### `napi_get_property` {#napi_get_property}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

```C [C]
napi_status napi_get_property(napi_env env,
                              napi_value object,
                              napi_value key,
                              napi_value* result);
```
- `[in] env`: O ambiente sob o qual a chamada da Node-API é invocada.
- `[in] object`: O objeto do qual recuperar a propriedade.
- `[in] key`: O nome da propriedade a ser recuperada.
- `[out] result`: O valor da propriedade.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API obtém a propriedade solicitada do `Object` passado.

#### `napi_has_property` {#napi_has_property}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

```C [C]
napi_status napi_has_property(napi_env env,
                              napi_value object,
                              napi_value key,
                              bool* result);
```
- `[in] env`: O ambiente sob o qual a chamada da Node-API é invocada.
- `[in] object`: O objeto a ser consultado.
- `[in] key`: O nome da propriedade cuja existência será verificada.
- `[out] result`: Se a propriedade existe ou não no objeto.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API verifica se o `Object` passado possui a propriedade nomeada.

#### `napi_delete_property` {#napi_delete_property}

**Adicionado em: v8.2.0**

**Versão N-API: 1**

```C [C]
napi_status napi_delete_property(napi_env env,
                                 napi_value object,
                                 napi_value key,
                                 bool* result);
```
- `[in] env`: O ambiente sob o qual a chamada da Node-API é invocada.
- `[in] object`: O objeto a ser consultado.
- `[in] key`: O nome da propriedade a ser excluída.
- `[out] result`: Se a exclusão da propriedade foi bem-sucedida ou não. `result` pode opcionalmente ser ignorado passando `NULL`.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API tenta excluir a propriedade própria `key` de `object`.


#### `napi_has_own_property` {#napi_has_own_property}

**Adicionado em: v8.2.0**

**Versão da N-API: 1**

```C [C]
napi_status napi_has_own_property(napi_env env,
                                  napi_value object,
                                  napi_value key,
                                  bool* result);
```
- `[in] env`: O ambiente sob o qual a chamada da Node-API é invocada.
- `[in] object`: O objeto a ser consultado.
- `[in] key`: O nome da propriedade própria cuja existência deve ser verificada.
- `[out] result`: Se a propriedade própria existe no objeto ou não.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API verifica se o `Object` passado possui a propriedade própria nomeada. `key` deve ser uma `string` ou um `symbol`, ou um erro será lançado. A Node-API não realizará nenhuma conversão entre os tipos de dados.

#### `napi_set_named_property` {#napi_set_named_property}

**Adicionado em: v8.0.0**

**Versão da N-API: 1**

```C [C]
napi_status napi_set_named_property(napi_env env,
                                    napi_value object,
                                    const char* utf8Name,
                                    napi_value value);
```
- `[in] env`: O ambiente sob o qual a chamada da Node-API é invocada.
- `[in] object`: O objeto no qual definir a propriedade.
- `[in] utf8Name`: O nome da propriedade a ser definida.
- `[in] value`: O valor da propriedade.

Retorna `napi_ok` se a API for bem-sucedida.

Este método é equivalente a chamar [`napi_set_property`](/pt/nodejs/api/n-api#napi_set_property) com um `napi_value` criado a partir da string passada como `utf8Name`.

#### `napi_get_named_property` {#napi_get_named_property}

**Adicionado em: v8.0.0**

**Versão da N-API: 1**

```C [C]
napi_status napi_get_named_property(napi_env env,
                                    napi_value object,
                                    const char* utf8Name,
                                    napi_value* result);
```
- `[in] env`: O ambiente sob o qual a chamada da Node-API é invocada.
- `[in] object`: O objeto do qual recuperar a propriedade.
- `[in] utf8Name`: O nome da propriedade a ser obtida.
- `[out] result`: O valor da propriedade.

Retorna `napi_ok` se a API for bem-sucedida.

Este método é equivalente a chamar [`napi_get_property`](/pt/nodejs/api/n-api#napi_get_property) com um `napi_value` criado a partir da string passada como `utf8Name`.


#### `napi_has_named_property` {#napi_has_named_property}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

```C [C]
napi_status napi_has_named_property(napi_env env,
                                    napi_value object,
                                    const char* utf8Name,
                                    bool* result);
```
- `[in] env`: O ambiente sob o qual a chamada Node-API é invocada.
- `[in] object`: O objeto a ser consultado.
- `[in] utf8Name`: O nome da propriedade cuja existência deve ser verificada.
- `[out] result`: Indica se a propriedade existe no objeto ou não.

Retorna `napi_ok` se a API for bem-sucedida.

Este método é equivalente a chamar [`napi_has_property`](/pt/nodejs/api/n-api#napi_has_property) com um `napi_value` criado a partir da string passada como `utf8Name`.

#### `napi_set_element` {#napi_set_element}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

```C [C]
napi_status napi_set_element(napi_env env,
                             napi_value object,
                             uint32_t index,
                             napi_value value);
```
- `[in] env`: O ambiente sob o qual a chamada Node-API é invocada.
- `[in] object`: O objeto do qual definir as propriedades.
- `[in] index`: O índice da propriedade a ser definida.
- `[in] value`: O valor da propriedade.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API define um elemento no `Object` passado.

#### `napi_get_element` {#napi_get_element}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

```C [C]
napi_status napi_get_element(napi_env env,
                             napi_value object,
                             uint32_t index,
                             napi_value* result);
```
- `[in] env`: O ambiente sob o qual a chamada Node-API é invocada.
- `[in] object`: O objeto do qual recuperar a propriedade.
- `[in] index`: O índice da propriedade a ser obtida.
- `[out] result`: O valor da propriedade.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API obtém o elemento no índice solicitado.

#### `napi_has_element` {#napi_has_element}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

```C [C]
napi_status napi_has_element(napi_env env,
                             napi_value object,
                             uint32_t index,
                             bool* result);
```
- `[in] env`: O ambiente sob o qual a chamada Node-API é invocada.
- `[in] object`: O objeto a ser consultado.
- `[in] index`: O índice da propriedade cuja existência deve ser verificada.
- `[out] result`: Indica se a propriedade existe no objeto ou não.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API retorna se o `Object` passado possui um elemento no índice solicitado.


#### `napi_delete_element` {#napi_delete_element}

**Adicionado em: v8.2.0**

**Versão N-API: 1**

```C [C]
napi_status napi_delete_element(napi_env env,
                                napi_value object,
                                uint32_t index,
                                bool* result);
```
- `[in] env`: O ambiente sob o qual a chamada N-API é invocada.
- `[in] object`: O objeto a ser consultado.
- `[in] index`: O índice da propriedade a ser excluída.
- `[out] result`: Se a exclusão do elemento foi bem-sucedida ou não. `result` pode opcionalmente ser ignorado passando `NULL`.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API tenta excluir o `index` especificado de `object`.

#### `napi_define_properties` {#napi_define_properties}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

```C [C]
napi_status napi_define_properties(napi_env env,
                                   napi_value object,
                                   size_t property_count,
                                   const napi_property_descriptor* properties);
```
- `[in] env`: O ambiente sob o qual a chamada N-API é invocada.
- `[in] object`: O objeto do qual recuperar as propriedades.
- `[in] property_count`: O número de elementos no array `properties`.
- `[in] properties`: O array de descritores de propriedade.

Retorna `napi_ok` se a API for bem-sucedida.

Este método permite a definição eficiente de múltiplas propriedades em um determinado objeto. As propriedades são definidas usando descritores de propriedade (consulte [`napi_property_descriptor`](/pt/nodejs/api/n-api#napi_property_descriptor)). Dado um array de tais descritores de propriedade, esta API definirá as propriedades no objeto uma de cada vez, conforme definido por `DefineOwnProperty()` (descrito na [Seção 9.1.6](https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots-defineownproperty-p-desc) da especificação ECMA-262).

#### `napi_object_freeze` {#napi_object_freeze}

**Adicionado em: v14.14.0, v12.20.0**

**Versão N-API: 8**

```C [C]
napi_status napi_object_freeze(napi_env env,
                               napi_value object);
```
- `[in] env`: O ambiente sob o qual a chamada N-API é invocada.
- `[in] object`: O objeto a ser congelado.

Retorna `napi_ok` se a API for bem-sucedida.

Este método congela um determinado objeto. Isso impede que novas propriedades sejam adicionadas a ele, que propriedades existentes sejam removidas, impede a alteração da enumerabilidade, configurabilidade ou capacidade de gravação de propriedades existentes e impede que os valores de propriedades existentes sejam alterados. Também impede que o protótipo do objeto seja alterado. Isso é descrito na [Seção 19.1.2.6](https://tc39.es/ecma262/#sec-object.freeze) da especificação ECMA-262.


#### `napi_object_seal` {#napi_object_seal}

**Adicionado em: v14.14.0, v12.20.0**

**Versão N-API: 8**

```C [C]
napi_status napi_object_seal(napi_env env,
                             napi_value object);
```
- `[in] env`: O ambiente sob o qual a chamada da Node-API é invocada.
- `[in] object`: O objeto a ser selado.

Retorna `napi_ok` se a API for bem-sucedida.

Este método sela um objeto fornecido. Isso impede que novas propriedades sejam adicionadas a ele, além de marcar todas as propriedades existentes como não configuráveis. Isso é descrito na [Seção 19.1.2.20](https://tc39.es/ecma262/#sec-object.seal) da especificação ECMA-262.

## Trabalhando com funções JavaScript {#working-with-javascript-functions}

A Node-API fornece um conjunto de APIs que permitem que o código JavaScript retorne ao código nativo. As Node-APIs que suportam o retorno ao código nativo recebem funções de retorno de chamada representadas pelo tipo `napi_callback`. Quando a VM JavaScript retorna ao código nativo, a função `napi_callback` fornecida é invocada. As APIs documentadas nesta seção permitem que a função de retorno de chamada faça o seguinte:

- Obter informações sobre o contexto em que o retorno de chamada foi invocado.
- Obter os argumentos passados ​​para o retorno de chamada.
- Retornar um `napi_value` de volta do retorno de chamada.

Além disso, a Node-API fornece um conjunto de funções que permitem chamar funções JavaScript do código nativo. Pode-se chamar uma função como uma chamada de função JavaScript normal ou como uma função construtora.

Quaisquer dados não `NULL` que sejam passados para esta API por meio do campo `data` dos itens `napi_property_descriptor` podem ser associados ao `object` e liberados sempre que o `object` for coletado como lixo, passando tanto o `object` quanto os dados para [`napi_add_finalizer`](/pt/nodejs/api/n-api#napi_add_finalizer).

### `napi_call_function` {#napi_call_function}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_call_function(napi_env env,
                                           napi_value recv,
                                           napi_value func,
                                           size_t argc,
                                           const napi_value* argv,
                                           napi_value* result);
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] recv`: O valor `this` passado para a função chamada.
- `[in] func`: `napi_value` representando a função JavaScript a ser invocada.
- `[in] argc`: A contagem de elementos na matriz `argv`.
- `[in] argv`: Array de `napi_values` representando valores JavaScript passados como argumentos para a função.
- `[out] result`: `napi_value` representando o objeto JavaScript retornado.

Retorna `napi_ok` se a API for bem-sucedida.

Este método permite que um objeto de função JavaScript seja chamado de um add-on nativo. Este é o principal mecanismo de retornar *do* código nativo do add-on *para* JavaScript. Para o caso especial de chamar JavaScript após uma operação assíncrona, consulte [`napi_make_callback`](/pt/nodejs/api/n-api#napi_make_callback).

Um caso de uso de amostra pode ser o seguinte. Considere o seguinte trecho de JavaScript:

```js [ESM]
function AddTwo(num) {
  return num + 2;
}
global.AddTwo = AddTwo;
```
Então, a função acima pode ser invocada de um add-on nativo usando o seguinte código:

```C [C]
// Obtenha a função chamada "AddTwo" no objeto global
napi_value global, add_two, arg;
napi_status status = napi_get_global(env, &global);
if (status != napi_ok) return;

status = napi_get_named_property(env, global, "AddTwo", &add_two);
if (status != napi_ok) return;

// const arg = 1337
status = napi_create_int32(env, 1337, &arg);
if (status != napi_ok) return;

napi_value* argv = &arg;
size_t argc = 1;

// AddTwo(arg);
napi_value return_val;
status = napi_call_function(env, global, add_two, argc, argv, &return_val);
if (status != napi_ok) return;

// Converta o resultado de volta para um tipo nativo
int32_t result;
status = napi_get_value_int32(env, return_val, &result);
if (status != napi_ok) return;
```

### `napi_create_function` {#napi_create_function}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

```C [C]
napi_status napi_create_function(napi_env env,
                                 const char* utf8name,
                                 size_t length,
                                 napi_callback cb,
                                 void* data,
                                 napi_value* result);
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] utf8Name`: Nome opcional da função codificado como UTF8. Isso é visível dentro do JavaScript como a propriedade `name` do novo objeto de função.
- `[in] length`: O comprimento do `utf8name` em bytes, ou `NAPI_AUTO_LENGTH` se for terminado em nulo.
- `[in] cb`: A função nativa que deve ser chamada quando este objeto de função for invocado. [`napi_callback`](/pt/nodejs/api/n-api#napi_callback) fornece mais detalhes.
- `[in] data`: Contexto de dados fornecido pelo usuário. Isso será passado de volta para a função quando invocado mais tarde.
- `[out] result`: `napi_value` representando o objeto de função JavaScript para a função recém-criada.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API permite que um autor de add-on crie um objeto de função em código nativo. Este é o principal mecanismo para permitir chamar *para dentro* do código nativo do add-on *a partir* do JavaScript.

A função recém-criada não é automaticamente visível do script após esta chamada. Em vez disso, uma propriedade deve ser explicitamente definida em qualquer objeto que seja visível para o JavaScript, para que a função seja acessível a partir do script.

Para expor uma função como parte das exportações do módulo do add-on, defina a função recém-criada no objeto de exportações. Um módulo de amostra pode ter a seguinte aparência:

```C [C]
napi_value SayHello(napi_env env, napi_callback_info info) {
  printf("Hello\n");
  return NULL;
}

napi_value Init(napi_env env, napi_value exports) {
  napi_status status;

  napi_value fn;
  status = napi_create_function(env, NULL, 0, SayHello, NULL, &fn);
  if (status != napi_ok) return NULL;

  status = napi_set_named_property(env, exports, "sayHello", fn);
  if (status != napi_ok) return NULL;

  return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)
```
Dado o código acima, o add-on pode ser usado do JavaScript da seguinte forma:

```js [ESM]
const myaddon = require('./addon');
myaddon.sayHello();
```
A string passada para `require()` é o nome do alvo em `binding.gyp` responsável por criar o arquivo `.node`.

Quaisquer dados não-`NULL` que são passados para esta API através do parâmetro `data` podem ser associados à função JavaScript resultante (que é retornada no parâmetro `result`) e liberados sempre que a função é coletada pelo coletor de lixo, passando tanto a função JavaScript quanto os dados para [`napi_add_finalizer`](/pt/nodejs/api/n-api#napi_add_finalizer).

`Function`s JavaScript são descritas na [Seção 19.2](https://tc39.github.io/ecma262/#sec-function-objects) da Especificação da Linguagem ECMAScript.


### `napi_get_cb_info` {#napi_get_cb_info}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

```C [C]
napi_status napi_get_cb_info(napi_env env,
                             napi_callback_info cbinfo,
                             size_t* argc,
                             napi_value* argv,
                             napi_value* thisArg,
                             void** data)
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] cbinfo`: As informações de retorno de chamada passadas para a função de retorno de chamada.
- `[in-out] argc`: Especifica o comprimento do array `argv` fornecido e recebe a contagem real de argumentos. `argc` pode ser opcionalmente ignorado passando `NULL`.
- `[out] argv`: Array C de `napi_value`s para o qual os argumentos serão copiados. Se houver mais argumentos do que a contagem fornecida, apenas o número solicitado de argumentos será copiado. Se houver menos argumentos fornecidos do que o alegado, o resto de `argv` será preenchido com valores `napi_value` que representam `undefined`. `argv` pode ser opcionalmente ignorado passando `NULL`.
- `[out] thisArg`: Recebe o argumento JavaScript `this` para a chamada. `thisArg` pode ser opcionalmente ignorado passando `NULL`.
- `[out] data`: Recebe o ponteiro de dados para o retorno de chamada. `data` pode ser opcionalmente ignorado passando `NULL`.

Retorna `napi_ok` se a API for bem-sucedida.

Este método é usado dentro de uma função de retorno de chamada para recuperar detalhes sobre a chamada, como os argumentos e o ponteiro `this` de uma determinada informação de retorno de chamada.

### `napi_get_new_target` {#napi_get_new_target}

**Adicionado em: v8.6.0**

**Versão N-API: 1**

```C [C]
napi_status napi_get_new_target(napi_env env,
                                napi_callback_info cbinfo,
                                napi_value* result)
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] cbinfo`: As informações de retorno de chamada passadas para a função de retorno de chamada.
- `[out] result`: O `new.target` da chamada do construtor.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API retorna o `new.target` da chamada do construtor. Se o retorno de chamada atual não for uma chamada de construtor, o resultado será `NULL`.


### `napi_new_instance` {#napi_new_instance}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

```C [C]
napi_status napi_new_instance(napi_env env,
                              napi_value cons,
                              size_t argc,
                              napi_value* argv,
                              napi_value* result)
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] cons`: `napi_value` representando a função JavaScript a ser invocada como um construtor.
- `[in] argc`: A contagem de elementos no array `argv`.
- `[in] argv`: Array de valores JavaScript como `napi_value` representando os argumentos para o construtor. Se `argc` for zero, este parâmetro pode ser omitido passando `NULL`.
- `[out] result`: `napi_value` representando o objeto JavaScript retornado, que neste caso é o objeto construído.

Este método é usado para instanciar um novo valor JavaScript usando um determinado `napi_value` que representa o construtor para o objeto. Por exemplo, considere o seguinte trecho:

```js [ESM]
function MyObject(param) {
  this.param = param;
}

const arg = 'hello';
const value = new MyObject(arg);
```
O seguinte pode ser aproximado em Node-API usando o seguinte trecho:

```C [C]
// Obter a função construtora MyObject
napi_value global, constructor, arg, value;
napi_status status = napi_get_global(env, &global);
if (status != napi_ok) return;

status = napi_get_named_property(env, global, "MyObject", &constructor);
if (status != napi_ok) return;

// const arg = "hello"
status = napi_create_string_utf8(env, "hello", NAPI_AUTO_LENGTH, &arg);
if (status != napi_ok) return;

napi_value* argv = &arg;
size_t argc = 1;

// const value = new MyObject(arg)
status = napi_new_instance(env, constructor, argc, argv, &value);
```
Retorna `napi_ok` se a API for bem-sucedida.

## Envolvimento de objeto {#object-wrap}

Node-API oferece uma maneira de "envolver" classes e instâncias C++ para que o construtor e os métodos da classe possam ser chamados a partir do JavaScript.

Para objetos envolvidos, pode ser difícil distinguir entre uma função chamada em um protótipo de classe e uma função chamada em uma instância de uma classe. Um padrão comum usado para resolver este problema é salvar uma referência persistente ao construtor da classe para verificações `instanceof` posteriores.

```C [C]
napi_value MyClass_constructor = NULL;
status = napi_get_reference_value(env, MyClass::es_constructor, &MyClass_constructor);
assert(napi_ok == status);
bool is_instance = false;
status = napi_instanceof(env, es_this, MyClass_constructor, &is_instance);
assert(napi_ok == status);
if (is_instance) {
  // napi_unwrap() ...
} else {
  // caso contrário...
}
```
A referência deve ser liberada assim que não for mais necessária.

Há ocasiões em que `napi_instanceof()` é insuficiente para garantir que um objeto JavaScript seja um invólucro para um determinado tipo nativo. Este é o caso especialmente quando objetos JavaScript envolvidos são passados de volta para o addon por meio de métodos estáticos em vez de como o valor `this` dos métodos de protótipo. Nesses casos, há uma chance de que eles possam ser desembrulhados incorretamente.

```js [ESM]
const myAddon = require('./build/Release/my_addon.node');

// `openDatabase()` retorna um objeto JavaScript que envolve um banco de dados nativo
// manipular.
const dbHandle = myAddon.openDatabase();

// `query()` retorna um objeto JavaScript que envolve um identificador de consulta nativo.
const queryHandle = myAddon.query(dbHandle, 'Gimme ALL the things!');

// Há um erro acidental na linha abaixo. O primeiro parâmetro para
// `myAddon.queryHasRecords()` deve ser o identificador do banco de dados (`dbHandle`), não
// o identificador de consulta (`query`), então a condição correta para o loop while
// deveria ser
//
// myAddon.queryHasRecords(dbHandle, queryHandle)
//
while (myAddon.queryHasRecords(queryHandle, dbHandle)) {
  // recuperar registros
}
```
No exemplo acima, `myAddon.queryHasRecords()` é um método que aceita dois argumentos. O primeiro é um identificador de banco de dados e o segundo é um identificador de consulta. Internamente, ele desembrulha o primeiro argumento e converte o ponteiro resultante em um identificador de banco de dados nativo. Em seguida, ele desembrulha o segundo argumento e converte o ponteiro resultante em um identificador de consulta. Se os argumentos forem passados na ordem errada, as conversões funcionarão, no entanto, há uma boa chance de que a operação de banco de dados subjacente falhe ou até mesmo cause um acesso inválido à memória.

Para garantir que o ponteiro recuperado do primeiro argumento seja realmente um ponteiro para um identificador de banco de dados e, da mesma forma, que o ponteiro recuperado do segundo argumento seja realmente um ponteiro para um identificador de consulta, a implementação de `queryHasRecords()` tem que realizar uma validação de tipo. Reter o construtor de classe JavaScript do qual o identificador de banco de dados foi instanciado e o construtor do qual o identificador de consulta foi instanciado em `napi_ref`s pode ajudar, porque `napi_instanceof()` pode então ser usado para garantir que as instâncias passadas para `queryHashRecords()` sejam realmente do tipo correto.

Infelizmente, `napi_instanceof()` não protege contra manipulação de protótipos. Por exemplo, o protótipo da instância do identificador do banco de dados pode ser definido para o protótipo do construtor para instâncias de identificador de consulta. Neste caso, a instância do identificador do banco de dados pode aparecer como uma instância de identificador de consulta e passará no teste `napi_instanceof()` para uma instância de identificador de consulta, enquanto ainda contém um ponteiro para um identificador de banco de dados.

Para este fim, Node-API fornece capacidades de marcação de tipo.

Uma tag de tipo é um inteiro de 128 bits exclusivo do addon. Node-API fornece a estrutura `napi_type_tag` para armazenar uma tag de tipo. Quando tal valor é passado junto com um objeto JavaScript ou [externo](/pt/nodejs/api/n-api#napi_create_external) armazenado em um `napi_value` para `napi_type_tag_object()`, o objeto JavaScript será "marcado" com a tag de tipo. A "marca" é invisível no lado JavaScript. Quando um objeto JavaScript chega a uma vinculação nativa, `napi_check_object_type_tag()` pode ser usado junto com a tag de tipo original para determinar se o objeto JavaScript foi previamente "marcado" com a tag de tipo. Isto cria uma capacidade de verificação de tipo de uma fidelidade superior ao que `napi_instanceof()` pode fornecer, porque tal marcação de tipo sobrevive à manipulação de protótipos e ao descarregamento/recarregamento de addons.

Continuando o exemplo acima, a seguinte implementação de addon de esqueleto ilustra o uso de `napi_type_tag_object()` e `napi_check_object_type_tag()`.

```C [C]
// Este valor é a tag de tipo para um identificador de banco de dados. O comando
//
//   uuidgen | sed -r -e 's/-//g' -e 's/(.{16})(.*)/0x\1, 0x\2/'
//
// pode ser usado para obter os dois valores com os quais inicializar a estrutura.
static const napi_type_tag DatabaseHandleTypeTag = {
  0x1edf75a38336451d, 0xa5ed9ce2e4c00c38
};

// Este valor é a tag de tipo para um identificador de consulta.
static const napi_type_tag QueryHandleTypeTag = {
  0x9c73317f9fad44a3, 0x93c3920bf3b0ad6a
};

static napi_value
openDatabase(napi_env env, napi_callback_info info) {
  napi_status status;
  napi_value result;

  // Executar a ação subjacente que resulta em um identificador de banco de dados.
  DatabaseHandle* dbHandle = open_database();

  // Criar um novo objeto JS vazio.
  status = napi_create_object(env, &result);
  if (status != napi_ok) return NULL;

  // Marcar o objeto para indicar que ele contém um ponteiro para um `DatabaseHandle`.
  status = napi_type_tag_object(env, result, &DatabaseHandleTypeTag);
  if (status != napi_ok) return NULL;

  // Armazenar o ponteiro para a estrutura `DatabaseHandle` dentro do objeto JS.
  status = napi_wrap(env, result, dbHandle, NULL, NULL, NULL);
  if (status != napi_ok) return NULL;

  return result;
}

// Mais tarde, quando recebermos um objeto JavaScript que pretende ser um identificador de banco de dados
// podemos usar `napi_check_object_type_tag()` para garantir que seja realmente tal
// manipular.

static napi_value
query(napi_env env, napi_callback_info info) {
  napi_status status;
  size_t argc = 2;
  napi_value argv[2];
  bool is_db_handle;

  status = napi_get_cb_info(env, info, &argc, argv, NULL, NULL);
  if (status != napi_ok) return NULL;

  // Verificar se o objeto passado como o primeiro parâmetro tem o anteriormente
  // tag aplicada.
  status = napi_check_object_type_tag(env,
                                      argv[0],
                                      &DatabaseHandleTypeTag,
                                      &is_db_handle);
  if (status != napi_ok) return NULL;

  // Lançar um `TypeError` se não o fizer.
  if (!is_db_handle) {
    // Lançar um TypeError.
    return NULL;
  }
}
```

### `napi_define_class` {#napi_define_class}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

```C [C]
napi_status napi_define_class(napi_env env,
                              const char* utf8name,
                              size_t length,
                              napi_callback constructor,
                              void* data,
                              size_t property_count,
                              const napi_property_descriptor* properties,
                              napi_value* result);
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] utf8name`: Nome da função construtora JavaScript. Para clareza, recomenda-se usar o nome da classe C++ ao encapsular uma classe C++.
- `[in] length`: O comprimento do `utf8name` em bytes, ou `NAPI_AUTO_LENGTH` se for terminado em nulo.
- `[in] constructor`: Função de callback que lida com a construção de instâncias da classe. Ao encapsular uma classe C++, este método deve ser um membro estático com a assinatura [`napi_callback`](/pt/nodejs/api/n-api#napi_callback). Um construtor de classe C++ não pode ser usado. [`napi_callback`](/pt/nodejs/api/n-api#napi_callback) fornece mais detalhes.
- `[in] data`: Dados opcionais a serem passados para o callback do construtor como a propriedade `data` das informações do callback.
- `[in] property_count`: Número de itens no argumento do array `properties`.
- `[in] properties`: Array de descritores de propriedade que descrevem propriedades de dados estáticas e de instância, acessadores e métodos na classe. Consulte `napi_property_descriptor`.
- `[out] result`: Um `napi_value` representando a função construtora para a classe.

Retorna `napi_ok` se a API for bem-sucedida.

Define uma classe JavaScript, incluindo:

- Uma função construtora JavaScript que tem o nome da classe. Ao encapsular uma classe C++ correspondente, o callback passado via `constructor` pode ser usado para instanciar uma nova instância de classe C++, que pode então ser colocada dentro da instância do objeto JavaScript que está sendo construída usando [`napi_wrap`](/pt/nodejs/api/n-api#napi_wrap).
- Propriedades na função construtora cuja implementação pode chamar propriedades de dados *estáticas* correspondentes, acessadores e métodos da classe C++ (definidos por descritores de propriedade com o atributo `napi_static`).
- Propriedades no objeto `prototype` da função construtora. Ao encapsular uma classe C++, propriedades de dados *não estáticas*, acessadores e métodos da classe C++ podem ser chamados das funções estáticas fornecidas nos descritores de propriedade sem o atributo `napi_static` após recuperar a instância da classe C++ colocada dentro da instância do objeto JavaScript usando [`napi_unwrap`](/pt/nodejs/api/n-api#napi_unwrap).

Ao encapsular uma classe C++, o callback do construtor C++ passado via `constructor` deve ser um método estático na classe que chama o construtor de classe real, então encapsula a nova instância C++ em um objeto JavaScript e retorna o objeto wrapper. Consulte [`napi_wrap`](/pt/nodejs/api/n-api#napi_wrap) para obter detalhes.

A função construtora JavaScript retornada de [`napi_define_class`](/pt/nodejs/api/n-api#napi_define_class) é frequentemente salva e usada posteriormente para construir novas instâncias da classe a partir de código nativo, e/ou para verificar se os valores fornecidos são instâncias da classe. Nesse caso, para evitar que o valor da função seja coletado pelo coletor de lixo, uma referência persistente forte a ela pode ser criada usando [`napi_create_reference`](/pt/nodejs/api/n-api#napi_create_reference), garantindo que a contagem de referência seja mantida \>= 1.

Qualquer dado não-`NULL` que seja passado para esta API através do parâmetro `data` ou através do campo `data` dos itens do array `napi_property_descriptor` pode ser associado ao construtor JavaScript resultante (que é retornado no parâmetro `result`) e liberado sempre que a classe é coletada pelo coletor de lixo, passando tanto a função JavaScript quanto os dados para [`napi_add_finalizer`](/pt/nodejs/api/n-api#napi_add_finalizer).


### `napi_wrap` {#napi_wrap}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

```C [C]
napi_status napi_wrap(napi_env env,
                      napi_value js_object,
                      void* native_object,
                      napi_finalize finalize_cb,
                      void* finalize_hint,
                      napi_ref* result);
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] js_object`: O objeto JavaScript que será o invólucro para o objeto nativo.
- `[in] native_object`: A instância nativa que será envolvida no objeto JavaScript.
- `[in] finalize_cb`: Callback nativo opcional que pode ser usado para liberar a instância nativa quando o objeto JavaScript for coletado pelo coletor de lixo. [`napi_finalize`](/pt/nodejs/api/n-api#napi_finalize) fornece mais detalhes.
- `[in] finalize_hint`: Dica contextual opcional que é passada para o callback de finalização.
- `[out] result`: Referência opcional ao objeto envolvido.

Retorna `napi_ok` se a API for bem-sucedida.

Envolve uma instância nativa em um objeto JavaScript. A instância nativa pode ser recuperada posteriormente usando `napi_unwrap()`.

Quando o código JavaScript invoca um construtor para uma classe que foi definida usando `napi_define_class()`, o `napi_callback` para o construtor é invocado. Após construir uma instância da classe nativa, o callback deve então chamar `napi_wrap()` para envolver a instância recém-construída no objeto JavaScript já criado que é o argumento `this` para o callback do construtor. (Esse objeto `this` foi criado a partir do `prototype` da função construtora, então já possui definições de todas as propriedades e métodos da instância.)

Normalmente, ao envolver uma instância de classe, um callback de finalização deve ser fornecido que simplesmente exclui a instância nativa que é recebida como o argumento `data` para o callback de finalização.

A referência retornada opcional é inicialmente uma referência fraca, o que significa que tem uma contagem de referência de 0. Normalmente, essa contagem de referência seria incrementada temporariamente durante operações assíncronas que exigem que a instância permaneça válida.

*Cuidado*: A referência retornada opcional (se obtida) deve ser excluída via [`napi_delete_reference`](/pt/nodejs/api/n-api#napi_delete_reference) SOMENTE em resposta à invocação do callback de finalização. Se for excluída antes disso, o callback de finalização pode nunca ser invocado. Portanto, ao obter uma referência, um callback de finalização também é necessário para permitir o descarte correto da referência.

Os callbacks do finalizador podem ser adiados, deixando uma janela onde o objeto foi coletado pelo coletor de lixo (e a referência fraca é inválida), mas o finalizador ainda não foi chamado. Ao usar `napi_get_reference_value()` em referências fracas retornadas por `napi_wrap()`, você ainda deve lidar com um resultado vazio.

Chamar `napi_wrap()` uma segunda vez em um objeto retornará um erro. Para associar outra instância nativa ao objeto, use `napi_remove_wrap()` primeiro.


### `napi_unwrap` {#napi_unwrap}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

```C [C]
napi_status napi_unwrap(napi_env env,
                        napi_value js_object,
                        void** result);
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] js_object`: O objeto associado à instância nativa.
- `[out] result`: Ponteiro para a instância nativa encapsulada.

Retorna `napi_ok` se a API for bem-sucedida.

Recupera uma instância nativa que foi previamente encapsulada em um objeto JavaScript usando `napi_wrap()`.

Quando o código JavaScript invoca um método ou um acessador de propriedade na classe, o `napi_callback` correspondente é invocado. Se o callback for para um método ou acessador de instância, então o argumento `this` para o callback é o objeto wrapper; a instância C++ encapsulada que é o destino da chamada pode ser obtida chamando `napi_unwrap()` no objeto wrapper.

### `napi_remove_wrap` {#napi_remove_wrap}

**Adicionado em: v8.5.0**

**Versão N-API: 1**

```C [C]
napi_status napi_remove_wrap(napi_env env,
                             napi_value js_object,
                             void** result);
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] js_object`: O objeto associado à instância nativa.
- `[out] result`: Ponteiro para a instância nativa encapsulada.

Retorna `napi_ok` se a API for bem-sucedida.

Recupera uma instância nativa que foi previamente encapsulada no objeto JavaScript `js_object` usando `napi_wrap()` e remove o encapsulamento. Se um callback finalize foi associado ao encapsulamento, ele não será mais chamado quando o objeto JavaScript for coletado como lixo.

### `napi_type_tag_object` {#napi_type_tag_object}

**Adicionado em: v14.8.0, v12.19.0**

**Versão N-API: 8**

```C [C]
napi_status napi_type_tag_object(napi_env env,
                                 napi_value js_object,
                                 const napi_type_tag* type_tag);
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] js_object`: O objeto JavaScript ou [externo](/pt/nodejs/api/n-api#napi_create_external) a ser marcado.
- `[in] type_tag`: A tag com a qual o objeto deve ser marcado.

Retorna `napi_ok` se a API for bem-sucedida.

Associa o valor do ponteiro `type_tag` ao objeto JavaScript ou [externo](/pt/nodejs/api/n-api#napi_create_external). `napi_check_object_type_tag()` pode então ser usado para comparar a tag que foi anexada ao objeto com uma pertencente ao addon para garantir que o objeto tenha o tipo correto.

Se o objeto já tiver uma tag de tipo associada, esta API retornará `napi_invalid_arg`.


### `napi_check_object_type_tag` {#napi_check_object_type_tag}

**Adicionado em: v14.8.0, v12.19.0**

**Versão N-API: 8**

```C [C]
napi_status napi_check_object_type_tag(napi_env env,
                                       napi_value js_object,
                                       const napi_type_tag* type_tag,
                                       bool* result);
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] js_object`: O objeto JavaScript ou [externo](/pt/nodejs/api/n-api#napi_create_external) cujo tipo de tag a ser examinado.
- `[in] type_tag`: A tag com a qual comparar qualquer tag encontrada no objeto.
- `[out] result`: Se a tag de tipo fornecida corresponde à tag de tipo no objeto. `false` também é retornado se nenhuma tag de tipo foi encontrada no objeto.

Retorna `napi_ok` se a API for bem-sucedida.

Compara o ponteiro fornecido como `type_tag` com qualquer um que possa ser encontrado em `js_object`. Se nenhuma tag for encontrada em `js_object` ou, se uma tag for encontrada, mas não corresponder a `type_tag`, então `result` é definido como `false`. Se uma tag for encontrada e corresponder a `type_tag`, então `result` é definido como `true`.

### `napi_add_finalizer` {#napi_add_finalizer}

**Adicionado em: v8.0.0**

**Versão N-API: 5**

```C [C]
napi_status napi_add_finalizer(napi_env env,
                               napi_value js_object,
                               void* finalize_data,
                               node_api_basic_finalize finalize_cb,
                               void* finalize_hint,
                               napi_ref* result);
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] js_object`: O objeto JavaScript ao qual os dados nativos serão anexados.
- `[in] finalize_data`: Dados opcionais a serem passados para `finalize_cb`.
- `[in] finalize_cb`: Callback nativo que será usado para liberar os dados nativos quando o objeto JavaScript tiver sido coletado pelo garbage collector. [`napi_finalize`](/pt/nodejs/api/n-api#napi_finalize) fornece mais detalhes.
- `[in] finalize_hint`: Dica contextual opcional que é passada para o callback de finalização.
- `[out] result`: Referência opcional ao objeto JavaScript.

Retorna `napi_ok` se a API for bem-sucedida.

Adiciona um callback `napi_finalize` que será chamado quando o objeto JavaScript em `js_object` tiver sido coletado pelo garbage collector.

Esta API pode ser chamada várias vezes em um único objeto JavaScript.

*Cuidado*: A referência opcional retornada (se obtida) deve ser excluída através de [`napi_delete_reference`](/pt/nodejs/api/n-api#napi_delete_reference) SOMENTE em resposta à invocação do callback de finalização. Se for excluída antes disso, o callback de finalização pode nunca ser invocado. Portanto, ao obter uma referência, um callback de finalização também é necessário para permitir o descarte correto da referência.


#### `node_api_post_finalizer` {#node_api_post_finalizer}

**Adicionado em: v21.0.0, v20.10.0, v18.19.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

```C [C]
napi_status node_api_post_finalizer(node_api_basic_env env,
                                    napi_finalize finalize_cb,
                                    void* finalize_data,
                                    void* finalize_hint);
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] finalize_cb`: Callback nativo que será usado para liberar os dados nativos quando o objeto JavaScript for coletado pelo coletor de lixo. [`napi_finalize`](/pt/nodejs/api/n-api#napi_finalize) fornece mais detalhes.
- `[in] finalize_data`: Dados opcionais a serem passados para `finalize_cb`.
- `[in] finalize_hint`: Dica contextual opcional que é passada para o callback de finalização.

Retorna `napi_ok` se a API for bem-sucedida.

Agenda um callback `napi_finalize` para ser chamado assincronamente no loop de eventos.

Normalmente, os finalizadores são chamados enquanto o GC (coletor de lixo) coleta objetos. Nesse ponto, chamar qualquer Node-API que possa causar alterações no estado do GC será desativado e causará uma falha no Node.js.

`node_api_post_finalizer` ajuda a contornar essa limitação, permitindo que o add-on adie as chamadas para tais Node-APIs para um ponto no tempo fora da finalização do GC.

## Operações assíncronas simples {#simple-asynchronous-operations}

Os módulos Addon geralmente precisam aproveitar os auxiliares assíncronos do libuv como parte de sua implementação. Isso permite que eles agendem o trabalho a ser executado assincronamente para que seus métodos possam retornar antes que o trabalho seja concluído. Isso permite que eles evitem bloquear a execução geral do aplicativo Node.js.

A Node-API fornece uma interface ABI-estável para essas funções de suporte que cobre os casos de uso assíncronos mais comuns.

A Node-API define a estrutura `napi_async_work` que é usada para gerenciar workers assíncronos. As instâncias são criadas/excluídas com [`napi_create_async_work`](/pt/nodejs/api/n-api#napi_create_async_work) e [`napi_delete_async_work`](/pt/nodejs/api/n-api#napi_delete_async_work).

Os callbacks `execute` e `complete` são funções que serão invocadas quando o executor estiver pronto para executar e quando concluir sua tarefa, respectivamente.

A função `execute` deve evitar fazer quaisquer chamadas Node-API que possam resultar na execução de JavaScript ou interação com objetos JavaScript. Na maioria das vezes, qualquer código que precise fazer chamadas Node-API deve ser feito no callback `complete`. Evite usar o parâmetro `napi_env` no callback execute, pois provavelmente executará JavaScript.

Essas funções implementam as seguintes interfaces:

```C [C]
typedef void (*napi_async_execute_callback)(napi_env env,
                                            void* data);
typedef void (*napi_async_complete_callback)(napi_env env,
                                             napi_status status,
                                             void* data);
```
Quando esses métodos são invocados, o parâmetro `data` passado será os dados `void*` fornecidos pelo addon que foram passados para a chamada `napi_create_async_work`.

Uma vez criado, o worker assíncrono pode ser enfileirado para execução usando a função [`napi_queue_async_work`](/pt/nodejs/api/n-api#napi_queue_async_work):

```C [C]
napi_status napi_queue_async_work(node_api_basic_env env,
                                  napi_async_work work);
```
[`napi_cancel_async_work`](/pt/nodejs/api/n-api#napi_cancel_async_work) pode ser usado se o trabalho precisar ser cancelado antes que a execução do trabalho tenha começado.

Depois de chamar [`napi_cancel_async_work`](/pt/nodejs/api/n-api#napi_cancel_async_work), o callback `complete` será invocado com um valor de status de `napi_cancelled`. O trabalho não deve ser excluído antes da invocação do callback `complete`, mesmo quando foi cancelado.


### `napi_create_async_work` {#napi_create_async_work}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v8.6.0 | Adicionados os parâmetros `async_resource` e `async_resource_name`. |
| v8.0.0 | Adicionado em: v8.0.0 |
:::

**Versão N-API: 1**

```C [C]
napi_status napi_create_async_work(napi_env env,
                                   napi_value async_resource,
                                   napi_value async_resource_name,
                                   napi_async_execute_callback execute,
                                   napi_async_complete_callback complete,
                                   void* data,
                                   napi_async_work* result);
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] async_resource`: Um objeto opcional associado ao trabalho assíncrono que será passado para possíveis `async_hooks` [`init` hooks](/pt/nodejs/api/async_hooks#initasyncid-type-triggerasyncid-resource).
- `[in] async_resource_name`: Identificador para o tipo de recurso que está sendo fornecido para informações de diagnóstico expostas pela API `async_hooks`.
- `[in] execute`: A função nativa que deve ser chamada para executar a lógica de forma assíncrona. A função fornecida é chamada a partir de uma thread do pool de trabalhadores e pode ser executada em paralelo com a thread principal do loop de eventos.
- `[in] complete`: A função nativa que será chamada quando a lógica assíncrona for concluída ou cancelada. A função fornecida é chamada a partir da thread principal do loop de eventos. [`napi_async_complete_callback`](/pt/nodejs/api/n-api#napi_async_complete_callback) fornece mais detalhes.
- `[in] data`: Contexto de dados fornecido pelo usuário. Isso será passado de volta para as funções execute e complete.
- `[out] result`: `napi_async_work*` que é o manipulador para o trabalho assíncrono recém-criado.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API aloca um objeto de trabalho que é usado para executar a lógica de forma assíncrona. Ele deve ser liberado usando [`napi_delete_async_work`](/pt/nodejs/api/n-api#napi_delete_async_work) assim que o trabalho não for mais necessário.

`async_resource_name` deve ser uma string com terminação nula e codificada em UTF-8.

O identificador `async_resource_name` é fornecido pelo usuário e deve ser representativo do tipo de trabalho assíncrono que está sendo executado. Também é recomendável aplicar namespaces ao identificador, por exemplo, incluindo o nome do módulo. Consulte a [`documentação do async_hooks`](/pt/nodejs/api/async_hooks#type) para obter mais informações.


### `napi_delete_async_work` {#napi_delete_async_work}

**Adicionado em: v8.0.0**

**Versão da N-API: 1**

```C [C]
napi_status napi_delete_async_work(napi_env env,
                                   napi_async_work work);
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] work`: O handle retornado pela chamada a `napi_create_async_work`.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API libera um objeto de trabalho alocado anteriormente.

Esta API pode ser chamada mesmo que haja uma exceção JavaScript pendente.

### `napi_queue_async_work` {#napi_queue_async_work}

**Adicionado em: v8.0.0**

**Versão da N-API: 1**

```C [C]
napi_status napi_queue_async_work(node_api_basic_env env,
                                  napi_async_work work);
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] work`: O handle retornado pela chamada a `napi_create_async_work`.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API solicita que o trabalho alocado anteriormente seja agendado para execução. Uma vez que retorne com sucesso, esta API não deve ser chamada novamente com o mesmo item `napi_async_work` ou o resultado será indefinido.

### `napi_cancel_async_work` {#napi_cancel_async_work}

**Adicionado em: v8.0.0**

**Versão da N-API: 1**

```C [C]
napi_status napi_cancel_async_work(node_api_basic_env env,
                                   napi_async_work work);
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] work`: O handle retornado pela chamada a `napi_create_async_work`.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API cancela o trabalho enfileirado se ele ainda não tiver sido iniciado. Se já tiver começado a ser executado, não pode ser cancelado e `napi_generic_failure` será retornado. Se bem-sucedido, o callback `complete` será invocado com um valor de status de `napi_cancelled`. O trabalho não deve ser excluído antes da invocação do callback `complete`, mesmo que tenha sido cancelado com sucesso.

Esta API pode ser chamada mesmo que haja uma exceção JavaScript pendente.

## Operações assíncronas personalizadas {#custom-asynchronous-operations}

As APIs de trabalho assíncronas simples acima podem não ser apropriadas para todos os cenários. Ao usar qualquer outro mecanismo assíncrono, as seguintes APIs são necessárias para garantir que uma operação assíncrona seja rastreada corretamente pelo runtime.


### `napi_async_init` {#napi_async_init}

**Adicionado em: v8.6.0**

**Versão N-API: 1**

```C [C]
napi_status napi_async_init(napi_env env,
                            napi_value async_resource,
                            napi_value async_resource_name,
                            napi_async_context* result)
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] async_resource`: Objeto associado ao trabalho assíncrono que será passado para possíveis `async_hooks` [`init` hooks](/pt/nodejs/api/async_hooks#initasyncid-type-triggerasyncid-resource) e pode ser acessado por [`async_hooks.executionAsyncResource()`](/pt/nodejs/api/async_hooks#async_hooksexecutionasyncresource).
- `[in] async_resource_name`: Identificador para o tipo de recurso que está sendo fornecido para informações de diagnóstico expostas pela API `async_hooks`.
- `[out] result`: O contexto assíncrono inicializado.

Retorna `napi_ok` se a API for bem-sucedida.

O objeto `async_resource` precisa ser mantido ativo até [`napi_async_destroy`](/pt/nodejs/api/n-api#napi_async_destroy) para manter a API relacionada ao `async_hooks` funcionando corretamente. Para manter a compatibilidade ABI com versões anteriores, os `napi_async_context` não estão mantendo a referência forte aos objetos `async_resource` para evitar a introdução de vazamentos de memória. No entanto, se o `async_resource` for coletado pelo coletor de lixo pelo motor JavaScript antes que o `napi_async_context` seja destruído por `napi_async_destroy`, chamar APIs relacionadas ao `napi_async_context` como [`napi_open_callback_scope`](/pt/nodejs/api/n-api#napi_open_callback_scope) e [`napi_make_callback`](/pt/nodejs/api/n-api#napi_make_callback) pode causar problemas como perda de contexto assíncrono ao usar a API `AsyncLocalStorage`.

Para manter a compatibilidade ABI com versões anteriores, passar `NULL` para `async_resource` não resulta em um erro. No entanto, isso não é recomendado, pois resultará em um comportamento indesejável com `async_hooks` [`init` hooks](/pt/nodejs/api/async_hooks#initasyncid-type-triggerasyncid-resource) e `async_hooks.executionAsyncResource()` pois o recurso agora é necessário pela implementação subjacente de `async_hooks` para fornecer a ligação entre os callbacks assíncronos.


### `napi_async_destroy` {#napi_async_destroy}

**Adicionado em: v8.6.0**

**Versão da N-API: 1**

```C [C]
napi_status napi_async_destroy(napi_env env,
                               napi_async_context async_context);
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] async_context`: O contexto assíncrono a ser destruído.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API pode ser chamada mesmo que haja uma exceção JavaScript pendente.

### `napi_make_callback` {#napi_make_callback}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v8.6.0 | Adicionado o parâmetro `async_context`. |
| v8.0.0 | Adicionado em: v8.0.0 |
:::

**Versão da N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_make_callback(napi_env env,
                                           napi_async_context async_context,
                                           napi_value recv,
                                           napi_value func,
                                           size_t argc,
                                           const napi_value* argv,
                                           napi_value* result);
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] async_context`: Contexto para a operação assíncrona que está invocando o callback. Normalmente, este deve ser um valor obtido anteriormente de [`napi_async_init`](/pt/nodejs/api/n-api#napi_async_init). Para manter a compatibilidade ABI com versões anteriores, passar `NULL` para `async_context` não resulta em um erro. No entanto, isso resulta em uma operação incorreta dos hooks assíncronos. Os problemas potenciais incluem a perda do contexto assíncrono ao usar a API `AsyncLocalStorage`.
- `[in] recv`: O valor `this` passado para a função chamada.
- `[in] func`: `napi_value` representando a função JavaScript a ser invocada.
- `[in] argc`: A contagem de elementos no array `argv`.
- `[in] argv`: Array de valores JavaScript como `napi_value` representando os argumentos para a função. Se `argc` for zero, este parâmetro pode ser omitido passando `NULL`.
- `[out] result`: `napi_value` representando o objeto JavaScript retornado.

Retorna `napi_ok` se a API for bem-sucedida.

Este método permite que um objeto de função JavaScript seja chamado a partir de um complemento nativo. Esta API é semelhante a `napi_call_function`. No entanto, ela é usada para chamar *do* código nativo *de volta para* JavaScript *depois* de retornar de uma operação assíncrona (quando não há nenhum outro script na pilha). É um wrapper bastante simples em torno de `node::MakeCallback`.

Observe que *não* é necessário usar `napi_make_callback` de dentro de um `napi_async_complete_callback`; nessa situação, o contexto assíncrono do callback já foi configurado, portanto, uma chamada direta para `napi_call_function` é suficiente e apropriada. O uso da função `napi_make_callback` pode ser necessário ao implementar um comportamento assíncrono personalizado que não usa `napi_create_async_work`.

Quaisquer `process.nextTick`s ou Promises agendadas na fila de microtarefas pelo JavaScript durante o callback são executadas antes de retornar ao C/C++.


### `napi_open_callback_scope` {#napi_open_callback_scope}

**Adicionado em: v9.6.0**

**Versão N-API: 3**

```C [C]
NAPI_EXTERN napi_status napi_open_callback_scope(napi_env env,
                                                 napi_value resource_object,
                                                 napi_async_context context,
                                                 napi_callback_scope* result)
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] resource_object`: Um objeto associado ao trabalho assíncrono que será passado para possíveis `async_hooks` [`init` hooks](/pt/nodejs/api/async_hooks#initasyncid-type-triggerasyncid-resource). Este parâmetro foi descontinuado e é ignorado em tempo de execução. Utilize o parâmetro `async_resource` em [`napi_async_init`](/pt/nodejs/api/n-api#napi_async_init) em vez disso.
- `[in] context`: Contexto para a operação assíncrona que está invocando o callback. Este deve ser um valor previamente obtido de [`napi_async_init`](/pt/nodejs/api/n-api#napi_async_init).
- `[out] result`: O escopo recém-criado.

Existem casos (por exemplo, resolvendo promises) onde é necessário ter o equivalente ao escopo associado a um callback em vigor ao fazer certas chamadas Node-API. Se não houver outro script na stack, as funções [`napi_open_callback_scope`](/pt/nodejs/api/n-api#napi_open_callback_scope) e [`napi_close_callback_scope`](/pt/nodejs/api/n-api#napi_close_callback_scope) podem ser usadas para abrir/fechar o escopo necessário.

### `napi_close_callback_scope` {#napi_close_callback_scope}

**Adicionado em: v9.6.0**

**Versão N-API: 3**

```C [C]
NAPI_EXTERN napi_status napi_close_callback_scope(napi_env env,
                                                  napi_callback_scope scope)
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] scope`: O escopo a ser fechado.

Esta API pode ser chamada mesmo que haja uma exceção JavaScript pendente.

## Gerenciamento de versão {#version-management}

### `napi_get_node_version` {#napi_get_node_version}

**Adicionado em: v8.4.0**

**Versão N-API: 1**

```C [C]
typedef struct {
  uint32_t major;
  uint32_t minor;
  uint32_t patch;
  const char* release;
} napi_node_version;

napi_status napi_get_node_version(node_api_basic_env env,
                                  const napi_node_version** version);
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[out] version`: Um ponteiro para as informações de versão do próprio Node.js.

Retorna `napi_ok` se a API for bem-sucedida.

Esta função preenche a struct `version` com a versão major, minor e patch do Node.js que está sendo executado no momento, e o campo `release` com o valor de [`process.release.name`](/pt/nodejs/api/process#processrelease).

O buffer retornado é alocado estaticamente e não precisa ser liberado.


### `napi_get_version` {#napi_get_version}

**Adicionado em: v8.0.0**

**Versão N-API: 1**

```C [C]
napi_status napi_get_version(node_api_basic_env env,
                             uint32_t* result);
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[out] result`: A versão mais alta da Node-API suportada.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API retorna a versão mais alta da Node-API suportada pelo tempo de execução do Node.js. A Node-API está planejada para ser aditiva, de modo que versões mais recentes do Node.js podem suportar funções API adicionais. Para permitir que um addon use uma função mais recente ao ser executado com versões do Node.js que a suportam, enquanto fornece comportamento de fallback ao ser executado com versões do Node.js que não a suportam:

- Chame `napi_get_version()` para determinar se a API está disponível.
- Se disponível, carregue dinamicamente um ponteiro para a função usando `uv_dlsym()`.
- Use o ponteiro carregado dinamicamente para invocar a função.
- Se a função não estiver disponível, forneça uma implementação alternativa que não use a função.

## Gerenciamento de memória {#memory-management}

### `napi_adjust_external_memory` {#napi_adjust_external_memory}

**Adicionado em: v8.5.0**

**Versão N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_adjust_external_memory(node_api_basic_env env,
                                                    int64_t change_in_bytes,
                                                    int64_t* result);
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] change_in_bytes`: A mudança na memória alocada externamente que é mantida ativa por objetos JavaScript.
- `[out] result`: O valor ajustado

Retorna `napi_ok` se a API for bem-sucedida.

Esta função dá ao V8 uma indicação da quantidade de memória alocada externamente que é mantida ativa por objetos JavaScript (ou seja, um objeto JavaScript que aponta para sua própria memória alocada por um addon nativo). Registrar memória alocada externamente acionará coletas de lixo globais com mais frequência do que aconteceria de outra forma.

## Promises {#promises}

A Node-API fornece facilidades para criar objetos `Promise` conforme descrito na [Seção 25.4](https://tc39.github.io/ecma262/#sec-promise-objects) da especificação ECMA. Ela implementa promises como um par de objetos. Quando uma promise é criada por `napi_create_promise()`, um objeto "deferred" é criado e retornado junto com a `Promise`. O objeto deferred é vinculado à `Promise` criada e é o único meio de resolver ou rejeitar a `Promise` usando `napi_resolve_deferred()` ou `napi_reject_deferred()`. O objeto deferred que é criado por `napi_create_promise()` é liberado por `napi_resolve_deferred()` ou `napi_reject_deferred()`. O objeto `Promise` pode ser retornado ao JavaScript onde pode ser usado da maneira usual.

Por exemplo, para criar uma promise e passá-la para um worker assíncrono:

```C [C]
napi_deferred deferred;
napi_value promise;
napi_status status;

// Create the promise.
status = napi_create_promise(env, &deferred, &promise);
if (status != napi_ok) return NULL;

// Pass the deferred to a function that performs an asynchronous action.
do_something_asynchronous(deferred);

// Return the promise to JS
return promise;
```
A função acima `do_something_asynchronous()` executaria sua ação assíncrona e, em seguida, resolveria ou rejeitaria o deferred, concluindo assim a promise e liberando o deferred:

```C [C]
napi_deferred deferred;
napi_value undefined;
napi_status status;

// Create a value with which to conclude the deferred.
status = napi_get_undefined(env, &undefined);
if (status != napi_ok) return NULL;

// Resolve or reject the promise associated with the deferred depending on
// whether the asynchronous action succeeded.
if (asynchronous_action_succeeded) {
  status = napi_resolve_deferred(env, deferred, undefined);
} else {
  status = napi_reject_deferred(env, deferred, undefined);
}
if (status != napi_ok) return NULL;

// At this point the deferred has been freed, so we should assign NULL to it.
deferred = NULL;
```

### `napi_create_promise` {#napi_create_promise}

**Adicionado em: v8.5.0**

**Versão da N-API: 1**

```C [C]
napi_status napi_create_promise(napi_env env,
                                napi_deferred* deferred,
                                napi_value* promise);
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[out] deferred`: Um objeto deferred recém-criado que pode ser posteriormente passado para `napi_resolve_deferred()` ou `napi_reject_deferred()` para resolver ou rejeitar a promise associada, respectivamente.
- `[out] promise`: A promise JavaScript associada ao objeto deferred.

Retorna `napi_ok` se a API for bem-sucedida.

Esta API cria um objeto deferred e uma promise JavaScript.

### `napi_resolve_deferred` {#napi_resolve_deferred}

**Adicionado em: v8.5.0**

**Versão da N-API: 1**

```C [C]
napi_status napi_resolve_deferred(napi_env env,
                                  napi_deferred deferred,
                                  napi_value resolution);
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] deferred`: O objeto deferred cuja promise associada deve ser resolvida.
- `[in] resolution`: O valor com o qual a promise deve ser resolvida.

Esta API resolve uma promise JavaScript por meio do objeto deferred com o qual ela está associada. Assim, ela só pode ser usada para resolver promises JavaScript para as quais o objeto deferred correspondente esteja disponível. Isso efetivamente significa que a promise deve ter sido criada usando `napi_create_promise()` e o objeto deferred retornado dessa chamada deve ter sido retido para ser passado para esta API.

O objeto deferred é liberado após a conclusão bem-sucedida.

### `napi_reject_deferred` {#napi_reject_deferred}

**Adicionado em: v8.5.0**

**Versão da N-API: 1**

```C [C]
napi_status napi_reject_deferred(napi_env env,
                                 napi_deferred deferred,
                                 napi_value rejection);
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] deferred`: O objeto deferred cuja promise associada deve ser resolvida.
- `[in] rejection`: O valor com o qual a promise deve ser rejeitada.

Esta API rejeita uma promise JavaScript por meio do objeto deferred com o qual ela está associada. Assim, ela só pode ser usada para rejeitar promises JavaScript para as quais o objeto deferred correspondente esteja disponível. Isso efetivamente significa que a promise deve ter sido criada usando `napi_create_promise()` e o objeto deferred retornado dessa chamada deve ter sido retido para ser passado para esta API.

O objeto deferred é liberado após a conclusão bem-sucedida.


### `napi_is_promise` {#napi_is_promise}

**Adicionado em: v8.5.0**

**Versão N-API: 1**

```C [C]
napi_status napi_is_promise(napi_env env,
                            napi_value value,
                            bool* is_promise);
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] value`: O valor a ser examinado
- `[out] is_promise`: Sinalizador indicando se `promise` é um objeto promise nativo (ou seja, um objeto promise criado pelo mecanismo subjacente).

## Execução de script {#script-execution}

Node-API fornece uma API para executar uma string contendo JavaScript usando o mecanismo JavaScript subjacente.

### `napi_run_script` {#napi_run_script}

**Adicionado em: v8.5.0**

**Versão N-API: 1**

```C [C]
NAPI_EXTERN napi_status napi_run_script(napi_env env,
                                        napi_value script,
                                        napi_value* result);
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] script`: Uma string JavaScript contendo o script a ser executado.
- `[out] result`: O valor resultante da execução do script.

Esta função executa uma string de código JavaScript e retorna seu resultado com as seguintes ressalvas:

- Ao contrário do `eval`, esta função não permite que o script acesse o escopo léxico atual e, portanto, também não permite o acesso ao [escopo do módulo](/pt/nodejs/api/modules#the-module-scope), o que significa que pseudo-globais como `require` não estarão disponíveis.
- O script pode acessar o [escopo global](/pt/nodejs/api/globals). Declarações de função e `var` no script serão adicionadas ao objeto [`global`](/pt/nodejs/api/globals#global). Declarações de variáveis feitas usando `let` e `const` serão visíveis globalmente, mas não serão adicionadas ao objeto [`global`](/pt/nodejs/api/globals#global).
- O valor de `this` é [`global`](/pt/nodejs/api/globals#global) dentro do script.

## Loop de eventos libuv {#libuv-event-loop}

Node-API fornece uma função para obter o loop de eventos atual associado a um `napi_env` específico.

### `napi_get_uv_event_loop` {#napi_get_uv_event_loop}

**Adicionado em: v9.3.0, v8.10.0**

**Versão N-API: 2**

```C [C]
NAPI_EXTERN napi_status napi_get_uv_event_loop(node_api_basic_env env,
                                               struct uv_loop_s** loop);
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[out] loop`: A instância atual do loop libuv.

Observação: embora o libuv tenha sido relativamente estável ao longo do tempo, ele não fornece uma garantia de estabilidade ABI. O uso desta função deve ser evitado. Seu uso pode resultar em um addon que não funciona em diferentes versões do Node.js. [chamadas de função assíncronas thread-safe](/pt/nodejs/api/n-api#asynchronous-thread-safe-function-calls) são uma alternativa para muitos casos de uso.


## Chamadas de função assíncronas thread-safe {#asynchronous-thread-safe-function-calls}

As funções JavaScript normalmente só podem ser chamadas a partir da thread principal de um addon nativo. Se um addon criar threads adicionais, as funções Node-API que requerem um `napi_env`, `napi_value` ou `napi_ref` não devem ser chamadas a partir dessas threads.

Quando um addon tem threads adicionais e as funções JavaScript precisam ser invocadas com base no processamento concluído por essas threads, essas threads devem se comunicar com a thread principal do addon para que a thread principal possa invocar a função JavaScript em seu nome. As APIs de função thread-safe fornecem uma maneira fácil de fazer isso.

Essas APIs fornecem o tipo `napi_threadsafe_function`, bem como APIs para criar, destruir e chamar objetos desse tipo. `napi_create_threadsafe_function()` cria uma referência persistente a um `napi_value` que contém uma função JavaScript que pode ser chamada de várias threads. As chamadas acontecem de forma assíncrona. Isso significa que os valores com os quais o callback JavaScript deve ser chamado serão colocados em uma fila e, para cada valor na fila, uma chamada será eventualmente feita para a função JavaScript.

Após a criação de um `napi_threadsafe_function`, um callback `napi_finalize` pode ser fornecido. Este callback será invocado na thread principal quando a função thread-safe estiver prestes a ser destruída. Ele recebe o contexto e os dados de finalização fornecidos durante a construção e oferece uma oportunidade para limpar após as threads, por exemplo, chamando `uv_thread_join()`. **Além da thread do loop principal, nenhuma thread deve estar usando a função thread-safe após a conclusão do callback de finalização.**

O `context` fornecido durante a chamada para `napi_create_threadsafe_function()` pode ser recuperado de qualquer thread com uma chamada para `napi_get_threadsafe_function_context()`.

### Chamando uma função thread-safe {#calling-a-thread-safe-function}

`napi_call_threadsafe_function()` pode ser usado para iniciar uma chamada para JavaScript. `napi_call_threadsafe_function()` aceita um parâmetro que controla se a API se comporta de forma bloqueante. Se definido como `napi_tsfn_nonblocking`, a API se comporta de forma não bloqueante, retornando `napi_queue_full` se a fila estiver cheia, impedindo que os dados sejam adicionados com sucesso à fila. Se definido como `napi_tsfn_blocking`, a API bloqueia até que haja espaço disponível na fila. `napi_call_threadsafe_function()` nunca bloqueia se a função thread-safe foi criada com um tamanho máximo de fila de 0.

`napi_call_threadsafe_function()` não deve ser chamado com `napi_tsfn_blocking` de uma thread JavaScript, porque, se a fila estiver cheia, pode causar um deadlock na thread JavaScript.

A chamada real para JavaScript é controlada pelo callback fornecido por meio do parâmetro `call_js_cb`. `call_js_cb` é invocado na thread principal uma vez para cada valor que foi colocado na fila por uma chamada bem-sucedida para `napi_call_threadsafe_function()`. Se tal callback não for fornecido, um callback padrão será usado e a chamada JavaScript resultante não terá argumentos. O callback `call_js_cb` recebe a função JavaScript para chamar como um `napi_value` em seus parâmetros, bem como o ponteiro de contexto `void*` usado ao criar o `napi_threadsafe_function` e o próximo ponteiro de dados que foi criado por uma das threads secundárias. O callback pode então usar uma API como `napi_call_function()` para chamar para JavaScript.

O callback também pode ser invocado com `env` e `call_js_cb` ambos definidos como `NULL` para indicar que as chamadas para JavaScript não são mais possíveis, enquanto itens permanecem na fila que podem precisar ser liberados. Isso normalmente ocorre quando o processo Node.js sai enquanto ainda há uma função thread-safe ativa.

Não é necessário chamar para JavaScript via `napi_make_callback()` porque Node-API executa `call_js_cb` em um contexto apropriado para callbacks.

Zero ou mais itens enfileirados podem ser invocados em cada tick do loop de eventos. Os aplicativos não devem depender de um comportamento específico além do progresso na invocação de callbacks e os eventos serão invocados à medida que o tempo avança.


### Contagem de Referência de Funções Thread-Safe {#reference-counting-of-thread-safe-functions}

Threads podem ser adicionadas e removidas de um objeto `napi_threadsafe_function` durante sua existência. Assim, além de especificar um número inicial de threads na criação, `napi_acquire_threadsafe_function` pode ser chamado para indicar que uma nova thread começará a usar a função thread-safe. Da mesma forma, `napi_release_threadsafe_function` pode ser chamado para indicar que uma thread existente deixará de usar a função thread-safe.

Objetos `napi_threadsafe_function` são destruídos quando cada thread que usa o objeto chamou `napi_release_threadsafe_function()` ou recebeu um status de retorno de `napi_closing` em resposta a uma chamada para `napi_call_threadsafe_function`. A fila é esvaziada antes que o `napi_threadsafe_function` seja destruído. `napi_release_threadsafe_function()` deve ser a última chamada de API feita em conjunto com um determinado `napi_threadsafe_function`, porque após a conclusão da chamada, não há garantia de que o `napi_threadsafe_function` ainda esteja alocado. Pelo mesmo motivo, não use uma função thread-safe após receber um valor de retorno de `napi_closing` em resposta a uma chamada para `napi_call_threadsafe_function`. Os dados associados ao `napi_threadsafe_function` podem ser liberados em seu callback `napi_finalize` que foi passado para `napi_create_threadsafe_function()`. O parâmetro `initial_thread_count` de `napi_create_threadsafe_function` marca o número inicial de aquisições das funções thread-safe, em vez de chamar `napi_acquire_threadsafe_function` várias vezes na criação.

Uma vez que o número de threads que usam um `napi_threadsafe_function` chega a zero, nenhuma outra thread pode começar a usá-lo chamando `napi_acquire_threadsafe_function()`. Na verdade, todas as chamadas de API subsequentes associadas a ele, exceto `napi_release_threadsafe_function()`, retornarão um valor de erro de `napi_closing`.

A função thread-safe pode ser "abortada" dando um valor de `napi_tsfn_abort` para `napi_release_threadsafe_function()`. Isso fará com que todas as APIs subsequentes associadas à função thread-safe, exceto `napi_release_threadsafe_function()`, retornem `napi_closing` mesmo antes que sua contagem de referência chegue a zero. Em particular, `napi_call_threadsafe_function()` retornará `napi_closing`, informando assim às threads que não é mais possível fazer chamadas assíncronas para a função thread-safe. Isso pode ser usado como um critério para encerrar a thread. **Ao receber um valor de retorno
de <code>napi_closing</code> de <code>napi_call_threadsafe_function()</code>, uma thread não deve mais usar
a função thread-safe, pois não há mais garantia de que ela
seja alocada.**


### Decidindo se o processo deve continuar em execução {#deciding-whether-to-keep-the-process-running}

Semelhante aos identificadores do libuv, as funções thread-safe podem ser "referenciadas" e "desreferenciadas". Uma função thread-safe "referenciada" fará com que o loop de eventos no thread no qual ela é criada permaneça ativo até que a função thread-safe seja destruída. Em contraste, uma função thread-safe "desreferenciada" não impedirá que o loop de eventos seja encerrado. As APIs `napi_ref_threadsafe_function` e `napi_unref_threadsafe_function` existem para esse propósito.

Nem `napi_unref_threadsafe_function` marca as funções thread-safe como capazes de serem destruídas, nem `napi_ref_threadsafe_function` impede que elas sejam destruídas.

### `napi_create_threadsafe_function` {#napi_create_threadsafe_function}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v12.6.0, v10.17.0 | Tornou o parâmetro `func` opcional com `call_js_cb` personalizado. |
| v10.6.0 | Adicionado em: v10.6.0 |
:::

**Versão N-API: 4**

```C [C]
NAPI_EXTERN napi_status
napi_create_threadsafe_function(napi_env env,
                                napi_value func,
                                napi_value async_resource,
                                napi_value async_resource_name,
                                size_t max_queue_size,
                                size_t initial_thread_count,
                                void* thread_finalize_data,
                                napi_finalize thread_finalize_cb,
                                void* context,
                                napi_threadsafe_function_call_js call_js_cb,
                                napi_threadsafe_function* result);
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] func`: Uma função JavaScript opcional para chamar de outro thread. Deve ser fornecido se `NULL` for passado para `call_js_cb`.
- `[in] async_resource`: Um objeto opcional associado ao trabalho assíncrono que será passado para possíveis hooks [`init` do async_hooks](/pt/nodejs/api/async_hooks#initasyncid-type-triggerasyncid-resource).
- `[in] async_resource_name`: Uma string JavaScript para fornecer um identificador para o tipo de recurso que está sendo fornecido para informações de diagnóstico expostas pela API `async_hooks`.
- `[in] max_queue_size`: Tamanho máximo da fila. `0` para nenhum limite.
- `[in] initial_thread_count`: O número inicial de aquisições, ou seja, o número inicial de threads, incluindo o thread principal, que farão uso desta função.
- `[in] thread_finalize_data`: Dados opcionais a serem passados para `thread_finalize_cb`.
- `[in] thread_finalize_cb`: Função opcional para chamar quando o `napi_threadsafe_function` está sendo destruído.
- `[in] context`: Dados opcionais para anexar ao `napi_threadsafe_function` resultante.
- `[in] call_js_cb`: Callback opcional que chama a função JavaScript em resposta a uma chamada em um thread diferente. Este callback será chamado no thread principal. Se não for fornecido, a função JavaScript será chamada sem parâmetros e com `undefined` como seu valor `this`. [`napi_threadsafe_function_call_js`](/pt/nodejs/api/n-api#napi_threadsafe_function_call_js) fornece mais detalhes.
- `[out] result`: A função JavaScript assíncrona thread-safe.

**Histórico de alterações:**

- Experimental (`NAPI_EXPERIMENTAL` é definido): Exceções não capturadas lançadas em `call_js_cb` são tratadas com o evento [`'uncaughtException'`](/pt/nodejs/api/process#event-uncaughtexception), em vez de serem ignoradas.


### `napi_get_threadsafe_function_context` {#napi_get_threadsafe_function_context}

**Adicionado em: v10.6.0**

**Versão da N-API: 4**

```C [C]
NAPI_EXTERN napi_status
napi_get_threadsafe_function_context(napi_threadsafe_function func,
                                     void** result);
```
- `[in] func`: A função thread-safe para a qual recuperar o contexto.
- `[out] result`: O local onde armazenar o contexto.

Esta API pode ser chamada a partir de qualquer thread que use `func`.

### `napi_call_threadsafe_function` {#napi_call_threadsafe_function}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v14.5.0 | O suporte para `napi_would_deadlock` foi revertido. |
| v14.1.0 | Retorna `napi_would_deadlock` quando chamado com `napi_tsfn_blocking` da thread principal ou de uma thread de worker e a fila está cheia. |
| v10.6.0 | Adicionado em: v10.6.0 |
:::

**Versão da N-API: 4**

```C [C]
NAPI_EXTERN napi_status
napi_call_threadsafe_function(napi_threadsafe_function func,
                              void* data,
                              napi_threadsafe_function_call_mode is_blocking);
```
- `[in] func`: A função JavaScript assíncrona thread-safe a ser invocada.
- `[in] data`: Dados para enviar para JavaScript através do callback `call_js_cb` fornecido durante a criação da função JavaScript thread-safe.
- `[in] is_blocking`: Flag cujo valor pode ser `napi_tsfn_blocking` para indicar que a chamada deve bloquear se a fila estiver cheia ou `napi_tsfn_nonblocking` para indicar que a chamada deve retornar imediatamente com um status de `napi_queue_full` sempre que a fila estiver cheia.

Esta API não deve ser chamada com `napi_tsfn_blocking` de uma thread JavaScript, porque, se a fila estiver cheia, pode causar um deadlock da thread JavaScript.

Esta API retornará `napi_closing` se `napi_release_threadsafe_function()` foi chamada com `abort` definido como `napi_tsfn_abort` de qualquer thread. O valor é adicionado à fila somente se a API retornar `napi_ok`.

Esta API pode ser chamada a partir de qualquer thread que use `func`.

### `napi_acquire_threadsafe_function` {#napi_acquire_threadsafe_function}

**Adicionado em: v10.6.0**

**Versão da N-API: 4**

```C [C]
NAPI_EXTERN napi_status
napi_acquire_threadsafe_function(napi_threadsafe_function func);
```
- `[in] func`: A função JavaScript assíncrona thread-safe para começar a usar.

Uma thread deve chamar esta API antes de passar `func` para qualquer outra API de função thread-safe para indicar que estará usando `func`. Isso impede que `func` seja destruída quando todas as outras threads pararem de usá-la.

Esta API pode ser chamada a partir de qualquer thread que começará a usar `func`.


### `napi_release_threadsafe_function` {#napi_release_threadsafe_function}

**Adicionado em: v10.6.0**

**Versão da N-API: 4**

```C [C]
NAPI_EXTERN napi_status
napi_release_threadsafe_function(napi_threadsafe_function func,
                                 napi_threadsafe_function_release_mode mode);
```
- `[in] func`: A função JavaScript assíncrona thread-safe cuja contagem de referência deve ser decrementada.
- `[in] mode`: Sinalizador cujo valor pode ser `napi_tsfn_release` para indicar que o thread atual não fará mais chamadas para a função thread-safe, ou `napi_tsfn_abort` para indicar que, além do thread atual, nenhum outro thread deve fazer mais chamadas para a função thread-safe. Se definido como `napi_tsfn_abort`, chamadas adicionais para `napi_call_threadsafe_function()` retornarão `napi_closing` e nenhum valor adicional será colocado na fila.

Um thread deve chamar esta API quando parar de usar `func`. Passar `func` para qualquer API thread-safe depois de ter chamado esta API tem resultados indefinidos, pois `func` pode ter sido destruída.

Esta API pode ser chamada de qualquer thread que irá parar de usar `func`.

### `napi_ref_threadsafe_function` {#napi_ref_threadsafe_function}

**Adicionado em: v10.6.0**

**Versão da N-API: 4**

```C [C]
NAPI_EXTERN napi_status
napi_ref_threadsafe_function(node_api_basic_env env, napi_threadsafe_function func);
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] func`: A função thread-safe a ser referenciada.

Esta API é usada para indicar que o loop de eventos em execução no thread principal não deve sair até que `func` seja destruída. Semelhante a [`uv_ref`](https://docs.libuv.org/en/v1.x/handle#c.uv_ref), também é idempotente.

Nem `napi_unref_threadsafe_function` marca as funções thread-safe como capazes de serem destruídas, nem `napi_ref_threadsafe_function` impede que sejam destruídas. `napi_acquire_threadsafe_function` e `napi_release_threadsafe_function` estão disponíveis para esse fim.

Esta API só pode ser chamada do thread principal.

### `napi_unref_threadsafe_function` {#napi_unref_threadsafe_function}

**Adicionado em: v10.6.0**

**Versão da N-API: 4**

```C [C]
NAPI_EXTERN napi_status
napi_unref_threadsafe_function(node_api_basic_env env, napi_threadsafe_function func);
```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[in] func`: A função thread-safe a ser não referenciada.

Esta API é usada para indicar que o loop de eventos em execução no thread principal pode sair antes que `func` seja destruída. Semelhante a [`uv_unref`](https://docs.libuv.org/en/v1.x/handle#c.uv_unref), também é idempotente.

Esta API só pode ser chamada do thread principal.


## Utilitários Diversos {#miscellaneous-utilities}

### `node_api_get_module_file_name` {#node_api_get_module_file_name}

**Adicionado em: v15.9.0, v14.18.0, v12.22.0**

**Versão N-API: 9**

```C [C]
NAPI_EXTERN napi_status
node_api_get_module_file_name(node_api_basic_env env, const char** result);

```
- `[in] env`: O ambiente sob o qual a API é invocada.
- `[out] result`: Um URL contendo o caminho absoluto do local de onde o complemento foi carregado. Para um arquivo no sistema de arquivos local, ele começará com `file://`. A string é terminada em nulo e pertence a `env` e, portanto, não deve ser modificada ou liberada.

`result` pode ser uma string vazia se o processo de carregamento do complemento não conseguir estabelecer o nome do arquivo do complemento durante o carregamento.

