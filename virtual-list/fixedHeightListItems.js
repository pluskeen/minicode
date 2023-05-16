/**
 * 虚拟列表
 * 列表元素固定高度
 */

import {ref, computed, watch, onMounted, nextTick} from './node_modules/vue/dist/vue.esm-browser.prod.js'
import {data} from './visibleData.js'

export default {
  props: {
    data: {
      type: Array,
      default: data
    },
    // 列表元素的高度
    itemHeight: {
      type: Number,
      default: 30
    },
    // 缓冲多少列表元素
    bufferSize: {
      type: Number,
      default: 5
    }
  },
  setup(props) {
    let visibleData = ref([])
    // 组件元素
    let contentRef = ref()
    let listRef = ref()
    // 占位组件的高度。computed 返回一个只读的响应式 ref 对象
    let contentHeight = computed(() => props.data.length * props.itemHeight + 'px')
    // 可见区域的列表元素数量 + 缓存区域列表元素数量
    let visibleCount = 0

    // 动态获取元素的高度
    watch(contentRef, async (value) => {
      await nextTick()
      console.log('contentRef高度', !!value ? value.clientHeight : 0)
    })

    onMounted(() => {
      // console.dir(contentRef.value)
      // console.dir(listRef.value)

      visibleCount = Math.ceil(listRef.value.clientHeight / props.itemHeight) + props.bufferSize
      updateVisibleData()
    })

    const updateVisibleData = (scrollTop) => {
      scrollTop = scrollTop || 0;

      // 取得可见区域的起始数据索引
      const start = Math.floor(scrollTop / props.itemHeight);
      // 取得可见区域的结束数据索引
      const end = start + visibleCount;
      // 计算出可见区域对应的数据，让 Vue.js 更新
      visibleData.value = props.data.slice(start, end);
      // 把可见区域的 top 设置为起始元素在整个列表中的位置（使用 transform 是为了更好的性能）
      contentRef.value.style.transform = `translate3d(0, ${start * props.itemHeight}px, 0)`;
    }

    const handleScroll = () => {
      const scrollTop = listRef.value.scrollTop;
      updateVisibleData(scrollTop);
    }

    return {
      contentRef,
      listRef,
      visibleData,
      contentHeight,
      handleScroll
    }
  },
  template:
    `
      <div ref="listRef" class="list-view" @scroll="handleScroll">
      <div class="list-view-phantom" :style="{height: contentHeight}"></div>
      <div ref="contentRef" class="list-view-content">
        <div class="list-view-item" :style="{height: itemHeight + 'px'}" v-for="item in visibleData">
          {{ item.index }} - {{ item.label }} - {{ item.value }}
        </div>
      </div>
      </div>
    `
}
