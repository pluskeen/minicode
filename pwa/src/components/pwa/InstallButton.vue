<template>
  <div>
    <!-- 安卓安装按钮 -->
    <button v-if="showInstallButton" @click="installPWA">添加到主屏幕</button>

    <!-- iOS 提示框 -->
    <div v-if="showIOSPrompt" class="ios-prompt">
      <p>点击分享按钮，然后选择“添加到主屏幕”以安装此应用。</p>
      <button @click="closeIOSPrompt">关闭</button>
    </div>

    <!-- 不支持 提示框 -->
    <div v-if="showNoSupportedPrompt" class="no-supported-prompt">
      <p>该设备不支持 PWA 安装</p>
      <button @click="closeNoSupportedPrompt">关闭</button>
    </div>
  </div>
</template>

<script setup lang="js">
import { pwaInfo } from 'virtual:pwa-info'
import { onMounted, ref } from 'vue'
import { isAddedToHomeScreen, isPWAInstallSupported, requiresManualInstall } from './utils'

let deferredPrompt = null
const showInstallButton = ref(false)
const showIOSPrompt = ref(false)
const showNoSupportedPrompt = ref(false)

onMounted(() => {
  setupPWAInstall()

  console.log(pwaInfo)
})

const setupPWAInstall = () => {
  if (isAddedToHomeScreen()) {
    // alert('已添加到主屏幕')
  } else {
    if (isPWAInstallSupported()) {
      console.log('支持 PWA 安装，显示安装按钮')
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    } else if (requiresManualInstall()) {
      console.log('需要手动添加到主屏幕，显示 iOS 提示')
      showIOSPrompt.value = true
    } else {
      console.log('当前设备不支持 PWA 安装')
      showNoSupportedPrompt.value = true
    }
  }
}

const handleBeforeInstallPrompt = (event) => {
  event.preventDefault()
  deferredPrompt = event
  showInstallButton.value = true
}

const installPWA = () => {
  if (deferredPrompt) {
    deferredPrompt.prompt()
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('用户同意安装')
      } else {
        console.log('用户拒绝安装')
      }
      deferredPrompt = null
      showInstallButton.value = false
    })
  }
}
const closeIOSPrompt = () => {
  showIOSPrompt.value = false
}

const closeNoSupportedPrompt = () => {
  showNoSupportedPrompt.value = false
}
</script>

<style scoped>
.ios-prompt,
.no-supported-prompt {
  position: fixed;
  bottom: 20px;
  left: 20px;
  right: 20px;
  background: #fff;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}
</style>
