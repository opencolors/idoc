---
title: Documentação do Node.js - Processo Filho
description: A documentação do Node.js para o módulo de Processo Filho, detalhando como iniciar processos filhos, gerenciar seu ciclo de vida e lidar com a comunicação entre processos.
head:
  - - meta
    - name: og:title
      content: Documentação do Node.js - Processo Filho | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: A documentação do Node.js para o módulo de Processo Filho, detalhando como iniciar processos filhos, gerenciar seu ciclo de vida e lidar com a comunicação entre processos.
  - - meta
    - name: twitter:title
      content: Documentação do Node.js - Processo Filho | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: A documentação do Node.js para o módulo de Processo Filho, detalhando como iniciar processos filhos, gerenciar seu ciclo de vida e lidar com a comunicação entre processos.
---


# Processo filho {#child-process}

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável
:::

**Código Fonte:** [lib/child_process.js](https://github.com/nodejs/node/blob/v23.5.0/lib/child_process.js)

O módulo `node:child_process` fornece a capacidade de gerar subprocessos de uma maneira semelhante, mas não idêntica, a [`popen(3)`](http://man7.org/linux/man-pages/man3/popen.3). Essa capacidade é fornecida principalmente pela função [`child_process.spawn()`](/pt/nodejs/api/child_process#child_processspawncommand-args-options):

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
```

```js [ESM]
import { spawn } from 'node:child_process';
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
```
:::

Por padrão, pipes para `stdin`, `stdout` e `stderr` são estabelecidos entre o processo Node.js pai e o subprocesso gerado. Esses pipes têm capacidade limitada (e específica da plataforma). Se o subprocesso gravar no stdout além desse limite sem que a saída seja capturada, o subprocesso será bloqueado aguardando que o buffer do pipe aceite mais dados. Isso é idêntico ao comportamento dos pipes no shell. Use a opção `{ stdio: 'ignore' }` se a saída não for consumida.

A pesquisa de comando é realizada usando a variável de ambiente `options.env.PATH` se `env` estiver no objeto `options`. Caso contrário, `process.env.PATH` é usado. Se `options.env` for definido sem `PATH`, a pesquisa no Unix é realizada em um caminho de pesquisa padrão de `/usr/bin:/bin` (consulte o manual do seu sistema operacional para execvpe/execvp), no Windows a variável de ambiente `PATH` dos processos atuais é usada.

No Windows, as variáveis de ambiente não diferenciam maiúsculas de minúsculas. O Node.js classifica lexicograficamente as chaves `env` e usa a primeira que corresponda sem distinção entre maiúsculas e minúsculas. Apenas a primeira entrada (em ordem lexicográfica) será passada para o subprocesso. Isso pode levar a problemas no Windows ao passar objetos para a opção `env` que possuem várias variantes da mesma chave, como `PATH` e `Path`.

O método [`child_process.spawn()`](/pt/nodejs/api/child_process#child_processspawncommand-args-options) gera o processo filho de forma assíncrona, sem bloquear o loop de eventos do Node.js. A função [`child_process.spawnSync()`](/pt/nodejs/api/child_process#child_processspawnsynccommand-args-options) fornece funcionalidade equivalente de maneira síncrona que bloqueia o loop de eventos até que o processo gerado seja encerrado ou finalizado.

Para conveniência, o módulo `node:child_process` fornece algumas alternativas síncronas e assíncronas para [`child_process.spawn()`](/pt/nodejs/api/child_process#child_processspawncommand-args-options) e [`child_process.spawnSync()`](/pt/nodejs/api/child_process#child_processspawnsynccommand-args-options). Cada uma dessas alternativas é implementada sobre [`child_process.spawn()`](/pt/nodejs/api/child_process#child_processspawncommand-args-options) ou [`child_process.spawnSync()`](/pt/nodejs/api/child_process#child_processspawnsynccommand-args-options).

- [`child_process.exec()`](/pt/nodejs/api/child_process#child_processexeccommand-options-callback): gera um shell e executa um comando dentro desse shell, passando o `stdout` e `stderr` para uma função de callback quando concluído.
- [`child_process.execFile()`](/pt/nodejs/api/child_process#child_processexecfilefile-args-options-callback): semelhante a [`child_process.exec()`](/pt/nodejs/api/child_process#child_processexeccommand-options-callback), exceto que ele gera o comando diretamente sem primeiro gerar um shell por padrão.
- [`child_process.fork()`](/pt/nodejs/api/child_process#child_processforkmodulepath-args-options): gera um novo processo Node.js e invoca um módulo especificado com um canal de comunicação IPC estabelecido que permite o envio de mensagens entre pai e filho.
- [`child_process.execSync()`](/pt/nodejs/api/child_process#child_processexecsynccommand-options): uma versão síncrona de [`child_process.exec()`](/pt/nodejs/api/child_process#child_processexeccommand-options-callback) que bloqueará o loop de eventos do Node.js.
- [`child_process.execFileSync()`](/pt/nodejs/api/child_process#child_processexecfilesyncfile-args-options): uma versão síncrona de [`child_process.execFile()`](/pt/nodejs/api/child_process#child_processexecfilefile-args-options-callback) que bloqueará o loop de eventos do Node.js.

Para certos casos de uso, como automatizar scripts de shell, as [contrapartes síncronas](/pt/nodejs/api/child_process#synchronous-process-creation) podem ser mais convenientes. Em muitos casos, no entanto, os métodos síncronos podem ter um impacto significativo no desempenho devido à paralisação do loop de eventos enquanto os processos gerados são concluídos.


## Criação de processos assíncronos {#asynchronous-process-creation}

Os métodos [`child_process.spawn()`](/pt/nodejs/api/child_process#child_processspawncommand-args-options), [`child_process.fork()`](/pt/nodejs/api/child_process#child_processforkmodulepath-args-options), [`child_process.exec()`](/pt/nodejs/api/child_process#child_processexeccommand-options-callback) e [`child_process.execFile()`](/pt/nodejs/api/child_process#child_processexecfilefile-args-options-callback) seguem o padrão idiomático de programação assíncrona típico de outras APIs do Node.js.

Cada um dos métodos retorna uma instância de [`ChildProcess`](/pt/nodejs/api/child_process#class-childprocess). Esses objetos implementam a API [`EventEmitter`](/pt/nodejs/api/events#class-eventemitter) do Node.js, permitindo que o processo pai registre funções de ouvinte que são chamadas quando certos eventos ocorrem durante o ciclo de vida do processo filho.

Os métodos [`child_process.exec()`](/pt/nodejs/api/child_process#child_processexeccommand-options-callback) e [`child_process.execFile()`](/pt/nodejs/api/child_process#child_processexecfilefile-args-options-callback) também permitem que uma função de `callback` opcional seja especificada, a qual é invocada quando o processo filho é finalizado.

### Iniciando arquivos `.bat` e `.cmd` no Windows {#spawning-bat-and-cmd-files-on-windows}

A importância da distinção entre [`child_process.exec()`](/pt/nodejs/api/child_process#child_processexeccommand-options-callback) e [`child_process.execFile()`](/pt/nodejs/api/child_process#child_processexecfilefile-args-options-callback) pode variar com base na plataforma. Em sistemas operacionais do tipo Unix (Unix, Linux, macOS), [`child_process.execFile()`](/pt/nodejs/api/child_process#child_processexecfilefile-args-options-callback) pode ser mais eficiente porque não gera um shell por padrão. No Windows, no entanto, arquivos `.bat` e `.cmd` não são executáveis por conta própria sem um terminal e, portanto, não podem ser iniciados usando [`child_process.execFile()`](/pt/nodejs/api/child_process#child_processexecfilefile-args-options-callback). Ao executar no Windows, arquivos `.bat` e `.cmd` podem ser invocados usando [`child_process.spawn()`](/pt/nodejs/api/child_process#child_processspawncommand-args-options) com a opção `shell` definida, com [`child_process.exec()`](/pt/nodejs/api/child_process#child_processexeccommand-options-callback) ou gerando `cmd.exe` e passando o arquivo `.bat` ou `.cmd` como um argumento (que é o que a opção `shell` e [`child_process.exec()`](/pt/nodejs/api/child_process#child_processexeccommand-options-callback) fazem). Em qualquer caso, se o nome do arquivo de script contiver espaços, ele precisa ser citado.

::: code-group
```js [CJS]
// OU...
const { exec, spawn } = require('node:child_process');

exec('my.bat', (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(stdout);
});

// Script com espaços no nome do arquivo:
const bat = spawn('"my script.cmd"', ['a', 'b'], { shell: true });
// ou:
exec('"my script.cmd" a b', (err, stdout, stderr) => {
  // ...
});
```

```js [ESM]
// OU...
import { exec, spawn } from 'node:child_process';

exec('my.bat', (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(stdout);
});

// Script com espaços no nome do arquivo:
const bat = spawn('"my script.cmd"', ['a', 'b'], { shell: true });
// ou:
exec('"my script.cmd" a b', (err, stdout, stderr) => {
  // ...
});
```
:::


### `child_process.exec(command[, options][, callback])` {#child_processexeccommand-options-callback}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v15.4.0 | Suporte para AbortSignal foi adicionado. |
| v16.4.0, v14.18.0 | A opção `cwd` pode ser um objeto `URL` WHATWG usando o protocolo `file:`. |
| v8.8.0 | A opção `windowsHide` agora é suportada. |
| v0.1.90 | Adicionado em: v0.1.90 |
:::

- `command` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O comando para executar, com argumentos separados por espaço.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api) Diretório de trabalho atual do processo filho. **Padrão:** `process.cwd()`.
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Pares de chave-valor de ambiente. **Padrão:** `process.env`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Padrão:** `'utf8'`
    - `shell` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Shell para executar o comando com. Veja [Requisitos do Shell](/pt/nodejs/api/child_process#shell-requirements) e [Shell Padrão do Windows](/pt/nodejs/api/child_process#default-windows-shell). **Padrão:** `'/bin/sh'` no Unix, `process.env.ComSpec` no Windows.
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) permite abortar o processo filho usando um AbortSignal.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `0`
    - `maxBuffer` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Maior quantidade de dados em bytes permitida em stdout ou stderr. Se excedido, o processo filho é terminado e qualquer saída é truncada. Veja a ressalva em [`maxBuffer` e Unicode](/pt/nodejs/api/child_process#maxbuffer-and-unicode). **Padrão:** `1024 * 1024`.
    - `killSignal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `'SIGTERM'`
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Define a identidade do usuário do processo (veja [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2)).
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Define a identidade do grupo do processo (veja [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2)).
    - `windowsHide` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Oculta a janela do console do subprocesso que normalmente seria criada em sistemas Windows. **Padrão:** `false`.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) chamada com a saída quando o processo termina.
    - `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `stdout` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer)
    - `stderr` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer)
  
 
- Retorna: [\<ChildProcess\>](/pt/nodejs/api/child_process#class-childprocess)

Inicia um shell e então executa o `command` dentro desse shell, armazenando em buffer qualquer saída gerada. A string `command` passada para a função exec é processada diretamente pelo shell e caracteres especiais (variam dependendo do [shell](https://en.wikipedia.org/wiki/List_of_command-line_interpreters)) precisam ser tratados adequadamente:

::: code-group
```js [CJS]
const { exec } = require('node:child_process');

exec('"/path/to/test file/test.sh" arg1 arg2');
// As aspas duplas são usadas para que o espaço no caminho não seja interpretado como
// um delimitador de múltiplos argumentos.

exec('echo "The \\$HOME variable is $HOME"');
// A variável $HOME é escapada na primeira instância, mas não na segunda.
```

```js [ESM]
import { exec } from 'node:child_process';

exec('"/path/to/test file/test.sh" arg1 arg2');
// As aspas duplas são usadas para que o espaço no caminho não seja interpretado como
// um delimitador de múltiplos argumentos.

exec('echo "The \\$HOME variable is $HOME"');
// A variável $HOME é escapada na primeira instância, mas não na segunda.
```
:::

**Nunca passe entrada de usuário não tratada para esta função. Qualquer entrada contendo
metacaracteres do shell pode ser usada para acionar a execução arbitrária de comandos.**

Se uma função `callback` for fornecida, ela é chamada com os argumentos `(error, stdout, stderr)`. Em caso de sucesso, `error` será `null`. Em caso de erro, `error` será uma instância de [`Error`](/pt/nodejs/api/errors#class-error). A propriedade `error.code` será o código de saída do processo. Por convenção, qualquer código de saída diferente de `0` indica um erro. `error.signal` será o sinal que encerrou o processo.

Os argumentos `stdout` e `stderr` passados para o callback conterão a saída stdout e stderr do processo filho. Por padrão, o Node.js irá decodificar a saída como UTF-8 e passar strings para o callback. A opção `encoding` pode ser usada para especificar a codificação de caracteres usada para decodificar a saída stdout e stderr. Se `encoding` for `'buffer'`, ou uma codificação de caracteres não reconhecida, objetos `Buffer` serão passados para o callback.

::: code-group
```js [CJS]
const { exec } = require('node:child_process');
exec('cat *.js missing_file | wc -l', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});
```

```js [ESM]
import { exec } from 'node:child_process';
exec('cat *.js missing_file | wc -l', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});
```
:::

Se `timeout` for maior que `0`, o processo pai enviará o sinal identificado pela propriedade `killSignal` (o padrão é `'SIGTERM'`) se o processo filho for executado por mais de `timeout` milissegundos.

Ao contrário da chamada de sistema POSIX [`exec(3)`](http://man7.org/linux/man-pages/man3/exec.3), `child_process.exec()` não substitui o processo existente e usa um shell para executar o comando.

Se este método for invocado como sua versão [`util.promisify()`](/pt/nodejs/api/util#utilpromisifyoriginal)ed, ele retorna uma `Promise` para um `Object` com propriedades `stdout` e `stderr`. A instância `ChildProcess` retornada é anexada à `Promise` como uma propriedade `child`. No caso de um erro (incluindo qualquer erro que resulte em um código de saída diferente de 0), uma promessa rejeitada é retornada, com o mesmo objeto `error` fornecido no callback, mas com duas propriedades adicionais `stdout` e `stderr`.

::: code-group
```js [CJS]
const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

