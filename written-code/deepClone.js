/**
 * 采用递归的方式实现深拷贝
 * 边界测试： 0 1 false true null undefined {} [], new Date(), function, 空参数
 *
 * !!! Object.keys(new Date()) 输出 [], 增加对 Object.keys 返回值的长度判断
 * */

const deepClone = (obj) => {
  let result = Array.isArray(obj) ? [] : {}

  if (typeof obj !== 'object' || obj == null) {
    return obj
  }

  const keys = Object.keys(obj)
  // 可应对 obj 是 new Date() 情况
  if (keys.length) {
    keys.forEach(item => {
      if (typeof obj[item] === 'object' && Object.prototype.toString.call(obj[item]) !== '[object Date]') {
        result[item] = deepClone(obj[item])
      } else {
        result[item] = obj[item]
      }
    })
  } else {
    result = obj
  }

  return result
}

const obj1 = {}
const obj2 = []
const obj3 = 0
const obj4 = 1
const obj5 = null
const obj6 = undefined
const obj7 = NaN
const obj8 = new Date()
const obj9 = Object // 函数
const obj10 = {a: 1, b: new Date(), c: null, d: [1, 2, 3, 4]}
const obj11 = [{a: 1, b: 2, c: ['c1', 'c2', {c3: ['c3a']}]}]

console.log(deepClone(obj1));
console.log(deepClone(obj2));
console.log(deepClone(obj3));
console.log(deepClone(obj4));
console.log(deepClone(obj5));
console.log(deepClone(obj6));
console.log(deepClone(obj7));
console.log(deepClone(obj8));
console.log(deepClone(obj9));
console.log(deepClone(obj10));
console.log(deepClone(obj11));
console.log(deepClone());


// 区分 Object 和 Array 的方法
Array.isArray() // 数组返回 true，对象返回 false

Object.prototype.toString.call() // 数组返回 '[object Array]'，对象返回 '[object Object]'

Object.prototype.isPrototypeOf() // 数组和对象均返回 true !!! 不能区分数组和对象 !!!

Array.prototype.isPrototypeOf() // 数组返回 true，对象返回 false
