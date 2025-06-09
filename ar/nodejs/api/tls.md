---
title: توثيق Node.js - TLS (أمان طبقة النقل)
description: يغطي هذا القسم من توثيق Node.js وحدة TLS (أمان طبقة النقل)، التي توفر تنفيذ بروتوكولات TLS و SSL. يشمل ذلك تفاصيل حول إنشاء اتصالات آمنة، وإدارة الشهادات، والتعامل مع الاتصال الآمن، والعديد من الخيارات لتكوين TLS/SSL في تطبيقات Node.js.
head:
  - - meta
    - name: og:title
      content: توثيق Node.js - TLS (أمان طبقة النقل) | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: يغطي هذا القسم من توثيق Node.js وحدة TLS (أمان طبقة النقل)، التي توفر تنفيذ بروتوكولات TLS و SSL. يشمل ذلك تفاصيل حول إنشاء اتصالات آمنة، وإدارة الشهادات، والتعامل مع الاتصال الآمن، والعديد من الخيارات لتكوين TLS/SSL في تطبيقات Node.js.
  - - meta
    - name: twitter:title
      content: توثيق Node.js - TLS (أمان طبقة النقل) | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: يغطي هذا القسم من توثيق Node.js وحدة TLS (أمان طبقة النقل)، التي توفر تنفيذ بروتوكولات TLS و SSL. يشمل ذلك تفاصيل حول إنشاء اتصالات آمنة، وإدارة الشهادات، والتعامل مع الاتصال الآمن، والعديد من الخيارات لتكوين TLS/SSL في تطبيقات Node.js.
---


# TLS (SSL) {#tls-ssl}

::: tip [Stable: 2 - Stable]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر
:::

