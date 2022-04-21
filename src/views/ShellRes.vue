<script lang="ts" setup>
defineProps({
  shell: {
    type: String,
    default: "",
  },
  result: {
    type: String,
    default: "",
  },
});
</script>

<template>
  <div class="shell-content">
    <div class="shell-item shell-span">
      <div class="label">命令</div>
      <highlightjs
        class="shell-highlight"
        autodetect
        :code="shell"
      ></highlightjs>
    </div>
    <div class="shell-item shell-result">
      <div class="label">结果</div>
      <highlightjs
        class="shell-highlight"
        autodetect
        :code="result"
      ></highlightjs>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.shell-content {
  min-width: 20vw;
  max-width: 60vw;
  max-height: 80vh;
}
.shell-item {
  text-align: left;
  display: flex;
  width: 100%;
  .label {
    font-size: 0.9rem;
    line-height: 1.5;
    padding: 1em;
    width: auto;
  }
  .shell-highlight {
    text-align: left;
    flex: 1;
    border-radius: 2px;
    margin-left: 8px;
    overflow: auto;
    :deep(code) {
      width: 100%;
      border-radius: 4px;
      font-size: 0.9rem;
      line-height: 1.5;
    }
  }
  & + .shell-item {
    margin-top: 1vh;
  }
}
</style>
