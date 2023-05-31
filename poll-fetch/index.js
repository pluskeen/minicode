class PollFetch {
  static defaultOptions = {
    // 调用 exec 后立即执行一次
    immediately: false,
    // 轮询函数需要的入参
    params: null,
    // 轮询间隔时间，单位秒
    delayTime: 10
  }

  constructor(fn, options) {
    if (typeof fn !== 'function') {
      throw new Error(`PollFetch: first parameter must be the Function`)
    }
    if (!!options && Object.prototype.toString.call(options) === '[object Object]') {
      this.options = {...PollFetch.defaultOptions, ...options}
      this.fn = this.generateNewFn(fn, options)
    } else {
      this.options = PollFetch.defaultOptions
    }

    this.loop = true
    this.timeId = null
  }

  generateNewFn(fn, options) {
    let {params} = options
    // 存在 params
    if (!!params) {
      if (Array.isArray(params)) { // params 是数组
        return fn.bind(this, ...this.options.params)
      } else if (typeof params === 'string' || typeof params === 'number') { // params 是数字、字符串
        return fn.bind(this, this.options.params)
      } else {
        throw new Error('Storage: params type should be the Array or String or Number');
      }
    } else {
      return fn
    }
  }

  timeoutPromise() {
    return new Promise(resolve => {
      this.timeId = setTimeout(resolve, this.options.delayTime * 1000)
    })
  }

  syncPromise() {
    return new Promise((resolve) => {
      Promise.resolve(this.fn())
        .then(() => {
          resolve()
        })
    })
  }

  async exec() {
    if (this.options.immediately) {
      await this.syncPromise()
    }

    while (this.loop) {
      try {
        await this.timeoutPromise()
        await this.syncPromise()
      } catch (err) {
        this.loop = false
        await Promise.reject(e)
      }
    }
  }

  destroy() {
    clearTimeout(this.timeId)
    this.loop = false
    this.fn = null
    this.options = {}
  }
}
