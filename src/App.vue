<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
// import Main from "./views/Main.vue";
</script>

<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Hello Vue 3 + TypeScript + Vite" /> -->
  <router-view />
  <!-- <main></main> -->
</template>

<style>
@import "./assets/css/index.scss";
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  max-height: 100vh;
  max-width: 100vw;
  min-height: 400px;
  min-width: 900px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
*:focus {
  outline: none;
}
.el-popover {
  width: auto !important;
}
.el-button:focus,
.el-button:hover {
  border-color: inherit !important;
  color: #fff !important;
  background-color: #7371fc;
}
.el-select .el-select-tags-wrapper.has-prefix {
  display: flex;
  overflow-x: auto;
}

.el-table__inner-wrapper {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.el-button.is-disabled,
.el-button.is-disabled:focus,
.el-button.is-disabled:hover {
  color: var(--el-button-disabled-text-color) !important;
  cursor: not-allowed;
  background-image: none;
  background-color: var(--el-button-disabled-bg-color) !important;
  border-color: var(--el-button-disabled-border-color) !important;
}
</style>
