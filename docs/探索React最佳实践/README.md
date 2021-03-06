# 探索React最佳实践

**首先强烈推荐书籍《React设计模式与最佳实践》，本文基于此书内容并进行部分拓展。**

## ESlint

> 我们总是希望尽可能写出最佳代码，但有时总会出错，然后需要花数小时定位 bug，最后发现只是拼写错误，这很令人沮丧。好在一些工具可以帮助我们在输入过程中检查代码的正确性。
> 这些工具无法表明代码能否实现预期效果，但可以帮助我们避免语法错误。

### 安装
```
npm install --global eslint
```
如果你使用 `yarn`
```
yarn global add eslint
```

### 初始化
```
eslint --init
```
接下来选择第一个选项
```
? How would you like to configure ESLint?
❯ Use a popular style guide
  Answer questions about your style
  Inspect your JavaScript file(s)
```
这里推荐选择 Airbnb 的标准
```
? Which style guide do you want to follow? (Use arrow keys)
❯ Airbnb (https://github.com/airbnb/javascript)
  Standard (https://github.com/standard/standard)
  Google (https://github.com/google/eslint-config-google)
```

初始化完成后编辑 `.eslintrc.js`

```javascript
module.exports = {
  extends: 'airbnb',
  parser: 'babel-eslint',
  env: {
    browser: true,
  },
  rules: {
    'react/jsx-filename-extension': [1, { "extensions": ['.js', '.jsx'] }]
  }
};
```

