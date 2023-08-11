interface IOptions {
  /** 是否立即执行 */
  immediately: boolean;
  /** 轮询函数需要的入参 */
  params: any[];
  /** 轮询间隔时间，单位秒 */
  delayTime: number;
  /** 上下文 */
  ctx: any;
}

class Options {
  immediately: false;
  params: [];
  delayTime: 5;
  ctx: this;
}

export class PollFetch {
  private defaultOptions = new Options();

  private options: IOptions;
  private fn: (...args: any[]) => any;
  private loop = true;
  private timeId = 0;

  constructor(fn: (...args: any[]) => any, options?: IOptions) {
    if (typeof fn !== 'function') {
      throw new Error(`PollFetch: first parameter must be the Function`);
    }
    if (!!options && Object.prototype.toString.call(options) === '[object Object]') {
      this.options = {...this.defaultOptions, ...options};
    } else {
      this.options = this.defaultOptions;
    }
    this.fn = this.generateNewFn(fn, this.options);
  }

  generateNewFn(fn: () => void | any, options: IOptions) {
    const {params} = options;
    // 存在 params
    if (!!params) {
      if (Array.isArray(params)) {
        // @ts-ignore
        return fn.bind(this.options.ctx, ...this.options.params);
      }else {
        throw new Error('PollFetch: params type should be the Array');
      }
    } else {
      return fn;
    }
  }

  timeoutPromise() {
    return new Promise(resolve => {
      this.timeId = setTimeout(resolve, this.options.delayTime * 1000);
    });
  }

  syncPromise() {
    return Promise.resolve(this.fn());
  }

  async exec() {
    if (this.options.immediately) {
      await this.syncPromise();
    }

    while (this.loop) {
      try {
        await this.timeoutPromise();
        await this.syncPromise();
      } catch (err) {
        this.loop = false;
        await Promise.reject(err);
      }
    }
  }

  destroy() {
    clearTimeout(this.timeId);
    this.loop = false;
    this.fn = () => {};
    this.options = this.defaultOptions;
  }
}
