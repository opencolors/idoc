---
title: Получение пользовательского ввода в Node.js
description: Узнайте, как создавать интерактивные программы CLI Node.js с помощью модуля readline и пакета Inquirer.js.
head:
  - - meta
    - name: og:title
      content: Получение пользовательского ввода в Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Узнайте, как создавать интерактивные программы CLI Node.js с помощью модуля readline и пакета Inquirer.js.
  - - meta
    - name: twitter:title
      content: Получение пользовательского ввода в Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Узнайте, как создавать интерактивные программы CLI Node.js с помощью модуля readline и пакета Inquirer.js.
---


# Прием ввода из командной строки в Node.js

Как сделать программу Node.js CLI интерактивной?

Node.js версии 7 и выше предоставляет модуль readline для выполнения именно этой задачи: получение ввода из читаемого потока, такого как поток `process.stdin`, который во время выполнения программы Node.js является вводом с терминала, построчно.

```javascript
const readline = require('node:readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.question("Как вас зовут?", name => {
    console.log('Привет, ' + name + '!');
    rl.close();
});
```

Этот фрагмент кода запрашивает имя пользователя, и как только текст введен и пользователь нажимает Enter, мы отправляем приветствие.

Метод `question()` показывает первый параметр (вопрос) и ожидает ввода пользователя. Он вызывает функцию обратного вызова после нажатия Enter.

В этой функции обратного вызова мы закрываем интерфейс readline.

`readline` предлагает несколько других методов, пожалуйста, ознакомьтесь с ними в документации по пакету, ссылка на которую приведена выше.

Если вам нужно запросить пароль, лучше не отображать его, а показывать символ *.

Самый простой способ - использовать пакет readline-sync, который очень похож по API и поддерживает это из коробки. Более полное и абстрактное решение предоставляется пакетом Inquirer.js.

Вы можете установить его, используя `npm install inquirer`, а затем вы можете воспроизвести приведенный выше код следующим образом:

```javascript
const inquirer = require('inquirer');
const questions = [
    {
        type: 'input',
        name: 'name',
        message: "Как вас зовут?"
    }
];
inquirer.prompt(questions).then(answers => {
    console.log('Привет, ' + answers.name + '!');
});
```

`Inquirer.js` позволяет выполнять множество действий, таких как выбор нескольких вариантов, наличие радиокнопок, подтверждений и многое другое.

Стоит знать все альтернативы, особенно встроенные, предоставляемые Node.js, но если вы планируете вывести ввод CLI на новый уровень, `Inquirer.js` - оптимальный выбор.

