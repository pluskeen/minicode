/**
 * 手写 bind 函数
 * 1. bind 函数接受多个参数，第一个参数是上下文，后面的参数是函数额外参数
 * 2 .bind 函数并不会立马执行，而是返回新的函数，等待后面主动去调用
 */

Function.prototype.cBind = function() {
  // 获取参数
  const args = Array.prototype.slice.call(arguments)
  // 获取传入的上下文
  const t = args.shift()
  // 调用 cBind 的函数
  const self = this

  // bind 不是立即执行的，所以返回函数
  return function() {
    return self.apply(t, args)
  }
}

const fn1 = function(a, b, c) {
  console.log(a, b, c)
  console.log('this', this)
  return 'fn1 exec'
}

const res = fn1.cBind({x: 123}, 'a', 'b', 'c')
console.log(res());
