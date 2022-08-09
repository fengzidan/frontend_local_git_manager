import http from "../axios";
/**
   * COS Access Token Controller
   * model = {
    
  }
  */
const BASE_URL = "/file";

// pull/push
export async function list({path = ''}) {
  return http(`${BASE_URL}/list`, "post", { path });
}
export async function parent({path = ''}) {
  return http(`${BASE_URL}/parent`, "post", { path });
}
export async function checkRemote({path = ''}) {
  return http(`${BASE_URL}/check/remote`, "post", { path });
}

