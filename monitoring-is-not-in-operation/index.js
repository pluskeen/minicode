/**
 * 监测用户是否长时间未登录
 */

class MonitoringIsNotInOperation {
  lastTime = Date.now()
  currTime = Date.now()
  // 超时时间，毫秒
  timeout = 2 * 1000 // 30分钟
  // 要绑定的事件名称
  eventName = 'mousedown'
  // 计时器
  timer
  // 间隔多久检查一次
  gapTime = 1000
  // 回调
  callback = () => console.log(`No operation within ${this.timeout / 1000 / 60} minutes`)

  // options 对象 {gapTime, timeout, eventName, callback}
  constructor(options) {
    if (Object.prototype.toString.call(options) === '[object Object]' && Object.keys(options).length) {
      const keys = Object.keys(options)
      keys.forEach(c => {
        this[c] = options[c]
      })
    } else {
      console.log('Incorrect parameter type or empty object parameter, ignored')
    }

    this.start()
  }

  start() {
    window.addEventListener('load', this.loadHandle, {once: true})
  }

  checkTimeout() {
    this.currTime = Date.now() // 更新当前时间
    if (this.currTime - this.lastTime > this.timeout) { // 判断是否超时
      clearInterval(this.timer)

      try {
        this.callback()
        this.destroy()
      } catch (e) {
        throw new Error(e)
      }
    }
  }

  loadHandle = () => {
    document.addEventListener(this.eventName, this.eventNameHandle)
    // 启动定时器，每间隔 gapTime 秒检测是否长时间未操作页面
    this.timer = setInterval(this.checkTimeout.bind(this), this.gapTime)
  }

  eventNameHandle = () => {
    this.lastTime = Date.now()
  }

  destroy() {
    document.removeEventListener(this.eventName, this.eventNameHandle)
  }
}
