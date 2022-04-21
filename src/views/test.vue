<script lang="ts" setup>
import { ref } from "vue";
const code = ref("");
code.value = "console.log('hello')";
</script>

<template>
  <highlightjs autodetect :code="code"></highlightjs>
</template>

<style lang="scss" scoped></style>
