<script lang="ts" setup>
import { getCurrentInstance, computed, reactive, Ref, ref, watch } from "vue";

const request = getCurrentInstance()?.appContext.config.globalProperties.$api;

let curPathObj: IPath;
const curPath = ref("");
const folderList: Ref<Array<IPath>> = ref([]);
const pathEditing = ref(false);

const pathList = computed(() => {
  const pathList = curPath.value.split("/");
  if (pathList[pathList.length - 1] === "") {
    pathList.pop();
  }
  return pathList;
});
const showFolderList = computed(() => {
  return folderList.value.filter((item: IPath) => item.isDir);
});

const emits = defineEmits(["confirm"]);

async function getFolder() {
  const params: { path: string } = {
    path: curPath.value || "",
  };
  const res = await request.path.list(params);
  const { path, data } = res.data;
  curPath.value = path;
  folderList.value = data;
  curPathObj = res.data;
}
getFolder();

function changePath(path = curPath.value) {
  curPath.value = path;
  pathEditing.value = false;
  getFolder();
}

function clickPathItem(pathIdx: number) {
  curPath.value = pathList.value.slice(0, pathIdx + 1).join("/");
  getFolder();
}

function confirm() {
  emits("confirm", curPathObj);
}
</script>

<template>
  <div class="folder-select">
    <div class="top-path">
      <el-input
        v-if="pathEditing"
        v-model="curPath"
        @change="changePath(curPath)"
        @blur="changePath(curPath)"
      ></el-input>
      <div class="path-list" v-else>
        <div
          v-for="(name, idx) in pathList"
          :key="idx"
          class="path-item"
          @click="clickPathItem(idx)"
        >
          {{ name === "" ? "/" : name }}
        </div>
        <div
          class="path-item path-other"
          @dblclick="pathEditing = true"
          title="双击编辑"
        >
          <label>双击编辑</label>
          <svg-icon icon="edit" @click="pathEditing = true"></svg-icon>
        </div>
        <div class="path-item path-tool" @click="getFolder">
          <svg-icon icon="refresh"></svg-icon>
        </div>
        <div class="path-item path-button">
          <el-button type="primary" @click="confirm">确定</el-button>
        </div>
      </div>
    </div>
    <template v-if="folderList.length > 0">
      <div class="folder-list">
        <div
          v-for="folder in showFolderList"
          :key="folder.name"
          @click="changePath(folder.path)"
          class="folder-item"
        >
          <svg-icon
            class="folder-item-icon"
            :icon="folder.isDir ? 'folder' : 'file'"
          ></svg-icon>
          <label>{{ folder.name }}</label>
          <svg-icon
            class="folder-type-icon"
            v-if="folder.isNode"
            icon="node"
          ></svg-icon>
          <svg-icon
            class="folder-type-icon"
            v-if="folder.isVue"
            icon="vue"
          ></svg-icon>
          <svg-icon
            class="folder-type-icon"
            v-if="folder.isGit"
            icon="github"
          ></svg-icon>
          <svg-icon
            class="folder-type-icon"
            v-if="folder.isSvn"
            icon="svn"
          ></svg-icon>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.folder-select {
  overflow-x: auto;
  overflow-y: hidden;
  font-size: 14px;
  font-family: Roboto, Avenir, Helvetica, Arial, sans-serif;
  height: 75vh;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  .top-path {
    width: 100%;
    .path-list {
      display: flex;
      align-items: stretch;
      .path-item {
        cursor: pointer;
        background-color: #6499f3;
        padding: 5px;
        margin-left: 3px;
        border-radius: 4px;
        white-space: nowrap;
        display: flex;
        align-items: center;
        justify-content: center;
        color: rgba(255, 255, 255, 1);
      }
      .path-other {
        flex: 1;
        justify-content: flex-end;
        color: rgba(255, 255, 255, 0.7);
        label {
          font-size: 0.8rem;
          margin-right: 5px;
        }
      }
      .path-tool {
        width: 34px;
        height: 34px;
        margin-left: 15px;
        color: rgba(255, 255, 255, 0.7);
        .svg-icon {
          width: 1.5em;
        }
      }
      .path-button {
        margin-left: 5px;
        padding: 0;
        :deep(.el-button) {
          background: #6499f3;
          border: none;
        }
      }
    }
  }
  .folder-list {
    width: 100%;
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-y: auto;
    .folder-item {
      cursor: pointer;
      padding: 15px;
      text-align: left;
      display: flex;
      align-items: center;
      color: #333;
      transition: 0.3s;
      * {
        cursor: inherit;
      }
      label {
        margin-left: 10px;
        cursor: pointer;
      }
      img {
        width: 14px;
        height: 14px;
        position: relative;
        top: 1.5px;
        margin-left: 10px;
      }
      &:hover {
        background-color: #e2e7ee;
      }
      .folder-type-icon {
        margin-left: 0.5vw;
        &:first-child {
          margin-left: 1vw;
        }
      }
    }
  }
}
</style>
