/**
 * 虚拟列表
 * 异步列表元素
 * 本例使用图片 + 文字的形式作为列表元素，图片为外部链接
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
    // 图片 API
    const imgBaseUrl = 'http://iph.href.lu/' // e.g. http://iph.href.lu/[width]x[height]

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
        // ob 属性 -> 列表元素实际尺寸是否被记录
        listData.value = deepClone(props.data).map(c => ({...c, height: estimatedItemHeight, ob: false}))
        // 更新占位容器高度
        updateContentHeight()
      }
    })

    onMounted(() => {
      // 首次渲染预设高度进行计算展示数量
      visibleCount = Math.ceil(listRef.value.clientHeight / estimatedItemHeight) + props.bufferSize
      updateVisibleData()
    })

    const resizeObserver = new ResizeObserver((entries, observer) => {
      for (const entry of entries) {
        if (entry.contentRect) {
          // 屏幕中展示的列表元素的索引
          const index = entry.target.dataset.index
          // 使用默认的高度做判断，必须在 DOM 上
          if (!listData.value[index].ob && listData.value[index].height === estimatedItemHeight && entry.target.isConnected) {
            listData.value[index].height = entry.contentRect.height
            throttledUpdateContentHeight()
          } else {
            observer.unobserve(entry.target)
            listData.value[index].ob = true
          }
          // console.log(listData.value[index]);
          // console.log(entry.contentRect);
        }
      }
    });

    const handleScroll = () => {
      const scrollTop = listRef.value.scrollTop;
      updateVisibleData(scrollTop);
    }

    // 更新列表元素高度，和占位容器高度
    const updateListItemHeight = (data) => {
      const value = isRef(data) ? data.value : data
      if (!!value && Object.prototype.toString.call(value) === '[object Array]' && value.length) {
        value.forEach(c => {
          resizeObserver.observe(c)
        })
        // console.log(value)
        // console.log(listData.value)
      }
    }

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

      // updateListItemHeight(itemsRef)
    }

    // 生成图片地址
    const genImgUrl = (item) => {
      return `${imgBaseUrl}${item.imgWidth}x${item.imgHeight}`
    }

    // 更新占位容器高度
    // 该函数会遍历大数组，开销很大
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

    // 节流，在设定的时间内，只执行一次，设定的时间内重复执行不会导致重新计时。
    // fn 被节流函数
    // delay 延时时间
    const throttled = (fn, delay) => {
      let timer = null
      let reTime = Date.now()

      return function() {
        const args = arguments
        const context = this
        // 被节流函数，当前触发时间
        const currTime = Date.now()
        const remaining = delay - (currTime - reTime)

        clearTimeout(timer)
        if (remaining <= 0) {
          fn.apply(context, args)
          reTime = currTime
        } else {
          timer = setTimeout(() => {
            fn.apply(context, args)
            reTime = currTime
          }, remaining)
        }
      }
    }

    const throttledUpdateContentHeight = throttled(updateContentHeight, 300)

    return {
      contentRef,
      listRef,
      itemsRef,
      visibleData,
      contentHeight,
      imgBaseUrl,
      handleScroll,
      genImgUrl
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
        >
          {{ item.index }} - {{ item.label }} - {{ item.value }}
          <img style="display: block;" :src="genImgUrl(item)" :alt="item.imgWidth + ' x' + item.imgHeight">
        </div>
      </div>
      </div>
    `
}
