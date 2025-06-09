---
title: Guia do Depurador Node.js
description: Um guia abrangente sobre como usar o depurador integrado no Node.js, detalhando comandos, uso e técnicas de depuração.
head:
  - - meta
    - name: og:title
      content: Guia do Depurador Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Um guia abrangente sobre como usar o depurador integrado no Node.js, detalhando comandos, uso e técnicas de depuração.
  - - meta
    - name: twitter:title
      content: Guia do Depurador Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Um guia abrangente sobre como usar o depurador integrado no Node.js, detalhando comandos, uso e técnicas de depuração.
---


# Depurador {#debugger}

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável
:::

O Node.js inclui um utilitário de depuração de linha de comando. O cliente de depuração do Node.js não é um depurador completo, mas é possível realizar inspeções e avanços simples.

Para usá-lo, inicie o Node.js com o argumento `inspect` seguido pelo caminho para o script a ser depurado.

```bash [BASH]
$ node inspect meuescript.js
< Depurador ouvindo em ws://127.0.0.1:9229/621111f9-ffcb-4e82-b718-48a145fa5db8
< Para obter ajuda, consulte: https://nodejs.org/en/docs/inspector
<
conectando a 127.0.0.1:9229 ... ok
< Depurador conectado.
<
 ok
Parar no início em meuescript.js:2
  1 // meuescript.js
> 2 global.x = 5;
  3 setTimeout(() => {
  4   debugger;
debug>
```
O depurador interrompe automaticamente na primeira linha executável. Para, em vez disso, executar até o primeiro ponto de interrupção (especificado por uma declaração [`debugger`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/debugger)), defina a variável de ambiente `NODE_INSPECT_RESUME_ON_START` como `1`.

```bash [BASH]
$ cat meuescript.js
// meuescript.js
global.x = 5;
setTimeout(() => {
  debugger;
  console.log('mundo');
}, 1000);
console.log('olá');
$ NODE_INSPECT_RESUME_ON_START=1 node inspect meuescript.js
< Depurador ouvindo em ws://127.0.0.1:9229/f1ed133e-7876-495b-83ae-c32c6fc319c2
< Para obter ajuda, consulte: https://nodejs.org/en/docs/inspector
<
conectando a 127.0.0.1:9229 ... ok
< Depurador conectado.
<
< olá
<
interromper em meuescript.js:4
  2 global.x = 5;
  3 setTimeout(() => {
> 4   debugger;
  5   console.log('mundo');
  6 }, 1000);
debug> next
interromper em meuescript.js:5
  3 setTimeout(() => {
  4   debugger;
> 5   console.log('mundo');
  6 }, 1000);
  7 console.log('olá');
debug> repl
Pressione Ctrl+C para sair do repl de depuração
> x
5
> 2 + 2
4
debug> next
< mundo
<
interromper em meuescript.js:6
  4   debugger;
  5   console.log('mundo');
> 6 }, 1000);
  7 console.log('olá');
  8
debug> .exit
$
```
O comando `repl` permite que o código seja avaliado remotamente. O comando `next` avança para a próxima linha. Digite `help` para ver quais outros comandos estão disponíveis.

Pressionar `enter` sem digitar um comando repetirá o comando de depuração anterior.


## Observadores (Watchers) {#watchers}

É possível observar os valores de expressões e variáveis durante a depuração. Em cada breakpoint, cada expressão da lista de observadores será avaliada no contexto atual e exibida imediatamente antes da listagem do código-fonte do breakpoint.

Para começar a observar uma expressão, digite `watch('minha_expressao')`. O comando `watchers` imprimirá os observadores ativos. Para remover um observador, digite `unwatch('minha_expressao')`.

## Referência de comandos {#command-reference}

### Passo a passo {#stepping}

- `cont`, `c`: Continuar a execução
- `next`, `n`: Próximo passo
- `step`, `s`: Entrar
- `out`, `o`: Sair
- `pause`: Pausar a execução do código (como o botão de pausa nas Ferramentas do Desenvolvedor)

### Breakpoints {#breakpoints}

- `setBreakpoint()`, `sb()`: Definir breakpoint na linha atual
- `setBreakpoint(linha)`, `sb(linha)`: Definir breakpoint em uma linha específica
- `setBreakpoint('fn()')`, `sb(...)`: Definir breakpoint na primeira instrução do corpo da função
- `setBreakpoint('script.js', 1)`, `sb(...)`: Definir breakpoint na primeira linha de `script.js`
- `setBreakpoint('script.js', 1, 'num \< 4')`, `sb(...)`: Definir breakpoint condicional na primeira linha de `script.js` que só interrompe quando `num \< 4` for avaliado como `true`
- `clearBreakpoint('script.js', 1)`, `cb(...)`: Limpar breakpoint em `script.js` na linha 1

Também é possível definir um breakpoint em um arquivo (módulo) que ainda não foi carregado:

