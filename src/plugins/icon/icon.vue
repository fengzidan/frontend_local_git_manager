<template>
  <svg :class="svgClass" aria-hidden="true" @click="emits('click')">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script setup>
import { computed } from "@vue/runtime-core";
const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  className: {
    type: String,
    default: "",
  },
});
const iconName = computed(() => `#icon-${props.icon}`);
const svgClass = computed(() => {
  if (props.className) {
    return "svg-icon " + props.className;
  } else {
    return "svg-icon";
  }
});
const emits = defineEmits(["click"]);
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
  color: inherit;
}
</style>
