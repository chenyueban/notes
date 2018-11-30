# TypeScript

## 原始数据类型
JavaScript 类型分为两种: 原始数据类型和对象类型。
原始数据类型包括： boolean number string null undefined symbol

### 布尔值
使用 `boolean` 定义布尔值类型:
```ts
const isDone: boolean = false;
```
注意，使用构造函数 `Boolean` 创造的对象不是布尔值:
```ts
const newBoolean: boolean = new Boolean(1);
// 不能将类型“Boolean”分配给类型“boolean”。“boolean”是基元，但“Boolean”是包装器对象。如可能首选使用“boolean”。 [2322]
```
事实上 `new Boolean()` 返回的是一个 `Boolean` 对象:
```ts
const newBoolean: Boolean = new Boolean(1);
```
直接调用 `Boolean` 也可以返回一个 `boolean` 类型:
```ts
const newBoolean: boolean = Boolean(1);
```
在 TypeScript 中, `boolean` 是 JavaScript 中的基本类型, 而 `Boolean` 是 JavaScript 中的构造函数. 其他基本类型 (除了 `null` 和 `undefined`) 一样.

### 空值
JavaScript 没有空值(Void)的概念, 在 TypeScript 中, 可以用 `void` 表示没有用任何返回值的函数:
```ts
function foo(): void {
  console.log('hello');
}
```
也可以用 `void` 表示 `null` 和 `undefined`, 但是这并没有什么意义.
```ts
const n: void = null;
const u: void = undefined;
```

### Null 和 Undefined
可以使用 `null` 和 `undefined` 类型分别定义这两个原始数据类型:
```ts
const n: null = null;
const u: undefined = undefined;
```
但是 `null` 类型只能赋值为 `null`, `undefined` 类型只能赋值为 `undefined`.

与 `void` 不同的是, `undefined` 和 `null` 是所有类型的子类型. 也就是说 `undefined` 类型的变量, 可以赋值给 `number` 类型的变量:
```ts
const num: number = undefined; // ok
```
```ts
const u: undefined = undefined;
const num: number = u; // ok
```
而 `void` 类型的变量不能赋值给 `number` 类型的变量:
```ts
const u: void = undefined;
const num: number = u; // 不能将类型“void”分配给类型“number”。 [2322]
```

### 数组
有两种方式可以定义数组。
第一种:
```ts
const list: number[] = [1, 2, 3];
```
第二种，使用数组泛型:
```ts
const list: Array<number> = [1, 2, 3];
```

### 元组 Tuple
> 元组类型允许表示一个已知元素数量和类型的数组，各元素的类型不必相同。
```ts
// Declare a tuple type
let x: [string, number];
// Initialize it
x = ['hello', 10]; // OK
// Initialize it incorrectly
x = [10, 'hello']; // Error
```
> 当访问一个越界的元素，会使用联合类型替代
```ts
x[3] = 'world'; // OK, 字符串可以赋值给(string | number)类型

console.log(x[5].toString()); // OK, 'string' 和 'number' 都有 toString

x[6] = true; // Error, 布尔不是(string | number)类型
```

### 枚举
