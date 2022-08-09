<script lang="ts" setup>
import { FormRules } from "element-plus";
import { getCurrentInstance, computed, ref, reactive, watch } from "vue";
import GitPro from "../entity/GitPro";
import PathWidget from "@/components/PathWidget/Dialog.vue";
import { warn } from "../utils/assist";

const request = getCurrentInstance()?.appContext.config.globalProperties.$api;

const props = defineProps({
  data: {
    type: GitPro,
  },
});

let formData = reactive(
  new GitPro({ name: "", remote: "", branch: "", path: "" })
);
if (props.data) {
  formData = reactive(new GitPro(props.data));
}

const rules = reactive<FormRules>({
  name: [
    {
      required: true,
      message: "请输入名称",
      trigger: "blur",
    },
  ],
  path: [
    {
      required: true,
      message: "请输入本地路径",
      trigger: "blur",
    },
  ],
  remote: [
    {
      required: true,
      message: "请输入git地址",
      trigger: "blur",
    },
  ],
  branch: [
    {
      required: true,
      message: "请输入git分支",
      trigger: "blur",
    },
  ],
});
defineExpose({ formData });

const choosing = ref(false);
function choosePath(pathObj: IPath) {
  console.log(pathObj);
  if (!pathObj.isGit && !pathObj.isSvn) {
    warn("选择的地址不是远程地址(git或svn), 请查询选择");
    return;
  }
  request.project.info(pathObj).then((res) => {
    const { data } = res;
    const gitPro = data.data;
    formData.path = gitPro.path;
    formData.name = gitPro.name;
    formData.remote = gitPro.remote;
    formData.branch = gitPro.branch;
    formData.branches = gitPro.branches;
  });
  choosing.value = false;
}
</script>

<template>
  <el-form :model="formData" :rules="rules" label-width="120px">
    <el-form-item label="本地地址" prop="path">
      <el-input v-model="formData.path" readonly @click="choosing = true">
        <template #append>
          <svg-icon icon="folder" @click="choosing = true"></svg-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="名称" prop="name">
      <el-input v-model="formData.name"></el-input>
    </el-form-item>
    <el-form-item label="远程地址" prop="remote">
      <el-input v-model="formData.remote"></el-input>
    </el-form-item>
    <el-form-item label="远程分支" prop="branch">
      <el-input v-model="formData.branch"></el-input>
    </el-form-item>
  </el-form>
  <path-widget :choosing="choosing" @confirm="choosePath"></path-widget>
</template>

<style lang="scss" scoped>
:deep(.el-input-group__append) {
  padding: 9px;
  cursor: pointer;
}
</style>
