---
title: Getting User Input in Node.js
description: Learn how to create interactive Node.js CLI programs using the readline module and Inquirer.js package.
head:
  - - meta
    - name: og:title
      content: Getting User Input in Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Learn how to create interactive Node.js CLI programs using the readline module and Inquirer.js package.
  - - meta
    - name: twitter:title
      content: Getting User Input in Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Learn how to create interactive Node.js CLI programs using the readline module and Inquirer.js package.
---


# Accept input from the command line in Node.js

How to make a Node.js CLI program interactive?

Node.js since version 7 provides the readline module to perform exactly this: get input from a readable stream such as the `process.stdin` stream, which during the execution of a Node.js program is the terminal input, one line at a time.

```javascript
const readline = require('node:readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.question("What's your name?", name => {
    console.log('Hi ' + name + '!');
    rl.close();
});
```

This piece of code asks the user's name, and once the text is entered and the user presses enter, we send a greeting.

The `question()` method shows the first parameter (a question) and waits for the user input. It calls the callback function once enter is pressed.

In this callback function, we close the readline interface.

`readline` offers several other methods, please check them out on the package documentation linked above.

If you need to require a password, it's best not to echo it back, but instead show a * symbol.

The simplest way is to use the readline-sync package which is very similar in terms of the API and handles this out of the box. A more complete and abstract solution is provided by the Inquirer.js package.

You can install it using `npm install inquirer`, and then you can replicate the above code like this:

```javascript
const inquirer = require('inquirer');
const questions = [
    {
        type: 'input',
        name: 'name',
        message: "what's your name?"
    }
];
inquirer.prompt(questions).then(answers => {
    console.log('Hi ' + answers.name + '!');
});
```

`Inquirer.js` lets you do many things like asking multiple choices, having radio buttons, confirmations, and more.

It's worth knowing all the alternatives, especially the built-in ones provided by Node.js, but if you plan to take CLI input to the next level, `Inquirer.js` is an optimal choice.