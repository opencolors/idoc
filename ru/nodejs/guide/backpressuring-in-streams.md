---
title: Понимание откачки в потоках Node.js
description: Узнайте, как реализовать пользовательские потоки Readable и Writable в Node.js, соблюдая откачку для обеспечения эффективного потока данных и избегая распространенных ловушек.
head:
  - - meta
    - name: og:title
      content: Понимание откачки в потоках Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Узнайте, как реализовать пользовательские потоки Readable и Writable в Node.js, соблюдая откачку для обеспечения эффективного потока данных и избегая распространенных ловушек.
  - - meta
    - name: twitter:title
      content: Понимание откачки в потоках Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Узнайте, как реализовать пользовательские потоки Readable и Writable в Node.js, соблюдая откачку для обеспечения эффективного потока данных и избегая распространенных ловушек.
---


# Обратное давление в потоках

Существует общая проблема, возникающая при обработке данных, называемая обратным давлением (backpressure), которая описывает накопление данных за буфером во время передачи данных. Когда принимающая сторона передачи выполняет сложные операции или работает медленнее по какой-либо причине, возникает тенденция к накоплению данных из входящего источника, как засор.

Чтобы решить эту проблему, должна быть создана система делегирования, обеспечивающая плавный поток данных от одного источника к другому. Различные сообщества решали эту проблему уникальным образом для своих программ. Хорошими примерами являются Unix pipes и TCP sockets, которые часто называют управлением потоком (flow control). В Node.js потоки (streams) стали принятым решением.

Цель этого руководства - подробно рассказать, что такое обратное давление и как именно потоки решают эту проблему в исходном коде Node.js. Во второй части руководства будут представлены рекомендуемые передовые методы для обеспечения безопасности и оптимизации кода вашего приложения при реализации потоков.

Мы предполагаем небольшую осведомленность об общем определении `backpressure`, `Buffer` и `EventEmitters` в Node.js, а также некоторый опыт работы с `Stream`. Если вы еще не читали эти документы, неплохо было бы сначала ознакомиться с [документацией API](/ru/nodejs/api/stream), так как это поможет вам расширить понимание при чтении этого руководства.

## Проблема с обработкой данных

В компьютерной системе данные передаются от одного процесса к другому через каналы (pipes), сокеты (sockets) и сигналы (signals). В Node.js мы находим аналогичный механизм под названием `Stream`. Потоки - это здорово! Они так много делают для Node.js, и почти каждая часть внутреннего кода использует этот модуль. Вам, как разработчику, более чем рекомендуется использовать их тоже!

```javascript
const readline = require('node:readline');

const rl = readline.createInterface({
    output: process.stdout,
    input: process.stdin,
});

rl.question('Почему вам следует использовать потоки? ', answer => {
    console.log(`Возможно, это ${answer}, возможно, это потому, что они потрясающие!`);
});

rl.close();
```

Хорошим примером того, почему механизм обратного давления, реализованный через потоки, является отличной оптимизацией, можно продемонстрировать, сравнив внутренние системные инструменты из реализации Stream в Node.js.

В одном сценарии мы возьмем большой файл (примерно -9 ГБ) и сожмем его с помощью знакомого инструмента `zip(1)`.

```bash
zip The.Matrix.1080p.mkv
```

Хотя это займет несколько минут, в другом shell мы можем запустить скрипт, который использует модуль `zlib` из Node.js, который обертывает другой инструмент сжатия, `gzip(1)`.

```javascript
const gzip = require('node:zlib').createGzip();
const fs = require('node:fs');

const inp = fs.createReadStream('The.Matrix.1080p.mkv');
const out = fs.createWriteStream('The.Matrix.1080p.mkv.gz');

inp.pipe(gzip).pipe(out);
```

Чтобы проверить результаты, попробуйте открыть каждый сжатый файл. Файл, сжатый инструментом `zip(1)`, уведомит вас о том, что файл поврежден, тогда как сжатие, завершенное Stream, будет распаковано без ошибок.

