---
title: Анализ производительности приложений Node.js
description: Узнайте, как использовать встроенный профилировщик Node.js для выявления узких мест в производительности вашего приложения и улучшения его производительности.
head:
  - - meta
    - name: og:title
      content: Анализ производительности приложений Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Узнайте, как использовать встроенный профилировщик Node.js для выявления узких мест в производительности вашего приложения и улучшения его производительности.
  - - meta
    - name: twitter:title
      content: Анализ производительности приложений Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Узнайте, как использовать встроенный профилировщик Node.js для выявления узких мест в производительности вашего приложения и улучшения его производительности.
---


# Профилирование Node.js приложений

Существует множество сторонних инструментов для профилирования Node.js приложений, но во многих случаях самым простым вариантом является использование встроенного профилировщика Node.js. Встроенный профилировщик использует [профилировщик внутри V8](https://v8.dev/docs/profile), который периодически считывает стек во время выполнения программы. Он записывает результаты этих выборок, а также важные события оптимизации, такие как JIT-компиляция, в виде серии тиков:

```bash
code-creation,LazyCompile,0,0x2d5000a337a0,396,"bp native array.js:1153:16",0x289f644df68,~
code-creation,LazyCompile,0,0x2d5000a33940,716,"hasOwnProperty native v8natives.js:198:30",0x289f64438d0,~
code-creation,LazyCompile,0,0x2d5000a33c20,284,"ToName native runtime.js:549:16",0x289f643bb28,~
code-creation,Stub,2,0x2d5000a33d40,182,"DoubleToIStub"
code-creation,Stub,2,0x2d5000a33e00,507,"NumberToStringStub"
```
Раньше вам требовался исходный код V8, чтобы интерпретировать тики. К счастью, с Node.js 4.4.0 были представлены инструменты, которые облегчают использование этой информации без отдельной сборки V8 из исходников. Давайте посмотрим, как встроенный профилировщик может помочь получить представление о производительности приложения.

Чтобы проиллюстрировать использование профилировщика тиков, мы будем работать с простым Express приложением. В нашем приложении будет два обработчика, один для добавления новых пользователей в нашу систему:

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

и другой для проверки попыток аутентификации пользователя:

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

*Обратите внимание, что это НЕ рекомендуемые обработчики для аутентификации пользователей в ваших Node.js приложениях и используются исключительно в иллюстративных целях. Вам не следует пытаться разрабатывать собственные криптографические механизмы аутентификации в целом. Гораздо лучше использовать существующие, проверенные решения для аутентификации.*

Теперь предположим, что мы развернули наше приложение, и пользователи жалуются на высокую задержку запросов. Мы можем легко запустить приложение со встроенным профилировщиком:

```bash
NODE_ENV=production node --prof app.js
```

и нагрузить сервер с помощью `ab` (ApacheBench):

```bash
curl -X GET "http://localhost:8080/newUser?username=matt&password=password"
ab -k -c 20 -n 250 "http://localhost:8080/auth?username=matt&password=password"
```

и получить вывод ab:

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

Из этого вывода мы видим, что нам удается обрабатывать только около 5 запросов в секунду и что средний запрос занимает чуть менее 4 секунд. В реальном примере мы могли бы выполнять большой объем работы во многих функциях от имени запроса пользователя, но даже в нашем простом примере время могло быть потеряно на компиляцию регулярных выражений, генерацию случайных солей, генерацию уникальных хешей из паролей пользователей или внутри самой структуры Express.

Поскольку мы запустили наше приложение с опцией `--prof`, файл тиков был сгенерирован в том же каталоге, что и ваш локальный запуск приложения. Он должен иметь вид `isolate-0xnnnnnnnnnnnn-v8.log` (где n — цифра).

Чтобы разобраться в этом файле, нам нужно использовать процессор тиков, поставляемый вместе с двоичным файлом Node.js. Чтобы запустить процессор, используйте флаг `--prof-process`:

```bash
node --prof-process isolate-0xnnnnnnnnnnnn-v8.log > processed.txt
```

Открытие файла processed.txt в вашем любимом текстовом редакторе предоставит вам несколько различных типов информации. Файл разбит на разделы, которые, в свою очередь, разбиты по языкам. Сначала мы смотрим на раздел summary и видим:

```bash
[Summary]:
   ticks  total  nonlib   name
     79    0.2%    0.2%  JavaScript
  36703   97.2%   99.2%  C++
      7    0.0%    0.0%  GC
    767    2.0%          Shared libraries
    215    0.6%          Unaccounted
```

Это говорит нам о том, что 97% всех собранных выборок произошли в коде C++ и что при просмотре других разделов обработанного вывода мы должны уделять наибольшее внимание работе, выполняемой на C++ (в отличие от JavaScript). Имея это в виду, мы затем находим раздел [C++], который содержит информацию о том, какие функции C++ занимают больше всего времени ЦП, и видим:

```bash
 [C++]:
   ticks  total  nonlib   name
  19557   51.8%   52.9%  node::crypto::PBKDF2(v8::FunctionCallbackInfo<v8::Value> const&)
   4510   11.9%   12.2%  _sha1_block_data_order
   3165    8.4%    8.6%  _malloc_zone_malloc
```

Мы видим, что три верхние записи составляют 72,1% времени ЦП, затраченного программой. Из этого вывода мы сразу видим, что не менее 51,8% времени ЦП занимает функция под названием PBKDF2, которая соответствует нашей генерации хеша из пароля пользователя. Однако может быть не сразу очевидно, как две нижние записи влияют на наше приложение (или если это так, мы будем притворяться обратным ради примера). Чтобы лучше понять взаимосвязь между этими функциями, мы затем посмотрим на раздел [Bottom up (heavy) profile], который предоставляет информацию об основных вызывающих каждой функции. Изучив этот раздел, мы находим:

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

Разбор этого раздела требует немного больше работы, чем необработанные счетчики тиков выше. Внутри каждого из «стеков вызовов» выше процент в столбце parent указывает процент выборок, для которых функция в строке выше была вызвана функцией в текущей строке. Например, в среднем «стеке вызовов» выше для `_sha1_block_data_order` мы видим, что `_sha1_block_data_order` встречался в 11,9% выборок, что мы знали из необработанных счетчиков выше. Однако здесь мы также можем сказать, что он всегда вызывался функцией pbkdf2 внутри модуля crypto Node.js. Мы видим, что аналогично _malloc_zone_malloc вызывался почти исключительно той же функцией pbkdf2. Таким образом, используя информацию в этом представлении, мы можем сказать, что вычисление нашего хеша из пароля пользователя учитывает не только 51,8% из вышеизложенного, но и все время ЦП в трех наиболее часто выбираемых функциях, поскольку вызовы `_sha1_block_data_order` и `_malloc_zone_malloc` были сделаны от имени функции pbkdf2.

На данный момент совершенно ясно, что целевым объектом нашей оптимизации должна быть генерация хеша на основе пароля. К счастью, вы полностью усвоили [преимущества асинхронного программирования](https://nodesource.com/blog/why-asynchronous), и вы понимаете, что работа по генерации хеша из пароля пользователя выполняется синхронно и, следовательно, связывает цикл событий. Это мешает нам работать над другими входящими запросами во время вычисления хеша.

Чтобы исправить эту проблему, вы вносите небольшие изменения в приведенные выше обработчики, чтобы использовать асинхронную версию функции pbkdf2:

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

Новый запуск теста ab выше с асинхронной версией вашего приложения дает:

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

Ура! Ваше приложение теперь обслуживает около 20 запросов в секунду, что примерно в 4 раза больше, чем с синхронной генерацией хеша. Кроме того, средняя задержка снизилась с 4 секунд до чуть более 1 секунды.

Надеюсь, благодаря исследованию производительности этого (хотя и надуманного) примера вы увидели, как процессор тиков V8 может помочь вам лучше понять производительность ваших Node.js приложений.

Вам также может оказаться полезным [как создать flame graph](/ru/nodejs/guide/flame-graphs).

