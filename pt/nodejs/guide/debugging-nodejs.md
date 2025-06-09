---
title: Depuração do Node.js
description: Opções de depuração do Node.js, incluindo --inspect, --inspect-brk e --debug, assim como cenários de depuração remota e informações sobre o depurador legado.
head:
  - - meta
    - name: og:title
      content: Depuração do Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Opções de depuração do Node.js, incluindo --inspect, --inspect-brk e --debug, assim como cenários de depuração remota e informações sobre o depurador legado.
  - - meta
    - name: twitter:title
      content: Depuração do Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Opções de depuração do Node.js, incluindo --inspect, --inspect-brk e --debug, assim como cenários de depuração remota e informações sobre o depurador legado.
---


# Depurando Node.js

Este guia ajudará você a começar a depurar seus aplicativos e scripts Node.js.

## Habilitar o Inspetor

Quando iniciado com a chave `--inspect`, um processo Node.js fica à escuta de um cliente de depuração. Por padrão, ele escutará no host e na porta `127.0.0.1:9229`. Cada processo também recebe um UUID exclusivo.

Os clientes do Inspetor devem conhecer e especificar o endereço do host, a porta e o UUID para se conectar. Um URL completo terá a seguinte aparência: `ws://127.0.0.1:9229/0f2c936f-b1cd-4ac9-aab3-f63b0f33d55e`.

O Node.js também começará a escutar mensagens de depuração se receber um sinal `SIGUSR1`. (O `SIGUSR1` não está disponível no Windows.) No Node.js 7 e versões anteriores, isso ativa a API de Depurador legado. No Node.js 8 e versões posteriores, ele ativará a API do Inspetor.

## Implicações de Segurança

Como o depurador tem acesso total ao ambiente de execução do Node.js, um agente malicioso capaz de se conectar a esta porta pode ser capaz de executar código arbitrário em nome do processo Node.js. É importante entender as implicações de segurança de expor a porta do depurador em redes públicas e privadas.

### Expor a porta de depuração publicamente não é seguro

Se o depurador estiver vinculado a um endereço IP público, ou a 0.0.0.0, quaisquer clientes que possam alcançar seu endereço IP poderão se conectar ao depurador sem qualquer restrição e poderão executar código arbitrário.

Por padrão, `node --inspect` se vincula a 127.0.0.1. Você precisa fornecer explicitamente um endereço IP público ou 0.0.0.0, etc., se pretende permitir conexões externas ao depurador. Fazer isso pode expô-lo a uma ameaça de segurança potencialmente significativa. Sugerimos que você garanta que firewalls e controles de acesso apropriados estejam em vigor para evitar uma exposição à segurança.

Consulte a seção sobre '[Habilitando cenários de depuração remota](/pt/nodejs/guide/debugging-nodejs#enabling-remote-debugging-scenarios)' para obter alguns conselhos sobre como permitir com segurança que clientes de depuração remota se conectem.

### Aplicativos locais têm acesso total ao inspetor

Mesmo se você vincular a porta do inspetor a 127.0.0.1 (o padrão), qualquer aplicativo em execução localmente em sua máquina terá acesso irrestrito. Isso é por design para permitir que depuradores locais consigam se conectar convenientemente.


### Navegadores, WebSockets e política de mesma origem

