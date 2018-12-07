# Others

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

## Vuepress + Travis 实现自动部署踩坑

`vuepress` 官方推荐的创建一个 `deploy.sh` 来实现部署，此操作在集成 `travis` 时完全可以省略(别问我为什么知道)

### 生成 Personal access tokens
- 登录 github,点击右上角头像
- Settings / Developer settings / Personal access tokens
- Generate new token (全选)

### Environment Variables 设置 token
- 进入要设置的项目
- More options / Settings
- Environment Variables 内新添 `GITHUB_TOKEN` (value 为上一步 github 生成的 token)

### .travis.yml
- 项目根目录新建 `.travis.yml`
```
language: node_js
sudo: required
node_js:
  - "lts/*"
install:
  - npm install -g vuepress
script:
  - vuepress build docs && cd docs/.vuepress/dist
deploy:
  provider: pages
  skip-cleanup: true
  github-token: $GITHUB_TOKEN
  on:
    branch: master
  local-dir: docs/.vuepress/dist
```

最后 push 代码到 github, travis 就会检测到 push 请求，实现自动部署到 `gh-pages` 分支

##  jest codecov 集成踩坑

codecov 是一个开源的统计单元测试覆盖率的工具, 可通过 `travis` 自动部署时上传覆盖率.

本例结合 jest 集成 codecov

首先安装 codecov
```bash
yarn add --dev codecov
```
然后 `package.json` `scripts` 加入:
```json
"codecov": "codecov"
```
最后在 `package.json` `jest` 或者 `jest.config.js` 内加入配置项:
```
coverageDirectory: './coverage/',
collectCoverage: true,
```
注: codecov 将在根目录下生成目录 coverage, 可通过 `.gitignore` 配置忽略.

本地文件的操作就这些, 之后去到 [codecov.io](https://codecov.io/), 登录后进入目标项目, 复制 `Token`

然后去到 travis 对应项目 `Environment Variables` 内新添 `CODECOV_TOKEN`

ok, 以后 `git push` 就会自动跑 codecov 啦~