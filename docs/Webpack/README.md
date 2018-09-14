# Webpack

[深入浅出 Webpack](http://webpack.wuhaolin.cn/)

## Webpack基础
- [webpack 官网](http://webpack.github.io/)
- [webpack 2.x](https://webpack.js.org/)
- [webpack 中文网](https://doc.webpack-china.org/)
- bundle `[ˈbʌndl]` 捆绑，收集，归拢，把…塞入

### webpack起源
- [webpack 1.0](http://webpack.github.io/docs/what-is-webpack.html)
研发一个新的模块打包工具，最迫切的原因是：Code Spliting 和 静态资源也应该通过模块化无缝的贴合在一起。

- webpack解决了现存模块化工具的两个痛点：
  + 1 Code Spliting
  + 2 静态资源的模块化处理方案

### webpack 的目标
- 1 分离依赖树到chunks，按需加载
- 2 保证初始化加载时间更短
- 3 每一个静态资源能够被当作一个模块
- 4 能够整合第三方包，使其成为模块
- 5 能够定制模块打包的每一部分（环节）
- 6 适合大型项目

### 概述
> webpack 是一个现代 JavaScript 应用程序的模块打包器(module bundler)。当 webpack 处理应用程序时，它会递归地构建一个依赖关系图(dependency graph)，其中包含应用程序需要的每个模块，然后将所有这些模块打包成少量的 bundle - 通常只有一个，由浏览器加载。

- 四个核心概念：**入口(entry)**、**输出(output)**、**加载器loader**、**插件(plugins)**
- 在webpack中，所有的资源都被看作是模块（**静态资源就是模块**）
- [模块系统的演进](http://zhaoda.net/webpack-handbook/module-system.html)
- [入门Webpack，看这篇就够了](http://www.jianshu.com/p/42e11515c10f#)


### webpack中的模块
webpack 模块能够识别以下等形式的模块之间的依赖：

- ES2015 `import` 
- CommonJS `require()` 
- AMD `define` 和 `require` 
- css/sass/less 文件中的 `@import` 
- 样式(`url(...)`)或 HTML 文件(`<img src=...>`)中的图片链接(image url)


### 网站中常见静态资源有哪些（知道）
- 图片：jpg,png,gif,bmp,webp
- 字体：woff,woff2,eot,svg,ttf
- JS文件：js, typescript，coffejavascript
- CSS文件：css, less, sass
- 模板文件：vue, jade

### 大量静态资源文件引发的问题
- 1 发起大量的二次请求
- 2 需要维护组件之间的依赖关系

### webpack解决上述的问题
webpack的作用：对整个代码库中的模块进行静态分析、编译打包，合并文件，压缩文件，处理文件的依赖关系

- 1 模块化
- 2 将`ES6`、`TypeScript`、`CoffeeScript`等浏览器无法识别的语言转化为`ES5`
- 3 将`SCSS`、`LESS`等预编译器创建的CSS转化为浏览器识别的CSS
- 4 进行文件压缩、合并、拷贝
- 5 启动服务器，实现页面实时刷新，热加载
- 6 项目上线，通过配置生成项目目录，优化代码提升性能

### 安装webpack
- 全局安装：`npm i -g webpack`
  + 目的：在任何目录中使用 `webpack` 这个命令
- 项目安装：`npm i -D webpack`（推荐！！！）
  + 目的：执行当前项目的构建

#### 安装说明
- 注意：**可以不用全局安装webpack，官方也不推荐使用全局安装方式**
- 注意：**因为没有全局安装，所以，无法直接在CLI中使用webpack命令**
  + 使用方式：通过 npm scripts 来使用，参考下面 `使用说明（非全局安装）`
- [webpack - 全局安装说明（不推荐）](https://doc.webpack-china.org/guides/installation)

#### 使用说明（非全局安装）
- 说明：利用npm的`scripts`，能够在本地 `node_modules` 目录中查找安装的webpack等包

```json
// package.json 配置：

"scripts": "webpack"
```

### webpack的基本使用
- 安装：`npm i -D webpack`
- webpack的两种使用方式：1 命令行 2 配置文件（`webpack.config.js`）

#### 命令行方式演示 - 案例：隔行变色
- 1 使用`npm init -y` 初始package.json，使用npm来管理项目中的包
- 2 新建`index.html`和`index.js`，实现隔行变色功能
- 3 运行`webpack src/js/index.js dist/bundle.js`进行打包构建，语法是：`webpack 入口文件 输出文件`
- 4 注意：需要在页面中引入 输出文件 的路径（此步骤可通过配置webpack去掉）

```js
/*
  src/js/index.js
*/

// 1 导入 jQuery
import $ from 'jquery'
// 2 获取页面中的li元素
const $lis = $('#ulList').find('li')
// 3 隔行变色
$lis.filter(':odd').css('background-color', '#def')
$lis.filter(':even').css('background-color', 'skyblue')
```

#### 配置文件方式（推荐）

```js
/* 
  webpack.config.js

  运行命令：webpack  

  entry 入口的配置说明：
  https://doc.webpack-china.org/concepts/entry-points
*/

var path = require('path')
module.exports = {
  // 入口文件
  entry: path.join(__dirname, 'src/js/index.js'), 

  // 输出文件
  output: {
    path: path.join(__dirname, 'dist'), // 输出文件的路径
    filename: 'bundle.js' // 输出文件的名称
  }
}
```

### webpack-dev-server
- 安装：`npm i -D webpack-dev-server`
- 作用：配合webpack，创建开发环境（服务器、自动编译、监视文件变化等），提高开发效率
- 注意：无法直接在终端中执行 `webpack-dev-server`，需要通过 `package.json` 的 `scripts` 实现
- 使用方式：`npm run dev`

```json
"scripts": {
  "dev": "webpack-dev-server"
}
```

#### 优势
- 1 开启服务器
- 2 监视文件的变化，重新编译打包，自动刷新浏览器
- 3 将输出的文件存储在内存中，提高编译和加载速度，效率更高

- 注意：webpack输出的文件被放到项目根目录中
  + `webpack output is served from /`
  + 在`index.html`页面中需要通过 `/bundle.js` 来引入文件

#### 配置说明 - CLI配置
- `--contentBase` ：主页面目录
  + `--contentBase ./`：当前工作目录
- `--open` ：自动打开浏览器
- `--port` ：端口号
- `--hot` ：热更新，只加载修改的文件(按需加载修改的内容)，而非全部加载

```js
/* package.json */
/* 运行命令：npm run dev */

{
  "scripts": {
    "dev": "webpack-dev-server --contentBase ./src --open --port 8888 --hot"
  }
}
```

#### 配置说明 - webpack.config.js
- [/undefined bug](https://stackoverflow.com/questions/44924263/webpack-dev-server-opens-localhost8080-undefined)

```js
const webpack = require('webpack')

devServer: {
  // 服务器的根目录 Tell the server where to serve content from
  // https://webpack.js.org/configuration/dev-server/#devserver-contentbase
  contentBase: path.join(__dirname, './'),
  // 自动打开浏览器
  open: true,
  // 端口号
  port: 8888,
  // 1 热更新
  hot: true,
  // 解决打开页面出现 /undefined bug
  //openPage: ''
},

plugins: [
  // 2 启用热更新插件
  new webpack.HotModuleReplacementPlugin()
]
```

### html-webpack-plugin 插件
- 安装：`npm i -D html-webpack-plugin`
- 作用：根据模板，自动生成html页面
- 优势：页面存储在内存中，自动引入`bundle.js`、`css`等文件
  + 不用我们在页面中手动引入js或css等文件了，这个插件会自动帮我们引入

```js
/* webpack.config.js */
var htmlWebpackPlugin = require('html-webpack-plugin')

// ...
plugins: [
  new htmlWebpackPlugin({
    // 模板页面路径
    template: path.join(__dirname, './index.html'),
    // 在内存中生成页面路径
    filename: 'index.html'
  })
]
```

### Loaders（加载器）
- [webpack - Loaders](https://webpack.js.org/loaders/)
- [webpack - 管理资源示例](https://doc.webpack-china.org/guides/asset-management)

> webpack enables use of loaders to preprocess files. This allows you to bundle any static resource way beyond JavaScript. 

- webpack通过loaders处理非JavaScript静态资源

### 打包构建CSS文件
- 1 打包CSS文件（加载）
- 2 打包SASS文件（编译为CSS）

#### 使用Webpack打包CSS文件
- 安装：`npm i -D style-loader css-loader`
- 注意：use中模块的顺序不能颠倒，加载顺序：从右向左加载

```js
/* index.js */

// 导入 css 文件
import './css/app.css'


/* webpack.config.js */

// 配置各种资源文件的loader加载器
module:{
  // 配置匹配规则
  rules:[
    // test 用来配置匹配文件规则（正则）
    // use  是一个数组，按照从后往前的顺序执行加载
    {test: /\.css$/, use: ['style-loader', 'css-loader']}, 
  ]
}
```

#### 使用webpack打包sass文件
- 安装：`npm i -D sass-loader node-sass`
- 注意：`sass-loader` 依赖于 `node-sass` 模块

```js
/* webpack.config.js */

// 参考：https://webpack.js.org/loaders/sass-loader/#examples
// "style-loader"  ：creates style nodes from JS strings 创建style标签
// "css-loader"    ：translates CSS into CommonJS 将css转化为CommonJS代码
// "sass-loader"   ：compiles Sass to CSS 将Sass编译为css

module:{
  rules:[
    {test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader']},
  ]
}
```


### 打包图片文件
- 安装：`npm i -D url-loader file-loader`
- `file-loader`：加载文件（重命名）
- `url-loader`：将图片转化为base64编码的URL形式，加载图片

```js
/* webpack.config.js */

module:{
  rules:[
    // 打包 图片文件
    { test: /\.(jpg|png|gif|jpeg)$/, use: 'url-loader' },
    // 打包 字体文件
    { test: /\.(woff|woff2|eot|ttf|otf)$/, use: 'file-loader' }
  ]
}
```

#### 注意点
- 1 默认将图片转为base64编码格式
- 2 `limit`参数的作用：
  + 限制图片的文件大小，单位为：字节(byte)
  + 文件重命名为哈希值，保证文件不会重复。例如：一张图片拷贝一个副本，这两个图片实际是同一个
- 3 规则：
  + 当图片文件大小`小于`指定的limit时，图片被转化为base64编码格式
  + 当图片文件大小`大于等于`指定的limit时，图片被重命名，不使用base64编码

```js
/* webpack.config.js */

module: {
  rules: [
    // {test: /\.(jpg|png|gif|jpeg)$/, use: 'url-loader?limit=100'},
    {
      test: /\.(jpg|png|gif|jpeg)$/,
      use: [
        {
          loader: 'url-loader',
          options: {
            limit: 8192
          }
        }
      ]
    }
  ]
}
```

### ES6语法 - class关键字
- [ES6 - 文档](http://es6.ruanyifeng.com/#docs/class)

```js
class Person() {
  // 静态属性
  static testName = '静态属性'
  static age = 20

  // 实例属性
  isLoading = true
}

console.log(Person.testName)
```

#### 静态属性和实例属性
- 静态属性：直接通过类名就可以访问到，不需要创建类的实例就能访问
- 实例属性：必须先创建类的实例对象，然后，通过实例对象访问
- 说明：由于webpack不识别`static`关键字，需要借助于`babel-loader`来处理ES6语法

### 在webpack中配置babel-loader
- [babel全家桶](https://github.com/brunoyang/blog/issues/20)
- 安装：`npm i -D babel-core babel-loader babel-plugin-transform-runtime`
- 安装：`npm i -D babel-preset-es2015 babel-preset-stage-0`

- es2015 也就是 es6, 下一个要发布的ES7, 从 ES6 到 ES7之间经历了 5 个阶段
- 一般进入到 stage 4 就可以认为是下一个版本的语法了!

```
Stage 0 - Strawman（展示阶段）
Stage 1 - Proposal（征求意见阶段）
Stage 2 - Draft（草案阶段）
Stage 3 - Candidate（候选人阶段）
Stage 4 - Finished（定案阶段）

Stage 0 is "i've got a crazy idea", 
stage 1 is "this idea might not be stupid", 
stage 2 is "let's use polyfills and transpilers to play with it", 
stage 3 is "let's let browsers implement it and see how it goes", 
stage 4 is "now it's javascript".
```


#### 基本使用（两步）
- 第一步：

```js
/* webpack.config.js */

module: {
  rules: [
    // exclude 排除，不需要编译的目录
    {test: /\.js$/, use: 'babel-loader', exclude: /node_modules/}
  ]
}
```

- 第二步：在项目根目录中新建`.babelrc`配置文件

```json
/* .babelrc */

// 将来babel-loader运行的时候，会检查这个配置文件，并读取相关的语法和插件配置
{
  "presets": ["es2015", "stage-0"],
  "plugins": ["transform-runtime"]
}
```

### babel的说明

#### babel-core

```
把 js 代码分析成 ast (抽象语法树, 是源代码的抽象语法结构的树状表现形式)，方便各个插件分析语法进行相应的处理。有些新语法在低版本 js 中是不存在的，如箭头函数，rest 参数，函数默认值等，这种语言层面的不兼容只能通过将代码转为 ast，分析其语法后再转为低版本 js。

Bable AST： http://www.zcfy.cc/article/347
代码转AST：  https://astexplorer.net/
```

#### babel-preset-*
> Babel通过语法转换器，能够支持最新版本的JavaScript语法  

- 作用：将浏览器无法识别的新语法转化为ES5代码
- [ES6语法提案的批准流程](http://es6.ruanyifeng.com/#docs/intro#语法提案的批准流程)


#### babel-polyfill 和 transform-runtime
- 说明：如果想要支持全局对象（比如：`Promise`）或者新的API（比如：`String.padStart (left-pad)`），那么就需要使用`babel-polyfill`
- 命令：`npm i -S babel-polyfill`
- [polyfill](https://babeljs.io/docs/usage/polyfill/#usage-in-node-browserify-webpack)
- [transfrom-runtime](https://babeljs.io/docs/plugins/transform-runtime/)

```js
// 第一行引入
require("babel-polyfill");

var s = 'abc'.padStart(4);
console.log(s);

// webpack.config.js 配置
module.exports = {
  entry: ["babel-polyfill", "./app/js"]
};
```

#### 总结:
```
babel-core 将新的JS语法解析为 抽象语法树

babel-preset-es2015 能够将 抽象语法树 转化为浏览器能够识别的语法
  注意: 只能处理新的语法( static / 箭头函数 ) , 但是对于一些新的JS API 无法处理

transform-runtime / babel-polyfill 提供浏览器不识别的全局对象或者新的API的兼容实现，以达到兼容浏览器的目的

// 判断浏览器是否兼容 padStart 这个 API
if (!String.prototype.padStart) {
  // 如果不兼容, 就自己模拟 padStart的功能实现一份
  String.prototype.padStart = function padStart(targetLength,padString) {
  }
}
```

---

### Webpack发布策略
- [webpack 打包的各种坑](https://dailc.github.io/2017/03/13/webpackfreshmanualAndBug.html)

#### 开发期间
- 开发期间的配置：实时刷新浏览器，实时编译，热更新，内存存储`index.html，bundle.js`
- 开发期间的：测试文件、测试数据、测试相关的工具（好处：方便快速开发调试）
- 注意：这些配置、数据、工具，在项目上线以后就不再需要了，仅仅时为了辅助开发的

#### 项目发布
- 项目上线：剔除开发期间用到的临时文件，减少部署文件的体积，提高app的用户体验

#### 创建项目发布配置文件
- 开发期间配置文件：`webpack.config.js`
- 项目发布配置文件：`webpack.prod.js` （文件名称非固定）
- 命令：`webpack --config webpack.prod.js` 指定配置文件名称运行webpack
- 参数：` --display-error-details` 用于显示webpack打包的错误信息

```json
/* package.json */

"scripts": {
  "prod": "webpack --config webpack.prod.js"
}
```

#### 项目上线处理方式
- 1 删除：`devServer` 配置
- 2 处理文件路径（包括：图片、css、js）
- 3 修改`url-loader`
- 4 自动删除`dist`目录
- 5 分离第三方包

#### 处理图片路径
- 注意：如果`limit`小于比图片大，那么图片将被转化为`base64`编码格式

```js
// 处理URL路径的loader
// https://github.com/webpack-contrib/file-loader

{
  test: /\.(jpg|png|gif|bmp|jpeg)$/, 
  // name参数：重命名文件以及修改文件路径
  use: 'url-loader?limit=100&name=images/imgs-[hash:7].[ext]' 
},
```

#### 自动删除dist目录
- 安装：`npm i -D clean-webpack-plugin`

```js
/* webpack.prod.js */
var cleanWebpackPlugin = require('clean-webpack-plugin');

plugins: [
  // 创建一个删除文件夹的插件，删除dist目录
  new cleanWebpackPlugin(['dist'])
]
```

#### 分离第三方包
- 目的：将公共的第三方包，抽离为一个单独的包文件，这样防止重复打包！
  + 例如：3个页面中都引入了jQuery，不分离的话，会被打包3次

```js
/* webpack.prod.js */

// 入口 -- 打包文件的入口
entry: {
  // 自己的代码入口
  app: path.join(__dirname, 'src/index.js'),
  // 第三方包入口
  vendor: ['jquery', 'underscore']
},

plugins: [
  // 分离第三方包（公共包文件）
  new webpack.optimize.CommonsChunkPlugin({
    // 第三方包入口名称，对应 entry 中的 vendor 属性
    // 将 entry 中指定的 ['jquery', 'underscore'] 打包到名为 vendor 的js文件中
    name: 'vendor',
    // 第三方包生成文件的名称（路径），可省略
    // filename: 'vendor.js'
  }),
]
```

#### 压缩混淆JS
```js
plugins: [
  // 优化代码
  new webpack.optimize.UglifyJsPlugin({
    // 压缩
    compress: {
      // 移除警告
      warnings: false
    }
  }),

  // 指定环境，设置为生产环境
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('production')
    }
  })
]
```

#### 抽取和压缩CSS文件
- 安装：抽离 `npm i -D extract-text-webpack-plugin`
- 安装：压缩 `npm i -D optimize-css-assets-webpack-plugin`
- [webpack 抽离CSS文档](https://doc.webpack-china.org/plugins/extract-text-webpack-plugin/)
- [压缩抽离后的CSS](https://www.npmjs.com/package/optimize-css-assets-webpack-plugin)

```js
// 分离 css 到独立的文件中
var ExtractTextPlugin = require("extract-text-webpack-plugin");
// 压缩 css 资源文件
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

// bug描述: 生成后面的css文件中图片路径错误，打开页面找不到图片
// 解决：google搜索 webpack css loader 样式图片路径
output: {
  // ...

  // https://doc.webpack-china.org/configuration/output/#output-publicpath
  // 设置公共路径
  publicPath: '/',
},


module: {
  rules: [
    // test 用来配置匹配文件的规则（正则）
    // use  是一个数组，按照从后往前的顺序执行
    {
      test: /\.css$/, 
      use: ExtractTextPlugin.extract({
        fallback: "style-loader",
        use: "css-loader"
      })
    },
    {
      test: /\.scss$/, 
      use: ExtractTextPlugin.extract({
        fallback: "style-loader",
        use: ['css-loader', 'sass-loader']
      })
    },
  ]
},
plugins: [
  // 通过插件抽离 css (参数)
  new ExtractTextPlugin("css/styles.css"),
  // new ExtractTextPlugin("css/[name].css"),
  // 抽离css 的辅助压缩插件
  new OptimizeCssAssetsPlugin()
]
```

#### 压缩HTML页面
- 详细的配置可以参考[html-minifier](https://github.com/kangax/html-minifier#options-quick-reference)

```js
new htmlWebpackPlugin({
  // 模板页面
  template: path.join(__dirname, './index.html'),
  // 在内容中生成页面名称
  filename: 'index.html',

  // 压缩HTML
  minify: {
    // 移除空白
    collapseWhitespace: true,
    // 移除注释
    removeComments: true,
    // 移除属性中的双引号
    removeAttributeQuotes: true
  }
}),
```

------

### source map
- [参考文档](https://doc.webpack-china.org/configuration/devtool#devtool)
- 作用：有利于代码调试，能够准确定位错误发生的位置

```js
// 在 webpack.config.js 中添加以下配置项：
devtool: 'inline-source-map',

// ------------------------------------

// 注意：在生产环境中使用以下配置（体积更小）
devtool: 'cheap-source-map',
```

### Tree-Shaking
- tree shaking 是一个术语，通常用于描述移除 JavaScript 上下文中的未引用代码(dead-code)
- 说明：webpack会自动分析没有引用的代码，使用`uglifyjs-webpack-plugin`可以将未引用代码从bundle中移除
- 注意：**只对ES2015的模块语法有效**
- 安装：`npm i -D uglifyjs-webpack-plugin`

```js
// 导入
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

plugins: [
  // 使用插件
  new UglifyJSPlugin()
]
```

### webpack 3 - Scope Hoisting （性能优化）
- 作用：让 Webpack 打包出来的代码文件更小、运行的更快
- 说明：只支持`ES2015`模块写法，不支持`CommonJS`模块使用
- 命令：`webpack --display-optimization-bailout`
  + 参数：打印出项目无法使用 Scope Hoisting 的原因
- 注意：使用这个插件的时候，模块热替换将不起作用，所以最好只在代码优化的时候才使用这个插件
- [webpack 3 新特性](https://juejin.im/entry/59704d47f265da6c4977ba6a)

```js
/*
  webpack.config.js
  使用方式：在配置文件中添加一个新的插件 webpack.optimize.ModuleConcatenationPlugin
*/

module.exports = {
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin()
  ]
}
```
