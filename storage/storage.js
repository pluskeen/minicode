class Storage {
  options = {}

  static defaultOptions = {
    // 可选 sessionStorage 或者 localStorage
    method: 'sessionStorage',
    // 默认有效期是 2 小时，单位秒
    expire: 2 * 60 * 60,
    // 自动给 key 加的前缀
    // 例：前缀是 prod，key 是 abc，生成 prod_abc
    prefix: ''
  }

  constructor(options) {
    if (!!options && Object.prototype.toString.call(options) === '[object Object]') {
      if (options.expire) {
        if (!Number.isInteger(options.expire)) {
          throw new Error('expire must be the Integer');
        }
        if (options.expire < 0) {
          throw new Error('expire must be greater than 0');
        }
      }

      this.options = {...Storage.defaultOptions, ...options}
    } else {
      this.options = Storage.defaultOptions
    }
  }

  /**
   * 在本地缓存中存储数据
   * @param key 本地缓存的 key
   * @param value 需要存储的内容
   * @param expire 有效期，单位秒，不设置就使用全局配置
   */
  set(key, value, expire) {
    if (value === '' || value == null) {
      value = null;
    }

    const entity = {
      timestamp: this.timestamp,
      expire: (expire ? expire : this.options.expire) * 1000, // 换算成毫秒
      key: this.autoAddPrefix(key),
      value,
    }

    window[this.options.method].setItem(key, JSON.stringify(entity))
    return this
  }

  /**
   * 从本地缓存中获取指定 key 的数据
   * @param key 本地缓存的 key
   */
  get(key) {
    let entity
    try {
      entity = window[this.options.method].getItem(this.autoAddPrefix(key))
      if (entity) {
        entity = JSON.parse(entity)
        // 未过期期间被调用 则自动续期 进行保活
        // this.set(key, entity.value, entity.expire)
      } else {
        return null
      }
    } catch (err) {
      console.error(`Storage 获取缓存失败 ${key} `, err)
      return null
    }

    // 已过期
    if (this.isExpired(entity)) {
      this.remove(key)
      return null
    }
    return entity.value
  }

  /**
   * 从本地缓存中删除指定 key 的值
   * @param key 本地缓存中 key
   */
  remove(key) {
    try {
      window[this.options.method].removeItem(this.autoAddPrefix(key))
    } catch (err) {
      console.error(`Storage 删除缓存失败 ${key} `, err)
    }
    return this
  }

  /** 清除所有本地缓存的数据 */
  clear() {
    try {
      window[this.options.method].clear()
    } catch (err) {
      console.error(`Storage 清除所有缓存失败 `, err)
    }
    return this
  }

  /** 是否存在 key 的缓存 */
  hasStorage(key) {
    key = this.autoAddPrefix(key);
    const item = this.getStorageAll().find(item => item.key === key)
    return !!item
  };

  /** 获取所有 key */
  getStorageKeys = () => {
    let items = this.getStorageAll();
    let keys = [];
    for (let i = 0; i < items.length; i++) {
      keys.push(items[i].key);
    }
    return keys;
  };

  /** 根据索引获取 key */
  getItemForIndex(index) {
    // index 默认 0
    return window[this.options.method].key(index)
  };

  /** 获取全部缓存 */
  getStorageAll() {
    let arr = [] // 定义数据集
    const expiredKeys = [] // 过期的缓存 key

    for (let i = 0; i < this.length; i++) {
      // 从索引 0 开始，获取 key
      const key = window[this.options.method].key(i)
      const originKey = this.autoRemovePrefix(key)
      // 获取 key 对应的值
      const entity = JSON.parse(window[this.options.method].getItem(key))
      if (this.isExpired(entity)) {
        expiredKeys.push(key)
      } else {
        let getVal = entity.value;
        if (this.isJson(getVal)) {
          getVal = JSON.parse(getVal)
        }
        // 放进数组
        arr.push({key: originKey, val: JSON.parse(getVal)});
      }
    }

    for (const key of expiredKeys) {
      this.remove(key)
    }
    return arr;
  };


  get length() {
    return window[this.options.method].length
  }

  // 当前时间，单位毫秒
  get timestamp() {
    return new Date().getTime()
  }

  isExpired(entity) {
    if (!entity) return true;
    // 当前时间点 - （缓存创建的时间 + 缓存有效期）
    return this.timestamp - (entity.timestamp + entity.expire) >= 0
  }

  // 名称前自动添加前缀
  autoAddPrefix(key) {
    const prefix = this.options.prefix ? this.options.prefix + '_' : '';
    return prefix + key;
  }

  // 移除已添加的前缀
  autoRemovePrefix(key) {
    const len = this.options.prefix ? this.options.prefix.length + 1 : '';
    return key.substring(len);
  }

  // 判断是否可用 JSON.parse
  isJson(value) {
    if (Object.prototype.toString.call(value) === '[object String]') {
      try {
        const obj = JSON.parse(value);
        const objType = Object.prototype.toString.call(obj);
        return objType === '[object Object]' || objType === '[object Array]';
      } catch (err) {
        return false;
      }
    }
    return false;
  }
}
