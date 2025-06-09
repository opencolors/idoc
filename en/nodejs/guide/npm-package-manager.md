---
title: A Comprehensive Guide to npm, the Node.js Package Manager
description: Learn how to use npm to manage dependencies, install and update packages, and run tasks in your Node.js projects.
head:
  - - meta
    - name: og:title
      content: A Comprehensive Guide to npm, the Node.js Package Manager | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Learn how to use npm to manage dependencies, install and update packages, and run tasks in your Node.js projects.
  - - meta
    - name: twitter:title
      content: A Comprehensive Guide to npm, the Node.js Package Manager | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Learn how to use npm to manage dependencies, install and update packages, and run tasks in your Node.js projects.
---


# An introduction to the npm package manager

## Introduction to npm

`npm` is the standard package manager for Node.js.

In September 2022 over 2.1 million packages were reported being listed in the npm registry, making it the biggest single language code repository on Earth, and you can be sure there is a package for (almost!) everything.

It started as a way to download and manage dependencies of Node.js packages, but it has since become a tool used also in frontend JavaScript.

::: tip
`Yarn` and `pnpm` are alternatives to npm cli. You can check them out as well.
:::

## Packages

### Installing all dependencies

You can install all the dependencies listed in your `package.json` file by running:

```bash
npm install
```

it will install everything the project needs, in the `node_modules` folder, creating it if it's not existing already.

### Installing a single package

You can install a single package by running:

```bash
npm install <package-name>
```

Furthermore, since npm 5, this command adds `<package-name>` to the `package.json` file dependencies. Before version 5, you needed to add the flag `--save`.

Often you'll see more flags added to this command:

+ `--save-dev` (or `-D`) which adds the package to the `devDependencies` section of the `package.json` file.
+ `--no-save` which prevents saving the package to the `package.json` file.
+ `--no-optional` which prevents installing optional dependencies.
+ `--save-optional` which adds the package to the `optionalDependencies` section of the `package.json` file.

Shorthands of the flags can also be used:

+ `-S`: `--save`
+ `-D`: `--save-dev`
+ `-O`: `--save-optional`

The difference between devDependencies and dependencies is that the former contains development tools, like a testing library, while the latter is bundled with the app in production.

As for the optionalDependencies the difference is that build failure of the dependency will not cause installation to fail. But it is your program's responsibility to handle the lack of the dependency. Read more about [optional dependencies](https://docs.npmjs.com/cli/v10/using-npm/config#optional).

### Updating packages
Updating is also made easy, by running

```bash
npm update
```

This will update all the dependencies to their latest version.

You can specify a single package to update as well:

```bash
npm update <package-name>
```

### Removing packages

To remove a package, you can run:

```bash
npm uninstall <package-name>
```

### Versioning
In addition to plain downloads, `npm` also manages versioning, so you can specify any specific version of a package, or require a version higher or lower than what you need.

Many times you'll find that a library is only compatible with a major release of another library.

Or a bug in the latest release of a lib, still unfixed, is causing an issue.

Specifying an explicit version of a library also helps to keep everyone on the same exact version of a package, so that the whole team runs the same version until the `package.json` file is updated.

In all those cases, versioning helps a lot, and `npm` follows the [semantic versioning (semver)](https://semver.org/) standard.

You can install a specific version of a package, by running

```bash
npm install <package-name>@<version>
```

You can also install the latest version of a package, by running

```bash
npm install <package-name>@latest
```

### Running Tasks
The package.json file supports a format for specifying command line tasks that can be run by using

```bash
npm run <task-name>
```

For example, if you have a package.json file with the following content:

```json
{
  "scripts": {
    "start": "node index.js",
    "test": "jest"
  }
}
```

It's very common to use this feature to run Webpack:

```json
{
  "scripts": {
    "watch": "webpack --watch --progress --colors --config webpack.conf.js",
    "dev": "webpack --progress --colors --config webpack.conf.js",
    "prod": "NODE_ENV=production webpack -p --config webpack.conf.js"
  }
}
```

So instead of typing those long commands, which are easy to forget or mistype, you can run


```bash
npm run watch
npm run dev
npm run prod
```