async function lsExample() {
  const { stdout, stderr } = await exec('ls');
  console.log('stdout:', stdout);
  console.error('stderr:', stderr);
}
lsExample();
```

```js [ESM]
import { promisify } from 'node:util';
import child_process from 'node:child_process';
const exec = promisify(child_process.exec);

async function lsExample() {
  const { stdout, stderr } = await exec('ls');
  console.log('stdout:', stdout);
  console.error('stderr:', stderr);
}
lsExample();
```
:::

Se a opção `signal` estiver habilitada, chamar `.abort()` no `AbortController` correspondente é semelhante a chamar `.kill()` no processo filho, exceto que o erro passado para o callback será um `AbortError`:

::: code-group
```js [CJS]
const { exec } = require('node:child_process');
const controller = new AbortController();
const { signal } = controller;
const child = exec('grep ssh', { signal }, (error) => {
  console.error(error); // an AbortError
});
controller.abort();
```

```js [ESM]
import { exec } from 'node:child_process';
const controller = new AbortController();
const { signal } = controller;
const child = exec('grep ssh', { signal }, (error) => {
  console.error(error); // an AbortError
});
controller.abort();
```
:::

### `child_process.execFile(file[, args][, options][, callback])` {#child_processexecfilefile-args-options-callback}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v16.4.0, v14.18.0 | A opção `cwd` pode ser um objeto `URL` WHATWG usando o protocolo `file:`. |
| v15.4.0, v14.17.0 | Suporte para AbortSignal foi adicionado. |
| v8.8.0 | A opção `windowsHide` agora é suportada. |
| v0.1.91 | Adicionado em: v0.1.91 |
:::

- `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O nome ou caminho do arquivo executável a ser executado.
- `args` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Lista de argumentos de string.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api) Diretório de trabalho atual do processo filho.
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Pares de chave-valor do ambiente. **Padrão:** `process.env`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) **Padrão:** `'utf8'`
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `0`
    - `maxBuffer` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Maior quantidade de dados em bytes permitida em stdout ou stderr. Se excedido, o processo filho é terminado e qualquer saída é truncada. Veja a ressalva em [`maxBuffer` e Unicode](/pt/nodejs/api/child_process#maxbuffer-and-unicode). **Padrão:** `1024 * 1024`.
    - `killSignal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) **Padrão:** `'SIGTERM'`
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Define a identidade do usuário do processo (veja [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2)).
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Define a identidade do grupo do processo (veja [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2)).
    - `windowsHide` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Oculta a janela do console do subprocesso que normalmente seria criada em sistemas Windows. **Padrão:** `false`.
    - `windowsVerbatimArguments` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Nenhuma citação ou escape de argumentos é feito no Windows. Ignorado no Unix. **Padrão:** `false`.
    - `shell` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Se `true`, executa `command` dentro de um shell. Usa `'/bin/sh'` no Unix e `process.env.ComSpec` no Windows. Um shell diferente pode ser especificado como uma string. Veja [Requisitos do Shell](/pt/nodejs/api/child_process#shell-requirements) e [Shell padrão do Windows](/pt/nodejs/api/child_process#default-windows-shell). **Padrão:** `false` (sem shell).
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) permite abortar o processo filho usando um AbortSignal.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Chamado com a saída quando o processo termina.
    - `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `stdout` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer)
    - `stderr` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer)


