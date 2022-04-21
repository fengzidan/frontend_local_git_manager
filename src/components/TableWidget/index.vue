<script lang="ts" setup>
import { computed, ref, Ref } from "vue";
import GitPro from "../../entity/GitPro";
import type { ElTable } from "element-plus";

const multipleSelection: Ref<Array<GitPro>> = ref([]);
const props = defineProps({
  data: {
    type: Array,
    required: true,
    default: () => {
      return [];
    },
  },
  pageOption: {
    type: Object,
    default: () => {
      return {
        total: 0,
        pageSize: 10,
        pageNum: 1,
      };
    },
  },
  pageShow: {
    type: Boolean,
    default: true,
  },
});
const emits = defineEmits(["select", "change", "sort"]);
const pageNum = computed(() => props.pageOption.pageNum);
const pageSize = computed(() => props.pageOption.pageSize);
const total = computed(() => props.pageOption.total);

const multipleTableRef = ref<InstanceType<typeof ElTable>>();
const handleSelectionChange = (selection = []) => {
  multipleSelection.value = selection;
  emits("select", selection);
};
const handleSizeChange = (pageSize: Number) => {
  emits("change", pageNum, pageSize);
};
const handleCurrentChange = (pageNum: Number) => {
  emits("change", pageNum, pageSize);
};
const handleSort = ({ prop, order }: tableSortOption) => {
  emits("sort", { prop, order });
};
const handleClickRow = (row: any) => {
  const rowIdx = multipleSelection.value.findIndex(
    (item) => item.name === row.name && item.id === row.id
  );
  multipleTableRef.value?.toggleRowSelection(row, rowIdx === -1);
};
</script>

<template>
  <div class="table-widget">
    <el-table
      ref="multipleTableRef"
      :data="data"
      @selection-change="handleSelectionChange"
      @sort-change="handleSort"
      @row-click="handleClickRow"
    >
      <slot></slot>
    </el-table>

    <el-pagination
      v-if="pageShow"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<style lang="scss" scoped>
.table-widget {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  .el-table {
    width: 100%;
    flex: 1;
    border: none;
    border-bottom: none;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    :deep(.el-table__header-wrapper) {
      flex-shrink: 0;
    }
    :deep(.el-table__body-wrapper) {
      flex: 1;
      width: 100%;
      overflow-y: auto;
    }
  }
  .el-pagination {
    width: 100%;
    height: 30px;
    margin-top: 14px;
    text-align: right;
  }
}
</style>
