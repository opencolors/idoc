---
title: Débogage de Node.js
description: Options de débogage de Node.js, notamment --inspect, --inspect-brk et --debug, ainsi que des scénarios de débogage à distance et des informations sur l'ancien débogueur.
head:
  - - meta
    - name: og:title
      content: Débogage de Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Options de débogage de Node.js, notamment --inspect, --inspect-brk et --debug, ainsi que des scénarios de débogage à distance et des informations sur l'ancien débogueur.
  - - meta
    - name: twitter:title
      content: Débogage de Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Options de débogage de Node.js, notamment --inspect, --inspect-brk et --debug, ainsi que des scénarios de débogage à distance et des informations sur l'ancien débogueur.
---


# Débogage de Node.js

Ce guide vous aidera à démarrer le débogage de vos applications et scripts Node.js.

## Activer l'inspecteur

Lorsqu'il est démarré avec l'option `--inspect`, un processus Node.js écoute un client de débogage. Par défaut, il écoute à l'hôte et au port `127.0.0.1:9229`. Chaque processus se voit également attribuer un UUID unique.

Les clients Inspector doivent connaître et spécifier l'adresse de l'hôte, le port et l'UUID pour se connecter. Une URL complète ressemblera à quelque chose comme `ws://127.0.0.1:9229/0f2c936f-b1cd-4ac9-aab3-f63b0f33d55e`.

Node.js commencera également à écouter les messages de débogage s'il reçoit un signal `SIGUSR1`. ( `SIGUSR1` n'est pas disponible sur Windows.) Dans Node.js 7 et versions antérieures, cela active l'API Debugger héritée. Dans Node.js 8 et versions ultérieures, cela activera l'API Inspector.

## Implications de sécurité

Étant donné que le débogueur a un accès complet à l'environnement d'exécution Node.js, un acteur malveillant capable de se connecter à ce port peut être en mesure d'exécuter du code arbitraire au nom du processus Node.js. Il est important de comprendre les implications de sécurité de l'exposition du port du débogueur sur les réseaux publics et privés.

### Exposer publiquement le port de débogage est dangereux

Si le débogueur est lié à une adresse IP publique ou à 0.0.0.0, tous les clients qui peuvent atteindre votre adresse IP pourront se connecter au débogueur sans aucune restriction et pourront exécuter du code arbitraire.

Par défaut, `node --inspect` se lie à 127.0.0.1. Vous devez explicitement fournir une adresse IP publique ou 0.0.0.0, etc., si vous avez l'intention d'autoriser les connexions externes au débogueur. Cela peut vous exposer à une menace de sécurité potentiellement importante. Nous vous suggérons de vous assurer que les pare-feu et les contrôles d'accès appropriés sont en place pour éviter une exposition de sécurité.

Consultez la section sur '[Activation des scénarios de débogage à distance](/fr/nodejs/guide/debugging-nodejs#enabling-remote-debugging-scenarios)' pour obtenir des conseils sur la façon d'autoriser en toute sécurité les clients de débogage à distance à se connecter.

### Les applications locales ont un accès complet à l'inspecteur

Même si vous liez le port de l'inspecteur à 127.0.0.1 (la valeur par défaut), toutes les applications s'exécutant localement sur votre machine auront un accès illimité. Ceci est intentionnel afin de permettre aux débogueurs locaux de se connecter facilement.


### Navigateurs, WebSockets et politique de même origine

Les sites web ouverts dans un navigateur web peuvent effectuer des requêtes WebSocket et HTTP dans le cadre du modèle de sécurité du navigateur. Une connexion HTTP initiale est nécessaire pour obtenir un identifiant de session de débogage unique. La politique de même origine empêche les sites web d'établir cette connexion HTTP. Pour une sécurité supplémentaire contre les [attaques de reliaison DNS](https://en.wikipedia.org/wiki/DNS_rebinding), Node.js vérifie que les en-têtes 'Host' de la connexion spécifient précisément une adresse IP ou `localhost`.

