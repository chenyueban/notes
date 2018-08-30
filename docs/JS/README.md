# JS

## Typeof
`typeof` 对于基本类型，除了 `typeof` 都可以显示正确的类型
```javascript
typeof 1 // 'number'
typeof '1' // 'string'
typeof undefined // 'undefined'
typeof true // 'boolean'
typeof Symbol() // 'symbol'
typeof b // b 没有声明，但是还会显示 undefined
```
`typeof` 对于对象，除了函数都会显示 `object`
```javascript
typeof [] // 'object'
typeof {} // 'object'
typeof console.log // 'function'
```
对于 `null` 来说，虽然它是基本类型，但是会显示 `object`，这是一个存在很久了的 Bug
```javascript
typeof null // 'object'
```
> PS：为什么会出现这种情况呢？因为在 JS 的最初版本中，使用的是 32 位系统，为了性能考虑使用低位存储了变量的类型信息，000 开头代表是对象，然而 null 表示为全零，所以将它错误的判断为 object 。虽然现在的内部类型判断代码已经改变了，但是对于这个 Bug 却是一直流传下来。

> 如果我们想获得一个变量的正确类型，可以通过 Object.prototype.toString.call(xx)。这样我们就可以获得类似 [Object Type] 的字符串。
```javascript
let a
// 我们也可以这样判断 undefined
a === undefined
// 但是 undefined 保留字，能够在低版本浏览器被赋值
let undefined = 1
// 这样判断就会出错
// 所以可以用下面的方式来判断，并且代码量更少
// 因为 void 后面随便跟上一个组成表达式
// 返回就是 undefined
a === void 0
```

## 条件语句自动转换为 `Boolean`
```javascript
if (xxx !== undefined && xxx !== null && xxx !== '') {}
// 简写为
if (xxx) {}
```
```javascript
// 除了以下五个值，其他都是自动转为true
undefined
null
0 或 +0 或 -0
NaN
'' //（空字符串）
```
*需要注意的是*

- 空对象 {} 空数组 [] 全部转化为true
- 空对象 {} 空数组 [] 全部转化为true
- 空对象 {} 空数组 [] 全部转化为true

如果判断空数组
```javascript
if (xxx.length) {}
```
如果判断空对象
```javascript
if (Object.keys(xxx).length) {}
```

## 扩展运算符
### 复制数组
> 数组是复合的数据类型，直接复制的话，只是复制了指向底层数据结构的指针，而不是克隆一个全新的数组。
```javascript
const a1 = [1, 2];
const a2 = a1;

a2[0] = 2;
a1 // [2, 2]
```
上面代码中，a2并不是a1的克隆，而是指向同一份数据的另一个指针。修改a2，会直接导致a1的变化。

ES5 只能用变通方法来复制数组。
```javascript
const a1 = [1, 2];
const a2 = a1.concat();

a2[0] = 2;
a1 // [1, 2]
```
扩展运算符提供了复制数组的简便写法。
```javascript
const a1 = [1, 2];
// 写法一
const a2 = [...a1];
// 写法二
const [...a2] = a1;
```
### 合并数组
扩展运算符提供了数组合并的新写法。
```javascript
const arr1 = ['a', 'b'];
const arr2 = ['c'];
const arr3 = ['d', 'e'];

// ES5 的合并数组
arr1.concat(arr2, arr3);
// [ 'a', 'b', 'c', 'd', 'e' ]

// ES6 的合并数组
[...arr1, ...arr2, ...arr3]
// [ 'a', 'b', 'c', 'd', 'e' ]
```
不过，这两种方法都是浅拷贝，使用的时候需要注意。
```javascript
const a1 = [{ foo: 1 }];
const a2 = [{ bar: 2 }];

const a3 = a1.concat(a2);
const a4 = [...a1, ...a2];

a3[0] === a1[0] // true
a4[0] === a1[0] // true
```
### 合并对象
```javascript
const obj1 = { foo: 1 }
const obj2 = { bar: 2 }

const obj3 = { ...obj1, ...obj2 }
```

## 深拷贝与浅拷贝
```javascript
let a = {
    age: 1
}
let b = a
a.age = 2
console.log(b.age) // 2
```
从上述例子中我们可以发现，如果给一个变量赋值一个对象，那么两者的值会是同一个引用，其中一方改变，另一方也会相应改变。

