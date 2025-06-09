---
title: Вывод в командную строку с помощью Node.js
description: Node.js предоставляет модуль консоли с различными методами для взаимодействия с командной строкой, включая журналирование, подсчет, измерение времени и т. д.
head:
  - - meta
    - name: og:title
      content: Вывод в командную строку с помощью Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Node.js предоставляет модуль консоли с различными методами для взаимодействия с командной строкой, включая журналирование, подсчет, измерение времени и т. д.
  - - meta
    - name: twitter:title
      content: Вывод в командную строку с помощью Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Node.js предоставляет модуль консоли с различными методами для взаимодействия с командной строкой, включая журналирование, подсчет, измерение времени и т. д.
---


# Вывод в командную строку с использованием Node.js

Базовый вывод с использованием модуля console
Node.js предоставляет модуль console, который предоставляет множество очень полезных способов взаимодействия с командной строкой. Он в основном такой же, как объект console, который вы находите в браузере.

Самый основной и наиболее используемый метод - `console.log()`, который печатает строку, которую вы ему передаете, в консоль. Если вы передаете объект, он отобразит его как строку.

Вы можете передать несколько переменных в `console.log`, например:
```javascript
const x = 'x';
const y = 'y';
console.log(x, y);
```

Мы также можем форматировать красивые фразы, передавая переменные и спецификатор формата. Например:
```javascript
console.log('У моей %s %d уха', 'кошки', 2);
```

- %s форматирует переменную как строку
- %d форматирует переменную как число
- %i форматирует переменную только как ее целую часть
- %o форматирует переменную как объект
Пример:
```javascript
console.log('%o', Number);
```
## Очистка консоли

`console.clear()` очищает консоль (поведение может зависеть от используемой консоли).

## Подсчет элементов

`console.count()` - удобный метод.
Возьмите этот код:
```javascript
const x = 1;
const y = 2;
const z = 3;
console.count('Значение x равно '+x+' и было проверено..сколько раз?');
console.count('Значение x равно '+x+' и было проверено..сколько раз?');
console.count('Значение y равно '+y+' и было проверено..сколько раз?');
```

Что происходит, так это то, что `console.count()` будет подсчитывать количество раз, когда строка печатается, и печатать счетчик рядом с ней:

Вы можете просто считать яблоки и апельсины:

```javascript
const oranges = ['orange', 'orange'];
const apples = ['just one apple'];
oranges.forEach(fruit => console.count(fruit));
apples.forEach(fruit => console.count(fruit));
```

## Сброс счетчика

Метод `console.countReset()` сбрасывает счетчик, используемый с `console.count()`.

Мы будем использовать пример с яблоками и апельсинами, чтобы продемонстрировать это.

```javascript
const oranges = ['orange', 'orange'];
const apples = ['just one apple'];
oranges.forEach(fruit => console.count(fruit));
apples.forEach(fruit => console.count(fruit));
console.countReset('orange');
oranges.forEach(fruit => console.count(fruit));
```


## Вывод трассировки стека

В некоторых случаях может быть полезно вывести трассировку стека вызовов функции, например, чтобы ответить на вопрос, как вы пришли к этому участку кода?

Это можно сделать с помощью `console.trace()`:

```javascript
const function2 = () => console.trace();
const function1 = () => function2();
function1();
```

Это выведет трассировку стека. Вот что будет выведено, если мы попробуем это в REPL Node.js:

```bash
Trace
at function2 (repl:1:33)
at function1 (rep1:1:25)
at rep1:1:1
at ContextifyScript.Script.xunInThisContext (vm.js:44:33)
at REPLServer.defaultEval(repl.js:239:29)
at bound (domain.js:301:14)
at REPLServer.xunBound [as eval](domain.js:314:12)
at REPLServer.onLine (repl.js:440:10)
at emitone (events.js:120:20)
at REPLServer.emit (events.js:210:7)
```

## Расчет затраченного времени

Вы можете легко рассчитать, сколько времени занимает выполнение функции, используя `time()` и `timeEnd()`.

```javascript
const doSomething = () => console.log('test');
const measureDoingSomething = () => {
    console.time('doSomething()');
    // do something, and measure the time it takes
    doSomething();
    console.timeEnd('doSomething()');
};
measureDoingSomething();
```

### stdout и stderr

Как мы видели, `console.log` отлично подходит для вывода сообщений в консоль. Это то, что называется стандартным выводом, или stdout.

`console.error` выводит данные в поток stderr.

Он не появится в консоли, но появится в журнале ошибок.

## Раскрашивание вывода

Вы можете раскрасить вывод вашего текста в консоли с помощью escape-последовательностей. Escape-последовательность — это набор символов, определяющий цвет.

Пример:

```javascript
console.log('x1b[33ms/x1b[0m', 'hi!');
```

Вы можете попробовать это в REPL Node.js, и он выведет hi! желтым цветом.

Однако это низкоуровневый способ сделать это. Самый простой способ раскрасить вывод в консоль — использовать библиотеку. Chalk — это такая библиотека, и в дополнение к раскрашиванию она также помогает с другими средствами стилизации, такими как выделение текста жирным шрифтом, курсивом или подчеркиванием.

Вы устанавливаете ее с помощью `npm install chalk`, а затем можете использовать:

```javascript
const chalk = require('chalk');
console.log(chalk.yellow('hi!'));
```

Использовать `chalk.yellow` гораздо удобнее, чем пытаться запомнить escape-коды, и код гораздо более читабелен.

Ознакомьтесь с приведенной выше ссылкой на проект, чтобы увидеть больше примеров использования.


## Создание индикатора выполнения

`progress` — отличный пакет для создания индикатора выполнения в консоли. Установите его с помощью `npm install progress`.

Этот фрагмент создает 10-шаговый индикатор выполнения, и каждые 100 мс выполняется один шаг. Когда индикатор завершается, мы очищаем интервал:

```javascript
const ProgressBar = require('progress');
const bar = new ProgressBar(':bar', { total: 10 });
const timer = setInterval(() => {
    bar.tick();
    if (bar.complete) {
        clearInterval(timer);
    }
}, 100);
```