- Retorna: [\<ChildProcess\>](/pt/nodejs/api/child_process#class-childprocess)

A função `child_process.execFile()` é semelhante a [`child_process.exec()`](/pt/nodejs/api/child_process#child_processexeccommand-options-callback), exceto que não gera um shell por padrão. Em vez disso, o `file` executável especificado é gerado diretamente como um novo processo, tornando-o ligeiramente mais eficiente do que [`child_process.exec()`](/pt/nodejs/api/child_process#child_processexeccommand-options-callback).

As mesmas opções de [`child_process.exec()`](/pt/nodejs/api/child_process#child_processexeccommand-options-callback) são suportadas. Como um shell não é gerado, comportamentos como redirecionamento de E/S e globbing de arquivos não são suportados.



::: code-group
```js [CJS]
const { execFile } = require('node:child_process');
const child = execFile('node', ['--version'], (error, stdout, stderr) => {
  if (error) {
    throw error;
  }
  console.log(stdout);
});
```

```js [ESM]
import { execFile } from 'node:child_process';
const child = execFile('node', ['--version'], (error, stdout, stderr) => {
  if (error) {
    throw error;
  }
  console.log(stdout);
});
```
:::

Os argumentos `stdout` e `stderr` passados para o callback conterão a saída stdout e stderr do processo filho. Por padrão, o Node.js irá decodificar a saída como UTF-8 e passar strings para o callback. A opção `encoding` pode ser usada para especificar a codificação de caracteres usada para decodificar a saída stdout e stderr. Se `encoding` for `'buffer'`, ou uma codificação de caracteres não reconhecida, objetos `Buffer` serão passados para o callback em vez disso.

Se este método for invocado como sua versão [`util.promisify()`](/pt/nodejs/api/util#utilpromisifyoriginal)ed, ele retorna uma `Promise` para um `Object` com propriedades `stdout` e `stderr`. A instância `ChildProcess` retornada é anexada à `Promise` como uma propriedade `child`. Em caso de erro (incluindo qualquer erro resultante em um código de saída diferente de 0), uma promise rejeitada é retornada, com o mesmo objeto `error` fornecido no callback, mas com duas propriedades adicionais `stdout` e `stderr`.



::: code-group
```js [CJS]
const util = require('node:util');
const execFile = util.promisify(require('node:child_process').execFile);
async function getVersion() {
  const { stdout } = await execFile('node', ['--version']);
  console.log(stdout);
}
getVersion();
```

```js [ESM]
import { promisify } from 'node:util';
import child_process from 'node:child_process';
const execFile = promisify(child_process.execFile);
async function getVersion() {
  const { stdout } = await execFile('node', ['--version']);
  console.log(stdout);
}
getVersion();
```
:::

**Se a opção <code>shell</code> estiver habilitada, não passe entrada do usuário não sanitizada para esta
função. Qualquer entrada contendo metacaracteres de shell pode ser usada para acionar
execução de comando arbitrário.**

Se a opção `signal` estiver habilitada, chamar `.abort()` no `AbortController` correspondente é semelhante a chamar `.kill()` no processo filho, exceto que o erro passado para o callback será um `AbortError`:



::: code-group
```js [CJS]
const { execFile } = require('node:child_process');
const controller = new AbortController();
const { signal } = controller;
const child = execFile('node', ['--version'], { signal }, (error) => {
  console.error(error); // an AbortError
});
controller.abort();
```

```js [ESM]
import { execFile } from 'node:child_process';
const controller = new AbortController();
const { signal } = controller;
const child = execFile('node', ['--version'], { signal }, (error) => {
  console.error(error); // an AbortError
});
controller.abort();
```
:::

### `child_process.fork(modulePath[, args][, options])` {#child_processforkmodulepath-args-options}

::: info [Histórico]
| Versão   | Mudanças                                                                                                    |
| :------- | :---------------------------------------------------------------------------------------------------------- |
| v17.4.0, v16.14.0 | O parâmetro `modulePath` pode ser um objeto WHATWG `URL` usando o protocolo `file:`.                   |
| v16.4.0, v14.18.0 | A opção `cwd` pode ser um objeto WHATWG `URL` usando o protocolo `file:`.                               |
| v15.13.0, v14.18.0 | timeout foi adicionado.                                                                                   |
| v15.11.0, v14.18.0 | killSignal para AbortSignal foi adicionado.                                                                 |
| v15.6.0, v14.17.0 | O suporte ao AbortSignal foi adicionado.                                                                |
| v13.2.0, v12.16.0 | A opção `serialization` agora é suportada.                                                              |
| v8.0.0   | A opção `stdio` agora pode ser uma string.                                                                |
| v6.4.0   | A opção `stdio` agora é suportada.                                                                |
| v0.5.0   | Adicionado em: v0.5.0                                                                                       |
:::

- `modulePath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api) O módulo a ser executado no filho.
- `args` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Lista de argumentos de string.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api) Diretório de trabalho atual do processo filho.
    - `detached` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Prepara o processo filho para ser executado independentemente de seu processo pai. O comportamento específico depende da plataforma, consulte [`options.detached`](/pt/nodejs/api/child_process#optionsdetached)).
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Pares de chave-valor do ambiente. **Padrão:** `process.env`.
    - `execPath` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Executável usado para criar o processo filho.
    - `execArgv` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Lista de argumentos de string passados para o executável. **Padrão:** `process.execArgv`.
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Define a identidade do grupo do processo (consulte [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2)).
    - `serialization` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Especifica o tipo de serialização usado para enviar mensagens entre processos. Os valores possíveis são `'json'` e `'advanced'`. Consulte [Serialização avançada](/pt/nodejs/api/child_process#advanced-serialization) para obter mais detalhes. **Padrão:** `'json'`.
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) Permite fechar o processo filho usando um AbortSignal.
    - `killSignal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O valor do sinal a ser usado quando o processo gerado for morto por timeout ou sinal de aborto. **Padrão:** `'SIGTERM'`.
    - `silent` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, stdin, stdout e stderr do processo filho serão canalizados para o processo pai, caso contrário, eles serão herdados do processo pai, consulte as opções `'pipe'` e `'inherit'` para o [`child_process.spawn()`](/pt/nodejs/api/child_process#child_processspawncommand-args-options)'s [`stdio`](/pt/nodejs/api/child_process#optionsstdio) para obter mais detalhes. **Padrão:** `false`.
    - `stdio` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Consulte o [`stdio`](/pt/nodejs/api/child_process#optionsstdio) do [`child_process.spawn()`](/pt/nodejs/api/child_process#child_processspawncommand-args-options). Quando esta opção é fornecida, ela substitui `silent`. Se a variante de matriz for usada, ela deve conter exatamente um item com valor `'ipc'` ou um erro será lançado. Por exemplo, `[0, 1, 2, 'ipc']`.
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Define a identidade do usuário do processo (consulte [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2)).
    - `windowsVerbatimArguments` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Nenhuma citação ou escape de argumentos é feito no Windows. Ignorado no Unix. **Padrão:** `false`.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Em milissegundos, a quantidade máxima de tempo que o processo tem permissão para ser executado. **Padrão:** `undefined`.
  
 
- Retorna: [\<ChildProcess\>](/pt/nodejs/api/child_process#class-childprocess)

O método `child_process.fork()` é um caso especial de [`child_process.spawn()`](/pt/nodejs/api/child_process#child_processspawncommand-args-options) usado especificamente para gerar novos processos Node.js. Como [`child_process.spawn()`](/pt/nodejs/api/child_process#child_processspawncommand-args-options), um objeto [`ChildProcess`](/pt/nodejs/api/child_process#class-childprocess) é retornado. O [`ChildProcess`](/pt/nodejs/api/child_process#class-childprocess) retornado terá um canal de comunicação adicional integrado que permite que mensagens sejam passadas de um lado para o outro entre o pai e o filho. Consulte [`subprocess.send()`](/pt/nodejs/api/child_process#subprocesssendmessage-sendhandle-options-callback) para obter detalhes.

Lembre-se de que os processos filho do Node.js gerados são independentes do pai, com exceção do canal de comunicação IPC que é estabelecido entre os dois. Cada processo tem sua própria memória, com suas próprias instâncias do V8. Devido às alocações de recursos adicionais necessárias, não é recomendável gerar um grande número de processos filho do Node.js.

Por padrão, `child_process.fork()` gerará novas instâncias do Node.js usando o [`process.execPath`](/pt/nodejs/api/process#processexecpath) do processo pai. A propriedade `execPath` no objeto `options` permite que um caminho de execução alternativo seja usado.

Os processos Node.js iniciados com um `execPath` personalizado se comunicarão com o processo pai usando o descritor de arquivo (fd) identificado usando a variável de ambiente `NODE_CHANNEL_FD` no processo filho.

Ao contrário da chamada de sistema POSIX [`fork(2)`](http://man7.org/linux/man-pages/man2/fork.2), `child_process.fork()` não clona o processo atual.

A opção `shell` disponível em [`child_process.spawn()`](/pt/nodejs/api/child_process#child_processspawncommand-args-options) não é suportada por `child_process.fork()` e será ignorada se definida.

Se a opção `signal` estiver habilitada, chamar `.abort()` no `AbortController` correspondente é semelhante a chamar `.kill()` no processo filho, exceto que o erro passado para o callback será um `AbortError`:

::: code-group
```js [CJS]
const { fork } = require('node:child_process');
const process = require('node:process');

if (process.argv[2] === 'child') {
  setTimeout(() => {
    console.log(`Hello from ${process.argv[2]}!`);
  }, 1_000);
} else {
  const controller = new AbortController();
  const { signal } = controller;
  const child = fork(__filename, ['child'], { signal });
  child.on('error', (err) => {
    // This will be called with err being an AbortError if the controller aborts
  });
  controller.abort(); // Stops the child process
}
```

```js [ESM]
import { fork } from 'node:child_process';
import process from 'node:process';

if (process.argv[2] === 'child') {
  setTimeout(() => {
    console.log(`Hello from ${process.argv[2]}!`);
  }, 1_000);
} else {
  const controller = new AbortController();
  const { signal } = controller;
  const child = fork(import.meta.url, ['child'], { signal });
  child.on('error', (err) => {
    // This will be called with err being an AbortError if the controller aborts
  });
  controller.abort(); // Stops the child process
}
```
:::


### `child_process.spawn(command[, args][, options])` {#child_processspawncommand-args-options}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v16.4.0, v14.18.0 | A opção `cwd` pode ser um objeto WHATWG `URL` usando o protocolo `file:`. |
| v15.13.0, v14.18.0 | timeout foi adicionado. |
| v15.11.0, v14.18.0 | killSignal para AbortSignal foi adicionado. |
| v15.5.0, v14.17.0 | Suporte para AbortSignal foi adicionado. |
| v13.2.0, v12.16.0 | A opção `serialization` agora é suportada. |
| v8.8.0 | A opção `windowsHide` agora é suportada. |
| v6.4.0 | A opção `argv0` agora é suportada. |
| v5.7.0 | A opção `shell` agora é suportada. |
| v0.1.90 | Adicionado em: v0.1.90 |
:::

- `command` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O comando a ser executado.
- `args` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Lista de argumentos de string.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api) Diretório de trabalho atual do processo filho.
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Pares de chave-valor do ambiente. **Padrão:** `process.env`.
    - `argv0` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Define explicitamente o valor de `argv[0]` enviado ao processo filho. Isso será definido como `command` se não for especificado.
    - `stdio` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Configuração stdio do filho (ver [`options.stdio`](/pt/nodejs/api/child_process#optionsstdio)).
    - `detached` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Prepara o processo filho para ser executado independentemente de seu processo pai. O comportamento específico depende da plataforma, ver [`options.detached`](/pt/nodejs/api/child_process#optionsdetached)).
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Define a identidade do usuário do processo (ver [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2)).
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Define a identidade do grupo do processo (ver [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2)).
    - `serialization` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Especifica o tipo de serialização usado para enviar mensagens entre processos. Os valores possíveis são `'json'` e `'advanced'`. Ver [Serialização avançada](/pt/nodejs/api/child_process#advanced-serialization) para mais detalhes. **Padrão:** `'json'`.
    - `shell` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Se `true`, executa `command` dentro de um shell. Usa `'/bin/sh'` no Unix e `process.env.ComSpec` no Windows. Um shell diferente pode ser especificado como uma string. Ver [Requisitos do shell](/pt/nodejs/api/child_process#shell-requirements) e [Shell padrão do Windows](/pt/nodejs/api/child_process#default-windows-shell). **Padrão:** `false` (sem shell).
    - `windowsVerbatimArguments` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Nenhuma citação ou escape de argumentos é feito no Windows. Ignorado no Unix. Isso é definido como `true` automaticamente quando `shell` é especificado e é CMD. **Padrão:** `false`.
    - `windowsHide` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Oculta a janela do console do subprocesso que normalmente seria criada em sistemas Windows. **Padrão:** `false`.
    - `signal` [\<AbortSignal\>](/pt/nodejs/api/globals#class-abortsignal) permite abortar o processo filho usando um AbortSignal.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Em milissegundos, o tempo máximo que o processo pode ser executado. **Padrão:** `undefined`.
    - `killSignal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O valor do sinal a ser usado quando o processo gerado for eliminado por tempo limite ou sinal de aborto. **Padrão:** `'SIGTERM'`.

- Retorna: [\<ChildProcess\>](/pt/nodejs/api/child_process#class-childprocess)

O método `child_process.spawn()` gera um novo processo usando o `command` fornecido, com argumentos de linha de comando em `args`. Se omitido, `args` assume o padrão de um array vazio.

**Se a opção <code>shell</code> estiver ativada, não passe entrada de usuário não tratada para esta função. Qualquer entrada que contenha metacaracteres de shell pode ser usada para acionar a execução arbitrária de comandos.**

Um terceiro argumento pode ser usado para especificar opções adicionais, com estes padrões:

```js [ESM]
const defaults = {
  cwd: undefined,
  env: process.env,
};
```
Use `cwd` para especificar o diretório de trabalho do qual o processo é gerado. Se não for fornecido, o padrão é herdar o diretório de trabalho atual. Se fornecido, mas o caminho não existir, o processo filho emite um erro `ENOENT` e sai imediatamente. `ENOENT` também é emitido quando o comando não existe.

Use `env` para especificar variáveis de ambiente que estarão visíveis para o novo processo, o padrão é [`process.env`](/pt/nodejs/api/process#processenv).

Valores `undefined` em `env` serão ignorados.

Exemplo de execução de `ls -lh /usr`, capturando `stdout`, `stderr` e o código de saída:

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
```

```js [ESM]
import { spawn } from 'node:child_process';
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
```
:::

Exemplo: Uma maneira muito elaborada de executar `ps ax | grep ssh`

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const ps = spawn('ps', ['ax']);
const grep = spawn('grep', ['ssh']);

ps.stdout.on('data', (data) => {
  grep.stdin.write(data);
});

ps.stderr.on('data', (data) => {
  console.error(`ps stderr: ${data}`);
});

ps.on('close', (code) => {
  if (code !== 0) {
    console.log(`ps process exited with code ${code}`);
  }
  grep.stdin.end();
});

grep.stdout.on('data', (data) => {
  console.log(data.toString());
});

grep.stderr.on('data', (data) => {
  console.error(`grep stderr: ${data}`);
});

grep.on('close', (code) => {
  if (code !== 0) {
    console.log(`grep process exited with code ${code}`);
  }
});
```

```js [ESM]
import { spawn } from 'node:child_process';
const ps = spawn('ps', ['ax']);
const grep = spawn('grep', ['ssh']);

ps.stdout.on('data', (data) => {
  grep.stdin.write(data);
});

ps.stderr.on('data', (data) => {
  console.error(`ps stderr: ${data}`);
});

ps.on('close', (code) => {
  if (code !== 0) {
    console.log(`ps process exited with code ${code}`);
  }
  grep.stdin.end();
});

grep.stdout.on('data', (data) => {
  console.log(data.toString());
});

grep.stderr.on('data', (data) => {
  console.error(`grep stderr: ${data}`);
});

grep.on('close', (code) => {
  if (code !== 0) {
    console.log(`grep process exited with code ${code}`);
  }
});
```
:::

Exemplo de verificação de `spawn` falhado:

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const subprocess = spawn('bad_command');

subprocess.on('error', (err) => {
  console.error('Failed to start subprocess.');
});
```

```js [ESM]
import { spawn } from 'node:child_process';
const subprocess = spawn('bad_command');

subprocess.on('error', (err) => {
  console.error('Failed to start subprocess.');
});
```
:::

Certas plataformas (macOS, Linux) usarão o valor de `argv[0]` para o título do processo, enquanto outras (Windows, SunOS) usarão `command`.

O Node.js sobrescreve `argv[0]` com `process.execPath` na inicialização, portanto, `process.argv[0]` em um processo filho do Node.js não corresponderá ao parâmetro `argv0` passado para `spawn` do pai. Recupere-o com a propriedade `process.argv0`.

Se a opção `signal` estiver ativada, chamar `.abort()` no `AbortController` correspondente é semelhante a chamar `.kill()` no processo filho, exceto que o erro passado para o callback será um `AbortError`:

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const controller = new AbortController();
const { signal } = controller;
const grep = spawn('grep', ['ssh'], { signal });
grep.on('error', (err) => {
  // This will be called with err being an AbortError if the controller aborts
});
controller.abort(); // Stops the child process
```

```js [ESM]
import { spawn } from 'node:child_process';
const controller = new AbortController();
const { signal } = controller;
const grep = spawn('grep', ['ssh'], { signal });
grep.on('error', (err) => {
  // This will be called with err being an AbortError if the controller aborts
});
controller.abort(); // Stops the child process
```
:::


#### `options.detached` {#optionsdetached}

**Adicionado em: v0.7.10**

No Windows, definir `options.detached` como `true` permite que o processo filho continue a ser executado após a saída do processo pai. O processo filho terá sua própria janela de console. Uma vez habilitado para um processo filho, não pode ser desabilitado.

Em plataformas não Windows, se `options.detached` for definido como `true`, o processo filho será transformado no líder de um novo grupo de processos e sessão. Processos filhos podem continuar sendo executados após a saída do pai, independentemente de estarem separados ou não. Veja [`setsid(2)`](http://man7.org/linux/man-pages/man2/setsid.2) para mais informações.

Por padrão, o pai esperará que o processo filho separado saia. Para impedir que o processo pai espere que um determinado `subprocess` saia, use o método `subprocess.unref()`. Fazer isso fará com que o loop de eventos do processo pai não inclua o processo filho em sua contagem de referência, permitindo que o processo pai saia independentemente do processo filho, a menos que haja um canal IPC estabelecido entre os processos filho e pai.

Ao usar a opção `detached` para iniciar um processo de longa duração, o processo não permanecerá em execução em segundo plano após a saída do pai, a menos que seja fornecida uma configuração `stdio` que não esteja conectada ao pai. Se o `stdio` do processo pai for herdado, o processo filho permanecerá anexado ao terminal de controle.

Exemplo de um processo de longa duração, separando e também ignorando seus descritores de arquivo `stdio` pai, para ignorar o término do pai:

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const process = require('node:process');

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
```

```js [ESM]
import { spawn } from 'node:child_process';
import process from 'node:process';

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
```
:::

Alternativamente, pode-se redirecionar a saída do processo filho para arquivos:

::: code-group
```js [CJS]
const { openSync } = require('node:fs');
const { spawn } = require('node:child_process');
const out = openSync('./out.log', 'a');
const err = openSync('./out.log', 'a');

const subprocess = spawn('prg', [], {
  detached: true,
  stdio: [ 'ignore', out, err ],
});

subprocess.unref();
```

```js [ESM]
import { openSync } from 'node:fs';
import { spawn } from 'node:child_process';
const out = openSync('./out.log', 'a');
const err = openSync('./out.log', 'a');

const subprocess = spawn('prg', [], {
  detached: true,
  stdio: [ 'ignore', out, err ],
});

subprocess.unref();
```
:::


#### `options.stdio` {#optionsstdio}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v15.6.0, v14.18.0 | Adicionada a flag `overlapped` para stdio. |
| v3.3.1 | O valor `0` agora é aceito como um descritor de arquivo. |
| v0.7.10 | Adicionado em: v0.7.10 |
:::

A opção `options.stdio` é usada para configurar os pipes que são estabelecidos entre o processo pai e o processo filho. Por padrão, o stdin, stdout e stderr do filho são redirecionados para os streams correspondentes [`subprocess.stdin`](/pt/nodejs/api/child_process#subprocessstdin), [`subprocess.stdout`](/pt/nodejs/api/child_process#subprocessstdout) e [`subprocess.stderr`](/pt/nodejs/api/child_process#subprocessstderr) no objeto [`ChildProcess`](/pt/nodejs/api/child_process#class-childprocess). Isso é equivalente a definir `options.stdio` como `['pipe', 'pipe', 'pipe']`.

Para conveniência, `options.stdio` pode ser uma das seguintes strings:

- `'pipe'`: equivalente a `['pipe', 'pipe', 'pipe']` (o padrão)
- `'overlapped'`: equivalente a `['overlapped', 'overlapped', 'overlapped']`
- `'ignore'`: equivalente a `['ignore', 'ignore', 'ignore']`
- `'inherit'`: equivalente a `['inherit', 'inherit', 'inherit']` ou `[0, 1, 2]`

Caso contrário, o valor de `options.stdio` é um array onde cada índice corresponde a um fd no filho. Os fds 0, 1 e 2 correspondem a stdin, stdout e stderr, respectivamente. Fds adicionais podem ser especificados para criar pipes adicionais entre o pai e o filho. O valor é um dos seguintes:

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const process = require('node:process');

// Filho usará os stdios do pai.
spawn('prg', [], { stdio: 'inherit' });

// Iniciar filho compartilhando apenas stderr.
spawn('prg', [], { stdio: ['pipe', 'pipe', process.stderr] });

// Abra um fd=4 extra para interagir com programas que apresentam uma
// interface estilo startd.
spawn('prg', [], { stdio: ['pipe', null, null, null, 'pipe'] });
```

```js [ESM]
import { spawn } from 'node:child_process';
import process from 'node:process';

// Filho usará os stdios do pai.
spawn('prg', [], { stdio: 'inherit' });

// Iniciar filho compartilhando apenas stderr.
spawn('prg', [], { stdio: ['pipe', 'pipe', process.stderr] });

// Abra um fd=4 extra para interagir com programas que apresentam uma
// interface estilo startd.
spawn('prg', [], { stdio: ['pipe', null, null, null, 'pipe'] });
```
:::

*Vale a pena notar que, quando um canal IPC é estabelecido entre os processos pai e filho, e o processo filho é uma instância do Node.js, o processo filho é iniciado com o canal IPC não referenciado (usando <code>unref()</code>) até que o processo filho registre um manipulador de eventos para o evento <a href="process.html#event-disconnect"><code>'disconnect'</code></a> ou o evento <a href="process.html#event-message"><code>'message'</code></a>. Isso permite que o processo filho saia normalmente sem que o processo seja mantido aberto pelo canal IPC aberto.* Veja também: [`child_process.exec()`](/pt/nodejs/api/child_process#child_processexeccommand-options-callback) e [`child_process.fork()`](/pt/nodejs/api/child_process#child_processforkmodulepath-args-options).


## Criação de processos síncronos {#synchronous-process-creation}

Os métodos [`child_process.spawnSync()`](/pt/nodejs/api/child_process#child_processspawnsynccommand-args-options), [`child_process.execSync()`](/pt/nodejs/api/child_process#child_processexecsynccommand-options) e [`child_process.execFileSync()`](/pt/nodejs/api/child_process#child_processexecfilesyncfile-args-options) são síncronos e bloquearão o loop de eventos do Node.js, pausando a execução de qualquer código adicional até que o processo gerado seja encerrado.

Chamadas de bloqueio como estas são mais úteis para simplificar tarefas gerais de script e para simplificar o carregamento/processamento da configuração do aplicativo na inicialização.

### `child_process.execFileSync(file[, args][, options])` {#child_processexecfilesyncfile-args-options}


::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v16.4.0, v14.18.0 | A opção `cwd` pode ser um objeto WHATWG `URL` usando o protocolo `file:`. |
| v10.10.0 | A opção `input` agora pode ser qualquer `TypedArray` ou `DataView`. |
| v8.8.0 | A opção `windowsHide` agora é suportada. |
| v8.0.0 | A opção `input` agora pode ser um `Uint8Array`. |
| v6.2.1, v4.5.0 | A opção `encoding` agora pode ser definida explicitamente para `buffer`. |
| v0.11.12 | Adicionado em: v0.11.12 |
:::

- `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O nome ou caminho do arquivo executável a ser executado.
- `args` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Lista de argumentos de string.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api) Diretório de trabalho atual do processo filho.
    - `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) O valor que será passado como stdin para o processo gerado. Se `stdio[0]` for definido como `'pipe'`, o fornecimento deste valor substituirá `stdio[0]`.
    - `stdio` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Configuração do stdio do filho. Veja o [`stdio`](/pt/nodejs/api/child_process#optionsstdio) de [`child_process.spawn()`](/pt/nodejs/api/child_process#child_processspawncommand-args-options). `stderr` por padrão será saída para o stderr do processo pai, a menos que `stdio` seja especificado. **Padrão:** `'pipe'`.
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Pares de valores-chave de ambiente. **Padrão:** `process.env`.
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Define a identidade do usuário do processo (veja [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2)).
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Define a identidade do grupo do processo (veja [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2)).
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Em milissegundos, o tempo máximo que o processo pode ser executado. **Padrão:** `undefined`.
    - `killSignal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O valor do sinal a ser usado quando o processo gerado for morto. **Padrão:** `'SIGTERM'`.
    - `maxBuffer` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Maior quantidade de dados em bytes permitidos em stdout ou stderr. Se excedido, o processo filho é encerrado. Veja a ressalva em [`maxBuffer` e Unicode](/pt/nodejs/api/child_process#maxbuffer-and-unicode). **Padrão:** `1024 * 1024`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A codificação usada para todas as entradas e saídas stdio. **Padrão:** `'buffer'`.
    - `windowsHide` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Oculta a janela do console do subprocesso que normalmente seria criada em sistemas Windows. **Padrão:** `false`.
    - `shell` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Se `true`, executa `command` dentro de um shell. Usa `'/bin/sh'` no Unix e `process.env.ComSpec` no Windows. Um shell diferente pode ser especificado como uma string. Veja [Requisitos do Shell](/pt/nodejs/api/child_process#shell-requirements) e [Shell padrão do Windows](/pt/nodejs/api/child_process#default-windows-shell). **Padrão:** `false` (sem shell).
  
 
- Retorna: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O stdout do comando.

O método `child_process.execFileSync()` é geralmente idêntico a [`child_process.execFile()`](/pt/nodejs/api/child_process#child_processexecfilefile-args-options-callback) com a exceção de que o método não retornará até que o processo filho tenha sido totalmente fechado. Quando um tempo limite é encontrado e `killSignal` é enviado, o método não retornará até que o processo tenha saído completamente.

Se o processo filho interceptar e manipular o sinal `SIGTERM` e não sair, o processo pai ainda esperará até que o processo filho tenha saído.

Se o processo atingir o tempo limite ou tiver um código de saída diferente de zero, este método lançará um [`Error`](/pt/nodejs/api/errors#class-error) que incluirá o resultado completo do [`child_process.spawnSync()`](/pt/nodejs/api/child_process#child_processspawnsynccommand-args-options) subjacente.

**Se a opção <code>shell</code> estiver habilitada, não passe entrada de usuário não higienizada para esta
função. Qualquer entrada que contenha metacaracteres de shell pode ser usada para acionar
a execução arbitrária de comandos.**



::: code-group
```js [CJS]
const { execFileSync } = require('node:child_process');

try {
  const stdout = execFileSync('my-script.sh', ['my-arg'], {
    // Captura stdout e stderr do processo filho. Substitui o
    // comportamento padrão de streaming de stderr filho para o stderr pai
    stdio: 'pipe',

    // Usa codificação utf8 para pipes stdio
    encoding: 'utf8',
  });

  console.log(stdout);
} catch (err) {
  if (err.code) {
    // Falha ao gerar processo filho
    console.error(err.code);
  } else {
    // Filho foi gerado, mas saiu com código de saída diferente de zero
    // O erro contém qualquer stdout e stderr do filho
    const { stdout, stderr } = err;

    console.error({ stdout, stderr });
  }
}
```

```js [ESM]
import { execFileSync } from 'node:child_process';

try {
  const stdout = execFileSync('my-script.sh', ['my-arg'], {
    // Captura stdout e stderr do processo filho. Substitui o
    // comportamento padrão de streaming de stderr filho para o stderr pai
    stdio: 'pipe',

    // Usa codificação utf8 para pipes stdio
    encoding: 'utf8',
  });

  console.log(stdout);
} catch (err) {
  if (err.code) {
    // Falha ao gerar processo filho
    console.error(err.code);
  } else {
    // Filho foi gerado, mas saiu com código de saída diferente de zero
    // O erro contém qualquer stdout e stderr do filho
    const { stdout, stderr } = err;

    console.error({ stdout, stderr });
  }
}
```
:::

### `child_process.execSync(command[, options])` {#child_processexecsynccommand-options}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v16.4.0, v14.18.0 | A opção `cwd` pode ser um objeto WHATWG `URL` usando o protocolo `file:`. |
| v10.10.0 | A opção `input` agora pode ser qualquer `TypedArray` ou `DataView`. |
| v8.8.0 | A opção `windowsHide` agora é suportada. |
| v8.0.0 | A opção `input` agora pode ser um `Uint8Array`. |
| v0.11.12 | Adicionado em: v0.11.12 |
:::

- `command` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O comando a ser executado.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api) Diretório de trabalho atual do processo filho.
    - `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) O valor que será passado como stdin para o processo gerado. Se `stdio[0]` estiver definido como `'pipe'`, fornecer este valor substituirá `stdio[0]`.
    - `stdio` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Configuração de stdio do filho. Veja o [`stdio`](/pt/nodejs/api/child_process#optionsstdio) de [`child_process.spawn()`](/pt/nodejs/api/child_process#child_processspawncommand-args-options). `stderr` por padrão será enviado para o stderr do processo pai, a menos que `stdio` seja especificado. **Padrão:** `'pipe'`.
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Pares de chave-valor do ambiente. **Padrão:** `process.env`.
    - `shell` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Shell para executar o comando. Veja [Requisitos de Shell](/pt/nodejs/api/child_process#shell-requirements) e [Shell padrão do Windows](/pt/nodejs/api/child_process#default-windows-shell). **Padrão:** `'/bin/sh'` no Unix, `process.env.ComSpec` no Windows.
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Define a identidade do usuário do processo. (Veja [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2)).
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Define a identidade do grupo do processo. (Veja [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2)).
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Em milissegundos, o tempo máximo que o processo pode ser executado. **Padrão:** `undefined`.
    - `killSignal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O valor do sinal a ser usado quando o processo gerado for terminado. **Padrão:** `'SIGTERM'`.
    - `maxBuffer` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Maior quantidade de dados em bytes permitida em stdout ou stderr. Se excedido, o processo filho é terminado e qualquer saída é truncada. Veja a ressalva em [`maxBuffer` e Unicode](/pt/nodejs/api/child_process#maxbuffer-and-unicode). **Padrão:** `1024 * 1024`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A codificação usada para todas as entradas e saídas de stdio. **Padrão:** `'buffer'`.
    - `windowsHide` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Oculta a janela do console do subprocesso que normalmente seria criada em sistemas Windows. **Padrão:** `false`.
  
 
- Retorna: [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O stdout do comando.

O método `child_process.execSync()` é geralmente idêntico a [`child_process.exec()`](/pt/nodejs/api/child_process#child_processexeccommand-options-callback) com a exceção de que o método não retornará até que o processo filho tenha sido totalmente fechado. Quando um timeout é encontrado e `killSignal` é enviado, o método não retornará até que o processo tenha sido completamente encerrado. Se o processo filho interceptar e manipular o sinal `SIGTERM` e não for encerrado, o processo pai esperará até que o processo filho seja encerrado.

Se o processo atingir o tempo limite ou tiver um código de saída diferente de zero, este método lançará um erro. O objeto [`Error`](/pt/nodejs/api/errors#class-error) conterá o resultado inteiro de [`child_process.spawnSync()`](/pt/nodejs/api/child_process#child_processspawnsynccommand-args-options).

**Nunca passe entradas de usuário não higienizadas para esta função. Qualquer entrada contendo
metacaracteres de shell podem ser usados para acionar a execução de comandos arbitrários.**


### `child_process.spawnSync(command[, args][, options])` {#child_processspawnsynccommand-args-options}

::: info [Histórico]
| Versão | Alterações |
| --- | --- |
| v16.4.0, v14.18.0 | A opção `cwd` pode ser um objeto `URL` WHATWG usando o protocolo `file:`. |
| v10.10.0 | A opção `input` agora pode ser qualquer `TypedArray` ou `DataView`. |
| v8.8.0 | A opção `windowsHide` agora é suportada. |
| v8.0.0 | A opção `input` agora pode ser um `Uint8Array`. |
| v5.7.0 | A opção `shell` agora é suportada. |
| v6.2.1, v4.5.0 | A opção `encoding` agora pode ser definida explicitamente como `buffer`. |
| v0.11.12 | Adicionado em: v0.11.12 |
:::

- `command` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O comando a ser executado.
- `args` [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Lista de argumentos de string.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cwd` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/pt/nodejs/api/url#the-whatwg-url-api) Diretório de trabalho atual do processo filho.
    - `input` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) O valor que será passado como stdin para o processo gerado. Se `stdio[0]` estiver definido como `'pipe'`, o fornecimento desse valor substituirá `stdio[0]`.
    - `argv0` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Define explicitamente o valor de `argv[0]` enviado ao processo filho. Isso será definido como `command` se não for especificado.
    - `stdio` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Configuração stdio do filho. Consulte o [`stdio`](/pt/nodejs/api/child_process#optionsstdio) de [`child_process.spawn()`](/pt/nodejs/api/child_process#child_processspawncommand-args-options). **Padrão:** `'pipe'`.
    - `env` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Pares de chave-valor do ambiente. **Padrão:** `process.env`.
    - `uid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Define a identidade do usuário do processo (consulte [`setuid(2)`](http://man7.org/linux/man-pages/man2/setuid.2)).
    - `gid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Define a identidade do grupo do processo (consulte [`setgid(2)`](http://man7.org/linux/man-pages/man2/setgid.2)).
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Em milissegundos, o tempo máximo que o processo pode ser executado. **Padrão:** `undefined`.
    - `killSignal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O valor do sinal a ser usado quando o processo gerado for morto. **Padrão:** `'SIGTERM'`.
    - `maxBuffer` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Maior quantidade de dados em bytes permitida em stdout ou stderr. Se excedido, o processo filho é encerrado e qualquer saída é truncada. Veja o aviso em [`maxBuffer` e Unicode](/pt/nodejs/api/child_process#maxbuffer-and-unicode). **Padrão:** `1024 * 1024`.
    - `encoding` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A codificação usada para todas as entradas e saídas stdio. **Padrão:** `'buffer'`.
    - `shell` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Se `true`, executa `command` dentro de um shell. Usa `'/bin/sh'` no Unix e `process.env.ComSpec` no Windows. Um shell diferente pode ser especificado como uma string. Veja [Requisitos do Shell](/pt/nodejs/api/child_process#shell-requirements) e [Shell padrão do Windows](/pt/nodejs/api/child_process#default-windows-shell). **Padrão:** `false` (sem shell).
    - `windowsVerbatimArguments` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Nenhuma citação ou escape de argumentos é feita no Windows. Ignorado no Unix. Isso é definido como `true` automaticamente quando `shell` é especificado e é CMD. **Padrão:** `false`.
    - `windowsHide` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Oculta a janela do console do subprocesso que normalmente seria criada em sistemas Windows. **Padrão:** `false`.
 

- Retorna: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `pid` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Pid do processo filho.
    - `output` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Array de resultados da saída stdio.
    - `stdout` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O conteúdo de `output[1]`.
    - `stderr` [\<Buffer\>](/pt/nodejs/api/buffer#class-buffer) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O conteúdo de `output[2]`.
    - `status` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) O código de saída do subprocesso, ou `null` se o subprocesso terminou devido a um sinal.
    - `signal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) O sinal usado para matar o subprocesso, ou `null` se o subprocesso não terminou devido a um sinal.
    - `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) O objeto de erro se o processo filho falhou ou atingiu o tempo limite.
 

O método `child_process.spawnSync()` é geralmente idêntico a [`child_process.spawn()`](/pt/nodejs/api/child_process#child_processspawncommand-args-options) com a exceção de que a função não retornará até que o processo filho tenha sido totalmente fechado. Quando um tempo limite foi encontrado e `killSignal` é enviado, o método não retornará até que o processo tenha sido completamente encerrado. Se o processo interceptar e manipular o sinal `SIGTERM` e não for encerrado, o processo pai aguardará até que o processo filho seja encerrado.

**Se a opção <code>shell</code> estiver habilitada, não passe entrada do usuário não
higienizada para esta função. Qualquer entrada que contenha metacaracteres de shell
pode ser usada para acionar a execução arbitrária de comandos.**


## Classe: `ChildProcess` {#class-childprocess}

**Adicionado em: v2.2.0**

- Estende: [\<EventEmitter\>](/pt/nodejs/api/events#class-eventemitter)

Instâncias de `ChildProcess` representam processos filhos gerados.

As instâncias de `ChildProcess` não devem ser criadas diretamente. Em vez disso, use os métodos [`child_process.spawn()`](/pt/nodejs/api/child_process#child_processspawncommand-args-options), [`child_process.exec()`](/pt/nodejs/api/child_process#child_processexeccommand-options-callback), [`child_process.execFile()`](/pt/nodejs/api/child_process#child_processexecfilefile-args-options-callback) ou [`child_process.fork()`](/pt/nodejs/api/child_process#child_processforkmodulepath-args-options) para criar instâncias de `ChildProcess`.

### Evento: `'close'` {#event-close}

**Adicionado em: v0.7.7**

- `code` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O código de saída se o processo filho foi encerrado por conta própria.
- `signal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O sinal pelo qual o processo filho foi encerrado.

O evento `'close'` é emitido depois que um processo é encerrado *e* os fluxos stdio de um processo filho são fechados. Isso é diferente do evento [`'exit'`](/pt/nodejs/api/child_process#event-exit), já que vários processos podem compartilhar os mesmos fluxos stdio. O evento `'close'` sempre será emitido depois que [`'exit'`](/pt/nodejs/api/child_process#event-exit) já foi emitido ou [`'error'`](/pt/nodejs/api/child_process#event-error) se o processo filho não conseguiu ser gerado.

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process close all stdio with code ${code}`);
});

ls.on('exit', (code) => {
  console.log(`child process exited with code ${code}`);
});
```

```js [ESM]
import { spawn } from 'node:child_process';
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process close all stdio with code ${code}`);
});

ls.on('exit', (code) => {
  console.log(`child process exited with code ${code}`);
});
```
:::


### Evento: `'disconnect'` {#event-disconnect}

**Adicionado em: v0.7.2**

O evento `'disconnect'` é emitido após chamar o método [`subprocess.disconnect()`](/pt/nodejs/api/child_process#subprocessdisconnect) no processo pai ou [`process.disconnect()`](/pt/nodejs/api/process#processdisconnect) no processo filho. Após a desconexão, não é mais possível enviar ou receber mensagens, e a propriedade [`subprocess.connected`](/pt/nodejs/api/child_process#subprocessconnected) é `false`.

### Evento: `'error'` {#event-error}

- `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) O erro.

O evento `'error'` é emitido sempre que:

- O processo não pôde ser iniciado.
- O processo não pôde ser terminado.
- O envio de uma mensagem para o processo filho falhou.
- O processo filho foi abortado através da opção `signal`.

O evento `'exit'` pode ou não ser disparado após a ocorrência de um erro. Ao escutar os eventos `'exit'` e `'error'`, proteja-se contra a invocação acidental de funções de tratamento múltiplas vezes.

Veja também [`subprocess.kill()`](/pt/nodejs/api/child_process#subprocesskillsignal) e [`subprocess.send()`](/pt/nodejs/api/child_process#subprocesssendmessage-sendhandle-options-callback).

### Evento: `'exit'` {#event-exit}

**Adicionado em: v0.1.90**

- `code` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) O código de saída se o processo filho saiu por conta própria.
- `signal` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) O sinal pelo qual o processo filho foi terminado.

O evento `'exit'` é emitido após o término do processo filho. Se o processo foi encerrado, `code` é o código de saída final do processo, caso contrário `null`. Se o processo terminou devido ao recebimento de um sinal, `signal` é o nome da string do sinal, caso contrário `null`. Um dos dois sempre será não-`null`.

Quando o evento `'exit'` é disparado, os fluxos stdio do processo filho ainda podem estar abertos.

O Node.js estabelece manipuladores de sinal para `SIGINT` e `SIGTERM`, e os processos do Node.js não serão encerrados imediatamente devido ao recebimento desses sinais. Em vez disso, o Node.js executará uma sequência de ações de limpeza e, em seguida, relançará o sinal tratado.

Veja [`waitpid(2)`](http://man7.org/linux/man-pages/man2/waitpid.2).


### Evento: `'message'` {#event-message}

**Adicionado em: v0.5.9**

- `message` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Um objeto JSON analisado ou valor primitivo.
- `sendHandle` [\<Handle\>](/pt/nodejs/api/net#serverlistenhandle-backlog-callback) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) `undefined` ou um objeto [`net.Socket`](/pt/nodejs/api/net#class-netsocket), [`net.Server`](/pt/nodejs/api/net#class-netserver), ou [`dgram.Socket`](/pt/nodejs/api/dgram#class-dgramsocket).

O evento `'message'` é acionado quando um processo filho usa [`process.send()`](/pt/nodejs/api/process#processsendmessage-sendhandle-options-callback) para enviar mensagens.

A mensagem passa por serialização e análise. A mensagem resultante pode não ser a mesma que foi enviada originalmente.

Se a opção `serialization` foi definida como `'advanced'` quando o processo filho foi gerado, o argumento `message` pode conter dados que o JSON não consegue representar. Veja [Serialização avançada](/pt/nodejs/api/child_process#advanced-serialization) para mais detalhes.

### Evento: `'spawn'` {#event-spawn}

**Adicionado em: v15.1.0, v14.17.0**

O evento `'spawn'` é emitido assim que o processo filho é gerado com sucesso. Se o processo filho não for gerado com sucesso, o evento `'spawn'` não será emitido e o evento `'error'` será emitido em vez disso.

Se emitido, o evento `'spawn'` vem antes de todos os outros eventos e antes que qualquer dado seja recebido via `stdout` ou `stderr`.

O evento `'spawn'` será acionado independentemente de ocorrer ou não um erro **dentro** do processo gerado. Por exemplo, se `bash some-command` for gerado com sucesso, o evento `'spawn'` será acionado, embora `bash` possa falhar ao gerar `some-command`. Essa ressalva também se aplica ao usar `{ shell: true }`.

### `subprocess.channel` {#subprocesschannel}

::: info [Histórico]
| Versão | Mudanças |
| --- | --- |
| v14.0.0 | O objeto não expõe mais acidentalmente bindings C++ nativas. |
| v7.1.0 | Adicionado em: v7.1.0 |
:::

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Um pipe representando o canal IPC para o processo filho.

A propriedade `subprocess.channel` é uma referência ao canal IPC do filho. Se nenhum canal IPC existir, essa propriedade é `undefined`.


#### `subprocess.channel.ref()` {#subprocesschannelref}

**Adicionado em: v7.1.0**

Este método faz com que o canal IPC mantenha o loop de eventos do processo pai em execução se `.unref()` tiver sido chamado antes.

#### `subprocess.channel.unref()` {#subprocesschannelunref}

**Adicionado em: v7.1.0**

Este método faz com que o canal IPC não mantenha o loop de eventos do processo pai em execução e permite que ele termine mesmo enquanto o canal está aberto.

### `subprocess.connected` {#subprocessconnected}

**Adicionado em: v0.7.2**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Definido como `false` depois que `subprocess.disconnect()` é chamado.

A propriedade `subprocess.connected` indica se ainda é possível enviar e receber mensagens de um processo filho. Quando `subprocess.connected` é `false`, não é mais possível enviar ou receber mensagens.

### `subprocess.disconnect()` {#subprocessdisconnect}

**Adicionado em: v0.7.2**

Fecha o canal IPC entre os processos pai e filho, permitindo que o processo filho saia normalmente quando não houver outras conexões mantendo-o ativo. Depois de chamar este método, as propriedades `subprocess.connected` e `process.connected` nos processos pai e filho (respectivamente) serão definidas como `false`, e não será mais possível passar mensagens entre os processos.

O evento `'disconnect'` será emitido quando não houver mensagens no processo de serem recebidas. Isso geralmente será acionado imediatamente após chamar `subprocess.disconnect()`.

Quando o processo filho é uma instância do Node.js (por exemplo, gerada usando [`child_process.fork()`](/pt/nodejs/api/child_process#child_processforkmodulepath-args-options)), o método `process.disconnect()` pode ser invocado dentro do processo filho para fechar o canal IPC também.

### `subprocess.exitCode` {#subprocessexitcode}

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

A propriedade `subprocess.exitCode` indica o código de saída do processo filho. Se o processo filho ainda estiver em execução, o campo será `null`.

### `subprocess.kill([signal])` {#subprocesskillsignal}

**Adicionado em: v0.1.90**

- `signal` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

O método `subprocess.kill()` envia um sinal para o processo filho. Se nenhum argumento for fornecido, o sinal `'SIGTERM'` será enviado ao processo. Consulte [`signal(7)`](http://man7.org/linux/man-pages/man7/signal.7) para obter uma lista de sinais disponíveis. Esta função retorna `true` se [`kill(2)`](http://man7.org/linux/man-pages/man2/kill.2) for bem-sucedida e `false` caso contrário.

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const grep = spawn('grep', ['ssh']);

grep.on('close', (code, signal) => {
  console.log(
    `child process terminated due to receipt of signal ${signal}`);
});

// Send SIGHUP to process.
grep.kill('SIGHUP');
```

```js [ESM]
import { spawn } from 'node:child_process';
const grep = spawn('grep', ['ssh']);

grep.on('close', (code, signal) => {
  console.log(
    `child process terminated due to receipt of signal ${signal}`);
});

// Send SIGHUP to process.
grep.kill('SIGHUP');
```
:::

O objeto [`ChildProcess`](/pt/nodejs/api/child_process#class-childprocess) pode emitir um evento [`'error'`](/pt/nodejs/api/child_process#event-error) se o sinal não puder ser entregue. Enviar um sinal para um processo filho que já foi encerrado não é um erro, mas pode ter consequências imprevistas. Especificamente, se o identificador do processo (PID) foi reatribuído a outro processo, o sinal será entregue a esse processo, o que pode ter resultados inesperados.

Embora a função seja chamada de `kill`, o sinal entregue ao processo filho pode não terminar o processo.

Consulte [`kill(2)`](http://man7.org/linux/man-pages/man2/kill.2) para referência.

No Windows, onde os sinais POSIX não existem, o argumento `signal` será ignorado, exceto para `'SIGKILL'`, `'SIGTERM'`, `'SIGINT'` e `'SIGQUIT'`, e o processo sempre será encerrado à força e abruptamente (semelhante a `'SIGKILL'`). Consulte [Eventos de Sinal](/pt/nodejs/api/process#signal-events) para obter mais detalhes.

No Linux, os processos filhos de processos filhos não serão encerrados ao tentar encerrar seu pai. É provável que isso aconteça ao executar um novo processo em um shell ou com o uso da opção `shell` de `ChildProcess`:

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');

const subprocess = spawn(
  'sh',
  [
    '-c',
    `node -e "setInterval(() => {
      console.log(process.pid, 'is alive')
    }, 500);"`,
  ], {
    stdio: ['inherit', 'inherit', 'inherit'],
  },
);

setTimeout(() => {
  subprocess.kill(); // Does not terminate the Node.js process in the shell.
}, 2000);
```

```js [ESM]
import { spawn } from 'node:child_process';

const subprocess = spawn(
  'sh',
  [
    '-c',
    `node -e "setInterval(() => {
      console.log(process.pid, 'is alive')
    }, 500);"`,
  ], {
    stdio: ['inherit', 'inherit', 'inherit'],
  },
);

setTimeout(() => {
  subprocess.kill(); // Does not terminate the Node.js process in the shell.
}, 2000);
```
:::


### `subprocess[Symbol.dispose]()` {#subprocesssymboldispose}

**Adicionado em: v20.5.0, v18.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

Chama [`subprocess.kill()`](/pt/nodejs/api/child_process#subprocesskillsignal) com `'SIGTERM'`.

### `subprocess.killed` {#subprocesskilled}

**Adicionado em: v0.5.10**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Definido como `true` depois que `subprocess.kill()` é usado para enviar com sucesso um sinal para o processo filho.

A propriedade `subprocess.killed` indica se o processo filho recebeu com sucesso um sinal de `subprocess.kill()`. A propriedade `killed` não indica que o processo filho foi terminado.

### `subprocess.pid` {#subprocesspid}

**Adicionado em: v0.1.90**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Retorna o identificador do processo (PID) do processo filho. Se o processo filho não conseguir ser iniciado devido a erros, o valor será `undefined` e `error` será emitido.

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const grep = spawn('grep', ['ssh']);

console.log(`PID do filho gerado: ${grep.pid}`);
grep.stdin.end();
```

```js [ESM]
import { spawn } from 'node:child_process';
const grep = spawn('grep', ['ssh']);

console.log(`PID do filho gerado: ${grep.pid}`);
grep.stdin.end();
```
:::

### `subprocess.ref()` {#subprocessref}

**Adicionado em: v0.7.10**

Chamar `subprocess.ref()` após fazer uma chamada para `subprocess.unref()` irá restaurar a contagem de referência removida para o processo filho, forçando o processo pai a esperar que o processo filho termine antes de sair.

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const process = require('node:process');

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
subprocess.ref();
```

```js [ESM]
import { spawn } from 'node:child_process';
import process from 'node:process';

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
subprocess.ref();
```
:::


### `subprocess.send(message[, sendHandle[, options]][, callback])` {#subprocesssendmessage-sendhandle-options-callback}

::: info [Histórico]
| Versão | Mudanças |
|---|---|
| v5.8.0 | O parâmetro `options`, e a opção `keepOpen` em particular, são agora suportados. |
| v5.0.0 | Este método retorna um booleano para controle de fluxo agora. |
| v4.0.0 | O parâmetro `callback` agora é suportado. |
| v0.5.9 | Adicionado em: v0.5.9 |
:::

- `message` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `sendHandle` [\<Handle\>](/pt/nodejs/api/net#serverlistenhandle-backlog-callback) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) `undefined`, ou um objeto [`net.Socket`](/pt/nodejs/api/net#class-netsocket), [`net.Server`](/pt/nodejs/api/net#class-netserver), ou [`dgram.Socket`](/pt/nodejs/api/dgram#class-dgramsocket).
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) O argumento `options`, se presente, é um objeto usado para parametrizar o envio de certos tipos de handles. `options` suporta as seguintes propriedades:
    - `keepOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Um valor que pode ser usado ao passar instâncias de `net.Socket`. Quando `true`, o socket é mantido aberto no processo de envio. **Padrão:** `false`.


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retorna: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Quando um canal IPC foi estabelecido entre os processos pai e filho (isto é, ao usar [`child_process.fork()`](/pt/nodejs/api/child_process#child_processforkmodulepath-args-options)), o método `subprocess.send()` pode ser usado para enviar mensagens para o processo filho. Quando o processo filho é uma instância do Node.js, essas mensagens podem ser recebidas através do evento [`'message'`](/pt/nodejs/api/process#event-message).

A mensagem passa por serialização e análise. A mensagem resultante pode não ser a mesma que foi originalmente enviada.

Por exemplo, no script pai:

::: code-group
```js [CJS]
const { fork } = require('node:child_process');
const forkedProcess = fork(`${__dirname}/sub.js`);

forkedProcess.on('message', (message) => {
  console.log('PARENT got message:', message);
});

// Causes the child to print: CHILD got message: { hello: 'world' }
forkedProcess.send({ hello: 'world' });
```

```js [ESM]
import { fork } from 'node:child_process';
const forkedProcess = fork(`${import.meta.dirname}/sub.js`);

forkedProcess.on('message', (message) => {
  console.log('PARENT got message:', message);
});

// Causes the child to print: CHILD got message: { hello: 'world' }
forkedProcess.send({ hello: 'world' });
```
:::

E então o script filho, `'sub.js'` pode ser parecido com este:

```js [ESM]
process.on('message', (message) => {
  console.log('CHILD got message:', message);
});

// Causes the parent to print: PARENT got message: { foo: 'bar', baz: null }
process.send({ foo: 'bar', baz: NaN });
```
Os processos filhos do Node.js terão um método [`process.send()`](/pt/nodejs/api/process#processsendmessage-sendhandle-options-callback) próprio que permite que o processo filho envie mensagens de volta para o processo pai.

Há um caso especial ao enviar uma mensagem `{cmd: 'NODE_foo'}`. As mensagens que contêm um prefixo `NODE_` na propriedade `cmd` são reservadas para uso no núcleo do Node.js e não serão emitidas no evento [`'message'`](/pt/nodejs/api/process#event-message) do filho. Em vez disso, essas mensagens são emitidas usando o evento `'internalMessage'` e são consumidas internamente pelo Node.js. Os aplicativos devem evitar usar tais mensagens ou ouvir os eventos `'internalMessage'`, pois estão sujeitos a alterações sem aviso prévio.

O argumento opcional `sendHandle` que pode ser passado para `subprocess.send()` é para passar um servidor TCP ou objeto de socket para o processo filho. O processo filho receberá o objeto como o segundo argumento passado para a função de callback registrada no evento [`'message'`](/pt/nodejs/api/process#event-message). Quaisquer dados recebidos e armazenados em buffer no socket não serão enviados para o filho. O envio de sockets IPC não é suportado no Windows.

O `callback` opcional é uma função que é invocada após a mensagem ser enviada, mas antes que o processo filho a tenha recebido. A função é chamada com um único argumento: `null` em caso de sucesso ou um objeto [`Error`](/pt/nodejs/api/errors#class-error) em caso de falha.

Se nenhuma função `callback` for fornecida e a mensagem não puder ser enviada, um evento `'error'` será emitido pelo objeto [`ChildProcess`](/pt/nodejs/api/child_process#class-childprocess). Isso pode acontecer, por exemplo, quando o processo filho já foi encerrado.

`subprocess.send()` retornará `false` se o canal tiver fechado ou quando o backlog de mensagens não enviadas exceder um limite que torna imprudente enviar mais. Caso contrário, o método retorna `true`. A função `callback` pode ser usada para implementar o controle de fluxo.


#### Exemplo: enviando um objeto de servidor {#example-sending-a-server-object}

O argumento `sendHandle` pode ser usado, por exemplo, para passar o manipulador de um objeto de servidor TCP para o processo filho, como ilustrado no exemplo abaixo:

::: code-group
```js [CJS]
const { fork } = require('node:child_process');
const { createServer } = require('node:net');

const subprocess = fork('subprocess.js');

// Abra o objeto do servidor e envie o manipulador.
const server = createServer();
server.on('connection', (socket) => {
  socket.end('handled by parent');
});
server.listen(1337, () => {
  subprocess.send('server', server);
});
```

```js [ESM]
import { fork } from 'node:child_process';
import { createServer } from 'node:net';

const subprocess = fork('subprocess.js');

// Abra o objeto do servidor e envie o manipulador.
const server = createServer();
server.on('connection', (socket) => {
  socket.end('handled by parent');
});
server.listen(1337, () => {
  subprocess.send('server', server);
});
```
:::

O processo filho receberia então o objeto do servidor como:

```js [ESM]
process.on('message', (m, server) => {
  if (m === 'server') {
    server.on('connection', (socket) => {
      socket.end('handled by child');
    });
  }
});
```
Uma vez que o servidor agora é compartilhado entre o pai e o filho, algumas conexões podem ser tratadas pelo pai e outras pelo filho.

Embora o exemplo acima use um servidor criado usando o módulo `node:net`, os servidores do módulo `node:dgram` usam exatamente o mesmo fluxo de trabalho, com as exceções de ouvir um evento `'message'` em vez de `'connection'` e usar `server.bind()` em vez de `server.listen()`. No entanto, isso só é suportado em plataformas Unix.

#### Exemplo: enviando um objeto de socket {#example-sending-a-socket-object}

Da mesma forma, o argumento `sendHandler` pode ser usado para passar o manipulador de um socket para o processo filho. O exemplo abaixo gera dois filhos que lidam com conexões com prioridade "normal" ou "especial":

::: code-group
```js [CJS]
const { fork } = require('node:child_process');
const { createServer } = require('node:net');

const normal = fork('subprocess.js', ['normal']);
const special = fork('subprocess.js', ['special']);

// Abra o servidor e envie sockets para o filho. Use pauseOnConnect para impedir
// que os sockets sejam lidos antes de serem enviados para o processo filho.
const server = createServer({ pauseOnConnect: true });
server.on('connection', (socket) => {

  // Se esta é prioridade especial...
  if (socket.remoteAddress === '74.125.127.100') {
    special.send('socket', socket);
    return;
  }
  // Esta é prioridade normal.
  normal.send('socket', socket);
});
server.listen(1337);
```

```js [ESM]
import { fork } from 'node:child_process';
import { createServer } from 'node:net';

const normal = fork('subprocess.js', ['normal']);
const special = fork('subprocess.js', ['special']);

// Abra o servidor e envie sockets para o filho. Use pauseOnConnect para impedir
// que os sockets sejam lidos antes de serem enviados para o processo filho.
const server = createServer({ pauseOnConnect: true });
server.on('connection', (socket) => {

  // Se esta é prioridade especial...
  if (socket.remoteAddress === '74.125.127.100') {
    special.send('socket', socket);
    return;
  }
  // Esta é prioridade normal.
  normal.send('socket', socket);
});
server.listen(1337);
```
:::

O `subprocess.js` receberia o manipulador de socket como o segundo argumento passado para a função de callback do evento:

```js [ESM]
process.on('message', (m, socket) => {
  if (m === 'socket') {
    if (socket) {
      // Verifique se o socket do cliente existe.
      // É possível que o socket seja fechado entre o momento em que é
      // enviado e o momento em que é recebido no processo filho.
      socket.end(`Request handled with ${process.argv[2]} priority`);
    }
  }
});
```
Não use `.maxConnections` em um socket que foi passado para um subprocesso. O pai não pode rastrear quando o socket é destruído.

Quaisquer manipuladores de `'message'` no subprocesso devem verificar se `socket` existe, pois a conexão pode ter sido fechada durante o tempo que leva para enviar a conexão para o filho.


### `subprocess.signalCode` {#subprocesssignalcode}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

A propriedade `subprocess.signalCode` indica o sinal recebido pelo processo filho, se houver, caso contrário, `null`.

### `subprocess.spawnargs` {#subprocessspawnargs}

- [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

A propriedade `subprocess.spawnargs` representa a lista completa de argumentos de linha de comando com os quais o processo filho foi iniciado.

### `subprocess.spawnfile` {#subprocessspawnfile}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

A propriedade `subprocess.spawnfile` indica o nome do arquivo executável do processo filho que é iniciado.

Para [`child_process.fork()`](/pt/nodejs/api/child_process#child_processforkmodulepath-args-options), seu valor será igual a [`process.execPath`](/pt/nodejs/api/process#processexecpath). Para [`child_process.spawn()`](/pt/nodejs/api/child_process#child_processspawncommand-args-options), seu valor será o nome do arquivo executável. Para [`child_process.exec()`](/pt/nodejs/api/child_process#child_processexeccommand-options-callback), seu valor será o nome do shell no qual o processo filho é iniciado.

### `subprocess.stderr` {#subprocessstderr}

**Adicionado em: v0.1.90**

- [\<stream.Readable\>](/pt/nodejs/api/stream#class-streamreadable) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Um `Readable Stream` que representa o `stderr` do processo filho.

Se o processo filho foi gerado com `stdio[2]` definido para qualquer valor diferente de `'pipe'`, então isso será `null`.

`subprocess.stderr` é um alias para `subprocess.stdio[2]`. Ambas as propriedades se referirão ao mesmo valor.

A propriedade `subprocess.stderr` pode ser `null` ou `undefined` se o processo filho não pôde ser gerado com sucesso.


### `subprocess.stdin` {#subprocessstdin}

**Adicionado em: v0.1.90**

- [\<stream.Writable\>](/pt/nodejs/api/stream#class-streamwritable) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Um `Writable Stream` que representa o `stdin` do processo filho.

Se um processo filho espera para ler toda a sua entrada, o processo filho não continuará até que este stream seja fechado via `end()`.

Se o processo filho foi gerado com `stdio[0]` definido para algo diferente de `'pipe'`, então isso será `null`.

`subprocess.stdin` é um alias para `subprocess.stdio[0]`. Ambas as propriedades se referirão ao mesmo valor.

A propriedade `subprocess.stdin` pode ser `null` ou `undefined` se o processo filho não pôde ser gerado com sucesso.

### `subprocess.stdio` {#subprocessstdio}

**Adicionado em: v0.7.10**

- [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

Um array esparso de pipes para o processo filho, correspondendo às posições na opção [`stdio`](/pt/nodejs/api/child_process#optionsstdio) passada para [`child_process.spawn()`](/pt/nodejs/api/child_process#child_processspawncommand-args-options) que foram definidas para o valor `'pipe'`. `subprocess.stdio[0]`, `subprocess.stdio[1]` e `subprocess.stdio[2]` também estão disponíveis como `subprocess.stdin`, `subprocess.stdout` e `subprocess.stderr`, respectivamente.

No exemplo a seguir, apenas o fd `1` (stdout) do filho é configurado como um pipe, então apenas o `subprocess.stdio[1]` do pai é um stream, todos os outros valores no array são `null`.

::: code-group
```js [CJS]
const assert = require('node:assert');
const fs = require('node:fs');
const child_process = require('node:child_process');

const subprocess = child_process.spawn('ls', {
  stdio: [
    0, // Use parent's stdin for child.
    'pipe', // Pipe child's stdout to parent.
    fs.openSync('err.out', 'w'), // Direct child's stderr to a file.
  ],
});

assert.strictEqual(subprocess.stdio[0], null);
assert.strictEqual(subprocess.stdio[0], subprocess.stdin);

assert(subprocess.stdout);
assert.strictEqual(subprocess.stdio[1], subprocess.stdout);

assert.strictEqual(subprocess.stdio[2], null);
assert.strictEqual(subprocess.stdio[2], subprocess.stderr);
```

```js [ESM]
import assert from 'node:assert';
import fs from 'node:fs';
import child_process from 'node:child_process';

const subprocess = child_process.spawn('ls', {
  stdio: [
    0, // Use parent's stdin for child.
    'pipe', // Pipe child's stdout to parent.
    fs.openSync('err.out', 'w'), // Direct child's stderr to a file.
  ],
});

assert.strictEqual(subprocess.stdio[0], null);
assert.strictEqual(subprocess.stdio[0], subprocess.stdin);

assert(subprocess.stdout);
assert.strictEqual(subprocess.stdio[1], subprocess.stdout);

assert.strictEqual(subprocess.stdio[2], null);
assert.strictEqual(subprocess.stdio[2], subprocess.stderr);
```
:::

A propriedade `subprocess.stdio` pode ser `undefined` se o processo filho não pôde ser gerado com sucesso.


### `subprocess.stdout` {#subprocessstdout}

**Adicionado em: v0.1.90**

- [\<stream.Readable\>](/pt/nodejs/api/stream#class-streamreadable) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Um `Readable Stream` que representa o `stdout` do processo filho.

Se o processo filho foi gerado com `stdio[1]` definido para algo diferente de `'pipe'`, então isso será `null`.

`subprocess.stdout` é um alias para `subprocess.stdio[1]`. Ambas as propriedades se referirão ao mesmo valor.

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');

const subprocess = spawn('ls');

subprocess.stdout.on('data', (data) => {
  console.log(`Received chunk ${data}`);
});
```

```js [ESM]
import { spawn } from 'node:child_process';

const subprocess = spawn('ls');

subprocess.stdout.on('data', (data) => {
  console.log(`Received chunk ${data}`);
});
```
:::

A propriedade `subprocess.stdout` pode ser `null` ou `undefined` se o processo filho não puder ser gerado com sucesso.

### `subprocess.unref()` {#subprocessunref}

**Adicionado em: v0.7.10**

Por padrão, o processo pai esperará que o processo filho destacado seja encerrado. Para impedir que o processo pai espere que um determinado `subprocess` seja encerrado, use o método `subprocess.unref()`. Fazer isso fará com que o loop de eventos do pai não inclua o processo filho em sua contagem de referência, permitindo que o pai saia independentemente do filho, a menos que haja um canal IPC estabelecido entre os processos filho e pai.

::: code-group
```js [CJS]
const { spawn } = require('node:child_process');
const process = require('node:process');

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
```

```js [ESM]
import { spawn } from 'node:child_process';
import process from 'node:process';

const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
```
:::


## `maxBuffer` e Unicode {#maxbuffer-and-unicode}

A opção `maxBuffer` especifica o maior número de bytes permitidos em `stdout` ou `stderr`. Se este valor for excedido, o processo filho é encerrado. Isso impacta a saída que inclui codificações de caracteres multibyte, como UTF-8 ou UTF-16. Por exemplo, `console.log('中文测试')` enviará 13 bytes codificados em UTF-8 para `stdout`, embora existam apenas 4 caracteres.

## Requisitos do Shell {#shell-requirements}

O shell deve entender a opção `-c`. Se o shell for `'cmd.exe'`, ele deve entender as opções `/d /s /c` e a análise da linha de comando deve ser compatível.

## Shell padrão do Windows {#default-windows-shell}

Embora a Microsoft especifique que `%COMSPEC%` deve conter o caminho para `'cmd.exe'` no ambiente raiz, os processos filhos nem sempre estão sujeitos ao mesmo requisito. Assim, nas funções `child_process` onde um shell pode ser gerado, `'cmd.exe'` é usado como fallback se `process.env.ComSpec` não estiver disponível.

## Serialização avançada {#advanced-serialization}

**Adicionado em: v13.2.0, v12.16.0**

Os processos filhos suportam um mecanismo de serialização para IPC que é baseado na [API de serialização do módulo `node:v8`](/pt/nodejs/api/v8#serialization-api), com base no [algoritmo de clone estruturado HTML](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm). Isso é geralmente mais poderoso e suporta mais tipos de objetos JavaScript integrados, como `BigInt`, `Map` e `Set`, `ArrayBuffer` e `TypedArray`, `Buffer`, `Error`, `RegExp` etc.

No entanto, este formato não é um superconjunto completo de JSON e, por exemplo, as propriedades definidas em objetos de tais tipos integrados não serão transmitidas através da etapa de serialização. Além disso, o desempenho pode não ser equivalente ao do JSON, dependendo da estrutura dos dados transmitidos. Portanto, este recurso requer a ativação definindo a opção `serialization` como `'advanced'` ao chamar [`child_process.spawn()`](/pt/nodejs/api/child_process#child_processspawncommand-args-options) ou [`child_process.fork()`](/pt/nodejs/api/child_process#child_processforkmodulepath-args-options).

