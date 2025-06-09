---
title: Melhores práticas para trabalhar com diferentes sistemas de arquivos em Node.js
description: Saiba como lidar com diferentes sistemas de arquivos em Node.js, incluindo sensibilidade a maiúsculas e minúsculas, preservação de forma Unicode e resolução de carimbo de data/hora.
head:
  - - meta
    - name: og:title
      content: Melhores práticas para trabalhar com diferentes sistemas de arquivos em Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Saiba como lidar com diferentes sistemas de arquivos em Node.js, incluindo sensibilidade a maiúsculas e minúsculas, preservação de forma Unicode e resolução de carimbo de data/hora.
  - - meta
    - name: twitter:title
      content: Melhores práticas para trabalhar com diferentes sistemas de arquivos em Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Saiba como lidar com diferentes sistemas de arquivos em Node.js, incluindo sensibilidade a maiúsculas e minúsculas, preservação de forma Unicode e resolução de carimbo de data/hora.
---


# Como trabalhar com diferentes sistemas de arquivos

O Node.js expõe muitos recursos dos sistemas de arquivos. Mas nem todos os sistemas de arquivos são iguais. As seguintes são as melhores práticas sugeridas para manter seu código simples e seguro ao trabalhar com diferentes sistemas de arquivos.

## Comportamento do sistema de arquivos

Antes de trabalhar com um sistema de arquivos, você precisa saber como ele se comporta. Diferentes sistemas de arquivos se comportam de forma diferente e têm mais ou menos recursos do que outros: sensibilidade a maiúsculas e minúsculas, insensibilidade a maiúsculas e minúsculas, preservação de maiúsculas e minúsculas, preservação de forma Unicode, resolução de timestamp, atributos estendidos, inodes, permissões Unix, fluxos de dados alternativos etc.

Tenha cuidado ao inferir o comportamento do sistema de arquivos de `process.platform`. Por exemplo, não suponha que, porque seu programa está sendo executado no Darwin, você está, portanto, trabalhando em um sistema de arquivos que não diferencia maiúsculas de minúsculas (HFS+), pois o usuário pode estar usando um sistema de arquivos que diferencia maiúsculas de minúsculas (HFSX). Da mesma forma, não suponha que, porque seu programa está sendo executado no Linux, você está, portanto, trabalhando em um sistema de arquivos que oferece suporte a permissões e inodes do Unix, pois você pode estar em uma unidade externa, USB ou de rede específica que não oferece suporte.

O sistema operacional pode não facilitar a inferência do comportamento do sistema de arquivos, mas nem tudo está perdido. Em vez de manter uma lista de todos os sistemas de arquivos e comportamentos conhecidos (que sempre estará incompleta), você pode sondar o sistema de arquivos para ver como ele realmente se comporta. A presença ou ausência de certos recursos que são fáceis de sondar geralmente é suficiente para inferir o comportamento de outros recursos que são mais difíceis de sondar.

Lembre-se de que alguns usuários podem ter diferentes sistemas de arquivos montados em vários caminhos na árvore de trabalho.

## Evite uma abordagem de menor denominador comum

Você pode ser tentado a fazer com que seu programa se comporte como um sistema de arquivos de menor denominador comum, normalizando todos os nomes de arquivos para letras maiúsculas, normalizando todos os nomes de arquivos para a forma NFC Unicode e normalizando todos os timestamps de arquivos para, digamos, resolução de 1 segundo. Esta seria a abordagem de menor denominador comum.

Não faça isso. Você só seria capaz de interagir com segurança com um sistema de arquivos que tenha exatamente as mesmas características de menor denominador comum em todos os aspectos. Você não conseguiria trabalhar com sistemas de arquivos mais avançados da maneira que os usuários esperam e você encontraria colisões de nomes de arquivos ou timestamps. Você certamente perderia e corromperia os dados do usuário por meio de uma série de eventos dependentes complicados e criaria bugs que seriam difíceis, senão impossíveis, de resolver.