**شفرة المصدر:** [lib/tls.js](https://github.com/nodejs/node/blob/v23.5.0/lib/tls.js)

توفر وحدة `node:tls` تطبيقًا لبروتوكولات أمان طبقة النقل (TLS) وطبقة المقابس الآمنة (SSL) المبنية على OpenSSL. يمكن الوصول إلى الوحدة باستخدام:

::: code-group
```js [ESM]
import tls from 'node:tls';
```

```js [CJS]
const tls = require('node:tls');
```
:::

## تحديد ما إذا كان دعم التشفير غير متوفر {#determining-if-crypto-support-is-unavailable}

من الممكن إنشاء Node.js بدون تضمين دعم وحدة `node:crypto`. في مثل هذه الحالات، ستؤدي محاولة `import` من `tls` أو استدعاء `require('node:tls')` إلى حدوث خطأ.

عند استخدام CommonJS، يمكن التقاط الخطأ الذي تم طرحه باستخدام try/catch:

```js [CJS]
let tls;
try {
  tls = require('node:tls');
} catch (err) {
  console.error('tls support is disabled!');
}
```
عند استخدام الكلمة المفتاحية `import` المعجمية لـ ESM، لا يمكن التقاط الخطأ إلا إذا تم تسجيل معالج لـ `process.on('uncaughtException')` *قبل* إجراء أي محاولة لتحميل الوحدة (باستخدام، على سبيل المثال، وحدة التحميل المسبق).

عند استخدام ESM، إذا كانت هناك فرصة لتشغيل التعليمات البرمجية على إصدار من Node.js حيث لم يتم تمكين دعم التشفير، ففكر في استخدام الدالة [`import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) بدلاً من الكلمة المفتاحية `import` المعجمية:

```js [ESM]
let tls;
try {
  tls = await import('node:tls');
} catch (err) {
  console.error('tls support is disabled!');
}
```
## مفاهيم TLS/SSL {#tls/ssl-concepts}

TLS/SSL هي مجموعة من البروتوكولات التي تعتمد على بنية المفتاح العام (PKI) لتمكين الاتصال الآمن بين العميل والخادم. بالنسبة لمعظم الحالات الشائعة، يجب أن يكون لكل خادم مفتاح خاص.

يمكن إنشاء المفاتيح الخاصة بعدة طرق. يوضح المثال أدناه استخدام واجهة سطر الأوامر OpenSSL لإنشاء مفتاح خاص RSA ذي 2048 بت:

```bash [BASH]
openssl genrsa -out ryans-key.pem 2048
```
باستخدام TLS/SSL، يجب أن يكون لجميع الخوادم (وبعض العملاء) *شهادة*. الشهادات هي *مفاتيح عامة* تتوافق مع مفتاح خاص، ويتم توقيعها رقميًا إما بواسطة مرجع مصدق أو بواسطة مالك المفتاح الخاص (يشار إلى هذه الشهادات باسم "موقعة ذاتيًا"). الخطوة الأولى للحصول على شهادة هي إنشاء ملف *طلب توقيع الشهادة* (CSR).

يمكن استخدام واجهة سطر الأوامر OpenSSL لإنشاء CSR لمفتاح خاص:

```bash [BASH]
openssl req -new -sha256 -key ryans-key.pem -out ryans-csr.pem
```
بمجرد إنشاء ملف CSR، يمكن إرساله إلى مرجع مصدق للتوقيع أو استخدامه لإنشاء شهادة موقعة ذاتيًا.

يوضح المثال التالي إنشاء شهادة موقعة ذاتيًا باستخدام واجهة سطر الأوامر OpenSSL:

```bash [BASH]
openssl x509 -req -in ryans-csr.pem -signkey ryans-key.pem -out ryans-cert.pem
```
بمجرد إنشاء الشهادة، يمكن استخدامها لإنشاء ملف `.pfx` أو `.p12`:

```bash [BASH]
openssl pkcs12 -export -in ryans-cert.pem -inkey ryans-key.pem \
      -certfile ca-cert.pem -out ryans.pfx
```
أين:

- `in`: هي الشهادة الموقعة
- `inkey`: هو المفتاح الخاص المرتبط بها
- `certfile`: عبارة عن سلسلة متسلسلة من جميع شهادات مرجع الشهادة (CA) في ملف واحد، على سبيل المثال `cat ca1-cert.pem ca2-cert.pem \> ca-cert.pem`


### السرية الأمامية التامة {#perfect-forward-secrecy}

يصف مصطلح *<a href="https://en.wikipedia.org/wiki/Perfect_forward_secrecy">السرية الأمامية</a>* أو *السرية الأمامية التامة* ميزة لطرق الاتفاق على المفاتيح (أي تبادل المفاتيح). أي أن مفاتيح الخادم والعميل تُستخدم للتفاوض على مفاتيح مؤقتة جديدة تُستخدم تحديدًا وفقط لجلسة الاتصال الحالية. عمليًا، هذا يعني أنه حتى إذا تم اختراق المفتاح الخاص للخادم، لا يمكن للمتطفلين فك تشفير الاتصال إلا إذا تمكن المهاجم من الحصول على زوج المفاتيح الذي تم إنشاؤه خصيصًا للجلسة.

يتم تحقيق السرية الأمامية التامة عن طريق إنشاء زوج مفاتيح عشوائيًا للاتفاق على المفاتيح في كل مصافحة TLS/SSL (على عكس استخدام نفس المفتاح لجميع الجلسات). تسمى الطرق التي تنفذ هذه التقنية "زائلة".

تُستخدم حاليًا طريقتان بشكل شائع لتحقيق السرية الأمامية التامة (لاحظ الحرف "E" المضاف إلى الاختصارات التقليدية):

- [ECDHE](https://en.wikipedia.org/wiki/Elliptic_curve_Diffie%E2%80%93Hellman): نسخة زائلة من بروتوكول الاتفاق على المفاتيح منحنى إهليلجي ديفي هيلمان.
- [DHE](https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange): نسخة زائلة من بروتوكول الاتفاق على المفاتيح ديفي هيلمان.

يتم تمكين السرية الأمامية التامة باستخدام ECDHE افتراضيًا. يمكن استخدام الخيار `ecdhCurve` عند إنشاء خادم TLS لتخصيص قائمة منحنيات ECDH المدعومة للاستخدام. راجع [`tls.createServer()`](/ar/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener) لمزيد من المعلومات.

يتم تعطيل DHE افتراضيًا ولكن يمكن تمكينه جنبًا إلى جنب مع ECDHE عن طريق تعيين الخيار `dhparam` على `'auto'`. يتم دعم معلمات DHE المخصصة أيضًا ولكن لا يُشجع عليها لصالح المعلمات المعروفة المحددة تلقائيًا.

كانت السرية الأمامية التامة اختيارية حتى TLSv1.2. اعتبارًا من TLSv1.3، يتم استخدام (EC)DHE دائمًا (باستثناء اتصالات PSK فقط).

### ALPN و SNI {#alpn-and-sni}

ALPN (ملحق التفاوض على بروتوكول طبقة التطبيق) و SNI (إشارة اسم الخادم) هما امتدادات مصافحة TLS:

- ALPN: يسمح باستخدام خادم TLS واحد لبروتوكولات متعددة (HTTP، HTTP/2)
- SNI: يسمح باستخدام خادم TLS واحد لأسماء مضيفين متعددة بشهادات مختلفة.


### مفاتيح مشتركة مسبقًا {#pre-shared-keys}

يتوفر دعم TLS-PSK كبديل للمصادقة العادية القائمة على الشهادات. يستخدم مفتاحًا مشتركًا مسبقًا بدلاً من الشهادات لمصادقة اتصال TLS، مما يوفر مصادقة متبادلة. TLS-PSK والبنية التحتية للمفتاح العام ليسا متعارضين. يمكن للعملاء والخوادم استيعاب كليهما، واختيار أحدهما أثناء خطوة التفاوض العادية على الشيفرة.

يُعد TLS-PSK خيارًا جيدًا فقط في الحالات التي توجد فيها وسائل لمشاركة مفتاح بشكل آمن مع كل جهاز متصل، لذلك فهو لا يحل محل البنية التحتية للمفتاح العام (PKI) لمعظم استخدامات TLS. شهد تطبيق TLS-PSK في OpenSSL العديد من العيوب الأمنية في السنوات الأخيرة، ويرجع ذلك في الغالب إلى استخدامه فقط من قبل أقلية من التطبيقات. يرجى النظر في جميع الحلول البديلة قبل التبديل إلى شيفرات PSK. عند إنشاء PSK، من الأهمية بمكان استخدام إنتروبيا كافية كما هو موضح في [RFC 4086](https://tools.ietf.org/html/rfc4086). إن اشتقاق سر مشترك من كلمة مرور أو مصادر أخرى منخفضة الإنتروبيا ليس آمنًا.

يتم تعطيل شيفرات PSK افتراضيًا، وبالتالي فإن استخدام TLS-PSK يتطلب تحديد مجموعة شيفرات بشكل صريح باستخدام خيار `ciphers`. يمكن استرداد قائمة الشيفرات المتاحة عبر `openssl ciphers -v 'PSK'`. جميع شيفرات TLS 1.3 مؤهلة لـ PSK ويمكن استردادها عبر `openssl ciphers -v -s -tls1_3 -psk`. عند اتصال العميل، يجب تمرير `checkServerIdentity` مخصص لأن الإعداد الافتراضي سيفشل في حالة عدم وجود شهادة.

وفقًا لـ [RFC 4279](https://tools.ietf.org/html/rfc4279)، يجب دعم هويات PSK التي يصل طولها إلى 128 بايتًا و PSK التي يصل طولها إلى 64 بايتًا. اعتبارًا من OpenSSL 1.1.0، يبلغ الحد الأقصى لحجم الهوية 128 بايتًا، والحد الأقصى لطول PSK هو 256 بايتًا.

لا يدعم التنفيذ الحالي ردود نداء PSK غير المتزامنة بسبب قيود OpenSSL API الأساسي.

لاستخدام TLS-PSK، يجب على العميل والخادم تحديد خيار `pskCallback`، وهي دالة تُرجع PSK المراد استخدامه (والذي يجب أن يكون متوافقًا مع ملخص الشيفرة المحدد).

سيتم استدعاؤه أولاً على العميل:

- hint: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) رسالة اختيارية مرسلة من الخادم لمساعدة العميل على تحديد الهوية التي سيتم استخدامها أثناء التفاوض. دائمًا `null` إذا تم استخدام TLS 1.3.
- Returns: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) في شكل `{ psk: \<Buffer|TypedArray|DataView\>, identity: \<string\> }` أو `null`.

ثم على الخادم:

- socket: [\<tls.TLSSocket\>](/ar/nodejs/api/tls#class-tlstlssocket) مثيل مقبس الخادم، وهو مكافئ لـ `this`.
- identity: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) معلمة الهوية المرسلة من العميل.
- Returns: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) PSK (أو `null`).

تؤدي القيمة المرجعية `null` إلى إيقاف عملية التفاوض وإرسال رسالة تنبيه `unknown_psk_identity` إلى الطرف الآخر. إذا كان الخادم يرغب في إخفاء حقيقة أن هوية PSK غير معروفة، فيجب على رد النداء توفير بعض البيانات العشوائية كـ `psk` لجعل الاتصال يفشل مع `decrypt_error` قبل انتهاء التفاوض.


### تخفيف هجمات إعادة التفاوض التي يبدأها العميل {#client-initiated-renegotiation-attack-mitigation}

يسمح بروتوكول TLS للعملاء بإعادة التفاوض على جوانب معينة من جلسة TLS. لسوء الحظ، تتطلب إعادة التفاوض على الجلسة قدرًا غير متناسب من موارد جانب الخادم، مما يجعلها ناقلًا محتملًا لهجمات رفض الخدمة.

للتخفيف من المخاطر، تقتصر إعادة التفاوض على ثلاث مرات كل عشر دقائق. يتم إصدار حدث `'error'` على مثيل [`tls.TLSSocket`](/ar/nodejs/api/tls#class-tlstlssocket) عند تجاوز هذا الحد. الحدود قابلة للتكوين:

- `tls.CLIENT_RENEG_LIMIT` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يحدد عدد طلبات إعادة التفاوض. **افتراضي:** `3`.
- `tls.CLIENT_RENEG_WINDOW` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يحدد نافذة إعادة التفاوض الزمنية بالثواني. **افتراضي:** `600` (10 دقائق).

يجب عدم تعديل حدود إعادة التفاوض الافتراضية دون فهم كامل للآثار والمخاطر.

لا يدعم TLSv1.3 إعادة التفاوض.

### استئناف الجلسة {#session-resumption}

يمكن أن يكون إنشاء جلسة TLS بطيئًا نسبيًا. يمكن تسريع العملية عن طريق حفظ حالة الجلسة وإعادة استخدامها لاحقًا. هناك عدة آليات للقيام بذلك، تتم مناقشتها هنا من الأقدم إلى الأحدث (والأفضل).

#### معرفات الجلسة {#session-identifiers}

تقوم الخوادم بإنشاء معرف فريد للاتصالات الجديدة وإرساله إلى العميل. يحفظ العملاء والخوادم حالة الجلسة. عند إعادة الاتصال، يرسل العملاء معرف حالة الجلسة المحفوظة الخاصة بهم، وإذا كانت الخادم يحتوي أيضًا على حالة لهذا المعرف، فيمكنه الموافقة على استخدامه. وإلا، فستقوم الخادم بإنشاء جلسة جديدة. راجع [RFC 2246](https://www.ietf.org/rfc/rfc2246.txt) لمزيد من المعلومات، صفحة 23 و 30.

يتم دعم الاستئناف باستخدام معرفات الجلسة من قبل معظم متصفحات الويب عند إجراء طلبات HTTPS.

بالنسبة إلى Node.js، ينتظر العملاء حدث [`'session'`](/ar/nodejs/api/tls#event-session) للحصول على بيانات الجلسة، ويوفرون البيانات لخيار `session` الخاص بـ [`tls.connect()`](/ar/nodejs/api/tls#tlsconnectoptions-callback) اللاحق لإعادة استخدام الجلسة. يجب على الخوادم تنفيذ معالجات لأحداث [`'newSession'`](/ar/nodejs/api/tls#event-newsession) و [`'resumeSession'`](/ar/nodejs/api/tls#event-resumesession) لحفظ واستعادة بيانات الجلسة باستخدام معرف الجلسة كمفتاح البحث لإعادة استخدام الجلسات. لإعادة استخدام الجلسات عبر موازنات التحميل أو العاملين في المجموعة، يجب على الخوادم استخدام ذاكرة تخزين مؤقت للجلسة مشتركة (مثل Redis) في معالجات الجلسة الخاصة بهم.


#### تذاكر الجلسة {#session-tickets}

تقوم الخوادم بتشفير حالة الجلسة بأكملها وإرسالها إلى العميل على شكل "تذكرة". عند إعادة الاتصال، يتم إرسال الحالة إلى الخادم في الاتصال الأولي. تتجنب هذه الآلية الحاجة إلى ذاكرة تخزين مؤقت للجلسة من جانب الخادم. إذا لم يستخدم الخادم التذكرة، لأي سبب (فشل في فك تشفيرها، أو أنها قديمة جدًا، وما إلى ذلك)، فسيقوم بإنشاء جلسة جديدة وإرسال تذكرة جديدة. راجع [RFC 5077](https://tools.ietf.org/html/rfc5077) لمزيد من المعلومات.

أصبح الاستئناف باستخدام تذاكر الجلسة مدعومًا بشكل شائع من قبل العديد من متصفحات الويب عند إجراء طلبات HTTPS.

بالنسبة إلى Node.js، يستخدم العملاء نفس واجهات برمجة التطبيقات (APIs) للاستئناف باستخدام معرفات الجلسة كما هو الحال للاستئناف باستخدام تذاكر الجلسة. لأغراض التصحيح، إذا أعادت [`tls.TLSSocket.getTLSTicket()`](/ar/nodejs/api/tls#tlssocketgettlsticket) قيمة، فإن بيانات الجلسة تحتوي على تذكرة، وإلا فإنها تحتوي على حالة جلسة من جانب العميل.

مع TLSv1.3، كن على علم بأنه قد يتم إرسال عدة تذاكر من قبل الخادم، مما يؤدي إلى أحداث `'session'` متعددة، راجع [`'session'`](/ar/nodejs/api/tls#event-session) لمزيد من المعلومات.

لا تحتاج خوادم العملية الواحدة إلى تنفيذ محدد لاستخدام تذاكر الجلسة. لاستخدام تذاكر الجلسة عبر إعادة تشغيل الخادم أو موازنات التحميل، يجب أن تمتلك جميع الخوادم نفس مفاتيح التذاكر. هناك ثلاثة مفاتيح داخلية بحجم 16 بايت، ولكن واجهة برمجة التطبيقات (API) الخاصة بـ tls تعرضها كمخزن مؤقت واحد بحجم 48 بايت لراحة المستخدم.

من الممكن الحصول على مفاتيح التذاكر عن طريق استدعاء [`server.getTicketKeys()`](/ar/nodejs/api/tls#servergetticketkeys) على مثيل خادم واحد ثم توزيعها، ولكن من المعقول أكثر إنشاء 48 بايت من البيانات العشوائية الآمنة بشكل آمن وتعيينها باستخدام خيار `ticketKeys` الخاص بـ [`tls.createServer()`](/ar/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener). يجب إعادة إنشاء المفاتيح بانتظام ويمكن إعادة تعيين مفاتيح الخادم باستخدام [`server.setTicketKeys()`](/ar/nodejs/api/tls#serversetticketkeyskeys).

مفاتيح تذاكر الجلسة هي مفاتيح تشفير، و *<strong>يجب تخزينها بشكل آمن</strong>*. مع TLS 1.2 والإصدارات الأقدم، إذا تم اختراقها، فيمكن فك تشفير جميع الجلسات التي استخدمت التذاكر المشفرة بها. يجب عدم تخزينها على القرص، ويجب إعادة إنشائها بانتظام.

إذا أعلن العملاء عن دعمهم للتذاكر، فسيرسلها الخادم. يمكن للخادم تعطيل التذاكر عن طريق توفير `require('node:constants').SSL_OP_NO_TICKET` في `secureOptions`.

تنتهي صلاحية كل من معرفات الجلسة وتذاكر الجلسة، مما يتسبب في قيام الخادم بإنشاء جلسات جديدة. يمكن تكوين المهلة باستخدام خيار `sessionTimeout` الخاص بـ [`tls.createServer()`](/ar/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener).

بالنسبة لجميع الآليات، عندما يفشل الاستئناف، ستقوم الخوادم بإنشاء جلسات جديدة. نظرًا لأن الفشل في استئناف الجلسة لا يتسبب في فشل اتصال TLS/HTTPS، فمن السهل عدم ملاحظة ضعف أداء TLS غير الضروري. يمكن استخدام OpenSSL CLI للتحقق من أن الخوادم تستأنف الجلسات. استخدم الخيار `-reconnect` لـ `openssl s_client`، على سبيل المثال:

```bash [BASH]
openssl s_client -connect localhost:443 -reconnect
```
اقرأ مخرجات التصحيح. يجب أن يقول الاتصال الأول "New"، على سبيل المثال:

```text [TEXT]
New, TLSv1.2, Cipher is ECDHE-RSA-AES128-GCM-SHA256
```
يجب أن تقول الاتصالات اللاحقة "Reused"، على سبيل المثال:

```text [TEXT]
Reused, TLSv1.2, Cipher is ECDHE-RSA-AES128-GCM-SHA256
```

## تعديل مجموعة تشفير TLS الافتراضية {#modifying-the-default-tls-cipher-suite}

تم تصميم Node.js مع مجموعة افتراضية من تشفيرات TLS الممكنة والمعطلة. يمكن تكوين قائمة التشفير الافتراضية هذه عند بناء Node.js للسماح للتوزيعات بتوفير قائمتها الافتراضية الخاصة.

يمكن استخدام الأمر التالي لإظهار مجموعة التشفير الافتراضية:

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
يمكن استبدال هذا الإعداد الافتراضي بالكامل باستخدام مفتاح سطر الأوامر [`--tls-cipher-list`](/ar/nodejs/api/cli#--tls-cipher-listlist) (مباشرة ، أو عبر متغير البيئة [`NODE_OPTIONS`](/ar/nodejs/api/cli#node_optionsoptions)). على سبيل المثال ، يجعل ما يلي `ECDHE-RSA-AES128-GCM-SHA256:!RC4` مجموعة تشفير TLS الافتراضية:

```bash [BASH]
node --tls-cipher-list='ECDHE-RSA-AES128-GCM-SHA256:!RC4' server.js

export NODE_OPTIONS=--tls-cipher-list='ECDHE-RSA-AES128-GCM-SHA256:!RC4'
node server.js
```
للتحقق ، استخدم الأمر التالي لإظهار قائمة التشفير المحددة ، لاحظ الفرق بين `defaultCoreCipherList` و `defaultCipherList`:

```bash [BASH]
node --tls-cipher-list='ECDHE-RSA-AES128-GCM-SHA256:!RC4' -p crypto.constants.defaultCipherList | tr ':' '\n'
ECDHE-RSA-AES128-GCM-SHA256
!RC4
```
على سبيل المثال. يتم تعيين قائمة `defaultCoreCipherList` في وقت التحويل البرمجي ويتم تعيين `defaultCipherList` في وقت التشغيل.

لتعديل مجموعات التشفير الافتراضية من داخل وقت التشغيل ، قم بتعديل المتغير `tls.DEFAULT_CIPHERS` ، يجب إجراء ذلك قبل الاستماع إلى أي مآخذ توصيل ، ولن يؤثر على مآخذ التوصيل المفتوحة بالفعل. على سبيل المثال:

```js [ESM]
// Remove Obsolete CBC Ciphers and RSA Key Exchange based Ciphers as they don't provide Forward Secrecy
tls.DEFAULT_CIPHERS +=
  ':!ECDHE-RSA-AES128-SHA:!ECDHE-RSA-AES128-SHA256:!ECDHE-RSA-AES256-SHA:!ECDHE-RSA-AES256-SHA384' +
  ':!ECDHE-ECDSA-AES128-SHA:!ECDHE-ECDSA-AES128-SHA256:!ECDHE-ECDSA-AES256-SHA:!ECDHE-ECDSA-AES256-SHA384' +
  ':!kRSA';
```
يمكن أيضًا استبدال الإعداد الافتراضي على أساس كل عميل أو خادم باستخدام خيار `ciphers` من [`tls.createSecureContext()`](/ar/nodejs/api/tls#tlscreatesecurecontextoptions)، والذي يتوفر أيضًا في [`tls.createServer()`](/ar/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener) و [`tls.connect()`](/ar/nodejs/api/tls#tlsconnectoptions-callback) وعند إنشاء [`tls.TLSSocket`](/ar/nodejs/api/tls#class-tlstlssocket) جديدة.

يمكن أن تحتوي قائمة التشفير على مزيج من أسماء مجموعة تشفير TLSv1.3 ، وتلك التي تبدأ بـ `'TLS_'` ، ومواصفات لمجموعات تشفير TLSv1.2 والإصدارات الأقدم. يدعم تشفير TLSv1.2 تنسيق مواصفات قديم ، راجع وثائق OpenSSL [تنسيق قائمة التشفير](https://www.openssl.org/docs/man1.1.1/man1/ciphers#CIPHER-LIST-FORMAT) للحصول على التفاصيل ، ولكن هذه المواصفات *لا* تنطبق على تشفيرات TLSv1.3. لا يمكن تمكين مجموعات TLSv1.3 إلا من خلال تضمين اسمها الكامل في قائمة التشفير. لا يمكن ، على سبيل المثال ، تمكينها أو تعطيلها باستخدام مواصفات TLSv1.2 القديمة `'EECDH'` أو `'!EECDH'`.

على الرغم من الترتيب النسبي لمجموعات تشفير TLSv1.3 و TLSv1.2 ، فإن بروتوكول TLSv1.3 أكثر أمانًا بشكل ملحوظ من TLSv1.2 ، وسيتم اختياره دائمًا على TLSv1.2 إذا كانت المصافحة تشير إلى أنه مدعوم ، وإذا تم تمكين أي مجموعات تشفير TLSv1.3.

تم تحديد مجموعة التشفير الافتراضية المضمنة في Node.js بعناية لتعكس أفضل الممارسات الأمنية الحالية وتخفيف المخاطر. يمكن أن يكون لتغيير مجموعة التشفير الافتراضية تأثير كبير على أمان التطبيق. يجب استخدام مفتاح `--tls-cipher-list` وخيار `ciphers` فقط إذا كان ذلك ضروريًا للغاية.

تفضل مجموعة التشفير الافتراضية تشفيرات GCM لإعداد [Chrome 'التشفير الحديث'](https://www.chromium.org/Home/chromium-security/education/tls#TOC-Cipher-Suites) وتفضل أيضًا تشفيرات ECDHE و DHE للسرية الأمامية المثالية ، مع تقديم *بعض* التوافق مع الإصدارات السابقة.

لا يمكن للعملاء القدامى الذين يعتمدون على تشفيرات RC4 أو DES غير الآمنة والقديمة (مثل Internet Explorer 6) إكمال عملية المصافحة بالتكوين الافتراضي. إذا كان *يجب* دعم هؤلاء العملاء ، فقد تقدم [توصيات TLS](https://wiki.mozilla.org/Security/Server_Side_TLS) مجموعة تشفير متوافقة. لمزيد من التفاصيل حول التنسيق ، راجع وثائق OpenSSL [تنسيق قائمة التشفير](https://www.openssl.org/docs/man1.1.1/man1/ciphers#CIPHER-LIST-FORMAT).

لا يوجد سوى خمس مجموعات تشفير TLSv1.3:

- `'TLS_AES_256_GCM_SHA384'`
- `'TLS_CHACHA20_POLY1305_SHA256'`
- `'TLS_AES_128_GCM_SHA256'`
- `'TLS_AES_128_CCM_SHA256'`
- `'TLS_AES_128_CCM_8_SHA256'`

يتم تمكين الثلاثة الأولى افتراضيًا. تدعم TLSv1.3 مجموعات `CCM` ، لأنها قد تكون أكثر فعالية من حيث الأداء على الأنظمة المقيدة ، ولكنها غير ممكنة افتراضيًا لأنها توفر أمانًا أقل.


## مستوى أمان OpenSSL {#openssl-security-level}

تفرض مكتبة OpenSSL مستويات أمان للتحكم في الحد الأدنى المقبول من الأمان للعمليات المشفرة. تتراوح مستويات أمان OpenSSL من 0 إلى 5، حيث يفرض كل مستوى متطلبات أمان أكثر صرامة. مستوى الأمان الافتراضي هو 1، وهو مناسب بشكل عام لمعظم التطبيقات الحديثة. ومع ذلك، تتطلب بعض الميزات والبروتوكولات القديمة، مثل TLSv1، مستوى أمان أقل (`SECLEVEL=0`) لكي تعمل بشكل صحيح. لمزيد من المعلومات التفصيلية، يرجى الرجوع إلى [وثائق OpenSSL حول مستويات الأمان](https://www.openssl.org/docs/manmaster/man3/SSL_CTX_set_security_level#DEFAULT-CALLBACK-BEHAVIOUR).

### تعيين مستويات الأمان {#setting-security-levels}

لضبط مستوى الأمان في تطبيق Node.js الخاص بك، يمكنك تضمين `@SECLEVEL=X` داخل سلسلة تشفير، حيث `X` هو مستوى الأمان المطلوب. على سبيل المثال، لتعيين مستوى الأمان إلى 0 أثناء استخدام قائمة تشفير OpenSSL الافتراضية، يمكنك استخدام:

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

يؤدي هذا النهج إلى تعيين مستوى الأمان إلى 0، مما يسمح باستخدام الميزات القديمة مع الاستمرار في الاستفادة من تشفير OpenSSL الافتراضي.

### استخدام {#using}

يمكنك أيضًا تعيين مستوى الأمان والتشفير من سطر الأوامر باستخدام `--tls-cipher-list=DEFAULT@SECLEVEL=X` كما هو موضح في [تعديل مجموعة تشفير TLS الافتراضية](/ar/nodejs/api/tls#modifying-the-default-tls-cipher-suite). ومع ذلك، يُنصح عمومًا بعدم استخدام خيار سطر الأوامر لتعيين التشفير ويفضل تكوين التشفير للسياقات الفردية داخل كود التطبيق الخاص بك، حيث يوفر هذا النهج تحكمًا أفضل ويقلل من خطر تخفيض مستوى الأمان عالميًا.


## رموز أخطاء شهادات X509 {#x509-certificate-error-codes}

يمكن أن تفشل وظائف متعددة بسبب أخطاء الشهادات التي يتم الإبلاغ عنها بواسطة OpenSSL. في مثل هذه الحالة، توفر الوظيفة [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) عبر رد الاتصال الخاص بها والتي تحتوي على خاصية `code` يمكن أن تأخذ إحدى القيم التالية:

- `'UNABLE_TO_GET_ISSUER_CERT'`: غير قادر على الحصول على شهادة الجهة المصدرة.
- `'UNABLE_TO_GET_CRL'`: غير قادر على الحصول على CRL الشهادة.
- `'UNABLE_TO_DECRYPT_CERT_SIGNATURE'`: غير قادر على فك تشفير توقيع الشهادة.
- `'UNABLE_TO_DECRYPT_CRL_SIGNATURE'`: غير قادر على فك تشفير توقيع CRL.
- `'UNABLE_TO_DECODE_ISSUER_PUBLIC_KEY'`: غير قادر على فك ترميز المفتاح العام للمصدر.
- `'CERT_SIGNATURE_FAILURE'`: فشل توقيع الشهادة.
- `'CRL_SIGNATURE_FAILURE'`: فشل توقيع CRL.
- `'CERT_NOT_YET_VALID'`: الشهادة ليست صالحة بعد.
- `'CERT_HAS_EXPIRED'`: الشهادة منتهية الصلاحية.
- `'CRL_NOT_YET_VALID'`: CRL ليست صالحة بعد.
- `'CRL_HAS_EXPIRED'`: CRL منتهية الصلاحية.
- `'ERROR_IN_CERT_NOT_BEFORE_FIELD'`: خطأ في تنسيق حقل notBefore للشهادة.
- `'ERROR_IN_CERT_NOT_AFTER_FIELD'`: خطأ في تنسيق حقل notAfter للشهادة.
- `'ERROR_IN_CRL_LAST_UPDATE_FIELD'`: خطأ في تنسيق حقل lastUpdate لـ CRL.
- `'ERROR_IN_CRL_NEXT_UPDATE_FIELD'`: خطأ في تنسيق حقل nextUpdate لـ CRL.
- `'OUT_OF_MEM'`: نفاد الذاكرة.
- `'DEPTH_ZERO_SELF_SIGNED_CERT'`: شهادة موقعة ذاتيًا.
- `'SELF_SIGNED_CERT_IN_CHAIN'`: شهادة موقعة ذاتيًا في سلسلة الشهادات.
- `'UNABLE_TO_GET_ISSUER_CERT_LOCALLY'`: غير قادر على الحصول على شهادة المصدر المحلية.
- `'UNABLE_TO_VERIFY_LEAF_SIGNATURE'`: غير قادر على التحقق من الشهادة الأولى.
- `'CERT_CHAIN_TOO_LONG'`: سلسلة الشهادات طويلة جدًا.
- `'CERT_REVOKED'`: الشهادة ملغاة.
- `'INVALID_CA'`: شهادة CA غير صالحة.
- `'PATH_LENGTH_EXCEEDED'`: تجاوز قيد طول المسار.
- `'INVALID_PURPOSE'`: غرض الشهادة غير مدعوم.
- `'CERT_UNTRUSTED'`: الشهادة غير موثوق بها.
- `'CERT_REJECTED'`: الشهادة مرفوضة.
- `'HOSTNAME_MISMATCH'`: عدم تطابق اسم المضيف.


## الفئة: `tls.CryptoStream` {#class-tlscryptostream}

**أضيف في: v0.3.4**

**تم الإهمال منذ: v0.11.3**

::: danger [مستقر: 0 - مهمل]
[مستقر: 0](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 0](/ar/nodejs/api/documentation#stability-index) - مهمل: استخدم [`tls.TLSSocket`](/ar/nodejs/api/tls#class-tlstlssocket) بدلاً من ذلك.
:::

تمثل الفئة `tls.CryptoStream` دفقًا من البيانات المشفرة. هذه الفئة مهملة ولا ينبغي استخدامها بعد الآن.

### `cryptoStream.bytesWritten` {#cryptostreambyteswritten}

**أضيف في: v0.3.4**

**تم الإهمال منذ: v0.11.3**

تعيد الخاصية `cryptoStream.bytesWritten` إجمالي عدد البايتات المكتوبة إلى المقبس الأساسي *بما في ذلك* البايتات المطلوبة لتنفيذ بروتوكول TLS.

## الفئة: `tls.SecurePair` {#class-tlssecurepair}

**أضيف في: v0.3.2**

**تم الإهمال منذ: v0.11.3**

::: danger [مستقر: 0 - مهمل]
[مستقر: 0](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 0](/ar/nodejs/api/documentation#stability-index) - مهمل: استخدم [`tls.TLSSocket`](/ar/nodejs/api/tls#class-tlstlssocket) بدلاً من ذلك.
:::

تم إرجاعه بواسطة [`tls.createSecurePair()`](/ar/nodejs/api/tls#tlscreatesecurepaircontext-isserver-requestcert-rejectunauthorized-options).

### الحدث: `'secure'` {#event-secure}

**أضيف في: v0.3.2**

**تم الإهمال منذ: v0.11.3**

يتم إطلاق الحدث `'secure'` بواسطة كائن `SecurePair` بمجرد إنشاء اتصال آمن.

كما هو الحال مع التحقق من حدث [`'secureConnection'`](/ar/nodejs/api/tls#event-secureconnection) الخاص بالخادم، يجب فحص `pair.cleartext.authorized` للتأكد مما إذا كانت الشهادة المستخدمة مصرح بها بشكل صحيح.

## الفئة: `tls.Server` {#class-tlsserver}

**أضيف في: v0.3.2**

- يمتد: [\<net.Server\>](/ar/nodejs/api/net#class-netserver)

يقبل الاتصالات المشفرة باستخدام TLS أو SSL.

### الحدث: `'connection'` {#event-connection}

**أضيف في: v0.3.2**

- `socket` [\<stream.Duplex\>](/ar/nodejs/api/stream#class-streamduplex)

يتم إطلاق هذا الحدث عند إنشاء دفق TCP جديد، قبل أن تبدأ مصافحة TLS. `socket` هو عادةً كائن من النوع [`net.Socket`](/ar/nodejs/api/net#class-netsocket) ولكن لن يتلقى أحداثًا على عكس المقبس الذي تم إنشاؤه من حدث `'connection'` الخاص بـ [`net.Server`](/ar/nodejs/api/net#class-netserver). عادةً لا يرغب المستخدمون في الوصول إلى هذا الحدث.

يمكن أيضًا إطلاق هذا الحدث صراحةً من قبل المستخدمين لحقن الاتصالات في خادم TLS. في هذه الحالة، يمكن تمرير أي دفق [`Duplex`](/ar/nodejs/api/stream#class-streamduplex).


### الحدث: `'keylog'` {#event-keylog}

**تمت الإضافة في: الإصدار v12.3.0، الإصدار v10.20.0**

- `line` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) سطر من نص ASCII، بتنسيق `SSLKEYLOGFILE` الخاص بـ NSS.
- `tlsSocket` [\<tls.TLSSocket\>](/ar/nodejs/api/tls#class-tlstlssocket) مثيل `tls.TLSSocket` الذي تم إنشاؤه عليه.

يتم إطلاق الحدث `keylog` عندما يتم إنشاء أو استقبال مادة مفتاح بواسطة اتصال بهذا الخادم (عادةً قبل اكتمال المصافحة، ولكن ليس بالضرورة). يمكن تخزين مادة المفتاح هذه لتصحيح الأخطاء، حيث إنها تسمح بفك تشفير حركة مرور TLS التي تم التقاطها. قد يتم إطلاقه عدة مرات لكل مقبس.

حالة الاستخدام النموذجية هي إلحاق الأسطر المستلمة بملف نصي مشترك، والذي يستخدمه برنامج لاحقًا (مثل Wireshark) لفك تشفير حركة المرور:

```js [ESM]
const logFile = fs.createWriteStream('/tmp/ssl-keys.log', { flags: 'a' });
// ...
server.on('keylog', (line, tlsSocket) => {
  if (tlsSocket.remoteAddress !== '...')
    return; // سجل المفاتيح فقط لعنوان IP معين
  logFile.write(line);
});
```
### الحدث: `'newSession'` {#event-newsession}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v0.11.12 | يتم الآن دعم وسيطة `callback`. |
| الإصدار v0.9.2 | تمت الإضافة في: الإصدار v0.9.2 |
:::

يتم إطلاق الحدث `'newSession'` عند إنشاء جلسة TLS جديدة. يمكن استخدام هذا لتخزين الجلسات في وحدة تخزين خارجية. يجب توفير البيانات إلى استدعاء رد الاتصال [`'resumeSession'`](/ar/nodejs/api/tls#event-resumesession).

يتم تمرير ثلاث وسيطات إلى معاودة الاتصال المستمع عند استدعائها:

- `sessionId` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) معرف جلسة TLS
- `sessionData` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) بيانات جلسة TLS
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) دالة رد اتصال لا تأخذ أي وسيطات يجب استدعاؤها لكي يتم إرسال البيانات أو استقبالها عبر الاتصال الآمن.

سيؤثر الاستماع إلى هذا الحدث فقط على الاتصالات التي تم إنشاؤها بعد إضافة مستمع الحدث.

### الحدث: `'OCSPRequest'` {#event-ocsprequest}

**تمت الإضافة في: الإصدار v0.11.13**

يتم إطلاق الحدث `'OCSPRequest'` عندما يرسل العميل طلبًا لحالة الشهادة. يتم تمرير ثلاث وسيطات إلى معاودة الاتصال المستمع عند استدعائها:

- `certificate` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) شهادة الخادم
- `issuer` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) شهادة جهة الإصدار
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) دالة رد اتصال يجب استدعاؤها لتوفير نتائج طلب OCSP.

يمكن تحليل شهادة الخادم الحالية للحصول على عنوان URL الخاص بـ OCSP ومعرف الشهادة؛ بعد الحصول على استجابة OCSP، يتم بعد ذلك استدعاء `callback(null, resp)`، حيث `resp` هو مثيل `Buffer` يحتوي على استجابة OCSP. كلا من `certificate` و `issuer` هما تمثيلات DER `Buffer` للشهادات الأساسية وشهادات جهة الإصدار. يمكن استخدامها للحصول على معرف شهادة OCSP وعنوان URL لنقطة نهاية OCSP.

بدلاً من ذلك، يمكن استدعاء `callback(null, null)`، مما يشير إلى عدم وجود استجابة OCSP.

سيؤدي استدعاء `callback(err)` إلى استدعاء `socket.destroy(err)`.

التدفق النموذجي لطلب OCSP هو كما يلي:

يمكن أن يكون `issuer` هو `null` إذا كانت الشهادة موقعة ذاتيًا أو إذا لم تكن جهة الإصدار موجودة في قائمة الشهادات الجذر. (يمكن توفير جهة إصدار عبر خيار `ca` عند إنشاء اتصال TLS.)

سيؤثر الاستماع إلى هذا الحدث فقط على الاتصالات التي تم إنشاؤها بعد إضافة مستمع الحدث.

يمكن استخدام وحدة npm مثل [asn1.js](https://www.npmjs.com/package/asn1.js) لتحليل الشهادات.


### الحدث: `'resumeSession'` {#event-resumesession}

**تمت إضافته في: الإصدار v0.9.2**

يتم إصدار الحدث `'resumeSession'` عندما يطلب العميل استئناف جلسة TLS سابقة. يتم تمرير دالة الاستماع (listener callback) بوسيطتين عند استدعائها:

- `sessionId` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) مُعرّف جلسة TLS
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) دالة رد نداء يتم استدعاؤها عند استعادة الجلسة السابقة: `callback([err[, sessionData]])`
    - `err` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    - `sessionData` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)

يجب أن يبحث مستمع الحدث في وحدة تخزين خارجية عن `sessionData` التي تم حفظها بواسطة معالج الحدث [`'newSession'`](/ar/nodejs/api/tls#event-newsession) باستخدام `sessionId` المحدد. إذا تم العثور عليها، فقم باستدعاء `callback(null, sessionData)` لاستئناف الجلسة. إذا لم يتم العثور عليها، فلا يمكن استئناف الجلسة. يجب استدعاء `callback()` بدون `sessionData` حتى يمكن أن تستمر المصافحة (handshake) وإنشاء جلسة جديدة. من الممكن استدعاء `callback(err)` لإنهاء الاتصال الوارد وتدمير المقبس (socket).

الاستماع إلى هذا الحدث سيكون له تأثير فقط على الاتصالات التي يتم إنشاؤها بعد إضافة مستمع الحدث.

يوضح ما يلي استئناف جلسة TLS:

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

### الحدث: `'secureConnection'` {#event-secureconnection}

**تمت إضافته في: الإصدار v0.3.2**

يتم إصدار الحدث `'secureConnection'` بعد اكتمال عملية المصافحة لاتصال جديد بنجاح. يتم تمرير دالة الاستماع (listener callback) بوسيطة واحدة عند استدعائها:

- `tlsSocket` [\<tls.TLSSocket\>](/ar/nodejs/api/tls#class-tlstlssocket) مقبس TLS المنشأ.

الخاصية `tlsSocket.authorized` هي قيمة `boolean` تشير إلى ما إذا كان قد تم التحقق من العميل بواسطة إحدى جهات إصدار الشهادات (Certificate Authorities) المقدمة للخادم. إذا كانت قيمة `tlsSocket.authorized` هي `false`، فسيتم تعيين `socket.authorizationError` لوصف كيفية فشل التفويض. بناءً على إعدادات خادم TLS، قد تظل الاتصالات غير المصرح بها مقبولة.

الخاصية `tlsSocket.alpnProtocol` هي سلسلة تحتوي على بروتوكول ALPN المحدد. عندما لا يكون لـ ALPN بروتوكول محدد لأن العميل أو الخادم لم يرسل امتداد ALPN، فإن `tlsSocket.alpnProtocol` تساوي `false`.

الخاصية `tlsSocket.servername` هي سلسلة تحتوي على اسم الخادم المطلوب عبر SNI.


### الحدث: `'tlsClientError'` {#event-tlsclienterror}

**تمت الإضافة في: الإصدار v6.0.0**

يتم إصدار الحدث `'tlsClientError'` عند حدوث خطأ قبل إنشاء اتصال آمن. يتم تمرير وسيطتين إلى دالة رد الاتصال للمستمع عند استدعائها:

- `exception` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) كائن `Error` يصف الخطأ.
- `tlsSocket` [\<tls.TLSSocket\>](/ar/nodejs/api/tls#class-tlstlssocket) مثيل `tls.TLSSocket` الذي نشأ منه الخطأ.

### `server.addContext(hostname, context)` {#serveraddcontexthostname-context}

**تمت الإضافة في: الإصدار v0.5.3**

- `hostname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم مضيف SNI أو حرف بدل (مثل `'*'`).
- `context` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<tls.SecureContext\>](/ar/nodejs/api/tls#tlscreatesecurecontextoptions) كائن يحتوي على أي من الخصائص المحتملة من وسائط [`tls.createSecureContext()`](/ar/nodejs/api/tls#tlscreatesecurecontextoptions) `options` (مثل `key` و `cert` و `ca` وما إلى ذلك)، أو كائن سياق TLS تم إنشاؤه باستخدام [`tls.createSecureContext()`](/ar/nodejs/api/tls#tlscreatesecurecontextoptions) نفسه.

تضيف الطريقة `server.addContext()` سياقًا آمنًا سيتم استخدامه إذا كان اسم SNI لطلب العميل يطابق `hostname` (أو حرف البدل) المحدد.

عند وجود سياقات مطابقة متعددة، يتم استخدام السياق الذي تمت إضافته مؤخرًا.

### `server.address()` {#serveraddress}

**تمت الإضافة في: الإصدار v0.6.0**

- إرجاع: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

إرجاع العنوان المرتبط واسم عائلة العناوين ومنفذ الخادم كما أبلغ عنها نظام التشغيل. راجع [`net.Server.address()`](/ar/nodejs/api/net#serveraddress) لمزيد من المعلومات.

### `server.close([callback])` {#serverclosecallback}

**تمت الإضافة في: الإصدار v0.3.2**

- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) دالة رد الاتصال للمستمع التي سيتم تسجيلها للاستماع إلى حدث `'close'` لمثيل الخادم.
- إرجاع: [\<tls.Server\>](/ar/nodejs/api/tls#class-tlsserver)

تمنع الطريقة `server.close()` الخادم من قبول اتصالات جديدة.

تعمل هذه الوظيفة بشكل غير متزامن. سيتم إصدار الحدث `'close'` عندما لا يكون للخادم أي اتصالات مفتوحة أخرى.


### `server.getTicketKeys()` {#servergetticketkeys}

**تمت الإضافة في: v3.0.0**

- Returns: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) مخزن مؤقت بحجم 48 بايت يحتوي على مفاتيح تذاكر الجلسة.

إرجاع مفاتيح تذاكر الجلسة.

انظر [استئناف الجلسة](/ar/nodejs/api/tls#session-resumption) لمزيد من المعلومات.

### `server.listen()` {#serverlisten}

يبدأ الخادم في الاستماع للاتصالات المشفرة. هذه الطريقة مماثلة لـ [`server.listen()`](/ar/nodejs/api/net#serverlisten) من [`net.Server`](/ar/nodejs/api/net#class-netserver).

### `server.setSecureContext(options)` {#serversetsecurecontextoptions}

**تمت الإضافة في: v11.0.0**

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) كائن يحتوي على أي من الخصائص المحتملة من وسائط [`tls.createSecureContext()`](/ar/nodejs/api/tls#tlscreatesecurecontextoptions) `options` (مثل `key`، `cert`، `ca`، إلخ).

تستبدل طريقة `server.setSecureContext()` السياق الآمن لخادم موجود. لا يتم مقاطعة الاتصالات الحالية بالخادم.

### `server.setTicketKeys(keys)` {#serversetticketkeyskeys}

**تمت الإضافة في: v3.0.0**

- `keys` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) مخزن مؤقت بحجم 48 بايت يحتوي على مفاتيح تذاكر الجلسة.

تعيين مفاتيح تذاكر الجلسة.

التغييرات التي تطرأ على مفاتيح التذاكر فعالة فقط لاتصالات الخادم المستقبلية. ستستخدم اتصالات الخادم الحالية أو المعلقة حاليًا المفاتيح السابقة.

انظر [استئناف الجلسة](/ar/nodejs/api/tls#session-resumption) لمزيد من المعلومات.

## الفئة: `tls.TLSSocket` {#class-tlstlssocket}

**تمت الإضافة في: v0.11.4**

- تمتد: [\<net.Socket\>](/ar/nodejs/api/net#class-netsocket)

تجري تشفيرًا شفافًا للبيانات المكتوبة وجميع مفاوضات TLS المطلوبة.

تنفذ مثيلات `tls.TLSSocket` واجهة [Stream](/ar/nodejs/api/stream#stream) المزدوجة.

ستعيد الطرق التي تُرجع بيانات تعريف اتصال TLS (على سبيل المثال [`tls.TLSSocket.getPeerCertificate()`](/ar/nodejs/api/tls#tlssocketgetpeercertificatedetailed)) البيانات فقط أثناء فتح الاتصال.


### `new tls.TLSSocket(socket[, options])` {#new-tlstlssocketsocket-options}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
|---|---|
| v12.2.0 | خيار `enableTrace` مدعوم الآن. |
| v5.0.0 | خيارات ALPN مدعومة الآن. |
| v0.11.4 | تمت إضافته في: v0.11.4 |
:::

- `socket` [\<net.Socket\>](/ar/nodejs/api/net#class-netsocket) | [\<stream.Duplex\>](/ar/nodejs/api/stream#class-streamduplex) على جانب الخادم، أي دفق `Duplex`. على جانب العميل، أي مثيل لـ [`net.Socket`](/ar/nodejs/api/net#class-netsocket) (لدعم دفق `Duplex` عام على جانب العميل، يجب استخدام [`tls.connect()`](/ar/nodejs/api/tls#tlsconnectoptions-callback)).
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `enableTrace`: انظر [`tls.createServer()`](/ar/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `isServer`: بروتوكول SSL/TLS غير متماثل، يجب أن تعرف TLSSockets ما إذا كان سيتم التعامل معها كخادم أو عميل. إذا كانت القيمة `true`، فسيتم إنشاء مقبس TLS كخادم. **الافتراضي:** `false`.
    - `server` [\<net.Server\>](/ar/nodejs/api/net#class-netserver) مثيل [`net.Server`](/ar/nodejs/api/net#class-netserver).
    - `requestCert`: ما إذا كان سيتم مصادقة النظير البعيد عن طريق طلب شهادة. يطلب العملاء دائمًا شهادة الخادم. يمكن للخوادم (إذا كانت `isServer` صحيحة) تعيين `requestCert` على true لطلب شهادة العميل.
    - `rejectUnauthorized`: انظر [`tls.createServer()`](/ar/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `ALPNProtocols`: انظر [`tls.createServer()`](/ar/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `SNICallback`: انظر [`tls.createServer()`](/ar/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `session` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) مثيل `Buffer` يحتوي على جلسة TLS.
    - `requestOCSP` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا كانت `true`، تحدد أنه سيتم إضافة امتداد طلب حالة OCSP إلى ترحيب العميل وسيتم إصدار حدث `'OCSPResponse'` على المقبس قبل إنشاء اتصال آمن
    - `secureContext`: كائن سياق TLS تم إنشاؤه باستخدام [`tls.createSecureContext()`](/ar/nodejs/api/tls#tlscreatesecurecontextoptions). إذا لم يتم توفير `secureContext`، فسيتم إنشاء واحد عن طريق تمرير كائن `options` بأكمله إلى `tls.createSecureContext()`.
    - ...: خيارات [`tls.createSecureContext()`](/ar/nodejs/api/tls#tlscreatesecurecontextoptions) التي يتم استخدامها إذا كان خيار `secureContext` مفقودًا. بخلاف ذلك، يتم تجاهلها.

قم بإنشاء كائن `tls.TLSSocket` جديد من مقبس TCP موجود.


### الحدث: `'keylog'` {#event-keylog_1}

**أضيف في: الإصدار v12.3.0، v10.20.0**

- `line` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) سطر من نص ASCII، بتنسيق `SSLKEYLOGFILE` الخاص بـ NSS.

يتم إطلاق الحدث `keylog` على `tls.TLSSocket` عند إنشاء أو استقبال مادة المفتاح بواسطة المقبس. يمكن تخزين مادة المفتاح هذه للتصحيح، لأنها تسمح بفك تشفير حركة مرور TLS التي تم التقاطها. قد يتم إطلاقه عدة مرات، قبل أو بعد اكتمال المصافحة.

حالة الاستخدام النموذجية هي إلحاق الأسطر المستلمة بملف نصي مشترك، والذي يتم استخدامه لاحقًا بواسطة برنامج (مثل Wireshark) لفك تشفير حركة المرور:

```js [ESM]
const logFile = fs.createWriteStream('/tmp/ssl-keys.log', { flags: 'a' });
// ...
tlsSocket.on('keylog', (line) => logFile.write(line));
```
### الحدث: `'OCSPResponse'` {#event-ocspresponse}

**أضيف في: الإصدار v0.11.13**

يتم إطلاق الحدث `'OCSPResponse'` إذا تم تعيين الخيار `requestOCSP` عند إنشاء `tls.TLSSocket` وتم استلام استجابة OCSP. يتم تمرير وسيطة واحدة إلى دالة رد الاتصال للمستمع عند استدعائها:

- `response` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) استجابة OCSP الخاصة بالخادم

عادةً ما تكون `response` كائنًا موقعًا رقميًا من CA الخاص بالخادم يحتوي على معلومات حول حالة إبطال شهادة الخادم.

### الحدث: `'secureConnect'` {#event-secureconnect}

**أضيف في: الإصدار v0.11.4**

يتم إطلاق الحدث `'secureConnect'` بعد اكتمال عملية المصافحة لاتصال جديد بنجاح. سيتم استدعاء دالة رد الاتصال للمستمع بغض النظر عما إذا كانت شهادة الخادم مصرحًا بها أم لا. تقع على عاتق العميل مسؤولية التحقق من الخاصية `tlsSocket.authorized` لتحديد ما إذا كانت شهادة الخادم موقعة من قبل أحد CAs المحددة. إذا كانت `tlsSocket.authorized === false`، فيمكن العثور على الخطأ بفحص الخاصية `tlsSocket.authorizationError`. إذا تم استخدام ALPN، فيمكن التحقق من الخاصية `tlsSocket.alpnProtocol` لتحديد البروتوكول المتفاوض عليه.

لا يتم إطلاق الحدث `'secureConnect'` عند إنشاء [\<tls.TLSSocket\>](/ar/nodejs/api/tls#class-tlstlssocket) باستخدام الدالة الإنشائية `new tls.TLSSocket()`.


### الحدث: `'session'` {#event-session}

**تمت إضافته في: الإصدار v11.10.0**

- `session` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)

يتم إصدار الحدث `'session'` على عميل `tls.TLSSocket` عندما تتوفر جلسة جديدة أو تذكرة TLS. قد يكون هذا قبل اكتمال المصافحة أو بعدها، اعتمادًا على إصدار بروتوكول TLS الذي تم التفاوض عليه. لا يتم إصدار الحدث على الخادم، أو إذا لم يتم إنشاء جلسة جديدة، على سبيل المثال، عند استئناف الاتصال. بالنسبة لبعض إصدارات بروتوكول TLS، قد يتم إصدار الحدث عدة مرات، وفي هذه الحالة يمكن استخدام جميع الجلسات للاستئناف.

على العميل، يمكن توفير `session` إلى خيار `session` في [`tls.connect()`](/ar/nodejs/api/tls#tlsconnectoptions-callback) لاستئناف الاتصال.

راجع [استئناف الجلسة](/ar/nodejs/api/tls#session-resumption) لمزيد من المعلومات.

بالنسبة إلى TLSv1.2 والإصدارات الأقدم، يمكن استدعاء [`tls.TLSSocket.getSession()`](/ar/nodejs/api/tls#tlssocketgetsession) بمجرد اكتمال المصافحة. بالنسبة إلى TLSv1.3، لا يُسمح ببروتوكول الاستئناف المستند إلى التذاكر إلا بموجب البروتوكول، ويتم إرسال تذاكر متعددة، ولا يتم إرسال التذاكر حتى بعد اكتمال المصافحة. لذلك من الضروري انتظار الحدث `'session'` للحصول على جلسة قابلة للاستئناف. يجب أن تستخدم التطبيقات الحدث `'session'` بدلاً من `getSession()` للتأكد من أنها ستعمل مع جميع إصدارات TLS. يجب على التطبيقات التي تتوقع فقط الحصول على جلسة واحدة أو استخدامها الاستماع إلى هذا الحدث مرة واحدة فقط:

```js [ESM]
tlsSocket.once('session', (session) => {
  // يمكن استخدام الجلسة على الفور أو لاحقًا.
  tls.connect({
    session: session,
    // خيارات اتصال أخرى...
  });
});
```
### `tlsSocket.address()` {#tlssocketaddress}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.4.0 | ترجع الخاصية `family` الآن سلسلة بدلاً من رقم. |
| v18.0.0 | ترجع الخاصية `family` الآن رقمًا بدلاً من سلسلة. |
| v0.11.4 | تمت إضافته في: v0.11.4 |
:::

- الإرجاع: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

يُرجع `address` المرتبط واسم `family` العنوان و`port` المقبس الأساسي كما تم الإبلاغ عنه بواسطة نظام التشغيل: `{ port: 12346, family: 'IPv4', address: '127.0.0.1' }`.


### `tlsSocket.authorizationError` {#tlssocketauthorizationerror}

**أضيف في:** v0.11.4

إرجاع سبب عدم التحقق من شهادة النظير. يتم تعيين هذه الخاصية فقط عندما يكون `tlsSocket.authorized === false`.

### `tlsSocket.authorized` {#tlssocketauthorized}

**أضيف في:** v0.11.4

- [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

تكون هذه الخاصية `true` إذا تم توقيع شهادة النظير بواسطة إحدى هيئات التصديق المحددة عند إنشاء مثيل `tls.TLSSocket`، وإلا فإنها تكون `false`.

### `tlsSocket.disableRenegotiation()` {#tlssocketdisablerenegotiation}

**أضيف في:** v8.4.0

تعطيل إعادة التفاوض لـ TLS لهذا المثيل `TLSSocket`. بمجرد استدعائه، ستحفز محاولات إعادة التفاوض حدث `'error'` على `TLSSocket`.

### `tlsSocket.enableTrace()` {#tlssocketenabletrace}

**أضيف في:** v12.2.0

عند التمكين، تتم كتابة معلومات تتبع حزمة TLS إلى `stderr`. يمكن استخدام هذا لتصحيح مشكلات اتصال TLS.

تنسيق الإخراج مطابق لإخراج `openssl s_client -trace` أو `openssl s_server -trace`. على الرغم من أنه يتم إنتاجه بواسطة دالة `SSL_trace()` في OpenSSL، إلا أن التنسيق غير موثق، ويمكن أن يتغير دون إشعار، ولا ينبغي الاعتماد عليه.

### `tlsSocket.encrypted` {#tlssocketencrypted}

**أضيف في:** v0.11.4

إرجاع `true` دائمًا. يمكن استخدام هذا لتمييز مآخذ توصيل TLS عن مثيلات `net.Socket` العادية.

### `tlsSocket.exportKeyingMaterial(length, label[, context])` {#tlssocketexportkeyingmateriallength-label-context}

**أضيف في:** v13.10.0, v12.17.0

-  `length` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد البايتات المراد استردادها من مادة المفتاح.
-  `label` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) تسمية خاصة بالتطبيق، وعادةً ما تكون قيمة من [سجل ملصقات مصدر IANA](https://www.iana.org/assignments/tls-parameters/tls-parameters.xhtml#exporter-labels).
-  `context` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) قم بتوفير سياق اختياريًا.
-  إرجاع: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) البايتات المطلوبة من مادة المفتاح.

تستخدم مادة المفتاح للتحقق من الصحة لمنع أنواع مختلفة من الهجمات في بروتوكولات الشبكة، على سبيل المثال في مواصفات IEEE 802.1X.

مثال

```js [ESM]
const keyingMaterial = tlsSocket.exportKeyingMaterial(
  128,
  'client finished');

/*
 مثال لقيمة الإرجاع الخاصة بـ keyingMaterial:
 <Buffer 76 26 af 99 c5 56 8e 42 09 91 ef 9f 93 cb ad 6c 7b 65 f8 53 f1 d8 d9
    12 5a 33 b8 b5 25 df 7b 37 9f e0 e2 4f b8 67 83 a3 2f cd 5d 41 42 4c 91
    74 ef 2c ... المزيد من 78 بايت>
*/
```
راجع وثائق OpenSSL [`SSL_export_keying_material`](https://www.openssl.org/docs/man1.1.1/man3/SSL_export_keying_material) لمزيد من المعلومات.


### `tlsSocket.getCertificate()` {#tlssocketgetcertificate}

**أُضيف في: الإصدار v11.2.0**

- يُعيد: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

يُعيد كائنًا يمثل الشهادة المحلية. يحتوي الكائن المُعاد على بعض الخصائص التي تتوافق مع حقول الشهادة.

راجع [`tls.TLSSocket.getPeerCertificate()`](/ar/nodejs/api/tls#tlssocketgetpeercertificatedetailed) للحصول على مثال على بنية الشهادة.

إذا لم تكن هناك شهادة محلية، فسيتم إرجاع كائن فارغ. إذا تم تدمير socket، فسيتم إرجاع `null`.

### `tlsSocket.getCipher()` {#tlssocketgetcipher}


::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| v13.4.0, v12.16.0 | إعادة اسم IETF للشفرة كـ `standardName`. |
| v12.0.0 | إعادة الحد الأدنى من إصدار الشفرة، بدلاً من سلسلة ثابتة (`'TLSv1/SSLv3'`). |
| v0.11.4 | أُضيف في: الإصدار v0.11.4 |
:::

- يُعيد: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم OpenSSL لمجموعة الشفرات.
    - `standardName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم IETF لمجموعة الشفرات.
    - `version` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) الحد الأدنى لإصدار بروتوكول TLS الذي تدعمه مجموعة الشفرات هذه. للحصول على البروتوكول الذي تم التفاوض عليه الفعلي، انظر [`tls.TLSSocket.getProtocol()`](/ar/nodejs/api/tls#tlssocketgetprotocol).
  
 

يُعيد كائنًا يحتوي على معلومات حول مجموعة الشفرات التي تم التفاوض عليها.

على سبيل المثال، بروتوكول TLSv1.2 مع شفرة AES256-SHA:

```json [JSON]
{
    "name": "AES256-SHA",
    "standardName": "TLS_RSA_WITH_AES_256_CBC_SHA",
    "version": "SSLv3"
}
```
راجع [SSL_CIPHER_get_name](https://www.openssl.org/docs/man1.1.1/man3/SSL_CIPHER_get_name) لمزيد من المعلومات.

### `tlsSocket.getEphemeralKeyInfo()` {#tlssocketgetephemeralkeyinfo}

**أُضيف في: الإصدار v5.0.0**

- يُعيد: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

يُعيد كائنًا يمثل النوع والاسم والحجم لمعامل تبادل مفتاح عابر في [السرية الأمامية المثالية](/ar/nodejs/api/tls#perfect-forward-secrecy) على اتصال العميل. يُعيد كائنًا فارغًا عندما لا يكون تبادل المفاتيح عابرًا. نظرًا لأن هذا مدعوم فقط على socket العميل؛ يتم إرجاع `null` إذا تم استدعاؤه على socket الخادم. الأنواع المدعومة هي `'DH'` و `'ECDH'`. الخاصية `name` متاحة فقط عندما يكون النوع هو `'ECDH'`.

على سبيل المثال: `{ type: 'ECDH', name: 'prime256v1', size: 256 }`.


### ‏`tlsSocket.getFinished()` {#tlssocketgetfinished}

**تمت الإضافة في: الإصدار 9.9.0**

- الإرجاع: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) أحدث رسالة `Finished` تم إرسالها إلى المقبس كجزء من مصافحة SSL/TLS، أو `undefined` إذا لم يتم إرسال أي رسالة `Finished` حتى الآن.

بما أن رسائل `Finished` هي خلاصات رسائل للمصافحة الكاملة (بإجمالي 192 بت لـ TLS 1.0 وأكثر لـ SSL 3.0)، فيمكن استخدامها لإجراءات المصادقة الخارجية عندما لا تكون المصادقة التي يوفرها SSL/TLS مرغوبة أو كافية.

يتوافق مع روتين `SSL_get_finished` في OpenSSL ويمكن استخدامه لتنفيذ ربط قناة `tls-unique` من [RFC 5929](https://tools.ietf.org/html/rfc5929).

### ‏`tlsSocket.getPeerCertificate([detailed])` {#tlssocketgetpeercertificatedetailed}

**تمت الإضافة في: الإصدار 0.11.4**

- ‏`detailed` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) قم بتضمين سلسلة الشهادات الكاملة إذا كانت القيمة `true`، وإلا قم بتضمين شهادة النظير فقط.
- الإرجاع: [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) كائن الشهادة.

يُرجع كائنًا يمثل شهادة النظير. إذا لم يقدم النظير شهادة، فسيتم إرجاع كائن فارغ. إذا تم تدمير المقبس، فسيتم إرجاع `null`.

إذا طُلبت سلسلة الشهادات الكاملة، فستتضمن كل شهادة خاصية `issuerCertificate` تحتوي على كائن يمثل شهادة المُصدر الخاص بها.

#### كائن الشهادة {#certificate-object}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار 19.1.0، الإصدار 18.13.0 | إضافة خاصية "ca". |
| الإصدار 17.2.0، الإصدار 16.14.0 | إضافة fingerprint512. |
| الإصدار 11.4.0 | دعم معلومات المفتاح العام للمنحنى الإهليلجي. |
:::

يحتوي كائن الشهادة على خصائص تتوافق مع حقول الشهادة.

- ‏`ca` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) ‏`true` إذا كانت سلطة شهادات (CA)، و`false` بخلاف ذلك.
- ‏`raw` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) بيانات شهادة X.509 المشفرة بـ DER.
- ‏`subject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) موضوع الشهادة، الموصوف من حيث البلد (`C`) والولاية أو المقاطعة (`ST`) والمحلية (`L`) والمؤسسة (`O`) والوحدة التنظيمية (`OU`) والاسم الشائع (`CN`). الاسم الشائع هو عادة اسم DNS مع شهادات TLS. مثال: `{C: 'UK', ST: 'BC', L: 'Metro', O: 'Node Fans', OU: 'Docs', CN: 'example.com'}`.
- ‏`issuer` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) مُصدر الشهادة، الموصوف بنفس الشروط مثل `subject`.
- ‏`valid_from` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) تاريخ ووقت صلاحية الشهادة من.
- ‏`valid_to` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) تاريخ ووقت صلاحية الشهادة إلى.
- ‏`serialNumber` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) الرقم التسلسلي للشهادة، كسلسلة سداسية عشرية. مثال: `'B9B0D332A1AA5635'`.
- ‏`fingerprint` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) خلاصة SHA-1 للشهادة المشفرة بـ DER. يتم إرجاعها كسلسلة سداسية عشرية مفصولة بـ `:`. مثال: `'2A:7A:C2:DD:...'`.
- ‏`fingerprint256` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) خلاصة SHA-256 للشهادة المشفرة بـ DER. يتم إرجاعها كسلسلة سداسية عشرية مفصولة بـ `:`. مثال: `'2A:7A:C2:DD:...'`.
- ‏`fingerprint512` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) خلاصة SHA-512 للشهادة المشفرة بـ DER. يتم إرجاعها كسلسلة سداسية عشرية مفصولة بـ `:`. مثال: `'2A:7A:C2:DD:...'`.
- ‏`ext_key_usage` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) (اختياري) استخدام المفتاح الموسع، مجموعة من OID.
- ‏`subjectaltname` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) (اختياري) سلسلة تحتوي على أسماء متسلسلة للموضوع، بديل لأسماء `subject`.
- ‏`infoAccess` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) (اختياري) مصفوفة تصف AuthorityInfoAccess، المستخدمة مع OCSP.
- ‏`issuerCertificate` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) (اختياري) كائن شهادة المُصدر. بالنسبة للشهادات الموقعة ذاتيًا، قد يكون هذا مرجعًا دائريًا.

قد تحتوي الشهادة على معلومات حول المفتاح العام، اعتمادًا على نوع المفتاح.

بالنسبة لمفاتيح RSA، يمكن تعريف الخصائص التالية:

- ‏`bits` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) حجم بت RSA. مثال: `1024`.
- ‏`exponent` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) أس RSA، كسلسلة في تدوين الأرقام السداسية العشرية. مثال: `'0x010001'`.
- ‏`modulus` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) معامل RSA، كسلسلة سداسية عشرية. مثال: `'B56CE45CB7...'`.
- ‏`pubkey` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) المفتاح العام.

بالنسبة لمفاتيح EC، يمكن تعريف الخصائص التالية:

- ‏`pubkey` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) المفتاح العام.
- ‏`bits` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) حجم المفتاح بالبت. مثال: `256`.
- ‏`asn1Curve` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) (اختياري) اسم ASN.1 لـ OID للمنحنى الإهليلجي. يتم تحديد المنحنيات المعروفة بواسطة OID. على الرغم من أنه من غير المعتاد، فمن المحتمل أن يتم تحديد المنحنى بخصائصه الرياضية، وفي هذه الحالة لن يكون له OID. مثال: `'prime256v1'`.
- ‏`nistCurve` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) (اختياري) اسم NIST للمنحنى الإهليلجي، إذا كان لديه اسم (لم يتم تعيين أسماء لجميع المنحنيات المعروفة بواسطة NIST). مثال: `'P-256'`.

