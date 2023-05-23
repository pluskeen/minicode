// 字符串的下划线格式转驼峰格式
export const underline2Hump = s => s.replace(/_(\w)/g, (all, letter) => letter.toUpperCase())

// 字符串的驼峰格式转下划线格式
export const hump2Underline = s => s.replace(/([A-Z])/g, '_$1').toLowerCase()

/**
 * JSON对象的key值转换为驼峰式
 * @param obj
 */
export const jsonToHump = obj => {
  if (obj instanceof Array) {
    obj.forEach((v, i) => {
      jsonToHump(v)
    })
  } else if (obj instanceof Object) {
    Object.keys(obj).forEach((key) => {
      const newKey = underline2Hump(key)
      if (newKey !== key) {
        obj[newKey] = obj[key]
        delete obj[key]
      }
      jsonToHump(obj[newKey])
    })
  }
}


/**
 *  JSON对象的key值转换为下划线格式
 * @param obj
 */
export const jsonToUnderline = obj => {
  if (obj instanceof Array) {
    obj.forEach((v, i) => {
      jsonToUnderline(v);
    })
  } else if (obj instanceof Object) {
    Object.keys(obj).forEach((key) => {
      const newKey = hump2Underline(key)
      if (newKey !== key) {
        obj[newKey] = obj[key]
        delete obj[key]
      }
      jsonToUnderline(obj[newKey])
    })
  }
}
