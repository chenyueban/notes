# 有趣的问题

## Javascript

### 1. 使以下代码正常运行
   ```javascript
    const a = [1, 2, 3, 4, 5]
    a.multiply()
    console.log(a) // [ 1, 2, 3, 4, 5, 1, 4, 9, 16, 25 ]
   ```

   答案：
   ```javascript
    Array.prototype.multiply = function() {
      this.splice(this.length, 0, ...this.map(v => v * v))
    }

    const a = [1, 2, 3, 4, 5]
    a.multiply()
    console.log(a)
   ```
   思考点有两个，prototype 和 改变原有数组的方法 splice

### 2. 以下运行结果是什么
   ```javascript
      const a = {
        key1: Symbol(1),
        key2() {},
        key3: undefined,
        key4: null,
        key5: 10,
      }
      console.log(JSON.stringify(a))
   ```
   答案：
   ```javascript
      {
        "key4": null
        "key5": 10
      }
   ```
   `JSON.stringify` 将对象转换为 JSON 时，不能文本化的属性会被忽略，但是在数组中不可被 stringify 的元素用 null 填充。
   ```javascript
    const b = [Symbol(1), function(){}, undefined, null]
    console.log(JSON.stringify(b)) // [null,null,null,null]
   ```