Websites abertos em um navegador web podem fazer requisições WebSocket e HTTP sob o modelo de segurança do navegador. Uma conexão HTTP inicial é necessária para obter um ID de sessão de depurador único. A política de mesma origem impede que os websites possam fazer esta conexão HTTP. Para segurança adicional contra [ataques de DNS rebinding](https://en.wikipedia.org/wiki/DNS_rebinding), o Node.js verifica se os cabeçalhos 'Host' para a conexão especificam um endereço IP ou `localhost` precisamente.

Estas políticas de segurança não permitem a conexão com um servidor de depuração remoto especificando o nome do host. Você pode contornar esta restrição especificando o endereço IP ou usando túneis SSH como descrito abaixo.

## Clientes do Inspector

Um depurador CLI mínimo está disponível com node inspect myscript.js. Várias ferramentas comerciais e de código aberto também podem se conectar ao Node.js Inspector.

### Chrome DevTools 55+, Microsoft Edge
+ **Opção 1**: Abra `chrome://inspect` em um navegador baseado no Chromium ou `edge://inspect` no Edge. Clique no botão Configure e certifique-se de que seu host e porta de destino estejam listados.
+ **Opção 2**: Copie o `devtoolsFrontendUrl` da saída de `/json/list` (veja acima) ou o texto de dica `--inspect` e cole no Chrome.

Veja [https://github.com/ChromeDevTools/devtools-frontend](https://github.com/ChromeDevTools/devtools-frontend), [https://www.microsoftedgeinsider.com](https://www.microsoftedgeinsider.com) para mais informações.

### Visual Studio Code 1.10+
+ No painel Debug, clique no ícone de configurações para abrir `.vscode/launch.json`. Selecione "Node.js" para a configuração inicial.

Veja [https://github.com/microsoft/vscode](https://github.com/microsoft/vscode) para mais informações.

### JetBrains WebStorm e outras IDEs JetBrains

+ Crie uma nova configuração de depuração Node.js e clique em Debug. `--inspect` será usado por padrão para Node.js 7+. Para desativar, desmarque `js.debugger.node.use.inspect` no Registro da IDE. Para saber mais sobre como executar e depurar Node.js no WebStorm e em outras IDEs JetBrains, confira a [ajuda online do WebStorm](https://www.jetbrains.com/help/webstorm/running-and-debugging-node-js.html).


### chrome-remote-interface

+ Biblioteca para facilitar as conexões aos endpoints do [Protocolo Inspector](https://chromedevtools.github.io/debugger-protocol-viewer/v8/).
Veja [https://github.com/cyrus-and/chrome-remote-interface](https://github.com/cyrus-and/chrome-remote-interface) para mais informações.

### Gitpod

+ Inicie uma configuração de depuração do Node.js a partir da view `Debug` ou pressione `F5`. Instruções detalhadas

Veja [https://www.gitpod.io](https://www.gitpod.io) para mais informações.

### Eclipse IDE com a extensão Eclipse Wild Web Developer

+ A partir de um arquivo `.js`, escolha `Debug As... > Node program`, ou Crie uma Configuração de Depuração para anexar o depurador ao aplicativo Node.js em execução (já iniciado com `--inspect`).

Veja [https://eclipse.org/eclipseide](https://eclipse.org/eclipseide) para mais informações.

## Opções de linha de comando

A tabela a seguir lista o impacto de várias flags de tempo de execução na depuração:

| Flag | Significado |
| --- | --- |
| `--inspect` | Ativa a depuração com o Inspector do Node.js. Escuta no endereço e porta padrão (127.0.0.1:9229) |
| `--inspect-brk` | Ativa a depuração com o Inspector do Node.js. Escuta no endereço e porta padrão (127.0.0.1:9229); Interrompe antes que o código do usuário comece |
| `--inspect=[host:port]` | Ativa o agente do inspector; Vincula ao endereço ou nome do host (padrão: 127.0.0.1); Escuta na porta (padrão: 9229) |
| `--inspect-brk=[host:port]` | Ativa o agente do inspector; Vincula ao endereço ou nome do host (padrão: 127.0.0.1); Escuta na porta (padrão: 9229); Interrompe antes que o código do usuário comece |
| `--inspect-wait` | Ativa o agente do inspector; Escuta no endereço e porta padrão (127.0.0.1:9229); Aguarda que o depurador seja anexado. |
| `--inspect-wait=[host:port]` | Ativa o agente do inspector; Vincula ao endereço ou nome do host (padrão: 127.0.0.1); Escuta na porta (padrão: 9229); Aguarda que o depurador seja anexado. |
| `node inspect script.js` | Gera um processo filho para executar o script do usuário sob a flag --inspect; e usa o processo principal para executar o depurador CLI. |
| `node inspect --port=xxxx script.js` | Gera um processo filho para executar o script do usuário sob a flag --inspect; e usa o processo principal para executar o depurador CLI. Escuta na porta (padrão: 9229) |


## Habilitando cenários de depuração remota

Recomendamos que você nunca deixe o depurador escutar em um endereço IP público. Se você precisar permitir conexões de depuração remota, recomendamos o uso de túneis SSH. Fornecemos o exemplo a seguir apenas para fins ilustrativos. Por favor, compreenda o risco de segurança de permitir acesso remoto a um serviço privilegiado antes de prosseguir.

Digamos que você esteja executando o Node.js em uma máquina remota, remote.example.com, que você deseja depurar. Nessa máquina, você deve iniciar o processo do node com o inspetor escutando apenas o localhost (o padrão).

```bash
node --inspect app.js
```

Agora, em sua máquina local de onde você deseja iniciar uma conexão de cliente de depuração, você pode configurar um túnel SSH:

```bash
ssh -L 9225:localhost:9229 remote.example.com
```

Isso inicia uma sessão de túnel SSH onde uma conexão com a porta 9221 em sua máquina local será encaminhada para a porta 9229 em remote.example.com. Agora você pode anexar um depurador como o Chrome DevTools ou o Visual Studio Code a localhost:9221, que deve ser capaz de depurar como se o aplicativo Node.js estivesse sendo executado localmente.

## Depurador Legado

**O depurador legado foi descontinuado a partir do Node.js 7.7.0. Por favor, use --inspect e Inspector em vez disso.**

Quando iniciado com as opções `--debug` ou `--debug-brk` na versão 7 e anteriores, o Node.js escuta comandos de depuração definidos pelo descontinuado V8 Debugging Protocol em uma porta TCP, por padrão `5858`. Qualquer cliente de depuração que fale este protocolo pode se conectar e depurar o processo em execução; alguns populares estão listados abaixo.

O V8 Debugging Protocol não é mais mantido ou documentado.

### Depurador Embutido

Inicie `node debug script_name.js` para iniciar seu script sob o depurador de linha de comando embutido. Seu script é iniciado em outro processo Node.js iniciado com a opção `--debug-brk`, e o processo Node.js inicial executa o script `_debugger.js` e se conecta ao seu alvo. Consulte [docs](/pt/nodejs/api/debugger) para mais informações.


### node-inspector

Depure o seu aplicativo Node.js com o Chrome DevTools usando um processo intermediário que traduz o [Inspector Protocol](https://chromedevtools.github.io/debugger-protocol-viewer/v8/) usado no Chromium para o protocolo V8 Debugger usado no Node.js. Veja [https://github.com/node-inspector/node-inspector](https://github.com/node-inspector/node-inspector) para mais informações.

