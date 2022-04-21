import { genId } from "../utils/tool";
import GitShell from "./GitShell";
export default class GitPro {
  id? = "";
  name = "";
  gitUrl = "";
  gitBranch = "";
  local = "";

  // shell命令-Git
  gitShell?: GitShell = new GitShell();

  constructor({ id = "", name = "", gitUrl = "", gitBranch = "", local = "" }) {
    this.id = id || genId(10, "git");
    this.name = name;
    this.gitUrl = gitUrl;
    this.gitBranch = gitBranch;
    this.local = local;
    this.gitShell = new GitShell();
    this.gitShell.status = 0;
  }
}
