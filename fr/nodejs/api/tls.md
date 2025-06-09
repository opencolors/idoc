---
title: Documentation Node.js - TLS (Sécurité de la couche de transport)
description: Cette section de la documentation Node.js traite du module TLS (Sécurité de la couche de transport), qui fournit une implémentation des protocoles TLS et SSL. Elle inclut des détails sur la création de connexions sécurisées, la gestion des certificats, la gestion de la communication sécurisée et diverses options pour configurer TLS/SSL dans les applications Node.js.
head:
  - - meta
    - name: og:title
      content: Documentation Node.js - TLS (Sécurité de la couche de transport) | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Cette section de la documentation Node.js traite du module TLS (Sécurité de la couche de transport), qui fournit une implémentation des protocoles TLS et SSL. Elle inclut des détails sur la création de connexions sécurisées, la gestion des certificats, la gestion de la communication sécurisée et diverses options pour configurer TLS/SSL dans les applications Node.js.
  - - meta
    - name: twitter:title
      content: Documentation Node.js - TLS (Sécurité de la couche de transport) | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Cette section de la documentation Node.js traite du module TLS (Sécurité de la couche de transport), qui fournit une implémentation des protocoles TLS et SSL. Elle inclut des détails sur la création de connexions sécurisées, la gestion des certificats, la gestion de la communication sécurisée et diverses options pour configurer TLS/SSL dans les applications Node.js.
---


# TLS (SSL) {#tls-ssl}

