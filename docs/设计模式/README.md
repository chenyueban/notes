# 设计模式

## 发布订阅模式与观察者模式区别
### 发布订阅模式实现
```js
class EventHub {
  constructor() {
    this.subscribers = [];
  }

  subscribe(type, callback) {
    const callbacks = this.subscribers[type];
    if (!callbacks) {
      this.subscribers[type] = [callback];
    } else {
      callbacks.push(callback);
    }
  }

  publish(type, ...args) {
    const callbacks = this.subscribers[type] || [];
    callbacks.forEach(callback => callback(...args));
  }
}

const eventHub = new EventHub();

eventHub.subscribe('say', arg => {
  console.log(`hello ${arg}`);
});
eventHub.subscribe('say', console.log);

eventHub.publish('say', 'cxy');
```


### 观察者模式实现
```js
class Subject {
  constructor() {
    this.observers = [];
  }

  add(observer) {
    this.observers.push(observer);
  }

  notify(...args) {
    this.observers.forEach(observer => observer(...args));
  }
}

function observer(args) {
  console.log(`hello ${args}`);
}

const subject = new Subject();
subject.add(observer);
subject.add(console.log);

subject.notify('cxy');
```

观察者模式下 `Subject` 直接触发了它所关联的所有订阅者。

而发布订阅模式下 `EventHub` 更像是一个中介，订阅者将相关信息和一个 `type` 交付给 `EventHub` 后，触发时发布者将参数和 `type` 交付给 `EventHub` ，`EventHub` 根据 `type` 触发对应的操作。