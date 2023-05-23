import axios from './node_modules/axios/dist/esm/axios.min.js';
import {jsonToUnderline} from './utils.js'

// 默认请求基址
const BASE_URL = 'https://api.artic.edu/api/v1'
// 默认头信息
const HEADERS = {
  'Cache-Control': 'no-cache',
  Pragma: 'no-cache'
}

const http = axios.create({
  baseURL: BASE_URL,
  headers: HEADERS
})

// 对请求错误做些什么
const requestErr = (error) => {
  // todo stop loading...
  return Promise.reject(error)
}

// request interceptor
http.interceptors.request.use(config => {
  const finalConfig = requestConfigHande(config)

  // 是否隐藏加载框
  if (!finalConfig.hideLoading) {
    // todo start loading...
  }

  // 判断是否有错误
  const err = requestConfigValid(finalConfig)

  if (err) {
    const error = new Error(err.message)
    // 适配 msg 与 message 字段
    error.msg = error.message

    if (err.status === 403) {
      // todo do something...
    }
    // todo stop loading...
    throw error
  }

  // 请求参数由驼峰山转化为下划线
  if (finalConfig.isFormatData) {
    // 适用 'PUT', 'POST', 'DELETE 和 'PATCH' 请求方法
    jsonToUnderline(finalConfig.data)
    // 适用 'GET' 请求方法
    jsonToUnderline(finalConfig.params)
  }

  // 设置重试次数
  // config.retryTimes = 5
  console.log(finalConfig)
  return finalConfig
}, requestErr)

// response interceptor
// service.interceptors.response.use((response) => {
//   store.getters.showHttpProgress && NProgress.done()
//
//   // console.log(response)
//   if (response.data instanceof Blob) {
//     return response.data
//   } else {
//     // response.data.code = 0 为正常
//     if (Number(response.data.code) !== EResponseCode.Normal) {
//       return ResponseCodeErr(response)
//     } else {
//       // 埋点信息，上报
//       // console.log(response.config.trackInfo)
//       // console.log(response.config)
//       fetchTrack(response.config, {logResult: ResSuccess})
//
//       // 返回 .data 即可
//       return response.data.data
//     }
//   }
// }, ResponseErr)

// request config handle
const requestConfigHande = config => {
  const defaultOptions = {
    // 请求超时毫秒数，默认值是 `0` (永不超时)
    timeout: 30000,
    // 请求接口时默认需要 cookie 认证，当请求接口不需要 cookie 认证时, 需设置 options 中的 isAuth 设置为 false
    needAuth: true,
    // 请求接口时默认展示 loading 加载框，当需要隐藏 loading 加载框时, 需设置 options 中的 hideLoading 设置为 true
    hideLoading: false,
    // 请求返回 data 的是否为原始结构的数据，true 表示不需要拦截器处理
    native: false,
    // 是否忽略响应拦截器的处理
    isIgnoreResponseInterceptor: false,
    // 表示跨域请求时是否需要使用凭证
    withCredentials: true,
    // 是否将下划线格式的数据转化为驼峰式，true 表示将 xi_an -> xiAn，属性原本就是驼峰格式无影响
    isFormatData: false
  }

  // 请求基址
  // 下载本地文件，判断 url 中是否存在特定的字符串，以识别本地下载请求
  if (config.url.indexOf('files/') > -1 && config.responseType === 'blob') {
    config.baseURL = ''
  } else {
    config.baseURL = !!config.baseURL ? config.baseURL : BASE_URL
  }

  if (!config.headers) {
    config.headers = HEADERS
  }

  // [没有配置 needAuth]|| ([有配置 needAuth] && [needAuth === true])
  // 判断为真，则需要在 headers 中加入 token
  // 常见的是放置在 cookie、Authorization 等属性中
  if (!Reflect.has(config, 'needAuth') || (Reflect.has(config, 'needAuth') && config.needAuth)) {
    const token = 'some way get token...'
    config.headers = {...config.headers, ...{'Authorization': `${token}`}}
  }

  // 最终拼装的请求参数
  return {
    ...defaultOptions,
    ...config,
  }
}

// 请求参数中是否存在错误
// status 值可枚举化
const requestConfigValid = config => {
  // console.log(config)
  if (config) {
    if (config.url.indexOf('../') > -1) {
      return {status: 422, message: '请求链接中不能带有 ../ 字符串'}
    }

    if (config.needAuth && !config.headers.Authorization) {
      return {status: 403, message: '请求中断，未获取到 token 信息'}
    }
  }
}

export default http
