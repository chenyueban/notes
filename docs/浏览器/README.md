# 浏览器

## 跨域

出于安全考虑，有[浏览器的同源策略](https://developer.mozilla.org/zh-CN/docs/Web/Security/Same-origin_policy)，简单讲是浏览器为了防止以下情况的发生：

你登录了某网站A，服务端判定登录成功后在响应头加入了 `Set-Cookie` 字段，下次发送请求时浏览器会自动将 **cookie** 附加到请求的头字段 `Cookie` 中，如果这时候你访问了网站B且网站B向A发送请求，由于没有同源策略的限制，网站B就相当于登录了你网站A的账号。

### JSONP
利用 `script` 标签没有跨域限制，通过它指向请求的地址并且提供回调函数接收数据：
```js
<script src="http://domain/api?param1=a&param2=b&callback=jsonp"></script>
<script>
  function jsonp(data) {REA
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

### Event loop 顺序
1. 执行同步代码，这属于宏任务
2. 执行栈为空，查询是否有微任务需要执行
3. 执行所有微任务
4. 必要的话渲染 UI
5. 然后开始下一轮 Event loop，执行宏任务中的异步代码

> 简单点记，微任务是早于除去 `script` 的宏任务执行的。
> 
> script => 微任务 => 其余宏任务