O que acontece quando você precisa mais tarde dar suporte a um sistema de arquivos que tem apenas resolução de timestamp de 2 segundos ou 24 horas? O que acontece quando o padrão Unicode avança para incluir um algoritmo de normalização ligeiramente diferente (como aconteceu no passado)?

Uma abordagem de menor denominador comum tenderia a tentar criar um programa portátil usando apenas chamadas de sistema "portáteis". Isso leva a programas que são vazados e, na verdade, não são portáteis.


## Adote uma Abordagem de Superconjunto

Aproveite ao máximo cada plataforma que você suporta adotando uma abordagem de superconjunto. Por exemplo, um programa de backup portátil deve sincronizar os btimes (o tempo de criação de um arquivo ou pasta) corretamente entre sistemas Windows, e não deve destruir ou alterar os btimes, mesmo que os btimes não sejam suportados em sistemas Linux. O mesmo programa de backup portátil deve sincronizar as permissões Unix corretamente entre sistemas Linux, e não deve destruir ou alterar as permissões Unix, mesmo que as permissões Unix não sejam suportadas em sistemas Windows.

Lide com diferentes sistemas de arquivos fazendo com que seu programa aja como um sistema de arquivos mais avançado. Suporte um superconjunto de todos os recursos possíveis: diferenciação de maiúsculas e minúsculas, preservação de maiúsculas e minúsculas, diferenciação de forma Unicode, preservação de forma Unicode, permissões Unix, timestamps de nanossegundos de alta resolução, atributos estendidos, etc.

Uma vez que você tenha a preservação de maiúsculas e minúsculas em seu programa, você sempre pode implementar a não diferenciação de maiúsculas e minúsculas se precisar interagir com um sistema de arquivos que não diferencia maiúsculas e minúsculas. Mas se você renunciar à preservação de maiúsculas e minúsculas em seu programa, você não pode interagir com segurança com um sistema de arquivos que preserva maiúsculas e minúsculas. O mesmo vale para a preservação da forma Unicode e a preservação da resolução de timestamp.

Se um sistema de arquivos fornecer um nome de arquivo em uma combinação de letras minúsculas e maiúsculas, mantenha o nome do arquivo exatamente no caso fornecido. Se um sistema de arquivos fornecer um nome de arquivo em forma Unicode mista ou NFC ou NFD (ou NFKC ou NFKD), mantenha o nome do arquivo na sequência de bytes exata fornecida. Se um sistema de arquivos fornecer um timestamp de milissegundos, mantenha o timestamp na resolução de milissegundos.

Quando você trabalha com um sistema de arquivos inferior, você sempre pode subamostrar apropriadamente, com funções de comparação conforme exigido pelo comportamento do sistema de arquivos no qual seu programa está sendo executado. Se você sabe que o sistema de arquivos não suporta permissões Unix, então você não deve esperar ler as mesmas permissões Unix que você escreve. Se você sabe que o sistema de arquivos não preserva o caso, então você deve estar preparado para ver `ABC` em uma listagem de diretório quando seu programa cria `abc`. Mas se você sabe que o sistema de arquivos preserva o caso, então você deve considerar `ABC` como um nome de arquivo diferente de `abc`, ao detectar renomeações de arquivos ou se o sistema de arquivos diferencia maiúsculas e minúsculas.


## Preservação de Caixa

Você pode criar um diretório chamado `test /abc` e se surpreender ao ver, às vezes, que `fs.readdir('test')` retorna `['ABC']`. Isso não é um bug no Node. O Node retorna o nome do arquivo como o sistema de arquivos o armazena, e nem todos os sistemas de arquivos suportam a preservação de caixa. Alguns sistemas de arquivos convertem todos os nomes de arquivos para maiúsculas (ou minúsculas).

## Preservação da Forma Unicode