مثال على شهادة:

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

**أُضيف في: v9.9.0**

- Returns: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) أحدث رسالة `Finished` يُتوقع استلامها أو تم استلامها فعليًا من المقبس كجزء من مصافحة SSL/TLS، أو `undefined` إذا لم تكن هناك رسالة `Finished` حتى الآن.

بما أن رسائل `Finished` هي ملخصات رسائل المصافحة الكاملة (بإجمالي 192 بت لـ TLS 1.0 وأكثر لـ SSL 3.0)، فيمكن استخدامها لإجراءات المصادقة الخارجية عندما لا تكون المصادقة التي يوفرها SSL/TLS مرغوبة أو كافية.

يتوافق مع روتين `SSL_get_peer_finished` في OpenSSL ويمكن استخدامه لتنفيذ ربط قناة `tls-unique` من [RFC 5929](https://tools.ietf.org/html/rfc5929).

### `tlsSocket.getPeerX509Certificate()` {#tlssocketgetpeerx509certificate}

**أُضيف في: v15.9.0**

- Returns: [\<X509Certificate\>](/ar/nodejs/api/crypto#class-x509certificate)

إرجاع شهادة النظير ككائن [\<X509Certificate\>](/ar/nodejs/api/crypto#class-x509certificate).

إذا لم تكن هناك شهادة نظير، أو تم تدمير المقبس، فسيتم إرجاع `undefined`.

### `tlsSocket.getProtocol()` {#tlssocketgetprotocol}

**أُضيف في: v5.7.0**

- Returns: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type)

إرجاع سلسلة تحتوي على إصدار بروتوكول SSL/TLS المتفاوض عليه للاتصال الحالي. سيتم إرجاع القيمة `'unknown'` للمآخذ المتصلة التي لم تكمل عملية المصافحة. سيتم إرجاع القيمة `null` لمآخذ الخادم أو مآخذ العميل المنفصلة.

إصدارات البروتوكول هي:

- `'SSLv3'`
- `'TLSv1'`
- `'TLSv1.1'`
- `'TLSv1.2'`
- `'TLSv1.3'`

راجع وثائق OpenSSL [`SSL_get_version`](https://www.openssl.org/docs/man1.1.1/man3/SSL_get_version) لمزيد من المعلومات.

### `tlsSocket.getSession()` {#tlssocketgetsession}

**أُضيف في: v0.11.4**

- [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)

إرجاع بيانات جلسة TLS أو `undefined` إذا لم يتم التفاوض على أي جلسة. على العميل، يمكن توفير البيانات لخيار `session` في [`tls.connect()`](/ar/nodejs/api/tls#tlsconnectoptions-callback) لاستئناف الاتصال. على الخادم، قد يكون ذلك مفيدًا لتصحيح الأخطاء.

راجع [استئناف الجلسة](/ar/nodejs/api/tls#session-resumption) لمزيد من المعلومات.

ملاحظة: يعمل `getSession()` فقط مع TLSv1.2 والإصدارات الأقدم. بالنسبة إلى TLSv1.3، يجب على التطبيقات استخدام حدث [`'session'`](/ar/nodejs/api/tls#event-session) (وهو يعمل أيضًا مع TLSv1.2 والإصدارات الأقدم).


### `tlsSocket.getSharedSigalgs()` {#tlssocketgetsharedsigalgs}

**تمت الإضافة في: v12.11.0**

- Returns: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) قائمة بخوارزميات التوقيع المشتركة بين الخادم والعميل بترتيب تنازلي للأفضلية.

راجع [SSL_get_shared_sigalgs](https://www.openssl.org/docs/man1.1.1/man3/SSL_get_shared_sigalgs) لمزيد من المعلومات.

### `tlsSocket.getTLSTicket()` {#tlssocketgettlsticket}

**تمت الإضافة في: v0.11.4**

- [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer)

بالنسبة إلى العميل، تُرجع تذكرة جلسة TLS إذا كانت متوفرة، أو `undefined`. بالنسبة للخادم، تُرجع دائمًا `undefined`.

قد يكون ذلك مفيدًا لتصحيح الأخطاء.

راجع [استئناف الجلسة](/ar/nodejs/api/tls#session-resumption) لمزيد من المعلومات.

### `tlsSocket.getX509Certificate()` {#tlssocketgetx509certificate}

**تمت الإضافة في: v15.9.0**

- Returns: [\<X509Certificate\>](/ar/nodejs/api/crypto#class-x509certificate)

تُرجع الشهادة المحلية ككائن [\<X509Certificate\>](/ar/nodejs/api/crypto#class-x509certificate).

إذا لم تكن هناك شهادة محلية، أو تم تدمير المقبس، فسيتم إرجاع `undefined`.

### `tlsSocket.isSessionReused()` {#tlssocketissessionreused}

**تمت الإضافة في: v0.5.6**

- Returns: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` إذا تم إعادة استخدام الجلسة، و `false` بخلاف ذلك.

راجع [استئناف الجلسة](/ar/nodejs/api/tls#session-resumption) لمزيد من المعلومات.

### `tlsSocket.localAddress` {#tlssocketlocaladdress}

**تمت الإضافة في: v0.11.4**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

تُرجع التمثيل السلسلي لعنوان IP المحلي.

### `tlsSocket.localPort` {#tlssocketlocalport}

**تمت الإضافة في: v0.11.4**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

تُرجع التمثيل الرقمي للمنفذ المحلي.

### `tlsSocket.remoteAddress` {#tlssocketremoteaddress}

**تمت الإضافة في: v0.11.4**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

تُرجع التمثيل السلسلي لعنوان IP البعيد. على سبيل المثال، `'74.125.127.100'` أو `'2001:4860:a005::68'`.


### `tlsSocket.remoteFamily` {#tlssocketremotefamily}

**تمت الإضافة في: v0.11.4**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

إرجاع التمثيل النصي لعائلة IP البعيدة. `'IPv4'` أو `'IPv6'`.

### `tlsSocket.remotePort` {#tlssocketremoteport}

**تمت الإضافة في: v0.11.4**

- [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

إرجاع التمثيل الرقمي للمنفذ البعيد. على سبيل المثال، `443`.

### `tlsSocket.renegotiate(options, callback)` {#tlssocketrenegotiateoptions-callback}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v18.0.0 | تمرير استدعاء غير صالح إلى وسيطة `callback` يطرح الآن `ERR_INVALID_ARG_TYPE` بدلاً من `ERR_INVALID_CALLBACK`. |
| v0.11.8 | تمت الإضافة في: v0.11.8 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
  - `rejectUnauthorized` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا لم يكن `false`، يتم التحقق من شهادة الخادم مقابل قائمة CAs المقدمة. يتم إصدار حدث `'error'` إذا فشل التحقق؛ يحتوي `err.code` على رمز خطأ OpenSSL. **الافتراضي:** `true`.
  - `requestCert`


- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) إذا أعادت `renegotiate()` القيمة `true`، فسيتم إرفاق رد الاتصال مرة واحدة بحدث `'secure'`. إذا أعادت `renegotiate()` القيمة `false`، فسيتم استدعاء `callback` في التكرار التالي مع وجود خطأ، ما لم يتم تدمير `tlsSocket`، وفي هذه الحالة لن يتم استدعاء `callback` على الإطلاق.
- الإرجاع: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` إذا تم بدء إعادة التفاوض، `false` بخلاف ذلك.

تبدأ الطريقة `tlsSocket.renegotiate()` عملية إعادة التفاوض على TLS. عند الانتهاء، سيتم تمرير وسيطة واحدة إلى وظيفة `callback` وهي إما `Error` (إذا فشل الطلب) أو `null`.

يمكن استخدام هذه الطريقة لطلب شهادة نظير بعد إنشاء الاتصال الآمن.

عند التشغيل كخادم، سيتم تدمير المقبس بخطأ بعد مهلة `handshakeTimeout`.

بالنسبة إلى TLSv1.3، لا يمكن بدء إعادة التفاوض، فهو غير مدعوم من قبل البروتوكول.


### `tlsSocket.setKeyCert(context)` {#tlssocketsetkeycertcontext}

**أُضيف في: v22.5.0, v20.17.0**

- `context` [\<الكائن\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) | [\<tls.SecureContext\>](/ar/nodejs/api/tls#tlscreatesecurecontextoptions) كائن يحتوي على الأقل على الخصائص `key` و `cert` من [`tls.createSecureContext()`](/ar/nodejs/api/tls#tlscreatesecurecontextoptions) `options`، أو كائن سياق TLS تم إنشاؤه باستخدام [`tls.createSecureContext()`](/ar/nodejs/api/tls#tlscreatesecurecontextoptions) نفسه.

تقوم الدالة `tlsSocket.setKeyCert()` بتعيين المفتاح الخاص والشهادة المراد استخدامها للمأخذ. هذا مفيد بشكل أساسي إذا كنت ترغب في تحديد شهادة خادم من `ALPNCallback` لخادم TLS.

### `tlsSocket.setMaxSendFragment(size)` {#tlssocketsetmaxsendfragmentsize}

**أُضيف في: v0.11.11**

- `size` [\<رقم\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الحد الأقصى لحجم جزء TLS. القيمة القصوى هي `16384`. **الافتراضي:** `16384`.
- يُرجع: [\<منطقي\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

تقوم الدالة `tlsSocket.setMaxSendFragment()` بتعيين الحد الأقصى لحجم جزء TLS. تُرجع `true` إذا نجح تعيين الحد؛ `false` خلاف ذلك.

يؤدي تقليل أحجام الأجزاء إلى تقليل زمن انتقال التخزين المؤقت على العميل: يتم تخزين الأجزاء الأكبر مؤقتًا بواسطة طبقة TLS حتى يتم استلام الجزء بأكمله والتحقق من سلامته؛ يمكن أن تغطي الأجزاء الكبيرة عدة رحلات ذهابًا وإيابًا ويمكن أن يتأخر معالجتها بسبب فقدان الحزم أو إعادة ترتيبها. ومع ذلك، تضيف الأجزاء الأصغر بايتات تأطير TLS إضافية وعبء وحدة المعالجة المركزية، مما قد يقلل من إنتاجية الخادم الإجمالية.

## `tls.checkServerIdentity(hostname, cert)` {#tlscheckserveridentityhostname-cert}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v17.3.1, v16.13.2, v14.18.3, v12.22.9 | تم تعطيل دعم أسماء بديلة للموضوع `uniformResourceIdentifier` استجابةً لـ CVE-2021-44531. |
| v0.8.4 | أُضيف في: v0.8.4 |
:::

- `hostname` [\<سلسلة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم المضيف أو عنوان IP للتحقق من الشهادة مقابله.
- `cert` [\<الكائن\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [كائن شهادة](/ar/nodejs/api/tls#certificate-object) يمثل شهادة النظير.
- يُرجع: [\<خطأ\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<غير معرف\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

للتحقق مما إذا كانت الشهادة `cert` صادرة لـ `hostname`.

يُرجع كائن [\<خطأ\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)، ويملؤه بـ `reason` و `host` و `cert` عند الفشل. عند النجاح، يُرجع [\<غير معرف\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type).

تهدف هذه الدالة إلى استخدامها مع الخيار `checkServerIdentity` الذي يمكن تمريره إلى [`tls.connect()`](/ar/nodejs/api/tls#tlsconnectoptions-callback) وعلى هذا النحو تعمل على [كائن شهادة](/ar/nodejs/api/tls#certificate-object). لأغراض أخرى، ضع في اعتبارك استخدام [`x509.checkHost()`](/ar/nodejs/api/crypto#x509checkhostname-options) بدلاً من ذلك.

يمكن استبدال هذه الدالة بتوفير دالة بديلة كخيار `options.checkServerIdentity` الذي يتم تمريره إلى `tls.connect()`. يمكن للدالة المستبدلة استدعاء `tls.checkServerIdentity()` بالطبع، لزيادة عمليات التحقق التي تتم مع التحقق الإضافي.

يتم استدعاء هذه الدالة فقط إذا اجتازت الشهادة جميع عمليات التحقق الأخرى، مثل أن تكون صادرة عن CA موثوق به (`options.ca`).

الإصدارات السابقة من Node.js قبلت بشكل غير صحيح الشهادات لاسم `hostname` معين إذا كان اسم بديل للموضوع `uniformResourceIdentifier` مطابقًا موجودًا (انظر [CVE-2021-44531](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-44531)). يمكن للتطبيقات التي ترغب في قبول أسماء بديلة للموضوع `uniformResourceIdentifier` استخدام دالة `options.checkServerIdentity` مخصصة تنفذ السلوك المطلوب.


## `tls.connect(options[, callback])` {#tlsconnectoptions-callback}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v15.1.0, v14.18.0 | تمت إضافة خيار `onread`. |
| الإصدار v14.1.0, v13.14.0 | تم قبول خيار `highWaterMark` الآن. |
| الإصدار v13.6.0, v12.16.0 | خيار `pskCallback` مدعوم الآن. |
| الإصدار v12.9.0 | دعم خيار `allowHalfOpen`. |
| الإصدار v12.4.0 | خيار `hints` مدعوم الآن. |
| الإصدار v12.2.0 | خيار `enableTrace` مدعوم الآن. |
| الإصدار v11.8.0, v10.16.0 | خيار `timeout` مدعوم الآن. |
| الإصدار v8.0.0 | خيار `lookup` مدعوم الآن. |
| الإصدار v8.0.0 | يمكن أن يكون خيار `ALPNProtocols` الآن `TypedArray` أو `DataView`. |
| الإصدار v5.0.0 | خيارات ALPN مدعومة الآن. |
| الإصدار v5.3.0, v4.7.0 | خيار `secureContext` مدعوم الآن. |
| الإصدار v0.11.3 | تمت إضافته في: v0.11.3 |
:::

- `options` [\<الكائن\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `enableTrace`: انظر [`tls.createServer()`](/ar/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `host` [\<سلسلة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) المضيف الذي يجب أن يتصل به العميل. **الافتراضي:** `'localhost'`.
    - `port` [\<رقم\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) المنفذ الذي يجب أن يتصل به العميل.
    - `path` [\<سلسلة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) ينشئ اتصال مقبس Unix إلى المسار. إذا تم تحديد هذا الخيار، فسيتم تجاهل `host` و `port`.
    - `socket` [\<stream.Duplex\>](/ar/nodejs/api/stream#class-streamduplex) ينشئ اتصالاً آمنًا على مقبس معين بدلاً من إنشاء مقبس جديد. عادةً ما يكون هذا مثيلاً لـ [`net.Socket`](/ar/nodejs/api/net#class-netsocket)، ولكن يُسمح بأي دفق `Duplex`. إذا تم تحديد هذا الخيار، فسيتم تجاهل `path` و `host` و `port` باستثناء التحقق من الشهادة. عادةً ما يكون المقبس متصلاً بالفعل عند تمريره إلى `tls.connect()`، ولكن يمكن توصيله لاحقًا. اتصال/قطع الاتصال/تدمير `socket` هي مسؤولية المستخدم؛ لن يؤدي استدعاء `tls.connect()` إلى استدعاء `net.connect()`.
    - `allowHalfOpen` [\<منطقية\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا تم تعيينها على `false`، فسينهي المقبس تلقائيًا الجانب القابل للكتابة عندما ينتهي الجانب القابل للقراءة. إذا تم تعيين خيار `socket`، فلن يكون لهذا الخيار أي تأثير. راجع خيار `allowHalfOpen` في [`net.Socket`](/ar/nodejs/api/net#class-netsocket) للحصول على التفاصيل. **الافتراضي:** `false`.
    - `rejectUnauthorized` [\<منطقية\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا لم يكن `false`، فسيتم التحقق من شهادة الخادم مقابل قائمة CAs المقدمة. يتم إصدار حدث `'error'` إذا فشل التحقق؛ يحتوي `err.code` على رمز خطأ OpenSSL. **الافتراضي:** `true`.
    - `pskCallback` [\<دالة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) بالنسبة لتفاوض TLS-PSK، انظر [مفاتيح مشتركة مسبقًا](/ar/nodejs/api/tls#pre-shared-keys).
    - `ALPNProtocols`: [\<سلسلة[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer[]\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) مجموعة من السلاسل أو `Buffer` أو `TypedArray` أو `DataView`، أو `Buffer` واحد أو `TypedArray` أو `DataView` يحتوي على بروتوكولات ALPN المدعومة. يجب أن يكون تنسيق `Buffer` هو `[len][name][len][name]...` مثل `'\x08http/1.1\x08http/1.0'`، حيث يكون بايت `len` هو طول اسم البروتوكول التالي. عادةً ما يكون تمرير مجموعة أبسط بكثير، على سبيل المثال `['http/1.1', 'http/1.0']`. تتمتع البروتوكولات السابقة في القائمة بأولوية أعلى من البروتوكولات اللاحقة.
    - `servername`: [\<سلسلة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم الخادم لامتداد SNI (إشارة اسم الخادم) TLS. إنه اسم المضيف الذي يتم الاتصال به، ويجب أن يكون اسم مضيف وليس عنوان IP. يمكن استخدامه بواسطة خادم متعدد الاستضافة لاختيار الشهادة الصحيحة لتقديمها للعميل، انظر خيار `SNICallback` في [`tls.createServer()`](/ar/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener).
    - `checkServerIdentity(servername, cert)` [\<دالة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) وظيفة رد نداء لاستخدامها (بدلاً من وظيفة `tls.checkServerIdentity()` المضمنة) عند التحقق من اسم مضيف الخادم (أو `servername` المقدمة عند تعيينها صراحةً) مقابل الشهادة. يجب أن يُرجع هذا [\<خطأ\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) إذا فشل التحقق. يجب أن تُرجع الطريقة `undefined` إذا تم التحقق من `servername` و `cert`.
    - `session` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) مثيل `Buffer`، يحتوي على جلسة TLS.
    - `minDHSize` [\<رقم\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) الحد الأدنى لحجم معلمة DH بالبتات لقبول اتصال TLS. عندما يقدم الخادم معلمة DH بحجم أقل من `minDHSize`، يتم تدمير اتصال TLS ويتم طرح خطأ. **الافتراضي:** `1024`.
    - `highWaterMark`: [\<رقم\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يتوافق مع معلمة دفق القراءة `highWaterMark`. **الافتراضي:** `16 * 1024`.
    - `secureContext`: كائن سياق TLS تم إنشاؤه باستخدام [`tls.createSecureContext()`](/ar/nodejs/api/tls#tlscreatesecurecontextoptions). إذا *لم* يتم توفير `secureContext`، فسيتم إنشاء واحد عن طريق تمرير كائن `options` بالكامل إلى `tls.createSecureContext()`.
    - `onread` [\<الكائن\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) إذا كان خيار `socket` مفقودًا، فسيتم تخزين البيانات الواردة في `buffer` واحد وتمريرها إلى `callback` المقدمة عند وصول البيانات إلى المقبس، وإلا فسيتم تجاهل الخيار. انظر خيار `onread` في [`net.Socket`](/ar/nodejs/api/net#class-netsocket) للحصول على التفاصيل.
    - ...: خيارات [`tls.createSecureContext()`](/ar/nodejs/api/tls#tlscreatesecurecontextoptions) التي يتم استخدامها إذا كان خيار `secureContext` مفقودًا، وإلا فسيتم تجاهلها.
    - ...: أي خيار [`socket.connect()`](/ar/nodejs/api/net#socketconnectoptions-connectlistener) غير مدرج بالفعل.

- `callback` [\<دالة\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- الإرجاع: [\<tls.TLSSocket\>](/ar/nodejs/api/tls#class-tlstlssocket)

ستتم إضافة وظيفة `callback`، إذا تم تحديدها، كمستمع لحدث [`'secureConnect'`](/ar/nodejs/api/tls#event-secureconnect).

تُرجع `tls.connect()` كائن [`tls.TLSSocket`](/ar/nodejs/api/tls#class-tlstlssocket).

على عكس واجهة برمجة تطبيقات `https`، لا تقوم `tls.connect()` بتمكين امتداد SNI (إشارة اسم الخادم) بشكل افتراضي، مما قد يتسبب في قيام بعض الخوادم بإرجاع شهادة غير صحيحة أو رفض الاتصال تمامًا. لتمكين SNI، قم بتعيين خيار `servername` بالإضافة إلى `host`.

يوضح ما يلي عميلاً لمثال خادم الصدى من [`tls.createServer()`](/ar/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener):

::: code-group
```js [ESM]
// يفترض وجود خادم صدى يستمع على المنفذ 8000.
import { connect } from 'node:tls';
import { readFileSync } from 'node:fs';
import { stdin } from 'node:process';

const options = {
  // ضروري فقط إذا كان الخادم يتطلب مصادقة شهادة العميل.
  key: readFileSync('client-key.pem'),
  cert: readFileSync('client-cert.pem'),

  // ضروري فقط إذا كان الخادم يستخدم شهادة موقعة ذاتيًا.
  ca: [ readFileSync('server-cert.pem') ],

  // ضروري فقط إذا لم تكن شهادة الخادم لـ "localhost".
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
// يفترض وجود خادم صدى يستمع على المنفذ 8000.
const { connect } = require('node:tls');
const { readFileSync } = require('node:fs');

const options = {
  // ضروري فقط إذا كان الخادم يتطلب مصادقة شهادة العميل.
  key: readFileSync('client-key.pem'),
  cert: readFileSync('client-cert.pem'),

  // ضروري فقط إذا كان الخادم يستخدم شهادة موقعة ذاتيًا.
  ca: [ readFileSync('server-cert.pem') ],

  // ضروري فقط إذا لم تكن شهادة الخادم لـ "localhost".
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

لإنشاء الشهادة والمفتاح لهذا المثال، قم بتشغيل:

```bash [BASH]
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
  -keyout client-key.pem -out client-cert.pem
```
ثم، لإنشاء شهادة `server-cert.pem` لهذا المثال، قم بتشغيل:

```bash [BASH]
openssl pkcs12 -certpbe AES-256-CBC -export -out server-cert.pem \
  -inkey client-key.pem -in client-cert.pem
```

## `tls.connect(path[, options][, callback])` {#tlsconnectpath-options-callback}

**أُضيف في: v0.11.3**

- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) القيمة الافتراضية لـ `options.path`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) انظر [`tls.connect()`](/ar/nodejs/api/tls#tlsconnectoptions-callback).
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) انظر [`tls.connect()`](/ar/nodejs/api/tls#tlsconnectoptions-callback).
- العائدات: [\<tls.TLSSocket\>](/ar/nodejs/api/tls#class-tlstlssocket)

نفس [`tls.connect()`](/ar/nodejs/api/tls#tlsconnectoptions-callback) باستثناء أنه يمكن توفير `path` كمعامل بدلاً من خيار.

سيكون لخيار المسار، إذا تم تحديده، الأسبقية على معامل المسار.

## `tls.connect(port[, host][, options][, callback])` {#tlsconnectport-host-options-callback}

**أُضيف في: v0.11.3**

- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) القيمة الافتراضية لـ `options.port`.
- `host` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) القيمة الافتراضية لـ `options.host`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) انظر [`tls.connect()`](/ar/nodejs/api/tls#tlsconnectoptions-callback).
- `callback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) انظر [`tls.connect()`](/ar/nodejs/api/tls#tlsconnectoptions-callback).
- العائدات: [\<tls.TLSSocket\>](/ar/nodejs/api/tls#class-tlstlssocket)

نفس [`tls.connect()`](/ar/nodejs/api/tls#tlsconnectoptions-callback) باستثناء أنه يمكن توفير `port` و `host` كمعاملات بدلاً من خيارات.

سيكون لخيار المنفذ أو المضيف، إذا تم تحديده، الأسبقية على أي معامل منفذ أو مضيف.

## `tls.createSecureContext([options])` {#tlscreatesecurecontextoptions}


::: info [تاريخ الإصدار]
| الإصدار | التغييرات |
| --- | --- |
| v22.9.0, v20.18.0 | تمت إضافة خيار `allowPartialTrustChain`. |
| v22.4.0, v20.16.0 | يعتمد الخيار `clientCertEngine` و `privateKeyEngine` و `privateKeyIdentifier` على دعم المحرك المخصص في OpenSSL الذي تم إهماله في OpenSSL 3. |
| v19.8.0, v18.16.0 | يمكن الآن تعيين الخيار `dhparam` على `'auto'` لتمكين DHE مع معلمات معروفة ومناسبة. |
| v12.12.0 | تمت إضافة خيارات `privateKeyIdentifier` و `privateKeyEngine` للحصول على مفتاح خاص من محرك OpenSSL. |
| v12.11.0 | تمت إضافة خيار `sigalgs` لتجاوز خوارزميات التوقيع المدعومة. |
| v12.0.0 | تمت إضافة دعم TLSv1.3. |
| v11.5.0 | يدعم الخيار `ca:` الآن `BEGIN TRUSTED CERTIFICATE`. |
| v11.4.0, v10.16.0 | يمكن استخدام `minVersion` و `maxVersion` لتقييد إصدارات بروتوكول TLS المسموح بها. |
| v10.0.0 | لم يعد بالإمكان تعيين `ecdhCurve` على `false` بسبب تغيير في OpenSSL. |
| v9.3.0 | يمكن أن يتضمن الآن المعامل `options` `clientCertEngine`. |
| v9.0.0 | يمكن أن يكون الخيار `ecdhCurve` الآن أسماء منحنيات متعددة مفصولة بـ `':'` أو `'auto'`. |
| v7.3.0 | إذا كان الخيار `key` عبارة عن مصفوفة، فلا تحتاج الإدخالات الفردية إلى خاصية `passphrase` بعد الآن. يمكن أن تكون إدخالات `Array` أيضًا مجرد `string` أو `Buffer` الآن. |
| v5.2.0 | يمكن أن يكون الخيار `ca` الآن سلسلة واحدة تحتوي على شهادات CA متعددة. |
| v0.11.13 | أُضيف في: v0.11.13 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `allowPartialTrustChain` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) التعامل مع الشهادات الوسيطة (غير الموقعة ذاتيًا) في قائمة شهادات CA الموثوق بها على أنها موثوقة.
    - `ca` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<Buffer[]\>](/ar/nodejs/api/buffer#class-buffer) تجاوز اختياري لشهادات CA الموثوق بها. الافتراضي هو الوثوق بـ CAs المعروفة التي ترعاها Mozilla. يتم استبدال CAs الخاصة بـ Mozilla تمامًا عند تحديد CAs بشكل صريح باستخدام هذا الخيار. يمكن أن تكون القيمة سلسلة أو `Buffer`، أو `Array` من السلاسل و/أو `Buffer`s. يمكن أن تحتوي أي سلسلة أو `Buffer` على العديد من PEM CAs المتسلسلة معًا. يجب أن تكون شهادة النظير قابلة للتسلسل إلى CA موثوق بها من قبل الخادم ليتم مصادقة الاتصال. عند استخدام الشهادات غير القابلة للتسلسل إلى CA معروفة، يجب تحديد CA الخاصة بالشهادة بشكل صريح على أنها موثوقة وإلا سيفشل الاتصال في المصادقة. إذا كان النظير يستخدم شهادة لا تطابق أو تتسلسل إلى إحدى CAs الافتراضية، فاستخدم الخيار `ca` لتوفير شهادة CA يمكن أن تطابق شهادة النظير أو تتسلسل إليها. بالنسبة للشهادات الموقعة ذاتيًا، تكون الشهادة هي CA الخاصة بها، ويجب توفيرها. بالنسبة للشهادات المشفرة PEM، الأنواع المدعومة هي "TRUSTED CERTIFICATE" و "X509 CERTIFICATE" و "CERTIFICATE". انظر أيضًا [`tls.rootCertificates`](/ar/nodejs/api/tls#tlsrootcertificates).
    - `cert` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<Buffer[]\>](/ar/nodejs/api/buffer#class-buffer) سلاسل الشهادات بتنسيق PEM. يجب توفير سلسلة شهادات واحدة لكل مفتاح خاص. يجب أن تتكون كل سلسلة شهادات من الشهادة المنسقة PEM لمفتاح `key` خاص مُقدَّم، متبوعة بالشهادات الوسيطة المنسقة PEM (إن وجدت)، بالترتيب، وعدم تضمين CA الجذر (يجب أن تكون CA الجذر معروفة مسبقًا للنظير، انظر `ca`). عند توفير سلاسل شهادات متعددة، ليس من الضروري أن تكون بنفس ترتيب مفاتيحها الخاصة في `key`. إذا لم يتم توفير الشهادات الوسيطة، فلن يتمكن النظير من التحقق من صحة الشهادة، وستفشل المصافحة.
    - `sigalgs` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) قائمة خوارزميات التوقيع المدعومة مفصولة بنقطتين رأسيتين. يمكن أن تحتوي القائمة على خوارزميات التجزئة (`SHA256`، `MD5` وما إلى ذلك)، أو خوارزميات المفتاح العام (`RSA-PSS`، `ECDSA` وما إلى ذلك)، أو مجموعة من الاثنين معًا (على سبيل المثال، 'RSA+SHA384') أو أسماء مخطط TLS v1.3 (على سبيل المثال، `rsa_pss_pss_sha512`). انظر [صفحات دليل OpenSSL](https://www.openssl.org/docs/man1.1.1/man3/SSL_CTX_set1_sigalgs_list) لمزيد من المعلومات.
    - `ciphers` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) مواصفات مجموعة التشفير، لتحل محل الإعداد الافتراضي. لمزيد من المعلومات، انظر [تعديل مجموعة تشفير TLS الافتراضية](/ar/nodejs/api/tls#modifying-the-default-tls-cipher-suite). يمكن الحصول على التشفيرات المسموح بها عبر [`tls.getCiphers()`](/ar/nodejs/api/tls#tlsgetciphers). يجب أن تكون أسماء التشفير بأحرف كبيرة حتى يقبلها OpenSSL.
    - `clientCertEngine` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم محرك OpenSSL الذي يمكنه توفير شهادة العميل. **مهملة.**
    - `crl` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<Buffer[]\>](/ar/nodejs/api/buffer#class-buffer) CRLs المنسقة PEM (قوائم إبطال الشهادات).
    - `dhparam` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) `'auto'` أو معلمات Diffie-Hellman المخصصة، المطلوبة لـ non-ECDHE [السرية الأمامية المثالية](/ar/nodejs/api/tls#perfect-forward-secrecy). إذا تم حذفه أو كان غير صالح، فسيتم تجاهل المعلمات بصمت ولن تتوفر تشفيرات DHE. [ECDHE](https://en.wikipedia.org/wiki/Elliptic_curve_Diffie%E2%80%93Hellman) القائمة على [السرية الأمامية المثالية](/ar/nodejs/api/tls#perfect-forward-secrecy) ستظل متاحة.
    - `ecdhCurve` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) سلسلة تصف منحنى مسمى أو قائمة NIDs أو أسماء منحنيات مفصولة بنقطتين رأسيتين، على سبيل المثال `P-521:P-384:P-256`، لاستخدامها لاتفاقية مفتاح ECDH. اضبط على `auto` لتحديد المنحنى تلقائيًا. استخدم [`crypto.getCurves()`](/ar/nodejs/api/crypto#cryptogetcurves) للحصول على قائمة بأسماء المنحنيات المتاحة. في الإصدارات الحديثة، سيعرض `openssl ecparam -list_curves` أيضًا اسم ووصف كل منحنى إهليلجي متاح. **الافتراضي:** [`tls.DEFAULT_ECDH_CURVE`](/ar/nodejs/api/tls#tlsdefault_ecdh_curve).
    - `honorCipherOrder` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) محاولة استخدام تفضيلات مجموعة التشفير الخاصة بالخادم بدلاً من تفضيلات العميل. عندما تكون `true`، يتسبب في تعيين `SSL_OP_CIPHER_SERVER_PREFERENCE` في `secureOptions`، انظر [خيارات OpenSSL](/ar/nodejs/api/crypto#openssl-options) لمزيد من المعلومات.
    - `key` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<Buffer[]\>](/ar/nodejs/api/buffer#class-buffer) | [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) المفاتيح الخاصة بتنسيق PEM. يسمح PEM بخيار تشفير المفاتيح الخاصة. سيتم فك تشفير المفاتيح المشفرة باستخدام `options.passphrase`. يمكن توفير مفاتيح متعددة تستخدم خوارزميات مختلفة إما كمصفوفة من سلاسل أو مخازن مؤقتة للمفاتيح غير المشفرة، أو مصفوفة من الكائنات بالشكل `{pem: \<string|buffer\>[, passphrase: \<string\>]}`. يمكن أن يظهر شكل الكائن فقط في مصفوفة. `object.passphrase` اختياري. سيتم فك تشفير المفاتيح المشفرة باستخدام `object.passphrase` إذا تم توفيره، أو `options.passphrase` إذا لم يكن كذلك.
    - `privateKeyEngine` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم محرك OpenSSL للحصول على المفتاح الخاص منه. يجب استخدامه مع `privateKeyIdentifier`. **مهملة.**
    - `privateKeyIdentifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) معرف للمفتاح الخاص الذي يديره محرك OpenSSL. يجب استخدامه مع `privateKeyEngine`. يجب عدم تعيينه مع `key`، لأن كلا الخيارين يحددان مفتاحًا خاصًا بطرق مختلفة. **مهملة.**
    - `maxVersion` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اضبط اختياريًا الحد الأقصى لإصدار TLS المسموح به. أحد `'TLSv1.3'` أو `'TLSv1.2'` أو `'TLSv1.1'` أو `'TLSv1'`. لا يمكن تحديده مع الخيار `secureProtocol`؛ استخدم أحدهما أو الآخر. **الافتراضي:** [`tls.DEFAULT_MAX_VERSION`](/ar/nodejs/api/tls#tlsdefault_max_version).
    - `minVersion` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اضبط اختياريًا الحد الأدنى لإصدار TLS المسموح به. أحد `'TLSv1.3'` أو `'TLSv1.2'` أو `'TLSv1.1'` أو `'TLSv1'`. لا يمكن تحديده مع الخيار `secureProtocol`؛ استخدم أحدهما أو الآخر. تجنب التعيين إلى أقل من TLSv1.2، ولكن قد يكون ذلك مطلوبًا للتوافق التشغيلي. قد تتطلب الإصدارات التي تسبق TLSv1.2 تخفيض [مستوى أمان OpenSSL](/ar/nodejs/api/tls#openssl-security-level). **الافتراضي:** [`tls.DEFAULT_MIN_VERSION`](/ar/nodejs/api/tls#tlsdefault_min_version).
    - `passphrase` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) عبارة مرور مشتركة تستخدم لمفتاح خاص واحد و/أو PFX.
    - `pfx` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<Buffer[]\>](/ar/nodejs/api/buffer#class-buffer) | [\<Object[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) مفتاح خاص وسلسلة شهادات بتشفير PFX أو PKCS12. `pfx` هو بديل لتوفير `key` و `cert` بشكل فردي. عادة ما يكون PFX مشفرًا، وإذا كان كذلك، فسيتم استخدام `passphrase` لفك تشفيره. يمكن توفير PFX متعدد إما كمصفوفة من مخازن مؤقتة PFX غير مشفرة، أو مصفوفة من الكائنات بالشكل `{buf: \<string|buffer\>[, passphrase: \<string\>]}`. يمكن أن يظهر شكل الكائن فقط في مصفوفة. `object.passphrase` اختياري. سيتم فك تشفير PFX المشفر باستخدام `object.passphrase` إذا تم توفيره، أو `options.passphrase` إذا لم يكن كذلك.
    - `secureOptions` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) يؤثر اختياريًا على سلوك بروتوكول OpenSSL، وهو أمر غير ضروري عادةً. يجب استخدام هذا بحذر إذا كان على الإطلاق! القيمة هي قناع بت رقمي لخيارات `SSL_OP_*` من [خيارات OpenSSL](/ar/nodejs/api/crypto#openssl-options).
    - `secureProtocol` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) آلية قديمة لتحديد إصدار بروتوكول TLS المراد استخدامه، فهي لا تدعم التحكم المستقل في الحد الأدنى والحد الأقصى للإصدار، ولا تدعم قصر البروتوكول على TLSv1.3. استخدم `minVersion` و `maxVersion` بدلاً من ذلك. يتم سرد القيم الممكنة كـ [SSL_METHODS](https://www.openssl.org/docs/man1.1.1/man7/ssl#Dealing-with-Protocol-Methods)، استخدم أسماء الوظائف كسلاسل. على سبيل المثال، استخدم `'TLSv1_1_method'` لفرض إصدار TLS 1.1، أو `'TLS_method'` للسماح بأي إصدار بروتوكول TLS يصل إلى TLSv1.3. لا يوصى باستخدام إصدارات TLS الأقل من 1.2، ولكن قد يكون ذلك مطلوبًا للتوافق التشغيلي. **الافتراضي:** لا شيء، انظر `minVersion`.
    - `sessionIdContext` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) معرف مبهم يستخدمه الخوادم لضمان عدم مشاركة حالة الجلسة بين التطبيقات. غير مستخدم من قبل العملاء.
    - `ticketKeys`: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) 48 بايت من البيانات العشوائية الزائفة المشفرة بقوة. انظر [استئناف الجلسة](/ar/nodejs/api/tls#session-resumption) لمزيد من المعلومات.
    - `sessionTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد الثواني التي بعدها لن تكون جلسة TLS التي أنشأها الخادم قابلة للاستئناف. انظر [استئناف الجلسة](/ar/nodejs/api/tls#session-resumption) لمزيد من المعلومات. **الافتراضي:** `300`.
  
 

[`tls.createServer()`](/ar/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener) يضبط القيمة الافتراضية للخيار `honorCipherOrder` على `true`، تترك واجهات برمجة التطبيقات الأخرى التي تنشئ سياقات آمنة دون تعيينها.

[`tls.createServer()`](/ar/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener) يستخدم قيمة تجزئة SHA1 مقتطعة 128 بت تم إنشاؤها من `process.argv` كقيمة افتراضية للخيار `sessionIdContext`، لا تحتوي واجهات برمجة التطبيقات الأخرى التي تنشئ سياقات آمنة على قيمة افتراضية.

يقوم الأسلوب `tls.createSecureContext()` بإنشاء كائن `SecureContext`. إنه قابل للاستخدام كمعامل للعديد من واجهات برمجة تطبيقات `tls`، مثل [`server.addContext()`](/ar/nodejs/api/tls#serveraddcontexthostname-context)، ولكن ليس لديه أي أساليب عامة. لا يدعم مُنشئ [`tls.Server`](/ar/nodejs/api/tls#class-tlsserver) والأسلوب [`tls.createServer()`](/ar/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener) الخيار `secureContext`.

المفتاح *مطلوب* للتشفيرات التي تستخدم الشهادات. يمكن استخدام `key` أو `pfx` لتوفيره.

إذا لم يتم إعطاء الخيار `ca`، فسوف تستخدم Node.js افتراضيًا [قائمة CAs الموثوق بها علنًا من Mozilla](https://hg.mozilla.org/mozilla-central/raw-file/tip/security/nss/lib/ckfw/builtins/certdata.txt).

لا يُنصح باستخدام معلمات DHE المخصصة لصالح الخيار الجديد `dhparam: 'auto'`. عند التعيين على `'auto'`، سيتم تحديد معلمات DHE المعروفة ذات القوة الكافية تلقائيًا. بخلاف ذلك، إذا لزم الأمر، يمكن استخدام `openssl dhparam` لإنشاء معلمات مخصصة. يجب أن يكون طول المفتاح أكبر من أو يساوي 1024 بت وإلا سيتم طرح خطأ. على الرغم من أن 1024 بت مسموح به، استخدم 2048 بت أو أكبر لأمان أقوى.


## `tls.createSecurePair([context][, isServer][, requestCert][, rejectUnauthorized][, options])` {#tlscreatesecurepaircontext-isserver-requestcert-rejectunauthorized-options}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v5.0.0 | خيارات ALPN مدعومة الآن. |
| v0.11.3 | مهمل منذ: v0.11.3 |
| v0.3.2 | تمت الإضافة في: v0.3.2 |
:::

::: danger [مستقر: 0 - مهمل]
[مستقر: 0](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 0](/ar/nodejs/api/documentation#stability-index) - مهمل: استخدم [`tls.TLSSocket`](/ar/nodejs/api/tls#class-tlstlssocket) بدلاً من ذلك.
:::

- `context` [\<الكائن\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) كائن سياق آمن كما هو مُرجع بواسطة `tls.createSecureContext()`
- `isServer` [\<بولياني\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` لتحديد أنه يجب فتح اتصال TLS هذا كخادم.
- `requestCert` [\<بولياني\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) `true` لتحديد ما إذا كان يجب على الخادم طلب شهادة من العميل المتصل. ينطبق فقط عندما تكون `isServer` هي `true`.
- `rejectUnauthorized` [\<بولياني\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا لم تكن `false` سيرفض الخادم تلقائيًا العملاء الذين لديهم شهادات غير صالحة. ينطبق فقط عندما تكون `isServer` هي `true`.
- `options`
    - `enableTrace`: راجع [`tls.createServer()`](/ar/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `secureContext`: كائن سياق TLS من [`tls.createSecureContext()`](/ar/nodejs/api/tls#tlscreatesecurecontextoptions)
    - `isServer`: إذا كانت `true` سيتم إنشاء مقبس TLS في وضع الخادم. **افتراضي:** `false`.
    - `server` [\<net.Server\>](/ar/nodejs/api/net#class-netserver) مثيل [`net.Server`](/ar/nodejs/api/net#class-netserver)
    - `requestCert`: راجع [`tls.createServer()`](/ar/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `rejectUnauthorized`: راجع [`tls.createServer()`](/ar/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `ALPNProtocols`: راجع [`tls.createServer()`](/ar/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `SNICallback`: راجع [`tls.createServer()`](/ar/nodejs/api/tls#tlscreateserveroptions-secureconnectionlistener)
    - `session` [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) مثيل `Buffer` يحتوي على جلسة TLS.
    - `requestOCSP` [\<بولياني\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا كانت `true`، تحدد أنه ستتم إضافة ملحق طلب حالة OCSP إلى تحية العميل وسيتم إصدار حدث `'OCSPResponse'` على المقبس قبل إنشاء اتصال آمن.

يقوم بإنشاء كائن زوج آمن جديد مع تدفقين، أحدهما يقرأ ويكتب البيانات المشفرة والآخر يقرأ ويكتب بيانات النص الواضح. بشكل عام، يتم توجيه التدفق المشفر من/إلى تدفق بيانات مشفرة واردة ويستخدم تدفق النص الواضح كبديل للتدفق المشفر الأولي.

`tls.createSecurePair()` يُرجع كائن `tls.SecurePair` مع خصائص تدفق `cleartext` و `encrypted`.

استخدام `cleartext` لديه نفس واجهة برمجة التطبيقات مثل [`tls.TLSSocket`](/ar/nodejs/api/tls#class-tlstlssocket).

تم الآن إهمال طريقة `tls.createSecurePair()` لصالح `tls.TLSSocket()`. على سبيل المثال، الكود:

```js [ESM]
pair = tls.createSecurePair(/* ... */);
pair.encrypted.pipe(socket);
socket.pipe(pair.encrypted);
```
يمكن استبداله بـ:

```js [ESM]
secureSocket = tls.TLSSocket(socket, options);
```
حيث أن `secureSocket` لديه نفس واجهة برمجة التطبيقات مثل `pair.cleartext`.


## `tls.createServer([options][, secureConnectionListener])` {#tlscreateserveroptions-secureconnectionlistener}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v22.4.0, v20.16.0 | يعتمد خيار `clientCertEngine` على دعم محرك مخصص في OpenSSL الذي تم إهماله في OpenSSL 3. |
| v19.0.0 | إذا تم تعيين `ALPNProtocols`، فسيتم إنهاء الاتصالات الواردة التي ترسل ملحق ALPN بدون بروتوكولات مدعومة بتنبيه `no_application_protocol` قاتل. |
| v20.4.0, v18.19.0 | يمكن أن يتضمن المعامل `options` الآن `ALPNCallback`. |
| v12.3.0 | يدعم المعامل `options` الآن خيارات `net.createServer()`. |
| v9.3.0 | يمكن أن يتضمن المعامل `options` الآن `clientCertEngine`. |
| v8.0.0 | يمكن أن يكون خيار `ALPNProtocols` الآن `TypedArray` أو `DataView`. |
| v5.0.0 | خيارات ALPN مدعومة الآن. |
| v0.3.2 | تمت الإضافة في: v0.3.2 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `ALPNProtocols`: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer[]\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) | [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) | [\<TypedArray\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [\<DataView\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) مصفوفة من السلاسل أو `Buffer`s أو `TypedArray`s أو `DataView`s، أو `Buffer` أو `TypedArray` أو `DataView` واحد يحتوي على بروتوكولات ALPN المدعومة. يجب أن يكون تنسيق `Buffer`s هو `[len][name][len][name]...` على سبيل المثال `0x05hello0x05world`، حيث يكون البايت الأول هو طول اسم البروتوكول التالي. عادةً ما يكون تمرير مصفوفة أبسط بكثير، على سبيل المثال `['hello', 'world']`. (يجب ترتيب البروتوكولات حسب أولويتها.)
    - `ALPNCallback`: [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) إذا تم تعيينه، فسيتم استدعاء هذا عندما يفتح عميل اتصالًا باستخدام ملحق ALPN. سيتم تمرير وسيطة واحدة إلى الاستدعاء: كائن يحتوي على حقلي `servername` و `protocols`، على التوالي يحتويان على اسم الخادم من ملحق SNI (إن وجد) ومصفوفة من سلاسل أسماء بروتوكول ALPN. يجب أن يُرجع الاستدعاء إما إحدى السلاسل المدرجة في `protocols`، والتي سيتم إرجاعها إلى العميل كبروتوكول ALPN المحدد، أو `undefined`، لرفض الاتصال بتنبيه قاتل. إذا تم إرجاع سلسلة لا تتطابق مع أحد بروتوكولات ALPN الخاصة بالعميل، فسيتم طرح خطأ. لا يمكن استخدام هذا الخيار مع خيار `ALPNProtocols`، وسيؤدي تعيين كلا الخيارين إلى طرح خطأ.
    - `clientCertEngine` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) اسم محرك OpenSSL الذي يمكنه توفير شهادة العميل. **تم الإهمال.**
    - `enableTrace` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا كان `true`، فسيتم استدعاء [`tls.TLSSocket.enableTrace()`](/ar/nodejs/api/tls#tlssocketenabletrace) على الاتصالات الجديدة. يمكن تمكين التتبع بعد إنشاء الاتصال الآمن، ولكن يجب استخدام هذا الخيار لتتبع إعداد الاتصال الآمن. **الافتراضي:** `false`.
    - `handshakeTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) قم بإجهاض الاتصال إذا لم تنتهِ مصافحة SSL/TLS في العدد المحدد من المللي ثانية. يتم إصدار `'tlsClientError'` على كائن `tls.Server` كلما انتهت مهلة المصافحة. **الافتراضي:** `120000` (120 ثانية).
    - `rejectUnauthorized` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا لم يكن `false`، فسيرفض الخادم أي اتصال غير مصرح به بقائمة CAs المقدمة. هذا الخيار له تأثير فقط إذا كان `requestCert` هو `true`. **الافتراضي:** `true`.
    - `requestCert` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) إذا كان `true`، فسيطلب الخادم شهادة من العملاء الذين يتصلون ويحاولون التحقق من هذه الشهادة. **الافتراضي:** `false`.
    - `sessionTimeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) عدد الثواني التي بعدها لن يكون من الممكن استئناف جلسة TLS التي أنشأها الخادم. راجع [استئناف الجلسة](/ar/nodejs/api/tls#session-resumption) لمزيد من المعلومات. **الافتراضي:** `300`.
    - `SNICallback(servername, callback)` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) دالة سيتم استدعاؤها إذا كان العميل يدعم ملحق SNI TLS. سيتم تمرير وسيطتين عند الاستدعاء: `servername` و `callback`. `callback` هو استدعاء الخطأ الأول الذي يأخذ وسيطتين اختياريتين: `error` و `ctx`. `ctx`، إذا تم توفيره، هو مثيل `SecureContext`. يمكن استخدام [`tls.createSecureContext()`](/ar/nodejs/api/tls#tlscreatesecurecontextoptions) للحصول على `SecureContext` مناسب. إذا تم استدعاء `callback` بوسيطة `ctx` زائفة، فسيتم استخدام سياق الأمان الافتراضي للخادم. إذا لم يتم توفير `SNICallback`، فسيتم استخدام الاستدعاء الافتراضي مع واجهة برمجة تطبيقات عالية المستوى (انظر أدناه).
    - `ticketKeys`: [\<Buffer\>](/ar/nodejs/api/buffer#class-buffer) 48 بايت من البيانات العشوائية الزائفة القوية المشفرة. راجع [استئناف الجلسة](/ar/nodejs/api/tls#session-resumption) لمزيد من المعلومات.
    - `pskCallback` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) لتفاوض TLS-PSK، راجع [المفاتيح المشتركة مسبقًا](/ar/nodejs/api/tls#pre-shared-keys).
    - `pskIdentityHint` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) تلميح اختياري لإرساله إلى العميل للمساعدة في تحديد الهوية أثناء تفاوض TLS-PSK. سيتم تجاهله في TLS 1.3. عند الفشل في تعيين pskIdentityHint، سيتم إصدار `'tlsClientError'` مع رمز `'ERR_TLS_PSK_SET_IDENTITY_HINT_FAILED'`.
    - ...: يمكن توفير أي خيار [`tls.createSecureContext()`](/ar/nodejs/api/tls#tlscreatesecurecontextoptions). بالنسبة للخوادم، عادةً ما تكون خيارات الهوية (`pfx` أو `key`/`cert` أو `pskCallback`) مطلوبة.
    - ...: يمكن توفير أي خيار [`net.createServer()`](/ar/nodejs/api/net#netcreateserveroptions-connectionlistener).
  
 
- `secureConnectionListener` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
- الإرجاع: [\<tls.Server\>](/ar/nodejs/api/tls#class-tlsserver)

ينشئ [`tls.Server`](/ar/nodejs/api/tls#class-tlsserver) جديدًا. يتم تعيين `secureConnectionListener`، إذا تم توفيره، تلقائيًا كمستمع لحدث [`'secureConnection'`](/ar/nodejs/api/tls#event-secureconnection).

تتم مشاركة خيارات `ticketKeys` تلقائيًا بين العاملين في وحدة `node:cluster`.

يوضح ما يلي خادم صدى بسيط:



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

لإنشاء الشهادة والمفتاح لهذا المثال، قم بتشغيل:

```bash [BASH]
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' \
  -keyout server-key.pem -out server-cert.pem
```
بعد ذلك، لإنشاء شهادة `client-cert.pem` لهذا المثال، قم بتشغيل:

```bash [BASH]
openssl pkcs12 -certpbe AES-256-CBC -export -out client-cert.pem \
  -inkey server-key.pem -in server-cert.pem
```
يمكن اختبار الخادم عن طريق الاتصال به باستخدام مثال العميل من [`tls.connect()`](/ar/nodejs/api/tls#tlsconnectoptions-callback).


## `tls.getCiphers()` {#tlsgetciphers}

**تمت الإضافة في: الإصدار 0.10.2**

- الإرجاع: [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

تقوم بإرجاع مصفوفة بأسماء تشفيرات TLS المدعومة. الأسماء هي بأحرف صغيرة لأسباب تاريخية، ولكن يجب أن تكون بأحرف كبيرة لاستخدامها في خيار `ciphers` الخاص بـ [`tls.createSecureContext()`](/ar/nodejs/api/tls#tlscreatesecurecontextoptions).

ليست كل التشفيرات المدعومة مفعلة افتراضيًا. راجع [تعديل مجموعة تشفير TLS الافتراضية](/ar/nodejs/api/tls#modifying-the-default-tls-cipher-suite).

أسماء التشفير التي تبدأ بـ `'tls_'` هي لـ TLSv1.3، وجميع الأسماء الأخرى لـ TLSv1.2 والإصدارات الأقدم.

```js [ESM]
console.log(tls.getCiphers()); // ['aes128-gcm-sha256', 'aes128-sha', ...]
```
## `tls.rootCertificates` {#tlsrootcertificates}

**تمت الإضافة في: الإصدار 12.3.0**

- [\<string[]\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

مصفوفة غير قابلة للتغيير من السلاسل النصية تمثل شهادات الجذر (بتنسيق PEM) من متجر Mozilla CA المجمّع كما هو مقدم من إصدار Node.js الحالي.

إن متجر CA المجمّع، كما هو مقدم من Node.js، هو لقطة من متجر Mozilla CA ثابتة في وقت الإصدار. إنه متطابق على جميع الأنظمة الأساسية المدعومة.

## `tls.DEFAULT_ECDH_CURVE` {#tlsdefault_ecdh_curve}


::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v10.0.0 | تم تغيير القيمة الافتراضية إلى `'auto'`. |
| v0.11.13 | تمت الإضافة في: الإصدار 0.11.13 |
:::

اسم المنحنى الافتراضي المستخدم لاتفاقية مفتاح ECDH في خادم tls. القيمة الافتراضية هي `'auto'`. راجع [`tls.createSecureContext()`](/ar/nodejs/api/tls#tlscreatesecurecontextoptions) لمزيد من المعلومات.

## `tls.DEFAULT_MAX_VERSION` {#tlsdefault_max_version}

**تمت الإضافة في: الإصدار 11.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) القيمة الافتراضية للخيار `maxVersion` الخاص بـ [`tls.createSecureContext()`](/ar/nodejs/api/tls#tlscreatesecurecontextoptions). يمكن تعيين أي من إصدارات بروتوكول TLS المدعومة، `'TLSv1.3'` أو `'TLSv1.2'` أو `'TLSv1.1'` أو `'TLSv1'`. **افتراضي:** `'TLSv1.3'`، ما لم يتم تغييره باستخدام خيارات CLI. يؤدي استخدام `--tls-max-v1.2` إلى تعيين الافتراضي إلى `'TLSv1.2'`. يؤدي استخدام `--tls-max-v1.3` إلى تعيين الافتراضي إلى `'TLSv1.3'`. في حالة توفير عدة خيارات، يتم استخدام الحد الأقصى الأعلى.


## `tls.DEFAULT_MIN_VERSION` {#tlsdefault_min_version}

**أُضيف في: الإصدار v11.4.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) القيمة الافتراضية للخيار `minVersion` في [`tls.createSecureContext()`](/ar/nodejs/api/tls#tlscreatesecurecontextoptions). يمكن تعيين أي من إصدارات بروتوكول TLS المدعومة، `'TLSv1.3'` أو `'TLSv1.2'` أو `'TLSv1.1'` أو `'TLSv1'`. قد تتطلب الإصدارات قبل TLSv1.2 تخفيض [مستوى أمان OpenSSL](/ar/nodejs/api/tls#openssl-security-level). **القيمة الافتراضية:** `'TLSv1.2'`، ما لم يتم تغييرها باستخدام خيارات CLI. استخدام `--tls-min-v1.0` يضبط القيمة الافتراضية على `'TLSv1'`. استخدام `--tls-min-v1.1` يضبط القيمة الافتراضية على `'TLSv1.1'`. استخدام `--tls-min-v1.3` يضبط القيمة الافتراضية على `'TLSv1.3'`. في حالة توفير خيارات متعددة، يتم استخدام الحد الأدنى الأقل.

## `tls.DEFAULT_CIPHERS` {#tlsdefault_ciphers}

**أُضيف في: الإصدار v19.8.0، v18.16.0**

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) القيمة الافتراضية للخيار `ciphers` في [`tls.createSecureContext()`](/ar/nodejs/api/tls#tlscreatesecurecontextoptions). يمكن تعيين أي من شفرات OpenSSL المدعومة. القيمة الافتراضية هي محتوى `crypto.constants.defaultCoreCipherList`، ما لم يتم تغييرها باستخدام خيارات CLI باستخدام `--tls-default-ciphers`.

