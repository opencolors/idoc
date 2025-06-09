---
title: API de Incorporação do Node.js
description: Saiba como incorporar o Node.js em aplicações C/C++, permitindo que os desenvolvedores utilizem o runtime JavaScript do Node.js dentro de suas aplicações nativas.
head:
  - - meta
    - name: og:title
      content: API de Incorporação do Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Saiba como incorporar o Node.js em aplicações C/C++, permitindo que os desenvolvedores utilizem o runtime JavaScript do Node.js dentro de suas aplicações nativas.
  - - meta
    - name: twitter:title
      content: API de Incorporação do Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Saiba como incorporar o Node.js em aplicações C/C++, permitindo que os desenvolvedores utilizem o runtime JavaScript do Node.js dentro de suas aplicações nativas.
---


# API C++ embedder {#c-embedder-api}

Node.js fornece uma série de APIs C++ que podem ser usadas para executar JavaScript em um ambiente Node.js a partir de outro software C++.

A documentação dessas APIs pode ser encontrada em [src/node.h](https://github.com/nodejs/node/blob/HEAD/src/node.h) na árvore de código fonte do Node.js. Além das APIs expostas pelo Node.js, alguns conceitos necessários são fornecidos pela API embedder do V8.

Como usar o Node.js como uma biblioteca embutida é diferente de escrever código que é executado pelo Node.js, as alterações interruptivas não seguem a política de [obsolescência](/pt/nodejs/api/deprecations) típica do Node.js e podem ocorrer em cada lançamento semver-major sem aviso prévio.

## Exemplo de aplicação de incorporação {#example-embedding-application}

As seções a seguir fornecerão uma visão geral sobre como usar essas APIs para criar um aplicativo do zero que executará o equivalente a `node -e \<code\>`, ou seja, que pegará um trecho de JavaScript e o executará em um ambiente específico do Node.js.

O código completo pode ser encontrado [na árvore de código fonte do Node.js](https://github.com/nodejs/node/blob/HEAD/test/embedding/embedtest.cc).

### Configurando um estado por processo {#setting-up-a-per-process-state}

O Node.js requer algum gerenciamento de estado por processo para ser executado:

- Análise de argumentos para [opções CLI](/pt/nodejs/api/cli) do Node.js,
- Requisitos por processo do V8, como uma instância `v8::Platform`.

O exemplo a seguir mostra como eles podem ser configurados. Alguns nomes de classe são dos namespaces C++ `node` e `v8`, respectivamente.

```C++ [C++]
int main(int argc, char** argv) {
  argv = uv_setup_args(argc, argv);
  std::vector<std::string> args(argv, argv + argc);
  // Analise as opções CLI do Node.js e imprima quaisquer erros que ocorreram ao
  // tentar analisá-las.
  std::unique_ptr<node::InitializationResult> result =
      node::InitializeOncePerProcess(args, {
        node::ProcessInitializationFlags::kNoInitializeV8,
        node::ProcessInitializationFlags::kNoInitializeNodeV8Platform
      });

  for (const std::string& error : result->errors())
    fprintf(stderr, "%s: %s\n", args[0].c_str(), error.c_str());
  if (result->early_return() != 0) {
    return result->exit_code();
  }

  // Crie uma instância v8::Platform. `MultiIsolatePlatform::Create()` é uma maneira
  // de criar uma instância v8::Platform que o Node.js pode usar ao criar
  // threads Worker. Quando nenhuma instância `MultiIsolatePlatform` está presente,
  // as threads Worker são desativadas.
  std::unique_ptr<MultiIsolatePlatform> platform =
      MultiIsolatePlatform::Create(4);
  V8::InitializePlatform(platform.get());
  V8::Initialize();

  // Veja abaixo o conteúdo desta função.
  int ret = RunNodeInstance(
      platform.get(), result->args(), result->exec_args());

  V8::Dispose();
  V8::DisposePlatform();

  node::TearDownOncePerProcess();
  return ret;
}
```

### Configurando um estado por instância {#setting-up-a-per-instance-state}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v15.0.0 | As utilidades `CommonEnvironmentSetup` e `SpinEventLoop` foram adicionadas. |
:::

Node.js tem um conceito de "instância Node.js", que é comumente referida como `node::Environment`. Cada `node::Environment` está associado a:

- Exatamente um `v8::Isolate`, ou seja, uma instância do Motor JS,
- Exatamente um `uv_loop_t`, ou seja, um loop de eventos,
- Um número de `v8::Context`s, mas exatamente um `v8::Context` principal, e
- Uma instância `node::IsolateData` que contém informações que podem ser compartilhadas por múltiplos `node::Environment`s. O incorporador deve garantir que `node::IsolateData` seja compartilhado apenas entre `node::Environment`s que usam o mesmo `v8::Isolate`, Node.js não realiza essa verificação.

Para configurar um `v8::Isolate`, um `v8::ArrayBuffer::Allocator` precisa ser fornecido. Uma escolha possível é o alocador padrão do Node.js, que pode ser criado através de `node::ArrayBufferAllocator::Create()`. Usar o alocador Node.js permite pequenas otimizações de desempenho quando addons usam a API C++ `Buffer` do Node.js, e é necessário para rastrear a memória `ArrayBuffer` em [`process.memoryUsage()`](/pt/nodejs/api/process#processmemoryusage).

Adicionalmente, cada `v8::Isolate` que é usado para uma instância Node.js precisa ser registrado e desregistrado com a instância `MultiIsolatePlatform`, se uma estiver sendo usada, para que a plataforma saiba qual loop de eventos usar para tarefas agendadas pelo `v8::Isolate`.

A função auxiliar `node::NewIsolate()` cria um `v8::Isolate`, o configura com alguns hooks específicos do Node.js (por exemplo, o manipulador de erros do Node.js) e o registra com a plataforma automaticamente.

```C++ [C++]
int RunNodeInstance(MultiIsolatePlatform* platform,
                    const std::vector<std::string>& args,
                    const std::vector<std::string>& exec_args) {
  int exit_code = 0;

  // Configura um loop de eventos libuv, v8::Isolate e Ambiente Node.js.
  std::vector<std::string> errors;
  std::unique_ptr<CommonEnvironmentSetup> setup =
      CommonEnvironmentSetup::Create(platform, &errors, args, exec_args);
  if (!setup) {
    for (const std::string& err : errors)
      fprintf(stderr, "%s: %s\n", args[0].c_str(), err.c_str());
    return 1;
  }

  Isolate* isolate = setup->isolate();
  Environment* env = setup->env();

  {
    Locker locker(isolate);
    Isolate::Scope isolate_scope(isolate);
    HandleScope handle_scope(isolate);
    // O v8::Context precisa ser inserido quando node::CreateEnvironment() e
    // node::LoadEnvironment() estão sendo chamados.
    Context::Scope context_scope(setup->context());

    // Configura a instância Node.js para execução e executa código dentro dela.
    // Existe também uma variante que recebe um callback e o fornece com
    // os objetos `require` e `process`, para que ele possa compilar manualmente
    // e executar scripts conforme necessário.
    // A função `require` dentro deste script *não* acessa o sistema de arquivos,
    // e só pode carregar módulos Node.js embutidos.
    // `module.createRequire()` está sendo usado para criar um que seja capaz de
    // carregar arquivos do disco, e usa o carregador de arquivos CommonJS padrão
    // em vez da função `require` apenas interna.
    MaybeLocal<Value> loadenv_ret = node::LoadEnvironment(
        env,
        "const publicRequire ="
        "  require('node:module').createRequire(process.cwd() + '/');"
        "globalThis.require = publicRequire;"
        "require('node:vm').runInThisContext(process.argv[1]);");

    if (loadenv_ret.IsEmpty())  // Houve uma exceção JS.
      return 1;

    exit_code = node::SpinEventLoop(env).FromMaybe(1);

    // node::Stop() pode ser usado para parar explicitamente o loop de eventos e impedir
    // que mais JavaScript seja executado. Pode ser chamado de qualquer thread,
    // e agirá como worker.terminate() se chamado de outra thread.
    node::Stop(env);
  }

  return exit_code;
}
```
