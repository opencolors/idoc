---
title: Node.js Documentation - Synopsis
description: An overview of Node.js, detailing its asynchronous event-driven architecture, core modules, and how to get started with Node.js development.
head:
  - - meta
    - name: og:title
      content: Node.js Documentation - Synopsis | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: An overview of Node.js, detailing its asynchronous event-driven architecture, core modules, and how to get started with Node.js development.
  - - meta
    - name: twitter:title
      content: Node.js Documentation - Synopsis | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: An overview of Node.js, detailing its asynchronous event-driven architecture, core modules, and how to get started with Node.js development.
---

# Usage and example {#usage-and-example}

## Usage {#usage}

`node [options] [V8 options] [script.js | -e "script" | - ] [arguments]`

Please see the [Command-line options](/nodejs/api/cli#options) document for more information.

## Example {#example}

An example of a [web server](/nodejs/api/http) written with Node.js which responds with `'Hello, World!'`:

Commands in this document start with `$` or `\>` to replicate how they would appear in a user's terminal. Do not include the `$` and `\>` characters. They are there to show the start of each command.

Lines that don't start with `$` or `\>` character show the output of the previous command.

First, make sure to have downloaded and installed Node.js. See [Installing Node.js via package manager](https://nodejs.org/en/download/package-manager/) for further install information.

Now, create an empty project folder called `projects`, then navigate into it.

Linux and Mac:

```bash [BASH]
mkdir ~/projects
cd ~/projects
```
Windows CMD:

```bash [BASH]
mkdir %USERPROFILE%\projects
cd %USERPROFILE%\projects
```
Windows PowerShell:

```bash [BASH]
mkdir $env:USERPROFILE\projects
cd $env:USERPROFILE\projects
```
Next, create a new source file in the `projects` folder and call it `hello-world.js`.

Open `hello-world.js` in any preferred text editor and paste in the following content:

```js [ESM]
const http = require('node:http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World!\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```
Save the file. Then, in the terminal window, to run the `hello-world.js` file, enter:

```bash [BASH]
node hello-world.js
```
Output like this should appear in the terminal:

```bash [BASH]
Server running at http://127.0.0.1:3000/
```
Now, open any preferred web browser and visit `http://127.0.0.1:3000`.

If the browser displays the string `Hello, World!`, that indicates the server is working.