::: tip Примечание
В этом примере мы используем `.pipe()`, чтобы получить источник данных с одного конца на другой. Однако обратите внимание, что нет подключенных правильных обработчиков ошибок. Если фрагмент данных не будет получен должным образом, источник Readable или поток `gzip` не будут уничтожены. `pump` — это служебный инструмент, который должным образом уничтожит все потоки в конвейере, если один из них выйдет из строя или закроется, и он просто необходим в этом случае!
:::

`pump` необходим только для Node.js 8.x или более ранних версий, поскольку для Node.js 10.x или более поздних версий был представлен `pipeline` для замены `pump`. Это метод модуля для передачи данных между потоками, пересылки ошибок, надлежащей очистки и предоставления обратного вызова по завершении конвейера.

Вот пример использования конвейера:

```javascript
const { pipeline } = require('node:stream');
const fs = require('node:fs');
const zlib = require('node:zlib');
// Use the pipeline API to easily pipe a series of streams
// together and get notified when the pipeline is fully done.
// A pipeline to gzip a potentially huge video file efficiently:
pipeline(
  fs.createReadStream('The.Matrix.1080p.mkv'),
  zlib.createGzip(),
  fs.createWriteStream('The.Matrix.1080p.mkv.gz'),
  err => {
    if (err) {
      console.error('Конвейер не удался', err);
    } else {
      console.log('Конвейер успешен');
    }
  }
);
```

Вы также можете использовать модуль `stream/promises` для использования конвейера с `async / await`:

```javascript
const { pipeline } = require('node:stream/promises');
const fs = require('node:fs');
const zlib = require('node:zlib');
async function run() {
  try {
    await pipeline(
      fs.createReadStream('The.Matrix.1080p.mkv'),
      zlib.createGzip(),
      fs.createWriteStream('The.Matrix.1080p.mkv.gz')
    );
    console.log('Конвейер успешен');
  } catch (err) {
    console.error('Конвейер не удался', err);
  }
}
```

## Слишком много данных, слишком быстро

Бывают случаи, когда поток `Readable` может отдавать данные в `Writable` слишком быстро - гораздо больше, чем потребитель может обработать!

Когда это происходит, потребитель начинает ставить в очередь все фрагменты данных для последующего использования. Очередь записи становится все длиннее и длиннее, и из-за этого больше данных должно храниться в памяти до завершения всего процесса.

Запись на диск происходит намного медленнее, чем чтение с диска, поэтому, когда мы пытаемся сжать файл и записать его на жесткий диск, возникает противодавление, потому что диск записи не сможет угнаться за скоростью чтения.

```javascript
// Тайно поток говорит: "Ого, ого! Погоди, это слишком много!"
// Данные начнут накапливаться на стороне чтения буфера данных, поскольку
// write' пытается угнаться за входящим потоком данных.
inp.pipe(gzip).pipe(outputFile);
```

Вот почему важен механизм противодавления. Если бы системы противодавления не было, процесс исчерпал бы память вашей системы, фактически замедляя другие процессы и монополизируя большую часть вашей системы до завершения.

Это приводит к нескольким вещам:
- Замедление всех других текущих процессов
- Очень перегруженный сборщик мусора
- Истощение памяти

В следующих примерах мы уберем возвращаемое значение функции `.write()` и изменим его на `true`, что фактически отключит поддержку противодавления в ядре Node.js. В любом упоминании о `'modified'` binary мы говорим о запуске двоичного файла node без строки `return ret;`, а вместо нее с заменой на `return true;`.

## Чрезмерное сопротивление сборке мусора

Давайте взглянем на быстрый бенчмарк. Используя тот же пример, что и выше, мы провели несколько временных испытаний, чтобы получить среднее время для обоих двоичных файлов.

```bash
   trial (#)  | `node` binary (ms) | modified `node` binary (ms)
=================================================================
      1       |      56924         |           55011
      2       |      52686         |           55869
      3       |      59479         |           54043
      4       |      54473         |           55229
      5       |      52933         |           59723
=================================================================
average time: |      55299         |           55975
```

Оба занимают около минуты, так что разницы почти нет, но давайте присмотримся, чтобы убедиться, что наши подозрения верны. Мы используем Linux-инструмент `dtrace`, чтобы оценить, что происходит со сборщиком мусора V8.

