---
title: API de Permissões do Node.js
description: A documentação da API de Permissões do Node.js detalha como gerenciar e controlar permissões para várias operações dentro de aplicações Node.js, garantindo um acesso seguro e controlado aos recursos do sistema.
head:
  - - meta
    - name: og:title
      content: API de Permissões do Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: A documentação da API de Permissões do Node.js detalha como gerenciar e controlar permissões para várias operações dentro de aplicações Node.js, garantindo um acesso seguro e controlado aos recursos do sistema.
  - - meta
    - name: twitter:title
      content: API de Permissões do Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: A documentação da API de Permissões do Node.js detalha como gerenciar e controlar permissões para várias operações dentro de aplicações Node.js, garantindo um acesso seguro e controlado aos recursos do sistema.
---


# Permissões {#permissions}

As permissões podem ser usadas para controlar a quais recursos do sistema o processo do Node.js tem acesso ou quais ações o processo pode tomar com esses recursos.

- [Permissões baseadas em processo](/pt/nodejs/api/permissions#process-based-permissions) controlam o acesso do processo do Node.js aos recursos. O recurso pode ser totalmente permitido ou negado, ou as ações relacionadas a ele podem ser controladas. Por exemplo, as leituras do sistema de arquivos podem ser permitidas enquanto as gravações são negadas. Este recurso não protege contra código malicioso. De acordo com a [Política de Segurança](https://github.com/nodejs/node/blob/main/SECURITY.md) do Node.js, o Node.js confia em qualquer código que seja solicitado a executar.

O modelo de permissão implementa uma abordagem de "cinto de segurança", que impede que o código confiável altere arquivos ou use recursos cujo acesso não foi explicitamente concedido. Ele não oferece garantias de segurança na presença de código malicioso. Código malicioso pode ignorar o modelo de permissão e executar código arbitrário sem as restrições impostas pelo modelo de permissão.

Se você encontrar uma possível vulnerabilidade de segurança, consulte nossa [Política de Segurança](https://github.com/nodejs/node/blob/main/SECURITY.md).

## Permissões baseadas em processo {#process-based-permissions}

### Modelo de Permissão {#permission-model}

::: tip [Estável: 2 - Estável]
[Estável: 2](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 2](/pt/nodejs/api/documentation#stability-index) - Estável.
:::

O Modelo de Permissão do Node.js é um mecanismo para restringir o acesso a recursos específicos durante a execução. A API existe por trás de uma flag [`--permission`](/pt/nodejs/api/cli#--permission) que, quando ativada, restringirá o acesso a todas as permissões disponíveis.

As permissões disponíveis são documentadas pela flag [`--permission`](/pt/nodejs/api/cli#--permission).

Ao iniciar o Node.js com `--permission`, a capacidade de acessar o sistema de arquivos através do módulo `fs`, gerar processos, usar `node:worker_threads`, usar addons nativos, usar WASI e habilitar o inspetor de tempo de execução será restrita.

```bash [BASH]
$ node --permission index.js

Error: Access to this API has been restricted
    at node:internal/main/run_main_module:23:47 {
  code: 'ERR_ACCESS_DENIED',
  permission: 'FileSystemRead',
  resource: '/home/user/index.js'
}
```
Permitir o acesso para gerar um processo e criar threads de trabalho pode ser feito usando [`--allow-child-process`](/pt/nodejs/api/cli#--allow-child-process) e [`--allow-worker`](/pt/nodejs/api/cli#--allow-worker) respectivamente.

Para permitir addons nativos ao usar o modelo de permissão, use a flag [`--allow-addons`](/pt/nodejs/api/cli#--allow-addons). Para WASI, use a flag [`--allow-wasi`](/pt/nodejs/api/cli#--allow-wasi).


#### API de Tempo de Execução {#runtime-api}

Ao habilitar o Modelo de Permissão através da flag [`--permission`](/pt/nodejs/api/cli#--permission), uma nova propriedade `permission` é adicionada ao objeto `process`. Esta propriedade contém uma função:

##### `permission.has(scope[, reference])` {#permissionhasscope-reference}

Chamada de API para verificar permissões em tempo de execução ([`permission.has()`](/pt/nodejs/api/process#processpermissionhasscope-reference))

```js [ESM]
process.permission.has('fs.write'); // true
process.permission.has('fs.write', '/home/rafaelgss/protected-folder'); // true

process.permission.has('fs.read'); // true
process.permission.has('fs.read', '/home/rafaelgss/protected-folder'); // false
```
#### Permissões do Sistema de Arquivos {#file-system-permissions}

O Modelo de Permissão, por padrão, restringe o acesso ao sistema de arquivos através do módulo `node:fs`. Ele não garante que os usuários não poderão acessar o sistema de arquivos por outros meios, como através do módulo `node:sqlite`.

Para permitir o acesso ao sistema de arquivos, use as flags [`--allow-fs-read`](/pt/nodejs/api/cli#--allow-fs-read) e [`--allow-fs-write`](/pt/nodejs/api/cli#--allow-fs-write):

```bash [BASH]
$ node --permission --allow-fs-read=* --allow-fs-write=* index.js
Hello world!
```
Os argumentos válidos para ambas as flags são:

- `*` - Para permitir todas as operações `FileSystemRead` ou `FileSystemWrite`, respectivamente.
- Caminhos delimitados por vírgula (`,`) para permitir apenas as operações `FileSystemRead` ou `FileSystemWrite` correspondentes, respectivamente.

Exemplo:

- `--allow-fs-read=*` - Permitirá todas as operações `FileSystemRead`.
- `--allow-fs-write=*` - Permitirá todas as operações `FileSystemWrite`.
- `--allow-fs-write=/tmp/` - Permitirá o acesso `FileSystemWrite` à pasta `/tmp/`.
- `--allow-fs-read=/tmp/ --allow-fs-read=/home/.gitignore` - Permite o acesso `FileSystemRead` à pasta `/tmp/` **e** ao caminho `/home/.gitignore`.

Curingas também são suportados:

- `--allow-fs-read=/home/test*` permitirá o acesso de leitura a tudo que corresponder ao curinga. ex: `/home/test/file1` ou `/home/test2`

Depois de passar um caractere curinga (`*`), todos os caracteres subsequentes serão ignorados. Por exemplo: `/home/*.js` funcionará de forma semelhante a `/home/*`.

Quando o modelo de permissão é inicializado, ele adicionará automaticamente um curinga (*) se o diretório especificado existir. Por exemplo, se `/home/test/files` existir, ele será tratado como `/home/test/files/*`. No entanto, se o diretório não existir, o curinga não será adicionado e o acesso será limitado a `/home/test/files`. Se você quiser permitir o acesso a uma pasta que ainda não existe, certifique-se de incluir explicitamente o curinga: `/my-path/folder-do-not-exist/*`.


#### Restrições do Modelo de Permissões {#permission-model-constraints}

Existem restrições que você precisa conhecer antes de usar este sistema:

- O modelo não é herdado para um processo de nó filho ou thread de trabalho.
- Ao usar o Modelo de Permissões, os seguintes recursos serão restritos:
    - Módulos nativos
    - Processo filho
    - Threads de trabalho
    - Protocolo do Inspetor
    - Acesso ao sistema de arquivos
    - WASI


- O Modelo de Permissões é inicializado após a configuração do ambiente Node.js. No entanto, certas flags como `--env-file` ou `--openssl-config` são projetadas para ler arquivos antes da inicialização do ambiente. Como resultado, tais flags não estão sujeitas às regras do Modelo de Permissões. O mesmo se aplica às flags V8 que podem ser definidas via runtime através de `v8.setFlagsFromString`.
- Os mecanismos OpenSSL não podem ser solicitados em tempo de execução quando o Modelo de Permissões está habilitado, afetando os módulos crypto, https e tls integrados.
- As Extensões Carregáveis ​​em Tempo de Execução não podem ser carregadas quando o Modelo de Permissões está habilitado, afetando o módulo sqlite.
- O uso de descritores de arquivos existentes através do módulo `node:fs` ignora o Modelo de Permissões.

#### Limitações e Problemas Conhecidos {#limitations-and-known-issues}

- Links simbólicos serão seguidos mesmo para locais fora do conjunto de caminhos aos quais o acesso foi concedido. Links simbólicos relativos podem permitir o acesso a arquivos e diretórios arbitrários. Ao iniciar aplicativos com o modelo de permissão habilitado, você deve garantir que nenhum caminho ao qual o acesso foi concedido contenha links simbólicos relativos.

