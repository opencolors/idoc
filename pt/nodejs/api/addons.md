---
title: Addons do Node.js
description: Aprenda como criar addons do Node.js usando C++ para expandir a funcionalidade das aplicações Node.js, incluindo exemplos e referências de API.
head:
  - - meta
    - name: og:title
      content: Addons do Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Aprenda como criar addons do Node.js usando C++ para expandir a funcionalidade das aplicações Node.js, incluindo exemplos e referências de API.
  - - meta
    - name: twitter:title
      content: Addons do Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Aprenda como criar addons do Node.js usando C++ para expandir a funcionalidade das aplicações Node.js, incluindo exemplos e referências de API.
---


# Addons C++ {#c-addons}

*Addons* são objetos compartilhados dinamicamente ligados escritos em C++. A função [`require()`](/pt/nodejs/api/modules#requireid) pode carregar addons como módulos Node.js comuns. Addons fornecem uma interface entre bibliotecas JavaScript e C/C++.

Existem três opções para implementar addons:

- Node-API
- `nan` ([Native Abstractions for Node.js](https://github.com/nodejs/nan))
- uso direto de bibliotecas internas V8, libuv e Node.js

A menos que haja necessidade de acesso direto a funcionalidades que não são expostas pela Node-API, use Node-API. Consulte [Addons C/C++ com Node-API](/pt/nodejs/api/n-api) para obter mais informações sobre Node-API.

Quando não se usa Node-API, implementar addons se torna mais complexo, exigindo conhecimento de múltiplos componentes e APIs:

- [V8](https://v8.dev/): a biblioteca C++ que Node.js usa para fornecer a implementação JavaScript. Ela fornece os mecanismos para criar objetos, chamar funções, etc. A API do V8 é documentada principalmente no arquivo de cabeçalho `v8.h` (`deps/v8/include/v8.h` na árvore de código-fonte do Node.js), e também está disponível [online](https://v8docs.nodesource.com/).
- [libuv](https://github.com/libuv/libuv): A biblioteca C que implementa o loop de eventos do Node.js, seus threads de trabalho e todos os comportamentos assíncronos da plataforma. Ela também serve como uma biblioteca de abstração multiplataforma, dando acesso fácil, semelhante ao POSIX, em todos os principais sistemas operacionais a muitas tarefas comuns do sistema, como interagir com o sistema de arquivos, sockets, temporizadores e eventos do sistema. libuv também fornece uma abstração de threading semelhante a threads POSIX para addons assíncronos mais sofisticados que precisam ir além do loop de eventos padrão. Os autores de addons devem evitar bloquear o loop de eventos com E/S ou outras tarefas demoradas, descarregando o trabalho via libuv para operações de sistema não bloqueantes, threads de trabalho ou um uso personalizado de threads libuv.
- Bibliotecas internas do Node.js: O próprio Node.js exporta APIs C++ que addons podem usar, a mais importante das quais é a classe `node::ObjectWrap`.
- Outras bibliotecas estaticamente ligadas (incluindo OpenSSL): Estas outras bibliotecas estão localizadas no diretório `deps/` na árvore de código-fonte do Node.js. Apenas os símbolos libuv, OpenSSL, V8 e zlib são propositalmente reexportados pelo Node.js e podem ser usados em várias extensões por addons. Consulte [Ligando a bibliotecas incluídas com Node.js](/pt/nodejs/api/addons#linking-to-libraries-included-with-nodejs) para obter informações adicionais.

Todos os exemplos a seguir estão disponíveis para [download](https://github.com/nodejs/node-addon-examples) e podem ser usados como ponto de partida para um addon.


## Olá mundo {#hello-world}

Este exemplo de "Olá mundo" é um addon simples, escrito em C++, que é o equivalente ao seguinte código JavaScript:

```js [ESM]
module.exports.hello = () => 'world';
```
Primeiro, crie o arquivo `hello.cc`:

```C++ [C++]
// hello.cc
#include <node.h>

namespace demo {

using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::NewStringType;
using v8::Object;
using v8::String;
using v8::Value;

void Method(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  args.GetReturnValue().Set(String::NewFromUtf8(
      isolate, "world", NewStringType::kNormal).ToLocalChecked());
}

void Initialize(Local<Object> exports) {
  NODE_SET_METHOD(exports, "hello", Method);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)

}  // namespace demo
```
Todos os addons do Node.js devem exportar uma função de inicialização seguindo o padrão:

```C++ [C++]
void Initialize(Local<Object> exports);
NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)
```
Não há ponto e vírgula após `NODE_MODULE`, pois não é uma função (veja `node.h`).

O `module_name` deve corresponder ao nome do arquivo do binário final (excluindo o sufixo `.node`).

No exemplo `hello.cc`, então, a função de inicialização é `Initialize` e o nome do módulo addon é `addon`.

Ao construir addons com `node-gyp`, usar a macro `NODE_GYP_MODULE_NAME` como o primeiro parâmetro de `NODE_MODULE()` garantirá que o nome do binário final seja passado para `NODE_MODULE()`.

Addons definidos com `NODE_MODULE()` não podem ser carregados em múltiplos contextos ou múltiplas threads ao mesmo tempo.

### Addons conscientes do contexto {#context-aware-addons}

Existem ambientes nos quais os addons do Node.js podem precisar ser carregados várias vezes em vários contextos. Por exemplo, o tempo de execução do [Electron](https://electronjs.org/) executa várias instâncias do Node.js em um único processo. Cada instância terá seu próprio cache `require()` e, portanto, cada instância precisará que um addon nativo se comporte corretamente quando carregado via `require()`. Isso significa que o addon deve suportar múltiplas inicializações.

Um addon consciente do contexto pode ser construído usando a macro `NODE_MODULE_INITIALIZER`, que se expande para o nome de uma função que o Node.js espera encontrar ao carregar um addon. Um addon pode, portanto, ser inicializado como no exemplo a seguir:

```C++ [C++]
using namespace v8;

extern "C" NODE_MODULE_EXPORT void
NODE_MODULE_INITIALIZER(Local<Object> exports,
                        Local<Value> module,
                        Local<Context> context) {
  /* Execute as etapas de inicialização do addon aqui. */
}
```
Outra opção é usar a macro `NODE_MODULE_INIT()`, que também construirá um addon consciente do contexto. Ao contrário de `NODE_MODULE()`, que é usado para construir um addon em torno de uma determinada função inicializadora de addon, `NODE_MODULE_INIT()` serve como a declaração de tal inicializador a ser seguido por um corpo de função.

As três variáveis a seguir podem ser usadas dentro do corpo da função após uma invocação de `NODE_MODULE_INIT()`:

- `Local\<Object\> exports`,
- `Local\<Value\> module` e
- `Local\<Context\> context`

Construir um addon consciente do contexto requer um gerenciamento cuidadoso de dados estáticos globais para garantir estabilidade e correção. Como o addon pode ser carregado várias vezes, potencialmente até mesmo de threads diferentes, todos os dados estáticos globais armazenados no addon devem ser protegidos adequadamente e não devem conter referências persistentes a objetos JavaScript. A razão para isso é que os objetos JavaScript são válidos apenas em um contexto e provavelmente causarão uma falha quando acessados ​​do contexto errado ou de uma thread diferente daquela em que foram criados.

O addon consciente do contexto pode ser estruturado para evitar dados estáticos globais executando as seguintes etapas:

- Defina uma classe que conterá dados por instância de addon e que possui um membro estático da forma
- Aloque na heap uma instância desta classe no inicializador do addon. Isso pode ser realizado usando a palavra-chave `new`.
- Chame `node::AddEnvironmentCleanupHook()`, passando a instância criada acima e um ponteiro para `DeleteInstance()`. Isso garantirá que a instância seja excluída quando o ambiente for destruído.
- Armazene a instância da classe em um `v8::External` e
- Passe o `v8::External` para todos os métodos expostos ao JavaScript, passando-o para `v8::FunctionTemplate::New()` ou `v8::Function::New()`, que cria as funções JavaScript com suporte nativo. O terceiro parâmetro de `v8::FunctionTemplate::New()` ou `v8::Function::New()` aceita o `v8::External` e o disponibiliza no callback nativo usando o método `v8::FunctionCallbackInfo::Data()`.

Isso garantirá que os dados por instância de addon cheguem a cada binding que pode ser chamado do JavaScript. Os dados por instância de addon também devem ser passados para qualquer callback assíncrono que o addon possa criar.

O exemplo a seguir ilustra a implementação de um addon consciente do contexto:

```C++ [C++]
#include <node.h>

using namespace v8;

class AddonData {
 public:
  explicit AddonData(Isolate* isolate):
      call_count(0) {
    // Garanta que esses dados por instância de addon sejam excluídos na limpeza do ambiente.
    node::AddEnvironmentCleanupHook(isolate, DeleteInstance, this);
  }

  // Dados por addon.
  int call_count;

  static void DeleteInstance(void* data) {
    delete static_cast<AddonData*>(data);
  }
};

static void Method(const v8::FunctionCallbackInfo<v8::Value>& info) {
  // Recupere os dados por instância de addon.
  AddonData* data =
      reinterpret_cast<AddonData*>(info.Data().As<External>()->Value());
  data->call_count++;
  info.GetReturnValue().Set((double)data->call_count);
}

// Inicialize este addon para ser consciente do contexto.
NODE_MODULE_INIT(/* exports, module, context */) {
  Isolate* isolate = context->GetIsolate();

  // Crie uma nova instância de `AddonData` para esta instância do addon e
  // vincule seu ciclo de vida ao do ambiente Node.js.
  AddonData* data = new AddonData(isolate);

  // Empacote os dados em um `v8::External` para que possamos passá-los para o método que
  // expomos.
  Local<External> external = External::New(isolate, data);

  // Exponha o método `Method` ao JavaScript e certifique-se de que ele receba o
  // dados por instância de addon que criamos acima, passando `external` como o
  // terceiro parâmetro para o construtor `FunctionTemplate`.
  exports->Set(context,
               String::NewFromUtf8(isolate, "method").ToLocalChecked(),
               FunctionTemplate::New(isolate, Method, external)
                  ->GetFunction(context).ToLocalChecked()).FromJust();
}
```

#### Suporte ao Worker {#worker-support}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v14.8.0, v12.19.0 | Os hooks de limpeza agora podem ser assíncronos. |
:::

Para ser carregado a partir de vários ambientes Node.js, como uma thread principal e uma thread Worker, um addon precisa:

- Ser um addon Node-API, ou
- Ser declarado como context-aware usando `NODE_MODULE_INIT()` conforme descrito acima

Para suportar threads [`Worker`](/pt/nodejs/api/worker_threads#class-worker), os addons precisam limpar quaisquer recursos que possam ter alocado quando tal thread for encerrada. Isso pode ser alcançado através do uso da função `AddEnvironmentCleanupHook()`:

```C++ [C++]
void AddEnvironmentCleanupHook(v8::Isolate* isolate,
                               void (*fun)(void* arg),
                               void* arg);
```
Esta função adiciona um hook que será executado antes que uma dada instância Node.js seja desligada. Se necessário, tais hooks podem ser removidos antes de serem executados usando `RemoveEnvironmentCleanupHook()`, que tem a mesma assinatura. Os callbacks são executados em ordem LIFO (last-in first-out).

Se necessário, existe um par adicional de sobrecargas `AddEnvironmentCleanupHook()` e `RemoveEnvironmentCleanupHook()`, onde o hook de limpeza recebe uma função de callback. Isso pode ser usado para desligar recursos assíncronos, como quaisquer handles libuv registrados pelo addon.

O seguinte `addon.cc` usa `AddEnvironmentCleanupHook()`:

```C++ [C++]
// addon.cc
#include <node.h>
#include <assert.h>
#include <stdlib.h>

using node::AddEnvironmentCleanupHook;
using v8::HandleScope;
using v8::Isolate;
using v8::Local;
using v8::Object;

// Note: In a real-world application, do not rely on static/global data.
static char cookie[] = "yum yum";
static int cleanup_cb1_called = 0;
static int cleanup_cb2_called = 0;

static void cleanup_cb1(void* arg) {
  Isolate* isolate = static_cast<Isolate*>(arg);
  HandleScope scope(isolate);
  Local<Object> obj = Object::New(isolate);
  assert(!obj.IsEmpty());  // assert VM is still alive
  assert(obj->IsObject());
  cleanup_cb1_called++;
}

static void cleanup_cb2(void* arg) {
  assert(arg == static_cast<void*>(cookie));
  cleanup_cb2_called++;
}

static void sanity_check(void*) {
  assert(cleanup_cb1_called == 1);
  assert(cleanup_cb2_called == 1);
}

// Initialize this addon to be context-aware.
NODE_MODULE_INIT(/* exports, module, context */) {
  Isolate* isolate = context->GetIsolate();

  AddEnvironmentCleanupHook(isolate, sanity_check, nullptr);
  AddEnvironmentCleanupHook(isolate, cleanup_cb2, cookie);
  AddEnvironmentCleanupHook(isolate, cleanup_cb1, isolate);
}
```
Teste em JavaScript executando:

```js [ESM]
// test.js
require('./build/Release/addon');
```

### Construindo {#building}

Uma vez que o código fonte foi escrito, ele deve ser compilado no arquivo binário `addon.node`. Para fazer isso, crie um arquivo chamado `binding.gyp` no nível superior do projeto, descrevendo a configuração de construção do módulo usando um formato semelhante a JSON. Este arquivo é usado pelo [node-gyp](https://github.com/nodejs/node-gyp), uma ferramenta escrita especificamente para compilar addons do Node.js.

```json [JSON]
{
  "targets": [
    {
      "target_name": "addon",
      "sources": [ "hello.cc" ]
    }
  ]
}
```
Uma versão do utilitário `node-gyp` é empacotada e distribuída com o Node.js como parte do `npm`. Esta versão não é disponibilizada diretamente para os desenvolvedores usarem e destina-se apenas a suportar a capacidade de usar o comando `npm install` para compilar e instalar addons. Os desenvolvedores que desejam usar o `node-gyp` diretamente podem instalá-lo usando o comando `npm install -g node-gyp`. Consulte as [instruções de instalação](https://github.com/nodejs/node-gyp#installation) do `node-gyp` para obter mais informações, incluindo os requisitos específicos da plataforma.

Depois que o arquivo `binding.gyp` for criado, use `node-gyp configure` para gerar os arquivos de construção de projeto apropriados para a plataforma atual. Isso gerará um `Makefile` (em plataformas Unix) ou um arquivo `vcxproj` (no Windows) no diretório `build/`.

Em seguida, invoque o comando `node-gyp build` para gerar o arquivo `addon.node` compilado. Isso será colocado no diretório `build/Release/`.

Ao usar `npm install` para instalar um addon do Node.js, o npm usa sua própria versão empacotada do `node-gyp` para executar o mesmo conjunto de ações, gerando uma versão compilada do addon para a plataforma do usuário sob demanda.

Uma vez construído, o addon binário pode ser usado dentro do Node.js apontando [`require()`](/pt/nodejs/api/modules#requireid) para o módulo `addon.node` construído:

```js [ESM]
// hello.js
const addon = require('./build/Release/addon');

console.log(addon.hello());
// Prints: 'world'
```
Como o caminho exato para o binário addon compilado pode variar dependendo de como ele é compilado (ou seja, às vezes pode estar em `./build/Debug/`), os addons podem usar o pacote [bindings](https://github.com/TooTallNate/node-bindings) para carregar o módulo compilado.

Embora a implementação do pacote `bindings` seja mais sofisticada na forma como localiza os módulos addon, ela está essencialmente usando um padrão `try…catch` semelhante a:

```js [ESM]
try {
  return require('./build/Release/addon.node');
} catch (err) {
  return require('./build/Debug/addon.node');
}
```

### Vinculando a bibliotecas incluídas no Node.js {#linking-to-libraries-included-with-nodejs}

O Node.js usa bibliotecas vinculadas estaticamente, como V8, libuv e OpenSSL. Todos os addons são obrigados a se vincular ao V8 e também podem se vincular a qualquer uma das outras dependências. Normalmente, isso é tão simples quanto incluir as instruções `#include \<...\>` apropriadas (por exemplo, `#include \<v8.h\>`) e o `node-gyp` localizará os cabeçalhos apropriados automaticamente. No entanto, há algumas ressalvas a serem observadas:

- Quando o `node-gyp` é executado, ele detecta a versão específica da versão do Node.js e baixa o tarball de origem completo ou apenas os cabeçalhos. Se a origem completa for baixada, os addons terão acesso completo ao conjunto completo de dependências do Node.js. No entanto, se apenas os cabeçalhos do Node.js forem baixados, apenas os símbolos exportados pelo Node.js estarão disponíveis.
- O `node-gyp` pode ser executado usando o sinalizador `--nodedir` apontando para uma imagem de origem do Node.js local. Usando esta opção, o addon terá acesso ao conjunto completo de dependências.

### Carregando addons usando `require()` {#loading-addons-using-require}

A extensão de nome de arquivo do binário de addon compilado é `.node` (em vez de `.dll` ou `.so`). A função [`require()`](/pt/nodejs/api/modules#requireid) é escrita para procurar arquivos com a extensão de arquivo `.node` e inicializá-los como bibliotecas vinculadas dinamicamente.

Ao chamar [`require()`](/pt/nodejs/api/modules#requireid), a extensão `.node` geralmente pode ser omitida e o Node.js ainda encontrará e inicializará o addon. Uma ressalva, no entanto, é que o Node.js primeiro tentará localizar e carregar módulos ou arquivos JavaScript que compartilham o mesmo nome base. Por exemplo, se houver um arquivo `addon.js` no mesmo diretório que o binário `addon.node`, então [`require('addon')`](/pt/nodejs/api/modules#requireid) dará precedência ao arquivo `addon.js` e o carregará em vez disso.

## Abstrações nativas para Node.js {#native-abstractions-for-nodejs}

Cada um dos exemplos ilustrados neste documento usa diretamente as APIs Node.js e V8 para implementar addons. A API V8 pode e mudou drasticamente de uma versão V8 para a outra (e de uma versão principal do Node.js para a próxima). A cada alteração, os addons podem precisar ser atualizados e recompilados para continuar funcionando. O cronograma de lançamento do Node.js foi projetado para minimizar a frequência e o impacto de tais alterações, mas há pouco que o Node.js pode fazer para garantir a estabilidade das APIs V8.

As [Abstrações Nativas para Node.js](https://github.com/nodejs/nan) (ou `nan`) fornecem um conjunto de ferramentas que os desenvolvedores de addon são recomendados a usar para manter a compatibilidade entre versões passadas e futuras do V8 e do Node.js. Consulte os [exemplos](https://github.com/nodejs/nan/tree/HEAD/examples/) `nan` para uma ilustração de como ele pode ser usado.


## Node-API {#node-api}

::: tip [Stable: 2 - Estável]
[Stable: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável
:::

Node-API é uma API para construir addons nativos. É independente do runtime JavaScript subjacente (por exemplo, V8) e é mantido como parte do próprio Node.js. Esta API será uma Interface Binária de Aplicação (ABI) estável entre as versões do Node.js. Destina-se a isolar addons de alterações no mecanismo JavaScript subjacente e permitir que módulos compilados para uma versão sejam executados em versões posteriores do Node.js sem recompilação. Os addons são construídos/empacotados com a mesma abordagem/ferramentas descritas neste documento (node-gyp, etc.). A única diferença é o conjunto de APIs que são usadas pelo código nativo. Em vez de usar as APIs V8 ou [Native Abstractions for Node.js](https://github.com/nodejs/nan), as funções disponíveis no Node-API são usadas.

Criar e manter um addon que se beneficie da estabilidade ABI fornecida pelo Node-API traz consigo certas [considerações de implementação](/pt/nodejs/api/n-api#implications-of-abi-stability).

Para usar o Node-API no exemplo de "Olá mundo" acima, substitua o conteúdo de `hello.cc` pelo seguinte. Todas as outras instruções permanecem as mesmas.

```C++ [C++]
// hello.cc usando Node-API
#include <node_api.h>

namespace demo {

napi_value Method(napi_env env, napi_callback_info args) {
  napi_value greeting;
  napi_status status;

  status = napi_create_string_utf8(env, "world", NAPI_AUTO_LENGTH, &greeting);
  if (status != napi_ok) return nullptr;
  return greeting;
}

napi_value init(napi_env env, napi_value exports) {
  napi_status status;
  napi_value fn;

  status = napi_create_function(env, nullptr, 0, Method, nullptr, &fn);
  if (status != napi_ok) return nullptr;

  status = napi_set_named_property(env, exports, "hello", fn);
  if (status != napi_ok) return nullptr;
  return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, init)

}  // namespace demo
```
As funções disponíveis e como usá-las são documentadas em [Addons C/C++ com Node-API](/pt/nodejs/api/n-api).


## Exemplos de Addons {#addon-examples}

A seguir, estão alguns exemplos de addons destinados a ajudar os desenvolvedores a começar. Os exemplos usam as APIs V8. Consulte a [referência V8](https://v8docs.nodesource.com/) online para obter ajuda com as várias chamadas V8 e o [Guia do Integrador](https://v8.dev/docs/embed) do V8 para obter uma explicação de vários conceitos usados, como manipuladores, escopos, modelos de função, etc.

Cada um desses exemplos usa o seguinte arquivo `binding.gyp`:

```json [JSON]
{
  "targets": [
    {
      "target_name": "addon",
      "sources": [ "addon.cc" ]
    }
  ]
}
```
Nos casos em que houver mais de um arquivo `.cc`, basta adicionar o nome do arquivo adicional ao array `sources`:

```json [JSON]
"sources": ["addon.cc", "myexample.cc"]
```
Depois que o arquivo `binding.gyp` estiver pronto, os addons de exemplo podem ser configurados e construídos usando `node-gyp`:

```bash [BASH]
node-gyp configure build
```
### Argumentos de função {#function-arguments}

Os addons normalmente expõem objetos e funções que podem ser acessados ​​a partir do JavaScript em execução no Node.js. Quando as funções são invocadas a partir do JavaScript, os argumentos de entrada e o valor de retorno devem ser mapeados para e do código C/C++.

O exemplo a seguir ilustra como ler os argumentos de função passados ​​do JavaScript e como retornar um resultado:

```C++ [C++]
// addon.cc
#include <node.h>

namespace demo {

using v8::Exception;
using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Number;
using v8::Object;
using v8::String;
using v8::Value;

// Esta é a implementação do método "add"
// Os argumentos de entrada são passados usando a
// struct const FunctionCallbackInfo<Value>& args
void Add(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  // Verifique o número de argumentos passados.
  if (args.Length() < 2) {
    // Lança um Erro que é passado de volta para JavaScript
    isolate->ThrowException(Exception::TypeError(
        String::NewFromUtf8(isolate,
                            "Wrong number of arguments").ToLocalChecked()));
    return;
  }

  // Verifique os tipos de argumento
  if (!args[0]->IsNumber() || !args[1]->IsNumber()) {
    isolate->ThrowException(Exception::TypeError(
        String::NewFromUtf8(isolate,
                            "Wrong arguments").ToLocalChecked()));
    return;
  }

  // Realize a operação
  double value =
      args[0].As<Number>()->Value() + args[1].As<Number>()->Value();
  Local<Number> num = Number::New(isolate, value);

  // Defina o valor de retorno (usando o passado em
  // FunctionCallbackInfo<Value>&)
  args.GetReturnValue().Set(num);
}

void Init(Local<Object> exports) {
  NODE_SET_METHOD(exports, "add", Add);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Init)

}  // namespace demo
```
Uma vez compilado, o addon de exemplo pode ser solicitado e usado de dentro do Node.js:

```js [ESM]
// test.js
const addon = require('./build/Release/addon');

console.log('This should be eight:', addon.add(3, 5));
```

### Callbacks {#callbacks}

É prática comum em addons passar funções JavaScript para uma função C++ e executá-las a partir daí. O exemplo a seguir ilustra como invocar tais callbacks:

```C++ [C++]
// addon.cc
#include <node.h>

namespace demo {

using v8::Context;
using v8::Function;
using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Null;
using v8::Object;
using v8::String;
using v8::Value;

void RunCallback(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();
  Local<Function> cb = Local<Function>::Cast(args[0]);
  const unsigned argc = 1;
  Local<Value> argv[argc] = {
      String::NewFromUtf8(isolate,
                          "hello world").ToLocalChecked() };
  cb->Call(context, Null(isolate), argc, argv).ToLocalChecked();
}

void Init(Local<Object> exports, Local<Object> module) {
  NODE_SET_METHOD(module, "exports", RunCallback);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Init)

}  // namespace demo
```
Este exemplo usa uma forma de dois argumentos de `Init()` que recebe o objeto `module` completo como o segundo argumento. Isso permite que o addon sobrescreva completamente `exports` com uma única função em vez de adicionar a função como uma propriedade de `exports`.

Para testá-lo, execute o seguinte JavaScript:

```js [ESM]
// test.js
const addon = require('./build/Release/addon');

addon((msg) => {
  console.log(msg);
// Imprime: 'hello world'
});
```
Neste exemplo, a função de callback é invocada sincronicamente.

### Fábrica de Objetos {#object-factory}

Os addons podem criar e retornar novos objetos de dentro de uma função C++, conforme ilustrado no exemplo a seguir. Um objeto é criado e retornado com uma propriedade `msg` que ecoa a string passada para `createObject()`:

```C++ [C++]
// addon.cc
#include <node.h>

namespace demo {

using v8::Context;
using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::String;
using v8::Value;

void CreateObject(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();

  Local<Object> obj = Object::New(isolate);
  obj->Set(context,
           String::NewFromUtf8(isolate,
                               "msg").ToLocalChecked(),
                               args[0]->ToString(context).ToLocalChecked())
           .FromJust();

  args.GetReturnValue().Set(obj);
}

void Init(Local<Object> exports, Local<Object> module) {
  NODE_SET_METHOD(module, "exports", CreateObject);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Init)

}  // namespace demo
```
Para testá-lo em JavaScript:

```js [ESM]
// test.js
const addon = require('./build/Release/addon');

const obj1 = addon('hello');
const obj2 = addon('world');
console.log(obj1.msg, obj2.msg);
// Imprime: 'hello world'
```

### Fábrica de Funções {#function-factory}

Outro cenário comum é criar funções JavaScript que envolvem funções C++ e retornar essas para o JavaScript:

```C++ [C++]
// addon.cc
#include <node.h>

namespace demo {

using v8::Context;
using v8::Function;
using v8::FunctionCallbackInfo;
using v8::FunctionTemplate;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::String;
using v8::Value;

void MyFunction(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  args.GetReturnValue().Set(String::NewFromUtf8(
      isolate, "hello world").ToLocalChecked());
}

void CreateFunction(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  Local<Context> context = isolate->GetCurrentContext();
  Local<FunctionTemplate> tpl = FunctionTemplate::New(isolate, MyFunction);
  Local<Function> fn = tpl->GetFunction(context).ToLocalChecked();

  // omit this to make it anonymous
  fn->SetName(String::NewFromUtf8(
      isolate, "theFunction").ToLocalChecked());

  args.GetReturnValue().Set(fn);
}

void Init(Local<Object> exports, Local<Object> module) {
  NODE_SET_METHOD(module, "exports", CreateFunction);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Init)

}  // namespace demo
```
Para testar:

```js [ESM]
// test.js
const addon = require('./build/Release/addon');

const fn = addon();
console.log(fn());
// Prints: 'hello world'
```
### Envolvendo objetos C++ {#wrapping-c-objects}

Também é possível envolver objetos/classes C++ de forma que permita que novas instâncias sejam criadas usando o operador JavaScript `new`:

```C++ [C++]
// addon.cc
#include <node.h>
#include "myobject.h"

namespace demo {

using v8::Local;
using v8::Object;

void InitAll(Local<Object> exports) {
  MyObject::Init(exports);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, InitAll)

}  // namespace demo
```
Então, em `myobject.h`, a classe wrapper herda de `node::ObjectWrap`:

```C++ [C++]
// myobject.h
#ifndef MYOBJECT_H
#define MYOBJECT_H

#include <node.h>
#include <node_object_wrap.h>

namespace demo {

class MyObject : public node::ObjectWrap {
 public:
  static void Init(v8::Local<v8::Object> exports);

 private:
  explicit MyObject(double value = 0);
  ~MyObject();

  static void New(const v8::FunctionCallbackInfo<v8::Value>& args);
  static void PlusOne(const v8::FunctionCallbackInfo<v8::Value>& args);

  double value_;
};

}  // namespace demo

#endif
```
Em `myobject.cc`, implemente os vários métodos que devem ser expostos. No código a seguir, o método `plusOne()` é exposto adicionando-o ao protótipo do construtor:

```C++ [C++]
// myobject.cc
#include "myobject.h"

namespace demo {

using v8::Context;
using v8::Function;
using v8::FunctionCallbackInfo;
using v8::FunctionTemplate;
using v8::Isolate;
using v8::Local;
using v8::Number;
using v8::Object;
using v8::ObjectTemplate;
using v8::String;
using v8::Value;

MyObject::MyObject(double value) : value_(value) {
}

MyObject::~MyObject() {
}

void MyObject::Init(Local<Object> exports) {
  Isolate* isolate = exports->GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();

  Local<ObjectTemplate> addon_data_tpl = ObjectTemplate::New(isolate);
  addon_data_tpl->SetInternalFieldCount(1);  // 1 field for the MyObject::New()
  Local<Object> addon_data =
      addon_data_tpl->NewInstance(context).ToLocalChecked();

  // Prepare constructor template
  Local<FunctionTemplate> tpl = FunctionTemplate::New(isolate, New, addon_data);
  tpl->SetClassName(String::NewFromUtf8(isolate, "MyObject").ToLocalChecked());
  tpl->InstanceTemplate()->SetInternalFieldCount(1);

  // Prototype
  NODE_SET_PROTOTYPE_METHOD(tpl, "plusOne", PlusOne);

  Local<Function> constructor = tpl->GetFunction(context).ToLocalChecked();
  addon_data->SetInternalField(0, constructor);
  exports->Set(context, String::NewFromUtf8(
      isolate, "MyObject").ToLocalChecked(),
      constructor).FromJust();
}

void MyObject::New(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();

  if (args.IsConstructCall()) {
    // Invoked as constructor: `new MyObject(...)`
    double value = args[0]->IsUndefined() ?
        0 : args[0]->NumberValue(context).FromMaybe(0);
    MyObject* obj = new MyObject(value);
    obj->Wrap(args.This());
    args.GetReturnValue().Set(args.This());
  } else {
    // Invoked as plain function `MyObject(...)`, turn into construct call.
    const int argc = 1;
    Local<Value> argv[argc] = { args[0] };
    Local<Function> cons =
        args.Data().As<Object>()->GetInternalField(0)
            .As<Value>().As<Function>();
    Local<Object> result =
        cons->NewInstance(context, argc, argv).ToLocalChecked();
    args.GetReturnValue().Set(result);
  }
}

void MyObject::PlusOne(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  MyObject* obj = ObjectWrap::Unwrap<MyObject>(args.This());
  obj->value_ += 1;

  args.GetReturnValue().Set(Number::New(isolate, obj->value_));
}

}  // namespace demo
```
Para construir este exemplo, o arquivo `myobject.cc` deve ser adicionado ao `binding.gyp`:

```json [JSON]
{
  "targets": [
    {
      "target_name": "addon",
      "sources": [
        "addon.cc",
        "myobject.cc"
      ]
    }
  ]
}
```
Teste com:

```js [ESM]
// test.js
const addon = require('./build/Release/addon');

const obj = new addon.MyObject(10);
console.log(obj.plusOne());
// Prints: 11
console.log(obj.plusOne());
// Prints: 12
console.log(obj.plusOne());
// Prints: 13
```
O destrutor para um objeto wrapper será executado quando o objeto for coletado pelo coletor de lixo. Para testes de destrutor, existem flags de linha de comando que podem ser usadas para tornar possível forçar a coleta de lixo. Essas flags são fornecidas pelo mecanismo JavaScript V8 subjacente. Elas estão sujeitas a alterações ou remoção a qualquer momento. Elas não são documentadas pelo Node.js ou V8 e nunca devem ser usadas fora dos testes.

Durante o encerramento do processo ou das threads de trabalho, os destrutores não são chamados pelo mecanismo JS. Portanto, é responsabilidade do usuário rastrear esses objetos e garantir a destruição adequada para evitar vazamentos de recursos.


### Fábrica de objetos encapsulados {#factory-of-wrapped-objects}

Alternativamente, é possível usar um padrão de fábrica para evitar a criação explícita de instâncias de objetos usando o operador `new` do JavaScript:

```js [ESM]
const obj = addon.createObject();
// em vez de:
// const obj = new addon.Object();
```
Primeiro, o método `createObject()` é implementado em `addon.cc`:

```C++ [C++]
// addon.cc
#include <node.h>
#include "myobject.h"

namespace demo {

using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::String;
using v8::Value;

void CreateObject(const FunctionCallbackInfo<Value>& args) {
  MyObject::NewInstance(args);
}

void InitAll(Local<Object> exports, Local<Object> module) {
  MyObject::Init(exports->GetIsolate());

  NODE_SET_METHOD(module, "exports", CreateObject);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, InitAll)

}  // namespace demo
```
Em `myobject.h`, o método estático `NewInstance()` é adicionado para lidar com a instanciação do objeto. Este método substitui o uso de `new` em JavaScript:

```C++ [C++]
// myobject.h
#ifndef MYOBJECT_H
#define MYOBJECT_H

#include <node.h>
#include <node_object_wrap.h>

namespace demo {

class MyObject : public node::ObjectWrap {
 public:
  static void Init(v8::Isolate* isolate);
  static void NewInstance(const v8::FunctionCallbackInfo<v8::Value>& args);

 private:
  explicit MyObject(double value = 0);
  ~MyObject();

  static void New(const v8::FunctionCallbackInfo<v8::Value>& args);
  static void PlusOne(const v8::FunctionCallbackInfo<v8::Value>& args);
  static v8::Global<v8::Function> constructor;
  double value_;
};

}  // namespace demo

#endif
```
A implementação em `myobject.cc` é semelhante ao exemplo anterior:

```C++ [C++]
// myobject.cc
#include <node.h>
#include "myobject.h"

namespace demo {

using node::AddEnvironmentCleanupHook;
using v8::Context;
using v8::Function;
using v8::FunctionCallbackInfo;
using v8::FunctionTemplate;
using v8::Global;
using v8::Isolate;
using v8::Local;
using v8::Number;
using v8::Object;
using v8::String;
using v8::Value;

// Warning! This is not thread-safe, this addon cannot be used for worker
// threads.
Global<Function> MyObject::constructor;

MyObject::MyObject(double value) : value_(value) {
}

MyObject::~MyObject() {
}

void MyObject::Init(Isolate* isolate) {
  // Prepare constructor template
  Local<FunctionTemplate> tpl = FunctionTemplate::New(isolate, New);
  tpl->SetClassName(String::NewFromUtf8(isolate, "MyObject").ToLocalChecked());
  tpl->InstanceTemplate()->SetInternalFieldCount(1);

  // Prototype
  NODE_SET_PROTOTYPE_METHOD(tpl, "plusOne", PlusOne);

  Local<Context> context = isolate->GetCurrentContext();
  constructor.Reset(isolate, tpl->GetFunction(context).ToLocalChecked());

  AddEnvironmentCleanupHook(isolate, [](void*) {
    constructor.Reset();
  }, nullptr);
}

void MyObject::New(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();

  if (args.IsConstructCall()) {
    // Invoked as constructor: `new MyObject(...)`
    double value = args[0]->IsUndefined() ?
        0 : args[0]->NumberValue(context).FromMaybe(0);
    MyObject* obj = new MyObject(value);
    obj->Wrap(args.This());
    args.GetReturnValue().Set(args.This());
  } else {
    // Invoked as plain function `MyObject(...)`, turn into construct call.
    const int argc = 1;
    Local<Value> argv[argc] = { args[0] };
    Local<Function> cons = Local<Function>::New(isolate, constructor);
    Local<Object> instance =
        cons->NewInstance(context, argc, argv).ToLocalChecked();
    args.GetReturnValue().Set(instance);
  }
}

void MyObject::NewInstance(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  const unsigned argc = 1;
  Local<Value> argv[argc] = { args[0] };
  Local<Function> cons = Local<Function>::New(isolate, constructor);
  Local<Context> context = isolate->GetCurrentContext();
  Local<Object> instance =
      cons->NewInstance(context, argc, argv).ToLocalChecked();

  args.GetReturnValue().Set(instance);
}

void MyObject::PlusOne(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  MyObject* obj = ObjectWrap::Unwrap<MyObject>(args.This());
  obj->value_ += 1;

  args.GetReturnValue().Set(Number::New(isolate, obj->value_));
}

}  // namespace demo
```
Mais uma vez, para construir este exemplo, o arquivo `myobject.cc` deve ser adicionado ao `binding.gyp`:

```json [JSON]
{
  "targets": [
    {
      "target_name": "addon",
      "sources": [
        "addon.cc",
        "myobject.cc"
      ]
    }
  ]
}
```
Teste com:

```js [ESM]
// test.js
const createObject = require('./build/Release/addon');

const obj = createObject(10);
console.log(obj.plusOne());
// Prints: 11
console.log(obj.plusOne());
// Prints: 12
console.log(obj.plusOne());
// Prints: 13

const obj2 = createObject(20);
console.log(obj2.plusOne());
// Prints: 21
console.log(obj2.plusOne());
// Prints: 22
console.log(obj2.plusOne());
// Prints: 23
```

### Passando objetos encapsulados {#passing-wrapped-objects-around}

Além de encapsular e retornar objetos C++, é possível passar objetos encapsulados desempacotando-os com a função auxiliar Node.js `node::ObjectWrap::Unwrap`. O exemplo a seguir mostra uma função `add()` que pode receber dois objetos `MyObject` como argumentos de entrada:

```C++ [C++]
// addon.cc
#include <node.h>
#include <node_object_wrap.h>
#include "myobject.h"

namespace demo {

using v8::Context;
using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Number;
using v8::Object;
using v8::String;
using v8::Value;

void CreateObject(const FunctionCallbackInfo<Value>& args) {
  MyObject::NewInstance(args);
}

void Add(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();

  MyObject* obj1 = node::ObjectWrap::Unwrap<MyObject>(
      args[0]->ToObject(context).ToLocalChecked());
  MyObject* obj2 = node::ObjectWrap::Unwrap<MyObject>(
      args[1]->ToObject(context).ToLocalChecked());

  double sum = obj1->value() + obj2->value();
  args.GetReturnValue().Set(Number::New(isolate, sum));
}

void InitAll(Local<Object> exports) {
  MyObject::Init(exports->GetIsolate());

  NODE_SET_METHOD(exports, "createObject", CreateObject);
  NODE_SET_METHOD(exports, "add", Add);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, InitAll)

}  // namespace demo
```
Em `myobject.h`, um novo método público é adicionado para permitir o acesso a valores privados após desembrulhar o objeto.

```C++ [C++]
// myobject.h
#ifndef MYOBJECT_H
#define MYOBJECT_H

#include <node.h>
#include <node_object_wrap.h>

namespace demo {

class MyObject : public node::ObjectWrap {
 public:
  static void Init(v8::Isolate* isolate);
  static void NewInstance(const v8::FunctionCallbackInfo<v8::Value>& args);
  inline double value() const { return value_; }

 private:
  explicit MyObject(double value = 0);
  ~MyObject();

  static void New(const v8::FunctionCallbackInfo<v8::Value>& args);
  static v8::Global<v8::Function> constructor;
  double value_;
};

}  // namespace demo

#endif
```
A implementação de `myobject.cc` permanece semelhante à versão anterior:

```C++ [C++]
// myobject.cc
#include <node.h>
#include "myobject.h"

namespace demo {

using node::AddEnvironmentCleanupHook;
using v8::Context;
using v8::Function;
using v8::FunctionCallbackInfo;
using v8::FunctionTemplate;
using v8::Global;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::String;
using v8::Value;

// Warning! This is not thread-safe, this addon cannot be used for worker
// threads.
Global<Function> MyObject::constructor;

MyObject::MyObject(double value) : value_(value) {
}

MyObject::~MyObject() {
}

void MyObject::Init(Isolate* isolate) {
  // Prepare constructor template
  Local<FunctionTemplate> tpl = FunctionTemplate::New(isolate, New);
  tpl->SetClassName(String::NewFromUtf8(isolate, "MyObject").ToLocalChecked());
  tpl->InstanceTemplate()->SetInternalFieldCount(1);

  Local<Context> context = isolate->GetCurrentContext();
  constructor.Reset(isolate, tpl->GetFunction(context).ToLocalChecked());

  AddEnvironmentCleanupHook(isolate, [](void*) {
    constructor.Reset();
  }, nullptr);
}

void MyObject::New(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();

  if (args.IsConstructCall()) {
    // Invoked as constructor: `new MyObject(...)`
    double value = args[0]->IsUndefined() ?
        0 : args[0]->NumberValue(context).FromMaybe(0);
    MyObject* obj = new MyObject(value);
    obj->Wrap(args.This());
    args.GetReturnValue().Set(args.This());
  } else {
    // Invoked as plain function `MyObject(...)`, turn into construct call.
    const int argc = 1;
    Local<Value> argv[argc] = { args[0] };
    Local<Function> cons = Local<Function>::New(isolate, constructor);
    Local<Object> instance =
        cons->NewInstance(context, argc, argv).ToLocalChecked();
    args.GetReturnValue().Set(instance);
  }
}

void MyObject::NewInstance(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  const unsigned argc = 1;
  Local<Value> argv[argc] = { args[0] };
  Local<Function> cons = Local<Function>::New(isolate, constructor);
  Local<Context> context = isolate->GetCurrentContext();
  Local<Object> instance =
      cons->NewInstance(context, argc, argv).ToLocalChecked();

  args.GetReturnValue().Set(instance);
}

}  // namespace demo
```
Teste com:

```js [ESM]
// test.js
const addon = require('./build/Release/addon');

const obj1 = addon.createObject(10);
const obj2 = addon.createObject(20);
const result = addon.add(obj1, obj2);

console.log(result);
// Prints: 30
```
