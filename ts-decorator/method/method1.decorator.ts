// method1Decorator 装饰器工厂函数
// 使用时用 @method1Decorator() 表达式
export function method1Decorator(params?: boolean) {
  console.log("method1Decorator(): evaluated");
  return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
    if (params) {
      console.log("method1Decorator(): called");
      console.log(target);
      console.log(propertyKey);
      console.log(descriptor);
    }
  }
}
