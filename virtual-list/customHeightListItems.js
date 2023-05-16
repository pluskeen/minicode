/**
 * 虚拟列表
 * 列表元素自定义高度
 * 先给每个列表元素预设高度，实际展示后更新其实际高度
 */

import {ref, watch, onMounted, nextTick, onBeforeMount, isRef} from './node_modules/vue/dist/vue.esm-browser.prod.js'
import {data} from './visibleData.js'

export default {
  props: {
    data: {
      type: Array,
      default: data
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
    let itemsRef = ref()
    // 预设列表元素组件高度
    let estimatedItemHeight = 30
    // 将 props.data 复制到此变量
    let listData = ref([])
    // 占位组件的高度
    let contentHeight = ref('')
    // 可见区域的列表元素数量 + 缓存区域列表元素数量
    let visibleCount = 0

    // 动态获取元素的高度
    watch(contentRef, async (value) => {
      await nextTick()
      console.log('contentRef高度', !!value ? value.clientHeight : 0)
    })

    watch(itemsRef, async (value) => {
      await nextTick()
      updateListItemHeight(value)
    }, {deep: true})

    onBeforeMount(() => {
      // 将 props.data 复制，并添加预设高度
      if (!!props.data && Array.isArray(props.data) && props.data.length) {
        listData.value = deepClone(props.data).map(c => ({...c, height: estimatedItemHeight}))
        // 更新占位容器高度
        updateContentHeight()
      }
    })

    onMounted(() => {
      // console.dir(contentRef.value.clientHeight)
      // console.dir(listRef.value)

      // 首次渲染预设高度进行计算展示数量
      visibleCount = Math.ceil(listRef.value.clientHeight / estimatedItemHeight) + props.bufferSize
      updateVisibleData()
    })

    const updateVisibleData = (scrollTop) => {
      scrollTop = scrollTop || 0;
      // 取得可见区域的起始数据索引
      const start = findNearestItemIndex(scrollTop)
      // 取得可见区域的结束数据索引
      const end = findNearestItemIndex(scrollTop + listRef.value.clientHeight) + visibleCount
      // 计算出可见区域对应的数据，让 Vue.js 更新
      visibleData.value = listData.value.slice(start, Math.min(end + 1, listData.value.length));
      // 把可见区域的 top 设置为起始元素在整个列表中的位置（使用 transform 是为了更好的性能）
      contentRef.value.style.transform = `translate3d(0, ${getItemSizeAndOffset(start).offset}px, 0)`;

      // console.log(itemsRef.value)
      // updateListItemHeight(itemsRef)
    }

    const handleScroll = () => {
      const scrollTop = listRef.value.scrollTop;
      updateVisibleData(scrollTop);
    }

    // 更新列表元素高度，和占位容器高度
    const updateListItemHeight = (data) => {
      const value = isRef(data) ? data.value : data
      if (!!value && Object.prototype.toString.call(value) === '[object Array]' && value.length) {
        value.forEach(c => {
          listData.value[c.dataset.index].height = c.clientHeight
        })

        updateContentHeight()
      }
    }

    // 更新占位容器高度
    const updateContentHeight = () => {
      contentHeight.value = listData.value.reduce((p, c) => p + c.height, 0) + 'px'
    }

    // 通过 scrollTop 计算出可视区域 起始/结束 元素位置索引
    const findNearestItemIndex = (scrollTop) => {
      let total = 0;
      for (let i = 0, j = listData.value.length; i < j; i++) {
        const size = listData.value[i].height;
        total += size;
        if (total >= scrollTop || i === j - 1) {
          return i;
        }
      }

      return 0;
    }

    // 某列表项在列表中的 Y 轴偏移
    const getItemSizeAndOffset = (index) => {
      let total = 0;
      for (let i = 0, j = Math.min(index, listData.value.length - 1); i <= j; i++) {
        const size = listData.value[i].height

        if (i === j) {
          return {
            offset: total,
            size
          };
        }
        total += size;
      }

      return {
        offset: 0,
        size: 0
      };
    }

    // 深拷贝
    const deepClone = (obj) => {
      if (!(obj && typeof obj === 'object')) {
        return obj;
      }

      const clone = Array.isArray(obj) ? [] : {};

      Object.keys(obj).forEach((key) => {
        if (typeof obj[key] === 'object' && Object.prototype.toString.call(obj[key]) !== '[object Date]') {
          clone[key] = deepClone(obj[key]);
        } else {
          clone[key] = obj[key];
        }
      });

      return clone;
    }

    return {
      contentRef,
      listRef,
      itemsRef,
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
        <!-- 使用 dataset 给列表元素加唯一索引 -->
        <div ref="itemsRef" v-for="item in visibleData" :key="item.index" class="list-view-item"
             :data-index="item.index"
             :style="{height: item.value + 'px'}"
        >
          {{ item.index }} - {{ item.label }} - {{ item.value }}
        </div>
      </div>
      </div>
    `
}