A preservação de caixa e a preservação da forma Unicode são conceitos semelhantes. Para entender por que a forma Unicode deve ser preservada, certifique-se de que você primeiro entenda por que a caixa deve ser preservada. A preservação da forma Unicode é tão simples quando entendida corretamente. O Unicode pode codificar os mesmos caracteres usando várias sequências de bytes diferentes. Várias strings podem parecer iguais, mas têm sequências de bytes diferentes. Ao trabalhar com strings UTF-8, tenha cuidado para que suas expectativas estejam de acordo com a forma como o Unicode funciona. Assim como você não esperaria que todos os caracteres UTF-8 codificassem para um único byte, você não deveria esperar que várias strings UTF-8 que parecem iguais ao olho humano tenham a mesma representação de byte. Essa pode ser uma expectativa que você pode ter do ASCll, mas não do UTF-8.

Você pode criar um diretório chamado `test/ café` (forma Unicode NFC com a sequência de bytes `<63 61 66 c3 a9>` e `string.length ===5`) e se surpreender ao ver, às vezes, que `fs.readdir('test')` retorna `['café']` (forma Unicode NFD com a sequência de bytes `<63 61 66 65 cc 81>` e `string.length ===6`). Isso não é um bug no Node. Node.js retorna o nome do arquivo como o sistema de arquivos o armazena, e nem todos os sistemas de arquivos suportam a preservação da forma Unicode. HFS+, por exemplo, normalizará todos os nomes de arquivos para uma forma quase sempre a mesma que a forma NFD. Não espere que o HFS+ se comporte da mesma forma que o NTFS ou EXT 4 e vice-versa. Não tente alterar os dados permanentemente por meio da normalização como uma abstração com vazamento para encobrir as diferenças Unicode entre os sistemas de arquivos. Isso criaria problemas sem resolver nenhum. Em vez disso, preserve a forma Unicode e use a normalização apenas como uma função de comparação.


## Insensibilidade à Forma Unicode

A insensibilidade à forma Unicode e a preservação da forma Unicode são dois comportamentos diferentes do sistema de arquivos frequentemente confundidos. Assim como a diferenciação de maiúsculas e minúsculas às vezes foi implementada incorretamente normalizando permanentemente os nomes de arquivos para maiúsculas ao armazenar e transmitir nomes de arquivos, a insensibilidade à forma Unicode às vezes foi implementada incorretamente normalizando permanentemente os nomes de arquivos para uma determinada forma Unicode (NFD no caso do HFS+) ao armazenar e transmitir nomes de arquivos. É possível e muito melhor implementar a insensibilidade à forma Unicode sem sacrificar a preservação da forma Unicode, usando a normalização Unicode apenas para comparação.

## Comparando Diferentes Formas Unicode

O Node.js fornece `string.normalize ('NFC' / 'NFD')` que você pode usar para normalizar uma string UTF-8 para NFC ou NFD. Você nunca deve armazenar a saída desta função, mas usá-la apenas como parte de uma função de comparação para testar se duas strings UTF-8 seriam iguais para o usuário. Você pode usar `string1.normalize('NFC')=== string2.normalize('NFC')` ou `string1.normalize('NFD')=== string2.normalize('NFD')` como sua função de comparação. Qual forma você usa não importa.

A normalização é rápida, mas você pode querer usar um cache como entrada para sua função de comparação para evitar normalizar a mesma string várias vezes. Se a string não estiver presente no cache, normalize-a e armazene-a em cache. Tenha cuidado para não armazenar ou persistir o cache, use-o apenas como um cache.

Observe que o uso de `normalize ()` requer que sua versão do Node.js inclua ICU (caso contrário, `normalize ()` simplesmente retornará a string original). Se você baixar a versão mais recente do Node.js do site, ela incluirá o ICU.

## Resolução de Timestamp

