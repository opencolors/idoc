---
title: Документация Node.js - Ошибки
description: Этот раздел документации Node.js предоставляет подробную информацию об обработке ошибок, включая классы ошибок, коды ошибок и как обрабатывать ошибки в приложениях Node.js.
head:
  - - meta
    - name: og:title
      content: Документация Node.js - Ошибки | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Этот раздел документации Node.js предоставляет подробную информацию об обработке ошибок, включая классы ошибок, коды ошибок и как обрабатывать ошибки в приложениях Node.js.
  - - meta
    - name: twitter:title
      content: Документация Node.js - Ошибки | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Этот раздел документации Node.js предоставляет подробную информацию об обработке ошибок, включая классы ошибок, коды ошибок и как обрабатывать ошибки в приложениях Node.js.
---


# Ошибки {#errors}

Приложения, работающие в Node.js, обычно сталкиваются с четырьмя категориями ошибок:

- Стандартные ошибки JavaScript, такие как [\<EvalError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/EvalError), [\<SyntaxError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SyntaxError), [\<RangeError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError), [\<ReferenceError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ReferenceError), [\<TypeError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError) и [\<URIError\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/URIError).
- Системные ошибки, вызванные ограничениями операционной системы, такими как попытка открыть несуществующий файл или попытка отправить данные через закрытый сокет.
- Ошибки, указанные пользователем, вызванные кодом приложения.
- `AssertionError` — это особый класс ошибок, которые могут быть вызваны, когда Node.js обнаруживает исключительное нарушение логики, которое никогда не должно происходить. Обычно они вызываются модулем `node:assert`.

Все ошибки JavaScript и системные ошибки, возникающие в Node.js, наследуются от стандартного класса JavaScript [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) или являются его экземплярами, и гарантированно предоставляют *как минимум* свойства, доступные в этом классе.

## Распространение и перехват ошибок {#error-propagation-and-interception}

Node.js поддерживает несколько механизмов для распространения и обработки ошибок, возникающих во время работы приложения. То, как эти ошибки сообщаются и обрабатываются, полностью зависит от типа `Error` и стиля вызываемого API.

Все ошибки JavaScript обрабатываются как исключения, которые *немедленно* генерируют и вызывают ошибку с использованием стандартного механизма JavaScript `throw`. Они обрабатываются с помощью конструкции [`try…catch`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch), предоставляемой языком JavaScript.

```js [ESM]
// Выбрасывает ReferenceError, потому что z не определена.
try {
  const m = 1;
  const n = m + z;
} catch (err) {
  // Обработайте ошибку здесь.
}
```
Любое использование механизма JavaScript `throw` вызовет исключение, которое *должно* быть обработано, иначе процесс Node.js немедленно завершится.

