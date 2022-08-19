<script lang="ts" setup>
import HeaderWidget from "../components/common/Header.vue";
// import DataList from "./DataList.vue"
import Header from "../entity/Header";
import { computed, getCurrentInstance, onMounted, Ref, ref } from "vue";
import { IRemindInfo } from "../entity/RemindInfo";
import { warn, success } from "../utils/assist";
const header = ref(
  new Header({
    title: "本地git项目管理平台",
  })
);
const request = getCurrentInstance()?.appContext.config.globalProperties.$api;
// 提醒相关数据
const remindType = ref("0");
const remindInterval = ref({
  day: 0,
  hour: 0,
  minutes: 30,
});
const remindDay = ref({
  day: 1,
  hour: 18,
  minutes: 0,
});
const remindWeek = ref({
  day: 5,
  hour: 18,
  minutes: 0,
});

const curRemindInfo = ref({
  id: 0,
  toUser: "",
  method: "wxwork",
});

// const remindInfo = ref({
//   wxwork: {
//     toUser: "",
//   },
//   email: {
//     toUser: "",
//   },
// });
let remindDataList: Array<IRemindInfo> = [];

// 设置提醒信息
const submitRemind = () => {
  // console.log(remindInfo.value.wxwork.toUser);
  // check remind info
  if (remindType.value !== "0" && !curRemindInfo.value.toUser) {
    warn("请填写提醒人");
    return;
  }
  let remindTimeInfo: { day: number; hour: number; minutes: number } = {
    day: 0,
    hour: 0,
    minutes: 0,
  };
  switch (remindType.value) {
    case "interval": {
      remindTimeInfo = remindInterval.value;
      break;
    }
    case "day": {
      remindTimeInfo = remindDay.value;
      break;
    }
    case "week": {
      remindTimeInfo = remindWeek.value;
      break;
    }
  }
  const formData: IRemindInfo = {
    method: curRemindInfo.value.method,
    toUser: curRemindInfo.value.toUser,
    isSend: remindType.value === "0" ? 0 : 1,
    type: remindType.value,
    ...remindTimeInfo,
  };
  if (curRemindInfo.value.id) {
    formData.id = curRemindInfo.value.id;
  }
  request.remind.edit(formData).then((res: Response) => {
    if (res.code === 200) {
      success("修改成功, 5分钟后生效");
      getRemindInfo();
    }
  });
};

// 从数据库获取信息
const getRemindInfo = () => {
  request.remind.info().then((res: Response) => {
    const { data } = res;
    if (data) {
      remindDataList = data;
      changeRemindInfo("wxwork");
      changeRemindInfo("email");
    }
  });
};
const changeRemindInfo = (method: string) => {
  const remindData: IRemindInfo | undefined = remindDataList.find(
    (item: IRemindInfo) => item.method === method
  );
  if (remindData) {
    const { isSend, type } = remindData;
    remindType.value = Boolean(isSend) ? type : "0";
    switch (type) {
      case "interval": {
        remindInterval.value = {
          day: remindData.day || 0,
          hour: remindData.hour || 0,
          minutes: remindData.minutes || 30,
        };
        break;
      }
      case "day": {
        remindDay.value = {
          day: remindData.day || 1,
          hour: remindData.hour || 18,
          minutes: remindData.minutes || 0,
        };
        break;
      }
      case "week": {
        remindWeek.value = {
          day: remindData.day || 5,
          hour: remindData.hour || 18,
          minutes: remindData.minutes || 0,
        };
        break;
      }
    }
    curRemindInfo.value.toUser = remindData.toUser || "";
    curRemindInfo.value.id = remindData.id || 0;
  }
};
getRemindInfo();
</script>

