---
title: How to Read Environment Variables in Node.js
description: Learn how to access environment variables in Node.js using the process.env property and .env files.
head:
  - - meta
    - name: og:title
      content: How to Read Environment Variables in Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Learn how to access environment variables in Node.js using the process.env property and .env files.
  - - meta
    - name: twitter:title
      content: How to Read Environment Variables in Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Learn how to access environment variables in Node.js using the process.env property and .env files.
---


# How to read environment variables from Node.js

The process core module of Node.js provides the `env` property which hosts all the environment variables that were set at the moment the process was started.

The below code runs `app.js` and sets `USER_ID` and `USER_KEY`.

```bash
USER_ID=239482 USER_KEY=foobar node app.js
```

That will pass the user `USER_ID` as 239482 and the `USER_KEY` as foobar. This is suitable for testing, however for production, you will probably be configuring some bash scripts to export variables.

::: tip NOTE
`process` does not require a `"require"`, it's automatically available.
:::

Here is an example that accesses the `USER_ID` and `USER_KEY` environment variables, which we set in above code.

```javascript
process.env.USER_ID; // "239482
process.env.USER_KEY; // "foobar
```

In the same way you can access any custom environment variable you set. Node.js 20 introduced experimental [support for.env files](/nodejs/api/cli#env-file-config).

Now, you can use the `--env-file` flag to specify an environment file when running your Node.js application. Here's an example `.env` file and how to access its variables using `process.env`.

```bash
.env file
PORT=3000
```

In your js file

```javascript
process.env.PORT; // 3000
```

Run `app.js` file with environment variables set in `.env` file.

```js
node --env-file=.env app.js
```

This command loads all the environment variables from the `.env` file, making them available to the application on `process.env`. Also, you can pass multiple --env-file arguments. Subsequent files override pre-existing variables defined in previous files.

```bash
node --env-file=.env --env-file=.development.env app.js
```
::: tip NOTE
if the same variable is defined in the environment and in the file, the value from the environment takes precedence.
:::
