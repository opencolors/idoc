---
title: توثيق Node.js - التقارير
description: توفر توثيق تقارير Node.js معلومات مفصلة حول كيفية إنشاء وتقنين وتحليل التقارير التشخيصية لتطبيقات Node.js. يغطي استخدام وحدة 'التقرير'، بما في ذلك كيفية تفعيل التقارير، وتخصيص محتوى التقارير، وتفسير البيانات التي تم إنشاؤها من أجل تصحيح الأخطاء وتحليل الأداء.
head:
  - - meta
    - name: og:title
      content: توثيق Node.js - التقارير | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: توفر توثيق تقارير Node.js معلومات مفصلة حول كيفية إنشاء وتقنين وتحليل التقارير التشخيصية لتطبيقات Node.js. يغطي استخدام وحدة 'التقرير'، بما في ذلك كيفية تفعيل التقارير، وتخصيص محتوى التقارير، وتفسير البيانات التي تم إنشاؤها من أجل تصحيح الأخطاء وتحليل الأداء.
  - - meta
    - name: twitter:title
      content: توثيق Node.js - التقارير | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: توفر توثيق تقارير Node.js معلومات مفصلة حول كيفية إنشاء وتقنين وتحليل التقارير التشخيصية لتطبيقات Node.js. يغطي استخدام وحدة 'التقرير'، بما في ذلك كيفية تفعيل التقارير، وتخصيص محتوى التقارير، وتفسير البيانات التي تم إنشاؤها من أجل تصحيح الأخطاء وتحليل الأداء.
---


# تقرير التشخيص {#diagnostic-report}

