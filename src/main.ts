import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
// import plugins from "./plugins";
import service from "./service";
import { dateToString, stringToDate, secondsToString } from "./utils/date";
import "highlight.js/styles/atom-one-dark.css";
import "highlight.js/lib/common";
import hljsVuePlugin from "@highlightjs/vue-plugin";
import SvgIcon from './components/icon/index'

const app = createApp(App);
// components
app.use(hljsVuePlugin);
app.use(SvgIcon);
// filter
app.config.globalProperties.$dateToString = (
  val: Date | string,
  fmt = "yyyy-MM-dd"
) => {
  if (val instanceof Date) {
    return dateToString.call(val, fmt);
  }
  return dateToString.call(
    new Date(val?.substring(0, 10) || "1990-01-01"),
    fmt
  );
};
app.config.globalProperties.$stringToDate = (val: string, separator = "-") => {
  if (val) {
    return stringToDate(val || "1990-01-01", separator);
  }
  return val;
};
app.config.globalProperties.$secondsToString = (
  val: number | string,
  fmt = "mm:ss"
) => {
  return secondsToString.call(parseInt(val.toString()), fmt);
};
// app.config.globalProperties[`$${key}`] = filter[key];

// for (let key in plugins) {
//   const pluginContent = plugins[key];
//   const { component, comp, filter, directive } = pluginContent;
//   if (component || comp) {
//     let comps = component || comp
//     for (let key in comps) {
//       app.component(key, comps[key]);
//     }
//   }
//   if (filter) {
//     for (let key in filter) {
//       app.config.globalProperties[`$${key}`] = filter[key];
//     }
//   }
//   if (directive) {
//     for (let key in directive) {
//       app.use(directive[key]);
//     }
//   }
// }
app.config.globalProperties.$api = service;
app.use(router).mount("#app");
// createApp(App).mount('#app')
