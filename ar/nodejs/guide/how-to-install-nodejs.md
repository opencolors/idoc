---
title: كيفية تثبيت Node.js
description: تعلم كيفية تثبيت Node.js باستخدام مديري الحزم وطرق مختلفة، بما في ذلك nvm، fnm، Homebrew، Docker، والمزيد.
head:
  - - meta
    - name: og:title
      content: كيفية تثبيت Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: تعلم كيفية تثبيت Node.js باستخدام مديري الحزم وطرق مختلفة، بما في ذلك nvm، fnm، Homebrew، Docker، والمزيد.
  - - meta
    - name: twitter:title
      content: كيفية تثبيت Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: تعلم كيفية تثبيت Node.js باستخدام مديري الحزم وطرق مختلفة، بما في ذلك nvm، fnm، Homebrew، Docker، والمزيد.
---


# كيفية تثبيت Node.js

يمكن تثبيت Node.js بطرق مختلفة. تسلط هذه المقالة الضوء على الطرق الأكثر شيوعًا وملاءمة. الحزم الرسمية لجميع الأنظمة الأساسية الرئيسية متاحة على [https://nodejs.org/download/](https://nodejs.org/download/).

إحدى الطرق المريحة جدًا لتثبيت Node.js هي من خلال مدير الحزم. في هذه الحالة، لكل نظام تشغيل مديره الخاص.
## التثبيت باستخدام مدير الحزم

على macOS و Linux و Windows، يمكنك التثبيت على النحو التالي:

::: code-group
```bash [nvm]
# يقوم بتثبيت nvm (مدير إصدارات Node)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash

# تنزيل وتثبيت Node.js (قد تحتاج إلى إعادة تشغيل الجهاز الطرفي)
nvm install 20

# يتحقق من أن إصدار Node.js الصحيح موجود في البيئة
node -v # يجب أن يطبع `v20.17.0`

# يتحقق من أن إصدار npm الصحيح موجود في البيئة
npm -v # يجب أن يطبع `10.8.2`
```
```bash [fnm]
# يقوم بتثبيت fnm (مدير Node السريع)
curl -fsSL https://fnm.vercel.app/install | bash

# تفعيل fnm
source ~/.bashrc

# تنزيل وتثبيت Node.js
fnm use --install-if-missing 20

# يتحقق من أن إصدار Node.js الصحيح موجود في البيئة
node -v # يجب أن يطبع `v20.17.0`

# يتحقق من أن إصدار npm الصحيح موجود في البيئة
npm -v # يجب أن يطبع `10.8.2`
```
```bash [Brew]
# ملاحظة:
# Homebrew ليس مدير حزم Node.js.
# يرجى التأكد من أنه مثبت بالفعل على نظامك.
# اتبع التعليمات الرسمية على https://brew.sh/
# يدعم Homebrew فقط تثبيت إصدارات Node.js الرئيسية وقد لا يدعم أحدث إصدار Node.js من خط الإصدار 20.

# تنزيل وتثبيت Node.js
brew install node@20

# يتحقق من أن إصدار Node.js الصحيح موجود في البيئة
node -v # يجب أن يطبع `v20.17.0`

# يتحقق من أن إصدار npm الصحيح موجود في البيئة
npm -v # يجب أن يطبع `10.8.2`
```
```bash [Docker]
# ملاحظة:
# Docker ليس مدير حزم Node.js.
# يرجى التأكد من أنه مثبت بالفعل على نظامك.
# اتبع التعليمات الرسمية على https://docs.docker.com/desktop/
# يتم توفير صور Docker رسميًا على https://github.com/nodejs/docker-node/

# يسحب صورة Docker الخاصة بـ Node.js
docker pull node:20-alpine

# يتحقق من أن إصدار Node.js الصحيح موجود في البيئة
docker run node:20-alpine node -v # يجب أن يطبع `v20.17.0`

# يتحقق من أن إصدار npm الصحيح موجود في البيئة
docker run node:20-alpine npm -v # يجب أن يطبع `10.8.2`
```
:::

على Windows، يمكنك التثبيت على النحو التالي:

::: code-group
```bash [fnm]
# يقوم بتثبيت fnm (مدير Node السريع)
winget install Schniz.fnm

# تكوين بيئة fnm
fnm env --use-on-cd | Out-String | Invoke-Expression

# تنزيل وتثبيت Node.js
fnm use --install-if-missing 20

# يتحقق من أن إصدار Node.js الصحيح موجود في البيئة
node -v # يجب أن يطبع `v20.17.0`

# يتحقق من أن إصدار npm الصحيح موجود في البيئة
npm -v # يجب أن يطبع `10.8.2`
```
```bash [Chocolatey]
# ملاحظة:
# Chocolatey ليس مدير حزم Node.js.
# يرجى التأكد من أنه مثبت بالفعل على نظامك.
# اتبع التعليمات الرسمية على https://chocolatey.org/
# Chocolatey غير مدعوم رسميًا من قبل مشروع Node.js وقد لا يدعم الإصدار v20.17.0 من Node.js

# تنزيل وتثبيت Node.js
choco install nodejs-lts --version="20.17.0"

# يتحقق من أن إصدار Node.js الصحيح موجود في البيئة
node -v # يجب أن يطبع `20`

# يتحقق من أن إصدار npm الصحيح موجود في البيئة
npm -v # يجب أن يطبع `10.8.2`
```
```bash [Docker]
# ملاحظة:
# Docker ليس مدير حزم Node.js.
# يرجى التأكد من أنه مثبت بالفعل على نظامك.
# اتبع التعليمات الرسمية على https://docs.docker.com/desktop/
# يتم توفير صور Docker رسميًا على https://github.com/nodejs/docker-node/

# يسحب صورة Docker الخاصة بـ Node.js
docker pull node:20-alpine

# يتحقق من أن إصدار Node.js الصحيح موجود في البيئة
docker run node:20-alpine node -v # يجب أن يطبع `v20.17.0`

# يتحقق من أن إصدار npm الصحيح موجود في البيئة
docker run node:20-alpine npm -v # يجب أن يطبع `10.8.2`
```
:::

`nvm` هي طريقة شائعة لتشغيل Node.js. يسمح لك بتبديل إصدار Node.js بسهولة، وتثبيت إصدارات جديدة لتجربتها والرجوع بسهولة إذا حدث خطأ ما. كما أنه مفيد جدًا لاختبار التعليمات البرمجية الخاصة بك بإصدارات Node.js القديمة.

::: tip
راجع [https://github.com/nvm-sh/nvm](https://github.com/nvm-sh/nvm) لمزيد من المعلومات حول هذا الخيار.
:::

على أي حال، عند تثبيت Node.js، سيكون لديك حق الوصول إلى البرنامج القابل للتنفيذ node في سطر الأوامر.

