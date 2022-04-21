// import Vue from "vue";
/*
 * 1. 引入各个模块下的api请求，api请求按照模块功能划分
 * 2. 各个模块下js文件名为命名空间,
 * 3. 在组件中使用api： this.$api[js文件名][文件内导出的api请求]
 * */
// const apis = {};
// const moduleContext = require.context("./apis/", false, /\.js$/);
// moduleContext.keys().forEach((key) => {
//   const name = key
//     .split("/") // ./map.js
//     .pop() // map.js
//     .replace(/\.\w+$/, ""); // map
//   apis[name] = moduleContext(key);
// });
// Vue.prototype.$api = apis;
// export default apis

// 加载modules
interface modules {
  [idx: string]: any;
}
const modules: modules = {};

const modulesGlob = import.meta.glob("./apis/*.ts");
for (const path in modulesGlob) {
  const res = await modulesGlob[path]();
  const name = path.split("/")[2].replace('.ts', '');
  modules[name] = res;
}
export default modules;

