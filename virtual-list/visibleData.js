const genData = (length = 2000) => {
  let result = []
  for (let i = 0; i < length; i++) {
    result.push({
      label: (Math.random() * (i + 1)).toString(36).substring(3).toUpperCase(),
      value: Math.random() * 100 + 20,
      imgWidth: Math.ceil(Math.random() * 100 + 20),
      imgHeight: Math.ceil(Math.random() * 100 + 50),
      // 给数据加上 index 索引，从 0 开始，方便后续直接读取
      index : i
    })
  }
  return result
}

export const data = genData()

const genX = (before = 12) => {
  const xRow = []
  let nowMonth = new Date().getMonth() + 1
  let i = 0
  while (i < before) {
    const text = `${nowMonth}月`
    nowMonth--
    if (nowMonth === 0) {
      nowMonth = 12
    }
    xRow.unshift(text)
    i++
  }

  console.log(xRow)
  return xRow
}