Измеренное время GC (сборщика мусора) указывает на интервалы полного цикла одной очистки, выполняемой сборщиком мусора:

```bash
approx. time (ms) | GC (ms) | modified GC (ms)
=================================================
          0       |    0    |      0
          1       |    0    |      0
         40       |    0    |      2
        170       |    3    |      1
        300       |    3    |      1
         *             *           *
         *             *           *
         *             *           *
      39000       |    6    |     26
      42000       |    6    |     21
      47000       |    5    |     32
      50000       |    8    |     28
      54000       |    6    |     35
```

Хотя два процесса начинаются одинаково и, кажется, работают с GC с одинаковой скоростью, становится очевидно, что через несколько секунд с правильно работающей системой противодавления она распределяет нагрузку GC по последовательным интервалам в 4-8 миллисекунд до конца передачи данных.

Однако, когда системы противодавления нет, сбор мусора V8 начинает затягиваться. Обычный двоичный файл вызывает GC примерно 75 раз в минуту, тогда как измененный двоичный файл - только 36 раз.

Это медленный и постепенный долг, накапливающийся из-за растущего использования памяти. По мере передачи данных без системы противодавления для каждого фрагмента передачи используется больше памяти.

Чем больше памяти выделяется, тем больше GC приходится обрабатывать за одну очистку. Чем больше очистка, тем больше GC нужно решить, что можно освободить, и сканирование отсоединенных указателей в большем пространстве памяти будет потреблять больше вычислительной мощности.


## Исчерпание памяти

Чтобы определить потребление памяти каждым бинарным файлом, мы засекали время работы каждого процесса с помощью `/usr/bin/time -lp sudo ./node ./backpressure-example/zlib.js` индивидуально.

Это вывод для обычного бинарного файла:

```bash
Соблюдение возвращаемого значения .write()
=============================================
real        58.88
user        56.79
sys          8.79
  87810048  maximum resident set size
         0  average shared memory size
         0  average unshared data size
         0  average unshared stack size
     19427  page reclaims
      3134  page faults
         0  swaps
         5  block input operations
       194  block output operations
         0  messages sent
         0  messages received
         1  signals received
        12  voluntary context switches
    666037  involuntary context switches
```

Оказывается, максимальный размер в байтах, занимаемый виртуальной памятью, составляет примерно 87,81 МБ.

А теперь изменим возвращаемое значение функции `.write()` и получим:

```bash
Без соблюдения возвращаемого значения .write():
==================================================
real        54.48
user        53.15
sys          7.43
1524965376  maximum resident set size
         0  average shared memory size
         0  average unshared data size
         0  average unshared stack size
    373617  page reclaims
      3139  page faults
         0  swaps
        18  block input operations
       199  block output operations
         0  messages sent
         0  messages received
         1  signals received
        25  voluntary context switches
    629566  involuntary context switches
```

Оказывается, максимальный размер в байтах, занимаемый виртуальной памятью, составляет примерно 1,52 ГБ.

Без потоков для делегирования обратного давления выделяется на порядок больше места в памяти — огромная разница между одним и тем же процессом!

Этот эксперимент показывает, насколько оптимизирован и экономичен механизм обратного давления Node.js для вашей вычислительной системы. Теперь давайте разберемся, как это работает!


## Как Backpressure Решает Эти Проблемы?

Существуют различные функции для передачи данных из одного процесса в другой. В Node.js есть встроенная функция `.pipe()`. Существуют и другие пакеты, которые вы также можете использовать! В конечном счете, на базовом уровне этого процесса у нас есть два отдельных компонента: источник данных и потребитель.

Когда `.pipe()` вызывается из источника, он сигнализирует потребителю о том, что есть данные для передачи. Функция pipe помогает настроить соответствующие замыкания backpressure для триггеров событий.

В Node.js источником является поток `Readable`, а потребителем - поток `Writable` (оба они могут быть заменены потоком Duplex или Transform, но это выходит за рамки данного руководства).

Момент, когда срабатывает backpressure, можно точно определить по возвращаемому значению функции `.write()` потока `Writable`. Это возвращаемое значение, конечно, определяется несколькими условиями.

