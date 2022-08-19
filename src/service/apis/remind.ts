import http from "../axios";
/**
   * COS Access Token Controller
   * model = {
    
  }
  */
const BASE_URL = "/remind";

export async function info() {
  return http(`${BASE_URL}/info`, "get", {});
}
export async function edit(data = {}) {
  return http(`${BASE_URL}/edit`, "post", data);
}
export async function checkRemote({ path = "" }) {
  return http(`${BASE_URL}/check/remote`, "post", { path });
}
