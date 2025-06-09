---
title: Live Debugging in Node.js
description: Learn how to live debug a Node.js process to identify and fix issues with application logic and correctness.
head:
  - - meta
    - name: og:title
      content: Live Debugging in Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Learn how to live debug a Node.js process to identify and fix issues with application logic and correctness.
  - - meta
    - name: twitter:title
      content: Live Debugging in Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Learn how to live debug a Node.js process to identify and fix issues with application logic and correctness.
---


# Live Debugging

In this document you can learn about how to live debug a Node.js process.

## My application doesn’t behave as expected

### Symptoms

The user may observe that the application doesn’t provide the expected output for certain inputs, for example, an HTTP server returns a JSON response where certain fields are empty. Various things can go wrong in the process but in this use case, we are mainly focused on the application logic and its correctness.

### Debugging

In this use case, the user would like to understand the code path that our application executes for a certain trigger like an incoming HTTP request. They may also want to step through the code and control the execution as well as inspect what values variables hold in memory. For this purpose, we can use the `--inspect` flag when starting the application. debugging documentions can be found [here](/nodejs/guide/debugging-nodejs).