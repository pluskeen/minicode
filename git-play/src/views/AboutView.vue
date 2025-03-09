<script setup>
import { onMounted, ref, nextTick } from 'vue'
import SuperGif from 'libgif'

const gifImage = new URL('/src/assets/check.gif', import.meta.url).href

const gifElement = ref(null)

const isCheck = ref(false)

let gifSuper = null

const clickBtn = () => {
  isCheck.value = true

  if (isCheck.value) {
    superGifInit()

    // gifSuper 初始化完成，&& 图片 load 完成
    if (gifSuper && !gifSuper.get_loading()) {
      gifSuper.move_to(0)
      gifSuper.play()
    }
  }
}

const superGifInit = () => {
  nextTick(() => {
    console.log(gifSuper && gifSuper.get_loading())
    if (!gifSuper) {
      gifSuper = new SuperGif({
        gif: gifElement.value,
        progressbar_height: 0,
        loop_mode: false,
        rubbable: true,
        auto_play: false,
      })

      // 加载 GIF
      gifSuper.load(() => {
        console.log('GIF 加载完成')
        // 开始播放 GIF
        gifSuper.play()
      })
    }
  })
}

onMounted(() => {})
</script>

<template>
  <button class="about" @click="clickBtn">
    <span v-if="!isCheck">click me</span>
    <img
      v-show="isCheck"
      ref="gifElement"
      :src="gifImage"
      alt="GIF Image"
      :rel:animated_src="gifImage"
      width="36"
      height="36"
    />
  </button>
</template>

<style>
img {
  max-width: 100%;
  height: auto;
}
</style>
