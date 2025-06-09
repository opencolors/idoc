---
title: Leistungsanalyse von Node.js-Anwendungen
description: Erfahren Sie, wie Sie den integrierten Node.js-Profilierer verwenden können, um Leistungsengpässe in Ihrer Anwendung zu identifizieren und ihre Leistung zu verbessern.
head:
  - - meta
    - name: og:title
      content: Leistungsanalyse von Node.js-Anwendungen | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Erfahren Sie, wie Sie den integrierten Node.js-Profilierer verwenden können, um Leistungsengpässe in Ihrer Anwendung zu identifizieren und ihre Leistung zu verbessern.
  - - meta
    - name: twitter:title
      content: Leistungsanalyse von Node.js-Anwendungen | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Erfahren Sie, wie Sie den integrierten Node.js-Profilierer verwenden können, um Leistungsengpässe in Ihrer Anwendung zu identifizieren und ihre Leistung zu verbessern.
---


# Node.js-Anwendungen profilieren

Es gibt viele Drittanbieter-Tools zur Profilierung von Node.js-Anwendungen, aber in vielen Fällen ist die einfachste Option die Verwendung des integrierten Profilers von Node.js. Der integrierte Profiler verwendet den [Profiler in V8](https://v8.dev/docs/profile), der den Stack in regelmäßigen Abständen während der Programmausführung abtastet. Er zeichnet die Ergebnisse dieser Stichproben zusammen mit wichtigen Optimierungsereignissen wie JIT-Kompilierungen als eine Reihe von Ticks auf:

```bash
code-creation,LazyCompile,0,0x2d5000a337a0,396,"bp native array.js:1153:16",0x289f644df68,~
code-creation,LazyCompile,0,0x2d5000a33940,716,"hasOwnProperty native v8natives.js:198:30",0x289f64438d0,~
code-creation,LazyCompile,0,0x2d5000a33c20,284,"ToName native runtime.js:549:16",0x289f643bb28,~
code-creation,Stub,2,0x2d5000a33d40,182,"DoubleToIStub"
code-creation,Stub,2,0x2d5000a33e00,507,"NumberToStringStub"
```
In der Vergangenheit benötigten Sie den V8-Quellcode, um die Ticks interpretieren zu können. Glücklicherweise wurden seit Node.js 4.4.0 Tools eingeführt, die die Nutzung dieser Informationen erleichtern, ohne V8 separat aus den Quellen zu erstellen. Sehen wir uns an, wie der integrierte Profiler Einblicke in die Anwendungsleistung geben kann.

Um die Verwendung des Tick-Profilers zu veranschaulichen, werden wir mit einer einfachen Express-Anwendung arbeiten. Unsere Anwendung hat zwei Handler, einen zum Hinzufügen neuer Benutzer zu unserem System:

```javascript
app.get('/newUser', (req, res) => {
  let username = req.query.username || '';
  const password = req.query.password || '';
  username = username.replace(/[!@#$%^&*]/g, '');
  if (!username || !password || users[username]) {
    return res.sendStatus(400);
  }
  const salt = crypto.randomBytes(128).toString('base64');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512');
  users[username] = { salt, hash };
  res.sendStatus(200);
});
```

und einen weiteren zur Validierung von Benutzerauthentifizierungsversuchen:

```javascript
app.get('/auth', (req, res) => {
  let username = req.query.username || '';
  const password = req.query.password || '';
  username = username.replace(/[!@#$%^&*]/g, '');
  if (!username || !password || !users[username]) {
    return res.sendStatus(400);
  }
  const { salt, hash } = users[username];
  const encryptHash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512');
  if (crypto.timingSafeEqual(hash, encryptHash)) {
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});
```

*Bitte beachten Sie, dass dies KEINE empfohlenen Handler für die Authentifizierung von Benutzern in Ihren Node.js-Anwendungen sind und nur zu Illustrationszwecken verwendet werden. Sie sollten im Allgemeinen nicht versuchen, Ihre eigenen kryptografischen Authentifizierungsmechanismen zu entwerfen. Es ist viel besser, bestehende, bewährte Authentifizierungslösungen zu verwenden.*

Nehmen wir nun an, dass wir unsere Anwendung bereitgestellt haben und sich Benutzer über hohe Latenzzeiten bei Anfragen beschweren. Wir können die App einfach mit dem integrierten Profiler ausführen:

```bash
NODE_ENV=production node --prof app.js
```

und den Server mit `ab` (ApacheBench) belasten:

```bash
curl -X GET "http://localhost:8080/newUser?username=matt&password=password"
ab -k -c 20 -n 250 "http://localhost:8080/auth?username=matt&password=password"
```

und eine ab-Ausgabe erhalten:

```bash
Concurrency Level:      20
Time taken for tests:   46.932 seconds
Complete requests:      250
Failed requests:        0
Keep-Alive requests:    250
Total transferred:      50250 bytes
HTML transferred:       500 bytes
Requests per second:    5.33 [#/sec] (mean)
Time per request:       3754.556 [ms] (mean)
Time per request:       187.728 [ms] (mean, across all concurrent requests)
Transfer rate:          1.05 [Kbytes/sec] received
...
Percentage of the requests served within a certain time (ms)
  50%   3755
  66%   3804
  75%   3818
  80%   3825
  90%   3845
  95%   3858
  98%   3874
  99%   3875
 100%   4225 (longest request)
```

Aus dieser Ausgabe sehen wir, dass wir es nur schaffen, etwa 5 Anfragen pro Sekunde zu bedienen und dass die durchschnittliche Anfrage knapp 4 Sekunden dauert. In einem realen Beispiel könnten wir viele Arbeiten in vielen Funktionen im Auftrag einer Benutzeranfrage ausführen, aber selbst in unserem einfachen Beispiel könnte Zeit durch das Kompilieren regulärer Ausdrücke, das Generieren zufälliger Salts, das Generieren eindeutiger Hashes aus Benutzerpasswörtern oder innerhalb des Express-Frameworks selbst verloren gehen.

Da wir unsere Anwendung mit der Option `--prof` ausgeführt haben, wurde eine Tick-Datei im selben Verzeichnis wie Ihre lokale Ausführung der Anwendung generiert. Sie sollte das Format `isolate-0xnnnnnnnnnnnn-v8.log` haben (wobei n eine Ziffer ist).

Um diese Datei zu interpretieren, müssen wir den im Node.js-Binary gebündelten Tick-Prozessor verwenden. Um den Prozessor auszuführen, verwenden Sie das Flag `--prof-process`:

```bash
node --prof-process isolate-0xnnnnnnnnnnnn-v8.log > processed.txt
```

Das Öffnen von processed.txt in Ihrem bevorzugten Texteditor liefert Ihnen verschiedene Arten von Informationen. Die Datei ist in Abschnitte unterteilt, die wiederum nach Sprache unterteilt sind. Zuerst sehen wir uns den Zusammenfassungsabschnitt an und sehen:

```bash
[Summary]:
   ticks  total  nonlib   name
     79    0.2%    0.2%  JavaScript
  36703   97.2%   99.2%  C++
      7    0.0%    0.0%  GC
    767    2.0%          Shared libraries
    215    0.6%          Unaccounted
```

Dies sagt uns, dass 97 % aller gesammelten Stichproben im C++-Code stattfanden und dass wir beim Betrachten anderer Abschnitte der verarbeiteten Ausgabe am meisten auf die in C++ geleistete Arbeit achten sollten (im Gegensatz zu JavaScript). Vor diesem Hintergrund finden wir als Nächstes den Abschnitt [C++], der Informationen darüber enthält, welche C++-Funktionen die meiste CPU-Zeit beanspruchen, und sehen:

```bash
 [C++]:
   ticks  total  nonlib   name
  19557   51.8%   52.9%  node::crypto::PBKDF2(v8::FunctionCallbackInfo<v8::Value> const&)
   4510   11.9%   12.2%  _sha1_block_data_order
   3165    8.4%    8.6%  _malloc_zone_malloc
```

Wir sehen, dass die obersten 3 Einträge 72,1 % der vom Programm benötigten CPU-Zeit ausmachen. Aus dieser Ausgabe sehen wir sofort, dass mindestens 51,8 % der CPU-Zeit von einer Funktion namens PBKDF2 beansprucht werden, was unserer Hash-Generierung aus dem Passwort eines Benutzers entspricht. Es ist jedoch möglicherweise nicht sofort ersichtlich, wie die unteren beiden Einträge in unsere Anwendung einfließen (oder wenn dies der Fall ist, werden wir aus Gründen der Veranschaulichung so tun, als wäre es nicht so). Um die Beziehung zwischen diesen Funktionen besser zu verstehen, werden wir uns als Nächstes den Abschnitt [Bottom up (heavy) profile] ansehen, der Informationen über die primären Aufrufer jeder Funktion enthält. Bei der Untersuchung dieses Abschnitts finden wir:

```bash
  ticks parent  name
  19557   51.8%  node::crypto::PBKDF2(v8::FunctionCallbackInfo<v8::Value> const&)
  19557  100.0%    v8::internal::Builtins::~Builtins()
  19557  100.0%      LazyCompile: ~pbkdf2 crypto.js:557:16
   4510   11.9%  _sha1_block_data_order
   4510  100.0%    LazyCompile: *pbkdf2 crypto.js:557:16
   4510  100.0%      LazyCompile: *exports.pbkdf2Sync crypto.js:552:30
   3165    8.4%  _malloc_zone_malloc
   3161   99.9%    LazyCompile: *pbkdf2 crypto.js:557:16
   3161  100.0%      LazyCompile: *exports.pbkdf2Sync crypto.js:552:30
```

Das Parsen dieses Abschnitts erfordert etwas mehr Arbeit als die Roh-Tick-Zahlen oben. Innerhalb jedes der oben genannten "Callstacks" gibt der Prozentsatz in der Spalte "parent" den Prozentsatz der Stichproben an, für die die Funktion in der Zeile darüber von der Funktion in der aktuellen Zeile aufgerufen wurde. Zum Beispiel sehen wir im mittleren "Callstack" oben für `_sha1_block_data_order`, dass `_sha1_block_data_order` in 11,9 % der Stichproben vorkam, was wir aus den Roh-Zahlen oben wussten. Hier können wir jedoch auch feststellen, dass es immer von der pbkdf2-Funktion innerhalb des Node.js-Kryptomoduls aufgerufen wurde. Wir sehen, dass _malloc_zone_malloc fast ausschließlich von derselben pbkdf2-Funktion aufgerufen wurde. Somit können wir anhand der Informationen in dieser Ansicht erkennen, dass unsere Hash-Berechnung aus dem Passwort des Benutzers nicht nur die 51,8 % von oben ausmacht, sondern auch die gesamte CPU-Zeit in den drei am häufigsten abgetasteten Funktionen, da die Aufrufe von `_sha1_block_data_order` und `_malloc_zone_malloc` im Auftrag der pbkdf2-Funktion erfolgten.

An diesem Punkt ist sehr deutlich, dass die passwortbasierte Hash-Generierung das Ziel unserer Optimierung sein sollte. Glücklicherweise haben Sie die [Vorteile der asynchronen Programmierung](https://nodesource.com/blog/why-asynchronous) vollständig verinnerlicht und erkennen, dass die Arbeit zur Generierung eines Hash aus dem Passwort des Benutzers auf synchrone Weise erledigt wird und somit die Ereignisschleife blockiert. Dies hindert uns daran, während der Berechnung eines Hash an anderen eingehenden Anfragen zu arbeiten.

Um dieses Problem zu beheben, nehmen Sie eine kleine Änderung an den oben genannten Handlern vor, um die asynchrone Version der pbkdf2-Funktion zu verwenden:

```javascript
app.get('/auth', (req, res) => {
  let username = req.query.username || '';
  const password = req.query.password || '';
  username = username.replace(/[!@#$%^&*]/g, '');
  if (!username || !password || !users[username]) {
    return res.sendStatus(400);
  }
  crypto.pbkdf2(
    password,
    users[username].salt,
    10000,
    512,
    'sha512',
    (err, hash) => {
      if (users[username].hash.toString() === hash.toString()) {
        res.sendStatus(200);
      } else {
        res.sendStatus(401);
      }
    }
  );
});
```

Eine neue Ausführung des obigen AB-Benchmarks mit der asynchronen Version Ihrer App ergibt:

```bash
Concurrency Level:      20
Time taken for tests:   12.846 seconds
Complete requests:      250
Failed requests:        0
Keep-Alive requests:    250
Total transferred:      50250 bytes
HTML transferred:       500 bytes
Requests per second:    19.46 [#/sec] (mean)
Time per request:       1027.689 [ms] (mean)
Time per request:       51.384 [ms] (mean, across all concurrent requests)
Transfer rate:          3.82 [Kbytes/sec] received
...
Percentage of the requests served within a certain time (ms)
  50%   1018
  66%   1035
  75%   1041
  80%   1043
  90%   1049
  95%   1063
  98%   1070
  99%   1071
 100%   1079 (longest request)
```

Juhu! Ihre App bedient jetzt etwa 20 Anfragen pro Sekunde, ungefähr 4-mal mehr als mit der synchronen Hash-Generierung. Zusätzlich ist die durchschnittliche Latenz von den vorherigen 4 Sekunden auf knapp über 1 Sekunde gesunken.

Hoffentlich haben Sie anhand der Leistungsuntersuchung dieses (zugegebenermaßen konstruierten) Beispiels gesehen, wie der V8-Tick-Prozessor Ihnen helfen kann, ein besseres Verständnis der Leistung Ihrer Node.js-Anwendungen zu erlangen.

Sie finden möglicherweise auch [Wie man ein Flame Graph erstellt hilfreich](/de/nodejs/guide/flame-graphs).

