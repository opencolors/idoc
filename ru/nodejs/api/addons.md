---
title: Дополнения Node.js
description: Узнайте, как создавать дополнения Node.js с использованием C++ для расширения функциональности приложений Node.js, включая примеры и справочники по API.
head:
  - - meta
    - name: og:title
      content: Дополнения Node.js | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Узнайте, как создавать дополнения Node.js с использованием C++ для расширения функциональности приложений Node.js, включая примеры и справочники по API.
  - - meta
    - name: twitter:title
      content: Дополнения Node.js | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Узнайте, как создавать дополнения Node.js с использованием C++ для расширения функциональности приложений Node.js, включая примеры и справочники по API.
---


# Аддоны C++ {#c-addons}

*Аддоны* - это динамически подключаемые общие объекты, написанные на C++. Функция [`require()`](/ru/nodejs/api/modules#requireid) может загружать аддоны как обычные модули Node.js. Аддоны обеспечивают интерфейс между JavaScript и библиотеками C/C++.

Существует три варианта реализации аддонов:

- Node-API
- `nan` ([Native Abstractions for Node.js](https://github.com/nodejs/nan))
- прямое использование внутренних библиотек V8, libuv и Node.js

Если нет необходимости в прямом доступе к функциональности, которая не предоставляется Node-API, используйте Node-API. Обратитесь к [Аддоны C/C++ с Node-API](/ru/nodejs/api/n-api) для получения дополнительной информации о Node-API.

При использовании не Node-API, реализация аддонов становится более сложной, требуя знаний нескольких компонентов и API:

-  [V8](https://v8.dev/): C++ библиотека, которую Node.js использует для обеспечения реализации JavaScript. Она предоставляет механизмы для создания объектов, вызова функций и т.д. API V8 задокументирован в основном в заголовочном файле `v8.h` (`deps/v8/include/v8.h` в дереве исходного кода Node.js), а также доступен [онлайн](https://v8docs.nodesource.com/).
-  [libuv](https://github.com/libuv/libuv): C библиотека, которая реализует цикл событий Node.js, его рабочие потоки и все асинхронные поведения платформы. Она также служит кросс-платформенной библиотекой абстракции, предоставляя легкий, POSIX-подобный доступ ко всем основным операционным системам ко многим общим системным задачам, таким как взаимодействие с файловой системой, сокетами, таймерами и системными событиями. libuv также предоставляет абстракцию потоков, аналогичную потокам POSIX, для более сложных асинхронных аддонов, которым необходимо выйти за рамки стандартного цикла событий. Авторам аддонов следует избегать блокировки цикла событий с помощью операций ввода-вывода или других трудоемких задач, перекладывая работу через libuv на неблокирующие системные операции, рабочие потоки или пользовательское использование потоков libuv.
-  Внутренние библиотеки Node.js: Сам Node.js экспортирует API C++, которые могут использовать аддоны, наиболее важным из которых является класс `node::ObjectWrap`.
-  Другие статически скомпонованные библиотеки (включая OpenSSL): Эти другие библиотеки находятся в каталоге `deps/` в дереве исходного кода Node.js. Только символы libuv, OpenSSL, V8 и zlib намеренно повторно экспортируются Node.js и могут использоваться в различной степени аддонами. См. [Связывание с библиотеками, включенными в Node.js](/ru/nodejs/api/addons#linking-to-libraries-included-with-nodejs) для получения дополнительной информации.

Все следующие примеры доступны для [скачивания](https://github.com/nodejs/node-addon-examples) и могут быть использованы в качестве отправной точки для аддона.


## Hello world {#hello-world}

Этот пример "Hello world" - простой аддон, написанный на C++, который эквивалентен следующему JavaScript коду:

```js [ESM]
module.exports.hello = () => 'world';
```
Сначала создайте файл `hello.cc`:

```C++ [C++]
// hello.cc
#include <node.h>

namespace demo {

using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::NewStringType;
using v8::Object;
using v8::String;
using v8::Value;

void Method(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  args.GetReturnValue().Set(String::NewFromUtf8(
      isolate, "world", NewStringType::kNormal).ToLocalChecked());
}

void Initialize(Local<Object> exports) {
  NODE_SET_METHOD(exports, "hello", Method);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)

}  // namespace demo
```
Все Node.js аддоны должны экспортировать функцию инициализации, следуя шаблону:

```C++ [C++]
void Initialize(Local<Object> exports);
NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)
```
После `NODE_MODULE` нет точки с запятой, так как это не функция (см. `node.h`).

`module_name` должен совпадать с именем файла окончательного бинарника (исключая суффикс `.node`).

В примере `hello.cc` функция инициализации - `Initialize`, а имя модуля аддона - `addon`.

При сборке аддонов с помощью `node-gyp`, использование макроса `NODE_GYP_MODULE_NAME` в качестве первого параметра `NODE_MODULE()` обеспечит, что имя окончательного бинарника будет передано в `NODE_MODULE()`.

Аддоны, определенные с помощью `NODE_MODULE()`, не могут быть загружены в нескольких контекстах или нескольких потоках одновременно.

### Контекстно-зависимые аддоны {#context-aware-addons}

Существуют среды, в которых Node.js аддоны может потребоваться загружать несколько раз в нескольких контекстах. Например, среда выполнения [Electron](https://electronjs.org/) запускает несколько экземпляров Node.js в одном процессе. Каждый экземпляр будет иметь свой собственный кеш `require()`, и, следовательно, каждому экземпляру потребуется собственный аддон для правильной работы при загрузке через `require()`. Это означает, что аддон должен поддерживать несколько инициализаций.

Контекстно-зависимый аддон можно построить с помощью макроса `NODE_MODULE_INITIALIZER`, который расширяется до имени функции, которую Node.js будет ожидать найти при загрузке аддона. Таким образом, аддон можно инициализировать, как в следующем примере:

```C++ [C++]
using namespace v8;

extern "C" NODE_MODULE_EXPORT void
NODE_MODULE_INITIALIZER(Local<Object> exports,
                        Local<Value> module,
                        Local<Context> context) {
  /* Выполните шаги инициализации аддона здесь. */
}
```
Другой вариант - использовать макрос `NODE_MODULE_INIT()`, который также создаст контекстно-зависимый аддон. В отличие от `NODE_MODULE()`, который используется для создания аддона вокруг заданной функции инициализации аддона, `NODE_MODULE_INIT()` служит объявлением такой инициализации, за которой следует тело функции.

Следующие три переменные могут использоваться внутри тела функции после вызова `NODE_MODULE_INIT()`:

- `Local\<Object\> exports`,
- `Local\<Value\> module`, и
- `Local\<Context\> context`

Создание контекстно-зависимого аддона требует тщательного управления глобальными статическими данными для обеспечения стабильности и корректности. Поскольку аддон может быть загружен несколько раз, возможно даже из разных потоков, любые глобальные статические данные, хранящиеся в аддоне, должны быть надлежащим образом защищены и не должны содержать постоянных ссылок на объекты JavaScript. Причина этого в том, что объекты JavaScript действительны только в одном контексте и, вероятно, вызовут сбой при доступе из неправильного контекста или из потока, отличного от того, в котором они были созданы.

Контекстно-зависимый аддон можно структурировать, чтобы избежать глобальных статических данных, выполнив следующие шаги:

- Определите класс, который будет содержать данные для каждого экземпляра аддона и который имеет статический член вида
- Выделите экземпляр этого класса в куче при инициализации аддона. Это можно сделать с помощью ключевого слова `new`.
- Вызовите `node::AddEnvironmentCleanupHook()`, передав ему вышесозданный экземпляр и указатель на `DeleteInstance()`. Это обеспечит удаление экземпляра при завершении работы среды.
- Сохраните экземпляр класса в `v8::External`, и
- Передайте `v8::External` во все методы, предоставляемые JavaScript, передав его в `v8::FunctionTemplate::New()` или `v8::Function::New()`, которые создают JavaScript-функции, поддерживаемые машинным кодом. Третий параметр `v8::FunctionTemplate::New()` или `v8::Function::New()` принимает `v8::External` и делает его доступным в машинном обратном вызове с помощью метода `v8::FunctionCallbackInfo::Data()`.

Это обеспечит, что данные для каждого экземпляра аддона достигнут каждой привязки, которую можно вызвать из JavaScript. Данные для каждого экземпляра аддона также должны быть переданы в любые асинхронные обратные вызовы, которые может создавать аддон.

В следующем примере показана реализация контекстно-зависимого аддона:

```C++ [C++]
#include <node.h>

using namespace v8;

class AddonData {
 public:
  explicit AddonData(Isolate* isolate):
      call_count(0) {
    // Убедитесь, что эти данные для каждого экземпляра аддона удалены при очистке среды.
    node::AddEnvironmentCleanupHook(isolate, DeleteInstance, this);
  }

  // Данные для каждого аддона.
  int call_count;

  static void DeleteInstance(void* data) {
    delete static_cast<AddonData*>(data);
  }
};

static void Method(const v8::FunctionCallbackInfo<v8::Value>& info) {
  // Получить данные для каждого экземпляра аддона.
  AddonData* data =
      reinterpret_cast<AddonData*>(info.Data().As<External>()->Value());
  data->call_count++;
  info.GetReturnValue().Set((double)data->call_count);
}

// Инициализируйте этот аддон, чтобы он был контекстно-зависимым.
NODE_MODULE_INIT(/* exports, module, context */) {
  Isolate* isolate = context->GetIsolate();

  // Создайте новый экземпляр `AddonData` для этого экземпляра аддона и
  // свяжите его жизненный цикл с жизненным циклом среды Node.js.
  AddonData* data = new AddonData(isolate);

  // Оберните данные в `v8::External`, чтобы мы могли передать их методу, который
  // предоставляем.
  Local<External> external = External::New(isolate, data);

  // Предоставьте метод `Method` в JavaScript и убедитесь, что он получает
  // данные для каждого экземпляра аддона, которые мы создали выше, передав `external` в качестве
  // третьего параметра конструктору `FunctionTemplate`.
  exports->Set(context,
               String::NewFromUtf8(isolate, "method").ToLocalChecked(),
               FunctionTemplate::New(isolate, Method, external)
                  ->GetFunction(context).ToLocalChecked()).FromJust();
}
```

#### Поддержка Worker {#worker-support}

::: info [История]
| Версия | Изменения |
| --- | --- |
| v14.8.0, v12.19.0 | Хуки очистки теперь могут быть асинхронными. |
:::

Для того, чтобы дополнение могло быть загружено из нескольких сред Node.js, таких как основной поток и поток Worker, оно должно:

- Быть Node-API дополнением, или
- Быть объявлено как контекстно-зависимое с использованием `NODE_MODULE_INIT()`, как описано выше

Для поддержки потоков [`Worker`](/ru/nodejs/api/worker_threads#class-worker), дополнения должны очищать все ресурсы, которые они могли выделить, когда такой поток завершается. Это можно сделать с помощью функции `AddEnvironmentCleanupHook()`:

```C++ [C++]
void AddEnvironmentCleanupHook(v8::Isolate* isolate,
                               void (*fun)(void* arg),
                               void* arg);
```
Эта функция добавляет хук, который будет запущен перед завершением работы данного экземпляра Node.js. При необходимости, такие хуки можно удалить до их запуска с помощью `RemoveEnvironmentCleanupHook()`, которая имеет ту же сигнатуру. Обратные вызовы выполняются в порядке "последним вошел - первым вышел".

При необходимости существует дополнительная пара перегрузок `AddEnvironmentCleanupHook()` и `RemoveEnvironmentCleanupHook()`, где хук очистки принимает функцию обратного вызова. Это можно использовать для завершения асинхронных ресурсов, таких как любые дескрипторы libuv, зарегистрированные дополнением.

Следующий `addon.cc` использует `AddEnvironmentCleanupHook`:

```C++ [C++]
// addon.cc
#include <node.h>
#include <assert.h>
#include <stdlib.h>

using node::AddEnvironmentCleanupHook;
using v8::HandleScope;
using v8::Isolate;
using v8::Local;
using v8::Object;

// Примечание: В реальном приложении не следует полагаться на статические/глобальные данные.
static char cookie[] = "yum yum";
static int cleanup_cb1_called = 0;
static int cleanup_cb2_called = 0;

static void cleanup_cb1(void* arg) {
  Isolate* isolate = static_cast<Isolate*>(arg);
  HandleScope scope(isolate);
  Local<Object> obj = Object::New(isolate);
  assert(!obj.IsEmpty());  // assert VM is still alive
  assert(obj->IsObject());
  cleanup_cb1_called++;
}

static void cleanup_cb2(void* arg) {
  assert(arg == static_cast<void*>(cookie));
  cleanup_cb2_called++;
}

static void sanity_check(void*) {
  assert(cleanup_cb1_called == 1);
  assert(cleanup_cb2_called == 1);
}

// Инициализируйте это дополнение как контекстно-зависимое.
NODE_MODULE_INIT(/* exports, module, context */) {
  Isolate* isolate = context->GetIsolate();

  AddEnvironmentCleanupHook(isolate, sanity_check, nullptr);
  AddEnvironmentCleanupHook(isolate, cleanup_cb2, cookie);
  AddEnvironmentCleanupHook(isolate, cleanup_cb1, isolate);
}
```
Протестируйте в JavaScript, запустив:

```js [ESM]
// test.js
require('./build/Release/addon');
```

### Сборка {#building}

После того как исходный код написан, он должен быть скомпилирован в бинарный файл `addon.node`. Для этого создайте файл с именем `binding.gyp` в корневом каталоге проекта, описывающий конфигурацию сборки модуля в формате, похожем на JSON. Этот файл используется [node-gyp](https://github.com/nodejs/node-gyp), инструментом, специально разработанным для компиляции Node.js аддонов.

```json [JSON]
{
  "targets": [
    {
      "target_name": "addon",
      "sources": [ "hello.cc" ]
    }
  ]
}
```
Версия утилиты `node-gyp` входит в состав Node.js и распространяется вместе с `npm`. Эта версия не предназначена для непосредственного использования разработчиками и предназначена только для поддержки возможности использования команды `npm install` для компиляции и установки аддонов. Разработчики, которые хотят использовать `node-gyp` напрямую, могут установить его с помощью команды `npm install -g node-gyp`. См. [инструкции по установке](https://github.com/nodejs/node-gyp#installation) `node-gyp` для получения дополнительной информации, включая требования для конкретных платформ.

После того как файл `binding.gyp` создан, используйте `node-gyp configure` для создания соответствующих файлов сборки проекта для текущей платформы. Это сгенерирует либо `Makefile` (на платформах Unix), либо файл `vcxproj` (в Windows) в каталоге `build/`.

Затем вызовите команду `node-gyp build`, чтобы сгенерировать скомпилированный файл `addon.node`. Он будет помещен в каталог `build/Release/`.

При использовании `npm install` для установки Node.js аддона, npm использует свою собственную встроенную версию `node-gyp` для выполнения того же набора действий, генерируя скомпилированную версию аддона для платформы пользователя по требованию.

После сборки бинарный аддон можно использовать из Node.js, указав [`require()`](/ru/nodejs/api/modules#requireid) на созданный модуль `addon.node`:

```js [ESM]
// hello.js
const addon = require('./build/Release/addon');

console.log(addon.hello());
// Выводит: 'world'
```
Поскольку точный путь к скомпилированному бинарному файлу аддона может варьироваться в зависимости от того, как он скомпилирован (например, иногда он может находиться в `./build/Debug/`), аддоны могут использовать пакет [bindings](https://github.com/TooTallNate/node-bindings) для загрузки скомпилированного модуля.

Хотя реализация пакета `bindings` является более сложной в отношении того, как он находит модули аддонов, он по существу использует шаблон `try…catch`, аналогичный:

```js [ESM]
try {
  return require('./build/Release/addon.node');
} catch (err) {
  return require('./build/Debug/addon.node');
}
```

### Связывание с библиотеками, включенными в Node.js {#linking-to-libraries-included-with-nodejs}

Node.js использует статически связанные библиотеки, такие как V8, libuv и OpenSSL. Все дополнения должны быть связаны с V8 и могут быть связаны с любыми другими зависимостями. Как правило, это так же просто, как включить соответствующие операторы `#include \<...\>` (например, `#include \<v8.h\>`), и `node-gyp` автоматически найдет соответствующие заголовки. Однако следует помнить о нескольких предостережениях:

- Когда запускается `node-gyp`, она обнаруживает конкретную версию выпуска Node.js и загружает либо полный архив исходного кода, либо только заголовки. Если загружается полный исходный код, дополнения будут иметь полный доступ к полному набору зависимостей Node.js. Однако, если загружаются только заголовки Node.js, будут доступны только символы, экспортируемые Node.js.
- `node-gyp` можно запустить с флагом `--nodedir`, указывающим на локальный образ исходного кода Node.js. При использовании этой опции дополнение будет иметь доступ к полному набору зависимостей.

### Загрузка дополнений с помощью `require()` {#loading-addons-using-require}

Расширение имени файла скомпилированного двоичного файла дополнения — `.node` (в отличие от `.dll` или `.so`). Функция [`require()`](/ru/nodejs/api/modules#requireid) написана так, чтобы искать файлы с расширением `.node` и инициализировать их как динамически связанные библиотеки.

При вызове [`require()`](/ru/nodejs/api/modules#requireid) расширение `.node` обычно можно опустить, и Node.js все равно найдет и инициализирует дополнение. Однако следует учитывать, что Node.js сначала попытается найти и загрузить модули или файлы JavaScript, которые случайно имеют то же базовое имя. Например, если в том же каталоге, что и двоичный файл `addon.node`, есть файл `addon.js`, то [`require('addon')`](/ru/nodejs/api/modules#requireid) отдаст предпочтение файлу `addon.js` и загрузит его вместо этого.

## Собственные абстракции для Node.js {#native-abstractions-for-nodejs}

В каждом из примеров, проиллюстрированных в этом документе, для реализации дополнений непосредственно используются API Node.js и V8. API V8 может значительно меняться и менялся от одного выпуска V8 к другому (и от одного основного выпуска Node.js к другому). С каждым изменением дополнения может потребоваться обновить и перекомпилировать, чтобы продолжить работу. График выпуска Node.js разработан для минимизации частоты и влияния таких изменений, но Node.js мало что может сделать для обеспечения стабильности API V8.

[Собственные абстракции для Node.js](https://github.com/nodejs/nan) (или `nan`) предоставляют набор инструментов, которые разработчикам дополнений рекомендуется использовать для обеспечения совместимости между прошлыми и будущими выпусками V8 и Node.js. См. [примеры](https://github.com/nodejs/nan/tree/HEAD/examples/) `nan` для иллюстрации того, как их можно использовать.


## Node-API {#node-api}

::: tip [Stable: 2 - Stable]
[Stable: 2](/ru/nodejs/api/documentation#stability-index) [Стабильность: 2](/ru/nodejs/api/documentation#stability-index) - Стабильно
:::

Node-API - это API для создания нативных аддонов. Он не зависит от базовой среды выполнения JavaScript (например, V8) и поддерживается как часть самого Node.js. Этот API будет Application Binary Interface (ABI) стабильным между версиями Node.js. Он предназначен для защиты аддонов от изменений в базовом движке JavaScript и позволяет модулям, скомпилированным для одной версии, работать на более поздних версиях Node.js без перекомпиляции. Аддоны создаются/упаковываются с использованием того же подхода/инструментов, которые описаны в этом документе (node-gyp и т. д.). Единственное отличие - это набор API, которые используются нативным кодом. Вместо использования API V8 или [Native Abstractions for Node.js](https://github.com/nodejs/nan) используются функции, доступные в Node-API.

Создание и поддержка аддона, который выигрывает от стабильности ABI, предоставляемой Node-API, влечет за собой определенные [соображения реализации](/ru/nodejs/api/n-api#implications-of-abi-stability).

Чтобы использовать Node-API в приведенном выше примере "Hello world", замените содержимое `hello.cc` следующим. Все остальные инструкции остаются прежними.

```C++ [C++]
// hello.cc using Node-API
#include <node_api.h>

namespace demo {

napi_value Method(napi_env env, napi_callback_info args) {
  napi_value greeting;
  napi_status status;

  status = napi_create_string_utf8(env, "world", NAPI_AUTO_LENGTH, &greeting);
  if (status != napi_ok) return nullptr;
  return greeting;
}

napi_value init(napi_env env, napi_value exports) {
  napi_status status;
  napi_value fn;

  status = napi_create_function(env, nullptr, 0, Method, nullptr, &fn);
  if (status != napi_ok) return nullptr;

  status = napi_set_named_property(env, exports, "hello", fn);
  if (status != napi_ok) return nullptr;
  return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, init)

}  // namespace demo
```
Доступные функции и способы их использования описаны в [C/C++ аддонах с Node-API](/ru/nodejs/api/n-api).


## Примеры дополнений {#addon-examples}

Ниже приведены примеры дополнений, которые помогут разработчикам начать работу. В примерах используются API V8. Обратитесь к онлайн [справочнику V8](https://v8docs.nodesource.com/) для получения справки по различным вызовам V8 и к [Руководству для встраивателей](https://v8.dev/docs/embed) V8 для объяснения некоторых используемых концепций, таких как дескрипторы, области видимости, шаблоны функций и т. д.

В каждом из этих примеров используется следующий файл `binding.gyp`:

```json [JSON]
{
  "targets": [
    {
      "target_name": "addon",
      "sources": [ "addon.cc" ]
    }
  ]
}
```
В случаях, когда имеется более одного файла `.cc`, просто добавьте дополнительное имя файла в массив `sources`:

```json [JSON]
"sources": ["addon.cc", "myexample.cc"]
```
После того, как файл `binding.gyp` будет готов, примеры дополнений можно настроить и собрать с помощью `node-gyp`:

```bash [BASH]
node-gyp configure build
```
### Аргументы функции {#function-arguments}

Дополнения обычно предоставляют объекты и функции, к которым можно получить доступ из JavaScript, выполняемого в Node.js. Когда функции вызываются из JavaScript, входные аргументы и возвращаемое значение должны быть сопоставлены с кодом C/C++ и обратно.

Следующий пример иллюстрирует, как читать аргументы функции, переданные из JavaScript, и как вернуть результат:

```C++ [C++]
// addon.cc
#include <node.h>

namespace demo {

using v8::Exception;
using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Number;
using v8::Object;
using v8::String;
using v8::Value;

// Это реализация метода "add"
// Входные аргументы передаются с использованием
// struct const FunctionCallbackInfo<Value>& args
void Add(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  // Проверьте количество переданных аргументов.
  if (args.Length() < 2) {
    // Выбросить ошибку, которая передается обратно в JavaScript
    isolate->ThrowException(Exception::TypeError(
        String::NewFromUtf8(isolate,
                            "Wrong number of arguments").ToLocalChecked()));
    return;
  }

  // Проверьте типы аргументов
  if (!args[0]->IsNumber() || !args[1]->IsNumber()) {
    isolate->ThrowException(Exception::TypeError(
        String::NewFromUtf8(isolate,
                            "Wrong arguments").ToLocalChecked()));
    return;
  }

  // Выполните операцию
  double value =
      args[0].As<Number>()->Value() + args[1].As<Number>()->Value();
  Local<Number> num = Number::New(isolate, value);

  // Установите возвращаемое значение (используя переданный в
  // FunctionCallbackInfo<Value>&)
  args.GetReturnValue().Set(num);
}

void Init(Local<Object> exports) {
  NODE_SET_METHOD(exports, "add", Add);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Init)

}  // namespace demo
```
После компиляции пример дополнения можно потребовать и использовать из Node.js:

```js [ESM]
// test.js
const addon = require('./build/Release/addon');

console.log('This should be eight:', addon.add(3, 5));
```

### Обратные вызовы (Callbacks) {#callbacks}

В дополнениях распространена практика передачи JavaScript-функций в C++ функцию и их выполнения оттуда. Следующий пример иллюстрирует, как вызывать такие обратные вызовы:

```C++ [C++]
// addon.cc
#include <node.h>

namespace demo {

using v8::Context;
using v8::Function;
using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Null;
using v8::Object;
using v8::String;
using v8::Value;

void RunCallback(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();
  Local<Function> cb = Local<Function>::Cast(args[0]);
  const unsigned argc = 1;
  Local<Value> argv[argc] = {
      String::NewFromUtf8(isolate,
                          "hello world").ToLocalChecked() };
  cb->Call(context, Null(isolate), argc, argv).ToLocalChecked();
}

void Init(Local<Object> exports, Local<Object> module) {
  NODE_SET_METHOD(module, "exports", RunCallback);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Init)

}  // namespace demo
```
В этом примере используется двух-аргументная форма `Init()`, которая получает полный объект `module` в качестве второго аргумента. Это позволяет дополнению полностью перезаписать `exports` одной функцией, вместо добавления функции в качестве свойства `exports`.

Для проверки запустите следующий JavaScript:

```js [ESM]
// test.js
const addon = require('./build/Release/addon');

addon((msg) => {
  console.log(msg);
// Prints: 'hello world'
});
```
В этом примере функция обратного вызова вызывается синхронно.

### Фабрика объектов {#object-factory}

Дополнения могут создавать и возвращать новые объекты из C++ функции, как показано в следующем примере. Объект создается и возвращается со свойством `msg`, которое повторяет строку, переданную в `createObject()`:

```C++ [C++]
// addon.cc
#include <node.h>

namespace demo {

using v8::Context;
using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::String;
using v8::Value;

void CreateObject(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();

  Local<Object> obj = Object::New(isolate);
  obj->Set(context,
           String::NewFromUtf8(isolate,
                               "msg").ToLocalChecked(),
                               args[0]->ToString(context).ToLocalChecked())
           .FromJust();

  args.GetReturnValue().Set(obj);
}

void Init(Local<Object> exports, Local<Object> module) {
  NODE_SET_METHOD(module, "exports", CreateObject);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Init)

}  // namespace demo
```
Для проверки в JavaScript:

```js [ESM]
// test.js
const addon = require('./build/Release/addon');

const obj1 = addon('hello');
const obj2 = addon('world');
console.log(obj1.msg, obj2.msg);
// Prints: 'hello world'
```

### Фабрика функций {#function-factory}

Другой распространенный сценарий – создание JavaScript-функций, которые оборачивают C++ функции и возвращают их обратно в JavaScript:

```C++ [C++]
// addon.cc
#include <node.h>

namespace demo {

using v8::Context;
using v8::Function;
using v8::FunctionCallbackInfo;
using v8::FunctionTemplate;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::String;
using v8::Value;

void MyFunction(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  args.GetReturnValue().Set(String::NewFromUtf8(
      isolate, "hello world").ToLocalChecked());
}

void CreateFunction(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  Local<Context> context = isolate->GetCurrentContext();
  Local<FunctionTemplate> tpl = FunctionTemplate::New(isolate, MyFunction);
  Local<Function> fn = tpl->GetFunction(context).ToLocalChecked();

  // omit this to make it anonymous
  fn->SetName(String::NewFromUtf8(
      isolate, "theFunction").ToLocalChecked());

  args.GetReturnValue().Set(fn);
}

void Init(Local<Object> exports, Local<Object> module) {
  NODE_SET_METHOD(module, "exports", CreateFunction);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Init)

}  // namespace demo
```
Для тестирования:

```js [ESM]
// test.js
const addon = require('./build/Release/addon');

const fn = addon();
console.log(fn());
// Prints: 'hello world'
```
### Обертывание C++ объектов {#wrapping-c-objects}

Также возможно обернуть C++ объекты/классы таким образом, чтобы новые экземпляры могли быть созданы с использованием JavaScript оператора `new`:

```C++ [C++]
// addon.cc
#include <node.h>
#include "myobject.h"

namespace demo {

using v8::Local;
using v8::Object;

void InitAll(Local<Object> exports) {
  MyObject::Init(exports);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, InitAll)

}  // namespace demo
```
Затем, в `myobject.h`, класс-обертка наследуется от `node::ObjectWrap`:

```C++ [C++]
// myobject.h
#ifndef MYOBJECT_H
#define MYOBJECT_H

#include <node.h>
#include <node_object_wrap.h>

namespace demo {

class MyObject : public node::ObjectWrap {
 public:
  static void Init(v8::Local<v8::Object> exports);

 private:
  explicit MyObject(double value = 0);
  ~MyObject();

  static void New(const v8::FunctionCallbackInfo<v8::Value>& args);
  static void PlusOne(const v8::FunctionCallbackInfo<v8::Value>& args);

  double value_;
};

}  // namespace demo

#endif
```
В `myobject.cc`, реализуйте различные методы, которые должны быть предоставлены. В следующем коде, метод `plusOne()` предоставляется путем добавления его к прототипу конструктора:

```C++ [C++]
// myobject.cc
#include "myobject.h"

namespace demo {

using v8::Context;
using v8::Function;
using v8::FunctionCallbackInfo;
using v8::FunctionTemplate;
using v8::Isolate;
using v8::Local;
using v8::Number;
using v8::Object;
using v8::ObjectTemplate;
using v8::String;
using v8::Value;

MyObject::MyObject(double value) : value_(value) {
}

MyObject::~MyObject() {
}

void MyObject::Init(Local<Object> exports) {
  Isolate* isolate = exports->GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();

  Local<ObjectTemplate> addon_data_tpl = ObjectTemplate::New(isolate);
  addon_data_tpl->SetInternalFieldCount(1);  // 1 field for the MyObject::New()
  Local<Object> addon_data =
      addon_data_tpl->NewInstance(context).ToLocalChecked();

  // Prepare constructor template
  Local<FunctionTemplate> tpl = FunctionTemplate::New(isolate, New, addon_data);
  tpl->SetClassName(String::NewFromUtf8(isolate, "MyObject").ToLocalChecked());
  tpl->InstanceTemplate()->SetInternalFieldCount(1);

  // Prototype
  NODE_SET_PROTOTYPE_METHOD(tpl, "plusOne", PlusOne);

  Local<Function> constructor = tpl->GetFunction(context).ToLocalChecked();
  addon_data->SetInternalField(0, constructor);
  exports->Set(context, String::NewFromUtf8(
      isolate, "MyObject").ToLocalChecked(),
      constructor).FromJust();
}

void MyObject::New(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();

  if (args.IsConstructCall()) {
    // Invoked as constructor: `new MyObject(...)`
    double value = args[0]->IsUndefined() ?
        0 : args[0]->NumberValue(context).FromMaybe(0);
    MyObject* obj = new MyObject(value);
    obj->Wrap(args.This());
    args.GetReturnValue().Set(args.This());
  } else {
    // Invoked as plain function `MyObject(...)`, turn into construct call.
    const int argc = 1;
    Local<Value> argv[argc] = { args[0] };
    Local<Function> cons =
        args.Data().As<Object>()->GetInternalField(0)
            .As<Value>().As<Function>();
    Local<Object> result =
        cons->NewInstance(context, argc, argv).ToLocalChecked();
    args.GetReturnValue().Set(result);
  }
}

void MyObject::PlusOne(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  MyObject* obj = ObjectWrap::Unwrap<MyObject>(args.This());
  obj->value_ += 1;

  args.GetReturnValue().Set(Number::New(isolate, obj->value_));
}

}  // namespace demo
```
Чтобы собрать этот пример, файл `myobject.cc` должен быть добавлен в `binding.gyp`:

```json [JSON]
{
  "targets": [
    {
      "target_name": "addon",
      "sources": [
        "addon.cc",
        "myobject.cc"
      ]
    }
  ]
}
```
Протестируйте это с помощью:

```js [ESM]
// test.js
const addon = require('./build/Release/addon');

const obj = new addon.MyObject(10);
console.log(obj.plusOne());
// Prints: 11
console.log(obj.plusOne());
// Prints: 12
console.log(obj.plusOne());
// Prints: 13
```
Деструктор для объекта-обертки будет запущен, когда объект будет собран сборщиком мусора. Для тестирования деструктора существуют флаги командной строки, которые можно использовать, чтобы принудительно выполнить сборку мусора. Эти флаги предоставляются базовым движком JavaScript V8. Они могут быть изменены или удалены в любое время. Они не документированы Node.js или V8 и никогда не должны использоваться вне тестирования.

Во время завершения процесса или рабочих потоков деструкторы не вызываются движком JS. Поэтому пользователь несет ответственность за отслеживание этих объектов и обеспечение надлежащего уничтожения, чтобы избежать утечек ресурсов.


### Фабрика обернутых объектов {#factory-of-wrapped-objects}

В качестве альтернативы, можно использовать паттерн "фабрика", чтобы избежать явного создания экземпляров объектов с помощью JavaScript оператора `new`:

```js [ESM]
const obj = addon.createObject();
// вместо:
// const obj = new addon.Object();
```
Во-первых, метод `createObject()` реализован в `addon.cc`:

```C++ [C++]
// addon.cc
#include <node.h>
#include "myobject.h"

namespace demo {

using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::String;
using v8::Value;

void CreateObject(const FunctionCallbackInfo<Value>& args) {
  MyObject::NewInstance(args);
}

void InitAll(Local<Object> exports, Local<Object> module) {
  MyObject::Init(exports->GetIsolate());

  NODE_SET_METHOD(module, "exports", CreateObject);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, InitAll)

}  // namespace demo
```
В `myobject.h`, статический метод `NewInstance()` добавлен для обработки создания экземпляра объекта. Этот метод заменяет использование `new` в JavaScript:

```C++ [C++]
// myobject.h
#ifndef MYOBJECT_H
#define MYOBJECT_H

#include <node.h>
#include <node_object_wrap.h>

namespace demo {

class MyObject : public node::ObjectWrap {
 public:
  static void Init(v8::Isolate* isolate);
  static void NewInstance(const v8::FunctionCallbackInfo<v8::Value>& args);

 private:
  explicit MyObject(double value = 0);
  ~MyObject();

  static void New(const v8::FunctionCallbackInfo<v8::Value>& args);
  static void PlusOne(const v8::FunctionCallbackInfo<v8::Value>& args);
  static v8::Global<v8::Function> constructor;
  double value_;
};

}  // namespace demo

#endif
```
Реализация в `myobject.cc` аналогична предыдущему примеру:

```C++ [C++]
// myobject.cc
#include <node.h>
#include "myobject.h"

namespace demo {

using node::AddEnvironmentCleanupHook;
using v8::Context;
using v8::Function;
using v8::FunctionCallbackInfo;
using v8::FunctionTemplate;
using v8::Global;
using v8::Isolate;
using v8::Local;
using v8::Number;
using v8::Object;
using v8::String;
using v8::Value;

// Warning! This is not thread-safe, this addon cannot be used for worker
// threads.
Global<Function> MyObject::constructor;

MyObject::MyObject(double value) : value_(value) {
}

MyObject::~MyObject() {
}

void MyObject::Init(Isolate* isolate) {
  // Prepare constructor template
  Local<FunctionTemplate> tpl = FunctionTemplate::New(isolate, New);
  tpl->SetClassName(String::NewFromUtf8(isolate, "MyObject").ToLocalChecked());
  tpl->InstanceTemplate()->SetInternalFieldCount(1);

  // Prototype
  NODE_SET_PROTOTYPE_METHOD(tpl, "plusOne", PlusOne);

  Local<Context> context = isolate->GetCurrentContext();
  constructor.Reset(isolate, tpl->GetFunction(context).ToLocalChecked());

  AddEnvironmentCleanupHook(isolate, [](void*) {
    constructor.Reset();
  }, nullptr);
}

void MyObject::New(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();

  if (args.IsConstructCall()) {
    // Invoked as constructor: `new MyObject(...)`
    double value = args[0]->IsUndefined() ?
        0 : args[0]->NumberValue(context).FromMaybe(0);
    MyObject* obj = new MyObject(value);
    obj->Wrap(args.This());
    args.GetReturnValue().Set(args.This());
  } else {
    // Invoked as plain function `MyObject(...)`, turn into construct call.
    const int argc = 1;
    Local<Value> argv[argc] = { args[0] };
    Local<Function> cons = Local<Function>::New(isolate, constructor);
    Local<Object> instance =
        cons->NewInstance(context, argc, argv).ToLocalChecked();
    args.GetReturnValue().Set(instance);
  }
}

void MyObject::NewInstance(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  const unsigned argc = 1;
  Local<Value> argv[argc] = { args[0] };
  Local<Function> cons = Local<Function>::New(isolate, constructor);
  Local<Context> context = isolate->GetCurrentContext();
  Local<Object> instance =
      cons->NewInstance(context, argc, argv).ToLocalChecked();

  args.GetReturnValue().Set(instance);
}

void MyObject::PlusOne(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  MyObject* obj = ObjectWrap::Unwrap<MyObject>(args.This());
  obj->value_ += 1;

  args.GetReturnValue().Set(Number::New(isolate, obj->value_));
}

}  // namespace demo
```
И снова, чтобы собрать этот пример, файл `myobject.cc` должен быть добавлен в `binding.gyp`:

```json [JSON]
{
  "targets": [
    {
      "target_name": "addon",
      "sources": [
        "addon.cc",
        "myobject.cc"
      ]
    }
  ]
}
```
Проверьте это с помощью:

```js [ESM]
// test.js
const createObject = require('./build/Release/addon');

const obj = createObject(10);
console.log(obj.plusOne());
// Prints: 11
console.log(obj.plusOne());
// Prints: 12
console.log(obj.plusOne());
// Prints: 13

const obj2 = createObject(20);
console.log(obj2.plusOne());
// Prints: 21
console.log(obj2.plusOne());
// Prints: 22
console.log(obj2.plusOne());
// Prints: 23
```

### Передача обёрнутых объектов {#passing-wrapped-objects-around}

В дополнение к оборачиванию и возврату объектов C++, можно передавать обёрнутые объекты, распаковывая их с помощью вспомогательной функции Node.js `node::ObjectWrap::Unwrap`. В следующем примере показана функция `add()`, которая может принимать два объекта `MyObject` в качестве входных аргументов:

```C++ [C++]
// addon.cc
#include <node.h>
#include <node_object_wrap.h>
#include "myobject.h"

namespace demo {

using v8::Context;
using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Number;
using v8::Object;
using v8::String;
using v8::Value;

void CreateObject(const FunctionCallbackInfo<Value>& args) {
  MyObject::NewInstance(args);
}

void Add(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();

  MyObject* obj1 = node::ObjectWrap::Unwrap<MyObject>(
      args[0]->ToObject(context).ToLocalChecked());
  MyObject* obj2 = node::ObjectWrap::Unwrap<MyObject>(
      args[1]->ToObject(context).ToLocalChecked());

  double sum = obj1->value() + obj2->value();
  args.GetReturnValue().Set(Number::New(isolate, sum));
}

void InitAll(Local<Object> exports) {
  MyObject::Init(exports->GetIsolate());

  NODE_SET_METHOD(exports, "createObject", CreateObject);
  NODE_SET_METHOD(exports, "add", Add);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, InitAll)

}  // namespace demo
```
В `myobject.h` добавлен новый публичный метод, позволяющий получить доступ к приватным значениям после распаковки объекта.

```C++ [C++]
// myobject.h
#ifndef MYOBJECT_H
#define MYOBJECT_H

#include <node.h>
#include <node_object_wrap.h>

namespace demo {

class MyObject : public node::ObjectWrap {
 public:
  static void Init(v8::Isolate* isolate);
  static void NewInstance(const v8::FunctionCallbackInfo<v8::Value>& args);
  inline double value() const { return value_; }

 private:
  explicit MyObject(double value = 0);
  ~MyObject();

  static void New(const v8::FunctionCallbackInfo<v8::Value>& args);
  static v8::Global<v8::Function> constructor;
  double value_;
};

}  // namespace demo

#endif
```
Реализация `myobject.cc` остается похожей на предыдущую версию:

```C++ [C++]
// myobject.cc
#include <node.h>
#include "myobject.h"

namespace demo {

using node::AddEnvironmentCleanupHook;
using v8::Context;
using v8::Function;
using v8::FunctionCallbackInfo;
using v8::FunctionTemplate;
using v8::Global;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::String;
using v8::Value;

// Warning! This is not thread-safe, this addon cannot be used for worker
// threads.
Global<Function> MyObject::constructor;

MyObject::MyObject(double value) : value_(value) {
}

MyObject::~MyObject() {
}

void MyObject::Init(Isolate* isolate) {
  // Prepare constructor template
  Local<FunctionTemplate> tpl = FunctionTemplate::New(isolate, New);
  tpl->SetClassName(String::NewFromUtf8(isolate, "MyObject").ToLocalChecked());
  tpl->InstanceTemplate()->SetInternalFieldCount(1);

  Local<Context> context = isolate->GetCurrentContext();
  constructor.Reset(isolate, tpl->GetFunction(context).ToLocalChecked());

  AddEnvironmentCleanupHook(isolate, [](void*) {
    constructor.Reset();
  }, nullptr);
}

void MyObject::New(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  Local<Context> context = isolate->GetCurrentContext();

  if (args.IsConstructCall()) {
    // Invoked as constructor: `new MyObject(...)`
    double value = args[0]->IsUndefined() ?
        0 : args[0]->NumberValue(context).FromMaybe(0);
    MyObject* obj = new MyObject(value);
    obj->Wrap(args.This());
    args.GetReturnValue().Set(args.This());
  } else {
    // Invoked as plain function `MyObject(...)`, turn into construct call.
    const int argc = 1;
    Local<Value> argv[argc] = { args[0] };
    Local<Function> cons = Local<Function>::New(isolate, constructor);
    Local<Object> instance =
        cons->NewInstance(context, argc, argv).ToLocalChecked();
    args.GetReturnValue().Set(instance);
  }
}

void MyObject::NewInstance(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  const unsigned argc = 1;
  Local<Value> argv[argc] = { args[0] };
  Local<Function> cons = Local<Function>::New(isolate, constructor);
  Local<Context> context = isolate->GetCurrentContext();
  Local<Object> instance =
      cons->NewInstance(context, argc, argv).ToLocalChecked();

  args.GetReturnValue().Set(instance);
}

}  // namespace demo
```
Протестируйте это с помощью:

```js [ESM]
// test.js
const addon = require('./build/Release/addon');

const obj1 = addon.createObject(10);
const obj2 = addon.createObject(20);
const result = addon.add(obj1, obj2);

console.log(result);
// Prints: 30
```
