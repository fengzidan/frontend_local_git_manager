import GitPro from "../../entity/GitPro";
import http from "../axios";

const BASE_URL = "/github";

export async function getData() {
  return http(`${BASE_URL}/list`, "get", {});
}
export async function addData(params: GitPro) {
  const passParams = { ...params };
  delete passParams.gitShell;
  return http(`${BASE_URL}/add`, "post", passParams);
}
export async function editData(params: GitPro) {
  return http(`${BASE_URL}/edit`, "post", params);
}
export async function deleteData(params: GitPro) {
  return http(`${BASE_URL}/delete`, "post", { id: params.id });
}
export async function checkData({ name = "" }) {
  return http(`${BASE_URL}/check`, "get", { name });
}
