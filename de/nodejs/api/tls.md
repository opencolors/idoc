---
title: Node.js Dokumentation - TLS (Transport Layer Security)
description: Dieser Abschnitt der Node.js-Dokumentation behandelt das TLS-Modul (Transport Layer Security), das eine Implementierung der TLS- und SSL-Protokolle bietet. Es enthält Details zur Erstellung sicherer Verbindungen, zum Zertifikatsmanagement, zur Handhabung sicherer Kommunikation und verschiedene Optionen zur Konfiguration von TLS/SSL in Node.js-Anwendungen.
head:
  - - meta
    - name: og:title
      content: Node.js Dokumentation - TLS (Transport Layer Security) | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Dieser Abschnitt der Node.js-Dokumentation behandelt das TLS-Modul (Transport Layer Security), das eine Implementierung der TLS- und SSL-Protokolle bietet. Es enthält Details zur Erstellung sicherer Verbindungen, zum Zertifikatsmanagement, zur Handhabung sicherer Kommunikation und verschiedene Optionen zur Konfiguration von TLS/SSL in Node.js-Anwendungen.
  - - meta
    - name: twitter:title
      content: Node.js Dokumentation - TLS (Transport Layer Security) | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Dieser Abschnitt der Node.js-Dokumentation behandelt das TLS-Modul (Transport Layer Security), das eine Implementierung der TLS- und SSL-Protokolle bietet. Es enthält Details zur Erstellung sicherer Verbindungen, zum Zertifikatsmanagement, zur Handhabung sicherer Kommunikation und verschiedene Optionen zur Konfiguration von TLS/SSL in Node.js-Anwendungen.
---


# TLS (SSL) {#tls-ssl}

