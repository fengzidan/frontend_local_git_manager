import SvgIcon from "./icon.vue"; // svg组件
import 'virtual:svg-icons-register'
// 读取所有svg文件
// const requireAll = (requireContext) =>
//   requireContext.keys().map(requireContext);
// const req = require.context("./svg", false, /\.svg$/);
// requireAll(req);

export default (Vue: any) => {
    Vue.component('SvgIcon', SvgIcon)
}
// export default { component: { SvgIcon } };
