// methodBaseDecorator 装饰器工厂函数
// 使用时用 @methodBaseDecorator() 表达式
export function methodBaseDecorator(params?: boolean) {
  console.log("methodBaseDecorator(): evaluated");
  return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log('methodBaseDecorator');
  }
}
