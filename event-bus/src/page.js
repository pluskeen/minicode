import {defineComponent} from '../node_modules/vue/dist/vue.esm-browser.prod.js'
import ComponentA from "./componentA.js";
import ComponentB from "./componentB.js";

export default defineComponent({
  components: {ComponentA, ComponentB},
  template:
    `
      <component-a></component-a>
      <component-b></component-b>
    `
})
