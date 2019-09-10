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

## Event loop
