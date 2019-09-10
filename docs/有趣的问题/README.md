# 有趣的问题

## Javascript

### 1. 使以下代码正常运行
```javascript
   const a = [1, 2, 3, 4, 5]
   a.multiply()
   console.log(a) // [ 1, 2, 3, 4, 5, 1, 4, 9, 16, 25 ]
```

答案：
```javascript
   Array.prototype.multiply = function() {
   this.splice(this.length, 0, ...this.map(v => v * v))
   }

   const a = [1, 2, 3, 4, 5]
   a.multiply()
   console.log(a)
```
思考点有两个，prototype 和 改变原有数组的方法 splice

### 2. 以下运行结果是什么
```javascript
   const a = {
      key1: Symbol(1),
      key2() {},
      key3: undefined,
      key4: null,
      key5: 10,
   }
   console.log(JSON.stringify(a))
```
答案：
```javascript
   {
      "key4": null
      "key5": 10
   }
```
`JSON.stringify` 将对象转换为 JSON 时，不能文本化的属性会被忽略，但是在数组中不可被 stringify 的元素用 null 填充。
```javascript
   const b = [Symbol(1), function(){}, undefined, null]
   console.log(JSON.stringify(b)) // [null,null,null,null]
```

### 3. 运行下面代码是何结果？为什么？
```js
function foo(num) {
   this.count++
}

foo.count = 0;
var i;
for (i = 0; i < 10; i++) {
   if (i > 5) {
      foo(i);
   }
}

console.log(foo.count);
```
答案 0
- 原因 `this.count++` 这里的 `this.count !== foo.count`
- `this.count` 相当于 `windows.count`
- `foo.count` 相当于在 `foo` 下挂载了一个 `count` 属性, `this.count++` 并没有加到 `foo.count` 上面

### 4. 下面这段呢？为什么？
```js
function somefunction() {
   return () => {
      return () => {
         return () => {
            console.log(this.a)
         }
      }
   }
}

somefunction.call({a: 1}).call({a: 2}).call({a: 3}).call({a: 4})
```
答案 1
- 原因 箭头函数的 `this` 取决于函数所在上下文的 `this`, 
- 这里 `console.log(this.a)` 的 `this` 会一直向上找到`somefunction` 的 `this` 指向。
- `somefunction` 第一个 `call` 的第一个参数为 `{a: 1}`， 就是 `console.log(this.a)` 的 `this`

### 5. 给数字加上千位分隔符号，比如 2000 加上符号后为 2,000
```js
function format(number) {
  // 数字转为字符数组
  // 遍历数组 每间隔三位添加逗号
  // 可能会出现 123,456,7
  const _number = number.toString()
  // 先将数组倒序
  const _arr = _number.split('').reverse()
  const res = []
  for (let i = 0; i < _arr.length; i++) {
    if(i % 3 === 0 && i !== 0) {
      res.push(',')
    }
    res.push(_arr[i])
  }
  res.reverse()
  return res.join('')
}

const a = 1234567
console.log(format(a))

// 还有一个 js 自带的函数 toLocaleString
// a.toLocaleString()
```