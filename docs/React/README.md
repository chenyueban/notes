# React

## setState
### 函数式用法
因为 `setState` 是异步的，所以下方写法会出问题
```javascript
function incrementMultiple() {
  this.setState({count: this.state.count + 1});
  this.setState({count: this.state.count + 1});
  this.setState({count: this.state.count + 1});
}
```
> 直观上来看，当上面的incrementMultiple函数被调用时，组件状态的count值被增加了3次，每次增加1，那最后count被增加了3，但是，实际上的结果只给state增加了1。
>
> 原因并不复杂，就是因为调用this.setState时，并没有立即更改this.state，所以this.setState只是在反复设置同一个值而已，上面的code等同下面这样。
```javascript
function incrementMultiple() {
  const currentCount = this.state.count;
  this.setState({count: currentCount + 1});
  this.setState({count: currentCount + 1});
  this.setState({count: currentCount + 1});
}
```
解决方案同时也是 `setState` 的推荐使用方案
```javascript
this.setState((state, props) => {count: state.count + 1})
```

### Promise 封装 setState
```javascript
function setStateAsync(nextState){  
  return new Promise(resolve => {
    this.setState(nextState, resolve)
  })
}
```
之后通过 `async await` 轻松调用
```javascript
async func() {  
  await this.setStateAsync({count: this.state.count + 1})
  await this.setStateAsync({count: this.state.count + 1})
}
```
[setState：这个API设计到底怎么样](https://zhuanlan.zhihu.com/p/25954470)

[ReactJS setState 详解](https://juejin.im/entry/58b5285a5c497d00560fa290)

## React表单双向绑定
> 单向绑定非常简单，就是把`Model`绑定到`View`，当我们用JavaScript代码更新`Model`时，`View`就会自动更新。
>
> 有单向绑定，就有双向绑定。如果用户更新了`View`，`Model`的数据也自动被更新了，这种情况就是双向绑定。
```javascript
<Input type="text" value={this.state.inputState} onChange={this.handleChange.bind(this)}/>

handleChange(value) {
  this.setState({
    inputState: value
  })
}
```
> 如上，通过对 `input` 绑定一个 `state`，控制 `input` 的内容，当我们在 `View` 层修改 `input` 的内容时，触发onChange，onChange修改了 `input` 绑定的 `state`，所以在 `View` 层就看到了内容的变化。
> 如果想在 `Model` 层改变 `View` 层，只需要 `setState`
```javascript
this.setState({
  inputState: value
})
```
> 其他表单元素，例如：checkbox radio textarea select 等，与 input 基本一致
### 多个表单元素公用一个 handleChange
```javascript
<Input
  type="text"
  value={this.state.input1}
  onChange={this.handleChange.bind(this, 'input1')}
/>
<Input
  type="text"
  value={this.state.input2}
  onChange={this.handleChange.bind(this, 'input2')}
/>

handleChange(key, value) {
  this.setState({
    [key]: value
  })
}
```
*提倡对于所有表单元素统一使用 `state` 控制，即不提倡在 `React` 中使用非受控组件*

### 使用 `redux-form-utils` 减少冗余
即使我们将多个表单都公用了一个 `handleChange` 我们仍然要为每一个表单绑定 `value`，添加 `onChange`，这样写了好久之后我才终于发现一个更优雅的解决方案 `redux-form-utils`
```javascript
import React from 'react'
import { createForm } from 'redux-form-utils'

@createForm({
  form: 'my-form',
  fields: ['name', 'address', 'gender']
})
class Form extends React.Component {
  render() {
    const { name, address } = this.props.fields;
    return (
      <div className="form">
        <input name="name" {...name} />
        <input name="address" {...address} />
      </div>
    )
  }
}
```

## classnames

> 在 `React0.13` 版本之前，`React` 官方提供 `React.addons.classSet` 插件来给组件动态设置 `className`, 这在后续版本被移除（为了精简API）。我们可以使用 `classnames` 库来操作类。

如果不使用 `classnames` 库，就需要这样处理动态类名：
```javascript
import React from 'react'

class Button extends React.Component {
  // ...
  render() {
    let btnClass = 'btn'
    if (this.state.isPressed) {btnClass += 'btn-pressed'}
    else if (this.state.isHovered) {btnClass += 'btn-hover'}

    return <button className={btnClass}>{this.props.label}</button>
  }
}
```
使用了 `classnames` 库后，代码就可以变得非常简单：
```javascript
import React from 'react'
import classNames from 'classnames'

class Button extends React.Component {
  // ...
  render() {
    let btnClass = classNames({
      'btn': true,
      'btn-pressed': this.state.isPressed,
      'btn-hover': this.state.isHovered
    })

    return <button className={btnClass}>{this.props.label}</button>
  }
}
```

## 生命周期
### 在生命周期中的哪一步你应该发起 AJAX 请求？
我们应当将AJAX 请求放到 componentDidMount 函数中执行，主要原因有下：

- React 下一代调和算法 Fiber 会通过开始或停止渲染的方式优化应用性能，其会影响到 componentWillMount 的触发次数。对于 componentWillMount 这个生命周期函数的调用次数会变得不确定，React 可能会多次频繁调用 componentWillMount。如果我们将 AJAX 请求放到 componentWillMount 函数中，那么显而易见其会被触发多次，自然也就不是好的选择。

- 如果我们将 AJAX 请求放置在生命周期的其他函数中，我们并不能保证请求仅在组件挂载完毕后才会要求响应。如果我们的数据请求在组件挂载之前就完成，并且调用了setState函数将数据添加到组件状态中，对于未挂载的组件则会报错。而在 componentDidMount 函数中进行 AJAX 请求则能有效避免这个问题。

[正确掌握 React 生命周期](https://juejin.im/entry/587de1b32f301e0057a28897)

### V16 生命周期函数用法建议
```javascript
class ExampleComponent extends React.Component {
  // 用于初始化 state
  constructor() {}
  // 用于替换 `componentWillReceiveProps` ，该函数会在初始化和 `update` 时被调用
  // 因为该函数是静态函数，所以取不到 `this`
  // 如果需要对比 `prevProps` 需要单独在 `state` 中维护
  static getDerivedStateFromProps(nextProps, prevState) {}
  // 判断是否需要更新组件，多用于组件性能优化
  shouldComponentUpdate(nextProps, nextState) {}
  // 组件挂载后调用
  // 可以在该函数中进行请求或者订阅
  componentDidMount() {}
  // 用于获得最新的 DOM 数据
  getSnapshotBeforeUpdate() {}
  // 组件即将销毁
  // 可以在此处移除订阅，定时器等等
  componentWillUnmount() {}
  // 组件销毁后调用
  componentDidUnMount() {}
  // 组件更新后调用
  componentDidUpdate() {}
  // 渲染组件函数
  render() {}
  // 以下函数不建议使用
  UNSAFE_componentWillMount() {}
  UNSAFE_componentWillUpdate(nextProps, nextState) {}
  UNSAFE_componentWillReceiveProps(nextProps) {}
}
```

## key 的重要性
> Keys 是 `React` 用于追踪哪些列表中元素被修改、被添加或者被移除的辅助标识。
```javascript
render() {
  return (
    <ul>
      {this.state.todoItems.map(({task, uid}) => {
        return <li key={uid}>{task}</li>
      })}
    </ul>
  )
}
```
> 在开发过程中，我们需要保证某个元素的 `key` 在其同级元素中具有唯一性。在 `React Diff` 算法中 `React` 会借助元素的 `Key` 值来判断该元素是新近创建的还是被移动而来的元素，从而减少不必要的元素重渲染。此外，`React` 还需要借助 `Key` 值来判断元素与本地状态的关联关系，因此我们绝不可忽视转换函数中 `Key` 的重要性。
*要求所有通过循环渲染出的列表内容必须加`key`，并且要保证`key`值的唯一性*
- 尽量避免使用index作为key
- 尽量避免使用index作为key
- 尽量避免使用index作为key

## 路由
### 组件外部跳转
```javascript
// 这里 hashHistory 或 browserHistory 取决于路由定义时的方式
import { hashHistory } from 'react-router'

hashHistory.push("/print/printIndex/shortTitle")
```
或
```javascript
this.props.history.push('/print/printIndex/shortTitle') // react-router 2 写法
this.context.router.history.push('/print/printIndex/shortTitle') // react-router 4 写法
```

### Link 取代 a 标签
原写法
```javascript
<a className="rowElement8 label" onClick={this.toShortTitle}>管理简称</a>

toShortTitle = () => {
    hashHistory.push("/print/printIndex/shortTitle")
}
```
现写法
```javascript
import { Link } from 'react-router'

<Link to='/print/printIndex/shortTitle'>管理简称</Link>
```

## MVC MVP MVVM 思想引入
### 统一代码风格
- 要有一套统一的代码风格，不能每个人按照自己的心情随意编写代码，在完成需求的前提下统一风格，方便他人维护时快速读懂代码，提高效率。
### 函数/组件封装
- 当我们发现，代码相同的部分较多时，代码一定就可以封装成 函数/组件
- 代码内尽量不要出现重复的代码
### 纯函数
[合理的使用纯函数编程](https://segmentfault.com/a/1190000007491981)

推荐书籍 [JS 函数式编程指南](https://legacy.gitbook.com/book/llh911001/mostly-adequate-guide-chinese/details)
### Redux
#### 应用场景
例：传参时需要传入machineNo sellerNick
```javascript
CommonService.getNickAndMachineNo()
  .then(res => {
    const machineNo = res.machineNo
    const username = res.sellerNick
  }
```

```javascript
// type
const MSG_LIST = 'MSG_LIST'
// action creater
function msgList(msgs, users, userid) {
  return {
    type: MSG_LIST,
    payload: { msgs, users, userid }, // 规范是使用payload包裹数据
  }
}
export function getMsgList() {
  return (dispatch, getState) => {
    axios.get(`${userUri}/msglist`)
      .then((res) => {
        if (res.status === 200 && res.data.code === 1) {
          // 请求成功
          const userid = getState().user._id
          dispatch(msgList(res.data.msgs, res.data.users, userid))
        }
      });
  };
}
// reducer
const initState = {
  chatmsg: [],
  users: {},
  unread: 0,
};
export function chat(state = initState, action) {
  switch (action.type) {
    case MSG_LIST:
      return {
        ...state,
        chatmsg: action.payload.msgs,
        users: action.payload.users,
        unread: action.payload.msgs.filter(v => !v.read && v.to === action.payload.userid).length,
      };
    default:
      return state;
  }
}
```
### MVC思想
- Model 数据存取 -- redux
- View 视图 -- render
- Controller 控制器(数据和视图以外的逻辑全部放在这) -- 组件内操作 setState 等

## PureComponent
> React15.3中新加了一个 `PureComponent` 类，目的是减少不必要的 `render`，从而提高性能。并且可以少写很多 `shouldComponentUpdate`
### 使用方法
```javascript
class App extends React.PureComponent {}
```
### 注意事项
#### 数组操作
*易变数据不能使用一个引用*
```javascript
class App extends React.PureComponent {
  state = {
    items: [1, 2, 3]
  }
  handleClick = () => {
    const { items } = this.state;
    items.pop();
    this.setState({ items });
  }
  render() {
    return (
      <div>
        <ul>
          {this.state.items.map(i => <li key={i}>{i}</li>)}
        </ul>
        <button onClick={this.handleClick}>delete</button>
      </div>
    )
  }
}
```
以上无论怎么点 `delete` 按钮，`li`都不会变少，因为 `items` 用的是一个引用(数组，对象)
```javascript
handleClick = () => {
  const { items } = this.state;
  items.pop();
  this.setState({ items: [...items] });
}
```
#### 不变数据使用一个引用
##### 函数属性
我们在给组件传一个函数的时候，有时候总喜欢:
```javascript
<MyInput onChange={e => this.props.update(e.target.value)} />
//或者
update(e) {
  this.props.update(e.target.value)
}
render() {
  return <MyInput onChange={this.update.bind(this)} />
}
```
由于每次 `render` 操作 `MyInput` 组件的 `onChange` 属性都会返回一个新的函数，由于引用不一样，所以父组件的 `render` 也会导致 `MyInput` 组件的 `render`，即使没有任何改动，所以需要尽量避免这样的写法，最好这样写：
```javascript
update = (e) => {
  this.props.update(e.target.value)
}
render() {
  return <MyInput onChange={this.update} />
}
```
更多使用细节可参考 [React PureComponent 使用指南](hhttps://juejin.im/entry/5934c9bc570c35005b556e1a)

## Immutable
> Shared mutable state is the root of all evil（共享的可变状态是万恶之源）
>
> -- Pete Hunt

有人说 Immutable 可以给 React 应用带来数十倍的提升，也有人说 Immutable 的引入是近期 JavaScript 中伟大的发明，因为同期 React 太火，它的光芒被掩盖了。这些至少说明 Immutable 是很有价值的，下面我们来一探究竟。

JavaScript 中的对象一般是可变的（Mutable），因为使用了引用赋值，新的对象简单的引用了原始对象，改变新的对象将影响到原始对象。如 foo={a: 1}; bar=foo; bar.a=2 你会发现此时 foo.a 也被改成了 2。虽然这样做可以节约内存，但当应用复杂后，这就造成了非常大的隐患，Mutable 带来的优点变得得不偿失。为了解决这个问题，一般的做法是使用 shallowCopy（浅拷贝）或 deepCopy（深拷贝）来避免被修改，但这样做造成了 CPU 和内存的浪费。

Immutable 可以很好地解决这些问题。

### 什么是 Immutable Data

Immutable Data 就是一旦创建，就不能再被更改的数据。对 Immutable 对象的任何修改或添加删除操作都会返回一个新的 Immutable 对象。Immutable 实现的原理是 Persistent Data Structure（持久化数据结构），也就是使用旧数据创建新数据时，要保证旧数据同时可用且不变。同时为了避免 deepCopy 把所有节点都复制一遍带来的性能损耗，Immutable 使用了 Structural Sharing（结构共享），即如果对象树中一个节点发生变化，只修改这个节点和受它影响的父节点，其它节点则进行共享。请看下面动画：

![Immutable](https://camo.githubusercontent.com/9e129aaf95d2a645a860dc26532796817e8085c0/687474703a2f2f696d672e616c6963646e2e636f6d2f7470732f69322f5442317a7a695f4b5858585858637458465858627262384f5658582d3631332d3537352e676966)

### Immutable 优点
1. 减少内存使用
2. 并发安全
3. 降级项目复杂度
4. 便于比较复杂数据，定制`shouldComponentUpdate`方便
5. 时间旅行功能方便
6. 函数式编程

### Immutable 的几种数据类型
1. List: 有序索引集，类似JavaScript中的Array。
2. Map: 无序索引集，类似JavaScript中的Object。
3. OrderedMap: 有序的Map，根据数据的set()进行排序。
4. Set: 没有重复值的集合。
5. OrderedSet: 有序的Set，根据数据的add进行排序。
6. Stack: 有序集合，支持使用unshift（）和shift（）添加和删除。
7. Range(): 返回一个Seq.Indexed类型的集合，这个方法有三个参数，start表示开始值，默认值为0，end表示结束值，默认为无穷大，step代表每次增大的数值，默认为1.如果start = end,则返回空集合。
8. Repeat(): 返回一个vSeq.Indexe类型的集合，这个方法有两个参数，value代表需要重复的值，times代表要重复的次数，默认为无穷大。
9. Record: 一个用于生成Record实例的类。类似于JavaScript的Object，但是只接收特定字符串为key，具有默认值。
10. Seq: 序列，但是可能不能由具体的数据结构支持。
11. Collection: 是构建所有数据结构的基类，不可以直接构建。

### API
#### 1.fromJS()
作用：将一个js数据转换为Immutable类型的数据。

用法：fromJS(value, converter)

简介：value是要转变的数据，converter是要做的操作。第二个参数可不填，默认情况会将数组准换为List类型，将对象转换为Map类型，其余不做操作。

代码实现：
```javascript
const obj = Immutable.fromJS({a: '123', b: '234'}, function(key, value, path) {
  console.log(key, value, path)
  return isIndexed(value) ? value.toList() : value.toOrderedMap())
})
```

#### 2.toJS()
作用：将一个Immutable数据转换为JS类型的数据。

用法：`value.toJS()`

#### 3.is()
作用：对两个对象进行比较。

用法：is(map1,map2)

简介：和js中对象的比较不同，在js中比较两个对象比较的是地址，但是在Immutable中比较的是这个对象hashCode和valueOf，只要两个对象的hashCode相等，值就是相同的，避免了深度遍历，提高了性能。

代码实现：
```javascript
import { Map, is } from 'immutable'
const map1 = Map({ a: 1, b: 1, c: 1 })
const map2 = Map({ a: 1, b: 1, c: 1 })
map1 === map2   //false
Object.is(map1, map2) // false
is(map1, map2) // true
```

### 与 `React` 搭配
```javascript
import _ from 'lodash'

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      data: {
        num: 1
      }
    }

    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    const data = _.cloneDeep(this.state.data)
    this.setState({
      data: {num: data.num + 1}
    })
  }

  render() {
    return (
      <div>
        {this.state.data.num}
        <button onClick={this.handleClick}>+1</button>
      </div>
    )
  }

  shouldComponentUpdate(nextProps = {}, nextState = {}) {
    const thisProps = this.props || {}, thisState = this.state || {}

    if (Object.keys(thisProps).length !== Object.keys(nextProps).length ||
      Object.keys(thisState).length !== Object.keys(nextState).length) {
      return true
    }

    for (const key in nextProps) {
      if (nextProps[key] !== nextProps[key]) {
        return true
      }
    }

    for (const key in nextState) {
      if (thisState[key] !== nextState[key]) {
        return true
      }
    }

    return false
  }
}
```

以上每次修改 `num` 时需要对 `data` 进行深拷贝，这样不但性能存在很大隐患，写 `shouldComponentUpdate` 也是令人非常痛苦的

`immutable` 就很适合处理这种情况

```javascript
import { Map, is } from 'immutable'

class App extends React.Component {
  constructor(props) {
    super(props)
    
    this.state = {
      data: Map({
        num: 1
      })
    }

    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    // 以下两种写法可选
    this.setState({
      data: data.set('num', data.get('num') + 1)
    })

    this.setState(({data}) => ({
      data: data.update('num', v => v)
    }))
  }

  render() {
    return (
      <div>
        {this.state.data.get('num')}
        <button onClick={this.handleClick}>+1</button>
      </div>
    )
  }

  shouldComponentUpdate(nextProps = {}, nextState = {}) {
    const thisProps = this.props || {}, thisState = this.state || {}

    if (Object.keys(thisProps).length !== Object.keys(nextProps).length ||
      Object.keys(thisState).length !== Object.keys(nextState).length) {
      return true
    }

    for (const key in nextProps) {
      if (nextProps.hasOwnProperty(key) && !is(thisProps[key], nextProps[key])) {
        return true
      }
    }

    for (const key in nextState) {
      if (nextState.hasOwnProperty(key) && !is(thisState[key], nextState[key])) {
        return true
      }
    }

    return false
  }
}
```
更多内容可见

[Immutable 常用API简介](https://juejin.im/entry/5992ca405188252425645017)

[Immutable 详解及 React 中实践](https://github.com/camsong/blog/issues/3)

## Fragment

众所周知， `render` 返回的内容根元素只能有一个，那么在一些特殊情况如下
```javascript
class Table extends React.Component {
  render() {
    return (
      <table>
        <tr>
          <Columns />
        </tr>
      </table>
    );
  }
}
```
`Columns` 的定义如下
```javascript
class Columns extends React.Component {
  render() {
    return (
      <div>
        <td>Hello</td>
        <td>World</td>
      </div>
    );
  }
}
```
由于 `render` 返回的根元素只能有一个，我们好像只能使用一个 `div` 去包裹两个 `td`，非常让人苦恼的是在实际渲染时会变成以下
```javascript
<table>
  <tr>
    <div>
      <td>Hello</td>
      <td>World</td>
    </div>
  </tr>
</table>
```
可以看到 `tr` 之下有一个非常讨厌的 `div` 影响布局，而 `Fragment` 正是这种情况下的解决方案。
```javascript
import React, { Component, Fragment } from 'react'

class Columns extends Component {
  render() {
    return (
      <Fragment>
        <td>Hello</td>
        <td>World</td>
      </Fragment>
    );
  }
}
```
这样在实际渲染时并不会出现多余的元素
```javascript
<table>
  <tr>
    <td>Hello</td>
    <td>World</td>
  </tr>
</table>
```
什么？嫌麻烦？还有更加简单的写法！
```javascript
class Columns extends React.Component {
  render() {
    return (
      <>
        <td>Hello</td>
        <td>World</td>
      </>
    );
  }
}
```
有一点是需要注意的，`<></>` 并不接受任何属性，包括 `key` 属性。

如果我们需要使用有 `key` 值的 `Fragment` 那么只能使用 `<Fragment />` 组件。