::: tip [Stabil: 2 - Stabil]
[Stabil: 2](/de/nodejs/api/documentation#stability-index) [Stabilität: 2](/de/nodejs/api/documentation#stability-index) - Stabil
:::

**Quellcode:** [lib/tls.js](https://github.com/nodejs/node/blob/v23.5.0/lib/tls.js)

Das Modul `node:tls` bietet eine Implementierung der Protokolle Transport Layer Security (TLS) und Secure Socket Layer (SSL), die auf OpenSSL aufbaut. Auf das Modul kann wie folgt zugegriffen werden:

::: code-group
```js [ESM]
import tls from 'node:tls';
```

```js [CJS]
const tls = require('node:tls');
```
:::

## Feststellen, ob die Crypto-Unterstützung nicht verfügbar ist {#determining-if-crypto-support-is-unavailable}

Es ist möglich, dass Node.js ohne Unterstützung für das Modul `node:crypto` erstellt wird. In solchen Fällen führt der Versuch, von `tls` zu `importieren` oder `require('node:tls')` aufzurufen, zu einem Fehler.

Bei Verwendung von CommonJS kann der ausgelöste Fehler mit try/catch abgefangen werden:

```js [CJS]
let tls;
try {
  tls = require('node:tls');
} catch (err) {
  console.error('tls support is disabled!');
}
```
Bei Verwendung des lexikalischen ESM-Schlüsselworts `import` kann der Fehler nur abgefangen werden, wenn ein Handler für `process.on('uncaughtException')` registriert wird, *bevor* ein Versuch unternommen wird, das Modul zu laden (z. B. mit einem Preload-Modul).

Wenn Sie ESM verwenden und die Möglichkeit besteht, dass der Code in einem Build von Node.js ausgeführt wird, in dem die Crypto-Unterstützung nicht aktiviert ist, sollten Sie die Funktion [`import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) anstelle des lexikalischen Schlüsselworts `import` verwenden:

```js [ESM]
let tls;
try {
  tls = await import('node:tls');
} catch (err) {
  console.error('tls support is disabled!');
}
```
## TLS/SSL-Konzepte {#tls/ssl-concepts}

TLS/SSL ist eine Reihe von Protokollen, die auf einer Public-Key-Infrastruktur (PKI) basieren, um eine sichere Kommunikation zwischen einem Client und einem Server zu ermöglichen. In den meisten gängigen Fällen muss jeder Server einen privaten Schlüssel haben.

Private Schlüssel können auf verschiedene Arten generiert werden. Das folgende Beispiel veranschaulicht die Verwendung der OpenSSL-Befehlszeilenschnittstelle zum Generieren eines 2048-Bit-RSA-Privatschlüssels:

```bash [BASH]
openssl genrsa -out ryans-key.pem 2048
```
Mit TLS/SSL müssen alle Server (und einige Clients) ein *Zertifikat* haben. Zertifikate sind *öffentliche Schlüssel*, die einem privaten Schlüssel entsprechen und entweder von einer Zertifizierungsstelle oder vom Eigentümer des privaten Schlüssels digital signiert sind (solche Zertifikate werden als "selbstsigniert" bezeichnet). Der erste Schritt zum Erhalten eines Zertifikats ist das Erstellen einer *Zertifikatsignieranforderung*-Datei (CSR).

Die OpenSSL-Befehlszeilenschnittstelle kann verwendet werden, um eine CSR für einen privaten Schlüssel zu generieren:

```bash [BASH]
openssl req -new -sha256 -key ryans-key.pem -out ryans-csr.pem
```
Sobald die CSR-Datei generiert wurde, kann sie entweder zum Signieren an eine Zertifizierungsstelle gesendet oder zum Generieren eines selbstsignierten Zertifikats verwendet werden.

Das Erstellen eines selbstsignierten Zertifikats mit der OpenSSL-Befehlszeilenschnittstelle wird im folgenden Beispiel veranschaulicht:

```bash [BASH]
openssl x509 -req -in ryans-csr.pem -signkey ryans-key.pem -out ryans-cert.pem
```
Sobald das Zertifikat generiert wurde, kann es zum Generieren einer `.pfx`- oder `.p12`-Datei verwendet werden:

```bash [BASH]
openssl pkcs12 -export -in ryans-cert.pem -inkey ryans-key.pem \
      -certfile ca-cert.pem -out ryans.pfx
```
Wobei:

- `in`: das signierte Zertifikat ist
- `inkey`: der zugehörige private Schlüssel ist
- `certfile`: eine Verkettung aller Zertifikate der Zertifizierungsstelle (CA) in einer einzigen Datei ist, z. B. `cat ca1-cert.pem ca2-cert.pem \> ca-cert.pem`


### Perfect Forward Secrecy {#perfect-forward-secrecy}

Der Begriff *<a href="https://de.wikipedia.org/wiki/Perfect_Forward_Secrecy">Forward Secrecy</a>* oder *Perfect Forward Secrecy* beschreibt ein Merkmal von Key-Agreement-Methoden (d.h. Schlüsselaustauschmethoden). Das bedeutet, dass die Server- und Client-Schlüssel verwendet werden, um neue temporäre Schlüssel auszuhandeln, die speziell und nur für die aktuelle Kommunikationssitzung verwendet werden. Praktisch bedeutet dies, dass selbst wenn der private Schlüssel des Servers kompromittiert ist, die Kommunikation nur dann von Lauscher entschlüsselt werden kann, wenn es dem Angreifer gelingt, das speziell für die Sitzung generierte Schlüsselpaar zu erhalten.

Perfect Forward Secrecy wird erreicht, indem bei jedem TLS/SSL-Handshake ein Schlüsselpaar für die Key-Agreement zufällig generiert wird (im Gegensatz zur Verwendung desselben Schlüssels für alle Sitzungen). Methoden, die diese Technik implementieren, werden als "ephemeral" bezeichnet.

Derzeit werden üblicherweise zwei Methoden verwendet, um Perfect Forward Secrecy zu erreichen (beachten Sie das Zeichen "E", das an die traditionellen Abkürzungen angehängt wird):

- [ECDHE](https://de.wikipedia.org/wiki/Elliptic_Curve_Diffie-Hellman): Eine ephemere Version des Elliptic Curve Diffie-Hellman Key-Agreement-Protokolls.
- [DHE](https://de.wikipedia.org/wiki/Diffie-Hellman-Schl%C3%BCsselaustausch): Eine ephemere Version des Diffie-Hellman Key-Agreement-Protokolls.

Perfect Forward Secrecy unter Verwendung von ECDHE ist standardmäßig aktiviert. Die Option `ecdhCurve` kann beim Erstellen eines TLS-Servers verwendet werden, um die Liste der unterstützten ECDH-Kurven anzupassen. Weitere Informationen finden Sie unter [`tls.createServer()`](/de/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener).

DHE ist standardmäßig deaktiviert, kann aber zusammen mit ECDHE aktiviert werden, indem die Option `dhparam` auf `'auto'` gesetzt wird. Benutzerdefinierte DHE-Parameter werden ebenfalls unterstützt, werden aber zugunsten automatisch ausgewählter, bekannter Parameter nicht empfohlen.

Perfect Forward Secrecy war bis TLSv1.2 optional. Ab TLSv1.3 wird (EC)DHE immer verwendet (mit Ausnahme von PSK-Only-Verbindungen).

### ALPN und SNI {#alpn-and-sni}

ALPN (Application-Layer Protocol Negotiation Extension) und SNI (Server Name Indication) sind TLS-Handshake-Erweiterungen:

- ALPN: Ermöglicht die Verwendung eines TLS-Servers für mehrere Protokolle (HTTP, HTTP/2)
- SNI: Ermöglicht die Verwendung eines TLS-Servers für mehrere Hostnamen mit unterschiedlichen Zertifikaten.


### Pre-Shared Keys (Vorabgeteilte Schlüssel) {#pre-shared-keys}

Die TLS-PSK-Unterstützung (TLS mit vorabgeteilten Schlüsseln) ist als Alternative zur normalen zertifikatsbasierten Authentifizierung verfügbar. Sie verwendet einen vorabgeteilten Schlüssel anstelle von Zertifikaten, um eine TLS-Verbindung zu authentifizieren und eine gegenseitige Authentifizierung zu ermöglichen. TLS-PSK und Public Key Infrastructure (PKI) schließen sich nicht gegenseitig aus. Clients und Server können beides unterstützen und während des normalen Cipher-Negotiation-Schritts eine von beiden auswählen.

TLS-PSK ist nur dann eine gute Wahl, wenn es Möglichkeiten gibt, einen Schlüssel sicher mit jedem verbindenden Rechner zu teilen. Daher ersetzt es die Public Key Infrastructure (PKI) nicht für die Mehrheit der TLS-Anwendungen. Die TLS-PSK-Implementierung in OpenSSL hat in den letzten Jahren viele Sicherheitslücken aufgewiesen, hauptsächlich weil sie nur von einer Minderheit von Anwendungen verwendet wird. Bitte berücksichtigen Sie alle alternativen Lösungen, bevor Sie auf PSK-Ciphers umsteigen. Bei der Generierung von PSK ist es von entscheidender Bedeutung, ausreichend Entropie zu verwenden, wie in [RFC 4086](https://tools.ietf.org/html/rfc4086) beschrieben. Das Ableiten eines gemeinsamen Geheimnisses aus einem Passwort oder anderen Quellen mit geringer Entropie ist nicht sicher.

PSK-Ciphers sind standardmäßig deaktiviert, und die Verwendung von TLS-PSK erfordert daher die explizite Angabe einer Cipher Suite mit der Option `ciphers`. Die Liste der verfügbaren Ciphers kann über `openssl ciphers -v 'PSK'` abgerufen werden. Alle TLS 1.3 Ciphers sind für PSK geeignet und können über `openssl ciphers -v -s -tls1_3 -psk` abgerufen werden. Bei der Client-Verbindung sollte ein benutzerdefinierter `checkServerIdentity` übergeben werden, da der Standardwert in Abwesenheit eines Zertifikats fehlschlägt.

Gemäß [RFC 4279](https://tools.ietf.org/html/rfc4279) müssen PSK-Identitäten mit einer Länge von bis zu 128 Bytes und PSKs mit einer Länge von bis zu 64 Bytes unterstützt werden. Ab OpenSSL 1.1.0 beträgt die maximale Identitätsgröße 128 Bytes und die maximale PSK-Länge 256 Bytes.

Die aktuelle Implementierung unterstützt keine asynchronen PSK-Callbacks aufgrund der Einschränkungen der zugrunde liegenden OpenSSL-API.

Um TLS-PSK zu verwenden, müssen Client und Server die Option `pskCallback` angeben, eine Funktion, die den zu verwendenden PSK zurückgibt (der mit dem Digest des ausgewählten Ciphers kompatibel sein muss).

Sie wird zuerst auf dem Client aufgerufen:

- hint: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) optionale Nachricht, die vom Server gesendet wird, um dem Client bei der Entscheidung zu helfen, welche Identität während der Aushandlung verwendet werden soll. Immer `null`, wenn TLS 1.3 verwendet wird.
- Returns: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) in der Form `{ psk: \<Buffer|TypedArray|DataView\>, identity: \<string\> }` oder `null`.

Dann auf dem Server:

- socket: [\<tls.TLSSocket\>](/de/nodejs/api/tls#class-tlstlssocket) die Server Socket Instanz, äquivalent zu `this`.
- identity: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Identitätsparameter, der vom Client gesendet wurde.
- Returns: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) der PSK (oder `null`).

Ein Rückgabewert von `null` stoppt den Aushandlungsprozess und sendet eine `unknown_psk_identity`-Alert-Nachricht an die andere Partei. Wenn der Server die Tatsache verbergen möchte, dass die PSK-Identität nicht bekannt war, muss der Callback einige zufällige Daten als `psk` bereitstellen, damit die Verbindung mit `decrypt_error` fehlschlägt, bevor die Aushandlung abgeschlossen ist.


### Abschwächung von Client-initiierten Renegotiierungsangriffen {#client-initiated-renegotiation-attack-mitigation}

Das TLS-Protokoll erlaubt es Clients, bestimmte Aspekte der TLS-Sitzung neu zu verhandeln. Leider erfordert die Sitzungsneuberechnung eine unverhältnismäßig große Menge an serverseitigen Ressourcen, was sie zu einem potenziellen Vektor für Denial-of-Service-Angriffe macht.

Um das Risiko zu mindern, ist die Neuverhandlung auf drei Mal alle zehn Minuten begrenzt. Ein `'error'`-Ereignis wird auf der [`tls.TLSSocket`](/de/nodejs/api/tls#class-tlstlssocket)-Instanz ausgegeben, wenn dieser Schwellenwert überschritten wird. Die Grenzwerte sind konfigurierbar:

- `tls.CLIENT_RENEG_LIMIT` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Gibt die Anzahl der Neuverhandlungsanfragen an. **Standard:** `3`.
- `tls.CLIENT_RENEG_WINDOW` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Gibt das Zeitfenster für die Neuverhandlung in Sekunden an. **Standard:** `600` (10 Minuten).

Die Standard-Renegotiierungsgrenzwerte sollten nicht ohne ein umfassendes Verständnis der Implikationen und Risiken geändert werden.

TLSv1.3 unterstützt keine Neuverhandlung.

### Sitzungswiederaufnahme {#session-resumption}

Das Einrichten einer TLS-Sitzung kann relativ langsam sein. Der Prozess kann beschleunigt werden, indem der Sitzungsstatus gespeichert und später wiederverwendet wird. Es gibt verschiedene Mechanismen dafür, die hier vom ältesten zum neuesten (und bevorzugten) diskutiert werden.

#### Sitzungsbezeichner {#session-identifiers}

Server generieren eine eindeutige ID für neue Verbindungen und senden diese an den Client. Clients und Server speichern den Sitzungsstatus. Wenn sich Clients erneut verbinden, senden sie die ID ihres gespeicherten Sitzungsstatus, und wenn der Server auch den Status für diese ID hat, kann er sich damit einverstanden erklären, ihn zu verwenden. Andernfalls erstellt der Server eine neue Sitzung. Weitere Informationen finden Sie in [RFC 2246](https://www.ietf.org/rfc/rfc2246.txt) auf den Seiten 23 und 30.

Die Wiederaufnahme mit Sitzungsbezeichnern wird von den meisten Webbrowsern unterstützt, wenn HTTPS-Anfragen gestellt werden.

Für Node.js warten Clients auf das [`'session'`](/de/nodejs/api/tls#event-session)-Ereignis, um die Sitzungsdaten zu erhalten, und stellen die Daten der `session`-Option einer nachfolgenden [`tls.connect()`](/de/nodejs/api/tls#tlsconnectoptions-callback) bereit, um die Sitzung wiederzuverwenden. Server müssen Handler für die Ereignisse [`'newSession'`](/de/nodejs/api/tls#event-newsession) und [`'resumeSession'`](/de/nodejs/api/tls#event-resumesession) implementieren, um die Sitzungsdaten mithilfe der Sitzungs-ID als Suchschlüssel zu speichern und wiederherzustellen, um Sitzungen wiederzuverwenden. Um Sitzungen über Load Balancer oder Cluster-Worker hinweg wiederzuverwenden, müssen Server einen gemeinsam genutzten Sitzungs-Cache (z. B. Redis) in ihren Sitzungshandlern verwenden.


#### Session-Tickets {#session-tickets}

Die Server verschlüsseln den gesamten Sitzungszustand und senden ihn als "Ticket" an den Client. Bei der Wiederverbindung wird der Zustand in der ersten Verbindung an den Server gesendet. Dieser Mechanismus vermeidet die Notwendigkeit eines serverseitigen Sitzungs-Cache. Wenn der Server das Ticket aus irgendeinem Grund nicht verwendet (Fehler beim Entschlüsseln, es ist zu alt usw.), erstellt er eine neue Sitzung und sendet ein neues Ticket. Weitere Informationen finden Sie in [RFC 5077](https://tools.ietf.org/html/rfc5077).

Die Wiederaufnahme mit Session-Tickets wird von vielen Webbrowsern bei HTTPS-Anfragen zunehmend unterstützt.

Für Node.js verwenden Clients die gleichen APIs für die Wiederaufnahme mit Session-IDs wie für die Wiederaufnahme mit Session-Tickets. Für das Debugging gilt: Wenn [`tls.TLSSocket.getTLSTicket()`](/de/nodejs/api/tls#tlssocketgettlsticket) einen Wert zurückgibt, enthalten die Sitzungsdaten ein Ticket, andernfalls enthalten sie den clientseitigen Sitzungszustand.

Beachten Sie bei TLSv1.3, dass der Server möglicherweise mehrere Tickets sendet, was zu mehreren `'session'`-Ereignissen führt. Weitere Informationen finden Sie unter [`'session'`](/de/nodejs/api/tls#event-session).

Single-Prozess-Server benötigen keine spezielle Implementierung, um Session-Tickets zu verwenden. Um Session-Tickets über Serverneustarts oder Load Balancer hinweg zu verwenden, müssen alle Server die gleichen Ticket-Schlüssel haben. Intern gibt es drei 16-Byte-Schlüssel, aber die TLS-API stellt sie der Einfachheit halber als einen einzigen 48-Byte-Puffer zur Verfügung.

Es ist möglich, die Ticket-Schlüssel abzurufen, indem man [`server.getTicketKeys()`](/de/nodejs/api/tls#servergetticketkeys) auf einer Serverinstanz aufruft und sie dann verteilt, aber es ist sinnvoller, 48 Byte sicherer Zufallsdaten sicher zu generieren und sie mit der Option `ticketKeys` von [`tls.createServer()`](/de/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener) zu setzen. Die Schlüssel sollten regelmäßig neu generiert werden, und die Schlüssel des Servers können mit [`server.setTicketKeys()`](/de/nodejs/api/tls#serversetticketkeyskeys) zurückgesetzt werden.

Session-Ticket-Schlüssel sind kryptografische Schlüssel, und sie *<strong>müssen sicher aufbewahrt werden</strong>*. Mit TLS 1.2 und älter können alle Sitzungen, die mit ihnen verschlüsselte Tickets verwendet haben, entschlüsselt werden, wenn sie kompromittiert werden. Sie sollten nicht auf der Festplatte gespeichert und regelmäßig neu generiert werden.

Wenn Clients die Unterstützung für Tickets ankündigen, sendet der Server diese. Der Server kann Tickets deaktivieren, indem er `require('node:constants').SSL_OP_NO_TICKET` in `secureOptions` angibt.

Sowohl Session-IDs als auch Session-Tickets haben ein Timeout, wodurch der Server neue Sitzungen erstellt. Das Timeout kann mit der Option `sessionTimeout` von [`tls.createServer()`](/de/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener) konfiguriert werden.

Bei allen Mechanismen erstellen Server neue Sitzungen, wenn die Wiederaufnahme fehlschlägt. Da das Fehlschlagen der Wiederaufnahme der Sitzung keine TLS/HTTPS-Verbindungsfehler verursacht, ist es leicht, unnötig schlechte TLS-Performance zu übersehen. Die OpenSSL-CLI kann verwendet werden, um zu überprüfen, ob Server Sitzungen wiederaufnehmen. Verwenden Sie die Option `-reconnect` für `openssl s_client`, zum Beispiel:

```bash [BASH]
openssl s_client -connect localhost:443 -reconnect
```
Lesen Sie die Debug-Ausgabe. Die erste Verbindung sollte "New" sagen, zum Beispiel:

```text [TEXT]
New, TLSv1.2, Cipher is ECDHE-RSA-AES128-GCM-SHA256
```
Nachfolgende Verbindungen sollten "Reused" sagen, zum Beispiel:

```text [TEXT]
Reused, TLSv1.2, Cipher is ECDHE-RSA-AES128-GCM-SHA256
```

## Modifizieren der Standard-TLS-Cipher-Suite {#modifying-the-default-tls-cipher-suite}

Node.js ist mit einer Standard-Suite von aktivierten und deaktivierten TLS-Ciphers aufgebaut. Diese Standard-Cipher-Liste kann beim Erstellen von Node.js konfiguriert werden, damit Distributionen ihre eigene Standardliste bereitstellen können.

Der folgende Befehl kann verwendet werden, um die Standard-Cipher-Suite anzuzeigen:

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
Dieser Standardwert kann vollständig durch den Befehlszeilenschalter [`--tls-cipher-list`](/de/nodejs/api/cli#--tls-cipher-listlist) ersetzt werden (direkt oder über die Umgebungsvariable [`NODE_OPTIONS`](/de/nodejs/api/cli#node_optionsoptions)). Beispielsweise macht Folgendes `ECDHE-RSA-AES128-GCM-SHA256:!RC4` zur Standard-TLS-Cipher-Suite:

```bash [BASH]
node --tls-cipher-list='ECDHE-RSA-AES128-GCM-SHA256:!RC4' server.js

export NODE_OPTIONS=--tls-cipher-list='ECDHE-RSA-AES128-GCM-SHA256:!RC4'
node server.js
```
Verwenden Sie zur Überprüfung den folgenden Befehl, um die eingestellte Cipher-Liste anzuzeigen. Beachten Sie den Unterschied zwischen `defaultCoreCipherList` und `defaultCipherList`:

```bash [BASH]
node --tls-cipher-list='ECDHE-RSA-AES128-GCM-SHA256:!RC4' -p crypto.constants.defaultCipherList | tr ':' '\n'
ECDHE-RSA-AES128-GCM-SHA256
!RC4
```
d.h. die `defaultCoreCipherList`-Liste wird zur Kompilierzeit festgelegt und die `defaultCipherList` wird zur Laufzeit festgelegt.

Um die Standard-Cipher-Suites innerhalb der Laufzeit zu modifizieren, modifizieren Sie die Variable `tls.DEFAULT_CIPHERS`. Dies muss vor dem Lauschen auf Sockets erfolgen und hat keine Auswirkungen auf bereits geöffnete Sockets. Zum Beispiel:

```js [ESM]
// Veraltete CBC-Ciphers und RSA Key Exchange basierte Ciphers entfernen, da sie keine Forward Secrecy bieten
tls.DEFAULT_CIPHERS +=
  ':!ECDHE-RSA-AES128-SHA:!ECDHE-RSA-AES128-SHA256:!ECDHE-RSA-AES256-SHA:!ECDHE-RSA-AES256-SHA384' +
  ':!ECDHE-ECDSA-AES128-SHA:!ECDHE-ECDSA-AES128-SHA256:!ECDHE-ECDSA-AES256-SHA:!ECDHE-ECDSA-AES256-SHA384' +
  ':!kRSA';
```
Der Standardwert kann auch pro Client oder Server mithilfe der Option `ciphers` von [`tls.createSecureContext()`](/de/nodejs/api/tls#tlscreatesecurecontextoptions) ersetzt werden, die auch in [`tls.createServer()`](/de/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener), [`tls.connect()`](/de/nodejs/api/tls#tlsconnectoptions-callback) und beim Erstellen neuer [`tls.TLSSocket`](/de/nodejs/api/tls#class-tlstlssocket)s verfügbar ist.

Die Cipher-Liste kann eine Mischung aus TLSv1.3-Cipher-Suite-Namen enthalten, die mit `'TLS_'` beginnen, und Spezifikationen für TLSv1.2 und niedrigere Cipher-Suites. Die TLSv1.2-Ciphers unterstützen ein Legacy-Spezifikationsformat. Weitere Informationen finden Sie in der OpenSSL-Dokumentation zum [Cipher-Listenformat](https://www.openssl.org/docs/man1.1.1/man1/ciphers#CIPHER-LIST-FORMAT). Diese Spezifikationen gelten jedoch *nicht* für TLSv1.3-Ciphers. Die TLSv1.3-Suites können nur aktiviert werden, indem ihr vollständiger Name in die Cipher-Liste aufgenommen wird. Sie können beispielsweise nicht mithilfe der Legacy-TLSv1.2-Spezifikation `'EECDH'` oder `'!EECDH'` aktiviert oder deaktiviert werden.

Trotz der relativen Reihenfolge der TLSv1.3- und TLSv1.2-Cipher-Suites ist das TLSv1.3-Protokoll erheblich sicherer als TLSv1.2 und wird immer gegenüber TLSv1.2 gewählt, wenn der Handshake angibt, dass es unterstützt wird und wenn TLSv1.3-Cipher-Suites aktiviert sind.

Die in Node.js enthaltene Standard-Cipher-Suite wurde sorgfältig ausgewählt, um die aktuellen Best Practices für Sicherheit und Risikominderung widerzuspiegeln. Das Ändern der Standard-Cipher-Suite kann erhebliche Auswirkungen auf die Sicherheit einer Anwendung haben. Der Schalter `--tls-cipher-list` und die Option `ciphers` sollten nur verwendet werden, wenn dies unbedingt erforderlich ist.

Die Standard-Cipher-Suite bevorzugt GCM-Ciphers für die ['moderne Kryptografie'-Einstellung von Chrome](https://www.chromium.org/Home/chromium-security/education/tls#TOC-Cipher-Suites) und bevorzugt auch ECDHE- und DHE-Ciphers für perfekte Forward Secrecy, während *etwas* Abwärtskompatibilität geboten wird.

Alte Clients, die auf unsichere und veraltete RC4- oder DES-basierte Ciphers (wie Internet Explorer 6) angewiesen sind, können den Handshake-Prozess mit der Standardkonfiguration nicht abschließen. Wenn diese Clients *unbedingt* unterstützt werden müssen, bieten die [TLS-Empfehlungen](https://wiki.mozilla.org/Security/Server_Side_TLS) möglicherweise eine kompatible Cipher-Suite. Weitere Informationen zum Format finden Sie in der OpenSSL-Dokumentation zum [Cipher-Listenformat](https://www.openssl.org/docs/man1.1.1/man1/ciphers#CIPHER-LIST-FORMAT).

Es gibt nur fünf TLSv1.3-Cipher-Suites:

- `'TLS_AES_256_GCM_SHA384'`
- `'TLS_CHACHA20_POLY1305_SHA256'`
- `'TLS_AES_128_GCM_SHA256'`
- `'TLS_AES_128_CCM_SHA256'`
- `'TLS_AES_128_CCM_8_SHA256'`

Die ersten drei sind standardmäßig aktiviert. Die beiden `CCM`-basierten Suites werden von TLSv1.3 unterstützt, da sie auf eingeschränkten Systemen möglicherweise leistungsfähiger sind, aber sie sind standardmäßig nicht aktiviert, da sie weniger Sicherheit bieten.


## OpenSSL Sicherheitsstufe {#openssl-security-level}

Die OpenSSL-Bibliothek erzwingt Sicherheitsstufen, um die minimal akzeptable Sicherheitsstufe für kryptografische Operationen zu steuern. Die Sicherheitsstufen von OpenSSL reichen von 0 bis 5, wobei jede Stufe strengere Sicherheitsanforderungen auferlegt. Die Standardsicherheitsstufe ist 1, die im Allgemeinen für die meisten modernen Anwendungen geeignet ist. Einige ältere Funktionen und Protokolle wie TLSv1 erfordern jedoch eine niedrigere Sicherheitsstufe (`SECLEVEL=0`), um ordnungsgemäß zu funktionieren. Weitere detaillierte Informationen finden Sie in der [OpenSSL-Dokumentation zu Sicherheitsstufen](https://www.openssl.org/docs/manmaster/man3/SSL_CTX_set_security_level#DEFAULT-CALLBACK-BEHAVIOUR).

### Einstellen der Sicherheitsstufen {#setting-security-levels}

Um die Sicherheitsstufe in Ihrer Node.js-Anwendung anzupassen, können Sie `@SECLEVEL=X` in eine Cipher-Zeichenkette einfügen, wobei `X` die gewünschte Sicherheitsstufe ist. Um beispielsweise die Sicherheitsstufe auf 0 zu setzen, während Sie die standardmäßige OpenSSL-Cipher-Liste verwenden, können Sie Folgendes verwenden:

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

Dieser Ansatz setzt die Sicherheitsstufe auf 0, wodurch die Verwendung älterer Funktionen ermöglicht wird, während gleichzeitig die standardmäßigen OpenSSL-Ciphern verwendet werden.

### Verwendung {#using}

Sie können die Sicherheitsstufe und die Ciphern auch über die Befehlszeile mit `--tls-cipher-list=DEFAULT@SECLEVEL=X` festlegen, wie in [Ändern der standardmäßigen TLS-Cipher-Suite](/de/nodejs/api/tls#modifying-the-default-tls-cipher-suite) beschrieben. Es wird jedoch generell davon abgeraten, die Befehlszeilenoption zum Festlegen von Ciphern zu verwenden, und es ist vorzuziehen, die Ciphern für einzelne Kontexte in Ihrem Anwendungscode zu konfigurieren, da dieser Ansatz eine feinere Kontrolle ermöglicht und das Risiko einer globalen Herabstufung der Sicherheitsstufe verringert.


## X509-Zertifikatfehlercodes {#x509-certificate-error-codes}

Mehrere Funktionen können aufgrund von Zertifikatfehlern fehlschlagen, die von OpenSSL gemeldet werden. In einem solchen Fall stellt die Funktion über ihren Callback einen [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) bereit, der die Eigenschaft `code` hat, die einen der folgenden Werte annehmen kann:

- `'UNABLE_TO_GET_ISSUER_CERT'`: Ausstellerzertifikat konnte nicht abgerufen werden.
- `'UNABLE_TO_GET_CRL'`: Zertifikat-CRL konnte nicht abgerufen werden.
- `'UNABLE_TO_DECRYPT_CERT_SIGNATURE'`: Signatur des Zertifikats konnte nicht entschlüsselt werden.
- `'UNABLE_TO_DECRYPT_CRL_SIGNATURE'`: Signatur der CRL konnte nicht entschlüsselt werden.
- `'UNABLE_TO_DECODE_ISSUER_PUBLIC_KEY'`: Öffentlicher Schlüssel des Ausstellers konnte nicht decodiert werden.
- `'CERT_SIGNATURE_FAILURE'`: Zertifikatssignatur fehlgeschlagen.
- `'CRL_SIGNATURE_FAILURE'`: CRL-Signatur fehlgeschlagen.
- `'CERT_NOT_YET_VALID'`: Zertifikat ist noch nicht gültig.
- `'CERT_HAS_EXPIRED'`: Zertifikat ist abgelaufen.
- `'CRL_NOT_YET_VALID'`: CRL ist noch nicht gültig.
- `'CRL_HAS_EXPIRED'`: CRL ist abgelaufen.
- `'ERROR_IN_CERT_NOT_BEFORE_FIELD'`: Formatfehler im notBefore-Feld des Zertifikats.
- `'ERROR_IN_CERT_NOT_AFTER_FIELD'`: Formatfehler im notAfter-Feld des Zertifikats.
- `'ERROR_IN_CRL_LAST_UPDATE_FIELD'`: Formatfehler im lastUpdate-Feld der CRL.
- `'ERROR_IN_CRL_NEXT_UPDATE_FIELD'`: Formatfehler im nextUpdate-Feld der CRL.
- `'OUT_OF_MEM'`: Nicht genügend Speicher.
- `'DEPTH_ZERO_SELF_SIGNED_CERT'`: Selbstsigniertes Zertifikat.
- `'SELF_SIGNED_CERT_IN_CHAIN'`: Selbstsigniertes Zertifikat in der Zertifikatskette.
- `'UNABLE_TO_GET_ISSUER_CERT_LOCALLY'`: Lokales Ausstellerzertifikat konnte nicht abgerufen werden.
- `'UNABLE_TO_VERIFY_LEAF_SIGNATURE'`: Das erste Zertifikat konnte nicht verifiziert werden.
- `'CERT_CHAIN_TOO_LONG'`: Zertifikatskette zu lang.
- `'CERT_REVOKED'`: Zertifikat widerrufen.
- `'INVALID_CA'`: Ungültiges CA-Zertifikat.
- `'PATH_LENGTH_EXCEEDED'`: Pfadlängenbeschränkung überschritten.
- `'INVALID_PURPOSE'`: Nicht unterstützter Zertifikatszweck.
- `'CERT_UNTRUSTED'`: Zertifikat nicht vertrauenswürdig.
- `'CERT_REJECTED'`: Zertifikat abgelehnt.
- `'HOSTNAME_MISMATCH'`: Hostname stimmt nicht überein.


## Klasse: `tls.CryptoStream` {#class-tlscryptostream}

**Hinzugefügt in: v0.3.4**

**Veraltet seit: v0.11.3**

::: danger [Stabil: 0 - Veraltet]
[Stabil: 0](/de/nodejs/api/documentation#stability-index) [Stabilität: 0](/de/nodejs/api/documentation#stability-index) - Veraltet: Verwenden Sie stattdessen [`tls.TLSSocket`](/de/nodejs/api/tls#class-tlstlssocket).
:::

Die `tls.CryptoStream`-Klasse repräsentiert einen Stream verschlüsselter Daten. Diese Klasse ist veraltet und sollte nicht mehr verwendet werden.

### `cryptoStream.bytesWritten` {#cryptostreambyteswritten}

**Hinzugefügt in: v0.3.4**

**Veraltet seit: v0.11.3**

Die `cryptoStream.bytesWritten`-Eigenschaft gibt die Gesamtzahl der Bytes zurück, die in den zugrunde liegenden Socket geschrieben wurden, *einschließlich* der Bytes, die für die Implementierung des TLS-Protokolls erforderlich sind.

## Klasse: `tls.SecurePair` {#class-tlssecurepair}

**Hinzugefügt in: v0.3.2**

**Veraltet seit: v0.11.3**

::: danger [Stabil: 0 - Veraltet]
[Stabil: 0](/de/nodejs/api/documentation#stability-index) [Stabilität: 0](/de/nodejs/api/documentation#stability-index) - Veraltet: Verwenden Sie stattdessen [`tls.TLSSocket`](/de/nodejs/api/tls#class-tlstlssocket).
:::

Wird von [`tls.createSecurePair()`](/de/nodejs/api/tls#tlscreatesecurepaircontext-isserver-requestcert-rejectunauthorized-options) zurückgegeben.

### Ereignis: `'secure'` {#event-secure}

**Hinzugefügt in: v0.3.2**

**Veraltet seit: v0.11.3**

Das Ereignis `'secure'` wird vom `SecurePair`-Objekt ausgelöst, sobald eine sichere Verbindung hergestellt wurde.

Wie beim Überprüfen des Serverereignisses [`'secureConnection'`](/de/nodejs/api/tls#event-secureconnection) sollte `pair.cleartext.authorized` überprüft werden, um zu bestätigen, ob das verwendete Zertifikat ordnungsgemäß autorisiert ist.

## Klasse: `tls.Server` {#class-tlsserver}

**Hinzugefügt in: v0.3.2**

- Erweitert: [\<net.Server\>](/de/nodejs/api/net#class-netserver)

Akzeptiert verschlüsselte Verbindungen unter Verwendung von TLS oder SSL.

### Ereignis: `'connection'` {#event-connection}

**Hinzugefügt in: v0.3.2**

- `socket` [\<stream.Duplex\>](/de/nodejs/api/stream#class-streamduplex)

Dieses Ereignis wird ausgelöst, wenn ein neuer TCP-Stream hergestellt wird, bevor der TLS-Handshake beginnt. `socket` ist typischerweise ein Objekt vom Typ [`net.Socket`](/de/nodejs/api/net#class-netsocket), empfängt aber im Gegensatz zum Socket, der vom [`net.Server`](/de/nodejs/api/net#class-netserver) `'connection'`-Ereignis erstellt wurde, keine Ereignisse. Normalerweise möchten Benutzer nicht auf dieses Ereignis zugreifen.

Dieses Ereignis kann auch explizit von Benutzern ausgelöst werden, um Verbindungen in den TLS-Server einzuspeisen. In diesem Fall kann ein beliebiger [`Duplex`](/de/nodejs/api/stream#class-streamduplex)-Stream übergeben werden.


### Event: `'keylog'` {#event-keylog}

**Hinzugefügt in: v12.3.0, v10.20.0**

- `line` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) Zeile des ASCII-Textes im NSS `SSLKEYLOGFILE`-Format.
- `tlsSocket` [\<tls.TLSSocket\>](/de/nodejs/api/tls#class-tlstlssocket) Die `tls.TLSSocket`-Instanz, auf der sie generiert wurde.

Das `keylog`-Ereignis wird ausgelöst, wenn Schlüsselmaterial von einer Verbindung zu diesem Server generiert oder empfangen wird (typischerweise bevor der Handshake abgeschlossen ist, aber nicht notwendigerweise). Dieses Schlüsselmaterial kann zur Fehlersuche gespeichert werden, da es die Entschlüsselung des erfassten TLS-Verkehrs ermöglicht. Es kann für jeden Socket mehrmals ausgelöst werden.

Ein typischer Anwendungsfall ist das Anhängen empfangener Zeilen an eine gemeinsame Textdatei, die später von Software (wie Wireshark) zur Entschlüsselung des Datenverkehrs verwendet wird:

```js [ESM]
const logFile = fs.createWriteStream('/tmp/ssl-keys.log', { flags: 'a' });
// ...
server.on('keylog', (line, tlsSocket) => {
  if (tlsSocket.remoteAddress !== '...')
    return; // Nur Schlüssel für eine bestimmte IP protokollieren
  logFile.write(line);
});
```
### Event: `'newSession'` {#event-newsession}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v0.11.12 | Das `callback`-Argument wird jetzt unterstützt. |
| v0.9.2 | Hinzugefügt in: v0.9.2 |
:::

Das `'newSession'`-Ereignis wird bei der Erstellung einer neuen TLS-Sitzung ausgelöst. Dies kann verwendet werden, um Sitzungen in externem Speicher zu speichern. Die Daten sollten dem [`'resumeSession'`](/de/nodejs/api/tls#event-resumesession)-Callback zur Verfügung gestellt werden.

Der Listener-Callback erhält beim Aufruf drei Argumente:

- `sessionId` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) Die TLS-Sitzungs-ID
- `sessionData` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) Die TLS-Sitzungsdaten
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Eine Callback-Funktion, die keine Argumente entgegennimmt und aufgerufen werden muss, damit Daten über die sichere Verbindung gesendet oder empfangen werden können.

Das Abhören dieses Ereignisses hat nur Auswirkungen auf Verbindungen, die nach dem Hinzufügen des Ereignis-Listeners hergestellt wurden.

### Event: `'OCSPRequest'` {#event-ocsprequest}

**Hinzugefügt in: v0.11.13**

Das `'OCSPRequest'`-Ereignis wird ausgelöst, wenn der Client eine Zertifikatsstatusanfrage sendet. Der Listener-Callback erhält beim Aufruf drei Argumente:

- `certificate` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) Das Serverzertifikat
- `issuer` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) Das Zertifikat des Ausstellers
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Eine Callback-Funktion, die aufgerufen werden muss, um die Ergebnisse der OCSP-Anfrage bereitzustellen.

Das aktuelle Zertifikat des Servers kann analysiert werden, um die OCSP-URL und die Zertifikats-ID zu erhalten. Nachdem eine OCSP-Antwort erhalten wurde, wird `callback(null, resp)` aufgerufen, wobei `resp` eine `Buffer`-Instanz ist, die die OCSP-Antwort enthält. Sowohl `certificate` als auch `issuer` sind `Buffer`-DER-Darstellungen des primären Zertifikats und des Zertifikats des Ausstellers. Diese können verwendet werden, um die OCSP-Zertifikats-ID und die OCSP-Endpunkt-URL zu erhalten.

Alternativ kann `callback(null, null)` aufgerufen werden, um anzuzeigen, dass keine OCSP-Antwort vorlag.

Der Aufruf von `callback(err)` führt zu einem `socket.destroy(err)`-Aufruf.

Der typische Ablauf einer OCSP-Anfrage ist wie folgt:

Der `issuer` kann `null` sein, wenn das Zertifikat entweder selbstsigniert ist oder sich der Aussteller nicht in der Liste der Root-Zertifikate befindet. (Ein Aussteller kann über die Option `ca` beim Aufbau der TLS-Verbindung bereitgestellt werden.)

Das Abhören dieses Ereignisses hat nur Auswirkungen auf Verbindungen, die nach dem Hinzufügen des Ereignis-Listeners hergestellt wurden.

Ein npm-Modul wie [asn1.js](https://www.npmjs.com/package/asn1.js) kann verwendet werden, um die Zertifikate zu analysieren.


### Event: `'resumeSession'` {#event-resumesession}

**Hinzugefügt in: v0.9.2**

Das `'resumeSession'`-Ereignis wird ausgelöst, wenn der Client anfordert, eine vorherige TLS-Sitzung wiederaufzunehmen. Der Listener-Callback erhält beim Aufruf zwei Argumente:

- `sessionId` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) Die TLS-Sitzungs-ID
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Eine Callback-Funktion, die aufgerufen werden soll, wenn die vorherige Sitzung wiederhergestellt wurde: `callback([err[, sessionData]])`
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `sessionData` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)

Der Ereignis-Listener sollte in einem externen Speicher nach den `sessionData` suchen, die vom [`'newSession'`](/de/nodejs/api/tls#event-newsession)-Ereignis-Handler unter Verwendung der angegebenen `sessionId` gespeichert wurden. Wenn gefunden, rufen Sie `callback(null, sessionData)` auf, um die Sitzung wiederaufzunehmen. Wenn nicht gefunden, kann die Sitzung nicht wiederaufgenommen werden. `callback()` muss ohne `sessionData` aufgerufen werden, damit der Handshake fortgesetzt und eine neue Sitzung erstellt werden kann. Es ist möglich, `callback(err)` aufzurufen, um die eingehende Verbindung zu beenden und den Socket zu zerstören.

Das Abhören dieses Ereignisses wirkt sich nur auf Verbindungen aus, die nach dem Hinzufügen des Ereignis-Listeners hergestellt wurden.

Das Folgende veranschaulicht die Wiederaufnahme einer TLS-Sitzung:

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
### Event: `'secureConnection'` {#event-secureconnection}

**Hinzugefügt in: v0.3.2**

Das `'secureConnection'`-Ereignis wird ausgelöst, nachdem der Handshake-Prozess für eine neue Verbindung erfolgreich abgeschlossen wurde. Der Listener-Callback erhält beim Aufruf ein einzelnes Argument:

- `tlsSocket` [\<tls.TLSSocket\>](/de/nodejs/api/tls#class-tlstlssocket) Der aufgebaute TLS-Socket.

Die Eigenschaft `tlsSocket.authorized` ist ein `boolean`, der angibt, ob der Client von einer der für den Server bereitgestellten Zertifizierungsstellen verifiziert wurde. Wenn `tlsSocket.authorized` `false` ist, wird `socket.authorizationError` gesetzt, um zu beschreiben, wie die Autorisierung fehlgeschlagen ist. Abhängig von den Einstellungen des TLS-Servers können nicht autorisierte Verbindungen dennoch akzeptiert werden.

Die Eigenschaft `tlsSocket.alpnProtocol` ist ein String, der das ausgewählte ALPN-Protokoll enthält. Wenn ALPN kein ausgewähltes Protokoll hat, weil der Client oder der Server keine ALPN-Erweiterung gesendet hat, ist `tlsSocket.alpnProtocol` gleich `false`.

Die Eigenschaft `tlsSocket.servername` ist ein String, der den über SNI angeforderten Servernamen enthält.


### Ereignis: `'tlsClientError'` {#event-tlsclienterror}

**Hinzugefügt in: v6.0.0**

Das `'tlsClientError'`-Ereignis wird ausgelöst, wenn ein Fehler auftritt, bevor eine sichere Verbindung hergestellt wird. Der Listener-Callback erhält beim Aufruf zwei Argumente:

- `exception` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Das `Error`-Objekt, das den Fehler beschreibt.
- `tlsSocket` [\<tls.TLSSocket\>](/de/nodejs/api/tls#class-tlstlssocket) Die `tls.TLSSocket`-Instanz, von der der Fehler stammt.

### `server.addContext(hostname, context)` {#serveraddcontexthostname-context}

**Hinzugefügt in: v0.5.3**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Ein SNI-Hostname oder ein Wildcard (z. B. `'*'`)
- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<tls.SecureContext\>](/de/nodejs/api/tls#tlscreatesecurecontextoptions) Ein Objekt, das eine der möglichen Eigenschaften aus den `options`-Argumenten von [`tls.createSecureContext()`](/de/nodejs/api/tls#tlscreatesecurecontextoptions) enthält (z. B. `key`, `cert`, `ca` usw.) oder ein TLS-Kontextobjekt, das mit [`tls.createSecureContext()`](/de/nodejs/api/tls#tlscreatesecurecontextoptions) selbst erstellt wurde.

Die `server.addContext()`-Methode fügt einen sicheren Kontext hinzu, der verwendet wird, wenn der SNI-Name der Clientanfrage mit dem angegebenen `hostname` (oder Wildcard) übereinstimmt.

Wenn mehrere übereinstimmende Kontexte vorhanden sind, wird der zuletzt hinzugefügte verwendet.

### `server.address()` {#serveraddress}

**Hinzugefügt in: v0.6.0**

- Gibt zurück: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Gibt die gebundene Adresse, den Adressfamiliennamen und den Port des Servers zurück, wie vom Betriebssystem gemeldet. Siehe [`net.Server.address()`](/de/nodejs/api/net#serveraddress) für weitere Informationen.

### `server.close([callback])` {#serverclosecallback}

**Hinzugefügt in: v0.3.2**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Ein Listener-Callback, der registriert wird, um auf das `'close'`-Ereignis der Serverinstanz zu hören.
- Gibt zurück: [\<tls.Server\>](/de/nodejs/api/tls#class-tlsserver)

Die `server.close()`-Methode verhindert, dass der Server neue Verbindungen akzeptiert.

Diese Funktion arbeitet asynchron. Das `'close'`-Ereignis wird ausgelöst, wenn der Server keine offenen Verbindungen mehr hat.


### `server.getTicketKeys()` {#servergetticketkeys}

**Hinzugefügt in: v3.0.0**

- Gibt zurück: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) Ein 48-Byte-Puffer, der die Session-Ticket-Schlüssel enthält.

Gibt die Session-Ticket-Schlüssel zurück.

Weitere Informationen finden Sie unter [Session Wiederaufnahme](/de/nodejs/api/tls#session-resumption).

### `server.listen()` {#serverlisten}

Startet den Server und wartet auf verschlüsselte Verbindungen. Diese Methode ist identisch mit [`server.listen()`](/de/nodejs/api/net#serverlisten) von [`net.Server`](/de/nodejs/api/net#class-netserver).

### `server.setSecureContext(options)` {#serversetsecurecontextoptions}

**Hinzugefügt in: v11.0.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Ein Objekt, das beliebige mögliche Eigenschaften aus den [`tls.createSecureContext()`](/de/nodejs/api/tls#tlscreatesecurecontextoptions) `options`-Argumenten enthält (z. B. `key`, `cert`, `ca` usw.).

Die Methode `server.setSecureContext()` ersetzt den sicheren Kontext eines bestehenden Servers. Bestehende Verbindungen zum Server werden nicht unterbrochen.

### `server.setTicketKeys(keys)` {#serversetticketkeyskeys}

**Hinzugefügt in: v3.0.0**

- `keys` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Ein 48-Byte-Puffer, der die Session-Ticket-Schlüssel enthält.

Setzt die Session-Ticket-Schlüssel.

Änderungen an den Ticket-Schlüsseln sind nur für zukünftige Serververbindungen wirksam. Bestehende oder aktuell ausstehende Serververbindungen verwenden die vorherigen Schlüssel.

Weitere Informationen finden Sie unter [Session Wiederaufnahme](/de/nodejs/api/tls#session-resumption).

## Klasse: `tls.TLSSocket` {#class-tlstlssocket}

**Hinzugefügt in: v0.11.4**

- Erweitert: [\<net.Socket\>](/de/nodejs/api/net#class-netsocket)

Führt eine transparente Verschlüsselung der geschriebenen Daten und die gesamte erforderliche TLS-Aushandlung durch.

Instanzen von `tls.TLSSocket` implementieren die Duplex-[Stream](/de/nodejs/api/stream#stream)-Schnittstelle.

Methoden, die TLS-Verbindungsmetadaten zurückgeben (z. B. [`tls.TLSSocket.getPeerCertificate()`](/de/nodejs/api/tls#tlssocketgetpeercertificatedetailed)), geben nur dann Daten zurück, wenn die Verbindung geöffnet ist.


### `new tls.TLSSocket(socket[, options])` {#new-tlstlssocketsocket-options}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v12.2.0 | Die Option `enableTrace` wird jetzt unterstützt. |
| v5.0.0 | ALPN-Optionen werden jetzt unterstützt. |
| v0.11.4 | Hinzugefügt in: v0.11.4 |
:::

- `socket` [\<net.Socket\>](/de/nodejs/api/net#class-netsocket) | [\<stream.Duplex\>](/de/nodejs/api/stream#class-streamduplex) Auf der Serverseite jeder `Duplex`-Stream. Auf der Clientseite jede Instanz von [`net.Socket`](/de/nodejs/api/net#class-netsocket) (für generische `Duplex`-Stream-Unterstützung auf der Clientseite muss [`tls.connect()`](/de/nodejs/api/tls#tlsconnectoptions-callback) verwendet werden).
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `enableTrace`: Siehe [`tls.createServer()`](/de/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `isServer`: Das SSL/TLS-Protokoll ist asymmetrisch, TLSSockets müssen wissen, ob sie sich als Server oder als Client verhalten sollen. Wenn `true`, wird der TLS-Socket als Server instanziiert. **Standard:** `false`.
    - `server` [\<net.Server\>](/de/nodejs/api/net#class-netserver) Eine [`net.Server`](/de/nodejs/api/net#class-netserver)-Instanz.
    - `requestCert`: Ob der Remote-Peer durch Anfordern eines Zertifikats authentifiziert werden soll. Clients fordern immer ein Serverzertifikat an. Server (`isServer` ist true) können `requestCert` auf true setzen, um ein Clientzertifikat anzufordern.
    - `rejectUnauthorized`: Siehe [`tls.createServer()`](/de/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `ALPNProtocols`: Siehe [`tls.createServer()`](/de/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `SNICallback`: Siehe [`tls.createServer()`](/de/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `session` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) Eine `Buffer`-Instanz, die eine TLS-Sitzung enthält.
    - `requestOCSP` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, gibt an, dass die OCSP-Statusanforderungserweiterung zum Client-Hallo hinzugefügt wird und ein `'OCSPResponse'`-Ereignis auf dem Socket ausgelöst wird, bevor eine sichere Kommunikation hergestellt wird.
    - `secureContext`: TLS-Kontextobjekt, das mit [`tls.createSecureContext()`](/de/nodejs/api/tls#tlscreatesecurecontextoptions) erstellt wurde. Wenn kein `secureContext` bereitgestellt wird, wird einer erstellt, indem das gesamte `options`-Objekt an `tls.createSecureContext()` übergeben wird.
    - ...: [`tls.createSecureContext()`](/de/nodejs/api/tls#tlscreatesecurecontextoptions)-Optionen, die verwendet werden, wenn die Option `secureContext` fehlt. Andernfalls werden sie ignoriert.


Konstruiert ein neues `tls.TLSSocket`-Objekt aus einem vorhandenen TCP-Socket.


### Ereignis: `'keylog'` {#event-keylog_1}

**Hinzugefügt in: v12.3.0, v10.20.0**

- `line` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) Zeile ASCII-Text, im NSS `SSLKEYLOGFILE`-Format.

Das `keylog`-Ereignis wird auf einem `tls.TLSSocket` ausgelöst, wenn Schlüsselmaterial erzeugt oder von dem Socket empfangen wird. Dieses Schlüsselmaterial kann zur Fehlersuche gespeichert werden, da es die Entschlüsselung des erfassten TLS-Verkehrs ermöglicht. Es kann mehrmals ausgelöst werden, vor oder nach Abschluss des Handshakes.

Ein typischer Anwendungsfall ist das Anhängen empfangener Zeilen an eine gemeinsame Textdatei, die später von Software (wie Wireshark) zur Entschlüsselung des Datenverkehrs verwendet wird:

```js [ESM]
const logFile = fs.createWriteStream('/tmp/ssl-keys.log', { flags: 'a' });
// ...
tlsSocket.on('keylog', (line) => logFile.write(line));
```
### Ereignis: `'OCSPResponse'` {#event-ocspresponse}

**Hinzugefügt in: v0.11.13**

Das `'OCSPResponse'`-Ereignis wird ausgelöst, wenn die Option `requestOCSP` beim Erstellen des `tls.TLSSocket` festgelegt wurde und eine OCSP-Antwort empfangen wurde. Der Listener-Callback erhält beim Aufruf ein einzelnes Argument:

- `response` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) Die OCSP-Antwort des Servers

Typischerweise ist die `response` ein digital signiertes Objekt von der CA des Servers, das Informationen über den Widerrufsstatus des Zertifikats des Servers enthält.

### Ereignis: `'secureConnect'` {#event-secureconnect}

**Hinzugefügt in: v0.11.4**

Das `'secureConnect'`-Ereignis wird ausgelöst, nachdem der Handshake-Prozess für eine neue Verbindung erfolgreich abgeschlossen wurde. Der Listener-Callback wird unabhängig davon aufgerufen, ob das Zertifikat des Servers autorisiert wurde oder nicht. Es liegt in der Verantwortung des Clients, die Eigenschaft `tlsSocket.authorized` zu überprüfen, um festzustellen, ob das Serverzertifikat von einer der angegebenen CAs signiert wurde. Wenn `tlsSocket.authorized === false` ist, kann der Fehler durch Untersuchen der Eigenschaft `tlsSocket.authorizationError` gefunden werden. Wenn ALPN verwendet wurde, kann die Eigenschaft `tlsSocket.alpnProtocol` überprüft werden, um das ausgehandelte Protokoll zu ermitteln.

Das `'secureConnect'`-Ereignis wird nicht ausgelöst, wenn ein [\<tls.TLSSocket\>](/de/nodejs/api/tls#class-tlstlssocket) mithilfe des Konstruktors `new tls.TLSSocket()` erstellt wird.


### Ereignis: `'session'` {#event-session}

**Hinzugefügt in: v11.10.0**

- `session` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)

Das `'session'`-Ereignis wird auf einem Client `tls.TLSSocket` ausgelöst, wenn eine neue Sitzung oder ein neues TLS-Ticket verfügbar ist. Dies kann vor oder nach dem Abschluss des Handshakes erfolgen, abhängig von der ausgehandelten TLS-Protokollversion. Das Ereignis wird nicht auf dem Server ausgelöst oder wenn keine neue Sitzung erstellt wurde, z. B. wenn die Verbindung fortgesetzt wurde. Bei einigen TLS-Protokollversionen kann das Ereignis mehrmals ausgelöst werden. In diesem Fall können alle Sitzungen für die Wiederaufnahme verwendet werden.

Auf dem Client kann die `session` der Option `session` von [`tls.connect()`](/de/nodejs/api/tls#tlsconnectoptions-callback) bereitgestellt werden, um die Verbindung fortzusetzen.

Weitere Informationen finden Sie unter [Sitzungswiederaufnahme](/de/nodejs/api/tls#session-resumption).

Für TLSv1.2 und darunter kann [`tls.TLSSocket.getSession()`](/de/nodejs/api/tls#tlssocketgetsession) aufgerufen werden, sobald der Handshake abgeschlossen ist. Für TLSv1.3 ist durch das Protokoll nur die Ticket-basierte Wiederaufnahme zulässig, es werden mehrere Tickets gesendet und die Tickets werden erst nach Abschluss des Handshakes gesendet. Daher ist es notwendig, auf das `'session'`-Ereignis zu warten, um eine wiederaufnehmbare Sitzung zu erhalten. Anwendungen sollten das `'session'`-Ereignis anstelle von `getSession()` verwenden, um sicherzustellen, dass sie für alle TLS-Versionen funktionieren. Anwendungen, die nur erwarten, eine Sitzung zu erhalten oder zu verwenden, sollten nur einmal auf dieses Ereignis hören:

```js [ESM]
tlsSocket.once('session', (session) => {
  // Die Sitzung kann sofort oder später verwendet werden.
  tls.connect({
    session: session,
    // Andere Verbindungsoptionen...
  });
});
```
### `tlsSocket.address()` {#tlssocketaddress}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v18.4.0 | Die `family`-Eigenschaft gibt jetzt einen String anstelle einer Zahl zurück. |
| v18.0.0 | Die `family`-Eigenschaft gibt jetzt eine Zahl anstelle eines Strings zurück. |
| v0.11.4 | Hinzugefügt in: v0.11.4 |
:::

- Gibt zurück: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Gibt die gebundene `address`, den Adress`family`-Namen und den `port` des zugrunde liegenden Sockets zurück, wie vom Betriebssystem gemeldet: `{ port: 12346, family: 'IPv4', address: '127.0.0.1' }`.


### `tlsSocket.authorizationError` {#tlssocketauthorizationerror}

**Hinzugefügt in: v0.11.4**

Gibt den Grund zurück, warum das Zertifikat des Peers nicht verifiziert wurde. Diese Eigenschaft wird nur gesetzt, wenn `tlsSocket.authorized === false` ist.

### `tlsSocket.authorized` {#tlssocketauthorized}

**Hinzugefügt in: v0.11.4**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Diese Eigenschaft ist `true`, wenn das Peer-Zertifikat von einer der CAs signiert wurde, die beim Erstellen der `tls.TLSSocket`-Instanz angegeben wurden, andernfalls `false`.

### `tlsSocket.disableRenegotiation()` {#tlssocketdisablerenegotiation}

**Hinzugefügt in: v8.4.0**

Deaktiviert die TLS-Neuverhandlung für diese `TLSSocket`-Instanz. Nach dem Aufruf lösen Versuche zur Neuverhandlung ein `'error'`-Ereignis auf dem `TLSSocket` aus.

### `tlsSocket.enableTrace()` {#tlssocketenabletrace}

**Hinzugefügt in: v12.2.0**

Wenn aktiviert, werden TLS-Paketverfolgungsinformationen nach `stderr` geschrieben. Dies kann zur Fehlersuche bei TLS-Verbindungsproblemen verwendet werden.

Das Format der Ausgabe ist identisch mit der Ausgabe von `openssl s_client -trace` oder `openssl s_server -trace`. Obwohl es von der OpenSSL-Funktion `SSL_trace()` erzeugt wird, ist das Format undokumentiert, kann sich ohne Vorankündigung ändern und sollte nicht darauf verlassen werden.

### `tlsSocket.encrypted` {#tlssocketencrypted}

**Hinzugefügt in: v0.11.4**

Gibt immer `true` zurück. Dies kann verwendet werden, um TLS-Sockets von regulären `net.Socket`-Instanzen zu unterscheiden.

### `tlsSocket.exportKeyingMaterial(length, label[, context])` {#tlssocketexportkeyingmateriallength-label-context}

**Hinzugefügt in: v13.10.0, v12.17.0**

-  `length` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Anzahl der Bytes, die aus dem Keying Material abgerufen werden sollen.
-  `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) eine anwendungsspezifische Bezeichnung, typischerweise ein Wert aus dem [IANA Exporter Label Registry](https://www.iana.org/assignments/tls-parameters/tls-parameters.xhtml#exporter-labels).
-  `context` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) Optional kann ein Kontext bereitgestellt werden.
-  Gibt zurück: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) Angefragte Bytes des Keying Material.

Keying Material wird für Validierungen verwendet, um verschiedene Arten von Angriffen in Netzwerkprotokollen zu verhindern, beispielsweise in den Spezifikationen von IEEE 802.1X.

Beispiel

```js [ESM]
const keyingMaterial = tlsSocket.exportKeyingMaterial(
  128,
  'client finished');

/*
 Beispielhafter Rückgabewert von keyingMaterial:
 <Buffer 76 26 af 99 c5 56 8e 42 09 91 ef 9f 93 cb ad 6c 7b 65 f8 53 f1 d8 d9
    12 5a 33 b8 b5 25 df 7b 37 9f e0 e2 4f b8 67 83 a3 2f cd 5d 41 42 4c 91
    74 ef 2c ... 78 more bytes>
*/
```
Weitere Informationen finden Sie in der OpenSSL-Dokumentation [`SSL_export_keying_material`](https://www.openssl.org/docs/man1.1.1/man3/SSL_export_keying_material).


### `tlsSocket.getCertificate()` {#tlssocketgetcertificate}

**Hinzugefügt in: v11.2.0**

- Gibt zurück: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Gibt ein Objekt zurück, das das lokale Zertifikat darstellt. Das zurückgegebene Objekt hat einige Eigenschaften, die den Feldern des Zertifikats entsprechen.

Siehe [`tls.TLSSocket.getPeerCertificate()`](/de/nodejs/api/tls#tlssocketgetpeercertificatedetailed) für ein Beispiel der Zertifikatsstruktur.

Wenn kein lokales Zertifikat vorhanden ist, wird ein leeres Objekt zurückgegeben. Wenn der Socket zerstört wurde, wird `null` zurückgegeben.

### `tlsSocket.getCipher()` {#tlssocketgetcipher}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v13.4.0, v12.16.0 | Gibt den IETF-Chiffriernamen als `standardName` zurück. |
| v12.0.0 | Gibt die minimale Chiffrierversion anstelle einer festen Zeichenfolge zurück (`'TLSv1/SSLv3'`). |
| v0.11.4 | Hinzugefügt in: v0.11.4 |
:::

- Gibt zurück: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) OpenSSL-Name für die Chiffriersuite.
    - `standardName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) IETF-Name für die Chiffriersuite.
    - `version` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die minimale TLS-Protokollversion, die von dieser Chiffriersuite unterstützt wird. Das tatsächlich ausgehandelte Protokoll finden Sie unter [`tls.TLSSocket.getProtocol()`](/de/nodejs/api/tls#tlssocketgetprotocol).
  
 

Gibt ein Objekt zurück, das Informationen über die ausgehandelte Chiffriersuite enthält.

Zum Beispiel ein TLSv1.2-Protokoll mit AES256-SHA-Chiffre:

```json [JSON]
{
    "name": "AES256-SHA",
    "standardName": "TLS_RSA_WITH_AES_256_CBC_SHA",
    "version": "SSLv3"
}
```
Weitere Informationen finden Sie unter [SSL_CIPHER_get_name](https://www.openssl.org/docs/man1.1.1/man3/SSL_CIPHER_get_name).

### `tlsSocket.getEphemeralKeyInfo()` {#tlssocketgetephemeralkeyinfo}

**Hinzugefügt in: v5.0.0**

- Gibt zurück: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Gibt ein Objekt zurück, das den Typ, den Namen und die Größe des Parameters eines Ephemeral-Key-Exchange in [Perfect Forward Secrecy](/de/nodejs/api/tls#perfect-forward-secrecy) auf einer Clientverbindung darstellt. Es gibt ein leeres Objekt zurück, wenn der Key Exchange nicht ephemer ist. Da dies nur auf einem Client-Socket unterstützt wird, wird `null` zurückgegeben, wenn es auf einem Server-Socket aufgerufen wird. Die unterstützten Typen sind `'DH'` und `'ECDH'`. Die `name`-Eigenschaft ist nur verfügbar, wenn der Typ `'ECDH'` ist.

Zum Beispiel: `{ type: 'ECDH', name: 'prime256v1', size: 256 }`.


### `tlsSocket.getFinished()` {#tlssocketgetfinished}

**Hinzugefügt in: v9.9.0**

- Gibt zurück: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Die letzte `Finished`-Nachricht, die als Teil eines SSL/TLS-Handshakes an den Socket gesendet wurde, oder `undefined`, wenn noch keine `Finished`-Nachricht gesendet wurde.

Da die `Finished`-Nachrichten Message Digests des kompletten Handshakes sind (mit insgesamt 192 Bits für TLS 1.0 und mehr für SSL 3.0), können sie für externe Authentifizierungsverfahren verwendet werden, wenn die durch SSL/TLS bereitgestellte Authentifizierung nicht erwünscht oder nicht ausreichend ist.

Entspricht der `SSL_get_finished`-Routine in OpenSSL und kann verwendet werden, um das `tls-unique` Channel Binding von [RFC 5929](https://tools.ietf.org/html/rfc5929) zu implementieren.

### `tlsSocket.getPeerCertificate([detailed])` {#tlssocketgetpeercertificatedetailed}

**Hinzugefügt in: v0.11.4**

- `detailed` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Die vollständige Zertifikatskette einbeziehen, wenn `true`, andernfalls nur das Zertifikat des Peers einbeziehen.
- Gibt zurück: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Ein Zertifikatsobjekt.

Gibt ein Objekt zurück, das das Zertifikat des Peers repräsentiert. Wenn der Peer kein Zertifikat bereitstellt, wird ein leeres Objekt zurückgegeben. Wenn der Socket zerstört wurde, wird `null` zurückgegeben.

Wenn die vollständige Zertifikatskette angefordert wurde, enthält jedes Zertifikat eine Eigenschaft `issuerCertificate`, die ein Objekt enthält, das das Zertifikat des Ausstellers repräsentiert.

#### Zertifikatsobjekt {#certificate-object}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v19.1.0, v18.13.0 | Eigenschaft "ca" hinzugefügt. |
| v17.2.0, v16.14.0 | Fingerprint512 hinzugefügt. |
| v11.4.0 | Unterstützung für Public-Key-Informationen für elliptische Kurven. |
:::

Ein Zertifikatsobjekt hat Eigenschaften, die den Feldern des Zertifikats entsprechen.

- `ca` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, wenn eine Zertifizierungsstelle (CA), `false` andernfalls.
- `raw` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) Die DER-codierten X.509-Zertifikatsdaten.
- `subject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Der Zertifikatsinhaber, beschrieben in Bezug auf Land (`C`), Bundesland oder Provinz (`ST`), Ort (`L`), Organisation (`O`), Organisationseinheit (`OU`) und CommonName (`CN`). Der CommonName ist typischerweise ein DNS-Name mit TLS-Zertifikaten. Beispiel: `{C: 'UK', ST: 'BC', L: 'Metro', O: 'Node Fans', OU: 'Docs', CN: 'example.com'}`.
- `issuer` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Der Zertifikatsaussteller, beschrieben in den gleichen Begriffen wie das `subject`.
- `valid_from` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Das Datum und die Uhrzeit, ab der das Zertifikat gültig ist.
- `valid_to` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Das Datum und die Uhrzeit, bis zu der das Zertifikat gültig ist.
- `serialNumber` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Die Zertifikatsseriennummer als Hexadezimalzeichenfolge. Beispiel: `'B9B0D332A1AA5635'`.
- `fingerprint` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der SHA-1-Digest des DER-codierten Zertifikats. Er wird als `:`-separierte hexadezimale Zeichenfolge zurückgegeben. Beispiel: `'2A:7A:C2:DD:...'`.
- `fingerprint256` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der SHA-256-Digest des DER-codierten Zertifikats. Er wird als `:`-separierte hexadezimale Zeichenfolge zurückgegeben. Beispiel: `'2A:7A:C2:DD:...'`.
- `fingerprint512` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der SHA-512-Digest des DER-codierten Zertifikats. Er wird als `:`-separierte hexadezimale Zeichenfolge zurückgegeben. Beispiel: `'2A:7A:C2:DD:...'`.
- `ext_key_usage` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) (Optional) Die erweiterte Schlüsselverwendung, eine Menge von OIDs.
- `subjectaltname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) (Optional) Eine Zeichenfolge, die verkettete Namen für den Betreff enthält, eine Alternative zu den `subject`-Namen.
- `infoAccess` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) (Optional) Ein Array, das den AuthorityInfoAccess beschreibt, der mit OCSP verwendet wird.
- `issuerCertificate` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) (Optional) Das Aussteller-Zertifikatsobjekt. Bei selbstsignierten Zertifikaten kann dies eine zirkuläre Referenz sein.

Das Zertifikat kann Informationen über den öffentlichen Schlüssel enthalten, abhängig vom Schlüsseltyp.

Für RSA-Schlüssel können die folgenden Eigenschaften definiert sein:

- `bits` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die RSA-Bitgröße. Beispiel: `1024`.
- `exponent` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der RSA-Exponent, als Zeichenfolge in hexadezimaler Zahlendarstellung. Beispiel: `'0x010001'`.
- `modulus` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der RSA-Modulus als hexadezimale Zeichenfolge. Beispiel: `'B56CE45CB7...'`.
- `pubkey` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) Der öffentliche Schlüssel.

Für EC-Schlüssel können die folgenden Eigenschaften definiert sein:

- `pubkey` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) Der öffentliche Schlüssel.
- `bits` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Schlüsselgröße in Bits. Beispiel: `256`.
- `asn1Curve` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) (Optional) Der ASN.1-Name der OID der elliptischen Kurve. Bekannte Kurven werden durch eine OID identifiziert. Obwohl es ungewöhnlich ist, ist es möglich, dass die Kurve durch ihre mathematischen Eigenschaften identifiziert wird, in diesem Fall hat sie keine OID. Beispiel: `'prime256v1'`.
- `nistCurve` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) (Optional) Der NIST-Name für die elliptische Kurve, falls vorhanden (nicht alle bekannten Kurven haben von NIST Namen erhalten). Beispiel: `'P-256'`.

Beispielzertifikat:

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

**Hinzugefügt in: v9.9.0**

- Gibt zurück: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Die letzte `Finished`-Nachricht, die im Rahmen eines SSL/TLS-Handshakes von dem Socket erwartet oder tatsächlich empfangen wurde, oder `undefined`, falls bisher keine `Finished`-Nachricht vorliegt.

Da die `Finished`-Nachrichten Message Digests des kompletten Handshakes sind (mit insgesamt 192 Bit für TLS 1.0 und mehr für SSL 3.0), können sie für externe Authentifizierungsverfahren verwendet werden, wenn die von SSL/TLS bereitgestellte Authentifizierung nicht erwünscht oder nicht ausreichend ist.

Entspricht der Routine `SSL_get_peer_finished` in OpenSSL und kann zur Implementierung der `tls-unique`-Kanalbindung aus [RFC 5929](https://tools.ietf.org/html/rfc5929) verwendet werden.

### `tlsSocket.getPeerX509Certificate()` {#tlssocketgetpeerx509certificate}

**Hinzugefügt in: v15.9.0**

- Gibt zurück: [\<X509Certificate\>](/de/nodejs/api/crypto#class-x509certificate)

Gibt das Peer-Zertifikat als [\<X509Certificate\>](/de/nodejs/api/crypto#class-x509certificate)-Objekt zurück.

Wenn kein Peer-Zertifikat vorhanden ist oder der Socket zerstört wurde, wird `undefined` zurückgegeben.

### `tlsSocket.getProtocol()` {#tlssocketgetprotocol}

**Hinzugefügt in: v5.7.0**

- Gibt zurück: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

Gibt eine Zeichenkette zurück, die die ausgehandelte SSL/TLS-Protokollversion der aktuellen Verbindung enthält. Der Wert `'unknown'` wird für verbundene Sockets zurückgegeben, die den Handshake-Prozess noch nicht abgeschlossen haben. Der Wert `null` wird für Server-Sockets oder getrennte Client-Sockets zurückgegeben.

Protokollversionen sind:

- `'SSLv3'`
- `'TLSv1'`
- `'TLSv1.1'`
- `'TLSv1.2'`
- `'TLSv1.3'`

Weitere Informationen finden Sie in der OpenSSL-Dokumentation [`SSL_get_version`](https://www.openssl.org/docs/man1.1.1/man3/SSL_get_version).

### `tlsSocket.getSession()` {#tlssocketgetsession}

**Hinzugefügt in: v0.11.4**

- [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)

Gibt die TLS-Sitzungsdaten zurück oder `undefined`, wenn keine Sitzung ausgehandelt wurde. Auf dem Client können die Daten der Option `session` von [`tls.connect()`](/de/nodejs/api/tls#tlsconnectoptions-callback) bereitgestellt werden, um die Verbindung fortzusetzen. Auf dem Server kann dies zum Debuggen nützlich sein.

Weitere Informationen finden Sie unter [Session Resumption](/de/nodejs/api/tls#session-resumption).

Hinweis: `getSession()` funktioniert nur für TLSv1.2 und darunter. Für TLSv1.3 müssen Anwendungen das [`'session'`](/de/nodejs/api/tls#event-session)-Event verwenden (es funktioniert auch für TLSv1.2 und darunter).


### `tlsSocket.getSharedSigalgs()` {#tlssocketgetsharedsigalgs}

**Hinzugefügt in: v12.11.0**

- Gibt zurück: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Liste der zwischen Server und Client gemeinsam genutzten Signaturalgorithmen in absteigender Reihenfolge ihrer Präferenz.

Weitere Informationen finden Sie unter [SSL_get_shared_sigalgs](https://www.openssl.org/docs/man1.1.1/man3/SSL_get_shared_sigalgs).

### `tlsSocket.getTLSTicket()` {#tlssocketgettlsticket}

**Hinzugefügt in: v0.11.4**

- [\<Buffer\>](/de/nodejs/api/buffer#class-buffer)

Für einen Client wird das TLS-Session-Ticket zurückgegeben, falls eines verfügbar ist, oder `undefined`. Für einen Server wird immer `undefined` zurückgegeben.

Es kann für das Debuggen nützlich sein.

Weitere Informationen finden Sie unter [Session-Wiederaufnahme](/de/nodejs/api/tls#session-resumption).

### `tlsSocket.getX509Certificate()` {#tlssocketgetx509certificate}

**Hinzugefügt in: v15.9.0**

- Gibt zurück: [\<X509Certificate\>](/de/nodejs/api/crypto#class-x509certificate)

Gibt das lokale Zertifikat als [\<X509Certificate\>](/de/nodejs/api/crypto#class-x509certificate)-Objekt zurück.

Wenn kein lokales Zertifikat vorhanden ist oder der Socket zerstört wurde, wird `undefined` zurückgegeben.

### `tlsSocket.isSessionReused()` {#tlssocketissessionreused}

**Hinzugefügt in: v0.5.6**

- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, wenn die Session wiederverwendet wurde, andernfalls `false`.

Weitere Informationen finden Sie unter [Session-Wiederaufnahme](/de/nodejs/api/tls#session-resumption).

### `tlsSocket.localAddress` {#tlssocketlocaladdress}

**Hinzugefügt in: v0.11.4**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Gibt die String-Repräsentation der lokalen IP-Adresse zurück.

### `tlsSocket.localPort` {#tlssocketlocalport}

**Hinzugefügt in: v0.11.4**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Gibt die numerische Repräsentation des lokalen Ports zurück.

### `tlsSocket.remoteAddress` {#tlssocketremoteaddress}

**Hinzugefügt in: v0.11.4**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Gibt die String-Repräsentation der Remote-IP-Adresse zurück. Zum Beispiel `'74.125.127.100'` oder `'2001:4860:a005::68'`.


### `tlsSocket.remoteFamily` {#tlssocketremotefamily}

**Hinzugefügt in: v0.11.4**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Gibt die String-Darstellung der Remote-IP-Familie zurück. `'IPv4'` oder `'IPv6'`.

### `tlsSocket.remotePort` {#tlssocketremoteport}

**Hinzugefügt in: v0.11.4**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Gibt die numerische Darstellung des Remote-Ports zurück. Zum Beispiel `443`.

### `tlsSocket.renegotiate(options, callback)` {#tlssocketrenegotiateoptions-callback}


::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v18.0.0 | Das Übergeben eines ungültigen Rückrufs an das `callback`-Argument wirft jetzt `ERR_INVALID_ARG_TYPE` anstelle von `ERR_INVALID_CALLBACK`. |
| v0.11.8 | Hinzugefügt in: v0.11.8 |
:::

-  `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `rejectUnauthorized` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn nicht `false`, wird das Serverzertifikat anhand der Liste der mitgelieferten CAs überprüft. Ein `'error'`-Ereignis wird ausgelöst, wenn die Überprüfung fehlschlägt; `err.code` enthält den OpenSSL-Fehlercode. **Standard:** `true`.
    - `requestCert`
  
 
-  `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Wenn `renegotiate()` `true` zurückgegeben hat, wird der Rückruf einmal an das `'secure'`-Ereignis angehängt. Wenn `renegotiate()` `false` zurückgegeben hat, wird `callback` im nächsten Tick mit einem Fehler aufgerufen, es sei denn, der `tlsSocket` wurde zerstört. In diesem Fall wird `callback` überhaupt nicht aufgerufen.
-  Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, wenn die Neuverhandlung initiiert wurde, andernfalls `false`.

Die Methode `tlsSocket.renegotiate()` initiiert einen TLS-Neuverhandlungsprozess. Nach Abschluss wird der `callback`-Funktion ein einzelnes Argument übergeben, das entweder ein `Error` (wenn die Anfrage fehlgeschlagen ist) oder `null` ist.

Diese Methode kann verwendet werden, um das Zertifikat eines Peers anzufordern, nachdem die sichere Verbindung hergestellt wurde.

Wenn die Ausführung als Server erfolgt, wird der Socket nach dem `handshakeTimeout`-Timeout mit einem Fehler zerstört.

Für TLSv1.3 kann keine Neuverhandlung initiiert werden, da sie vom Protokoll nicht unterstützt wird.


### `tlsSocket.setKeyCert(context)` {#tlssocketsetkeycertcontext}

**Hinzugefügt in: v22.5.0, v20.17.0**

- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<tls.SecureContext\>](/de/nodejs/api/tls#tlscreatesecurecontextoptions) Ein Objekt, das mindestens die Eigenschaften `key` und `cert` aus den [`tls.createSecureContext()`](/de/nodejs/api/tls#tlscreatesecurecontextoptions) `options` enthält, oder ein TLS-Kontextobjekt, das mit [`tls.createSecureContext()`](/de/nodejs/api/tls#tlscreatesecurecontextoptions) selbst erstellt wurde.

Die Methode `tlsSocket.setKeyCert()` legt den privaten Schlüssel und das Zertifikat fest, die für den Socket verwendet werden sollen. Dies ist hauptsächlich nützlich, wenn Sie ein Serverzertifikat aus dem `ALPNCallback` eines TLS-Servers auswählen möchten.

### `tlsSocket.setMaxSendFragment(size)` {#tlssocketsetmaxsendfragmentsize}

**Hinzugefügt in: v0.11.11**

- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die maximale TLS-Fragmentgröße. Der Maximalwert ist `16384`. **Standard:** `16384`.
- Gibt zurück: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Die Methode `tlsSocket.setMaxSendFragment()` legt die maximale TLS-Fragmentgröße fest. Gibt `true` zurück, wenn das Festlegen des Limits erfolgreich war; andernfalls `false`.

Kleinere Fragmentgrößen verringern die Pufferlatenz auf dem Client: Größere Fragmente werden von der TLS-Schicht gepuffert, bis das gesamte Fragment empfangen und seine Integrität überprüft wurde; große Fragmente können mehrere Roundtrips umfassen und ihre Verarbeitung kann sich aufgrund von Paketverlust oder -umordnung verzögern. Kleinere Fragmente fügen jedoch zusätzliche TLS-Framing-Bytes und CPU-Overhead hinzu, was den Gesamtdurchsatz des Servers verringern kann.

## `tls.checkServerIdentity(hostname, cert)` {#tlscheckserveridentityhostname-cert}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v17.3.1, v16.13.2, v14.18.3, v12.22.9 | Die Unterstützung für alternative Subjektnamen vom Typ `uniformResourceIdentifier` wurde als Reaktion auf CVE-2021-44531 deaktiviert. |
| v0.8.4 | Hinzugefügt in: v0.8.4 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der Hostname oder die IP-Adresse, gegen die das Zertifikat verifiziert werden soll.
- `cert` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Ein [Zertifikatobjekt](/de/nodejs/api/tls#certificate-object), das das Zertifikat des Peers darstellt.
- Gibt zurück: [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Verifiziert, ob das Zertifikat `cert` für `hostname` ausgestellt wurde.

Gibt ein [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)-Objekt zurück und füllt es bei einem Fehler mit `reason`, `host` und `cert`. Bei Erfolg wird [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) zurückgegeben.

Diese Funktion ist für die Verwendung in Kombination mit der Option `checkServerIdentity` vorgesehen, die an [`tls.connect()`](/de/nodejs/api/tls#tlsconnectoptions-callback) übergeben werden kann, und arbeitet als solche mit einem [Zertifikatobjekt](/de/nodejs/api/tls#certificate-object). Für andere Zwecke sollte stattdessen [`x509.checkHost()`](/de/nodejs/api/crypto#x509checkhostname-options) verwendet werden.

Diese Funktion kann überschrieben werden, indem eine alternative Funktion als Option `options.checkServerIdentity` bereitgestellt wird, die an `tls.connect()` übergeben wird. Die überschreibende Funktion kann natürlich `tls.checkServerIdentity()` aufrufen, um die durchgeführten Prüfungen durch zusätzliche Verifizierung zu ergänzen.

Diese Funktion wird nur aufgerufen, wenn das Zertifikat alle anderen Prüfungen bestanden hat, z. B. die Ausstellung durch eine vertrauenswürdige Zertifizierungsstelle (`options.ca`).

Frühere Versionen von Node.js akzeptierten fälschlicherweise Zertifikate für einen bestimmten `Hostname`, wenn ein übereinstimmender alternativer Subjektname `uniformResourceIdentifier` vorhanden war (siehe [CVE-2021-44531](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-44531)). Anwendungen, die alternative Subjektnamen vom Typ `uniformResourceIdentifier` akzeptieren möchten, können eine benutzerdefinierte Funktion `options.checkServerIdentity` verwenden, die das gewünschte Verhalten implementiert.


## `tls.connect(options[, callback])` {#tlsconnectoptions-callback}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v15.1.0, v14.18.0 | `onread`-Option hinzugefügt. |
| v14.1.0, v13.14.0 | Die Option `highWaterMark` wird jetzt akzeptiert. |
| v13.6.0, v12.16.0 | Die Option `pskCallback` wird jetzt unterstützt. |
| v12.9.0 | Unterstützung für die Option `allowHalfOpen`. |
| v12.4.0 | Die Option `hints` wird jetzt unterstützt. |
| v12.2.0 | Die Option `enableTrace` wird jetzt unterstützt. |
| v11.8.0, v10.16.0 | Die Option `timeout` wird jetzt unterstützt. |
| v8.0.0 | Die Option `lookup` wird jetzt unterstützt. |
| v8.0.0 | Die Option `ALPNProtocols` kann jetzt ein `TypedArray` oder `DataView` sein. |
| v5.0.0 | ALPN-Optionen werden jetzt unterstützt. |
| v5.3.0, v4.7.0 | Die Option `secureContext` wird jetzt unterstützt. |
| v0.11.3 | Hinzugefügt in: v0.11.3 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `enableTrace`: Siehe [`tls.createServer()`](/de/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Host, mit dem sich der Client verbinden soll. **Standard:** `'localhost'`.
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Port, mit dem sich der Client verbinden soll.
    - `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Erstellt eine Unix-Socket-Verbindung zu dem Pfad. Wenn diese Option angegeben ist, werden `host` und `port` ignoriert.
    - `socket` [\<stream.Duplex\>](/de/nodejs/api/stream#class-streamduplex) Baut eine sichere Verbindung über einen gegebenen Socket auf, anstatt einen neuen Socket zu erstellen. Typischerweise ist dies eine Instanz von [`net.Socket`](/de/nodejs/api/net#class-netsocket), aber jeder `Duplex`-Stream ist erlaubt. Wenn diese Option angegeben ist, werden `path`, `host` und `port` ignoriert, außer für die Zertifikatsvalidierung. Normalerweise ist ein Socket bereits verbunden, wenn er an `tls.connect()` übergeben wird, aber er kann später verbunden werden. Verbindung/Trennung/Zerstörung des `socket` liegt in der Verantwortung des Benutzers; der Aufruf von `tls.connect()` führt nicht dazu, dass `net.connect()` aufgerufen wird.
    - `allowHalfOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn auf `false` gesetzt, beendet der Socket automatisch die beschreibbare Seite, wenn die lesbare Seite endet. Wenn die Option `socket` gesetzt ist, hat diese Option keine Auswirkung. Siehe die Option `allowHalfOpen` von [`net.Socket`](/de/nodejs/api/net#class-netsocket) für Details. **Standard:** `false`.
    - `rejectUnauthorized` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn nicht `false`, wird das Serverzertifikat anhand der Liste der bereitgestellten CAs verifiziert. Ein `'error'`-Event wird ausgelöst, wenn die Verifizierung fehlschlägt; `err.code` enthält den OpenSSL-Fehlercode. **Standard:** `true`.
    - `pskCallback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Für TLS-PSK-Verhandlungen, siehe [Pre-Shared Keys](/de/nodejs/api/tls#pre-shared-keys).
    - `ALPNProtocols`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer[]\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Ein Array von Strings, `Buffer`s, `TypedArray`s oder `DataView`s oder ein einzelner `Buffer`, `TypedArray` oder `DataView`, das die unterstützten ALPN-Protokolle enthält. `Buffer`s sollten das Format `[len][name][len][name]...` haben, z.B. `'\x08http/1.1\x08http/1.0'`, wobei das `len`-Byte die Länge des nächsten Protokollnamens ist. Die Übergabe eines Arrays ist normalerweise viel einfacher, z.B. `['http/1.1', 'http/1.0']`. Protokolle, die in der Liste weiter oben stehen, haben eine höhere Präferenz als die weiter unten.
    - `servername`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Servername für die SNI (Server Name Indication) TLS-Erweiterung. Es ist der Name des Hosts, mit dem eine Verbindung hergestellt wird, und muss ein Hostname und keine IP-Adresse sein. Er kann von einem Multi-Homed-Server verwendet werden, um das richtige Zertifikat auszuwählen, das dem Client präsentiert werden soll, siehe die Option `SNICallback` zu [`tls.createServer()`](/de/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener).
    - `checkServerIdentity(servername, cert)` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Eine Callback-Funktion, die (anstelle der eingebauten Funktion `tls.checkServerIdentity()`) verwendet wird, wenn der Hostname des Servers (oder der bereitgestellte `servername`, wenn er explizit gesetzt ist) mit dem Zertifikat verglichen wird. Dies sollte ein [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) zurückgeben, wenn die Verifizierung fehlschlägt. Die Methode sollte `undefined` zurückgeben, wenn `servername` und `cert` verifiziert sind.
    - `session` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) Eine `Buffer`-Instanz, die die TLS-Sitzung enthält.
    - `minDHSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Minimale Größe des DH-Parameters in Bit, um eine TLS-Verbindung zu akzeptieren. Wenn ein Server einen DH-Parameter mit einer Größe von weniger als `minDHSize` anbietet, wird die TLS-Verbindung zerstört und ein Fehler wird ausgelöst. **Standard:** `1024`.
    - `highWaterMark`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Konsistent mit dem `highWaterMark`-Parameter des lesbaren Streams. **Standard:** `16 * 1024`.
    - `secureContext`: TLS-Kontextobjekt, das mit [`tls.createSecureContext()`](/de/nodejs/api/tls#tlscreatesecurecontextoptions) erstellt wurde. Wenn kein `secureContext` bereitgestellt wird, wird einer erstellt, indem das gesamte `options`-Objekt an `tls.createSecureContext()` übergeben wird.
    - `onread` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Wenn die Option `socket` fehlt, werden eingehende Daten in einem einzelnen `Buffer` gespeichert und an den bereitgestellten `callback` übergeben, wenn Daten auf dem Socket eintreffen, andernfalls wird die Option ignoriert. Siehe die Option `onread` von [`net.Socket`](/de/nodejs/api/net#class-netsocket) für Details.
    - ...: [`tls.createSecureContext()`](/de/nodejs/api/tls#tlscreatesecurecontextoptions) Optionen, die verwendet werden, wenn die Option `secureContext` fehlt, andernfalls werden sie ignoriert.
    - ...: Jede [`socket.connect()`](/de/nodejs/api/net#socketconnectoptions-connectlistener) Option, die noch nicht aufgeführt ist.
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Rückgabe: [\<tls.TLSSocket\>](/de/nodejs/api/tls#class-tlstlssocket)

Die `callback`-Funktion wird, falls angegeben, als Listener für das [`'secureConnect'`](/de/nodejs/api/tls#event-secureconnect)-Ereignis hinzugefügt.

`tls.connect()` gibt ein [`tls.TLSSocket`](/de/nodejs/api/tls#class-tlstlssocket)-Objekt zurück.

Im Gegensatz zur `https`-API aktiviert `tls.connect()` die SNI-Erweiterung (Server Name Indication) nicht standardmäßig, was dazu führen kann, dass einige Server ein falsches Zertifikat zurückgeben oder die Verbindung ganz ablehnen. Um SNI zu aktivieren, setzen Sie zusätzlich zu `host` die Option `servername`.

Das Folgende veranschaulicht einen Client für das Echo-Server-Beispiel von [`tls.createServer()`](/de/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener):

::: code-group
```js [ESM]
// Setzt einen Echo-Server voraus, der an Port 8000 lauscht.
import { connect } from 'node:tls';
import { readFileSync } from 'node:fs';
import { stdin } from 'node:process';

const options = {
  // Nur notwendig, wenn der Server eine Client-Zertifikatsauthentifizierung erfordert.
  key: readFileSync('client-key.pem'),
  cert: readFileSync('client-cert.pem'),

  // Nur notwendig, wenn der Server ein selbstsigniertes Zertifikat verwendet.
  ca: [ readFileSync('server-cert.pem') ],

  // Nur notwendig, wenn das Zertifikat des Servers nicht für "localhost" bestimmt ist.
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
// Setzt einen Echo-Server voraus, der an Port 8000 lauscht.
const { connect } = require('node:tls');
const { readFileSync } = require('node:fs');

const options = {
  // Nur notwendig, wenn der Server eine Client-Zertifikatsauthentifizierung erfordert.
  key: readFileSync('client-key.pem'),
  cert: readFileSync('client-cert.pem'),

  // Nur notwendig, wenn der Server ein selbstsigniertes Zertifikat verwendet.
  ca: [ readFileSync('server-cert.pem') ],

  // Nur notwendig, wenn das Zertifikat des Servers nicht für "localhost" bestimmt ist.
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

Um das Zertifikat und den Schlüssel für dieses Beispiel zu generieren, führen Sie Folgendes aus:

```bash [BASH]
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
  -keyout client-key.pem -out client-cert.pem
```
Um dann das `server-cert.pem`-Zertifikat für dieses Beispiel zu generieren, führen Sie Folgendes aus:

```bash [BASH]
openssl pkcs12 -certpbe AES-256-CBC -export -out server-cert.pem \
  -inkey client-key.pem -in client-cert.pem
```

## `tls.connect(path[, options][, callback])` {#tlsconnectpath-options-callback}

**Hinzugefügt in: v0.11.3**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Standardwert für `options.path`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Siehe [`tls.connect()`](/de/nodejs/api/tls#tlsconnectoptions-callback).
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Siehe [`tls.connect()`](/de/nodejs/api/tls#tlsconnectoptions-callback).
- Rückgabe: [\<tls.TLSSocket\>](/de/nodejs/api/tls#class-tlstlssocket)

Gleich wie [`tls.connect()`](/de/nodejs/api/tls#tlsconnectoptions-callback), außer dass `path` als Argument anstelle einer Option angegeben werden kann.

Eine Pfadoption hat, falls angegeben, Vorrang vor dem Pfadargument.

## `tls.connect(port[, host][, options][, callback])` {#tlsconnectport-host-options-callback}

**Hinzugefügt in: v0.11.3**

- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Standardwert für `options.port`.
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Standardwert für `options.host`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Siehe [`tls.connect()`](/de/nodejs/api/tls#tlsconnectoptions-callback).
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Siehe [`tls.connect()`](/de/nodejs/api/tls#tlsconnectoptions-callback).
- Rückgabe: [\<tls.TLSSocket\>](/de/nodejs/api/tls#class-tlstlssocket)

Gleich wie [`tls.connect()`](/de/nodejs/api/tls#tlsconnectoptions-callback), außer dass `port` und `host` als Argumente anstelle von Optionen angegeben werden können.

Eine Port- oder Host-Option hat, falls angegeben, Vorrang vor einem Port- oder Host-Argument.

## `tls.createSecureContext([options])` {#tlscreatesecurecontextoptions}

::: info [Historie]
| Version | Änderungen |
| --- | --- |
| v22.9.0, v20.18.0 | Die Option `allowPartialTrustChain` wurde hinzugefügt. |
| v22.4.0, v20.16.0 | Die Optionen `clientCertEngine`, `privateKeyEngine` und `privateKeyIdentifier` hängen von der Unterstützung für benutzerdefinierte Engines in OpenSSL ab, die in OpenSSL 3 als veraltet gilt. |
| v19.8.0, v18.16.0 | Die Option `dhparam` kann jetzt auf `'auto'` gesetzt werden, um DHE mit geeigneten, bekannten Parametern zu aktivieren. |
| v12.12.0 | Die Optionen `privateKeyIdentifier` und `privateKeyEngine` wurden hinzugefügt, um den privaten Schlüssel von einer OpenSSL-Engine abzurufen. |
| v12.11.0 | Die Option `sigalgs` wurde hinzugefügt, um die unterstützten Signaturalgorithmen zu überschreiben. |
| v12.0.0 | TLSv1.3-Unterstützung hinzugefügt. |
| v11.5.0 | Die Option `ca:` unterstützt jetzt `BEGIN TRUSTED CERTIFICATE`. |
| v11.4.0, v10.16.0 | Die `minVersion` und `maxVersion` können verwendet werden, um die zulässigen TLS-Protokollversionen einzuschränken. |
| v10.0.0 | Die `ecdhCurve` kann aufgrund einer Änderung in OpenSSL nicht mehr auf `false` gesetzt werden. |
| v9.3.0 | Der Parameter `options` kann jetzt `clientCertEngine` enthalten. |
| v9.0.0 | Die Option `ecdhCurve` kann jetzt mehrere durch `':'` getrennte Kurvennamen oder `'auto'` sein. |
| v7.3.0 | Wenn die Option `key` ein Array ist, benötigen einzelne Einträge keine `passphrase`-Eigenschaft mehr. `Array`-Einträge können jetzt auch einfach `string`s oder `Buffer`s sein. |
| v5.2.0 | Die Option `ca` kann jetzt ein einzelner String sein, der mehrere CA-Zertifikate enthält. |
| v0.11.13 | Hinzugefügt in: v0.11.13 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `allowPartialTrustChain` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Behandle intermediäre (nicht selbstsignierte) Zertifikate in der Liste der vertrauenswürdigen CA-Zertifikate als vertrauenswürdig.
    - `ca` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<Buffer[]\>](/de/nodejs/api/buffer#class-buffer) Überschreibt optional die vertrauenswürdigen CA-Zertifikate. Standardmäßig werden die bekannten CAs, die von Mozilla kuratiert werden, als vertrauenswürdig eingestuft. Die CAs von Mozilla werden vollständig ersetzt, wenn CAs explizit mit dieser Option angegeben werden. Der Wert kann ein String oder ein `Buffer` oder ein `Array` von Strings und/oder `Buffer`s sein. Jeder String oder `Buffer` kann mehrere PEM-CAs enthalten, die miteinander verkettet sind. Das Zertifikat des Peers muss mit einer CA verkettbar sein, der der Server vertraut, damit die Verbindung authentifiziert werden kann. Bei Verwendung von Zertifikaten, die nicht mit einer bekannten CA verkettbar sind, muss die CA des Zertifikats explizit als vertrauenswürdig angegeben werden, andernfalls kann die Verbindung nicht authentifiziert werden. Wenn der Peer ein Zertifikat verwendet, das nicht mit einer der Standard-CAs übereinstimmt oder mit einer solchen verkettet ist, verwenden Sie die Option `ca`, um ein CA-Zertifikat bereitzustellen, mit dem das Zertifikat des Peers übereinstimmen oder mit dem es verkettet werden kann. Für selbstsignierte Zertifikate ist das Zertifikat seine eigene CA und muss bereitgestellt werden. Für PEM-kodierte Zertifikate sind die unterstützten Typen "TRUSTED CERTIFICATE", "X509 CERTIFICATE" und "CERTIFICATE". Siehe auch [`tls.rootCertificates`](/de/nodejs/api/tls#tlsrootcertificates).
    - `cert` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<Buffer[]\>](/de/nodejs/api/buffer#class-buffer) Zertifikatsketten im PEM-Format. Pro privatem Schlüssel sollte eine Zertifikatskette bereitgestellt werden. Jede Zertifikatskette sollte aus dem PEM-formatierten Zertifikat für einen bereitgestellten privaten `key` bestehen, gefolgt von den PEM-formatierten Zwischenzertifikaten (falls vorhanden), in der Reihenfolge und ohne die Root-CA (die Root-CA muss dem Peer bekannt sein, siehe `ca`). Wenn mehrere Zertifikatsketten bereitgestellt werden, müssen sie nicht in der gleichen Reihenfolge wie ihre privaten Schlüssel in `key` stehen. Wenn die Zwischenzertifikate nicht bereitgestellt werden, kann der Peer das Zertifikat nicht validieren und der Handshake schlägt fehl.
    - `sigalgs` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Durch Doppelpunkte getrennte Liste der unterstützten Signaturalgorithmen. Die Liste kann Digest-Algorithmen (`SHA256`, `MD5` usw.), Public-Key-Algorithmen (`RSA-PSS`, `ECDSA` usw.), eine Kombination aus beidem (z. B. 'RSA+SHA384') oder TLS v1.3-Schemanammen (z. B. `rsa_pss_pss_sha512`) enthalten. Weitere Informationen finden Sie in den [OpenSSL-Handbuchseiten](https://www.openssl.org/docs/man1.1.1/man3/SSL_CTX_set1_sigalgs_list).
    - `ciphers` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Chiffrensuite-Spezifikation, die die Standardeinstellung ersetzt. Weitere Informationen finden Sie unter [Ändern der standardmäßigen TLS-Chiffrensuite](/de/nodejs/api/tls#modifying-the-default-tls-cipher-suite). Zulässige Chiffren können über [`tls.getCiphers()`](/de/nodejs/api/tls#tlsgetciphers) abgerufen werden. Chiffrennamen müssen großgeschrieben sein, damit OpenSSL sie akzeptiert.
    - `clientCertEngine` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Name einer OpenSSL-Engine, die das Clientzertifikat bereitstellen kann. **Veraltet.**
    - `crl` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<Buffer[]\>](/de/nodejs/api/buffer#class-buffer) PEM-formatierte CRLs (Certificate Revocation Lists).
    - `dhparam` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) `'auto'` oder benutzerdefinierte Diffie-Hellman-Parameter, erforderlich für nicht-ECDHE [Perfect Forward Secrecy](/de/nodejs/api/tls#perfect-forward-secrecy). Wenn sie weggelassen oder ungültig sind, werden die Parameter stillschweigend verworfen und DHE-Chiffren sind nicht verfügbar. [ECDHE](https://en.wikipedia.org/wiki/Elliptic_curve_Diffie%E2%80%93Hellman)-basierte [Perfect Forward Secrecy](/de/nodejs/api/tls#perfect-forward-secrecy) ist weiterhin verfügbar.
    - `ecdhCurve` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Ein String, der eine benannte Kurve oder eine durch Doppelpunkte getrennte Liste von Kurven-NIDs oder -Namen beschreibt, z. B. `P-521:P-384:P-256`, die für die ECDH-Schlüsselvereinbarung verwendet werden soll. Setzen Sie sie auf `auto`, um die Kurve automatisch auszuwählen. Verwenden Sie [`crypto.getCurves()`](/de/nodejs/api/crypto#cryptogetcurves), um eine Liste der verfügbaren Kurvennamen abzurufen. In neueren Versionen zeigt `openssl ecparam -list_curves` auch den Namen und die Beschreibung jeder verfügbaren elliptischen Kurve an. **Standard:** [`tls.DEFAULT_ECDH_CURVE`](/de/nodejs/api/tls#tlsdefault_ecdh_curve).
    - `honorCipherOrder` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Versuchen Sie, die Chiffrensuite-Präferenzen des Servers anstelle der des Clients zu verwenden. Wenn `true`, wird `SSL_OP_CIPHER_SERVER_PREFERENCE` in `secureOptions` gesetzt. Weitere Informationen finden Sie unter [OpenSSL-Optionen](/de/nodejs/api/crypto#openssl-options).
    - `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<Buffer[]\>](/de/nodejs/api/buffer#class-buffer) | [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Private Schlüssel im PEM-Format. PEM ermöglicht die Option, private Schlüssel zu verschlüsseln. Verschlüsselte Schlüssel werden mit `options.passphrase` entschlüsselt. Es können mehrere Schlüssel mit unterschiedlichen Algorithmen entweder als Array von unverschlüsselten Schlüsselstrings oder -puffern oder als Array von Objekten im Format `{pem: \<string|buffer\>[, passphrase: \<string\>]}` bereitgestellt werden. Die Objektform kann nur in einem Array vorkommen. `object.passphrase` ist optional. Verschlüsselte Schlüssel werden mit `object.passphrase` entschlüsselt, falls vorhanden, oder mit `options.passphrase`, falls nicht.
    - `privateKeyEngine` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Name einer OpenSSL-Engine, von der der private Schlüssel abgerufen werden soll. Sollte zusammen mit `privateKeyIdentifier` verwendet werden. **Veraltet.**
    - `privateKeyIdentifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Kennung eines privaten Schlüssels, der von einer OpenSSL-Engine verwaltet wird. Sollte zusammen mit `privateKeyEngine` verwendet werden. Sollte nicht zusammen mit `key` gesetzt werden, da beide Optionen einen privaten Schlüssel auf unterschiedliche Weise definieren. **Veraltet.**
    - `maxVersion` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Legt optional die maximal zulässige TLS-Version fest. Eine von `'TLSv1.3'`, `'TLSv1.2'`, `'TLSv1.1'` oder `'TLSv1'`. Kann nicht zusammen mit der Option `secureProtocol` angegeben werden; verwenden Sie entweder das eine oder das andere. **Standard:** [`tls.DEFAULT_MAX_VERSION`](/de/nodejs/api/tls#tlsdefault_max_version).
    - `minVersion` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Legt optional die minimal zulässige TLS-Version fest. Eine von `'TLSv1.3'`, `'TLSv1.2'`, `'TLSv1.1'` oder `'TLSv1'`. Kann nicht zusammen mit der Option `secureProtocol` angegeben werden; verwenden Sie entweder das eine oder das andere. Vermeiden Sie es, sie auf weniger als TLSv1.2 zu setzen, aber dies kann für die Interoperabilität erforderlich sein. Versionen vor TLSv1.2 erfordern möglicherweise ein Downgrade des [OpenSSL-Sicherheitslevels](/de/nodejs/api/tls#openssl-security-level). **Standard:** [`tls.DEFAULT_MIN_VERSION`](/de/nodejs/api/tls#tlsdefault_min_version).
    - `passphrase` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Gemeinsame Passphrase, die für einen einzelnen privaten Schlüssel und/oder eine PFX verwendet wird.
    - `pfx` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<Buffer[]\>](/de/nodejs/api/buffer#class-buffer) | [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) PFX- oder PKCS12-kodierter privater Schlüssel und Zertifikatskette. `pfx` ist eine Alternative zur individuellen Bereitstellung von `key` und `cert`. PFX ist normalerweise verschlüsselt. Wenn dies der Fall ist, wird `passphrase` verwendet, um es zu entschlüsseln. Es können mehrere PFX entweder als Array von unverschlüsselten PFX-Puffern oder als Array von Objekten im Format `{buf: \<string|buffer\>[, passphrase: \<string\>]}` bereitgestellt werden. Die Objektform kann nur in einem Array vorkommen. `object.passphrase` ist optional. Verschlüsselte PFX werden mit `object.passphrase` entschlüsselt, falls vorhanden, oder mit `options.passphrase`, falls nicht.
    - `secureOptions` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Beeinflusst optional das OpenSSL-Protokollverhalten, was normalerweise nicht erforderlich ist. Dies sollte nur mit Vorsicht verwendet werden! Der Wert ist eine numerische Bitmaske der `SSL_OP_*`-Optionen aus [OpenSSL-Optionen](/de/nodejs/api/crypto#openssl-options).
    - `secureProtocol` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Legacy-Mechanismus zur Auswahl der zu verwendenden TLS-Protokollversion, der keine unabhängige Steuerung der minimalen und maximalen Version unterstützt und die Protokollbeschränkung auf TLSv1.3 nicht unterstützt. Verwenden Sie stattdessen `minVersion` und `maxVersion`. Die möglichen Werte sind als [SSL_METHODS](https://www.openssl.org/docs/man1.1.1/man7/ssl#Dealing-with-Protocol-Methods) aufgeführt. Verwenden Sie die Funktionsnamen als Strings. Verwenden Sie beispielsweise `'TLSv1_1_method'`, um die TLS-Version 1.1 zu erzwingen, oder `'TLS_method'`, um jede TLS-Protokollversion bis zu TLSv1.3 zuzulassen. Es wird nicht empfohlen, TLS-Versionen unter 1.2 zu verwenden, aber dies kann für die Interoperabilität erforderlich sein. **Standard:** keine, siehe `minVersion`.
    - `sessionIdContext` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Opaker Bezeichner, der von Servern verwendet wird, um sicherzustellen, dass der Sitzungsstatus nicht zwischen Anwendungen geteilt wird. Wird von Clients nicht verwendet.
    - `ticketKeys`: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) 48 Bytes kryptografisch starker pseudozufälliger Daten. Weitere Informationen finden Sie unter [Session Resumption](/de/nodejs/api/tls#session-resumption).
    - `sessionTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der Sekunden, nach denen eine vom Server erstellte TLS-Sitzung nicht mehr wiederaufgenommen werden kann. Weitere Informationen finden Sie unter [Session Resumption](/de/nodejs/api/tls#session-resumption). **Standard:** `300`.

[`tls.createServer()`](/de/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener) setzt den Standardwert der Option `honorCipherOrder` auf `true`, andere APIs, die sichere Kontexte erstellen, lassen sie nicht gesetzt.

[`tls.createServer()`](/de/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener) verwendet einen aus `process.argv` generierten 128-Bit-SHA1-Hashwert als Standardwert der Option `sessionIdContext`, andere APIs, die sichere Kontexte erstellen, haben keinen Standardwert.

Die Methode `tls.createSecureContext()` erstellt ein `SecureContext`-Objekt. Es kann als Argument für verschiedene `tls`-APIs verwendet werden, z. B. [`server.addContext()`](/de/nodejs/api/tls#serveraddcontexthostname-context), hat aber keine öffentlichen Methoden. Der [`tls.Server`](/de/nodejs/api/tls#class-tlsserver)-Konstruktor und die Methode [`tls.createServer()`](/de/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener) unterstützen die Option `secureContext` nicht.

Ein Schlüssel ist für Chiffren, die Zertifikate verwenden, *erforderlich*. Entweder `key` oder `pfx` können verwendet werden, um ihn bereitzustellen.

Wenn die Option `ca` nicht angegeben ist, verwendet Node.js standardmäßig [Mozillas öffentlich vertrauenswürdige Liste von CAs](https://hg.mozilla.org/mozilla-central/raw-file/tip/security/nss/lib/ckfw/builtins/certdata.txt).

Benutzerdefinierte DHE-Parameter werden zugunsten der neuen Option `dhparam: 'auto'` abgeraten. Wenn sie auf `'auto'` gesetzt ist, werden automatisch bekannte DHE-Parameter mit ausreichender Stärke ausgewählt. Andernfalls kann bei Bedarf `openssl dhparam` verwendet werden, um benutzerdefinierte Parameter zu erstellen. Die Schlüssellänge muss größer oder gleich 1024 Bit sein, andernfalls wird ein Fehler ausgelöst. Obwohl 1024 Bit zulässig sind, verwenden Sie 2048 Bit oder mehr für eine stärkere Sicherheit.


## `tls.createSecurePair([context][, isServer][, requestCert][, rejectUnauthorized][, options])` {#tlscreatesecurepaircontext-isserver-requestcert-rejectunauthorized-options}

::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v5.0.0 | ALPN-Optionen werden jetzt unterstützt. |
| v0.11.3 | Veraltet seit: v0.11.3 |
| v0.3.2 | Hinzugefügt in: v0.3.2 |
:::

::: danger [Stabil: 0 - Veraltet]
[Stabil: 0](/de/nodejs/api/documentation#stability-index) [Stabilität: 0](/de/nodejs/api/documentation#stability-index) - Veraltet: Verwenden Sie stattdessen [`tls.TLSSocket`](/de/nodejs/api/tls#class-tlstlssocket).
:::

- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Ein sicheres Kontextobjekt, wie von `tls.createSecureContext()` zurückgegeben
- `isServer` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, um anzugeben, dass diese TLS-Verbindung als Server geöffnet werden soll.
- `requestCert` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, um anzugeben, ob ein Server ein Zertifikat von einem sich verbindenden Client anfordern soll. Gilt nur, wenn `isServer` `true` ist.
- `rejectUnauthorized` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn nicht `false`, lehnt ein Server automatisch Clients mit ungültigen Zertifikaten ab. Gilt nur, wenn `isServer` `true` ist.
- `options`
    - `enableTrace`: Siehe [`tls.createServer()`](/de/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `secureContext`: Ein TLS-Kontextobjekt von [`tls.createSecureContext()`](/de/nodejs/api/tls#tlscreatesecurecontextoptions)
    - `isServer`: Wenn `true`, wird der TLS-Socket im Server-Modus instanziiert. **Standard:** `false`.
    - `server` [\<net.Server\>](/de/nodejs/api/net#class-netserver) Eine [`net.Server`](/de/nodejs/api/net#class-netserver)-Instanz
    - `requestCert`: Siehe [`tls.createServer()`](/de/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `rejectUnauthorized`: Siehe [`tls.createServer()`](/de/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `ALPNProtocols`: Siehe [`tls.createServer()`](/de/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `SNICallback`: Siehe [`tls.createServer()`](/de/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `session` [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) Eine `Buffer`-Instanz, die eine TLS-Sitzung enthält.
    - `requestOCSP` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, gibt an, dass die OCSP-Statusanforderungserweiterung zum Client-Hallo hinzugefügt wird und ein `'OCSPResponse'`-Ereignis auf dem Socket ausgelöst wird, bevor eine sichere Kommunikation hergestellt wird.

Erstellt ein neues sicheres Paarobjekt mit zwei Streams, von denen einer die verschlüsselten Daten liest und schreibt und der andere die Klartextdaten liest und schreibt. Im Allgemeinen wird der verschlüsselte Stream zu/von einem eingehenden verschlüsselten Datenstrom geleitet und der Klartextstrom als Ersatz für den anfänglichen verschlüsselten Strom verwendet.

`tls.createSecurePair()` gibt ein `tls.SecurePair`-Objekt mit den Stream-Eigenschaften `cleartext` und `encrypted` zurück.

Die Verwendung von `cleartext` hat die gleiche API wie [`tls.TLSSocket`](/de/nodejs/api/tls#class-tlstlssocket).

Die Methode `tls.createSecurePair()` ist jetzt zugunsten von `tls.TLSSocket()` veraltet. Zum Beispiel kann der Code:

```js [ESM]
pair = tls.createSecurePair(/* ... */);
pair.encrypted.pipe(socket);
socket.pipe(pair.encrypted);
```
ersetzt werden durch:

```js [ESM]
secureSocket = tls.TLSSocket(socket, options);
```
wobei `secureSocket` die gleiche API wie `pair.cleartext` hat.


## `tls.createServer([options][, secureConnectionListener])` {#tlscreateserveroptions-secureconnectionlistener}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v22.4.0, v20.16.0 | Die Option `clientCertEngine` hängt von der Unterstützung benutzerdefinierter Engines in OpenSSL ab, die in OpenSSL 3 veraltet ist. |
| v19.0.0 | Wenn `ALPNProtocols` gesetzt ist, werden eingehende Verbindungen, die eine ALPN-Erweiterung ohne unterstützte Protokolle senden, mit einer fatalen `no_application_protocol`-Warnung beendet. |
| v20.4.0, v18.19.0 | Der Parameter `options` kann jetzt `ALPNCallback` enthalten. |
| v12.3.0 | Der Parameter `options` unterstützt jetzt `net.createServer()`-Optionen. |
| v9.3.0 | Der Parameter `options` kann jetzt `clientCertEngine` enthalten. |
| v8.0.0 | Die Option `ALPNProtocols` kann jetzt ein `TypedArray` oder `DataView` sein. |
| v5.0.0 | ALPN-Optionen werden jetzt unterstützt. |
| v0.3.2 | Hinzugefügt in: v0.3.2 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ALPNProtocols`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer[]\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Ein Array von Strings, `Buffer`s, `TypedArray`s oder `DataView`s, oder ein einzelner `Buffer`, `TypedArray` oder `DataView`, der die unterstützten ALPN-Protokolle enthält. `Buffer`s sollten das Format `[len][name][len][name]...` haben, z. B. `0x05hello0x05world`, wobei das erste Byte die Länge des nächsten Protokollnamens ist. Das Übergeben eines Arrays ist normalerweise viel einfacher, z. B. `['hello', 'world']`. (Protokolle sollten nach ihrer Priorität geordnet sein.)
    - `ALPNCallback`: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Wenn gesetzt, wird dies aufgerufen, wenn ein Client eine Verbindung unter Verwendung der ALPN-Erweiterung öffnet. Ein Argument wird an den Callback übergeben: ein Objekt, das die Felder `servername` und `protocols` enthält, die jeweils den Servernamen aus der SNI-Erweiterung (falls vorhanden) und ein Array von ALPN-Protokollnamen-Strings enthalten. Der Callback muss entweder einen der in `protocols` aufgeführten Strings zurückgeben, der an den Client als das ausgewählte ALPN-Protokoll zurückgegeben wird, oder `undefined`, um die Verbindung mit einer fatalen Warnung abzulehnen. Wenn ein String zurückgegeben wird, der nicht mit einem der ALPN-Protokolle des Clients übereinstimmt, wird ein Fehler ausgelöst. Diese Option kann nicht mit der Option `ALPNProtocols` verwendet werden, und das Setzen beider Optionen löst einen Fehler aus.
    - `clientCertEngine` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Name einer OpenSSL-Engine, die das Client-Zertifikat bereitstellen kann. **Veraltet.**
    - `enableTrace` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, wird [`tls.TLSSocket.enableTrace()`](/de/nodejs/api/tls#tlssocketenabletrace) für neue Verbindungen aufgerufen. Tracing kann aktiviert werden, nachdem die sichere Verbindung hergestellt wurde, aber diese Option muss verwendet werden, um den Aufbau der sicheren Verbindung zu verfolgen. **Standard:** `false`.
    - `handshakeTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Verbindung wird abgebrochen, wenn der SSL/TLS-Handshake nicht innerhalb der angegebenen Anzahl von Millisekunden abgeschlossen wird. Ein `'tlsClientError'` wird für das `tls.Server`-Objekt ausgelöst, wenn ein Handshake-Timeout auftritt. **Standard:** `120000` (120 Sekunden).
    - `rejectUnauthorized` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn nicht `false`, lehnt der Server jede Verbindung ab, die nicht mit der Liste der bereitgestellten CAs autorisiert ist. Diese Option hat nur eine Auswirkung, wenn `requestCert` `true` ist. **Standard:** `true`.
    - `requestCert` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Wenn `true`, fordert der Server ein Zertifikat von Clients an, die sich verbinden, und versucht, dieses Zertifikat zu verifizieren. **Standard:** `false`.
    - `sessionTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Die Anzahl der Sekunden, nach denen eine vom Server erstellte TLS-Sitzung nicht mehr wiederaufgenommen werden kann. Weitere Informationen finden Sie unter [Sitzungswiederaufnahme](/de/nodejs/api/tls#session-resumption). **Standard:** `300`.
    - `SNICallback(servername, callback)` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Eine Funktion, die aufgerufen wird, wenn der Client die SNI-TLS-Erweiterung unterstützt. Zwei Argumente werden beim Aufruf übergeben: `servername` und `callback`. `callback` ist ein Error-First-Callback, der zwei optionale Argumente entgegennimmt: `error` und `ctx`. `ctx`, falls bereitgestellt, ist eine `SecureContext`-Instanz. [`tls.createSecureContext()`](/de/nodejs/api/tls#tlscreatesecurecontextoptions) kann verwendet werden, um einen korrekten `SecureContext` zu erhalten. Wenn `callback` mit einem falschen `ctx`-Argument aufgerufen wird, wird der Standard-Secure-Context des Servers verwendet. Wenn `SNICallback` nicht bereitgestellt wurde, wird der Standard-Callback mit High-Level-API verwendet (siehe unten).
    - `ticketKeys`: [\<Buffer\>](/de/nodejs/api/buffer#class-buffer) 48 Byte kryptografisch starker pseudozufälliger Daten. Weitere Informationen finden Sie unter [Sitzungswiederaufnahme](/de/nodejs/api/tls#session-resumption).
    - `pskCallback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Für TLS-PSK-Verhandlungen siehe [Pre-Shared Keys](/de/nodejs/api/tls#pre-shared-keys).
    - `pskIdentityHint` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) optionaler Hinweis, der an einen Client gesendet werden soll, um bei der Auswahl der Identität während der TLS-PSK-Verhandlung zu helfen. Wird in TLS 1.3 ignoriert. Wenn das Festlegen von pskIdentityHint fehlschlägt, wird `'tlsClientError'` mit dem Code `'ERR_TLS_PSK_SET_IDENTITY_HINT_FAILED'` ausgelöst.
    - ...: Jede [`tls.createSecureContext()`](/de/nodejs/api/tls#tlscreatesecurecontextoptions)-Option kann bereitgestellt werden. Für Server sind die Identitätsoptionen (`pfx`, `key`/`cert` oder `pskCallback`) normalerweise erforderlich.
    - ...: Jede [`net.createServer()`](/de/nodejs/api/net#netcreateserveroptions-connectionlistener)-Option kann bereitgestellt werden.


- `secureConnectionListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Gibt zurück: [\<tls.Server\>](/de/nodejs/api/tls#class-tlsserver)

Erstellt einen neuen [`tls.Server`](/de/nodejs/api/tls#class-tlsserver). Der `secureConnectionListener` wird, falls angegeben, automatisch als Listener für das [`'secureConnection'`-Ereignis](/de/nodejs/api/tls#event-secureconnection) gesetzt.

Die Option `ticketKeys` wird automatisch zwischen den Worker-Threads des `node:cluster`-Moduls geteilt.

Das folgende Beispiel zeigt einen einfachen Echo-Server:

::: code-group
```js [ESM]
import { createServer } from 'node:tls';
import { readFileSync } from 'node:fs';

const options = {
  key: readFileSync('server-key.pem'),
  cert: readFileSync('server-cert.pem'),

  // Dies ist nur erforderlich, wenn die Client-Zertifikatsauthentifizierung verwendet wird.
  requestCert: true,

  // Dies ist nur erforderlich, wenn der Client ein selbstsigniertes Zertifikat verwendet.
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

  // Dies ist nur erforderlich, wenn die Client-Zertifikatsauthentifizierung verwendet wird.
  requestCert: true,

  // Dies ist nur erforderlich, wenn der Client ein selbstsigniertes Zertifikat verwendet.
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

Um das Zertifikat und den Schlüssel für dieses Beispiel zu generieren, führen Sie Folgendes aus:

```bash [BASH]
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
  -keyout server-key.pem -out server-cert.pem
```
Um dann das Zertifikat `client-cert.pem` für dieses Beispiel zu generieren, führen Sie Folgendes aus:

```bash [BASH]
openssl pkcs12 -certpbe AES-256-CBC -export -out client-cert.pem \
  -inkey server-key.pem -in server-cert.pem
```
Der Server kann getestet werden, indem man sich mit dem Beispiel-Client von [`tls.connect()`](/de/nodejs/api/tls#tlsconnectoptions-callback) mit ihm verbindet.


## `tls.getCiphers()` {#tlsgetciphers}

**Hinzugefügt in: v0.10.2**

- Gibt zurück: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Gibt ein Array mit den Namen der unterstützten TLS-Chiffren zurück. Die Namen sind aus historischen Gründen kleingeschrieben, müssen aber in Großbuchstaben geschrieben werden, um in der Option `ciphers` von [`tls.createSecureContext()`](/de/nodejs/api/tls#tlscreatesecurecontextoptions) verwendet zu werden.

Nicht alle unterstützten Chiffren sind standardmäßig aktiviert. Siehe [Ändern der standardmäßigen TLS-Cipher Suite](/de/nodejs/api/tls#modifying-the-default-tls-cipher-suite).

Chiffrennamen, die mit `'tls_'` beginnen, sind für TLSv1.3, alle anderen sind für TLSv1.2 und darunter.

```js [ESM]
console.log(tls.getCiphers()); // ['aes128-gcm-sha256', 'aes128-sha', ...]
```
## `tls.rootCertificates` {#tlsrootcertificates}

**Hinzugefügt in: v12.3.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Ein unveränderliches Array von Strings, das die Root-Zertifikate (im PEM-Format) aus dem mitgelieferten Mozilla CA-Store darstellt, wie sie von der aktuellen Node.js-Version bereitgestellt werden.

Der von Node.js mitgelieferte CA-Store ist ein Snapshot des Mozilla CA-Stores, der zum Zeitpunkt der Veröffentlichung festgelegt wird. Er ist auf allen unterstützten Plattformen identisch.

## `tls.DEFAULT_ECDH_CURVE` {#tlsdefault_ecdh_curve}


::: info [Verlauf]
| Version | Änderungen |
| --- | --- |
| v10.0.0 | Standardwert geändert in `'auto'`. |
| v0.11.13 | Hinzugefügt in: v0.11.13 |
:::

Der Standardkurvenname für die ECDH-Schlüsselvereinbarung in einem TLS-Server. Der Standardwert ist `'auto'`. Weitere Informationen finden Sie unter [`tls.createSecureContext()`](/de/nodejs/api/tls#tlscreatesecurecontextoptions).

## `tls.DEFAULT_MAX_VERSION` {#tlsdefault_max_version}

**Hinzugefügt in: v11.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der Standardwert der Option `maxVersion` von [`tls.createSecureContext()`](/de/nodejs/api/tls#tlscreatesecurecontextoptions). Er kann einer der unterstützten TLS-Protokollversionen zugewiesen werden: `'TLSv1.3'`, `'TLSv1.2'`, `'TLSv1.1'` oder `'TLSv1'`. **Standard:** `'TLSv1.3'`, sofern nicht über CLI-Optionen geändert. Die Verwendung von `--tls-max-v1.2` setzt den Standard auf `'TLSv1.2'`. Die Verwendung von `--tls-max-v1.3` setzt den Standard auf `'TLSv1.3'`. Wenn mehrere Optionen angegeben werden, wird das höchste Maximum verwendet.


## `tls.DEFAULT_MIN_VERSION` {#tlsdefault_min_version}

**Hinzugefügt in: v11.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der Standardwert der Option `minVersion` von [`tls.createSecureContext()`](/de/nodejs/api/tls#tlscreatesecurecontextoptions). Er kann einer der unterstützten TLS-Protokollversionen zugewiesen werden: `'TLSv1.3'`, `'TLSv1.2'`, `'TLSv1.1'` oder `'TLSv1'`. Versionen vor TLSv1.2 erfordern möglicherweise eine Herabstufung des [OpenSSL-Sicherheitslevels](/de/nodejs/api/tls#openssl-security-level). **Standard:** `'TLSv1.2'`, sofern nicht durch CLI-Optionen geändert. Die Verwendung von `--tls-min-v1.0` setzt den Standard auf `'TLSv1'`. Die Verwendung von `--tls-min-v1.1` setzt den Standard auf `'TLSv1.1'`. Die Verwendung von `--tls-min-v1.3` setzt den Standard auf `'TLSv1.3'`. Wenn mehrere Optionen angegeben werden, wird das niedrigste Minimum verwendet.

## `tls.DEFAULT_CIPHERS` {#tlsdefault_ciphers}

**Hinzugefügt in: v19.8.0, v18.16.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Der Standardwert der Option `ciphers` von [`tls.createSecureContext()`](/de/nodejs/api/tls#tlscreatesecurecontextoptions). Er kann einer der unterstützten OpenSSL-Ciphern zugewiesen werden. Standardmäßig ist dies der Inhalt von `crypto.constants.defaultCoreCipherList`, sofern nicht durch CLI-Optionen mit `--tls-default-ciphers` geändert.

