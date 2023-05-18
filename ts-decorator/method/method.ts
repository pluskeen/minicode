// @f
// @g
// method

// 当多个装饰器应用在一个声明上时会进行如下步骤的操作：
// 由上至下依次对装饰器表达式求值。
// 求值的结果会被当作函数，由下至上依次调用。

import { method1Decorator } from './method1.decorator';
import { method2Decorator, pureMethod2Decorator } from './method2.decorator';
import { methodBaseDecorator } from './methodBase.decorator';

class Class {
  @method1Decorator(true)
  @method2Decorator(false)
  @methodBaseDecorator()
  greet() {
    return "Hello";
  }
}

const class1 = new Class();

console.log(class1.greet());
