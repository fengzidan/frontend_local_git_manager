import { validateImg } from "./validate";
import { ExtendDom, ExtendedHTMLBodyElement, EventDom } from "../document.d";

/**
 * @function 获取一个随机ID
 * @param length 随机ID的长度
 * @param prefix 给ID一个前缀
 * @description ID包含数字、大写字母、小写字母
 * @author zhangzedan
 * @date 2022-03-01
 */
export function genId(length = 6, prefix = "") {
  const randomStr =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const randList = [];
  for (let i = 0; i < length; i++) {
    const idx = getRandom(0, randomStr.length + 1);
    randList.push(randomStr[idx]);
  }
  return `${prefix}-${randList.join("")}`;
}

/**
 * @function 获取一个随机整数
 * @param min 默认是0
 * @param max 默认是10
 * @description 随机数范围包含min，不包含max
 * @author zhangzedan
 * @date 2022-03-01
 */
export function getRandom(min = 0, max = 10) {
  return Math.floor(Math.random() * (max - min) + min);
}

/**
 *
 * @param {Document} element HTML 元素
 * @param {string} type 事件类型
 * @param {function} handler 事件函数
 * @param {boolean} capture 冒泡，默认false
 * @returns
 */
export function addEventListener(
  element: EventDom,
  type: string,
  handler: () => void,
  capture = false
): { remove: () => void } {
  if (element.addEventListener) {
    element.addEventListener(type, handler, capture);
  } else {
    element.attachEvent(`on${type}`, handler, capture);
  }
  return {
    remove: () => {
      if (element.removeEventListener) {
        element.removeEventListener(type, handler, capture);
      } else {
        element.detachEvent(`on${type}`, handler, capture);
      }
    },
  };
}

/**
 * 判断全屏情况
 * @returns {Boolean} 是否全屏
 */
export function checkFull() {
  const dom: ExtendDom | ExtendedHTMLBodyElement = document;
  return (
    dom.fullscreenElement ||
    dom.msFullscreenElement ||
    dom.mozFullScreenElement ||
    dom.webkitFullscreenElement ||
    false
  );
}

export function getImg(src = "") {
  if (validateImg(src)) {
    return src.startsWith("http") ? src : require(src);
  } else {
    return false;
  }
}
