<script lang="ts" setup>
import { FormRules } from "element-plus";
import { computed, reactive, watch } from "vue";
import GitPro from "../entity/GitPro";

const props = defineProps({
  data: {
    type: GitPro,
  },
});

let formData = reactive(
  new GitPro({ name: "", gitUrl: "", gitBranch: "", local: "" })
);
if (props.data) {
  formData = new GitPro(props.data);
}

const rules = reactive<FormRules>({
  name: [
    {
      required: true,
      message: "请输入名称",
      trigger: "blur",
    },
  ],
  local: [
    {
      required: true,
      message: "请输入本地路径",
      trigger: "blur",
    },
  ],
  gitUrl: [
    {
      required: true,
      message: "请输入git地址",
      trigger: "blur",
    },
  ],
  gitBranch: [
    {
      required: true,
      message: "请输入git分支",
      trigger: "blur",
    },
  ],
});
defineExpose({ formData });
</script>

<template>
  <el-form :model="formData" :rules="rules" label-width="120px">
    <el-form-item label="名称" prop="name">
      <el-input v-model="formData.name"></el-input>
    </el-form-item>
    <el-form-item label="本地地址" prop="local">
      <el-input v-model="formData.local"></el-input>
    </el-form-item>
    <el-form-item label="git地址" prop="gitUrl">
      <el-input v-model="formData.gitUrl"></el-input>
    </el-form-item>
    <el-form-item label="git分支" prop="gitBranch">
      <el-input v-model="formData.gitBranch"></el-input>
    </el-form-item>
  </el-form>
</template>

<style lang="scss" scoped></style>
