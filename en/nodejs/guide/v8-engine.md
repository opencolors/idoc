---
title: The V8 JavaScript Engine
description: V8 is the JavaScript engine that powers Google Chrome, executing JavaScript code and providing a runtime environment. It's independent of the browser and has enabled the rise of Node.js, powering server-side code and desktop apps.
head:
  - - meta
    - name: og:title
      content: The V8 JavaScript Engine | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: V8 is the JavaScript engine that powers Google Chrome, executing JavaScript code and providing a runtime environment. It's independent of the browser and has enabled the rise of Node.js, powering server-side code and desktop apps.
  - - meta
    - name: twitter:title
      content: The V8 JavaScript Engine | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: V8 is the JavaScript engine that powers Google Chrome, executing JavaScript code and providing a runtime environment. It's independent of the browser and has enabled the rise of Node.js, powering server-side code and desktop apps.
---


# The V8 JavaScript Engine

V8 is the name of the JavaScript engine that powers Google Chrome. It's the thing that takes our JavaScript and executes it while browsing with Chrome.

V8 is the JavaScript engine i.e. it parses and executes JavaScript code. The DOM, and the other Web Platform APIs (they all makeup runtime environment) are provided by the browser.

The cool thing is that the JavaScript engine is independent of the browser in which it's hosted. This key feature enabled the rise of Node.js. V8 was chosen to be the engine that powered Node.js back in 2009, and as the popularity of Node.js exploded, V8 became the engine that now powers an incredible amount of server-side code written in JavaScript.

The Node.js ecosystem is huge and thanks to V8 which also powers desktop apps, with projects like Electron.

## Other JS engines

Other browsers have their own JavaScript engine:

+ `SpiderMonkey` (Firefox)
+ `JavaScriptCore`(also called `Nitro`) (Safari)
+ Edge was originally based on `Chakra` but has more recently been rebuilt using Chromium and the V8 engine.

and many others exist as well.

All those engines implement the [ECMA ES-262 standard](https://www.ecma-international.org/publications-and-standards/standards/ecma-262/), also called ECMAScript, the standard used by JavaScript.

## The quest for performance

V8 is written in C++, and it's continuously improved. It is portable and runs on Mac, Windows, Linux and several other systems.

In this V8 introduction, we will ignore the implementation details of V8: they can be found on more authoritative sites (e.g. the [V8 official site](https://v8.dev/)), and they change over time, often radically.

V8 is always evolving, just like the other JavaScript engines around, to speed up the Web and the Node.js ecosystem.

On the web, there is a race for performance that's been going on for years, and we (as users and developers) benefit a lot from this competition because we get faster and more optimized machines year after year.

## Compilation

JavaScript is generally considered an interpreted language, but modern JavaScript engines no longer just interpret JavaScript, they compile it.

This has been happening since 2009, when the SpiderMonkey JavaScript compiler was added to Firefox 3.5, and everyone followed this idea.

JavaScript is internally compiled by V8 with just-in-time (JIT) compilation to speed up the execution.

This might seem counter-intuitive, but since the introduction of Google Maps in 2004, JavaScript has evolved from a language that was generally executing a few dozens of lines of code to complete applications with thousands to hundreds of thousands of lines running in the browser.

Our applications can now run for hours inside a browser, rather than being just a few form validation rules or simple scripts.

In this new world, compiling JavaScript makes perfect sense because while it might take a little bit more to have the JavaScript ready, once done it's going to be much more performant than purely interpreted code.