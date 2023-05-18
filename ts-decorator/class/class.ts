import { classDecoratorFactory, classDecorator } from './class.decorator';

@classDecorator
class ClassA {
  property = "property";
  hello: string;
  world = 'world';
  name: string

  constructor(hello: string) {
    this.hello = hello;
    this.name = 'name 的赋值操作不会因为装饰器被 pass'
  }
}

const instance = new ClassA('input param');

console.log(instance);
console.log(instance.toString());
console.log(instance instanceof ClassA);
console.log(instance instanceof ClassA);

// 新加的属性 newProperty 在原有的类上是未知的
// console.log(instance.newProperty); // Property 'newProperty' does not exist on type 'ClassA'

// 这是一个 ts 的已知的缺陷，目前能做的只有额外提供一个类用于提供类型信息
// class Base {
//   newProperty: string;
// }
// class ClassA extends Base {}