通常在开发中我们不希望出现这样的问题，我们可以使用浅拷贝来解决这个问题。

### 浅拷贝
首先可以通过 Object.assign 来解决这个问题。
```javascript
let a = {
    age: 1
}
let b = Object.assign({}, a)
a.age = 2
console.log(b.age) // 1
```
当然我们也可以通过展开运算符（…）来解决
```javascript
let a = {
    age: 1
}
let b = {...a}
a.age = 2
console.log(b.age) // 1
```
通常浅拷贝就能解决大部分问题了，但是当我们遇到如下情况就需要使用到深拷贝了
```javascript
let a = {
    age: 1,
    jobs: {
        first: 'FE'
    }
}
let b = {...a}
a.jobs.first = 'native'
console.log(b.jobs.first) // native
```
浅拷贝只解决了第一层的问题，如果接下去的值中还有对象的话，那么就又回到刚开始的话题了，两者享有相同的引用。要解决这个问题，我们需要引入深拷贝。

### 深拷贝
这个问题通常可以通过 `JSON.parse(JSON.stringify(object))` 来解决。
```javascript
let a = {
    age: 1,
    jobs: {
        first: 'FE'
    }
}
let b = JSON.parse(JSON.stringify(a))
a.jobs.first = 'native'
console.log(b.jobs.first) // FE
```
但是该方法也是有局限性的：
- 会忽略 undefined
- 不能序列化函数
- 不能解决循环引用的对象
```javascript
let obj = {
  a: 1,
  b: {
    c: 2,
    d: 3,
  },
}
obj.c = obj.b
obj.e = obj.a
obj.b.c = obj.c
obj.b.d = obj.b
obj.b.e = obj.b.c
let newObj = JSON.parse(JSON.stringify(obj))
console.log(newObj)
```
如果你有这么一个循环引用对象，你会发现你不能通过该方法深拷贝

