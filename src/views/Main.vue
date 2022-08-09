<script lang="ts" setup>
import HeaderWidget from "../components/common/Header.vue";
import Header from "../entity/Header";
import { ref } from "vue";
const header = ref(
  new Header({
    title: "本地git项目管理平台",
  })
);
</script>

<template>
  <header-widget ref="root" :header="header"></header-widget>
  <div class="main-content">
    <div class="menu-content"></div>
    <div class="show-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main-content {
  flex: 1;
  display: flex;
  align-items: stretch;
  overflow: hidden;
  .menu-content {
    max-width: 200px;
    overflow: auto;
    // background-color: #f5f5f5;
  }
  .show-content {
    flex: 1;
    overflow: hidden;
  }
}
</style>
