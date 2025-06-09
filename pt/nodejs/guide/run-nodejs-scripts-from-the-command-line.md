---
title: Executar scripts Node.js a partir da linha de comando
description: Saiba como executar programas Node.js a partir da linha de comando, incluindo o uso do comando node, linhas shebang, permissões de execução, passar strings como argumentos e reiniciar automaticamente a aplicação.
head:
  - - meta
    - name: og:title
      content: Executar scripts Node.js a partir da linha de comando | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Saiba como executar programas Node.js a partir da linha de comando, incluindo o uso do comando node, linhas shebang, permissões de execução, passar strings como argumentos e reiniciar automaticamente a aplicação.
  - - meta
    - name: twitter:title
      content: Executar scripts Node.js a partir da linha de comando | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Saiba como executar programas Node.js a partir da linha de comando, incluindo o uso do comando node, linhas shebang, permissões de execução, passar strings como argumentos e reiniciar automaticamente a aplicação.
---


# Executar scripts Node.js na linha de comando

A maneira usual de executar um programa Node.js é executar o comando `node` disponível globalmente (depois de instalar o Node.js) e passar o nome do arquivo que você deseja executar.

Se o arquivo principal do seu aplicativo Node.js for `app.js`, você pode chamá-lo digitando:

```bash
node app.js
```

Acima, você está explicitamente dizendo ao shell para executar seu script com `node`. Você também pode incorporar essas informações em seu arquivo JavaScript com uma linha "shebang". O "shebang" é a primeira linha do arquivo e informa ao SO qual interpretador usar para executar o script. Abaixo está a primeira linha do JavaScript:

```javascript
#!/usr/bin/node
```

Acima, estamos explicitamente fornecendo o caminho absoluto do interpretador. Nem todos os sistemas operacionais têm `node` na pasta `bin`, mas todos devem ter `env`. Você pode dizer ao SO para executar `env` com `node` como parâmetro:

```javascript
#!/usr/bin/env node
// seu código javascript
```

## Para usar um shebang, seu arquivo deve ter permissão de execução.

Você pode dar a `app.js` a permissão de execução executando:

```bash
chmod u+x app.js
```

Ao executar o comando, certifique-se de estar no mesmo diretório que contém o arquivo `app.js`.

## Passe a string como argumento para o nó em vez do caminho do arquivo

Para executar uma string como argumento, você pode usar `-e`, `--eval "script"`. Avalie o seguinte argumento como JavaScript. Os módulos predefinidos no REPL também podem ser usados ​​no script. No Windows, usando `cmd.exe`, uma única aspa não funcionará corretamente porque ele só reconhece aspas duplas `"` para citação. No Powershell ou Git bash, ambos `"` e `'` são utilizáveis.

```bash
node -e "console.log(123)"
```

## Reinicie o aplicativo automaticamente

A partir do nodejs V 16, existe uma opção integrada para reiniciar automaticamente o aplicativo quando um arquivo é alterado. Isso é útil para fins de desenvolvimento. Para usar este recurso, você precisa passar a flag `watch` para o nodejs.

```bash
node --watch app.js
```

Assim, quando você altera o arquivo, o aplicativo é reiniciado automaticamente. Leia a documentação da flag --watch [/api/cli#watch](https://nodejs.org/api/cli.html#--watch).

