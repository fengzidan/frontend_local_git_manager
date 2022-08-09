<script lang="ts" setup>
import { computed, getCurrentInstance, onMounted, Ref, ref, warn } from "vue";
import GitPro from "../entity/GitPro";
import { SHELL_STATUS } from "../entity/ShellObj";
import TableWidget from "@/components/TableWidget/index.vue";
import ShellRes from "./ShellRes.vue";
import GitProject from "./GitProject.vue";
import PathWidget from "@/components/PathWidget/Dialog.vue";
import { success } from "../utils/assist";
import { IRemotePro } from "../entity/RemotePro";

const request = getCurrentInstance()?.appContext.config.globalProperties.$api;

// 获取数据
const remoteProList: Ref<Array<GitPro>> = ref([]);
const tableOption: Ref<Array<tableOptionItem>> = ref([
  {
    prop: "name",
    label: "项目名称",
    sortable: true,
    checked: true,
  },
  {
    prop: "branches",
    label: "分支",
    checked: true,
    width: 150,
  },
  {
    prop: "remote",
    label: "git地址",
    checked: false,
  },
  {
    prop: "path",
    label: "本地地址",
    checked: false,
  },
  {
    prop: "status",
    label: "git状态",
    checked: true,
    width: 100,
  },
  {
    prop: "shellStatus",
    label: "命令状态",
    checked: true,
    width: 100,
  },
]);
// 每个项目的当前branch
const remoteBranch = ref({});
const remoteChanged = [
  {
    label: "有变更",
    value: true,
  },
  {
    label: "无",
    value: false,
  },
];
// 根据本地路径筛选
const localPathList = computed(() => {
  const dirSet = new Set(
    remoteProList.value.map((item) => {
      const dirList = item.path.split("/");
      dirList.pop();
      return dirList.join("/");
    })
  );
  return Array.from(dirSet).map((dir) => {
    return {
      label: dir.split("/").pop(),
      value: dir,
    };
  });
});
const getList = () => {
  remoteProList.value = [];
  request.project.list().then((res: Response) => {
    remoteProList.value = res.data.map((item: GitPro) => new GitPro(item));
    remoteProList.value.forEach((item) => {
      remoteBranch.value[item.id] = item.branch;
    });
  });
};
getList();
// 数据过滤、数据排序
const searchLabel = ref("");
const searchStatus: Ref<Array<string>> = ref([]);
const searchPath: Ref<Array<string>> = ref([]);
const sortOption: Array<tableSortOption> = [];
const remoteChangeStatus: Ref<string | boolean> = ref("");
const sortTable = ({ prop, order }: tableSortOption) => {
  const itemIdx = sortOption.findIndex((item) => item.prop === prop);
  if (itemIdx !== -1) {
    sortOption.splice(itemIdx, 1);
  }
  if (order !== null) {
    sortOption.push({ prop, order });
  }
};
// 展示用数据
const tableOptionShow = computed(() => {
  return tableOption.value.filter((item) => item.checked);
});
const remoteProShow = computed(() => {
  let showData: Array<GitPro> = [];
  const dataSrc = [...remoteProList.value];
  showData = dataSrc.filter(
    (item) =>
      item.name.indexOf(searchLabel.value) >= 0 ||
      item.remote.indexOf(searchLabel.value) >= 0 ||
      item.path.indexOf(searchLabel.value) >= 0
  );
  if (searchStatus.value.length > 0) {
    showData = showData.filter(
      (item) =>
        item.gitShell &&
        searchStatus.value.indexOf(`${item.gitShell.status}`) !== -1
    );
  }
  if (sortOption.length > 0) {
    sortOption.forEach(({ prop, order }) => {
      switch (prop) {
        case "name":
          switch (order) {
            case "ascending":
              showData = showData.sort((a, b) => (a.name > b.name ? -1 : 1));
              break;
            case "descending":
              showData = showData.sort((a, b) => (a.name > b.name ? 1 : -1));
              break;
          }
          break;
      }
    });
  }
  if (searchPath.value.length > 0) {
    showData = showData.filter((item) => {
      const dirList = item.path.split("/");
      dirList.pop();
      const dir = dirList.join("/");
      return searchPath.value.indexOf(dir) >= 0;
    });
  }
  if (remoteChangeStatus.value !== "") {
    showData = showData.filter((item) => {
      return item.isChanged === remoteChangeStatus.value;
    });
  }
  return showData;
});

// 新增数据、修改数据
let formData: Ref<GitPro | undefined> = ref(undefined);
const dialogVisible = ref(false);
const editing = ref(false);
const batching = ref(false);
const addItem = () => {
  dialogVisible.value = true;
};
const addBatch = () => {
  batching.value = true;
};
const gitProjectRef = ref();
const editItem = (item: GitPro) => {
  formData.value = item;
  dialogVisible.value = true;
  editing.value = true;
};
const submitData = () => {
  const gitProData = gitProjectRef.value.formData;
  if (editing.value) {
    request.project.editData(gitProData).then((res: Response) => {
      getList();
      dialogVisible.value = false;
    });
    return;
  }
  request.project.addData(gitProData).then((res: Response) => {
    getList();
    dialogVisible.value = false;
  });
};
const submitBatchData = (pathObj: IPath) => {
  request.project.batch(pathObj).then((res: Response) => {
    const { data } = res;
    if (data === true) {
      success("导入成功");
      getList();
    } else {
      warn(
        `以下项目未导入成功：${data
          .map((item: IRemotePro) => item.name)
          .join(", \n")}`
      );
    }
  });
  batching.value = false;
};
const handleClose = (done: () => void) => {
  formData.value = undefined;
  done();
};

