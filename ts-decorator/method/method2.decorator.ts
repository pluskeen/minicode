// method2Decorator 装饰器工厂函数
// 使用时用 @method2Decorator() 表达式
export function method2Decorator(params?: boolean) {
  console.log("method2Decorator(): evaluated");
  return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
    if (params) {
      console.log("method2Decorator(): called");
    }
  }
}

// 使用时用 @pureMethod2Decorator 表达式
export function pureMethod2Decorator (target, propertyKey: string, descriptor: PropertyDescriptor) {
  console.log("method2Decorator(): called");
}
