---
title: توثيق Node.js - الملخص
description: نظرة عامة على Node.js، توضح هيكلها المعتمد على الأحداث غير المتزامنة، والوحدات الأساسية، وكيفية البدء في تطوير تطبيقات Node.js.
head:
  - - meta
    - name: og:title
      content: توثيق Node.js - الملخص | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: نظرة عامة على Node.js، توضح هيكلها المعتمد على الأحداث غير المتزامنة، والوحدات الأساسية، وكيفية البدء في تطوير تطبيقات Node.js.
  - - meta
    - name: twitter:title
      content: توثيق Node.js - الملخص | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: نظرة عامة على Node.js، توضح هيكلها المعتمد على الأحداث غير المتزامنة، والوحدات الأساسية، وكيفية البدء في تطوير تطبيقات Node.js.
---


# الاستخدام والمثال {#usage-and-example}

## الاستخدام {#usage}

`node [options] [V8 options] [script.js | -e "script" | - ] [arguments]`

يرجى الاطلاع على وثيقة [خيارات سطر الأوامر](/ar/nodejs/api/cli#options) لمزيد من المعلومات.

## مثال {#example}

مثال على [خادم ويب](/ar/nodejs/api/http) مكتوب باستخدام Node.js يستجيب بـ `'Hello, World!'`:

تبدأ الأوامر في هذه الوثيقة بـ `$` أو `\>` لتكرار كيفية ظهورها في محطة المستخدم. لا تقم بتضمين الرموز `$` و `\>`. إنها موجودة لإظهار بداية كل أمر.

الأسطر التي لا تبدأ بالرمز `$` أو `\>` تعرض مخرجات الأمر السابق.

أولاً، تأكد من تنزيل وتثبيت Node.js. راجع [تثبيت Node.js عبر مدير الحزم](https://nodejs.org/en/download/package-manager/) لمزيد من معلومات التثبيت.

الآن، قم بإنشاء مجلد مشروع فارغ باسم `projects`، ثم انتقل إليه.

Linux و Mac:

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
بعد ذلك، قم بإنشاء ملف مصدر جديد في مجلد `projects` وقم بتسميته `hello-world.js`.

افتح `hello-world.js` في أي محرر نصوص مفضل والصق المحتوى التالي:

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
احفظ الملف. ثم، في نافذة المحطة الطرفية، لتشغيل ملف `hello-world.js`، أدخل:

```bash [BASH]
node hello-world.js
```
يجب أن يظهر مخرج مشابه لهذا في المحطة الطرفية:

```bash [BASH]
Server running at http://127.0.0.1:3000/
```
الآن، افتح أي متصفح ويب مفضل وقم بزيارة `http://127.0.0.1:3000`.

إذا عرض المتصفح السلسلة `Hello, World!`، فهذا يشير إلى أن الخادم يعمل.

