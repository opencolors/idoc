---
title: Documentazione Node.js - TLS (Sicurezza del Livello di Trasporto)
description: Questa sezione della documentazione di Node.js tratta del modulo TLS (Sicurezza del Livello di Trasporto), che fornisce un'implementazione dei protocolli TLS e SSL. Include dettagli sulla creazione di connessioni sicure, la gestione dei certificati, la gestione della comunicazione sicura e varie opzioni per configurare TLS/SSL nelle applicazioni Node.js.
head:
  - - meta
    - name: og:title
      content: Documentazione Node.js - TLS (Sicurezza del Livello di Trasporto) | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Questa sezione della documentazione di Node.js tratta del modulo TLS (Sicurezza del Livello di Trasporto), che fornisce un'implementazione dei protocolli TLS e SSL. Include dettagli sulla creazione di connessioni sicure, la gestione dei certificati, la gestione della comunicazione sicura e varie opzioni per configurare TLS/SSL nelle applicazioni Node.js.
  - - meta
    - name: twitter:title
      content: Documentazione Node.js - TLS (Sicurezza del Livello di Trasporto) | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Questa sezione della documentazione di Node.js tratta del modulo TLS (Sicurezza del Livello di Trasporto), che fornisce un'implementazione dei protocolli TLS e SSL. Include dettagli sulla creazione di connessioni sicure, la gestione dei certificati, la gestione della comunicazione sicura e varie opzioni per configurare TLS/SSL nelle applicazioni Node.js.
---


# TLS (SSL) {#tls-ssl}

