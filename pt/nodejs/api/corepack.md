---
title: Documentação do Corepack do Node.js
description: Corepack é um binário distribuído com o Node.js, fornecendo uma interface padrão para gerenciar gerenciadores de pacotes como npm, pnpm e Yarn. Ele permite que os usuários alternem facilmente entre diferentes gerenciadores de pacotes e versões, garantindo compatibilidade e simplificando o fluxo de trabalho de desenvolvimento.
head:
  - - meta
    - name: og:title
      content: Documentação do Corepack do Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Corepack é um binário distribuído com o Node.js, fornecendo uma interface padrão para gerenciar gerenciadores de pacotes como npm, pnpm e Yarn. Ele permite que os usuários alternem facilmente entre diferentes gerenciadores de pacotes e versões, garantindo compatibilidade e simplificando o fluxo de trabalho de desenvolvimento.
  - - meta
    - name: twitter:title
      content: Documentação do Corepack do Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Corepack é um binário distribuído com o Node.js, fornecendo uma interface padrão para gerenciar gerenciadores de pacotes como npm, pnpm e Yarn. Ele permite que os usuários alternem facilmente entre diferentes gerenciadores de pacotes e versões, garantindo compatibilidade e simplificando o fluxo de trabalho de desenvolvimento.
---


# Corepack {#corepack}

**Adicionado em: v16.9.0, v14.19.0**

