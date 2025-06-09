---
title: Gráficos de chamas para otimização de desempenho do Node.js
description: Saiba como criar gráficos de chamas para visualizar o tempo de CPU gasto em funções e otimizar o desempenho do Node.js.
head:
  - - meta
    - name: og:title
      content: Gráficos de chamas para otimização de desempenho do Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Saiba como criar gráficos de chamas para visualizar o tempo de CPU gasto em funções e otimizar o desempenho do Node.js.
  - - meta
    - name: twitter:title
      content: Gráficos de chamas para otimização de desempenho do Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Saiba como criar gráficos de chamas para visualizar o tempo de CPU gasto em funções e otimizar o desempenho do Node.js.
---


# Gráficos de Chamas

## Para que serve um gráfico de chamas?

Gráficos de chamas são uma forma de visualizar o tempo de CPU gasto em funções. Eles podem ajudá-lo a identificar onde você gasta muito tempo fazendo operações síncronas.

## Como criar um gráfico de chamas

Você pode ter ouvido que criar um gráfico de chamas para Node.js é difícil, mas isso não é verdade (mais). VMs Solaris não são mais necessárias para gráficos de chamas!

Gráficos de chamas são gerados a partir da saída do `perf`, que não é uma ferramenta específica do Node. Embora seja a maneira mais poderosa de visualizar o tempo de CPU gasto, pode ter problemas com a forma como o código JavaScript é otimizado no Node.js 8 e superior. Consulte a seção [problemas de saída do perf](#perf-output-issues) abaixo.

### Use uma ferramenta pré-embalada
Se você quiser uma única etapa que produza um gráfico de chamas localmente, tente [0x](https://www.npmjs.com/package/0x)

Para diagnosticar implantações de produção, leia estas notas: [0x servidores de produção](https://github.com/davidmarkclements/0x/blob/master/docs/production-servers.md).

### Crie um gráfico de chamas com ferramentas perf do sistema
O objetivo deste guia é mostrar as etapas envolvidas na criação de um gráfico de chamas e mantê-lo no controle de cada etapa.

Se você quiser entender melhor cada etapa, dê uma olhada nas seções que seguem, onde entraremos em mais detalhes.

Agora vamos trabalhar.

1. Instale o `perf` (geralmente disponível através do pacote linux-tools-common se ainda não estiver instalado)
2. Tente executar o `perf` - ele pode reclamar sobre módulos do kernel ausentes, instale-os também
3. Execute o node com o perf habilitado (consulte [problemas de saída do perf](#perf-output-issues) para dicas específicas para versões do Node.js)
```bash
perf record -e cycles:u -g -- node --perf-basic-prof app.js
```
4. Ignore os avisos, a menos que digam que você não pode executar o perf devido a pacotes ausentes; você pode receber alguns avisos sobre não ser capaz de acessar amostras de módulos do kernel que você não está buscando de qualquer maneira.
5. Execute `perf script > perfs.out` para gerar o arquivo de dados que você visualizará em um momento. É útil aplicar alguma limpeza para um gráfico mais legível
6. Instale o stackvis se ainda não estiver instalado `npm i -g stackvis`
7. Execute `stackvis perf < perfs.out > flamegraph.htm`

Agora abra o arquivo de gráfico de chamas em seu navegador favorito e observe-o queimar. É codificado por cores para que você possa se concentrar primeiro nas barras laranja mais saturadas. É provável que representem funções pesadas de CPU.

Vale a pena mencionar - se você clicar em um elemento de um gráfico de chamas, um zoom de seus arredores será exibido acima do gráfico.


### Usando `perf` para amostrar um processo em execução

Isso é ótimo para gravar dados do gráfico de chamas de um processo já em execução que você não deseja interromper. Imagine um processo de produção com um problema difícil de reproduzir.

```bash
perf record -F99 -p `pgrep -n node` -- sleep 3
```

Para que serve esse `sleep 3`? Ele está lá para manter o perf em execução - apesar da opção `-p` apontar para um pid diferente, o comando precisa ser executado em um processo e terminar com ele. O perf é executado durante a vida útil do comando que você passa para ele, quer você esteja ou não realmente fazendo o profiling desse comando. `sleep 3` garante que o perf seja executado por 3 segundos.

Por que `-F` (frequência de profiling) está definido como 99? É um padrão razoável. Você pode ajustar se quiser. `-F99` diz ao perf para coletar 99 amostras por segundo, para mais precisão aumente o valor. Valores mais baixos devem produzir menos saída com resultados menos precisos. A precisão que você precisa depende de quanto tempo suas funções intensivas em CPU realmente são executadas. Se você está procurando o motivo de uma desaceleração notável, 99 quadros por segundo devem ser mais do que suficientes.

Depois de obter o registro perf de 3 segundos, prossiga com a geração do gráfico de chamas com as duas últimas etapas acima.

### Filtrando funções internas do Node.js

Normalmente, você só quer observar o desempenho de suas chamadas, então filtrar as funções internas do Node.js e do V8 pode tornar o gráfico muito mais fácil de ler. Você pode limpar seu arquivo perf com:

```bash
sed -i -r \
    -e '/(_libc_start|LazyCompile) |v8::internal::BuiltIn|Stub|LoadIC:\\[\\[' \
    -e '/^$/d' \
    perf.data > perf.out
```

Se você ler seu gráfico de chamas e parecer estranho, como se algo estivesse faltando na função chave que ocupa a maior parte do tempo, tente gerar seu gráfico de chamas sem os filtros - talvez você tenha um caso raro de um problema com o próprio Node.js.

### Opções de profiling do Node.js

`--perf-basic-prof-only-functions` e `--perf-basic-prof` são as duas que são úteis para depurar seu código JavaScript. Outras opções são usadas para fazer o profiling do próprio Node.js, o que está fora do escopo deste guia.

`--perf-basic-prof-only-functions` produz menos saída, então é a opção com a menor sobrecarga.


### Por que eu preciso deles?

Bem, sem essas opções, você ainda terá um flame graph, mas com a maioria das barras rotuladas como `v8::Function::Call`.

## Problemas com a saída do `Perf`

### Mudanças no pipeline do V8 no Node.js 8.x

O Node.js 8.x e superior vem com novas otimizações no pipeline de compilação JavaScript no mecanismo V8, o que torna os nomes/referências de funções inacessíveis para o perf às vezes. (É chamado de Turbofan)

O resultado é que você pode não obter os nomes das suas funções corretamente no flame graph.

Você notará `ByteCodeHandler:` onde esperaria nomes de funções.

O 0x tem algumas mitigações para isso integradas.

Para detalhes, veja:
- <https://github.com/nodejs/benchmarking/issues/168>
- <https://github.com/nodejs/diagnostics/issues/148#issuecomment-369348961>

### Node.js 10+

O Node.js 10.x resolve o problema com o Turbofan usando a flag `--interpreted-frames-native-stack`.

Execute `node --interpreted-frames-native-stack --perf-basic-prof-only-functions` para obter nomes de funções no flame graph, independentemente de qual pipeline o V8 usou para compilar seu JavaScript.

### Rótulos quebrados no flame graph

Se você estiver vendo rótulos parecendo com isso

```bash
node`_ZN2v88internal11interpreter17BytecodeGenerator15VisitStatementsEPMS0_8Zone
```

isso significa que o Linux perf que você está usando não foi compilado com suporte a demangle, veja <https://bugs.launchpad.net/ubuntu/+source/linux/+bug/1396654> por exemplo

## Exemplos

Pratique capturar flame graphs você mesmo com um [exercício de flame graph](https://github.com/naugtur/node-example-flamegraph)!

