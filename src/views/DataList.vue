<script lang="ts" setup>
import { computed, getCurrentInstance, onMounted, Ref, ref } from "vue";
import GitPro from "../entity/GitPro";
import { SHELL_STATUS } from "../entity/GitShell";
import TableWidget from "@/components/TableWidget/index.vue";
import ShellRes from "./ShellRes.vue";
import GitProject from "./GitProject.vue";

const request = getCurrentInstance()?.appContext.config.globalProperties.$api;

// 获取数据
const githubProList: Ref<Array<GitPro>> = ref([]);
const tableOption: Array<tableOptionItem> = [
  {
    prop: "name",
    label: "项目名称",
    sortable: true,
  },
  {
    prop: "github",
    label: "(分支)git地址",
  },
  {
    prop: "local",
    label: "本地地址",
  },
  {
    prop: "status",
    label: "状态",
  },
];
const getList = () => {
  githubProList.value = [];
  request.project.getData().then((res: Response) => {
    githubProList.value = res.data.map((item: GitPro) => new GitPro(item));
  });
};
getList();
// 数据过滤、数据排序
const searchLabel = ref("");
const searchStatus: Ref<Array<string>> = ref([]);
const sortOption: Array<tableSortOption> = [];
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
const githubProShow = computed(() => {
  let showData: Array<GitPro> = [];
  const dataSrc = [...githubProList.value];
  showData = dataSrc.filter(
    (item) =>
      item.name.indexOf(searchLabel.value) >= 0 ||
      item.gitUrl.indexOf(searchLabel.value) >= 0 ||
      item.local.indexOf(searchLabel.value) >= 0
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
  return showData;
});

// 新增数据、修改数据
let formData: Ref<GitPro | undefined> = ref(undefined);
const dialogVisible = ref(false);
const editing = ref(false);
const addItem = () => {
  dialogVisible.value = true;
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
      gitShell.comment = "提交";
    }
    request.shell
      .push(item)
      .then((res: Response) => {
        const { data } = res;
        const out = data.out + "\n" + data.stderr;
        if (data.err) {
          gitShell.fail({ cmd: data.cmd, out });
        } else {
          gitShell.success({ cmd: data.cmd, out });
        }
      })
      .catch((err: { error: string }) => {
        gitShell.fail({ cmd: "git push one", out: err.error });
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
      .pull(item)
      .then((res: Response) => {
        const { data } = res;
        const out = data.out + "\n" + data.stderr;
        if (data.err) {
          gitShell.fail({ cmd: data.cmd, out });
        } else {
          gitShell.success({ cmd: data.cmd, out });
        }
      })
      .catch(() => {
        gitShell.fail({ cmd: "git pull one", out: "fail" });
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
        ></el-input>
        <el-select
          class="left-item"
          v-model="searchStatus"
          multiple
          collapse-tags
          collapse-tags-tooltip
          placeholder="状态"
        >
          <el-option
            v-for="(item, key) in SHELL_STATUS"
            :key="item.color"
            :label="item.label"
            :value="key"
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
              <el-dropdown-item>本地批量导入</el-dropdown-item>
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
      </div>
    </div>
    <table-widget
      class="table-content"
      :data="githubProShow"
      :page-show="false"
      @select="selectMulData"
      @sort="sortTable"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column type="index" width="60" align="center" label="序号">
      </el-table-column>
      <el-table-column
        v-for="row in tableOption"
        :key="row.prop"
        :prop="row.prop"
        :label="row.label"
        :width="row.width || 'auto'"
        :align="row.align || 'center'"
        :sortable="row.sortable"
      >
        <template #default="scope">
          <template v-if="row.prop === 'github'">
            ({{ scope.row.gitBranch }}){{ scope.row.gitUrl }}
          </template>
          <template v-else-if="row.prop === 'status'">
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
          <template v-else>
            {{ scope.row[row.prop] || "-" }}
          </template>
        </template>
      </el-table-column>
      <el-table-column label="描述">
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
      .left-item + .left-item {
        margin-left: 12px;
      }
    }
    .right {
      justify-content: flex-end;
      .right-item + .right-item {
        margin-left: 12px;
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
