import GitPro from "../../entity/GitPro";
import http from "../axios";

const BASE_URL = "/project";

export async function list() {
  return http(`${BASE_URL}/list`, "get", {});
}
export async function addData(params: GitPro) {
  const passParams = { ...params };
  delete passParams.gitShell;
  return http(`${BASE_URL}/add`, "post", passParams);
}
export async function editData(params: GitPro) {
  const passParams = { ...params };
  delete passParams.gitShell;
  return http(`${BASE_URL}/edit`, "post", passParams);
}
export async function deleteData(params: GitPro) {
  return http(`${BASE_URL}/delete`, "post", { id: params.id });
}
export async function info(params: IPath) {
  if (params.isGit) {
    return http(`${BASE_URL}/info/git`, "post", { path: params.path });
  }
  if (params.isSvn) {
    return http(`${BASE_URL}/info/svn`, "post", { path: params.path });
  }
}
export async function batch({ path }: { path: string }) {
  return http(`${BASE_URL}/batch`, "post", { path });
}
