# Webpack4

[深入浅出 Webpack](http://webpack.wuhaolin.cn/)

## Webpack 基础
- [webpack 官网](https://webpack.js.org)
- [webpack 中文网](https://www.webpackjs.com)

### Plugin

#### html-webpack-plugin
为了让 webpack 替我们自动生成 HTML, 并自动引入文件
```js
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: 'index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'index_bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin()
  ]
}
```
[Document](https://github.com/jantimon/html-webpack-plugin)

#### clean-webpack-plugin
清理遗留代码
```js
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: 'index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'index_bundle.js'
  },
  plugins: [
    new CleanWebpackPlugin(['dist'])
  ]
}
```

#### webpack-manifest-plugin
将编译前后的模块映射数据提取到 json 文件中.
```js
const ManifestPlugin = require('webpack-manifest-plugin');

module.exports = {
    // ...
    plugins: [
      new ManifestPlugin()
    ]
};
```
[Document](https://github.com/danethurber/webpack-manifest-plugin)

#### webpack-bundle-analyzer
让你清晰地看出打包后文件的情况
```js
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin()
  ]
}
```
[Document](https://github.com/webpack-contrib/webpack-bundle-analyzer)

#### HashedModuleIdsPlugin
首先确认 `output` - `filename` 对应的 hash 为 `contenthash` 或 `chunkhash`, 若为 `hash` 不适用此插件.

在生产环境下, 当我们修改了某一处源码 build 时, 我们希望只有修改源码所在文件对应的 bundle 的 hash 发生变化, 然而事实上 build 时, 所有文件的 hash 都会变化.
> 这是因为每个 module.id 会基于默认的解析顺序(resolve order)进行增量。也就是说，当解析顺序发生变化，ID 也会随之改变。
- main bundle 会随着自身的新增内容的修改，而发生变化。
- vendor bundle 会随着自身的 module.id 的修改，而发生变化。
- manifest bundle 会因为当前包含一个新模块的引用，而发生变化。


### Resolve

#### alias
`resolve.alias` 配置项通过别名来把原导入路径映射成一个新的导入路径。
```js
resolve: {
  alias: {
    components: './src/components/',
  }
}
```
当你通过 `import Button from 'components/button'` 导入时，实际上被 `alias` 等价替换成了 `import Button from './src/components/button'`。

以上 `alias` 配置的含义是把导入语句里的 `components` 关键字替换成 `./src/components/`。

这样做可能会命中太多的导入语句，`alias` 还支持 $ 符号来缩小范围到只命中以关键字结尾的导入语句：
```js
resolve: {
  alias: {
    'react$': '/path/to/react.min.js'
  }
}
```
`react$` 只会命中以 `react` 结尾的导入语句，即只会把 `import 'react'` 关键字替换成 `import '/path/to/react.min.js'`。

#### mainFields
有一些第三方模块会针对不同环境提供几分代码。 例如分别提供采用 ES5 和 ES6 的2份代码，这2份代码的位置写在 `package.json` 文件里，如下：
```json
{
  "jsnext:main": "es/index.js",// 采用 ES6 语法的代码入口文件
  "main": "lib/index.js" // 采用 ES5 语法的代码入口文件
}
```
Webpack 会根据 `mainFields` 的配置去决定优先采用那份代码，`mainFields` 默认如下：
```js
mainFields: ['browser', 'main']
```
Webpack 会按照数组里的顺序去 `package.json` 文件里寻找，只会使用找到的第一个。

假如你想优先采用 ES6 的那份代码，可以这样配置：
```js
mainFields: ['jsnext:main', 'browser', 'main']
```

#### extensions
在导入语句没带文件后缀时，Webpack 会自动带上后缀后去尝试访问文件是否存在。 `resolve.extensions` 用于配置在尝试过程中用到的后缀列表，默认是：
```js
extensions: ['.js', '.json']
```
也就是说当遇到 `require('./data')` 这样的导入语句时，Webpack 会先去寻找 `./data.js` 文件，如果该文件不存在就去寻找 `./data.json` 文件， 如果还是找不到就报错。

假如你想让 Webpack 优先使用目录下的 TypeScript 文件，可以这样配置：
```js
extensions: ['.ts', '.js', '.json']
```

#### modules
`resolve.modules` 配置 Webpack 去哪些目录下寻找第三方模块，默认是只会去 `node_modules` 目录下寻找。 有时你的项目里会有一些模块会大量被其它模块依赖和导入，由于其它模块的位置分布不定，针对不同的文件都要去计算被导入模块文件的相对路径， 这个路径有时候会很长，就像这样 `import '../../../components/button'` 这时你可以利用 `modules` 配置项优化，假如那些被大量导入的模块都在 `./src/components` 目录下，把 `modules` 配置成
```js
modules: ['./src/components', 'node_modules']
```
后，你可以简单通过 `import 'button'` 导入。


### 常用配置

#### webpack-dev-server
```js
module.exports = {
  // ...
  devServer: {
    contentBase: './dist'
  },
};
```
然后在 package.json 内添加一个 script, 目的是方便运行开发服务.
```json
{
    "name": "development",
    "version": "1.0.0",
    "description": "",
    "main": "webpack.config.js",
    "scripts": {
+     "start": "webpack-dev-server --open",
      "build": "webpack"
    }
  }
```
现在运行 `yarn start`, 浏览器会自动加载页面, 并且有任意修改源文件的行为, web 服务就会自动重加载编译后的代码.

#### HMR
单是启用上面的服务已经很方便了, 单是仍然需要每次修改源文件后手动刷新浏览器, 而启用 HMR 后, 连浏览器也不用我们刷新了.
```js
  const path = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  const CleanWebpackPlugin = require('clean-webpack-plugin');
+ const webpack = require('webpack');

  module.exports = {
    entry: {
-      app: './src/index.js',
-      print: './src/print.js'
+      app: './src/index.js'
    },
    devtool: 'inline-source-map',
    devServer: {
      contentBase: './dist',
+     hot: true
    },
    plugins: [
      new CleanWebpackPlugin(['dist']),
      new HtmlWebpackPlugin({
        title: 'Hot Module Replacement'
      }),
+     new webpack.NamedModulesPlugin(),
+     new webpack.HotModuleReplacementPlugin()
    ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    }
  };
```

[Document](https://www.webpackjs.com/configuration/dev-server/)

#### webpack-merge
> 开发环境(development)和生产环境(production)的构建目标差异很大。在开发环境中，我们需要具有强大的、具有实时重新加载(live reloading)或热模块替换(hot module replacement)能力的 source map 和 localhost server。而在生产环境中，我们的目标则转向于关注更小的 bundle，更轻量的 source map，以及更优化的资源，以改善加载时间。由于要遵循逻辑分离，我们通常建议为每个环境编写彼此独立的 webpack 配置。

安装 `webpack-merge`, 并将 webpack.config.js 拆分.
```bash
yarn add webpack-merge --dev
```
```
  webpack-demo
  |- package.json
- |- webpack.config.js
+ |- webpack.common.js
+ |- webpack.dev.js
+ |- webpack.prod.js
  |- /dist
  |- /src
    |- index.js
    |- math.js
  |- /node_modules
```

*webpack.common.js*

```js
+ const path = require('path');
+ const CleanWebpackPlugin = require('clean-webpack-plugin');
+ const HtmlWebpackPlugin = require('html-webpack-plugin');
+
+ module.exports = {
+   entry: {
+     app: './src/index.js'
+   },
+   plugins: [
+     new CleanWebpackPlugin(['dist']),
+     new HtmlWebpackPlugin({
+       title: 'Production'
+     })
+   ],
+   output: {
+     filename: '[name].bundle.js',
+     path: path.resolve(__dirname, 'dist')
+   }
+ };
```

*webpack.dev.js*

```js
+ const merge = require('webpack-merge');
+ const common = require('./webpack.common.js');
+
+ module.exports = merge(common, {
+   devtool: 'inline-source-map',
+   devServer: {
+     contentBase: './dist'
+   }
+ });
```

*webpack.prod.js*

```js
+ const merge = require('webpack-merge');
+ const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
+ const common = require('./webpack.common.js');
+
+ module.exports = merge(common, {
+   plugins: [
+     new UglifyJSPlugin()
+   ]
+ });
```

> 现在，在 webpack.common.js 中，我们设置了 entry 和 output 配置，并且在其中引入这两个环境公用的全部插件。在 webpack.dev.js 中，我们为此环境添加了推荐的 devtool（强大的 source map）和简单的 devServer 配置。最后，在 webpack.prod.js 中，我们引入了 UglifyJSPlugin。

现在，我们把 `scripts` 重新指向到新配置
```json
  {
    "name": "development",
    "version": "1.0.0",
    "description": "",
    "main": "webpack.config.js",
    "scripts": {
-     "start": "webpack-dev-server --open",
+     "start": "webpack-dev-server --open --config webpack.dev.js",
-     "build": "webpack"
+     "build": "webpack --config webpack.prod.js"
    }
  }
```

现在我们应该明白各个 plugin, 配置项 应该运行在 development 或 production 环境内.



## Webpack 进阶

### 使用 PostCSS
> PostCSS 的用处非常多，包括给 CSS 自动加前缀、使用下一代 CSS 语法等
>
> PostCSS 和 CSS 的关系就像 Babel 和 JavaScript 的关系，它们解除了语法上的禁锢，通过插件机制来扩展语言本身，用工程化手段给语言带来了更多的可能性。
>
> PostCSS 和 SCSS 的关系就像 Babel 和 TypeScript 的关系，PostCSS 更加灵活、可扩张性强，而 SCSS 内置了大量功能而不能扩展。
例子:

给 CSS 自动加前缀，增加各浏览器的兼容性：
```css
/*输入*/
h1 {
  display: flex;
}

/*输出*/
h1 {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
}
```

#### 接入 Webpack
安装
```bash
yarn add postcss-loader autoprefixer --dev
```
新建文件 `postcss.config.js`
```js
const autoprefixer = require('autoprefixer');

module.exports = {
  plugins: [
    autoprefixer({
      browsers: [
        'last 2 versions',
        'Firefox ESR',
        '> 1%',
        'ie >= 9',
        'iOS >= 8',
        'Android >= 4',
      ],
    }),
  ],
};
```
最后在 `webpack.config.js`
```js
module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
          'postcss-loader',
        ],
        exclude: path.resolve(__dirname, 'node_modules'),
      },
    ],
  },
```