За редким исключением, *синхронные* API (любой блокирующий метод, который не возвращает [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) и не принимает функцию `callback`, например, [`fs.readFileSync`](/ru/nodejs/api/fs#fsreadfilesyncpath-options)), будут использовать `throw` для сообщения об ошибках.

Ошибки, возникающие в *асинхронных API*, могут сообщаться несколькими способами:

-  Некоторые асинхронные методы возвращают [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), вы всегда должны учитывать, что он может быть отклонен. См. флаг [`--unhandled-rejections`](/ru/nodejs/api/cli#--unhandled-rejectionsmode) о том, как процесс будет реагировать на необработанное отклонение промиса.   
-  Большинство асинхронных методов, принимающих функцию `callback`, принимают объект `Error`, передаваемый в качестве первого аргумента этой функции. Если этот первый аргумент не равен `null` и является экземпляром `Error`, то произошла ошибка, которую следует обработать.   
-  Когда асинхронный метод вызывается для объекта, который является [`EventEmitter`](/ru/nodejs/api/events#class-eventemitter), ошибки могут быть направлены на событие `'error'` этого объекта.  
-  Некоторые, обычно асинхронные, методы в API Node.js все еще могут использовать механизм `throw` для вызова исключений, которые необходимо обрабатывать с помощью `try…catch`. Не существует исчерпывающего списка таких методов; пожалуйста, обратитесь к документации каждого метода, чтобы определить требуемый механизм обработки ошибок.

Использование механизма события `'error'` наиболее распространено для [API, основанных на потоках](/ru/nodejs/api/stream) и [на основе излучателей событий](/ru/nodejs/api/events#class-eventemitter), которые сами по себе представляют собой серию асинхронных операций во времени (в отличие от одной операции, которая может пройти успешно или завершиться неудачей).

Для *всех* объектов [`EventEmitter`](/ru/nodejs/api/events#class-eventemitter), если не предоставлен обработчик события `'error'`, ошибка будет выдана, в результате чего процесс Node.js сообщит о необработанном исключении и завершит работу, если только: не был зарегистрирован обработчик для события [`'uncaughtException'`](/ru/nodejs/api/process#event-uncaughtexception) или не используется устаревший модуль [`node:domain`](/ru/nodejs/api/domain).

```js [ESM]
const EventEmitter = require('node:events');
const ee = new EventEmitter();

setImmediate(() => {
  // Это приведет к сбою процесса, поскольку событие 'error' не имеет
  // обработчик был добавлен.
  ee.emit('error', new Error('Это приведет к сбою'));
});
```
Ошибки, сгенерированные таким образом, *не могут* быть перехвачены с помощью `try…catch`, поскольку они выбрасываются *после* того, как вызывающий код уже завершился.

Разработчики должны обратиться к документации для каждого метода, чтобы определить, как именно распространяются ошибки, вызванные этими методами.


## Класс: `Error` {#class-error}

Общий объект JavaScript [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error), который не обозначает каких-либо конкретных обстоятельств, объясняющих причину возникновения ошибки. Объекты `Error` захватывают "трассировку стека", детализирующую точку в коде, в которой был создан `Error`, и могут предоставлять текстовое описание ошибки.

Все ошибки, сгенерированные Node.js, включая все системные ошибки и ошибки JavaScript, будут либо экземплярами класса `Error`, либо наследоваться от него.

### `new Error(message[, options])` {#new-errormessage-options}

- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `cause` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Ошибка, вызвавшая вновь созданную ошибку.

Создает новый объект `Error` и устанавливает свойство `error.message` в предоставленное текстовое сообщение. Если в качестве `message` передается объект, текстовое сообщение генерируется путем вызова `String(message)`. Если предоставлена опция `cause`, она присваивается свойству `error.cause`. Свойство `error.stack` будет представлять точку в коде, в которой был вызван `new Error()`. Трассировки стека зависят от [API трассировки стека V8](https://v8.dev/docs/stack-trace-api). Трассировки стека простираются только до (a) начала *синхронного выполнения кода* или (b) количества фреймов, заданного свойством `Error.stackTraceLimit`, в зависимости от того, что меньше.

### `Error.captureStackTrace(targetObject[, constructorOpt])` {#errorcapturestacktracetargetobject-constructoropt}

- `targetObject` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- `constructorOpt` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

Создает свойство `.stack` на `targetObject`, которое при доступе возвращает строку, представляющую местоположение в коде, в котором был вызван `Error.captureStackTrace()`.

```js [ESM]
const myObject = {};
Error.captureStackTrace(myObject);
myObject.stack;  // Аналогично `new Error().stack`
```
Первая строка трассировки будет начинаться с `${myObject.name}: ${myObject.message}`.

Необязательный аргумент `constructorOpt` принимает функцию. Если он указан, все фреймы выше `constructorOpt`, включая `constructorOpt`, будут опущены из сгенерированной трассировки стека.

Аргумент `constructorOpt` полезен для скрытия деталей реализации генерации ошибок от пользователя. Например:

```js [ESM]
function a() {
  b();
}

function b() {
  c();
}

function c() {
  // Создать ошибку без трассировки стека, чтобы избежать повторного вычисления трассировки стека.
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  const error = new Error();
  Error.stackTraceLimit = stackTraceLimit;

  // Захватить трассировку стека выше функции b
  Error.captureStackTrace(error, b); // Ни функция c, ни b не включены в трассировку стека
  throw error;
}

a();
```

### `Error.stackTraceLimit` {#errorstacktracelimit}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Свойство `Error.stackTraceLimit` определяет количество фреймов стека, собранных трассировкой стека (будь то сгенерировано `new Error().stack` или `Error.captureStackTrace(obj)`).

Значение по умолчанию равно `10`, но может быть установлено в любое допустимое число JavaScript. Изменения повлияют на любую трассировку стека, захваченную *после* изменения значения.

Если установлено значение, не являющееся числом, или установлено отрицательное число, трассировки стека не будут захватывать никакие фреймы.

### `error.cause` {#errorcause}

**Добавлено в: v16.9.0**

- [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types)

Если присутствует, свойство `error.cause` является основной причиной `Error`. Оно используется при перехвате ошибки и создании новой с другим сообщением или кодом, чтобы все еще иметь доступ к исходной ошибке.

Свойство `error.cause` обычно устанавливается вызовом `new Error(message, { cause })`. Оно не устанавливается конструктором, если параметр `cause` не предоставлен.

Это свойство позволяет объединять ошибки в цепочку. При сериализации объектов `Error`, [`util.inspect()`](/ru/nodejs/api/util#utilinspectobject-options) рекурсивно сериализует `error.cause`, если оно установлено.

```js [ESM]
const cause = new Error('Удаленный HTTP-сервер ответил статусом 500');
const symptom = new Error('Не удалось отправить сообщение', { cause });

console.log(symptom);
// Печатает:
//   Error: Не удалось отправить сообщение
//       at REPL2:1:17
//       at Script.runInThisContext (node:vm:130:12)
//       ... 7 lines matching cause stack trace ...
//       at [_line] [as _line] (node:internal/readline/interface:886:18) {
//     [cause]: Error: Удаленный HTTP-сервер ответил статусом 500
//         at REPL1:1:15
//         at Script.runInThisContext (node:vm:130:12)
//         at REPLServer.defaultEval (node:repl:574:29)
//         at bound (node:domain:426:15)
//         at REPLServer.runBound [as eval] (node:domain:437:12)
//         at REPLServer.onLine (node:repl:902:10)
//         at REPLServer.emit (node:events:549:35)
//         at REPLServer.emit (node:domain:482:12)
//         at [_onLine] [as _onLine] (node:internal/readline/interface:425:12)
//         at [_line] [as _line] (node:internal/readline/interface:886:18)
```

### `error.code` {#errorcode}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Свойство `error.code` является строковой меткой, идентифицирующей тип ошибки. `error.code` является наиболее стабильным способом идентификации ошибки. Оно будет изменяться только между основными версиями Node.js. В отличие от этого, строки `error.message` могут меняться между любыми версиями Node.js. Подробности о конкретных кодах см. в разделе [Коды ошибок Node.js](/ru/nodejs/api/errors#nodejs-error-codes).

### `error.message` {#errormessage}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Свойство `error.message` — это строковое описание ошибки, заданное при вызове `new Error(message)`. `message`, переданное конструктору, также появится в первой строке трассировки стека `Error`, однако изменение этого свойства после создания объекта `Error` *может не* изменить первую строку трассировки стека (например, когда `error.stack` считывается до изменения этого свойства).

```js [ESM]
const err = new Error('The message');
console.error(err.message);
// Prints: The message
```
### `error.stack` {#errorstack}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Свойство `error.stack` — это строка, описывающая точку в коде, в которой был создан экземпляр `Error`.

```bash [BASH]
Error: Things keep happening!
   at /home/gbusey/file.js:525:2
   at Frobnicator.refrobulate (/home/gbusey/business-logic.js:424:21)
   at Actor.<anonymous> (/home/gbusey/actors.js:400:8)
   at increaseSynergy (/home/gbusey/actors.js:701:6)
```
Первая строка отформатирована как `\<имя класса ошибки\>: \<сообщение об ошибке\>`, за которой следует серия кадров стека (каждая строка начинается с "at "). Каждый кадр описывает место вызова в коде, которое привело к возникновению ошибки. V8 пытается отобразить имя для каждой функции (по имени переменной, имени функции или имени метода объекта), но иногда не может найти подходящее имя. Если V8 не может определить имя для функции, для этого кадра будет отображаться только информация о местоположении. В противном случае определенное имя функции будет отображаться с информацией о местоположении, добавленной в скобках.

Кадры генерируются только для функций JavaScript. Если, например, выполнение синхронно проходит через функцию C++-аддона с именем `cheetahify`, которая сама вызывает функцию JavaScript, кадр, представляющий вызов `cheetahify`, не будет присутствовать в трассировке стека:

```js [ESM]
const cheetahify = require('./native-binding.node');

function makeFaster() {
  // `cheetahify()` *synchronously* calls speedy.
  cheetahify(function speedy() {
    throw new Error('oh no!');
  });
}

makeFaster();
// will throw:
//   /home/gbusey/file.js:6
//       throw new Error('oh no!');
//           ^
//   Error: oh no!
//       at speedy (/home/gbusey/file.js:6:11)
//       at makeFaster (/home/gbusey/file.js:5:3)
//       at Object.<anonymous> (/home/gbusey/file.js:10:1)
//       at Module._compile (module.js:456:26)
//       at Object.Module._extensions..js (module.js:474:10)
//       at Module.load (module.js:356:32)
//       at Function.Module._load (module.js:312:12)
//       at Function.Module.runMain (module.js:497:10)
//       at startup (node.js:119:16)
//       at node.js:906:3
```
Информация о местоположении будет одной из следующих:

- `native`, если кадр представляет вызов, внутренний для V8 (как в `[].forEach`).
- `plain-filename.js:line:column`, если кадр представляет вызов, внутренний для Node.js.
- `/absolute/path/to/file.js:line:column`, если кадр представляет вызов в пользовательской программе (использующей систему модулей CommonJS) или ее зависимостях.
- `\<transport-protocol\>:///url/to/module/file.mjs:line:column`, если кадр представляет вызов в пользовательской программе (использующей систему модулей ES) или ее зависимостях.

Строка, представляющая трассировку стека, генерируется лениво при **доступе** к свойству `error.stack`.

Количество кадров, захваченных трассировкой стека, ограничено меньшим из `Error.stackTraceLimit` или количеством доступных кадров в текущем тике цикла событий.


## Класс: `AssertionError` {#class-assertionerror}

- Расширяет: [\<errors.Error\>](/ru/nodejs/api/errors#class-error)

Указывает на сбой утверждения. Для получения дополнительной информации см. [`Класс: assert.AssertionError`](/ru/nodejs/api/assert#class-assertassertionerror).

## Класс: `RangeError` {#class-rangeerror}

- Расширяет: [\<errors.Error\>](/ru/nodejs/api/errors#class-error)

Указывает, что предоставленный аргумент не входит в набор или диапазон допустимых значений для функции; будь то числовой диапазон или за пределами набора параметров для заданного параметра функции.

```js [ESM]
require('node:net').connect(-1);
// Выбрасывает "RangeError: "port" option should be >= 0 and < 65536: -1"
```
Node.js будет генерировать и выбрасывать экземпляры `RangeError` *немедленно* в качестве формы проверки аргументов.

## Класс: `ReferenceError` {#class-referenceerror}

- Расширяет: [\<errors.Error\>](/ru/nodejs/api/errors#class-error)

Указывает, что предпринимается попытка получить доступ к переменной, которая не определена. Такие ошибки обычно указывают на опечатки в коде или иным образом сломанную программу.

Хотя клиентский код может генерировать и распространять эти ошибки, на практике это делает только V8.

```js [ESM]
doesNotExist;
// Выбрасывает ReferenceError, doesNotExist не является переменной в этой программе.
```
Если приложение не генерирует и не запускает код динамически, экземпляры `ReferenceError` указывают на ошибку в коде или его зависимостях.

## Класс: `SyntaxError` {#class-syntaxerror}

- Расширяет: [\<errors.Error\>](/ru/nodejs/api/errors#class-error)

Указывает, что программа не является допустимым JavaScript. Эти ошибки могут быть сгенерированы и распространены только в результате оценки кода. Оценка кода может происходить в результате `eval`, `Function`, `require` или [vm](/ru/nodejs/api/vm). Эти ошибки почти всегда свидетельствуют о неисправной программе.

```js [ESM]
try {
  require('node:vm').runInThisContext('binary ! isNotOk');
} catch (err) {
  // 'err' будет SyntaxError.
}
```
Экземпляры `SyntaxError` невосстановимы в контексте, который их создал – их могут перехватить только другие контексты.

## Класс: `SystemError` {#class-systemerror}

- Расширяет: [\<errors.Error\>](/ru/nodejs/api/errors#class-error)

Node.js генерирует системные ошибки, когда в среде выполнения возникают исключения. Обычно это происходит, когда приложение нарушает ограничение операционной системы. Например, системная ошибка произойдет, если приложение попытается прочитать файл, который не существует.

- `address` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Если присутствует, адрес, к которому не удалось сетевое подключение
- `code` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Строковый код ошибки
- `dest` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Если присутствует, путь к файлу назначения при сообщении об ошибке файловой системы
- `errno` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Предоставленный системой номер ошибки
- `info` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Если присутствует, дополнительные сведения об условии ошибки
- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Предоставленное системой удобочитаемое описание ошибки
- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Если присутствует, путь к файлу при сообщении об ошибке файловой системы
- `port` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Если присутствует, порт сетевого подключения, который недоступен
- `syscall` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Имя системного вызова, вызвавшего ошибку


### `error.address` {#erroraddress}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Если присутствует, `error.address` является строкой, описывающей адрес, к которому не удалось установить сетевое соединение.

### `error.code` {#errorcode_1}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Свойство `error.code` является строкой, представляющей код ошибки.

### `error.dest` {#errordest}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Если присутствует, `error.dest` — это путь к файлу назначения при сообщении об ошибке файловой системы.

### `error.errno` {#errorerrno}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Свойство `error.errno` является отрицательным числом, которое соответствует коду ошибки, определенному в [`Обработка ошибок libuv`](https://docs.libuv.org/en/v1.x/errors).

В Windows номер ошибки, предоставленный системой, будет нормализован libuv.

Чтобы получить строковое представление кода ошибки, используйте [`util.getSystemErrorName(error.errno)`](/ru/nodejs/api/util#utilgetsystemerrornameerr).

### `error.info` {#errorinfo}

- [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

Если присутствует, `error.info` — это объект с подробной информацией об условиях ошибки.

### `error.message` {#errormessage_1}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

`error.message` — это предоставляемое системой удобочитаемое описание ошибки.

### `error.path` {#errorpath}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Если присутствует, `error.path` является строкой, содержащей соответствующий недействительный путь.

### `error.port` {#errorport}

- [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Если присутствует, `error.port` является портом сетевого соединения, который недоступен.

### `error.syscall` {#errorsyscall}

- [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

Свойство `error.syscall` является строкой, описывающей [системный вызов](https://man7.org/linux/man-pages/man2/syscalls.2), который не удался.


### Типичные системные ошибки {#common-system-errors}

Это список системных ошибок, которые часто встречаются при написании программы Node.js. Для получения полного списка смотрите [`errno`(3) man page](https://man7.org/linux/man-pages/man3/errno.3).

- `EACCES` (Отказано в доступе): Была предпринята попытка доступа к файлу способом, запрещенным его правами доступа к файлам.
- `EADDRINUSE` (Адрес уже используется): Попытка привязать сервер ([`net`](/ru/nodejs/api/net), [`http`](/ru/nodejs/api/http) или [`https`](/ru/nodejs/api/https)) к локальному адресу не удалась из-за того, что другой сервер в локальной системе уже занимает этот адрес.
- `ECONNREFUSED` (Соединение отклонено): Не удалось установить соединение, потому что целевой компьютер активно отказал в этом. Обычно это происходит при попытке подключиться к службе, которая неактивна на удаленном хосте.
- `ECONNRESET` (Соединение сброшено пиром): Соединение было принудительно закрыто пиром. Обычно это происходит из-за потери соединения на удаленном сокете из-за тайм-аута или перезагрузки. Часто встречается в модулях [`http`](/ru/nodejs/api/http) и [`net`](/ru/nodejs/api/net).
- `EEXIST` (Файл существует): Существующий файл был целью операции, которая требовала, чтобы цель не существовала.
- `EISDIR` (Является каталогом): Операция ожидала файл, но заданный путь был каталогом.
- `EMFILE` (Слишком много открытых файлов в системе): Достигнуто максимальное количество [дескрипторов файлов](https://en.wikipedia.org/wiki/File_descriptor), допустимое в системе, и запросы на другой дескриптор не могут быть выполнены до тех пор, пока хотя бы один не будет закрыт. Это происходит при одновременном открытии большого количества файлов параллельно, особенно в системах (в частности, macOS), где для процессов существует низкий предел дескрипторов файлов. Чтобы исправить низкий предел, запустите `ulimit -n 2048` в той же оболочке, в которой будет выполняться процесс Node.js.
- `ENOENT` (Нет такого файла или каталога): Обычно вызывается операциями [`fs`](/ru/nodejs/api/fs), чтобы указать, что компонент указанного пути не существует. Ни один объект (файл или каталог) не может быть найден по заданному пути.
- `ENOTDIR` (Не является каталогом): Компонент заданного пути существовал, но не был каталогом, как ожидалось. Обычно вызывается [`fs.readdir`](/ru/nodejs/api/fs#fsreaddirpath-options-callback).
- `ENOTEMPTY` (Каталог не пуст): Каталог с записями был целью операции, требующей пустой каталог, обычно [`fs.unlink`](/ru/nodejs/api/fs#fsunlinkpath-callback).
- `ENOTFOUND` (Сбой поиска DNS): Указывает на сбой DNS либо `EAI_NODATA`, либо `EAI_NONAME`. Это не стандартная ошибка POSIX.
- `EPERM` (Операция не разрешена): Была предпринята попытка выполнить операцию, требующую повышенных привилегий.
- `EPIPE` (Разорванная труба): Запись в трубу, сокет или FIFO, для которых нет процесса для чтения данных. Часто встречается на уровнях [`net`](/ru/nodejs/api/net) и [`http`](/ru/nodejs/api/http), что указывает на то, что удаленная сторона потока, в который выполняется запись, была закрыта.
- `ETIMEDOUT` (Время ожидания операции истекло): Запрос на подключение или отправку не удался, поскольку подключенная сторона не ответила должным образом по истечении периода времени. Обычно встречается в [`http`](/ru/nodejs/api/http) или [`net`](/ru/nodejs/api/net). Часто является признаком того, что `socket.end()` не был вызван должным образом.


## Класс: `TypeError` {#class-typeerror}

- Наследует [\<errors.Error\>](/ru/nodejs/api/errors#class-error)

Указывает на то, что предоставленный аргумент имеет недопустимый тип. Например, передача функции параметру, который ожидает строку, приведет к ошибке `TypeError`.

```js [ESM]
require('node:url').parse(() => { });
// Выбрасывает TypeError, так как ожидалась строка.
```
Node.js генерирует и выбрасывает экземпляры `TypeError` *немедленно* в качестве формы проверки аргументов.

## Исключения и ошибки {#exceptions-vs-errors}

Исключение JavaScript — это значение, которое выбрасывается в результате недопустимой операции или как цель оператора `throw`. Хотя и не требуется, чтобы эти значения были экземплярами `Error` или классов, наследующих от `Error`, все исключения, выбрасываемые Node.js или средой выполнения JavaScript, *будут* экземплярами `Error`.

Некоторые исключения являются *невосстановимыми* на уровне JavaScript. Такие исключения *всегда* приводят к сбою процесса Node.js. Примеры включают проверки `assert()` или вызовы `abort()` на уровне C++.

## Ошибки OpenSSL {#openssl-errors}

Ошибки, возникающие в `crypto` или `tls`, имеют класс `Error` и, помимо стандартных свойств `.code` и `.message`, могут иметь некоторые дополнительные свойства, специфичные для OpenSSL.

### `error.opensslErrorStack` {#erroropensslerrorstack}

Массив ошибок, которые могут дать контекст тому, откуда в библиотеке OpenSSL исходит ошибка.

### `error.function` {#errorfunction}

Функция OpenSSL, в которой возникла ошибка.

### `error.library` {#errorlibrary}

Библиотека OpenSSL, в которой возникла ошибка.

### `error.reason` {#errorreason}

Человекочитаемая строка, описывающая причину ошибки.

## Коды ошибок Node.js {#nodejs-error-codes}

### `ABORT_ERR` {#abort_err}

**Добавлено в: v15.0.0**

Используется, когда операция была прервана (обычно с использованием `AbortController`).

API, *не* использующие `AbortSignal`, обычно не вызывают ошибку с этим кодом.

Этот код не использует обычное соглашение `ERR_*`, используемое ошибками Node.js, чтобы быть совместимым с `AbortError` веб-платформы.

### `ERR_ACCESS_DENIED` {#err_access_denied}

Специальный тип ошибки, который срабатывает всякий раз, когда Node.js пытается получить доступ к ресурсу, ограниченному [Моделью разрешений](/ru/nodejs/api/permissions#permission-model).


### `ERR_AMBIGUOUS_ARGUMENT` {#err_ambiguous_argument}

Аргумент функции используется таким образом, который предполагает, что сигнатура функции может быть неверно понята. Это исключение генерируется модулем `node:assert`, когда параметр `message` в `assert.throws(block, message)` соответствует сообщению об ошибке, сгенерированному `block`, поскольку такое использование предполагает, что пользователь считает `message` ожидаемым сообщением, а не сообщением, которое `AssertionError` будет отображать, если `block` не генерирует исключение.

### `ERR_ARG_NOT_ITERABLE` {#err_arg_not_iterable}

Требовался итерируемый аргумент (т.е. значение, которое работает с циклами `for...of`), но он не был предоставлен в API Node.js.

### `ERR_ASSERTION` {#err_assertion}

Особый тип ошибки, который может быть вызван всякий раз, когда Node.js обнаруживает исключительное нарушение логики, которое никогда не должно происходить. Обычно они вызываются модулем `node:assert`.

### `ERR_ASYNC_CALLBACK` {#err_async_callback}

Была предпринята попытка зарегистрировать что-то, что не является функцией, в качестве обратного вызова `AsyncHooks`.

### `ERR_ASYNC_TYPE` {#err_async_type}

Тип асинхронного ресурса был недействительным. Пользователи также могут определять свои собственные типы при использовании общедоступного API внедрения.

### `ERR_BROTLI_COMPRESSION_FAILED` {#err_brotli_compression_failed}

Данные, переданные в поток Brotli, не были успешно сжаты.

### `ERR_BROTLI_INVALID_PARAM` {#err_brotli_invalid_param}

При создании потока Brotli был передан недопустимый ключ параметра.

### `ERR_BUFFER_CONTEXT_NOT_AVAILABLE` {#err_buffer_context_not_available}

Была предпринята попытка создать экземпляр Node.js `Buffer` из кода дополнения или внедрения, находясь в контексте движка JS, который не связан с экземпляром Node.js. Данные, переданные в метод `Buffer`, будут освобождены к моменту возврата метода.

При возникновении этой ошибки возможной альтернативой созданию экземпляра `Buffer` является создание обычного `Uint8Array`, который отличается только прототипом результирующего объекта. `Uint8Array` обычно принимаются во всех основных API Node.js, где используются `Buffer`; они доступны во всех контекстах.

### `ERR_BUFFER_OUT_OF_BOUNDS` {#err_buffer_out_of_bounds}

Была предпринята попытка выполнить операцию за пределами `Buffer`.

### `ERR_BUFFER_TOO_LARGE` {#err_buffer_too_large}

Была предпринята попытка создать `Buffer` больше максимально допустимого размера.


### `ERR_CANNOT_WATCH_SIGINT` {#err_cannot_watch_sigint}

Node.js не смог отследить сигнал `SIGINT`.

### `ERR_CHILD_CLOSED_BEFORE_REPLY` {#err_child_closed_before_reply}

Дочерний процесс был закрыт до того, как родитель получил ответ.

### `ERR_CHILD_PROCESS_IPC_REQUIRED` {#err_child_process_ipc_required}

Используется, когда дочерний процесс запускается без указания канала IPC.

### `ERR_CHILD_PROCESS_STDIO_MAXBUFFER` {#err_child_process_stdio_maxbuffer}

Используется, когда основной процесс пытается прочитать данные из STDERR/STDOUT дочернего процесса, и длина данных превышает параметр `maxBuffer`.

### `ERR_CLOSED_MESSAGE_PORT` {#err_closed_message_port}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v16.2.0, v14.17.1 | Сообщение об ошибке было повторно введено. |
| v11.12.0 | Сообщение об ошибке было удалено. |
| v10.5.0 | Добавлено в: v10.5.0 |
:::

Была предпринята попытка использовать экземпляр `MessagePort` в закрытом состоянии, обычно после вызова `.close()`.

### `ERR_CONSOLE_WRITABLE_STREAM` {#err_console_writable_stream}

`Console` был создан без потока `stdout`, или `Console` имеет не перезаписываемый поток `stdout` или `stderr`.

### `ERR_CONSTRUCT_CALL_INVALID` {#err_construct_call_invalid}

**Добавлено в: v12.5.0**

Был вызван конструктор класса, который не является вызываемым.

### `ERR_CONSTRUCT_CALL_REQUIRED` {#err_construct_call_required}

Конструктор класса был вызван без `new`.

### `ERR_CONTEXT_NOT_INITIALIZED` {#err_context_not_initialized}

Vm контекст, переданный в API, еще не инициализирован. Это может произойти, когда во время создания контекста происходит (и перехватывается) ошибка, например, когда не удается выделить память или когда при создании контекста достигается максимальный размер стека вызовов.

### `ERR_CRYPTO_CUSTOM_ENGINE_NOT_SUPPORTED` {#err_crypto_custom_engine_not_supported}

Был запрошен движок OpenSSL (например, через параметры TLS `clientCertEngine` или `privateKeyEngine`), который не поддерживается используемой версией OpenSSL, вероятно, из-за флага времени компиляции `OPENSSL_NO_ENGINE`.

### `ERR_CRYPTO_ECDH_INVALID_FORMAT` {#err_crypto_ecdh_invalid_format}

Недопустимое значение для аргумента `format` было передано методу `getPublicKey()` класса `crypto.ECDH()`.

### `ERR_CRYPTO_ECDH_INVALID_PUBLIC_KEY` {#err_crypto_ecdh_invalid_public_key}

Недопустимое значение для аргумента `key` было передано методу `computeSecret()` класса `crypto.ECDH()`. Это означает, что открытый ключ лежит за пределами эллиптической кривой.


### `ERR_CRYPTO_ENGINE_UNKNOWN` {#err_crypto_engine_unknown}

Недопустимый идентификатор криптографического движка был передан в [`require('node:crypto').setEngine()`](/ru/nodejs/api/crypto#cryptosetengineengine-flags).

### `ERR_CRYPTO_FIPS_FORCED` {#err_crypto_fips_forced}

Использовался аргумент командной строки [`--force-fips`](/ru/nodejs/api/cli#--force-fips), но была предпринята попытка включить или отключить режим FIPS в модуле `node:crypto`.

### `ERR_CRYPTO_FIPS_UNAVAILABLE` {#err_crypto_fips_unavailable}

Была предпринята попытка включить или отключить режим FIPS, но режим FIPS недоступен.

### `ERR_CRYPTO_HASH_FINALIZED` {#err_crypto_hash_finalized}

[`hash.digest()`](/ru/nodejs/api/crypto#hashdigestencoding) был вызван несколько раз. Метод `hash.digest()` должен вызываться не более одного раза для каждого экземпляра объекта `Hash`.

### `ERR_CRYPTO_HASH_UPDATE_FAILED` {#err_crypto_hash_update_failed}

[`hash.update()`](/ru/nodejs/api/crypto#hashupdatedata-inputencoding) не удалось по какой-либо причине. Это должно происходить редко, если вообще когда-либо произойдет.

### `ERR_CRYPTO_INCOMPATIBLE_KEY` {#err_crypto_incompatible_key}

Данные криптографические ключи несовместимы с предпринятой операцией.

### `ERR_CRYPTO_INCOMPATIBLE_KEY_OPTIONS` {#err_crypto_incompatible_key_options}

Выбранная кодировка открытого или закрытого ключа несовместима с другими параметрами.

### `ERR_CRYPTO_INITIALIZATION_FAILED` {#err_crypto_initialization_failed}

**Добавлено в: v15.0.0**

Не удалось инициализировать криптографическую подсистему.

### `ERR_CRYPTO_INVALID_AUTH_TAG` {#err_crypto_invalid_auth_tag}

**Добавлено в: v15.0.0**

Предоставлен недопустимый тег аутентификации.

### `ERR_CRYPTO_INVALID_COUNTER` {#err_crypto_invalid_counter}

**Добавлено в: v15.0.0**

Предоставлен недопустимый счетчик для шифра в режиме счетчика.

### `ERR_CRYPTO_INVALID_CURVE` {#err_crypto_invalid_curve}

**Добавлено в: v15.0.0**

Предоставлена недопустимая эллиптическая кривая.

### `ERR_CRYPTO_INVALID_DIGEST` {#err_crypto_invalid_digest}

Указан недопустимый [алгоритм криптографического дайджеста](/ru/nodejs/api/crypto#cryptogethashes).

### `ERR_CRYPTO_INVALID_IV` {#err_crypto_invalid_iv}

**Добавлено в: v15.0.0**

Предоставлен недопустимый вектор инициализации.

### `ERR_CRYPTO_INVALID_JWK` {#err_crypto_invalid_jwk}

**Добавлено в: v15.0.0**

Предоставлен недопустимый JSON Web Key.

### `ERR_CRYPTO_INVALID_KEYLEN` {#err_crypto_invalid_keylen}

**Добавлено в: v15.0.0**

Предоставлена недопустимая длина ключа.

### `ERR_CRYPTO_INVALID_KEYPAIR` {#err_crypto_invalid_keypair}

**Добавлено в: v15.0.0**

Предоставлена недопустимая пара ключей.

### `ERR_CRYPTO_INVALID_KEYTYPE` {#err_crypto_invalid_keytype}

**Добавлено в: v15.0.0**

Предоставлен недопустимый тип ключа.


### `ERR_CRYPTO_INVALID_KEY_OBJECT_TYPE` {#err_crypto_invalid_key_object_type}

Тип заданного криптографического объекта ключа недействителен для предпринятой операции.

### `ERR_CRYPTO_INVALID_MESSAGELEN` {#err_crypto_invalid_messagelen}

**Добавлено в: v15.0.0**

Предоставлена недопустимая длина сообщения.

### `ERR_CRYPTO_INVALID_SCRYPT_PARAMS` {#err_crypto_invalid_scrypt_params}

**Добавлено в: v15.0.0**

Один или несколько параметров [`crypto.scrypt()`](/ru/nodejs/api/crypto#cryptoscryptpassword-salt-keylen-options-callback) или [`crypto.scryptSync()`](/ru/nodejs/api/crypto#cryptoscryptsyncpassword-salt-keylen-options) находятся за пределами допустимого диапазона.

### `ERR_CRYPTO_INVALID_STATE` {#err_crypto_invalid_state}

Криптографический метод был использован для объекта, находящегося в недействительном состоянии. Например, вызов [`cipher.getAuthTag()`](/ru/nodejs/api/crypto#ciphergetauthtag) до вызова `cipher.final()`.

### `ERR_CRYPTO_INVALID_TAG_LENGTH` {#err_crypto_invalid_tag_length}

**Добавлено в: v15.0.0**

Предоставлена недопустимая длина тега аутентификации.

### `ERR_CRYPTO_JOB_INIT_FAILED` {#err_crypto_job_init_failed}

**Добавлено в: v15.0.0**

Не удалось инициализировать асинхронную криптографическую операцию.

### `ERR_CRYPTO_JWK_UNSUPPORTED_CURVE` {#err_crypto_jwk_unsupported_curve}

Эллиптическая кривая ключа не зарегистрирована для использования в [реестре эллиптических кривых JSON Web Key](https://www.iana.org/assignments/jose/jose.xhtml#web-key-elliptic-curve).

### `ERR_CRYPTO_JWK_UNSUPPORTED_KEY_TYPE` {#err_crypto_jwk_unsupported_key_type}

Тип асимметричного ключа не зарегистрирован для использования в [реестре типов ключей JSON Web Key](https://www.iana.org/assignments/jose/jose.xhtml#web-key-types).

### `ERR_CRYPTO_OPERATION_FAILED` {#err_crypto_operation_failed}

**Добавлено в: v15.0.0**

Криптографическая операция завершилась неудачно по какой-то не указанной причине.

### `ERR_CRYPTO_PBKDF2_ERROR` {#err_crypto_pbkdf2_error}

Алгоритм PBKDF2 завершился неудачно по неуказанным причинам. OpenSSL не предоставляет более подробной информации, поэтому Node.js тоже не предоставляет.

### `ERR_CRYPTO_SCRYPT_NOT_SUPPORTED` {#err_crypto_scrypt_not_supported}

Node.js был скомпилирован без поддержки `scrypt`. Это невозможно с официальными бинарными выпусками, но может произойти с пользовательскими сборками, включая сборки дистрибутивов.

### `ERR_CRYPTO_SIGN_KEY_REQUIRED` {#err_crypto_sign_key_required}

`key` подписи не был предоставлен методу [`sign.sign()`](/ru/nodejs/api/crypto#signsignprivatekey-outputencoding).

### `ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH` {#err_crypto_timing_safe_equal_length}

[`crypto.timingSafeEqual()`](/ru/nodejs/api/crypto#cryptotimingsafeequala-b) был вызван с аргументами `Buffer`, `TypedArray` или `DataView` разной длины.


### `ERR_CRYPTO_UNKNOWN_CIPHER` {#err_crypto_unknown_cipher}

Указан неизвестный шифр.

### `ERR_CRYPTO_UNKNOWN_DH_GROUP` {#err_crypto_unknown_dh_group}

Указано неизвестное имя группы Диффи-Хеллмана. Список допустимых имен групп см. в разделе [`crypto.getDiffieHellman()`](/ru/nodejs/api/crypto#cryptogetdiffiehellmangroupname).

### `ERR_CRYPTO_UNSUPPORTED_OPERATION` {#err_crypto_unsupported_operation}

**Добавлено в: v15.0.0, v14.18.0**

Предпринята попытка вызвать неподдерживаемую криптографическую операцию.

### `ERR_DEBUGGER_ERROR` {#err_debugger_error}

**Добавлено в: v16.4.0, v14.17.4**

Произошла ошибка в [отладчике](/ru/nodejs/api/debugger).

### `ERR_DEBUGGER_STARTUP_ERROR` {#err_debugger_startup_error}

**Добавлено в: v16.4.0, v14.17.4**

Время ожидания [отладчиком](/ru/nodejs/api/debugger) освобождения необходимого хоста/порта истекло.

### `ERR_DIR_CLOSED` {#err_dir_closed}

[`fs.Dir`](/ru/nodejs/api/fs#class-fsdir) был ранее закрыт.

### `ERR_DIR_CONCURRENT_OPERATION` {#err_dir_concurrent_operation}

**Добавлено в: v14.3.0**

Предпринята попытка синхронного чтения или закрытия [`fs.Dir`](/ru/nodejs/api/fs#class-fsdir), для которого выполняются асинхронные операции.

### `ERR_DLOPEN_DISABLED` {#err_dlopen_disabled}

**Добавлено в: v16.10.0, v14.19.0**

Загрузка собственных дополнений отключена с помощью [`--no-addons`](/ru/nodejs/api/cli#--no-addons).

### `ERR_DLOPEN_FAILED` {#err_dlopen_failed}

**Добавлено в: v15.0.0**

Сбой вызова `process.dlopen()`.

### `ERR_DNS_SET_SERVERS_FAILED` {#err_dns_set_servers_failed}

`c-ares` не удалось установить DNS-сервер.

### `ERR_DOMAIN_CALLBACK_NOT_AVAILABLE` {#err_domain_callback_not_available}

Модуль `node:domain` не пригоден для использования, так как не удалось установить необходимые перехватчики обработки ошибок, поскольку [`process.setUncaughtExceptionCaptureCallback()`](/ru/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn) был вызван ранее.

### `ERR_DOMAIN_CANNOT_SET_UNCAUGHT_EXCEPTION_CAPTURE` {#err_domain_cannot_set_uncaught_exception_capture}

[`process.setUncaughtExceptionCaptureCallback()`](/ru/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn) не может быть вызван, поскольку модуль `node:domain` был загружен ранее.

Трассировка стека расширена, чтобы включить момент времени, когда был загружен модуль `node:domain`.

### `ERR_DUPLICATE_STARTUP_SNAPSHOT_MAIN_FUNCTION` {#err_duplicate_startup_snapshot_main_function}

[`v8.startupSnapshot.setDeserializeMainFunction()`](/ru/nodejs/api/v8#v8startupsnapshotsetdeserializemainfunctioncallback-data) не может быть вызван, поскольку он уже был вызван ранее.


### `ERR_ENCODING_INVALID_ENCODED_DATA` {#err_encoding_invalid_encoded_data}

Данные, предоставленные API `TextDecoder()`, недействительны согласно предоставленной кодировке.

### `ERR_ENCODING_NOT_SUPPORTED` {#err_encoding_not_supported}

Кодировка, предоставленная API `TextDecoder()`, не является одной из [поддерживаемых WHATWG кодировок](/ru/nodejs/api/util#whatwg-supported-encodings).

### `ERR_EVAL_ESM_CANNOT_PRINT` {#err_eval_esm_cannot_print}

`--print` нельзя использовать с ESM вводом.

### `ERR_EVENT_RECURSION` {#err_event_recursion}

Выбрасывается, когда предпринимается попытка рекурсивной отправки события на `EventTarget`.

### `ERR_EXECUTION_ENVIRONMENT_NOT_AVAILABLE` {#err_execution_environment_not_available}

Контекст выполнения JS не связан с Node.js окружением. Это может произойти, когда Node.js используется в качестве встроенной библиотеки, и некоторые хуки для JS движка не настроены должным образом.

### `ERR_FALSY_VALUE_REJECTION` {#err_falsy_value_rejection}

`Promise`, который был преобразован в обратный вызов через `util.callbackify()`, был отклонен с ложным значением.

### `ERR_FEATURE_UNAVAILABLE_ON_PLATFORM` {#err_feature_unavailable_on_platform}

**Добавлено в: v14.0.0**

Используется, когда используется функция, недоступная для текущей платформы, на которой работает Node.js.

### `ERR_FS_CP_DIR_TO_NON_DIR` {#err_fs_cp_dir_to_non_dir}

**Добавлено в: v16.7.0**

Предпринята попытка скопировать каталог в не-каталог (файл, символическую ссылку и т. д.) с помощью [`fs.cp()`](/ru/nodejs/api/fs#fscpsrc-dest-options-callback).

### `ERR_FS_CP_EEXIST` {#err_fs_cp_eexist}

**Добавлено в: v16.7.0**

Предпринята попытка скопировать файл поверх уже существующего с помощью [`fs.cp()`](/ru/nodejs/api/fs#fscpsrc-dest-options-callback), при этом `force` и `errorOnExist` установлены в `true`.

### `ERR_FS_CP_EINVAL` {#err_fs_cp_einval}

**Добавлено в: v16.7.0**

При использовании [`fs.cp()`](/ru/nodejs/api/fs#fscpsrc-dest-options-callback), `src` или `dest` указывали на недопустимый путь.

### `ERR_FS_CP_FIFO_PIPE` {#err_fs_cp_fifo_pipe}

**Добавлено в: v16.7.0**

Предпринята попытка скопировать именованный канал с помощью [`fs.cp()`](/ru/nodejs/api/fs#fscpsrc-dest-options-callback).

### `ERR_FS_CP_NON_DIR_TO_DIR` {#err_fs_cp_non_dir_to_dir}

**Добавлено в: v16.7.0**

Предпринята попытка скопировать не-каталог (файл, символическую ссылку и т. д.) в каталог с помощью [`fs.cp()`](/ru/nodejs/api/fs#fscpsrc-dest-options-callback).

### `ERR_FS_CP_SOCKET` {#err_fs_cp_socket}

**Добавлено в: v16.7.0**

Предпринята попытка скопировать в сокет с помощью [`fs.cp()`](/ru/nodejs/api/fs#fscpsrc-dest-options-callback).


### `ERR_FS_CP_SYMLINK_TO_SUBDIRECTORY` {#err_fs_cp_symlink_to_subdirectory}

**Added in: v16.7.0**

При использовании [`fs.cp()`](/ru/nodejs/api/fs#fscpsrc-dest-options-callback), символическая ссылка в `dest` указывала на подкаталог `src`.

### `ERR_FS_CP_UNKNOWN` {#err_fs_cp_unknown}

**Added in: v16.7.0**

Была предпринята попытка скопировать в файл неизвестного типа с помощью [`fs.cp()`](/ru/nodejs/api/fs#fscpsrc-dest-options-callback).

### `ERR_FS_EISDIR` {#err_fs_eisdir}

Путь является каталогом.

### `ERR_FS_FILE_TOO_LARGE` {#err_fs_file_too_large}

Была предпринята попытка прочитать файл, размер которого превышает максимально допустимый размер для `Buffer`.

### `ERR_HTTP2_ALTSVC_INVALID_ORIGIN` {#err_http2_altsvc_invalid_origin}

Фреймы HTTP/2 ALTSVC требуют допустимый origin.

### `ERR_HTTP2_ALTSVC_LENGTH` {#err_http2_altsvc_length}

Фреймы HTTP/2 ALTSVC ограничены максимальным размером полезной нагрузки в 16 382 байта.

### `ERR_HTTP2_CONNECT_AUTHORITY` {#err_http2_connect_authority}

Для запросов HTTP/2, использующих метод `CONNECT`, требуется псевдозаголовок `:authority`.

### `ERR_HTTP2_CONNECT_PATH` {#err_http2_connect_path}

Для запросов HTTP/2, использующих метод `CONNECT`, псевдозаголовок `:path` запрещен.

### `ERR_HTTP2_CONNECT_SCHEME` {#err_http2_connect_scheme}

Для запросов HTTP/2, использующих метод `CONNECT`, псевдозаголовок `:scheme` запрещен.

### `ERR_HTTP2_ERROR` {#err_http2_error}

Произошла неспецифическая ошибка HTTP/2.

### `ERR_HTTP2_GOAWAY_SESSION` {#err_http2_goaway_session}

Новые HTTP/2 Streams нельзя открывать после того, как `Http2Session` получил фрейм `GOAWAY` от подключенного пира.

### `ERR_HTTP2_HEADERS_AFTER_RESPOND` {#err_http2_headers_after_respond}

Дополнительные заголовки были указаны после инициации ответа HTTP/2.

### `ERR_HTTP2_HEADERS_SENT` {#err_http2_headers_sent}

Была предпринята попытка отправить несколько заголовков ответа.

### `ERR_HTTP2_HEADER_SINGLE_VALUE` {#err_http2_header_single_value}

Было предоставлено несколько значений для поля заголовка HTTP/2, которое должно было иметь только одно значение.

### `ERR_HTTP2_INFO_STATUS_NOT_ALLOWED` {#err_http2_info_status_not_allowed}

Информационные коды состояния HTTP (`1xx`) не могут быть установлены в качестве кода состояния ответа для ответов HTTP/2.

### `ERR_HTTP2_INVALID_CONNECTION_HEADERS` {#err_http2_invalid_connection_headers}

Заголовки, специфичные для соединения HTTP/1, запрещено использовать в запросах и ответах HTTP/2.

### `ERR_HTTP2_INVALID_HEADER_VALUE` {#err_http2_invalid_header_value}

Указано недопустимое значение заголовка HTTP/2.


### `ERR_HTTP2_INVALID_INFO_STATUS` {#err_http2_invalid_info_status}

Был указан недействительный информационный код состояния HTTP. Информационные коды состояния должны быть целыми числами от `100` до `199` (включительно).

### `ERR_HTTP2_INVALID_ORIGIN` {#err_http2_invalid_origin}

Фреймы HTTP/2 `ORIGIN` требуют допустимый источник.

### `ERR_HTTP2_INVALID_PACKED_SETTINGS_LENGTH` {#err_http2_invalid_packed_settings_length}

Экземпляры `Buffer` и `Uint8Array`, переданные в API `http2.getUnpackedSettings()`, должны иметь длину, кратную шести.

### `ERR_HTTP2_INVALID_PSEUDOHEADER` {#err_http2_invalid_pseudoheader}

Разрешено использовать только допустимые псевдозаголовки HTTP/2 (`:status`, `:path`, `:authority`, `:scheme` и `:method`).

### `ERR_HTTP2_INVALID_SESSION` {#err_http2_invalid_session}

Было выполнено действие над объектом `Http2Session`, который уже был уничтожен.

### `ERR_HTTP2_INVALID_SETTING_VALUE` {#err_http2_invalid_setting_value}

Указано недействительное значение для настройки HTTP/2.

### `ERR_HTTP2_INVALID_STREAM` {#err_http2_invalid_stream}

Была выполнена операция над потоком, который уже был уничтожен.

### `ERR_HTTP2_MAX_PENDING_SETTINGS_ACK` {#err_http2_max_pending_settings_ack}

Всякий раз, когда фрейм HTTP/2 `SETTINGS` отправляется подключенному одноранговому узлу, этот узел должен отправить подтверждение того, что он получил и применил новые `SETTINGS`. По умолчанию, максимальное количество неподтвержденных фреймов `SETTINGS` может быть отправлено в любой момент времени. Этот код ошибки используется, когда этот предел был достигнут.

### `ERR_HTTP2_NESTED_PUSH` {#err_http2_nested_push}

Была предпринята попытка инициировать новый push-поток изнутри push-потока. Вложенные push-потоки не разрешены.

### `ERR_HTTP2_NO_MEM` {#err_http2_no_mem}

Недостаточно памяти при использовании API `http2session.setLocalWindowSize(windowSize)`.

### `ERR_HTTP2_NO_SOCKET_MANIPULATION` {#err_http2_no_socket_manipulation}

Была предпринята попытка напрямую манипулировать (читать, писать, приостанавливать, возобновлять и т. д.) сокетом, подключенным к `Http2Session`.

### `ERR_HTTP2_ORIGIN_LENGTH` {#err_http2_origin_length}

Фреймы HTTP/2 `ORIGIN` ограничены длиной 16382 байта.

### `ERR_HTTP2_OUT_OF_STREAMS` {#err_http2_out_of_streams}

Количество потоков, созданных в одном сеансе HTTP/2, достигло максимального предела.

### `ERR_HTTP2_PAYLOAD_FORBIDDEN` {#err_http2_payload_forbidden}

Полезная нагрузка сообщения была указана для кода ответа HTTP, для которого полезная нагрузка запрещена.


### `ERR_HTTP2_PING_CANCEL` {#err_http2_ping_cancel}

HTTP/2 ping был отменен.

### `ERR_HTTP2_PING_LENGTH` {#err_http2_ping_length}

Полезная нагрузка HTTP/2 ping должна быть ровно 8 байт в длину.

### `ERR_HTTP2_PSEUDOHEADER_NOT_ALLOWED` {#err_http2_pseudoheader_not_allowed}

Некорректно использован псевдозаголовок HTTP/2. Псевдозаголовки - это имена ключей заголовков, начинающиеся с префикса `:`.

### `ERR_HTTP2_PUSH_DISABLED` {#err_http2_push_disabled}

Предпринята попытка создать push-поток, который был отключен клиентом.

### `ERR_HTTP2_SEND_FILE` {#err_http2_send_file}

Предпринята попытка использовать API `Http2Stream.prototype.responseWithFile()` для отправки каталога.

### `ERR_HTTP2_SEND_FILE_NOSEEK` {#err_http2_send_file_noseek}

Предпринята попытка использовать API `Http2Stream.prototype.responseWithFile()` для отправки чего-либо, отличного от обычного файла, но были предоставлены параметры `offset` или `length`.

### `ERR_HTTP2_SESSION_ERROR` {#err_http2_session_error}

`Http2Session` закрыт с ненулевым кодом ошибки.

### `ERR_HTTP2_SETTINGS_CANCEL` {#err_http2_settings_cancel}

Настройки `Http2Session` отменены.

### `ERR_HTTP2_SOCKET_BOUND` {#err_http2_socket_bound}

Предпринята попытка подключить объект `Http2Session` к `net.Socket` или `tls.TLSSocket`, который уже был привязан к другому объекту `Http2Session`.

### `ERR_HTTP2_SOCKET_UNBOUND` {#err_http2_socket_unbound}

Предпринята попытка использовать свойство `socket` `Http2Session`, который уже был закрыт.

### `ERR_HTTP2_STATUS_101` {#err_http2_status_101}

Использование информационного кода состояния `101` запрещено в HTTP/2.

### `ERR_HTTP2_STATUS_INVALID` {#err_http2_status_invalid}

Указан недействительный код состояния HTTP. Коды состояния должны быть целым числом от `100` до `599` (включительно).

### `ERR_HTTP2_STREAM_CANCEL` {#err_http2_stream_cancel}

`Http2Stream` был уничтожен до того, как какие-либо данные были переданы подключенному пиру.

### `ERR_HTTP2_STREAM_ERROR` {#err_http2_stream_error}

В кадре `RST_STREAM` был указан ненулевой код ошибки.

### `ERR_HTTP2_STREAM_SELF_DEPENDENCY` {#err_http2_stream_self_dependency}

При установке приоритета для потока HTTP/2 поток может быть помечен как зависимость для родительского потока. Этот код ошибки используется, когда делается попытка пометить поток как зависимый от самого себя.

### `ERR_HTTP2_TOO_MANY_CUSTOM_SETTINGS` {#err_http2_too_many_custom_settings}

Превышено количество поддерживаемых пользовательских настроек (10).


### `ERR_HTTP2_TOO_MANY_INVALID_FRAMES` {#err_http2_too_many_invalid_frames}

**Добавлено в версии: v15.14.0**

Превышен лимит допустимых недействительных кадров протокола HTTP/2, отправленных пиром, как указано в опции `maxSessionInvalidFrames`.

### `ERR_HTTP2_TRAILERS_ALREADY_SENT` {#err_http2_trailers_already_sent}

Трейлерные заголовки уже отправлены в `Http2Stream`.

### `ERR_HTTP2_TRAILERS_NOT_READY` {#err_http2_trailers_not_ready}

Метод `http2stream.sendTrailers()` нельзя вызывать до тех пор, пока на объекте `Http2Stream` не будет сгенерировано событие `'wantTrailers'`. Событие `'wantTrailers'` будет сгенерировано только в том случае, если для `Http2Stream` установлена опция `waitForTrailers`.

### `ERR_HTTP2_UNSUPPORTED_PROTOCOL` {#err_http2_unsupported_protocol}

В `http2.connect()` был передан URL-адрес, использующий протокол, отличный от `http:` или `https:`.

### `ERR_HTTP_BODY_NOT_ALLOWED` {#err_http_body_not_allowed}

Ошибка возникает при записи в HTTP-ответ, который не допускает содержимое.

### `ERR_HTTP_CONTENT_LENGTH_MISMATCH` {#err_http_content_length_mismatch}

Размер тела ответа не соответствует указанному значению заголовка content-length.

### `ERR_HTTP_HEADERS_SENT` {#err_http_headers_sent}

Была предпринята попытка добавить дополнительные заголовки после того, как заголовки уже были отправлены.

### `ERR_HTTP_INVALID_HEADER_VALUE` {#err_http_invalid_header_value}

Указано недействительное значение HTTP-заголовка.

### `ERR_HTTP_INVALID_STATUS_CODE` {#err_http_invalid_status_code}

Код состояния выходит за пределы обычного диапазона кодов состояния (100-999).

### `ERR_HTTP_REQUEST_TIMEOUT` {#err_http_request_timeout}

Клиент не отправил весь запрос в течение отведенного времени.

### `ERR_HTTP_SOCKET_ASSIGNED` {#err_http_socket_assigned}

Данному [`ServerResponse`](/ru/nodejs/api/http#class-httpserverresponse) уже назначен сокет.

### `ERR_HTTP_SOCKET_ENCODING` {#err_http_socket_encoding}

Изменение кодировки сокета не разрешено согласно [RFC 7230 Section 3](https://tools.ietf.org/html/rfc7230#section-3).

### `ERR_HTTP_TRAILER_INVALID` {#err_http_trailer_invalid}

Заголовок `Trailer` был установлен, даже если кодировка передачи это не поддерживает.

### `ERR_ILLEGAL_CONSTRUCTOR` {#err_illegal_constructor}

Была предпринята попытка создать объект с использованием непубличного конструктора.

### `ERR_IMPORT_ATTRIBUTE_MISSING` {#err_import_attribute_missing}

**Добавлено в версии: v21.1.0**

Отсутствует атрибут импорта, что препятствует импорту указанного модуля.


### `ERR_IMPORT_ATTRIBUTE_TYPE_INCOMPATIBLE` {#err_import_attribute_type_incompatible}

**Добавлено в версии: v21.1.0**

Был предоставлен атрибут `type` импорта, но указанный модуль имеет другой тип.

### `ERR_IMPORT_ATTRIBUTE_UNSUPPORTED` {#err_import_attribute_unsupported}

**Добавлено в версии: v21.0.0, v20.10.0, v18.19.0**

Атрибут импорта не поддерживается этой версией Node.js.

### `ERR_INCOMPATIBLE_OPTION_PAIR` {#err_incompatible_option_pair}

Пара параметров несовместима друг с другом и не может использоваться одновременно.

### `ERR_INPUT_TYPE_NOT_ALLOWED` {#err_input_type_not_allowed}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально
:::

Флаг `--input-type` был использован для попытки выполнения файла. Этот флаг можно использовать только с вводом через `--eval`, `--print` или `STDIN`.

### `ERR_INSPECTOR_ALREADY_ACTIVATED` {#err_inspector_already_activated}

При использовании модуля `node:inspector` была предпринята попытка активировать инспектор, когда он уже начал прослушивание порта. Используйте `inspector.close()`, прежде чем активировать его на другом адресе.

### `ERR_INSPECTOR_ALREADY_CONNECTED` {#err_inspector_already_connected}

При использовании модуля `node:inspector` была предпринята попытка подключиться, когда инспектор уже подключен.

### `ERR_INSPECTOR_CLOSED` {#err_inspector_closed}

При использовании модуля `node:inspector` была предпринята попытка использовать инспектор после того, как сессия уже закрыта.

### `ERR_INSPECTOR_COMMAND` {#err_inspector_command}

Произошла ошибка при выдаче команды через модуль `node:inspector`.

### `ERR_INSPECTOR_NOT_ACTIVE` {#err_inspector_not_active}

`inspector` неактивен при вызове `inspector.waitForDebugger()`.

### `ERR_INSPECTOR_NOT_AVAILABLE` {#err_inspector_not_available}

Модуль `node:inspector` недоступен для использования.

### `ERR_INSPECTOR_NOT_CONNECTED` {#err_inspector_not_connected}

При использовании модуля `node:inspector` была предпринята попытка использовать инспектор до его подключения.

### `ERR_INSPECTOR_NOT_WORKER` {#err_inspector_not_worker}

API был вызван в основном потоке, который можно использовать только из рабочего потока.

### `ERR_INTERNAL_ASSERTION` {#err_internal_assertion}

Обнаружена ошибка в Node.js или некорректное использование внутренних компонентов Node.js. Чтобы исправить ошибку, откройте issue на [https://github.com/nodejs/node/issues](https://github.com/nodejs/node/issues).


### `ERR_INVALID_ADDRESS` {#err_invalid_address}

Предоставленный адрес не распознан API Node.js.

### `ERR_INVALID_ADDRESS_FAMILY` {#err_invalid_address_family}

Предоставленное семейство адресов не распознано API Node.js.

### `ERR_INVALID_ARG_TYPE` {#err_invalid_arg_type}

Аргумент неверного типа был передан в API Node.js.

### `ERR_INVALID_ARG_VALUE` {#err_invalid_arg_value}

Недопустимое или неподдерживаемое значение было передано для данного аргумента.

### `ERR_INVALID_ASYNC_ID` {#err_invalid_async_id}

Недопустимый `asyncId` или `triggerAsyncId` был передан с использованием `AsyncHooks`. Идентификатор меньше -1 никогда не должен встречаться.

### `ERR_INVALID_BUFFER_SIZE` {#err_invalid_buffer_size}

Обмен был выполнен на `Buffer`, но его размер не был совместим с операцией.

### `ERR_INVALID_CHAR` {#err_invalid_char}

В заголовках обнаружены недопустимые символы.

### `ERR_INVALID_CURSOR_POS` {#err_invalid_cursor_pos}

Курсор в данном потоке не может быть перемещен в указанную строку без указанного столбца.

### `ERR_INVALID_FD` {#err_invalid_fd}

Файловый дескриптор ('fd') был недействителен (например, это было отрицательное значение).

### `ERR_INVALID_FD_TYPE` {#err_invalid_fd_type}

Тип файлового дескриптора ('fd') был недействителен.

### `ERR_INVALID_FILE_URL_HOST` {#err_invalid_file_url_host}

API Node.js, который использует `file:` URLs (например, определенные функции в модуле [`fs`](/ru/nodejs/api/fs)), обнаружил URL-адрес файла с несовместимым хостом. Эта ситуация может возникнуть только в Unix-подобных системах, где поддерживается только `localhost` или пустой хост.

### `ERR_INVALID_FILE_URL_PATH` {#err_invalid_file_url_path}

API Node.js, который использует `file:` URLs (например, определенные функции в модуле [`fs`](/ru/nodejs/api/fs)), обнаружил URL-адрес файла с несовместимым путем. Точная семантика для определения того, можно ли использовать путь, зависит от платформы.

### `ERR_INVALID_HANDLE_TYPE` {#err_invalid_handle_type}

Была предпринята попытка отправить неподдерживаемый "handle" по каналу IPC-связи дочернему процессу. См. [`subprocess.send()`](/ru/nodejs/api/child_process#subprocesssendmessage-sendhandle-options-callback) и [`process.send()`](/ru/nodejs/api/process#processsendmessage-sendhandle-options-callback) для получения дополнительной информации.

### `ERR_INVALID_HTTP_TOKEN` {#err_invalid_http_token}

Был предоставлен недопустимый HTTP-токен.

### `ERR_INVALID_IP_ADDRESS` {#err_invalid_ip_address}

IP-адрес недействителен.


### `ERR_INVALID_MIME_SYNTAX` {#err_invalid_mime_syntax}

Синтаксис MIME недействителен.

### `ERR_INVALID_MODULE` {#err_invalid_module}

**Добавлено в: v15.0.0, v14.18.0**

Была предпринята попытка загрузить модуль, который не существует или является недействительным.

### `ERR_INVALID_MODULE_SPECIFIER` {#err_invalid_module_specifier}

Импортированная строка модуля является недействительным URL-адресом, именем пакета или спецификатором подпути пакета.

### `ERR_INVALID_OBJECT_DEFINE_PROPERTY` {#err_invalid_object_define_property}

Произошла ошибка при установке недействительного атрибута для свойства объекта.

### `ERR_INVALID_PACKAGE_CONFIG` {#err_invalid_package_config}

Не удалось разобрать недопустимый файл [`package.json`](/ru/nodejs/api/packages#nodejs-packagejson-field-definitions).

### `ERR_INVALID_PACKAGE_TARGET` {#err_invalid_package_target}

Поле [`"exports"`](/ru/nodejs/api/packages#exports) файла `package.json` содержит недопустимое значение целевого отображения для предпринятого разрешения модуля.

### `ERR_INVALID_PROTOCOL` {#err_invalid_protocol}

В `http.request()` был передан недействительный `options.protocol`.

### `ERR_INVALID_REPL_EVAL_CONFIG` {#err_invalid_repl_eval_config}

В конфигурации [`REPL`](/ru/nodejs/api/repl) были установлены как параметры `breakEvalOnSigint`, так и `eval`, что не поддерживается.

### `ERR_INVALID_REPL_INPUT` {#err_invalid_repl_input}

Ввод не может быть использован в [`REPL`](/ru/nodejs/api/repl). Условия, при которых используется эта ошибка, описаны в документации [`REPL`](/ru/nodejs/api/repl).

### `ERR_INVALID_RETURN_PROPERTY` {#err_invalid_return_property}

Возникает в случае, если параметр функции не предоставляет допустимое значение для одного из свойств возвращаемого объекта при выполнении.

### `ERR_INVALID_RETURN_PROPERTY_VALUE` {#err_invalid_return_property_value}

Возникает в случае, если параметр функции не предоставляет ожидаемый тип значения для одного из свойств возвращаемого объекта при выполнении.

### `ERR_INVALID_RETURN_VALUE` {#err_invalid_return_value}

Возникает в случае, если параметр функции не возвращает ожидаемый тип значения при выполнении, например, когда ожидается, что функция вернет промис.

### `ERR_INVALID_STATE` {#err_invalid_state}

**Добавлено в: v15.0.0**

Указывает, что операция не может быть завершена из-за недопустимого состояния. Например, объект уже мог быть уничтожен или может выполнять другую операцию.

### `ERR_INVALID_SYNC_FORK_INPUT` {#err_invalid_sync_fork_input}

В качестве стандартного ввода для асинхронного форка был предоставлен `Buffer`, `TypedArray`, `DataView` или `string`. Дополнительную информацию см. в документации для модуля [`child_process`](/ru/nodejs/api/child_process).


### `ERR_INVALID_THIS` {#err_invalid_this}

Функция API Node.js была вызвана с несовместимым значением `this`.

```js [ESM]
const urlSearchParams = new URLSearchParams('foo=bar&baz=new');

const buf = Buffer.alloc(1);
urlSearchParams.has.call(buf, 'foo');
// Выбрасывает TypeError с кодом 'ERR_INVALID_THIS'
```
### `ERR_INVALID_TUPLE` {#err_invalid_tuple}

Элемент в `iterable`, предоставленном [WHATWG](/ru/nodejs/api/url#the-whatwg-url-api) [`URLSearchParams` конструктору](/ru/nodejs/api/url#new-urlsearchparamsiterable), не представлял собой кортеж `[name, value]` – то есть, если элемент не является итерируемым или не состоит ровно из двух элементов.

### `ERR_INVALID_TYPESCRIPT_SYNTAX` {#err_invalid_typescript_syntax}

**Добавлено в: v23.0.0**

Предоставленный синтаксис TypeScript недействителен или не поддерживается. Это может произойти при использовании синтаксиса TypeScript, требующего преобразования с помощью [удаления типов](/ru/nodejs/api/typescript#type-stripping).

### `ERR_INVALID_URI` {#err_invalid_uri}

Передан недопустимый URI.

### `ERR_INVALID_URL` {#err_invalid_url}

Недопустимый URL был передан [WHATWG](/ru/nodejs/api/url#the-whatwg-url-api) [`URL` конструктору](/ru/nodejs/api/url#new-urlinput-base) или устаревшему [`url.parse()`](/ru/nodejs/api/url#urlparseurlstring-parsequerystring-slashesdenotehost) для разбора. Объект выбрасываемой ошибки обычно имеет дополнительное свойство `'input'`, которое содержит URL, который не удалось разобрать.

### `ERR_INVALID_URL_SCHEME` {#err_invalid_url_scheme}

Была предпринята попытка использовать URL несовместимой схемы (протокола) для определенной цели. Он используется только в поддержке [WHATWG URL API](/ru/nodejs/api/url#the-whatwg-url-api) в модуле [`fs`](/ru/nodejs/api/fs) (который принимает только URL со схемой `'file'`), но может использоваться и в других API Node.js в будущем.

### `ERR_IPC_CHANNEL_CLOSED` {#err_ipc_channel_closed}

Была предпринята попытка использовать канал связи IPC, который уже был закрыт.

### `ERR_IPC_DISCONNECTED` {#err_ipc_disconnected}

Была предпринята попытка отключить канал связи IPC, который уже был отключен. Дополнительную информацию см. в документации по модулю [`child_process`](/ru/nodejs/api/child_process).

### `ERR_IPC_ONE_PIPE` {#err_ipc_one_pipe}

Была предпринята попытка создать дочерний процесс Node.js, используя более одного канала связи IPC. Дополнительную информацию см. в документации по модулю [`child_process`](/ru/nodejs/api/child_process).


### `ERR_IPC_SYNC_FORK` {#err_ipc_sync_fork}

Была предпринята попытка открыть канал связи IPC с синхронно порожденным процессом Node.js. Дополнительную информацию см. в документации для модуля [`child_process`](/ru/nodejs/api/child_process).

### `ERR_IP_BLOCKED` {#err_ip_blocked}

IP-адрес заблокирован `net.BlockList`.

### `ERR_LOADER_CHAIN_INCOMPLETE` {#err_loader_chain_incomplete}

**Добавлено в: v18.6.0, v16.17.0**

Хук загрузчика ESM вернулся, не вызвав `next()` и не сигнализируя явно о коротком замыкании.

### `ERR_LOAD_SQLITE_EXTENSION` {#err_load_sqlite_extension}

**Добавлено в: v23.5.0**

Произошла ошибка при загрузке расширения SQLite.

### `ERR_MEMORY_ALLOCATION_FAILED` {#err_memory_allocation_failed}

Была предпринята попытка выделить память (обычно в слое C++), но она не удалась.

### `ERR_MESSAGE_TARGET_CONTEXT_UNAVAILABLE` {#err_message_target_context_unavailable}

**Добавлено в: v14.5.0, v12.19.0**

Сообщение, отправленное в [`MessagePort`](/ru/nodejs/api/worker_threads#class-messageport), не удалось десериализовать в целевом [vm](/ru/nodejs/api/vm) `Context`. В настоящее время не все объекты Node.js могут быть успешно инстанцированы в любом контексте, и попытка их передачи с помощью `postMessage()` может привести к сбою на принимающей стороне в этом случае.

### `ERR_METHOD_NOT_IMPLEMENTED` {#err_method_not_implemented}

Метод требуется, но не реализован.

### `ERR_MISSING_ARGS` {#err_missing_args}

Обязательный аргумент API Node.js не был передан. Это используется только для строгого соответствия спецификации API (которая в некоторых случаях может принимать `func(undefined)`, но не `func()`). В большинстве собственных API Node.js `func(undefined)` и `func()` обрабатываются идентично, и вместо этого может использоваться код ошибки [`ERR_INVALID_ARG_TYPE`](/ru/nodejs/api/errors#err-invalid-arg-type).

### `ERR_MISSING_OPTION` {#err_missing_option}

Для API, которые принимают объекты параметров, некоторые параметры могут быть обязательными. Этот код выдается, если обязательный параметр отсутствует.

### `ERR_MISSING_PASSPHRASE` {#err_missing_passphrase}

Была предпринята попытка прочитать зашифрованный ключ без указания парольной фразы.

### `ERR_MISSING_PLATFORM_FOR_WORKER` {#err_missing_platform_for_worker}

Платформа V8, используемая этим экземпляром Node.js, не поддерживает создание Workers. Это вызвано отсутствием поддержки Workers со стороны встраивающей программы. В частности, эта ошибка не возникнет при стандартных сборках Node.js.


### `ERR_MODULE_NOT_FOUND` {#err_module_not_found}

Файл модуля не удалось разрешить загрузчику модулей ECMAScript при попытке выполнить операцию `import` или при загрузке точки входа программы.

### `ERR_MULTIPLE_CALLBACK` {#err_multiple_callback}

Обратный вызов был вызван несколько раз.

Обратный вызов почти всегда должен вызываться только один раз, так как запрос может быть либо выполнен, либо отклонен, но не одновременно. Последнее было бы возможно, если бы обратный вызов был вызван несколько раз.

### `ERR_NAPI_CONS_FUNCTION` {#err_napi_cons_function}

При использовании `Node-API` переданный конструктор не был функцией.

### `ERR_NAPI_INVALID_DATAVIEW_ARGS` {#err_napi_invalid_dataview_args}

При вызове `napi_create_dataview()` заданное значение `offset` находилось за пределами dataview или `offset + length` превышало длину заданного `buffer`.

### `ERR_NAPI_INVALID_TYPEDARRAY_ALIGNMENT` {#err_napi_invalid_typedarray_alignment}

При вызове `napi_create_typedarray()` предоставленное значение `offset` не было кратно размеру элемента.

### `ERR_NAPI_INVALID_TYPEDARRAY_LENGTH` {#err_napi_invalid_typedarray_length}

При вызове `napi_create_typedarray()` выражение `(length * size_of_element) + byte_offset` было больше длины заданного `buffer`.

### `ERR_NAPI_TSFN_CALL_JS` {#err_napi_tsfn_call_js}

Произошла ошибка при вызове JavaScript-части потокобезопасной функции.

### `ERR_NAPI_TSFN_GET_UNDEFINED` {#err_napi_tsfn_get_undefined}

Произошла ошибка при попытке получить значение JavaScript `undefined`.

### `ERR_NON_CONTEXT_AWARE_DISABLED` {#err_non_context_aware_disabled}

Не контекстно-ориентированный собственный аддон был загружен в процессе, который их запрещает.

### `ERR_NOT_BUILDING_SNAPSHOT` {#err_not_building_snapshot}

Была предпринята попытка использовать операции, которые можно использовать только при создании начального снимка V8, хотя Node.js его не создает.

### `ERR_NOT_IN_SINGLE_EXECUTABLE_APPLICATION` {#err_not_in_single_executable_application}

**Добавлено в: v21.7.0, v20.12.0**

Операция не может быть выполнена, если она не находится в однофайловом исполняемом приложении.

### `ERR_NOT_SUPPORTED_IN_SNAPSHOT` {#err_not_supported_in_snapshot}

Была предпринята попытка выполнить операции, которые не поддерживаются при создании начального снимка.

### `ERR_NO_CRYPTO` {#err_no_crypto}

Была предпринята попытка использовать криптографические функции, в то время как Node.js не был скомпилирован с поддержкой криптографии OpenSSL.


### `ERR_NO_ICU` {#err_no_icu}

Была предпринята попытка использовать функции, требующие [ICU](/ru/nodejs/api/intl#internationalization-support), но Node.js не был скомпилирован с поддержкой ICU.

### `ERR_NO_TYPESCRIPT` {#err_no_typescript}

**Добавлено в: v23.0.0**

Была предпринята попытка использовать функции, требующие [встроенной поддержки TypeScript](/ru/nodejs/api/typescript#type-stripping), но Node.js не был скомпилирован с поддержкой TypeScript.

### `ERR_OPERATION_FAILED` {#err_operation_failed}

**Добавлено в: v15.0.0**

Операция завершилась неудачно. Обычно используется для обозначения общей неудачи асинхронной операции.

### `ERR_OUT_OF_RANGE` {#err_out_of_range}

Заданное значение выходит за пределы допустимого диапазона.

### `ERR_PACKAGE_IMPORT_NOT_DEFINED` {#err_package_import_not_defined}

Поле `package.json` [`"imports"`](/ru/nodejs/api/packages#imports) не определяет заданное внутреннее отображение спецификатора пакета.

### `ERR_PACKAGE_PATH_NOT_EXPORTED` {#err_package_path_not_exported}

Поле `package.json` [`"exports"`](/ru/nodejs/api/packages#exports) не экспортирует запрошенный подпуть. Поскольку экспорты инкапсулированы, частные внутренние модули, которые не экспортируются, нельзя импортировать через разрешение пакета, если не используется абсолютный URL.

### `ERR_PARSE_ARGS_INVALID_OPTION_VALUE` {#err_parse_args_invalid_option_value}

**Добавлено в: v18.3.0, v16.17.0**

Когда для `strict` установлено значение `true`, выбрасывается [`util.parseArgs()`](/ru/nodejs/api/util#utilparseargsconfig), если значение [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) предоставлено для параметра типа [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type), или если значение [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) предоставлено для параметра типа [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type).

### `ERR_PARSE_ARGS_UNEXPECTED_POSITIONAL` {#err_parse_args_unexpected_positional}

**Добавлено в: v18.3.0, v16.17.0**

Выбрасывается [`util.parseArgs()`](/ru/nodejs/api/util#utilparseargsconfig), когда предоставлен позиционный аргумент, а `allowPositionals` установлено в `false`.

### `ERR_PARSE_ARGS_UNKNOWN_OPTION` {#err_parse_args_unknown_option}

**Добавлено в: v18.3.0, v16.17.0**

Когда для `strict` установлено значение `true`, выбрасывается [`util.parseArgs()`](/ru/nodejs/api/util#utilparseargsconfig), если аргумент не настроен в `options`.


### `ERR_PERFORMANCE_INVALID_TIMESTAMP` {#err_performance_invalid_timestamp}

Недопустимое значение метки времени было предоставлено для метки или измерения производительности.

### `ERR_PERFORMANCE_MEASURE_INVALID_OPTIONS` {#err_performance_measure_invalid_options}

Предоставлены недопустимые параметры для измерения производительности.

### `ERR_PROTO_ACCESS` {#err_proto_access}

Доступ к `Object.prototype.__proto__` был запрещен с использованием [`--disable-proto=throw`](/ru/nodejs/api/cli#--disable-protomode). Для получения и установки прототипа объекта следует использовать [`Object.getPrototypeOf`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getPrototypeOf) и [`Object.setPrototypeOf`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf).

### `ERR_QUIC_APPLICATION_ERROR` {#err_quic_application_error}

**Добавлено в: v23.4.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально
:::

Произошла ошибка приложения QUIC.

### `ERR_QUIC_CONNECTION_FAILED` {#err_quic_connection_failed}

**Добавлено в: v23.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально
:::

Не удалось установить соединение QUIC.

### `ERR_QUIC_ENDPOINT_CLOSED` {#err_quic_endpoint_closed}

**Добавлено в: v23.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально
:::

Конечная точка QUIC закрыта с ошибкой.

### `ERR_QUIC_OPEN_STREAM_FAILED` {#err_quic_open_stream_failed}

**Добавлено в: v23.0.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально
:::

Не удалось открыть поток QUIC.

### `ERR_QUIC_TRANSPORT_ERROR` {#err_quic_transport_error}

**Добавлено в: v23.4.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально
:::

Произошла транспортная ошибка QUIC.

### `ERR_QUIC_VERSION_NEGOTIATION_ERROR` {#err_quic_version_negotiation_error}

**Добавлено в: v23.4.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально
:::

Сессия QUIC не удалась, так как требуется согласование версий.


### `ERR_REQUIRE_ASYNC_MODULE` {#err_require_async_module}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Стабильно: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально
:::

При попытке `require()` [ES Module](/ru/nodejs/api/esm) модуль оказывается асинхронным. То есть, он содержит `await` верхнего уровня.

Чтобы увидеть, где находится `await` верхнего уровня, используйте `--experimental-print-required-tla` (это приведет к выполнению модулей до поиска `await` верхнего уровня).

### `ERR_REQUIRE_CYCLE_MODULE` {#err_require_cycle_module}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Стабильно: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально
:::

При попытке `require()` [ES Module](/ru/nodejs/api/esm) переход от CommonJS к ESM или от ESM к CommonJS участвует в немедленном цикле. Это не допускается, поскольку ES Modules не могут быть вычислены во время их вычисления.

Чтобы избежать цикла, вызов `require()`, участвующий в цикле, не должен происходить на верхнем уровне либо ES Module (через `createRequire()`), либо CommonJS модуля, и должен выполняться лениво во внутренней функции.

### `ERR_REQUIRE_ESM` {#err_require_esm}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v23.0.0 | `require()` теперь поддерживает загрузку синхронных ES-модулей по умолчанию. |
:::

::: danger [Stable: 0 - Deprecated]
[Stable: 0](/ru/nodejs/api/documentation#stability-index) [Стабильно: 0](/ru/nodejs/api/documentation#stability-index) - Устарело
:::

Была предпринята попытка `require()` [ES Module](/ru/nodejs/api/esm).

Эта ошибка устарела, так как `require()` теперь поддерживает загрузку синхронных ES-модулей. Когда `require()` сталкивается с ES-модулем, содержащим `await` верхнего уровня, он выбросит [`ERR_REQUIRE_ASYNC_MODULE`](/ru/nodejs/api/errors#err_require_async_module) вместо этого.

### `ERR_SCRIPT_EXECUTION_INTERRUPTED` {#err_script_execution_interrupted}

Выполнение скрипта было прервано сигналом `SIGINT` (например, была нажата комбинация +).

### `ERR_SCRIPT_EXECUTION_TIMEOUT` {#err_script_execution_timeout}

Превышено время выполнения скрипта, возможно, из-за ошибок в выполняемом скрипте.

### `ERR_SERVER_ALREADY_LISTEN` {#err_server_already_listen}

Метод [`server.listen()`](/ru/nodejs/api/net#serverlisten) был вызван в то время, когда `net.Server` уже прослушивался. Это относится ко всем экземплярам `net.Server`, включая HTTP, HTTPS и HTTP/2 `Server` экземпляры.


### `ERR_SERVER_NOT_RUNNING` {#err_server_not_running}

Был вызван метод [`server.close()`](/ru/nodejs/api/net#serverclosecallback), когда `net.Server` не был запущен. Это относится ко всем экземплярам `net.Server`, включая HTTP, HTTPS и HTTP/2 экземпляры `Server`.

### `ERR_SINGLE_EXECUTABLE_APPLICATION_ASSET_NOT_FOUND` {#err_single_executable_application_asset_not_found}

**Добавлено в: v21.7.0, v20.12.0**

В API для единого исполняемого приложения был передан ключ для идентификации ресурса, но совпадений не найдено.

### `ERR_SOCKET_ALREADY_BOUND` {#err_socket_already_bound}

Была предпринята попытка привязать сокет, который уже привязан.

### `ERR_SOCKET_BAD_BUFFER_SIZE` {#err_socket_bad_buffer_size}

Для параметров `recvBufferSize` или `sendBufferSize` в [`dgram.createSocket()`](/ru/nodejs/api/dgram#dgramcreatesocketoptions-callback) был передан недействительный (отрицательный) размер.

### `ERR_SOCKET_BAD_PORT` {#err_socket_bad_port}

Функция API, ожидающая порт \>= 0 и \< 65536, получила недействительное значение.

### `ERR_SOCKET_BAD_TYPE` {#err_socket_bad_type}

Функция API, ожидающая тип сокета (`udp4` или `udp6`), получила недействительное значение.

### `ERR_SOCKET_BUFFER_SIZE` {#err_socket_buffer_size}

Во время использования [`dgram.createSocket()`](/ru/nodejs/api/dgram#dgramcreatesocketoptions-callback) не удалось определить размер `Buffer` приема или отправки.

### `ERR_SOCKET_CLOSED` {#err_socket_closed}

Была предпринята попытка выполнить операцию над уже закрытым сокетом.

### `ERR_SOCKET_CLOSED_BEFORE_CONNECTION` {#err_socket_closed_before_connection}

При вызове [`net.Socket.write()`](/ru/nodejs/api/net#socketwritedata-encoding-callback) на подключающемся сокете и сокет был закрыт до установления соединения.

### `ERR_SOCKET_CONNECTION_TIMEOUT` {#err_socket_connection_timeout}

Сокет не смог подключиться ни к одному адресу, возвращенному DNS, в течение разрешенного времени ожидания при использовании алгоритма автоматического выбора семейства адресов.

### `ERR_SOCKET_DGRAM_IS_CONNECTED` {#err_socket_dgram_is_connected}

Был сделан вызов [`dgram.connect()`](/ru/nodejs/api/dgram#socketconnectport-address-callback) на уже подключенном сокете.

### `ERR_SOCKET_DGRAM_NOT_CONNECTED` {#err_socket_dgram_not_connected}

Был сделан вызов [`dgram.disconnect()`](/ru/nodejs/api/dgram#socketdisconnect) или [`dgram.remoteAddress()`](/ru/nodejs/api/dgram#socketremoteaddress) на отключенном сокете.

### `ERR_SOCKET_DGRAM_NOT_RUNNING` {#err_socket_dgram_not_running}

Был сделан вызов, но подсистема UDP не была запущена.


### `ERR_SOURCE_MAP_CORRUPT` {#err_source_map_corrupt}

Не удалось выполнить синтаксический анализ карты исходного кода, поскольку она не существует или повреждена.

### `ERR_SOURCE_MAP_MISSING_SOURCE` {#err_source_map_missing_source}

Файл, импортированный из карты исходного кода, не найден.

### `ERR_SQLITE_ERROR` {#err_sqlite_error}

**Добавлено в: v22.5.0**

Из [SQLite](/ru/nodejs/api/sqlite) возвращена ошибка.

### `ERR_SRI_PARSE` {#err_sri_parse}

Была предоставлена строка для проверки целостности подресурсов (SRI), но ее не удалось проанализировать. Проверьте формат атрибутов целостности, обратившись к [спецификации целостности подресурсов](https://www.w3.org/TR/SRI/#the-integrity-attribute).

### `ERR_STREAM_ALREADY_FINISHED` {#err_stream_already_finished}

Был вызван метод потока, который не может быть завершен, поскольку поток был завершен.

### `ERR_STREAM_CANNOT_PIPE` {#err_stream_cannot_pipe}

Была предпринята попытка вызвать [`stream.pipe()`](/ru/nodejs/api/stream#readablepipedestination-options) для потока [`Writable`](/ru/nodejs/api/stream#class-streamwritable).

### `ERR_STREAM_DESTROYED` {#err_stream_destroyed}

Был вызван метод потока, который не может быть завершен, поскольку поток был уничтожен с помощью `stream.destroy()`.

### `ERR_STREAM_NULL_VALUES` {#err_stream_null_values}

Была предпринята попытка вызвать [`stream.write()`](/ru/nodejs/api/stream#writablewritechunk-encoding-callback) с фрагментом `null`.

### `ERR_STREAM_PREMATURE_CLOSE` {#err_stream_premature_close}

Ошибка, возвращаемая `stream.finished()` и `stream.pipeline()`, когда поток или конвейер завершается некорректно без явной ошибки.

### `ERR_STREAM_PUSH_AFTER_EOF` {#err_stream_push_after_eof}

Была предпринята попытка вызвать [`stream.push()`](/ru/nodejs/api/stream#readablepushchunk-encoding) после того, как в поток был помещен `null` (EOF).

### `ERR_STREAM_UNABLE_TO_PIPE` {#err_stream_unable_to_pipe}

Была предпринята попытка передать данные в закрытый или уничтоженный поток в конвейере.

### `ERR_STREAM_UNSHIFT_AFTER_END_EVENT` {#err_stream_unshift_after_end_event}

Была предпринята попытка вызвать [`stream.unshift()`](/ru/nodejs/api/stream#readableunshiftchunk-encoding) после того, как было испущено событие `'end'`.

### `ERR_STREAM_WRAP` {#err_stream_wrap}

Предотвращает прерывание, если для сокета был установлен декодер строк или если декодер находится в `objectMode`.

```js [ESM]
const Socket = require('node:net').Socket;
const instance = new Socket();

instance.setEncoding('utf8');
```

### `ERR_STREAM_WRITE_AFTER_END` {#err_stream_write_after_end}

Была предпринята попытка вызвать [`stream.write()`](/ru/nodejs/api/stream#writablewritechunk-encoding-callback) после вызова `stream.end()`.

### `ERR_STRING_TOO_LONG` {#err_string_too_long}

Была предпринята попытка создать строку, длина которой превышает максимально допустимую.

### `ERR_SYNTHETIC` {#err_synthetic}

Искусственный объект ошибки, используемый для захвата стека вызовов для диагностических отчетов.

### `ERR_SYSTEM_ERROR` {#err_system_error}

В процессе Node.js произошла неопределенная или неспецифическая системная ошибка. Объект ошибки будет иметь свойство объекта `err.info` с дополнительными сведениями.

### `ERR_TAP_LEXER_ERROR` {#err_tap_lexer_error}

Ошибка, представляющая неудачное состояние лексера.

### `ERR_TAP_PARSER_ERROR` {#err_tap_parser_error}

Ошибка, представляющая неудачное состояние парсера. Дополнительная информация о токене, вызвавшем ошибку, доступна через свойство `cause`.

### `ERR_TAP_VALIDATION_ERROR` {#err_tap_validation_error}

Эта ошибка представляет собой неудачную проверку TAP.

### `ERR_TEST_FAILURE` {#err_test_failure}

Эта ошибка представляет собой неудачный тест. Дополнительная информация о сбое доступна через свойство `cause`. Свойство `failureType` указывает, что делал тест, когда произошел сбой.

### `ERR_TLS_ALPN_CALLBACK_INVALID_RESULT` {#err_tls_alpn_callback_invalid_result}

Эта ошибка возникает, когда `ALPNCallback` возвращает значение, которого нет в списке протоколов ALPN, предлагаемых клиентом.

### `ERR_TLS_ALPN_CALLBACK_WITH_PROTOCOLS` {#err_tls_alpn_callback_with_protocols}

Эта ошибка возникает при создании `TLSServer`, если параметры TLS включают как `ALPNProtocols`, так и `ALPNCallback`. Эти параметры взаимоисключают друг друга.

### `ERR_TLS_CERT_ALTNAME_FORMAT` {#err_tls_cert_altname_format}

Эта ошибка возникает в `checkServerIdentity`, если предоставленное пользователем свойство `subjectaltname` нарушает правила кодирования. Объекты сертификатов, созданные самим Node.js, всегда соответствуют правилам кодирования и никогда не вызывают эту ошибку.

### `ERR_TLS_CERT_ALTNAME_INVALID` {#err_tls_cert_altname_invalid}

При использовании TLS имя хоста/IP-адрес узла не соответствуют ни одному из `subjectAltNames` в его сертификате.

### `ERR_TLS_DH_PARAM_SIZE` {#err_tls_dh_param_size}

При использовании TLS параметр, предложенный для протокола согласования ключей Диффи-Хеллмана (`DH`), слишком мал. По умолчанию длина ключа должна быть больше или равна 1024 битам, чтобы избежать уязвимостей, хотя настоятельно рекомендуется использовать 2048 бит или больше для повышения безопасности.


### `ERR_TLS_HANDSHAKE_TIMEOUT` {#err_tls_handshake_timeout}

Превышено время ожидания TLS/SSL рукопожатия. В этом случае сервер также должен прервать соединение.

### `ERR_TLS_INVALID_CONTEXT` {#err_tls_invalid_context}

**Добавлено в: v13.3.0**

Контекст должен быть `SecureContext`.

### `ERR_TLS_INVALID_PROTOCOL_METHOD` {#err_tls_invalid_protocol_method}

Указанный метод `secureProtocol` недействителен. Он либо неизвестен, либо отключен из-за небезопасности.

### `ERR_TLS_INVALID_PROTOCOL_VERSION` {#err_tls_invalid_protocol_version}

Допустимые версии протокола TLS: `'TLSv1'`, `'TLSv1.1'` или `'TLSv1.2'`.

### `ERR_TLS_INVALID_STATE` {#err_tls_invalid_state}

**Добавлено в: v13.10.0, v12.17.0**

TLS сокет должен быть подключен и безопасно установлен. Убедитесь, что событие 'secure' было сгенерировано перед продолжением.

### `ERR_TLS_PROTOCOL_VERSION_CONFLICT` {#err_tls_protocol_version_conflict}

Попытка установить протокол TLS `minVersion` или `maxVersion` конфликтует с попыткой явно установить `secureProtocol`. Используйте один из этих механизмов.

### `ERR_TLS_PSK_SET_IDENTITY_HINT_FAILED` {#err_tls_psk_set_identity_hint_failed}

Не удалось установить подсказку идентификации PSK. Подсказка может быть слишком длинной.

### `ERR_TLS_RENEGOTIATION_DISABLED` {#err_tls_renegotiation_disabled}

Была предпринята попытка повторного согласования TLS на экземпляре сокета с отключенным повторным согласованием.

### `ERR_TLS_REQUIRED_SERVER_NAME` {#err_tls_required_server_name}

При использовании TLS был вызван метод `server.addContext()` без указания имени хоста в первом параметре.

### `ERR_TLS_SESSION_ATTACK` {#err_tls_session_attack}

Обнаружено чрезмерное количество повторных согласований TLS, что является потенциальным вектором для атак типа "отказ в обслуживании".

### `ERR_TLS_SNI_FROM_SERVER` {#err_tls_sni_from_server}

Была предпринята попытка выдать индикацию имени сервера со стороны TLS сокета сервера, что допустимо только со стороны клиента.

### `ERR_TRACE_EVENTS_CATEGORY_REQUIRED` {#err_trace_events_category_required}

Метод `trace_events.createTracing()` требует хотя бы одну категорию событий трассировки.

### `ERR_TRACE_EVENTS_UNAVAILABLE` {#err_trace_events_unavailable}

Модуль `node:trace_events` не может быть загружен, поскольку Node.js был скомпилирован с флагом `--without-v8-platform`.

### `ERR_TRANSFORM_ALREADY_TRANSFORMING` {#err_transform_already_transforming}

`Transform` поток завершился, пока он все еще выполнял преобразование.

### `ERR_TRANSFORM_WITH_LENGTH_0` {#err_transform_with_length_0}

`Transform` поток завершился, но в буфере записи остались данные.


### `ERR_TTY_INIT_FAILED` {#err_tty_init_failed}

Инициализация TTY завершилась неудачей из-за системной ошибки.

### `ERR_UNAVAILABLE_DURING_EXIT` {#err_unavailable_during_exit}

Функция была вызвана в обработчике [`process.on('exit')`](/ru/nodejs/api/process#event-exit), которую не следует вызывать в обработчике [`process.on('exit')`](/ru/nodejs/api/process#event-exit).

### `ERR_UNCAUGHT_EXCEPTION_CAPTURE_ALREADY_SET` {#err_uncaught_exception_capture_already_set}

[`process.setUncaughtExceptionCaptureCallback()`](/ru/nodejs/api/process#processsetuncaughtexceptioncapturecallbackfn) была вызвана дважды, без предварительного сброса обратного вызова в `null`.

Эта ошибка предназначена для предотвращения случайной перезаписи обратного вызова, зарегистрированного из другого модуля.

### `ERR_UNESCAPED_CHARACTERS` {#err_unescaped_characters}

Получена строка, содержащая неэкранированные символы.

### `ERR_UNHANDLED_ERROR` {#err_unhandled_error}

Произошла необработанная ошибка (например, когда [`EventEmitter`](/ru/nodejs/api/events#class-eventemitter) генерирует событие `'error'`, но обработчик `'error'` не зарегистрирован).

### `ERR_UNKNOWN_BUILTIN_MODULE` {#err_unknown_builtin_module}

Используется для идентификации определенного типа внутренней ошибки Node.js, которая обычно не должна вызываться пользовательским кодом. Экземпляры этой ошибки указывают на внутреннюю ошибку в самом бинарном файле Node.js.

### `ERR_UNKNOWN_CREDENTIAL` {#err_unknown_credential}

Передан несуществующий идентификатор группы или пользователя Unix.

### `ERR_UNKNOWN_ENCODING` {#err_unknown_encoding}

В API передан недопустимый или неизвестный параметр кодировки.

### `ERR_UNKNOWN_FILE_EXTENSION` {#err_unknown_file_extension}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Stability: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментальная
:::

Была предпринята попытка загрузить модуль с неизвестным или неподдерживаемым расширением файла.

### `ERR_UNKNOWN_MODULE_FORMAT` {#err_unknown_module_format}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Stability: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментальная
:::

Была предпринята попытка загрузить модуль с неизвестным или неподдерживаемым форматом.

### `ERR_UNKNOWN_SIGNAL` {#err_unknown_signal}

В API, ожидающий допустимый сигнал (например, [`subprocess.kill()`](/ru/nodejs/api/child_process#subprocesskillsignal)), был передан недопустимый или неизвестный сигнал процесса.


### `ERR_UNSUPPORTED_DIR_IMPORT` {#err_unsupported_dir_import}

`import` URL каталога не поддерживается. Вместо этого, [самостоятельно ссылайтесь на пакет, используя его имя](/ru/nodejs/api/packages#self-referencing-a-package-using-its-name) и [определите пользовательский подпуть](/ru/nodejs/api/packages#subpath-exports) в поле [`"exports"`](/ru/nodejs/api/packages#exports) файла [`package.json`](/ru/nodejs/api/packages#nodejs-packagejson-field-definitions).

```js [ESM]
import './'; // не поддерживается
import './index.js'; // поддерживается
import 'package-name'; // поддерживается
```
### `ERR_UNSUPPORTED_ESM_URL_SCHEME` {#err_unsupported_esm_url_scheme}

`import` со схемами URL, отличными от `file` и `data`, не поддерживается.

### `ERR_UNSUPPORTED_NODE_MODULES_TYPE_STRIPPING` {#err_unsupported_node_modules_type_stripping}

**Добавлено в: v22.6.0**

Удаление типов не поддерживается для файлов, находящихся в каталоге `node_modules`.

### `ERR_UNSUPPORTED_RESOLVE_REQUEST` {#err_unsupported_resolve_request}

Была предпринята попытка разрешить недействительный ссылающийся модуль. Это может произойти при импорте или вызове `import.meta.resolve()` с:

- простым спецификатором, который не является встроенным модулем из модуля, схема URL которого не является `file`.
- [относительным URL](https://url.spec.whatwg.org/#relative-url-string) из модуля, схема URL которого не является [специальной схемой](https://url.spec.whatwg.org/#special-scheme).

```js [ESM]
try {
  // Попытка импортировать пакет 'bare-specifier' из модуля `data:` URL:
  await import('data:text/javascript,import "bare-specifier"');
} catch (e) {
  console.log(e.code); // ERR_UNSUPPORTED_RESOLVE_REQUEST
}
```
### `ERR_USE_AFTER_CLOSE` {#err_use_after_close}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index) - Экспериментально
:::

Была предпринята попытка использовать что-то, что уже было закрыто.

### `ERR_VALID_PERFORMANCE_ENTRY_TYPE` {#err_valid_performance_entry_type}

При использовании API Performance Timing (`perf_hooks`) не найдены действительные типы записей производительности.

### `ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING` {#err_vm_dynamic_import_callback_missing}

Не указана функция обратного вызова для динамического импорта.

### `ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG` {#err_vm_dynamic_import_callback_missing_flag}

Вызвана функция обратного вызова для динамического импорта без `--experimental-vm-modules`.


### `ERR_VM_MODULE_ALREADY_LINKED` {#err_vm_module_already_linked}

Модуль, который попытались связать, не может быть связан по одной из следующих причин:

- Он уже был связан (`linkingStatus` имеет значение `'linked'`)
- Он связывается (`linkingStatus` имеет значение `'linking'`)
- Связывание этого модуля завершилось неудачей (`linkingStatus` имеет значение `'errored'`)

### `ERR_VM_MODULE_CACHED_DATA_REJECTED` {#err_vm_module_cached_data_rejected}

Опция `cachedData`, переданная конструктору модуля, недействительна.

### `ERR_VM_MODULE_CANNOT_CREATE_CACHED_DATA` {#err_vm_module_cannot_create_cached_data}

Кэшированные данные не могут быть созданы для модулей, которые уже были оценены.

### `ERR_VM_MODULE_DIFFERENT_CONTEXT` {#err_vm_module_different_context}

Модуль, возвращаемый из функции линковщика, находится в другом контексте, чем родительский модуль. Связанные модули должны разделять один и тот же контекст.

### `ERR_VM_MODULE_LINK_FAILURE` {#err_vm_module_link_failure}

Модуль не удалось связать из-за сбоя.

### `ERR_VM_MODULE_NOT_MODULE` {#err_vm_module_not_module}

Возвращенное значение промиса связывания не является объектом `vm.Module`.

### `ERR_VM_MODULE_STATUS` {#err_vm_module_status}

Текущий статус модуля не допускает эту операцию. Конкретное значение ошибки зависит от конкретной функции.

### `ERR_WASI_ALREADY_STARTED` {#err_wasi_already_started}

Экземпляр WASI уже запущен.

### `ERR_WASI_NOT_STARTED` {#err_wasi_not_started}

Экземпляр WASI не был запущен.

### `ERR_WEBASSEMBLY_RESPONSE` {#err_webassembly_response}

**Добавлено в: v18.1.0**

`Response`, который был передан в `WebAssembly.compileStreaming` или `WebAssembly.instantiateStreaming`, не является допустимым ответом WebAssembly.

### `ERR_WORKER_INIT_FAILED` {#err_worker_init_failed}

Инициализация `Worker` не удалась.

### `ERR_WORKER_INVALID_EXEC_ARGV` {#err_worker_invalid_exec_argv}

Опция `execArgv`, переданная конструктору `Worker`, содержит недопустимые флаги.

### `ERR_WORKER_MESSAGING_ERRORED` {#err_worker_messaging_errored}

**Добавлено в: v22.5.0**

::: warning [Стабильно: 1 - Экспериментально]
[Стабильно: 1](/ru/nodejs/api/documentation#stability-index) [Стабильность: 1](/ru/nodejs/api/documentation#stability-index).1 - Активная разработка
:::

Целевой поток выдал ошибку при обработке сообщения, отправленного через [`postMessageToThread()`](/ru/nodejs/api/worker_threads#workerpostmessagetothreadthreadid-value-transferlist-timeout).


### `ERR_WORKER_MESSAGING_FAILED` {#err_worker_messaging_failed}

**Добавлено в: v22.5.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Стабильно: 1](/ru/nodejs/api/documentation#stability-index).1 - Активная разработка
:::

Поток, запрошенный в [`postMessageToThread()`](/ru/nodejs/api/worker_threads#workerpostmessagetothreadthreadid-value-transferlist-timeout), недействителен или не имеет прослушивателя `workerMessage`.

### `ERR_WORKER_MESSAGING_SAME_THREAD` {#err_worker_messaging_same_thread}

**Добавлено в: v22.5.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Стабильно: 1](/ru/nodejs/api/documentation#stability-index).1 - Активная разработка
:::

Идентификатор потока, запрошенный в [`postMessageToThread()`](/ru/nodejs/api/worker_threads#workerpostmessagetothreadthreadid-value-transferlist-timeout), является идентификатором текущего потока.

### `ERR_WORKER_MESSAGING_TIMEOUT` {#err_worker_messaging_timeout}

**Добавлено в: v22.5.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/ru/nodejs/api/documentation#stability-index) [Стабильно: 1](/ru/nodejs/api/documentation#stability-index).1 - Активная разработка
:::

Отправка сообщения через [`postMessageToThread()`](/ru/nodejs/api/worker_threads#workerpostmessagetothreadthreadid-value-transferlist-timeout) превысила время ожидания.

### `ERR_WORKER_NOT_RUNNING` {#err_worker_not_running}

Операция не удалась, поскольку экземпляр `Worker` в настоящее время не запущен.

### `ERR_WORKER_OUT_OF_MEMORY` {#err_worker_out_of_memory}

Экземпляр `Worker` завершился, поскольку достиг предела своей памяти.

### `ERR_WORKER_PATH` {#err_worker_path}

Путь для основного скрипта воркера не является ни абсолютным путем, ни относительным путем, начинающимся с `./` или `../`.

### `ERR_WORKER_UNSERIALIZABLE_ERROR` {#err_worker_unserializable_error}

Все попытки сериализации необработанного исключения из потока воркера не удались.

### `ERR_WORKER_UNSUPPORTED_OPERATION` {#err_worker_unsupported_operation}

Запрошенная функциональность не поддерживается в потоках воркеров.

### `ERR_ZLIB_INITIALIZATION_FAILED` {#err_zlib_initialization_failed}

Создание объекта [`zlib`](/ru/nodejs/api/zlib) не удалось из-за неправильной конфигурации.

### `HPE_CHUNK_EXTENSIONS_OVERFLOW` {#hpe_chunk_extensions_overflow}

**Добавлено в: v21.6.2, v20.11.1, v18.19.1**

Было получено слишком много данных для расширений чанка. Чтобы защититься от вредоносных или неправильно настроенных клиентов, если получено более 16 КиБ данных, будет выдана `Error` с этим кодом.


### `HPE_HEADER_OVERFLOW` {#hpe_header_overflow}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v11.4.0, v10.15.0 | Максимальный размер заголовка в `http_parser` был установлен в 8 КиБ. |
:::

Было получено слишком много данных заголовка HTTP. Чтобы защититься от злонамеренных или неправильно настроенных клиентов, если получено более `maxHeaderSize` данных заголовка HTTP, анализ HTTP будет прерван без создания объекта запроса или ответа, и будет выдана `Error` с этим кодом.

### `HPE_UNEXPECTED_CONTENT_LENGTH` {#hpe_unexpected_content_length}

Сервер отправляет как заголовок `Content-Length`, так и `Transfer-Encoding: chunked`.

`Transfer-Encoding: chunked` позволяет серверу поддерживать постоянное HTTP-соединение для динамически генерируемого контента. В этом случае HTTP-заголовок `Content-Length` не может быть использован.

Используйте `Content-Length` или `Transfer-Encoding: chunked`.

### `MODULE_NOT_FOUND` {#module_not_found}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v12.0.0 | Добавлено свойство `requireStack`. |
:::

Файл модуля не удалось разрешить загрузчиком модулей CommonJS при попытке операции [`require()`](/ru/nodejs/api/modules#requireid) или при загрузке точки входа программы.

## Устаревшие коды ошибок Node.js {#legacy-nodejs-error-codes}

::: danger [Стабильно: 0 - Устарело]
[Стабильно: 0](/ru/nodejs/api/documentation#stability-index) [Стабильность: 0](/ru/nodejs/api/documentation#stability-index) - Устарело. Эти коды ошибок либо несовместимы, либо были удалены.
:::

### `ERR_CANNOT_TRANSFER_OBJECT` {#err_cannot_transfer_object}

**Добавлено в: v10.5.0**

**Удалено в: v12.5.0**

Значение, переданное в `postMessage()`, содержало объект, который не поддерживается для передачи.

### `ERR_CPU_USAGE` {#err_cpu_usage}

**Удалено в: v15.0.0**

Нативный вызов из `process.cpuUsage` не удалось обработать.

### `ERR_CRYPTO_HASH_DIGEST_NO_UTF16` {#err_crypto_hash_digest_no_utf16}

**Добавлено в: v9.0.0**

**Удалено в: v12.12.0**

Кодировка UTF-16 использовалась с [`hash.digest()`](/ru/nodejs/api/crypto#hashdigestencoding). Хотя метод `hash.digest()` действительно позволяет передавать аргумент `encoding`, в результате чего метод возвращает строку, а не `Buffer`, кодировка UTF-16 (например, `ucs` или `utf16le`) не поддерживается.


### `ERR_CRYPTO_SCRYPT_INVALID_PARAMETER` {#err_crypto_scrypt_invalid_parameter}

**Удалено в: v23.0.0**

В [`crypto.scrypt()`](/ru/nodejs/api/crypto#cryptoscryptpassword-salt-keylen-options-callback) или [`crypto.scryptSync()`](/ru/nodejs/api/crypto#cryptoscryptsyncpassword-salt-keylen-options) передан несовместимый набор параметров. Новые версии Node.js используют код ошибки [`ERR_INCOMPATIBLE_OPTION_PAIR`](/ru/nodejs/api/errors#err_incompatible_option_pair) вместо этого, что соответствует другим API.

### `ERR_FS_INVALID_SYMLINK_TYPE` {#err_fs_invalid_symlink_type}

**Удалено в: v23.0.0**

В методы [`fs.symlink()`](/ru/nodejs/api/fs#fssymlinktarget-path-type-callback) или [`fs.symlinkSync()`](/ru/nodejs/api/fs#fssymlinksynctarget-path-type) передан неверный тип символической ссылки.

### `ERR_HTTP2_FRAME_ERROR` {#err_http2_frame_error}

**Добавлено в: v9.0.0**

**Удалено в: v10.0.0**

Используется при возникновении ошибки при отправке отдельного фрейма в сессии HTTP/2.

### `ERR_HTTP2_HEADERS_OBJECT` {#err_http2_headers_object}

**Добавлено в: v9.0.0**

**Удалено в: v10.0.0**

Используется, когда ожидается объект заголовков HTTP/2.

### `ERR_HTTP2_HEADER_REQUIRED` {#err_http2_header_required}

**Добавлено в: v9.0.0**

**Удалено в: v10.0.0**

Используется, когда в сообщении HTTP/2 отсутствует обязательный заголовок.

### `ERR_HTTP2_INFO_HEADERS_AFTER_RESPOND` {#err_http2_info_headers_after_respond}

**Добавлено в: v9.0.0**

**Удалено в: v10.0.0**

Информационные заголовки HTTP/2 должны отправляться только *до* вызова метода `Http2Stream.prototype.respond()`.

### `ERR_HTTP2_STREAM_CLOSED` {#err_http2_stream_closed}

**Добавлено в: v9.0.0**

**Удалено в: v10.0.0**

Используется, когда действие выполнено над потоком HTTP/2, который уже был закрыт.

### `ERR_HTTP_INVALID_CHAR` {#err_http_invalid_char}

**Добавлено в: v9.0.0**

**Удалено в: v10.0.0**

Используется, когда недопустимый символ найден в сообщении о статусе ответа HTTP (фразе причины).

### `ERR_IMPORT_ASSERTION_TYPE_FAILED` {#err_import_assertion_type_failed}

**Добавлено в: v17.1.0, v16.14.0**

**Удалено в: v21.1.0**

Проверка импорта не пройдена, что препятствует импорту указанного модуля.

### `ERR_IMPORT_ASSERTION_TYPE_MISSING` {#err_import_assertion_type_missing}

**Добавлено в: v17.1.0, v16.14.0**

**Удалено в: v21.1.0**

Отсутствует утверждение импорта, что препятствует импорту указанного модуля.


### `ERR_IMPORT_ASSERTION_TYPE_UNSUPPORTED` {#err_import_assertion_type_unsupported}

**Добавлено в: v17.1.0, v16.14.0**

**Удалено в: v21.1.0**

Атрибут импорта не поддерживается этой версией Node.js.

### `ERR_INDEX_OUT_OF_RANGE` {#err_index_out_of_range}

**Добавлено в: v10.0.0**

**Удалено в: v11.0.0**

Данный индекс вышел за пределы допустимого диапазона (например, отрицательные смещения).

### `ERR_INVALID_OPT_VALUE` {#err_invalid_opt_value}

**Добавлено в: v8.0.0**

**Удалено в: v15.0.0**

В объект параметров было передано недопустимое или неожиданное значение.

### `ERR_INVALID_OPT_VALUE_ENCODING` {#err_invalid_opt_value_encoding}

**Добавлено в: v9.0.0**

**Удалено в: v15.0.0**

Была передана недопустимая или неизвестная кодировка файла.

### `ERR_INVALID_PERFORMANCE_MARK` {#err_invalid_performance_mark}

**Добавлено в: v8.5.0**

**Удалено в: v16.7.0**

При использовании Performance Timing API (`perf_hooks`) метка производительности недействительна.

### `ERR_INVALID_TRANSFER_OBJECT` {#err_invalid_transfer_object}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v21.0.0 | Вместо этого выбрасывается `DOMException`. |
| v21.0.0 | Удалено в: v21.0.0 |
:::

Недопустимый объект передачи был передан в `postMessage()`.

### `ERR_MANIFEST_ASSERT_INTEGRITY` {#err_manifest_assert_integrity}

**Удалено в: v22.2.0**

Была предпринята попытка загрузить ресурс, но ресурс не соответствовал целостности, определенной манифестом политики. Дополнительные сведения см. в документации по манифестам политики.

### `ERR_MANIFEST_DEPENDENCY_MISSING` {#err_manifest_dependency_missing}

**Удалено в: v22.2.0**

Была предпринята попытка загрузить ресурс, но ресурс не был указан в качестве зависимости из места, которое пыталось его загрузить. Дополнительные сведения см. в документации по манифестам политики.

### `ERR_MANIFEST_INTEGRITY_MISMATCH` {#err_manifest_integrity_mismatch}

**Удалено в: v22.2.0**

Была предпринята попытка загрузить манифест политики, но в манифесте было несколько записей для ресурса, которые не совпадали друг с другом. Обновите записи манифеста, чтобы они соответствовали, чтобы устранить эту ошибку. Дополнительные сведения см. в документации по манифестам политики.

### `ERR_MANIFEST_INVALID_RESOURCE_FIELD` {#err_manifest_invalid_resource_field}

**Удалено в: v22.2.0**

Ресурс манифеста политики имел недопустимое значение для одного из своих полей. Обновите запись манифеста, чтобы она соответствовала, чтобы устранить эту ошибку. Дополнительные сведения см. в документации по манифестам политики.


### `ERR_MANIFEST_INVALID_SPECIFIER` {#err_manifest_invalid_specifier}

**Removed in: v22.2.0**

Ресурс манифеста политики имел неверное значение для одного из своих сопоставлений зависимостей. Обновите запись манифеста, чтобы исправить эту ошибку. Дополнительную информацию смотрите в документации по манифестам политики.

### `ERR_MANIFEST_PARSE_POLICY` {#err_manifest_parse_policy}

**Removed in: v22.2.0**

Была предпринята попытка загрузить манифест политики, но манифест не удалось разобрать. Дополнительную информацию смотрите в документации по манифестам политики.

### `ERR_MANIFEST_TDZ` {#err_manifest_tdz}

**Removed in: v22.2.0**

Была предпринята попытка чтения из манифеста политики, но инициализация манифеста еще не произошла. Скорее всего, это ошибка в Node.js.

### `ERR_MANIFEST_UNKNOWN_ONERROR` {#err_manifest_unknown_onerror}

**Removed in: v22.2.0**

Был загружен манифест политики, но он имел неизвестное значение для своего поведения "onerror". Дополнительную информацию смотрите в документации по манифестам политики.

### `ERR_MISSING_MESSAGE_PORT_IN_TRANSFER_LIST` {#err_missing_message_port_in_transfer_list}

**Removed in: v15.0.0**

Этот код ошибки был заменен на [`ERR_MISSING_TRANSFERABLE_IN_TRANSFER_LIST`](/ru/nodejs/api/errors#err_missing_transferable_in_transfer_list) в Node.js v15.0.0, поскольку он больше не является точным, так как теперь существуют и другие типы передаваемых объектов.

### `ERR_MISSING_TRANSFERABLE_IN_TRANSFER_LIST` {#err_missing_transferable_in_transfer_list}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v21.0.0 | Вместо этого выбрасывается `DOMException`. |
| v21.0.0 | Removed in: v21.0.0 |
| v15.0.0 | Added in: v15.0.0 |
:::

Объект, который необходимо явно указать в аргументе `transferList`, находится в объекте, переданном в вызов [`postMessage()`](/ru/nodejs/api/worker_threads#portpostmessagevalue-transferlist), но не указан в `transferList` для этого вызова. Обычно это `MessagePort`.

В версиях Node.js до v15.0.0 здесь использовался код ошибки [`ERR_MISSING_MESSAGE_PORT_IN_TRANSFER_LIST`](/ru/nodejs/api/errors#err_missing_message_port_in_transfer_list). Однако набор типов передаваемых объектов был расширен и охватывает больше типов, чем `MessagePort`.

### `ERR_NAPI_CONS_PROTOTYPE_OBJECT` {#err_napi_cons_prototype_object}

**Added in: v9.0.0**

**Removed in: v10.0.0**

Используется `Node-API`, когда `Constructor.prototype` не является объектом.


### `ERR_NAPI_TSFN_START_IDLE_LOOP` {#err_napi_tsfn_start_idle_loop}

**Добавлено в: v10.6.0, v8.16.0**

**Удалено в: v14.2.0, v12.17.0**

В основном потоке значения удаляются из очереди, связанной с потокобезопасной функцией, в цикле ожидания. Эта ошибка указывает на то, что произошла ошибка при попытке запустить цикл.

### `ERR_NAPI_TSFN_STOP_IDLE_LOOP` {#err_napi_tsfn_stop_idle_loop}

**Добавлено в: v10.6.0, v8.16.0**

**Удалено в: v14.2.0, v12.17.0**

Как только в очереди не остается элементов, цикл ожидания должен быть приостановлен. Эта ошибка указывает на то, что не удалось остановить цикл ожидания.

### `ERR_NO_LONGER_SUPPORTED` {#err_no_longer_supported}

Вызван API Node.js неподдерживаемым образом, например, `Buffer.write(string, encoding, offset[, length])`.

### `ERR_OUTOFMEMORY` {#err_outofmemory}

**Добавлено в: v9.0.0**

**Удалено в: v10.0.0**

Используется в общем смысле для обозначения того, что операция вызвала нехватку памяти.

### `ERR_PARSE_HISTORY_DATA` {#err_parse_history_data}

**Добавлено в: v9.0.0**

**Удалено в: v10.0.0**

Модуль `node:repl` не смог разобрать данные из файла истории REPL.

### `ERR_SOCKET_CANNOT_SEND` {#err_socket_cannot_send}

**Добавлено в: v9.0.0**

**Удалено в: v14.0.0**

Данные не могут быть отправлены через сокет.

### `ERR_STDERR_CLOSE` {#err_stderr_close}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v10.12.0 | Вместо выдачи ошибки `process.stderr.end()` теперь закрывает только сторону потока, но не базовый ресурс, что делает эту ошибку устаревшей. |
| v10.12.0 | Удалено в: v10.12.0 |
:::

Была предпринята попытка закрыть поток `process.stderr`. По замыслу, Node.js не позволяет пользовательскому коду закрывать потоки `stdout` или `stderr`.

### `ERR_STDOUT_CLOSE` {#err_stdout_close}


::: info [История]
| Версия | Изменения |
| --- | --- |
| v10.12.0 | Вместо выдачи ошибки `process.stderr.end()` теперь закрывает только сторону потока, но не базовый ресурс, что делает эту ошибку устаревшей. |
| v10.12.0 | Удалено в: v10.12.0 |
:::

Была предпринята попытка закрыть поток `process.stdout`. По замыслу, Node.js не позволяет пользовательскому коду закрывать потоки `stdout` или `stderr`.

### `ERR_STREAM_READ_NOT_IMPLEMENTED` {#err_stream_read_not_implemented}

**Добавлено в: v9.0.0**

**Удалено в: v10.0.0**

Используется, когда делается попытка использовать читаемый поток, в котором не реализован [`readable._read()`](/ru/nodejs/api/stream#readable_readsize).


### `ERR_TLS_RENEGOTIATION_FAILED` {#err_tls_renegotiation_failed}

**Добавлено в: v9.0.0**

**Удалено в: v10.0.0**

Используется, когда запрос на повторное согласование TLS не удался неспецифическим образом.

### `ERR_TRANSFERRING_EXTERNALIZED_SHAREDARRAYBUFFER` {#err_transferring_externalized_sharedarraybuffer}

**Добавлено в: v10.5.0**

**Удалено в: v14.0.0**

Во время сериализации был обнаружен `SharedArrayBuffer`, память которого не управляется ни движком JavaScript, ни Node.js. Такой `SharedArrayBuffer` не может быть сериализован.

Это может произойти только в том случае, если собственные дополнения создают `SharedArrayBuffer` в "externalized" режиме или переводят существующий `SharedArrayBuffer` в externalized режим.

### `ERR_UNKNOWN_STDIN_TYPE` {#err_unknown_stdin_type}

**Добавлено в: v8.0.0**

**Удалено в: v11.7.0**

Была предпринята попытка запустить процесс Node.js с неизвестным типом файла `stdin`. Эта ошибка обычно указывает на ошибку в самом Node.js, хотя ее может вызвать и пользовательский код.

### `ERR_UNKNOWN_STREAM_TYPE` {#err_unknown_stream_type}

**Добавлено в: v8.0.0**

**Удалено в: v11.7.0**

Была предпринята попытка запустить процесс Node.js с неизвестным типом файла `stdout` или `stderr`. Эта ошибка обычно указывает на ошибку в самом Node.js, хотя ее может вызвать и пользовательский код.

### `ERR_V8BREAKITERATOR` {#err_v8breakiterator}

Использовался API V8 `BreakIterator`, но полный набор данных ICU не установлен.

### `ERR_VALUE_OUT_OF_RANGE` {#err_value_out_of_range}

**Добавлено в: v9.0.0**

**Удалено в: v10.0.0**

Используется, когда заданное значение выходит за пределы допустимого диапазона.

### `ERR_VM_MODULE_LINKING_ERRORED` {#err_vm_module_linking_errored}

**Добавлено в: v10.0.0**

**Удалено в: v18.1.0, v16.17.0**

Функция компоновщика вернула модуль, для которого компоновка не удалась.

### `ERR_VM_MODULE_NOT_LINKED` {#err_vm_module_not_linked}

Модуль должен быть успешно скомпонован перед созданием экземпляра.

### `ERR_WORKER_UNSUPPORTED_EXTENSION` {#err_worker_unsupported_extension}

**Добавлено в: v11.0.0**

**Удалено в: v16.9.0**

Имя пути, используемое для основного скрипта рабочего процесса, имеет неизвестное расширение файла.

### `ERR_ZLIB_BINDING_CLOSED` {#err_zlib_binding_closed}

**Добавлено в: v9.0.0**

**Удалено в: v10.0.0**

Используется при попытке использовать объект `zlib` после того, как он уже был закрыт.


## Коды ошибок OpenSSL {#openssl-error-codes}

### Ошибки действительности времени {#time-validity-errors}

#### `CERT_NOT_YET_VALID` {#cert_not_yet_valid}

Сертификат еще не действителен: дата notBefore позже текущего времени.

#### `CERT_HAS_EXPIRED` {#cert_has_expired}

Срок действия сертификата истек: дата notAfter раньше текущего времени.

#### `CRL_NOT_YET_VALID` {#crl_not_yet_valid}

Список отзыва сертификатов (CRL) имеет дату выпуска в будущем.

#### `CRL_HAS_EXPIRED` {#crl_has_expired}

Срок действия списка отзыва сертификатов (CRL) истек.

#### `CERT_REVOKED` {#cert_revoked}

Сертификат был отозван; он находится в списке отзыва сертификатов (CRL).

### Ошибки, связанные с доверием или цепочкой {#trust-or-chain-related-errors}

#### `UNABLE_TO_GET_ISSUER_CERT` {#unable_to_get_issuer_cert}

Не удалось найти сертификат издателя для найденного сертификата. Обычно это означает, что список доверенных сертификатов не полон.

#### `UNABLE_TO_GET_ISSUER_CERT_LOCALLY` {#unable_to_get_issuer_cert_locally}

Издатель сертификата неизвестен. Это происходит, если издатель не включен в список доверенных сертификатов.

#### `DEPTH_ZERO_SELF_SIGNED_CERT` {#depth_zero_self_signed_cert}

Переданный сертификат является самоподписанным, и тот же сертификат не может быть найден в списке доверенных сертификатов.

#### `SELF_SIGNED_CERT_IN_CHAIN` {#self_signed_cert_in_chain}

Издатель сертификата неизвестен. Это происходит, если издатель не включен в список доверенных сертификатов.

#### `CERT_CHAIN_TOO_LONG` {#cert_chain_too_long}

Длина цепочки сертификатов превышает максимальную глубину.

#### `UNABLE_TO_GET_CRL` {#unable_to_get_crl}

Не удалось найти CRL, на который ссылается сертификат.

#### `UNABLE_TO_VERIFY_LEAF_SIGNATURE` {#unable_to_verify_leaf_signature}

Не удалось проверить ни одну подпись, потому что цепочка содержит только один сертификат, и он не является самоподписанным.

#### `CERT_UNTRUSTED` {#cert_untrusted}

Корневой центр сертификации (CA) не помечен как доверенный для указанной цели.

### Основные ошибки расширения {#basic-extension-errors}

#### `INVALID_CA` {#invalid_ca}

Сертификат CA недействителен. Либо это не CA, либо его расширения не соответствуют предоставленной цели.

#### `PATH_LENGTH_EXCEEDED` {#path_length_exceeded}

Параметр pathlength basicConstraints превышен.

### Ошибки, связанные с именем {#name-related-errors}

#### `HOSTNAME_MISMATCH` {#hostname_mismatch}

Сертификат не соответствует предоставленному имени.

### Ошибки использования и политики {#usage-and-policy-errors}


#### `INVALID_PURPOSE` {#invalid_purpose}

Предоставленный сертификат нельзя использовать для указанной цели.

#### `CERT_REJECTED` {#cert_rejected}

Корневой центр сертификации помечен как отклоняющий указанную цель.

### Ошибки форматирования {#formatting-errors}

#### `CERT_SIGNATURE_FAILURE` {#cert_signature_failure}

Недействительная подпись сертификата.

#### `CRL_SIGNATURE_FAILURE` {#crl_signature_failure}

Недействительная подпись списка отзыва сертификатов (CRL).

#### `ERROR_IN_CERT_NOT_BEFORE_FIELD` {#error_in_cert_not_before_field}

Поле notBefore сертификата содержит недействительное время.

#### `ERROR_IN_CERT_NOT_AFTER_FIELD` {#error_in_cert_not_after_field}

Поле notAfter сертификата содержит недействительное время.

#### `ERROR_IN_CRL_LAST_UPDATE_FIELD` {#error_in_crl_last_update_field}

Поле lastUpdate списка CRL содержит недействительное время.

#### `ERROR_IN_CRL_NEXT_UPDATE_FIELD` {#error_in_crl_next_update_field}

Поле nextUpdate списка CRL содержит недействительное время.

#### `UNABLE_TO_DECRYPT_CERT_SIGNATURE` {#unable_to_decrypt_cert_signature}

Не удалось расшифровать подпись сертификата. Это означает, что фактическое значение подписи не удалось определить, а не то, что оно не соответствует ожидаемому значению. Это имеет смысл только для ключей RSA.

#### `UNABLE_TO_DECRYPT_CRL_SIGNATURE` {#unable_to_decrypt_crl_signature}

Не удалось расшифровать подпись списка отзыва сертификатов (CRL): это означает, что фактическое значение подписи не удалось определить, а не то, что оно не соответствует ожидаемому значению.

#### `UNABLE_TO_DECODE_ISSUER_PUBLIC_KEY` {#unable_to_decode_issuer_public_key}

Не удалось прочитать открытый ключ в SubjectPublicKeyInfo сертификата.

### Другие ошибки OpenSSL {#other-openssl-errors}

#### `OUT_OF_MEM` {#out_of_mem}

Произошла ошибка при попытке выделить память. Этого никогда не должно происходить.

