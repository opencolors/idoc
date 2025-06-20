---
title: How to use the Node.js REPL
description: Learn how to use the Node.js REPL to quickly test simple JavaScript code and explore its features, including multi-line mode, special variables, and dot commands.
head:
  - - meta
    - name: og:title
      content: How to use the Node.js REPL | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Learn how to use the Node.js REPL to quickly test simple JavaScript code and explore its features, including multi-line mode, special variables, and dot commands.
  - - meta
    - name: twitter:title
      content: How to use the Node.js REPL | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Learn how to use the Node.js REPL to quickly test simple JavaScript code and explore its features, including multi-line mode, special variables, and dot commands.
---

# How to use the Node.js REPL

The `node` command is the one we use to run our Node.js scripts:

```bash
node script.js
```

If we run the `node` command without any script to execute or without any arguments, we start a REPL session:

```bash
node
```

::: tip NOTE
REPL stands for Read Evaluate Print Loop, and it is a programming language environment (basically a console window) that takes single expression as user input and returns the result back to the console after execution. The REPL session provides a convenient way to quickly test simple JavaScript code.
:::

If you try it now in your terminal, this is what happens:

```bash
> node
>
```

The command stays in idle mode and waits for us to enter something.

::: tip
if you are unsure how to open your terminal, google "How to open terminal on your-operating-system".
:::

The REPL is waiting for us to enter some JavaScript code, to be more precise.

Start simple and enter:

```bash
> console.log('test')
test
undefined
>
```

The first value, `test`, is the output we told the console to print, then we get `undefined` which is the return value of running `console.log()`. Node read this line of code, evaluated it, printed the result, and then went back to waiting for more lines of code. Node will loop through these three steps for every piece of code we execute in the REPL until we exit the session. That is where the REPL got its name.

Node automatically prints the result of any line of JavaScript code without the need to instruct it to do so. For example, type in the following line and press enter:

```bash
> 5==5
false
>
```

Note the difference in the outputs of the above two lines. The Node REPL printed `undefined` after executing `console.log()`, while on the other hand, it just printed the result of `5== '5'`. You need to keep in mind that the former is just a statement in JavaScript, and the latter is an expression.

In some cases, the code you want to test might need multiple lines. For example, say you want to define a function that generates a random number, in the REPL session type in the following line and press enter:

```javascript
function generateRandom()
...
```

The Node REPL is smart enough to determine that you are not done writing your code yet, and it will go into a multi-line mode for you to type in more code. Now finish your function definition and press enter:

```javascript
function generateRandom()
...return Math.random()
```

### The special variable:

If after some code you type `_`, that is going to print the result of the last operation.

### The Up arrow key:

If you press the up arrow key, you will get access to the history of the previous lines of code executed in the current, and even previous REPL sessions.

## Dot commands

The REPL has some special commands, all starting with a dot `.`. They are:
- `.help`: shows the dot commands help.
- `.editor`: enables editor mode, to write multiline JavaScript code with ease. Once you are in this mode, enter `ctrl-D` to run the code you wrote.
- `.break`: when inputting a multi-line expression, entering the `.break` command will abort further input. Same as pressing `ctrl-C`.
- `.clear`: resets the REPL context to an empty object and clears any multi-line expression currently being input.
- `.1oad`: loads a JavaScript file, relative to the current working directory.
- `.save`: saves all you entered in the REPL session to a fille (specify the filename).
- `.exit`: exits the repl (same as pressing `ctrl-C` two times).

The REPL knows when you are typing a multi-line statement without the need to invoke `.editor`. For example if you start typing an iteration like this:
```javascript
[1, 2,3].foxEach(num=>{
```
and you press enter, the REPL will go to a new line that starts with 3 dots, indicating you can now continue to work on that block.
```javascript
1... console.log (num)
2...}
```

If you type `.break` at the end of a line, the multiline mode will stop and the statement will not be executed.

## Run REPL from JavaScript file

We can import the REPL in a JavaScript file using `repl`.
```javascript
const repl = require('node:repl');
```

Using the `repl` variable we can perform various operations. To start the REPL command prompt, type in the following line:
```javascript
repl.start();
```

Run the file in the command line.
```bash
node repl.js
```

You can pass a string which shows when the REPL starts. The default is '>' (with a trailing space), but we can define custom prompt.
```javascript
// a Unix style prompt 
const local = repl.start('$ ');
```

You can display a message while exiting the REPL

```javascript
local.on('exit', () => {
  console.log('exiting repl');
  process.exit();
});
```

You can read more about the REPL module in the [repl documentation](/nodejs/api/repl).