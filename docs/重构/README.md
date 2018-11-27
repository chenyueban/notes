# 重构

## 代码优化基本原则
1. 易读性优先
2. 如果不是性能瓶颈，就不要为了性能而改写代码
3. 复杂性守恒原则：无论你怎么写代码，复杂性都是不会消失的
推论：如果逻辑很复杂，那么代码看起来就应该是复杂的。如果逻辑很简单，代码看起来就应该是简单的。

## 命名

### 程序员三大难题
1. 变量命名
2. 缓存失效
3. 循环边界

这里只研究变量命名相关，[网上有很多命名规范](https://www.google.com/search?q=github+%E5%91%BD%E5%90%8D%E8%A7%84%E8%8C%83)，建议看一下。

#### 1. 注意词性
  - 普通变量/属性用「名词」
  ```javascript
  var person = {
      name: 'Frank'
  }
  var student = {
      grade: 3,
      class: 2
  }
  ```

  - bool变量/属性用「形容词」或者「be动词」或者「情态动词」或者「hasX」

  ```javascript
  var person = {
      dead: false, // 如果是形容词，前面就没必要加 is，比如isDead 就很废话
      canSpeak: true, //情态动词有 can、should、will、need 等，情态动词后面接动词
      isVip: true, // be 动词有 is、was 等，后面一般接名词
      hasChildren: true, // has 加名词
  }
  ```

  - 普通函数/方法用「动词」开头

  ```javascript
  var person = {
      run(){}, // 不及物动词
      drinkWater(){}, // 及物动词
      eat(foo){}, // 及物动词加参数（参数是名词）
  }
  ```

  - 回调、钩子函数用「介词」开头，或用「动词的现在完成时态」

  ```javascript
  var person = {
      beforeDie(){},
      afterDie(){},
      // 或者
      willDie(){}
      dead(){} // 这里跟 bool 冲突，你只要不同时暴露 bool dead 和函数 dead 就行，怕冲突就用上面的 afterDie
  }
  button.addEventListener('click', onButtonClick)
  var component = {
      beforeCreate(){},
      created(){},
      beforeMount(){},
      mounted(){},
      beforeUpdate(){},
      updated(){},
      activated(){},
      deactivated(){},
      beforeDestroy(){},
      destroyed(){},
      errorCaptured(){}
  }
  ```

  - 容易混淆的地方加前缀

  ```javascript
  div1.classList.add('active') // DOM 对象
  div2.addClass('active') // jQuery 对象
  不如改成
  domDiv1 或 elDiv1.classList.add('active')
  $div2.addClass('active')
  ```

  - 属性访问器函数可以用名词

  ```javascript
  $div.text() // 其实是 $div.getText()
  $div.text('hi') // 其实是 $div.setText('hi')
  ```

#### 2. 注意一致性
  - 介词一致性
    如果你使用了 before + after，那么就在代码的所有地方都坚持使用
    如果你使用了 before + 完成时，那么就坚持使用
    如果你改来改去，就「不一致」了，不一致将导致「不可预测」
  - 顺序一致性
    比如 updateContainerWidth 和 updateHeightOfContainer 的顺序就令人很别扭，同样会引发「不可预测」
  - 表里一致性
    函数名必须完美体现函数的功能，既不能多也不能少。
    比如
    ```javascript
    function getSongs(){
        return $.get('/songs).then((response){
            div.innerText = response.songs
        })
    }
    ```
    就违背了表里一致性，getSongs 表示获取歌曲，并没有暗示这个函数会更新页面，但是实际上函数更新了 div，这就是表里不一，正确的写法是
    - 要么纠正函数名
    ```javascript
    function getSongsAndUpdateDiv(){
        return $.get('/songs).then((response){
            div.innerText = response.songs
        })
    }
    ```
    - 要么写成两个函数
    ```javascript
    function getSongs(){
        return $.get('/songs)
    }
    function updateDiv(songs){
        div.innerText = response.songs
    }
    getSongs().then((response)=>{
        updateDiv(response.songs)
    })
    ```
  - 时间一致性:
    有可能随着代码的变迁，一个变量的含义已经不同于它一开始的含义了，这个时候你需要及时改掉这个变量的名字。
    这一条是最难做到的，因为写代码容易，改代码难。如果这个代码组织得不好，很可能会出现牵一发而动全身的情况（如全局变量就很难改）

## 改代码
> 如果你的代码有单元测试，那么改起来就很放心。如果没有单元测试，就需要用「小步快跑」的策略来修改。
>
> 小步快跑的意思是说，每次只修改一点点，测试通过后，再修改一点点，再测试，再修改一点点……如此反复。
>
> 那么如何修改一点点呢？《重构》这本书介绍了很多方法，但是讲得挺啰嗦的，如果你有时间可以看看。

这里只说两个经久不衰的方法。

### 1. 使用函数来改代码
1. 将一坨代码放到一个函数里
2. 将代码依赖的外部变量作为参数
3. 将代码的输出作为函数的返回值
4. 给函数取一个合适的名字
5. 调用这个函数并传入参数
6. 这个函数里的代码如果超过 5 行，则依然有优化的空间，请回到第 1 步

### 2. 使用对象来改代码
如果使用了函数改造法改造后，发现有太多的小函数，则可以使用对象讲这个函数串起来。

例如：
[更改前](https://codesandbox.io/s/wnnxq9z76w)
[更改后](https://codesandbox.io/s/v0yzmx6zx5)

### 3. 一些固定的套路
1. 表驱动编程
   ```javascript
    function what(country) {
      if (country === "China") {
        return "CHN";
      } else if (country === "America") {
        return "USA";
      } else if (country === "Japan") {
        return "JPN";
      } else {
        return "OTHER";
      }
    }
   ```
  看到上面一连串的 `else if` 你肯定想到了，用 `switch case`呀。
  ```javascript
    function what(country) {
      switch(country) {
        case "China":
          return "CHN";
        case "America":
          return "USA";
        case "Japan":
          return "JPN";
        default:
          return "OTHER";
      }
    }
  ```
  那么表驱动编程是什么样子呢？
  ```javascript
    function what(country) {
      const list = {
        China: 'CHN',
        America: 'USA',
        Japan: 'JPN',
      }
      if (list[country]) return list[country]
      return 'OTHER'
    }
  ```
  是不是代码量更小，更清晰了呢。
  
  [更多可看](https://juejin.im/post/5b4b73e7f265da0f96287f0a)

2. 自说明代码（把别人关心的东西放在显眼的位置）

[自说明代码](https://www.huangwm.com/wp/archives/2193)