В любом сценарии, когда буфер данных превысил `highwaterMark` или очередь записи в настоящее время занята, `.write()` `вернет false`.

Когда возвращается значение `false`, срабатывает система backpressure. Она приостановит входящий поток `Readable` от отправки каких-либо данных и будет ждать, пока потребитель снова не будет готов. Как только буфер данных опустеет, будет сгенерировано событие `'drain'` и возобновится входящий поток данных.

Как только очередь будет завершена, backpressure позволит снова отправлять данные. Пространство в памяти, которое использовалось, освободится и подготовится к следующей партии данных.

Это эффективно позволяет использовать фиксированный объем памяти в любой момент времени для функции `.pipe()`. Не будет утечки памяти, не будет бесконечной буферизации, и сборщику мусора придется иметь дело только с одной областью в памяти!

Итак, если backpressure так важна, почему вы (вероятно) о ней не слышали? Ответ прост: Node.js делает все это автоматически для вас.

Это так здорово! Но не так уж и здорово, когда мы пытаемся понять, как реализовать наши собственные потоки.

::: info ПРИМЕЧАНИЕ
В большинстве машин есть размер байтов, который определяет, когда буфер заполнен (который будет варьироваться на разных машинах). Node.js позволяет вам установить свой собственный `highWaterMark`, но обычно по умолчанию установлено значение 16 КБ (16384 или 16 для потоков objectMode). В случаях, когда вы, возможно, захотите поднять это значение, дерзайте, но делайте это с осторожностью!
:::


## Жизненный цикл `.pipe()`

Чтобы лучше понять, что такое противодавление, вот блок-схема жизненного цикла потока `Readable`, который [передается](/ru/nodejs/api/stream) в поток `Writable`:

```bash
                                                     +===================+
                         x-->  Функции конвейеризации +-->   src.pipe(dest)  |
                         x     настраиваются во время  |===================|
                         x     метода .pipe.           |  Обратные вызовы событий  |
  +===============+      x                           |-------------------|
  |   Ваши данные   |      x     Они существуют вне     | .on('close', cb)  |
  +=======+=======+      x     потока данных, но       | .on('data', cb)   |
          |              x     важно прикреплять       | .on('drain', cb)  |
          |              x     события и их             | .on('unpipe', cb) |
+---------v---------+    x     соответствующие обратные | .on('error', cb)  |
|  Readable Stream  +----+                           | .on('finish', cb) |
+-^-------^-------^-+    |                           | .on('end', cb)    |
  ^       |       ^      |                           +-------------------+
  |       |       |      |
  |       ^       |      |
  ^       ^       ^      |    +-------------------+         +=================+
  ^       |       ^      +---->  Writable Stream  +--------->  .write(chunk)  |
  |       |       |           +-------------------+         +=======+=========+
  |       ^       |                                                 |
  |       |       |                              +------------------v---------+
  ^       |       +-> if (!chunk)                |    Этот фрагмент слишком велик?  |
  ^       |       |     emit .end();             |    Очередь занята?      |
  |       |       +-> else                       +-------+----------------+---+
  |       ^       |     emit .write();                   |                |
  |       ^       ^                                   +--v---+        +---v---+
  |       |       ^-----------------------------------<  Нет  |        |  Да  |
  |       |                                           +------+        +---v---+
  |       |                                                               |
  ^       ^               emit .pause();          +=================+     |
  ^-------^----------------^-----------------------+  return false;  <-----+---+
               |                                               +=================+         |
               |                                                                           |
  ^            when queue is empty     +============+                         |
  ^------------^-----------------------<  Буферизация |                         |
               |                       |============|                         |
               +> emit .drain();       |  ^Буфер^  |                         |
               +> emit .resume();      +------------+                         |
                                       |  ^Буфер^  |                         |
                                       +------------+   добавить фрагмент в очередь  |
                                       |            <---^---------------------<
                                       +============+
```

::: tip NOTE
Если вы настраиваете конвейер для последовательного соединения нескольких потоков для манипулирования вашими данными, скорее всего, вы будете реализовывать поток Transform.
:::

