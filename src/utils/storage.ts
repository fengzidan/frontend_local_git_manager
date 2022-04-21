/**
 * 存储信息相关的封装
 * 1. token
 * 2. cookie
 * 3. 根据不同选择localStorage/sessionStorage/cookie等数据存储相关封装，默认localstorage
 * 4. userInfo
 */
const tokenKey = "token";

export function saveToken(token: string) {
  sessionStorage.setItem(tokenKey, `${token}`);
}

export function getStorageToken() {
  return sessionStorage.getItem(tokenKey);
}

export function clearToken() {
  sessionStorage.removeItem(tokenKey);
  clearUserInfo();
}

/**
 * 创建cookie
 */
function setCookie(cname: string, cvalue: string, exdays: number) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  const expires = `expires${d.toUTCString()}`;
  document.cookie = `${cname}=${cvalue}; ${expires}`;
}

/**
 * 获取cookie
 */
function getCookie(cname: string) {
  const name = `${cname}=`;
  const ca = document.cookie.split("; ");
  for (let i = 0; i < ca.length; i++) {
    const c = ca[i].trim();
    if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
  }
  return "";
}

/**
 * 删除cookie
 */
function delCookie(name: string) {
  const exp = new Date();
  exp.setTime(exp.getTime() - 1);
  const cval = getCookie(name);
  if (cval !== null) {
    const expires = `expires${exp.toUTCString()}`;
    document.cookie = `${name}=${cval}; ${expires}`;
  }
}

/**
 * 清空所有cookie
 */
function delAllCookie() {
  const arrCookie = document.cookie.split("; "); // 将多个cookie分割成多个键值对
  for (let i = 0; i < arrCookie.length; i++) {
    const arr = arrCookie[i].split("=");
    if (arr.length > 0) {
      delCookie(arr[0]);
    }
  }
}

/**
 * 设置存储数据
 * webStorage: 规定要存储在哪里，值有localStorage/sessionStorage/cookie，默认为localStorage
 * key: 存储的键名
 * value: 存储的值
 * exdays: 设置cookie过期时间
 */
interface StorageOption {
  webStorage: string;
  key: string;
  value: string;
  exdays: number;
}
export function setItem(param: StorageOption) {
  switch (param.webStorage) {
    case "session":
      sessionStorage.setItem(param.key, param.value);
      break;
    case "cookie":
      setCookie(param.key, param.value, param.exdays);
      break;
    case "localStorage":
      localStorage.setItem(param.key, param.value);
      break;
    default:
      localStorage.setItem(param.key, param.value);
  }
}

/**
 * 获取存储数据
 * webStorage: 规定要存储在哪里，值有localStorage/sessionStorage/cookie，默认为localStorage
 * key: 存储的键名
 */
export function getItem(param: StorageOption) {
  switch (param.webStorage) {
    case "session":
      return sessionStorage.getItem(param.key);
    case "cookie":
      return getCookie(param.key);
    case "localStorage":
      return localStorage.getItem(param.key);
    default:
      return localStorage.getItem(param.key);
  }
}

/**
 * 删除指定的存储数据
 * webStorage: 规定要存储在哪里，值有localStorage/sessionStorage/cookie，默认为localStorage
 * key: 存储的键名
 */
export function removeItem(param: StorageOption) {
  switch (param.webStorage) {
    case "session":
      sessionStorage.removeItem(param.key);
      break;
    case "cookie":
      delCookie(param.key);
      break;
    case "localStorage":
      localStorage.removeItem(param.key);
      break;
    default:
      localStorage.removeItem(param.key);
  }
}

/**
 * 清空存储数据
 * webStorage: 规定要存储在哪里，值有localStorage/sessionStorage/cookie，默认为localStorage
 */
export function clearItems(param: StorageOption) {
  switch (param.webStorage) {
    case "session":
      sessionStorage.clear();
      break;
    case "cookie":
      delAllCookie();
      break;
    case "localStorage":
      localStorage.clear();
      break;
    default:
      localStorage.clear();
  }
}

export function saveUseInfo(userInfo: any) {
  sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
}

export function getUserInfo() {
  const data = sessionStorage.getItem("userInfo");
  return data ? JSON.parse(data) : null;
}

export function clearUserInfo() {
  return sessionStorage.removeItem("userInfo");
}