::: tip [Stable: 2 - Stable]
[Stable: 2](/fr/nodejs/api/documentation#stability-index) [Stability: 2](/fr/nodejs/api/documentation#stability-index) - Stable
:::

**Code source :** [lib/tls.js](https://github.com/nodejs/node/blob/v23.5.0/lib/tls.js)

Le module `node:tls` fournit une implémentation des protocoles Transport Layer Security (TLS) et Secure Socket Layer (SSL) qui est construite au-dessus d'OpenSSL. Le module est accessible en utilisant :

::: code-group
```js [ESM]
import tls from 'node:tls';
```

```js [CJS]
const tls = require('node:tls');
```
:::

## Déterminer si la prise en charge de crypto est indisponible {#determining-if-crypto-support-is-unavailable}

Il est possible que Node.js soit compilé sans inclure la prise en charge du module `node:crypto`. Dans de tels cas, tenter d'`importer` depuis `tls` ou d'appeler `require('node:tls')` entraînera le déclenchement d'une erreur.

Lors de l'utilisation de CommonJS, l'erreur déclenchée peut être interceptée à l'aide de try/catch :

```js [CJS]
let tls;
try {
  tls = require('node:tls');
} catch (err) {
  console.error('tls support is disabled!');
}
```
Lors de l'utilisation du mot-clé lexical ESM `import`, l'erreur ne peut être interceptée que si un gestionnaire pour `process.on('uncaughtException')` est enregistré *avant* toute tentative de chargement du module (en utilisant, par exemple, un module de préchargement).

Lors de l'utilisation d'ESM, s'il existe une chance que le code soit exécuté sur une version de Node.js où la prise en charge de crypto n'est pas activée, envisagez d'utiliser la fonction [`import()`](https://developer.mozilla.org/fr-FR/docs/Web/JavaScript/Reference/Operators/import) au lieu du mot-clé lexical `import` :

```js [ESM]
let tls;
try {
  tls = await import('node:tls');
} catch (err) {
  console.error('tls support is disabled!');
}
```
## Concepts TLS/SSL {#tls/ssl-concepts}

TLS/SSL est un ensemble de protocoles qui reposent sur une infrastructure à clé publique (PKI) pour permettre une communication sécurisée entre un client et un serveur. Dans la plupart des cas courants, chaque serveur doit avoir une clé privée.

Les clés privées peuvent être générées de plusieurs manières. L'exemple ci-dessous illustre l'utilisation de l'interface de ligne de commande OpenSSL pour générer une clé privée RSA de 2048 bits :

```bash [BASH]
openssl genrsa -out ryans-key.pem 2048
```
Avec TLS/SSL, tous les serveurs (et certains clients) doivent avoir un *certificat*. Les certificats sont des *clés publiques* qui correspondent à une clé privée, et qui sont signées numériquement soit par une Autorité de Certification, soit par le propriétaire de la clé privée (ces certificats sont appelés "auto-signés"). La première étape pour obtenir un certificat est de créer un fichier de *Demande de Signature de Certificat* (CSR).

L'interface de ligne de commande OpenSSL peut être utilisée pour générer une CSR pour une clé privée :

```bash [BASH]
openssl req -new -sha256 -key ryans-key.pem -out ryans-csr.pem
```
Une fois le fichier CSR généré, il peut soit être envoyé à une Autorité de Certification pour signature, soit être utilisé pour générer un certificat auto-signé.

La création d'un certificat auto-signé à l'aide de l'interface de ligne de commande OpenSSL est illustrée dans l'exemple ci-dessous :

```bash [BASH]
openssl x509 -req -in ryans-csr.pem -signkey ryans-key.pem -out ryans-cert.pem
```
Une fois le certificat généré, il peut être utilisé pour générer un fichier `.pfx` ou `.p12` :

```bash [BASH]
openssl pkcs12 -export -in ryans-cert.pem -inkey ryans-key.pem \
      -certfile ca-cert.pem -out ryans.pfx
```
Où :

- `in` : est le certificat signé
- `inkey` : est la clé privée associée
- `certfile` : est une concaténation de tous les certificats d'Autorité de Certification (CA) dans un seul fichier, par exemple `cat ca1-cert.pem ca2-cert.pem \> ca-cert.pem`


### Secret parfait persistant {#perfect-forward-secrecy}

Le terme *<a href="https://en.wikipedia.org/wiki/Perfect_forward_secrecy">secret persistant</a>* ou *secret parfait persistant* décrit une caractéristique des méthodes d'accord de clé (c'est-à-dire d'échange de clés). C'est-à-dire que les clés du serveur et du client sont utilisées pour négocier de nouvelles clés temporaires qui sont utilisées spécifiquement et uniquement pour la session de communication en cours. Concrètement, cela signifie que même si la clé privée du serveur est compromise, la communication ne peut être déchiffrée par les espions que si l'attaquant parvient à obtenir la paire de clés spécifiquement générée pour la session.

Le secret parfait persistant est obtenu en générant aléatoirement une paire de clés pour l'accord de clé à chaque handshake TLS/SSL (contrairement à l'utilisation de la même clé pour toutes les sessions). Les méthodes mettant en œuvre cette technique sont appelées « éphémères ».

Actuellement, deux méthodes sont couramment utilisées pour obtenir un secret parfait persistant (notez le caractère « E » ajouté aux abréviations traditionnelles) :

- [ECDHE](https://en.wikipedia.org/wiki/Elliptic_curve_Diffie%E2%80%93Hellman) : Une version éphémère du protocole d'accord de clé Diffie-Hellman à courbe elliptique.
- [DHE](https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange) : Une version éphémère du protocole d'accord de clé Diffie-Hellman.

Le secret parfait persistant utilisant ECDHE est activé par défaut. L'option `ecdhCurve` peut être utilisée lors de la création d'un serveur TLS pour personnaliser la liste des courbes ECDH prises en charge à utiliser. Voir [`tls.createServer()`](/fr/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener) pour plus d'informations.

DHE est désactivé par défaut mais peut être activé avec ECDHE en définissant l'option `dhparam` sur `'auto'`. Les paramètres DHE personnalisés sont également pris en charge, mais déconseillés au profit de paramètres bien connus sélectionnés automatiquement.

Le secret parfait persistant était facultatif jusqu'à TLSv1.2. À partir de TLSv1.3, (EC)DHE est toujours utilisé (à l'exception des connexions PSK uniquement).

### ALPN et SNI {#alpn-and-sni}

ALPN (Application-Layer Protocol Negotiation Extension) et SNI (Server Name Indication) sont des extensions de handshake TLS :

- ALPN : Permet l'utilisation d'un serveur TLS pour plusieurs protocoles (HTTP, HTTP/2)
- SNI : Permet l'utilisation d'un serveur TLS pour plusieurs noms d'hôtes avec différents certificats.


### Clés pré-partagées {#pre-shared-keys}

La prise en charge de TLS-PSK est disponible comme alternative à l'authentification normale basée sur les certificats. Il utilise une clé pré-partagée au lieu de certificats pour authentifier une connexion TLS, fournissant une authentification mutuelle. TLS-PSK et l'infrastructure à clé publique ne s'excluent pas mutuellement. Les clients et les serveurs peuvent prendre en charge les deux, en choisissant l'un ou l'autre pendant l'étape normale de négociation du chiffrement.

TLS-PSK n'est un bon choix que lorsqu'il existe des moyens de partager en toute sécurité une clé avec chaque machine connectée, il ne remplace donc pas l'infrastructure à clé publique (PKI) pour la majorité des utilisations de TLS. L'implémentation de TLS-PSK dans OpenSSL a connu de nombreuses failles de sécurité ces dernières années, principalement parce qu'elle n'est utilisée que par une minorité d'applications. Veuillez considérer toutes les solutions alternatives avant de passer aux chiffrements PSK. Lors de la génération de PSK, il est d'une importance capitale d'utiliser une entropie suffisante, comme indiqué dans [RFC 4086](https://tools.ietf.org/html/rfc4086). Dériver un secret partagé à partir d'un mot de passe ou d'autres sources à faible entropie n'est pas sûr.

Les chiffrements PSK sont désactivés par défaut, et l'utilisation de TLS-PSK nécessite donc de spécifier explicitement une suite de chiffrement avec l'option `ciphers`. La liste des chiffrements disponibles peut être récupérée via `openssl ciphers -v 'PSK'`. Tous les chiffrements TLS 1.3 sont éligibles pour PSK et peuvent être récupérés via `openssl ciphers -v -s -tls1_3 -psk`. Sur la connexion client, un `checkServerIdentity` personnalisé doit être passé car celui par défaut échouera en l'absence d'un certificat.

Selon la [RFC 4279](https://tools.ietf.org/html/rfc4279), les identités PSK jusqu'à 128 octets et les PSK jusqu'à 64 octets doivent être pris en charge. Depuis OpenSSL 1.1.0, la taille maximale de l'identité est de 128 octets et la longueur maximale du PSK est de 256 octets.

L'implémentation actuelle ne prend pas en charge les rappels PSK asynchrones en raison des limitations de l'API OpenSSL sous-jacente.

Pour utiliser TLS-PSK, le client et le serveur doivent spécifier l'option `pskCallback`, une fonction qui renvoie le PSK à utiliser (qui doit être compatible avec le condensé du chiffrement sélectionné).

Elle sera appelée en premier sur le client :

- hint : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) message facultatif envoyé par le serveur pour aider le client à décider quelle identité utiliser pendant la négociation. Toujours `null` si TLS 1.3 est utilisé.
- Retour : [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) sous la forme `{ psk : \<Buffer|TypedArray|DataView\>, identity : \<string\> }` ou `null`.

Puis sur le serveur :

- socket : [\<tls.TLSSocket\>](/fr/nodejs/api/tls#class-tlstlssocket) l'instance de socket du serveur, équivalente à `this`.
- identity : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) paramètre d'identité envoyé par le client.
- Retour : [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) le PSK (ou `null`).

Une valeur de retour de `null` arrête le processus de négociation et envoie un message d'alerte `unknown_psk_identity` à l'autre partie. Si le serveur souhaite masquer le fait que l'identité PSK n'était pas connue, le rappel doit fournir des données aléatoires comme `psk` pour faire échouer la connexion avec `decrypt_error` avant la fin de la négociation.


### Atténuation des attaques de renégociation initiées par le client {#client-initiated-renegotiation-attack-mitigation}

Le protocole TLS permet aux clients de renégocier certains aspects de la session TLS. Malheureusement, la renégociation de session nécessite une quantité disproportionnée de ressources côté serveur, ce qui en fait un vecteur potentiel d'attaques par déni de service.

Pour atténuer ce risque, la renégociation est limitée à trois fois toutes les dix minutes. Un événement `'error'` est émis sur l'instance [`tls.TLSSocket`](/fr/nodejs/api/tls#class-tlstlssocket) lorsque ce seuil est dépassé. Les limites sont configurables :

- `tls.CLIENT_RENEG_LIMIT` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Spécifie le nombre de demandes de renégociation. **Par défaut :** `3`.
- `tls.CLIENT_RENEG_WINDOW` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Spécifie la fenêtre de temps de renégociation en secondes. **Par défaut :** `600` (10 minutes).

Les limites de renégociation par défaut ne doivent pas être modifiées sans une compréhension complète des implications et des risques.

TLSv1.3 ne prend pas en charge la renégociation.

### Reprise de session {#session-resumption}

L'établissement d'une session TLS peut être relativement lent. Le processus peut être accéléré en enregistrant et en réutilisant ultérieurement l'état de la session. Il existe plusieurs mécanismes pour ce faire, présentés ici du plus ancien au plus récent (et préféré).

#### Identificateurs de session {#session-identifiers}

Les serveurs génèrent un ID unique pour les nouvelles connexions et l'envoient au client. Les clients et les serveurs enregistrent l'état de la session. Lors de la reconnexion, les clients envoient l'ID de leur état de session enregistré et si le serveur a également l'état pour cet ID, il peut accepter de l'utiliser. Sinon, le serveur créera une nouvelle session. Voir [RFC 2246](https://www.ietf.org/rfc/rfc2246.txt) pour plus d'informations, pages 23 et 30.

La reprise à l'aide d'identificateurs de session est prise en charge par la plupart des navigateurs Web lors de l'exécution de requêtes HTTPS.

Pour Node.js, les clients attendent l'événement [`'session'`](/fr/nodejs/api/tls#event-session) pour obtenir les données de session, et fournissent les données à l'option `session` d'un [`tls.connect()`](/fr/nodejs/api/tls#tlsconnectoptions-callback) ultérieur pour réutiliser la session. Les serveurs doivent implémenter des gestionnaires pour les événements [`'newSession'`](/fr/nodejs/api/tls#event-newsession) et [`'resumeSession'`](/fr/nodejs/api/tls#event-resumesession) pour enregistrer et restaurer les données de session en utilisant l'ID de session comme clé de recherche pour réutiliser les sessions. Pour réutiliser les sessions sur les équilibreurs de charge ou les workers de cluster, les serveurs doivent utiliser un cache de session partagé (tel que Redis) dans leurs gestionnaires de session.


#### Tickets de session {#session-tickets}

Les serveurs chiffrent l'état complet de la session et l'envoient au client sous forme de "ticket". Lors de la reconnexion, l'état est envoyé au serveur lors de la connexion initiale. Ce mécanisme évite d'avoir besoin d'un cache de session côté serveur. Si le serveur n'utilise pas le ticket, pour quelque raison que ce soit (échec de déchiffrement, il est trop ancien, etc.), il créera une nouvelle session et enverra un nouveau ticket. Voir [RFC 5077](https://tools.ietf.org/html/rfc5077) pour plus d'informations.

La reprise de session à l'aide de tickets de session est de plus en plus couramment prise en charge par de nombreux navigateurs Web lors de la réalisation de requêtes HTTPS.

Pour Node.js, les clients utilisent les mêmes API pour la reprise de session avec des identifiants de session que pour la reprise de session avec des tickets de session. Pour le débogage, si [`tls.TLSSocket.getTLSTicket()`](/fr/nodejs/api/tls#tlssocketgettlsticket) renvoie une valeur, les données de session contiennent un ticket, sinon elles contiennent l'état de la session côté client.

Avec TLSv1.3, sachez que plusieurs tickets peuvent être envoyés par le serveur, ce qui entraîne plusieurs événements `'session'`, voir [`'session'`](/fr/nodejs/api/tls#event-session) pour plus d'informations.

Les serveurs monoposte n'ont besoin d'aucune implémentation spécifique pour utiliser les tickets de session. Pour utiliser les tickets de session lors des redémarrages du serveur ou des équilibreurs de charge, les serveurs doivent tous avoir les mêmes clés de ticket. Il existe trois clés internes de 16 octets, mais l'API tls les expose sous forme d'un seul tampon de 48 octets pour plus de commodité.

Il est possible d'obtenir les clés de ticket en appelant [`server.getTicketKeys()`](/fr/nodejs/api/tls#servergetticketkeys) sur une instance de serveur, puis de les distribuer, mais il est plus raisonnable de générer de manière sécurisée 48 octets de données aléatoires sécurisées et de les définir avec l'option `ticketKeys` de [`tls.createServer()`](/fr/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener). Les clés doivent être régénérées régulièrement et les clés du serveur peuvent être réinitialisées avec [`server.setTicketKeys()`](/fr/nodejs/api/tls#serversetticketkeyskeys).

Les clés de ticket de session sont des clés cryptographiques, et elles *<strong>doivent être stockées en toute sécurité</strong>*. Avec TLS 1.2 et les versions antérieures, si elles sont compromises, toutes les sessions qui utilisaient des tickets chiffrés avec elles peuvent être déchiffrées. Elles ne doivent pas être stockées sur le disque et elles doivent être régénérées régulièrement.

Si les clients annoncent la prise en charge des tickets, le serveur les enverra. Le serveur peut désactiver les tickets en fournissant `require('node:constants').SSL_OP_NO_TICKET` dans `secureOptions`.

Les identifiants de session et les tickets de session expirent, ce qui amène le serveur à créer de nouvelles sessions. Le délai d'expiration peut être configuré avec l'option `sessionTimeout` de [`tls.createServer()`](/fr/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener).

Pour tous les mécanismes, lorsque la reprise de session échoue, les serveurs créent de nouvelles sessions. Étant donné que l'échec de la reprise de la session n'entraîne pas d'échec de la connexion TLS/HTTPS, il est facile de ne pas remarquer des performances TLS inutilement médiocres. L'interface de ligne de commande OpenSSL peut être utilisée pour vérifier que les serveurs reprennent les sessions. Utilisez l'option `-reconnect` de `openssl s_client`, par exemple :

```bash [BASH]
openssl s_client -connect localhost:443 -reconnect
```
Lisez la sortie de débogage. La première connexion doit indiquer "New", par exemple :

```text [TEXT]
New, TLSv1.2, Cipher is ECDHE-RSA-AES128-GCM-SHA256
```
Les connexions suivantes doivent indiquer "Reused", par exemple :

```text [TEXT]
Reused, TLSv1.2, Cipher is ECDHE-RSA-AES128-GCM-SHA256
```

## Modification de la suite de chiffrement TLS par défaut {#modifying-the-default-tls-cipher-suite}

Node.js est construit avec une suite par défaut de chiffrements TLS activés et désactivés. Cette liste de chiffrements par défaut peut être configurée lors de la construction de Node.js pour permettre aux distributions de fournir leur propre liste par défaut.

La commande suivante peut être utilisée pour afficher la suite de chiffrement par défaut :

```bash [BASH]
node -p crypto.constants.defaultCoreCipherList | tr ':' '\n'
TLS_AES_256_GCM_SHA384
TLS_CHACHA20_POLY1305_SHA256
TLS_AES_128_GCM_SHA256
ECDHE-RSA-AES128-GCM-SHA256
ECDHE-ECDSA-AES128-GCM-SHA256
ECDHE-RSA-AES256-GCM-SHA384
ECDHE-ECDSA-AES256-GCM-SHA384
DHE-RSA-AES128-GCM-SHA256
ECDHE-RSA-AES128-SHA256
DHE-RSA-AES128-SHA256
ECDHE-RSA-AES256-SHA384
DHE-RSA-AES256-SHA384
ECDHE-RSA-AES256-SHA256
DHE-RSA-AES256-SHA256
HIGH
!aNULL
!eNULL
!EXPORT
!DES
!RC4
!MD5
!PSK
!SRP
!CAMELLIA
```
Cette valeur par défaut peut être entièrement remplacée à l’aide du commutateur de ligne de commande [`--tls-cipher-list`](/fr/nodejs/api/cli#--tls-cipher-listlist) (directement ou via la variable d’environnement [`NODE_OPTIONS`](/fr/nodejs/api/cli#node_optionsoptions)). Par exemple, ce qui suit fait de `ECDHE-RSA-AES128-GCM-SHA256:!RC4` la suite de chiffrement TLS par défaut :

```bash [BASH]
node --tls-cipher-list='ECDHE-RSA-AES128-GCM-SHA256:!RC4' server.js

export NODE_OPTIONS=--tls-cipher-list='ECDHE-RSA-AES128-GCM-SHA256:!RC4'
node server.js
```
Pour vérifier, utilisez la commande suivante pour afficher la liste des chiffrements définie, notez la différence entre `defaultCoreCipherList` et `defaultCipherList` :

```bash [BASH]
node --tls-cipher-list='ECDHE-RSA-AES128-GCM-SHA256:!RC4' -p crypto.constants.defaultCipherList | tr ':' '\n'
ECDHE-RSA-AES128-GCM-SHA256
!RC4
```
c’est-à-dire que la liste `defaultCoreCipherList` est définie au moment de la compilation et que la liste `defaultCipherList` est définie au moment de l’exécution.

Pour modifier les suites de chiffrement par défaut depuis l’exécution, modifiez la variable `tls.DEFAULT_CIPHERS`, cela doit être fait avant d’écouter sur des sockets, cela n’affectera pas les sockets déjà ouverts. Par exemple :

```js [ESM]
// Supprimer les chiffrements CBC obsolètes et les chiffrements basés sur l’échange de clés RSA, car ils n’offrent pas de confidentialité persistante
tls.DEFAULT_CIPHERS +=
  ':!ECDHE-RSA-AES128-SHA:!ECDHE-RSA-AES128-SHA256:!ECDHE-RSA-AES256-SHA:!ECDHE-RSA-AES256-SHA384' +
  ':!ECDHE-ECDSA-AES128-SHA:!ECDHE-ECDSA-AES128-SHA256:!ECDHE-ECDSA-AES256-SHA:!ECDHE-ECDSA-AES256-SHA384' +
  ':!kRSA';
```
La valeur par défaut peut également être remplacée par client ou serveur en utilisant l’option `ciphers` de [`tls.createSecureContext()`](/fr/nodejs/api/tls#tlscreatesecurecontextoptions), qui est également disponible dans [`tls.createServer()`](/fr/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener), [`tls.connect()`](/fr/nodejs/api/tls#tlsconnectoptions-callback), et lors de la création de nouveaux [`tls.TLSSocket`](/fr/nodejs/api/tls#class-tlstlssocket)s.

La liste des chiffrements peut contenir un mélange de noms de suites de chiffrement TLSv1.3, ceux qui commencent par `'TLS_'`, et des spécifications pour les suites de chiffrement TLSv1.2 et antérieures. Les chiffrements TLSv1.2 prennent en charge un format de spécification hérité, consultez la documentation d’OpenSSL sur le [format de liste de chiffrements](https://www.openssl.org/docs/man1.1.1/man1/ciphers#CIPHER-LIST-FORMAT) pour plus de détails, mais ces spécifications ne s’appliquent *pas* aux chiffrements TLSv1.3. Les suites TLSv1.3 ne peuvent être activées qu’en incluant leur nom complet dans la liste des chiffrements. Ils ne peuvent pas, par exemple, être activés ou désactivés en utilisant la spécification héritée TLSv1.2 `'EECDH'` ou `'!EECDH'`.

Malgré l’ordre relatif des suites de chiffrement TLSv1.3 et TLSv1.2, le protocole TLSv1.3 est beaucoup plus sûr que TLSv1.2, et sera toujours choisi par rapport à TLSv1.2 si la négociation indique qu’il est pris en charge, et si des suites de chiffrement TLSv1.3 sont activées.

La suite de chiffrement par défaut incluse dans Node.js a été soigneusement sélectionnée pour refléter les meilleures pratiques de sécurité actuelles et l’atténuation des risques. La modification de la suite de chiffrement par défaut peut avoir un impact significatif sur la sécurité d’une application. Le commutateur `--tls-cipher-list` et l’option `ciphers` ne doivent être utilisés qu’en cas d’absolue nécessité.

La suite de chiffrement par défaut préfère les chiffrements GCM pour le [paramètre de « cryptographie moderne » de Chrome](https://www.chromium.org/Home/chromium-security/education/tls#TOC-Cipher-Suites) et préfère également les chiffrements ECDHE et DHE pour la confidentialité persistante parfaite, tout en offrant *une certaine* compatibilité descendante.

Les anciens clients qui s’appuient sur des chiffrements RC4 ou DES non sécurisés et obsolètes (comme Internet Explorer 6) ne peuvent pas terminer le processus de négociation avec la configuration par défaut. Si ces clients *doivent* être pris en charge, les [recommandations TLS](https://wiki.mozilla.org/Security/Server_Side_TLS) peuvent offrir une suite de chiffrement compatible. Pour plus de détails sur le format, consultez la documentation d’OpenSSL sur le [format de liste de chiffrement](https://www.openssl.org/docs/man1.1.1/man1/ciphers#CIPHER-LIST-FORMAT).

Il n’y a que cinq suites de chiffrement TLSv1.3 :

- `'TLS_AES_256_GCM_SHA384'`
- `'TLS_CHACHA20_POLY1305_SHA256'`
- `'TLS_AES_128_GCM_SHA256'`
- `'TLS_AES_128_CCM_SHA256'`
- `'TLS_AES_128_CCM_8_SHA256'`

Les trois premières sont activées par défaut. Les deux suites basées sur `CCM` sont prises en charge par TLSv1.3 car elles peuvent être plus performantes sur les systèmes contraints, mais elles ne sont pas activées par défaut car elles offrent moins de sécurité.


## Niveau de sécurité OpenSSL {#openssl-security-level}

La bibliothèque OpenSSL applique des niveaux de sécurité pour contrôler le niveau minimal acceptable de sécurité pour les opérations cryptographiques. Les niveaux de sécurité d'OpenSSL vont de 0 à 5, chaque niveau imposant des exigences de sécurité plus strictes. Le niveau de sécurité par défaut est 1, ce qui est généralement approprié pour la plupart des applications modernes. Cependant, certaines fonctionnalités et protocoles hérités, tels que TLSv1, nécessitent un niveau de sécurité inférieur (`SECLEVEL=0`) pour fonctionner correctement. Pour des informations plus détaillées, veuillez consulter la [documentation OpenSSL sur les niveaux de sécurité](https://www.openssl.org/docs/manmaster/man3/SSL_CTX_set_security_level#DEFAULT-CALLBACK-BEHAVIOUR).

### Définition des niveaux de sécurité {#setting-security-levels}

Pour ajuster le niveau de sécurité dans votre application Node.js, vous pouvez inclure `@SECLEVEL=X` dans une chaîne de chiffrement, où `X` est le niveau de sécurité souhaité. Par exemple, pour définir le niveau de sécurité sur 0 tout en utilisant la liste de chiffrement OpenSSL par défaut, vous pouvez utiliser :

::: code-group
```js [ESM]
import { createServer, connect } from 'node:tls';
const port = 443;

createServer({ ciphers: 'DEFAULT@SECLEVEL=0', minVersion: 'TLSv1' }, function(socket) {
  console.log('Client connected with protocol:', socket.getProtocol());
  socket.end();
  this.close();
})
.listen(port, () => {
  connect(port, { ciphers: 'DEFAULT@SECLEVEL=0', maxVersion: 'TLSv1' });
});
```

```js [CJS]
const { createServer, connect } = require('node:tls');
const port = 443;

createServer({ ciphers: 'DEFAULT@SECLEVEL=0', minVersion: 'TLSv1' }, function(socket) {
  console.log('Client connected with protocol:', socket.getProtocol());
  socket.end();
  this.close();
})
.listen(port, () => {
  connect(port, { ciphers: 'DEFAULT@SECLEVEL=0', maxVersion: 'TLSv1' });
});
```
:::

Cette approche définit le niveau de sécurité sur 0, permettant l'utilisation de fonctionnalités héritées tout en tirant parti des chiffrements OpenSSL par défaut.

### Utilisation {#using}

Vous pouvez également définir le niveau de sécurité et les chiffrements à partir de la ligne de commande en utilisant `--tls-cipher-list=DEFAULT@SECLEVEL=X` comme décrit dans [Modification de la suite de chiffrement TLS par défaut](/fr/nodejs/api/tls#modifying-the-default-tls-cipher-suite). Cependant, il est généralement déconseillé d'utiliser l'option de ligne de commande pour définir les chiffrements et il est préférable de configurer les chiffrements pour des contextes individuels dans votre code d'application, car cette approche offre un contrôle plus précis et réduit le risque d'abaisser globalement le niveau de sécurité.


## Codes d'erreur de certificat X509 {#x509-certificate-error-codes}

Plusieurs fonctions peuvent échouer en raison d'erreurs de certificat signalées par OpenSSL. Dans un tel cas, la fonction fournit un [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) via son rappel qui a la propriété `code` qui peut prendre l'une des valeurs suivantes :

- `'UNABLE_TO_GET_ISSUER_CERT'`: Impossible d'obtenir le certificat de l'émetteur.
- `'UNABLE_TO_GET_CRL'`: Impossible d'obtenir la liste de révocation des certificats (CRL).
- `'UNABLE_TO_DECRYPT_CERT_SIGNATURE'`: Impossible de déchiffrer la signature du certificat.
- `'UNABLE_TO_DECRYPT_CRL_SIGNATURE'`: Impossible de déchiffrer la signature de la CRL.
- `'UNABLE_TO_DECODE_ISSUER_PUBLIC_KEY'`: Impossible de décoder la clé publique de l'émetteur.
- `'CERT_SIGNATURE_FAILURE'`: Échec de la signature du certificat.
- `'CRL_SIGNATURE_FAILURE'`: Échec de la signature de la CRL.
- `'CERT_NOT_YET_VALID'`: Le certificat n'est pas encore valide.
- `'CERT_HAS_EXPIRED'`: Le certificat a expiré.
- `'CRL_NOT_YET_VALID'`: La CRL n'est pas encore valide.
- `'CRL_HAS_EXPIRED'`: La CRL a expiré.
- `'ERROR_IN_CERT_NOT_BEFORE_FIELD'`: Erreur de format dans le champ notBefore du certificat.
- `'ERROR_IN_CERT_NOT_AFTER_FIELD'`: Erreur de format dans le champ notAfter du certificat.
- `'ERROR_IN_CRL_LAST_UPDATE_FIELD'`: Erreur de format dans le champ lastUpdate de la CRL.
- `'ERROR_IN_CRL_NEXT_UPDATE_FIELD'`: Erreur de format dans le champ nextUpdate de la CRL.
- `'OUT_OF_MEM'`: Mémoire insuffisante.
- `'DEPTH_ZERO_SELF_SIGNED_CERT'`: Certificat auto-signé.
- `'SELF_SIGNED_CERT_IN_CHAIN'`: Certificat auto-signé dans la chaîne de certificats.
- `'UNABLE_TO_GET_ISSUER_CERT_LOCALLY'`: Impossible d'obtenir le certificat de l'émetteur localement.
- `'UNABLE_TO_VERIFY_LEAF_SIGNATURE'`: Impossible de vérifier le premier certificat.
- `'CERT_CHAIN_TOO_LONG'`: Chaîne de certificats trop longue.
- `'CERT_REVOKED'`: Certificat révoqué.
- `'INVALID_CA'`: Certificat CA non valide.
- `'PATH_LENGTH_EXCEEDED'`: Contrainte de longueur de chemin dépassée.
- `'INVALID_PURPOSE'`: Objectif de certificat non pris en charge.
- `'CERT_UNTRUSTED'`: Certificat non fiable.
- `'CERT_REJECTED'`: Certificat rejeté.
- `'HOSTNAME_MISMATCH'`: Incompatibilité du nom d'hôte.


## Class: `tls.CryptoStream` {#class-tlscryptostream}

**Ajouté dans: v0.3.4**

**Déprécié depuis: v0.11.3**

::: danger [Stable: 0 - Déprécié]
[Stable: 0](/fr/nodejs/api/documentation#stability-index) [Stability: 0](/fr/nodejs/api/documentation#stability-index) - Déprécié: Utiliser [`tls.TLSSocket`](/fr/nodejs/api/tls#class-tlstlssocket) à la place.
:::

La classe `tls.CryptoStream` représente un flux de données chiffrées. Cette classe est dépréciée et ne doit plus être utilisée.

### `cryptoStream.bytesWritten` {#cryptostreambyteswritten}

**Ajouté dans: v0.3.4**

**Déprécié depuis: v0.11.3**

La propriété `cryptoStream.bytesWritten` renvoie le nombre total d'octets écrits dans le socket sous-jacent *y compris* les octets nécessaires à l'implémentation du protocole TLS.

## Class: `tls.SecurePair` {#class-tlssecurepair}

**Ajouté dans: v0.3.2**

**Déprécié depuis: v0.11.3**

::: danger [Stable: 0 - Déprécié]
[Stable: 0](/fr/nodejs/api/documentation#stability-index) [Stability: 0](/fr/nodejs/api/documentation#stability-index) - Déprécié: Utiliser [`tls.TLSSocket`](/fr/nodejs/api/tls#class-tlstlssocket) à la place.
:::

Retourné par [`tls.createSecurePair()`](/fr/nodejs/api/tls#tlscreatesecurepaircontext-isserver-requestcert-rejectunauthorized-options).

### Event: `'secure'` {#event-secure}

**Ajouté dans: v0.3.2**

**Déprécié depuis: v0.11.3**

L'événement `'secure'` est émis par l'objet `SecurePair` une fois qu'une connexion sécurisée a été établie.

Comme pour la vérification de l'événement serveur [`'secureConnection'`](/fr/nodejs/api/tls#event-secureconnection), `pair.cleartext.authorized` doit être inspecté pour confirmer si le certificat utilisé est correctement autorisé.

## Class: `tls.Server` {#class-tlsserver}

**Ajouté dans: v0.3.2**

- Étend: [\<net.Server\>](/fr/nodejs/api/net#class-netserver)

Accepte les connexions chiffrées en utilisant TLS ou SSL.

### Event: `'connection'` {#event-connection}

**Ajouté dans: v0.3.2**

- `socket` [\<stream.Duplex\>](/fr/nodejs/api/stream#class-streamduplex)

Cet événement est émis lorsqu'un nouveau flux TCP est établi, avant que la négociation TLS ne commence. `socket` est généralement un objet de type [`net.Socket`](/fr/nodejs/api/net#class-netsocket) mais ne recevra pas d'événements contrairement au socket créé à partir de l'événement `'connection'` de [`net.Server`](/fr/nodejs/api/net#class-netserver). Généralement, les utilisateurs ne voudront pas accéder à cet événement.

Cet événement peut également être émis explicitement par les utilisateurs pour injecter des connexions dans le serveur TLS. Dans ce cas, n'importe quel flux [`Duplex`](/fr/nodejs/api/stream#class-streamduplex) peut être passé.


### Événement : `'keylog'` {#event-keylog}

**Ajouté dans : v12.3.0, v10.20.0**

- `line` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) Ligne de texte ASCII, au format NSS `SSLKEYLOGFILE`.
- `tlsSocket` [\<tls.TLSSocket\>](/fr/nodejs/api/tls#class-tlstlssocket) L’instance `tls.TLSSocket` sur laquelle il a été généré.

L’événement `keylog` est émis lorsque le matériel de clé est généré ou reçu par une connexion à ce serveur (généralement avant la fin de la négociation, mais pas nécessairement). Ce matériel de clé peut être stocké à des fins de débogage, car il permet de déchiffrer le trafic TLS capturé. Il peut être émis plusieurs fois pour chaque socket.

Un cas d’utilisation typique consiste à ajouter les lignes reçues à un fichier texte commun, qui est ensuite utilisé par un logiciel (tel que Wireshark) pour déchiffrer le trafic :

```js [ESM]
const logFile = fs.createWriteStream('/tmp/ssl-keys.log', { flags: 'a' });
// ...
server.on('keylog', (line, tlsSocket) => {
  if (tlsSocket.remoteAddress !== '...')
    return; // Consigner uniquement les clés pour une adresse IP particulière
  logFile.write(line);
});
```
### Événement : `'newSession'` {#event-newsession}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v0.11.12 | L’argument `callback` est désormais pris en charge. |
| v0.9.2 | Ajouté dans : v0.9.2 |
:::

L’événement `'newSession'` est émis lors de la création d’une nouvelle session TLS. Il peut être utilisé pour stocker des sessions dans un stockage externe. Les données doivent être fournies au callback [`'resumeSession'`](/fr/nodejs/api/tls#event-resumesession).

Le callback de l’écouteur reçoit trois arguments lors de son appel :

- `sessionId` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) L’identifiant de session TLS
- `sessionData` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) Les données de session TLS
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Une fonction de callback ne prenant aucun argument qui doit être appelée pour que les données soient envoyées ou reçues via la connexion sécurisée.

L’écoute de cet événement n’aura d’effet que sur les connexions établies après l’ajout de l’écouteur d’événements.

### Événement : `'OCSPRequest'` {#event-ocsprequest}

**Ajouté dans : v0.11.13**

L’événement `'OCSPRequest'` est émis lorsque le client envoie une requête d’état de certificat. Le callback de l’écouteur reçoit trois arguments lors de son appel :

- `certificate` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) Le certificat du serveur
- `issuer` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) Le certificat de l’émetteur
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Une fonction de callback qui doit être appelée pour fournir les résultats de la requête OCSP.

Le certificat actuel du serveur peut être analysé pour obtenir l’URL OCSP et l’ID de certificat ; après avoir obtenu une réponse OCSP, `callback(null, resp)` est ensuite appelé, où `resp` est une instance de `Buffer` contenant la réponse OCSP. `certificate` et `issuer` sont tous deux des représentations DER `Buffer` des certificats primaire et de l’émetteur. Ils peuvent être utilisés pour obtenir l’ID de certificat OCSP et l’URL du point de terminaison OCSP.

Alternativement, `callback(null, null)` peut être appelé, indiquant qu’il n’y avait pas de réponse OCSP.

L’appel de `callback(err)` entraînera un appel à `socket.destroy(err)`.

Le flux typique d’une requête OCSP est le suivant :

L’`issuer` peut être `null` si le certificat est auto-signé ou si l’émetteur ne figure pas dans la liste des certificats racine. (Un émetteur peut être fourni via l’option `ca` lors de l’établissement de la connexion TLS.)

L’écoute de cet événement n’aura d’effet que sur les connexions établies après l’ajout de l’écouteur d’événements.

Un module npm comme [asn1.js](https://www.npmjs.com/package/asn1.js) peut être utilisé pour analyser les certificats.


### Événement : `'resumeSession'` {#event-resumesession}

**Ajouté dans : v0.9.2**

L’événement `'resumeSession'` est émis lorsque le client demande la reprise d’une session TLS précédente. Le rappel de l’écouteur reçoit deux arguments lors de son appel :

- `sessionId` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) L’identificateur de session TLS
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Une fonction de rappel à appeler lorsque la session précédente a été récupérée : `callback([err[, sessionData]])`
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `sessionData` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer)

L’écouteur d’événements doit effectuer une recherche dans le stockage externe des `sessionData` enregistrées par le gestionnaire d’événements [`'newSession'`](/fr/nodejs/api/tls#event-newsession) à l’aide de l’ID `sessionId` donné. S’il est trouvé, appelez `callback(null, sessionData)` pour reprendre la session. Si ce n’est pas le cas, la session ne peut pas être reprise. `callback()` doit être appelé sans `sessionData` afin que la négociation puisse continuer et qu’une nouvelle session puisse être créée. Il est possible d’appeler `callback(err)` pour mettre fin à la connexion entrante et détruire le socket.

L’écoute de cet événement n’aura d’effet que sur les connexions établies après l’ajout de l’écouteur d’événements.

L’exemple suivant illustre la reprise d’une session TLS :

```js [ESM]
const tlsSessionStore = {};
server.on('newSession', (id, data, cb) => {
  tlsSessionStore[id.toString('hex')] = data;
  cb();
});
server.on('resumeSession', (id, cb) => {
  cb(null, tlsSessionStore[id.toString('hex')] || null);
});
```
### Événement : `'secureConnection'` {#event-secureconnection}

**Ajouté dans : v0.3.2**

L’événement `'secureConnection'` est émis une fois le processus de négociation pour une nouvelle connexion terminé avec succès. Le rappel de l’écouteur reçoit un seul argument lors de son appel :

- `tlsSocket` [\<tls.TLSSocket\>](/fr/nodejs/api/tls#class-tlstlssocket) Le socket TLS établi.

La propriété `tlsSocket.authorized` est une valeur `boolean` indiquant si le client a été vérifié par l’une des autorités de certification fournies pour le serveur. Si `tlsSocket.authorized` est `false`, alors `socket.authorizationError` est défini pour décrire comment l’autorisation a échoué. En fonction des paramètres du serveur TLS, les connexions non autorisées peuvent toujours être acceptées.

La propriété `tlsSocket.alpnProtocol` est une chaîne de caractères qui contient le protocole ALPN sélectionné. Lorsque ALPN n’a pas de protocole sélectionné parce que le client ou le serveur n’a pas envoyé d’extension ALPN, `tlsSocket.alpnProtocol` est égal à `false`.

La propriété `tlsSocket.servername` est une chaîne de caractères contenant le nom du serveur demandé via SNI.


### Événement : `'tlsClientError'` {#event-tlsclienterror}

**Ajouté dans : v6.0.0**

L'événement `'tlsClientError'` est émis lorsqu'une erreur se produit avant qu'une connexion sécurisée ne soit établie. Le rappel de l'écouteur reçoit deux arguments lorsqu'il est appelé :

- `exception` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) L'objet `Error` décrivant l'erreur.
- `tlsSocket` [\<tls.TLSSocket\>](/fr/nodejs/api/tls#class-tlstlssocket) L'instance `tls.TLSSocket` d'où provient l'erreur.

### `server.addContext(hostname, context)` {#serveraddcontexthostname-context}

**Ajouté dans : v0.5.3**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un nom d'hôte SNI ou un caractère générique (par exemple, `'*'`)
- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<tls.SecureContext\>](/fr/nodejs/api/tls#tlscreatesecurecontextoptions) Un objet contenant l'une des propriétés possibles des arguments `options` de [`tls.createSecureContext()`](/fr/nodejs/api/tls#tlscreatesecurecontextoptions) (par exemple, `key`, `cert`, `ca`, etc.), ou un objet de contexte TLS créé avec [`tls.createSecureContext()`](/fr/nodejs/api/tls#tlscreatesecurecontextoptions) lui-même.

La méthode `server.addContext()` ajoute un contexte sécurisé qui sera utilisé si le nom SNI de la requête du client correspond au `hostname` fourni (ou au caractère générique).

Lorsqu'il existe plusieurs contextes correspondants, celui qui a été ajouté le plus récemment est utilisé.

### `server.address()` {#serveraddress}

**Ajouté dans : v0.6.0**

- Retourne : [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Renvoie l'adresse liée, le nom de la famille d'adresses et le port du serveur tel que rapporté par le système d'exploitation. Voir [`net.Server.address()`](/fr/nodejs/api/net#serveraddress) pour plus d'informations.

### `server.close([callback])` {#serverclosecallback}

**Ajouté dans : v0.3.2**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Un rappel d'écouteur qui sera enregistré pour écouter l'événement `'close'` de l'instance du serveur.
- Retourne : [\<tls.Server\>](/fr/nodejs/api/tls#class-tlsserver)

La méthode `server.close()` empêche le serveur d'accepter de nouvelles connexions.

Cette fonction fonctionne de manière asynchrone. L'événement `'close'` sera émis lorsque le serveur n'aura plus de connexions ouvertes.


### `server.getTicketKeys()` {#servergetticketkeys}

**Ajouté dans : v3.0.0**

- Retourne : [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) Un tampon de 48 octets contenant les clés du ticket de session.

Retourne les clés du ticket de session.

Voir [Reprise de session](/fr/nodejs/api/tls#session-resumption) pour plus d’informations.

### `server.listen()` {#serverlisten}

Démarre le serveur en écoutant les connexions chiffrées. Cette méthode est identique à [`server.listen()`](/fr/nodejs/api/net#serverlisten) de [`net.Server`](/fr/nodejs/api/net#class-netserver).

### `server.setSecureContext(options)` {#serversetsecurecontextoptions}

**Ajouté dans : v11.0.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un objet contenant l’une des propriétés possibles des arguments `options` de [`tls.createSecureContext()`](/fr/nodejs/api/tls#tlscreatesecurecontextoptions) (par exemple, `key`, `cert`, `ca`, etc.).

La méthode `server.setSecureContext()` remplace le contexte sécurisé d’un serveur existant. Les connexions existantes au serveur ne sont pas interrompues.

### `server.setTicketKeys(keys)` {#serversetticketkeyskeys}

**Ajouté dans : v3.0.0**

- `keys` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Un tampon de 48 octets contenant les clés du ticket de session.

Définit les clés du ticket de session.

Les modifications apportées aux clés du ticket ne sont effectives que pour les futures connexions au serveur. Les connexions au serveur existantes ou en attente utiliseront les clés précédentes.

Voir [Reprise de session](/fr/nodejs/api/tls#session-resumption) pour plus d’informations.

## Class : `tls.TLSSocket` {#class-tlstlssocket}

**Ajouté dans : v0.11.4**

- Hérite de : [\<net.Socket\>](/fr/nodejs/api/net#class-netsocket)

Effectue un chiffrement transparent des données écrites et toutes les négociations TLS requises.

Les instances de `tls.TLSSocket` implémentent l’interface [Stream](/fr/nodejs/api/stream#stream) duplex.

Les méthodes qui renvoient des métadonnées de connexion TLS (par exemple, [`tls.TLSSocket.getPeerCertificate()`](/fr/nodejs/api/tls#tlssocketgetpeercertificatedetailed)) ne renvoient des données que lorsque la connexion est ouverte.


### `new tls.TLSSocket(socket[, options])` {#new-tlstlssocketsocket-options}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v12.2.0 | L'option `enableTrace` est désormais prise en charge. |
| v5.0.0 | Les options ALPN sont désormais prises en charge. |
| v0.11.4 | Ajoutée dans : v0.11.4 |
:::

- `socket` [\<net.Socket\>](/fr/nodejs/api/net#class-netsocket) | [\<stream.Duplex\>](/fr/nodejs/api/stream#class-streamduplex) Côté serveur, n'importe quel flux `Duplex`. Côté client, toute instance de [`net.Socket`](/fr/nodejs/api/net#class-netsocket) (pour la prise en charge générique du flux `Duplex` côté client, [`tls.connect()`](/fr/nodejs/api/tls#tlsconnectoptions-callback) doit être utilisé).
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `enableTrace`: Voir [`tls.createServer()`](/fr/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `isServer`: Le protocole SSL/TLS est asymétrique, les TLSSockets doivent savoir s'ils doivent se comporter comme un serveur ou un client. Si `true`, le socket TLS sera instancié en tant que serveur. **Par défaut:** `false`.
    - `server` [\<net.Server\>](/fr/nodejs/api/net#class-netserver) Une instance [`net.Server`](/fr/nodejs/api/net#class-netserver).
    - `requestCert`: Indique s'il faut authentifier le pair distant en demandant un certificat. Les clients demandent toujours un certificat de serveur. Les serveurs (`isServer` est vrai) peuvent définir `requestCert` sur true pour demander un certificat client.
    - `rejectUnauthorized`: Voir [`tls.createServer()`](/fr/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `ALPNProtocols`: Voir [`tls.createServer()`](/fr/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `SNICallback`: Voir [`tls.createServer()`](/fr/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `session` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) Une instance `Buffer` contenant une session TLS.
    - `requestOCSP` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si `true`, spécifie que l'extension de requête d'état OCSP sera ajoutée au client hello et qu'un événement `'OCSPResponse'` sera émis sur le socket avant d'établir une communication sécurisée.
    - `secureContext`: Objet de contexte TLS créé avec [`tls.createSecureContext()`](/fr/nodejs/api/tls#tlscreatesecurecontextoptions). Si un `secureContext` n'est *pas* fourni, un sera créé en passant l'objet `options` entier à `tls.createSecureContext()`.
    - ...: Options de [`tls.createSecureContext()`](/fr/nodejs/api/tls#tlscreatesecurecontextoptions) qui sont utilisées si l'option `secureContext` est manquante. Sinon, elles sont ignorées.

Construit un nouvel objet `tls.TLSSocket` à partir d'un socket TCP existant.


### Événement : `'keylog'` {#event-keylog_1}

**Ajouté dans : v12.3.0, v10.20.0**

- `line` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) Ligne de texte ASCII, au format NSS `SSLKEYLOGFILE`.

L’événement `keylog` est émis sur un `tls.TLSSocket` lorsque des données de clé sont générées ou reçues par le socket. Ces données de clé peuvent être stockées à des fins de débogage, car elles permettent de décrypter le trafic TLS capturé. Il peut être émis plusieurs fois, avant ou après la fin de la négociation.

Un cas d’utilisation typique consiste à ajouter les lignes reçues à un fichier texte commun, qui est ensuite utilisé par un logiciel (tel que Wireshark) pour décrypter le trafic :

```js [ESM]
const logFile = fs.createWriteStream('/tmp/ssl-keys.log', { flags: 'a' });
// ...
tlsSocket.on('keylog', (line) => logFile.write(line));
```
### Événement : `'OCSPResponse'` {#event-ocspresponse}

**Ajouté dans : v0.11.13**

L’événement `'OCSPResponse'` est émis si l’option `requestOCSP` a été définie lors de la création du `tls.TLSSocket` et qu’une réponse OCSP a été reçue. Le rappel de l’écouteur reçoit un seul argument lors de son appel :

- `response` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) La réponse OCSP du serveur

En général, la `response` est un objet signé numériquement provenant de l’autorité de certification du serveur qui contient des informations sur l’état de révocation du certificat du serveur.

### Événement : `'secureConnect'` {#event-secureconnect}

**Ajouté dans : v0.11.4**

L’événement `'secureConnect'` est émis une fois que le processus de négociation pour une nouvelle connexion s’est terminé avec succès. Le rappel de l’écouteur sera appelé, que le certificat du serveur ait été autorisé ou non. Il est de la responsabilité du client de vérifier la propriété `tlsSocket.authorized` pour déterminer si le certificat du serveur a été signé par l’une des autorités de certification spécifiées. Si `tlsSocket.authorized === false`, l’erreur peut être trouvée en examinant la propriété `tlsSocket.authorizationError`. Si ALPN a été utilisé, la propriété `tlsSocket.alpnProtocol` peut être vérifiée pour déterminer le protocole négocié.

L’événement `'secureConnect'` n’est pas émis lorsqu’un [\<tls.TLSSocket\>](/fr/nodejs/api/tls#class-tlstlssocket) est créé à l’aide du constructeur `new tls.TLSSocket()`.


### Événement : `'session'` {#event-session}

**Ajouté dans : v11.10.0**

- `session` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer)

L’événement `'session'` est émis sur un `tls.TLSSocket` client lorsqu’une nouvelle session ou un nouveau ticket TLS est disponible. Cela peut se produire avant ou après la fin de la négociation, selon la version du protocole TLS qui a été négociée. L’événement n’est pas émis sur le serveur, ni si une nouvelle session n’a pas été créée, par exemple, lorsque la connexion a été reprise. Pour certaines versions du protocole TLS, l’événement peut être émis plusieurs fois, auquel cas toutes les sessions peuvent être utilisées pour la reprise.

Sur le client, la `session` peut être fournie à l’option `session` de [`tls.connect()`](/fr/nodejs/api/tls#tlsconnectoptions-callback) pour reprendre la connexion.

Voir [Reprise de Session](/fr/nodejs/api/tls#session-resumption) pour plus d’informations.

Pour TLSv1.2 et les versions antérieures, [`tls.TLSSocket.getSession()`](/fr/nodejs/api/tls#tlssocketgetsession) peut être appelée une fois la négociation terminée. Pour TLSv1.3, seule la reprise basée sur les tickets est autorisée par le protocole, plusieurs tickets sont envoyés et les tickets ne sont envoyés qu’une fois la négociation terminée. Il est donc nécessaire d’attendre l’événement `'session'` pour obtenir une session récupérable. Les applications doivent utiliser l’événement `'session'` au lieu de `getSession()` pour s’assurer qu’elles fonctionneront pour toutes les versions de TLS. Les applications qui s’attendent uniquement à obtenir ou à utiliser une seule session ne doivent écouter cet événement qu’une seule fois :

```js [ESM]
tlsSocket.once('session', (session) => {
  // La session peut être utilisée immédiatement ou plus tard.
  tls.connect({
    session: session,
    // Autres options de connexion...
  });
});
```
### `tlsSocket.address()` {#tlssocketaddress}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.4.0 | La propriété `family` renvoie maintenant une chaîne au lieu d’un nombre. |
| v18.0.0 | La propriété `family` renvoie maintenant un nombre au lieu d’une chaîne. |
| v0.11.4 | Ajoutée dans : v0.11.4 |
:::

- Retourne : [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Retourne l'`address` lié, le nom de `family` de l’adresse et le `port` du socket sous-jacent tel que rapporté par le système d’exploitation : `{ port: 12346, family: 'IPv4', address: '127.0.0.1' }`.


### `tlsSocket.authorizationError` {#tlssocketauthorizationerror}

**Ajouté dans : v0.11.4**

Renvoie la raison pour laquelle le certificat du pair n'a pas été vérifié. Cette propriété n'est définie que lorsque `tlsSocket.authorized === false`.

### `tlsSocket.authorized` {#tlssocketauthorized}

**Ajouté dans : v0.11.4**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Cette propriété est `true` si le certificat du pair a été signé par l'une des autorités de certification spécifiées lors de la création de l'instance `tls.TLSSocket`, sinon `false`.

### `tlsSocket.disableRenegotiation()` {#tlssocketdisablerenegotiation}

**Ajouté dans : v8.4.0**

Désactive la renégociation TLS pour cette instance `TLSSocket`. Une fois appelé, les tentatives de renégociation déclencheront un événement `'error'` sur le `TLSSocket`.

### `tlsSocket.enableTrace()` {#tlssocketenabletrace}

**Ajouté dans : v12.2.0**

Lorsqu'elle est activée, les informations de trace des paquets TLS sont écrites dans `stderr`. Ceci peut être utilisé pour déboguer les problèmes de connexion TLS.

Le format de la sortie est identique à la sortie de `openssl s_client -trace` ou `openssl s_server -trace`. Bien qu'elle soit produite par la fonction `SSL_trace()` d'OpenSSL, le format n'est pas documenté, peut changer sans préavis et ne doit pas être pris en compte.

### `tlsSocket.encrypted` {#tlssocketencrypted}

**Ajouté dans : v0.11.4**

Renvoie toujours `true`. Ceci peut être utilisé pour distinguer les sockets TLS des instances `net.Socket` ordinaires.

### `tlsSocket.exportKeyingMaterial(length, label[, context])` {#tlssocketexportkeyingmateriallength-label-context}

**Ajouté dans : v13.10.0, v12.17.0**

- `length` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) nombre d'octets à récupérer du matériel de clés
- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) une étiquette spécifique à l'application, il s'agira généralement d'une valeur du [Registre des étiquettes d'exportation IANA](https://www.iana.org/assignments/tls-parameters/tls-parameters.xhtml#exporter-labels).
- `context` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) Fournir éventuellement un contexte.
- Renvoie : [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) octets demandés du matériel de clés

Le matériel de clés est utilisé pour les validations afin d'empêcher différents types d'attaques dans les protocoles réseau, par exemple dans les spécifications de la norme IEEE 802.1X.

Exemple

```js [ESM]
const keyingMaterial = tlsSocket.exportKeyingMaterial(
  128,
  'client finished');

/*
 Exemple de valeur de retour de keyingMaterial :
 <Buffer 76 26 af 99 c5 56 8e 42 09 91 ef 9f 93 cb ad 6c 7b 65 f8 53 f1 d8 d9
    12 5a 33 b8 b5 25 df 7b 37 9f e0 e2 4f b8 67 83 a3 2f cd 5d 41 42 4c 91
    74 ef 2c ... 78 octets de plus>
*/
```
Voir la documentation OpenSSL [`SSL_export_keying_material`](https://www.openssl.org/docs/man1.1.1/man3/SSL_export_keying_material) pour plus d'informations.


### `tlsSocket.getCertificate()` {#tlssocketgetcertificate}

**Ajouté dans : v11.2.0**

- Retourne : [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Retourne un objet représentant le certificat local. L’objet retourné a certaines propriétés correspondant aux champs du certificat.

Voir [`tls.TLSSocket.getPeerCertificate()`](/fr/nodejs/api/tls#tlssocketgetpeercertificatedetailed) pour un exemple de la structure du certificat.

S’il n’y a pas de certificat local, un objet vide sera retourné. Si le socket a été détruit, `null` sera retourné.

### `tlsSocket.getCipher()` {#tlssocketgetcipher}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v13.4.0, v12.16.0 | Retourne le nom de chiffrement IETF en tant que `standardName`. |
| v12.0.0 | Retourne la version de chiffrement minimum, au lieu d’une chaîne de caractères fixe (`'TLSv1/SSLv3'`). |
| v0.11.4 | Ajouté dans : v0.11.4 |
:::

- Retourne : [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nom OpenSSL pour la suite de chiffrement.
    - `standardName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nom IETF pour la suite de chiffrement.
    - `version` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La version minimale du protocole TLS prise en charge par cette suite de chiffrement. Pour le protocole négocié réel, voir [`tls.TLSSocket.getProtocol()`](/fr/nodejs/api/tls#tlssocketgetprotocol).
  
 

Retourne un objet contenant des informations sur la suite de chiffrement négociée.

Par exemple, un protocole TLSv1.2 avec un chiffrement AES256-SHA :

```json [JSON]
{
    "name": "AES256-SHA",
    "standardName": "TLS_RSA_WITH_AES_256_CBC_SHA",
    "version": "SSLv3"
}
```
Voir [SSL_CIPHER_get_name](https://www.openssl.org/docs/man1.1.1/man3/SSL_CIPHER_get_name) pour plus d’informations.

### `tlsSocket.getEphemeralKeyInfo()` {#tlssocketgetephemeralkeyinfo}

**Ajouté dans : v5.0.0**

- Retourne : [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Retourne un objet représentant le type, le nom et la taille du paramètre d’un échange de clés éphémères dans [perfect forward secrecy](/fr/nodejs/api/tls#perfect-forward-secrecy) sur une connexion client. Il retourne un objet vide lorsque l’échange de clés n’est pas éphémère. Puisque cela n’est pris en charge que sur un socket client ; `null` est retourné s’il est appelé sur un socket serveur. Les types pris en charge sont `'DH'` et `'ECDH'`. La propriété `name` est disponible uniquement lorsque le type est `'ECDH'`.

Par exemple : `{ type: 'ECDH', name: 'prime256v1', size: 256 }`.


### `tlsSocket.getFinished()` {#tlssocketgetfinished}

**Ajouté dans : v9.9.0**

- Renvoie : [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<undefined\>](https://developer.mozilla.org/fr-CA/docs/Web/JavaScript/Data_structures#Undefined_type) Le dernier message `Finished` qui a été envoyé au socket dans le cadre d’une négociation SSL/TLS, ou `undefined` si aucun message `Finished` n’a encore été envoyé.

Étant donné que les messages `Finished` sont des condensés de message de la négociation complète (avec un total de 192 bits pour TLS 1.0 et plus pour SSL 3.0), ils peuvent être utilisés pour des procédures d’authentification externe lorsque l’authentification fournie par SSL/TLS n’est pas souhaitée ou n’est pas suffisante.

Correspond à la routine `SSL_get_finished` dans OpenSSL et peut être utilisé pour implémenter la liaison de canal `tls-unique` à partir de [RFC 5929](https://tools.ietf.org/html/rfc5929).

### `tlsSocket.getPeerCertificate([detailed])` {#tlssocketgetpeercertificatedetailed}

**Ajouté dans : v0.11.4**

- `detailed` [\<boolean\>](https://developer.mozilla.org/fr-CA/docs/Web/JavaScript/Data_structures#Boolean_type) Inclut la chaîne de certificats complète si `true`, sinon inclut uniquement le certificat de l’homologue.
- Renvoie : [\<Object\>](https://developer.mozilla.org/fr-CA/docs/Web/JavaScript/Reference/Global_Objects/Object) Un objet certificat.

Renvoie un objet représentant le certificat de l’homologue. Si l’homologue ne fournit pas de certificat, un objet vide sera renvoyé. Si le socket a été détruit, `null` sera renvoyé.

Si la chaîne de certificats complète a été demandée, chaque certificat inclura une propriété `issuerCertificate` contenant un objet représentant le certificat de son émetteur.

#### Objet certificat {#certificate-object}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v19.1.0, v18.13.0 | Ajout de la propriété "ca". |
| v17.2.0, v16.14.0 | Ajout de fingerprint512. |
| v11.4.0 | Prise en charge des informations de clé publique de courbe elliptique. |
:::

Un objet certificat a des propriétés correspondant aux champs du certificat.

- `ca` [\<boolean\>](https://developer.mozilla.org/fr-CA/docs/Web/JavaScript/Data_structures#Boolean_type) `true` si une autorité de certification (CA), `false` sinon.
- `raw` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) Les données du certificat X.509 encodées DER.
- `subject` [\<Object\>](https://developer.mozilla.org/fr-CA/docs/Web/JavaScript/Reference/Global_Objects/Object) Le sujet du certificat, décrit en termes de pays (`C`), d’état ou de province (`ST`), de localité (`L`), d’organisation (`O`), d’unité organisationnelle (`OU`) et de nom commun (`CN`). Le nom commun est généralement un nom DNS avec des certificats TLS. Exemple : `{C: 'UK', ST: 'BC', L: 'Metro', O: 'Node Fans', OU: 'Docs', CN: 'example.com'}`.
- `issuer` [\<Object\>](https://developer.mozilla.org/fr-CA/docs/Web/JavaScript/Reference/Global_Objects/Object) L’émetteur du certificat, décrit dans les mêmes termes que le `subject`.
- `valid_from` [\<string\>](https://developer.mozilla.org/fr-CA/docs/Web/JavaScript/Data_structures#String_type) La date et l’heure de début de validité du certificat.
- `valid_to` [\<string\>](https://developer.mozilla.org/fr-CA/docs/Web/JavaScript/Data_structures#String_type) La date et l’heure de fin de validité du certificat.
- `serialNumber` [\<string\>](https://developer.mozilla.org/fr-CA/docs/Web/JavaScript/Data_structures#String_type) Le numéro de série du certificat, sous forme de chaîne hexadécimale. Exemple : `'B9B0D332A1AA5635'`.
- `fingerprint` [\<string\>](https://developer.mozilla.org/fr-CA/docs/Web/JavaScript/Data_structures#String_type) Le condensé SHA-1 du certificat encodé DER. Il est renvoyé sous forme de chaîne hexadécimale séparée par des `:`. Exemple : `'2A:7A:C2:DD:...'`.
- `fingerprint256` [\<string\>](https://developer.mozilla.org/fr-CA/docs/Web/JavaScript/Data_structures#String_type) Le condensé SHA-256 du certificat encodé DER. Il est renvoyé sous forme de chaîne hexadécimale séparée par des `:`. Exemple : `'2A:7A:C2:DD:...'`.
- `fingerprint512` [\<string\>](https://developer.mozilla.org/fr-CA/docs/Web/JavaScript/Data_structures#String_type) Le condensé SHA-512 du certificat encodé DER. Il est renvoyé sous forme de chaîne hexadécimale séparée par des `:`. Exemple : `'2A:7A:C2:DD:...'`.
- `ext_key_usage` [\<Array\>](https://developer.mozilla.org/fr-CA/docs/Web/JavaScript/Reference/Global_Objects/Array) (Facultatif) L’utilisation étendue de la clé, un ensemble d’OID.
- `subjectaltname` [\<string\>](https://developer.mozilla.org/fr-CA/docs/Web/JavaScript/Data_structures#String_type) (Facultatif) Une chaîne contenant des noms concaténés pour le sujet, une alternative aux noms `subject`.
- `infoAccess` [\<Array\>](https://developer.mozilla.org/fr-CA/docs/Web/JavaScript/Reference/Global_Objects/Array) (Facultatif) Un tableau décrivant l’AuthorityInfoAccess, utilisé avec OCSP.
- `issuerCertificate` [\<Object\>](https://developer.mozilla.org/fr-CA/docs/Web/JavaScript/Reference/Global_Objects/Object) (Facultatif) L’objet certificat de l’émetteur. Pour les certificats auto-signés, il peut s’agir d’une référence circulaire.

Le certificat peut contenir des informations sur la clé publique, selon le type de clé.

Pour les clés RSA, les propriétés suivantes peuvent être définies :

- `bits` [\<number\>](https://developer.mozilla.org/fr-CA/docs/Web/JavaScript/Data_structures#Number_type) La taille du bit RSA. Exemple : `1024`.
- `exponent` [\<string\>](https://developer.mozilla.org/fr-CA/docs/Web/JavaScript/Data_structures#String_type) L’exposant RSA, sous forme de chaîne en notation numérique hexadécimale. Exemple : `'0x010001'`.
- `modulus` [\<string\>](https://developer.mozilla.org/fr-CA/docs/Web/JavaScript/Data_structures#String_type) Le module RSA, sous forme de chaîne hexadécimale. Exemple : `'B56CE45CB7...'`.
- `pubkey` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) La clé publique.

Pour les clés EC, les propriétés suivantes peuvent être définies :

- `pubkey` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) La clé publique.
- `bits` [\<number\>](https://developer.mozilla.org/fr-CA/docs/Web/JavaScript/Data_structures#Number_type) La taille de la clé en bits. Exemple : `256`.
- `asn1Curve` [\<string\>](https://developer.mozilla.org/fr-CA/docs/Web/JavaScript/Data_structures#String_type) (Facultatif) Le nom ASN.1 de l’OID de la courbe elliptique. Les courbes bien connues sont identifiées par un OID. Bien que ce soit inhabituel, il est possible que la courbe soit identifiée par ses propriétés mathématiques, auquel cas elle n’aura pas d’OID. Exemple : `'prime256v1'`.
- `nistCurve` [\<string\>](https://developer.mozilla.org/fr-CA/docs/Web/JavaScript/Data_structures#String_type) (Facultatif) Le nom NIST pour la courbe elliptique, s’il en a un (toutes les courbes bien connues n’ont pas été attribuées des noms par le NIST). Exemple : `'P-256'`.

Exemple de certificat :

```js [ESM]
{ subject:
   { OU: [ 'Domain Control Validated', 'PositiveSSL Wildcard' ],
     CN: '*.nodejs.org' },
  issuer:
   { C: 'GB',
     ST: 'Greater Manchester',
     L: 'Salford',
     O: 'COMODO CA Limited',
     CN: 'COMODO RSA Domain Validation Secure Server CA' },
  subjectaltname: 'DNS:*.nodejs.org, DNS:nodejs.org',
  infoAccess:
   { 'CA Issuers - URI':
      [ 'http://crt.comodoca.com/COMODORSADomainValidationSecureServerCA.crt' ],
     'OCSP - URI': [ 'http://ocsp.comodoca.com' ] },
  modulus: 'B56CE45CB740B09A13F64AC543B712FF9EE8E4C284B542A1708A27E82A8D151CA178153E12E6DDA15BF70FFD96CB8A88618641BDFCCA03527E665B70D779C8A349A6F88FD4EF6557180BD4C98192872BCFE3AF56E863C09DDD8BC1EC58DF9D94F914F0369102B2870BECFA1348A0838C9C49BD1C20124B442477572347047506B1FCD658A80D0C44BCC16BC5C5496CFE6E4A8428EF654CD3D8972BF6E5BFAD59C93006830B5EB1056BBB38B53D1464FA6E02BFDF2FF66CD949486F0775EC43034EC2602AEFBF1703AD221DAA2A88353C3B6A688EFE8387811F645CEED7B3FE46E1F8B9F59FAD028F349B9BC14211D5830994D055EEA3D547911E07A0ADDEB8A82B9188E58720D95CD478EEC9AF1F17BE8141BE80906F1A339445A7EB5B285F68039B0F294598A7D1C0005FC22B5271B0752F58CCDEF8C8FD856FB7AE21C80B8A2CE983AE94046E53EDE4CB89F42502D31B5360771C01C80155918637490550E3F555E2EE75CC8C636DDE3633CFEDD62E91BF0F7688273694EEEBA20C2FC9F14A2A435517BC1D7373922463409AB603295CEB0BB53787A334C9CA3CA8B30005C5A62FC0715083462E00719A8FA3ED0A9828C3871360A73F8B04A4FC1E71302844E9BB9940B77E745C9D91F226D71AFCAD4B113AAF68D92B24DDB4A2136B55A1CD1ADF39605B63CB639038ED0F4C987689866743A68769CC55847E4A06D6E2E3F1',
  exponent: '0x10001',
  pubkey: <Buffer ... >,
  valid_from: 'Aug 14 00:00:00 2017 GMT',
  valid_to: 'Nov 20 23:59:59 2019 GMT',
  fingerprint: '01:02:59:D9:C3:D2:0D:08:F7:82:4E:44:A4:B4:53:C5:E2:3A:87:4D',
  fingerprint256: '69:AE:1A:6A:D4:3D:C6:C1:1B:EA:C6:23:DE:BA:2A:14:62:62:93:5C:7A:EA:06:41:9B:0B:BC:87:CE:48:4E:02',
  fingerprint512: '19:2B:3E:C3:B3:5B:32:E8:AE:BB:78:97:27:E4:BA:6C:39:C9:92:79:4F:31:46:39:E2:70:E5:5F:89:42:17:C9:E8:64:CA:FF:BB:72:56:73:6E:28:8A:92:7E:A3:2A:15:8B:C2:E0:45:CA:C3:BC:EA:40:52:EC:CA:A2:68:CB:32',
  ext_key_usage: [ '1.3.6.1.5.5.7.3.1', '1.3.6.1.5.5.7.3.2' ],
  serialNumber: '66593D57F20CBC573E433381B5FEC280',
  raw: <Buffer ... > }
```

### `tlsSocket.getPeerFinished()` {#tlssocketgetpeerfinished}

**Ajouté dans : v9.9.0**

- Retourne : [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Le dernier message `Finished` attendu ou réellement reçu du socket dans le cadre d’une négociation SSL/TLS, ou `undefined` si aucun message `Finished` n’a été reçu jusqu’à présent.

Comme les messages `Finished` sont des condensés de message de la négociation complète (avec un total de 192 bits pour TLS 1.0 et plus pour SSL 3.0), ils peuvent être utilisés pour des procédures d’authentification externes lorsque l’authentification fournie par SSL/TLS n’est pas souhaitée ou n’est pas suffisante.

Correspond à la routine `SSL_get_peer_finished` dans OpenSSL et peut être utilisé pour implémenter la liaison de canal `tls-unique` de [RFC 5929](https://tools.ietf.org/html/rfc5929).

### `tlsSocket.getPeerX509Certificate()` {#tlssocketgetpeerx509certificate}

**Ajouté dans : v15.9.0**

- Retourne : [\<X509Certificate\>](/fr/nodejs/api/crypto#class-x509certificate)

Retourne le certificat de pair en tant qu’objet [\<X509Certificate\>](/fr/nodejs/api/crypto#class-x509certificate).

S’il n’y a pas de certificat de pair, ou si le socket a été détruit, `undefined` sera retourné.

### `tlsSocket.getProtocol()` {#tlssocketgetprotocol}

**Ajouté dans : v5.7.0**

- Retourne : [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

Retourne une chaîne contenant la version du protocole SSL/TLS négocié de la connexion actuelle. La valeur `'unknown'` sera retournée pour les sockets connectés qui n’ont pas terminé le processus de négociation. La valeur `null` sera retournée pour les sockets serveur ou les sockets client déconnectés.

Les versions de protocole sont :

- `'SSLv3'`
- `'TLSv1'`
- `'TLSv1.1'`
- `'TLSv1.2'`
- `'TLSv1.3'`

Voir la documentation OpenSSL [`SSL_get_version`](https://www.openssl.org/docs/man1.1.1/man3/SSL_get_version) pour plus d’informations.

### `tlsSocket.getSession()` {#tlssocketgetsession}

**Ajouté dans : v0.11.4**

- [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer)

Retourne les données de session TLS ou `undefined` si aucune session n’a été négociée. Sur le client, les données peuvent être fournies à l’option `session` de [`tls.connect()`](/fr/nodejs/api/tls#tlsconnectoptions-callback) pour reprendre la connexion. Sur le serveur, cela peut être utile pour le débogage.

Voir [Reprise de session](/fr/nodejs/api/tls#session-resumption) pour plus d’informations.

Note : `getSession()` ne fonctionne que pour TLSv1.2 et inférieur. Pour TLSv1.3, les applications doivent utiliser l’événement [`'session'`](/fr/nodejs/api/tls#event-session) (il fonctionne également pour TLSv1.2 et inférieur).


### `tlsSocket.getSharedSigalgs()` {#tlssocketgetsharedsigalgs}

**Ajouté dans : v12.11.0**

- Retourne : [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Liste des algorithmes de signature partagés entre le serveur et le client, par ordre de préférence décroissant.

Voir [SSL_get_shared_sigalgs](https://www.openssl.org/docs/man1.1.1/man3/SSL_get_shared_sigalgs) pour plus d'informations.

### `tlsSocket.getTLSTicket()` {#tlssocketgettlsticket}

**Ajouté dans : v0.11.4**

- [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer)

Pour un client, retourne le ticket de session TLS s'il est disponible, ou `undefined`. Pour un serveur, retourne toujours `undefined`.

Cela peut être utile pour le débogage.

Voir [Reprise de session](/fr/nodejs/api/tls#session-resumption) pour plus d'informations.

### `tlsSocket.getX509Certificate()` {#tlssocketgetx509certificate}

**Ajouté dans : v15.9.0**

- Retourne : [\<X509Certificate\>](/fr/nodejs/api/crypto#class-x509certificate)

Retourne le certificat local en tant qu'objet [\<X509Certificate\>](/fr/nodejs/api/crypto#class-x509certificate).

S'il n'y a pas de certificat local, ou si le socket a été détruit, `undefined` sera retourné.

### `tlsSocket.isSessionReused()` {#tlssocketissessionreused}

**Ajouté dans : v0.5.6**

- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` si la session a été réutilisée, `false` sinon.

Voir [Reprise de session](/fr/nodejs/api/tls#session-resumption) pour plus d'informations.

### `tlsSocket.localAddress` {#tlssocketlocaladdress}

**Ajouté dans : v0.11.4**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retourne la représentation sous forme de chaîne de caractères de l'adresse IP locale.

### `tlsSocket.localPort` {#tlssocketlocalport}

**Ajouté dans : v0.11.4**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Retourne la représentation numérique du port local.

### `tlsSocket.remoteAddress` {#tlssocketremoteaddress}

**Ajouté dans : v0.11.4**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Retourne la représentation sous forme de chaîne de caractères de l'adresse IP distante. Par exemple, `'74.125.127.100'` ou `'2001:4860:a005::68'`.


### `tlsSocket.remoteFamily` {#tlssocketremotefamily}

**Ajouté dans : v0.11.4**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Renvoie la représentation sous forme de chaîne de la famille d’IP distante. `'IPv4'` ou `'IPv6'`.

### `tlsSocket.remotePort` {#tlssocketremoteport}

**Ajouté dans : v0.11.4**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Renvoie la représentation numérique du port distant. Par exemple, `443`.

### `tlsSocket.renegotiate(options, callback)` {#tlssocketrenegotiateoptions-callback}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v18.0.0 | Le passage d’un callback invalide à l’argument `callback` lève désormais `ERR_INVALID_ARG_TYPE` au lieu de `ERR_INVALID_CALLBACK`. |
| v0.11.8 | Ajouté dans : v0.11.8 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `rejectUnauthorized` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si ce n’est pas `false`, le certificat du serveur est vérifié par rapport à la liste des autorités de certification fournies. Un événement `'error'` est émis si la vérification échoue ; `err.code` contient le code d’erreur OpenSSL. **Par défaut :** `true`.
    - `requestCert`
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Si `renegotiate()` a renvoyé `true`, le callback est attaché une fois à l’événement `'secure'`. Si `renegotiate()` a renvoyé `false`, `callback` sera appelé dans le prochain tick avec une erreur, à moins que le `tlsSocket` n’ait été détruit, auquel cas `callback` ne sera pas appelé du tout.
- Renvoie : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` si la renégociation a été initiée, `false` sinon.

La méthode `tlsSocket.renegotiate()` lance un processus de renégociation TLS. Une fois terminé, la fonction `callback` recevra un seul argument qui est soit une `Error` (si la demande a échoué), soit `null`.

Cette méthode peut être utilisée pour demander le certificat d’un homologue une fois la connexion sécurisée établie.

Lors de l’exécution en tant que serveur, le socket sera détruit avec une erreur après le délai `handshakeTimeout`.

Pour TLSv1.3, la renégociation ne peut pas être initiée, elle n’est pas prise en charge par le protocole.


### `tlsSocket.setKeyCert(context)` {#tlssocketsetkeycertcontext}

**Ajouté dans : v22.5.0, v20.17.0**

- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<tls.SecureContext\>](/fr/nodejs/api/tls#tlscreatesecurecontextoptions) Un objet contenant au moins les propriétés `key` et `cert` des `options` de [`tls.createSecureContext()`](/fr/nodejs/api/tls#tlscreatesecurecontextoptions), ou un objet de contexte TLS créé avec [`tls.createSecureContext()`](/fr/nodejs/api/tls#tlscreatesecurecontextoptions) lui-même.

La méthode `tlsSocket.setKeyCert()` définit la clé privée et le certificat à utiliser pour le socket. Ceci est principalement utile si vous souhaitez sélectionner un certificat de serveur à partir du `ALPNCallback` d'un serveur TLS.

### `tlsSocket.setMaxSendFragment(size)` {#tlssocketsetmaxsendfragmentsize}

**Ajouté dans : v0.11.11**

- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La taille maximale du fragment TLS. La valeur maximale est `16384`. **Par défaut :** `16384`.
- Retourne : [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

La méthode `tlsSocket.setMaxSendFragment()` définit la taille maximale du fragment TLS. Renvoie `true` si la définition de la limite a réussi ; `false` sinon.

Des tailles de fragment plus petites diminuent la latence de mise en mémoire tampon sur le client : les fragments plus grands sont mis en mémoire tampon par la couche TLS jusqu'à ce que le fragment entier soit reçu et que son intégrité soit vérifiée ; les grands fragments peuvent couvrir plusieurs aller-retours et leur traitement peut être retardé en raison d'une perte ou d'un réordonnancement de paquets. Cependant, des fragments plus petits ajoutent des octets de trame TLS supplémentaires et une surcharge CPU, ce qui peut diminuer le débit global du serveur.

## `tls.checkServerIdentity(hostname, cert)` {#tlscheckserveridentityhostname-cert}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v17.3.1, v16.13.2, v14.18.3, v12.22.9 | La prise en charge des noms alternatifs de sujet `uniformResourceIdentifier` a été désactivée en réponse à CVE-2021-44531. |
| v0.8.4 | Ajouté dans : v0.8.4 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Le nom d'hôte ou l'adresse IP par rapport auxquels vérifier le certificat.
- `cert` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un [objet certificat](/fr/nodejs/api/tls#certificate-object) représentant le certificat du pair.
- Retourne : [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Vérifie que le certificat `cert` est émis pour `hostname`.

Renvoie un objet [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error), en le remplissant avec `reason`, `host` et `cert` en cas d'échec. En cas de succès, renvoie [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type).

Cette fonction est destinée à être utilisée en combinaison avec l'option `checkServerIdentity` qui peut être passée à [`tls.connect()`](/fr/nodejs/api/tls#tlsconnectoptions-callback) et fonctionne donc sur un [objet certificat](/fr/nodejs/api/tls#certificate-object). Pour d'autres usages, envisagez plutôt d'utiliser [`x509.checkHost()`](/fr/nodejs/api/crypto#x509checkhostname-options).

Cette fonction peut être remplacée en fournissant une fonction alternative comme option `options.checkServerIdentity` qui est passée à `tls.connect()`. La fonction de remplacement peut bien sûr appeler `tls.checkServerIdentity()` pour compléter les vérifications effectuées avec une vérification supplémentaire.

Cette fonction n'est appelée que si le certificat a passé toutes les autres vérifications, telles que l'émission par une autorité de certification de confiance (`options.ca`).

Les versions antérieures de Node.js acceptaient incorrectement les certificats pour un `hostname` donné si un nom alternatif de sujet `uniformResourceIdentifier` correspondant était présent (voir [CVE-2021-44531](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-44531)). Les applications qui souhaitent accepter les noms alternatifs de sujet `uniformResourceIdentifier` peuvent utiliser une fonction `options.checkServerIdentity` personnalisée qui implémente le comportement souhaité.


## `tls.connect(options[, callback])` {#tlsconnectoptions-callback}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v15.1.0, v14.18.0 | Ajout de l'option `onread`. |
| v14.1.0, v13.14.0 | L'option `highWaterMark` est désormais acceptée. |
| v13.6.0, v12.16.0 | L'option `pskCallback` est désormais prise en charge. |
| v12.9.0 | Prise en charge de l'option `allowHalfOpen`. |
| v12.4.0 | L'option `hints` est désormais prise en charge. |
| v12.2.0 | L'option `enableTrace` est désormais prise en charge. |
| v11.8.0, v10.16.0 | L'option `timeout` est désormais prise en charge. |
| v8.0.0 | L'option `lookup` est désormais prise en charge. |
| v8.0.0 | L'option `ALPNProtocols` peut désormais être un `TypedArray` ou un `DataView`. |
| v5.0.0 | Les options ALPN sont désormais prises en charge. |
| v5.3.0, v4.7.0 | L'option `secureContext` est désormais prise en charge. |
| v0.11.3 | Ajoutée dans : v0.11.3 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `enableTrace`: Voir [`tls.createServer()`](/fr/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `host` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/String) Hôte auquel le client doit se connecter. **Par défaut :** `'localhost'`.
    - `port` [\<number\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Number) Port auquel le client doit se connecter.
    - `path` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/String) Crée une connexion de socket Unix vers le chemin. Si cette option est spécifiée, `host` et `port` sont ignorés.
    - `socket` [\<stream.Duplex\>](/fr/nodejs/api/stream#class-streamduplex) Établit une connexion sécurisée sur un socket donné plutôt que de créer un nouveau socket. Généralement, il s'agit d'une instance de [`net.Socket`](/fr/nodejs/api/net#class-netsocket), mais tout flux `Duplex` est autorisé. Si cette option est spécifiée, `path`, `host` et `port` sont ignorés, sauf pour la validation du certificat. Habituellement, un socket est déjà connecté lorsqu'il est passé à `tls.connect()`, mais il peut être connecté ultérieurement. La connexion/déconnexion/destruction du `socket` est la responsabilité de l'utilisateur ; l'appel de `tls.connect()` n'entraînera pas l'appel de `net.connect()`.
    - `allowHalfOpen` [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Boolean) Si la valeur est définie sur `false`, le socket terminera automatiquement le côté accessible en écriture lorsque le côté accessible en lecture se termine. Si l'option `socket` est définie, cette option n'a aucun effet. Voir l'option `allowHalfOpen` de [`net.Socket`](/fr/nodejs/api/net#class-netsocket) pour plus de détails. **Par défaut :** `false`.
    - `rejectUnauthorized` [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Boolean) Si ce n'est pas `false`, le certificat du serveur est vérifié par rapport à la liste des autorités de certification fournies. Un événement `'error'` est émis si la vérification échoue ; `err.code` contient le code d'erreur OpenSSL. **Par défaut :** `true`.
    - `pskCallback` [\<Function\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Function) Pour la négociation TLS-PSK, voir [Clés pré-partagées](/fr/nodejs/api/tls#pre-shared-keys).
    - `ALPNProtocols`: [\<string[]\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/String) | [\<Buffer[]\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray[]\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/DataView) Un tableau de chaînes de caractères, de `Buffer`s, de `TypedArray`s, ou de `DataView`s, ou un seul `Buffer`, `TypedArray`, ou `DataView` contenant les protocoles ALPN pris en charge. Les `Buffer`s doivent avoir le format `[len][name][len][name]...` par exemple `'\x08http/1.1\x08http/1.0'`, où l'octet `len` est la longueur du nom du protocole suivant. Le passage d'un tableau est généralement beaucoup plus simple, par exemple `['http/1.1', 'http/1.0']`. Les protocoles situés plus haut dans la liste ont une préférence plus élevée que ceux situés plus bas.
    - `servername`: [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/String) Nom du serveur pour l'extension SNI (Server Name Indication) TLS. C'est le nom de l'hôte auquel on se connecte, et doit être un nom d'hôte, et non une adresse IP. Il peut être utilisé par un serveur multi-hébergé pour choisir le bon certificat à présenter au client, voir l'option `SNICallback` de [`tls.createServer()`](/fr/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener).
    - `checkServerIdentity(servername, cert)` [\<Function\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Function) Une fonction de callback à utiliser (au lieu de la fonction intégrée `tls.checkServerIdentity()`) lors de la vérification du nom d'hôte du serveur (ou du `servername` fourni lorsqu'il est explicitement défini) par rapport au certificat. Cela doit renvoyer une [\<Error\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Error) si la vérification échoue. La méthode doit renvoyer `undefined` si le `servername` et le `cert` sont vérifiés.
    - `session` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) Une instance `Buffer`, contenant la session TLS.
    - `minDHSize` [\<number\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Number) Taille minimale du paramètre DH en bits pour accepter une connexion TLS. Lorsqu'un serveur propose un paramètre DH avec une taille inférieure à `minDHSize`, la connexion TLS est détruite et une erreur est levée. **Par défaut :** `1024`.
    - `highWaterMark`: [\<number\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Number) Cohérent avec le paramètre `highWaterMark` du flux accessible en lecture. **Par défaut :** `16 * 1024`.
    - `secureContext`: Objet de contexte TLS créé avec [`tls.createSecureContext()`](/fr/nodejs/api/tls#tlscreatesecurecontextoptions). Si un `secureContext` *n'est pas* fourni, un sera créé en passant l'objet `options` entier à `tls.createSecureContext()`.
    - `onread` [\<Object\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object) Si l'option `socket` est manquante, les données entrantes sont stockées dans un seul `buffer` et passées au `callback` fourni lorsque les données arrivent sur le socket, sinon l'option est ignorée. Voir l'option `onread` de [`net.Socket`](/fr/nodejs/api/net#class-netsocket) pour plus de détails.
    - ...: Options [`tls.createSecureContext()`](/fr/nodejs/api/tls#tlscreatesecurecontextoptions) qui sont utilisées si l'option `secureContext` est manquante, sinon elles sont ignorées.
    - ...: Toute option [`socket.connect()`](/fr/nodejs/api/net#socketconnectoptions-connectlistener) qui n'est pas déjà listée.

- `callback` [\<Function\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retourne : [\<tls.TLSSocket\>](/fr/nodejs/api/tls#class-tlstlssocket)

La fonction `callback`, si elle est spécifiée, sera ajoutée en tant qu'écouteur pour l'événement [`'secureConnect'`](/fr/nodejs/api/tls#event-secureconnect).

`tls.connect()` retourne un objet [`tls.TLSSocket`](/fr/nodejs/api/tls#class-tlstlssocket).

Contrairement à l'API `https`, `tls.connect()` n'active pas l'extension SNI (Server Name Indication) par défaut, ce qui peut amener certains serveurs à renvoyer un certificat incorrect ou à rejeter complètement la connexion. Pour activer SNI, définissez l'option `servername` en plus de `host`.

L'exemple suivant illustre un client pour l'exemple de serveur d'écho de [`tls.createServer()`](/fr/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener) :

::: code-group
```js [ESM]
// Supposons un serveur d'écho qui écoute sur le port 8000.
import { connect } from 'node:tls';
import { readFileSync } from 'node:fs';
import { stdin } from 'node:process';

const options = {
  // Nécessaire uniquement si le serveur requiert l'authentification par certificat client.
  key: readFileSync('client-key.pem'),
  cert: readFileSync('client-cert.pem'),

  // Nécessaire uniquement si le serveur utilise un certificat auto-signé.
  ca: [ readFileSync('server-cert.pem') ],

  // Nécessaire uniquement si le certificat du serveur n'est pas pour "localhost".
  checkServerIdentity: () => { return null; },
};

const socket = connect(8000, options, () => {
  console.log('client connected',
              socket.authorized ? 'authorized' : 'unauthorized');
  stdin.pipe(socket);
  stdin.resume();
});
socket.setEncoding('utf8');
socket.on('data', (data) => {
  console.log(data);
});
socket.on('end', () => {
  console.log('server ends connection');
});
```

```js [CJS]
// Supposons un serveur d'écho qui écoute sur le port 8000.
const { connect } = require('node:tls');
const { readFileSync } = require('node:fs');

const options = {
  // Nécessaire uniquement si le serveur requiert l'authentification par certificat client.
  key: readFileSync('client-key.pem'),
  cert: readFileSync('client-cert.pem'),

  // Nécessaire uniquement si le serveur utilise un certificat auto-signé.
  ca: [ readFileSync('server-cert.pem') ],

  // Nécessaire uniquement si le certificat du serveur n'est pas pour "localhost".
  checkServerIdentity: () => { return null; },
};

const socket = connect(8000, options, () => {
  console.log('client connected',
              socket.authorized ? 'authorized' : 'unauthorized');
  process.stdin.pipe(socket);
  process.stdin.resume();
});
socket.setEncoding('utf8');
socket.on('data', (data) => {
  console.log(data);
});
socket.on('end', () => {
  console.log('server ends connection');
});
```
:::

Pour générer le certificat et la clé pour cet exemple, exécutez :

```bash [BASH]
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
  -keyout client-key.pem -out client-cert.pem
```
Ensuite, pour générer le certificat `server-cert.pem` pour cet exemple, exécutez :

```bash [BASH]
openssl pkcs12 -certpbe AES-256-CBC -export -out server-cert.pem \
  -inkey client-key.pem -in client-cert.pem
```

## `tls.connect(path[, options][, callback])` {#tlsconnectpath-options-callback}

**Ajouté dans : v0.11.3**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Valeur par défaut pour `options.path`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Voir [`tls.connect()`](/fr/nodejs/api/tls#tlsconnectoptions-callback).
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Voir [`tls.connect()`](/fr/nodejs/api/tls#tlsconnectoptions-callback).
- Retourne : [\<tls.TLSSocket\>](/fr/nodejs/api/tls#class-tlstlssocket)

Identique à [`tls.connect()`](/fr/nodejs/api/tls#tlsconnectoptions-callback) sauf que `path` peut être fourni en tant qu’argument au lieu d’une option.

Une option path, si elle est spécifiée, prévaudra sur l’argument path.

## `tls.connect(port[, host][, options][, callback])` {#tlsconnectport-host-options-callback}

**Ajouté dans : v0.11.3**

- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Valeur par défaut pour `options.port`.
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Valeur par défaut pour `options.host`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Voir [`tls.connect()`](/fr/nodejs/api/tls#tlsconnectoptions-callback).
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Voir [`tls.connect()`](/fr/nodejs/api/tls#tlsconnectoptions-callback).
- Retourne : [\<tls.TLSSocket\>](/fr/nodejs/api/tls#class-tlstlssocket)

Identique à [`tls.connect()`](/fr/nodejs/api/tls#tlsconnectoptions-callback) sauf que `port` et `host` peuvent être fournis en tant qu’arguments au lieu d’options.

Une option port ou host, si elle est spécifiée, prévaudra sur tout argument port ou host.

## `tls.createSecureContext([options])` {#tlscreatesecurecontextoptions}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v22.9.0, v20.18.0 | L'option `allowPartialTrustChain` a été ajoutée. |
| v22.4.0, v20.16.0 | Les options `clientCertEngine`, `privateKeyEngine` et `privateKeyIdentifier` dépendent du support du moteur personnalisé dans OpenSSL qui est déprécié dans OpenSSL 3. |
| v19.8.0, v18.16.0 | L'option `dhparam` peut désormais être définie sur `'auto'` pour activer DHE avec des paramètres connus appropriés. |
| v12.12.0 | Ajout des options `privateKeyIdentifier` et `privateKeyEngine` pour obtenir la clé privée à partir d'un moteur OpenSSL. |
| v12.11.0 | Ajout de l'option `sigalgs` pour remplacer les algorithmes de signature pris en charge. |
| v12.0.0 | Ajout du support de TLSv1.3. |
| v11.5.0 | L'option `ca:` supporte désormais `BEGIN TRUSTED CERTIFICATE`. |
| v11.4.0, v10.16.0 | Les `minVersion` et `maxVersion` peuvent être utilisées pour restreindre les versions de protocole TLS autorisées. |
| v10.0.0 | La `ecdhCurve` ne peut plus être définie sur `false` en raison d'une modification dans OpenSSL. |
| v9.3.0 | Le paramètre `options` peut désormais inclure `clientCertEngine`. |
| v9.0.0 | L'option `ecdhCurve` peut désormais être plusieurs noms de courbe séparés par ':' ou `'auto'`. |
| v7.3.0 | Si l'option `key` est un tableau, les entrées individuelles n'ont plus besoin d'une propriété `passphrase`. Les entrées `Array` peuvent également être simplement des `string` ou des `Buffer` maintenant. |
| v5.2.0 | L'option `ca` peut désormais être une seule chaîne contenant plusieurs certificats CA. |
| v0.11.13 | Ajouté dans : v0.11.13 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `allowPartialTrustChain` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Traiter les certificats intermédiaires (non auto-signés) dans la liste de certificats CA de confiance comme fiables.
    - `ca` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<Buffer[]\>](/fr/nodejs/api/buffer#class-buffer) Remplace éventuellement les certificats CA de confiance. La valeur par défaut consiste à faire confiance aux autorités de certification bien connues organisées par Mozilla. Les autorités de certification de Mozilla sont complètement remplacées lorsque les autorités de certification sont explicitement spécifiées à l’aide de cette option. La valeur peut être une chaîne ou un `Buffer`, ou un `Array` de chaînes et/ou de `Buffer`s. Toute chaîne ou `Buffer` peut contenir plusieurs autorités de certification PEM concaténées. Le certificat du pair doit être chaînable à une autorité de certification approuvée par le serveur pour que la connexion soit authentifiée. Lorsque vous utilisez des certificats qui ne sont pas chaînables à une autorité de certification bien connue, l’autorité de certification du certificat doit être explicitement spécifiée comme fiable ou la connexion ne parviendra pas à s’authentifier. Si le pair utilise un certificat qui ne correspond pas ou ne se chaîne pas à l’une des autorités de certification par défaut, utilisez l’option `ca` pour fournir un certificat CA auquel le certificat du pair peut correspondre ou se chaîner. Pour les certificats auto-signés, le certificat est sa propre autorité de certification et doit être fourni. Pour les certificats encodés PEM, les types pris en charge sont « TRUSTED CERTIFICATE », « X509 CERTIFICATE » et « CERTIFICATE ». Voir aussi [`tls.rootCertificates`](/fr/nodejs/api/tls#tlsrootcertificates).
    - `cert` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<Buffer[]\>](/fr/nodejs/api/buffer#class-buffer) Chaînes de certificats au format PEM. Une chaîne de certificats doit être fournie par clé privée. Chaque chaîne de certificats doit être constituée du certificat au format PEM pour une `key` privée fournie, suivi des certificats intermédiaires au format PEM (le cas échéant), dans l’ordre, et sans inclure l’autorité de certification racine (l’autorité de certification racine doit être préconnue du pair, voir `ca`). Lorsque vous fournissez plusieurs chaînes de certificats, elles n’ont pas besoin d’être dans le même ordre que leurs clés privées dans `key`. Si les certificats intermédiaires ne sont pas fournis, le pair ne pourra pas valider le certificat et l’établissement de liaison échouera.
    - `sigalgs` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Liste séparée par des deux-points des algorithmes de signature pris en charge. La liste peut contenir des algorithmes de digest (`SHA256`, `MD5` etc.), des algorithmes de clé publique (`RSA-PSS`, `ECDSA` etc.), une combinaison des deux (par exemple 'RSA+SHA384') ou des noms de schéma TLS v1.3 (par exemple `rsa_pss_pss_sha512`). Voir [pages de manuel OpenSSL](https://www.openssl.org/docs/man1.1.1/man3/SSL_CTX_set1_sigalgs_list) pour plus d'informations.
    - `ciphers` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Spécification de la suite de chiffrement, remplaçant la valeur par défaut. Pour plus d’informations, voir [Modification de la suite de chiffrement TLS par défaut](/fr/nodejs/api/tls#modifying-the-default-tls-cipher-suite). Les chiffrements autorisés peuvent être obtenus via [`tls.getCiphers()`](/fr/nodejs/api/tls#tlsgetciphers). Les noms de chiffrement doivent être en majuscules pour qu’OpenSSL les accepte.
    - `clientCertEngine` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nom d’un moteur OpenSSL qui peut fournir le certificat client. **Déprécié.**
    - `crl` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<Buffer[]\>](/fr/nodejs/api/buffer#class-buffer) CRL au format PEM (Listes de révocation de certificats).
    - `dhparam` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) Paramètres Diffie-Hellman personnalisés ou `'auto'`, requis pour la [sécurité de transfert parfaite](/fr/nodejs/api/tls#perfect-forward-secrecy) non ECDHE. S’ils sont omis ou non valides, les paramètres sont supprimés silencieusement et les chiffrements DHE ne seront pas disponibles. La [sécurité de transfert parfaite](/fr/nodejs/api/tls#perfect-forward-secrecy) basée sur [ECDHE](https://en.wikipedia.org/wiki/Elliptic_curve_Diffie%E2%80%93Hellman) sera toujours disponible.
    - `ecdhCurve` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Une chaîne décrivant une courbe nommée ou une liste d’ID ou de noms de courbe séparés par des deux-points, par exemple `P-521:P-384:P-256`, à utiliser pour l’accord de clé ECDH. Définir sur `auto` pour sélectionner automatiquement la courbe. Utilisez [`crypto.getCurves()`](/fr/nodejs/api/crypto#cryptogetcurves) pour obtenir une liste des noms de courbe disponibles. Sur les versions récentes, `openssl ecparam -list_curves` affichera également le nom et la description de chaque courbe elliptique disponible. **Par défaut :** [`tls.DEFAULT_ECDH_CURVE`](/fr/nodejs/api/tls#tlsdefault_ecdh_curve).
    - `honorCipherOrder` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Tenter d’utiliser les préférences de la suite de chiffrement du serveur au lieu de celles du client. Lorsque la valeur est `true`, `SSL_OP_CIPHER_SERVER_PREFERENCE` est défini dans `secureOptions`, voir [Options OpenSSL](/fr/nodejs/api/crypto#openssl-options) pour plus d’informations.
    - `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<Buffer[]\>](/fr/nodejs/api/buffer#class-buffer) | [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Clés privées au format PEM. PEM permet d’encrypter les clés privées. Les clés cryptées seront décryptées avec `options.passphrase`. Plusieurs clés utilisant des algorithmes différents peuvent être fournies soit sous forme de tableau de chaînes de clés ou de buffers non cryptés, soit sous forme de tableau d’objets sous la forme `{pem: \<string|buffer\>[, passphrase: \<string\>]}`. La forme objet ne peut se produire que dans un tableau. `object.passphrase` est facultatif. Les clés cryptées seront décryptées avec `object.passphrase` si elle est fournie, ou `options.passphrase` si elle ne l’est pas.
    - `privateKeyEngine` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nom d’un moteur OpenSSL à partir duquel obtenir la clé privée. Doit être utilisé avec `privateKeyIdentifier`. **Déprécié.**
    - `privateKeyIdentifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Identifiant d’une clé privée gérée par un moteur OpenSSL. Doit être utilisé avec `privateKeyEngine`. Ne doit pas être défini avec `key`, car les deux options définissent une clé privée de différentes manières. **Déprécié.**
    - `maxVersion` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Définissez éventuellement la version TLS maximale autorisée. L'une des valeurs suivantes : `'TLSv1.3'`, `'TLSv1.2'`, `'TLSv1.1'` ou `'TLSv1'`. Ne peut pas être spécifié avec l'option `secureProtocol` ; utilisez l’une ou l’autre. **Par défaut :** [`tls.DEFAULT_MAX_VERSION`](/fr/nodejs/api/tls#tlsdefault_max_version).
    - `minVersion` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Définir éventuellement la version TLS minimale autorisée. L'une des valeurs suivantes : `'TLSv1.3'`, `'TLSv1.2'`, `'TLSv1.1'` ou `'TLSv1'`. Ne peut pas être spécifié avec l'option `secureProtocol` ; utilisez l’une ou l’autre. Évitez de définir une valeur inférieure à TLSv1.2, mais cela peut être nécessaire pour l’interopérabilité. Les versions antérieures à TLSv1.2 peuvent nécessiter une rétrogradation du [niveau de sécurité OpenSSL](/fr/nodejs/api/tls#openssl-security-level). **Par défaut :** [`tls.DEFAULT_MIN_VERSION`](/fr/nodejs/api/tls#tlsdefault_min_version).
    - `passphrase` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Phrase secrète partagée utilisée pour une seule clé privée et/ou un PFX.
    - `pfx` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<Buffer[]\>](/fr/nodejs/api/buffer#class-buffer) | [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Clé privée et chaîne de certificats encodées PFX ou PKCS12. `pfx` est une alternative à la fourniture de `key` et `cert` individuellement. PFX est généralement crypté, s’il l’est, `passphrase` sera utilisé pour le décrypter. Plusieurs PFX peuvent être fournis soit sous forme de tableau de buffers PFX non cryptés, soit sous forme de tableau d’objets sous la forme `{buf: \<string|buffer\>[, passphrase: \<string\>]}`. La forme objet ne peut se produire que dans un tableau. `object.passphrase` est facultatif. Les PFX cryptés seront décryptés avec `object.passphrase` s’il est fourni, ou `options.passphrase` s’il ne l’est pas.
    - `secureOptions` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Affecte éventuellement le comportement du protocole OpenSSL, ce qui n’est généralement pas nécessaire. Cela doit être utilisé avec précaution, voire pas du tout ! La valeur est un masque binaire numérique des options `SSL_OP_*` à partir des [Options OpenSSL](/fr/nodejs/api/crypto#openssl-options).
    - `secureProtocol` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Mécanisme hérité pour sélectionner la version du protocole TLS à utiliser, il ne prend pas en charge le contrôle indépendant des versions minimale et maximale et ne prend pas en charge la limitation du protocole à TLSv1.3. Utilisez plutôt `minVersion` et `maxVersion`. Les valeurs possibles sont répertoriées sous [SSL_METHODS](https://www.openssl.org/docs/man1.1.1/man7/ssl#Dealing-with-Protocol-Methods), utilisez les noms de fonctions sous forme de chaînes. Par exemple, utilisez `'TLSv1_1_method'` pour forcer TLS version 1.1, ou `'TLS_method'` pour autoriser toute version de protocole TLS jusqu’à TLSv1.3. Il n’est pas recommandé d’utiliser des versions TLS inférieures à 1.2, mais cela peut être nécessaire pour l’interopérabilité. **Par défaut :** aucun, voir `minVersion`.
    - `sessionIdContext` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Identifiant opaque utilisé par les serveurs pour garantir que l’état de la session n’est pas partagé entre les applications. Non utilisé par les clients.
    - `ticketKeys` : [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) 48 octets de données pseudo-aléatoires cryptographiquement fortes. Voir [Reprise de session](/fr/nodejs/api/tls#session-resumption) pour plus d’informations.
    - `sessionTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Le nombre de secondes après lequel une session TLS créée par le serveur ne sera plus résumable. Voir [Reprise de session](/fr/nodejs/api/tls#session-resumption) pour plus d’informations. **Par défaut :** `300`.
  
 

[`tls.createServer()`](/fr/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener) définit la valeur par défaut de l’option `honorCipherOrder` sur `true`, les autres API qui créent des contextes sécurisés la laissent non définie.

[`tls.createServer()`](/fr/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener) utilise une valeur de hachage SHA1 tronquée de 128 bits générée à partir de `process.argv` comme valeur par défaut de l’option `sessionIdContext`, les autres API qui créent des contextes sécurisés n’ont pas de valeur par défaut.

La méthode `tls.createSecureContext()` crée un objet `SecureContext`. Il est utilisable comme argument pour plusieurs API `tls`, telles que [`server.addContext()`](/fr/nodejs/api/tls#serveraddcontexthostname-context), mais n’a pas de méthodes publiques. Le constructeur [`tls.Server`](/fr/nodejs/api/tls#class-tlsserver) et la méthode [`tls.createServer()`](/fr/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener) ne prennent pas en charge l’option `secureContext`.

Une clé est *requise* pour les chiffrements qui utilisent des certificats. `key` ou `pfx` peuvent être utilisés pour la fournir.

Si l’option `ca` n’est pas donnée, alors Node.js utilisera par défaut la [liste des autorités de certification publiquement approuvées par Mozilla](https://hg.mozilla.org/mozilla-central/raw-file/tip/security/nss/lib/ckfw/builtins/certdata.txt).

Les paramètres DHE personnalisés sont déconseillés en faveur de la nouvelle option `dhparam : 'auto'`. Lorsqu’elle est définie sur `'auto'`, les paramètres DHE bien connus d’une force suffisante seront sélectionnés automatiquement. Sinon, si nécessaire, `openssl dhparam` peut être utilisé pour créer des paramètres personnalisés. La longueur de la clé doit être supérieure ou égale à 1024 bits, sinon une erreur sera générée. Bien que 1024 bits soient autorisés, utilisez 2048 bits ou plus pour une sécurité renforcée.


## `tls.createSecurePair([context][, isServer][, requestCert][, rejectUnauthorized][, options])` {#tlscreatesecurepaircontext-isserver-requestcert-rejectunauthorized-options}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v5.0.0 | Les options ALPN sont désormais prises en charge. |
| v0.11.3 | Déprécié depuis : v0.11.3 |
| v0.3.2 | Ajouté dans : v0.3.2 |
:::

::: danger [Stable : 0 - Déprécié]
[Stable : 0](/fr/nodejs/api/documentation#stability-index) [Stabilité : 0](/fr/nodejs/api/documentation#stability-index) - Déprécié : Utilisez [`tls.TLSSocket`](/fr/nodejs/api/tls#class-tlstlssocket) à la place.
:::

- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un objet de contexte sécurisé tel que renvoyé par `tls.createSecureContext()`
- `isServer` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` pour spécifier que cette connexion TLS doit être ouverte en tant que serveur.
- `requestCert` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` pour spécifier si un serveur doit demander un certificat à un client qui se connecte. S’applique uniquement lorsque `isServer` est `true`.
- `rejectUnauthorized` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si ce n’est pas `false`, un serveur rejette automatiquement les clients avec des certificats invalides. S’applique uniquement lorsque `isServer` est `true`.
- `options`
    - `enableTrace` : Voir [`tls.createServer()`](/fr/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `secureContext` : Un objet de contexte TLS de [`tls.createSecureContext()`](/fr/nodejs/api/tls#tlscreatesecurecontextoptions)
    - `isServer` : Si `true`, le socket TLS sera instancié en mode serveur. **Par défaut :** `false`.
    - `server` [\<net.Server\>](/fr/nodejs/api/net#class-netserver) Une instance [`net.Server`](/fr/nodejs/api/net#class-netserver)
    - `requestCert` : Voir [`tls.createServer()`](/fr/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `rejectUnauthorized` : Voir [`tls.createServer()`](/fr/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `ALPNProtocols` : Voir [`tls.createServer()`](/fr/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `SNICallback` : Voir [`tls.createServer()`](/fr/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `session` [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) Une instance `Buffer` contenant une session TLS.
    - `requestOCSP` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Si `true`, spécifie que l’extension de requête d’état OCSP sera ajoutée au client hello et qu’un événement `'OCSPResponse'` sera émis sur le socket avant d’établir une communication sécurisée.

Crée un nouvel objet de paire sécurisée avec deux flux, dont l’un lit et écrit les données chiffrées et l’autre lit et écrit les données en clair. Généralement, le flux chiffré est piped vers/depuis un flux de données chiffrées entrant et celui en clair est utilisé en remplacement du flux chiffré initial.

`tls.createSecurePair()` renvoie un objet `tls.SecurePair` avec des propriétés de flux `cleartext` et `encrypted`.

L’utilisation de `cleartext` a la même API que [`tls.TLSSocket`](/fr/nodejs/api/tls#class-tlstlssocket).

La méthode `tls.createSecurePair()` est désormais dépréciée en faveur de `tls.TLSSocket()`. Par exemple, le code :

```js [ESM]
pair = tls.createSecurePair(/* ... */);
pair.encrypted.pipe(socket);
socket.pipe(pair.encrypted);
```
peut être remplacé par :

```js [ESM]
secureSocket = tls.TLSSocket(socket, options);
```
où `secureSocket` a la même API que `pair.cleartext`.


## `tls.createServer([options][, secureConnectionListener])` {#tlscreateserveroptions-secureconnectionlistener}

::: info [Historique]
| Version | Modifications |
| --- | --- |
| v22.4.0, v20.16.0 | L'option `clientCertEngine` dépend du support moteur personnalisé dans OpenSSL qui est obsolète dans OpenSSL 3. |
| v19.0.0 | Si `ALPNProtocols` est défini, les connexions entrantes qui envoient une extension ALPN sans protocoles pris en charge sont terminées avec une alerte fatale `no_application_protocol`. |
| v20.4.0, v18.19.0 | Le paramètre `options` peut désormais inclure `ALPNCallback`. |
| v12.3.0 | Le paramètre `options` prend désormais en charge les options `net.createServer()`. |
| v9.3.0 | Le paramètre `options` peut désormais inclure `clientCertEngine`. |
| v8.0.0 | L'option `ALPNProtocols` peut maintenant être un `TypedArray` ou un `DataView`. |
| v5.0.0 | Les options ALPN sont maintenant prises en charge. |
| v0.3.2 | Ajouté dans : v0.3.2 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ALPNProtocols`: [\<string[]\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer[]\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray[]\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/DataView) Un tableau de chaînes, de `Buffer`s, de `TypedArray`s ou de `DataView`s, ou un seul `Buffer`, `TypedArray` ou `DataView` contenant les protocoles ALPN pris en charge. Les `Buffer`s doivent avoir le format `[len][nom][len][nom]...` par ex. `0x05hello0x05world`, où le premier octet est la longueur du nom du protocole suivant. Passer un tableau est généralement beaucoup plus simple, par ex. `['hello', 'world']`. (Les protocoles doivent être classés par priorité.)
    - `ALPNCallback`: [\<Function\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Function) Si cette option est définie, elle sera appelée lorsqu'un client ouvrira une connexion en utilisant l'extension ALPN. Un argument sera passé au rappel : un objet contenant les champs `servername` et `protocols`, contenant respectivement le nom du serveur de l'extension SNI (le cas échéant) et un tableau de chaînes de nom de protocole ALPN. Le rappel doit renvoyer l'une des chaînes listées dans `protocols`, qui sera renvoyée au client comme protocole ALPN sélectionné, ou `undefined`, pour rejeter la connexion avec une alerte fatale. Si une chaîne est renvoyée qui ne correspond pas à l'un des protocoles ALPN du client, une erreur sera levée. Cette option ne peut pas être utilisée avec l'option `ALPNProtocols`, et la définition des deux options lèvera une erreur.
    - `clientCertEngine` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#String_type) Nom d'un moteur OpenSSL qui peut fournir le certificat client. **Obsolète.**
    - `enableTrace` [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Boolean_type) Si `true`, [`tls.TLSSocket.enableTrace()`](/fr/nodejs/api/tls#tlssocketenabletrace) sera appelée sur les nouvelles connexions. Le traçage peut être activé après l'établissement de la connexion sécurisée, mais cette option doit être utilisée pour tracer la configuration de la connexion sécurisée. **Par défaut :** `false`.
    - `handshakeTimeout` [\<number\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Number_type) Interrompre la connexion si la négociation SSL/TLS ne se termine pas dans le nombre de millisecondes spécifié. Un `'tlsClientError'` est émis sur l'objet `tls.Server` chaque fois qu'un délai d'attente de négociation est atteint. **Par défaut :** `120000` (120 secondes).
    - `rejectUnauthorized` [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Boolean_type) Si différent de `false`, le serveur rejettera toute connexion qui n'est pas autorisée avec la liste des autorités de certification fournies. Cette option n'a d'effet que si `requestCert` est `true`. **Par défaut :** `true`.
    - `requestCert` [\<boolean\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Boolean_type) Si `true`, le serveur demandera un certificat aux clients qui se connectent et tentera de vérifier ce certificat. **Par défaut :** `false`.
    - `sessionTimeout` [\<number\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#Number_type) Le nombre de secondes après lequel une session TLS créée par le serveur ne sera plus résumable. Voir [Reprise de session](/fr/nodejs/api/tls#session-resumption) pour plus d'informations. **Par défaut :** `300`.
    - `SNICallback(servername, callback)` [\<Function\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Function) Une fonction qui sera appelée si le client prend en charge l'extension SNI TLS. Deux arguments seront passés lors de l'appel : `servername` et `callback`. `callback` est un rappel de type erreur d'abord qui prend deux arguments optionnels : `error` et `ctx`. `ctx`, si fourni, est une instance `SecureContext`. [`tls.createSecureContext()`](/fr/nodejs/api/tls#tlscreatesecurecontextoptions) peut être utilisé pour obtenir un `SecureContext` approprié. Si `callback` est appelé avec un argument `ctx` faux, le contexte sécurisé par défaut du serveur sera utilisé. Si `SNICallback` n'a pas été fourni, le rappel par défaut avec l'API de haut niveau sera utilisé (voir ci-dessous).
    - `ticketKeys`: [\<Buffer\>](/fr/nodejs/api/buffer#class-buffer) 48 octets de données pseudo-aléatoires cryptographiquement robustes. Voir [Reprise de session](/fr/nodejs/api/tls#session-resumption) pour plus d'informations.
    - `pskCallback` [\<Function\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Function) Pour la négociation TLS-PSK, voir [Clés pré-partagées](/fr/nodejs/api/tls#pre-shared-keys).
    - `pskIdentityHint` [\<string\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures#String_type) indication facultative à envoyer à un client pour l'aider à sélectionner l'identité lors de la négociation TLS-PSK. Sera ignoré dans TLS 1.3. En cas d'échec de définition de pskIdentityHint, `'tlsClientError'` sera émis avec le code `'ERR_TLS_PSK_SET_IDENTITY_HINT_FAILED'`.
    - ... : Toute option [`tls.createSecureContext()`](/fr/nodejs/api/tls#tlscreatesecurecontextoptions) peut être fournie. Pour les serveurs, les options d'identité (`pfx`, `key`/`cert` ou `pskCallback`) sont généralement requises.
    - ... : Toute option [`net.createServer()`](/fr/nodejs/api/net#netcreateserveroptions-connectionlistener) peut être fournie.
  
 
- `secureConnectionListener` [\<Function\>](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Retourne : [\<tls.Server\>](/fr/nodejs/api/tls#class-tlsserver)

Crée un nouveau [`tls.Server`](/fr/nodejs/api/tls#class-tlsserver). Le `secureConnectionListener`, s'il est fourni, est automatiquement défini comme un écouteur pour l'événement [`'secureConnection'`](/fr/nodejs/api/tls#event-secureconnection).

L'option `ticketKeys` est automatiquement partagée entre les workers du module `node:cluster`.

L'exemple suivant illustre un simple serveur d'écho :

::: code-group
```js [ESM]
import { createServer } from 'node:tls';
import { readFileSync } from 'node:fs';

const options = {
  key: readFileSync('server-key.pem'),
  cert: readFileSync('server-cert.pem'),

  // This is necessary only if using client certificate authentication.
  requestCert: true,

  // This is necessary only if the client uses a self-signed certificate.
  ca: [ readFileSync('client-cert.pem') ],
};

const server = createServer(options, (socket) => {
  console.log('server connected',
              socket.authorized ? 'authorized' : 'unauthorized');
  socket.write('welcome!\n');
  socket.setEncoding('utf8');
  socket.pipe(socket);
});
server.listen(8000, () => {
  console.log('server bound');
});
```

```js [CJS]
const { createServer } = require('node:tls');
const { readFileSync } = require('node:fs');

const options = {
  key: readFileSync('server-key.pem'),
  cert: readFileSync('server-cert.pem'),

  // This is necessary only if using client certificate authentication.
  requestCert: true,

  // This is necessary only if the client uses a self-signed certificate.
  ca: [ readFileSync('client-cert.pem') ],
};

const server = createServer(options, (socket) => {
  console.log('server connected',
              socket.authorized ? 'authorized' : 'unauthorized');
  socket.write('welcome!\n');
  socket.setEncoding('utf8');
  socket.pipe(socket);
});
server.listen(8000, () => {
  console.log('server bound');
});
```
:::

Pour générer le certificat et la clé pour cet exemple, exécutez :

```bash [BASH]
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
  -keyout server-key.pem -out server-cert.pem
```
Ensuite, pour générer le certificat `client-cert.pem` pour cet exemple, exécutez :

```bash [BASH]
openssl pkcs12 -certpbe AES-256-CBC -export -out client-cert.pem \
  -inkey server-key.pem -in server-cert.pem
```
Le serveur peut être testé en s'y connectant à l'aide de l'exemple de client de [`tls.connect()`](/fr/nodejs/api/tls#tlsconnectoptions-callback).


## `tls.getCiphers()` {#tlsgetciphers}

**Ajouté dans : v0.10.2**

- Renvoie : [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Renvoie un tableau avec les noms des algorithmes de chiffrement TLS pris en charge. Les noms sont en minuscules pour des raisons historiques, mais doivent être en majuscules pour être utilisés dans l'option `ciphers` de [`tls.createSecureContext()`](/fr/nodejs/api/tls#tlscreatesecurecontextoptions).

Tous les algorithmes de chiffrement pris en charge ne sont pas activés par défaut. Voir [Modification de la suite de chiffrement TLS par défaut](/fr/nodejs/api/tls#modifying-the-default-tls-cipher-suite).

Les noms de chiffrement qui commencent par `'tls_'` sont pour TLSv1.3, tous les autres sont pour TLSv1.2 et inférieur.

```js [ESM]
console.log(tls.getCiphers()); // ['aes128-gcm-sha256', 'aes128-sha', ...]
```
## `tls.rootCertificates` {#tlsrootcertificates}

**Ajouté dans : v12.3.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Un tableau immuable de chaînes de caractères représentant les certificats racine (au format PEM) du magasin de CA Mozilla fourni avec la version actuelle de Node.js.

Le magasin de CA fourni avec Node.js est un instantané du magasin de CA Mozilla qui est figé au moment de la publication. Il est identique sur toutes les plateformes prises en charge.

## `tls.DEFAULT_ECDH_CURVE` {#tlsdefault_ecdh_curve}


::: info [Historique]
| Version | Modifications |
| --- | --- |
| v10.0.0 | La valeur par défaut est passée à `'auto'`. |
| v0.11.13 | Ajouté dans : v0.11.13 |
:::

Le nom de courbe par défaut à utiliser pour l'accord de clé ECDH dans un serveur tls. La valeur par défaut est `'auto'`. Voir [`tls.createSecureContext()`](/fr/nodejs/api/tls#tlscreatesecurecontextoptions) pour plus d'informations.

## `tls.DEFAULT_MAX_VERSION` {#tlsdefault_max_version}

**Ajouté dans : v11.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La valeur par défaut de l'option `maxVersion` de [`tls.createSecureContext()`](/fr/nodejs/api/tls#tlscreatesecurecontextoptions). Il peut être affecté à l'une des versions de protocole TLS prises en charge, `'TLSv1.3'`, `'TLSv1.2'`, `'TLSv1.1'` ou `'TLSv1'`. **Par défaut :** `'TLSv1.3'`, sauf si elle est modifiée à l'aide des options CLI. L'utilisation de `--tls-max-v1.2` définit la valeur par défaut sur `'TLSv1.2'`. L'utilisation de `--tls-max-v1.3` définit la valeur par défaut sur `'TLSv1.3'`. Si plusieurs options sont fournies, le maximum le plus élevé est utilisé.


## `tls.DEFAULT_MIN_VERSION` {#tlsdefault_min_version}

**Ajouté dans: v11.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La valeur par défaut de l'option `minVersion` de [`tls.createSecureContext()`](/fr/nodejs/api/tls#tlscreatesecurecontextoptions). Elle peut se voir attribuer n'importe laquelle des versions de protocole TLS prises en charge, `'TLSv1.3'`, `'TLSv1.2'`, `'TLSv1.1'` ou `'TLSv1'`. Les versions antérieures à TLSv1.2 peuvent nécessiter une rétrogradation du [Niveau de sécurité OpenSSL](/fr/nodejs/api/tls#openssl-security-level). **Par défaut :** `'TLSv1.2'`, sauf modification à l'aide des options CLI. L'utilisation de `--tls-min-v1.0` définit la valeur par défaut sur `'TLSv1'`. L'utilisation de `--tls-min-v1.1` définit la valeur par défaut sur `'TLSv1.1'`. L'utilisation de `--tls-min-v1.3` définit la valeur par défaut sur `'TLSv1.3'`. Si plusieurs de ces options sont fournies, le minimum le plus bas est utilisé.

## `tls.DEFAULT_CIPHERS` {#tlsdefault_ciphers}

**Ajouté dans: v19.8.0, v18.16.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La valeur par défaut de l'option `ciphers` de [`tls.createSecureContext()`](/fr/nodejs/api/tls#tlscreatesecurecontextoptions). Elle peut se voir attribuer n'importe quel chiffrement OpenSSL pris en charge. La valeur par défaut est le contenu de `crypto.constants.defaultCoreCipherList`, sauf si elle est modifiée à l'aide des options CLI via `--tls-default-ciphers`.