![error](https://user-gold-cdn.xitu.io/2018/3/28/1626b1ec2d3f9e41?w=840&h=100&f=png&s=30123)

在遇到函数或者 `undefined` 的时候，该对象也不能正常的序列化
```javascript
let a = {
    age: undefined,
    jobs: function() {},
    name: 'yck'
}
let b = JSON.parse(JSON.stringify(a))
console.log(b) // {name: "yck"}
```
你会发现在上述情况中，该方法会忽略掉函数和 `undefined` 。

但是在通常情况下，复杂数据都是可以序列化的，所以这个函数可以解决大部分问题，并且该函数是内置函数中处理深拷贝性能最快的。当然如果你的数据中含有以上三种情况下，可以使用 `loadash` 的深拷贝函数。

如果你所需拷贝的对象含有内置类型并且不包含函数，可以使用 `MessageChannel`
```javascript
function structuralClone(obj) {
  return new Promise(resolve => {
    const {port1, port2} = new MessageChannel();
    port2.onmessage = ev => resolve(ev.data);
    port1.postMessage(obj);
  });
}

var obj = {a: 1, b: {
    c: b
}}
// 注意该方法是异步的
// 可以处理 undefined 和循环引用对象
const clone = await structuralClone(obj);
```

## 闭包
闭包的定义很简单：函数 `A` 返回了一个函数 `B`，并且函数 `B` 中使用了函数 `A` 的变量，函数 `B` 就被称为闭包。
```javascript
function A() {
  let a = 1
  function B() {
      console.log(a)
  }
  return B
}
```
你是否会疑惑，为什么函数 `A` 已经弹出调用栈了，为什么函数 `B` 还能引用到函数 `A` 中的变量。因为函数 `A` 中的变量这时候是存储在堆上的。现在的 JS 引擎可以通过逃逸分析辨别出哪些变量需要存储在堆上，哪些需要存储在栈上。

经典面试题，循环中使用闭包解决 `var` 定义函数的问题
```javascript
for (var i = 1; i <= 5; i++) {
	setTimeout(function timer() {
		console.log(i)
	}, i * 1000)
}
```
首先因为 `setTimeout` 是个异步函数，所有会先把循环全部执行完毕，这时候 `i` 就是 6 了，所以会输出一堆 6。

解决办法两种，第一种使用闭包
```javascript
for (var i = 1; i <= 5; i++) {
  (function(j) {
    setTimeout(function timer() {
      console.log(j)
    }, j * 1000);
  })(i)
}
```
第二种就是使用 `setTimeout` 的第三个参数
```javascript
for (var i = 1; i <= 5; i++) {
	setTimeout( function timer(j) {
		console.log(j)
	}, i * 1000, i);
}
```
第三种就是使用 `let` 定义 `i` 了
```javascript
for (let i = 1; i <= 5; i++) {
	setTimeout(function timer() {
		console.log(i)
	}, i * 1000)
}
```
因为对于 `let` 来说，他会创建一个块级作用域，相当于
```javascript
{ // 形成块级作用域
  let i = 0
  {
    let ii = i
    setTimeout(function timer() {
        console.log(i)
    }, i * 1000)
  }
  i++
  {
    let ii = i
  }
  i++
  {
    let ii = i
  }
  ...
}
```

## Promise用法(链式调用)
### 错误用法
```javascript
let p2 = new Promise((resolve, reject) => {
    CommonService.getNickAndMachineNo().then(res => {
        let machineNo = res.machineNo;
        let username = res.sellerNick;
        WebApi.ownLogisticsCompaniesInfo({flag: 1, machineNo: machineNo, username: username}).then(info => {
            resolve(info);
        }, error => {
            reject(error);
        })
    }).catch(error => {
        console.log('error', error);
    });
});
```
> *`promise.then` 实际上有两个参数，第一个参数为成功时调用的方法，第二个参数为失败时调用的方法*
>
> *`catch` 实际上是第二个参数的语法糖*
>
> 推荐使用 `catch`
```javascript
// 回调地域
promise1()
  .then(res1 => {
    promise2()
      .then(res2 => {
        promise3()
          .then(res3 => {
            // ...
          })
      })
  })
```
### 链式调用
```javascript
promise1()
  .then(res => promise2())
  .then(res => promise3())
  .then(res => promise4())
  .catch(err => err)
  // ...
```

## async await（像写同步一样写异步）
```javascript
function delay(time) {
  return new Promise((resolve,reject) => {
    setTimeout(() => {
      if (Math.random() > 0.8) {
        resolve(time)
      } else {
        reject('error..')
      }
    }, time)
  })
}

async function fn() {
  console.log('start')
  let time = await delay(1000)
  console.log(`${time}ms passed`)
  let time2 = await delay(3000)
  console.log(`${time2}ms passed`)
}
fn().catch(err => console.log(err))
```
*await必须在async函数内使用*

一个函数如果加上 `async` ，那么该函数就会返回一个 `Promise`
```javascript
async function test() {
  return "1";
}
console.log(test()); // -> Promise {<resolved>: "1"}
```

## 修饰器
### 千牛项目中配置
`webpack.config.js` 加入如下配置
```javascript
module: {
    loaders: [
      {
        test: /\.(jsx|js)?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          cacheDirectory: true,
          presets: ['react', 'es2015', 'stage-0'],
          plugins: ['transform-decorators-legacy'] // 加入babel插件
        }
      },
      {
        test: /\.scss/,
        include: [
          path.resolve(__dirname,"src"),
          qnuiReg
        ],
        loader: ExtractTextPlugin.extract('style', 'raw!postcss!sass-loader')
      }
    ]
  },
```
### 普通react项目中配置
安装 `babel` 插件
```
npm install babel-core babel-plugin-transform-decorators
```
设置配置文件.babelrc。
```json
{
  "plugins": ["transform-decorators"]
}
```
不用修饰器的connect写法
```javascript
class SmsIndex extends React.Component {
    render() {
        return (
            <div></div>
        )
    }
}

export default connect((state) => {
    return {
        smsIndex: state.sms.smsIndex
    };
})(SmsIndex);
```
用修饰器写法
```javascript
@connect(state => state)
class SmsIndex extends React.Component {
    render() {
        return (
            <div></div>
        )
    }
}

export default SmsIndex;
```
[修饰器用法](http://es6.ruanyifeng.com/#docs/decorator)
