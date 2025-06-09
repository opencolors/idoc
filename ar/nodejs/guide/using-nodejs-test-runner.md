---
title: استخدام أداة اختبار Node.js
description: دليل حول إعداد واستخدام أداة الاختبار المدمجة في Node.js، بما في ذلك الإعداد العام، واختبارات عمال الخدمة، واختبارات اللقطات، واختبارات الوحدات، واختبارات واجهة المستخدم.
head:
  - - meta
    - name: og:title
      content: استخدام أداة اختبار Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: دليل حول إعداد واستخدام أداة الاختبار المدمجة في Node.js، بما في ذلك الإعداد العام، واختبارات عمال الخدمة، واختبارات اللقطات، واختبارات الوحدات، واختبارات واجهة المستخدم.
  - - meta
    - name: twitter:title
      content: استخدام أداة اختبار Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: دليل حول إعداد واستخدام أداة الاختبار المدمجة في Node.js، بما في ذلك الإعداد العام، واختبارات عمال الخدمة، واختبارات اللقطات، واختبارات الوحدات، واختبارات واجهة المستخدم.
---


# استخدام مُشغِّل اختبار Node.js

يحتوي Node.js على مُشغِّل اختبار مدمج مرن وقوي. سيوضح لك هذا الدليل كيفية إعداده واستخدامه.

::: code-group
```bash [نظرة عامة على البنية]
example/
  ├ …
  ├ src/
    ├ app/…
    └ sw/…
  └ test/
    ├ globals/
      ├ …
      ├ IndexedDb.js
      └ ServiceWorkerGlobalScope.js
    ├ setup.mjs
    ├ setup.units.mjs
    └ setup.ui.mjs
```
```bash [تثبيت التبعيات]
npm init -y
npm install --save-dev concurrently
```
```json [package.json]
{
  "name": "example",
  "scripts": {
    "test": "concurrently --kill-others-on-fail --prefix none npm:test:*",
    "test:sw": "node --import ./test/setup.sw.mjs --test './src/sw/**/*.spec.*'",
    "test:units": "node --import ./test/setup.units.mjs --test './src/app/**/*.spec.*'",
    "test:ui": "node --import ./test/setup.ui.mjs --test './src/app/**/*.test.*'"
  }
}
```
:::

::: info NOTE
تتطلب التعبيرات النمطية node v21+، ويجب أن تكون التعبيرات النمطية نفسها مُغلفة بعلامات اقتباس (بدون ذلك، ستحصل على سلوك مختلف عما هو متوقع، حيث قد يبدو في البداية أنه يعمل ولكنه ليس كذلك).
:::

هناك بعض الأشياء التي تريدها دائمًا، لذا ضعها في ملف إعداد أساسي مثل ما يلي. سيتم استيراد هذا الملف بواسطة عمليات إعداد أخرى أكثر تخصيصًا.

## إعداد عام

```js 
import { register } from 'node:module';
register('some-typescript-loader');
// TypeScript مدعومة من الآن فصاعدًا
// ولكن ملفات test/setup.*.mjs الأخرى يجب أن تظل JavaScript عادية!
```

