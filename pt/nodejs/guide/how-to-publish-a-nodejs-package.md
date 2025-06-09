---
title: Publicar um pacote Node-API
description: Saiba como publicar uma versão Node-API de um pacote ao lado de uma versão não Node-API e como introduzir uma dependência a uma versão Node-API de um pacote.
head:
  - - meta
    - name: og:title
      content: Publicar um pacote Node-API | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Saiba como publicar uma versão Node-API de um pacote ao lado de uma versão não Node-API e como introduzir uma dependência a uma versão Node-API de um pacote.
  - - meta
    - name: twitter:title
      content: Publicar um pacote Node-API | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Saiba como publicar uma versão Node-API de um pacote ao lado de uma versão não Node-API e como introduzir uma dependência a uma versão Node-API de um pacote.
---


# Como publicar um pacote Node-API

## Como publicar uma versão Node-API de um pacote juntamente com uma versão não Node-API

As etapas a seguir são ilustradas usando o pacote `iotivity-node`:

- Primeiro, publique a versão não Node-API:
    - Atualize a versão em `package.json`. Para `iotivity-node`, a versão se torna 1.2.0-2.
    - Passe pela lista de verificação de lançamento (garanta que testes/demos/docs estejam OK).
    - `npm publish`.

- Em seguida, publique a versão Node-API:
    - Atualize a versão em `package.json`. No caso de `iotivity-node`, a versão se torna 1.2.0-3. Para controle de versão, recomendamos seguir o esquema de versão de pré-lançamento conforme descrito por [semver.org](https://semver.org), por exemplo, 1.2.0-napi.
    - Passe pela lista de verificação de lançamento (garanta que testes/demos/docs estejam OK).
    - `npm publish --tag n-api`.

Neste exemplo, marcar o lançamento com `n-api` garantiu que, embora a versão 1.2.0-3 seja posterior à versão não Node-API publicada (1.2.0-2), ela não será instalada se alguém optar por instalar `iotivity-node` simplesmente executando `npm install iotivity-node`. Isso instalará a versão não Node-API por padrão. O usuário terá que executar `npm install iotivity-node@n api` para receber a versão Node-API. Para obter mais informações sobre como usar tags com npm, confira "Usando dist-tags".

## Como introduzir uma dependência em uma versão Node-API de um pacote

Para adicionar a versão Node-API de `iotivity-node` como uma dependência, o `package.json` ficará assim:

```json
"dependencies": {
  "iotivity-node": "n-api"
}
```

Conforme explicado em "Usando dist-tags", ao contrário das versões regulares, as versões marcadas não podem ser endereçadas por intervalos de versão como `"^2.0.0"` dentro de `package.json`. A razão para isso é que a tag se refere a exatamente uma versão. Portanto, se o mantenedor do pacote optar por marcar uma versão posterior do pacote usando a mesma tag, `npm update` receberá a versão posterior. Isso deve ser uma versão aceitável diferente da mais recente publicada, a dependência `package.json` terá que se referir à versão exata como a seguinte:

```json
"dependencies": {
  "iotivity-node": "1.2.0-3"
}
```
