---
title: Асинхронное управление потоком в JavaScript
description: Понимание асинхронного управления потоком в JavaScript, включая обратные вызовы, управление состоянием и модели управления потоком.
head:
  - - meta
    - name: og:title
      content: Асинхронное управление потоком в JavaScript | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Понимание асинхронного управления потоком в JavaScript, включая обратные вызовы, управление состоянием и модели управления потоком.
  - - meta
    - name: twitter:title
      content: Асинхронное управление потоком в JavaScript | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Понимание асинхронного управления потоком в JavaScript, включая обратные вызовы, управление состоянием и модели управления потоком.
---


# Асинхронное управление потоком

::: info
Материал в этой статье в значительной степени вдохновлен [Книгой Mixu о Node.js](http://book.mixu.net/node/ch7.html).
:::

По своей сути, JavaScript разработан как неблокирующий в "основном" потоке, где отрисовываются представления. Вы можете представить себе важность этого в браузере. Когда основной поток блокируется, это приводит к печально известному "зависанию", которого так боятся конечные пользователи, и никакие другие события не могут быть отправлены, что приводит к потере данных, например.

Это создает некоторые уникальные ограничения, которые можно исправить только с помощью функционального стиля программирования. Именно здесь на сцену выходят обратные вызовы.

Однако обратные вызовы могут стать сложными в более сложных процедурах. Это часто приводит к "аду обратных вызовов", когда несколько вложенных функций с обратными вызовами усложняют чтение, отладку, организацию и т.д. кода.

```js
async1(function (input, result1) {
  async2(function (result2) {
    async3(function (result3) {
      async4(function (result4) {
        async5(function (output) {
          // сделать что-то с output
        });
      });
    });
  });
});
```

Конечно, в реальной жизни, скорее всего, будут дополнительные строки кода для обработки `result1`, `result2` и т.д., поэтому длина и сложность этой проблемы обычно приводят к тому, что код выглядит гораздо более запутанным, чем в примере выше.

**Именно здесь функции приходят на помощь. Более сложные операции состоят из множества функций:**

1. стиль инициатора / ввод
2. промежуточное программное обеспечение (middleware)
3. терминатор

**"Стиль инициатора / ввод" - это первая функция в последовательности. Эта функция принимает исходные входные данные, если таковые имеются, для операции. Операция - это исполняемая серия функций, и исходные входные данные будут в основном:**

1. переменные в глобальной среде
2. прямой вызов с аргументами или без них
3. значения, полученные запросами файловой системы или сети

Сетевые запросы могут быть входящими запросами, инициированными внешней сетью, другим приложением в той же сети или самим приложением в той же или внешней сети.

Функция промежуточного программного обеспечения вернет другую функцию, а функция терминатора вызовет обратный вызов. Следующее иллюстрирует поток запросов к сети или файловой системе. Здесь задержка равна 0, потому что все эти значения доступны в памяти.

```js
function final(someInput, callback) {
  callback(`${someInput} и завершено выполнением обратного вызова `);
}
function middleware(someInput, callback) {
  return final(`${someInput} затронуто промежуточным программным обеспечением `, callback);
}
function initiate() {
  const someInput = 'hello this is a function ';
  middleware(someInput, function (result) {
    console.log(result);
    // требует обратного вызова для `return` результата
  });
}
initiate();
```

## Управление состоянием

Функции могут зависеть или не зависеть от состояния. Зависимость от состояния возникает, когда входные данные или другая переменная функции зависят от внешней функции.

**Таким образом, существуют две основные стратегии управления состоянием:**

1. передача переменных непосредственно в функцию, и
2. получение значения переменной из кэша, сеанса, файла, базы данных, сети или другого внешнего источника.

Обратите внимание, я не упоминал глобальные переменные. Управление состоянием с помощью глобальных переменных часто является неряшливым антипаттерном, который затрудняет или делает невозможным гарантировать состояние. Глобальных переменных в сложных программах следует избегать, когда это возможно.

## Поток управления

Если объект доступен в памяти, итерация возможна, и изменения в потоке управления не будет:

```js
function getSong() {
  let _song = '';
  let i = 100;
  for (i; i > 0; i -= 1) {
    _song += `${i} beers on the wall, you take one down and pass it around, ${
      i - 1
    } bottles of beer on the wall\n`;
    if (i === 1) {
      _song += "Hey let's get some more beer";
    }
  }
  return _song;
}
function singSong(_song) {
  if (!_song) throw new Error("song is '' empty, FEED ME A SONG!");
  console.log(_song);
}
const song = getSong();
// this will work
singSong(song);
```

Однако, если данные существуют вне памяти, итерация больше не будет работать:

```js
function getSong() {
  let _song = '';
  let i = 100;
  for (i; i > 0; i -= 1) {
    /* eslint-disable no-loop-func */
    setTimeout(function () {
      _song += `${i} beers on the wall, you take one down and pass it around, ${
        i - 1
      } bottles of beer on the wall\n`;
      if (i === 1) {
        _song += "Hey let's get some more beer";
      }
    }, 0);
    /* eslint-enable no-loop-func */
  }
  return _song;
}
function singSong(_song) {
  if (!_song) throw new Error("song is '' empty, FEED ME A SONG!");
  console.log(_song);
}
const song = getSong('beer');
// this will not work
singSong(song);
// Uncaught Error: song is '' empty, FEED ME A SONG!
```

Почему это произошло? `setTimeout` инструктирует ЦП сохранить инструкции в другом месте шины и указывает, что данные запланированы для получения позже. Тысячи циклов ЦП проходят, прежде чем функция снова достигнет отметки 0 миллисекунд, ЦП извлекает инструкции из шины и выполняет их. Единственная проблема в том, что song ('') была возвращена за тысячи циклов до этого.

Та же ситуация возникает при работе с файловыми системами и сетевыми запросами. Основной поток просто не может быть заблокирован на неопределенный период времени - поэтому мы используем обратные вызовы для планирования выполнения кода во времени контролируемым образом.

Вы сможете выполнять почти все свои операции со следующими 3 шаблонами:

1. **Последовательно:** функции будут выполняться в строгом последовательном порядке, этот способ наиболее похож на циклы `for`.

```js
// operations defined elsewhere and ready to execute
const operations = [
  { func: function1, args: args1 },
  { func: function2, args: args2 },
  { func: function3, args: args3 },
];
function executeFunctionWithArgs(operation, callback) {
  // executes function
  const { args, func } = operation;
  func(args, callback);
}
function serialProcedure(operation) {
  if (!operation) process.exit(0); // finished
  executeFunctionWithArgs(operation, function (result) {
    // continue AFTER callback
    serialProcedure(operations.shift());
  });
}
serialProcedure(operations.shift());
```

2. `Полностью параллельно`: когда порядок не имеет значения, например, при отправке электронных писем списку из 1 000 000 получателей.

```js
let count = 0;
let success = 0;
const failed = [];
const recipients = [
  { name: 'Bart', email: 'bart@tld' },
  { name: 'Marge', email: 'marge@tld' },
  { name: 'Homer', email: 'homer@tld' },
  { name: 'Lisa', email: 'lisa@tld' },
  { name: 'Maggie', email: 'maggie@tld' },
];
function dispatch(recipient, callback) {
  // `sendEmail` is a hypothetical SMTP client
  sendMail(
    {
      subject: 'Dinner tonight',
      message: 'We have lots of cabbage on the plate. You coming?',
      smtp: recipient.email,
    },
    callback
  );
}
function final(result) {
  console.log(`Result: ${result.count} attempts \
      & ${result.success} succeeded emails`);
  if (result.failed.length)
    console.log(`Failed to send to: \
        \n${result.failed.join('\n')}\n`);
}
recipients.forEach(function (recipient) {
  dispatch(recipient, function (err) {
    if (!err) {
      success += 1;
    } else {
      failed.push(recipient.name);
    }
    count += 1;
    if (count === recipients.length) {
      final({
        count,
        success,
        failed,
      });
    }
  });
});
```

3. **Ограниченно параллельно**: параллельно с ограничением, например, успешная отправка электронных писем 1 000 000 получателей из списка в 10 миллионов пользователей.

```js
let successCount = 0;
function final() {
  console.log(`dispatched ${successCount} emails`);
  console.log('finished');
}
function dispatch(recipient, callback) {
  // `sendEmail` is a hypothetical SMTP client
  sendMail(
    {
      subject: 'Dinner tonight',
      message: 'We have lots of cabbage on the plate. You coming?',
      smtp: recipient.email,
    },
    callback
  );
}
function sendOneMillionEmailsOnly() {
  getListOfTenMillionGreatEmails(function (err, bigList) {
    if (err) throw err;
    function serial(recipient) {
      if (!recipient || successCount >= 1000000) return final();
      dispatch(recipient, function (_err) {
        if (!_err) successCount += 1;
        serial(bigList.pop());
      });
    }
    serial(bigList.pop());
  });
}
sendOneMillionEmailsOnly();
```

У каждого из них есть свои варианты использования, преимущества и проблемы, с которыми вы можете поэкспериментировать и прочитать о них более подробно. Самое главное, не забывайте о модульности ваших операций и используйте обратные вызовы! Если у вас есть какие-либо сомнения, относитесь ко всему, как если бы это было промежуточное программное обеспечение!

