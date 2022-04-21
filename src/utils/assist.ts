import { ElLoading, ElMessage } from "element-plus";
import { LoadingInstance } from "element-plus/es/components/loading/src/loading";

let loading: LoadingInstance | null = null;

function startLoading() {
  loading = ElLoading.service({
    lock: true,
    text: "加载中……",
    background: "rgba(0, 0, 0, 0.7)",
  });
}

function endLoading() {
  loading && loading.close();
}

/**
 * @description 开启全局loading
 * @returns
 */
let needLoadingRequestCount = 0;
export function showLoading() {
  if (needLoadingRequestCount === 0) {
    startLoading();
  }
  needLoadingRequestCount++;
}

/**
 * @description 隐藏全局loading
 * @returns
 */
export function hideLoading() {
  if (needLoadingRequestCount <= 0) return;
  needLoadingRequestCount--;
  if (needLoadingRequestCount === 0) {
    endLoading();
  }
}

/**
 * @description 警告提示函数
 * @export warn
 * @param {*} message
 */
export function warn(message: string, duration = 2) {
  ElMessage.warning({ message, duration: duration * 1000 });
}

/**
 * @description 错误提示函数
 *
 * @export error
 * @param {*} message
 */
export function error(message: string, duration = 2) {
  // console.log(Vue.$message)
  ElMessage.error({ message, duration: duration * 1000 });
}

/**
 * @description 简单提示函数
 *
 * @export
 * @param {*} message
 */
export function info(message: string, duration = 2) {
  ElMessage.info({ message, duration: duration * 1000 });
}

/**
 *
 * @description 成功提示函数
 * @export success
 * @param {*} message
 * @param {number} [duration=2]
 */
export function success(message: string, duration = 2) {
  ElMessage.success({ message, duration: duration * 1000 });
}
