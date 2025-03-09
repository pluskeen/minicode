<script setup>
import { onMounted, ref } from 'vue'

const lastFrameUrl = '/src/assets/animate/1_00011.png'
const checkGifUrl = '/src/assets/check.gif'
const audioUrl = '/src/assets/sound.wav'

const isCheck = ref(false)
const playEnd = ref(false)

let audioEL = null

const checkLoad = () => {
  const gifDuration = 700

  // 设置一个定时器，在播放结束后停止 GIF
  setTimeout(function () {
    playEnd.value = true
  }, gifDuration)
}

const clickBtn = () => {
  isCheck.value = true
  if (isCheck.value) {
    audioEL && audioEL.play()
    playEnd.value = false
  }
}

const preloadImage = (url) => {
  const img = new Image()
  img.src = url
}

const preloadAudio = (url) => {
  audioEL = new Audio()
  audioEL.src = url
}

onMounted(() => {
  preloadImage(checkGifUrl)
  preloadAudio(audioUrl)
})
</script>

<template>
  <audio id="sound" src="/path/to/your-sound-file.mp3"></audio>
  <button :disabled="isCheck" @click="clickBtn">
    <span v-if="!isCheck">click me</span>
    <img v-if="isCheck && !playEnd" id="gif" :src="checkGifUrl" @load="checkLoad" alt="GIF Image" />
    <img v-show="playEnd" id="gif" :src="lastFrameUrl" alt="GIF Image" />
  </button>
</template>

<style scoped>
button:active {
  background-color: aqua;
}

#sound {
  width: 0;
  height: 0;
}

img {
  display: block;
  width: 50px;
  height: 50px;
}
</style>
