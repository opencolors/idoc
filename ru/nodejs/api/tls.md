---
title: Документация Node.js - TLS (Безопасность транспортного уровня)
description: Этот раздел документации Node.js охватывает модуль TLS (Безопасность транспортного уровня), который предоставляет реализацию протоколов TLS и SSL. Включает детали по созданию безопасных соединений, управлению сертификатами, обработке безопасной коммуникации и различные опции для настройки TLS/SSL в приложениях Node.js.
head:
  - - meta
    - name: og:title
      content: Документация Node.js - TLS (Безопасность транспортного уровня) | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Этот раздел документации Node.js охватывает модуль TLS (Безопасность транспортного уровня), который предоставляет реализацию протоколов TLS и SSL. Включает детали по созданию безопасных соединений, управлению сертификатами, обработке безопасной коммуникации и различные опции для настройки TLS/SSL в приложениях Node.js.
  - - meta
    - name: twitter:title
      content: Документация Node.js - TLS (Безопасность транспортного уровня) | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Этот раздел документации Node.js охватывает модуль TLS (Безопасность транспортного уровня), который предоставляет реализацию протоколов TLS и SSL. Включает детали по созданию безопасных соединений, управлению сертификатами, обработке безопасной коммуникации и различные опции для настройки TLS/SSL в приложениях Node.js.
---


# TLS (SSL) {#tls-ssl}

