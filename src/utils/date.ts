/**
 * 转换Date类型为指定时间格式 yyyyMMdd hh:mm:ss
 * @param {*} fmt 指定时间格式
 * @returns
 */
interface dateReg {
  [idx: string]: number;
}
export function dateToString(this: Date, fmt: string) {
  const o: dateReg = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds(), //毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + "").substring(4 - RegExp.$1.length)
    );
  }
  for (const k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1
          ? `${o[k]}`
          : `00${o[k]}`.substring(`${o[k]}`.length)
      );
    }
  }
  return fmt;
}
/**
 * 转换字符串为日期类型 字符串格式为：yyyy-MM-dd hh:mm:ss，分隔符默认为-
 * @param {*} data 指定时间格式
 * @returns
 */
export function stringToDate(dateStr: string, separator = "-") {
  const [beforeStr, afterStr] = dateStr.split(" ");
  if (!separator) {
    separator = "-";
  }
  // 获取年月日
  const dateArr = beforeStr.split(separator);
  const year = parseInt(dateArr[0]);
  let month;
  if (dateArr[1].indexOf("0") == 0) {
    month = parseInt(dateArr[1].substring(1));
  } else {
    month = parseInt(dateArr[1]);
  }
  const day = parseInt(dateArr[2]);
  let date = new Date(year, month - 1, day);
  // 获取时分秒
  if (afterStr) {
    const timeArr = afterStr.split(":");
    let hour, minute, seconds;
    if (dateArr[0].indexOf("0") == 0) {
      hour = parseInt(timeArr[0].substring(1));
    } else {
      hour = parseInt(timeArr[0]);
    }
    if (dateArr[1].indexOf("0") == 0) {
      minute = parseInt(timeArr[1].substring(1));
    } else {
      minute = parseInt(timeArr[1]);
    }
    if (dateArr[2].indexOf("0") == 0) {
      seconds = parseInt(timeArr[2].substring(1));
    } else {
      seconds = parseInt(timeArr[2]);
    }
    date = new Date(year, month - 1, day, hour, minute, seconds);
  }
  return date;
}

/**
 * 将秒数据转换为指定格式 默认: hh:mm:ss
 */
export function secondsToString(this: number, fmt = "hh:mm:ss") {
  const hour = Math.floor(this / (60 * 60));
  const minute = Math.floor((this - hour * (60 * 60)) / 60);
  const seconds = Math.floor(this - hour * (60 * 60) - minute * 60);
  const o: dateReg = {
    "h+": hour, //小时
    "m+": minute, //分
    "s+": seconds, //秒
  };
  for (const k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1
          ? `${o[k]}`
          : `00${o[k]}`.substring(`${o[k]}`.length)
      );
    }
  }
  return fmt;
}