В этом случае ваш вывод из потока `Readable` будет поступать в `Transform` и будет передаваться в `Writable`.

```javascript
Readable.pipe(Transformable).pipe(Writable);
```

Противодавление будет применяться автоматически, но обратите внимание, что как входящий, так и исходящий `highwaterMark` потока `Transform` могут изменяться и влиять на систему противодавления.


## Руководство по обратному давлению

Начиная с Node.js v0.10, класс Stream предлагает возможность изменять поведение `.read()` или `.write()` с помощью версий этих функций с подчеркиванием (`._read()` и `._write()` соответственно).

Существуют руководства по реализации Readable потоков и реализации Writable потоков. Предполагается, что вы их прочитали, и следующий раздел будет немного более подробным.

## Правила, которые следует соблюдать при реализации пользовательских потоков

Золотое правило потоков - всегда уважать обратное давление. Лучшая практика - это непротиворечивая практика. Пока вы внимательно избегаете поведения, которое конфликтует с внутренней поддержкой обратного давления, вы можете быть уверены, что следуете хорошей практике.

В общем,

1. Никогда не используйте `.push()`, если вас не просят.
2. Никогда не вызывайте `.write()` после того, как он вернул false, а вместо этого ждите 'drain'.
3. Потоки меняются между разными версиями Node.js и используемой вами библиотекой. Будьте осторожны и тестируйте вещи.

