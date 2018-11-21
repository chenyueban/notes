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

more todo...