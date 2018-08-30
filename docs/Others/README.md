# Others

## ESlint (Standard规范)
全局安装 ESLint 你可以使用 npm：
```
npm install -g eslint
```
紧接着你应该设置一个配置文件：
```
eslint --init
```
注意 使用如下配置（使用 Standard 规范）
```
How would you like to configure ESLint? Use a popular style guide
Which style guide do you want to follow? Standard
Do you use React? Yes
What format do you want your config file to be in? JSON
```
安装react插件
```
npm install eslint-plugin-react eslint-plugin-jsx-a11y --dev
```
.eslintrc.json 文件修改如下配置
```json
{
  "extends": "standard",
  "plugins": ["react"],
  "rules": {
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error"
  }
}
```
然后全局安装standard
```
npm install -g standard
```
之后就可以在需要自动规范代码的目录执行
```
standard --fix
```
[Standard 中文文档](http://hongfanqie.github.io/standardjs/index.html)

[eslint 文档](http://eslint.cn/docs/user-guide/getting-started)

## localStorage控制
*思想： 每个组件只使用一个hash储存当前组件的所有 "缓存" 状态,推荐使用组件名作为 key*

例如：打印快递单组件
```javascript
const localStorge = {
  allTemplates: [
    {
      template: '圆通',
      print: 'pdf'
    },
    {
      template: '宅急送',
      print: 'pdf'
    },
    {
      template: '中通',
      print: 'pdf'
    }
  ],
  currentStatus: {
    template: '圆通模板',
    print: 'pdf',
    expressCode: 666, // 运单号
    logisticsCompany: '圆通' // 物流公司
  }
}
```

为localStorage的存取单独造了一个小轮子 locals

> 引入
```javascript
import Locals from 'utils/locals'
// 新建实例，推荐作为单个组件文件的全局变量使用
const locals = new Locals()
```
> 储存 set
```javascript
const str = 'string'
// set 两个参数分别是 key value
locals.set('key1', str)
```
> 读取 get
```javascript
const str1 = 'string1'
const str2 = 'string2'
locals.set('key1', str1)
locals.set('key2', str2)
// 可传入多个key
locals.get('key1', 'key2') // string1 string2
// get 可再set后链式调用,链式调用时可不传参数
locals.set('key1', str1).get() // string1
```
> 读取全部 getAll
```javascript
locals.getAll()
```
> 删除 remove
```javascript
locals.remove('key1', 'key2')
```