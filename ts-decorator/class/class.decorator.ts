// 类装饰器在类声明之前被声明。
// 类装饰器应用于类构造函数，可以用来监视，修改或替换类定义。
// 类装饰器不能用在声明文件中( .d.ts)，也不能用在任何外部上下文中（比如declare的类）。

// 类装饰器表达式会在运行时当作函数被调用，类的构造函数作为其唯一的参数。
// 如果你要返回一个新的构造函数，你必须注意处理好原来的原型链。 在运行时的装饰器调用逻辑中 不会为你做这些。

type Constructor = { new (...args: any[]): any };

export function classSealDecorator(constructor: Constructor) {
  console.log("classSealDecorator 类装饰器被执行");
  // 通常，一个对象是可扩展的（可以添加新的属性）。
  // 密封一个对象会让这个对象变的不能添加新属性，且所有已有属性会变的不可配置。
  // 属性不可配置的效果就是属性变的不可删除，以及一个数据属性不能被重新定义成为访问器属性，或者反之。
  // 但属性的值仍然可以修改。
  // 尝试删除一个密封对象的属性或者将某个密封对象的属性从数据属性转换成访问器属性，结果会静默失败或抛出TypeError。
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

// 如果类装饰器返回了一个值，她将会被用来代替原有的类构造器的声明
// 因此，类装饰器适合用于继承一个现有类并添加一些属性和方法
export function classDecorator<T extends Constructor>(constructor: T) {
  return class extends constructor {
    // 装饰器不会更改 ts 类型，所以新加的属性 newProperty 在原有的类上是未知的
    newProperty = "新加的属性";
    world = "替换掉了原有构造函数内的 world";
    hello = "替换掉了原有构造函数内的 hello";

    toString() {
      return JSON.stringify(this);
    }
  }
}

// 使用工厂函数的方式返回装饰器
export function classDecoratorFactory() {
  console.log("classDecoratorFactory(): evaluated");
  return function (constructor: Constructor) {
    console.log("classDecoratorFactory(): called");
  }
}