<template>
  <header-widget ref="root" :header="header">
    <el-popover placement="bottom" :width="200" trigger="click">
      <el-tabs
        type="border-card"
        v-model="curRemindInfo.method"
        @tab-change="changeRemindInfo"
      >
        <el-tab-pane name="wxwork">
          <template #label>
            <span class="custom-tabs-label">
              <svg-icon icon="wxwork"></svg-icon>
              <span>企业微信</span>
            </span>
          </template>
          <div class="remind-box">
            <el-radio-group v-model="remindType">
              <div class="remind-type-item">
                <el-radio label="0">无提醒</el-radio>
              </div>
              <div class="remind-type-item">
                <el-radio label="interval">
                  <div class="label">每隔</div>
                  <el-input-number
                    v-model="remindInterval.hour"
                    :disabled="remindType !== 'interval'"
                    controls-position="right"
                    :min="0"
                    :max="23"
                    :step="1"
                  ></el-input-number>
                  <div class="label">小时</div>
                  <el-input-number
                    v-model="remindInterval.minutes"
                    :disabled="remindType !== 'interval'"
                    controls-position="right"
                    :min="0"
                    :max="59"
                    :step="1"
                  ></el-input-number>
                  <div class="label">分钟提醒</div>
                </el-radio>
              </div>
              <div class="remind-type-item">
                <el-radio label="day">
                  <div class="label">每天</div>
                  <el-input-number
                    v-model="remindDay.hour"
                    :disabled="remindType !== 'day'"
                    controls-position="right"
                    :min="0"
                    :max="23"
                    :step="1"
                  ></el-input-number>
                  <div class="label">时</div>
                  <el-input-number
                    v-model="remindDay.minutes"
                    :disabled="remindType !== 'day'"
                    controls-position="right"
                    :min="0"
                    :max="59"
                    :step="1"
                  ></el-input-number>
                  <div class="label">分提醒</div>
                </el-radio>
              </div>
              <div class="remind-type-item">
                <el-radio label="week">
                  <div class="label">每周</div>
                  <el-input-number
                    v-model="remindWeek.day"
                    :disabled="remindType !== 'week'"
                    controls-position="right"
                    :min="1"
                    :max="7"
                    :step="1"
                  ></el-input-number>
                  <el-input-number
                    v-model="remindWeek.hour"
                    :disabled="remindType !== 'week'"
                    controls-position="right"
                    :min="0"
                    :max="23"
                    :step="1"
                  ></el-input-number>
                  <div class="label">时</div>
                  <el-input-number
                    v-model="remindWeek.minutes"
                    :disabled="remindType !== 'week'"
                    controls-position="right"
                    :min="0"
                    :max="59"
                    :step="1"
                  ></el-input-number>
                  <div class="label">分提醒</div>
                </el-radio>
              </div>
            </el-radio-group>
            <div class="remind-content">
              <div class="remind-label">提醒人：</div>
              <el-input v-model="curRemindInfo.toUser"></el-input>
              <el-button type="primary" @click="submitRemind">提交</el-button>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane name="email">
          <template #label>
            <span class="custom-tabs-label">
              <svg-icon icon="email"></svg-icon>
              <span>邮箱</span>
            </span>
          </template>
          邮件设置
        </el-tab-pane>
      </el-tabs>
      <template #reference>
        <svg-icon icon="remind"></svg-icon>
      </template>
    </el-popover>
  </header-widget>
  <div class="main-content">
    <div class="menu-content"></div>
    <div class="show-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main-content {
  flex: 1;
  display: flex;
  align-items: stretch;
  overflow: hidden;
  .menu-content {
    max-width: 200px;
    overflow: auto;
    // background-color: #f5f5f5;
  }
  .show-content {
    flex: 1;
    overflow: hidden;
  }
}

.remind-content {
  display: flex;
  align-items: center;
  margin-top: 1vh;
  padding-top: 1vh;
  border-top: 1px solid #ddd;
  // .remind-label {
  //   flex: 1;
  // }
  .el-input {
    flex: 1;
  }
}
.remind-box .el-radio-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  .remind-type-item {
    margin-top: 5px;
  }
  .el-radio {
    :deep(.el-radio__label) {
      display: flex;
      align-items: center;
    }
  }
  .el-input,
  .el-input-number {
    width: 75px;
    margin-left: 5px;
  }
  :deep(.el-input-number.is-controls-right .el-input__wrapper) {
    padding-left: 6px;
    // padding-right: 35px;
  }
  .label {
    color: #333;
    // margin-right: 5px;
    margin-left: 5px;
  }
}
.custom-tabs-label {
  span {
    margin-left: 5px;
  }
}
</style>
