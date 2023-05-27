import eventBus from "./eventBus.js";
import {onMounted, defineComponent, ref} from '../node_modules/vue/dist/vue.esm-browser.prod.js'

export default defineComponent({
  setup() {
    let msg = ref('')

    onMounted(() => {
      eventBus.on("getA", (msgFromA) => {
        // A发送来的消息
        msg.value = msgFromA;
      });
    })

    const sendMsg = () => {
      eventBus.emit("getB", '来自B页面的消息')
    }

    return {
      msg,
      sendMsg
    }
  },
  template:
    `
      <button @click="sendMsg()">向 A 发送信息</button>
      <div>接受到 A 的信息：{{ msg }}</div>
    `
})
