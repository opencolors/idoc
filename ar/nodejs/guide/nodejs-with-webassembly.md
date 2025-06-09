---
title: Node.js مع WebAssembly
description: WebAssembly هو لغة تجميع عالية الأداء يمكن تجميعها من لغات مختلفة، بما في ذلك C/C++ وRust وAssemblyScript. يوفر Node.js واجهات برمجة التطبيقات اللازمة عبر كائن WebAssembly العالمي للتواصل مع WebAssembly.
head:
  - - meta
    - name: og:title
      content: Node.js مع WebAssembly | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: WebAssembly هو لغة تجميع عالية الأداء يمكن تجميعها من لغات مختلفة، بما في ذلك C/C++ وRust وAssemblyScript. يوفر Node.js واجهات برمجة التطبيقات اللازمة عبر كائن WebAssembly العالمي للتواصل مع WebAssembly.
  - - meta
    - name: twitter:title
      content: Node.js مع WebAssembly | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: WebAssembly هو لغة تجميع عالية الأداء يمكن تجميعها من لغات مختلفة، بما في ذلك C/C++ وRust وAssemblyScript. يوفر Node.js واجهات برمجة التطبيقات اللازمة عبر كائن WebAssembly العالمي للتواصل مع WebAssembly.
---


# Node.js مع WebAssembly

[WebAssembly](https://webassembly.org/) هي لغة تجميع عالية الأداء يمكن تجميعها من لغات مختلفة، بما في ذلك C/C++ و Rust و AssemblyScript. وهي مدعومة حاليًا من قبل Chrome و Firefox و Safari و Edge و Node.js!

تحدد مواصفات WebAssembly تنسيقين للملفات، تنسيق ثنائي يسمى WebAssembly Module بامتداد `.wasm` وتمثيل نصي مطابق يسمى WebAssembly Text format بامتداد `.wat`.

## المفاهيم الأساسية

- الوحدة (Module) - ملف WebAssembly ثنائي مُجمَّع، أي ملف `.wasm`.
- الذاكرة (Memory) - ArrayBuffer قابلة لتغيير الحجم.
- الجدول (Table) - مصفوفة مكتوبة قابلة لتغيير الحجم من المراجع غير المخزنة في الذاكرة.
- المثيل (Instance) - إنشاء لوحدة (Module) بذاكرتها وجدولها ومتغيراتها.

من أجل استخدام WebAssembly، تحتاج إلى ملف ثنائي `.wasm` ومجموعة من واجهات برمجة التطبيقات للتواصل مع WebAssembly. يوفر Node.js واجهات برمجة التطبيقات الضرورية عبر الكائن العام `WebAssembly`.

```javascript
console.log(WebAssembly)
/*
Object [WebAssembly] {
  compile: [Function: compile],
  validate: [Function: validate],
  instantiate: [Function: instantiate]
}
*/
```

## إنشاء وحدات WebAssembly

توجد طرق متعددة لإنشاء ملفات WebAssembly الثنائية بما في ذلك:

- كتابة WebAssembly (`.wat`) يدويًا وتحويلها إلى تنسيق ثنائي باستخدام أدوات مثل [wabt](https://github.com/WebAssembly/wabt).
- استخدام [emscripten](https://github.com/emscripten-core/emscripten) مع تطبيق C/C++
- استخدام [wasm-pack](https://github.com/rustwasm/wasm-pack) مع تطبيق Rust
- استخدام [AssemblyScript](https://github.com/AssemblyScript/assemblyscript) إذا كنت تفضل تجربة شبيهة بـ TypeScript

::: tip
**تقوم بعض هذه الأدوات بإنشاء ليس فقط الملف الثنائي، ولكن أيضًا رمز JavaScript "اللاصق" وملفات HTML المقابلة لتشغيلها في المتصفح.**
:::

## كيفية استخدامها

بمجرد أن يكون لديك وحدة WebAssembly، يمكنك استخدام كائن `WebAssembly` الخاص بـ Node.js لإنشاء مثيل له.

```javascript
const fs = require('node:fs')
const wasmBuffer = fs.readFileSync('/path/to/add.wasm')
WebAssembly.instantiate(wasmBuffer).then(wasmModule => {
  // دالة مصدَّرة تعيش تحت instance.exports
  const { add } = wasmModule.instance.exports
  const sum = add(5, 6)
  console.log(sum) // الإخراج: 11
})
```


## التفاعل مع نظام التشغيل

لا يمكن لوحدات WebAssembly الوصول مباشرة إلى وظائف نظام التشغيل بمفردها. يمكن استخدام أداة طرف ثالث [Wasmtime](https://github.bytecodealliance/wasmtime) للوصول إلى هذه الوظائف. تستخدم `Wasmtime` واجهة برمجة التطبيقات [WASI](https://github.com/WebAssembly/WASI) للوصول إلى وظائف نظام التشغيل.

## مصادر

- [معلومات عامة حول WebAssembly](https://webassembly.org/)
- [وثائق MDN](https://developer.mozilla.org/en-US/docs/WebAssembly)
- [كتابة WebAssembly يدويًا](https://webassembly.github.io/spec/core/text/index.html)