::: tip [Stabile: 2 - Stabile]
[Stabile: 2](/it/nodejs/api/documentation#stability-index) [Stabilità: 2](/it/nodejs/api/documentation#stability-index) - Stabile
:::

**Codice sorgente:** [lib/tls.js](https://github.com/nodejs/node/blob/v23.5.0/lib/tls.js)

Il modulo `node:tls` fornisce un'implementazione dei protocolli Transport Layer Security (TLS) e Secure Socket Layer (SSL) basata su OpenSSL. È possibile accedere al modulo utilizzando:

::: code-group
```js [ESM]
import tls from 'node:tls';
```

```js [CJS]
const tls = require('node:tls');
```
:::

## Determinare se il supporto crittografico non è disponibile {#determining-if-crypto-support-is-unavailable}

È possibile che Node.js sia stato compilato senza includere il supporto per il modulo `node:crypto`. In tali casi, tentare di `import` da `tls` o chiamare `require('node:tls')` comporterà la generazione di un errore.

Quando si utilizza CommonJS, l'errore generato può essere intercettato utilizzando try/catch:

```js [CJS]
let tls;
try {
  tls = require('node:tls');
} catch (err) {
  console.error('il supporto tls è disabilitato!');
}
```
Quando si utilizza la parola chiave lessicale ESM `import`, l'errore può essere intercettato solo se un gestore per `process.on('uncaughtException')` viene registrato *prima* di qualsiasi tentativo di caricare il modulo (utilizzando, ad esempio, un modulo di precaricamento).

Quando si utilizza ESM, se c'è la possibilità che il codice possa essere eseguito su una build di Node.js in cui il supporto crittografico non è abilitato, valuta la possibilità di utilizzare la funzione [`import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) anziché la parola chiave lessicale `import`:

```js [ESM]
let tls;
try {
  tls = await import('node:tls');
} catch (err) {
  console.error('il supporto tls è disabilitato!');
}
```
## Concetti di TLS/SSL {#tls/ssl-concepts}

TLS/SSL è un insieme di protocolli che si basano su un'infrastruttura a chiave pubblica (PKI) per abilitare la comunicazione sicura tra un client e un server. Nella maggior parte dei casi comuni, ogni server deve avere una chiave privata.

Le chiavi private possono essere generate in diversi modi. L'esempio seguente illustra l'uso dell'interfaccia a riga di comando di OpenSSL per generare una chiave privata RSA a 2048 bit:

```bash [BASH]
openssl genrsa -out ryans-key.pem 2048
```
Con TLS/SSL, tutti i server (e alcuni client) devono avere un *certificato*. I certificati sono *chiavi pubbliche* che corrispondono a una chiave privata e che sono firmate digitalmente da un'autorità di certificazione o dal proprietario della chiave privata (tali certificati sono denominati "auto-firmati"). Il primo passo per ottenere un certificato è creare un file *Certificate Signing Request* (CSR).

L'interfaccia a riga di comando di OpenSSL può essere utilizzata per generare un CSR per una chiave privata:

```bash [BASH]
openssl req -new -sha256 -key ryans-key.pem -out ryans-csr.pem
```
Una volta generato il file CSR, può essere inviato a un'autorità di certificazione per la firma o utilizzato per generare un certificato auto-firmato.

La creazione di un certificato auto-firmato utilizzando l'interfaccia a riga di comando di OpenSSL è illustrata nell'esempio seguente:

```bash [BASH]
openssl x509 -req -in ryans-csr.pem -signkey ryans-key.pem -out ryans-cert.pem
```
Una volta generato il certificato, può essere utilizzato per generare un file `.pfx` o `.p12`:

```bash [BASH]
openssl pkcs12 -export -in ryans-cert.pem -inkey ryans-key.pem \
      -certfile ca-cert.pem -out ryans.pfx
```
Dove:

- `in`: è il certificato firmato
- `inkey`: è la chiave privata associata
- `certfile`: è una concatenazione di tutti i certificati dell'autorità di certificazione (CA) in un unico file, ad esempio `cat ca1-cert.pem ca2-cert.pem \> ca-cert.pem`


### Perfect forward secrecy {#perfect-forward-secrecy}

Il termine *<a href="https://en.wikipedia.org/wiki/Perfect_forward_secrecy">forward secrecy</a>* o *perfect forward secrecy* descrive una caratteristica dei metodi di key-agreement (cioè di key-exchange). In altre parole, le chiavi del server e del client vengono utilizzate per negoziare nuove chiavi temporanee utilizzate specificamente e solo per la sessione di comunicazione corrente. In pratica, questo significa che anche se la chiave privata del server venisse compromessa, la comunicazione può essere decrittografata dagli intercettatori solo se l'attaccante riesce a ottenere la coppia di chiavi generata appositamente per la sessione.

La perfect forward secrecy si ottiene generando casualmente una coppia di chiavi per il key-agreement ad ogni handshake TLS/SSL (al contrario dell'utilizzo della stessa chiave per tutte le sessioni). I metodi che implementano questa tecnica sono chiamati "effimeri".

Attualmente, due metodi sono comunemente usati per ottenere la perfect forward secrecy (nota il carattere "E" aggiunto alle abbreviazioni tradizionali):

- [ECDHE](https://en.wikipedia.org/wiki/Elliptic_curve_Diffie%E2%80%93Hellman): Una versione effimera del protocollo di key-agreement Elliptic Curve Diffie-Hellman.
- [DHE](https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange): Una versione effimera del protocollo di key-agreement Diffie-Hellman.

La perfect forward secrecy che utilizza ECDHE è abilitata di default. L'opzione `ecdhCurve` può essere utilizzata durante la creazione di un server TLS per personalizzare l'elenco delle curve ECDH supportate da utilizzare. Vedi [`tls.createServer()`](/it/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener) per maggiori informazioni.

DHE è disabilitato di default ma può essere abilitato insieme a ECDHE impostando l'opzione `dhparam` su `'auto'`. Anche i parametri DHE personalizzati sono supportati, ma sconsigliati a favore di parametri ben noti selezionati automaticamente.

La perfect forward secrecy era opzionale fino a TLSv1.2. A partire da TLSv1.3, (EC)DHE è sempre utilizzato (ad eccezione delle connessioni solo PSK).

### ALPN e SNI {#alpn-and-sni}

ALPN (Application-Layer Protocol Negotiation Extension) e SNI (Server Name Indication) sono estensioni dell'handshake TLS:

- ALPN: Consente l'uso di un server TLS per più protocolli (HTTP, HTTP/2)
- SNI: Consente l'uso di un server TLS per più hostname con certificati diversi.


### Chiavi pre-condivise {#pre-shared-keys}

Il supporto TLS-PSK è disponibile come alternativa alla normale autenticazione basata su certificati. Utilizza una chiave pre-condivisa invece dei certificati per autenticare una connessione TLS, fornendo autenticazione reciproca. TLS-PSK e l'infrastruttura a chiave pubblica non si escludono a vicenda. Client e server possono supportare entrambi, scegliendo uno dei due durante la normale fase di negoziazione della cifratura.

TLS-PSK è una buona scelta solo dove esistono mezzi per condividere in modo sicuro una chiave con ogni macchina che si connette, quindi non sostituisce l'infrastruttura a chiave pubblica (PKI) per la maggior parte degli usi di TLS. L'implementazione TLS-PSK in OpenSSL ha visto molte falle di sicurezza negli ultimi anni, soprattutto perché è utilizzata solo da una minoranza di applicazioni. Si prega di considerare tutte le soluzioni alternative prima di passare alle cifrature PSK. Durante la generazione di PSK, è di fondamentale importanza utilizzare una sufficiente entropia, come discusso in [RFC 4086](https://tools.ietf.org/html/rfc4086). Derivare un segreto condiviso da una password o da altre fonti a bassa entropia non è sicuro.

Le cifrature PSK sono disabilitate per impostazione predefinita e l'utilizzo di TLS-PSK richiede quindi la specifica esplicita di una suite di cifratura con l'opzione `ciphers`. L'elenco delle cifrature disponibili può essere recuperato tramite `openssl ciphers -v 'PSK'`. Tutte le cifrature TLS 1.3 sono idonee per PSK e possono essere recuperate tramite `openssl ciphers -v -s -tls1_3 -psk`. Sulla connessione client, un `checkServerIdentity` personalizzato deve essere passato perché quello predefinito fallirà in assenza di un certificato.

Secondo [RFC 4279](https://tools.ietf.org/html/rfc4279), devono essere supportate identità PSK fino a 128 byte di lunghezza e PSK fino a 64 byte di lunghezza. A partire da OpenSSL 1.1.0 la dimensione massima dell'identità è di 128 byte e la lunghezza massima del PSK è di 256 byte.

L'implementazione attuale non supporta i callback PSK asincroni a causa delle limitazioni dell'API OpenSSL sottostante.

Per utilizzare TLS-PSK, client e server devono specificare l'opzione `pskCallback`, una funzione che restituisce il PSK da utilizzare (che deve essere compatibile con il digest della cifratura selezionata).

Verrà chiamato prima sul client:

- hint: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) messaggio opzionale inviato dal server per aiutare il client a decidere quale identità utilizzare durante la negoziazione. Sempre `null` se viene utilizzato TLS 1.3.
- Returns: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) nella forma `{ psk: \<Buffer|TypedArray|DataView\>, identity: \<string\> }` o `null`.

Quindi sul server:

- socket: [\<tls.TLSSocket\>](/it/nodejs/api/tls#class-tlstlssocket) l'istanza del socket del server, equivalente a `this`.
- identity: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) parametro di identità inviato dal client.
- Returns: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) il PSK (o `null`).

Un valore di ritorno di `null` interrompe il processo di negoziazione e invia un messaggio di avviso `unknown_psk_identity` all'altra parte. Se il server desidera nascondere il fatto che l'identità PSK non era nota, il callback deve fornire alcuni dati casuali come `psk` per far fallire la connessione con `decrypt_error` prima che la negoziazione sia terminata.


### Mitigazione degli attacchi di rinegoziazione iniziati dal client {#client-initiated-renegotiation-attack-mitigation}

Il protocollo TLS consente ai client di rinegoziare alcuni aspetti della sessione TLS. Sfortunatamente, la rinegoziazione della sessione richiede una quantità sproporzionata di risorse lato server, rendendola un potenziale vettore per attacchi denial-of-service.

Per mitigare il rischio, la rinegoziazione è limitata a tre volte ogni dieci minuti. Un evento `'error'` viene emesso sull'istanza [`tls.TLSSocket`](/it/nodejs/api/tls#class-tlstlssocket) quando questa soglia viene superata. I limiti sono configurabili:

- `tls.CLIENT_RENEG_LIMIT` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Specifica il numero di richieste di rinegoziazione. **Predefinito:** `3`.
- `tls.CLIENT_RENEG_WINDOW` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Specifica la finestra di tempo di rinegoziazione in secondi. **Predefinito:** `600` (10 minuti).

I limiti di rinegoziazione predefiniti non devono essere modificati senza una piena comprensione delle implicazioni e dei rischi.

TLSv1.3 non supporta la rinegoziazione.

### Ripresa della sessione {#session-resumption}

Stabilire una sessione TLS può essere relativamente lento. Il processo può essere accelerato salvando e riutilizzando in seguito lo stato della sessione. Esistono diversi meccanismi per farlo, discussi qui dal più vecchio al più recente (e preferito).

#### Identificatori di sessione {#session-identifiers}

I server generano un ID univoco per le nuove connessioni e lo inviano al client. Client e server salvano lo stato della sessione. Quando si riconnette, i client inviano l'ID del loro stato di sessione salvato e, se anche il server ha lo stato per quell'ID, può accettare di utilizzarlo. Altrimenti, il server creerà una nuova sessione. Vedi [RFC 2246](https://www.ietf.org/rfc/rfc2246.txt) per maggiori informazioni, pagina 23 e 30.

La ripresa utilizzando gli identificatori di sessione è supportata dalla maggior parte dei browser web quando si effettuano richieste HTTPS.

Per Node.js, i client attendono l'evento [`'session'`](/it/nodejs/api/tls#event-session) per ottenere i dati della sessione e forniscono i dati all'opzione `session` di un successivo [`tls.connect()`](/it/nodejs/api/tls#tlsconnectoptions-callback) per riutilizzare la sessione. I server devono implementare gestori per gli eventi [`'newSession'`](/it/nodejs/api/tls#event-newsession) e [`'resumeSession'`](/it/nodejs/api/tls#event-resumesession) per salvare e ripristinare i dati della sessione utilizzando l'ID della sessione come chiave di ricerca per riutilizzare le sessioni. Per riutilizzare le sessioni tra load balancer o worker del cluster, i server devono utilizzare una cache di sessione condivisa (come Redis) nei loro gestori di sessione.


#### Ticket di sessione {#session-tickets}

I server crittografano l'intero stato della sessione e lo inviano al client come "ticket". Quando ci si ricollega, lo stato viene inviato al server nella connessione iniziale. Questo meccanismo evita la necessità di una cache di sessione lato server. Se il server non utilizza il ticket, per qualsiasi motivo (impossibilità di decrittografarlo, è troppo vecchio, ecc.), creerà una nuova sessione e invierà un nuovo ticket. Per ulteriori informazioni, consultare [RFC 5077](https://tools.ietf.org/html/rfc5077).

La ripresa tramite ticket di sessione sta diventando comunemente supportata da molti browser web quando si effettuano richieste HTTPS.

Per Node.js, i client utilizzano le stesse API per la ripresa con identificatori di sessione come per la ripresa con ticket di sessione. Per il debug, se [`tls.TLSSocket.getTLSTicket()`](/it/nodejs/api/tls#tlssocketgettlsticket) restituisce un valore, i dati della sessione contengono un ticket, altrimenti contengono lo stato della sessione lato client.

Con TLSv1.3, tenere presente che il server può inviare più ticket, il che comporta più eventi `'session'`, vedere [`'session'`](/it/nodejs/api/tls#event-session) per ulteriori informazioni.

I server a processo singolo non necessitano di implementazioni specifiche per utilizzare i ticket di sessione. Per utilizzare i ticket di sessione tra riavvii del server o bilanciatori del carico, tutti i server devono avere le stesse chiavi del ticket. Internamente ci sono tre chiavi da 16 byte, ma l'API tls le espone come un singolo buffer da 48 byte per comodità.

È possibile ottenere le chiavi del ticket chiamando [`server.getTicketKeys()`](/it/nodejs/api/tls#servergetticketkeys) su un'istanza del server e quindi distribuirle, ma è più ragionevole generare in modo sicuro 48 byte di dati casuali sicuri e impostarli con l'opzione `ticketKeys` di [`tls.createServer()`](/it/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener). Le chiavi devono essere rigenerate regolarmente e le chiavi del server possono essere ripristinate con [`server.setTicketKeys()`](/it/nodejs/api/tls#serversetticketkeyskeys).

Le chiavi del ticket di sessione sono chiavi crittografiche e *<strong>devono essere archiviate in modo sicuro</strong>*. Con TLS 1.2 e versioni precedenti, se vengono compromesse, tutte le sessioni che utilizzavano ticket crittografati con esse possono essere decrittografate. Non devono essere archiviate su disco e devono essere rigenerate regolarmente.

Se i client pubblicizzano il supporto per i ticket, il server li invierà. Il server può disabilitare i ticket fornendo `require('node:constants').SSL_OP_NO_TICKET` in `secureOptions`.

Sia gli identificatori di sessione che i ticket di sessione scadono, il che fa sì che il server crei nuove sessioni. Il timeout può essere configurato con l'opzione `sessionTimeout` di [`tls.createServer()`](/it/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener).

Per tutti i meccanismi, quando la ripresa non riesce, i server creeranno nuove sessioni. Poiché il mancato ripristino della sessione non causa errori di connessione TLS/HTTPS, è facile non notare prestazioni TLS inutilmente scadenti. La CLI di OpenSSL può essere utilizzata per verificare che i server stiano riprendendo le sessioni. Utilizzare l'opzione `-reconnect` per `openssl s_client`, ad esempio:

```bash [BASH]
openssl s_client -connect localhost:443 -reconnect
```
Leggere l'output di debug. La prima connessione dovrebbe dire "New", ad esempio:

```text [TEXT]
New, TLSv1.2, Cipher is ECDHE-RSA-AES128-GCM-SHA256
```
Le connessioni successive dovrebbero dire "Reused", ad esempio:

```text [TEXT]
Reused, TLSv1.2, Cipher is ECDHE-RSA-AES128-GCM-SHA256
```

## Modifica della suite di cifratura TLS predefinita {#modifying-the-default-tls-cipher-suite}

Node.js è costruito con una suite predefinita di cifrari TLS abilitati e disabilitati. Questo elenco di cifrari predefinito può essere configurato durante la costruzione di Node.js per consentire alle distribuzioni di fornire il proprio elenco predefinito.

Il seguente comando può essere utilizzato per visualizzare la suite di cifratura predefinita:

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
Questo valore predefinito può essere sostituito interamente utilizzando l'opzione della riga di comando [`--tls-cipher-list`](/it/nodejs/api/cli#--tls-cipher-listlist) (direttamente o tramite la variabile d'ambiente [`NODE_OPTIONS`](/it/nodejs/api/cli#node_optionsoptions)). Ad esempio, quanto segue imposta `ECDHE-RSA-AES128-GCM-SHA256:!RC4` come suite di cifratura TLS predefinita:

```bash [BASH]
node --tls-cipher-list='ECDHE-RSA-AES128-GCM-SHA256:!RC4' server.js

export NODE_OPTIONS=--tls-cipher-list='ECDHE-RSA-AES128-GCM-SHA256:!RC4'
node server.js
```
Per verificare, utilizzare il seguente comando per visualizzare l'elenco di cifrari impostato, notare la differenza tra `defaultCoreCipherList` e `defaultCipherList`:

```bash [BASH]
node --tls-cipher-list='ECDHE-RSA-AES128-GCM-SHA256:!RC4' -p crypto.constants.defaultCipherList | tr ':' '\n'
ECDHE-RSA-AES128-GCM-SHA256
!RC4
```
Cioè, l'elenco `defaultCoreCipherList` è impostato in fase di compilazione e il `defaultCipherList` è impostato in fase di esecuzione.

Per modificare le suite di cifratura predefinite dall'interno del runtime, modificare la variabile `tls.DEFAULT_CIPHERS`, questa operazione deve essere eseguita prima di mettersi in ascolto su qualsiasi socket, non influirà sui socket già aperti. Per esempio:

```js [ESM]
// Rimuovi i cifrari CBC obsoleti e i cifrari basati sullo scambio di chiavi RSA poiché non forniscono la segretezza in avanti
tls.DEFAULT_CIPHERS +=
  ':!ECDHE-RSA-AES128-SHA:!ECDHE-RSA-AES128-SHA256:!ECDHE-RSA-AES256-SHA:!ECDHE-RSA-AES256-SHA384' +
  ':!ECDHE-ECDSA-AES128-SHA:!ECDHE-ECDSA-AES128-SHA256:!ECDHE-ECDSA-AES256-SHA:!ECDHE-ECDSA-AES256-SHA384' +
  ':!kRSA';
```
Il valore predefinito può anche essere sostituito per singolo client o server utilizzando l'opzione `ciphers` da [`tls.createSecureContext()`](/it/nodejs/api/tls#tlscreatesecurecontextoptions), che è disponibile anche in [`tls.createServer()`](/it/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener), [`tls.connect()`](/it/nodejs/api/tls#tlsconnectoptions-callback) e quando si creano nuovi [`tls.TLSSocket`](/it/nodejs/api/tls#class-tlstlssocket).

L'elenco dei cifrari può contenere un mix di nomi di suite di cifratura TLSv1.3, quelli che iniziano con `'TLS_'`, e specifiche per le suite di cifratura TLSv1.2 e inferiori. I cifrari TLSv1.2 supportano un formato di specifica legacy, consultare la documentazione di OpenSSL [formato dell'elenco dei cifrari](https://www.openssl.org/docs/man1.1.1/man1/ciphers#CIPHER-LIST-FORMAT) per i dettagli, ma tali specifiche *non* si applicano ai cifrari TLSv1.3. Le suite TLSv1.3 possono essere abilitate solo includendo il loro nome completo nell'elenco dei cifrari. Non possono, ad esempio, essere abilitati o disabilitati utilizzando la specifica legacy TLSv1.2 `'EECDH'` o `'!EECDH'`.

Nonostante l'ordine relativo delle suite di cifratura TLSv1.3 e TLSv1.2, il protocollo TLSv1.3 è significativamente più sicuro di TLSv1.2 e sarà sempre scelto rispetto a TLSv1.2 se l'handshake indica che è supportato e se sono abilitate suite di cifratura TLSv1.3.

La suite di cifratura predefinita inclusa in Node.js è stata accuratamente selezionata per riflettere le migliori pratiche di sicurezza attuali e la mitigazione del rischio. La modifica della suite di cifratura predefinita può avere un impatto significativo sulla sicurezza di un'applicazione. L'opzione `--tls-cipher-list` e l'opzione `ciphers` devono essere utilizzate solo se assolutamente necessario.

La suite di cifratura predefinita preferisce i cifrari GCM per l'impostazione di [crittografia moderna di Chrome](https://www.chromium.org/Home/chromium-security/education/tls#TOC-Cipher-Suites) e preferisce anche i cifrari ECDHE e DHE per la perfetta segretezza in avanti, offrendo al contempo *una certa* compatibilità con le versioni precedenti.

I vecchi client che si basano su cifrari RC4 o DES non sicuri e deprecati (come Internet Explorer 6) non possono completare il processo di handshake con la configurazione predefinita. Se questi client *devono* essere supportati, i [consigli TLS](https://wiki.mozilla.org/Security/Server_Side_TLS) possono offrire una suite di cifratura compatibile. Per maggiori dettagli sul formato, vedere la documentazione di OpenSSL [formato dell'elenco dei cifrari](https://www.openssl.org/docs/man1.1.1/man1/ciphers#CIPHER-LIST-FORMAT).

Esistono solo cinque suite di cifratura TLSv1.3:

- `'TLS_AES_256_GCM_SHA384'`
- `'TLS_CHACHA20_POLY1305_SHA256'`
- `'TLS_AES_128_GCM_SHA256'`
- `'TLS_AES_128_CCM_SHA256'`
- `'TLS_AES_128_CCM_8_SHA256'`

I primi tre sono abilitati per impostazione predefinita. Le due suite basate su `CCM` sono supportate da TLSv1.3 perché potrebbero essere più performanti su sistemi vincolati, ma non sono abilitate per impostazione predefinita poiché offrono meno sicurezza.


## Livello di sicurezza OpenSSL {#openssl-security-level}

La libreria OpenSSL applica livelli di sicurezza per controllare il livello minimo accettabile di sicurezza per le operazioni crittografiche. I livelli di sicurezza di OpenSSL vanno da 0 a 5, e ogni livello impone requisiti di sicurezza più severi. Il livello di sicurezza predefinito è 1, che è generalmente adatto per la maggior parte delle applicazioni moderne. Tuttavia, alcune funzionalità e protocolli legacy, come TLSv1, richiedono un livello di sicurezza inferiore (`SECLEVEL=0`) per funzionare correttamente. Per informazioni più dettagliate, fare riferimento alla [documentazione OpenSSL sui livelli di sicurezza](https://www.openssl.org/docs/manmaster/man3/SSL_CTX_set_security_level#DEFAULT-CALLBACK-BEHAVIOUR).

### Impostazione dei livelli di sicurezza {#setting-security-levels}

Per regolare il livello di sicurezza nella tua applicazione Node.js, puoi includere `@SECLEVEL=X` all'interno di una stringa di cifratura, dove `X` è il livello di sicurezza desiderato. Ad esempio, per impostare il livello di sicurezza a 0 durante l'utilizzo dell'elenco di cifrari OpenSSL predefinito, potresti usare:

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

Questo approccio imposta il livello di sicurezza a 0, consentendo l'uso di funzionalità legacy pur sfruttando le cifrature OpenSSL predefinite.

### Utilizzo {#using}

Puoi anche impostare il livello di sicurezza e le cifrature dalla riga di comando usando `--tls-cipher-list=DEFAULT@SECLEVEL=X` come descritto in [Modifica della suite di cifratura TLS predefinita](/it/nodejs/api/tls#modifying-the-default-tls-cipher-suite). Tuttavia, è generalmente sconsigliato utilizzare l'opzione della riga di comando per impostare le cifrature ed è preferibile configurare le cifrature per singoli contesti all'interno del codice dell'applicazione, poiché questo approccio fornisce un controllo più preciso e riduce il rischio di ridurre a livello globale il livello di sicurezza.


## Codici di errore del certificato X509 {#x509-certificate-error-codes}

Molteplici funzioni possono fallire a causa di errori del certificato che vengono segnalati da OpenSSL. In tal caso, la funzione fornisce un [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) tramite il suo callback che ha la proprietà `code` che può assumere uno dei seguenti valori:

- `'UNABLE_TO_GET_ISSUER_CERT'`: Impossibile ottenere il certificato dell'emittente.
- `'UNABLE_TO_GET_CRL'`: Impossibile ottenere la CRL del certificato.
- `'UNABLE_TO_DECRYPT_CERT_SIGNATURE'`: Impossibile decrittografare la firma del certificato.
- `'UNABLE_TO_DECRYPT_CRL_SIGNATURE'`: Impossibile decrittografare la firma della CRL.
- `'UNABLE_TO_DECODE_ISSUER_PUBLIC_KEY'`: Impossibile decodificare la chiave pubblica dell'emittente.
- `'CERT_SIGNATURE_FAILURE'`: Errore nella firma del certificato.
- `'CRL_SIGNATURE_FAILURE'`: Errore nella firma della CRL.
- `'CERT_NOT_YET_VALID'`: Il certificato non è ancora valido.
- `'CERT_HAS_EXPIRED'`: Il certificato è scaduto.
- `'CRL_NOT_YET_VALID'`: La CRL non è ancora valida.
- `'CRL_HAS_EXPIRED'`: La CRL è scaduta.
- `'ERROR_IN_CERT_NOT_BEFORE_FIELD'`: Errore di formato nel campo notBefore del certificato.
- `'ERROR_IN_CERT_NOT_AFTER_FIELD'`: Errore di formato nel campo notAfter del certificato.
- `'ERROR_IN_CRL_LAST_UPDATE_FIELD'`: Errore di formato nel campo lastUpdate della CRL.
- `'ERROR_IN_CRL_NEXT_UPDATE_FIELD'`: Errore di formato nel campo nextUpdate della CRL.
- `'OUT_OF_MEM'`: Memoria insufficiente.
- `'DEPTH_ZERO_SELF_SIGNED_CERT'`: Certificato autofirmato.
- `'SELF_SIGNED_CERT_IN_CHAIN'`: Certificato autofirmato nella catena di certificati.
- `'UNABLE_TO_GET_ISSUER_CERT_LOCALLY'`: Impossibile ottenere il certificato dell'emittente locale.
- `'UNABLE_TO_VERIFY_LEAF_SIGNATURE'`: Impossibile verificare il primo certificato.
- `'CERT_CHAIN_TOO_LONG'`: Catena di certificati troppo lunga.
- `'CERT_REVOKED'`: Certificato revocato.
- `'INVALID_CA'`: Certificato CA non valido.
- `'PATH_LENGTH_EXCEEDED'`: Vincolo di lunghezza del percorso superato.
- `'INVALID_PURPOSE'`: Scopo del certificato non supportato.
- `'CERT_UNTRUSTED'`: Certificato non attendibile.
- `'CERT_REJECTED'`: Certificato rifiutato.
- `'HOSTNAME_MISMATCH'`: Mancata corrispondenza del nome host.


## Classe: `tls.CryptoStream` {#class-tlscryptostream}

**Aggiunta in: v0.3.4**

**Deprecata da: v0.11.3**

::: danger [Stabile: 0 - Deprecata]
[Stabile: 0](/it/nodejs/api/documentation#stability-index) [Stabilità: 0](/it/nodejs/api/documentation#stability-index) - Deprecata: Utilizzare [`tls.TLSSocket`](/it/nodejs/api/tls#class-tlstlssocket) invece.
:::

La classe `tls.CryptoStream` rappresenta un flusso di dati crittografati. Questa classe è deprecata e non dovrebbe più essere utilizzata.

### `cryptoStream.bytesWritten` {#cryptostreambyteswritten}

**Aggiunta in: v0.3.4**

**Deprecata da: v0.11.3**

La proprietà `cryptoStream.bytesWritten` restituisce il numero totale di byte scritti nel socket sottostante *inclusi* i byte necessari per l'implementazione del protocollo TLS.

## Classe: `tls.SecurePair` {#class-tlssecurepair}

**Aggiunta in: v0.3.2**

**Deprecata da: v0.11.3**

::: danger [Stabile: 0 - Deprecata]
[Stabile: 0](/it/nodejs/api/documentation#stability-index) [Stabilità: 0](/it/nodejs/api/documentation#stability-index) - Deprecata: Utilizzare [`tls.TLSSocket`](/it/nodejs/api/tls#class-tlstlssocket) invece.
:::

Restituito da [`tls.createSecurePair()`](/it/nodejs/api/tls#tlscreatesecurepaircontext-isserver-requestcert-rejectunauthorized-options).

### Evento: `'secure'` {#event-secure}

**Aggiunta in: v0.3.2**

**Deprecata da: v0.11.3**

L'evento `'secure'` viene emesso dall'oggetto `SecurePair` una volta stabilita una connessione sicura.

Come per il controllo dell'evento [`'secureConnection'`](/it/nodejs/api/tls#event-secureconnection) del server, `pair.cleartext.authorized` deve essere ispezionato per confermare se il certificato utilizzato è correttamente autorizzato.

## Classe: `tls.Server` {#class-tlsserver}

**Aggiunta in: v0.3.2**

- Estende: [\<net.Server\>](/it/nodejs/api/net#class-netserver)

Accetta connessioni crittografate utilizzando TLS o SSL.

### Evento: `'connection'` {#event-connection}

**Aggiunta in: v0.3.2**

- `socket` [\<stream.Duplex\>](/it/nodejs/api/stream#class-streamduplex)

Questo evento viene emesso quando viene stabilito un nuovo flusso TCP, prima che inizi l'handshake TLS. `socket` è tipicamente un oggetto di tipo [`net.Socket`](/it/nodejs/api/net#class-netsocket) ma non riceverà eventi a differenza del socket creato dall'evento `'connection'` di [`net.Server`](/it/nodejs/api/net#class-netserver). Di solito gli utenti non vorranno accedere a questo evento.

Questo evento può anche essere emesso esplicitamente dagli utenti per iniettare connessioni nel server TLS. In tal caso, può essere passato qualsiasi flusso [`Duplex`](/it/nodejs/api/stream#class-streamduplex).


### Evento: `'keylog'` {#event-keylog}

**Aggiunto in: v12.3.0, v10.20.0**

- `line` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) Riga di testo ASCII, nel formato `SSLKEYLOGFILE` di NSS.
- `tlsSocket` [\<tls.TLSSocket\>](/it/nodejs/api/tls#class-tlstlssocket) L'istanza `tls.TLSSocket` su cui è stata generata.

L'evento `keylog` viene emesso quando il materiale chiave viene generato o ricevuto da una connessione a questo server (in genere prima che l'handshake sia completo, ma non necessariamente). Questo materiale di chiave può essere memorizzato per il debug, poiché consente di decrittografare il traffico TLS catturato. Potrebbe essere emesso più volte per ogni socket.

Un tipico caso d'uso è quello di aggiungere le righe ricevute a un file di testo comune, che viene successivamente utilizzato da software (come Wireshark) per decrittografare il traffico:

```js [ESM]
const logFile = fs.createWriteStream('/tmp/ssl-keys.log', { flags: 'a' });
// ...
server.on('keylog', (line, tlsSocket) => {
  if (tlsSocket.remoteAddress !== '...')
    return; // Registra solo le chiavi per un particolare IP
  logFile.write(line);
});
```
### Evento: `'newSession'` {#event-newsession}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v0.11.12 | L'argomento `callback` è ora supportato. |
| v0.9.2 | Aggiunto in: v0.9.2 |
:::

L'evento `'newSession'` viene emesso alla creazione di una nuova sessione TLS. Questo può essere utilizzato per memorizzare le sessioni in una memoria esterna. I dati devono essere forniti alla callback [`'resumeSession'`](/it/nodejs/api/tls#event-resumesession).

La callback del listener riceve tre argomenti quando viene chiamata:

- `sessionId` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) L'identificatore della sessione TLS
- `sessionData` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) I dati della sessione TLS
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una funzione di callback che non accetta argomenti e che deve essere invocata affinché i dati possano essere inviati o ricevuti tramite la connessione sicura.

L'ascolto di questo evento avrà effetto solo sulle connessioni stabilite dopo l'aggiunta del listener di eventi.

### Evento: `'OCSPRequest'` {#event-ocsprequest}

**Aggiunto in: v0.11.13**

L'evento `'OCSPRequest'` viene emesso quando il client invia una richiesta di stato del certificato. La callback del listener riceve tre argomenti quando viene chiamata:

- `certificate` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) Il certificato del server
- `issuer` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) Il certificato dell'emittente
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una funzione di callback che deve essere invocata per fornire i risultati della richiesta OCSP.

Il certificato corrente del server può essere analizzato per ottenere l'URL OCSP e l'ID del certificato; dopo aver ottenuto una risposta OCSP, viene quindi invocato `callback(null, resp)`, dove `resp` è un'istanza `Buffer` contenente la risposta OCSP. Sia `certificate` che `issuer` sono rappresentazioni DER `Buffer` dei certificati primari e dell'emittente. Questi possono essere utilizzati per ottenere l'ID del certificato OCSP e l'URL dell'endpoint OCSP.

In alternativa, può essere chiamato `callback(null, null)`, indicando che non c'era alcuna risposta OCSP.

La chiamata a `callback(err)` comporterà una chiamata a `socket.destroy(err)`.

Il flusso tipico di una richiesta OCSP è il seguente:

L'`issuer` può essere `null` se il certificato è autofirmato o se l'emittente non è nell'elenco dei certificati radice. (Un emittente può essere fornito tramite l'opzione `ca` quando si stabilisce la connessione TLS.)

L'ascolto di questo evento avrà effetto solo sulle connessioni stabilite dopo l'aggiunta del listener di eventi.

Un modulo npm come [asn1.js](https://www.npmjs.com/package/asn1.js) può essere utilizzato per analizzare i certificati.


### Evento: `'resumeSession'` {#event-resumesession}

**Aggiunto in: v0.9.2**

L'evento `'resumeSession'` viene emesso quando il client richiede di riprendere una sessione TLS precedente. La funzione di callback dell'ascoltatore viene passata con due argomenti quando viene chiamata:

- `sessionId` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) L'identificatore della sessione TLS
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una funzione di callback da chiamare quando la sessione precedente è stata ripristinata: `callback([err[, sessionData]])`
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `sessionData` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer)
  
 

L'ascoltatore dell'evento dovrebbe eseguire una ricerca in uno spazio di archiviazione esterno dei `sessionData` salvati dal gestore dell'evento [`'newSession'`](/it/nodejs/api/tls#event-newsession) usando il `sessionId` specificato. Se trovato, chiama `callback(null, sessionData)` per riprendere la sessione. Se non trovato, la sessione non può essere ripresa. `callback()` deve essere chiamata senza `sessionData` in modo che l'handshake possa continuare e una nuova sessione possa essere creata. È possibile chiamare `callback(err)` per terminare la connessione in entrata e distruggere il socket.

L'ascolto di questo evento avrà effetto solo sulle connessioni stabilite dopo l'aggiunta dell'ascoltatore dell'evento.

Quanto segue illustra la ripresa di una sessione TLS:

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
### Evento: `'secureConnection'` {#event-secureconnection}

**Aggiunto in: v0.3.2**

L'evento `'secureConnection'` viene emesso dopo che il processo di handshake per una nuova connessione è stato completato con successo. La funzione di callback dell'ascoltatore viene passata con un singolo argomento quando viene chiamata:

- `tlsSocket` [\<tls.TLSSocket\>](/it/nodejs/api/tls#class-tlstlssocket) Il socket TLS stabilito.

La proprietà `tlsSocket.authorized` è un `boolean` che indica se il client è stato verificato da una delle Autorità di Certificazione fornite per il server. Se `tlsSocket.authorized` è `false`, allora `socket.authorizationError` viene impostato per descrivere come è fallita l'autorizzazione. A seconda delle impostazioni del server TLS, le connessioni non autorizzate possono comunque essere accettate.

La proprietà `tlsSocket.alpnProtocol` è una stringa che contiene il protocollo ALPN selezionato. Quando ALPN non ha un protocollo selezionato perché il client o il server non hanno inviato un'estensione ALPN, `tlsSocket.alpnProtocol` è uguale a `false`.

La proprietà `tlsSocket.servername` è una stringa contenente il nome del server richiesto tramite SNI.


### Evento: `'tlsClientError'` {#event-tlsclienterror}

**Aggiunto in: v6.0.0**

L'evento `'tlsClientError'` viene emesso quando si verifica un errore prima che venga stabilita una connessione sicura. Il callback del listener riceve due argomenti quando viene chiamato:

- `exception` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) L'oggetto `Error` che descrive l'errore
- `tlsSocket` [\<tls.TLSSocket\>](/it/nodejs/api/tls#class-tlstlssocket) L'istanza `tls.TLSSocket` da cui ha avuto origine l'errore.

### `server.addContext(hostname, context)` {#serveraddcontexthostname-context}

**Aggiunto in: v0.5.3**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Un nome host SNI o un carattere jolly (es. `'*'`)
- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<tls.SecureContext\>](/it/nodejs/api/tls#tlscreatesecurecontextoptions) Un oggetto contenente una qualsiasi delle possibili proprietà dagli argomenti `options` di [`tls.createSecureContext()`](/it/nodejs/api/tls#tlscreatesecurecontextoptions) (es. `key`, `cert`, `ca`, ecc.) oppure un oggetto di contesto TLS creato con [`tls.createSecureContext()`](/it/nodejs/api/tls#tlscreatesecurecontextoptions) stesso.

Il metodo `server.addContext()` aggiunge un contesto sicuro che verrà utilizzato se il nome SNI della richiesta del client corrisponde all'`hostname` fornito (o al carattere jolly).

Quando ci sono più contesti corrispondenti, viene utilizzato quello aggiunto più di recente.

### `server.address()` {#serveraddress}

**Aggiunto in: v0.6.0**

- Restituisce: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Restituisce l'indirizzo di binding, il nome della famiglia di indirizzi e la porta del server come riportato dal sistema operativo. Consulta [`net.Server.address()`](/it/nodejs/api/net#serveraddress) per maggiori informazioni.

### `server.close([callback])` {#serverclosecallback}

**Aggiunto in: v0.3.2**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Un callback del listener che verrà registrato per ascoltare l'evento `'close'` dell'istanza del server.
- Restituisce: [\<tls.Server\>](/it/nodejs/api/tls#class-tlsserver)

Il metodo `server.close()` impedisce al server di accettare nuove connessioni.

Questa funzione opera in modo asincrono. L'evento `'close'` verrà emesso quando il server non avrà più connessioni aperte.


### `server.getTicketKeys()` {#servergetticketkeys}

**Aggiunto in: v3.0.0**

- Restituisce: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) Un buffer di 48 byte contenente le chiavi del ticket di sessione.

Restituisce le chiavi del ticket di sessione.

Vedere [Ripresa della sessione](/it/nodejs/api/tls#session-resumption) per maggiori informazioni.

### `server.listen()` {#serverlisten}

Avvia il server in ascolto di connessioni crittografate. Questo metodo è identico a [`server.listen()`](/it/nodejs/api/net#serverlisten) da [`net.Server`](/it/nodejs/api/net#class-netserver).

### `server.setSecureContext(options)` {#serversetsecurecontextoptions}

**Aggiunto in: v11.0.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un oggetto contenente una qualsiasi delle proprietà possibili dagli argomenti `options` di [`tls.createSecureContext()`](/it/nodejs/api/tls#tlscreatesecurecontextoptions) (ad es. `key`, `cert`, `ca`, ecc.).

Il metodo `server.setSecureContext()` sostituisce il contesto sicuro di un server esistente. Le connessioni esistenti al server non vengono interrotte.

### `server.setTicketKeys(keys)` {#serversetticketkeyskeys}

**Aggiunto in: v3.0.0**

- `keys` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Un buffer di 48 byte contenente le chiavi del ticket di sessione.

Imposta le chiavi del ticket di sessione.

Le modifiche alle chiavi del ticket sono effettive solo per le connessioni future al server. Le connessioni al server esistenti o attualmente in sospeso utilizzeranno le chiavi precedenti.

Vedere [Ripresa della sessione](/it/nodejs/api/tls#session-resumption) per maggiori informazioni.

## Classe: `tls.TLSSocket` {#class-tlstlssocket}

**Aggiunto in: v0.11.4**

- Estende: [\<net.Socket\>](/it/nodejs/api/net#class-netsocket)

Esegue la crittografia trasparente dei dati scritti e tutta la negoziazione TLS richiesta.

Le istanze di `tls.TLSSocket` implementano l'interfaccia duplex [Stream](/it/nodejs/api/stream#stream).

I metodi che restituiscono i metadati della connessione TLS (ad es. [`tls.TLSSocket.getPeerCertificate()`](/it/nodejs/api/tls#tlssocketgetpeercertificatedetailed)) restituiranno i dati solo mentre la connessione è aperta.


### `new tls.TLSSocket(socket[, options])` {#new-tlstlssocketsocket-options}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v12.2.0 | L'opzione `enableTrace` è ora supportata. |
| v5.0.0 | Le opzioni ALPN sono ora supportate. |
| v0.11.4 | Aggiunto in: v0.11.4 |
:::

- `socket` [\<net.Socket\>](/it/nodejs/api/net#class-netsocket) | [\<stream.Duplex\>](/it/nodejs/api/stream#class-streamduplex) Sul lato server, qualsiasi stream `Duplex`. Sul lato client, qualsiasi istanza di [`net.Socket`](/it/nodejs/api/net#class-netsocket) (per il supporto generico dello stream `Duplex` sul lato client, deve essere utilizzato [`tls.connect()`](/it/nodejs/api/tls#tlsconnectoptions-callback)).
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `enableTrace`: Vedi [`tls.createServer()`](/it/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `isServer`: Il protocollo SSL/TLS è asimmetrico, i TLSSocket devono sapere se devono comportarsi come un server o un client. Se `true` il socket TLS verrà istanziato come un server. **Predefinito:** `false`.
    - `server` [\<net.Server\>](/it/nodejs/api/net#class-netserver) Un'istanza di [`net.Server`](/it/nodejs/api/net#class-netserver).
    - `requestCert`: Indica se autenticare il peer remoto richiedendo un certificato. I client richiedono sempre un certificato del server. I server (`isServer` è true) possono impostare `requestCert` su true per richiedere un certificato client.
    - `rejectUnauthorized`: Vedi [`tls.createServer()`](/it/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `ALPNProtocols`: Vedi [`tls.createServer()`](/it/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `SNICallback`: Vedi [`tls.createServer()`](/it/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `session` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) Un'istanza di `Buffer` contenente una sessione TLS.
    - `requestOCSP` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, specifica che l'estensione della richiesta di stato OCSP verrà aggiunta all'hello del client e un evento `'OCSPResponse'` verrà emesso sul socket prima di stabilire una comunicazione sicura.
    - `secureContext`: Oggetto contesto TLS creato con [`tls.createSecureContext()`](/it/nodejs/api/tls#tlscreatesecurecontextoptions). Se un `secureContext` *non* viene fornito, ne verrà creato uno passando l'intero oggetto `options` a `tls.createSecureContext()`.
    - ...: Opzioni di [`tls.createSecureContext()`](/it/nodejs/api/tls#tlscreatesecurecontextoptions) che vengono utilizzate se l'opzione `secureContext` è mancante. Altrimenti, vengono ignorate.
  
 

Costruisce un nuovo oggetto `tls.TLSSocket` da un socket TCP esistente.


### Evento: `'keylog'` {#event-keylog_1}

**Aggiunto in: v12.3.0, v10.20.0**

- `line` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) Riga di testo ASCII, nel formato NSS `SSLKEYLOGFILE`.

L'evento `keylog` viene emesso su un `tls.TLSSocket` quando il materiale della chiave viene generato o ricevuto dal socket. Questo materiale di chiave può essere memorizzato per il debug, poiché consente di decrittografare il traffico TLS catturato. Può essere emesso più volte, prima o dopo il completamento dell'handshake.

Un tipico caso d'uso è quello di aggiungere le righe ricevute a un file di testo comune, che viene successivamente utilizzato da un software (come Wireshark) per decrittografare il traffico:

```js [ESM]
const logFile = fs.createWriteStream('/tmp/ssl-keys.log', { flags: 'a' });
// ...
tlsSocket.on('keylog', (line) => logFile.write(line));
```
### Evento: `'OCSPResponse'` {#event-ocspresponse}

**Aggiunto in: v0.11.13**

L'evento `'OCSPResponse'` viene emesso se l'opzione `requestOCSP` è stata impostata quando è stato creato il `tls.TLSSocket` ed è stata ricevuta una risposta OCSP. La funzione di callback del listener viene passata con un singolo argomento quando viene chiamata:

- `response` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) La risposta OCSP del server

In genere, la `response` è un oggetto firmato digitalmente dalla CA del server che contiene informazioni sullo stato di revoca del certificato del server.

### Evento: `'secureConnect'` {#event-secureconnect}

**Aggiunto in: v0.11.4**

L'evento `'secureConnect'` viene emesso dopo che il processo di handshake per una nuova connessione è stato completato con successo. La funzione di callback del listener verrà chiamata indipendentemente dal fatto che il certificato del server sia stato autorizzato o meno. È responsabilità del client controllare la proprietà `tlsSocket.authorized` per determinare se il certificato del server è stato firmato da una delle CA specificate. Se `tlsSocket.authorized === false`, l'errore può essere trovato esaminando la proprietà `tlsSocket.authorizationError`. Se è stato utilizzato ALPN, è possibile controllare la proprietà `tlsSocket.alpnProtocol` per determinare il protocollo negoziato.

L'evento `'secureConnect'` non viene emesso quando un [\<tls.TLSSocket\>](/it/nodejs/api/tls#class-tlstlssocket) viene creato utilizzando il costruttore `new tls.TLSSocket()`.


### Evento: `'session'` {#event-session}

**Aggiunto in: v11.10.0**

- `session` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer)

L'evento `'session'` viene emesso su un `tls.TLSSocket` client quando una nuova sessione o un nuovo ticket TLS è disponibile. Questo può avvenire o meno prima che l'handshake sia completo, a seconda della versione del protocollo TLS negoziata. L'evento non viene emesso sul server, o se una nuova sessione non è stata creata, ad esempio, quando la connessione è stata ripresa. Per alcune versioni del protocollo TLS, l'evento può essere emesso più volte, nel qual caso tutte le sessioni possono essere utilizzate per la ripresa.

Sul client, la `session` può essere fornita all'opzione `session` di [`tls.connect()`](/it/nodejs/api/tls#tlsconnectoptions-callback) per riprendere la connessione.

Vedere [Ripresa della sessione](/it/nodejs/api/tls#session-resumption) per ulteriori informazioni.

Per TLSv1.2 e precedenti, [`tls.TLSSocket.getSession()`](/it/nodejs/api/tls#tlssocketgetsession) può essere chiamata una volta completato l'handshake. Per TLSv1.3, solo la ripresa basata su ticket è consentita dal protocollo, vengono inviati più ticket e i ticket non vengono inviati fino a dopo il completamento dell'handshake. Quindi è necessario attendere l'evento `'session'` per ottenere una sessione ripristinabile. Le applicazioni dovrebbero utilizzare l'evento `'session'` invece di `getSession()` per garantire che funzionino per tutte le versioni TLS. Le applicazioni che si aspettano solo di ottenere o utilizzare una sessione dovrebbero ascoltare questo evento solo una volta:

```js [ESM]
tlsSocket.once('session', (session) => {
  // La sessione può essere utilizzata immediatamente o in seguito.
  tls.connect({
    session: session,
    // Altre opzioni di connessione...
  });
});
```
### `tlsSocket.address()` {#tlssocketaddress}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.4.0 | La proprietà `family` ora restituisce una stringa invece di un numero. |
| v18.0.0 | La proprietà `family` ora restituisce un numero invece di una stringa. |
| v0.11.4 | Aggiunto in: v0.11.4 |
:::

- Restituisce: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Restituisce l'`address` vincolato, il nome della `family` dell'indirizzo e la `port` del socket sottostante come riportato dal sistema operativo: `{ port: 12346, family: 'IPv4', address: '127.0.0.1' }`.


### `tlsSocket.authorizationError` {#tlssocketauthorizationerror}

**Aggiunto in: v0.11.4**

Restituisce il motivo per cui il certificato del peer non è stato verificato. Questa proprietà è impostata solo quando `tlsSocket.authorized === false`.

### `tlsSocket.authorized` {#tlssocketauthorized}

**Aggiunto in: v0.11.4**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Questa proprietà è `true` se il certificato del peer è stato firmato da una delle CA specificate durante la creazione dell'istanza `tls.TLSSocket`, altrimenti `false`.

### `tlsSocket.disableRenegotiation()` {#tlssocketdisablerenegotiation}

**Aggiunto in: v8.4.0**

Disabilita la rinegoziazione TLS per questa istanza `TLSSocket`. Una volta chiamato, i tentativi di rinegoziazione attiveranno un evento `'error'` sul `TLSSocket`.

### `tlsSocket.enableTrace()` {#tlssocketenabletrace}

**Aggiunto in: v12.2.0**

Quando abilitato, le informazioni sulla traccia dei pacchetti TLS vengono scritte su `stderr`. Questo può essere usato per eseguire il debug dei problemi di connessione TLS.

Il formato dell'output è identico all'output di `openssl s_client -trace` o `openssl s_server -trace`. Sebbene sia prodotto dalla funzione `SSL_trace()` di OpenSSL, il formato non è documentato, può cambiare senza preavviso e non ci si dovrebbe fare affidamento.

### `tlsSocket.encrypted` {#tlssocketencrypted}

**Aggiunto in: v0.11.4**

Restituisce sempre `true`. Questo può essere usato per distinguere i socket TLS dalle istanze regolari `net.Socket`.

### `tlsSocket.exportKeyingMaterial(length, label[, context])` {#tlssocketexportkeyingmateriallength-label-context}

**Aggiunto in: v13.10.0, v12.17.0**

- `length` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) numero di byte da recuperare dal materiale di cifratura
- `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) un'etichetta specifica dell'applicazione, in genere sarà un valore dal [Registro delle etichette Exporter IANA](https://www.iana.org/assignments/tls-parameters/tls-parameters.xhtml#exporter-labels).
- `context` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) Fornire opzionalmente un contesto.
- Restituisce: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) i byte richiesti del materiale di cifratura

Il materiale di cifratura viene utilizzato per le validazioni per prevenire diversi tipi di attacchi nei protocolli di rete, ad esempio nelle specifiche di IEEE 802.1X.

Esempio

```js [ESM]
const keyingMaterial = tlsSocket.exportKeyingMaterial(
  128,
  'client finished');

/*
 Example return value of keyingMaterial:
 <Buffer 76 26 af 99 c5 56 8e 42 09 91 ef 9f 93 cb ad 6c 7b 65 f8 53 f1 d8 d9
    12 5a 33 b8 b5 25 df 7b 37 9f e0 e2 4f b8 67 83 a3 2f cd 5d 41 42 4c 91
    74 ef 2c ... 78 more bytes>
*/
```
Vedere la documentazione OpenSSL [`SSL_export_keying_material`](https://www.openssl.org/docs/man1.1.1/man3/SSL_export_keying_material) per maggiori informazioni.


### `tlsSocket.getCertificate()` {#tlssocketgetcertificate}

**Aggiunto in: v11.2.0**

- Restituisce: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Restituisce un oggetto che rappresenta il certificato locale. L'oggetto restituito ha alcune proprietà corrispondenti ai campi del certificato.

Vedi [`tls.TLSSocket.getPeerCertificate()`](/it/nodejs/api/tls#tlssocketgetpeercertificatedetailed) per un esempio della struttura del certificato.

Se non c'è un certificato locale, verrà restituito un oggetto vuoto. Se il socket è stato distrutto, verrà restituito `null`.

### `tlsSocket.getCipher()` {#tlssocketgetcipher}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v13.4.0, v12.16.0 | Restituisce il nome della cifratura IETF come `standardName`. |
| v12.0.0 | Restituisce la versione minima della cifratura, invece di una stringa fissa (`'TLSv1/SSLv3'`). |
| v0.11.4 | Aggiunto in: v0.11.4 |
:::

- Restituisce: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `name` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome OpenSSL per la suite di cifratura.
    - `standardName` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome IETF per la suite di cifratura.
    - `version` [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La versione minima del protocollo TLS supportata da questa suite di cifratura. Per il protocollo negoziato effettivo, vedi [`tls.TLSSocket.getProtocol()`](/it/nodejs/api/tls#tlssocketgetprotocol).
  
 

Restituisce un oggetto contenente informazioni sulla suite di cifratura negoziata.

Ad esempio, un protocollo TLSv1.2 con cifratura AES256-SHA:

```json [JSON]
{
    "name": "AES256-SHA",
    "standardName": "TLS_RSA_WITH_AES_256_CBC_SHA",
    "version": "SSLv3"
}
```
Vedi [SSL_CIPHER_get_name](https://www.openssl.org/docs/man1.1.1/man3/SSL_CIPHER_get_name) per maggiori informazioni.

### `tlsSocket.getEphemeralKeyInfo()` {#tlssocketgetephemeralkeyinfo}

**Aggiunto in: v5.0.0**

- Restituisce: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Restituisce un oggetto che rappresenta il tipo, il nome e la dimensione del parametro di uno scambio di chiavi effimere in [perfect forward secrecy](/it/nodejs/api/tls#perfect-forward-secrecy) su una connessione client. Restituisce un oggetto vuoto quando lo scambio di chiavi non è effimero. Poiché questo è supportato solo su un socket client; `null` viene restituito se chiamato su un socket server. I tipi supportati sono `'DH'` e `'ECDH'`. La proprietà `name` è disponibile solo quando il tipo è `'ECDH'`.

Ad esempio: `{ type: 'ECDH', name: 'prime256v1', size: 256 }`.


### `tlsSocket.getFinished()` {#tlssocketgetfinished}

**Aggiunto in: v9.9.0**

- Restituisce: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) L'ultimo messaggio `Finished` che è stato inviato al socket come parte di un handshake SSL/TLS, o `undefined` se nessun messaggio `Finished` è stato ancora inviato.

Poiché i messaggi `Finished` sono digest di messaggi dell'handshake completo (con un totale di 192 bit per TLS 1.0 e più per SSL 3.0), possono essere utilizzati per procedure di autenticazione esterne quando l'autenticazione fornita da SSL/TLS non è desiderata o non è sufficiente.

Corrisponde alla routine `SSL_get_finished` in OpenSSL e può essere utilizzato per implementare il binding del canale `tls-unique` da [RFC 5929](https://tools.ietf.org/html/rfc5929).

### `tlsSocket.getPeerCertificate([detailed])` {#tlssocketgetpeercertificatedetailed}

**Aggiunto in: v0.11.4**

- `detailed` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Includi l'intera catena di certificati se `true`, altrimenti includi solo il certificato del peer.
- Restituisce: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un oggetto certificato.

Restituisce un oggetto che rappresenta il certificato del peer. Se il peer non fornisce un certificato, verrà restituito un oggetto vuoto. Se il socket è stato distrutto, verrà restituito `null`.

Se è stata richiesta l'intera catena di certificati, ogni certificato includerà una proprietà `issuerCertificate` contenente un oggetto che rappresenta il certificato del suo emittente.

#### Oggetto certificato {#certificate-object}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v19.1.0, v18.13.0 | Aggiunta la proprietà "ca". |
| v17.2.0, v16.14.0 | Aggiunta fingerprint512. |
| v11.4.0 | Supporto per le informazioni sulla chiave pubblica Elliptic Curve. |
:::

Un oggetto certificato ha proprietà corrispondenti ai campi del certificato.

- `ca` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` se è una Certificate Authority (CA), `false` altrimenti.
- `raw` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) I dati del certificato X.509 codificati in DER.
- `subject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Il soggetto del certificato, descritto in termini di Country (`C`), StateOrProvince (`ST`), Locality (`L`), Organization (`O`), OrganizationalUnit (`OU`) e CommonName (`CN`). Il CommonName è in genere un nome DNS con certificati TLS. Esempio: `{C: 'UK', ST: 'BC', L: 'Metro', O: 'Node Fans', OU: 'Docs', CN: 'example.com'}`.
- `issuer` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) L'emittente del certificato, descritto negli stessi termini del `subject`.
- `valid_from` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La data e l'ora da cui il certificato è valido.
- `valid_to` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) La data e l'ora fino a cui il certificato è valido.
- `serialNumber` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il numero di serie del certificato, come una stringa esadecimale. Esempio: `'B9B0D332A1AA5635'`.
- `fingerprint` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il digest SHA-1 del certificato codificato in DER. Viene restituito come una stringa esadecimale separata da `:`. Esempio: `'2A:7A:C2:DD:...'`.
- `fingerprint256` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il digest SHA-256 del certificato codificato in DER. Viene restituito come una stringa esadecimale separata da `:`. Esempio: `'2A:7A:C2:DD:...'`.
- `fingerprint512` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il digest SHA-512 del certificato codificato in DER. Viene restituito come una stringa esadecimale separata da `:`. Esempio: `'2A:7A:C2:DD:...'`.
- `ext_key_usage` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) (Facoltativo) L'utilizzo esteso della chiave, un insieme di OID.
- `subjectaltname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) (Facoltativo) Una stringa contenente nomi concatenati per il soggetto, un'alternativa ai nomi `subject`.
- `infoAccess` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) (Facoltativo) Un array che descrive AuthorityInfoAccess, utilizzato con OCSP.
- `issuerCertificate` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) (Facoltativo) L'oggetto certificato dell'emittente. Per i certificati autofirmati, questo potrebbe essere un riferimento circolare.

Il certificato può contenere informazioni sulla chiave pubblica, a seconda del tipo di chiave.

Per le chiavi RSA, possono essere definite le seguenti proprietà:

- `bits` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La dimensione in bit RSA. Esempio: `1024`.
- `exponent` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) L'esponente RSA, come stringa in notazione numerica esadecimale. Esempio: `'0x010001'`.
- `modulus` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il modulo RSA, come stringa esadecimale. Esempio: `'B56CE45CB7...'`.
- `pubkey` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) La chiave pubblica.

Per le chiavi EC, possono essere definite le seguenti proprietà:

- `pubkey` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) La chiave pubblica.
- `bits` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La dimensione della chiave in bit. Esempio: `256`.
- `asn1Curve` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) (Facoltativo) Il nome ASN.1 dell'OID della curva ellittica. Le curve ben note sono identificate da un OID. Sebbene sia insolito, è possibile che la curva sia identificata dalle sue proprietà matematiche, nel qual caso non avrà un OID. Esempio: `'prime256v1'`.
- `nistCurve` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) (Facoltativo) Il nome NIST per la curva ellittica, se ne ha uno (non a tutte le curve ben note sono stati assegnati nomi da NIST). Esempio: `'P-256'`.

Esempio di certificato:

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

**Aggiunto in: v9.9.0**

- Restituisce: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) L'ultimo messaggio `Finished` che è previsto o è stato effettivamente ricevuto dal socket come parte di un handshake SSL/TLS, oppure `undefined` se finora non c'è alcun messaggio `Finished`.

Poiché i messaggi `Finished` sono message digest dell'handshake completo (con un totale di 192 bit per TLS 1.0 e più per SSL 3.0), possono essere utilizzati per procedure di autenticazione esterne quando l'autenticazione fornita da SSL/TLS non è desiderata o non è sufficiente.

Corrisponde alla routine `SSL_get_peer_finished` in OpenSSL e può essere utilizzata per implementare il channel binding `tls-unique` da [RFC 5929](https://tools.ietf.org/html/rfc5929).

### `tlsSocket.getPeerX509Certificate()` {#tlssocketgetpeerx509certificate}

**Aggiunto in: v15.9.0**

- Restituisce: [\<X509Certificate\>](/it/nodejs/api/crypto#class-x509certificate)

Restituisce il certificato peer come oggetto [\<X509Certificate\>](/it/nodejs/api/crypto#class-x509certificate).

Se non esiste un certificato peer o il socket è stato distrutto, verrà restituito `undefined`.

### `tlsSocket.getProtocol()` {#tlssocketgetprotocol}

**Aggiunto in: v5.7.0**

- Restituisce: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

Restituisce una stringa contenente la versione del protocollo SSL/TLS negoziata della connessione corrente. Il valore `'unknown'` verrà restituito per i socket connessi che non hanno completato il processo di handshake. Il valore `null` verrà restituito per i socket del server o i socket client disconnessi.

Le versioni del protocollo sono:

- `'SSLv3'`
- `'TLSv1'`
- `'TLSv1.1'`
- `'TLSv1.2'`
- `'TLSv1.3'`

Vedi la documentazione OpenSSL [`SSL_get_version`](https://www.openssl.org/docs/man1.1.1/man3/SSL_get_version) per maggiori informazioni.

### `tlsSocket.getSession()` {#tlssocketgetsession}

**Aggiunto in: v0.11.4**

- [\<Buffer\>](/it/nodejs/api/buffer#class-buffer)

Restituisce i dati della sessione TLS o `undefined` se non è stata negoziata alcuna sessione. Sul client, i dati possono essere forniti all'opzione `session` di [`tls.connect()`](/it/nodejs/api/tls#tlsconnectoptions-callback) per riprendere la connessione. Sul server, può essere utile per il debug.

Vedi [Ripresa della sessione](/it/nodejs/api/tls#session-resumption) per maggiori informazioni.

Nota: `getSession()` funziona solo per TLSv1.2 e versioni precedenti. Per TLSv1.3, le applicazioni devono utilizzare l'evento [`'session'`](/it/nodejs/api/tls#event-session) (funziona anche per TLSv1.2 e versioni precedenti).


### `tlsSocket.getSharedSigalgs()` {#tlssocketgetsharedsigalgs}

**Aggiunto in: v12.11.0**

- Restituisce: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Elenco degli algoritmi di firma condivisi tra il server e il client nell'ordine di preferenza decrescente.

Vedi [SSL_get_shared_sigalgs](https://www.openssl.org/docs/man1.1.1/man3/SSL_get_shared_sigalgs) per maggiori informazioni.

### `tlsSocket.getTLSTicket()` {#tlssocketgettlsticket}

**Aggiunto in: v0.11.4**

- [\<Buffer\>](/it/nodejs/api/buffer#class-buffer)

Per un client, restituisce il ticket di sessione TLS se disponibile, altrimenti `undefined`. Per un server, restituisce sempre `undefined`.

Può essere utile per il debug.

Vedi [Ripresa della sessione](/it/nodejs/api/tls#session-resumption) per maggiori informazioni.

### `tlsSocket.getX509Certificate()` {#tlssocketgetx509certificate}

**Aggiunto in: v15.9.0**

- Restituisce: [\<X509Certificate\>](/it/nodejs/api/crypto#class-x509certificate)

Restituisce il certificato locale come un oggetto [\<X509Certificate\>](/it/nodejs/api/crypto#class-x509certificate).

Se non è presente alcun certificato locale o il socket è stato distrutto, verrà restituito `undefined`.

### `tlsSocket.isSessionReused()` {#tlssocketissessionreused}

**Aggiunto in: v0.5.6**

- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` se la sessione è stata riutilizzata, `false` altrimenti.

Vedi [Ripresa della sessione](/it/nodejs/api/tls#session-resumption) per maggiori informazioni.

### `tlsSocket.localAddress` {#tlssocketlocaladdress}

**Aggiunto in: v0.11.4**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Restituisce la rappresentazione stringa dell'indirizzo IP locale.

### `tlsSocket.localPort` {#tlssocketlocalport}

**Aggiunto in: v0.11.4**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Restituisce la rappresentazione numerica della porta locale.

### `tlsSocket.remoteAddress` {#tlssocketremoteaddress}

**Aggiunto in: v0.11.4**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Restituisce la rappresentazione stringa dell'indirizzo IP remoto. Ad esempio, `'74.125.127.100'` o `'2001:4860:a005::68'`.


### `tlsSocket.remoteFamily` {#tlssocketremotefamily}

**Aggiunto in: v0.11.4**

- [\<stringa\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Restituisce la rappresentazione in stringa della famiglia IP remota. `'IPv4'` o `'IPv6'`.

### `tlsSocket.remotePort` {#tlssocketremoteport}

**Aggiunto in: v0.11.4**

- [\<numero intero\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Restituisce la rappresentazione numerica della porta remota. Ad esempio, `443`.

### `tlsSocket.renegotiate(options, callback)` {#tlssocketrenegotiateoptions-callback}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v18.0.0 | Passare una callback non valida all'argomento `callback` ora genera `ERR_INVALID_ARG_TYPE` invece di `ERR_INVALID_CALLBACK`. |
| v0.11.8 | Aggiunto in: v0.11.8 |
:::

-  `options` [\<Oggetto\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `rejectUnauthorized` [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se non `false`, il certificato del server viene verificato rispetto all'elenco delle CA fornite. Un evento `'error'` viene emesso se la verifica fallisce; `err.code` contiene il codice di errore OpenSSL. **Predefinito:** `true`.
    - `requestCert`
  
 
-  `callback` [\<Funzione\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Se `renegotiate()` ha restituito `true`, la callback viene allegata una volta all'evento `'secure'`. Se `renegotiate()` ha restituito `false`, `callback` verrà chiamata nel tick successivo con un errore, a meno che `tlsSocket` non sia stato distrutto, nel qual caso `callback` non verrà chiamata affatto. 
-  Restituisce: [\<booleano\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` se la rinegoziazione è stata avviata, `false` altrimenti. 

Il metodo `tlsSocket.renegotiate()` avvia un processo di rinegoziazione TLS. Al completamento, alla funzione `callback` verrà passato un singolo argomento che è un `Error` (se la richiesta è fallita) o `null`.

Questo metodo può essere utilizzato per richiedere il certificato di un peer dopo che la connessione sicura è stata stabilita.

Quando è in esecuzione come server, il socket verrà distrutto con un errore dopo il timeout di `handshakeTimeout`.

Per TLSv1.3, la rinegoziazione non può essere avviata, non è supportata dal protocollo.


### `tlsSocket.setKeyCert(context)` {#tlssocketsetkeycertcontext}

**Aggiunto in: v22.5.0, v20.17.0**

- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<tls.SecureContext\>](/it/nodejs/api/tls#tlscreatesecurecontextoptions) Un oggetto contenente almeno le proprietà `key` e `cert` dalle `options` di [`tls.createSecureContext()`](/it/nodejs/api/tls#tlscreatesecurecontextoptions), oppure un oggetto contesto TLS creato con [`tls.createSecureContext()`](/it/nodejs/api/tls#tlscreatesecurecontextoptions) stesso.

Il metodo `tlsSocket.setKeyCert()` imposta la chiave privata e il certificato da utilizzare per il socket. Questo è utile principalmente se desideri selezionare un certificato server dalla `ALPNCallback` di un server TLS.

### `tlsSocket.setMaxSendFragment(size)` {#tlssocketsetmaxsendfragmentsize}

**Aggiunto in: v0.11.11**

- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) La dimensione massima del frammento TLS. Il valore massimo è `16384`. **Predefinito:** `16384`.
- Restituisce: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Il metodo `tlsSocket.setMaxSendFragment()` imposta la dimensione massima del frammento TLS. Restituisce `true` se l'impostazione del limite è andata a buon fine; `false` altrimenti.

Dimensioni di frammento più piccole diminuiscono la latenza di buffering sul client: frammenti più grandi vengono memorizzati nel buffer dal livello TLS fino a quando l'intero frammento non viene ricevuto e la sua integrità verificata; frammenti di grandi dimensioni possono estendersi su più roundtrip e la loro elaborazione può essere ritardata a causa della perdita o del riordinamento dei pacchetti. Tuttavia, frammenti più piccoli aggiungono byte di framing TLS extra e overhead della CPU, il che potrebbe ridurre la velocità effettiva complessiva del server.

## `tls.checkServerIdentity(hostname, cert)` {#tlscheckserveridentityhostname-cert}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v17.3.1, v16.13.2, v14.18.3, v12.22.9 | Il supporto per i nomi alternativi del soggetto `uniformResourceIdentifier` è stato disabilitato in risposta a CVE-2021-44531. |
| v0.8.4 | Aggiunto in: v0.8.4 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il nome host o l'indirizzo IP per verificare il certificato.
- `cert` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un [oggetto certificato](/it/nodejs/api/tls#certificate-object) che rappresenta il certificato del peer.
- Restituisce: [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Verifica che il certificato `cert` sia stato rilasciato a `hostname`.

Restituisce l'oggetto [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error), popolandolo con `reason`, `host` e `cert` in caso di errore. In caso di successo, restituisce [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type).

Questa funzione è destinata ad essere utilizzata in combinazione con l'opzione `checkServerIdentity` che può essere passata a [`tls.connect()`](/it/nodejs/api/tls#tlsconnectoptions-callback) e come tale opera su un [oggetto certificato](/it/nodejs/api/tls#certificate-object). Per altri scopi, valuta invece l'utilizzo di [`x509.checkHost()`](/it/nodejs/api/crypto#x509checkhostname-options).

Questa funzione può essere sovrascritta fornendo una funzione alternativa come opzione `options.checkServerIdentity` che viene passata a `tls.connect()`. La funzione di sovrascrittura può ovviamente chiamare `tls.checkServerIdentity()` per aumentare i controlli eseguiti con una verifica aggiuntiva.

Questa funzione viene chiamata solo se il certificato ha superato tutti gli altri controlli, come ad esempio l'emissione da parte di una CA attendibile (`options.ca`).

Le versioni precedenti di Node.js accettavano erroneamente i certificati per un dato `hostname` se era presente un nome alternativo del soggetto `uniformResourceIdentifier` corrispondente (vedi [CVE-2021-44531](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-44531)). Le applicazioni che desiderano accettare nomi alternativi del soggetto `uniformResourceIdentifier` possono utilizzare una funzione `options.checkServerIdentity` personalizzata che implementa il comportamento desiderato.


## `tls.connect(options[, callback])` {#tlsconnectoptions-callback}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v15.1.0, v14.18.0 | Aggiunta l'opzione `onread`. |
| v14.1.0, v13.14.0 | L'opzione `highWaterMark` è ora accettata. |
| v13.6.0, v12.16.0 | L'opzione `pskCallback` è ora supportata. |
| v12.9.0 | Supporta l'opzione `allowHalfOpen`. |
| v12.4.0 | L'opzione `hints` è ora supportata. |
| v12.2.0 | L'opzione `enableTrace` è ora supportata. |
| v11.8.0, v10.16.0 | L'opzione `timeout` è ora supportata. |
| v8.0.0 | L'opzione `lookup` è ora supportata. |
| v8.0.0 | L'opzione `ALPNProtocols` può essere ora un `TypedArray` o `DataView`. |
| v5.0.0 | Le opzioni ALPN sono ora supportate. |
| v5.3.0, v4.7.0 | L'opzione `secureContext` è ora supportata. |
| v0.11.3 | Aggiunta in: v0.11.3 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `enableTrace`: Vedere [`tls.createServer()`](/it/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Host a cui il client deve connettersi. **Predefinito:** `'localhost'`.
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Porta a cui il client deve connettersi.
    - `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Crea una connessione socket Unix al percorso. Se questa opzione è specificata, `host` e `port` vengono ignorati.
    - `socket` [\<stream.Duplex\>](/it/nodejs/api/stream#class-streamduplex) Stabilisce una connessione sicura su un socket dato anziché creare un nuovo socket. In genere, questa è un'istanza di [`net.Socket`](/it/nodejs/api/net#class-netsocket), ma è consentito qualsiasi stream `Duplex`. Se questa opzione è specificata, `path`, `host` e `port` vengono ignorati, ad eccezione della convalida del certificato. Di solito, un socket è già connesso quando viene passato a `tls.connect()`, ma può essere connesso in seguito. La connessione/disconnessione/distruzione del `socket` è responsabilità dell'utente; la chiamata a `tls.connect()` non farà sì che `net.connect()` venga chiamato.
    - `allowHalfOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se impostato su `false`, il socket terminerà automaticamente il lato scrivibile quando il lato leggibile termina. Se l'opzione `socket` è impostata, questa opzione non ha effetto. Vedere l'opzione `allowHalfOpen` di [`net.Socket`](/it/nodejs/api/net#class-netsocket) per i dettagli. **Predefinito:** `false`.
    - `rejectUnauthorized` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se non `false`, il certificato del server viene verificato rispetto all'elenco di CA fornite. Viene emesso un evento `'error'` se la verifica fallisce; `err.code` contiene il codice di errore OpenSSL. **Predefinito:** `true`.
    - `pskCallback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Per la negoziazione TLS-PSK, vedere [Chiavi pre-condivise](/it/nodejs/api/tls#pre-shared-keys).
    - `ALPNProtocols`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer[]\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Un array di stringhe, `Buffer`, `TypedArray` o `DataView`, o un singolo `Buffer`, `TypedArray` o `DataView` contenente i protocolli ALPN supportati. I `Buffer` dovrebbero avere il formato `[len][name][len][name]...` es. `'\x08http/1.1\x08http/1.0'`, dove il byte `len` è la lunghezza del nome del protocollo successivo. Passare un array è di solito molto più semplice, ad es. `['http/1.1', 'http/1.0']`. I protocolli precedenti nell'elenco hanno una preferenza maggiore rispetto a quelli successivi.
    - `servername`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome del server per l'estensione TLS SNI (Server Name Indication). È il nome dell'host a cui ci si connette e deve essere un nome host e non un indirizzo IP. Può essere utilizzato da un server multi-homed per scegliere il certificato corretto da presentare al client, vedere l'opzione `SNICallback` per [`tls.createServer()`](/it/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener).
    - `checkServerIdentity(servername, cert)` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una funzione di callback da utilizzare (invece della funzione integrata `tls.checkServerIdentity()`) quando si controlla il nome host del server (o il `servername` fornito quando impostato esplicitamente) rispetto al certificato. Questo dovrebbe restituire un [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) se la verifica fallisce. Il metodo dovrebbe restituire `undefined` se il `servername` e il `cert` sono verificati.
    - `session` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) Un'istanza `Buffer` contenente la sessione TLS.
    - `minDHSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Dimensione minima del parametro DH in bit per accettare una connessione TLS. Quando un server offre un parametro DH con una dimensione inferiore a `minDHSize`, la connessione TLS viene interrotta e viene generato un errore. **Predefinito:** `1024`.
    - `highWaterMark`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Coerente con il parametro `highWaterMark` dello stream leggibile. **Predefinito:** `16 * 1024`.
    - `secureContext`: Oggetto contesto TLS creato con [`tls.createSecureContext()`](/it/nodejs/api/tls#tlscreatesecurecontextoptions). Se un `secureContext` *non* viene fornito, ne verrà creato uno passando l'intero oggetto `options` a `tls.createSecureContext()`.
    - `onread` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Se l'opzione `socket` è mancante, i dati in entrata vengono archiviati in un singolo `buffer` e passati al `callback` fornito quando i dati arrivano sul socket, altrimenti l'opzione viene ignorata. Vedere l'opzione `onread` di [`net.Socket`](/it/nodejs/api/net#class-netsocket) per i dettagli.
    - ...: Opzioni [`tls.createSecureContext()`](/it/nodejs/api/tls#tlscreatesecurecontextoptions) che vengono utilizzate se l'opzione `secureContext` è mancante, altrimenti vengono ignorate.
    - ...: Qualsiasi opzione [`socket.connect()`](/it/nodejs/api/net#socketconnectoptions-connectlistener) non ancora elencata.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Restituisce: [\<tls.TLSSocket\>](/it/nodejs/api/tls#class-tlstlssocket)

La funzione `callback`, se specificata, verrà aggiunta come listener per l'evento [`'secureConnect'`](/it/nodejs/api/tls#event-secureconnect).

`tls.connect()` restituisce un oggetto [`tls.TLSSocket`](/it/nodejs/api/tls#class-tlstlssocket).

A differenza dell'API `https`, `tls.connect()` non abilita l'estensione SNI (Server Name Indication) per impostazione predefinita, il che potrebbe indurre alcuni server a restituire un certificato errato o a rifiutare del tutto la connessione. Per abilitare SNI, impostare l'opzione `servername` in aggiunta a `host`.

Quanto segue illustra un client per l'esempio di echo server da [`tls.createServer()`](/it/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener):



::: code-group
```js [ESM]
// Presuppone un echo server in ascolto sulla porta 8000.
import { connect } from 'node:tls';
import { readFileSync } from 'node:fs';
import { stdin } from 'node:process';

const options = {
  // Necessario solo se il server richiede l'autenticazione del certificato client.
  key: readFileSync('client-key.pem'),
  cert: readFileSync('client-cert.pem'),

  // Necessario solo se il server utilizza un certificato autofirmato.
  ca: [ readFileSync('server-cert.pem') ],

  // Necessario solo se il certificato del server non è per "localhost".
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
// Presuppone un echo server in ascolto sulla porta 8000.
const { connect } = require('node:tls');
const { readFileSync } = require('node:fs');

const options = {
  // Necessario solo se il server richiede l'autenticazione del certificato client.
  key: readFileSync('client-key.pem'),
  cert: readFileSync('client-cert.pem'),

  // Necessario solo se il server utilizza un certificato autofirmato.
  ca: [ readFileSync('server-cert.pem') ],

  // Necessario solo se il certificato del server non è per "localhost".
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

Per generare il certificato e la chiave per questo esempio, eseguire:

```bash [BASH]
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
  -keyout client-key.pem -out client-cert.pem
```
Quindi, per generare il certificato `server-cert.pem` per questo esempio, eseguire:

```bash [BASH]
openssl pkcs12 -certpbe AES-256-CBC -export -out server-cert.pem \
  -inkey client-key.pem -in client-cert.pem
```

## `tls.connect(path[, options][, callback])` {#tlsconnectpath-options-callback}

**Aggiunto in: v0.11.3**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Valore predefinito per `options.path`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Vedi [`tls.connect()`](/it/nodejs/api/tls#tlsconnectoptions-callback).
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Vedi [`tls.connect()`](/it/nodejs/api/tls#tlsconnectoptions-callback).
- Restituisce: [\<tls.TLSSocket\>](/it/nodejs/api/tls#class-tlstlssocket)

Uguale a [`tls.connect()`](/it/nodejs/api/tls#tlsconnectoptions-callback) tranne per il fatto che `path` può essere fornito come argomento invece che come opzione.

Un'opzione path, se specificata, avrà la precedenza sull'argomento path.

## `tls.connect(port[, host][, options][, callback])` {#tlsconnectport-host-options-callback}

**Aggiunto in: v0.11.3**

- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Valore predefinito per `options.port`.
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Valore predefinito per `options.host`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Vedi [`tls.connect()`](/it/nodejs/api/tls#tlsconnectoptions-callback).
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Vedi [`tls.connect()`](/it/nodejs/api/tls#tlsconnectoptions-callback).
- Restituisce: [\<tls.TLSSocket\>](/it/nodejs/api/tls#class-tlstlssocket)

Uguale a [`tls.connect()`](/it/nodejs/api/tls#tlsconnectoptions-callback) tranne per il fatto che `port` e `host` possono essere forniti come argomenti invece che come opzioni.

Un'opzione port o host, se specificata, avrà la precedenza su qualsiasi argomento port o host.

## `tls.createSecureContext([options])` {#tlscreatesecurecontextoptions}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v22.9.0, v20.18.0 | L'opzione `allowPartialTrustChain` è stata aggiunta. |
| v22.4.0, v20.16.0 | Le opzioni `clientCertEngine`, `privateKeyEngine` e `privateKeyIdentifier` dipendono dal supporto del motore personalizzato in OpenSSL, che è deprecato in OpenSSL 3. |
| v19.8.0, v18.16.0 | L'opzione `dhparam` ora può essere impostata su `'auto'` per abilitare DHE con parametri appropriati e ben noti. |
| v12.12.0 | Aggiunte le opzioni `privateKeyIdentifier` e `privateKeyEngine` per ottenere la chiave privata da un motore OpenSSL. |
| v12.11.0 | Aggiunta l'opzione `sigalgs` per sovrascrivere gli algoritmi di firma supportati. |
| v12.0.0 | Aggiunto il supporto TLSv1.3. |
| v11.5.0 | L'opzione `ca:` ora supporta `BEGIN TRUSTED CERTIFICATE`. |
| v11.4.0, v10.16.0 | `minVersion` e `maxVersion` possono essere usati per limitare le versioni del protocollo TLS consentite. |
| v10.0.0 | `ecdhCurve` non può più essere impostato su `false` a causa di una modifica in OpenSSL. |
| v9.3.0 | Il parametro `options` ora può includere `clientCertEngine`. |
| v9.0.0 | L'opzione `ecdhCurve` ora può essere più nomi di curve separate da `':'` o `'auto'`. |
| v7.3.0 | Se l'opzione `key` è un array, le singole voci non necessitano più di una proprietà `passphrase`. Le voci di `Array` possono anche essere solo `string` o `Buffer`. |
| v5.2.0 | L'opzione `ca` ora può essere una singola stringa contenente più certificati CA. |
| v0.11.13 | Aggiunto in: v0.11.13 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `allowPartialTrustChain` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Considera i certificati intermedi (non auto-firmati) nell'elenco dei certificati CA di fiducia come attendibili.
    - `ca` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<Buffer[]\>](/it/nodejs/api/buffer#class-buffer) Sovrascrive facoltativamente i certificati CA attendibili. Il valore predefinito è considerare attendibili le CA note curate da Mozilla. Le CA di Mozilla vengono completamente sostituite quando le CA vengono esplicitamente specificate utilizzando questa opzione. Il valore può essere una stringa o un `Buffer`, o un `Array` di stringhe e/o `Buffer`. Qualsiasi stringa o `Buffer` può contenere più CA PEM concatenate insieme. Il certificato del peer deve essere concatenabile a una CA attendibile dal server affinché la connessione venga autenticata. Quando si utilizzano certificati che non sono concatenabili a una CA nota, la CA del certificato deve essere esplicitamente specificata come attendibile oppure la connessione non verrà autenticata. Se il peer utilizza un certificato che non corrisponde o non si concatena a una delle CA predefinite, utilizzare l'opzione `ca` per fornire un certificato CA a cui il certificato del peer può corrispondere o concatenarsi. Per i certificati auto-firmati, il certificato è la sua stessa CA e deve essere fornito. Per i certificati con codifica PEM, i tipi supportati sono "TRUSTED CERTIFICATE", "X509 CERTIFICATE" e "CERTIFICATE". Vedi anche [`tls.rootCertificates`](/it/nodejs/api/tls#tlsrootcertificates).
    - `cert` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<Buffer[]\>](/it/nodejs/api/buffer#class-buffer) Catene di certificati in formato PEM. Dovrebbe essere fornita una catena di certificati per ogni chiave privata. Ogni catena di certificati dovrebbe essere costituita dal certificato formattato PEM per una `key` privata fornita, seguito dai certificati intermedi formattati PEM (se presenti), in ordine, e non includere la CA root (la CA root deve essere nota in precedenza al peer, vedere `ca`). Quando si forniscono più catene di certificati, non devono essere nello stesso ordine delle loro chiavi private in `key`. Se i certificati intermedi non vengono forniti, il peer non sarà in grado di convalidare il certificato e l'handshake fallirà.
    - `sigalgs` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Elenco separato da due punti degli algoritmi di firma supportati. L'elenco può contenere algoritmi di digest (`SHA256`, `MD5` ecc.), algoritmi di chiave pubblica (`RSA-PSS`, `ECDSA` ecc.), combinazione di entrambi (ad es. 'RSA+SHA384') o nomi di schemi TLS v1.3 (ad es. `rsa_pss_pss_sha512`). Consulta le [pagine man di OpenSSL](https://www.openssl.org/docs/man1.1.1/man3/SSL_CTX_set1_sigalgs_list) per ulteriori informazioni.
    - `ciphers` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Specifica della suite di cifratura, che sostituisce quella predefinita. Per ulteriori informazioni, vedi [Modificare la suite di cifratura TLS predefinita](/it/nodejs/api/tls#modifying-the-default-tls-cipher-suite). I cifrari consentiti possono essere ottenuti tramite [`tls.getCiphers()`](/it/nodejs/api/tls#tlsgetciphers). I nomi dei cifrari devono essere in maiuscolo affinché OpenSSL li accetti.
    - `clientCertEngine` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome di un motore OpenSSL che può fornire il certificato client. **Deprecato.**
    - `crl` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<Buffer[]\>](/it/nodejs/api/buffer#class-buffer) CRL (Certificate Revocation List) formattati in PEM.
    - `dhparam` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) `'auto'` o parametri Diffie-Hellman personalizzati, richiesti per la [perfect forward secrecy](/it/nodejs/api/tls#perfect-forward-secrecy) non ECDHE. Se omessi o non validi, i parametri vengono scartati silenziosamente e i cifrari DHE non saranno disponibili. La [perfect forward secrecy](/it/nodejs/api/tls#perfect-forward-secrecy) basata su [ECDHE](https://en.wikipedia.org/wiki/Elliptic_curve_Diffie%E2%80%93Hellman) sarà comunque disponibile.
    - `ecdhCurve` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Una stringa che descrive una curva con nome o un elenco separato da due punti di NID o nomi di curve, ad esempio `P-521:P-384:P-256`, da utilizzare per l'accordo di chiave ECDH. Imposta su `auto` per selezionare automaticamente la curva. Utilizza [`crypto.getCurves()`](/it/nodejs/api/crypto#cryptogetcurves) per ottenere un elenco di nomi di curve disponibili. Nelle versioni recenti, `openssl ecparam -list_curves` visualizzerà anche il nome e la descrizione di ogni curva ellittica disponibile. **Predefinito:** [`tls.DEFAULT_ECDH_CURVE`](/it/nodejs/api/tls#tlsdefault_ecdh_curve).
    - `honorCipherOrder` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Tenta di utilizzare le preferenze della suite di cifratura del server invece di quelle del client. Quando è `true`, fa sì che `SSL_OP_CIPHER_SERVER_PREFERENCE` venga impostato in `secureOptions`, vedi [Opzioni OpenSSL](/it/nodejs/api/crypto#openssl-options) per maggiori informazioni.
    - `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<Buffer[]\>](/it/nodejs/api/buffer#class-buffer) | [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Chiavi private in formato PEM. PEM consente l'opzione di crittografare le chiavi private. Le chiavi crittografate verranno decrittografate con `options.passphrase`. È possibile fornire più chiavi utilizzando algoritmi diversi come un array di stringhe o buffer di chiavi non crittografate, oppure un array di oggetti nella forma `{pem: \<string|buffer\>[, passphrase: \<string\>]}`. La forma dell'oggetto può verificarsi solo in un array. `object.passphrase` è facoltativo. Le chiavi crittografate verranno decrittografate con `object.passphrase` se fornito, o `options.passphrase` se non lo è.
    - `privateKeyEngine` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome di un motore OpenSSL da cui ottenere la chiave privata. Dovrebbe essere usato insieme a `privateKeyIdentifier`. **Deprecato.**
    - `privateKeyIdentifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Identificatore di una chiave privata gestita da un motore OpenSSL. Dovrebbe essere usato insieme a `privateKeyEngine`. Non dovrebbe essere impostato insieme a `key`, perché entrambe le opzioni definiscono una chiave privata in modi diversi. **Deprecato.**
    - `maxVersion` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Imposta facoltativamente la versione TLS massima consentita. Uno tra `'TLSv1.3'`, `'TLSv1.2'`, `'TLSv1.1'` o `'TLSv1'`. Non può essere specificato insieme all'opzione `secureProtocol`; utilizzare uno o l'altro. **Predefinito:** [`tls.DEFAULT_MAX_VERSION`](/it/nodejs/api/tls#tlsdefault_max_version).
    - `minVersion` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Imposta facoltativamente la versione TLS minima consentita. Uno tra `'TLSv1.3'`, `'TLSv1.2'`, `'TLSv1.1'` o `'TLSv1'`. Non può essere specificato insieme all'opzione `secureProtocol`; utilizzare uno o l'altro. Evita di impostare su un valore inferiore a TLSv1.2, ma potrebbe essere necessario per l'interoperabilità. Le versioni precedenti a TLSv1.2 potrebbero richiedere il downgrade del [Livello di sicurezza OpenSSL](/it/nodejs/api/tls#openssl-security-level). **Predefinito:** [`tls.DEFAULT_MIN_VERSION`](/it/nodejs/api/tls#tlsdefault_min_version).
    - `passphrase` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Passphrase condivisa utilizzata per una singola chiave privata e/o un PFX.
    - `pfx` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<Buffer[]\>](/it/nodejs/api/buffer#class-buffer) | [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Chiave privata e catena di certificati con codifica PFX o PKCS12. `pfx` è un'alternativa alla fornitura di `key` e `cert` individualmente. PFX è solitamente crittografato, se lo è, `passphrase` verrà utilizzato per decrittografarlo. È possibile fornire più PFX come un array di buffer PFX non crittografati, oppure un array di oggetti nella forma `{buf: \<string|buffer\>[, passphrase: \<string\>]}`. La forma dell'oggetto può verificarsi solo in un array. `object.passphrase` è facoltativo. Il PFX crittografato verrà decrittografato con `object.passphrase` se fornito, o `options.passphrase` se non lo è.
    - `secureOptions` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Influisce facoltativamente sul comportamento del protocollo OpenSSL, il che di solito non è necessario. Questo dovrebbe essere usato con attenzione, se non del tutto! Il valore è una maschera di bit numerica delle opzioni `SSL_OP_*` di [Opzioni OpenSSL](/it/nodejs/api/crypto#openssl-options).
    - `secureProtocol` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Meccanismo legacy per selezionare la versione del protocollo TLS da utilizzare, non supporta il controllo indipendente della versione minima e massima e non supporta la limitazione del protocollo a TLSv1.3. Utilizza invece `minVersion` e `maxVersion`. I valori possibili sono elencati come [SSL_METHODS](https://www.openssl.org/docs/man1.1.1/man7/ssl#Dealing-with-Protocol-Methods), utilizza i nomi delle funzioni come stringhe. Ad esempio, utilizza `'TLSv1_1_method'` per forzare la versione TLS 1.1, o `'TLS_method'` per consentire qualsiasi versione del protocollo TLS fino a TLSv1.3. Non è consigliabile utilizzare versioni TLS inferiori a 1.2, ma potrebbe essere necessario per l'interoperabilità. **Predefinito:** nessuno, vedi `minVersion`.
    - `sessionIdContext` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Identificatore opaco utilizzato dai server per garantire che lo stato della sessione non sia condiviso tra le applicazioni. Inutilizzato dai client.
    - `ticketKeys`: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) 48 byte di dati pseudocasuali crittograficamente robusti. Vedi [Ripresa della sessione](/it/nodejs/api/tls#session-resumption) per maggiori informazioni.
    - `sessionTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di secondi dopo i quali una sessione TLS creata dal server non sarà più ripristinabile. Vedi [Ripresa della sessione](/it/nodejs/api/tls#session-resumption) per maggiori informazioni. **Predefinito:** `300`.

[`tls.createServer()`](/it/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener) imposta il valore predefinito dell'opzione `honorCipherOrder` su `true`, altre API che creano contesti sicuri lo lasciano non impostato.

[`tls.createServer()`](/it/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener) utilizza un valore hash SHA1 troncato a 128 bit generato da `process.argv` come valore predefinito dell'opzione `sessionIdContext`, altre API che creano contesti sicuri non hanno un valore predefinito.

Il metodo `tls.createSecureContext()` crea un oggetto `SecureContext`. È utilizzabile come argomento per diverse API `tls`, come [`server.addContext()`](/it/nodejs/api/tls#serveraddcontexthostname-context), ma non ha metodi pubblici. Il costruttore [`tls.Server`](/it/nodejs/api/tls#class-tlsserver) e il metodo [`tls.createServer()`](/it/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener) non supportano l'opzione `secureContext`.

Una chiave è *richiesta* per i cifrari che utilizzano i certificati. È possibile utilizzare `key` o `pfx` per fornirla.

Se l'opzione `ca` non viene fornita, Node.js utilizzerà per impostazione predefinita l'[elenco di CA pubblicamente attendibili di Mozilla](https://hg.mozilla.org/mozilla-central/raw-file/tip/security/nss/lib/ckfw/builtins/certdata.txt).

I parametri DHE personalizzati sono sconsigliati a favore della nuova opzione `dhparam: 'auto'`. Quando è impostato su `'auto'`, i parametri DHE noti di forza sufficiente verranno selezionati automaticamente. In caso contrario, se necessario, è possibile utilizzare `openssl dhparam` per creare parametri personalizzati. La lunghezza della chiave deve essere maggiore o uguale a 1024 bit, altrimenti verrà generato un errore. Sebbene 1024 bit siano consentiti, utilizzare 2048 bit o più per una maggiore sicurezza.


## `tls.createSecurePair([context][, isServer][, requestCert][, rejectUnauthorized][, options])` {#tlscreatesecurepaircontext-isserver-requestcert-rejectunauthorized-options}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v5.0.0 | Le opzioni ALPN sono ora supportate. |
| v0.11.3 | Obsoleto da: v0.11.3 |
| v0.3.2 | Aggiunto in: v0.3.2 |
:::

::: danger [Stabile: 0 - Obsoleto]
[Stabile: 0](/it/nodejs/api/documentation#stability-index) [Stabilità: 0](/it/nodejs/api/documentation#stability-index) - Obsoleto: utilizzare invece [`tls.TLSSocket`](/it/nodejs/api/tls#class-tlstlssocket).
:::

- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Un oggetto di contesto sicuro come restituito da `tls.createSecureContext()`
- `isServer` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` per specificare che questa connessione TLS deve essere aperta come server.
- `requestCert` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` per specificare se un server deve richiedere un certificato da un client che si connette. Si applica solo quando `isServer` è `true`.
- `rejectUnauthorized` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se non `false`, un server rifiuta automaticamente i client con certificati non validi. Si applica solo quando `isServer` è `true`.
- `options`
    - `enableTrace`: vedi [`tls.createServer()`](/it/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `secureContext`: un oggetto di contesto TLS da [`tls.createSecureContext()`](/it/nodejs/api/tls#tlscreatesecurecontextoptions)
    - `isServer`: se `true`, il socket TLS verrà istanziato in modalità server. **Predefinito:** `false`.
    - `server` [\<net.Server\>](/it/nodejs/api/net#class-netserver) Un'istanza di [`net.Server`](/it/nodejs/api/net#class-netserver)
    - `requestCert`: vedi [`tls.createServer()`](/it/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `rejectUnauthorized`: vedi [`tls.createServer()`](/it/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `ALPNProtocols`: vedi [`tls.createServer()`](/it/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `SNICallback`: vedi [`tls.createServer()`](/it/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `session` [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) Un'istanza di `Buffer` contenente una sessione TLS.
    - `requestOCSP` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, specifica che l'estensione della richiesta di stato OCSP verrà aggiunta al client hello e un evento `'OCSPResponse'` verrà emesso sul socket prima di stabilire una comunicazione sicura.

Crea un nuovo oggetto coppia sicura con due stream, uno dei quali legge e scrive i dati crittografati e l'altro dei quali legge e scrive i dati in chiaro. Generalmente, lo stream crittografato viene reindirizzato da/verso uno stream di dati crittografati in entrata e quello in chiaro viene utilizzato in sostituzione dello stream crittografato iniziale.

`tls.createSecurePair()` restituisce un oggetto `tls.SecurePair` con proprietà stream `cleartext` e `encrypted`.

L'utilizzo di `cleartext` ha la stessa API di [`tls.TLSSocket`](/it/nodejs/api/tls#class-tlstlssocket).

Il metodo `tls.createSecurePair()` è ora obsoleto a favore di `tls.TLSSocket()`. Ad esempio, il codice:

```js [ESM]
pair = tls.createSecurePair(/* ... */);
pair.encrypted.pipe(socket);
socket.pipe(pair.encrypted);
```
può essere sostituito da:

```js [ESM]
secureSocket = tls.TLSSocket(socket, options);
```
dove `secureSocket` ha la stessa API di `pair.cleartext`.


## `tls.createServer([options][, secureConnectionListener])` {#tlscreateserveroptions-secureconnectionlistener}

::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v22.4.0, v20.16.0 | L'opzione `clientCertEngine` dipende dal supporto del motore personalizzato in OpenSSL che è deprecato in OpenSSL 3. |
| v19.0.0 | Se `ALPNProtocols` è impostato, le connessioni in entrata che inviano un'estensione ALPN senza protocolli supportati vengono terminate con un avviso fatale `no_application_protocol`. |
| v20.4.0, v18.19.0 | Il parametro `options` ora può includere `ALPNCallback`. |
| v12.3.0 | Il parametro `options` ora supporta le opzioni `net.createServer()`. |
| v9.3.0 | Il parametro `options` ora può includere `clientCertEngine`. |
| v8.0.0 | L'opzione `ALPNProtocols` ora può essere un `TypedArray` o `DataView`. |
| v5.0.0 | Le opzioni ALPN sono ora supportate. |
| v0.3.2 | Aggiunto in: v0.3.2 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ALPNProtocols`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer[]\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Un array di stringhe, `Buffer`, `TypedArray` o `DataView`, o un singolo `Buffer`, `TypedArray` o `DataView` contenente i protocolli ALPN supportati. I `Buffer` dovrebbero avere il formato `[len][name][len][name]...` ad es. `0x05hello0x05world`, dove il primo byte è la lunghezza del nome del protocollo successivo. Passare un array è solitamente molto più semplice, ad es. `['hello', 'world']`. (I protocolli devono essere ordinati in base alla loro priorità.)
    - `ALPNCallback`: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Se impostato, questo verrà chiamato quando un client apre una connessione utilizzando l'estensione ALPN. Un argomento verrà passato al callback: un oggetto contenente i campi `servername` e `protocols`, rispettivamente contenenti il nome del server dall'estensione SNI (se presente) e un array di stringhe del nome del protocollo ALPN. Il callback deve restituire una delle stringhe elencate in `protocols`, che verrà restituita al client come protocollo ALPN selezionato, oppure `undefined`, per rifiutare la connessione con un avviso fatale. Se viene restituita una stringa che non corrisponde a uno dei protocolli ALPN del client, verrà generato un errore. Questa opzione non può essere utilizzata con l'opzione `ALPNProtocols` e l'impostazione di entrambe le opzioni genererà un errore.
    - `clientCertEngine` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Nome di un motore OpenSSL che può fornire il certificato client. **Deprecato.**
    - `enableTrace` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true`, [`tls.TLSSocket.enableTrace()`](/it/nodejs/api/tls#tlssocketenabletrace) verrà chiamato su nuove connessioni. La tracciatura può essere abilitata dopo che la connessione sicura è stata stabilita, ma questa opzione deve essere utilizzata per tracciare la configurazione della connessione sicura. **Predefinito:** `false`.
    - `handshakeTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Interrompe la connessione se l'handshake SSL/TLS non termina nel numero specificato di millisecondi. Un `'tlsClientError'` viene emesso sull'oggetto `tls.Server` ogni volta che un handshake scade. **Predefinito:** `120000` (120 secondi).
    - `rejectUnauthorized` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se non `false`, il server rifiuterà qualsiasi connessione che non sia autorizzata con l'elenco di CA fornite. Questa opzione ha effetto solo se `requestCert` è `true`. **Predefinito:** `true`.
    - `requestCert` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Se `true` il server richiederà un certificato dai client che si connettono e tenterà di verificare tale certificato. **Predefinito:** `false`.
    - `sessionTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Il numero di secondi dopo il quale una sessione TLS creata dal server non sarà più ripristinabile. Vedi [Ripresa della sessione](/it/nodejs/api/tls#session-resumption) per maggiori informazioni. **Predefinito:** `300`.
    - `SNICallback(servername, callback)` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Una funzione che verrà chiamata se il client supporta l'estensione SNI TLS. Due argomenti verranno passati quando viene chiamata: `servername` e `callback`. `callback` è un callback con priorità all'errore che accetta due argomenti opzionali: `error` e `ctx`. `ctx`, se fornito, è un'istanza di `SecureContext`. [`tls.createSecureContext()`](/it/nodejs/api/tls#tlscreatesecurecontextoptions) può essere utilizzato per ottenere un `SecureContext` appropriato. Se `callback` viene chiamato con un argomento `ctx` falso, verrà utilizzato il contesto sicuro predefinito del server. Se `SNICallback` non è stato fornito, verrà utilizzato il callback predefinito con l'API di alto livello (vedi sotto).
    - `ticketKeys`: [\<Buffer\>](/it/nodejs/api/buffer#class-buffer) 48 byte di dati pseudocasuali crittograficamente validi. Vedi [Ripresa della sessione](/it/nodejs/api/tls#session-resumption) per maggiori informazioni.
    - `pskCallback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Per la negoziazione TLS-PSK, vedi [Chiavi pre-condivise](/it/nodejs/api/tls#pre-shared-keys).
    - `pskIdentityHint` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) suggerimento opzionale da inviare a un client per aiutare con la selezione dell'identità durante la negoziazione TLS-PSK. Verrà ignorato in TLS 1.3. In caso di errore nell'impostazione di pskIdentityHint, verrà emesso `'tlsClientError'` con il codice `'ERR_TLS_PSK_SET_IDENTITY_HINT_FAILED'`.
    - ...: È possibile fornire qualsiasi opzione [`tls.createSecureContext()`](/it/nodejs/api/tls#tlscreatesecurecontextoptions). Per i server, le opzioni di identità (`pfx`, `key`/`cert` o `pskCallback`) sono generalmente richieste.
    - ...: È possibile fornire qualsiasi opzione [`net.createServer()`](/it/nodejs/api/net#netcreateserveroptions-connectionlistener).

- `secureConnectionListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Restituisce: [\<tls.Server\>](/it/nodejs/api/tls#class-tlsserver)

Crea un nuovo [`tls.Server`](/it/nodejs/api/tls#class-tlsserver). Il `secureConnectionListener`, se fornito, viene automaticamente impostato come listener per l'evento [`'secureConnection'`](/it/nodejs/api/tls#event-secureconnection).

Le opzioni `ticketKeys` sono automaticamente condivise tra i worker del modulo `node:cluster`.

Il seguente illustra un semplice server echo:

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

Per generare il certificato e la chiave per questo esempio, esegui:

```bash [BASH]
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
  -keyout server-key.pem -out server-cert.pem
```
Quindi, per generare il certificato `client-cert.pem` per questo esempio, esegui:

```bash [BASH]
openssl pkcs12 -certpbe AES-256-CBC -export -out client-cert.pem \
  -inkey server-key.pem -in server-cert.pem
```
Il server può essere testato connettendosi ad esso utilizzando il client di esempio da [`tls.connect()`](/it/nodejs/api/tls#tlsconnectoptions-callback).


## `tls.getCiphers()` {#tlsgetciphers}

**Aggiunto in: v0.10.2**

- Restituisce: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Restituisce un array con i nomi delle cifrature TLS supportate. I nomi sono in minuscolo per motivi storici, ma devono essere in maiuscolo per essere utilizzati nell'opzione `ciphers` di [`tls.createSecureContext()`](/it/nodejs/api/tls#tlscreatesecurecontextoptions).

Non tutte le cifrature supportate sono abilitate per impostazione predefinita. Vedi [Modifica della suite di cifratura TLS predefinita](/it/nodejs/api/tls#modifying-the-default-tls-cipher-suite).

I nomi delle cifrature che iniziano con `'tls_'` sono per TLSv1.3, tutti gli altri sono per TLSv1.2 e versioni precedenti.

```js [ESM]
console.log(tls.getCiphers()); // ['aes128-gcm-sha256', 'aes128-sha', ...]
```
## `tls.rootCertificates` {#tlsrootcertificates}

**Aggiunto in: v12.3.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Un array immutabile di stringhe che rappresenta i certificati radice (in formato PEM) dal Mozilla CA store incluso, fornito dalla versione corrente di Node.js.

Il CA store in bundle, fornito da Node.js, è un'istantanea del Mozilla CA store fissa al momento del rilascio. È identico su tutte le piattaforme supportate.

## `tls.DEFAULT_ECDH_CURVE` {#tlsdefault_ecdh_curve}


::: info [Cronologia]
| Versione | Modifiche |
| --- | --- |
| v10.0.0 | Il valore predefinito è stato modificato in `'auto'`. |
| v0.11.13 | Aggiunto in: v0.11.13 |
:::

Il nome della curva predefinita da utilizzare per l'accordo di chiave ECDH in un server tls. Il valore predefinito è `'auto'`. Vedi [`tls.createSecureContext()`](/it/nodejs/api/tls#tlscreatesecurecontextoptions) per ulteriori informazioni.

## `tls.DEFAULT_MAX_VERSION` {#tlsdefault_max_version}

**Aggiunto in: v11.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il valore predefinito dell'opzione `maxVersion` di [`tls.createSecureContext()`](/it/nodejs/api/tls#tlscreatesecurecontextoptions). Può essere assegnata una qualsiasi delle versioni del protocollo TLS supportate, `'TLSv1.3'`, `'TLSv1.2'`, `'TLSv1.1'` o `'TLSv1'`. **Predefinito:** `'TLSv1.3'`, a meno che non venga modificato utilizzando le opzioni della CLI. L'utilizzo di `--tls-max-v1.2` imposta il valore predefinito su `'TLSv1.2'`. L'utilizzo di `--tls-max-v1.3` imposta il valore predefinito su `'TLSv1.3'`. Se vengono fornite più opzioni, viene utilizzato il massimo più alto.


## `tls.DEFAULT_MIN_VERSION` {#tlsdefault_min_version}

**Aggiunto in: v11.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il valore predefinito dell'opzione `minVersion` di [`tls.createSecureContext()`](/it/nodejs/api/tls#tlscreatesecurecontextoptions). Può essere assegnato a una qualsiasi delle versioni del protocollo TLS supportate, `'TLSv1.3'`, `'TLSv1.2'`, `'TLSv1.1'` o `'TLSv1'`. Le versioni precedenti a TLSv1.2 potrebbero richiedere la riduzione del [Livello di sicurezza OpenSSL](/it/nodejs/api/tls#openssl-security-level). **Predefinito:** `'TLSv1.2'`, a meno che non venga modificato tramite le opzioni della CLI. L'utilizzo di `--tls-min-v1.0` imposta il valore predefinito su `'TLSv1'`. L'utilizzo di `--tls-min-v1.1` imposta il valore predefinito su `'TLSv1.1'`. L'utilizzo di `--tls-min-v1.3` imposta il valore predefinito su `'TLSv1.3'`. Se vengono fornite più opzioni, viene utilizzato il minimo più basso.

## `tls.DEFAULT_CIPHERS` {#tlsdefault_ciphers}

**Aggiunto in: v19.8.0, v18.16.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Il valore predefinito dell'opzione `ciphers` di [`tls.createSecureContext()`](/it/nodejs/api/tls#tlscreatesecurecontextoptions). Può essere assegnato a una qualsiasi delle cifrature OpenSSL supportate. Il valore predefinito è il contenuto di `crypto.constants.defaultCoreCipherList`, a meno che non venga modificato tramite le opzioni della CLI utilizzando `--tls-default-ciphers`.

