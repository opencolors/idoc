---
title: Debugging Memory Issues in Node.js
description: Learn how to identify and debug memory-related issues in Node.js applications, including memory leaks and inefficient memory usage.
head:
  - - meta
    - name: og:title
      content: Debugging Memory Issues in Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Learn how to identify and debug memory-related issues in Node.js applications, including memory leaks and inefficient memory usage.
  - - meta
    - name: twitter:title
      content: Debugging Memory Issues in Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Learn how to identify and debug memory-related issues in Node.js applications, including memory leaks and inefficient memory usage.
---

# Memory

In this document you can learn about how to debug memory related issues.

## My process runs out of memory

Node.js (*JavaScript*) is a garbage collected language, so having memory leaks is possible through retainers. As Node.js applications are usually multi-tenant, business critical, and long-running, providing an accessible and efficient way of finding a memory leak is essential.

### Symptoms

The user observes continuously increasing memory usage (*can be fast or slow, over days or even weeks*) then sees the process crashing and restarting by the process manager. The process is maybe running slower than before and the restarts cause some requests to fail (*load balancer responds with 502*).

### Side Effects

- Process restarts due to the memory exhaustion and requests are dropped on the floor
- Increased GC activity leads to higher CPU usage and slower response time
    - GC blocking the Event Loop causing slowness
- Increased memory swapping slows down the process (GC activity)
- May not have enough available memory to get a Heap Snapshot

## My process utilizes memory inefficiently

### Symptoms

The application uses an unexpected amount of memory and/or we observe elevated garbage collector activity.

### Side Effects

- An elevated number of page faults
- Higher GC activity and CPU usage