::: tip ПРИМЕЧАНИЕ
Что касается пункта 3, невероятно полезным пакетом для создания потоков браузера является `readable-stream`. Rodd Vagg написал [отличный пост в блоге](https://r.va.gg/2014/06/why-i-dont-use-nodes-core-stream-module.html), описывающий полезность этой библиотеки. Короче говоря, он обеспечивает своего рода автоматическую плавную деградацию для Readable потоков и поддерживает более старые версии браузеров и Node.js.
:::

## Правила, специфичные для Readable потоков

До сих пор мы рассматривали, как `.write()` влияет на обратное давление, и в основном сосредотачивались на Writable потоке. Из-за функциональности Node.js данные технически текут вниз по потоку от Readable к Writable. Однако, как мы можем наблюдать при любой передаче данных, материи или энергии, источник так же важен, как и пункт назначения, и Readable поток жизненно важен для того, как обрабатывается обратное давление.

Оба эти процесса полагаются друг на друга для эффективного взаимодействия. Если Readable игнорирует, когда Writable поток просит его прекратить отправку данных, это может быть так же проблематично, как и в случае, когда возвращаемое значение `.write()` неверно.

Таким образом, помимо уважения возвращаемого значения `.write()`, мы также должны уважать возвращаемое значение `.push()`, используемого в методе `._read()`. Если `.push()` возвращает значение false, поток прекратит чтение из источника. В противном случае он будет продолжаться без паузы.

Вот пример плохой практики использования `.push()`:
```javascript
// Это проблематично, так как оно полностью игнорирует возвращаемое значение из push
// что может быть сигналом обратного давления от целевого потока!
class MyReadable extends Readable {
  _read(size) {
    let chunk;
    while (null == (chunk = getNextChunk())) {
      this.push(chunk);
    }
  }
}
```

Кроме того, за пределами пользовательского потока есть подводные камни, связанные с игнорированием обратного давления. В этом контрпримере хорошей практики код приложения принудительно передает данные, когда они доступны (сигнализируется событием `'data'`):

```javascript
// Это игнорирует механизмы обратного давления, установленные Node.js,
// и безусловно передает данные, независимо от того, готов ли
// целевой поток к ним или нет.
readable.on('data', data => writable.write(data));
```

Вот пример использования `.push()` с Readable потоком.

```javascript
const { Readable } = require('node:stream');

// Создайте пользовательский Readable поток
const myReadableStream = new Readable({
  objectMode: true,
  read(size) {
    // Добавьте немного данных в поток
    this.push({ message: 'Hello, world!' });
    this.push(null); // Отметьте конец потока
  },
});

// Потребляйте поток
myReadableStream.on('data', chunk => {
  console.log(chunk);
});

// Вывод:
// { message: 'Hello, world!' }
```


## Правила, специфичные для записываемых потоков

Напомним, что `.write()` может возвращать true или false в зависимости от определенных условий. К счастью для нас, при создании нашего собственного записываемого потока, конечный автомат потока будет обрабатывать наши обратные вызовы и определять, когда обрабатывать противодавление и оптимизировать поток данных для нас. Однако, когда мы хотим использовать Writable напрямую, мы должны уважать возвращаемое значение `.write()` и уделять пристальное внимание следующим условиям:
- Если очередь записи занята, `.write()` вернет false.
- Если фрагмент данных слишком велик, `.write()` вернет false (предел указывается переменной highWaterMark).

В этом примере мы создаем пользовательский читаемый поток, который помещает один объект в поток с помощью `.push()`. Метод `._read()` вызывается, когда поток готов к потреблению данных, и в этом случае мы немедленно помещаем некоторые данные в поток и отмечаем конец потока, помещая `null`.
```javascript
const stream = require('stream');

class MyReadable extends stream.Readable {
  constructor() {
    super();
  }

  _read() {
    const data = { message: 'Hello, world!' };
    this.push(data);
    this.push(null);
  }
}

const readableStream = new MyReadable();

readableStream.pipe(process.stdout);
```
Затем мы используем поток, прослушивая событие 'data' и записывая в журнал каждый фрагмент данных, который помещается в поток. В этом случае мы помещаем в поток только один фрагмент данных, поэтому мы видим только одно сообщение журнала.

## Правила, специфичные для записываемых потоков

Напомним, что `.write()` может возвращать true или false в зависимости от определенных условий. К счастью для нас, при создании нашего собственного записываемого потока, конечный автомат потока будет обрабатывать наши обратные вызовы и определять, когда обрабатывать противодавление и оптимизировать поток данных для нас.

Однако, когда мы хотим использовать Writable напрямую, мы должны уважать возвращаемое значение `.write()` и уделять пристальное внимание следующим условиям:
- Если очередь записи занята, `.write()` вернет false.
- Если фрагмент данных слишком велик, `.write()` вернет false (предел указывается переменной highWaterMark).

```javascript
class MyWritable extends Writable {
  // This writable is invalid because of the async nature of JavaScript callbacks.
  // Without a return statement for each callback prior to the last,
  // there is a great chance multiple callbacks will be called.
  write(chunk, encoding, callback) {
    if (chunk.toString().indexOf('a') >= 0) callback();
    else if (chunk.toString().indexOf('b') >= 0) callback();
    callback();
  }
}
```

Также есть некоторые вещи, на которые следует обратить внимание при реализации `._writev()`. Функция связана с `.cork()`, но есть распространенная ошибка при написании:

```javascript
// Using .uncork() twice here makes two calls on the C++ layer, rendering the
// cork/uncork technique useless.
ws.cork();
ws.write('hello ');
ws.write('world ');
ws.uncork();

ws.cork();
ws.write('from ');
ws.write('Matteo');
ws.uncork();

// The correct way to write this is to utilize process.nextTick(), which fires
// on the next event loop.
ws.cork();
ws.write('hello ');
ws.write('world ');
process.nextTick(doUncork, ws);

ws.cork();
ws.write('from ');
ws.write('Matteo');
process.nextTick(doUncork, ws);

// As a global function.
function doUncork(stream) {
  stream.uncork();
}
```

`.cork()` можно вызывать сколько угодно раз, нам просто нужно быть осторожными и вызывать `.uncork()` столько же раз, чтобы снова заставить его течь.


## Заключение

Потоки – часто используемый модуль в Node.js. Они важны для внутренней структуры, а для разработчиков – для расширения и соединения в экосистеме модулей Node.js.

Надеемся, теперь вы сможете устранять неполадки и безопасно кодировать свои собственные `Writable` и `Readable` потоки, помня о противодавлении, а также делиться своими знаниями с коллегами и друзьями.

Обязательно изучите подробнее `Stream` для других функций API, чтобы улучшить и раскрыть возможности потоковой передачи при создании приложения с помощью Node.js.

