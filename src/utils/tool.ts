import { validateImg } from "./validate";

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

export function getImg(src = "") {
  if (validateImg(src)) {
    return src.startsWith("http") ? src : require(src);
  } else {
    return false;
  }
}
