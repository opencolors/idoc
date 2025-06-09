---
title: Node.js Test Runner
description: The Node.js Test Runner module provides a built-in solution for writing and running tests within Node.js applications. It supports various test formats, coverage reporting, and integrates with popular testing frameworks.
head:
  - - meta
    - name: og:title
      content: Node.js Test Runner | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: The Node.js Test Runner module provides a built-in solution for writing and running tests within Node.js applications. It supports various test formats, coverage reporting, and integrates with popular testing frameworks.
  - - meta
    - name: twitter:title
      content: Node.js Test Runner | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: The Node.js Test Runner module provides a built-in solution for writing and running tests within Node.js applications. It supports various test formats, coverage reporting, and integrates with popular testing frameworks.
---

# Test runner {#test-runner}


::: info [History]
| Version | Changes |
| --- | --- |
| v20.0.0 | The test runner is now stable. |
| v18.0.0, v16.17.0 | Added in: v18.0.0, v16.17.0 |
:::

::: tip [Stable: 2 - Stable]
[Stable: 2](/nodejs/api/documentation#stability-index) [Stability: 2](/nodejs/api/documentation#stability-index) - Stable
:::

**Source Code:** [lib/test.js](https://github.com/nodejs/node/blob/v23.8.0/lib/test.js)

The `node:test` module facilitates the creation of JavaScript tests. To access it:



::: code-group
```js [ESM]
import test from 'node:test';
```

```js [CJS]
const test = require('node:test');
```
:::

This module is only available under the `node:` scheme.

Tests created via the `test` module consist of a single function that is processed in one of three ways:

The following example illustrates how tests are written using the `test` module.

```js [ESM]
test('synchronous passing test', (t) => {
  // This test passes because it does not throw an exception.
  assert.strictEqual(1, 1);
});

test('synchronous failing test', (t) => {
  // This test fails because it throws an exception.
  assert.strictEqual(1, 2);
});

test('asynchronous passing test', async (t) => {
  // This test passes because the Promise returned by the async
  // function is settled and not rejected.
  assert.strictEqual(1, 1);
});

test('asynchronous failing test', async (t) => {
  // This test fails because the Promise returned by the async
  // function is rejected.
  assert.strictEqual(1, 2);
});

test('failing test using Promises', (t) => {
  // Promises can be used directly as well.
  return new Promise((resolve, reject) => {
    setImmediate(() => {
      reject(new Error('this will cause the test to fail'));
    });
  });
});

test('callback passing test', (t, done) => {
  // done() is the callback function. When the setImmediate() runs, it invokes
  // done() with no arguments.
  setImmediate(done);
});

test('callback failing test', (t, done) => {
  // When the setImmediate() runs, done() is invoked with an Error object and
  // the test fails.
  setImmediate(() => {
    done(new Error('callback failure'));
  });
});
```
If any tests fail, the process exit code is set to `1`.

## Subtests {#subtests}

The test context's `test()` method allows subtests to be created. It allows you to structure your tests in a hierarchical manner, where you can create nested tests within a larger test. This method behaves identically to the top level `test()` function. The following example demonstrates the creation of a top level test with two subtests.

```js [ESM]
test('top level test', async (t) => {
  await t.test('subtest 1', (t) => {
    assert.strictEqual(1, 1);
  });

  await t.test('subtest 2', (t) => {
    assert.strictEqual(2, 2);
  });
});
```
In this example, `await` is used to ensure that both subtests have completed. This is necessary because tests do not wait for their subtests to complete, unlike tests created within suites. Any subtests that are still outstanding when their parent finishes are cancelled and treated as failures. Any subtest failures cause the parent test to fail.

## Skipping tests {#skipping-tests}

Individual tests can be skipped by passing the `skip` option to the test, or by calling the test context's `skip()` method as shown in the following example.

```js [ESM]
// The skip option is used, but no message is provided.
test('skip option', { skip: true }, (t) => {
  // This code is never executed.
});

// The skip option is used, and a message is provided.
test('skip option with message', { skip: 'this is skipped' }, (t) => {
  // This code is never executed.
});

test('skip() method', (t) => {
  // Make sure to return here as well if the test contains additional logic.
  t.skip();
});

test('skip() method with message', (t) => {
  // Make sure to return here as well if the test contains additional logic.
  t.skip('this is skipped');
});
```
## TODO tests {#todo-tests}

Individual tests can be marked as flaky or incomplete by passing the `todo` option to the test, or by calling the test context's `todo()` method, as shown in the following example. These tests represent a pending implementation or bug that needs to be fixed. TODO tests are executed, but are not treated as test failures, and therefore do not affect the process exit code. If a test is marked as both TODO and skipped, the TODO option is ignored.

```js [ESM]
// The todo option is used, but no message is provided.
test('todo option', { todo: true }, (t) => {
  // This code is executed, but not treated as a failure.
  throw new Error('this does not fail the test');
});

// The todo option is used, and a message is provided.
test('todo option with message', { todo: 'this is a todo test' }, (t) => {
  // This code is executed.
});

test('todo() method', (t) => {
  t.todo();
});

test('todo() method with message', (t) => {
  t.todo('this is a todo test and is not treated as a failure');
  throw new Error('this does not fail the test');
});
```
## `describe()` and `it()` aliases {#describe-and-it-aliases}

Suites and tests can also be written using the `describe()` and `it()` functions. [`describe()`](/nodejs/api/test#describename-options-fn) is an alias for [`suite()`](/nodejs/api/test#suitename-options-fn), and [`it()`](/nodejs/api/test#itname-options-fn) is an alias for [`test()`](/nodejs/api/test#testname-options-fn).

```js [ESM]
describe('A thing', () => {
  it('should work', () => {
    assert.strictEqual(1, 1);
  });

  it('should be ok', () => {
    assert.strictEqual(2, 2);
  });

  describe('a nested thing', () => {
    it('should work', () => {
      assert.strictEqual(3, 3);
    });
  });
});
```
`describe()` and `it()` are imported from the `node:test` module.



::: code-group
```js [ESM]
import { describe, it } from 'node:test';
```

```js [CJS]
const { describe, it } = require('node:test');
```
:::

## `only` tests {#only-tests}

If Node.js is started with the [`--test-only`](/nodejs/api/cli#--test-only) command-line option, or test isolation is disabled, it is possible to skip all tests except for a selected subset by passing the `only` option to the tests that should run. When a test with the `only` option is set, all subtests are also run. If a suite has the `only` option set, all tests within the suite are run, unless it has descendants with the `only` option set, in which case only those tests are run.

When using [subtests](/nodejs/api/test#subtests) within a `test()`/`it()`, it is required to mark all ancestor tests with the `only` option to run only a selected subset of tests.

The test context's `runOnly()` method can be used to implement the same behavior at the subtest level. Tests that are not executed are omitted from the test runner output.

```js [ESM]
// Assume Node.js is run with the --test-only command-line option.
// The suite's 'only' option is set, so these tests are run.
test('this test is run', { only: true }, async (t) => {
  // Within this test, all subtests are run by default.
  await t.test('running subtest');

  // The test context can be updated to run subtests with the 'only' option.
  t.runOnly(true);
  await t.test('this subtest is now skipped');
  await t.test('this subtest is run', { only: true });

  // Switch the context back to execute all tests.
  t.runOnly(false);
  await t.test('this subtest is now run');

  // Explicitly do not run these tests.
  await t.test('skipped subtest 3', { only: false });
  await t.test('skipped subtest 4', { skip: true });
});

// The 'only' option is not set, so this test is skipped.
test('this test is not run', () => {
  // This code is not run.
  throw new Error('fail');
});

describe('a suite', () => {
  // The 'only' option is set, so this test is run.
  it('this test is run', { only: true }, () => {
    // This code is run.
  });

  it('this test is not run', () => {
    // This code is not run.
    throw new Error('fail');
  });
});

describe.only('a suite', () => {
  // The 'only' option is set, so this test is run.
  it('this test is run', () => {
    // This code is run.
  });

  it('this test is run', () => {
    // This code is run.
  });
});
```
## Filtering tests by name {#filtering-tests-by-name}

The [`--test-name-pattern`](/nodejs/api/cli#--test-name-pattern) command-line option can be used to only run tests whose name matches the provided pattern, and the [`--test-skip-pattern`](/nodejs/api/cli#--test-skip-pattern) option can be used to skip tests whose name matches the provided pattern. Test name patterns are interpreted as JavaScript regular expressions. The `--test-name-pattern` and `--test-skip-pattern` options can be specified multiple times in order to run nested tests. For each test that is executed, any corresponding test hooks, such as `beforeEach()`, are also run. Tests that are not executed are omitted from the test runner output.

Given the following test file, starting Node.js with the `--test-name-pattern="test [1-3]"` option would cause the test runner to execute `test 1`, `test 2`, and `test 3`. If `test 1` did not match the test name pattern, then its subtests would not execute, despite matching the pattern. The same set of tests could also be executed by passing `--test-name-pattern` multiple times (e.g. `--test-name-pattern="test 1"`, `--test-name-pattern="test 2"`, etc.).

```js [ESM]
test('test 1', async (t) => {
  await t.test('test 2');
  await t.test('test 3');
});

test('Test 4', async (t) => {
  await t.test('Test 5');
  await t.test('test 6');
});
```
Test name patterns can also be specified using regular expression literals. This allows regular expression flags to be used. In the previous example, starting Node.js with `--test-name-pattern="/test [4-5]/i"` (or `--test-skip-pattern="/test [4-5]/i"`) would match `Test 4` and `Test 5` because the pattern is case-insensitive.

To match a single test with a pattern, you can prefix it with all its ancestor test names separated by space, to ensure it is unique. For example, given the following test file:

```js [ESM]
describe('test 1', (t) => {
  it('some test');
});

describe('test 2', (t) => {
  it('some test');
});
```
Starting Node.js with `--test-name-pattern="test 1 some test"` would match only `some test` in `test 1`.

Test name patterns do not change the set of files that the test runner executes.

If both `--test-name-pattern` and `--test-skip-pattern` are supplied, tests must satisfy **both** requirements in order to be executed.

## Extraneous asynchronous activity {#extraneous-asynchronous-activity}

Once a test function finishes executing, the results are reported as quickly as possible while maintaining the order of the tests. However, it is possible for the test function to generate asynchronous activity that outlives the test itself. The test runner handles this type of activity, but does not delay the reporting of test results in order to accommodate it.

In the following example, a test completes with two `setImmediate()` operations still outstanding. The first `setImmediate()` attempts to create a new subtest. Because the parent test has already finished and output its results, the new subtest is immediately marked as failed, and reported later to the [\<TestsStream\>](/nodejs/api/test#class-testsstream).

The second `setImmediate()` creates an `uncaughtException` event. `uncaughtException` and `unhandledRejection` events originating from a completed test are marked as failed by the `test` module and reported as diagnostic warnings at the top level by the [\<TestsStream\>](/nodejs/api/test#class-testsstream).

```js [ESM]
test('a test that creates asynchronous activity', (t) => {
  setImmediate(() => {
    t.test('subtest that is created too late', (t) => {
      throw new Error('error1');
    });
  });

  setImmediate(() => {
    throw new Error('error2');
  });

  // The test finishes after this line.
});
```
## Watch mode {#watch-mode}

**Added in: v19.2.0, v18.13.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index) - Experimental
:::

The Node.js test runner supports running in watch mode by passing the `--watch` flag:

```bash [BASH]
node --test --watch
```
In watch mode, the test runner will watch for changes to test files and their dependencies. When a change is detected, the test runner will rerun the tests affected by the change. The test runner will continue to run until the process is terminated.

## Running tests from the command line {#running-tests-from-the-command-line}

The Node.js test runner can be invoked from the command line by passing the [`--test`](/nodejs/api/cli#--test) flag:

```bash [BASH]
node --test
```
By default, Node.js will run all files matching these patterns:

- `**/*.test.{cjs,mjs,js}`
- `**/*-test.{cjs,mjs,js}`
- `**/*_test.{cjs,mjs,js}`
- `**/test-*.{cjs,mjs,js}`
- `**/test.{cjs,mjs,js}`
- `**/test/**/*.{cjs,mjs,js}`

Unless [`--no-experimental-strip-types`](/nodejs/api/cli#--no-experimental-strip-types) is supplied, the following additional patterns are also matched:

- `**/*.test.{cts,mts,ts}`
- `**/*-test.{cts,mts,ts}`
- `**/*_test.{cts,mts,ts}`
- `**/test-*.{cts,mts,ts}`
- `**/test.{cts,mts,ts}`
- `**/test/**/*.{cts,mts,ts}`

Alternatively, one or more glob patterns can be provided as the final argument(s) to the Node.js command, as shown below. Glob patterns follow the behavior of [`glob(7)`](https://man7.org/linux/man-pages/man7/glob.7). The glob patterns should be enclosed in double quotes on the command line to prevent shell expansion, which can reduce portability across systems.

```bash [BASH]
node --test "**/*.test.js" "**/*.spec.js"
```
Matching files are executed as test files. More information on the test file execution can be found in the [test runner execution model](/nodejs/api/test#test-runner-execution-model) section.

### Test runner execution model {#test-runner-execution-model}

When process-level test isolation is enabled, each matching test file is executed in a separate child process. The maximum number of child processes running at any time is controlled by the [`--test-concurrency`](/nodejs/api/cli#--test-concurrency) flag. If the child process finishes with an exit code of 0, the test is considered passing. Otherwise, the test is considered to be a failure. Test files must be executable by Node.js, but are not required to use the `node:test` module internally.

Each test file is executed as if it was a regular script. That is, if the test file itself uses `node:test` to define tests, all of those tests will be executed within a single application thread, regardless of the value of the `concurrency` option of [`test()`](/nodejs/api/test#testname-options-fn).

When process-level test isolation is disabled, each matching test file is imported into the test runner process. Once all test files have been loaded, the top level tests are executed with a concurrency of one. Because the test files are all run within the same context, it is possible for tests to interact with each other in ways that are not possible when isolation is enabled. For example, if a test relies on global state, it is possible for that state to be modified by a test originating from another file.

## Collecting code coverage {#collecting-code-coverage}

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index) - Experimental
:::

When Node.js is started with the [`--experimental-test-coverage`](/nodejs/api/cli#--experimental-test-coverage) command-line flag, code coverage is collected and statistics are reported once all tests have completed. If the [`NODE_V8_COVERAGE`](/nodejs/api/cli#node_v8_coveragedir) environment variable is used to specify a code coverage directory, the generated V8 coverage files are written to that directory. Node.js core modules and files within `node_modules/` directories are, by default, not included in the coverage report. However, they can be explicitly included via the [`--test-coverage-include`](/nodejs/api/cli#--test-coverage-include) flag. By default all the matching test files are excluded from the coverage report. Exclusions can be overridden by using the [`--test-coverage-exclude`](/nodejs/api/cli#--test-coverage-exclude) flag. If coverage is enabled, the coverage report is sent to any [test reporters](/nodejs/api/test#test-reporters) via the `'test:coverage'` event.

Coverage can be disabled on a series of lines using the following comment syntax:

```js [ESM]
/* node:coverage disable */
if (anAlwaysFalseCondition) {
  // Code in this branch will never be executed, but the lines are ignored for
  // coverage purposes. All lines following the 'disable' comment are ignored
  // until a corresponding 'enable' comment is encountered.
  console.log('this is never executed');
}
/* node:coverage enable */
```
Coverage can also be disabled for a specified number of lines. After the specified number of lines, coverage will be automatically reenabled. If the number of lines is not explicitly provided, a single line is ignored.

```js [ESM]
/* node:coverage ignore next */
if (anAlwaysFalseCondition) { console.log('this is never executed'); }

/* node:coverage ignore next 3 */
if (anAlwaysFalseCondition) {
  console.log('this is never executed');
}
```
### Coverage reporters {#coverage-reporters}

The tap and spec reporters will print a summary of the coverage statistics. There is also an lcov reporter that will generate an lcov file which can be used as an in depth coverage report.

```bash [BASH]
node --test --experimental-test-coverage --test-reporter=lcov --test-reporter-destination=lcov.info
```
- No test results are reported by this reporter.
- This reporter should ideally be used alongside another reporter.

## Mocking {#mocking}

The `node:test` module supports mocking during testing via a top-level `mock` object. The following example creates a spy on a function that adds two numbers together. The spy is then used to assert that the function was called as expected.



::: code-group
```js [ESM]
import assert from 'node:assert';
import { mock, test } from 'node:test';

test('spies on a function', () => {
  const sum = mock.fn((a, b) => {
    return a + b;
  });

  assert.strictEqual(sum.mock.callCount(), 0);
  assert.strictEqual(sum(3, 4), 7);
  assert.strictEqual(sum.mock.callCount(), 1);

  const call = sum.mock.calls[0];
  assert.deepStrictEqual(call.arguments, [3, 4]);
  assert.strictEqual(call.result, 7);
  assert.strictEqual(call.error, undefined);

  // Reset the globally tracked mocks.
  mock.reset();
});
```

```js [CJS]
'use strict';
const assert = require('node:assert');
const { mock, test } = require('node:test');

test('spies on a function', () => {
  const sum = mock.fn((a, b) => {
    return a + b;
  });

  assert.strictEqual(sum.mock.callCount(), 0);
  assert.strictEqual(sum(3, 4), 7);
  assert.strictEqual(sum.mock.callCount(), 1);

  const call = sum.mock.calls[0];
  assert.deepStrictEqual(call.arguments, [3, 4]);
  assert.strictEqual(call.result, 7);
  assert.strictEqual(call.error, undefined);

  // Reset the globally tracked mocks.
  mock.reset();
});
```
:::

The same mocking functionality is also exposed on the [`TestContext`](/nodejs/api/test#class-testcontext) object of each test. The following example creates a spy on an object method using the API exposed on the `TestContext`. The benefit of mocking via the test context is that the test runner will automatically restore all mocked functionality once the test finishes.

```js [ESM]
test('spies on an object method', (t) => {
  const number = {
    value: 5,
    add(a) {
      return this.value + a;
    },
  };

  t.mock.method(number, 'add');
  assert.strictEqual(number.add.mock.callCount(), 0);
  assert.strictEqual(number.add(3), 8);
  assert.strictEqual(number.add.mock.callCount(), 1);

  const call = number.add.mock.calls[0];

  assert.deepStrictEqual(call.arguments, [3]);
  assert.strictEqual(call.result, 8);
  assert.strictEqual(call.target, undefined);
  assert.strictEqual(call.this, number);
});
```
### Timers {#timers}

Mocking timers is a technique commonly used in software testing to simulate and control the behavior of timers, such as `setInterval` and `setTimeout`, without actually waiting for the specified time intervals.

Refer to the [`MockTimers`](/nodejs/api/test#class-mocktimers) class for a full list of methods and features.

This allows developers to write more reliable and predictable tests for time-dependent functionality.

The example below shows how to mock `setTimeout`. Using `.enable({ apis: ['setTimeout'] });` it will mock the `setTimeout` functions in the [node:timers](/nodejs/api/timers) and [node:timers/promises](/nodejs/api/timers#timers-promises-api) modules, as well as from the Node.js global context.

**Note:** Destructuring functions such as `import { setTimeout } from 'node:timers'` is currently not supported by this API.



::: code-group
```js [ESM]
import assert from 'node:assert';
import { mock, test } from 'node:test';

test('mocks setTimeout to be executed synchronously without having to actually wait for it', () => {
  const fn = mock.fn();

  // Optionally choose what to mock
  mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);

  // Advance in time
  mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);

  // Reset the globally tracked mocks.
  mock.timers.reset();

  // If you call reset mock instance, it will also reset timers instance
  mock.reset();
});
```

```js [CJS]
const assert = require('node:assert');
const { mock, test } = require('node:test');

test('mocks setTimeout to be executed synchronously without having to actually wait for it', () => {
  const fn = mock.fn();

  // Optionally choose what to mock
  mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);

  // Advance in time
  mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);

  // Reset the globally tracked mocks.
  mock.timers.reset();

  // If you call reset mock instance, it will also reset timers instance
  mock.reset();
});
```
:::

The same mocking functionality is also exposed in the mock property on the [`TestContext`](/nodejs/api/test#class-testcontext) object of each test. The benefit of mocking via the test context is that the test runner will automatically restore all mocked timers functionality once the test finishes.



::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('mocks setTimeout to be executed synchronously without having to actually wait for it', (context) => {
  const fn = context.mock.fn();

  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);

  // Advance in time
  context.mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('mocks setTimeout to be executed synchronously without having to actually wait for it', (context) => {
  const fn = context.mock.fn();

  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);

  // Advance in time
  context.mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);
});
```
:::

### Dates {#dates}

The mock timers API also allows the mocking of the `Date` object. This is a useful feature for testing time-dependent functionality, or to simulate internal calendar functions such as `Date.now()`.

The dates implementation is also part of the [`MockTimers`](/nodejs/api/test#class-mocktimers) class. Refer to it for a full list of methods and features.

**Note:** Dates and timers are dependent when mocked together. This means that if you have both the `Date` and `setTimeout` mocked, advancing the time will also advance the mocked date as they simulate a single internal clock.

The example below show how to mock the `Date` object and obtain the current `Date.now()` value.



::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('mocks the Date object', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['Date'] });
  // If not specified, the initial date will be based on 0 in the UNIX epoch
  assert.strictEqual(Date.now(), 0);

  // Advance in time will also advance the date
  context.mock.timers.tick(9999);
  assert.strictEqual(Date.now(), 9999);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('mocks the Date object', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['Date'] });
  // If not specified, the initial date will be based on 0 in the UNIX epoch
  assert.strictEqual(Date.now(), 0);

  // Advance in time will also advance the date
  context.mock.timers.tick(9999);
  assert.strictEqual(Date.now(), 9999);
});
```
:::

If there is no initial epoch set, the initial date will be based on 0 in the Unix epoch. This is January 1st, 1970, 00:00:00 UTC. You can set an initial date by passing a `now` property to the `.enable()` method. This value will be used as the initial date for the mocked `Date` object. It can either be a positive integer, or another Date object.



::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('mocks the Date object with initial time', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['Date'], now: 100 });
  assert.strictEqual(Date.now(), 100);

  // Advance in time will also advance the date
  context.mock.timers.tick(200);
  assert.strictEqual(Date.now(), 300);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('mocks the Date object with initial time', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['Date'], now: 100 });
  assert.strictEqual(Date.now(), 100);

  // Advance in time will also advance the date
  context.mock.timers.tick(200);
  assert.strictEqual(Date.now(), 300);
});
```
:::

You can use the `.setTime()` method to manually move the mocked date to another time. This method only accepts a positive integer.

**Note:** This method will execute any mocked timers that are in the past from the new time.

In the below example we are setting a new time for the mocked date.



::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('sets the time of a date object', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['Date'], now: 100 });
  assert.strictEqual(Date.now(), 100);

  // Advance in time will also advance the date
  context.mock.timers.setTime(1000);
  context.mock.timers.tick(200);
  assert.strictEqual(Date.now(), 1200);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('sets the time of a date object', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['Date'], now: 100 });
  assert.strictEqual(Date.now(), 100);

  // Advance in time will also advance the date
  context.mock.timers.setTime(1000);
  context.mock.timers.tick(200);
  assert.strictEqual(Date.now(), 1200);
});
```
:::

If you have any timer that's set to run in the past, it will be executed as if the `.tick()` method has been called. This is useful if you want to test time-dependent functionality that's already in the past.



::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('runs timers as setTime passes ticks', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const fn = context.mock.fn();
  setTimeout(fn, 1000);

  context.mock.timers.setTime(800);
  // Timer is not executed as the time is not yet reached
  assert.strictEqual(fn.mock.callCount(), 0);
  assert.strictEqual(Date.now(), 800);

  context.mock.timers.setTime(1200);
  // Timer is executed as the time is now reached
  assert.strictEqual(fn.mock.callCount(), 1);
  assert.strictEqual(Date.now(), 1200);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('runs timers as setTime passes ticks', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const fn = context.mock.fn();
  setTimeout(fn, 1000);

  context.mock.timers.setTime(800);
  // Timer is not executed as the time is not yet reached
  assert.strictEqual(fn.mock.callCount(), 0);
  assert.strictEqual(Date.now(), 800);

  context.mock.timers.setTime(1200);
  // Timer is executed as the time is now reached
  assert.strictEqual(fn.mock.callCount(), 1);
  assert.strictEqual(Date.now(), 1200);
});
```
:::

Using `.runAll()` will execute all timers that are currently in the queue. This will also advance the mocked date to the time of the last timer that was executed as if the time has passed.



::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('runs timers as setTime passes ticks', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const fn = context.mock.fn();
  setTimeout(fn, 1000);
  setTimeout(fn, 2000);
  setTimeout(fn, 3000);

  context.mock.timers.runAll();
  // All timers are executed as the time is now reached
  assert.strictEqual(fn.mock.callCount(), 3);
  assert.strictEqual(Date.now(), 3000);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('runs timers as setTime passes ticks', (context) => {
  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const fn = context.mock.fn();
  setTimeout(fn, 1000);
  setTimeout(fn, 2000);
  setTimeout(fn, 3000);

  context.mock.timers.runAll();
  // All timers are executed as the time is now reached
  assert.strictEqual(fn.mock.callCount(), 3);
  assert.strictEqual(Date.now(), 3000);
});
```
:::

## Snapshot testing {#snapshot-testing}


::: info [History]
| Version | Changes |
| --- | --- |
| v23.4.0 | Snapsnot testing is no longer experimental. |
| v22.3.0 | Added in: v22.3.0 |
:::

Snapshot tests allow arbitrary values to be serialized into string values and compared against a set of known good values. The known good values are known as snapshots, and are stored in a snapshot file. Snapshot files are managed by the test runner, but are designed to be human readable to aid in debugging. Best practice is for snapshot files to be checked into source control along with your test files.

Snapshot files are generated by starting Node.js with the [`--test-update-snapshots`](/nodejs/api/cli#--test-update-snapshots) command-line flag. A separate snapshot file is generated for each test file. By default, the snapshot file has the same name as the test file with a `.snapshot` file extension. This behavior can be configured using the `snapshot.setResolveSnapshotPath()` function. Each snapshot assertion corresponds to an export in the snapshot file.

An example snapshot test is shown below. The first time this test is executed, it will fail because the corresponding snapshot file does not exist.

```js [ESM]
// test.js
suite('suite of snapshot tests', () => {
  test('snapshot test', (t) => {
    t.assert.snapshot({ value1: 1, value2: 2 });
    t.assert.snapshot(5);
  });
});
```
Generate the snapshot file by running the test file with `--test-update-snapshots`. The test should pass, and a file named `test.js.snapshot` is created in the same directory as the test file. The contents of the snapshot file are shown below. Each snapshot is identified by the full name of test and a counter to differentiate between snapshots in the same test.

```js [ESM]
exports[`suite of snapshot tests > snapshot test 1`] = `
{
  "value1": 1,
  "value2": 2
}
`;

exports[`suite of snapshot tests > snapshot test 2`] = `
5
`;
```
Once the snapshot file is created, run the tests again without the `--test-update-snapshots` flag. The tests should pass now.

## Test reporters {#test-reporters}


::: info [History]
| Version | Changes |
| --- | --- |
| v19.9.0, v18.17.0 | Reporters are now exposed at `node:test/reporters`. |
| v19.6.0, v18.15.0 | Added in: v19.6.0, v18.15.0 |
:::

The `node:test` module supports passing [`--test-reporter`](/nodejs/api/cli#--test-reporter) flags for the test runner to use a specific reporter.

The following built-reporters are supported:

-  `spec` The `spec` reporter outputs the test results in a human-readable format. This is the default reporter. 
-  `tap` The `tap` reporter outputs the test results in the [TAP](https://testanything.org/) format. 
-  `dot` The `dot` reporter outputs the test results in a compact format, where each passing test is represented by a `.`, and each failing test is represented by a `X`. 
-  `junit` The junit reporter outputs test results in a jUnit XML format 
-  `lcov` The `lcov` reporter outputs test coverage when used with the [`--experimental-test-coverage`](/nodejs/api/cli#--experimental-test-coverage) flag. 

The exact output of these reporters is subject to change between versions of Node.js, and should not be relied on programmatically. If programmatic access to the test runner's output is required, use the events emitted by the [\<TestsStream\>](/nodejs/api/test#class-testsstream).

The reporters are available via the `node:test/reporters` module:



::: code-group
```js [ESM]
import { tap, spec, dot, junit, lcov } from 'node:test/reporters';
```

```js [CJS]
const { tap, spec, dot, junit, lcov } = require('node:test/reporters');
```
:::

### Custom reporters {#custom-reporters}

[`--test-reporter`](/nodejs/api/cli#--test-reporter) can be used to specify a path to custom reporter. A custom reporter is a module that exports a value accepted by [stream.compose](/nodejs/api/stream#streamcomposestreams). Reporters should transform events emitted by a [\<TestsStream\>](/nodejs/api/test#class-testsstream)

Example of a custom reporter using [\<stream.Transform\>](/nodejs/api/stream#class-streamtransform):



::: code-group
```js [ESM]
import { Transform } from 'node:stream';

const customReporter = new Transform({
  writableObjectMode: true,
  transform(event, encoding, callback) {
    switch (event.type) {
      case 'test:dequeue':
        callback(null, `test ${event.data.name} dequeued`);
        break;
      case 'test:enqueue':
        callback(null, `test ${event.data.name} enqueued`);
        break;
      case 'test:watch:drained':
        callback(null, 'test watch queue drained');
        break;
      case 'test:start':
        callback(null, `test ${event.data.name} started`);
        break;
      case 'test:pass':
        callback(null, `test ${event.data.name} passed`);
        break;
      case 'test:fail':
        callback(null, `test ${event.data.name} failed`);
        break;
      case 'test:plan':
        callback(null, 'test plan');
        break;
      case 'test:diagnostic':
      case 'test:stderr':
      case 'test:stdout':
        callback(null, event.data.message);
        break;
      case 'test:coverage': {
        const { totalLineCount } = event.data.summary.totals;
        callback(null, `total line count: ${totalLineCount}\n`);
        break;
      }
    }
  },
});

export default customReporter;
```

```js [CJS]
const { Transform } = require('node:stream');

const customReporter = new Transform({
  writableObjectMode: true,
  transform(event, encoding, callback) {
    switch (event.type) {
      case 'test:dequeue':
        callback(null, `test ${event.data.name} dequeued`);
        break;
      case 'test:enqueue':
        callback(null, `test ${event.data.name} enqueued`);
        break;
      case 'test:watch:drained':
        callback(null, 'test watch queue drained');
        break;
      case 'test:start':
        callback(null, `test ${event.data.name} started`);
        break;
      case 'test:pass':
        callback(null, `test ${event.data.name} passed`);
        break;
      case 'test:fail':
        callback(null, `test ${event.data.name} failed`);
        break;
      case 'test:plan':
        callback(null, 'test plan');
        break;
      case 'test:diagnostic':
      case 'test:stderr':
      case 'test:stdout':
        callback(null, event.data.message);
        break;
      case 'test:coverage': {
        const { totalLineCount } = event.data.summary.totals;
        callback(null, `total line count: ${totalLineCount}\n`);
        break;
      }
    }
  },
});

module.exports = customReporter;
```
:::

Example of a custom reporter using a generator function:



::: code-group
```js [ESM]
export default async function * customReporter(source) {
  for await (const event of source) {
    switch (event.type) {
      case 'test:dequeue':
        yield `test ${event.data.name} dequeued\n`;
        break;
      case 'test:enqueue':
        yield `test ${event.data.name} enqueued\n`;
        break;
      case 'test:watch:drained':
        yield 'test watch queue drained\n';
        break;
      case 'test:start':
        yield `test ${event.data.name} started\n`;
        break;
      case 'test:pass':
        yield `test ${event.data.name} passed\n`;
        break;
      case 'test:fail':
        yield `test ${event.data.name} failed\n`;
        break;
      case 'test:plan':
        yield 'test plan\n';
        break;
      case 'test:diagnostic':
      case 'test:stderr':
      case 'test:stdout':
        yield `${event.data.message}\n`;
        break;
      case 'test:coverage': {
        const { totalLineCount } = event.data.summary.totals;
        yield `total line count: ${totalLineCount}\n`;
        break;
      }
    }
  }
}
```

```js [CJS]
module.exports = async function * customReporter(source) {
  for await (const event of source) {
    switch (event.type) {
      case 'test:dequeue':
        yield `test ${event.data.name} dequeued\n`;
        break;
      case 'test:enqueue':
        yield `test ${event.data.name} enqueued\n`;
        break;
      case 'test:watch:drained':
        yield 'test watch queue drained\n';
        break;
      case 'test:start':
        yield `test ${event.data.name} started\n`;
        break;
      case 'test:pass':
        yield `test ${event.data.name} passed\n`;
        break;
      case 'test:fail':
        yield `test ${event.data.name} failed\n`;
        break;
      case 'test:plan':
        yield 'test plan\n';
        break;
      case 'test:diagnostic':
      case 'test:stderr':
      case 'test:stdout':
        yield `${event.data.message}\n`;
        break;
      case 'test:coverage': {
        const { totalLineCount } = event.data.summary.totals;
        yield `total line count: ${totalLineCount}\n`;
        break;
      }
    }
  }
};
```
:::

The value provided to `--test-reporter` should be a string like one used in an `import()` in JavaScript code, or a value provided for [`--import`](/nodejs/api/cli#--importmodule).

### Multiple reporters {#multiple-reporters}

The [`--test-reporter`](/nodejs/api/cli#--test-reporter) flag can be specified multiple times to report test results in several formats. In this situation it is required to specify a destination for each reporter using [`--test-reporter-destination`](/nodejs/api/cli#--test-reporter-destination). Destination can be `stdout`, `stderr`, or a file path. Reporters and destinations are paired according to the order they were specified.

In the following example, the `spec` reporter will output to `stdout`, and the `dot` reporter will output to `file.txt`:

```bash [BASH]
node --test-reporter=spec --test-reporter=dot --test-reporter-destination=stdout --test-reporter-destination=file.txt
```
When a single reporter is specified, the destination will default to `stdout`, unless a destination is explicitly provided.

## `run([options])` {#runoptions}


::: info [History]
| Version | Changes |
| --- | --- |
| v23.0.0 | Added the `cwd` option. |
| v23.0.0 | Added coverage options. |
| v22.8.0 | Added the `isolation` option. |
| v22.6.0 | Added the `globPatterns` option. |
| v22.0.0, v20.14.0 | Added the `forceExit` option. |
| v20.1.0, v18.17.0 | Add a testNamePatterns option. |
| v18.9.0, v16.19.0 | Added in: v18.9.0, v16.19.0 |
:::

- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Configuration options for running tests. The following properties are supported: 
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) If a number is provided, then that many test processes would run in parallel, where each process corresponds to one test file. If `true`, it would run `os.availableParallelism() - 1` test files in parallel. If `false`, it would only run one test file at a time. **Default:** `false`.
    - `cwd`: [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Specifies the current working directory to be used by the test runner. Serves as the base path for resolving files according to the [test runner execution model](/nodejs/api/test#test-runner-execution-model). **Default:** `process.cwd()`.
    - `files`: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) An array containing the list of files to run. **Default:** matching files from [test runner execution model](/nodejs/api/test#test-runner-execution-model).
    - `forceExit`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Configures the test runner to exit the process once all known tests have finished executing even if the event loop would otherwise remain active. **Default:** `false`.
    - `globPatterns`: [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) An array containing the list of glob patterns to match test files. This option cannot be used together with `files`. **Default:** matching files from [test runner execution model](/nodejs/api/test#test-runner-execution-model).
    - `inspectPort` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Sets inspector port of test child process. This can be a number, or a function that takes no arguments and returns a number. If a nullish value is provided, each process gets its own port, incremented from the primary's `process.debugPort`. This option is ignored if the `isolation` option is set to `'none'` as no child processes are spawned. **Default:** `undefined`.
    - `isolation` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Configures the type of test isolation. If set to `'process'`, each test file is run in a separate child process. If set to `'none'`, all test files run in the current process. **Default:** `'process'`.
    - `only`: [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) If truthy, the test context will only run tests that have the `only` option set
    - `setup` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) A function that accepts the `TestsStream` instance and can be used to setup listeners before any tests are run. **Default:** `undefined`.
    - `execArgv` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) An array of CLI flags to pass to the `node` executable when spawning the subprocesses. This option has no effect when `isolation` is `'none`'. **Default:** `[]`
    - `argv` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) An array of CLI flags to pass to each test file when spawning the subprocesses. This option has no effect when `isolation` is `'none'`. **Default:** `[]`.
    - `signal` [\<AbortSignal\>](/nodejs/api/globals#class-abortsignal) Allows aborting an in-progress test execution.
    - `testNamePatterns` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) A String, RegExp or a RegExp Array, that can be used to only run tests whose name matches the provided pattern. Test name patterns are interpreted as JavaScript regular expressions. For each test that is executed, any corresponding test hooks, such as `beforeEach()`, are also run. **Default:** `undefined`.
    - `testSkipPatterns` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<RegExp\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) A String, RegExp or a RegExp Array, that can be used to exclude running tests whose name matches the provided pattern. Test name patterns are interpreted as JavaScript regular expressions. For each test that is executed, any corresponding test hooks, such as `beforeEach()`, are also run. **Default:** `undefined`.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) A number of milliseconds the test execution will fail after. If unspecified, subtests inherit this value from their parent. **Default:** `Infinity`.
    - `watch` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Whether to run in watch mode or not. **Default:** `false`.
    - `shard` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Running tests in a specific shard. **Default:** `undefined`. 
    - `index` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) is a positive integer between 1 and `\<total\>` that specifies the index of the shard to run. This option is *required*.
    - `total` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) is a positive integer that specifies the total number of shards to split the test files to. This option is *required*.
  
 
    - `coverage` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) enable [code coverage](/nodejs/api/test#collecting-code-coverage) collection. **Default:** `false`.
    - `coverageExcludeGlobs` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Excludes specific files from code coverage using a glob pattern, which can match both absolute and relative file paths. This property is only applicable when `coverage` was set to `true`. If both `coverageExcludeGlobs` and `coverageIncludeGlobs` are provided, files must meet **both** criteria to be included in the coverage report. **Default:** `undefined`.
    - `coverageIncludeGlobs` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) Includes specific files in code coverage using a glob pattern, which can match both absolute and relative file paths. This property is only applicable when `coverage` was set to `true`. If both `coverageExcludeGlobs` and `coverageIncludeGlobs` are provided, files must meet **both** criteria to be included in the coverage report. **Default:** `undefined`.
    - `lineCoverage` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Require a minimum percent of covered lines. If code coverage does not reach the threshold specified, the process will exit with code `1`. **Default:** `0`.
    - `branchCoverage` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Require a minimum percent of covered branches. If code coverage does not reach the threshold specified, the process will exit with code `1`. **Default:** `0`.
    - `functionCoverage` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) Require a minimum percent of covered functions. If code coverage does not reach the threshold specified, the process will exit with code `1`. **Default:** `0`.
  
 
- Returns: [\<TestsStream\>](/nodejs/api/test#class-testsstream)

**Note:** `shard` is used to horizontally parallelize test running across machines or processes, ideal for large-scale executions across varied environments. It's incompatible with `watch` mode, tailored for rapid code iteration by automatically rerunning tests on file changes.



::: code-group
```js [ESM]
import { tap } from 'node:test/reporters';
import { run } from 'node:test';
import process from 'node:process';
import path from 'node:path';

run({ files: [path.resolve('./tests/test.js')] })
 .on('test:fail', () => {
   process.exitCode = 1;
 })
 .compose(tap)
 .pipe(process.stdout);
```

```js [CJS]
const { tap } = require('node:test/reporters');
const { run } = require('node:test');
const path = require('node:path');

run({ files: [path.resolve('./tests/test.js')] })
 .on('test:fail', () => {
   process.exitCode = 1;
 })
 .compose(tap)
 .pipe(process.stdout);
```
:::

## `suite([name][, options][, fn])` {#suitename-options-fn}

**Added in: v22.0.0, v20.13.0**

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The name of the suite, which is displayed when reporting test results. **Default:** The `name` property of `fn`, or `'\<anonymous\>'` if `fn` does not have a name.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Optional configuration options for the suite. This supports the same options as `test([name][, options][, fn])`.
- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) The suite function declaring nested tests and suites. The first argument to this function is a [`SuiteContext`](/nodejs/api/test#class-suitecontext) object. **Default:** A no-op function.
- Returns: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Immediately fulfilled with `undefined`.

The `suite()` function is imported from the `node:test` module.

## `suite.skip([name][, options][, fn])` {#suiteskipname-options-fn}

**Added in: v22.0.0, v20.13.0**

Shorthand for skipping a suite. This is the same as [`suite([name], { skip: true }[, fn])`](/nodejs/api/test#suitename-options-fn).

## `suite.todo([name][, options][, fn])` {#suitetodoname-options-fn}

**Added in: v22.0.0, v20.13.0**

Shorthand for marking a suite as `TODO`. This is the same as [`suite([name], { todo: true }[, fn])`](/nodejs/api/test#suitename-options-fn).

## `suite.only([name][, options][, fn])` {#suiteonlyname-options-fn}

**Added in: v22.0.0, v20.13.0**

Shorthand for marking a suite as `only`. This is the same as [`suite([name], { only: true }[, fn])`](/nodejs/api/test#suitename-options-fn).

## `test([name][, options][, fn])` {#testname-options-fn}


::: info [History]
| Version | Changes |
| --- | --- |
| v20.2.0, v18.17.0 | Added the `skip`, `todo`, and `only` shorthands. |
| v18.8.0, v16.18.0 | Add a `signal` option. |
| v18.7.0, v16.17.0 | Add a `timeout` option. |
| v18.0.0, v16.17.0 | Added in: v18.0.0, v16.17.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The name of the test, which is displayed when reporting test results. **Default:** The `name` property of `fn`, or `'\<anonymous\>'` if `fn` does not have a name.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Configuration options for the test. The following properties are supported: 
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) If a number is provided, then that many tests would run in parallel within the application thread. If `true`, all scheduled asynchronous tests run concurrently within the thread. If `false`, only one test runs at a time. If unspecified, subtests inherit this value from their parent. **Default:** `false`.
    - `only` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) If truthy, and the test context is configured to run `only` tests, then this test will be run. Otherwise, the test is skipped. **Default:** `false`.
    - `signal` [\<AbortSignal\>](/nodejs/api/globals#class-abortsignal) Allows aborting an in-progress test.
    - `skip` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) If truthy, the test is skipped. If a string is provided, that string is displayed in the test results as the reason for skipping the test. **Default:** `false`.
    - `todo` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) If truthy, the test marked as `TODO`. If a string is provided, that string is displayed in the test results as the reason why the test is `TODO`. **Default:** `false`.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) A number of milliseconds the test will fail after. If unspecified, subtests inherit this value from their parent. **Default:** `Infinity`.
    - `plan` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The number of assertions and subtests expected to be run in the test. If the number of assertions run in the test does not match the number specified in the plan, the test will fail. **Default:** `undefined`.
  
 
- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) The function under test. The first argument to this function is a [`TestContext`](/nodejs/api/test#class-testcontext) object. If the test uses callbacks, the callback function is passed as the second argument. **Default:** A no-op function.
- Returns: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Fulfilled with `undefined` once the test completes, or immediately if the test runs within a suite.

The `test()` function is the value imported from the `test` module. Each invocation of this function results in reporting the test to the [\<TestsStream\>](/nodejs/api/test#class-testsstream).

The `TestContext` object passed to the `fn` argument can be used to perform actions related to the current test. Examples include skipping the test, adding additional diagnostic information, or creating subtests.

`test()` returns a `Promise` that fulfills once the test completes. if `test()` is called within a suite, it fulfills immediately. The return value can usually be discarded for top level tests. However, the return value from subtests should be used to prevent the parent test from finishing first and cancelling the subtest as shown in the following example.

```js [ESM]
test('top level test', async (t) => {
  // The setTimeout() in the following subtest would cause it to outlive its
  // parent test if 'await' is removed on the next line. Once the parent test
  // completes, it will cancel any outstanding subtests.
  await t.test('longer running subtest', async (t) => {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, 1000);
    });
  });
});
```
The `timeout` option can be used to fail the test if it takes longer than `timeout` milliseconds to complete. However, it is not a reliable mechanism for canceling tests because a running test might block the application thread and thus prevent the scheduled cancellation.

## `test.skip([name][, options][, fn])` {#testskipname-options-fn}

Shorthand for skipping a test, same as [`test([name], { skip: true }[, fn])`](/nodejs/api/test#testname-options-fn).

## `test.todo([name][, options][, fn])` {#testtodoname-options-fn}

Shorthand for marking a test as `TODO`, same as [`test([name], { todo: true }[, fn])`](/nodejs/api/test#testname-options-fn).

## `test.only([name][, options][, fn])` {#testonlyname-options-fn}

Shorthand for marking a test as `only`, same as [`test([name], { only: true }[, fn])`](/nodejs/api/test#testname-options-fn).

## `describe([name][, options][, fn])` {#describename-options-fn}

Alias for [`suite()`](/nodejs/api/test#suitename-options-fn).

The `describe()` function is imported from the `node:test` module.

## `describe.skip([name][, options][, fn])` {#describeskipname-options-fn}

Shorthand for skipping a suite. This is the same as [`describe([name], { skip: true }[, fn])`](/nodejs/api/test#describename-options-fn).

## `describe.todo([name][, options][, fn])` {#describetodoname-options-fn}

Shorthand for marking a suite as `TODO`. This is the same as [`describe([name], { todo: true }[, fn])`](/nodejs/api/test#describename-options-fn).

## `describe.only([name][, options][, fn])` {#describeonlyname-options-fn}

**Added in: v19.8.0, v18.15.0**

Shorthand for marking a suite as `only`. This is the same as [`describe([name], { only: true }[, fn])`](/nodejs/api/test#describename-options-fn).

## `it([name][, options][, fn])` {#itname-options-fn}


::: info [History]
| Version | Changes |
| --- | --- |
| v19.8.0, v18.16.0 | Calling `it()` is now equivalent to calling `test()`. |
| v18.6.0, v16.17.0 | Added in: v18.6.0, v16.17.0 |
:::

Alias for [`test()`](/nodejs/api/test#testname-options-fn).

The `it()` function is imported from the `node:test` module.

## `it.skip([name][, options][, fn])` {#itskipname-options-fn}

Shorthand for skipping a test, same as [`it([name], { skip: true }[, fn])`](/nodejs/api/test#testname-options-fn).

## `it.todo([name][, options][, fn])` {#ittodoname-options-fn}

Shorthand for marking a test as `TODO`, same as [`it([name], { todo: true }[, fn])`](/nodejs/api/test#testname-options-fn).

## `it.only([name][, options][, fn])` {#itonlyname-options-fn}

**Added in: v19.8.0, v18.15.0**

Shorthand for marking a test as `only`, same as [`it([name], { only: true }[, fn])`](/nodejs/api/test#testname-options-fn).

## `before([fn][, options])` {#beforefn-options}

**Added in: v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) The hook function. If the hook uses callbacks, the callback function is passed as the second argument. **Default:** A no-op function.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Configuration options for the hook. The following properties are supported: 
    - `signal` [\<AbortSignal\>](/nodejs/api/globals#class-abortsignal) Allows aborting an in-progress hook.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) A number of milliseconds the hook will fail after. If unspecified, subtests inherit this value from their parent. **Default:** `Infinity`.
  
 

This function creates a hook that runs before executing a suite.

```js [ESM]
describe('tests', async () => {
  before(() => console.log('about to run some test'));
  it('is a subtest', () => {
    assert.ok('some relevant assertion here');
  });
});
```
## `after([fn][, options])` {#afterfn-options}

**Added in: v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) The hook function. If the hook uses callbacks, the callback function is passed as the second argument. **Default:** A no-op function.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Configuration options for the hook. The following properties are supported: 
    - `signal` [\<AbortSignal\>](/nodejs/api/globals#class-abortsignal) Allows aborting an in-progress hook.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) A number of milliseconds the hook will fail after. If unspecified, subtests inherit this value from their parent. **Default:** `Infinity`.
  
 

This function creates a hook that runs after executing a suite.

```js [ESM]
describe('tests', async () => {
  after(() => console.log('finished running tests'));
  it('is a subtest', () => {
    assert.ok('some relevant assertion here');
  });
});
```
**Note:** The `after` hook is guaranteed to run, even if tests within the suite fail.

## `beforeEach([fn][, options])` {#beforeeachfn-options}

**Added in: v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) The hook function. If the hook uses callbacks, the callback function is passed as the second argument. **Default:** A no-op function.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Configuration options for the hook. The following properties are supported: 
    - `signal` [\<AbortSignal\>](/nodejs/api/globals#class-abortsignal) Allows aborting an in-progress hook.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) A number of milliseconds the hook will fail after. If unspecified, subtests inherit this value from their parent. **Default:** `Infinity`.
  
 

This function creates a hook that runs before each test in the current suite.

```js [ESM]
describe('tests', async () => {
  beforeEach(() => console.log('about to run a test'));
  it('is a subtest', () => {
    assert.ok('some relevant assertion here');
  });
});
```
## `afterEach([fn][, options])` {#aftereachfn-options}

**Added in: v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) The hook function. If the hook uses callbacks, the callback function is passed as the second argument. **Default:** A no-op function.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Configuration options for the hook. The following properties are supported: 
    - `signal` [\<AbortSignal\>](/nodejs/api/globals#class-abortsignal) Allows aborting an in-progress hook.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) A number of milliseconds the hook will fail after. If unspecified, subtests inherit this value from their parent. **Default:** `Infinity`.
  
 

This function creates a hook that runs after each test in the current suite. The `afterEach()` hook is run even if the test fails.

```js [ESM]
describe('tests', async () => {
  afterEach(() => console.log('finished running a test'));
  it('is a subtest', () => {
    assert.ok('some relevant assertion here');
  });
});
```
## `assert` {#snapshot}

**Added in: v23.7.0**

An object whose methods are used to configure available assertions on the `TestContext` objects in the current process. The methods from `node:assert` and snapshot testing functions are available by default.

It is possible to apply the same configuration to all files by placing common configuration code in a module preloaded with `--require` or `--import`.

### `assert.register(name, fn)` {#snapshotsetdefaultsnapshotserializersserializers}

**Added in: v23.7.0**

Defines a new assertion function with the provided name and function. If an assertion already exists with the same name, it is overwritten.

## `snapshot` {#snapshotsetresolvesnapshotpathfn}

**Added in: v22.3.0**

An object whose methods are used to configure default snapshot settings in the current process. It is possible to apply the same configuration to all files by placing common configuration code in a module preloaded with `--require` or `--import`.

### `snapshot.setDefaultSnapshotSerializers(serializers)` {#class-mockfunctioncontext}

**Added in: v22.3.0**

- `serializers` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) An array of synchronous functions used as the default serializers for snapshot tests.

This function is used to customize the default serialization mechanism used by the test runner. By default, the test runner performs serialization by calling `JSON.stringify(value, null, 2)` on the provided value. `JSON.stringify()` does have limitations regarding circular structures and supported data types. If a more robust serialization mechanism is required, this function should be used.

### `snapshot.setResolveSnapshotPath(fn)` {#ctxcalls}

**Added in: v22.3.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) A function used to compute the location of the snapshot file. The function receives the path of the test file as its only argument. If the test is not associated with a file (for example in the REPL), the input is undefined. `fn()` must return a string specifying the location of the snapshot snapshot file.

This function is used to customize the location of the snapshot file used for snapshot testing. By default, the snapshot filename is the same as the entry point filename with a `.snapshot` file extension.

## Class: `MockFunctionContext` {#ctxcallcount}

**Added in: v19.1.0, v18.13.0**

The `MockFunctionContext` class is used to inspect or manipulate the behavior of mocks created via the [`MockTracker`](/nodejs/api/test#class-mocktracker) APIs.

### `ctx.calls` {#ctxmockimplementationimplementation}

**Added in: v19.1.0, v18.13.0**

- [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

A getter that returns a copy of the internal array used to track calls to the mock. Each entry in the array is an object with the following properties.

- `arguments` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) An array of the arguments passed to the mock function.
- `error` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) If the mocked function threw then this property contains the thrown value. **Default:** `undefined`.
- `result` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) The value returned by the mocked function.
- `stack` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) An `Error` object whose stack can be used to determine the callsite of the mocked function invocation.
- `target` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) If the mocked function is a constructor, this field contains the class being constructed. Otherwise this will be `undefined`.
- `this` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) The mocked function's `this` value.

### `ctx.callCount()` {#ctxmockimplementationonceimplementation-oncall}

**Added in: v19.1.0, v18.13.0**

- Returns: [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The number of times that this mock has been invoked.

This function returns the number of times that this mock has been invoked. This function is more efficient than checking `ctx.calls.length` because `ctx.calls` is a getter that creates a copy of the internal call tracking array.

### `ctx.mockImplementation(implementation)` {#ctxresetcalls}

**Added in: v19.1.0, v18.13.0**

- `implementation` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) The function to be used as the mock's new implementation.

This function is used to change the behavior of an existing mock.

The following example creates a mock function using `t.mock.fn()`, calls the mock function, and then changes the mock implementation to a different function.

```js [ESM]
test('changes a mock behavior', (t) => {
  let cnt = 0;

  function addOne() {
    cnt++;
    return cnt;
  }

  function addTwo() {
    cnt += 2;
    return cnt;
  }

  const fn = t.mock.fn(addOne);

  assert.strictEqual(fn(), 1);
  fn.mock.mockImplementation(addTwo);
  assert.strictEqual(fn(), 3);
  assert.strictEqual(fn(), 5);
});
```
### `ctx.mockImplementationOnce(implementation[, onCall])` {#ctxrestore}

**Added in: v19.1.0, v18.13.0**

- `implementation` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) The function to be used as the mock's implementation for the invocation number specified by `onCall`.
- `onCall` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The invocation number that will use `implementation`. If the specified invocation has already occurred then an exception is thrown. **Default:** The number of the next invocation.

This function is used to change the behavior of an existing mock for a single invocation. Once invocation `onCall` has occurred, the mock will revert to whatever behavior it would have used had `mockImplementationOnce()` not been called.

The following example creates a mock function using `t.mock.fn()`, calls the mock function, changes the mock implementation to a different function for the next invocation, and then resumes its previous behavior.

```js [ESM]
test('changes a mock behavior once', (t) => {
  let cnt = 0;

  function addOne() {
    cnt++;
    return cnt;
  }

  function addTwo() {
    cnt += 2;
    return cnt;
  }

  const fn = t.mock.fn(addOne);

  assert.strictEqual(fn(), 1);
  fn.mock.mockImplementationOnce(addTwo);
  assert.strictEqual(fn(), 3);
  assert.strictEqual(fn(), 4);
});
```
### `ctx.resetCalls()` {#class-mockmodulecontext}

**Added in: v19.3.0, v18.13.0**

Resets the call history of the mock function.

### `ctx.restore()` {#ctxrestore_1}

**Added in: v19.1.0, v18.13.0**

Resets the implementation of the mock function to its original behavior. The mock can still be used after calling this function.

## Class: `MockModuleContext` {#class-mocktracker}

**Added in: v22.3.0, v20.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index).0 - Early development
:::

The `MockModuleContext` class is used to manipulate the behavior of module mocks created via the [`MockTracker`](/nodejs/api/test#class-mocktracker) APIs.

### `ctx.restore()` {#mockfnoriginal-implementation-options}

**Added in: v22.3.0, v20.18.0**

Resets the implementation of the mock module.

## Class: `MockTracker` {#mockgetterobject-methodname-implementation-options}

**Added in: v19.1.0, v18.13.0**

The `MockTracker` class is used to manage mocking functionality. The test runner module provides a top level `mock` export which is a `MockTracker` instance. Each test also provides its own `MockTracker` instance via the test context's `mock` property.

### `mock.fn([original[, implementation]][, options])` {#mockmethodobject-methodname-implementation-options}

**Added in: v19.1.0, v18.13.0**

- `original` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) An optional function to create a mock on. **Default:** A no-op function.
- `implementation` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) An optional function used as the mock implementation for `original`. This is useful for creating mocks that exhibit one behavior for a specified number of calls and then restore the behavior of `original`. **Default:** The function specified by `original`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Optional configuration options for the mock function. The following properties are supported: 
    - `times` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The number of times that the mock will use the behavior of `implementation`. Once the mock function has been called `times` times, it will automatically restore the behavior of `original`. This value must be an integer greater than zero. **Default:** `Infinity`.
  
 
- Returns: [\<Proxy\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) The mocked function. The mocked function contains a special `mock` property, which is an instance of [`MockFunctionContext`](/nodejs/api/test#class-mockfunctioncontext), and can be used for inspecting and changing the behavior of the mocked function.

This function is used to create a mock function.

The following example creates a mock function that increments a counter by one on each invocation. The `times` option is used to modify the mock behavior such that the first two invocations add two to the counter instead of one.

```js [ESM]
test('mocks a counting function', (t) => {
  let cnt = 0;

  function addOne() {
    cnt++;
    return cnt;
  }

  function addTwo() {
    cnt += 2;
    return cnt;
  }

  const fn = t.mock.fn(addOne, addTwo, { times: 2 });

  assert.strictEqual(fn(), 2);
  assert.strictEqual(fn(), 4);
  assert.strictEqual(fn(), 5);
  assert.strictEqual(fn(), 6);
});
```
### `mock.getter(object, methodName[, implementation][, options])` {#mockmodulespecifier-options}

**Added in: v19.3.0, v18.13.0**

This function is syntax sugar for [`MockTracker.method`](/nodejs/api/test#mockmethodobject-methodname-implementation-options) with `options.getter` set to `true`.

### `mock.method(object, methodName[, implementation][, options])` {#mockreset}

**Added in: v19.1.0, v18.13.0**

- `object` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) The object whose method is being mocked.
- `methodName` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<symbol\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Symbol_type) The identifier of the method on `object` to mock. If `object[methodName]` is not a function, an error is thrown.
- `implementation` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) An optional function used as the mock implementation for `object[methodName]`. **Default:** The original method specified by `object[methodName]`.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Optional configuration options for the mock method. The following properties are supported: 
    - `getter` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) If `true`, `object[methodName]` is treated as a getter. This option cannot be used with the `setter` option. **Default:** false.
    - `setter` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) If `true`, `object[methodName]` is treated as a setter. This option cannot be used with the `getter` option. **Default:** false.
    - `times` [\<integer\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The number of times that the mock will use the behavior of `implementation`. Once the mocked method has been called `times` times, it will automatically restore the original behavior. This value must be an integer greater than zero. **Default:** `Infinity`.
  
 
- Returns: [\<Proxy\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) The mocked method. The mocked method contains a special `mock` property, which is an instance of [`MockFunctionContext`](/nodejs/api/test#class-mockfunctioncontext), and can be used for inspecting and changing the behavior of the mocked method.

This function is used to create a mock on an existing object method. The following example demonstrates how a mock is created on an existing object method.

```js [ESM]
test('spies on an object method', (t) => {
  const number = {
    value: 5,
    subtract(a) {
      return this.value - a;
    },
  };

  t.mock.method(number, 'subtract');
  assert.strictEqual(number.subtract.mock.callCount(), 0);
  assert.strictEqual(number.subtract(3), 2);
  assert.strictEqual(number.subtract.mock.callCount(), 1);

  const call = number.subtract.mock.calls[0];

  assert.deepStrictEqual(call.arguments, [3]);
  assert.strictEqual(call.result, 2);
  assert.strictEqual(call.error, undefined);
  assert.strictEqual(call.target, undefined);
  assert.strictEqual(call.this, number);
});
```
### `mock.module(specifier[, options])` {#mockrestoreall}

**Added in: v22.3.0, v20.18.0**

::: warning [Stable: 1 - Experimental]
[Stable: 1](/nodejs/api/documentation#stability-index) [Stability: 1](/nodejs/api/documentation#stability-index).0 - Early development
:::

- `specifier` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<URL\>](/nodejs/api/url#the-whatwg-url-api) A string identifying the module to mock.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Optional configuration options for the mock module. The following properties are supported: 
    - `cache` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) If `false`, each call to `require()` or `import()` generates a new mock module. If `true`, subsequent calls will return the same module mock, and the mock module is inserted into the CommonJS cache. **Default:** false.
    - `defaultExport` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) An optional value used as the mocked module's default export. If this value is not provided, ESM mocks do not include a default export. If the mock is a CommonJS or builtin module, this setting is used as the value of `module.exports`. If this value is not provided, CJS and builtin mocks use an empty object as the value of `module.exports`.
    - `namedExports` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) An optional object whose keys and values are used to create the named exports of the mock module. If the mock is a CommonJS or builtin module, these values are copied onto `module.exports`. Therefore, if a mock is created with both named exports and a non-object default export, the mock will throw an exception when used as a CJS or builtin module.
  
 
- Returns: [\<MockModuleContext\>](/nodejs/api/test#class-mockmodulecontext) An object that can be used to manipulate the mock.

This function is used to mock the exports of ECMAScript modules, CommonJS modules, and Node.js builtin modules. Any references to the original module prior to mocking are not impacted. In order to enable module mocking, Node.js must be started with the [`--experimental-test-module-mocks`](/nodejs/api/cli#--experimental-test-module-mocks) command-line flag.

The following example demonstrates how a mock is created for a module.

```js [ESM]
test('mocks a builtin module in both module systems', async (t) => {
  // Create a mock of 'node:readline' with a named export named 'fn', which
  // does not exist in the original 'node:readline' module.
  const mock = t.mock.module('node:readline', {
    namedExports: { fn() { return 42; } },
  });

  let esmImpl = await import('node:readline');
  let cjsImpl = require('node:readline');

  // cursorTo() is an export of the original 'node:readline' module.
  assert.strictEqual(esmImpl.cursorTo, undefined);
  assert.strictEqual(cjsImpl.cursorTo, undefined);
  assert.strictEqual(esmImpl.fn(), 42);
  assert.strictEqual(cjsImpl.fn(), 42);

  mock.restore();

  // The mock is restored, so the original builtin module is returned.
  esmImpl = await import('node:readline');
  cjsImpl = require('node:readline');

  assert.strictEqual(typeof esmImpl.cursorTo, 'function');
  assert.strictEqual(typeof cjsImpl.cursorTo, 'function');
  assert.strictEqual(esmImpl.fn, undefined);
  assert.strictEqual(cjsImpl.fn, undefined);
});
```
### `mock.reset()` {#mocksetterobject-methodname-implementation-options}

**Added in: v19.1.0, v18.13.0**

This function restores the default behavior of all mocks that were previously created by this `MockTracker` and disassociates the mocks from the `MockTracker` instance. Once disassociated, the mocks can still be used, but the `MockTracker` instance can no longer be used to reset their behavior or otherwise interact with them.

After each test completes, this function is called on the test context's `MockTracker`. If the global `MockTracker` is used extensively, calling this function manually is recommended.

### `mock.restoreAll()` {#class-mocktimers}

**Added in: v19.1.0, v18.13.0**

This function restores the default behavior of all mocks that were previously created by this `MockTracker`. Unlike `mock.reset()`, `mock.restoreAll()` does not disassociate the mocks from the `MockTracker` instance.

### `mock.setter(object, methodName[, implementation][, options])` {#timersenableenableoptions}

**Added in: v19.3.0, v18.13.0**

This function is syntax sugar for [`MockTracker.method`](/nodejs/api/test#mockmethodobject-methodname-implementation-options) with `options.setter` set to `true`.

## Class: `MockTimers` {#timersreset}


::: info [History]
| Version | Changes |
| --- | --- |
| v23.1.0 | The Mock Timers is now stable. |
| v20.4.0, v18.19.0 | Added in: v20.4.0, v18.19.0 |
:::

::: tip [Stable: 2 - Stable]
[Stable: 2](/nodejs/api/documentation#stability-index) [Stability: 2](/nodejs/api/documentation#stability-index) - Stable
:::

Mocking timers is a technique commonly used in software testing to simulate and control the behavior of timers, such as `setInterval` and `setTimeout`, without actually waiting for the specified time intervals.

MockTimers is also able to mock the `Date` object.

The [`MockTracker`](/nodejs/api/test#class-mocktracker) provides a top-level `timers` export which is a `MockTimers` instance.

### `timers.enable([enableOptions])` {#timerssymboldispose}


::: info [History]
| Version | Changes |
| --- | --- |
| v21.2.0, v20.11.0 | Updated parameters to be an option object with available APIs and the default initial epoch. |
| v20.4.0, v18.19.0 | Added in: v20.4.0, v18.19.0 |
:::

Enables timer mocking for the specified timers.

- `enableOptions` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Optional configuration options for enabling timer mocking. The following properties are supported: 
    - `apis` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) An optional array containing the timers to mock. The currently supported timer values are `'setInterval'`, `'setTimeout'`, `'setImmediate'`, and `'Date'`. **Default:** `['setInterval', 'setTimeout', 'setImmediate', 'Date']`. If no array is provided, all time related APIs (`'setInterval'`, `'clearInterval'`, `'setTimeout'`, `'clearTimeout'`, `'setImmediate'`, `'clearImmediate'`, and `'Date'`) will be mocked by default.
    - `now` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<Date\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) An optional number or Date object representing the initial time (in milliseconds) to use as the value for `Date.now()`. **Default:** `0`.
  
 

**Note:** When you enable mocking for a specific timer, its associated clear function will also be implicitly mocked.

**Note:** Mocking `Date` will affect the behavior of the mocked timers as they use the same internal clock.

Example usage without setting initial time:



::: code-group
```js [ESM]
import { mock } from 'node:test';
mock.timers.enable({ apis: ['setInterval'] });
```

```js [CJS]
const { mock } = require('node:test');
mock.timers.enable({ apis: ['setInterval'] });
```
:::

The above example enables mocking for the `setInterval` timer and implicitly mocks the `clearInterval` function. Only the `setInterval` and `clearInterval` functions from [node:timers](/nodejs/api/timers), [node:timers/promises](/nodejs/api/timers#timers-promises-api), and `globalThis` will be mocked.

Example usage with initial time set



::: code-group
```js [ESM]
import { mock } from 'node:test';
mock.timers.enable({ apis: ['Date'], now: 1000 });
```

```js [CJS]
const { mock } = require('node:test');
mock.timers.enable({ apis: ['Date'], now: 1000 });
```
:::

Example usage with initial Date object as time set



::: code-group
```js [ESM]
import { mock } from 'node:test';
mock.timers.enable({ apis: ['Date'], now: new Date() });
```

```js [CJS]
const { mock } = require('node:test');
mock.timers.enable({ apis: ['Date'], now: new Date() });
```
:::

Alternatively, if you call `mock.timers.enable()` without any parameters:

All timers (`'setInterval'`, `'clearInterval'`, `'setTimeout'`, `'clearTimeout'`, `'setImmediate'`, and `'clearImmediate'`) will be mocked. The `setInterval`, `clearInterval`, `setTimeout`, `clearTimeout`, `setImmediate`, and `clearImmediate` functions from `node:timers`, `node:timers/promises`, and `globalThis` will be mocked. As well as the global `Date` object.

### `timers.reset()` {#timerstickmilliseconds}

**Added in: v20.4.0, v18.19.0**

This function restores the default behavior of all mocks that were previously created by this  `MockTimers` instance and disassociates the mocks from the  `MockTracker` instance.

**Note:** After each test completes, this function is called on the test context's  `MockTracker`.



::: code-group
```js [ESM]
import { mock } from 'node:test';
mock.timers.reset();
```

```js [CJS]
const { mock } = require('node:test');
mock.timers.reset();
```
:::

### `timers[Symbol.dispose]()` {#using-clear-functions}

Calls `timers.reset()`.

### `timers.tick([milliseconds])` {#working-with-nodejs-timers-modules}

**Added in: v20.4.0, v18.19.0**

Advances time for all mocked timers.

- `milliseconds` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The amount of time, in milliseconds, to advance the timers. **Default:** `1`.

**Note:** This diverges from how `setTimeout` in Node.js behaves and accepts only positive numbers. In Node.js, `setTimeout` with negative numbers is only supported for web compatibility reasons.

The following example mocks a `setTimeout` function and by using `.tick` advances in time triggering all pending timers.



::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('mocks setTimeout to be executed synchronously without having to actually wait for it', (context) => {
  const fn = context.mock.fn();

  context.mock.timers.enable({ apis: ['setTimeout'] });

  setTimeout(fn, 9999);

  assert.strictEqual(fn.mock.callCount(), 0);

  // Advance in time
  context.mock.timers.tick(9999);

  assert.strictEqual(fn.mock.callCount(), 1);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('mocks setTimeout to be executed synchronously without having to actually wait for it', (context) => {
  const fn = context.mock.fn();
  context.mock.timers.enable({ apis: ['setTimeout'] });

  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);

  // Advance in time
  context.mock.timers.tick(9999);

  assert.strictEqual(fn.mock.callCount(), 1);
});
```
:::

Alternatively, the `.tick` function can be called many times



::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('mocks setTimeout to be executed synchronously without having to actually wait for it', (context) => {
  const fn = context.mock.fn();
  context.mock.timers.enable({ apis: ['setTimeout'] });
  const nineSecs = 9000;
  setTimeout(fn, nineSecs);

  const threeSeconds = 3000;
  context.mock.timers.tick(threeSeconds);
  context.mock.timers.tick(threeSeconds);
  context.mock.timers.tick(threeSeconds);

  assert.strictEqual(fn.mock.callCount(), 1);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('mocks setTimeout to be executed synchronously without having to actually wait for it', (context) => {
  const fn = context.mock.fn();
  context.mock.timers.enable({ apis: ['setTimeout'] });
  const nineSecs = 9000;
  setTimeout(fn, nineSecs);

  const threeSeconds = 3000;
  context.mock.timers.tick(threeSeconds);
  context.mock.timers.tick(threeSeconds);
  context.mock.timers.tick(threeSeconds);

  assert.strictEqual(fn.mock.callCount(), 1);
});
```
:::

Advancing time using `.tick` will also advance the time for any `Date` object created after the mock was enabled (if `Date` was also set to be mocked).



::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('mocks setTimeout to be executed synchronously without having to actually wait for it', (context) => {
  const fn = context.mock.fn();

  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  setTimeout(fn, 9999);

  assert.strictEqual(fn.mock.callCount(), 0);
  assert.strictEqual(Date.now(), 0);

  // Advance in time
  context.mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);
  assert.strictEqual(Date.now(), 9999);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('mocks setTimeout to be executed synchronously without having to actually wait for it', (context) => {
  const fn = context.mock.fn();
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });

  setTimeout(fn, 9999);
  assert.strictEqual(fn.mock.callCount(), 0);
  assert.strictEqual(Date.now(), 0);

  // Advance in time
  context.mock.timers.tick(9999);
  assert.strictEqual(fn.mock.callCount(), 1);
  assert.strictEqual(Date.now(), 9999);
});
```
:::

#### Using clear functions {#timersrunall}

As mentioned, all clear functions from timers (`clearTimeout`, `clearInterval`,and `clearImmediate`) are implicitly mocked. Take a look at this example using `setTimeout`:



::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('mocks setTimeout to be executed synchronously without having to actually wait for it', (context) => {
  const fn = context.mock.fn();

  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['setTimeout'] });
  const id = setTimeout(fn, 9999);

  // Implicitly mocked as well
  clearTimeout(id);
  context.mock.timers.tick(9999);

  // As that setTimeout was cleared the mock function will never be called
  assert.strictEqual(fn.mock.callCount(), 0);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('mocks setTimeout to be executed synchronously without having to actually wait for it', (context) => {
  const fn = context.mock.fn();

  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['setTimeout'] });
  const id = setTimeout(fn, 9999);

  // Implicitly mocked as well
  clearTimeout(id);
  context.mock.timers.tick(9999);

  // As that setTimeout was cleared the mock function will never be called
  assert.strictEqual(fn.mock.callCount(), 0);
});
```
:::

#### Working with Node.js timers modules {#timerssettimemilliseconds}

Once you enable mocking timers, [node:timers](/nodejs/api/timers), [node:timers/promises](/nodejs/api/timers#timers-promises-api) modules, and timers from the Node.js global context are enabled:

**Note:** Destructuring functions such as `import { setTimeout } from 'node:timers'` is currently not supported by this API.



::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';
import nodeTimers from 'node:timers';
import nodeTimersPromises from 'node:timers/promises';

test('mocks setTimeout to be executed synchronously without having to actually wait for it', async (context) => {
  const globalTimeoutObjectSpy = context.mock.fn();
  const nodeTimerSpy = context.mock.fn();
  const nodeTimerPromiseSpy = context.mock.fn();

  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(globalTimeoutObjectSpy, 9999);
  nodeTimers.setTimeout(nodeTimerSpy, 9999);

  const promise = nodeTimersPromises.setTimeout(9999).then(nodeTimerPromiseSpy);

  // Advance in time
  context.mock.timers.tick(9999);
  assert.strictEqual(globalTimeoutObjectSpy.mock.callCount(), 1);
  assert.strictEqual(nodeTimerSpy.mock.callCount(), 1);
  await promise;
  assert.strictEqual(nodeTimerPromiseSpy.mock.callCount(), 1);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');
const nodeTimers = require('node:timers');
const nodeTimersPromises = require('node:timers/promises');

test('mocks setTimeout to be executed synchronously without having to actually wait for it', async (context) => {
  const globalTimeoutObjectSpy = context.mock.fn();
  const nodeTimerSpy = context.mock.fn();
  const nodeTimerPromiseSpy = context.mock.fn();

  // Optionally choose what to mock
  context.mock.timers.enable({ apis: ['setTimeout'] });
  setTimeout(globalTimeoutObjectSpy, 9999);
  nodeTimers.setTimeout(nodeTimerSpy, 9999);

  const promise = nodeTimersPromises.setTimeout(9999).then(nodeTimerPromiseSpy);

  // Advance in time
  context.mock.timers.tick(9999);
  assert.strictEqual(globalTimeoutObjectSpy.mock.callCount(), 1);
  assert.strictEqual(nodeTimerSpy.mock.callCount(), 1);
  await promise;
  assert.strictEqual(nodeTimerPromiseSpy.mock.callCount(), 1);
});
```
:::

In Node.js, `setInterval` from [node:timers/promises](/nodejs/api/timers#timers-promises-api) is an `AsyncGenerator` and is also supported by this API:



::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';
import nodeTimersPromises from 'node:timers/promises';
test('should tick five times testing a real use case', async (context) => {
  context.mock.timers.enable({ apis: ['setInterval'] });

  const expectedIterations = 3;
  const interval = 1000;
  const startedAt = Date.now();
  async function run() {
    const times = [];
    for await (const time of nodeTimersPromises.setInterval(interval, startedAt)) {
      times.push(time);
      if (times.length === expectedIterations) break;
    }
    return times;
  }

  const r = run();
  context.mock.timers.tick(interval);
  context.mock.timers.tick(interval);
  context.mock.timers.tick(interval);

  const timeResults = await r;
  assert.strictEqual(timeResults.length, expectedIterations);
  for (let it = 1; it < expectedIterations; it++) {
    assert.strictEqual(timeResults[it - 1], startedAt + (interval * it));
  }
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');
const nodeTimersPromises = require('node:timers/promises');
test('should tick five times testing a real use case', async (context) => {
  context.mock.timers.enable({ apis: ['setInterval'] });

  const expectedIterations = 3;
  const interval = 1000;
  const startedAt = Date.now();
  async function run() {
    const times = [];
    for await (const time of nodeTimersPromises.setInterval(interval, startedAt)) {
      times.push(time);
      if (times.length === expectedIterations) break;
    }
    return times;
  }

  const r = run();
  context.mock.timers.tick(interval);
  context.mock.timers.tick(interval);
  context.mock.timers.tick(interval);

  const timeResults = await r;
  assert.strictEqual(timeResults.length, expectedIterations);
  for (let it = 1; it < expectedIterations; it++) {
    assert.strictEqual(timeResults[it - 1], startedAt + (interval * it));
  }
});
```
:::

### `timers.runAll()` {#dates-and-timers-working-together}

**Added in: v20.4.0, v18.19.0**

Triggers all pending mocked timers immediately. If the `Date` object is also mocked, it will also advance the `Date` object to the furthest timer's time.

The example below triggers all pending timers immediately, causing them to execute without any delay.



::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('runAll functions following the given order', (context) => {
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const results = [];
  setTimeout(() => results.push(1), 9999);

  // Notice that if both timers have the same timeout,
  // the order of execution is guaranteed
  setTimeout(() => results.push(3), 8888);
  setTimeout(() => results.push(2), 8888);

  assert.deepStrictEqual(results, []);

  context.mock.timers.runAll();
  assert.deepStrictEqual(results, [3, 2, 1]);
  // The Date object is also advanced to the furthest timer's time
  assert.strictEqual(Date.now(), 9999);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('runAll functions following the given order', (context) => {
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const results = [];
  setTimeout(() => results.push(1), 9999);

  // Notice that if both timers have the same timeout,
  // the order of execution is guaranteed
  setTimeout(() => results.push(3), 8888);
  setTimeout(() => results.push(2), 8888);

  assert.deepStrictEqual(results, []);

  context.mock.timers.runAll();
  assert.deepStrictEqual(results, [3, 2, 1]);
  // The Date object is also advanced to the furthest timer's time
  assert.strictEqual(Date.now(), 9999);
});
```
:::

**Note:** The `runAll()` function is specifically designed for triggering timers in the context of timer mocking. It does not have any effect on real-time system clocks or actual timers outside of the mocking environment.

### `timers.setTime(milliseconds)` {#class-testsstream}

**Added in: v21.2.0, v20.11.0**

Sets the current Unix timestamp that will be used as reference for any mocked `Date` objects.



::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('runAll functions following the given order', (context) => {
  const now = Date.now();
  const setTime = 1000;
  // Date.now is not mocked
  assert.deepStrictEqual(Date.now(), now);

  context.mock.timers.enable({ apis: ['Date'] });
  context.mock.timers.setTime(setTime);
  // Date.now is now 1000
  assert.strictEqual(Date.now(), setTime);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('setTime replaces current time', (context) => {
  const now = Date.now();
  const setTime = 1000;
  // Date.now is not mocked
  assert.deepStrictEqual(Date.now(), now);

  context.mock.timers.enable({ apis: ['Date'] });
  context.mock.timers.setTime(setTime);
  // Date.now is now 1000
  assert.strictEqual(Date.now(), setTime);
});
```
:::

#### Dates and Timers working together {#event-testcoverage}

Dates and timer objects are dependent on each other. If you use `setTime()` to pass the current time to the mocked `Date` object, the set timers with `setTimeout` and `setInterval` will **not** be affected.

However, the `tick` method **will** advanced the mocked `Date` object.



::: code-group
```js [ESM]
import assert from 'node:assert';
import { test } from 'node:test';

test('runAll functions following the given order', (context) => {
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const results = [];
  setTimeout(() => results.push(1), 9999);

  assert.deepStrictEqual(results, []);
  context.mock.timers.setTime(12000);
  assert.deepStrictEqual(results, []);
  // The date is advanced but the timers don't tick
  assert.strictEqual(Date.now(), 12000);
});
```

```js [CJS]
const assert = require('node:assert');
const { test } = require('node:test');

test('runAll functions following the given order', (context) => {
  context.mock.timers.enable({ apis: ['setTimeout', 'Date'] });
  const results = [];
  setTimeout(() => results.push(1), 9999);

  assert.deepStrictEqual(results, []);
  context.mock.timers.setTime(12000);
  assert.deepStrictEqual(results, []);
  // The date is advanced but the timers don't tick
  assert.strictEqual(Date.now(), 12000);
});
```
:::

## Class: `TestsStream` {#event-testcomplete}


::: info [History]
| Version | Changes |
| --- | --- |
| v20.0.0, v19.9.0, v18.17.0 | added type to test:pass and test:fail events for when the test is a suite. |
| v18.9.0, v16.19.0 | Added in: v18.9.0, v16.19.0 |
:::

- Extends [\<Readable\>](/nodejs/api/stream#class-streamreadable)

A successful call to [`run()`](/nodejs/api/test#runoptions) method will return a new [\<TestsStream\>](/nodejs/api/test#class-testsstream) object, streaming a series of events representing the execution of the tests. `TestsStream` will emit events, in the order of the tests definition

Some of the events are guaranteed to be emitted in the same order as the tests are defined, while others are emitted in the order that the tests execute.

### Event: `'test:coverage'` {#event-testdequeue}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `summary` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) An object containing the coverage report. 
    - `files` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) An array of coverage reports for individual files. Each report is an object with the following schema: 
    - `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The absolute path of the file.
    - `totalLineCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The total number of lines.
    - `totalBranchCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The total number of branches.
    - `totalFunctionCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The total number of functions.
    - `coveredLineCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The number of covered lines.
    - `coveredBranchCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The number of covered branches.
    - `coveredFunctionCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The number of covered functions.
    - `coveredLinePercent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The percentage of lines covered.
    - `coveredBranchPercent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The percentage of branches covered.
    - `coveredFunctionPercent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The percentage of functions covered.
    - `functions` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) An array of functions representing function coverage. 
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The name of the function.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The line number where the function is defined.
    - `count` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The number of times the function was called.
  
 
    - `branches` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) An array of branches representing branch coverage. 
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The line number where the branch is defined.
    - `count` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The number of times the branch was taken.
  
 
    - `lines` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) An array of lines representing line numbers and the number of times they were covered. 
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The line number.
    - `count` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The number of times the line was covered.
  
 
  
 
    - `thresholds` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) An object containing whether or not the coverage for each coverage type. 
    - `function` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The function coverage threshold.
    - `branch` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The branch coverage threshold.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The line coverage threshold.
  
 
    - `totals` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) An object containing a summary of coverage for all files. 
    - `totalLineCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The total number of lines.
    - `totalBranchCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The total number of branches.
    - `totalFunctionCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The total number of functions.
    - `coveredLineCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The number of covered lines.
    - `coveredBranchCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The number of covered branches.
    - `coveredFunctionCount` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The number of covered functions.
    - `coveredLinePercent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The percentage of lines covered.
    - `coveredBranchPercent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The percentage of branches covered.
    - `coveredFunctionPercent` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The percentage of functions covered.
  
 
    - `workingDirectory` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The working directory when code coverage began. This is useful for displaying relative path names in case the tests changed the working directory of the Node.js process.
  
 
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The nesting level of the test.
  
 

Emitted when code coverage is enabled and all tests have completed.

### Event: `'test:complete'` {#event-testdiagnostic}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) The column number where the test is defined, or `undefined` if the test was run through the REPL.
    - `details` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Additional execution metadata. 
    - `passed` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Whether the test passed or not.
    - `duration_ms` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The duration of the test in milliseconds.
    - `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) An error wrapping the error thrown by the test if it did not pass. 
    - `cause` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) The actual error thrown by the test.
  
 
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) The type of the test, used to denote whether this is a suite.
  
 
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) The path of the test file, `undefined` if test was run through the REPL.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) The line number where the test is defined, or `undefined` if the test was run through the REPL.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The test name.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The nesting level of the test.
    - `testNumber` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The ordinal number of the test.
    - `todo` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Present if [`context.todo`](/nodejs/api/test#contexttodomessage) is called
    - `skip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Present if [`context.skip`](/nodejs/api/test#contextskipmessage) is called
  
 

Emitted when a test completes its execution. This event is not emitted in the same order as the tests are defined. The corresponding declaration ordered events are `'test:pass'` and `'test:fail'`.

### Event: `'test:dequeue'` {#event-testenqueue}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) The column number where the test is defined, or `undefined` if the test was run through the REPL.
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) The path of the test file, `undefined` if test was run through the REPL.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) The line number where the test is defined, or `undefined` if the test was run through the REPL.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The test name.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The nesting level of the test.
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The test type. Either `'suite'` or `'test'`.
  
 

Emitted when a test is dequeued, right before it is executed. This event is not guaranteed to be emitted in the same order as the tests are defined. The corresponding declaration ordered event is `'test:start'`.

### Event: `'test:diagnostic'` {#event-testfail}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) The column number where the test is defined, or `undefined` if the test was run through the REPL.
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) The path of the test file, `undefined` if test was run through the REPL.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) The line number where the test is defined, or `undefined` if the test was run through the REPL.
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The diagnostic message.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The nesting level of the test.
  
 

Emitted when [`context.diagnostic`](/nodejs/api/test#contextdiagnosticmessage) is called. This event is guaranteed to be emitted in the same order as the tests are defined.

### Event: `'test:enqueue'` {#event-testpass}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) The column number where the test is defined, or `undefined` if the test was run through the REPL.
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) The path of the test file, `undefined` if test was run through the REPL.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) The line number where the test is defined, or `undefined` if the test was run through the REPL.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The test name.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The nesting level of the test.
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The test type. Either `'suite'` or `'test'`.
  
 

Emitted when a test is enqueued for execution.

### Event: `'test:fail'` {#event-testplan}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) The column number where the test is defined, or `undefined` if the test was run through the REPL.
    - `details` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Additional execution metadata. 
    - `duration_ms` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The duration of the test in milliseconds.
    - `error` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) An error wrapping the error thrown by the test. 
    - `cause` [\<Error\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) The actual error thrown by the test.
  
 
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) The type of the test, used to denote whether this is a suite.
  
 
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) The path of the test file, `undefined` if test was run through the REPL.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) The line number where the test is defined, or `undefined` if the test was run through the REPL.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The test name.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The nesting level of the test.
    - `testNumber` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The ordinal number of the test.
    - `todo` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Present if [`context.todo`](/nodejs/api/test#contexttodomessage) is called
    - `skip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Present if [`context.skip`](/nodejs/api/test#contextskipmessage) is called
  
 

Emitted when a test fails. This event is guaranteed to be emitted in the same order as the tests are defined. The corresponding execution ordered event is `'test:complete'`.

### Event: `'test:pass'` {#event-teststart}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) The column number where the test is defined, or `undefined` if the test was run through the REPL.
    - `details` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Additional execution metadata. 
    - `duration_ms` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The duration of the test in milliseconds.
    - `type` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) The type of the test, used to denote whether this is a suite.
  
 
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) The path of the test file, `undefined` if test was run through the REPL.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) The line number where the test is defined, or `undefined` if the test was run through the REPL.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The test name.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The nesting level of the test.
    - `testNumber` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The ordinal number of the test.
    - `todo` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Present if [`context.todo`](/nodejs/api/test#contexttodomessage) is called
    - `skip` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) Present if [`context.skip`](/nodejs/api/test#contextskipmessage) is called
  
 

Emitted when a test passes. This event is guaranteed to be emitted in the same order as the tests are defined. The corresponding execution ordered event is `'test:complete'`.

### Event: `'test:plan'` {#event-teststderr}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) The column number where the test is defined, or `undefined` if the test was run through the REPL.
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) The path of the test file, `undefined` if test was run through the REPL.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) The line number where the test is defined, or `undefined` if the test was run through the REPL.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The nesting level of the test.
    - `count` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The number of subtests that have ran.
  
 

Emitted when all subtests have completed for a given test. This event is guaranteed to be emitted in the same order as the tests are defined.

### Event: `'test:start'` {#event-teststdout}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `column` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) The column number where the test is defined, or `undefined` if the test was run through the REPL.
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) The path of the test file, `undefined` if test was run through the REPL.
    - `line` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) The line number where the test is defined, or `undefined` if the test was run through the REPL.
    - `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The test name.
    - `nesting` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The nesting level of the test.
  
 

Emitted when a test starts reporting its own and its subtests status. This event is guaranteed to be emitted in the same order as the tests are defined. The corresponding execution ordered event is `'test:dequeue'`.

### Event: `'test:stderr'` {#event-testsummary}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The path of the test file.
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The message written to `stderr`.
  
 

Emitted when a running test writes to `stderr`. This event is only emitted if `--test` flag is passed. This event is not guaranteed to be emitted in the same order as the tests are defined.

### Event: `'test:stdout'` {#event-testwatchdrained}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The path of the test file.
    - `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The message written to `stdout`.
  
 

Emitted when a running test writes to `stdout`. This event is only emitted if `--test` flag is passed. This event is not guaranteed to be emitted in the same order as the tests are defined.

### Event: `'test:summary'` {#class-testcontext}

- `data` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) 
    - `counts` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) An object containing the counts of various test results. 
    - `cancelled` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The total number of cancelled tests.
    - `failed` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The total number of failed tests.
    - `passed` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The total number of passed tests.
    - `skipped` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The total number of skipped tests.
    - `suites` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The total number of suites run.
    - `tests` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The total number of tests run, excluding suites.
    - `todo` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The total number of TODO tests.
    - `topLevel` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The total number of top level tests and suites.
  
 
    - `duration_ms` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The duration of the test run in milliseconds.
    - `file` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<undefined\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) The path of the test file that generated the summary. If the summary corresponds to multiple files, this value is `undefined`.
    - `success` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Indicates whether or not the test run is considered successful or not. If any error condition occurs, such as a failing test or unmet coverage threshold, this value will be set to `false`.
  
 

Emitted when a test run completes. This event contains metrics pertaining to the completed test run, and is useful for determining if a test run passed or failed. If process-level test isolation is used, a `'test:summary'` event is generated for each test file in addition to a final cumulative summary.

### Event: `'test:watch:drained'` {#contextbeforefn-options}

Emitted when no more tests are queued for execution in watch mode.

## Class: `TestContext` {#contextbeforeeachfn-options}


::: info [History]
| Version | Changes |
| --- | --- |
| v20.1.0, v18.17.0 | The `before` function was added to TestContext. |
| v18.0.0, v16.17.0 | Added in: v18.0.0, v16.17.0 |
:::

An instance of `TestContext` is passed to each test function in order to interact with the test runner. However, the `TestContext` constructor is not exposed as part of the API.

### `context.before([fn][, options])` {#contextafterfn-options}

**Added in: v20.1.0, v18.17.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) The hook function. The first argument to this function is a [`TestContext`](/nodejs/api/test#class-testcontext) object. If the hook uses callbacks, the callback function is passed as the second argument. **Default:** A no-op function.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Configuration options for the hook. The following properties are supported: 
    - `signal` [\<AbortSignal\>](/nodejs/api/globals#class-abortsignal) Allows aborting an in-progress hook.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) A number of milliseconds the hook will fail after. If unspecified, subtests inherit this value from their parent. **Default:** `Infinity`.
  
 

This function is used to create a hook running before subtest of the current test.

### `context.beforeEach([fn][, options])` {#contextaftereachfn-options}

**Added in: v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) The hook function. The first argument to this function is a [`TestContext`](/nodejs/api/test#class-testcontext) object. If the hook uses callbacks, the callback function is passed as the second argument. **Default:** A no-op function.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Configuration options for the hook. The following properties are supported: 
    - `signal` [\<AbortSignal\>](/nodejs/api/globals#class-abortsignal) Allows aborting an in-progress hook.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) A number of milliseconds the hook will fail after. If unspecified, subtests inherit this value from their parent. **Default:** `Infinity`.
  
 

This function is used to create a hook running before each subtest of the current test.

```js [ESM]
test('top level test', async (t) => {
  t.beforeEach((t) => t.diagnostic(`about to run ${t.name}`));
  await t.test(
    'This is a subtest',
    (t) => {
      assert.ok('some relevant assertion here');
    },
  );
});
```
### `context.after([fn][, options])` {#contextassert}

**Added in: v19.3.0, v18.13.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) The hook function. The first argument to this function is a [`TestContext`](/nodejs/api/test#class-testcontext) object. If the hook uses callbacks, the callback function is passed as the second argument. **Default:** A no-op function.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Configuration options for the hook. The following properties are supported: 
    - `signal` [\<AbortSignal\>](/nodejs/api/globals#class-abortsignal) Allows aborting an in-progress hook.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) A number of milliseconds the hook will fail after. If unspecified, subtests inherit this value from their parent. **Default:** `Infinity`.
  
 

This function is used to create a hook that runs after the current test finishes.

```js [ESM]
test('top level test', async (t) => {
  t.after((t) => t.diagnostic(`finished running ${t.name}`));
  assert.ok('some relevant assertion here');
});
```
### `context.afterEach([fn][, options])` {#contextassertsnapshotvalue-options}

**Added in: v18.8.0, v16.18.0**

- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) The hook function. The first argument to this function is a [`TestContext`](/nodejs/api/test#class-testcontext) object. If the hook uses callbacks, the callback function is passed as the second argument. **Default:** A no-op function.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Configuration options for the hook. The following properties are supported: 
    - `signal` [\<AbortSignal\>](/nodejs/api/globals#class-abortsignal) Allows aborting an in-progress hook.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) A number of milliseconds the hook will fail after. If unspecified, subtests inherit this value from their parent. **Default:** `Infinity`.
  
 

This function is used to create a hook running after each subtest of the current test.

```js [ESM]
test('top level test', async (t) => {
  t.afterEach((t) => t.diagnostic(`finished running ${t.name}`));
  await t.test(
    'This is a subtest',
    (t) => {
      assert.ok('some relevant assertion here');
    },
  );
});
```
### `context.assert` {#contextdiagnosticmessage}

**Added in: v22.2.0, v20.15.0**

An object containing assertion methods bound to `context`. The top-level functions from the `node:assert` module are exposed here for the purpose of creating test plans.

```js [ESM]
test('test', (t) => {
  t.plan(1);
  t.assert.strictEqual(true, true);
});
```
#### `context.assert.fileSnapshot(value, path[, options])` {#contextfilepath}

**Added in: v23.7.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) A value to serialize to a string. If Node.js was started with the [`--test-update-snapshots`](/nodejs/api/cli#--test-update-snapshots) flag, the serialized value is written to `path`. Otherwise, the serialized value is compared to the contents of the existing snapshot file.
- `path` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The file where the serialized `value` is written.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Optional configuration options. The following properties are supported: 
    - `serializers` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) An array of synchronous functions used to serialize `value` into a string. `value` is passed as the only argument to the first serializer function. The return value of each serializer is passed as input to the next serializer. Once all serializers have run, the resulting value is coerced to a string. **Default:** If no serializers are provided, the test runner's default serializers are used.
  
 

This function serializes `value` and writes it to the file specified by `path`.

```js [ESM]
test('snapshot test with default serialization', (t) => {
  t.assert.fileSnapshot({ value1: 1, value2: 2 }, './snapshots/snapshot.json');
});
```
This function differs from `context.assert.snapshot()` in the following ways:

- The snapshot file path is explicitly provided by the user.
- Each snapshot file is limited to a single snapshot value.
- No additional escaping is performed by the test runner.

These differences allow snapshot files to better support features such as syntax highlighting.

#### `context.assert.snapshot(value[, options])` {#contextfullname}

**Added in: v22.3.0**

- `value` [\<any\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) A value to serialize to a string. If Node.js was started with the [`--test-update-snapshots`](/nodejs/api/cli#--test-update-snapshots) flag, the serialized value is written to the snapshot file. Otherwise, the serialized value is compared to the corresponding value in the existing snapshot file.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Optional configuration options. The following properties are supported: 
    - `serializers` [\<Array\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) An array of synchronous functions used to serialize `value` into a string. `value` is passed as the only argument to the first serializer function. The return value of each serializer is passed as input to the next serializer. Once all serializers have run, the resulting value is coerced to a string. **Default:** If no serializers are provided, the test runner's default serializers are used.
  
 

This function implements assertions for snapshot testing.

```js [ESM]
test('snapshot test with default serialization', (t) => {
  t.assert.snapshot({ value1: 1, value2: 2 });
});

test('snapshot test with custom serialization', (t) => {
  t.assert.snapshot({ value3: 3, value4: 4 }, {
    serializers: [(value) => JSON.stringify(value)],
  });
});
```
### `context.diagnostic(message)` {#contextname}

**Added in: v18.0.0, v16.17.0**

- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Message to be reported.

This function is used to write diagnostics to the output. Any diagnostic information is included at the end of the test's results. This function does not return a value.

```js [ESM]
test('top level test', (t) => {
  t.diagnostic('A diagnostic message');
});
```
### `context.filePath` {#contextplancount}

**Added in: v22.6.0, v20.16.0**

The absolute path of the test file that created the current test. If a test file imports additional modules that generate tests, the imported tests will return the path of the root test file.

### `context.fullName` {#contextrunonlyshouldrunonlytests}

**Added in: v22.3.0**

The name of the test and each of its ancestors, separated by `\>`.

### `context.name` {#contextsignal}

**Added in: v18.8.0, v16.18.0**

The name of the test.

### `context.plan(count)` {#contextskipmessage}


::: info [History]
| Version | Changes |
| --- | --- |
| v23.4.0 | This function is no longer experimental. |
| v22.2.0, v20.15.0 | Added in: v22.2.0, v20.15.0 |
:::

- `count` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The number of assertions and subtests that are expected to run.

This function is used to set the number of assertions and subtests that are expected to run within the test. If the number of assertions and subtests that run does not match the expected count, the test will fail.

```js [ESM]
test('top level test', (t) => {
  t.plan(2);
  t.assert.ok('some relevant assertion here');
  t.test('subtest', () => {});
});
```
When working with asynchronous code, the `plan` function can be used to ensure that the correct number of assertions are run:

```js [ESM]
test('planning with streams', (t, done) => {
  function* generate() {
    yield 'a';
    yield 'b';
    yield 'c';
  }
  const expected = ['a', 'b', 'c'];
  t.plan(expected.length);
  const stream = Readable.from(generate());
  stream.on('data', (chunk) => {
    t.assert.strictEqual(chunk, expected.shift());
  });

  stream.on('end', () => {
    done();
  });
});
```
### `context.runOnly(shouldRunOnlyTests)` {#contexttodomessage}

**Added in: v18.0.0, v16.17.0**

- `shouldRunOnlyTests` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Whether or not to run `only` tests.

If `shouldRunOnlyTests` is truthy, the test context will only run tests that have the `only` option set. Otherwise, all tests are run. If Node.js was not started with the [`--test-only`](/nodejs/api/cli#--test-only) command-line option, this function is a no-op.

```js [ESM]
test('top level test', (t) => {
  // The test context can be set to run subtests with the 'only' option.
  t.runOnly(true);
  return Promise.all([
    t.test('this subtest is now skipped'),
    t.test('this subtest is run', { only: true }),
  ]);
});
```
### `context.signal` {#contexttestname-options-fn}

**Added in: v18.7.0, v16.17.0**

- Type: [\<AbortSignal\>](/nodejs/api/globals#class-abortsignal)

Can be used to abort test subtasks when the test has been aborted.

```js [ESM]
test('top level test', async (t) => {
  await fetch('some/uri', { signal: t.signal });
});
```
### `context.skip([message])` {#class-suitecontext}

**Added in: v18.0.0, v16.17.0**

- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Optional skip message.

This function causes the test's output to indicate the test as skipped. If `message` is provided, it is included in the output. Calling `skip()` does not terminate execution of the test function. This function does not return a value.

```js [ESM]
test('top level test', (t) => {
  // Make sure to return here as well if the test contains additional logic.
  t.skip('this is skipped');
});
```
### `context.todo([message])` {#contextfilepath_1}

**Added in: v18.0.0, v16.17.0**

- `message` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Optional `TODO` message.

This function adds a `TODO` directive to the test's output. If `message` is provided, it is included in the output. Calling `todo()` does not terminate execution of the test function. This function does not return a value.

```js [ESM]
test('top level test', (t) => {
  // This test is marked as `TODO`
  t.todo('this is a todo');
});
```
### `context.test([name][, options][, fn])` {#contextname_1}


::: info [History]
| Version | Changes |
| --- | --- |
| v18.8.0, v16.18.0 | Add a `signal` option. |
| v18.7.0, v16.17.0 | Add a `timeout` option. |
| v18.0.0, v16.17.0 | Added in: v18.0.0, v16.17.0 |
:::

- `name` [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The name of the subtest, which is displayed when reporting test results. **Default:** The `name` property of `fn`, or `'\<anonymous\>'` if `fn` does not have a name.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) Configuration options for the subtest. The following properties are supported: 
    - `concurrency` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<null\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) If a number is provided, then that many tests would run in parallel within the application thread. If `true`, it would run all subtests in parallel. If `false`, it would only run one test at a time. If unspecified, subtests inherit this value from their parent. **Default:** `null`.
    - `only` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) If truthy, and the test context is configured to run `only` tests, then this test will be run. Otherwise, the test is skipped. **Default:** `false`.
    - `signal` [\<AbortSignal\>](/nodejs/api/globals#class-abortsignal) Allows aborting an in-progress test.
    - `skip` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) If truthy, the test is skipped. If a string is provided, that string is displayed in the test results as the reason for skipping the test. **Default:** `false`.
    - `todo` [\<boolean\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) | [\<string\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) If truthy, the test marked as `TODO`. If a string is provided, that string is displayed in the test results as the reason why the test is `TODO`. **Default:** `false`.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) A number of milliseconds the test will fail after. If unspecified, subtests inherit this value from their parent. **Default:** `Infinity`.
    - `plan` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The number of assertions and subtests expected to be run in the test. If the number of assertions run in the test does not match the number specified in the plan, the test will fail. **Default:** `undefined`.
  
 
- `fn` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) The function under test. The first argument to this function is a [`TestContext`](/nodejs/api/test#class-testcontext) object. If the test uses callbacks, the callback function is passed as the second argument. **Default:** A no-op function.
- Returns: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Fulfilled with `undefined` once the test completes.

This function is used to create subtests under the current test. This function behaves in the same fashion as the top level [`test()`](/nodejs/api/test#testname-options-fn) function.

```js [ESM]
test('top level test', async (t) => {
  await t.test(
    'This is a subtest',
    { only: false, skip: false, concurrency: 1, todo: false, plan: 1 },
    (t) => {
      t.assert.ok('some relevant assertion here');
    },
  );
});
```
### `context.waitFor(condition[, options])` {#contextsignal_1}

**Added in: v23.7.0**

- `condition` [\<Function\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) | [\<AsyncFunction\>](https://tc39.es/ecma262/#sec-async-function-constructor) An assertion function that is invoked periodically until it completes successfully or the defined polling timeout elapses. Successful completion is defined as not throwing or rejecting. This function does not accept any arguments, and is allowed to return any value.
- `options` [\<Object\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) An optional configuration object for the polling operation. The following properties are supported: 
    - `interval` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The number of milliseconds to wait after an unsuccessful invocation of `condition` before trying again. **Default:** `50`.
    - `timeout` [\<number\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The poll timeout in milliseconds. If `condition` has not succeeded by the time this elapses, an error occurs. **Default:** `1000`.
  
 
- Returns: [\<Promise\>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) Fulfilled with the value returned by `condition`.

This method polls a `condition` function until that function either returns successfully or the operation times out.

## Class: `SuiteContext`

**Added in: v18.7.0, v16.17.0**

An instance of `SuiteContext` is passed to each suite function in order to interact with the test runner. However, the `SuiteContext` constructor is not exposed as part of the API.

### `context.filePath`

**Added in: v22.6.0**

The absolute path of the test file that created the current suite. If a test file imports additional modules that generate suites, the imported suites will return the path of the root test file.

### `context.name`

**Added in: v18.8.0, v16.18.0**

The name of the suite.

### `context.signal`

**Added in: v18.7.0, v16.17.0**

- Type: [\<AbortSignal\>](/nodejs/api/globals#class-abortsignal)

Can be used to abort test subtasks when the test has been aborted.

