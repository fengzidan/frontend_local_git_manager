<template>
  <div class="header-widget">
    <div class="main-content">
      <div v-if="header.logo" class="logo">{{ header.logo }}</div>
      <div class="title">{{ header.title }}</div>
    </div>
    <div class="info-content">
      <div v-if="header.showUser" class="info-item user-content">
        <img class="user-portrait" :src="user.portrait" />
        <div class="user-info">{{ user.name }}</div>
      </div>
      <div v-if="header.showCtrl" class="info-item system-content">
        <!-- <icon-ctrl-widget
          class="control-item"
          v-for="ctrlItem in header.sysControl"
          :key="ctrlItem.id"
          :ctrl-item="ctrlItem"
        >
        </icon-ctrl-widget> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "@vue/runtime-core";
import Header from "../../entity/Header";
// import IconCtrlWidget from "../CtrlWidget/IconCtrlWidget.vue";
const props = defineProps({
  header: {
    type: Header,
    default: () => {
      return new Header({ title: '' });
    },
  },
});

const emit = defineEmits(["change", "delete"]);
const user = computed(() => props.header.user);
</script>

<style lang="scss" scoped>
.header-widget {
  width: 100%;
  height: 6vh;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2vw;
  box-shadow: 0 0 5px 0 #ddd;
  background-color: #141b41;
  color: #98b9f2;
  .main-content {
    flex: 1;
    display: flex;
    align-items: center;
    .logo + .title {
      margin-left: 1vw;
    }
    .title {
      font-weight: bold;
      font-size: 1.3rem;
    }
  }
  .info-content {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .info-item {
      display: flex;
      align-items: center;
      justify-content: space-around;
      & + .info-item {
        margin-left: 1vw;
      }
    }
    .user-content {
      img {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        margin-right: 0.5vw;
        border: 1px solid #ddd;
      }
    }
  }
}
</style>
