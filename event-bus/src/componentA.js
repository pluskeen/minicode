import eventBus from "./eventBus.js";
import {ref, onMounted, defineComponent} from '../node_modules/vue/dist/vue.esm-browser.prod.js'

export default defineComponent({
  setup() {
    const sendMsg = () => {
      eventBus.emit("getA", '来自A页面的消息')
    }

    let msg = ref('')

    onMounted(() => {
      eventBus.on("getB", (msgFromB) => {
        // B发送来的消息
        msg.value = msgFromB;
      })
    })


    return {
      sendMsg,
      msg
    }
  },
  template:
    `
      <button @click="sendMsg()">向 B 发送信息</button>
      <div>接受到 B 的信息：{{ msg }}</div>
    `
})