::: tip [Stable: 2 - Stable]
[Stable: 2](/ru/nodejs/api/documentation#stability-index) [Stability: 2](/ru/nodejs/api/documentation#stability-index) - Stable
:::

**Source Code:** [lib/tls.js](https://github.com/nodejs/node/blob/v23.5.0/lib/tls.js)

Модуль `node:tls` предоставляет реализацию протоколов Transport Layer Security (TLS) и Secure Socket Layer (SSL), построенную на базе OpenSSL. Доступ к модулю можно получить, используя:

::: code-group
```js [ESM]
import tls from 'node:tls';
```

```js [CJS]
const tls = require('node:tls');
```
:::

## Определение недоступности криптографической поддержки {#determining-if-crypto-support-is-unavailable}

Возможно, что Node.js собран без поддержки модуля `node:crypto`. В таких случаях попытка `import` из `tls` или вызов `require('node:tls')` приведет к выбросу ошибки.

При использовании CommonJS, выброшенную ошибку можно перехватить с помощью try/catch:

```js [CJS]
let tls;
try {
  tls = require('node:tls');
} catch (err) {
  console.error('tls support is disabled!');
}
```
При использовании лексического ключевого слова ESM `import`, ошибку можно перехватить только в том случае, если обработчик для `process.on('uncaughtException')` зарегистрирован *до* любой попытки загрузки модуля (например, с помощью модуля предварительной загрузки).

При использовании ESM, если есть вероятность того, что код может быть запущен на сборке Node.js, где криптографическая поддержка не включена, рассмотрите возможность использования функции [`import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) вместо лексического ключевого слова `import`:

```js [ESM]
let tls;
try {
  tls = await import('node:tls');
} catch (err) {
  console.error('tls support is disabled!');
}
```
## Концепции TLS/SSL {#tls/ssl-concepts}

TLS/SSL — это набор протоколов, которые полагаются на инфраструктуру открытых ключей (PKI) для обеспечения безопасной связи между клиентом и сервером. В большинстве распространенных случаев каждый сервер должен иметь закрытый ключ.

Закрытые ключи могут быть сгенерированы различными способами. В примере ниже показано использование интерфейса командной строки OpenSSL для генерации 2048-битного закрытого ключа RSA:

```bash [BASH]
openssl genrsa -out ryans-key.pem 2048
```
С TLS/SSL все серверы (и некоторые клиенты) должны иметь *сертификат*. Сертификаты — это *открытые ключи*, которые соответствуют закрытому ключу и которые цифровой подписью либо Центром сертификации, либо владельцем закрытого ключа (такие сертификаты называются "самоподписанными"). Первым шагом для получения сертификата является создание файла *Запроса на подпись сертификата* (CSR).

Интерфейс командной строки OpenSSL можно использовать для генерации CSR для закрытого ключа:

```bash [BASH]
openssl req -new -sha256 -key ryans-key.pem -out ryans-csr.pem
```
После создания файла CSR его можно отправить в Центр сертификации для подписи или использовать для создания самоподписанного сертификата.

Создание самоподписанного сертификата с использованием интерфейса командной строки OpenSSL показано в примере ниже:

```bash [BASH]
openssl x509 -req -in ryans-csr.pem -signkey ryans-key.pem -out ryans-cert.pem
```
После создания сертификата его можно использовать для создания файла `.pfx` или `.p12`:

```bash [BASH]
openssl pkcs12 -export -in ryans-cert.pem -inkey ryans-key.pem \
      -certfile ca-cert.pem -out ryans.pfx
```
Где:

- `in`: это подписанный сертификат
- `inkey`: это связанный закрытый ключ
- `certfile`: это конкатенация всех сертификатов Центра сертификации (CA) в один файл, например, `cat ca1-cert.pem ca2-cert.pem \> ca-cert.pem`


### Идеальная прямая секретность {#perfect-forward-secrecy}

Термин *<a href="https://en.wikipedia.org/wiki/Perfect_forward_secrecy">прямая секретность</a>* или *идеальная прямая секретность* описывает особенность методов согласования ключей (т.е. обмена ключами). То есть ключи сервера и клиента используются для согласования новых временных ключей, которые используются специально и только для текущего сеанса связи. Практически это означает, что даже если закрытый ключ сервера скомпрометирован, переписку могут расшифровать злоумышленники только в том случае, если им удастся получить пару ключей, специально сгенерированную для сеанса.

Идеальная прямая секретность достигается за счет случайной генерации пары ключей для согласования ключей при каждом TLS/SSL-рукопожатии (в отличие от использования одного и того же ключа для всех сеансов). Методы, реализующие этот подход, называются «эфимерными».

В настоящее время обычно используются два метода для достижения идеальной прямой секретности (обратите внимание на символ "E", добавленный к традиционным сокращениям):

- [ECDHE](https://en.wikipedia.org/wiki/Elliptic_curve_Diffie%E2%80%93Hellman): Эфимерная версия протокола согласования ключей на эллиптических кривых Диффи-Хеллмана.
- [DHE](https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange): Эфимерная версия протокола согласования ключей Диффи-Хеллмана.

Идеальная прямая секретность с использованием ECDHE включена по умолчанию. Параметр `ecdhCurve` можно использовать при создании TLS-сервера для настройки списка поддерживаемых кривых ECDH для использования. Дополнительную информацию см. в [`tls.createServer()`](/ru/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener).

DHE отключен по умолчанию, но его можно включить вместе с ECDHE, установив для параметра `dhparam` значение `'auto'`. Пользовательские параметры DHE также поддерживаются, но не рекомендуются в пользу автоматически выбранных общеизвестных параметров.

Идеальная прямая секретность была необязательной до TLSv1.2. Начиная с TLSv1.3, всегда используется (EC)DHE (за исключением соединений только с PSK).

### ALPN и SNI {#alpn-and-sni}

ALPN (Application-Layer Protocol Negotiation Extension) и SNI (Server Name Indication) — это расширения рукопожатия TLS:

- ALPN: Позволяет использовать один TLS-сервер для нескольких протоколов (HTTP, HTTP/2).
- SNI: Позволяет использовать один TLS-сервер для нескольких имен хостов с разными сертификатами.


### Pre-shared keys {#pre-shared-keys}

Поддержка TLS-PSK доступна в качестве альтернативы обычной аутентификации на основе сертификатов. Она использует предварительно заданный ключ вместо сертификатов для аутентификации TLS-соединения, обеспечивая взаимную аутентификацию. TLS-PSK и инфраструктура открытых ключей не являются взаимоисключающими. Клиенты и серверы могут поддерживать оба способа, выбирая один из них во время обычного этапа согласования шифра.

TLS-PSK является хорошим выбором только там, где существуют средства безопасного обмена ключом с каждой подключающейся машиной, поэтому он не заменяет инфраструктуру открытых ключей (PKI) для большинства применений TLS. Реализация TLS-PSK в OpenSSL в последние годы видела много недостатков безопасности, в основном потому, что она используется только меньшинством приложений. Пожалуйста, рассмотрите все альтернативные решения, прежде чем переходить на шифры PSK. При генерации PSK крайне важно использовать достаточную энтропию, как описано в [RFC 4086](https://tools.ietf.org/html/rfc4086). Получение общего секрета из пароля или других источников с низкой энтропией небезопасно.

Шифры PSK отключены по умолчанию, и поэтому использование TLS-PSK требует явного указания набора шифров с помощью опции `ciphers`. Список доступных шифров можно получить с помощью `openssl ciphers -v 'PSK'`. Все шифры TLS 1.3 подходят для PSK и могут быть получены с помощью `openssl ciphers -v -s -tls1_3 -psk`. При подключении клиента следует передать пользовательскую функцию `checkServerIdentity`, поскольку стандартная функция завершится неудачно в отсутствие сертификата.

Согласно [RFC 4279](https://tools.ietf.org/html/rfc4279), должны поддерживаться идентификаторы PSK длиной до 128 байт и PSK длиной до 64 байт. В OpenSSL 1.1.0 максимальный размер идентификатора составляет 128 байт, а максимальная длина PSK - 256 байт.

Текущая реализация не поддерживает асинхронные обратные вызовы PSK из-за ограничений базового API OpenSSL.

Чтобы использовать TLS-PSK, клиент и сервер должны указать параметр `pskCallback` — функцию, которая возвращает PSK для использования (который должен быть совместим с дайджестом выбранного шифра).

Сначала она будет вызвана на клиенте:

- hint: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) необязательное сообщение, отправленное сервером, чтобы помочь клиенту решить, какой идентификатор использовать во время согласования. Всегда `null`, если используется TLS 1.3.
- Returns: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) в формате `{ psk: \<Buffer|TypedArray|DataView\>, identity: \<string\> }` или `null`.

Затем на сервере:

- socket: [\<tls.TLSSocket\>](/ru/nodejs/api/tls#class-tlstlssocket) экземпляр серверного сокета, эквивалентный `this`.
- identity: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) параметр идентификатора, отправленный клиентом.
- Returns: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) PSK (или `null`).

Возвращаемое значение `null` останавливает процесс согласования и отправляет другой стороне предупреждающее сообщение `unknown_psk_identity`. Если сервер хочет скрыть тот факт, что идентификатор PSK не был известен, обратный вызов должен предоставить некоторые случайные данные в качестве `psk`, чтобы соединение завершилось с ошибкой `decrypt_error` до завершения согласования.


### Предотвращение атак с инициированным клиентом повторным согласованием {#client-initiated-renegotiation-attack-mitigation}

Протокол TLS позволяет клиентам пересогласовывать определенные аспекты сеанса TLS. К сожалению, пересогласование сеанса требует непропорционально большого количества серверных ресурсов, что делает его потенциальным вектором для атак типа "отказ в обслуживании".

Чтобы снизить риск, повторное согласование ограничено тремя разами каждые десять минут. Событие `'error'` возникает на экземпляре [`tls.TLSSocket`](/ru/nodejs/api/tls#class-tlstlssocket), когда этот порог превышен. Ограничения настраиваются:

- `tls.CLIENT_RENEG_LIMIT` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Указывает количество запросов на повторное согласование. **По умолчанию:** `3`.
- `tls.CLIENT_RENEG_WINDOW` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Указывает временное окно повторного согласования в секундах. **По умолчанию:** `600` (10 минут).

Ограничения повторного согласования по умолчанию не следует изменять без полного понимания последствий и рисков.

TLSv1.3 не поддерживает повторное согласование.

### Возобновление сеанса {#session-resumption}

Установление сеанса TLS может быть относительно медленным. Этот процесс можно ускорить, сохранив и повторно использовав состояние сеанса. Существует несколько механизмов для этого, которые обсуждаются здесь от старых к новым (и предпочтительных).

#### Идентификаторы сеансов {#session-identifiers}

Серверы генерируют уникальный ID для новых соединений и отправляют его клиенту. Клиенты и серверы сохраняют состояние сеанса. При повторном подключении клиенты отправляют ID своего сохраненного состояния сеанса, и если у сервера также есть состояние для этого ID, он может согласиться использовать его. В противном случае сервер создаст новый сеанс. Дополнительную информацию см. в [RFC 2246](https://www.ietf.org/rfc/rfc2246.txt), страницы 23 и 30.

Возобновление с использованием идентификаторов сеансов поддерживается большинством веб-браузеров при выполнении HTTPS-запросов.

Для Node.js клиенты ожидают события [`'session'`](/ru/nodejs/api/tls#event-session), чтобы получить данные сеанса, и предоставляют данные параметру `session` последующего [`tls.connect()`](/ru/nodejs/api/tls#tlsconnectoptions-callback) для повторного использования сеанса. Серверы должны реализовать обработчики для событий [`'newSession'`](/ru/nodejs/api/tls#event-newsession) и [`'resumeSession'`](/ru/nodejs/api/tls#event-resumesession) для сохранения и восстановления данных сеанса, используя ID сеанса в качестве ключа поиска для повторного использования сеансов. Чтобы повторно использовать сеансы между балансировщиками нагрузки или рабочими процессами кластера, серверы должны использовать общий кэш сеансов (например, Redis) в своих обработчиках сеансов.


#### Сессионные билеты {#session-tickets}

Серверы шифруют все состояние сессии и отправляют его клиенту в виде "билета". При повторном подключении состояние отправляется серверу в начальном соединении. Этот механизм позволяет избежать необходимости использования серверного кэша сессий. Если сервер не использует билет по какой-либо причине (не удалось его расшифровать, он устарел и т. д.), он создаст новую сессию и отправит новый билет. Дополнительную информацию см. в [RFC 5077](https://tools.ietf.org/html/rfc5077).

Возобновление сессии с использованием сессионных билетов становится все более распространенным и поддерживается многими веб-браузерами при выполнении HTTPS-запросов.

В Node.js клиенты используют те же API для возобновления сессии с идентификаторами сессий, что и для возобновления с сессионными билетами. Для отладки, если [`tls.TLSSocket.getTLSTicket()`](/ru/nodejs/api/tls#tlssocketgettlsticket) возвращает значение, то данные сессии содержат билет, в противном случае они содержат клиентское состояние сессии.

Имейте в виду, что с TLSv1.3 сервер может отправлять несколько билетов, что приведет к нескольким событиям `'session'`, подробнее см. [`'session'`](/ru/nodejs/api/tls#event-session).

Серверам с одним процессом не требуется специальная реализация для использования сессионных билетов. Чтобы использовать сессионные билеты при перезапуске сервера или балансировщиках нагрузки, все серверы должны иметь одинаковые ключи билетов. Внутри имеется три 16-байтовых ключа, но API tls предоставляет их в виде одного 48-байтового буфера для удобства.

Можно получить ключи билетов, вызвав [`server.getTicketKeys()`](/ru/nodejs/api/tls#servergetticketkeys) на одном экземпляре сервера и затем распространить их, но более разумно безопасно сгенерировать 48 байт безопасных случайных данных и установить их с помощью опции `ticketKeys` в [`tls.createServer()`](/ru/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener). Ключи следует регулярно обновлять, а ключи сервера можно сбросить с помощью [`server.setTicketKeys()`](/ru/nodejs/api/tls#serversetticketkeyskeys).

Ключи сессионных билетов являются криптографическими ключами, и они *<strong>должны храниться в безопасности</strong>*. В TLS 1.2 и более ранних версиях, если они скомпрометированы, все сессии, в которых использовались билеты, зашифрованные ими, могут быть расшифрованы. Их не следует хранить на диске, и их следует регулярно обновлять.

Если клиенты заявляют о поддержке билетов, сервер будет их отправлять. Сервер может отключить билеты, предоставив `require('node:constants').SSL_OP_NO_TICKET` в `secureOptions`.

И идентификаторы сессий, и сессионные билеты имеют тайм-аут, из-за которого сервер создает новые сессии. Тайм-аут можно настроить с помощью опции `sessionTimeout` в [`tls.createServer()`](/ru/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener).

Для всех механизмов, когда возобновление не удается, серверы создают новые сессии. Поскольку сбой возобновления сессии не приводит к сбоям соединения TLS/HTTPS, легко не заметить ненужно низкую производительность TLS. CLI OpenSSL можно использовать для проверки того, что серверы возобновляют сессии. Используйте опцию `-reconnect` для `openssl s_client`, например:

```bash [BASH]
openssl s_client -connect localhost:443 -reconnect
```
Просмотрите вывод отладки. Первое соединение должно указывать "New", например:

```text [TEXT]
New, TLSv1.2, Cipher is ECDHE-RSA-AES128-GCM-SHA256
```
Последующие соединения должны указывать "Reused", например:

```text [TEXT]
Reused, TLSv1.2, Cipher is ECDHE-RSA-AES128-GCM-SHA256
```

## Изменение набора шифров TLS по умолчанию {#modifying-the-default-tls-cipher-suite}

Node.js построен с набором включённых и отключённых шифров TLS по умолчанию. Этот список шифров по умолчанию можно настроить при сборке Node.js, чтобы дистрибутивы могли предоставлять свой собственный список по умолчанию.

Следующую команду можно использовать для отображения набора шифров по умолчанию:

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
Это значение по умолчанию можно полностью заменить с помощью переключателя командной строки [`--tls-cipher-list`](/ru/nodejs/api/cli#--tls-cipher-listlist) (напрямую или через переменную среды [`NODE_OPTIONS`](/ru/nodejs/api/cli#node_optionsoptions)). Например, следующее сделает `ECDHE-RSA-AES128-GCM-SHA256:!RC4` набором шифров TLS по умолчанию:

```bash [BASH]
node --tls-cipher-list='ECDHE-RSA-AES128-GCM-SHA256:!RC4' server.js

export NODE_OPTIONS=--tls-cipher-list='ECDHE-RSA-AES128-GCM-SHA256:!RC4'
node server.js
```
Чтобы проверить, используйте следующую команду для отображения установленного списка шифров, обратите внимание на разницу между `defaultCoreCipherList` и `defaultCipherList`:

```bash [BASH]
node --tls-cipher-list='ECDHE-RSA-AES128-GCM-SHA256:!RC4' -p crypto.constants.defaultCipherList | tr ':' '\n'
ECDHE-RSA-AES128-GCM-SHA256
!RC4
```
т.е. список `defaultCoreCipherList` устанавливается во время компиляции, а `defaultCipherList` - во время выполнения.

Чтобы изменить наборы шифров по умолчанию из среды выполнения, измените переменную `tls.DEFAULT_CIPHERS`, это необходимо выполнить до прослушивания каких-либо сокетов, это не повлияет на уже открытые сокеты. Например:

```js [ESM]
// Remove Obsolete CBC Ciphers and RSA Key Exchange based Ciphers as they don't provide Forward Secrecy
tls.DEFAULT_CIPHERS +=
  ':!ECDHE-RSA-AES128-SHA:!ECDHE-RSA-AES128-SHA256:!ECDHE-RSA-AES256-SHA:!ECDHE-RSA-AES256-SHA384' +
  ':!ECDHE-ECDSA-AES128-SHA:!ECDHE-ECDSA-AES128-SHA256:!ECDHE-ECDSA-AES256-SHA:!ECDHE-ECDSA-AES256-SHA384' +
  ':!kRSA';
```
Значение по умолчанию также можно заменить для каждого клиента или сервера с помощью параметра `ciphers` из [`tls.createSecureContext()`](/ru/nodejs/api/tls#tlscreatesecurecontextoptions), который также доступен в [`tls.createServer()`](/ru/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener), [`tls.connect()`](/ru/nodejs/api/tls#tlsconnectoptions-callback) и при создании новых [`tls.TLSSocket`](/ru/nodejs/api/tls#class-tlstlssocket)s.

Список шифров может содержать смесь названий наборов шифров TLSv1.3, тех, которые начинаются с `'TLS_'`, и спецификаций для наборов шифров TLSv1.2 и ниже. Шифры TLSv1.2 поддерживают устаревший формат спецификации, подробности см. в документации OpenSSL по [формату списка шифров](https://www.openssl.org/docs/man1.1.1/man1/ciphers#CIPHER-LIST-FORMAT), но эти спецификации *не* применяются к шифрам TLSv1.3. Наборы TLSv1.3 могут быть включены только путем включения их полного имени в список шифров. Их нельзя, например, включить или отключить с помощью устаревшей спецификации TLSv1.2 `'EECDH'` или `'!EECDH'`.

Несмотря на относительный порядок наборов шифров TLSv1.3 и TLSv1.2, протокол TLSv1.3 значительно безопаснее, чем TLSv1.2, и всегда будет выбран вместо TLSv1.2, если подтверждение соединения указывает, что он поддерживается, и если какие-либо наборы шифров TLSv1.3 включены.

Набор шифров по умолчанию, включённый в Node.js, был тщательно отобран, чтобы отражать текущие передовые методы обеспечения безопасности и снижения рисков. Изменение набора шифров по умолчанию может оказать существенное влияние на безопасность приложения. Переключатель `--tls-cipher-list` и параметр `ciphers` следует использовать только в случае крайней необходимости.

Набор шифров по умолчанию предпочитает шифры GCM для [настройки «современной криптографии» Chrome](https://www.chromium.org/Home/chromium-security/education/tls#TOC-Cipher-Suites), а также предпочитает шифры ECDHE и DHE для обеспечения совершенной прямой секретности, предлагая при этом *некоторую* обратную совместимость.

Старые клиенты, которые полагаются на небезопасные и устаревшие шифры на основе RC4 или DES (например, Internet Explorer 6), не могут завершить процесс подтверждения соединения с конфигурацией по умолчанию. Если эти клиенты *должны* поддерживаться, [рекомендации TLS](https://wiki.mozilla.org/Security/Server_Side_TLS) могут предложить совместимый набор шифров. Для получения более подробной информации о формате см. документацию OpenSSL по [формату списка шифров](https://www.openssl.org/docs/man1.1.1/man1/ciphers#CIPHER-LIST-FORMAT).

Существует всего пять наборов шифров TLSv1.3:

- `'TLS_AES_256_GCM_SHA384'`
- `'TLS_CHACHA20_POLY1305_SHA256'`
- `'TLS_AES_128_GCM_SHA256'`
- `'TLS_AES_128_CCM_SHA256'`
- `'TLS_AES_128_CCM_8_SHA256'`

Первые три включены по умолчанию. Два набора на основе `CCM` поддерживаются TLSv1.3, поскольку они могут быть более производительными на системах с ограниченными ресурсами, но они не включены по умолчанию, поскольку обеспечивают меньшую безопасность.


## Уровень безопасности OpenSSL {#openssl-security-level}

Библиотека OpenSSL обеспечивает применение уровней безопасности для контроля минимально допустимого уровня безопасности для криптографических операций. Уровни безопасности OpenSSL варьируются от 0 до 5, и каждый уровень устанавливает более строгие требования к безопасности. Уровень безопасности по умолчанию - 1, который, как правило, подходит для большинства современных приложений. Однако для некоторых устаревших функций и протоколов, таких как TLSv1, требуется более низкий уровень безопасности (`SECLEVEL=0`) для правильной работы. Для получения более подробной информации, пожалуйста, обратитесь к [документации OpenSSL по уровням безопасности](https://www.openssl.org/docs/manmaster/man3/SSL_CTX_set_security_level#DEFAULT-CALLBACK-BEHAVIOUR).

### Установка уровней безопасности {#setting-security-levels}

Чтобы настроить уровень безопасности в вашем приложении Node.js, вы можете включить `@SECLEVEL=X` в строку шифров, где `X` - желаемый уровень безопасности. Например, чтобы установить уровень безопасности 0 при использовании списка шифров OpenSSL по умолчанию, можно использовать:

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

Этот подход устанавливает уровень безопасности 0, позволяя использовать устаревшие функции, по-прежнему используя шифры OpenSSL по умолчанию.

### Использование {#using}

Вы также можете установить уровень безопасности и шифры из командной строки, используя `--tls-cipher-list=DEFAULT@SECLEVEL=X`, как описано в разделе [Изменение стандартного набора шифров TLS](/ru/nodejs/api/tls#modifying-the-default-tls-cipher-suite). Однако обычно не рекомендуется использовать опцию командной строки для установки шифров, и предпочтительнее настраивать шифры для отдельных контекстов в коде вашего приложения, поскольку этот подход обеспечивает более точный контроль и снижает риск глобального понижения уровня безопасности.


## Коды ошибок сертификата X509 {#x509-certificate-error-codes}

Различные функции могут завершиться неудачно из-за ошибок сертификата, сообщаемых OpenSSL. В таком случае функция предоставляет [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) через свой обратный вызов, который имеет свойство `code`, которое может принимать одно из следующих значений:

- `'UNABLE_TO_GET_ISSUER_CERT'`: Невозможно получить сертификат издателя.
- `'UNABLE_TO_GET_CRL'`: Невозможно получить CRL сертификата.
- `'UNABLE_TO_DECRYPT_CERT_SIGNATURE'`: Невозможно расшифровать подпись сертификата.
- `'UNABLE_TO_DECRYPT_CRL_SIGNATURE'`: Невозможно расшифровать подпись CRL.
- `'UNABLE_TO_DECODE_ISSUER_PUBLIC_KEY'`: Невозможно декодировать открытый ключ издателя.
- `'CERT_SIGNATURE_FAILURE'`: Ошибка подписи сертификата.
- `'CRL_SIGNATURE_FAILURE'`: Ошибка подписи CRL.
- `'CERT_NOT_YET_VALID'`: Сертификат еще не действителен.
- `'CERT_HAS_EXPIRED'`: Срок действия сертификата истек.
- `'CRL_NOT_YET_VALID'`: CRL еще не действителен.
- `'CRL_HAS_EXPIRED'`: Срок действия CRL истек.
- `'ERROR_IN_CERT_NOT_BEFORE_FIELD'`: Ошибка формата в поле notBefore сертификата.
- `'ERROR_IN_CERT_NOT_AFTER_FIELD'`: Ошибка формата в поле notAfter сертификата.
- `'ERROR_IN_CRL_LAST_UPDATE_FIELD'`: Ошибка формата в поле lastUpdate CRL.
- `'ERROR_IN_CRL_NEXT_UPDATE_FIELD'`: Ошибка формата в поле nextUpdate CRL.
- `'OUT_OF_MEM'`: Недостаточно памяти.
- `'DEPTH_ZERO_SELF_SIGNED_CERT'`: Самоподписанный сертификат.
- `'SELF_SIGNED_CERT_IN_CHAIN'`: Самоподписанный сертификат в цепочке сертификатов.
- `'UNABLE_TO_GET_ISSUER_CERT_LOCALLY'`: Невозможно получить локальный сертификат издателя.
- `'UNABLE_TO_VERIFY_LEAF_SIGNATURE'`: Невозможно проверить первый сертификат.
- `'CERT_CHAIN_TOO_LONG'`: Слишком длинная цепочка сертификатов.
- `'CERT_REVOKED'`: Сертификат отозван.
- `'INVALID_CA'`: Недействительный сертификат ЦС.
- `'PATH_LENGTH_EXCEEDED'`: Превышено ограничение длины пути.
- `'INVALID_PURPOSE'`: Неподдерживаемое назначение сертификата.
- `'CERT_UNTRUSTED'`: Сертификат не является доверенным.
- `'CERT_REJECTED'`: Сертификат отклонен.
- `'HOSTNAME_MISMATCH'`: Несовпадение имени хоста.


## Class: `tls.CryptoStream` {#class-tlscryptostream}

**Added in: v0.3.4**

**Deprecated since: v0.11.3**

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/ru/nodejs/api/documentation#stability-index) [Stability: 0](/ru/nodejs/api/documentation#stability-index) - Deprecated: Используйте [`tls.TLSSocket`](/ru/nodejs/api/tls#class-tlstlssocket) вместо этого.
:::

Класс `tls.CryptoStream` представляет собой поток зашифрованных данных. Этот класс устарел и больше не должен использоваться.

### `cryptoStream.bytesWritten` {#cryptostreambyteswritten}

**Added in: v0.3.4**

**Deprecated since: v0.11.3**

Свойство `cryptoStream.bytesWritten` возвращает общее количество байтов, записанных в базовый сокет, *включая* байты, необходимые для реализации протокола TLS.

## Class: `tls.SecurePair` {#class-tlssecurepair}

**Added in: v0.3.2**

**Deprecated since: v0.11.3**

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/ru/nodejs/api/documentation#stability-index) [Stability: 0](/ru/nodejs/api/documentation#stability-index) - Deprecated: Используйте [`tls.TLSSocket`](/ru/nodejs/api/tls#class-tlstlssocket) вместо этого.
:::

Возвращается [`tls.createSecurePair()`](/ru/nodejs/api/tls#tlscreatesecurepaircontext-isserver-requestcert-rejectunauthorized-options).

### Event: `'secure'` {#event-secure}

**Added in: v0.3.2**

**Deprecated since: v0.11.3**

Событие `'secure'` испускается объектом `SecurePair` после установления безопасного соединения.

Как и при проверке события [`'secureConnection'`](/ru/nodejs/api/tls#event-secureconnection) сервера, следует проверить `pair.cleartext.authorized`, чтобы убедиться, что используемый сертификат должным образом авторизован.

## Class: `tls.Server` {#class-tlsserver}

**Added in: v0.3.2**

- Extends: [\<net.Server\>](/ru/nodejs/api/net#class-netserver)

Принимает зашифрованные соединения с использованием TLS или SSL.

### Event: `'connection'` {#event-connection}

**Added in: v0.3.2**

- `socket` [\<stream.Duplex\>](/ru/nodejs/api/stream#class-streamduplex)

Это событие испускается при установлении нового потока TCP, до начала TLS handshake. `socket` обычно является объектом типа [`net.Socket`](/ru/nodejs/api/net#class-netsocket), но не будет получать события, в отличие от сокета, созданного из события [`net.Server`](/ru/nodejs/api/net#class-netserver) `'connection'`. Обычно пользователи не захотят получать доступ к этому событию.

Это событие также может быть явно вызвано пользователями для внедрения соединений в TLS-сервер. В этом случае может быть передан любой поток [`Duplex`](/ru/nodejs/api/stream#class-streamduplex).


### Событие: `'keylog'` {#event-keylog}

**Добавлено в версии: v12.3.0, v10.20.0**

- `line` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) Строка текста ASCII в формате NSS `SSLKEYLOGFILE`.
- `tlsSocket` [\<tls.TLSSocket\>](/ru/nodejs/api/tls#class-tlstlssocket) Экземпляр `tls.TLSSocket`, на котором он был сгенерирован.

Событие `keylog` возникает, когда ключевой материал генерируется или принимается соединением с этим сервером (обычно до завершения рукопожатия, но не обязательно). Этот ключевой материал можно сохранить для отладки, так как он позволяет расшифровать захваченный TLS-трафик. Он может быть сгенерирован несколько раз для каждого сокета.

Типичный вариант использования - добавить полученные строки в общий текстовый файл, который впоследствии используется программным обеспечением (например, Wireshark) для расшифровки трафика:

```js [ESM]
const logFile = fs.createWriteStream('/tmp/ssl-keys.log', { flags: 'a' });
// ...
server.on('keylog', (line, tlsSocket) => {
  if (tlsSocket.remoteAddress !== '...')
    return; // Только логировать ключи для определенного IP
  logFile.write(line);
});
```
### Событие: `'newSession'` {#event-newsession}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v0.11.12 | Теперь поддерживается аргумент `callback`. |
| v0.9.2 | Добавлено в версии: v0.9.2 |
:::

Событие `'newSession'` генерируется при создании нового TLS-сеанса. Это можно использовать для хранения сессий во внешнем хранилище. Данные должны быть предоставлены в обратный вызов [`'resumeSession'`](/ru/nodejs/api/tls#event-resumesession).

Функция обратного вызова прослушивателя получает три аргумента при вызове:

- `sessionId` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) Идентификатор TLS-сессии
- `sessionData` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) Данные TLS-сессии
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Функция обратного вызова, не принимающая аргументов, которая должна быть вызвана для отправки или получения данных по безопасному соединению.

Прослушивание этого события повлияет только на соединения, установленные после добавления прослушивателя событий.

### Событие: `'OCSPRequest'` {#event-ocsprequest}

**Добавлено в версии: v0.11.13**

Событие `'OCSPRequest'` возникает, когда клиент отправляет запрос статуса сертификата. Функция обратного вызова прослушивателя получает три аргумента при вызове:

- `certificate` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) Сертификат сервера
- `issuer` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) Сертификат издателя
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Функция обратного вызова, которая должна быть вызвана для предоставления результатов запроса OCSP.

Текущий сертификат сервера можно проанализировать, чтобы получить URL-адрес OCSP и идентификатор сертификата; после получения ответа OCSP вызывается `callback(null, resp)`, где `resp` - это экземпляр `Buffer`, содержащий ответ OCSP. И `certificate`, и `issuer` - это `Buffer` DER-представления основного сертификата и сертификата издателя. Их можно использовать для получения идентификатора сертификата OCSP и URL-адреса конечной точки OCSP.

В качестве альтернативы можно вызвать `callback(null, null)`, указав, что ответа OCSP не было.

Вызов `callback(err)` приведет к вызову `socket.destroy(err)`.

Типичный поток запроса OCSP выглядит следующим образом:

`issuer` может быть `null`, если сертификат является самоподписанным или издатель отсутствует в списке корневых сертификатов. (Издатель может быть предоставлен через опцию `ca` при установлении TLS-соединения.)

Прослушивание этого события повлияет только на соединения, установленные после добавления прослушивателя событий.

Для анализа сертификатов можно использовать npm-модуль, такой как [asn1.js](https://www.npmjs.com/package/asn1.js).


### Event: `'resumeSession'` {#event-resumesession}

**Добавлено в: v0.9.2**

Событие `'resumeSession'` возникает, когда клиент запрашивает возобновление предыдущей TLS-сессии. Обратный вызов прослушивателя получает два аргумента при вызове:

- `sessionId` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) Идентификатор TLS-сессии
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Функция обратного вызова, которая вызывается, когда предыдущая сессия была восстановлена: `callback([err[, sessionData]])`
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `sessionData` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer)

Прослушиватель событий должен выполнить поиск во внешнем хранилище `sessionData`, сохраненных обработчиком события [`'newSession'`](/ru/nodejs/api/tls#event-newsession), используя данный `sessionId`. Если данные найдены, вызовите `callback(null, sessionData)` для возобновления сессии. Если данные не найдены, сессию нельзя возобновить. `callback()` должен быть вызван без `sessionData`, чтобы рукопожатие могло продолжиться и могла быть создана новая сессия. Можно вызвать `callback(err)` для завершения входящего соединения и уничтожения сокета.

Прослушивание этого события будет иметь эффект только на соединениях, установленных после добавления прослушивателя событий.

Следующий пример иллюстрирует возобновление TLS-сессии:

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

**Добавлено в: v0.3.2**

Событие `'secureConnection'` возникает после успешного завершения процесса рукопожатия для нового соединения. Обратный вызов прослушивателя получает один аргумент при вызове:

- `tlsSocket` [\<tls.TLSSocket\>](/ru/nodejs/api/tls#class-tlstlssocket) Установленный TLS-сокет.

Свойство `tlsSocket.authorized` является логическим значением, указывающим, был ли клиент проверен одним из предоставленных центров сертификации для сервера. Если `tlsSocket.authorized` равно `false`, то `socket.authorizationError` устанавливается для описания того, как не удалось авторизация. В зависимости от настроек TLS-сервера, неавторизованные соединения все еще могут быть приняты.

Свойство `tlsSocket.alpnProtocol` - это строка, содержащая выбранный протокол ALPN. Когда у ALPN нет выбранного протокола, потому что клиент или сервер не отправили расширение ALPN, `tlsSocket.alpnProtocol` равно `false`.

Свойство `tlsSocket.servername` - это строка, содержащая имя сервера, запрошенное через SNI.


### Событие: `'tlsClientError'` {#event-tlsclienterror}

**Добавлено в: v6.0.0**

Событие `'tlsClientError'` генерируется, когда происходит ошибка до установления безопасного соединения. Функция обратного вызова прослушивателя получает два аргумента при вызове:

- `exception` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) Объект `Error`, описывающий ошибку.
- `tlsSocket` [\<tls.TLSSocket\>](/ru/nodejs/api/tls#class-tlstlssocket) Экземпляр `tls.TLSSocket`, из которого произошла ошибка.

### `server.addContext(hostname, context)` {#serveraddcontexthostname-context}

**Добавлено в: v0.5.3**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Имя хоста SNI или подстановочный знак (например, `'*'`).
- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<tls.SecureContext\>](/ru/nodejs/api/tls#tlscreatesecurecontextoptions) Объект, содержащий любые возможные свойства из аргументов `options` [`tls.createSecureContext()`](/ru/nodejs/api/tls#tlscreatesecurecontextoptions) (например, `key`, `cert`, `ca` и т. д.) или объект контекста TLS, созданный с помощью [`tls.createSecureContext()`](/ru/nodejs/api/tls#tlscreatesecurecontextoptions).

Метод `server.addContext()` добавляет безопасный контекст, который будет использоваться, если имя SNI запроса клиента соответствует предоставленному `hostname` (или подстановочному знаку).

При наличии нескольких совпадающих контекстов используется последний добавленный.

### `server.address()` {#serveraddress}

**Добавлено в: v0.6.0**

- Возвращает: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Возвращает привязанный адрес, имя семейства адресов и порт сервера, как сообщает операционная система. См. [`net.Server.address()`](/ru/nodejs/api/net#serveraddress) для получения дополнительной информации.

### `server.close([callback])` {#serverclosecallback}

**Добавлено в: v0.3.2**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Функция обратного вызова прослушивателя, которая будет зарегистрирована для прослушивания события `'close'` экземпляра сервера.
- Возвращает: [\<tls.Server\>](/ru/nodejs/api/tls#class-tlsserver)

Метод `server.close()` останавливает сервер от принятия новых соединений.

Эта функция работает асинхронно. Событие `'close'` будет сгенерировано, когда у сервера больше не будет открытых соединений.


### `server.getTicketKeys()` {#servergetticketkeys}

**Добавлено в версии: v3.0.0**

- Возвращает: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) 48-байтовый буфер, содержащий ключи сеансового билета.

Возвращает ключи сеансового билета.

Подробнее см. в [Возобновление сеанса](/ru/nodejs/api/tls#session-resumption).

### `server.listen()` {#serverlisten}

Запускает сервер, прослушивающий зашифрованные соединения. Этот метод идентичен [`server.listen()`](/ru/nodejs/api/net#serverlisten) из [`net.Server`](/ru/nodejs/api/net#class-netserver).

### `server.setSecureContext(options)` {#serversetsecurecontextoptions}

**Добавлено в версии: v11.0.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Объект, содержащий любые из возможных свойств из аргументов `options` [`tls.createSecureContext()`](/ru/nodejs/api/tls#tlscreatesecurecontextoptions) (например, `key`, `cert`, `ca` и т. д.).

Метод `server.setSecureContext()` заменяет безопасный контекст существующего сервера. Существующие соединения с сервером не прерываются.

### `server.setTicketKeys(keys)` {#serversetticketkeyskeys}

**Добавлено в версии: v3.0.0**

- `keys` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) 48-байтовый буфер, содержащий ключи сеансового билета.

Устанавливает ключи сеансового билета.

Изменения ключей билета вступают в силу только для будущих подключений к серверу. Существующие или ожидающие подключения к серверу будут использовать предыдущие ключи.

Подробнее см. в [Возобновление сеанса](/ru/nodejs/api/tls#session-resumption).

## Класс: `tls.TLSSocket` {#class-tlstlssocket}

**Добавлено в версии: v0.11.4**

- Наследует: [\<net.Socket\>](/ru/nodejs/api/net#class-netsocket)

Выполняет прозрачное шифрование записанных данных и все необходимые согласования TLS.

Экземпляры `tls.TLSSocket` реализуют дуплексный интерфейс [Stream](/ru/nodejs/api/stream#stream).

Методы, возвращающие метаданные соединения TLS (например, [`tls.TLSSocket.getPeerCertificate()`](/ru/nodejs/api/tls#tlssocketgetpeercertificatedetailed)), будут возвращать данные только во время открытого соединения.


### `new tls.TLSSocket(socket[, options])` {#new-tlstlssocketsocket-options}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v12.2.0 | Теперь поддерживается опция `enableTrace`. |
| v5.0.0 | Теперь поддерживаются опции ALPN. |
| v0.11.4 | Добавлено в: v0.11.4 |
:::

- `socket` [\<net.Socket\>](/ru/nodejs/api/net#class-netsocket) | [\<stream.Duplex\>](/ru/nodejs/api/stream#class-streamduplex) На стороне сервера любой поток `Duplex`. На стороне клиента любой экземпляр [`net.Socket`](/ru/nodejs/api/net#class-netsocket) (для общей поддержки потока `Duplex` на стороне клиента, необходимо использовать [`tls.connect()`](/ru/nodejs/api/tls#tlsconnectoptions-callback)).
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `enableTrace`: См. [`tls.createServer()`](/ru/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `isServer`: Протокол SSL/TLS асимметричен, TLSSockets должны знать, будут ли они вести себя как сервер или как клиент. Если `true`, TLS сокет будет создан как сервер. **По умолчанию:** `false`.
    - `server` [\<net.Server\>](/ru/nodejs/api/net#class-netserver) Экземпляр [`net.Server`](/ru/nodejs/api/net#class-netserver).
    - `requestCert`: Определяет, следует ли аутентифицировать удаленный узел, запросив сертификат. Клиенты всегда запрашивают сертификат сервера. Серверы (`isServer` имеет значение true) могут установить `requestCert` в true, чтобы запросить сертификат клиента.
    - `rejectUnauthorized`: См. [`tls.createServer()`](/ru/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `ALPNProtocols`: См. [`tls.createServer()`](/ru/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `SNICallback`: См. [`tls.createServer()`](/ru/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `session` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) Экземпляр `Buffer`, содержащий TLS-сессию.
    - `requestOCSP` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, указывает, что расширение запроса статуса OCSP будет добавлено к приветствию клиента, и событие `'OCSPResponse'` будет испущено на сокете до установления безопасной связи.
    - `secureContext`: Объект TLS-контекста, созданный с помощью [`tls.createSecureContext()`](/ru/nodejs/api/tls#tlscreatesecurecontextoptions). Если `secureContext` *не* предоставлен, он будет создан путем передачи всего объекта `options` в `tls.createSecureContext()`.
    - ...: Опции [`tls.createSecureContext()`](/ru/nodejs/api/tls#tlscreatesecurecontextoptions), которые используются, если опция `secureContext` отсутствует. В противном случае они игнорируются.

Создает новый объект `tls.TLSSocket` из существующего TCP сокета.


### Событие: `'keylog'` {#event-keylog_1}

**Добавлено в: v12.3.0, v10.20.0**

- `line` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) Строка текста ASCII в формате NSS `SSLKEYLOGFILE`.

Событие `keylog` возникает на `tls.TLSSocket`, когда ключевой материал генерируется или принимается сокетом. Этот ключевой материал может быть сохранен для отладки, поскольку он позволяет расшифровать захваченный TLS-трафик. Он может быть сгенерирован несколько раз, до или после завершения рукопожатия.

Типичный случай использования - добавление полученных строк в общий текстовый файл, который позже используется программным обеспечением (например, Wireshark) для расшифровки трафика:

```js [ESM]
const logFile = fs.createWriteStream('/tmp/ssl-keys.log', { flags: 'a' });
// ...
tlsSocket.on('keylog', (line) => logFile.write(line));
```
### Событие: `'OCSPResponse'` {#event-ocspresponse}

**Добавлено в: v0.11.13**

Событие `'OCSPResponse'` возникает, если при создании `tls.TLSSocket` был установлен параметр `requestOCSP` и был получен ответ OCSP. Функция обратного вызова прослушивателя получает один аргумент при вызове:

- `response` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) Ответ OCSP от сервера

Как правило, `response` - это объект с цифровой подписью от CA сервера, который содержит информацию о статусе отзыва сертификата сервера.

### Событие: `'secureConnect'` {#event-secureconnect}

**Добавлено в: v0.11.4**

Событие `'secureConnect'` возникает после успешного завершения процесса рукопожатия для нового соединения. Функция обратного вызова прослушивателя будет вызываться независимо от того, был ли авторизован сертификат сервера. Клиент несет ответственность за проверку свойства `tlsSocket.authorized`, чтобы определить, был ли сертификат сервера подписан одним из указанных центров сертификации. Если `tlsSocket.authorized === false`, то ошибку можно найти, изучив свойство `tlsSocket.authorizationError`. Если использовался ALPN, то свойство `tlsSocket.alpnProtocol` можно проверить, чтобы определить согласованный протокол.

Событие `'secureConnect'` не возникает, когда [\<tls.TLSSocket\>](/ru/nodejs/api/tls#class-tlstlssocket) создается с использованием конструктора `new tls.TLSSocket()`.


### Событие: `'session'` {#event-session}

**Добавлено в: v11.10.0**

- `session` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer)

Событие `'session'` генерируется на клиентском `tls.TLSSocket`, когда становится доступна новая сессия или TLS-билет. Это может произойти до или после завершения рукопожатия, в зависимости от согласованной версии протокола TLS. Событие не генерируется на сервере или если новая сессия не была создана, например, когда соединение было возобновлено. Для некоторых версий протокола TLS событие может генерироваться несколько раз, и в этом случае все сессии могут быть использованы для возобновления.

На клиенте `session` может быть предоставлена в опции `session` [`tls.connect()`](/ru/nodejs/api/tls#tlsconnectoptions-callback) для возобновления соединения.

См. [Возобновление сессии](/ru/nodejs/api/tls#session-resumption) для получения дополнительной информации.

Для TLSv1.2 и ниже [`tls.TLSSocket.getSession()`](/ru/nodejs/api/tls#tlssocketgetsession) можно вызвать после завершения рукопожатия. Для TLSv1.3 протоколом разрешено только возобновление на основе билетов, отправляется несколько билетов, и билеты отправляются только после завершения рукопожатия. Поэтому необходимо дождаться события `'session'`, чтобы получить сессию, которую можно возобновить. Приложения должны использовать событие `'session'` вместо `getSession()`, чтобы обеспечить работу для всех версий TLS. Приложения, которые ожидают получить или использовать только одну сессию, должны прослушивать это событие только один раз:

```js [ESM]
tlsSocket.once('session', (session) => {
  // Сессию можно использовать сразу или позже.
  tls.connect({
    session: session,
    // Другие параметры подключения...
  });
});
```
### `tlsSocket.address()` {#tlssocketaddress}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.4.0 | Свойство `family` теперь возвращает строку вместо числа. |
| v18.0.0 | Свойство `family` теперь возвращает число вместо строки. |
| v0.11.4 | Добавлено в: v0.11.4 |
:::

- Возвращает: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Возвращает связанный `address`, имя `family` адреса и `port` базового сокета, как сообщает операционная система: `{ port: 12346, family: 'IPv4', address: '127.0.0.1' }`.


### `tlsSocket.authorizationError` {#tlssocketauthorizationerror}

**Добавлено в версии: v0.11.4**

Возвращает причину, по которой сертификат пира не был верифицирован. Это свойство устанавливается только тогда, когда `tlsSocket.authorized === false`.

### `tlsSocket.authorized` {#tlssocketauthorized}

**Добавлено в версии: v0.11.4**

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Это свойство имеет значение `true`, если сертификат пира подписан одним из ЦС, указанных при создании экземпляра `tls.TLSSocket`, в противном случае - `false`.

### `tlsSocket.disableRenegotiation()` {#tlssocketdisablerenegotiation}

**Добавлено в версии: v8.4.0**

Отключает пересогласование TLS для этого экземпляра `TLSSocket`. После вызова попытки пересогласования вызовут событие `'error'` на `TLSSocket`.

### `tlsSocket.enableTrace()` {#tlssocketenabletrace}

**Добавлено в версии: v12.2.0**

Когда включено, информация об отслеживании пакетов TLS записывается в `stderr`. Это можно использовать для отладки проблем с соединением TLS.

Формат вывода идентичен выводу `openssl s_client -trace` или `openssl s_server -trace`. Хотя он создается функцией OpenSSL `SSL_trace()`, формат не документирован, может изменяться без уведомления и не должен использоваться.

### `tlsSocket.encrypted` {#tlssocketencrypted}

**Добавлено в версии: v0.11.4**

Всегда возвращает `true`. Это можно использовать для отличия сокетов TLS от обычных экземпляров `net.Socket`.

### `tlsSocket.exportKeyingMaterial(length, label[, context])` {#tlssocketexportkeyingmateriallength-label-context}

**Добавлено в версии: v13.10.0, v12.17.0**

-  `length` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) количество байтов для извлечения из ключевого материала
-  `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) специфичная для приложения метка, обычно это значение из [реестра меток экспортера IANA](https://www.iana.org/assignments/tls-parameters/tls-parameters.xhtml#exporter-labels).
-  `context` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) Дополнительно предоставляет контекст.
-  Возвращает: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) запрошенные байты ключевого материала

Ключевой материал используется для проверок для предотвращения различных видов атак в сетевых протоколах, например, в спецификациях IEEE 802.1X.

Пример

```js [ESM]
const keyingMaterial = tlsSocket.exportKeyingMaterial(
  128,
  'client finished');

/*
 Пример возвращаемого значения keyingMaterial:
 <Buffer 76 26 af 99 c5 56 8e 42 09 91 ef 9f 93 cb ad 6c 7b 65 f8 53 f1 d8 d9
    12 5a 33 b8 b5 25 df 7b 37 9f e0 e2 4f b8 67 83 a3 2f cd 5d 41 42 4c 91
    74 ef 2c ... 78 more bytes>
*/
```
См. документацию OpenSSL [`SSL_export_keying_material`](https://www.openssl.org/docs/man1.1.1/man3/SSL_export_keying_material) для получения дополнительной информации.


### `tlsSocket.getCertificate()` {#tlssocketgetcertificate}

**Added in: v11.2.0**

- Возвращает: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Возвращает объект, представляющий локальный сертификат. Возвращенный объект имеет некоторые свойства, соответствующие полям сертификата.

См. [`tls.TLSSocket.getPeerCertificate()`](/ru/nodejs/api/tls#tlssocketgetpeercertificatedetailed) для примера структуры сертификата.

Если локального сертификата нет, возвращается пустой объект. Если сокет был уничтожен, возвращается `null`.

### `tlsSocket.getCipher()` {#tlssocketgetcipher}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v13.4.0, v12.16.0 | Возвращает имя шифра IETF как `standardName`. |
| v12.0.0 | Возвращает минимальную версию шифра вместо фиксированной строки (`'TLSv1/SSLv3'`). |
| v0.11.4 | Добавлено в: v0.11.4 |
:::

- Возвращает: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Имя OpenSSL для набора шифров.
    - `standardName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Имя IETF для набора шифров.
    - `version` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Минимальная версия протокола TLS, поддерживаемая этим набором шифров. Фактический согласованный протокол см. в [`tls.TLSSocket.getProtocol()`](/ru/nodejs/api/tls#tlssocketgetprotocol).
  
 

Возвращает объект, содержащий информацию о согласованном наборе шифров.

Например, протокол TLSv1.2 с шифром AES256-SHA:

```json [JSON]
{
    "name": "AES256-SHA",
    "standardName": "TLS_RSA_WITH_AES_256_CBC_SHA",
    "version": "SSLv3"
}
```
См. [SSL_CIPHER_get_name](https://www.openssl.org/docs/man1.1.1/man3/SSL_CIPHER_get_name) для получения дополнительной информации.

### `tlsSocket.getEphemeralKeyInfo()` {#tlssocketgetephemeralkeyinfo}

**Added in: v5.0.0**

- Возвращает: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Возвращает объект, представляющий тип, имя и размер параметра обмена эфемерными ключами в [полной прямой секретности](/ru/nodejs/api/tls#perfect-forward-secrecy) при клиентском соединении. Возвращает пустой объект, если обмен ключами не является эфемерным. Поскольку это поддерживается только на клиентском сокете; `null` возвращается, если вызывается на серверном сокете. Поддерживаемые типы: `'DH'` и `'ECDH'`. Свойство `name` доступно только тогда, когда тип равен `'ECDH'`.

Например: `{ type: 'ECDH', name: 'prime256v1', size: 256 }`.


### `tlsSocket.getFinished()` {#tlssocketgetfinished}

**Добавлено в: v9.9.0**

- Возвращает: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Последнее сообщение `Finished`, которое было отправлено сокету в рамках SSL/TLS рукопожатия, или `undefined`, если сообщение `Finished` еще не было отправлено.

Поскольку сообщения `Finished` являются дайджестами сообщений полного рукопожатия (всего 192 бита для TLS 1.0 и больше для SSL 3.0), они могут использоваться для внешних процедур аутентификации, когда аутентификация, предоставляемая SSL/TLS, нежелательна или недостаточна.

Соответствует процедуре `SSL_get_finished` в OpenSSL и может использоваться для реализации связывания каналов `tls-unique` из [RFC 5929](https://tools.ietf.org/html/rfc5929).

### `tlsSocket.getPeerCertificate([detailed])` {#tlssocketgetpeercertificatedetailed}

**Добавлено в: v0.11.4**

- `detailed` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Включить полную цепочку сертификатов, если `true`, в противном случае включить только сертификат пира.
- Возвращает: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Объект сертификата.

Возвращает объект, представляющий сертификат пира. Если пир не предоставляет сертификат, будет возвращен пустой объект. Если сокет был уничтожен, будет возвращен `null`.

Если была запрошена полная цепочка сертификатов, каждый сертификат будет включать свойство `issuerCertificate`, содержащее объект, представляющий сертификат его издателя.

#### Объект сертификата {#certificate-object}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v19.1.0, v18.13.0 | Добавлено свойство "ca". |
| v17.2.0, v16.14.0 | Добавлено fingerprint512. |
| v11.4.0 | Поддержка информации об открытом ключе эллиптической кривой. |
:::

Объект сертификата имеет свойства, соответствующие полям сертификата.

- `ca` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, если центр сертификации (CA), `false` в противном случае.
- `raw` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) Данные сертификата X.509 в кодировке DER.
- `subject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Субъект сертификата, описанный в терминах Country (`C`), StateOrProvince (`ST`), Locality (`L`), Organization (`O`), OrganizationalUnit (`OU`) и CommonName (`CN`). CommonName обычно является DNS-именем с TLS-сертификатами. Пример: `{C: 'UK', ST: 'BC', L: 'Metro', O: 'Node Fans', OU: 'Docs', CN: 'example.com'}`.
- `issuer` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Эмитент сертификата, описанный в тех же терминах, что и `subject`.
- `valid_from` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Дата и время, с которого сертификат действителен.
- `valid_to` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Дата и время, до которого сертификат действителен.
- `serialNumber` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Серийный номер сертификата в виде шестнадцатеричной строки. Пример: `'B9B0D332A1AA5635'`.
- `fingerprint` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Дайджест SHA-1 сертификата в кодировке DER. Он возвращается в виде шестнадцатеричной строки, разделенной `:`. Пример: `'2A:7A:C2:DD:...'`.
- `fingerprint256` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Дайджест SHA-256 сертификата в кодировке DER. Он возвращается в виде шестнадцатеричной строки, разделенной `:`. Пример: `'2A:7A:C2:DD:...'`.
- `fingerprint512` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Дайджест SHA-512 сертификата в кодировке DER. Он возвращается в виде шестнадцатеричной строки, разделенной `:`. Пример: `'2A:7A:C2:DD:...'`.
- `ext_key_usage` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) (Необязательно) Расширенное использование ключа, набор OID.
- `subjectaltname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) (Необязательно) Строка, содержащая объединенные имена для субъекта, альтернатива именам `subject`.
- `infoAccess` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) (Необязательно) Массив, описывающий AuthorityInfoAccess, используемый с OCSP.
- `issuerCertificate` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) (Необязательно) Объект сертификата издателя. Для самоподписанных сертификатов это может быть циклическая ссылка.

Сертификат может содержать информацию об открытом ключе, в зависимости от типа ключа.

Для ключей RSA могут быть определены следующие свойства:

- `bits` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Размер битов RSA. Пример: `1024`.
- `exponent` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Экспонента RSA в виде строки в шестнадцатеричной нотации. Пример: `'0x010001'`.
- `modulus` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Модуль RSA в виде шестнадцатеричной строки. Пример: `'B56CE45CB7...'`.
- `pubkey` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) Открытый ключ.

Для ключей EC могут быть определены следующие свойства:

- `pubkey` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) Открытый ключ.
- `bits` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Размер ключа в битах. Пример: `256`.
- `asn1Curve` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) (Необязательно) ASN.1 имя OID эллиптической кривой. Хорошо известные кривые идентифицируются по OID. Хотя это необычно, возможно, что кривая идентифицируется по ее математическим свойствам, и в этом случае у нее не будет OID. Пример: `'prime256v1'`.
- `nistCurve` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) (Необязательно) Имя NIST для эллиптической кривой, если оно у нее есть (не всем хорошо известным кривым присвоены имена NIST). Пример: `'P-256'`.

Пример сертификата:

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

**Добавлено в версии: v9.9.0**

- Возвращает: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Последнее сообщение `Finished`, которое ожидается или фактически получено от сокета в рамках SSL/TLS handshake, или `undefined`, если до сих пор нет сообщения `Finished`.

Поскольку сообщения `Finished` являются дайджестами сообщений всего рукопожатия (всего 192 бита для TLS 1.0 и больше для SSL 3.0), их можно использовать для внешних процедур аутентификации, когда аутентификация, предоставляемая SSL/TLS, нежелательна или недостаточна.

Соответствует подпрограмме `SSL_get_peer_finished` в OpenSSL и может использоваться для реализации связывания каналов `tls-unique` из [RFC 5929](https://tools.ietf.org/html/rfc5929).

### `tlsSocket.getPeerX509Certificate()` {#tlssocketgetpeerx509certificate}

**Добавлено в версии: v15.9.0**

- Возвращает: [\<X509Certificate\>](/ru/nodejs/api/crypto#class-x509certificate)

Возвращает сертификат узла как объект [\<X509Certificate\>](/ru/nodejs/api/crypto#class-x509certificate).

Если нет сертификата узла или сокет был уничтожен, будет возвращено `undefined`.

### `tlsSocket.getProtocol()` {#tlssocketgetprotocol}

**Добавлено в версии: v5.7.0**

- Возвращает: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

Возвращает строку, содержащую согласованную версию протокола SSL/TLS для текущего соединения. Значение `'unknown'` будет возвращено для подключенных сокетов, которые не завершили процесс подтверждения соединения. Значение `null` будет возвращено для серверных сокетов или отключенных клиентских сокетов.

Доступны следующие версии протокола:

- `'SSLv3'`
- `'TLSv1'`
- `'TLSv1.1'`
- `'TLSv1.2'`
- `'TLSv1.3'`

См. документацию OpenSSL [`SSL_get_version`](https://www.openssl.org/docs/man1.1.1/man3/SSL_get_version) для получения дополнительной информации.

### `tlsSocket.getSession()` {#tlssocketgetsession}

**Добавлено в версии: v0.11.4**

- [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer)

Возвращает данные сеанса TLS или `undefined`, если сеанс не был согласован. На стороне клиента данные могут быть предоставлены в опции `session` функции [`tls.connect()`](/ru/nodejs/api/tls#tlsconnectoptions-callback) для возобновления соединения. На стороне сервера это может быть полезно для отладки.

См. [Возобновление сеанса](/ru/nodejs/api/tls#session-resumption) для получения дополнительной информации.

Примечание: `getSession()` работает только для TLSv1.2 и ниже. Для TLSv1.3 приложения должны использовать событие [`'session'`](/ru/nodejs/api/tls#event-session) (оно также работает для TLSv1.2 и ниже).


### `tlsSocket.getSharedSigalgs()` {#tlssocketgetsharedsigalgs}

**Добавлено в версии: v12.11.0**

- Возвращает: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Список алгоритмов подписи, разделяемых сервером и клиентом, в порядке убывания предпочтения.

Смотрите [SSL_get_shared_sigalgs](https://www.openssl.org/docs/man1.1.1/man3/SSL_get_shared_sigalgs) для получения дополнительной информации.

### `tlsSocket.getTLSTicket()` {#tlssocketgettlsticket}

**Добавлено в версии: v0.11.4**

- [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer)

Для клиента возвращает тикет TLS сессии, если таковой доступен, или `undefined`. Для сервера всегда возвращает `undefined`.

Может быть полезен для отладки.

Смотрите [Возобновление сессии](/ru/nodejs/api/tls#session-resumption) для получения дополнительной информации.

### `tlsSocket.getX509Certificate()` {#tlssocketgetx509certificate}

**Добавлено в версии: v15.9.0**

- Возвращает: [\<X509Certificate\>](/ru/nodejs/api/crypto#class-x509certificate)

Возвращает локальный сертификат как объект [\<X509Certificate\>](/ru/nodejs/api/crypto#class-x509certificate).

Если локальный сертификат отсутствует или сокет был уничтожен, будет возвращено `undefined`.

### `tlsSocket.isSessionReused()` {#tlssocketissessionreused}

**Добавлено в версии: v0.5.6**

- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, если сессия была повторно использована, `false` в противном случае.

Смотрите [Возобновление сессии](/ru/nodejs/api/tls#session-resumption) для получения дополнительной информации.

### `tlsSocket.localAddress` {#tlssocketlocaladdress}

**Добавлено в версии: v0.11.4**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Возвращает строковое представление локального IP-адреса.

### `tlsSocket.localPort` {#tlssocketlocalport}

**Добавлено в версии: v0.11.4**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Возвращает числовое представление локального порта.

### `tlsSocket.remoteAddress` {#tlssocketremoteaddress}

**Добавлено в версии: v0.11.4**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Возвращает строковое представление удалённого IP-адреса. Например, `'74.125.127.100'` или `'2001:4860:a005::68'`.


### `tlsSocket.remoteFamily` {#tlssocketremotefamily}

**Добавлено в версии: v0.11.4**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Возвращает строковое представление семейства удаленного IP-адреса. `'IPv4'` или `'IPv6'`.

### `tlsSocket.remotePort` {#tlssocketremoteport}

**Добавлено в версии: v0.11.4**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Возвращает числовое представление удаленного порта. Например, `443`.

### `tlsSocket.renegotiate(options, callback)` {#tlssocketrenegotiateoptions-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v18.0.0 | Передача недействительного колбэка в аргумент `callback` теперь выдает `ERR_INVALID_ARG_TYPE` вместо `ERR_INVALID_CALLBACK`. |
| v0.11.8 | Добавлено в версии: v0.11.8 |
:::

-  `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `rejectUnauthorized` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если не `false`, сертификат сервера проверяется по списку предоставленных CA. В случае неудачи проверки генерируется событие `'error'`; `err.code` содержит код ошибки OpenSSL. **По умолчанию:** `true`.
    - `requestCert`


-  `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Если `renegotiate()` вернула `true`, колбэк подключается один раз к событию `'secure'`. Если `renegotiate()` вернула `false`, `callback` будет вызван в следующем тике с ошибкой, если только `tlsSocket` не был уничтожен, в этом случае `callback` не будет вызван вообще.
-  Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, если пересогласование было инициировано, `false` в противном случае.

Метод `tlsSocket.renegotiate()` инициирует процесс пересогласования TLS. После завершения функции `callback` будет передан один аргумент, который является либо `Error` (если запрос не удался), либо `null`.

Этот метод можно использовать для запроса сертификата пира после установления безопасного соединения.

При работе в качестве сервера сокет будет уничтожен с ошибкой после таймаута `handshakeTimeout`.

Для TLSv1.3 пересогласование не может быть инициировано, оно не поддерживается протоколом.


### `tlsSocket.setKeyCert(context)` {#tlssocketsetkeycertcontext}

**Добавлено в: v22.5.0, v20.17.0**

- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<tls.SecureContext\>](/ru/nodejs/api/tls#tlscreatesecurecontextoptions) Объект, содержащий как минимум свойства `key` и `cert` из [`options` параметра `tls.createSecureContext()`](/ru/nodejs/api/tls#tlscreatesecurecontextoptions) или объект TLS-контекста, созданный с помощью [`tls.createSecureContext()`](/ru/nodejs/api/tls#tlscreatesecurecontextoptions).

Метод `tlsSocket.setKeyCert()` устанавливает закрытый ключ и сертификат для использования сокетом. Это в основном полезно, если вы хотите выбрать сертификат сервера из `ALPNCallback` TLS-сервера.

### `tlsSocket.setMaxSendFragment(size)` {#tlssocketsetmaxsendfragmentsize}

**Добавлено в: v0.11.11**

- `size` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Максимальный размер TLS-фрагмента. Максимальное значение — `16384`. **По умолчанию:** `16384`.
- Возвращает: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Метод `tlsSocket.setMaxSendFragment()` устанавливает максимальный размер TLS-фрагмента. Возвращает `true`, если установка ограничения прошла успешно; `false` в противном случае.

Меньшие размеры фрагментов уменьшают задержку буферизации на клиенте: большие фрагменты буферизуются уровнем TLS до тех пор, пока весь фрагмент не будет получен и его целостность не будет проверена; большие фрагменты могут охватывать несколько циклов приема-передачи, и их обработка может быть задержана из-за потери или переупорядочивания пакетов. Однако меньшие фрагменты добавляют дополнительные байты обрамления TLS и накладные расходы ЦП, что может снизить общую пропускную способность сервера.

## `tls.checkServerIdentity(hostname, cert)` {#tlscheckserveridentityhostname-cert}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v17.3.1, v16.13.2, v14.18.3, v12.22.9 | Поддержка альтернативных имен субъекта `uniformResourceIdentifier` была отключена в ответ на CVE-2021-44531. |
| v0.8.4 | Добавлено в: v0.8.4 |
:::

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Имя хоста или IP-адрес, для которого необходимо проверить сертификат.
- `cert` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [Объект сертификата](/ru/nodejs/api/tls#certificate-object), представляющий сертификат узла.
- Возвращает: [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

Проверяет, выдан ли сертификат `cert` для `hostname`.

Возвращает объект [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error), заполняя его значениями `reason`, `host` и `cert` в случае неудачи. В случае успеха возвращает [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type).

Эта функция предназначена для использования в сочетании с опцией `checkServerIdentity`, которую можно передать в [`tls.connect()`](/ru/nodejs/api/tls#tlsconnectoptions-callback), и поэтому работает с [объектом сертификата](/ru/nodejs/api/tls#certificate-object). Для других целей рассмотрите возможность использования [`x509.checkHost()`](/ru/nodejs/api/crypto#x509checkhostname-options) вместо этого.

Эта функция может быть переопределена путем предоставления альтернативной функции в качестве опции `options.checkServerIdentity`, которая передается в `tls.connect()`. Переопределяющая функция, конечно, может вызывать `tls.checkServerIdentity()`, чтобы дополнить проверки дополнительной верификацией.

Эта функция вызывается только в том случае, если сертификат прошел все остальные проверки, например, выдан доверенным ЦС (`options.ca`).

Более ранние версии Node.js неправильно принимали сертификаты для данного `hostname`, если присутствовало соответствующее альтернативное имя субъекта `uniformResourceIdentifier` (см. [CVE-2021-44531](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-44531)). Приложения, которые хотят принимать альтернативные имена субъекта `uniformResourceIdentifier`, могут использовать пользовательскую функцию `options.checkServerIdentity`, которая реализует желаемое поведение.


## `tls.connect(options[, callback])` {#tlsconnectoptions-callback}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v15.1.0, v14.18.0 | Добавлена опция `onread`. |
| v14.1.0, v13.14.0 | Теперь принимается опция `highWaterMark`. |
| v13.6.0, v12.16.0 | Теперь поддерживается опция `pskCallback`. |
| v12.9.0 | Поддержка опции `allowHalfOpen`. |
| v12.4.0 | Теперь поддерживается опция `hints`. |
| v12.2.0 | Теперь поддерживается опция `enableTrace`. |
| v11.8.0, v10.16.0 | Теперь поддерживается опция `timeout`. |
| v8.0.0 | Теперь поддерживается опция `lookup`. |
| v8.0.0 | Теперь опция `ALPNProtocols` может быть `TypedArray` или `DataView`. |
| v5.0.0 | Теперь поддерживаются опции ALPN. |
| v5.3.0, v4.7.0 | Теперь поддерживается опция `secureContext`. |
| v0.11.3 | Добавлено в: v0.11.3 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `enableTrace`: Смотрите [`tls.createServer()`](/ru/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Хост, к которому должен подключиться клиент. **По умолчанию:** `'localhost'`.
    - `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Порт, к которому должен подключиться клиент.
    - `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Создает соединение Unix-сокета по указанному пути. Если эта опция указана, `host` и `port` игнорируются.
    - `socket` [\<stream.Duplex\>](/ru/nodejs/api/stream#class-streamduplex) Устанавливает безопасное соединение на заданном сокете, а не создает новый сокет. Обычно это экземпляр [`net.Socket`](/ru/nodejs/api/net#class-netsocket), но разрешен любой поток `Duplex`. Если эта опция указана, `path`, `host` и `port` игнорируются, за исключением проверки сертификата. Обычно сокет уже подключен при передаче в `tls.connect()`, но он может быть подключен позже. Соединение/разъединение/уничтожение `socket` является ответственностью пользователя; вызов `tls.connect()` не приведет к вызову `net.connect()`.
    - `allowHalfOpen` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если установлено значение `false`, сокет автоматически завершит сторону записи, когда закончится сторона чтения. Если установлена опция `socket`, эта опция не действует. Подробности см. в опции `allowHalfOpen` в [`net.Socket`](/ru/nodejs/api/net#class-netsocket). **По умолчанию:** `false`.
    - `rejectUnauthorized` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если не `false`, сертификат сервера проверяется по списку предоставленных CA. В случае сбоя проверки возникает событие `'error'`; `err.code` содержит код ошибки OpenSSL. **По умолчанию:** `true`.
    - `pskCallback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Для согласования TLS-PSK см. [Предварительно общие ключи](/ru/nodejs/api/tls#pre-shared-keys).
    - `ALPNProtocols`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer[]\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Массив строк, `Buffer`s, `TypedArray`s или `DataView`s, или один `Buffer`, `TypedArray` или `DataView`, содержащий поддерживаемые протоколы ALPN. `Buffer`s должны иметь формат `[len][name][len][name]...` например, `'\x08http/1.1\x08http/1.0'`, где байт `len` — это длина следующего имени протокола. Передача массива обычно намного проще, например, `['http/1.1', 'http/1.0']`. Протоколы, расположенные выше в списке, имеют более высокий приоритет, чем протоколы, расположенные ниже.
    - `servername`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Имя сервера для расширения SNI (Server Name Indication) TLS. Это имя хоста, к которому выполняется подключение, и должно быть именем хоста, а не IP-адресом. Он может использоваться многодоменным сервером для выбора правильного сертификата для представления клиенту, см. опцию `SNICallback` для [`tls.createServer()`](/ru/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener).
    - `checkServerIdentity(servername, cert)` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Функция обратного вызова, которая будет использоваться (вместо встроенной функции `tls.checkServerIdentity()`) при проверке имени хоста сервера (или предоставленного `servername`, если он установлен явно) на соответствие сертификату. Она должна возвращать [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error), если проверка не удалась. Метод должен возвращать `undefined`, если `servername` и `cert` проверены.
    - `session` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) Экземпляр `Buffer`, содержащий сессию TLS.
    - `minDHSize` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Минимальный размер параметра DH в битах для принятия соединения TLS. Когда сервер предлагает параметр DH с размером меньше `minDHSize`, соединение TLS уничтожается и возникает ошибка. **По умолчанию:** `1024`.
    - `highWaterMark`: [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Соответствует параметру `highWaterMark` потока чтения. **По умолчанию:** `16 * 1024`.
    - `secureContext`: Объект контекста TLS, созданный с помощью [`tls.createSecureContext()`](/ru/nodejs/api/tls#tlscreatesecurecontextoptions). Если `secureContext` *не* предоставлен, он будет создан путем передачи всего объекта `options` в `tls.createSecureContext()`.
    - `onread` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Если опция `socket` отсутствует, входящие данные сохраняются в одном `buffer` и передаются в предоставленный `callback` при поступлении данных в сокет, в противном случае опция игнорируется. Подробности см. в опции `onread` в [`net.Socket`](/ru/nodejs/api/net#class-netsocket).
    - ...: Опции [`tls.createSecureContext()`](/ru/nodejs/api/tls#tlscreatesecurecontextoptions), которые используются, если опция `secureContext` отсутствует, в противном случае они игнорируются.
    - ...: Любая опция [`socket.connect()`](/ru/nodejs/api/net#socketconnectoptions-connectlistener), еще не указанная в списке.
  
 
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Возвращает: [\<tls.TLSSocket\>](/ru/nodejs/api/tls#class-tlstlssocket)

Функция `callback`, если указана, будет добавлена в качестве слушателя для события [`'secureConnect'`](/ru/nodejs/api/tls#event-secureconnect).

`tls.connect()` возвращает объект [`tls.TLSSocket`](/ru/nodejs/api/tls#class-tlstlssocket).

В отличие от API `https`, `tls.connect()` не включает расширение SNI (Server Name Indication) по умолчанию, что может привести к тому, что некоторые серверы вернут неправильный сертификат или отклонят соединение. Чтобы включить SNI, установите опцию `servername` в дополнение к `host`.

Следующий пример иллюстрирует клиент для примера эхо-сервера из [`tls.createServer()`](/ru/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener):

::: code-group
```js [ESM]
// Предполагается эхо-сервер, прослушивающий порт 8000.
import { connect } from 'node:tls';
import { readFileSync } from 'node:fs';
import { stdin } from 'node:process';

const options = {
  // Необходимо, только если сервер требует аутентификацию клиентского сертификата.
  key: readFileSync('client-key.pem'),
  cert: readFileSync('client-cert.pem'),

  // Необходимо, только если сервер использует самозаверяющий сертификат.
  ca: [ readFileSync('server-cert.pem') ],

  // Необходимо, только если сертификат сервера не для "localhost".
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
// Предполагается эхо-сервер, прослушивающий порт 8000.
const { connect } = require('node:tls');
const { readFileSync } = require('node:fs');

const options = {
  // Необходимо, только если сервер требует аутентификацию клиентского сертификата.
  key: readFileSync('client-key.pem'),
  cert: readFileSync('client-cert.pem'),

  // Необходимо, только если сервер использует самозаверяющий сертификат.
  ca: [ readFileSync('server-cert.pem') ],

  // Необходимо, только если сертификат сервера не для "localhost".
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

Чтобы создать сертификат и ключ для этого примера, выполните:

```bash [BASH]
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
  -keyout client-key.pem -out client-cert.pem
```
Затем, чтобы создать сертификат `server-cert.pem` для этого примера, выполните:

```bash [BASH]
openssl pkcs12 -certpbe AES-256-CBC -export -out server-cert.pem \
  -inkey client-key.pem -in client-cert.pem
```

## `tls.connect(path[, options][, callback])` {#tlsconnectpath-options-callback}

**Added in: v0.11.3**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Значение по умолчанию для `options.path`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) См. [`tls.connect()`](/ru/nodejs/api/tls#tlsconnectoptions-callback).
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) См. [`tls.connect()`](/ru/nodejs/api/tls#tlsconnectoptions-callback).
- Возвращает: [\<tls.TLSSocket\>](/ru/nodejs/api/tls#class-tlstlssocket)

То же, что и [`tls.connect()`](/ru/nodejs/api/tls#tlsconnectoptions-callback), за исключением того, что `path` может быть предоставлен в качестве аргумента вместо опции.

Опция `path`, если указана, будет иметь приоритет над аргументом `path`.

## `tls.connect(port[, host][, options][, callback])` {#tlsconnectport-host-options-callback}

**Added in: v0.11.3**

- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Значение по умолчанию для `options.port`.
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Значение по умолчанию для `options.host`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) См. [`tls.connect()`](/ru/nodejs/api/tls#tlsconnectoptions-callback).
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) См. [`tls.connect()`](/ru/nodejs/api/tls#tlsconnectoptions-callback).
- Возвращает: [\<tls.TLSSocket\>](/ru/nodejs/api/tls#class-tlstlssocket)

То же, что и [`tls.connect()`](/ru/nodejs/api/tls#tlsconnectoptions-callback), за исключением того, что `port` и `host` могут быть предоставлены в качестве аргументов вместо опций.

Опция `port` или `host`, если указана, будет иметь приоритет над любым аргументом `port` или `host`.

## `tls.createSecureContext([options])` {#tlscreatesecurecontextoptions}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v22.9.0, v20.18.0 | Добавлена опция `allowPartialTrustChain`. |
| v22.4.0, v20.16.0 | Опции `clientCertEngine`, `privateKeyEngine` и `privateKeyIdentifier` зависят от поддержки пользовательских движков в OpenSSL, которая устарела в OpenSSL 3. |
| v19.8.0, v18.16.0 | Опции `dhparam` теперь можно установить значение `'auto'`, чтобы включить DHE с соответствующими общеизвестными параметрами. |
| v12.12.0 | Добавлены опции `privateKeyIdentifier` и `privateKeyEngine` для получения закрытого ключа из движка OpenSSL. |
| v12.11.0 | Добавлена опция `sigalgs` для переопределения поддерживаемых алгоритмов подписи. |
| v12.0.0 | Добавлена поддержка TLSv1.3. |
| v11.5.0 | Опция `ca:` теперь поддерживает `BEGIN TRUSTED CERTIFICATE`. |
| v11.4.0, v10.16.0 | `minVersion` и `maxVersion` можно использовать для ограничения разрешенных версий протокола TLS. |
| v10.0.0 | `ecdhCurve` больше нельзя установить в `false` из-за изменений в OpenSSL. |
| v9.3.0 | Параметр `options` теперь может включать `clientCertEngine`. |
| v9.0.0 | Опция `ecdhCurve` теперь может быть несколькими именами кривых, разделенными символом `':'`, или `'auto'`. |
| v7.3.0 | Если опция `key` является массивом, отдельным записям больше не требуется свойство `passphrase`. Записи `Array` теперь также могут быть просто `string` или `Buffer`. |
| v5.2.0 | Опция `ca` теперь может быть одной строкой, содержащей несколько сертификатов CA. |
| v0.11.13 | Added in: v0.11.13 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `allowPartialTrustChain` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Считать промежуточные (несамоподписанные) сертификаты в списке доверенных сертификатов CA как доверенные.
    - `ca` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<Buffer[]\>](/ru/nodejs/api/buffer#class-buffer) При необходимости переопределите доверенные сертификаты CA. По умолчанию доверяет общеизвестным центрам сертификации, курируемым Mozilla. Центры сертификации Mozilla полностью заменяются, когда центры сертификации явно указаны с помощью этой опции. Значение может быть строкой или `Buffer`, или `Array` строк и/или `Buffer`. Любая строка или `Buffer` может содержать несколько PEM CA, объединенных вместе. Сертификат пира должен быть связан с CA, которому доверяет сервер, для аутентификации соединения. При использовании сертификатов, которые не связаны с общеизвестным CA, CA сертификата должен быть явно указан как доверенный, иначе соединение не сможет пройти аутентификацию. Если одноранговый узел использует сертификат, который не соответствует или не связан с одним из центров сертификации по умолчанию, используйте опцию `ca`, чтобы предоставить сертификат центра сертификации, с которым сертификат однорангового узла может соответствовать или быть связанным. Для самоподписанных сертификатов сертификат является собственным CA и должен быть предоставлен. Для сертификатов, закодированных в PEM, поддерживаются типы "TRUSTED CERTIFICATE", "X509 CERTIFICATE" и "CERTIFICATE". См. также [`tls.rootCertificates`](/ru/nodejs/api/tls#tlsrootcertificates).
    - `cert` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<Buffer[]\>](/ru/nodejs/api/buffer#class-buffer) Цепочки сертификатов в формате PEM. Одна цепочка сертификатов должна быть предоставлена для каждого закрытого ключа. Каждая цепочка сертификатов должна состоять из сертификата в формате PEM для предоставленного закрытого `key`, за которым следуют промежуточные сертификаты в формате PEM (если таковые имеются) в порядке очереди и не включая корневой CA (корневой CA должен быть предварительно известен одноранговому узлу, см. `ca`). При предоставлении нескольких цепочек сертификатов они не обязательно должны быть в том же порядке, что и их закрытые ключи в `key`. Если промежуточные сертификаты не предоставлены, одноранговый узел не сможет проверить сертификат, и подтверждение связи не удастся.
    - `sigalgs` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Список поддерживаемых алгоритмов подписи, разделенных двоеточиями. Список может содержать алгоритмы дайджеста (`SHA256`, `MD5` и т. д.), алгоритмы открытого ключа (`RSA-PSS`, `ECDSA` и т. д.), комбинацию обоих (например, `RSA+SHA384`) или имена схемы TLS v1.3 (например, `rsa_pss_pss_sha512`). См. [Страницы руководства OpenSSL](https://www.openssl.org/docs/man1.1.1/man3/SSL_CTX_set1_sigalgs_list) для получения дополнительной информации.
    - `ciphers` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Спецификация набора шифров, заменяющая значение по умолчанию. Дополнительные сведения см. в разделе [Изменение набора шифров TLS по умолчанию](/ru/nodejs/api/tls#modifying-the-default-tls-cipher-suite). Разрешенные шифры можно получить с помощью [`tls.getCiphers()`](/ru/nodejs/api/tls#tlsgetciphers). Имена шифров должны быть в верхнем регистре, чтобы OpenSSL принял их.
    - `clientCertEngine` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Имя движка OpenSSL, который может предоставить сертификат клиента. **Устарело.**
    - `crl` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<Buffer[]\>](/ru/nodejs/api/buffer#class-buffer) CRL (Списки отзыва сертификатов) в формате PEM.
    - `dhparam` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) `'auto'` или пользовательские параметры Диффи-Хеллмана, необходимые для не-ECDHE [идеальной прямой секретности](/ru/nodejs/api/tls#perfect-forward-secrecy). Если он опущен или недействителен, параметры молча отбрасываются, и шифры DHE будут недоступны. [Идеальная прямая секретность](/ru/nodejs/api/tls#perfect-forward-secrecy) на основе [ECDHE](https://en.wikipedia.org/wiki/Elliptic_curve_Diffie%E2%80%93Hellman) все равно будет доступна.
    - `ecdhCurve` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Строка, описывающая именованную кривую или список NID или имен кривых, разделенных двоеточиями, например `P-521:P-384:P-256`, для использования для согласования ключей ECDH. Установите значение `auto`, чтобы выбрать кривую автоматически. Используйте [`crypto.getCurves()`](/ru/nodejs/api/crypto#cryptogetcurves), чтобы получить список доступных имен кривых. В последних версиях `openssl ecparam -list_curves` также отобразит имя и описание каждой доступной эллиптической кривой. **По умолчанию:** [`tls.DEFAULT_ECDH_CURVE`](/ru/nodejs/api/tls#tlsdefault_ecdh_curve).
    - `honorCipherOrder` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Попытайтесь использовать предпочтения набора шифров сервера вместо предпочтений клиента. Когда `true`, заставляет `SSL_OP_CIPHER_SERVER_PREFERENCE` быть установленным в `secureOptions`, см. [Опции OpenSSL](/ru/nodejs/api/crypto#openssl-options) для получения дополнительной информации.
    - `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<Buffer[]\>](/ru/nodejs/api/buffer#class-buffer) | [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Закрытые ключи в формате PEM. PEM позволяет шифровать закрытые ключи. Зашифрованные ключи будут расшифрованы с помощью `options.passphrase`. Несколько ключей, использующих разные алгоритмы, можно предоставить в виде массива незашифрованных строк или буферов ключей или массива объектов в форме `{pem: \<string|buffer\>[, passphrase: \<string\>]}`. Форма объекта может встречаться только в массиве. `object.passphrase` является необязательным. Зашифрованные ключи будут расшифрованы с помощью `object.passphrase`, если он указан, или `options.passphrase`, если его нет.
    - `privateKeyEngine` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Имя движка OpenSSL, из которого можно получить закрытый ключ. Следует использовать вместе с `privateKeyIdentifier`. **Устарело.**
    - `privateKeyIdentifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Идентификатор закрытого ключа, управляемого движком OpenSSL. Следует использовать вместе с `privateKeyEngine`. Не следует устанавливать вместе с `key`, поскольку оба параметра определяют закрытый ключ разными способами. **Устарело.**
    - `maxVersion` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) При необходимости установите максимально допустимую версию TLS. Одно из значений: `'TLSv1.3'`, `'TLSv1.2'`, `'TLSv1.1'` или `'TLSv1'`. Не может быть указано вместе с опцией `secureProtocol`; используйте одно или другое. **По умолчанию:** [`tls.DEFAULT_MAX_VERSION`](/ru/nodejs/api/tls#tlsdefault_max_version).
    - `minVersion` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) При необходимости установите минимально допустимую версию TLS. Одно из значений: `'TLSv1.3'`, `'TLSv1.2'`, `'TLSv1.1'` или `'TLSv1'`. Не может быть указано вместе с опцией `secureProtocol`; используйте одно или другое. Не рекомендуется устанавливать значение меньше TLSv1.2, но это может потребоваться для совместимости. Версии до TLSv1.2 могут потребовать понижения [Уровня безопасности OpenSSL](/ru/nodejs/api/tls#openssl-security-level). **По умолчанию:** [`tls.DEFAULT_MIN_VERSION`](/ru/nodejs/api/tls#tlsdefault_min_version).
    - `passphrase` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Общий пароль, используемый для одного закрытого ключа и/или PFX.
    - `pfx` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<Buffer[]\>](/ru/nodejs/api/buffer#class-buffer) | [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Закрытый ключ и цепочка сертификатов, закодированные в PFX или PKCS12. `pfx` — это альтернатива предоставлению `key` и `cert` по отдельности. PFX обычно зашифрован, и если это так, `passphrase` будет использоваться для его расшифровки. Несколько PFX можно предоставить либо в виде массива незашифрованных буферов PFX, либо в виде массива объектов в форме `{buf: \<string|buffer\>[, passphrase: \<string\>]}`. Форма объекта может встречаться только в массиве. `object.passphrase` является необязательным. Зашифрованные PFX будут расшифрованы с помощью `object.passphrase`, если он указан, или `options.passphrase`, если его нет.
    - `secureOptions` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) При необходимости влияет на поведение протокола OpenSSL, что обычно не требуется. Это следует использовать осторожно, если вообще использовать! Значение представляет собой числовую битовую маску параметров `SSL_OP_*` из [Опции OpenSSL](/ru/nodejs/api/crypto#openssl-options).
    - `secureProtocol` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Устаревший механизм выбора версии протокола TLS для использования, он не поддерживает независимое управление минимальной и максимальной версией и не поддерживает ограничение протокола до TLSv1.3. Вместо этого используйте `minVersion` и `maxVersion`. Возможные значения перечислены как [SSL_METHODS](https://www.openssl.org/docs/man1.1.1/man7/ssl#Dealing-with-Protocol-Methods), используйте имена функций в виде строк. Например, используйте `'TLSv1_1_method'`, чтобы принудительно использовать TLS версии 1.1, или `'TLS_method'`, чтобы разрешить любую версию протокола TLS до TLSv1.3. Не рекомендуется использовать версии TLS младше 1.2, но это может потребоваться для совместимости. **По умолчанию:** отсутствует, см. `minVersion`.
    - `sessionIdContext` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Непрозрачный идентификатор, используемый серверами для обеспечения того, чтобы состояние сеанса не совместно использовалось между приложениями. Не используется клиентами.
    - `ticketKeys`: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) 48 байт криптографически надежных псевдослучайных данных. Дополнительные сведения см. в разделе [Возобновление сеанса](/ru/nodejs/api/tls#session-resumption).
    - `sessionTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество секунд, по истечении которых сеанс TLS, созданный сервером, больше не может быть возобновлен. Дополнительные сведения см. в разделе [Возобновление сеанса](/ru/nodejs/api/tls#session-resumption). **По умолчанию:** `300`.
  
 

[`tls.createServer()`](/ru/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener) устанавливает значение по умолчанию для опции `honorCipherOrder` в `true`, другие API, которые создают безопасные контексты, оставляют его неустановленным.

[`tls.createServer()`](/ru/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener) использует усеченное 128-битное значение хеша SHA1, сгенерированное из `process.argv`, в качестве значения по умолчанию для опции `sessionIdContext`, другие API, которые создают безопасные контексты, не имеют значения по умолчанию.

Метод `tls.createSecureContext()` создает объект `SecureContext`. Его можно использовать в качестве аргумента для нескольких API `tls`, таких как [`server.addContext()`](/ru/nodejs/api/tls#serveraddcontexthostname-context), но он не имеет общедоступных методов. Конструктор [`tls.Server`](/ru/nodejs/api/tls#class-tlsserver) и метод [`tls.createServer()`](/ru/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener) не поддерживают опцию `secureContext`.

Ключ *требуется* для шифров, которые используют сертификаты. Для его предоставления можно использовать либо `key`, либо `pfx`.

Если опция `ca` не указана, Node.js по умолчанию будет использовать [общедоступный список доверенных центров сертификации Mozilla](https://hg.mozilla.org/mozilla-central/raw-file/tip/security/nss/lib/ckfw/builtins/certdata.txt).

Пользовательские параметры DHE не рекомендуются в пользу новой опции `dhparam: 'auto'`. Если установлено значение `'auto'`, автоматически выбираются общеизвестные параметры DHE достаточной надежности. В противном случае, при необходимости, для создания пользовательских параметров можно использовать `openssl dhparam`. Длина ключа должна быть больше или равна 1024 битам, иначе будет выдана ошибка. Хотя 1024 бита допустимы, используйте 2048 битов или больше для большей безопасности.


## `tls.createSecurePair([context][, isServer][, requestCert][, rejectUnauthorized][, options])` {#tlscreatesecurepaircontext-isserver-requestcert-rejectunauthorized-options}

::: info [История изменений]
| Версия | Изменения |
| --- | --- |
| v5.0.0 | Теперь поддерживаются опции ALPN. |
| v0.11.3 | Устарело с версии: v0.11.3 |
| v0.3.2 | Добавлено в версии: v0.3.2 |
:::

::: danger [Стабильность: 0 - Устарело]
[Стабильность: 0](/ru/nodejs/api/documentation#stability-index) [Стабильность: 0](/ru/nodejs/api/documentation#stability-index) - Устарело: Используйте [`tls.TLSSocket`](/ru/nodejs/api/tls#class-tlstlssocket) вместо этого.
:::

- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Объект безопасного контекста, возвращаемый функцией `tls.createSecureContext()`
- `isServer` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, чтобы указать, что это TLS-соединение должно быть открыто как сервер.
- `requestCert` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true`, чтобы указать, должен ли сервер запрашивать сертификат у подключающегося клиента. Применяется только тогда, когда `isServer` равно `true`.
- `rejectUnauthorized` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если не `false`, сервер автоматически отклоняет клиентов с недействительными сертификатами. Применяется только тогда, когда `isServer` равно `true`.
- `options`
    - `enableTrace`: См. [`tls.createServer()`](/ru/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `secureContext`: Объект TLS-контекста из [`tls.createSecureContext()`](/ru/nodejs/api/tls#tlscreatesecurecontextoptions)
    - `isServer`: Если `true`, TLS-сокет будет создан в режиме сервера. **По умолчанию:** `false`.
    - `server` [\<net.Server\>](/ru/nodejs/api/net#class-netserver) Экземпляр [`net.Server`](/ru/nodejs/api/net#class-netserver)
    - `requestCert`: См. [`tls.createServer()`](/ru/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `rejectUnauthorized`: См. [`tls.createServer()`](/ru/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `ALPNProtocols`: См. [`tls.createServer()`](/ru/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `SNICallback`: См. [`tls.createServer()`](/ru/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `session` [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) Экземпляр `Buffer`, содержащий TLS-сессию.
    - `requestOCSP` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, указывает, что расширение запроса статуса OCSP будет добавлено в приветствие клиента, и событие `'OCSPResponse'` будет сгенерировано на сокете перед установкой безопасной связи.

Создает новый объект безопасной пары с двумя потоками, один из которых читает и записывает зашифрованные данные, а другой читает и записывает данные в открытом виде. Как правило, зашифрованный поток перенаправляется в/из входящего потока зашифрованных данных, а поток с открытым текстом используется в качестве замены исходного зашифрованного потока.

`tls.createSecurePair()` возвращает объект `tls.SecurePair` со свойствами потока `cleartext` и `encrypted`.

Использование `cleartext` имеет тот же API, что и [`tls.TLSSocket`](/ru/nodejs/api/tls#class-tlstlssocket).

Метод `tls.createSecurePair()` теперь устарел в пользу `tls.TLSSocket()`. Например, код:

```js [ESM]
pair = tls.createSecurePair(/* ... */);
pair.encrypted.pipe(socket);
socket.pipe(pair.encrypted);
```
можно заменить на:

```js [ESM]
secureSocket = tls.TLSSocket(socket, options);
```
где `secureSocket` имеет тот же API, что и `pair.cleartext`.


## `tls.createServer([options][, secureConnectionListener])` {#tlscreateserveroptions-secureconnectionlistener}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v22.4.0, v20.16.0 | Параметр `clientCertEngine` зависит от поддержки пользовательского движка в OpenSSL, который устарел в OpenSSL 3. |
| v19.0.0 | Если установлен `ALPNProtocols`, входящие соединения, отправляющие расширение ALPN без поддерживаемых протоколов, завершаются фатальным предупреждением `no_application_protocol`. |
| v20.4.0, v18.19.0 | Параметр `options` теперь может включать `ALPNCallback`. |
| v12.3.0 | Параметр `options` теперь поддерживает параметры `net.createServer()`. |
| v9.3.0 | Параметр `options` теперь может включать `clientCertEngine`. |
| v8.0.0 | Параметр `ALPNProtocols` теперь может быть `TypedArray` или `DataView`. |
| v5.0.0 | Теперь поддерживаются параметры ALPN. |
| v0.3.2 | Добавлено в версии: v0.3.2 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ALPNProtocols`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer[]\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) Массив строк, `Buffer`ов, `TypedArray` или `DataView` или один `Buffer`, `TypedArray` или `DataView`, содержащий поддерживаемые протоколы ALPN. `Buffer` должны иметь формат `[len][name][len][name]...`, например `0x05hello0x05world`, где первый байт - длина следующего имени протокола. Передача массива обычно намного проще, например `['hello', 'world']`. (Протоколы должны быть упорядочены по приоритету.)
    - `ALPNCallback`: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Если установлено, это будет вызвано, когда клиент откроет соединение с использованием расширения ALPN. В обратный вызов будет передан один аргумент: объект, содержащий поля `servername` и `protocols`, соответственно содержащие имя сервера из расширения SNI (если есть) и массив строк имен протоколов ALPN. Обратный вызов должен вернуть либо одну из строк, перечисленных в `protocols`, которая будет возвращена клиенту в качестве выбранного протокола ALPN, либо `undefined`, чтобы отклонить соединение с фатальным предупреждением. Если возвращается строка, которая не соответствует одному из протоколов ALPN клиента, будет выдана ошибка. Этот параметр нельзя использовать с параметром `ALPNProtocols`, и установка обоих параметров вызовет ошибку.
    - `clientCertEngine` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Имя движка OpenSSL, который может предоставить сертификат клиента. **Устарело.**
    - `enableTrace` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, [`tls.TLSSocket.enableTrace()`](/ru/nodejs/api/tls#tlssocketenabletrace) будет вызван для новых соединений. Трассировку можно включить после установления безопасного соединения, но этот параметр необходимо использовать для трассировки настройки безопасного соединения. **По умолчанию:** `false`.
    - `handshakeTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Прервать соединение, если SSL/TLS handshake не завершится за указанное количество миллисекунд. Событие `'tlsClientError'` генерируется на объекте `tls.Server` всякий раз, когда истекает время ожидания handshake. **По умолчанию:** `120000` (120 секунд).
    - `rejectUnauthorized` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если не `false`, сервер отклонит любое соединение, которое не авторизовано списком предоставленных CA. Этот параметр действует только в том случае, если `requestCert` имеет значение `true`. **По умолчанию:** `true`.
    - `requestCert` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Если `true`, сервер запросит сертификат у подключающихся клиентов и попытается проверить этот сертификат. **По умолчанию:** `false`.
    - `sessionTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Количество секунд, по истечении которых сеанс TLS, созданный сервером, больше не сможет быть возобновлен. Дополнительную информацию см. в разделе [Возобновление сеанса](/ru/nodejs/api/tls#session-resumption). **По умолчанию:** `300`.
    - `SNICallback(servername, callback)` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Функция, которая будет вызываться, если клиент поддерживает расширение SNI TLS. При вызове будут переданы два аргумента: `servername` и `callback`. `callback` - это обратный вызов с первым аргументом ошибки, который принимает два необязательных аргумента: `error` и `ctx`. `ctx`, если указан, является экземпляром `SecureContext`. [`tls.createSecureContext()`](/ru/nodejs/api/tls#tlscreatesecurecontextoptions) можно использовать для получения правильного `SecureContext`. Если `callback` вызывается с ложным аргументом `ctx`, будет использоваться контекст безопасности сервера по умолчанию. Если `SNICallback` не был предоставлен, будет использоваться обратный вызов по умолчанию с API высокого уровня (см. ниже).
    - `ticketKeys`: [\<Buffer\>](/ru/nodejs/api/buffer#class-buffer) 48 байтов криптографически стойких псевдослучайных данных. Дополнительную информацию см. в разделе [Возобновление сеанса](/ru/nodejs/api/tls#session-resumption).
    - `pskCallback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Для согласования TLS-PSK см. [Предварительно общие ключи](/ru/nodejs/api/tls#pre-shared-keys).
    - `pskIdentityHint` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Необязательная подсказка для отправки клиенту, чтобы помочь с выбором удостоверения во время согласования TLS-PSK. Будет проигнорировано в TLS 1.3. При сбое установки pskIdentityHint будет выдано `'tlsClientError'` с кодом `'ERR_TLS_PSK_SET_IDENTITY_HINT_FAILED'`.
    - ...: Может быть предоставлен любой параметр [`tls.createSecureContext()`](/ru/nodejs/api/tls#tlscreatesecurecontextoptions). Для серверов обычно требуются параметры удостоверения (`pfx`, `key`/`cert` или `pskCallback`).
    - ...: Может быть предоставлен любой параметр [`net.createServer()`](/ru/nodejs/api/net#netcreateserveroptions-connectionlistener).
  
 
- `secureConnectionListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- Возвращает: [\<tls.Server\>](/ru/nodejs/api/tls#class-tlsserver)

Создает новый [`tls.Server`](/ru/nodejs/api/tls#class-tlsserver). `secureConnectionListener`, если указан, автоматически устанавливается как прослушиватель для события [`'secureConnection'`](/ru/nodejs/api/tls#event-secureconnection).

Параметр `ticketKeys` автоматически совместно используется между рабочими `node:cluster`.

Ниже показан простой эхо-сервер:

::: code-group
```js [ESM]
import { createServer } from 'node:tls';
import { readFileSync } from 'node:fs';

const options = {
  key: readFileSync('server-key.pem'),
  cert: readFileSync('server-cert.pem'),

  // Это необходимо только при использовании аутентификации по сертификату клиента.
  requestCert: true,

  // Это необходимо только в том случае, если клиент использует самозаверяющий сертификат.
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

  // Это необходимо только при использовании аутентификации по сертификату клиента.
  requestCert: true,

  // Это необходимо только в том случае, если клиент использует самозаверяющий сертификат.
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

Чтобы сгенерировать сертификат и ключ для этого примера, выполните:

```bash [BASH]
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
  -keyout server-key.pem -out server-cert.pem
```
Затем, чтобы сгенерировать сертификат `client-cert.pem` для этого примера, выполните:

```bash [BASH]
openssl pkcs12 -certpbe AES-256-CBC -export -out client-cert.pem \
  -inkey server-key.pem -in server-cert.pem
```
Сервер можно протестировать, подключившись к нему с помощью примера клиента из [`tls.connect()`](/ru/nodejs/api/tls#tlsconnectoptions-callback).


## `tls.getCiphers()` {#tlsgetciphers}

**Added in: v0.10.2**

- Returns: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Возвращает массив с именами поддерживаемых TLS-шифров. Имена написаны в нижнем регистре по историческим причинам, но должны быть в верхнем регистре для использования в опции `ciphers` в [`tls.createSecureContext()`](/ru/nodejs/api/tls#tlscreatesecurecontextoptions).

Не все поддерживаемые шифры включены по умолчанию. См. [Изменение набора шифров TLS по умолчанию](/ru/nodejs/api/tls#modifying-the-default-tls-cipher-suite).

Имена шифров, начинающиеся с `'tls_'`, предназначены для TLSv1.3, все остальные - для TLSv1.2 и ниже.

```js [ESM]
console.log(tls.getCiphers()); // ['aes128-gcm-sha256', 'aes128-sha', ...]
```
## `tls.rootCertificates` {#tlsrootcertificates}

**Added in: v12.3.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Неизменяемый массив строк, представляющий корневые сертификаты (в формате PEM) из встроенного хранилища Mozilla CA, предоставляемого текущей версией Node.js.

Встроенное хранилище CA, предоставляемое Node.js, представляет собой снимок хранилища Mozilla CA, который фиксируется во время выпуска. Он идентичен на всех поддерживаемых платформах.

## `tls.DEFAULT_ECDH_CURVE` {#tlsdefault_ecdh_curve}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v10.0.0 | Значение по умолчанию изменено на `'auto'`. |
| v0.11.13 | Added in: v0.11.13 |
:::

Имя кривой по умолчанию для использования в согласовании ключей ECDH в TLS-сервере. Значение по умолчанию - `'auto'`. См. [`tls.createSecureContext()`](/ru/nodejs/api/tls#tlscreatesecurecontextoptions) для получения дополнительной информации.

## `tls.DEFAULT_MAX_VERSION` {#tlsdefault_max_version}

**Added in: v11.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Значение по умолчанию для опции `maxVersion` в [`tls.createSecureContext()`](/ru/nodejs/api/tls#tlscreatesecurecontextoptions). Ему можно присвоить любую из поддерживаемых версий протокола TLS, `'TLSv1.3'`, `'TLSv1.2'`, `'TLSv1.1'` или `'TLSv1'`. **По умолчанию:** `'TLSv1.3'`, если не изменено с помощью параметров CLI. Использование `--tls-max-v1.2` устанавливает значение по умолчанию на `'TLSv1.2'`. Использование `--tls-max-v1.3` устанавливает значение по умолчанию на `'TLSv1.3'`. Если предоставлено несколько параметров, используется наивысший максимум.


## `tls.DEFAULT_MIN_VERSION` {#tlsdefault_min_version}

**Добавлено в версии: v11.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Значение по умолчанию для параметра `minVersion` функции [`tls.createSecureContext()`](/ru/nodejs/api/tls#tlscreatesecurecontextoptions). Ему можно присвоить любую из поддерживаемых версий протокола TLS: `'TLSv1.3'`, `'TLSv1.2'`, `'TLSv1.1'` или `'TLSv1'`. Версии до TLSv1.2 могут потребовать понижения [Уровня безопасности OpenSSL](/ru/nodejs/api/tls#openssl-security-level). **По умолчанию:** `'TLSv1.2'`, если не изменено с помощью параметров CLI. Использование `--tls-min-v1.0` устанавливает значение по умолчанию `'TLSv1'`. Использование `--tls-min-v1.1` устанавливает значение по умолчанию `'TLSv1.1'`. Использование `--tls-min-v1.3` устанавливает значение по умолчанию `'TLSv1.3'`. Если предоставлено несколько параметров, используется наименьший минимум.

## `tls.DEFAULT_CIPHERS` {#tlsdefault_ciphers}

**Добавлено в версии: v19.8.0, v18.16.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Значение по умолчанию для параметра `ciphers` функции [`tls.createSecureContext()`](/ru/nodejs/api/tls#tlscreatesecurecontextoptions). Ему можно присвоить любой из поддерживаемых OpenSSL шифров. По умолчанию используется содержимое `crypto.constants.defaultCoreCipherList`, если не изменено с помощью параметров CLI с использованием `--tls-default-ciphers`.

