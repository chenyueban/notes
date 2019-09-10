# 浏览器

## 跨域

出于安全考虑，有[浏览器的同源策略](https://developer.mozilla.org/zh-CN/docs/Web/Security/Same-origin_policy)，简单讲是浏览器为了防止以下情况的发生：

你登录了某网站A，服务端判定登录成功后在响应头加入了 `Set-Cookie` 字段，下次发送请求时浏览器会自动将 **cookie** 附加到请求的头字段 `Cookie` 中，如果这时候你访问了网站B且网站B向A发送请求，由于没有同源策略的限制，网站B就相当于登录了你网站A的账号。

### JSONP
利用 `script` 标签没有跨域限制，通过它指向请求的地址并且提供回调函数接收数据：
```js
<script src="http://domain/api?param1=a&param2=b&callback=jsonp"></script>
<script>
  function jsonp(data) {
    console.log(data)
  }
</script>
```
JSONP 优点是是兼容性好，缺点是只能发送 `GET` 请求

### CORS
服务端设置 `Access-Control-Allow-Origin`
   
### 代理
发送请求还是使用前端地址，然后通过代理把请求转发至需要的后端地址上。通常使用 Nginx 转发
   
### document.domain
该方式只能用于二级域名相同的情况下，比如 *a.test.com* 和 *b.test.com* 适用于该方式。
只需要给页面添加 `document.domain = 'test.com'` 表示二级域名都相同就可以实现跨域

### postMessage
这种方式通常用于获取嵌入页面中的第三方页面数据。一个页面发送消息，另一个页面判断来源并接收消息
```js
// 发送消息端
window.parent.postMessage('message', 'http://test.com')
// 接收消息端
var mc = new MessageChannel()
mc.addEventListener('message', event => {
  var origin = event.origin || event.originalEvent.origin
  if (origin === 'http://test.com') {
    console.log('验证通过')
  }
})
```

## JavaScript 运行机制

### 进程与线程

在浏览器中，打开一个 Tab 页就创建了一个新的进程，每个进程内可以存在多个线程（同一时间只能做一件事）：渲染线程、JS 引擎线程、HTTP 请求线程等。发起一个 HTTP 请求实际上会创建一个线程，请求结束后这个线程可能被销毁。

JS 运行可能阻止渲染，因为这两个线程**互斥**，互斥的原因是 JS 可能会操作 DOM，这可能会使得渲染出现问题。

> 为了利用多核CPU的计算能力，HTML5提出Web Worker标准，允许JavaScript脚本创建多个线程，但是子线程完全受主线程控制，且不得操作DOM。

### 任务队列(task queue)

单线程意味着所有任务都要排队执行，但是遇到 `AJAX` `setTimeout` 等异步操作时我们肯定不能等待它执行完再执行其他任务。

于是任务分成了 同步任务 和 异步任务。
> 同步任务指的是，在主线程上排队执行的任务，只有前一个任务执行完毕，才能执行后一个任务；
>
> 异步任务指的是，不进入主线程、而进入"任务队列"（task queue）的任务，只有"任务队列"通知主线程，某个异步任务可以执行了，该任务才会进入主线程执行。

所以 JS 运行的机制变成了：

1. 同步任务在主线程上执行，形成执行栈。
2. 执行栈之外存在一个任务队列，异步任务有了结果以后会在任务队列中放置一个事件。
3. 执行栈同步任务执行完毕后会读取任务队列，根据事件对应异步任务，异步任务结束等待进入主线程执行。
4. 主线程不断重复上面步骤。

换个角度讲，一些事件（鼠标点击、页面滚动等）发生时，都会进入任务队列，可以认为这些事件就是异步任务。

## Event loop (事件循环)
JS引擎是单线程的，在某一个特定的时间内只能执行一个任务，并阻塞其他任务的执行。这样的话，用户不得不等待一个耗时的操作完成之后才能进行后面的操作，但是实际开发中我们却可以使用异步代码来解决问题，那么异步代码是如何在单线程内运行的呢？

当异步方法如 `setTimeout` 或 `ajax` 执行时，会交给浏览器内核的其他模块去管理。当其他模块执行完毕时将方法推入到一个任务队列(task queue)，当主线程代码执行完毕处于空闲时会检查任务队列，将任务队列中第一个任务入栈执行，执行完毕后继续检查任务队列，如此循环。

看以下代码

```js
console.log('script start')

setTimeout(function() {
  console.log('setTimeout')
}, 0)

console.log('script end')
```

虽然 `setTimeout` 延时为 0，但由以上内容我们可知 `setTimeout` 还是会在 `script end` 之后打印。

### 微任务(microtask) 和 宏任务(macrotask)
在 ES6 规范中，**microtask** 称为 **jobs**，**macrotask** 称为 **task**。
微任务(microtask):
- process.nextTick
- promise
- Object.observe
- MutationObserver

宏任务(macrotask):
- script
- setTimeout
- setInterval
- setImmediate
- I/O
- UI rendering

- **宏任务**是每次**执行栈**执行的代码（包括每次从事件队列中获取一个事件回调并放到执行栈中执行）
- 浏览器为了能够使得**JS引擎线程**与**GUI渲染线程**有序切换，会在当前**宏任务**结束之后，下一个**宏任务**执行开始之前，对页面进行重新渲染（宏任务 > 渲染  > 宏任务 > ...）
- **微任务**是在当前**宏任务**执行结束之后立即执行的任务（在当前**宏任务**执行之后，UI渲染之前执行的任务）。**微任务**的响应速度相比`setTimeout`（下一个**宏任务**）会更快，因为无需等待UI渲染。
- 当前**宏任务**执行后，会将在它执行期间产生的所有**微任务**都执行一遍。

### Event loop 顺序
1. 执行一个宏任务（script）
2. 执行过程中如果遇到微任务，就将它添加到微任务的任务队列中
3. 宏任务执行完毕后，立即执行当前微任务队列中的所有任务（依次执行）
4. JS引擎线程挂起，GUI线程执行渲染
5. GUI线程渲染完毕后挂起，JS引擎线程执行任务队列中的下一个宏任务

> 简单点记，微任务是早于除去 `script` 的宏任务执行的。
> 
> script => 微任务 => 其余宏任务