```bash [BASH]
$ node inspect main.js
< Debugger listening on ws://127.0.0.1:9229/48a5b28a-550c-471b-b5e1-d13dd7165df9
< For help, see: https://nodejs.org/en/docs/inspector
<
connecting to 127.0.0.1:9229 ... ok
< Debugger attached.
<
Break on start in main.js:1
> 1 const mod = require('./mod.js');
  2 mod.hello();
  3 mod.hello();
debug> setBreakpoint('mod.js', 22)
Warning: script 'mod.js' was not loaded yet.
debug> c
break in mod.js:22
 20 // USE OR OTHER DEALINGS IN THE SOFTWARE.
 21
>22 exports.hello = function() {
 23   return 'hello from module';
 24 };
debug>
```
Também é possível definir um breakpoint condicional que só interrompe quando uma determinada expressão é avaliada como `true`:

```bash [BASH]
$ node inspect main.js
< Debugger listening on ws://127.0.0.1:9229/ce24daa8-3816-44d4-b8ab-8273c8a66d35
< For help, see: https://nodejs.org/en/docs/inspector
<
connecting to 127.0.0.1:9229 ... ok
< Debugger attached.
Break on start in main.js:7
  5 }
  6
> 7 addOne(10);
  8 addOne(-1);
  9
debug> setBreakpoint('main.js', 4, 'num < 0')
  1 'use strict';
  2
  3 function addOne(num) {
> 4   return num + 1;
  5 }
  6
  7 addOne(10);
  8 addOne(-1);
  9
debug> cont
break in main.js:4
  2
  3 function addOne(num) {
> 4   return num + 1;
  5 }
  6
debug> exec('num')
-1
debug>
```

### Informação {#information}

- `backtrace`, `bt`: Imprime o backtrace do frame de execução atual
- `list(5)`: Lista o código fonte do script com um contexto de 5 linhas (5 linhas antes e depois)
- `watch(expr)`: Adiciona uma expressão à lista de observação (watch list)
- `unwatch(expr)`: Remove uma expressão da lista de observação
- `unwatch(index)`: Remove uma expressão em um índice específico da lista de observação
- `watchers`: Lista todos os observadores (watchers) e seus valores (listados automaticamente em cada breakpoint)
- `repl`: Abre o repl do depurador para avaliação no contexto do script de depuração
- `exec expr`, `p expr`: Executa uma expressão no contexto do script de depuração e imprime seu valor
- `profile`: Inicia uma sessão de criação de perfil de CPU
- `profileEnd`: Interrompe a sessão atual de criação de perfil de CPU
- `profiles`: Lista todas as sessões de criação de perfil de CPU concluídas
- `profiles[n].save(filepath = 'node.cpuprofile')`: Salva a sessão de criação de perfil de CPU no disco como JSON
- `takeHeapSnapshot(filepath = 'node.heapsnapshot')`: Tira um snapshot de heap e salva no disco como JSON

### Controle de Execução {#execution-control}

- `run`: Executa o script (executado automaticamente na inicialização do depurador)
- `restart`: Reinicia o script
- `kill`: Interrompe o script

### Vários {#various}

- `scripts`: Lista todos os scripts carregados
- `version`: Exibe a versão do V8

## Uso Avançado {#advanced-usage}

### Integração do inspetor V8 para Node.js {#v8-inspector-integration-for-nodejs}

A integração do Inspetor V8 permite anexar o Chrome DevTools a instâncias do Node.js para depuração e criação de perfil. Ele usa o [Protocolo Chrome DevTools](https://chromedevtools.github.io/devtools-protocol/).

O Inspetor V8 pode ser ativado passando a flag `--inspect` ao iniciar uma aplicação Node.js. Também é possível fornecer uma porta customizada com essa flag, ex: `--inspect=9222` aceitará conexões DevTools na porta 9222.

Usar a flag `--inspect` executará o código imediatamente antes do depurador ser conectado. Isso significa que o código começará a ser executado antes que você possa começar a depurar, o que pode não ser ideal se você quiser depurar desde o começo.

Nesses casos, você tem duas alternativas:

Então, ao decidir entre `--inspect`, `--inspect-wait` e `--inspect-brk`, considere se você quer que o código comece a ser executado imediatamente, espere que o depurador seja anexado antes da execução ou pare na primeira linha para depuração passo a passo.

```bash [BASH]
$ node --inspect index.js
Debugger listening on ws://127.0.0.1:9229/dc9010dd-f8b8-4ac5-a510-c1a114ec7d29
For help, see: https://nodejs.org/en/docs/inspector
```
(No exemplo acima, o UUID dc9010dd-f8b8-4ac5-a510-c1a114ec7d29 no final da URL é gerado dinamicamente, ele varia em diferentes sessões de depuração.)

Se o navegador Chrome for mais antigo que 66.0.3345.0, use `inspector.html` em vez de `js_app.html` na URL acima.

O Chrome DevTools ainda não suporta depuração de [worker threads](/pt/nodejs/api/worker_threads). [ndb](https://github.com/GoogleChromeLabs/ndb/) pode ser usado para depurá-los.