ثم لكل إعداد، قم بإنشاء ملف `setup` مخصص (مع التأكد من استيراد ملف `setup.mjs` الأساسي داخل كل منها). هناك عدد من الأسباب لعزل عمليات الإعداد، ولكن السبب الأكثر وضوحًا هو [YAGNI](https://en.wikipedia.org/wiki/You_aren't_gonna_need_it) + الأداء: الكثير مما قد تقوم بإعداده عبارة عن نماذج/بدائل خاصة بالبيئة، والتي يمكن أن تكون باهظة الثمن وستؤدي إلى إبطاء عمليات تشغيل الاختبار. أنت تريد تجنب هذه التكاليف (الأموال الحرفية التي تدفعها لـ CI، والوقت الذي تقضيه في انتظار انتهاء الاختبارات، وما إلى ذلك) عندما لا تحتاج إليها.

تم أخذ كل مثال أدناه من مشاريع واقعية؛ قد لا تكون مناسبة/قابلة للتطبيق على مشروعك، لكن كل منها يوضح مفاهيم عامة قابلة للتطبيق على نطاق واسع.


## اختبارات ServiceWorker

يحتوي `ServiceWorkerGlobalScope` على واجهات برمجة تطبيقات محددة جدًا غير موجودة في بيئات أخرى، وبعض واجهات برمجة التطبيقات الخاصة به تشبه ظاهريًا واجهات أخرى (مثل `fetch`) ولكنها تتمتع بسلوك معزز. أنت لا تريد أن تنسكب هذه في اختبارات غير ذات صلة.

```js
import { beforeEach } from 'node:test';

import { ServiceWorkerGlobalScope } from './globals/ServiceWorkerGlobalScope.js';

import './setup.mjs'; // 💡

beforeEach(globalSWBeforeEach);
function globalSWBeforeEach() {
  globalThis.self = new ServiceWorkerGlobalScope();
}
```
```js
import assert from 'node:assert/strict';
import { describe, mock, it } from 'node:test';

import { onActivate } from './onActivate.js';

describe('ServiceWorker::onActivate()', () => {
  const globalSelf = globalThis.self;
  const claim = mock.fn(async function mock__claim() {});
  const matchAll = mock.fn(async function mock__matchAll() {});

  class ActivateEvent extends Event {
    constructor(...args) {
      super('activate', ...args);
    }
  }

  before(() => {
    globalThis.self = {
      clients: { claim, matchAll },
    };
  });
  after(() => {
    global.self = globalSelf;
  });

  it('should claim all clients', async () => {
    await onActivate(new ActivateEvent());

    assert.equal(claim.mock.callCount(), 1);
    assert.equal(matchAll.mock.callCount(), 1);
  });
});
```

## اختبارات اللقطة (Snapshot)

أصبحت هذه الاختبارات شائعة بفضل Jest؛ والآن، تقوم العديد من المكتبات بتنفيذ هذه الوظيفة، بما في ذلك Node.js اعتبارًا من الإصدار v22.3.0. هناك العديد من حالات الاستخدام مثل التحقق من إخراج عرض المكون و [البنية التحتية كتعليمات برمجية](https://en.wikipedia.org/wiki/Infrastructure_as_code) تكوين. المفهوم هو نفسه بغض النظر عن حالة الاستخدام.

لا يوجد تكوين محدد مطلوب باستثناء تمكين الميزة عبر `--experimental-test-snapshots`. ولكن لتوضيح التكوين الاختياري، من المحتمل أن تضيف شيئًا مشابهًا لما يلي إلى أحد ملفات تكوين الاختبار الموجودة لديك.

بشكل افتراضي، ينشئ node اسم ملف غير متوافق مع الكشف عن تمييز بناء الجملة: `.js.snapshot`. الملف الذي تم إنشاؤه هو في الواقع ملف CJS، لذا فإن اسم ملف أكثر ملاءمة سينتهي بـ `.snapshot.cjs` (أو بشكل أكثر إيجازًا `.snap.cjs` كما هو موضح أدناه)؛ سيتعامل هذا أيضًا بشكل أفضل في مشاريع ESM.

```js
import { basename, dirname, extname, join } from 'node:path';
import { snapshot } from 'node:test';

snapshot.setResolveSnapshotPath(generateSnapshotPath);
/**
 * @param {string} testFilePath '/tmp/foo.test.js'
 * @returns {string} '/tmp/foo.test.snap.cjs'
 */
function generateSnapshotPath(testFilePath) {
  const ext = extname(testFilePath);
  const filename = basename(testFilePath, ext);
  const base = dirname(testFilePath);

  return join(base, `${filename}.snap.cjs`);
}
```

يوضح المثال أدناه اختبار اللقطة باستخدام [مكتبة الاختبار](https://testing-library.com/) لمكونات واجهة المستخدم؛ لاحظ الطريقتين المختلفتين للوصول إلى `assert.snapshot`):

```js
import { describe, it } from 'node:test';

import { prettyDOM } from '@testing-library/dom';
import { render } from '@testing-library/react'; // Any framework (ex svelte)

import { SomeComponent } from './SomeComponent.jsx';


describe('<SomeComponent>', () => {
  // For people preferring "fat-arrow" syntax, the following is probably better for consistency
  it('should render defaults when no props are provided', (t) => {
    const component = render(<SomeComponent />).container.firstChild;

    t.assert.snapshot(prettyDOM(component));
  });

  it('should consume `foo` when provided', function() {
    const component = render(<SomeComponent foo="bar" />).container.firstChild;

    this.assert.snapshot(prettyDOM(component));
    // `this` works only when `function` is used (not "fat arrow").
  });
});
```

::: warning
يأتي `assert.snapshot` من سياق الاختبار (t أو this)، وليس `node:assert`. هذا ضروري لأن سياق الاختبار لديه حق الوصول إلى النطاق المستحيل على `node:assert` (سيتعين عليك توفيره يدويًا في كل مرة يتم فيها استخدام `assert.snapshot`، مثل `snapshot (this, value)`، وهو أمر ممل إلى حد ما).
:::


## اختبارات الوحدة

اختبارات الوحدة هي أبسط الاختبارات وعادة لا تتطلب أي شيء خاص نسبيًا. من المرجح أن تكون الغالبية العظمى من اختباراتك هي اختبارات وحدة، لذلك من المهم الحفاظ على هذا الإعداد في حده الأدنى لأن أي انخفاض طفيف في أداء الإعداد سيتضخم ويتتالى.

```js
import { register } from 'node:module';

import './setup.mjs'; // 💡

register('some-plaintext-loader');
// يمكن الآن استيراد ملفات النص العادي مثل graphql:
// import GET_ME from 'get-me.gql'; GET_ME = '
```

```js
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { Cat } from './Cat.js';
import { Fish } from './Fish.js';
import { Plastic } from './Plastic.js';

describe('Cat', () => {
  it('يجب أن تأكل القطة السمك', () => {
    const cat = new Cat();
    const fish = new Fish();

    assert.doesNotThrow(() => cat.eat(fish));
  });

  it('يجب ألا تأكل القطة البلاستيك', () => {
    const cat = new Cat();
    const plastic = new Plastic();

    assert.throws(() => cat.eat(plastic));
  });
});
```

## اختبارات واجهة المستخدم

تتطلب اختبارات واجهة المستخدم عمومًا DOM، وربما واجهات برمجة تطبيقات خاصة بالمتصفح الأخرى (مثل `IndexedDb` المستخدمة أدناه). تميل هذه الاختبارات إلى أن تكون معقدة للغاية ومكلفة في الإعداد.

إذا كنت تستخدم واجهة برمجة تطبيقات مثل `IndexedDb` ولكنها معزولة للغاية، فقد لا يكون التمويه العام كما هو موضح أدناه هو الحل الأمثل. بدلًا من ذلك، ربما انقل `beforeEach` إلى الاختبار المحدد حيث سيتم الوصول إلى `IndexedDb`. لاحظ أنه إذا كان يتم الوصول إلى الوحدة التي تصل إلى `IndexedDb` (أو أي شيء آخر) على نطاق واسع، فإما أن تقوم بتمويه تلك الوحدة (ربما يكون هذا هو الخيار الأفضل)، أو احتفظ بهذا هنا.

```js
import { register } from 'node:module';

// ⚠️ تأكد من إنشاء مثيل واحد فقط من JSDom؛ ستؤدي النسخ المتعددة إلى الكثير من 🤬
import jsdom from 'global-jsdom';

import './setup.units.mjs'; // 💡

import { IndexedDb } from './globals/IndexedDb.js';

register('some-css-modules-loader');

jsdom(undefined, {
  url: 'https://test.example.com', // ⚠️ قد يؤدي عدم تحديد هذا إلى الكثير من 🤬
});

// مثال على كيفية تزيين متغير عام.
// لا يتعامل `history` الخاص بـ JSDOM مع التنقل؛ يعالج ما يلي معظم الحالات.
const pushState = globalThis.history.pushState.bind(globalThis.history);
globalThis.history.pushState = function mock_pushState(data, unused, url) {
  pushState(data, unused, url);
  globalThis.location.assign(url);
};

beforeEach(globalUIBeforeEach);
function globalUIBeforeEach() {
  globalThis.indexedDb = new IndexedDb();
}
```

يمكن أن يكون لديك مستويان مختلفان من اختبارات واجهة المستخدم: اختبار يشبه الوحدة (حيث يتم تمويه العوامل الخارجية والتبعيات) واختبار أكثر شمولاً (حيث يتم تمويه العوامل الخارجية فقط مثل IndexedDb ولكن بقية السلسلة حقيقية). الخيار الأول هو عمومًا الخيار الأكثر نقاءً، بينما يتم تأجيل الخيار الأخير عمومًا إلى اختبار قابلية استخدام آلي شامل تمامًا عبر شيء مثل [Playwright](https://playwright.dev/) أو [Puppeteer](https://pptr.dev/). فيما يلي مثال على الخيار الأول.

```js
import { before, describe, mock, it } from 'node:test';

import { screen } from '@testing-library/dom';
import { render } from '@testing-library/react'; // أي إطار عمل (مثل svelte)

// ⚠️ لاحظ أن SomeOtherComponent ليس استيرادًا ثابتًا؛
// هذا ضروري لتسهيل تمويه استيراداته الخاصة.


describe('<SomeOtherComponent>', () => {
  let SomeOtherComponent;
  let calcSomeValue;

  before(async () => {
    // ⚠️ الأهمية للتسلسل: يجب إعداد التمويه قبل استيراد المستهلك الخاص به.

    // يتطلب تعيين `--experimental-test-module-mocks`.
    calcSomeValue = mock.module('./calcSomeValue.js', { calcSomeValue: mock.fn() });

    ({ SomeOtherComponent } = await import('./SomeOtherComponent.jsx'));
  });

  describe('عندما يفشل calcSomeValue', () => {
    // هذا ما لا تريد التعامل معه باستخدام لقطة لأن ذلك سيكون هشًا:
    // عند إجراء تحديثات غير مهمة على رسالة الخطأ،
    // سيفشل اختبار اللقطة عن طريق الخطأ
    // (وسيتعين تحديث اللقطة بدون قيمة حقيقية).

    it('يجب أن يفشل بأمان عن طريق عرض خطأ جميل', () => {
      calcSomeValue.mockImplementation(function mock__calcSomeValue() { return null });

      render(<SomeOtherComponent>);

      const errorMessage = screen.queryByText('unable');

      assert.ok(errorMessage);
    });
  });
});
```