Você pode definir o mtime (a hora de modificação) de um arquivo para 1444291759414 (resolução de milissegundos) e se surpreender ao ver às vezes que `fs.stat` retorna o novo mtime como 1444291759000 (resolução de 1 segundo) ou 1444291758000 (resolução de 2 segundos). Isso não é um bug no Node. O Node.js retorna o timestamp como o sistema de arquivos o armazena, e nem todos os sistemas de arquivos suportam resolução de nanossegundos, milissegundos ou 1 segundo para timestamp. Alguns sistemas de arquivos têm até mesmo uma resolução muito grosseira para o timestamp atime em particular, por exemplo, 24 horas para alguns sistemas de arquivos FAT.


## Não Corrompa Nomes de Arquivos e Carimbos de Data/Hora Através da Normalização

Nomes de arquivos e carimbos de data/hora são dados do usuário. Assim como você nunca reescreveria automaticamente os dados de arquivos do usuário para colocar os dados em maiúsculas ou normalizar CRLF para finalizações de linha LF, você nunca deve alterar, interferir ou corromper nomes de arquivos ou carimbos de data/hora por meio da normalização de caso / forma Unicode / carimbo de data/hora. A normalização deve ser usada apenas para comparação, nunca para alterar dados.

A normalização é efetivamente um código hash com perdas. Você pode usá-lo para testar certos tipos de equivalência (por exemplo, várias strings parecem iguais, embora tenham sequências de bytes diferentes), mas você nunca pode usá-lo como um substituto para os dados reais. Seu programa deve transmitir os dados de nome de arquivo e carimbo de data/hora como estão.

Seu programa pode criar novos dados em NFC (ou em qualquer combinação de forma Unicode que preferir) ou com um nome de arquivo em minúsculas ou maiúsculas, ou com um carimbo de data/hora com resolução de 2 segundos, mas seu programa não deve corromper os dados existentes do usuário impondo normalização de caso / forma Unicode / carimbo de data/hora. Em vez disso, adote uma abordagem de superconjunto e preserve o caso, a forma Unicode e a resolução do carimbo de data/hora em seu programa. Dessa forma, você poderá interagir com segurança com sistemas de arquivos que fazem o mesmo.

## Use Funções de Comparação de Normalização Adequadamente

Certifique-se de usar as funções de comparação de caso / forma Unicode / carimbo de data/hora adequadamente. Não use uma função de comparação de nome de arquivo que não diferencia maiúsculas de minúsculas se você estiver trabalhando em um sistema de arquivos que diferencia maiúsculas de minúsculas. Não use uma função de comparação que não diferencia a forma Unicode se você estiver trabalhando em um sistema de arquivos que diferencia a forma Unicode (por exemplo, NTFS e a maioria dos sistemas de arquivos Linux que preservam NFC e NFD ou formas Unicode mistas). Não compare carimbos de data/hora com resolução de 2 segundos se você estiver trabalhando em um sistema de arquivos com resolução de carimbo de data/hora de nanossegundos.

## Esteja Preparado para Ligeiras Diferenças nas Funções de Comparação

Tenha cuidado para que suas funções de comparação correspondam às do sistema de arquivos (ou sonde o sistema de arquivos, se possível, para ver como ele realmente compararia). A diferenciação entre maiúsculas e minúsculas, por exemplo, é mais complexa do que uma simples comparação `toLowerCase()`. Na verdade, `toUpperCase()` geralmente é melhor do que `toLowerCase ()` (já que lida com certos caracteres de idiomas estrangeiros de maneira diferente). Mas o melhor ainda seria sondar o sistema de arquivos, pois cada sistema de arquivos tem sua própria tabela de comparação de casos embutida.

Como exemplo, o HFS+ da Apple normaliza os nomes de arquivos para a forma NFD, mas esta forma NFD é, na verdade, uma versão mais antiga da forma NFD atual e pode, às vezes, ser ligeiramente diferente da forma NFD do padrão Unicode mais recente. Não espere que o HFS+ NFD seja exatamente o mesmo que o Unicode NFD o tempo todo.