::: warning [Estável: 1 - Experimental]
[Estável: 1](/pt/nodejs/api/documentation#stability-index) [Estabilidade: 1](/pt/nodejs/api/documentation#stability-index) - Experimental
:::

*<a href="https://github.com/nodejs/corepack">Corepack</a>* é uma ferramenta experimental para ajudar no gerenciamento de versões de seus gerenciadores de pacotes. Ele expõe proxies binários para cada [gerenciador de pacotes suportado](/pt/nodejs/api/corepack#supported-package-managers) que, quando chamado, identificará qual gerenciador de pacotes está configurado para o projeto atual, fará o download, se necessário, e, finalmente, o executará.

Apesar de o Corepack ser distribuído com instalações padrão do Node.js, os gerenciadores de pacotes gerenciados pelo Corepack não fazem parte da distribuição do Node.js e:

- No primeiro uso, o Corepack baixa a versão mais recente da rede.
- Quaisquer atualizações necessárias (relacionadas a vulnerabilidades de segurança ou não) estão fora do escopo do projeto Node.js. Se necessário, os usuários finais devem descobrir como atualizar por conta própria.

Este recurso simplifica dois fluxos de trabalho principais:

- Facilita a integração de novos colaboradores, pois eles não precisarão mais seguir processos de instalação específicos do sistema apenas para ter o gerenciador de pacotes que você deseja que eles tenham.
- Permite que você garanta que todos em sua equipe usarão exatamente a versão do gerenciador de pacotes que você pretende que eles usem, sem que eles tenham que sincronizá-la manualmente cada vez que você precisar fazer uma atualização.

## Fluxos de trabalho {#workflows}

### Ativando o recurso {#enabling-the-feature}

Devido ao seu status experimental, o Corepack atualmente precisa ser explicitamente habilitado para ter algum efeito. Para fazer isso, execute [`corepack enable`](https://github.com/nodejs/corepack#corepack-enable--name), que configurará os symlinks em seu ambiente próximo ao binário `node` (e sobrescreverá os symlinks existentes, se necessário).

A partir deste ponto, qualquer chamada para os [binários suportados](/pt/nodejs/api/corepack#supported-package-managers) funcionará sem configuração adicional. Caso você tenha algum problema, execute [`corepack disable`](https://github.com/nodejs/corepack#corepack-disable--name) para remover os proxies do seu sistema (e considere abrir um problema no [repositório Corepack](https://github.com/nodejs/corepack) para nos avisar).


### Configurando um pacote {#configuring-a-package}

Os proxies do Corepack encontrarão o arquivo [`package.json`](/pt/nodejs/api/packages#nodejs-packagejson-field-definitions) mais próximo na hierarquia de diretórios atual para extrair sua propriedade [`"packageManager"`](/pt/nodejs/api/packages#packagemanager).

Se o valor corresponder a um [gerenciador de pacotes suportado](/pt/nodejs/api/corepack#supported-package-managers), o Corepack garantirá que todas as chamadas aos binários relevantes sejam executadas na versão solicitada, baixando-a sob demanda, se necessário, e abortando se não puder ser recuperada com sucesso.

Você pode usar [`corepack use`](https://github.com/nodejs/corepack#corepack-use-nameversion) para pedir ao Corepack para atualizar seu `package.json` local para usar o gerenciador de pacotes de sua escolha:

```bash [BASH]
corepack use  # define a versão 7.x mais recente no package.json
corepack use yarn@* # define a versão mais recente no package.json
```
### Atualizando as versões globais {#upgrading-the-global-versions}

Ao executar fora de um projeto existente (por exemplo, ao executar `yarn init`), o Corepack usará por padrão versões predefinidas correspondentes aproximadamente às versões estáveis mais recentes de cada ferramenta. Essas versões podem ser substituídas executando o comando [`corepack install`](https://github.com/nodejs/corepack#corepack-install--g--global---all--nameversion) junto com a versão do gerenciador de pacotes que você deseja definir:

```bash [BASH]
corepack install --global 
```
Alternativamente, uma tag ou intervalo pode ser usado:

```bash [BASH]
corepack install --global pnpm@*
corepack install --global yarn@stable
```
### Fluxo de trabalho offline {#offline-workflow}

Muitos ambientes de produção não têm acesso à rede. Como o Corepack geralmente baixa as versões do gerenciador de pacotes diretamente de seus registros, isso pode entrar em conflito com esses ambientes. Para evitar que isso aconteça, chame o comando [`corepack pack`](https://github.com/nodejs/corepack#corepack-pack---all--nameversion) enquanto você ainda tem acesso à rede (normalmente ao mesmo tempo em que está preparando sua imagem de implantação). Isso garantirá que os gerenciadores de pacotes necessários estejam disponíveis mesmo sem acesso à rede.

O comando `pack` tem [várias flags](https://github.com/nodejs/corepack#utility-commands). Consulte a [documentação detalhada do Corepack](https://github.com/nodejs/corepack#readme) para obter mais informações.


## Gerenciadores de pacotes suportados {#supported-package-managers}

Os seguintes binários são fornecidos através do Corepack:

| Gerenciador de pacotes | Nomes dos binários |
|---|---|
| [Yarn](https://yarnpkg.com/) | `yarn`, `yarnpkg` |
| [pnpm](https://pnpm.io/) | `pnpm`, `pnpx` |
## Perguntas frequentes {#common-questions}

### Como o Corepack interage com o npm? {#how-does-corepack-interact-with-npm?}

Embora o Corepack pudesse suportar o npm como qualquer outro gerenciador de pacotes, seus shims não são habilitados por padrão. Isso tem algumas consequências:

- É sempre possível executar um comando `npm` dentro de um projeto configurado para ser usado com outro gerenciador de pacotes, já que o Corepack não pode interceptá-lo.
- Embora `npm` seja uma opção válida na propriedade [`"packageManager"`](/pt/nodejs/api/packages#packagemanager), a falta de shim fará com que o npm global seja usado.

### Executar `npm install -g yarn` não funciona {#running-npm-install--g-yarn-doesnt-work}

O npm impede a substituição acidental dos binários do Corepack ao fazer uma instalação global. Para evitar este problema, considere uma das seguintes opções:

- Não execute este comando; O Corepack fornecerá os binários do gerenciador de pacotes de qualquer maneira e garantirá que as versões solicitadas estejam sempre disponíveis, portanto, instalar os gerenciadores de pacotes explicitamente não é necessário.
- Adicione a flag `--force` a `npm install`; isso dirá ao npm que está tudo bem substituir os binários, mas você apagará os do Corepack no processo. (Execute [`corepack enable`](https://github.com/nodejs/corepack#corepack-enable--name) para adicioná-los de volta.)

