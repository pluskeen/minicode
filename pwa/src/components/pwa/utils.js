/**
 * 检测设备类型
 */

// 检测是否为 iOS 设备
function isIOS() {
  return (
    (/iPad|iPhone|iPod/.test(navigator.platform) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) && // 检测 M1 iPad
    !window.MSStream
  ) // 排除 IE/Edge
}

// 检测是否为 Android 设备
function isAndroid() {
  return /Android/.test(navigator.userAgent)
}

// 检测是否为桌面设备
function isDesktop() {
  return !isIOS() && !isAndroid()
}

// 检测是否为移动设备
function isMobile() {
  return isIOS() || isAndroid()
}

// 是否 PWA 环境
export function isPwa() {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches
  const isFullscreen = window.matchMedia('(display-mode: fullscreen)').matches
  const isMinimalUi = window.matchMedia('(display-mode: minimal-ui)').matches
  const isIOSStandalone = window.navigator.standalone
  const isEmptyRefferrer = document.referrer === ''

  let hasPWATag = false
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.get('pwa') === 'true') {
    // alert('当前页面是以 PWA 模式启动的')
    hasPWATag = true
  }

  // alert(`isStandalone: ${isStandalone}`)
  // alert(`isFullscreen: ${isFullscreen}`)
  // alert(`isMinimalUi: ${isMinimalUi}`)
  // alert(`isIOSStandalone: ${isIOSStandalone}`)
  // alert(`isEmptyRefferrer: ${isEmptyRefferrer}`)
  // alert(`document.referrer: /${document.referrer}/`)

  return (
    isStandalone || isFullscreen || isMinimalUi || isIOSStandalone || isEmptyRefferrer || hasPWATag
  )
}

const isInStandaloneMode = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  window.navigator.standalone ||
  document.referrer.includes('android-app://')

if (isInStandaloneMode()) {
  console.log('webapp is installed')
}

// 检测是否为 Safari 浏览器
// function isSafari() {
//   return /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
// }

// 检测是否为 Chrome 浏览器
// function isChrome() {
//   return /Chrome/.test(navigator.userAgent) && !/Edg/.test(navigator.userAgent)
// }

// 检测是否为 Firefox 浏览器
// function isFirefox() {
//   return /Firefox/.test(navigator.userAgent)
// }

// 检测是否为 Edge 浏览器
// function isEdge() {
//   return /Edg/.test(navigator.userAgent)
// }

// 检测是否支持 PWA 安装（beforeinstallprompt 事件）
function supportsPWAInstall() {
  return 'onbeforeinstallprompt' in window
}

// 检测是否已添加到主屏幕
export function isAddedToHomeScreen() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    window.navigator.standalone === true // iOS 检测
  )
}

// 是否为支持 PWA 安装的设备
export function isPWAInstallSupported() {
  return isAndroid() || (isDesktop() && supportsPWAInstall())
}

// 是否为需要手动添加到主屏幕的设备（如 iOS）
export function requiresManualInstall() {
  return isIOS() && isMobile()
}
