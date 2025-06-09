---
title: Sicherheitsbest Practices für Node.js-Anwendungen
description: Ein umfassender Leitfaden zur Sicherung von Node.js-Anwendungen, der die Bedrohungsmodellierung, die besten Praktiken und die Abmilderung von häufigen Schwachstellen wie Denial of Service, DNS-Rebinding und Offenlegung von sensiblen Informationen abdeckt.
head:
  - - meta
    - name: og:title
      content: Sicherheitsbest Practices für Node.js-Anwendungen | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Ein umfassender Leitfaden zur Sicherung von Node.js-Anwendungen, der die Bedrohungsmodellierung, die besten Praktiken und die Abmilderung von häufigen Schwachstellen wie Denial of Service, DNS-Rebinding und Offenlegung von sensiblen Informationen abdeckt.
  - - meta
    - name: twitter:title
      content: Sicherheitsbest Practices für Node.js-Anwendungen | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Ein umfassender Leitfaden zur Sicherung von Node.js-Anwendungen, der die Bedrohungsmodellierung, die besten Praktiken und die Abmilderung von häufigen Schwachstellen wie Denial of Service, DNS-Rebinding und Offenlegung von sensiblen Informationen abdeckt.
---


# Sicherheits-Best Practices

### Absicht

Dieses Dokument soll das aktuelle [Bedrohungsmodell](/de/nodejs/guide/security-best-practices#threat-model) erweitern und umfassende Richtlinien zur Absicherung einer Node.js-Anwendung bereitstellen.

## Dokumentinhalt

- Best Practices: Eine vereinfachte, komprimierte Darstellung der Best Practices. Wir können [dieses Issue](https://github.com/nodejs/security-wg/issues/488) oder [diese Richtlinie](https://github.com/goldbergyoni/nodebestpractices) als Ausgangspunkt verwenden. Es ist wichtig zu beachten, dass dieses Dokument spezifisch für Node.js ist. Wenn Sie etwas Breiteres suchen, sollten Sie [OSSF Best Practices](https://github.com/ossf/wg-best-practices-os-developers) in Betracht ziehen.
- Erklärte Angriffe: Veranschaulichung und Dokumentation in einfachem Deutsch mit einigen Codebeispielen (wenn möglich) der Angriffe, die wir im Bedrohungsmodell erwähnen.
- Bibliotheken von Drittanbietern: Definition von Bedrohungen (Typosquatting-Angriffe, schädliche Pakete...) und Best Practices in Bezug auf Node-Module-Abhängigkeiten usw.

## Bedrohungsliste

### Denial of Service des HTTP-Servers (CWE-400)

Dies ist ein Angriff, bei dem die Anwendung für den Zweck, für den sie entwickelt wurde, nicht mehr verfügbar ist, da eingehende HTTP-Anfragen auf eine bestimmte Weise verarbeitet werden. Diese Anfragen müssen nicht unbedingt von einem böswilligen Akteur gezielt erstellt werden: Ein falsch konfigurierter oder fehlerhafter Client kann dem Server auch ein Anfrage Muster senden, das zu einem Denial of Service führt.

HTTP-Anfragen werden vom Node.js HTTP-Server empfangen und über den registrierten Anfrage Handler an den Anwendungscode übergeben. Der Server analysiert den Inhalt des Anfragekörpers nicht. Daher ist jeder DoS, der durch den Inhalt des Körpers verursacht wird, nachdem dieser an den Anfrage Handler übergeben wurde, keine Schwachstelle in Node.js selbst, da es in der Verantwortung des Anwendungscodes liegt, ihn korrekt zu behandeln.

Stellen Sie sicher, dass der Webserver Socket-Fehler ordnungsgemäß behandelt, z. B. wenn ein Server ohne Fehler Handler erstellt wird, ist er anfällig für DoS.

```javascript
import net from 'node:net'
const server = net.createServer(socket => {
  // socket.on('error', console.error) // this prevents the server to crash
  socket.write('Echo server\r\n')
  socket.pipe(socket)
})
server.listen(5000, '0.0.0.0')
```

_Wenn eine fehlerhafte Anfrage gestellt wird, kann der Server abstürzen._

Ein Beispiel für einen DoS-Angriff, der nicht durch den Inhalt der Anfrage verursacht wird, ist Slowloris. Bei diesem Angriff werden HTTP-Anfragen langsam und fragmentiert, ein Fragment nach dem anderen, gesendet. Bis die vollständige Anfrage zugestellt ist, hält der Server Ressourcen für die laufende Anfrage bereit. Wenn genügend dieser Anfragen gleichzeitig gesendet werden, erreicht die Anzahl der gleichzeitigen Verbindungen bald ihr Maximum, was zu einem Denial of Service führt. Auf diese Weise hängt der Angriff nicht vom Inhalt der Anfrage ab, sondern vom Timing und Muster der Anfragen, die an den Server gesendet werden.


#### Abhilfen

- Verwenden Sie einen Reverse-Proxy, um Anfragen entgegenzunehmen und an die Node.js-Anwendung weiterzuleiten. Reverse-Proxies können Caching, Load Balancing, IP-Blacklisting usw. bereitstellen, was die Wahrscheinlichkeit verringert, dass ein DoS-Angriff wirksam ist.
- Konfigurieren Sie die Server-Timeouts korrekt, sodass Verbindungen, die inaktiv sind oder bei denen Anfragen zu langsam eintreffen, verworfen werden können. Beachten Sie die verschiedenen Timeouts in `http.Server`, insbesondere `headersTimeout`, `requestTimeout`, `timeout` und `keepAliveTimeout`.
- Begrenzen Sie die Anzahl offener Sockets pro Host und insgesamt. Siehe die [http-Dokumentation](/de/nodejs/api/http), insbesondere `agent.maxSockets`, `agent.maxTotalSockets`, `agent.maxFreeSockets` und `server.maxRequestsPerSocket`.

### DNS-Rebinding (CWE-346)

Dies ist ein Angriff, der auf Node.js-Anwendungen abzielen kann, die mit aktiviertem Debugging-Inspector unter Verwendung des Schalters [--inspect](/de/nodejs/guide/debugging-nodejs) ausgeführt werden.

Da Websites, die in einem Webbrowser geöffnet werden, WebSocket- und HTTP-Anfragen stellen können, können sie auf den lokal ausgeführten Debugging-Inspector abzielen. Dies wird normalerweise durch die [Same-Origin-Policy](/de/nodejs/guide/debugging-nodejs) verhindert, die von modernen Browsern implementiert wird und die Skripten verbietet, Ressourcen von verschiedenen Ursprüngen zu erreichen (d. h. eine bösartige Website kann keine Daten lesen, die von einer lokalen IP-Adresse angefordert werden).

Durch DNS-Rebinding kann ein Angreifer jedoch vorübergehend den Ursprung seiner Anfragen kontrollieren, sodass es so aussieht, als würden sie von einer lokalen IP-Adresse stammen. Dies geschieht durch die Kontrolle sowohl einer Website als auch des DNS-Servers, der zum Auflösen ihrer IP-Adresse verwendet wird. Weitere Informationen finden Sie im [DNS Rebinding Wiki](https://en.wikipedia.org/wiki/DNS_rebinding).

#### Abhilfen

- Deaktivieren Sie den Inspector beim SIGUSR1-Signal, indem Sie einen `process.on('SIGUSR1', ...)`-Listener daran anhängen.
- Führen Sie das Inspector-Protokoll nicht in der Produktion aus.

### Offenlegung sensibler Informationen an einen unbefugten Akteur (CWE-552)

Alle im aktuellen Verzeichnis enthaltenen Dateien und Ordner werden während der Paketveröffentlichung an die npm-Registry übertragen.

Es gibt einige Mechanismen, um dieses Verhalten zu steuern, indem eine Sperrliste mit `.npmignore` und `.gitignore` definiert wird oder indem eine Zulassungsliste in der `package.json` definiert wird.


#### Gegenmaßnahmen

- Verwenden Sie `npm publish --dry-run`, um alle zu veröffentlichenden Dateien aufzulisten. Stellen Sie sicher, dass Sie den Inhalt überprüfen, bevor Sie das Paket veröffentlichen.
- Es ist auch wichtig, Ignorierdateien wie `.gitignore` und `.npmignore` zu erstellen und zu pflegen. In diesen Dateien können Sie festlegen, welche Dateien/Ordner nicht veröffentlicht werden sollen. Die [Eigenschaft files](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#files) in `package.json` ermöglicht die inverse Operation `-- allowed` list.
- Stellen Sie im Falle einer Gefährdung sicher, dass Sie das [Paket unveröffentlichen](https://docs.npmjs.com/unpublishing-packages-from-the-registry).

### HTTP Request Smuggling (CWE-444)

Dies ist ein Angriff, bei dem zwei HTTP-Server beteiligt sind (normalerweise ein Proxy und eine Node.js-Anwendung). Ein Client sendet eine HTTP-Anfrage, die zuerst über den Front-End-Server (den Proxy) läuft und dann an den Back-End-Server (die Anwendung) weitergeleitet wird. Wenn das Front-End und das Back-End mehrdeutige HTTP-Anfragen unterschiedlich interpretieren, besteht die Möglichkeit, dass ein Angreifer eine bösartige Nachricht sendet, die vom Front-End nicht gesehen wird, aber vom Back-End gesehen wird, wodurch sie effektiv am Proxy-Server "vorbeigeschmuggelt" wird.

Weitere Details und Beispiele finden Sie unter [CWE-444](https://cwe.mitre.org/data/definitions/444.html).

Da dieser Angriff davon abhängt, dass Node.js HTTP-Anfragen anders interpretiert als ein (beliebiger) HTTP-Server, kann ein erfolgreicher Angriff auf eine Schwachstelle in Node.js, dem Front-End-Server oder beidem zurückzuführen sein. Wenn die Art und Weise, wie die Anfrage von Node.js interpretiert wird, mit der HTTP-Spezifikation übereinstimmt (siehe [RFC7230](https://datatracker.ietf.org/doc/html/rfc7230#section-3)), wird dies nicht als Schwachstelle in Node.js betrachtet.

#### Gegenmaßnahmen

- Verwenden Sie die Option `insecureHTTPParser` nicht, wenn Sie einen HTTP-Server erstellen.
- Konfigurieren Sie den Front-End-Server, um mehrdeutige Anfragen zu normalisieren.
- Überwachen Sie kontinuierlich auf neue HTTP Request Smuggling-Schwachstellen sowohl in Node.js als auch im Front-End-Server Ihrer Wahl.
- Verwenden Sie HTTP/2 durchgehend und deaktivieren Sie wenn möglich das HTTP-Downgrading.


### Informationsweitergabe durch Timing-Angriffe (CWE-208)

Dies ist ein Angriff, der es dem Angreifer ermöglicht, potenziell sensible Informationen zu erhalten, indem er beispielsweise misst, wie lange es dauert, bis die Anwendung auf eine Anfrage reagiert. Dieser Angriff ist nicht spezifisch für Node.js und kann auf fast alle Laufzeitumgebungen abzielen.

Der Angriff ist möglich, wenn die Anwendung ein Geheimnis in einer zeitkritischen Operation (z. B. Verzweigung) verwendet. Betrachten Sie die Authentifizierung in einer typischen Anwendung. Hier beinhaltet eine einfache Authentifizierungsmethode E-Mail und Passwort als Anmeldedaten. Benutzerinformationen werden aus der Eingabe des Benutzers abgerufen, idealerweise aus einem DBMS. Nach dem Abrufen der Benutzerinformationen wird das Passwort mit den aus der Datenbank abgerufenen Benutzerinformationen verglichen. Die Verwendung des eingebauten Zeichenkettenvergleichs dauert für gleich lange Werte länger. Dieser Vergleich erhöht unfreiwillig die Antwortzeit der Anfrage, wenn er für eine akzeptable Zeit ausgeführt wird. Durch den Vergleich der Antwortzeiten der Anfragen kann ein Angreifer die Länge und den Wert des Passworts in einer großen Anzahl von Anfragen erraten.

#### Abschwächungen

- Die Crypto-API stellt eine Funktion `timingSafeEqual` bereit, um tatsächliche und erwartete sensible Werte mit einem Constant-Time-Algorithmus zu vergleichen.
- Für den Passwortvergleich können Sie das [Scrypt](/de/nodejs/api/crypto) verwenden, das auch im nativen Crypto-Modul verfügbar ist.
- Vermeiden Sie generell die Verwendung von Geheimnissen in Operationen mit variabler Zeit. Dies schließt die Verzweigung von Geheimnissen ein und, wenn sich der Angreifer in derselben Infrastruktur befindet (z. B. auf derselben Cloud-Maschine), die Verwendung eines Geheimnisses als Index in den Speicher. Das Schreiben von Constant-Time-Code in JavaScript ist schwierig (teilweise aufgrund des JIT). Verwenden Sie für Krypto-Anwendungen die eingebauten Krypto-APIs oder WebAssembly (für Algorithmen, die nicht nativ implementiert sind).

### Bösartige Drittanbietermodule (CWE-1357)

Derzeit kann in Node.js jedes Paket auf leistungsstarke Ressourcen wie den Netzwerkzugriff zugreifen. Da sie außerdem Zugriff auf das Dateisystem haben, können sie alle Daten überallhin senden.

Jeder Code, der in einem Node-Prozess ausgeführt wird, hat die Möglichkeit, zusätzlichen beliebigen Code zu laden und auszuführen, indem er `eval()` (oder dessen Äquivalente) verwendet. Jeder Code mit Schreibzugriff auf das Dateisystem kann dasselbe erreichen, indem er in neue oder vorhandene Dateien schreibt, die geladen werden.

Node.js verfügt über einen experimentellen¹ [Richtlinienmechanismus](/de/nodejs/api/permissions), um die geladene Ressource als nicht vertrauenswürdig oder vertrauenswürdig zu deklarieren. Diese Richtlinie ist jedoch standardmäßig nicht aktiviert. Stellen Sie sicher, dass Sie Abhängigkeitsversionen festlegen und automatische Überprüfungen auf Schwachstellen mithilfe gängiger Workflows oder npm-Skripte durchführen. Bevor Sie ein Paket installieren, stellen Sie sicher, dass dieses Paket gepflegt wird und alle Inhalte enthält, die Sie erwartet haben. Seien Sie vorsichtig, der GitHub-Quellcode ist nicht immer derselbe wie der veröffentlichte, validieren Sie ihn in den `node_modules`.


#### Lieferkettenangriffe

Ein Lieferkettenangriff auf eine Node.js-Anwendung erfolgt, wenn eine ihrer Abhängigkeiten (direkte oder transitive) kompromittiert wird. Dies kann entweder dadurch geschehen, dass die Anwendung bei der Spezifikation der Abhängigkeiten zu nachlässig ist (was unerwünschte Aktualisierungen ermöglicht) und/oder aufgrund häufiger Tippfehler in der Spezifikation (anfällig für [Typosquatting](https://en.wikipedia.org/wiki/Typosquatting)).

Ein Angreifer, der die Kontrolle über ein Upstream-Paket übernimmt, kann eine neue Version mit bösartigem Code veröffentlichen. Wenn eine Node.js-Anwendung von diesem Paket abhängt, ohne genau festzulegen, welche Version sicher zu verwenden ist, kann das Paket automatisch auf die neueste bösartige Version aktualisiert werden, wodurch die Anwendung kompromittiert wird.

In der Datei `package.json` angegebene Abhängigkeiten können eine exakte Versionsnummer oder einen Bereich haben. Wenn jedoch eine Abhängigkeit an eine exakte Version gebunden wird, werden ihre transitiven Abhängigkeiten nicht selbst gebunden. Dies macht die Anwendung weiterhin anfällig für unerwünschte/unerwartete Aktualisierungen.

Mögliche Angriffsvektoren:

- Typosquatting-Angriffe
- Lockfile-Vergiftung
- Kompromittierte Maintainer
- Bösartige Pakete
- Dependency Confusion

##### Abschwächungen

- Verhindern Sie, dass npm beliebige Skripte mit `--ignore-scripts` ausführt.
  - Zusätzlich können Sie dies global mit `npm config set ignore-scripts true` deaktivieren.
- Fixieren Sie Abhängigkeitsversionen auf eine bestimmte unveränderliche Version, nicht auf eine Version, die ein Bereich ist oder aus einer veränderlichen Quelle stammt.
- Verwenden Sie Lockfiles, die jede Abhängigkeit (direkt und transitiv) fixieren.
  - Verwenden Sie [Maßnahmen zur Abmilderung von Lockfile-Vergiftungen](https://blog.ulisesgascon.com/lockfile-posioned).
- Automatisieren Sie die Überprüfung auf neue Schwachstellen mithilfe von CI mit Tools wie [npm-audit](https://www.npmjs.com/package/npm-audit).
  - Tools wie `Socket` können verwendet werden, um Pakete mit statischer Analyse zu analysieren, um riskantes Verhalten wie Netzwerk- oder Dateisystemzugriff zu finden.
- Verwenden Sie `npm ci` anstelle von `npm install`. Dies erzwingt die Lockfile, so dass Inkonsistenzen zwischen ihr und der Datei `package.json` einen Fehler verursachen (anstatt die Lockfile zugunsten von `package.json` stillschweigend zu ignorieren).
- Überprüfen Sie die Datei `package.json` sorgfältig auf Fehler/Tippfehler in den Namen der Abhängigkeiten.


### Memory Access Violation (CWE-284)

Speicherbasierte oder Heap-basierte Angriffe hängen von einer Kombination aus Fehlern im Speichermanagement und einem ausnutzbaren Speicherallokator ab. Wie alle Runtimes ist auch Node.js anfällig für diese Angriffe, wenn Ihre Projekte auf einem gemeinsam genutzten Rechner laufen. Die Verwendung eines sicheren Heaps ist nützlich, um zu verhindern, dass sensible Informationen aufgrund von Pointer-Über- und Unterläufen durchsickern.

Leider ist ein sicherer Heap unter Windows nicht verfügbar. Weitere Informationen finden Sie in der Node.js [secure-heap Dokumentation](/de/nodejs/api/cli).

#### Gegenmaßnahmen

- Verwenden Sie `--secure-heap=n` je nach Ihrer Anwendung, wobei n die maximal zugewiesene Byte-Größe ist.
- Führen Sie Ihre Produktionsanwendung nicht auf einem gemeinsam genutzten Rechner aus.

### Monkey Patching (CWE-349)

Monkey Patching bezieht sich auf die Modifikation von Eigenschaften zur Laufzeit, um das bestehende Verhalten zu ändern. Beispiel:

```js
// eslint-disable-next-line no-extend-native
Array.prototype.push = function (item) {
  // overriding the global [].push
}
```

#### Gegenmaßnahmen

Das Flag `--frozen-intrinsics` aktiviert experimentelle¹ eingefrorene Intrinsics, was bedeutet, dass alle eingebauten JavaScript-Objekte und -Funktionen rekursiv eingefroren werden. Daher überschreibt der folgende Code-Snippet nicht das Standardverhalten von `Array.prototype.push`

```js
// eslint-disable-next-line no-extend-native
Array.prototype.push = function (item) {
  // overriding the global [].push
}
// Uncaught:
// TypeError <Object <Object <[Object: null prototype] {}>>>:
// Cannot assign to read only property 'push' of object '
```

Es ist jedoch wichtig zu erwähnen, dass Sie immer noch neue Globals definieren und bestehende Globals mit `globalThis` ersetzen können.

```bash
globalThis.foo = 3; foo; // you can still define new globals 3
globalThis.Array = 4; Array; // However, you can also replace existing globals 4
```

Daher kann `Object.freeze(globalThis)` verwendet werden, um zu garantieren, dass keine Globals ersetzt werden.

### Prototype Pollution Attacks (CWE-1321)

Prototype Pollution bezieht sich auf die Möglichkeit, Eigenschaften in Javascript-Sprachelemente zu modifizieren oder einzufügen, indem die Verwendung von \__proto_, \_constructor, prototype und anderen Eigenschaften, die von eingebauten Prototypen geerbt werden, missbraucht wird.

```js
const a = { a: 1, b: 2 }
const data = JSON.parse('{"__proto__": { "polluted": true}}')
const c = Object.assign({}, a, data)
console.log(c.polluted) // true
// Potential DoS
const data2 = JSON.parse('{"__proto__": null}')
const d = Object.assign(a, data2)
d.hasOwnProperty('b') // Uncaught TypeError: d.hasOwnProperty is not a function
```

Dies ist eine potenzielle Schwachstelle, die von der JavaScript-Sprache geerbt wird.


#### Beispiele

- [CVE-2022-21824](https://www.cvedetails.com/cve/CVE-2022-21824/) (Node.js)
- [CVE-2018-3721](https://www.cvedetails.com/cve/CVE-2018-3721/) (Bibliothek von Drittanbietern: Lodash)

#### Schutzmaßnahmen

- Vermeiden Sie [unsichere rekursive Zusammenführungen](https://gist.github.com/DaniAkash/b3d7159fddcff0a9ee035bd10e34b277#file-unsafe-merge-js), siehe [CVE-2018-16487](https://www.cve.org/CVERecord?id=CVE-2018-16487).
- Implementieren Sie JSON-Schema-Validierungen für externe/nicht vertrauenswürdige Anfragen.
- Erstellen Sie Objekte ohne Prototyp mit `Object.create(null)`.
- Einfrieren des Prototyps: `Object.freeze(MyObject.prototype)`.
- Deaktivieren Sie die Eigenschaft `Object.prototype.__proto__` mit dem Flag `--disable-proto`.
- Überprüfen Sie, ob die Eigenschaft direkt im Objekt vorhanden ist und nicht aus dem Prototyp stammt, indem Sie `Object.hasOwn(obj, keyFromObj)` verwenden.
- Vermeiden Sie die Verwendung von Methoden aus `Object.prototype`.

### Unkontrolliertes Suchpfadelement (CWE-427)

Node.js lädt Module gemäß dem [Modulauflösungsalgorithmus](/de/nodejs/api/modules). Daher wird davon ausgegangen, dass das Verzeichnis, in dem ein Modul angefordert wird (require), vertrauenswürdig ist.

Dies bedeutet, dass folgendes Anwendungsverhalten erwartet wird. Angenommen, die folgende Verzeichnisstruktur:

- app/
  - server.js
  - auth.js
  - auth

Wenn server.js `require('./auth')` verwendet, wird dem Modulauflösungsalgorithmus gefolgt und auth anstelle von `auth.js` geladen.

#### Schutzmaßnahmen

Die Verwendung des experimentellen¹ [Richtlinienmechanismus mit Integritätsprüfung](/de/nodejs/api/permissions) kann die oben genannte Bedrohung vermeiden. Für das oben beschriebene Verzeichnis kann folgende `policy.json` verwendet werden:

```json
{
  "resources": {
    "./app/auth.js": {
      "integrity": "sha256-iuGZ6SFVFpMuHUcJciQTIKpIyaQVigMZlvg9Lx66HV8="
    },
    "./app/server.js": {
      "dependencies": {
        "./auth": "./app/auth.js"
      },
      "integrity": "sha256-NPtLCQ0ntPPWgfVEgX46ryTNpdvTWdQPoZO3kHo0bKI="
    }
  }
}
```

Wenn also das Auth-Modul angefordert wird, validiert das System die Integrität und gibt einen Fehler aus, wenn sie nicht mit der erwarteten übereinstimmt.

```bash
» node --experimental-policy=policy.json app/server.js
node:internal/policy/sri:65
      throw new ERR_SRI_PARSE(str, str[prevIndex], prevIndex);
      ^
SyntaxError [ERR_SRI_PARSE]: Subresource Integrity string "sha256-iuGZ6SFVFpMuHUcJciQTIKpIyaQVigMZlvg9Lx66HV8=%" had an unexpected "%" at position 51
    at new NodeError (node:internal/errors:393:5)
    at Object.parse (node:internal/policy/sri:65:13)
    at processEntry (node:internal/policy/manifest:581:38)
    at Manifest.assertIntegrity (node:internal/policy/manifest:588:32)
    at Module._compile (node:internal/modules/cjs/loader:1119:21)
    at Module._extensions..js (node:internal/modules/cjs/loader:1213:10)
    at Module.load (node:internal/modules/cjs/loader:1037:32)
    at Module._load (node:internal/modules/cjs/loader:878:12)
    at Module.require (node:internal/modules/cjs/loader:1061:19)
    at require (node:internal/modules/cjs/helpers:99:18) {
  code: 'ERR_SRI_PARSE'
}
```

Beachten Sie, dass die Verwendung von `--policy-integrity` immer empfohlen wird, um Richtlinienmutationen zu vermeiden.


## Experimentelle Funktionen in der Produktion

Die Verwendung experimenteller Funktionen in der Produktion wird nicht empfohlen. Experimentelle Funktionen können bei Bedarf grundlegende Änderungen erfahren, und ihre Funktionalität ist nicht sicher stabil. Feedback wird jedoch sehr geschätzt.

## OpenSSF-Tools

Die [OpenSSF](https://www.openssf.org) leitet mehrere Initiativen, die sehr nützlich sein können, insbesondere wenn Sie planen, ein npm-Paket zu veröffentlichen. Diese Initiativen umfassen:

- [OpenSSF Scorecard](https://securityscorecards.dev/) Scorecard bewertet Open-Source-Projekte anhand einer Reihe automatisierter Sicherheitsrisikoprüfungen. Sie können sie verwenden, um Schwachstellen und Abhängigkeiten in Ihrer Codebasis proaktiv zu bewerten und fundierte Entscheidungen über die Akzeptanz von Schwachstellen zu treffen.
- [OpenSSF Best Practices Badge Program](https://bestpractices.coreinfrastructure.org/en) Projekte können sich freiwillig selbst zertifizieren, indem sie beschreiben, wie sie jede Best Practice einhalten. Dies generiert ein Badge, das dem Projekt hinzugefügt werden kann.