::: tip [مستقر: 2 - مستقر]
[مستقر: 2](/ar/nodejs/api/documentation#stability-index) [الاستقرار: 2](/ar/nodejs/api/documentation#stability-index) - مستقر
:::

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v23.3.0 | تمت إضافة خيار `--report-exclude-env` لاستبعاد متغيرات البيئة من إنشاء التقرير. |
| v22.0.0, v20.13.0 | تمت إضافة خيار `--report-exclude-network` لاستبعاد عمليات الشبكات التي يمكن أن تبطئ إنشاء التقارير في بعض الحالات. |
:::

يقدم ملخصًا تشخيصيًا بتنسيق JSON، يتم كتابته في ملف.

التقرير مخصص للاستخدام في التطوير والاختبار والإنتاج، لالتقاط المعلومات والحفاظ عليها لتحديد المشكلات. يتضمن آثار مكدس JavaScript والأصلية، وإحصائيات الكومة، ومعلومات النظام الأساسي، واستخدام الموارد، وما إلى ذلك. مع تمكين خيار التقرير، يمكن تشغيل التقارير التشخيصية على الاستثناءات غير المعالجة والأخطاء الجسيمة وإشارات المستخدم، بالإضافة إلى التشغيل برمجيًا من خلال استدعاءات API.

يتم توفير تقرير مثال كامل تم إنشاؤه على استثناء غير ملتقط كمرجع أدناه.

```json [JSON]
{
  "header": {
    "reportVersion": 5,
    "event": "exception",
    "trigger": "Exception",
    "filename": "report.20181221.005011.8974.0.001.json",
    "dumpEventTime": "2018-12-21T00:50:11Z",
    "dumpEventTimeStamp": "1545371411331",
    "processId": 8974,
    "cwd": "/home/nodeuser/project/node",
    "commandLine": [
      "/home/nodeuser/project/node/out/Release/node",
      "--report-uncaught-exception",
      "/home/nodeuser/project/node/test/report/test-exception.js",
      "child"
    ],
    "nodejsVersion": "v12.0.0-pre",
    "glibcVersionRuntime": "2.17",
    "glibcVersionCompiler": "2.17",
    "wordSize": "64 bit",
    "arch": "x64",
    "platform": "linux",
    "componentVersions": {
      "node": "12.0.0-pre",
      "v8": "7.1.302.28-node.5",
      "uv": "1.24.1",
      "zlib": "1.2.11",
      "ares": "1.15.0",
      "modules": "68",
      "nghttp2": "1.34.0",
      "napi": "3",
      "llhttp": "1.0.1",
      "openssl": "1.1.0j"
    },
    "release": {
      "name": "node"
    },
    "osName": "Linux",
    "osRelease": "3.10.0-862.el7.x86_64",
    "osVersion": "#1 SMP Wed Mar 21 18:14:51 EDT 2018",
    "osMachine": "x86_64",
    "cpus": [
      {
        "model": "Intel(R) Core(TM) i7-6820HQ CPU @ 2.70GHz",
        "speed": 2700,
        "user": 88902660,
        "nice": 0,
        "sys": 50902570,
        "idle": 241732220,
        "irq": 0
      },
      {
        "model": "Intel(R) Core(TM) i7-6820HQ CPU @ 2.70GHz",
        "speed": 2700,
        "user": 88902660,
        "nice": 0,
        "sys": 50902570,
        "idle": 241732220,
        "irq": 0
      }
    ],
    "networkInterfaces": [
      {
        "name": "en0",
        "internal": false,
        "mac": "13:10:de:ad:be:ef",
        "address": "10.0.0.37",
        "netmask": "255.255.255.0",
        "family": "IPv4"
      }
    ],
    "host": "test_machine"
  },
  "javascriptStack": {
    "message": "Error: *** test-exception.js: throwing uncaught Error",
    "stack": [
      "at myException (/home/nodeuser/project/node/test/report/test-exception.js:9:11)",
      "at Object.<anonymous> (/home/nodeuser/project/node/test/report/test-exception.js:12:3)",
      "at Module._compile (internal/modules/cjs/loader.js:718:30)",
      "at Object.Module._extensions..js (internal/modules/cjs/loader.js:729:10)",
      "at Module.load (internal/modules/cjs/loader.js:617:32)",
      "at tryModuleLoad (internal/modules/cjs/loader.js:560:12)",
      "at Function.Module._load (internal/modules/cjs/loader.js:552:3)",
      "at Function.Module.runMain (internal/modules/cjs/loader.js:771:12)",
      "at executeUserCode (internal/bootstrap/node.js:332:15)"
    ]
  },
  "nativeStack": [
    {
      "pc": "0x000055b57f07a9ef",
      "symbol": "report::GetNodeReport(v8::Isolate*, node::Environment*, char const*, char const*, v8::Local<v8::String>, std::ostream&) [./node]"
    },
    {
      "pc": "0x000055b57f07cf03",
      "symbol": "report::GetReport(v8::FunctionCallbackInfo<v8::Value> const&) [./node]"
    },
    {
      "pc": "0x000055b57f1bccfd",
      "symbol": " [./node]"
    },
    {
      "pc": "0x000055b57f1be048",
      "symbol": "v8::internal::Builtin_HandleApiCall(int, v8::internal::Object**, v8::internal::Isolate*) [./node]"
    },
    {
      "pc": "0x000055b57feeda0e",
      "symbol": " [./node]"
    }
  ],
  "javascriptHeap": {
    "totalMemory": 5660672,
    "executableMemory": 524288,
    "totalCommittedMemory": 5488640,
    "availableMemory": 4341379928,
    "totalGlobalHandlesMemory": 8192,
    "usedGlobalHandlesMemory": 3136,
    "usedMemory": 4816432,
    "memoryLimit": 4345298944,
    "mallocedMemory": 254128,
    "externalMemory": 315644,
    "peakMallocedMemory": 98752,
    "nativeContextCount": 1,
    "detachedContextCount": 0,
    "doesZapGarbage": 0,
    "heapSpaces": {
      "read_only_space": {
        "memorySize": 524288,
        "committedMemory": 39208,
        "capacity": 515584,
        "used": 30504,
        "available": 485080
      },
      "new_space": {
        "memorySize": 2097152,
        "committedMemory": 2019312,
        "capacity": 1031168,
        "used": 985496,
        "available": 45672
      },
      "old_space": {
        "memorySize": 2273280,
        "committedMemory": 1769008,
        "capacity": 1974640,
        "used": 1725488,
        "available": 249152
      },
      "code_space": {
        "memorySize": 696320,
        "committedMemory": 184896,
        "capacity": 152128,
        "used": 152128,
        "available": 0
      },
      "map_space": {
        "memorySize": 536576,
        "committedMemory": 344928,
        "capacity": 327520,
        "used": 327520,
        "available": 0
      },
      "large_object_space": {
        "memorySize": 0,
        "committedMemory": 0,
        "capacity": 1520590336,
        "used": 0,
        "available": 1520590336
      },
      "new_large_object_space": {
        "memorySize": 0,
        "committedMemory": 0,
        "capacity": 0,
        "used": 0,
        "available": 0
      }
    }
  },
  "resourceUsage": {
    "rss": "35766272",
    "free_memory": "1598337024",
    "total_memory": "17179869184",
    "available_memory": "1598337024",
    "maxRss": "36624662528",
    "constrained_memory": "36624662528",
    "userCpuSeconds": 0.040072,
    "kernelCpuSeconds": 0.016029,
    "cpuConsumptionPercent": 5.6101,
    "userCpuConsumptionPercent": 4.0072,
    "kernelCpuConsumptionPercent": 1.6029,
    "pageFaults": {
      "IORequired": 0,
      "IONotRequired": 4610
    },
    "fsActivity": {
      "reads": 0,
      "writes": 0
    }
  },
  "uvthreadResourceUsage": {
    "userCpuSeconds": 0.039843,
    "kernelCpuSeconds": 0.015937,
    "cpuConsumptionPercent": 5.578,
    "userCpuConsumptionPercent": 3.9843,
    "kernelCpuConsumptionPercent": 1.5937,
    "fsActivity": {
      "reads": 0,
      "writes": 0
    }
  },
  "libuv": [
    {
      "type": "async",
      "is_active": true,
      "is_referenced": false,
      "address": "0x0000000102910900",
      "details": ""
    },
    {
      "type": "timer",
      "is_active": false,
      "is_referenced": false,
      "address": "0x00007fff5fbfeab0",
      "repeat": 0,
      "firesInMsFromNow": 94403548320796,
      "expired": true
    },
    {
      "type": "check",
      "is_active": true,
      "is_referenced": false,
      "address": "0x00007fff5fbfeb48"
    },
    {
      "type": "idle",
      "is_active": false,
      "is_referenced": true,
      "address": "0x00007fff5fbfebc0"
    },
    {
      "type": "prepare",
      "is_active": false,
      "is_referenced": false,
      "address": "0x00007fff5fbfec38"
    },
    {
      "type": "check",
      "is_active": false,
      "is_referenced": false,
      "address": "0x00007fff5fbfecb0"
    },
    {
      "type": "async",
      "is_active": true,
      "is_referenced": false,
      "address": "0x000000010188f2e0"
    },
    {
      "type": "tty",
      "is_active": false,
      "is_referenced": true,
      "address": "0x000055b581db0e18",
      "width": 204,
      "height": 55,
      "fd": 17,
      "writeQueueSize": 0,
      "readable": true,
      "writable": true
    },
    {
      "type": "signal",
      "is_active": true,
      "is_referenced": false,
      "address": "0x000055b581d80010",
      "signum": 28,
      "signal": "SIGWINCH"
    },
    {
      "type": "tty",
      "is_active": true,
      "is_referenced": true,
      "address": "0x000055b581df59f8",
      "width": 204,
      "height": 55,
      "fd": 19,
      "writeQueueSize": 0,
      "readable": true,
      "writable": true
    },
    {
      "type": "loop",
      "is_active": true,
      "address": "0x000055fc7b2cb180",
      "loopIdleTimeSeconds": 22644.8
    },
    {
      "type": "tcp",
      "is_active": true,
      "is_referenced": true,
      "address": "0x000055e70fcb85d8",
      "localEndpoint": {
        "host": "localhost",
        "ip4": "127.0.0.1",
        "port": 48986
      },
      "remoteEndpoint": {
        "host": "localhost",
        "ip4": "127.0.0.1",
        "port": 38573
      },
      "sendBufferSize": 2626560,
      "recvBufferSize": 131072,
      "fd": 24,
      "writeQueueSize": 0,
      "readable": true,
      "writable": true
    }
  ],
  "workers": [],
  "environmentVariables": {
    "REMOTEHOST": "REMOVED",
    "MANPATH": "/opt/rh/devtoolset-3/root/usr/share/man:",
    "XDG_SESSION_ID": "66126",
    "HOSTNAME": "test_machine",
    "HOST": "test_machine",
    "TERM": "xterm-256color",
    "SHELL": "/bin/csh",
    "SSH_CLIENT": "REMOVED",
    "PERL5LIB": "/opt/rh/devtoolset-3/root//usr/lib64/perl5/vendor_perl:/opt/rh/devtoolset-3/root/usr/lib/perl5:/opt/rh/devtoolset-3/root//usr/share/perl5/vendor_perl",
    "OLDPWD": "/home/nodeuser/project/node/src",
    "JAVACONFDIRS": "/opt/rh/devtoolset-3/root/etc/java:/etc/java",
    "SSH_TTY": "/dev/pts/0",
    "PCP_DIR": "/opt/rh/devtoolset-3/root",
    "GROUP": "normaluser",
    "USER": "nodeuser",
    "LD_LIBRARY_PATH": "/opt/rh/devtoolset-3/root/usr/lib64:/opt/rh/devtoolset-3/root/usr/lib",
    "HOSTTYPE": "x86_64-linux",
    "XDG_CONFIG_DIRS": "/opt/rh/devtoolset-3/root/etc/xdg:/etc/xdg",
    "MAIL": "/var/spool/mail/nodeuser",
    "PATH": "/home/nodeuser/project/node:/opt/rh/devtoolset-3/root/usr/bin:/usr/local/bin:/usr/bin:/usr/local/sbin:/usr/sbin",
    "PWD": "/home/nodeuser/project/node",
    "LANG": "en_US.UTF-8",
    "PS1": "\\u@\\h : \\[\\e[31m\\]\\w\\[\\e[m\\] >  ",
    "SHLVL": "2",
    "HOME": "/home/nodeuser",
    "OSTYPE": "linux",
    "VENDOR": "unknown",
    "PYTHONPATH": "/opt/rh/devtoolset-3/root/usr/lib64/python2.7/site-packages:/opt/rh/devtoolset-3/root/usr/lib/python2.7/site-packages",
    "MACHTYPE": "x86_64",
    "LOGNAME": "nodeuser",
    "XDG_DATA_DIRS": "/opt/rh/devtoolset-3/root/usr/share:/usr/local/share:/usr/share",
    "LESSOPEN": "||/usr/bin/lesspipe.sh %s",
    "INFOPATH": "/opt/rh/devtoolset-3/root/usr/share/info",
    "XDG_RUNTIME_DIR": "/run/user/50141",
    "_": "./node"
  },
  "userLimits": {
    "core_file_size_blocks": {
      "soft": "",
      "hard": "unlimited"
    },
    "data_seg_size_bytes": {
      "soft": "unlimited",
      "hard": "unlimited"
    },
    "file_size_blocks": {
      "soft": "unlimited",
      "hard": "unlimited"
    },
    "max_locked_memory_bytes": {
      "soft": "unlimited",
      "hard": 65536
    },
    "max_memory_size_bytes": {
      "soft": "unlimited",
      "hard": "unlimited"
    },
    "open_files": {
      "soft": "unlimited",
      "hard": 4096
    },
    "stack_size_bytes": {
      "soft": "unlimited",
      "hard": "unlimited"
    },
    "cpu_time_seconds": {
      "soft": "unlimited",
      "hard": "unlimited"
    },
    "max_user_processes": {
      "soft": "unlimited",
      "hard": 4127290
    },
    "virtual_memory_bytes": {
      "soft": "unlimited",
      "hard": "unlimited"
    }
  },
  "sharedObjects": [
    "/lib64/libdl.so.2",
    "/lib64/librt.so.1",
    "/lib64/libstdc++.so.6",
    "/lib64/libm.so.6",
    "/lib64/libgcc_s.so.1",
    "/lib64/libpthread.so.0",
    "/lib64/libc.so.6",
    "/lib64/ld-linux-x86-64.so.2"
  ]
}
```

## Usage {#usage}

```bash [BASH]
node --report-uncaught-exception --report-on-signal \
--report-on-fatalerror app.js
```
-  `--report-uncaught-exception` يتيح إنشاء تقرير بشأن الاستثناءات غير الملتقطة. مفيد عند فحص مكدس JavaScript بالتزامن مع المكدس الأصلي وبيانات بيئة التشغيل الأخرى.
-  `--report-on-signal` يتيح إنشاء تقرير عند تلقي الإشارة المحددة (أو المعرفة مسبقًا) إلى عملية Node.js قيد التشغيل. (انظر أدناه حول كيفية تعديل الإشارة التي تؤدي إلى تشغيل التقرير.) الإشارة الافتراضية هي `SIGUSR2`. مفيد عندما يلزم تشغيل تقرير من برنامج آخر. قد تستفيد مراقبات التطبيق من هذه الميزة لجمع التقارير على فترات منتظمة ورسم مجموعة غنية من بيانات وقت التشغيل الداخلية في طرق العرض الخاصة بهم.

لا يتم دعم إنشاء التقارير المستندة إلى الإشارة في Windows.

في الظروف العادية، ليست هناك حاجة لتعديل إشارة تشغيل التقرير. ومع ذلك، إذا كانت `SIGUSR2` مستخدمة بالفعل لأغراض أخرى، فإن هذا العلم يساعد في تغيير الإشارة لإنشاء التقارير والحفاظ على المعنى الأصلي لـ `SIGUSR2` للأغراض المذكورة.

-  `--report-on-fatalerror` يتيح تشغيل التقرير عند حدوث أخطاء فادحة (أخطاء داخلية داخل وقت تشغيل Node.js، مثل نفاد الذاكرة) مما يؤدي إلى إنهاء التطبيق. مفيد لفحص عناصر بيانات التشخيص المختلفة مثل الكومة والمكدس وحالة حلقة الأحداث واستهلاك الموارد وما إلى ذلك للاستدلال على الخطأ الفادح.
-  `--report-compact` اكتب التقارير بتنسيق مضغوط، JSON أحادي السطر، يسهل على أنظمة معالجة السجلات استهلاكه أكثر من التنسيق متعدد الأسطر الافتراضي المصمم للاستهلاك البشري.
-  `--report-directory` الموقع الذي سيتم فيه إنشاء التقرير.
-  `--report-filename` اسم الملف الذي سيتم كتابة التقرير فيه.
-  `--report-signal` تعيين أو إعادة تعيين الإشارة لإنشاء التقارير (غير مدعوم في Windows). الإشارة الافتراضية هي `SIGUSR2`.
-  `--report-exclude-network` استبعاد `header.networkInterfaces` وتعطيل استعلامات DNS العكسي في `libuv.*.(remote|local)Endpoint.host` من تقرير التشخيص. بشكل افتراضي، هذا غير معين ويتم تضمين واجهات الشبكة.
-  `--report-exclude-env` استبعاد `environmentVariables` من تقرير التشخيص. بشكل افتراضي، هذا غير معين ويتم تضمين متغيرات البيئة.

يمكن أيضًا تشغيل التقرير عبر استدعاء واجهة برمجة تطبيقات من تطبيق JavaScript:

```js [ESM]
process.report.writeReport();
```
تأخذ هذه الدالة وسيطة إضافية اختيارية `filename`، وهي اسم الملف الذي سيتم كتابة التقرير فيه.

```js [ESM]
process.report.writeReport('./foo.json');
```
تأخذ هذه الدالة وسيطة إضافية اختيارية `err` وهي كائن `Error` سيستخدم كسياق لمكدس JavaScript المطبوع في التقرير. عند استخدام التقرير للتعامل مع الأخطاء في رد اتصال أو معالج استثناء، يسمح هذا للتقرير بتضمين موقع الخطأ الأصلي بالإضافة إلى مكان معالجته.

```js [ESM]
try {
  process.chdir('/non-existent-path');
} catch (err) {
  process.report.writeReport(err);
}
// Any other code
```
إذا تم تمرير كل من اسم الملف وكائن الخطأ إلى `writeReport()`، فيجب أن يكون كائن الخطأ هو المعامل الثاني.

```js [ESM]
try {
  process.chdir('/non-existent-path');
} catch (err) {
  process.report.writeReport(filename, err);
}
// Any other code
```
يمكن إرجاع محتوى تقرير التشخيص ككائن JavaScript عبر استدعاء واجهة برمجة تطبيقات من تطبيق JavaScript:

```js [ESM]
const report = process.report.getReport();
console.log(typeof report === 'object'); // true

// Similar to process.report.writeReport() output
console.log(JSON.stringify(report, null, 2));
```
تأخذ هذه الدالة وسيطة إضافية اختيارية `err`، وهي كائن `Error` سيستخدم كسياق لمكدس JavaScript المطبوع في التقرير.

```js [ESM]
const report = process.report.getReport(new Error('custom error'));
console.log(typeof report === 'object'); // true
```
تكون إصدارات واجهة برمجة التطبيقات مفيدة عند فحص حالة وقت التشغيل من داخل التطبيق، توقعًا لتعديل استهلاك الموارد وموازنة التحميل والمراقبة وما إلى ذلك.

يتكون محتوى التقرير من قسم رأس يحتوي على نوع الحدث والتاريخ والوقت ومعرف العملية وإصدار Node.js وأقسام تحتوي على تتبعات مكدس JavaScript والأصلية وقسم يحتوي على معلومات كومة V8 وقسم يحتوي على معلومات معالجة `libuv` وقسم معلومات نظام التشغيل يعرض استخدام وحدة المعالجة المركزية والذاكرة وحدود النظام. يمكن تشغيل تقرير نموذجي باستخدام Node.js REPL:

```bash [BASH]
$ node
> process.report.writeReport();
Writing Node.js report to file: report.20181126.091102.8480.0.001.json
Node.js report completed
>
```
عند كتابة تقرير، يتم إصدار رسائل البدء والانتهاء إلى stderr ويتم إرجاع اسم ملف التقرير إلى المتصل. يتضمن اسم الملف الافتراضي التاريخ والوقت ومعرف العملية ورقم تسلسلي. يساعد الرقم التسلسلي في ربط تفريغ التقرير بحالة وقت التشغيل إذا تم إنشاؤه عدة مرات لنفس عملية Node.js.


## إصدار التقرير {#report-version}

يحتوي تقرير التشخيص على رقم إصدار مكون من رقم واحد (`report.header.reportVersion`)، ويمثل بشكل فريد تنسيق التقرير. يتم زيادة رقم الإصدار عند إضافة أو إزالة مفتاح جديد، أو عند تغيير نوع بيانات القيمة. تعريفات إصدار التقرير متسقة عبر إصدارات LTS.

### سجل الإصدارات {#version-history}

#### الإصدار 5 {#version-5}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v23.5.0 | إصلاح الأخطاء المطبعية في وحدات قياس حد الذاكرة. |
:::

استبدال المفاتيح `data_seg_size_kbytes` و `max_memory_size_kbytes` و `virtual_memory_kbytes` بـ `data_seg_size_bytes` و `max_memory_size_bytes` و `virtual_memory_bytes` على التوالي في قسم `userLimits`، حيث يتم إعطاء هذه القيم بالبايت.

```json [JSON]
{
  "userLimits": {
    // تخطي بعض المفاتيح ...
    "data_seg_size_bytes": { // استبدال data_seg_size_kbytes
      "soft": "unlimited",
      "hard": "unlimited"
    },
    // ...
    "max_memory_size_bytes": { // استبدال max_memory_size_kbytes
      "soft": "unlimited",
      "hard": "unlimited"
    },
    // ...
    "virtual_memory_bytes": { // استبدال virtual_memory_kbytes
      "soft": "unlimited",
      "hard": "unlimited"
    }
  }
}
```
#### الإصدار 4 {#version-4}

::: info [السجل]
| الإصدار | التغييرات |
| --- | --- |
| v23.3.0 | تمت إضافة خيار `--report-exclude-env` لاستبعاد متغيرات البيئة من إنشاء التقرير. |
:::

تمت إضافة الحقلين `ipv4` و `ipv6` إلى نقاط نهاية معالجات libuv لـ `tcp` و `udp`. أمثلة:

```json [JSON]
{
  "libuv": [
    {
      "type": "tcp",
      "is_active": true,
      "is_referenced": true,
      "address": "0x000055e70fcb85d8",
      "localEndpoint": {
        "host": "localhost",
        "ip4": "127.0.0.1", // مفتاح جديد
        "port": 48986
      },
      "remoteEndpoint": {
        "host": "localhost",
        "ip4": "127.0.0.1", // مفتاح جديد
        "port": 38573
      },
      "sendBufferSize": 2626560,
      "recvBufferSize": 131072,
      "fd": 24,
      "writeQueueSize": 0,
      "readable": true,
      "writable": true
    },
    {
      "type": "tcp",
      "is_active": true,
      "is_referenced": true,
      "address": "0x000055e70fcd68c8",
      "localEndpoint": {
        "host": "ip6-localhost",
        "ip6": "::1", // مفتاح جديد
        "port": 52266
      },
      "remoteEndpoint": {
        "host": "ip6-localhost",
        "ip6": "::1", // مفتاح جديد
        "port": 38573
      },
      "sendBufferSize": 2626560,
      "recvBufferSize": 131072,
      "fd": 25,
      "writeQueueSize": 0,
      "readable": false,
      "writable": false
    }
  ]
}
```

#### الإصدار 3 {#version-3}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
|---|---|
| v19.1.0, v18.13.0 | إضافة المزيد من معلومات الذاكرة. |
:::

تمت إضافة مفاتيح استخدام الذاكرة التالية إلى قسم `resourceUsage`.

```json [JSON]
{
  "resourceUsage": {
    "rss": "35766272",
    "free_memory": "1598337024",
    "total_memory": "17179869184",
    "available_memory": "1598337024",
    "constrained_memory": "36624662528"
  }
}
```
#### الإصدار 2 {#version-2}

::: info [سجل التغييرات]
| الإصدار | التغييرات |
|---|---|
| v13.9.0, v12.16.2 | تم تضمين العمال الآن في التقرير. |
:::

تمت إضافة دعم [`Worker`](/ar/nodejs/api/worker_threads). راجع قسم [التفاعل مع العمال](/ar/nodejs/api/report#interaction-with-workers) لمزيد من التفاصيل.

#### الإصدار 1 {#version-1}

هذا هو الإصدار الأول من تقرير التشخيص.

## التكوين {#configuration}

يتوفر تكوين وقت التشغيل الإضافي لإنشاء التقارير عبر الخصائص التالية لـ `process.report`:

`reportOnFatalError` يؤدي إلى تشغيل تقارير التشخيص على الأخطاء الفادحة عندما تكون القيمة `true`. القيمة الافتراضية هي `false`.

`reportOnSignal` يؤدي إلى تشغيل تقارير التشخيص عند إشارة عندما تكون القيمة `true`. هذا غير مدعوم على نظام التشغيل Windows. القيمة الافتراضية هي `false`.

`reportOnUncaughtException` يؤدي إلى تشغيل تقارير التشخيص على الاستثناءات غير المعالجة عندما تكون القيمة `true`. القيمة الافتراضية هي `false`.

`signal` يحدد معرف إشارة POSIX التي سيتم استخدامها لاعتراض المحفزات الخارجية لإنشاء التقارير. القيمة الافتراضية هي `'SIGUSR2'`.

`filename` يحدد اسم ملف الإخراج في نظام الملفات. يتم إرفاق معنى خاص بـ `stdout` و `stderr`. سيؤدي استخدام هذه إلى كتابة التقرير إلى التدفقات القياسية المرتبطة. في الحالات التي يتم فيها استخدام التدفقات القياسية، يتم تجاهل القيمة الموجودة في `directory`. عناوين URL غير مدعومة. القيمة الافتراضية هي اسم ملف مركب يحتوي على الطابع الزمني ومعرف العملية (PID) والرقم التسلسلي.

`directory` يحدد دليل نظام الملفات حيث سيتم كتابة التقرير. عناوين URL غير مدعومة. القيمة الافتراضية هي دليل العمل الحالي لعملية Node.js.

`excludeNetwork` يستبعد `header.networkInterfaces` من تقرير التشخيص.

```js [ESM]
// تشغيل التقرير فقط على الاستثناءات غير المعالجة.
process.report.reportOnFatalError = false;
process.report.reportOnSignal = false;
process.report.reportOnUncaughtException = true;

// تشغيل التقرير لكل من الأخطاء الداخلية والإشارة الخارجية.
process.report.reportOnFatalError = true;
process.report.reportOnSignal = true;
process.report.reportOnUncaughtException = false;

// تغيير الإشارة الافتراضية إلى 'SIGQUIT' وتمكينها.
process.report.reportOnFatalError = false;
process.report.reportOnUncaughtException = false;
process.report.reportOnSignal = true;
process.report.signal = 'SIGQUIT';

// تعطيل تقارير واجهات الشبكة
process.report.excludeNetwork = true;
```
يتوفر التكوين عند تهيئة الوحدة النمطية أيضًا عبر متغيرات البيئة:

```bash [BASH]
NODE_OPTIONS="--report-uncaught-exception \
  --report-on-fatalerror --report-on-signal \
  --report-signal=SIGUSR2  --report-filename=./report.json \
  --report-directory=/home/nodeuser"
```
يمكن العثور على وثائق API محددة ضمن قسم [`process API documentation`](/ar/nodejs/api/process).


## التفاعل مع العمال {#interaction-with-workers}

::: info [التاريخ]
| الإصدار | التغييرات |
| --- | --- |
| الإصدار v13.9.0, الإصدار v12.16.2 | يتم تضمين العمال الآن في التقرير. |
:::

يمكن لخيوط [`Worker`](/ar/nodejs/api/worker_threads) إنشاء تقارير بنفس الطريقة التي يفعلها الخيط الرئيسي.

ستتضمن التقارير معلومات حول أي عمال هم أطفال الخيط الحالي كجزء من قسم `workers` ، مع قيام كل عامل بإنشاء تقرير بتنسيق التقرير القياسي.

سينتظر الخيط الذي يقوم بإنشاء التقرير حتى تنتهي التقارير من خيوط Worker. ومع ذلك ، سيكون زمن الوصول لهذا عادةً منخفضًا ، حيث تتم مقاطعة كل من JavaScript قيد التشغيل وحلقة الأحداث لإنشاء التقرير.

