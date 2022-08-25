/*
 * @Author: bobokaka
 * @Date: 2021-12-22 21:58:24
 * @LastEditTime: 2021-12-22 23:58:54
 * @LastEditors: bobokaka
 * @Description: chooseIcon导出，用于全局注册
 * @FilePath: \vue3-element-ui-baseline\src\components\baseline\chooseIcon\src\index.ts
 */
import { App } from "vue";
import SvgIcon from "./icon.vue";

export { SvgIcon };

//组件可通过use的形式使用
export default {
  SvgIcon,
  install(app: App) {
    app.component("svg-icon", SvgIcon);
  },
};
