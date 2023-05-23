/**
 * new 运算符的工作原理
 *
 * 1. 将构造函数的原型对象赋值给实例对象
 * 2. 执行构造函数，将实例对象作为执行构造函数的上下文
 * 3. 判断构造函数是否有返回对象
 *    若返回了对象则将返回的对象作为实例对象最终输出
 *    若没有返回对象，则将步骤 1 中创建的实例对象输出
 */

// 这种写法的类，必须使用 new 调用
// 传入到 cNew 后会报错
// class MEs6 {
//   constructor(name) {
//     this.name = name
//   }
// }

const MEs5 = function(name) {
  this.name = name
}

// 箭头函数形式也可以
const cNew = function(fn, params) {
  const o = Object.create(fn.prototype)
  const v = fn.call(o, params)
  if (typeof v === 'object') {
    return v
  } else {
    return o
  }
}

const m1 = cNew(MEs5, 'm1 name')
const m2 = new MEs5('m2 name')

console.log(m1.prototype === m2.prototype)
console.log(m1.__proto__ === MEs5.prototype) // __proto__ 谷歌浏览器内置的实例属性，平台限定，勿用在生产环境
console.log(m1 instanceof MEs5)
console.log(m1 instanceof Object)
