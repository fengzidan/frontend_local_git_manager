<template>
  <div ref="container" class="waterfull-widget">
    <div class="waterfull-main">
      <div class="waterfull-item" ref="waterItem" v-for="(item, idx) in data" :key="idx">
        <component :is="type" :data="item"> </component>
      </div>
    </div>
  </div>
</template>

<script>
import defaultItem from "./components/defaultItem";
import { addEventListener } from "@/utils/tool";
export default {
  name: "waterfull-widget",
  data() {
    return {
      resizeHandler: null,
    };
  },
  props: {
    data: {
      default: () => {
        return [];
      },
    },
    config: {
      default: () => {
        return {};
      },
    },
  },
  components: {
    defaultItem,
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.waterFull();
        this.resizeHandler = addEventListener(window, "resize", this.waterFull);
      }, 100);
    });
  },
  methods: {
    // 瀑布流方法
    waterFull() {
      var itemBox = this.$refs.container;
      var items = this.$refs.waterItem;
      var itemBoxW = itemBox.offsetWidth;
      var itemW = items[0].offsetWidth;
      var column = parseInt(itemBoxW / itemW);
      var distence = (itemBoxW - itemW * column) / (column - 1);
      var arr = [];
      // 获取数组的最小值以及索引
      function getMin(arr) {
        var obj = {};
        obj.minV = arr[0];
        obj.minI = 0;
        for (var i = 1; i < arr.length; i++) {
          if (obj.minV > arr[i]) {
            obj.minV = arr[i];
            obj.minI = i;
          }
        }
        return obj;
      }
      for (var i = 0; i < items.length; i++) {
        if (i < column) {
          items[i].style.left = (itemW + distence) * i + "px";
          arr[i] = items[i].offsetHeight;
          // console.log(arr);
        } else {
          var minV = getMin(arr).minV;
          var minI = getMin(arr).minI;
          items[i].style.left = (itemW + distence) * minI + "px";
          items[i].style.top = minV + distence + "px";
          arr[minI] = minV + distence + items[i].offsetHeight;
        }
      }
    },
  },
  computed: {
    type() {
      return this.config.type.toLowerCase() || "defaultItem";
    },
  },
  watch: {},
  destroyed() {
    this.resizeHandler.remove();
  },
};
</script>

<style lang="scss" scoped>
.waterfull-widget {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  .waterfull-main {
    width: 100%;
    margin: 0 auto;
    position: relative;
  }

  .waterfull-item {
    width: 19%;
    position: absolute;
    background-color: #fff;
    border-radius: 4px;
    // transition: box-shadow 1s,top left 0s;
    transition: 0.2s;
    top: 0;
    left: 0;
  }
  .waterfull-end {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background-color: #efefef;
  }
}
</style>
