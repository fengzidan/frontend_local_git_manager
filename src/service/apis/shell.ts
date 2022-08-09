import GitPro from "../../entity/GitPro";
import http from "../axios";
/**
   * COS Access Token Controller
   * model = {
    
  }
  */
const BASE_URL = "/shell";

// pull/push
export async function push(params: GitPro) {
  return http(`${BASE_URL}/push/git`, "post", params);
}
export async function pull(params: GitPro) {
  return http(`${BASE_URL}/pull/git`, "post", params);
}
export async function getGit({ local = "" }) {
  return http(`${BASE_URL}`, "post", { local });
}
export async function getBranch({ local = "" }) {
  return http(`${BASE_URL}`, "post", { local });
}