// 多选操作
let githubProMul: Array<GitPro> = [];
const selectMulData = (value = []) => {
  githubProMul = value;
};
// 删除数据
const deleteItem = (item: GitPro) => {
  request.project.deleteData(item).then(() => {
    getList();
  });
};
const deleteData = () => {
  githubProMul.forEach((item) => {
    deleteItem(item);
  });
};
// push操作
const pushItem = (item: GitPro) => {
  if (item.gitShell) {
    const { gitShell } = item;
    gitShell.run();
    if (!gitShell.comment) {
      warn("请填写提交描述");
      return;
    }
    request.shell
      .push({
        id: item.id,
        path: item.path,
        branch: item.branch,
        comment: item.gitShell.comment,
      })
      .then((res: Response) => {
        const { data } = res;
        const cmd =
          typeof data.shell !== "string" ? data.shell.join("\n") : data.shell;
        const out = data.result.stdout + "\n" + data.result.stderr;
        if (data.result.error) {
          gitShell.fail({ cmd, out });
        } else {
          gitShell.success({ cmd, out });
          getList();
        }
      })
      .catch((err: { error: string }) => {
        gitShell.fail({ cmd: "服务器错误", out: "fail" });
      });
  }
};
const pushData = () => {
  githubProMul.forEach((item) => {
    pushItem(item);
  });
};
// pull操作
const pullItem = (item: GitPro) => {
  if (item.gitShell) {
    const { gitShell } = item;
    gitShell.run();
    request.shell
      .pull({
        id: item.id,
        path: item.path,
        branch: item.branch,
      })
      .then((res: Response) => {
        const { data } = res;
        const cmd =
          typeof data.shell !== "string" ? data.shell.join("\n") : data.shell;
        const out = data.result.stdout + "\n" + data.result.stderr;
        if (data.result.error) {
          gitShell.fail({ cmd, out });
        } else {
          gitShell.success({ cmd, out });
          getList();
        }
      })
      .catch(() => {
        gitShell.fail({ cmd: "服务器错误", out: "fail" });
      });
  }
};
const pullData = () => {
  githubProMul.forEach((item) => {
    pullItem(item);
  });
};
</script>

