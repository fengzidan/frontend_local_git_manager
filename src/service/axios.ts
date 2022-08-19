/**
 * 封装axios
 * 1. 请求/响应失败后的统一处理错误提示
 * 2. 拦截器
 * 3. 封装axios实例
 */
import axios, { AxiosRequestConfig, Method } from "axios";
import { getStorageToken, clearToken } from "../utils/storage";
import { showLoading, hideLoading, error } from "../utils/assist";
import CODE_LIST from "./code";

const requestError = (status: number, message: string) => {
  if (CODE_LIST.indexOf(`${status}`) >= 0) {
    error(`${status}: ${message || "请求失败"}`);
    return;
  }
  switch (status) {
    case 401:
      error(`${status}: ${message || "尚未登录或token已过期!"}`);
      break;
    case 403:
      error(`${status}: ${message || "没有相关权限"}!`);
      break;
    case 404:
      error(`${status}: ${message || "参数校验失败"}!`);
      break;
    case 500:
      error(`${status}: ${message || "请求失败！"}`);
      break;
    default:
      error(`${message || "请求失败！"}`);
      break;
  }
};

const responseError = (err: { response: any; message: string }) => {
  if (err.response) {
    const { status, statusText } = err.response;
    switch (status) {
      case 400:
        error(`${status}: 参数错误!`);
        break;
      case 401:
        error(`${status}: 未登录!`);
        break;
      case 403:
        error(`${status}: 登录过期!`);
        break;
      case 404:
        error(`${status}: 请求的资源不存在!`);
        break;
      case 413:
        error(`${status}: 请求体过大!`);
        break;
      case 500:
        error(`${status}: 请求失败！`);
        break;
      default:
        if (status >= 500) {
          error(`${statusText}`);
        }
    }
  } else if (err.message.indexOf("timeout") > -1) {
    error("请求超时，请重试！");
  } else {
    error("请求失败！");
  }
};

function setParams(data: any) {
  // const ssoData =
  //   "p3pdYGx6lo7cObus3ZUN0F5dGGxGBGOC%2FRt19AJhn%2Bv7OtmmG1SUdi6XnSbXBp5cOTH1x2JnAgDz7ou70RTtgvu3GD4d2aFcy4KbtpfE%2Bz0wt47g6BOZRBWDSNvesex0319Sxm6VHqX40tMfRgEQUTtZ7%2FDIT0%2FMmFwtRhjBTopwRYSrhwAbgtY4JIFP1X8d0Jee7BsVWszv7O1pDgFBf7aGX%2Bn111O44kDZQ6kWhA8tOe5pJsDxo%2BDlDTdQQxCXimQdTlD0FnR0%2BaakJUFkNrru8hp6IKj5dBntzf3z3pYfAXq3r5IlgLQ4xQ3WyAVKNM4ljK4G8joGeZK2zNVSLw%3D%3D";
  // if (data instanceof FormData) {
  //   data.append("GROUP_SHARE_PLATFORM", getGroup());
  //   data.append("ssoData", ssoData);
  //   data.append("token", getToken(data));
  // } else {
  //   data["GROUP_SHARE_PLATFORM"] = getGroup();
  //   data["ssoData"] = ssoData;
  //   data["token"] = getToken(data);
  // }
  return data;
}

let instance = axios.create({
  baseURL: "/remote",
  timeout: 100 * 1000,
});

/**
 * 请求拦截器
 */
instance.interceptors.request.use(
  (config) => {
    let { url, method } = config;
    switch (url) {
      case "/shell/pull/git":
      case "/shell/push/git":
        break;
      default:
        showLoading();
        break;
    }
    // // post 方法统一用json格式传数据
    // method = method && method.toLowerCase();
    switch (method?.toLowerCase()) {
      case "get": {
        setParams(config.params);
        break;
      }
      case "post":
      default: {
        setParams(config.data);
        break;
      }
    }
    // if (method?.toLowerCase() === "post") {
    //   setParams(config.data);
    // } else {
    //   setParams(config.params);
    // }
    // const token = getStorageToken();
    // // 发送请求时携带token
    // if (token) {
    //   config.headers.Authorization = token;
    // }
    return config;
  },
  (err) => {
    hideLoading();
    responseError(err);
    return Promise.reject(err);
  }
);

/**
 * 响应拦截器
 */
instance.interceptors.response.use(
  (response) => {
    // debugger
    hideLoading();
    if (response.status === 200) {
      if (!response.headers["content-type"]) {
        return response.data;
      }
      switch (response.headers["content-type"]) {
        case "application/octet-stream":
        case "application/vnd.ms-excel;charset=utf-8":
        case "application/vnd.ms-excel;charset=UTF-8":
        case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8":
          return response.data;
      }
      const { code, msg } = response.data;
      switch (code) {
        case 200:
        case 2000:
          return response.data;
        default:
          requestError(code, msg);
      }
      return Promise.reject(response.data);
    }
    return Promise.reject(response);
  },
  (err) => {
    hideLoading();
    responseError(err);
    if (err.response && err.response.status === 401) {
      const token = getStorageToken();
      if (token) {
        clearToken();
      }
    }
    err.error = `${err.stack}\n${err.message}`;
    return Promise.reject(err);
  }
);

/**
 * 封装请求函数
 * @param {*} requestOptions 请求配置{content-type:''}
 * @returns
 */
export default function http(
  url: string,
  method = "GET",
  data = {},
  requestOptions = {}
) {
  const methodUpper: Method = method.toLowerCase() as Method;
  const options: AxiosRequestConfig = {
    url,
    method: methodUpper,
    ...requestOptions,
  };
  switch (methodUpper) {
    case "get":
    case "delete":
      options.params = data;
      break;
    case "post":
    case "put":
    case "patch":
      options.data = data;
      break;
    default:
      break;
  }

  return instance(options);
}