Ces politiques de sécurité interdisent la connexion à un serveur de débogage distant en spécifiant le nom d'hôte. Vous pouvez contourner cette restriction en spécifiant soit l'adresse IP, soit en utilisant des tunnels SSH comme décrit ci-dessous.

## Clients Inspector

Un débogueur CLI minimal est disponible avec la commande `node inspect myscript.js`. Plusieurs outils commerciaux et open source peuvent également se connecter à l'inspecteur Node.js.

### Chrome DevTools 55+, Microsoft Edge
+ **Option 1**: Ouvrez `chrome://inspect` dans un navigateur basé sur Chromium ou `edge://inspect` dans Edge. Cliquez sur le bouton Configurer et assurez-vous que votre hôte et votre port cibles sont répertoriés.
+ **Option 2**: Copiez l'`devtoolsFrontendUrl` de la sortie de `/json/list` (voir ci-dessus) ou du texte d'aide `--inspect` et collez-le dans Chrome.

Voir [https://github.com/ChromeDevTools/devtools-frontend](https://github.com/ChromeDevTools/devtools-frontend), [https://www.microsoftedgeinsider.com](https://www.microsoftedgeinsider.com) pour plus d'informations.

### Visual Studio Code 1.10+
+ Dans le panneau Débogage, cliquez sur l'icône des paramètres pour ouvrir `.vscode/launch.json`. Sélectionnez "Node.js" pour la configuration initiale.

Voir [https://github.com/microsoft/vscode](https://github.com/microsoft/vscode) pour plus d'informations.

### JetBrains WebStorm et autres IDE JetBrains

+ Créez une nouvelle configuration de débogage Node.js et lancez le débogage. `--inspect` sera utilisé par défaut pour Node.js 7+. Pour désactiver, décochez `js.debugger.node.use.inspect` dans le registre IDE. Pour en savoir plus sur l'exécution et le débogage de Node.js dans WebStorm et d'autres IDE JetBrains, consultez [l'aide en ligne de WebStorm](https://www.jetbrains.com/help/webstorm/running-and-debugging-node-js.html).


### chrome-remote-interface

+ Bibliothèque pour faciliter les connexions aux points de terminaison du [protocole Inspector](https://chromedevtools.github.io/debugger-protocol-viewer/v8/).
Voir [https://github.com/cyrus-and/chrome-remote-interface](https://github.com/cyrus-and/chrome-remote-interface) pour plus d'informations.

### Gitpod

+ Démarrez une configuration de débogage Node.js depuis la vue `Debug` ou appuyez sur `F5`. Instructions détaillées.

Voir [https://www.gitpod.io](https://www.gitpod.io) pour plus d'informations.

### Eclipse IDE avec l'extension Eclipse Wild Web Developer

+ À partir d'un fichier `.js`, choisissez `Debug As... > Node program`, ou créez une configuration de débogage pour attacher le débogueur à une application Node.js en cours d'exécution (déjà démarrée avec `--inspect`).

Voir [https://eclipse.org/eclipseide](https://eclipse.org/eclipseide) pour plus d'informations.

## Options de ligne de commande

Le tableau suivant répertorie l'impact de divers indicateurs d'exécution sur le débogage :

| Indicateur | Signification |
| --- | --- |
| `--inspect` | Active le débogage avec Node.js Inspector. Écoute sur l'adresse et le port par défaut (127.0.0.1:9229) |
| `--inspect-brk` | Active le débogage avec Node.js Inspector. Écoute sur l'adresse et le port par défaut (127.0.0.1:9229); S'arrête avant le démarrage du code utilisateur |
| `--inspect=[host:port]` | Active l'agent Inspector ; Se lie à l'adresse ou au nom d'hôte host (par défaut : 127.0.0.1) ; Écoute sur le port port (par défaut : 9229) |
| `--inspect-brk=[host:port]` | Active l'agent Inspector ; Se lie à l'adresse ou au nom d'hôte host (par défaut : 127.0.0.1) ; Écoute sur le port port (par défaut : 9229); S'arrête avant le démarrage du code utilisateur |
| `--inspect-wait` | Active l'agent Inspector ; Écoute sur l'adresse et le port par défaut (127.0.0.1:9229) ; Attend que le débogueur soit attaché. |
| `--inspect-wait=[host:port]` | Active l'agent Inspector ; Se lie à l'adresse ou au nom d'hôte host (par défaut : 127.0.0.1) ; Écoute sur le port port (par défaut : 9229) ; Attend que le débogueur soit attaché. |
| `node inspect script.js` | Crée un processus enfant pour exécuter le script de l'utilisateur avec l'indicateur --inspect ; et utilise le processus principal pour exécuter le débogueur CLI. |
| `node inspect --port=xxxx script.js` | Crée un processus enfant pour exécuter le script de l'utilisateur avec l'indicateur --inspect ; et utilise le processus principal pour exécuter le débogueur CLI. Écoute sur le port port (par défaut : 9229) |


## Activation des scénarios de débogage à distance

Nous recommandons de ne jamais faire écouter le débogueur sur une adresse IP publique. Si vous devez autoriser les connexions de débogage à distance, nous recommandons plutôt l'utilisation de tunnels ssh. Nous fournissons l'exemple suivant à des fins d'illustration uniquement. Veuillez comprendre le risque de sécurité lié à l'autorisation d'un accès distant à un service privilégié avant de continuer.

Supposons que vous exécutez Node.js sur une machine distante, remote.example.com, que vous souhaitez pouvoir déboguer. Sur cette machine, vous devez démarrer le processus Node avec l'inspecteur écoutant uniquement localhost (par défaut).

```bash
node --inspect app.js
```

Maintenant, sur votre machine locale à partir de laquelle vous souhaitez initier une connexion client de débogage, vous pouvez configurer un tunnel ssh :

```bash
ssh -L 9225:localhost:9229 remote.example.com
```

Cela démarre une session de tunnel ssh où une connexion au port 9225 sur votre machine locale sera redirigée vers le port 9229 sur remote.example.com. Vous pouvez maintenant attacher un débogueur tel que Chrome DevTools ou Visual Studio Code à localhost :9225, ce qui devrait permettre de déboguer comme si l'application Node.js s'exécutait localement.

## Débogueur hérité

**Le débogueur hérité a été déprécié depuis Node.js 7.7.0. Veuillez utiliser --inspect et Inspector à la place.**

Lorsqu'il est démarré avec les commutateurs `--debug` ou `--debug-brk` dans la version 7 et les versions antérieures, Node.js écoute les commandes de débogage définies par le protocole de débogage V8 abandonné sur un port TCP, par défaut `5858`. Tout client de débogage qui parle ce protocole peut se connecter au processus en cours d'exécution et le déboguer ; quelques exemples populaires sont énumérés ci-dessous.

Le protocole de débogage V8 n'est plus maintenu ni documenté.

### Débogueur intégré

Démarrez `node debug script_name.js` pour démarrer votre script sous le débogueur en ligne de commande intégré. Votre script démarre dans un autre processus Node.js démarré avec l'option `--debug-brk`, et le processus Node.js initial exécute le script `_debugger.js` et se connecte à votre cible. Voir [docs](/fr/nodejs/api/debugger) pour plus d'informations.


### node-inspector

Déboguez votre application Node.js avec Chrome DevTools en utilisant un processus intermédiaire qui traduit le [protocole Inspector](https://chromedevtools.github.io/debugger-protocol-viewer/v8/) utilisé dans Chromium vers le protocole V8 Debugger utilisé dans Node.js. Consultez [https://github.com/node-inspector/node-inspector](https://github.com/node-inspector/node-inspector) pour plus d'informations.