更多 eslint 相关内容可自行查阅 [文档](https://eslint.org/)

## 开发真正可复用的组件

我们创建一个组件，需求为展示一个数字和一个按钮，每次按下按钮数字 +1

你可能会这样写：
```javascript
class App extends React.Component {
  state = {
    count: 0,
  };

  handleClick = () => {
    const { count: value } = this.state;
    this.setState({
      count: value + 1,
    });
  };

  render() {
    const { count } = this.state;
    return (
      <div className="App">
        { count }
        <button type="button" onClick={this.handleClick}>+1</button>
      </div>
    );
  }
}
```

以上 eslint 没有报错，并且程序也正常运行，但是这真的是最佳实践吗？

我们将代码改为以下

```javascript
class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      count: 0,
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(({ count }) => ({
      count: count + 1,
    }));
  }

  render() {
    const { count } = this.state;
    return (
      <div className="App">
        { count }
        <button type="button" onClick={this.handleClick}>+1</button>
      </div>
    );
  }
}
```

关键修改在于 `handleClick`

首先我们将箭头函数写法
```javascript
handleClick = () => {}
```
改为
```javascript
handleClick() {}
```
并在 `constructor` 方法内绑定 `handleClick` 的 this
```javascript
this.handleClick = this.handleClick.bind(this);
```

那么这两种写法有什么区别呢？我们再引入一个小例子(以下需通过babel转义运行)

```javascript
class App {
  handleClick() {
    console.log(1)
  }
}

class App2 {
  handleClick = () => {
    console.log(2)
  }
}

const app1 = new App
const app2 = new App2
console.log(app1, app2)
```

不用箭头函数的写法，`handleClick` 作为 `App` 的 `prototype` 存在于实例 app1 内；

使用箭头函数的写法，`handleClick` 作为 `App2` 的属性存在于实例 app2 内；

以上代码等同于以下

```javascript
function App() {}
App.prototype.handleClick = function() {}

function App2() {
  this.handleClick = function() {}
}

const app1 = new App
const app2 = new App2
console.log(app1, app2)
```

如果你想通过装饰器，修饰某组件内的某一个方法，那么箭头函数的写法是不可取的(装饰器可见[实例](https://github.com/chenyueban/ohbug/blob/master/src/caught/getError.js#L143))

回到我们的 React 组件，我们还注意到 `setState` 的写法改为了函数式，即函数的参数为 state 变更之前的数据，这样我们就可以方便地根据旧的 state 进行一系列操作后，产生新的 state。

在此也推荐使用函数式 `setState`

### 无状态函数式组件

#### props 与上下文

无状态组件可以接收 props 对象作为参数：
```javascript
props => <button>{ props.text }</button>
```
此外，还可以使用更简洁的 ES2015 解构语法：
```javascript
({ text }) => <button>{ text }</button>
```
定义 props 后，像继承组件那样，无状态函数就可以通过 propTypes 属性来接收 props:
```javascript
const Button = ({ text }) => <button>{ text }</button>
Button.propTypes = {
  text: React.PropTypes.string,
}
```
无状态函数式组件也接收表示上下文的第二个参数。
```javascript
(props, context) => (
  <button>{ context.currency }{ props.value }</button>
)
```

#### ref 与事件处理器
因为无状态函数式组件不能访问组件实例，所以如果要使用 ref 或者事件处理器，需要按以下方式来定义。
```javascript
() => {
  let input
  const onClick = () => input.focus()
  return (
    <div>
      <input ref={el => (input = el)} />
      <button onClick={ onClick }>Focus</button>
    </div>
  )
}
```

#### 没有组件引用
无状态函数式组件的另一个不同点在于，无论何时使用 ReactTestUtils 来渲染它们，都无法取回对组件的引用。
```javascript
const Button = React.createClass({
  render() {
    return <button />
  },
})
const component = ReactTestUtils.renderIntoDocument(<Button />)
```
在以上示例中，组件表示 Button。
```javascript
const Button = () => <button />
const component = ReactTestUtils.renderIntoDocument(<Button />)
```
但这个示例中的组件为null，将组件包裹在一个`<div>`标签中是一种解决方法，如下所示。
```javascript
const component = ReactTestUtils.renderIntoDocument(<div><Button/></div>)
```

#### 优化
> 使用无状态函数式组件需要牢记一点:虽然 Facebook 的开发人员宣称以后会为无状态组件提供性能优化，但在编写本书时，他们还没有明显的行动。
>
> 实际上，因为没有 shouldComponentUpdate 方法，所以无法通知 React 只在 props(或某个特定 prop)变化时才渲染函数式组件。
>
> 虽然这不是什么大问题，但也值得考虑。

### 有状态函数式组件 Hooks
Hooks是 React `16.7.0-alpha` 版本的新特性。正如标题所讲的，Hooks 将无状态函数式组件变为了有状态函数式组件。

#### useState
之前我们的组件，使用 Hooks 可以这样写：
```javascript
import React, { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);
  const handleClick = () => setCount(count + 1);
  return (
    <div className="App">
      { count }
      <button type="button" onClick={handleClick}>+1</button>
    </div>
  );
}
```
可以看到使用 Hooks 后，我们的组件变得非常清晰明了。

#### useEffect
Effect Hooks 用于处理一些带有副作用的操作。

举个栗子，实时监控窗口大小：
```javascript
import React, { useState, useEffect } from 'react';

function App() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  return (
    <div className="App">
      { width }
    </div>
  );
}
```

React在每次render都会调用effects，我们还可以通过定义返回函数来做一些过去 `componentwillunmount` 内做的事情，例如上栗中取消对 `resize` 的监听。

当然除了以上两个 Hooks，还有更多 Hooks 等待我们去挖掘，例如 `useContext` `useReducer` `useCallback` `useMemo` `useRef` `useImperativeMethods` `useMutationEffect` `useLayoutEffect`，甚至你可以自己定义 Hooks。

此文已经够长了，就不在写那么多了。有兴趣的可以看下以下文章。

[精读《React Hooks》](https://github.com/dt-fe/weekly/blob/master/79.%E7%B2%BE%E8%AF%BB%E3%80%8AReact%20Hooks%E3%80%8B.md)

[精读《怎么用 React Hooks 造轮子》](https://github.com/dt-fe/weekly/blob/master/80.%E7%B2%BE%E8%AF%BB%E3%80%8A%E6%80%8E%E4%B9%88%E7%94%A8%20React%20Hooks%20%E9%80%A0%E8%BD%AE%E5%AD%90%E3%80%8B.md)

[[译] 理解 React Hooks](https://juejin.im/post/5be98a87f265da616e4bf8a4)

### 状态

#### setState
> 应该总是将 setState 方法当作异步的

```javascript
class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      click: false,
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({
      click: true,
    });
    console.log(this.state.click); // false
  }

  render() {
    return (
      <button onClick={this.handleClick}>Click me!</button>
    );
  }
}
```
以上述代码段为例，控制台上将会输出 false。
> 发生这种情况的原因在于 React 知道如何优化事件处理器内部的状态更新，并进行批处理，以获得更好的性能。
```javascript
class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      click: false,
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({
      click: true,
    }, () => {
      console.log(this.state.click); // true
    });
  }

  render() {
    return (
      <button onClick={this.handleClick}>Click me!</button>
    );
  }
}
```
我们将代码稍微修改一下， 将 `console` 写入 `setState` 的第二个函数参数内，React 会帮我们在 `setState` 完成后触发函数。

#### prop 类型
> 我们的目的是开发真正可复用的组件，为了实现这一目的，需要尽可能清晰地定义组件接口。
> 
> 如果希望整个应用可以复用组件，关键要确保清晰地定义组件及其参数，以便能够直观使用。
> 
> React 提供了一个可以非常简单地表达组件接口的强大工具，只要提供组件期望接收的 prop 名称与对应的验证规则即可。
> 
> 与属性类型相关的规则也包含该属性为必选还是可选，还提供了用于编写自定义验证函数的选项。
> 
> 查看以下简单示例:
> ```javascript
> const Button = ({ text }) => <button>{text}</button>
> Button.propTypes = {
>  text: React.PropTypes.string,
> }
> ```
> 以上代码段创建了一个无状态函数式组件，以接收一个类型为字符串的文本prop。
> 
> 然而，有时仅添加属性还不够，因为这无法告知我们没有该属性时组件能否正常工作。
> 
> 例如，没有文本的情况下，按钮组件无法正常操作，解决方法就是将该 prop 标记为必需:
> ```javascript
> Button.propTypes = {
>   text: React.PropTypes.string.isRequired,
> }
> ```
> 如果某个开发人员在另一个组件中使用了按钮组件，却没有设置文本属性，那浏览器控制台就会给出以下警告:
>```
> Failed prop type: Required prop `text` was not specified in `Button`.
> ```
> 需要强调的是，这种警告只会在开发模式下出现。生产版本的 React 出于性能原因禁用了 propTypes 验证。

另外使用 class 组件时可以有更优雅的写法
```javascript
import PropTypes from 'prop-types';

class App extends React.Component {

  static propTypes = {
    test: PropTypes.string,
  }

  render() {
    return (
      // ...
    );
  }
}
```

更多 `propType` 内容请看 => [文档](https://github.com/facebook/prop-types)

### 使用 Get/Set 访问器属性来数据处理

```javascript
class FullName extends React.PureComponent {
  state = {
    firstName: 'li',
    lastName: 'lei',
  }

  get fullName() {
    const { firstName, lastName } = this.state;
    return `${firstName} ${lastName}`;
  }

  render() {
    return (
      <div>{ this.fullName }</div>
    );
  }
}
```
另外为了性能考虑，不要在render方法中进行数据处理、state/props的保存。
```javascript
// bad
render () {
  const name = `Mrs. ${this.props.name}`;
  return <div>{name}</div>;
}
 
// good
render () {
  return <div>{`Mrs. ${this.props.name}`}</div>;
}

// best
get fancyName () {
  return `Mrs. ${this.props.name}`;
}

render () {
  return <div>{this.fancyName}</div>;
}
```
推荐阅读 [[译注]React最佳实践](https://fed.renren.com/2017/02/28/react-patterns/)

### 高阶组件封装受控组件
当我们一个组件内含有大量受控组件时，是否要写多个 `handleChange` 来控制每个受控组件呢？最开始我用这种方式来公用 `handleChange`
```javascript
class Login extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(key, val) {
    this.setState({
      [key]: val,
    });
  }

  render() {
    return (
      <>
        <InputItem onChange={ v => this.handleChange('user', v) }>账号</InputItem>
        <InputItem onChange={ v => this.handleChange('pwd', v) }>密码</InputItem>
        // ...
      </>
    )
  }
}
```
这样看似乎没有问题了。实际上，针对多个组件，每个组件都含有多个受控组件的情况，我们仍需要为每一个组件单独编写 `handleChange`，这种方式仍然存在代码重复的问题。

针对这种情况，可以通过封装高阶组件解决代码复用问题。我们新建一个文件 `formcontrol.js`：
```javascript
import React from 'react';

export default function FormControl(Components) {
  return class Form extends React.Component {
    constructor(props) {
      super(props);
      this.state = {};
      this.handleChange = this.handleChange.bind(this);
    }

    handleChange(key, val) {
      this.setState({
        [key]: val,
      });
    };

    render() {
      return <Components handleChange={ this.handleChange } state={ this.state } { ...this.props }/>;
    }
  };
}
```
这样我们之前的代码可以修改为：
```javascript
import FormControl from './formcontrol';

@FormControl
class Login extends Component {
  render() {
    return (
      <>
        <InputItem onChange={ v => this.props.handleChange('user', v) }>账号</InputItem>
        <InputItem onChange={ v => this.props.handleChange('pwd', v) }>密码</InputItem>
        // ...
      </>
    )
  }
}
```
现在在 `Login` 这个组件内就有一个 `props` `state` 用来管理我们的账号和密码

### render props
我要打自己的脸了, 过去我曾经认为 HOC 天下第一, 直到接触到 `render props`

以上的例子可用 `render props` 改写
```jsx
class InputItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({
      value: e.target.value,
    });
  }

  render() {
    return this.props.children({
      value: this.state.value,
      onChange: this.handleChange,
    });
  }
}

class Login extends React.Component {
  render() {
    return (
      <InputItem>
        {form => (
          <input value={form.value} onChange={form.onChange} placeholder="用户名" />
        )}
      </InputItem>
    );
  }
}
```
真是好用到无可挑剔, 感谢 react 给我带来一个个如此灵活充满惊喜的用法.

### React Docgen
如果你的代码写的足够规范，且 prop 类型的名称和类型都很清晰，那么我们可以自动生成文档。

首先安装
```
yarn global add react-docgen
```
然后我们写一个随便写一个示例组件 App.js
```javascript
import React from 'react';
import PropTypes from 'prop-types';

/**
 * the app
 */
class App extends React.Component {
  static propTypes = {
    /**
     * the props text
     */
    text: PropTypes.string,
  }

  /**
   * button click
   */
  handleClick(p) {}

  render() {
    return (
      <div>
        { this.props.text }
      </div>
    );
  }
}

export default App;
```
之后执行命令
```
react-docgen App.js
```
然后就可以得到这样一个 JSON
```json
{
  "description": "the app",
  "displayName": "App",
  "methods": [
    {
      "name": "handleClick",
      "docblock": "button click",
      "modifiers": [],
      "params": [
        {
          "name": "p"
        }
      ],
      "returns": null,
      "description": "button click"
    }
  ],
  "props": {
    "text": {
      "type": {
        "name": "string"
      },
      "required": false,
      "description": "the props text"
    }
  }
}
```
现在可以通过返回的 JSON 创建文档了~

## 服务端渲染
TODO...

## 性能优化
TODO...

## 测试与调试
TODO...

## 需要避免的反模式
TODO...