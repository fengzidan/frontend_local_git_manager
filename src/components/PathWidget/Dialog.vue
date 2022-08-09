<script lang="ts" setup>
import PathWidget from "./index.vue";

const props = defineProps({
  choosing: {
    default: false,
  },
});
const emits = defineEmits(["confirm"]);
function choosePath(curPathObj: { path: string; data: Array<any> }) {
  emits("confirm", curPathObj);
}
</script>

<template>
  <el-dialog
    title="选择地址"
    width="70vw"
    top="5vh"
    v-model="choosing"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <path-widget @confirm="choosePath"></path-widget>
  </el-dialog>
</template>

<style lang="scss" scoped></style>
