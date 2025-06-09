---
title: مسارات الملفات في Node.js
description: تعلم عن مسارات الملفات في Node.js، بما في ذلك مسارات الملفات في النظام، ووحدة `path`، وكيفية استخراج المعلومات من المسارات.
head:
  - - meta
    - name: og:title
      content: مسارات الملفات في Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: تعلم عن مسارات الملفات في Node.js، بما في ذلك مسارات الملفات في النظام، ووحدة `path`، وكيفية استخراج المعلومات من المسارات.
  - - meta
    - name: twitter:title
      content: مسارات الملفات في Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: تعلم عن مسارات الملفات في Node.js، بما في ذلك مسارات الملفات في النظام، ووحدة `path`، وكيفية استخراج المعلومات من المسارات.
---


# مسارات الملفات في Node.js

## مسارات الملفات في النظام

لكل ملف في النظام مسار. في Linux و macOS، قد يبدو المسار هكذا: `/users/joe/file.txt`

بينما تمتلك أجهزة Windows بنية مختلفة مثل: `C:\users\joe\file.txt`

يجب الانتباه عند استخدام المسارات في تطبيقاتك، حيث يجب أخذ هذا الاختلاف في الاعتبار.

## استخدام وحدة `path`

يمكنك تضمين هذه الوحدة في ملفاتك باستخدام:

```javascript
const path = require('node:path')
```

ويمكنك البدء في استخدام طرقها.

## الحصول على معلومات من مسار

بالنظر إلى مسار، يمكنك استخراج معلومات منه باستخدام هذه الطرق:

- `dirname`: يحصل على المجلد الأصل للملف
- `basename`: يحصل على جزء اسم الملف
- `extname`: يحصل على امتداد الملف

### مثال

::: code-group

```javascript [CJS]
const path = require('node:path')
const notes = '/users/joe/notes.txt'

path.dirname(notes) // /users/joe
path.extname(notes) // .txt
```

```javascript [MJS]
import path from 'node:path'
const notes = '/users/joe/notes.txt'

path.dirname(notes) // /users/joe
path.extname(notes) // .txt
```

:::

يمكنك الحصول على اسم الملف بدون الامتداد عن طريق تحديد وسيطة ثانية لـ `basename`:

```javascript
path.basename(notes, path.extname(notes)) // notes
```

## العمل مع المسارات

يمكنك ضم جزأين أو أكثر من مسار باستخدام `path.join()`:

```javascript
path.join('/users', 'joe', 'file.txt') // /users/joe/file.txt
```

يمكنك الحصول على حساب المسار المطلق لمسار نسبي باستخدام `path.resolve()`:

```javascript
path.resolve('joe.txt') // /Users/joe/joe.txt إذا تم تشغيله من المجلد الرئيسي الخاص بي
path.resolve('tmp', 'joe.txt') // /Users/joe/tmp/joe.txt إذا تم تشغيله من المجلد الرئيسي الخاص بي
```

في هذه الحالة، سيقوم Node.js ببساطة بإلحاق `/joe.txt` بدليل العمل الحالي. إذا قمت بتحديد معلمة ثانية كمجلد، فسيستخدم `resolve` الأولى كأساس للثانية.

إذا بدأت المعلمة الأولى بشرطة مائلة، فهذا يعني أنها مسار مطلق:

```javascript
path.resolve('/etc', 'joe.txt') // /etc/joe.txt
```

`path.normalize()` هي وظيفة مفيدة أخرى ستحاول حساب المسار الفعلي عندما يحتوي على محددات نسبية مثل `.` أو `..` أو شرطات مائلة مزدوجة:

```javascript
path.normalize('/users/joe/../test.txt') // /users/test.txt
```

لا تتحقق `resolve` ولا `normalize` مما إذا كان المسار موجودًا. إنهم ببساطة يحسبون مسارًا بناءً على المعلومات التي حصلوا عليها.

