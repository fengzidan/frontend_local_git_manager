import { genId } from "../utils/tool";

export interface IRemotePro {
  id?: number | string;
  name: string;
  path?: string;
  remote?: string;
  branch?: string;
  branches?: string;
  status?: string;
}

export default class RemotePro implements IRemotePro {
  id?: number | string;
  path = "";
  name = "";
  remote = "";
  branch?: string = "";
  branches?: string = "";
  // branchList: Array<string> = [];
  status = "";
  isChanged = false;

  // status?: number;

  constructor({
    id = "",
    path = "",
    name = "",
    remote = "",
    branch = "",
    branches = "",
    status = "",
  }: IRemotePro) {
    this.id = id || genId(10, "git");
    this.path = path;
    this.name = name;
    this.remote = remote;
    if (branch) {
      this.branch = branch;
    }
    if (branches) {
      this.branches = branches;
      // this.branchList = branches.split(",");
    }
    this.status = status;
    this.isChanged = this.status.includes('变更')
  }
}
