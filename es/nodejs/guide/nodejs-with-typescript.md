---
title: Node.js con TypeScript
description: Aprende a usar TypeScript con Node.js, incluyendo sus beneficios, instalación y uso. Descubre cómo compilar y ejecutar código TypeScript y explora sus características y herramientas.
head:
  - - meta
    - name: og:title
      content: Node.js con TypeScript | Node.js - iDoc.dev
  - - meta
    - name: og:description
      content: Aprende a usar TypeScript con Node.js, incluyendo sus beneficios, instalación y uso. Descubre cómo compilar y ejecutar código TypeScript y explora sus características y herramientas.
  - - meta
    - name: twitter:title
      content: Node.js con TypeScript | Node.js - iDoc.dev
  - - meta
    - name: twitter:description
      content: Aprende a usar TypeScript con Node.js, incluyendo sus beneficios, instalación y uso. Descubre cómo compilar y ejecutar código TypeScript y explora sus características y herramientas.
---


# Node.js con TypeScript

## ¿Qué es TypeScript?

[TypeScript](https://www.typescriptlang.org) es un lenguaje de código abierto mantenido y desarrollado por Microsoft. Es amado y utilizado por muchos desarrolladores de software en todo el mundo.

Básicamente, es un superconjunto de JavaScript que agrega nuevas capacidades al lenguaje. La adición más notable son las definiciones de tipo estáticas, algo que no está presente en JavaScript simple. Gracias a los tipos, es posible, por ejemplo, declarar qué tipo de argumentos esperamos y qué se devuelve exactamente en nuestras funciones o cuál es la forma exacta del objeto que estamos creando. TypeScript es una herramienta realmente poderosa y abre un nuevo mundo de posibilidades en los proyectos de JavaScript. Hace que nuestro código sea más seguro y robusto al prevenir muchos errores incluso antes de que el código se envíe: detecta problemas durante el desarrollo del código y se integra maravillosamente con editores de código como Visual Studio Code.

Podemos hablar sobre otros beneficios de TypeScript más adelante, ¡veamos algunos ejemplos ahora!

### Ejemplos

Eche un vistazo a este fragmento de código y luego podemos analizarlo juntos:

```ts
type User = {
  name: string
  age: number
}
function isAdult(user: User): boolean {
  return user.age >= 18
}
const justine: User = {
  name: 'Justine',
  age: 23,
}
const isJustineAnAdult: boolean = isAdult(justine)
```

La primera parte (con la palabra clave `type`) es responsable de declarar nuestro tipo de objeto personalizado que representa a los usuarios. Más adelante, utilizamos este tipo recién creado para crear la función `isAdult` que acepta un argumento de tipo `User` y devuelve `boolean`. Después de esto, creamos `justine`, nuestros datos de ejemplo que se pueden usar para llamar a la función definida previamente. Finalmente, creamos una nueva variable con información sobre si `justine` es un adulto.

Hay cosas adicionales sobre este ejemplo que debe saber. En primer lugar, si no cumpliéramos con los tipos declarados, TypeScript nos alertaría de que algo está mal y evitaría el uso indebido. En segundo lugar, no todo debe escribirse explícitamente: TypeScript es muy inteligente y puede deducir tipos para nosotros. Por ejemplo, la variable `isJustineAnAdult` sería de tipo booleano incluso si no la escribiéramos explícitamente o `justine` sería un argumento válido para nuestra función incluso si no declaráramos esta variable como de tipo `User`.

Bien, entonces tenemos algo de código TypeScript. Ahora, ¿cómo lo ejecutamos?

**Lo primero que hay que hacer es instalar TypeScript en nuestro proyecto:**

```bash
npm install -D typescript
```

Ahora podemos compilarlo a JavaScript usando el comando `tsc` en la terminal. ¡Hagámoslo!

**Suponiendo que nuestro archivo se llama `example.ts`, el comando sería:**

```bash
npx tsc example.ts
```

::: tip
**[npx](https://www.npmjs.com/package/npx) aquí significa Node Package Execute. Esta herramienta nos permite ejecutar el compilador de TypeScript sin instalarlo globalmente.**
:::

`tsc` es el compilador de TypeScript que tomará nuestro código TypeScript y lo compilará a JavaScript. Este comando resultará en un nuevo archivo llamado `example.js` que podemos ejecutar usando Node.js. Ahora que sabemos cómo compilar y ejecutar código TypeScript, ¡veamos las capacidades de prevención de errores de TypeScript en acción!

**Así es como modificaremos nuestro código:**

```ts
type User = {
  name: string
  age: number
}
function isAdult(user: User): boolean {
  return user.age >= 18
}
const justine: User = {
  name: 'Justine',
  age: 'Secret!',
}
const isJustineAnAdult: string = isAdult(justine, "I shouldn't be here!")
```

**Y esto es lo que TypeScript tiene que decir sobre esto:**

```bash
example.ts:12:5 - error TS2322: Type 'string' is not assignable to type 'number'.
12     age: 'Secret!',
       ~~~
  example.ts:3:5
    3     age: number;
          ~~~
    The expected type comes from property 'age' which is declared here on type 'User'
example.ts:15:7 - error TS2322: Type 'boolean' is not assignable to type 'string'.
15 const isJustineAnAdult: string = isAdult(justine, "I shouldn't be here!");
         ~~~~~~~~~~~~~~~~
example.ts:15:51 - error TS2554: Expected 1 arguments, but got 2.
15 const isJustineAnAdult: string = isAdult(justine, "I shouldn't be here!");
                                                     ~~~~~~~~~~~~~~~~~~~~~~
Found 3 errors in the same file, starting at: example.ts:12
```

Como puede ver, TypeScript nos impide con éxito enviar código que podría funcionar inesperadamente. ¡Eso es maravilloso!


## Más sobre TypeScript

TypeScript ofrece muchos otros mecanismos geniales como interfaces, clases, tipos de utilidad y demás. Además, en proyectos más grandes puedes declarar la configuración de tu compilador de TypeScript en un archivo separado y ajustar granularmente cómo funciona, cuán estricto es y dónde almacena los archivos compilados, por ejemplo. Puedes leer más sobre todas estas cosas asombrosas en [la documentación oficial de TypeScript](https://www.typescriptlang.org/docs).

Algunos de los otros beneficios de TypeScript que vale la pena mencionar son que se puede adoptar progresivamente, ayuda a que el código sea más legible y comprensible y permite a los desarrolladores utilizar características modernas del lenguaje al enviar código para versiones antiguas de Node.js.

## Ejecutando código TypeScript en Node.js

Node.js no puede ejecutar TypeScript de forma nativa. No puedes llamar a `node example.ts` desde la línea de comandos directamente. Pero hay tres soluciones a este problema:

### Compilar TypeScript a JavaScript

Si deseas ejecutar código TypeScript en Node.js, primero debes compilarlo a JavaScript. Puedes hacer esto usando el compilador de TypeScript `tsc` como se mostró anteriormente.

Aquí tienes un pequeño ejemplo:

```bash
npx tsc example.ts
node example.js
```

### Ejecutando código TypeScript con `ts-node`

Puedes usar [ts-node](https://www.npmjs.com/package/ts-node) para ejecutar código TypeScript directamente en Node.js sin necesidad de compilarlo primero. Pero no está verificando el tipo de tu código. Por lo tanto, recomendamos verificar el tipo de tu código primero con `tsc` y luego ejecutarlo con `ts-node` antes de enviarlo.

Para usar `ts-node`, primero debes instalarlo:

````bash
npm install -D ts-node
``

Luego puedes ejecutar tu código TypeScript así:

```bash
npx ts-node example.ts
````

### Ejecutando código TypeScript con `tsx`

Puedes usar [tsx](https://www.npmjs.com/package/tsx) para ejecutar código TypeScript directamente en Node.js sin necesidad de compilarlo primero. Pero no está verificando el tipo de tu código. Por lo tanto, recomendamos verificar el tipo de tu código primero con `tsc` y luego ejecutarlo con `tsx` antes de enviarlo.

Para usar tsx, primero debes instalarlo:

```bash
npm install -D tsx
```

Luego puedes ejecutar tu código TypeScript así:

```bash
npx tsx example.ts
```

Si deseas usar `tsx` a través de `node`, puedes registrar `tsx` a través de `--import`:

```bash
node --import=tsx example.ts
```


## TypeScript en el mundo de Node.js

TypeScript está bien establecido en el mundo de Node.js y es utilizado por muchas empresas, proyectos de código abierto, herramientas y frameworks. Algunos de los ejemplos notables de proyectos de código abierto que utilizan TypeScript son:

- [NestJS](https://nestjs.com) - framework robusto y con todas las funciones que hace que la creación de sistemas escalables y bien diseñados sea fácil y agradable
- [TypeORM](https://typeorm.io) - gran ORM influenciado por otras herramientas conocidas de otros lenguajes como Hibernate, Doctrine o Entity Framework
- [Prisma](https://prisma.io) - ORM de última generación con un modelo de datos declarativo, migraciones generadas y consultas de bases de datos totalmente type-safe
- [RxJS](https://rxjs.dev) - biblioteca ampliamente utilizada para la programación reactiva
- [AdonisJS](https://adonisjs.com) - Un framework web con todas las funciones con Node.js
- [FoalTs](https://foal.dev) - El elegante framework de Nodejs

Y muchos, muchos más proyectos geniales... ¡Tal vez incluso el próximo tuyo!