<template>
  <div class="main-content">
    <div class="operation-top">
      <div class="left">
        <el-input
          class="left-item"
          v-model="searchLabel"
          placeholder="搜索"
          clearable
        ></el-input>
        <el-select
          class="left-item"
          v-model="remoteChangeStatus"
          placeholder="git状态"
          clearable
        >
          <el-option
            v-for="(item, idx) in remoteChanged"
            :key="idx"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select
          class="left-item"
          v-model="searchStatus"
          multiple
          placeholder="shell状态"
          clearable
        >
          <el-option
            v-for="(item, key) in SHELL_STATUS"
            :key="item.color"
            :label="item.label"
            :value="key"
          />
        </el-select>
        <el-select
          class="left-item"
          v-model="searchPath"
          multiple
          placeholder="本地路径"
          clearable
        >
          <el-option
            v-for="(item, idx) in localPathList"
            :key="idx"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="right">
        <el-dropdown class="right-item">
          <el-button class="btn-multiple" type="primary">
            新增<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="addItem">新增单个项目</el-dropdown-item>
              <el-dropdown-item @click="addBatch"
                >本地批量导入</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-button class="right-item btn-multiple" @click="pushData">
          一键 push</el-button
        >
        <el-button class="right-item btn-multiple" @click="pullData">
          一键 pull</el-button
        >
        <el-button class="right-item btn-delete" @click="deleteData"
          >删除</el-button
        >
        <el-popover placement="bottom" :width="200" trigger="hover">
          <el-checkbox
            v-for="item in tableOption"
            :key="item.prop"
            v-model="item.checked"
            :label="item.label"
          />
          <template #reference>
            <span class="link-span">
              <svg-icon icon="setup"></svg-icon>
            </span>
          </template>
        </el-popover>
        <span class="link-span">
          <svg-icon icon="refresh" @click="getList"></svg-icon>
        </span>
      </div>
    </div>
    <table-widget
      class="table-content"
      :data="remoteProShow"
      :page-show="false"
      @select="selectMulData"
      @sort="sortTable"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column type="index" width="60" align="center" label="序号">
      </el-table-column>
      <el-table-column
        v-for="row in tableOptionShow"
        :key="row.prop"
        :prop="row.prop"
        :label="row.label"
        :width="row.width || 'auto'"
        :align="row.align || 'center'"
        :sortable="row.sortable"
      >
        <template #default="scope">
          <template v-if="row.prop === 'shellStatus'">
            <template v-if="scope.row.gitShell.ifEnd">
              <el-popover placement="bottom" :width="200" trigger="click">
                <shell-res
                  :shell="scope.row.gitShell.shell"
                  :result="scope.row.gitShell.out"
                ></shell-res>
                <template #reference>
                  <el-tag
                    class="tag-status"
                    :style="{
                      color: SHELL_STATUS[`${scope.row.gitShell.status}`].color,
                    }"
                  >
                    {{ SHELL_STATUS[`${scope.row.gitShell.status}`].label }}
                    <svg-icon icon="info"></svg-icon>
                  </el-tag>
                </template>
              </el-popover>
            </template>
            <template v-else>
              <el-tag
                :style="{
                  color: SHELL_STATUS[`${scope.row.gitShell.status}`].color,
                }"
              >
                {{ SHELL_STATUS[`${scope.row.gitShell.status}`].label }}
              </el-tag>
            </template>
          </template>
          <template v-else-if="row.prop === 'status'">
            <el-popover
              v-if="scope.row.isChanged"
              placement="bottom"
              :width="200"
              trigger="click"
            >
              <shell-res
                shell="git status"
                :result="scope.row.status"
              ></shell-res>
              <template #reference>
                <el-tag class="tag-status"
                  >有变更 <svg-icon icon="info"></svg-icon
                ></el-tag>
              </template>
            </el-popover>
            <el-tag v-else style="color: #333;">无</el-tag>
          </template>
          <template v-else-if="row.prop === 'branches'">
            <!-- <el-select v-model="remoteBranch[scope.row.id]"> -->
            <el-select v-model="scope.row.branch">
              <el-option
                v-for="item in scope.row.branches"
                :key="item"
                :value="item"
                :label="item"
              ></el-option>
            </el-select>
          </template>
          <template v-else>
            {{ scope.row[row.prop] || "-" }}
          </template>
        </template>
      </el-table-column>
      <el-table-column label="描述" width="300">
        <template #default="scope">
          <el-input
            v-model="scope.row.gitShell.comment"
            placeholder="提交描述"
            type="textarea"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="270">
        <template #default="scope">
          <el-button
            class="btn-cloud"
            @click="pushItem(scope.row)"
            :disabled="scope.row.gitShell.ifRuning"
          >
            push
          </el-button>
          <el-button
            class="btn-cloud"
            @click="pullItem(scope.row)"
            :disabled="scope.row.gitShell.ifRuning"
          >
            pull
          </el-button>
          <span
            class="link-span link-edit"
            @click="editItem(scope.row)"
            :disabled="scope.row.gitShell.ifRuning"
          >
            <svg-icon icon="edit"></svg-icon>
          </span>
          <span
            class="link-span link-delete"
            @click="deleteItem(scope.row)"
            :disabled="scope.row.gitShell.ifRuning"
          >
            <svg-icon icon="delete"></svg-icon>
          </span>
        </template>
      </el-table-column>
    </table-widget>
  </div>
  <el-dialog
    v-model="dialogVisible"
    title="本地git项目"
    destroy-on-close
    :before-close="handleClose"
  >
    <git-project ref="gitProjectRef" :data="formData"></git-project>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitData">确认</el-button>
      </span>
    </template>
  </el-dialog>
  <path-widget :choosing="batching" @confirm="submitBatchData"></path-widget>
</template>

<style lang="scss" scoped>
.main-content {
  margin: 1vh;
  padding: 2vh;
  // border: 1px solid #ddd;
  box-shadow: 0 0 3px 0 #7371fc63;
  border-radius: 4px;
  .operation-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left,
    .right {
      display: flex;
      align-items: stretch;
      .left-item {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: flex-start;
      }
      .left-item + .left-item {
        margin-left: 12px;
      }
    }
    .right {
      align-items: center;
      justify-content: flex-end;
      .right-item + .right-item {
        margin-left: 12px;
      }
      .link-span {
        font-size: 1.6vh;
      }
    }
  }
  .table-content {
    border: 1px solid #eee;
    margin-top: 1vh;
  }
}
.btn-multiple,
.btn-multiple:hover {
  background-color: #7371fc;
  color: #fff;
}
.btn-cloud,
.btn-cloud:hover {
  background-color: #918ef4;
  color: #fff;
}
.btn-delete,
.btn-delete:hover {
  background-color: #ff6b6b;
  color: #fff;
}
.link-span {
  cursor: pointer;
  margin-left: 12px;
  transition: 0.3s;
  &:hover {
    opacity: 0.8;
  }
}
.link-info {
  color: #00a6fb;
}
.link-edit {
  color: #918ef4;
  min-width: 0vw;
  padding: 0;
}
.link-delete {
  color: #ff6b6b;
  min-width: 0vw;
  padding: 0.2vh;
}
:deep(.el-button) {
  transition: 0.3s;
  &:hover {
    opacity: 0.8;
  }
}
.tag-status {
  cursor: pointer;
}
:deep(.el-table .el-table__cell) {
  font-weight: 500;
}
</style>
